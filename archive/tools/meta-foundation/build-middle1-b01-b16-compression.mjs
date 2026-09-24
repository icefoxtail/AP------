#!/usr/bin/env node
// Compresses the accepted B01-B16 UID ledgers. This never reads source question text or rewrites verdicts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const global = 'archive/_generated/intelligence/phase1/middle1-foundation/global';
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const write = (p, value) => fs.writeFileSync(path.join(root, p), JSON.stringify(value, null, 2) + '\n');
const input = read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
if (input.failures.length) throw new Error('Global input has failures');
const mapped = input.rows.filter((r) => !['HOLD','ROUTE_OUT','SOURCE_BLOCK'].includes(r.reviewStatus));
const taxonomy = read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
const concepts = read('archive/data/meta-foundation/compiled/concept_registry.json');
const activePT = new Map(taxonomy.problemTypes.map((r) => [r.problemTypeKey, r]));
const activeTPL = new Map(taxonomy.templates.map((r) => [r.templateKey, r]));
const activeCC = new Map(concepts.concepts.map((r) => [r.conceptKey, r]));
const failures = [];

// Each line is a semantic merge, not a string-prefix rule. L4 retains method skeletons below.
const groups = [
  ['PT_M1_PRIME_COMPOSITE_JUDGMENT','소수와 합성수 판별',['PRIME_IDENTIFICATION','PT_PRIME_COMPOSITE_PROPERTY_CHECK','PT_NUMBER_PROPERTY_STATEMENT_JUDGMENT']],
  ['PT_M1_PRIME_FACTORIZATION_JUDGMENT','거듭제곱과 소인수분해 진술 판단',['PT_EXPONENT_AND_FACTORIZATION_STATEMENT_CHECK','PT_PRIME_FACTORIZATION_PARAMETER_RECOVERY']],
  ['PT_M1_PRIME_FACTOR_STRUCTURE','소인수 구조 판별',['PT_PRIME_FACTOR_SET_IDENTIFICATION','PT_PRIME_FACTOR_CONSTRAINT_RECOVERY','KTH_NUMBER_WITH_THREE_DISTINCT_PRIMES']],
  ['PT_M1_DIVISOR_MULTIPLE_EXPONENT','소인수 지수로 약수·배수 판별',['DIVISOR_MULTIPLE_BY_PRIME_EXPONENTS','PT_PRIME_POWER_DIVISOR_MEMBERSHIP']],
  ['PT_M1_GCD_LCM_EXPONENT_CONSTRAINT','최대공약수·최소공배수의 소인수 지수 조건',['PT_GCD_LCM_PARAMETER_RECOVERY','COUNT_THIRD_NUMBER_FROM_GCD_LCM','PT_GCD_LCM_RATIO_FROM_FACTORIZATIONS']],
  ['PT_M1_GCD_DIVISOR_APPLICATION','공약수의 최댓값 적용',['PT_LARGEST_COMMON_DIVISOR_FOR_INTEGRAL_QUOTIENTS','PT_MAXIMUM_EQUAL_DISTRIBUTION_COUNT']],
  ['PT_M1_COMMON_DIVISIBILITY_FILTER','공약수·공배수 조건 검사',['PT_COMMON_DIVISOR_MEMBERSHIP','PT_COMMON_MULTIPLE_MEMBERSHIP','PT_GCD_CONDITION_CANDIDATE_FILTER']],
  ['PT_M1_COPRIME_TEST_AND_COUNT','서로소 판정과 범위 개수',['PT_COPRIME_PAIR_IDENTIFICATION','PT_COPRIME_COUNT']],
  ['PT_M1_SIGNED_CHANGE_MODEL','부호 있는 변화량의 해석과 계산',['PT_SIGNED_CHANGE_MODEL_EVALUATION','SIGNED_MONEY_CHANGE']],
  ['PT_M1_RATIONAL_ARITHMETIC','정수와 유리수의 사칙계산',['PT_RATIONAL_ADDITION_SUBTRACTION','PT_RATIONAL_PRODUCT_QUOTIENT_EVALUATION','PT_MIXED_RATIONAL_ARITHMETIC','PT_ORDER_OF_OPERATIONS_NUMERICAL_EXPRESSION','PT_SIGNED_INTEGER_ARITHMETIC','PT_COMMON_FACTOR_NUMERIC_EVALUATION','PT_ALTERNATING_SIGNED_SUM']],
  ['PT_M1_RATIONAL_VALUE_COMPARISON','유리수의 순서와 계산값 비교',['PT_ORDER_EVALUATED_RATIONAL_EXPRESSIONS','PT_RATIONAL_CALCULATION_OUTLIER','PT_RATIONAL_NUMBER_ORDER_AND_EXTREMA','PT_EXTREME_EXPRESSION_VALUE_SELECTION','PT_SIGNED_INTEGER_ORDER_SELECTION']],
  ['PT_M1_RATIONAL_INTERVAL_INTEGER_COUNT','유리수 구간의 정수 개수',['PT_INTEGER_COUNT_BETWEEN_EQUIMODULAR_VALUES','PT_INTEGER_COUNT_BETWEEN_RATIONAL_RESULTS','PT_INTEGER_COUNT_IN_RATIONAL_INTERVAL']],
  ['PT_M1_RATIONAL_PROPERTY_JUDGMENT','정수·유리수와 절댓값의 성질 판단',['PT_ABSOLUTE_VALUE_PROPERTY_JUDGMENT','PT_RATIONAL_NUMBER_PROPERTY_JUDGMENT']],
  ['PT_M1_RATIONAL_OPERATION_RULE_JUDGMENT','수의 연산 법칙·변형 검사',['PT_OPERATION_LAW_STEP_AUDIT','PT_SIGNED_SUBTRACTION_AS_OPPOSITE_MODEL']],
  ['PT_M1_RECOVER_VALUE_BY_INVERSE_OPERATION','유리수 관계의 역산',['PT_RECOVER_VALUE_FROM_OPERATION_ERROR','PT_UNKNOWN_IN_SIGNED_RATIONAL_EQUATION','PT_RECIPROCAL_RELATION_VALUE_EVALUATION']],
  ['PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION','문장과 식의 대응·표기 검사',['PT_ALGEBRAIC_EXPRESSION_VALIDITY_CHECK','PT_ALGEBRAIC_OPERATION_NOTATION_VALIDITY','PT_ALGEBRAIC_QUANTITY_TRANSLATION_CHECK','PT_ALGEBRAIC_QUOTIENT_EQUIVALENCE']],
  ['PT_M1_ALGEBRAIC_EXPRESSION_EVALUATION','문자식에 수 대입·계산',['PT_ALGEBRAIC_EXPRESSION_VALUE_SUBSTITUTION','PT_DEFINED_OPERATION_EVALUATION']],
  ['PT_M1_COORDINATE_POINT_CONSTRAINT','좌표 성분과 점의 위치조건',['PT_AXIS_MEMBERSHIP_COORDINATE_CONDITION','PT_ORDERED_PAIR_EQUALITY']],
  ['PT_M1_QUADRANT_SIGN_DEDUCTION','좌표 부호와 사분면의 추론',['PT_QUADRANT_FROM_COORDINATE_SIGNS','PT_M1_COORDINATE_AND_GRAPH_SIGN_CHECK','QUADRANT_SIGNS_OF_DIRECT_AND_INVERSE_GRAPHS']],
  ['PT_M1_PROPORTION_PARAMETER_EVALUATION','정비례·반비례 상수와 값 계산',['DIRECT_PROPORTION_TABLE_PARAMETER','INVERSE_PROPORTION_POINT_SUBSTITUTION','PROPORTIONAL_AND_INVERSE_GRAPH_CONSTANTS']],
  ['PT_M1_CONTEXT_GRAPH_INTERPRETATION','상황을 그래프의 변화로 해석',['PERIODIC_REAL_WORLD_GRAPH_READING','BOYLE_LAW_INVERSE_PROPORTION_GRAPH']],
  ['PT_M1_COORDINATE_COMPOSITE_AREA','좌표·함수와 도형 넓이 결합',['PT_M1_COORDINATE_QUADRILATERAL_AREA','PROPORTION_INTERSECTION_AND_TRIANGLE_AREA_RATIO']],
  ['PT_M1_PARALLEL_ANGLE_TRANSFER','평행선 각의 이동·계산',['PT_M1_PARALLEL_LINE_ANGLE_RELATIONS','PT_PARALLEL_LINE_ANGLE_RELATIONS','PARALLEL_LINE_ANGLE_DIFFERENCE','PT_PARALLEL_LINES_ZIGZAG_ANGLE','PT_PARALLEL_LINE_ANGLE_RATIO_TRIANGLE','FOLDING_PARALLEL_LINES_TRIANGLE_ANGLE_SUM']],
  ['PT_M1_PARALLEL_ANGLE_POSITION','동위각·엇각의 위치 판정',['ALTERNATE_INTERIOR_ANGLE_IDENTIFICATION','M1-05-CORRESPONDING_ANGLE_POSITION_SUM','PT_PARALLEL_LINE_ANGLE_PROPERTY_JUDGMENT','PT_PARALLEL_ANGLE_STATEMENT_JUDGMENT']],
  ['PT_M1_PARALLELISM_CONVERSE','각 조건으로 평행 판정',['PARALLELISM_FROM_CORRESPONDING_ANGLES','PT_PARALLEL_LINE_CONSTRUCTION_VALIDITY']],
  ['PT_M1_INTERSECTING_ANGLE_RELATIONS','교차선·맞꼭지각의 계산',['PT_ANGLE_MEASURE_FROM_ALGEBRAIC_RELATIONS','PT_M1_INTERSECTING_LINES_ANGLE_RELATION','PT_ANGLE_CHASE_VERTICAL_AND_RIGHT_ANGLE','CONCURRENT_LINES_ANGLE_DIFFERENCE','CONCURRENT_LINES_ANGLE_EQUATION','ANGLE_RATIOS_WITH_STRAIGHT_ANGLE']],
  ['PT_M1_TRIANGLE_ANGLE_CHASE','삼각형의 내각·외각 연쇄 계산',['PT_M1_INTERIOR_POINT_TRIANGLE_ANGLE_SUM','PT_VERTICAL_ANGLE_TRIANGLE_ANGLE_CHASE','PT_M1_TRIANGLE_ANGLE_EXTERIOR_SUM','PT_CHAINED_ISOSCELES_ANGLE_CHASE','PT_TRIANGLE_EXTERIOR_ANGLE_LINEAR_EQUATION']],
  ['PT_M1_CONGRUENCE_DATA_TRANSFER','합동인 삼각형의 대응 관계 적용',['PT_TRIANGLE_CONGRUENCE_APPLICATION','PT_M1_CONGRUENT_TRIANGLE_DATA_TRANSFER','CONGRUENT_TRIANGLE_CORRESPONDENCE']],
  ['PT_M1_CONGRUENCE_UNIQUENESS','삼각형 합동·작도 유일조건',['PT_TRIANGLE_CONGRUENCE_CONDITION_SELECTION','PT_UNIQUE_TRIANGLE_DETERMINATION_FROM_GIVEN_DATA']],
  ['PT_M1_BASIC_CONSTRUCTION','기본 작도 도구와 절차',['PT_GEOMETRY_CONSTRUCTION_TOOL_USAGE','PT_M1_ANGLE_COPY_CONSTRUCTION']],
  ['PT_M1_SEGMENT_LENGTH_RELATIONS','선분 분할·중점과 길이 계산',['PT_SEGMENT_LENGTH_FROM_NESTED_MIDPOINTS','PT_SEGMENT_LENGTH_FROM_RELATIVE_SUBSEGMENTS']],
  ['PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT','점에서 결정되는 직선·반직선·선분 개수',['PT_COLLINEAR_POINTS_OBJECT_COUNT','PT_M1_RAY_COUNTING','PT_M1_SEGMENT_COUNT_FROM_POINTS','PT_M1_LINES_FROM_CIRCLE_POINTS']],
  ['PT_M1_BASIC_GEOMETRY_JUDGMENT','기본도형의 용어·관계 진술 판단',['PT_BASIC_FIGURE_STATEMENT_JUDGMENT','PT_M1_BASIC_GEOMETRY_STATEMENT_JUDGMENT','PT_SEGMENT_RAY_LINE_RELATION_JUDGMENT']],
  ['PT_M1_TRIANGLE_SIDE_FEASIBILITY','삼각형 성립조건과 가능한 변 세기',['PT_TRIANGLE_SIDE_FEASIBILITY_COUNT','PT_M1_ISOSCELES_TRIANGLE_INTEGER_COUNT']],
  ['PT_M1_SPATIAL_LINE_PLANE_RELATIONS','공간 직선·평면의 위치관계',['PT_SPATIAL_LINE_PLANE_RELATION_JUDGMENT','LINE_PLANE_PERPENDICULARITY_RULES','PT_COPLANAR_LINE_POSITION_IMPLICATIONS','PT_SPATIAL_PARALLEL_LINE_CONDITIONS','PT_SPATIAL_LINE_RELATION_CLASSIFICATION']],
  ['PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS','다면체의 모서리·면 관계',['PT_M1_POLYHEDRON_SPATIAL_RELATIONS','PT_M1_PRISM_EDGE_FACE_RELATION_JUDGMENT','PRISM_SKEW_AND_FACE_PARALLEL_EDGE_COUNTS','PT_SOLID_EDGE_FACE_RELATION_JUDGMENT','PT_RECTANGULAR_PRISM_RELATION_STATEMENT_JUDGMENT','PT_SKEW_EDGE_COUNT','PT_SOLID_PLANE_AND_SKEW_EDGE_RELATIONS','PT_TRIANGULAR_PRISM_NET_SPATIAL_RELATION_JUDGMENT']],
  ['PT_M1_POLYGON_ANGLE_AND_COUNT','다각형의 각·대각선과 변 수 관계',['PT_M1_POLYGON_ANGLE_RELATIONS','PT_M1_POLYGON_DIAGONAL_COUNT_FROM_PARTITION','PT_M1_POLYGON_INTERIOR_TO_EXTERIOR_ANGLE','PT_M1_POLYGON_TRIANGULATION_COUNT','PT_REGULAR_POLYGON_ANGLE_RELATIONS','PT_REGULAR_POLYGON_DIAGONAL_COUNT','PT_M1_REGULAR_POLYGON_COUNT_ANGLE_PROPERTY_JUDGMENT']],
  ['PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE','정다각형을 결합한 각 계산',['PT_M1_REGULAR_POLYGON_ANGLE_CHASE','PT_M1_COMPOSITE_POLYGON_ANGLE_SUM']],
  ['PT_M1_TRAPEZOID_AREA','사다리꼴의 넓이·높이 계산',['PT_M1_TRAPEZOID_AREA_HEIGHT','PT_TRAPEZOID_AREA_FROM_CONGRUENT_TRIANGLES']],
  ['PT_M1_POLYHEDRON_COMPONENT_COUNT','다면체의 꼭짓점·모서리·면 개수',['PT_POLYHEDRON_VERTEX_EDGE_COUNT']],
  ['PT_M1_FREQUENCY_DISTRIBUTION_READING','도수분포표·다각형의 누적 해석',['PT_M1_FREQUENCY_POLYGON_QUANTILE_CUTOFF','PT_M1_FREQUENCY_TABLE_INTERVAL_CUMULATIVE_COUNT','PT_M1_FREQUENCY_TABLE_MISSING_CLASS_FREQUENCY','PT_M1_FREQUENCY_TABLE_STATEMENT_VALIDATION','PT_M1_PARTIAL_FREQUENCY_POLYGON_INFERENCE']],
  ['PT_M1_DATA_ORDER_AND_VALUE','자료의 순서 통계량 해석',['PT_M1_DATA_ORDER_STATISTIC_FROM_DISPLAY']],
];

