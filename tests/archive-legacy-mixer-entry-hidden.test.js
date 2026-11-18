const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// 옛 믹서(상/중/하 필터)는 입구만 숨긴다: 눌러서 들어가는 링크가 없어야 하고, 파일 자체는 남는다.
test('아카이브 첫 화면과 리포트센터에는 옛 믹서(mixer.html)로 가는 링크가 없다', () => {
  assert.doesNotMatch(read('archive/index.html'), /mixer\.html/);
  assert.doesNotMatch(read('apmath/js/report-center.js'), /mixer\.html|ARCHIVE_MIXER_URL/);
  assert.match(read('archive/index.html'), /workspace\.html\?view=compose/);
  assert.ok(fs.existsSync(path.join(root, 'archive', 'mixer.html')), 'mixer.html itself stays for saved addresses');
});
