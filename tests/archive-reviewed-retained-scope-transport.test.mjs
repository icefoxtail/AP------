import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {bindReviewedRetainedScopeTransport as bind, validateReviewedRetainedScopeParent as parent} from '../archive/tools/meta-foundation/reviewed-retained-scope-transport.mjs';

const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const clone=x=>structuredClone(x),FIELDS=['curriculum','curriculumKey','courseKey'];
const RPM='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';

function fixture(t,{scope='M2-2',curriculum='2015',independentCurriculum='2015',family=false,rpmOverrides={}}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'retained-scope-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
 git('init','-q');git('config','user.name','Synthetic Test');git('config','user.email','synthetic@example.invalid');
 const put=(p,v)=>{const b=Buffer.from(JSON.stringify(v,null,2)+'\n'),f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);return {path:p,sha256:sha(b)};};
 const source='original/middle/m2/2final/synthetic.js';
 const row={questionUid:'uid1',sourceOrdinal:1,rpmDecision:'KEEP',rpmRecordId:'M2-RPM-001',after:{difficultyBucket:2}};
 const rpmRecord={id:row.rpmRecordId,curriculum,scope,standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO',rpmPath:{majorUnit:'도형의 닮음',midUnit:'선분비'},
  ...(family?{mappingStatus:'FAMILY_ACTIVE',bindingStatus:'ACTIVE',problemTypeKey:'PT_OLD',templateCandidates:[{templateKey:'TPL_OTHER_CANDIDATE'}]}:{}),...rpmOverrides};
 const rpmRef=put(RPM,{records:[rpmRecord]}),reviewPath='docs/native.json',nativeRef=put(reviewPath,{schemaVersion:'m2-s2-meta-review-v1',items:[row]});
 git('add','.');git('commit','-qm','synthetic immutable native authority');const nativeCommit=git('rev-parse','HEAD');
 const final={curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2',standardCourse:'중2 수학',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO',problemTypeKey:'PT_OLD',templateKey:'TPL_OLD',L1:'도형의 닮음',L2:'선분비'};
 const pt={problemTypeKey:final.problemTypeKey,status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY'},tpl={templateKey:final.templateKey,parentProblemTypeKey:final.problemTypeKey,status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY'};
 const binding={curriculum:'2015',standardCourse:final.standardCourse,standardUnitKey:final.standardUnitKey,subUnitKey:final.subUnitKey,problemTypeKey:final.problemTypeKey,status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY'};
 const context={...binding,curriculum:independentCurriculum};
 const app={questionUid:'uid1',sourceOrdinal:1,decision:'APPROVED_EXISTING_PRIMARY',nativeItemStableSha256:sha(stable(row)),
  nativeReviewRef:{commit:nativeCommit,path:reviewPath,sha256:nativeRef.sha256},existingPrimary:{exactBinding:context}};
 const doc={schemaVersion:'archive-independent-existing-primary-disposition-v1',scope:'EXISTING_PRIMARY_RETENTION_ONLY',applications:[app]};
 let independentRef=put('docs/independent.json',doc);git('add','.');git('commit','-qm','synthetic independent primary');let independentCommit=git('rev-parse','HEAD');
 const masterRef=put(MASTER,{records:[{curriculum:'2015',scope:'M2-2',majorUnit:final.L1,midUnit:final.L2}]});
 const patch={questionUid:'uid1',sourceOrdinal:1,before:{curriculum:null,curriculumKey:null,courseKey:null},after:{curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'},
  evidenceRefs:[rpmRef,independentRef,masterRef],targetParentRef:{path:MASTER,curriculum:'2015',scope:'M2-2',majorUnit:final.L1,midUnit:final.L2},
  sourceReview:{retainedFields:{independentPrimary:{schemaVersion:'archive-reviewed-existing-primary-disposition-v1',reviewCommit:independentCommit,reviewRef:independentRef}},
    retainedScopeTransport:{schemaVersion:'archive-reviewed-retained-scope-transport-v1',fields:[...FIELDS]}}};
 const request={scope:'PARTIAL_UIDS',sourceArchiveFile:source,approval:{type:'FINAL_QA',evidenceRefs:[rpmRef,independentRef,masterRef]},registryChanges:[]};
 const independent={schemaVersion:'archive-reviewed-existing-primary-disposition-v1',reviewCommit:independentCommit,reviewRef:independentRef,questionUid:'uid1',sourceOrdinal:1,
  originalNativeMatchPreserved:true,originalNativeAfterPreserved:true,newDefinitions:false,newMathematicalQa:false,newReview2:false,newDifficultyApproval:false,
  applicationSha256:sha(stable(app)),exactBindingSha256:sha(stable(binding)),problemTypeDefinitionSha256:sha(stable(pt)),templateDefinitionSha256:sha(stable(tpl))};
 const retained={schemaVersion:'archive-reviewed-native-retained-fields-v1',questionUid:'uid1',sourceOrdinal:1,independentApplicabilityDecision:true,nativeItemSha256:sha(stable(row)),
  newDefinitions:false,newMathematicalQa:false,independentPrimary:independent,exactBindingSha256:sha(stable(binding)),
  problemTypeDefinitionSha256:sha(stable(pt)),templateDefinitionSha256:sha(stable(tpl)),
  nativeRpmRef:{commit:nativeCommit,path:RPM,sha256:rpmRef.sha256,recordId:row.rpmRecordId,recordSha256:sha(stable(rpmRecord))}};
 const tables={pt:new Map([[pt.problemTypeKey,pt]]),tpl:new Map([[tpl.templateKey,tpl]]),bindings:new Map([['binding',binding]]),master:new Map([
  [final.standardUnitKey,{keyType:'standardUnitKey',status:'active'}],[final.subUnitKey,{keyType:'subUnitKey',status:'active',parentKey:final.standardUnitKey}]])};
 const question={id:1},native={spec:{reviewCommit:nativeCommit,reviewPath,reviewRef:nativeRef},review:{schemaVersion:'m2-s2-meta-review-v1'},reviewedBank:[clone(question)],committedBank:[clone(question)]};
 const ctx={root,request,patch,native,row,metadata:{},accepted:{},question,final,retainedNativeFields:{proof:retained},canonicalBefore:tables,canonicalAfter:structuredClone(tables)};
 const resignIndependent=mutate=>{mutate(doc);independentRef=put('docs/independent.json',doc);git('add','docs/independent.json');git('commit','-qm','synthetic changed independent authority');independentCommit=git('rev-parse','HEAD');
  Object.assign(independent,{reviewCommit:independentCommit,reviewRef:independentRef,applicationSha256:sha(stable(doc.applications[0]))});
  Object.assign(patch.sourceReview.retainedFields.independentPrimary,{reviewCommit:independentCommit,reviewRef:independentRef});
  patch.evidenceRefs=patch.evidenceRefs.map(r=>r.path===independentRef.path?independentRef:r);request.approval.evidenceRefs=clone(patch.evidenceRefs);};
 return {ctx,put,git,doc,resignIndependent,rpmRecord,masterRef};
}

test('explicit scope transport joins distinct immutable authorities and leaves inputs unchanged',t=>{
 const f=fixture(t),before=stable(f.ctx),result=bind(f.ctx);
 assert.deepEqual(result.fields,{curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'});
 assert.equal(result.proof.independentCourseKeyExplicitlyDeclared,false);
 assert.equal(result.proof.fieldBindings.courseKey.origin,'IMMUTABLE_NATIVE_RPM_SCOPE_JOIN');
 assert.equal(result.proof.inferredFromYearOrFilename,false);assert.equal(stable(f.ctx),before);
});
test('without the opt-in no scope field is accepted',t=>{const f=fixture(t);delete f.ctx.patch.sourceReview.retainedScopeTransport;assert.equal(bind(f.ctx),null);});
test('same explicit scope in sources and previous metadata is preserved',t=>{
 const f=fixture(t);for(const q of [f.ctx.question,...f.ctx.native.reviewedBank,...f.ctx.native.committedBank,f.ctx.metadata])Object.assign(q,{curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'});
 f.ctx.patch.before={curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'};assert.equal(bind(f.ctx).proof.sourcePresence[2].courseKey.present,true);
});
test('authenticated replay restores only the issued absent scope representation',t=>{
 const f=fixture(t),issued=bind(f.ctx).proof;
 assert.deepEqual(issued.metadataBeforeScopePresence,{curriculum:{present:false},curriculumKey:{present:false},courseKey:{present:false}});
 Object.assign(f.ctx.metadata,{curriculum:null,curriculumKey:null,courseKey:null});
 assert.throws(()=>bind(f.ctx),/scope field conflicts/);
 f.ctx.issuedScopeProof=issued;
 assert.deepEqual(bind(f.ctx).proof,issued);
});
test('authenticated replay preserves an originally explicit exact scope',t=>{
 const f=fixture(t);Object.assign(f.ctx.metadata,{curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'});
 f.ctx.patch.before={curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2'};
 const issued=bind(f.ctx).proof;f.ctx.issuedScopeProof=issued;
 assert.deepEqual(bind(f.ctx).proof,issued);
});
for(const [name,mutate] of [
 ['wrong issued UID',f=>f.ctx.issuedScopeProof.questionUid='other'],
 ['wrong issued ordinal',f=>f.ctx.issuedScopeProof.sourceOrdinal=2],
 ['foreign issued schema',f=>f.ctx.issuedScopeProof.schemaVersion='future'],
 ['deleted issued inventory',f=>delete f.ctx.issuedScopeProof.metadataBeforeScopePresence],
 ['missing issued field',f=>delete f.ctx.issuedScopeProof.metadataBeforeScopePresence.courseKey],
 ['unknown issued field',f=>f.ctx.issuedScopeProof.metadataBeforeScopePresence.level={present:false}],
 ['untyped issued presence',f=>f.ctx.issuedScopeProof.metadataBeforeScopePresence.curriculum.present='false'],
 ['extra issued absent value',f=>f.ctx.issuedScopeProof.metadataBeforeScopePresence.curriculum.valueSha256=sha('null')],
 ['forged original explicit value',f=>f.ctx.issuedScopeProof.metadataBeforeScopePresence.curriculum={present:true,valueSha256:sha(stable('2015'))}],
 ['current reconstructed scope conflict',f=>f.ctx.metadata.curriculum='2022'],
 ['changed reconstructed before',f=>f.ctx.patch.before.courseKey='M2-1'],
 ['explicit source null cannot use issued metadata absence',f=>f.ctx.question.curriculum=null],
])test(`issued replay rejects ${name}`,t=>{
 const f=fixture(t);f.ctx.issuedScopeProof=bind(f.ctx).proof;
 Object.assign(f.ctx.metadata,{curriculum:null,curriculumKey:null,courseKey:null});
 mutate(f);assert.throws(()=>bind(f.ctx),/retained scope transport:/);
});

function familyParentFixture(t,options={}){
 const f=fixture(t,{family:true,...options});
 f.ctx.request.approval.metadataReviewed=true;
 f.ctx.patch.targetParentRef.retainedScopeParent={schemaVersion:'archive-reviewed-retained-primary-parent-v1'};
 const scope=bind(f.ctx).proof, row={...f.ctx.final,questionUid:'uid1',sourceOrdinal:1};
 const binding=f.ctx.canonicalBefore.bindings.get('binding');
 const sourceReview={schemaVersion:'archive-reviewed-source-reassessment-v1',nativeSchemaVersion:'m2-s2-meta-review-v1',
  scope:'METADATA_SOURCE_BINDING_ONLY',newMathematicalQa:false,questionUid:'uid1',sourceOrdinal:1,
  retainedScopeTransport:scope,retainedNativeFields:f.ctx.retainedNativeFields.proof};
 const args={request:f.ctx.request,patch:f.ctx.patch,row,sourceReview,resolved:{curriculum:'2015',course:row.standardCourse,
  binding,pt:f.ctx.canonicalBefore.pt.get(row.problemTypeKey),tpl:f.ctx.canonicalBefore.tpl.get(row.templateKey),
  pack:{meta:{canonicalStatus:'ACTIVE',packId:binding.ownerPack,curricula:['2015'],standardCourses:[row.standardCourse,'M2-2']}}}};
 return {...f,args};
}
test('explicit retained family parent carries only independently validated L1/L2 without choosing a template candidate',t=>{
 const f=familyParentFixture(t),result=parent(f.args);
 assert.deepEqual(result.parent,{curriculum:'2015',scope:'M2-2',L1:f.ctx.final.L1,L2:f.ctx.final.L2});
 assert.equal(result.templateCandidatesUsedAsApproval,false);
 assert.equal(result.nativeAfterPrimaryInvented,false);
 assert(!f.rpmRecord.templateCandidates.some(r=>r.templateKey===result.exactActiveTuple.templateKey));
 assert.deepEqual(Object.keys(bind(f.ctx).fields).sort(),[...FIELDS].sort());
});
test('without the parent opt-in the normal parent path is unchanged',t=>{
 const f=fixture(t);assert.equal(parent({request:f.ctx.request,patch:f.ctx.patch}),null);
});
for(const [name,rpmOverrides] of [
 ['missing family status',{mappingStatus:'DIRECT_BINDING_GAP'}],
 ['missing ACTIVE binding',{bindingStatus:'MISSING'}],
 ['different native family PT',{problemTypeKey:'PT_OTHER'}],
 ['unexpected explicit native template',{templateKey:'TPL_OLD'}],
])test(`retained parent refuses ${name}`,t=>{
 const f=fixture(t,{family:true,rpmOverrides});f.ctx.patch.targetParentRef.retainedScopeParent={schemaVersion:'archive-reviewed-retained-primary-parent-v1'};
 assert.throws(()=>bind(f.ctx),/retained parent requires/);
});
for(const [name,mutate] of [
 ['unknown profile',f=>f.args.patch.targetParentRef.retainedScopeParent.schemaVersion='future'],
 ['extra profile field',f=>f.args.patch.targetParentRef.retainedScopeParent.templateKey='TPL_OLD'],
 ['simultaneous native-after parent',f=>f.args.patch.targetParentRef.nativeSourceReview={}],
 ['simultaneous crosswalk parent',f=>f.args.patch.targetParentRef.crosswalkRef={}],
 ['new registration lane',f=>f.args.request.registrationMode='IDENTITY_FINGERPRINT_ONLY'],
 ['unvalidated source review',f=>delete f.args.sourceReview],
 ['missing independent primary',f=>delete f.args.sourceReview.retainedNativeFields.independentPrimary],
 ['wrong selected UID',f=>f.args.sourceReview.questionUid='other'],
 ['changed parent target',f=>f.args.patch.targetParentRef.midUnit='other'],
 ['changed parent label',f=>f.args.row.L2='other'],
 ['changed chosen template',f=>f.args.row.templateKey='TPL_OTHER_CANDIDATE'],
 ['new template interpretation',f=>f.args.sourceReview.retainedScopeTransport.retainedParentAuthority.templateCandidatesUsedAsApproval=true],
 ['unbound RPM record',f=>f.args.sourceReview.retainedScopeTransport.retainedParentAuthority.nativeRpmRecordSha256='0'.repeat(64)],
 ['inactive current tuple',f=>f.args.resolved.binding.status='HOLD'],
 ['changed current template bytes',f=>f.args.resolved.tpl.definition='changed'],
 ['wrong pack scope',f=>f.args.resolved.pack.meta.standardCourses=[f.args.row.standardCourse]],
 ['missing exact parent witness',f=>delete f.args.sourceReview.retainedScopeTransport.retainedParentAuthority],
])test(`retained parent replay refuses ${name}`,t=>{
 const f=familyParentFixture(t);mutate(f);assert.throws(()=>parent(f.args),/retained scope transport:/);
});
for(const [name,mutate] of [
 ['extra selected field',f=>f.ctx.patch.sourceReview.retainedScopeTransport.fields.push('level')],
 ['duplicate selected field',f=>f.ctx.patch.sourceReview.retainedScopeTransport.fields.push('courseKey')],
 ['unrecognized opt-in key',f=>f.ctx.patch.sourceReview.retainedScopeTransport.values={courseKey:'M2-2'}],
 ['missing selected field',f=>f.ctx.patch.sourceReview.retainedScopeTransport.fields.pop()],
 ['unknown schema',f=>f.ctx.patch.sourceReview.retainedScopeTransport.schemaVersion='future'],
 ['other approval lane',f=>f.ctx.request.approval.type='REVIEW2'],
 ['new registry definition',f=>f.ctx.request.registryChanges=[{}]],
 ['other grade source',f=>f.ctx.request.sourceArchiveFile='original/middle/m3/2final/synthetic.js'],
 ['other semester source',f=>f.ctx.request.sourceArchiveFile='original/middle/m2/1final/synthetic.js'],
 ['candidate native judgment',f=>f.ctx.row.rpmDecision='HOLD'],
 ['no independently approved primary',f=>delete f.ctx.retainedNativeFields.proof.independentPrimary],
 ['unverified primary result',f=>f.ctx.retainedNativeFields.proof.independentApplicabilityDecision=false],
 ['wrong selected UID',f=>f.ctx.patch.questionUid='other'],
 ['no immutable before source',f=>f.ctx.native.reviewedBank=[]],
 ['no immutable reviewed source',f=>f.ctx.native.committedBank=[]],
 ['current source curriculum conflict',f=>f.ctx.question.curriculum='2022'],
 ['current source course conflict',f=>f.ctx.question.courseKey='M2-1'],
 ['immutable before course conflict',f=>f.ctx.native.reviewedBank[0].courseKey='M2-1'],
 ['immutable reviewed curriculum conflict',f=>f.ctx.native.committedBank[0].curriculum='2022'],
 ['metadata curriculum conflict',f=>{f.ctx.metadata.curriculum='2022';f.ctx.patch.before.curriculum='2022';}],
 ['metadata course conflict',f=>{f.ctx.metadata.courseKey='M2-1';f.ctx.patch.before.courseKey='M2-1';}],
 ['explicit null source authority',f=>f.ctx.question.curriculum=null],
 ['explicit null metadata authority',f=>f.ctx.metadata.courseKey=null],
 ['native after scope conflict',f=>f.ctx.accepted.courseKey='M2-1'],
 ['missing exact before field',f=>delete f.ctx.patch.before.courseKey],
 ['changed requested course',f=>f.ctx.patch.after.courseKey='M2-1'],
 ['native RPM missing both-list authority',f=>f.ctx.patch.evidenceRefs=f.ctx.patch.evidenceRefs.filter(r=>r.path!==RPM)],
 ['native RPM local hash drift',f=>f.put(RPM,{records:[{...f.rpmRecord,scope:'M2-1'}]})],
 ['native RPM record ambiguity',f=>f.ctx.retainedNativeFields.proof.nativeRpmRef.recordId='candidate'],
 ['missing exact active binding',f=>f.ctx.canonicalBefore.bindings.clear()],
 ['changed current binding',f=>f.ctx.canonicalAfter.bindings.get('binding').status='PENDING'],
 ['changed current primary definition',f=>f.ctx.canonicalAfter.pt.get('PT_OLD').status='PENDING'],
 ['missing current parent master',f=>f.ctx.canonicalBefore.master.clear()],
 ['changed active master parent',f=>f.ctx.canonicalAfter.master.get('M2-06-RATIO').parentKey='M2-05'],
 ['no exact master evidence file',f=>fs.unlinkSync(path.join(f.ctx.root,MASTER))],
 ['missing master authority from approval',f=>f.ctx.request.approval.evidenceRefs=f.ctx.request.approval.evidenceRefs.filter(r=>r.path!==MASTER)],
 ['wrong explicit target parent',f=>f.ctx.patch.targetParentRef.midUnit='다른 단원'],
 ['display-label course inference',f=>f.ctx.patch.targetParentRef.scope='중2 수학'],
 ['renderer combination',f=>f.ctx.patch.sourceReview.rendererProof={}],
 ['proposal combination',f=>f.ctx.patch.sourceReview.proposalFinalization={}],
 ['foreign scope helper combination',f=>f.ctx.patch.sourceReview.scopeFieldBinding={}],
])test(`scope transport refuses ${name}`,t=>{const f=fixture(t);mutate(f);assert.throws(()=>bind(f.ctx),/retained scope transport:/);});
for(const [name,options]of[['other immutable semester',{scope:'M2-1'}],['missing immutable semester',{scope:undefined}],
 ['noncanonical native course label',{scope:'중2 수학'}],['other native curriculum',{curriculum:'2022'}],['independent curriculum mismatch',{independentCurriculum:'2022'}]])
 test(`scope transport refuses ${name}`,t=>{const f=fixture(t,options);if(name==='missing immutable semester'){
  // Undefined activates the fixture default; the explicit missing-authority case
  // uses a bound record whose scope is null instead.
  const g=fixture(t,{scope:null});assert.throws(()=>bind(g.ctx),/retained scope transport:/);
 }else assert.throws(()=>bind(f.ctx),/retained scope transport:/);});
test('a newly hashed independent document cannot add a different scope authority',t=>{
 const f=fixture(t);f.resignIndependent(d=>d.applications[0].existingPrimary.exactBinding.curriculum='2022');
 assert.throws(()=>bind(f.ctx),/native scope and independent ACTIVE primary binding disagree/);
});
test('missing master record remains rejected even with a matching new file SHA',t=>{
 const f=fixture(t),ref=f.put(MASTER,{records:[]});
 f.ctx.patch.evidenceRefs=f.ctx.patch.evidenceRefs.map(r=>r.path===MASTER?ref:r);
 f.ctx.request.approval.evidenceRefs=clone(f.ctx.patch.evidenceRefs);
 assert.throws(()=>bind(f.ctx),/no exact current master parent/);
});
