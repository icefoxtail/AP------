import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { verifyChangedUidConsumerApproval, renderSummary } from "../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs";
import { loadResolvedConsumerCatalog, verifyConsumerValues } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";
import canonical from "../archive/archive2-canonical.js";
import vm from "node:vm";
import { registerDifficulty5, computeLegacyCompat, DRAFT_SINGLE_MODEL } from "../archive/tools/meta-foundation/register-difficulty5.mjs";
import { textFingerprint } from "../archive/tools/meta-foundation/text-binding-lib.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const checker = path.join(repo, "archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs");
const SCOPED = "archive/data/meta-foundation/exam-scoped/25_금당고_2학기_중간_고2_확률과통계.parent-links.json";
const scoped = JSON.parse(fs.readFileSync(path.join(repo, SCOPED), "utf8"));
const identity = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_identity_map.json"), "utf8")).records;
const uidAt = (file, ordinal) => identity.find(r => r.sourceArchiveFile === file && r.sourceOrdinal === ordinal).questionUid;
const tmp = t => { const d = fs.mkdtempSync(path.join(os.tmpdir(), "changed-uid-")); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
const write = (dir, name, value) => { const f = path.join(dir, name); fs.writeFileSync(f, JSON.stringify(value, null, 2)); return f; };
const cli = (args) => spawnSync(process.execPath, [checker, ...args], { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

test("CLI drains a large JSON result to a slow pipe before returning its failure exit code", async t => {
  const dir = tmp(t);
  const missing = Array.from({ length: 2048 }, (_, i) => path.join(dir, `missing-request-${i}.json`));
  const child = spawn(process.execPath, [checker, ...missing.flatMap(file => ["--request", file])],
    { cwd: repo, stdio: ["ignore", "pipe", "pipe"] });
  const stdout = [], stderr = [];
  child.stdout.on("data", chunk => stdout.push(chunk)); child.stdout.pause();
  child.stderr.on("data", chunk => stderr.push(chunk));
  const closed = new Promise((resolve, reject) => { child.once("error", reject); child.once("close", resolve); });
  await new Promise(resolve => setTimeout(resolve, 750));
  child.stdout.resume();
  assert.equal(await closed, 1, Buffer.concat(stderr).toString("utf8"));
  const text = Buffer.concat(stdout).toString("utf8");
  assert.ok(Buffer.byteLength(text) > 256 * 1024, "exercise output larger than a pipe buffer");
  const out = JSON.parse(text);
  assert.equal(out.status, "FAIL");
  assert.equal(out.failures.length, missing.length);
  assert.equal(out.failures.at(-1).exam, missing.at(-1));
  assert.ok(out.failures.every(row => row.reason === "REQUEST_UNREADABLE"));
});

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
  const unsupported = { schemaVersion: "archive-reviewed-exam-meta-register-request-v9", items: [] };
  const metadata = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_metadata.json"), "utf8")).records;
  const row2 = metadata.find(r => r.sourceArchiveFile === scoped.sourceArchiveFile && r.sourceOrdinal === 2);
  const pinpoint = after => ({ schemaVersion: "archive-finalqa-pinpoint-register-request-v1", examUid: "geumdang-25-probstat", sourceArchiveFile: scoped.sourceArchiveFile,
    expectedSourceBlobSha1: scoped.expectedSourceBlobSha1, items: [
      { sourceOrdinal: 1, questionUid: uidAt(scoped.sourceArchiveFile, 1), before: { standardUnitKey: "X" }, after: { standardUnitKey: "X" } },
      { sourceOrdinal: 2, questionUid: row2.questionUid, before: { standardUnitKey: "OLD" }, after: { standardUnitKey: after } }] });
  // A scoped-links file is bound per record to the question body, so only a request kept on the file blob (a pinpoint) fails on a wrong blob.
  const badBlob = { ...pinpoint(row2.standardUnitKey), expectedSourceBlobSha1: "1".repeat(40) };
  const out = verifyChangedUidConsumerApproval({ root: repo, scopedPaths: [
    write(dir, "bad-body.json", badBody), write(dir, "unsupported.json", unsupported)],
    requestPaths: [write(dir, "pin-ok.json", pinpoint(row2.standardUnitKey)), write(dir, "pin-bad.json", pinpoint("WRONG-UNIT")), write(dir, "bad-blob.json", badBlob)] });
  assert.equal(out.status, "FAIL");
  const reasons = out.failures.map(f => `${f.reason}${f.uid !== "-" ? ":" + f.qid : ""}`).sort();
  assert.deepEqual(reasons, ["BODY_FINGERPRINT_MISMATCH:" + badBody.records[0].sourceOrdinal, "SOURCE_BLOB_MISMATCH", "UNSUPPORTED_REQUEST_SCHEMA", "VALUE_MISMATCH:2"].sort());
  const pinOk = out.exams.find(e => e.file.endsWith("pin-ok.json"));
  assert.deepEqual([pinOk.changed, pinOk.checked, pinOk.passed, pinOk.skippedUnchanged], [1, 1, 1, 1], "unchanged row skipped but counted; changed row approved");
  assert.equal(out.failures.find(f => f.reason === "VALUE_MISMATCH").uid, row2.questionUid);
  assert.equal(out.failures.find(f => f.reason === "UNSUPPORTED_REQUEST_SCHEMA").uid, "-");
});

// Freeze the historical request with the source and approved 24-UID consumer inputs it describes.
// Comparing its old blob to mutable production main tested later edits, not the v2 consumer contract.
// Keep the real resolver/page index and digest-bound manifest; no production guard is mocked or waived.
function historicalConsumerFixture(t) {
  const fixture = JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/archive-gangnam-v2-consumer.json"), "utf8"));
  const root = tmp(t), hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  const put = (relative, bytes) => {
    const destination = path.resolve(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, bytes);
    return destination;
  };
  const source = put(`archive/exams/${fixture.request.sourceArchiveFile}`, fixture.sourceText);
  put("archive/data/generated-lite-consumer/v1/index.json", JSON.stringify({ records: [] }));
  const files = Object.entries(fixture.resources).map(([relative, value]) => {
    const bytes = JSON.stringify(value);
    put(`archive/${relative}`, bytes);
    return { path: relative, sha256: hash(bytes) };
  });
  const manifest = { schemaVersion: "archive2-canonical-input-manifest-v1", resolverVersion: canonical.RESOLVER_VERSION,
    projectionVersion: "archive2-canonical-v1:" + hash(canonical.projectionManifestPayload(files, canonical.RESOLVER_VERSION)), files };
  put("archive/data/archive2-canonical-input-manifest.json", JSON.stringify(manifest));
  return { root, source, request: fixture.request, file: put("gangnam.json", JSON.stringify(fixture.request)) };
}

test("fixed whole-exam v2 request: all 24 reviewed L1..L4 and PT/TPL values reach the consumer", t => {
  const { root, file } = historicalConsumerFixture(t);
  const out = verifyChangedUidConsumerApproval({ root, requestPaths: [file] });
  assert.deepEqual(out.failures, []);
  assert.deepEqual(out.counts, { changed: 24, checked: 24, passed: 24, skippedUnchanged: 0 });
});

test("v2 consumer claims skip a crosswalk pointer and fields the registrar does not store", t => {
  const f = historicalConsumerFixture(t);
  const request = structuredClone(f.request);
  for (const item of request.items) {
    Object.assign(item.before, { rpmPrimaryRecordId: null, difficultyBasis: null });
    Object.assign(item.after, { rpmPrimaryRecordId: "M3-RPM-001", difficultyBasis: "author note" });
  }
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "extra-fields.json", request)] });
  assert.deepEqual(out.failures, []);
  assert.deepEqual(out.counts, { changed: 24, checked: 24, passed: 24, skippedUnchanged: 0 });
});

