import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { registerDifficulty5, computeLegacyCompat, wrapGeminiFile, normalizeGeminiPayload, SCHEMA } from "../archive/tools/meta-foundation/register-difficulty5.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = path.join(repo, "tests/fixtures/diff5/req_diff5_17.json");
const gemini = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
const SOURCE = gemini.sourceArchiveFile;
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");

// Read the real sidecars once, keep only this exam's rows. Tests then run on temp copies, never on the real files.
let realMeta = JSON.parse(fs.readFileSync(path.join(repo, META), "utf8"));
let realIds = JSON.parse(fs.readFileSync(path.join(repo, IDENTITY), "utf8"));
const geminiByOrdinal = new Map(gemini.items.map(i => [i.ordinal, i]));
const slice = {
  meta: {
    ...realMeta,
    records: realMeta.records.filter(r => r.sourceArchiveFile === SOURCE).map(r => {
      const copy = { ...r };
      const item = geminiByOrdinal.get(copy.sourceOrdinal);
      if (item?.before?.level) {
        copy.difficultyBucket = item.before.level;
      } else {
        delete copy.difficultyBucket;
      }
      delete copy.difficultyConfidence;
      delete copy.difficultyBoundaryFlag;
      delete copy.legacyLevelCompatibility;
      return copy;
    })
  },
  ids: { schemaVersion: realIds.schemaVersion, sourceCommit: realIds.sourceCommit,
    records: realIds.records.filter(r => r.sourceArchiveFile === SOURCE) }
};
realMeta = null;
realIds = null;
const sourceBytes = fs.readFileSync(path.join(repo, "archive/exams", SOURCE));

function make(t, { mutateMeta, sourceOverride = sourceBytes } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "diff5-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const meta = structuredClone(slice.meta);
  if (mutateMeta) mutateMeta(meta);
  const put = (p, data) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
  put(META, JSON.stringify(meta, null, 2) + "\n");
  put(IDENTITY, JSON.stringify(slice.ids, null, 2) + "\n");
  put("archive/exams/" + SOURCE, sourceOverride);
  const req = (g = gemini) => ({ schemaVersion: SCHEMA, driveFileId: "FILE_ID", driveSha256: "x", gemini: g });
  const rec = n => JSON.parse(fs.readFileSync(path.join(root, META), "utf8")).records.find(r => r.sourceOrdinal === n);
  const snap = () => [META, IDENTITY, "archive/exams/" + SOURCE].map(p => sha256(fs.readFileSync(path.join(root, p))));
  return { root, req, rec, snap };
}
const decisions = r => Object.fromEntries(r.items.map(i => [i.ordinal, i.decision]));
const withItem = (n, fn) => { const g = structuredClone(gemini); fn(g.items.find(i => i.ordinal === n)); return g; };
function makeReviewedRequest(x, { ordinal = 1, staleContentBinding = false } = {}) {
  const metaPath = path.join(x.root, META), idsPath = path.join(x.root, IDENTITY);
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const ids = JSON.parse(fs.readFileSync(idsPath, "utf8"));
  const rec = meta.records.find(row => row.sourceArchiveFile === SOURCE && row.sourceOrdinal === ordinal);
  const idr = ids.records.find(row => row.sourceArchiveFile === SOURCE && row.sourceOrdinal === ordinal);
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(sourceBytes.toString("utf8"), ctx);
  const q = (ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions)[ordinal - 1];
  rec.difficultyBucket = 4;
  if (staleContentBinding) rec.contentFingerprint = "stale-content-fingerprint";
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
  const fp = sha256(Buffer.from(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null })));
  const cfp = sha256(Buffer.from(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    image: q.image ?? null })));
  const after = { difficultyBoundaryFlag: "B23", difficultyBucket: 3, difficultyConfidence: "high", legacyLevelCompatibility: "NORMAL" };
  const before = { difficultyBucket: rec.difficultyBucket, difficultyConfidence: rec.difficultyConfidence ?? null,
    difficultyBoundaryFlag: rec.difficultyBoundaryFlag ?? null, legacyLevelCompatibility: rec.legacyLevelCompatibility ?? null,
    level: rec.level ?? q.level ?? null, sourceFingerprint: rec.sourceFingerprint ?? null, contentFingerprint: rec.contentFingerprint ?? null };
  const staleSourceBinding = rec.contentFingerprint !== cfp || idr.sourceFingerprint !== rec.sourceFingerprint;
  const review = { sourceArchiveFile: SOURCE, ordinal, questionUid: rec.questionUid, decision: "CORRECT", refreshBinding: false,
    before, after, sourceFingerprint: fp, contentFingerprint: cfp,
    staleSourceBinding, reason: "fixture reviewed correction" };
  const evidence = { schemaVersion: "archive-difficulty5-reviewed-correction-v1", rows: [review] };
  const evidencePath = ".archive-meta-register/evidence/reviewed-correction-test.json";
  const evidenceBytes = Buffer.from(JSON.stringify(evidence, null, 2) + "\n");
  const fullEvidencePath = path.join(x.root, evidencePath);
  fs.mkdirSync(path.dirname(fullEvidencePath), { recursive: true });
  fs.writeFileSync(fullEvidencePath, evidenceBytes);
  const bytes = fs.readFileSync(path.join(x.root, "archive/exams", SOURCE));
  const sourceBlobSha = crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
  return { idsPath, evidencePath, evidenceSha256: sha256(evidenceBytes), sourceBlobSha, review, staleSourceBinding,
    request: { schemaVersion: SCHEMA, driveFileId: "FILE_REVIEWED", gemini: { schemaVersion: "v1", requestId: "reviewed-correction-test",
      sourceArchiveFile: SOURCE, latestBlobSha: sourceBlobSha,
      items: [{ ordinal, questionUid: idr.questionUid, before: { level: rec.level ?? q.level ?? null }, after }] },
      reviewedCorrection: { schemaVersion: "archive-difficulty5-reviewed-correction-v1", approvalRef: "test fixture approval",
        evidencePath, evidenceSha256: sha256(evidenceBytes), rows: [review] } } };
}

