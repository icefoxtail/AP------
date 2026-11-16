import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditedSubsetCcFixture} from './helpers/audited-subset-cc-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
const META='archive/data/question_metadata.json',IDENTITY='archive/data/question_identity_map.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
const CONCEPTS='archive/data/meta-foundation/canonical/concepts/new-concepts.json';
const blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const transport=f=>{f.request.expectedSourceBlobSha1=blob(f.writeBank());f.save();};
const mutateJson=(f,p,fn)=>{const d=f.read(p);fn(d);f.put(p,d);};
const cases=[
 ['new mathematical QA assertion',f=>{f.request.approval.newMathematicalQa=true;f.save();}],
 ['different approval kind',f=>{f.request.approval.type='FINAL_QA';f.save();}],
 ['no exclusive schema',f=>{delete f.request.approval.sourceRebind;f.save();}],
 ['full-source scope',f=>{delete f.request.scope;f.save();}],
 ['omit a retained audit sibling',f=>{f.request.items.pop();f.save();}],
 ['replace a retained audit sibling with a current native UID',f=>{const r=f.currentBefore.records[0];f.request.items[1]={...f.request.items[1],questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal};f.save();}],
 ['duplicate retained audit row',f=>{f.request.items[1]=structuredClone(f.request.items[0]);f.save();}],
 ['after supplies a new integration value',f=>{f.request.items[0].after.integrationPattern='SEQUENTIAL';f.save();}],
 ['second registration mode',f=>{f.request.items[0].sourceReview={schemaVersion:'claim-only'};f.save();}],
 ['restore full audit as immediate predecessor',f=>{f.request.approval.sourceRebind.priorReceiptRef=f.ref(f.fullPriorPath);f.request.approval.sourceRebind.priorCommit=f.fullPriorCommit;f.save();}],
 ['change selected source student field',f=>{f.bank[1].content+=' altered';transport(f);}],
 ['change outside native source metadata',f=>{f.bank[0].primaryMethod='unapproved';transport(f);}],
 ['change another audit source row',f=>{f.bank[3].templateKey='TPL_OTHER';transport(f);}],
 ['drop original audit CC',f=>{f.bank[1].crossConceptKeys=[f.key];transport(f);}],
 ['reorder CC union',f=>{f.bank[1].crossConceptKeys.reverse();transport(f);}],
 ['select native UID for component',f=>{f.request.approval.sourceRebind.component.questionUid=f.currentBefore.records[0].questionUid;f.request.approval.sourceRebind.component.sourceOrdinal=1;f.save();}],
 ['change retained difficulty',f=>mutateJson(f,META,d=>{d.records[1].difficultyBucket=5;})],
 ['change current audit sibling runtime',f=>mutateJson(f,RUNTIME,d=>{d.records.find(r=>r.sourceOrdinal===4).primaryMethod='unapproved';})],
 ['remove actual partial audit binding',f=>fs.unlinkSync(path.join(f.root,f.priorBindingPath))],
 ['forge actual prior receipt and rebind its SHA',f=>{mutateJson(f,f.priorPath,d=>{d.appliedRecords[0].integrationPattern='SEQUENTIAL';});const ref=f.ref(f.priorPath);f.request.approval.sourceRebind.priorReceiptRef=ref;for(const refs of[f.request.approval.evidenceRefs,...f.request.items.map(i=>i.evidenceRefs)])for(const r of refs)if(r.path===ref.path)r.sha256=ref.sha256;f.save();}],
 ['remove original full audit receipt',f=>fs.unlinkSync(path.join(f.root,f.fullPriorPath))],
 ['remove original final CC authority',f=>fs.unlinkSync(path.join(f.root,f.finalPath))],
 ['delete installed definition',f=>mutateJson(f,CONCEPTS,d=>{d.concepts=d.concepts.filter(r=>r.conceptKey!==f.key);})],
 ['change installed definition whole value',f=>mutateJson(f,CONCEPTS,d=>{d.concepts.find(r=>r.conceptKey===f.key).definition+=' changed';})],
 ['append any registry mutation',f=>{f.request.registryChanges=[{path:CONCEPTS,collection:'concepts',match:{conceptKey:'CC_OTHER'},before:null,after:{conceptKey:'CC_OTHER'},evidenceRefs:f.request.approval.evidenceRefs}];f.save();}],
 ['change original full-source asset while truthfully rebinding current refs',f=>{const p='archive/assets/audit-cc-test.svg';f.put(p,'<svg xmlns="http://www.w3.org/2000/svg"><circle r="3"/></svg>');const ref=f.ref(p);for(const refs of[f.request.approval.evidenceRefs,...f.request.items.map(i=>i.evidenceRefs)])for(const r of refs)if(r.path===p)r.sha256=ref.sha256;f.save();}],
];
for(const[label,mutate]of cases)test('current audit subset rejects '+label+' before any write',t=>{
 const f=auditedSubsetCcFixture(t);mutate(f);
 const paths=[META,IDENTITY,RUNTIME,CONCEPTS,f.sourcePath].filter(p=>fs.existsSync(path.join(f.root,p))),before=new Map(paths.map(p=>[p,f.hash(p)]));
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}));
 for(const[p,h]of before)assert.equal(f.hash(p),h);assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});

for(const[label,body]of[
 ['namespaced SMIL','<한:animate xmlns:한="http://www.w3.org/2000/svg" attributeName="opacity" from="0" to="1"/>'],
 ['CSS animation','<style>@keyframes shift{to{opacity:0}} .a{animation:shift 1s}</style>'],
])test('even truthfully immutable '+label+' does not satisfy static asset closure',t=>{
 const f=auditedSubsetCcFixture(t,{assetText:'<svg xmlns="http://www.w3.org/2000/svg">'+body+'</svg>'});
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/unsupported nested or dynamic SVG dependency/);
 assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});
test('the original source-audit gate already rejects an external renderer dependency',t=>{
 assert.throws(()=>auditedSubsetCcFixture(t,{assetText:'<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.invalid/unbound.png"/></svg>'}),/external\/malformed SVG dependency/);
});
test('immutable xml:base cannot turn a fragment into an external renderer dependency',t=>{
 const f=auditedSubsetCcFixture(t,{assetText:'<svg xmlns="http://www.w3.org/2000/svg" xml:base="https://example.invalid/external.svg"><use href="#shape"/></svg>'});
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/unsupported nested or dynamic SVG dependency/);
 assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
});
