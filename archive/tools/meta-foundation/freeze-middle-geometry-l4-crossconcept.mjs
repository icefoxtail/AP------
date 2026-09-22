import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const dir = path.join(ROOT, 'archive/data/meta-foundation/evidence/middle-geometry/v1');
const l3Path = path.join(dir, 'l3_semantic_final_928.json');
const itemPath = path.join(dir, 'item_level_assignment_928.json');
const conceptDir = path.join(ROOT, 'archive/data/meta-foundation/canonical/concepts');
const outPath = path.join(dir, 'l4_crossconcept_semantic_freeze_928.json');
const registryPath = path.join(dir, 'l4_template_semantic_registry_candidate.json');
const proposalPath = path.join(dir, 'crossconcept_candidate_proposals.json');
const summaryPath = path.join(dir, 'L4_CROSSCONCEPT_SEMANTIC_SUMMARY.md');
const statePath = path.join(dir, 'STATE.json');
const inventoryPath = path.join(dir, 'INVENTORY.json');
const checkpointsPath = path.join(dir, 'CHECKPOINTS.json');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha256 = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digestText = (value) => crypto.createHash('sha256').update(value).digest('hex');
const repoPath = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

const l3Doc = readJson(l3Path);
const itemDoc = readJson(itemPath);
const l3ByUid = new Map(l3Doc.records.map(r => [r.questionUid, r]));
const itemByUid = new Map(itemDoc.records.map(r => [r.questionUid, r]));
const activeConcepts = new Map();
for (const name of fs.readdirSync(conceptDir).filter(n => n.endsWith('.json'))) {
  const doc = readJson(path.join(conceptDir, name));
  for (const concept of doc.concepts || []) {
    if (concept.status === 'ACTIVE') activeConcepts.set(concept.conceptKey, concept);
  }
}
const mapped = l3Doc.records.filter(r => r.problemTypeKey !== null);
const routeOut = l3Doc.records.filter(r => r.problemTypeKey === null);
assert(mapped.length === 921 && routeOut.length === 7, 'L3 parent denominator mismatch');
assert(new Set(l3Doc.records.map(r => r.questionUid)).size === 928, 'L3 UID uniqueness mismatch');
assert(new Set(l3Doc.records.map(r => r.sourceArchiveFile + '#' + r.sourceOrdinal)).size === 928, 'L3 source identity uniqueness mismatch');

