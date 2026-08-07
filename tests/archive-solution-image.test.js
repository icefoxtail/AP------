const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const audit = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'scripts', 'audit_archive_batch.mjs'), 'utf8');
const layout = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'references', 'archive-layout.md'), 'utf8');

for (const [name, source] of [['engine', engine], ['mixed engine', mixedEngine]]) {
  assert(source.includes('function renderSolutionImageHTML(q)'), `${name} should provide a solution-image renderer`);
  assert(source.includes("if (!q || !q.solutionImage) return '';"), `${name} should keep solution images optional`);
  assert(source.includes('formatSolutionHtml(solutionText) + renderSolutionImageHTML(q)') || source.includes('formatSolutionHtml(solText) + renderSolutionImageHTML(q)'), `${name} should append solution images only while rendering solutions`);
  assert(source.includes('.sol-image-wrap img'), `${name} should constrain solution images in print layout`);
  assert(source.includes('q.solutionImageAlt'), `${name} should support accessible alternative text`);
  assert(source.includes('q.solutionImageCaption'), `${name} should support instructional captions`);
}

assert(audit.includes('missing solution image'), 'archive audit should reject missing solution-image assets');
assert(layout.includes('solutionImageSize') && layout.includes('rendered only in solution mode'), 'archive authoring contract should document the solution-only image fields');

console.log('archive solution image contract checks passed');
