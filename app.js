(function() {
  'use strict';

  const DOM = {
    input: document.getElementById('promptInput'),
    clearBtn: document.getElementById('clearBtn'),
    pasteBtn: document.getElementById('pasteBtn'),
    charCount: document.getElementById('charCount'),
    tokenCount: document.getElementById('tokenCount'),
    totalChars: document.getElementById('totalChars'),
    wordCount: document.getElementById('wordCount'),
    sentenceCount: document.getElementById('sentenceCount'),
    costTable: document.getElementById('costTable'),
    costModeInput: document.getElementById('costModeInput'),
    costModeOutput: document.getElementById('costModeOutput'),
    insightsList: document.getElementById('insightsList'),
  };

  const MODEL_RATES = {
    'GPT-4o':              { input: 2.50,  output: 10.00 },
    'GPT-4o Mini':         { input: 0.15,  output: 0.60 },
    'Claude 3.5 Sonnet':   { input: 3.00,  output: 15.00 },
    'Claude 3.5 Haiku':    { input: 0.80,  output: 4.00 },
    'Gemini 2.0 Flash':    { input: 0.10,  output: 0.40 },
    'Gemini 1.5 Pro':      { input: 1.25,  output: 5.00 },
  };

  let costMode = 'input';

  // Rough token estimation: ~4 chars per token for English text
  function estimateTokens(text) {
    if (!text) return 0;
    const cleaned = text.trim();
    if (!cleaned) return 0;
    return Math.ceil(cleaned.length / 4);
  }

  function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }

  function countSentences(text) {
    if (!text.trim()) return 0;
    const matches = text.match(/[.!?]+/g);
    return matches ? matches.length : 0;
  }

  function getPromptQuality(text) {
    const insights = [];
    const trimmed = text.trim();

    if (!trimmed) return [{ type: 'idle', text: 'Enter text above to see prompt quality insights' }];

    // Check length
    if (trimmed.length < 50) {
      insights.push({ type: 'warn', text: 'Very short prompt — consider adding context, examples, or constraints' });
    } else if (trimmed.length > 4000) {
      insights.push({ type: 'warn', text: 'Long prompt — may exceed context windows or increase cost significantly' });
    } else {
      insights.push({ type: 'good', text: 'Good length for a typical prompt' });
    }

    // Check for role/instruction
    if (!/\b(your\s+(role|task|job|goal)|you\s+are|act\s+as|you\'?re\s+(a|an)|system\s*:)/i.test(trimmed)) {
      insights.push({ type: 'warn', text: 'No role or system instruction detected — consider setting context' });
    } else {
      insights.push({ type: 'good', text: 'Role or system instruction detected' });
    }

    // Check for examples
    if (/\b(example|e\.g\.|for instance|such as|like this|input\s*:|output\s*:)\b/i.test(trimmed)) {
      insights.push({ type: 'good', text: 'Examples detected — helps constrain output format' });
    } else {
      insights.push({ type: 'warn', text: 'No examples found — adding few-shot examples can improve output quality' });
    }

    // Check for output format specification
    if (/\b(output|format|respond|answer|return|give me|list|json|markdown|table|bullet|step)\b/i.test(trimmed)) {
      insights.push({ type: 'good', text: 'Output format specified — helps get structured responses' });
    } else {
      insights.push({ type: 'warn', text: 'No output format specified — model may not match your desired structure' });
    }

    // Check for constraints
    if (/\b(limit|max|within|under|at most|exactly|no more than|concise|brief|short|detailed|comprehensive|500 words|100 words|paragraph|sentence)\b/i.test(trimmed)) {
      insights.push({ type: 'good', text: 'Length/scope constraints detected' });
    }

    return insights;
  }

  function updateCosts(tokens) {
    const rows = DOM.costTable.querySelectorAll('.cost-row');
    rows.forEach(row => {
      const name = row.querySelector('.model-name').textContent.trim();
      const rates = MODEL_RATES[name];
      if (!rates) return;
      const rate = costMode === 'input' ? rates.input : rates.output;
      const cost = (tokens / 1000) * rate;
      const costEl = row.querySelector('.model-cost');
      costEl.textContent = '$' + cost.toFixed(5);
    });
  }

  function update() {
    const text = DOM.input.value;
    const tokens = estimateTokens(text);
    const chars = text.length;
    const words = countWords(text);
    const sentences = countSentences(text);

    DOM.charCount.textContent = chars + ' characters';
    DOM.tokenCount.textContent = tokens.toLocaleString();
    DOM.totalChars.textContent = chars.toLocaleString();
    DOM.wordCount.textContent = words.toLocaleString();
    DOM.sentenceCount.textContent = sentences.toLocaleString();

    updateCosts(tokens);

    const insights = getPromptQuality(text);
    DOM.insightsList.innerHTML = insights.map(i =>
      `<div class="insight-item insight-${i.type}">${i.text}</div>`
    ).join('');
  }

  function setCostMode(mode) {
    costMode = mode;
    DOM.costModeInput.classList.toggle('active', mode === 'input');
    DOM.costModeOutput.classList.toggle('active', mode === 'output');
    update();
  }

  // Event listeners
  DOM.input.addEventListener('input', update);

  DOM.clearBtn.addEventListener('click', () => {
    DOM.input.value = '';
    DOM.input.focus();
    update();
  });

  DOM.pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      DOM.input.value = text;
      update();
    } catch {
      DOM.input.focus();
      document.execCommand('paste');
    }
  });

  DOM.costModeInput.addEventListener('click', () => setCostMode('input'));
  DOM.costModeOutput.addEventListener('click', () => setCostMode('output'));

  // Debounce input for performance
  let debounceTimer;
  const originalUpdate = update;
  update = function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(originalUpdate, 50);
  };

  update();
})();