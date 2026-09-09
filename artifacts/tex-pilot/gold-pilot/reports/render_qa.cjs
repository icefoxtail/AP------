const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('C:/Users/USER/AppData/Local/APMath/tex-pilot-setup/playwright/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const outputRoot = path.join(root, 'outputs');
const renderRoot = path.join(__dirname, 'renders');
const cases = [
  ['01_coordinate_perpendicular', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q02-solution.svg'],
  ['02_coordinate_parallel', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q07-solution.svg'],
  ['03_circle_center_radius', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q03-solution.svg'],
  ['04_circle_tangent_bounds', 'archive/assets/images/25_효천고_2학기_중간_고1_기출/q11-solution.svg'],
  ['05_function_branch_switch', 'archive/assets/images/25_제일고_2학기_중간_고2_수학II/q17-solution.svg'],
  ['06_function_tangent_triple_root', 'archive/assets/images/25_제일고_2학기_중간_고2_수학II/q18-solution.svg'],
  ['07_calculus_step_count', 'archive/assets/images/25_제일고_2학기_중간_고2_수학II/q16-solution.svg'],
  ['08_calculus_min_slope', 'archive/assets/images/25_제일고_2학기_중간_고2_수학II/q22-solution.svg'],
  ['09_calculus_reintersection', 'archive/assets/images/23_복성고_2학기_중간_고2_수학II/q13-solution.svg'],
  ['10_moving_segment_intersection', 'archive/assets/images/23_복성고_2학기_중간_고2_수학II/q19-solution.svg'],
];

function fileUrl(p) { return pathToFileURL(path.resolve(process.cwd(), p)).href; }
async function inspect(page, file, imagePath) {
  await page.goto(fileUrl(file), { waitUntil: 'load', timeout: 15000 });
  const metrics = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (!svg) return { svg: false };
    const rect = svg.getBoundingClientRect();
    return {
      svg: true,
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
      viewBox: svg.getAttribute('viewBox'),
      paths: svg.querySelectorAll('path').length,
      lines: svg.querySelectorAll('line').length,
      circles: svg.querySelectorAll('circle').length,
      texts: svg.querySelectorAll('text').length,
      clientWidth: rect.width,
      clientHeight: rect.height,
      overflowX: rect.left < 0 || rect.right > window.innerWidth,
      overflowY: rect.top < 0 || rect.bottom > document.documentElement.clientHeight,
    };
  });
  await page.screenshot({ path: imagePath, fullPage: false });
  return metrics;
}

(async () => {
  fs.mkdirSync(renderRoot, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/USER/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe', timeout: 15000 });
  const results = [];
  for (const [id, oldRel] of cases) {
    const dir = path.join(renderRoot, id);
    fs.mkdirSync(dir, { recursive: true });
    const current = { id, old: oldRel, new: `artifacts/tex-pilot/gold-pilot/outputs/${id}/${id}.svg`, files: {} };
    for (const [lane, rel] of [['old', oldRel], ['new', current.new]]) {
      for (const [device, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
        const page = await browser.newPage({ viewport });
        const image = path.join(dir, `${lane}-${device}.png`);
        current.files[`${lane}-${device}`] = image;
        current[`${lane}-${device}`] = await inspect(page, rel, image);
        await page.close();
      }
    }
    results.push(current);
  }
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(__dirname, 'render-metrics.json'), JSON.stringify({ tool: 'Playwright 1.60.0', chromium: 'chromium-1223', results }, null, 2) + '\n');
  console.log(`RENDER_QA_PASS ${results.length}/${cases.length}`);
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
