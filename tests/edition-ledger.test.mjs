// 판본 장부(추가 전용)의 형식·검증·추가 전용 대조, 그리고 문항 필드 층 목록의 관계를 고정한다.
// 운영 데이터 개수는 고정하지 않는다. 결함 조건(거절해야 할 행, 깨진 관계)만 검사한다.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEDGER_PATH, parseLedger, validateLedger, serializeLedger, checkAppendOnly, checkAgainstGit, lookup, computeRowId, canonicalRow
} from "../tools/edition-ledger.mjs";

const require = createRequire(import.meta.url);
const layers = require("../archive/question-field-layers.js");
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const h40 = ch => ch.repeat(40);
const h64 = ch => ch.repeat(64);

function withId(row) {
  return { ...row, id: computeRowId(row) };
}
function rendererRow(over = {}) {
  return withId({
    kind: "renderer",
    id: "",
    path: "archive/engine.html",
    sealed: { gitBlobSha1: h40("a"), sha256: h64("1"), bytes: 1000 },
    edition: { gitBlobSha1: h40("b"), sha256: h64("2"), bytes: 1010 },
    evidence: { type: "PNG_BYTE_IDENTICAL", ref: "docs/operations/example/recapture.json" },
    addedAt: "2026-11-18",
    addedByPr: 1,
    note: "example",
    ...over
  });
}
function sourceRow(over = {}) {
  return withId({
    kind: "source",
    id: "",
    path: "archive/exams/original/high/h1/1final/example.js",
    questionKey: "q7",
    sealed: { gitBlobSha1: h40("c") },
    edition: { gitBlobSha1: h40("d") },
    binding: { version: "text-v1", fingerprint: h64("e") },
    changedFields: ["layoutTag", "solution"],
    addedAt: "2026-11-18",
    ...over
  });
}
const ledger = (...rows) => ({ schemaVersion: 1, rows });
const codes = result => result.errors.map(error => error.code);

test("정상 행 두 종류(renderer, source)가 통과하고 정규형 직렬화가 왕복한다", () => {
  const good = ledger(rendererRow(), sourceRow());
  assert.deepEqual(validateLedger(good).errors, []);
  const text = serializeLedger(good);
  assert.ok(text.endsWith("\n"));
  assert.equal(text.split("\n").length, 1 + 2 + 1 + 1, "머리 1줄 + 행당 한 줄 + 꼬리 1줄 + 끝 개행");
  const back = parseLedger(text);
  assert.deepEqual(validateLedger(back, { text }).errors, []);
  assert.equal(serializeLedger(back), text);
  assert.equal(serializeLedger(ledger()), '{"schemaVersion":1,"rows":[]}\n');
});

test("SCREEN_JUDGMENT 는 judgedBy 가 있으면 통과한다", () => {
  const row = rendererRow({ evidence: { type: "SCREEN_JUDGMENT", ref: "docs/operations/example/judgment.md", judgedBy: "control-room" } });
  assert.deepEqual(validateLedger(ledger(withId(row))).errors, []);
});

test("거절: 모르는 kind, SCREEN_JUDGMENT 인데 judgedBy 없음, 증거 종류 오류", () => {
  assert.ok(codes(validateLedger(ledger({ kind: "other", id: "x", addedAt: "2026-11-18" }))).includes("UNKNOWN_KIND"));
  const noJudge = withId(rendererRow({ evidence: { type: "SCREEN_JUDGMENT", ref: "docs/operations/example/judgment.md" } }));
  assert.ok(codes(validateLedger(ledger(noJudge))).includes("MISSING_JUDGED_BY"));
  const badType = withId(rendererRow({ evidence: { type: "TRUST_ME", ref: "docs/operations/example/x.md" } }));
  assert.ok(codes(validateLedger(ledger(badType))).includes("BAD_EVIDENCE_TYPE"));
});

