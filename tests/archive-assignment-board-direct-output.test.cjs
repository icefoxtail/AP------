const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");

const board = fs.readFileSync("archive/index.html", "utf8");
const worker = fs.readFileSync("apmath/worker-backup/worker/routes/exams.js", "utf8");
const engine = fs.readFileSync("archive/engine.html", "utf8");
const workspace = fs.readFileSync("archive/archive2-workspace.js", "utf8");
function assertMatch(source, pattern, message) {
  assert.equal(pattern.test(source), true, message);
}
function assertNoMatch(source, pattern, message) {
  assert.equal(pattern.test(source), false, message);
}

test("board grouping uses snapshot or source identity and never title as authority", () => {
  const start = board.indexOf("function getArchiveBoardPaperKey");
  const end = board.indexOf("function getArchiveBoardTeacherKey", start);
  const keyBuilder = board.slice(start, end);
  assertMatch(keyBuilder, /archive2_snapshot_hash/, "assignment snapshots must group by immutable hash");
  assertMatch(keyBuilder, /archive_file|source_identity/i, "legacy source grouping must use exact source identity");
  assertNoMatch(keyBuilder, /return `title:/, "title alone must never group output authority");
});

test("board row outputs are tied to an exact assignment and open without the detail dialog", () => {
  assertMatch(board, /data-board-output/, "board must render direct output actions");
  assertMatch(board, /data-assignment-id=/, "board output must be bound to an exact assignment id");
  assertMatch(board, /archiveBoardDirectOutput/, "board click must use the direct output handler");
  assertMatch(board, /\/class-exam-assignments\/\$\{encodeURIComponent\(assignmentId\)\}\/output\?mode=/, "board must request a server envelope for the exact assignment");
  assertMatch(board, /outputRequestId/, "board output URL must carry the exact request ID");
  assertMatch(board, /outputOwnerId/, "board output URL must carry the owner ID");
  const clickHandlerStart = board.indexOf("assignmentBoardList.addEventListener('click'");
  const clickHandlerEnd = board.indexOf("document.getElementById('contentTypeFilter')", clickHandlerStart);
  const clickHandler = board.slice(clickHandlerStart, clickHandlerEnd);
  assertMatch(clickHandler, /finally\s*\{[\s\S]*?if\s*\(button\.isConnected\)\s*button\.disabled\s*=\s*false/, "successful board actions must remain reusable");
  assertMatch(clickHandler, /assignmentBoardState\.actionError\s*=\s*null;[\s\S]*?renderAssignmentBoard\(\)/, "successful retries must clear their visible error state");
  const groupingStart = board.indexOf("function groupArchiveBoardAssignments(");
  const groupingEnd = board.indexOf("function renderAssignmentBoard(", groupingStart);
  const grouping = board.slice(groupingStart, groupingEnd);
  assertMatch(grouping, /row\.has_output_snapshot\s*&&\s*row\.can_read_snapshot\s*===\s*true/, "only the server's snapshot-read authority may select a direct output assignment");
  assertNoMatch(grouping, /outputAssignmentId:\s*row\.has_output_snapshot\s*\?/, "snapshot availability alone must not authorize a button");
});

test("Worker output endpoint enforces class access and builds from its assignment snapshot", () => {
  const start = worker.indexOf("path[3] === 'output'");
  const end = worker.indexOf("path[3] === 'status'", start);
  const outputRoute = worker.slice(start, end);
  assert.notEqual(start, -1);
  assertMatch(outputRoute, /canAccessClass/, "server must authorize the exact class before snapshot read");
  assertMatch(outputRoute, /mixed_payload_json/, "server must use its stored assignment snapshot");
  assertMatch(outputRoute, /createOutputEnvelope/, "server must construct the canonical envelope");
  assertMatch(outputRoute, /validateOutputEnvelope/, "server must verify the envelope hash");
  assertMatch(outputRoute, /canReadAssignmentSnapshot/, "snapshot GET must use its dedicated read authority");
  const boardStart = worker.indexOf("if (method === 'GET' && id === 'board')");
  const boardEnd = worker.indexOf("if (method === 'POST')", boardStart);
  const boardRoute = worker.slice(boardStart, boardEnd);
  assert.notEqual(boardStart, -1);
  assertMatch(boardRoute, /can_read_snapshot/, "board must expose snapshot-read authorization from the server");
  assertMatch(boardRoute, /getAllowedClassIds/, "snapshot-read authority must come from teacher/class IDs");
  assertNoMatch(boardRoute, /can_read_snapshot:[^,\n]*(?:is_mine|can_manage)/, "name-derived flags must not authorize snapshot reads");
});

test("recent assignments expose direct exam, solution, and answer actions", () => {
  assertMatch(workspace, /assignment-output-direct/, "recent assignment cards must expose direct modes");
  assertMatch(workspace, /\[\["exam", "문제"\], \["sol", "해설"\], \["ans", "정답"\]\]/, "recent card must include exam, solution, and answer");
  assertMatch(workspace, /openAssignmentOutput\(b\.dataset\.assignment, b\.dataset\.mode/, "recent modes must bypass assignment details");
});

test("Archive1 keeps its one-click exam/solution/answer actions and output-to-print button", () => {
  for (const mode of ["exam", "sol", "ans"])
    assertMatch(board, new RegExp(`data-action="${mode}"`), `Archive1 card should expose ${mode}`);
  const start = board.indexOf("function openEngine(file, action)");
  const end = board.indexOf("function openExamModeModal", start);
  const action = board.slice(start, end);
  assertMatch(action, /launchIndexExamOutput\(item, action \|\| 'exam', 4\)/, "all Archive1 card modes should open the current-source engine directly");
  assertNoMatch(action, /openExamModeModal/, "exam card action must not add a mode-selection step");
  assertMatch(board, /data-action="assign">반에 출제/, "direct output shortcuts must preserve a separate assignment action");
  assertMatch(action, /openAssignTargetPanel\(item, 4\)/, "assignment action must still open the student target flow");
  assertMatch(engine, /id="btn-print" onclick="safePrint\('vector'\)"/, "the output page should print directly from its toolbar");
});
