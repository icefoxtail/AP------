#!/usr/bin/env node
// R3 target-only regression: execute the repository's official resolver, never infer PT/TPL.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildDecisionIsolatedInput, buildResolverDecisionEvidence, questionUidForSource } from './rpm-active-resolver.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const qname = '26_제일고_2학기_중간_고2_확률과통계';
const relative = 'archive/exams/original/high/h2/2mid/' + qname + '.js';
const source = fs.readFileSync(path.join(root, relative), 'utf8');
const m = source.match(/window\.questionBank\s*=\s*(\[[\s\S]*\]);?\s*$/);
assert(m, 'STUDENT_JS_QUESTION_BANK_MISSING');
const questions = JSON.parse(m[1]);
assert.equal(questions.length, 21);
const sha = v => crypto.createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const specs = {
  1: { l3:'순열', l4:'중복·원순열', major:'경우의 수', mid:'순열과 조합',
    crosswalk:'H2-PS-RPM-033', template:'TPL_REPEATED_PERMUTATION_ASSIGNMENT', pt:'PT_COUNTING_REPEATED_ASSIGNMENT',
    method:'중복순열의 정의에 따른 거듭제곱', step:'(2n)^2=64, n=4' },
  7: { l3:'순열', l4:'중복·원순열', major:'경우의 수', mid:'순열과 조합',
    crosswalk:'H2-PS-RPM-033', template:'TPL_IDENTICAL_OBJECT_PERMUTATION', pt:'PT_COUNTING_ARRANGEMENT',
    method:'같은 문자가 있는 순열의 상대적 순서 제약', step:'전체 3360가지 중 2/12 비율로 560가지' },
  13: { l3:'순열', l4:'중복·원순열', major:'경우의 수', mid:'순열과 조합',
    crosswalk:'H2-PS-RPM-033', template:'TPL_REPEATED_PERMUTATION_ASSIGNMENT', pt:'PT_COUNTING_REPEATED_ASSIGNMENT',
    method:'중복순열과 인접사건 포함배제', step:'16+16+16-4-4-1+1=40' },
  10: { l3:'조건부확률', l4:'조건부확률 계산', major:'확률', mid:'조건부확률',
    pt:'PT_CONDITIONAL_PROBABILITY', template:'TPL_CONDITIONAL_PROBABILITY_DIRECT',
    method:'진단 조건에 따른 확률의 합', step:'0.15*0.9+0.85*0.7=0.730' },
  20: { l3:'조건부확률', l4:'조건부확률 계산', major:'확률', mid:'조건부확률',
    pt:'PT_CONDITIONAL_PROBABILITY', template:'TPL_CONDITIONAL_PROBABILITY_DIRECT',
    method:'사후 정보에서 조건부확률 계산', step:'(1/3)/(1/2)=2/3' }
};
const outDir = path.join(root, 'archive/_generated/jeil26-r3-meta');
fs.mkdirSync(outDir, {recursive:true});
const rows = [];
for(const [idText,spec] of Object.entries(specs)) {
  const id = Number(idText), q = questions.find(x=>x.id === id);
  assert(q, 'QID_NOT_FOUND:' + id);
  const sourceId = questionUidForSource(relative,id);
  const input = {
    sourceIdentity:{
      sourceArchiveFile:relative, sourceOrdinal:id, questionUid:sourceId,
      sourceIdentityKey:sourceId, contentHash:sha(q.content),
      choicesHash:sha(q.choices), imageRefHash:sha(q.image || '') },
    solutionIdentity:{status:'VERIFIED_FINAL',independentVerification:true,solutionHash:sha(q.solution)},
    curriculumContext:{grade:'H2',curriculum:'2022',scope:'확률과통계',subjectFamily:'',
      standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey},
    semanticDecision:{primaryMethod:spec.method,decisiveStep:spec.step,rpmPath:{
      curriculum:'2022',scope:'확률과통계',majorUnit:spec.major,midUnit:spec.mid,l3:spec.l3,l4:spec.l4}}
  };
  if(spec.crosswalk){
    const isolated=buildDecisionIsolatedInput(input);
    input.familyTemplateSelection={stage:'POST_CROSSWALK',inputBundleSha:isolated.inputBundleSha,
      crosswalkRecordId:spec.crosswalk,templateKey:spec.template,
      decisiveStepReason:spec.method + ': ' + spec.step};
  }
  const inputPath='archive/_generated/jeil26-r3-meta/q'+String(id).padStart(2,'0')+'.input.json';
  const outPath='archive/_generated/jeil26-r3-meta/q'+String(id).padStart(2,'0')+'.r3.json';
  fs.writeFileSync(path.join(root,inputPath),JSON.stringify(input,null,2)+'\n');
  const official=buildResolverDecisionEvidence(input,{repoRoot:root});
  const r=official.resolverEvidence;
  const projection={qid:id,validation:official.validation.status, semanticStatus:r.semanticStatus,
    projectionStatus:r.projectionStatus,pt:r.problemTypeKey,tpl:r.templateKey,
    expectedPT:spec.pt,expectedTPL:spec.template,reason:r.projectionReasonCode};
  rows.push(projection);
  assert.equal(official.validation.status,'PASS','OFFICIAL_VALIDATION_FAILED q'+id+' '+JSON.stringify(official.validation.errors));
  assert.equal(r.semanticStatus,'FINAL','SEMANTIC_NOT_FINAL q'+id);
  assert.equal(r.projectionStatus,'PROJECTION_REUSE','PROJECTION_NOT_REUSED q'+id+' '+r.projectionReasonCode);
  assert.equal(r.problemTypeKey,spec.pt,'PT_MISMATCH q'+id);
  assert.equal(r.templateKey,spec.template,'TPL_MISMATCH q'+id);
  assert.equal(q.problemTypeKey,spec.pt,'STUDENT_JS_PT_MISMATCH q'+id);
  assert.equal(q.templateKey,spec.template,'STUDENT_JS_TPL_MISMATCH q'+id);
  // R3 stage receipt is deliberately not called final without relational/difficulty evidence.
  let stageExit=0;
  try {execFileSync(process.execPath,['archive/tools/meta-foundation/stage-meta-bridge.mjs','--stage','R3','--input',inputPath,'--out',outPath],
     {cwd:root,encoding:'utf8',stdio:'pipe'});}
  catch(e){stageExit=e.status??1; if(stageExit!==2)throw e;}
  const stage=JSON.parse(fs.readFileSync(path.join(root,outPath),'utf8'));
  assert.equal(stage.resolverValidation,'PASS');
  assert.equal(stage.projectionStatus,'PROJECTION_REUSE');
  assert.equal(stage.metaStatus,'EVIDENCE_INCOMPLETE');
  assert.equal(stageExit,2);
}
const receipt={schema:'JEIL26_OFFICIAL_R3_RESOLVER_5Q_v1',studentJsSha256:sha(source),count:rows.length,
  projectionReusedCount:rows.filter(x=>x.projectionStatus==='PROJECTION_REUSE').length,
  note:'Official stage R3 bridge runs but META_FINALIZATION_PASS requires valid relational and independent difficulty packets. Do not treat as full R3 quality PASS.',
  rows};
fs.writeFileSync(path.join(outDir,'OFFICIAL_R3_RESOLVER_5Q_RESULTS.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
