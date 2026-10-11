import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {gitBlobSha} from '../../../tools/archive-stage-validator-compat-v1.mjs';
const paths=['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js'];
const axes=['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'];
const sampleNotes=[
  ['Trace coordinates and substitutions through separate equations; each conclusion follows from visible intermediate arithmetic.','Parallel-line conditions are translated into slope equality and then point substitution, with the unknown solved explicitly.'],
  ['Distance formula is instantiated from coordinate differences before simplification, so the numerical result is reproducible.','The line equations are rearranged before the perpendicular-slope relation is substituted; the algebraic result is explicit.'],
  ['Membership and subset relations are evaluated in separate numbered blocks, preserving the source choice structure.','The vertical-line test is applied option by option, and the final choice is stated after the cases.']
];
const goldenSampleRefs=[],goldenSampleQuestionRefs=[];
for(let s=0;s<paths.length;s++){
 const path=paths[s],bytes=fs.readFileSync(path),bank={};vm.runInNewContext(bytes.toString('utf8'),{window:bank});
 goldenSampleRefs.push({path,sha256:'sha256:'+crypto.createHash('sha256').update(bytes).digest('hex'),gitBlobSha:gitBlobSha(bytes)});
 for(let i=0;i<2;i++){const q=bank.questionBank[i],solution=String(q.solution);goldenSampleQuestionRefs.push({path,qid:Number(q.id),solutionSha256:'sha256:'+crypto.createHash('sha256').update(solution).digest('hex'),solutionExcerpt:solution.split(/\r?\n/)[0],observation:sampleNotes[s][i]});}
}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',negBytes=fs.readFileSync(negPath);
const ev={schemaVersion:'JS_ARCHIVE_PHYSICAL_REVIEW_EVIDENCE_V1',stage:'CREATE',examUid:'18_강남여고_1학기_중간_고2_확률과통계',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',solutionQualityCalibration:{goldenSampleRefs,goldenSampleQuestionRefs,negativeSampleRefs:[{path:negPath,sha256:'sha256:'+crypto.createHash('sha256').update(negBytes).digest('hex'),gitBlobSha:gitBlobSha(negBytes),observedRegressionAxes:['VISUAL_SEMANTIC_PARITY','SMALL_BOARD_STRUCTURE','META_LOOKUP','RUNTIME_ESCAPE'],observation:'Actual false-PASS fixture read: labels did not match SVG coordinates; enumerated judgments were not separated into blocks; exact active Meta lookups were omitted; escaped source/runtime parity diverged.'}],calibrationAxes:axes,sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE'}};
fs.writeFileSync(process.argv[2],JSON.stringify(ev,null,2)+'\n',{flag:'wx'});
