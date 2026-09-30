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
const masterFile =
  "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const taxonomy = core.taxonomyPaths(JSON.parse(read(masterFile)));
const paths = new Map(taxonomy.map((record) => [core.pathKey(record), record]));
const parentPaths = new Map(taxonomy.map((record) => [core.pathKey(record, 4), record]));
const labelKey = value => String(value || "").normalize("NFC").replace(/\s+/g, "");
// Preserve source unit tags even when the advanced metadata join has no path.
// Match a canonical parent only when the source labels identify it uniquely.
function sourceScope(question, exam) {
  const unitKey = question.standardUnitKey || "";
  const middle = unitKey.match(/^M([123])-(\d{2})$/);
  const middleSemester = unitKey.match(/^M([123])-([12])-/);
  const curriculumKey = question.curriculumKey ||
    (/^H(15|22)-/.test(unitKey) ? "20" + unitKey.slice(1, 3) :
      core.middleCurriculumFromYear(exam.grade, exam.year));
  const courseFromKey = {
    "H15-SA": "수학(상)", "H15-SB": "수학(하)", "H15-M1": "수학I",
    "H15-M2": "수학II", "H15-CALC": "미적분", "H15-PS": "확률과통계", "H15-GE": "기하",
    "H22-C": "공통수학1", "H22-C2": "공통수학2", "H22-A": "대수",
    "H22-M1": "미적분I", "H22-M2": "미적분II", "H22-PS": "확률과통계", "H22-GE": "기하",
  }[unitKey.match(/^(H(?:15|22)-[^-]+)-/)?.[1]];
  const sourceCourse = courseFromKey || question.standardCourse || exam.subject;
  const courseKey = question.courseKey || (middle ?
    `M${middle[1]}-${Number(middle[2]) <= 4 ? 1 : 2}` : middleSemester ?
    `M${middleSemester[1]}-${middleSemester[2]}` :
    taxonomy.find(row => row.curriculumKey === curriculumKey &&
      core.normalizeCourseIdentity(row.courseKey) === core.normalizeCourseIdentity(sourceCourse))?.courseKey || sourceCourse);
  const L1 = question.standardUnit || question.category || "";
  const L2 = question.subUnit || L1;
  const parents = new Map(taxonomy.filter(row => row.curriculumKey === curriculumKey &&
    row.courseKey === courseKey).map(row => [core.pathKey(row, 4), row]));
  const candidates = [...parents.values()].filter(row =>
    labelKey(row.L2) === labelKey(L2) || labelKey(row.L2) === labelKey(L1));
  const parent = candidates.length === 1 ? candidates[0] : null;
  return { curriculumKey, courseKey, L1: parent?.L1 || L1, L2: parent?.L2 || L2 };
}

const META_V2_GENERATION = "MIDDLE_RECERT_2026-09-30_META_V2";
const metaV2ParentLinks = JSON.parse(read("archive/data/basic-scope-parent-links.json"));
const metaV2Registry = JSON.parse(read("archive/data/meta-foundation/canonical/registry_index.json"));
const metaV2ActivePacks = new Map(
  (metaV2Registry.activePacks || [])
    .filter((row) => row.status === "ACTIVE")
    .map((row) => [row.id, row]),
);
const metaV2ProblemTypes = new Map(
  (foundationTaxonomy.problemTypes || []).map((row) => [row.problemTypeKey, row]),
);
const gitBlobSha = (bytes) =>
  crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const metaV2Text = (value) => String(value ?? "").trim();
const metaV2Equal = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const metaV2DateMs = (value) => {
  const ms = Date.parse(String(value || ""));
  return Number.isFinite(ms) ? ms : NaN;
};
const metaV2LabelKey = (value) =>
  metaV2Text(value).normalize("NFC").replace(/\s+/g, "");
const metaV2NormalizeFile = (value) =>
  metaV2Text(value)
    .normalize("NFC")
    .replace(/\\/g, "/")
    .replace(/^\.?\/?archive\/exams\//, "")
    .replace(/^\.?\/?exams\//, "")
    .replace(/^\/+/, "");
const metaV2SourceFingerprint = (question) =>
  hash(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null,
  }));
