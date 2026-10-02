const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");

const workspace = fs.readFileSync("archive/archive2-workspace.js", "utf8");

test("Archive2 Finder exposes one-click exam, solution, and answer outputs beside separate issue/select actions", () => {
  const start = workspace.indexOf("function renderFind()");
  const end = workspace.indexOf("function renderScopes()", start);
  const finder = workspace.slice(start, end);
  assert.notEqual(start, -1);
  assert.match(finder, /\[\["exam", "시험"\], \["sol", "해설"\], \["ans", "정답"\]\]/);
  assert.match(finder, /button\("source-output-direct", label,[\s\S]*?data-mode="\$\{mode\}"/);
  assert.match(finder, /button\("source-issue", "바로 출제"/);
  assert.match(finder, /button\("source-toggle"/);
  assert.doesNotMatch(finder, /source-preview/, "Finder output actions must not retain the modal preview route");
});

test("Finder direct output opens a current-source envelope in the existing engine", () => {
  const start = workspace.indexOf("async function openFinderOutput(");
  const end = workspace.indexOf("function renderHome()", start);
  const action = workspace.slice(start, end);
  assert.notEqual(start, -1);
  assert.match(action, /window\.open\("about:blank"/);
  assert.match(action, /buildOriginalSourceOutput\(exam, safeMode, settings\)/);
  assert.match(action, /popup\.location\.href\s*=\s*output\.url\.href/);
  assert.match(workspace, /O\.publishOutputEnvelope\(/);
  assert.match(workspace, /O\.outputEnvelopeUrl\("engine\.html"/);
  const clickStart = workspace.indexOf("document.addEventListener(\"click\"");
  const clickEnd = workspace.indexOf("document.addEventListener(\"submit\"", clickStart);
  const clickHandler = workspace.slice(clickStart, clickEnd);
  assert.match(clickHandler, /a === "source-output-direct"[\s\S]*?openFinderOutput\(/);
  assert.doesNotMatch(clickHandler, /source-output-direct[\s\S]{0,180}openOriginalIssue/);
});
