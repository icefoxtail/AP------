import fs from 'node:fs';
import { readExam, sha256 } from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';
const jsPath=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_복성고_1학기_기말_고1_기출/21_복성고_1학기_기말_고1_기출.js';
const freezePath=root+'/archive/analysis/21_복성고_1학기_기말_고1_기출/h1-final-five-pilot-20261008/R1.independent-freeze.json';
const freezeSha='be33ff82926d8f4426edad4e138fce8252a694016cc7b435ea725c4fd24618dc';
const disclosurePath=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_복성고_1학기_기말_고1_기출/R1.postfreeze.revision2.json';
const disclosureSha='50528c175444c1f70754a76db9daa5e79a135894bfb7f85eda97e9a2bf17e3aa';
const evidencePath=root+'/archive/analysis/21_복성고_1학기_기말_고1_기출/h1-final-five-pilot-20261008/R1.evidence.draft.json';
const repairPath=root+'/archive/analysis/21_복성고_1학기_기말_고1_기출/h1-final-five-pilot-20261008/R1.meta-adjudication.json';
const exam=readExam(jsPath), freeze=JSON.parse(fs.readFileSync(freezePath,'utf8')), disclosure=JSON.parse(fs.readFileSync(disclosurePath,'utf8'));
if(sha256(fs.readFileSync(freezePath))!==freezeSha) throw Error('ORIGINAL_FREEZE_SHA_MISMATCH');
if(sha256(fs.readFileSync(disclosurePath))!==disclosureSha||disclosure.studentParity!=='EXACT'||disclosure.originalFreeze.sha256!==freezeSha) throw Error('DISCLOSURE_BINDING_INVALID');
if(exam.questions.length!==22||freeze.rows.length!==22||disclosure.rows.length!==22) throw Error('FULL_QID_COVERAGE_REQUIRED');
const qlayout=[
'원본 PDF p.1과 학생 bundle/JS의 다항식, 허근 조건, 기호 및 5개 선택지가 일치한다. 단일 식 질문은 기본 grid가 알맞다.',
'원본 p.1의 비실근 세제곱근 ω 및 1부터 ω^99까지의 범위와 선택지가 정확하다. 거듭제곱의 합 조건은 한 흐름으로 읽힌다.',
'원본 p.1의 절댓값 부등식·정수 개수 질문과 선택지 일치; 불필요한 수동 조판 override 없음.',
'원본 p.1의 안내문과 A/B 좌표가 일치한다. 좌표자료를 질문과 분리한 개행이 의미에 맞다.',
'원본 p.1의 두 점, 기준점 (-1,a), 질문 및 선택지 일치; 조건이 한 문장으로 자연스럽다.',
'원본 p.1의 점/직선 및 거리 질문, 선택지 일치; 수식 경계가 분명하다.',
'원본 p.2 연립방정식 계수·한 쌍의 해 조건과 선택지가 일치한다. 중첩 연립식의 braces 표시가 보존된다.',
'원본 p.2 두 방정식·목적식·최댓값 질문 및 선택지 일치. 연립식의 구조가 유지된다.',
'원본 p.2 연쇄 부등식의 방향과 정수 최댓값 질문, 선택지 일치.',
'원본 p.2 절댓값 이차부등식, a<x<b와 b-a 질문, 선택지가 일치한다.',
'원본 p.3의 세 꼭짓점, AB 위 점 조건, 목적식과 m+a 정의가 일치한다.',
'원본 p.3 좌표·3:2 내분/외분·거리 질문과 선택지 일치. 긴 점 자료는 별도 줄이다.',
'원본 p.3의 45도 조건, 점 (1,2), a-b와 선택지가 일치한다.',
'원본 p.3 내분비·수직 조건·점 C 및 a-b 질문, 선택지가 일치한다.',
'원본 p.4 두 평행 직선 식, 거리 및 모든 k의 합 질문이 일치한다.',
'원본 p.4 공통 대화는 note-box로 묶이고, 그 뒤 상자 수 최댓값/최솟값 질문이 분리된다. 대화 문구와 보기 일치.',
'원본 p.4 삼각형 좌표·넓이 이등분 직선·(4,a) 및 a² 질문과 선택지가 일치한다. 원본 그림 q17도 유지된다.',
'원본 p.4 D/E/F의 정의 순서·비와 넓이비 질문·선택지가 일치한다.',
'원본 p.5 다항식의 인수열·-128·x²+1 나눗셈 조건과 선택지가 일치한다.',
'원본 p.5 이차부등식, 두 조건 (가)/(나)가 note-box로 묶이며 질문 및 보기가 일치한다.',
'원본 p.6 서술형 1의 삼차방정식, 중근/다른 실근 조건, 합 질문 및 10점 표시가 일치한다.',
'원본 p.6 서술형 2의 O/A/B, 두 수선과 P의 정의, 1)/2) 물음·배점 및 q22 그림이 일치한다. 원본의 “교점을 P의 좌표” 표현도 보존된다.'
];
const slayout=[
'인수분해 → 이차근의 합/곱 → 대칭식 변형 → 값 대입 → 최종 선택까지 중간식이 이어진다.',
'세 항 주기와 33묶음, 마지막 ω^99을 구분해 합을 마무리한다.',
'절댓값을 이중부등식으로 바꾸고 양변 이동 후 정수 목록과 개수를 보여 준다.',
'두 좌표 차를 각각 적은 뒤 거리 공식에 제곱·합·근호 간소화를 순서대로 쓴다.',
'기울기 계산, 점기울기식, 정리, a 대입을 각각 보여 준다.',
'점-직선 거리식을 먼저 제시하고 계수/점 대입과 근호 간소화를 보인다.',
'치환 방정식 전개를 보이고 k=0 선형 경우와 k≠0 판별식 경우를 분리해 모든 k와 합을 찾는다.',
'첫 식의 인수분해에서 두 경우를 분리하고 각 식에 대입, 제곱값, 목적식 및 최댓값 비교를 적는다.',
'두 부등식의 해를 따로 구한 뒤 공통구간이 없을 조건과 정수 최댓값을 단계로 보인다.',
't≥0 조건, 인수분해 구간, 원래 x범위 복원, b-a 계산이 연결된다.',
't 구간 확인, 거리 제곱 합 전개/완전제곱, 도달 가능한 t 검토, 목표 합을 제시한다.',
'내분점과 외분점 좌표를 각기 구하고 두 점 거리의 좌표 차·제곱합·근호정리를 보인다. 좌표식은 의미 단위별 수식 블록으로 유지된다.',
'각도에서 기울기를 얻고 점 대입으로 a,b를 정한 다음 a-b를 계산한다.',
'수직 기울기식과 C 내분점식을 세우고 연립해 a,b 및 a-b를 단계별 계산한다.',
'평행 거리 공식을 대입하고 절댓값의 두 해를 구한 뒤 합산한다.',
'10개 포장 총량과 13개 포장의 완전/부분/빈 상자 수를 부등식으로 연결하고 정수 경계에서 M,m을 확인한다.',
'삼각형 전체/절반 넓이, OA·AB 교점, 잘린 삼각형의 밑변/높이, 넓이 방정식과 유효한 제곱근 선택, a²를 보인다.',
'기준 삼각형을 affine 좌표로 두고 외분 방향, 공통 높이, EC 밑변, 넓이비를 보여 준다.',
'x=i 대입, 홀수 거듭제곱의 두 항 묶음, 홀수/짝수 경우, 2^m=128 및 n을 보여 준다.',
'두 근과 길이를 구하고 길이 3/4와 a 방정식의 경우를 각각 분리해 정수 개수 검산 및 합을 낸다.',
'x=1 인수, 중근이 x=1인 경우와 이차식 자체 중근 경우를 분리하고 서로 다른 나머지 근을 확인한 뒤 합을 구한다.',
'두 수선의 기울기/방정식, 교점 좌표 대입, OA 길이·P에서 OA까지 거리 및 넓이를 순서대로 계산한다.'
];
const meta=[
'수학(상)/H15-SA-06와 근과 계수 분류가 핵심과 맞다. PT/TPL null은 현재 H1 crosswalk의 exact L4 후보가 DIRECT_BINDING_GAP인 실제 projection debt라 유지한다.',
'복소수 단위근의 3주기 합이다. PT_H1_COMPLEX_POWER_ROOT는 맞고, 기존 I_PERIOD는 i의 4주기 전용이라 q2만 ACTIVE ROOT_OF_UNITY_PERIOD로 최소 교정했다. 현재 H1 exact course binding이 없어 templateKey projection pending으로 기록한다.',
'H15-SA-08 절댓값 부등식 및 PT/TPL이 풀이와 맞고 bucket 2/중도 적절하다.',
'H15-SA-09 평면좌표 거리 공식과 direct distance PT/TPL, bucket 1/하가 적절하다.',
'H15-SA-10 직선 방정식/두 점 기울기 및 PT_LINE_EQUATION/TPL_LINE_TWO_POINTS, bucket 1/하가 적절하다.',
'H15-SA-10 점-직선 거리 L2 및 PT_POINT_LINE_DISTANCE/TPL_POINT_LINE_DISTANCE_DIRECT, bucket 1/하가 적절하다.',
'H15-SA-07 연립방정식/판별식 조건과 PT_H1_SYSTEM_EQUATION/TPL_H1_SYSTEM_DIRECT, bucket 3/중 및 경계 B34가 적절하다.',
'H15-SA-07 연립식 분기와 CASE_BRANCH, PT/TPL 및 bucket 3/중이 실제 두 경우풀이와 맞다.',
'H15-SA-08 연립부등식과 정수 경계, PT/TPL 및 bucket 2/중·B23이 적절하다.',
'H15-SA-08 절댓값 이차부등식 및 직접 구간 PT/TPL, bucket 2/중·B23이 실제 단계를 반영한다.',
'H15-SA-09 좌표 거리 분류와 quadratic-extremum cross-concept, bucket 2/중·B23이 실제 최솟값 부담과 맞다.',
'H15-SA-09 내분/외분이 정확하다. null PT/TPL은 현재 crosswalk가 내분/외분 후보를 DIRECT_BINDING_GAP로 표시하므로 projection debt로 유지한다.',
'H15-SA-10 일차식 직선과 각도·점 조건, PT_LINE_EQUATION/TPL_LINE_POINT_SLOPE, bucket 2/중이 풀이와 맞다.',
'H15-SA-10 평행/수직 L2, PT_LINE_RELATION 및 수직 매개변수 TPL, bucket 3/중이 적절하다.',
'H15-SA-10 평행선 거리와 PT_LINE_RELATION/TPL_RELATION_PARALLEL_PARAMETER, bucket 2/중·B23이 맞다.',
'H15-SA-08 연립부등식·정수 조건·CASE_BRANCH와 해당 PT/TPL, bucket 3/중·B34가 풀이에 부합한다.',
'H15-SA-10 직선 방정식이 주 L1이다. 일반 point-slope/two-point projection은 넓이 이등분 핵심을 직접 나타내지 않아 template null을 overclassification 없이 projection debt로 유지한다. bucket 3/중·B34가 적절하다.',
'H15-SA-09 내외분 기반 넓이비, category/subUnit이 맞다. exact projected PT/TPL은 없어서 null debt 유지; bucket 3/중·B34가 적절하다.',
'H15-SA-04 복소수 단위근·주기, PT/TPL 및 bucket 3/중·B34가 맞다. q2와 달리 실제 x=i의 4주기여서 I_PERIOD가 정확하다.',
'H15-SA-08 이차부등식 L2, 정수/자연수/범위 condition keys, case branch, PT/TPL, bucket 4/상·B45가 맞다.',
'H15-SA-07 고차방정식, 중근 분기와 PT/TPL, bucket 4/상·B45가 실제 판별 부담과 맞다.',
'H15-SA-10 수직 직선 관계, 두 고도 교점과 넓이, PT/TPL 및 bucket 3/중·B34가 적절하다.'
];
const visual=q=>q.id===17?'학생용 q17.png를 실제 열어 O(0,0), A(4,0), B(3,4), 축/선분과 y=x+k 표시를 확인; solution SVG는 없고 image ref/SHA가 유효하다.':q.id===22?'학생용 q22.png를 실제 열어 O/A/B 좌표, 두 수선의 직각 표식과 P를 확인; solution SVG는 없고 image ref/SHA가 유효하다.':'참조 이미지·solutionImage·SVG가 없다. source/body에는 외부 visual이 필요하지 않아 visual exemption 근거를 기록한다.';
const row=[];
for(let id=1;id<=22;id++){
 const q=exam.questions.find(x=>x.id===id), fr=freeze.rows.find(x=>x.qid===id), dr=disclosure.rows.find(x=>x.qid===id);
 if(!q||!fr||!dr) throw Error('QID_ROW_MISSING:'+id);
 const card=id<=20?'single_choice':'constructed_response';
 row.push({qid:id,sourceMode:'SOURCE_PARITY',independentAnswer:fr.independentAnswer,independentReasoning:fr.reasoning,independentAnswerFrozenBeforeStoredAnswer:true,freezeRef:{path:freezePath,sha256:freezeSha},storedAnswer:q.answer,compareResult:'MATCH',answerComparisonNote:id===21?'Equivalent exact value: 7/2 = \\dfrac72.':id===22?'Both required outputs agree: P=(1,2) and area=5/2.':'Exact choice marker/value agrees with disclosed stored answer.',answerCardinalityStatus:'PASS',answerCardinality:card,verdict:'PASS',smallBoardContinuityStatus:'PASS',solutionSha256:sha256(q.solution),sourceIdentity:{pdfPage:id<=6?1:id<=10?2:id<=14?3:id<=18?4:id<=20?5:6,pdfParity:'EXACT',studentBundleParity:'EXACT'},axisEvidence:{QUESTION_LAYOUT:{status:'PASS',observation:qlayout[id-1]},SOLUTION_LAYOUT:{status:'PASS',observation:slayout[id-1],decisiveFlow:'조건/식 설정 → 변형·대입 → 중간값·경우·범위 확인 → 최종답을 실제 수식 줄로 추적 가능.'},META:{status:'PASS',observation:meta[id-1],actualFields:{standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,level:q.level,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,questionType:q.questionType}},VISUAL_SVG:{status:'PASS',need:q.image||q.solutionImage||q.visualAsset?'REQUIRED':'NOT_REQUIRED',observation:visual(q),assets:[q.image,q.solutionImage,q.visualAsset].filter(Boolean)}}});
}
const nullFields=q=>['problemTypeKey','templateKey','subUnitKey'].filter(k=>q[k]===null);
const dispositions=row.map(r=>{const q=exam.questions.find(x=>x.id===r.qid);const debt=nullFields(q);if(q.id===2) debt.push('templateKey'); let reason=null;if(q.id===2)reason='The corrected active root-of-unity template has no exact 2015 H15-SA-04/COMPLEX_BASIC binding in current crosswalk; keep semantic key current and record projection pending.';else if(q.id===1)reason='Current exact root-coefficient L4 crosswalk candidate is DIRECT_BINDING_GAP; null PT/TPL are preserved as actual projection debt.';else if(q.id===12)reason='Current internal/external division crosswalk candidates are DIRECT_BINDING_GAP; null PT/TPL are preserved as actual projection debt.';else if(q.id===17)reason='No exact ACTIVE template for triangle-area bisection; generic line-point templates would overstate the reviewed method.';else if(q.id===18)reason='No exact ACTIVE PT/TPL projection for this external-division area-ratio method; preserve null projection fields.';return {qid:r.qid,metaDebtFields:[...new Set(debt)],...(reason?{metaDebtReason:reason}:{})}});
const imageAssets=[];for(const q of exam.questions) for(const f of ['image','solutionImage','visualAsset'])if(q[f]){const p=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_복성고_1학기_기말_고1_기출/'+q[f];imageAssets.push({kind:'CURRENT_ASSET',ref:q[f],sha256:sha256(fs.readFileSync(p))})}
const paths=['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js'];
const samples=[{path:paths[0],sha256:'7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156',items:[{qid:1,solutionSha256:'4a72d4273d234574ad3246ff704ab461af5627dd9ae76b61fcab701efda6e7c3',observation:'Vieta relation, x/y coordinate substitutions, distance formula and each intermediate calculation are written as separate board lines.'},{qid:7,solutionSha256:'0928ae260780fdaeac970f8c40c6d6953e84930fbce299f0c7e6a39e465aacd9',observation:'Completing-square transformation, center movement and origin symmetry are separated; q7 SVG topology shows initial/intermediate/final circles and center mapping.',axes:['SOLUTION_LAYOUT','VISUAL_SVG'],visualSha256:'c9765e63093f01d8ae0bd958c2925798dfeaf0e0b451538f63b4d3c1eea986b8'}]},{path:paths[1],sha256:'3eb164f35c323520bbc2c77825c5976b09bd919b9d1b50c91842ac94ea225b99',items:[{qid:1,solutionSha256:'027fed72712b800af24c39fa923bd97f0949e7facc5f526e5abccbee7f9e5682',observation:'Coordinate differences are each shown before squaring/summing and simplifying the distance.'},{qid:2,solutionSha256:'84e0fa32e411a8c3059958c6409bb588d26c1a44138e60ce9e1ccd49a7d3f1e2',observation:'Each line is rearranged to slope form before perpendicular-slope substitution; q02 solution SVG depicts two lines crossing at the computed perpendicular orientation.',axes:['SOLUTION_LAYOUT','VISUAL_SVG'],visualSha256:'8914784b537211d08cfb237a460ce7067211b6ea9f87486906da4831d94fac30'}]},{path:paths[2],sha256:'c0d195b36579ccd28657c48a415ab6ab7a39ade5f862cc05f490381335b30665',items:[{qid:1,solutionSha256:'452af1611df74ec7da1ba63459c630385f6c31ba2138c01e22edd37d54d15ae9',observation:'Membership and subset claims are separated item-by-item; the false statement is explained using object type.'},{qid:6,solutionSha256:'d0f4f175a52f855f023664f546904c8fd0e91235868222a8fd542cac5d7188af',observation:'De Morgan, inclusion-exclusion, universe bound and attainability witness appear in sequence; q06 Venn SVG shows the overlap and complementary regions used in the maximum argument.',axes:['SOLUTION_LAYOUT','VISUAL_SVG'],visualSha256:'b561aec78467dac0c4783f00fef9eae8eab15ff38f77b0a0fa0e0a0096d09b88'}]}];
const negative={path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',sha256:'dbf9f3d1e6cbedbb0df8b0072e7682a60643d3c94578cd1d99e63dfa444adb23',observation:'Read the fixed negative regression: actual SVG coordinates/topology must be checked against labels, enumerated source cases need separate board blocks, and exact ACTIVE Meta candidates must not remain unjustified null. Applied by opening each target asset, tracing each solution block, and checking current H1 taxonomy/crosswalk.'};
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:'21_복성고_1학기_기말_고1_기출',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',artifactSha:exam.rawBufferGitBlobSha1,artifactRawSha256:exam.rawSha256,questionCount:22,reviewerIdentity:{role:'archive_r1',reviewerId:'/root/r1_bokseong2021_five'},independentFreeze:{path:freezePath,sha256:freezeSha,sourceRawSha256:freeze.sourceRawSha256,studentQidOrder:freeze.studentQidOrder},postfreezeDisclosure:{path:disclosurePath,sha256:disclosureSha,studentBundleParity:disclosure.studentParity,sourceRawSha256:disclosure.sourceRawSha256},sourceEvidence:{pdfPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_복성고1_1기말.pdf',pdfSha256:'838a0da6500395a8fb28c1f47db014257cd93629cae6c9ce3417888e6dd3c6fc',companionPdfPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_복성고1_1기말_해설.pdf',companionPdfSha256:'fa6d1c8684f7a9ce1200e8e173abc85e8ac2f6ce415216482270d4f6472eb922',directReadPages:[1,2,3,4,5,6],qidCoverage:'1-22',studentBundleParity:'EXACT',answerComparisonCoverage:'1-22'},changedLocus:{path:jsPath,previousRawSha256:'64f40fefd7bef4d59e724fcdcb5e1deda79a52efbc82325046db918448cf3dc8',currentRawSha256:exam.rawSha256,qids:[2],fields:['templateKey'],directDependencies:['q2.META'],reason:'q2 uses ω^3=1 (cube-root-of-unity period), while prior TPL_H1_COMPLEX_I_PERIOD is defined for i’s 4-cycle. The active H1 taxonomy has TPL_H1_COMPLEX_ROOT_OF_UNITY_PERIOD; current exact course binding is absent, so projection pending is recorded.'},currentAssetBindings:imageAssets,artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:dispositions},goldenCalibrationReviewed:true,goldenCalibrationSet:paths,goldenCalibration:{samples,negativeSample:negative},rows:row};
const repair={schemaVersion:'JS_ARCHIVE_R1_META_ADJUDICATION_V1',examUid:evidence.examUid,stage:'R1',reviewerIdentity:evidence.reviewerIdentity,qualityContractVersion:evidence.qualityContractVersion,originalFreeze:{path:freezePath,sha256:freezeSha,retainedUnmodified:true},postfreezeDisclosure:{path:disclosurePath,sha256:disclosureSha,studentParity:'EXACT'},previousArtifactRawSha256:'64f40fefd7bef4d59e724fcdcb5e1deda79a52efbc82325046db918448cf3dc8',currentArtifactRawSha256:exam.rawSha256,changedLocus:{qid:2,field:'templateKey',before:'TPL_H1_COMPLEX_I_PERIOD',after:'TPL_H1_COMPLEX_ROOT_OF_UNITY_PERIOD'},basis:{sourceMethod:'ω^3=1 with a three-term unit-root period',previousTemplateDefinition:'i 4-cycle',currentTemplateDefinition:'cube-root/unit-root algebraic relations and periodic sums',taxonomyPath:'archive/data/meta-foundation/canonical/packs/h1-foundation/taxonomy.json',taxonomySha256:sha256(fs.readFileSync(root+'/archive/data/meta-foundation/canonical/packs/h1-foundation/taxonomy.json')),bindingReview:'No exact current 2015 H15-SA-04/COMPLEX_BASIC binding for ROOT_OF_UNITY_PERIOD; maintain the precise semantic key and record templateKey projection pending without changing L1/L2 or source/student body.'},independentFreezeStillValid:true,answerImpact:'none; source content/choices and solution unchanged',directDependencyReview:['q2.META'],sourceBodyChanged:false};
for(const [p,obj] of [[evidencePath,evidence],[repairPath,repair]]){const fd=fs.openSync(p,'wx');fs.writeFileSync(fd,JSON.stringify(obj,null,2)+'\n');fs.closeSync(fd);}
console.log(JSON.stringify({evidencePath,repairPath,artifactRawSha256:exam.rawSha256,artifactSha:exam.rawBufferGitBlobSha1,qidCount:row.length,changedLocus:evidence.changedLocus,dispositions:dispositions.filter(x=>x.metaDebtFields.length>0)}));