test("거절: source 행 changedFields 에 발문·보기 필드가 하나라도 있으면", () => {
  for (const field of ["content", "question", "stem", "choices"]) {
    const row = withId(sourceRow({ changedFields: ["layoutTag", field] }));
    assert.ok(codes(validateLedger(ledger(row))).includes("CHANGED_BINDING_FIELD"), field);
  }
  assert.ok(codes(validateLedger(ledger(withId(sourceRow({ changedFields: [] }))))).includes("BAD_FIELD"));
});

test("거절: 중복 id, id 불일치, 봉인과 같은 판본, 알 수 없는 키", () => {
  const row = rendererRow();
  assert.ok(codes(validateLedger(ledger(row, { ...row }))).includes("DUPLICATE_ID"));
  assert.ok(codes(validateLedger(ledger({ ...row, id: "0000000000000000" }))).includes("ID_MISMATCH"));
  const same = withId(sourceRow({ edition: { gitBlobSha1: h40("c") } }));
  assert.ok(codes(validateLedger(ledger(same))).includes("EDITION_EQUALS_SEALED"));
  const extra = { ...rendererRow(), surprise: 1 };
  assert.ok(codes(validateLedger(ledger(extra))).includes("UNKNOWN_FIELD"));
});

test("거절: 정규형이 아닌 직렬화(키 순서·들여쓰기·끝 개행)", () => {
  const good = ledger(rendererRow());
  const canonical = serializeLedger(good);
  const reordered = JSON.stringify({ schemaVersion: 1, rows: [{ id: good.rows[0].id, kind: "renderer", ...Object.fromEntries(Object.entries(good.rows[0]).filter(([key]) => key !== "kind" && key !== "id")) }] }) + "\n";
  for (const text of [reordered, canonical.trimEnd(), JSON.stringify(good, null, 2) + "\n"]) {
    const result = validateLedger(parseLedger(text), { text });
    assert.ok(codes(result).includes("NOT_CANONICAL"), text.slice(0, 60));
  }
});

test("추가 전용: 끝에 덧붙이기는 통과, 삭제·수정·재정렬·중간 삽입은 사유 코드로 거절", () => {
  const a = rendererRow();
  const b = sourceRow();
  const c = rendererRow({ path: "archive/mixed_engine.html" });
  const base = ledger(a, b);
  assert.deepEqual(checkAppendOnly(base, ledger(a, b, c)).errors, []);
  assert.deepEqual(checkAppendOnly(ledger(), ledger(a)).errors, []);
  assert.deepEqual(checkAppendOnly(base, base).errors, []);
  assert.deepEqual(codes(checkAppendOnly(base, ledger(a))), ["ROW_DELETED"]);
  assert.deepEqual(codes(checkAppendOnly(base, ledger(a, { ...b, note: "edited" }))), ["ROW_MODIFIED"]);
  assert.deepEqual(codes(checkAppendOnly(base, ledger(b, a))), ["ROW_REORDERED"]);
  assert.deepEqual(codes(checkAppendOnly(base, ledger(a, c, b))), ["ROW_INSERTED_IN_MIDDLE"]);
  assert.deepEqual(codes(checkAppendOnly(base, ledger(c, a, b))), ["ROW_INSERTED_IN_MIDDLE"]);
  assert.ok(checkAppendOnly(base, ledger()).errors.every(error => error.code === "ROW_DELETED"));
});

test("lookup: 조건에 맞는 행을 장부 순서대로 돌려준다", () => {
  const a = rendererRow();
  const b = sourceRow();
  const book = ledger(a, b);
  assert.deepEqual(lookup(book, { kind: "renderer", path: "archive/engine.html", sealedBlob: h40("a"), editionBlob: h40("b") }), [a]);
  assert.deepEqual(lookup(book, { kind: "source", questionKey: "q7", sealedBlob: h40("c") }), [b]);
  assert.deepEqual(lookup(book, { kind: "source", questionKey: "q8" }), []);
  assert.deepEqual(lookup(book, {}), [a, b]);
});

