const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'archive', 'assessment', 'assessment-mvp.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

[
  '.filter-band',
  '.filter-inner',
  '.fb-search',
  '.fb-sel',
  '.fb-original-toggle',
  '.card-grid',
  '.exam-card',
  '.card-top',
  '.card-body',
  '.card-grade-row',
  '.card-grade-label',
  '.card-type-chip',
  '.card-main-title',
  '.card-sub-title',
  '.card-meta-line',
  '.meta-badge',
  '.card-file-name',
  '.card-actions',
  '.action-btn',
  '--archive-shadow-sm',
  '--archive-border',
  'rgba(255,255,255,0.84)',
].forEach((selector) => {
  assert(html.includes(selector), `assessment-mvp.html should reuse archive selector ${selector}`);
});

[
  'class="toolbar"',
  'class="tabs"',
  'class="grid"',
  'class="card"',
  'class="card-head"',
  'button class="action ',
].forEach((legacyClass) => {
  assert(!html.includes(legacyClass), `assessment-mvp.html should not keep standalone MVP markup ${legacyClass}`);
});

[
  '출력',
  '정답',
  '해설',
  '진단평가',
  '단원평가',
  '중간·기말평가',
  '../mixed_engine.html',
].forEach((requiredText) => {
  assert(html.includes(requiredText), `assessment-mvp.html should preserve ${requiredText}`);
});

console.log('assessment MVP archive style checks passed');
