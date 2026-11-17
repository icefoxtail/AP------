'use strict';
// Read-only tests of the exact published current capture and original visual reuse.
// This does not execute a browser, source bank, registrar, builder or Consumer.

const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const ui=require('../tools/4slot/m1s2-problem-renderer-ui.cjs');
const root=path.resolve(__dirname,'..'),clone=x=>JSON.parse(JSON.stringify(x));
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const withoutCommit=({commit,...ref})=>ref;
const gitCache=new Map();
function git(args){
 const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
 return execFileSync('git',['-C',root,...args],{env,maxBuffer:64*1024*1024,timeout:60000,stdio:['ignore','pipe','pipe']});
}
function immutable(ref){
 const key=stable(ref);if(gitCache.has(key))return gitCache.get(key);
 assert.match(ref.commit,/^[a-f0-9]{40}$/);assert.match(ref.gitBlobSha1,/^[a-f0-9]{40}$/);assert.match(ref.sha256,/^[a-f0-9]{64}$/);
 assert.ok(typeof ref.path==='string'&&!ref.path.startsWith('/')&&!ref.path.split('/').some(p=>!p||p==='.'||p==='..'));
 const row=git(['ls-tree','-z',ref.commit,'--',ref.path]).toString(),tab=row.indexOf('\t'),parts=row.slice(0,tab).split(' ');
 assert.ok(tab>=0);assert.equal(row.slice(tab+1).replace(/\0$/,''),ref.path);
 assert.ok(['100644','100755'].includes(parts[0]));assert.equal(parts[1],'blob');assert.equal(parts[2],ref.gitBlobSha1);
 const bytes=git(['cat-file','blob',ref.gitBlobSha1]);assert.equal(bytes.length,ref.bytes);assert.equal(sha(bytes),ref.sha256);assert.equal(blob(bytes),ref.gitBlobSha1);
 gitCache.set(key,bytes);return bytes;
}
function regular(ref){
 let p=root;for(const part of ref.path.split('/')){p=path.join(p,part);assert.equal(fs.lstatSync(p).isSymbolicLink(),false);}
 assert.equal(fs.statSync(p).isFile(),true);return fs.readFileSync(p);
}
function reader({jsonMutations=new Map(),byteMutations=new Map(),denied=new Set()}={}){
 const reads=[];
 return{head:git(['rev-parse','HEAD']).toString().trim(),reads,
  read(ref,live=false){
   if(denied.has(ref.path))throw Error('TEST_DECLARED_INPUT_MISSING');
   const bytes=immutable(ref);if(live)assert.equal(sha(regular(ref)),ref.sha256);
   reads.push({path:ref.path,commit:ref.commit,live});
   return byteMutations.has(ref.path)?byteMutations.get(ref.path)(Buffer.from(bytes)):bytes;
  },
  json(ref,live=false){
   const d=JSON.parse(this.read(ref,live));if(jsonMutations.has(ref.path))jsonMutations.get(ref.path)(d);return d;
  }};
}
function ancestor(a,b){git(['merge-base','--is-ancestor',a,b]);}
function fixture(options){
 const r=reader(options),t=JSON.parse(immutable(ui.CURRENT_TECHNICAL_REF)),v=JSON.parse(immutable(ui.CURRENT_VISUAL_REF));
 const doc={uiTechnicalRef:withoutCommit(ui.CURRENT_TECHNICAL_REF),uiVisualRef:withoutCommit(ui.CURRENT_VISUAL_REF)};
 return{reader:r,doc,t,v,ancestor};
}
test('exact closed ops execution is recorded as push with null PR metadata',()=>{
 const f=fixture();ui.verifyCurrentCaptureExecution(f.t);assert.equal(f.t.execution.eventName,'push');assert.equal(f.t.execution.pullRequest,null);
 assert.equal(f.t.execution.headSha,f.t.execution.capturedHead);assert.equal(f.t.execution.eventSha,f.t.checkoutCommit);
});
for(const[name,change]of[
 ['PR relabelling',x=>x.execution.eventName='pull_request'],
 ['another repository',x=>x.execution.repository='fork/AP------'],
 ['another branch',x=>x.execution.ref='refs/heads/main'],
 ['missing ref',x=>delete x.execution.ref],
 ['missing captured head',x=>delete x.execution.capturedHead],
 ['mismatched event SHA',x=>x.execution.eventSha='0'.repeat(40)],
 ['mismatched checkout',x=>x.checkoutCommit='0'.repeat(40)],
 ['mismatched head',x=>x.execution.headSha='0'.repeat(40)],
 ['mismatched capture head',x=>x.execution.capturedHead='0'.repeat(40)],
 ['another run',x=>x.execution.runId='44015662987'],
 ['another attempt',x=>x.execution.runAttempt=2],
 ['another job',x=>x.execution.job='m1s2-problem-seven'],
 ['another workflow',x=>x.execution.workflow='unrelated'],
 ['forged PR number',x=>x.execution.pullRequest=1],
 ['forged PR base',x=>x.execution.baseSha='0'.repeat(40)],
 ['legacy owner',x=>x.executionOwner='GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD'],
 ['changed historical base',x=>x.baseCommit='0'.repeat(40)],
 ['unexpected fork flag',x=>x.execution.fork=true],
 ['missing run URL',x=>delete x.execution.runUrl]
])test('closed execution rejects '+name,()=>{const f=fixture();change(f.t);assert.throws(()=>ui.verifyCurrentCaptureExecution(f.t),/M1S2_PROBLEM_UI_CURRENT_CI_EXECUTION/);});
test('exact immutable current14 and prior14 visual records pass only the reuse preflight',()=>{
 const f=fixture();assert.equal(ui.verifyCurrentVisualReuse(f),true);
 assert.ok(f.reader.reads.some(r=>r.path===ui.CURRENT_TECHNICAL_REF.path&&r.live));
 assert.ok(f.reader.reads.some(r=>r.path===ui.CURRENT_VISUAL_REF.path&&r.live));
 assert.equal(f.reader.reads.filter(r=>r.path.endsWith('.png')).length,14);
 assert.equal(f.v.newVisualInspection,0);assert.equal(f.v.newSemanticApproval,0);assert.equal(f.v.newFourSlotVector,0);
});
test('all actual current14 retain existing coverage and native surface validation',()=>{
 const {t}=fixture();assert.equal(t.results.length,14);for(const r of t.results){
  ui.surfaceTopology(r.surfaceStructure,r.capture.visibleChildren);ui.coverage(r.capture,r.screenshots,r.viewport);
 }
 assert.equal(t.screenshotArtifacts.length,14);
});
test('new and legacy dispatch are disjoint without replacing the legacy checker pin',()=>{
 const f=fixture();assert.equal(ui.currentReuseRequested(f.doc,f.t,f.v),true);
 const oldT=JSON.parse(immutable(ui.PRIOR_TECHNICAL_REF)),oldV=JSON.parse(immutable(ui.PRIOR_VISUAL_REF));
 assert.equal(ui.currentReuseRequested({uiTechnicalRef:withoutCommit(ui.PRIOR_TECHNICAL_REF)},oldT,oldV),false);
 assert.equal(ui.PINS.checker.sha256,'282463f5278063bb2b97e2031c108a9f37cdd30eeb4062c5065976f843655b76');
 for(const k of['capture','surface','manifest'])assert.equal(stable(ui.PINS[k]),stable(ui.CURRENT_PINS[k]));
});
for(const[name,change]of[
 ['current technical path',f=>f.doc.uiTechnicalRef.path='docs/operations/other.json'],
 ['current technical digest',f=>f.doc.uiTechnicalRef.sha256='0'.repeat(64)],
 ['current technical commit inserted',f=>f.doc.uiTechnicalRef.commit=ui.CURRENT_CAPTURE_HEAD],
 ['current visual path',f=>f.doc.uiVisualRef.path='docs/operations/other.json'],
 ['current visual digest',f=>f.doc.uiVisualRef.sha256='0'.repeat(64)]
])test('current reuse rejects '+name,()=>{const f=fixture();change(f);assert.throws(()=>ui.verifyCurrentVisualReuse(f),/CURRENT_REF_SCOPE/);});
for(const[name,change]of[
 ['raw capture geometry',f=>f.t.results[0].capture.content.height++],
 ['raw PNG hash',f=>f.t.results[0].screenshots[0].sha256='0'.repeat(64)],
 ['raw live renderer pin',f=>f.t.servedFiles.find(r=>r.path==='archive/engine.html').sha256='0'.repeat(64)],
 ['raw live font pin',f=>f.t.studentFontResources[0].sha256='0'.repeat(64)],
 ['raw source pin',f=>f.t.results[0].sourceRef.sha256='0'.repeat(64)],
 ['raw selected asset pin',f=>f.t.results[0].assetRefs[0].sha256='0'.repeat(64)],
 ['visual record',f=>f.v.records[0].captureSha256='0'.repeat(64)],
 ['visual semantic approval',f=>f.v.newSemanticApproval=1],
 ['visual content hold removal',f=>f.v.continuingContentHolds='REMOVED']
])test('sealed publication rejects altered '+name,()=>{const f=fixture();change(f);assert.throws(()=>ui.verifyCurrentVisualReuse(f),/CURRENT_RAW_BINDING/);});
for(const[name,ref,mutate,pattern]of[
 ['missing independent acceptance',ui.CURRENT_INDEPENDENT_REF,d=>d.decision='PENDING',/CURRENT_EQUIVALENCE/],
 ['wrong independent capture commit',ui.CURRENT_INDEPENDENT_REF,d=>d.currentEvidenceCommit='0'.repeat(40),/CURRENT_EQUIVALENCE/],
 ['wrong witness source',ui.CURRENT_EQUIVALENCE_REF,d=>d.refs.currentTechnical.sha256='0'.repeat(64),/CURRENT_EQUIVALENCE/],
 ['changed prior visual record',ui.PRIOR_VISUAL_REF,d=>d.records[0].captureSha256='0'.repeat(64),/CURRENT_PRIOR_VISUAL/],
 ['changed prior visual decision',ui.PRIOR_VISUAL_REF,d=>d.decision='PENDING',/CURRENT_PRIOR_VISUAL/],
 ['changed prior screenshot inventory',ui.PRIOR_TECHNICAL_REF,d=>d.screenshotArtifacts[0].sha256='0'.repeat(64),/CURRENT_CAPTURE_REUSE/],
 ['changed prior source asset',ui.PRIOR_TECHNICAL_REF,d=>d.items[0].assetRef.sha256='0'.repeat(64),/CURRENT_APPROVED_INPUTS/],
 ['changed prior font bytes',ui.PRIOR_TECHNICAL_REF,d=>d.studentFontResources[0].sha256='0'.repeat(64),/CURRENT_FONT_INVENTORY/],
 ['missing prior case font responses',ui.PRIOR_TECHNICAL_REF,d=>d.results[0].technical.fontResourceIds=[],/CURRENT_FONT_CASE_REUSE/],
 ['missing binary readback',ui.CURRENT_REASSEMBLY_REF,d=>d.checks.pngFullRemoteReadback=false,/CURRENT_TRANSPORT/],
 ['wrong reconstructed PNG bytes',ui.CURRENT_REASSEMBLY_REF,d=>d.pngReadbacks.find(x=>x.profile==='m1').raw='0'.repeat(64),/CURRENT_TRANSPORT_PNG/],
 ['wrong reconstructed run',ui.CURRENT_REASSEMBLY_REF,d=>d.runId=1,/CURRENT_TRANSPORT/]
])test('reuse policy rejects '+name,()=>{const f=fixture({jsonMutations:new Map([[ref.path,mutate]])});assert.throws(()=>ui.verifyCurrentVisualReuse(f),pattern);});
test('missing original PNG bytes cannot be replaced by a declared inventory',()=>{
 const old=JSON.parse(immutable(ui.PRIOR_VISUAL_REF)),f=fixture({denied:new Set([old.artifactRefs[0].path])});
 assert.throws(()=>ui.verifyCurrentVisualReuse(f),/TEST_DECLARED_INPUT_MISSING/);
});
test('non-PNG bytes cannot back a prior visual observation',()=>{
 const old=JSON.parse(immutable(ui.PRIOR_VISUAL_REF)),f=fixture({byteMutations:new Map([[old.artifactRefs[0].path,()=>Buffer.from('not a PNG')]])});
 assert.throws(()=>ui.verifyCurrentVisualReuse(f),/CURRENT_PRIOR_PNG/);
});
test('missing publication ancestry fails before visual reuse',()=>{
 const f=fixture();f.ancestor=()=>{throw Error('TEST_ANCESTOR_REFUSED');};
 assert.throws(()=>ui.verifyCurrentVisualReuse(f),/TEST_ANCESTOR_REFUSED/);
});

