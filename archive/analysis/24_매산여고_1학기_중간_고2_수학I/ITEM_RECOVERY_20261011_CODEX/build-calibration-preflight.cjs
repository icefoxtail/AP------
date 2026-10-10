const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),cp=require('child_process');
const outPath='archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX/ITEM_RECOVERY.solution-calibration.preflight.json';
const golden=[
 {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',qids:[7,8],observations:{7:'Actual student solution derives the standard form, tracks center translation and origin reflection in separate equations, preserves radius, and ends with the exact circle; its viewed SVG correctly places the two centers and translated circle. Use for explicit intermediate algebra and visual relation labeling.',8:'Actual student solution separately derives slope/intercept sign relations, applies them to the transformed line, and checks the omitted quadrant from intercepts and slope; use for stepwise reasoning, not copied phrasing.'}},
 {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',qids:[2,3],observations:{2:'Actual student solution converts both line equations to slope-intercept form, states perpendicular-slope condition, substitutes, and concludes; viewed SVG encodes the two line directions, though this raster preview has tofu glyphs and is not used as a typography model.',3:'Actual student solution completes squares in separate x/y terms, compares the standard form, and states center and radius; use for explicit transformations and conclusion.'}}
];
const sha=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const git=p=>cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
const refs=[],items=[];
for(const sample of golden){
 const bytes=fs.readFileSync(sample.path); refs.push({path:sample.path,sha256:sha(bytes),gitBlobSha:git(sample.path)});
 const context={window:{}}; vm.runInNewContext(bytes.toString('utf8'),context,{filename:sample.path});
 const bank=context.window.questionBank||context.window.questions;
 for(const qid of sample.qids){
  const q=bank.find(x=>Number(x.id)===qid);
  const item={path:sample.path,qid,solutionSha256:sha(String(q.solution)),solutionExcerpt:String(q.solution).split('\n').slice(0,2).join('\n'),observation:sample.observations[qid]};
  if(q.solutionImage && [7,2].includes(qid)) { const asset=fs.readFileSync('archive/'+q.solutionImage); item.visualSha256=sha(asset).slice(7); item.visualPath='archive/'+q.solutionImage; item.visualObservation=qid===7?'Viewed actual preview PNG: center locations and translation vector agree with labels; the final circle is drawn at the translated center with unchanged radius.':'Viewed actual preview PNG: opposite line directions are visible; glyph fallback in this raster is noted and not treated as visual-quality exemplar.'; }
  items.push(item);
 }
}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',negBytes=fs.readFileSync(negPath);
const evidence={examUid:'24_매산여고_1학기_중간_고2_수학I',qid:21,executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',solutionQualityCalibration:{sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'TARGETED_REPAIR',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_DEFECT_SCOPE_FREEZE_THEN_REPAIR',calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],goldenSampleRefs:refs,goldenSampleQuestionRefs:items,negativeSampleRefs:[{path:negPath,sha256:sha(negBytes),gitBlobSha:git(negPath),observation:'Read regression README: actual SVG coordinate/topology must be checked, enumerated solution decisions need separate blocks, and source/runtime escape parity must be verified; it also requires current visual and Meta bindings rather than self-reported counts.'}]}};
fs.writeFileSync(outPath,JSON.stringify(evidence,null,2)+'\n');
console.log(outPath);
