import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const core = require("../archive2-core.js");
const source = require("../archive2-source.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportDate = "20261001";
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const normalizeSource = value => String(value).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const normalizeFile = value => core.normalizeFile(value);
const parentKey = row => [
  row.grade || row.sourceGrade || "",
  row.curriculumKey || "",
  core.normalizeCourseIdentity(row.courseKey),
  String(row.L1 || "").normalize("NFC").replace(/\s+/g, ""),
  String(row.L2 || "").normalize("NFC").replace(/\s+/g, ""),
].join("\u0000");

function uniqueRecordMap(rows = []) {
  const map = new Map();
  let duplicateRows = 0;
  for (const row of rows) {
    const uid = String(row?.questionUid || "");
    if (!uid) continue;
    if (map.has(uid)) duplicateRows++;
    else map.set(uid, row);
  }
  return { map, duplicateRows };
}

function assignmentFailureGroups(basicReasons = [], eligibilityReasons = []) {
  const reasons = new Set([...basicReasons, ...eligibilityReasons]);
  const groups = [];
  if (["SOURCE_GRADE_CONFLICT", "SOURCE_GRADE_UNRESOLVED"].some(reason => reasons.has(reason))) groups.push("source_grade");
  if (["source_identity_unverified", "source_identity_conflict"].some(reason => reasons.has(reason)) || reasons.has("identity")) groups.push("source_identity");
  if (reasons.has("source")) groups.push("source_integrity");
  if (reasons.has("source_release")) groups.push("source_release");
  if (reasons.has("course_namespace_invalid")) groups.push("course_namespace");
  if (["assignment_missing", "assignment_conflict", "assignment_identity_mismatch", "assignment_fingerprint_mismatch",
    "assignment_not_approved", "assignment_review_evidence_missing", "assignment_taxonomy_version_mismatch",
    "assignment_target_mismatch"].some(reason => reasons.has(reason))) groups.push("assignment_evidence");
  if (reasons.has("canonical_parent_missing")) groups.push("canonical_parent");
  if (["review", "assignment"].some(reason => reasons.has(reason))) groups.push("review_hold");
  if (["semantic", "conflict"].some(reason => reasons.has(reason))) groups.push("semantic_or_metadata_hold");
  if (["solution", "source_issue"].some(reason => reasons.has(reason))) groups.push("source_quality_hold");
  if (["applicability", "default_selectable"].some(reason => reasons.has(reason))) groups.push("scope_policy");
  return groups;
}

function primaryReason(groups, missingProjection = false) {
  if (missingProjection) return "final_projection_missing";
  const order = [
    "source_grade", "source_identity", "source_integrity", "source_release", "source_quality_hold",
    "semantic_or_metadata_hold", "review_hold", "scope_policy", "assignment_evidence",
    "course_namespace", "canonical_parent",
  ];
  return order.find(reason => groups.includes(reason)) || groups[0] || "unknown_gate";
}

function groupCounts(rows, keyOf) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyOf(row) || "UNRESOLVED";
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  return [...groups].map(([key, questionCount]) => ({ key, questionCount }))
    .sort((a, b) => a.key.localeCompare(b.key, "ko"));
}