const oldToGroup = new Map();
const labels = new Map();
for (const [key, label, members] of groups) {
  labels.set(key, label);
  for (const old of members) {
    if (oldToGroup.has(old)) failures.push(`duplicateGroup:${old}`);
    oldToGroup.set(old, key);
  }
}
const byOldL3 = Map.groupBy(mapped, (r) => r.problemTypeKey);
const byOldL4 = Map.groupBy(mapped, (r) => r.templateKey);
for (const old of oldToGroup.keys()) if (!byOldL3.has(old)) failures.push(`unusedGroupMember:${old}`);
const canonPT = (old) => {
  if (activePT.has(old)) return old;
  if (oldToGroup.has(old)) return oldToGroup.get(old);
  return old.startsWith('PT_') ? old : `PT_M1_${old.replace(/^M1-\d\d-/, '')}`;
};
const finalPTByUid = new Map(mapped.map((r) => [r.questionUid, canonPT(r.problemTypeKey)]));
const canonicalPTGroups = Map.groupBy(mapped, (r) => finalPTByUid.get(r.questionUid));
const oldCountByFinalPT = new Map([...canonicalPTGroups].map(([key, records]) => [key, new Set(records.map((r) => r.problemTypeKey)).size]));
const l3Mappings = [...byOldL3].map(([old, records]) => {
  const targets = [...new Set(records.map((r) => finalPTByUid.get(r.questionUid)))];
  if (targets.length !== 1) failures.push(`l3Split:${old}`);
  const target = targets[0];
  const active = activePT.get(target);
  return {oldCandidateKey:old, finalCanonicalKey:target,
    action:active ? (old===target?'REUSE':'MERGE') : oldCountByFinalPT.get(target)>1?'MERGE':'NEW',
    representativeUid:records[0].questionUid, affectedUidCount:records.length,
    semanticReason:records[0].l3SemanticReason || records[0].semanticReason,
    parent:[...new Set(records.map((r)=>`${r.standardUnitKey}/${r.subUnitKey}`))].sort(),
    canonicalSource:active?`ACTIVE:${active.ownerPack}`:'MIDDLE1@B01-B16',
    canonicalLabelKo:labels.get(target) || null,
  };
}).sort((a,b)=>a.oldCandidateKey.localeCompare(b.oldCandidateKey));

