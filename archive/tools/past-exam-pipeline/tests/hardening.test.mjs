import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { spawnSync } from "node:child_process";

import {
  assertReleaseClosure,
  fileSha,
  objectFileSha,
  productionWritePreflight,
  protectedPayloadSha,
  validatePastExamPromotion,
} from "../lib/hardening.mjs";
import { validatePortableZip } from "../lib/portable-package.mjs";
import { makeQuestionSkeleton } from "../lib/js-candidate.mjs";
import { makeSolutionIdentityDraft, createMetaDecisionDraft, RPM_LOOKUP_ORDER } from "../lib/completion-evidence.mjs";
import { loadActiveMetaRegistry } from "../../meta-foundation/active-registry.mjs";
import { buildResolverBackedMetaEvidence, makeDifficultyEvidence, questionUidForSource, resolveMetaRoute, sealR2EMetaReceipt, validateR2EReceipt } from "../../meta-foundation/rpm-active-resolver.mjs";

const sha = value => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const repoRoot = path.resolve(fileURLToPath(new URL('../../../../', import.meta.url)));

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "past-exam-hardening-"));
  const examRoot = path.join(root, "exam");
  const candidateDir = path.join(examRoot, "candidate");
  const reportsDir = path.join(examRoot, "reports");
  const assetsDir = path.join(examRoot, "assets");
  fs.mkdirSync(candidateDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  const sourceDocumentSha256 = sha("source-pdf-bytes");
  const sourceIdentityKey = `${sourceDocumentSha256}|1`;
  const question = {
    id: 1,
    content: "다음 함수의 최댓값을 구하여라.",
    choices: ["1", "2", "3", "4", "5"],
    answer: "163",
    solution: "독립적으로 경우를 나누어 계산하면 163이다.",
    sourceDocumentSha256,
    sourceQuestionNo: "1",
    sourcePageNo: 1,
    sourcePageEvidencePaths: ["pages/page_p001.png"],
    sourceIdentityKey,
    sourceArchiveFile: "original/high/h1/1final/fixture.js",
    sourceOrdinal: 1,
    problemTypeKey: "",
    templateKey: "",
    crossConceptKeys: [],
    conditionKeys: [],
    integrationPattern: "NONE",
    difficultyBucket: "UNKNOWN",
    difficultyConfidence: "UNKNOWN",
    difficultyBoundaryFlag: "UNKNOWN",
    legacyLevelCompatibility: "UNKNOWN",
    sourceEvidencePath: "pages/page_p001.png",
    fullPageImageRelPath: "pages/page_p001.png",
    image: "assets/q001_visual.png",
    visualAsset: "assets/q001_visual.png",
    hasVisualAsset: true,
    visualAssetProvenance: {
      assetPath: "assets/q001_visual.png",
      assetSha256: "",
      assetBindingType: "DIRECT",
      sourceDocumentSha256,
      sourceQuestionNo: "1",
      sourcePageNo: 1,
      sourcePageEvidence: "pages/page_p001.png",
      sourceBBox: { x1: 1, y1: 1, x2: 10, y2: 10 },
      pngDecodePass: true,
      naturalWidth: 9,
      naturalHeight: 9,
      cropGenerator: "fixture",
      cropStatus: "SEMANTIC_REVIEW_PASS",
      verdict: "PASS",
      checks: {
        CROP_PURITY: true,
        NO_OTHER_QUESTION_TEXT: true,
        NO_CHOICES_CONTAMINATION: true,
        NO_PAGE_BORDER_CONTAMINATION: true,
        NO_CLIPPING: true,
        REQUIRED_LABELS_PRESENT: true,
        QUESTION_SEMANTIC_MATCH: true,
      },
    },
  };
  const assetFile = path.join(examRoot, question.image);
  fs.mkdirSync(path.dirname(assetFile), { recursive: true });
  fs.writeFileSync(assetFile, Buffer.from("fixture-png-bytes"));
  fs.mkdirSync(path.join(examRoot, "pages"), { recursive: true });
  fs.writeFileSync(path.join(examRoot, "pages", "page_p001.png"), Buffer.from("fixture-page-bytes"));
  question.visualAssetProvenance.assetSha256 = fileSha(assetFile);
  const candidateFile = path.join(candidateDir, "fixture.candidate.js");
  let currentExamId = "fixture";
  let manifest;
  const writeCandidate = q => {
    fs.writeFileSync(candidateFile, `window.examTitle = ${JSON.stringify(currentExamId)};\nwindow.questionBank = ${JSON.stringify([q], null, 2)};\n`, "utf8");
  };
  writeCandidate(question);
  const inventory = {
    schema: "PAST_EXAM_SOURCE_INVENTORY_v1",
    examId: "fixture",
    sourceDocumentSha256,
    pageCount: 1,
    expectedQuestionCount: 1,
    status: "SOURCE_INVENTORY_FROZEN",
    questions: [{
      sourceIdentityKey,
      sourceDocumentSha256,
      sourceQuestionNo: "1",
      sourcePageNo: 1,
      sourceOrdinal: 1,
      sourceEvidencePath: "pages/page_p001.png",
      sourcePageEvidencePaths: ["pages/page_p001.png"],
      disposition: "INCLUDED",
    }],
  };
  fs.writeFileSync(path.join(reportsDir, "source_inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  fs.writeFileSync(path.join(reportsDir, "source_identity_map.json"), `${JSON.stringify({ schema: "PAST_EXAM_SOURCE_IDENTITY_MAP_v1", status: "SOURCE_INVENTORY_FROZEN", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), questions: inventory.questions, includedIdentitySet: [sourceIdentityKey] }, null, 2)}\n`);
  const pageSha = fileSha(path.join(examRoot, "pages", "page_p001.png"));
  const fidelity = { schema: "PAST_EXAM_SOURCE_FIDELITY_EVIDENCE_v1", status: "PASS", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), sourceIdentityMapSha: fileSha(path.join(reportsDir, "source_identity_map.json")), items: [{ sourceIdentityKey, sourceQuestionNo: "1", sourcePageNo: 1, sourcePageEvidencePaths: ["pages/page_p001.png"], sourcePageEvidence: [{ path: "pages/page_p001.png", sha256: pageSha }], sourceEvidencePath: "pages/page_p001.png", sourceEvidenceSha256: pageSha, contentChecked: true, choicesChecked: true, verdict: "PASS", contentSha256: objectFileSha(question.content), choicesSha256: objectFileSha(question.choices) }] };
  const inventorySha = fileSha(path.join(reportsDir, "source_inventory.json"));
  const identityMapSha = fileSha(path.join(reportsDir, "source_identity_map.json"));
  const math = { schema: "PAST_EXAM_MATH_REVIEW_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, items: [{ sourceIdentityKey, inputVisibilityProfile: "SOURCE_ONLY", priorAnswerVisible: false, sourceOnlyBlindSolve: true, choiceUniqueness: true, questionValidity: true, solutionChecked: true, solutionConclusionMatches: true, independentAnswer: "163", verdict: "PASS" }] };
  const asset = { schema: "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, items: [{ sourceIdentityKey, ...question.visualAssetProvenance }] };
  for (const [name, value] of [["source_fidelity_evidence.json", fidelity], ["math_review_evidence.json", math], ["asset_provenance_evidence.json", asset]]) fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(value, null, 2)}\n`);
  const handoffFile = path.join(reportsDir, "gpt_gemini_handoff_manifest.json");
  fs.writeFileSync(handoffFile, `${JSON.stringify({ protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }] }, null, 2)}\n`);
  const review = {
    status: "reviewed_pass",
    examId: "fixture",
    candidateSha: fileSha(candidateFile),
    promotionTransactionId: "fixture-transaction",
    sourceIdentitySet: [sourceIdentityKey],
    handoffManifestSha: fileSha(handoffFile),
    protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }],
    sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")),
    sourceIdentityMapSha: fileSha(path.join(reportsDir, "source_identity_map.json")),
    sourceFidelityEvidenceSha: fileSha(path.join(reportsDir, "source_fidelity_evidence.json")),
    mathReviewEvidenceSha: fileSha(path.join(reportsDir, "math_review_evidence.json")),
    assetProvenanceEvidenceSha: fileSha(path.join(reportsDir, "asset_provenance_evidence.json")),
  };
  manifest = { examId: "fixture", archiveRelativePath: "original/high/h1/1final/fixture.js" };
  return { root, examRoot, reportsDir, candidateFile, question, review, manifest, writeCandidate, setExamId(value) { currentExamId = value; manifest.examId = value; review.examId = value; }, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

function activateV3(f, disposition = 'REUSE') {
  const root = repoRoot;
  const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json';
  const crosswalk = JSON.parse(fs.readFileSync(path.join(root, crosswalkPath), 'utf8'));
  const rows = {
    REUSE: crosswalk.records.find(row => row.id === 'H1-RPM-001'),
    BINDING_MIGRATION_GAP: crosswalk.records.find(row => row.id === 'H1-RPM-029'),
    KEY_MIGRATION_GAP: crosswalk.records.find(row => row.id === 'H1-RPM-009'),
    TRUE_TAXONOMY_GAP: null,
  };
  const selected = rows[disposition];
  const original = structuredClone(f.question);
  f.setExamId('24_test_고1');
  f.manifest.archiveRelativePath = 'original/high/h1/1final/fixture.js';
  const q = Object.assign(makeQuestionSkeleton(1, {
    course: '수학(상)', examId: f.manifest.examId, pdfPath: 'source.pdf',
    archiveRelativePath: f.manifest.archiveRelativePath,
  }), original);
  f.question = q;
  const initial = structuredClone(q);
  const masterRows = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/master_tables/js_archive_tag_master.json'), 'utf8'));
  const unitKey = selected?.standardUnitKey || 'H15-SA-01';
  const subUnitKey = selected?.subUnitKey || 'H15-SA-01-POLYNOMIAL_BASIC';
  const unit = masterRows.find(row => row.keyType === 'standardUnitKey' && row.key === unitKey);
  const subUnit = masterRows.find(row => row.keyType === 'subUnitKey' && row.key === subUnitKey);
  Object.assign(q, {
    standardCourse: '수학(상)', standardUnitKey: unitKey, standardUnit: unit.labelKo, standardUnitOrder: Number(unitKey.match(/-(\d+)$/)?.[1]),
    subUnitKey, subUnit: subUnit.labelKo, subUnitConfidence: 'candidate_evidence', subUnitClassificationDepth: 'complete_candidate',
    level: '중',
    problemTypeKey: disposition === 'REUSE' ? selected.problemTypeKey : '',
    templateKey: disposition === 'REUSE' ? selected.templateKey : '',
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    difficultyBucket: disposition === 'REUSE' ? 3 : 'UNKNOWN',
    difficultyConfidence: disposition === 'REUSE' ? 'medium' : 'UNKNOWN',
    difficultyBoundaryFlag: disposition === 'REUSE' ? 'NONE' : 'UNKNOWN',
    legacyLevelCompatibility: disposition === 'REUSE' ? 'NORMAL' : 'UNKNOWN',
  });
  f.writeCandidate(q);
  const inventoryFile = path.join(f.reportsDir, 'source_inventory.json');
  const inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
  inventory.examId = f.manifest.examId;
  inventory.questions[0].sourceOrdinal = 1;
  fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
  const mapFile = path.join(f.reportsDir, 'source_identity_map.json');
  const identityMap = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  identityMap.examId = f.manifest.examId;
  identityMap.sourceInventorySha = fileSha(inventoryFile);
  identityMap.questions = inventory.questions;
  fs.writeFileSync(mapFile, `${JSON.stringify(identityMap, null, 2)}\n`);
  const fidelityFile = path.join(f.reportsDir, 'source_fidelity_evidence.json');
  const fidelity = JSON.parse(fs.readFileSync(fidelityFile, 'utf8'));
  fidelity.sourceInventorySha = fileSha(inventoryFile);
  fidelity.sourceIdentityMapSha = fileSha(mapFile);
  fs.writeFileSync(fidelityFile, `${JSON.stringify(fidelity, null, 2)}\n`);
  const mathFile = path.join(f.reportsDir, 'math_review_evidence.json');
  const math = JSON.parse(fs.readFileSync(mathFile, 'utf8'));
  math.sourceInventorySha = fileSha(inventoryFile);
  math.sourceIdentityMapSha = fileSha(mapFile);
  fs.writeFileSync(mathFile, `${JSON.stringify(math, null, 2)}\n`);
  const assetFile = path.join(f.reportsDir, 'asset_provenance_evidence.json');
  const asset = JSON.parse(fs.readFileSync(assetFile, 'utf8'));
  asset.sourceInventorySha = fileSha(inventoryFile);
  asset.sourceIdentityMapSha = fileSha(mapFile);
  fs.writeFileSync(assetFile, `${JSON.stringify(asset, null, 2)}\n`);
  const handoffFile = path.join(f.reportsDir, 'gpt_gemini_handoff_manifest.json');
  const handoff = JSON.parse(fs.readFileSync(handoffFile, 'utf8'));
  handoff.completionContract = 'PAST_EXAM_V3_COMPLETE';
  handoff.completionBaseline = [initial];
  fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`);

  const solutionIdentity = makeSolutionIdentityDraft({ questions: [q], manifest: f.manifest, inventory });
  solutionIdentity.status = 'PASS';
  Object.assign(solutionIdentity.items[0], {
    inputVisibilityProfile: 'CANDIDATE_ONLY',
    alignmentStatus: 'ALIGNMENT_PASS', primaryMethod: '원문에 주어진 식의 동류항 정리',
    decisiveSteps: ['원문 식에서 동류항을 모은다.', '정리한 식을 결론에 연결한다.'],
    sourceSolutionMatch: true,
  });
  const solutionIdentityFile = path.join(f.reportsDir, 'solution_identity_evidence.json');
  fs.writeFileSync(solutionIdentityFile, `${JSON.stringify(solutionIdentity, null, 2)}\n`);
  const identity = solutionIdentity.items[0];
  const mathRow = math.items[0];
  Object.assign(mathRow, {
    sourceArchiveFile: identity.sourceArchiveFile,
    sourceOrdinal: identity.sourceOrdinal,
    contentHash: identity.contentHash,
    choicesHash: identity.choicesHash,
    imageRefHash: identity.imageRefHash,
    sourceIdentityFingerprint: identity.sourceIdentityFingerprint,
    inputVisibilityProfile: 'SOURCE_ONLY', priorAnswerVisible: false, sourceOnlyBlindSolve: true,
    primaryMethod: solutionIdentity.items[0].primaryMethod,
    decisiveSteps: solutionIdentity.items[0].decisiveSteps,
    independentWork: 'SOURCE_ONLY input을 읽고 해당 문항을 독립적으로 풀어 final solution과 대조했다.',
  });
  fs.writeFileSync(mathFile, `${JSON.stringify(math, null, 2)}\n`);

  const draft = createMetaDecisionDraft({ questions: [q], manifest: f.manifest, inventory, solutionIdentityEvidenceSha: fileSha(solutionIdentityFile) });
  draft.status = disposition === 'REUSE' ? 'PASS' : 'MIGRATION_GAP';
  draft.sourceInventorySha = fileSha(inventoryFile);
  draft.solutionIdentityEvidenceSha = fileSha(solutionIdentityFile);
  const item = draft.items[0];
  Object.assign(item, {
    primaryMethod: solutionIdentity.items[0].primaryMethod,
    decisiveStep: solutionIdentity.items[0].decisiveSteps[0],
    semanticReason: '원문과 독립 검증된 final solution의 decisive step을 기준으로 RPM path를 먼저 조회하고 ACTIVE binding을 대조했다.',
    disposition,
    integrationReason: '주개념 경로만으로 결정적 풀이가 완결된다.',
  });
  const pathData = selected?.rpmPath || { majorUnit: '다항식', midUnit: '다항식의 연산', l3: '테스트용 taxonomy 부재', l4: '테스트용 템플릿 부재' };
  const scope = selected?.scope || '수학_상';
  const activeRegistry = loadActiveMetaRegistry(root);
  const resolverInput = {
    sourceIdentity: {
      sourceArchiveFile: identity.sourceArchiveFile, questionUid: questionUidForSource(identity.sourceArchiveFile, identity.sourceOrdinal),
      sourceIdentityKey: identity.sourceIdentityKey, sourceOrdinal: identity.sourceOrdinal,
      contentHash: identity.contentHash, choicesHash: identity.choicesHash, imageRefHash: identity.imageRefHash,
      sourceIdentityFingerprint: identity.sourceIdentityFingerprint,
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: identity.solutionHash },
    curriculumContext: { grade: 'H1', curriculum: '2015', scope, standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey },
    semanticDecision: { primaryMethod: item.primaryMethod, decisiveStep: item.decisiveStep, rpmPath: { curriculum: '2015', scope, ...pathData } },
    ...(disposition === 'TRUE_TAXONOMY_GAP' ? { activeSearchEvidence: {
      status: 'COMPLETED_NO_MATCH', searchedGlobalActive: true, candidateKeys: [], registrySha: activeRegistry.registrySha,
      searchMethod: 'GLOBAL_ACTIVE_TARGETED_BY_EXACT_CURRICULUM_L1_L2',
      searchedScope: { curriculum: '2015', standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey },
    } } : {}),
  };
  const resolverEvidence = resolveMetaRoute(resolverInput, { repoRoot: root, registry: activeRegistry });
  const semanticMetaEvidence = {
    schemaVersion: 'JS_ARCHIVE_RELATIONAL_META_EVIDENCE_v1', sourceFingerprint: resolverEvidence.sourceFingerprint,
    inputBundleSha: resolverEvidence.inputBundleSha, candidateVisibleDuringDecision: false,
    crossConceptDecisions: [], conditionDecisions: [],
  };
  semanticMetaEvidence.evidenceSha = objectFileSha(semanticMetaEvidence);
  const difficultyEvidence = disposition === 'REUSE' ? makeDifficultyEvidence({
    status: 'PASS', blindPassStatus: 'FRESH_INDEPENDENT', sourceFingerprint: resolverEvidence.sourceFingerprint,
    solutionHash: identity.solutionHash, independentOfSemanticPass: true,
    difficultyBucket: q.difficultyBucket, difficultyConfidence: q.difficultyConfidence,
    difficultyBoundaryFlag: q.difficultyBoundaryFlag, legacyLevelCompatibility: q.legacyLevelCompatibility,
    rationale: '독립 풀이의 계산 단계와 조건 수를 기준으로 fresh 판정했다.', blindReviewerId: 'fixture-reviewer',
    decisionSha: objectFileSha({ uid: identity.sourceIdentityKey, bucket: q.difficultyBucket }),
  }) : { status: 'NOT_TESTED' };
  const candidateMeta = {
    standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey,
    problemTypeKey: q.problemTypeKey, templateKey: q.templateKey, crossConceptKeys: q.crossConceptKeys,
    conditionKeys: q.conditionKeys, integrationPattern: q.integrationPattern, integrationReason: item.integrationReason,
    difficultyBucket: q.difficultyBucket, difficultyConfidence: q.difficultyConfidence,
    difficultyBoundaryFlag: q.difficultyBoundaryFlag, legacyLevelCompatibility: q.legacyLevelCompatibility,
  };
  const built = buildResolverBackedMetaEvidence({ input: resolverInput, candidateMeta, semanticMetaEvidence, difficultyEvidence, repoRoot: root, registry: activeRegistry });
  Object.assign(item, {
    resolverInput, resolverEvidence: built.resolverEvidence, semanticMetaEvidence: built.semanticMetaEvidence,
    difficultyEvidence: built.difficultyEvidence, validatorReceipt: built.validatorReceipt,
  });
  const metaFile = path.join(f.reportsDir, 'meta_decision_evidence.json');
  fs.writeFileSync(metaFile, `${JSON.stringify(draft, null, 2)}\n`);
  Object.assign(f.review, {
    candidateSha: fileSha(f.candidateFile),
    handoffManifestSha: fileSha(handoffFile),
    sourceInventorySha: fileSha(inventoryFile),
    sourceIdentityMapSha: fileSha(mapFile),
    sourceFidelityEvidenceSha: fileSha(fidelityFile),
    mathReviewEvidenceSha: fileSha(mathFile),
    assetProvenanceEvidenceSha: fileSha(assetFile),
    solutionIdentityEvidenceSha: fileSha(solutionIdentityFile),
    metaDecisionEvidenceSha: fileSha(metaFile),
  });
  f.review.changedFields = ['standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth', 'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'level'];
  return f;
}

