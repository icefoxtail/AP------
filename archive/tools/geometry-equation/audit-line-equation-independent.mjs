import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXAM_ROOT = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h1');
const ASSET_ROOT = path.join(ROOT, 'archive', 'assets', 'images');
const REPORT_DIR = path.join(ROOT, 'archive', 'analysis', 'line-equation-external-51');
const BASE_SHA = '5958eedf933f306bb044bb350f2763dafe8b1343';
const UNITS = new Set(['H15-SA-10', 'H22-C2-02']);
const EPS = 1e-7;

const K = (file, id) => `${file}#${id}`;
const normLine = (line) => {
  const scale = Math.max(Math.abs(line.a), Math.abs(line.b), Math.abs(line.c), EPS);
  const values = [line.a / scale, line.b / scale, line.c / scale];
  const sign = values.find(v => Math.abs(v) > EPS) < 0 ? -1 : 1;
  return values.map(v => sign * v);
};
const sameLine = (a, b) => normLine(a).every((v, i) => Math.abs(v - normLine(b)[i]) < EPS);
const samePoint = (a, b) => Math.abs(a.x - b.x) < EPS && Math.abs(a.y - b.y) < EPS;
const line = (a, b, c) => ({ a, b, c });
const point = (label, x, y) => ({ label, x, y });

// These are independently recomputed from the question content and solution,
// never copied from an SVG data-* attribute. They lock the externally reported
// hard failures and are intentionally kept separate from the renderer facts.
const independentFacts = new Map([
  [K('24_금당고_1학기_기말_고1_기출.js', 5), {
    lines: [line(3, -4, 1)],
    points: [point('P', 2, 3), point('H', 13 / 5, 11 / 5)],
    segments: [['P', 'H']],
    reason: 'foot(P,3x−4y+1=0) = (13/5,11/5), distance=1',
  }],
  [K('24_매산고_1학기_기말_고1_기출.js', 11), {
    lines: [line(2, -1, 5)],
    points: [point('P', -1, 3), point('Q', 5, 15), point('R', 0, 5)],
    segments: [['P', 'Q']],
    curve: 'y=x²−2x',
    reason: 'solution computes y=2x+5 and P/Q=(-1,3),(5,15)',
  }],
  [K('23_강남여고_1학기_기말_고1_기출.js', 22), {
    lines: [line(3, -9, 4), line(1, 3, 9)],
    points: [point('P', -4, 3)],
    reason: 'given slope=1/3; perpendicular slope=−3 through (-4,3): y=−3x−9',
  }],
  [K('23_복성고_1학기_기말_고1_기출.js', 5), {
    lines: [line(1, 2, 0), line(2, -1, 3)],
    points: [point('P', 1, 5)],
    reason: 'given y=−x/2 and perpendicular through (1,5): y=2x+3',
  }],
  [K('23_순천여고_1학기_기말_고1_기출.js', 13), {
    lines: [line(-3, 3, 3)],
    points: [point('O', 0, 0), point('H', 1 / 2, -1 / 2)],
    segments: [['O', 'H']],
    reason: 'k=−1 minimizes (k−2)²+(k+4)²; foot of origin is (1/2,−1/2)',
  }],
  [K('24_매산고_1학기_기말_고1_기출.js', 6), {
    lines: [line(1, 3, -3), line(3, -1, -2), line(2, 6, 1)],
    reason: 'a=4/3 gives (1/3)x+y−1=0; b=5 gives 2x+6y+1=0',
  }],
  [K('24_제일고_1학기_중간_고1_기출.js', 21), {
    lines: [
      line(3 * (2 + Math.sqrt(3)), 4 * (2 + Math.sqrt(3)), (2 + Math.sqrt(3)) ** 2 + 1),
      line(3 * (2 - Math.sqrt(3)), 4 * (2 - Math.sqrt(3)), (2 - Math.sqrt(3)) ** 2 + 1),
      line(3 * (-3 + 2 * Math.sqrt(2)), 4 * (-3 + 2 * Math.sqrt(2)), (-3 + 2 * Math.sqrt(2)) ** 2 + 1),
      line(3 * (-3 - 2 * Math.sqrt(2)), 4 * (-3 - 2 * Math.sqrt(2)), (-3 - 2 * Math.sqrt(2)) ** 2 + 1),
    ],
    points: [point('P', -1, 1)],
    reason: 'distance equation |a²+a+1|=5|a| gives four a values',
  }],
  [K('25_순천여고_2학기_중간_고1_공통수학2.js', 19), {
    lines: [line(0, 1, -2), line(2 / 3, 1, -2)],
    reason: 'first-quadrant avoidance is 0≤m≤2/3; boundary is y=−(2/3)x+2',
  }],
  [K('25_제일고_2학기_중간_고1_기출.js', 15), {
    lines: [line(1, 1, -4), line(1, 1, 4)],
    points: [point('A', 2, 5), point('B', -1, -1), point('C', 6, -8), point('D', 1, 3), point('E', 10 / 3, 2 / 3)],
    segments: [['A', 'B'], ['A', 'C'], ['D', 'E']],
    reason: 'BC slope=−1; DE through D(1,3), E(10/3,2/3) is y=−x+4',
  }],
  [K('21_복성고_2학기_중간_고1_기출.js', 17), {
    lines: [line(2, 1, -4), line(1, -2, 8)],
    points: [point('H', 8 / 5, 4 / 5)],
    segments: [['O', 'H']],
    reason: 'closest branch is 2x+y−4=0; origin foot is (8/5,4/5), squared distance=16/5',
  }],
]);

