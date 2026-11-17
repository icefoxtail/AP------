#!/usr/bin/env node
'use strict';
// Read-only ops gate. Existing vector/native authority is verified by the unchanged
// official builder. Only an isolated derived index and seven private sidecars vary.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-svg7-current-ui-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/middle-existing-evidence-gate-26fc-20261117",
  "integrationAncestor": "c816d2d39e5218d7a6547956c73e4463ae7e6377",
  "visualAncestor": "d8c5d6c3a81b20838ec8dc1102120dc7ddac0c28",
  "previousCapture": "a57c51f633c937da15d1fac766631b413e02bd55",
  "rawTechnicalRef": {
    "commit": "30d0245666fc6d85c73f2ef25fe6796560c64843",
    "path": "docs/operations/m2s1-svg7-current-ui-26fc-20261117/run-44011127748/technical-proof.json",
    "gitBlobSha1": "c18655b38cb8adef217781e6b6bbf65ba8570758",
    "sha256": "576c49a84a24ea53412817d8ab19868b59b8b4ac5f9775bc93e3619e747e4e03",
    "bytes": 204380
  },
  "files": [
    {
      "path": "tools/4slot/existing-registered-vector-svg7-ui.cjs",
      "gitBlobSha1": "ca4f1d36a6c758a5984226c9091e9bb01b38157f",
      "sha256": "b97aedb8e2752bbebc8feaf324ec1254b07cbde41e5f115daaf2b80cb1a63a90",
      "bytes": 57228
    },
    {
      "path": "tools/4slot/existing-registered-vector-ui.cjs",
      "gitBlobSha1": "118b051856ae773e3209d2c1cffdd836ffaf3fcd",
      "sha256": "b7e02e16d03c1bafe7c77ad42be9d6c81d9b7623dbc10508c17f7a72536d0162",
      "bytes": 19543
    },
    {
      "path": "tests/item-4slot-svg7-current-ui-binding.test.cjs",
      "gitBlobSha1": "1c219cf8e38e983a83dd70efb8021404b498e944",
      "sha256": "236d3c11a507dcec04cc8e391ec5d6f3535c9a3e9fc62c86fcf05da456ca91a1",
      "bytes": 16919
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6.json",
      "gitBlobSha1": "28d269a294b015c70d32c196ec7989b9b5857af5",
      "sha256": "fd84b83888c2046b6557a1a59335e5fa47327e99087c6d7e3c8020f5a91e9ae8",
      "bytes": 11473
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569.json",
      "gitBlobSha1": "2115da491383d19f093e93a130b29c30215133a5",
      "sha256": "ce6ef1a851f8fa0aa2950621acda706d6ac48c07eff1059d19eaacdf4e84c6c7",
      "bytes": 14605
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec.json",
      "gitBlobSha1": "df107391e2c68df5871e01c777060d1fc0eaef95",
      "sha256": "23eb8659d6c99bc9e0f5f0fabc6ff00f8a98ae2d221674ec4fb291eab29a122b",
      "bytes": 13929
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad.json",
      "gitBlobSha1": "406f3c44b5a30d6f45f771a1ba38ec28614bb269",
      "sha256": "f23ff4a001221eeefd336b947ac0ac0926dc7ca01837d0c4640cb945db51ae68",
      "bytes": 13931
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637.json",
      "gitBlobSha1": "8bb003fd3eb01ed8e2f9af66532537e7fac3d35b",
      "sha256": "931256a612d871214f0f4c70ae12fd3e945ab72bab089da3f748792143d0e1cb",
      "bytes": 13928
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5.json",
      "gitBlobSha1": "14628a32fa0c60d0412c082c4fb53fe2fe37e7d1",
      "sha256": "ec2dc71cfe34a9f1cf56df2ed0d37d80cf7d3883a34686c4677257ca61a4ff98",
      "bytes": 11479
    },
    {
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd.json",
      "gitBlobSha1": "f476cec42037470f1a1ad6ba61d56e6f624c1495",
      "sha256": "b2070ffb9505a7011029560b75485322e69deade7b4b5d87cf64b976ffcc5e4e",
      "bytes": 10870
    }
  ],
  "codePins": [
    {
      "path": "tools/4slot/existing-registered-vector-continuity.cjs",
      "bytes": 36977,
      "sha256": "db4012f752fce8ad81ab0149b1ec79dc49f197247f7d9601dc9ac20e9064d9f4",
      "gitBlobSha1": "524c9628f90438930774fd5b15df36f43eb4e903"
    },
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
      "path": "tools/4slot/existing-registered-vector-svg7-derived-continuity.cjs",
      "bytes": 11956,
      "sha256": "b1cbfb5e1bb38654719a2af739fe920b03165e8dba017f4d4ce95b361eecd81e",
      "gitBlobSha1": "8822c007ecd2f87cf108d9d75a756547a25b9524"
    }
  ],
  "groups": [
    {
      "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
      "count": 24,
      "sourceRef": {
        "commit": "45e976a5981701bef9c755d50c11636116ee788f",
        "path": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
        "gitBlobSha1": "c8945961f52f7efca83d66ea045d070e74718de6",
        "sha256": "c1d8ce4c3de70c67d7a3ecf02031fd48327103785fec40505e1576043625618a",
        "bytes": 44656
      },
      "compactRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "archive/data/item-4slot/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.4slot.json",
        "gitBlobSha1": "a9aceaf29233b879eea905dc28b3a4757dda59ce",
        "sha256": "324142b835720eda1bb25f706259699faa1633b93f9b703befd6ff6f8057c3bf",
        "bytes": 3758
      },
      "dictionaryRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "count": 25,
      "sourceRef": {
        "commit": "45e976a5981701bef9c755d50c11636116ee788f",
        "path": "archive/exams/original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
        "gitBlobSha1": "9283d798bb19ebdb498ff91d5d8d7d219d3baf27",
        "sha256": "890c15ac7d12aae4e432828b0eedbecea9df0faa6b44706433ece4145831854c",
        "bytes": 43819
      },
      "compactRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "archive/data/item-4slot/original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.4slot.json",
        "gitBlobSha1": "e9d4200fcf08470b13ea6227fba357202d0915a2",
        "sha256": "20bb8b2c9cd2437fbdb412b1a9b7e027c5fa03e19b8dc1b3107abb4b1031f99a",
        "bytes": 4141
      },
      "dictionaryRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "count": 26,
      "sourceRef": {
        "commit": "45e976a5981701bef9c755d50c11636116ee788f",
        "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
        "gitBlobSha1": "4a20adbce9e5a7f07744143cef611d453e454250",
        "sha256": "bb0904139d63eee938b33add6a9b48e1129bfa7d7e9dd9d6939045f66c50f88b",
        "bytes": 40797
      },
      "compactRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "archive/data/item-4slot/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.4slot.json",
        "gitBlobSha1": "f19f05d11d35fb7af53ae6232e716f0755ca5ac1",
        "sha256": "5073e0edf0afb742d59c56a4bd4cbc2c4752ff79de1ec100011a1f8b517ba644",
        "bytes": 3958
      },
      "dictionaryRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    }
  ],
  "selected": [
    {
      "questionUid": "qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6",
      "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 3,
      "sourceQuestionNo": "3",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6.json",
      "beforeGitBlobSha1": "5f997e86a464ac67216987dc7e56d7d8b7bc572c",
      "vectorSha256": "58380137abf030ad80aa0b018ac93f6d213ab0b571148820c8a20d6894795a1f"
    },
    {
      "questionUid": "qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569",
      "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 15,
      "sourceQuestionNo": "15",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569.json",
      "beforeGitBlobSha1": "d48c040c8eea1fec49287703a37b5b74a61128d5",
      "vectorSha256": "efdc37aa74db39064c78e2b9958e56e63d00e878c6764eef67f4c4b1f97fb4b7"
    },
    {
      "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 11,
      "sourceQuestionNo": "11",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec.json",
      "beforeGitBlobSha1": "a7069890d93453194b7f172971344c66c02cc027",
      "vectorSha256": "a35fa0fc3d00d4b1fa535313c99ac2d4d0d5d35cf9f6174c511b31083c57b014"
    },
    {
      "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 24,
      "sourceQuestionNo": "24",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad.json",
      "beforeGitBlobSha1": "77ba241dcc1c1937501e1b234415e7b52e668903",
      "vectorSha256": "1c4fdbf10dfb547b60bfe243b9b3ad13e89e977a7165fc3e2fb713eca544ff75"
    },
    {
      "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 13,
      "sourceQuestionNo": "13",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637.json",
      "beforeGitBlobSha1": "556908100f09236210831b8d86ce8b2a2faf37c3",
      "vectorSha256": "fd39c23c9e660bbdd9dc52f3031bfc1c9e37c3cf162f2f15bf07396fd96f12a1"
    },
    {
      "questionUid": "qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5",
      "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 15,
      "sourceQuestionNo": "15",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5.json",
      "beforeGitBlobSha1": "d3cf525329e1c767b867179651187937d56b5186",
      "vectorSha256": "96c879c1db54dfb25b2ca19880da8a8aa55b4859767ef40ebf1c5db934d00093"
    },
    {
      "questionUid": "qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd",
      "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 24,
      "sourceQuestionNo": "24",
      "path": ".archive-meta-register/4slot-existing-vector-continuity/qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd.json",
      "beforeGitBlobSha1": "cc6274ec9ba5dccb85f115d793aba4547824fb62",
      "vectorSha256": "e6fd67a441dcf63681d1677a5895f26004333d2fa533e3d155dc01eb3d238286"
    }
  ],
  "generatedPaths": [
    "archive/data/question_metadata.json",
    "archive/data/question_identity_map.json",
    "archive/data/svg-accessibility-index.js"
  ],
  "preservedNamedDebts": [
    "E045-Q15",
    "E045-Q24"
  ]
};

