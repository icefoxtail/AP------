import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'archive/engine.html',
  'archive/mixed_engine.html',
  'archive/mixer.html',
  'apmath/wrong_print_engine.html'
];

for (const relativePath of files) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  assert.match(source, /vendor\/mathjax-tex-font\/tex-mml-chtml-mathjax-tex\.js/,
    `${relativePath} should load the vendored MathJax 4 bundle first`);
  assert.match(source, /mathjax@4\.1\.3\/tex-chtml\.js/,
    `${relativePath} should retain the verified CDN fallback`);
  assert.doesNotMatch(source, /mathjax@3\/es5/,
    `${relativePath} should not load the MathJax 3 ES5 bundle`);
  assert.match(source, /<script id="MathJax-script" defer/,
    `${relativePath} should load MathJax after its configuration in document order`);
  assert.match(source, /font:\s*'mathjax-tex'/,
    `${relativePath} should preserve the v3-era math font metrics`);
  assert.match(source, /paths:\s*\{\s*mathjax:\s*'\/archive\/vendor\/mathjax',\s*'mathjax-tex':\s*'\/archive\/vendor\/mathjax-tex-font'/,
    `${relativePath} should resolve MathJax extensions and fonts locally`);
  assert.match(source, /load:\s*\['\[tex\]\/boldsymbol'\]/,
    `${relativePath} should explicitly load the MathJax 4 boldsymbol extension`);
  assert.match(source, /__AP_MATHJAX_SOURCE__\s*=\s*'local'/,
    `${relativePath} should expose the active MathJax source for diagnostics`);
  assert.match(source, /__AP_MATHJAX_READY__\s*=\s*new Promise/,
    `${relativePath} should block initial rendering until local or fallback MathJax is loaded`);
  assert.match(source, /__AP_LOAD_MATHJAX_CDN__/,
    `${relativePath} should create a fresh CDN fallback script after a local load failure`);
  assert.match(source, /displayOverflow:\s*'linebreak'/,
    `${relativePath} should line-break wide display expressions`);
  assert.match(source, /linebreaks:\s*\{\s*inline:\s*true,\s*width:\s*'100%'/,
    `${relativePath} should allow inline and display math to use the container width`);
  assert.match(source, /startup:\s*\{\s*typeset:\s*false\s*\}/,
    `${relativePath} should retain manual promise-based typesetting`);
  assert.match(source, /typesetPromise/,
    `${relativePath} should use the promise-based MathJax API`);
}

assert.ok(fs.existsSync(path.join(root, 'archive/vendor/mathjax/sre/speech-worker.js')),
  'vendored MathJax should include its speech worker so typesetPromise can settle offline');
assert.ok(fs.existsSync(path.join(root, 'archive/vendor/mathjax-tex-font/chtml/woff2/mjx-tex-n.woff2')),
  'vendored MathJax should include the primary TeX webfont');

console.log('archive MathJax 4 configuration test passed');