test("empty native preservation patches require the official existing receipt; ordinary KEEP remains skipped", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const request = { ...f.request, requestId: "missing-preservation-receipt", scope: "PARTIAL_UIDS", registryChanges: [],
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, before: {}, after: {} }] };
  const keep = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "keep.json", request)] });
  assert.equal(keep.status, "PASS");
  assert.deepEqual(keep.counts, { changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 });
  const prior = Object.keys(JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/archive-gangnam-v2-consumer.json"), "utf8")).resources)
    .find(file => file.startsWith("data/meta-foundation/evidence/reviewed-exam-meta/"));
  request.approval = { ...request.approval, sourceRebind: { priorReceiptRef: {
    path: "archive/" + prior, sha256: crypto.createHash("sha256").update(fs.readFileSync(path.join(f.root, "archive", prior))).digest("hex") } } };
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "preserve.json", request)] });
  assert.equal(out.status, "FAIL", "already approved canonical rows are not sufficient without native replay");
  assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 0, skippedUnchanged: 0 });
  assert.equal(out.exams[0].kind, "native-approval-preservation");
  assert.equal(out.exams[0].approvalCreated, false); assert.equal(out.exams[0].newMetadataApprovals, 0);
  assert.equal(out.exams[0].preservedMetadataApprovals, 0);
  assert.equal(out.failures[0].reason, "NATIVE_PRESERVATION_MISMATCH");
});

test("native preservation rejects mixed modes, value edits and ambiguous selected scope before consuming rows", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const request = { ...f.request, requestId: "preserved-scope", scope: "PARTIAL_UIDS", registryChanges: [],
    approval: { ...f.request.approval, sourceRebind: { priorReceiptRef: { path: "prior.json", sha256: "a".repeat(64) } } },
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, before: {}, after: {} }] };
  const cases = [
    r => { r.approval.type = "REVIEW2"; },
    r => { r.approval.sourceRebind.schemaVersion = "unknown-preservation"; },
    r => { r.approval.sourceRebind = null; },
    r => { r.approval.metadataReviewed = false; },
    r => { r.approval.type = "META_PIPELINE_AUDIT"; r.approval.sourceRebind.schemaVersion = "unknown-audit-preservation"; },
    r => { r.registryChanges = [{}]; },
    r => { r.scope = "OTHER"; },
    r => { delete r.scope; },
    r => { r.registrationMode = "IDENTITY_FINGERPRINT_ONLY"; },
    r => { r.items[0].after.difficultyBucket = 2; },
    r => { r.items[0].before.difficultyBucket = 2; },
    r => { r.items[0].identityBefore = {}; },
    r => { r.items[0].sourceReview = {}; },
    r => { r.items[0].rebind = {}; },
    r => { r.items[0].typeHold = true; },
    r => { r.items[0].sourceOrdinal = 25; },
    r => { r.items.push({ ...r.items[0] }); },
    r => { r.items.push({ ...r.items[0], questionUid: "another" }); },
    r => { r.expectedQuestionCount = 0; },
    r => { r.items = []; },
    r => { r.requestId = "../../outside"; },
  ];
  for (const mutate of cases) {
    const bad = structuredClone(request); mutate(bad);
    const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "bad-preserve.json", bad)] });
    assert.equal(out.status, "FAIL"); assert.equal(out.counts.passed, 0); assert.equal(out.counts.skippedUnchanged, 0);
    assert.equal(out.failures[0].reason, "INVALID_REQUEST", out.failures[0].detail);
  }
});

test("partial audit preservation is typed as existing approval preservation and still requires its native replay", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const request = { ...f.request, requestId: "missing-partial-audit-proof", scope: "PARTIAL_UIDS", registryChanges: [],
    approval: { ...f.request.approval, type: "META_PIPELINE_AUDIT", sourceRebind: {
      schemaVersion: "archive-native-audit-preservation-v1", priorReceiptRef: { path: "missing.json", sha256: "a".repeat(64) } } },
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, before: {}, after: {} }] };
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "partial-audit.json", request)] });
  assert.equal(out.status, "FAIL");
  assert.equal(out.exams[0].kind, "native-approval-preservation");
  assert.equal(out.exams[0].approvalType, "META_PIPELINE_AUDIT");
  assert.equal(out.exams[0].expectedQuestionCount, 24);
  assert.equal(out.exams[0].newMetadataApprovals, 0); assert.equal(out.exams[0].preservedMetadataApprovals, 0);
  assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 0, skippedUnchanged: 0 });
  assert.equal(out.failures[0].reason, "NATIVE_PRESERVATION_MISMATCH");
});

test("preserved native summary separates old approvals from new approvals and keeps its source denominator", () => {
  const result = { status: "PASS", mainSha: "a".repeat(40), counts: { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 },
    exams: [{ kind: "native-approval-preservation", exam: "fixture", changed: 1, checked: 1, passed: 1, skippedUnchanged: 0,
      approvalType: "FINAL_QA", approvalCreated: false, newMetadataApprovals: 0, preservedMetadataApprovals: 1, expectedQuestionCount: 24 }],
    failures: [], unobservedFields: [], assignmentPending: [] };
  const summary = renderSummary(result);
  assert.match(summary, /changed 1\/1 verified/);
  assert.match(summary, /Preserved FINAL_QA approvals: 1; new approvals: 0; source questions: 24/);
  assert.doesNotMatch(summary, /1\/1 approved/);
});