function sharedMaterialFixture() {
  const f = fixture();
  const q1 = structuredClone(f.question);
  const q2 = structuredClone(f.question);
  q2.id = 2;
  q2.content = "공통 그림을 이용하여 두 번째 문항을 해결하여라.";
  q2.sourceQuestionNo = "2";
  q2.sourceIdentityKey = `${q2.sourceDocumentSha256}|2`;
  const shared = {
    ...q1.visualAssetProvenance,
    assetBindingType: "SHARED_MATERIAL",
    sharedMaterialUid: "shared-material-1",
    dependencyQuestionSet: ["1", "2"],
    sourceQuestionNo: "1",
  };
  q1.visualAssetProvenance = structuredClone(shared);
  q2.visualAssetProvenance = structuredClone(shared);
  fs.writeFileSync(f.candidateFile, `window.examTitle = "fixture";\nwindow.questionBank = ${JSON.stringify([q1, q2], null, 2)};\n`, "utf8");
  const inventory = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "source_inventory.json"), "utf8"));
  inventory.expectedQuestionCount = 2;
  inventory.questions.push({
    sourceIdentityKey: q2.sourceIdentityKey,
    sourceDocumentSha256: q2.sourceDocumentSha256,
    sourceQuestionNo: "2",
    sourcePageNo: 1,
    sourceEvidencePath: "pages/page_p001.png",
    sourcePageEvidencePaths: ["pages/page_p001.png"],
    disposition: "INCLUDED",
  });
  const inventoryFile = path.join(f.reportsDir, "source_inventory.json");
  fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
  const mapFile = path.join(f.reportsDir, "source_identity_map.json");
  fs.writeFileSync(mapFile, `${JSON.stringify({ schema: "PAST_EXAM_SOURCE_IDENTITY_MAP_v1", status: "SOURCE_INVENTORY_FROZEN", sourceInventorySha: fileSha(inventoryFile), questions: inventory.questions, includedIdentitySet: [q1.sourceIdentityKey, q2.sourceIdentityKey] }, null, 2)}\n`);
  const pageFile = path.join(f.examRoot, "pages", "page_p001.png");
  const pageSha = fileSha(pageFile);
  const fidelity = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "source_fidelity_evidence.json"), "utf8"));
  fidelity.sourceInventorySha = fileSha(inventoryFile);
  fidelity.sourceIdentityMapSha = fileSha(mapFile);
  const fidelityItem = fidelity.items[0];
  fidelity.items.push({ ...fidelityItem, sourceIdentityKey: q2.sourceIdentityKey, sourceQuestionNo: "2", contentSha256: objectFileSha(q2.content) });
  fs.writeFileSync(path.join(f.reportsDir, "source_fidelity_evidence.json"), `${JSON.stringify(fidelity, null, 2)}\n`);
  const math = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "math_review_evidence.json"), "utf8"));
  math.sourceInventorySha = fileSha(inventoryFile);
  math.sourceIdentityMapSha = fileSha(mapFile);
  math.items.push({ ...math.items[0], sourceIdentityKey: q2.sourceIdentityKey });
  fs.writeFileSync(path.join(f.reportsDir, "math_review_evidence.json"), `${JSON.stringify(math, null, 2)}\n`);
  const asset = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "asset_provenance_evidence.json"), "utf8"));
  asset.sourceInventorySha = fileSha(inventoryFile);
  asset.sourceIdentityMapSha = fileSha(mapFile);
  asset.items = [{ sourceIdentityKey: q1.sourceIdentityKey, ...q1.visualAssetProvenance }, { sourceIdentityKey: q2.sourceIdentityKey, ...q2.visualAssetProvenance }];
  fs.writeFileSync(path.join(f.reportsDir, "asset_provenance_evidence.json"), `${JSON.stringify(asset, null, 2)}\n`);
  const handoffFile = path.join(f.reportsDir, "gpt_gemini_handoff_manifest.json");
  fs.writeFileSync(handoffFile, `${JSON.stringify({ protectedPayload: [{ sourceIdentityKey: q1.sourceIdentityKey, sha256: protectedPayloadSha(q1) }, { sourceIdentityKey: q2.sourceIdentityKey, sha256: protectedPayloadSha(q2) }] }, null, 2)}\n`);
  f.review = {
    ...f.review,
    candidateSha: fileSha(f.candidateFile),
    handoffManifestSha: fileSha(handoffFile),
    sourceInventorySha: fileSha(inventoryFile),
    sourceIdentityMapSha: fileSha(mapFile),
    sourceFidelityEvidenceSha: fileSha(path.join(f.reportsDir, "source_fidelity_evidence.json")),
    mathReviewEvidenceSha: fileSha(path.join(f.reportsDir, "math_review_evidence.json")),
    assetProvenanceEvidenceSha: fileSha(path.join(f.reportsDir, "asset_provenance_evidence.json")),
    sourceIdentitySet: [q1.sourceIdentityKey, q2.sourceIdentityKey],
    protectedPayload: [{ sourceIdentityKey: q1.sourceIdentityKey, sha256: protectedPayloadSha(q1) }, { sourceIdentityKey: q2.sourceIdentityKey, sha256: protectedPayloadSha(q2) }],
  };
  return f;
}

