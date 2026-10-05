const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'archive', 'render-authority.css'), 'utf8');

test('shared semantic CSS covers question, choice, asset, solution, and table contracts', () => {
  for (const selector of ['.q-content', '.q-image-wrap img', '.choices', '.choice-item', '.sol-meta', '.sol-ans', '.sol-exp', '.sol-image-wrap img', '.sol-image-caption', '.q-content table']) {
    assert.match(css, new RegExp(selector.replace(/[.]/g, '\\.')));
  }
});

test('legacy engines retain the semantic classes required for staged CSS adoption', () => {
  for (const file of ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/wrong_print_engine.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const className of ['q-content', 'q-image-wrap', 'choices', 'choice-item', 'sol-meta', 'sol-ans', 'sol-exp', 'sol-image-wrap']) {
      assert.match(html, new RegExp(className), `${file} lacks ${className}`);
    }
  }
});
