(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports
    ? require("./archive2-core.js") : root.Archive2Core,
    typeof module === "object" && module.exports
      ? require("./problem-bank-meta.js") : root.ProblemBankMeta);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Source = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (core, problemBankMeta) {
  "use strict";
  const cache = new Map();
  function evaluate(source, file) {
    // Source files are repository-owned executable assets, each with its own lexical scope.
    const scope = {};
    new Function(
      "window",
      "document",
      source + "\n//# sourceURL=" + encodeURI(file),
    )(scope, { baseURI: typeof document === "object" ? document.baseURI : "" });
    const bank = scope.questions || scope.questionBank;
    if (!Array.isArray(bank))
      throw new Error("문항 배열을 찾을 수 없습니다: " + file);
    return bank;
  }
  async function digest(value) {
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(value),
    );
    return Array.from(new Uint8Array(bytes), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
  }
  function fingerprint(question) {
    return digest(
      JSON.stringify({
        content: question.content ?? null,
        choices: Array.isArray(question.choices) ? question.choices : null,
        answer: question.answer ?? null,
        solution: question.solution ?? null,
        image: question.image ?? null,
      }),
    );
  }
  function generatedContentFingerprint(question) {
    const value = JSON.stringify({
      content: question.content,
      choices: question.choices,
      answer: question.answer,
      solution: question.solution,
    });
    let hash = 14695981039346656037n;
    for (let i = 0; i < value.length; i++)
      hash = BigInt.asUintN(64, (hash ^ BigInt(value.charCodeAt(i))) * 1099511628211n);
    return "fnv1a64-utf16:" + hash.toString(16).padStart(16, "0");
  }
  function restoreGenerated(indexRow, shard, excludedHoldUids = []) {
    if (!problemBankMeta) throw new Error("PROBLEM_BANK_META_UNAVAILABLE");
    if (!problemBankMeta.isGeneratedSelectable(indexRow, excludedHoldUids))
      throw new Error("GENERATED_QUESTION_NOT_SELECTABLE");
    if (!shard || shard.schemaVersion !== "ALIVE_GENERATED_CONSUMER_SHARD_V1" ||
        !Array.isArray(shard.records))
      throw new Error("GENERATED_CONSUMER_SHARD_SCHEMA_INVALID");
    if (indexRow.school && shard.school && indexRow.school !== shard.school)
      throw new Error("GENERATED_INDEX_SHARD_CONFLICT:school");
    const matches = shard.records.filter(row => row.generatedUid === indexRow.uid &&
      row.localOrdinal === indexRow.localOrdinal);
    if (matches.length !== 1 || matches[0].sourceKind !== "generated")
      throw new Error("GENERATED_UID_ORDINAL_NOT_UNIQUE");
    const consumerRecord = matches[0];
    const question = consumerRecord.question;
    if (!question || !Array.isArray(question.choices) || question.answer == null ||
        question.content == null || question.solution == null)
      throw new Error("GENERATED_QUESTION_PAYLOAD_INCOMPLETE");
    const fingerprint = generatedContentFingerprint(question);
    const expectedFingerprint = consumerRecord.contentFingerprint || indexRow.contentFingerprint || "";
    if ((consumerRecord.contentFingerprint && consumerRecord.contentFingerprint !== fingerprint) ||
        (indexRow.contentFingerprint && indexRow.contentFingerprint !== fingerprint))
      throw new Error("GENERATED_CONTENT_FINGERPRINT_MISMATCH");
    for (const field of ["sourceExamBlobSha", "sourceQid", "l2"]) {
      if (indexRow[field] != null && consumerRecord[field] != null &&
          indexRow[field] !== consumerRecord[field])
        throw new Error("GENERATED_INDEX_SHARD_CONFLICT:" + field);
    }
    for (const field of ["school", "year", "grade", "sourceExamPath", "sourceShardGitSha"]) {
      if (indexRow[field] != null && consumerRecord[field] != null &&
          indexRow[field] !== consumerRecord[field])
        throw new Error("GENERATED_INDEX_SHARD_CONFLICT:" + field);
    }
    if (question.uid != null && question.uid !== indexRow.uid)
      throw new Error("GENERATED_QUESTION_UID_CONFLICT");
    if (indexRow.reviewFinalArtifactSha && consumerRecord.reviewApprovalMainSha &&
        indexRow.reviewFinalArtifactSha !== consumerRecord.reviewApprovalMainSha)
      throw new Error("GENERATED_REVIEW_ARTIFACT_CONFLICT");
    const metaProjection = problemBankMeta.projectGenerated(indexRow, consumerRecord, excludedHoldUids);
    return {
      ...question,
      uid: indexRow.uid,
      questionUid: indexRow.uid,
      generatedUid: indexRow.uid,
      localOrdinal: indexRow.localOrdinal,
      sourceKind: "generated",
      sourceExamPath: indexRow.sourceExamPath || consumerRecord.sourceExamPath || "",
      sourceExamBlobSha: indexRow.sourceExamBlobSha || consumerRecord.sourceExamBlobSha || "",
      sourceQid: indexRow.sourceQid ?? consumerRecord.sourceQid ?? null,
      sourceShard: consumerRecord.sourceShard || "",
      sourceShardGitSha: consumerRecord.sourceShardGitSha || "",
      consumerShardGitSha: indexRow.consumerShardGitSha || "",
      sourceFingerprint: expectedFingerprint || null,
      restoredContentFingerprint: fingerprint,
      contentFingerprintStatus: expectedFingerprint ? "CONFIRMED" : "UNKNOWN",
      metaProjection,
    };
  }
  async function load(file, sourceHash = "") {
    if (!file || file.includes("..") || /^(?:[a-z]+:|\/)/i.test(file))
      throw new Error("잘못된 source 경로");
    const key = file + ":" + sourceHash;
    if (!cache.has(key))
      cache.set(
        key,
        (async () => {
          const url = new URL(
            "exams/" + file.split("/").map(encodeURIComponent).join("/"),
            document.baseURI,
          );
          if (sourceHash) url.searchParams.set("v", sourceHash);
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`원본 로드 실패 (${response.status}): ${file}`);
          const source = await response.text();
          if (
            sourceHash &&
            (await digest(source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"))) !== sourceHash
          )
            throw new Error(
              "원본 파일이 변경되었습니다. catalog를 새로고침하세요: " + file,
            );
          return evaluate(source, file);
        })().catch((error) => {
          cache.delete(key);
          throw error;
        }),
      );
    return cache.get(key);
  }
  async function restore(records, catalog) {
    const hashes = new Map(catalog.sourceHashes);
    const files = [...new Set(records.map((r) => r.sourceFile))];
    const banks = new Map();
    for (const file of files)
      banks.set(file, await load(file, hashes.get(file)));
    return Promise.all(
      records.map(async (record) => {
        const question = banks.get(record.sourceFile)[record.sourceOrdinal - 1];
        if (
          !question ||
          (await fingerprint(question)) !== record.sourceFingerprint
        )
          throw new Error("문항의 source fingerprint가 일치하지 않습니다.");
        if (
          "qid_v1_" +
            (await digest(record.sourceFile + "#" + record.sourceOrdinal)) !==
          record.questionUid
        )
          throw new Error("문항 UID/source가 일치하지 않습니다.");
        // Content, answer, solution and all visual/layout fields stay byte-value equivalent.
        const result = {
          ...question,
          questionUid: record.questionUid,
          sourceArchiveFile: record.sourceFile,
          sourceOrdinal: record.sourceOrdinal,
          _sourceFile: record.sourceFile,
          _sourceQuestionOrdinal: record.sourceOrdinal,
          _sourceQuestionNo: record.sourceQuestionNo,
          sourceQuestionNo: record.sourceQuestionNo,
          sourceFingerprint: record.sourceFingerprint,
          _qKey: record.questionUid,
          _sourceTitle: [record.year, record.school]
            .filter(Boolean)
            .join(" · "),
        };
        const optionalFields = new Set(core?.OPTIONAL_METADATA_FIELDS || ["L3", "L4", "secondaryConceptKeys", "problemTypeKey",
          "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket",
          "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "tagConfidence",
          "tagStatus", "reviewStatus", "metadataRevision", "defaultSelectable"]);
        const metaV2Sidecar = String(record.metadataRevision || "").startsWith(
          "meta-foundation:MIDDLE_RECERT_2026-09-30_META_V2:meta-review2-v1",
        );
        for (const field of core?.META_FIELDS || [
          "curriculumKey",
          "courseKey",
          "L1",
          "L2",
          "L3",
          "L4",
          "secondaryConceptKeys",
          "curriculumApplicability",
          "defaultSelectable",
          "difficultyBucket",
          "difficultyConfidence",
          "difficultyBoundaryFlag",
          "legacyLevelCompatibility",
          "tagConfidence",
          "tagStatus",
          "reviewStatus",
          "metadataRevision",
        ]) {
          if (
            question[field] !== undefined &&
            question[field] !== null &&
            String(question[field]).trim() !== "" &&
            JSON.stringify(question[field]) !== JSON.stringify(record[field]) &&
            !optionalFields.has(field) &&
            !metaV2Sidecar
          )
            throw new Error("source metadata 충돌: " + field);
          if (record[field] !== undefined) result[field] = record[field];
          else if (optionalFields.has(field)) delete result[field];
        }
        return result;
      }),
    );
  }
  return { evaluate, digest, fingerprint, generatedContentFingerprint, load, restore, restoreGenerated };
});
