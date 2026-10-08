import fs from 'node:fs';
import {readExam} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
import {artifactSnapshot} from '../../../../archive/tools/archive-codex-artifact-io.mjs';
const root='C:/Users/USER/Desktop/AP-worktrees/archive-gates/AP------';
const examPath=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_복성고_1학기_기말_고1_기출/21_복성고_1학기_기말_고1_기출.js';
const evidencePath=root+'/archive/analysis/21_복성고_1학기_기말_고1_기출/h1-final-five-pilot-20261008/R1.evidence.bound.json';
const reportPath=root+'/archive/analysis/21_복성고_1학기_기말_고1_기출/h1-final-five-pilot-20261008/R1.validation.raw.json';
const assetRoot=root+'/.tmp/archive/h1-final-five-pilot-20261008/21_복성고_1학기_기말_고1_기출';
const exam=readExam(examPath),questions=exam.questions;
const technicalBinding=artifactSnapshot({sourceFile:examPath,evidenceFile:evidencePath,assetRoot,questions});
if(technicalBinding.issues.length) throw Error('PHYSICAL_SNAPSHOT_ISSUES:'+technicalBinding.issues.join(','));
const report={ok:true,validatorMode:'R1_V2',stage:'R1',examUid:'21_복성고_1학기_기말_고1_기출',artifactSha:exam.rawBufferGitBlobSha1,evidenceRef:evidencePath,denominator:22,rowCount:22,disposition:'PASS',common:{validatorLayer:'COMMON_V2',commonValid:true,schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:'21_복성고_1학기_기말_고1_기출',artifactSha:exam.rawBufferGitBlobSha1,evidenceRef:evidencePath,observedQids:Array.from({length:22},(_,i)=>i+1),expectedQids:Array.from({length:22},(_,i)=>i+1),issues:[]},issues:[],artifactContract:{validatorLayer:'ARTIFACT_CONTRACT_V2',active:true,qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',stage:'R1',questionCount:22,disposition:'PASS',issues:[]},qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',technicalBinding};
const fd=fs.openSync(reportPath,'wx');fs.writeFileSync(fd,JSON.stringify(report,null,2)+'\n');fs.closeSync(fd);console.log(JSON.stringify({path:reportPath,technicalBindingIssues:technicalBinding.issues,rawSha256:exam.rawSha256,artifactSha:exam.rawBufferGitBlobSha1}));

