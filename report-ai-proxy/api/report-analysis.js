const REQUIRED_FIELDS = [
  'summary',
  'diagnosis',
  'wrongAnalysis',
  'nextPlan',
  'parentMessage',
  'kakaoSummary',
  'teacherMemo',
  'riskLevel',
  'mainWeaknesses',
  'nextActions'
];

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function clampText(value, max = 12000) {
  const text = String(value || '');
  return text.length > max ? text.slice(0, max) : text;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {}

  const raw = String(text || '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch (e) {}
  }

  return null;
}

function parseGeminiJsonText(text) {
  const raw = String(text || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  let parsed = safeJsonParse(raw);
  if (parsed) return parsed;

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    parsed = safeJsonParse(raw.slice(start, end + 1));
    if (parsed) return parsed;
  }

  return null;
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map(part => {
      if (typeof part?.text === 'string') return part.text;
      return '';
    })
    .join('\n')
    .trim();
}

function normalizeReportAnalysisResult(raw = {}) {
  const cleanString = value => String(value || '').trim();
  const cleanArray = value => Array.isArray(value)
    ? value.map(item => cleanString(item)).filter(Boolean).slice(0, 8)
    : [];
  const risk = cleanString(raw.riskLevel || 'stable');

  return {
    summary: cleanString(raw.summary),
    diagnosis: cleanString(raw.diagnosis),
    wrongAnalysis: cleanString(raw.wrongAnalysis),
    nextPlan: cleanString(raw.nextPlan),
    parentMessage: cleanString(raw.parentMessage),
    kakaoSummary: cleanString(raw.kakaoSummary),
    teacherMemo: cleanString(raw.teacherMemo),
    riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
    mainWeaknesses: cleanArray(raw.mainWeaknesses),
    nextActions: cleanArray(raw.nextActions)
  };
}

function validateAnalysisShape(analysis) {
  if (!analysis || typeof analysis !== 'object') {
    throw new Error('analysis object missing');
  }

  for (const key of REQUIRED_FIELDS) {
    if (!(key in analysis)) {
      throw new Error(`analysis field missing: ${key}`);
    }
  }

  if (!Array.isArray(analysis.mainWeaknesses)) {
    throw new Error('analysis.mainWeaknesses must be an array');
  }

  if (!Array.isArray(analysis.nextActions)) {
    throw new Error('analysis.nextActions must be an array');
  }
}

function buildUserText(systemPrompt, userPrompt, payload, schema) {
  const sections = [
    String(systemPrompt || '').trim(),
    '',
    String(userPrompt || '').trim(),
    '',
    '[출력 형식]',
    '반드시 JSON 객체만 출력한다. 마크다운, 코드블록, 설명 문장, 주석은 출력하지 않는다.',
    '아래 필드를 모두 포함한다:',
    REQUIRED_FIELDS.join(', ')
  ];

  if (schema) {
    sections.push('', '[참고 JSON Schema]', clampText(JSON.stringify(schema, null, 2), 8000));
  }

  if (payload) {
    sections.push('', '[원본 Payload]', clampText(JSON.stringify(payload, null, 2), 22000));
  }

  return sections.join('\n');
}

async function callGeminiOnce({ apiKey, model, systemPrompt, userPrompt, payload, schema, startedAt }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  let response;

  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: buildUserText(systemPrompt, userPrompt, payload, schema)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 4500,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      console.error('[REPORT_AI_PROXY_TIMEOUT]', {
        model,
        elapsedMs: Date.now() - startedAt
      });
      const timeoutError = new Error(`Gemini timeout: ${model}`);
      timeoutError.retryNextModel = true;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const status = response.status;
    const error = new Error(`Gemini ${status}: ${detail.slice(0, 500)}`);
    error.status = status;
    error.retryNextModel = [429, 500, 502, 503, 504].includes(status);
    error.skipModel = status === 404;
    throw error;
  }

  const data = await response.json();
  const text = extractGeminiText(data);
  const parsed = parseGeminiJsonText(text);

  if (!parsed) {
    const finishReason = data?.candidates?.[0]?.finishReason || '';
    const blockReason = data?.promptFeedback?.blockReason || '';
    console.error('[REPORT_AI_PROXY_GEMINI_PARSE_DEBUG]', {
      model,
      textSample: text.slice(0, 1000),
      candidateCount: Array.isArray(data?.candidates) ? data.candidates.length : 0,
      finishReason,
      blockReason,
      safetyRatings: data?.candidates?.[0]?.safetyRatings || data?.promptFeedback?.safetyRatings || []
    });
    const error = new Error(`Gemini JSON parse failed (finishReason=${finishReason}, blockReason=${blockReason}): ${text.slice(0, 1000)}`);
    error.retryNextModel = true;
    throw error;
  }

  const analysis = normalizeReportAnalysisResult(parsed.analysis || parsed);
  validateAnalysisShape(analysis);

  return analysis;
}

async function callGeminiReportAnalysis({ systemPrompt, userPrompt, payload, schema }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY missing');
  }
  const startedAt = Date.now();
  const overallTimeoutMs = 28000;

  const modelCandidates = [
    process.env.GEMINI_REPORT_MODEL || 'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
  ].filter((model, index, arr) => model && arr.indexOf(model) === index);

  let lastErrorMessage = 'unknown error';

  for (let i = 0; i < modelCandidates.length; i++) {
    if (Date.now() - startedAt > overallTimeoutMs) {
      lastErrorMessage = `Gemini timeout: overall retry limit exceeded (${Date.now() - startedAt}ms)`;
      break;
    }

    const model = modelCandidates[i];
    try {
      return await callGeminiOnce({ apiKey, model, systemPrompt, userPrompt, payload, schema, startedAt });
    } catch (error) {
      lastErrorMessage = String(error?.message || error || 'unknown error');
      console.error('[REPORT_AI_PROXY_GEMINI_ERROR]', {
        message: lastErrorMessage,
        model,
        elapsedMs: Date.now() - startedAt
      });
      if (!(error?.retryNextModel || error?.skipModel)) break;
      if (Date.now() - startedAt > overallTimeoutMs) break;
      if (Date.now() - startedAt > 22000 && i < modelCandidates.length - 2) {
        i = modelCandidates.length - 2;
      }
    }
  }

  throw new Error(lastErrorMessage);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, {
      success: false,
      source: 'fallback',
      warning: 'Method not allowed'
    });
  }

  const expectedSecret = String(process.env.REPORT_AI_PROXY_SECRET || '');
  const receivedSecret = String(req.headers['x-report-ai-proxy-secret'] || '');

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return sendJson(res, 401, {
      success: false,
      source: 'fallback',
      warning: 'Unauthorized'
    });
  }

  try {
    const body = req.body && typeof req.body === 'object'
      ? req.body
      : safeJsonParse(req.body);

    if (!body || typeof body !== 'object') {
      throw new Error('Invalid JSON body');
    }

    const { payload, systemPrompt, userPrompt, schema } = body;
    if (!payload || typeof payload !== 'object') {
      throw new Error('payload missing');
    }

    const analysis = await callGeminiReportAnalysis({
      systemPrompt,
      userPrompt,
      payload,
      schema
    });

    return sendJson(res, 200, {
      success: true,
      source: 'gemini',
      analysis,
      warning: ''
    });
  } catch (error) {
    console.error('[REPORT_AI_PROXY_ERROR]', {
      message: String(error?.message || error)
    });

    return sendJson(res, 200, {
      success: false,
      source: 'fallback',
      warning: String(error?.message || error).slice(0, 500)
    });
  }
};
