#!/usr/bin/env node
"use strict";
// Read-only current-main observation. No registration, build, compile, replay,
// prepare, approval or student rendering is invoked by this script.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const CONFIG = {
  "schemaVersion": "archive-e006-retained-issued-native-plan-probe-v1",
  "snapshot": "90ba4c2c3ce042b0bee4d68588ce83aa37e3f95f",
  "repository": "icefoxtail/AP------",
  "ref": "refs/heads/ops/middle-e006-retained-issued-probe-26fc-20261117",
  "exactInputs": [
    {
      "path": "archive/tools/meta-foundation/auto-register-merged-source.mjs",
      "bytes": 60529,
      "sha256": "dbcb5bc3b7e999793e7f9a321872ec58e0f50c0c2e2cf2cd63adaadbde6141f8",
      "gitBlobSha1": "dfc382f28643fd5fe9e2ca6a719beddd42fc0c55"
    },
    {
      "path": "archive/tools/meta-foundation/active-registry.mjs",
      "bytes": 13944,
      "sha256": "fb92f3db9c869183cf04415f9a1d678c60ba52a7ad1ec995beb57e77bdf402ed",
      "gitBlobSha1": "93ed7214a5e4dc0b0cdd9853d388bca26e64a172"
    },
    {
      "path": "archive/exams/original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js",
      "bytes": 64226,
      "sha256": "b0e801cecba43ad4cffd2009a1a5cb1a5e533330481bfd24e9401e0d7480470e",
      "gitBlobSha1": "a06c36b865b617f8c327cc90e1f4a931668a3e19"
    },
    {
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e006-residual-current410-r8-20261116.json",
      "bytes": 208512,
      "sha256": "73176562cdc8dd91b7025f23cd9d9595c5acbfa6470c3403876367b9f7068677",
      "gitBlobSha1": "253c5aeae229085d9bf6bb51942f114743981d44"
    }
  ],
  "cohorts": [
    {
      "requestId": "m3s2-e006-residual-current410-r8-20261116",
      "sourceArchiveFile": "original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js",
      "expectedQuestions": 23,
      "receiptPath": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e006-residual-current410-r8-20261116.json",
      "issuedSource": {
        "gitBlobSha1": "305e21cf2fb3155b46d3fa7937cde4e4c0e5de18",
        "sha256": "c2a0244074bd4257961b5facb672786361ae88526c6b35f55beb3b1c595d93fb"
      },
      "subjects": [
        {
          "questionUid": "qid_v1_1629824d0b99dd6df92f964bb2f7681caddfbfd33e01e5d02bf92163ea060cda",
          "sourceOrdinal": 1
        },
        {
          "questionUid": "qid_v1_7716a1d4f757041ef0f10c447e3c22d4d1bbeee9d6b01c1cdf531f6ec9fb9c1f",
          "sourceOrdinal": 2
        },
        {
          "questionUid": "qid_v1_8da9c6b955714eada8c0673e9faff6d6c1b994ccde93ed478c74b726314d5d32",
          "sourceOrdinal": 3
        },
        {
          "questionUid": "qid_v1_c2f698969ecc2c3a25f4a02f14dedfdac862634ee41cfc129fc818430ad3fb9c",
          "sourceOrdinal": 4
        },
        {
          "questionUid": "qid_v1_4b65c4d5f07e51a20f54254f3cb58c9896ffb5937c786ce253157270ef683c1a",
          "sourceOrdinal": 5
        },
        {
          "questionUid": "qid_v1_12860943ddaef3358660134a0d8d5007891be0a15104be47196a1797e9d5cc61",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_8c2f1c37ae92a5f8d9c4248d0b4488395355b22592f7956c514c7af797045a3e",
          "sourceOrdinal": 7
        },
        {
          "questionUid": "qid_v1_006d3d7fb3c9f11a0355c15b8df9cc7ec43e9de53da5b4e7d3171318ff7e23d3",
          "sourceOrdinal": 8
        },
        {
          "questionUid": "qid_v1_f02ca0c6d6f22a766861024269c0d890a68808e08b50949ab0ecc68d1d5268ed",
          "sourceOrdinal": 10
        },
        {
          "questionUid": "qid_v1_a2f1a03cd4f81c3ee3d3dcdff678cee5f47b574e3301c902048786b927e22e56",
          "sourceOrdinal": 11
        },
        {
          "questionUid": "qid_v1_ab1ed1af925a924cf90ec8f3e94c66f7ae52b07ac17faa277ab571c89c853c09",
          "sourceOrdinal": 21
        },
        {
          "questionUid": "qid_v1_8d53b4019a9c831c7abc15952c4eec1b1c5901130240eaf4119697527a595993",
          "sourceOrdinal": 22
        }
      ]
    }
  ]
};
const SHA1 = /^[a-f0-9]{40}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blob = value => crypto.createHash("sha1").update("blob " + value.length + "\0").update(value).digest("hex");
const pins = value => ({ bytes: value.length, sha256: sha(value), gitBlobSha1: blob(value) });
const errors = [];
const observationContext = { phase: "INITIAL", questionUid: null, sourceArchiveFile: null, inputPath: null };
function safeFailure(error) {
  return { context: { ...observationContext }, name: String(error?.name || "Error"), messageSha256: sha(String(error?.message || error)),
    code: typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code) ? error.code : null };
}
function relativePath(relative) {
  assert(typeof relative === "string" && relative && !path.isAbsolute(relative) &&
    !relative.includes("\\") && !/[\x00-\x1f]/.test(relative) &&
    relative.split("/").every(part => part && part !== "." && part !== ".."), "unsafe input path");
  return relative;
}
function regular(root, relative) {
  relativePath(relative);
  let full = root;
  const parts = relative.split("/");
  for (let i = 0; i < parts.length; i++) {
    full = path.join(full, parts[i]);
    const stat = fs.lstatSync(full);
    assert(!stat.isSymbolicLink(), "input symlink");
    assert(i + 1 === parts.length ? stat.isFile() : stat.isDirectory(), "input type");
  }
  return fs.readFileSync(full);
}
function unique(rows, key, label) {
  assert(Array.isArray(rows), label);
  const map = new Map();
  for (const row of rows) {
    const id = key(row);
    assert(id !== null && id !== undefined && !map.has(id), label);
    map.set(id, row);
  }
  return map;
}
function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}
function publicReason(value) {
  assert(typeof value === "string", "reason must be a string");
  return /^[A-Z][A-Z0-9_:-]*$/.test(value)
    ? { code: value, sha256: sha(value), representation: "DEFINED_REASON" }
    : { code: null, sha256: sha(value), representation: "UNRECOGNIZED_REASON_HASH_ONLY" };
}
function provenance() {
  assert.equal(process.env.GITHUB_ACTIONS, "true", "supported readonly GitHub execution required");
  assert.equal(process.env.GITHUB_REPOSITORY, CONFIG.repository);
  assert.equal(process.env.GITHUB_EVENT_NAME, "push");
  assert.equal(process.env.GITHUB_REF, CONFIG.ref);
  assert(SHA1.test(process.env.GITHUB_SHA || ""));
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  assert.equal(event.ref, CONFIG.ref);
  assert.equal(event.after, process.env.GITHUB_SHA);
  assert.equal(event.deleted, false);
  assert.equal(event.repository?.full_name, CONFIG.repository);
  assert.equal(event.repository?.fork, false);
  return { provider: "GITHUB_ACTIONS", eventName: "push", repository: CONFIG.repository,
    ref: CONFIG.ref, codeCommit: process.env.GITHUB_SHA, snapshotCommit: CONFIG.snapshot,
    runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT,
    job: process.env.GITHUB_JOB };
}
async function run(root) {
  root = fs.realpathSync(root);
  observationContext.phase = "PROVENANCE_AND_EXACT_SNAPSHOT";
  const execution = provenance(), beforeHead = git(root, "rev-parse", "HEAD").trim();
  assert.equal(beforeHead, CONFIG.snapshot, "probe must observe fixed actual main");
  const beforeStatus = git(root, "status", "--porcelain=v1", "--untracked-files=all");
  assert.equal(beforeStatus, "", "actual input checkout must be clean");
  const watched = new Map(), read = relative => {
    observationContext.inputPath = relativePath(relative);
    const bytes = regular(root, relative);
    if (!watched.has(relative)) watched.set(relative, pins(bytes));
    return bytes;
  };
  for (const expected of CONFIG.exactInputs) {
    const actual = read(expected.path);
    assert.deepEqual(pins(actual), { bytes: expected.bytes, sha256: expected.sha256, gitBlobSha1: expected.gitBlobSha1 },
      "fixed current code/source/receipt input");
    assert.equal(git(root, "rev-parse", beforeHead + ":" + expected.path).trim(), expected.gitBlobSha1,
      "exact snapshot path binding");
  }
  observationContext.phase = "ORIGINAL_MODULE_IMPORTS";
  // Imports come from the fixed actual-data checkout, never from the probe's
  // publication head or an inline replacement of a production function.
  const auto = await import(pathToFileURL(path.join(root,
    "archive/tools/meta-foundation/auto-register-merged-source.mjs")).href);
  const authority = await import(pathToFileURL(path.join(root,
    "archive/tools/meta-foundation/active-registry.mjs")).href);
  for (const name of ["loadBank", "sourcePath", "sourceFingerprint", "contentFingerprint",
    "nativeReviewReceipt", "activeBindingContext", "planQuestion"]) assert.equal(typeof auto[name], "function", name);
  const Core = require(path.join(root, "archive/archive2-core.js"));
  const runtimePaths = Core.Canonical.RUNTIME_INPUT_PATHS.map(relative => "archive/" + relative);
  assert(runtimePaths.length > 0 && new Set(runtimePaths).size === runtimePaths.length);
  observationContext.phase = "CURRENT_DATA_AND_ACTIVE_INPUTS";
  const metadataDocument = JSON.parse(read("archive/data/question_metadata.json"));
  const identities = JSON.parse(read("archive/data/question_identity_map.json"));
  const metadata = unique(metadataDocument.records, row => row.questionUid, "metadata UID uniqueness");
  const identityByUid = unique(identities.records, row => row.questionUid, "identity UID uniqueness");
  const join = (source, ordinal) => auto.sourcePath(source) + "#" + Number(ordinal);
  const identityByJoin = unique(identities.records, row => join(row.sourceArchiveFile, row.sourceOrdinal),
    "identity source/ordinal uniqueness");
  const runtime = new Map();
  for (const relative of runtimePaths) {
    const document = JSON.parse(read(relative));
    assert(Array.isArray(document.records));
    for (const row of document.records) {
      const entries = runtime.get(row.questionUid) || [];
      entries.push({ row, status: document.status, packId: document.packId, path: relative });
      runtime.set(row.questionUid, entries);
    }
  }
  const registry = authority.loadActiveMetaRegistry(root);
  assert.equal(registry.status, "ACTIVE", "current authority registry must be ACTIVE");
  assert.deepEqual(JSON.parse(read("archive/data/meta-foundation/canonical/registry_index.json")), registry.files.index);
  for (const ref of [...registry.files.index.canonicalSources, ...registry.files.index.compiledArtifacts]) {
    const bytes = read(ref.path);
    assert.equal(sha(Buffer.from(bytes.toString("utf8").replaceAll("\r\n", "\n"))), ref.sha256.replace(/^sha256:/, ""),
      "ACTIVE registry declared digest");
  }
  read("archive/data/master_tables/js_archive_tag_master.json");
  const subjects = CONFIG.cohorts.flatMap(cohort => cohort.subjects);
  assert.equal(subjects.length, 12);
  assert.equal(new Set(subjects.map(subject => subject.questionUid)).size, 12);
  const observations = [], sourceObservations = [];
  for (const cohort of CONFIG.cohorts) {
    observationContext.phase = "COHORT_SOURCE_AND_RECEIPT";
    observationContext.sourceArchiveFile = cohort.sourceArchiveFile;
    observationContext.questionUid = null;
    const source = auto.sourcePath(cohort.sourceArchiveFile), relative = "archive/exams/" + source;
    const bytes = read(relative), bank = auto.loadBank(bytes.toString("utf8"), relative);
    assert.equal(bank.length, cohort.expectedQuestions);
    const receiptBytes = read(cohort.receiptPath), receipt = JSON.parse(receiptBytes);
    assert.equal(receipt.requestId, cohort.requestId);
    assert.equal(receipt.schemaVersion, "archive-reviewed-exam-meta-registration-v2");
    assert.equal(receipt.metadataRegistrationStatus, "REGISTERED");
    assert.equal(receipt.approval?.type, "FINAL_QA");
    assert.equal(receipt.approval.metadataReviewed, true);
    assert.equal(receipt.sourceArchiveFile, source);
    assert.equal(receipt.expectedQuestionCount, bank.length);
    assert.equal(receipt.totalQuestions, cohort.subjects.length);
    assert.deepEqual(receipt.appliedRecords.map(row => ({ questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal }))
      .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal), cohort.subjects);
    // Existing direct approval inputs are read/hash-bound without a recursive
    // walk through global outputs, requests or unrelated review packets.
    for (const ref of receipt.approval.evidenceRefs) {
      assert(/^[a-f0-9]{64}$/.test(ref.sha256));
      assert.equal(sha(read(ref.path)), ref.sha256, "current issued evidence input");
    }
    const issued = {
      metadata: unique(receipt.appliedRecords, row => row.questionUid, "issued metadata"),
      identity: unique(receipt.appliedIdentityRecords, row => row.questionUid, "issued identity"),
      runtime: unique(receipt.runtimeRecords, row => row.questionUid, "issued runtime")
    };
    sourceObservations.push({ sourceArchiveFile: source, currentSource: pins(bytes),
      issuedSource: cohort.issuedSource, expectedQuestions: bank.length,
      changedFromIssuedSource: blob(bytes) !== receipt.sourceBlobSha1,
      issuedReceipt: { path: cohort.receiptPath, ...pins(receiptBytes) },
      declaredSourceReviewBinding: (receipt.outputDigests || []).some(ref =>
        ref.path === cohort.receiptPath.replace(/\.json$/, ".source-review-binding.json")) });
    for (const subject of cohort.subjects) {
      const uid = subject.questionUid, ordinal = subject.sourceOrdinal;
      observationContext.questionUid = uid;
      observationContext.phase = "CURRENT_ISSUED_WHOLE_ROWS";
      assert(UID.test(uid));
      const current = metadata.get(uid), identity = identityByUid.get(uid);
      const entries = runtime.get(uid) || [];
      assert.equal(entries.length, 1, "target runtime UID uniqueness");
      const owner = entries[0], row = owner.row, question = bank[ordinal - 1];
      assert(current && identity && question);
      assert.equal(owner.status, "ACTIVE");
      assert.equal(owner.packId, "MIDDLE_GEOMETRY");
      for (const value of [current, identity, row]) {
        assert.equal(value.questionUid, uid);
        assert.equal(value.sourceArchiveFile, source);
        assert.equal(value.sourceOrdinal, ordinal);
      }
      assert.deepEqual(identityByJoin.get(join(source, ordinal)), identity);
      assert.deepEqual(current, issued.metadata.get(uid), "current metadata whole must preserve issued approval");
      assert.deepEqual(identity, issued.identity.get(uid), "current identity whole must preserve issued approval");
      assert.deepEqual(row, issued.runtime.get(uid), "current runtime whole must preserve issued approval");
      const nativeSource = { root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: row,
        runtimeStatus: owner.status, identityMap: identities, identityByJoin };
      const input = { question, previous: question, current, identity, source, ordinal,
        registry, runtimeOwner: owner.packId, nativeSource };
      const before = sha(stable({ current, identity, runtime: row, question,
        previous: question, sourceBytes: sha(bytes) }));
      observationContext.phase = "CURRENT_ACTIVE_TARGET";
      const classification = Object.fromEntries(["problemTypeKey", "templateKey", "curriculum", "curriculumKey",
        "standardCourse", "standardUnitKey", "subUnitKey", "sourceArchiveFile"].map(key => [key, current[key]]));
      const check = authority.validateActiveMetaFields(classification, registry, { requireFields: false });
      assert.equal(check.status, "VALIDATED");
      assert.equal(check.activeBinding, true);
      const context = auto.activeBindingContext({ candidate: current, check, registry, runtimeOwner: owner.packId });
      assert(!context.reason && context.ownerPack === owner.packId);
      let nativeResult = null, nativeError = null, planned = null, planError = null;
      try {
        observationContext.phase = "ORIGINAL_NATIVE_RECEIPT";
        nativeResult = auto.nativeReviewReceipt({ ...input, pt: context.pt, tpl: context.tpl,
          ownerPack: context.ownerPack });
        assert(nativeResult === null || (typeof nativeResult === "string" &&
          /^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_-]+\.json$/.test(nativeResult)),
          "unexpected Native result shape");
      } catch (error) { nativeError = safeFailure(error); errors.push({ questionUid: uid, call: "nativeReviewReceipt", ...nativeError }); }
      try {
        observationContext.phase = "ORIGINAL_PLAN_QUESTION";
        planned = auto.planQuestion({ ...input, validate: authority.validateActiveMetaFields });
        assert(planned && typeof planned === "object");
        assert(["SUPPLEMENT_PENDING", "ALREADY_REGISTERED", "APPLY"].includes(planned.status), "unknown plan status");
        assert.equal(planned.questionUid, uid);
        assert.equal(planned.sourceArchiveFile, source);
        assert.equal(planned.sourceOrdinal, ordinal);
      } catch (error) { planError = safeFailure(error); errors.push({ questionUid: uid, call: "planQuestion", ...planError }); }
      assert.equal(sha(stable({ current, identity, runtime: row, question,
        previous: question, sourceBytes: sha(bytes) })), before, "production probes must not mutate input objects");
      const reasons = Array.isArray(planned?.reasons) ? planned.reasons.map(publicReason) : [];
      if (reasons.some(reason => reason.representation !== "DEFINED_REASON"))
        errors.push({ questionUid: uid, call: "planQuestion", code: "UNRECOGNIZED_REASON_REDACTED" });
      const final = planned?.final, finalPresent = Boolean(final && typeof final === "object");
      observations.push({ questionUid: uid, sourceArchiveFile: source, sourceOrdinal: ordinal,
        metadataWholeSha256: sha(stable(current)), identityWholeSha256: sha(stable(identity)),
        runtimeWholeSha256: sha(stable(row)), currentQuestionWholeSha256: sha(stable(question)),
        storedMetadataRevision: current.metadataRevision, storedApprovalType: current.metadataApprovalType,
        wholeIssuedRowsPreserved: true,
        sourceFingerprintMatchesCurrentQuestion: identity.sourceFingerprint === auto.sourceFingerprint(question),
        currentNative: { result: nativeResult, error: nativeError,
          interpretation: nativeResult === null ? "NO_CURRENT_NATIVE_REUSE" : "CURRENT_NATIVE_LOCATOR_ONLY" },
        currentPlan: planned ? {
          status: planned.status, action: planned.status, reasons, error: planError,
          keys: Object.keys(planned).sort(), finalPresent,
          finalWholeSha256: finalPresent ? sha(stable(final)) : null,
          finalEqualsCurrentWhole: finalPresent ? stable(final) === stable(current) : null,
          finalApprovalType: finalPresent ? final.metadataApprovalType ?? null : null,
          finalMetadataRevision: finalPresent ? final.metadataRevision ?? null : null,
          changedFields: Array.isArray(planned.changedFields) ? planned.changedFields.map(key => {
            assert(/^[A-Za-z][A-Za-z0-9]*$/.test(key), "unsafe changed field"); return key;
          }).sort() : [],
          preserveReview: typeof planned.preserveReview === "boolean" ? planned.preserveReview : null,
          coreChanged: typeof planned.coreChanged === "boolean" ? planned.coreChanged : null,
          sourceMetaChanged: typeof planned.sourceMetaChanged === "boolean" ? planned.sourceMetaChanged : null,
          applied: false, approvalGrantedByProbe: false
        } : { status: null, error: planError, applied: false, approvalGrantedByProbe: false }
      });
    }
  }
  observationContext.phase = "INPUT_UNCHANGED_VERIFICATION";
  observationContext.questionUid = null;
  assert.equal(observations.length, 12);
  for (const [relative, expected] of watched)
    assert.deepEqual(pins(regular(root, relative)), expected, "disk input changed: " + relative);
  assert.equal(git(root, "rev-parse", "HEAD").trim(), beforeHead);
  assert.equal(git(root, "status", "--porcelain=v1", "--untracked-files=all"), beforeStatus);
  return { schemaVersion: CONFIG.schemaVersion, status: errors.length ? "READONLY_OBSERVATION_ERROR" : "READONLY_OBSERVED",
    execution, currentStoredSnapshot: beforeHead, expectedSubjects: 12, completedSubjects: observations.length,
    codePins: CONFIG.exactInputs.filter(value => value.path.endsWith(".mjs")),
    sourceObservations, observations, errors,
    inputPins: [...watched].map(([relative, value]) => ({ path: relative, ...value })).sort((a, b) => a.path.localeCompare(b.path)),
    unchanged: { head: true, worktree: true, inputFiles: watched.size, issuedRows: 12 },
    limits: { officialPrepareRuns: 0, registrationCalls: 0, applyCalls: 0, sourceWrites: 0,
      metadataWrites: 0, identityWrites: 0, runtimeWrites: 0, approvalChanges: 0,
      mathematicalReview: 0, studentUiCaptures: 0, fullRuntimeTestRuns: 0,
      nativePlanResultIsNewApproval: false, fullSuitePassClaimed: false } };
}
function emit(report) {
  const raw = Buffer.from(JSON.stringify(report, null, 2) + "\n");
  assert(raw.length <= 512 * 1024, "bounded probe report");
  const encoded = raw.toString("base64"), width = 12000, total = Math.ceil(encoded.length / width);
  console.log("ARCHIVE_RETAINED_PROBE_BEGIN " + JSON.stringify({ schemaVersion: report.schemaVersion,
    bytes: raw.length, sha256: sha(raw), gitBlobSha1: blob(raw), chunks: total }));
  for (let i = 0; i < total; i++) console.log("ARCHIVE_RETAINED_PROBE_CHUNK " + (i + 1) + "/" + total + " " + encoded.slice(i * width, (i + 1) * width));
  console.log("ARCHIVE_RETAINED_PROBE_END " + sha(raw));
  return raw;
}
if (require.main === module) {
  const args = process.argv.slice(2);
  (async () => {
    assert(args.length === 4 && args[0] === "--root" && args[2] === "--output");
    const root = fs.realpathSync(args[1]), output = path.resolve(args[3]);
    assert(!output.startsWith(root + path.sep) && output !== root, "report must be outside actual checkout");
    let report;
    try { report = await run(root); }
    catch (error) { report = { schemaVersion: CONFIG.schemaVersion, status: "READONLY_INPUT_OR_CALL_FAILURE",
      fixedSnapshot: CONFIG.snapshot, error: safeFailure(error), newApprovals: 0, applyCalls: 0,
      productionWrites: 0, currentNativeReadyNotInferred: true }; process.exitCode = 1; }
    const raw = emit(report);
    fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, raw);
    if (report.status !== "READONLY_OBSERVED") process.exitCode = 1;
  })().catch(error => { console.error(JSON.stringify(safeFailure(error))); process.exitCode = 1; });
}
module.exports = { run };