test("derived fixture carries only registration fields", () => {
  assert.match(gemini._fixtureNote, /not a byte copy/);
  for (const i of gemini.items) {
    assert.deepEqual(Object.keys(i).sort(), ["after", "before", "ordinal", "questionUid"]);
    assert.deepEqual(Object.keys(i.before), ["level"]);
    assert.deepEqual(Object.keys(i.after).sort(), ["difficultyBoundaryFlag", "difficultyBucket", "difficultyConfidence", "legacyLevelCompatibility"]);
  }
});

test("fixture dry-run: no write, Q22/Q23 NORMAL expected, Q19 BORDERLINE_REVIEW, 23 APPLY", t => {
  const x = make(t), before = x.snap();
  const r = registerDifficulty5({ root: x.root, request: x.req() });
  assert.equal(r.summary.total, 23);
  assert.equal(r.summary.APPLY, 23);
  assert.equal(r.summary.written, false);
  assert.deepEqual(x.snap(), before);
  const by = Object.fromEntries(r.items.map(i => [i.ordinal, i]));
  assert.equal(by[19].after.legacyLevelCompatibility, "BORDERLINE_REVIEW");
  assert.equal(by[19].geminiCompatRaw, "SLIGHT_SHIFT");
  assert.equal(by[22].after.legacyLevelCompatibility, "NORMAL");
  assert.equal(by[23].after.legacyLevelCompatibility, "NORMAL");
  assert.equal(r.requestId, gemini.requestId);
  assert.equal(r.driveFileId, "FILE_ID");
});

test("write registers 4 fields only, then rerun is byte-identical and ALREADY_REGISTERED", t => {
  const x = make(t);
  const before = Object.fromEntries([19, 22, 23, 1].map(n => [n, x.rec(n)]));
  const r1 = registerDifficulty5({ root: x.root, request: x.req(), write: true });
  assert.equal(r1.summary.written, true);
  for (const n of [19, 22, 23, 1]) {
    const now = x.rec(n), old = before[n];
    const changed = Object.keys(now).filter(k => JSON.stringify(now[k]) !== JSON.stringify(old[k])).sort();
    assert.deepEqual(changed, ["difficultyBoundaryFlag", "difficultyBucket", "difficultyConfidence", "legacyLevelCompatibility"]);
    assert.equal(now.fieldStatus.difficulty, old.fieldStatus.difficulty);
  }
  assert.equal(x.rec(19).difficultyBucket, 3);
  assert.equal(x.rec(19).legacyLevelCompatibility, "BORDERLINE_REVIEW");
  assert.equal(x.rec(22).legacyLevelCompatibility, "NORMAL");
  assert.equal(x.rec(23).legacyLevelCompatibility, "NORMAL");
  const snap = x.snap();
  const r2 = registerDifficulty5({ root: x.root, request: x.req(), write: true });
  assert.equal(r2.summary.ALREADY_REGISTERED, 23);
  assert.equal(r2.summary.written, false);
  assert.deepEqual(x.snap(), snap);
  const v = registerDifficulty5({ root: x.root, request: x.req(), verifyProjection: true });
  assert.equal(v.summary.VERIFIED, 23);
});