// L4 remains a repeatable internal method under its compressed L3. Explicit facet
// rules separate genuinely different solution skeletons; item numbers and output
// format are never facets. The plan is audited by parent and representative evidence.
const facet = (r, pt) => {
  const k = `${r.templateKey} ${r.l4SemanticReason} ${r.primaryMethod}`.toUpperCase();
  const old = r.problemTypeKey;
  if (pt==='PT_M1_PRIME_COMPOSITE_JUDGMENT') return old==='PRIME_IDENTIFICATION'?'DIRECT_PRIME_TEST':old==='PT_NUMBER_PROPERTY_STATEMENT_JUDGMENT'?'NUMBER_CLAIM_AUDIT':'PRIME_COMPOSITE_CLAIM_AUDIT';
  if (pt==='PT_M1_PRIME_FACTOR_STRUCTURE') return old==='PT_PRIME_FACTOR_SET_IDENTIFICATION'?'FACTOR_SET_COMPARE':old==='KTH_NUMBER_WITH_THREE_DISTINCT_PRIMES'?'ORDERED_FACTOR_STRUCTURE':'CONSTRAINED_NUMBER_RECOVERY';
  if (pt==='PT_M1_COMMON_DIVISIBILITY_FILTER') return old==='PT_COMMON_MULTIPLE_MEMBERSHIP'?'COMMON_MULTIPLE_CHECK':old==='PT_COMMON_DIVISOR_MEMBERSHIP'?'COMMON_DIVISOR_CHECK':'GCD_CONDITION_FILTER';
  if (pt==='PT_M1_RATIONAL_VALUE_COMPARISON') return old==='PT_RATIONAL_CALCULATION_OUTLIER'?'EVALUATED_OUTLIER':old==='PT_ORDER_EVALUATED_RATIONAL_EXPRESSIONS'?'EVALUATE_AND_RANK':old==='PT_SIGNED_INTEGER_ORDER_SELECTION'?'SIGNED_NUMBER_ORDER':'EXTREMAL_VALUE_SELECTION';
  if (pt==='PT_M1_RECOVER_VALUE_BY_INVERSE_OPERATION') return old==='PT_RECIPROCAL_RELATION_VALUE_EVALUATION'?'RECIPROCAL_RELATION':old==='PT_RECOVER_VALUE_FROM_OPERATION_ERROR'?'CORRECT_OPERATION_ERROR':'ISOLATE_UNKNOWN_FACTOR';
  if (pt==='PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION') return old==='PT_ALGEBRAIC_QUOTIENT_EQUIVALENCE'?'QUOTIENT_EQUIVALENCE':old==='PT_ALGEBRAIC_OPERATION_NOTATION_VALIDITY'?'OPERATION_NOTATION':old==='PT_ALGEBRAIC_QUANTITY_TRANSLATION_CHECK'?'WORD_QUANTITY_TRANSLATION':'SYMBOLIC_VALIDITY';
  if (pt==='PT_M1_COORDINATE_POINT_CONSTRAINT') return old==='PT_ORDERED_PAIR_EQUALITY'?'ORDERED_PAIR_EQUALITY':'AXIS_ZERO_COMPONENT';
  if (pt==='PT_M1_QUADRANT_SIGN_DEDUCTION') return old==='PT_QUADRANT_FROM_COORDINATE_SIGNS'?'POINT_SIGN_TRANSFORM':'GRAPH_SIGN_QUADRANTS';
  if (pt==='PT_M1_PROPORTION_PARAMETER_EVALUATION') return old==='DIRECT_PROPORTION_TABLE_PARAMETER'?'DIRECT_TABLE_COMPLETION':old==='INVERSE_PROPORTION_POINT_SUBSTITUTION'?'INVERSE_POINT_SUBSTITUTION':'TWO_GRAPH_CONSTANTS';
  if (pt==='PT_M1_CONTEXT_GRAPH_INTERPRETATION') return old==='PERIODIC_REAL_WORLD_GRAPH_READING'?'PERIODIC_GRAPH_CLAIMS':'CONTEXT_TO_RECIPROCAL_GRAPH';
  if (pt==='PT_M1_COORDINATE_COMPOSITE_AREA') return old==='PROPORTION_INTERSECTION_AND_TRIANGLE_AREA_RATIO'?'GRAPH_AREA_RATIO':'COORDINATE_QUADRILATERAL_AREA';
  if (pt==='PT_M1_PARALLEL_ANGLE_POSITION') return old==='ALTERNATE_INTERIOR_ANGLE_IDENTIFICATION'?'ALTERNATE_POSITION_IDENTIFICATION':old==='M1-05-CORRESPONDING_ANGLE_POSITION_SUM'?'POSITIONAL_ANGLE_SUM':'ANGLE_POSITION_CLAIM_AUDIT';
  if (pt==='PT_M1_TRIANGLE_ANGLE_CHASE') return old==='PT_CHAINED_ISOSCELES_ANGLE_CHASE'?'CHAINED_ISOSCELES':old==='PT_VERTICAL_ANGLE_TRIANGLE_ANGLE_CHASE'?'VERTICAL_ANGLE_TRANSFER':old==='PT_M1_INTERIOR_POINT_TRIANGLE_ANGLE_SUM'?'INTERIOR_POINT_ANGLE_SUM':'EXTERIOR_ANGLE_EQUATION';
  if (pt==='PT_M1_CONGRUENCE_UNIQUENESS') return old==='PT_TRIANGLE_CONGRUENCE_CONDITION_SELECTION'?'CONGRUENCE_CRITERION_SELECTION':'UNIQUE_TRIANGLE_DATA';
  if (pt==='PT_M1_BASIC_CONSTRUCTION') return old==='PT_GEOMETRY_CONSTRUCTION_TOOL_USAGE'?'TOOL_USAGE':'ARC_CHORD_ANGLE_COPY';
  if (pt==='PT_M1_BASIC_GEOMETRY_JUDGMENT') return old==='PT_SEGMENT_RAY_LINE_RELATION_JUDGMENT'?'SEGMENT_RAY_OBJECT_IDENTITY':'BASIC_TERM_CLAIM_AUDIT';
  if (pt==='PT_M1_SPATIAL_LINE_PLANE_RELATIONS') return old==='LINE_PLANE_PERPENDICULARITY_RULES'?'LINE_PLANE_NORMAL_TRANSFER':old==='PT_COPLANAR_LINE_POSITION_IMPLICATIONS'?'COPLANAR_POSITION_IMPLICATION':old==='PT_SPATIAL_LINE_RELATION_CLASSIFICATION'?'SPATIAL_LINE_CLASSIFICATION':old==='PT_SPATIAL_PARALLEL_LINE_CONDITIONS'?'PARALLEL_CONDITION':'LINE_PLANE_CLAIM_AUDIT';
  if (pt==='PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE') return old==='PT_M1_COMPOSITE_POLYGON_ANGLE_SUM'?'COMPOSITE_ANGLE_SUM':'REGULAR_POLYGON_ANGLE_CHASE';
  if (pt==='PT_M1_PRIME_FACTORIZATION_JUDGMENT') return old==='PT_PRIME_FACTORIZATION_PARAMETER_RECOVERY'?'PRIME_POWER_PARAMETER':'FACTORIZATION_CLAIM_AUDIT';
  if (pt==='PT_LCM_APPLICATION') return /RECTANGULAR_BRICKS|CUBE|정육면체/.test(k)?'TILING_BY_LCM':/REMAINDER|나머지/.test(k)?'SHIFTED_REMAINDER':/GEAR|TOOTH|톱니/.test(k)?'GEAR_CYCLE':'REPEATED_EVENT_CYCLE';
  if (pt==='PT_M1_SIGNED_CHANGE_MODEL') return /TIME_ZONE|WEEKDAY|시차|요일/.test(k)?'TIME_OFFSET_ROLLOVER':'SIGNED_RELATIVE_CHANGE';
  if (pt==='PT_M1_SEGMENT_LENGTH_RELATIONS') return /RATIO|비율|길이비/.test(k)?'RATIO_AND_MIDPOINT':/TWO_MIDPOINT|CONSECUTIVE|NESTED|MIDPOINT/.test(k)?'CHAINED_MIDPOINT':'RELATIVE_SUBSEGMENT';
  if (pt==='PT_M1_TRIANGLE_SIDE_FEASIBILITY') return r.templateKey==='TPL_FILTER_CANDIDATE_SIDE_LENGTHS_BY_TRIANGLE_INEQUALITY'?'THIRD_SIDE_RANGE':/PERIMETER|둘레/.test(k)?'INTEGER_PERIMETER_CASES':/TRIPLES|LENGTH_SET|세 변/.test(k)?'SELECT_THREE_LENGTHS':'THIRD_SIDE_RANGE';
  if (pt==='PT_M1_CONGRUENCE_DATA_TRANSFER') {
    if (old==='CONGRUENT_TRIANGLE_CORRESPONDENCE'||old==='PT_M1_CONGRUENT_TRIANGLE_DATA_TRANSFER') return 'ORDERED_CORRESPONDENCE';
    if (/EQUILATERAL|정삼각형/.test(k)) return 'EQUILATERAL_SAS_TRANSFER';
    if (/SQUARE|정사각형/.test(k)) return 'SQUARE_CONGRUENCE_TRANSFER';
    if (/RIVER|측량|거리/.test(k)) return 'DISTANCE_MEASUREMENT_SAS';
    return /SIDE|LENGTH|길이/.test(k)?'GENERAL_SIDE_TRANSFER':'GENERAL_ANGLE_TRANSFER';
  }
  if (pt==='PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS') {
    if (/NET|전개도/.test(k)) return 'FOLDED_NET_RELATION_AUDIT';
    if (old==='PT_SKEW_EDGE_COUNT') return 'SKEW_EDGE_COUNT';
    if (old==='PRISM_SKEW_AND_FACE_PARALLEL_EDGE_COUNTS') return 'SKEW_AND_FACE_COUNT';
    if (/STATEMENT|CLAIM|진술/.test(k)) return 'SPATIAL_CLAIM_AUDIT';
    return /SKEW|꼬인/.test(k)?'SKEW_EDGE_RELATION':'EDGE_FACE_INCIDENCE';
  }
  if (pt==='PT_M1_POLYGON_ANGLE_AND_COUNT') {
    if (/DIAGONAL|대각선/.test(k)) return /PARTITION|TRIANGLE|분할/.test(k)?'PARTITION_TO_DIAGONALS':'DIAGONAL_FORMULA';
    return /REGULAR|정다각형/.test(k)?'REGULAR_POLYGON_ANGLE':'INTERIOR_EXTERIOR_SUM';
  }
  if (pt==='PT_M1_PARALLEL_ANGLE_TRANSFER' && /FOLD|접기/.test(k)) return 'FOLDED_RECTANGLE_PARALLEL_TRANSFER';
  if (pt==='PT_M1_PARALLEL_ANGLE_TRANSFER' && /EQUATION|LINEAR|방정식/.test(k)) return 'PARALLEL_ANGLE_EQUATION';
  if (pt==='PT_M1_PARALLEL_ANGLE_TRANSFER' && /CONVERSE|역이용/.test(k)) return 'CONVERSE_ANGLE_CHECK';
  if (pt==='PT_M1_RATIONAL_ARITHMETIC') {
    if (/PRODUCT|QUOTIENT|MULTIP|DIVIS|곱셈|나눗셈/.test(k)) return 'PRODUCT_QUOTIENT';
    if (/MIXED|ORDER|POWER|괄호|거듭제곱/.test(k)) return 'MIXED_ORDER';
    if (/FACTOR|DISTRIBUT/.test(k)) return 'COMMON_FACTOR';
    return 'SIGNED_SUM';
  }
  if (pt==='PT_M1_GCD_LCM_EXPONENT_CONSTRAINT') return /RATIO|비율/.test(k)?'MIN_MAX_RATIO':/THIRD|COUNT|CANDIDATE/.test(k)?'THIRD_CANDIDATE':'PARAMETER_RECOVERY';
  if (pt==='PT_M1_PARALLEL_ANGLE_TRANSFER') return /ZIGZAG|BEND|BROKEN|꺾/.test(k)?'BENT_LINE':/RATIO|비/.test(k)?'ANGLE_RATIO':'DIRECT_TRANSFER';
  if (pt==='PT_M1_INTERSECTING_ANGLE_RELATIONS') return /RATIO|비/.test(k)?'ANGLE_RATIO':/ALGEBRA|EQUATION|식|미지/.test(k)?'ANGLE_EQUATION':'ANGLE_TRANSFER';
  if (pt==='PT_M1_CONGRUENCE_DATA_TRANSFER') return /AREA|넓이/.test(k)?'AREA_TRANSFER':/LENGTH|SIDE|거리|길이/.test(k)?'SIDE_TRANSFER':'ANGLE_TRANSFER';
  if (pt==='PT_M1_GENERATED_GEOMETRIC_OBJECT_COUNT') return /RAY|반직선/.test(k)&&!/LINE_RAY|직선.*반직선/.test(k)?'RAY_COUNT':/SEGMENT|선분/.test(k)&&!/LINE_RAY|직선.*선분/.test(k)?'SEGMENT_COUNT':'MULTI_OBJECT_COUNT';
  if (pt==='PT_M1_POLYGON_ANGLE_AND_COUNT') return /DIAGONAL|대각선/.test(k)?'DIAGONAL_COUNT':/INTERIOR|EXTERIOR|내각|외각/.test(k)?'ANGLE_RELATION':'TRIANGULATION';
  if (pt==='PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS') return /SKEW|꼬인/.test(k)?'SKEW_EDGE':/NET|전개도/.test(k)?'FOLDED_NET':/COUNT|개수/.test(k)?'EDGE_FACE_COUNT':/STATEMENT|CLAIM|진술/.test(k)?'SPATIAL_CLAIM_AUDIT':'EDGE_FACE_INCIDENCE';
  if (pt==='PT_M1_FREQUENCY_DISTRIBUTION_READING') return /MISSING|HIDDEN|가려|누락/.test(k)?'MISSING_FREQUENCY':/QUANTILE|CUTOFF|순위/.test(k)?'CUMULATIVE_CUTOFF':'FREQUENCY_AUDIT';
  return 'CORE';
};
const toTemplate = (r) => {
  if (activeTPL.has(r.templateKey)) return r.templateKey;
  const pt = finalPTByUid.get(r.questionUid);
  return `TPL_${pt.replace(/^PT_/, '')}_${facet(r,pt)}`;
};
const byUidTemplate = new Map(mapped.map((r) => [r.questionUid, toTemplate(r)]));
const finalTemplateGroups = Map.groupBy(mapped, (r) => byUidTemplate.get(r.questionUid));
const oldCountByFinalTPL = new Map([...finalTemplateGroups].map(([key, records]) => [key, new Set(records.map((r) => r.templateKey)).size]));
for (const [k,rs] of finalTemplateGroups) {
  const parents = [...new Set(rs.map((r)=>finalPTByUid.get(r.questionUid)))];
  if (parents.length !== 1) failures.push(`l4ParentCollision:${k}:${parents.join(',')}`);
  if (activeTPL.has(k) && activeTPL.get(k).parentProblemTypeKey!==parents[0]) failures.push(`activeL4Parent:${k}`);
}
const l4Mappings = [...byOldL4].map(([old,records])=>{
  const targets=[...new Set(records.map((r)=>byUidTemplate.get(r.questionUid)))];
  if (targets.length!==1) failures.push(`l4Split:${old}:${targets.join(',')}`);
  const target=targets[0], active=activeTPL.get(target);
  return {oldCandidateKey:old,finalCanonicalKey:target,
    action:active?(old===target?'REUSE':'MERGE'):oldCountByFinalTPL.get(target)>1?'MERGE':'NEW',
    representativeUid:records[0].questionUid,affectedUidCount:records.length,
    semanticReason:records[0].l4SemanticReason || records[0].decisiveStep,
    parent:finalPTByUid.get(records[0].questionUid),
    canonicalSource:active?`ACTIVE:${active.ownerPack}`:'MIDDLE1@B01-B16'};
}).sort((a,b)=>a.oldCandidateKey.localeCompare(b.oldCandidateKey));