export function createImpactReport({
  sourceRows = [],
  builtCatalog = { records: [] },
  finalCatalog = { records: [], canonicalAuthority: {} },
  inputIntegrity = {},
  generatedAt = new Date().toISOString(),
} = {}) {
  const raw = uniqueRecordMap(sourceRows);
  const built = uniqueRecordMap(builtCatalog.records || []);
  const projected = uniqueRecordMap(finalCatalog.records || []);
  const population = new Set([...raw.map.keys(), ...built.map.keys(), ...projected.map.keys()]);
  const authority = finalCatalog.canonicalAuthority || {};
  const overlaps = new Map();
  const primary = new Map();
  const uidAttribution = [];
  const gradeRows = [];
  const approvedCourses = new Map();
  const taxonomyHints = new Map();
  let basicEligibleCount = 0;
  let advancedEligibleCount = 0;
  let advancedUnavailableAmongBasic = 0;

  for (const questionUid of population) {
    const rawRow = raw.map.get(questionUid);
    const builtRow = built.map.get(questionUid);
    const finalRow = projected.map.get(questionUid);
    const basicAssignment = finalRow
      ? core.Canonical.validateBasicAssignment(finalRow, authority)
      : { ok: false, reasons: ["final_projection_missing"] };
    const gate = finalRow
      ? core.eligibility(finalRow, { canonicalAuthority: authority })
      : { ok: false, reasons: ["final_projection_missing"] };
    const advancedOk = Boolean(finalRow && core.advancedEligible(finalRow, { canonicalAuthority: authority }));
    const basicOk = Boolean(finalRow && gate.ok);
    const groups = assignmentFailureGroups(basicAssignment.reasons, gate.reasons);
    if (!finalRow) groups.push("final_projection_missing");
    const isSourcePopulation = raw.map.has(questionUid);
    const assignmentList = authority.assignmentsByUid?.[questionUid] || [];
    const assignmentStore = assignmentList.length === 1 ? assignmentList[0].store || "" : "";
    let assignmentEntryStage = "no_approved_assignment";
    if (rawRow?.rawDirectCanonicalAssignment) assignmentEntryStage = "raw_source_assignment";
    else if (assignmentStore === "approved_item_override") assignmentEntryStage = "reviewed_runtime_item_override";
    else if (builtRow?.assignmentEvidence) assignmentEntryStage = "catalog_builder_assignment_evidence";
    else if (builtRow?.unverifiedTaxonomy || builtRow?.L1 || builtRow?.L2)
      assignmentEntryStage = "catalog_builder_unverified_hint";

    const gradeStatus = finalRow?.sourceGradeStatus || builtRow?.sourceGradeStatus || "";
    const recordGrade = gradeStatus && gradeStatus !== "VALID"
      ? "UNRESOLVED"
      : finalRow?.sourceGrade || builtRow?.sourceGrade || rawRow?.sourceGrade || "UNRESOLVED";
    if (isSourcePopulation) gradeRows.push({ grade: recordGrade });
    if (basicAssignment.ok) {
      const parent = basicAssignment.parent;
      const key = [parent.grade, parent.curriculumKey, parent.courseKey].join(" | ");
      approvedCourses.set(key, (approvedCourses.get(key) || 0) + 1);
    } else {
      const hint = builtRow?.unverifiedTaxonomy || {};
      const hintCourse = hint.courseKey || hint.standardCourse || "";
      const hintKey = [recordGrade, hint.curriculumKey || "", hintCourse].join(" | ");
      if (hintCourse) taxonomyHints.set(hintKey, (taxonomyHints.get(hintKey) || 0) + 1);
    }

    for (const reason of groups) overlaps.set(reason, (overlaps.get(reason) || new Set()).add(questionUid));
    if (isSourcePopulation && !basicOk) {
      const reason = primaryReason(groups, !finalRow);
      primary.set(reason, (primary.get(reason) || new Set()).add(questionUid));
    }
    if (isSourcePopulation && basicOk) basicEligibleCount++;
    if (isSourcePopulation && advancedOk) advancedEligibleCount++;
    if (isSourcePopulation && basicOk && !advancedOk) advancedUnavailableAmongBasic++;
    uidAttribution.push({
      questionUid,
      sourceFile: rawRow?.sourceFile || builtRow?.sourceFile || finalRow?.sourceFile || "",
      sourceOrdinal: Number(rawRow?.sourceOrdinal || builtRow?.sourceOrdinal || finalRow?.sourceOrdinal || 0),
      rawSourcePresent: Boolean(rawRow),
      builtCatalogPresent: Boolean(builtRow),
      finalProjectionPresent: Boolean(finalRow),
      sourceGrade: recordGrade,
      gradeStatus,
      assignmentEntryStage,
      assignmentStore,
      basicEligible: basicOk,
      advancedEligible: advancedOk,
      basicAssignmentReasons: basicAssignment.reasons,
      eligibilityReasons: gate.reasons,
      primaryExclusionReason: isSourcePopulation && !basicOk ? primaryReason(groups, !finalRow) : "",
    });
  }
  uidAttribution.sort((a, b) => a.questionUid.localeCompare(b.questionUid));
  const sourceUids = raw.map.size;
  const excludedUids = [...raw.map.keys()].filter(uid => !projected.map.has(uid) ||
    !core.eligibility(projected.map.get(uid), { canonicalAuthority: authority }).ok);
  const assignmentStages = {};
  for (const row of uidAttribution)
    assignmentStages[row.assignmentEntryStage] = (assignmentStages[row.assignmentEntryStage] || 0) + 1;
  const overlapCounts = Object.fromEntries([...overlaps].sort(([a], [b]) => a.localeCompare(b)).map(([key, set]) => [key, set.size]));
  const primaryCounts = Object.fromEntries([...primary].sort(([a], [b]) => a.localeCompare(b)).map(([key, set]) => [key, set.size]));
  const primaryTotal = Object.values(primaryCounts).reduce((sum, count) => sum + count, 0);
  if (primaryTotal !== excludedUids.length)
    throw new Error(`Primary impact reasons do not partition exclusions: ${primaryTotal} != ${excludedUids.length}`);

  return {
    schemaVersion: "archive2-canonical-impact-v1",
    generatedAt,
    projectionVersion: finalCatalog.indexVersion || finalCatalog.canonicalProjectionVersion || "",
    taxonomyVersion: authority.taxonomyVersion || "",
    definition: {
      population: "Unique questionUid in actual parsed source payloads.",
      sourceAndStageTotals: "Unique questionUid counts; duplicated input rows are recorded separately.",
      overlappingReasonCounts: "Unique UID counts per reason; one UID may appear in several reasons.",
      primaryReasonCounts: "Mutually exclusive; order is grade, identity, source integrity, approved release fingerprint, source quality, semantic/review, scope policy, assignment evidence, namespace, then canonical parent.",
    },
    totals: {
      rawSourceQuestions: sourceRows.length,
      uniqueRawSourceUids: sourceUids,
      rawDuplicateUidRows: raw.duplicateRows,
      uniqueBuiltCatalogUids: built.map.size,
      builtCatalogDuplicateUidRows: built.duplicateRows,
      uniqueFinalProjectionUids: projected.map.size,
      finalProjectionDuplicateUidRows: projected.duplicateRows,
      eligibleBasicUids: basicEligibleCount,
      eligibleAdvancedUids: advancedEligibleCount,
      basicEligibleButAdvancedUnavailableUids: advancedUnavailableAmongBasic,
      excludedBasicUids: excludedUids.length,
      primaryReasonTotal: primaryTotal,
    },
    inputIntegrity,
    gradeCounts: groupCounts(gradeRows, row => row.grade),
    approvedCurriculumCourseCounts: [...approvedCourses].map(([key, questionCount]) => ({ key, questionCount }))
      .sort((a, b) => a.key.localeCompare(b.key, "ko")),
    unverifiedTaxonomyHintCounts: [...taxonomyHints].map(([key, questionCount]) => ({ key, questionCount }))
      .sort((a, b) => a.key.localeCompare(b.key, "ko")),
    assignmentEntryStageCounts: assignmentStages,
    overlappingExclusionReasonCounts: overlapCounts,
    primaryExclusionReasonCounts: primaryCounts,
    uidAttribution,
  };
}

