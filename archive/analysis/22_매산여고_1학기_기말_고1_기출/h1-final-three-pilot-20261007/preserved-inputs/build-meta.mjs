import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const root=process.cwd(),uid='22_매산여고_1학기_기말_고1_기출';
const tmp=path.join(root,'.tmp','archive','h1-final-three-pilot-20261007',uid);
const evidenceRoot=path.join(root,'archive','analysis',uid,'h1-final-three-pilot-20261007');
const jsPath=path.join(tmp,`${uid}.js`);
const productionPath=`archive/exams/original/high/h1/1final/${uid}.js`;
const {buildResolverDecisionEvidence}=await import(pathToFileURL(path.join(root,'archive','tools','meta-foundation','rpm-active-resolver.mjs')).href);
const sha=value=>'sha256:'+crypto.createHash('sha256').update(value).digest('hex');
const paths={
1:['방정식과 부등식','여러 가지 부등식','이차부등식','근의 위치와 해'],
2:['도형의 방정식','직선의 방정식','두 직선의 위치 관계','수직'],
3:['도형의 방정식','원의 방정식','원과 직선','교점 개수'],
4:['방정식과 부등식','복소수','i의 거듭제곱','복소수 조건'],
5:['방정식과 부등식','여러 가지 방정식','방정식의 활용','근의 조건'],
6:['도형의 방정식','직선의 방정식','두 직선의 위치 관계','교점'],
7:['방정식과 부등식','여러 가지 부등식','이차부등식','근의 위치와 해'],
8:['도형의 방정식','평면좌표','선분의 내분·외분','내분점'],
9:['도형의 방정식','평면좌표','선분의 내분·외분','외분점'],
10:['방정식과 부등식','여러 가지 방정식','삼차·사차방정식','치환형'],
11:['방정식과 부등식','이차방정식과 이차함수','직선과 포물선','교점 개수'],
12:['도형의 방정식','평면좌표','삼각형의 무게중심','좌표 도형 활용'],
13:['방정식과 부등식','여러 가지 부등식','이차부등식','근의 위치와 해'],
14:['도형의 방정식','직선의 방정식','점과 직선 사이의 거리','도형의 넓이·최소거리'],
15:['도형의 방정식','평면좌표','선분의 내분·외분','외분점'],
16:['도형의 방정식','원의 방정식','원의 접선','기울기가 주어진 접선'],
17:['도형의 방정식','평면좌표','두 점 사이의 거리','도형의 변 길이'],
18:['도형의 방정식','평면좌표','삼각형의 무게중심','좌표로 무게중심'],
19:['도형의 방정식','직선의 방정식','직선의 방정식','두 점을 지나는 직선'],
20:['방정식과 부등식','이차방정식','이차방정식의 근','판별식'],
21:['도형의 방정식','원의 방정식','원과 직선','교점 개수'],
22:['방정식과 부등식','여러 가지 부등식','연립일차부등식','정수해'],
};
const box={window:{}};vm.runInNewContext(fs.readFileSync(jsPath,'utf8'),box);const questions=box.window.questionBank;
const resolverRows=[];
for(const q of questions){
 const [majorUnit,midUnit,l3,l4]=paths[q.id];
 const refs={sourceArchiveFile:productionPath,questionUid:`${uid}#${q.id}`,sourceIdentityKey:`${uid}#${q.id}`,sourceOrdinal:q.id,
   contentHash:sha(q.content),choicesHash:sha(JSON.stringify(q.choices)),imageRefHash:sha(q.image||'')};
 const input={sourceIdentity:refs,solutionIdentity:{status:'VERIFIED_FINAL',independentVerification:true,solutionHash:sha(q.solution)},
   curriculumContext:{grade:'H1',curriculum:'2015',scope:'수학_상',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey},
   semanticDecision:{primaryMethod:q.decisiveStep,decisiveStep:q.decisiveStep,rpmPath:{curriculum:'2015',scope:'수학_상',majorUnit,midUnit,l3,l4}}};
 const output=buildResolverDecisionEvidence(input,{repoRoot:root});
 const ev=output.resolverEvidence;
 q.problemTypeKey=ev.problemTypeKey||ev.mappedProblemTypeKey||null;
 q.templateKey=ev.templateKey||null;
 if(q.templateKey&&!q.problemTypeKey) q.templateKey=null;
 resolverRows.push({qid:q.id,resolverInput:input,...output});
}
fs.writeFileSync(jsPath,`window.examTitle = ${JSON.stringify(uid)};\n\nwindow.questionBank = ${JSON.stringify(questions,null,2)};\n`,'utf8');
fs.mkdirSync(evidenceRoot,{recursive:true});
fs.writeFileSync(path.join(evidenceRoot,'CREATE.meta-resolver-evidence.json'),JSON.stringify({schemaVersion:'CREATE_META_PHYSICAL_LOOKUP_v1',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',examUid:uid,sourceOnlyFinalResolutionCount:questions.length,rows:resolverRows},null,2)+'\n','utf8');
console.log(JSON.stringify(resolverRows.map(x=>({qid:x.qid,disposition:x.resolverEvidence.disposition,semanticStatus:x.resolverEvidence.semanticStatus,projectionStatus:x.resolverEvidence.projectionStatus,problemTypeKey:x.resolverEvidence.problemTypeKey||x.resolverEvidence.mappedProblemTypeKey||null,templateKey:x.resolverEvidence.templateKey||null,validation:x.validation.status,reason:x.resolverEvidence.reasonCode||x.resolverEvidence.projectionReasonCode||''})),null,2));
