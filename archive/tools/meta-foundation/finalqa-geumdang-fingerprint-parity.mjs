#!/usr/bin/env node
// Scopes original-school-exam production metadata to Q01..Q21; source/answer/solution untouched.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import sourceBank from '../../archive2-source.js';
const root=process.cwd();
const f='original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js', exam='archive/exams/'+f;
const metaFile='archive/data/question_metadata.json', parentsFile='archive/data/basic-scope-source-links.json';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const save=(p,o)=>fs.writeFileSync(path.join(root,p),JSON.stringify(o,null,2)+'\n');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(x,msg)=>{if(!x)throw Error(msg)};
const src=fs.readFileSync(path.join(root,exam),'utf8'),ctx={window:{}};
vm.runInNewContext(src,ctx,{timeout:5000});
const q=JSON.parse(JSON.stringify(ctx.window.questionBank));
const m=read(metaFile),links=read(parentsFile);
assert(q.length===21&&Array.isArray(m.records)&&links.status==='REVIEWED_SCOPE_LINKS','schema or denominator incorrect');
const rows=m.records.filter(x=>String(x.sourceArchiveFile).replace(/^archive\/exams\//,'')===f).sort((a,b)=>x.ordinal-y.ordinal);
const targets=m.records.filter(x=>String(x.sourceArchiveFile).replace(/^archive\/exams\//,'')===f).sort((a,b)=>Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
assert(targets.length===21,'QID metadata join cardinality not 21');
const bank=sourceBank.evaluate(src,f);
const owners={ALGEBRA_2022:'1.0.0',FUNCTIONS_GRAPHS:'1.0.3'};
const tags=read('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math1-algebra.json').records;
for(let i=0;i<21;i++){
 const x=q[i],t=targets[i],sourceQuestion=bank[i],r=tags.find(z=>z.id===x.rpmPrimaryRecordIds?.[0]);
 assert(x.id===i+1&&t.sourceOrdinal===i+1&&t.questionUid===x.questionUid&&r?.mappingStatus==='DIRECT_ACTIVE','source QID/UID/semantics mismatch Q'+(i+1));
 assert(x.problemTypeKey===r.problemTypeKey&&x.templateKey===r.templateKey,'PT/TPL source mismatch');
 const fingerprint=await sourceBank.fingerprint(sourceQuestion);
 const body=sha(JSON.stringify({content:sourceQuestion.content??null,choices:Array.isArray(sourceQuestion.choices)?sourceQuestion.choices:null,image:sourceQuestion.image??null}));
 assert(t.contentFingerprint===body,'assignment body changed: protected source data Q'+x.id);
 const owner=r.ownerPack;
 assert(!!owners[owner],'missing canonical pack owner '+owner);
 Object.assign(t,{sourceFingerprint:fingerprint,approvedSourceFingerprint:fingerprint,contentFingerprint:body,
  metadataRevision:'meta-foundation:'+owner+'@'+owners[owner]+':finalqa-reviewed-v1',
  metaFoundationStatus:'ACTIVE',metaFoundationPackId:owner,metaFoundationPackVersion:owners[owner],
  foundationTaxonomyStatus:'CONFIRMED',metadataStatus:'approved_exam_finalqa',reviewStatus:'reviewed_pass',
  curriculumApplicability:'DEFAULT_SCOPE',defaultSelectable:true,
  curriculum:'2022',curriculumKey:'2022',courseKey:'대수',standardCourse:'대수',
  sourceArchiveFile:f,sourceOrdinal:x.id,sourceQuestionNo:String(x.id),questionUid:x.questionUid,
  L1:r.rpmPath.majorUnit,L2:r.rpmPath.midUnit,L3:r.rpmPath.l3,L4:r.rpmPath.l4,
  problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,
  difficultyBucket:x.difficultyBucket,level:x.level,
  crossConceptKeys:x.crossConceptKeys??[],conditionKeys:x.conditionKeys??[],integrationPattern:x.integrationPattern??'NONE',
  fieldStatus:{...t.fieldStatus,standardUnit:'approved_finalqa',subUnit:'approved_finalqa',
   problemType:'approved_finalqa',template:'approved_finalqa',difficulty:'approved_finalqa'}
 });
 const prev=links.records.find(z=>z.sourceFile===f&&Number(z.sourceOrdinal)===x.id);
 const link={grade:'고2',curriculumKey:'2022',courseKey:'대수',
  L1:r.rpmPath.majorUnit,L2:r.rpmPath.midUnit,sourceFile:f,sourceOrdinal:x.id,
  sourceFingerprint:fingerprint,sourceBodyFingerprint:body,
  reason:'2026-10-21 user-directed Final QA: original Geumdang 21Q semantic parent verified from source and RPM '+r.id};
 if(prev)Object.assign(prev,link);else links.records.push(link);
}
save(metaFile,m);save(parentsFile,links);
console.log('GEUMDANG21_APPROVED_FINGERPRINT_AND_PARENT_LINKS',JSON.stringify({qids:targets.length,reviewedLinks:links.records.filter(x=>x.sourceFile===f).length}));