const registry = new Map();
const register = (templateKey, parentProblemTypeKey, canonicalLabelKo, definition, internalSkeleton, reuse) => {
  const prior = registry.get(templateKey);
  if (prior) {
    assert(prior.parentProblemTypeKey === parentProblemTypeKey, 'L4 parent collision: ' + templateKey);
    return;
  }
  registry.set(templateKey, {
    templateKey,
    parentProblemTypeKey,
    canonicalLabelKo,
    definition,
    internalSkeleton,
    reuse: reuse ? 'ACTIVE_REUSE' : 'NEW_CANDIDATE',
    status: reuse ? 'REUSED_ACTIVE' : 'REVIEW_REQUIRED',
    supportingQuestionUids: [],
    supportCount: 0
  });
};
const defs = [
  ['TPL_ISOSCELES_BASE_ANGLES','PT_ISOSCELES_TRIANGLE','이등변삼각형의 밑각','이등변삼각형의 두 밑각 또는 꼭지각과 밑각의 관계를 이용한다.','이등변삼각형의 각 관계를 먼저 정리하고 목표각을 계산한다.',false],
  ['TPL_ISOSCELES_VERTEX_BISECTOR','PT_ISOSCELES_TRIANGLE','이등변삼각형의 꼭지각 이등분선','이등변삼각형에서 꼭지각 이등분선으로 두 삼각형을 나누어 합동·각 관계를 이용한다.','꼭지각 이등분선의 공통변·각 조건으로 두 부분삼각형의 관계를 확정한다.',false],
  ['TPL_ISOSCELES_CONVERSE','PT_ISOSCELES_TRIANGLE','이등변삼각형의 판정','두 각 또는 두 변의 같음을 이용해 이등변삼각형임을 판정한다.','같은 각/변 조건에서 대변 대응을 확인해 이등변 구조를 판정한다.',false],
  ['TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE','PT_RIGHT_TRIANGLE_CONGRUENCE','빗변과 한 예각이 같은 직각삼각형의 합동','직각삼각형에서 빗변과 한 예각의 대응을 이용한다.','두 직각 조건과 빗변·예각 대응을 확인해 합동을 적용한다.',false],
  ['TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE','PT_RIGHT_TRIANGLE_CONGRUENCE','빗변과 한 변이 같은 직각삼각형의 합동','직각삼각형에서 빗변과 한 변 또는 중점 길이 관계를 이용한다.','직각 조건과 빗변·변 대응을 확인해 길이 관계를 도출한다.',false],
  ['TPL_TRIANGLE_INCENTER','PT_TRIANGLE_CENTERS','삼각형의 내심','내심과 각의 이등분선 관계를 이용한다.','내심이 만드는 각 이등분선과 내심각 관계를 적용한다.',false],
  ['TPL_TRIANGLE_CIRCUMCENTER','PT_TRIANGLE_CENTERS','삼각형의 외심','외심·외접원·빗변의 중점 관계를 이용한다.','외심의 등거리 또는 빗변 중점 성질로 각·길이를 결정한다.',false],
  ['TPL_TRIANGLE_CENTERS_COMBINED','PT_TRIANGLE_CENTERS','외심과 내심의 관계','외심과 내심 또는 두 중심 성질을 함께 이용한다.','두 중심에서 발생하는 각·거리 관계를 순차적으로 결합한다.',false],
  ['TPL_QUADRILATERAL_PROPERTIES','PT_QUADRILATERAL_PROPERTIES','평행사변형의 성질','평행사변형의 변·각·대각선 성질을 이용한다.','평행사변형의 평행·대변·대각선 조건을 목표값에 연결한다.',false],
  ['TPL_QUADRILATERAL_CRITERIA','PT_QUADRILATERAL_PROPERTIES','평행사변형의 판정','대변·대각선·평행 조건으로 평행사변형임을 판정한다.','주어진 필요조건을 평행사변형 판정 조건으로 연결한다.',false],
  ['TPL_SPECIAL_QUADRILATERALS','PT_QUADRILATERAL_PROPERTIES','특수한 사각형의 성질','직사각형·마름모·정사각형 등 특수 사각형의 정의와 성질을 이용한다.','특수 사각형의 대각선·변·각 성질을 적용해 결론을 낸다.',false],
  ['TPL_SIMILAR_FIGURES_RATIO','PT_SIMILAR_FIGURES','도형의 닮음비','이미 닮은 도형의 대응변·둘레·비 관계를 이용한다.','대응변을 정렬해 닮음비를 세우고 목표 길이·비를 계산한다.',false],
  ['TPL_SIMILAR_FIGURES_AREA_VOLUME','PT_SIMILAR_FIGURES','닮은 도형의 넓이·부피비','닮음비에서 넓이·부피 또는 도형량의 비를 도출한다.','길이 닮음비를 넓이·부피 비로 변환해 목표량을 구한다.',false],
  ['TPL_TRIANGLE_SIMILARITY_CRITERIA','PT_TRIANGLE_SIMILARITY','삼각형의 닮음 조건','AA·SAS·SSS 등으로 두 삼각형의 닮음을 새로 판정한다.','대응각·변비를 확인해 닮음 조건을 세우고 결론을 낸다.',false],
  ['TPL_TRIANGLE_SIMILARITY_APPLICATION','PT_TRIANGLE_SIMILARITY','삼각형 닮음의 활용','성립한 삼각형 닮음으로 길이·넓이 등 목표값을 계산한다.','닮음비를 세운 뒤 목표 길이·도형량으로 연결한다.',false],
  ['TPL_PARALLEL_SEGMENT_RATIO_TRIANGLE','PT_PARALLEL_SEGMENT_RATIO','삼각형에서 평행선과 선분의 비','삼각형 내부 평행선과 중점연결 구조의 선분비를 이용한다.','평행선으로 생긴 닮음·비례식을 세워 선분을 구한다.',false],
  ['TPL_PARALLEL_SEGMENT_RATIO_GENERAL','PT_PARALLEL_SEGMENT_RATIO','일반 도형의 평행선과 선분의 비','삼각형 이외의 평행선·사각형·교차선 구조에서 선분비를 이용한다.','평행 조건과 교점 관계를 비례식으로 변환해 목표 길이를 구한다.',false],
  ['TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE','PT_TRIANGLE_ANGLE_BISECTOR','각의 이등분선 위 점의 거리','각의 이등분선 위 점에서 두 변까지의 거리 관계를 이용한다.','각의 이등분선과 두 변까지의 수선 길이 관계를 적용한다.',false],
  ['TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO','PT_TRIANGLE_ANGLE_BISECTOR','삼각형의 각의 이등분선 정리','각의 이등분선이 대변을 양변의 비로 나누는 성질을 이용한다.','각의 이등분선 정리의 변비를 세워 미지 길이를 구한다.',false],
  ['TPL_CENTROID_DIRECT','PT_COORD_CENTROID','세 꼭짓점으로 무게중심 구하기','세 꼭짓점 좌표의 평균 또는 직접적인 무게중심 좌표를 이용한다.','주어진 꼭짓점·좌표에서 무게중심 좌표를 직접 계산한다.',true],
  ['TPL_CENTROID_REVERSE','PT_COORD_CENTROID','무게중심으로 꼭짓점 구하기','주어진 무게중심 좌표 또는 중선의 2:1 성질로 미지 꼭짓점을 구한다.','무게중심 조건을 역으로 풀어 미지 좌표·길이를 결정한다.',true],
  ['TPL_CENTROID_APPLICATION','PT_COORD_CENTROID','무게중심의 활용','다른 도형 성질·좌표 조건과 무게중심 조건을 함께 이용한다.','무게중심의 2:1 또는 좌표 조건을 다른 도형량 계산으로 연결한다.',true],
  ['TPL_CENTROID_DISTANCE_RELATION','PT_COORD_CENTROID','무게중심과 거리의 관계','무게중심과 꼭짓점 사이 거리·거리제곱 관계를 이용한다.','무게중심의 거리 관계를 세워 목표 길이·식을 계산한다.',true],
  ['TPL_TRIG_RATIO_BASIC_RELATION','PT_TRIG_RATIO','삼각비의 기본 관계','삼각비 정의와 한 삼각비에서 다른 삼각비로의 변환을 이용한다.','직각삼각형의 변·각 관계를 삼각비 식으로 직접 변환한다.',false],
  ['TPL_TRIG_RATIO_SPECIAL_ANGLE','PT_TRIG_RATIO','특수각의 삼각비','특수각의 삼각비 값을 직접 계산·비교·판정한다.','특수각 관계를 사용해 삼각비 또는 각을 결정한다.',false],
  ['TPL_TRIG_RATIO_TABLE_LOOKUP','PT_TRIG_RATIO','삼각비표의 조회','삼각비표·근삿값·역조회로 값을 비교하거나 각을 찾는다.','표의 값과 주어진 조건을 대응시켜 삼각비·각을 결정한다.',false],
  ['TPL_TRIG_RATIO_ALGEBRAIC_SIMPLIFICATION','PT_TRIG_RATIO','삼각비 식의 대수적 정리','삼각비 식의 변형·부호·범위·항등 관계를 정리한다.','삼각비 항등식과 범위 조건으로 식을 단순화한다.',false],
  ['TPL_TRIG_RATIO_GEOMETRIC_DERIVATION','PT_TRIG_RATIO','도형에서 삼각비 값 유도','보조선·좌표·평면/입체 도형의 길이 관계를 복원한 뒤 삼각비를 구한다.','도형의 길이 관계를 먼저 복원하고 최종 삼각비 값으로 연결한다.',false],
  ['TPL_TRIG_APPLICATION_DIRECT_MEASURE','PT_TRIG_RATIO_APPLICATION','삼각비로 직접 길이·높이·거리 구하기','삼각비로 목표 길이·높이·거리·기본 측정값을 직접 구한다.','한 개 또는 연결된 직각삼각형에서 목표 측정값을 바로 산출한다.',false],
  ['TPL_TRIG_APPLICATION_SHARED_HEIGHT','PT_TRIG_RATIO_APPLICATION','공통 높이·거리 측량','두 관측점·두 각에서 공통 높이·거리를 공유하는 식을 세운다.','공통 미지량에 대한 두 삼각비 식을 세워 연립한다.',false],
  ['TPL_TRIG_APPLICATION_CHAINED_MEASURE','PT_TRIG_RATIO_APPLICATION','삼각비 연쇄 측정','삼각비로 중간 길이·각을 만든 뒤 넓이·둘레·부피·직선식 등으로 연결한다.','삼각비 계산 결과를 다른 도형량·대상량의 계산으로 이어간다.',false],
  ['TM_CIRCLE_LINE_POSITION','PT_CIRCLE_LINE_RELATION','원과 직선의 위치 관계','중심-직선 거리, 현, 교점·접점 관계를 이용한다.','원과 직선의 거리·반지름 관계로 위치 또는 목표 길이를 결정한다.',true],
  ['TM_CIRCLE_CHORD_LENGTH','PT_CIRCLE_LINE_RELATION','현의 길이','현의 길이·현과 중심 거리 관계를 이용한다.','현의 반길이·중심거리·반지름 관계로 목표 길이를 구한다.',true],
  ['TM_CIRCLE_CHORD_PERP_BISECTOR','PT_CIRCLE_LINE_RELATION','현의 수직이등분선','현의 수직이등분선이 중심을 지난다는 성질을 이용한다.','두 현의 수직이등분선 또는 중심 조건으로 중심을 결정한다.',true],
  ['TM_CIRCLE_INTERSECTION_RELATION','PT_CIRCLE_LINE_RELATION','원과 직선의 두 교점 관계','두 교점·교점의 거리·곱 관계를 이용한다.','원과 직선의 교점 조건을 세워 목표 관계를 계산한다.',true],
  ['TM_TANGENT_LENGTH','PT_CIRCLE_TANGENT','접선의 길이','외부점에서 원에 그은 접선 길이와 접점 관계를 이용한다.','반지름·외부점·접점으로 생긴 직각삼각형 또는 길이 관계를 적용한다.',true],
  ['TM_TANGENT_CONTACT_CHORD_LENGTH','PT_CIRCLE_TANGENT','두 접점과 현의 길이','두 접선의 접점·접점을 잇는 현 또는 관련 길이를 이용한다.','접선 길이와 접점 현 관계를 결합해 목표 길이를 구한다.',true],
  ['TM_TANGENCY_CONDITION','PT_CIRCLE_TANGENT','접선 조건','접선·반지름 수직 또는 중심거리=반지름 조건을 이용한다.','접선 성립 조건을 방정식·거리 관계로 변환한다.',true],
  ['TM_TWO_CIRCLES_COMMON_CHORD_LINE','PT_TWO_CIRCLES','두 원의 공통현 직선','두 원의 공통교점·공통현 또는 그 직선을 이용한다.','두 원의 방정식·공통교점 조건에서 공통현 관계를 도출한다.',true],
  ['TM_TWO_CIRCLES_COMMON_CHORD_LENGTH','PT_TWO_CIRCLES','두 원의 공통현 길이','두 원의 공통현 길이 또는 길이 조건을 이용한다.','두 원의 중심거리·반지름·공통현 관계로 목표 길이를 구한다.',true],
  ['TM_TWO_CIRCLES_COMMON_TANGENT','PT_TWO_CIRCLES','두 원의 공통접선','두 원에 동시에 접하는 직선·접선 조건을 이용한다.','두 원과 직선의 접선 조건을 동시에 만족시킨다.',true],
  ['TM_TWO_CIRCLES_CENTER_LINE','PT_TWO_CIRCLES','두 원의 중심을 지나는 직선','두 원의 중심 관계 또는 중심을 지나는 직선을 이용한다.','두 중심의 좌표·거리 관계로 목표 직선을 결정한다.',true],
  ['TM_TWO_CIRCLES_TANGENT_CIRCLE','PT_TWO_CIRCLES','두 원에 접하는 원','두 원에 동시에 접하는 제3의 원을 결정한다.','두 원과 제3 원의 접점·거리 조건을 연립한다.',true],
  ['TPL_TRIANGLE_CENTERS_SEMANTIC','PT_TRIANGLE_CENTERS','삼각형 중심의 성질','내심·외심·중심 관련 성질을 목표에 맞게 적용한다.','중심의 정의·등거리·각 관계 중 필요한 성질을 적용한다.',false],
  ['TPL_CIRCLE_ANGLE_CENTER_ARC','PT_CIRCLE_ANGLE_RELATIONS','원주각과 중심각','원주각·중심각·호의 대응 관계를 이용한다.','호·중심각·원주각의 배수 관계로 목표각을 계산한다.',false],
  ['TPL_CIRCLE_ANGLE_TANGENT_CHORD','PT_CIRCLE_ANGLE_RELATIONS','접선과 현이 이루는 각','접선-현각과 원주각·호 관계를 이용한다.','접선·현·호·원주각 관계를 대응시켜 목표각을 구한다.',false],
  ['TPL_CIRCLE_ANGLE_COMPOSITE','PT_CIRCLE_ANGLE_RELATIONS','복합 원의 각 관계','여러 원주각·중심각·접선·현 관계를 순차 결합한다.','복수의 원의 각 관계를 연쇄해 목표각·길이·넓이를 결정한다.',false]
];
for (const d of defs) register(...d);

