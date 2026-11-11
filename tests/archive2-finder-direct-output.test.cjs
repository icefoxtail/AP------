const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");

const workspace = fs.readFileSync("archive/archive2-workspace.js", "utf8");

test("Archive2 Finder exposes one-click exam, solution, and answer outputs beside separate issue/select actions", () => {
  // Finder and home rows are drawn by one function (examRowMarkup); renderFind only passes rows to it.
  const start = workspace.indexOf("function examRowMarkup(");
  const end = workspace.indexOf("function openSimilarList(", start);
  const finder = workspace.slice(start, end);
  assert.notEqual(start, -1);
  assert.match(workspace.slice(workspace.indexOf("function renderFind()"), workspace.indexOf("function renderScopes()")), /examRowMarkup\(e, examIndexOf\(e\), \{[\s\S]*?more: true/);
  assert.match(finder, /\[\["exam", "시험지"\], \["sol", "해설"\], \["ans", "정답"\]\]/);
  assert.match(finder, /button\("source-output-direct", label,[\s\S]*?data-mode="\$\{mode\}"/);
  assert.match(finder, /button\("source-issue", "출제"/);
  assert.match(finder, /button\("source-toggle"/);
  // Order of the rendered row: the template, not the helper constants above it.
  const row = finder.slice(finder.indexOf("<article class=\"exam-row"));
  const directActionsIndex = row.indexOf(".map(direct)");
  const issueIndex = row.indexOf('button("source-issue", "출제"');
  const selectionIndex = row.indexOf("${more}");
  assert.ok(directActionsIndex >= 0 && directActionsIndex < issueIndex && issueIndex < selectionIndex,
    "Finder actions should render exam, solution, answer, issue, then question selection");
  assert.doesNotMatch(finder, /source-preview/, "Finder output actions must not retain the modal preview route");
});

test("Finder direct output opens a current-source envelope in the existing engine", () => {
  const start = workspace.indexOf("async function openFinderOutput(");
  const end = workspace.indexOf("function renderHome()", start);
  const action = workspace.slice(start, end);
  assert.notEqual(start, -1);
  assert.match(action, /window\.open\("about:blank"/);
  assert.match(action, /buildOriginalSourceOutput\(exam, safeMode, settings, false\)/);
  assert.match(action, /popup\.location\.href\s*=\s*output\.url\.href/);
  assert.match(workspace, /O\.publishOutputEnvelope\(/);
  assert.match(workspace, /O\.outputEnvelopeUrl\("engine\.html"/);
  const clickStart = workspace.indexOf("document.addEventListener(\"click\"");
  const clickEnd = workspace.indexOf("document.addEventListener(\"submit\"", clickStart);
  const clickHandler = workspace.slice(clickStart, clickEnd);
  assert.match(clickHandler, /a === "source-output-direct"[\s\S]*?openFinderOutput\(/);
  assert.doesNotMatch(clickHandler, /source-output-direct[\s\S]{0,180}openOriginalIssue/);
});
