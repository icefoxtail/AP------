import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
if(root.replaceAll('\\','/')!=='C:/Users/USER/Desktop/AP-------gold2-job-b') throw Error('JOB_B_WORKTREE_LOCK');
const {rulePreflight}=await import(pathToFileURL(path.join(root,'archive/tools/pipeline-core/rulepack.mjs')));
const {bytesSha,objectSha}=await import(pathToFileURL(path.join(root,'archive/tools/pipeline-core/canonical.mjs')));
const {readProductionSample,CALIBRATION_AXES,QUALITY_PROFILE_CHECKS}=await import(pathToFileURL(path.join(root,'archive/tools/past-exam-pipeline/lib/calibration.mjs')));
const job='past-exam-v3-gold2-20260910-job-b-hanyeong-2023';
const base='archive/_generated/past-exams/'+job;
const now=new Date().toISOString();
const ids={workBatchId:job,builderId:'builder-gold2-job-b-hanyeong-20260910-main-01',builderSessionId:'builder-session-gold2-job-b-hanyeong-20260910-main-01',runIds:['run-gold2-job-b-hanyeong-2023-01']};
const write=(f,o)=>fs.writeFileSync(base+'/'+f,JSON.stringify(o,null,2)+'\n');
const ref=p=>{const b=fs.readFileSync(p);return {path:p,bytes:b.length,sha256:bytesSha(b)}};
write('reports/job-identities.json',{...ids,exam:'2023 한영고 고1 2학기 기말',startSha:'3531349d31cc8e17ea17c7e1f34ed0ce5745c9aa',branch:'codex/past-exam-v3-gold2-independent-20260910-job-b',createdAt:now});
write('work-batch-spec.json',ids);
write('reports/rule-preflight.json',rulePreflight(root));
write('reports/source-location.json',{status:'LOCATED_NOT_PAGE_INVENTORIED',locatedAt:now,externalOriginal:ref('D:/기출/23,24 고1/2023년/2학기 기말고사/수학 하 (23 한영고 기말) 답X.hwp'),preservedOriginal:ref(base+'/source/original.hwp'),sourceFormat:'HWP',answerKeyAvailability:'Filename says 답X; contents not inspected',sourcePixelInspection:false,sourceQuestionCount:null,sourcePageCount:null,questionDenominatorStatus:'UNKNOWN_NOT_ZERO',baselineStatus:'ABSENT',baselinePath:'archive/exams/original/high/h1/2final/23_한영고_2학기_기말_고1_기출.js'});
const names=['23_금당고_2학기_기말_고1_기출','23_매산여고_2학기_기말_고1_기출'];
const notes=[[
'순열의 정의와 5·4·3 계산, 선택지 번호 결론이 연결된다.',
'인원이 다른 두 모둠이므로 2명 모둠만 선택하는 이유를 설명한다.',
'안쪽 g(1)=-3부터 f(-3)=1까지 순서를 보인다.',
'그림 선택지를 원본 image로 분리하고 수직선 판정의 이유를 설명한다.',
'루트 내부 비음수 조건과 음수 나눗셈에 따른 부등호 방향을 보인다.',
'부분분수 항등식과 실제 소거식을 이어 9/10을 구한다.',
'평행이동형 -1-2/(x-1)로 다섯 진술을 개별 판정하고 별도 SVG가 있다.',
'증가함수 공통점이 y=x 위라는 모순 논증 뒤 두 교점과 거리를 계산한다.',
'전체 10C3에서 5개 대각선별 4C3을 빼며 중복 없음의 이유를 언급한다.',
'구간 길이로 기울기 절댓값을 정하고 양·음의 기울기 경우를 비교한다.',
'최댓값 2 조건으로 계수의 음수 가능성을 배제하고 왼쪽 끝 최댓값을 계산한다.',
'사전순 블록을 120,24,6 크기로 분해하여 남은 순번을 추적한다.',
'역함수 조건을 f(2)=-3으로 바꾸고 두 절편에서 넓이를 계산한다. SVG는 별도 필드다.',
'합 a+b+c의 영·비영 경우를 나누고 음수 값의 실제 가능한 예도 제시한다.',
'테마별 (2,1,1) 선택 9+18+18에 시간순 4!을 곱하는 두 단계를 분리한다.',
'p=0을 배제한 뒤 역수 치역의 빠진 구간 양 끝과 절댓값 해 개수를 연결한다.',
'중앙색을 정하고 B,D,F의 동일·상이 색 배치를 각각 세어 합산한다.',
'g(u)=2에서 입력 1,3을 찾은 후 f의 증가 구간과 상수 구간을 따로 확인한다.',
'사물함 남학생 위치를 같은 층·다른 층으로 나누고 실제 학생의 순열을 곱한다.',
'u=루트(x+3) 비음수 치환으로 k=2,3,4를 구분하고 1+2+0을 계산한다.',
'유한 함수값 후보를 조건 (나),(가),(다) 순서로 좁히며 남은 값의 합이 고정됨을 설명한다.'
],[
'합성의 안쪽 f(2)부터 바깥 g(4)까지 계산한다.',
'반복 합성의 4배 관계를 지수 2의 거듭제곱으로 정리한다.',
'원본 그래프를 image로 두고 합성 역함수 순서를 뒤집어 함수값을 추적한다.',
'정의역의 모든 원소가 공역 안에 가도록 절댓값 기울기로 치역을 나타낸다.',
'분모 인수분해 후 분자 계수 비교로 a+b를 정한다.',
'점근선 중심의 y=x 대칭과 점·직선 거리에서 k=8 및 AB를 구한다.',
'분수식의 음수 구간이 양·음 x를 포함하도록 절편 위치를 사용한다.',
'평행이동과 대칭이동을 식으로 각각 확인하고 치역으로 제4사분면을 배제한다.',
'정수 x=0부터 10까지 세로선별 가능한 정수 y를 묶어 총 45를 계산한다. 별도 그래프가 있다.',
'경유는 곱, 두 구간 중 하나는 합이라는 차이를 4와 3의 경로 수에 적용한다.',
'양의 정수 순서쌍, 백의 자리 고정 순열, 음료 조합을 각각 계산한다.',
'두 동아리 인원을 합한 17명에서 순서 없는 대표 3명을 고른다.',
'순열의 첫 인수 분리와 조합의 비를 사용하여 M,N을 따로 계산한다.',
'같은 색 연필 둘을 모두 포함·제외하는 배타적인 두 경우를 센다.',
'전체에서 남학생만 고른 경우를 빼는 여사건식을 사용한다.',
'두 제곱근을 비음수 변수로 치환하고 판별식 및 곱의 부호, 교점 중복 경계를 검사한다.',
'성별·공석 배치 57개를 행별 경우로 계산한 뒤 서로 다른 학생 4!2!을 곱한다.',
'전체 치역과 실근 개수에서 두 가지 함수의 치역을 비교하고 최소 a 및 세 실근을 계산한다.',
'두 반직선 치역이 실수 전체를 덮고 중복되지 않는 부호조건으로 정수를 센다.',
'세 함수값 중 비영이 0개·1개인 경우를 나누고 치역 크기 조건을 적용한다.',
'합성 항등에서 g(x)=2를 푸는 역함수 계산 과정을 제시한다.',
'점근선과 f(0)으로 계수를 먼저 정한 뒤 정의역·치역 및 역함수의 정의역을 보존한다.',
'간격 제거 치환과 역복원을 모두 써서 n-2개 중 3개 선택의 일대일 관계를 설명한다.'
]];
const main='3531349d31cc8e17ea17c7e1f34ed0ce5745c9aa';
const samples=names.map((name,i)=>{
 const s=readProductionSample(root,main,'archive/exams/original/high/h1/2final/'+name+'.js');
 const {bank,...meta}=s;
 if(bank.length!==notes[i].length)throw Error('READ_COVERAGE');
 return {...meta,selectionReason:'Same 2023 cohort, grade 1, second-semester final and 수학(하); includes high-level and constructed-response questions and separate solution visuals.',qualityAcceptanceReason:'Complete solution-bearing production sample read through the last question; observation only, not an independent mathematical or render certification.',checkedAxes:Object.fromEntries(CALIBRATION_AXES.map(axis=>[axis,{status:'NOT_TESTED',observation:{schema:'Sequential ids and complete answer/solution fields observed.',solutionQuality:'Question-specific notes preserve condition interpretation, intermediate reasoning and conclusion form.',metadata:'H15-SB family and subunit fields observed; no target classifications imported.',problemVisual:'Problem images are distinct image fields; tables remain content material.',solutionVisual:'Solution image fields have alt/caption/size; full visual quality gate has not been independently reviewed.',layout:'Questions use grid and wide:false, including constructed responses.'}[axis]}])),questionObservations:bank.map((q,j)=>({qid:q.id,questionSha:objectSha(q),solutionExcerpt:q.solution.split('\n').find(x=>x.startsWith('정석 풀이:'))?.slice(0,160)||q.solution.slice(0,120),observation:notes[i][j]}))};
});
const checks={noAnswerOnlySolution:[0,1,'Concept, condition interpretation and a reproducible calculation must precede the answer.'],conceptExplained:[0,2,'Explain why the counting/function method fits the condition.'],conditionsInterpreted:[0,10,'Translate the actual domain and sign conditions into equations or cases.'],intermediateReasoningPreserved:[0,12,'Retain intermediate counts and how remaining cases change.'],choiceConclusionNumber:[0,3,'Finish a choice solution with the correct original option number.'],highLevelNoLogicJump:[0,21,'Show finite candidate elimination and why remaining uncertainty does not affect the result.'],subjectiveStepsSufficient:[1,23,'Give a reversible argument and enough steps for a student to reproduce the answer.'],problemSolutionImagesSeparate:[0,7,'Use distinct source image and instructional solutionImage fields.'],beneficialVisualsUsed:[1,9,'Use an instructional visual for the decisive geometric or counting relation when beneficial.'],visualAltCaption:[0,13,'Provide meaningful alt text, a factual caption and a declared solution size.'],visualMathParity:[0,13,'The plotted inverse and intercepts must agree with the calculated function and area.']};
write('reports/REFERENCE_SAMPLE_LOCK.pending.json',{schemaVersion:'PAST_EXAM_REFERENCE_SAMPLE_LOCK_v1',status:'NOT_TESTED',mainCommit:main,rulePackSha:rulePreflight(root).rulePackSha,readerId:ids.builderId,readerSessionId:ids.builderSessionId,startedAt:null,frozenAt:null,sampleRole:'QUALITY_CALIBRATION_ONLY',sourceTruthPolicy:'TARGET_SOURCE_ONLY',target:{examId:'23_한영고_2학기_기말_고1_기출',baselineStatus:'ABSENT',baselineRef:null,sourceFiles:[]},baselineSnapshotBase64:null,baselineQuestionObservations:[],baselineObservation:'No exact target JS exists in current original production paths.',samples,productionQualityProfile:Object.fromEntries(QUALITY_PROFILE_CHECKS.map(k=>[k,{status:'NOT_TESTED',minimumStandard:checks[k][2],sampleAnchors:[samples[checks[k][0]].path+'|'+checks[k][1]]}])),pendingReason:'Canonical calibration source binding requires PDF/full-page images. Only original HWP is available, and HWP-to-PDF conversion did not complete. This is a pending observation draft, not a frozen PASS lock.'});
write('reports/conversion-provenance.json',{officialGuide:'https://developer.hancom.com/hwpautomation',officialDownload:'https://github.com/hancom-io/devcenter-archive/raw/main/hwp-automation/%EB%B3%B4%EC%95%88%EB%AA%A8%EB%93%88%28Automation%29.zip',downloadRef:ref(base+'/tools/hancom-official-automation.zip'),moduleRef:ref(base+'/tools/hancom-official/FilePathCheckerModuleExample.dll'),moduleRegistrationResults:[{attempt:1,registeredModule:false,result:'Object created; Open call did not return; no PDF'},{attempt:2,moduleName:'Gold2JobBFilePathChecker',registeredModule:false,result:'RegisterModule returned False; Open did not return; no PDF'},{attempt:3,moduleName:'Gold2JobBFilePathChecker',shortPath:true,registeredModule:false,result:'RegisterModule returned False; Open did not return; no PDF'}],otherWorktreeModulesLoaded:false,sourceUploaded:false});
console.log(JSON.stringify({status:'HOLD_EVIDENCE_WRITTEN',sampleQuestionObservations:samples.reduce((n,s)=>n+s.questionCount,0),...ids}));
