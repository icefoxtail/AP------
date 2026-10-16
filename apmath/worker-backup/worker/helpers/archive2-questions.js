import { sha256hex } from "./admin-db.js";
import { canAccessStudentsBatch } from "./foundation-db.js";
import core from "../../../../archive/archive2-core.js";
import canonical from "../../../../archive/archive2-canonical.js";
import history from "../../../../archive/archive2-history.js";

export const ARCHIVE2_CONTRACT = "archive2-v1";
const UID = /^qid_v1_[a-f0-9]{64}$/;
const norm = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(/\\/g, "/")
    .replace(/^\/?(?:archive\/)?exams\//, "")
    .replace(/^\/+/, "")
    .trim();
function normalizeOptionalPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}
export function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
export function checkTargetClassGrade(classRow) {
  const grade = history.classGrade(classRow);
  if (!core.gradeRank(grade))
    fail(
      "반 학년을 확인할 수 없습니다. APMS의 반 학년 정보를 확인하세요.",
      409,
    );
  return grade;
}
// Apply target filters before LIMIT, using the same precedence and whitespace
// semantics as classGrade. All identifiers here are fixed, never request input.
export function targetClassGradeSql(columns) {
  const fields = ['grade', 'grade_label'].filter(field => columns.has(field));
  const explicit = fields.length
    ? `COALESCE(${fields.map(field => `NULLIF(c.${field}, '')`).concat("''").join(', ')})`
    : "''";
  const whitespace = [9, 10, 11, 12, 13, 32, 160, 5760,
    8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202,
    8232, 8233, 8239, 8287, 12288, 65279];
  const normalized = whitespace.reduce((sql, code) => `REPLACE(${sql}, char(${code}), '')`, explicit);
  const name = columns.has('name') ? "COALESCE(c.name, '')" : "''";
  const positions = history.grades.map(grade =>
    `CASE WHEN INSTR(${name}, '${grade}') > 0 THEN INSTR(${name}, '${grade}') ELSE LENGTH(${name}) + 1 END`);
  const fallback = `SUBSTR(${name}, MIN(${positions.join(', ')}), 2)`;
  const resolved = `COALESCE(NULLIF(${normalized}, ''), ${fallback}, '')`;
  const supported = history.grades.map(grade => `'${grade}'`).join(', ');
  return `CASE WHEN ${resolved} IN (${supported}) THEN ${resolved} ELSE '' END`;
}
export function checkTargetGrade(classRow, sourceGrade) {
  const grade = checkTargetClassGrade(classRow);
  if (core.gradeRank(sourceGrade) > core.gradeRank(grade))
    fail("대상 반보다 높은 학년의 source 문항은 기본 출제할 수 없습니다.", 409);
}
export function checkTargetGrades(classRow, sourceGrades) {
  if (!Array.isArray(sourceGrades) || !sourceGrades.length)
    fail("canonical source grade를 확인할 수 없습니다.", 409);
  const uniqueGrades = new Set();
  for (const value of sourceGrades) {
    const grade = String(value ?? "").trim();
    if (!core.gradeRank(grade))
      fail("canonical source grade를 확인할 수 없습니다.", 409);
    uniqueGrades.add(grade);
  }
  for (const grade of uniqueGrades) checkTargetGrade(classRow, grade);
}
export function uniqueIds(input, max = 200) {
  if (
    !Array.isArray(input) ||
    input.length > max ||
    input.some((v) => typeof v !== "string" || !v.trim() || v.length > 150)
  )
    fail("invalid student_ids");
  return [...new Set(input.map((v) => v.trim()))];
}
export async function requireStudentAccess(teacher, ids, env) {
  // Keep each query below D1's bind-parameter boundary; no per-student queries.
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    const allowed = await canAccessStudentsBatch(teacher, part, env);
    if (part.some((id) => !allowed.has(id))) fail("Forbidden", 403);
  }
}
export async function hasQuestionBridge(env) {
  const row = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='class_exam_assignment_questions'",
  ).first();
  return Boolean(row);
}
function requireProjectionVersion(input) {
  const version = String(input?.index_version || "").trim();
  if (!version || version.length > 2000) fail("current projection index_version required", 409);
  return version;
}
export async function loadCanonicalCatalog(env, expectedVersion = "") {
  const baseUrl = String(
    env.ARCHIVE_PUBLIC_BASE_URL ||
      "https://icefoxtail.github.io/AP------/archive",
  ).replace(/\/+$/, "") + "/";
  try {
    const versionBundle = await canonical.loadInputBundle(
      (url) => env.ARCHIVE2_ASSETS
        ? env.ARCHIVE2_ASSETS.fetch(url)
        : fetch(url),
      baseUrl,
      expectedVersion,
    );
    return canonical.resolveCatalog({ versionBundle });
  } catch (error) {
    const refreshRequired = error?.code === "CANONICAL_PROJECTION_REFRESH_REQUIRED";
    fail(
      error?.message || "승인된 canonical authority를 확인할 수 없습니다.",
      refreshRequired ? 409 : 503,
    );
  }
}
function canonicalAssetBaseUrl(env) {
  return String(
    env.ARCHIVE_PUBLIC_BASE_URL ||
      "https://icefoxtail.github.io/AP------/archive",
  ).replace(/\/+$/, "") + "/";
}
function canonicalAssetFetcher(env) {
  return (url) => env.ARCHIVE2_ASSETS ? env.ARCHIVE2_ASSETS.fetch(url) : fetch(url);
}
function failCanonicalLookup(error) {
  const refreshRequired = error?.code === "CANONICAL_PROJECTION_REFRESH_REQUIRED";
  fail(
    error?.message || "승인된 canonical authority를 확인할 수 없습니다.",
    refreshRequired ? 409 : 503,
  );
}
// Blueprint metadata capture may use the M65 index and only the selected
// source rows. Unlike validateNormalBlueprint's rolling compatibility path,
// this helper deliberately never falls back to the full catalog.
export async function loadBlueprintSourceVerification(env, sourceFile, expectedVersion = "") {
  try {
    return await canonical.loadSourceVerificationShard(
      canonicalAssetFetcher(env),
      canonicalAssetBaseUrl(env),
      expectedVersion,
      norm(sourceFile),
    );
  } catch (error) {
    failCanonicalLookup(error);
  }
}
export async function loadBlueprintMixedVerificationRecords(env, refs, expectedVersion = "") {
  try {
    return await canonical.loadMixedVerificationRecords(
      canonicalAssetFetcher(env),
      canonicalAssetBaseUrl(env),
      expectedVersion,
      refs,
    );
  } catch (error) {
    failCanonicalLookup(error);
  }
}
export async function loadBlueprintCanonicalMetadata(env, refs, expectedVersion = "") {
  const requested = (Array.isArray(refs) ? refs : []).map((ref, index) => ({
    ...ref,
    index: ref?.index ?? index,
    sourceFile: norm(ref?.sourceFile),
    sourceQuestionUid: String(ref?.sourceQuestionUid || "").trim(),
    sourceOrdinal: normalizeOptionalPositiveInteger(ref?.sourceOrdinal),
    sourceQuestionNo: ref?.sourceQuestionNo == null ? "" : String(ref.sourceQuestionNo),
  })).filter((ref) => ref.sourceFile);
  const byRefIndex = new Map();
  const identified = requested.filter((ref) =>
    UID.test(ref.sourceQuestionUid) && ref.sourceOrdinal,
  );
  if (identified.length) {
    const lookup = await loadBlueprintMixedVerificationRecords(
      env,
      identified.map((ref) => ({
        questionUid: ref.sourceQuestionUid,
        sourceFile: ref.sourceFile,
        sourceOrdinal: ref.sourceOrdinal,
      })),
      expectedVersion,
    );
    if (!lookup.legacyManifest) {
      const requestedByUid = new Map();
      for (const ref of identified) {
        if (!requestedByUid.has(ref.sourceQuestionUid)) requestedByUid.set(ref.sourceQuestionUid, []);
        requestedByUid.get(ref.sourceQuestionUid).push(ref);
      }
      for (const row of lookup.records || []) {
        const candidates = requestedByUid.get(String(row.questionUid || "")) || [],
          record = row.record;
        if (!record) continue;
        for (const ref of candidates) {
          if (norm(row.sourceFile) !== ref.sourceFile ||
              Number(row.sourceOrdinal) !== ref.sourceOrdinal ||
              String(record.questionUid || "") !== ref.sourceQuestionUid ||
              norm(record.sourceFile) !== ref.sourceFile ||
              Number(record.sourceOrdinal) !== ref.sourceOrdinal)
            continue;
          byRefIndex.set(ref.index, {
            record,
            projectionVersion: lookup.projectionVersion,
            identityStatus: record.identityStatus || "UNRESOLVED",
          });
        }
      }
    }
  }

  // The legacy original print view can post only source question numbers. A
  // single selected source shard can resolve a unique exact sourceQuestionNo;
  // this preserves common Meta without inventing a UID or ordinal.
  const unqualified = requested.filter((ref) =>
    !ref.sourceFile.startsWith("MIXED:") && !UID.test(ref.sourceQuestionUid) && ref.sourceQuestionNo,
  );
  const unqualifiedFiles = [...new Set(unqualified.map((ref) => ref.sourceFile))];
  if (unqualifiedFiles.length === 1) {
    const sourceFile = unqualifiedFiles[0];
    const bundle = await loadBlueprintSourceVerification(env, sourceFile, expectedVersion);
    if (!bundle.legacyManifest) {
      const matches = new Map();
      for (const record of bundle.shard.records || []) {
        const key = String(record.sourceQuestionNo ?? "");
        if (!key) continue;
        if (!matches.has(key)) matches.set(key, []);
        matches.get(key).push(record);
      }
      for (const ref of unqualified.filter((row) => row.sourceFile === sourceFile)) {
        const rows = matches.get(ref.sourceQuestionNo) || [],
          selected = ref.sourceOrdinal
            ? rows.filter((row) => Number(row.sourceOrdinal) === ref.sourceOrdinal)
            : rows;
        if (selected.length !== 1) continue;
        byRefIndex.set(ref.index, {
          record: selected[0],
          projectionVersion: bundle.projectionVersion,
          identityStatus: "UNRESOLVED",
        });
      }
    }
  }
  return byRefIndex;
}
function own(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key);
}
export async function buildBlueprintMetadataSnapshot(question, metadataAuthority, options = {}) {
  let priorSnapshot = options.priorSnapshot && typeof options.priorSnapshot === "object"
    ? options.priorSnapshot
    : null;
  if (!priorSnapshot && typeof options.priorSnapshot === "string") {
    try {
      const parsed = JSON.parse(options.priorSnapshot);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) priorSnapshot = parsed;
    } catch {}
  }
  const archiveMetadata = options.archiveMetadata && typeof options.archiveMetadata === "object"
    ? options.archiveMetadata
    : metadataAuthority && typeof metadataAuthority.buildArchiveQuestionMetadata === "function"
      ? metadataAuthority.buildArchiveQuestionMetadata(question || {})
      : null;
  const canonicalRecord = options.canonicalRecord && typeof options.canonicalRecord === "object"
    ? options.canonicalRecord
    : null;
  const canonicalMeta = {};
  if (canonicalRecord) {
    for (const field of core.META_FIELDS)
      if (own(canonicalRecord, field)) canonicalMeta[field] = canonicalRecord[field];
  }
  const preservePriorMeta = options.preservePriorMeta === true && Boolean(priorSnapshot);
  if (preservePriorMeta && priorSnapshot?.canonicalMeta && typeof priorSnapshot.canonicalMeta === "object")
    for (const field of core.META_FIELDS)
      if (own(priorSnapshot.canonicalMeta, field)) canonicalMeta[field] = priorSnapshot.canonicalMeta[field];
  const authoringMeta = {};
  for (const field of core.META_FIELDS)
    if (own(question, field)) authoringMeta[field] = question[field];
  const priorAuthoringMeta = preservePriorMeta && priorSnapshot?.authoringMeta && typeof priorSnapshot.authoringMeta === "object"
    ? priorSnapshot.authoringMeta
    : (preservePriorMeta
      ? Object.fromEntries(core.META_FIELDS.filter((field) => own(priorSnapshot, field))
          .map((field) => [field, priorSnapshot[field]]))
      : {});
  for (const field of core.META_FIELDS)
    if (!own(authoringMeta, field) && own(priorAuthoringMeta, field)) authoringMeta[field] = priorAuthoringMeta[field];
  const legacyDifficulty = preservePriorMeta && priorSnapshot?.legacyDifficulty && typeof priorSnapshot.legacyDifficulty === "object"
    ? { ...priorSnapshot.legacyDifficulty }
    : {};
  for (const field of ["level", "difficulty", "difficulty_bucket"])
    if (own(question, field)) legacyDifficulty[field] = question[field];
  if (!own(legacyDifficulty, "difficulty") && own(archiveMetadata, "difficulty"))
    legacyDifficulty.difficulty = archiveMetadata.difficulty;
  const sourceArchiveFile = String(
    options.sourceArchiveFile || question?.sourceArchiveFile || question?._sourceFile ||
      question?.sourceFile || question?.source_archive_file || "",
  ).trim() || null;
  const sourceQuestionUid = String(
    options.sourceQuestionUid || question?.questionUid || question?.source_question_uid || "",
  ).trim() || null;
  const sourceQuestionOrdinal = normalizeOptionalPositiveInteger(
    options.sourceQuestionOrdinal ?? question?.sourceOrdinal ?? question?._sourceQuestionOrdinal ??
      question?.source_question_ordinal,
  );
  const priorSourceIdentity = preservePriorMeta && priorSnapshot?.sourceIdentity && typeof priorSnapshot.sourceIdentity === "object"
    ? priorSnapshot.sourceIdentity
    : null;
  let identityStatus = String(options.sourceIdentityStatus || priorSourceIdentity?.status || "UNRESOLVED").trim().toUpperCase();
  if (!new Set(["VERIFIED", "LEGACY_INFERRED", "UNRESOLVED"]).has(identityStatus))
    identityStatus = "UNRESOLVED";
  const normalizedFile = norm(sourceArchiveFile || canonicalRecord?.sourceFile || "");
  const recordFile = norm(canonicalRecord?.sourceFile || "");
  const recordOrdinal = normalizeOptionalPositiveInteger(canonicalRecord?.sourceOrdinal);
  const recordUid = String(canonicalRecord?.questionUid || "").trim();
  const verifiedTuple = Boolean(
    canonicalRecord && recordFile && normalizedFile === recordFile &&
    sourceQuestionOrdinal && sourceQuestionOrdinal === recordOrdinal &&
    sourceQuestionUid && sourceQuestionUid === recordUid &&
    canonicalRecord.identityStatus === "VERIFIED",
  );
  if (identityStatus === "VERIFIED" && !verifiedTuple && !preservePriorMeta) identityStatus = "UNRESOLVED";
  let identityUid = verifiedTuple && identityStatus === "VERIFIED" ? recordUid : null;
  if (preservePriorMeta && identityStatus !== "UNRESOLVED" && sourceQuestionUid &&
      sourceQuestionUid === String(priorSourceIdentity?.sourceQuestionUid || ""))
    identityUid = sourceQuestionUid;
  if (
    !identityUid && identityStatus === "LEGACY_INFERRED" && sourceQuestionUid &&
    normalizedFile && sourceQuestionOrdinal &&
    sourceQuestionUid === "qid_v1_" + await sha256hex(`${normalizedFile}#${sourceQuestionOrdinal}`)
  ) identityUid = sourceQuestionUid;
  const fieldsCaptured = Object.keys(canonicalMeta);
  const missingCanonicalFields = core.META_FIELDS.filter((field) => !own(canonicalMeta, field));
  const authoredFidelity = String(options.authoredFidelity || "UNKNOWN").trim().toUpperCase();
  const captureStatus = options.captureStatus || (canonicalRecord ? "CAPTURED" : "PARTIAL");
  const envelope = {
    ...((canonicalRecord || (preservePriorMeta && Object.keys(canonicalMeta).length))
      ? canonicalMeta
      : authoringMeta),
    schemaVersion: "apms-blueprint-meta-snapshot-v1",
    snapshotScope: options.snapshotScope || (Object.keys(canonicalMeta).length
      ? "ARCHIVE_METADATA_V1_PLUS_AVAILABLE_ARCHIVE2_META_FIELDS"
      : "BLUEPRINT_FIELDS_ONLY"),
    captureStatus,
    captureSource: String(options.captureSource || (canonicalRecord ? "CANONICAL_SOURCE_VERIFICATION" : "BLUEPRINT_FIELDS")),
    archiveMetadataSource: String(options.archiveMetadataSource || (archiveMetadata
      ? (canonicalRecord ? "SOURCE_OR_BLUEPRINT_INPUT" : "BLUEPRINT_AUTHORING")
      : "NOT_CAPTURED")),
    authoredFidelity,
    sourceProjectionVersion: String(options.projectionVersion || (preservePriorMeta ? priorSnapshot?.sourceProjectionVersion : "") || "") || null,
    capturedAt: new Date().toISOString(),
    ...(preservePriorMeta ? {
      priorSnapshotCapturedAt: priorSnapshot?.capturedAt || null,
      priorSnapshotProjectionVersion: priorSnapshot?.sourceProjectionVersion || null,
    } : {}),
    sourceIdentity: {
      status: identityStatus,
      sourceArchiveFile,
      normalizedSourceFile: normalizedFile || null,
      sourceQuestionUid: identityUid,
      sourceQuestionOrdinal,
      sourceQuestionNo: options.sourceQuestionNo ?? question?.sourceQuestionNo ??
        question?._sourceQuestionNo ?? question?.source_question_no ?? question?.id ??
        (preservePriorMeta ? priorSourceIdentity?.sourceQuestionNo : null) ?? null,
      sourceFingerprint: verifiedTuple
        ? (canonicalRecord.sourceFingerprint || null)
        : (options.sourceFingerprint || question?.sourceFingerprint ||
          (preservePriorMeta ? priorSourceIdentity?.sourceFingerprint : null) || null),
    },
    archiveMetadata,
    canonicalMeta,
    authoringMeta,
    ...(Object.keys(legacyDifficulty).length ? { legacyDifficulty } : {}),
    capturedCanonicalFields: fieldsCaptured,
    unavailableCanonicalFields: missingCanonicalFields,
  };
  envelope.metadataContentHash = await sha256hex(JSON.stringify({
    sourceIdentity: envelope.sourceIdentity,
    archiveMetadata: envelope.archiveMetadata,
    canonicalMeta: envelope.canonicalMeta,
    authoringMeta: envelope.authoringMeta,
    legacyDifficulty: envelope.legacyDifficulty || {},
  }));
  envelope.snapshotHash = await sha256hex(JSON.stringify(envelope));
  return JSON.stringify(envelope);
}
export async function validateNormalBlueprint(env, questions, input) {
  const expectedVersion = requireProjectionVersion(input),
    file = norm(input.archive_file);
  let data;
  const sourceBundle = await loadBlueprintSourceVerification(env, file, expectedVersion);
  if (sourceBundle.legacyManifest) {
    data = await loadCanonicalCatalog(env, expectedVersion);
  } else {
    const records = sourceBundle.shard.records || [],
      identityByUid = Object.fromEntries(records
        .filter((row) => row.questionUid)
        .map((row) => [row.questionUid, {
          questionUid: row.questionUid,
          sourceArchiveFile: row.identitySourceFile || "",
          sourceOrdinal: Number(row.identitySourceOrdinal || 0),
          status: row.identityStatus || "UNRESOLVED",
        }]));
    data = {
      indexVersion: sourceBundle.projectionVersion,
      exams: [sourceBundle.shard.exam],
      records,
      sourceHashes: [[file, sourceBundle.shard.sourceSha256 || ""]],
      canonicalAuthority: {
        identityByUid,
        examGradeByFile: { [file]: sourceBundle.shard.exam.grade || "" },
      },
    };
  }
  const exam = data.exams.find((e) => e.file === file);
  if (
    !exam ||
    questions.length !== exam.qCount ||
    Number(input.question_count) !== exam.qCount
  )
    fail("원본 시험과 blueprint 문항 수가 일치하지 않습니다.", 409);
  const records = data.records
    .filter((r) => r.sourceFile === file)
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  for (let i = 0; i < records.length; i++) {
    const q = questions[i],
      record = records[i];
    if (
      record.identityStatus !== "VERIFIED" ||
      q.source_question_uid !== record.questionUid ||
      Number(q.source_question_ordinal) !== record.sourceOrdinal
    )
      fail("원본 blueprint의 canonical identity를 확인할 수 없습니다.", 409);
    const identity = data.canonicalAuthority.identityByUid[record.questionUid];
    const grade = canonical.resolveSourceGrade({
      registeredGrade: data.canonicalAuthority.examGradeByFile[file],
      sourceFile: file,
      identitySourceFile: identity?.sourceArchiveFile,
    });
    if (grade.status !== "VALID" || grade.grade !== record.sourceGrade)
      fail(grade.reason || grade.status || "SOURCE_GRADE_CONFLICT", 409);
    q.sourceFingerprint = record.sourceFingerprint;
    for (const field of core.META_FIELDS) delete q[field];
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
  }
  const url = new URL(
    "exams/" + file.split("/").map(encodeURIComponent).join("/"),
    String(
      env.ARCHIVE_PUBLIC_BASE_URL ||
        "https://icefoxtail.github.io/AP------/archive",
    ).replace(/\/$/, "") + "/",
  );
  const response = env.ARCHIVE2_ASSETS
    ? await env.ARCHIVE2_ASSETS.fetch(url)
    : await fetch(url);
  if (
    !response.ok ||
    (await sha256hex((await response.text()).replace(/\r\n/g, "\n"))) !==
      new Map(data.sourceHashes).get(file)
  )
    fail("원본 source 파일이 catalog와 일치하지 않습니다.", 409);
  return {
    grade: records[0]?.sourceGrade || "",
    canonicalAuthority: data.canonicalAuthority,
    projectionVersion: data.indexVersion || sourceBundle.projectionVersion || null,
  };
}
export async function validateApprovedMixedQuestions(
  env,
  questions,
  input,
) {
  const expectedVersion = requireProjectionVersion(input);
  const filters = input?.selection_filters;
  if (
    !filters ||
    typeof filters !== "object" ||
    Array.isArray(filters) ||
    typeof filters.grade !== "string" ||
    !filters.grade.trim() ||
    !Array.isArray(filters.primaryPaths) ||
    filters.primaryPaths.some(
      (path) => typeof path !== "string" || !path.trim(),
    ) ||
    (filters.primaryPaths.length === 0 &&
      (!Array.isArray(filters.sourceFiles) || filters.sourceFiles.length === 0 ||
        filters.sourceFiles.some((file) => typeof file !== "string" || !file.trim())))
  )
    fail("selection_filters required");
  let data;
  try {
    const lookup = await canonical.loadMixedVerificationRecords(
      (url) => env.ARCHIVE2_ASSETS ? env.ARCHIVE2_ASSETS.fetch(url) : fetch(url),
      String(
        env.ARCHIVE_PUBLIC_BASE_URL ||
          "https://icefoxtail.github.io/AP------/archive",
      ).replace(/\/+$/, "") + "/",
      expectedVersion,
      (questions || []).map((question) => ({
        questionUid: question?.questionUid,
        sourceFile: question?.sourceArchiveFile || question?._sourceFile || question?.sourceFile || question?.source_archive_file,
        sourceOrdinal: question?.sourceOrdinal ?? question?._sourceQuestionOrdinal ?? question?.source_question_ordinal,
      })),
    );
    if (lookup.legacyManifest) {
      data = await loadCanonicalCatalog(env, expectedVersion);
    } else {
      const authority = {
        ...lookup.authority,
        identityByUid: {},
        examGradeByFile: {},
        assignmentsByUid: {},
        advancedAssignmentsByUid: {},
        problemTypeKeys: new Set(lookup.authority?.problemTypeKeys || []),
        bindingKeys: new Set(lookup.authority?.bindingKeys || []),
      };
      const records = [];
      for (const row of lookup.records || []) {
        const uid = String(row.questionUid || ""),
          file = norm(row.sourceFile),
          record = row.record;
        if (
          !uid || !file || !record ||
          String(record.questionUid || "") !== uid ||
          norm(record.sourceFile) !== file ||
          Number(record.sourceOrdinal) !== Number(row.sourceOrdinal)
        )
          fail("canonical mixed record identity is invalid", 503);
        records.push(record);
        if (row.identity) authority.identityByUid[uid] = row.identity;
        authority.examGradeByFile[file] = String(row.registeredGrade || "");
        authority.assignmentsByUid[uid] = row.assignments;
        authority.advancedAssignmentsByUid[uid] = row.advancedAssignments;
      }
      data = {
        indexVersion: lookup.projectionVersion,
        records,
        canonicalAuthority: authority,
        projectionPolicy: authority.projectionPolicy,
      };
    }
  } catch (error) {
    const refreshRequired = error?.code === "CANONICAL_PROJECTION_REFRESH_REQUIRED";
    fail(
      error?.message || "승인된 canonical authority를 확인할 수 없습니다.",
      error?.status || (refreshRequired ? 409 : 503),
    );
  }
  const byUid = new Map(
    data.records.filter((r) => r.questionUid).map((r) => [r.questionUid, r]),
  );
  const sourceGrades = new Set();
  for (const q of questions || []) {
    const record = byUid.get(q.questionUid);
    const sourceFile = norm(
      q.sourceArchiveFile || q._sourceFile || q.sourceFile || q.source_archive_file,
    );
    const sourceOrdinal = Number(
      q.sourceOrdinal ?? q._sourceQuestionOrdinal ?? q.source_question_ordinal,
    );
    if (
      !record ||
      sourceFile !== record.sourceFile ||
      sourceOrdinal !== Number(record.sourceOrdinal) ||
      !core.generalUseEligibility(record).ok ||
      !core.matches(record, input.selection_filters, {
        useMode: "general",
        includeExtended: input.include_extended === true,
        catalog: data,
        canonicalAuthority: data.canonicalAuthority,
        projectionPolicy: data.projectionPolicy,
      })
    )
      fail("승인된 문항·출제 범위와 일치하지 않습니다.", 409);
    if (!core.gradeRank(record.sourceGrade))
      fail("canonical source grade를 확인할 수 없습니다.", 409);
    sourceGrades.add(record.sourceGrade);
    let assignmentFingerprint;
    try {
      assignmentFingerprint = await canonical.assignmentFingerprint(q);
    } catch {
      fail("문항 분류 fingerprint를 확인할 수 없습니다.", 409);
    }
    if (!record.assignmentFingerprint || assignmentFingerprint !== record.assignmentFingerprint)
      fail("승인된 분류 assignment fingerprint가 일치하지 않습니다.", 409);
    const fingerprint = await sha256hex(
      JSON.stringify({
        content: q.content ?? null,
        choices: Array.isArray(q.choices) ? q.choices : null,
        answer: q.answer ?? null,
        solution: q.solution ?? null,
        image: q.image ?? null,
      }),
    );
    if (
      fingerprint !== record.sourceFingerprint ||
      q.sourceFingerprint !== fingerprint
    )
      fail("문항 내용 fingerprint가 일치하지 않습니다.", 409);
    for (const field of core.META_FIELDS)
      if (
        q[field] !== undefined && record[field] !== undefined &&
        JSON.stringify(q[field]) !== JSON.stringify(record[field])
      )
        fail("canonical metadata parity mismatch: " + field, 409);
    for (const field of core.META_FIELDS) delete q[field];
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
  }
  return {
    ...data,
    sourceGrades: [...sourceGrades].sort((a, b) => core.gradeRank(a) - core.gradeRank(b)),
  };
}

