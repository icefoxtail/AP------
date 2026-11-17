#!/usr/bin/env node
'use strict';
// Private Palma Q6/Q8 transport gate. The original M1 existing-vector verifier
// keeps authority; only these two bindings and their source24 state are exercised.
// No fresh browser or mathematical review is performed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-m1-palma-two-current-ui-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m1-palma-two-current-source-registration-26fc-20261117",
  "integrationAncestor": "71104dabf173369d973c71e155e62f25af6ff235",
  "visualAncestor": "41f0037c41ac2276c7444bfff82c7aadc858d68f",
  "captureCommit": "02a634765f2947f34c8ce4193ee6da4143c515e4",
  "previousSidecarCommit": "41f0037c41ac2276c7444bfff82c7aadc858d68f",
  "rawTechnicalRef": {
    "commit": "4d2f8af25fecf7059e621f8df046c76dc4a9780c",
    "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/technical-proof.json",
    "gitBlobSha1": "f3bdd7c6e42ae57475a01f633aa0060e34226545",
    "sha256": "4271759b72b7ad9ddaabe964a92b702c108b413aea1649d69d8359359d50d32d",
    "bytes": 92485
  },
  "currentVisualRef": {
    "commit": "41f0037c41ac2276c7444bfff82c7aadc858d68f",
    "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/visual-current-reuse-v1.json",
    "gitBlobSha1": "9f2e2ecbca0a3b50d1d82b4147531409a2a7377c",
    "sha256": "e9fea7a643b7963228b77bdebf3d3aae71636bf01c05cfac41dd96fb53dd3ffb",
    "bytes": 9462
  },
  "liveDocuments": [
    {
      "commit": "4d2f8af25fecf7059e621f8df046c76dc4a9780c",
      "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/technical-proof.json",
      "gitBlobSha1": "f3bdd7c6e42ae57475a01f633aa0060e34226545",
      "sha256": "4271759b72b7ad9ddaabe964a92b702c108b413aea1649d69d8359359d50d32d",
      "bytes": 92485
    },
    {
      "commit": "41f0037c41ac2276c7444bfff82c7aadc858d68f",
      "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/visual-current-reuse-v1.json",
      "gitBlobSha1": "9f2e2ecbca0a3b50d1d82b4147531409a2a7377c",
      "sha256": "e9fea7a643b7963228b77bdebf3d3aae71636bf01c05cfac41dd96fb53dd3ffb",
      "bytes": 9462
    },
    {
      "commit": "4d2f8af25fecf7059e621f8df046c76dc4a9780c",
      "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/prior-four-equivalence.json",
      "gitBlobSha1": "222c16ed5b817da398dd14b5dbd45ca1280a8038",
      "sha256": "d7fd05d3f49668d753cfc4a17664fc780d876f15ec672c926508408d5179e30a",
      "bytes": 40692
    },
    {
      "commit": "4d2f8af25fecf7059e621f8df046c76dc4a9780c",
      "path": "docs/operations/m1s2-palma-two-current-ui-26fc-20261117/artifact-integrity.json",
      "gitBlobSha1": "1c1bea4c5351fd1ba46629ad43d2dc2c82e13d12",
      "sha256": "0950055fa2758505e451eca54f9fd5e261040b3d5565c8550d2bd05d9046220b",
      "bytes": 3513
    },
    {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/technical-proof.json",
      "gitBlobSha1": "82fe4a6929e1d7b800bbba4f3a2634ffea04cc77",
      "sha256": "6d7281d12281f6ceb454d3cc79244a66a8a5013327120a4b5bfde98671d8fa42",
      "bytes": 222310
    },
    {
      "commit": "d3d625ceb7315ffddbcd4a0a8c9960527fe0c9ed",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/visual-current-reuse-v1.json",
      "gitBlobSha1": "e626233f7aeaddf7d7d81bab5daf59e7ed2996bc",
      "sha256": "ca40535462ab65d42ddac642fe640dbcb49dee9ae03dd3f611813aab778d6807",
      "bytes": 18296
    }
  ],
  "artifactPrefix": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/",
  "artifactCommit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
  "files": [
    {
      "path": "tools/4slot/m1s2-problem-renderer-ui.cjs",
      "gitBlobSha1": "bf9a41fbca580050da23547a87c5a8c3c0096a80",
      "sha256": "357978aedd5b6a6f2db26641486c955ed0e385d462c1a334e8f95189cfff5e69",
      "bytes": 60514
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
      "gitBlobSha1": "baa8d283dd39fc93ba814944fd6e7db7913817fa",
      "sha256": "cf284c9c75ea09e69abdf994a2f4fec1c46b8e724e0dd8e9769adb91cb0ab5b4",
      "bytes": 6652
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
      "gitBlobSha1": "3b17ffb198afd09936ab920f7f2b6545ae0ad498",
      "sha256": "5685cfce97cc8ae5469f636e55be70148f727a1ab980677cff2d06c915f88e9e",
      "bytes": 6654
    },
    {
      "path": "tests/item-4slot-m1s2-palma-two-current-ui.test.cjs",
      "gitBlobSha1": "def1798bc13a35fe09ea4b26141665591b7da7ac",
      "sha256": "67a5c9391ce5621a96c02ab94b31199e22f7090cc6fc51b135da4f33627a8e93",
      "bytes": 10365
    },
    {
      "path": "tools/check-m1s2-palma-two-current-source-browser.cjs",
      "gitBlobSha1": "c805b5fb65e66933a4c409fd7976b96ef7571916",
      "sha256": "0be78ded64f0f75c5da5767aca742219d1187d242e1617fc0d211999042f3053",
      "bytes": 23509
    },
    {
      "path": "tests/fixtures/archive-m1s2-palma-two-current-source-ui.json",
      "gitBlobSha1": "1976f6c7e825e196082845f7230776f044be5579",
      "sha256": "dc41bcdd392f3bb20b7962628cdc04839b5073f04a1da1a0b90e25a549167ba9",
      "bytes": 2477
    },
    {
      "path": "tools/check-reviewed-problem-renderer-browser.cjs",
      "gitBlobSha1": "56c80b40d53fa88e8054a16f7b7267f968696f3f",
      "sha256": "e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673",
      "bytes": 56735
    },
    {
      "path": "tools/capture-m1s2-problem-surface.cjs",
      "gitBlobSha1": "ffeb072d7b94df6491ab7eeacb73ed1750f598ca",
      "sha256": "86b0e6761544480a688930928484e1f944e9e47e0ab2347aa22a35331891f5cf",
      "bytes": 10218
    },
    {
      "path": "tools/check-m1s2-problem-seven-browser.cjs",
      "gitBlobSha1": "b575897d190a512b48b04e03719bd3cc0cc02654",
      "sha256": "130fcab0be811c537ddce05f5c1f17a26e18cf9862ea690dbefcea419bde73e9",
      "bytes": 25233
    },
    {
      "path": "tests/fixtures/archive-m1s2-problem-seven-ui.json",
      "gitBlobSha1": "15b517839daec65eff8fc401b1c5a7fd1be9c3f5",
      "sha256": "a315e169b8b4666f54c81a68a2579ccab1fa85d4de8521b7002373e82f8802ef",
      "bytes": 7830
    }
  ],
  "codePins": [
    {
      "path": "tools/4slot/build-4slot-runtime.cjs",
      "bytes": 41001,
      "sha256": "1a84c4543209fb842065093fa05aa35c02fb2216e3fb6482745c91f3dc435873",
      "gitBlobSha1": "9fb98cdddc54bd5474ccf81b68d589617396de1c"
    },
    {
      "path": "archive/item-4slot.js",
      "bytes": 8639,
      "sha256": "0845bd881541a0b3f8faaf709b12274d09f29805bc36870bc245d12f4bfdab7d",
      "gitBlobSha1": "249e0af23b6a011d1247399ef487a635222e1e27"
    },
    {
      "path": "tools/4slot/m1s2-problem-renderer-continuity.cjs",
      "bytes": 21244,
      "sha256": "38556d0a9be5ab9582f3c0fc3a9c2a9401d34c46371f01574e88a0e5fffb84d2",
      "gitBlobSha1": "b073bac3a47ceee4fd69d52e91f37252bf61e60a"
    }
  ],
  "groups": [
    {
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "count": 24,
      "sourceRef": {
        "commit": "02a634765f2947f34c8ce4193ee6da4143c515e4",
        "path": "archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
        "gitBlobSha1": "5ee9cbf10fa9af98a4e1cd13ca7adb3948482e72",
        "sha256": "f744e3bfba4ada1d31dcbc33711f536b700dfb8f54cbb3350284e9b1087ca273",
        "bytes": 77225
      },
      "compactRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/data/item-4slot/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.4slot.json",
        "gitBlobSha1": "3d05e038b14f29901355effbf8e23870ae2f4101",
        "sha256": "2d1c703373568c6a12378306d66b02f630bbce0277297e1c99294f02093ebf82",
        "bytes": 8611
      },
      "dictionaryRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      },
      "compactSourceRef": {
        "commit": "4af0d3e08addac84ac833afc7cbc3519979f79a3",
        "path": "archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
        "gitBlobSha1": "37ea0edbc9cf0ca64eebe8e123d71a977183b004",
        "sha256": "a5f24d7f62c74dc0cf166883c27242b81c6ac4033a1383912fef53fbb67820a8",
        "bytes": 76871
      }
    }
  ],
  "selected": [
    {
      "questionUid": "qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "sourceOrdinal": 6,
      "sourceQuestionNo": "6",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
      "beforeGitBlobSha1": "3a361820e3ac959c759aed8bb421c319df6b0ae7",
      "vectorSha256": "56a2413062616754756dd4d17b6dc256654a7167b415e24cf924a9a24d767538",
      "priorMetadataRowSha256": "da647f6e59ddb25df00387d4a628bc1e30949c069ded62e890ae3eb74ad01c26",
      "priorIdentityRowSha256": "020925384d334e143ceea59acbb9ee3d3e43f0f1d6c165b260ad34470ea342a6"
    },
    {
      "questionUid": "qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "sourceOrdinal": 8,
      "sourceQuestionNo": "8",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
      "beforeGitBlobSha1": "37ae75f016b1ea7ef950df4e90f6f57e1a1f0daf",
      "vectorSha256": "7ece9382a2d167c5daa97e4cc959f853a6e379c09d11bc869ddf6d44abf5aa5c",
      "priorMetadataRowSha256": "71c0e2b10181bf8d3333d731974a10a841e9a7e1e800fede0c5eab244295ac85",
      "priorIdentityRowSha256": "d51f15d61f42c7af69069c3e306a61e7f3bf7c985556cf3a1dd54da054f7117f"
    }
  ],
  "generatedPaths": [
    "archive/data/question_metadata.json",
    "archive/data/question_identity_map.json",
    "archive/data/svg-accessibility-index.js"
  ],
  "preservedNamedDebts": [],
  "sourceQuestionCount": 24,
  "selectedQuestionCount": 2,
  "outsideQuestionCount": 22,
  "focusedTests": "New metadata76 executed separately; this gate does not rerun tests or browser captures."
};
const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const SVG='archive/data/svg-accessibility-index.js',INDEX='archive/data/item-4slot-index.json';
const VECTOR_DIR='.archive-meta-register/4slot-m1s2-problem-renderer-continuity';
const OID=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
const vector=row=>Object.fromEntries(['format','given','goal','method','condition','candidates'].map(k=>[k,row[k]]));
function need(ok,code){if(!ok)throw Error('M1_PALMA24_'+code);}
function safeRelative(rel){
  need(typeof rel==='string'&&rel.length>0&&!rel.includes('\\')&&!/[\x00-\x1f]/.test(rel)&&
    !path.posix.isAbsolute(rel)&&!rel.split('/').some(p=>!p||p==='.'||p==='..'),'PATH');
  return rel;
}
function file(root,rel){
  safeRelative(rel);let cur=root;
  for(const part of rel.split('/')){cur=path.join(cur,part);need(!fs.lstatSync(cur).isSymbolicLink(),'SYMLINK');}
  need(fs.statSync(cur).isFile(),'REGULAR_FILE');return cur;
}
function git(root,args,opts={}){
  const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
  return execFileSync('git',['-C',root,...args],{env,maxBuffer:160*1024*1024,timeout:180000,
    stdio:['ignore','pipe','pipe'],...opts});
}
function pin(raw,expected,label){
  need(Buffer.isBuffer(raw)&&raw.length===expected.bytes&&sha(raw)===expected.sha256&&
    blob(raw)===expected.gitBlobSha1,'PIN_'+label);
}
function refShape(ref){
  need(ref&&OID.test(ref.commit||'')&&OID.test(ref.gitBlobSha1||'')&&SHA.test(ref.sha256||'')&&
    Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<=128*1024*1024,'IMMUTABLE_REF');
  safeRelative(ref.path);return {commit:ref.commit,path:ref.path,gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes};
}
function refsIn(value,out=[]){
  if(Array.isArray(value)){for(const row of value)refsIn(row,out);}
  else if(value&&typeof value==='object'){
    if(Object.hasOwn(value,'gitBlobSha1')&&Object.hasOwn(value,'path'))out.push(value);
    else for(const [key,row]of Object.entries(value)){
      // Never follow whole-database output inventories into unrelated registration packets.
      if(key!=='outputDigests')refsIn(row,out);
    }
  }
  return out;
}
function leafPaths(value,out=[]){
  if(Array.isArray(value)){for(const x of value)leafPaths(x,out);}
  else if(value&&typeof value==='object'){
    if(typeof value.path==='string')out.push(value.path);
    for(const [key,x]of Object.entries(value))if(key!=='outputDigests'&&key!=='path')leafPaths(x,out);
  }
  return out;
}
function outputPath(name){
  const base=fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),full=path.resolve(name);
  need(full.startsWith(base+path.sep),'REPORT_OUTSIDE_RUNNER_TEMP');return full;
}
function safeReason(message){
  const text=String(message||''),prefix=text.split(':')[0];
  return {code:/^[A-Z][A-Z0-9_+|-]{0,179}$/.test(prefix)?prefix:'UNCLASSIFIED_FAILURE',sha256:sha(text)};
}
function provenance(root){
  const e=process.env,head=git(root,['rev-parse','HEAD']).toString().trim();
  need(e.GITHUB_ACTIONS==='true'&&e.GITHUB_EVENT_NAME==='push'&&e.GITHUB_REF===CONFIG.branch&&
    e.GITHUB_REPOSITORY===CONFIG.repository&&e.GITHUB_SHA===head&&
    e.ARCHIVE_M1_PALMA24_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
  const event=JSON.parse(fs.readFileSync(e.GITHUB_EVENT_PATH,'utf8'));
  need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
    event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
  need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
    e.GITHUB_JOB==='palma-two-existing-authority','OPS_RUN');
  need(git(root,['rev-parse','--is-shallow-repository']).toString().trim()==='false','FULL_HISTORY_REQUIRED');
  git(root,['merge-base','--is-ancestor',CONFIG.integrationAncestor,head]);
  git(root,['merge-base','--is-ancestor',CONFIG.visualAncestor,head]);
  return {provider:'GITHUB_ACTIONS',eventName:'push',ref:CONFIG.branch,repository:CONFIG.repository,
    checkoutCommit:head,eventCommit:event.after,runId:e.GITHUB_RUN_ID,runAttempt:Number(e.GITHUB_RUN_ATTEMPT),
    job:e.GITHUB_JOB,existingEvidenceCommit:CONFIG.visualAncestor,integrationAncestor:CONFIG.integrationAncestor};
}
function phase(report,name){report.phase=name;console.log(JSON.stringify({schemaVersion:CONFIG.schemaVersion,phase:name,status:'RUNNING'}));}
function run(root,reportPath){
  root=fs.realpathSync(root);reportPath=outputPath(reportPath);
  const report={schemaVersion:CONFIG.schemaVersion,status:'RUNNING',phase:'PROVENANCE',
    sourceQuestionCount:24,selectedQuestionCount:2,outsideQuestionCount:22,
    newMathQa:0,newSemanticApprovals:0,newFourSlotVectors:0,newFinalQaNativeApprovals:0,
    globalBuilderRun:false,mainWrites:0,trackedInputWrites:0,screenshotRuns:0};
  let fixture,checkpoint,rootStatus,rootHead;
  const currentInputs=new Map(),immutableInputs=new Map(),fixtureInputs=new Map();
  const writeReport=()=>{
    fs.mkdirSync(path.dirname(reportPath),{recursive:true});
    const raw=Buffer.from(JSON.stringify(report,null,2)+'\n');
    fs.writeFileSync(reportPath,raw);
    need(raw.length<=2*1024*1024,'REPORT_BOUND');
    const payload=raw.toString('base64'),width=6000,chunks=Math.ceil(payload.length/width);
    const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'M1_PALMA24_EXISTING_AUTHORITY',
      bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw),chunks};
    console.log('ARCHIVE_SCOPED_REPORT_BEGIN '+JSON.stringify(receipt));
    for(let i=0;i<chunks;i++)console.log('ARCHIVE_SCOPED_REPORT_CHUNK '+JSON.stringify({index:i,data:payload.slice(i*width,(i+1)*width)}));
    console.log('ARCHIVE_SCOPED_REPORT_END '+JSON.stringify(receipt));
  };
  try{
    report.execution=provenance(root);rootHead=report.execution.checkoutCommit;
    rootStatus=git(root,['status','--porcelain=v1','--untracked-files=all']).toString();
    need(rootStatus==='','ROOT_DIRTY');
    for(const expected of [...CONFIG.codePins,...CONFIG.files]){
      const raw=fs.readFileSync(file(root,expected.path));pin(raw,expected,'PRODUCTION');
      need(git(root,['rev-parse',rootHead+':'+expected.path]).toString().trim()===expected.gitBlobSha1,'PRODUCTION_HEAD');
    }
    const builder=require(path.join(root,'tools/4slot/build-4slot-runtime.cjs'));
    const consumer=require(path.join(root,'archive/item-4slot.js'));
    const {sourceNumber,sourceIdentityNumber}=require(path.join(root,'tools/4slot/exam-items.cjs'));
    const work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'m1-palma24-authority-'));
    fixture=path.join(work,'fixture');
    git(root,['clone','--quiet','--shared','--no-checkout','--no-hardlinks',root,fixture]);
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD');
    const commits=new Set();
    function ensureCommit(commit){
      need(OID.test(commit),'COMMIT');
      if(commits.has(commit))return;
      try{git(fixture,['cat-file','-e',commit+'^{commit}']);}
      catch{
        // Fetch only an already-declared exact immutable commit; never update a ref.
        git(fixture,['fetch','--quiet','--no-tags','--no-write-fetch-head',
          'https://github.com/'+CONFIG.repository+'.git',commit]);
        git(fixture,['cat-file','-e',commit+'^{commit}']);
      }
      commits.add(commit);need(commits.size<=128,'COMMIT_BOUND');
    }
    function immutable(ref){
      ref=refShape(ref);const key=ref.commit+':'+ref.path;
      report.activeImmutableReference=ref;
      ensureCommit(ref.commit);
      const entry=git(fixture,['ls-tree','-z',ref.commit,'--',ref.path]).toString();
      const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      need(match&&match[2]===ref.gitBlobSha1&&match[3]===ref.path,'IMMUTABLE_PATH');
      const raw=git(fixture,['show',ref.commit+':'+ref.path]);pin(raw,ref,'IMMUTABLE');
      const prior=immutableInputs.get(key);
      if(prior)need(stable(prior)===stable(ref),'IMMUTABLE_CONFLICT');
      else{immutableInputs.set(key,{commit:ref.commit,path:ref.path,gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes});
        need(immutableInputs.size<=1800,'IMMUTABLE_BOUND');}
      delete report.activeImmutableReference;return raw;
    }
    function current(rel){
      safeRelative(rel);report.activeCurrentPath=rel;
      const raw=fs.readFileSync(file(root,rel));
      const entry=git(root,['ls-tree','-z',rootHead,'--',safeRelative(rel)]).toString();
      const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      need(match&&match[3]===rel&&blob(raw)===match[2],'CURRENT_HEAD_BYTES');const oid=match[2];
      const observed={path:rel,gitBlobSha1:oid,sha256:sha(raw),bytes:raw.length};
      const prior=currentInputs.get(rel);
      if(prior)need(stable(prior)===stable(observed),'CURRENT_CHANGED');
      else currentInputs.set(rel,observed);
      delete report.activeCurrentPath;return raw;
    }
    function put(rel,raw){
      safeRelative(rel);const target=path.join(fixture,rel);
      fs.mkdirSync(path.dirname(target),{recursive:true});
      if(fs.existsSync(target)){need(sha(fs.readFileSync(file(fixture,rel)))===sha(raw),'FIXTURE_CONFLICT');return;}
      fs.writeFileSync(target,raw,{flag:'wx'});fs.chmodSync(target,0o444);
      const a=fs.statSync(target),b=fs.statSync(file(root,rel));need(a.dev!==b.dev||a.ino!==b.ino,'SHARED_WRITABLE_INODE');
      fixtureInputs.set(rel,{path:rel,gitBlobSha1:blob(raw),sha256:sha(raw),bytes:raw.length});
    }
    function copy(rel){const raw=current(rel);put(rel,raw);return raw;}
    function live(ref){immutable(ref);const raw=current(ref.path);pin(raw,ref,'LIVE');put(ref.path,raw);}
    const queue=[],queued=new Set();
    function queueDoc(ref){
      ref=refShape(ref);
      const key=ref.commit+':'+ref.path;
      if(queued.has(key))return;
      need(ref.path.endsWith('.json')&&ref.path.startsWith('docs/operations/')&&ref.bytes<=4*1024*1024,'DOCUMENT_SCOPE');
      queued.add(key);queue.push(ref);
    }
    function uiDocument(pathname){
      return pathname.endsWith('.json')&&
        (/^docs\/operations\/m1s2-problem-seven-ui-26fc-20261116\//.test(pathname)||
        /^docs\/operations\/middle-current-ui-26fc-20261117\/run-44015662986\//.test(pathname)||
        /^docs\/operations\/m1s2-palma-two-current-ui-26fc-20261117\//.test(pathname));
    }
    function declared(ref){
      const historical=Object.hasOwn(ref,'commit');
      const normalized=refShape(historical?ref:{commit:rootHead,...ref});
      if(historical)immutable(normalized);
      else live(normalized);
      return normalized;
    }
    function hydrateSidecar(doc){
      // M1's existing contract makes its current references HEAD-bound without
      // a commit member. Authenticate and copy exactly those current files;
      // prior snapshot references retain their own immutable commits.
      for(const ref of refsIn(doc)){const normalized=declared(ref);if(uiDocument(normalized.path))queueDoc(normalized);}
      queueDoc(declared(doc.uiTechnicalRef));queueDoc(declared(doc.uiVisualRef));
      if(doc.uiTechnicalRef.path===CONFIG.rawTechnicalRef.path){
        // The unchanged M1 verifier requires every current visual PNG to exist
        // as a regular live file as well as an authenticated immutable Git blob.
        const visual=JSON.parse(current(doc.uiVisualRef.path).toString());
        need(visual.schemaVersion==='archive-m1-palma-two-current-source-visual-reuse-v1'&&
          Array.isArray(visual.artifactRefs)&&visual.artifactRefs.length===4,'CURRENT_PNG4');
        const seen=new Set();
        for(const ref of visual.artifactRefs){
          need(ref.commit===CONFIG.artifactCommit&&ref.path.startsWith(CONFIG.artifactPrefix)&&
            ref.path.endsWith('.png')&&!seen.has(ref.path),'CURRENT_PNG_SCOPE');
          seen.add(ref.path);live(ref);
        }
      }
    }
    phase(report,'AUTHENTICATED_INPUTS');
    for(const filename of Object.keys(require.cache))if(filename.startsWith(root+path.sep))current(path.relative(root,filename).split(path.sep).join('/'));
    for(const ref of CONFIG.liveDocuments){live(ref);queueDoc(ref);}
    const actualRaw=copy(INDEX),actualIndex=JSON.parse(actualRaw.toString());
    need(actualIndex.schemaVersion===builder.SCHEMA&&Array.isArray(actualIndex.files)&&
      Array.isArray(actualIndex.records)&&Array.isArray(actualIndex.pending),'ACTUAL_INDEX');
    const identityRaw=copy(ID),identity=JSON.parse(identityRaw.toString());
    const metadata=JSON.parse(copy(MD).toString());copy(SVG);
    need(Array.isArray(metadata.records),'METADATA');
    need(identity.schemaVersion==='question-identity-map-v1'&&Array.isArray(identity.records),'IDENTITY');
    const identityGroups=new Map(),uidUses=new Map();
    for(const row of identity.records){
      const key=row.sourceArchiveFile+'#'+row.sourceOrdinal;
      if(!identityGroups.has(key))identityGroups.set(key,[]);
      identityGroups.get(key).push(row);uidUses.set(row.questionUid,(uidUses.get(row.questionUid)||0)+1);
    }
    const states=[],banks=new Map(),compacts=new Map();
    for(const group of CONFIG.groups){
      live(group.sourceRef);live(group.compactRef);live(group.dictionaryRef);
      const sourceRaw=current(group.sourceRef.path),bank=builder.loadBank(sourceRaw);
      const compact=JSON.parse(current(group.compactRef.path).toString());
      need(bank.length===group.count&&compact.items.length===group.count&&
        compact.sourceArchiveFile===group.sourceArchiveFile&&!Object.hasOwn(compact,'scope'),'BANK_DENOMINATOR');
      banks.set(group.sourceArchiveFile,bank);compacts.set(group.sourceArchiveFile,compact);
      // The official historical source payload remains the baseline for ordinary rows.
      need(OID.test(compact.sourceGitBlobSha),'COMPACT_BASELINE');
      need(group.compactSourceRef.gitBlobSha1===compact.sourceGitBlobSha,'COMPACT_BASELINE_REF');
      const old=immutable(group.compactSourceRef);
      need(blob(old)===compact.sourceGitBlobSha,'COMPACT_BASELINE_BYTES');
      for(let i=0;i<bank.length;i++){
        const q=bank[i],tuple=identityGroups.get(group.sourceArchiveFile+'#'+(i+1))||[];
        need(tuple.length===1&&UID.test(tuple[0].questionUid)&&uidUses.get(tuple[0].questionUid)===1,'UID_JOIN');
        need(String(tuple[0].sourceQuestionNo)===sourceIdentityNumber(q),'UID_NUMBER');
        const display=sourceNumber(q);
        need(Number.isSafeInteger(display)&&display>0&&compact.items.filter(it=>it.ordinal===display).length===1,'COMPACT_JOIN');
        states.push({questionUid:tuple[0].questionUid,sourceArchiveFile:group.sourceArchiveFile,sourceOrdinal:i+1,
          sourceQuestionNo:sourceIdentityNumber(q),displayNumber:display,compactPath:group.compactRef.path});
      }
      const paths=new Set(),student=['id','number','questionType','content','question','choices','answer','solution',
        'image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
      for(const q of bank){
        const text=JSON.stringify(Object.fromEntries(student.map(k=>[k,q[k]??null]))).replaceAll('\\/','/');
        for(const match of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
          paths.add(match[0].startsWith('archive/')?match[0]:'archive/'+match[0]);
      }
      for(const rel of [...paths].sort())copy(rel);
      // Explicit holds are read only from this exact source24 compact.
      for(const it of compact.items)if(it.registrationHold)for(const ref of Object.values(it.registrationHold)){
        if(ref&&typeof ref==='object'&&typeof ref.path==='string')copy(ref.path);
      }
    }
    need(states.length===24&&new Set(states.map(s=>s.questionUid)).size===24,'SOURCE24');
    const selected=new Set(CONFIG.selected.map(s=>s.questionUid)),allUids=new Set(states.map(s=>s.questionUid));
    for(const item of CONFIG.selected){
      const join=states.filter(s=>s.questionUid===item.questionUid);
      need(join.length===1&&join[0].sourceArchiveFile===item.sourceArchiveFile&&join[0].sourceOrdinal===item.sourceOrdinal,'SELECTED_JOIN');
    }
    const outside=states.filter(s=>!selected.has(s.questionUid));need(outside.length===22,'OUTSIDE22');
    const stateOf=(index,tuple)=>{
      const records=index.records.filter(r=>r.questionUid===tuple.questionUid);
      const pending=index.pending.filter(r=>r.path===tuple.compactPath&&
        (r.ordinal==null||r.ordinal===tuple.displayNumber));
      need(records.length<=1&&(records.length===1?pending.length===0:pending.length>0),'STATE_PARTITION');
      if(records.length)need(records[0].sourceArchiveFile===tuple.sourceArchiveFile&&
        records[0].sourceOrdinal===tuple.sourceOrdinal&&records[0].sourceQuestionNo===tuple.sourceQuestionNo,'STATE_TUPLE');
      return {questionUid:tuple.questionUid,record:records[0]||null,
        pending:pending.slice().sort((a,b)=>stable(a).localeCompare(stable(b),'en'))};
    };
    const actualOutside=outside.map(s=>stateOf(actualIndex,s));
    const actualSelected=states.filter(s=>selected.has(s.questionUid)).map(s=>stateOf(actualIndex,s));
    need(actualSelected.every(s=>s.record===null),'ACTUAL_SELECTED_ALREADY_REGISTERED');
    report.actualBaseline={index:currentInputs.get(INDEX),sourceRows:24,selectedRegistered:0,selectedPending:2,
      outsideRegistered:actualOutside.filter(s=>s.record).length,outsidePending:actualOutside.filter(s=>!s.record).length,
      outsideWholeStateSha256:sha(stable(actualOutside)),selectedWholeStateSha256:sha(stable(actualSelected))};
    const byPath=new Map(CONFIG.files.map(f=>[f.path,f])),candidateBytes=new Map(),beforeBytes=new Map();
    for(const item of CONFIG.selected){
      const raw=copy(item.path);pin(raw,byPath.get(item.path),'SIDECAR');
      const doc=JSON.parse(raw.toString());need(doc.questionUid===item.questionUid&&doc.sourceOrdinal===item.sourceOrdinal&&
        doc.sourceArchiveFile===item.sourceArchiveFile&&doc.vectorSha256===item.vectorSha256&&
        doc.newMathQa===0&&doc.newSemanticApproval===0&&doc.newFourSlotVector===0,'SIDECAR_SCOPE');
      candidateBytes.set(item.path,raw);hydrateSidecar(doc);
      ensureCommit(CONFIG.previousSidecarCommit);
      const before=git(fixture,['show',CONFIG.previousSidecarCommit+':'+item.path]);
      need(blob(before)===item.beforeGitBlobSha1,'OLD_SIDECAR');
      // The original currentSourceRef is intentionally stale; do not hydrate it
      // as live or normalize it. All unchanged authority refs are in the new
      // exact sidecar and the prior UI chain has already been authenticated.
      beforeBytes.set(item.path,before);
      const oldDoc=JSON.parse(before.toString()),expected={...oldDoc,currentSourceRef:doc.currentSourceRef,
        uiTechnicalRef:doc.uiTechnicalRef,uiVisualRef:doc.uiVisualRef};
      need(stable(expected)===stable(doc),'SIDECAR_ONLY_THREE_FIELDS');
      const mdRows=metadata.records.filter(r=>r.questionUid===item.questionUid),idRows=identity.records.filter(r=>r.questionUid===item.questionUid);
      need(mdRows.length===1&&idRows.length===1&&sha(stable(mdRows[0]))===item.priorMetadataRowSha256&&
        sha(stable(idRows[0]))===item.priorIdentityRowSha256,'SELECTED_MD_ID_WHOLE');
    }
    report.currentSelectedData={metadata:CONFIG.selected.map(item=>({questionUid:item.questionUid,
      wholeSha256:sha(stable(metadata.records.find(r=>r.questionUid===item.questionUid)))})),
      identity:CONFIG.selected.map(item=>({questionUid:item.questionUid,
      wholeSha256:sha(stable(identity.records.find(r=>r.questionUid===item.questionUid)))})),
      source24IdentityWholeSha256:sha(stable(states.map(s=>identity.records.find(r=>r.questionUid===s.questionUid)))),
      globalMetadataSha256:currentInputs.get(MD).sha256,capturedGlobalMetadataWholeEqualityRequired:false};
    const relevantFiles=actualIndex.files.filter(f=>CONFIG.groups.some(g=>g.compactRef.path===f.path));
    need(relevantFiles.length===1,'ACTUAL_FILE1');
    const claimPaths=new Set(leafPaths([...relevantFiles,...actualIndex.records.filter(r=>allUids.has(r.questionUid))])
      .filter(rel=>rel.startsWith('.archive-meta-register/4slot-')));
    // Filenames own the exact UID. Inspect no other source or registration packet.
    for(const uid of allUids){
      const rel=VECTOR_DIR+'/'+uid+'.json';
      if(fs.existsSync(path.join(root,rel)))claimPaths.add(rel);
    }
    for(const rel of [...claimPaths].sort()){
      safeRelative(rel);
      need(rel.startsWith(VECTOR_DIR+'/')&&UID.test(path.posix.basename(rel,'.json')),'UNSUPPORTED_OUTSIDE_CONTINUITY');
      const raw=copy(rel),doc=JSON.parse(raw.toString());
      need(allUids.has(doc.questionUid)&&states.some(s=>s.questionUid===doc.questionUid&&
        s.sourceArchiveFile===doc.sourceArchiveFile&&s.sourceOrdinal===doc.sourceOrdinal),'CLAIM_SCOPE');
      if(!selected.has(doc.questionUid))hydrateSidecar(doc);
    }
    const technical=JSON.parse(immutable(CONFIG.rawTechnicalRef).toString());
    need(technical.checkoutCommit===CONFIG.captureCommit&&technical.items.length===2&&technical.results.length===4&&
      technical.servedFiles.length===89&&technical.mirroredAssets.length===17&&technical.studentFontResources.length===31,'CAPTURE_SCOPE');
    queueDoc(CONFIG.rawTechnicalRef);
    const data=new Set(CONFIG.generatedPaths);
    // Match the original M1 live-input boundary exactly. Other captured image
    // rows stay immutable evidence; each owned current source/asset is already
    // authenticated by the two exact sidecars and original official verifier.
    for(const ref of technical.servedFiles){
      immutable(ref);
      if(!data.has(ref.path)&&!ref.path.startsWith('archive/exams/')&&!ref.path.startsWith('archive/assets/images/'))live(ref);
    }
    for(const ref of technical.mirroredAssets)immutable(ref);
    for(const ref of technical.studentFontResources)live(ref);
    for(const key of ['manifestRef','checkerRef','captureHelperRef','surfaceHelperRef','fontLicenseRef'])live(technical[key]);
    let summaryPinCount=0;
    while(queue.length){
      const ref=queue.shift(),doc=JSON.parse(immutable(ref).toString());
      for(const nested of refsIn(doc)){
        if(Object.hasOwn(nested,'commit')){
          const normalized=refShape(nested);immutable(normalized);
          if(uiDocument(normalized.path))queueDoc(normalized);
        }else{
          // Published equivalence documents contain before/current digest summaries,
          // not HEAD references. Never reinterpret a historical summary as live.
          // Required live files were copied from the exact sidecars, current capture,
          // and fixed liveDocuments above. The production verifier still reads them.
          need(OID.test(nested.gitBlobSha1||'')&&SHA.test(nested.sha256||'')&&
            Number.isSafeInteger(nested.bytes)&&nested.bytes>0&&nested.bytes<=128*1024*1024,'SUMMARY_PIN_SHAPE');
          safeRelative(nested.path);summaryPinCount++;
        }
      }
      need(queued.size<=96,'DOCUMENT_BOUND');
    }
    report.publicDocumentInputs={authenticatedDocuments:queued.size,immutableSummaryPins:summaryPinCount,
      summaryPinsPromotedToHeadReferences:0,liveDependencies:'EXACT_SIDECARS_CURRENT_CAPTURE_FIXED_LIVE_DOCUMENTS'};
    checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX&&!candidateBytes.has(x.path));
    const outsideSame=index=>{
      need(index.counts.files===1&&index.counts.items===24&&index.records.length+index.pending.length===24,'RESULT_DENOMINATOR');
      need(index.records.every(r=>allUids.has(r.questionUid))&&index.pending.every(r=>
        CONFIG.groups.some(g=>g.compactRef.path===r.path)&&Number.isSafeInteger(r.ordinal)),'RESULT_SCOPE');
      const now=outside.map(s=>stateOf(index,s));
      report.lastOutsideCheck={phase:report.phase,expectedSha256:sha(stable(actualOutside)),observedSha256:sha(stable(now)),
        changed:now.flatMap((row,i)=>stable(row)===stable(actualOutside[i])?[]:[{questionUid:row.questionUid,
          expectedWholeSha256:sha(stable(actualOutside[i])),observedWholeSha256:sha(stable(row)),
          expectedRegistered:!!actualOutside[i].record,observedRegistered:!!row.record,
          observedPending:row.pending.map(p=>safeReason(p.reason))}])};
      need(stable(now)===stable(actualOutside),'OUTSIDE22_CHANGED');
    };
    const observedStable=built=>{
      for(const [rel,digest]of built.observed)need(sha(fs.readFileSync(file(fixture,rel)))===digest,'INPUT_CHANGED_DURING_BUILD');
    };
    function privateSidecars(bytes){
      for(const [rel,raw]of bytes){const target=file(fixture,rel);fs.chmodSync(target,0o644);fs.writeFileSync(target,raw);fs.chmodSync(target,0o444);}
    }
    function selectedSummary(index){
      return states.filter(s=>selected.has(s.questionUid)).map(s=>{
        const row=stateOf(index,s);
        return {questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,registered:!!row.record,
          recordSha256:row.record?sha(stable(row.record)):null,pending:row.pending.map(p=>safeReason(p.reason))};
      });
    }
    phase(report,'OLD_BINDING_BASELINE');
    privateSidecars(beforeBytes);
    const before=builder.build(fixture,{previous:actualIndex,reuseCache:false});
    observedStable(before);outsideSame(before.index);
    need(before.index.records.filter(r=>selected.has(r.questionUid)).length===0,'OLD_BINDING_MUST_REFUSE');
    report.before={counts:before.index.counts,selected:selectedSummary(before.index),outsideWholeStateSha256:sha(stable(actualOutside))};
    phase(report,'OFFICIAL_EXISTING_AUTHORITY2');
    privateSidecars(candidateBytes);
    const after=builder.build(fixture,{previous:before.index,reuseCache:false});
    observedStable(after);outsideSame(after.index);
    report.after={counts:after.index.counts,selected:selectedSummary(after.index)};
    const rows=after.index.records.filter(r=>selected.has(r.questionUid));
    need(rows.length===2&&after.index.counts.registered===before.index.counts.registered+2&&
      after.index.counts.pending===before.index.counts.pending-2,'EXPECTED_TWO_RECOVERED');
    for(const item of CONFIG.selected){
      const row=rows.find(r=>r.questionUid===item.questionUid),pinInfo=byPath.get(item.path);
      need(row&&row.sourceBinding==='M1S2_PROBLEM_RENDERER_CONTINUITY'&&row.registrationStatus==='REGISTERED'&&
        row.independentReviewClaim===false&&row.m1ProblemContinuityRef?.path===item.path&&
        row.m1ProblemContinuityRef?.sha256===pinInfo.sha256&&sha(stable(vector(row)))===item.vectorSha256,'EXISTING_AUTHORITY_BINDING');
    }
    const verified=builder.verify(after.index),api=consumer.createIndex(after.index);
    let queries=0;
    for(const row of rows){
      need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_GET');queries++;
      for(const slot of builder.SLOTS)for(const term of row[slot]){
        need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_HAS_TERM');queries++;
      }
    }
    report.existingRegisteredAuthority={verified:2,route:'official build -> m1Problem.verify -> prior REGISTERED/source/MD/ID/vector/original review/current UI guards',
      coreGitBlobSha1:CONFIG.codePins.find(p=>p.path.endsWith('/m1s2-problem-renderer-continuity.cjs')).gitBlobSha1,
      newFinalQaNativeApprovals:0,newSemanticApprovals:0,newFourSlotVectors:0,
      namedAuthorityDebtsPreserved:CONFIG.preservedNamedDebts};
    report.consumer={selected:2,queries,officialVerifyStatus:verified.status,officialScopeVerified:verified.verified,
      pendingPreserved:verified.pending,outsideWholeStateSha256:sha(stable(actualOutside))};
    phase(report,'COLD_CHECK');
    const privateIndex=file(fixture,INDEX);fs.chmodSync(privateIndex,0o644);
    fs.writeFileSync(privateIndex,JSON.stringify(after.index)+'\n');fs.chmodSync(privateIndex,0o444);
    const cold=builder.run(fixture,{check:true});
    need(cold.changed===false&&cold.revalidatedFiles===1&&cold.reusedFiles===0,'COLD_REPLAY');
    report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,
      counts:cold.counts,indexSha256:cold.indexSha256};
    phase(report,'CURRENT_VISUAL_DELETION_REFUSAL');
    const visualPath=CONFIG.currentVisualRef.path,visualBytes=fs.readFileSync(file(fixture,visualPath));
    fs.unlinkSync(file(fixture,visualPath));
    const withoutVisual=builder.build(fixture,{previous:after.index,reuseCache:false});
    observedStable(withoutVisual);outsideSame(withoutVisual.index);
    need(withoutVisual.index.records.filter(r=>selected.has(r.questionUid)).length===0,'DELETED_VISUAL_REGISTERED');
    const rejectedVisual=states.filter(s=>selected.has(s.questionUid)).map(s=>stateOf(withoutVisual.index,s));
    need(rejectedVisual.every(s=>s.record===null&&s.pending.length===1),'DELETED_VISUAL_PARTITION');
    report.visualDeletion={removedPath:visualPath,selectedRejected:2,
      selected:rejectedVisual.map(s=>({questionUid:s.questionUid,pending:s.pending.map(p=>safeReason(p.reason))})),
      outsideWholeStateSha256:sha(stable(actualOutside))};
    fs.writeFileSync(path.join(fixture,visualPath),visualBytes,{flag:'wx',mode:0o444});
    phase(report,'INDIVIDUAL_SIDECAR_DELETION_REFUSAL');
    report.sidecarDeletion=[];
    for(const item of CONFIG.selected){
      fs.unlinkSync(file(fixture,item.path));
      const removed=builder.build(fixture,{previous:after.index,reuseCache:false});
      observedStable(removed);outsideSame(removed.index);
      const s=states.find(s=>s.questionUid===item.questionUid),lost=stateOf(removed.index,s);
      need(lost.record===null&&lost.pending.length===1&&
        lost.pending[0].reason==='M1S2_PROBLEM_CONTINUITY_CLAIM_MISSING_OR_MIXED','DELETE_REASON');
      const other=CONFIG.selected.find(x=>x.questionUid!==item.questionUid);
      const kept=removed.index.records.find(r=>r.questionUid===other.questionUid),old=rows.find(r=>r.questionUid===other.questionUid);
      need(kept&&stable(kept)===stable(old),'OTHER_SELECTED_CHANGED');
      report.sidecarDeletion.push({questionUid:item.questionUid,removedPath:item.path,registered:false,
        reason:safeReason(lost.pending[0].reason),otherSelectedWholeUnchanged:true,
        outsideWholeStateSha256:sha(stable(actualOutside))});
      fs.writeFileSync(path.join(fixture,item.path),candidateBytes.get(item.path),{flag:'wx',mode:0o444});
    }
    need(report.sidecarDeletion.length===2,'DELETION_COUNT');
    report.deleted={selectedRejectedIndividually:2,outsideWholeStateSha256:sha(stable(actualOutside))};
    for(const [rel,bytes]of candidateBytes)need(sha(fs.readFileSync(file(fixture,rel)))===sha(bytes),'SIDECAR_RESTORED');
    for(const expected of checkpoint)pin(fs.readFileSync(file(fixture,expected.path)),expected,'PRIVATE_INPUT_UNCHANGED');
    for(const expected of currentInputs.values())pin(fs.readFileSync(file(root,expected.path)),expected,'ROOT_INPUT_UNCHANGED');
    need(git(root,['rev-parse','HEAD']).toString().trim()===rootHead&&
      git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus,'ROOT_MUTATION');
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD_CHANGED');
    report.inputProof={checkoutCurrent:[...currentInputs.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),
      immutable:[...immutableInputs.values()].sort((a,b)=>(a.commit+':'+a.path).localeCompare(b.commit+':'+b.path,'en')),
      currentFileCount:currentInputs.size,immutableRefCount:immutableInputs.size,
      privateNonDerivedFilesUnchanged:checkpoint.length,sharedWritableHardlinks:0,
      scope:'one current source24 bank; unchanged original seven-item authority documents read as metadata/history; no other current question bank staged; no global outputDigests recursion'};
    report.phase='COMPLETE';report.status='PASS_PRIVATE_SCOPED_EXISTING_AUTHORITY';
    report.actualMainRegistration='NOT_PERFORMED';report.sourceApprovalMutation=0;
    writeReport();
    console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,selectedExistingAuthority:2,
      selectedConsumer:2,sourceQuestionCount:24,outsideWholeStatePreserved:22,coldChanged:false,deletionRejected:2,
      newFinalQaNativeApprovals:0,mainWrites:0,reportSha256:sha(fs.readFileSync(reportPath))}));
    return report;
  }catch(error){
    report.status='FAIL';report.error=safeReason(error?.message);report.actualMainRegistration='NOT_PERFORMED';
    if(rootHead){
      try{report.rootHeadUnchanged=git(root,['rev-parse','HEAD']).toString().trim()===rootHead;
        report.rootStatusUnchanged=git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus;}
      catch{report.rootInputCheck='UNAVAILABLE';}
    }
    report.currentInputCount=currentInputs.size;report.immutableRefCount=immutableInputs.size;
    writeReport();console.error(JSON.stringify({schemaVersion:report.schemaVersion,status:'FAIL',phase:report.phase,error:report.error,
      selected:report.after?.selected||report.before?.selected||null,reportSha256:sha(fs.readFileSync(reportPath))}));
    process.exitCode=1;return report;
  }finally{
    if(fixture)fs.rmSync(path.dirname(fixture),{recursive:true,force:true});
  }
}
if(require.main===module){
  const args=process.argv.slice(2);let root=path.resolve(__dirname,'../..'),output;
  for(let i=0;i<args.length;i++){
    if(args[i]==='--root')root=path.resolve(args[++i]);
    else if(args[i]==='--output')output=args[++i];
    else throw Error('M1_PALMA24_UNKNOWN_ARGUMENT');
  }
  need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