test("positive source, fidelity, math, asset and handoff fixture is promotable", () => {
  const f = fixture();
  try {
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "PASS");
    assert.deepEqual(result.identityKeys, [f.question.sourceIdentityKey]);
  } finally { f.cleanup(); }
});

test("source identity drift blocks with an explicit source-question failure", () => {
  const f = fixture();
  try {
    const wrong = { ...f.question, sourceQuestionNo: "8", sourceIdentityKey: `${f.question.sourceDocumentSha256}|8` };
    f.writeCandidate(wrong);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "BLOCKED");
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_QUESTION_IDENTITY_FAIL")));
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_INVENTORY_COVERAGE_FAIL")));
  } finally { f.cleanup(); }
});

test("an inventory of 25 questions cannot be silently reduced to an 18-question candidate", () => {
  const f = fixture();
  try {
    const inventoryFile = path.join(f.reportsDir, "source_inventory.json");
    const inventory = JSON.parse(fs.readFileSync(inventoryFile, "utf8"));
    for (let index = 2; index <= 25; index += 1) inventory.questions.push({
      sourceIdentityKey: `${inventory.sourceDocumentSha256}|${index}`,
      sourceDocumentSha256: inventory.sourceDocumentSha256,
      sourceQuestionNo: String(index),
      sourcePageNo: 1,
      sourceEvidencePath: "pages/page_p001.png",
      disposition: "INCLUDED",
    });
    inventory.expectedQuestionCount = 25;
    fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_INVENTORY_COVERAGE_FAIL")));
  } finally { f.cleanup(); }
});