test("student-facing source and identity map unchanged after write", t => {
  const x = make(t), idBefore = x.snap();
  registerDifficulty5({ root: x.root, request: x.req(), write: true });
  const after = x.snap();
  assert.notEqual(after[0], idBefore[0]);
  assert.equal(after[1], idBefore[1]);
  assert.equal(after[2], idBefore[2]);
  const rec = x.rec(1);
  assert.equal(rec.standardUnitKey, slice.meta.records.find(r => r.sourceOrdinal === 1).standardUnitKey);
  assert.equal(rec.templateKey, "");
});

test("latestBlobSha drift rejects the whole file", t => {
  const x = make(t), before = x.snap();
  const g = structuredClone(gemini); g.latestBlobSha = "0".repeat(40);
  assert.throws(() => registerDifficulty5({ root: x.root, request: x.req(g), write: true }), /blob drift/);
  assert.deepEqual(x.snap(), before);
});

test("examData.questions is accepted as the source bank without relaxing identity guards", t => {
  const nestedSource = Buffer.from("window.examData = { questions: new Array(23) };\n", "utf8");
  const blobSha = crypto.createHash("sha1").update("blob " + nestedSource.length + "\0").update(nestedSource).digest("hex");
  const x = make(t, { sourceOverride: nestedSource });
  const g = structuredClone(gemini);
  g.latestBlobSha = blobSha;
  const r = registerDifficulty5({ root: x.root, request: x.req(g) });
  assert.equal(r.summary.total, 23);
  assert.equal(r.summary.APPLY, 23);
  assert.equal(r.summary.CONFLICT, 0);
});

test("ordinal/questionUid mismatch rejects the whole file", t => {
  const x = make(t), before = x.snap();
  const g = withItem(5, i => { i.questionUid = gemini.items[0].questionUid; });
  assert.throws(() => registerDifficulty5({ root: x.root, request: x.req(g), write: true }), /mismatch/);
  assert.deepEqual(x.snap(), before);
});

test("invalid after values are SKIP_INVALID per item and not recorded", t => {
  const x = make(t);
  const g = structuredClone(gemini);
  g.items.find(i => i.ordinal === 1).after.difficultyBucket = "UNKNOWN";
  g.items.find(i => i.ordinal === 2).after.difficultyBucket = null;
  g.items.find(i => i.ordinal === 3).after.difficultyBucket = "3";
  g.items.find(i => i.ordinal === 4).after.difficultyBucket = 6;
  g.items.find(i => i.ordinal === 5).after.difficultyConfidence = "certain";
  g.items.find(i => i.ordinal === 6).after.difficultyBoundaryFlag = "B56";
  g.items.find(i => i.ordinal === 7).after.difficultyConfidence = "HIGH";
  const r = registerDifficulty5({ root: x.root, request: x.req(g), write: true });
  const d = decisions(r);
  for (const n of [1, 2, 3, 4, 5, 6]) assert.equal(d[n], "SKIP_INVALID", "Q" + n);
  assert.equal(d[7], "APPLY");
  assert.equal(x.rec(7).difficultyConfidence, "high");
  for (const n of [1, 2, 3, 4, 5, 6]) {
    assert.equal(x.rec(n).difficultyConfidence, undefined);
    assert.equal(typeof x.rec(n).difficultyBucket, "string");
  }
  assert.equal(r.summary.SKIP_INVALID, 6);
});

test("existing different numeric bucket is CONFLICT and never overwritten; same number is ALREADY_REGISTERED", t => {
  const x = make(t, { mutateMeta: m => {
    m.records.find(r => r.sourceOrdinal === 19).difficultyBucket = 4;
    m.records.find(r => r.sourceOrdinal === 22).difficultyBucket = 3;
  } });
  const r = registerDifficulty5({ root: x.root, request: x.req(), write: true });
  const d = decisions(r);
  assert.equal(d[19], "CONFLICT");
  assert.equal(d[22], "ALREADY_REGISTERED");
  assert.equal(x.rec(19).difficultyBucket, 4);
  assert.equal(x.rec(19).difficultyConfidence, undefined);
  assert.equal(x.rec(22).difficultyConfidence, undefined);
  assert.equal(r.summary.APPLY, 21);
});