export async function resolveSavedPaperSourceGrades(_env, questions) {
  if (!Array.isArray(questions) || !questions.length)
    fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
  const sourceGrades = new Set();
  for (const question of questions) {
    const uid = String(question?.questionUid || ""),
      sourceFile = norm(question?.sourceArchiveFile || question?.sourceFile || question?.source_archive_file),
      sourceOrdinal = Number(question?.sourceOrdinal ?? question?.source_question_ordinal);
    const identityEvidence = question?.sourceIdentityEvidence;
    if (
      !UID.test(uid) ||
      !sourceFile ||
      !Number.isInteger(sourceOrdinal) ||
      sourceOrdinal < 1
    )
      fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
    if (identityEvidence) {
      if (
        identityEvidence.schemaVersion !== "archive2-saved-source-identity-v1" ||
        identityEvidence.status !== "VERIFIED" ||
        identityEvidence.questionUid !== uid ||
        norm(identityEvidence.sourceFile) !== sourceFile ||
        norm(identityEvidence.identitySourceFile) !== sourceFile ||
        Number(identityEvidence.sourceOrdinal) !== sourceOrdinal ||
        String(identityEvidence.sourceGrade || "") !== String(question?.sourceGrade || "")
      ) fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
    } else if (uid !== "qid_v1_" + (await sha256hex(sourceFile + "#" + sourceOrdinal))) {
      fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
    }
    const grade = canonical.resolveSnapshotSourceGrade({
        preservedGrade: identityEvidence ? identityEvidence.sourceGrade : "",
        sourceFile,
        identitySourceFile: identityEvidence ? identityEvidence.identitySourceFile : sourceFile,
      });
    if (
      grade.status !== "VALID" ||
      !core.gradeRank(grade.grade)
    )
      fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
    if (!identityEvidence && question?.sourceGrade && String(question.sourceGrade) !== grade.grade)
      fail("저장한 시험지 source grade가 source identity와 일치하지 않습니다.", 409);
    sourceGrades.add(grade.grade);
  }
  return [...sourceGrades].sort((a, b) => core.gradeRank(a) - core.gradeRank(b));
}
// Original issue needs verified source bytes/ordinal identity, not automatic
// selection approval. All raw fields (including visual/layout fields) are hashed.
export async function validateOriginalSnapshot(env, payload, input) {
  const expectedVersion = requireProjectionVersion(input),
    file = norm(input.archive_file);
  let data;
  try {
    // Original issuance names one source file, so its rows can be checked from
    // the projection-bound shard. A valid pre-shard manifest keeps the existing
    // full resolver path for rolling compatibility.
    const sourceBundle = await canonical.loadSourceVerificationShard(
      (url) => env.ARCHIVE2_ASSETS ? env.ARCHIVE2_ASSETS.fetch(url) : fetch(url),
      String(
        env.ARCHIVE_PUBLIC_BASE_URL ||
          "https://icefoxtail.github.io/AP------/archive",
      ).replace(/\/+$/, "") + "/",
      expectedVersion,
      file,
    );
    if (sourceBundle.legacyManifest) {
      data = await loadCanonicalCatalog(env, expectedVersion);
    } else {
      const { shard } = sourceBundle;
      const identityByUid = Object.fromEntries(shard.records
        .filter((row) => row.questionUid)
        .map((row) => [row.questionUid, {
          questionUid: row.questionUid,
          sourceArchiveFile: row.identitySourceFile || "",
          sourceOrdinal: Number(row.identitySourceOrdinal || 0),
          status: row.identityStatus || "UNRESOLVED",
        }]));
      data = {
        exams: [shard.exam],
        records: shard.records,
        sourceHashes: [[file, shard.sourceSha256 || ""]],
        canonicalAuthority: {
          identityByUid,
          examGradeByFile: { [file]: shard.exam.grade || "" },
        },
      };
    }
  } catch (error) {
    const refreshRequired = error?.code === "CANONICAL_PROJECTION_REFRESH_REQUIRED";
    fail(
      error?.message || "승인된 canonical authority를 확인할 수 없습니다.",
      refreshRequired ? 409 : 503,
    );
  }
  const exam = data.exams.find((e) => e.file === file),
    raw = payload?.questions;
  if (
    !exam ||
    !Array.isArray(raw) ||
    raw.length !== exam.qCount ||
    Number(input.question_count) !== exam.qCount
  )
    fail("원본 시험의 문항 수가 일치하지 않습니다.", 409);
  const records = data.records
    .filter((r) => r.sourceFile === file)
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  if (records.length !== raw.length)
    fail("원본 문항 목록을 확인할 수 없습니다.", 409);
  const verified = await Promise.all(
    raw.map(async (q, i) => {
      const r = records[i];
      if (
        !r.rawQuestionHash ||
        (await sha256hex(JSON.stringify(q))) !== r.rawQuestionHash
      )
        fail(
          "원본 내용 또는 문항 순서가 변경되었습니다. 목록을 새로고침하세요.",
          409,
        );
      const identity = data.canonicalAuthority.identityByUid[r.questionUid];
      const grade = canonical.resolveSourceGrade({
        registeredGrade: data.canonicalAuthority.examGradeByFile[file],
        sourceFile: file,
        identitySourceFile: identity?.sourceArchiveFile,
      });
      if (grade.status !== "VALID" || grade.grade !== r.sourceGrade)
        fail(grade.reason || grade.status || "SOURCE_GRADE_CONFLICT", 409);
      const result = {
        ...q,
        questionUid: r.identityStatus === "VERIFIED" ? r.questionUid : null,
        sourceArchiveFile: file,
        sourceOrdinal: i + 1,
        sourceQuestionNo: r.sourceQuestionNo,
        sourceFingerprint: r.sourceFingerprint,
      };
      for (const field of core.META_FIELDS) {
        delete result[field];
        if (r[field] !== undefined) result[field] = r[field];
      }
      return result;
    }),
  );
  return { questions: verified, exam, canonicalAuthority: data.canonicalAuthority };
}
export async function buildQuestionSnapshot(
  assignment,
  questions,
  meta = {},
  options = {},
) {
  if (
    !Array.isArray(questions) ||
    questions.length < 1 ||
    questions.length > 400
  )
    fail("1~400 questions required");
  if (Number(assignment.question_count) !== questions.length)
    fail("question_count/payload parity mismatch");
  const seen = new Set(),
    rows = [];
  for (const [i, q] of questions.entries()) {
    const file = norm(
      q.sourceArchiveFile ||
        q._sourceFile ||
        q.sourceFile ||
        q.source_archive_file,
    );
    const ordinal = Number(
      q.sourceOrdinal ?? q._sourceQuestionOrdinal ?? q.source_question_ordinal,
    );
    const uid = String(q.questionUid || q.source_question_uid || "");
    let status = "UNRESOLVED";
    const identity = options.canonicalAuthority?.identityByUid?.[uid];
    if (options.canonicalAuthority) {
      if (
        file && !file.includes("..") && !/^[a-z]+:/i.test(file) &&
        Number.isInteger(ordinal) && ordinal > 0 && UID.test(uid) &&
        identity?.status === "VERIFIED" && norm(identity.sourceArchiveFile) === file &&
        Number(identity.sourceOrdinal) === ordinal && !seen.has(uid)
      ) status = "VERIFIED";
    } else if (
      file && !file.includes("..") && !/^[a-z]+:/i.test(file) &&
      Number.isInteger(ordinal) && ordinal > 0 && UID.test(uid) &&
      uid === "qid_v1_" + (await sha256hex(file + "#" + ordinal)) && !seen.has(uid)
    ) status = "VERIFIED";
    if (status === "UNRESOLVED" && !options.legacy)
      fail("canonical UID/source ordinal mismatch at " + (i + 1));
    if (status === "VERIFIED") seen.add(uid);
    const metadataAuthority = options.metadataAuthority;
    const archiveMetadata = metadataAuthority && typeof metadataAuthority.buildArchiveQuestionMetadata === "function"
      ? metadataAuthority.buildArchiveQuestionMetadata(q)
      : null;
    const metadataRevision = archiveMetadata?.metadataRevision || q.metadataRevision || null;
    const metadataHash = archiveMetadata && typeof metadataAuthority.buildArchiveMetadataHash === "function"
      ? await metadataAuthority.buildArchiveMetadataHash(archiveMetadata)
      : null;
    const snapshot = {};
    for (const field of core.META_FIELDS)
      if (q[field] !== undefined) snapshot[field] = q[field];
    if (archiveMetadata) snapshot.archiveMetadata = archiveMetadata;
    const canonicalRecord = options.canonicalAuthority
      ? {
          ...q,
          questionUid: uid,
          sourceFile: file,
          sourceOrdinal: ordinal,
          identityStatus: status,
          sourceFingerprint: q.sourceFingerprint || null,
        }
      : null;
    const metadataSnapshotJson = await buildBlueprintMetadataSnapshot(
      q,
      metadataAuthority,
      {
        canonicalRecord,
        sourceIdentityStatus: status,
        sourceArchiveFile: q.sourceArchiveFile || q.source_archive_file || file,
        sourceQuestionUid: uid || null,
        sourceQuestionOrdinal: ordinal,
        sourceQuestionNo: q.sourceQuestionNo ?? q._sourceQuestionNo ?? q.source_question_no ?? q.id ?? null,
        sourceFingerprint: q.sourceFingerprint || null,
        projectionVersion: options.projectionVersion,
        captureSource: options.canonicalAuthority
          ? "CANONICAL_PROJECTION_AT_ASSIGNMENT"
          : "BLUEPRINT_FIELDS_AT_ASSIGNMENT",
        authoredFidelity: options.canonicalAuthority ? "CANONICAL_CAPTURE" : "UNKNOWN",
        captureStatus: options.canonicalAuthority ? "CAPTURED" : "PARTIAL",
      },
    );
    rows.push({
      order_no: i + 1,
      question_uid: status === "VERIFIED" ? uid : null,
      source_archive_file: file || null,
      source_question_no: String(
        q.sourceQuestionNo ??
          q._sourceQuestionNo ??
          q.source_question_no ??
          q.id ??
          "",
      ),
      source_question_ordinal:
        Number.isInteger(ordinal) && ordinal > 0 ? ordinal : null,
      source_fingerprint: q.sourceFingerprint || null,
      standard_unit_key: q.standardUnitKey || q.standard_unit_key || null,
      difficulty_at_assignment: Number.isInteger(q.difficultyBucket)
        ? String(q.difficultyBucket)
        : "UNKNOWN",
      metadata_revision: metadataRevision,
      metadata_hash: metadataHash,
      metadata_json: metadataSnapshotJson || JSON.stringify(snapshot),
      resolution_status: status,
    });
  }
  if (
    !options.legacy &&
    (!Array.isArray(meta.questionUids) ||
      meta.questionUids.length !== rows.length ||
      rows.some((r, i) => r.question_uid !== meta.questionUids[i]))
  )
    fail("ordered final UID/payload parity mismatch");
  return rows;
}
export function questionInsertStatements(
  env,
  assignmentIdSql,
  assignmentParams,
  rows,
) {
  const columns = [
    "order_no",
    "question_uid",
    "source_archive_file",
    "source_question_no",
    "source_question_ordinal",
    "source_fingerprint",
    "standard_unit_key",
    "difficulty_at_assignment",
    "metadata_revision",
    "metadata_hash",
    "metadata_json",
    "resolution_status",
  ];
  const statements = [];
  const bindsPerRow = columns.length + assignmentParams.length;
  const batchSize = Math.max(1, Math.floor(90 / bindsPerRow));
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    statements.push(
      env.DB.prepare(
        `INSERT OR IGNORE INTO class_exam_assignment_questions (assignment_id, ${columns.join(",")}) VALUES
      ${batch.map(() => `((${assignmentIdSql}), ${columns.map(() => "?").join(",")})`).join(",")}`,
      ).bind(
        ...batch.flatMap((row) => [
          ...assignmentParams,
          ...columns.map((c) => row[c] ?? null),
        ]),
      ),
    );
  }
  return statements;
}