test("git 대조(함수 단위): base 없음은 새 파일로 통과, base 를 못 풀면 명확한 오류", () => {
  const head = serializeLedger(ledger(rendererRow()));
  const present = "docs/operations/edition-ledger/ledger-v1.json\n";
  const fake = ({ rev = 0, mb = 0, ls = 0, lsOut = present, lsErr = "", show = "", showStatus = 0, showErr = "" }) => args => {
    if (args[0] === "rev-parse") return { status: rev, stdout: "", stderr: "" };
    if (args[0] === "merge-base") return { status: mb, stdout: mb ? "" : `${h40("9")}\n`, stderr: "" };
    if (args[0] === "ls-tree") return { status: ls, stdout: ls ? "" : lsOut, stderr: lsErr };
    if (args[0] === "show") return { status: showStatus, stdout: show, stderr: showErr };
    throw new Error(`unexpected git call ${args.join(" ")}`);
  };
  const newFile = checkAgainstGit({ headText: head, runGit: fake({ lsOut: "" }) });
  assert.equal(newFile.ok, true);
  assert.equal(newFile.base.ledger, "ABSENT_NEW_FILE");
  assert.deepEqual(codes(checkAgainstGit({ headText: head, runGit: fake({ rev: 1 }) })), ["BASE_REF_UNRESOLVED"]);
  assert.deepEqual(codes(checkAgainstGit({ headText: head, runGit: fake({ mb: 1 }) })), ["BASE_MERGE_BASE_FAILED"]);
  const appended = checkAgainstGit({ headText: head, runGit: fake({ show: serializeLedger(ledger()) }) });
  assert.equal(appended.ok, true);
  const removed = checkAgainstGit({ headText: serializeLedger(ledger()), runGit: fake({ show: head }) });
  assert.deepEqual(codes(removed), ["ROW_DELETED"]);
  assert.deepEqual(codes(checkAgainstGit({ headText: "{", runGit: fake({}) })), ["PARSE_JSON"]);
  assert.deepEqual(codes(checkAgainstGit({ headText: head, runGit: fake({ show: "not json" }) })), ["BASE_PARSE_FAILED"]);
});

test("git 대조: ls-tree/show 실패(status 128, bad object)는 새 파일이 아니라 BASE_READ_FAILED 이다", () => {
  const head = serializeLedger(ledger(rendererRow()));
  const fake = ({ ls = 0, showStatus = 0 }) => args => {
    if (args[0] === "rev-parse") return { status: 0, stdout: "", stderr: "" };
    if (args[0] === "merge-base") return { status: 0, stdout: `${h40("9")}\n`, stderr: "" };
    if (args[0] === "ls-tree") return { status: ls, stdout: ls ? "" : "docs/operations/edition-ledger/ledger-v1.json\n", stderr: ls ? "fatal: bad object" : "" };
    if (args[0] === "show") return { status: showStatus, stdout: "", stderr: showStatus ? "fatal: bad object" : "" };
    throw new Error("unexpected git call");
  };
  const lsFail = checkAgainstGit({ headText: head, runGit: fake({ ls: 128 }) });
  assert.equal(lsFail.ok, false);
  assert.deepEqual(codes(lsFail), ["BASE_READ_FAILED"]);
  assert.match(lsFail.errors[0].message, /bad object/);
  const showFail = checkAgainstGit({ headText: head, runGit: fake({ showStatus: 128 }) });
  assert.equal(showFail.ok, false);
  assert.deepEqual(codes(showFail), ["BASE_READ_FAILED"]);
});

test("git 대조: 모양이 틀린 base 장부는 BASE_LEDGER_INVALID 로 실패한다(통과 금지)", () => {
  const head = serializeLedger(ledger(rendererRow()));
  const fakeShow = show => args => {
    if (args[0] === "rev-parse") return { status: 0, stdout: "", stderr: "" };
    if (args[0] === "merge-base") return { status: 0, stdout: `${h40("9")}\n`, stderr: "" };
    if (args[0] === "ls-tree") return { status: 0, stdout: "docs/operations/edition-ledger/ledger-v1.json\n", stderr: "" };
    return { status: 0, stdout: show, stderr: "" };
  };
  const badRow = serializeLedger(ledger(rendererRow({ evidence: { type: "SCREEN_JUDGMENT", ref: "docs/x.md" } })));
  const nonCanonical = JSON.stringify(parseLedger(head));
  for (const show of ["{}", '{"schemaVersion":1}', '{"schemaVersion":1,"rows":"x"}', "null", "[]", badRow, nonCanonical]) {
    const result = checkAgainstGit({ headText: head, runGit: fakeShow(show) });
    assert.equal(result.ok, false, show);
    assert.ok(codes(result).includes("BASE_LEDGER_INVALID") || codes(result).includes("BASE_PARSE_FAILED"), `${show}: ${codes(result)}`);
  }
  assert.deepEqual(codes(checkAgainstGit({ headText: head, runGit: fakeShow("{}") })), ["BASE_LEDGER_INVALID"]);
});

