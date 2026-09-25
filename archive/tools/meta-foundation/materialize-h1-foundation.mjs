#!/usr/bin/env node
// Materialize the accepted H1 Meta Foundation ledgers into canonical, metadata,
// evidence, and Archive 2.0 runtime structures. This script does not re-review
// source semantics; it applies the frozen 1170-item baseline, the completed
// outlier compare, and explicit latest-main source holds.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import core from "../../archive2-core.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const generatedRoot = "archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint";
const ledgerDir = `${generatedRoot}/l4-global-normalization`;
const canonicalRoot = "archive/data/meta-foundation/canonical";
const evidenceRoot = "archive/data/meta-foundation/evidence/high1/v1";
const runtimePath = "archive/data/meta-foundation/runtime/h1-foundation-v1.json";
const assignmentsPath = `${evidenceRoot}/item_metadata_assignments_1170.json`;
const reviewPath = `${ledgerDir}/H1_DIFFICULTY_OUTLIER_INDEPENDENT_REVIEW_028.jsonl`;
const comparePath = `${ledgerDir}/H1_DIFFICULTY_OUTLIER_COMPARE_028.jsonl`;
const checkpointPath = `${ledgerDir}/H1_DIFFICULTY_OUTLIER_REVIEW_CHECKPOINT.json`;
const baseDifficultyPath = `${ledgerDir}/H1_DIFFICULTY_FINAL_WORKING_1170.jsonl`;
const relationPath = `${ledgerDir}/H1_RELATIONAL_RECONCILED_1170.jsonl`;
const l3Path = `${generatedRoot}/H1_STAGE3_L3_GLOBAL_NORMALIZED_1170.jsonl`;
const l3SynthesisPath = `${generatedRoot}/H1_STAGE3_L3_SYNTHESIS_CHECKPOINT_1170.json`;
const l4Path = `${ledgerDir}/H1_L4_AFTER_PARENT_MATERIALIZATION_1170.jsonl`;
const gatePath = `${ledgerDir}/H1_NEW_L4_CANDIDATE_GATE_021.jsonl`;
const parentPath = `${ledgerDir}/H1_L4_PARENT_REASSIGNMENT_015.jsonl`;
const sourceDriftPath = `${ledgerDir}/H1_SOURCE_DRIFT_ORIGIN_MAIN_048.jsonl`;
const acceptedLedgerPath = `${ledgerDir}/H1_DIFFICULTY_ACCEPTED_FINAL_1170.jsonl`;
const acceptedDeltaPath = `${ledgerDir}/H1_DIFFICULTY_ACCEPTED_OUTLIER_DELTA_020.jsonl`;
const sourceHoldOutputPath = `${evidenceRoot}/source_drift_hold_048.jsonl`;
const sourceFingerprintSyncOutputPath = `${evidenceRoot}/source_fingerprint_sync.json`;
const packDir = `${canonicalRoot}/packs/h1-foundation`;

const sha256 = (value) => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const abs = (p) => path.join(root, p);
const readText = (p) => fs.readFileSync(abs(p), "utf8");
const readJson = (p) => JSON.parse(readText(p));
const readJsonl = (p) => readText(p).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const jsonText = (value) => JSON.stringify(value, null, 2) + "\n";
const jsonlText = (rows) => rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
const sorted = (values) => [...values].sort((a, b) => String(a).localeCompare(String(b), "en"));
const nonempty = (value) => value !== undefined && value !== null && String(value).trim() !== "";
const currentHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root }).toString("utf8").trim();
const currentBranch = execFileSync("git", ["branch", "--show-current"], { cwd: root }).toString("utf8").trim();

if (currentBranch !== "meta-foundation-h1-preprocess-sol-review") {
  throw new Error(`unexpected branch: ${currentBranch}`);
}

const requiredFiles = [
  reviewPath, comparePath, checkpointPath, baseDifficultyPath, relationPath,
  l3Path, l3SynthesisPath, l4Path, gatePath, parentPath, sourceDriftPath,
  "archive/data/question_metadata.json", "archive/data/question_identity_map.json",
  `${canonicalRoot}/registry_index.json`, `${canonicalRoot}/condition_registry.json`,
  "archive/data/meta-foundation/compiled/taxonomy_registry.json",
  "archive/data/meta-foundation/compiled/concept_registry.json",
  "archive/data/meta-foundation/compiled/condition_registry.json",
  "archive/data/meta-foundation/compiled/curriculum_bindings.json"
];
for (const p of requiredFiles) if (!fs.existsSync(abs(p))) throw new Error(`required input missing: ${p}`);

const reviewCheckpoint = readJson(checkpointPath);
const compareRows = readJsonl(comparePath);
const reviewRows = readJsonl(reviewPath);
const baselineDifficulty = readJsonl(baseDifficultyPath);
const relations = readJsonl(relationPath);
const l3Rows = readJsonl(l3Path);
const l3Synthesis = readJson(l3SynthesisPath);
const l4Rows = readJsonl(l4Path);
const gateRows = readJsonl(gatePath);
const parentRows = readJsonl(parentPath);
const sourceDriftRows = readJsonl(sourceDriftPath);
const metadataFile = readJson("archive/data/question_metadata.json");
const identityFile = readJson("archive/data/question_identity_map.json");
const metadataByUid = new Map(metadataFile.records.map((row) => [row.questionUid, row]));
const identityByUid = new Map(identityFile.records.map((row) => [row.questionUid, row]));
const comparisonByUid = new Map(compareRows.map((row) => [row.questionUid, row]));
const relationByUid = new Map(relations.map((row) => [row.questionUid, row]));
const l3ByUid = new Map(l3Rows.map((row) => [row.questionUid, row]));
const l4ByUid = new Map(l4Rows.map((row) => [row.questionUid, row]));
const sourceDriftByUid = new Map(sourceDriftRows.map((row) => [row.questionUid, row]));

if (reviewCheckpoint.status !== "INDEPENDENT_REVIEW_AND_COMPARE_COMPLETE_STOP") throw new Error("outlier checkpoint is not complete");
if (reviewCheckpoint.scope?.retainedLargeShift?.selected !== 27 || reviewCheckpoint.scope?.retainedLargeShift?.reviewed !== 27 || reviewCheckpoint.scope?.retainedLargeShift?.missing !== 0) throw new Error("retained large-shift coverage is not 27/27");
if (reviewCheckpoint.scope?.currentBucket5?.selected !== 1 || reviewCheckpoint.scope?.currentBucket5?.reviewed !== 1 || reviewCheckpoint.scope?.currentBucket5?.missing !== 0) throw new Error("Bucket 5 coverage is not 1/1");
if (baselineDifficulty.length !== 1170 || relations.length !== 1170 || l3Rows.length !== 1170 || l4Rows.length !== 1170) throw new Error("H1 input denominator is not 1170");
if (compareRows.length !== 28 || reviewRows.length !== 28 || comparisonByUid.size !== 28) throw new Error("outlier review denominator is not 28 unique UIDs");
if (sourceDriftRows.length !== 48 || sourceDriftByUid.size !== 48) throw new Error("latest-main source drift denominator is not 48 unique UIDs");

const allowedDispositions = new Set(["CONFIRM_WORKING", "RESTORE_OR_ADJUST", "BOUNDARY_HOLD", "SOURCE_HOLD"]);
const dispositionCounts = {};
const selectionReasonCounts = {};
const reviewSourceByUid = new Map(reviewRows.map((row) => [row.questionUid, row]));
for (const row of compareRows) {
  if (!allowedDispositions.has(row.disposition)) throw new Error(`invalid outlier disposition: ${row.questionUid}`);
  dispositionCounts[row.disposition] = (dispositionCounts[row.disposition] || 0) + 1;
  selectionReasonCounts[row.reviewTargetReason] = (selectionReasonCounts[row.reviewTargetReason] || 0) + 1;
  if (!reviewSourceByUid.has(row.questionUid)) throw new Error(`compare without frozen review row: ${row.questionUid}`);
}
if (selectionReasonCounts.RETAINED_LARGE_SHIFT !== 27 || selectionReasonCounts.CURRENT_BUCKET_5 !== 1 || Object.keys(selectionReasonCounts).length !== 2) throw new Error("outlier selection provenance is not 27 + 1");
if (new Set(compareRows.map((row) => row.sourceIdentity)).size !== 28) throw new Error("outlier sourceIdentity duplicate");
if ([...comparisonByUid.keys()].some((uid) => sourceDriftByUid.has(uid))) throw new Error("outlier/source-drift overlap unexpectedly exists");

