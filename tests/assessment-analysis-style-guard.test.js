const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const analysisPath = path.join(root, 'archive', 'assessment', 'assessment-analysis.html');
const analysisHtml = fs.readFileSync(analysisPath, 'utf8');
const sharedCss = fs.readFileSync(path.join(root, 'archive', 'archive2-standalone.css'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// The analysis page wears the Archive 2.0 frame: tokens, standalone shapes, the shared menu.
[
  'class="archive2-standalone archive2-assessment archive2-shell"',
  '../archive2-tokens.css',
  '../archive2-standalone.css',
  '../archive2-navigation.css',
  '../archive2-navigation.js',
  '../archive2-session.js',
  'data-archive-navigation="standalone"',
  'data-archive-base="../"',
  'data-archive-view="saved"',
  'class="sa-main content-wrap"',
  '.action-btn',
  '.result-btn',
].forEach((requiredStyle) => {
  assert(analysisHtml.includes(requiredStyle), `assessment-analysis.html should use the Archive 2.0 frame marker: ${requiredStyle}`);
});

// The shared card family lives in archive2-standalone.css.
['.exam-card', '.card-body', '.card-grade-row', '.card-main-title', '.meta-badge', '.card-type-chip', '.empty-state'].forEach((selector) => {
  assert(sharedCss.includes(`body.archive2-assessment ${selector}`), `archive2-standalone.css should define ${selector} for the assessment pages`);
});

[
  'https://cdn',
  'http://cdn',
  'unpkg.com',
  'jsdelivr',
  'tailwind',
  'bootstrap',
  'class="toolbar"',
  'class="tabs"',
  'class="grid"',
  'class="card"',
  'button class="action ',
  'linear-gradient',
  'radial-gradient',
  'box-shadow',
].forEach((forbiddenStyle) => {
  assert(!analysisHtml.includes(forbiddenStyle), `assessment-analysis.html should not introduce standalone/CDN/SaaS/old-design marker: ${forbiddenStyle}`);
});

// No hard-coded colors in the page style: tokens only (white text on ink is the only literal).
const styleBlock = analysisHtml.slice(analysisHtml.indexOf('<style>'), analysisHtml.indexOf('</style>'));
const literalColors = (styleBlock.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter((value) => value.toLowerCase() !== '#fff');
assert(literalColors.length === 0, `assessment-analysis.html style should use tokens, found ${literalColors.join(', ')}`);
assert(!/style="/.test(analysisHtml.slice(analysisHtml.indexOf('<body'))), 'assessment-analysis.html should not carry inline style attributes');

[
  'assessment_analysis_snapshots',
  'assessment_report_snapshots',
  'premium',
  'report snapshot',
  '학부모 발송',
  '/api/',
  'fetch(',
].forEach((forbiddenBehavior) => {
  assert(!analysisHtml.includes(forbiddenBehavior), `assessment-analysis.html should not add backend/premium/report behavior: ${forbiddenBehavior}`);
});

assert(
  analysisHtml.includes('.result-btn.is-selected[data-status="correct"]') &&
  analysisHtml.includes('var(--good)') &&
  analysisHtml.includes('.result-btn.is-selected[data-status="wrong"]') &&
  analysisHtml.includes('var(--danger)') &&
  !analysisHtml.includes('.result-btn.is-selected[data-status="partial"]') &&
  !analysisHtml.includes('data-status="partial"'),
  'assessment-analysis.html should keep clear O/X selected states only'
);

// Internal names are not shown to teachers.
['sourceFile</th>', 'sourceQuestionNo</th>', '내부 상세', '내부용 분석표'].forEach((internal) => {
  assert(!analysisHtml.includes(internal), `assessment-analysis.html should not show internal wording: ${internal}`);
});

console.log('assessment analysis style guard checks passed');
