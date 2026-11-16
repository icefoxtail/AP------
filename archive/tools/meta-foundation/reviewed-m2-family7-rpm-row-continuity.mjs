import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

// This carrier separates the immutable native RPM document from the current
// evidence file. It returns the same selected row; it grants no field, primary,
// parent, difficulty or display approval. The existing callers retain all of
// their own Native, independent-primary, ACTIVE-tuple and master checks.
export const M2_FAMILY7_RPM_ROW_SCHEMA = "archive-m2-family7-rpm-row-continuity-v1";
const RPM = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json";
const NATIVE_COMMIT = "c28641f67d91bfb27352b11faaef4552f46c45be";
const deepFreeze = value => { if (value && typeof value === "object") { Object.values(value).forEach(deepFreeze); Object.freeze(value); } return value; };
const HISTORICAL = deepFreeze({ commit: NATIVE_COMMIT, path: RPM,
  gitBlobSha1: "b473778736362698a70d213b68e203218fc64d59",
  sha256: "924ae2c0b02dbf29784551eaa90c63e27a5d6de39ab5cb65b563f59e6e2c0c39", bytes: 156288 });
export const M2_FAMILY7_RPM_ITEMS = deepFreeze([
  {
    "key": "E017-Q06",
    "questionUid": "qid_v1_9a0686ad7215cc2afff66c158131fd343a64bd2111f30341df6b8383aaba1b7c",
    "sourceOrdinal": 6,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "role": "NATIVE_FAMILY",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
      "gitBlobSha1": "63eab81ab79d055e3cee12f7810a6d6ead7c4b91",
      "sha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
      "bytes": 108357
    },
    "nativeItemSha256": "f065905c0ac68cff39e7bbe8314a8d8c61e1d6cf4aef635d0f5f786f2dd673db",
    "rpmRecordId": "M2-RPM-068",
    "rpmRecordSha256": "0a1d6b02740ea3d9f430343590bd7a48ad1c4eb1d9a93600b31845b5ec941aa1"
  },
  {
    "key": "E029-Q21",
    "questionUid": "qid_v1_8990c9c9fa76871210a4690b9e27e1f43bab743072b3235f224d0b2d20d5da58",
    "sourceOrdinal": 21,
    "sourceArchiveFile": "original/middle/m2/2mid/23_이수중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 24,
    "role": "NATIVE_FAMILY",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E029/review.json",
      "gitBlobSha1": "60b7ef0220220de005f049b7edecfa8cd11f8255",
      "sha256": "cfaa00f0d5960c0007c3513e06faeaf2cc5b5d7ce508958afb7f8d149af2721a",
      "bytes": 109329
    },
    "nativeItemSha256": "bdc78c55f6807cae0b8459d71bff0855eb4e56f78ca3466d71ab96b142deb3d4",
    "rpmRecordId": "M2-RPM-069",
    "rpmRecordSha256": "3c725ace2ec4ccaf76accd6b5c3488951f2485130c13bd0e38b6dee46e463280"
  },
  {
    "key": "E006-Q21",
    "questionUid": "qid_v1_df7a46a1d2551864d378ffa34389721380b230aa6e36d5a8d064be61aada21ea",
    "sourceOrdinal": 21,
    "sourceArchiveFile": "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 23,
    "role": "INDEPENDENT_RETAINED",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E006/review.json",
      "gitBlobSha1": "724da790093f301bbd980a8f39f60c6961599bed",
      "sha256": "9ba15da4cc19ecc688929b4d1994538ba9fe68452c801f5526158bd1335db96d",
      "bytes": 88557
    },
    "nativeItemSha256": "6dd0f958c3b766a11adf8f58621532dd6235358270f407ff38a5b5ee28b6ec2e",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "key": "E006-Q03",
    "questionUid": "qid_v1_77bdb41803d8e38bf819ade572a121911b9ef1bf783541203c671df15ec0985f",
    "sourceOrdinal": 3,
    "sourceArchiveFile": "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 23,
    "role": "INDEPENDENT_RETAINED",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E006/review.json",
      "gitBlobSha1": "724da790093f301bbd980a8f39f60c6961599bed",
      "sha256": "9ba15da4cc19ecc688929b4d1994538ba9fe68452c801f5526158bd1335db96d",
      "bytes": 88557
    },
    "nativeItemSha256": "c3b6a0e598266205765a25a457d3da54cc6e374c83f62d57a3f0041c7416cd6f",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "key": "E015-Q08",
    "questionUid": "qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942",
    "sourceOrdinal": 8,
    "sourceArchiveFile": "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 24,
    "role": "INDEPENDENT_RETAINED",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E015/review.json",
      "gitBlobSha1": "ef208dcb4f0f0ebb6a6297c843099441c90bc679",
      "sha256": "1e0f586ce7f097f5838b82d751f9029030515a710ecc0974de2336e307a770c0",
      "bytes": 92931
    },
    "nativeItemSha256": "264716e0110693b7b9bfbf3f021c6adbbf3edc6df624fb6ecb274c8f98b0443e",
    "rpmRecordId": "M2-RPM-069",
    "rpmRecordSha256": "3c725ace2ec4ccaf76accd6b5c3488951f2485130c13bd0e38b6dee46e463280"
  },
  {
    "key": "E015-Q07",
    "questionUid": "qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd",
    "sourceOrdinal": 7,
    "sourceArchiveFile": "original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 24,
    "role": "INDEPENDENT_RETAINED",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E015/review.json",
      "gitBlobSha1": "ef208dcb4f0f0ebb6a6297c843099441c90bc679",
      "sha256": "1e0f586ce7f097f5838b82d751f9029030515a710ecc0974de2336e307a770c0",
      "bytes": 92931
    },
    "nativeItemSha256": "4b49b99b625dae8a43d5e076523cae4f83e56575b1bf86641a6fba457497b93f",
    "rpmRecordId": "M2-RPM-068",
    "rpmRecordSha256": "0a1d6b02740ea3d9f430343590bd7a48ad1c4eb1d9a93600b31845b5ec941aa1"
  },
  {
    "key": "E021-Q08",
    "questionUid": "qid_v1_578b266e333c0ea050c38aafdfde77f81cf8e73f130666f72bc08f15fee3e242",
    "sourceOrdinal": 8,
    "sourceArchiveFile": "original/middle/m2/2final/23_매산중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "role": "INDEPENDENT_RETAINED",
    "nativeReviewRef": {
      "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
      "path": "archive/data/meta-review/m2-s2-20261114/exams/E021/review.json",
      "gitBlobSha1": "a2b56bdbe83391eb3322053d22a8d18b7cae3e4b",
      "sha256": "271659418186e8f3e0bb54b8ddadd6fc853327c947177d67be4f544786ac5558",
      "bytes": 97741
    },
    "nativeItemSha256": "cf81259f2fc5dfe039c863a51dbcd21b924275d8cefde9a55a0962b7e7e15bf8",
    "rpmRecordId": "M2-RPM-103",
    "rpmRecordSha256": "f20805fc7b0161a5428bf73a3bf0899c46eacfb8ea52683c3b503d272adc5347"
  }
]);
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const keys = (v, expected) => v && typeof v === "object" && !Array.isArray(v) && same(Object.keys(v).sort(), [...expected].sort());
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const fail = code => { throw new Error(`M2_FAMILY7_RPM_ROW:${code}`); };
function safe(root, relative) {
  if (typeof relative !== "string" || path.isAbsolute(relative) || /[\\\x00-\x1f\x7f]/.test(relative) ||
      relative.split("/").some(p => !p || p === "." || p === "..")) fail("UNSAFE_PATH");
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("SYMLINK_PATH");
  return full;
}
function git(root, args) {
  try { return execFileSync("git", args, { cwd: root, maxBuffer: 2 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" } }); }
  catch { fail("IMMUTABLE_GIT_UNAVAILABLE"); }
}
function entry(root, commit, relative) {
  safe(root, relative);
  const entries = git(root, ["ls-tree", "-z", commit, "--", relative]).toString("utf8").split("\0");
  if (entries.length !== 2 || entries[1] !== "") fail("GIT_MODE");
  const split = entries[0].indexOf("\t"), header = entries[0].slice(0, split), name = entries[0].slice(split + 1);
  const match = /^100644 blob ([a-f0-9]{40})$/.exec(header);
  if (!match || name !== relative) fail("GIT_MODE");
  return match[1];
}
function immutable(root, ref, cache) {
  if (!keys(ref, ["commit", "path", "gitBlobSha1", "sha256", "bytes"]) || !SHA1.test(ref.commit || "") ||
      !SHA1.test(ref.gitBlobSha1 || "") || !SHA256.test(ref.sha256 || "") || !Number.isSafeInteger(ref.bytes) ||
      ref.bytes < 1 || ref.bytes > 2 * 1024 * 1024) fail("EXACT_REF_REQUIRED");
  safe(root, ref.path);
  const key = stable(["family7-rpm-row-immutable", root, ref]);
  if (!cache.has(key)) {
    if (git(root, ["rev-parse", "--verify", `${ref.commit}^{commit}`]).toString().trim() !== ref.commit ||
        entry(root, ref.commit, ref.path) !== ref.gitBlobSha1) fail("GIT_BINDING");
    const bytes = git(root, ["cat-file", "blob", ref.gitBlobSha1]);
    if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256 || blob(bytes) !== ref.gitBlobSha1) fail("RAW_DIGEST");
    let document; try { document = JSON.parse(bytes); } catch { fail("INVALID_JSON"); }
    cache.set(key, { bytes, document, ref });
  }
  return cache.get(key);
}
function local(root, ref) {
  let bytes;
  try { const file = safe(root, ref.path); if (!fs.statSync(file).isFile()) fail("LIVE_FILE"); bytes = fs.readFileSync(file); }
  catch (error) { if (String(error.message).startsWith("M2_FAMILY7_RPM_ROW:")) throw error; fail("LIVE_FILE"); }
  if (bytes.length !== ref.bytes || sha(bytes) !== ref.sha256 || blob(bytes) !== ref.gitBlobSha1) fail("LIVE_RPM_DRIFT");
  if (entry(root, "HEAD", RPM) !== ref.gitBlobSha1) fail("CURRENT_HEAD_RPM_DRIFT");
}

export function readM2Family7RpmRowContinuity({ root, request, patch, nativeSpec, nativeRow, cache = new Map() }) {
  const target = patch?.targetParentRef;
  if (!target || !Object.hasOwn(target, "nativeRpmRowContinuity")) return null;
  const spec = target.nativeRpmRowContinuity;
  if (!keys(spec, ["schemaVersion", "historicalRef", "currentRef", "recordId", "recordSha256"]) ||
      spec.schemaVersion !== M2_FAMILY7_RPM_ROW_SCHEMA) fail("EXPLICIT_CLOSED_OPTION");
  const item = M2_FAMILY7_RPM_ITEMS.find(r => r.questionUid === patch.questionUid && r.sourceOrdinal === patch.sourceOrdinal);
  if (!item || request.sourceArchiveFile !== item.sourceArchiveFile || request.expectedQuestionCount !== item.expectedQuestionCount ||
      request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" || request.approval.metadataReviewed !== true ||
      Object.hasOwn(request, "registrationMode") || Object.hasOwn(request.approval, "sourceRebind") ||
      request.registryChanges !== undefined && (!Array.isArray(request.registryChanges) || request.registryChanges.length) ||
      ["typeHold", "basicScopeParentRef", "semanticBinding", "approvedMetadataRef", "rebind"].some(k => Object.hasOwn(patch, k))) fail("EXACT_SEVEN_SCOPE");
  const sr = patch.sourceReview;
  if (item.role === "NATIVE_FAMILY" ?
      target.nativeSourceReview?.schemaVersion !== "archive-native-reviewed-parent-v1" ||
        target.nativeSourceReview.crosswalkProfile !== "ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER" ||
        Object.hasOwn(sr || {}, "retainedFields") || Object.hasOwn(sr || {}, "retainedScopeTransport") :
      Object.hasOwn(target, "nativeSourceReview") || sr?.retainedFields?.schemaVersion !== "archive-reviewed-native-retained-fields-v1" ||
        sr?.retainedScopeTransport?.schemaVersion !== "archive-reviewed-retained-scope-transport-v1") fail("EXISTING_TYPED_PROFILE_REQUIRED");
  if (!nativeSpec || nativeSpec.reviewCommit !== NATIVE_COMMIT || nativeSpec.reviewPath !== item.nativeReviewRef.path ||
      !same(nativeSpec.reviewRef, { path: item.nativeReviewRef.path, sha256: item.nativeReviewRef.sha256 }) ||
      sr?.schemaVersion !== "archive-reviewed-source-reassessment-v1" || sr.reviewCommit !== nativeSpec.reviewCommit ||
      sr.reviewPath !== nativeSpec.reviewPath || !same(sr.reviewRef, nativeSpec.reviewRef) ||
      !same(spec.historicalRef, HISTORICAL) || spec.currentRef?.path !== RPM || spec.recordId !== item.rpmRecordId ||
      spec.recordSha256 !== item.rpmRecordSha256 || nativeRow?.questionUid !== patch.questionUid ||
      nativeRow.sourceOrdinal !== patch.sourceOrdinal || sha(stable(nativeRow)) !== item.nativeItemSha256) fail("ORIGINAL_NATIVE_BINDING");
  const review = immutable(root, item.nativeReviewRef, cache).document;
  const selected = review.items?.filter(r => r.questionUid === item.questionUid && r.sourceOrdinal === item.sourceOrdinal);
  if (review.schemaVersion !== "m2-s2-meta-review-v1" || review.sourceArchiveFile !== item.sourceArchiveFile ||
      review.reviewedQuestionCount !== item.expectedQuestionCount || selected?.length !== 1 ||
      !same(selected[0], nativeRow)) fail("ORIGINAL_NATIVE_ITEM");
  const historical = immutable(root, spec.historicalRef, cache), current = immutable(root, spec.currentRef, cache);
  local(root, spec.currentRef);
  const narrow = { path: RPM, sha256: spec.currentRef.sha256 };
  for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs]) {
    const matches = Array.isArray(refs) ? refs.filter(r => r.path === RPM) : [];
    if (matches.length !== 1 || !same(matches[0], narrow)) fail("CURRENT_EVIDENCE_BINDING");
  }
  const before = historical.document.records?.filter(r => r.id === item.rpmRecordId);
  const after = current.document.records?.filter(r => r.id === item.rpmRecordId);
  if (historical.document.status !== "ACTIVE_REFERENCE" || current.document.status !== "ACTIVE_REFERENCE" ||
      before?.length !== 1 || after?.length !== 1 || !same(before[0], after[0]) ||
      sha(stable(before[0])) !== item.rpmRecordSha256 || before[0].curriculum !== "2015" || before[0].scope !== "M2-2") fail("SELECTED_WHOLE_RPM_ROW_DRIFT");
  return { historical, current, record: before[0], proof: {
    schemaVersion: M2_FAMILY7_RPM_ROW_SCHEMA, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    nativeReviewRef: item.nativeReviewRef, nativeItemSha256: item.nativeItemSha256,
    historicalRef: spec.historicalRef, currentRef: spec.currentRef, recordId: item.rpmRecordId,
    recordSha256: item.rpmRecordSha256, selectedWholeRecordUnchanged: true,
    historicalCurrentWholeFileEqual: historical.ref.sha256 === current.ref.sha256,
    transportedFields: [], mappingStatus: before[0].mappingStatus, bindingStatus: before[0].bindingStatus,
    newPrimaryJudgment: false, newParentApproval: false, newMathematicalQa: false,
    sharedCrosswalkModified: false, canonicalDefinitionsModified: false } };
}
