import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const evidenceDir = path.join(repoRoot, 'archive', 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function counts(records, key) {
  return Object.fromEntries(Object.entries(records.reduce((out, record) => {
    const value = String(record[key]);
    out[value] = (out[value] || 0) + 1;
    return out;
  }, {})).sort(([left], [right]) => left.localeCompare(right)));
}

function audit() {
  const ledger = readJson(path.join(evidenceDir, 'item_level_assignment_928.json'));
  const compiled = readJson(path.join(evidenceDir, 'candidate_compiled_middle_geometry.json'));
  const compileAudit = readJson(path.join(evidenceDir, 'candidate_compile_audit.json'));
  const mapped = ledger.records.filter(record => Boolean(record.problemTypeKey));
  const routeOut = ledger.records.filter(record => !record.problemTypeKey);
  const activeConcepts = new Set((compiled.concepts || []).map(item => item.conceptKey));
  const activeConditions = new Set((compiled.conditions || []).map(item => item.conditionKey));
  const integrationAllowed = new Set(['NONE', 'SEQUENTIAL', 'INTERDEPENDENT', 'REINTERPRETATION', 'CASE_BRANCH', 'DEEP_COMPOSITE']);
  const crossConceptKeys = [...new Set(mapped.flatMap(record => record.crossConceptKeys || []))];
  const conditionKeys = [...new Set(mapped.flatMap(record => record.conditionKeys || []))];
  const duplicateCrossConceptAssignments = mapped.filter(record => new Set(record.crossConceptKeys || []).size !== (record.crossConceptKeys || []).length).map(record => record.questionUid);
  const duplicateConditionAssignments = mapped.filter(record => new Set(record.conditionKeys || []).size !== (record.conditionKeys || []).length).map(record => record.questionUid);
  const invalidIntegration = mapped.filter(record => !integrationAllowed.has(record.integrationPattern)).map(record => `${record.questionUid}:${record.integrationPattern}`);
  const pendingL4 = mapped.filter(record => record.l4ReviewStatus !== 'REVIEWED').length;
  const pendingRelational = mapped.filter(record => record.relationalMetadataStatus !== 'REVIEWED').length;
  const result = {
    schemaVersion: 'middle-geometry-semantic-metadata-closure-v1',
    status: 'CANDIDATE_SEMANTIC_METADATA_CLOSURE_PENDING_GPT_INDEPENDENT_REVIEW',
    denominator: ledger.records.length,
    mappedCount: mapped.length,
    routeOutHoldCount: routeOut.length,
    l3: {
      statusCounts: counts(ledger.records, 'l3Status'),
      actionCounts: counts(ledger.records, 'l3Action'),
      canonicalReuseCount: ledger.records.filter(record => record.l3Status === 'REUSE_ACTIVE').length,
      candidateAssignmentCount: ledger.records.filter(record => record.l3Status === 'CANDIDATE').length,
      routeOutCount: routeOut.length
    },
    l4: {
      statusCounts: counts(ledger.records, 'l4Status'),
      actionCounts: counts(ledger.records, 'l4Action'),
      pendingSemanticReviewCount: pendingL4,
      brokenParentCount: compileAudit.gates.brokenL4Parent.length,
      candidateTemplatesRemainReviewRequired: true
    },
    crossConcept: {
      assignmentCount: mapped.reduce((sum, record) => sum + (record.crossConceptKeys || []).length, 0),
      distinctKeyCount: crossConceptKeys.length,
      keys: crossConceptKeys.sort(),
      unregisteredKeys: crossConceptKeys.filter(key => !activeConcepts.has(key)),
      duplicateAssignmentUidCount: duplicateCrossConceptAssignments.length
    },
    condition: {
      assignmentCount: mapped.reduce((sum, record) => sum + (record.conditionKeys || []).length, 0),
      distinctKeyCount: conditionKeys.length,
      keys: conditionKeys.sort(),
      unregisteredKeys: conditionKeys.filter(key => !activeConditions.has(key)),
      duplicateAssignmentUidCount: duplicateConditionAssignments.length
    },
    integrationPattern: {
      counts: counts(mapped, 'integrationPattern'),
      nonNoneCount: mapped.filter(record => record.integrationPattern !== 'NONE').length,
      invalidValues: invalidIntegration,
      pendingSemanticReviewCount: pendingRelational
    },
    candidateOnly: {
      productionPromotion: 'NOT_ATTEMPTED',
      canonicalMutation: 0,
      runtimePromotion: 0,
      archive2Promotion: 0,
      mainMerge: 'FORBIDDEN'
    },
    gateSummary: {
      parentMismatchCount: compileAudit.gates.parentMismatchCount,
      unregisteredCrossConceptCount: compileAudit.gates.unregisteredCrossConcept.length,
      unregisteredConditionCount: compileAudit.gates.unregisteredCondition.length,
      duplicateRelationalCount: compileAudit.gates.duplicateRelational.length,
      invalidIntegrationPatternCount: invalidIntegration.length,
      aliasCollisionCount: compileAudit.gates.aliasCollisionCount,
      candidateLeakageIntoProduction: compileAudit.gates.candidateLeakageIntoProduction
    },
    nextReview: 'GPT independent review of item-level L3/L4/CrossConcept/Condition/IntegrationPattern/difficulty and trigger-union recheck manifest'
  };
  if (result.gateSummary.parentMismatchCount !== 0 || result.gateSummary.unregisteredCrossConceptCount !== 0 || result.gateSummary.unregisteredConditionCount !== 0 || result.gateSummary.duplicateRelationalCount !== 0 || result.gateSummary.invalidIntegrationPatternCount !== 0 || result.gateSummary.aliasCollisionCount !== 0 || result.gateSummary.candidateLeakageIntoProduction !== 0) {
    throw new Error(JSON.stringify(result, null, 2));
  }
  fs.writeFileSync(path.join(evidenceDir, 'semantic_metadata_closure_928.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) audit();