export function renderImpactMarkdown(report) {
  const table = rows => rows.length
    ? rows.map(row => `| ${row.key.replace(/\|/g, "\\|")} | ${row.questionCount} |`).join("\n")
    : "| (없음) | 0 |";
  const stages = Object.entries(report.assignmentEntryStageCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `| ${key} | ${count} |`).join("\n") || "| (없음) | 0 |";
  const reasons = entries => Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `| ${key} | ${count} |`).join("\n") || "| (없음) | 0 |";
  return `# Archive 2.0 Canonical Namespace Impact — ${reportDate}

- Generated: ${report.generatedAt}
- Projection: \`${report.projectionVersion}\`
- Taxonomy: \`${report.taxonomyVersion}\`

## UID totals

| Stage | Unique UID count |
| --- | ---: |
| Parsed raw source questions | ${report.totals.uniqueRawSourceUids} |
| Built catalog | ${report.totals.uniqueBuiltCatalogUids} |
| Final shared projection | ${report.totals.uniqueFinalProjectionUids} |
| BASIC selectable | ${report.totals.eligibleBasicUids} |
| ADVANCED selectable | ${report.totals.eligibleAdvancedUids} |
| BASIC exclusions | ${report.totals.excludedBasicUids} |

The source population is keyed by unique \`questionUid\`. ${report.definition.overlappingReasonCounts} ${report.definition.primaryReasonCounts}

## Actual source grades

| Grade | Unique source UIDs |
| --- | ---: |
${table(report.gradeCounts)}

## Approved assignments by curriculum and course

| Grade / curriculum / course | Unique assigned UIDs |
| --- | ---: |
${table(report.approvedCurriculumCourseCounts)}

## Unverified taxonomy hints

These catalog hints are retained for audit and do not create selectable scopes.

| Grade / curriculum / hinted course | Unique UIDs |
| --- | ---: |
${table(report.unverifiedTaxonomyHintCounts)}

## Assignment entry stage

| Stage | UID count |
| --- | ---: |
${stages}

## Exclusion reasons

Overlapping reason counts:

| Reason | Unique UIDs |
| --- | ---: |
${reasons(report.overlappingExclusionReasonCounts)}

Mutually exclusive primary reasons:

| Primary reason | Unique UIDs |
| --- | ---: |
${reasons(report.primaryExclusionReasonCounts)}

Primary-reason total: ${report.totals.primaryReasonTotal} of ${report.totals.excludedBasicUids} excluded UIDs.

## Input integrity

| Input check | Count |
| --- | ---: |
| Source files | ${report.inputIntegrity.sourceFileCount ?? 0} |
| Parsed source questions | ${report.inputIntegrity.rawQuestionCount ?? 0} |
| Source digest failures | ${report.inputIntegrity.sourceDigestFailures?.length ?? 0} |
| Raw question hash mismatches | ${report.inputIntegrity.rawQuestionHashMismatches ?? 0} |
| Unregistered raw questions | ${report.inputIntegrity.unregisteredRawQuestions ?? 0} |

The JSON companion contains per-UID attribution and detailed validation reasons.
`;
}

