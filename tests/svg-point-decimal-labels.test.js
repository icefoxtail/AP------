const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'archive', 'assets', 'images');
const TEXT_TAG = /<text\b[^>]*>([\s\S]*?)<\/text>/gi;
const COORDINATE_PAIR = /[（(]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[,，]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[）)]/g;
const DECIMAL = /\d+\.\d+/;

// Both solution annotations below were checked against the actual geometry.
// q05 D/E are perpendicular feet on BC/AB; q14 Pmax/Pmin lie exactly on
// the (4,-3), r=2 circle. Keep the exception exact so new decimal labels fail.
const APPROVED_DECIMAL_LABELS = new Map([
  ['archive/assets/images/비상_공통수학2_도형의방정식_대단원학습평가_고1/q05-solution.svg', new Set(['D(4.6,6.8)  E(2.2,4.4)'])],
  ['archive/assets/images/비상_공통수학2_도형의방정식_대단원학습평가_고1/q14-solution.svg', new Set(['Pmax(5.6,-4.2)  Pmin(2.4,-1.8)'])],
  // 2026-11-02 user decision: SVGs stay as is; these exact labels are approved.
  // Each is a rounded display of the exact value (fraction or surd) in the comment.
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q07-S1-R1-solution.svg', new Set([
    'D=(5.000, 1.000)' // exact = (5,1); 3-decimal format only
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q07-S2-R1-solution.svg', new Set([
    'D=(-0.667, 4.667)' // exact = (-2/3,14/3)
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q07-T1-R1-solution.svg', new Set([
    'D=(4.667, 0.667)' // exact = (14/3,2/3)
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q08-S1-R1-solution.svg', new Set([
    'F=(2.4, 0.2) CD 위  |  t=0.200' // exact = (12/5,1/5), t=1/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q08-S2-R1-solution.svg', new Set([
    'F=(1.2, 0.4) CD 위  |  t=0.400' // exact = (6/5,2/5), t=2/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q08-T1-R1-solution.svg', new Set([
    'F=(2.4, 0.8) CD 위  |  t=0.400' // exact = (12/5,4/5), t=2/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q11-S1-R1-solution.svg', new Set([
    'D=(-0.667, 4.667)' // exact = (-2/3,14/3)
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q11-T1-R1-solution.svg', new Set([
    'D=(4.667, 0.667)' // exact = (14/3,2/3)
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q12-S1-R1-solution.svg', new Set([
    'F=(3.6, 1.2) CD 위  |  t=0.400' // exact = (18/5,6/5), t=2/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q12-T1-R1-solution.svg', new Set([
    'F=(2.4, 0.8) CD 위  |  t=0.400' // exact = (12/5,4/5), t=2/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_교재완결_P158-160_20261023_유사50/BV-BAKBAL-H-COM2-P159-Q19-T1-R1-solution.svg', new Set([
    'F=(4.8, 1.6) CD 위  |  t=0.400' // exact = (24/5,8/5), t=2/5
  ])],
  ['archive/assets/images/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50/BV-BAKBAL-H-COM2-P75-Q14-S1-R3-solution.svg', new Set([
    'P (4.86,0)', // exact = (34/7,0), rounded
    'B′=(6,-2), P=(4.86,0); 최솟값 |AB′|' // exact P = (34/7,0), rounded
  ])],
  ['archive/assets/images/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50/BV-BAKBAL-H-COM2-P75-Q14-S2-R3-solution.svg', new Set([
    'P (0,2.8)', // exact = (0,14/5)
    'A′=(-1,2), P=(0,2.8); 최솟값 |A′B|' // exact P = (0,14/5)
  ])],
  ['archive/assets/images/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50/BV-BAKBAL-H-COM2-P75-Q14-T1-R3-solution.svg', new Set([
    'P (4.2,0)', // exact = (21/5,0)
    'B′=(5,-1), P=(4.2,0); 최솟값 |AB′|' // exact P = (21/5,0)
  ])],
  ['archive/assets/images/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50/BV-BAKBAL-H-COM2-P78-Q12-S1-R3-solution.svg', new Set([
    '교점 1 (-0.646,0)', // irrational approximation (exact (2-√7,0))
    '교점 2 (4.65,0)' // irrational approximation (exact (2+√7,0))
  ])],
  ['archive/assets/images/백발백중_공통수학2_도형의이동_P75-78_20261022_유사50/BV-BAKBAL-H-COM2-P78-Q12-T1-R3-solution.svg', new Set([
    '교점 1 (-3.58,0)', // irrational approximation (exact (1-√21,0))
    '교점 2 (5.58,0)' // irrational approximation (exact (1+√21,0))
  ])]
]);

const remaining = [];
const approvedSeen = new Set();
for (const entry of fs.readdirSync(ASSETS, { recursive: true })) {
  if (!entry.endsWith('-solution.svg')) continue;
  const file = path.join(ASSETS, entry);
  const raw = fs.readFileSync(file, 'utf8');
  for (const match of raw.matchAll(TEXT_TAG)) {
    const label = match[1];
    if ([...label.matchAll(COORDINATE_PAIR)].some(([pair]) => DECIMAL.test(pair))) {
      const relative = path.relative(ROOT, file).replaceAll('\\', '/');
      if (APPROVED_DECIMAL_LABELS.get(relative)?.has(label)) approvedSeen.add(`${relative}\n${label}`);
      else remaining.push(`${relative}: ${label}`);
    }
  }
}

assert.deepEqual(remaining, [], `student-facing decimal point labels remain:\n${remaining.join('\n')}`);
const approvedExpected = [...APPROVED_DECIMAL_LABELS].flatMap(([file, labels]) => [...labels].map(label => `${file}\n${label}`)).sort();
assert.deepEqual([...approvedSeen].sort(), approvedExpected, 'reviewed solution-coordinate annotations changed or disappeared');
console.log('SVG point decimal label check passed');
