import test from 'node:test';
import assert from 'node:assert/strict';
import { bindReviewedNativeScopeFields as bind, NATIVE_SCOPE_FIELDS } from '../archive/tools/meta-foundation/reviewed-native-scope-fields.mjs';

function fixture() {
  const uid='qid_v1_'+ 'a'.repeat(64), parent={path:'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',sha256:'b'.repeat(64),curriculum:'2015',scope:'M3-1',majorUnit:'이차함수',midUnit:'이차함수 y=ax²+bx+c의 그래프'};
  const context={standardCourse:'중3 수학',standardUnitKey:'M3-04',subUnitKey:'M3-04-QUADRATIC_FUNCTION_GRAPH',problemTypeKey:'PT_QUAD',templateKey:'TPL_VERTEX'};
  const q={...context,curriculum:'2015',grade:'M3',rpmPrimaryId:'M3-RPM-051',semanticSourceScope:'M3-1',semanticScopeRelation:'CURRENT_SCOPE'};
  const final={...q,curriculumKey:'2015',courseKey:'M3-1',L1:parent.majorUnit,L2:parent.midUnit};
  const row={ordinal:1,questionUid:uid,decision:'CORRECT',after:{...context,curriculum:'2015'},rpm:{originalCurriculum:'2015',base:{curriculum:'2015',scope:'M3-1',majorUnit:parent.majorUnit,midUnit:parent.midUnit,recordId:'M3-RPM-051'}}};
  const source='original/middle/m3/2mid/22_exam.js', ref={path:parent.path,sha256:parent.sha256};
  const request={scope:'PARTIAL_UIDS',sourceArchiveFile:source,approval:{type:'FINAL_QA',metadataReviewed:true,evidenceRefs:[ref]}};
  const patch={questionUid:uid,sourceOrdinal:1,after:{...final,sourceFingerprint:'c'.repeat(64)},targetParentRef:parent,evidenceRefs:[ref],sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:'d'.repeat(40),reviewPath:'native.json',reviewRef:{path:'native.json',sha256:'e'.repeat(64)},scopeFieldBinding:{schemaVersion:'archive-native-reviewed-scope-fields-v1',fields:[...NATIVE_SCOPE_FIELDS]}}};
  const pt={problemTypeKey:context.problemTypeKey,status:'ACTIVE',definition:'existing quadratic family'},tpl={templateKey:context.templateKey,parentProblemTypeKey:context.problemTypeKey,status:'ACTIVE',definition:'existing vertex form'};
  const binding={curriculum:'2015',...context,ownerPack:'MIDDLE3',status:'ACTIVE',L1:parent.majorUnit,L2:parent.midUnit};delete binding.templateKey;
  const tuple=JSON.stringify(['2015',context.standardCourse,context.standardUnitKey,context.subUnitKey,context.problemTypeKey]);
  const tables=()=>({pt:new Map([[context.problemTypeKey,structuredClone(pt)]]),tpl:new Map([[context.templateKey,structuredClone(tpl)]]),bindings:new Map([[tuple,structuredClone(binding)]]),packs:new Map([['MIDDLE3',{meta:{curricula:['2015'],standardCourses:['중3 수학','M3-1'],ownedStandardUnitDomains:['M3-04']}}]])});
  return{request,patch,native:{review:{schemaVersion:'m3-s2-complete-semantic-review-v1',sourceArchiveFile:source},reviewedBank:[structuredClone(q)],committedBank:[structuredClone(q)]},row,accepted:{...row.after},question:structuredClone(q),final,canonicalBefore:tables(),canonicalAfter:tables()};
}
test('explicit native scope binding carries only the two verbatim provenance fields',()=>{
  const input=fixture(),before=JSON.stringify(input),result=bind(input);
  assert.deepEqual(result.fields,{semanticSourceScope:'M3-1',semanticScopeRelation:'CURRENT_SCOPE'});
  assert.equal(result.proof.newClassificationJudgments,false);assert.equal(result.proof.newDefinitions,false);assert.equal(result.proof.newMathematicalQa,false);
  assert.match(result.proof.nativeItemSha256,/^[a-f0-9]{64}$/);assert.equal(JSON.stringify(input),before);
});
test('absence of explicit opt-in does not authorize a retained field',()=>{const x=fixture();delete x.patch.sourceReview.scopeFieldBinding;assert.equal(bind(x),null);});
const cases={
  'unknown schema':x=>{x.patch.sourceReview.scopeFieldBinding.schemaVersion='other';},
  'extra contract field':x=>{x.patch.sourceReview.scopeFieldBinding.allowUnknown=true;},
  'extra approved field':x=>{x.patch.sourceReview.scopeFieldBinding.fields.push('problemTypeKey');},
  'one-field partial request':x=>{x.patch.sourceReview.scopeFieldBinding.fields.pop();},
  'duplicate field':x=>{x.patch.sourceReview.scopeFieldBinding.fields[1]='semanticSourceScope';},
  'full exam mode':x=>{delete x.request.scope;},
  'audit approval':x=>{x.request.approval.type='META_PIPELINE_AUDIT';},
  'identity-only mode':x=>{x.request.registrationMode='IDENTITY_FINGERPRINT_ONLY';},
  'source rebind mix':x=>{x.request.approval.sourceRebind={};},
  'fingerprint rebind mix':x=>{x.patch.rebind={};},
  'renderer proof mix':x=>{x.patch.sourceReview.rendererProof={};},
  'proposal finalization mix':x=>{x.patch.sourceReview.proposalFinalization={};},
  'other retained adapter mix':x=>{x.patch.sourceReview.retainedFields={};},
  'source fingerprint absent':x=>{delete x.patch.after.sourceFingerprint;},
  'other native schema':x=>{x.native.review.schemaVersion='m2-s2-meta-review-v1';},
  'native hold':x=>{x.row.decision='HOLD';},
  'wrong source path':x=>{x.native.review.sourceArchiveFile='original/middle/m3/2mid/other.js';},
  'wrong native UID':x=>{x.row.questionUid='other';},
  'wrong ordinal':x=>{x.row.ordinal=2;},
  'accepted native after already controls field':x=>{x.accepted.semanticSourceScope='M3-1';},
  'native after contradiction':x=>{x.row.after.semanticSourceScope='M3-2';},
  'reviewed source field absent':x=>{delete x.native.reviewedBank[0].semanticSourceScope;},
  'committed source field absent':x=>{delete x.native.committedBank[0].semanticScopeRelation;},
  'current source scope changed':x=>{x.question.semanticSourceScope='M3-2';},
  'request scope changed':x=>{x.patch.after.semanticSourceScope='M3-2';},
  'final scope changed':x=>{x.final.semanticSourceScope='M3-2';},
  'other relation even when all sources agree':x=>{for(const q of [x.native.reviewedBank[0],x.native.committedBank[0],x.question,x.patch.after,x.final])q.semanticScopeRelation='LOWER_GRADE_PREREQUISITE';},
  'native RPM scope changed':x=>{x.row.rpm.base.scope='M3-2';},
  'historical original curriculum relabel':x=>{x.row.rpm.originalCurriculum='2009';},
  'unrecorded original curriculum':x=>{delete x.row.rpm.originalCurriculum;},
  'current source historical conflict':x=>{x.question.sourceCurriculum='2009';},
  'course key differs from native scope':x=>{x.final.courseKey='M3-2';},
  'source RPM ID changed':x=>{x.question.rpmPrimaryId='M3-RPM-049';},
  'current primary type changed':x=>{x.question.problemTypeKey='PT_OTHER';},
  'native committed template differs':x=>{x.native.committedBank[0].templateKey='TPL_OTHER';},
  'accepted classification lacks native proof':x=>{delete x.row.after.problemTypeKey;},
  'inactive template':x=>{x.canonicalBefore.tpl.get('TPL_VERTEX').status='CANDIDATE';},
  'changed existing definition':x=>{x.canonicalAfter.pt.get('PT_QUAD').definition='new meaning';},
  'wrong template parent':x=>{x.canonicalBefore.tpl.get('TPL_VERTEX').parentProblemTypeKey='PT_OTHER';},
  'binding absent':x=>{x.canonicalAfter.bindings.clear();},
  'binding wrong parent':x=>{x.canonicalAfter.bindings.values().next().value.L2='another';},
  'runtime owner wrong':x=>{x.canonicalAfter.bindings.values().next().value.ownerPack='MIDDLE1';},
  'pack course missing':x=>{x.canonicalAfter.packs.get('MIDDLE3').meta.standardCourses=['중3 수학'];},
  'pack unit ownership missing':x=>{x.canonicalAfter.packs.get('MIDDLE3').meta.ownedStandardUnitDomains=[];},
  'canonical parent reference missing':x=>{delete x.patch.targetParentRef;},
  'canonical parent evidence missing':x=>{x.patch.evidenceRefs=[];},
  'canonical parent has wrong scope':x=>{x.patch.targetParentRef={...x.patch.targetParentRef,scope:'M3-2'};},
  'approved parent label differs':x=>{x.final.L2='wrong parent';},
};
for(const [name,mutate] of Object.entries(cases))test('rejects '+name,()=>{const x=fixture();mutate(x);assert.throws(()=>bind(x),/native scope fields:/);});
