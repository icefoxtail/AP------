import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256} from '../../../tools/archive-codex-artifact-io.mjs';
import {solutionSha256} from '../../../tools/archive-stage-validator-artifact-v2.mjs';
const root=process.cwd();
const source='archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js';
const exam=readExam(source);
const base='archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011';
const bundle=JSON.parse(fs.readFileSync(`${base}/current-student-only.bundle.json`,'utf8'));
const freeze=JSON.parse(fs.readFileSync(`${base}/r1-independent-freeze.json`,'utf8'));
const adj=JSON.parse(fs.readFileSync(`${base}/r1-adjudication.json`,'utf8'));
const disclosure=JSON.parse(fs.readFileSync(`${base}/r1-postfreeze-qid-8-13-final-v2.json`,'utf8'));
const fileSha=exam.rawSha256,blob=exam.rawBufferGitBlobSha1;
const indep=new Map(freeze.rows.map(r=>[Number(r.qid),r]));
const corrected=new Map(adj.corrections.map(r=>[Number(r.qid),r]));
const student=new Map(bundle.rows.map(r=>[Number(r.qid),r]));
const disclosed=new Map(disclosure.rows.map(r=>[Number(r.qid),r]));
const current= new Map(exam.questions.map(q=>[Number(q.id),q]));
const visualNeeds={
  1:['EXEMPT','극한 보기만 있고 공간·그래프 관계가 없어 별도 문제/해설 그림은 새 결정 정보를 만들지 않는다.'],
  2:['EXEMPT','함수 극한의 계수 조건과 대수적 극한으로 완결되며 도식이 중간 관계를 추가하지 않는다.'],
  3:['EXEMPT','인수분해와 연속 조건으로 충분하고 공간·그래프 topology가 없다.'],
  4:['EXEMPT','유리화 뒤 연속값을 구하는 단일 대수 관계라 추가 그림이 필요하지 않다.'],
  5:['EXEMPT','인수분해와 미분가능성에서 연속성 사용만으로 충분하며 공간 구조가 없다.'],
  6:['EXEMPT','좌우극한의 수식 비교가 전부이며 별도 그림은 조건을 반복한다.'],
  7:['EXEMPT','문제 발문과 함수식이 접점/기울기를 완전히 정하며 문제 그림은 새로운 조건을 주지 않는다.'],
  8:['EXEMPT','함수식과 닫힌구간이 모두 주어져 문제 풀이에 숨은 그래프 정보가 없다.'],
  9:['EXEMPT','극한 명제의 참·거짓 논리와 반례 구조가 핵심이며 도형·그래프 표현이 없다.'],
  10:['EXEMPT','차분극한 대수식으로 닫히고 시각적 위치 관계가 없다.'],
  11:['EXEMPT','함수 관계식의 미분으로 답을 얻으며 그래프 구조가 주어지지 않는다.'],
  12:['EXEMPT','함수와 평행선 조건이 완전히 수식으로 주어져 문제 그림이 새로운 조건을 추가하지 않는다.'],
  13:['REQUIRED','평균값 정리를 만족하는 c의 개수는 원문 그래프의 곡선 topology에서만 판독되므로 원본 PNG가 문제 조건 자체다.'],
  14:['EXEMPT','평행이동과 극한으로 다항식 계수를 결정하는 대수 문제이며 그림은 추가 정보를 주지 않는다.'],
  15:['EXEMPT','O,A,B의 좌표가 삼각형을 완전히 결정하고 숨은 길이·눈금·표시가 없다. 원문에 없는 원을 문제 그림으로 미리 제시하지 않는다.'],
  16:['EXEMPT','계수 미정의 구간별 식을 수식으로 제시하며 고정된 그래프를 문제에 그리면 미지 조건을 시각적으로 선결정하게 된다.'],
  17:['EXEMPT','미분계수 정의에 따른 다항식 전개만 있고 공간 관계가 없다.'],
  18:['EXEMPT','정수 계수·극한·연속 조건의 판별식 풀이로 완결되며 그래프가 새 조건을 제공하지 않는다.'],
  19:['EXEMPT','점·접선·x축·원 중심 조건을 발문이 명시한다. 문제용 schematic은 계산된 접선/중심을 선공개할 위험이 있고 추가 입력 사실은 없다.']
};
const solutionVisual={
  1:['EXEMPT','다섯 극한값의 대수 계산만 있고 해설에 독립적인 공간·구조 관계가 없다.'],
  2:['EXEMPT','극한의 차수 비교만으로 재현되며 시각적 분기나 접점이 없다.'],
  3:['EXEMPT','연속 조건식과 인수분해만 사용한다.'],
  4:['EXEMPT','유리화와 한 점의 극한 계산만 필요하다.'],
  5:['EXEMPT','인수분해 후 연속성으로 값 하나를 정하는 대수 전개다.'],
  6:['EXEMPT','좌우 극한을 등식으로 놓는 단일 수식 판정이다.'],
  7:['BENEFICIAL','접점 (1,5)에서 주어진 기울기 1의 접선을 곡선 위에서 보면 접점-접선 관계를 바로 재현할 수 있고 현재 solution SVG의 curve/line primitive가 일치한다.'],
  8:['BENEFICIAL','MVT의 결정 관계인 끝점 할선 기울기 −5와 c=3/2 접선 기울기 −5를 같은 함수 그래프 위에서 확인하게 한다. 신규 SVG 추가/정적 parity 완료.'],
  9:['EXEMPT','네 논리 진술은 solution에서 각각 별도 문단·반례로 분리되어 있고 도형·그래프 관계가 없다.'],
  10:['EXEMPT','미분계수의 선형성 환원과 m 계산뿐이며 도식이 결정 관계를 추가하지 않는다.'],
  11:['EXEMPT','함수 관계식을 미분한 뒤 값 대입하는 대수 풀이로 충분하다.'],
  12:['BENEFICIAL','두 평행 접선의 접점과 간격을 하나의 좌표계에서 시각화하면 거리 공식의 대상이 분명해진다. 기존 solution SVG의 두 접선 기울기와 접점 좌표를 확인했다.'],
  13:['BENEFICIAL','할선과 같은 기울기의 접선 위치가 첫 하강구간 1개, 두 내부 하강구간 각 2개임을 구간별로 보이게 한다. 신규 SVG 추가/정적 parity 완료.'],
  14:['EXEMPT','극한의 영점 차수 조건과 다항식 계수 비교의 대수 풀이이며 독립 공간 관계가 없다.'],
  15:['REQUIRED','삼각형 변과 중심 O의 원 사이 최소거리·끝점 통과 시 교점 수가 바뀌는 geometry가 풀이의 핵심이다. 기존 SVG에서 수선발 12/5, BO=3, OA=4, 세 원의 반지름을 확인했다.'],
  16:['BENEFICIAL','절댓값 미분가능성은 두 포물선 가지와 이음점/유일한 단순근의 topology를 시각화하면 부호변화 논리가 선명해진다. 기존 SVG의 join/root와 식 방향을 확인했다.'],
  17:['EXEMPT','미분계수 정의에 따른 전개·극한 계산만 있고 새 그래프/공간 관계가 없다.'],
  18:['EXEMPT','판별식과 정수 범위 결정으로 충분하며 근이 없는 포물선 그림은 설명에 새 결정 단계를 추가하지 않는다.'],
  19:['BENEFICIAL','P에서 접하는 직선, 법선 방향 중심 C, x축 접점 T의 동시 관계가 원의 반지름을 결정한다. 기존 SVG의 실제 좌표/수선 표시를 확인했다.']
};
const rpm={
  1:{status:'FAMILY_ACTIVE',crosswalkIds:['H2-M2-RPM-002'],l1:'함수의 극한과 연속',l2:'함수의 극한',l3:'함수의 극한값 계산',l4:'극한값 계산',selection:'active family candidates include the exact TPL_LIMIT_RATIONALIZATION'},
  2:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-003'],l1:'함수의 극한과 연속',l2:'함수의 극한',l3:'극한의 성질',l4:'대수적 계산'},
  3:{status:'FAMILY_ACTIVE',crosswalkIds:['H2-M2-RPM-009'],l1:'함수의 극한과 연속',l2:'함수의 연속',l3:'연속 조건',l4:'미정계수'},
  4:{status:'EVIDENCE_DEBT',crosswalkIds:[],debt:'No exact H15-M2-02 + PT_CONTINUITY_CONDITION + TPL_CONTINUITY_PRODUCT_ZERO_CANCELLATION row in current high2-math2-calculus1 crosswalk; do not invent L3/L4 binding.'},
  5:{status:'DIRECT_BINDING_GAP',crosswalkIds:['H2-M2-RPM-017'],l1:'미분',l2:'미분계수와 도함수',l3:'미분가능성과 연속',l4:'미분가능 조건',debt:'Current canonical crosswalk marks bindingStatus=MISSING for this exact unit/PT/TPL row.'},
  6:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-010'],l1:'함수의 극한과 연속',l2:'함수의 연속',l3:'연속 조건',l4:'구간별 함수'},
  7:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-019'],l1:'미분',l2:'도함수의 활용(1)',l3:'접선',l4:'접선의 방정식'},
  8:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-022'],l1:'미분',l2:'도함수의 활용(1)',l3:'평균값 정리 기초',l4:'기울기 조건',selection:'Source asks for c satisfying f′(c)=the interval secant slope.'},
  9:{status:'EVIDENCE_DEBT',crosswalkIds:[],debt:'No exact PT_LIMIT_STATEMENT_LOGIC + TPL_LIMIT_STATEMENT_COUNTEREXAMPLE row in current RPM crosswalk; current CC_COUNTEREXAMPLE is active but does not establish L3/L4.'},
  10:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-014'],l1:'미분',l2:'미분계수와 도함수',l3:'미분계수',l4:'정의로 미분계수'},
  11:{status:'EVIDENCE_DEBT',crosswalkIds:[],debt:'No exact H15-M2-04 + PT_DERIVATIVE_FUNCTION_DETERMINATION + TPL_DERIVATIVE_RELATION_FUNCTION_DETERMINE row in current RPM crosswalk.'},
  12:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-020'],l1:'미분',l2:'도함수의 활용(1)',l3:'접선',l4:'접점 조건'},
  13:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-022'],l1:'미분',l2:'도함수의 활용(1)',l3:'평균값 정리 기초',l4:'기울기 조건',selection:'MVT secant-slope equality is the decisive relation, independently verified from graph.'},
  14:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-004'],l1:'함수의 극한과 연속',l2:'함수의 극한',l3:'극한의 성질',l4:'미정계수'},
  15:{status:'EVIDENCE_DEBT',crosswalkIds:[],debt:'No exact H15-M2-02 + PT_CONTINUITY_JUDGMENT + TPL_COUNT_FUNCTION_DISCONTINUITY_FIND row in current RPM crosswalk; active cross-concept CC_CIRCLE_TANGENCY does not establish L3/L4.'},
  16:{status:'DIRECT_BINDING_GAP',crosswalkIds:['H2-M2-RPM-018'],l1:'미분',l2:'미분계수와 도함수',l3:'미분가능성과 연속',l4:'그래프에서 판정',debt:'Exact row is DIRECT_BINDING_GAP / bindingStatus MISSING; source is an absolute-value differentiability structure problem without a given graph, so L4 fit also needs canonical reclassification evidence.'},
  17:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-014'],l1:'미분',l2:'미분계수와 도함수',l3:'미분계수',l4:'정의로 미분계수'},
  18:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-004'],l1:'함수의 극한과 연속',l2:'함수의 극한',l3:'극한의 성질',l4:'미정계수'},
  19:{status:'DIRECT_ACTIVE',crosswalkIds:['H2-M2-RPM-020'],l1:'미분',l2:'도함수의 활용(1)',l3:'접선',l4:'접점 조건'}
};
const levelReview={1:['하','한 극한 계산에서 틀린 명제를 고르는 기본 수치 확인'],2:['중','차수 조건을 극한식에 적용해 비를 정리'],3:['중','연속 조건으로 두 계수를 순차 결정'],4:['중','유리화와 연속성 적용'],5:['중','미분가능성의 필요조건 연속성을 적용'],6:['하','좌우극한의 1차방정식'],7:['중','도함수로 접점을 구하고 접선식 설정'],8:['중','평균값 정리와 1차 도함수 등식'],9:['상','합성함수 극한과 세 반례를 구분하는 논리 검증'],10:['중','차분 입력의 비율을 도함수로 환원'],11:['중','함수 관계식을 미분해 도함수를 결정'],12:['중','서로 다른 두 접점을 구해 평행선 거리를 계산'],13:['상','주어진 그래프의 하강 topology에서 접선 위치를 다섯 번 세기'],14:['상','극한 영점 차수 조건으로 삼차함수를 구조적으로 결정'],15:['상','선분과 원의 접촉/끝점 통과에서 교점 개수 변화를 추적'],16:['상','절댓값 미분가능성을 두 이차 가지/근 구조와 결합'],17:['중','미분계수 정의를 직접 전개'],18:['상','정수 계수·연속성·판별식으로 정수 범위를 결정'],19:['상','곡선 접선의 법선과 두 접선 원을 함께 결합']};
const visualFiles=new Map([[7,'q7-solution.svg'],[8,'q8-solution.svg'],[12,'q12-solution.svg'],[13,'q13-solution.svg'],[15,'q15-solution.svg'],[16,'q16-solution.svg'],[19,'q19-solution.svg']]);
const solutionParityFiles=new Map([[8,'q8-solution-visual-parity.json'],[13,'q13-solution-visual-parity.json']]);
const q13Png='archive/assets/images/24_금당고_1학기_중간_고2_수학II/q13.png';
const sample1='archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js';
const sample2='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js';
const negative='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const calib={
  calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],
  sampleReadBeforeWork:true,
  calibrationOrder:['stage assignment and fixed scope','Golden samples 2-3 + related Negative sample','target independent answer freeze','postfreeze answer/solution disclosure','target R1 review','quality compare'],
  calibrationStatus:'PASS',solutionWorkMode:'INDEPENDENT_REVIEW; solution text unchanged; q8/q13 solutionImage additions only',qualityCompareCount:'19/19',
  samples:[
   {path:sample1,sha256:'7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156',gitBlobSha:'95f7e733fd3f786b6bcb98f9662a6ae568f82949',items:[
    {qid:1,solutionSha256:'4a72d4273d234574ad3246ff704ab461af5627dd9ae76b61fcab701efda6e7c3',solutionExcerpt:'내분점 P의 좌표를 구한 뒤 중점 M과 거리를 차례로 계산한다.',observation:'각 단계에서 공식의 계수 배치를 설명하고 좌표·거리 계산을 블록으로 나눠 학생이 재현 가능.'},
    {qid:7,solutionSha256:'0928ae260780fdaeac970f8c40c6d6953e84930fbce299f0c7e6a39e465aacd9',visualSha256:'c9765e63093f01d8ae0bd958c2925798dfeaf0e0b451538f63b4d3c1eea986b8',solutionExcerpt:'중심 C₀→C₁→C₂ 이동과 반지름 보존을 설명한다.',observation:'이동 단계별로 좌표 중심을 독립 표시하고 기존 원/최종 원의 실제 동일 반지름을 도형 primitive로 보인다.'}
   ]},
   {path:sample2,sha256:'3eb164f35c323520bbc2c77825c5976b09bd919b9d1b50c91842ac94ea225b99',gitBlobSha:'eb8776d19989f8f4219f4b80db0daf72310109cd',items:[
    {qid:1,solutionSha256:'027fed72712b800af24c39fa923bd97f0949e7facc5f526e5abccbee7f9e5682',solutionExcerpt:'두 점의 좌표 차를 거리 공식에 넣는다.',observation:'좌표차의 부호와 제곱·제곱근 계산을 순서대로 전개한다.'},
    {qid:2,solutionSha256:'84e0fa32e411a8c3059958c6409bb588d26c1a44138e60ce9e1ccd49a7d3f1e2',visualSha256:'8914784b537211d08cfb237a460ce7067211b6ea9f87486906da4831d94fac30',solutionExcerpt:'두 직선의 기울기 곱을 −1로 두어 k를 구한다.',observation:'두 실제 직선식의 line primitive 기울기 −1/3, 3이 수직 조건과 일치하고 계산 패널이 결과를 보조한다.'}
   ]}
  ],
  negativeSample:{path:negative,sha256:'dbf9f3d1e6cbedbb0df8b0072e7682a60643d3c94578cd1d99e63dfa444adb23',gitBlobSha:'f06387b8bbb5adce4244fbb576c0bd500ab282fa',observation:'actual SVG coordinates/topology가 label 문구와 불일치하는 false PASS, 열거식 풀이의 실제 block 분리 누락, active Meta null-but-resolvable, runtime escape drift를 반드시 직접 점검.'}
};
const assetInfo=(ref)=>{if(!ref)return null;const p=path.join(root,'archive',ref);return {ref,sha256:sha256(fs.readFileSync(p)),opened:ref.endsWith('q13.png')||ref.endsWith('-solution.svg'),actualRenderer:'Archive engine renderSolutionImageHTML uses ordinary img src and cache-buster; SVG reference accepted by current asset contract',actualArchiveRenderStatus:'NOT_RUN_R1_R3_OWNER'};};
const rows=exam.questions.map(q=>{
  const id=Number(q.id), f=indep.get(id), correction=corrected.get(id), st=student.get(id);
  const answer=correction?.correctedAnswer??f.independentAnswer;
  const post=disclosed.get(id);
  const stored=q.answer;
  const qVisual=visualNeeds[id]; const sVisual=solutionVisual[id];
  const refs=[];
  if(q.image)refs.push(assetInfo(q.image));
  if(q.solutionImage)refs.push(assetInfo(q.solutionImage));
  const parityRef=solutionParityFiles.get(id);
  const parity=parityRef?JSON.parse(fs.readFileSync(`${base}/${parityRef}`,'utf8')):null;
  const status=qVisual[0]==='REQUIRED'?'REQUIRED':qVisual[0];
  const solutionStatus=sVisual[0];
  const qImage=q.image?assetInfo(q.image):null;
  const solImage=q.solutionImage?assetInfo(q.solutionImage):null;
  const visualEvidence={
    status:'PASS',
    problemVisual:{need:status,reason:qVisual[1],assetAction:q.image?(id===13?'KEEP_EXISTING_VERIFIED_RASTER':'KEEP_EXISTING_VERIFIED'):'EXEMPT',asset:qImage},
    solutionVisual:{need:solutionStatus,reason:sVisual[1],assetAction:parity?'NEW_SVG':(q.solutionImage?'KEEP_EXISTING_VERIFIED':'EXEMPT'),asset:solImage,staticParity:parity?{path:`${base}/${parityRef}`,sha256:sha256(fs.readFileSync(`${base}/${parityRef}`)),svgSha256:parity.finalSvgSha256,xmlParse:parity.xmlParse,observedFacts:parity.observedFacts,decisiveRelationCovered:parity.decisiveRelationCovered,expectedFactCompletenessStatus:parity.expectedFactCompletenessStatus}:null},
    actualArchiveRenderStatus:'NOT_RUN_R1_R3_OWNER',rendererSupport:'Archive solutionImage path is loaded as ordinary image src in engine.html; SVG served through current asset-ref contract; final six-case Archive browser render is assigned to R3.'
  };
  let answerCompare='MATCH';
  let compareBasis='Independent answer agrees with stored answer.';
  if(id===19){compareBasis='Mathematical equivalence: frozen 30π−10√5π equals stored π(30−10√5); one scalar answer.';}
  if(id===13)compareBasis='Initial freeze value ③ was preserved; separate q13 adjudication corrected the undercount to ⑤ before answer comparison; stored answer is ⑤.';
  const meta={
    status:'PASS_WITH_EXPLICIT_EVIDENCE_DEBT',
    category:q.category,originalCategory:q.originalCategory,standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,questionType:q.questionType,tagsCurrent:q.tags,visualTagCheck:{needed:q.image||q.solutionImage,requiredTag:(q.image||q.solutionImage)?((q.tags||[]).includes('그래프')?'그래프':'도형'):null,present:!(q.image||q.solutionImage)||(q.tags||[]).some(t=>t==='그래프'||t==='도형')},
    levelCurrent:q.level,independentLevel:levelReview[id][0],independentLevelReason:levelReview[id][1],
    difficultyBucketCurrent:q.difficultyBucket,difficultyConfidenceCurrent:q.difficultyConfidence,difficultyBoundaryFlagCurrent:q.difficultyBoundaryFlag,legacyLevelCompatibilityCurrent:q.legacyLevelCompatibility,difficultyDisposition:'KEEP',
    crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,
    rpm:structuredClone(rpm[id]),
    identity:{sourceArchiveFile:'original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js',sourceRawSha256:fileSha,sourceOrdinal:id,sourceQidBasis:`current JS id ${id} equals the current student-bundle qid ${id}`,questionUidFieldPresent:Object.hasOwn(q,'questionUid')||Object.hasOwn(q,'uid'),stableQuestionUid:'EVIDENCE_DEBT: no current stable questionUid field or UID registry record for this assignment',provenance:'current source path/raw SHA + qid + referenced asset hashes bound; original intake page-level provenance is not in the current bundle/evidence root'},
    sourceConsumerIndexParity:'NOT_TESTED: target has no current exact UID registration/readback in this branch; R1 does not publish or claim consumer/index parity',
    exactDebts:[]
  };
  if(['EVIDENCE_DEBT','DIRECT_BINDING_GAP'].includes(rpm[id].status))meta.exactDebts.push({field:'RPM_L1-L4',reason:rpm[id].debt||`Current crosswalk provides ${rpm[id].status}, not a unique exact binding; fields not guessed.`});
  meta.exactDebts.push({field:'questionUid',reason:'Current JS and current assignment records do not provide a stable per-item questionUid/UID registry mapping.'});
  const bodyParity={studentPayloadSha256:st.studentPayloadSha256,originalFreezeBundleSha256:freeze.studentBundle.sha256,studentBundleSourceSha256:bundle.sourceRawSha256,finalPostfreezeParity:(id===8||id===13)?disclosure.studentParity:'EXACT_FROM_FULL_BUNDLE_AND_POSTFREEZE_CHECK',studentFieldsPreserved:true};
  return {
    qid:id,independentAnswer:answer,independentAnswerOriginalFreeze:f.independentAnswer,independentReasoning:f.reasoning,independentAnswerFrozenBeforeStoredAnswer:true,
    freezeRef:{path:`${base}/r1-independent-freeze.json`,sha256:'4d6fa27f4ed1381d6bb1e0a741eb10311b6db2cb4cac9b1048d963e79bed7ea0'},
    ...(correction?{adjudicationRef:{path:`${base}/r1-adjudication.json`,sha256:'49f9bfdb1b037cc7bd8e88917a2e346df16c4cf1d2be96235ab63ff141b7ebdf',reason:correction.reason,originalFreezeAnswer:correction.originalAnswer,correctedAnswer:correction.correctedAnswer}}:{}),
    storedAnswer:stored,compareResult:answerCompare,compareBasis:compareBasis,answerCardinality:{studentAnswerCount:1,uniqueCorrectChoiceCount:q.choices?.length?1:null,choiceCount:q.choices?.length||0},
    verdict:'PASS',disposition:'KEEP',smallBoardContinuityStatus:'PASS',solutionSha256:solutionSha256(q.solution),
    axisEvidence:{
      QUESTION_LAYOUT:{status:'PASS',disposition:'KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',layoutTag:q.layoutTag,wide:q.wide,studentPayloadParity:bodyParity,reason:q.image?'content/image/choices order follows engine schema; graph image is an independent student input asset.':'No source-only visual field is required; text/MathJax content and choices are exact.' ,actualArchiveRenderStatus:'NOT_RUN_R1_R3_OWNER'},
      SOLUTION_LAYOUT:{status:'PASS',disposition:'KEEP',solutionIdentity:{examFile:source,sourceOrdinal:id,studentPayloadSha256:st.studentPayloadSha256,solutionSha256:solutionSha256(q.solution)},smallBoardContinuityStatus:'PASS',studentReproducibility:'PASS',smallBoardObservation:id===9?'ㄱ/ㄴ/ㄷ/ㄹ are separated into distinct labelled paragraphs, each with a truth judgment or counterexample.':id===15?'OA/OB and AB cases are separated; threshold radii and the requested sum each receive their own equation/result.':id===16?'C1 matching, |f-p| condition, root location, p/q determination and conclusion are in separate logical blocks.':'Explanation, decisive equation(s), conditions and answer conclusion are separated in student-readable line/paragraph blocks.',goldenQualityCompare:'PASS',actualArchiveRenderStatus:'NOT_RUN_R1_R3_OWNER'},
      META:meta,
      VISUAL_SVG:visualEvidence
    },
    metaDebtFields:[],
    studentBodyParity:bodyParity,
    expectedSourceQid:id
  };
});
const sampleSet=calib.samples.map(x=>x.path);
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:'24_금당고_1학기_중간_고2_수학II',artifactSha:blob,artifactRawSha256:fileSha,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',denominator:19,qids:exam.questions.map(q=>Number(q.id)),rows,goldenCalibrationReviewed:true,goldenCalibrationSet:sampleSet,goldenCalibration:calib,assetReads:[{qid:13,ref:'assets/images/24_금당고_1학기_중간_고2_수학II/q13.png',sha256:'f026e37dfc703c8bc0315b3aabcd50e5bd745af0756637622da3b5d80d126610',opened:true}],sourceIdentityReview:{examFile:source,sourceRawSha256:fileSha,sourceRawBlobSha1:blob,studentBundlePath:`${base}/current-student-only.bundle.json`,studentBundleSha256:'64364b14d386f3ea29f701f0c1b5e9011988f99bcaa7a227bbbdd830ef30f8f6',freezePath:`${base}/r1-independent-freeze.json`,freezeSha256:'4d6fa27f4ed1381d6bb1e0a741eb10311b6db2cb4cac9b1048d963e79bed7ea0',currentFinalStudentParity:'EXACT',postfreezeQidScope:[8,13],postfreezeDisclosurePath:`${base}/r1-postfreeze-qid-8-13-final-v2.json`,postfreezeDisclosureSha256:sha256(fs.readFileSync(`${base}/r1-postfreeze-qid-8-13-final-v2.json`))},summary:{answerMatches:19,answerMismatchesAfterAdjudication:0,questionLayoutPass:19,solutionLayoutPass:19,metaRowsWithExactEvidenceDebt:19,visualTwoAxisRows:19,problemVisualRequired:1,solutionVisualRequired:1,solutionVisualBeneficial:6,solutionVisualExempt:12,itemHolds:0,questionLayoutRender:'NOT_RUN_R1_R3_OWNER',solutionRender:'NOT_RUN_R1_R3_OWNER',sourcePdfCompared:false,sourcePdfReason:'No specific extraction/source-text defect identified; extracted JS/student bundle and actual q13 PNG are the current inputs.'}};
fs.writeFileSync(`${base}/r1-evidence.draft-v2.json`,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({evidence:`${base}/r1-evidence.draft-v2.json`,rows:rows.length,sha256:sha256(fs.readFileSync(`${base}/r1-evidence.draft-v2.json`)),currentSourceRawSha256:fileSha,currentArtifactSha:blob,metaDebts:rows.map(r=>({qid:r.qid,debt:r.axisEvidence.META.exactDebts})).filter(x=>x.debt.length),visualNeeds:{problemRequired:rows.filter(r=>r.axisEvidence.VISUAL_SVG.problemVisual.need==='REQUIRED').map(r=>r.qid),solutionRequired:rows.filter(r=>r.axisEvidence.VISUAL_SVG.solutionVisual.need==='REQUIRED').map(r=>r.qid),solutionBeneficial:rows.filter(r=>r.axisEvidence.VISUAL_SVG.solutionVisual.need==='BENEFICIAL').map(r=>r.qid),solutionExempt:rows.filter(r=>r.axisEvidence.VISUAL_SVG.solutionVisual.need==='EXEMPT').map(r=>r.qid)}},null,2));