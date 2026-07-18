import puppeteer from 'puppeteer';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { generateId } from './id.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '../../data/screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TestResult {
  passed: boolean;
  summary: string;
  details: string;
  screenshotPath: string;
}

export async function runTest(url: string, prompt: string, userId: string): Promise<TestResult> {
  const runId = generateId();

  db.prepare('INSERT INTO test_runs (id, user_id, url, prompt, status) VALUES (?, ?, ?, ?, ?)').run(
    runId, userId, url, prompt, 'running'
  );

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const consoleLogs: string[] = [];
    page.on('console', (msg) => consoleLogs.push(msg.text()));

    const networkErrors: string[] = [];
    page.on('requestfailed', (req) => {
      networkErrors.push(`${req.url()} failed: ${req.failure()?.errorText}`);
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const pageTitle = await page.title();
    const pageContent = await page.evaluate(() => {
      return document.body?.innerText?.substring(0, 10000) || '';
    });

    const screenshotName = `${runId}.png`;
    const screenshotPath = path.join(screenshotsDir, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await browser.close();

    const evaluation = await evaluateWithLLM(url, prompt, pageTitle, pageContent, consoleLogs, networkErrors);

    const resultJson = JSON.stringify({
      pageTitle,
      consoleLogs: consoleLogs.slice(0, 50),
      networkErrors: networkErrors.slice(0, 20),
      llmEvaluation: evaluation,
    });

    db.prepare(
      'UPDATE test_runs SET status = ?, result = ?, screenshot_path = ?, completed_at = datetime(\'now\') WHERE id = ?'
    ).run('completed', resultJson, screenshotName, runId);

    return {
      passed: evaluation.passed,
      summary: evaluation.summary,
      details: evaluation.details,
      screenshotPath: screenshotName,
    };
  } catch (error: any) {
    if (browser) await browser.close().catch(() => {});

    const errorJson = JSON.stringify({ error: error.message || 'Unknown error' });
    db.prepare(
      'UPDATE test_runs SET status = ?, result = ?, completed_at = datetime(\'now\') WHERE id = ?'
    ).run('failed', errorJson, runId);

    return {
      passed: false,
      summary: 'Test execution failed',
      details: error.message || 'Unknown error occurred during test execution',
      screenshotPath: '',
    };
  }
}

async function evaluateWithLLM(
  url: string,
  userPrompt: string,
  pageTitle: string,
  pageContent: string,
  consoleLogs: string[],
  networkErrors: string[]
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a QA test evaluator. Given a URL, a test prompt, and the page data, determine if the test passes or fails.
Return JSON with: "passed" (boolean), "summary" (short one-line result), "details" (detailed explanation of what was found and whether it meets the criteria). Be objective and specific.`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          url,
          testPrompt: userPrompt,
          pageTitle,
          pageContent,
          consoleLogs: consoleLogs.slice(0, 50),
          networkErrors: networkErrors.slice(0, 20),
        }),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || '{"passed": false, "summary": "LLM evaluation failed", "details": "No response from AI"}';
  return JSON.parse(content);
}