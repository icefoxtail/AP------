import test from 'node:test';
import assert from 'node:assert/strict';
import { auditAdvancedMetaQuestion } from '../scripts/advanced-meta-audit.mjs';
import { loadActiveMetaRegistry } from '../../meta-foundation/active-registry.mjs';

const repoRoot = new URL('../../../..', import.meta.url).pathname.replace(/^\//, '').replaceAll('/', '\\');

test('advanced Meta audit is read-only and reports canonical, provenance, and runtime parity state', () => {
  const context = {
    registry: loadActiveMetaRegistry(repoRoot),
    metadataBySource: new Map(),
    runtimeBySource: new Map(),
  };
  const item = auditAdvancedMetaQuestion({
    question: {
      questionId: 7,
      standardUnitKey: 'H15-SA-01',
      subUnitKey: 'H15-SA-01-POLYNOMIAL_BASIC',
      standardCourse: '수학(상)',
      advancedMetaFields: { problemTypeKey: 'PT_NOT_ACTIVE', templateKey: '', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' },
    },
    sourceArchiveFile: 'original/high/h1/1final/fixture.js', sourceOrdinal: 7, context,
  });
  assert.ok(item.canonicalErrors.includes('ADVANCED_META_PROBLEM_TYPE_INVALID'));
  assert.equal(item.provenanceStatus, 'NO_PROVENANCE_REFERENCE');
  assert.equal(item.metadataParity, 'NO_METADATA_ROW');
  assert.equal(item.runtimeParity, 'NOT_MATERIALIZED');
  assert.equal(item.auditMode, 'READ_ONLY_NO_SEMANTIC_AUTOFIX');
  assert.equal(Object.hasOwn(item, 'suggestedValue'), false);
});