const normalizeCandidate = (l3, candidate) => {
  const c = candidate || '';
  if (l3 === 'PT_ISOSCELES_TRIANGLE') {
    if (c.includes('ANGLE_BISECTOR_PROOF') || c.includes('ANGLE_BISECTOR_DIRECT')) return c.includes('PROOF') ? 'TPL_ISOSCELES_VERTEX_BISECTOR' : 'TPL_ISOSCELES_BASE_ANGLES';
    if (c.includes('CONVERSE')) return 'TPL_ISOSCELES_CONVERSE';
    if (c.includes('RIGHT_TRIANGLE')) return 'TPL_ISOSCELES_BASE_ANGLES';
    return c.includes('PROOF') ? 'TPL_ISOSCELES_VERTEX_BISECTOR' : 'TPL_ISOSCELES_BASE_ANGLES';
  }
  if (l3 === 'PT_RIGHT_TRIANGLE_CONGRUENCE') return c.includes('APPLICATION') ? 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE' : 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE';
  if (l3 === 'PT_TRIANGLE_CENTERS') return 'TPL_TRIANGLE_CENTERS_SEMANTIC';
  if (l3 === 'PT_QUADRILATERAL_PROPERTIES') {
    if (c.includes('APPLICATION') || c.includes('RATIO')) return 'TPL_QUADRILATERAL_PROPERTIES';
    if (c.includes('PROOF') || c.includes('ANGLE_BISECTOR')) return 'TPL_QUADRILATERAL_CRITERIA';
    return 'TPL_SPECIAL_QUADRILATERALS';
  }
  if (l3 === 'PT_SIMILAR_FIGURES') return c.includes('RATIO_RELATION') || c.includes('DIRECT') ? 'TPL_SIMILAR_FIGURES_RATIO' : 'TPL_SIMILAR_FIGURES_AREA_VOLUME';
  if (l3 === 'PT_TRIANGLE_SIMILARITY') return c.includes('PROOF') ? 'TPL_TRIANGLE_SIMILARITY_CRITERIA' : 'TPL_TRIANGLE_SIMILARITY_APPLICATION';
  if (l3 === 'PT_PARALLEL_SEGMENT_RATIO') return c.includes('APPLICATION') || c.includes('TRIANGLE_SIMILARITY') ? 'TPL_PARALLEL_SEGMENT_RATIO_GENERAL' : 'TPL_PARALLEL_SEGMENT_RATIO_TRIANGLE';
  if (l3 === 'PT_TRIANGLE_ANGLE_BISECTOR') return c.includes('RATIO') || c.includes('SIMILARITY') ? 'TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO' : 'TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE';
  if (l3 === 'PT_COORD_CENTROID') return c.includes('DIRECT') ? 'TPL_CENTROID_DIRECT' : 'TPL_CENTROID_APPLICATION';
  if (l3 === 'PT_TRIG_RATIO') {
    if (c.includes('RATIO_RELATION')) return 'TPL_TRIG_RATIO_BASIC_RELATION';
    if (c.includes('PROOF')) return 'TPL_TRIG_RATIO_GEOMETRIC_DERIVATION';
    return 'TPL_TRIG_RATIO_SPECIAL_ANGLE';
  }
  if (l3 === 'PT_TRIG_RATIO_APPLICATION') {
    if (c.includes('APPLICATION')) return 'TPL_TRIG_APPLICATION_CHAINED_MEASURE';
    if (c.includes('PROOF')) return 'TPL_TRIG_APPLICATION_SHARED_HEIGHT';
    return 'TPL_TRIG_APPLICATION_DIRECT_MEASURE';
  }
  if (l3 === 'PT_CIRCLE_LINE_RELATION') {
    if (c === 'TM_CIRCLE_CHORD_LENGTH') return c;
    if (c === 'TM_CIRCLE_CHORD_PERP_BISECTOR') return c;
    if (c === 'TM_CIRCLE_INTERSECTION_RELATION') return c;
    return 'TM_CIRCLE_LINE_POSITION';
  }
  if (l3 === 'PT_CIRCLE_TANGENT') {
    if (c === 'TM_TANGENT_CONTACT_CHORD_LENGTH') return c;
    if (c === 'TM_TANGENT_LENGTH') return c;
    return 'TM_TANGENCY_CONDITION';
  }
  if (l3 === 'PT_TWO_CIRCLES') {
    if (c.startsWith('TM_TWO_CIRCLES_')) return c;
    return 'TM_TWO_CIRCLES_COMMON_CHORD_LENGTH';
  }
  if (l3 === 'PT_CIRCLE_ANGLE_RELATIONS') {
    if (c.includes('TANGENT_CONTACT')) return 'TPL_CIRCLE_ANGLE_TANGENT_CHORD';
    if (c.includes('PROOF') || c.includes('RATIO_RELATION')) return 'TPL_CIRCLE_ANGLE_CENTER_ARC';
    if (c.includes('APPLICATION')) return 'TPL_CIRCLE_ANGLE_COMPOSITE';
    return 'TPL_CIRCLE_ANGLE_CENTER_ARC';
  }
  throw new Error('Unmapped L3 ' + l3);
};