test("wrong asset identity and contaminated crop are hard failures", () => {
  const f = fixture();
  try {
    const wrongAsset = structuredClone(f.question);
    wrongAsset.visualAssetProvenance.sourceQuestionNo = "20";
    wrongAsset.visualAssetProvenance.checks.CROP_PURITY = false;
    f.writeCandidate(wrongAsset);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("QUESTION_ASSET_IDENTITY_MISMATCH")));
    assert.ok(result.errors.some(error => error.startsWith("CROP_PURITY_FAIL")));
  } finally { f.cleanup(); }
});

test("shared material provenance permits one visual asset for its declared dependency set", () => {
  const f = sharedMaterialFixture();
  try {
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "PASS", JSON.stringify(result.errors));
  } finally { f.cleanup(); }
});

test("independent math evidence catches an answer that contradicts the blind solve", () => {
  const f = fixture();
  try {
    const mathFile = path.join(f.reportsDir, "math_review_evidence.json");
    const math = JSON.parse(fs.readFileSync(mathFile, "utf8"));
    math.items[0].independentAnswer = "95";
    fs.writeFileSync(mathFile, `${JSON.stringify(math, null, 2)}\n`);
    f.review.mathReviewEvidenceSha = fileSha(mathFile);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("MATH_REVIEW_FAIL")));
  } finally { f.cleanup(); }
});

