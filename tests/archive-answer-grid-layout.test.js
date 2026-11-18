const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const engines = ['engine.html', 'mixed_engine.html'];
const shared = fs.readFileSync(path.join(root, 'archive', 'render-text.js'), 'utf8');

for (const filename of engines) {
  test(`${filename} expands answer rows for tall math`, () => {
    const html = fs.readFileSync(path.join(root, 'archive', filename), 'utf8');

    assert.match(html, /\.ans-cell\s*\{[^}]*min-height:\s*40px;[^}]*height:\s*auto;/s);
    assert.match(html, /\.ans-v\s*\{[^}]*line-height:\s*1\.5;[^}]*overflow-wrap:\s*anywhere;/s);
    // formatGridAnswer 본문(' / (2)' 앞 줄바꿈 포함)은 두 엔진이 같이 쓰는 render-text.js에 있고 HTML에는 위임 한 줄뿐이다.
    assert.match(html, /function formatGridAnswer\(answer\) \{ return APRenderText\.formatGridAnswer\(answer\); \}/);
    assert.match(shared, /replace\(\/\\s\+\\\/\\s\+\(\?=\\\(\\d\+\\\)\)\/g, '<br>'\)/);
    assert.match(html, /async function fitAnswerPages\(area, data(?:,\s*ctx\s*=\s*null)?\)/);
    assert.match(html, /if \(AppState\.mode === 'ans'\)[\s\S]{0,80}await fitAnswerPages\(area, AppState\.data(?:,\s*ctx)?\)/);
  });
}
