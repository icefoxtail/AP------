import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import core from "../archive2-core.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const read = (file) =>
  fs.readFileSync(path.join(root, file), "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const metadata = JSON.parse(read("archive/data/question_metadata.json"));
const identity = JSON.parse(read("archive/data/question_identity_map.json"));
const basicScopeLinks = JSON.parse(read("archive/data/basic-scope-parent-links.json"));
const projectionPolicy = JSON.parse(read("archive/data/archive2-canonical-projection-policy.json"));
const foundationTaxonomy = JSON.parse(read("archive/data/meta-foundation/compiled/taxonomy_registry.json"));
const foundationConcepts = JSON.parse(read("archive/data/meta-foundation/compiled/concept_registry.json"));
const foundationConditions = JSON.parse(read("archive/data/meta-foundation/compiled/condition_registry.json"));
const foundationBindings = JSON.parse(read("archive/data/meta-foundation/compiled/curriculum_bindings.json"));
const foundationProblemTypes = new Set(foundationTaxonomy.problemTypes.map((r) => r.problemTypeKey));
const foundationTemplates = new Map(foundationTaxonomy.templates.map((r) => [r.templateKey, r]));
const foundationCrossConcepts = new Set(foundationConcepts.concepts.map((r) => r.conceptKey));
const foundationConditionKeys = new Set(foundationConditions.conditions.map((r) => r.conditionKey));
const foundationBindingKeys = new Set(foundationBindings.bindings.map((r) => [r.curriculum, r.standardUnitKey, r.subUnitKey, r.problemTypeKey].join("\u0000")));
const foundationProjectionFields = new Set(["problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "foundationTaxonomyStatus", "rpmPathStatus", "metaFoundationHoldReason", "metaFoundationPackVersion", "l3Disposition", "l4Disposition", "semanticDisposition"]);
const metaV2SidecarRevision = value => String(value || "").startsWith(
  "meta-foundation:MIDDLE_RECERT_2026-09-30_META_V2:meta-review2-v1"
);
const masterFile =
  "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const masterText = read(masterFile);
const canonicalMasterSha = hash(masterText);
const taxonomy = core.taxonomyPaths(JSON.parse(masterText));
if (basicScopeLinks.authority?.sha256 !== canonicalMasterSha ||
    projectionPolicy.canonicalMasterSha256 !== canonicalMasterSha)
  throw new Error("Archive2 canonical source-pack drift: master version does not match parent-link/projection policy");
const paths = new Map(taxonomy.map((record) => [core.pathKey(record), record]));
const parentPaths = new Map(taxonomy.map((record) => [core.pathKey(record, 4), record]));
const sourceParentsByUid = new Map();
for (const link of basicScopeLinks.sourceParents || []) {
  if (!sourceParentsByUid.has(link.questionUid)) sourceParentsByUid.set(link.questionUid, []);
  sourceParentsByUid.get(link.questionUid).push(link);
}
const metaByUid = new Map(metadata.records.map((r) => [r.questionUid, r]));
const identityBySource = new Map(
  identity.records.map((r) => [
    core.normalizeFile(r.sourceArchiveFile) + "#" + r.sourceOrdinal,
    r,
  ]),
);
const pathRenameTargets = new Set(
  (identity.verifiedPathRenameHistory || identity.incrementalSync?.renamedFiles || [])
    .map((row) => core.normalizeFile(row.to))
    .filter(Boolean),
);
if (
  metaByUid.size !== metadata.records.length ||
  identityBySource.size !== identity.records.length
)
  throw new Error("duplicate canonical identity");
const gradeCourseAllowlist = new Set(
  (projectionPolicy.gradeCourseAllowlist || []).map((row) =>
    [row.grade, row.curriculumKey, row.courseKey].join("\u0000"),
  ),
);
const taxonomyVersion = canonicalMasterSha;
const approvedFieldStatus = (value) => /^approved(?:_|$)/i.test(String(value || ""));
const reviewedMetadataStatuses = new Set(["MOTHER_FINAL"]);
function verifiedBasicAssignment({ id, meta, sourceFile, sourceOrdinal, sourceGrade, assignmentFp }) {
  const fail = (reason) => ({ assignment: null, reason });
  if (!id || !meta || id.questionUid !== meta.questionUid) return fail("assignment_identity_unverified");
  if (
    core.normalizeFile(id.sourceArchiveFile) !== sourceFile ||
    core.normalizeFile(meta.sourceArchiveFile) !== sourceFile ||
    Number(id.sourceOrdinal) !== sourceOrdinal ||
    Number(meta.sourceOrdinal) !== sourceOrdinal
  ) return fail("assignment_identity_mismatch");
  if (!sourceGrade || !assignmentFp || meta.contentFingerprint !== assignmentFp)
    return fail("assignment_fingerprint_mismatch");
  if (!meta.standardUnitKey || !meta.subUnitKey ||
      !approvedFieldStatus(meta.fieldStatus?.standardUnit) ||
      !approvedFieldStatus(meta.fieldStatus?.subUnit))
    return fail("assignment_fields_unreviewed");
  if (!Array.isArray(meta.approvalEvidence) || !meta.approvalEvidence.some((ref) => typeof ref === "string" && ref.trim()) ||
      !String(metadata.approvalStatus || "").startsWith("APPROVED") ||
      !/^[a-f0-9]{64}$/i.test(String(metadata.sourceDigests?.completeClassification || "")))
    return fail("assignment_review_evidence_missing");
  const metadataStatus = String(meta.metadataStatus || "");
  if (!metadataStatus.startsWith("approved_") && !reviewedMetadataStatuses.has(metadataStatus))
    return fail("assignment_not_approved");

  const candidates = (sourceParentsByUid.get(id.questionUid) || []).filter((link) =>
    link.grade === sourceGrade &&
    link.sourceFingerprint === meta.sourceFingerprint &&
    Boolean(link.curriculumKey && link.courseKey && link.L1 && link.L2) &&
    gradeCourseAllowlist.has([sourceGrade, link.curriculumKey, link.courseKey].join("\u0000")) &&
    parentPaths.has(JSON.stringify([link.curriculumKey, link.courseKey, link.L1, link.L2])),
  );
  const targets = new Map(candidates.map((link) => [
    [link.grade, link.curriculumKey, link.courseKey, link.L1, link.L2].join("\u0000"),
    link,
  ]));
  if (targets.size > 1) return fail("assignment_conflict");
  if (!targets.size) return fail("canonical_parent_missing");
  const link = [...targets.values()][0];
  return {
    reason: "",
    assignment: {
      store: "question_metadata+basic_scope_parent_links",
      questionUid: id.questionUid,
      sourceFile,
      sourceOrdinal,
      grade: sourceGrade,
      curriculumKey: link.curriculumKey,
      courseKey: link.courseKey,
      L1: link.L1,
      L2: link.L2,
      standardCourse: meta.standardCourse || "",
      standardUnitKey: meta.standardUnitKey || "",
      standardUnit: meta.standardUnit || "",
      subUnitKey: meta.subUnitKey || "",
      subUnit: meta.subUnit || "",
      sourceFingerprint: assignmentFp,
      assignmentFingerprint: assignmentFp,
      approvalStatus: "APPROVED",
      taxonomyVersion,
      reviewEvidence: {
        status: "PASS",
        reference: meta.approvalEvidence.find((ref) => typeof ref === "string" && ref.trim()),
        sha256: metadata.sourceDigests.completeClassification,
        sourceRevision: meta.metadataRevision || "",
        reviewedSourceFingerprint: meta.sourceFingerprint || "",
      },
    },
  };
}
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(read("archive/db.js"), ctx);
const exams = ctx.window.mainDB.exams;
const records = [],
  sourceHashes = [],
  health = {};
const count = (name) => {
  health[name] = (health[name] || 0) + 1;
};
const families = {
  "수학(상)": "COMMON_1",
  공통수학1: "COMMON_1",
  "수학(하)": "COMMON_2",
  공통수학2: "COMMON_2",
  수학Ⅰ: "ALGEBRA",
  수학I: "ALGEBRA",
  대수: "ALGEBRA",
  수학Ⅱ: "CALCULUS",
  수학II: "CALCULUS",
  미적분Ⅰ: "CALCULUS",
  미적분I: "CALCULUS",
  미적분: "CALCULUS_ADVANCED",
  미적분II: "CALCULUS_ADVANCED",
  미적분Ⅱ: "CALCULUS_ADVANCED",
  "확률과 통계": "PROB_STATS",
  확률과통계: "PROB_STATS",
  기하: "GEOMETRY",
};
for (const exam of exams) {
  const file = core.normalizeFile(exam.file);
  const source = read("archive/exams/" + file);
  sourceHashes.push([file, hash(source)]);
  const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(scope);
  vm.runInContext(source, scope, { filename: file, timeout: 3000 });
  const bank = scope.window.questions || scope.window.questionBank;
  exam.identityTitle = scope.window.examTitle || file.split('/').pop().replace(/\.js$/,'');
  if (!Array.isArray(bank)) throw new Error("source bank unavailable: " + file);
  if (bank.length !== Number(exam.qCount))
    throw new Error("catalog/source cardinality mismatch: " + file);
  const examRecords = [];
  for (const [index, question] of bank.entries()) {
    const ordinal = index + 1;
    const id = identityBySource.get(file + "#" + ordinal);
    const meta = id && metaByUid.get(id.questionUid);
    const fingerprint = hash(
      JSON.stringify({
        content: question.content ?? null,
        choices: Array.isArray(question.choices) ? question.choices : null,
        answer: question.answer ?? null,
        solution: question.solution ?? null,
        image: question.image ?? null,
      }),
    );
    const assignmentFingerprint = hash(JSON.stringify({
      content: question.content ?? null,
      choices: Array.isArray(question.choices) ? question.choices : null,
      image: question.image ?? null,
    }));
    const validJoin =
      id &&
      meta &&
      core.normalizeFile(meta.sourceArchiveFile) === file &&
      meta.sourceOrdinal === ordinal;
    const directNode = validJoin && paths.get(core.pathKey(meta));
    const foundationScoped = meta?.metadataRevision?.startsWith("meta-foundation:");
    const metaV2Sidecar = metaV2SidecarRevision(meta?.metadataRevision);
    const foundationPresent = foundationScoped && Boolean(meta?.problemTypeKey || meta?.templateKey);
    const template = meta?.templateKey ? foundationTemplates.get(meta.templateKey) : null;
    const explicitNoTemplateDisposition = ["NO_SEPARATE_L4", "HOLD"].includes(meta?.l4Disposition);
    const foundationValid = !foundationPresent ? null : Boolean(
      foundationProblemTypes.has(meta.problemTypeKey) &&
      (template
        ? template.parentProblemTypeKey === meta.problemTypeKey
        : explicitNoTemplateDisposition) &&
      (meta.crossConceptKeys || []).every((key) => foundationCrossConcepts.has(key)) &&
      (meta.conditionKeys || []).every((key) => foundationConditionKeys.has(key)) &&
      foundationBindingKeys.has([meta.curriculum, meta.standardUnitKey, meta.subUnitKey, meta.problemTypeKey].join("\u0000"))
    );
    const parentOnlyFoundation = foundationValid === true &&
      meta.rpmPathStatus === "HOLD_NO_EQUIVALENT_PATH" &&
      meta.reviewStatus === "reviewed_pass" && !meta.L3 && !meta.L4;
    const node = directNode || (parentOnlyFoundation && parentPaths.get(core.pathKey(meta, 4)));
    const metadataConflicts = [];
    const semantic = {};
    for (const field of core.META_FIELDS) {
      if (core.PATH_FIELDS.includes(field)) continue;
      if (!foundationScoped && foundationProjectionFields.has(field)) continue;
      const sourceValue = question[field],
        value = validJoin ? meta[field] : undefined;
      if (
        sourceValue !== undefined &&
        sourceValue !== null &&
        String(sourceValue).trim() !== "" &&
        value !== undefined &&
        JSON.stringify(sourceValue) !== JSON.stringify(value) &&
        !metaV2Sidecar
      )
        metadataConflicts.push(field);
      if (value !== undefined) semantic[field] = value;
    }
    if (foundationScoped && meta?.foundationTaxonomyStatus === "CONFIRMED" && foundationValid !== true)
      metadataConflicts.push("foundationTaxonomy");
    const formula = "qid_v1_" + hash(file + "#" + ordinal);
    // A normal source keeps the deterministic path+ordinal UID. A verified file rename
    // preserves the pre-rename UID and is authoritative only when the identity+metadata
    // join already points at the new source path and the identity sync recorded the rename.
    const verifiedPathRename =
      Boolean(id && validJoin && pathRenameTargets.has(file));
    const identityStatus =
      id && (id.questionUid === formula || verifiedPathRename)
        ? "VERIFIED"
        : "UNRESOLVED";
    const sourceGradeEvidence = core.Canonical.resolveSourceGrade({
      registeredGrade: exam.grade,
      sourceFile: file,
      identitySourceFile: id?.sourceArchiveFile,
    });
    const assignmentResult = identityStatus === "VERIFIED" && sourceGradeEvidence.status === "VALID"
      ? verifiedBasicAssignment({
          id,
          meta: validJoin ? meta : null,
          sourceFile: file,
          sourceOrdinal: ordinal,
          sourceGrade: sourceGradeEvidence.grade,
          assignmentFp: assignmentFingerprint,
        })
      : { assignment: null, reason: sourceGradeEvidence.status };
    const record = {
      sourceFile: file,
      sourceOrdinal: ordinal,
      sourceQuestionNo: String(question.id ?? ""),
      questionUid: id?.questionUid || "",
      sourceGrade: sourceGradeEvidence.grade,
      sourceGradeStatus: sourceGradeEvidence.status,
      sourceGradeReason: sourceGradeEvidence.reason,
      effectiveBrowseGrade: sourceGradeEvidence.grade,
      school: exam.school,
      year: exam.year,
      subject: exam.subject,
      topic: exam.topic,
      examAxis:
        exam.semester && exam.examType
          ? exam.semester + "-" + exam.examType
          : "other",
      contentType: exam.contentType,
      ...semantic,
      difficultyBucket: Number.isInteger(semantic.difficultyBucket)
        ? semantic.difficultyBucket
        : "UNKNOWN",
      legacyLevel: question.level || "",
      legacyStandardUnitKey: question.standardUnitKey || "",
      legacySubUnitKey: question.subUnitKey || "",
      identityStatus,
      sourceIntegrityStatus: identityStatus === "VERIFIED" ? "VERIFIED" : "UNRESOLVED",
      sourceFingerprint: fingerprint,
      assignmentFingerprint,
      rawQuestionHash: hash(JSON.stringify(question)),
      approvedSourceFingerprint: meta?.sourceFingerprint || "",
      metadataAssignmentEvidence: meta ? {
        questionUid: meta.questionUid,
        sourceFile: core.normalizeFile(meta.sourceArchiveFile),
        sourceOrdinal: Number(meta.sourceOrdinal),
        sourceFingerprint: meta.sourceFingerprint || "",
        assignmentFingerprint: meta.contentFingerprint || "",
        metadataStatus: meta.metadataStatus || "",
        fieldStatus: meta.fieldStatus || {},
        evidenceRefs: meta.approvalEvidence || [],
        evidenceDigest: metadata.sourceDigests?.completeClassification || "",
        metadataRevision: meta.metadataRevision || "",
      } : null,
      sourceStatus:
        validJoin && meta.sourceFingerprint === fingerprint
          ? "VERIFIED"
          : "HOLD",
      // RPM Primary semantic confirmation is independent of PT/TPL projection materialization.
      taxonomyStatus: node ? "CONFIRMED" : "UNKNOWN",
      ...(foundationScoped ? { foundationTaxonomyStatus: meta?.foundationTaxonomyStatus === "HOLD" ? "HOLD" : (foundationValid === true ? "CONFIRMED" : (meta?.foundationTaxonomyStatus || "HOLD")) } : {}),
      metadataConflicts,
      gradeConflict: sourceGradeEvidence.status !== "VALID",
      unverifiedTaxonomy: {
        curriculumKey: meta?.curriculumKey || question.curriculumKey || "",
        courseKey: meta?.courseKey || meta?.standardCourse || question.standardCourse || "",
        L1: meta?.L1 || question.standardUnit || question.category || "",
        L2: meta?.L2 || question.subUnit || "",
        L3: meta?.L3 || "",
        L4: meta?.L4 || "",
      },
      assignmentEvidence: assignmentResult.assignment,
      canonicalAssignmentReasons: assignmentResult.reason ? [assignmentResult.reason] : [],
      courseFamilies: [
        ...new Set(
          (exam.courseRanges || [])
            .map((r) => families[r.standardCourse])
            .filter(Boolean),
        ),
      ],
    };
    if (
      node &&
      (node.curriculumApplicability !== record.curriculumApplicability ||
        node.defaultSelectable !== record.defaultSelectable)
    )
      record.metadataConflicts.push("applicability");
    if (assignmentResult.assignment) {
      for (const field of ["curriculumKey", "courseKey", "L1", "L2"])
        record[field] = assignmentResult.assignment[field];
      for (const field of ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"])
        record[field] = assignmentResult.assignment[field] || "";
    } else {
      for (const field of core.PATH_FIELDS) record[field] = "";
      for (const field of ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"])
        record[field] = "";
    }
    if (
      !record.courseFamilies.length &&
      /^中|^중|^M[123]-/.test(record.courseKey || exam.subject)
    )
      record.courseFamilies = ["MIDDLE"];
    for (const field of ["reviewStatus", "sourceQualityDisposition", "sourceIssueHold",
      "sourceDefectCandidate", "basicSemanticDisposition", "semanticDisposition"])
      if (record[field] === undefined && question[field] !== undefined) record[field] = question[field];
    examRecords.push(record);
    records.push(record);
  }
  exam.sourceGrade = exam.grade;
  exam.effectiveBrowseGrade = exam.grade;
  exam.automaticCount = 0;
  exam.curriculums = [
    ...new Set(examRecords.map((r) => r.curriculumKey).filter(Boolean)),
  ];
  exam.courseFamilies = [
    ...new Set(examRecords.flatMap((r) => r.courseFamilies)),
  ];
  exam.gradeConflict = examRecords.some((r) => r.gradeConflict);
}
const gradeCourseRows = projectionPolicy.gradeCourseAllowlist || [];
const canonicalBasicParents = [];
const canonicalAdvancedPaths = [];
for (const row of taxonomy) {
  for (const allowed of gradeCourseRows) {
    if (allowed.curriculumKey !== row.curriculumKey || allowed.courseKey !== row.courseKey) continue;
    const withGrade = { ...row, grade: allowed.grade };
    canonicalBasicParents.push(withGrade);
    if (row.L3 && row.L4) canonicalAdvancedPaths.push(withGrade);
  }
}
const uniqueBy = (rows, fields) => [...new Map(rows.map((row) => [
  JSON.stringify(fields.map((field) => String(row[field] ?? ""))), row,
])).values()];
const canonicalAuthority = {
  taxonomyVersion,
  examGradeByFile: Object.fromEntries(exams.map((exam) => [core.normalizeFile(exam.file), exam.grade])),
  identityByUid: Object.fromEntries(records.filter((row) => row.questionUid).map((row) => [row.questionUid, {
    questionUid: row.questionUid,
    sourceArchiveFile: row.sourceFile,
    sourceOrdinal: row.sourceOrdinal,
    status: row.identityStatus,
  }])),
  gradeCourses: gradeCourseRows,
  canonicalParents: uniqueBy(canonicalBasicParents, ["grade", "curriculumKey", "courseKey", "L1", "L2"]),
  canonicalAdvancedPaths: uniqueBy(canonicalAdvancedPaths, ["grade", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4"]),
  assignmentsByUid: Object.fromEntries(records.filter((row) => row.assignmentEvidence)
    .map((row) => [row.questionUid, [row.assignmentEvidence]])),
  advancedAssignmentsByUid: {},
};
for (const record of records) {
  const result = core.eligibility(record, { canonicalAuthority });
  record.automatic = result.ok;
  result.reasons.forEach(count);
  if (record.automatic) count("automatic");
}
for (const exam of exams)
  exam.automaticCount = records.filter((record) =>
    record.sourceFile === core.normalizeFile(exam.file) && record.automatic,
  ).length;
const indexVersion = hash(
  JSON.stringify([
    core.VERSION,
    sourceHashes,
    hash(read("archive/data/question_metadata.json")),
    identity.identityDigest,
    taxonomy,
    exams,
    records,
  ]),
);
const catalog = {
  schemaVersion: core.VERSION,
  taxonomyVersion: core.TAXONOMY_VERSION,
  canonicalMasterSha256: canonicalMasterSha,
  indexVersion,
  metadataRevision: metadata.metadataRevision,
  identityDigest: identity.identityDigest,
  sourceHashes,
  taxonomy,
  exams,
  records,
  health: {
    ...health,
    exams: exams.length,
    questions: records.length,
    metadataRecords: metadata.records.length,
  },
};
const target = path.join(root, "archive/data/archive2-catalog.json");
// Repeated labels and source paths dominate a full JSON projection. Column packing
// changes transport only; decodeCatalog restores the exact field names and values.
const columns = [...new Set(records.flatMap((record) => Object.keys(record)))];
const strings = [],
  stringIds = new Map();
const encode = (value) => {
  if (typeof value !== "string") return value ?? null;
  if (!stringIds.has(value)) {
    stringIds.set(value, strings.length);
    strings.push(value);
  }
  return [stringIds.get(value)];
};
const packed = {
  ...catalog,
  encoding: "column-dictionary-v1",
  columns,
  strings,
  records: records.map((record) =>
    columns.map((column) => encode(record[column])),
  ),
};
const packedText = JSON.stringify(packed) + "\n";
const overrideEvidenceDir = path.join(root, "archive/data/meta-foundation/evidence/review-overrides/v1");
const overrideRecords = fs.existsSync(overrideEvidenceDir)
  ? fs.readdirSync(overrideEvidenceDir)
      .filter((name) => name.endsWith(".json"))
      .sort()
      .map((name) => {
        const bytes = fs.readFileSync(path.join(overrideEvidenceDir, name));
        return {
          ...JSON.parse(bytes.toString("utf8")),
          evidenceReference: "data/meta-foundation/evidence/review-overrides/v1/" + name,
          evidenceSha256: hash(bytes),
        };
      })
  : [];
const overrideIndex = {
  schemaVersion: "archive2-item-review-override-index-v1",
  status: "DERIVED_READ_ONLY",
  records: overrideRecords,
};
const overrideIndexText = JSON.stringify(overrideIndex) + "\n";
const overrideIndexTarget = path.join(root, "archive/data/archive2-item-review-overrides.json");
const runtimePacks = core.Canonical.RUNTIME_INPUT_PATHS.map((runtimePath) =>
  JSON.parse(read("archive/" + runtimePath)),
);
const allInputPaths = core.Canonical.manifestInputPathsFromRuntimePacks(
  runtimePacks,
  (inputPath) => {
    const absolutePath = path.resolve(root, "archive", inputPath);
    return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile();
  },
);
const manifestFiles = allInputPaths.map((inputPath) => {
  const bytes = inputPath === "data/archive2-catalog.json"
    ? Buffer.from(packedText, "utf8")
    : inputPath === "data/archive2-item-review-overrides.json"
      ? Buffer.from(overrideIndexText, "utf8")
    : fs.readFileSync(path.resolve(root, "archive", inputPath));
  return { path: inputPath, sha256: hash(bytes) };
});
const manifest = {
  schemaVersion: "archive2-canonical-input-manifest-v1",
  resolverVersion: core.Canonical.RESOLVER_VERSION,
  generatedFromCatalogIndexVersion: indexVersion,
  projectionVersion: await core.Canonical.computeProjectionVersion(manifestFiles, core.Canonical.RESOLVER_VERSION),
  files: manifestFiles,
};
const manifestTarget = path.join(root, "archive/data/archive2-canonical-input-manifest.json");
if (process.argv.includes("--check")) {
  const actual = fs.existsSync(target)
    ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n")
    : null;
  const expected = packedText;
  if (
    actual === null ||
    actual !== expected
  )
    throw new Error("Archive 2.0 catalog projection is stale");
  const actualOverrideIndex = fs.existsSync(overrideIndexTarget)
    ? fs.readFileSync(overrideIndexTarget, "utf8").replace(/\r\n/g, "\n")
    : null;
  if (actualOverrideIndex !== overrideIndexText)
    throw new Error("Archive 2.0 reviewed item override index is stale");
  const actualManifest = fs.existsSync(manifestTarget)
    ? fs.readFileSync(manifestTarget, "utf8").replace(/\r\n/g, "\n")
    : null;
  if (actualManifest !== JSON.stringify(manifest) + "\n")
    throw new Error("Archive 2.0 canonical input manifest is stale");
} else {
  fs.writeFileSync(target, packedText);
  fs.writeFileSync(overrideIndexTarget, overrideIndexText);
  fs.writeFileSync(manifestTarget, JSON.stringify(manifest) + "\n");
}
console.log(JSON.stringify({ indexVersion, projectionVersion: manifest.projectionVersion, ...catalog.health }, null, 2));