const SIDECARS=[
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
      "gitBlobSha1": "62f472da789f277afe9f6603058e048509ffd8ec",
      "sha256": "989b32edc73a830f22fbb1fa004d781a49bc21783f4eb31f189a74b861bf49dd",
      "bytes": 6650
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6.json",
      "gitBlobSha1": "47d21b5867150454cf6f00fa6fc11c7f0d85bc3c",
      "sha256": "890b4212a3d19b6ff6f69aae6586ac1a1b1b0e95a9ef67826de3628a89c2a18b",
      "bytes": 6648
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3.json",
      "gitBlobSha1": "e9c235775dd2b66cdbb91f75a03ebb6339fb5acf",
      "sha256": "76fc45120d8ee6d116695cd3f0cc4a594494e10f772f217ecf6f5d49831fa09d",
      "bytes": 6669
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e.json",
      "gitBlobSha1": "acd6443f3c167a6274b8f7ff46a71f58e1c959ac",
      "sha256": "6764fb54252e6133425c756bce69a03f2060c5516c078557a65828d648490e41",
      "bytes": 6663
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15.json",
      "gitBlobSha1": "9bed94ffd50cd9a6ee4a739a786472567e8a002e",
      "sha256": "a5bc92b203b6d916ef5fbc2ed22691cc2a15d0562c6b8ebe88682bf570a2b037",
      "bytes": 6669
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140.json",
      "gitBlobSha1": "30f89918905b9a4fdbc77ad0d817e071a8bab690",
      "sha256": "276aa21cb8c12580d45f80098ac10bd2ccc8c8506efb9fc89f476e2cc82c4a4b",
      "bytes": 6664
    }
  },
  {
    "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
    "beforeRef": {
      "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
      "gitBlobSha1": "779fc4f6766d8b900408c7b0881ffcfd33f55a06",
      "sha256": "125ac3d9de600bd7de8380a0ec99af17a9cd7003f100ce8a8e7fff502deb7d9b",
      "bytes": 6648
    }
  }
];

test('all seven existing sidecars change only their two UI evidence references',()=>{
 for(const s of SIDECARS){
  const before=JSON.parse(immutable(s.beforeRef)),now=JSON.parse(regular({path:s.path}));
  assert.equal(stable(now.uiTechnicalRef),stable(withoutCommit(ui.CURRENT_TECHNICAL_REF)));
  assert.equal(stable(now.uiVisualRef),stable(withoutCommit(ui.CURRENT_VISUAL_REF)));
  const restored=clone(now);restored.uiTechnicalRef=before.uiTechnicalRef;restored.uiVisualRef=before.uiVisualRef;
  assert.equal(sha(stable(restored)),sha(stable(before)),'NON_UI_SIDECAR_FIELDS_CHANGED');
  assert.equal(now.newMathQa,0);assert.equal(now.newSemanticApproval,0);assert.equal(now.newFourSlotVector,0);
 }
});
