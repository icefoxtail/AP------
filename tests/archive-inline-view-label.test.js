const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const protocol = fs.readFileSync(
  path.join(root, 'archive', '코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.1.md'),
  'utf8'
);

test('view blocks are recognized only at a string or line boundary', () => {
  assert.ok(
    engine.includes('(^|(?:<br\\s*\\/?>\\s*)+)(?:\\[보기\\]|&lt;보기&gt;|<보기>'),
    '보기 블록 정규화는 문자열 시작 또는 <br> 뒤에서만 시작해야 한다'
  );
  assert.ok(
    !engine.includes('((?:<br\\s*\\/?>\\s*)*)(?:\\[보기\\]|&lt;보기&gt;|<보기>'),
    '0개 줄바꿈을 허용하는 과거 정규식은 발문 중간을 오인한다'
  );
});

test('archive has no inline bracketed view labels', () => {
  const result = spawnSync(process.execPath, ['archive/tools/view-label-lint.mjs', '--json'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout || result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.failures, 0);
});

test('protocol distinguishes inline words from standalone view labels', () => {
  assert.match(protocol, /INLINE VIEW LABEL LOCK/);
  assert.match(protocol, /조사가 붙어 문장 성분으로 쓰인 경우[^\n]*평문 `보기`/);
  assert.match(protocol, /node archive\/tools\/view-label-lint\.mjs/);
});
