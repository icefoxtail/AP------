const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const engines = ['engine.html', 'mixed_engine.html'];

for (const filename of engines) {
  test(`${filename} expands answer rows for tall math`, () => {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');

    assert.match(html, /\.ans-cell\s*\{[^}]*min-height:\s*40px;[^}]*height:\s*auto;/s);
    assert.match(html, /\.ans-v\s*\{[^}]*line-height:\s*1\.5;[^}]*overflow-wrap:\s*anywhere;/s);
    assert.match(html, /function formatGridAnswer\(answer\)/);
    assert.match(html, /replace\(\/\\s\+\\\/\\s\+\(\?=\\\(\\d\+\\\)\)\/g, '<br>'\)/);
    assert.match(html, /async function fitAnswerPages\(area, data\)/);
    assert.match(html, /if \(AppState\.mode === 'ans'\)[\s\S]{0,80}await fitAnswerPages\(area, AppState\.data\)/);
  });
}