const crossMap = new Map([
  ['RATE_TO_GRAPH_SLOPE',null], // intrinsic to graph/container primary
  ['TRIANGLE_AREA',null], // the requested area is intrinsic to the area primary
  ['TRIANGLE_AREA_TRANSFER',null], // congruent area transfer is already the primary method
]);
const byOldCC = Map.groupBy(mapped.flatMap((r)=>r.crossConceptKeys.map((key,i)=>({key,row:r,reason:r.crossConceptReasons[i]}))),(x)=>x.key);
const ccMappings=[...byOldCC].map(([old,refs])=>{
  const target=crossMap.has(old)?crossMap.get(old):old;
  const active=activeCC.get(target);
  return {oldCandidateKey:old,finalCanonicalKey:target,
    action:target===null?'HOLD':active?'REUSE':'NEW',
    representativeUid:refs[0].row.questionUid,affectedUidCount:refs.length,
    semanticReason:target===null?`Intrinsic primary step: ${refs[0].reason}`:refs[0].reason,
    parent:'CROSS_CONCEPT',canonicalSource:target===null?'PRIMARY_TAXONOMY':active?`ACTIVE:${active.ownerConceptShard}`:'MIDDLE1_CONCEPT_SHARD@B01-B16'};
}).sort((a,b)=>a.oldCandidateKey.localeCompare(b.oldCandidateKey));
const byUidCC=new Map(mapped.map((r)=>[r.questionUid,r.crossConceptKeys.map((k)=>crossMap.has(k)?crossMap.get(k):k).filter(Boolean)]));
const inputDigest = input.batches.map((b)=>[b.consensusSha256,b.difficultySha256,b.writebackSha256,b.validationSha256]);
const meta={schemaVersion:'m1-b01-b16-global-compression-v1',sourceHead:input.sourceHead,
  inputLedgerDigests:inputDigest,uidDenominator:input.counts.uniqueUid,
  mappedUidDenominator:mapped.length,hold:input.counts.semanticHold,routeOut:input.counts.routeOut};
