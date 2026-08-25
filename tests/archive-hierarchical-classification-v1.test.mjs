import assert from 'node:assert/strict';
import { buildTagMasterV1 } from '../archive/tools/intelligence/build-tag-master-v1.mjs';
import { classifyPilotHierarchicalV1 } from '../archive/tools/intelligence/classify-pilot-hierarchical-v1.mjs';
import { comparePilotClassificationStrategies } from '../archive/tools/intelligence/compare-pilot-classification-strategies.mjs';

const master = buildTagMasterV1();
assert.deepEqual(master.totals, {
    conceptClusterKey: 461,
    problemTypeKey: 13,
    standardUnitKey: 142,
    subUnitKey: 459,
    templateKey: 18
});
assert.equal(master.standardUnitsWithoutDocumentedSubUnit.length, 36);
const masterKeys = new Set(master.master.map(item => item.key));
// Some documented sub-unit definitions intentionally retain a parent standard
// key that is outside the current master table; concept/type/template parents
// must still resolve inside the active master.
assert.equal(master.master.filter(item => item.parentKey && item.keyType !== 'subUnitKey').every(item => masterKeys.has(item.parentKey)), true);

const classification = classifyPilotHierarchicalV1();
assert.equal(classification.productionWriteAllowed, false);
assert.equal(classification.totals.classifiedRecords, 400);
assert.equal(classification.totals.excludedRecords, 0);
assert.equal(classification.totals.recommendationEligible, 2);
assert.deepEqual(classification.totals.classificationDepth, {
    documented_template: 2,
    single_documented_subunit: 13,
    standard_unit_only: 363,
    unmapped_standard_unit: 22
});
assert.equal(classification.classifications.filter(item => item.classification.recommendationEligible).every(item => item.classification.evidence.agreedRuleIds.length === 1), true);

const comparison = comparePilotClassificationStrategies();
assert.equal(comparison.totals.legacyDeepCandidates, 59);
assert.equal(comparison.totals.hierarchicalRecommendationEligible, 2);
assert.equal(comparison.totals.legacyDeepReduced, 57);
assert.equal(comparison.totals.unmappedStandardUnits, 22);

console.log(JSON.stringify({ masterDigest: master.digest, classificationDigest: classification.digest, comparisonDigest: comparison.digest, status: 'PASS' }, null, 2));