test("checkAppendOnly: null 이거나 rows 가 배열이 아닌 장부는 빈 배열로 보지 않고 오류", () => {
  const good = ledger(rendererRow());
  for (const bad of [null, undefined, {}, { schemaVersion: 1 }, { rows: "x" }, { rows: {} }, []]) {
    assert.deepEqual(codes(checkAppendOnly(bad, good)), ["BASE_LEDGER_INVALID"], JSON.stringify(bad));
    assert.deepEqual(codes(checkAppendOnly(good, bad)), ["HEAD_LEDGER_INVALID"], JSON.stringify(bad));
  }
});

test("공백뿐이거나 앞뒤 공백이 있는 필수 문자열 필드는 거절한다", () => {
  for (const judgedBy of ["", "   ", "\t\n"]) {
    const row = withId(rendererRow({ evidence: { type: "SCREEN_JUDGMENT", ref: "docs/x.md", judgedBy } }));
    assert.ok(codes(validateLedger(ledger(row))).includes("MISSING_JUDGED_BY"), JSON.stringify(judgedBy));
  }
  const padded = withId(rendererRow({ evidence: { type: "SCREEN_JUDGMENT", ref: "docs/x.md", judgedBy: " control-room" } }));
  assert.ok(codes(validateLedger(ledger(padded))).includes("BAD_FIELD"));
  for (const ref of ["  ", " docs/x.md", "docs/x.md ", "docs/x.md\n"]) {
    const row = withId(rendererRow({ evidence: { type: "PNG_BYTE_IDENTICAL", ref } }));
    assert.ok(codes(validateLedger(ledger(row))).includes("BAD_FIELD"), `ref ${JSON.stringify(ref)}`);
  }
  for (const p of [" archive/engine.html", "archive/engine.html ", "   "]) {
    assert.ok(codes(validateLedger(ledger(withId(rendererRow({ path: p }))))).includes("BAD_FIELD"), `path ${JSON.stringify(p)}`);
  }
  for (const key of ["", "  ", " q7", "q7 "]) {
    assert.ok(codes(validateLedger(ledger(withId(sourceRow({ questionKey: key }))))).includes("BAD_FIELD"), `questionKey ${JSON.stringify(key)}`);
  }
  for (const note of ["", "   ", " note", "note "]) {
    assert.ok(codes(validateLedger(ledger(withId(rendererRow({ note }))))).includes("BAD_FIELD"), `note ${JSON.stringify(note)}`);
  }
});

test("changedFields: 이름 형식과 결속 필드의 대소문자·전각 변형을 거절하고 중복도 거절한다", () => {
  // 영문 대소문자 변형은 형식에는 맞으므로 CHANGED_BINDING_FIELD 여야 한다.
  for (const name of ["Content", "CHOICES", "Question", "STEM", "cOnTeNt"]) {
    assert.ok(codes(validateLedger(ledger(withId(sourceRow({ changedFields: [name] }))))).includes("CHANGED_BINDING_FIELD"), name);
  }
  // 전각은 형식 규칙에서 BAD_FIELD 로 거절된다(어느 쪽이든 통과 금지).
  for (const name of ["ｃｏｎｔｅｎｔ", "Ｃｈｏｉｃｅｓ"]) {
    assert.equal(validateLedger(ledger(withId(sourceRow({ changedFields: [name] })))).ok, false, name);
  }
  for (const name of ["content ", " layoutTag", "layout Tag", "1abc", "", "a-b", "솔루션"]) {
    assert.ok(codes(validateLedger(ledger(withId(sourceRow({ changedFields: [name] }))))).includes("BAD_FIELD"), JSON.stringify(name));
  }
  assert.ok(codes(validateLedger(ledger(withId(sourceRow({ changedFields: ["solution", "solution"] }))))).includes("BAD_FIELD"));
  // 메타 필드 등 결속 밖 이름은 여전히 열려 있다.
  assert.deepEqual(validateLedger(ledger(withId(sourceRow({ changedFields: ["layoutTag", "solution", "difficultyBucket", "image"] })))).errors, []);
});

