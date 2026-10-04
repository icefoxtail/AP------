#!/usr/bin/env node

const DEFAULTS = {
  AP_API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api',
  EIE_API_BASE: 'https://wangji-eie-os.js-pdf.workers.dev/api',
  WANGJI_API_BASE: 'https://wangji-common-worker.js-pdf.workers.dev/api',
  PAGES_ORIGIN: 'https://icefoxtail.github.io'
};

const TARGETS = [
  { label: 'AP', env: 'AP_API_BASE', fallback: DEFAULTS.AP_API_BASE },
  { label: 'EIE', env: 'EIE_API_BASE', fallback: DEFAULTS.EIE_API_BASE },
  { label: 'Wangji', env: 'WANGJI_API_BASE', fallback: DEFAULTS.WANGJI_API_BASE }
];

const pagesOrigin = process.env.PAGES_ORIGIN || DEFAULTS.PAGES_ORIGIN;
const timeoutMs = Number.parseInt(process.env.SMOKE_API_TIMEOUT_MS || '12000', 10);
const failures = [];

function normalizeBase(value) {
  return String(value || '').replace(/\/+$/, '');
}

function printPass(message) {
  console.log(`[PASS] ${message}`);
}

function printFail(message, reason) {
  failures.push({ message, reason });
  console.log(`[FAIL] ${message}`);
  console.log(`reason: ${reason}`);
}

function withTimeout(signalLabel) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`${signalLabel} timed out after ${timeoutMs}ms`)), timeoutMs);
  return { controller, timer };
}

async function smokeFetch(url, options = {}) {
  const { controller, timer } = withTimeout(url);
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
      ...options,
      headers: {
        Origin: pagesOrigin,
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function isReachableStatus(status) {
  return status > 0 && status < 500;
}

function hasInternalLeak(text) {
  const sample = String(text || '').slice(0, 4000);
  return [
    /\bError:\s+.+\n\s+at\s+/,
    /\bstack\b/i,
    /\btrace\b/i,
    /\/worker\/|\\worker\\|\/routes\/|\\routes\\/i,
    /D1_ERROR|SQLITE_|no such table/i
  ].some(pattern => pattern.test(sample));
}

async function checkReachable(target, baseUrl) {
  try {
    const response = await smokeFetch(baseUrl, { method: 'GET' });
    if (response.status >= 500) {
      printFail(`${target.label} worker reachable`, `GET ${baseUrl} returned ${response.status}`);
      return;
    }
    if (!isReachableStatus(response.status)) {
      printFail(`${target.label} worker reachable`, `GET ${baseUrl} returned unexpected status ${response.status}`);
      return;
    }
    printPass(`${target.label} worker reachable`);
  } catch (error) {
    printFail(`${target.label} worker reachable`, error.message || String(error));
  }
}

async function checkCors(target, baseUrl) {
  try {
    const response = await smokeFetch(baseUrl, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    if (response.status >= 500) {
      printFail(`${target.label} CORS origin restricted`, `OPTIONS ${baseUrl} returned ${response.status}`);
      return;
    }

    const allowOrigin = response.headers.get('access-control-allow-origin') || '';
    if (!allowOrigin) {
      printFail(`${target.label} CORS origin restricted`, 'missing Access-Control-Allow-Origin header');
      return;
    }
    if (allowOrigin.trim() === '*') {
      printFail(`${target.label} CORS origin restricted`, 'Access-Control-Allow-Origin is "*"');
      return;
    }
    if (allowOrigin.trim() !== pagesOrigin) {
      printFail(`${target.label} CORS origin restricted`, `expected ${pagesOrigin}, got ${allowOrigin}`);
      return;
    }
    printPass(`${target.label} CORS origin restricted`);
  } catch (error) {
    printFail(`${target.label} CORS origin restricted`, error.message || String(error));
  }
}

async function checkNotFoundDisclosure(target, baseUrl) {
  const notFoundUrl = `${baseUrl}/__smoke_readonly_not_found_${Date.now()}`;
  try {
    const response = await smokeFetch(notFoundUrl, { method: 'GET' });
    const body = await response.text().catch(() => '');
    if (response.status >= 500) {
      printFail(`${target.label} 404 disclosure safe`, `bad endpoint returned ${response.status}`);
      return;
    }
    if (hasInternalLeak(body)) {
      printFail(`${target.label} 404 disclosure safe`, 'bad endpoint response appears to expose stack, route, SQL, or internal error details');
      return;
    }
    printPass(`${target.label} 404 disclosure safe`);
  } catch (error) {
    printFail(`${target.label} 404 disclosure safe`, error.message || String(error));
  }
}

for (const target of TARGETS) {
  const baseUrl = normalizeBase(process.env[target.env] || target.fallback);
  await checkReachable(target, baseUrl);
  await checkCors(target, baseUrl);
  await checkNotFoundDisclosure(target, baseUrl);
}

if (failures.length > 0) {
  console.log('SMOKE API FAIL');
  process.exit(1);
}

console.log('SMOKE API PASS');