test("reviewed correction can replace a numeric conflict only with exact evidence, and is idempotent", t => {
  const x = make(t), f = makeReviewedRequest(x), sourceAndIdentityBefore = x.snap().slice(1);
  const r = registerDifficulty5({ root: x.root, request: f.request });
  assert.equal(r.summary.APPLY, 1);
  assert.equal(r.summary.CONFLICT, 0);
  assert.equal(r.items[0].after.difficultyBucket, 3);
  assert.equal(r.items[0].consumerBinding, f.staleSourceBinding ? "stale" : "exact");
  const changed = registerDifficulty5({ root: x.root, request: f.request, write: true });
  assert.equal(changed.summary.written, true);
  assert.equal(x.rec(1).difficultyBucket, 3);
  assert.deepEqual(x.snap().slice(1), sourceAndIdentityBefore);
  const replay = registerDifficulty5({ root: x.root, request: f.request, write: true });
  assert.equal(replay.summary.ALREADY_REGISTERED, 1);
  assert.equal(replay.summary.written, false);
  assert.equal(registerDifficulty5({ root: x.root, request: f.request, verifyProjection: true }).summary.VERIFIED, 1);
});

test("reviewed correction does not silently rebind stale source metadata", t => {
  const x = make(t), f = makeReviewedRequest(x, { staleContentBinding: true });
  const sourceAndIdentityBefore = x.snap().slice(1);
  const r = registerDifficulty5({ root: x.root, request: f.request, write: true });
  assert.equal(r.summary.APPLY, 1);
  assert.equal(r.summary.staleSourceBinding, 1);
  assert.equal(x.rec(1).difficultyBucket, 3);
  assert.equal(x.rec(1).contentFingerprint, "stale-content-fingerprint");
  assert.deepEqual(x.snap().slice(1), sourceAndIdentityBefore);
  const verify = registerDifficulty5({ root: x.root, request: f.request, verifyProjection: true });
  assert.equal(verify.summary.VERIFIED, 1);
  assert.equal(verify.summary.staleSourceBinding, 1);
});

test("legacy compatibility is computed from the existing level, not Gemini's string", () => {
  assert.equal(computeLegacyCompat("하", 1), "NORMAL");
  assert.equal(computeLegacyCompat("중", 2), "NORMAL");
  assert.equal(computeLegacyCompat("중", 3), "NORMAL");
  assert.equal(computeLegacyCompat("상", 4), "NORMAL");
  assert.equal(computeLegacyCompat("상", 3), "BORDERLINE_REVIEW");
  assert.equal(computeLegacyCompat("하", 2), "BORDERLINE_REVIEW");
  assert.equal(computeLegacyCompat("하", 4), "STRONG_CONFLICT");
  assert.equal(computeLegacyCompat("상", 1), "STRONG_CONFLICT");
  assert.equal(computeLegacyCompat(null, 3), "UNKNOWN");
});

test("record.level takes priority over the string bucket", t => {
  const x = make(t, { mutateMeta: m => { m.records.find(r => r.sourceOrdinal === 1).level = "상"; } });
  const r = registerDifficulty5({ root: x.root, request: x.req() });
  assert.equal(r.items[0].after.legacyLevelCompatibility, "STRONG_CONFLICT");
});