function readText(file) { return fs.readFileSync(file, 'utf8'); }
function loadBank(file, source = readText(file)) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: file, timeout: 5000 });
  return Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
}
function gitBank(relative) {
  const source = execFileSync('git', ['show', `${BASE_SHA}:${relative}`], { cwd: ROOT, encoding: 'utf8' });
  return loadBank(relative, source);
}
function collectTargetFiles() {
  const result = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js')) result.push(full);
    }
  }
  walk(EXAM_ROOT);
  return result;
}
function parseSvg(file) {
  const source = fs.existsSync(file) ? readText(file) : '';
  const lines = [...source.matchAll(/<line\b([^>]*)>/g)].map(match => {
    const attrs = match[1];
    const get = name => (attrs.match(new RegExp(`\\b${name}="([^"]+)"`)) || [])[1];
    if (get('data-geometry') !== 'line') return null;
    return { a: Number(get('data-a')), b: Number(get('data-b')), c: Number(get('data-c')), x1: Number(get('data-model-x1')), y1: Number(get('data-model-y1')), x2: Number(get('data-model-x2')), y2: Number(get('data-model-y2')), equation: get('data-equation') || '' };
  }).filter(Boolean);
  const points = [...source.matchAll(/<g\b([^>]*)>/g)].map(match => {
    const attrs = match[1];
    const label = (attrs.match(/data-point-label="([^"]+)"/) || [])[1];
    if (!label) return null;
    return { label, x: Number((attrs.match(/data-point-x="([^"]+)"/) || [])[1]), y: Number((attrs.match(/data-point-y="([^"]+)"/) || [])[1]) };
  }).filter(Boolean);
  const segments = [...source.matchAll(/<line\b([^>]*)>/g)].map(match => match[1]).filter(attrs => /data-geometry="segment"/.test(attrs));
  const polygons = (source.match(/data-geometry="polygon"/g) || []).length;
  const curves = [...source.matchAll(/data-geometry="curve"[^>]*data-equation="([^"]*)"/g)].map(m => m[1]);
  return { source, lines, points, segments, polygons, curves, policy: (source.match(/data-scale-policy="([^"]+)"/) || [])[1] || '' };
}
function normalizeText(value) { return String(value || '').replaceAll('−', '-').replaceAll('²', '2').replace(/\\(?:d|t)?frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)').replace(/\s+/g, ''); }
function extractSimpleEquations(text) {
  const normalized = normalizeText(text);
  const result = [];
  const yForms = /y=([+-]?\d*(?:\.\d+)?)x([+-]\d+(?:\.\d+)?)/g;
  for (const match of normalized.matchAll(yForms)) {
    const slope = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : Number(match[1]);
    const intercept = Number(match[2]);
    result.push(line(slope, -1, intercept));
  }
  const standard = /([+-]?\d+(?:\.\d+)?)x([+-]\d+(?:\.\d+)?)y([+-]\d+(?:\.\d+)?)=0/g;
  for (const match of normalized.matchAll(standard)) result.push(line(Number(match[1]), Number(match[2]), Number(match[3])));
  return result;
}
function extractCoordinateTuples(text) {
  const result = [];
  for (const match of String(text || '').matchAll(/\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/g)) result.push({ x: Number(match[1]), y: Number(match[2]) });
  return result;
}
function hasPoint(actual, expected) { return actual.some(item => samePoint(item, expected) && (!expected.label || item.label === expected.label)); }
function lineSetContains(actual, expected) { return expected.every(e => actual.some(a => sameLine(a, e))); }
function lineSetExact(actual, expected) { return lineSetContains(actual, expected) && actual.length === expected.length; }
function segmentLabels(svg) {
  return svg.segments.map(attrs => {
    const a = attrs.match(/data-model-x1="([^"]+)"[^>]*data-model-y1="([^"]+)"/);
    const b = attrs.match(/data-model-x2="([^"]+)"[^>]*data-model-y2="([^"]+)"/);
    return { attrs, a: a ? { x: Number(a[1]), y: Number(a[2]) } : null, b: b ? { x: Number(b[1]), y: Number(b[2]) } : null };
  });
}
function checkIndependentFact(q, svg, fact) {
  const issues = [];
  for (const actual of svg.lines) for (const [x, y] of [[actual.x1, actual.y1], [actual.x2, actual.y2]]) if ([actual.a, actual.b, actual.c, x, y].every(Number.isFinite) && Math.abs(actual.a * x + actual.b * y + actual.c) > 1e-7) issues.push('SVG_ENDPOINT_EQUATION_FAIL');
  if (!lineSetExact(svg.lines, fact.lines)) issues.push(`LINE_SET expected ${fact.lines.length}, actual ${svg.lines.length}`);
  for (const expected of fact.points || []) if (!hasPoint(svg.points, expected)) issues.push(`POINT_${expected.label || ''} expected (${expected.x},${expected.y})`);
  if (fact.segments?.length) {
    const segs = segmentLabels(svg);
    for (const [from, to] of fact.segments) {
      const a = (fact.points || []).find(p => p.label === from);
      const b = (fact.points || []).find(p => p.label === to);
      if (a && b && !segs.some(s => s.a && s.b && ((Math.abs(s.a.x - a.x) < EPS && Math.abs(s.a.y - a.y) < EPS && Math.abs(s.b.x - b.x) < EPS && Math.abs(s.b.y - b.y) < EPS) || (Math.abs(s.a.x - b.x) < EPS && Math.abs(s.a.y - b.y) < EPS && Math.abs(s.b.x - a.x) < EPS && Math.abs(s.b.y - a.y) < EPS)))) issues.push(`SEGMENT_${from}_${to}_MISSING`);
    }
  }
  if (fact.curve && !svg.curves.some(c => normalizeText(c).includes(normalizeText(fact.curve).replace('²', '2')))) issues.push('CURVE_MISSING');
  return issues;
}
function structureIssues(q, svg) {
  const issues = [];
  if (!q.solutionImage) issues.push('SOLUTION_IMAGE_MISSING');
  if (!svg.source) issues.push('SVG_FILE_MISSING');
  if (!/viewBox="0 0 [0-9.]+ [0-9.]+"/.test(svg.source)) issues.push('VIEWBOX_MISSING');
  if (!/preserveAspectRatio=/.test(svg.source)) issues.push('PRESERVE_ASPECT_RATIO_MISSING');
  if (/NaN|Infinity|<br>|\\\(|\\\)/.test(svg.source)) issues.push('SVG_INVALID_TEXT_OR_NUMBER');
  if (/문제 조건|풀이 핵심 관계/.test(svg.source) && svg.lines.length === 0) issues.push('GENERIC_TEMPLATE');
  const text = `${q.content}\n${q.solution}`;
  if (/수선의 발|내린 수선/.test(text) && (svg.lines.length < 1 || svg.segments.length < 1 || svg.points.length < 2)) issues.push('PERPENDICULAR_FOOT_RELATION_INSUFFICIENT');
  if (/평행|수직/.test(text) && svg.lines.length < 2 && !/직선의 기울기/.test(text)) issues.push('LINE_RELATION_INSUFFICIENT');
  if (/두 점.*(?:지나는|이은)|선분/.test(text) && svg.points.length < 2) issues.push('POINT_PAIR_INSUFFICIENT');
  if (/넓이/.test(text) && /(삼각형|사각형|정사각형|직사각형|도형)/.test(text) && svg.polygons === 0 && svg.segments.length === 0) issues.push('AREA_BOUNDARY_INSUFFICIENT');
  return issues;
}
function metadataIssues(q) {
  const issues = [];
  const text = `${q.content}\n${q.solution}`;
  if (!q.subUnitKey || !q.subUnit) issues.push('SUBUNIT_EMPTY');
  if (/평행|수직|수선/.test(text) && q.subUnitKey.endsWith('LINE_EQUATION')) issues.push('SUBUNIT_RELATION_LEFT_AS_LINE_EQUATION');
  if (/거리/.test(text) && q.subUnitKey.endsWith('LINE_EQUATION')) issues.push('SUBUNIT_DISTANCE_LEFT_AS_LINE_EQUATION');
  if (!Array.isArray(q.tags) || !q.tags.length) issues.push('TAGS_EMPTY');
  if (q.solutionImage && !q.tags.includes('도형') && !q.tags.includes('그래프')) issues.push('VISUAL_TAG_MISSING');
  return issues;
}

const rows = [];
for (const full of collectTargetFiles()) {
  const relative = path.relative(ROOT, full).replaceAll(path.sep, '/');
  const baseRelative = relative.replace(/^archive\//, '');
  const base = gitBank(relative);
  const current = loadBank(full);
  for (const q of current) {
    if (!UNITS.has(q.standardUnitKey)) continue;
    const previous = base.find(item => Number(item.id) === Number(q.id));
    const sourceIssues = previous && (JSON.stringify(q.content) !== JSON.stringify(previous.content) || JSON.stringify(q.choices) !== JSON.stringify(previous.choices) || JSON.stringify(q.answer) !== JSON.stringify(previous.answer)) ? ['CONTENT_CHOICES_ANSWER_CHANGED_FROM_BASE'] : [];
    const asset = q.solutionImage ? path.join(ROOT, 'archive', q.solutionImage) : '';
    const svg = parseSvg(asset);
    const key = K(path.basename(full), q.id);
    const fact = independentFacts.get(key);
    const independentIssues = fact ? checkIndependentFact(q, svg, fact) : [];
    const issues = [...sourceIssues, ...structureIssues(q, svg), ...independentIssues, ...metadataIssues(q)];
    const sourceText = `${q.content}\n${q.solution}`;
    rows.push({ key, file: baseRelative, id: q.id, unit: q.standardUnitKey, status: issues.length ? 'FAIL' : 'PASS', issues, independentFact: fact ? fact.reason : null, sourceEquations: extractSimpleEquations(sourceText), sourceCoordinates: extractCoordinateTuples(sourceText), svg: { lines: svg.lines.length, lineData: svg.lines, points: svg.points.length, pointData: svg.points, segments: svg.segments.length, polygons: svg.polygons, curves: svg.curves.length, curveData: svg.curves, policy: svg.policy } });
  }
}
if (rows.length !== 94) throw new Error(`expected 94 target questions, got ${rows.length}`);
const report = {
  status: rows.every(row => row.status === 'PASS') ? 'PASS' : 'FAIL',
  baseSha: BASE_SHA,
  targetCount: rows.length,
  h15Count: rows.filter(row => row.unit === 'H15-SA-10').length,
  h22Count: rows.filter(row => row.unit === 'H22-C2-02').length,
  independentlyLockedHardFails: independentFacts.size,
  failures: rows.filter(row => row.status === 'FAIL'),
  passCount: rows.filter(row => row.status === 'PASS').length,
  rows,
};
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'independent-review.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, targetCount: report.targetCount, h15Count: report.h15Count, h22Count: report.h22Count, failures: report.failures.length, independentlyLockedHardFails: report.independentlyLockedHardFails, report: path.relative(ROOT, path.join(REPORT_DIR, 'independent-review.json')) }, null, 2));