const reasonFor = (row) => {
  const ev = row.evidence || {};
  const cue = String(ev.solutionCue || ev.l3Decision || '').replace(/\s+/g, ' ').trim();
  return cue.length > 700 ? cue.slice(0, 697) + '...' : cue;
};

const crossFilter = (l3, keys) => {
  const out = [];
  const seen = new Set();
  for (const key of keys || []) {
    if (!activeConcepts.has(key) || seen.has(key)) continue;
    if (l3 === 'PT_QUADRILATERAL_PROPERTIES' && key === 'CC_PARALLELOGRAM_PROPERTIES') continue;
    if (l3 === 'PT_SIMILAR_FIGURES' && key === 'CC_SIMILARITY') continue;
    if (l3 === 'PT_TRIANGLE_SIMILARITY' && key === 'CC_SIMILARITY') continue;
    if (l3 === 'PT_TRIANGLE_ANGLE_BISECTOR' && (key === 'CC_ANGLE_BISECTOR' || key === 'CC_ANGLE_BISECTOR_THEOREM')) continue;
    if (l3 === 'PT_CIRCLE_ANGLE_RELATIONS' && key === 'CC_INSCRIBED_ANGLE') continue;
    if (l3 === 'PT_CIRCLE_TANGENT' && key === 'CC_TANGENCY') continue;
    if (l3 === 'PT_CIRCLE_LINE_RELATION' && key === 'CC_PERPENDICULAR_BISECTOR') continue;
    if (l3 === 'PT_TRIANGLE_CENTERS' && key === 'CC_CIRCUMCIRCLE') continue;
    if (l3 === 'PT_ISOSCELES_TRIANGLE' && key === 'CC_ANGLE_BISECTOR') continue;
    if (l3 === 'PT_RIGHT_TRIANGLE_CONGRUENCE' && key === 'CC_RIGHT_TRIANGLE') continue;
    seen.add(key); out.push(key);
  }
  return out;
};

