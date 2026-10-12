import fs from 'node:fs';import crypto from 'node:crypto';import {readExam} from '../../../tools/archive-codex-artifact-io.mjs';import {QUALITY_CONTRACT_V2,solutionSha256} from '../../../tools/archive-stage-validator-artifact-v2.mjs';
const root='C:/Users/USER/Desktop/AP------',base=`${root}/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_매산고_1학기_중간_고2_확률과통계`,source=`${root}/archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js`,bundle=`${base}/R1.student-only-postcorrection-current.json`,initialBundle=`${base}/R1.student-only-current.json`,freezeFile=`${base}/R1.original-freeze.json`,cal=`${base}/R1.calibration-preflight.json`,metaFile=`${base}/R1.meta-axis-review.rev2.json`,createFile=`${base}/CREATE.evidence.bound.rev2.json`,intakeFile=`${root}/archive/analysis/source-only-h2-1mid-20261011-b5/18_매산고_1학기_중간_고2_확률과통계.evidence.json`,parityFile=`${base}/R1.postcorrection-bundle-parity.json`,q11Adj=`${base}/R1.q11-adjudication.json`,q15Fix=`${base}/R1.q15-source-correction.json`,out=`${base}/R1.evidence.draft.json`;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');const currentBytes=fs.readFileSync(source),currentHash=hash(currentBytes),exam=readExam(source),student=JSON.parse(fs.readFileSync(bundle,'utf8')),freeze=JSON.parse(fs.readFileSync(freezeFile,'utf8')),calEvidence=JSON.parse(fs.readFileSync(cal,'utf8')),meta=JSON.parse(fs.readFileSync(metaFile,'utf8')),create=JSON.parse(fs.readFileSync(createFile,'utf8')),intakeBytes=fs.readFileSync(intakeFile),parity=JSON.parse(fs.readFileSync(parityFile,'utf8')),adj=JSON.parse(fs.readFileSync(q11Adj,'utf8')),q15Correction=JSON.parse(fs.readFileSync(q15Fix,'utf8'));
if(currentHash!==q15Correction.afterRawSha256||student.sourceRawSha256!==currentHash||freeze.sourceRawSha256!=='80916c84a025c6db4f7289e85b7e61240fcbf22c3376fc71e36c373558e86d51'||!parity.allStudentFieldsAndAssetsExactParity)throw Error('FINAL_SOURCE_OR_STUDENT_PARITY_BINDING_FAILED');
const titles='18_매산고_1학기_중간_고2_확률과통계';
const qText=[
'단일 순열 곱셈식과 짧은 5지 선다; AUTO_FIRST 유지.',
'문장형 이항 선택과 5개 구멍의 짧은 질문; choices 그리드 유지.',
'동일 공/서로 다른 바구니 및 빈 바구니 조건이 한 문단에 명확히 붙음.',
'두 사건의 여사건 조건과 하나의 목표값; 기호 관계가 지문 안에서 완결됨.',
'일렬 배열 조건과 이웃 조건이 단일 문장으로 구분됨.',
'원탁 조건과 비이웃 확률 질문; 별도 이미지 참조 없음.',
'두 지수항 계수 정의와 비율 질문; 수식 범위가 닫혀 있음.',
'인물 선택 확률의 사건 문구가 짧고 완결됨.',
'소인수분해 등식 뒤에 인수 분할 조건이 연결되어 읽힘.',
'카드 선택과 네 자리 정수 기준이 한 흐름으로 제시됨.',
'학생·자전거 수, 탑승 상한, 색상 구분 조건이 모두 본문에 있음.',
'필기구 네 종류, 수량, 선택 상한/순서 비고가 한 질문에 정리됨.',
'세 조건을 (가)~(다)로 나누고 극한 목표를 마지막에 분리함; 실제 줄바꿈 유지.',
'합 기호의 범위와 상수항 요청이 한 줄 수식으로 완결됨.',
'정수 순서쌍, 곱 조건, 절댓값 합 조건을 별도 줄로 제시함.',
'기초 상황, f/g 상자, 확률식, 최종 합을 명시적 줄바꿈으로 나눔.',
'정의역, 단조 조건, 함수값 순서 조건을 (가)/(나)로 분리함.',
'반복 추첨 규칙 (가)/(나)와 마지막 확률 목표를 문단으로 분리함.'
];
const solQuality=[
'순열 선택과 계승 곱을 단계별 등식으로 재현 가능.',
'각 구멍의 두 상태를 곱의 법칙으로 연결; 불필요한 경우나열 없음.',
'변수식과 별-막대 수식으로 빈 바구니 허용을 명시.',
'배반성과 여사건을 식으로 각각 적용해 목표값까지 연결.',
'두 학생을 묶고 묶음 내부 순서를 곱하는 표준 2단계.',
'원탁 총수와 인접 묶음 수를 구분 후 여사건 확률 계산.',
'일반항 지수/부호를 먼저 세워 p와 q를 별도로 구함.',
'전체 조합과 양쪽 지정학생 모두 제외한 경우를 분리.',
'각 합성수에 소인수 두 개가 필요함을 설명한 뒤 비순서 쌍 분할 계산.',
'전체 순열 분모와 첫 자리별 유리 경우를 구분.',
'2,2,1 점유 패턴, 사람 묶음, 유색 자전거 배정을 모두 반영; 3! 배정 명시.',
'제한 없는 별-막대 총수에서 연필/빨간 볼펜 초과만 빼는 과정을 분리.',
'원소별 세 상태로 a,b,c를 정의하고 극한을 마지막에 계산.',
'상수항 조건 k=4j를 도출하고 가능한 k만 합산.',
'비영 좌표 수 r=1,2,3으로 분기; 수정 후 항은 8+144+480=632로 독립 확인.',
'정확히 한 쌍과 세 수 연속을 구분해 f/g를 도출하고 망원합으로 마감.',
'f(2)=t로 놓고 독립 선택 수와 조건부 순서 수를 합산.',
'6회 토글의 짝홀 불변량으로 한 장인 경우의 불가능성을 바로 증명.'
];
const visualReasons=[
'문제·해설 모두 순열/계승의 수식만으로 결정 단계가 완결되어 위치·형태 도식의 추가 정보가 없음.',
'각 구멍의 binary choice는 2^5로 충분히 나타나며 분기 트리는 중복 설명.',
'별-막대 정수해가 핵심이나 해설 식이 distinct-container/empty-container 조건을 이미 보존; 공간 형상은 실제 대상에 대한 추가 사실을 주지 않음.',
'사건/여사건은 기호 등식으로 완결되며 확률 영역도 겹침 그림 없이 배반/여사건 조건이 명시됨.',
'일렬 배열의 block counting은 조작식 5!×2가 결정적이며 인물 좌석 그림은 계산 구조를 바꾸지 않음.',
'원탁 adjacency는 고정인물 기준 원형순열 식으로 재현 가능; 좌석 배치도는 새 제약 정보를 추가하지 않음.',
'이항 전개의 지수-선택횟수 대응과 계수 부호가 표기식으로 직접 추적됨.',
'두 지정 인물 포함 사건은 조합의 여사건 계산으로 완결되며 공간 도식이 없음.',
'소인수 6개의 무순서 pair partition을 공식으로 직접 세며 factor-group 그림은 등가 표기.',
'천의 자리 기준을 경우별 4×4P3으로 계산하며 자리값 표가 추가 정보 없이 식을 반복함.',
'색상 구별 자전거의 2,2,1 인원 배정이 공식에 모두 반영; 사람/차량 관계도는 단순한 분류표를 반복.',
'종류별 개수의 상한 초과를 식으로 배제하며 물건 그림은 수량 제한을 명료하게 만들지 않음.',
'부분집합 쌍은 원소별 상태 3가지로 직접 세며 벤 다이어그램은 지수 성장 계산을 더 명확히 하지 않음.',
'상수항은 k-4j 지수식과 지표 목록만으로 결정됨.',
'정수 절댓값 합은 r별 조합/부호 곱의 짧은 합으로 완결; 좌표 도식은 수치 경우를 줄이지 않음.',
'세 수의 간격 분류와 합 telescoping은 수식으로 정확히 드러나며 number line은 새 조건을 추가하지 않음.',
'단조 세 함수값과 두 값 순서는 t별 곱셈식으로 충분; 함수 그래프는 정의역 순서 제약의 counting을 대체하지 않음.',
'카드별 toggle은 짝홀 불변량으로 불가능성이 끝나며 상태 그림은 동일 불변량을 반복함.'
];
const qidOrder=exam.questions.map(q=>Number(q.id));const frozen=new Map(freeze.rows.map(r=>[Number(r.qid),r]));const metaRows=new Map(meta.rows.map(r=>[Number(r.qid),r]));const createRows=new Map(create.rows.map(r=>[Number(r.qid),r]));
const rows=exam.questions.map((q,i)=>{const qid=Number(q.id),fr=frozen.get(qid),mr=metaRows.get(qid),cr=createRows.get(qid);const stored=String(q.answer??'');const independent=String(fr.independentAnswer);const compare=independent===stored?'MATCH':'MISMATCH';const debt=cr?.sourceIdentity?.uidResolutionStatus==='EVIDENCE_DEBT';const answerDisposition=qid===11?'Original freeze ④ was corrected by separate R1 adjudication to ⑤ after recounting the assignment of the two remaining color-distinct bikes; production solution and answer are correct.':qid===15?'Stored 752 and its coefficient sum were corrected in source to 632; original freeze independently computed 632 and remains unchanged.':null;const metaStatus=(mr?.metaDisposition?.metaDebtFields?.length||debt)?'EVIDENCE_DEBT':'REVIEWED';return{qid,questionUid:cr?.questionUid??null,sourceQid:Number(q.sourceQid??qid),independentAnswer:independent,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:stored,compareResult:compare,verdict:qid===11?'PASS_AFTER_ADJUDICATION':qid===15?'PASS_AFTER_SOURCE_CORRECTION':metaStatus==='EVIDENCE_DEBT'?'PASS_WITH_EXPLICIT_EVIDENCE_DEBT':'PASS',...(qid===11||qid===15?{disposition:answerDisposition}:{}),smallBoardContinuityStatus:'PASS',solutionLayout:{status:'PASS_STATIC_REVIEW',observation:solQuality[i],actualBrowserRender:'NOT_RUN_R3',...(qid===15?{targetedCorrectionReview:true}:{})},solutionCalibrationCompare:{status:'MEETS_FLOOR',observation:solQuality[i]},axisEvidence:{QUESTION_LAYOUT:{status:'PASS_STATIC_SOURCE_REVIEW',observation:qText[i],sourceTextAndChoicesExactParity:true,autoFirst:'KEEP',actualBrowserRender:'NOT_RUN_R3'},SOLUTION_LAYOUT:{status:'PASS_STATIC_REVIEW',observation:solQuality[i],smallBoardContinuityStatus:'PASS',actualBrowserRender:'NOT_RUN_R3'},META:{status:metaStatus,currentMetaSnapshotPath:'R1.meta-axis-review.rev2.json',sourceIdentity:{sourceArchiveFile:'archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js',sourceQid:Number(q.sourceQid??qid),questionUid:cr?.questionUid??null,uidResolutionStatus:cr?.sourceIdentity?.uidResolutionStatus??'UNKNOWN',uidResolutionReason:cr?.sourceIdentity?.uidResolutionReason??null},currentMetaFields:mr?.currentFields,metaDebtFields:mr?.metaDisposition?.metaDebtFields??[],metaDebtReason:mr?.metaDisposition?.metaDebtReason??null,consumerIndexParity:'NOT_TESTED_R1_SCOPE'},VISUAL_SVG:{status:'REVIEWED_EXEMPT',problemVisualNeed:'EXEMPT',solutionVisualNeed:'EXEMPT',reason:visualReasons[i],referencedAssets:student.rows.find(r=>r.qid===qid)?.assets?.map(a=>({ref:a.ref,sha256:a.sha256}))??[],problemVisualAssetPresent:!!(q.image||q.visualAsset),solutionVisualAssetPresent:!!q.solutionImage,actualRenderStatus:'NOT_RUN_R3'}}}});
const dispositions=meta.rows.map(r=>({qid:r.qid,metaDebtFields:r.metaDisposition.metaDebtFields??[],...(r.metaDisposition.metaDebtReason?{metaDebtReason:r.metaDisposition.metaDebtReason}:{})}));
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:QUALITY_CONTRACT_V2,executionLine:'CODEX',stage:'R1',examUid:titles,examTitle:'18 매산고 1학기 중간 고2 확률과 통계',artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,sourceIdentity:{sourceArchiveFile:'archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js',productionRelativePath:'archive/exams/original/high/h2/1mid/18_매산고_1학기_중간_고2_확률과통계.js',baselineSourceRawSha256:'80916c84a025c6db4f7289e85b7e61240fcbf22c3376fc71e36c373558e86d51',intakeBaselineRawSha256:'8d17c4ee47cde3217447141fa338956b74f9d2a50f40bee08866a020c193e2a0',currentSourceRawSha256:exam.rawSha256,currentSourceRawBufferBlobSha1:exam.rawBufferGitBlobSha1,sourceQidCount:18,questionUidResolution:'EVIDENCE_DEBT',questionUidResolutionReason:'Source-only intake evidence carries exam-level inventory and original ordinal qid, but no canonical per-question UID. Keep sourceQid as the extracted source ordinal and do not fabricate a stable UID.'},denominator:18,expectedQids:qidOrder,independentFreeze:{path:`${base}/R1.original-freeze.json`,sha256:hash(fs.readFileSync(freezeFile)),sourceRawSha256:freeze.sourceRawSha256,studentBundlePath:`${base}/R1.student-only-current.json`,studentBundleSha256:hash(fs.readFileSync(initialBundle)),frozenBeforeStoredAnswer:true,rows:freeze.rows.map(r=>({qid:r.qid,independentAnswer:r.independentAnswer,reasoning:r.reasoning}))},studentInput:{path:bundle,sha256:hash(fs.readFileSync(bundle)),schemaVersion:student.schemaVersion,sourceRawSha256:student.sourceRawSha256,sourceRawBlobSha1:student.sourceRawBlobSha1,qids:student.qids,questionCount:student.questionCount,answersIncluded:false,allStudentFieldsAndAssetsExactParity:parity.allStudentFieldsAndAssetsExactParity,assetRefs:[],postcorrectionParityPath:parityFile,postcorrectionParitySha256:hash(fs.readFileSync(parityFile))},sourceIntakeEvidence:{path:intakeFile,rawSha256:hash(intakeBytes),expectedRawSha256:'15dc4ef528ebac5ad42b5d799435acae6e4e75347b8dfcb3c90cdbe92492cc0f',evidenceReused:true,sourcePdfPath:'C:\Users\USER\Desktop\기출정리 파일\(1)1중간\확률과통계\과년도기출\매산고2_확률과통계_이과_1중간_2018.pdf',actualPdfComparison:false,pdfComparisonReason:'No concrete qid-specific source-dependent defect; current extracted JS and zero asset refs are the review inputs.'},sourceCorrections:[{qid:15,path:q15Fix,sha256:hash(fs.readFileSync(q15Fix)),fields:['answer','solution'],studentTextChoicesUnchanged:true}],answerAdjudication:{qid:11,path:q11Adj,sha256:hash(fs.readFileSync(q11Adj)),originalFreezePreserved:true,productionAnswerAndSolutionUnchanged:true},failedAttempt:{path:`${base}/R1.failed-attempt-order.json`,sha256:hash(fs.readFileSync(`${base}/R1.failed-attempt-order.json`)),status:'FAILED_STAGE_ORDER',disposition:'Preserved. Initial target solution extraction preceded Golden/Negative preflight; the successful preflight and targeted q11/q15 correction review followed.'},metaAxisReview:{path:metaFile,sha256:hash(fs.readFileSync(metaFile)),denominator:meta.denominator},goldenCalibrationReviewed:true,goldenCalibrationSet:calEvidence.goldenCalibrationSet,goldenCalibration:calEvidence.goldenCalibration,goldenCalibrationPreflight:{path:cal,sha256:hash(fs.readFileSync(cal)),reportPath:`${base}/R1.calibration-preflight.json`,status:'PASS',issues:[]},solutionQualityCalibration:{calibrationAxes:calEvidence.solutionQualityCalibration.calibrationAxes,sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'INDEPENDENT_REVIEW',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',qualityCompareCount:'18/18',qualityCompareScope:'18-qid full stage quality comparison; q11/q15 alone received targeted post-preflight correction review; original initial ordering failure preserved.'},qualityCompareCount:'18/18',actualRenderPassAsserted:false,renderStatus:'NOT_RUN_R3',rows,artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:dispositions},evidenceRefs:{metaAxisReview:'R1.meta-axis-review.rev2.json',freeze:'R1.original-freeze.json',q11Adjudication:'R1.q11-adjudication.json',q15Correction:'R1.q15-source-correction.json',postcorrectionStudentParity:'R1.postcorrection-bundle-parity.json',failedStageOrderAttempt:'R1.failed-attempt-order.json',calibrationPreflight:'R1.calibration-preflight.json'},scope:{examUid:titles,questionCount:18,rosterTargetIndex:3,sourceActualPdfReviewed:false,r3OrMainWorkPerformed:false}};
if(rows.length!==18||rows.some((r,i)=>r.qid!==i+1)||rows.some(r=>r.compareResult==='MISMATCH'&&r.qid!==11)||rows.find(r=>r.qid===11).storedAnswer!=='⑤'||rows.find(r=>r.qid===15).storedAnswer!=='632')throw Error('R1_ROW_OR_ADJUDICATION_SCOPE_INVALID');
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({path:out,artifactRawSha256:exam.rawSha256,artifactSha:exam.rawBufferGitBlobSha1,qids:rows.length,mismatches:rows.filter(r=>r.compareResult==='MISMATCH').map(r=>r.qid),metaDebt:dispositions.filter(r=>r.metaDebtFields.length),visualExemptions:rows.filter(r=>r.axisEvidence.VISUAL_SVG.problemVisualNeed==='EXEMPT'&&r.axisEvidence.VISUAL_SVG.solutionVisualNeed==='EXEMPT').length},null,2));
