#!/usr/bin/env node
/** Compose deterministic working relational fields after A/B/C coverage. No final taxonomy or difficulty. */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const comparison = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json'), 'utf8'));
const fieldConsensus = JSON.parse(fs.readFileSync(path.join(dir, 'H1_STAGEA_WORKING_FIELD_CONSENSUS_CURRENT.json'), 'utf8'));
const q539DirectFile = 'H1_SOL_Q539_UNREDUCED_FRACTION_ADJUDICATION.json';
const q539Direct = JSON.parse(fs.readFileSync(path.join(dir, q539DirectFile), 'utf8'));
const q455DirectFile = 'H1_SOL_Q455_CONDITION_AND_SOLUTION_NOTE_ADJUDICATION.json';
const q455Direct = JSON.parse(fs.readFileSync(path.join(dir, q455DirectFile), 'utf8'));
const ccPrimaryDedupFile = 'H1_SOL_CC_PRIMARY_DISCRIMINANT_DEDUP_5.json';
const ccPrimaryDedup = JSON.parse(fs.readFileSync(path.join(dir, ccPrimaryDedupFile), 'utf8'));
const ccPrimaryDedupByQueue = new Map(ccPrimaryDedup.items.map(item => [item.queueIndex, item]));
const positiveDivisorFile = 'H1_SOL_COND_POSITIVE_DIVISOR_4.json';
const positiveDivisor = JSON.parse(fs.readFileSync(path.join(dir, positiveDivisorFile), 'utf8'));
const positiveDivisorByQueue = new Map(positiveDivisor.items.map(item => [item.queueIndex, item]));
const sequentialDiscriminantFile = 'H1_SOL_IP_SEQUENTIAL_DISCRIMINANT_4.json';
const sequentialDiscriminant = JSON.parse(fs.readFileSync(path.join(dir, sequentialDiscriminantFile), 'utf8'));
const sequentialDiscriminantByQueue = new Map(sequentialDiscriminant.items.map(item => [item.queueIndex, item]));
const sequentialAdditionalFile = 'H1_SOL_IP_SEQUENTIAL_ADDITIONAL_5.json';
const sequentialAdditional = JSON.parse(fs.readFileSync(path.join(dir, sequentialAdditionalFile), 'utf8'));
const sequentialAdditionalByQueue = new Map(sequentialAdditional.items.map(item => [item.queueIndex, item]));
const geometricRangeFile = 'H1_SOL_COND_GEOMETRIC_RANGE_2.json';
const geometricRange = JSON.parse(fs.readFileSync(path.join(dir, geometricRangeFile), 'utf8'));
const geometricRangeByQueue = new Map(geometricRange.items.map(item => [item.queueIndex, item]));
const cubicFactorFile = 'H1_SOL_CC_CUBIC_FACTOR_BEFORE_DISCRIMINANT_3.json';
const cubicFactor = JSON.parse(fs.readFileSync(path.join(dir, cubicFactorFile), 'utf8'));
const cubicFactorByQueue = new Map(cubicFactor.items.map(item => [item.queueIndex, item]));
const realDomainHoldFile = 'H1_SOL_UNSPECIFIED_REAL_DOMAIN_HOLD_2.json';
const realDomainHold = JSON.parse(fs.readFileSync(path.join(dir, realDomainHoldFile), 'utf8'));
const realDomainHoldByQueue = new Map(realDomainHold.items.map(item => [item.queueIndex, item]));
const rootsOutsidePrimaryFile = 'H1_SOL_CC_ROOTS_COEFFICIENTS_OUTSIDE_PRIMARY_3.json';
const rootsOutsidePrimary = JSON.parse(fs.readFileSync(path.join(dir, rootsOutsidePrimaryFile), 'utf8'));
const rootsOutsidePrimaryByQueue = new Map(rootsOutsidePrimary.items.map(item => [item.queueIndex, item]));
const q767CcFile = 'H1_SOL_Q767_PRIMARY_QUADRATIC_INEQUALITY_CC_DEDUP.json';
const q767Cc = JSON.parse(fs.readFileSync(path.join(dir, q767CcFile), 'utf8'));
const inequalityParentPlanFile = 'l3-boundary/H1_SOL_SYSTEM_INEQUALITY_L3_REPARENT_39.json';
const inequalityParentPlan = JSON.parse(fs.readFileSync(path.join(dir, inequalityParentPlanFile), 'utf8'));
const inequalityParentRows = fs.readFileSync(path.join(dir, 'l3-boundary/H1_SYSTEM_INEQUALITY_PARENT_WORKING_39.jsonl'), 'utf8')
  .trim().split(/\r?\n/).map(JSON.parse);
