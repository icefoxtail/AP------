import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventoryPath = path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json');
const progressPath = path.join(generatedRoot, 'M1_PROGRESS.json');
const statePath = path.join(generatedRoot, 'STATE.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const batchNo = Number(process.argv[2]);
const exam = inventory.exams[batchNo - 1];
if (!exam || exam.batchNo !== batchNo) throw new Error('Usage: close-middle1-batch.mjs <1..31>');
if (state.completedBatchCount !== batchNo - 1) throw new Error(`Out-of-order batch closure ${batchNo}`);
const dir = path.join(root, exam.artifactPath);
const validation = JSON.parse(fs.readFileSync(path.join(dir, 'VALIDATION.json'), 'utf8'));
const requiredChecked = ['sourceCount','protectedFields','decisionIsolatedInput','inputHashes','imageDependencies','modelPinning','aAndBEvidence','workerQualityClosure','conflictDenominator','cCoverage','consensus','parentValidity','candidateRegistryValidity','sourceQualityHold','difficultyInput','difficultyCoverage','blindFirstOrder','legacyCompare','mandatoryRecheck','finalDifficulty','metadataOnlyMutation','writebackCoverage'];
if (validation.status !== 'SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS_GLOBAL_CANONICAL_PENDING' || validation.failures.length || requiredChecked.some(key => validation.checked[key] !== true)) throw new Error('Batch validation is not scoped-closed');
const readJsonl = name => fs.readFileSync(path.join(dir, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const consensus = readJsonl('CONSENSUS.jsonl');
const finalDifficulty = readJsonl('DIFFICULTY_FINAL.jsonl');
const quality = readJsonl('SOURCE_QUALITY.jsonl');
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'CONSENSUS_PLAN.json'), 'utf8'));
const writeback = JSON.parse(fs.readFileSync(path.join(dir, 'WRITEBACK_RECEIPT.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_CUMULATIVE_TAXONOMY_REGISTRY.json'), 'utf8'));
if (consensus.length !== exam.questionRowCount || finalDifficulty.length !== consensus.length || quality.length !== consensus.length) throw new Error('Batch denominator changed after validation');
const holdCount = quality.filter(x => x.disposition !== 'HOLD_RESOLVED_NO_SOURCE_MUTATION').length;
const routeOut = consensus.filter(x => x.reviewStatus === 'ROUTE_OUT').length;
const bucketCounts = Object.fromEntries([1,2,3,4,5].map(n => [n, finalDifficulty.filter(x => x.difficultyBucket === n).length]));
const compatibilityCounts = finalDifficulty.reduce((acc,x) => (acc[x.legacyLevelCompatibility] = (acc[x.legacyLevelCompatibility] || 0) + 1, acc), {});
const offTopicOrdinals = quality.filter(x => x.issueType === 'OFF_TOPIC_SOLUTION').map(x => x.sourceOrdinal);
const misleadingOrdinals = quality.filter(x => x.issueType === 'MISLEADING_SOLUTION').map(x => x.sourceOrdinal);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const artifactNames = ['INVENTORY.json','INPUT_BUNDLE.jsonl','LUNA_A.jsonl','LUNA_B.jsonl','AB_COMPARISON.jsonl','CONFLICT_INPUT.jsonl','CONFLICT_C.jsonl','CONSENSUS.jsonl','SOURCE_QUALITY.jsonl','DIFFICULTY_INPUT.jsonl','DIFFICULTY.jsonl','DIFFICULTY_FREEZE_RECEIPT.json','LEGACY_COMPARE.jsonl','DIFFICULTY_RECHECK_QUEUE.jsonl','DIFFICULTY_RECHECK.jsonl','DIFFICULTY_FINAL.jsonl','WRITEBACK_RECEIPT.json','VALIDATION.json'];
for (const optional of ['A_REVIEW_INPUT_01_09.jsonl','LUNA_A_PRE_CORRECTION.jsonl','LUNA_A_REVISION_01_09.jsonl','WORKER_QUALITY_REJECTIONS.json','B_REVIEW_INPUT_03.jsonl','LUNA_B_PRE_CORRECTION.jsonl','LUNA_B_REVISION_03.jsonl','WORKER_QUALITY_REJECTION_B.json']) if (fs.existsSync(path.join(dir, optional))) artifactNames.push(optional);
const artifactHashes = Object.fromEntries(artifactNames.map(name => [name, sha(fs.readFileSync(path.join(dir, name)))]));
const lines = [
  `# M1 Meta Foundation — Batch ${String(batchNo).padStart(2,'0')} checkpoint report`,
  '',
  `- BASE_MAIN_SHA: \`${inventory.baseMainSha}\``,
  `- Branch: \`${inventory.branch}\``,
  `- Source: \`${exam.sourceArchiveFile}\``,
  `- Exam title: ${exam.examTitle}`,
  `- Rows / unique UID: **${exam.questionRowCount}/${new Set(consensus.map(x => x.questionUid)).size}**`,
  `- A/B reviewed: **${validation.counts.AReviewed}/${validation.counts.BReviewed}**`,
  `- A/B semantic agreement / actual conflict: **${exam.questionRowCount - validation.counts.abConflicts}/${validation.counts.abConflicts}**`,
  `- C blind reviewed: **${validation.counts.CReviewed}/${validation.counts.abConflicts}**`,
  `- Worker-quality rejected and source-revised UIDs: **${validation.counts.workerQualityRejectedUidCount || 0}**`,
  `- Sol direct source read (including image where relevant): **${plan.rootDirectReadOrdinals.length} UID** (${plan.rootDirectReadOrdinals.join(', ') || 'none'})`,
  `- Semantic HOLD / ROUTE_OUT: **${validation.counts.consensusHolds}/${routeOut}**`,
  `- Source/solution quality HOLD: **${holdCount}**; source/answer BLOCK **${quality.filter(x => x.disposition === 'SOURCE_BLOCKED').length}**`,
  `- L1 corrections / L2 corrections: **${writeback.l1ChangedCount}/${writeback.l2ChangedCount}**`,
  `- Batch provisional L3 / L4 / CrossConcept usage: **${new Set(consensus.map(x => x.problemTypeKey)).size}/${new Set(consensus.map(x => x.templateKey)).size}/${new Set(consensus.flatMap(x => x.crossConceptKeys)).size}**`,
  `- Cumulative candidate L3 / L4 / CrossConcept: **${registry.counts.candidateProblemTypes}/${registry.counts.candidateTemplates}/${registry.counts.candidateCrossConcepts}**`,
  `- Difficulty distribution 1–5: **${[1,2,3,4,5].map(n => bucketCounts[n]).join(' / ')}**`,
  `- Legacy compatibility: ${Object.entries(compatibilityCounts).map(([key,count]) => `${key} ${count}`).join('; ')}`,
  `- Mandatory difficulty recheck: **${validation.counts.recheckReviewed}/${validation.counts.recheckQueue}**`,
  `- Validator: **${validation.status}**, failure count **${validation.failures.length}**`,
  `- Protected field mutation: **${writeback.protectedMutationCount}**; non-metadata mutation **${writeback.nonMetadataMutationCount}**`,
  `- Source JS SHA-256 after writeback: \`${writeback.writtenSourceSha256}\``,
  '',
  '## Deferred global gates',
  '',
  'ACTIVE canonical promotion, global taxonomy compression, compiled/runtime parity and Archive2 join remain deferred until all 31 exam batches close. This scoped checkpoint is not a global production PASS.',
  '',
  '## Source quality and worker findings',
  '',
  `${holdCount} archived solutions remain on explicit quality HOLD. Off-topic solution ordinals: ${offTopicOrdinals.length ? offTopicOrdinals.map(n => `#${n}`).join(', ') : 'none'}. Misleading solution ordinals: ${misleadingOrdinals.length ? misleadingOrdinals.map(n => `#${n}`).join(', ') : 'none'}. Root direct-read ordinals: ${plan.rootDirectReadOrdinals.length ? plan.rootDirectReadOrdinals.map(n => `#${n}`).join(', ') : 'none'}. No protected source field was edited.`,
  '',
  '## Artifact SHA-256',
  '',
  ...Object.entries(artifactHashes).map(([name,hash]) => `- \`${name}\`: \`${hash}\``),
  ''
];
fs.writeFileSync(path.join(dir, 'BATCH_REPORT.md'), lines.join('\n'));
const checkpointMarker = 'SELF_CHECKPOINT_SHA_PENDING_PUSH';
exam.status = 'SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS';
exam.checkpointCommit = checkpointMarker;
progress.batches[batchNo - 1] = { ...progress.batches[batchNo - 1], status: exam.status, aReviewed: validation.counts.AReviewed, bReviewed: validation.counts.BReviewed, abConflicts: validation.counts.abConflicts, cReviewed: validation.counts.CReviewed, solDirectRead: plan.rootDirectReadOrdinals.length, hold: holdCount, semanticHold: validation.counts.consensusHolds, solutionQualityHold: validation.counts.solutionQualityHold, routeOut, validationStatus: validation.status, checkpointCommit: checkpointMarker };
const completedExams = inventory.exams.filter(x => x.status === 'SCOPED_BATCH_CLOSED_WITH_EXPLICIT_HOLDS');
const completedUids = completedExams.flatMap(x => readJsonlFrom(x.artifactPath, 'CONSENSUS.jsonl').map(y => y.questionUid));
function readJsonlFrom(artifactPath, name) { return fs.readFileSync(path.join(root, artifactPath, name), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse); }
state.currentStage = batchNo === inventory.exams.length ? 'B31_SCOPED_CLOSED_PENDING_GLOBAL_COMPRESSION' : `B${String(batchNo).padStart(2,'0')}_CHECKPOINT_READY_NEXT_B${String(batchNo + 1).padStart(2,'0')}`;
state.completedBatchCount = completedExams.length;
state.completedUidCount = new Set(completedUids).size;
state.completedQuestionUids = completedUids;
state.completedSourceFiles = completedExams.map(x => x.sourceArchiveFile);
state.remainingSourceFiles = inventory.exams.filter(x => !completedExams.includes(x)).map(x => x.sourceArchiveFile);
state.lastCompletedItem = exam.sourceArchiveFile;
state.nextBatchNo = batchNo + 1 <= inventory.exams.length ? batchNo + 1 : null;
state.nextSourceArchiveFile = inventory.exams[batchNo]?.sourceArchiveFile || null;
state.blockingIssues = [];
fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
console.log(JSON.stringify({ batchNo, status: exam.status, completedBatchCount: state.completedBatchCount, completedUidCount: state.completedUidCount, nextBatchNo: state.nextBatchNo, report: path.join(dir, 'BATCH_REPORT.md') }, null, 2));
