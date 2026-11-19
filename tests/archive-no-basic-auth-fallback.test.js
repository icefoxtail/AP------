const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// 교사 로그인의 인증은 토큰(Bearer)뿐이다. archive 화면은 저장된 raw_password를 읽거나 Basic 헤더를 만들지 않는다.
// 이유: 비밀번호 원문은 저장하지 않게 되어 있어 "토큰이 없으면 Basic" 분기는 죽은 호환 코드이고, 비밀번호를 다루는 코드를 줄이기 위해서다.
const archiveRoot = path.resolve(__dirname, '..', 'archive');
const SKIP_DIRS = new Set(['exams', 'textbook', 'vendor', 'tools', 'node_modules']);
// 다른 PR(시험지 보관함)에서 수정 중이라 이번 범위에서 뺀 파일. 그 PR이 끝나면 이 목록에서 지운다.
const EXCLUDED = new Map([
  ['assessment/assessment-mvp.html', '시험지 보관함 PR(#2568/#2569) 진행 중 — 후속 PR에서 정리'],
  ['assessment/assessment-pack-core.js', '시험지 보관함 PR(#2569) 진행 중 — 후속 PR에서 정리']
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (/\.(js|html|mjs|cjs)$/.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

test('archive 화면은 저장된 비밀번호 읽기와 Basic 인증 헤더 생성이 없다', () => {
  const offenders = [];
  for (const file of walk(archiveRoot)) {
    const rel = path.relative(archiveRoot, file).split(path.sep).join('/');
    if (EXCLUDED.has(rel)) continue;
    const text = fs.readFileSync(file, 'utf8');
    // 저장 전에 raw_password를 지우는 정리 코드(delete safe.raw_password)는 허용한다.
    const stripped = text.replace(/delete\s+\w+\.raw_password\s*;?/g, '');
    const checks = [
      ['raw_password', /raw_password/],
      ['__APMATH_AUTH_MEMORY', /__APMATH_AUTH_MEMORY/],
      ['Basic 헤더', /['"`]Basic\s['"`]|['"`]Basic\s*\$\{|Authorization['"]?\s*:\s*['"`]Basic/],
      ['btoa(아이디:비밀번호)', /btoa\([^)]*:[^)]*(?:password|Password|pw)/]
    ];
    for (const [label, re] of checks) {
      if (re.test(stripped)) offenders.push(`${rel}: ${label}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('토큰이 없는 세션은 Bearer 헤더 대신 null을 돌려준다(화면 코드 문자열 확인)', () => {
  for (const [file, fn] of [
    ['index.html', 'getIndexAssignmentAuthHeader'],
    ['engine.html', 'getAssignmentAuthHeader'],
    ['mixed_engine.html', 'getAssignmentAuthHeader'],
    ['mixer.html', 'getMixerAssignmentAuthHeader']
  ]) {
    const text = fs.readFileSync(path.join(archiveRoot, file), 'utf8');
    const start = text.indexOf(`function ${fn}(`);
    assert.ok(start >= 0, `${file}: ${fn}`);
    const body = text.slice(start, text.indexOf('\n}\n', start));
    assert.match(body, /'Bearer '/);
    assert.doesNotMatch(body, /Basic/);
  }
});