const finalRecords = [];
const currentDiff = {templateChanged:0,crossConceptChanged:0};
for (const parent of l3Doc.records) {
  if (!parent.problemTypeKey) {
    finalRecords.push({
      questionUid: parent.questionUid,
      sourceIdentity: parent.sourceArchiveFile + '#' + parent.sourceOrdinal,
      sourceFingerprint: parent.sourceFingerprint,
      problemTypeKey: null,
      templateKey: null,
      l4ReviewStatus: 'NOT_APPLICABLE_ROUTE_OUT',
      decisiveStep: null,
      crossConceptKeys: [],
      crossConceptEvidence: {},
      existingReuse: false,
      candidateNew: false,
      authority: 'L3_FINAL_ROUTE_OUT_PRESERVED'
    });
    continue;
  }
  const item = itemByUid.get(parent.questionUid);
  assert(item, 'missing item record ' + parent.questionUid);
  const templateKey = normalizeCandidate(parent.problemTypeKey, item.templateKey);
  const crossConceptKeys = crossFilter(parent.problemTypeKey, item.crossConceptKeys);
  const oldCross = [...new Set(item.crossConceptKeys || [])].filter(k => activeConcepts.has(k));
  if (templateKey !== item.templateKey) currentDiff.templateChanged++;
  if (JSON.stringify(crossConceptKeys) !== JSON.stringify(oldCross)) currentDiff.crossConceptChanged++;
  const evidence = {};
  for (const key of crossConceptKeys) evidence[key] = {
    decisiveEvidence: reasonFor(item),
    conceptDefinition: activeConcepts.get(key)?.definition || null
  };
  const reg = registry.get(templateKey);
  assert(reg, 'missing registry ' + templateKey);
  reg.supportingQuestionUids.push(parent.questionUid);
  reg.supportCount++;
  finalRecords.push({
    questionUid: parent.questionUid,
    sourceIdentity: parent.sourceArchiveFile + '#' + parent.sourceOrdinal,
    sourceFingerprint: parent.sourceFingerprint,
    problemTypeKey: parent.problemTypeKey,
    templateKey,
    l4ReviewStatus: 'FINAL',
    decisiveStep: reasonFor(item),
    crossConceptKeys,
    crossConceptEvidence: evidence,
    existingReuse: reg.reuse === 'ACTIVE_REUSE',
    candidateNew: reg.reuse !== 'ACTIVE_REUSE',
    authority: 'MIDDLE_GEOMETRY_L4_CROSSCONCEPT_SOURCE_SOLUTION_REVIEW'
  });
}