test("basic preservation is explicitly checked and cannot reuse an approved consumer without its official receipt", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const request = { schemaVersion: "archive-basic-scope-rebind-request-v1", requestId: "basic-preserve-no-receipt", examUid: "historical-fixture",
    sourceArchiveFile: f.request.sourceArchiveFile, expectedSourceBlobSha1: f.request.expectedSourceBlobSha1, expectedQuestionCount: 24,
    approval: { type: "BASIC_SCOPE_REBIND", sourceReview: { schemaVersion: "archive-basic-scope-current-source-preservation-v1" } },
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      after: { sourceFingerprint: item.after.sourceFingerprint, contentFingerprint: item.after.contentFingerprint },
      basicParent: { grade: "고1", curriculumKey: "2015", courseKey: "수학", L1: "fixture", L2: "fixture" } }] };
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "basic-preserve.json", request)] });
  assert.equal(out.status, "FAIL"); assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 0, skippedUnchanged: 0 });
  assert.equal(out.exams[0].kind, "basic-approval-preservation"); assert.equal(out.exams[0].approvalCreated, false);
  assert.equal(out.exams[0].newMetadataApprovals, 0); assert.equal(out.exams[0].advancedApprovals, 0);
  assert.equal(out.failures[0].reason, "BASIC_PRESERVATION_MISMATCH");
  for (const mutate of [r => { r.approval.sourceReview.schemaVersion = "other"; }, r => { r.scope = "PARTIAL_UIDS"; },
    r => { r.registrationMode = "IDENTITY_FINGERPRINT_ONLY"; }, r => { r.items.push({ ...r.items[0] }); }, r => { r.items[0].sourceOrdinal = 25; }]) {
    const bad = structuredClone(request); mutate(bad);
    const result = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "bad-basic.json", bad)] });
    assert.equal(result.status, "FAIL"); assert.equal(result.counts.skippedUnchanged, 0); assert.equal(result.failures[0].reason, "INVALID_REQUEST");
  }
});

test("basic preservation summary reports existing approvals and zero new or advanced approvals", () => {
  const out = renderSummary({ status: "PASS", mainSha: "a".repeat(40), counts: { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 },
    exams: [{ kind: "basic-approval-preservation", exam: "basic", changed: 1, checked: 1, passed: 1, skippedUnchanged: 0,
      preservedMetadataApprovals: 1, expectedQuestionCount: 25, newMetadataApprovals: 0, advancedApprovals: 0, approvalCreated: false }],
    failures: [], unobservedFields: [], assignmentPending: [] });
  assert.match(out, /Preserved basic approvals: 1; new approvals: 0; advanced approvals: 0; source questions: 25/);
  assert.doesNotMatch(out, /1\/1 approved/);
});

test("new BASIC parent Consumer requires the official review and reports a new basic parent separately", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const request = { schemaVersion: "archive-basic-scope-rebind-request-v1", requestId: "new-basic-no-receipt", examUid: "historical-fixture",
    sourceArchiveFile: f.request.sourceArchiveFile, expectedSourceBlobSha1: f.request.expectedSourceBlobSha1, expectedQuestionCount: 24,
    approval: { type: "BASIC_SCOPE_REBIND", sourceReview: { schemaVersion: "archive-reviewed-native-basic-parent-v1" } },
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      after: { sourceFingerprint: item.after.sourceFingerprint, contentFingerprint: item.after.contentFingerprint },
      basicParent: { grade: "중2", curriculumKey: "2022", courseKey: "M2-1", L1: "fixture", L2: "fixture" } }] };
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "new-basic.json", request)] });
  assert.equal(out.status, "FAIL"); assert.equal(out.exams[0].kind, "basic-parent-registration");
  assert.equal(out.exams[0].newBasicParentApprovals, 0); assert.equal(out.exams[0].preservedMetadataApprovals, 0);
  assert.equal(out.exams[0].newMetadataApprovals, 0); assert.equal(out.exams[0].approvalCreated, false);
  assert.equal(out.counts.passed, 0); assert.equal(out.counts.skippedUnchanged, 0); assert.equal(out.failures[0].reason, "BASIC_PRESERVATION_MISMATCH");
  const summary = renderSummary({ status: "PASS", mainSha: "a".repeat(40), counts: { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 },
    exams: [{ kind: "basic-parent-registration", exam: "basic", changed: 1, checked: 1, passed: 1, skippedUnchanged: 0,
      newBasicParentApprovals: 1, preservedMetadataApprovals: 0, expectedQuestionCount: 24, newMetadataApprovals: 1, advancedApprovals: 0, approvalCreated: true }],
    failures: [], unobservedFields: [], assignmentPending: [] });
  assert.match(summary, /New basic parent approvals: 1; preserved prior parents: 0; advanced approvals: 0; source questions: 24/);
  assert.doesNotMatch(summary, /Preserved basic approvals: 1/);
});

test("identity-only Consumer verification reports one exact binding and zero new approvals", t => {
  const f = historicalConsumerFixture(t), item = f.request.items[0];
  const fingerprints = { sourceFingerprint: item.after.sourceFingerprint, contentFingerprint: item.after.contentFingerprint };
  const request = { ...f.request, registrationMode: "IDENTITY_FINGERPRINT_ONLY", scope: "PARTIAL_UIDS", registryChanges: [],
    approval: { ...f.request.approval, type: "FINAL_QA", metadataReviewed: true },
    items: [{ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, before: fingerprints, after: fingerprints,
      identityBefore: { sourceFingerprint: "a".repeat(64) } }] };
  const identityPath = path.join(f.root, "archive/data/question_identity_map.json");
  const identity = { records: [{ questionUid: item.questionUid, sourceArchiveFile: request.sourceArchiveFile,
    sourceOrdinal: item.sourceOrdinal, sourceFingerprint: fingerprints.sourceFingerprint }] };
  fs.writeFileSync(identityPath, JSON.stringify(identity));
  const file = write(f.root, "identity-repair.json", request);
  const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [file] });
  assert.deepEqual(out.failures, []);
  assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 });
  assert.equal(out.exams[0].kind, "identity-fingerprint-repair");
  assert.equal(out.exams[0].identityBindings, 1); assert.equal(out.exams[0].newMetadataApprovals, 0);
  assert.equal(out.exams[0].approvalCreated, false);
  assert.match(renderSummary(out), /changed 1\/1 verified/); assert.match(renderSummary(out), /new approvals: 0/);
  assert.doesNotMatch(renderSummary(out), /1\/1 approved/);

  identity.records[0].sourceFingerprint = "b".repeat(64); fs.writeFileSync(identityPath, JSON.stringify(identity));
  const stale = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [file] });
  assert.equal(stale.status, "FAIL"); assert.equal(stale.failures[0].reason, "IDENTITY_BINDING_MISMATCH");
  identity.records[0].sourceFingerprint = fingerprints.sourceFingerprint; fs.writeFileSync(identityPath, JSON.stringify(identity));
  for (const invalid of [
    { ...request, scope: undefined },
    { ...request, expectedQuestionCount: 23 },
    { ...request, items: [{ ...request.items[0], after: { ...fingerprints, problemTypeKey: "NEW" } }] },
    { ...request, items: [{ ...request.items[0], before: { ...fingerprints, sourceFingerprint: "c".repeat(64) } }] },
    { ...request, items: [request.items[0], request.items[0]] },
  ]) {
    const failed = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [write(f.root, "invalid-identity.json", invalid)] });
    assert.equal(failed.status, "FAIL"); assert.equal(failed.counts.passed, 0);
  }
});

