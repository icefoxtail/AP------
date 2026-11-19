const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// 문제지 만들기에서 제목을 바꾸면(출력 설정의 제목 칸, 머리글 칸 모두) 화면 맨 위 제목도 바로 새 이름을 보여 준다.
const js = fs.readFileSync(path.resolve(__dirname, '..', 'archive', 'archive2-workspace.js'), 'utf8');

test('제목 변경은 두 경로 모두 상단 제목을 갱신하는 같은 함수를 부른다', () => {
  assert.match(js, /function syncComposeHeading\(\) \{[\s\S]*?heading\.firstChild\.textContent = state\.title \+ " ";/);
  const output = js.slice(js.indexOf('function changeOutput(el) {'));
  const body = output.slice(0, output.indexOf('document.addEventListener("compositionstart"'));
  assert.match(body, /state\.title = s\.header\.title;\s*syncComposeHeading\(\);/);
  assert.match(js, /if \(el\.dataset\.header === "title"\) \{\s*state\.title = el\.value;\s*syncComposeHeading\(\);/);
});