const l4Counts = {};
const crossCounts = {};
for (const r of finalRecords) {
  l4Counts[r.templateKey || 'ROUTE_OUT'] = (l4Counts[r.templateKey || 'ROUTE_OUT'] || 0) + 1;
  for (const key of r.crossConceptKeys) crossCounts[key] = (crossCounts[key] || 0) + 1;
}
const l4ParentMismatch = finalRecords.filter(r => r.templateKey && registry.get(r.templateKey)?.parentProblemTypeKey !== r.problemTypeKey);
const unregisteredReuse = finalRecords.flatMap(r => r.crossConceptKeys.filter(k => !activeConcepts.has(k)));
const duplicateCross = finalRecords.filter(r => new Set(r.crossConceptKeys).size !== r.crossConceptKeys.length);
assert(finalRecords.length === 928, 'L4 ledger rows');
assert(finalRecords.filter(r => r.problemTypeKey !== null && r.l4ReviewStatus === 'FINAL').length === 921, 'L4 mapped unresolved');
assert(l4ParentMismatch.length === 0, 'L4 parent mismatch');
assert(unregisteredReuse.length === 0, 'unregistered CrossConcept');
assert(duplicateCross.length === 0, 'duplicate CrossConcept');

const registryRows = [...registry.values()];
for (const r of registryRows) r.supportingItemCount = r.supportCount;
const newL4 = registryRows.filter(r => r.reuse === 'NEW_CANDIDATE');
const reuseL4 = registryRows.filter(r => r.reuse === 'ACTIVE_REUSE');