test("fixed whole-exam v2 request: later source bytes and altered approved values are refused", t => {
  const { root, source, file, request } = historicalConsumerFixture(t);
  const changed = structuredClone(request);
  changed.items[6].after.L4 += " (altered)";
  const wrong = verifyChangedUidConsumerApproval({ root, requestPaths: [write(root, "wrong-label.json", changed)] });
  assert.deepEqual(wrong.counts, { changed: 24, checked: 24, passed: 23, skippedUnchanged: 0 });
  assert.equal(wrong.failures.length, 1);
  assert.equal(wrong.failures[0].reason, "VALUE_MISMATCH");
  assert.equal(wrong.failures[0].qid, 7);
  fs.appendFileSync(source, "\n// source revised after the bound review\n");
  const stale = verifyChangedUidConsumerApproval({ root, requestPaths: [file] });
  assert.deepEqual(stale.counts, { changed: 24, checked: 0, passed: 0, skippedUnchanged: 0 });
  assert.deepEqual(stale.failures.map(f => f.reason), ["SOURCE_BLOB_MISMATCH"]);
});

function historicalMetaPipelineConsumer(t) {
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/archive-meta-pipeline-consumer-history.json"), "utf8"));
  assert.equal(manifest.schemaVersion, "archive-meta-pipeline-consumer-history-v1");
  assert.match(manifest.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(execFileSync("git", ["cat-file", "-t", manifest.sourceCommit], { cwd: repo, encoding: "utf8" }).trim(), "commit");
  const root = tmp(t), seen = new Set();
  for (const file of manifest.files) {
    assert.ok(/^(archive|docs)\//.test(file.path) && !/[\\\r\n\0:]/.test(file.path) && file.path.split("/").every(p => p && p !== "." && p !== ".."));
    assert.ok(!seen.has(file.path)); seen.add(file.path);
    const bytes = execFileSync("git", ["show", `${manifest.sourceCommit}:${file.path}`], { cwd: repo, maxBuffer: 128 * 1024 * 1024 });
    assert.equal(bytes.length, file.sizeBytes, "historical input size");
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), file.sha256, "historical input raw SHA");
    assert.equal(crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex"), file.gitBlobSha1, "historical input Git blob");
    const target = path.join(root, file.path); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes);
  }
  return { root, manifest };
}

