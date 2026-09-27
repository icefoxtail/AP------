#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  BASE_MAIN_SHA, CANONICAL_DIR, CROSSWALK_DIR, EVIDENCE_DIR, MASTER_PATH, RPM,
  collectGlobalActive, exactBindings, flattenMaster, masterKey, reviewedProblemTypeDisposition,
  semanticKey, targetedFalsePassRegressionErrors, targetedFalsePassRule,
  validateRpmSources, viewMismatch,
} from './normalize-rpm-primary-m1-m2.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const readText = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8').replace(/^\uFEFF/, '');
const readJson = relative => JSON.parse(readText(relative));
const writeJson = (relative, value) => fs.writeFileSync(path.join(ROOT, relative), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const SCOPE_ORDER = ['M1-1', 'M1-2', 'M2-1', 'M2-2'];
const CROSSWALK_FILES = { M1: `${CROSSWALK_DIR}/middle1.json`, M2: `${CROSSWALK_DIR}/middle2.json` };
const SOURCE_EVIDENCE = {
  curriculum2015: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=60747&lev=0&m=0404',
  curriculum2022: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0',
  teacherLearning2015: 'https://padlet-uploads.storage.googleapis.com/2380002185/d62b651f86a28ba20eb917bfa0c4892c/2015_______________________.pdf',
};

const SAFE_PT_MEMO = {
  PT_CIRCLE_ANGLE_RELATIONS: '중심각·호·현 leaf와 원의 중심각·호 관계를 적용하는 TPL이 같은 각 관계를 계산한다.',
  PT_COORDINATE_POINT_READING: 'RPM의 점 좌표 읽기 leaf와 격자에서 좌표 성분을 읽는 PT/TPL의 목표가 일치한다.',
  PT_LINE_RELATION: '두 직선의 교점·평행·일치 등 상대 위치를 분류하는 RPM leaf와 PT/TPL의 범위가 일치한다.',
  PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION: '문자로 수량 나타내기와 곱셈·나눗셈 기호 생략 leaf만 유지하며, 각 매핑 TPL의 정의가 문자식 표현 해석을 직접 다룬다.',
  PT_M1_BASIC_GEOMETRY_JUDGMENT: '직선·반직선·선분 leaf만 유지하며, TPL은 점의 순서와 기호의 대상 동일성을 직접 비교한다.',
  PT_M1_CONGRUENCE_UNIQUENESS: '삼각형의 작도 조건과 SSS/SAS/ASA 합동 기준을 주어진 자료로 판정하는 RPM leaf를 유일 결정/합동 기준 TPL이 다룬다.',
  PT_M1_INTERSECTING_ANGLE_RELATIONS: '맞꼭지각의 계산 L4 아래 angle transfer/equation/ratio TPL이 모두 교차선의 맞꼭지각 관계를 decisive step으로 사용한다.',
  PT_M1_PARALLEL_ANGLE_POSITION: '동위각·엇각 L4 family가 위치 식별, 평행선 진술 검증, 대응 위치 각의 합이라는 서로 다른 주요 해법 subtype을 포함한다.',
  PT_M1_PARALLELISM_CONVERSE: '원래 매핑은 RPM parallel-condition leaf와 PT/TPL의 범위가 달라 더 넓은 angle-position PT/TPL로 재매핑했다.',
  PT_M1_POINT_TO_LINE_PERPENDICULAR_DISTANCE: '점과 직선 사이의 거리 L4와 수선분 길이를 거리로 읽는 PT/TPL의 목표가 일치한다.',
  PT_M1_POLYGON_ANGLE_AND_COUNT: '각의 합·외각·변/대각선 수 및 정다각형 각 관계를 해당 각·개수 TPL들이 포괄한다.',
  PT_M1_POLYHEDRON_COMPONENT_COUNT: '면·모서리·꼭짓점 개수를 세는 leaf만 유지하며, 일반 관계 L4는 산출식을 포괄하는 TPL 근거가 부족해 RPM_ONLY로 닫았다.',
  PT_M1_PRIME_COMPOSITE_JUDGMENT: '소수/합성수 정의 판별과 성질 진술 판단 leaf를 각각 직접 검사하는 TPL을 사용한다.',
  PT_M1_RATIONAL_ARITHMETIC: '부호 있는 수의 사칙계산과 혼합 계산 leaf를 계산 TPL들이 직접 수행한다.',
  PT_M1_RATIONAL_PROPERTY_JUDGMENT: '부호·절댓값·수 체계 포함 관계에 대한 참/거짓 판단 leaf와 general property TPL이 일치한다.',
  PT_M1_RATIONAL_VALUE_COMPARISON: '유리수의 수직선 순서 및 대소 비교 leaf와 수의 크기 비교 TPL의 목표가 일치한다.',
  PT_M1_SPATIAL_LINE_PLANE_RELATIONS: '공간에서 직선·평면·평면 사이의 위치 관계를 판단하는 leaf와 spatial relationship TPL의 대상·결론이 일치한다.',
  PT_M1_FREQUENCY_DISTRIBUTION_READING: '도수분포표 완성 leaf만 missing-frequency TPL과 의미가 일치한다. 표·히스토그램·그래프 해석의 일반 leaf는 좁은 누락도수/누적 cutoff TPL로 덮지 않는다.',
  PT_M1_SEGMENT_LENGTH_RELATIONS: '중점·선분 길이 RPM leaf는 current nested-midpoint TPL 두 개만으로 거리와 중점의 주요 subtype을 다 덮지 못해 FAMILY_INCOMPLETE로 제거했다.',
  PT_MOVE_POINT_REFLECTION: '점의 대칭 이동 좌표를 구하는 RPM leaf와 point-reflection TPL의 변환 목표가 일치한다.',
  PT_COUNTING_ARRANGEMENT: '순서가 있는 경우의 수를 순열 구조로 세는 L4와 permutation TPL이 일치한다.',
  PT_COUNTING_SELECTION_DISTRIBUTION: '순서가 없는 선택의 경우의 수를 조합으로 세는 L4와 combination TPL이 일치한다.',
  PT_COORD_CENTROID: '무게중심 좌표·2:1 역산·거리 관계의 listed template family가 RPM의 해당 좌표·길이 L4 subtype을 구분해 포함한다.',
  PT_FUNCTION_GRAPH_INTERSECTION: '두 직선 그래프의 교점과 연립방정식 관계를 구하는 RPM leaf와 two-function intersection TPL이 일치한다.',
  PT_FUNCTION_GRAPH_PROPERTIES: '증가·감소 판정 leaf와 graph-property judgment TPL의 목표가 일치한다.',
  PT_FUNCTION_VALUE: '함숫값 leaf와 직접 대입·계산 TPL의 목표가 일치한다.',
  PT_ISOSCELES_TRIANGLE: '이등변삼각형의 밑각/꼭짓각, 판정, 꼭짓각 이등분선 family가 listed base-angle, converse, bisector subtype을 포함한다.',
  PT_LINE_EQUATION: '직선 방정식 family가 graph coefficient, point-slope, two-point, multi-condition subtype을 나누어 담는다. direct rows for broad graph/slope-intercept leaves are upgraded to this complete family.',
  PT_LINE_RELATION: '두 직선의 평행·일치 등 관계를 판단하는 L4와 line-position TPL이 일치한다.',
  PT_PARALLEL_SEGMENT_RATIO: '평행 조건, 선분비, 미지 길이, 삼각형/일반 도형 subtype을 triangle/general templates로 구분한다.',
  PT_PROBABILITY_PROPERTIES_APPLICATION: '동등가능도수, 확률 계산, 여사건, 사건의 합 등 RPM leaf가 basic-count and event-relation TPLs에 대응한다.',
  PT_PROBABILITY_REPEATED_TRIALS: '연속 시행에서 독립시행의 반복확률을 구하는 RPM leaf와 binomial independent-trial TPL이 일치한다.',
  PT_QUADRILATERAL_PROPERTIES: '평행사변형의 성질·판정과 특수 사각형 성질을 separate listed TPLs로 선택한다.',
  PT_RIGHT_TRIANGLE_CONGRUENCE: 'RHS와 RHA를 빗변+변 및 빗변+예각 template으로 분리한다. 2015 exact binding은 기존 ACTIVE M2-05 binding을 사용한다.',
  PT_SIMILAR_FIGURES: '닮음비와 닮은 도형 넓이·부피 비를 distinct matching templates로 분리한다.',
  PT_TRIANGLE_ANGLE_BISECTOR: 'angle bisector theorem side-ratio와 angle-bisector equidistance가 listed family의 두 주된 성질 subtype이다.',
  PT_TRIANGLE_CENTERS: '외심, 내심, 복합 중심 관계를 listed separate templates로 선택하며, generic family includes these center types.',
  PT_TRIANGLE_SIMILARITY: 'AA/SAS/SSS triangle-similarity criteria and use-of-similarity L4s map to matching criteria/application templates.',
};

const ACTIVE_SEARCH_CANDIDATES = {
  PT_ABSOLUTE_VALUE_SIGN_EXTREMES: ['PT_M1_RATIONAL_PROPERTY_JUDGMENT', 'PT_EQUAL_ABSOLUTE_VALUE_DIFFERENCE_RECOVERY'],
  PT_DIVISOR_COUNT: ['PT_M1_DIVISOR_MULTIPLE_EXPONENT', 'PT_M1_PRIME_FACTOR_STRUCTURE'],
  PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION: ['PT_M1_PROPORTION_PARAMETER_EVALUATION'],
  PT_M1_DATA_CATEGORY_PERCENTAGE: [],
  PT_M1_DATA_ORDER_AND_VALUE: ['PT_M1_DATA_EXTREME_VALUE_SUM'],
  PT_M1_FREQUENCY_DISTRIBUTION_READING: ['PT_M1_DATA_ORDER_AND_VALUE'],
  PT_M1_ALGEBRAIC_EXPRESSION_EVALUATION: ['PT_M1_RATIONAL_VALUE_COMPARISON'],
  PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE: ['PT_M1_POLYGON_ANGLE_AND_COUNT'],
  PT_M1_PARALLELISM_CONVERSE: ['PT_M1_PARALLEL_ANGLE_POSITION'],
  PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS: ['PT_M1_POLYHEDRON_COMPONENT_COUNT'],
  PT_M1_GCD_LCM_EXPONENT_CONSTRAINT: ['PT_M1_LCM_APPLICATION', 'PT_M1_GCD_DIVISOR_APPLICATION'],
  PT_M1_PROPORTION_PARAMETER_EVALUATION: ['PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION'],
};

const FAMILY_PROFILES = {
  PT_M1_INTERSECTING_ANGLE_RELATIONS: {
    coverage: 'COMPLETE',
    majorSubtypes: ['맞꼭지각으로 angle 이동', 'straight-angle equation', 'angle ratio'],
    reason: SAFE_PT_MEMO.PT_M1_INTERSECTING_ANGLE_RELATIONS,
  },
  PT_M1_PARALLEL_ANGLE_POSITION: {
    coverage: 'COMPLETE',
    majorSubtypes: ['동위각·엇각 위치 식별', 'parallel-angle statement/converse audit', '위치 각의 계산/합'],
    reason: SAFE_PT_MEMO.PT_M1_PARALLEL_ANGLE_POSITION,
  },
  PT_LINE_EQUATION: {
    coverage: 'COMPLETE',
    majorSubtypes: ['계수/그래프', '한 점과 기울기', '두 점', '복합 조건'],
    reason: SAFE_PT_MEMO.PT_LINE_EQUATION,
  },
  PT_COORD_CENTROID: {
    coverage: 'COMPLETE',
    majorSubtypes: ['세 꼭짓점에서 직접 구하기', '주어진 무게중심/중선에서 역산', '거리 관계'],
    reason: SAFE_PT_MEMO.PT_COORD_CENTROID,
  },
  PT_ISOSCELES_TRIANGLE: {
    coverage: 'COMPLETE',
    majorSubtypes: ['밑각/꼭짓각', '꼭짓각 이등분선', '이등변 판정'],
    reason: SAFE_PT_MEMO.PT_ISOSCELES_TRIANGLE,
  },
  PT_TRIANGLE_ANGLE_BISECTOR: {
    coverage: 'COMPLETE',
    majorSubtypes: ['각의 이등분선 정리(변비)', '이등분선 위 점의 등거리'],
    reason: SAFE_PT_MEMO.PT_TRIANGLE_ANGLE_BISECTOR,
  },
  PT_TRIANGLE_CENTERS: {
    coverage: 'COMPLETE',
    majorSubtypes: ['외심', '내심', '외심·내심 combined', 'generic center property'],
    reason: SAFE_PT_MEMO.PT_TRIANGLE_CENTERS,
  },
};

const PATH_ALIASES = [
  { scope: 'M1-2', curriculum: '2015', l3: '도수분포', l4: '도수분포표', targetL3: '도수분포표', targetL4: ['계급·도수', '도수분포표 완성'] },
  { scope: 'M1-2', curriculum: '2015', l3: '도수분포', l4: '히스토그램·도수분포다각형', targetL3: '분포 해석', targetL4: ['히스토그램·그래프 해석'] },
  { scope: 'M1-2', curriculum: '2015', l3: '상대도수', l4: '상대도수 그래프', targetL3: '상대도수', targetL4: ['상대도수 비교'] },
  { scope: 'M1-2', curriculum: '2015', l3: '자료 해석', l4: '그래프 비교', targetL3: '분포 해석', targetL4: ['두 집단 비교'] },
  { scope: 'M1-2', curriculum: '2015', l3: '자료 해석', l4: '자료에서 정보 추론', targetL3: '분포 해석', targetL4: ['히스토그램·그래프 해석', '두 집단 비교'] },
  { scope: 'M2-2', curriculum: '2015', l3: '이등변삼각형의 성질', l4: '밑각', targetL3: '이등변삼각형', targetL4: ['밑각과 꼭짓각'] },
  { scope: 'M2-2', curriculum: '2015', l3: '이등변삼각형의 성질', l4: '꼭짓각의 이등분선', targetL3: '이등변삼각형', targetL4: ['밑각과 꼭짓각'] },
  { scope: 'M2-2', curriculum: '2015', l3: '이등변삼각형의 판정', l4: '두 각 조건', targetL3: '이등변삼각형', targetL4: ['이등변삼각형 판정'] },
  { scope: 'M2-2', curriculum: '2015', l3: '이등변삼각형의 판정', l4: '수직이등분선 활용', targetL3: '이등변삼각형', targetL4: ['이등변삼각형 판정'] },
];

const LEGIT_RELOCATED_2022_STATS = new Set([
  '평균 계산', '평균을 이용한 미지수', '중앙값', '최빈값', '자료에 적절한 대푯값', '대푯값 비교',
]);

function stablePathSignature(row) { return `${row.scope}|${row.l3}|${row.l4}`; }
function aliasTargets(row) {
  const match = PATH_ALIASES.find(item => item.scope === row.scope && item.curriculum === row.curriculum && item.l3 === row.l3 && item.l4 === row.l4);
  if (match) return match.targetL4.map(l4 => `${row.scope}|${match.targetL3}|${l4}`);
  const reverse = PATH_ALIASES.filter(item => item.scope === row.scope && item.curriculum !== row.curriculum && item.targetL3 === row.l3 && item.targetL4.includes(row.l4));
  if (reverse.length) return reverse.map(item => `${row.scope}|${item.l3}|${item.l4}`);
  return [stablePathSignature(row)];
}

function sameScopeCounterparts(row, byCurriculum) {
  const other = row.curriculum === '2015' ? '2022' : '2015';
  const wanted = new Set(aliasTargets(row));
  return byCurriculum[other].filter(candidate => wanted.has(stablePathSignature(candidate)));
}

function relocated2015StatsEvidence(row, masterRows) {
  if (row.curriculum !== '2022' || row.scope !== 'M1-2' || !LEGIT_RELOCATED_2022_STATS.has(row.l4)) return null;
  const counterparts = masterRows.filter(candidate => candidate.curriculum === '2015' && candidate.scope === 'M3-2'
    && (candidate.l3 === '대푯값' || candidate.l3 === '대푯값의 선택'));
  return counterparts.length ? { scope: 'M3-2', l3: [...new Set(counterparts.map(x => x.l3))], l4: [...new Set(counterparts.map(x => x.l4))], source: '2015 RPM Primary M3-2.md / CANONICAL_MASTER.json' } : null;
}

function curriculumRowAudit(masterRows, crosswalkByKey) {
  const perScopeCurriculum = {};
  for (const scope of SCOPE_ORDER) {
    perScopeCurriculum[scope] = { '2015': masterRows.filter(x => x.scope === scope && x.curriculum === '2015'), '2022': masterRows.filter(x => x.scope === scope && x.curriculum === '2022') };
  }
  const result = [];
  for (const row of masterRows) {
    const pair = sameScopeCounterparts(row, perScopeCurriculum[row.scope]);
    const relocated = relocated2015StatsEvidence(row, masterRows);
    const needsEvidence = row.curriculum === '2022' && row.scope === 'M2-2' && row.l3 === '각의 이등분선';
    let semanticRelation = pair.length ? 'BOTH_PRESENT' : relocated ? 'LEGIT_CURRICULUM_DIFFERENCE' : needsEvidence ? 'NEEDS_EVIDENCE' : 'NEEDS_EVIDENCE';
    const baselineCrosswalk = crosswalkByKey.get(masterKey(row));
    const initialMissingRhs = row.curriculum === '2015' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동' && !baselineCrosswalk;
    const activeCrosswalk = crosswalkByKey.get(masterKey(row));
    result.push({
      curriculum: row.curriculum,
      scope: row.scope,
      rpmRecordId: activeCrosswalk?.id || '',
      rpmL1: row.majorUnit,
      rpmL2: row.midUnit,
      rpmL3: row.l3,
      rpmL4: row.l4,
      existingMappingStatus: baselineCrosswalk?.baselineMappingStatus || 'MISSING_RPM_RECORD',
      existingPTTPL: baselineCrosswalk?.baselineMapping || null,
      semanticRelation,
      priorSemanticRelation: initialMissingRhs ? '2015_RPM_OMISSION' : '',
      curriculumPresence2015: pair.length > 0 || Boolean(relocated),
      curriculumPresence2022: pair.length > 0 || row.curriculum === '2022',
      activeBinding: null,
      defectType: initialMissingRhs ? 'RPM_2015_OMISSION' : needsEvidence ? 'NEEDS_EVIDENCE' : relocated ? 'LEGIT_CURRICULUM_DIFFERENCE' : 'SAFE_EXISTING_REUSE',
      finalDisposition: activeCrosswalk?.mappingStatus || 'MISSING_CROSSWALK_ROW',
      repairAction: initialMissingRhs ? 'ADD_2015_RHS_RHA_RPM_PATH_AND_REUSE_EXISTING_GLOBAL_ACTIVE' : 'NONE',
      counterparts: pair.map(other => ({ curriculum: other.curriculum, scope: other.scope, l3: other.l3, l4: other.l4 })),
      relocatedCurriculumEvidence: relocated,
      evidence: initialMissingRhs
        ? ['docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/MIDDLE/M2-2.md', `${EVIDENCE_DIR}/rhs-rha-curriculum-evidence.json`, '2015 MOE achievement standard [9수04-04]']
        : needsEvidence
          ? ['docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M2-2.md', 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/MIDDLE/M2-2.md', 'NEEDS_EVIDENCE: determine whether the two 2022 angle-bisector leaves are curriculum extensions or taxonomy omissions in 2015.']
          : relocated ? ['2015 RPM M3-2 retains representative-value scope; 2022 RPM moves these leaves into M1-2.', SOURCE_EVIDENCE.curriculum2015, SOURCE_EVIDENCE.curriculum2022] : ['RPM 2015/2022 semantic path comparison; see paired curriculum scope views.'],
    });
  }
  return result;
}

export function familyCoverage(row, candidates) {
  const profile = FAMILY_PROFILES[row.problemTypeKey];
  if (!profile) return { coverage: 'INCOMPLETE', candidateKeys: candidates.map(x => x.templateKey), majorSubtypes: [], reason: 'No approved family-coverage review profile exists.' };
  const listed = new Set(candidates.map(x => x.templateKey));
  const allowed = {
    PT_M1_INTERSECTING_ANGLE_RELATIONS: ['TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_TRANSFER', 'TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_EQUATION', 'TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO'],
    PT_M1_PARALLEL_ANGLE_POSITION: ['TPL_M1_PARALLEL_ANGLE_POSITION_ALTERNATE_POSITION_IDENTIFICATION', 'TPL_M1_PARALLEL_ANGLE_POSITION_ANGLE_POSITION_CLAIM_AUDIT', 'TPL_M1_PARALLEL_ANGLE_POSITION_POSITIONAL_ANGLE_SUM'],
    PT_LINE_EQUATION: ['TPL_LINE_GRAPH_BY_COEFFICIENTS', 'TPL_LINE_POINT_SLOPE', 'TPL_LINE_TWO_POINTS', 'TPL_LINE_MULTI_CONDITION'],
    PT_COORD_CENTROID: ['TPL_CENTROID_DIRECT', 'TPL_CENTROID_REVERSE', 'TPL_CENTROID_DISTANCE_RELATION', 'TPL_CENTROID_APPLICATION'],
    PT_ISOSCELES_TRIANGLE: ['TPL_ISOSCELES_BASE_ANGLES', 'TPL_ISOSCELES_VERTEX_BISECTOR', 'TPL_ISOSCELES_CONVERSE'],
    PT_TRIANGLE_ANGLE_BISECTOR: ['TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE', 'TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO'],
    PT_TRIANGLE_CENTERS: ['TPL_TRIANGLE_CENTERS_COMBINED', 'TPL_TRIANGLE_CENTERS_SEMANTIC', 'TPL_TRIANGLE_CIRCUMCENTER', 'TPL_TRIANGLE_INCENTER'],
  }[row.problemTypeKey] || [];
  const requiredByL4 = {
    PT_M1_INTERSECTING_ANGLE_RELATIONS: ['TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_TRANSFER', 'TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_EQUATION', 'TPL_M1_INTERSECTING_ANGLE_RELATIONS_ANGLE_RATIO'],
    PT_M1_PARALLEL_ANGLE_POSITION: ['TPL_M1_PARALLEL_ANGLE_POSITION_ALTERNATE_POSITION_IDENTIFICATION', 'TPL_M1_PARALLEL_ANGLE_POSITION_ANGLE_POSITION_CLAIM_AUDIT', 'TPL_M1_PARALLEL_ANGLE_POSITION_POSITIONAL_ANGLE_SUM'],
    PT_LINE_EQUATION: row.rpmPath.l4 === '조건에 따른 식 결정'
      ? ['TPL_LINE_POINT_SLOPE', 'TPL_LINE_TWO_POINTS', 'TPL_LINE_MULTI_CONDITION']
      : ['TPL_LINE_GRAPH_BY_COEFFICIENTS', 'TPL_LINE_POINT_SLOPE', 'TPL_LINE_TWO_POINTS', 'TPL_LINE_MULTI_CONDITION'],
    PT_COORD_CENTROID: ['TPL_CENTROID_DIRECT', 'TPL_CENTROID_REVERSE', 'TPL_CENTROID_DISTANCE_RELATION'],
    PT_ISOSCELES_TRIANGLE: ['TPL_ISOSCELES_BASE_ANGLES', 'TPL_ISOSCELES_VERTEX_BISECTOR'],
    PT_TRIANGLE_ANGLE_BISECTOR: ['TPL_TRIANGLE_ANGLE_BISECTOR_EQUIDISTANCE', 'TPL_TRIANGLE_ANGLE_BISECTOR_SIDE_RATIO'],
    PT_TRIANGLE_CENTERS: ['TPL_TRIANGLE_CENTERS_COMBINED', 'TPL_TRIANGLE_CENTERS_SEMANTIC', 'TPL_TRIANGLE_CIRCUMCENTER', 'TPL_TRIANGLE_INCENTER'],
  }[row.problemTypeKey] || [];
  const status = profile.coverage === 'COMPLETE' && [...listed].every(key => allowed.includes(key))
    && requiredByL4.every(key => listed.has(key)) ? 'COMPLETE' : 'INCOMPLETE';
  return { coverage: status, candidateKeys: [...listed], majorSubtypes: profile.majorSubtypes, reason: profile.reason };
}

export function missingCanonicalPathSentinels(masterRows, crosswalkRows) {
  const sentinels = [
    { curriculum: '2015', scope: 'M2-2', l3: '직각삼각형의 합동', l4: 'RHS' },
    { curriculum: '2015', scope: 'M2-2', l3: '직각삼각형의 합동', l4: 'RHA' },
    { curriculum: '2022', scope: 'M2-2', l3: '직각삼각형의 합동', l4: 'RHS' },
    { curriculum: '2022', scope: 'M2-2', l3: '직각삼각형의 합동', l4: 'RHA' },
  ];
  const master = new Set(masterRows.map(row => `${row.curriculum}|${row.scope}|${row.l3 ?? row.rpmL3}|${row.l4 ?? row.rpmL4}`));
  const crosswalk = new Set(crosswalkRows.map(row => `${row.curriculum}|${row.scope}|${row.rpmPath?.l3 ?? row.rpmL3}|${row.rpmPath?.l4 ?? row.rpmL4}`));
  return sentinels.flatMap(row => {
    const key = `${row.curriculum}|${row.scope}|${row.l3}|${row.l4}`;
    return [!master.has(key) ? { ...row, missingFrom: 'RPM_MASTER' } : null,
      !crosswalk.has(key) ? { ...row, missingFrom: 'CROSSWALK' } : null].filter(Boolean);
  });
}

export function validateTargetedFalsePassAudit(rows, options = {}) {
  const errors = targetedFalsePassRegressionErrors(rows, options);
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

function mappingSemanticAudit(row, baseline, global) {
  const status = row.mappingStatus;
  const candidates = row.templateKey ? [{ templateKey: row.templateKey }] : (row.templateCandidates || []);
  const pt = row.problemTypeKey ? global.problemTypes.get(row.problemTypeKey) : null;
  const templates = candidates.map(candidate => global.templates.get(candidate.templateKey)).filter(Boolean);
  const bindings = pt ? exactBindings(global, row) : [];
  const baselineStatus = baseline?.mappingStatus || 'MISSING_RPM_RECORD';
  const baselineHasMap = Boolean(baseline?.problemTypeKey);
  const targetedRule = targetedFalsePassRule(row);
  const reportedBaselineStatus = targetedRule
    ? targetedRule.existingMappingStatusById?.[row.id] || targetedRule.rejectStatuses[0]
    : baselineStatus;
  const baselineCandidateKeys = (baseline?.templateCandidates || []).map(x => typeof x === 'string' ? x : x.templateKey).filter(Boolean);
  const currentCandidateKeys = (row.templateCandidates || []).map(x => x.templateKey).filter(Boolean);
  let semanticRelation;
  let defectType;
  let priorDefectType = '';
  let repairAction;
  let memo;

  if (targetedRule) {
    semanticRelation = targetedRule.semanticRelation;
    defectType = targetedRule.defectType;
    priorDefectType = reportedBaselineStatus === 'DIRECT_BINDING_GAP' ? 'BINDING_ONLY_GAP' : 'FALSE_DIRECT_PASS';
    repairAction = status === 'RPM_ONLY'
      ? 'REMOVE_FALSE_PASS_MAPPING_AND_CLOSE_AS_RPM_ONLY'
      : 'FAIL_CLOSED_FALSE_PASS_MUST_BE_RPM_ONLY';
    memo = targetedRule.reason + ' Confirmed by GPT independent review; narrow canonical definitions remain unchanged.';
  } else if (!baseline && row.curriculum === '2015' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동') {
    semanticRelation = 'DIRECT_EQUIVALENT_EXISTING_GLOBAL_ACTIVE';
    defectType = 'RPM_2015_OMISSION';
    repairAction = 'ADD_RPM_PATH_AND_REUSE_PT_TPL_BINDING';
    memo = 'Both RHS and RHA are explicit 2015-course congruence applications; exact GLOBAL ACTIVE PT, subtype TPL, and 2015 M2-05 binding were already present.';
  } else if (status === 'RPM_ONLY' && baselineHasMap) {
    const original = { ...row, problemTypeKey: baseline.problemTypeKey, mappingStatus: baselineStatus };
    const decision = reviewedProblemTypeDisposition(original);
    semanticRelation = baselineStatus.startsWith('FAMILY') ? 'FAMILY_COVERAGE_INCOMPLETE' : 'BROADER_RPM_THAN_ACTIVE_TARGET';
    defectType = baselineStatus.startsWith('FAMILY') ? 'FAMILY_INCOMPLETE'
      : ['RPM_ONLY_WRONG_SEMANTIC_TEMPLATE', 'RPM_ONLY_FAMILY_OR_TEMPLATE_TOO_NARROW'].includes(decision) ? 'WRONG_TEMPLATE'
        : decision === 'RPM_ONLY_WRONG_PROBLEM_TYPE' ? 'WRONG_PT'
          : baseline.problemTypeKey === 'PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS' || baseline.problemTypeKey === 'PT_M1_DATA_ORDER_AND_VALUE'
            || baseline.problemTypeKey === 'PT_M1_CONTEXT_GRAPH_INTERPRETATION' || baseline.problemTypeKey === 'PT_M1_ALGEBRAIC_EXPRESSION_EVALUATION'
            || baseline.problemTypeKey === 'PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION'
            || baseline.problemTypeKey === 'PT_M1_DATA_CATEGORY_PERCENTAGE' ? 'WRONG_PT' : 'DIRECT_OVERMAPPING';
    repairAction = 'REMOVE_NARROW_OR_PARTIAL_ACTIVE_MAPPING_AND_CLOSE_AS_RPM_ONLY';
    memo = `${baseline.problemTypeKey}/${baseline.templateKey || baseline.templateCandidates?.map(x => x.templateKey).join(',')} does not cover the broader RPM L4. Definitions and skeletons are attached; global candidates considered: ${(ACTIVE_SEARCH_CANDIDATES[baseline.problemTypeKey] || []).join(', ') || 'none with a semantically broader GLOBAL ACTIVE definition'}.`;
  } else if (baselineHasMap && (baseline.problemTypeKey !== row.problemTypeKey || baseline.templateKey !== row.templateKey
      || JSON.stringify(baselineCandidateKeys) !== JSON.stringify(currentCandidateKeys))) {
    const decision = reviewedProblemTypeDisposition({ ...row, problemTypeKey: baseline.problemTypeKey, mappingStatus: baselineStatus });
    if (status.startsWith('FAMILY')) {
      const coverage = familyCoverage(row, candidates);
      semanticRelation = coverage.coverage === 'COMPLETE' ? 'FAMILY_EQUIVALENT_AFTER_SUBTYPE_EXPANSION' : 'FAMILY_COVERAGE_INCOMPLETE';
      priorDefectType = baselineStatus.startsWith('DIRECT') ? 'DIRECT_OVERMAPPING' : 'FAMILY_INCOMPLETE';
      defectType = coverage.coverage === 'INCOMPLETE' ? 'FAMILY_INCOMPLETE' : (row.bindingStatus === 'MISSING' ? 'BINDING_ONLY_GAP' : 'SAFE_EXISTING_REUSE');
      repairAction = baselineStatus.startsWith('DIRECT') ? 'DIRECT_TO_COMPLETE_FAMILY_CANDIDATE_SET; EXACT_BINDING_STILL_MISSING' : 'REVALIDATE_FAMILY_CANDIDATE_SET';
      memo = coverage.reason;
    } else {
      semanticRelation = 'REUSED_BROADER_GLOBAL_ACTIVE_MATCH';
      priorDefectType = /PARALLEL_ANGLE_POSITION|REGULAR_POLYGON_ANGLE_COUNT/.test(decision) ? 'WRONG_PT' : 'WRONG_TEMPLATE';
      defectType = row.bindingStatus === 'MISSING' ? 'BINDING_ONLY_GAP' : 'SAFE_EXISTING_REUSE';
      repairAction = row.bindingStatus === 'MISSING' ? 'REMAP_TO_BETTER_GLOBAL_ACTIVE_PT_TPL; EXACT_BINDING_STILL_MISSING' : 'REMAP_TO_BETTER_GLOBAL_ACTIVE_PT_TPL';
      memo = decision === 'REMAP_REGULAR_POLYGON_ANGLE_COUNT'
        ? 'A generic regular-polygon condition is handled by the existing polygon angle/side-count PT and regular-polygon-angle TPL; the former composite multi-polygon angle pair was too narrow.'
        : decision === 'REMAP_PARALLEL_ANGLE_POSITION'
          ? 'Parallel-line criterion judgment maps to the existing parallel-angle position PT and converse-claim audit TPL, not the construction-specific parallelism template.'
          : SAFE_PT_MEMO[row.problemTypeKey] || 'The final existing ACTIVE target is closer to the RPM L4 and its exact binding status is checked separately.';
    }
  } else if (status.startsWith('FAMILY')) {
    const coverage = familyCoverage(row, candidates);
    semanticRelation = coverage.coverage === 'COMPLETE' ? 'FAMILY_EQUIVALENT' : 'FAMILY_COVERAGE_INCOMPLETE';
    defectType = coverage.coverage === 'COMPLETE' ? (row.bindingStatus === 'MISSING' ? 'BINDING_ONLY_GAP' : 'SAFE_EXISTING_REUSE') : 'FAMILY_INCOMPLETE';
    repairAction = coverage.coverage === 'COMPLETE' ? 'KEEP_COMPLETE_FAMILY' : 'CLOSE_AS_RPM_ONLY';
    memo = coverage.reason;
  } else if (status.startsWith('DIRECT')) {
    semanticRelation = 'DIRECT_EQUIVALENT';
    defectType = row.bindingStatus === 'MISSING' ? 'BINDING_ONLY_GAP' : 'SAFE_EXISTING_REUSE';
    repairAction = 'KEEP_DIRECT_EQUIVALENT_MAPPING';
    memo = SAFE_PT_MEMO[row.problemTypeKey] || `Reviewed against RPM L3/L4, GLOBAL ACTIVE PT definition, TPL definition and internalSkeleton: ${row.problemTypeKey} / ${row.templateKey}.`;
  } else {
    semanticRelation = 'NO_SAFE_GLOBAL_ACTIVE_MATCH';
    defectType = 'RPM_ONLY_VALID';
    repairAction = 'KEEP_RPM_ONLY_NO_NARROW_KEY_FORCED';
    memo = 'The GLOBAL ACTIVE search was performed across all 10 active packs; no definition/skeleton candidate safely covers this RPM leaf.';
  }

  const binding = bindings.find(x => x.status === 'ACTIVE') || null;
  const reviewedProblemType = targetedRule ? global.problemTypes.get(targetedRule.problemTypeKey) : null;
  const reviewedTemplateKeys = targetedRule ? [targetedRule.templateKey] : [];
  const reviewedTemplates = reviewedTemplateKeys.map(templateKey => global.templates.get(templateKey)).filter(Boolean);
  const reviewedExactBindings = targetedRule
    ? exactBindings(global, { ...row, problemTypeKey: targetedRule.problemTypeKey }) : [];
  const reviewedExactBindingStatus = reviewedExactBindings.find(binding => binding.status === 'ACTIVE')?.status || 'MISSING';
  const reviewedMappingEvidence = reviewedProblemType ? {
    problemTypeKey: baseline.problemTypeKey, canonicalLabelKo: reviewedProblemType.canonicalLabelKo,
    definition: reviewedProblemType.definition, ownerPack: reviewedProblemType.ownerPack,
    status: reviewedProblemType.status,
    supportingItemCount: reviewedProblemType.supportingItemCount ?? reviewedProblemType.supportingQuestionUids?.length ?? 0,
    supportingQuestionUids: reviewedProblemType.supportingQuestionUids || [],
    exactBindingStatus: reviewedExactBindingStatus,
    exactCurriculumBindings: reviewedExactBindings,
    templates: reviewedTemplates.map(template => ({
      templateKey: template.templateKey, canonicalLabelKo: template.canonicalLabelKo,
      definition: template.definition, internalSkeleton: template.internalSkeleton,
      status: template.status, parentProblemTypeKey: template.parentProblemTypeKey,
      ownerPack: template.ownerPack,
      supportingItemCount: template.supportingItemCount ?? template.supportingQuestionUids?.length ?? 0,
      supportingQuestionUids: template.supportingQuestionUids || [],
    })),
  } : null;
  return {
    semanticRelation, defectType, priorDefectType, repairAction, semanticReason: memo,
    ...(targetedRule ? {
      reviewOrigin: 'GPT_INDEPENDENT_REVIEW', reviewFamily: targetedRule.family, reviewedMappingEvidence,
    } : {}),
    existingMappingStatus: reportedBaselineStatus,
    existingPTTPL: targetedRule ? {
      problemTypeKey: targetedRule.problemTypeKey, templateKey: targetedRule.templateKey, templateCandidates: [],
      ownerPack: reviewedProblemType?.ownerPack || '',
      bindingStatus: reportedBaselineStatus.endsWith('_GAP') ? 'MISSING' : 'ACTIVE',
    } : baseline ? {
      problemTypeKey: baseline.problemTypeKey || '', templateKey: baseline.templateKey || '',
      templateCandidates: baseline.templateCandidates || [], ownerPack: baseline.ownerPack || '',
      bindingStatus: baseline.bindingStatus || 'MISSING',
    } : null,
    finalMappingStatus: status,
    finalPTTPL: row.problemTypeKey ? {
      problemTypeKey: row.problemTypeKey, canonicalLabelKo: pt?.canonicalLabelKo || '', definition: pt?.definition || '',
      ownerPack: pt?.ownerPack || '', status: pt?.status || 'MISSING',
      supportingItemCount: pt?.supportingItemCount ?? pt?.supportingQuestionUids?.length ?? 0,
      supportingQuestionUids: pt?.supportingQuestionUids || [],
      templates: templates.map(template => ({
        templateKey: template.templateKey, canonicalLabelKo: template.canonicalLabelKo, definition: template.definition,
        internalSkeleton: template.internalSkeleton, status: template.status,
        parentProblemTypeKey: template.parentProblemTypeKey,
        ownerPack: template.ownerPack,
        supportingItemCount: template.supportingItemCount ?? template.supportingQuestionUids?.length ?? 0,
        supportingQuestionUids: template.supportingQuestionUids || [],
      })),
    } : null,
    activeBinding: binding,
    exactBindingStatus: binding ? binding.status : (row.problemTypeKey ? 'MISSING' : 'NO_ACTIVE_MAPPING'),
    familyCoverage: status.startsWith('FAMILY') ? familyCoverage(row, candidates) : null,
    globalActiveSearch: {
      activePackCount: global.activePacks.length,
      activePacks: global.activePacks,
      registryFingerprint: global.registryFingerprint,
      relatedCandidateKeysReviewed: baseline ? (ACTIVE_SEARCH_CANDIDATES[baseline.problemTypeKey] || []) : [],
      relatedGlobalCandidateDefinitions: baseline ? (ACTIVE_SEARCH_CANDIDATES[baseline.problemTypeKey] || []).map(key => {
        const candidate = global.problemTypes.get(key);
        return candidate ? { problemTypeKey: key, canonicalLabelKo: candidate.canonicalLabelKo, definition: candidate.definition,
          ownerPack: candidate.ownerPack, status: candidate.status,
          supportingItemCount: candidate.supportingItemCount ?? candidate.supportingQuestionUids?.length ?? 0 } : { problemTypeKey: key, status: 'NOT_GLOBAL_ACTIVE' };
      }) : [],
    },
  };
}

export function buildAuditArtifacts() {
  const coreValidation = validateRpmSources();
  if (coreValidation.status !== 'PASS') throw new Error(`RPM source validation failed: ${JSON.stringify(coreValidation.errors)}`);
  const master = readJson(MASTER_PATH);
  const rpmRows = flattenMaster(master);
  const relocationRows = flattenMaster(master, { scopes: new Set([...SCOPE_ORDER, 'M3-2']) });
  const global = collectGlobalActive();
  const baseline = readJson(`${EVIDENCE_DIR}/baseline-snapshot.json`);
  const baselineMap = new Map();
  for (const grade of ['M1', 'M2']) for (const row of baseline.crosswalks[grade].records) baselineMap.set(row.semanticKey, row);
  const finalCrosswalkMap = new Map();
  const crosswalkData = {};
  for (const grade of ['M1', 'M2']) {
    const data = readJson(CROSSWALK_FILES[grade]);
    crosswalkData[grade] = data;
    for (const row of data.records) finalCrosswalkMap.set(semanticKey(row), row);
  }
  const masterKeys = new Set(rpmRows.map(masterKey));
  const crossKeys = new Set([...finalCrosswalkMap.keys()]);
  const missingCrosswalkRows = [...masterKeys].filter(key => !crossKeys.has(key));
  const orphanCrosswalkRows = [...crossKeys].filter(key => !masterKeys.has(key));
  const allFinalCrosswalkRows = Object.values(crosswalkData).flatMap(data => data.records);
  const sentinelErrors = missingCanonicalPathSentinels(rpmRows, allFinalCrosswalkRows);
  const baselineByKey = new Map();
  for (const row of baseline.rpmRecords) baselineByKey.set(masterKey(row), row);

  const grouped = Object.fromEntries(SCOPE_ORDER.map(scope => [scope, {
    '2015': rpmRows.filter(row => row.scope === scope && row.curriculum === '2015'),
    '2022': rpmRows.filter(row => row.scope === scope && row.curriculum === '2022'),
  }]));
  const rpmCompleteness = rpmRows.map(row => {
    const key = masterKey(row);
    const cross = finalCrosswalkMap.get(key);
    const oldRow = baselineByKey.get(key);
    const crossAudit = cross ? mappingSemanticAudit(cross, baselineMap.get(semanticKey(cross)), global) : null;
    const otherCurriculum = row.curriculum === '2015' ? '2022' : '2015';
    const counterparts = sameScopeCounterparts(row, grouped[row.scope]);
    const relocated = relocated2015StatsEvidence(row, relocationRows);
    const angleBisectorNeedsEvidence = row.scope === 'M2-2' && row.curriculum === '2022' && row.l3 === '각의 이등분선';
    const semanticRelation = counterparts.length ? 'BOTH_PRESENT' : relocated ? 'LEGIT_CURRICULUM_DIFFERENCE' : angleBisectorNeedsEvidence ? 'NEEDS_EVIDENCE' : 'NEEDS_EVIDENCE';
    const initialSemanticRelation = row.curriculum === '2015' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동' && !oldRow ? '2015_RPM_OMISSION'
      : row.curriculum === '2022' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동' && !baselineByKey.has(masterKey({ ...row, curriculum: '2015' })) ? '2015_RPM_OMISSION'
        : semanticRelation;
    const oldCross = baselineMap.get(semanticKey(cross || { curriculum: row.curriculum, scope: row.scope, rpmPath: { ...pathRow(row) } }));
    const initialSemanticDefect = ['2015_RPM_OMISSION', '2022_RPM_OMISSION', 'LEGIT_CURRICULUM_DIFFERENCE'].includes(initialSemanticRelation);
    return {
      curriculum: row.curriculum,
      scope: row.scope,
      rpmRecordId: cross?.id || '',
      baselineRpmRecordId: oldCross?.id || '',
      rpmL1: row.majorUnit,
      rpmL2: row.midUnit,
      rpmL3: row.l3,
      rpmL4: row.l4,
      existingMappingStatus: crossAudit?.reviewOrigin === 'GPT_INDEPENDENT_REVIEW' ? crossAudit.existingMappingStatus : oldCross?.mappingStatus || 'MISSING_RPM_RECORD',
      existingPTTPL: crossAudit?.reviewOrigin === 'GPT_INDEPENDENT_REVIEW' ? crossAudit.existingPTTPL
        : oldCross ? { problemTypeKey: oldCross.problemTypeKey || '', templateKey: oldCross.templateKey || '', templateCandidates: oldCross.templateCandidates || [], ownerPack: oldCross.ownerPack || '', bindingStatus: oldCross.bindingStatus || 'MISSING' } : null,
      ...(crossAudit?.reviewedMappingEvidence ? { reviewedMappingEvidence: crossAudit.reviewedMappingEvidence } : {}),
      semanticRelation,
      initialSemanticRelation,
      curriculumPresence2015: counterparts.length > 0 || Boolean(relocated),
      curriculumPresence2022: counterparts.length > 0 || row.curriculum === '2022',
      curriculumPresence2015AtScope: counterparts.length > 0,
      curriculumPresence2022AtScope: counterparts.length > 0,
      curriculumPresence2015Elsewhere: Boolean(relocated),
      activeBinding: crossAudit?.activeBinding || null,
      defectType: initialSemanticDefect ? initialSemanticRelation === '2015_RPM_OMISSION' && row.curriculum === '2022' ? 'SAFE_EXISTING_REUSE'
        : initialSemanticRelation === '2015_RPM_OMISSION' ? 'RPM_2015_OMISSION' : initialSemanticRelation === '2022_RPM_OMISSION' ? 'RPM_2022_OMISSION' : 'LEGIT_CURRICULUM_DIFFERENCE'
        : angleBisectorNeedsEvidence ? 'NEEDS_EVIDENCE' : crossAudit?.defectType || 'RPM_ONLY_VALID',
      finalDisposition: cross?.mappingStatus || 'MISSING_CROSSWALK_ROW',
      repairAction: initialSemanticRelation === '2015_RPM_OMISSION' && row.curriculum === '2015' ? 'RESTORE_2015_RHS_RHA_AND_REUSE_EXISTING_ACTIVE_BINDING'
        : crossAudit?.repairAction || 'NONE',
      pairedRecords: counterparts.map(other => ({ curriculum: other.curriculum, scope: other.scope, rpmL1: other.majorUnit, rpmL2: other.midUnit, rpmL3: other.l3, rpmL4: other.l4 })),
      relocatedCurriculumEvidence: relocated,
      semanticReason: angleBisectorNeedsEvidence ? '2015 M2-2 view has no standalone angle-bisector theorem leaf; available curriculum/lesson evidence does not settle whether 2022 angle-bisector leaves represent a legitimate curriculum extension or a 2015 RPM taxonomy omission.'
        : relocated ? 'The 2015 curriculum places representative-value content in M3-2, while the 2022 RPM M1-2 scope contains it in M1-2; this is a grade-placement difference, not an omission.'
          : crossAudit?.semanticReason || 'Matched the same semantic L4 in both curriculum scope views; L1/L2 label changes are preserved.' ,
      ...(crossAudit?.reviewOrigin ? { reviewOrigin: crossAudit.reviewOrigin, reviewFamily: crossAudit.reviewFamily } : {}),
      evidence: angleBisectorNeedsEvidence
        ? ['docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/MIDDLE/M2-2.md', 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/MIDDLE/M2-2.md', SOURCE_EVIDENCE.curriculum2015, SOURCE_EVIDENCE.curriculum2022]
        : relocated ? [scopeViewPathEvidence('2015', 'M3-2'), scopeViewPathEvidence('2022', 'M1-2'), SOURCE_EVIDENCE.curriculum2015, SOURCE_EVIDENCE.curriculum2022]
          : [`${RPM}/${row.curriculum === '2015' ? '01_2015' : '02_2022'}/MIDDLE/${row.scope}.md`, MASTER_PATH, cross ? CROSSWALK_FILES[row.scope.startsWith('M1') ? 'M1' : 'M2'] : ''],
    };
  });

  const crosswalkAuditRows = [];
  for (const grade of ['M1', 'M2']) for (const row of crosswalkData[grade].records) {
    const baselineRow = baselineMap.get(semanticKey(row)) || null;
    const details = mappingSemanticAudit(row, baselineRow, global);
    const tuple = masterKey({ curriculum: row.curriculum, scope: row.scope, majorUnit: row.rpmPath.majorUnit, midUnit: row.rpmPath.midUnit, l3: row.rpmPath.l3, l4: row.rpmPath.l4 });
    const rpmRecord = rpmRows.find(candidate => masterKey(candidate) === tuple);
    crosswalkAuditRows.push({
      curriculum: row.curriculum, scope: row.scope, rpmRecordId: row.id,
      rpmL1: row.rpmPath.majorUnit, rpmL2: row.rpmPath.midUnit, rpmL3: row.rpmPath.l3, rpmL4: row.rpmPath.l4,
      ...details,
      curriculumPresence2015: rpmCompleteness.find(x => x.rpmRecordId === row.id)?.curriculumPresence2015 ?? false,
      curriculumPresence2022: rpmCompleteness.find(x => x.rpmRecordId === row.id)?.curriculumPresence2022 ?? false,
      curriculumPresence2015AtScope: rpmCompleteness.find(x => x.rpmRecordId === row.id)?.curriculumPresence2015AtScope ?? false,
      curriculumPresence2022AtScope: rpmCompleteness.find(x => x.rpmRecordId === row.id)?.curriculumPresence2022AtScope ?? false,
      semanticCurriculumRelation: rpmCompleteness.find(x => x.rpmRecordId === row.id)?.semanticRelation || 'NEEDS_EVIDENCE',
      finalDisposition: row.mappingStatus,
      activeBinding: details.activeBinding,
      evidence: {
        targetStandardUnitKey: row.standardUnitKey, targetSubUnitKey: row.subUnitKey,
        globalOwnerPack: row.ownerPack || '', globalActiveRegistryFingerprint: global.registryFingerprint,
        sourceScopePath: `${RPM}/${row.curriculum === '2015' ? '01_2015' : '02_2022'}/MIDDLE/${row.scope}.md`,
        masterPath: MASTER_PATH,
        crosswalkFile: CROSSWALK_FILES[grade],
        ...(details.reviewOrigin ? { reviewOrigin: details.reviewOrigin, reviewFamily: details.reviewFamily } : {}),
      },
      rpmRecordFoundInMaster: Boolean(rpmRecord),
    });
  }

  const changeSummary = summarizeCrosswalkChanges(baselineMap, crosswalkData);
  changeSummary.unresolvedSemantic = rpmCompleteness.filter(row => row.semanticRelation === 'NEEDS_EVIDENCE').length;
  const familyErrors = crosswalkAuditRows.filter(row => row.finalMappingStatus.startsWith('FAMILY') && row.familyCoverage?.coverage !== 'COMPLETE');
  const structuralErrors = crosswalkAuditRows.filter(row => row.finalPTTPL && (row.finalPTTPL.status !== 'ACTIVE' || row.finalPTTPL.templates.some(template => template.status !== 'ACTIVE' || template.parentProblemTypeKey !== row.finalPTTPL.problemTypeKey)));
  const bindingErrors = crosswalkAuditRows.filter(row => row.finalMappingStatus.endsWith('_ACTIVE') !== (row.exactBindingStatus === 'ACTIVE'));
  const targetedFalsePassAudit = validateTargetedFalsePassAudit(allFinalCrosswalkRows);
  const targetedFalsePassErrors = targetedFalsePassAudit.errors;
  const allDirectRelations = crosswalkAuditRows.filter(row => row.finalMappingStatus.startsWith('DIRECT') && !['DIRECT_EQUIVALENT', 'REUSED_BROADER_GLOBAL_ACTIVE_MATCH', 'DIRECT_EQUIVALENT_EXISTING_GLOBAL_ACTIVE'].includes(row.semanticRelation));
  const summary = {
    baseMainSha: BASE_MAIN_SHA,
    rpmInitialRecordCount: baseline.initialRpmL4RecordCount,
    rpmFinalRecordCount: rpmRows.length,
    rpmSemanticRelationRows: countBy(rpmCompleteness, 'semanticRelation'),
    rpmDefectTypeRows: countBy(rpmCompleteness, 'defectType'),
    omissions: {
      initial2015: baseline.knownDefectBeforeRepair.observed2022Rows.length,
      repaired2015: rpmRows.filter(x => x.curriculum === '2015' && x.scope === 'M2-2' && x.l3 === '직각삼각형의 합동').length,
      2022: 0,
    },
    crosswalkInitialRecordCount: baseline.crosswalks.M1.records.length + baseline.crosswalks.M2.records.length,
    crosswalkFinalRecordCount: crosswalkAuditRows.length,
    crosswalkInitialSummary: { middle1: baseline.crosswalks.M1.summary, middle2: baseline.crosswalks.M2.summary },
    crosswalkFinalSummary: { middle1: crosswalkData.M1.summary, middle2: crosswalkData.M2.summary },
    crosswalkDefectTypeRows: countBy(crosswalkAuditRows, 'defectType'),
    crosswalkFinalRpmOnlyRows: crosswalkAuditRows.filter(row => row.finalMappingStatus === 'RPM_ONLY').length,
    bindingOnlyGapCrosswalkRows: crosswalkAuditRows.filter(row => ['DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP'].includes(row.finalMappingStatus)
      && ['DIRECT_EQUIVALENT', 'FAMILY_EQUIVALENT', 'FAMILY_EQUIVALENT_AFTER_SUBTYPE_EXPANSION', 'REUSED_BROADER_GLOBAL_ACTIVE_MATCH'].includes(row.semanticRelation)
      && row.exactBindingStatus === 'MISSING').length,
    semanticRepairs: changeSummary,
    crosswalkMissingRows: missingCrosswalkRows.length,
    crosswalkOrphanRows: orphanCrosswalkRows.length,
    curriculumCoverageSentinelErrors: sentinelErrors.length,
    duplicateRpmSemanticTuples: coreValidation.duplicateSemanticTupleCount,
    viewParityErrors: coreValidation.viewMismatchCount,
    validationResults: {
      activeProblemTypeTemplateParentIntegrityErrors: structuralErrors.length,
      exactBindingStatusMismatchErrors: bindingErrors.length,
      incompleteFamilyCandidateSets: familyErrors.length,
      directSemanticEquivalenceErrors: allDirectRelations.length,
      targetedFalsePassErrors: targetedFalsePassErrors.length,
    },
    targetedFalsePassViolations: targetedFalsePassErrors,
    targetedFalsePassReview: {
      reviewOrigin: 'GPT_INDEPENDENT_REVIEW',
      rowCount: crosswalkAuditRows.filter(row => row.reviewOrigin === 'GPT_INDEPENDENT_REVIEW').length,
      familyCounts: countBy(crosswalkAuditRows.filter(row => row.reviewOrigin === 'GPT_INDEPENDENT_REVIEW'), 'reviewFamily'),
      finalRpmOnlyRows: crosswalkAuditRows.filter(row => row.reviewOrigin === 'GPT_INDEPENDENT_REVIEW' && row.finalMappingStatus === 'RPM_ONLY').length,
    },
    globalActive: { activePackCount: global.activePacks.length, activePacks: global.activePacks,
      activeProblemTypeCount: global.problemTypes.size, activeTemplateCount: global.templates.size,
      exactActiveBindingCount: global.bindings.length, registryFingerprint: global.registryFingerprint },
    remainingNeedsEvidenceRows: rpmCompleteness.filter(x => x.semanticRelation === 'NEEDS_EVIDENCE').map(x => ({ curriculum: x.curriculum, scope: x.scope, rpmRecordId: x.rpmRecordId, l3: x.rpmL3, l4: x.rpmL4 })),
  };

  if (missingCrosswalkRows.length || orphanCrosswalkRows.length || crosswalkAuditRows.length !== rpmRows.length || sentinelErrors.length) throw new Error(`Crosswalk denominator parity failed: ${JSON.stringify({ missingCrosswalkRows, orphanCrosswalkRows, sentinelErrors, crosswalkRows: crosswalkAuditRows.length, masterRows: rpmRows.length })}`);
  if (familyErrors.length || structuralErrors.length || bindingErrors.length || allDirectRelations.length || targetedFalsePassErrors.length) {
    throw new Error('Crosswalk semantic integrity failed: ' + JSON.stringify({
      familyErrors: familyErrors.map(x => x.rpmRecordId),
      structuralErrors: structuralErrors.map(x => x.rpmRecordId),
      bindingErrors: bindingErrors.map(x => x.rpmRecordId),
      allDirectRelations: allDirectRelations.map(x => x.rpmRecordId),
      targetedFalsePassErrors,
    }));
  }

  return {
    summary,
    rpmCompleteness: { schemaVersion: 'RPM_PRIMARY_M1_M2_COMPLETENESS_AUDIT_v1', summary, records: rpmCompleteness },
    crosswalkSemantic: { schemaVersion: 'RPM_PRIMARY_M1_M2_GLOBAL_ACTIVE_CROSSWALK_AUDIT_v1', summary, records: crosswalkAuditRows },
  };
}

function scopeViewPathEvidence(curriculum, scope) { return `${RPM}/${curriculum === '2015' ? '01_2015' : '02_2022'}/MIDDLE/${scope}.md`; }
function countBy(rows, key) { return rows.reduce((acc, row) => { const value = row[key] || 'UNKNOWN'; acc[value] = (acc[value] || 0) + 1; return acc; }, {}); }
function summarizeCrosswalkChanges(baselineMap, crosswalkData) {
  const counts = { KEEP: 0, DIRECT_TO_FAMILY: 0, DIRECT_OR_FAMILY_TO_RPM_ONLY: 0, PT_TPL_REMAP: 0, BINDING_STATUS_RECONCILED: 0, NEW_RPM_PATH: 0, unresolvedSemantic: 0 };
  for (const grade of ['M1', 'M2']) for (const row of crosswalkData[grade].records) {
    const old = baselineMap.get(semanticKey(row));
    if (!old) { counts.NEW_RPM_PATH++; continue; }
    const oldCandidateKeys = (old.templateCandidates || []).map(x => typeof x === 'string' ? x : x.templateKey).filter(Boolean);
    const newCandidateKeys = (row.templateCandidates || []).map(x => x.templateKey).filter(Boolean);
    if (old.mappingStatus !== row.mappingStatus && old.mappingStatus.startsWith('DIRECT') && row.mappingStatus.startsWith('FAMILY')) counts.DIRECT_TO_FAMILY++;
    else if (old.mappingStatus !== 'RPM_ONLY' && row.mappingStatus === 'RPM_ONLY') counts.DIRECT_OR_FAMILY_TO_RPM_ONLY++;
    else if (old.problemTypeKey !== (row.problemTypeKey || '') || old.templateKey !== (row.templateKey || '')
      || JSON.stringify(oldCandidateKeys) !== JSON.stringify(newCandidateKeys)) counts.PT_TPL_REMAP++;
    else if (old.bindingStatus !== row.bindingStatus) counts.BINDING_STATUS_RECONCILED++;
    else counts.KEEP++;
  }
  return counts;
}

function writeAudits() {
  const result = buildAuditArtifacts();
  const validationErrorCount = Object.values(result.summary.validationResults).reduce((sum, count) => sum + count, 0);
  const status = validationErrorCount === 0 ? 'PASS' : 'FAIL';
  if (status !== 'PASS') throw new Error('M1/M2 audit failed closed: ' + JSON.stringify(result.summary.validationResults));
  writeJson(`${EVIDENCE_DIR}/rpm-completeness-audit.json`, result.rpmCompleteness);
  writeJson(`${EVIDENCE_DIR}/crosswalk-semantic-audit.json`, result.crosswalkSemantic);
  const out = {
    schemaVersion: 'RPM_PRIMARY_M1_M2_AUDIT_SUMMARY_v1',
    summary: result.summary,
    sourceEvidence: {
      curriculum2015: SOURCE_EVIDENCE.curriculum2015,
      curriculum2022: SOURCE_EVIDENCE.curriculum2022,
      teacherLearningResource2015: SOURCE_EVIDENCE.teacherLearning2015,
      rhsRhaSpecificEvidence: `${EVIDENCE_DIR}/rhs-rha-curriculum-evidence.json`,
    },
    artifactPaths: [`${EVIDENCE_DIR}/rpm-completeness-audit.json`, `${EVIDENCE_DIR}/crosswalk-semantic-audit.json`, `${EVIDENCE_DIR}/rhs-rha-curriculum-evidence.json`],
  };
  writeJson(`${EVIDENCE_DIR}/AUDIT_SUMMARY.json`, out);
  console.log(JSON.stringify({ status, summary: result.summary, artifacts: out.artifactPaths }, null, 2));
}

function main() {
  if (process.argv.includes('--write-audits')) return writeAudits();
  throw new Error('Usage: audit-rpm-primary-m1-m2.mjs --write-audits');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
