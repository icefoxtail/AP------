const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'archive', 'assessment', 'assessment-mvp.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const sharedCss = fs.readFileSync(path.join(root, 'archive', 'archive2-standalone.css'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Archive 2.0 frame: tokens, standalone shapes, shared menu (sub folder, so ../ paths), session handoff before the menu.
[
  'class="archive2-standalone archive2-assessment archive2-shell"',
  '../archive2-tokens.css',
  '../archive2-standalone.css',
  '../archive2-navigation.css',
  '../archive2-navigation.js',
  '../archive2-session.js',
  '../archive-session.js',
  'data-archive-navigation="standalone"',
  'data-archive-base="../"',
  'data-archive-view="saved"',
  "archiveView = 'five-minute'",
].forEach((marker) => {
  assert(html.includes(marker), `assessment-mvp.html should use the Archive 2.0 frame marker ${marker}`);
});
assert(
  html.indexOf('../archive-session.js') < html.indexOf('../archive2-navigation.js'),
  'AP Math OS session in the address must be restored before the menu reads the session'
);

[
  '.filter-band',
  '.filter-inner',
  '.fb-search',
  '.fb-sel',
  '.fb-original-toggle',
  '.card-grid',
  '.exam-card',
  '.card-body',
  '.card-actions',
  '.action-btn',
  '.modal-box',
  '.qpp-opt',
].forEach((selector) => {
  assert(html.includes(selector), `assessment-mvp.html should keep selector ${selector}`);
});
['.exam-card', '.card-body', '.card-grade-row', '.card-main-title', '.card-sub-title', '.card-meta-line', '.meta-badge', '.card-type-chip'].forEach((selector) => {
  assert(sharedCss.includes(`body.archive2-assessment ${selector}`), `archive2-standalone.css should define ${selector}`);
});

[
  'class="toolbar"',
  'class="tabs"',
  'class="grid"',
  'class="card"',
  'class="card-head"',
  'button class="action ',
  'linear-gradient',
  'radial-gradient',
  'backdrop-filter',
  'card-top',
  'card-file-name',
  'fb-search-icon',
].forEach((legacy) => {
  assert(!html.includes(legacy), `assessment-mvp.html should not keep old design/markup ${legacy}`);
});

// Tokens only: the one literal allowed is white text on ink.
const styleBlock = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
const literalColors = (styleBlock.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter((value) => value.toLowerCase() !== '#fff');
assert(literalColors.length === 0, `assessment-mvp.html style should use tokens, found ${literalColors.join(', ')}`);
assert(!/style="/.test(html.slice(html.indexOf('<body'))), 'assessment-mvp.html should not carry inline style attributes');

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
