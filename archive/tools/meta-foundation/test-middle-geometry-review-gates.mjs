import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('archive/data/meta-foundation/evidence/middle-geometry/v1');
const candidateRoot = path.resolve('archive/data/meta-foundation/candidates/middle-geometry/v1');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'item_level_assignment_928.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(root, 'candidate_compile_audit.json'), 'utf8'));
const runtime = JSON.parse(fs.readFileSync(path.join(root, 'candidate_runtime_middle-geometry-v1.json'), 'utf8'));
const recheck = JSON.parse(fs.readFileSync(path.join(root, 'independent_recheck_manifest_928.json'), 'utf8'));
const taxonomy = JSON.parse(fs.readFileSync(path.join(candidateRoot, 'taxonomy.json'), 'utf8'));
const bindings = JSON.parse(fs.readFileSync(path.join(candidateRoot, 'bindings.json'), 'utf8'));

assert.equal(ledger.records.length, 928);
assert.equal(new Set(ledger.records.map(record => record.questionUid)).size, 928);
assert.equal(new Set(ledger.records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`)).size, 928);

const reverse = ledger.records.find(record => record.sourceArchiveFile.endsWith('23_신흥중_2학기_기말_중2_기출.js') && record.sourceOrdinal === 5);
assert.equal(reverse.sourceStandardUnitKey, 'M2-07');
assert.equal(reverse.sourceSubUnitKey, 'M2-07-PYTHAGOREAN_APPLICATION');
assert.equal(reverse.workingStandardUnitKey, 'M2-06');
assert.equal(reverse.workingSubUnitKey, 'M2-06-SIMILAR_FIGURE');
assert.ok(!bindings.bindings.some(binding => binding.standardUnitKey === 'M2-07' && binding.subUnitKey.startsWith('M2-06-')));

assert.equal(audit.gates.parentMismatchCount, 0);
assert.equal(audit.gates.packOwnedDomainViolationCount, 0);
assert.equal(audit.gates.aliasAuditStatus, 'EXECUTED');
assert.equal(audit.gates.aliasCollisionCount, 0);
assert.equal(audit.candidateCounts.autoEligible, 0);
assert.equal(runtime.counts.autoEligible, 0);
assert.ok(recheck.targetCount > 0);
assert.ok(recheck.triggerUnionCount >= recheck.targetCount);
assert.equal(taxonomy.status, 'CANDIDATE');
assert.ok(taxonomy.templates.every(template => template.promotionStatus === 'REVIEW_REQUIRED'));
assert.equal(audit.productionPromotion, 'NOT_ATTEMPTED');

console.log(JSON.stringify({ status: 'PASS', records: ledger.records.length, reviewTargets: recheck.targetCount, aliasCollisionCount: audit.gates.aliasCollisionCount }, null, 2));
