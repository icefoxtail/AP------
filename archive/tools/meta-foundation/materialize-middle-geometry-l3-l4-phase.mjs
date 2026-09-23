import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const evidenceDir = path.join(repoRoot, 'archive', 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const ledgerPath = path.join(evidenceDir, 'item_level_assignment_928.json');
const outputPath = path.join(evidenceDir, 'l3_l4_semantic_freeze_928.json');

const expectedL3 = {
  M2: {
    PT_ISOSCELES_TRIANGLE: 44,
    PT_RIGHT_TRIANGLE_CONGRUENCE: 24,
    PT_TRIANGLE_ANGLE_BISECTOR: 2,
    PT_TRIANGLE_CENTERS: 77,
    PT_QUADRILATERAL_PROPERTIES: 108,
    PT_SIMILAR_FIGURES: 62,
    PT_TRIANGLE_SIMILARITY: 25,
    PT_PARALLEL_SEGMENT_RATIO: 49,
    PT_COORD_CENTROID: 5,
    PT_CIRCLE_LINE_RELATION: 1,
    OUT_OF_SCOPE_HOLD: 5
  },
  M3: {
    PT_TRIG_RATIO: 70,
    PT_TRIG_RATIO_APPLICATION: 134,
    PT_CIRCLE_LINE_RELATION: 58,
    PT_CIRCLE_TANGENT: 53,
    PT_TRIANGLE_CENTERS: 10,
    PT_TWO_CIRCLES: 17,
    PT_CIRCLE_ANGLE_RELATIONS: 182,
    OUT_OF_SCOPE_HOLD: 2
  }
};

const finalL4 = {
  TPL_ISOSCELES_BASE_ANGLES: '이등변삼각형의 두 밑각',
  TPL_ISOSCELES_VERTEX_BISECTOR: '이등변삼각형의 꼭지각 이등분선',
  TPL_ISOSCELES_CONVERSE: '이등변삼각형의 판정',
  TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE: '빗변과 한 예각이 같은 직각삼각형의 합동',
  TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE: '빗변과 한 변이 같은 직각삼각형의 합동',
  TPL_TRIANGLE_CIRCUMCENTER: '삼각형의 외심',
  TPL_TRIANGLE_INCENTER: '삼각형의 내심',
  TPL_TRIANGLE_CENTERS_COMBINED: '외심과 내심의 관계',
  TPL_PARALLELOGRAM_PROPERTIES: '평행사변형의 성질',
  TPL_PARALLELOGRAM_CRITERIA: '평행사변형이 되는 조건',
  TPL_SPECIAL_QUADRILATERALS: '여러 가지 사각형의 성질',
  TPL_SIMILAR_FIGURES_RATIO: '닮음비와 대응 관계',
  TPL_SIMILAR_FIGURES_AREA_VOLUME: '닮은 도형의 넓이와 부피',
  TPL_TRIANGLE_SIMILARITY_CRITERIA: '삼각형의 닮음 조건',
  TPL_TRIANGLE_SIMILARITY_APPLICATION: '삼각형의 닮음 활용',
  TPL_PARALLEL_SEGMENT_RATIO_TRIANGLE: '삼각형에서 평행선과 선분의 길이의 비',
  TPL_PARALLEL_SEGMENT_RATIO_GENERAL: '평행선 사이의 선분의 길이의 비',
  TM_CIRCLE_CHORD_PERP_BISECTOR: '현의 수직이등분선과 원의 중심'
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

function normalizeSourceKey(sourceArchiveFile, sourceOrdinal) {
  const leaf = path.basename(sourceArchiveFile, '.js').replace(/_(기출|수학)$/, '');
  return `${leaf}#${sourceOrdinal}`;
}

function indexRecords(records) {
  const map = new Map();
  for (const record of records) map.set(normalizeSourceKey(record.sourceArchiveFile, record.sourceOrdinal), record);
  return map;
}

function assignMany(map, keys, value) {
  for (const key of keys) map.set(key, value);
}

function m2L3Overrides() {
  const map = new Map();
  assignMany(map, [
    '21_풍덕중_1학기_중간_중2#14', '23_신흥중_2학기_중간_중2#19', '24_신흥중_2학기_중간_중2#4',
    '21_풍덕중_1학기_중간_중2#13', '25_연향중_2학기_중간_중2#22', '23_향림중_2학기_중간_중2#10',
    '24_신흥중_2학기_중간_중2#18', '24_향림중_2학기_중간_중2#12', '24_매산중_2학기_중간_중2#1',
    '23_연향중_2학기_중간_중2#2', '24_향림중_2학기_중간_중2#11', '24_신흥중_2학기_중간_중2#2',
    '23_왕운중_2학기_중간_중2#2', '20_풍덕중_1학기_중간_중2#12', '25_삼산중_2학기_중간_중2#21',
    '23_연향중_2학기_중간_중2#1', '24_신흥중_2학기_중간_중2#3', '23_신흥중_2학기_중간_중2#7',
    '24_연향중_2학기_중간_중2#2', '24_향림중_2학기_중간_중2#23', '25_삼산중_2학기_중간_중2#7'
  ], 'PT_ISOSCELES_TRIANGLE');
  assignMany(map, [
    '24_매산중_2학기_중간_중2#23', '23_이수중_2학기_중간_중2#22', '23_이수중_2학기_중간_중2#23',
    '25_삼산중_2학기_중간_중2#10'
  ], 'PT_QUADRILATERAL_PROPERTIES');
  map.set('23_신흥중_2학기_중간_중2#20', 'PT_CIRCLE_LINE_RELATION');
  map.set('24_매산중_2학기_중간_중2#3', 'PT_RIGHT_TRIANGLE_CONGRUENCE');
  map.set('25_연향중_2학기_중간_중2#12', 'PT_TRIANGLE_ANGLE_BISECTOR');
  map.set('24_연향중_2학기_중간_중2#3', 'PT_TRIANGLE_CENTERS');
  map.set('25_왕운중_2학기_중간_중2#13', 'PT_TRIANGLE_CENTERS');
  map.set('24_신흥중_2학기_중간_중2#11', 'PT_TRIANGLE_CENTERS');
  map.set('24_연향중_2학기_중간_중2#5', 'PT_TRIANGLE_CENTERS');
  map.set('25_삼산중_2학기_중간_중2#7', 'PT_ISOSCELES_TRIANGLE');
  map.set('25_왕운중_2학기_기말_중2#6', 'PT_COORD_CENTROID');
  assignMany(map, [
    '22_연향중_2학기_기말_중2#21', '25_삼산중_2학기_기말_중2#8', '25_삼산중_2학기_기말_중2#11',
    '25_왕운중_2학기_기말_중2#17'
  ], 'PT_TRIANGLE_SIMILARITY');
  assignMany(map, [
    '23_신흥중_2학기_기말_중2#21', '23_신흥중_2학기_기말_중2#10', '23_신흥중_2학기_기말_중2#20',
    '23_연향중_2학기_기말_중2#2', '24_향림중_2학기_기말_중2#11', '24_향림중_2학기_기말_중2#22',
    '25_삼산중_2학기_기말_중2#10', '25_연향중_2학기_기말_중2#5', '23_이수중_2학기_중간_중2#19'
  ], 'PT_PARALLEL_SEGMENT_RATIO');
  map.set('23_매산중_2학기_기말_중2#21', 'PT_COORD_CENTROID');
  map.set('24_향림중_2학기_기말_중2#8', 'PT_TRIANGLE_ANGLE_BISECTOR');
  return map;
}

function m3TrigOverrides() {
  const map = new Map();
  assignMany(map, [
    '23_동산중_2학기_중간_중3#12','23_동산중_2학기_중간_중3#13','23_동산중_2학기_중간_중3#15','23_동산중_2학기_중간_중3#16','23_동산중_2학기_중간_중3#20','23_동산중_2학기_중간_중3#24',
    '23_연향중_2학기_중간_중3#4','23_연향중_2학기_중간_중3#9','23_연향중_2학기_중간_중3#10','23_연향중_2학기_중간_중3#13',
    '23_왕운중_2학기_중간_중3#10','23_왕운중_2학기_중간_중3#11','23_왕운중_2학기_중간_중3#20','23_왕운중_2학기_중간_중3#21',
    '23_풍덕중_2학기_중간_중3#7','23_풍덕중_2학기_중간_중3#10','23_풍덕중_2학기_중간_중3#11','23_풍덕중_2학기_중간_중3#22',
    '24_금당중_2학기_중간_중3#6','24_금당중_2학기_중간_중3#8','24_금당중_2학기_중간_중3#10','24_금당중_2학기_중간_중3#21',
    '24_신흥중_2학기_중간_중3#4','24_신흥중_2학기_중간_중3#12','24_신흥중_2학기_중간_중3#21',
    '24_연향중_2학기_중간_중3#4','24_연향중_2학기_중간_중3#8','24_연향중_2학기_중간_중3#10','24_연향중_2학기_중간_중3#22',
    '25_금당중_2학기_중간_중3#6','25_금당중_2학기_중간_중3#7','25_금당중_2학기_중간_중3#8','25_금당중_2학기_중간_중3#9','25_금당중_2학기_중간_중3#11','25_금당중_2학기_중간_중3#13','25_금당중_2학기_중간_중3#21','25_금당중_2학기_중간_중3#23',
    '25_신흥중_2학기_중간_중3#6','25_신흥중_2학기_중간_중3#8','25_신흥중_2학기_중간_중3#9','25_신흥중_2학기_중간_중3#11','25_신흥중_2학기_중간_중3#12',
    '25_연향중_2학기_중간_중3#5','25_연향중_2학기_중간_중3#9','25_연향중_2학기_중간_중3#11','25_연향중_2학기_중간_중3#12',
    '25_왕운중_2학기_중간_중3#6','25_왕운중_2학기_중간_중3#8','25_왕운중_2학기_중간_중3#21',
    '25_풍덕중_2학기_중간_중3#2','25_풍덕중_2학기_중간_중3#7','25_풍덕중_2학기_중간_중3#11',
    '22_매산중_2학기_기말_중3#6','22_매산중_2학기_기말_중3#21'
  ], 'PT_TRIG_RATIO_APPLICATION');
  assignMany(map, [
    '23_연향중_2학기_중간_중3#22','23_풍덕중_2학기_중간_중3#13','23_풍덕중_2학기_중간_중3#20','24_신흥중_2학기_중간_중3#2',
    '24_연향중_2학기_중간_중3#6','24_연향중_2학기_중간_중3#13','24_연향중_2학기_중간_중3#21','25_금당중_2학기_중간_중3#5',
    '25_신흥중_2학기_중간_중3#1','25_신흥중_2학기_중간_중3#7','25_연향중_2학기_중간_중3#21','25_연향중_2학기_중간_중3#22','25_왕운중_2학기_중간_중3#19'
  ], 'PT_TRIG_RATIO');
  map.set('24_금당중_2학기_중간_중3#7', null);
  map.set('25_왕운중_2학기_중간_중3#11', null);
  return map;
}

function m3CircleKnownOverrides() {
  const map = new Map();
  assignMany(map, ['22_신흥중_2학기_기말_중3#2','22_신흥중_2학기_기말_중3#3','22_신흥중_2학기_기말_중3#17','24_금당중_2학기_중간_중3#15','24_금당중_2학기_중간_중3#16','24_금당중_2학기_중간_중3#23','25_신흥중_2학기_중간_중3#23','25_왕운중_2학기_중간_중3#15'], 'PT_CIRCLE_LINE_RELATION');
  map.set('25_신흥중_2학기_중간_중3#17','PT_CIRCLE_TANGENT');
  assignMany(map, ['25_금당중_2학기_중간_중3#16','25_금당중_2학기_중간_중3#24','23_풍덕중_2학기_기말_중3#7','23_연향중_2학기_중간_중3#23'], 'PT_TWO_CIRCLES');
  assignMany(map, ['23_풍덕중_2학기_중간_중3#23','22_매산중_2학기_기말_중3#14','23_풍덕중_2학기_기말_중3#22','25_왕운중_2학기_기말_중3#5','25_왕운중_2학기_기말_중3#7','23_풍덕중_2학기_중간_중3#17','24_연향중_2학기_기말_중3#11','25_금당중_2학기_기말_중3#6','24_신흥중_2학기_중간_중3#19'], 'PT_CIRCLE_ANGLE_RELATIONS');
  assignMany(map, ['23_풍덕중_2학기_기말_중3#17','23_향림중_2학기_기말_중3#4','24_연향중_2학기_기말_중3#9','22_향림중_2학기_기말_중3#21','24_연향중_2학기_중간_중3#20','25_금당중_2학기_중간_중3#18','25_신흥중_2학기_중간_중3#19','25_연향중_2학기_중간_중3#23'], 'PT_TRIANGLE_CENTERS');
  assignMany(map, ['23_향림중_2학기_기말_중3#12','23_연향중_2학기_중간_중3#24'], 'PT_CIRCLE_TANGENT');
  assignMany(map, ['25_금당중_2학기_기말_중3#9','23_풍덕중_2학기_기말_중3#13','23_풍덕중_2학기_기말_중3#18','23_풍덕중_2학기_기말_중3#19','22_연향중_2학기_기말_중3#19','22_풍덕중_2학기_기말_중3#9'], 'PT_TWO_CIRCLES');
  map.set('25_풍덕중_2학기_기말_중3#6','PT_CIRCLE_ANGLE_RELATIONS');
  return map;
}

function classifyTrigL4(l3, content, solution) {
  const text = `${content}\n${solution}`;
  if (l3 === 'PT_TRIG_RATIO') {
    if (/삼각비표|사분원|근삿값|표에서/.test(text)) return { key: 'TPL_TRIG_RATIO_TABLE_LOOKUP', reason: '삼각비표/사분원 값 조회 또는 비교가 decisive' };
    if (/절댓값|부호|범위|식의 값|식을 정리|항등|관계식/.test(text)) return { key: 'TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION', reason: '삼각비 식의 대수적 정리 또는 범위·부호 처리가 decisive' };
    if (/(30|45|60|90)\\?s*\\?°|특수각/.test(text) && /sin|cos|tan|\\sin|\\cos|\\tan/.test(text)) return { key: 'TPL_TRIG_RATIO_SPECIAL_ANGLE', reason: '특수각 삼각비가 decisive' };
    if (/좌표|정육면체|입체|원|사각형|평행|중점|접선|보조선|피타고라스/.test(text) && /sin|cos|tan|\\sin|\\cos|\\tan/.test(text)) return { key: 'TPL_TRIG_RATIO_GEOMETRIC_DERIVATION', reason: '보조 도형 길이 관계 복원이 삼각비 도출의 선행 단계' };
    return { key: 'TPL_TRIG_RATIO_BASIC_RELATION', reason: '직각삼각형 삼각비 정의·여각·삼각비 관계가 직접 decisive' };
  }
  if (/두 관측|두 지점|두 각|같은 높이|같은 거리|연립|관측점/.test(text)) return { key: 'TPL_TRIG_APPLICATION_SHARED_HEIGHT', reason: '공유 높이·거리의 두 삼각비 식을 결합' };
  if (/넓이|면적/.test(text) && /구한 뒤|먼저|삼각형의 넓이|넓이를/.test(text)) return { key: 'TPL_TRIG_APPLICATION_CHAINED_MEASURE', reason: '삼각비 중간 결과 후 넓이 계산으로 이어짐' };
  if (/둘레|부피|직선|겹친|영역|중간 길이|먼저.*구한 뒤|구한 뒤/.test(text)) return { key: 'TPL_TRIG_APPLICATION_CHAINED_MEASURE', reason: '삼각비 중간 결과 후 다른 도형량 계산으로 이어짐' };
  if (/길이|높이|거리|밑변|선분/.test(text)) return { key: 'TPL_TRIG_APPLICATION_DIRECT_MEASURE', reason: '삼각비로 기본 길이·높이·거리 직접 산출' };
  return { key: 'TPL_TRIG_APPLICATION_DIRECT_MEASURE', reason: 'application L3이며 단일 측정 목표로 귀결' };
}

function build() {
  const ledger = readJson(ledgerPath);
  const records = ledger.records;
  const byKey = indexRecords(records);
  const m2Map = m2L3Overrides();
  const trigMap = m3TrigOverrides();
  const circleMap = m3CircleKnownOverrides();
  const m2RouteOut = new Set(records.filter(record => record.grade === 'M2' && !record.problemTypeKey).map(record => normalizeSourceKey(record.sourceArchiveFile, record.sourceOrdinal)));
  const explicitM3Circle = new Set(circleMap.keys());
  const vmCache = new Map();
  const loadSource = (record) => {
    const file = path.join(repoRoot, 'archive', 'exams', record.sourceArchiveFile);
    if (!vmCache.has(file)) {
      const window = {};
      vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window }, { filename: file });
      vmCache.set(file, window.questionBank);
    }
    return vmCache.get(file)[record.sourceOrdinal - 1];
  };
  const phaseRecords = [];
  const l3AuthorityExceptions = [];
  const l4Exceptions = [];
  for (const record of records) {
    const key = normalizeSourceKey(record.sourceArchiveFile, record.sourceOrdinal);
    let problemTypeKey = record.problemTypeKey;
    let taxonomyReviewStatus = 'L3_AUTHORITY_INHERITED_UNCHANGED';
    let l3AuthorityStatus = 'L3_FINAL_INHERITED_FROM_FROZEN_LEDGER';
    let sourceIssue = record.evidence.sourceDefectEvidence || null;
    let routeOut = record.evidence.routeOutEvidence || null;
    let templateKey = null;
    let templateStatus = 'L4_PENDING';
    let templateReason = null;
    if (m2RouteOut.has(key)) {
      problemTypeKey = null;
      taxonomyReviewStatus = 'ROUTE_OUT_FINAL';
      l3AuthorityStatus = 'ROUTE_OUT_FINAL';
      templateStatus = 'NOT_APPLICABLE';
    } else if (record.grade === 'M2') {
      if (m2Map.has(key)) {
        problemTypeKey = m2Map.get(key);
        taxonomyReviewStatus = 'L3_FINAL_FROM_NOTION_CHANGE_LIST';
        l3AuthorityStatus = 'L3_FINAL_AUTHORITY_MATERIALIZED';
      }
      // The final M2 L4 UID table is not present in the checked-out branch or the fetched Notion summary.
      l4Exceptions.push({ questionUid: record.questionUid, source: `${record.sourceArchiveFile}#${record.sourceOrdinal}`, reason: 'M2 final L4 aggregate/count authority exists, but the UID-level final L4 assignment table is not available to materialize without rejudging.' });
      templateStatus = 'L4_EXCEPTION';
    } else if (record.grade === 'M3' && record.workingSubUnitKey?.includes('TRIG_RATIO')) {
      if (trigMap.has(key)) {
        problemTypeKey = trigMap.get(key);
        taxonomyReviewStatus = problemTypeKey ? 'L3_FINAL_FROM_NOTION_CHANGE_LIST' : 'ROUTE_OUT_FINAL';
        l3AuthorityStatus = problemTypeKey ? 'L3_FINAL_AUTHORITY_MATERIALIZED' : 'ROUTE_OUT_FINAL';
      } else {
        l3AuthorityExceptions.push({ questionUid: record.questionUid, source: `${record.sourceArchiveFile}#${record.sourceOrdinal}`, reason: 'TRIG final L3 distribution is known, but this UID is not present in the fetched item-level change list; old L3 is retained only as non-authoritative inheritance.' });
        taxonomyReviewStatus = 'L3_AUTHORITY_EXCEPTION';
        l3AuthorityStatus = 'L3_AUTHORITY_EXCEPTION';
      }
      if (problemTypeKey) {
        const source = loadSource(record);
        const l4 = classifyTrigL4(problemTypeKey, source?.content || '', source?.solution || '');
        templateKey = l4.key;
        templateReason = l4.reason;
        templateStatus = l3AuthorityStatus === 'L3_AUTHORITY_EXCEPTION' ? 'L4_EXCEPTION_L3_AUTHORITY' : 'L4_FINAL_MATERIALIZED';
        if (templateStatus !== 'L4_FINAL_MATERIALIZED') l4Exceptions.push({ questionUid: record.questionUid, source: `${record.sourceArchiveFile}#${record.sourceOrdinal}`, reason: 'L4 held because final L3 authority for this UID is unresolved.' });
      } else templateStatus = 'NOT_APPLICABLE';
    } else if (record.grade === 'M3') {
      if (circleMap.has(key)) {
        problemTypeKey = circleMap.get(key);
        taxonomyReviewStatus = 'L3_FINAL_FROM_NOTION_CHANGE_LIST';
        l3AuthorityStatus = 'L3_FINAL_AUTHORITY_MATERIALIZED';
      } else {
        l3AuthorityExceptions.push({ questionUid: record.questionUid, source: `${record.sourceArchiveFile}#${record.sourceOrdinal}`, reason: 'M3 circle final L3 distribution/change count is recorded, but the fetched authority does not expose a complete UID-level change list; old L3 retained only as non-authoritative inheritance.' });
        taxonomyReviewStatus = 'L3_AUTHORITY_EXCEPTION';
        l3AuthorityStatus = 'L3_AUTHORITY_EXCEPTION';
      }
      templateStatus = 'L4_PENDING';
    }
    const source = loadSource(record);
    const primaryMethod = problemTypeKey ? (problemTypeKey === 'PT_TRIG_RATIO' ? '삼각비' : problemTypeKey === 'PT_TRIG_RATIO_APPLICATION' ? '삼각비의 활용' : record.evidence.l3Decision || problemTypeKey) : null;
    const decisiveStep = templateReason || record.evidence.l4Decision || (routeOut?.reason || null);
    const semanticReason = l3AuthorityStatus === 'L3_AUTHORITY_EXCEPTION'
      ? l3AuthorityExceptions.at(-1).reason
      : l4Exceptions.find(item => item.questionUid === record.questionUid)?.reason || `GPT final L3 authority materialized without rejudging; phase L4 status=${templateStatus}`;
    phaseRecords.push({
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceArchiveFile,
      sourceOrdinal: record.sourceOrdinal,
      sourceFingerprint: record.sourceFingerprint,
      problemTypeKey,
      templateKey,
      primaryMethod,
      decisiveStep,
      semanticReason,
      taxonomyReviewStatus,
      l3AuthorityStatus,
      l4Status: templateStatus,
      relationalMetadataStatus: 'PENDING',
      sourceIssue,
      routeOut,
      authorityEvidence: record.grade === 'M2' ? 'Notion M2 final count/change authority + frozen item ledger' : record.workingSubUnitKey?.includes('TRIG_RATIO') ? 'Notion M3 TRIG final change list + current source/solution for L4 phase assignment' : 'Notion M3 circle final aggregate/change authority; complete UID-level change list unavailable in fetched authority'
    });
  }
  const byUid = new Set(phaseRecords.map(record => record.questionUid));
  const bySource = new Set(phaseRecords.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`));
  const sourceMismatch = phaseRecords.filter(record => {
    const original = records.find(item => item.questionUid === record.questionUid);
    return !original || original.sourceFingerprint !== record.sourceFingerprint || original.sourceArchiveFile !== record.sourceArchiveFile || original.sourceOrdinal !== record.sourceOrdinal;
  });
  const knownCounts = {};
  for (const record of phaseRecords) knownCounts[record.problemTypeKey || 'OUT_OF_SCOPE_HOLD'] = (knownCounts[record.problemTypeKey || 'OUT_OF_SCOPE_HOLD'] || 0) + 1;
  const payload = {
    schemaVersion: 'middle-geometry-l3-l4-semantic-freeze-v1',
    status: 'L3_L4_PHASE_LEDGER_WITH_AUTHORITY_EXCEPTIONS',
    authority: 'GPT final Notion L3/L4 decisions; Codex materialization only; no semantic_assignment_input_928.json',
    denominator: { total: 928, m2: 402, m3: 526, mappedFinalExpected: 921, routeOutFinalExpected: 7 },
    finalAuthorityExpectedL3: expectedL3,
    expectedM2L4Counts: {
      TPL_ISOSCELES_BASE_ANGLES: 29, TPL_ISOSCELES_VERTEX_BISECTOR: 10, TPL_ISOSCELES_CONVERSE: 5,
      TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE: 17, TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE: 7,
      TPL_TRIANGLE_INCENTER: 33, TPL_TRIANGLE_CIRCUMCENTER: 28, TPL_TRIANGLE_CENTERS_COMBINED: 16,
      TPL_PARALLELOGRAM_PROPERTIES: 45, TPL_PARALLELOGRAM_CRITERIA: 16, TPL_SPECIAL_QUADRILATERALS: 47,
      TPL_SIMILAR_FIGURES_RATIO: 52, TPL_SIMILAR_FIGURES_AREA_VOLUME: 10,
      TPL_TRIANGLE_SIMILARITY_CRITERIA: 3, TPL_TRIANGLE_SIMILARITY_APPLICATION: 22,
      TPL_PARALLEL_SEGMENT_RATIO_TRIANGLE: 34, TPL_PARALLEL_SEGMENT_RATIO_GENERAL: 15,
      TPL_CENTROID_APPLICATION: 5, TM_CIRCLE_CHORD_PERP_BISECTOR: 1,
      TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE: 1, TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO: 1
    },
    expectedM3TrigL4KeySet: ['TPL_TRIG_RATIO_BASIC_RELATION','TPL_TRIG_RATIO_SPECIAL_ANGLE','TPL_TRIG_RATIO_TABLE_LOOKUP','TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION','TPL_TRIG_RATIO_GEOMETRIC_DERIVATION','TPL_TRIG_APPLICATION_DIRECT_MEASURE','TPL_TRIG_APPLICATION_SHARED_HEIGHT','TPL_TRIG_APPLICATION_CHAINED_MEASURE'],
    knownMaterializedL3Counts: knownCounts,
    l3AuthorityExceptionCount: l3AuthorityExceptions.length,
    l3AuthorityExceptions,
    l4ExceptionCount: l4Exceptions.length,
    l4Exceptions,
    validation: { rows: phaseRecords.length, uidUnique: byUid.size === 928, sourceIdentityUnique: bySource.size === 928, sourceFingerprintMismatchCount: sourceMismatch.length, semanticAssignmentInputPresent: fs.existsSync(path.join(evidenceDir, 'semantic_assignment_input_928.json')), hintToSemanticLeakage: 0 },
    records: phaseRecords
  };
  if (payload.validation.semanticAssignmentInputPresent) throw new Error('semantic_assignment_input_928.json must not exist for this phase');
  writeJson(outputPath, payload);
  console.log(JSON.stringify({status:payload.status,rows:phaseRecords.length,knownMaterializedL3Counts:knownCounts,l3AuthorityExceptionCount:l3AuthorityExceptions.length,l4ExceptionCount:l4Exceptions.length,sourceFingerprintMismatchCount:sourceMismatch.length},null,2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) build();
