import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const INPUT = path.join(ROOT, 'docs', 'reports', 'function-family-20260903', 'function_family_pilot_graphs.json');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports', 'function-family-20260904');
const OUTPUT = path.join(REPORT_DIR, 'function_family_dense_sampling_audit_v2.json');
const SUMMARY = path.join(REPORT_DIR, 'function_family_dense_sampling_audit_v2.md');

const PROVENANCE = 'reconstructed_from_independent_solution_facts';
const FORBIDDEN_RE = /<\s*(?:script|foreignObject|br)\b|(?:정답|보기|answer|choice)|\\(?:frac|sqrt|begin|end|left|right)|\$(?:[^$]|\$)+\$/iu;

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function parsePoints(raw) {
  const numbers = String(raw).trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (numbers.length < 4 || numbers.length % 2) return { count: 0, finite: false, points: [] };
  const points = [];
  for (let i = 0; i < numbers.length; i += 2) points.push({ x: numbers[i], y: numbers[i + 1] });
  return { count: points.length, finite: points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)), points };
}
function attr(tag, name) { return tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1] || null; }

function inspect(row) {
  const filePath = path.join(ARCHIVE, row.assetRef.replaceAll('/', path.sep));
  const errors = [];
  if (!fs.existsSync(filePath)) return { caseId: row.caseId, status: 'FAIL', errors: ['asset-missing'] };
  const raw = fs.readFileSync(filePath, 'utf8');
  const root = raw.match(/<svg\b[^>]*>/i)?.[0] || '';
  const viewBox = (attr(root, 'viewBox') || '').trim().split(/\s+/).map(Number);
  const expected = row.curveSampleCounts || [];
  const actualCurves = [...raw.matchAll(/<polyline\b[^>]*\bpoints="([^"]+)"/gi)].map((m) => parsePoints(m[1]));
  if (!root) errors.push('svg-root-missing');
  if (attr(root, 'data-graph-case') !== row.caseId) errors.push('case-id-mismatch');
  if (attr(root, 'data-fact-hash') !== row.factHash) errors.push('fact-hash-mismatch');
  if (attr(root, 'data-visual-provenance') !== PROVENANCE) errors.push('provenance-mismatch');
  if (!(Number(attr(root, 'width')) > 0 && Number(attr(root, 'height')) > 0)) errors.push('dimension-missing');
  if (viewBox.length !== 4 || viewBox.some((v) => !Number.isFinite(v)) || viewBox[2] <= 0 || viewBox[3] <= 0) errors.push('viewBox-invalid');
  if (FORBIDDEN_RE.test(raw)) errors.push('forbidden-token');
  if (actualCurves.length !== expected.length) errors.push('curve-count-mismatch');
  if (actualCurves.some((curve, i) => !curve.finite || curve.count !== expected[i])) errors.push('polyline-density-mismatch');
  const minimum = row.visualKind === 'RATIONAL_GRAPH' ? 300 : 200;
  const densityFailures = expected.flatMap((count, i) => count > 0 && count < minimum ? [{ branch: i, count, minimum }] : []);
  if (densityFailures.length) errors.push('policy-density-fail');
  const [vx, vy, vw, vh] = viewBox;
  for (const curve of actualCurves) for (const point of curve.points) {
    if (point.x < vx - 1e-6 || point.x > vx + vw + 1e-6) errors.push('x-out-of-viewBox');
    if (point.y < vy - 1e-6 || point.y > vy + vh + 1e-6) errors.push('y-out-of-viewBox');
  }
  return { caseId: row.caseId, assetRef: row.assetRef, visualKind: row.visualKind, bytes: fs.statSync(filePath).size, assetSha256: sha(raw), expectedCurveSampleCounts: expected, actualCurveSampleCounts: actualCurves.map((c) => c.count), minimumCurveSampleCount: minimum, densityFailures, status: errors.length ? 'FAIL' : 'PASS', errors };
}

function main() {
  const ledger = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  const rows = ledger.cases.map(inspect);
  const rationalCases = rows.filter((row) => row.visualKind === 'RATIONAL_GRAPH').length;
  const curveBranches = rows.reduce((n, row) => n + row.actualCurveSampleCounts.length, 0);
  const nonlinearBranches = rows.reduce((n, row) => n + row.actualCurveSampleCounts.filter((count) => count > 0).length, 0);
  const output = {
    reportType: 'FUNCTION_FAMILY_DENSE_SAMPLING_AUDIT_V2',
    generatedAt: new Date().toISOString(),
    status: rows.every((row) => row.status === 'PASS') && ledger.status === 'PASS' ? 'DENSE_SAMPLING_PASS' : 'DENSE_SAMPLING_FAIL',
    sourceLedger: 'function_family_pilot_graphs.json',
    graphCases: rows.length,
    rationalGraphCases: rationalCases,
    curveBranches,
    nonlinearCurveBranches: nonlinearBranches,
    policy: { standardMinimum: 200, rationalOrAsymptoteMinimum: 300, lineAndSegmentRule: 'line/segment primitives are exempt; only curves are counted' },
    counts: { pass: rows.filter((row) => row.status === 'PASS').length, fail: rows.filter((row) => row.status !== 'PASS').length, below200: rows.filter((row) => row.errors.includes('policy-density-fail') && row.minimumCurveSampleCount === 200).length, rationalBelow300: rows.filter((row) => row.errors.includes('policy-density-fail') && row.minimumCurveSampleCount === 300).length, undefinedOrNonFinite: rows.filter((row) => row.errors.some((error) => /out-of-viewBox|density|polyline/.test(error))).length },
    rows,
    note: 'This audit independently reads the generated SVG polyline arrays and compares their counts with the generator ledger. It is a density/serialization gate, not a substitute for independent mathematical solving.'
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.writeFileSync(SUMMARY, [
    '# 함수·유리함수·무리함수 dense sampling audit v2', '',
    `- 상태: **${output.status}**`,
    `- graph cases: ${output.graphCases}`,
    `- rational graph cases: ${output.rationalGraphCases}`,
    `- curve branches: ${output.curveBranches}`,
    `- nonlinear curve branches: ${output.nonlinearCurveBranches}`,
    `- cases PASS/FAIL: ${output.counts.pass}/${output.counts.fail}`,
    `- below 200 points: ${output.counts.below200}`,
    `- rational/asymptote below 300 points: ${output.counts.rationalBelow300}`,
    `- undefined/non-finite or serialization failures: ${output.counts.undefinedOrNonFinite}`,
    '',
    '검증 대상 SVG를 다시 읽어 실제 `<polyline points>`의 pair 수를 ledger의 curveSampleCounts와 비교했다. 일반 curve는 200점 이상, RATIONAL_GRAPH curve는 300점 이상이며 직선·선분 primitive는 curve density 대상에서 제외했다.',
    '',
  ].join('\n'), 'utf8');
  console.log(JSON.stringify({ status: output.status, counts: output.counts, graphCases: output.graphCases, curveBranches: output.curveBranches }, null, 2));
}

main();
