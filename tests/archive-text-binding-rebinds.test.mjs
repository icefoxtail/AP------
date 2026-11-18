// 메타 결속 지문(text-v1)의 재결속 기록·소비자 판정 검사. 결함 조건만 검사하고 운영 데이터 개수는 고정하지 않는다.
// 픽스처: 임시 git 저장소(시험지 파일 이력 + 정본 메타/identity 최소본)에서 생성기를 실제로 돌린다.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  REBINDS_PATH, classifyMetaBinding, contentFingerprint, loadRebinds, rebindHolds, sourceFingerprint, textFingerprint,
  typeJudgmentBoundToText,
} from "../archive/tools/meta-foundation/text-binding-lib.mjs";
import { contentFingerprint as registrarContentFingerprint, sourceFingerprint as registrarSourceFingerprint }
  from "../archive/tools/meta-foundation/auto-register-merged-source.mjs";

const require = createRequire(import.meta.url);
const QuestionBinding = require("../archive/question-binding.js");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOL = path.join(repo, "archive/tools/meta-foundation/build-text-binding-rebinds.mjs");
const sha = (v) => crypto.createHash("sha256").update(v).digest("hex");

const q = (over = {}) => ({ id: 1, content: "<p>a-b의 값을 구하시오.</p>", choices: ["①1", "②2", "③3"], answer: "1", solution: "해설 v1", image: "figs/a.png", ...over });

test("text fingerprint equals the browser-side module and the registrar fingerprints stay in sync", async () => {
  for (const question of [q(), q({ content: "", question: "question 필드 발문", choices: [] }), q({ image: null, solution: "다른 해설" })]) {
    assert.equal(textFingerprint(question), await QuestionBinding.bindingFingerprint(question));
    assert.equal(sourceFingerprint(question), registrarSourceFingerprint(question));
    assert.equal(contentFingerprint(question), registrarContentFingerprint(question));
  }
  assert.equal(textFingerprint({ content: "   ", choices: [] }), null, "an empty stem has no fingerprint (binding impossible)");
});

test("only stem and choices move the text fingerprint", () => {
  const base = textFingerprint(q());
  assert.equal(textFingerprint(q({ solution: "해설을 고침", answer: "2", image: "figs/b.png", images: ["x.png"] })), base);
  assert.notEqual(textFingerprint(q({ content: "<p>a+b의 값을 구하시오.</p>" })), base);
  assert.notEqual(textFingerprint(q({ choices: ["①1", "②2", "③4"] })), base);
});

// ---- 임시 git 저장소 ------------------------------------------------------------------------------------------------
function git(root, ...args) { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }); }
function exam(questions) { return `window.questions = ${JSON.stringify(questions)};\n`; }

function fixtureRepo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "text-binding-rebinds-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, "init", "-q");
  git(root, "config", "user.email", "t@example.com");
  git(root, "config", "user.name", "t");
  git(root, "config", "commit.gpgsign", "false");
  const put = (rel, text) => { const full = path.join(root, rel); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text); };
  const commit = (message) => { git(root, "add", "-A"); git(root, "commit", "-q", "-m", message); return git(root, "rev-parse", "HEAD").trim(); };
  // 문항 1: 해설·그림만 바뀜(발문·보기 그대로). 문항 2: 발문 a-b -> a+b. 문항 3: 이력에 없는 지문(확인 불가).
  const v1 = [q({ id: 1 }), q({ id: 2, content: "<p>a-b를 구하시오.</p>" }), q({ id: 3, content: "<p>문항3</p>" })];
  put("archive/exams/fixture/exam.js", exam(v1));
  const first = commit("v1");
  const v2 = [q({ id: 1, solution: "해설을 다듬음", image: "figs/recut.png" }), q({ id: 2, content: "<p>a+b를 구하시오.</p>" }), q({ id: 3, content: "<p>문항3</p>", solution: "고침" })];
  put("archive/exams/fixture/exam.js", exam(v2));
  const second = commit("v2");
  const rows = v1.map((question, i) => ({ questionUid: "uid" + (i + 1), sourceArchiveFile: "fixture/exam.js", sourceOrdinal: i + 1,
    sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question), problemTypeKey: "PT_X" }));
  rows[2].sourceFingerprint = "9".repeat(64); rows[2].contentFingerprint = "8".repeat(64); // 이력에 없는 등록 당시 지문
  const identity = rows.map((r) => ({ questionUid: r.questionUid, sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: r.sourceOrdinal, sourceFingerprint: r.sourceFingerprint }));
  put("archive/data/question_metadata.json", JSON.stringify({ records: rows }));
  put("archive/data/question_identity_map.json", JSON.stringify({ records: identity }));
  const finalCommit = commit("meta");
  return { root, first, second, finalCommit, rows, v2 };
}

