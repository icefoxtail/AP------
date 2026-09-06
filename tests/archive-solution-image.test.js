const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const wrongPrintEngine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');
const audit = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'scripts', 'audit_archive_batch.mjs'), 'utf8');
const layout = fs.readFileSync(path.join(root, '.codex', 'skills', 'apmath-archive-exams', 'references', 'archive-layout.md'), 'utf8');

for (const [name, source] of [['engine', engine], ['mixed engine', mixedEngine]]) {
  assert(source.includes('function renderSolutionImageHTML(q)'), `${name} should provide a solution-image renderer`);
  assert(source.includes("if (!q || !q.solutionImage) return '';"), `${name} should keep solution images optional`);
  assert(source.includes('.sol-image-wrap img'), `${name} should constrain solution images in print layout`);
  assert(source.includes('q.solutionImageAlt'), `${name} should support accessible alternative text`);
  assert(source.includes('q.solutionImageCaption'), `${name} should support instructional captions`);
  assert(source.includes('const solutionImageHtml = renderSolutionImageHTML(q);'), `${name} should render the solution image outside the chunkable solution body`);
  assert(source.includes('box.dataset.solutionHtml = solutionHtml;'), `${name} should retain only solution text as split input`);
  assert(source.includes('</div>${solutionImageHtml}<div class="sol-exp">${solutionHtml}</div>'), `${name} should render answer, solution image, then solution body`);
  assert(!source.includes('formatSolutionHtml(solutionText) + renderSolutionImageHTML(q)'), `${name} should not append a solution image after solution text`);
  assert(!source.includes('formatSolutionHtml(solText) + renderSolutionImageHTML(q)'), `${name} should not append a solution image after solution text`);
  assert(source.includes('shell.innerHTML = `<div class="sol-meta"><div class="sol-exp"></div></div>`;'), `${name} continuation shells should omit the solution image`);
}

assert(wrongPrintEngine.includes('function renderSolutionImageHTML(q)'), 'wrong print engine should provide a solution-image renderer');
assert(wrongPrintEngine.includes("if (!q || !q.solutionImage) return '';"), 'wrong print engine should keep solution images optional');
assert(wrongPrintEngine.includes('resolveArchiveAssetUrl(q.solutionImage, getQuestionArchiveFile(q))'), 'wrong print engine should resolve solution-image paths against the source archive');
assert(wrongPrintEngine.includes('q.solutionImageAlt'), 'wrong print engine should support accessible alternative text');
assert(wrongPrintEngine.includes('q.solutionImageCaption'), 'wrong print engine should support instructional captions');
assert(wrongPrintEngine.includes("['small', 'medium', 'large', 'full'].includes(q.solutionImageSize)"), 'wrong print engine should preserve the solution-image size contract');
assert(wrongPrintEngine.includes('.sol-image-wrap img'), 'wrong print engine should constrain solution images in print layout');
assert(wrongPrintEngine.includes('</div>${solutionImageHtml}<div class="sol-exp">${solutionHtml}</div>'), 'wrong print engine should render answer, solution image, then solution body');
assert(wrongPrintEngine.includes('shell.innerHTML = `<div class="sol-meta"><div class="sol-exp"></div></div>`;'), 'wrong print continuation shells should omit the solution image');

assert(audit.includes('missing solution image'), 'archive audit should reject missing solution-image assets');
assert(layout.includes('solutionImageSize') && layout.includes('rendered only in solution mode'), 'archive authoring contract should document the solution-only image fields');

console.log('archive solution image contract checks passed');