test("serialization and handoff mutation locks fail closed", () => {
  const f = fixture();
  try {
    const bad = { ...f.question, content: "깨진 $식", solution: "\u0001" };
    f.writeCandidate(bad);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile), changedFields: ["content"] };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.includes("SERIALIZATION_FAIL"));
    assert.ok(result.errors.includes("ANSWER_SOLUTION_SCOPE_VIOLATION"));
  } finally { f.cleanup(); }
});

test("placeholder and incomplete objective payloads cannot reach promotion", () => {
  const f = fixture();
  try {
    const bad = { ...f.question, questionType: "객관식", content: "Source question 8 unresolved", choices: ["1", "2"] };
    f.writeCandidate(bad);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile) };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.includes("PLACEHOLDER_PAYLOAD:q1"));
    assert.ok(result.errors.includes("CHOICES_STRUCTURE_FAIL:q1"));
  } finally { f.cleanup(); }
});

test("release remains blocked until exact ZIP and all three real renders pass", () => {
  const hash = sha("bound");
  assert.throws(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", render: { exam: "NOT_TESTED", sol: "PASS", ans: "PASS" } }), /RELEASE_BLOCKED:exam/);
  assert.doesNotThrow(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", packageApplicable: true, exactDeliverableZip: true, freshExtraction: true, browserTested: true, zipSha256: hash, extractedTreeSha256: hash, candidateSha: hash, productionSha: hash, runtimeBundleSha: hash, renderEvidenceSha: hash, render: { exam: "PASS", sol: "PASS", ans: "PASS" }, packageRender: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
  assert.doesNotThrow(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", packageApplicable: false, portablePackageStatus: "NOT_APPLICABLE", browserTested: true, candidateSha: hash, productionSha: hash, runtimeBundleSha: hash, renderEvidenceSha: hash, render: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
});

test("portable ZIP gate detects a manifest path that differs from the exact entry name", () => {
  const f = fixture();
  const zip = path.join(f.root, "fixture.zip");
  const zipManifest = path.join(f.root, "zip-manifest.json");
  try {
    const script = "import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr('한글/원본.hwp', b'x'); z.close()";
    const made = spawnSync("python", ["-c", script, zip], { encoding: "utf8" });
    assert.equal(made.status, 0, made.stderr);
    fs.writeFileSync(zipManifest, JSON.stringify({ manifestPath: "한글/원본-손상.hwp", files: [{ path: "한글/원본-손상.hwp" }] }));
    const result = validatePortableZip({ zipFile: zip, manifestFile: zipManifest });
    assert.equal(result.status, "FAIL");
    assert.ok(result.errors.some(error => error.startsWith("MANIFEST_PATH_MISSING")), JSON.stringify(result));
  } finally { f.cleanup(); }
});

test("direct production write guard requires a promotion receipt", () => {
  assert.throws(() => productionWritePreflight({ changedPaths: ["archive/exams/original/high/h1/1final/x.js"], receipt: {} }), /UNAUTHORIZED_PRODUCTION_WRITE/);
  const value = "sha256:" + "a".repeat(64);
  assert.equal(productionWritePreflight({ changedPaths: ["archive/db.js"], receipt: { status: "AUTHORIZED", candidateSha: value, closureManifestSha: value, sourceIdentitySetSha: value, reviewedPassEnvelopeSha: value, promotionTransactionId: "tx" } }).status, "PASS");
});

test('new Past Exam source skeleton includes the complete advanced metadata contract', () => {
  const q = makeQuestionSkeleton(2, { examId: '24_test_고1', course: '수학(상)', pdfPath: 'source.pdf', archiveRelativePath: 'original/high/h1/1mid/test.js' });
  assert.deepEqual({
    problemTypeKey: q.problemTypeKey, templateKey: q.templateKey,
    crossConceptKeys: q.crossConceptKeys, conditionKeys: q.conditionKeys,
    integrationPattern: q.integrationPattern, difficultyBucket: q.difficultyBucket,
    difficultyConfidence: q.difficultyConfidence, difficultyBoundaryFlag: q.difficultyBoundaryFlag,
    legacyLevelCompatibility: q.legacyLevelCompatibility,
  }, {
    problemTypeKey: '', templateKey: '', crossConceptKeys: [], conditionKeys: [],
    integrationPattern: 'NONE', difficultyBucket: 'UNKNOWN', difficultyConfidence: 'UNKNOWN',
    difficultyBoundaryFlag: 'UNKNOWN', legacyLevelCompatibility: 'UNKNOWN',
  });
  assert.equal(q.sourceArchiveFile, 'original/high/h1/1mid/test.js');
  assert.equal(q.sourceOrdinal, 2);
  assert.equal('conceptClusterKey' in q, false);
  const contract = JSON.parse(fs.readFileSync(path.join(repoRoot, 'archive/tools/past-exam-pipeline/completion-contract.json'), 'utf8'));
  for (const key of ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    assert.ok(contract.allowedCompletionFields.includes(key), `${key} missing from completion allowlist`);
    assert.ok(contract.completionFieldSchemas[key], `${key} schema missing`);
  }
  assert.deepEqual(contract.completionFieldContract.rpmLookupOrder, RPM_LOOKUP_ORDER);
});

test('shared ACTIVE Meta Foundation validator accepts the real H1 pack/runtime parity fixture', () => {
  const script = path.join(repoRoot, 'archive/tools/meta-foundation/validate-meta-foundation-pack.mjs');
  const run = spawnSync(process.execPath, [script,
    '--pack-dir', 'archive/data/meta-foundation/canonical/packs/h1-foundation',
    '--assignments', 'archive/data/meta-foundation/evidence/high1/v1/item_metadata_assignments_1170.json',
    '--runtime', 'archive/data/meta-foundation/runtime/h1-foundation-v1.json',
    '--compiled-root', 'archive/data/meta-foundation/compiled'],
  { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, 'PASS');
  assert.equal(result.counts.assignments, 1170);
  assert.equal(result.counts.failures, 0);
});

test('completion evidence command creates hash-bound NOT_TESTED drafts without manufacturing PASS', () => {
  const f = fixture();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'past-completion-drafts-'));
  try {
    const inventoryFile = path.join(f.reportsDir, 'source_inventory.json');
    const script = path.join(repoRoot, 'archive/tools/past-exam-pipeline/build-completion-evidence.mjs');
    fs.writeFileSync(path.join(f.root, 'manifest.json'), JSON.stringify(f.manifest));
    const run = spawnSync(process.execPath, [script, '--manifest', path.join(f.root, 'manifest.json'), '--candidate', f.candidateFile, '--inventory', inventoryFile, '--out-dir', out], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const identity = JSON.parse(fs.readFileSync(path.join(out, 'solution_identity_evidence.json'), 'utf8'));
    const meta = JSON.parse(fs.readFileSync(path.join(out, 'meta_decision_evidence.json'), 'utf8'));
    assert.equal(identity.status, 'NOT_TESTED');
    assert.equal(meta.status, 'NOT_TESTED');
    assert.equal(identity.items[0].solutionHash.length > 0, true);
    assert.equal(run.stdout.includes('"passGranted": false'), true);
  } finally { f.cleanup(); fs.rmSync(out, { recursive: true, force: true }); }
});

test('source → candidate → solution identity → RPM/ACTIVE metadata → pre-promotion dry run closes without production writes', () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    const pass = validatePastExamPromotion(f);
    assert.equal(pass.status, 'PASS', JSON.stringify(pass.errors));
    assert.equal(pass.eligibility.BASIC_ARCHIVE_ELIGIBLE, true);
    assert.equal(pass.eligibility.ADVANCED_META_ELIGIBLE, true, JSON.stringify({ errors: pass.errors, metaEligibility: pass.metaEligibility }));
    assert.equal(pass.metaEligibility.status, 'PASS');
    assert.equal(pass.metaEligibility.rows[0].disposition, 'EXISTING_REUSE');
    const metaEvidence = JSON.parse(fs.readFileSync(path.join(f.reportsDir, 'meta_decision_evidence.json'), 'utf8'));
    const resolvedItem = metaEvidence.items[0];
    const r2eCandidateMeta = {
      standardCourse: f.question.standardCourse, standardUnitKey: f.question.standardUnitKey,
      subUnitKey: f.question.subUnitKey, curriculum: '2015',
      problemTypeKey: f.question.problemTypeKey, templateKey: f.question.templateKey,
      crossConceptKeys: f.question.crossConceptKeys, conditionKeys: f.question.conditionKeys,
      integrationPattern: f.question.integrationPattern, integrationReason: resolvedItem.integrationReason,
      difficultyBucket: f.question.difficultyBucket, difficultyConfidence: f.question.difficultyConfidence,
      difficultyBoundaryFlag: f.question.difficultyBoundaryFlag, legacyLevelCompatibility: f.question.legacyLevelCompatibility,
    };
    const runtimeRecord = {
      questionUid: resolvedItem.resolverInput.sourceIdentity.questionUid,
      sourceFingerprint: resolvedItem.resolverEvidence.sourceFingerprint,
      resolverEvidenceSha: resolvedItem.resolverEvidence.evidenceSha,
      difficultyEvidenceSha: resolvedItem.difficultyEvidence.evidenceSha,
      ...Object.fromEntries(['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'].map(field => [field, r2eCandidateMeta[field]])),
    };
    const r2eReceipt = sealR2EMetaReceipt({
      schemaVersion: 'JS_ARCHIVE_R2E_META_RECEIPT_v1', stage: 'R2E_FINAL',
      unresolvedSemanticCount: 0, unresolvedProposalCount: 0, unresolvedCrossConceptCandidateCount: 0,
      metaHoldCount: 0, migrationGapCount: 0, runtimeParityFailureCount: 0,
      items: [{
        questionUid: resolvedItem.resolverInput.sourceIdentity.questionUid,
        input: resolvedItem.resolverInput,
        resolverEvidence: resolvedItem.resolverEvidence,
        difficultyEvidence: resolvedItem.difficultyEvidence,
        candidateMeta: r2eCandidateMeta,
        semanticMetaEvidence: resolvedItem.semanticMetaEvidence,
        validatorReceipt: resolvedItem.validatorReceipt,
        r2eFinalDisposition: 'EXISTING_REUSE',
        runtimeRecord,
      }],
    });
    const r2eValidation = validateR2EReceipt(r2eReceipt, {
      repoRoot, sourceArchiveFile: f.manifest.archiveRelativePath, sourceQuestions: [f.question],
    });
    assert.equal(r2eValidation.status, 'PASS', JSON.stringify(r2eValidation.errors));
    assert.equal(fs.existsSync(path.join(repoRoot, 'archive/exams', f.manifest.archiveRelativePath)), false);
    // No changedFields declaration can hide an actual protected layout mutation.
    f.question.layoutTag = 'fullwidth';
    f.writeCandidate(f.question); f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.includes('ANSWER_SOLUTION_SCOPE_VIOLATION:q1:layoutTag'));
  } finally { f.cleanup(); }
});