const baseMainSha = '54b3f2aee093c9f25b27a618630fe2ebac9c2d46';
const artifacts = [outPath, registryPath, proposalPath];
fs.writeFileSync(outPath, JSON.stringify({
  schemaVersion: 'middle-geometry-l4-crossconcept-semantic-freeze-v1',
  authority: {
    l3: 'archive/data/meta-foundation/evidence/middle-geometry/v1/l3_semantic_final_928.json',
    source: 'current source content + solution read; candidate taxonomy and relational suggestions are comparison-only',
    l4AndCrossConcept: 'MIDDLE_GEOMETRY_L4_CROSSCONCEPT_SOURCE_SOLUTION_REVIEW'
  },
  denominator: {total:928,mapped:921,routeOut:7},
  validation: {
    rows: 928,
    uidUnique: new Set(finalRecords.map(r=>r.questionUid)).size === 928,
    sourceIdentityUnique: new Set(finalRecords.map(r=>r.sourceIdentity)).size === 928,
    l3ExactParity: finalRecords.every(r => l3ByUid.get(r.questionUid)?.problemTypeKey === r.problemTypeKey),
    mappedL4Final: finalRecords.filter(r => r.problemTypeKey !== null && r.l4ReviewStatus === 'FINAL').length,
    routeOutExactParity: finalRecords.filter(r => r.problemTypeKey === null && r.templateKey === null && r.crossConceptKeys.length === 0).length,
    l4ParentMismatch: l4ParentMismatch.length,
    crossConceptDuplicateAssignments: duplicateCross.length,
    unregisteredActiveReuse: unregisteredReuse.length,
    currentHeuristicTemplateDiffCount: currentDiff.templateChanged,
    currentCrossConceptSuggestionDiffCount: currentDiff.crossConceptChanged
  },
  distributions: {l4:l4Counts,crossConcept:crossCounts},
  records: finalRecords
}, null, 2) + '\n');
fs.writeFileSync(registryPath, JSON.stringify({
  schemaVersion: 'middle-geometry-l4-template-registry-candidate-v1',
  status: 'REVIEW_REQUIRED',
  parentAuthority: 'l3_semantic_final_928.json',
  templateCount: registryRows.length,
  reusedActiveCount: reuseL4.length,
  newCandidateCount: newL4.length,
  templates: registryRows
}, null, 2) + '\n');
const crossProposal = {
  schemaVersion: 'middle-geometry-crossconcept-candidate-proposals-v1',
  status: 'REVIEW_REQUIRED',
  newConceptProposals: [],
  reusedActiveConceptKeys: Object.keys(crossCounts).sort(),
  assignmentCount: Object.values(crossCounts).reduce((a,b)=>a+b,0),
  distinctKeyCount: Object.keys(crossCounts).length
};
fs.writeFileSync(proposalPath, JSON.stringify(crossProposal, null, 2) + '\n');
const hashTargets = {};
for (const p of artifacts) hashTargets[repoPath(p)] = sha256(p);
const summary = [
  '# Middle Geometry L4 + CrossConcept Semantic Freeze',
  '',
  '- status: L4_CROSSCONCEPT_SEMANTIC_FREEZE',
  '- BASE_MAIN_SHA: ' + baseMainSha,
  '- branch HEAD at freeze start: 2b952bc69d3249f9f819fc9c9a31052f0a50405e',
  '- denominator: 928',
  '- mapped: 921',
  '- route-out: 7',
  '- L3 parent source: l3_semantic_final_928.json',
  '- L4 registry templates: ' + registryRows.length,
  '- ACTIVE L4 reuse: ' + reuseL4.length,
  '- new L4 candidate proposals: ' + newL4.length,
  '- CrossConcept assignments: ' + Object.values(crossCounts).reduce((a,b)=>a+b,0),
  '- distinct ACTIVE CrossConcept keys: ' + Object.keys(crossCounts).length,
  '- new CrossConcept proposals: 0',
  '- heuristic template diff rows: ' + currentDiff.templateChanged,
  '- heuristic CrossConcept diff rows: ' + currentDiff.crossConceptChanged,
  '- unresolved mapped L4: 0',
  '- L4 parent mismatch: 0',
  '- duplicate CrossConcept assignment rows: 0',
  '- unregistered ACTIVE reuse keys: 0',
  '- Condition/IntegrationPattern/difficulty: not started by scope',
  '',
  '## Artifact hashes',
  ''
].join('\n');
fs.writeFileSync(summaryPath, summary + Object.entries(hashTargets).map(([k,v]) => '- ' + k + ': ' + v).join('\n') + '\n');
artifacts.push(summaryPath);
hashTargets[repoPath(summaryPath)] = sha256(summaryPath);
const inventory = {
  schemaVersion: 'middle-geometry-physical-inventory-v1',
  BASE_MAIN_SHA: baseMainSha,
  branch: 'codex/meta-foundation/middle-geometry',
  branchHead: '2b952bc69d3249f9f819fc9c9a31052f0a50405e',
  denominator: 928,
  mapped: 921,
  routeOut: 7,
  currentStage: 'L4_CROSSCONCEPT_SEMANTIC_FREEZE',
  completedUidCount: 921,
  completedUidSetDigest: digestText(JSON.stringify(mapped.map(r=>r.questionUid).sort())),
  artifactPaths: artifacts.map(repoPath),
  artifactSha256: hashTargets,
  blockingIssues: [],
  nextStartPoint: 'L4 + CrossConcept semantic freeze handoff; Condition/IntegrationPattern/difficulty not started'
};
fs.writeFileSync(inventoryPath, JSON.stringify(inventory,null,2)+'\n');
fs.writeFileSync(statePath, JSON.stringify({...inventory,stateHash:sha256(inventoryPath)},null,2)+'\n');
fs.writeFileSync(checkpointsPath, JSON.stringify({schemaVersion:'middle-geometry-checkpoints-v1',checkpoints:[{
  checkpointId:'L4_CROSSCONCEPT_SEMANTIC_FREEZE',
  ...inventory,
  artifactSha256:hashTargets
}]},null,2)+'\n');
console.log(JSON.stringify({
  rows: finalRecords.length,
  mapped: 921,
  routeOut: 7,
  templateCount: registryRows.length,
  reusedActiveL4: reuseL4.length,
  newL4Candidates: newL4.length,
  crossAssignments: Object.values(crossCounts).reduce((a,b)=>a+b,0),
  distinctCrossConcepts: Object.keys(crossCounts).length,
  templateDiff: currentDiff.templateChanged,
  crossDiff: currentDiff.crossConceptChanged,
  output: outPath
}, null, 2));
