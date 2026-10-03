const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const read = (path) => readFileSync(path, "utf8");
const controls = read("archive/archive2-reader-controls.js");
const css = read("archive/archive2-reader-controls.css");
const engine = read("archive/engine.html");
const mixed = read("archive/mixed_engine.html");
const library = read("archive/archive2-library.js");
const workspace = read("archive/archive2-workspace.js");
const fastRuntime = read("archive/common-fast-runtime.js");
const browserSmoke = read("tests/fixtures/archive2-output-browser-smoke.html");
const workspaceHtml = read("archive/workspace.html");

test("standalone readers expose only the compact mobile back/mode/more controls", () => {
  assert.match(controls, /root\.parent !== root \|\| params\.get\("preview"\) === "1"/);
  for (const id of ["archive2-reader-back", "archive2-reader-mode", "archive2-reader-more", "archive2-reader-print", "archive2-reader-open"])
    assert.match(controls, new RegExp(`id=\\"${id}\\"`));
  assert.match(controls, /\["exam", "시험"\][\s\S]*\["sol", "해설"\][\s\S]*\["ans", "정답"\]/);
  assert.match(css, /grid-template-columns: 98px minmax\(0, 1fr\) 48px/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /max-width: 640px/);
  assert.match(engine, /archive2-reader-controls\.js\?v=20261003-reader-controls-s1-1/);
  assert.match(mixed, /archive2-reader-controls\.js\?v=20261003-reader-controls-s1-1/);
  assert.match(mixed, /common-fast-runtime\.js\?v=20261003-reader-controls-s1-2/);
  assert.match(workspaceHtml, /archive2-library\.js\?v=20261003-compose-save-continuity-1/);
  assert.match(workspaceHtml, /archive2-workspace\.js\?v=20261003-compose-save-continuity-2/);
});

test("preview stays embedded and mode actions do not reset an iframe", () => {
  assert.match(controls, /root\.parent !== root \|\| params\.get\("preview"\) === "1"/);
  assert.doesNotMatch(controls, /iframe\.src|location\.reload|fetch\(/);
  assert.doesNotMatch(mixed, /archive2-output-envelope \.mode-tabs\s*\{\s*display:\s*none/);
  assert.match(mixed, /publishOutputEnvelopeMode\(current, mode\)/);
  assert.match(engine, /publishOutputEnvelopeMode\(current, mode\)/);
  assert.match(fastRuntime, /async visible\(ctx\)[\s\S]*await policy\.visible\?\.\(ctx\)[\s\S]*ctx\.snapshot\.geometry = geometry\(ctx\.snapshot\.rootNode\)/);
  assert.match(fastRuntime, /runtime\.activeSnapshot[\s\S]*snapshot\.geometry = geometry\(snapshot\.rootNode\)/);
  const mixedModeStart = mixed.indexOf("async function switchMode(mode)");
  const mixedModeEnd = mixed.indexOf("function changeQpp", mixedModeStart);
  const mixedMode = mixed.slice(mixedModeStart, mixedModeEnd);
  assert.ok(mixedMode.indexOf("AppState.outputEnvelope") < mixedMode.indexOf("window.mixedFastHost"),
    "strict Envelope mode changes must bypass the legacy fast renderer branch");
});

test("Finder, Saved Paper, and Assignment print URLs are standalone outputs", () => {
  assert.match(workspace, /buildOriginalSourceOutput\(exam, safeMode, settings, false\)/);
  assert.match(workspace, /originalOutputUrl\("exam", false\)/);
  assert.match(library, /outputUrl\(paper, envelope, envelope\.mode, false\)/);
  assert.match(workspace, /outputEnvelopeUrl\("mixed_engine\.html", location\.href, envelope, \{\s*studio: true,\s*assignmentId,/);
});

test("browser smoke can verify preview-only rendering inside an iframe", () => {
  assert.match(browserSmoke, /const preview = params\.get\("preview"\) === "1"/);
  assert.match(browserSmoke, /const embedded = params\.get\("embed"\) === "1"/);
  assert.match(browserSmoke, /\{ studio: true, preview \}/);
  assert.match(browserSmoke, /frame\.id = "archive2-preview-frame"/);
  assert.match(browserSmoke, /params\.get\("popup"\) === "1"/);
  assert.match(browserSmoke, /button\.addEventListener\("click", \(\) => window\.open\(url\.href, "_blank"\)\)/);
});
