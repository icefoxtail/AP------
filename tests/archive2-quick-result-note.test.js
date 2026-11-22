const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { readWorkspacePart } = require("./helpers/archive2-workspace-source.cjs");

// 빠른 평가 결과 칸의 안내는 실제로 열리는 창이 하는 일과 같아야 한다.
// 열리는 창(mixed_engine.html, studio=1)에는 시험지·해설·정답 출력만 있고 보관함 저장·반에 출제 단추가 없다.
// (FIVE_MINUTE_GUARD는 옛 ?recipe= 문제지 만들기 화면의 가드이고 이 창과 관계없다. 빠른 평가 종이는 문제지 만들기 상태를 거치지 않아 저장할 길이 없다.)
test("빠른 평가 결과 안내는 저장·출제를 약속하지 않고 문제지 만들기를 알려 준다", () => {
  const compose = readWorkspacePart("compose");
  const note = compose.match(/<p class="muted qk-r-after">([^<]*)<\/p>/)?.[1] || "";
  assert.match(note, /출력/);
  assert.doesNotMatch(note, /보관함 저장 · 반에 출제를 할 수 있습니다/);
  assert.match(note, /문제지 만들기/);
});

test("빠른 평가가 여는 출력 창에는 저장·출제 단추가 없다", () => {
  const html = fs.readFileSync("archive/mixed_engine.html", "utf8");
  const buttons = [...html.matchAll(/<button\b[^>]*>([^<]*)<\/button>/g)].map((m) => m[1].trim());
  assert.ok(buttons.length > 0);
  const keeps = (label) => /보관함|출제/.test(label) || /저장/.test(label.replace(/PDF 저장/g, ""));
  assert.ok(!buttons.some(keeps), `출력 창 단추: ${buttons.filter(keeps).join(", ")}`);
});
