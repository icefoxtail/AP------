import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { gitBlobSha } from '../../../tools/archive-stage-validator.mjs';
const root=process.cwd();
const files=[
  {path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js', qids:[2,3]},
  {path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js', qids:[1,5]},
];
const sha=b=>'sha256:'+crypto.createHash('sha256').update(b).digest('hex');
const refs=[];const qrefs=[];
for(const entry of files){const bytes=fs.readFileSync(entry.path);const sandbox={window:{}};vm.runInNewContext(bytes.toString('utf8'),sandbox);const qs=sandbox.window.questionBank; refs.push({path:entry.path,sha256:sha(bytes),gitBlobSha:gitBlobSha(bytes)});for(const qid of entry.qids){const q=qs.find(x=>x.id===qid);qrefs.push({path:entry.path,qid,solutionSha256:sha(q.solution),solutionExcerpt:q.solution.slice(0,46),observation: qid===2?'Slope condition, point substitution, and final requested sum are each explicit, allowing the student to reproduce the whole short chain.':qid===3?'The completed-square constants are balanced on both sides before reading center/radius from standard form.':qid===1?'Coordinate differences are named and evaluated before the distance formula and radical simplification.':'Set equality is used to identify forced element 3, then solve a and b and check the requested sum.'});}}
const negPath='archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';const neg=fs.readFileSync(negPath);
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'CREATE',examUid:'18_효천고_1학기_중간_고2_확률과통계',solutionQualityCalibration:{sampleReadBeforeWork:true,calibrationStatus:'PASS',solutionWorkMode:'SOURCE_ONLY_CREATE',calibrationOrder:'SAMPLES_PREFLIGHT_THEN_TARGET_BLIND_THEN_COMPARE',calibrationAxes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY'],qualityCompareCount:'0/22',goldenSampleRefs:refs,goldenSampleQuestionRefs:qrefs,negativeSampleRefs:[{path:negPath,sha256:sha(neg),gitBlobSha:gitBlobSha(neg),observation:'Read regression fixture: small-board item enumeration must remain separated; actual SVG geometry must be checked; null Meta needs lookup justification; sandbox runtime TeX escaping is part of parity.'}]}};
fs.writeFileSync(path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_효천고_1학기_중간_고2_확률과통계/CREATE.evidence.draft.json'),JSON.stringify(evidence,null,2)+'\n');
