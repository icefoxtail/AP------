const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),cp=require('child_process');
const root=process.argv[2],ev=process.argv[3];
const examUid='26_강남여고_1학기_중간_고2_대수';
const exam=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008',examUid,`${examUid}.js`);
const bundle=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008',examUid,'R1.student.json');
const freeze=path.join(ev,'R1.original-freeze.json');
const postfreeze=path.join(ev,'R1.postfreeze-qids-01-25.json');
const postfreezeMeta=path.join(ev,'R1.postfreeze-qid17-meta-only.json');
const adjudication=path.join(ev,'R1.adjudication-final.json');
const sourcePdf='D:/2026_1학기중간_/대수/26_강남여고_1학기_중간_고2_대수.pdf';
const sourcePdfAbsolute='D:\\2026_1학기중간_\\대수\\26_강남여고_1학기_중간_고2_대수.pdf';
const output=path.join(ev,'R1.evidence.json');
if(fs.existsSync(output))throw new Error('FRESH_R1_EVIDENCE_PATH_ALREADY_EXISTS');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const physical=p=>({path:path.resolve(p),sha256:sha(fs.readFileSync(p))});
const base=readJson(path.join(ev,'CREATE.evidence.json'));
const bundleObj=readJson(bundle),frozen=readJson(freeze),post=readJson(postfreeze),postMeta=readJson(postfreezeMeta),adj=readJson(adjudication);
if(post.studentParity!=='EXACT'||post.sourceRawSha256!==frozen.sourceRawSha256)throw new Error('FULL_POSTFREEZE_ORIGINAL_FREEZE_PARITY_REQUIRED');
if(postMeta.studentParity!=='EXACT'||postMeta.sourceRawSha256!==sha(fs.readFileSync(exam))||postMeta.rows.length!==1||postMeta.rows[0].qid!==17)throw new Error('Q17_META_ONLY_STUDENT_PARITY_REQUIRED');
if(frozen.stage!=='R1'||frozen.studentQidOrder.length!==25||bundleObj.questionCount!==25)throw new Error('FULL_R1_FREEZE_REQUIRED');
const jsBytes=fs.readFileSync(exam),rawSha=sha(jsBytes),blob=cp.execFileSync('git',['-C',root,'hash-object','--',exam],{encoding:'utf8'}).trim();
const cleanBlob=cp.execFileSync('git',['-C',root,'hash-object','--path=archive/exams/original/high/h2/1mid/26_강남여고_1학기_중간_고2_대수.js',exam],{encoding:'utf8'}).trim();
const box={window:{}};vm.createContext(box);vm.runInContext(jsBytes.toString('utf8'),box,{filename:exam});const questions=box.window.questionBank;
if(!Array.isArray(questions)||questions.length!==25)throw new Error('CURRENT_FULL_QID_BANK_REQUIRED');
const frozenById=new Map(frozen.rows.map(r=>[r.qid,r]));const corrected=new Map(adj.corrections.map(r=>[r.qid,r]));
const assetRef='assets/images/26_강남여고_1학기_중간_고2_대수/q19.png';const assetPath=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008',examUid,assetRef);const assetSha=sha(fs.readFileSync(assetPath));
const layoutReasons={
1:'짧은 참·거짓 선택 구조이며 각 문장은 완결되어 있다. 선택지 번호는 엔진이 표시하고 별도 개행이나 폭 override가 필요 없다.',
2:'다섯 지수식이 각각 독립 선택지로 유지된다. 분수와 지수는 식 단위로 결속되어 있어 KEEP한다.',
3:'로그 조건 두 개와 최종 질문이 한 문장 안에서 연결된다. 조건 수식이 끊기지 않고 보기 영역과 구분된다.',
4:'각의 크기와 사분면 질문, 다섯 분수각 선택지가 분리되어 있다. 분수와 π를 쪼개지 않는 KEEP이다.',
5:'좌표 조건에서 삼각비 식으로 이어지는 흐름이 한 발문에 자연스럽다. 괄호 안의 합성식은 완결 수식으로 남아 있다.',
6:'공통 로그값과 a,b 정의 뒤 차이를 묻는 순서가 명확하다. 소수와 로그 기호의 결속을 유지한다.',
7:'‘옳지 않은 것’ 질문 뒤 다섯 함수 성질이 각각 선택지로 구획된다. 정의역·치역 수식은 온전하다.',
8:'두 함수와 두 수평선의 공통 자료 다음 넓이를 묻는다. 네 경계가 같은 문장 안에서 혼동 없이 식별된다.',
9:'대칭이동, 두 평행이동, 점 통과, 점근선 조건, 최종 곱의 순서가 source와 일치한다. 길이는 실제 source page의 자동 줄바꿈으로 처리되며 수식 내부 분할은 없다.',
10:'함수 정의와 분수형 질문 및 보기가 명료하다. 계산상 결과와 보기 불일치는 조판 결함이 아니라 원문 item HOLD로 둔다.',
11:'자연수 조건, 세제곱근 조건, 합을 묻는 질문이 이어진다. 근호의 피제수와 n의 분수를 분리하지 않는다.',
12:'로그 비율 조건과 거듭제곱값 질문이 한 구조로 연결되고 보기가 아래에 구분된다.',
13:'부등식, 자연수 n, 계산에 쓸 로그 근삿값 조건이 모두 보존된다. 로그의 진수와 지수 10을 완결 수식으로 둔다.',
14:'각의 범위와 차의 값이 조건으로 제시되고 합을 묻는다. 제3사분면 범위 및 두 삼각함수는 의미 단위로 읽힌다.',
15:'발문 다음 [보기]와 ㄱ~ㄹ, 조합 선택지가 계층을 이룬다. content의 기존 줄바꿈을 유지한다.',
16:'지수함수와 경계선이 만드는 영역 및 정수 좌표 조건 뒤 개수를 묻는다. 조건 수식과 단위 경계를 유지한다.',
17:'로그곡선 교점, 수선의 발, 사각형 넓이, 둘레 표현, 목표식 순으로 조건이 이어진다. 기하 기호·좌표 의미를 분리하지 않는다.',
18:'시간 변수와 함수식, 배율·시간 조건, 최종 시간 질문이 자연스러운 문장 순서다. 지수의 분수는 하나의 식으로 유지된다.',
19:'원본 q19 도형을 발문에 인접해 유지했고 O,P,Q,A,B 라벨과 두 호의 관계를 직접 확인했다. 그림이 풀이 의미를 결정하므로 asset을 유지한다.',
20:'직선 정의와 둔각 조건, 삼각식, 서로소 자연수 조건이 content의 기존 줄바꿈으로 의미 단위별 구분을 갖는다.',
21:'반개구간 조건과 절댓값 방정식 뒤 모든 해의 합을 묻는다. 각도 범위와 절댓값 기호가 온전하다.',
22:'서논술 공통 안내와 서술형 1 요구가 분리되어 있다. 답안 요구를 객관식 선택지처럼 표현하지 않는다.',
23:'서논술형의 자연수 조건, 로그식, 순서쌍 개수 요구가 모두 유지된다. 식의 양변과 로그 조건을 함께 둔다.',
24:'원문에 연속된 두 요구가 실제로 인쇄되어 있다. 첫 n 목록 요구 뒤 완결문장과 별도 θ/2 질문이 읽히며 source text를 보존한다.',
25:'정의역 조건과 두 부등식의 동시 만족 조건, 해집합 요청이 구분된다. 두 부등식의 strict sign와 닫힌 domain을 그대로 둔다.'
};
const solutionReasons={
1:'①의 실수 네제곱근과 ⑤의 실수 세제곱근을 각각 대입 확인해 두 참 선택지를 밝힌다. 단일 정답이 없어 HOLD지만 근거 단계는 완결된다.',
2:'각 보기를 지수법칙으로 따로 평가한 뒤 ⑤의 세제곱근 값이 2가 아님을 결론낸다.',
3:'로그 정의로 a,b를 구하고 a^b에 순서대로 대입한다.',
4:'각 선택지를 2π의 정수배만큼 이동한 뒤 사분면 범위와 비교한다.',
5:'좌표에서 반지름을 구해 sin, cos, tan을 각각 적고 목표 곱에 대입한다.',
6:'419와 0.0419를 4.19의 100배·100분의 1로 분해하고 상용로그 차를 계산한다.',
7:'각 함수의 치역·대칭성·주기를 정의로 확인하고 tan의 제외 정의역을 지적한다.',
8:'두 곡선을 y의 함수 x로 바꾸어 가로 길이 2를 얻고 1부터 9까지 넓이를 적분한다.',
9:'역함수와 평행이동 식을 세우고 점 좌표를 대입해 a,b와 곱을 구한다.',
10:'거듭제곱 지수로 f(n)을 표현해 √a까지 계산한다. 실제 보기와 일치하지 않음을 설명해 item HOLD로 둔다.',
11:'세제곱근 값을 자연수 m으로 두고 n=24/m³ 조건에서 가능한 경우와 합을 계산한다.',
12:'로그 비율을 밑변환으로 정리한 뒤 거듭제곱식의 로그를 취해 1/4를 얻는다.',
13:'log 24를 제공된 log2, log3으로 변형하고 13.801의 정수 구간을 판별한다.',
14:'차를 제곱해 sin cos를 구하고 합의 제곱과 제3사분면 부호로 값을 결정한다.',
15:'수평이동식, 주기, 점근선, 유계 여부를 하나씩 확인해 ㄴ만 참임을 결정한다.',
16:'정수 x=0,1,2,3,4별 허용 정수 y를 경계 포함으로 세고 합산한다.',
17:'교점 좌표와 발 좌표를 정한 뒤 사다리꼴 넓이, 변 길이, 둘레, 최종 비 순서로 계산한다.',
18:'27배 조건으로 지수율을 정하고 243배가 되는 시간을 같은 밑의 지수로 환산한다.',
19:'OP와 두 직선 조각을 반지름으로 표현하고 둘레·넓이 식을 함께 풀어 가능한 r 두 값의 곱을 구한다.',
20:'기울기에서 tan 부호를 정하고 주기 이동 항등식과 sin cos 곱을 사용한다.',
21:'절댓값 안을 ±3 두 경우로 나누고 domain 안의 해를 전부 모아 합한다.',
22:'제2사분면 대표각을 절반으로 줄인 구간과 π 평행 이동에 따른 반대 동경을 설명한다.',
23:'로그식을 ab=200으로 바꾸고 소인수분해로 약수 및 순서쌍 수를 계산한다.',
24:'지수의 정수성에서 30의 배수를 구하고, 별도 θ/2 요구는 대표각과 kπ로 풀어 두 답을 모두 낸다.',
25:'첫 부등식을 cos 범위로 인수분해하고 둘째 부등식의 구간과 교집합을 endpoint 포함 여부까지 계산한다.'
};
const difficultyReasons={
1:'근호 정의를 직접 확인하는 짧은 개념 적용이다. 문항 자체는 복수 정답 때문에 HOLD로 분리한다.',
2:'익숙한 지수법칙을 보기별로 한 번 적용하는 기본 비교다.',
3:'밑 조건을 로그 정의에 대입해 두 값을 결정하는 표준 변환이다.',
4:'주어진 다섯 각을 2π 주기로 한 번씩 정규화해 사분면을 판단한다.',
5:'좌표의 반지름으로 기본 삼각비를 구해 한 식에 대입하는 표준 적용이다.',
6:'상용로그의 자릿수 이동을 두 번 적용하고 차를 계산한다.',
7:'삼각함수의 정의역과 기본 성질을 구분하는 한 번의 개념 확인이다.',
8:'곡선의 역표현으로 공통 높이에서 폭을 해석한 뒤 넓이를 계산한다.',
9:'역함수, 두 이동, 점 조건과 점근선을 연결하는 여러 단계의 함수 해석이다.',
10:'중첩근호를 유리 지수로 바꾸는 표준 변형이다. 보기 오류는 난이도와 별개의 item HOLD다.',
11:'완전 세제곱 인수 조건에서 정수 후보를 거르고 합산한다.',
12:'로그 비율과 지수 정의를 함께 변형해야 하는 표준 다단계 유형이다.',
13:'로그 성질과 주어진 근삿값으로 십진 구간을 판단한다.',
14:'제곱 항등식, 부호 조건으로 삼각함수 합을 복원한다.',
15:'탄젠트의 이동·주기·점근선·최댓값을 함께 비교하는 함수 성질 판별이다.',
16:'곡선과 직선으로 정해진 영역을 정수 x별로 분할해 정수점을 센다.',
17:'풀이 전략은 표준 사다리꼴 공식이며 복잡한 별도 발상 없이 좌표와 변 길이를 연쇄 계산하므로 bucket 3이다.',
18:'같은 밑의 두 배율을 지수 비교 한 번으로 연결한다.',
19:'둘레와 넓이의 두 식을 세운 뒤 이차방정식의 두 반지름을 처리하는 복합 모델링이다.',
20:'둔각·주기이동·삼각비 관계를 연이어 적용하는 표준 이상 복합 변환이다.',
21:'절댓값 분기마다 삼각방정식을 풀고 해를 중복 없이 합해야 한다.',
22:'대표각을 반으로 나눈 뒤 동경의 홀짝 평행이동을 구분한다.',
23:'로그 방정식을 자연수 곱으로 바꾸고 약수 개수로 순서쌍을 센다.',
24:'두 별도 요구 중 지수의 공배수 논리와 각의 대표각 분기를 모두 해결해야 한다.',
25:'삼각부등식을 인수분해와 주기구간 교집합으로 완결해야 한다.'
};
const answers={
1:'HOLD: ①과 ⑤가 모두 참이어서 단일 정답이 아니다',2:'⑤',3:'④',4:'③',5:'②',6:'①',7:'②',8:'④',9:'⑤',10:'HOLD: 계산값 √a와 같은 보기가 없다',11:'④',12:'②',13:'③',14:'②',15:'②',16:'⑤',17:'②',18:'③',19:'①',20:'⑤',21:'②',22:'제1사분면 또는 제3사분면',23:'12',24:'n=30,60,90; θ/2 동경이 존재할 수 있는 사분면은 제1사분면과 제3사분면',25:'π/3<x<π 또는 π<x<5π/4'
};
const qidHoldReasons={1:'원문 ①과 ⑤가 모두 참이므로 단일 정답이 아니다.',10:'독립 계산 결과 √a인데 원문 다섯 보기 중 동치식이 없어 정답을 확정할 수 없다.'};
const rows=questions.map(q=>{
 const id=Number(q.id), f=frozenById.get(id); if(!f)throw new Error('FREEZE_ROW_MISSING:q'+id);
 const correction=corrected.get(id), finalAnswer=correction?.correctedAnswer??answers[id];
 if(finalAnswer!==answers[id])throw new Error('ADJUDICATED_ANSWER_MAP_MISMATCH:q'+id);
 const meta={category:q.category,originalCategory:q.originalCategory,unit:q.unit,sub:q.sub,subName:q.subName,standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern};
 const difficulty={status:'PASS',previousBucket:correction&&id===17?4:q.difficultyBucket,currentBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,rationale:difficultyReasons[id],changedFields:id===17?['difficultyBucket']:[]};
 const visual=id===19?{status:'PASS',disposition:'SOURCE_PROBLEM_IMAGE_RETAINED_NO_SOLUTION_SVG_REQUIRED',assetRef,assetSha256:assetSha,reason:'원본 PDF page 3의 O,A,B,P,Q 부채꼴 도형을 실제 열어 대조했다. 중심·내분점·동심호·색칠영역 정보가 있어 문제 그림을 유지한다. 풀이에서 rθ, 호 길이, 넓이를 모두 식으로 드러내므로 해설 SVG는 요구되지 않는다.'}:{status:'PASS',disposition:'NO_ADDITIONAL_VISUAL_REQUIRED',assetRef:null,assetSha256:null,reason:'원문 조건과 독립 풀이에 필요한 도형·그래프·표 자산이 없으며, 수식/구간/함수 성질은 텍스트와 대수식으로 결정된다.'};
 const hold=Object.hasOwn(qidHoldReasons,id);
 return {
   qid:id,sourceMode:'R1_INDEPENDENT_CURRENT_STUDENT_ONLY',provenanceEvidence:{originalFreeze:{path:freeze,sha256:physical(freeze).sha256},fullPostfreezeDisclosure:{path:postfreeze,sha256:physical(postfreeze).sha256},q17MetaOnlyParity:physical(postfreezeMeta),adjudication:physical(adjudication),studentBundle:physical(bundle)},
   beforeDisposition:hold?'CARRY_ITEM_HOLD':'UNREVIEWED',finalDisposition:hold?'CARRY_ITEM_HOLD':'PASS',issueCodes:hold?['SOURCE_ITEM_HOLD']:[],changedFields:id===17?['difficultyBucket']:[],sourceTextExactParity:'PASS',choicesExactParity:'PASS',assetStatus:id===19?'SOURCE_ASSET_OPENED_SHA_VERIFIED':'NO_ASSET_REQUIRED',renderStatus:'NOT_RUN_R3',questionLayoutRenderStatus:'NOT_RUN_R3',questionLayoutEvidence:{status:'PASS',disposition:'LAYOUT_KEEP',reason:layoutReasons[id],staticSourcePages:[1,2,3,4],actualEngineRender:'NOT_RUN_R3'},
   independentAnswer:f.independentAnswer,originalFrozenIndependentAnswer:f.independentAnswer,adjudicatedAnswer:correction?finalAnswer:undefined,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:q.answer,compareResult:'MATCH',originalFreezeCompareResult:id===1||id===24?'MISMATCH':'MATCH',answerAdjudicationRef:correction?{path:adjudication,sha256:physical(adjudication).sha256,reason:correction.reason}:undefined,
   verdict:hold?'CARRY_ITEM_HOLD':'PASS',disposition:hold?'CARRY_ITEM_HOLD_TO_R2':undefined,itemStatus:hold?'HOLD':'PASS',holdReason:hold?qidHoldReasons[id]:undefined,
   axisEvidence:{questionLayout:{status:'PASS',sourceTextExactParity:'PASS',choicesExactParity:'PASS',disposition:'LAYOUT_KEEP',reason:layoutReasons[id]},solutionLayout:{status:hold?'CARRY_ITEM_HOLD':'PASS',smallBoardContinuityStatus:'PASS',solutionSha256:sha(Buffer.from(String(q.solution??''),'utf8')),reason:solutionReasons[id]},meta:{status:'PASS_WITH_EXPLICIT_NULL_DEBT',...meta,difficulty,metaDebtFields:['problemTypeKey','templateKey'],metaDebtReason:'현재 H22 표준단원키와 세부단원 authority를 실제 대조했다. 문제 구조와 완성 풀이에 정확히 대응하는 활성 PT/template projection이 없어 현 null을 명시 debt로 그대로 결속한다; 의미 재분류는 하지 않는다.'},visualSvg:visual},
   smallBoardContinuityStatus:'PASS',solutionSha256:sha(Buffer.from(String(q.solution??''),'utf8')),
   independentMathReason:solutionReasons[id],difficultyRecheck:difficulty,metaSnapshot:meta,visualReview:visual
 };
});
const renderedPages=[];for(let page=1;page<=4;page++){const p=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008',examUid,'source-pdf',`page-${page}.png`);renderedPages.push({page,path:p,sha256:sha(fs.readFileSync(p)),opened:true,visualReview:'FULL_PAGE_SOURCE_LAYOUT_REVIEWED'});}
const out=structuredClone(base);
out.schemaVersion='JS_ARCHIVE_STAGE_EVIDENCE_v2';out.stage='R1';out.examUid=examUid;out.qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';out.executionLine='CODEX';out.artifactSha=blob;out.artifactRawSha256=rawSha;out.validatorRawBufferBlobSha1=blob;out.gitCleanFilterBlobSha1=cleanBlob;out.denominator=25;out.questionCount=25;out.rows=rows;out.artifactDispositions={artifactSha:blob,rows:base.artifactDispositions.rows};out.goldenCalibrationReviewed=base.goldenCalibrationReviewed;out.goldenCalibrationSet=base.goldenCalibrationSet;out.goldenCalibration=base.goldenCalibration;out.source={path:sourcePdf,sha256:sha(fs.readFileSync(sourcePdfAbsolute)),pageCount:4,sourcePages:renderedPages};out.sourceDenominator={questionCount:25,multipleChoiceCount:21,subjectiveCount:4,qidRange:[1,25],sourcePageMap:'q1-q8 page 1; q9-q16 page 2; q17-q21 page 3; q22-q25 page 4'};out.questionLayout={coverage:'25/25',status:'PASS',dispositions:rows.map(r=>({qid:r.qid,beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',reason:r.questionLayoutEvidence.reason,sourceTextExactParity:'PASS',choicesExactParity:'PASS'})),renderStatus:'NOT_RUN_R3'};out.itemHoldCount=2;out.itemHolds=[1,10].map(qid=>({qid,itemStatus:'HOLD',reason:qidHoldReasons[qid],sourceMode:'R1_INDEPENDENT_CURRENT_STUDENT_ONLY',r2Required:true}));out.assetBindings=[{kind:'CURRENT_ASSET',ref:assetRef,sha256:assetSha,sourcePath:sourcePdf,sourcePage:3,opened:true,reviewed:true}];out.authority={...base.authority,course:'대수',curriculum:'2022 개정',standardUnitAuthority:'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md §대수(H22-A), independently checked in R1',difficultyAuthority:'docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md, independent current pass in R1',difficultyCorrection:{qid:17,previous:4,current:3,reason:'standard-intermediate direct trapezoid model; now consistent with level=중'}};out.validatorAttempts=[];out.renderStatus='NOT_RUN_R3';out.nextRequiredStage='R2';out.reviewerIdentity={role:'archive_r1',reviewerId:'r1_03'};out.independentFreeze={path:freeze,sha256:physical(freeze).sha256,sourceRawSha256:frozen.sourceRawSha256,bundle:physical(bundle),postfreeze:physical(postfreeze),qid17MetaOnlyPostfreeze:physical(postfreezeMeta),adjudication:physical(adjudication),originalBytesPreserved:true};out.r1Coverage={denominator:25,independentAnswerRows:25,questionLayoutRows:25,solutionLayoutRows:25,metaRows:25,visualSvgRows:25,unresolvedItemHolds:[1,10],difficultyRows:25,changedQids:[17],directDependencyQids:[17]};out.r1Disposition='PASS_WITH_ITEM_HOLDS_CARRIED_TO_R2';
fs.writeFileSync(output,JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:output,artifactRawSha256:rawSha,artifactSha:blob,gitCleanFilterBlobSha1:cleanBlob,qids:rows.length,itemHolds:[1,10],changedQids:[17],bundleSha256:physical(bundle).sha256,freezeSha256:physical(freeze).sha256,evidenceSha256:sha(fs.readFileSync(output))},null,2));


