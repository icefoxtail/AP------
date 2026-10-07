import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {gitBlobSha} from '../../../tools/archive-stage-validator.mjs';
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const sets=[
 {path:'archive/exams/original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js',ids:[1,5]},
 {path:'archive/exams/original/middle/m3/2final/25_신흥중_2학기_기말_중3_기출.js',ids:[1,7]},
 {path:'archive/exams/original/middle/m3/2final/25_금당중_2학기_기말_중3_기출.js',ids:[1,8]}
];
const samples=[];
for(const set of sets){
 const abs=`${root}/${set.path}`.replaceAll('\\','/'); const bytes=fs.readFileSync(abs); const ctx={window:{}}; vm.runInNewContext(bytes.toString('utf8'),ctx,{timeout:1000});
 samples.push({path:set.path,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),gitBlobSha:gitBlobSha(bytes),items:ctx.window.questionBank.filter(q=>set.ids.includes(Number(q.id))).map(q=>({qid:Number(q.id),solutionSha256:crypto.createHash('sha256').update(String(q.solution||''),'utf8').digest('hex'),solutionExcerpt:String(q.solution||''),observation:q.id===1?'읽은 실제 solution은 필요 성질→수치 대입→중간 제곱식→양의 길이 선택→최종 선택지를 분리한다.':q.id===5?'읽은 실제 solution은 지름이 만드는 중심각→보각으로 남은 중심각→이등변삼각형 밑각 계산→정답으로 전개한다.':q.id===7?'읽은 실제 solution은 외부 두 할선의 호 차를 각각 식으로 놓고 360° 전체 호 합에 대입해 원주각으로 마무리한다.':'읽은 실제 solution은 원주각에서 호를 계산하고 교차현 각 정리를 수식으로 대입한 뒤 나머지 호와 최종 답을 계산한다.'}))})
}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md'; const nb=fs.readFileSync(`${root}/${negPath}`);
const evidence={qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'CREATE',examUid:'19_왕운중_2학기_기말_중3_기출',performedBeforeTargetSolutionAuthoring:true,protocol:'JS아카이브_학생용해설_운영규칙_v1.md §3/§6/§11; Archive_작업전_Golden_Sample_Calibration_v1.md §2-§5; source-only fresh-solve → sample calibration → target authoring',solutionWorkMode:'SOURCE_ONLY_FRESH_CREATE',calibrationOrder:['target source/PDF visual answer freeze','three current m3 Golden samples read','current cross-axis Negative fixture read','target solution authoring'],goldenCalibrationSet:samples.map(s=>s.path),samples,negativeSample:{path:negPath,sha256:crypto.createHash('sha256').update(nb).digest('hex'),gitBlobSha:gitBlobSha(nb),observation:'README directly read: actual SVG primitives/coordinates must be checked, enumerated judgments must each have separate reasoning blocks, exact-active Meta lookup prevents false null, evaluated runtime must catch doubled TeX escapes.'},calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],calibrationConclusions:['Keep the decisive equation and each transformation as explicit lines; never substitute prose for an omitted calculation.','For enumerated statements, separate each judgment; do not accept a self-reported count without checking actual structure.','For figures, bind claims to the actual geometry; exact student text and evaluated runtime TeX are separate checks.','Samples set a quality floor only; target answers and curriculum decisions remain source-derived.'],sampleReadBeforeWork:true,calibrationStatus:'PASS',qualityCompareCount:'PENDING_FINAL_SOLUTION'};
fs.writeFileSync(`${root}/archive/analysis/m3-codex-20261007/19_왕운중_2학기_기말_중3_기출/CREATE.solution-preflight.json`,JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify({path:`${root}/archive/analysis/m3-codex-20261007/19_왕운중_2학기_기말_중3_기출/CREATE.solution-preflight.json`,samples:samples.map(s=>({path:s.path,sha256:s.sha256,gitBlobSha:s.gitBlobSha,items:s.items.map(i=>({qid:i.qid,solutionSha256:i.solutionSha256}))})),negativeSample:evidence.negativeSample},null,2));

