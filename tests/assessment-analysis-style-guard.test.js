const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const analysisPath = path.join(root, 'archive', 'assessment', 'assessment-analysis.html');
const analysisHtml = fs.readFileSync(analysisPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

[
  'class="content-wrap"',
  '.exam-card',
  'border-radius: 22px',
  'background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 100%)',
  'box-shadow: var(--shadow-card)',
  '--shadow-card: 0 14px 32px rgba(15, 23, 42, 0.06)',
  '.card-top',
  'linear-gradient(90deg, var(--blue-main) 0%, #7db8ff 100%)',
  '.action-btn',
  'min-height: 48px',
  '.action-btn + .action-btn',
  '.action-btn:hover',
  '.meta-badge',
  '.card-type-chip',
].forEach((requiredStyle) => {
  assert(analysisHtml.includes(requiredStyle), `assessment-analysis.html should reuse archive card/button style marker: ${requiredStyle}`);
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
].forEach((forbiddenStyle) => {
  assert(!analysisHtml.includes(forbiddenStyle), `assessment-analysis.html should not introduce standalone/CDN/SaaS style marker: ${forbiddenStyle}`);
});

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
  analysisHtml.includes('var(--archive-green)') &&
  analysisHtml.includes('.result-btn.is-selected[data-status="wrong"]') &&
  analysisHtml.includes('var(--archive-red)') &&
  !analysisHtml.includes('.result-btn.is-selected[data-status="partial"]') &&
  !analysisHtml.includes('data-status="partial"'),
  'assessment-analysis.html should keep clear O/X selected states only'
);

console.log('assessment analysis style guard checks passed');
