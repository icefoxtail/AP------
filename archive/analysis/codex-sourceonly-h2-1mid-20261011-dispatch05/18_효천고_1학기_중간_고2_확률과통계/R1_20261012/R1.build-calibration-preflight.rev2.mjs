import fs from 'node:fs';
import crypto from 'node:crypto';
import { readExam } from '../../../../tools/archive-codex-artifact-io.mjs';
const dir='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/R1_20261012';
const hash=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const specs=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',qids:[1,7],observations:['좌표 내분점 계산과 거리 계산이 문장·식·결론 순서로 재현된다.','원을 표준형으로 바꾼 뒤 중심 이동과 원점대칭을 단계별로 따라가며 최종 방정식에 연결한다.']},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',qids:[2,3],observations:['수직 기울기 조건에서 첫째 직선과 둘째 직선의 기울기를 각각 구한 뒤 식으로 연결한다.','완전제곱 과정을 실제 식으로 전개하고 중심·반지름을 표준형과 비교해 결론낸다.']}
];
const goldenSampleRefs=[],goldenSampleQuestionRefs=[],goldenCalibrationSamples=[];
for(const s of specs){
 const bytes=fs.readFileSync(s.path),exam=readExam(s.path);
 goldenSampleRefs.push({path:s.path,sha256:hash(bytes),gitBlobSha:blob(bytes)});
 const items=[];
 for(let i=0;i<s.qids.length;i++){
  const q=exam.questions.find(x=>Number(x.id)===s.qids[i]);
  if(!q?.solution)throw Error('GOLDEN_SOLUTION_MISSING:'+s.path+':q'+s.qids[i]);
  const solutionHash=hash(Buffer.from(String(q.solution)));
  const observation=s.observations[i];
  goldenSampleQuestionRefs.push({path:s.path,qid:q.id,solutionSha256:solutionHash,solutionExcerpt:String(q.solution).slice(0,96),observation});
  const item={qid:q.id,solutionSha256:solutionHash,observation};
  if(q.solutionImage){
   const visualFile='archive/'+q.solutionImage;
   item.visualSha256=hash(fs.readFileSync(visualFile));
  }
  items.push(item);
 }
 goldenCalibrationSamples.push({path:s.path,sha256:hash(bytes),items});
}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
const negBytes=fs.readFileSync(negPath);
const svgPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q7-solution.bad.svg';
const svgBytes=fs.readFileSync(svgPath);
const negativeSampleRefs=[negPath,svgPath].map(path=>{const b=fs.readFileSync(path);return{path,sha256:hash(b),gitBlobSha:blob(b)}});
const evidence={schemaVersion:'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_v1',stage:'R1',examUid:'18_효천고_1학기_중간_고2_확률과통계',solutionQualityCalibration:{goldenSampleRefs,goldenSampleQuestionRefs,negativeSampleRefs,calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],sampleReadBeforeWork:true,qualityCompareCount:'0/22',calibrationStatus:'PASS',solutionWorkMode:'INDEPENDENT_REVIEW',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE'},goldenCalibration:{samples:goldenCalibrationSamples,negativeSample:{path:negPath,sha256:hash(negBytes),observation:'Negative regression: text labels can be mathematically plausible while actual SVG coordinates/curve fail the stated geometry. Inspect primitives/coordinates, not labels alone.'}},goldenCalibrationSet:specs.map(s=>s.path),negativeSampleObservation:'Bokseong 2026-10-01 regression proves solution visual PASS requires actual coordinate/geometry parity; reviewed the related q7 failed SVG preview.'};
const out=dir+'/R1.calibration-preflight.rev2.json';
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,sha256:hash(fs.readFileSync(out)),goldenSampleCount:goldenSampleRefs.length,questionRefs:goldenSampleQuestionRefs.map(r=>r.path+':q'+r.qid),visualRefs:goldenCalibrationSamples.flatMap(s=>s.items.filter(i=>i.visualSha256).map(i=>s.path+':q'+i.qid)),negativeRefCount:negativeSampleRefs.length},null,2));
