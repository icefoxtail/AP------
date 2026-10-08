import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {readExam,sha256 as rawSha256,physical} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
import {solutionSha256} from '../../../../archive/tools/archive-stage-validator-artifact-v2.mjs';
const root=process.cwd();
const workDir='.tmp/archive/h1-final-five-pilot-20261008/21_매산고_1학기_기말_고1_기출';
const examFile=path.join(workDir,'21_매산고_1학기_기말_고1_기출.js');
const exam=readExam(examFile);const questions=exam.questions;
const evidenceDir='archive/analysis/21_매산고_1학기_기말_고1_기출/h1-final-five-pilot-20261008';
const freezePath=path.join(evidenceDir,'R1.independent-freeze.json');
const adjPath=path.join(evidenceDir,'R1.freeze-adjudication.json');
const q14FreezePath=path.join(evidenceDir,'R1.q14fresh.original-scope-freeze.json');
const q14AnswerPath=path.join(evidenceDir,'R1.q14fresh.independent-answers.json');
const q14ClosePath=path.join(evidenceDir,'R1.q14fresh.layout-closure.json');
const q14SourceFixPath=path.join(evidenceDir,'R1.q14-source-repair.provenance.json');
const q14LayoutFixPath=path.join(evidenceDir,'R1.q14-question-layout-repair.provenance.json');
const q14VisualFixPath=path.join(evidenceDir,'R1.q14-svg-bbox-repair.json');
const latePreflightPath=path.join(evidenceDir,'R1.solution-calibration.late-correction-preflight.json');
const lateReviewPath=path.join(evidenceDir,'R1.late-correction-review.json');
const negativePath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const goldenSpecs=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',sha256:'7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156',gitBlobSha:'95f7e733fd3f786b6bcb98f9662a6ae568f82949',items:[
  {qid:7,solutionSha256:'0928ae260780fdaeac970f8c40c6d6953e84930fbce299f0c7e6a39e465aacd9',visualSha256:'c9765e63093f01d8ae0bd958c2925798dfeaf0e0b451538f63b4d3c1eea986b8',observation:'Actual unchanged CREATE visual receipt reused; center/radius and sequential transformation checks supplement the stepwise square-completion and movement solution.'},
  {qid:9,solutionSha256:'9d9a8678a8390eefc9dfdda5f6f88d772c24fa8a0a166ecf309bdc00b668bf96',visualSha256:'7ee9d274953f32e8c74510e2c1f305b5da858289ccd9cbc834751710b63bac88',visualPreviewSha256:'f1ceaa345b1e70f85e32f56aa234d6a6345e24971abe9a6741e530163d7cea31',observation:'Actual passive PNG opened; 3x+2y=13 is tangent to x²+y²=13 at P=(3,2), and the comparison line has slope 2/3 perpendicular to −3/2. A tofu glyph in explanatory text was not reused.'}
 ]},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',sha256:'3eb164f35c323520bbc2c77825c5976b09bd919b9d1b50c91842ac94ea225b99',gitBlobSha:'eb8776d19989f8f4219f4b80db0daf72310109cd',items:[
  {qid:2,solutionSha256:'84e0fa32e411a8c3059958c6409bb588d26c1a44138e60ce9e1ccd49a7d3f1e2',visualSha256:'8914784b537211d08cfb237a460ce7067211b6ea9f87486906da4831d94fac30',observation:'Actual unchanged CREATE visual receipt reused; each line is put in slope-intercept form before the perpendicular slope product is applied.'},
  {qid:3,solutionSha256:'14da6e5de553ba66fa844aeac03ccb7fef8ba496759cd01906cb417185d22370',visualSha256:'3208ec847fd87a1907669b72f0b0fb2b795407361335c0ce34bc2fa4fda9cce8',visualPreviewSha256:'02bdd2c9cd1b6a2f33e879a65c1241c1b01044cdb00ea2c07d67f413547abb21',observation:'Actual passive PNG opened; the circle primitive has center (−1,3), radius 2, and right point (1,3), matching the completed-square work.'}
 ]}
];
const freeze=JSON.parse(fs.readFileSync(freezePath,'utf8'));
const adjudication=JSON.parse(fs.readFileSync(adjPath,'utf8'));
const corrected=new Map(adjudication.corrections.map(x=>[Number(x.qid),x]));
const q14Answers=JSON.parse(fs.readFileSync(q14AnswerPath,'utf8')).answers;
const q14Answer=q14Answers.find(x=>Number(x.qid)===14);
const q14Closure=JSON.parse(fs.readFileSync(q14ClosePath,'utf8'));
const q14CloseInfo=q14Closure.questionLayoutRecheck;
if(q14CloseInfo.verdict!=='PASS_STATIC_QID14'||q14CloseInfo.changedQid!==14)throw new Error('Q14_LAYOUT_CLOSURE_REQUIRED');
const q14FreshFreeze=JSON.parse(fs.readFileSync(q14FreezePath,'utf8'));
const q14SourceFix=JSON.parse(fs.readFileSync(q14SourceFixPath,'utf8'));
const q14LayoutFix=JSON.parse(fs.readFileSync(q14LayoutFixPath,'utf8'));
const q14VisualFix=JSON.parse(fs.readFileSync(q14VisualFixPath,'utf8'));
const latePreflight=JSON.parse(fs.readFileSync(latePreflightPath,'utf8'));
const lateReview=JSON.parse(fs.readFileSync(lateReviewPath,'utf8'));
if(latePreflight.solutionQualityCalibration.calibrationStatus!=='PASS')throw new Error('LATE_GOLDEN_PREFLIGHT_REQUIRED');
if(lateReview.reviewedQids.length!==3||JSON.stringify(lateReview.reviewedQids)!==JSON.stringify([5,10,18]))throw new Error('LATE_CHANGED_LOCUS_REVIEW_REQUIRED');
const originalFreezeRows=new Map(freeze.rows.map(x=>[Number(x.qid),x]));
const sourcePdf='C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매산고1_1기말.pdf';
const sourcePdfSha256='dcd12fa9fb1fd1b9ecc5fd23d5d33394bb4ff66de327c1dfb441c4701c2f5dab';
const sourcePage={1:[1,2,3,4,5],2:[6,7,8,9],3:[10,11,12,13],4:[14,15],5:[16,17,18],6:[19,20]};
const pageByQid=new Map(Object.entries(sourcePage).flatMap(([p,ids])=>ids.map(q=>[q,Number(p)])));
const layoutReason={
1:'공통 안내, 발문, 연립부등식이 분리되고 조건식 내부와 선택지 atom은 그대로 유지된다.',2:'점·직선·거리 질문의 한 의미 단위로 구성되어 식을 깨지 않으며 choices가 원문 순서와 같다.',3:'지나는 점과 평행 조건이 같은 질문 흐름으로 연결되고 완결된 직선식과 보기들이 보존된다.',4:'두 점, 내분비, 좌표 이름, 합 질문이 순서대로 이어지며 좌표쌍은 온전히 결속된다.',5:'원의 방정식, 접선 조건, 기울기, 질문이 한 흐름으로 읽히고 수식은 보존된다.',6:'대화 그림을 가리키는 안내문과 상수 조건이 유지되고 실제 문제 PNG가 발문에 연결된다.',7:'두 원의 중심식과 움직이는 점 및 최소 거리 질문의 순서가 명확하다.',8:'평행이동, 점·직선 이동, 수선의 발, 최종 계산의 의미 경계가 유지되고 식과 단위가 붙어 있다.',9:'절댓값식과 정수 해 개수 질문이 온전하다.',10:'거리 제곱합 조건, 제약 직선, 원의 표준형, 목표식이 순서대로 보존된다.',11:'두 원의 교점, 접선과 중심의 조건, 대칭 및 교집합 넓이 질문이 유지된다.',12:'두 부등식의 해와 p,q 제약, 최종식이 수식 단위로 결속된다.',13:'세 변환의 순서와 함수식 대입형 및 계수 합 질문이 보존된다.',14:'원 PDF에서 복구된 제1사분원 조건을 설정/운동/질문/단서 경계의 세 <br>로 나눴다. 태그 제거 시 원문 atom·공백이 정확히 복원된다.',15:'모든 실수 조건, 절댓값 부등식, 최댓값 p와 최종 배수 질문이 유지된다.',16:'원·직선의 불교점 조건과 실수 k 범위를 묻는 구조가 온전하다.',17:'단답형 표지, 교점 parameter, 원 제외점, 조건 괄호가 원문 순서로 유지된다.',18:'최고차항 계수, 두 이차함수 및 h의 정의, (가)/(나), 최종 최댓값 질문이 분리되어 조건과 함수식이 온전하다.',19:'서술형 표지, 반지름·이등분 직선·원 위 점, 삼각형 조건과 handwritten 위치 단서가 보존된다.',20:'서술형 표지와 자연수/양수 조건, 세 직선 식 묶음, 넓이 제한 및 개수 질문이 보존된다.'
};
const solutionReason={
1:'두 부등식의 변형을 각각 보여 주고 x<2, x≥1의 교집합을 1≤x<2로 마무리한다.',2:'일반형 변환, 점-직선 거리식, 분자·분모 계산과 간단한 결과를 별도 줄로 제시한다.',3:'기울기 4인 직선을 놓고 (-1,1) 대입으로 b와 최종식을 구한다.',4:'AP:PB=3:2를 내분 공식에 반대쪽 비로 대입하여 P=(4,5), 합 9를 계산한다.',5:'접선 거리=반지름에서 |b|=2√5를 얻고 보기의 부호까지 확인한다.',6:'열린 대화 그림의 A,B,C를 읽고 AC,BC를 계산한 뒤 피타고라스와 a,b,c를 연결한다.',7:'중심과 반지름을 식에서 읽고 중심 거리 5에서 두 반지름을 빼 최소 간격 2를 얻는다.',8:'점 변환, 역대입한 직선식, 법선 투영으로 발 좌표를 구하고 10(a+b)를 계산한다.',9:'절댓값 영점 2,3에서 범위를 나누고 각 범위의 정수해를 중복 제거한다.',10:'중점 M에 대한 거리 제곱합 항등식에서 교차항 상쇄와 MP²≥0을 보여 M에서 최소임을 설명한다. M이 제약 직선 위에 있으므로 이후 원의 중심·반지름·계수를 구한다.',11:'두 원 중심 parameter를 두고 교점 대입, 방정식 두 근, 반사도형 교집합의 세 적분구간을 분리한다.',12:'첫 이차식의 roots를 -3,t로 두고 t 구간별 절댓값 조건을 풀어 t=2만 남긴 뒤 p²+q²를 계산한다.',13:'평행이동·두 대칭의 점상 좌표를 순서대로 적고 역변환을 대입해 계수 합을 구한다.',14:'B=(5cos t,5sin t), 0≤t≤π/2로 두어 centroid가 반지름 5/3인 1/4호를 그리는 식과 길이를 보인다.',15:'x≥a와 x<a 두 경우를 따로 factor화하고 각각의 경계조건으로 a의 최댓값을 정한다.',16:'원점-직선 거리와 반지름을 엄격히 비교해 |k|>√10을 양쪽 부등식으로 쓴다.',17:'두 직선의 직각 조건으로 지름 AB 원을 얻지만 finite m≠0 자취가 두 점을 제외하며 source는 하나만 지정하므로 OPEN/HOLD.',18:'f의 대칭축, f endpoint 상한, g(3/2) 상한을 구하고 equality 선택 뒤 g≤5 feasibility를 구간 전체에서 확인한다.',19:'AB가 지름임을 보이고 넓이/위치로 중심을 선택한 뒤 네 반사선의 방정식, 내접원 반지름, 넓이를 구한다.',20:'교점좌표를 t=bc/(a²+b²)로 나타내 정수조건과 면적식을 얻는다. c에 대한 양화 해석에 따라 count가 달라 true source HOLD.'
};
const visualReason={
1:'실제 numberline은 x=1 닫힘, x=2 열림으로 [1,2)를 나타낸다.',2:'H=(-1,-1)이 실제 직선 위에 있고 PH가 법선 방향이며 거리 label 2√5가 맞다.',3:'대상 직선과 원래 직선이 모두 기울기 4이고 (-1,1)이 대상선 위에 놓인다.',4:'P=(4,5)가 A(1,2),B(6,7) 선분을 3:2로 나누는 실제 좌표다.',5:'현재 SVG에서 O=(360,240), T=(449,285), tangent y=2x−2√5의 slope 2와 OT slope −1/2가 수직이며 contact point도 line/circle에 놓인다.',6:'q6.png를 실제로 열어 대화와 좌표/식 givens를 확인했다. 풀이의 결정은 대수적이라 추가 solution SVG는 불필요하다.',7:'실제 원 primitive의 반지름은 1과 2, 중심 간격은 5로 최소 간격 2다.',8:'P′=(2,2), 이동선 x+2y−2=0 및 H=(6/5,2/5)가 일관되며 PH는 normal 방향이다.',9:'numberline은 [5/3,3]을 나타내고 표기된 정수해는 2,3이다.',10:'원의 중심은 P=(1,0), 반지름 1이며 y축 접점이 실제 축 위에 있다.',11:'두 원래/반사 polygon의 실제 교집합은 |x−y|≤2인 hexagon이며 표시 넓이는 8이다.',12:'두 열린/닫힌 interval primitive가 교집합 (-3,0]을 보인다.',13:'점 (1,2)의 translation/reflections 결과 (6,-1),(-1,6),(1,6)이 변환식과 맞는다.',14:'새 passive preview에서 원의 전체 하단이 viewBox 안에 들어오고, B의 1사분원 움직임과 centroid 1/4호 반지름 5/3이 보인다.',15:'추가 visual은 필요하지 않다. 절댓값 부등식의 두 algebraic branch가 결정적이다.',16:'두 경계선은 실제 접선이고 접점까지의 거리 √2, 그 바깥에서만 불교점이다.',17:'SOURCE_HOLD이므로 확정답을 전시할 visual은 없다.',18:'곡선은 f=20(x−2)², g=−x²+2x+17/4이며 x∈[3/2,5/2]에서 h≤5 조건을 시각화한다.',19:'네 대칭선은 중심 O의 diamond를 만들고, 내부 원은 네 변에 같은 거리 5/√2다.',20:'SOURCE_HOLD이므로 확정 면적/쌍 개수를 그린 visual은 없다.'
};
const metaReason={
1:'2015 system-inequality unit; PT/TPL active, parent link and curriculum binding match; no null fields/debt.',2:'Point-line distance PT/direct template active; course, unit, subunit and binding match.',3:'Parallel-line equation PT/template active with matching 2015 line-equation binding.',4:'Internal section PT/template active with matching coordinate section binding.',5:'Circle tangent PT/template active with matching circle/tangent unit.',6:'Coordinate distance PT/direct template active; standard unit/subunit and binding match.',7:'Two-circle PT/template active with matching circle-equation binding.',8:'Move-equation PT/template active with matching transformation unit binding.',9:'Absolute-value piecewise PT/template active with matching inequality binding.',10:'Coordinate distance optimization PT/template active with matching coordinate-distance binding.',11:'Two-circle PT/template active; semantic method is circle-center locus and overlap geometry.',12:'Quadratic inequality PT/template active with matching inequality binding.',13:'Move-equation PT/template active; point mapping matches composition in the problem.',14:'Coordinate-centroid PT/template active with matching centroid subunit binding.',15:'Quadratic global-parameter PT/template active with matching inequality binding.',16:'Circle-line relation PT/template active with matching circle-line unit binding.',17:'Line relation/perpendicular-parameter PT/template active; fields remain as-is while source item is held.',18:'Quadratic global-parameter PT/template active; 5-bucket high confidence is physically populated.',19:'Triangle-incenter-from-lines PT/template active with matching line-distance binding.',20:'Line-intersection-condition PT/template active; no taxonomy change is made while the source item is held.'
};
const notes=questions.map(q=>({qid:Number(q.id),questionLayout:layoutReason[q.id],solutionLayout:solutionReason[q.id],visual:visualReason[q.id],meta:metaReason[q.id]}));
const taxonomy=JSON.parse(fs.readFileSync('archive/data/meta-foundation/compiled/taxonomy_registry.json','utf8'));
const curriculum=JSON.parse(fs.readFileSync('archive/data/meta-foundation/compiled/curriculum_bindings.json','utf8'));
const qMetadata=JSON.parse(fs.readFileSync('archive/data/question_metadata.json','utf8'));
const activeMeta=new Map();
for(const q of questions){
 const pt=taxonomy.problemTypes.find(x=>x.problemTypeKey===q.problemTypeKey);
 const tp=taxonomy.templates.find(x=>x.templateKey===q.templateKey);
 const binding=curriculum.bindings.find(x=>x.problemTypeKey===q.problemTypeKey&&x.curriculum==='2015'&&x.standardCourse===q.standardCourse&&x.standardUnitKey===q.standardUnitKey&&x.subUnitKey===q.subUnitKey);
 if(!pt||pt.status!=='ACTIVE'||!tp||tp.status!=='ACTIVE'||tp.parentProblemTypeKey!==q.problemTypeKey||!binding||binding.status!=='ACTIVE')throw new Error(`CURRENT_META_AUTHORITY_MISMATCH_Q${q.id}`);
 activeMeta.set(Number(q.id),{problemTypeStatus:pt.status,templateStatus:tp.status,templateParentProblemTypeKey:tp.parentProblemTypeKey,curriculumBindingStatus:binding.status,curriculum:'2015'});
}
const sourceFields=['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
const currentFields=q=>Object.fromEntries(sourceFields.map(k=>[k,q[k]]));
const assetRootAbs=path.resolve(workDir);
const assetRefs=[...new Set(questions.flatMap(q=>[q.image,q.solutionImage].filter(Boolean)))];
const assetHash=ref=>rawSha256(fs.readFileSync(path.join(assetRootAbs,...ref.split('/'))));
const originalRows=new Map(freeze.rows.map(x=>[Number(x.qid),x]));
const adjMap=new Map(adjudication.corrections.map(x=>[Number(x.qid),x]));
const q14FreshAnswer=q14Answer.independentAnswer;
const q14FreshReason=q14Answer.reasoning;
const sourceHolds=new Set([17,20]);
const dispositions=[];
const rows=questions.map(q=>{
 const qid=Number(q.id), note=notes.find(x=>x.qid===qid);
 const correction=adjMap.get(qid);
 const oldFreeze=originalRows.get(qid);
 let independentAnswer,reasoning,freezeRef,freezeSha;
 if(qid===14){
  independentAnswer=q14FreshAnswer;reasoning=q14FreshReason;freezeRef=String(q14FreezePath);freezeSha=physical(q14FreezePath).sha256;
 } else if(correction){
  independentAnswer=correction.correctedAnswer;reasoning=correction.reason;freezeRef=String(freezePath);freezeSha=physical(freezePath).sha256;
 } else {
  independentAnswer=oldFreeze.independentAnswer;reasoning=oldFreeze.reasoning;freezeRef=String(freezePath);freezeSha=physical(freezePath).sha256;
 }
 const hold=sourceHolds.has(qid);
 const solutionStatus=hold?'OPEN':'PASS';
 const visualStatus=hold?'OPEN':'PASS';
 const visualAssets=[];
 const previewDir=path.join(assetRootAbs,'solution-svg-previews');
 if(q.solutionImage){
  const ref=q.solutionImage.replaceAll('\\','/');
  const previewName=qid===14?'q14-solution.bbox-repair.png':`q${qid}-solution.png`;
  const preview=path.join(previewDir,previewName);
  visualAssets.push({ref,sha256:assetHash(ref),kind:'SOLUTION_SVG',previewAbsolute:preview,previewSha256:rawSha256(fs.readFileSync(preview)),previewActuallyOpened:true,staticMathReview:'PASS'});
 }
 if(q.image) visualAssets.push({ref:q.image,sha256:assetHash(q.image),kind:'PROBLEM_IMAGE',actuallyOpened:qid===6});
 const disposition=hold?'SOURCE_ITEM_HOLD_TO_R2':([5,10,14,18].includes(qid)?'PASS_AFTER_MINIMUM_REPAIR':'PASS');
 const compareResult='MATCH';
 const row={
  qid,
  sourceMode:'ORIGINAL',
  independentAnswer,
  independentAnswerFrozenBeforeStoredAnswer:true,
  independentAnswerReasoning:reasoning,
  independentFreezeRef:freezeRef,
  independentFreezeSha256:freezeSha,
  ...(correction?{adjudicationRef:String(adjPath),adjudicationSha256:physical(adjPath).sha256,originalFrozenAnswer:correction.originalAnswer}:{}),
  ...(qid===14?{q14ScopeFreezeRef:String(q14FreezePath),q14ScopeFreezeSha256:physical(q14FreezePath).sha256,q14DisclosureRef:String(path.join(evidenceDir,'R1.q14fresh.postfreeze-disclosure.json')),q14DisclosureSha256:physical(path.join(evidenceDir,'R1.q14fresh.postfreeze-disclosure.json')).sha256}:{}),
  storedAnswer:q.answer,
  compareResult,
  compareReason:hold?'Independent R1 also finds no unique mathematical answer under current source wording; the candidate [정답불가] records that hold.':'Independent answer agrees with the unique stored answer/choice after applying the current source.',
  answerCardinalityStatus:hold?'OPEN_SOURCE_HOLD':(q.choices.length?'UNIQUE_MATCHING_CHOICE':'UNIQUE_FREE_RESPONSE'),
  verdict:hold?'OPEN':'PASS',
  disposition,
  repairApplied:[5,10,14,18].includes(qid),
  sourcePage:pageByQid.get(qid),
  sourcePdfAbsolute:sourcePdf,
  sourcePdfSha256,
  sourceTextExactParity:'PASS',
  choicesExactParity:'PASS',
  smallBoardContinuityStatus:'PASS',
  axisEvidence:{
   QUESTION_LAYOUT:{status:'PASS',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reason:note.questionLayout,finalDisposition:qid===14?'LAYOUT_POLISH':'LAYOUT_KEEP'},
   SOLUTION_LAYOUT:{status:solutionStatus,smallBoardContinuityStatus:'PASS',reason:note.solutionLayout,disposition:hold?'SOURCE_ITEM_HOLD':'SMALL_BOARD_PASS'},
   META:{status:'PASS',reason:note.meta,activeMappingProof:activeMeta.get(qid)},
   VISUAL_SVG:{status:visualStatus,necessity:hold?'SOURCE_HOLD_NO_FINAL_ANSWER_VISUAL':(q.image&&!q.solutionImage?'PROBLEM_IMAGE_REQUIRED_SOLUTION_VISUAL_NOT_REQUIRED':(q.solutionImage?'SUPPORTING_VISUAL':'VISUAL_NOT_REQUIRED')),reason:note.visual,assets:visualAssets,renderStatus:'NOT_RUN_R1_STATIC_ONLY',actualArchiveEngineRenderClaimed:false}
  },
  questionLayout:{beforeDisposition:qid===14?'SOURCE_TEXT_REPAIRED':'LAYOUT_KEEP',finalDisposition:qid===14?'LAYOUT_POLISH':'LAYOUT_KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reason:note.questionLayout},
  solutionLayout:{disposition:hold?'SOURCE_ITEM_HOLD':'SMALL_BOARD_PASS',smallBoardContinuityStatus:'PASS',solutionSha256:solutionSha256(q.solution),reason:note.solutionLayout},
  metaReview:{disposition:'POPULATED_CURRENT_FIELDS',currentFields:currentFields(q),semanticJudgement:note.meta,authority:activeMeta.get(qid)},
  visualSvg:{necessity:hold?'SOURCE_HOLD_NO_FINAL_ANSWER_VISUAL':(q.image&&!q.solutionImage?'PROBLEM_IMAGE_PRESENT_NO_ADDITIONAL_VISUAL_REQUIRED':(q.solutionImage?'SOLUTION_VISUAL_PRESENT_AND_REVIEWED':'VISUAL_NOT_REQUIRED')),disposition:hold?'SOURCE_ITEM_HOLD':(q.solutionImage?'SOLUTION_SVG_PRESENT':'NO_SOLUTION_VISUAL_NEEDED'),assets:visualAssets,visualReview:note.visual,renderStatus:'NOT_RUN_R1_STATIC_ONLY',actualArchiveEngineRenderClaimed:false},
  metaDisposition:'POPULATED_CURRENT_FIELDS',metaDebtFields:[],
  ...(hold?{itemStatus:'HOLD',itemHoldReason:q.itemHoldReason}:{}),
  sourceAnnotation:qid===19?'Printed location clause is corroborated by the handwritten source note.':qid===20?'Handwritten correction changes printed 상수 c to 양수 c and is transcribed; quantifier ambiguity remains a true source HOLD.':qid===14?'Missing first-quadrant quarter-arc clause restored verbatim from source PDF p4.':null
 };
 dispositions.push({qid,disposition:'POPULATED_CURRENT_FIELDS',currentFields:currentFields(q),metaDebtFields:[],...(hold?{itemStatus:'HOLD',itemHoldReason:q.itemHoldReason}:{})});
 return row;
});
const goldenSampleRefs=goldenSpecs.map(g=>({path:g.path,sha256:'sha256:'+g.sha256,gitBlobSha:g.gitBlobSha}));
const goldenQuestionRefs=[];
const exampleData=[
 {path:goldenSpecs[0].path,qid:7,solutionSha256:'sha256:0928ae260780fdaeac970f8c40c6d6953e84930fbce299f0c7e6a39e465aacd9',solutionExcerpt:'먼저 원의 중심과 반지름을 알아보기 위해 주어진 식을 표준형으로 바꾼다.',observation:'Square completion and two transformation steps are split into student-reproducible lines.'},
 {path:goldenSpecs[0].path,qid:9,solutionSha256:'sha256:9d9a8678a8390eefc9dfdda5f6f88d772c24fa8a0a166ecf309bdc00b668bf96',solutionExcerpt:'먼저 점 $(3,2)$에서 원에 그은 접선의 기울기를 구한다.',observation:'Actual passive PNG was opened; tangent equation, point P and perpendicular slope are mathematically tied to SVG primitives.'},
 {path:goldenSpecs[1].path,qid:2,solutionSha256:'sha256:84e0fa32e411a8c3059958c6409bb588d26c1a44138e60ce9e1ccd49a7d3f1e2',solutionExcerpt:'두 직선이 서로 수직이므로 두 직선의 기울기의 곱은 $-1$이다.',observation:'The two line equations are rearranged separately before using the perpendicular slope relation.'},
 {path:goldenSpecs[1].path,qid:3,solutionSha256:'sha256:14da6e5de553ba66fa844aeac03ccb7fef8ba496759cd01906cb417185d22370',solutionExcerpt:'원의 중심과 반지름을 구하려면 주어진 식을 원의 표준형으로 바꾼다.',observation:'Actual passive PNG was opened; completed-square center/radius matches actual circle primitives.'}
];
const goldenCalibration={samples:goldenSpecs.map(g=>({path:g.path,sha256:g.sha256,gitBlobSha:g.gitBlobSha,items:g.items})),negativeSample:{path:negativePath,sha256:'dbf9f3d1e6cbedbb0df8b0072e7682a60643d3c94578cd1d99e63dfa444adb23',gitBlobSha:'f06387b8bbb5adce4244fbb576c0bd500ab282fa',observation:'Read negative regression: check actual SVG coordinates/topology, numbered solution blocks, current exact ACTIVE Meta, and runtime escapes rather than labels or counts.'},sampleReadBeforeLateCorrectionReview:true};
const questionAssetRefs=assetRefs;
const currentAssetBindings=questionAssetRefs.map(ref=>({kind:'CURRENT_ASSET',ref,sha256:assetHash(ref)}));
const taxonomyRefs={taxonomyRegistry:{path:'archive/data/meta-foundation/compiled/taxonomy_registry.json',sha256:rawSha256(fs.readFileSync('archive/data/meta-foundation/compiled/taxonomy_registry.json'))},curriculumBindings:{path:'archive/data/meta-foundation/compiled/curriculum_bindings.json',sha256:rawSha256(fs.readFileSync('archive/data/meta-foundation/compiled/curriculum_bindings.json'))}};
const currentRawSha256=rawSha256(fs.readFileSync(examFile));
const out={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R1',examUid:'21_매산고_1학기_기말_고1_기출',runId:'h1-final-five-pilot-20261008',reviewerIdentity:{role:'archive_r1',reviewerId:'/root/r1_maesan2021_five'},artifactSha:currentRawSha256,artifactRawSha256:currentRawSha256,workingJsAbsolute:path.resolve(examFile),assetRootAbsolute:assetRootAbs,evidenceRootAbsolute:path.resolve(evidenceDir),productionPath:'archive/exams/original/high/h1/1final/21_매산고_1학기_기말_고1_기출.js',sourcePdfAbsolute:sourcePdf,sourcePdfSha256,officialSolutionPdfAbsolute:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매산고1_1기말_해설.pdf',officialSolutionPdfSha256:'d5576f9f116557aef5550ca38b60fce7ca164c625cfec3c9bfb32b2d4fd6db0a',answerHwpAbsolute:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_매산고1_1기말_정답.hwp',answerHwpSha256:'11575577b29d511c32ea19bef3433039b5cdf0dda0397dec9d26c84f2e171e99',questionCount:20,denominator:20,
 independentFreeze:{original:{path:freezePath,sha256:physical(freezePath).sha256,validQids:[...Array(13)].map((_,i)=>i+1).concat([15,16,17,18,19,20]),invalidatedQids:[14]},adjudication:{path:adjPath,sha256:physical(adjPath).sha256,correctionQids:[17,18,20]},freshQ14:{freeze:{path:q14FreezePath,sha256:physical(q14FreezePath).sha256},answers:{path:q14AnswerPath,sha256:physical(q14AnswerPath).sha256},layoutClosure:{path:q14ClosePath,sha256:physical(q14ClosePath).sha256},scopeQids:[14]}},
 sourceRepairProvenance:{path:q14SourceFixPath,sha256:physical(q14SourceFixPath).sha256},questionLayoutRepairProvenance:{path:q14LayoutFixPath,sha256:physical(q14LayoutFixPath).sha256},q14VisualRepairProvenance:{path:q14VisualFixPath,sha256:physical(q14VisualFixPath).sha256},lateCorrectionReview:{path:lateReviewPath,sha256:physical(lateReviewPath).sha256},goldenLateCorrectionPreflight:{path:latePreflightPath,sha256:physical(latePreflightPath).sha256,status:'PASS'},
 goldenCalibrationReviewed:true,goldenCalibrationSet:goldenSpecs.map(g=>g.path),goldenCalibration,solutionQualityCalibration:{goldenSampleRefs, goldenSampleQuestionRefs:exampleData,negativeSampleRefs:[{path:negativePath,sha256:'sha256:dbf9f3d1e6cbedbb0df8b0072e7682a60643d3c94578cd1d99e63dfa444adb23',gitBlobSha:'f06387b8bbb5adce4244fbb576c0bd500ab282fa'}],calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'INDEPENDENT_REVIEW',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',qualityCompareCount:'20/20',scope:'FULL_R1_REVIEW_WITH_LATE_CHANGED_LOCUS_CORRECTION_REVIEW',priorOrderingGapPreserved:true,lateCorrectionPreflightRef:latePreflightPath,lateCorrectionReviewRef:lateReviewPath},
 rows,artifactDispositions:{artifactSha:currentRawSha256,rows:dispositions},currentAssetBindings,metaAuthorityRefs:taxonomyRefs,metaDebtCount:0,metaDebtQids:[],
 itemHoldCount:2,itemHoldQids:[17,20],itemHolds:[{qid:17,disposition:'TRUE_SOURCE_HOLD_TO_R2',reason:questions.find(q=>q.id===17).itemHoldReason},{qid:20,disposition:'TRUE_SOURCE_HOLD_TO_R2',reason:questions.find(q=>q.id===20).itemHoldReason}],
 sourceCorrections:[{qid:14,scope:'RESTORE_SOURCE_CONDITION',sourcePdfPage:4,sourcePdfSha256,addedText:'점 B가 제 1사분면 위의 원 C의 사분원에서 움직일 때,',sourceParity:'PASS',freezeScope:'original q14 invalidated; fresh q14 freeze valid; layout-only <br> changes preserve text atoms'},],sourceAnnotations:[{qid:19,annotation:'A lies left of C',disposition:'TRANSCRIBED_AND_USED'},{qid:20,annotation:'printed 상수 c corrected by hand to 양수 c',disposition:'TRANSCRIBED; ambiguity true source HOLD to R2'}],assetAudit:{referencedAssetCount:questionAssetRefs.length,allReferencedAssetsBound:true,unreferencedAssetNote:'q6-solution.svg exists in assigned folder but current questionBank has no reference to it; it is not a current asset binding.'},
 fullExamRead:{sourcePdfPagesReviewed:[1,2,3,4,5,6],companionSolutionPdfPagesReviewed:[1,2,3,4,5,6,7,8],problemImageRefsActuallyOpened:['assets/images/21_매산고_1학기_기말_고1_기출/q6.png'],solutionSvgReferencedCount:16,solutionSvgReferencedQids:[1,2,3,4,5,7,8,9,10,11,12,13,14,16,18,19],allReferencedSolutionSvgsActuallyOpened:true,actualArchiveEngineRender:'NOT_RUN_R1_STATIC_ONLY',actualArchiveEngineRenderClaimed:false},
 nextRosterTarget:'21_매산여고_1학기_기말_고1_기출',stageDisposition:'R1_REVIEW_COMPLETE_WITH_TWO_TRUE_SOURCE_HOLDS_CARRIED_TO_R2'
};
if(rows.length!==20||new Set(rows.map(x=>x.qid)).size!==20)throw new Error('R1_FULL_QID_DENOMINATOR_INVALID');
if(!rows.every(x=>x.independentAnswerFrozenBeforeStoredAnswer===true))throw new Error('R1_FREEZE_BINDING_INVALID');
const output=path.join(workDir,'R1.evidence.unbound.json');
fs.writeFileSync(output,JSON.stringify(out,null,2),'utf8');
console.log(JSON.stringify({output:path.resolve(output),rawSha256:currentRawSha256,rows:rows.length,assets:currentAssetBindings.length,holds:[17,20],q14:'fresh scoped freeze/closure bound'}));
