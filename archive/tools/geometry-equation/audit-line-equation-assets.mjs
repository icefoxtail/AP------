import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, '$1')), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const SOURCE_ROOT = path.join(ARCHIVE, 'exams', 'original', 'high', 'h1');
const EVIDENCE = path.join(ARCHIVE, 'analysis', 'line-equation-94');
const target = [];
const failures = [];
function load(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 5000 });
  return context.window.questionBank || [];
}
function attr(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
}
function tags(svg, name) {
  return [...svg.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attr(m[0]));
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith('.js')) {
      for (const q of load(file)) {
        if (q.standardUnitKey === 'H15-SA-10' || q.standardUnitKey === 'H22-C2-02') target.push({ file: entry.name, id: q.id, q });
      }
    }
  }
}
walk(SOURCE_ROOT);
for (const row of target) {
  const issues = [];
  const ref = row.q.solutionImage || '';
  const asset = ref ? path.join(ARCHIVE, ref) : '';
  const svg = asset && fs.existsSync(asset) ? fs.readFileSync(asset, 'utf8') : '';
  const root = attr(svg.match(/<svg\b[^>]*>/i)?.[0] || '');
  if (!svg) issues.push('SVG_MISSING');
  if (!root.viewBox || !root.preserveAspectRatio) issues.push('SVG_ROOT_ATTR_MISSING');
  if (/<br\b|\$[^$]*\$|\\(?:frac|dfrac|sqrt|text)\b/i.test(svg)) issues.push('SVG_FORBIDDEN_MARKUP');
  if (/NaN|Infinity|-Infinity/.test(svg)) issues.push('SVG_NONFINITE');
  if (/문제 조건/.test(svg) && /풀이 핵심 관계/.test(svg) && !/<(?:line|polyline|polygon|circle)\b[^>]*data-geometry=/i.test(svg)) issues.push('GENERIC_TEMPLATE');
  const metric = /거리|수선|넓이|삼각형|두 점/.test(`${row.q.content || ''} ${row.q.solution || ''}`);
  if (metric && root['data-scale-policy'] === 'SCHEMATIC_ALLOWED') issues.push('SCHEMATIC_ALLOWED_METRIC_MISUSE');
  for (const line of tags(svg, 'line').filter((item) => item['data-geometry'] === 'line')) {
    const values = ['data-a', 'data-b', 'data-c', 'data-model-x1', 'data-model-y1', 'data-model-x2', 'data-model-y2'].map((name) => Number(line[name]));
    if (values.every(Number.isFinite)) {
      const [a, b, c, x1, y1, x2, y2] = values;
      if (Math.abs(a * x1 + b * y1 + c) > 1e-8 || Math.abs(a * x2 + b * y2 + c) > 1e-8) issues.push('LINE_ENDPOINT_EQUATION_FAIL');
    }
  }
  const key = `${row.file}#${row.id}`;
  if (key === '21_효천고_2학기_중간_고1_기출.js#13' && (!/data-a="3" data-b="-2" data-c="12"/.test(svg) || !/data-point-label="A" data-point-x="-2" data-point-y="3"/.test(svg))) issues.push('P0_EFF_Q13_FAIL');
  if (key === '24_매산고_1학기_기말_고1_기출.js#14' && (!/4−√10/.test(svg) || !/data-point-label="D"/.test(svg))) issues.push('P0_MAESAN_Q14_FAIL');
  if (key === '24_제일고_1학기_기말_고1_기출.js#14' && /-4, 0/.test(svg)) issues.push('P0_JAIL_Q14_LEGACY_POINT');
  if (issues.length) failures.push({ key, issues: [...new Set(issues)] });
}
const result = { status: failures.length ? 'FAIL' : 'PASS', targetCount: target.length, failures };
fs.mkdirSync(EVIDENCE, { recursive: true });
fs.writeFileSync(path.join(EVIDENCE, 'independent-review-2.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, targetCount: result.targetCount, failures: result.failures }, null, 2));
