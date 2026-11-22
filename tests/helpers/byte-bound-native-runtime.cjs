const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const { sourceChangedSinceReview } = require("./source-changed-since-review.cjs");

// Prove an existing registration through the production Consumer assignment and
// its exact receipt, source, metadata, runtime and evidence bytes. This does not
// assert AutoMeta reuse: that producer additionally requires parity for every
// metadata field declared on the source, including fields this approval omitted.
async function createNativeRuntimeVerifier(root, canonicalCatalog) {
  const moduleAt = relative => import(pathToFileURL(path.join(root, relative)).href);
  const { loadBank, activeBindingContext, sourceFingerprint, contentFingerprint, sourcePath } =
    await moduleAt("archive/tools/meta-foundation/auto-register-merged-source.mjs");
  const { loadActiveMetaRegistry, validateActiveMetaFields } =
    await moduleAt("archive/tools/meta-foundation/active-registry.mjs");
  const { isUnambiguousLegacySourceUidAlias } =
    await moduleAt("archive/tools/intelligence/question-identity-contract.mjs");
  const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
  const metadataByUid = new Map(readJson("archive/data/question_metadata.json").records.map(row => [row.questionUid, row]));
  const identityMap = readJson("archive/data/question_identity_map.json");
  const identityByUid = new Map(identityMap.records.map(row => [row.questionUid, row]));
  const identityByJoin = new Map(identityMap.records.map(row => [`${sourcePath(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`, row]));
  const registry = loadActiveMetaRegistry(root);
  assert.equal(registry.status, "ACTIVE", registry.errors.join("|"));
  assert(canonicalCatalog?.canonicalAuthority, "current canonical Consumer authority required");
  const sources = new Map();
  const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
  const prefix = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";

  function inputFor(row, owner) {
    const current = metadataByUid.get(row.questionUid);
    assert(current, "runtime metadata missing: " + row.questionUid);
    const source = sourcePath(current.sourceArchiveFile);
    if (!sources.has(source)) {
      const relative = "archive/exams/" + source;
      const bytes = fs.readFileSync(path.join(root, relative));
      sources.set(source, {
        root, bytes, bank: loadBank(bytes.toString("utf8"), relative),
        blobSha1: execFileSync("git", ["hash-object", "--path", relative, "--stdin"],
          { cwd: root, input: bytes, encoding: "utf8" }).trim()
      });
    }
    const binding = sources.get(source);
    const ordinal = Number(current.sourceOrdinal);
    const question = binding.bank[ordinal - 1];
    assert(question, row.questionUid);
    return {
      question, previous: question, current, identity: identityByUid.get(row.questionUid),
      source, ordinal, registry, canonicalCatalog, runtimeOwner: owner.packId,
      nativeSource: { ...binding, identityMap, identityByJoin, runtimeRecord: row, runtimeStatus: owner.status }
    };
  }

  function assertInputStrict(input, label = input.current?.questionUid) {
    const { question, previous, current, identity, source, ordinal } = input;
    assert(current && identity, label);
    assert(["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType), label);
    assert.equal(identity.questionUid, current.questionUid, label);
    assert.equal(input.nativeSource.runtimeRecord.questionUid, current.questionUid, label);
    assert.equal(identity.sourceArchiveFile, source, label);
    assert.equal(current.sourceArchiveFile, source, label);
    assert.equal(Number(identity.sourceOrdinal), ordinal, label);
    assert.equal(Number(current.sourceOrdinal), ordinal, label);
    if (identity.status) assert.equal(identity.status, "VERIFIED", label);
    if (question.questionUid && question.questionUid !== identity.questionUid)
      assert(isUnambiguousLegacySourceUidAlias({ question, sourceArchiveFile: source, sourceOrdinal: ordinal,
        identityRecord: identity, identityMap: input.nativeSource.identityMap, bank: input.nativeSource.bank }), label);
    assert.equal(String(current.sourceQuestionNo), String(identity.sourceQuestionNo), label);
    assert.equal(String(input.nativeSource.runtimeRecord.sourceQuestionNo), String(question.sourceQuestionNo ?? question.id ?? ""), label);
    if (previous) assert.equal(String(previous.sourceQuestionNo ?? previous.id ?? ""), String(question.sourceQuestionNo ?? question.id ?? ""), label);
    assert.equal(identity.sourceFingerprint, sourceFingerprint(question), label);
    assert.equal(current.sourceFingerprint, sourceFingerprint(question), label);
    assert.equal(current.contentFingerprint, contentFingerprint(question), label);
    assert.notEqual(current.metadataStatus, "SOURCE_HOLD", label);

    // Classification authority is independent of optional source difficulty or
    // enum debt. The producer's stricter checks and the canonical release gate
    // remain in place; this helper only proves the existing approval.
    const fields = ["problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
      "standardUnitKey", "subUnitKey", "sourceArchiveFile"];
    const classification = Object.fromEntries(fields.map(key => [key, current[key]]));
    const check = validateActiveMetaFields(classification, input.registry, { requireFields: false });
    assert.equal(check.status, "VALIDATED", label + ": " + check.errors.join("|"));
    assert.equal(check.activeBinding, true, label);
    const context = activeBindingContext({ candidate: current, check, registry: input.registry, runtimeOwner: input.runtimeOwner });
    assert(!context.reason, label + ": " + context.reason);
    const { bytes, bank, blobSha1, runtimeRecord, runtimeStatus } = input.nativeSource;
    assert(Buffer.isBuffer(bytes) && Array.isArray(bank), label);
    assert.equal(stable(bank[ordinal - 1]), stable(question), label);
    assert.equal(runtimeStatus, "ACTIVE", label);
    assert.equal(current.metaFoundationStatus, "ACTIVE", label);
    assert.equal(current.metaFoundationPackId, context.ownerPack, label);
    assert.equal(current.L3, context.pt.canonicalLabelKo, label);
    assert.equal(current.L4, context.tpl.canonicalLabelKo, label);
    assert.equal(current.reviewStatus, "reviewed_pass", label);
    assert.equal(current.tagStatus, "reviewed_pass", label);
    assert(String(current.metadataStatus).startsWith("approved_"), label);
    const assignments = input.canonicalCatalog.canonicalAuthority.advancedAssignmentsByUid?.[current.questionUid] || [];
    assert.equal(assignments.length, 1, label + ": canonical native assignment missing/ambiguous");
    const assignment = assignments[0], proof = assignment.reviewEvidence;
    assert.equal(assignment.store, "meta_foundation_runtime", label);
    assert.equal(assignment.approvalStatus, "APPROVED", label);
    assert.equal(assignment.questionUid, current.questionUid, label);
    assert.equal(assignment.sourceFile, source, label);
    assert.equal(Number(assignment.sourceOrdinal), ordinal, label);
    assert.equal(assignment.assignmentFingerprint, current.contentFingerprint, label);
    assert.equal(assignment.packId, context.ownerPack, label);
    for (const key of ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey"])
      assert.equal(assignment[key], current[key], label);
    assert.equal(proof?.status, "PASS", label);
    assert.equal(proof.approvalType, current.metadataApprovalType, label);
    assert.equal(proof.reviewedSourceFingerprint, current.sourceFingerprint, label);
    const relative = "archive/" + proof.reference;
    assert(relative.startsWith(prefix) && relative.endsWith(".json"), label);
    assert(current.approvalEvidence.includes(relative), label);
    const boundRead = file => {
      assert(typeof file === "string" && !path.isAbsolute(file) && !file.includes("\\") &&
        !file.split("/").some(part => !part || part === "." || part === ".."), label);
      const base = fs.realpathSync(input.nativeSource.root);
      const full = fs.realpathSync(path.join(base, file));
      assert(full.startsWith(base + path.sep), label);
      return fs.readFileSync(full);
    };
    const receiptBytes = boundRead(relative);
    assert.equal(sha256(Buffer.from(receiptBytes.toString("utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"))), proof.sha256, label);
    const receipt = JSON.parse(receiptBytes);
    assert.equal(receipt.schemaVersion, "archive-reviewed-exam-meta-registration-v2", label);
    assert.equal(receipt.metadataRegistrationStatus, "REGISTERED", label);
    assert.equal(relative, prefix + receipt.requestId + ".json", label);
    assert(/^[a-f0-9]{64}$/.test(receipt.requestSha256), label);
    assert.equal(receipt.sourceArchiveFile, source, label);
    assert.equal(receipt.sourceRawSha256, sha256(bytes), label);
    assert.equal(receipt.sourceBlobSha1, blobSha1, label);
    assert.equal(blobSha1, crypto.createHash("sha1").update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest("hex"), label);
    assert.equal(receipt.approval.type, current.metadataApprovalType, label);
    assert.equal(receipt.approval.metadataReviewed, true, label);
    assert(String(receipt.approval.approvedBy || "").trim(), label);
    if (receipt.approval.type === "REVIEW2") assert.equal(receipt.approval.reviewPassCount, 2, label);
    assert(Array.isArray(receipt.approval.evidenceRefs) && receipt.approval.evidenceRefs.length, label);
    for (const ref of receipt.approval.evidenceRefs) {
      assert(/^[a-f0-9]{64}$/.test(ref.sha256), label);
      assert.equal(sha256(boundRead(ref.path)), ref.sha256, label + ": evidence bytes drifted");
    }
    assert.equal(receipt.totalQuestions, receipt.appliedRecords.length, label);
    assert.equal(new Set(receipt.appliedRecords.map(row => row.questionUid)).size, receipt.totalQuestions, label);
    assert.equal(new Set(receipt.appliedRecords.map(row => row.sourceOrdinal)).size, receipt.totalQuestions, label);
    if (receipt.scope === undefined) {
      assert.equal(receipt.totalQuestions, bank.length, label);
      assert(receipt.appliedRecords.every((row, index) => row.sourceArchiveFile === source && row.sourceOrdinal === index + 1), label);
    } else {
      assert.equal(receipt.scope, "PARTIAL_UIDS", label);
      assert.equal(receipt.expectedQuestionCount, bank.length, label);
      assert.equal(receipt.partialUidCount, receipt.totalQuestions, label);
      assert(receipt.appliedRecords.every(row => row.sourceArchiveFile === source && Number.isInteger(row.sourceOrdinal) &&
        row.sourceOrdinal > 0 && row.sourceOrdinal <= bank.length), label);
    }
    const accepted = receipt.appliedRecords.filter(row => row.questionUid === current.questionUid);
    assert.equal(accepted.length, 1, label);
    assert.deepEqual(accepted[0], current, label);
    const registeredRuntime = receipt.runtimeRecords.filter(row => row.questionUid === current.questionUid);
    assert.equal(registeredRuntime.length, 1, label);
    assert.deepEqual(registeredRuntime[0], runtimeRecord, label);
    assert.equal(current.metadataRevision,
      `meta-foundation:${context.ownerPack}@${current.metaFoundationPackVersion}:exam-${receipt.approval.type.toLowerCase()}-v2:${receipt.requestId}`, label);
    const registered = receipt.appliedIdentityRecords.filter(row => row.questionUid === identity.questionUid);
    assert.equal(registered.length, 1, label);
    assert.deepEqual(registered[0], identity, label);
    assert.equal(input.nativeSource.runtimeRecord.metadataApprovalType, current.metadataApprovalType, label);
    assert.deepEqual(input.nativeSource.runtimeRecord.fieldStatus, current.fieldStatus, label);
    return relative;
  }

  // 영수증 이후 원본 시험지가 정상 수정된 문항은 실패가 아니라 재등록 대기다({ stale: true }).
  // 영수증이 현재 원본과 같은데 어긋나는 것은 그대로 실패한다. 변조 음성 사례는 assertInputStrict를 쓴다.
  function classifyInput(input, label = input.current?.questionUid) {
    try { return { stale: false, relative: assertInputStrict(input, label) }; }
    catch (error) {
      if (error instanceof assert.AssertionError && sourceChangedSinceReview(input)) return { stale: true, relative: null };
      throw error;
    }
  }

  return { inputFor, assertInput: assertInputStrict, assertInputStrict, classifyInput,
    verify: (row, owner) => assertInputStrict(inputFor(row, owner)) };
}

module.exports = { createNativeRuntimeVerifier };
