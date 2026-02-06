import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname reliably for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Candidate env file locations (checks in order)
const candidateEnvPaths = [
  path.resolve(__dirname, '../.env'),           // backend/.env (when running from backend/src)
  path.resolve(__dirname, '../../.env'),        // project-root/.env (if running from backend)
  path.resolve(process.cwd(), 'backend/.env'), // backend/.env (if running from project root)
  path.resolve(process.cwd(), '.env'),         // project-root/.env
];

let loadedEnvPath = null;
for (const p of candidateEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    loadedEnvPath = p;
    break;
  }
}
if (!loadedEnvPath) {
  dotenv.config();
}

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-pro';

console.log(`Backend env loaded from: ${loadedEnvPath || 'default'} (process.cwd(): ${process.cwd()})`);
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set in the loaded environment. Please add GEMINI_API_KEY to one of the following paths:');
  candidateEnvPaths.forEach(p => console.warn('  -', p));
}

app.get('/health', (req, res) => res.json({ ok: true }));

// Helper: attempt candidate endpoints sequentially
async function tryEndpoints(prompt) {
  const isApiKey = typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.startsWith('AIza');
  const model = GEMINI_MODEL;
  const candidates = [
    // Known/possible host patterns — try several variants
    `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText`,
    `https://generativelanguage.googleapis.com/v1/models/${model}:generate`,
    `https://generativeai.googleapis.com/v1beta2/models/${model}:generateText`,
    `https://generativeai.googleapis.com/v1/models/${model}:generate`,
    `https://generativeai.googleapis.com/v1beta2/models/${model}:generate`,
    `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generate`, 
  ];

  const results = [];

  for (const base of candidates) {
    const url = isApiKey ? `${base}?key=${encodeURIComponent(GEMINI_API_KEY)}` : base;
    const headers = { 'Content-Type': 'application/json' };
    if (!isApiKey) headers['Authorization'] = `Bearer ${GEMINI_API_KEY}`;

    let resp;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          // Keep a generic request body expected by various endpoints
          prompt: { text: prompt },
          // Some endpoints expect "input" / "temperature" / "max_output_tokens" variations,
          // but many accept these fields – adjust as needed.
          temperature: 0.2,
          maxOutputTokens: 512
        }),
      });
    } catch (err) {
      results.push({ url, ok: false, error: String(err) });
      continue;
    }

    const status = resp.status;
    const text = await resp.text();
    // Try parse JSON
    try {
      const json = JSON.parse(text);
      if (resp.ok) {
        return { success: true, url, status, body: json };
      } else {
        results.push({ url, ok: false, status, body: json });
        // continue trying other endpoints
      }
    } catch (parseErr) {
      // Not JSON (HTML or text)
      results.push({ url, ok: resp.ok, status, raw: text.slice(0, 2000) });
      if (resp.ok) {
        // non-JSON 200 — return raw
        return { success: true, url, status, body: { raw: text } };
      }
      // continue trying other endpoints
    }
  }

  return { success: false, attempts: results };
}

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt" in request body' });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set. Searched paths:', candidateEnvPaths);
      return res.status(500).json({
        error: 'Server misconfiguration: GEMINI_API_KEY not set',
        searchedPaths: candidateEnvPaths
      });
    }

    const result = await tryEndpoints(prompt);

    if (result.success) {
      return res.status(200).json(result.body);
    }

    // If all tried endpoints failed, return diagnostics
    return res.status(502).json({
      error: 'Failed to reach Generative AI endpoint. See attempts for details.',
      attempts: result.attempts,
      note: 'Ensure GEMINI_MODEL is correct and GEMINI_API_KEY has proper permissions (API key vs OAuth token).'
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${PORT}`);
});
