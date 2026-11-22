// 재촬영 대상 목록(--list)이 읽기 전용이고 결정적이며, 못 읽은 기록을 unparsed 로 정직하게 남기는지 가볍게 본다.
// 운영 데이터 개수는 고정하지 않는다(승인 기록이 늘어도 깨지지 않게).
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = args => spawnSync(process.execPath, ["tools/recapture-approved-renders.mjs", ...args], { cwd: REPO, encoding: "utf8", maxBuffer: 1 << 26 });

test("--list 출력은 두 번 실행해도 같고, 후보는 읽은 것과 못 읽은 것으로 빠짐없이 나뉜다", () => {
  const first = run(["--list"]);
  const second = run(["--list"]);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(first.stdout, second.stdout, "결정적이어야 한다");
  const list = JSON.parse(first.stdout);
  assert.equal(list.schema, "recapture-list-v1");
  assert.ok(Array.isArray(list.unparsed), "unparsed 가 명시되어야 한다");
  assert.equal(list.summary.candidateJsonFiles, list.records.length + list.unparsed.length, "조용히 누락된 후보가 없다");
  assert.equal(list.summary.parsedRecords, list.records.length);
  assert.equal(list.summary.unparsedRecords, list.unparsed.length);
  for (const item of list.unparsed) {
    assert.ok(item.path && item.reason && item.kind, "unparsed 항목은 경로·사유·종류를 가진다");
  }
  for (const record of list.records) {
    assert.ok(record.recordPath && record.sealedFileCount > 0);
    for (const file of record.differingFromRef) assert.ok(["BYTES_DIFFER", "MISSING_IN_REF"].includes(file.state));
    for (const shot of record.screenshots) assert.notEqual(shot.sha256Matches, false, `${shot.repoPath} 해시가 기록과 다르다`);
  }
});

test("--capture 는 아직 구현되지 않아 0이 아닌 종료 코드로 알린다", () => {
  const result = run(["--capture"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /A2/);
});

test("인자가 없으면 사용법을 알리고 0이 아닌 종료 코드를 준다", () => {
  const result = run([]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /usage/);
});