const inequalityParentByQueue = new Map(inequalityParentRows.map(item => [item.queueIndex, item]));
const inequalityKeyByLabel = new Map(inequalityParentPlan.decisions.map(item => [item.draftParentLabelKo, item]));
const inequalityCcDedupFile = 'H1_SOL_CC_INEQUALITY_PRIMARY_DEDUP_Q776_Q782.json';
const inequalityCcDedup = JSON.parse(fs.readFileSync(path.join(dir, inequalityCcDedupFile), 'utf8'));
const inequalityCcDedupByQueue = new Map(inequalityCcDedup.items.map(item => [item.queueIndex, item]));
const q307NonbindingFile = 'H1_SOL_Q307_NONBINDING_ABSOLUTE_INTERVAL.json';
const q307Nonbinding = JSON.parse(fs.readFileSync(path.join(dir, q307NonbindingFile), 'utf8'));
if (inequalityParentRows.length !== 39 || inequalityParentByQueue.size !== 39)
  throw new Error('inequality parent plan coverage mismatch');
if (comparison.summary.counts.currentDual !== 1120 || comparison.summary.counts.unreviewedConflict !== 0)
  throw new Error('A/B/C coverage gate not closed for queue 51-1170');
const consensusByQueue = new Map(fieldConsensus.rows.map(row => [row.queueIndex, row]));
const fields = ['l3', 'l3Challenge', 'crossConcepts', 'conditions', 'integrationPattern', 'sourceIssue', 'reviewStatus'];
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const out = [];
const solQueue = [];
const counts = { items: 0, fieldsDualMatch: 0, fieldsTwoOfThree: 0, fieldsSolDirectOverride: 0,
  fieldsPendingSol: 0, itemsPendingSol: 0, itemsAllFieldsResolvedWorking: 0 };
