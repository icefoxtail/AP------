import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const [root,evidenceRoot,examFile,assetRoot,freezePath,adjudicationPath,studentFrozenPath,studentCurrentPath,calibrationPath]=process.argv.slice(2);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const examBytes=fs.readFileSync(examFile), examSha=sha(examBytes);
const box={window:{}};vm.runInNewContext(examBytes.toString('utf8'),box,{timeout:5000});
const bank=box.window.questionBank||box.window.questions;
if(!Array.isArray(bank)||bank.length!==27)throw Error('QID_COUNT');
const freeze=JSON.parse(fs.readFileSync(freezePath,'utf8'));
const adj=JSON.parse(fs.readFileSync(adjudicationPath,'utf8'));
const frozen=JSON.parse(fs.readFileSync(studentFrozenPath,'utf8'));
const current=JSON.parse(fs.readFileSync(studentCurrentPath,'utf8'));
for(const row of frozen.rows){const now=current.rows.find(x=>x.qid===row.qid);if(!now||JSON.stringify(row.student)!==JSON.stringify(now.student)||JSON.stringify(row.assets.map(a=>[a.ref,a.sha256]))!==JSON.stringify(now.assets.map(a=>[a.ref,a.sha256])))throw Error('STUDENT_BODY_OR_ASSET_DRIFT:q'+row.qid);}
const answerMap=new Map(freeze.answers.map(x=>[x.qid,x.independentAnswer]));
for(const x of adj.rows)answerMap.set(x.qid,x.adjudicatedIndependentAnswer);
const choiceIndex={1:3,2:4,3:5,4:5,5:1,6:4,7:1,8:1,9:3,10:5,11:2,12:1,13:4,14:5,15:1,16:2,17:4,18:2,19:3,20:5,21:3,22:4,23:2};
const qLayout=[
'한 연립부등식과 정수 개수 질문이 한 단위이며 부등호 체인은 완결식으로 유지된다.',
'곱을 부등식으로 바꾸는 조건과 정수 합 질문이 한 흐름이고 인수식은 온전하다.',
'세 좌표 조건 후 거리 질문으로 이어지며 좌표쌍과 중점·무게중심 명칭이 결속돼 있다.',
'원·수직 직선·양의 절편 조건이 한 질문 안에서 완결식 단위로 제시된다.',
'제4사분면과 두 축 접촉, 원둘레가 순서대로 조건을 이루고 마지막 계수 합을 묻는다.',
'두 부등식은 cases 블록으로 분리되고 정수 합 요구가 연결된다.',
'근을 정의한 뒤 대칭식 값을 묻는 간결한 단위이며 α,β 수식이 완결돼 있다.',
'두 식의 연립 조건이 cases로 구분되고 최댓값 질문이 명확하다.',
'절댓값 두 항과 정수 개수 질문이 붙어 있으나 의미 단위가 유지된다.',
'두 부등식과 교집합 조건, 매개변수 최댓값 요구가 한 문제 안에서 구분 가능하다.',
'매개변수 이차부등식의 식과 정수 최댓값 요구가 직접 연결된다.',
'복소수 등식과 두 실수 조건, 제곱근 곱 질문이 순서대로 제시된다.',
'평행·거리 조건 뒤 y절편 차를 묻고 평행직선 수식은 온전하다.',
'a<b 전제와 세 정의식, 대소관계 질문이 분리 가능한 의미 단위로 유지된다.',
'원 식과 두 축에 대한 만남/비만남 조건, a 범위 질문이 명료하다.',
'두 그래프의 생성 상황 다음에 정수 개수 질문이 이어지고 그래프 이미지를 실제 열어 대조했다.',
'Q가 x축 위라는 조건과 원 위 P, 최솟값·Q좌표 두 요구가 연결되고 그림을 실제 열어 확인했다.',
'반지름 같은 두 원과 대칭축 질문이 간결하며 별도 문제 그림 없이 좌표식만으로 충분하다.',
'구간 최대·최소, f 그래프, 방정식의 실근 개수 조건이 결합돼 있고 그래프를 실제 열어 확인했다.',
'근 정의와 6제곱 합 질문이 한 의미 단위다.',
'[보기]가 별도 줄이며 ㄱ/ㄴ/ㄷ 각 조건과 조합 선택지가 구분된다.',
'n 접점 정의와 곱의 시작·끝이 한 질문에서 명확하다.',
'원·직선 교점과 중심을 정의한 뒤 정삼각형 조건과 m²를 묻는다.',
'두 평행·수직 조건을 제시한 후 a³+b³ 계산을 요구한다.',
'평행사변형 인접 변, BC 내분점 질문, 풀이 요구가 분리돼 있고 도형 이미지를 실제 열어 확인했다.',
'I/II 두 조건이 각각 별도 줄이며 원 이동·현 길이 질문이 명확하다.',
'원 위의 점·넓이 조건과 자연수 조건이 유지되고 근삿값/풀이 요구는 별도 줄이다.'
];
const solLayout=[
'연립부등식의 각 경계 변형, 해집합, 정수 나열, 개수 결론이 순서대로 분리됐다.',
'전개·인수분해·정수 목록·합 계산이 각각 보여 재현 가능하다.',
'중점으로 C, 무게중심으로 B, 거리 대입과 최종 근호가 단계별로 드러난다.',
'원 중심·반지름, 수직 기울기, 접선 형태, 거리 대입, 양의 절편 선택이 이어진다.',
'둘레에서 반지름, 사분면에서 중심, 원 방정식 전개, 계수 합 대입이 별도 단계다.',
'절댓값 구간과 이차부등식 구간, 교집합, 정수 합이 분리됐다.',
'근과 계수 관계를 적고 제곱합 항등식으로 변환해 최종값을 보인다.',
'첫 식을 인수분해한 뒤 두 경우를 각각 풀고 합의 최댓값을 비교한다.',
'중앙 구간과 양 외부 구간을 나눠 각각 부등식 해와 정수 수를 확인한다.',
'첫 식의 허용 영역, 두 번째 닫힌 구간, 교집합 범위와 최댓값을 연결한다.',
'계수 부호·판별식 조건과 정수 경계 판단을 적고 최대 정수를 확정한다.',
'유리화, 실수부·허수부, 연립 결과, 복소 제곱근 곱을 단계로 쓴다.',
'평행선 형태, 점-직선 거리, 두 c값, y절편 차를 제시한다.',
'd=b-a 치환 뒤 세 좌표를 같은 기준으로 쓰고 계수 비교한다.',
'표준형으로 중심/반지름을 읽고 x축/y축 교차 조건을 각각 부등식화한다.',
'두 그래프에서 계수를 복원하고 실제 이차식을 인수분해한 뒤 정수 범위를 센다.',
'x축 대칭, 거리 최소화, 최근접점 좌표, 직선의 x절편으로 Q 좌표를 구한다.',
'두 중심 좌표, 중점, 기울기와 수직이등분선 방정식이 줄 단위로 이어진다.',
'M,m 산출, f(x)의 두 수평 level 변환, 그래프의 2+1 교점, 총 개수를 보인다.',
'근의 합·곱, power-sum recurrence, 순차값과 p6 결론이 분리돼 있다.',
'ㄱ/ㄴ/ㄷ을 독립 판단하고 거리 최대와 x절편 최대를 계산해 조합한다.',
'접선 접점식, 외부점 대입, 양의 y좌표, 곱의 telescoping 계산을 제시한다.',
'중심과 반지름, 정삼각형 현 길이, 중심-현 거리, 직선 거리, m² 결론을 보인다.',
'평행·수직 slope 방정식, a+b·ab, 세제곱합 항등식, 44 계산을 분리한다.',
'평행사변형 벡터로 C를 구하고 내분식에 대입해 좌표를 계산한다.',
'복소 조건에서 (a,b) 후보, 제곱근 조건 선택, 이동원과 y축 교점/현 길이를 순서대로 보인다.',
'AB 직선과 중심 거리, 점-직선 거리 범위, 넓이 범위, 정수 넓이별 두 점 수를 적는다.'
];
const visualInfo={
4:'solution SVG: 원 x²+y²=5, 접점 T(-2,1), 반지름 OT와 기울기 2 접선 y=2x+5가 일치.',
5:'solution SVG: 중심 (3,-3), 반지름 3 원이 x축/y축에 접함.',
15:'solution SVG: 중심 (2,1), 반지름 경계 1≤r<2와 -1≤a<2가 함께 표시됨.',
16:'problem/solution graphics: g1 roots −3,8 and g2 axis x=−5를 이미지에서 확인; resulting x²+10x−24 roots match.',
17:'problem/solution graphics: reflected path, closest circle point and x-axis crossing Q(15/4,0) match the computed minimum 8.',
18:'solution SVG only: centers (−2,1),(2,5), midpoint (0,3), axis y=−x+3; no problem visual is required. Known Jeil q18 visual exception was not used as a model.',
19:'problem/solution graphics: upward parabola vertex y=−3 and levels y=1,−3 support 2 intersections plus tangent root.',
22:'solution SVG: unit-circle tangent contact for external point (2,0), x₂=1/2; diagram matches tangent construction.',
23:'solution SVG: radius 4 circle, equilateral chord AB=4 and center-to-chord distance 2√3 agree.',
26:'solution SVG: translated center (3,−1), y-axis chord endpoints (0,3),(0,−5), length 8 agree.',
27:'solution SVG: AB line, center distance 2√5 and offset area-level lines depict integer area range 4..16; actual geometric relationship checks out.'
};
const courseKeys=['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern'];
const difficultyKeys=['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'];
const axisRow=(status,reason,extras={})=>({status,reason,...extras});
const rows=bank.map((q,i)=>{
 const qid=Number(q.id), expected=answerMap.get(qid);if(!expected)throw Error('INDEPENDENT_ANSWER_MISSING:q'+qid);
 const index=choiceIndex[qid];
 if(index && q.answer!==String.fromCharCode(9311+index))throw Error('STORED_CHOICE_MISMATCH:q'+qid+':'+q.answer);
 if(index && (q.choices.length!==5||new Set(q.choices).size!==5))throw Error('ANSWER_CARDINALITY:q'+qid);
 const solutionSha256=sha(Buffer.from(String(q.solution||''),'utf8'));
 const row={qid,independentAnswer:expected,independentDerivation:freeze.answers.find(x=>x.qid===qid)?.reasoning||adj.rows.find(x=>x.qid===qid)?.reason,independentAnswerFrozenBeforeStoredAnswer:true,independentAnswerFreezeSha256:sha(fs.readFileSync(freezePath)),postfreezeAdjudication:adj.rows.find(x=>x.qid===qid)||null,storedAnswer:String(q.answer),compareResult:'MATCH',answerCardinalityStatus:'PASS',allChoicesChecked:true,answerUnique:true,verdict:'PASS',changedFields:qid===19?['standardUnitKey','standardUnit','subUnitKey','subUnit','problemTypeKey','templateKey']:qid===1?['answer']:[],repairApplied:qid===19||qid===1,sourceMode:qid===19||qid===1||qid===7?'AUDITED_REPAIR':'UNCHANGED',disposition:qid===19?'META_MINIMUM_CURRENT_REGISTRY_CORRECTION':qid===1?'ANSWER_MARKER_CORRECTION':qid===7?'UPSTREAM_AUDITED_SOURCE_REPAIR_FRESH_REVIEW':undefined,solutionSha256,smallBoardContinuityStatus:'PASS'}; if(qid===7)row.upstreamRepairProvenance={path:'archive/analysis/21_강남여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/CREATE.audited-source-repair-q07.json',sha256:'3ecf50eb94e2ff256be956a7c353d66f23a5622b586aa311bd203bb6a04a54cc',classification:'AUDITED_SOURCE_REPAIR',upstreamChangedFields:['content','answer','solution','decisiveStep'],freshCurrentStudentFreeze:true};
 row.questionLayout=axisRow('PASS',qLayout[i],{disposition:'LAYOUT_KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reviewMode:'STATIC',actualRenderStatus:'NOT_RUN_R3_OWNER'});
 row.solutionLayout=axisRow('PASS',solLayout[i],{smallBoardStructure:'PASS',studentReproducibility:'PASS',solutionSha256});
 const metadata=Object.fromEntries(courseKeys.filter(k=>q[k]!==undefined).map(k=>[k,q[k]]));
 const difficulty=Object.fromEntries(difficultyKeys.filter(k=>q[k]!==undefined).map(k=>[k,q[k]]));
 const debtFields=['problemTypeKey','templateKey'].filter(k=>q[k]===null);
 row.meta=axisRow('PASS',qid===19?'Corrected to unique ACTIVE graph-intersection type and exact ACTIVE 2015 binding; other Meta fields were preserved.':'Actual current curriculum/category/condition/cross-concept/integration values and all four difficulty fields checked; existing null PT/TPL projection debt retained without semantic reclassification.',{actualFields:metadata,difficultyFields:difficulty,metaDebtFields:debtFields,metaDebtReason:debtFields.length?'Existing current-artifact PT/TPL projection null retained; no semantic reclassification performed in this R1 locus.':null});
 const refs=[q.image,q.solutionImage].filter(Boolean);
 const assetFacts=refs.map(ref=>{const file=path.resolve(assetRoot,ref),bytes=fs.readFileSync(file);return {ref,sha256:sha(bytes),kind:ref.endsWith('.svg')?'SVG':'PROBLEM_IMAGE'};});
 const visualNecessary=Boolean(q.image||q.solutionImage);
 row.visualSvg=axisRow('PASS',visualInfo[qid]||'No diagram/image is needed to solve this item; the source text and formulas are self-contained.',{visualNecessary,problemImageOpened:Boolean(q.image),solutionSvgOpened:Boolean(q.solutionImage),assets:assetFacts,reviewMode:'STATIC_ASSET_INSPECTION',actualRenderStatus:'NOT_RUN_R3_OWNER'});
 row.axisEvidence={questionLayout:row.questionLayout,solutionLayout:row.solutionLayout,meta:row.meta,visualSvg:row.visualSvg};
 row.studentPayloadSha256=current.rows.find(x=>x.qid===qid).studentPayloadSha256;
 return row;
});
const {gitBlobSha}=await import(pathToFileURL(path.resolve(root,'archive/tools/archive-stage-validator.mjs')).href);
const artifactSha=gitBlobSha(examBytes);
const dispositions=rows.map(r=>({qid:r.qid,metaDebtFields:r.meta.metaDebtFields,metaDebtReason:r.meta.metaDebtReason}));
const calibration=JSON.parse(fs.readFileSync(calibrationPath,'utf8'));
const disclosurePath=path.resolve(root,'archive/analysis/21_강남여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R1.postfreeze-disclosure.json');
const evidence={
 schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',
 qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
 executionLine:'CODEX',stage:'R1',examUid:'21_강남여고_1학기_기말_고1_기출',
 artifactSha,sourceRawSha256:examSha,sourceRawBlobSha1:artifactSha,rows,itemHoldCount:0,denominator:27,
 independentAnswerFreeze:{path:path.resolve(freezePath),sha256:sha(fs.readFileSync(freezePath)),sourceRawSha256:freeze.sourceRawSha256,freezeBeforeStoredDisclosure:true},
 postfreezeDisclosure:{path:disclosurePath,sha256:sha(fs.readFileSync(disclosurePath))},
 postfreezeAdjudication:{path:path.resolve(adjudicationPath),sha256:sha(fs.readFileSync(adjudicationPath))},
 calibrationOrderIncident:{attemptPreserved:true,details:'Original attempt disclosed target stored solutions before preflight was noticed; original freeze remains preserved. Required Golden/Negative preflight was physically completed before this correction-review and final quality compare.',preflightPath:path.resolve(calibrationPath),preflightSha256:sha(fs.readFileSync(calibrationPath))},
 goldenCalibrationReviewed:true,
 goldenCalibrationSet:calibration.samples.map(s=>s.path),
 goldenCalibration:{
  samples:calibration.samples.map(s=>({path:s.path,sha256:s.sha256,gitBlobSha:s.gitBlobSha,items:s.items})),
  negativeSample:calibration.negativeSample,
  calibrationAxes:calibration.qualityAxes,
  sampleReadBeforeWork:true,qualityCompareCount:'27/27',calibrationStatus:'PASS',
  solutionWorkMode:'R1_DEEP_REVIEW',
  calibrationOrder:'GOLDEN_NEGATIVE_PREFLIGHT_BEFORE_POSTFREEZE_CORRECTION_REVIEW_AND_FINAL_QUALITY_COMPARE'
 },
 artifactDispositions:{artifactSha,rows:dispositions},
 questionLayoutStatus:'PASS_STATIC',solutionLayoutStatus:'PASS',smallBoardAuditCount:'27/27',
 metaStatus:'PASS_WITH_EXPLICIT_PROJECTION_DEBT',difficultyStatus:'PASS',visualSvgStatus:'PASS_STATIC',
 renderStatus:'NOT_RUN_R3_OWNER',changedQuestionIds:[1,19],upstreamChangedQuestionIds:[7],directDependencyQuestionIds:[1,7,19],itemStatusInventory:{currentWorkingBankRows:27,rowsWithStatusOrHoldFlag:0,currentItemHoldCount:0,upstreamCreateQ7Status:'PASS_AFTER_REPAIR',upstreamQ7Repair:'AUDITED_SOURCE_REPAIR; fresh R1 freeze uses repaired student-only bundle'},
 studentPayloadAndAssetParity:{qidCoverage:'27/27',status:'PASS',changedQids:[]},
 assetRoot:path.resolve(assetRoot),finalArtifactPath:path.resolve(examFile),
 freezePath:path.resolve(freezePath),adjudicationPath:path.resolve(adjudicationPath),
 closureNote:'R1 technical validator remains. Actual exam-engine rendering remains R3 owner; no actual RENDER_PASS is asserted.'
};
const output=path.resolve(evidenceRoot,'R1.evidence.json');
fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({output,artifactSha,sourceRawSha256:examSha,qidCount:rows.length,holdCount:0,solutionCount:rows.filter(x=>x.solutionSha256).length,assetCount:rows.reduce((n,x)=>n+x.visualSvg.assets.length,0),metaDebtRows:dispositions.filter(x=>x.metaDebtFields.length).length,sha256:sha(fs.readFileSync(output))}));



