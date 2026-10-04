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
  ['archive/assets/images/비상_공통수학2_도형의방정식_대단원학습평가_고1/q14-solution.svg', new Set(['Pmax(5.6,-4.2)  Pmin(2.4,-1.8)'])]
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
