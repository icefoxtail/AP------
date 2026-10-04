#!/usr/bin/env node
// Restore the approved L1/L2 parent for Foundation items without an RPM leaf.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const metadataPath = 'archive/data/question_metadata.json';
const metadata = read(metadataPath);
const runtime = read('archive/data/meta-foundation/runtime/middle1-v1.json');
const catalog = read('archive/data/archive2-catalog.json');
const parentByUnit = new Map([
  ['M1-04-COORDINATE_PLANE', ['M1-1', '좌표평면과 그래프', '좌표와 그래프']],
  ['M1-06-PLANE_FIGURE_MEASURE', ['M1-2', '평면도형', '다각형']],
  ['M1-06-POLYGON_CIRCLE', ['M1-2', '평면도형', '다각형']],
]);
const byUid = new Map(metadata.records.map(row => [row.questionUid, row]));
const candidates = runtime.records.filter(row =>
  row.rpmPathStatus === 'HOLD_NO_EQUIVALENT_PATH' &&
  row.sourceQualityDisposition === 'HOLD_RESOLVED_NO_SOURCE_MUTATION' &&
  row.semanticDisposition !== 'HOLD' && row.semanticDisposition !== 'ROUTE_OUT');
if (candidates.length !== 4) throw new Error(`Expected 4 independently eligible RPM-only rows; got ${candidates.length}`);
for (const row of candidates) {
  const meta = byUid.get(row.questionUid);
  const parent = parentByUnit.get(meta?.subUnitKey);
  if (!meta || !parent || meta.sourceFingerprint !== row.sourceFingerprint || meta.foundationTaxonomyStatus !== 'CONFIRMED')
    throw new Error(`Foundation identity or L1/L2 parent missing: ${row.questionUid}`);
  const curriculumKey = meta.curriculum;
  if (!catalog.taxonomy.some(t => t.curriculumKey === curriculumKey && t.courseKey === parent[0] && t.L1 === parent[1] && t.L2 === parent[2]))
    throw new Error(`RPM parent is absent from taxonomy: ${row.questionUid}`);
  Object.assign(meta, {
    curriculumKey, courseKey: parent[0], L1: parent[1], L2: parent[2],
    curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true,
    reviewStatus: 'reviewed_pass', metadataStatus: 'approved_full',
    metaFoundationHoldReason: null,
  });
}
fs.writeFileSync(path.join(root, metadataPath), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify({ projected: candidates.map(row => row.questionUid) }, null, 2));
