(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports
    ? require("./archive2-core.js") : root.Archive2Core,
    typeof module === "object" && module.exports
      ? require("./problem-bank-meta.js") : root.ProblemBankMeta,
    typeof module === "object" && module.exports
      ? require("./exam-source-reader.js") : root.ExamSourceReader,
    typeof module === "object" && module.exports
      ? require("./archive2-error-detail.js") : root.Archive2ErrorDetail);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Source = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (core, problemBankMeta, examSourceReader, errorDetail) {
  "use strict";
  const cache = new Map();
  // restore()가 원본 시험지 파일을 동시에 받는 상한. 브라우저 연결 수를 넘기지 않으려는 값이다.
  const FETCH_CONCURRENCY = 6;
  // 어느 파일의 몇 번 문항에서 막혔는지를 오류에 실어 화면이 그대로 말하게 한다(archive2-error-detail.js). 메시지는 바꾸지 않는다.
  const mark = (error, detail) => (errorDetail ? errorDetail.annotate(error, detail) : error);
  const fail = (message, detail) => mark(new Error(message), detail);
  function evaluate(source, file) {
    // Source files are repository-owned executable assets, each with its own lexical scope.
    const scope = {};
    try {
      new Function(
        "window",
        "document",
        source + "\n//# sourceURL=" + encodeURI(file),
      )(scope, { baseURI: typeof document === "object" ? document.baseURI : "" });
    } catch (error) {
      throw mark(error, { file, code: "SOURCE_EVALUATE_FAILED" });
    }
    // 문항 배열 찾기 규칙은 exam-source-reader.js 한 곳에 있다(원본 엔진·로더·도구 공통).
    if (!examSourceReader)
      throw fail("exam-source-reader.js가 먼저 로드되어야 합니다: " + file, { file, code: "SOURCE_EVALUATE_FAILED" });
    const bank = examSourceReader.readQuestionArray(scope);
    if (!Array.isArray(bank))
      throw fail("문항 배열을 찾을 수 없습니다: " + file, { file, code: "SOURCE_BANK_MISSING" });
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
  async function generatedStudentPayloadSha256(question) {
    return "sha256:" + await digest(JSON.stringify({
      uid: question.uid,
      content: question.content,
      choices: question.choices,
      answer: question.answer,
      solution: question.solution,
      image: question.image,
    }));
  }
  async function restoreGeneratedChecked(indexRow, shard, disabledUids = []) {
    if (!problemBankMeta) throw new Error("PROBLEM_BANK_META_UNAVAILABLE");
    if (!problemBankMeta.isGeneratedSelectable(indexRow, disabledUids))
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
    const fingerprints = [consumerRecord.contentFingerprint, indexRow.contentFingerprint]
      .filter(value => typeof value === "string" && value.length > 0);
    if (new Set(fingerprints).size > 1)
      throw new Error("GENERATED_INDEX_SHARD_CONFLICT:contentFingerprint");
    const expectedFingerprint = fingerprints[0] || "";
    let contentFingerprintAlgorithm = "UNKNOWN_MISSING";
    let contentFingerprintStatus = "UNKNOWN";
    if (expectedFingerprint.startsWith("fnv1a64-utf16:")) {
      contentFingerprintAlgorithm = "FNV1A64_UTF16_STUDENT_FIELDS_V1";
      const actual = generatedContentFingerprint(question);
      if (actual !== expectedFingerprint) throw new Error("GENERATED_CONTENT_FINGERPRINT_MISMATCH");
      contentFingerprintStatus = "CONFIRMED";
    } else if (/^sha256:[a-f0-9]{64}$/i.test(expectedFingerprint)) {
      contentFingerprintAlgorithm = "SHA256_JSON_UID_STUDENT_FIELDS_IMAGE_V1";
      const actual = await generatedStudentPayloadSha256(question);
      if (actual.toLowerCase() !== expectedFingerprint.toLowerCase())
        throw new Error("GENERATED_CONTENT_FINGERPRINT_MISMATCH");
      contentFingerprintStatus = "CONFIRMED";
    } else if (expectedFingerprint) {
      // Historical prefixes with no registered producer contract stay explicit UNKNOWN.
      contentFingerprintAlgorithm = "UNKNOWN_UNSUPPORTED";
    }
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
    const metaProjection = problemBankMeta.projectGenerated(indexRow, consumerRecord, disabledUids);
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
      sourceFingerprint: contentFingerprintStatus === "CONFIRMED" ? expectedFingerprint : null,
      restoredContentFingerprint: expectedFingerprint ? null : generatedContentFingerprint(question),
      contentFingerprintAlgorithm,
      contentFingerprintStatus,
      metaProjection,
    };
  }
  // 유사 문항 복원 실패에도 어느 시험지의 몇 번 문항에서 만든 것인지 붙인다(코드형 문구는 상세에서 읽는다).
  async function restoreGenerated(indexRow, shard, disabledUids = []) {
    try {
      return await restoreGeneratedChecked(indexRow, shard, disabledUids);
    } catch (error) {
      throw mark(error, {
        file: indexRow?.sourceExamPath, questionNo: indexRow?.sourceQid, uid: indexRow?.uid,
        code: String(error?.message || "").split(":")[0].match(/^[A-Z][A-Z0-9_]{3,}$/)?.[0] || "GENERATED_RESTORE_FAILED",
      });
    }
  }
  async function load(file, sourceHash = "", options = {}) {
    if (!file || file.includes("..") || /^(?:[a-z]+:|\/)/i.test(file))
      throw fail("잘못된 source 경로", { file, code: "SOURCE_BAD_PATH" });
    options = options && typeof options === "object" ? options : {};
    const baseUrl = String(options.baseUrl || document.baseURI);
    const fetcher = typeof options.fetcher === "function" ? options.fetcher : (url) => fetch(url);
    const key = file + ":" + sourceHash + ":" + baseUrl;
    if (!cache.has(key))
      cache.set(
        key,
        (async () => {
          const url = new URL(
            "exams/" + file.split("/").map(encodeURIComponent).join("/"),
            baseUrl,
          );
          if (sourceHash) url.searchParams.set("v", sourceHash);
          const response = await fetcher(url.toString());
          if (!response.ok)
            throw fail(`원본 로드 실패 (${response.status}): ${file}`, { file, code: "SOURCE_FETCH_FAILED" });
          const source = await response.text();
          if (
            sourceHash &&
            (await digest(source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"))) !== sourceHash
          )
            throw fail(
              "원본 파일이 변경되었습니다. catalog를 새로고침하세요: " + file,
              { file, code: "SOURCE_CHANGED" },
            );
          return evaluate(source, file);
        })().catch((error) => {
          cache.delete(key);
          // 네트워크 끊김처럼 위에서 이름 붙이지 못한 실패도 어느 파일인지는 알려 준다.
          throw mark(error, { file, code: "SOURCE_FETCH_FAILED" });
        }),
      );
    return cache.get(key);
  }
  async function restore(records, catalog, options = {}) {
    options = options && typeof options === "object" ? options : {};
    const hashes = new Map(catalog.sourceHashes);
    const files = [...new Set(records.map((r) => r.sourceFile))];
    const banks = new Map();
    // 원본 파일은 최대 FETCH_CONCURRENCY개씩 동시에 받는다(파일 목록 순서대로 시작). 파일마다 하는 일(SHA 기대값 확인,
    // 받기·해시·평가, 오류에 파일·문항 번호 싣기)은 예전 직렬 반복과 같고, 실패는 직렬이었다면 처음 막혔을 파일(목록에서
    // 가장 앞선 실패)의 오류를 그대로 던진다. 한 파일이 실패하면 새 파일은 더 받지 않는다.
    const limit = Math.max(1, Math.min(FETCH_CONCURRENCY, Math.floor(Number(options.concurrency)) || FETCH_CONCURRENCY));
    const loadFile = async (file) => {
      const sourceHash = String(hashes.get(file) || "").trim();
      if (options.requireSourceHash && !/^[a-f0-9]{64}$/i.test(sourceHash))
        throw fail("문항 원본의 기대 SHA-256을 확인할 수 없습니다: " + file, { file, code: "SOURCE_HASH_MISSING" });
      try {
        return await load(file, sourceHash, options);
      } catch (error) {
        // 파일을 못 읽으면 이 파일에서 가져오려던 문항 번호도 함께 알려 준다.
        const wanted = records.filter((r) => r.sourceFile === file).map((r) => r.sourceQuestionNo ?? r.sourceOrdinal);
        throw mark(error, { file, questionNo: wanted.length === 1 ? wanted[0] : "", code: "SOURCE_FETCH_FAILED" });
      }
    };
    const outcomes = new Array(files.length);
    let nextIndex = 0;
    let failedAny = false;
    const worker = async () => {
      while (!failedAny && nextIndex < files.length) {
        const index = nextIndex++;
        try {
          outcomes[index] = { bank: await loadFile(files[index]) };
        } catch (error) {
          outcomes[index] = { error };
          failedAny = true;
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(limit, files.length) }, worker));
    for (let index = 0; index < files.length; index += 1) {
      const outcome = outcomes[index];
      if (!outcome) break; // 앞선 실패 때문에 시작하지 않은 파일
      if (outcome.error) throw outcome.error;
      banks.set(files[index], outcome.bank);
    }
    // 문항 하나가 막혀도 끝까지 확인해 막힌 문항을 모두 알린다(성공/실패 판정은 Promise.all과 같다: 하나라도 막히면 실패).
    const restoreAll = errorDetail ? errorDetail.allOrReport : (promises) => Promise.all(promises);
    return restoreAll(
      records.map((record) => restoreRecord(record).catch((error) => {
        throw mark(error, {
          file: record.sourceFile, questionNo: record.sourceQuestionNo, ordinal: record.sourceOrdinal, uid: record.questionUid,
        });
      })),
    );
    async function restoreRecord(record) {
        const question = banks.get(record.sourceFile)[record.sourceOrdinal - 1];
        if (!question) throw fail("문항의 source fingerprint가 일치하지 않습니다.", { code: "QUESTION_NOT_FOUND" });
        if ((await fingerprint(question)) !== record.sourceFingerprint)
          throw fail("문항의 source fingerprint가 일치하지 않습니다.", { code: "QUESTION_CONTENT_CHANGED" });
        if (
          "qid_v1_" +
            (await digest(record.sourceFile + "#" + record.sourceOrdinal)) !==
          record.questionUid
        )
          throw fail("문항 UID/source가 일치하지 않습니다.", { code: "QUESTION_UID_MISMATCH" });
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
          const sourceAsserts =
            question[field] !== undefined &&
            question[field] !== null &&
            String(question[field]).trim() !== "";
          // A conflict needs the catalog record to assert a non-empty value that
          // differs from the source. An empty/undefined record field (fallback or
          // unverified taxonomy) keeps the source value and is not a conflict.
          const recordAsserts =
            record[field] !== undefined &&
            record[field] !== null &&
            String(record[field]).trim() !== "";
          // metaFoundationPackVersion is revision provenance: when the catalog record
          // carries a different metadataRevision than the source JS, the catalog is a
          // newer re-certification and its pack version supersedes the stale source one.
          const supersededRevision =
            field === "metaFoundationPackVersion" &&
            String(record.metadataRevision ?? "").trim() !== "" &&
            String(record.metadataRevision) !== String(question.metadataRevision ?? "");
          if (
            sourceAsserts &&
            recordAsserts &&
            !supersededRevision &&
            JSON.stringify(question[field]) !== JSON.stringify(record[field]) &&
            !optionalFields.has(field) &&
            !metaV2Sidecar
          )
            throw fail("source metadata 충돌: " + field, {
              code: "SOURCE_META_CONFLICT",
              reason: "목록의 분류 정보(" + field + ")와 원본 파일의 분류 정보가 서로 다릅니다.",
            });
          if (sourceAsserts && !recordAsserts && !optionalFields.has(field) && !metaV2Sidecar) continue;
          if (record[field] !== undefined) result[field] = record[field];
          else if (optionalFields.has(field)) delete result[field];
        }
        return result;
    }
  }
  return { evaluate, digest, fingerprint, generatedContentFingerprint, load, restore, restoreGenerated, FETCH_CONCURRENCY };
});
