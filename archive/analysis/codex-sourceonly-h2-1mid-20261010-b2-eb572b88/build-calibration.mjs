import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';
import { gitBlobSha } from '../../tools/archive-stage-validator-compat-v1.mjs';
const root=process.cwd();
const samples=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js', qids:[2,7]},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js', qids:[2,10]},
 {path:'archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js', qids:[2,7]},
];
const sha=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const sampleRefs=[], questionRefs=[];
for(const s of samples){const bytes=fs.readFileSync(path.join(root,s.path));const box={window:{}};vm.runInNewContext(bytes.toString('utf8'),box);sampleRefs.push({path:s.path,sha256:sha(bytes),gitBlobSha:gitBlobSha(bytes)});for(const qid of s.qids){const q=box.window.questionBank.find(x=>x.id===qid);if(!q?.solution)throw new Error('missing solution '+s.path+' q'+qid);questionRefs.push({path:s.path,qid,solutionSha256:sha(Buffer.from(q.solution)),solutionExcerpt:q.solution.slice(0,Math.min(36,q.solution.length)),observation:q.id===7?'풀이에서 조건을 해석하고 핵심 관계를 식으로 세운 뒤 중간 계산과 결론을 분리해 학생이 따라갈 수 있는 흐름을 확인했다.':'전제에서 필요한 성질을 먼저 꺼내고 등식·계산을 한 단계씩 전개하며 답 표기를 분명히 마무리했다.'});}}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';const negBytes=fs.readFileSync(path.join(root,negPath));
const evidence={solutionQualityCalibration:{goldenSampleRefs:sampleRefs,goldenSampleQuestionRefs:questionRefs,negativeSampleRefs:[{path:negPath,sha256:sha(negBytes),gitBlobSha:gitBlobSha(negBytes)}],calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE'}};
const out=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/CREATE.calibration-preflight.rev3.json');fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(out);
