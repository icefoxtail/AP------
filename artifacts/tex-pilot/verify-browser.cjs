const { chromium } = require('C:/Users/USER/AppData/Local/APMath/tex-pilot-setup/playwright/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/USER/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',
    timeout: 10000,
  });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const file = 'file:///C:/Users/USER/Desktop/AP------/artifacts/tex-pilot/tikz-pgfplots-test-xdv.svg';
  await page.goto(file, { waitUntil: 'load', timeout: 10000 });
  const info = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    return {
    width: svg.getAttribute('width'),
    height: svg.getAttribute('height'),
    viewBox: svg.getAttribute('viewBox'),
    paths: svg.querySelectorAll('path').length,
    clientWidth: svg.getBoundingClientRect().width,
    clientHeight: svg.getBoundingClientRect().height,
    };
  });
  await page.screenshot({ path: 'browser-render.png', fullPage: true });
  console.log(JSON.stringify(info));
  await browser.close().catch(() => {});
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