for (const [disposition, reason] of [
  ['BINDING_MIGRATION_GAP', 'existing active keys without a curriculum binding'],
  ['KEY_MIGRATION_GAP', 'RPM path without active key materialization'],
  ['TRUE_TAXONOMY_GAP', 'neither RPM path nor active taxonomy match'],
]) test(`advanced metadata ${reason} leaves basic archive eligibility available`, () => {
  const f = activateV3(fixture(), disposition);
  try {
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'PASS', JSON.stringify(report.errors));
    assert.equal(report.eligibility.BASIC_ARCHIVE_ELIGIBLE, true);
    assert.equal(report.eligibility.ADVANCED_META_ELIGIBLE, false);
    assert.equal(report.metaEligibility.status, disposition === 'TRUE_TAXONOMY_GAP' ? 'HOLD' : 'MIGRATION_GAP');
    assert.equal(report.metaEligibility.rows[0].disposition, disposition === 'TRUE_TAXONOMY_GAP' ? 'TRUE_TAXONOMY_GAP' : 'RPM_PRIMARY_MIGRATION_GAP');
    assert.equal(f.question.problemTypeKey, '');
    assert.equal(f.question.templateKey, '');
  } finally { f.cleanup(); }
});

for (const [name, mutate, errorPrefix] of [
  ['invalid problem type', q => { q.problemTypeKey = 'PT_NOT_ACTIVE_OR_CANDIDATE'; }, 'ADVANCED_META_PROBLEM_TYPE_INVALID'],
  ['template parent mismatch', (q, registry) => { q.templateKey = [...registry.templates.values()].find(row => row.parentProblemTypeKey !== q.problemTypeKey).templateKey; }, 'ADVANCED_META_TEMPLATE_PARENT_MISMATCH'],
  ['invalid CrossConcept key', q => { q.crossConceptKeys = ['CC_FREE_TEXT_ALIAS']; }, 'ADVANCED_META_CROSS_CONCEPT_INVALID'],
  ['invalid Condition key', q => { q.conditionKeys = ['COND_FREE_TEXT']; }, 'ADVANCED_META_CONDITION_INVALID'],
  ['invalid IntegrationPattern', q => { q.integrationPattern = 'ARBITRARY_LABEL'; }, 'ADVANCED_META_INTEGRATION_PATTERN_INVALID'],
  ['invalid difficulty bucket', q => { q.difficultyBucket = 6; }, 'ADVANCED_META_DIFFICULTY_BUCKET_INVALID'],
]) test(`production meta validator blocks ${name}`, () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    mutate(f.question, loadActiveMetaRegistry());
    f.writeCandidate(f.question);
    f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.some(error => error.startsWith(errorPrefix)), report.errors.join('\n'));
    assert.equal(report.eligibility.BASIC_ARCHIVE_ELIGIBLE, false);
    assert.equal(report.eligibility.ADVANCED_META_ELIGIBLE, false);
  } finally { f.cleanup(); }
});