const l3Out={...meta,oldCandidateCount:byOldL3.size,finalCanonicalCount:canonicalPTGroups.size,mappings:l3Mappings};
const l4Out={...meta,oldCandidateCount:byOldL4.size,finalCanonicalCount:finalTemplateGroups.size,mappings:l4Mappings};
const ccOut={...meta,oldCandidateCount:byOldCC.size,finalCanonicalCount:new Set([...byUidCC.values()].flat()).size,mappings:ccMappings};
const uidMappings=mapped.map((r)=>({questionUid:r.questionUid,batchNo:r.batchNo,
  sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal,
  oldProblemTypeKey:r.problemTypeKey,finalProblemTypeKey:finalPTByUid.get(r.questionUid),
  oldTemplateKey:r.templateKey,finalTemplateKey:byUidTemplate.get(r.questionUid),
  oldCrossConceptKeys:r.crossConceptKeys,finalCrossConceptKeys:byUidCC.get(r.questionUid),
  conditionKeys:r.conditionKeys,integrationPattern:r.integrationPattern,
  standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,
  difficultyBucket:r.difficultyBucket,reviewStatus:r.reviewStatus}));
const mapping={...meta,finalL3Count:canonicalPTGroups.size,finalL4Count:finalTemplateGroups.size,
  finalCrossConceptCount:ccOut.finalCanonicalCount,
  uidMappings,heldUids:input.rows.filter((r)=>!mapped.includes(r)).map((r)=>({questionUid:r.questionUid,reviewStatus:r.reviewStatus,batchNo:r.batchNo,sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal})),
  failures};
write(`${global}/B01_B16_L3_COMPRESSION.json`,l3Out);
write(`${global}/B01_B16_L4_COMPRESSION.json`,l4Out);
write(`${global}/B01_B16_CROSSCONCEPT_COMPRESSION.json`,ccOut);
write(`${global}/B01_B16_CANONICAL_MAPPING.json`,mapping);
console.log(JSON.stringify({oldL3:byOldL3.size,finalL3:canonicalPTGroups.size,oldL4:byOldL4.size,finalL4:finalTemplateGroups.size,oldCC:byOldCC.size,finalCC:ccOut.finalCanonicalCount,failures:failures.slice(0,25),failureCount:failures.length},null,2));
if(failures.length)process.exitCode=1;
