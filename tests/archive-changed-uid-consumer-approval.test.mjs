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