const bucket5 = baselineDifficulty.filter((row) => row.difficultyBucket === 5);
if (bucket5.length !== 1) throw new Error(`expected one current Bucket 5 row, got ${bucket5.length}`);
const postCompare = reviewCheckpoint.postCompareAdjudication;
if (postCompare?.questionUid !== bucket5[0].questionUid || postCompare?.adjudicatedResult?.independentDifficultyBucket !== 4 || postCompare?.adjudicatedResult?.disposition !== "RESTORE_OR_ADJUST") {
  throw new Error("post-compare user adjudication for the current Bucket 5 target is missing or inconsistent");
}
const acceptedBucket5Uid = bucket5[0].questionUid;

const keepKeysExpected = new Set([
  "TPL_H1_POLY_DIVISION_EXECUTION",
  "TPL_H1_REMAINDER_COMPOSITE_DIVISOR",
  "TPL_H1_REMAINDER_NESTED_DIVISION",
  "TPL_H1_BINOMIAL_PARAMETER_RELATION",
  "TPL_H1_BINOMIAL_IDENTITY_CHECK",
  "TPL_H1_SELECTION_BOX_IDENTITY",
  "TPL_H1_SELECTION_GEOMETRIC_DEGENERACY",
  "TPL_H1_SELECTION_CAPACITY_DISTRIBUTION",
  "TPL_H1_COUNT_TOURNAMENT_BRACKET",
  "TPL_H1_ARRANGEMENT_LEXICOGRAPHIC_RANK"
]);
const keepGateRows = gateRows.filter((row) => row.decision === "KEEP_NEW_L4");
const noSeparateGateRows = gateRows.filter((row) => row.decision === "NO_SEPARATE_L4");
const challengeGateRows = gateRows.filter((row) => row.decision === "L3_PARENT_CHALLENGE");
const keepKeys = new Set(keepGateRows.map((row) => row.templateKeyCandidate));
const noSeparateKeys = new Set(noSeparateGateRows.map((row) => row.templateKeyCandidate));
if (keepKeys.size !== 10 || [...keepKeys].some((key) => !keepKeysExpected.has(key)) || [...keepKeysExpected].some((key) => !keepKeys.has(key))) throw new Error("KEEP_NEW_L4 materialization set differs from the accepted 10 families");
if (noSeparateGateRows.length !== 8 || challengeGateRows.length !== 3 || gateRows.length !== 21) throw new Error("L4 candidate gate family disposition counts changed");
if (keepGateRows.reduce((sum, row) => sum + row.supportingUidCount, 0) !== 60 || noSeparateGateRows.reduce((sum, row) => sum + row.supportingUidCount, 0) !== 70) throw new Error("L4 gate support counts do not match accepted provenance");

const initialWorkingByUid = new Map(baselineDifficulty.map((row) => [row.questionUid, row]));
const finalDifficultyByUid = new Map();
const outlierDelta = [];
const acceptedDifficultyRows = [];
for (const row of baselineDifficulty) {
  const comparison = comparisonByUid.get(row.questionUid);
  const sourceDrift = sourceDriftByUid.get(row.questionUid);
  const final = { ...row, currentWorkingBucket: row.difficultyBucket };
  let holdReason = null;
  if (comparison) {
    final.reviewTargetReason = comparison.reviewTargetReason;
    final.outlierDisposition = comparison.disposition;
    final.independentDifficultyBucket = comparison.independentDifficultyBucket;
    final.currentWorkingBucket = comparison.currentFinalWorkingBucket;
    if (comparison.disposition === "RESTORE_OR_ADJUST") {
      final.difficultyBucket = comparison.independentDifficultyBucket;
      final.difficultyReason = comparison.dispositionReason;
      final.difficultyConfidence = comparison.semanticConfidence;
      final.difficultyBoundaryFlag = comparison.difficultyBoundaryFlag;
      final.semanticConfidence = comparison.semanticConfidence;
      final.reviewStatus = "reviewed_pass";
    } else if (comparison.disposition === "BOUNDARY_HOLD") {
      final.difficultyBucket = "UNKNOWN";
      final.difficultyConfidence = "UNKNOWN";
      final.legacyLevelCompatibility = "UNKNOWN";
      final.reviewStatus = "HOLD";
      holdReason = "DIFFICULTY_BOUNDARY_HOLD";
      final.difficultyHoldReason = comparison.dispositionReason;
    } else if (comparison.disposition === "SOURCE_HOLD") {
      final.difficultyBucket = "UNKNOWN";
      final.difficultyConfidence = "UNKNOWN";
      final.difficultyBoundaryFlag = "UNKNOWN";
      final.legacyLevelCompatibility = "UNKNOWN";
      final.reviewStatus = "HOLD";
      final.sourceIssue = comparison.sourceIssue || "SOURCE_OR_SOLUTION_DEFECT";
      final.sourceIssueHold = true;
      final.sourceHoldReason = "INDEPENDENT_OUTLIER_SOURCE_HOLD";
      holdReason = "DIFFICULTY_SOURCE_HOLD";
      final.difficultyHoldReason = comparison.dispositionReason;
    } else {
      final.reviewStatus = "reviewed_pass";
    }
    if (row.questionUid === acceptedBucket5Uid) {
      final.difficultyBucket = postCompare.adjudicatedResult.independentDifficultyBucket;
      final.difficultyConfidence = postCompare.adjudicatedResult.semanticConfidence;
      final.difficultyBoundaryFlag = postCompare.adjudicatedResult.difficultyBoundaryFlag;
      final.difficultyReason = postCompare.adjudicatedResult.rationale;
      final.reviewStatus = "reviewed_pass";
      final.postCompareAdjudication = "TIMED_CASEWORKLOAD_ADJUSTMENT_BUCKET_4";
      holdReason = null;
    }
  }
  if (sourceDrift) {
    final.difficultyBucket = "UNKNOWN";
    final.difficultyConfidence = "UNKNOWN";
    final.difficultyBoundaryFlag = "UNKNOWN";
    final.legacyLevelCompatibility = "UNKNOWN";
    final.reviewStatus = "HOLD";
    final.sourceIssue = "SOURCE_CHANGED_AFTER_ACCEPTED_H1_BASELINE";
    final.sourceIssueHold = true;
    final.sourceHoldReason = "LATEST_MAIN_SOURCE_CHANGED_NO_REVIEW_AUTHORIZED";
    holdReason = "SOURCE_DRIFT_ORIGIN_MAIN";
  }
  if (final.difficultyBucket === "UNKNOWN" && !holdReason) {
    final.reviewStatus = "HOLD";
    final.legacyLevelCompatibility = "UNKNOWN";
    holdReason = "PREEXISTING_DIFFICULTY_UNKNOWN";
  }
  if (holdReason) final.difficultyHoldReasonCode = holdReason;
  final.acceptedDifficultyBucket = final.difficultyBucket;
  final.sourceDrift = Boolean(sourceDrift);
  final.sourceFingerprintAtWorkingBaseline = row.sourceFingerprint;
  if (comparison && comparison.disposition !== "CONFIRM_WORKING") {
    outlierDelta.push({
      questionUid: row.questionUid,
      sourceIdentity: row.sourceIdentity,
      reviewTargetReason: comparison.reviewTargetReason,
      disposition: comparison.disposition,
      currentWorkingBucket: comparison.currentFinalWorkingBucket,
      independentDifficultyBucket: comparison.independentDifficultyBucket,
      acceptedDifficultyBucket: final.difficultyBucket,
      difficultyBoundaryFlag: final.difficultyBoundaryFlag,
      semanticConfidence: final.semanticConfidence || final.difficultyConfidence,
      difficultyHoldReasonCode: final.difficultyHoldReasonCode || null,
      rationale: final.difficultyReason || final.difficultyHoldReason || comparison.dispositionReason
    });
  }
  finalDifficultyByUid.set(row.questionUid, final);
  acceptedDifficultyRows.push(final);
}
if (outlierDelta.length !== 20) throw new Error(`expected 20 non-confirming outlier disposition rows, got ${outlierDelta.length}`);

const driftOut = sourceDriftRows.map((row) => ({
  ...row,
  finalHandling: "EXPLICIT_SOURCE_HOLD_NO_REVIEW",
  finalDifficultyBucket: "UNKNOWN",
  runtimeSelectable: false
}));
const semanticDriftCount = sourceDriftRows.filter((row) => row.acceptedSemanticInputChanged === true).length;
if (semanticDriftCount !== 47 || sourceDriftRows.filter((row) => row.acceptedSemanticInputChanged !== true).length !== 1) throw new Error("latest-main source drift input-field breakdown changed");

