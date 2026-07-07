import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/archive-render.js'), 'utf8');
const context = { window: {} };
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/archive-render.js' });

const render = context.ApArchiveRender;
assert.ok(render);
assert.equal(render.ARCHIVE_BASE_URL, 'https://icefoxtail.github.io/AP------/archive/');
assert.equal(render.normalizeArchiveFile('exam-a'), 'exams/exam-a.js');
assert.equal(render.normalizeArchiveFile('archive/assets/images/q1.png'), 'assets/images/q1.png.js');

assert.equal(
  render.resolveArchiveAssetUrl('assets/images/q1.png', 'exams/final-a.js'),
  'https://icefoxtail.github.io/AP------/archive/assets/images/q1.png'
);
assert.equal(
  render.resolveArchiveAssetUrl('q1.png', 'exams/2026/final-a.js'),
  'https://icefoxtail.github.io/AP------/archive/exams/2026/q1.png'
);

const rewritten = render.rewriteImgSrcInHtml('<p><img src="q1.png"></p>', 'exams/2026/final-a.js');
assert.match(rewritten, /loading="eager"/);
assert.match(rewritten, /decoding="async"/);
assert.match(rewritten, /https:\/\/icefoxtail\.github\.io\/AP------\/archive\/exams\/2026\/q1\.png/);

const rich = render.wrapLatex('<table><tr><td>x & y</td></tr></table><img src="q1.png">\\(x+1\\)');
assert.match(rich, /<table>/);
assert.match(rich, /<img src="q1\.png">/);
assert.match(rich, /\$x\+1\$/);

console.log('archive render module test passed');
