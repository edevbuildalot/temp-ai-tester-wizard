import { NextResponse } from "next/server";

interface GenerateRequest {
  code: string;
  language?: string;
  framework?: string;
}

const SYSTEM_PROMPT = `You are a test generation wizard. Given a code snippet, generate comprehensive test cases.

Rules:
- Generate real, runnable test assertions
- Cover happy path, edge cases, and error conditions
- Use the appropriate testing framework (Jest, Vitest, etc.)
- Return ONLY valid JSON with no markdown formatting, no code fences, no explanation
- Be concise but thorough

Return JSON in this exact shape:
{
  "tests": [
    {
      "name": "test description",
      "code": "the actual test code"
    }
  ],
  "framework": "jest | vitest | etc",
  "summary": "brief description of what the tests cover"
}`;

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.code || body.code.trim().length === 0) {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const language = body.language || "auto-detect";
    const framework = body.framework || "auto-detect";

    const prompt = `Generate test cases for this ${language} code (testing framework: ${framework}):

\`\`\`
${body.code}
\`\`\``;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate tests from AI provider" },
        { status: 502 },
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 },
      );
    }

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