export async function blueprintInsertStatements(
  env,
  file,
  questions,
  metadataAuthority,
  options = {},
) {
  let hasMetadataJson = false;
  try {
    const blueprintColumns = new Set((await env.DB.prepare("PRAGMA table_info(exam_blueprints)").all())
      .results?.map((row) => row.name).filter(Boolean) || []);
    hasMetadataJson = blueprintColumns.has("metadata_json");
  } catch {}
  const columns = [
    "archive_file",
    "question_no",
    "source_archive_file",
    "source_question_no",
    "source_question_uid",
    "source_question_ordinal",
    "standard_unit_key",
    "standard_unit",
    "standard_course",
    "concept_cluster_key",
    "sub_unit_key",
    "type_key",
    "template_key",
    "difficulty",
    "metadata_revision",
    "metadata_hash",
    ...(hasMetadataJson ? ["metadata_json"] : []),
  ];
  const values = await Promise.all(
    questions.map(async (q, i) => {
      const metadata = metadataAuthority.buildArchiveQuestionMetadata(q);
      const uid = String(q.questionUid || q.source_question_uid || "").trim(),
        sourceFile = norm(q.sourceArchiveFile || q._sourceFile || q.source_archive_file),
        sourceOrdinal = normalizeOptionalPositiveInteger(q.sourceOrdinal ?? q._sourceQuestionOrdinal ?? q.source_question_ordinal),
        identity = options.canonicalAuthority?.identityByUid?.[uid],
        identityStatus = identity?.status === "VERIFIED" &&
          norm(identity.sourceArchiveFile) === sourceFile &&
          Number(identity.sourceOrdinal) === sourceOrdinal
          ? "VERIFIED"
          : "UNRESOLVED",
        canonicalRecord = options.canonicalAuthority
          ? { ...q, questionUid: uid, sourceFile, sourceOrdinal, identityStatus, sourceFingerprint: q.sourceFingerprint || null }
          : null,
        metadataJson = hasMetadataJson
          ? await buildBlueprintMetadataSnapshot(q, metadataAuthority, {
              canonicalRecord,
              sourceIdentityStatus: identityStatus,
              sourceArchiveFile: q.sourceArchiveFile || q._sourceFile || q.source_archive_file || sourceFile,
              sourceQuestionUid: uid || null,
              sourceQuestionOrdinal: sourceOrdinal,
              sourceQuestionNo: q.sourceQuestionNo ?? q._sourceQuestionNo ?? q.source_question_no ?? q.id ?? null,
              sourceFingerprint: q.sourceFingerprint || null,
              projectionVersion: options.projectionVersion,
              captureSource: options.canonicalAuthority
                ? "CANONICAL_PROJECTION_AT_BLUEPRINT_WRITE"
                : "BLUEPRINT_FIELDS_AT_WRITE",
              authoredFidelity: options.canonicalAuthority ? "CANONICAL_CAPTURE" : "UNKNOWN",
              captureStatus: options.canonicalAuthority ? "CAPTURED" : "PARTIAL",
            })
          : null;
      return [
        file,
        i + 1,
        sourceFile,
        String(q.sourceQuestionNo ?? q._sourceQuestionNo ?? q.id ?? ""),
        uid || null,
        sourceOrdinal,
        metadata.standardUnitKey || null,
        metadata.standardUnit || null,
        metadata.standardCourse || null,
        metadata.conceptClusterKey || null,
        metadata.subUnitKey || null,
        metadata.typeKey || null,
        metadata.templateKey || null,
        String(metadata.difficulty || "UNKNOWN"),
        metadata.metadataRevision,
        await metadataAuthority.buildArchiveMetadataHash(metadata),
        ...(hasMetadataJson ? [metadataJson] : []),
      ];
    }),
  );
  const statements = [];
  // A guarded Saved Paper row adds its write-key predicate as one extra bind.
  // Six 16-column rows plus those six guards exceed D1's 100-variable limit.
  const batchSize = 5;
  for (let i = 0; i < values.length; i += batchSize) {
    const batch = values.slice(i, i + batchSize);
    if (options.assignmentGuard?.writeKey) {
      // Saved-paper assignments can share one archive_file across classes.
      // Gate each blueprint row on this exact assignment inside the same D1
      // batch, so a concurrent soft-delete cannot create orphan/shared rows.
      const guardedRows = batch.map(() =>
        `SELECT ${columns.map(() => "?").join(",")} WHERE EXISTS (
          SELECT 1 FROM class_exam_assignments WHERE archive2_write_key=?
        )`,
      );
      statements.push(
        env.DB.prepare(
          `INSERT OR IGNORE INTO exam_blueprints (${columns.join(",")}) ${guardedRows.join(" UNION ALL ")}`,
        ).bind(...batch.flatMap((row) => [...row, options.assignmentGuard.writeKey])),
      );
    } else {
      statements.push(
        env.DB.prepare(
          `INSERT ${options.original ? "" : "OR IGNORE "}INTO exam_blueprints (${columns.join(",")}) VALUES ${batch.map(() => `(${columns.map(() => "?").join(",")})`).join(",")}${
            options.original
              ? ` ON CONFLICT(archive_file,question_no) DO UPDATE SET ${columns
                  .slice(2)
                  .map((c) => `${c}=excluded.${c}`)
                  .join(",")} WHERE excluded.source_question_uid IS NOT NULL`
              : ""
          }`,
        ).bind(...batch.flat()),
      );
    }
  }
  return statements;
}
export async function loadQuestionHistory(env, teacher, input) {
  const ids = uniqueIds(input.student_ids);
  await requireStudentAccess(teacher, ids, env);
  const mode = input.history_mode || "all";
  if (!["all", "recent", "off"].includes(mode)) fail("invalid history_mode");
  const days = Number(input.recent_days);
  if (mode === "recent" && (!Number.isInteger(days) || days < 1 || days > 3650))
    fail("recent_days must be 1~3650");
  if (!(await hasQuestionBridge(env)))
    fail("출제 이력 bridge가 아직 설치되지 않았습니다.", 503);
  const candidates = input.candidate_question_uids;
  if (
    candidates !== undefined &&
    (!Array.isArray(candidates) ||
      candidates.length > 20000 ||
      candidates.some((uid) => !UID.test(uid)))
  )
    fail("invalid candidate_question_uids");
  const candidateSet = candidates === undefined ? null : new Set(candidates);
  const students = Object.fromEntries(
    ids.map((id) => [
      id,
      {
        question_uids: [],
        coverage: { verified: 0, legacy_inferred: 0, unresolved: 0 },
      },
    ]),
  );
  const union = new Set();
  if (mode !== "off")
    for (let i = 0; i < ids.length; i += 80) {
      const part = ids.slice(i, i + 80);
      const result = await env.DB.prepare(
        `
      SELECT r.student_id, r.created_at AS recipient_created_at, a.id AS assignment_id,
        a.created_at AS assignment_created_at, a.question_count, a.archive2_write_key,
        q.order_no, q.question_uid, q.resolution_status
      FROM class_exam_assignment_recipients r
      JOIN class_exam_assignments a ON a.id = r.assignment_id
      LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id = a.id AND x.student_id = r.student_id
      LEFT JOIN class_exam_assignment_questions q ON q.assignment_id = a.id
      WHERE r.student_id IN (${part.map(() => "?").join(",")}) AND x.student_id IS NULL
        ${mode === "recent" ? "AND a.exam_date >= date('now', '+9 hours', ?)" : ""}
      ORDER BY r.student_id, a.id, q.order_no
    `,
      )
        .bind(...part, ...(mode === "recent" ? ["-" + days + " days"] : []))
        .all();
      const seenAssignments = new Map(),
        studentUids = new Map(part.map((id) => [id, new Set()]));
      for (const row of result.results || []) {
        const student = students[row.student_id];
        const key = row.student_id + ":" + row.assignment_id;
        if (!seenAssignments.has(key))
          seenAssignments.set(key, {
            student,
            expected: Number(row.question_count),
            actual: 0,
          });
        const entry = seenAssignments.get(key);
        if (!row.order_no) continue;
        entry.actual++;
        let status = "unresolved";
        if (
          row.resolution_status !== "UNRESOLVED" &&
          UID.test(row.question_uid || "")
        ) {
          if (row.archive2_write_key) status = "verified";
          else if (
            String(row.assignment_created_at).slice(0, 10) < "2026-08-19"
          )
            status = "legacy_inferred";
          else if (
            String(row.assignment_created_at).slice(0, 10) ===
            String(row.recipient_created_at).slice(0, 10)
          )
            status =
              row.resolution_status === "LEGACY_INFERRED"
                ? "legacy_inferred"
                : "verified";
          // Even unresolved recipient timing cannot erase a known effective exposure UID.
          if (!candidateSet || candidateSet.has(row.question_uid))
            studentUids.get(row.student_id).add(row.question_uid);
        }
        student.coverage[status]++;
      }
      for (const entry of seenAssignments.values())
        entry.student.coverage.unresolved += Math.max(
          0,
          entry.expected - entry.actual,
        );
      for (const [id, uids] of studentUids) {
        students[id].question_uids = [...uids].sort();
        uids.forEach((uid) => union.add(uid));
      }
    }
  const coverage = { verified: 0, legacy_inferred: 0, unresolved: 0 };
  for (const student of Object.values(students))
    for (const k of Object.keys(coverage)) coverage[k] += student.coverage[k];
  return {
    success: true,
    contract_version: ARCHIVE2_CONTRACT,
    students,
    union_question_uids: [...union].sort(),
    coverage,
    coverage_unit: "effective_student_question_occurrences",
    history_mode: mode,
  };
}