function metaV2Walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...metaV2Walk(full));
    else if (entry.isFile() && entry.name.endsWith(".meta-review2.meta-v2.payload.json")) files.push(full);
  }
  return files;
}
function metaV2LoadBank(sourceFile) {
  const full = path.join(root, "archive", "exams", sourceFile);
  const bytes = fs.readFileSync(full);
  const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
  scope.globalThis = scope;
  vm.createContext(scope);
  vm.runInContext(bytes.toString("utf8"), scope, { filename: full, timeout: 5000 });
  const bank = scope.window.questions || scope.window.questionBank || scope.questions || scope.questionBank;
  if (!Array.isArray(bank)) throw new Error("META_V2 source bank unavailable: " + sourceFile);
  return { bank, bytes };
}
function metaV2ExpectedCount(marker, field) {
  const match = /^(\d+)\/(\d+)$/.exec(String(marker || ""));
  if (!match || match[1] !== match[2]) throw new Error("META_V2 " + field + " must be N/N");
  return Number(match[2]);
}
function metaV2Grade(sourceFile) {
  const middle = sourceFile.match(/(?:^|\/)middle\/m([123])\//);
  if (middle) return "중" + middle[1];
  const high = sourceFile.match(/(?:^|\/)high\/h([123])\//);
  return high ? "고" + high[1] : "";
}
function metaV2MiddleCourseKey(standardUnitKey, fallback = "") {
  const match = /^M([123])-(\d{2})$/.exec(metaV2Text(standardUnitKey));
  if (!match) return fallback;
  return "M" + match[1] + "-" + (Number(match[2]) <= 4 ? "1" : "2");
}
function metaV2ResolveParent(row, current, sourceFile) {
  const curriculumKey = metaV2Text(row.curriculum || current.curriculumKey || current.curriculum);
  const grade = metaV2Grade(sourceFile);
  const standardUnitKey = metaV2Text(row.standardUnitKey || current.standardUnitKey);
  const subUnitKey = metaV2Text(row.subUnitKey || current.subUnitKey);
  let candidates = (metaV2ParentLinks.records || []).filter((link) =>
    !link.questionUid &&
    metaV2Text(link.grade) === grade &&
    metaV2Text(link.curriculumKey) === curriculumKey &&
    metaV2Text(link.standardUnitKey) === standardUnitKey &&
    metaV2Text(link.subUnitKey) === subUnitKey
  );
  const predictedCourse = metaV2MiddleCourseKey(
    standardUnitKey,
    current.courseKey || row.course || "",
  );
  const courseMatches = candidates.filter(
    (link) => metaV2Text(link.courseKey) === predictedCourse,
  );
  if (courseMatches.length) candidates = courseMatches;
  if (row.rpmPath) {
    const semantic = candidates.filter((link) =>
      metaV2LabelKey(link.L1) === metaV2LabelKey(row.rpmPath.majorUnit) &&
      metaV2LabelKey(link.L2) === metaV2LabelKey(row.rpmPath.midUnit)
    );
    if (semantic.length) candidates = semantic;
  }
  const unique = new Map(
    candidates.map((link) => [[link.courseKey, link.L1, link.L2].join("\0"), link]),
  );
  if (unique.size === 1) return [...unique.values()][0];
  if (
    standardUnitKey === current.standardUnitKey &&
    subUnitKey === current.subUnitKey &&
    current.L1 &&
    current.L2
  ) {
    return {
      courseKey: current.courseKey || predictedCourse,
      L1: current.L1,
      L2: current.L2,
    };
  }
  if (row.rpmPath?.majorUnit && row.rpmPath?.midUnit) {
    return {
      courseKey: predictedCourse,
      L1: row.rpmPath.majorUnit,
      L2: row.rpmPath.midUnit,
    };
  }
  throw new Error(
    "META_V2 L1/L2 parent unresolved: " +
      sourceFile +
      "#" +
      row.sourceOrdinal +
      " candidates=" +
      unique.size,
  );
}
function metaV2Difficulty(row, sourceFile) {
  const difficulty = row.difficulty || {};
  const bucket = Number(difficulty.difficultyBucket);
  if (!Number.isInteger(bucket) || bucket < 1 || bucket > 5) {
    throw new Error("META_V2 invalid difficultyBucket: " + sourceFile + "#" + row.sourceOrdinal);
  }
  const confidence = metaV2Text(difficulty.difficultyConfidence);
  if (!["high", "medium", "low"].includes(confidence)) {
    throw new Error("META_V2 invalid difficultyConfidence: " + sourceFile + "#" + row.sourceOrdinal);
  }
  const boundary = metaV2Text(difficulty.difficultyBoundaryFlag || "NONE");
  if (!["NONE", "B12", "B23", "B34", "B45"].includes(boundary)) {
    throw new Error("META_V2 invalid difficultyBoundaryFlag: " + sourceFile + "#" + row.sourceOrdinal);
  }
  const legacy = metaV2Text(difficulty.legacyLevelCompatibility || "NORMAL");
  if (!["NORMAL", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT"].includes(legacy)) {
    throw new Error("META_V2 invalid legacyLevelCompatibility: " + sourceFile + "#" + row.sourceOrdinal);
  }
  return { bucket, confidence, boundary, legacy };
}
function metaV2ClearProjection(record) {
  for (const key of [
    "problemTypeKey",
    "templateKey",
    "foundationTaxonomyStatus",
    "metaFoundationStatus",
    "metaFoundationPackId",
    "metaFoundationPackVersion",
    "l3Disposition",
    "l4Disposition",
  ]) delete record[key];
}
function metaV2Active(map, key, label) {
  const row = map.get(key);
  if (!row || row.status !== "ACTIVE") {
    throw new Error("META_V2 " + label + " is not ACTIVE: " + key);
  }
  return row;
}
function materializeMetaV2Payloads() {
  const payloadRoot = path.join(root, "archive", "data", "r2e-intake");
  const payloadPaths = metaV2Walk(payloadRoot).sort((a, b) => a.localeCompare(b, "en"));
  if (!payloadPaths.length) return { status: "NO_PAYLOADS", payloads: 0, changedRecords: 0 };
  const identityBySource = new Map(
    (identity.records || []).map((row) => [
      metaV2NormalizeFile(row.sourceArchiveFile) + "#" + Number(row.sourceOrdinal),
      row,
    ]),
  );
  const metadataByUid = new Map(
    (metadata.records || []).map((row) => [row.questionUid, row]),
  );
  if (
    identityBySource.size !== (identity.records || []).length ||
    metadataByUid.size !== (metadata.records || []).length ||
    identityBySource.size !== metadataByUid.size
  ) throw new Error("META_V2 identity/metadata uniqueness or cardinality failure");

  let changedRecords = 0;
  let appliedPayloads = 0;
  let projectionReuseRows = 0;
  let projectionPendingRows = 0;
  let semanticHoldRows = 0;
  const touchedFiles = new Set();

  for (const payloadPath of payloadPaths) {
    const raw = fs.readFileSync(payloadPath);
    const payload = JSON.parse(raw.toString("utf8"));
    if (!/_META_REVIEW2_META_V2_PAYLOAD_v1$/.test(metaV2Text(payload.schemaVersion))) {
      throw new Error("META_V2 payload schema mismatch: " + payloadPath);
    }
    if (payload.certificationGeneration !== META_V2_GENERATION) {
      throw new Error("META_V2 generation mismatch: " + payloadPath);
    }
    if (!["MAIN_PRESENT_META_ONLY", "FULL_INTEGRATED_V2"].includes(payload.certificationTrack)) {
      throw new Error("META_V2 track mismatch: " + payloadPath);
    }
    if (
      payload.status !== "META_REVIEW2_METADATA_AUDITED" ||
      payload.metadataAudit !== "FULL_ALL_QUESTIONS" ||
      payload.difficultyAudit !== "FULL_ALL_QUESTIONS"
    ) throw new Error("META_V2 REVIEW2 audit markers missing: " + payloadPath);
    const count = metaV2ExpectedCount(payload.metadataAuditCount, "metadataAuditCount");
    if (metaV2ExpectedCount(payload.difficultyAuditCount, "difficultyAuditCount") !== count) {
      throw new Error("META_V2 difficulty denominator mismatch: " + payloadPath);
    }
    if (
      Number(payload.itemHoldCount || 0) !== 0 ||
      payload.contentDriftDiscovered === true
    ) throw new Error("META_V2 payload is not publish-safe: " + payloadPath);
    if (payload.compiledRuntimeMaterializationRequired === true) {
      throw new Error("META_V2 payload requires explicit runtime materialization: " + payloadPath);
    }
    if (!Array.isArray(payload.rows) || payload.rows.length !== count) {
      throw new Error("META_V2 payload row denominator mismatch: " + payloadPath);
    }
    const reviewedMs = metaV2DateMs(payload.reviewedAtKst);
    if (!Number.isFinite(reviewedMs)) {
      throw new Error("META_V2 reviewedAtKst missing/invalid: " + payloadPath);
    }
    const sourceFile = metaV2NormalizeFile(payload.sourceArchiveFile);
    const { bank, bytes } = metaV2LoadBank(sourceFile);
    if (bank.length !== count) {
      throw new Error("META_V2 source denominator mismatch: " + sourceFile);
    }
    const expectedBlob = [
      payload.sourceExamBlobSha,
      payload.inputExamBlobSha,
      payload.sourceExamBlobSha1,
    ].find((value) => /^[0-9a-f]{40}$/.test(metaV2Text(value)));
    if (!expectedBlob) {
      throw new Error("META_V2 reviewed source blob proof missing: " + payloadPath);
    }
    if (gitBlobSha(bytes) !== expectedBlob) {
      throw new Error("META_V2 frozen source blob drift: " + sourceFile);
    }
    const payloadSha = hash(raw);
    const payloadRel = path.relative(root, payloadPath).replace(/\\/g, "/");
    const ordinals = new Set();
    let payloadChanged = 0;

    for (const row of payload.rows) {
      const ordinal = Number(row.sourceOrdinal);
      if (
        !Number.isInteger(ordinal) ||
        ordinal < 1 ||
        ordinal > count ||
        ordinals.has(ordinal)
      ) throw new Error("META_V2 invalid/duplicate sourceOrdinal: " + payloadRel);
      ordinals.add(ordinal);
      const identityRow = identityBySource.get(sourceFile + "#" + ordinal);
      if (!identityRow) {
        throw new Error("META_V2 canonical identity missing: " + sourceFile + "#" + ordinal);
      }
      const current = metadataByUid.get(identityRow.questionUid);
      if (!current) throw new Error("META_V2 metadata UID missing: " + identityRow.questionUid);
      if (
        metaV2NormalizeFile(current.sourceArchiveFile) !== sourceFile ||
        Number(current.sourceOrdinal) !== ordinal
      ) throw new Error("META_V2 metadata/source join mismatch: " + identityRow.questionUid);
      const fingerprint = metaV2SourceFingerprint(bank[ordinal - 1]);
      const identityFingerprintStale =
        Boolean(identityRow.sourceFingerprint) && identityRow.sourceFingerprint !== fingerprint;
      const metadataFingerprintStale =
        Boolean(current.sourceFingerprint) && current.sourceFingerprint !== fingerprint;

      const priorMs = metaV2DateMs(current.metaV2ReviewedAtKst);
      if (Number.isFinite(priorMs) && priorMs > reviewedMs) continue;
      if (Number.isFinite(priorMs) && priorMs === reviewedMs) {
        if (
          current.metaV2PayloadSha256 &&
          current.metaV2PayloadSha256 !== payloadSha
        ) throw new Error("META_V2 same-time payload collision: " + identityRow.questionUid);
        if (current.metaV2PayloadSha256 === payloadSha) continue;
      }

      const parent = metaV2ResolveParent(row, current, sourceFile);
      const difficulty = metaV2Difficulty(row, sourceFile);
      const next = { ...current };
      next.curriculum = metaV2Text(row.curriculum || current.curriculum || current.curriculumKey);
      next.curriculumKey = next.curriculum;
      next.courseKey = metaV2Text(
        parent.courseKey ||
          metaV2MiddleCourseKey(row.standardUnitKey, current.courseKey || row.course || ""),
      );
      next.standardCourse = metaV2Text(
        row.course ||
          current.standardCourse ||
          (metaV2Grade(sourceFile) ? metaV2Grade(sourceFile) + " 수학" : next.courseKey),
      );
      next.standardUnitKey = metaV2Text(row.standardUnitKey || current.standardUnitKey);
      next.subUnitKey = metaV2Text(row.subUnitKey || current.subUnitKey);
      next.standardUnit = metaV2Text(parent.L1 || current.standardUnit || row.rpmPath?.majorUnit);
      next.subUnit = metaV2Text(parent.L2 || current.subUnit || row.rpmPath?.midUnit);
      next.L1 = metaV2Text(parent.L1);
      next.L2 = metaV2Text(parent.L2);
      next.primaryMethod = metaV2Text(row.primaryMethod);
      next.decisiveStep = metaV2Text(row.decisiveStep);
      next.rpmRecordId = row.rpmRecordId || null;
      next.rpmPrimaryPath = row.rpmPath || null;
      next.rpmSemanticStatus = metaV2Text(row.semanticStatus || "HOLD");
      next.projectionStatus = metaV2Text(row.projectionStatus || "NOT_ATTEMPTED");
      next.mappingStatus = row.mappingStatus || null;
      next.crossConceptKeys = Array.isArray(row.crossConceptKeys) ? [...row.crossConceptKeys] : [];
      next.conditionKeys = Array.isArray(row.conditionKeys) ? [...row.conditionKeys] : [];
      for (const key of next.crossConceptKeys) {
        if (!foundationCrossConcepts.has(key)) {
          throw new Error("META_V2 inactive CrossConcept: " + key + " @ " + identityRow.questionUid);
        }
      }
      for (const key of next.conditionKeys) {
        if (!foundationConditionKeys.has(key)) {
          throw new Error("META_V2 inactive Condition: " + key + " @ " + identityRow.questionUid);
        }
      }
      next.integrationPattern = metaV2Text(row.integrationPattern || "NONE") || "NONE";
      if (row.category !== undefined) next.category = row.category;
      if (Array.isArray(row.tags)) next.tags = [...row.tags];
      next.difficultyBucket = difficulty.bucket;
      next.difficultyConfidence = difficulty.confidence;
      next.difficultyBoundaryFlag = difficulty.boundary;
      next.legacyLevelCompatibility = difficulty.legacy;
      next.curriculumApplicability = "DEFAULT_SCOPE";
      next.defaultSelectable = true;
      next.reviewStatus = "reviewed_pass";
      next.metadataStatus = "approved_meta_v2_review2";
      next.tagConfidence = "independent_review2";
      next.tagStatus = "reviewed_pass";
      next.sourceFingerprint = fingerprint;
      next.metaV2PayloadPath = payloadRel;
      next.metaV2PayloadSha256 = payloadSha;
      next.metaV2ReviewedAtKst = payload.reviewedAtKst;
      next.metaV2CertificationGeneration = payload.certificationGeneration;
      next.metaV2CertificationTrack = payload.certificationTrack;
      next.metaV2CanonicalOrdinal = payload.canonicalOrdinal;
      next.metaV2SourceFingerprintReconciled =
        identityFingerprintStale || metadataFingerprintStale;
      next.metadataRevision =
        "meta-v2:" +
        payload.certificationGeneration +
        ":review2:" +
        payloadSha.slice(0, 12);

      if (row.semanticStatus === "FINAL" && row.rpmPath?.l3 && row.rpmPath?.l4) {
        next.L3 = row.rpmPath.l3;
        next.L4 = row.rpmPath.l4;
        next.semanticDisposition = "RPM_SEMANTIC_FINAL";
        next.metaFoundationHoldReason = null;
      } else {
        delete next.L3;
        delete next.L4;
        next.semanticDisposition = "META_CANONICAL_HOLD";
        next.metaFoundationHoldReason =
          row.holdReason ||
          payload.metadataCanonicalHoldReasons?.[row.questionUid] ||
          "RPM_SEMANTIC_HOLD";
        semanticHoldRows += 1;
      }

      if (
        row.projectionStatus === "PROJECTION_REUSE" &&
        row.problemTypeKey &&
        row.templateKey
      ) {
        const l3 = metaV2Active(metaV2ProblemTypes, row.problemTypeKey, "problemTypeKey");
        const l4 = metaV2Active(foundationTemplates, row.templateKey, "templateKey");
        if (l4.parentProblemTypeKey !== l3.problemTypeKey) {
          throw new Error("META_V2 template parent mismatch: " + identityRow.questionUid);
        }
        const ownerPack = metaV2Text(row.ownerPack || l3.ownerPack || l4.ownerPack);
        const pack = metaV2ActivePacks.get(ownerPack);
        if (!pack) throw new Error("META_V2 projection owner pack is not ACTIVE: " + ownerPack);
        const bindingKey = [
          next.curriculumKey,
          next.standardUnitKey,
          next.subUnitKey,
          row.problemTypeKey,
        ].join("\0");
        if (!foundationBindingKeys.has(bindingKey)) {
          throw new Error(
            "META_V2 PROJECTION_REUSE requires exact ACTIVE binding: " +
              identityRow.questionUid,
          );
        }
        next.problemTypeKey = row.problemTypeKey;
        next.templateKey = row.templateKey;
        next.foundationTaxonomyStatus = "CONFIRMED";
        next.metaFoundationStatus = "ACTIVE";
        next.metaFoundationPackId = ownerPack;
        next.metaFoundationPackVersion = pack.version;
        next.l3Disposition = "ASSIGNED";
        next.l4Disposition = "ASSIGNED";
        delete next.projectionProblemTypeKey;
        delete next.projectionTemplateKey;
        delete next.projectionOwnerPack;
        projectionReuseRows += 1;
      } else {
        metaV2ClearProjection(next);
        if (row.problemTypeKey) next.projectionProblemTypeKey = row.problemTypeKey;
        else delete next.projectionProblemTypeKey;
        if (row.templateKey) next.projectionTemplateKey = row.templateKey;
        else delete next.projectionTemplateKey;
        if (row.ownerPack) next.projectionOwnerPack = row.ownerPack;
        else delete next.projectionOwnerPack;
        if (row.semanticStatus !== "HOLD") projectionPendingRows += 1;
      }

      next.fieldStatus = {
        ...(current.fieldStatus || {}),
        standardUnit: "approved_review2_meta_v2",
        subUnit: "approved_review2_meta_v2",
        concept:
          row.semanticStatus === "FINAL"
            ? "approved_review2_meta_v2"
            : "semantic_hold_meta_v2",
        problemType:
          row.projectionStatus === "PROJECTION_REUSE"
            ? "approved_review2_meta_v2"
            : "projection_pending_meta_v2",
        template:
          row.projectionStatus === "PROJECTION_REUSE"
            ? "approved_review2_meta_v2"
            : "projection_pending_meta_v2",
        crossConcept: "approved_review2_meta_v2",
        condition: "approved_review2_meta_v2",
        integrationPattern: "approved_review2_meta_v2",
        difficulty: "approved_review2_meta_v2",
      };
      next.approvalEvidence = [
        ...new Set([...(current.approvalEvidence || []), payloadRel]),
      ];

      if (!metaV2Equal(current, next)) {
        const index = metadata.records.findIndex(
          (record) => record.questionUid === identityRow.questionUid,
        );
        metadata.records[index] = next;
        metadataByUid.set(identityRow.questionUid, next);
        changedRecords += 1;
        payloadChanged += 1;
        touchedFiles.add(sourceFile);
      }
    }
    if (ordinals.size !== count) {
      throw new Error("META_V2 payload ordinals incomplete: " + payloadRel);
    }
    if (payloadChanged) appliedPayloads += 1;
  }

  metadata.counts = { ...(metadata.counts || {}) };
  metadata.counts.records = metadata.records.length;
  metadata.counts.uidUnique =
    new Set(metadata.records.map((row) => row.questionUid)).size === metadata.records.length;
  metadata.counts.sourceJoinUnique =
    new Set(
      metadata.records.map(
        (row) =>
          metaV2NormalizeFile(row.sourceArchiveFile) + "#" + Number(row.sourceOrdinal),
      ),
    ).size === metadata.records.length;
  metadata.counts.semanticallyReviewed = metadata.records.filter(
    (row) =>
      row.reviewStatus === "reviewed_pass" ||
      [
        "approved_semantic_review",
        "approved_exam_meta_source",
        "approved_meta_v2_review2",
      ].includes(row.metadataStatus),
  ).length;
  metadata.counts.explicitProblemTypeHolds = metadata.records.filter(
    (row) => row.fieldStatus?.problemType === "manual_review_pending",
  ).length;
  metadata.counts.explicitTemplateHolds = metadata.records.filter(
    (row) => row.fieldStatus?.template === "manual_review_pending",
  ).length;
  metadata.counts.explicitDifficultyHolds = metadata.records.filter(
    (row) => row.fieldStatus?.difficulty === "manual_review_pending",
  ).length;
  metadata.reviewedPassCount = metadata.records.filter(
    (row) => row.reviewStatus === "reviewed_pass",
  ).length;
  metadata.metaV2Materialization = {
    schemaVersion: "archive-meta-v2-materialization-v1",
    certificationGeneration: META_V2_GENERATION,
    payloadCount: payloadPaths.length,
    materializedRecordCount: metadata.records.filter((row) =>
      metaV2Text(row.metadataRevision).startsWith("meta-v2:"),
    ).length,
    latestReviewedAtKst:
      metadata.records
        .map((row) => row.metaV2ReviewedAtKst)
        .filter(Boolean)
        .sort()
        .at(-1) || null,
    policy: "META_V2_REVIEW2_SIDECAR_OVERRIDES_STALE_RUNTIME",
  };
  delete metadata.digest;
  metadata.digest = hash(JSON.stringify(metadata));

  const metadataTarget = path.join(root, "archive", "data", "question_metadata.json");
  const actual = fs.readFileSync(metadataTarget, "utf8").replace(/\r\n/g, "\n");
  const expected = JSON.stringify(metadata, null, 2) + "\n";
  const changed = actual !== expected;
  if (process.argv.includes("--check") && changed) {
    throw new Error(
      "META_V2 question_metadata projection is stale: " +
        changedRecords +
        " record(s) require materialization",
    );
  }
  if (changed && !process.argv.includes("--check")) {
    fs.writeFileSync(metadataTarget, expected, "utf8");
  }
  return {
    status: changed ? "UPDATED" : "NO_CHANGE",
    payloads: payloadPaths.length,
    appliedPayloads,
    changedRecords,
    touchedExamFiles: touchedFiles.size,
    projectionReuseRows,
    projectionPendingRows,
    semanticHoldRows,
    metadataDigest: metadata.digest,
  };
}
const metaV2Materialization = materializeMetaV2Payloads();
if (process.argv.includes("--materialize-meta-v2-only")) {
  console.log(JSON.stringify(metaV2Materialization, null, 2));
  process.exit(0);
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
    const directNode = validJoin && paths.get(core.pathKey(meta));
    const foundationScoped = meta?.metadataRevision?.startsWith("meta-foundation:");
    const metaV2Scoped = meta?.metadataRevision?.startsWith("meta-v2:");
    const reviewedSemanticScoped = foundationScoped || metaV2Scoped;
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
      if (!reviewedSemanticScoped && foundationProjectionFields.has(field)) continue;
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
      sourceIntegrityStatus: identityStatus === "VERIFIED" ? "VERIFIED" : "UNRESOLVED",
      sourceFingerprint: fingerprint,
      rawQuestionHash: hash(JSON.stringify(question)),
      approvedSourceFingerprint: meta?.sourceFingerprint || "",
      sourceStatus:
        validJoin && meta.sourceFingerprint === fingerprint
          ? "VERIFIED"
          : "HOLD",
      taxonomyStatus: node && foundationValid !== false ? "CONFIRMED" : "UNKNOWN",
      ...(foundationScoped
        ? { foundationTaxonomyStatus: meta?.foundationTaxonomyStatus === "HOLD" ? "HOLD" : (foundationValid === true ? "CONFIRMED" : (meta?.foundationTaxonomyStatus || "HOLD")) }
        : metaV2Scoped && meta?.foundationTaxonomyStatus
          ? { foundationTaxonomyStatus: meta.foundationTaxonomyStatus }
          : {}),
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
    const sourceParent = sourceScope(question, exam);
    for (const field of core.PATH_FIELDS.slice(0, 4))
      if (!record[field] && sourceParent[field]) record[field] = sourceParent[field];
    for (const field of ["reviewStatus", "sourceQualityDisposition", "sourceIssueHold",
      "sourceDefectCandidate", "basicSemanticDisposition", "semanticDisposition"])
      if (record[field] === undefined && question[field] !== undefined) record[field] = question[field];
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
  const actual = fs.existsSync(target)
    ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n")
    : null;
  const expected = JSON.stringify(packed) + "\n";
  if (
    actual === null ||
    actual !== expected
  )
    throw new Error("Archive 2.0 catalog projection is stale");
} else fs.writeFileSync(target, JSON.stringify(packed) + "\n");
console.log(JSON.stringify({ indexVersion, ...catalog.health }, null, 2));