export function serializeImpactReport(report) {
  const uidAttributionFields = [
    "rawSourcePresent", "builtCatalogPresent", "finalProjectionPresent", "sourceFile", "sourceOrdinal",
    "sourceGrade", "gradeStatus", "assignmentEntryStage", "assignmentStore", "basicEligible",
    "advancedEligible", "primaryExclusionReason", "basicAssignmentReasons", "eligibilityReasons",
  ];
  const uidAttributionByUid = Object.fromEntries((report.uidAttribution || []).map(row => [
    row.questionUid,
    [
      row.rawSourcePresent ? "1" : "0",
      row.builtCatalogPresent ? "1" : "0",
      row.finalProjectionPresent ? "1" : "0",
      row.sourceFile,
      row.sourceOrdinal,
      row.sourceGrade,
      row.gradeStatus,
      row.assignmentEntryStage,
      row.assignmentStore,
      row.basicEligible ? "1" : "0",
      row.advancedEligible ? "1" : "0",
      row.primaryExclusionReason,
      (row.basicAssignmentReasons || []).join(","),
      (row.eligibilityReasons || []).join(","),
    ].map(value => String(value ?? "")).join("\t"),
  ]));
  const { uidAttribution, ...summary } = report;
  return {
    ...summary,
    uidAttributionEncoding: "uidAttributionByUid values are tab-separated fields in uidAttributionFields order; boolean fields use 1/0.",
    uidAttributionFields,
    uidAttributionByUid,
  };
}

