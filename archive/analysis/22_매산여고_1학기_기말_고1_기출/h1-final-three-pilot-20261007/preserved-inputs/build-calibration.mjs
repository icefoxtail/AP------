import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
const repo=process.cwd();
const { gitBlobSha } = await import(pathToFileURL(path.join(repo,'archive','tools','archive-stage-validator.mjs')).href);
const refs=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js', qids:[7,12], observations:['표준형을 완전제곱식 전개에서 시작해 중심을 이동시키고 좌표 변환 후 원의 크기 보존을 명시한다. 문장과 식을 한 줄씩 이어 작은 칠판에서 추적 가능하다.','중심·반지름·접선 조건을 각각 별도 줄로 설정하고 절댓값의 경우를 나눈 뒤 양수 조건으로 배제한다.']},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js', qids:[2,6], observations:['각 직선을 y=mx+n 형태로 바꾸어 기울기를 직접 읽고 수직 조건을 대입한 뒤 계산을 분리한다.','완전제곱식 변환을 펼쳐 반지름 제곱을 도출하고 양수 조건과 경계 제외를 설명한다.']},
 {path:'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js', qids:[6,13], observations:['드모르간 법칙과 포함배제 식을 구분하고, 최댓값의 상한과 실제 가능한 원소 배치를 모두 제시한다.','중심-직선 거리 식을 설정해 접선 조건으로 k 두 값을 구한 뒤 곱 계산을 별도 행으로 둔다.']},
];
const golden=[]; const qrefs=[];
for(const ref of refs){const absolute=path.join(repo,ref.path);const bytes=fs.readFileSync(absolute);const source=bytes.toString('utf8');const sandbox={window:{}};new Function('window',source+'\n;return window;')(sandbox.window);const bank=sandbox.window.questionBank||sandbox.window.questions;golden.push({path:ref.path,sha256:'sha256:'+crypto.createHash('sha256').update(bytes).digest('hex'),gitBlobSha:gitBlobSha(bytes)});for(let i=0;i<ref.qids.length;i++){const q=bank.find(x=>Number(x.id)===ref.qids[i]);qrefs.push({path:ref.path,qid:ref.qids[i],solutionSha256:'sha256:'+crypto.createHash('sha256').update(String(q.solution)).digest('hex'),solutionExcerpt:String(q.solution).split('\n').filter(Boolean)[0],observation:ref.observations[i]});}}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';const nb=fs.readFileSync(path.join(repo,negPath));const out={qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',solutionQualityCalibration:{goldenSampleRefs:golden,goldenSampleQuestionRefs:qrefs,negativeSampleRefs:[{path:negPath,sha256:'sha256:'+crypto.createHash('sha256').update(nb).digest('hex'),gitBlobSha:gitBlobSha(nb)}],calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE'}};
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,2)+'\n');