const run = (root, ...args) => {
  const result = spawnSync(process.execPath, [TOOL, "--root", root, ...args], { encoding: "utf8" });
  return { status: result.status, out: result.stdout, err: result.stderr, json: () => JSON.parse(result.stdout) };
};

test("rebinds: same stem resolves, changed stem and unknown history do not, and the file is append-only and idempotent", (t) => {
  const { root, first, v2 } = fixtureRepo(t);
  const dry = run(root);
  assert.equal(dry.status, 0, dry.err);
  assert.equal(fs.existsSync(path.join(root, REBINDS_PATH)), false, "a dry run writes nothing");

  const written = run(root, "--write");
  assert.equal(written.status, 0, written.err);
  const rebinds = loadRebinds(root);
  assert.ok(rebinds.present);
  const row1 = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records[0];
  const current1 = textFingerprint(v2[0]);
  assert.ok(rebindHolds(rebinds, "uid1", row1.contentFingerprint, current1), "stem/choices unchanged: the old content fingerprint is rebound");
  assert.ok(rebindHolds(rebinds, "uid1", row1.sourceFingerprint, current1), "the 5-field fingerprint (identity anchor) is rebound too");
  assert.deepEqual((rebinds.byUid.get("uid1") || []).map((e) => e.basis), ["history", "history"]);
  assert.ok((rebinds.byUid.get("uid1") || []).every((e) => e.commit === first), "the commit that held the registered text is recorded");
  assert.equal(rebinds.byUid.has("uid2"), false, "a stem that really changed (a-b -> a+b) is never rebound");
  assert.equal(rebinds.byUid.has("uid3"), false, "an anchor not found in history stays unverifiable");

  // 발문이 바뀐 문항: 어떤 text 지문으로도 풀리지 않는다.
  const row2 = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records[1];
  assert.equal(rebindHolds(rebinds, "uid2", row2.contentFingerprint, textFingerprint(v2[1])), false);

  const summary = written.json();
  assert.equal(summary.perRole.rowContent.RESOLVED, 1);
  assert.equal(summary.perRole.rowContent.TEXT_CHANGED, 1);
  assert.equal(summary.perRole.rowContent.NO_HISTORY, 1);

  // 추가 전용·멱등: 다시 돌려도 파일이 그대로이고 새 항목이 없다.
  const before = fs.readFileSync(path.join(root, REBINDS_PATH), "utf8");
  const again = run(root, "--write");
  assert.equal(again.json().newEntries, 0);
  assert.equal(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8"), before);

  const check = run(root, "--check", "--verify-history");
  assert.equal(check.status, 0, check.out);
});

test("rebinds --check rejects malformed, duplicated and non-append-only files", (t) => {
  const { root } = fixtureRepo(t);
  run(root, "--write");
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "rebinds");
  const file = path.join(root, REBINDS_PATH);
  const good = fs.readFileSync(file, "utf8");
  assert.equal(run(root, "--check", "--against", "HEAD").status, 0);

  const doc = JSON.parse(good);
  const write = (value) => fs.writeFileSync(file, JSON.stringify(value, null, 2));
  // 항목 삭제 = 추가 전용 위반 (정규 직렬화로 다시 써서 형식 오류와 분리한다)
  const canonical = (value) => {
    const head = { schemaVersion: value.schemaVersion, textFingerprintVersion: value.textFingerprintVersion, appendOnly: true, note: value.note, batches: value.batches };
    return JSON.stringify(head, null, 2).replace(/\n}$/, "") + ',\n  "entries": [\n' + value.entries.map((e) => "    " + JSON.stringify(e)).join(",\n") + "\n  ]\n}\n";
  };
  fs.writeFileSync(file, canonical({ ...doc, entries: doc.entries.slice(1) }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "removing an entry is not append-only");
  fs.writeFileSync(file, canonical({ ...doc, entries: [...doc.entries, doc.entries[0]] }));
  assert.equal(run(root, "--check").status, 1, "duplicate (uid, fp)");
  fs.writeFileSync(file, canonical({ ...doc, entries: [{ ...doc.entries[0], fp: "zz" }] }));
  assert.equal(run(root, "--check").status, 1, "bad fingerprint");
  write(doc);
  assert.equal(run(root, "--check").status, 1, "non-canonical serialization");
  fs.writeFileSync(file, good);
  // 기록한 commit이 그 사실을 더는 뒷받침하지 않으면(text를 바꿔 놓으면) --verify-history가 잡는다.
  const forged = { ...doc, entries: doc.entries.map((e, i) => (i === 0 ? { ...e, text: sha("forged") } : e)) };
  fs.writeFileSync(file, canonical(forged));
  assert.equal(run(root, "--check", "--verify-history").status, 1);
});