async function loadFinalCatalog(repositoryRoot = root) {
  const inputArchiveDir = path.join(repositoryRoot, "archive");
  const manifest = JSON.parse(fs.readFileSync(path.join(inputArchiveDir, "data/archive2-canonical-input-manifest.json"), "utf8"));
  const resources = {};
  const files = {};
  for (const entry of manifest.files || []) {
    const file = path.resolve(inputArchiveDir, entry.path);
    const relative = path.relative(repositoryRoot, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`manifest path escaped repository: ${entry.path}`);
    const bytes = Buffer.from(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n"), "utf8");
    const actual = sha256(bytes);
    if (actual !== entry.sha256) throw new Error(`canonical input digest mismatch: ${entry.path}`);
    resources[entry.path] = JSON.parse(bytes.toString("utf8"));
    files[entry.path] = { sha256: actual };
  }
  const projectionVersion = await core.Canonical.computeProjectionVersion(manifest.files, manifest.resolverVersion);
  if (projectionVersion !== manifest.projectionVersion) throw new Error("canonical input manifest projection version mismatch");
  const versionBundle = { manifest, projectionVersion, files, resources };
  return core.Canonical.resolveCatalog({ versionBundle });
}

export async function buildImpactReport({ repositoryRoot = root, generatedAt } = {}) {
  const builtCatalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(repositoryRoot, "archive/data/archive2-catalog.json"), "utf8")));
  const finalCatalog = await loadFinalCatalog(repositoryRoot);
  const identityBySource = new Map();
  for (const [uid, identity] of Object.entries(finalCatalog.canonicalAuthority.identityByUid || {}))
    identityBySource.set(`${normalizeFile(identity.sourceArchiveFile)}#${Number(identity.sourceOrdinal)}`, uid);
  const builtBySource = new Map(builtCatalog.records.map(row => [`${normalizeFile(row.sourceFile)}#${Number(row.sourceOrdinal)}`, row]));
  const sourceHashes = new Map(builtCatalog.sourceHashes || []);
  const sourceRows = [];
  const sourceDigestFailures = [];
  let rawQuestionCount = 0;
  let unregisteredRawQuestions = 0;
  let rawQuestionHashMismatches = 0;
  const files = [...sourceHashes].sort(([a], [b]) => a.localeCompare(b));
  for (const [sourceFile, expectedDigest] of files) {
    const file = path.join(repositoryRoot, "archive/exams", sourceFile);
    if (!fs.existsSync(file)) {
      sourceDigestFailures.push({ sourceFile, reason: "missing_source_file" });
      continue;
    }
    const rawText = fs.readFileSync(file, "utf8");
    const normalizedText = normalizeSource(rawText);
    if (sha256(normalizedText) !== expectedDigest)
      sourceDigestFailures.push({ sourceFile, reason: "source_digest_mismatch" });
    let bank;
    try { bank = source.evaluate(normalizedText, sourceFile); }
    catch (error) {
      sourceDigestFailures.push({ sourceFile, reason: "source_parse_failed", message: error.message });
      continue;
    }
    for (const [index, rawQuestion] of bank.entries()) {
      rawQuestionCount++;
      const sourceOrdinal = index + 1;
      const sourceKey = `${normalizeFile(sourceFile)}#${sourceOrdinal}`;
      const questionUid = identityBySource.get(sourceKey) || builtBySource.get(sourceKey)?.questionUid || "";
      if (!questionUid) {
        unregisteredRawQuestions++;
        continue;
      }
      const builtRow = builtBySource.get(sourceKey);
      const rawHashMatches = Boolean(builtRow?.rawQuestionHash && sha256(JSON.stringify(rawQuestion)) === builtRow.rawQuestionHash);
      if (!rawHashMatches) rawQuestionHashMismatches++;
      sourceRows.push({
        questionUid,
        sourceFile,
        sourceOrdinal,
        sourceGrade: finalCatalog.canonicalAuthority.examGradeByFile[normalizeFile(sourceFile)] || "UNRESOLVED",
        rawQuestionHashMatches: rawHashMatches,
        rawDirectCanonicalAssignment: Boolean(rawQuestion?.curriculumKey && rawQuestion?.courseKey && rawQuestion?.L1 && rawQuestion?.L2),
        rawLegacyTaxonomyHint: Boolean(rawQuestion?.standardUnitKey || rawQuestion?.legacyStandardUnitKey || rawQuestion?.topic),
      });
    }
  }
  const inputIntegrity = {
    sourceFileCount: files.length,
    rawQuestionCount,
    sourceDigestFailures,
    rawQuestionHashMismatches,
    unregisteredRawQuestions,
  };
  return createImpactReport({ sourceRows, builtCatalog, finalCatalog, inputIntegrity, generatedAt });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await buildImpactReport();
  const jsonPath = path.join(root, `docs/reports/archive2-canonical-namespace-impact-${reportDate}.json`);
  const markdownPath = path.join(root, `docs/reports/archive2-canonical-namespace-impact-${reportDate}.md`);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(serializeImpactReport(report), null, 2) + "\n");
  fs.writeFileSync(markdownPath, renderImpactMarkdown(report));
  console.log(JSON.stringify({
    jsonPath: path.relative(root, jsonPath),
    markdownPath: path.relative(root, markdownPath),
    ...report.totals,
    projectionVersion: report.projectionVersion,
    sourceDigestFailures: report.inputIntegrity.sourceDigestFailures.length,
    rawQuestionHashMismatches: report.inputIntegrity.rawQuestionHashMismatches,
    unregisteredRawQuestions: report.inputIntegrity.unregisteredRawQuestions,
  }, null, 2));
}