test("checkAppendOnly: 정규형 밖의 키 변경(알 수 없는 키 추가)도 수정으로 본다", () => {
  const a = rendererRow();
  assert.deepEqual(codes(checkAppendOnly(ledger(a), ledger({ ...a, extra: 1 }))), ["ROW_MODIFIED"]);
});

test("저장소의 실제 장부 파일이 형식·정규형 검증을 통과한다", () => {
  const text = readFileSync(path.join(REPO, LEDGER_PATH), "utf8");
  const result = validateLedger(parseLedger(text), { text });
  assert.deepEqual(result.errors, []);
  for (const row of parseLedger(text).rows) assert.deepEqual(canonicalRow(row), row);
});

test("CLI --check 가 현재 저장소에서 통과한다(base 는 HEAD: 장부 파일이 아직 없거나 같은 내용)", () => {
  const result = spawnSync(process.execPath, ["tools/edition-ledger.mjs", "--check", "--base", "HEAD"], { cwd: REPO, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /^PASS edition ledger/);
});

test("CLI --check 는 풀 수 없는 base 를 조용히 통과시키지 않는다", () => {
  const result = spawnSync(process.execPath, ["tools/edition-ledger.mjs", "--check", "--base", "refs/heads/no-such-ref-for-edition-ledger"], { cwd: REPO, encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /BASE_REF_UNRESOLVED/);
});

test("필드 층: 렌더 전용 ⊂ 결속 밖, 결속과 서로소, 결속은 발문·보기뿐", () => {
  const { STEM_FIELDS, CHOICE_FIELDS, BINDING_FIELDS, RENDER_ONLY_FIELDS, isBindingField, isRenderOnlyField, isOutsideBindingField } = layers;
  assert.deepEqual([...BINDING_FIELDS], [...STEM_FIELDS, ...CHOICE_FIELDS]);
  assert.deepEqual([...BINDING_FIELDS].sort(), ["choices", "content", "question", "stem"]);
  for (const name of RENDER_ONLY_FIELDS) {
    assert.equal(isRenderOnlyField(name), true, name);
    assert.equal(isOutsideBindingField(name), true, `${name} 는 결속 밖이어야 한다`);
    assert.equal(isBindingField(name), false, `${name} 는 결속 필드와 겹치면 안 된다`);
  }
  assert.equal(new Set(RENDER_ONLY_FIELDS).size, RENDER_ONLY_FIELDS.length, "중복 없음");
  for (const name of BINDING_FIELDS) {
    assert.equal(isBindingField(name), true);
    assert.equal(isOutsideBindingField(name), false);
    assert.equal(isRenderOnlyField(name), false);
  }
  // 해설·정답·그림은 렌더 전용은 아니지만 결속 밖이다(메타 결속은 이들이 바뀌어도 유지된다).
  for (const name of ["solution", "answer", "image", "solutionImage", "explanation", "difficulty"]) {
    assert.equal(isOutsideBindingField(name), true, name);
    assert.equal(isRenderOnlyField(name), false, `${name} 는 내용이므로 렌더 전용이 아니다`);
  }
  assert.equal(isOutsideBindingField(""), false);
  assert.equal(isOutsideBindingField(undefined), false);
  assert.ok(Object.isFrozen(RENDER_ONLY_FIELDS) && Object.isFrozen(BINDING_FIELDS));
});