test("a judgment fingerprint equal to the current source gets a text fingerprint recorded without history", (t) => {
  const { root, rows, v2 } = fixtureRepo(t);
  // 문항 1의 유형 판정이 "현재 원본"의 내용 지문으로 이뤄졌고 text 지문은 저장하지 않은 옛 판정이라고 하자.
  const metaPath = path.join(root, "archive/data/question_metadata.json");
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  meta.records[0].typeApproval = { approvalType: "DIRECT_JUDGMENT", judgedContentFingerprint: contentFingerprint(v2[0]) };
  meta.records[0].fieldStatus = { problemType: "approved_direct_judgment" };
  fs.writeFileSync(metaPath, JSON.stringify(meta));
  run(root, "--write");
  const rebinds = loadRebinds(root);
  const current = (rebinds.byUid.get("uid1") || []).find((e) => e.basis === "current");
  assert.ok(current, "recorded with basis=current");
  assert.equal(current.fp, contentFingerprint(v2[0]));
  assert.equal(current.text, textFingerprint(v2[0]));
  assert.equal(rows.length, 3);
});

// ---- 소비자 판정(카탈로그가 쓰는 classifyMetaBinding) ----------------------------------------------------------------
test("classifyMetaBinding: existing fingerprint match keeps its old answer; rebinds and type judgments only add", () => {
  const past = q();
  const now = q({ solution: "해설 수정", image: "figs/recut.png" });
  const changedStem = q({ content: "<p>a+b의 값을 구하시오.</p>", solution: "해설 수정", image: "figs/recut.png" });
  const meta = { questionUid: "u", sourceFingerprint: sourceFingerprint(past), contentFingerprint: contentFingerprint(past) };
  const ctx = (question, m = meta, rebinds = null) => ({ meta: m, question, fingerprint: sourceFingerprint(question), assignmentFingerprint: contentFingerprint(question), rebinds });

  assert.equal(classifyMetaBinding(ctx(past)), "exact");
  assert.equal(classifyMetaBinding(ctx(q({ solution: "다른 해설" }))), "content");
  assert.equal(classifyMetaBinding(ctx(now)), "", "stale row without any record stays hidden");

  const byUid = new Map([["u", [{ uid: "u", fp: meta.contentFingerprint, text: textFingerprint(now) }]]]);
  const rebinds = { present: true, byUid };
  assert.equal(classifyMetaBinding(ctx(now, meta, rebinds)), "text");
  assert.equal(classifyMetaBinding(ctx(changedStem, meta, rebinds)), "", "a changed stem makes the record void");
  assert.equal(classifyMetaBinding(ctx(now, { ...meta, questionUid: "other" }, rebinds)), "", "another question's record never applies");

  // 유형 판정: 저장된 text 지문 / 판정 당시 내용 지문
  const judged = (extra) => ({ ...meta, fieldStatus: { problemType: "approved_direct_judgment" }, typeApproval: { approvalType: "DIRECT_JUDGMENT", ...extra } });
  assert.equal(classifyMetaBinding(ctx(now, judged({ judgedTextFingerprint: textFingerprint(past) }))), "type");
  assert.equal(classifyMetaBinding(ctx(changedStem, judged({ judgedTextFingerprint: textFingerprint(past) }))), "");
  assert.equal(classifyMetaBinding(ctx(now, judged({ judgedContentFingerprint: contentFingerprint(now) }))), "type");
  assert.equal(classifyMetaBinding(ctx(now, judged({ judgedContentFingerprint: contentFingerprint(past) }))), "");
  assert.equal(typeJudgmentBoundToText({ ...judged({ judgedTextFingerprint: textFingerprint(now) }), fieldStatus: { problemType: "approved_review2" } }, textFingerprint(now), "x", null), false,
    "a type changed by another route is not covered by an old judgment");
});

test("the committed rebinds file, when present, is well-formed and unique per (uid, fp)", () => {
  const file = path.join(repo, REBINDS_PATH);
  if (!fs.existsSync(file)) return;
  const rebinds = loadRebinds(repo);
  const seen = new Set();
  for (const entries of rebinds.byUid.values()) for (const e of entries) {
    const key = e.uid + "|" + e.fp;
    assert.ok(!seen.has(key), "duplicate " + key);
    seen.add(key);
  }
  const check = run(repo, "--check");
  assert.equal(check.status, 0, check.out);
});
