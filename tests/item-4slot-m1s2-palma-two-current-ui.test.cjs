'use strict';
// Metadata-only contract tests. These do not run Chrome, inspect question text,
// grant Native authority, or stand in for the official source24 builder gate.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const ui=require('../tools/4slot/m1s2-problem-renderer-ui.cjs');
const root=path.resolve(__dirname,'..');
const fixed=ui.palmaCurrentUiRefs();
const clone=v=>JSON.parse(JSON.stringify(v));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const withoutCommit=({commit,...rest})=>rest;
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
const cache=new Map();
function immutable(ref){
 const key=ref.commit+':'+ref.path;
 if(cache.has(key))return clone(cache.get(key));
 assert.match(ref.commit,/^[a-f0-9]{40}$/);
 assert.ok(typeof ref.path==='string'&&!ref.path.startsWith('/')&&!ref.path.split('/').some(x=>!x||x==='.'||x==='..'));
 const tree=execFileSync('git',['ls-tree','-z',ref.commit,'--',ref.path],{cwd:root,encoding:'utf8',maxBuffer:1024*1024}).split('\0').filter(Boolean);
 assert.equal(tree.length,1,'immutable metadata tree entry must exist once');
 assert.equal(tree[0],'100644 blob '+ref.gitBlobSha1+'\t'+ref.path,'immutable metadata path must be a regular exact Git blob');
 const bytes=execFileSync('git',['show',ref.commit+':'+ref.path],{cwd:root,maxBuffer:4*1024*1024});
 assert.equal(bytes.length,ref.bytes,'immutable metadata length');
 assert.equal(blob(bytes),ref.gitBlobSha1,'immutable metadata Git hash');
 assert.equal(sha(bytes),ref.sha256,'immutable metadata raw hash');
 const value=JSON.parse(bytes);cache.set(key,value);return clone(value);
}
const technical=immutable(fixed.refs.technical),visual=immutable(fixed.refs.visual);
const priorTechnical=immutable(ui.CURRENT_TECHNICAL_REF),priorVisual=immutable(ui.CURRENT_VISUAL_REF);
const manifest=immutable(technical.manifestRef),witness=immutable(fixed.refs.equivalence),integrity=immutable(fixed.refs.integrity);
function fixture(uid=fixed.subjects[0].questionUid){
 const subject=fixed.subjects.find(x=>x.questionUid===uid);
 assert.ok(subject);
 const priorDoc=immutable(subject.priorSidecarRef);
 const filename=path.join(root,subject.priorSidecarRef.path),st=fs.lstatSync(filename);
 assert.ok(st.isFile()&&!st.isSymbolicLink(),'candidate sidecar is a regular file');
 const doc=JSON.parse(fs.readFileSync(filename,'utf8'));
 const expected={...priorDoc,currentSourceRef:withoutCommit(fixed.sourceRef),
  uiTechnicalRef:withoutCommit(fixed.refs.technical),uiVisualRef:withoutCommit(fixed.refs.visual)};
 assert.ok(equal(doc,expected),'sidecar changes only currentSourceRef and the two UI references');
 return{doc,t:clone(technical),v:clone(visual),priorDoc,priorTechnical:clone(priorTechnical),priorVisual:clone(priorVisual),
  manifest:clone(manifest),witness:clone(witness),integrity:clone(integrity)};
}
const check=input=>ui.assertPalmaCurrentUiDocuments(input);
for(const subject of fixed.subjects)test('exact current four metadata joins original authority Q'+subject.sourceOrdinal,()=>{
 assert.equal(check(fixture(subject.questionUid)),true);
});
test('old current14 documents retain the original dispatcher route',()=>{
 const x=fixture();assert.equal(ui.palmaCurrentUiRequested(x.priorDoc,x.priorTechnical,x.priorVisual),false);
});
test('new raw schema selects the closed two-item route',()=>{
 const x=fixture();assert.equal(ui.palmaCurrentUiRequested(x.doc,x.t,x.v),true);
});
test('exported refs are detached copies and cannot modify production pins',()=>{
 const x=ui.palmaCurrentUiRefs();x.subjects[0].sourceOrdinal=999;x.refs.technical.sha256='0'.repeat(64);
 assert.equal(ui.palmaCurrentUiRefs().subjects[0].sourceOrdinal,6);
 assert.equal(ui.palmaCurrentUiRefs().refs.technical.sha256,fixed.refs.technical.sha256);
});
const mutations=[
 ['outside UID',x=>{x.doc.questionUid='qid_v1_'+'0'.repeat(64);}],
 ['wrong ordinal',x=>{x.doc.sourceOrdinal=7;}],
 ['other source',x=>{x.doc.sourceArchiveFile='original/middle/m1/2mid/other.js';}],
 ['old bank pin',x=>{x.doc.currentSourceRef=x.priorDoc.currentSourceRef;}],
 ['current source byte drift',x=>{x.doc.currentSourceRef.bytes++;}],
 ['technical ref path redirect',x=>{x.doc.uiTechnicalRef.path+='-copy';}],
 ['visual ref raw drift',x=>{x.doc.uiVisualRef.sha256='0'.repeat(64);}],
 ['sidecar immutable commit injection',x=>{x.doc.uiTechnicalRef.commit=fixed.refs.technical.commit;}],
 ['original review authority drift',x=>{x.doc.independentReviewRef.sha256='0'.repeat(64);}],
 ['original compact drift',x=>{x.doc.currentCompactRef.sha256='0'.repeat(64);}],
 ['original vector drift',x=>{x.doc.vectorSha256='0'.repeat(64);}],
 ['dictionary drift',x=>{x.doc.dictionaryRef.sha256='0'.repeat(64);}],
 ['original author drift',x=>{x.doc.author+='-changed';}],
 ['prior sidecar authority mismatch',x=>{x.priorDoc.vectorSha256='0'.repeat(64);}],
 ['technical schema mismatch',x=>{x.t.schemaVersion='archive-m1s2-problem-seven-github-ui-raw-v1';}],
 ['technical failed capture',x=>{x.t.status='FAILED';}],
 ['technical missing logical case',x=>{x.t.results.pop();}],
 ['technical expected count expansion',x=>{x.t.expectedLogicalCases=14;}],
 ['served dependency deletion',x=>{x.t.servedFiles.pop();}],
 ['mirrored dependency deletion',x=>{x.t.mirroredAssets.pop();}],
 ['font response deletion',x=>{x.t.studentFontResources.pop();}],
 ['font response byte change',x=>{x.t.studentFontResources[0].sha256='0'.repeat(64);}],
 ['font response duplicate',x=>{x.t.studentFontResources[1]=clone(x.t.studentFontResources[0]);}],
 ['push relabelled as PR',x=>{x.t.execution.eventName='pull_request';}],
 ['push ref drift',x=>{x.t.execution.ref+='-other';}],
 ['push checkout drift',x=>{x.t.checkoutCommit='0'.repeat(40);}],
 ['execution extra key',x=>{x.t.execution.unverified=true;}],
 ['fixed fixture item expansion',x=>{x.manifest.items.push(clone(x.manifest.items[0]));}],
 ['source item pin drift',x=>{x.t.items[0].sourceRef.sha256='0'.repeat(64);}],
 ['selected question digest drift',x=>{x.t.items[0].questionSha256='0'.repeat(64);}],
 ['duplicate current case',x=>{x.t.results[1]=clone(x.t.results[0]);}],
 ['changed current geometry',x=>{x.t.results[0].geometry.injected=true;}],
 ['changed current capture',x=>{x.t.results[0].capture.cssWrites=1;}],
 ['changed current surface',x=>{x.t.results[0].surfaceStructure.semanticChildCount++;}],
 ['solution nodes in current case',x=>{x.t.results[0].technical.solutionNodes=1;}],
 ['case font subset drift',x=>{x.t.results[0].technical.fontResourceIds.pop();}],
 ['current case page error',x=>{x.t.results[0].pageErrors.push('synthetic');}],
 ['current case screenshot byte drift',x=>{x.t.results[0].screenshots[0].sha256='0'.repeat(64);}],
 ['technical screenshot inventory missing',x=>{x.t.screenshotArtifacts.pop();}],
 ['visual schema mismatch',x=>{x.v.schemaVersion='unapproved';}],
 ['visual raw ref substituted',x=>{x.v.technicalRef.gitBlobSha1='0'.repeat(40);}],
 ['visual reviewer substituted',x=>{x.v.reviewer+='-other';}],
 ['visual reviewer equals author',x=>{x.v.reviewer=x.doc.author;}],
 ['new semantic approval',x=>{x.v.newSemanticApproval=true;}],
 ['new vector approval',x=>{x.v.newFourSlotVector=true;}],
 ['new raw visual inspection claim',x=>{x.v.newVisualInspection=true;}],
 ['registered claim substituted',x=>{x.v.officialAuthorityBuilderConsumerStatus='PASS';}],
 ['old visual record deletion',x=>{x.v.records.pop();}],
 ['old visual decision changed',x=>{x.v.records[0].decision='HOLD';}],
 ['old PNG immutable ref changed',x=>{x.v.artifactRefs[0].commit='0'.repeat(40);}],
 ['whole-bank equivalence claimed',x=>{x.v.sourceWholeBankEquivalenceClaimed=true;}],
 ['old five modified claim',x=>{x.v.oldFiveBindingsModified=true;}],
 ['source continuity proof substituted',x=>{x.v.sourceContinuityProof.sha256='0'.repeat(64);}],
 ['identity24 proof substituted',x=>{x.v.identity24Proof.sha256='0'.repeat(64);}],
 ['equivalence wrong technical raw',x=>{x.witness.actual.technicalBlob.sha256='0'.repeat(64);}],
 ['equivalence technical pin extra field',x=>{x.witness.actual.technicalBlob.unverified=true;}],
 ['equivalence case omitted',x=>{x.witness.cases.pop();}],
 ['equivalence case digest changed',x=>{x.witness.cases[0].captureSha256='0'.repeat(64);}],
 ['equivalence geometry condition false',x=>{x.witness.cases[0].checks.geometry=false;}],
 ['artifact digest not authenticated',x=>{x.integrity.apiArtifactDigestExact=false;}],
 ['artifact current raw ref drift',x=>{x.integrity.rawTechnical.sha256='0'.repeat(64);}],
 ['artifact PNG original equality false',x=>{x.integrity.artifactRefs[0].currentRunOriginalBytesWholeExact=false;}],
 ['artifact original bytes ref mismatch',x=>{x.integrity.artifactRefs[0].bytes++;}],
 ['artifact case equality false',x=>{x.integrity.selectedCases[0].compared8GroupsWholeExact=false;}],
 ['artifact new actual registration claim',x=>{x.integrity.actualRegisteredClaim=true;}]
];
for(const[name,mutate]of mutations)test('reject '+name,()=>{
 const x=fixture();mutate(x);assert.throws(()=>check(x),/^Error: M1S2_PROBLEM_UI_/);
});
for(const kind of['METADATA','IDENTITY']){
 const rows=fixed.subjects.map(s=>({questionUid:s.questionUid,sourceArchiveFile:s.sourceArchiveFile,sourceOrdinal:s.sourceOrdinal,unchanged:'issued'}));
 test(kind+' ignores unrelated generated row advances while preserving selected two whole rows',()=>{
  const before={records:clone(rows)},after={records:[...clone(rows),{questionUid:'qid_v1_'+'9'.repeat(64),unrelated:true}]};
  assert.doesNotThrow(()=>ui.selectedDataRows(before,after,fixed.subjects,kind));
 });
 test(kind+' rejects current selected whole-row drift',()=>{
  const before={records:clone(rows)},after={records:clone(rows)};after.records[0].unchanged='tampered';
  assert.throws(()=>ui.selectedDataRows(before,after,fixed.subjects,kind),/^Error: M1S2_PROBLEM_UI_/);
 });
 test(kind+' rejects duplicate selected UID',()=>{
  const before={records:clone(rows)},after={records:[...clone(rows),clone(rows[0])]};
  assert.throws(()=>ui.selectedDataRows(before,after,fixed.subjects,kind),/^Error: M1S2_PROBLEM_UI_/);
 });
}
