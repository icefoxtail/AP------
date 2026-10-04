const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('C:/Users/USER/AppData/Local/APMath/tex-pilot-setup/playwright/node_modules/playwright');
const root = path.resolve(__dirname, '../../../../..');
const base = path.join(root, 'artifacts/tex-pilot/gold-pilot/reports/holdout');
const cases = [
  ['H01_circle_tangent_lines', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q04-solution.svg'],
  ['H02_point_tangent', 'archive/assets/images/23_복성고_2학기_중간_고2_수학II/q12-solution.svg'],
  ['H03_axis_tangent_circles', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q22-solution.svg'],
];
function url(rel) { return pathToFileURL(path.resolve(root, rel)).href; }
async function capture(page, rel, out) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url(rel), { waitUntil: 'load', timeout: 15000 });
  const metrics = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    const rect = svg?.getBoundingClientRect();
    return {svg: Boolean(svg), nonEmpty: Boolean(svg && svg.querySelectorAll('path,line,circle,rect').length && rect.width && rect.height), overflowX: Boolean(rect && (rect.left < 0 || rect.right > innerWidth)), overflowY: Boolean(rect && (rect.top < 0 || rect.bottom > document.documentElement.clientHeight)), paths: svg?.querySelectorAll('path').length || 0};
  });
  await page.screenshot({path: out, fullPage: false});
  metrics.errors = errors;
  metrics.pass = metrics.svg && metrics.nonEmpty && !metrics.overflowX && !metrics.overflowY && !errors.length;
  return metrics;
}
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: 'C:/Users/USER/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'});
  const results = [];
  for (const [id, old] of cases) {
    const dir = path.join(base, 'renders', id); fs.mkdirSync(dir, {recursive:true});
    const row = {id, old, new: `artifacts/tex-pilot/gold-pilot/reports/holdout/outputs/${id}/${id}.svg`, captures:{}};
    for (const [lane, rel] of [['old', old], ['new', row.new]]) {
      for (const [device, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
        const page = await browser.newPage({viewport});
        row[`${lane}-${device}`] = await capture(page, rel, path.join(dir, `${lane}-${device}.png`));
        row.captures[`${lane}-${device}`] = path.join(dir, `${lane}-${device}.png`);
        await page.close();
      }
    }
    results.push(row);
  }
  await browser.close();
  fs.writeFileSync(path.join(base, 'render-metrics.json'), JSON.stringify({schema:'APMATH_HOLDOUT_RENDER_v1', results}, null, 2));
  const pass = results.flatMap(r => [r['new-desktop'], r['new-mobile']]).filter(r => r.pass).length;
  console.log(`HOLDOUT_RENDER_PASS ${pass}/6`);
  if (pass !== 6) process.exitCode = 2;
})().catch(e => { console.error(e); process.exit(1); });