test("historical META_PIPELINE L3/L4 and level retain exact runtime/version gates after pack upgrades", t => {
  const { root, manifest: historical } = historicalMetaPipelineConsumer(t), uid = historical.targetUid;
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8"));
  const record = metadata.records.find(row => row.questionUid === uid);
  const runtimePath = "archive/data/meta-foundation/runtime/exponents-logarithms-v1.json";
  const runtime = JSON.parse(fs.readFileSync(path.join(root, runtimePath), "utf8"))
    .records.find(row => row.questionUid === uid);
  assert.ok(record && runtime, "registered source record and its runtime row exist");
  assert.equal(runtime.metadataApprovalType, "META_PIPELINE_AUDIT");
  const expectedSourceBlobSha1 = historical.files.find(f => f.path === `archive/exams/${record.sourceArchiveFile}`).gitBlobSha1;
  const request = (l3 = runtime.L3) => ({
    schemaVersion: "archive-reviewed-exam-meta-register-request-v2",
    examUid: "24_매산여고_1학기_중간_고2_수학I",
    sourceArchiveFile: record.sourceArchiveFile,
    expectedSourceBlobSha1,
    approval: { type: "META_PIPELINE_AUDIT" },
    items: [{ sourceOrdinal: record.sourceOrdinal, questionUid: uid,
      before: { level: null, L3: null, L4: null },
      after: { level: runtime.level, L3: l3, L4: runtime.L4 } }],
  });

  const valid = write(tmp(t), "meta-pipeline-runtime.json", request());
  const passed = verifyChangedUidConsumerApproval({ root, requestPaths: [valid] });
  assert.equal(passed.status, "PASS", JSON.stringify(passed.failures));
  assert.deepEqual(passed.counts, { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 });

  const altered = write(tmp(t), "meta-pipeline-runtime-altered.json", request(`${runtime.L3} (altered)`));
  const failed = verifyChangedUidConsumerApproval({ root, requestPaths: [altered] });
  assert.equal(failed.status, "FAIL");
  assert.equal(failed.failures[0].reason, "VALUE_MISMATCH");
  assert.match(failed.failures[0].detail, /Meta Foundation runtime/);
  // This is the actual later mismatch observed on main: the container becomes
  // 1.0.3 while the bound approval row is still 1.0.2. Keep the production gate
  // strict; pinning the positive historical case does not normalize that debt.
  const pack = JSON.parse(fs.readFileSync(path.join(root, runtimePath), "utf8"));
  assert.equal(pack.packVersion, "1.0.2"); assert.equal(runtime.metaFoundationPackVersion, "1.0.2");
  pack.packVersion = "1.0.3";
  const raw = JSON.stringify(pack); fs.writeFileSync(path.join(root, runtimePath), raw);
  const manifestPath = path.join(root, "archive/data/archive2-canonical-input-manifest.json"), manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.files.find(f => f.path === runtimePath.slice("archive/".length)).sha256 = crypto.createHash("sha256").update(raw).digest("hex");
  manifest.projectionVersion = "archive2-canonical-v1:" + crypto.createHash("sha256").update(canonical.projectionManifestPayload(manifest.files, manifest.resolverVersion)).digest("hex");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  const drift = verifyChangedUidConsumerApproval({ root, requestPaths: [valid] });
  assert.equal(drift.status, "FAIL"); assert.equal(drift.counts.passed, 0);
  assert.equal(drift.failures[0].reason, "META_PIPELINE_RUNTIME_MISSING");
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

test("META_PIPELINE IntegrationPattern omission is checked against active runtime EVIDENCE_DEBT", t => {
  const root = tmp(t);
  fs.mkdirSync(path.join(root, "archive"), { recursive: true });
  fs.mkdirSync(path.join(root, "archive/exams/original"), { recursive: true });
  fs.writeFileSync(path.join(root, "archive/exams/original/fixture.js"), "window.questions = " + JSON.stringify([{ id: 1, standardUnitKey: "M3-01", subUnitKey: "M3-01-DEFINITION", level: "하" }]) + ";");
  fs.writeFileSync(path.join(root, "archive/question-index.js"), "window.questionIndex = " + JSON.stringify([{ sourceFile: "original/fixture.js", sourceOrdinal: 1, standardUnitKey: "M3-01", subUnitKey: "M3-01-DEFINITION", level: "하", course: "중3-1" }]) + ";");
  const uid = "fixture-uid";
  const record = { questionUid: uid, sourceArchiveFile: "original/fixture.js", sourceOrdinal: 1, metadataApprovalType: "META_PIPELINE_AUDIT", curriculumKey: "2015", courseKey: "M3-1", standardCourse: "중3-1", L1: "실수와 그 연산", L2: "제곱근과 실수", standardUnitKey: "M3-01", subUnitKey: "M3-01-SQUARE_ROOT", problemTypeKey: "PT_FIXTURE", templateKey: "TPL_FIXTURE", crossConceptKeys: [], conditionKeys: [], integrationPattern: null, difficultyBucket: 1, level: "하", L3: "유형", L4: "풀이 구조" };
  const consumer = { ...record, sourceFile: record.sourceArchiveFile };
  delete consumer.integrationPattern;
  const runtime = { questionUid: uid, integrationPattern: null, L3: "유형", L4: "풀이 구조" };
  assert.doesNotThrow(() => verifyConsumerValues(root, [record], [runtime], { records: [consumer] }));
  assert.throws(() => verifyConsumerValues(root, [record], [{ ...runtime, integrationPattern: "CASE_BRANCH" }], { records: [consumer] }), /Consumer runtime metadata mismatch: fixture-uid.integrationPattern/);
});

test("a REVIEW2 type-hold item is checked only for its source binding; the same change without the type-hold flag still needs the approved assignment", t => {
  const row = loadResolvedConsumerCatalog(repo).records.find(r => Array.isArray(r.canonicalAssignmentReasons) && r.canonicalAssignmentReasons.length &&
    r.questionUid && fs.existsSync(path.join(repo, "archive/exams", r.sourceFile)));
  if (!row) return t.skip("every catalog row currently has an approved canonical assignment");
  const dir = tmp(t);
  const blob = execFileSync("git", ["hash-object", "--path", `archive/exams/${row.sourceFile}`, "--stdin"],
    { cwd: repo, input: fs.readFileSync(path.join(repo, "archive/exams", row.sourceFile)), encoding: "utf8" }).trim();
  const request = (name, extra) => write(dir, name, { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", sourceArchiveFile: row.sourceFile,
    expectedSourceBlobSha1: blob, approval: { type: "REVIEW2" },
    items: [{ sourceOrdinal: row.sourceOrdinal, questionUid: row.questionUid, before: { subUnitKey: "OLD" }, after: { subUnitKey: "NEW", standardUnitKey: "NEW_UNIT", curriculumKey: "2015" }, ...extra }] });
  const out = verifyChangedUidConsumerApproval({ root: repo, requestPaths: [request("hold.json", { typeHold: true }), request("plain.json", {})] });
  const failuresFor = name => out.failures.filter(f => f.file?.endsWith?.(name) || false);
  const reasons = out.failures.map(f => f.reason);
  assert.ok(reasons.includes("NOT_APPROVED_IN_CONSUMER"), "the plain request is still gated");
  assert.equal(out.failures.length, reasons.filter(r => ["NOT_APPROVED_IN_CONSUMER", "VALUE_MISMATCH"].includes(r)).length);
  assert.ok(out.exams.find(e => e.file.endsWith("hold.json")).passed >= 1, "the type-hold item passes on its source binding");
});

// Freeze the two real refused D5 inputs. The source, request and typed proof are
// read from their immutable public Git commit; the fixture stores only the exact
// pre-registration metadata/identity rows. No semantic review is synthesized.
function difficultyRefusalFixture(t, caseIndex) {
  const spec = JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/archive-difficulty5-consumer-refusals.json"), "utf8"));
  const entry = spec.cases[caseIndex], f = historicalConsumerFixture(t);
  const hash = b => crypto.createHash("sha256").update(b).digest("hex");
  const git = relative => execFileSync("git", ["show", `${spec.origin.commit}:${relative}`], { cwd: repo, maxBuffer: 8 * 1024 * 1024 });
  const put = (relative, bytes) => { const p = path.join(f.root, relative); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, bytes); return p; };
  const source = git(entry.sourcePath); assert.equal(hash(source), entry.sourceRawSha256);
  assert.equal(crypto.createHash("sha1").update(`blob ${source.length}\0`).update(source).digest("hex"), entry.sourceGitBlobSha1);
  put(entry.sourcePath, source);
  const requestBytes = git(entry.requestPath); assert.equal(hash(requestBytes), entry.requestSha256);
  const request = JSON.parse(requestBytes), file = put("difficulty.json", requestBytes);
  for (const ref of entry.evidenceRefs) { const bytes = git(ref.path); assert.equal(hash(bytes), ref.sha256); put(ref.path, bytes); }
  put("archive/data/question_metadata.json", JSON.stringify({ records: [entry.metadataBefore] }));
  put("archive/data/question_identity_map.json", JSON.stringify({ records: [entry.identityBefore] }));
  const applied = registerDifficulty5({ root: f.root, request, write: true });
  assert.equal(applied.status, "PASS"); assert.equal(applied.summary.APPLY, 1);
  const meta = JSON.parse(fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json"))).records[0];
  const context = { window: {} }; vm.runInNewContext(source.toString(), context);
  const q = context.window.questionBank[entry.sourceOrdinal - 1];
  const fp = hash(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
  const contentFp = hash(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
  const catalogPath = path.join(f.root, "archive/data/archive2-catalog.json"), catalog = JSON.parse(fs.readFileSync(catalogPath));
  const fields = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "tagConfidence", "tagStatus"];
  const row = { ...catalog.records[0], sourceFile: request.gemini.sourceArchiveFile, sourceOrdinal: entry.sourceOrdinal,
    sourceQuestionNo: String(q.id), questionUid: entry.questionUid, sourceGrade: caseIndex ? "중2" : "중3", effectiveBrowseGrade: caseIndex ? "중2" : "중3",
    sourceFingerprint: fp, assignmentFingerprint: contentFp, approvedSourceFingerprint: meta.sourceFingerprint,
    metadataRevision: meta.metadataRevision ?? "", sourceStatus: "HOLD", sourceReviewStatus: meta.metadataStatus,
    semanticDisposition: "HOLD", sourceIssueHold: false, automatic: false, defaultSelectable: true,
    metadataAssignmentEvidence: { questionUid: entry.questionUid, sourceFile: request.gemini.sourceArchiveFile,
      sourceOrdinal: entry.sourceOrdinal, sourceFingerprint: meta.sourceFingerprint, assignmentFingerprint: meta.contentFingerprint,
      metadataStatus: meta.metadataStatus, fieldStatus: meta.fieldStatus, evidenceRefs: meta.approvalEvidence || [],
      evidenceDigest: hash(JSON.stringify(meta)), metadataRevision: meta.metadataRevision ?? "" },
    metadataConflicts: fields.filter(field => q[field] !== undefined && q[field] !== null && meta[field] !== undefined && JSON.stringify(q[field]) !== JSON.stringify(meta[field])),
    assignmentEvidence: null, canonicalAssignmentReasons: ["assignment_missing"], metaProjection: null,
    metaProjectionStatus: "DISPLAY_PROJECTION_UNAVAILABLE", metaProjectionFailureReason: "DISPLAY_PROJECTION_CORE_APPROVAL_MISSING",
    ...Object.fromEntries(fields.map(field => [field, meta[field] ?? null])) };
  for (const field of ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey", "standardUnitKey", "subUnitKey"])
    row[field] = "";
  catalog.records = [row]; catalog.sourceHashes = [[request.gemini.sourceArchiveFile, hash(source)]];
  catalog.exams = [{ ...catalog.exams[0], file: request.gemini.sourceArchiveFile, qCount: context.window.questionBank.length }];
  const refresh = () => {
    fs.writeFileSync(catalogPath, JSON.stringify(catalog));
    const manifestPath = path.join(f.root, "archive/data/archive2-canonical-input-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath));
    for (const item of manifest.files) item.sha256 = hash(fs.readFileSync(path.resolve(f.root, "archive", item.path)));
    manifest.projectionVersion = "archive2-canonical-v1:" + hash(canonical.projectionManifestPayload(manifest.files, canonical.RESOLVER_VERSION));
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  };
  refresh();
  return { ...f, file, request, entry, meta, row, catalog, refresh, put,
    check: () => verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [file] }) };
}

for (const caseIndex of [0, 1]) test(`D5-only exact refused request ${caseIndex}: official tuple and page/query pass without semantic promotion`, t => {
  const f = difficultyRefusalFixture(t, caseIndex);
  const before = fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json"));
  const out = f.check(); assert.equal(out.status, "PASS", JSON.stringify(out.failures));
  assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 });
  assert.equal(out.exams[0].officialDifficultyTuplesVerified, 1); assert.equal(out.exams[0].semanticApproval, false);
  assert.equal(out.exams[0].newMetadataApprovals, 0); assert.equal(out.exams[0].approvalCreated, false);
  assert.equal(out.metadataConflictAdvisories.length, caseIndex ? 1 : 2);
  assert.ok(out.metadataConflictAdvisories.every(row => row.semanticApproval === false));
  assert.equal(out.metadataConflictAdvisories[0].reason, caseIndex ? "OFFICIAL_D5_LEGACY_COMPATIBILITY_NORMALIZATION" : "SEMANTIC_REVIEW_PENDING_UNCHANGED");
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json")), before);
  assert.equal(f.row.automatic, false); assert.equal(f.row.semanticDisposition, "HOLD");
  const resolved = loadResolvedConsumerCatalog(f.root).records[0];
  assert.ok(resolved.canonicalAssignmentReasons.length, "no advanced assignment approval was added");
  assert.match(renderSummary(out), /four-field difficulty projection/); assert.match(renderSummary(out), /no semantic approval/);
  assert.doesNotMatch(renderSummary(out), /changed 1\/1 approved/);
});

for (const [field, badValue] of Object.entries({ difficultyBucket: 1, difficultyConfidence: "low", difficultyBoundaryFlag: "B45", legacyLevelCompatibility: "STRONG_CONFLICT" })) {
  test(`D5-only official projection rejects mutated canonical metadata ${field}`, t => {
    const f = difficultyRefusalFixture(t, 0); f.meta[field] = badValue;
    f.put("archive/data/question_metadata.json", JSON.stringify({ records: [f.meta] }));
    const out = f.check(); assert.equal(out.status, "FAIL"); assert.equal(out.counts.passed, 0);
    assert.match(out.failures[0].detail, /official difficulty projection failed/);
    assert.deepEqual(out.metadataConflictAdvisories, []);
  });
  test(`D5-only official tuple rejects stale exposed Consumer ${field}`, t => {
    const f = difficultyRefusalFixture(t, 0); f.row[field] = badValue; f.refresh();
    const out = f.check(); assert.equal(out.status, "FAIL"); assert.equal(out.counts.passed, 0);
    assert.match(out.failures[0].detail, /official difficulty tuple != canonical consumer/);
  });
}

test("D5-only typed evidence and raw compatibility drift still fail before advisory classification", t => {
  for (const change of ["evidence", "compatibility", "source", "uid"]) {
    const f = difficultyRefusalFixture(t, 0);
    if (change === "evidence") f.put(f.request.reviewedCorrection.evidencePath, "{}");
    if (change === "compatibility") { f.request.gemini.items[0].after.legacyLevelCompatibility = "BORDERLINE_ACCEPTABLE"; f.put("difficulty.json", JSON.stringify(f.request)); }
    if (change === "source") fs.appendFileSync(path.join(f.root, f.entry.sourcePath), "\n// drift\n");
    if (change === "uid") { f.request.gemini.items[0].questionUid = "qid_v1_" + "a".repeat(64); f.put("difficulty.json", JSON.stringify(f.request)); }
    const out = f.check(); assert.equal(out.status, "FAIL", change); assert.equal(out.counts.passed, 0, change);
    assert.deepEqual(out.metadataConflictAdvisories, [], change);
  }
});

test("D5-only advisories do not waive unknown, PT/TPL, identity or source conflicts", t => {
  for (const field of ["problemTypeKey", "templateKey", "identity", "sourceFingerprint", "unexpectedField"]) {
    const f = difficultyRefusalFixture(t, 0); f.row.metadataConflicts.push(field); f.refresh();
    const out = f.check(); assert.equal(out.status, "FAIL", field); assert.equal(out.counts.passed, 0);
    assert.equal(out.failures[0].reason, "METADATA_CONFLICT"); assert.equal(out.failures[0].detail, field);
  }
});

test("D5-only tag advisory requires the exact pending semantic context and cannot carry semantic edits", t => {
  const f = difficultyRefusalFixture(t, 0);
  f.meta.metadataStatus = "approved_semantic_review";
  f.put("archive/data/question_metadata.json", JSON.stringify({ records: [f.meta] }));
  const out = f.check(); assert.equal(out.status, "FAIL"); assert.equal(out.failures[0].reason, "METADATA_CONFLICT");
  const other = difficultyRefusalFixture(t, 0); other.request.gemini.items[0].after.problemTypeKey = "PT_UNREVIEWED";
  other.put("difficulty.json", JSON.stringify(other.request));
  const bad = other.check(); assert.equal(bad.status, "FAIL"); assert.equal(bad.failures[0].reason, "INVALID_REQUEST");
});

test("D5-only compatibility normalization never applies to typed corrections or other registration kinds", t => {
  const f = difficultyRefusalFixture(t, 0); f.row.metadataConflicts = ["legacyLevelCompatibility"]; f.refresh();
  const typed = f.check(); assert.equal(typed.status, "FAIL"); assert.equal(typed.failures[0].reason, "METADATA_CONFLICT");
  const p = difficultyRefusalFixture(t, 0);
  p.put("difficulty.json", JSON.stringify({ schemaVersion: "archive-finalqa-pinpoint-register-request-v1", examUid: "same-d5-value-non-d5-kind",
    sourceArchiveFile: p.request.gemini.sourceArchiveFile, expectedSourceBlobSha1: p.request.gemini.latestBlobSha,
    items: [{ questionUid: p.entry.questionUid, sourceOrdinal: p.entry.sourceOrdinal, before: { difficultyBucket: 3 }, after: { difficultyBucket: 4 } }] }));
  const other = p.check(); assert.equal(other.status, "FAIL"); assert.equal(other.failures[0].reason, "METADATA_CONFLICT");
});

// An ordinary difficulty request without a legacy level carries three fields (the registrar writes legacyLevelCompatibility only
// for a row that still has a level, a2850c075f). The consumer gate compares every field the registrar reports and always requires
// the three core fields; a level-less request is not refused for the absent compatibility field.
function levelLessFixture(t, { drop = [], keepCompat = false, inline = null } = {}) {
  const f = difficultyRefusalFixture(t, 0), g = f.request.gemini, item = g.items[0];
  const after = Object.fromEntries(["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", ...(keepCompat ? ["legacyLevelCompatibility"] : [])]
    .filter(field => !drop.includes(field)).map(field => [field, item.after[field]]));
  let latestBlobSha = g.latestBlobSha;
  if (inline) {
    // The exam file's own inline annotation of the registered question (what the catalog compares with the registered value).
    const file = path.join(f.root, f.entry.sourcePath);
    fs.appendFileSync(file, `\n;Object.assign(window.questionBank[${f.entry.sourceOrdinal - 1}], ${JSON.stringify(inline)});\n`);
    const raw = fs.readFileSync(file), lf = raw.includes(0x0d) ? Buffer.from(raw.toString("utf8").replace(/\r\n/g, "\n")) : raw;
    latestBlobSha = crypto.createHash("sha1").update(`blob ${lf.length}\0`).update(lf).digest("hex");
  }
  const request = { schemaVersion: f.request.schemaVersion, gemini: { schemaVersion: "v1", requestId: "level-less-test",
    sourceArchiveFile: g.sourceArchiveFile, latestBlobSha, items: [{ ordinal: item.ordinal, questionUid: item.questionUid, after }] } };
  f.put("difficulty.json", JSON.stringify(request));
  return f;
}
const otherValue = (field, current) => field === "difficultyBucket" ? (current === 1 ? 2 : 1) : field === "difficultyConfidence" ? "low" : "B45";

test("level-less difficulty request (three fields) passes the consumer gate", t => {
  const f = levelLessFixture(t);
  const out = f.check(); assert.equal(out.status, "PASS", JSON.stringify(out.failures));
  assert.equal(out.exams[0].officialDifficultyTuplesVerified, 1); assert.equal(out.exams[0].semanticApproval, false);
  assert.deepEqual(out.counts, { changed: 1, checked: 1, passed: 1, skippedUnchanged: 0 });
  // a stale exposed compatibility value is not part of what the request registered
  f.row.legacyLevelCompatibility = "STRONG_CONFLICT"; f.refresh();
  assert.equal(f.check().status, "PASS");
});

test("level-less difficulty request: a core field that is missing or different is still refused", t => {
  for (const field of ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag"]) {
    const missing = levelLessFixture(t, { drop: [field] });
    const out = missing.check(); assert.equal(out.status, "FAIL", "missing " + field); assert.equal(out.counts.passed, 0);
    const f = levelLessFixture(t);
    f.meta[field] = otherValue(field, f.meta[field]);
    f.put("archive/data/question_metadata.json", JSON.stringify({ records: [f.meta] }));
    const bad = f.check(); assert.equal(bad.status, "FAIL", "different " + field);
    assert.match(bad.failures[0].detail, /official difficulty projection failed/);
    const stale = levelLessFixture(t);
    stale.row[field] = otherValue(field, stale.row[field]); stale.refresh();
    const staleOut = stale.check(); assert.equal(staleOut.status, "FAIL", "stale consumer " + field);
    assert.match(staleOut.failures[0].detail, /official difficulty tuple != canonical consumer/);
  }
});

// A row that still has a legacy level gets a compatibility value from the registrar: all four fields are reported and compared.
function leveledFixture(t) {
  const f = levelLessFixture(t, { keepCompat: true }), compat = computeLegacyCompat("중", f.meta.difficultyBucket);
  f.meta.level = "중"; f.meta.legacyLevelCompatibility = compat; f.row.legacyLevelCompatibility = compat;
  f.put("archive/data/question_metadata.json", JSON.stringify({ records: [f.meta] })); f.refresh();
  return { f, compat };
}

test("a row with a legacy level keeps the four-field comparison (compatibility value must match)", t => {
  const { f, compat } = leveledFixture(t), ok = f.check();
  assert.equal(ok.status, "PASS", JSON.stringify(ok.failures));
  const wrong = compat === "STRONG_CONFLICT" ? "NORMAL" : "STRONG_CONFLICT";
  const mutated = leveledFixture(t).f; mutated.meta.legacyLevelCompatibility = wrong;
  mutated.put("archive/data/question_metadata.json", JSON.stringify({ records: [mutated.meta] }));
  const out = mutated.check(); assert.equal(out.status, "FAIL"); assert.match(out.failures[0].detail, /official difficulty projection failed/);
  const stale = leveledFixture(t).f; stale.row.legacyLevelCompatibility = wrong; stale.refresh();
  const staleOut = stale.check(); assert.equal(staleOut.status, "FAIL"); assert.match(staleOut.failures[0].detail, /official difficulty tuple != canonical consumer/);
});

// A difficulty request blocks only on the fields it changes. The exam file's older inline annotations in other fields stay visible as advisories.
test("ordinary difficulty request: an inline conflict in a field the request does not change is an advisory, not a refusal", t => {
  const f = levelLessFixture(t);
  f.row.metadataConflicts = ["reviewStatus", "problemTypeKey", "templateKey", "integrationPattern"]; f.refresh();
  const out = f.check(); assert.equal(out.status, "PASS", JSON.stringify(out.failures));
  assert.deepEqual(out.metadataConflictAdvisories.map(a => [a.field, a.reason]),
    ["reviewStatus", "problemTypeKey", "templateKey", "integrationPattern"].map(field => [field, "NOT_CHANGED_BY_THIS_REQUEST"]));
  assert.ok(out.metadataConflictAdvisories.every(a => a.semanticApproval === false));
  assert.equal(out.exams[0].semanticApproval, false);
  // a real defect flag is never waived
  const defect = levelLessFixture(t); defect.row.metadataConflicts = ["foundationTaxonomy"]; defect.refresh();
  const refused = defect.check(); assert.equal(refused.status, "FAIL"); assert.equal(refused.failures[0].reason, "METADATA_CONFLICT");
});

test("ordinary difficulty request: an inline placeholder in a registered field is not a conflict, a real inline value that differs is refused", t => {
  const placeholders = levelLessFixture(t, { inline: { difficultyBucket: "UNKNOWN", difficultyConfidence: "", difficultyBoundaryFlag: null } });
  placeholders.row.metadataConflicts = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag"]; placeholders.refresh();
  const ok = placeholders.check(); assert.equal(ok.status, "PASS", JSON.stringify(ok.failures));
  assert.deepEqual(ok.metadataConflictAdvisories.map(a => [a.field, a.reason]),
    ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag"].map(field => [field, "INLINE_PLACEHOLDER_REPLACED"]));
  for (const [field, inlineValue] of [["difficultyBucket", 5], ["difficultyBucket", "중"], ["difficultyConfidence", "low"], ["difficultyBoundaryFlag", "B45"]]) {
    const f = levelLessFixture(t, { inline: { [field]: inlineValue } });
    const registered = f.request.gemini.items[0].after[field];
    if (registered === inlineValue) continue;
    f.row.metadataConflicts = [field]; f.refresh();
    const out = f.check(); assert.equal(out.status, "FAIL", field + "=" + inlineValue);
    assert.equal(out.failures[0].reason, "METADATA_CONFLICT"); assert.equal(out.failures[0].detail, field);
    assert.deepEqual(out.metadataConflictAdvisories, []);
  }
});

// A text-bound draft (approvalType DRAFT_SINGLE_MODEL, every item carries the stem+choices fingerprint) is bound per question: another
// question's solution being edited changes the whole-file blob, which the consumer gate must not treat as a mismatch. A request that is not
// a text-bound draft keeps the whole-file blob binding.
function draftFixture(t, { draft = true, fingerprint = true } = {}) {
  const f = levelLessFixture(t), base = JSON.parse(fs.readFileSync(f.file, "utf8")), item = base.gemini.items[0];
  const file = path.join(f.root, f.entry.sourcePath), context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context);
  if (fingerprint) item.textBindingFingerprint = textFingerprint(context.window.questionBank[f.entry.sourceOrdinal - 1]);
  const request = draft ? { ...base, approvalType: DRAFT_SINGLE_MODEL, judge: "opencode-go/deepseek-v4.1-flash" } : base;
  f.put("difficulty.json", JSON.stringify(request));
  // another question's solution is edited after the request was generated: the file blob no longer matches latestBlobSha
  const other = f.entry.sourceOrdinal === 1 ? 1 : 0;
  fs.appendFileSync(file, `\n;window.questionBank[${other}].solution = "다른 문항 해설 한 글자 수정";\n`);
  return f;
}

test("text-bound draft: another question's solution edit (file blob differs) still passes the consumer gate", t => {
  const f = draftFixture(t), out = f.check();
  assert.equal(out.status, "PASS", JSON.stringify(out.failures));
  assert.equal(out.exams[0].officialDifficultyTuplesVerified, 1); assert.equal(out.exams[0].semanticApproval, false);
});

test("not a text-bound draft (ordinary request or an item without the fingerprint) with a changed file blob is refused as before", t => {
  for (const options of [{ draft: false }, { fingerprint: false }]) {
    const out = draftFixture(t, options).check();
    assert.equal(out.status, "FAIL", JSON.stringify(options)); assert.equal(out.counts.passed, 0);
    assert.equal(out.failures[0].reason, "SOURCE_BLOB_MISMATCH");
  }
});

test("a typed (reviewed) difficulty correction keeps refusing every conflict", t => {
  const f = difficultyRefusalFixture(t, 0); f.row.metadataConflicts = ["reviewStatus"]; f.refresh();
  const out = f.check(); assert.equal(out.status, "FAIL"); assert.equal(out.failures[0].reason, "METADATA_CONFLICT"); assert.equal(out.failures[0].detail, "reviewStatus");
});

test("scoped parent links are bound per record to the question body, not to the file blob", t => {
  const dir = tmp(t);
  const stale = structuredClone(scoped);
  stale.expectedSourceBlobSha1 = "0".repeat(40);
  const ok = cli(["--scoped", write(dir, "scoped-stale-blob.json", stale), "--summary-file", path.join(dir, "ok.md")]);
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.equal(JSON.parse(ok.stdout).failures.length, 0, "a different file blob alone is not a defect");
  const changed = structuredClone(stale);
  changed.records.find(r => r.sourceOrdinal === 5).sourceBodyFingerprint = "a".repeat(64);
  const bad = cli(["--scoped", write(dir, "scoped-changed-body.json", changed), "--summary-file", path.join(dir, "bad.md")]);
  assert.equal(bad.status, 1, "a changed question body still fails");
});