for (const row of comparison.rows) {
  if (!row.a || !row.b) throw new Error(`missing A/B q${row.queueIndex}`);
  const consensus = consensusByQueue.get(row.queueIndex);
  if (row.fullConflict && !consensus) throw new Error(`missing C consensus q${row.queueIndex}`);
  const fieldDecisions = {};
  const pending = [];
  for (const field of fields) {
    const a = row.a[field] ?? null;
    const b = row.b[field] ?? null;
    if (same(a, b)) {
      fieldDecisions[field] = { value: a, provenance: 'DUAL_LUNA_MATCH' };
      counts.fieldsDualMatch++;
      continue;
    }
    const result = consensus?.decisions?.[field];
    if (!result) throw new Error(`missing field decision q${row.queueIndex} ${field}`);
    if (result.status === 'A_C_CONSENSUS' || result.status === 'B_C_CONSENSUS') {
      fieldDecisions[field] = { value: result.value, provenance: 'LUNA_2_OF_3_CONSENSUS', agreeingPair: result.status === 'A_C_CONSENSUS' ? ['A', 'C'] : ['B', 'C'] };
      counts.fieldsTwoOfThree++;
    } else {
      fieldDecisions[field] = { value: null, provenance: 'SOL_DIRECT_ADJUDICATION_PENDING', competingValues: { a, b, c: result.c ?? null }, reason: result.status };
      counts.fieldsPendingSol++;
      pending.push(field);
    }
  }
  if (row.queueIndex === 539) {
    if (row.questionUid !== q539Direct.questionUid || row.currentSourceFingerprint !== q539Direct.sourceFingerprint)
      throw new Error('q539 Sol direct evidence/source drift');
    for (const [field, value] of [['reviewStatus', 'HOLD'], ['sourceIssue', 'SOURCE_UNRESOLVED_HOLD']]) {
      const previous = fieldDecisions[field];
      if (previous.provenance === 'DUAL_LUNA_MATCH') counts.fieldsDualMatch--;
      else if (previous.provenance === 'LUNA_2_OF_3_CONSENSUS') counts.fieldsTwoOfThree--;
      else if (previous.provenance === 'SOL_DIRECT_ADJUDICATION_PENDING') {
        counts.fieldsPendingSol--;
        pending.splice(pending.indexOf(field), 1);
      }
      fieldDecisions[field] = { value, provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q539DirectFile, reason: 'Printed statement leaves n/m unreduced, so requested sum is not unique.' };
      counts.fieldsSolDirectOverride++;
    }
  }
  if (row.queueIndex === 455) {
    if (row.questionUid !== q455Direct.questionUid || row.currentSourceFingerprint !== q455Direct.sourceFingerprint)
      throw new Error('q455 Sol direct evidence/source drift');
    for (const field of ['conditions', 'sourceIssue']) {
      const previous = fieldDecisions[field];
      if (previous.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q455 expected pending ${field}`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q455Direct.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q455DirectFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  const ccDirect = ccPrimaryDedupByQueue.get(row.queueIndex);
  if (ccDirect) {
    if (row.questionUid !== ccDirect.questionUid || row.currentSourceFingerprint !== ccDirect.sourceFingerprint)
      throw new Error(`CC Sol direct evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.crossConcepts.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`CC Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('crossConcepts'), 1);
    fieldDecisions.crossConcepts = { value: [], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: ccPrimaryDedupFile, reason: ccDirect.reason };
    counts.fieldsSolDirectOverride++;
  }
  const conditionDirect = positiveDivisorByQueue.get(row.queueIndex);
  if (conditionDirect) {
    if (row.questionUid !== conditionDirect.questionUid || row.currentSourceFingerprint !== conditionDirect.sourceFingerprint)
      throw new Error(`Condition Sol direct evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.conditions.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Condition Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('conditions'), 1);
    fieldDecisions.conditions = { value: ['COND_POSITIVE'], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: positiveDivisorFile, reason: conditionDirect.reason };
    counts.fieldsSolDirectOverride++;
  }
  const ipDirect = sequentialDiscriminantByQueue.get(row.queueIndex);
  if (ipDirect) {
    if (row.questionUid !== ipDirect.questionUid || row.currentSourceFingerprint !== ipDirect.sourceFingerprint)
      throw new Error(`Integration Sol direct evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.integrationPattern.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Integration Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('integrationPattern'), 1);
    fieldDecisions.integrationPattern = { value: 'SEQUENTIAL', provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: sequentialDiscriminantFile, reason: ipDirect.reason };
    counts.fieldsSolDirectOverride++;
  }
  const ipAdditional = sequentialAdditionalByQueue.get(row.queueIndex);
  if (ipAdditional) {
    if (row.questionUid !== ipAdditional.questionUid || row.currentSourceFingerprint !== ipAdditional.sourceFingerprint)
      throw new Error(`Additional Integration Sol evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.integrationPattern.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Additional Integration Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('integrationPattern'), 1);
    fieldDecisions.integrationPattern = { value: 'SEQUENTIAL', provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: sequentialAdditionalFile, reason: ipAdditional.reason };
    counts.fieldsSolDirectOverride++;
  }
  const rangeDirect = geometricRangeByQueue.get(row.queueIndex);
  if (rangeDirect) {
    if (row.questionUid !== rangeDirect.questionUid || row.currentSourceFingerprint !== rangeDirect.sourceFingerprint)
      throw new Error(`Range Sol direct evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.conditions.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Range Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('conditions'), 1);
    fieldDecisions.conditions = { value: ['COND_RANGE'], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: geometricRangeFile, reason: rangeDirect.reason };
    counts.fieldsSolDirectOverride++;
  }
  const factorDirect = cubicFactorByQueue.get(row.queueIndex);
  if (factorDirect) {
    if (row.questionUid !== factorDirect.questionUid || row.currentSourceFingerprint !== factorDirect.sourceFingerprint)
      throw new Error(`Cubic-factor Sol direct evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.crossConcepts.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Cubic-factor Sol direct expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('crossConcepts'), 1);
    fieldDecisions.crossConcepts = { value: ['CC_POLYNOMIAL_FACTORIZATION'], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: cubicFactorFile, reason: factorDirect.reason };
    counts.fieldsSolDirectOverride++;
  }
  const domainHold = realDomainHoldByQueue.get(row.queueIndex);
  if (domainHold) {
    if (row.questionUid !== domainHold.questionUid || row.currentSourceFingerprint !== domainHold.sourceFingerprint)
      throw new Error(`Real-domain HOLD Sol evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.sourceIssue.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Real-domain HOLD expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('sourceIssue'), 1);
    fieldDecisions.sourceIssue = { value: 'SOURCE_UNRESOLVED_HOLD', provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: realDomainHoldFile, reason: domainHold.reason };
    counts.fieldsSolDirectOverride++;
  }
  const rootsOutsidePrimaryItem = rootsOutsidePrimaryByQueue.get(row.queueIndex);
  if (rootsOutsidePrimaryItem) {
    if (row.questionUid !== rootsOutsidePrimaryItem.questionUid
      || row.currentSourceFingerprint !== rootsOutsidePrimaryItem.sourceFingerprint)
      throw new Error(`Roots/coefficient CC Sol evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.crossConcepts.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`Roots/coefficient CC expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('crossConcepts'), 1);
    fieldDecisions.crossConcepts = { value: ['CC_ROOTS_COEFFICIENTS'], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: rootsOutsidePrimaryFile, reason: rootsOutsidePrimaryItem.reason };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 767) {
    if (row.questionUid !== q767Cc.questionUid || row.currentSourceFingerprint !== q767Cc.sourceFingerprint)
      throw new Error('q767 CC Sol evidence/source drift');
    if (fieldDecisions.crossConcepts.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error('q767 CC expected pending');
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('crossConcepts'), 1);
    fieldDecisions.crossConcepts = { value: [], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: q767CcFile, reason: q767Cc.reason };
    counts.fieldsSolDirectOverride++;
  }
  const parentItem = inequalityParentByQueue.get(row.queueIndex);
  if (parentItem) {
    if (row.questionUid !== parentItem.questionUid || row.currentSourceFingerprint !== parentItem.sourceFingerprint)
      throw new Error(`inequality parent Sol evidence/source drift q${row.queueIndex}`);
    if (fieldDecisions.l3.provenance !== 'DUAL_LUNA_MATCH'
      || (fieldDecisions.l3.value !== 'PT_H1_SYSTEM_EQUATION' && fieldDecisions.l3.value !== null))
      throw new Error(`inequality parent expected frozen or null L3 q${row.queueIndex}`);
    const mapped = inequalityKeyByLabel.get(parentItem.selectedDraftParentLabelKo);
    if (!mapped) throw new Error(`inequality parent label not mapped q${row.queueIndex}`);
    counts.fieldsDualMatch--;
    const chosenReason = parentItem.agreeingPair?.includes('C') ? parentItem.cParentReason : parentItem.aParentReason;
    fieldDecisions.l3 = { value: mapped.workingProblemTypeKey, provenance: 'SOL_DIRECT_ADJUDICATION',
      keyStatus: mapped.keyStatus, evidenceFile: inequalityParentPlanFile,
      reason: `Curriculum parent ${parentItem.selectedDraftParentLabelKo}: ${chosenReason}` };
    counts.fieldsSolDirectOverride++;
  }
  const inequalityCcItem = inequalityCcDedupByQueue.get(row.queueIndex);
  if (inequalityCcItem) {
    if (row.questionUid !== inequalityCcItem.questionUid
      || row.currentSourceFingerprint !== inequalityCcItem.sourceFingerprint
      || fieldDecisions.l3.value !== inequalityCcItem.workingPrimaryL3)
      throw new Error(`inequality CC parent/source drift q${row.queueIndex}`);
    if (fieldDecisions.crossConcepts.provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
      throw new Error(`inequality CC expected pending q${row.queueIndex}`);
    counts.fieldsPendingSol--;
    pending.splice(pending.indexOf('crossConcepts'), 1);
    fieldDecisions.crossConcepts = { value: [], provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceFile: inequalityCcDedupFile, reason: inequalityCcItem.reason };
    counts.fieldsSolDirectOverride++;
  }
  if (row.queueIndex === 307) {
    if (row.questionUid !== q307Nonbinding.questionUid
      || row.currentSourceFingerprint !== q307Nonbinding.sourceFingerprint
      || fieldDecisions.l3.value !== q307Nonbinding.workingPrimaryL3)
      throw new Error('q307 Sol evidence/source/parent drift');
    for (const field of ['crossConcepts', 'integrationPattern']) {
      if (fieldDecisions[field].provenance !== 'SOL_DIRECT_ADJUDICATION_PENDING')
        throw new Error(`q307 expected pending ${field}`);
      counts.fieldsPendingSol--;
      pending.splice(pending.indexOf(field), 1);
      fieldDecisions[field] = { ...q307Nonbinding.fieldDecisions[field], provenance: 'SOL_DIRECT_ADJUDICATION',
        evidenceFile: q307NonbindingFile };
      counts.fieldsSolDirectOverride++;
    }
  }
  counts.items++;
  if (pending.length) {
    counts.itemsPendingSol++;
    solQueue.push({ queueIndex: row.queueIndex, questionUid: row.questionUid, sourceIdentity: row.sourceIdentity,
      sourceFingerprint: row.currentSourceFingerprint, pendingFields: pending, aFile: row.aFile, bFile: row.bFile,
      cFile: row.currentCFile });
  } else counts.itemsAllFieldsResolvedWorking++;
  out.push({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', queueIndex: row.queueIndex,
    questionUid: row.questionUid, sourceIdentity: row.sourceIdentity, sourceFingerprint: row.currentSourceFingerprint,
    ...(row.currentVisualAssetSha256 ? { visualAssetSha256: row.currentVisualAssetSha256 } : {}),
    evidenceFiles: { a: row.aFile, b: row.bFile, c: row.currentCFile }, fieldDecisions,
    pendingSolFields: pending, globalTaxonomyReviewPending: true, difficultyPending: true });
}
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(dir, file), rows.map(row => JSON.stringify(row)).join('\n') + '\n');
writeJsonl('H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_1120.jsonl', out);
writeJsonl('H1_STAGEA_SOL_DIRECT_FIELD_QUEUE_CURRENT.jsonl', solQueue);
fs.writeFileSync(path.join(dir, 'H1_STAGEA_WORKING_RELATIONAL_CANDIDATE_SUMMARY.json'),
  JSON.stringify({ schemaVersion: 1, status: 'WORKING_NOT_FINAL', denominator: 1120, counts,
    sourceComparison: 'H1_STAGEA_AB_WORKING_COMPARISON_CURRENT.json',
    sourceFieldConsensus: 'H1_STAGEA_WORKING_FIELD_CONSENSUS_CURRENT.json' }, null, 2) + '\n');
console.log(JSON.stringify(counts, null, 2));
