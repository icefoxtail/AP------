#!/usr/bin/env node
'use strict';
// Read-only single-bank experiment. Reuse reviewed vectors and canonical identity;
// change only one whole-source reconciliation pin in an isolated private copy.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-m2s2-e012-current-source-partial-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m2s2-e012-source-binding-26fc-20261117",
  "baselineSnapshot": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
  "sourceArchiveFile": "original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.js",
  "source": {
    "path": "archive/exams/original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.js",
    "bytes": 102886,
    "sha256": "ea7d66ca1fc7d8cb60a36642d5376950ea985768948a92e830eca5c7eb2dcf0b",
    "gitBlobSha1": "3df2e3fc31c0c705f04c8d68bf984e3dc9e70781"
  },
  "previousSource": {
    "bytes": 100592,
    "sha256": "b3ffe557712a1df740e79af2ecb123f623312ac15b955aa5cdbc10aedec48c37",
    "gitBlobSha1": "8977d242917ad9dbdc18319a46ac4a8df5dd2485"
  },
  "originalSource": {
    "bytes": 97606,
    "sha256": "a6d23bd4c8b7b49d5fbb53e9980b346ad2ca5078bfbb13f8ba458788285a1932",
    "gitBlobSha1": "7e52d7f9ea8911f3a9c9fffdd000f653ec16a272"
  },
  "compactBefore": {
    "path": "archive/data/item-4slot/original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.4slot.json",
    "bytes": 11313,
    "sha256": "78ef34999de0ff36f8c5927771eaddeb31551f9b874e7b2e961729e5b176788d",
    "gitBlobSha1": "1f5c527e0c4c4dd63933bae3b420203ad878c552"
  },
  "compactAfter": {
    "path": "archive/data/item-4slot/original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.4slot.json",
    "bytes": 11313,
    "sha256": "2634e18108133e6593e5f9f2998954fe91ddd563afab4d25c3c73ce0351946b9",
    "gitBlobSha1": "1b7a0b8c8f6330313e5bef5a0630aed616969896"
  },
  "dictionary": {
    "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
    "bytes": 311356,
    "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
    "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0"
  },
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
      "path": "tools/4slot/exam-items.cjs",
      "bytes": 2234,
      "sha256": "60e348829239772dfb916763835d2e21659ecd8eb2ba96e2621867352a935cf2",
      "gitBlobSha1": "debef5587df86821c04e543afb72a72b2e0fc1e4"
    }
  ],
  "unchangedOrdinals": [
    1,
    2,
    3,
    4,
    8,
    11,
    12,
    13,
    14,
    16,
    17,
    22,
    23
  ],
  "heldOrdinals": [
    5,
    6,
    7,
    9,
    10,
    15,
    18,
    19,
    20,
    21,
    24
  ],
  "identities": [
    {
      "questionUid": "qid_v1_b38de340bf295c8eb238d3fc5dd06a05af6cbbe42dc123b6618286cf586f49dc",
      "sourceOrdinal": 1,
      "sourceQuestionNo": "1"
    },
    {
      "questionUid": "qid_v1_1ca8363b5eb0d02e6f8694a264b468030e7bc4d70cb1449dce372cedf3476d6e",
      "sourceOrdinal": 2,
      "sourceQuestionNo": "2"
    },
    {
      "questionUid": "qid_v1_9ff4b8cec7a1639ecefb815b726397f553fa66ce48a9ed9504c36958928e1c12",
      "sourceOrdinal": 3,
      "sourceQuestionNo": "3"
    },
    {
      "questionUid": "qid_v1_4e68672dcb92a68a3fb34f23cf6b8ea3d2c43ed68a19296b279c789ad9e225d1",
      "sourceOrdinal": 4,
      "sourceQuestionNo": "4"
    },
    {
      "questionUid": "qid_v1_4b86fcb2ea657206cd5162c3dbe3bf4bf9ec7d02c8b321fc7864e734620b85f7",
      "sourceOrdinal": 5,
      "sourceQuestionNo": "5"
    },
    {
      "questionUid": "qid_v1_efae76eefe6df7fd8260cd401db76766687ee95d23fdda672d2230037261fea0",
      "sourceOrdinal": 6,
      "sourceQuestionNo": "6"
    },
    {
      "questionUid": "qid_v1_5561ae659f7f94bb5d025f3ecdecd12ce9532e5fc91d09f72ed8ea0371377665",
      "sourceOrdinal": 7,
      "sourceQuestionNo": "7"
    },
    {
      "questionUid": "qid_v1_da0d30a08fa2f38ed83892549368309df54940e32325b2a01f384b0ad4ae1896",
      "sourceOrdinal": 8,
      "sourceQuestionNo": "8"
    },
    {
      "questionUid": "qid_v1_34218dbd3a6d288a627a722970d234d74da617bd15e1243505867accf2557ffc",
      "sourceOrdinal": 9,
      "sourceQuestionNo": "9"
    },
    {
      "questionUid": "qid_v1_7258c77edcb88d5f06bc5179259987008c1f460a48c9440ed7c3862804703e96",
      "sourceOrdinal": 10,
      "sourceQuestionNo": "10"
    },
    {
      "questionUid": "qid_v1_234c402065e06824cd9f409c51daa7fe56997f3c3e010b620c11cb193fdc836a",
      "sourceOrdinal": 11,
      "sourceQuestionNo": "11"
    },
    {
      "questionUid": "qid_v1_9604a02407d9b78b6ab91edf7313e0869ec07ec6e77bc1e3106fbcf26cd1d607",
      "sourceOrdinal": 12,
      "sourceQuestionNo": "12"
    },
    {
      "questionUid": "qid_v1_0d5497cc5fa40b0ba2cc34debe73c5d2d9d5eb7979013c8db64e88360258aa8b",
      "sourceOrdinal": 13,
      "sourceQuestionNo": "13"
    },
    {
      "questionUid": "qid_v1_a44f856b62fd0b7737271d4dd4dec8dfe20af5cfecc61ddc41a1a4a86bcb3b64",
      "sourceOrdinal": 14,
      "sourceQuestionNo": "14"
    },
    {
      "questionUid": "qid_v1_fbae14e2287971182c1de9f55a230c9231bad8abf6c81c4982951639503f2fa7",
      "sourceOrdinal": 15,
      "sourceQuestionNo": "15"
    },
    {
      "questionUid": "qid_v1_db16a9ff05f86bb39ed909465d15d45b25d40ccccde8484d1616a0529109aebd",
      "sourceOrdinal": 16,
      "sourceQuestionNo": "16"
    },
    {
      "questionUid": "qid_v1_5172d1fd4e4e4c00b808d7c7bb41bfbe17b1c0634ebf9c0a5c8dd081b49f53fc",
      "sourceOrdinal": 17,
      "sourceQuestionNo": "17"
    },
    {
      "questionUid": "qid_v1_f9c6c4d38adbff18cc78bc8ecc3a0d616ff2457d540e0b93f37cec6ca7cb4d84",
      "sourceOrdinal": 18,
      "sourceQuestionNo": "18"
    },
    {
      "questionUid": "qid_v1_6b70295abd9e6160a7d5a1550397f110801d5d15c4d2ac9e2b4ef0823c54e7ef",
      "sourceOrdinal": 19,
      "sourceQuestionNo": "19"
    },
    {
      "questionUid": "qid_v1_2dd5708e48fefa735a18a84b1ecdcd2a7c869f6acc170e5258ab86b1d2d833ae",
      "sourceOrdinal": 20,
      "sourceQuestionNo": "20"
    },
    {
      "questionUid": "qid_v1_d595612572bd7a4b4b169a8274bdf03a9db8cdda4d9a3111d9be7122ce92fbd9",
      "sourceOrdinal": 21,
      "sourceQuestionNo": "21"
    },
    {
      "questionUid": "qid_v1_1b584c2038b7d9bc7a98f185a40bd3acde3d642b3e60e33f9aa0a59b26007aa8",
      "sourceOrdinal": 22,
      "sourceQuestionNo": "22"
    },
    {
      "questionUid": "qid_v1_865bade51128577fd4430ab3fa1c94d90e699447dbcb58f02addfc65b4b8e030",
      "sourceOrdinal": 23,
      "sourceQuestionNo": "23"
    },
    {
      "questionUid": "qid_v1_43511cb6bf22835ebaa4d99715ea17098eeffefa3429cc84ad824b6de2ce2b18",
      "sourceOrdinal": 24,
      "sourceQuestionNo": "24"
    }
  ],
  "assetPins": [
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q10-problem-visual-v2.svg",
      "gitBlobSha1": "64294b04ae98f530e9cb40d48f44135ed7c1c5b5",
      "bytes": 4009
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q10-solution.svg",
      "gitBlobSha1": "1482adc68f2ca25c9a20e94ecfe3ca43c7867ab9",
      "bytes": 21117
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q11-solution.svg",
      "gitBlobSha1": "bd644266cae8430854ff2cca9d4b11f0f0f770d0",
      "bytes": 34993
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q15-problem-visual-v2.svg",
      "gitBlobSha1": "c62f018f3323515a0256c836566bdceb5ede9fa9",
      "bytes": 5647
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q15-solution.svg",
      "gitBlobSha1": "10d4a3242de6c91966ea5ec82ff2178f8250f51c",
      "bytes": 88264
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q16-solution.svg",
      "gitBlobSha1": "bbf3c9d749a8831e33d2af0979702c0e53e8e3de",
      "bytes": 61842
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q17-solution.svg",
      "gitBlobSha1": "e442d27531c236ab33449812b8dcc07779283380",
      "bytes": 131492
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q18-problem-visual-v2.svg",
      "gitBlobSha1": "57b72cd77ffb0ea57f6e5f12950aafb1b4f2a3b9",
      "bytes": 5778
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q18-solution-v2.svg",
      "gitBlobSha1": "0fd07b8d7e8b031df5f6e152e62580bef3f5996c",
      "bytes": 41674
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q19-problem-visual-v2.svg",
      "gitBlobSha1": "75578fdd660ca268b3e16b86f9364503c4f9502a",
      "bytes": 3849
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q19-solution-visual-v2.svg",
      "gitBlobSha1": "1d2090f4ac12db5ecff8f9e7ccb9fd3d49bf321c",
      "bytes": 5850
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q20-problem-visual-v2.svg",
      "gitBlobSha1": "49e6b5a71289b46787c160e8125cb053924ac3a1",
      "bytes": 5290
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q20-solution.svg",
      "gitBlobSha1": "f8dc13406977a6c125a8d13f33c14275c3e6fe77",
      "bytes": 37449
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q21-problem-visual-v2.svg",
      "gitBlobSha1": "d23158782daef111715b8ea02ccc39a85bc5a875",
      "bytes": 4765
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q21-solution.svg",
      "gitBlobSha1": "df64c1fad5d6d4f7033c073d6f43c40663463077",
      "bytes": 21066
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q22-solution-v2.svg",
      "gitBlobSha1": "1c21ace0b1556f8a40482969e5e6e884e41aa093",
      "bytes": 56872
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q23-solution.svg",
      "gitBlobSha1": "b56669b9cc7de84784fd2126dd084b5d9eb08055",
      "bytes": 34443
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q24-problem-visual-v2.svg",
      "gitBlobSha1": "46402bf7c188ad1553a5e3c3638c2a693ffb7561",
      "bytes": 6698
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q24-solution.svg",
      "gitBlobSha1": "e61a73b10c9dc3249d5f86c88536e949bec24d5a",
      "bytes": 47326
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q5-problem-visual-v2.svg",
      "gitBlobSha1": "716a1f1bed334df723be1c031315afd027a91411",
      "bytes": 3298
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q5-solution.svg",
      "gitBlobSha1": "d36b867f7042a42b5da5d1493a4a6654141cc099",
      "bytes": 22115
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q6-problem-visual-v2.svg",
      "gitBlobSha1": "716a1f1bed334df723be1c031315afd027a91411",
      "bytes": 3298
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q6-solution.svg",
      "gitBlobSha1": "c625e199bbc8a7fb2969f3c776b2679fcde49941",
      "bytes": 52563
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q7-problem-visual-v2.svg",
      "gitBlobSha1": "7362434cccd435b6db18c48695e8fc26b6888b61",
      "bytes": 4880
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q7-solution.svg",
      "gitBlobSha1": "7adb3366df068ad0e4df21860e978dada6b53e61",
      "bytes": 24527
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q9-problem-visual-v2.svg",
      "gitBlobSha1": "3019c5d11c18390b42be2976afb366c0990e7a0b",
      "bytes": 4603
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q9-solution.svg",
      "gitBlobSha1": "2db5b61aeea5b50729769a334b6ba05aa82e83d9",
      "bytes": 29635
    }
  ],
  "unchangedAssetPins": [
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q11-solution.svg",
      "gitBlobSha1": "bd644266cae8430854ff2cca9d4b11f0f0f770d0",
      "bytes": 34993
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q16-solution.svg",
      "gitBlobSha1": "bbf3c9d749a8831e33d2af0979702c0e53e8e3de",
      "bytes": 61842
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q17-solution.svg",
      "gitBlobSha1": "e442d27531c236ab33449812b8dcc07779283380",
      "bytes": 131492
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q22-solution-v2.svg",
      "gitBlobSha1": "1c21ace0b1556f8a40482969e5e6e884e41aa093",
      "bytes": 56872
    },
    {
      "path": "archive/assets/images/24_왕운중_2학기_기말_중2_수학/q23-solution.svg",
      "gitBlobSha1": "b56669b9cc7de84784fd2126dd084b5d9eb08055",
      "bytes": 34443
    }
  ]
};

