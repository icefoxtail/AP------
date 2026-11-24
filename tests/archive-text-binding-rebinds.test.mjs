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
  REBINDS_PATH, classifyMetaBinding, contentFingerprint, loadRebinds, rebindHolds, reviewedSourceTextUnchanged, sourceFingerprint, textFingerprint,
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

const canonicalRebinds = (value) => {
  const head = { schemaVersion: value.schemaVersion, textFingerprintVersion: value.textFingerprintVersion, appendOnly: true, note: value.note, batches: value.batches, revisionsNote: value.revisionsNote };
  return JSON.stringify(head, null, 2).replace(/\n}$/, "") + ',\n  "entries": [\n' + value.entries.map((e) => "    " + JSON.stringify(e)).join(",\n") + "\n  ]"
    + ',\n  "revisions": [\n' + value.revisions.map((e) => "    " + JSON.stringify(e)).join(",\n") + "\n  ]\n}\n";
};

const run = (root, ...args) => {
  const result = spawnSync(process.execPath, [TOOL, "--root", root, ...args], { encoding: "utf8" });
  return { status: result.status, out: result.stdout, err: result.stderr, json: () => JSON.parse(result.stdout) };
};

test("rebinds: same stem resolves, changed stem and unknown history do not, and the file is written once and then frozen", (t) => {
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

  // 동결: 파일이 있으면 다시 만들지 않는다.
  const before = fs.readFileSync(path.join(root, REBINDS_PATH), "utf8");
  const again = run(root, "--write");
  assert.equal(again.status, 1);
  assert.match(again.err, /FROZEN/);
  assert.equal(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8"), before);

  const check = run(root, "--check", "--verify-history");
  assert.equal(check.status, 0, check.out);
});

test("rebinds --check rejects malformed, duplicated and changed (unfrozen) files", (t) => {
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
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "removing an entry changes the frozen file");
  fs.writeFileSync(file, canonical({ ...doc, entries: [...doc.entries, { ...doc.entries[0], fp: "e".repeat(64) }] }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "adding an entry changes the frozen file");
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

// ---- 소비자 판정(카탈로그가 쓰는 classifyMetaBinding) ----------------------------------------------------------------
test("classifyMetaBinding: bound when stem+choices are unchanged (row or type), hidden when they changed", () => {
  const past = q();
  const now = q({ solution: "해설 수정", image: "figs/recut.png" });
  const changedStem = q({ content: "<p>a+b의 값을 구하시오.</p>", solution: "해설 수정", image: "figs/recut.png" });
  const meta = { questionUid: "u", sourceFingerprint: sourceFingerprint(past), contentFingerprint: contentFingerprint(past) };
  const ctx = (question, m = meta, rebinds = null) => ({ meta: m, question, assignmentFingerprint: contentFingerprint(question), rebinds });

  assert.equal(classifyMetaBinding(ctx(past)), "row");
  assert.equal(classifyMetaBinding(ctx(now)), "", "stale row without any evidence stays hidden");
  // frozen rebind record
  const rebinds = { present: true, byUid: new Map([["u", [{ uid: "u", fp: meta.contentFingerprint, text: textFingerprint(now) }]]]) };
  assert.equal(classifyMetaBinding(ctx(now, meta, rebinds)), "row");
  assert.equal(classifyMetaBinding(ctx(changedStem, meta, rebinds)), "", "a changed stem makes the record void");
  assert.equal(classifyMetaBinding(ctx(now, { ...meta, questionUid: "other" }, rebinds)), "", "another question's record never applies");
  // a type judgment bound to the text: only the type is shown
  const judged = (extra) => ({ ...meta, fieldStatus: { problemType: "approved_direct_judgment" }, typeApproval: { approvalType: "DIRECT_JUDGMENT", ...extra } });
  assert.equal(classifyMetaBinding(ctx(now, judged({ textBindingFingerprint: textFingerprint(past) }))), "type");
  assert.equal(classifyMetaBinding(ctx(changedStem, judged({ textBindingFingerprint: textFingerprint(past) }))), "");
  assert.equal(classifyMetaBinding(ctx(now, judged({ judgedContentFingerprint: contentFingerprint(now) }))), "type");
  assert.equal(classifyMetaBinding(ctx(now, judged({ judgedContentFingerprint: contentFingerprint(past) }))), "");
  assert.equal(classifyMetaBinding(ctx(now, { ...judged({ textBindingFingerprint: textFingerprint(now) }), fieldStatus: { problemType: "approved_review2" } })), "",
    "a type changed by another route is not covered by an old judgment");
});

// 계약 변경 2026-11-19: 정식 수정으로 같은 지문 키(uid, fp)의 text가 다시 바뀐 경우를 추가 전용으로 기록해야 하므로, 유일성은 동결 entries 안에서만 요구하고
// revisions 안에서는 같은 키가 여러 번 있을 수 있다(마지막 항목만 유효, rebindHolds). 검사를 없앤 것이 아니라 "마지막만 유효"로 바꾼 것이다.
test("the committed rebinds file, when present, is well-formed; entries are unique per (uid, fp), the last revision per key is the valid one", () => {
  const file = path.join(repo, REBINDS_PATH);
  if (!fs.existsSync(file)) return;
  const rebinds = loadRebinds(repo);
  const doc = JSON.parse(fs.readFileSync(file, "utf8"));
  const seen = new Set();
  for (const e of doc.entries) {
    const key = e.uid + "|" + e.fp;
    assert.ok(!seen.has(key), "duplicate entry " + key);
    seen.add(key);
  }
  // 읽는 쪽이 같은 키의 마지막 항목을 쓰는지: revisions의 마지막 항목의 text는 항상 효력이 있다.
  const last = new Map();
  for (const e of doc.revisions || []) last.set(e.uid + "|" + e.fp, e);
  for (const e of last.values()) assert.ok(rebindHolds(rebinds, e.uid, e.fp, e.text), "the last revision of a key is the effective one " + e.uid);
  const check = run(repo, "--check");
  assert.equal(check.status, 0, check.out);
});

// ---- 같은 (uid, fp)의 나중 항목이 이긴다(대체) -----------------------------------------------------------------------------
test("supersede: a later revision of the same (uid, fp) replaces the earlier text; the tool appends it, readers use the last, history check skips the old one", (t) => {
  const { root, second, v2 } = fixtureRepo(t);
  assert.equal(run(root, "--write").status, 0);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "rebinds");
  const approved = path.join(root, "approved.tsv");
  fs.writeFileSync(approved, "uid2\tcontent\t" + second + "\t#7\n");
  assert.equal(run(root, "--revisions", approved, "--write-revisions").status, 0);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "revision 1");
  const rows = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records;
  const bind = (question) => classifyMetaBinding({ meta: rows[1], question, assignmentFingerprint: contentFingerprint(question), rebinds: loadRebinds(root) });
  assert.equal(bind(v2[1]), "row");
  assert.equal(run(root, "--revisions", approved).json().rejected.ALREADY_RECORDED, 1, "while the recorded text is still current nothing is added");

  // 정식 수정으로 같은 문항의 발문이 또 바뀐다. 옛 revision의 text는 더 이상 현재 text가 아니다.
  const v3 = [v2[0], { ...v2[1], content: "<p>a+b의 값을 구하시오. (단, a, b는 양수)</p>" }, v2[2]];
  fs.writeFileSync(path.join(root, "archive/exams/fixture/exam.js"), exam(v3));
  git(root, "add", "-A"); const third = (git(root, "commit", "-q", "-m", "v3"), git(root, "rev-parse", "HEAD").trim());
  assert.equal(bind(v3[1]), "", "the recorded text no longer matches the corrected stem");
  assert.equal(run(root, "--check", "--verify-history").status, 1, "a stale last revision still fails the history check");
  const before = fs.readFileSync(path.join(root, REBINDS_PATH), "utf8");
  const second2 = path.join(root, "approved2.tsv");
  fs.writeFileSync(second2, "uid2\tcontent\t" + third + "\t#8\n");
  const dry = run(root, "--revisions", second2);
  assert.equal(dry.json().newRevisions, 1, "a changed text for a recorded key is appended instead of refused");
  assert.equal(run(root, "--revisions", second2, "--write-revisions").status, 0);
  const after = fs.readFileSync(path.join(root, REBINDS_PATH), "utf8");
  const docAfter = JSON.parse(after);
  assert.equal(docAfter.revisions.length, 2);
  assert.equal(docAfter.revisions[1].uid, "uid2");
  assert.equal(docAfter.revisions[0].fp, docAfter.revisions[1].fp, "same key");
  assert.notEqual(docAfter.revisions[0].text, docAfter.revisions[1].text);
  assert.ok(after.includes(JSON.stringify(JSON.parse(before).revisions[0])), "the earlier revision is kept byte for byte");
  assert.equal(bind(v3[1]), "row", "the later revision wins");
  assert.equal(bind(v2[1]), "", "and the superseded text no longer binds");
  assert.equal(run(root, "--revisions", second2).json().rejected.ALREADY_RECORDED, 1, "adding the same superseding item twice is refused");
  const check = run(root, "--check", "--verify-history");
  assert.equal(check.status, 0, check.out);
  assert.equal(check.json().supersededRevisions, 1, "the old revision is recorded as superseded and skipped");
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "revision 2");
  assert.equal(run(root, "--check", "--against", "HEAD~1").status, 0, "appending keeps the earlier revisions in front");
  // 읽는 쪽 규칙 자체: 동결 entries와 (uid, fp)가 겹쳐도 나중 revisions 항목이 이긴다.
  const entryLike = { uid: "u", fp: "a".repeat(64), text: "1".repeat(64) };
  const byUid = new Map([["u", [entryLike, { ...entryLike, text: "2".repeat(64), from: "1".repeat(64), edit: "content", commits: ["c"] }]]]);
  assert.equal(rebindHolds({ byUid }, "u", "a".repeat(64), "2".repeat(64)), true);
  assert.equal(rebindHolds({ byUid }, "u", "a".repeat(64), "1".repeat(64)), false, "the older entry is overridden by the later revision");
});

