#!/usr/bin/env node
"use strict";
// Observe original membership and current stored/page values. Never invoke a
// registrar, replay, Native planner, builder, compiler, approval or renderer.
// Raw questions, request values, answers and explanations are not emitted.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const CONFIG = {
  "schemaVersion": "archive-original-issued3330-current-consumer-observation-v1",
  "repository": "icefoxtail/AP------",
  "ref": "refs/heads/ops/middle-original-issued-consumer-26fc-20261117",
  "membership": {
    "commit": "aeabffcc23c70286f7862d69e815080c13490ad0",
    "path": "docs/operations/middle-original-issued-membership-26fc-20261117.json",
    "bytes": 730713,
    "sha256": "5b16b7203a7915373971d1f9849e496dafbedf020ed7360605cb1023f6e8ed73",
    "gitBlobSha1": "34d33edda213f63b9fd11cdf5f36b9952f5b31d3"
  },
  "exactReadApis": [
    {
      "path": "archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs",
      "bytes": 67295,
      "sha256": "8eb6bc7486e8b461ca7a95896cabd5dcccee43de23787bab656053d3b6c1616e",
      "gitBlobSha1": "568c0918843e52e5eb6b55bc1ece59bd25b67054"
    },
    {
      "path": "archive/tools/meta-foundation/register-difficulty5.mjs",
      "bytes": 27878,
      "sha256": "681e30501e9a9f0df7ac78c560a868cba8564864f8ab1468220223d28d360d6e",
      "gitBlobSha1": "33d45e24e26a713f61dca91d9526372c60ea996f"
    },
    {
      "path": "archive/tools/meta-foundation/active-registry.mjs",
      "bytes": 13944,
      "sha256": "fb92f3db9c869183cf04415f9a1d678c60ba52a7ad1ec995beb57e77bdf402ed",
      "gitBlobSha1": "93ed7214a5e4dc0b0cdd9853d388bca26e64a172"
    }
  ],
  "expected": {
    "requests": 160,
    "rows": 3330,
    "D5": 2866,
    "ORIGINAL_FINAL_QA_FIELDS": 464,
    "perPr": {
      "2075": 464,
      "2080": 1299,
      "2103": 1567
    }
  },
  "oldFingerprint": {
    "gitBlobSha1": "1dec75aa752b4e4e7afbc671ec750cf81ee16b86",
    "recovery": "NOT_FOUND_PREVIOUSLY_REPORTED",
    "reuseClaims": 0
  }
};
const MD = "archive/data/question_metadata.json";
const ID = "archive/data/question_identity_map.json";
const MANIFEST = "archive/data/archive2-canonical-input-manifest.json";
const GENERATED = "archive/data/generated-lite-consumer/v1/index.json";
const REGISTRY = "archive/data/meta-foundation/canonical/registry_index.json";
const AUTO = "archive/tools/meta-foundation/auto-register-merged-source.mjs";
const D5 = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const QUERY_FIELDS = new Set(["standardCourse", "standardUnitKey", "subUnitKey", "L1", "L2", "L3", "L4",
  "nativeL1", "nativeL2", "nativeL3", "nativeL4", "problemTypeKey", "templateKey", "integrationPattern",
  "difficultyBucket", "crossConceptKeys", "conditionKeys"]);
