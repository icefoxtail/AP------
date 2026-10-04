#!/usr/bin/env node

const DEFAULTS = {
  AP_BASE_URL: 'https://icefoxtail.github.io/AP------/apmath/',
  EIE_BASE_URL: 'https://icefoxtail.github.io/AP------/eie/',
  SMOKE_HEADLESS: '1'
};

const env = {
  AP_BASE_URL: process.env.AP_BASE_URL || DEFAULTS.AP_BASE_URL,
  EIE_BASE_URL: process.env.EIE_BASE_URL || DEFAULTS.EIE_BASE_URL,
  AP_SMOKE_ID: process.env.AP_SMOKE_ID || '',
  AP_SMOKE_PW: process.env.AP_SMOKE_PW || '',
  EIE_SMOKE_ID: process.env.EIE_SMOKE_ID || '',
  EIE_SMOKE_PW: process.env.EIE_SMOKE_PW || '',
  SMOKE_HEADLESS: process.env.SMOKE_HEADLESS || DEFAULTS.SMOKE_HEADLESS
};

const failures = [];

function pass(message) {
  console.log(`[PASS] ${message}`);
}

function fail(message, reason) {
  failures.push({ message, reason });
  console.log(`[FAIL] ${message}`);
  console.log(`reason: ${reason}`);
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.log('Playwright가 설치되어 있지 않습니다.');
    console.log('실행:');
    console.log('  npx playwright install chromium');
    console.log('  npm install -D playwright');
    console.log('또는 npx playwright test 환경을 준비하세요.');
    process.exit(1);
  }
}

function collectErrors(page, label) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', error => {
    errors.push(`pageerror: ${error.message}`);
  });
  return {
    assertClean() {
      if (errors.length > 0) {
        fail(`${label} no fatal console error`, errors.slice(0, 10).join(' | '));
      } else {
        pass(`${label} no fatal console error`);
      }
    }
  };
}

async function hasAnyLocator(page, selectors) {
  for (const selector of selectors) {
    try {
      if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
        return true;
      }
    } catch {
      // Try the next selector.
    }
  }
  return false;
}

async function fillFirstVisible(page, selectors, value) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.isVisible({ timeout: 1000 })) {
        await locator.fill(value);
        return true;
      }
    } catch {
      // Try the next selector.
    }
  }
  return false;
}

async function clickFirstVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.isVisible({ timeout: 1000 })) {
        await locator.click();
        return true;
      }
    } catch {
      // Try the next selector.
    }
  }
  return false;
}

async function detectAp(page) {
  return hasAnyLocator(page, [
    '#login-screen',
    '#app',
    '#dashboard',
    'text=/AP\\s*Math/i',
    'text=/로그인|대시보드|학생|학급|시간표/'
  ]);
}

async function detectEie(page) {
  return hasAnyLocator(page, [
    '#login-screen',
    '#app',
    '#root',
    'text=/EIE/i',
    'text=/로그인|대시보드|학생|학급|시간표/'
  ]);
}

async function tryApLogin(page) {
  if (!env.AP_SMOKE_ID || !env.AP_SMOKE_PW) return false;
  const idFilled = await fillFirstVisible(page, [
    'input[name="id"]',
    'input[name="login_id"]',
    'input[name="username"]',
    'input[type="text"]'
  ], env.AP_SMOKE_ID);
  const pwFilled = await fillFirstVisible(page, [
    'input[name="password"]',
    'input[name="pw"]',
    'input[type="password"]'
  ], env.AP_SMOKE_PW);
  if (!idFilled || !pwFilled) return false;
  return clickFirstVisible(page, [
    'button[type="submit"]',
    'button:has-text("로그인")',
    'button:has-text("Login")'
  ]);
}

async function tryEieLogin(page) {
  if (!env.EIE_SMOKE_ID || !env.EIE_SMOKE_PW) return false;
  const idFilled = await fillFirstVisible(page, [
    'input[name="id"]',
    'input[name="login_id"]',
    'input[name="username"]',
    'input[type="text"]'
  ], env.EIE_SMOKE_ID);
  const pwFilled = await fillFirstVisible(page, [
    'input[name="password"]',
    'input[name="pw"]',
    'input[type="password"]'
  ], env.EIE_SMOKE_PW);
  if (!idFilled || !pwFilled) return false;
  return clickFirstVisible(page, [
    'button[type="submit"]',
    'button:has-text("로그인")',
    'button:has-text("Login")'
  ]);
}

async function smokeApp(browser, label, url, detectFn, loginFn, postLoginSelectors) {
  const page = await browser.newPage();
  const errors = collectErrors(page, label);

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response || response.status() >= 500) {
      fail(`${label} page loaded`, `status ${response ? response.status() : 'no response'}`);
    } else {
      pass(`${label} page loaded`);
    }

    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    if (await detectFn(page)) {
      pass(`${label} login screen or dashboard detected`);
    } else {
      fail(`${label} login screen or dashboard detected`, 'could not find login, dashboard, or known app navigation text');
    }

    const attemptedLogin = await loginFn(page);
    if (attemptedLogin) {
      await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
      if (await hasAnyLocator(page, postLoginSelectors)) {
        pass(`${label} post-login navigation detected`);
      } else {
        fail(`${label} post-login navigation detected`, 'credentials were supplied but dashboard/navigation was not detected after login');
      }
    }

    errors.assertClean();
  } finally {
    await page.close().catch(() => {});
  }
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch({ headless: env.SMOKE_HEADLESS !== '0' });

try {
  await smokeApp(
    browser,
    'AP',
    env.AP_BASE_URL,
    detectAp,
    tryApLogin,
    ['text=/대시보드|학생|학급|시간표/', 'button:has-text("학생")', 'button:has-text("학급")', 'button:has-text("시간표")']
  );
  await smokeApp(
    browser,
    'EIE',
    env.EIE_BASE_URL,
    detectEie,
    tryEieLogin,
    ['text=/대시보드|학생|학급|시간표/', 'button:has-text("학생")', 'button:has-text("학급")', 'button:has-text("시간표")']
  );
} finally {
  await browser.close().catch(() => {});
}

if (failures.length > 0) {
  console.log('SMOKE BROWSER FAIL');
  process.exit(1);
}

console.log('SMOKE BROWSER PASS');
