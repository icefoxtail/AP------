import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { publicationBindingSha256 } from '../../../../archive/tools/archive-publication-checkpoint.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const run='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bindingPath=`${run}/registration/publication-binding.json`;
const binding=JSON.parse(fs.readFileSync(path.join(root,bindingPath),'utf8'));
const bindingSha256=publicationBindingSha256(binding);
const stagePaths={
 '24_순천고_1학기_중간_고2_확률과통계':{
  R1:`${run}/R3_24_순천고_고2_확통/R1.generic.latest-main.rev2.json`,R1err:`${run}/R3_24_순천고_고2_확통/R1.generic.latest-main.rev2.stderr.txt`,
  R2:`${run}/R3_24_순천고_고2_확통/R2.generic.latest-main.json`,R2err:`${run}/R3_24_순천고_고2_확통/R2.generic.latest-main.stderr.txt`,
  R3:`${run}/R3_24_순천고_고2_확통/R3.generic.latest-main.json`,R3err:`${run}/R3_24_순천고_고2_확통/R3.generic.latest-main.stderr.txt`,
 },
 '24_순천여고_1학기_중간_고2_수학I':{
  R1:`${run}/R3_24_순천여고_고2_수학I/R1.final-production-rebind/R1.final-production.generic.latest-main.rev3.json`,R1err:`${run}/R3_24_순천여고_고2_수학I/R1.final-production-rebind/R1.final-production.generic.latest-main.rev3.stderr.txt`,
  R2:`${run}/R3_24_순천여고_고2_수학I/R2.final-production-rebind/R2.generic.latest-main.json`,R2err:`${run}/R3_24_순천여고_고2_수학I/R2.final-production-rebind/R2.generic.latest-main.stderr.txt`,
  R3:`${run}/R3_24_순천여고_고2_수학I/R3.generic.latest-main.json`,R3err:`${run}/R3_24_순천여고_고2_수학I/R3.generic.latest-main.stderr.txt`,
 },
 '24_순천여고_1학기_중간_고2_확률과통계':{
  R1:`${run}/question-only-q22/R1.generic.latest-main.rev2.json`,R1err:`${run}/question-only-q22/R1.generic.latest-main.rev2.stderr.txt`,
  R2:`${run}/question-only-q22/R2.generic.latest-main.json`,R2err:`${run}/question-only-q22/R2.generic.latest-main.stderr.txt`,
  R3:`${run}/question-only-q22/R3_20261011/R3.generic.latest-main.json`,R3err:`${run}/question-only-q22/R3_20261011/R3.generic.latest-main.stderr.txt`,
 },
};
const rows=[];
function add(name,command,stdoutRel,stderrRel,validate){const outBytes=fs.readFileSync(path.join(root,stdoutRel)),errBytes=fs.readFileSync(path.join(root,stderrRel));const value=validate?JSON.parse(outBytes.toString('utf8').replace(/^\uFEFF/,'')):null;if(validate&&!validate(value))throw new Error('CHECK_RESULT_NOT_PASS:'+name);rows.push({name,command,status:'completed',exitCode:0,stdoutPath:stdoutRel,stdoutSha256:sha(outBytes),stderrPath:stderrRel,stderrSha256:sha(errBytes),bindingSha256});}
for(const [examUid,p] of Object.entries(stagePaths)){const target=binding.targets.find(x=>x.examUid===examUid);if(!target)throw new Error('TARGET_NOT_BOUND:'+examUid);for(const stage of ['R1','R2','R3']){const report=JSON.parse(fs.readFileSync(path.join(root,p[stage]),'utf8'));if(report.examUid!==examUid||report.stage!==stage||report.artifactSha!==target.gitBlobSha1||report.ok!==true||report.disposition!=='PASS'||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX')throw new Error('STAGE_REPORT_BINDING_FAIL:'+examUid+':'+stage);add(`${stage}:${examUid}`,`node archive/tools/archive-stage-validator.mjs --stage ${stage} --exam ${target.path} --quality-contract JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006 --execution-line CODEX --json --asset-root archive`,p[stage],p[stage+'err'],x=>x.ok===true&&x.disposition==='PASS');}}
const verifyDir=`${run}/registration/final-validation-rev4`;
for(const [label,file] of [['R3-complete:T1',`${verifyDir}/R3.complete.verify.target1.json`],['R3-complete:T2',`${verifyDir}/R3.complete.verify.target2.json`],['R3-complete:T3',`${verifyDir}/R3.complete.verify.target3.json`]])add(label,'node archive/tools/archive-codex-stage-kit.mjs verify-complete --root <bound-worktree> --event <stage-complete-event> --event-sha <worker-event-sha>',file,file.replace('.json','.stderr.txt'),x=>x.ok===true);
add('archive-registration','node archive/tools/verify-archive-registration.mjs',`${run}/registration/final-validation-rev4/verify-archive-registration.stdout.json`,`${run}/registration/final-validation-rev4/verify-archive-registration.stderr.txt`,x=>x.status==='PASS'&&x.exams===577&&x.questions===13717);
add('archive2-canonical-catalog','node archive/tools/build-archive2-catalog.mjs --check',`${run}/registration/final-validation-rev4/build-archive2-catalog.check.stdout.json`,`${run}/registration/final-validation-rev4/build-archive2-catalog.check.stderr.txt`,x=>x.exams===577&&x.questions===13717);
const runtimeOut=`${run}/registration/archive2-runtime-check.publication.stdout.txt`,runtimeErr=`${run}/registration/archive2-runtime-check.publication.stderr.txt`;const runtimeBytes=fs.readFileSync(path.join(root,runtimeOut)),runtimeText=runtimeBytes.toString('utf8'),runtimeErrBytes=fs.readFileSync(path.join(root,runtimeErr));if(!/ℹ fail 0\b/.test(runtimeText)||!/ℹ pass 42\b/.test(runtimeText))throw new Error('ARCHIVE2_RUNTIME_NOT_PASS');rows.push({name:'archive2-runtime-contract',command:'node tools/check-archive2-runtime.cjs',status:'completed',exitCode:0,stdoutPath:runtimeOut,stdoutSha256:sha(runtimeBytes),stderrPath:runtimeErr,stderrSha256:sha(runtimeErrBytes),bindingSha256});
const output=rows;
const outputPath=`${run}/registration/publication-checks.json`;fs.writeFileSync(path.join(root,outputPath),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({status:'CHECKS_BOUND',path:outputPath,bindingSha256,checkCount:rows.length,checks:rows.map(r=>({name:r.name,exitCode:r.exitCode,stdoutSha256:r.stdoutSha256,stderrSha256:r.stderrSha256}))},null,2));
