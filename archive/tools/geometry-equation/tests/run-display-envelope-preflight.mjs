/** Measurement-only real Archive profile probes; no source bank or asset is changed. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {measureArchiveDisplayEnvelope} from '../record-visual-browser-evidence.mjs';
import {repoRoot} from '../visual-browser-runtime.mjs';

const targets=[
  {id:'geometry-q01',sourcePath:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',ordinal:1,sourceAuthorityStatus:'QID_V1_MAP_MEASUREMENT_ONLY'},
  {id:'graph-q10',sourcePath:'archive/exams/original/middle/m3/1final/25_연향중_1학기_기말_중3_기출c.js',ordinal:10,sourceAuthorityStatus:'QID_V1_MAP_MEASUREMENT_ONLY'},
  {id:'coordinate-free-geometry-q01',sourcePath:'archive/exams/original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js',ordinal:1,sourceAuthorityStatus:'QID_V1_MAP_MEASUREMENT_ONLY'},
];
const runId='visual-envelope-preflight-'+crypto.randomUUID();
const summaries=[];
for(const target of targets){
  const examUid=path.basename(target.sourcePath,'.js');
  const run=path.join(repoRoot,'.tmp','archive',runId,examUid,'visual-engine','production','preflight');
  fs.mkdirSync(run,{recursive:true});
  const result=await measureArchiveDisplayEnvelope({
    run,sourceRef:fileRef(repoRoot,target.sourcePath),sourceOrdinal:target.ordinal,targetId:target.id,
    intrinsicSvg:{width:384,height:320},sizeClasses:['small','medium','large','full'],
    sourceAuthorityStatus:target.sourceAuthorityStatus
  });
  const evidence={schemaVersion:'APMATH_ARCHIVE_DISPLAY_ENVELOPE_MEASUREMENT_v1',measurementOnly:true,productionAuthorized:false,qualificationStatus:'NOT_QUALIFIED',target:{...target,examUid},runId,workRoot:path.relative(repoRoot,run).replaceAll('\\','/'),sourceRef:result.sourceRef,candidateRef:result.candidateRef,matrixSha256:result.matrixSha256,archiveStatus:result.archive.status,browserVersion:result.rowEvidence.browserVersion,observation:result.observation,captureFolder:path.relative(repoRoot,result.captureFolder).replaceAll('\\','/')};
  const pathOut=path.join(run,'display-envelope-measurement.json');fs.writeFileSync(pathOut,JSON.stringify(evidence,null,2)+'\n');
  summaries.push({id:target.id,status:result.status,sourceSha256:result.sourceRef.sha256,qBoxBorderBoxWidth:result.observation.qBoxRect.width,solutionMetaBorderBoxWidth:result.observation.solutionMetaRect.width,solutionMetaContentWidth:result.observation.solutionMetaContentWidth,profiles:result.observation.profiles.map(p=>({sizeClass:p.sizeClass,width:p.imageRect.width,height:p.imageRect.height,maxWidth:p.computedStyle.maxWidth,maxHeight:p.computedStyle.maxHeight,objectFit:p.computedStyle.objectFit}))});
}
const summary={status:summaries.every(v=>v.status==='PASS')?'PASS':'FAIL',scope:'ACTUAL_ARCHIVE_DISPLAY_POLICY_MEASUREMENT_ONLY_NO_CANONICAL_UID_AUTHORITY',productionAuthorized:false,qualificationStatus:'NOT_QUALIFIED',runId,targets:summaries};
const summaryPath=path.join(repoRoot,'.tmp','archive',runId,'engine-infrastructure','visual-engine','production','summary.json');fs.mkdirSync(path.dirname(summaryPath),{recursive:true});fs.writeFileSync(summaryPath,JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary));if(summary.status!=='PASS')process.exitCode=1;