test("wrap CLI helper and registrar CLI dry-run / verify", t => {
  const x = make(t);
  const w = wrapGeminiFile(FIXTURE, "DRIVE_ID");
  assert.equal(w.schemaVersion, SCHEMA);
  assert.equal(w.driveSha256, sha256(fs.readFileSync(FIXTURE)));
  assert.equal(w.driveChecksumSource, "local_bytes");
  const w2 = wrapGeminiFile(FIXTURE, "DRIVE_ID", "abc123");
  assert.equal(w2.driveSha256, "abc123");
  assert.equal(w2.driveChecksumSource, "drive_metadata");
  const cli = JSON.parse(execFileSync("node", [path.join(repo, "archive/tools/meta-foundation/register-difficulty5.mjs"), "--wrap", FIXTURE, "--drive-file-id", "X", "--drive-checksum", "deadbeef"], { encoding: "utf8" }));
  assert.equal(cli.driveSha256, "deadbeef");
  assert.equal(cli.driveChecksumSource, "drive_metadata");
  assert.equal(w.gemini.requestId, gemini.requestId);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "diff5-bom-"));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const bomPath = path.join(temp, "gemini.json");
  const originalBytes = fs.readFileSync(FIXTURE);
  const bomBytes = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), originalBytes]);
  fs.writeFileSync(bomPath, bomBytes);
  const bomWrapped = wrapGeminiFile(bomPath, "DRIVE_BOM_ID");
  assert.equal(bomWrapped.driveSha256, sha256(bomBytes));
  assert.equal(bomWrapped.driveChecksumSource, "local_bytes");
  assert.equal(bomWrapped.gemini.requestId, gemini.requestId);
  const reqPath = path.join(x.root, ".archive-meta-register/inbox/req.json");
  fs.mkdirSync(path.dirname(reqPath), { recursive: true });
  fs.writeFileSync(reqPath, JSON.stringify(w));
  const reg = path.join(repo, "archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs");
  const out = JSON.parse(execFileSync("node", [reg, "--repo-root", x.root, "--request", reqPath], { encoding: "utf8" }));
  assert.equal(out.summary.APPLY, 23);
  execFileSync("node", [reg, "--repo-root", x.root, "--request", reqPath, "--write"]);
  const ver = JSON.parse(execFileSync("node", [reg, "--repo-root", x.root, "--request", reqPath, "--verify-projection"], { encoding: "utf8" }));
  assert.equal(ver.summary.VERIFIED, 23);
});

// Intake normalization (2026-11-11): the courier's hand repairs moved into the tool. See normalizeGeminiPayload.
const ratingsOf = g => g.items.map(i => [i.ordinal, i.questionUid, i.after.difficultyBucket, i.after.difficultyBoundaryFlag, i.after.legacyLevelCompatibility]);
const lfBlobSha = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");

test("normalize: a clean Gemini file needs no repair and keeps every rating", t => {
  const x = make(t);
  const n = normalizeGeminiPayload(structuredClone(gemini), { root: x.root, driveFileId: "FILE_1" });
  assert.deepEqual(n.repairs, []);
  assert.deepEqual(ratingsOf(n.gemini), ratingsOf(gemini));
  assert.equal(n.gemini.latestBlobSha, gemini.latestBlobSha);
  assert.equal(n.gemini._intakeNote, "Extracted from Drive file FILE_1 (registration fields only)");
  assert.deepEqual(Object.keys(n.gemini), ["_intakeNote", "schemaVersion", "requestId", "createdAt", "sourceArchiveFile", "latestBlobSha", "items"]);
  assert.deepEqual(Object.keys(n.gemini.items[0]), ["ordinal", "questionUid", "before", "after"]);
  assert.equal(registerDifficulty5({ root: x.root, request: x.req(n.gemini) }).summary.APPLY, 23);
});

test("normalize: sourceOrdinal, upper-case confidence and a missing schemaVersion are repaired, ratings are not", t => {
  const x = make(t);
  const drifted = structuredClone(gemini);
  delete drifted.schemaVersion;
  drifted.extraCommentary = "not a registration field";
  for (const item of drifted.items) {
    item.sourceOrdinal = item.ordinal; delete item.ordinal;
    item.after.difficultyConfidence = item.after.difficultyConfidence.toUpperCase();
    item.rationale = "long text that must not reach the inbox";
  }
  // unrepaired, this is exactly what the ledger shows being refused
  assert.throws(() => registerDifficulty5({ root: x.root, request: x.req({ ...drifted, schemaVersion: "v1" }) }), /bad or duplicate ordinal undefined/);
  const n = normalizeGeminiPayload(drifted, { root: x.root, driveFileId: "FILE_2" });
  assert.deepEqual(n.repairs, ["REPAIRED_FORMAT"]);
  assert.match(n.gemini._intakeNote, /REPAIRED_FORMAT/);
  assert.equal(n.gemini.schemaVersion, "v1");
  assert.deepEqual(ratingsOf(n.gemini), ratingsOf(gemini));
  assert.deepEqual(n.gemini.items.map(i => i.after.difficultyConfidence), gemini.items.map(i => i.after.difficultyConfidence));
  assert.equal("extraCommentary" in n.gemini, false);
  assert.equal("rationale" in n.gemini.items[0], false);
  const r = registerDifficulty5({ root: x.root, request: x.req(n.gemini) });
  assert.equal(r.summary.APPLY, 23);
  assert.equal(r.summary.SKIP_INVALID, 0);
});