const own = (o, k) => Boolean(o) && Object.hasOwn(o, k);
const sha = x => crypto.createHash("sha256").update(x).digest("hex");
const blob = b => crypto.createHash("sha1").update("blob " + b.length + "\0").update(b).digest("hex");
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === "object" && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const hashValue = v => sha(stable(v === undefined ? null : v));
const pins = b => ({ bytes: b.length, sha256: sha(b), gitBlobSha1: blob(b) });
const equal = (a, b) => stable(a) === stable(b);
const required = (ok, code) => { if (!ok) { const e = new Error(code); e.observerCode = code; throw e; } };
const enumValue = (value, allowed) => allowed.includes(value) ? value : value == null ? null : "OTHER";
function git(root, args, options = {}) {
  return execFileSync("git", args, { cwd: root, env: { ...process.env,
    GIT_OPTIONAL_LOCKS: "0", GIT_NO_LAZY_FETCH: "1", GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 128 * 1024 * 1024, timeout: 120000, stdio: ["pipe", "pipe", "pipe"], ...options });
}
const gitText = (root, args) => git(root, args).toString("utf8").trim();
function relativePath(value) {
  required(typeof value === "string" && value.length > 0 && value === value.normalize("NFC") &&
    !value.includes("\0") && !value.includes("\\") && !path.posix.isAbsolute(value) &&
    path.posix.normalize(value) === value && value.split("/").every(p => p && p !== "." && p !== ".."),
  "UNSAFE_PATH");
  return value;
}
function regular(root, relative) {
  relativePath(relative);
  required(fs.realpathSync(root) === root && fs.lstatSync(root).isDirectory(), "ROOT_PATH");
  let full = root;
  const pieces = relative.split("/");
  pieces.forEach((piece, i) => {
    full = path.join(full, piece);
    const stat = fs.lstatSync(full);
    required(!stat.isSymbolicLink() && (i === pieces.length - 1 ? stat.isFile() : stat.isDirectory()),
      "NONREGULAR_INPUT");
  });
  return full;
}
function canonicalInputPath(relative) {
  // This is the one external-to-archive resource declared by the official
  // canonical resolver. Every other path remains a normalized archive path.
  const master = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
  if (relative === "../" + master) return master;
  relativePath(relative);
  return "archive/" + relative;
}
function treeEntry(root, commit, relative) {
  relativePath(relative);
  const text = git(root, ["ls-tree", "-z", commit, "--", relative]).toString("utf8");
  const found = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(text);
  required(found && found[3] === relative, "TRACKED_REGULAR_INPUT");
  return found[2];
}
function authenticateConsumedCanonicalInputs(canonical, manifest, input) {
  required(Array.isArray(canonical?.REQUIRED_INPUT_PATHS) &&
    typeof canonical.runtimeInputPathsFromManifest === "function" &&
    typeof canonical.reviewedRegistrationProofPaths === "function", "CANONICAL_RESOURCE_API_REQUIRED");
  const declared = new Map();
  for (const ref of manifest.files) {
    canonicalInputPath(ref.path);
    required(/^[a-f0-9]{64}$/.test(ref.sha256 || "") && !declared.has(ref.path), "CURRENT_MANIFEST_DIGEST");
    declared.set(ref.path, ref);
  }
  const runtimePaths = canonical.runtimeInputPathsFromManifest(manifest.files);
  required(Array.isArray(runtimePaths), "CANONICAL_RUNTIME_PATHS");
  const consumed = new Map();
  function load(relative) {
    const repoRelative = canonicalInputPath(relative), ref = declared.get(relative);
    required(ref, "CURRENT_CONSUMED_MANIFEST_INPUT_MISSING");
    if (consumed.has(relative)) return consumed.get(relative).data;
    const raw = input.read(repoRelative);
    required(sha(Buffer.from(raw.toString("utf8").replaceAll("\r\n", "\n"))) === ref.sha256, "CURRENT_MANIFEST_INPUT_DRIFT");
    const data = JSON.parse(raw.toString("utf8"));
    consumed.set(relative, { data, sha256: ref.sha256 });
    return data;
  }
  for (const relative of new Set([...canonical.REQUIRED_INPUT_PATHS, ...runtimePaths])) load(relative);
  const proofPaths = canonical.reviewedRegistrationProofPaths(runtimePaths.map(relative => consumed.get(relative).data));
  required(Array.isArray(proofPaths), "CANONICAL_REVIEWED_PROOF_PATHS");
  for (const relative of proofPaths) load(relative);
  const refs = [...consumed].map(([relative, value]) => ({ path: relative, sha256: value.sha256 }))
    .sort((a, b) => a.path.localeCompare(b.path, "en"));
  return { scope: "EXACT_OFFICIAL_LOAD_RESOLVED_CONSUMER_CATALOG_RESOURCE_BOUNDARY",
    manifestDeclaredFiles: declared.size, consumedFiles: consumed.size,
    unconsumedDeclaredFiles: declared.size - consumed.size,
    runtimeFiles: runtimePaths.length, reviewedProofPaths: proofPaths.length,
    consumedWholeSha256: hashValue(refs), unconsumedResourcesClaimedVerified: false,
    officialConsumerExecution: "REQUIRED_NEXT" };
}
function canonicalInputProtocolChecks() {
  const requiredPath = "data/required.json", runtimePath = "data/meta-foundation/runtime/fixture-v1.json";
  const proofPath = "data/meta-foundation/evidence/reviewed-exam-meta/v1/fixture.json";
  const optionalPath = "_generated/intelligence/unused.json";
  const documents = new Map([[requiredPath, Buffer.from('{"required":true}\n')],
    [runtimePath, Buffer.from('{"generatedFrom":{"reviewedExam_fixture":"archive/' + proofPath + '"}}\n')],
    [proofPath, Buffer.from('{"proof":true}\n')]]);
  const manifest = { files: [...documents].map(([path, raw]) => ({ path, sha256: sha(raw) }))
    .concat([{ path: optionalPath, sha256: "a".repeat(64) }]) };
  const canonical = { REQUIRED_INPUT_PATHS: [requiredPath], runtimeInputPathsFromManifest: () => [runtimePath],
    reviewedRegistrationProofPaths: packs => [packs[0].generatedFrom.reviewedExam_fixture.replace(/^archive\//, "")] };
  const makeInput = (overrides = new Map()) => ({ read(relative) {
    const raw = overrides.has(relative) ? overrides.get(relative) : documents.get(relative.replace(/^archive\//, ""));
    required(Buffer.isBuffer(raw), "SYNTHETIC_MISSING_CONSUMED_INPUT");return raw;
  } });
  const edit = fn => { const next = structuredClone(manifest);fn(next);return next; };
  let checks = 0;
  const check = fn => { fn();checks++; };
  check(() => { const result = authenticateConsumedCanonicalInputs(canonical, manifest, makeInput());
    assert.equal(result.consumedFiles, 3);assert.equal(result.unconsumedDeclaredFiles, 1);
    assert.equal(result.unconsumedResourcesClaimedVerified, false); });
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files = m.files.filter(x => x.path !== requiredPath)), makeInput()), /CURRENT_CONSUMED_MANIFEST_INPUT_MISSING/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files[0].sha256 = "b".repeat(64)), makeInput()), /CURRENT_MANIFEST_INPUT_DRIFT/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical, manifest,
    makeInput(new Map([["archive/" + requiredPath, null]]))), /SYNTHETIC_MISSING_CONSUMED_INPUT/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files.push(m.files[0])), makeInput()), /CURRENT_MANIFEST_DIGEST/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files[3].path = "../unrelated.json"), makeInput()), /UNSAFE_PATH/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files[3].sha256 = "invalid"), makeInput()), /CURRENT_MANIFEST_DIGEST/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs({ ...canonical,
    reviewedRegistrationProofPaths: () => ["../unrelated.json"] }, manifest, makeInput()), /UNSAFE_PATH/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical,
    edit(m => m.files = m.files.filter(x => x.path !== proofPath)), makeInput()), /CURRENT_CONSUMED_MANIFEST_INPUT_MISSING/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs(canonical, manifest,
    makeInput(new Map([["archive/" + proofPath, Buffer.from("tampered")]]))), /CURRENT_MANIFEST_INPUT_DRIFT/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs({ ...canonical,
    runtimeInputPathsFromManifest: () => null }, manifest, makeInput()), /CANONICAL_RUNTIME_PATHS/));
  check(() => assert.throws(() => authenticateConsumedCanonicalInputs({ ...canonical,
    reviewedRegistrationProofPaths: () => null }, manifest, makeInput()), /CANONICAL_REVIEWED_PROOF_PATHS/));
  return checks;
}
function reader(root, snapshot) {
  const observed = new Map();
  let lastAttempt = null;
  function read(relative) {
    lastAttempt = { path: relative };
    const bytes = fs.readFileSync(regular(root, relative));
    const pin = pins(bytes);
    required(treeEntry(root, snapshot, relative) === pin.gitBlobSha1, "HEAD_INPUT_DRIFT");
    const previous = observed.get(relative);
    required(!previous || equal(previous, pin), "INPUT_CHANGED_DURING_OBSERVATION");
    observed.set(relative, pin);
    lastAttempt = { path: relative, ...pin };
    return bytes;
  }
  function postcheck() {
    required(gitText(root, ["rev-parse", "HEAD"]) === snapshot, "HEAD_CHANGED");
    required(git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).length === 0, "WORKTREE_CHANGED");
    for (const [relative, expected] of observed)
      required(equal(pins(fs.readFileSync(regular(root, relative))), expected), "READ_INPUT_CHANGED");
    return { head: "UNCHANGED", worktree: "UNCHANGED", authenticatedReadFiles: observed.size,
      authenticatedReadFilesSha256: hashValue([...observed].sort(([a], [b]) => a.localeCompare(b, "en"))) };
  }
  return { read, json: relative => JSON.parse(read(relative).toString("utf8")), observed, postcheck,
    lastAttempt: () => lastAttempt };
}
function exactBytes(bytes, expected, label) {
  required(equal(pins(bytes), { bytes: expected.bytes, sha256: expected.sha256, gitBlobSha1: expected.gitBlobSha1 }), label);
}
function existingObject(root, oid, type) {
  try { return gitText(root, ["cat-file", "-t", oid]) === type; } catch { return false; }
}
function hydrateObjects(root, ids) {
  const missing = [...new Set(ids)].filter(oid => !existingObject(root, oid, "blob"));
  if (!missing.length) return 0;
  required(missing.every(oid => /^[a-f0-9]{40}$/.test(oid)), "OBJECT_ID");
  git(root, ["fetch", "--quiet", "--no-tags", "--no-write-fetch-head", "--filter=blob:none", "--stdin", "origin"],
    { input: missing.join("\n") + "\n", timeout: 600000 });
  required(missing.every(oid => existingObject(root, oid, "blob")), "IMMUTABLE_OBJECTS_MISSING");
  return missing.length;
}
function membership(root, allowHydration, progress = () => {}) {
  const ref = CONFIG.membership;
  progress({ kind: "MEMBERSHIP", commit: ref.commit, path: ref.path, gitBlobSha1: ref.gitBlobSha1 });
  let commitHydrated = false;
  if (!existingObject(root, ref.commit, "commit") && allowHydration) {
    git(root, ["fetch", "--quiet", "--no-tags", "--no-write-fetch-head", "--filter=blob:none", "origin", ref.commit],
      { timeout: 600000 });
    commitHydrated = true;
  }
  required(existingObject(root, ref.commit, "commit"), "MEMBERSHIP_COMMIT_MISSING");
  required(treeEntry(root, ref.commit, ref.path) === ref.gitBlobSha1, "MEMBERSHIP_COMMIT_PATH");
  const membershipObjects = allowHydration ? hydrateObjects(root, [ref.gitBlobSha1]) : 0;
  const bytes = git(root, ["cat-file", "blob", ref.gitBlobSha1]);
  exactBytes(bytes, ref, "MEMBERSHIP_RAW");
  const doc = JSON.parse(bytes.toString("utf8"));
  required(Array.isArray(doc.requests) && doc.requests.length === 160 &&
    Array.isArray(doc.sources) && Array.isArray(doc.records) && doc.records.length === 3330 &&
    equal(doc.columns, ["requestIndex", "questionUid", "sourceIndex", "sourceOrdinal", "stableApprovedAfterSha256"]),
  "MEMBERSHIP_DENOMINATOR");
  required(doc.sources.length === 160 && new Set(doc.sources).size === 160 &&
    doc.sources.every(s => /^original\/middle\/(?:m2\/(?:1mid|1final|2mid|2final)|m3\/(?:2mid|2final))\/[^/]+\.js$/.test(s)),
  "MEMBERSHIP_SOURCE_SCOPE");
  const requestObjects = allowHydration ? hydrateObjects(root, doc.requests.map(r => r.gitBlobSha1)) : 0;
  const records = [], uniqueUids = new Set(), uniqueJoins = new Set(), countByPr = {}, countByAxis = {};
  const requestRows = new Map();
  for (let i = 0; i < doc.requests.length; i++) {
    const ref = doc.requests[i];
    progress({ kind: "ORIGINAL_REQUEST", requestIndex: i, path: ref?.path, gitBlobSha1: ref?.gitBlobSha1 });
    required(ref && /^[a-f0-9]{40}$/.test(ref.gitBlobSha1) && /^[a-f0-9]{64}$/.test(ref.sha256) &&
      [2075, 2080, 2103].includes(ref.pr) && /^\.archive-meta-register\/inbox\/[^/]+\.json$/.test(ref.path),
    "ORIGINAL_REQUEST_REFERENCE");
    const raw = git(root, ["cat-file", "blob", ref.gitBlobSha1]);
    required(blob(raw) === ref.gitBlobSha1 && sha(raw) === ref.sha256, "ORIGINAL_REQUEST_RAW");
    const request = JSON.parse(raw.toString("utf8"));
    required(request.schemaVersion === ref.schemaVersion, "ORIGINAL_REQUEST_SCHEMA");
    let source, items, expectedSourceGit, axis;
    if (request.schemaVersion === "archive-difficulty5-register-request-v1") {
      required(ref.axis === "D5" && [2080, 2103].includes(ref.pr), "D5_REQUEST_AXIS");
      source = request.gemini?.sourceArchiveFile; expectedSourceGit = request.gemini?.latestBlobSha;
      const original = request.gemini?.items;
      required(Array.isArray(original) && original.length === ref.rowCount, "D5_REQUEST_ITEMS");
      if (request.reviewedCorrection) {
        const corrections = request.reviewedCorrection.rows;
        required(Array.isArray(corrections) && corrections.length === original.length, "D5_CORRECTION_DENOMINATOR");
        items = original.map(item => {
          const matches = corrections.filter(row => row.questionUid === item.questionUid && row.ordinal === item.ordinal);
          required(matches.length === 1 && matches[0].sourceArchiveFile === source, "D5_ORIGINAL_CORRECTION_JOIN");
          return { questionUid: item.questionUid, sourceOrdinal: item.ordinal, after: matches[0].after };
        });
      } else items = original.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.ordinal, after: item.after }));
      required(items.every(item => Object.keys(item.after || {}).every(k => D5.includes(k)) &&
        own(item.after, "difficultyBucket")), "D5_AFTER_FIELDS");
      axis = "D5";
    } else {
      required(request.schemaVersion === "archive-reviewed-exam-meta-register-request-v2" &&
        ref.axis === "ORIGINAL_FINAL_QA_FIELDS" && ref.pr === 2075 && request.approval?.type === "FINAL_QA" &&
        request.approval?.metadataReviewed === true, "FINAL_QA_ORIGINAL_REQUEST");
      source = request.sourceArchiveFile; expectedSourceGit = request.expectedSourceBlobSha1; items = request.items;
      axis = "ORIGINAL_FINAL_QA_FIELDS";
    }
    required(doc.sources.includes(source) && /^[a-f0-9]{40}$/.test(expectedSourceGit || "") &&
      Array.isArray(items) && items.length === ref.rowCount && new Set(items.map(row => row.questionUid)).size === items.length,
    "ORIGINAL_REQUEST_SCOPE");
    const byUid = new Map();
    for (const item of items) {
      required(item && /^qid_v1_[a-f0-9]{64}$/.test(item.questionUid) && Number.isSafeInteger(item.sourceOrdinal) &&
        item.sourceOrdinal > 0 && item.after && typeof item.after === "object" && !Array.isArray(item.after) &&
        Object.keys(item.after).length > 0 && Object.keys(item.after).every(k => /^[A-Za-z][A-Za-z0-9]{0,79}$/.test(k)),
      "ORIGINAL_REQUEST_ROW");
      byUid.set(item.questionUid, item);
    }
    requestRows.set(i, { ref, source, expectedSourceGit, axis, byUid });
  }
  for (const entry of doc.records) {
    required(Array.isArray(entry) && entry.length === 5, "MEMBERSHIP_ROW_SHAPE");
    const [requestIndex, uid, sourceIndex, ordinal, approvedHash] = entry;
    const group = requestRows.get(requestIndex), source = doc.sources[sourceIndex], item = group?.byUid.get(uid);
    required(Number.isSafeInteger(requestIndex) && Number.isSafeInteger(sourceIndex) && group && source &&
      group.source === source && item && item.sourceOrdinal === ordinal &&
      hashValue(item.after) === approvedHash && !uniqueUids.has(uid) && !uniqueJoins.has(source + "#" + ordinal),
    "MEMBERSHIP_REQUEST_BINDING");
    uniqueUids.add(uid); uniqueJoins.add(source + "#" + ordinal);
    countByPr[group.ref.pr] = (countByPr[group.ref.pr] || 0) + 1;
    countByAxis[group.axis] = (countByAxis[group.axis] || 0) + 1;
    records.push({ requestIndex, uid, sourceIndex, source, ordinal, approvedHash, after: item.after, axis: group.axis, pr: group.ref.pr });
  }
  required(equal(countByPr, CONFIG.expected.perPr) && countByAxis.D5 === 2866 &&
    countByAxis.ORIGINAL_FINAL_QA_FIELDS === 464, "MEMBERSHIP_COUNTS");
  for (const [i, group] of requestRows)
    required(records.filter(row => row.requestIndex === i).length === group.ref.rowCount, "REQUEST_ROW_COVERAGE");
  return { doc, records, requestRows, countByPr, countByAxis,
    hydration: { commitHydrated, membershipObjects, requestObjects, remoteRefWrites: 0, worktreeWrites: 0 } };
}
function multi(rows, key) {
  const map = new Map();
  for (const row of rows) { const k = key(row); const a = map.get(k) || []; a.push(row); map.set(k, a); }
  return map;
}
const one = (map, key) => { const a = map.get(key) || []; return a.length === 1 ? a[0] : null; };
function project(record, keys) {
  return Object.fromEntries(keys.map(k => [k, record && own(record, k) ? record[k] : null]));
}
function storedAudit(subject, metadataRows, identityRows) {
  const current = metadataRows.length === 1 ? metadataRows[0] : null;
  const identity = identityRows.length === 1 ? identityRows[0] : null;
  const findings = [];
  if (!current) findings.push("METADATA_UID_MISSING_OR_AMBIGUOUS");
  if (!identity) findings.push("IDENTITY_UID_MISSING_OR_AMBIGUOUS");
  for (const [name, row] of [["METADATA", current], ["IDENTITY", identity]])
    if (row && (row.questionUid !== subject.uid || row.sourceArchiveFile !== subject.source ||
      Number(row.sourceOrdinal) !== subject.ordinal)) findings.push(name + "_SOURCE_ORDINAL_MISMATCH");
  const keys = Object.keys(subject.after).sort();
  const actual = project(current, keys), changedFields = keys.filter(k => !current || !own(current, k) || !equal(current[k], subject.after[k]));
  if (changedFields.length) findings.push("ORIGINAL_APPROVED_FIELDS_CHANGED");
  return { current, identity, keys, findings, changedFields, actualProjectionSha256: hashValue(actual),
    retained: findings.length === 0 && hashValue(actual) === subject.approvedHash };
}
function pageAudit(subject, current, identity, resolved, page, sourcePin, runQuery) {
  const findings = [], mismatchFields = [], unexposedFields = [], nonQueryDifferences = [], queryRefs = [];
  if (!resolved) findings.push("RESOLVED_SOURCE_ORDINAL_MISSING_OR_AMBIGUOUS");
  if (!page) findings.push("PAGE_UID_MISSING_OR_AMBIGUOUS");
  if (resolved && (resolved.questionUid !== subject.uid || resolved.sourceFile !== subject.source ||
    Number(resolved.sourceOrdinal) !== subject.ordinal)) findings.push("RESOLVED_UID_JOIN");
  if (page && (page.uid !== subject.uid || page.sourceFile !== subject.source ||
    Number(page.sourceOrdinal) !== subject.ordinal)) findings.push("PAGE_UID_JOIN");
  if (!current || !identity || identity.sourceFingerprint !== current.sourceFingerprint)
    findings.push("STORED_IDENTITY_METADATA_FINGERPRINT_MISMATCH");
  const binding = resolved?.metaBinding;
  const registration = resolved?.reviewedExamRegistration;
  const registrationBound = Boolean(registration && registration.schemaVersion === "archive-reviewed-exam-registration-projection-v2" &&
    registration.sourceJsSha256 === sourcePin.sha256 && registration.metadataRevision === current?.metadataRevision &&
    resolved.assignmentEvidence?.reviewEvidence?.reference === registration.reference &&
    resolved.assignmentEvidence?.reviewEvidence?.sha256 === registration.sha256);
  if (!["exact", "content"].includes(binding) && !registrationBound) findings.push("CURRENT_STORED_SOURCE_BINDING_UNAVAILABLE");
  if (page?.currentSourceJsSha256 !== sourcePin.sha256) findings.push("PAGE_CURRENT_SOURCE_BYTES_MISMATCH");
  if (page?.directSelectable !== true) findings.push("PAGE_NOT_DIRECT_SELECTABLE");
  const combined = {};
  for (const [field, expected] of Object.entries(subject.after)) {
    const name = field === "curriculum" ? "curriculumKey" : field;
    // The official Consumer exposes native labels separately from the RPM page
    // labels. Require the resolved value and an actual page representation,
    // then query the key the page really exposes.
    if (["L1", "L2", "L3", "L4"].includes(name)) {
      if (!own(resolved, name) || !equal(resolved[name], expected)) { mismatchFields.push(field); continue; }
      const shownAs = [name, "native" + name].find(key => own(page, key) && equal(page[key], expected));
      if (!shownAs) mismatchFields.push(field);
      else if (expected !== null && expected !== undefined && expected !== "" && expected !== "UNKNOWN")
        combined[shownAs] = expected;
      continue;
    }
    const holder = [page, resolved, resolved?.assignmentEvidence].find(row => own(row, name));
    if (!holder) { unexposedFields.push(field); continue; }
    // Literal stored approval is checked above for every after-key. Display labels
    // and non-query semantic fields are observed separately; a page representation
    // difference is not a new judgment or an invented canonical-field equivalence.
    if (!QUERY_FIELDS.has(name)) {
      if (!equal(holder[name], expected)) nonQueryDifferences.push(field);
      continue;
    }
    if (!equal(holder[name], expected)) { mismatchFields.push(field); continue; }
    if (holder === page && QUERY_FIELDS.has(name) && expected !== null && expected !== undefined && expected !== "" &&
      expected !== "UNKNOWN" && (!Array.isArray(expected) || expected.length > 0)) combined[name] = expected;
  }
  if (subject.axis === "D5") {
    if (page?.difficultyBucket !== subject.after.difficultyBucket) mismatchFields.push("difficultyBucket");
    combined.difficultyBucket = subject.after.difficultyBucket;
  }
  if (mismatchFields.length) findings.push("PAGE_OR_RESOLVED_APPROVED_VALUE_MISMATCH");
  const direct = runQuery({});
  queryRefs.push(direct.index);
  if (!direct.uids.has(subject.uid)) findings.push("DIRECT_QUERY_UID_MISSING");
  for (const filters of [...Object.entries(combined).map(([key, value]) => ({ [key]: value })),
    ...(Object.keys(combined).length ? [combined] : [])]) {
    const result = runQuery(filters); queryRefs.push(result.index);
    if (!result.uids.has(subject.uid)) findings.push("APPROVED_FACET_QUERY_UID_MISSING");
  }
  return { findings: [...new Set(findings)], mismatchFields: [...new Set(mismatchFields)].sort(),
    unexposedFields: unexposedFields.sort(), nonQueryDifferences: nonQueryDifferences.sort(), queryRefs: [...new Set(queryRefs)],
    binding: enumValue(binding, ["exact", "content", "stale", "missing"]), registrationBound,
    directSelectable: page?.directSelectable === true, currentPageMatch: findings.length === 0 };
}
function provenance(snapshot, codeRoot) {
  required(process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REPOSITORY === CONFIG.repository &&
    process.env.GITHUB_EVENT_NAME === "push" && process.env.GITHUB_REF === CONFIG.ref &&
    /^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA || "") &&
    gitText(codeRoot, ["rev-parse", "HEAD"]) === process.env.GITHUB_SHA, "CLOSED_GITHUB_PUSH_REQUIRED");
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  required(event.after === process.env.GITHUB_SHA && event.ref === CONFIG.ref && event.deleted === false &&
    event.repository?.full_name === CONFIG.repository && event.repository.fork === false, "PUSH_PAYLOAD_REQUIRED");
  return { repository: CONFIG.repository, eventName: "push", ref: CONFIG.ref, codeSha: process.env.GITHUB_SHA,
    snapshot, runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT, job: process.env.GITHUB_JOB };
}
async function observe({ root, codeRoot, output, allowHydration = false }) {
  root = fs.realpathSync(path.resolve(root)); codeRoot = fs.realpathSync(path.resolve(codeRoot));
  output = path.resolve(output);
  required(root !== codeRoot && !output.startsWith(root + path.sep) && !output.startsWith(codeRoot + path.sep),
    "SEPARATE_READONLY_SNAPSHOT_AND_REPORT_REQUIRED");
  const snapshot = gitText(root, ["rev-parse", "HEAD"]), tree = gitText(root, ["rev-parse", "HEAD^{tree}"]);
  required(/^[a-f0-9]{40}$/.test(snapshot) && /^[a-f0-9]{40}$/.test(tree), "EXACT_SNAPSHOT");
  const report = { schemaVersion: CONFIG.schemaVersion, status: "INCOMPLETE", phase: "PROVENANCE",
    provenance: provenance(snapshot, codeRoot), membership: CONFIG.membership,
    reuse: { historicalConsumerAnchor: "96ded37d2d79768962e9f5075e7711cbfd249de5",
      missingPriorFingerprint: CONFIG.oldFingerprint, reusedPreviousConsumerResults: 0,
      currentQueriesRequiredForAllSelectedUids: 3330 },
    limits: { requestReplays: 0, registrationCalls: 0, nativeCalls: 0, applyCalls: 0, builderCalls: 0,
      sourceWrites: 0, metadataWrites: 0, identityWrites: 0, runtimeWrites: 0, newApprovals: 0,
      mathematicalReviews: 0, sourceQuestionEvaluation: 0, displayOrVisualReviews: 0,
      historicalRetainedValuesAreNotNewApproval: true, d5DoesNotApproveSemanticOrFourSlotMetadata: true,
      currentPageMatchMeans: "APPROVED_QUERY_FIELDS_AND_CURRENT_SOURCE_BINDING_ONLY",
      nonQueryFields: "LITERAL_STORED_VALUES_VERIFIED_SEPARATELY_DISPLAY_DIFFERENCES_REPORTED" } };
  let input, beforeCode;
  try {
    required(git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).length === 0, "SNAPSHOT_NOT_CLEAN");
    beforeCode = git(codeRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
    required(beforeCode.length === 0, "CODE_CHECKOUT_NOT_CLEAN");
    report.phase = "IMMUTABLE_ORIGINAL_MEMBERSHIP";
    const members = membership(root, allowHydration, value => { report.lastImmutableInput = value; });
    report.objectCacheHydration = members.hydration;
    input = reader(root, snapshot);
    for (const ref of CONFIG.exactReadApis) exactBytes(input.read(ref.path), ref, "OFFICIAL_READ_API_DRIFT");
    report.phase = "CURRENT_AUTHENTICATED_INPUTS";
    const metadata = input.json(MD), identities = input.json(ID), manifest = input.json(MANIFEST);
    required(Array.isArray(metadata.records) && Array.isArray(identities.records) &&
      Array.isArray(manifest.files) && manifest.files.length > 0 && manifest.files.length < 20000,
    "CURRENT_INPUT_SHAPE");
    // Match the exact resource boundary used by loadResolvedConsumerCatalog.
    // generatedFrom history can be declared in the manifest without being a
    // runtime consumer input. Every actually consumed resource is still read
    // from this HEAD, checked against its declared digest, and postchecked.
    input.read("archive/archive2-canonical.js");
    const canonicalApi = require(path.join(root, "archive/archive2-canonical.js"));
    report.canonicalConsumedInputs = authenticateConsumedCanonicalInputs(canonicalApi, manifest, input);
    const registryIndex = input.json(REGISTRY);
    for (const ref of [...registryIndex.canonicalSources || [], ...registryIndex.compiledArtifacts || []]) {
      const raw = input.read(ref.path), expected = String(ref.sha256 || "").replace(/^sha256:/, "");
      required(/^[a-f0-9]{64}$/.test(expected) &&
        sha(Buffer.from(raw.toString("utf8").replaceAll("\r\n", "\n"))) === expected, "ACTIVE_INPUT_DRIFT");
    }
    const generated = input.json(GENERATED);
    required(Array.isArray(generated.records), "GENERATED_INDEX_SHAPE");
    for (const relative of ["archive/archive2-canonical.js", "archive/problem-bank-meta.js",
      "archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs", AUTO]) input.read(relative);
    const generatedByUid = multi(generated.records, row => row.uid || row.questionUid);
    const consumerApi = await import(pathToFileURL(path.join(root, CONFIG.exactReadApis[0].path)).href);
    const sourceApi = await import(pathToFileURL(path.join(root, CONFIG.exactReadApis[1].path)).href);
    const activeApi = await import(pathToFileURL(path.join(root, CONFIG.exactReadApis[2].path)).href);
    const bindingApi = await import(pathToFileURL(path.join(root, AUTO)).href);
    required(typeof consumerApi.loadConsumer === "function" && typeof sourceApi.bindDifficulty5Source === "function" &&
      typeof activeApi.loadActiveMetaRegistry === "function" && typeof activeApi.validateActiveMetaFields === "function" &&
      typeof bindingApi.activeBindingContext === "function", "OFFICIAL_READ_APIS_REQUIRED");
    const registry = activeApi.loadActiveMetaRegistry(root);
    report.currentRegistry = { status: registry.status, registrySha: registry.registrySha,
      errorCount: registry.errors.length, errorCodes: [...new Set(registry.errors.map(value => String(value).split(":")[0]))] };
    required(registry.status === "ACTIVE" && registry.errors.length === 0, "ACTIVE_REGISTRY_UNAVAILABLE");
    report.phase = "OFFICIAL_CURRENT_CONSUMER";
    const consumer = consumerApi.loadConsumer(root);
    required(Array.isArray(consumer.catalog?.records) && Array.isArray(consumer.inventory) &&
      typeof consumer.ProblemBankMeta?.query === "function", "OFFICIAL_CONSUMER_SHAPE");
    const selectedUids = new Set(members.records.map(row => row.uid));
    const selectedSources = new Set(members.doc.sources);
    const mdRows = metadata.records.filter(row => selectedUids.has(row.questionUid) || selectedSources.has(row.sourceArchiveFile));
    const idRows = identities.records.filter(row => selectedUids.has(row.questionUid) || selectedSources.has(row.sourceArchiveFile));
    const mdByUid = multi(mdRows, row => row.questionUid), idByUid = multi(idRows, row => row.questionUid);
    const mdByJoin = multi(mdRows, row => row.sourceArchiveFile + "#" + Number(row.sourceOrdinal));
    const idByJoin = multi(idRows, row => row.sourceArchiveFile + "#" + Number(row.sourceOrdinal));
    const resolvedByJoin = multi(consumer.catalog.records, row => row.sourceFile + "#" + Number(row.sourceOrdinal));
    const pageByUid = multi(consumer.inventory, row => row.uid);
    const sourcePins = new Map(), sourceBindings = [];
    for (const [requestIndex, group] of members.requestRows) {
      const raw = input.read("archive/exams/" + group.source), current = pins(raw);
      sourcePins.set(group.source, current);
      const normalized = sourceApi.bindDifficulty5Source(raw, group.expectedSourceGit);
      const state = current.gitBlobSha1 === group.expectedSourceGit ? "EXACT" :
        group.axis === "D5" && normalized.sha === group.expectedSourceGit ? "CRLF_TO_LF_ONLY" : "WHOLE_BANK_CHANGED";
      sourceBindings.push({ requestIndex, sourceIndex: members.doc.sources.indexOf(group.source),
        originalGitBlobSha1: group.expectedSourceGit, current, state,
        changedBankIsNotOriginalApprovalReplay: true });
    }
    const sourceHashes = new Map(consumer.catalog.sourceHashes || []);
    const queryCache = new Map(), queryReports = [];
    const runQuery = filters => {
      const key = stable(filters);
      if (queryCache.has(key)) return queryCache.get(key);
      const rows = consumer.ProblemBankMeta.query(consumer.inventory, filters);
      required(Array.isArray(rows) && rows.every(row => typeof row.uid === "string") &&
        new Set(rows.map(row => row.uid)).size === rows.length, "OFFICIAL_QUERY_RESULT");
      const uids = new Set(rows.map(row => row.uid)), index = queryReports.length;
      queryReports.push({ index, fieldNames: Object.keys(filters).sort(), filtersSha256: sha(key),
        resultCount: rows.length, resultUidSetSha256: hashValue([...uids].sort()) });
      const result = { index, uids }; queryCache.set(key, result); return result;
    };
    const common = { snapshotTree: tree, canonicalManifest: input.observed.get(MANIFEST),
      activeRegistrySha: registry.registrySha, generatedIndex: input.observed.get(GENERATED),
      consumerCode: CONFIG.exactReadApis, completeTrackedCodeAndInputClosure: "EXACT_SNAPSHOT_TREE",
      fingerprintPolicy: "CONSERVATIVE_WHOLE_TREE_PLUS_SELECTED_EFFECTIVE_VALUES_NO_HISTORICAL_REUSE" };
    const commonSha256 = hashValue(common), outputRows = [], summary = { total: 0, retainedOriginalFields: 0,
      currentPageMatch: 0, fullyObservedCurrentBinding: 0, blockedOrChanged: 0, byAxis: {}, byPr: {}, findings: {} };
    report.phase = "SELECTED_3330_CURRENT_BINDING_AND_QUERY";
    for (const subject of members.records) {
      report.observationCursor = { requestIndex: subject.requestIndex, questionUid: subject.uid,
        sourceIndex: subject.sourceIndex, sourceOrdinal: subject.ordinal };
      const stored = storedAudit(subject, mdByUid.get(subject.uid) || [], idByUid.get(subject.uid) || []);
      const current = stored.current, identity = stored.identity;
      const approvalState = current ? {
        metadataApprovalType: enumValue(current.metadataApprovalType, ["FINAL_QA", "REVIEW2", "META_PIPELINE_AUDIT"]),
        tagStatus: enumValue(current.tagStatus, ["reviewed_pass", "FINAL", "DRAFT", "PENDING", "UNKNOWN"]),
        reviewStatus: enumValue(current.reviewStatus, ["reviewed_pass", "reviewed_fail", "pending", "unreviewed"]),
        defaultSelectable: current.defaultSelectable === true,
        metadataRevisionSha256: hashValue(current.metadataRevision), approvalEvidenceSha256: hashValue(current.approvalEvidence)
      } : null;
      const join = subject.source + "#" + subject.ordinal, findings = [...stored.findings];
      if ((mdByJoin.get(join) || []).length !== 1) findings.push("METADATA_SOURCE_ORDINAL_AMBIGUOUS");
      if ((idByJoin.get(join) || []).length !== 1) findings.push("IDENTITY_SOURCE_ORDINAL_AMBIGUOUS");
      const resolved = one(resolvedByJoin, join), page = one(pageByUid, subject.uid), sourcePin = sourcePins.get(subject.source);
      if (sourceHashes.get(subject.source) !== sourcePin.sha256) findings.push("CATALOG_CURRENT_SOURCE_BYTES_MISMATCH");
      const pageResult = pageAudit(subject, current, identity, resolved, page, sourcePin, runQuery);
      findings.push(...pageResult.findings);
      const runtimes = consumer.runtimeByUid.get(subject.uid) || [];
      let runtimeStatus = runtimes.length === 0 ? "ABSENT" : runtimes.length === 1 ? "PRESENT" : "AMBIGUOUS";
      let ownerStatus = "NOT_EVALUATED_D5";
      const runtimeMismatchFields = [];
      if (subject.axis === "ORIGINAL_FINAL_QA_FIELDS") {
        if (!storedFinalQaStatus(current))
          findings.push("STORED_FINAL_QA_STATUS_CHANGED");
        const runtime = runtimes.length === 1 ? runtimes[0] : null;
        if (!runtime || !current || runtime.questionUid !== subject.uid || runtime.sourceArchiveFile !== subject.source ||
          Number(runtime.sourceOrdinal) !== subject.ordinal || runtime.metadataRevision !== current.metadataRevision ||
          runtime.metaFoundationPackId !== current.metaFoundationPackId || runtime.metaFoundationStatus !== "ACTIVE")
          findings.push("CURRENT_FINAL_QA_RUNTIME_JOIN");
        if (runtime && current) {
          const classification = Object.fromEntries(["curriculum", "curriculumKey", "problemTypeKey", "templateKey",
            "standardCourse", "courseKey", "standardUnitKey", "subUnitKey", "sourceArchiveFile"].filter(k => own(current, k)).map(k => [k, current[k]]));
          const check = activeApi.validateActiveMetaFields(classification, registry, { requireFields: false });
          const context = bindingApi.activeBindingContext({ candidate: current, check, registry, runtimeOwner: runtime.metaFoundationPackId });
          ownerStatus = check.status === "VALIDATED" && check.activeBinding === true && !context.reason &&
            context.ownerPack === runtime.metaFoundationPackId ? "EXACT_ACTIVE_OWNER_BINDING" : "ACTIVE_OWNER_BINDING_REFUSED";
          if (ownerStatus !== "EXACT_ACTIVE_OWNER_BINDING") findings.push("ACTIVE_OWNER_BINDING_REFUSED");
          for (const field of stored.keys)
            if (!own(runtime, field) || !equal(runtime[field], subject.after[field])) runtimeMismatchFields.push(field);
          if (runtimeMismatchFields.length) findings.push("ORIGINAL_FINAL_QA_RUNTIME_VALUES_CHANGED");
        }
      } else {
        for (const row of runtimes) {
          if (row.sourceArchiveFile !== subject.source || Number(row.sourceOrdinal) !== subject.ordinal)
            findings.push("D5_RUNTIME_UID_JOIN");
          for (const field of stored.keys)
            if (own(row, field) && current && !equal(row[field], current[field])) runtimeMismatchFields.push(field);
        }
        if (runtimeMismatchFields.length) findings.push("D5_EXPOSED_RUNTIME_VALUES_CHANGED");
      }
      const uniqueFindings = [...new Set(findings)].sort();
      const mdHash = current ? hashValue(current) : null, idHash = identity ? hashValue(identity) : null,
        runtimeHash = hashValue(runtimes), resolvedHash = resolved ? hashValue(resolved) : null,
        pageHash = page ? hashValue(page) : null;
      const fingerprint = hashValue({ commonSha256, uid: subject.uid, source: sourcePin, metadata: mdHash,
        identity: idHash, runtime: runtimeHash, resolved: resolvedHash, page: pageHash,
        generatedForUid: hashValue(generatedByUid.get(subject.uid) || []),
        userDisabledUid: (generated.userDisabledUids || []).includes(subject.uid),
        queryResults: pageResult.queryRefs.map(i => queryReports[i]) });
      outputRows.push([subject.requestIndex, subject.uid, subject.sourceIndex, subject.ordinal,
        stored.retained, stored.actualProjectionSha256, mdHash, idHash, runtimeHash, resolvedHash, pageHash,
        fingerprint, stored.changedFields, runtimeStatus, [...new Set(runtimeMismatchFields)].sort(), ownerStatus,
        pageResult.binding, pageResult.registrationBound, pageResult.directSelectable, pageResult.currentPageMatch,
        pageResult.mismatchFields, pageResult.unexposedFields, pageResult.nonQueryDifferences, approvalState, pageResult.queryRefs, uniqueFindings]);
      summary.total++; if (stored.retained) summary.retainedOriginalFields++;
      if (pageResult.currentPageMatch) summary.currentPageMatch++;
      if (uniqueFindings.length === 0) summary.fullyObservedCurrentBinding++; else summary.blockedOrChanged++;
      for (const key of uniqueFindings) summary.findings[key] = (summary.findings[key] || 0) + 1;
      for (const [bucket, key] of [["byAxis", subject.axis], ["byPr", subject.pr]]) {
        const row = summary[bucket][key] ||= { total: 0, retainedOriginalFields: 0, currentPageMatch: 0, fullyObservedCurrentBinding: 0, blockedOrChanged: 0 };
        row.total++; if (stored.retained) row.retainedOriginalFields++; if (pageResult.currentPageMatch) row.currentPageMatch++;
        if (uniqueFindings.length === 0) row.fullyObservedCurrentBinding++; else row.blockedOrChanged++;
      }
    }
    required(summary.total === 3330 && summary.byAxis.D5.total === 2866 &&
      summary.byAxis.ORIGINAL_FINAL_QA_FIELDS.total === 464, "FINAL_DENOMINATOR");
    report.summary = summary;
    report.sources = members.doc.sources; report.requests = members.doc.requests;
    report.sourceBindings = sourceBindings; report.fingerprintCommonInputs = common; report.fingerprintCommonSha256 = commonSha256;
    report.columns = ["requestIndex", "questionUid", "sourceIndex", "sourceOrdinal", "storedApprovedFieldsRetained",
      "currentApprovedFieldProjectionSha256", "metadataWholeSha256", "identityWholeSha256", "runtimeRowsWholeSha256",
      "resolvedWholeSha256", "pageWholeSha256", "effectiveInputFingerprintSha256", "changedApprovedFields",
      "runtimePresence", "changedRuntimeFields", "activeOwnerBinding", "currentMetaBinding", "currentRegistrationSourceBound",
      "directSelectable", "currentPageMatch", "pageOrResolvedMismatches", "notConsumerExposedFields",
      "nonQueryRepresentationDifferences", "storedApprovalState", "actualQueryRefs", "findings"];
    report.records = outputRows; report.queries = queryReports;
    report.actualQueries = { uniqueApiCalls: queryReports.length, selectedUidObservations: 3330,
      queryCacheOnlyReusesSameCurrentInvocation: true, historicalQueryReuse: 0 };
    report.status = summary.blockedOrChanged ? "OBSERVED_CURRENT_BINDING_DEBT" : "CURRENT_STORED_AND_CONSUMER_BINDING_CONFIRMED";
    report.phase = "COMPLETE";
  } catch (error) {
    report.status = "OBSERVATION_FAILED";
    const message = String(error?.message || error);
    report.failure = { code: error.observerCode || "UNEXPECTED_OFFICIAL_READER_FAILURE",
      errorSha256: sha(String(error?.stack || error)), questionUid: /qid_v1_[a-f0-9]{64}/.exec(message)?.[0] || null,
      declaredPath: input ? [...input.observed.keys()].find(relative => message.includes(relative)) || null : null,
      lastAuthenticatedReadAttempt: input?.lastAttempt() || null };
  } finally {
    try {
      if (input) report.readonlyInputs = input.postcheck();
      else report.readonlyInputs = { authenticatedReadFiles: 0, postcheck: "NO_READER_CREATED" };
      required(gitText(codeRoot, ["rev-parse", "HEAD"]) === process.env.GITHUB_SHA, "CODE_HEAD_CHANGED");
      required(!beforeCode || git(codeRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).equals(beforeCode), "CODE_WORKTREE_CHANGED");
      required(gitText(root, ["rev-parse", "HEAD"]) === snapshot, "SNAPSHOT_HEAD_CHANGED");
      required(git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).length === 0, "SNAPSHOT_WORKTREE_CHANGED");
      report.codeAndSnapshotWorktrees = "UNCHANGED";
    } catch (error) {
      report.status = "OBSERVATION_FAILED";
      report.readonlyFailure = { code: error.observerCode || "POSTCHECK_ERROR", errorSha256: sha(String(error?.stack || error)) };
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const bytes = Buffer.from(JSON.stringify(report, null, 2) + "\n");
    required(bytes.length <= 16 * 1024 * 1024, "REPORT_LIMIT");
    fs.writeFileSync(output, bytes, { flag: "wx" });
    emit(bytes);
  }
  return report.status === "CURRENT_STORED_AND_CONSUMER_BINDING_CONFIRMED" ? 0 : 1;
}
function emit(bytes) {
  const payload = bytes.toString("base64"), chunkSize = 16384, count = Math.ceil(payload.length / chunkSize);
  console.log(JSON.stringify({ kind: "issued3330-begin", ...pins(bytes), encoding: "base64", chunkSize, chunks: count }));
  for (let index = 0; index < count; index++)
    console.log(JSON.stringify({ kind: "issued3330-chunk", index, data: payload.slice(index * chunkSize, (index + 1) * chunkSize) }));
  console.log(JSON.stringify({ kind: "issued3330-end", ...pins(bytes), chunks: count }));
}
function storedFinalQaStatus(current) {
  return current?.metadataApprovalType === "FINAL_QA" &&
    current?.reviewStatus === "reviewed_pass" && current?.tagStatus === "reviewed_pass";
}
function storedFinalQaProtocolChecks() {
  const stored = { metadataApprovalType: "FINAL_QA", reviewStatus: "reviewed_pass", tagStatus: "reviewed_pass" };
  assert.equal(storedFinalQaStatus(stored), true);
  assert.equal(storedFinalQaStatus({ ...stored, tagStatus: "FINAL" }), false);
  return 2;
}
function pageLabelProtocolChecks() {
  const uid = "qid_v1_" + "c".repeat(64), source = "original/middle/m3/2final/fixture.js";
  const value = "APPROVED_NATIVE_LABEL", sourcePin = { sha256: "e".repeat(64) };
  const subject = { uid, source, ordinal: 3, axis: "ORIGINAL_FINAL_QA_FIELDS", after: { L3: value } };
  const current = { sourceFingerprint: "f".repeat(64) }, identity = { sourceFingerprint: "f".repeat(64) };
  const resolved = { questionUid: uid, sourceFile: source, sourceOrdinal: 3, metaBinding: "exact", L3: value };
  const page = { uid, sourceFile: source, sourceOrdinal: 3, currentSourceJsSha256: sourcePin.sha256,
    directSelectable: true, L3: null, nativeL3: value };
  function audit(nextResolved, nextPage, refuseFiltered = false) {
    const queries = [];
    const result = pageAudit(subject, current, identity, nextResolved, nextPage, sourcePin, filters => {
      queries.push(filters);
      return { index: queries.length - 1,
        uids: new Set(refuseFiltered && Object.keys(filters).length ? [] : [uid]) };
    });
    return { result, queries };
  }
  let checks = 0;
  let observed = audit(resolved, page);
  assert.equal(observed.result.currentPageMatch, true);
  assert(observed.queries.some(filters => filters.nativeL3 === value));
  assert(!observed.queries.some(filters => own(filters, "L3"))); checks++;
  observed = audit(resolved, { ...page, L3: value, nativeL3: null });
  assert.equal(observed.result.currentPageMatch, true);
  assert(observed.queries.some(filters => filters.L3 === value));
  assert(!observed.queries.some(filters => own(filters, "nativeL3"))); checks++;
  observed = audit({ ...resolved, L3: "DIFFERENT_LABEL" }, page);
  assert.equal(observed.result.currentPageMatch, false);
  assert.deepEqual(observed.result.mismatchFields, ["L3"]); checks++;
  observed = audit(resolved, { ...page, nativeL3: "DIFFERENT_LABEL" });
  assert.equal(observed.result.currentPageMatch, false);
  assert.deepEqual(observed.result.mismatchFields, ["L3"]); checks++;
  const missing = { ...page }; delete missing.L3; delete missing.nativeL3;
  observed = audit(resolved, missing);
  assert.equal(observed.result.currentPageMatch, false);
  assert.deepEqual(observed.result.mismatchFields, ["L3"]); checks++;
  observed = audit(resolved, page, true);
  assert.equal(observed.result.currentPageMatch, false);
  assert(observed.result.findings.includes("APPROVED_FACET_QUERY_UID_MISSING")); checks++;
  return checks;
}
function selfTest() {
  const subject = { uid: "qid_v1_" + "a".repeat(64), source: "original/middle/m2/1mid/fixture.js",
    ordinal: 2, after: { difficultyBucket: 3, difficultyConfidence: "high" } };
  subject.approvedHash = hashValue(subject.after);
  const current = { questionUid: subject.uid, sourceArchiveFile: subject.source, sourceOrdinal: 2, ...subject.after };
  const identity = { questionUid: subject.uid, sourceArchiveFile: subject.source, sourceOrdinal: 2 };
  let checks = pageLabelProtocolChecks() + storedFinalQaProtocolChecks() + canonicalInputProtocolChecks();
  function check(f) { f(); checks++; }
  check(() => assert.equal(storedAudit(subject, [current], [identity]).retained, true));
  check(() => assert.equal(storedAudit(subject, [{ ...current, difficultyBucket: 4 }], [identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [{ ...current, difficultyConfidence: "low" }], [identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [], [identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [current, current], [identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [current], []).retained, false));
  check(() => assert.equal(storedAudit(subject, [current], [identity, identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [{ ...current, sourceOrdinal: 3 }], [identity]).retained, false));
  check(() => assert.equal(storedAudit(subject, [current], [{ ...identity, sourceArchiveFile: "other" }]).retained, false));
  check(() => assert.equal(storedAudit({ ...subject, approvedHash: "0".repeat(64) }, [current], [identity]).retained, false));
  check(() => assert.notEqual(hashValue({ a: null }), hashValue({})));
  check(() => assert.equal(hashValue({ a: 1, b: 2 }), hashValue({ b: 2, a: 1 })));
  for (const unsafe of ["/tmp/file", "../file", "a/../file", "a//file", "a\\file", "a\0b", "./file"])
    check(() => assert.throws(() => relativePath(unsafe), /UNSAFE_PATH/));
  check(() => assert.equal(canonicalInputPath("data/example.json"), "archive/data/example.json"));
  check(() => assert.equal(canonicalInputPath("../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"),
    "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"));
  for (const unsafe of ["../docs/other.json", "../../docs/rules.json", "data/../other.json"])
    check(() => assert.throws(() => canonicalInputPath(unsafe), /UNSAFE_PATH/));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "issued3330-protocol-"));
  try {
    fs.mkdirSync(path.join(dir, "a")); fs.writeFileSync(path.join(dir, "a", "file"), "exact bytes\n");
    check(() => assert.equal(regular(dir, "a/file"), path.join(dir, "a", "file")));
    fs.symlinkSync(path.join(dir, "a", "file"), path.join(dir, "link"));
    check(() => assert.throws(() => regular(dir, "link"), /NONREGULAR_INPUT/));
    fs.symlinkSync(path.join(dir, "a"), path.join(dir, "parent"));
    check(() => assert.throws(() => regular(dir, "parent/file"), /NONREGULAR_INPUT/));
    check(() => assert.throws(() => exactBytes(Buffer.from("tamper"), pins(Buffer.from("original")), "BYTE_DRIFT"), /BYTE_DRIFT/));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  console.log(JSON.stringify({ status: "PASS", protocolChecks: checks, actualConsumerQueries: 0,
    originalApprovalsEvaluated: 0, mathematicalReview: 0, meaning: "PURE_OBSERVER_PROTOCOL_TESTS_ONLY" }));
}
module.exports = { CONFIG, stable, hashValue, storedAudit, pageAudit, regular, relativePath, canonicalInputPath, observe, selfTest, pageLabelProtocolChecks, storedFinalQaStatus, storedFinalQaProtocolChecks, authenticateConsumedCanonicalInputs, canonicalInputProtocolChecks };
if (require.main === module) {
  if (process.argv.slice(2).length === 1 && process.argv[2] === "--self-test") selfTest();
  else {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--allow-git-object-hydration") options.allowHydration = true;
      else {
        required(["--root", "--code-root", "--output"].includes(args[i]) && typeof args[i + 1] === "string", "CLI_ARGUMENT");
        options[{ "--root": "root", "--code-root": "codeRoot", "--output": "output" }[args[i]]] = args[++i];
      }
    }
    required(options.root && options.codeRoot && options.output, "CLI_REQUIRED");
    observe(options).then(code => { process.exitCode = code; }).catch(error => {
      console.log(JSON.stringify({ status: "OBSERVER_BOOTSTRAP_FAILED", code: error.observerCode || "UNEXPECTED_BOOTSTRAP",
        errorSha256: sha(String(error?.stack || error)), actualConsumerPassClaim: false }));
      process.exitCode = 1;
    });
  }
}
