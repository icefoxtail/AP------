import fs from 'node:fs';
import path from 'node:path';
import { fileRef, objectSha } from '../../../../../../../archive/tools/pipeline-core/canonical.mjs';
import { semanticSha, structureFingerprint } from '../../../../../../../archive/tools/pipeline-core/visual.mjs';

const root = process.cwd();
const base = 'archive-work/textbooks/visang-common2/workbook/geometry';
const setKey = '비상_공통수학2_도형의방정식_익힘책_고1';
const evidence = `${base}/evidence/${setKey}`;
const factPath = `${evidence}/pipeline-core/expected-facts/q01_expected.json`;
const sourcePath = `${evidence}/pipeline-core/inputs/source_snapshot.js`;
const ledgerPath = `${evidence}/source_inventory.json`;
const assetPath = `${base}/assets/images/${setKey}/q01_coordinate_plane_final.svg`;
const fact = JSON.parse(fs.readFileSync(path.join(root, factPath), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(root, ledgerPath), 'utf8'));
const source = inventory.rows.find(row => String(row.displayNo) === '01');
if (!source || source.contentHash !== 'sha256:e5ccb991fa8c79e8b903612baa8dc89cf61e8f9e8cc15c9b75fc2770c561dcb6') throw new Error('Q01_SOURCE_IDENTITY_CHANGED');
if (fact.questionUid !== source.questionUid || fact.semantic.points.map(point => point.id).join(',') !== 'A,P,B') throw new Error('Q01_EXPECTED_FACT_IDENTITY_CHANGED');
const record = {
  schemaVersion: 'APMATH_VISUAL_V1_SOURCE_EXPECTATION_v1',
  status: 'PASS',
  questionUid: source.questionUid,
  sourceIdentityFingerprint: source.sourceIdentityFingerprint,
  sourceContentHash: source.contentHash,
  sourceRef: fileRef(root, sourcePath),
  expectedFactRef: fileRef(root, factPath),
  expectedFactSha: fileRef(root, factPath).sha256,
  expectedSemanticSha: semanticSha(fact),
  expectedStructureFingerprint: structureFingerprint(fact),
  expectedCoordinatePoints: [
    { id: 'A', x: 2, y: -3 },
    { id: 'P', x: 5, y: 3 },
    { id: 'B', x: 7, y: 7 },
  ],
  expectedOrder: ['A', 'P', 'B'],
  exactEqualUnitScale: true,
  sourceDerivedRatio: {
    expression: 'AP:PB = 3:2',
    derivation: 'AP = √((5−2)²+(3−(−3))²)=3√5; PB = √((7−5)²+(7−3)²)=2√5.',
  },
  expectedVisualNeed: 'Show both the exact coordinate locations and the A-P-B internal-division order on a coordinate plane, with the ratio label fully inside the figure.',
  currentArtifactRef: fileRef(root, assetPath),
  appliesTo: 'source-only visual expectation and V1 packet authority; does not state the correct answer or solution steps',
};
record.evidenceSha = objectSha(record);
const output = `${evidence}/pipeline-core/q01_source_visual_expectation.json`;
fs.writeFileSync(path.join(root, output), `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify({ output, evidenceSha: record.evidenceSha, expectedFactSha: record.expectedFactSha, artifactSha: record.currentArtifactRef.sha256 }, null, 2));
