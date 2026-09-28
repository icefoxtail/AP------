import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileRef, objectSha } from '../../../../../../../archive/tools/pipeline-core/canonical.mjs';
import { extractSvgGeometry, verifySvgGeometry, semanticSha, structureFingerprint } from '../../../../../../../archive/tools/pipeline-core/visual.mjs';

const root = process.cwd();
const base = 'archive-work/textbooks/visang-common2/workbook/geometry';
const setKey = '비상_공통수학2_도형의방정식_익힘책_고1';
const evidence = `${base}/evidence/${setKey}`;
const expectedFactPath = `${evidence}/pipeline-core/expected-facts/q01_expected.json`;
const sourceInventoryPath = `${evidence}/source_inventory.json`;
const sourceAssetPath = `${base}/assets/images/${setKey}/q01_geometry_core_final.svg`;
const outputAssetPath = `${base}/assets/images/${setKey}/q01_coordinate_plane_final.svg`;
const priorU2Path = `${evidence}/pipeline-core/provider-review-main/prior-partial/u2-response.json`;
const fact = JSON.parse(fs.readFileSync(path.join(root, expectedFactPath), 'utf8'));
const sourceInventory = JSON.parse(fs.readFileSync(path.join(root, sourceInventoryPath), 'utf8'));
const sourceRow = sourceInventory.rows.find(row => String(row.displayNo) === '01');
const priorU2Response = JSON.parse(fs.readFileSync(path.join(root, priorU2Path), 'utf8'));
const priorPipelineUid = `${setKey}|1`;
const priorU2Defect = (priorU2Response.defects || []).find(defect => defect.questionUid === priorPipelineUid);
if (!priorU2Defect) throw new Error('Q01_PRIOR_U2_FINDING_REQUIRED');
const sourceBytes = fs.readFileSync(path.join(root, sourceAssetPath));
const sourceSvg = sourceBytes.toString('utf8');
const sourceObservation = extractSvgGeometry(sourceSvg);
const sourceParity = verifySvgGeometry(fact, sourceObservation);
if (sourceParity.status !== 'PASS' || fact.semantic.points.map(point => point.id).join(',') !== 'A,P,B') throw new Error('Q01_BASE_GEOMETRY_NOT_VERIFIED');
const targetLines = [...sourceSvg.matchAll(/<line\b[^>]*\/>/g)].map(match => match[0]);
const targetPoints = [...sourceSvg.matchAll(/<circle\b[^>]*\/>/g)].map(match => match[0]);
if (targetLines.length !== 3 || targetPoints.length !== 3) throw new Error('Q01_CORE_PRIMITIVE_COUNT_MISMATCH');
const factHash = objectSha(fact);
const title = '도형의 방정식 01번 풀이 좌표 그림';
const desc = '좌표평면에서 A(2,−3), P(5,3), B(7,7)는 이 순서로 한 직선 위에 있고, AP:PB=3:2이다.';
const gridLines = [];
for (const x of [103,125,147,169,191,213,235,257]) gridLines.push(`<line x1="${x}" y1="44" x2="${x}" y2="264"/>`);
for (const y of [44,66,88,110,132,154,176,220,242,264]) gridLines.push(`<line x1="81" y1="${y}" x2="257" y2="${y}"/>`);
const xTicks = [
  [81,'0'],[103,'1'],[125,'2'],[147,'3'],[169,'4'],[191,'5'],[213,'6'],[235,'7'],[257,'8'],
].map(([x,label]) => `<line x1="${x}" y1="194" x2="${x}" y2="202"/><text x="${x}" y="214">${label}</text>`).join('');
const yTicks = [
  [44,'7'],[66,'6'],[88,'5'],[110,'4'],[132,'3'],[154,'2'],[176,'1'],[198,'0'],[220,'−1'],[242,'−2'],[264,'−3'],
].map(([y,label]) => `<line x1="77" y1="${y}" x2="85" y2="${y}"/><text x="70" y="${Number(y)+3}">${label}</text>`).join('');
const semantic = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="402" viewBox="0 0 360 402" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT" data-geometry-mode="GEOMETRY" data-geometry-preset="PIPELINE_CORE_GEOMETRY" data-geometry-fact-hash="${factHash}" data-visual-provenance="pipeline-core-generator+coordinate-context-repair"><title id="title">${title}</title><desc id="desc">${desc}</desc><g font-family="Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif"><g stroke="#e6edf2" stroke-width="0.7">${gridLines.join('')}</g><g stroke="#222" stroke-width="1.5"><line x1="62" y1="198" x2="280" y2="198"/><line x1="81" y1="290" x2="81" y2="28"/></g><g stroke="#333" stroke-width="1" font-size="10" fill="#333" text-anchor="middle">${xTicks}</g><g stroke="#333" stroke-width="1" font-size="10" fill="#333" text-anchor="end">${yTicks}</g><g font-size="13" font-weight="600" fill="#111"><text x="285" y="202">x</text><text x="78" y="20">y</text></g>${targetLines.join('')}<g stroke="#087f8c" stroke-width="3"><line x1="125" y1="264" x2="191" y2="132"/></g><g stroke="#d97706" stroke-width="3"><line x1="191" y1="132" x2="235" y2="44"/></g>${targetPoints.join('')}<g font-size="11" font-weight="600" fill="#111"><text x="91" y="286">A (2, −3)</text><text x="199" y="121">P (5, 3)</text><text x="242" y="36">B (7, 7)</text></g><rect x="107" y="345" width="146" height="31" rx="6" fill="#e9f5f6" stroke="#087f8c" stroke-width="1"/><text x="180" y="366" text-anchor="middle" font-size="14" font-weight="700" fill="#075b63">AP:PB = 3:2</text></g></svg>`;
const finalObservation = extractSvgGeometry(semantic);
const finalParity = verifySvgGeometry(fact, finalObservation);
if (finalParity.status !== 'PASS') throw new Error(`Q01_REPAIRED_GEOMETRY_NOT_VERIFIED:${JSON.stringify(finalParity.errors)}`);
const primitiveKey = primitive => JSON.stringify(primitive);
const finalSet = new Set(finalObservation.primitives.map(primitiveKey));
if (sourceObservation.primitives.some(primitive => !finalSet.has(primitiveKey(primitive)))) throw new Error('Q01_SOURCE_GEOMETRY_PRIMITIVE_DROPPED');
fs.writeFileSync(path.join(root, outputAssetPath), semantic);
const sha = value => 'sha256:' + crypto.createHash('sha256').update(value).digest('hex');
const v1Evidence = {
  schemaVersion: 'APMATH_VISUAL_V1_SOURCE_EXPECTATION_v1',
  status: 'PASS',
  questionUid: fact.questionUid,
  sourceQuestion: { displayNo: '01', printedPage: sourceRow.printedPage, physicalPage: sourceRow.sourcePdfPage, identityFingerprint: sourceRow.sourceIdentityFingerprint },
  sourceTextFingerprint: sourceRow.contentHash,
  sourceRef: fileRef(root, `${evidence}/pipeline-core/inputs/source_snapshot.js`),
  expectedFactRef: fileRef(root, expectedFactPath),
  expectedFactSemanticSha: semanticSha(fact),
  expectedFactStructureFingerprint: structureFingerprint(fact),
  expectedCoordinates: [{ id: 'A', x: 2, y: -3 }, { id: 'P', x: 5, y: 3 }, { id: 'B', x: 7, y: 7 }],
  expectedOrder: ['A', 'P', 'B'],
  expectedRatio: { expression: 'AP:PB=3:2', derivation: 'AP=√45=3√5; PB=√20=2√5.' },
  visualRequirement: 'VISUAL_REQUIRED',
  decisiveStep: 'Use the coordinate plane to relate the given endpoint coordinates, the internal point, and the 3:2 division ratio.',
  priorU2Finding: { evidenceRef: fileRef(root, priorU2Path), defect: priorU2Defect },
  response: 'Coordinate grid, integer axes, exact point coordinates, A-P-B order, and ratio label are all visible without clipping.',
  artifactRef: fileRef(root, outputAssetPath),
};
v1Evidence.evidenceSha = objectSha(v1Evidence);
const v1Path = `${evidence}/pipeline-core/q01_source_visual_expectation_repair.json`;
fs.writeFileSync(path.join(root, v1Path), `${JSON.stringify(v1Evidence, null, 2)}\n`);
const repair = {
  schemaVersion: 'VISANG_Q01_COORDINATE_CONTEXT_REPAIR_v1',
  status: 'PASS',
  sourceArtifactRef: fileRef(root, sourceAssetPath),
  artifactRef: fileRef(root, outputAssetPath),
  expectedFactRef: fileRef(root, expectedFactPath),
  sourceArtifactSha: sha(sourceBytes),
  artifactSha: sha(semantic),
  sourcePrimitiveCount: sourceObservation.primitives.length,
  artifactPrimitiveCount: finalObservation.primitives.length,
  sourceTargetPrimitivesPreserved: true,
  newCoordinateContextPrimitives: finalObservation.primitives.length - sourceObservation.primitives.length,
  v2GeometryParity: finalParity.status,
  v1ExpectationRef: fileRef(root, v1Path),
  changes: ['Add equal-unit coordinate grid and labeled axes.', 'Show A(2,−3), P(5,3), B(7,7) explicitly.', 'Preserve the source A-P-B segment primitives and display AP:PB=3:2.'],
  note: 'Coordinate context is added around the previously verified core geometry. The underlying A, P, B coordinates and segment primitives are byte-level-derived from the prior core SVG and still pass the typed expected fact.',
};
repair.evidenceSha = objectSha(repair);
const repairPath = `${evidence}/pipeline-core/q01_coordinate_context_repair.json`;
fs.writeFileSync(path.join(root, repairPath), `${JSON.stringify(repair, null, 2)}\n`);
console.log(JSON.stringify({ artifactRef: repair.artifactRef, sourceTargetPrimitivesPreserved: true, v2GeometryParity: finalParity.status, artifactSha: repair.artifactSha, v1ExpectationRef: repair.v1ExpectationRef, repairEvidenceSha: repair.evidenceSha }, null, 2));