const ID='archive/data/question_identity_map.json',MD='archive/data/question_metadata.json';
const INDEX='archive/data/item-4slot-index.json';
const OID=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const SLOTS=['given','goal','method','condition'];
const STUDENT=['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const clone=x=>JSON.parse(JSON.stringify(x));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const vector=x=>Object.fromEntries(['format',...SLOTS,'candidates'].map(k=>[k,x[k]]));
function need(ok,code){if(!ok)throw Error('E012_PARTIAL_'+code);}
function safeRelative(rel){
  need(typeof rel==='string'&&rel&&!rel.includes('\\')&&!/[\x00-\x1f]/.test(rel)&&!path.posix.isAbsolute(rel)&&
    !rel.split('/').some(x=>!x||x==='.'||x==='..'),'PATH');
  return rel;
}
function file(root,rel){
  safeRelative(rel);let cur=root;
  for(const part of rel.split('/')){cur=path.join(cur,part);need(!fs.lstatSync(cur).isSymbolicLink(),'SYMLINK');}
  need(fs.statSync(cur).isFile(),'REGULAR_FILE');return cur;
}
function git(root,args,opts={}){
  const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
  return execFileSync('git',['-C',root,...args],{env,maxBuffer:160*1024*1024,timeout:180000,stdio:['ignore','pipe','pipe'],...opts});
}
function pin(raw,expected,label){
  need(Buffer.isBuffer(raw)&&raw.length===expected.bytes&&blob(raw)===expected.gitBlobSha1&&
    (!Object.hasOwn(expected,'sha256')||sha(raw)===expected.sha256),'PIN_'+label);
}
function outputPath(name){
  const base=fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),full=path.resolve(name);
  need(full.startsWith(base+path.sep),'OUTPUT_OUTSIDE_RUNNER_TEMP');return full;
}
function safeReason(value){
  const text=String(value||''),prefix=text.split(':')[0];
  return {code:/^[A-Z][A-Z0-9_|+-]{0,179}$/.test(prefix)?prefix:'UNCLASSIFIED_FAILURE',sha256:sha(text)};
}
function localAssetPaths(bank){
  const found=new Set();
  for(const q of bank){
    const text=JSON.stringify(Object.fromEntries(STUDENT.map(k=>[k,q[k]??null]))).replaceAll('\\/','/');
    for(const match of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
      found.add(match[0].startsWith('archive/')?match[0]:'archive/'+match[0]);
  }
  return [...found].sort();
}
function provenance(root){
  const e=process.env,head=git(root,['rev-parse','HEAD']).toString().trim();
  need(e.GITHUB_ACTIONS==='true'&&e.GITHUB_EVENT_NAME==='push'&&e.GITHUB_REF===CONFIG.branch&&
    e.GITHUB_REPOSITORY===CONFIG.repository&&e.GITHUB_SHA===head&&e.ARCHIVE_E012_GATE_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
  const event=JSON.parse(fs.readFileSync(e.GITHUB_EVENT_PATH,'utf8'));
  need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
    event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
  need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
    e.GITHUB_JOB==='e012-source-binding','OPS_RUN');
  need(git(root,['rev-parse','--is-shallow-repository']).toString().trim()==='false','FULL_HISTORY_REQUIRED');
  git(root,['cat-file','-e',CONFIG.baselineSnapshot+'^{commit}']);
  return {provider:'GITHUB_ACTIONS',eventName:'push',repository:CONFIG.repository,ref:CONFIG.branch,
    checkoutCommit:head,eventCommit:event.after,runId:e.GITHUB_RUN_ID,runAttempt:Number(e.GITHUB_RUN_ATTEMPT),
    job:e.GITHUB_JOB,immutableBeforeSnapshot:CONFIG.baselineSnapshot};
}
function phase(report,name){report.phase=name;console.log(JSON.stringify({schemaVersion:CONFIG.schemaVersion,phase:name,status:'RUNNING'}));}
function run(root,reportPath){
  root=fs.realpathSync(root);reportPath=outputPath(reportPath);
  const report={schemaVersion:CONFIG.schemaVersion,status:'RUNNING',phase:'PROVENANCE',
    sourceArchiveFile:CONFIG.sourceArchiveFile,sourceQuestionCount:24,selectedQuestionCount:13,heldQuestionCount:11,
    globalBuilderRun:false,mainWrites:0,trackedInputWrites:0,newMathQa:0,newSemanticApprovals:0,newFourSlotVectors:0,
    sourceApprovalMutation:0,screenshotRuns:0,actualMainRegistration:'NOT_PERFORMED'};
  let fixture,work,rootHead,rootStatus;
  const currentInputs=new Map(),immutableInputs=new Map(),fixtureInputs=new Map();
  function writeReport(){
    const raw=Buffer.from(JSON.stringify(report,null,2)+'\n');need(raw.length<=2*1024*1024,'REPORT_BOUND');
    fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,raw);
    const encoded=raw.toString('base64'),width=6000,chunks=Math.ceil(encoded.length/width);
    const header={schemaVersion:'archive-scoped-metadata-log-v1',profile:'E012_EXISTING_VECTOR_PARTIAL13',
      bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw),chunks};
    console.log('ARCHIVE_SCOPED_REPORT_BEGIN '+JSON.stringify(header));
    for(let i=0;i<chunks;i++)console.log('ARCHIVE_SCOPED_REPORT_CHUNK '+JSON.stringify({index:i,data:encoded.slice(i*width,(i+1)*width)}));
    console.log('ARCHIVE_SCOPED_REPORT_END '+JSON.stringify(header));
  }
  try{
    report.execution=provenance(root);rootHead=report.execution.checkoutCommit;
    rootStatus=git(root,['status','--porcelain=v1','--untracked-files=all']).toString();need(rootStatus==='','ROOT_DIRTY');
    function current(rel,expected){
      report.lastRead={kind:'CURRENT_INPUT',path:rel,expectedGitBlobSha1:expected?.gitBlobSha1||null};
      const raw=fs.readFileSync(file(root,rel)),entry=git(root,['ls-tree','-z',rootHead,'--',safeRelative(rel)]).toString();
      const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      need(match&&match[3]===rel&&blob(raw)===match[2],'CURRENT_HEAD_BYTES');
      if(expected)pin(raw,expected,'CURRENT');
      const observed={path:rel,gitBlobSha1:match[2],sha256:sha(raw),bytes:raw.length},prior=currentInputs.get(rel);
      if(prior)need(stable(prior)===stable(observed),'CURRENT_CHANGED');else currentInputs.set(rel,observed);
      return raw;
    }
    function historical(expected,label){
      need(OID.test(expected.gitBlobSha1)&&SHA.test(expected.sha256)&&expected.bytes>0,'HISTORICAL_REF');
      report.lastRead={kind:'IMMUTABLE_BLOB',purpose:label,gitBlobSha1:expected.gitBlobSha1};
      const raw=git(root,['cat-file','blob',expected.gitBlobSha1]);pin(raw,expected,label);
      immutableInputs.set(expected.gitBlobSha1,{gitBlobSha1:expected.gitBlobSha1,sha256:expected.sha256,bytes:expected.bytes,purpose:label});
      return raw;
    }
    function immutablePath(expected){
      const entry=git(root,['ls-tree','-z',CONFIG.baselineSnapshot,'--',expected.path]).toString();
      const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      need(match&&match[2]===expected.gitBlobSha1&&match[3]===expected.path,'BASELINE_PATH');
      return historical(expected,'BEFORE_SNAPSHOT');
    }
    function put(rel,raw){
      safeRelative(rel);const target=path.join(fixture,rel);fs.mkdirSync(path.dirname(target),{recursive:true});
      need(!fs.existsSync(target),'DUPLICATE_PRIVATE_INPUT');fs.writeFileSync(target,raw,{flag:'wx'});fs.chmodSync(target,0o444);
      need(fs.statSync(target).nlink===1,'PRIVATE_HARDLINK');
      fixtureInputs.set(rel,{path:rel,gitBlobSha1:blob(raw),sha256:sha(raw),bytes:raw.length});
    }
    function replacePrivate(rel,raw){
      const target=file(fixture,rel);need(fs.statSync(target).nlink===1,'PRIVATE_HARDLINK');
      fs.chmodSync(target,0o644);fs.writeFileSync(target,raw);fs.chmodSync(target,0o444);
    }
    phase(report,'AUTHENTICATED_INPUTS');
    for(const expected of CONFIG.codePins)current(expected.path,expected);
    const builder=require(path.join(root,'tools/4slot/build-4slot-runtime.cjs'));
    const consumer=require(path.join(root,'archive/item-4slot.js'));
    const {sourceNumber,sourceIdentityNumber}=require(path.join(root,'tools/4slot/exam-items.cjs'));
    const currentSource=current(CONFIG.source.path,CONFIG.source),snapshotSource=immutablePath(CONFIG.source);
    need(currentSource.equals(snapshotSource),'SOURCE_SNAPSHOT_BYTES');
    const oldRaw=historical(CONFIG.previousSource,'PREVIOUS_RECONCILIATION_SOURCE');
    const originalRaw=historical(CONFIG.originalSource,'ORIGINAL_REVIEWED_SOURCE');
    const beforeRaw=immutablePath(CONFIG.compactBefore);
    const candidateRaw=current(CONFIG.compactAfter.path,CONFIG.compactAfter);
    const oldPin=CONFIG.previousSource.gitBlobSha1,newPin=CONFIG.source.gitBlobSha1;
    const beforeText=beforeRaw.toString(),candidateText=candidateRaw.toString();
    need(beforeText.split(oldPin).length===2&&beforeText.replace(oldPin,newPin)===candidateText,'EXACT_ONE_FIELD_PATCH');
    const beforeCompact=JSON.parse(beforeText),compact=JSON.parse(candidateText),inverse=clone(compact);
    inverse.identityReconciliation.sourceGitBlobSha=oldPin;
    need(stable(inverse)===stable(beforeCompact)&&compact.identityReconciliation.sourceGitBlobSha===newPin,'EXACT_JSON_POINTER');
    need(compact.sourceArchiveFile===CONFIG.sourceArchiveFile&&compact.sourceGitBlobSha===CONFIG.originalSource.gitBlobSha1&&
      compact.schemaVersion==='archive-meta-4slot-compact-v1'&&compact.items.length===24&&
      compact.identityReconciliation.schemaVersion==='4slot-orphan-uid-reconciliation-v1'&&compact.identityReconciliation.records.length===24&&
      !Object.hasOwn(compact,'scope')&&compact.items.every(x=>!Object.hasOwn(x,'registrationHold')),'FIXED_COMPACT_SCOPE');
    const dictionaryRaw=current(CONFIG.dictionary.path,CONFIG.dictionary),dictionary=JSON.parse(dictionaryRaw.toString());
    need(dictionary.dictionaryVersion===compact.dictionaryVersion,'DICTIONARY_VERSION');
    const bank=builder.loadBank(currentSource),oldBank=builder.loadBank(oldRaw),originalBank=builder.loadBank(originalRaw);
    need(bank.length===24&&oldBank.length===24&&originalBank.length===24,'BANK24');
    const identityRaw=current(ID),identity=JSON.parse(identityRaw.toString());
    need(identity.schemaVersion==='question-identity-map-v1'&&Array.isArray(identity.records),'IDENTITY_SCHEMA');
    // These global bytes are only observed for preservation; the scoped builder does not rewrite or approve them.
    current(MD);
    const actualIndexRaw=current(INDEX),actualIndex=JSON.parse(actualIndexRaw.toString());
    need(actualIndex.schemaVersion===builder.SCHEMA&&Array.isArray(actualIndex.files)&&Array.isArray(actualIndex.records)&&Array.isArray(actualIndex.pending),'ACTUAL_INDEX');
    const actualFiles=actualIndex.files.filter(x=>x.path===CONFIG.compactBefore.path);need(actualFiles.length===1,'ACTUAL_FILE');
    const actualFile=actualFiles[0];
    need(actualFile.compactSha256===CONFIG.compactBefore.sha256&&actualFile.currentSourceBlobSha===CONFIG.source.gitBlobSha1,'ACTUAL_BEFORE_EDITION');
    for(const k of ['existingVectorContinuityClaims','m1ProblemContinuityClaims','m3LayoutContinuityClaims','q5CompleteGivenContinuityClaims'])
      need(!Object.hasOwn(actualFile,k)||Array.isArray(actualFile[k])&&actualFile[k].length===0,'UNEXPECTED_EXISTING_CLAIM');
    const uses=new Map(),joins=new Map();
    for(const row of identity.records){
      uses.set(row.questionUid,(uses.get(row.questionUid)||0)+1);
      if(row.sourceArchiveFile===CONFIG.sourceArchiveFile){const k=row.sourceOrdinal;if(!joins.has(k))joins.set(k,[]);joins.get(k).push(row);}
    }
    need(joins.size===24,'IDENTITY_DENOMINATOR');
    const unchanged=new Set(CONFIG.unchangedOrdinals),held=new Set(CONFIG.heldOrdinals),uids=new Set(CONFIG.identities.map(x=>x.questionUid));
    need(unchanged.size===13&&held.size===11&&uids.size===24&&new Set([...unchanged,...held]).size===24,'FIXED_PARTITION');
    const states=[],comparison=[];
    for(let i=0;i<24;i++){
      const ordinal=i+1,q=bank[i],prior=oldBank[i],original=originalBank[i],expected=CONFIG.identities[i];
      const pair=joins.get(ordinal)||[],proofs=compact.identityReconciliation.records.filter(x=>x.sourceOrdinal===ordinal);
      const items=compact.items.filter(x=>x.ordinal===sourceNumber(q));
      need(expected.sourceOrdinal===ordinal&&pair.length===1&&proofs.length===1&&items.length===1,'JOIN_COUNT');
      const id=pair[0],proof=proofs[0],it=items[0];
      need(UID.test(id.questionUid)&&id.questionUid===expected.questionUid&&uses.get(id.questionUid)===1&&
        (id.status==null||id.status==='VERIFIED')&&id.sourceArchiveFile===CONFIG.sourceArchiveFile&&
        String(id.sourceQuestionNo)===expected.sourceQuestionNo&&sourceIdentityNumber(q)===expected.sourceQuestionNo&&
        sourceNumber(q)===ordinal&&sourceNumber(prior)===ordinal&&sourceNumber(original)===ordinal,'CANONICAL_JOIN');
      need(proof.questionUid===id.questionUid&&proof.sourceQuestionNo===expected.sourceQuestionNo&&proof.embeddedQuestionUid===q.questionUid&&
        q.questionUid!==id.questionUid&&!uses.has(q.questionUid),'ORPHAN_JOIN');
      const fp=builder.identityHash(q),oldFp=builder.identityHash(prior),whole=stable(q)===stable(prior),sameFp=fp===oldFp;
      need(proof.sourceFingerprint===oldFp&&id.sourceFingerprint===oldFp,'ORIGINAL_IDENTITY_PROOF');
      need(whole===unchanged.has(ordinal)&&sameFp===unchanged.has(ordinal)&&
        (builder.payloadHash(q)===builder.payloadHash(original))===unchanged.has(ordinal),'EXACT_13_11_PARTITION');
      need(stable(it)===stable(beforeCompact.items.find(x=>x.ordinal===it.ordinal)),'REVIEWED_VECTOR_MUTATION');
      states.push({questionUid:id.questionUid,sourceOrdinal:ordinal,sourceQuestionNo:expected.sourceQuestionNo,displayNumber:it.ordinal});
      comparison.push({questionUid:id.questionUid,sourceOrdinal:ordinal,wholeEqualToPrevious:whole,identityEqualToPrevious:sameFp,
        payloadEqualToOriginal:builder.payloadHash(q)===builder.payloadHash(original),
        currentWholeSha256:sha(stable(q)),previousWholeSha256:sha(stable(prior)),
        currentIdentityFingerprint:fp,priorIdentityFingerprint:oldFp,identityRowSha256:sha(stable(id)),
        changedFieldNames:[...new Set([...Object.keys(q),...Object.keys(prior)])].filter(k=>stable(q[k])!==stable(prior[k])).sort()});
    }
    const requiredAssets=localAssetPaths(bank);
    need(stable(requiredAssets)===stable(CONFIG.assetPins.map(x=>x.path).sort()),'ASSET_FOOTPRINT');
    const assetBytes=new Map();
    for(const expected of CONFIG.assetPins)assetBytes.set(expected.path,current(expected.path,expected));
    const restoredAssets=localAssetPaths(bank.filter((_,i)=>unchanged.has(i+1)));
    need(stable(restoredAssets)===stable(CONFIG.unchangedAssetPins.map(x=>x.path).sort()),'RESTORED_ASSET_FOOTPRINT');
    for(const expected of CONFIG.unchangedAssetPins){
      const raw=assetBytes.get(expected.path);pin(raw,expected,'UNCHANGED_ASSET');
      need(actualFile.assetDigests?.[expected.path]===sha(raw),'ACTUAL_ASSET_BASELINE');
      if(Object.hasOwn(actualFile,'baselineAssetDigests'))
        need(actualFile.baselineAssetDigests[expected.path]===sha(raw),'PRESERVED_ASSET_BASELINE');
    }
    const sourceRecords=actualIndex.records.filter(x=>x.compactPath===CONFIG.compactBefore.path||uids.has(x.questionUid));
    const actualPending=actualIndex.pending.filter(x=>x.path===CONFIG.compactBefore.path).sort((a,b)=>a.ordinal-b.ordinal);
    need(sourceRecords.length===0&&actualPending.length===24&&actualPending.every((p,i)=>p.ordinal===i+1&&p.reason==='SOURCE_UID_CONFLICT'),'ACTUAL_PENDING24');
    report.actualBaseline={index:currentInputs.get(INDEX),metadata:currentInputs.get(MD),identity:currentInputs.get(ID),
      selectedRegistered:0,selectedPending:13,heldPending:11,pendingWholeSha256:sha(stable(actualPending)),
      originalReviewedSourceHeader:compact.sourceGitBlobSha,reviewedVectorsSha256:sha(stable(compact.items)),
      reconciliationRecordsSha256:sha(stable(compact.identityReconciliation.records)),
      evidenceSha256:sha(stable(compact.evidence)),reviewerSha256:sha(stable(compact.reviewedBy)),
      sourceComparison:comparison,localAssets:CONFIG.assetPins.length,restoredAssetBytesUnchanged:restoredAssets.length};
    work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'e012-partial-scope-'));
    fixture=path.join(work,'fixture');
    git(root,['clone','--quiet','--shared','--no-checkout','--no-hardlinks',root,fixture]);
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD');
    put(CONFIG.source.path,currentSource);put(CONFIG.compactAfter.path,candidateRaw);put(CONFIG.dictionary.path,dictionaryRaw);
    put(ID,identityRaw);put(INDEX,actualIndexRaw);
    for(const [rel,raw]of assetBytes)put(rel,raw);
    // No sidecar is added or interpreted. The original compact/evidence and canonical join remain the authority.
    const checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX&&x.path!==CONFIG.compactAfter.path);
    const heldState=index=>index.pending.filter(x=>x.path===CONFIG.compactBefore.path&&held.has(x.ordinal)).sort((a,b)=>a.ordinal-b.ordinal);
    const expectedHeld=actualPending.filter(x=>held.has(x.ordinal));
    function partition(index,registeredOrdinals){
      need(index.schemaVersion===builder.SCHEMA&&index.counts.files===1&&index.counts.items===24&&
        index.records.length+index.pending.length===24&&index.files[0].path===CONFIG.compactAfter.path,'RESULT_DENOMINATOR');
      need(index.records.every(r=>uids.has(r.questionUid)&&r.compactPath===CONFIG.compactAfter.path&&r.sourceArchiveFile===CONFIG.sourceArchiveFile)&&
        index.pending.every(p=>p.path===CONFIG.compactAfter.path&&Number.isInteger(p.ordinal)&&p.ordinal>=1&&p.ordinal<=24),'RESULT_SCOPE');
      const ordinals=index.records.map(r=>r.sourceOrdinal).sort((a,b)=>a-b);
      need(stable(ordinals)===stable(registeredOrdinals.slice().sort((a,b)=>a-b)),'REGISTERED_PARTITION');
      const joined=[...index.records.map(r=>r.sourceOrdinal),...index.pending.map(p=>p.ordinal)].sort((a,b)=>a-b);
      need(stable(joined)===stable(states.map(s=>s.sourceOrdinal)),'RESULT_UNIQUE_PARTITION');
      need(stable(heldState(index))===stable(expectedHeld),'HELD11_WHOLE_CHANGED');
    }
    function observedStable(built){
      for(const [rel,digest]of built.observed)need(sha(fs.readFileSync(file(fixture,rel)))===digest,'INPUT_CHANGED_DURING_BUILD');
    }
    function summary(index){
      return {counts:index.counts,registered:index.records.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,
        wholeRowSha256:sha(stable(r)),vectorSha256:sha(stable(vector(r))),sourceUidBinding:r.sourceUidBinding,sourceBinding:r.sourceBinding})),
        pending:index.pending.map(p=>({sourceOrdinal:p.ordinal,reason:p.reason,wholeRowSha256:sha(stable(p))})),
        heldWholeSha256:sha(stable(heldState(index)))};
    }
    phase(report,'ORIGINAL_PIN_BASELINE');
    replacePrivate(CONFIG.compactAfter.path,beforeRaw);
    const before=builder.build(fixture,{previous:actualIndex,reuseCache:false});report.before=summary(before.index);
    observedStable(before);partition(before.index,[]);
    need(stable(before.index.pending.slice().sort((a,b)=>a.ordinal-b.ordinal))===stable(actualPending),'BASELINE_PENDING_WHOLE');
    report.before=summary(before.index);
    phase(report,'OFFICIAL_PARTIAL_RECONCILIATION');
    replacePrivate(CONFIG.compactAfter.path,candidateRaw);
    const after=builder.build(fixture,{previous:before.index,reuseCache:false});report.after=summary(after.index);
    observedStable(after);partition(after.index,CONFIG.unchangedOrdinals);
    need(after.index.counts.registered===13&&after.index.counts.pending===11,'EXPECTED13_HELD11');
    for(const row of after.index.records){
      const state=states.find(x=>x.questionUid===row.questionUid),item=compact.items.find(x=>x.ordinal===state.displayNumber);
      const expected={questionUid:state.questionUid,sourceArchiveFile:CONFIG.sourceArchiveFile,sourceOrdinal:state.sourceOrdinal,
        sourceQuestionNo:state.sourceQuestionNo,sourceDisplayNumber:state.displayNumber,compactPath:CONFIG.compactAfter.path,
        dictionaryVersion:compact.dictionaryVersion,...vector(item),sourceUidBinding:'VERIFIED_ORPHAN_UID_RECONCILIATION',
        identityFingerprintStatus:'CURRENT',sourceBinding:'UNCHANGED_STUDENT_PAYLOAD',registrationStatus:'REGISTERED',independentReviewClaim:false};
      need(stable(row)===stable(expected),'EXISTING_VECTOR_WHOLE');
    }
    const verified=builder.verify(after.index),api=consumer.createIndex(after.index);let queries=0;
    need(verified.verified===13&&verified.pending===11&&verified.status==='PASS_WITH_SUPPLEMENTS'&&api.size===13,'OFFICIAL_VERIFY');
    for(const row of after.index.records){
      need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_GET');queries++;
      for(const slot of SLOTS)for(const term of row[slot]){need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_POSTING');queries++;}
    }
    for(const state of states.filter(x=>held.has(x.sourceOrdinal))){need(api.get(state.questionUid)===null,'HELD_CONSUMER_EXCLUSION');queries++;}
    report.after=summary(after.index);
    report.consumer={selected:13,heldExcluded:11,queries,officialVerify:verified.status,verified:verified.verified,
      heldWholeSha256:sha(stable(expectedHeld)),newFourSlotVectors:0};
    const finalIndexRaw=Buffer.from(JSON.stringify(after.index)+'\n');
    replacePrivate(INDEX,finalIndexRaw);
    phase(report,'COLD_CHECK');
    const cold=builder.run(fixture,{check:true});
    need(cold.changed===false&&cold.revalidatedFiles===1&&cold.reusedFiles===0&&cold.counts.registered===13&&cold.counts.pending===11,'COLD_REPLAY');
    report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,counts:cold.counts,indexSha256:cold.indexSha256};
    phase(report,'RECONCILIATION_PIN_ROLLBACK');
    replacePrivate(CONFIG.compactAfter.path,beforeRaw);
    const rollback=builder.build(fixture,{previous:after.index,reuseCache:false});observedStable(rollback);partition(rollback.index,[]);
    need(stable(rollback.index.pending.slice().sort((a,b)=>a.ordinal-b.ordinal))===stable(actualPending),'ROLLBACK_PENDING_WHOLE');
    report.rollback={registered:0,pending:24,pendingWholeSha256:sha(stable(actualPending))};
    phase(report,'SINGLE_RECORD_FINGERPRINT_REFUSAL');
    // This malformed private identity proof tests refusal only. Vectors, evidence and reviewers stay byte-identical.
    const malformed=clone(compact),negativeOrdinal=CONFIG.unchangedOrdinals[0];
    malformed.identityReconciliation.records.find(x=>x.sourceOrdinal===negativeOrdinal).sourceFingerprint='0'.repeat(64);
    need(stable(malformed.items)===stable(compact.items)&&stable(malformed.evidence)===stable(compact.evidence)&&
      stable(malformed.reviewedBy)===stable(compact.reviewedBy),'NEGATIVE_APPROVAL_MUTATION');
    replacePrivate(CONFIG.compactAfter.path,Buffer.from(JSON.stringify(malformed,null,2)+'\n'));
    const refused=builder.build(fixture,{previous:after.index,reuseCache:false});observedStable(refused);
    partition(refused.index,CONFIG.unchangedOrdinals.filter(x=>x!==negativeOrdinal));
    need(stable(refused.index.records)===stable(after.index.records.filter(x=>x.sourceOrdinal!==negativeOrdinal)),'NEGATIVE_OUTSIDE12_CHANGED');
    const refusal=refused.index.pending.filter(x=>x.ordinal===negativeOrdinal);
    need(refusal.length===1&&refusal[0].reason==='SOURCE_UID_CONFLICT','FINGERPRINT_REFUSAL');
    report.negative={sourceOrdinal:negativeOrdinal,registered:12,pending:12,reason:refusal[0].reason,
      outsideSelected12WholeUnchanged:true,held11WholeUnchanged:true,reviewedVectorsAndEvidenceUnchanged:true};
    replacePrivate(CONFIG.compactAfter.path,candidateRaw);
    pin(fs.readFileSync(file(fixture,CONFIG.compactAfter.path)),CONFIG.compactAfter,'RESTORED_CANDIDATE');
    need(fs.readFileSync(file(fixture,INDEX)).equals(finalIndexRaw),'PRIVATE_INDEX_CHANGED');
    for(const expected of checkpoint)pin(fs.readFileSync(file(fixture,expected.path)),expected,'PRIVATE_INPUT_UNCHANGED');
    for(const expected of currentInputs.values())pin(fs.readFileSync(file(root,expected.path)),expected,'ROOT_INPUT_UNCHANGED');
    need(git(root,['rev-parse','HEAD']).toString().trim()===rootHead&&
      git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus,'ROOT_MUTATION');
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD_CHANGED');
    report.inputProof={current:[...currentInputs.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),
      immutable:[...immutableInputs.values()].sort((a,b)=>a.gitBlobSha1.localeCompare(b.gitBlobSha1,'en')),
      privateFiles:fixtureInputs.size,nonDerivedPrivateInputsUnchanged:checkpoint.length,writableSharedHardlinks:0,
      scope:'one exact source bank; original compact and identity proof; no packet recursion or global registration'};
    report.phase='COMPLETE';report.status='PASS_PRIVATE_PARTIAL_RECONCILIATION';
    writeReport();console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,registered:13,
      pendingHeld:11,consumerSelected:13,coldChanged:false,rollbackRegistered:0,negativeFingerprintRejected:1,
      actualMainRegistration:'NOT_PERFORMED',reportSha256:sha(fs.readFileSync(reportPath))}));
    return report;
  }catch(error){
    report.status='FAIL';report.error=safeReason(error?.message);
    if(rootHead){try{report.rootHeadUnchanged=git(root,['rev-parse','HEAD']).toString().trim()===rootHead;
      report.rootStatusUnchanged=git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus;}catch{report.rootInputCheck='UNAVAILABLE';}}
    report.currentInputCount=currentInputs.size;report.immutableInputCount=immutableInputs.size;
    writeReport();console.error(JSON.stringify({schemaVersion:report.schemaVersion,status:'FAIL',phase:report.phase,
      error:report.error,observedCounts:report.after?.counts||report.before?.counts||null,reportSha256:sha(fs.readFileSync(reportPath))}));
    process.exitCode=1;return report;
  }finally{if(work)fs.rmSync(work,{recursive:true,force:true});}
}
if(require.main===module){
  const args=process.argv.slice(2);let root=path.resolve(__dirname,'../..'),output;
  for(let i=0;i<args.length;i++){if(args[i]==='--root')root=path.resolve(args[++i]);else if(args[i]==='--output')output=args[++i];else throw Error('E012_PARTIAL_UNKNOWN_ARGUMENT');}
  need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
