'use strict';
// Read-only transport for five explicit current-renderer capture profiles. This does not
// capture, crop, render, inspect mathematics, create approval or change raw proof.
// The original technical JSON and original problem PNG bytes are framed for
// lossless recovery from GitHub logs when artifact ZIP access is unavailable.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { once } = require('node:events');
const H = require('./check-reviewed-problem-renderer-browser.cjs');

const SELF = 'tools/emit-protected9-ui-log-transport.cjs';
const REVIEW_REF = 'refs/heads/ops/middle-protected9-current-renderer-26fc-20261117';
const CLOSED8_REF = 'refs/heads/ops/m2-closed8-current-renderer-26fc-20261117';
const FRAME_SCHEMA = 'archive-protected9-original-ui-log-transport-v1';
const PROOF = 'technical-proof.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const VIEWPORTS = Object.freeze([{name:'desktop',width:1365,height:1000},{name:'mobile',width:390,height:844}]);
const LIMITS = Object.freeze({proofBytes:2*1024*1024,pngBytes:2*1024*1024,bundleBytes:10*1024*1024,chunkCharacters:4096});
const PROFILES = Object.freeze({
  "closed8": {
    "schema": "archive-m2s2-closed-eight-current-ui-raw-v1",
    "checkerPath": "tools/check-m2s2-closed-eight-current-browser.cjs",
    "manifestPath": "tests/fixtures/archive-m2s2-closed-eight-current-ui.json",
    "cases": 16,
    "subjects": [
      {
        "key": "E017-Q04",
        "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
        "sourceOrdinal": 4,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q4-problem-visual-v4.svg",
        "assetGitBlobSha1": "8ceb67213019d19a316f585046f4dfb2a3866770",
        "assetSha256": "536b894d4b9c78180125ec685816040271a46e8c297e4b025ba5570efbafde7c",
        "assetBytes": 4426
      },
      {
        "key": "E017-Q05",
        "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
        "sourceOrdinal": 5,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q5-problem-visual-v4.svg",
        "assetGitBlobSha1": "28c9d60eee441984ce81ed941a477d661a556f3e",
        "assetSha256": "2c7fd8f8cbebe68fc21b52c3927382e609ae4238f5cd601ddfe6c58c9dd5a87e",
        "assetBytes": 17139
      },
      {
        "key": "E017-Q09",
        "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
        "sourceOrdinal": 9,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q9-problem-visual-v4.svg",
        "assetGitBlobSha1": "1c2b78a81b3e5a34be0ac1a7163bbfb19ca4b85e",
        "assetSha256": "b1378acc43d6a968bade6c4b4ab15a55cfd4738252fc044857093fffe1fdff20",
        "assetBytes": 4802
      },
      {
        "key": "E017-Q18",
        "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
        "sourceOrdinal": 18,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q18-problem-visual-v3.svg",
        "assetGitBlobSha1": "2cae8726c373f5c728f010860ae288e103982212",
        "assetSha256": "a301b3ff21f2f371ec0220600757e74b4473c5cad5f084494a233f16506ad37c",
        "assetBytes": 4257
      },
      {
        "key": "E017-Q20",
        "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
        "sourceOrdinal": 20,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q20-problem-visual-v3.svg",
        "assetGitBlobSha1": "c1c73664336bdbdd83136ea58773b1c23b189b90",
        "assetSha256": "a156e3687d04197ee3dff3dd65710e833908432b3c3d6440b854526b57145fe6",
        "assetBytes": 4437
      },
      {
        "key": "E017-Q23",
        "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
        "sourceOrdinal": 23,
        "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
        "sourceGitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
        "sourceSha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
        "sourceBytes": 66857,
        "assetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q23-problem-visual-v3.svg",
        "assetGitBlobSha1": "2f865edf92807075f5ab0bb7fa36009a8b28693c",
        "assetSha256": "82f2b31b9133062ce50c6332a7668a7ce228c4bb21f6ba512103e9ad5ce94f1d",
        "assetBytes": 3713
      },
      {
        "key": "E023-Q06",
        "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
        "sourceOrdinal": 6,
        "sourcePath": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
        "sourceGitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
        "sourceSha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
        "sourceBytes": 65146,
        "assetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q6-problem-visual-v4.svg",
        "assetGitBlobSha1": "c42e846519c266ef9f30389c03e71d6f33c81d72",
        "assetSha256": "a92041578869d2121a0524f79dec4cb77d1711a59b530bbc2f1ca4e2cb860482",
        "assetBytes": 4003
      },
      {
        "key": "E023-Q10",
        "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
        "sourceOrdinal": 10,
        "sourcePath": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
        "sourceGitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
        "sourceSha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
        "sourceBytes": 65146,
        "assetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q10-problem-visual-v4.svg",
        "assetGitBlobSha1": "56a4c294c7dcadb0271a9b13e4222afc2a764e8f",
        "assetSha256": "ad5ef51883df950f9b12f28083921b98b87547b382edc9326365a21fdf33a3f7",
        "assetBytes": 4979
      }
    ]
  },
  "svg7": {
    "schema": "archive-m2s1-svg7-problem-github-ui-raw-v1",
    "checkerPath": "tools/check-m2s1-svg7-problem-browser.cjs",
    "manifestPath": "tests/fixtures/archive-m2s1-svg7-problem-ui.json",
    "cases": 14,
    "subjects": [
      {
        "key": "E037-Q3",
        "questionUid": "qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6",
        "sourceOrdinal": 3
      },
      {
        "key": "E037-Q15",
        "questionUid": "qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5",
        "sourceOrdinal": 15
      },
      {
        "key": "E048-Q11",
        "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
        "sourceOrdinal": 11
      },
      {
        "key": "E048-Q13",
        "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
        "sourceOrdinal": 13
      },
      {
        "key": "E048-Q24",
        "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
        "sourceOrdinal": 24
      },
      {
        "key": "E045-Q24",
        "questionUid": "qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd",
        "sourceOrdinal": 24
      },
      {
        "key": "E045-Q15",
        "questionUid": "qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569",
        "sourceOrdinal": 15
      }
    ]
  },
  "q16": {
    "schema": "archive-m3s2-q16-layout-raw-ui-v2",
    "checkerPath": "tools/check-m3s2-q16-layout-browser.cjs",
    "manifestPath": "tests/fixtures/archive-m3s2-q16-layout-ui.json",
    "cases": 2,
    "subjects": [
      {
        "key": "E008-Q16",
        "questionUid": "qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf",
        "sourceOrdinal": 16,
        "sourcePath": "archive/exams/original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js"
      }
    ]
  },
  "q5": {
    "schema": "archive-m3-e052-q5-student-ui-preview-v1",
    "checkerPath": "tools/check-m3-e052-q5-problem-browser.cjs",
    "manifestPath": "tests/fixtures/archive-m3-e052-q5-problem-ui.json",
    "cases": 2,
    "subjects": [
      {
        "key": "E052-Q5",
        "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
        "sourceOrdinal": 5,
        "sourcePath": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
        "assetPath": "archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png"
      }
    ]
  },
  "m1": {
    "schema": "archive-m1s2-problem-seven-github-ui-raw-v1",
    "checkerPath": "tools/check-m1s2-problem-seven-browser.cjs",
    "manifestPath": "tests/fixtures/archive-m1s2-problem-seven-ui.json",
    "cases": 14,
    "subjects": [
      {
        "key": "P04",
        "questionUid": "qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140",
        "sourceOrdinal": 13,
        "sourcePath": "archive/exams/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
        "assetPath": "archive/assets/images/24_향림중_2학기_기말_중1_기출/q13-problem-geometry-20261116.svg"
      },
      {
        "key": "P08",
        "questionUid": "qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15",
        "sourceOrdinal": 17,
        "sourcePath": "archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
        "assetPath": "archive/assets/images/25_팔마중_2학기_기말_중1_기출/q17-problem-geometry-20261116.svg"
      },
      {
        "key": "P10",
        "questionUid": "qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e",
        "sourceOrdinal": 18,
        "sourcePath": "archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
        "assetPath": "archive/assets/images/25_풍덕중_2학기_기말_중1_기출/q18-problem-geometry-20261116.svg"
      },
      {
        "key": "P11",
        "questionUid": "qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3",
        "sourceOrdinal": 19,
        "sourcePath": "archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
        "assetPath": "archive/assets/images/25_풍덕중_2학기_기말_중1_기출/q19-problem-geometry-20261116.svg"
      },
      {
        "key": "P12",
        "questionUid": "qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6",
        "sourceOrdinal": 6,
        "sourcePath": "archive/exams/original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
        "assetPath": "archive/assets/images/23_향림중_2학기_중간_중1_기출/q06-problem-geometry-20261116.svg"
      },
      {
        "key": "P13",
        "questionUid": "qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",
        "sourceOrdinal": 6,
        "sourcePath": "archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
        "assetPath": "archive/assets/images/26_팔마중_2학기_중간_중1_기출/q06-problem-geometry-20261116.svg"
      },
      {
        "key": "P14",
        "questionUid": "qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",
        "sourceOrdinal": 8,
        "sourcePath": "archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
        "assetPath": "archive/assets/images/26_팔마중_2학기_중간_중1_기출/q08-problem-geometry-20261116.svg"
      }
    ]
  }
});
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const stable = value => JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])) : v);
const fail = code => { throw Error('UI_LOG_'+code); };
function requireThat(value,code){if(!value)fail(code);}
function regularDirectory(directory){
 requireThat(path.isAbsolute(directory),'ABSOLUTE_DIRECTORY');
 const absolute=path.resolve(directory), parsed=path.parse(absolute);let current=parsed.root;
 for(const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)){
  current=path.join(current,part);const stat=fs.lstatSync(current);
  requireThat(!stat.isSymbolicLink()&&stat.isDirectory(),'DIRECTORY_SYMLINK_OR_TYPE');
 }
 return absolute;
}
function regularFile(directory,name,maxBytes){
 requireThat(typeof name==='string'&&name.length>0&&!path.isAbsolute(name)&&!/[\\\x00-\x1f]/.test(name)&&
  name.split('/').every(p=>p&&p!=='.'&&p!=='..'),'UNSAFE_PATH');
 const root=regularDirectory(directory);let current=root;const parts=name.split('/');
 for(let i=0;i<parts.length;i++){
  current=path.join(current,parts[i]);const stat=fs.lstatSync(current);
  requireThat(!stat.isSymbolicLink()&&(i===parts.length-1?stat.isFile():stat.isDirectory()),'FILE_SYMLINK_OR_TYPE');
  if(i===parts.length-1)requireThat(stat.size>0&&stat.size<=maxBytes,'FILE_SIZE_LIMIT');
 }
 requireThat(current.startsWith(root+path.sep),'PATH_ESCAPE');
 const bytes=fs.readFileSync(current);
 requireThat(bytes.length>0&&bytes.length<=maxBytes,'FILE_SIZE_LIMIT');return bytes;
}
function executionContext(expectedCommit,env=process.env,event){
 requireThat(env.GITHUB_ACTIONS==='true'&&env.GITHUB_REPOSITORY==='icefoxtail/AP------','ACTIONS_REPOSITORY');
 requireThat(SHA1.test(expectedCommit||'')&&SHA1.test(env.GITHUB_SHA||''),'EXPECTED_SHA');
 requireThat(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||''),'RUN_ID');
 requireThat(typeof env.GITHUB_WORKFLOW==='string'&&env.GITHUB_WORKFLOW.length>0&&env.GITHUB_WORKFLOW.length<200&&
  /^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'WORKFLOW_JOB');
 const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
 let ref=null,pullRequest=null,baseSha=null;
 if(env.GITHUB_EVENT_NAME==='push'){
  requireThat(env.GITHUB_REF===REVIEW_REF&&payload.ref===REVIEW_REF&&payload.deleted===false,'EXACT_REVIEW_PUSH');
  requireThat(env.GITHUB_SHA===expectedCommit&&payload.after===expectedCommit,'PUSH_AFTER_SHA');
  requireThat(payload.repository?.full_name===env.GITHUB_REPOSITORY&&payload.repository?.fork===false,'PUSH_REPOSITORY');
  ref=REVIEW_REF;
 }else{
  requireThat(env.GITHUB_EVENT_NAME==='pull_request','EVENT');
  const pr=payload.pull_request;
  requireThat(pr&&pr.head?.repo?.full_name===env.GITHUB_REPOSITORY&&pr.base?.repo?.full_name===env.GITHUB_REPOSITORY&&
   pr.head?.repo?.fork===false&&pr.head.sha===expectedCommit&&SHA1.test(pr.base.sha||''),'EXACT_PR_HEAD');
  requireThat(Number.isSafeInteger(payload.number)&&payload.number>0,'PR_NUMBER');
  pullRequest=payload.number;baseSha=pr.base.sha;
 }
 return{provider:'GITHUB_ACTIONS',repository:env.GITHUB_REPOSITORY,eventName:env.GITHUB_EVENT_NAME,ref,
  pullRequest,baseSha,checkoutCommit:expectedCommit,eventCommit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,
  runAttempt:Number(env.GITHUB_RUN_ATTEMPT),workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB};
}
function closed8ExecutionContext(expectedCommit,env=process.env,event){
 requireThat(env.GITHUB_ACTIONS==='true'&&env.GITHUB_REPOSITORY==='icefoxtail/AP------','CLOSED8_ACTIONS_REPOSITORY');
 requireThat(SHA1.test(expectedCommit||'')&&env.GITHUB_SHA===expectedCommit,'CLOSED8_EXPECTED_SHA');
 requireThat(env.GITHUB_EVENT_NAME==='push'&&env.GITHUB_REF===CLOSED8_REF,'CLOSED8_EXACT_PUSH');
 requireThat(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||'')&&
  Number.isSafeInteger(Number(env.GITHUB_RUN_ATTEMPT)),'CLOSED8_RUN_ID');
 requireThat(typeof env.GITHUB_WORKFLOW==='string'&&env.GITHUB_WORKFLOW.length>0&&env.GITHUB_WORKFLOW.length<200&&
  /^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'CLOSED8_WORKFLOW_JOB');
 const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
 requireThat(payload?.ref===CLOSED8_REF&&payload.after===expectedCommit&&payload.deleted===false,'CLOSED8_PUSH_PAYLOAD');
 requireThat(payload.repository?.full_name===env.GITHUB_REPOSITORY&&payload.repository?.fork===false,'CLOSED8_PUSH_REPOSITORY');
 return{provider:'GITHUB_ACTIONS',repository:env.GITHUB_REPOSITORY,eventName:'push',ref:CLOSED8_REF,
  pullRequest:null,baseSha:null,checkoutCommit:expectedCommit,eventCommit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,
  runAttempt:Number(env.GITHUB_RUN_ATTEMPT),workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB};
}
function assertExecution(proof,profile,context){
 requireThat(proof.checkoutCommit===context.checkoutCommit,'PROOF_HEAD');
 if(profile==='closed8'){
  const p=proof.execution;
  requireThat(context.provider==='GITHUB_ACTIONS'&&context.repository==='icefoxtail/AP------'&&
   context.eventName==='push'&&context.ref===CLOSED8_REF&&context.eventCommit===context.checkoutCommit&&
   context.pullRequest===null&&context.baseSha===null,'CLOSED8_CONTEXT');
  requireThat(proof.executionOwner==='GITHUB_ACTIONS_CHROMIUM_CLOSED_M2S2_EIGHT_PUSH_HEAD'&&p&&
   p.provider===context.provider&&p.repository===context.repository&&p.eventName==='push'&&p.ref===CLOSED8_REF&&
   p.headSha===context.checkoutCommit&&p.capturedHead===context.checkoutCommit&&p.eventSha===context.eventCommit&&
   p.runId===context.runId&&p.runAttempt===context.runAttempt&&p.workflow===context.workflow&&p.job===context.job&&
   p.pullRequest===null&&p.baseSha===null,'CLOSED8_EXECUTION');
  requireThat(stable(proof.checkout)===stable({expectedCheckoutCommit:context.checkoutCommit,
   actualCheckoutCommit:context.checkoutCommit,githubEventCommit:context.eventCommit}),'CLOSED8_CHECKOUT');
  return;
 }
 if(profile==='svg7'){
 const p=proof.execution;
 requireThat(p&&p.provider===context.provider&&p.repository===context.repository&&p.eventName===context.eventName&&
  p.headSha===context.checkoutCommit&&p.eventSha===context.eventCommit&&p.runId===context.runId&&
  p.runAttempt===context.runAttempt&&p.job===context.job&&p.workflow===context.workflow,'SVG7_EXECUTION');
 requireThat(context.eventName==='push'?p.ref===REVIEW_REF:p.pullRequest===context.pullRequest&&p.baseSha===context.baseSha,'SVG7_EVENT_BINDING');
 requireThat(proof.executionOwner===(context.eventName==='push'?'GITHUB_ACTIONS_CHROMIUM_EXACT_REVIEW_PUSH':
  'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD'),'SVG7_EXECUTION_OWNER');
  return;
 }
 // The additional profiles are only transported from this closed ops push.
 // In particular Q5's original raw schema has no run/job fields: those actual
 // identities belong in the external transport receipt, never in edited JSON.
 requireThat(['m1','q16','q5'].includes(profile)&&context.eventName==='push'&&
  context.ref===REVIEW_REF&&context.eventCommit===context.checkoutCommit,'CLOSED_OPS_PROFILE');
 if(profile==='m1'){
  const p=proof.execution;
  requireThat(proof.executionOwner==='GITHUB_ACTIONS_CHROMIUM_CLOSED_OPS_PUSH_HEAD'&&p&&
   p.provider===context.provider&&p.repository===context.repository&&p.eventName==='push'&&p.ref===REVIEW_REF&&
   p.headSha===context.checkoutCommit&&p.capturedHead===context.checkoutCommit&&p.eventSha===context.eventCommit&&
   p.runId===context.runId&&p.runAttempt===context.runAttempt&&p.job===context.job&&p.workflow===context.workflow&&
   p.pullRequest===null&&p.baseSha===null,'M1_EXECUTION');
 }else if(profile==='q16'){
  const p=proof.executionProvenance?.checkout;
  requireThat(proof.executionOwner==='GITHUB_ACTIONS_SUPPORTED_CHROME'&&
   proof.executionProvenance?.executionOwner==='GITHUB_ACTIONS_SUPPORTED_CHROME'&&p&&
   p.executionOwner==='GITHUB_ACTIONS_SUPPORTED_CHROME'&&p.expectedCheckoutCommit===context.checkoutCommit&&
   p.actualCheckoutCommit===context.checkoutCommit&&p.githubEventCommit===context.eventCommit&&
   p.repository===context.repository&&p.runId===context.runId&&p.runAttempt===String(context.runAttempt)&&
   p.job===context.job&&p.eventName==='push'&&p.headCommit===context.checkoutCommit,'Q16_EXECUTION');
 }else{
  const p=proof.checkout;
  requireThat(proof.executionOwner==='GITHUB_ACTIONS_SUPPORTED_CHROME'&&p&&
   p.expectedCheckoutCommit===context.checkoutCommit&&p.actualCheckoutCommit===context.checkoutCommit&&
   p.githubEventCommit===context.eventCommit,'Q5_EXECUTION');
 }
}
function validShot(shot,profile){
 const pattern=new RegExp('^('+PROFILES[profile].subjects.map(s=>s.key).join('|')+')-(desktop|mobile)-tile-(0[1-8])\\.png$');
 requireThat(shot&&pattern.test(shot.path)&&SHA256.test(shot.sha256||'')&&
  Number.isSafeInteger(shot.bytes)&&shot.bytes>0&&shot.bytes<=LIMITS.pngBytes,'SHOT_REF');
 return pattern.exec(shot.path);
}
function validateProof(proof,profile,context){
 const spec=PROFILES[profile];requireThat(spec&&proof&&proof.schemaVersion===spec.schema,'PROFILE_SCHEMA');
 assertExecution(proof,profile,context);
 if(profile==='closed8')requireThat(proof.surface===undefined&&proof.newParentApprovals===0&&
  proof.newNativeApprovals===0&&proof.releaseGate==='PENDING_INDEPENDENT_VISUAL_REVIEW','CLOSED8_NO_APPROVAL');
 requireThat(['TECHNICAL_PASS_VISUAL_REVIEW_PENDING','FAIL'].includes(proof.status),'PROOF_STATUS');
 requireThat(proof.problemOnlyScreenshots===true&&proof.solutionsOpened===false&&
  proof.sourceOverlay===false&&proof.sourceWrites===0&&proof.mode==='exam'&&proof.newFullMathematicalQa===false&&
  proof.newMetadataApprovals===0&&proof.newDifficultyJudgments===0&&proof.newReviewPassCount===0&&proof.newFourSlotApprovals===0,'PROBLEM_ONLY');
 if(profile!=='svg7'){
  requireThat(proof.screenshotsScope==='SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY','ORIGINAL_PROBLEM_TILES');
  if(profile==='q16')requireThat(proof.surface==='PROBLEM','Q16_SURFACE');
  if(profile==='q5')requireThat(proof.surface===undefined&&proof.newParentApprovals===0&&
   proof.newNativeApprovals===0&&proof.releaseGate==='PENDING_INDEPENDENT_VISUAL_REVIEW','Q5_NO_APPROVAL');
 }
 requireThat(proof.expectedLogicalCases===spec.cases&&Array.isArray(proof.results)&&
  proof.completedLogicalCases===proof.results.length&&proof.results.length<=spec.cases,'CASE_COUNT');
 requireThat(Array.isArray(proof.screenshotArtifacts)&&proof.screenshotArtifactCount===proof.screenshotArtifacts.length&&
  proof.screenshotArtifacts.length<=spec.cases*8,'ARTIFACT_COUNT');
 requireThat(Array.isArray(proof.items)&&proof.items.length===spec.subjects.length,'SELECTED_ITEMS');
 const subjects=new Map(spec.subjects.map(s=>[s.questionUid,s])),itemSeen=new Set(),caseSeen=new Set();
 for(const item of proof.items){
  const fixed=subjects.get(item.questionUid);
  requireThat(fixed&&item.key===fixed.key&&item.sourceOrdinal===fixed.sourceOrdinal&&!itemSeen.has(item.questionUid),'ITEM_SCOPE');
  if(profile!=='svg7'){
   requireThat(item.sourceRef?.path===fixed.sourcePath&&item.sourceRef.commit===context.checkoutCommit,'ITEM_SOURCE');
   if(profile==='q16')requireThat(Array.isArray(item.assetRefs)&&item.assetRefs.length===0,'Q16_NO_FILE_ASSETS');
   else requireThat(item.assetRef?.path===fixed.assetPath&&item.assetRef.commit===context.checkoutCommit,'ITEM_ASSET');
  }
  if(profile==='closed8')requireThat(item.sourceRef.gitBlobSha1===fixed.sourceGitBlobSha1&&
   item.sourceRef.sha256===fixed.sourceSha256&&item.sourceRef.bytes===fixed.sourceBytes&&
   item.assetRef.gitBlobSha1===fixed.assetGitBlobSha1&&item.assetRef.sha256===fixed.assetSha256&&
   item.assetRef.bytes===fixed.assetBytes,'CLOSED8_IMMUTABLE_INPUT_PINS');
  itemSeen.add(item.questionUid);
 }
 const completedShots=[];
 for(const row of proof.results){
  const fixed=subjects.get(row.questionUid),viewport=VIEWPORTS.find(v=>v.name===row.viewport?.name);
  requireThat(fixed&&row.key===fixed.key&&row.sourceOrdinal===fixed.sourceOrdinal&&viewport&&
   stable(row.viewport)===stable(viewport)&&row.status==='PASS','RESULT_SCOPE');
  if(profile==='svg7'||profile==='m1')requireThat(row.surface==='PROBLEM'&&row.mode==='exam','RESULT_SCOPE');
  else requireThat(row.surface===undefined&&row.mode===undefined,'RESULT_SCOPE');
  if(profile!=='svg7'){
   const item=proof.items.find(item=>item.questionUid===row.questionUid);
   requireThat(stable(row.sourceRef)===stable(item.sourceRef),'RESULT_SOURCE');
   if(profile==='q16')requireThat(Array.isArray(row.assetRefs)&&row.assetRefs.length===0,'Q16_NO_FILE_ASSETS');
   else{
    requireThat(stable(row.assetRef)===stable(item.assetRef),'RESULT_ASSET');
    if(profile==='m1')requireThat(stable(row.assetRefs)===stable([item.assetRef]),'RESULT_ASSET');
   }
  }
  const key=row.key+':'+viewport.name;requireThat(!caseSeen.has(key),'DUPLICATE_CASE');caseSeen.add(key);
  requireThat(row.technical?.solutionNodes===0&&row.technical.mode==='exam'&&
   row.pageErrors?.length===0&&row.requestFailures?.length===0&&row.externalRequests?.length===0,'RESULT_PROBLEM_ONLY');
  requireThat(Array.isArray(row.screenshots),'RESULT_SCREENSHOTS');
  completedShots.push(...row.screenshots.map(shot=>{validShot(shot,profile);return{path:shot.path,sha256:shot.sha256,bytes:shot.bytes};}));
 }
 const artifacts=proof.screenshotArtifacts,seen=new Set();
 for(const shot of artifacts){validShot(shot,profile);requireThat(!seen.has(shot.path),'DUPLICATE_ARTIFACT');seen.add(shot.path);}
 const completedPaths=new Set(completedShots.map(s=>s.path));
 H.assertScreenshotInventory(proof.results,artifacts.filter(s=>completedPaths.has(s.path)));
 if(proof.status==='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'){
  requireThat(caseSeen.size===spec.cases&&proof.failures?.length===0&&artifacts.length===completedShots.length,'COMPLETE_CAPTURE');
  for(const item of spec.subjects)for(const viewport of VIEWPORTS)requireThat(caseSeen.has(item.key+':'+viewport.name),'MISSING_CASE');
 }else{
  requireThat(/^UI_[A-Z0-9_]+$/.test(proof.failureCode||''),'FAILURE_ENUM');
 }
 return{spec,completedPaths,complete:proof.status==='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'};
}
function pngDimensions(bytes,viewport){
 const signature=Buffer.from([137,80,78,71,13,10,26,10]);
 requireThat(bytes.length>=45&&bytes.subarray(0,8).equals(signature)&&bytes.readUInt32BE(8)===13&&
  bytes.subarray(12,16).toString('ascii')==='IHDR','PNG_HEADER');
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 requireThat(width>0&&height>0&&width<=viewport.width&&height<=viewport.height,'PNG_VIEWPORT');
 let cursor=8,ended=false,idat=false;
 while(cursor+12<=bytes.length){
  const size=bytes.readUInt32BE(cursor),end=cursor+12+size;
  requireThat(end<=bytes.length,'PNG_CHUNK_LENGTH');
  const type=bytes.subarray(cursor+4,cursor+8).toString('ascii');
  if(type==='IDAT')idat=true;
  if(type==='IEND'){requireThat(size===0&&end===bytes.length,'PNG_TRAILING_BYTES');ended=true;cursor=end;break;}
  cursor=end;
 }
 requireThat(ended&&idat&&cursor===bytes.length,'PNG_COMPLETE');
 return{width,height};
}
function collectBundle({out,profile,context}){
 regularDirectory(out);
 const raw=regularFile(out,PROOF,LIMITS.proofBytes),proof=JSON.parse(raw.toString('utf8'));
 const checked=validateProof(proof,profile,context),artifacts=proof.screenshotArtifacts.slice().sort((a,b)=>a.path.localeCompare(b.path));
 const expected=[PROOF,...artifacts.map(a=>a.path)].sort();
 assert.deepEqual(fs.readdirSync(out).sort(),expected,'UI_LOG_UNDECLARED_OUTPUT_FILE');
 const files=[{path:PROOF,mimeType:'application/json',bytes:raw.length,sha256:sha(raw),gitBlobSha1:gitBlob(raw),data:raw,
  captureCaseCompleted:null}];
 let total=raw.length;
 for(const artifact of artifacts){
  const bytes=regularFile(out,artifact.path,LIMITS.pngBytes);
  requireThat(bytes.length===artifact.bytes&&sha(bytes)===artifact.sha256,'PNG_BYTES_MISMATCH');
  const match=validShot(artifact,profile),viewport=VIEWPORTS.find(v=>v.name===match[2]);
  const dimensions=pngDimensions(bytes,viewport);
  total+=bytes.length;requireThat(total<=LIMITS.bundleBytes,'BUNDLE_LIMIT');
  files.push({...artifact,mimeType:'image/png',gitBlobSha1:gitBlob(bytes),dimensions,data:bytes,
    captureCaseCompleted:checked.completedPaths.has(artifact.path)});
 }
 const inventory=files.map(({data,...row})=>row);
 return{profile,context,proof,files,manifest:{schemaVersion:FRAME_SCHEMA,profile,execution:context,
  captureStatus:proof.status,logicalCases:proof.completedLogicalCases,expectedLogicalCases:checked.spec.cases,
  pngFiles:artifacts.length,uncompletedCasePngFiles:files.filter(f=>f.mimeType==='image/png'&&!f.captureCaseCompleted).length,
  totalBytes:total,technicalJsonSha256:sha(raw),files:inventory,
  visualReview:'NOT_PERFORMED_BY_TRANSPORT',newApprovals:0,sourceWrites:0,
  transportDigest:sha(stable(inventory))}};
}
function checkedRef(root,relative,commit){
 regularDirectory(root);
 const entry=execFileSync('git',['--literal-pathspecs','ls-tree','-z',commit,'--',relative],
  {cwd:root,encoding:'utf8',timeout:30000,maxBuffer:4096,stdio:['ignore','pipe','pipe']});
 const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
 requireThat(match&&match[3]===relative,'CURRENT_REGULAR_GIT_REF');
 const bytes=regularFile(root,relative,4*1024*1024);
 requireThat(gitBlob(bytes)===match[2],'CURRENT_CHECKOUT_DRIFT');
 return{commit,path:relative,gitBlobSha1:match[2],sha256:sha(bytes),bytes:bytes.length};
}
function assertProducerRefs(root,bundle){
 const commit=bundle.context.checkoutCommit;
 const current=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']}).trim();
 requireThat(current===commit,'CURRENT_HEAD');
 const spec=PROFILES[bundle.profile],required=[spec.checkerPath,spec.manifestPath,'tools/check-reviewed-problem-renderer-browser.cjs'];
 const declared=new Map(required.map(file=>[file,[]]));
 const walk=value=>{
  if(!value||typeof value!=='object')return;
  if(!Array.isArray(value)&&declared.has(value.path))declared.get(value.path).push(value);
  for(const child of Object.values(value))walk(child);
 };
 walk(bundle.proof);
 for(const relative of required){
  const actual=checkedRef(root,relative,commit),refs=declared.get(relative);
  requireThat(refs.length>0,'PRODUCER_REF_MISSING');
  for(const ref of refs)assert.deepEqual(ref,actual,'UI_LOG_PRODUCER_REF_DRIFT');
 }
 bundle.manifest.transportRef=checkedRef(root,SELF,commit);
 bundle.manifest.producerRefs=required.map(relative=>checkedRef(root,relative,commit));
 return bundle;
}
function* frames(bundle){
 const id=sha(stable(bundle.manifest));
 yield JSON.stringify({schemaVersion:FRAME_SCHEMA,kind:'bundle-begin',bundle:id,manifest:bundle.manifest});
 for(let fileIndex=0;fileIndex<bundle.files.length;fileIndex++){
  const {data,...file}=bundle.files[fileIndex],encoded=data.toString('base64'),chunks=Math.ceil(encoded.length/LIMITS.chunkCharacters);
  yield JSON.stringify({schemaVersion:FRAME_SCHEMA,kind:'file-begin',bundle:id,fileIndex,file,chunks,base64Characters:encoded.length});
  for(let chunkIndex=0;chunkIndex<chunks;chunkIndex++)
   yield JSON.stringify({schemaVersion:FRAME_SCHEMA,kind:'file-chunk',bundle:id,fileIndex,chunkIndex,chunks,
    base64:encoded.slice(chunkIndex*LIMITS.chunkCharacters,(chunkIndex+1)*LIMITS.chunkCharacters)});
  yield JSON.stringify({schemaVersion:FRAME_SCHEMA,kind:'file-end',bundle:id,fileIndex,sha256:file.sha256});
 }
 yield JSON.stringify({schemaVersion:FRAME_SCHEMA,kind:'bundle-end',bundle:id,files:bundle.files.length,
  captureStatus:bundle.proof.status,visualReview:'PENDING',newApprovals:0});
}
async function main(){
 const a=process.argv.slice(2);
 requireThat(a.length===8&&a[0]==='--root'&&a[2]==='--output'&&a[4]==='--profile'&&a[6]==='--expected-head','ARGUMENTS');
 const root=regularDirectory(path.resolve(a[1])),out=regularDirectory(path.resolve(a[3]));
 requireThat(out!==root&&!out.startsWith(root+path.sep),'OUTPUT_OUTSIDE_CHECKOUT');
 const context=a[5]==='closed8'?closed8ExecutionContext(a[7]):executionContext(a[7]),
  bundle=assertProducerRefs(root,collectBundle({out,profile:a[5],context}));
 for(const line of frames(bundle))if(!process.stdout.write(line+'\n'))await once(process.stdout,'drain');
}
module.exports={PROFILES,VIEWPORTS,LIMITS,REVIEW_REF,CLOSED8_REF,FRAME_SCHEMA,executionContext,closed8ExecutionContext,validateProof,pngDimensions,collectBundle,assertProducerRefs,frames};
if(require.main===module)main().catch(error=>{
 process.stderr.write(JSON.stringify({schemaVersion:FRAME_SCHEMA,status:'TRANSPORT_REFUSED',
  errorCode:/^UI_LOG_[A-Z0-9_]+$/.test(error.message)?error.message:'UI_LOG_CONTRACT_REFUSED',
  errorMessageSha256:sha(String(error.message||'')),newApprovals:0})+'\n');process.exitCode=1;
});
