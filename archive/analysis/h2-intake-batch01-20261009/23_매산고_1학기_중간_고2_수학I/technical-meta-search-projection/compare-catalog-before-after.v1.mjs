import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import core from '../../../../../archive/archive2-core.js';

const root = process.cwd();
const evidenceRoot = path.join(root, 'archive/analysis/h2-intake-batch01-20261009/23_매산고_1학기_중간_고2_수학I/technical-meta-search-projection');
const beforeCatalogPath = path.join(evidenceRoot, 'attempt-01-before/archive__data__archive2-catalog.json');
const beforeManifestPath = path.join(evidenceRoot, 'attempt-01-before/archive__data__archive2-canonical-input-manifest.json');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value);
const stripDisplayProjection = row => {
  const copy = { ...row };
  delete copy.metaProjectionStatus;
  delete copy.metaProjectionFailureReason;
  delete copy.metaProjection;
  return copy;
};
const beforeRaw = readJson(beforeCatalogPath);
const afterRaw = readJson(path.join(root, 'archive/data/archive2-catalog.json'));
const before = core.decodeCatalog(beforeRaw);
const after = core.decodeCatalog(afterRaw);
const sourceFile = 'original/high/h2/1mid/23_매산고_1학기_중간_고2_수학I.js';
const target = after.records.filter(row => row.sourceFile === sourceFile);
const beforeTarget = before.records.filter(row => row.sourceFile === sourceFile);
const metaRows = readJson(path.join(root, 'archive/data/question_metadata.json')).records;
const metaByUid = new Map(metaRows.map(row => [row.questionUid, row]));
const targetProjectionRows = target.filter(row => row.metaProjectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND' && row.metaProjection?.displayOnly === true);
const projectedBindingMatches = targetProjectionRows.every(row => {
  const meta = metaByUid.get(row.questionUid);
  const p = row.metaProjection;
  return p.sourceBinding.questionUid === row.questionUid &&
    p.sourceBinding.sourceFile === sourceFile &&
    p.sourceBinding.sourceOrdinal === row.sourceOrdinal &&
    p.sourceBinding.sourceFingerprint === row.sourceFingerprint &&
    p.sourceBinding.assignmentFingerprint === row.assignmentFingerprint &&
    p.standardCourse === meta.standardCourse && p.standardUnitKey === meta.standardUnitKey &&
    p.standardUnit === meta.standardUnit && p.subUnitKey === meta.subUnitKey && p.subUnit === meta.subUnit &&
    !Object.hasOwn(p, 'problemTypeKey') && !Object.hasOwn(p, 'templateKey');
});
const stripFields = new Set(['records', 'indexVersion', 'encoding', 'columns', 'strings']);
const topFieldsBefore = Object.fromEntries(Object.entries(before).filter(([key]) => !stripFields.has(key)));
const topFieldsAfter = Object.fromEntries(Object.entries(after).filter(([key]) => !stripFields.has(key)));
const beforeManifest = readJson(beforeManifestPath);
const afterManifest = readJson(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'));
const nonCatalogManifestBefore = beforeManifest.files.filter(row => row.path !== 'data/archive2-catalog.json');
const nonCatalogManifestAfter = afterManifest.files.filter(row => row.path !== 'data/archive2-catalog.json');
const result = {
  schemaVersion: 'ARCHIVE2_META_DISPLAY_PROJECTION_CATALOG_DIFF_V1',
  head: '089d3250b3366dd5d7c323c9f88dd622707e8036',
  catalog: {
    beforeRawSha256: hash(fs.readFileSync(beforeCatalogPath)),
    afterRawSha256: hash(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'))),
    beforeRecordCount: before.records.length,
    afterRecordCount: after.records.length,
    beforeQuestionUidSequenceSha256: hash(Buffer.from(before.records.map(row => row.questionUid).join('\n'))),
    afterQuestionUidSequenceSha256: hash(Buffer.from(after.records.map(row => row.questionUid).join('\n'))),
    allOriginalRecordsPreservedAfterRemovingDisplayProjection: stable(before.records) === stable(after.records.map(stripDisplayProjection)),
    allOtherCatalogFieldsPreserved: stable(topFieldsBefore) === stable(topFieldsAfter),
    sourceHashesPreserved: stable(before.sourceHashes) === stable(after.sourceHashes),
    taxonomyAndExamInventoryPreserved: stable([before.taxonomy, before.exams]) === stable([after.taxonomy, after.exams]),
    healthPreserved: stable(before.health) === stable(after.health),
    currentSourceContentHashesPreserved: before.records.every((row, i) => row.rawQuestionHash === after.records[i].rawQuestionHash && row.sourceFingerprint === after.records[i].sourceFingerprint),
  },
  target: {
    sourceFile,
    targetRowCountBefore: beforeTarget.length,
    targetRowCountAfter: target.length,
    displayProjectedCount: targetProjectionRows.length,
    allTargetRowsRetainCanonicalAssignmentFailure: target.every(row => row.canonicalAssignmentReasons.includes('canonical_parent_missing')),
    allProjectionBindingsMatchCurrentApprovedCoreMetadata: projectedBindingMatches,
    unresolvedPTTPLNotInvented: targetProjectionRows.every(row => !Object.hasOwn(row.metaProjection, 'problemTypeKey') && !Object.hasOwn(row.metaProjection, 'templateKey')),
    assignmentEvidenceStillAbsent: target.every(row => row.assignmentEvidence == null),
  },
  manifest: {
    beforeRawSha256: hash(fs.readFileSync(beforeManifestPath)),
    afterRawSha256: hash(fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'))),
    nonCatalogInputsPreserved: stable(nonCatalogManifestBefore) === stable(nonCatalogManifestAfter),
    catalogDigestMatchesAfterCatalog: afterManifest.files.find(row => row.path === 'data/archive2-catalog.json')?.sha256 === hash(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'))),
  },
};
result.allRequiredPredicates = result.catalog.beforeRecordCount === 13378 &&
  result.catalog.afterRecordCount === 13378 &&
  result.catalog.allOriginalRecordsPreservedAfterRemovingDisplayProjection &&
  result.catalog.allOtherCatalogFieldsPreserved && result.catalog.sourceHashesPreserved &&
  result.catalog.taxonomyAndExamInventoryPreserved && result.catalog.healthPreserved &&
  result.catalog.currentSourceContentHashesPreserved &&
  result.target.targetRowCountBefore === 20 && result.target.targetRowCountAfter === 20 &&
  result.target.displayProjectedCount === 20 && result.target.allTargetRowsRetainCanonicalAssignmentFailure &&
  result.target.allProjectionBindingsMatchCurrentApprovedCoreMetadata &&
  result.target.unresolvedPTTPLNotInvented && result.target.assignmentEvidenceStillAbsent &&
  result.manifest.nonCatalogInputsPreserved && result.manifest.catalogDigestMatchesAfterCatalog;
if (!result.allRequiredPredicates) throw new Error('catalog projection diff failed closed');
fs.writeFileSync(path.join(evidenceRoot, 'catalog-diff-proof.v1.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