// ---- 원문 복귀: 수정(revision) 뒤 등록 당시 발문·보기로 되돌린 문항 ---------------------------------------------------------------
// exact=true: 되돌린 문항이 등록 당시와 바이트까지 같다(행의 내용 지문이 다시 현재와 같다 -> 예전에는 ALREADY_CURRENT로 거절).
// exact=false: 발문·보기는 같지만 그림이 달라 내용 지문은 다르다(재결속 기록만으로 결속을 읽는다).
for (const exact of [true, false]) test(`return to the original text (${exact ? "byte-identical" : "figure differs"}): the return item supersedes the earlier revision; duplicates, stale last items and rewrites still fail`, (t) => {
  const { root, second, v2 } = fixtureRepo(t);
  assert.equal(run(root, "--write").status, 0);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "rebinds");
  const rowsOf = () => JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records;
  const bind = (question) => classifyMetaBinding({ meta: rowsOf()[1], question, assignmentFingerprint: contentFingerprint(question), rebinds: loadRebinds(root) });
  const holds = (question) => rebindHolds(loadRebinds(root), "uid2", rowsOf()[1].contentFingerprint, textFingerprint(question));
  const commitFile = (message, questions) => {
    fs.writeFileSync(path.join(root, "archive/exams/fixture/exam.js"), exam(questions));
    git(root, "add", "-A"); git(root, "commit", "-q", "-m", message);
    return git(root, "rev-parse", "HEAD").trim();
  };
  const approve = (name, edit, commit) => { const file = path.join(root, name); fs.writeFileSync(file, "uid2\t" + edit + "\t" + commit + "\t\n"); return file; };

  // 1단: 정식 수정(a-b -> a+b)과 그 revision.
  assert.equal(run(root, "--revisions", approve("a1.tsv", "content", second), "--write-revisions").status, 0);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "revision");
  assert.equal(bind(v2[1]), "row");

  // 2단: 원문으로 되돌림. 마지막 항목(a+b)이 더 이상 현재 text가 아니다.
  const original = { ...v2[1], content: "<p>a-b를 구하시오.</p>", ...(exact ? {} : { image: "figs/recut-again.png" }) };
  const reverted = [v2[0], original, v2[2]];
  const revertCommit = commitFile("revert to the original stem", reverted);
  assert.equal(holds(original), false, "the stale last revision no longer holds for the original text");
  assert.equal(bind(original), exact ? "row" : "", exact ? "an exact revert is bound by the row fingerprint itself" : "the recorded text no longer matches");
  assert.equal(run(root, "--check", "--verify-history").status, 1, "a stale last item still fails the history check");
  const before = fs.readFileSync(path.join(root, REBINDS_PATH), "utf8");

  // 복귀 항목은 edit=figure(옛 지문의 발문·보기와 같음)로만 적는다. 내용 수정으로 적으면 거절한다.
  assert.deepEqual(run(root, "--revisions", approve("bad.tsv", "content", revertCommit)).json().rejected, { TEXT_SAME_BUT_NOT_FIGURE: 1 });
  const ret = approve("a2.tsv", "figure", revertCommit);
  const dry = run(root, "--revisions", ret);
  assert.equal(dry.json().newRevisions, 1, "a return item is appended instead of refused as ALREADY_CURRENT");
  assert.equal(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8"), before, "a dry run writes nothing");
  assert.equal(run(root, "--revisions", ret, "--write-revisions").status, 0);
  const doc = JSON.parse(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8"));
  assert.equal(doc.revisions.length, 2);
  assert.ok(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8").includes(JSON.stringify(JSON.parse(before).revisions[0])), "the earlier revision is kept byte for byte");
  assert.deepEqual([doc.revisions[1].edit, doc.revisions[1].from === doc.revisions[1].text, doc.revisions[0].fp === doc.revisions[1].fp], ["figure", true, true]);
  assert.equal(holds(original), true, "the return item is the last one for the key and holds");
  assert.equal(holds(v2[1]), false, "the superseded text no longer binds");
  assert.equal(bind(original), "row");
  const check = run(root, "--check", "--verify-history");
  assert.equal(check.status, 0, check.out);
  assert.equal(check.json().supersededRevisions, 1, "the earlier revision is skipped as superseded");
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "return item");
  assert.equal(run(root, "--check", "--against", "HEAD~1").status, 0, "appending keeps the earlier items in front");

  // 복귀 뒤 중복 추가는 거절한다(마지막 효력 항목이 이미 현재 text).
  const again = run(root, "--revisions", ret).json();
  assert.equal(again.newRevisions, 0);
  assert.equal(Object.values(again.rejected).reduce((a, b) => a + b, 0), 1);
  assert.ok(again.rejected.ALREADY_CURRENT || again.rejected.ALREADY_RECORDED);

  // 3단: 다시 수정(a×b). 마지막 항목(복귀)이 stale이 되어 다시 실패하고, 새 revision이 뒤에 붙어 해소한다.
  const v4 = [v2[0], { ...original, content: "<p>a×b를 구하시오.</p>" }, v2[2]];
  const third = commitFile("edit again", v4);
  assert.equal(bind(v4[1]), "", "the return item does not bind the new edit");
  assert.equal(run(root, "--check", "--verify-history").status, 1, "the last item (the return) is stale again");
  const edit3 = approve("a3.tsv", "content", third);
  assert.equal(run(root, "--revisions", edit3).json().newRevisions, 1);
  assert.equal(run(root, "--revisions", edit3, "--write-revisions").status, 0);
  assert.equal(bind(v4[1]), "row");
  assert.equal(holds(original), false, "after the later edit the return item no longer binds the original text");
  const final = run(root, "--check", "--verify-history");
  assert.equal(final.status, 0, final.out);
  assert.equal(final.json().supersededRevisions, 2);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "revision 3");

  // 추가 전용: 항목을 고치거나 지우거나 끼워 넣으면 거절한다.
  const file = path.join(root, REBINDS_PATH);
  const good = fs.readFileSync(file, "utf8");
  const docNow = JSON.parse(good);
  const canonical = (value) => {
    const head = { schemaVersion: value.schemaVersion, textFingerprintVersion: value.textFingerprintVersion, appendOnly: true, note: value.note, batches: value.batches, revisionsNote: value.revisionsNote };
    return JSON.stringify(head, null, 2).replace(/\n}$/, "") + ',\n  "entries": [\n' + value.entries.map((e) => "    " + JSON.stringify(e)).join(",\n") + "\n  ]"
      + ',\n  "revisions": [\n' + value.revisions.map((e) => "    " + JSON.stringify(e)).join(",\n") + "\n  ]\n}\n";
  };
  assert.equal(canonical(docNow), good);
  fs.writeFileSync(file, canonical({ ...docNow, revisions: [docNow.revisions[0], { ...docNow.revisions[1], prs: ["#9"] }, docNow.revisions[2]] }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "rewriting the return item is rejected");
  fs.writeFileSync(file, canonical({ ...docNow, revisions: [docNow.revisions[0], docNow.revisions[2]] }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "deleting the return item is rejected");
  fs.writeFileSync(file, canonical({ ...docNow, revisions: [docNow.revisions[0], docNow.revisions[2], docNow.revisions[1]] }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "reordering (inserting in the middle) is rejected");
  fs.writeFileSync(file, good);
  assert.equal(run(root, "--check", "--against", "HEAD").status, 0);
});

// 추가 전용: 이 변경이 기준 브랜치의 기존 항목을 고치거나 지우지 않았는가. 기준은 기준 브랜치의 최신이 아니라 HEAD와의 merge-base 시점 파일이다
// (기준 브랜치가 이 PR 분기 이후 기록을 늘려도 옛 분기 PR이 빨개지지 않게). 기준 ref나 merge-base를 풀 수 없는 얕은 체크아웃에서는
// 실패가 아니라 눈에 띄는 "건너뜀"으로 표시한다(조용한 통과와 구분).
test("the committed rebinds file equals the base branch's file (frozen)", (t) => {
  const base = process.env.GITHUB_BASE_REF ? "origin/" + process.env.GITHUB_BASE_REF : "origin/main";
  const result = run(repo, "--check", "--against", base, "--merge-base");
  const out = JSON.parse(result.out);
  if (out.errors.some((e) => e.startsWith("BASE_UNAVAILABLE:"))) {
    console.log(`# NOT_RUN append-only check: base ${base} is not available in this checkout (shallow clone?)`);
    t.skip(`frozen-file check NOT_RUN: ${base} unavailable`);
    return;
  }
  assert.equal(result.status, 0, result.out);
});

// ---- 승인된 교정 재결속(revisions): entries(동결)와 별도 구역, 추가 전용 ----------------------------------------------------
test("revisions: an approved correction rebinds the changed stem; unverifiable, mislabelled or later-edited ones do not", (t) => {
  const { root, second, v2 } = fixtureRepo(t);
  assert.equal(run(root, "--write").status, 0);
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "rebinds");
  const entriesBefore = JSON.parse(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8")).entries;
  const approved = path.join(root, "approved.tsv");
  // uid2: 발문 a-b -> a+b (내용 교정). uid3: 이력에 없는 지문(NO_HISTORY). uid2를 figure라고 잘못 올리는 경우는 아래에서 따로 거절을 본다.
  fs.writeFileSync(approved, ["uid2\tcontent\t" + second + "\t#7", "uid3\tcontent\t" + second + "\t"].join("\n") + "\n");
  const dry = run(root, "--revisions", approved);
  assert.equal(dry.status, 0, dry.err);
  assert.equal(dry.json().newRevisions, 1);
  assert.deepEqual(dry.json().rejected, { NO_HISTORY: 1 });
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8")).revisions, undefined, "a dry run writes nothing");

  const wrong = path.join(root, "wrong.tsv");
  fs.writeFileSync(wrong, "uid2\tfigure\t" + second + "\t\n");
  assert.deepEqual(run(root, "--revisions", wrong).json().rejected, { FIGURE_BUT_TEXT_CHANGED: 1 });
  fs.writeFileSync(wrong, "uid2\tcontent\tabc123\t\n");
  assert.notEqual(run(root, "--revisions", wrong).status, 0, "commits must be full 40-hex shas");

  assert.equal(run(root, "--revisions", approved, "--write-revisions").status, 0);
  const doc = JSON.parse(fs.readFileSync(path.join(root, REBINDS_PATH), "utf8"));
  assert.deepEqual(doc.entries, entriesBefore, "the frozen entries are untouched");
  assert.equal(doc.revisions.length, 1);
  assert.deepEqual([doc.revisions[0].uid, doc.revisions[0].edit, doc.revisions[0].commits, doc.revisions[0].prs], ["uid2", "content", [second], ["#7"]]);
  assert.equal(run(root, "--check", "--verify-history").status, 0);
  assert.equal(run(root, "--check", "--against", "HEAD").status, 0, "adding revisions keeps the frozen entries equal to the base");
  assert.equal(run(root, "--revisions", approved).json().rejected.ALREADY_RECORDED, 1, "a recorded revision is not added twice");

  // 소비자: 옛 지문 + 현재 text 가 모두 맞을 때만 결속으로 인정한다.
  const rows = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records;
  const rebinds = loadRebinds(root);
  assert.equal(rebinds.revisions, 1);
  const bind = (uid, row, question, r = rebinds) => classifyMetaBinding({ meta: row, question, assignmentFingerprint: contentFingerprint(question), rebinds: r });
  assert.equal(bind("uid2", rows[1], v2[1]), "row", "approved correction: the corrected stem is bound");
  assert.equal(bind("uid3", rows[2], v2[2]), "", "an unverifiable (not approved) row stays unbound");
  const edited = { ...v2[1], content: "<p>a×b를 구하시오.</p>" };
  assert.equal(bind("uid2", rows[1], edited), "", "a later edit of the stem voids the revision (new text fingerprint differs)");
  assert.equal(bind("uid2", { ...rows[1], contentFingerprint: "7".repeat(64) }, v2[1]), "", "the old fingerprint must be the one the row held");

  // 추가 전용: 기준에서 항목을 빼거나 바꾸면 거절, 형식이 틀리면 거절.
  git(root, "add", "-A"); git(root, "commit", "-q", "-m", "revisions");
  const file = path.join(root, REBINDS_PATH);
  const good = fs.readFileSync(file, "utf8");
  assert.equal(canonicalRebinds(doc), good, "test serializer matches the tool's canonical form");
  fs.writeFileSync(file, canonicalRebinds({ ...doc, revisions: [{ ...doc.revisions[0], prs: ["#8"] }] }));
  assert.equal(run(root, "--check", "--against", "HEAD").status, 1, "changing a recorded revision is rejected");
  fs.writeFileSync(file, canonicalRebinds({ ...doc, revisions: [{ ...doc.revisions[0], from: doc.revisions[0].text }] }));
  assert.equal(run(root, "--check").status, 1, "content edit with from == text is inconsistent");
  fs.writeFileSync(file, canonicalRebinds({ ...doc, revisions: [{ ...doc.revisions[0], commits: ["short"] }] }));
  assert.equal(run(root, "--check").status, 1, "commits must be 40-hex");
  fs.writeFileSync(file, canonicalRebinds({ ...doc, revisions: [{ ...doc.revisions[0], text: sha("forged") }] }));
  assert.equal(run(root, "--check", "--verify-history").status, 1, "history does not support a forged text");
  fs.writeFileSync(file, good);
});

// ---- merge-base 기준 추가 전용 검사: 기준 브랜치가 분기 이후 늘어도 옛 분기 PR은 자기 변경만으로 판정된다 ------------------------------------
const hexOf = (c) => c.repeat(64);
const revision = (uid, tag) => ({ uid, fp: hexOf(tag), text: hexOf("1"), from: hexOf("2"), edit: "content", family: "B", commits: ["a".repeat(40)] });
function mergeBaseFixture(t) {
  const fx = fixtureRepo(t);
  const { root } = fx;
  git(root, "branch", "-M", "main");
  git(root, "config", "core.autocrlf", "false"); // 브랜치를 오가며 파일이 CRLF로 바뀌면 정본 직렬화 검사가 다른 이유로 실패한다
  assert.equal(run(root, "--write").status, 0);
  const file = path.join(root, REBINDS_PATH);
  const read = () => JSON.parse(fs.readFileSync(file, "utf8"));
  const save = (doc) => fs.writeFileSync(file, canonicalRebinds(doc));
  const commit = (message) => { git(root, "add", "-A"); git(root, "commit", "-q", "-m", message); };
  save({ ...read(), revisionsNote: "n", revisions: [revision("uid2", "3"), revision("uid3", "7")] });
  commit("branch point: two revisions recorded");
  const branchPoint = git(root, "rev-parse", "HEAD").trim();
  // main이 분기 이후 revision을 뒤에 추가한다.
  save({ ...read(), revisions: [...read().revisions, revision("uid1", "4")] });
  commit("main appends a revision");
  git(root, "checkout", "-q", "-b", "pr", branchPoint);
  const check = () => run(root, "--check", "--against", "main", "--merge-base");
  const appendOnlyViolation = () => { const r = check(); return r.status === 1 && r.json().errors.some((e) => e.includes("append-only")); };
  return { ...fx, read, save, commit, check, appendOnlyViolation, file };
}

test("merge-base check: an old-branch PR that did not touch the file passes even after the base branch appended records", (t) => {
  const { root, commit, check } = mergeBaseFixture(t);
  fs.writeFileSync(path.join(root, "unrelated.txt"), "x\n"); commit("unrelated change");
  const result = check();
  assert.equal(result.status, 0, result.out);
  assert.equal(run(root, "--check", "--against", "main").status, 1, "the plain latest-base comparison is the false failure this fixes");
});

test("merge-base check: appending after the existing records passes; editing, deleting or inserting in the middle fails", (t) => {
  const { read, save, check, appendOnlyViolation } = mergeBaseFixture(t);
  const [first, second] = read().revisions;
  save({ ...read(), revisions: [first, second, revision("uid1", "5")] });
  assert.equal(check().status, 0, check().out);
  save({ ...read(), revisions: [{ ...first, prs: ["#9"] }, second] });
  assert.ok(appendOnlyViolation(), "modify an existing revision");
  save({ ...read(), revisions: [second] });
  assert.ok(appendOnlyViolation(), "delete the first revision");
  save({ ...read(), revisions: [first] });
  assert.ok(appendOnlyViolation(), "delete the last revision");
  save({ ...read(), revisions: [first, revision("uid1", "6"), second] });
  assert.ok(appendOnlyViolation(), "insert between existing revisions");
  save({ ...read(), revisions: [revision("uid1", "6"), first, second] });
  assert.ok(appendOnlyViolation(), "insert before the existing revisions");
});

test("merge-base check: changing the frozen entries fails; main itself and an unresolvable merge-base are explicit", (t) => {
  const { root, read, save, check, file } = mergeBaseFixture(t);
  const original = fs.readFileSync(file, "utf8");
  save({ ...read(), entries: read().entries.slice(1) });
  assert.ok(check().json().errors.some((e) => e.startsWith("frozen file differs")), "removing a frozen entry");
  fs.writeFileSync(file, original);
  assert.equal(check().status, 0, "untouched file");
  git(root, "checkout", "-q", "main");
  assert.equal(run(root, "--check", "--against", "main", "--merge-base").status, 0, "HEAD == base is trivially equal");
  const missing = run(root, "--check", "--against", "no-such-branch", "--merge-base");
  assert.equal(missing.status, 1);
  assert.ok(missing.json().errors.some((e) => e.startsWith("BASE_UNAVAILABLE:")), "an unresolvable base is flagged, never a silent pass");
});

// 2026-11-24: 시험지 파일 전체 blob 대신 문항별 발문·보기로 "같은 시험지인가"를 본다(reviewedSourceTextUnchanged). 하네스(영수증·소형 메타 blob)와
// REVIEW2/FINAL_QA 요청이 쓰는 같은 판정이다. 그림 경로·해설·배치만 바뀌면 통과, 발문·보기·문항 수가 바뀌었거나 옛 blob을 못 읽으면 거절.
test("reviewedSourceTextUnchanged: figure/solution-only edits keep the pinned blob valid, stem or count changes do not", (t) => {
  const { root } = fixtureRepo(t);
  const v1 = [q({ id: 1 }), q({ id: 2, content: "<p>a-b를 구하시오.</p>" }), q({ id: 3, content: "<p>문항3</p>" })];
  const pinned = execFileSync("git", ["hash-object", "-w", "--stdin"], { cwd: root, input: exam(v1), encoding: "utf8" }).trim();
  const same = (questions) => reviewedSourceTextUnchanged({ root, expectedBlobSha1: pinned, currentBytes: Buffer.from(exam(questions)) });
  const withFigure = v1.map((x, i) => i === 0 ? { ...x, solutionImage: "assets/images/x/q1-solution.svg", imageSize: "full", solution: "다듬음" } : x);
  assert.equal(same(withFigure).ok, true, "solutionImage / imageSize / solution only");
  assert.equal(same(v1).ok, true);
  const stemChanged = v1.map((x, i) => i === 1 ? { ...x, content: "<p>a+b를 구하시오.</p>" } : x);
  assert.equal(same(stemChanged).ok, false);
  assert.match(same(stemChanged).reason, /question 2/);
  assert.equal(same(v1.slice(0, 2)).ok, false, "question count differs");
  assert.equal(reviewedSourceTextUnchanged({ root, expectedBlobSha1: "0".repeat(40), currentBytes: Buffer.from(exam(v1)) }).ok, false, "unreadable pinned blob is never a pass");
});
