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
  fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const metadata = JSON.parse(read("archive/data/question_metadata.json"));
const identity = JSON.parse(read("archive/data/question_identity_map.json"));
const masterFile =
  "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const taxonomy = core.taxonomyPaths(JSON.parse(read(masterFile)));
const paths = new Map(taxonomy.map((record) => [core.pathKey(record), record]));
const foundationTaxonomy = JSON.parse(read("archive/data/meta-foundation/compiled/taxonomy_registry.json"));
const foundationBindings = JSON.parse(read("archive/data/meta-foundation/compiled/curriculum_bindings.json"));
const foundationProblemTypes = new Map((foundationTaxonomy.problemTypes || []).map((row) => [row.problemTypeKey, row]));
const foundationTemplates = new Map((foundationTaxonomy.templates || []).map((row) => [row.templateKey, row]));

function foundationNode(meta) {
  if (!meta?.problemTypeKey || !meta?.templateKey || !meta?.standardUnitKey || !meta?.subUnitKey) return null;
  const problemType = foundationProblemTypes.get(meta.problemTypeKey);
  const template = foundationTemplates.get(meta.templateKey);
  if (!problemType || !template || template.parentProblemTypeKey !== meta.problemTypeKey) return null;
  const binding = (foundationBindings.bindings || []).find((row) =>
    row.problemTypeKey === meta.problemTypeKey &&
    row.standardUnitKey === meta.standardUnitKey &&
    row.subUnitKey === meta.subUnitKey &&
    (!meta.curriculumKey || String(row.curriculum) === String(meta.curriculumKey))
  );
  if (!binding) return null;
  return {
    curriculumKey: String(binding.curriculum || meta.curriculumKey || ""),
    courseKey: binding.standardCourse || meta.courseKey || "",
    L1: meta.L1 || meta.standardUnit || "",
    L2: meta.L2 || binding.subUnitLabelKo || meta.subUnit || "",
    L3: meta.L3 || problemType.canonicalLabelKo || "",
    L4: meta.L4 || template.canonicalLabelKo || "",
    curriculumApplicability: binding.curriculumApplicability === "CORE" || !binding.curriculumApplicability ? "DEFAULT_SCOPE" : binding.curriculumApplicability,
    defaultSelectable: binding.defaultSelectable === true
  };
}
const metaByUid = new Map(metadata.records.map((r) => [r.questionUid, r]));
const identityBySource = new Map(
  identity.records.map((r) => [
    core.normalizeFile(r.sourceArchiveFile) + "#" + r.sourceOrdinal,
    r,
  ]),
);
if (
  metaByUid.size !== metadata.records.length ||
  identityBySource.size !== identity.records.length
)
  throw new Error("duplicate canonical identity");
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
const courseGrade = (value) =>
  /^M([123])-/.test(value)
    ? "중" + value[1]
    : ["공통수학1", "공통수학2", "수학(상)", "수학(하)"].includes(value)
      ? "고1"
      : families[value]
        ? "고2"
        : "";
for (const exam of exams) {
  const file = core.normalizeFile(exam.file);
  const gradePath = file.match(/\/(?:high\/h([123])|middle\/m([123]))\//);
  const pathGrade = gradePath
    ? gradePath[1]
      ? "고" + gradePath[1]
      : "중" + gradePath[2]
    : "";
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
  const rangeGrade = (exam.courseRanges || [])
    .map((r) => courseGrade(r.standardCourse || ""))
    .reduce(
      (grade, next) =>
        core.gradeRank(next) > core.gradeRank(grade) ? next : grade,
      exam.grade,
    );
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
    const validJoin =
      id &&
      meta &&
      core.normalizeFile(meta.sourceArchiveFile) === file &&
      meta.sourceOrdinal === ordinal;
    const node = validJoin && (paths.get(core.pathKey(meta)) || foundationNode(meta));
    const metadataConflicts = [];
    const semantic = {};
    for (const field of core.META_FIELDS) {
      const sourceValue = question[field],
        value = validJoin ? meta[field] : undefined;
      if (
        sourceValue !== undefined &&
        sourceValue !== null &&
        String(sourceValue).trim() !== "" &&
        value !== undefined &&
        JSON.stringify(sourceValue) !== JSON.stringify(value)
      )
        metadataConflicts.push(field);
      if (value !== undefined) semantic[field] = value;
    }
    const formula = "qid_v1_" + hash(file + "#" + ordinal);
    // qid_v1 authority removes the exams/ wrapper. Never mint missing identities here.
    const identityStatus =
      id && id.questionUid === formula ? "VERIFIED" : "UNRESOLVED";
    const record = {
      sourceFile: file,
      sourceOrdinal: ordinal,
      sourceQuestionNo: String(question.id ?? ""),
      questionUid: id?.questionUid || "",
      sourceGrade: exam.grade,
      effectiveBrowseGrade: exam.grade,
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
      sourceFingerprint: fingerprint,
      rawQuestionHash: hash(JSON.stringify(question)),
      approvedSourceFingerprint: meta?.sourceFingerprint || "",
      sourceStatus:
        validJoin && meta.sourceFingerprint === fingerprint
          ? "VERIFIED"
          : "HOLD",
      taxonomyStatus: node ? "CONFIRMED" : "UNKNOWN",
      metadataConflicts,
      gradeConflict: false,
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
    const detectedGrade = courseGrade(record.courseKey || "");
    if (core.gradeRank(detectedGrade) > core.gradeRank(exam.grade)) {
      record.effectiveBrowseGrade = detectedGrade;
      record.gradeConflict = true;
    }
    if (
      core.gradeRank(rangeGrade) > core.gradeRank(record.effectiveBrowseGrade)
    )
      record.effectiveBrowseGrade = rangeGrade;
    if (core.gradeRank(rangeGrade) > core.gradeRank(exam.grade))
      record.gradeConflict = true;
    if (pathGrade && pathGrade !== exam.grade) {
      record.gradeConflict = true;
      if (
        core.gradeRank(pathGrade) > core.gradeRank(record.effectiveBrowseGrade)
      )
        record.effectiveBrowseGrade = pathGrade;
    }
    if (
      !record.courseFamilies.length &&
      /^中|^중|^M[123]-/.test(record.courseKey || exam.subject)
    )
      record.courseFamilies = ["MIDDLE"];
    record.automatic = core.eligibility(record).ok;
    core.eligibility(record).reasons.forEach(count);
    if (record.automatic) count("automatic");
    examRecords.push(record);
    records.push(record);
  }
  exam.sourceGrade = exam.grade;
  exam.effectiveBrowseGrade = examRecords.reduce(
    (grade, r) =>
      core.gradeRank(r.effectiveBrowseGrade) > core.gradeRank(grade)
        ? r.effectiveBrowseGrade
        : grade,
    exam.grade,
  );
  exam.automaticCount = examRecords.filter((r) => r.automatic).length;
  exam.curriculums = [
    ...new Set(examRecords.map((r) => r.curriculumKey).filter(Boolean)),
  ];
  exam.courseFamilies = [
    ...new Set(examRecords.flatMap((r) => r.courseFamilies)),
  ];
  exam.gradeConflict = examRecords.some((r) => r.gradeConflict);
}
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
if (process.argv.includes("--check")) {
  if (
    !fs.existsSync(target) ||
    fs.readFileSync(target, "utf8") !== JSON.stringify(packed) + "\n"
  )
    throw new Error("Archive 2.0 catalog projection is stale");
} else fs.writeFileSync(target, JSON.stringify(packed) + "\n");
console.log(JSON.stringify({ indexVersion, ...catalog.health }, null, 2));