const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const SVG='archive/data/svg-accessibility-index.js',INDEX='archive/data/item-4slot-index.json';
const VECTOR_DIR='.archive-meta-register/4slot-existing-vector-continuity';
const OID=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
const vector=row=>Object.fromEntries(['format','given','goal','method','condition','candidates'].map(k=>[k,row[k]]));
function need(ok,code){if(!ok)throw Error('SVG7_SCOPE_'+code);}
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
    if(Object.hasOwn(value,'commit')&&Object.hasOwn(value,'gitBlobSha1')&&Object.hasOwn(value,'path'))out.push(refShape(value));
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
    e.ARCHIVE_SVG7_GATE_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
  const event=JSON.parse(fs.readFileSync(e.GITHUB_EVENT_PATH,'utf8'));
  need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
    event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
  need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
    e.GITHUB_JOB==='svg7-existing-authority','OPS_RUN');
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
    sourceQuestionCount:75,selectedQuestionCount:7,outsideQuestionCount:68,
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
    const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'SVG7_EXISTING_AUTHORITY',
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
    const work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'svg7-authority-scope-'));
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
      ensureCommit(ref.commit);
      const entry=git(fixture,['ls-tree','-z',ref.commit,'--',ref.path]).toString();
      const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      need(match&&match[2]===ref.gitBlobSha1&&match[3]===ref.path,'IMMUTABLE_PATH');
      const raw=git(fixture,['cat-file','blob',ref.gitBlobSha1]);pin(raw,ref,'IMMUTABLE');
      const prior=immutableInputs.get(key);
      if(prior)need(stable(prior)===stable(ref),'IMMUTABLE_CONFLICT');
      else{immutableInputs.set(key,{commit:ref.commit,path:ref.path,gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes});
        need(immutableInputs.size<=1800,'IMMUTABLE_BOUND');}
      return raw;
    }
    function current(rel){
      const raw=fs.readFileSync(file(root,rel)),oid=git(root,['rev-parse',rootHead+':'+safeRelative(rel)]).toString().trim();
      need(OID.test(oid)&&blob(raw)===oid,'CURRENT_HEAD_BYTES');
      const observed={path:rel,gitBlobSha1:oid,sha256:sha(raw),bytes:raw.length};
      const prior=currentInputs.get(rel);
      if(prior)need(stable(prior)===stable(observed),'CURRENT_CHANGED');
      else currentInputs.set(rel,observed);
      return raw;
    }
    function put(rel,raw){
      safeRelative(rel);const target=path.join(fixture,rel);
      fs.mkdirSync(path.dirname(target),{recursive:true});
      if(fs.existsSync(target)){need(sha(fs.readFileSync(file(fixture,rel)))===sha(raw),'FIXTURE_CONFLICT');return;}
      fs.writeFileSync(target,raw,{flag:'wx'});fs.chmodSync(target,0o444);
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
        (/^docs\/operations\/m2s1-svg7[^/]*\//.test(pathname)||
        /^docs\/operations\/m2s1-svg7-current-ui-26fc-20261117\//.test(pathname));
    }
    function hydrateSidecar(doc){
      for(const ref of refsIn(doc)){immutable(ref);if(uiDocument(ref.path))queueDoc(ref);}
      for(const review of doc.displayReviews||[]){
        for(const key of ['independentRef','technicalRef','visualRef'])queueDoc(review[key]);
        const independent=JSON.parse(immutable(review.independentRef).toString());
        for(const key of ['givenRef','originalObservationRef','currentObservationRef'])immutable(refShape(independent[key]));
      }
    }
    phase(report,'AUTHENTICATED_INPUTS');
    const actualRaw=copy(INDEX),actualIndex=JSON.parse(actualRaw.toString());
    need(actualIndex.schemaVersion===builder.SCHEMA&&Array.isArray(actualIndex.files)&&
      Array.isArray(actualIndex.records)&&Array.isArray(actualIndex.pending),'ACTUAL_INDEX');
    const identityRaw=copy(ID),identity=JSON.parse(identityRaw.toString());
    copy(MD);copy(SVG);
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
      const old=git(fixture,['cat-file','blob',compact.sourceGitBlobSha]);
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
      // Explicit holds are read only from these exact three compact files.
      for(const it of compact.items)if(it.registrationHold)for(const ref of Object.values(it.registrationHold)){
        if(ref&&typeof ref==='object'&&typeof ref.path==='string')copy(ref.path);
      }
    }
    need(states.length===75&&new Set(states.map(s=>s.questionUid)).size===75,'SOURCE75');
    const selected=new Set(CONFIG.selected.map(s=>s.questionUid)),allUids=new Set(states.map(s=>s.questionUid));
    for(const item of CONFIG.selected){
      const join=states.filter(s=>s.questionUid===item.questionUid);
      need(join.length===1&&join[0].sourceArchiveFile===item.sourceArchiveFile&&join[0].sourceOrdinal===item.sourceOrdinal,'SELECTED_JOIN');
    }
    const outside=states.filter(s=>!selected.has(s.questionUid));need(outside.length===68,'OUTSIDE68');
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
    report.actualBaseline={index:currentInputs.get(INDEX),sourceRows:75,selectedRegistered:0,selectedPending:7,
      outsideRegistered:actualOutside.filter(s=>s.record).length,outsidePending:actualOutside.filter(s=>!s.record).length,
      outsideWholeStateSha256:sha(stable(actualOutside)),selectedWholeStateSha256:sha(stable(actualSelected))};
    const byPath=new Map(CONFIG.files.map(f=>[f.path,f])),candidateBytes=new Map(),beforeBytes=new Map();
    for(const item of CONFIG.selected){
      const raw=copy(item.path);pin(raw,byPath.get(item.path),'SIDECAR');
      const doc=JSON.parse(raw.toString());need(doc.questionUid===item.questionUid&&doc.sourceOrdinal===item.sourceOrdinal&&
        doc.sourceArchiveFile===item.sourceArchiveFile&&doc.vectorSha256===item.vectorSha256&&
        doc.newMathQa===0&&doc.newSemanticApproval===0&&doc.newFourSlotVector===0,'SIDECAR_SCOPE');
      candidateBytes.set(item.path,raw);hydrateSidecar(doc);
      ensureCommit(CONFIG.previousCapture);
      const before=git(fixture,['show',CONFIG.previousCapture+':'+item.path]);
      need(blob(before)===item.beforeGitBlobSha1,'OLD_SIDECAR');
      beforeBytes.set(item.path,before);hydrateSidecar(JSON.parse(before.toString()));
    }
    const relevantFiles=actualIndex.files.filter(f=>CONFIG.groups.some(g=>g.compactRef.path===f.path));
    need(relevantFiles.length===3,'ACTUAL_FILES3');
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
    need(technical.checkoutCommit===CONFIG.previousCapture&&technical.items.length===7&&technical.results.length===14&&
      technical.servedFiles.length===99&&technical.mirroredAssets.length===22&&technical.studentFontResources.length===37,'CAPTURE_SCOPE');
    queueDoc(CONFIG.rawTechnicalRef);
    const refs=[...technical.servedFiles,...technical.mirroredAssets,...technical.studentFontResources,
      ...['manifestRef','checkerRef','captureHelperRef','surfaceHelperRef','scopedSurfaceHelperRef','fontLicenseRef'].map(k=>technical[k])];
    const data=new Set(CONFIG.generatedPaths);
    for(const ref of refs){const r={commit:ref.commit,path:ref.path,gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes};
      immutable(r);if(!data.has(r.path))live(r);}
    while(queue.length){
      const ref=queue.shift(),doc=JSON.parse(immutable(ref).toString());
      for(const nested of refsIn(doc)){immutable(nested);if(uiDocument(nested.path))queueDoc(nested);}
      need(queued.size<=96,'DOCUMENT_BOUND');
    }
    checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX&&!candidateBytes.has(x.path));
    const outsideSame=index=>{
      need(index.counts.files===3&&index.counts.items===75&&index.records.length+index.pending.length===75,'RESULT_DENOMINATOR');
      need(index.records.every(r=>allUids.has(r.questionUid))&&index.pending.every(r=>
        CONFIG.groups.some(g=>g.compactRef.path===r.path)&&Number.isSafeInteger(r.ordinal)),'RESULT_SCOPE');
      const now=outside.map(s=>stateOf(index,s));
      report.lastOutsideCheck={phase:report.phase,expectedSha256:sha(stable(actualOutside)),observedSha256:sha(stable(now)),
        changed:now.flatMap((row,i)=>stable(row)===stable(actualOutside[i])?[]:[{questionUid:row.questionUid,
          expectedWholeSha256:sha(stable(actualOutside[i])),observedWholeSha256:sha(stable(row)),
          expectedRegistered:!!actualOutside[i].record,observedRegistered:!!row.record,
          observedPending:row.pending.map(p=>safeReason(p.reason))}])};
      need(stable(now)===stable(actualOutside),'OUTSIDE68_CHANGED');
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
    phase(report,'OFFICIAL_EXISTING_AUTHORITY7');
    privateSidecars(candidateBytes);
    const after=builder.build(fixture,{previous:before.index,reuseCache:false});
    observedStable(after);outsideSame(after.index);
    report.after={counts:after.index.counts,selected:selectedSummary(after.index)};
    const rows=after.index.records.filter(r=>selected.has(r.questionUid));
    need(rows.length===7&&after.index.counts.registered===before.index.counts.registered+7&&
      after.index.counts.pending===before.index.counts.pending-7,'EXPECTED_SEVEN_RECOVERED');
    for(const item of CONFIG.selected){
      const row=rows.find(r=>r.questionUid===item.questionUid),pinInfo=byPath.get(item.path);
      need(row&&row.sourceBinding==='EXISTING_REGISTERED_VECTOR_CONTINUITY'&&row.registrationStatus==='REGISTERED'&&
        row.independentReviewClaim===false&&row.existingVectorContinuityRef?.path===item.path&&
        row.existingVectorContinuityRef?.sha256===pinInfo.sha256&&sha(stable(vector(row)))===item.vectorSha256,'EXISTING_AUTHORITY_BINDING');
    }
    const verified=builder.verify(after.index),api=consumer.createIndex(after.index);
    let queries=0;
    for(const row of rows){
      need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_GET');queries++;
      for(const slot of builder.SLOTS)for(const term of row[slot]){
        need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_HAS_TERM');queries++;
      }
    }
    report.existingNativeAuthority={verified:7,route:'official build -> existingVector.verify -> private validateNativeAuthority',
      coreGitBlobSha1:CONFIG.codePins.find(p=>p.path.endsWith('/existing-registered-vector-continuity.cjs')).gitBlobSha1,
      newFinalQaNativeApprovals:0,newSemanticApprovals:0,newFourSlotVectors:0,
      namedAuthorityDebtsPreserved:CONFIG.preservedNamedDebts};
    report.consumer={selected:7,queries,officialVerifyStatus:verified.status,officialScopeVerified:verified.verified,
      pendingPreserved:verified.pending,outsideWholeStateSha256:sha(stable(actualOutside))};
    phase(report,'COLD_CHECK');
    const privateIndex=file(fixture,INDEX);fs.chmodSync(privateIndex,0o644);
    fs.writeFileSync(privateIndex,JSON.stringify(after.index)+'\n');fs.chmodSync(privateIndex,0o444);
    const cold=builder.run(fixture,{check:true});
    need(cold.changed===false&&cold.revalidatedFiles===3&&cold.reusedFiles===0,'COLD_REPLAY');
    report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,
      counts:cold.counts,indexSha256:cold.indexSha256};
    phase(report,'SIDECAR_DELETION_REFUSAL');
    for(const rel of candidateBytes.keys())fs.unlinkSync(file(fixture,rel));
    const removed=builder.build(fixture,{previous:after.index,reuseCache:false});
    observedStable(removed);outsideSame(removed.index);
    need(removed.index.records.filter(r=>selected.has(r.questionUid)).length===0,'DELETED_CLAIM_REGISTERED');
    for(const s of states.filter(s=>selected.has(s.questionUid))){
      const row=stateOf(removed.index,s);
      need(row.pending.length===1&&row.pending[0].reason==='EXISTING_REGISTERED_VECTOR_CLAIM_MISSING_OR_MIXED','DELETE_REASON');
    }
    report.deleted={selectedRegistered:0,selectedRejected:7,counts:removed.index.counts,
      outsideWholeStateSha256:sha(stable(actualOutside))};
    for(const [rel,raw]of candidateBytes){fs.writeFileSync(path.join(fixture,rel),raw,{flag:'wx'});fs.chmodSync(path.join(fixture,rel),0o444);}
    for(const expected of checkpoint)pin(fs.readFileSync(file(fixture,expected.path)),expected,'PRIVATE_INPUT_UNCHANGED');
    for(const expected of currentInputs.values())pin(fs.readFileSync(file(root,expected.path)),expected,'ROOT_INPUT_UNCHANGED');
    need(git(root,['rev-parse','HEAD']).toString().trim()===rootHead&&
      git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus,'ROOT_MUTATION');
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD_CHANGED');
    report.inputProof={checkoutCurrent:[...currentInputs.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),
      immutable:[...immutableInputs.values()].sort((a,b)=>(a.commit+':'+a.path).localeCompare(b.commit+':'+b.path,'en')),
      currentFileCount:currentInputs.size,immutableRefCount:immutableInputs.size,
      privateNonDerivedFilesUnchanged:checkpoint.length,sharedWritableHardlinks:0,
      scope:'three immutable source banks; declared evidence only; no global outputDigests recursion'};
    report.phase='COMPLETE';report.status='PASS_PRIVATE_SCOPED_EXISTING_AUTHORITY';
    report.actualMainRegistration='NOT_PERFORMED';report.sourceApprovalMutation=0;
    writeReport();
    console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,selectedExistingAuthority:7,
      selectedConsumer:7,sourceQuestionCount:75,outsideWholeStatePreserved:68,coldChanged:false,deletionRejected:7,
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
    else throw Error('SVG7_SCOPE_UNKNOWN_ARGUMENT');
  }
  need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
