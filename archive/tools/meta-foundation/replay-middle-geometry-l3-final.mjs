import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const evidenceDir = path.join(ROOT, 'archive/data/meta-foundation/evidence/middle-geometry/v1');
const m2Path = path.join(evidenceDir, 'm2_item_level_l3_ledger_402.json');
const m3Path = path.join(evidenceDir, 'm3_stage2_l3_fresh_assignment_526.json');
const phasePath = path.join(evidenceDir, 'l3_l4_semantic_freeze_928.json');
const trig137Path = path.join(evidenceDir, 'm3_trig_137_gpt_direct_final.json');
const outputPath = path.join(evidenceDir, 'l3_semantic_final_928.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const basename = (sourceArchiveFile) => sourceArchiveFile.replace(/\\/g, '/').split('/').pop();
const sourceKey = (record) => basename(record.sourceArchiveFile) + '#' + String(record.sourceOrdinal);
const sourceKeyFromIdentity = (identity) => identity.replace(/^.*[\\/]/, '');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const m2 = readJson(m2Path);
const m3 = readJson(m3Path);
const phase = readJson(phasePath);
const trig137 = readJson(trig137Path);

assert(m2.records.length === 402, 'M2 baseline row count is not 402');
assert(m3.records.length === 526, 'M3 baseline row count is not 526');
assert(trig137.records.length === 137, 'GPT DIRECT FINAL row count is not 137');

const phaseByUid = new Map(phase.records.map((record) => [record.questionUid, record]));
const trig137ByUid = new Map(trig137.records.map((record) => [record.questionUid, record]));
const m2ByUid = new Map(m2.records.map((record) => [record.questionUid, record]));
const m3ByUid = new Map(m3.records.map((record) => [record.questionUid, record]));

const finalL3Record = (base, problemTypeKey, l3ReviewStatus, authoritySource) => ({
  questionUid: base.questionUid,
  grade: base.grade,
  sourceArchiveFile: base.sourceArchiveFile,
  sourceOrdinal: base.sourceOrdinal,
  sourceQuestionNo: base.sourceQuestionNo,
  sourceFingerprint: base.sourceFingerprint,
  standardUnitKey: base.standardUnitKey,
  subUnitKey: base.workingSubUnitKey || base.sourceSubUnitKey,
  workingSubUnitKey: base.workingSubUnitKey || base.sourceSubUnitKey,
  problemTypeKey,
  l3ReviewStatus,
  authoritySource
});

const finalM2 = m2.records.map((base) => {
  const authority = phaseByUid.get(base.questionUid);
  assert(authority, 'Missing M2 phase authority for ' + base.questionUid);
  assert(authority.sourceArchiveFile === base.sourceArchiveFile, 'M2 source file mismatch for ' + base.questionUid);
  assert(authority.sourceOrdinal === base.sourceOrdinal, 'M2 source ordinal mismatch for ' + base.questionUid);
  assert(authority.sourceFingerprint === base.sourceFingerprint, 'M2 source fingerprint mismatch for ' + base.questionUid);
  const routeOut = authority.l3AuthorityStatus === 'ROUTE_OUT_FINAL';
  assert(routeOut || authority.problemTypeKey, 'M2 unresolved L3 for ' + base.questionUid);
  return finalL3Record(
    base,
    routeOut ? null : authority.problemTypeKey,
    routeOut ? 'OUT_OF_SCOPE_HOLD' : 'FINAL',
    'M2_A1_A2_A3_FINAL'
  );
});

const trigBase = m3.records.filter((record) => record.workingSubUnitKey === 'M3-05-TRIG_RATIO' || record.workingSubUnitKey === 'M3-05-TRIG_RATIO_APPLICATION');
assert(trigBase.length === 206, 'TRIG baseline row count is not 206');

const finalTrig = [];
const trig137Uids = new Set();
for (const base of trigBase) {
  const direct = trig137ByUid.get(base.questionUid);
  if (direct) {
    assert(sourceKey(base) === sourceKeyFromIdentity(direct.sourceIdentity), 'TRIG 137 source identity mismatch for ' + base.questionUid);
    trig137Uids.add(base.questionUid);
    finalTrig.push(finalL3Record(base, direct.problemTypeKey, 'FINAL', 'M3_TRIG_137_GPT_DIRECT_FINAL'));
    continue;
  }
  const authority = phaseByUid.get(base.questionUid);
  assert(authority, 'Missing TRIG 69 phase authority for ' + base.questionUid);
  assert(authority.sourceArchiveFile === base.sourceArchiveFile, 'TRIG 69 source file mismatch for ' + base.questionUid);
  assert(authority.sourceOrdinal === base.sourceOrdinal, 'TRIG 69 source ordinal mismatch for ' + base.questionUid);
  assert(authority.sourceFingerprint === base.sourceFingerprint, 'TRIG 69 source fingerprint mismatch for ' + base.questionUid);
  const routeOut = authority.l3AuthorityStatus === 'ROUTE_OUT_FINAL';
  assert(routeOut || authority.l3AuthorityStatus === 'L3_FINAL_AUTHORITY_MATERIALIZED', 'TRIG 69 is not FINAL authority for ' + base.questionUid);
  assert(routeOut || authority.problemTypeKey, 'TRIG 69 missing final L3 for ' + base.questionUid);
  finalTrig.push(finalL3Record(
    base,
    routeOut ? null : authority.problemTypeKey,
    routeOut ? 'OUT_OF_SCOPE_HOLD' : 'FINAL',
    'M3_TRIG_69_FINAL_REPLAY'
  ));
}
assert(trig137Uids.size === 137, 'Not all 137 GPT DIRECT FINAL UIDs were consumed');
assert(finalTrig.length === 206, 'TRIG final row count is not 206');

const addOverrides = (map, from, to, identities) => {
  for (const identity of identities) {
    assert(!map.has(identity), 'Duplicate CIRCLE_LINE override identity ' + identity);
    map.set(identity, { from, to });
  }
};

const circleLineOverrides = new Map();
addOverrides(circleLineOverrides, 'PT_CIRCLE_LINE_RELATION', 'PT_CIRCLE_TANGENT', [
  '22_매산중_2학기_기말_중3_기출.js#11',
  '22_매산중_2학기_기말_중3_기출.js#13',
  '23_풍덕중_2학기_기말_중3_기출.js#10',
  '25_신흥중_2학기_중간_중3_수학.js#17'
]);
addOverrides(circleLineOverrides, 'PT_CIRCLE_LINE_RELATION', 'PT_CIRCLE_ANGLE_RELATIONS', [
  '22_매산중_2학기_기말_중3_기출.js#14',
  '23_풍덕중_2학기_기말_중3_기출.js#22',
  '25_왕운중_2학기_기말_중3_기출.js#5',
  '25_왕운중_2학기_기말_중3_기출.js#7',
  '23_풍덕중_2학기_중간_중3_수학.js#23'
]);
addOverrides(circleLineOverrides, 'PT_CIRCLE_LINE_RELATION', 'PT_TWO_CIRCLES', [
  '23_연향중_2학기_중간_중3_수학.js#23',
  '25_금당중_2학기_중간_중3_수학.js#16'
]);
addOverrides(circleLineOverrides, 'PT_TRIANGLE_CENTERS', 'PT_CIRCLE_LINE_RELATION', [
  '22_신흥중_2학기_기말_중3_기출.js#2',
  '22_신흥중_2학기_기말_중3_기출.js#3',
  '22_신흥중_2학기_기말_중3_기출.js#17',
  '23_풍덕중_2학기_기말_중3_기출.js#16',
  '24_연향중_2학기_기말_중3_기출.js#1',
  '23_연향중_2학기_중간_중3_수학.js#17',
  '24_금당중_2학기_중간_중3_수학.js#15',
  '24_금당중_2학기_중간_중3_수학.js#16',
  '24_금당중_2학기_중간_중3_수학.js#23',
  '24_연향중_2학기_중간_중3_수학.js#14',
  '24_연향중_2학기_중간_중3_수학.js#15',
  '25_신흥중_2학기_중간_중3_수학.js#16',
  '25_연향중_2학기_중간_중3_수학.js#16',
  '25_왕운중_2학기_중간_중3_수학.js#14'
]);
addOverrides(circleLineOverrides, 'PT_TRIANGLE_CENTERS', 'PT_TWO_CIRCLES', [
  '23_풍덕중_2학기_기말_중3_기출.js#7',
  '25_금당중_2학기_중간_중3_수학.js#24'
]);
addOverrides(circleLineOverrides, 'PT_CIRCLE_TANGENT', 'PT_TRIANGLE_CENTERS', [
  '22_향림중_2학기_기말_중3_기출.js#21',
  '23_풍덕중_2학기_기말_중3_기출.js#17',
  '23_향림중_2학기_기말_중3_기출.js#4',
  '24_연향중_2학기_기말_중3_기출.js#9',
  '24_연향중_2학기_중간_중3_수학.js#20',
  '25_금당중_2학기_중간_중3_수학.js#18',
  '25_신흥중_2학기_중간_중3_수학.js#19',
  '25_연향중_2학기_중간_중3_수학.js#23'
]);
assert(circleLineOverrides.size === 35, 'CIRCLE_LINE override count is not 35');

const circleLineBase = m3.records.filter((record) => record.workingSubUnitKey === 'M3-06-CIRCLE_LINE');
assert(circleLineBase.length === 133, 'CIRCLE_LINE baseline row count is not 133');
const finalCircleLine = circleLineBase.map((base) => {
  const identity = sourceKey(base);
  const override = circleLineOverrides.get(identity);
  const finalProblemTypeKey = override ? override.to : base.problemTypeKey;
  if (override) assert(base.problemTypeKey === override.from, 'CIRCLE_LINE old L3 mismatch for ' + identity);
  return finalL3Record(base, finalProblemTypeKey, 'FINAL', 'M3_CIRCLE_LINE_133_FINAL_REPLAY');
});

const circleInscribedBase = m3.records.filter((record) => record.workingSubUnitKey === 'M3-06-CIRCLE_INSCRIBED_ANGLE');
assert(circleInscribedBase.length === 187, 'CIRCLE_INSCRIBED_ANGLE baseline row count is not 187');
const tangentKeep = new Set([
  '23_향림중_2학기_기말_중3_기출.js#12',
  '23_연향중_2학기_중간_중3_수학.js#24'
]);
const lineFinal = new Set([
  '25_신흥중_2학기_중간_중3_수학.js#23',
  '25_왕운중_2학기_중간_중3_수학.js#15'
]);
const twoCirclesKeep = new Set([
  '25_금당중_2학기_기말_중3_기출.js#9',
  '23_풍덕중_2학기_기말_중3_기출.js#13',
  '23_풍덕중_2학기_기말_중3_기출.js#18',
  '23_풍덕중_2학기_기말_중3_기출.js#19',
  '22_연향중_2학기_기말_중3_기출.js#19',
  '22_풍덕중_2학기_기말_중3_기출.js#9'
]);
const oldCenters = new Set([
  '23_풍덕중_2학기_중간_중3_수학.js#17',
  '24_연향중_2학기_기말_중3_기출.js#11',
  '25_금당중_2학기_기말_중3_기출.js#6',
  '24_신흥중_2학기_중간_중3_수학.js#19',
  '25_신흥중_2학기_중간_중3_수학.js#23'
]);
const oldLine = '25_풍덕중_2학기_기말_중3_기출.js#6';
for (const identity of [...tangentKeep, ...lineFinal, ...twoCirclesKeep, ...oldCenters, oldLine]) {
  assert(circleInscribedBase.some((record) => sourceKey(record) === identity), 'CIRCLE_INSCRIBED exact identity missing: ' + identity);
}
const finalCircleInscribed = circleInscribedBase.map((base) => {
  const identity = sourceKey(base);
  let finalProblemTypeKey = base.problemTypeKey;
  if (base.problemTypeKey === 'PT_CIRCLE_TANGENT') finalProblemTypeKey = 'PT_CIRCLE_ANGLE_RELATIONS';
  if (base.problemTypeKey === 'PT_TRIANGLE_CENTERS') finalProblemTypeKey = 'PT_CIRCLE_ANGLE_RELATIONS';
  if (base.problemTypeKey === 'PT_CIRCLE_LINE_RELATION') finalProblemTypeKey = 'PT_CIRCLE_ANGLE_RELATIONS';
  if (tangentKeep.has(identity)) {
    assert(base.problemTypeKey === 'PT_CIRCLE_ANGLE_RELATIONS', 'CIRCLE_INSCRIBED tangent keep baseline mismatch: ' + identity);
    finalProblemTypeKey = 'PT_CIRCLE_TANGENT';
  }
  if (lineFinal.has(identity)) {
    assert(identity === '25_신흥중_2학기_중간_중3_수학.js#23' ? base.problemTypeKey === 'PT_TRIANGLE_CENTERS' : base.problemTypeKey === 'PT_CIRCLE_ANGLE_RELATIONS', 'CIRCLE_INSCRIBED line final baseline mismatch: ' + identity);
    finalProblemTypeKey = 'PT_CIRCLE_LINE_RELATION';
  }
  if (twoCirclesKeep.has(identity)) {
    assert(base.problemTypeKey === 'PT_TWO_CIRCLES', 'CIRCLE_INSCRIBED two-circles baseline mismatch: ' + identity);
    finalProblemTypeKey = 'PT_TWO_CIRCLES';
  }
  if (oldCenters.has(identity) && !lineFinal.has(identity)) finalProblemTypeKey = 'PT_CIRCLE_ANGLE_RELATIONS';
  if (identity === oldLine) {
    assert(base.problemTypeKey === 'PT_CIRCLE_LINE_RELATION', 'CIRCLE_INSCRIBED old line baseline mismatch: ' + identity);
    finalProblemTypeKey = 'PT_CIRCLE_ANGLE_RELATIONS';
  }
  return finalL3Record(base, finalProblemTypeKey, 'FINAL', 'M3_CIRCLE_INSCRIBED_ANGLE_187_FINAL_REPLAY');
});

const finalRecords = [...finalM2, ...finalTrig, ...finalCircleLine, ...finalCircleInscribed];
assert(finalRecords.length === 928, 'Final ledger row count is not 928');

const sourceIdentity = finalRecords.map(sourceKey);
const uid = finalRecords.map((record) => record.questionUid);
const fingerprintByUid = new Map([...m2.records, ...m3.records].map((record) => [record.questionUid, record.sourceFingerprint]));
const countBy = (records) => records.reduce((counts, record) => {
  const key = record.problemTypeKey || 'OUT_OF_SCOPE_HOLD';
  counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});
const distribution = countBy(finalRecords);
const finalM3 = finalRecords.filter((record) => record.grade === 'M3');
const m2Distribution = countBy(finalRecords.filter((record) => record.grade === 'M2'));
const m3Distribution = countBy(finalM3);
const validation = {
  rows: finalRecords.length,
  uidUnique: new Set(uid).size === 928,
  sourceIdentityUnique: new Set(sourceIdentity).size === 928,
  duplicateUidCount: uid.length - new Set(uid).size,
  duplicateSourceIdentityCount: sourceIdentity.length - new Set(sourceIdentity).size,
  sourceFingerprintMismatchCount: finalRecords.filter((record) => fingerprintByUid.get(record.questionUid) !== record.sourceFingerprint).length,
  l3AuthorityExceptionCount: 0,
  pendingL3Count: 0,
  m2Rows: finalRecords.filter((record) => record.grade === 'M2').length,
  m3Rows: finalM3.length,
  mappedRows: finalRecords.filter((record) => record.problemTypeKey !== null).length,
  routeOutRows: finalRecords.filter((record) => record.problemTypeKey === null).length,
  distribution,
  m2Distribution,
  m3Distribution
};
assert(validation.uidUnique && validation.sourceIdentityUnique, 'Final ledger identity uniqueness failed');
assert(validation.sourceFingerprintMismatchCount === 0, 'Final ledger fingerprint mismatch');
assert(validation.m2Rows === 402 && validation.m3Rows === 526, 'Final ledger M2/M3 partition failed');
assert(validation.mappedRows === 921 && validation.routeOutRows === 7, 'Final ledger mapped/route-out parity failed');
assert(m2Distribution.PT_ISOSCELES_TRIANGLE === 44, 'M2 isosceles parity failed');
assert(m2Distribution.PT_RIGHT_TRIANGLE_CONGRUENCE === 24, 'M2 right congruence parity failed');
assert(m2Distribution.PT_TRIANGLE_ANGLE_BISECTOR === 2, 'M2 angle bisector parity failed');
assert(m2Distribution.PT_TRIANGLE_CENTERS === 77, 'M2 centers parity failed');
assert(m2Distribution.PT_QUADRILATERAL_PROPERTIES === 108, 'M2 quadrilateral parity failed');
assert(m2Distribution.PT_SIMILAR_FIGURES === 62, 'M2 similar figures parity failed');
assert(m2Distribution.PT_TRIANGLE_SIMILARITY === 25, 'M2 triangle similarity parity failed');
assert(m2Distribution.PT_PARALLEL_SEGMENT_RATIO === 49, 'M2 parallel ratio parity failed');
assert(m2Distribution.PT_COORD_CENTROID === 5, 'M2 centroid parity failed');
assert(m2Distribution.PT_CIRCLE_LINE_RELATION === 1, 'M2 circle-line parity failed');
assert(m3Distribution.PT_TRIG_RATIO === 106, 'M3 TRIG ratio parity failed');
assert(m3Distribution.PT_TRIG_RATIO_APPLICATION === 98, 'M3 TRIG application parity failed');
assert(m3Distribution.OUT_OF_SCOPE_HOLD === 2, 'M3 TRIG hold parity failed');
assert(m3Distribution.PT_CIRCLE_LINE_RELATION === 58, 'M3 circle-line parity failed');
assert(m3Distribution.PT_CIRCLE_TANGENT === 53, 'M3 tangent parity failed');
assert(m3Distribution.PT_TRIANGLE_CENTERS === 10, 'M3 centers parity failed');
assert(m3Distribution.PT_TWO_CIRCLES === 17, 'M3 two-circles parity failed');
assert(m3Distribution.PT_CIRCLE_ANGLE_RELATIONS === 182, 'M3 angle parity failed');
fs.writeFileSync(outputPath, JSON.stringify({
  schemaVersion: 'middle-geometry-l3-semantic-final-v1',
  authority: 'GPT FINAL item-level Notion decisions; Codex deterministic replay/materialization only',
  l3Only: true,
  sources: {
    m2Baseline: 'm2_item_level_l3_ledger_402.json',
    m2BaselineBlob: 'c5b11332d7791fcf8ff513a6213948465a454889',
    m3Baseline: 'm3_stage2_l3_fresh_assignment_526.json',
    m3BaselineBlob: '2d9c8bbb3c096e54ab344e8dd563432203e79229',
    phaseEvidence: 'l3_l4_semantic_freeze_928.json',
    gptTrig137: 'm3_trig_137_gpt_direct_final.json',
    gptTrig137Page: trig137.authority.pageUrl
  },
  denominator: {
    total: 928,
    m2: 402,
    m3: 526,
    mappedFinal: 921,
    routeOutFinal: 7
  },
  validation,
  records: finalRecords
}, null, 2) + '\n');
console.log(JSON.stringify({outputPath, validation}, null, 2));