test("normalize: values that are not a known format slip stay as they are and are still skipped", t => {
  const x = make(t);
  const g = structuredClone(gemini);
  g.items.find(i => i.ordinal === 1).after.difficultyBucket = "3";
  g.items.find(i => i.ordinal === 2).after.difficultyConfidence = "certain";
  g.items.find(i => i.ordinal === 3).after.difficultyBoundaryFlag = "none";
  const n = normalizeGeminiPayload(g, { root: x.root, driveFileId: "FILE_3" });
  assert.deepEqual(n.repairs, []);
  assert.equal(n.gemini.items[0].after.difficultyBucket, "3");
  assert.equal(n.gemini.items[1].after.difficultyConfidence, "certain");
  assert.equal(n.gemini.items[2].after.difficultyBoundaryFlag, "none");
  const d = decisions(registerDifficulty5({ root: x.root, request: x.req(n.gemini) }));
  assert.deepEqual([d[1], d[2], d[3], d[4]], ["SKIP_INVALID", "SKIP_INVALID", "SKIP_INVALID", "APPLY"]);
});

test("normalize: a stale latestBlobSha becomes the LF blob of the current file, also on a CRLF checkout", t => {
  const lf = Buffer.from(sourceBytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
  const crlf = Buffer.from(lf.toString("utf8").replace(/\n/g, "\r\n"), "utf8");
  const stale = structuredClone(gemini); stale.latestBlobSha = "0".repeat(40);
  for (const [label, bytes] of [["LF checkout", lf], ["CRLF checkout", crlf]]) {
    const x = make(t, { sourceOverride: bytes });
    assert.throws(() => registerDifficulty5({ root: x.root, request: x.req(stale) }), /blob drift/, label);
    const n = normalizeGeminiPayload(structuredClone(stale), { root: x.root, driveFileId: "FILE_4" });
    assert.deepEqual(n.repairs, ["REPAIRED_SHA"], label);
    assert.equal(n.gemini.latestBlobSha, lfBlobSha(lf), label + ": the number Git stores, not the working-file bytes");
    assert.match(n.gemini._intakeNote, /REPAIRED_SHA; latestBlobSha was 0{40}$/, label);
    assert.equal(registerDifficulty5({ root: x.root, request: x.req(n.gemini) }).summary.APPLY, 23, label);
    // the same request must also pass where the workflow runs it: a Linux checkout with LF bytes
    const linux = make(t, { sourceOverride: lf });
    assert.equal(registerDifficulty5({ root: linux.root, request: linux.req(n.gemini) }).summary.APPLY, 23, label + " -> LF runner");
  }
});

test("normalize: the identity guard is untouched, a wrong questionUid is still refused after repair", t => {
  const x = make(t);
  const g = withItem(5, i => { i.questionUid = gemini.items[0].questionUid; });
  g.latestBlobSha = "0".repeat(40);
  const n = normalizeGeminiPayload(g, { root: x.root, driveFileId: "FILE_5" });
  assert.deepEqual(n.repairs, ["REPAIRED_SHA"]);
  assert.throws(() => registerDifficulty5({ root: x.root, request: x.req(n.gemini) }), /mismatch/);
});

test("wrap --normalize: a fenced Drive export is unwrapped, repairs go to stderr and the request file keeps its shape", t => {
  const x = make(t);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "diff5-norm-"));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const drifted = structuredClone(gemini);
  for (const item of drifted.items) { item.sourceOrdinal = item.ordinal; delete item.ordinal; }
  const fenced = path.join(temp, "fenced.json"), out = path.join(temp, "request.json");
  fs.writeFileSync(fenced, "```json\n" + JSON.stringify(drifted, null, 2) + "\n```\n");
  const tool = path.join(repo, "archive/tools/meta-foundation/register-difficulty5.mjs");
  const run = spawnSync("node", [tool, "--repo-root", x.root, "--wrap", fenced, "--normalize", "--drive-file-id", "FILE_6", "--drive-checksum", "t|1", "--out", out], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stderr, /^DIFF5_INTAKE_REPAIRS: \[REPAIRED_FORMAT\]\s*$/);
  const request = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.deepEqual(Object.keys(request), ["schemaVersion", "driveFileId", "driveSha256", "driveChecksumSource", "gemini"]);
  assert.equal(request.driveSha256, "t|1");
  assert.equal(registerDifficulty5({ root: x.root, request }).summary.APPLY, 23);
  // without --normalize nothing changes: the old behaviour stays available
  const plain = wrapGeminiFile(FIXTURE, "DRIVE_ID");
  assert.deepEqual(plain.gemini, gemini);
  assert.equal(plain.repairs, undefined);
});