// Verify all source questions directly from the current repository source before writing.
const dbContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
dbContext.globalThis = dbContext;
vm.createContext(dbContext);
vm.runInContext(readText("archive/db.js"), dbContext, { filename: "archive/db.js", timeout: 3000 });
const exams = dbContext.window.mainDB?.exams;
if (!Array.isArray(exams)) throw new Error("archive db.js did not expose mainDB.exams");
const sourceByIdentity = new Map();
for (const exam of exams) {
  const sourceFile = core.normalizeFile(exam.file);
  const sourcePath = `archive/exams/${sourceFile}`;
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(readText(sourcePath), context, { filename: sourcePath, timeout: 3000 });
  const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
  if (!Array.isArray(questions)) throw new Error(`source question bank missing: ${sourceFile}`);
  questions.forEach((question, index) => sourceByIdentity.set(`${sourceFile}#${index + 1}`, question));
}

const sourceRows = baselineDifficulty.map((row) => {
  const identity = identityByUid.get(row.questionUid);
  const metadata = metadataByUid.get(row.questionUid);
  if (!identity || !metadata) throw new Error(`missing sidecar identity/metadata: ${row.questionUid}`);
  const sourceIdentity = `${row.sourceIdentity}`;
  const question = sourceByIdentity.get(sourceIdentity);
  if (!question) throw new Error(`current source missing: ${sourceIdentity}`);
  const currentFingerprint = sha256(JSON.stringify({
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null,
    solution: question.solution ?? null,
    image: question.image ?? null
  }));
  const drift = sourceDriftByUid.get(row.questionUid);
  if (drift && drift.currentMainSourceFingerprint !== currentFingerprint) throw new Error(`source drift fingerprint mismatch: ${row.questionUid}`);
  if (!drift && metadata.sourceFingerprint !== currentFingerprint) {
    // One historical difficulty ledger used a custom fingerprint for q599; the current
    // Archive 2.0 formula remains authoritative and the reviewed semantic inputs match.
    const allowedHistorical = row.inputOrdinal === 599 && row.sourceFingerprint !== currentFingerprint;
    if (!allowedHistorical) throw new Error(`unrecorded source fingerprint drift: ${row.questionUid}`);
  }
  if (core.normalizeFile(identity.sourceArchiveFile) !== core.normalizeFile(metadata.sourceArchiveFile) || Number(identity.sourceOrdinal) !== Number(metadata.sourceOrdinal)) throw new Error(`UID/source identity mismatch: ${row.questionUid}`);
  return { row, metadata, identity, question, currentFingerprint, sourceDrift: drift, metadataFingerprintBeforeSync: metadata.sourceFingerprint };
});

const initialCompiledTaxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const initialCompiledConcepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const initialCompiledConditions = readJson("archive/data/meta-foundation/compiled/condition_registry.json");
const initialCompiledBindings = readJson("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const activePT = new Map(initialCompiledTaxonomy.problemTypes.map((row) => [row.problemTypeKey, row]));
const activeTPL = new Map(initialCompiledTaxonomy.templates.map((row) => [row.templateKey, row]));
const activeCC = new Set(initialCompiledConcepts.concepts.map((row) => row.conceptKey));
const activeConditions = new Set(initialCompiledConditions.conditions.map((row) => row.conditionKey));
const activeBindingKey = (row) => [row.curriculum, row.standardUnitKey, row.subUnitKey == null ? "<DIRECT>" : row.subUnitKey, row.problemTypeKey].join("\0");
const activeBindingKeys = new Set(initialCompiledBindings.bindings.map(activeBindingKey));

const l3NewDefinitions = new Map((l3Synthesis.newProblemTypeCandidates || []).map((row) => [row.problemTypeKey, row]));
l3NewDefinitions.delete("PT_H1_POLY_DIVISION_REMAINDER");
for (const row of [
  { problemTypeKey: "PT_H1_POLY_DIVISION", canonicalLabelKo: "다항식의 나눗셈", definition: "다항식 나눗셈의 몫·나머지 항등식, 차수 제한 또는 실제 나눗셈 절차가 풀이의 결정 단계인 유형." },
  { problemTypeKey: "PT_H1_REMAINDER_THEOREM", canonicalLabelKo: "나머지정리", definition: "일차식 나눗셈의 나머지를 함수값으로 바꾸거나 그 관계를 확장해 값·계수·나머지를 결정하는 유형." },
  { problemTypeKey: "PT_H1_FACTOR_THEOREM", canonicalLabelKo: "인수정리", definition: "다항식의 영점과 일차인수의 동치를 중심으로 인수 여부·중복인수·미정계수 또는 공통인수를 결정하는 유형." },
  { problemTypeKey: "PT_H1_EQUATION_APPLICATION", canonicalLabelKo: "방정식의 활용", definition: "기하·수량 관계를 방정식으로 모델링해 미지수와 목표량을 결정하는 유형." },
  { problemTypeKey: "PT_H1_INEQUALITY_APPLICATION", canonicalLabelKo: "부등식의 활용", definition: "크기·범위·정수성·존재 조건을 부등식으로 모델링해 가능한 값이나 범위를 결정하는 유형." }
]) l3NewDefinitions.set(row.problemTypeKey, { ...row, status: "CANDIDATE" });

const finalL3ByUid = new Map();
for (const row of l3Rows) {
  const relation = relationByUid.get(row.questionUid);
  if (!relation) throw new Error(`L3/relation join missing: ${row.questionUid}`);
  const key = row.keyStatus === "HOLD" ? null : relation.normalizedL3ParentKey;
  if (!key && row.keyStatus !== "HOLD") throw new Error(`L3 key missing without explicit HOLD: ${row.questionUid}`);
  if (key && row.keyStatus === "HOLD") throw new Error(`L3 HOLD carries an assigned key: ${row.questionUid}`);
  if (key && row.problemTypeKeyCandidate !== key && !parentRows.some((parent) => parent.questionUid === row.questionUid && parent.reassigned.normalizedL3ParentKey === key)) {
    throw new Error(`L3 normalized key mismatch without parent materialization evidence: ${row.questionUid}`);
  }
  finalL3ByUid.set(row.questionUid, key);
}
const usedL3Keys = new Set([...finalL3ByUid.values()].filter(Boolean));
const newPT = [];
for (const key of sorted(usedL3Keys)) {
  if (activePT.has(key)) continue;
  const definition = l3NewDefinitions.get(key);
  if (!definition?.canonicalLabelKo || !definition?.definition) throw new Error(`accepted L3 definition missing: ${key}`);
  const supports = baselineDifficulty.filter((row) => finalL3ByUid.get(row.questionUid) === key);
  newPT.push({
    problemTypeKey: key,
    canonicalLabelKo: definition.canonicalLabelKo,
    definition: definition.definition,
    aliases: [],
    status: "ACTIVE",
    ownerPack: "H1_FOUNDATION",
    supportingItemCount: supports.length,
    supportingQuestionUids: sorted(supports.map((row) => row.questionUid)),
    sourceUnits: sorted(new Set(supports.map((row) => metadataByUid.get(row.questionUid)?.standardUnitKey).filter(nonempty))),
    evidenceProvenance: [{ source: "H1_STAGE3_L3_GLOBAL_NORMALIZED_1170", semanticLedger: "accepted H1 L3 baseline", definitionSource: key.startsWith("PT_H1_POLY_DIVISION") || key === "PT_H1_REMAINDER_THEOREM" || key === "PT_H1_FACTOR_THEOREM" ? "H1_POLY_DIVISION_87_L3_KEY_PROPOSAL" : "H1_STAGE3_L3_SYNTHESIS_CHECKPOINT_1170" }]
  });
}
for (const row of l3Rows) {
  const key = finalL3ByUid.get(row.questionUid);
  if (key && !activePT.has(key) && !l3NewDefinitions.has(key)) throw new Error(`unregistered L3 assignment without definition: ${key}`);
}

const noSeparateRawSupport = new Set(noSeparateGateRows.flatMap((row) => row.supportingQuestionUids || []));
const noSeparateKeyByUid = new Map();
for (const row of noSeparateGateRows) for (const uid of row.supportingQuestionUids || []) noSeparateKeyByUid.set(uid, row.templateKeyCandidate);
const keepRawSupport = new Set(keepGateRows.flatMap((row) => row.supportingQuestionUids || []));
const parentByUid = new Map(parentRows.map((row) => [row.questionUid, row]));
const finalL4ByUid = new Map();
const l4DispositionByUid = new Map();
let noSeparateMaterializedCount = 0;
let keepNewMaterializedCount = 0;
for (const row of l4Rows) {
  const key = row.templateKeyCandidate;
  let finalKey = null;
  let disposition;
  if (row.templateKeyStatus === "HOLD" || row.candidateDecision === "HOLD_UPSTREAM_L3" || row.candidateDecision === "HOLD_L3_PARENT_CHALLENGE") {
    disposition = "HOLD";
  } else if (noSeparateKeys.has(key)) {
    disposition = "NO_SEPARATE_L4";
    noSeparateMaterializedCount += 1;
  } else if (keepKeys.has(key)) {
    finalKey = key;
    disposition = "ASSIGNED";
    keepNewMaterializedCount += 1;
  } else if (["RETAIN_WORKING_CANDIDATE", "REUSE_ACTIVE"].includes(row.templateKeyStatus)) {
    finalKey = key;
    disposition = "ASSIGNED";
  } else if (row.templateKeyStatus === "NEW_L4_CANDIDATE") {
    throw new Error(`ungated new L4 candidate cannot be promoted: ${row.questionUid} ${key}`);
  } else {
    throw new Error(`unknown final L4 disposition: ${row.questionUid} ${row.templateKeyStatus}`);
  }
  if (finalKey && !finalL3ByUid.get(row.questionUid)) throw new Error(`L4 assigned without L3: ${row.questionUid}`);
  if (finalKey && row.templateKeyParent !== finalL3ByUid.get(row.questionUid)) throw new Error(`L4 parent mismatch: ${row.questionUid}`);
  finalL4ByUid.set(row.questionUid, finalKey);
  l4DispositionByUid.set(row.questionUid, disposition);
}
if (noSeparateMaterializedCount !== 69 || keepNewMaterializedCount !== 60) throw new Error(`L4 gate UID materialization mismatch: noSeparate=${noSeparateMaterializedCount}; keep=${keepNewMaterializedCount}`);
const noSeparateReparentExceptions = [];
for (const uid of noSeparateRawSupport) {
  if (finalL4ByUid.get(uid) === null && l4DispositionByUid.get(uid) === "NO_SEPARATE_L4") continue;
  const parent = parentByUid.get(uid);
  if (parent && parent.reassigned.templateKeyCandidate === "TPL_PERMUTATION_STANDARD_CONSTRAINT" && l4ByUid.get(uid)?.templateKeyCandidate === parent.reassigned.templateKeyCandidate) {
    noSeparateReparentExceptions.push(uid);
    continue;
  }
  throw new Error(`NO_SEPARATE support not explicitly recorded or parent-reassigned: ${uid} ${noSeparateKeyByUid.get(uid) || ""}`);
}
if (noSeparateReparentExceptions.length !== 1) throw new Error(`expected one NO_SEPARATE parent-reassignment overlay, got ${noSeparateReparentExceptions.length}`);
for (const uid of keepRawSupport) if (finalL4ByUid.get(uid) === null || !keepKeys.has(finalL4ByUid.get(uid))) throw new Error(`KEEP_NEW_L4 support missing final key: ${uid}`);
for (const row of parentRows) {
  const currentL4 = l4ByUid.get(row.questionUid);
  if (!currentL4 || currentL4.templateKeyCandidate !== row.reassigned.templateKeyCandidate || finalL3ByUid.get(row.questionUid) !== row.reassigned.normalizedL3ParentKey) throw new Error(`accepted parent reassignment mismatch: ${row.questionUid}`);
}

const templateGroups = new Map();
for (const row of l4Rows) {
  const key = finalL4ByUid.get(row.questionUid);
  if (!key || activeTPL.has(key)) continue;
  const list = templateGroups.get(key) || [];
  list.push(row);
  templateGroups.set(key, list);
}
const newTemplates = [];
for (const [key, supports] of [...templateGroups.entries()].sort(([a], [b]) => a.localeCompare(b, "en"))) {
  const parents = new Set(supports.map((row) => finalL3ByUid.get(row.questionUid)));
  const labels = new Set(supports.map((row) => row.canonicalLabelKo).filter(nonempty));
  const definitions = new Set(supports.map((row) => row.templateDefinition).filter(nonempty));
  if (parents.size !== 1 || labels.size !== 1 || definitions.size !== 1) throw new Error(`inconsistent final L4 definition: ${key}`);
  const parentProblemTypeKey = [...parents][0];
  const supportingUids = sorted(supports.map((row) => row.questionUid));
  const relationSupports = supportingUids.map((uid) => relationByUid.get(uid));
  const representative = supports[0];
  newTemplates.push({
    templateKey: key,
    parentProblemTypeKey,
    canonicalLabelKo: [...labels][0],
    definition: [...definitions][0],
    internalSkeleton: representative.independentSkeletonCluster || "",
    status: "ACTIVE",
    ownerPack: "H1_FOUNDATION",
    aliases: [],
    supportingItemCount: supportingUids.length,
    supportingQuestionUids: supportingUids,
    observedConditionKeys: sorted(new Set(relationSupports.flatMap((row) => row?.conditionKeys || []))),
    observedIntegrationPatterns: sorted(new Set(relationSupports.map((row) => row?.integrationPattern).filter(nonempty))),
    evidenceProvenance: [{ source: "H1_L4_AFTER_PARENT_MATERIALIZATION_1170", gate: keepKeys.has(key) ? "KEEP_NEW_L4" : "ACCEPTED_WORKING_L4" }]
  });
}
if (newTemplates.length !== 53) throw new Error(`expected 53 new active H1 L4 definitions, got ${newTemplates.length}`);
for (const [uid, key] of finalL4ByUid) {
  if (!key) continue;
  const template = activeTPL.get(key) || newTemplates.find((row) => row.templateKey === key);
  if (!template) throw new Error(`unregistered L4 key: ${uid} ${key}`);
  if (template.parentProblemTypeKey !== finalL3ByUid.get(uid)) throw new Error(`final parent mismatch: ${uid}`);
}

const newBindingGroups = new Map();
for (const row of baselineDifficulty) {
  const problemTypeKey = finalL3ByUid.get(row.questionUid);
  if (!problemTypeKey) continue;
  const metadata = metadataByUid.get(row.questionUid);
  const curriculum = String(metadata.curriculumKey || metadata.curriculum || "");
  const standardUnitKey = String(metadata.standardUnitKey || "");
  const subUnitKey = nonempty(metadata.subUnitKey) ? String(metadata.subUnitKey) : null;
  if (!curriculum || !standardUnitKey) throw new Error(`binding identity missing: ${row.questionUid}`);
  const signature = [curriculum, standardUnitKey, subUnitKey == null ? "<DIRECT>" : subUnitKey, problemTypeKey].join("\0");
  if (activeBindingKeys.has(signature)) continue;
  const list = newBindingGroups.get(signature) || [];
  list.push({ row, metadata, curriculum, standardUnitKey, subUnitKey, problemTypeKey });
  newBindingGroups.set(signature, list);
}
const newBindings = [];
for (const supports of [...newBindingGroups.values()].sort((a, b) => activeBindingKey(a[0]).localeCompare(activeBindingKey(b[0]), "en"))) {
  const first = supports[0];
  const courseValues = new Set(supports.map((row) => row.metadata.standardCourse || row.metadata.courseKey).filter(nonempty));
  if (courseValues.size !== 1) throw new Error(`binding course mismatch: ${first.problemTypeKey}`);
  newBindings.push({
    problemTypeKey: first.problemTypeKey,
    curriculum: first.curriculum,
    standardCourse: [...courseValues][0],
    standardUnitKey: first.standardUnitKey,
    subUnitKey: first.subUnitKey,
    ...(first.subUnitKey == null ? { bindingMode: "STANDARD_UNIT_DIRECT" } : {}),
    supportingItemCount: supports.length,
    supportingQuestionUids: sorted(supports.map((row) => row.row.questionUid)),
    status: "ACTIVE",
    ownerPack: "H1_FOUNDATION"
  });
}

const assignmentRows = [];
const finalDifficultyCounts = {};
const holdReasonCounts = {};
const l3DispositionCounts = {};
const l4DispositionCounts = {};
const finalCompatibilityCounts = {};
const fingerprintSyncRows = [];
const sourceIssueHolds = [];
const allConceptKeys = new Set();
const allConditionKeys = new Set();
const patterns = new Set(["NONE", "SEQUENTIAL", "INTERDEPENDENT", "REINTERPRETATION", "CASE_BRANCH", "DEEP_COMPOSITE"]);
const usedUid = new Set();
const usedSourceIdentity = new Set();
const compatibilityNewStrongHold = new Set();
const legacyExpected = { 1: "하", 2: "중", 3: "중", 4: "상", 5: "상" };

function deriveLegacyCompatibility(finalBucket, metadata) {
  if (finalBucket === "UNKNOWN") return { value: "UNKNOWN", source: "UNKNOWN_DIFFICULTY" };
  if (metadata.difficultyBucket === finalBucket && ["NORMAL", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT"].includes(metadata.legacyLevelCompatibility)) {
    return { value: metadata.legacyLevelCompatibility, source: "REUSED_ACCEPTED_METADATA_PAIR" };
  }
  const level = String(metadata.legacyLevel || metadata.level || "").trim();
  if (!level) return { value: "UNKNOWN", source: "LEGACY_LEVEL_NOT_AVAILABLE" };
  if (legacyExpected[finalBucket] === level) return { value: "NORMAL", source: "V1_3_FINAL_BUCKET_MAPPING" };
  const expectedBuckets = level === "하" ? [1] : level === "중" ? [2, 3] : level === "상" ? [4, 5] : [];
  const distance = expectedBuckets.length ? Math.min(...expectedBuckets.map((bucket) => Math.abs(bucket - finalBucket))) : 99;
  return { value: distance === 1 ? "BORDERLINE_REVIEW" : "STRONG_CONFLICT", source: "V1_3_FINAL_BUCKET_MAPPING" };
}

const ptDefinitionByKey = new Map([...activePT.entries(), ...newPT.map((row) => [row.problemTypeKey, row])]);
const tplDefinitionByKey = new Map([...activeTPL.entries(), ...newTemplates.map((row) => [row.templateKey, row])]);

for (const source of sourceRows) {
  const base = source.row;
  const metadata = source.metadata;
  const relation = relationByUid.get(base.questionUid);
  const l3Key = finalL3ByUid.get(base.questionUid);
  const l4Key = finalL4ByUid.get(base.questionUid);
  const l4Disposition = l4DispositionByUid.get(base.questionUid);
  const diff = finalDifficultyByUid.get(base.questionUid);
  const sourceDrift = Boolean(source.sourceDrift);
  const l3Disposition = l3Key ? "ASSIGNED" : "HOLD";
  const holdReasons = [];
  if (!l3Key) holdReasons.push("L3_HOLD");
  if (l4Disposition === "HOLD") holdReasons.push("L4_HOLD");
  if (sourceDrift) holdReasons.push("SOURCE_DRIFT_ORIGIN_MAIN");
  if (diff.sourceIssueHold === true && !sourceDrift) holdReasons.push("SOURCE_OR_SOLUTION_ISSUE");
  if (diff.difficultyBucket === "UNKNOWN") holdReasons.push(diff.difficultyHoldReasonCode || "DIFFICULTY_UNKNOWN");
  const metadataCompatibility = deriveLegacyCompatibility(diff.difficultyBucket, metadata);
  if (metadataCompatibility.source === "V1_3_FINAL_BUCKET_MAPPING" && metadataCompatibility.value === "STRONG_CONFLICT") {
    holdReasons.push("LEGACY_LEVEL_STRONG_CONFLICT_UNADJUDICATED");
    compatibilityNewStrongHold.add(base.questionUid);
  }
  const finalHoldReasons = sorted(new Set(holdReasons));
  const statusHold = finalHoldReasons.length > 0;
  const problemType = l3Key ? ptDefinitionByKey.get(l3Key) : null;
  const template = l4Key ? tplDefinitionByKey.get(l4Key) : null;
  const crossConceptKeys = [...new Set(relation.crossConceptKeys || [])].sort();
  const conditionKeys = [...new Set(relation.conditionKeys || [])].sort();
  const integrationPattern = relation.integrationPattern || "NONE";
  if (!patterns.has(integrationPattern)) throw new Error(`invalid integration pattern: ${base.questionUid}`);
  for (const key of crossConceptKeys) {
    if (!activeCC.has(key)) throw new Error(`unregistered CrossConcept ${key}`);
    allConceptKeys.add(key);
  }
  for (const key of conditionKeys) {
    if (!activeConditions.has(key)) throw new Error(`unregistered Condition ${key}`);
    allConditionKeys.add(key);
  }
  const curriculum = String(metadata.curriculumKey || metadata.curriculum || "");
  const standardCourse = String(metadata.standardCourse || metadata.courseKey || "");
  const standardUnitKey = String(metadata.standardUnitKey || "");
  const subUnitKey = nonempty(metadata.subUnitKey) ? String(metadata.subUnitKey) : null;
  const courseKey = String(metadata.courseKey || standardCourse);
  const sourceArchiveFile = core.normalizeFile(metadata.sourceArchiveFile);
  const sourceIdentity = `${sourceArchiveFile}#${Number(metadata.sourceOrdinal)}`;
  if (sourceIdentity !== base.sourceIdentity) throw new Error(`accepted sourceIdentity mismatch: ${base.questionUid}`);
  if (usedUid.has(base.questionUid)) throw new Error(`duplicate H1 UID ${base.questionUid}`);
  if (usedSourceIdentity.has(sourceIdentity)) throw new Error(`duplicate H1 sourceIdentity ${sourceIdentity}`);
  usedUid.add(base.questionUid);
  usedSourceIdentity.add(sourceIdentity);
  const legacy = deriveLegacyCompatibility(diff.difficultyBucket, metadata);
  finalCompatibilityCounts[legacy.value] = (finalCompatibilityCounts[legacy.value] || 0) + 1;
  const metadataRevision = "meta-foundation:H1_FOUNDATION@1.0.0";
  const h1HoldReason = finalHoldReasons.length ? finalHoldReasons.join("|") : null;
  const defaultSelectable = statusHold ? false : metadata.defaultSelectable !== false;
  const curriculumApplicability = metadata.curriculumApplicability || "DEFAULT_SCOPE";
  const l1 = metadata.L1 || metadata.standardUnit || "";
  const l2 = metadata.L2 || metadata.subUnit || "";
  if (!curriculum || !standardCourse || !standardUnitKey || !courseKey || !l1 || !l2) throw new Error(`H1 curriculum path missing: ${base.questionUid}`);

  Object.assign(metadata, {
    curriculum,
    curriculumKey: curriculum,
    standardCourse,
    courseKey,
    sourceFingerprint: source.currentFingerprint,
    problemTypeKey: l3Key,
    templateKey: l4Key,
    crossConceptKeys,
    secondaryConceptKeys: crossConceptKeys,
    conditionKeys,
    integrationPattern,
    difficultyBucket: diff.difficultyBucket,
    difficultyConfidence: diff.difficultyConfidence,
    difficultyBoundaryFlag: diff.difficultyBoundaryFlag,
    legacyLevelCompatibility: legacy.value,
    difficultyReason: diff.difficultyReason || metadata.difficultyReason || null,
    L3: problemType?.canonicalLabelKo || null,
    L4: template?.canonicalLabelKo || null,
    l3Disposition,
    l4Disposition,
    foundationTaxonomyStatus: (!l3Key || l4Disposition === "HOLD" || sourceDrift) ? "HOLD" : "CONFIRMED",
    curriculumApplicability,
    defaultSelectable,
    reviewStatus: statusHold ? "HOLD" : "reviewed_pass",
    semanticDisposition: statusHold ? "HOLD" : "CONFIRMED",
    metadataStatus: statusHold ? "approved_full_with_explicit_hold" : "approved_full",
    tagConfidence: "h1_meta_foundation_accepted_baseline",
    tagStatus: statusHold ? "meta_foundation_explicit_hold" : "meta_foundation_final",
    metadataRevision,
    metaFoundationStatus: statusHold ? "HOLD" : "ACTIVE",
    metaFoundationPackId: "H1_FOUNDATION",
    metaFoundationPackVersion: "1.0.0",
    metaFoundationHoldReason: h1HoldReason,
    legacyLevelCompatibilityEvidence: legacy.source,
    sourceMetadataVerification: "ARCHIVE2_CURRENT_SOURCE_FINGERPRINT_SYNCED"
  });
  if (sourceDrift) {
    metadata.sourceIssue = "SOURCE_CHANGED_AFTER_ACCEPTED_H1_BASELINE";
    metadata.sourceIssueHold = true;
  } else if (diff.sourceIssueHold === true) {
    metadata.sourceIssue = diff.sourceIssue || "SOURCE_OR_SOLUTION_DEFECT";
    metadata.sourceIssueHold = true;
  } else {
    delete metadata.sourceIssue;
    delete metadata.sourceIssueHold;
  }
  const evidenceList = new Set(metadata.approvalEvidence || []);
  for (const pathValue of [
    "archive/data/meta-foundation/evidence/high1/v1/promotion_receipt.json",
    "archive/data/meta-foundation/evidence/high1/v1/item_metadata_assignments_1170.json",
    "archive/data/meta-foundation/evidence/high1/v1/source_drift_hold_048.jsonl",
    "archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l4-global-normalization/H1_DIFFICULTY_OUTLIER_COMPARE_028.jsonl"
  ]) evidenceList.add(pathValue);
  metadata.approvalEvidence = [...evidenceList];

  const eligibilityRecord = {
    questionUid: base.questionUid,
    sourceArchiveFile,
    sourceOrdinal: Number(metadata.sourceOrdinal),
    sourceFingerprint: source.currentFingerprint,
    identityStatus: "VERIFIED",
    sourceStatus: "VERIFIED",
    taxonomyStatus: (!l3Key || l4Disposition === "HOLD" || sourceDrift) ? "HOLD" : "CONFIRMED",
    gradeConflict: false,
    reviewStatus: statusHold ? "HOLD" : "reviewed_pass",
    semanticDisposition: statusHold ? "HOLD" : "CONFIRMED",
    foundationTaxonomyStatus: (!l3Key || l4Disposition === "HOLD" || sourceDrift) ? "HOLD" : "CONFIRMED",
    curriculumKey: curriculum,
    courseKey,
    L1: l1,
    L2: l2,
    difficultyBucket: diff.difficultyBucket,
    difficultyConfidence: diff.difficultyConfidence,
    difficultyBoundaryFlag: diff.difficultyBoundaryFlag,
    legacyLevelCompatibility: legacy.value,
    curriculumApplicability,
    defaultSelectable,
    metadataConflicts: []
  };
  const runtimeSelectable = core.eligibility(eligibilityRecord).ok;
  const item = {
    questionUid: base.questionUid,
    sourceArchiveFile,
    sourceOrdinal: Number(metadata.sourceOrdinal),
    sourceQuestionNo: metadata.sourceQuestionNo || String(metadata.sourceOrdinal),
    sourceIdentity,
    sourceFingerprint: source.currentFingerprint,
    baselineSourceFingerprint: base.sourceFingerprint,
    curriculum,
    curriculumKey: curriculum,
    standardCourse,
    courseKey,
    standardUnitKey,
    subUnitKey,
    standardUnit: metadata.standardUnit,
    subUnit: metadata.subUnit,
    L1: l1,
    L2: l2,
    L3: problemType?.canonicalLabelKo || null,
    L4: template?.canonicalLabelKo || null,
    problemTypeKey: l3Key,
    templateKey: l4Key,
    l3Disposition,
    l4Disposition,
    crossConceptKeys,
    conditionKeys,
    integrationPattern,
    difficultyBucket: diff.difficultyBucket,
    difficultyConfidence: diff.difficultyConfidence,
    difficultyBoundaryFlag: diff.difficultyBoundaryFlag,
    legacyLevelCompatibility: legacy.value,
    legacyLevelCompatibilityEvidence: legacy.source,
    difficultyReason: diff.difficultyReason || null,
    reviewTargetReason: diff.reviewTargetReason || null,
    outlierDisposition: diff.outlierDisposition || null,
    independentDifficultyBucket: diff.independentDifficultyBucket ?? null,
    sourceIssue: sourceDrift ? "SOURCE_CHANGED_AFTER_ACCEPTED_H1_BASELINE" : (diff.sourceIssue || "NONE"),
    sourceIssueHold: sourceDrift || diff.sourceIssueHold === true,
    sourceHoldReason: sourceDrift ? "LATEST_MAIN_SOURCE_CHANGED_NO_REVIEW_AUTHORIZED" : (diff.sourceHoldReason || null),
    metaFoundationHoldReason: h1HoldReason,
    holdReasons: finalHoldReasons,
    semanticDisposition: statusHold ? "HOLD" : "CONFIRMED",
    taxonomyStatus: (!l3Key || l4Disposition === "HOLD" || sourceDrift) ? "HOLD" : "CONFIRMED",
    foundationTaxonomyStatus: (!l3Key || l4Disposition === "HOLD" || sourceDrift) ? "HOLD" : "CONFIRMED",
    reviewStatus: statusHold ? "HOLD" : "reviewed_pass",
    curriculumApplicability,
    defaultSelectable,
    runtimeSelectable,
    metadataRevision,
    metaFoundationStatus: statusHold ? "HOLD" : "ACTIVE",
    metaFoundationPackId: "H1_FOUNDATION",
    metaFoundationPackVersion: "1.0.0",
    catalogSeed: {
      sourceFile: sourceArchiveFile,
      sourceOrdinal: Number(metadata.sourceOrdinal),
      sourceQuestionNo: metadata.sourceQuestionNo || String(metadata.sourceOrdinal)
    }
  };
  assignmentRows.push(item);
  finalDifficultyCounts[String(diff.difficultyBucket)] = (finalDifficultyCounts[String(diff.difficultyBucket)] || 0) + 1;
  for (const reason of finalHoldReasons) holdReasonCounts[reason] = (holdReasonCounts[reason] || 0) + 1;
  l3DispositionCounts[l3Disposition] = (l3DispositionCounts[l3Disposition] || 0) + 1;
  l4DispositionCounts[l4Disposition] = (l4DispositionCounts[l4Disposition] || 0) + 1;
  const priorIdentityFingerprint = source.identity.sourceFingerprint;
  const priorMetadataFingerprint = source.metadataFingerprintBeforeSync;
  if (source.identity.sourceFingerprint !== source.currentFingerprint) {
    source.identity.sourceFingerprint = source.currentFingerprint;
  }
  if (priorIdentityFingerprint !== source.currentFingerprint || priorMetadataFingerprint !== source.currentFingerprint) {
    fingerprintSyncRows.push({
      questionUid: base.questionUid,
      sourceIdentity,
      identityBefore: priorIdentityFingerprint,
      metadataBefore: priorMetadataFingerprint,
      after: source.currentFingerprint,
      reason: sourceDrift ? "LATEST_MAIN_SOURCE_CHANGE_EXPLICIT_HOLD" : "IDENTITY_MAP_SOURCE_FINGERPRINT_SYNC"
    });
  }
  if (source.currentFingerprint !== source.identity.sourceFingerprint || source.currentFingerprint !== metadata.sourceFingerprint) {
    throw new Error(`source fingerprint writeback mismatch: ${base.questionUid}`);
  }
  if (sourceDrift) sourceIssueHolds.push(item);
}

if (assignmentRows.length !== 1170 || usedUid.size !== 1170 || usedSourceIdentity.size !== 1170) throw new Error("final H1 assignment denominator/uniqueness gate failed");
for (const item of assignmentRows) {
  if (item.difficultyBucket !== "UNKNOWN" && (!Number.isInteger(item.difficultyBucket) || item.difficultyBucket < 1 || item.difficultyBucket > 5)) throw new Error(`invalid difficulty bucket: ${item.questionUid}`);
  if (item.l3Disposition !== "HOLD" && !item.problemTypeKey) throw new Error(`missing L3 without HOLD: ${item.questionUid}`);
  if (!item.l4Disposition) throw new Error(`missing L4 disposition: ${item.questionUid}`);
  if (item.templateKey && item.problemTypeKey && tplDefinitionByKey.get(item.templateKey)?.parentProblemTypeKey !== item.problemTypeKey) throw new Error(`L3/L4 parent integrity failure: ${item.questionUid}`);
}
const unrecordedSemanticFingerprintChanges = fingerprintSyncRows.filter((row) => !sourceDriftByUid.has(row.questionUid) && row.metadataBefore !== row.after);
if (unrecordedSemanticFingerprintChanges.length) throw new Error(`source fingerprint sync outside recorded source drift would change an accepted semantic source: ${unrecordedSemanticFingerprintChanges.map((row) => row.questionUid).slice(0, 5).join(",")}`);

const stableIdentity = { ...identityFile };
delete stableIdentity.generatedAt;
delete stableIdentity.identityDigest;
identityFile.identityDigest = sha256(JSON.stringify(stableIdentity));
metadataFile.metadataRevision = "archive-metadata-v1-phase1b-20260825+H1_FOUNDATION@1.0.0";
metadataFile.sourceDigests = {
  ...(metadataFile.sourceDigests || {}),
  identityMap: sha256(jsonText(identityFile))
};
metadataFile.h1Foundation = {
  schemaVersion: "h1-foundation-question-metadata-materialization-v1",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  uidDenominator: assignmentRows.length,
  sourceFingerprintSyncCount: fingerprintSyncRows.length,
  sourceHoldCount: sourceIssueHolds.length
};
delete metadataFile.digest;
metadataFile.digest = sha256(JSON.stringify(metadataFile));

const registryIndex = readJson(`${canonicalRoot}/registry_index.json`);
if (registryIndex.activePacks.some((row) => row.id === "H1_FOUNDATION")) throw new Error("H1_FOUNDATION already exists in active registry before materialization");
registryIndex.activePacks.push({ id: "H1_FOUNDATION", version: "1.0.0", status: "ACTIVE" });

const taxonomy = {
  schemaVersion: "h1-foundation-taxonomy-pack-v1",
  status: "ACTIVE",
  hierarchy: "standardUnitKey -> subUnitKey -> problemTypeKey -> templateKey",
  semanticRegistrySharedAcrossCurricula: true,
  problemTypeCount: newPT.length,
  templateCount: newTemplates.length,
  problemTypes: newPT,
  templates: newTemplates,
  ownerPack: "H1_FOUNDATION"
};
const bindingFile = {
  schemaVersion: "h1-foundation-curriculum-bindings-v1",
  status: "ACTIVE",
  bindingCount: newBindings.length,
  bindings: newBindings,
  policy: "Bindings use accepted H1 source L1/L2 metadata and final working L3 ledger; active canonical tuple reuse is preserved.",
  ownerPack: "H1_FOUNDATION"
};
const aliasFile = { schemaVersion: "h1-foundation-aliases-v1", status: "ACTIVE", aliasCount: 0, aliases: [] };

const activeTaxonomyRows = [];
const activeByTaxonomy = new Map();
for (const item of assignmentRows) {
  if (!item.problemTypeKey || item.sourceIssueHold || item.l4Disposition === "HOLD") continue;
  const signature = [item.curriculumKey, item.courseKey, item.L1, item.L2, item.problemTypeKey, item.templateKey || ""].join("\0");
  const group = activeByTaxonomy.get(signature) || [];
  group.push(item);
  activeByTaxonomy.set(signature, group);
}
for (const rows of activeByTaxonomy.values()) {
  const first = rows[0];
  activeTaxonomyRows.push({
    curriculumKey: first.curriculumKey,
    courseKey: first.courseKey,
    L1: first.L1,
    L2: first.L2,
    L3: first.L3,
    L4: first.L4,
    problemTypeKey: first.problemTypeKey,
    templateKey: first.templateKey,
    curriculumApplicability: first.curriculumApplicability,
    defaultSelectable: rows.some((row) => row.defaultSelectable === true),
    supportingItemCount: rows.length
  });
}
activeTaxonomyRows.sort((a, b) => [a.curriculumKey,a.courseKey,a.L1,a.L2,a.problemTypeKey,a.templateKey || ""].join("|").localeCompare([b.curriculumKey,b.courseKey,b.L1,b.L2,b.problemTypeKey,b.templateKey || ""].join("|"), "en"));
const ownedScopesMap = new Map();
for (const row of assignmentRows) {
  const scope = { curriculumKey: row.curriculumKey, courseKey: row.courseKey, L1: row.L1, L2: row.L2 };
  ownedScopesMap.set([scope.curriculumKey,scope.courseKey,scope.L1,scope.L2].join("\0"), scope);
}
const ownedScopes = [...ownedScopesMap.values()].sort((a, b) => [a.curriculumKey,a.courseKey,a.L1,a.L2].join("|").localeCompare([b.curriculumKey,b.courseKey,b.L1,b.L2].join("|"), "en"));

const runtimeSelectableCount = assignmentRows.filter((row) => row.runtimeSelectable).length;
for (const row of assignmentRows) row.selectabilityReasonCodes = core.eligibility({ ...row, identityStatus: "VERIFIED", sourceStatus: "VERIFIED", gradeConflict: false, metadataConflicts: [] }).reasons;
const runtime = {
  schemaVersion: "meta-foundation-runtime-overlay-v1",
  status: "ACTIVE",
  runtimeVersion: "H1_FOUNDATION@1.0.0/runtime-bridge-v5",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  generatedFrom: {
    immutableOutlierReviewHead: "70ffc893777e543989a01566d9106f9f1b76b991",
    mergedOriginMainHead: sourceDriftRows[0]?.originMainHead || "",
    branchHeadAtMaterialization: currentHead,
    l3: "archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/H1_STAGE3_L3_GLOBAL_NORMALIZED_1170.jsonl",
    l4: "archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint/l4-global-normalization/H1_L4_AFTER_PARENT_MATERIALIZATION_1170.jsonl",
    l4CandidateGate: gatePath,
    relational: relationPath,
    difficultyBase: baseDifficultyPath,
    outlierReview: comparePath,
    sourceDrift: sourceDriftPath,
    canonicalPack: packDir,
    questionMetadata: "archive/data/question_metadata.json",
    questionIdentityMap: "archive/data/question_identity_map.json"
  },
  counts: {
    records: assignmentRows.length,
    finalL3: assignmentRows.filter((row) => row.l3Disposition !== "HOLD").length,
    finalL4: assignmentRows.filter((row) => row.l4Disposition === "ASSIGNED").length,
    explicitL3Hold: assignmentRows.filter((row) => row.l3Disposition === "HOLD").length,
    explicitL4Hold: assignmentRows.filter((row) => row.l4Disposition === "HOLD").length,
    noSeparateL4: assignmentRows.filter((row) => row.l4Disposition === "NO_SEPARATE_L4").length,
    difficultyHold: assignmentRows.filter((row) => row.difficultyBucket === "UNKNOWN").length,
    sourceHold: assignmentRows.filter((row) => row.sourceIssueHold).length,
    explicitHold: assignmentRows.filter((row) => row.reviewStatus === "HOLD").length,
    defaultSelectable: assignmentRows.filter((row) => row.defaultSelectable).length,
    runtimeSelectable: runtimeSelectableCount,
    automaticEligibleExpected: runtimeSelectableCount,
    catalogUidDirectJoin: assignmentRows.length,
    taxonomyRows: activeTaxonomyRows.length,
    l3ProblemTypeCount: newPT.length,
    l4TemplateCount: newTemplates.length,
    crossConceptReferenceCount: assignmentRows.reduce((sum, row) => sum + row.crossConceptKeys.length, 0),
    conditionReferenceCount: assignmentRows.reduce((sum, row) => sum + row.conditionKeys.length, 0)
  },
  ownedScopes,
  taxonomyRows: activeTaxonomyRows,
  records: assignmentRows
};

const assignmentFile = {
  schemaVersion: "h1-foundation-item-metadata-assignments-v1",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  sourceHead: currentHead,
  sourceEvidenceHead: "70ffc893777e543989a01566d9106f9f1b76b991",
  counts: runtime.counts,
  items: assignmentRows
};
const pack = {
  schemaVersion: "meta-foundation-pack-v1",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  canonicalStatus: "ACTIVE",
  schemaAuthority: "docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md",
  ownerPack: "H1_FOUNDATION",
  curricula: sorted(new Set(assignmentRows.map((row) => row.curriculum))),
  standardCourses: sorted(new Set(assignmentRows.map((row) => row.standardCourse))),
  ownedStandardUnitDomains: sorted(new Set(assignmentRows.map((row) => row.standardUnitKey))),
  activeItemEvidenceCount: assignmentRows.length,
  problemTypeCount: newPT.length,
  templateCount: newTemplates.length,
  crossConceptReferenceCount: runtime.counts.crossConceptReferenceCount,
  conditionRegistryCount: allConditionKeys.size,
  bindingCount: newBindings.length,
  aliasCount: 0,
  outOfGroupRoutingCount: 0,
  productionJsMutation: false,
  promotionReviewDisposition: "USER_ACCEPTED_H1_META_FOUNDATION_BASELINE_WITH_EXPLICIT_HOLDS",
  notes: [
    "The accepted 1170-row L3/L4/relational and final-working Difficulty baseline is materialized without reopening semantic review.",
    "The completed 28-item outlier compare is the accepted Difficulty result; the single current Bucket 5 target is materialized at adjudicated Bucket 4.",
    "Only the 10 KEEP_NEW_L4 candidate families are registered; NO_SEPARATE_L4 and parent reassignment outcomes are preserved per UID.",
    "Forty-eight latest-main source changes remain per-item source holds and are not sent for another review.",
    "Unknown Difficulty and L3/L4 HOLD states remain explicit, non-selectable records; normal items are still available to Archive 2.0."
  ]
};

const audit = {
  schemaVersion: "h1-foundation-global-integrity-audit-v1",
  status: "PASS",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  sourceHeads: {
    immutableOutlierReviewStart: "0ead023bc48f96e2c6d55c351ff815af99735547",
    outlierReviewCheckpoint: "70ffc893777e543989a01566d9106f9f1b76b991",
    latestMergedOriginMain: sourceDriftRows[0]?.originMainHead || "",
    taskBranchBeforeMaterialization: currentHead
  },
  selectionProvenance: {
    retainedLargeShiftSelected: 27,
    retainedLargeShiftReviewed: 27,
    currentBucket5Selected: 1,
    currentBucket5Reviewed: 1,
    uniqueReviewUidCount: 28,
    selectionOverlap: 0,
    selectionMissing: 0,
    dispositionCounts
  },
  counts: {
    targetRows: assignmentRows.length,
    uniqueUid: usedUid.size,
    uniqueSourceIdentity: usedSourceIdentity.size,
    duplicateUid: assignmentRows.length - usedUid.size,
    duplicateSourceIdentity: assignmentRows.length - usedSourceIdentity.size,
    finalDifficulty: finalDifficultyCounts,
    legacyLevelCompatibility: finalCompatibilityCounts,
    l3Disposition: l3DispositionCounts,
    l4Disposition: l4DispositionCounts,
    explicitHold: assignmentRows.filter((row) => row.reviewStatus === "HOLD").length,
    holdReasonCounts,
    retainedLargeShiftCoverage: 27,
    bucket5Coverage: 1,
    sourceDriftHold: sourceIssueHolds.length,
    sourceFingerprintSync: fingerprintSyncRows.length,
    l3Unique: usedL3Keys.size,
    l3OwnedNew: newPT.length,
    l4AssignedUnique: new Set(assignmentRows.map((row) => row.templateKey).filter(Boolean)).size,
    l4OwnedNew: newTemplates.length,
    noSeparateL4: noSeparateMaterializedCount,
    keepNewL4Support: keepNewMaterializedCount,
    newBindings: newBindings.length,
    crossConceptUsed: allConceptKeys.size,
    conditionUsed: allConditionKeys.size,
    integrationPatternsUsed: sorted(new Set(assignmentRows.map((row) => row.integrationPattern)))
  },
  validation: {
    acceptedBaselineOnly: true,
    repeated28Review: false,
    sourceQuestionMutation: 0,
    canonicalBucket5Assumption: false,
    allCrossConceptsRegistered: true,
    allConditionsRegistered: true,
    allIntegrationPatternsValid: assignmentRows.every((row) => patterns.has(row.integrationPattern)),
    l3l4ParentMismatch: 0,
    outlierSourceOverlap: 0,
    sourceFingerprintMismatchAfterSync: 0
  },
  outlierCompare: {
    path: comparePath,
    postCompareBucket5Adjudication: postCompare.adjudicatedResult,
    changedOutlierDeltaRows: outlierDelta.length
  },
  latestMainSourceDrift: {
    path: sourceDriftPath,
    total: sourceDriftRows.length,
    semanticInputChanged: semanticDriftCount,
    answerOrImageOnly: 1,
    reviewAgain: false
  },
  outputPaths: {
    canonicalPack: packDir,
    assignments: assignmentsPath,
    difficultyAccepted: acceptedLedgerPath,
    difficultyDelta: acceptedDeltaPath,
    sourceHold: sourceHoldOutputPath,
    runtime: runtimePath
  },
  runtime: {
    recordCount: runtime.counts.records,
    runtimeSelectable: runtimeSelectableCount,
    runtimeVersion: runtime.runtimeVersion
  }
};

const promotionReceipt = {
  schemaVersion: "h1-foundation-promotion-receipt-v1",
  status: "MATERIALIZED_PENDING_MECHANICAL_VALIDATION",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  createdFromHead: currentHead,
  outlierReviewCheckpointHead: "70ffc893777e543989a01566d9106f9f1b76b991",
  mergedOriginMainHead: sourceDriftRows[0]?.originMainHead || "",
  scope: "HIGH1_COMMON_MATH_1_ONLY",
  denominator: 1170,
  acceptedDifficultyDispositionCounts: dispositionCounts,
  sourceFingerprintSyncCount: fingerprintSyncRows.length,
  sourceHoldCount: sourceIssueHolds.length,
  explicitHoldCount: assignmentRows.filter((row) => row.reviewStatus === "HOLD").length,
  runtimeSelectableExpected: runtimeSelectableCount,
  canonicalFiles: [
    `${canonicalRoot}/registry_index.json`, `${packDir}/pack.json`, `${packDir}/taxonomy.json`,
    `${packDir}/bindings.json`, `${packDir}/aliases.json`
  ],
  evidenceFiles: [assignmentsPath, acceptedLedgerPath, acceptedDeltaPath, sourceHoldOutputPath],
  runtimeFile: runtimePath
};

const acceptedRowsOut = acceptedDifficultyRows.map((row) => {
  const item = assignmentRows.find((assignment) => assignment.questionUid === row.questionUid);
  return {
    questionUid: row.questionUid,
    sourceIdentity: row.sourceIdentity,
    sourceFingerprint: item.sourceFingerprint,
    baselineSourceFingerprint: row.sourceFingerprintAtWorkingBaseline,
    reviewTargetReason: row.reviewTargetReason || null,
    outlierDisposition: row.outlierDisposition || null,
    currentWorkingBucket: row.currentWorkingBucket,
    independentDifficultyBucket: row.independentDifficultyBucket ?? null,
    difficultyBucket: item.difficultyBucket,
    difficultyReason: item.difficultyReason,
    difficultyConfidence: item.difficultyConfidence,
    difficultyBoundaryFlag: item.difficultyBoundaryFlag,
    legacyLevelCompatibility: item.legacyLevelCompatibility,
    reviewStatus: item.reviewStatus,
    holdReasons: item.holdReasons,
    sourceIssue: item.sourceIssue,
    sourceHoldReason: item.sourceHoldReason,
    l3Disposition: item.l3Disposition,
    l4Disposition: item.l4Disposition
  };
});

const sourceHoldLedger = sourceIssueHolds.map((item) => {
  const row = sourceDriftByUid.get(item.questionUid);
  return { ...row, finalHandling: "EXPLICIT_SOURCE_HOLD_NO_REVIEW", finalDifficultyBucket: "UNKNOWN", currentSourceFingerprint: item.sourceFingerprint, reviewStatus: "HOLD", runtimeSelectable: false };
});

const write = process.argv.includes("--write");
if (!write) {
  console.log(JSON.stringify({
    status: "DRY_RUN_PASS",
    head: currentHead,
    counts: audit.counts,
    runtimeSelectable: runtimeSelectableCount,
    noSeparateL4: noSeparateMaterializedCount,
    keepNewL4Support: keepNewMaterializedCount,
    newProblemTypes: newPT.length,
    newTemplates: newTemplates.length,
    newBindings: newBindings.length,
    sourceFingerprintSyncCount: fingerprintSyncRows.length,
    outputsNotWritten: true
  }, null, 2));
  process.exit(0);
}

function writeFile(relativePath, value) {
  fs.mkdirSync(path.dirname(abs(relativePath)), { recursive: true });
  fs.writeFileSync(abs(relativePath), value, "utf8");
}
writeFile(`${packDir}/pack.json`, jsonText(pack));
writeFile(`${packDir}/taxonomy.json`, jsonText(taxonomy));
writeFile(`${packDir}/bindings.json`, jsonText(bindingFile));
writeFile(`${packDir}/aliases.json`, jsonText(aliasFile));
writeFile(`${canonicalRoot}/registry_index.json`, jsonText(registryIndex));
writeFile("archive/data/question_identity_map.json", jsonText(identityFile));
writeFile("archive/data/question_metadata.json", jsonText(metadataFile));
writeFile(runtimePath, jsonText(runtime));
writeFile(assignmentsPath, jsonText(assignmentFile));
writeFile(`${evidenceRoot}/global_integrity_audit.json`, jsonText(audit));
writeFile(`${evidenceRoot}/promotion_receipt.json`, jsonText(promotionReceipt));
writeFile(sourceHoldOutputPath, jsonlText(sourceHoldLedger));
writeFile(acceptedLedgerPath, jsonlText(acceptedRowsOut));
writeFile(acceptedDeltaPath, jsonlText(outlierDelta));
writeFile(sourceFingerprintSyncOutputPath, jsonText({
  schemaVersion: "h1-foundation-source-fingerprint-sync-v1",
  status: "SYNCED",
  totalH1Records: 1170,
  changedFingerprints: fingerprintSyncRows.length,
  latestMainSourceHolds: 48,
  records: fingerprintSyncRows
}));
console.log(JSON.stringify({ status: "MATERIALIZED", counts: audit.counts, runtimeSelectable: runtimeSelectableCount, outputs: 15 }, null, 2));
