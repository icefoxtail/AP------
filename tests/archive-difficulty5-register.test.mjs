import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { registerDifficulty5, computeLegacyCompat, wrapGeminiFile, SCHEMA } from "../archive/tools/meta-foundation/register-difficulty5.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = path.join(repo, "tests/fixtures/diff5/req_diff5_17.json");
const gemini = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
const SOURCE = gemini.sourceArchiveFile;
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");

// Read the real sidecars once, keep only this exam's rows. Tests then run on temp copies, never on the real files.
const realMeta = JSON.parse(fs.readFileSync(path.join(repo, META), "utf8"));
const realIds = JSON.parse(fs.readFileSync(path.join(repo, IDENTITY), "utf8"));
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
  ids: { ...realIds, records: realIds.records.filter(r => r.sourceArchiveFile === SOURCE) }
};
const sourceBytes = fs.readFileSync(path.join(repo, "archive/exams", SOURCE));

function make(t, { mutateMeta } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "diff5-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const meta = structuredClone(slice.meta);
  if (mutateMeta) mutateMeta(meta);
  const put = (p, data) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
  put(META, JSON.stringify(meta, null, 2) + "\n");
  put(IDENTITY, JSON.stringify(slice.ids, null, 2) + "\n");
  put("archive/exams/" + SOURCE, sourceBytes);
  const req = (g = gemini) => ({ schemaVersion: SCHEMA, driveFileId: "FILE_ID", driveSha256: "x", gemini: g });
  const rec = n => JSON.parse(fs.readFileSync(path.join(root, META), "utf8")).records.find(r => r.sourceOrdinal === n);
  const snap = () => [META, IDENTITY, "archive/exams/" + SOURCE].map(p => sha256(fs.readFileSync(path.join(root, p))));
  return { root, req, rec, snap };
}
const decisions = r => Object.fromEntries(r.items.map(i => [i.ordinal, i.decision]));
const withItem = (n, fn) => { const g = structuredClone(gemini); fn(g.items.find(i => i.ordinal === n)); return g; };

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