test('final solution/source identity mismatch blocks V3 promotion', () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    f.question.solution = '이 해설은 다른 문항을 풀고 있다.';
    f.writeCandidate(f.question);
    f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.some(error => error.startsWith('SOLUTION_IDENTITY_MISMATCH:q1:solutionHash')));
  } finally { f.cleanup(); }
});

test('candidate or deprecated taxonomy keys cannot be promoted as advanced metadata', () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    f.question.problemTypeKey = 'PT_CANDIDATE_OR_DEPRECATED';
    f.writeCandidate(f.question);
    f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.equal(report.eligibility.ADVANCED_META_ELIGIBLE, false);
    assert.ok(report.errors.some(error => error.startsWith('ADVANCED_META_PROBLEM_TYPE_INVALID')));
  } finally { f.cleanup(); }
});

test('source ordinal alone cannot bind a solution to a different source row', () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    f.question.sourceOrdinal = 2;
    f.writeCandidate(f.question);
    f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.includes('SOLUTION_IDENTITY_ORDINAL_MISMATCH:q1'));
  } finally { f.cleanup(); }
});

test('V3 BASIC eligibility still checks canonical L1/L2 label and order', () => {
  const f = activateV3(fixture(), 'REUSE');
  try {
    f.question.standardUnitOrder += 1;
    f.writeCandidate(f.question);
    f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.includes('CURRICULUM_UNIT_ORDER_MISMATCH:q1'));
    assert.equal(report.eligibility.BASIC_ARCHIVE_ELIGIBLE, false);
  } finally { f.cleanup(); }
});
