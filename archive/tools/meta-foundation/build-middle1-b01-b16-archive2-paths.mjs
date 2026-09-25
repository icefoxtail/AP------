#!/usr/bin/env node
// Selects current RPM Archive2 paths from FINAL ledger meaning; does not change Meta Foundation keys.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const require=createRequire(import.meta.url);
const core=require(path.join(root,'archive/archive2-core.js'));
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const master=read('docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const paths=core.taxonomyPaths(master).filter((r)=>['2015','2022'].includes(r.curriculumKey)&&['M1-1','M1-2'].includes(r.courseKey));
const byPath=new Map(paths.map((r)=>[core.pathKey(r),r]));
const source=new Map(input.rows.map((r)=>[r.questionUid,r]));
const results=[];const failures=[];
const curriculumFor=(file)=>{const year=Number(path.basename(file).slice(0,2));if(!Number.isInteger(year)||year<19||year>30)throw new Error(`Unknown exam year ${file}`);return year>=25?'2022':'2015';};
const select=(r,L2,L3,L4,reason)=>{
  const names={
    'M1-01':['M1-1','소인수분해'],'M1-02':['M1-1','정수와 유리수'],'M1-03':['M1-1','문자와 식'],'M1-04':['M1-1','좌표평면과 그래프'],
    'M1-05':['M1-2','기본 도형'],'M1-06':['M1-2','평면도형'],'M1-07':['M1-2','입체도형'],'M1-08':['M1-2','통계'],
  };
  const base=names[r.standardUnitKey];
  if(!base)return {status:'HOLD_NO_EQUIVALENT_PATH',reason:`No M1 RPM domain for ${r.standardUnitKey}`};
  const candidate={curriculumKey:curriculumFor(r.sourceArchiveFile),courseKey:base[0],L1:base[1],L2,L3,L4};
  const path=byPath.get(core.pathKey(candidate));
  if(!path){failures.push(`Missing RPM path ${r.questionUid}: ${JSON.stringify(candidate)}`);return {status:'INVALID',reason};}
  return {status:'DIRECT',path,reason};
};
const hold=(reason)=>({status:'HOLD_NO_EQUIVALENT_PATH',path:null,reason});
const pick=(m,r)=>{
  const pt=m.finalProblemTypeKey, tpl=m.finalTemplateKey, old=m.oldProblemTypeKey;
  const token=`${pt} ${tpl} ${old} ${r.decisisiveStep||r.decisiveStep}`.toUpperCase();
  if(r.standardUnitKey==='M1-01'){
    if(r.subUnitKey==='M1-01-GCD_LCM'){
      const L2='최대공약수와 최소공배수';
      if(/LCM_APPLICATION|MAXIMUM_EQUAL_DISTRIBUTION|GCD_DIVISOR_APPLICATION/.test(pt))return select(r,L2,'최대공약수·최소공배수의 활용','주기·배열·묶음 문제','GCD/LCM application from approved decisive step');
      if(/COMMON_MULTIPLE|MINIMUM_COMMON_MULTIPLIER|LCM/.test(token)&&!/GCD_LCM_EXPONENT_CONSTRAINT/.test(pt))return select(r,L2,'공배수와 최소공배수',/CONDITION|FILTER|MEMBERSHIP|FACTOR/.test(token)?'공배수 조건으로 수 찾기':'소인수분해로 최소공배수 구하기','Common multiple or least multiple');
      if(/COMMON_DIVISOR|GCD_DIVISOR|COPRIME|GCD_CONDITION/.test(token))return select(r,L2,'공약수와 최대공약수',/FILTER|MEMBERSHIP|CONDITION|COUNT/.test(token)?'공약수 조건으로 수 찾기':'소인수분해로 최대공약수 구하기','GCD/common-divisor criterion');
      return select(r,L2,'최대공약수·최소공배수의 활용','나누어떨어짐 조건','Joint GCD/LCM exponent constraint');
    }
    const L2='소인수분해';
    if(/PRIME_COMPOSITE|BOUNDED_PRIME_COUNT/.test(pt))return select(r,L2,'소수와 합성수',/PROPERTY|STATEMENT|CLAIM/.test(token)?'소수의 성질 활용':'소수·합성수 판별','Prime/composite classification or bounded prime test');
    if(/DIVISOR_COUNT/.test(pt))return select(r,L2,'약수의 개수',/CONDITION|COUNT_THREE/.test(token)?'조건을 만족하는 자연수 찾기':'소인수분해를 이용한 약수의 개수','Divisor count from exponents');
    if(/DIVISOR|MULTIPLE|FACTOR_STRUCTURE/.test(pt))return select(r,L2,'소인수분해','소인수분해를 이용한 약수의 구조','Factor-set or prime-exponent divisibility');
    return select(r,L2,'소인수분해','자연수의 소인수분해','Prime factorization/exponent structure');
  }
  if(r.standardUnitKey==='M1-02'){
    if(r.subUnitKey==='M1-02-INTEGER_RATIONAL_NUMBER'){
      const L2='정수와 유리수';
      if(/ABSOLUTE/.test(token))return select(r,L2,'절댓값',/PROPERTY|DEFINITION/.test(token)?'절댓값의 뜻':'절댓값 조건으로 수 찾기','Absolute value definition or magnitude condition');
      if(/ORDER|INTERVAL|COUNT_INTEGERS|EQUIMODULAR|RATIONAL_VALUE_COMPARISON/.test(token))return select(r,L2,'수직선과 대소 관계',/COUNT|BETWEEN|INTERVAL/.test(token)?'수직선 위의 수':'유리수의 대소 비교','Rational order or integer interval');
      return select(r,L2,'수 체계',/SIGNED_CHANGE|MONEY|SIGN/.test(token)?'양수·음수 분류':'정수와 유리수의 포함 관계','Number-system classification');
    }
    const L2='정수와 유리수의 계산';
    if(/PRODUCT|QUOTIENT|MULTIP|DIVIS|FACTOR|SIGN_CONSTRAINT|RECIPROCAL/.test(token))return select(r,L2,'곱셈과 나눗셈',/MIXED|CHAIN|RECIPROCAL/.test(token)?'곱셈·나눗셈 혼합':'부호가 있는 수의 곱셈','Product, quotient or sign deduction');
    if(/MIXED|ORDER|POWER|BOUNDED_INTEGER_SUM|EXPRESSION_VALUE/.test(token))return select(r,L2,'혼합 계산',/POWER|거듭제곱/.test(token)?'거듭제곱이 포함된 혼합 계산':'괄호가 있는 혼합 계산','Mixed operation order or evaluated expression');
    return select(r,L2,'덧셈과 뺄셈',/MIXED|ERROR|ALTERNATING|VALUE_COMPARISON/.test(token)?'덧셈·뺄셈 혼합':'부호가 있는 수의 덧셈','Signed additive calculation');
  }
  if(r.standardUnitKey==='M1-03'){
    const L2='문자의 사용과 식의 계산';
    if(/EVALUATION|SUBSTITUT|DEFINED_OPERATION|EXTREME_EXPRESSION/.test(token))return select(r,L2,'식의 값',/CONDITION/.test(token)?'조건식으로 식의 값 구하기':'대입하여 식의 값 구하기','Substitute values in a literal expression');
    if(/PRODUCT_TERM|DISTRIBUT|MISSING_TERM/.test(token))return select(r,L2,'일차식의 계산','괄호가 있는 일차식 계산','Recover an algebraic term by distribution');
    return select(r,L2,'문자의 사용',/NOTATION|QUOTIENT|SYMBOL/.test(token)?'곱셈·나눗셈 기호 생략':'문자로 수량 나타내기','Translate or validate a symbolic expression');
  }
  if(r.standardUnitKey==='M1-04'){
    const coord=/COORDINATE_POINT_READING|COORDINATE_POINT_CONSTRAINT|COORDINATE_AXIS_DISTANCE|QUADRANT_SIGN_DEDUCTION|ORDERED_PAIR/.test(pt);
    if(coord)return select(r,'좌표와 그래프','좌표평면',/SYMMETRY|REFLECT/.test(token)?'대칭인 점의 좌표':'점의 좌표 읽기','Read coordinate signs or components');
    if(/SQUARE_COORDINATES_AND_GRAPH_COEFFICIENTS/.test(pt))return select(r,'정비례와 반비례','관계 해석','그래프에서 식 구하기','Square coordinates supply the two proportional graph constants');
    if(/COORDINATE_COMPOSITE_AREA/.test(pt)&&/PROPORTION_INTERSECTION_AND_TRIANGLE_AREA_RATIO/.test(old))return select(r,'정비례와 반비례','관계 해석','정비례·반비례 활용','Area ratio constrains a proportional graph parameter');
    if(/COORDINATE_COMPOSITE_AREA|COORD_TRIANGLE_AREA|COORDINATE_QUADRILATERAL_AREA/.test(pt))return hold('Current RPM M1 coordinate paths have no coordinate-geometry area calculation leaf; Foundation key remains valid and Archive2 selection is held.');
    if(/DIRECT_INVERSE_PROPORTION_CLASSIFICATION/.test(pt))return select(r,'정비례와 반비례','관계 해석','정비례·반비례 활용','Classify direct/inverse relation from source context');
    if(/PROPORTION_PARAMETER_EVALUATION|INVERSE_PROPORTION_INTEGER_POINT_ENUMERATION/.test(pt))return select(r,'정비례와 반비례','관계 해석','그래프에서 식 구하기','Recover proportion constant or graph points');
    if(/FUNCTION_GRAPH_QUADRANT/.test(pt))return select(r,'정비례와 반비례','정비례','정비례 그래프','Determine proportional graph quadrants');
    if(/BOYLE_LAW/.test(token))return select(r,'정비례와 반비례','반비례','반비례 그래프','Product-constant context gives inverse graph');
    return select(r,'좌표와 그래프','그래프','그래프 해석','Read a displayed or contextual graph');
  }
  if(r.standardUnitKey==='M1-05'){
    if(/SPATIAL_LINE_PLANE|POLYHEDRON_EDGE_FACE|PRISM_SKEW|LINE_PLANE_PERPENDICULAR/.test(pt))return select(r,'위치 관계','공간에서의 위치 관계',/PLANE.*PLANE|두 평면/.test(token)?'평면과 평면의 위치 관계':'직선과 평면의 위치 관계','Spatial line/plane relation from the M1-05 position unit');
    if(/POINT_TO_LINE_PERPENDICULAR_DISTANCE|PERPENDICULAR_FOOT/.test(pt))return select(r,'위치 관계','수직과 거리',/DISTANCE|거리/.test(token)?'점과 직선 사이의 거리':'수선과 수선의 발','Perpendicular foot or distance');
    if(/SEGMENT_LENGTH_RELATIONS/.test(pt))return select(r,'기본 도형','점·선·면','두 점 사이의 거리와 중점','Midpoint and segment-length calculation');
    if(/GENERATED_GEOMETRIC_OBJECT_COUNT|BASIC_GEOMETRY_JUDGMENT|SEGMENT_RAY/.test(pt))return select(r,'기본 도형','점·선·면','직선·반직선·선분','Line, ray or segment object distinction/count');
    if(/BASIC_CONSTRUCTION|M1_ANGLE_COPY/.test(pt))return select(r,'작도와 합동','기본 작도','선분·각의 이동','Compass/straightedge construction or angle copy');
    if(/TRIANGLE_SIDE_FEASIBILITY/.test(pt))return select(r,'작도와 합동','삼각형의 작도','세 변 조건','Triangle inequality or side feasibility');
    if(/CONGRUENCE_UNIQUENESS/.test(pt))return select(r,'작도와 합동',/UNIQUE_TRIANGLE_DATA/.test(tpl)?'삼각형의 작도':'삼각형의 합동',/UNIQUE_TRIANGLE_DATA/.test(tpl)?'한 변과 양 끝각 조건':/ASA/.test(token)?'ASA 합동':/SSS/.test(token)?'SSS 합동':'SAS 합동','Congruence or unique-triangle data criteria');
    if(/CONGRUENCE_DATA_TRANSFER|RIGHT_TRIANGLE_CONGRUENCE|CONGRUENCE_INVARIANTS/.test(pt))return select(r,'작도와 합동','삼각형의 합동',/ASA/.test(token)?'ASA 합동':/SSS/.test(token)?'SSS 합동':'SAS 합동','Triangle congruence and corresponding data transfer');
    if(/PARALLELISM_CONVERSE/.test(pt))return select(r,'기본 도형','평행선과 각','평행선 조건','Parallelism converse from angle relation');
    if(/PARALLEL_ANGLE|PARALLEL_LINE|MOVE_FOLDING_REFLECTION|FOLDING/.test(pt))return select(r,'기본 도형','평행선과 각','동위각·엇각','Parallel-angle transfer or displayed fold angle');
    if(/INTERSECTING_ANGLE_RELATIONS|TRIANGLE_ANGLE_CHASE|ANGLE_MEASURE/.test(pt))return select(r,'기본 도형','각',/VERTICAL|맞꼭지각/.test(token)?'맞꼭지각':'각의 크기','Angle relationship, equation or triangle chase');
    if(/RIGHT_TRAPEZOID_PROPERTY_CHECK/.test(pt))return select(r,'위치 관계','평면에서의 위치 관계','두 직선의 위치 관계','Right-trapezoid statements audit displayed parallel/perpendicular line positions');
    if(/SQUARE_CONFIGURATION_CONGRUENCE_AND_AREA/.test(pt))return select(r,'작도와 합동','삼각형의 합동','ASA 합동','ASA is the decisive congruence transfer in the composite-square area item');
    if(/MIDPOINT_PROJECTION_TRIANGLE_AREA/.test(pt))return hold('No exact M1 RPM basic-figure leaf for midpoint-projection triangle area; retain Foundation mapping and hold Archive2 automatic selection.');
    return select(r,'기본 도형','점·선·면','직선·반직선·선분','Basic-figure term or position');
  }
  if(r.standardUnitKey==='M1-06'){
    if(/QUADRILATERAL_PROPERTIES|TRAPEZOID_AREA|TRIANGLE_AREA_FROM_SQUARE/.test(pt))return hold('Current RPM M1 plane-figure leaves omit general quadrilateral properties and trapezoid/triangle area; Foundation taxonomy is valid but RPM path is held.');
    const L2='다각형';
    if(/POLYGON_CLASSIFICATION/.test(pt))return select(r,L2,'정다각형','정다각형의 성질','Classify polygon by definition');
    if(/TESSELLATION/.test(pt))return select(r,L2,'정다각형','정다각형의 성질','Regular polygon tiling criterion');
    if(/REGULAR_POLYGON_COMPOSITE_ANGLE/.test(pt))return select(r,L2,'삼각형·다각형의 각','각의 크기 계산','Composite polygon angle chase');
    if(/POLYGON_ANGLE_AND_COUNT/.test(pt))return select(r,L2,/DIAGONAL|COUNT|변 수/.test(token)?'삼각형·다각형의 각':'다각형의 내각과 외각',/DIAGONAL|COUNT|변 수/.test(token)?'변·대각선 개수':/EXTERIOR|외각/.test(token)?'외각의 합':'내각의 합','Polygon side/diagonal or interior/exterior angle relation');
    return select(r,L2,'정다각형','정다각형의 성질','Regular polygon property');
  }
  if(r.standardUnitKey==='M1-07'){
    const L2='다면체와 회전체';
    if(/CUBE_NET/.test(pt))return select(r,L2,'다면체','각기둥·각뿔','Fold cube net to identify opposite faces');
    if(/POLYHEDRON_COMPONENT_COUNT/.test(pt))return select(r,L2,'다면체','면·모서리·꼭짓점','Count polyhedron components');
    if(/POLYHEDRON_EDGE_FACE|SOLID|SPATIAL|SKEW|PRISM|PERPENDICULAR_FOOT/.test(pt))return select(r,L2,'다면체','각기둥·각뿔','Prism/polyhedron edge-face relation');
    return select(r,L2,'다면체','면·모서리·꼭짓점','Solid figure structure');
  }
  if(r.standardUnitKey==='M1-08'){
    const L2='자료의 정리와 해석';
    if(/CATEGORY_PERCENTAGE/.test(pt))return select(r,L2,'상대도수','상대도수 계산','Category share from organized data');
    if(/FREQUENCY_DISTRIBUTION/.test(pt))return select(r,L2,/POLYGON|그래프/.test(token)?'도수분포':'도수분포',/POLYGON|그래프/.test(token)?'히스토그램·도수분포다각형':'도수분포표','Grouped-frequency display and cumulative calculation');
    return select(r,L2,'자료 해석','자료에서 정보 추론','Order/extreme/placeholder value from organized data');
  }
  return hold(`No M1 path rule for ${r.standardUnitKey}`);
};
for(const m of mapping.uidMappings){
  const r=source.get(m.questionUid);if(!r){failures.push(`Missing UID ${m.questionUid}`);continue;}
  const chosen=pick(m,r);
  results.push({questionUid:m.questionUid,batchNo:m.batchNo,sourceArchiveFile:m.sourceArchiveFile,sourceOrdinal:m.sourceOrdinal,
    standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,finalProblemTypeKey:m.finalProblemTypeKey,finalTemplateKey:m.finalTemplateKey,
    rpmPathStatus:chosen.status,rpmPath:chosen.path||null,semanticReason:chosen.reason});
}
const held=input.rows.filter((r)=>['HOLD','ROUTE_OUT','SOURCE_BLOCK'].includes(r.reviewStatus)).map((r)=>({questionUid:r.questionUid,batchNo:r.batchNo,sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal,rpmPathStatus:'SEMANTIC_HOLD_OR_ROUTE_OUT',rpmPath:null,semanticReason:`Final semantic disposition ${r.reviewStatus}`}));
const out={schemaVersion:'m1-b01-b16-archive2-rpm-path-mapping-v1',mappedUidCount:results.length,semanticHoldOrRouteOutCount:held.length,directPathCount:results.filter((r)=>r.rpmPathStatus==='DIRECT').length,explicitRpmPathHoldCount:results.filter((r)=>r.rpmPathStatus==='HOLD_NO_EQUIVALENT_PATH').length,records:[...results,...held],failures};
fs.writeFileSync(path.join(root,`${global}/B01_B16_ARCHIVE2_PATH_MAPPING.json`),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({mapped:out.mappedUidCount,direct:out.directPathCount,rpmHold:out.explicitRpmPathHoldCount,semanticHoldOrRoute:held.length,failures:failures.slice(0,12),failureCount:failures.length},null,2));
if(failures.length)process.exitCode=1;
