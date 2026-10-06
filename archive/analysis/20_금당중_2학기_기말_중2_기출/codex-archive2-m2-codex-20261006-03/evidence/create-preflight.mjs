import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { gitBlobSha } from '../../../../../archive/tools/archive-stage-validator.mjs';
const repo=process.cwd();
const exam='.tmp/archive/archive2-m2-codex-20261006-03/20_금당중_2학기_기말_중2_기출/20_금당중_2학기_기말_중2_기출.js';
const paths=[
'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',
'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',
'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js'
];
const obs={
[paths[0]]:[
 {qid:1,observation:'내분점 좌표 공식의 비를 반대쪽 끝점에 곱하는 이유를 설명한 뒤 x좌표, y좌표, 중점, 거리 계산을 각각 실제 수식 줄로 전개한다. 중간 좌표를 숨기지 않아 좌표기하 풀이의 재현 가능성이 높다.'},
 {qid:2,observation:'직선 두 개의 기울기와 절편을 정하는 계산을 분리하고, 조건 좌표를 각 직선식에 대입해 미지수를 결정한다. 선형대수 풀이를 암묵적으로 생략하지 않는다.'}
],
[paths[1]]:[
 {qid:1,observation:'두 점의 x좌표 차와 y좌표 차를 먼저 분리한 다음 거리공식에 대입하고 제곱근을 단계적으로 간단히 한다. 중간식부터 최종값까지 작은칠판 흐름이 이어진다.'},
 {qid:2,observation:'수직 조건의 기울기 곱 관계를 설정하고 주어진 점을 대입해 미지수를 구하는 구조를 표본으로 확인한다. 조건→식 설정→대입→결론이 추적 가능하다.'}
],
[paths[2]]:[
 {qid:1,observation:'원소 관계와 부분집합 관계를 구별하는 기준을 먼저 설명하고 다섯 보기를 각자 판단한다. 보기별 참·거짓 근거와 결론이 분리되어 있어 문항 구조와 해설 구조가 대응한다.'},
 {qid:2,observation:'함수 조건에 맞는 식을 분류하며 필요조건을 명시하고 후보식을 전개·정리하여 탈락 근거를 보여준다. 오답 선택지의 핵심 오류를 학생이 재현할 수 있다.'}
]};
function bank(path){const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync(path,'utf8'),box);return box.window.questionBank;}
function ref(path){const b=fs.readFileSync(path);return {path,sha256:'sha256:'+crypto.createHash('sha256').update(b).digest('hex'),gitBlobSha:gitBlobSha(b)};}
const goldenSampleRefs=paths.map(ref);
const goldenSampleQuestionRefs=[];
for(const p of paths){for(const {qid,observation} of obs[p]){const q=bank(p).find(q=>q.id===qid);goldenSampleQuestionRefs.push({path:p,qid,solutionSha256:'sha256:'+crypto.createHash('sha256').update(String(q.solution)).digest('hex'),solutionExcerpt:String(q.solution).slice(0,75),observation});}}
const negPaths=['archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md','archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q20-solution.bad.svg'];
const negativeSampleRefs=negPaths.map(ref);
const evidence={schemaVersion:'JS_ARCHIVE_CREATE_EVIDENCE_V2',examUid:'20_금당중_2학기_기말_중2_기출',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',sourceMode:'SOURCE_ONLY_CREATE',solutionQualityCalibration:{sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],goldenSampleRefs,goldenSampleQuestionRefs,negativeSampleRefs},preflightSource:{pdf:'source/2020_금당중2_수학_2기말.pdf',sourcePdfSha256:'3f67250ab18d1455e3004bbe126b1bf803f6f5e096f26d78f5ea2c2e8c1ba1c6',pagesViewed:[1,2,3,4],referencedAssetsViewed:['q01.png','q02.png','q03.png','q04.png','q05.png','q06.png','q07.png','q08.png','q09.png','q10.png','q12.png','q13.png','q14.png','q18.png','q21.png','q22.png']},knownGoldenExceptionDisposition:{path:'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js',qid:18,decision:'NOT_USED_AS_MODEL',reason:'Known source SVG line realization defect; no use of its solution visual as positive calibration sample.'}};
fs.writeFileSync(process.argv[2],JSON.stringify(evidence,null,2)+'\n');

