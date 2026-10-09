import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root=process.cwd(),ev='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/ITEM_RECOVERY.v1',oldRel=ev+'/ITEM_RECOVERY.generic-v2-create-validator-input.json',outRel=ev+'/ITEM_RECOVERY.generic-v2-create-validator-input.revision01.json';
const H=b=>crypto.createHash('sha256').update(b).digest('hex'),abs=r=>path.resolve(root,r),old=JSON.parse(fs.readFileSync(abs(oldRel),'utf8'));
const meta=JSON.parse(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.meta-fresh-assessment.json'),'utf8'));
const student=JSON.parse(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.current-student-only.revision02.json'),'utf8'));
const self=JSON.parse(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.blind-self-check.json'),'utf8'));
const choice=JSON.parse(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.choice-design.json'),'utf8'));
const rows=new Map(meta.targetRows.map(r=>[r.qid,r]));
const studentRows=new Map(student.rows.map(r=>[Number(r.qid),r]));
const selfRows=new Map(self.rows.map(r=>[r.qid,r]));
const choiceRows=new Map(choice.rows.map(r=>[r.qid,r]));
const out=structuredClone(old);out.replacementExecution='DIRECT_AUTHORING_NO_GENERATION_PIPELINE';out.usedAliveGenerator=false;out.validatorWireNote='ALIVE_REPLACEMENT is used only as the supported CREATE_V2 replacement provenance category. This action is ITEM_RECOVERY direct authoring; no ALIVE generator or pipeline was invoked.';
for(const qid of [9,10,18,19]){
  const row=out.rows.find(r=>r.qid===qid),m=rows.get(qid),sp=studentRows.get(qid),sc=selfRows.get(qid),ch=choiceRows.get(qid);
  if(!row||!m||!sp||!sc||!ch)throw Error('TARGET_PROOF_MISSING:'+qid);
  row.sourceMode='ALIVE_REPLACEMENT';
  row.sourceModeExplanation='CREATE_V2 wire enum ALIVE_REPLACEMENT only; explicit top-level executionAction=ITEM_RECOVERY, replacementExecution=DIRECT_AUTHORING_NO_GENERATION_PIPELINE, usedAliveGenerator=false.';
  row.provenanceEvidence.curriculum={curriculum:'2015',standardCourse:m.standardCourse,standardUnitKey:m.standardUnitKey,standardUnit:m.standardUnit,subUnitKey:m.subUnitKey,subUnit:m.subUnit,registeredActive:true,masterPath:'archive/data/master_tables/js_archive_tag_master.json',masterRawSha256:meta.compiledTagMasterRawSha256,assessmentRef:{path:ev+'/ITEM_RECOVERY.meta-fresh-assessment.json',sha256:H(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.meta-fresh-assessment.json')))},reason:'Fresh solution-based classification of the authored replacement; no original-PDF content is claimed for the new body.'};
  row.provenanceEvidence.answerCardinality={responseForm:qid===19?'SUBJECTIVE_EXACT_SYMBOLIC':'OBJECTIVE_FIVE_CHOICE',choiceCount:qid===19?0:5,correctChoiceCount:qid===19?1:sc.correctChoiceCount,answerPosition:ch.answer??null,studentPayloadSha256:sp.studentPayloadSha256,proofRef:{path:ev+'/ITEM_RECOVERY.blind-self-check.json',sha256:H(fs.readFileSync(abs(ev+'/ITEM_RECOVERY.blind-self-check.json')))},uniquenessProof:sc.reSolve,choiceAudit:ch.routes,solutionSha256:row.solutionSha256};
}
const keys=Object.keys(old),next=Object.keys(out);const changedTopLevel=[...new Set([...keys,...next])].filter(k=>JSON.stringify(old[k])!==JSON.stringify(out[k])&&k!=='rows').sort();
const oldBy=new Map(old.rows.map(r=>[r.qid,r]));const changedRows=[];for(const r of out.rows){if(JSON.stringify(oldBy.get(r.qid))!==JSON.stringify(r)){const prior=oldBy.get(r.qid);const fields=[...new Set([...Object.keys(prior),...Object.keys(r)])].filter(k=>JSON.stringify(prior[k])!==JSON.stringify(r[k]));if(![9,10,18,19].includes(r.qid))throw Error('NON_TARGET_EVIDENCE_CHANGED:'+r.qid);changedRows.push({qid:r.qid,fields});}}
if(changedRows.length!==4)throw Error('TARGET_EVIDENCE_REVISION_SCOPE_INVALID');
const outPath=abs(outRel);fs.writeFileSync(outPath,JSON.stringify(out,null,2)+'\n',{flag:'wx'});const bytes=fs.readFileSync(outPath);console.log(JSON.stringify({path:outPath,sha256:H(bytes),sourceArtifactSha:out.artifactSha,sourceArtifactRawSha256:out.artifactRawSha256,executionAction:out.executionAction,replacementExecution:out.replacementExecution,usedAliveGenerator:out.usedAliveGenerator,changedTopLevel,changedTargetRows:changedRows,nonTargetEvidenceRowsChanged:0,candidateJSChanged:false,currentStudentPayloadHashesPreserved:true},null,2));