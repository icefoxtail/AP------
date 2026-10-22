import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { verifyChangedUidConsumerApproval, renderSummary } from "../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs";
import { isMaintenanceClassificationProjected, loadResolvedConsumerCatalog } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const checker = path.join(repo, "archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs");
const SCOPED = "archive/data/meta-foundation/exam-scoped/25_금당고_2학기_중간_고2_확률과통계.parent-links.json";
const scoped = JSON.parse(fs.readFileSync(path.join(repo, SCOPED), "utf8"));
const identity = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_identity_map.json"), "utf8")).records;
const uidAt = (file, ordinal) => identity.find(r => r.sourceArchiveFile === file && r.sourceOrdinal === ordinal).questionUid;
const tmp = t => { const d = fs.mkdtempSync(path.join(os.tmpdir(), "changed-uid-")); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
const write = (dir, name, value) => { const f = path.join(dir, name); fs.writeFileSync(f, JSON.stringify(value, null, 2)); return f; };
const cli = (args) => spawnSync(process.execPath, [checker, ...args], { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

test("current Geumdang scoped parent links: all 12 UIDs are effectively approved in the student consumer path", t => {
  const dir = tmp(t), summary = path.join(dir, "summary.md");
  const r = cli(["--scoped", SCOPED, "--summary-file", summary]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = JSON.parse(r.stdout);
  assert.equal(out.status, "PASS");
  assert.deepEqual(out.counts, { changed: 12, checked: 12, passed: 12, skippedUnchanged: 0 });
  assert.equal(out.failures.length, 0);
  assert.match(out.mainSha, /^[0-9a-f]{40}$/);
  assert.match(fs.readFileSync(summary, "utf8"), /changed 12\/12 approved/);
});

test("an altered expected L2 fails naming exam, QID, UID and reason (exit 1, summary written)", t => {
  const dir = tmp(t), summary = path.join(dir, "summary.md");
  const altered = structuredClone(scoped);
  const target = altered.records.find(r => r.sourceOrdinal === 5);
  const original = target.L2;
  target.L2 = original + "(altered)";
  const file = write(dir, "scoped-altered.json", altered);
  const r = cli(["--scoped", file, "--summary-file", summary]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  const out = JSON.parse(r.stdout);
  assert.equal(out.status, "FAIL");
  assert.equal(out.counts.changed, 12);
  assert.equal(out.counts.passed, 11);
  assert.equal(out.failures.length, 1);
  const [failure] = out.failures;
  assert.equal(failure.qid, 5);
  assert.equal(failure.uid, uidAt(scoped.sourceArchiveFile, 5));
  assert.equal(failure.exam, scoped.sourceArchiveFile);
  assert.equal(failure.reason, "VALUE_MISMATCH");
  assert.ok(failure.detail.includes("L2") && failure.detail.includes(original), failure.detail);
  const md = fs.readFileSync(summary, "utf8");
  assert.ok(md.includes(failure.uid) && md.includes("| 5 |") && md.includes(out.mainSha) && md.startsWith("### Changed-UID"), md);
});

test("bindings: body fingerprint, source blob and unsupported schemas fail; pinpoint rows with before==after are skipped", t => {
  const dir = tmp(t);
  const badBody = structuredClone(scoped); badBody.records[0].sourceBodyFingerprint = "0".repeat(64);
  const badBlob = structuredClone(scoped); badBlob.expectedSourceBlobSha1 = "1".repeat(40);
  const unsupported = { schemaVersion: "archive-reviewed-exam-meta-register-request-v9", items: [] };
  const metadata = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_metadata.json"), "utf8")).records;
  const row2 = metadata.find(r => r.sourceArchiveFile === scoped.sourceArchiveFile && r.sourceOrdinal === 2);
  const pinpoint = after => ({ schemaVersion: "archive-finalqa-pinpoint-register-request-v1", examUid: "geumdang-25-probstat", sourceArchiveFile: scoped.sourceArchiveFile,
    expectedSourceBlobSha1: scoped.expectedSourceBlobSha1, items: [
      { sourceOrdinal: 1, questionUid: uidAt(scoped.sourceArchiveFile, 1), before: { standardUnitKey: "X" }, after: { standardUnitKey: "X" } },
      { sourceOrdinal: 2, questionUid: row2.questionUid, before: { standardUnitKey: "OLD" }, after: { standardUnitKey: after } }] });
  const out = verifyChangedUidConsumerApproval({ root: repo, scopedPaths: [
    write(dir, "bad-body.json", badBody), write(dir, "bad-blob.json", badBlob), write(dir, "unsupported.json", unsupported)],
    requestPaths: [write(dir, "pin-ok.json", pinpoint(row2.standardUnitKey)), write(dir, "pin-bad.json", pinpoint("WRONG-UNIT"))] });
  assert.equal(out.status, "FAIL");
  const reasons = out.failures.map(f => `${f.reason}${f.uid !== "-" ? ":" + f.qid : ""}`).sort();
  assert.deepEqual(reasons, ["BODY_FINGERPRINT_MISMATCH:" + badBody.records[0].sourceOrdinal, "SOURCE_BLOB_MISMATCH", "UNSUPPORTED_REQUEST_SCHEMA", "VALUE_MISMATCH:2"].sort());
  const pinOk = out.exams.find(e => e.file.endsWith("pin-ok.json"));
  assert.deepEqual([pinOk.changed, pinOk.checked, pinOk.passed, pinOk.skippedUnchanged], [1, 1, 1, 1], "unchanged row skipped but counted; changed row approved");
  assert.equal(out.failures.find(f => f.reason === "VALUE_MISMATCH").uid, row2.questionUid);
  assert.equal(out.failures.find(f => f.reason === "UNSUPPORTED_REQUEST_SCHEMA").uid, "-");
});

test("canonical maintenance post-push input is handled separately from exam UIDs and source blobs", t => {
  const request = JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/meta-foundation-calculus1/canonical-maintenance-request.json"), "utf8"));
  assert.deepEqual(request.items, []);
  assert.equal(request.sourceArchiveFile, undefined);
  const file = write(tmp(t), "maintenance.json", request);
  const out = verifyChangedUidConsumerApproval({ root: repo, requestPaths: [file] });
  assert.equal(out.exams.length, 1);
  assert.equal(out.exams[0].kind, "canonical-maintenance-v1");
  assert.equal(out.exams[0].changed, 0);
  assert.equal(out.failures.length, 1);
  assert.equal(out.failures[0].reason, "CANONICAL_MAINTENANCE_VERIFY_FAILED");
  assert.doesNotMatch(out.failures[0].detail, /UNSUPPORTED_REQUEST_SCHEMA|sourceArchiveFile|items\[\]/);
});

test("maintenance verifier rejects a PT/TPL Search leak without approved Catalog assignment evidence", () => {
  const catalog = { questionUid: "SYNTHETIC_TEST_uid", problemTypeKey: "PT_RAW_ONLY", templateKey: "TPL_RAW_ONLY",
    canonicalAssignmentReasons: ["assignment_fields_unreviewed"], assignmentEvidence: null };
  const search = { uid: catalog.questionUid, problemTypeKey: catalog.problemTypeKey, templateKey: catalog.templateKey };
  assert.throws(() => isMaintenanceClassificationProjected(catalog, search),
    /maintenance PT\/TPL Search exposure lacks current approved assignment evidence/);
});

// Historical whole-exam v2 request (FINAL_QA, L1..L4 + PT/TPL + fingerprints). It stays an extra PASS case only
// while that commit is reachable and main still holds the values it registered.
const historic = (() => {
  try { return execFileSync("git", ["show", "b5d98a987:.archive-meta-register/inbox/gangnam25-probstat-finalqa-meta-20261021.json"], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return null; }
})();
test("historical Gangnam v2 request: reviewed L1..L4 are the effective consumer values", { skip: historic ? false : "commit b5d98a987 not available in this clone" }, t => {
  const file = write(tmp(t), "gangnam.json", JSON.parse(historic));
  const out = verifyChangedUidConsumerApproval({ root: repo, requestPaths: [file] });
  assert.deepEqual(out.failures, []);
  assert.deepEqual(out.counts, { changed: 24, checked: 24, passed: 24, skippedUnchanged: 0 });
});

// A row without an approved canonical assignment (a pre-existing catalog gap) only gates requests that change
// assignment-governed fields; other changed fields must still be effective (checked on whatever such row exists).
test("assignment marker gates only assignment-governed changes; other rows are reported as assignmentPending", t => {
  const row = loadResolvedConsumerCatalog(repo).records.find(r => Array.isArray(r.canonicalAssignmentReasons) && r.canonicalAssignmentReasons.length &&
    Number.isInteger(r.difficultyBucket) && r.questionUid && fs.existsSync(path.join(repo, "archive/exams", r.sourceFile)));
  if (!row) return t.skip("every catalog row currently has an approved canonical assignment");
  const dir = tmp(t);
  const blob = execFileSync("git", ["hash-object", "--path", `archive/exams/${row.sourceFile}`, "--stdin"],
    { cwd: repo, input: fs.readFileSync(path.join(repo, "archive/exams", row.sourceFile)), encoding: "utf8" }).trim();
  const request = (name, before, after) => write(dir, name, { schemaVersion: "archive-finalqa-pinpoint-register-request-v1", sourceArchiveFile: row.sourceFile,
    expectedSourceBlobSha1: blob, items: [{ sourceOrdinal: row.sourceOrdinal, questionUid: row.questionUid, before, after }] });
  const wrong = row.difficultyBucket === 5 ? 4 : row.difficultyBucket + 1;
  const out = verifyChangedUidConsumerApproval({ root: repo, requestPaths: [
    request("effective.json", { difficultyBucket: 99 }, { difficultyBucket: row.difficultyBucket }),
    request("ineffective.json", { difficultyBucket: 99 }, { difficultyBucket: wrong }),
    request("governed.json", { subUnitKey: "OLD" }, { subUnitKey: "NEW" })] });
  const byFile = name => out.exams.find(e => e.file.endsWith(name));
  assert.deepEqual([byFile("effective.json").changed, byFile("effective.json").passed], [1, 1], "non-governed change passes without the marker");
  assert.equal(out.assignmentPending.length, 1);
  assert.deepEqual([out.assignmentPending[0].uid, out.assignmentPending[0].qid], [row.questionUid, row.sourceOrdinal]);
  assert.ok(out.assignmentPending[0].reason.length > 0);
  const failures = out.failures.map(f => [f.reason, f.uid, f.qid]).sort();
  assert.deepEqual(failures, [["NOT_APPROVED_IN_CONSUMER", row.questionUid, row.sourceOrdinal], ["VALUE_MISMATCH", row.questionUid, row.sourceOrdinal]].sort(),
    "an ineffective changed value still fails; a governed change still needs the marker");
  const md = renderSummary({ ...out, failures: [], status: "PASS" });
  assert.ok(md.includes("canonical L1/L2 assignment not approved; outside this request's changed fields") && md.includes(`Q${row.sourceOrdinal}`), md);
});
