#!/usr/bin/env node
'use strict';
// Private read-only M1S2 scope gate: the official existing registered-vector
// verifier remains authoritative. This runner never issues FINAL_QA approvals.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-m1s2-current-ui-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m1-current-ui-registration-26fc-20261117",
  "integrationAncestor": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
  "visualAncestor": "d3d625ceb7315ffddbcd4a0a8c9960527fe0c9ed",
  "previousCapture": "48d18ccdc7eafffe3d1d8ae32e65a4dc23437502",
  "rawTechnicalRef": {
    "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
    "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/technical-proof.json",
    "gitBlobSha1": "82fe4a6929e1d7b800bbba4f3a2634ffea04cc77",
    "sha256": "6d7281d12281f6ceb454d3cc79244a66a8a5013327120a4b5bfde98671d8fa42",
    "bytes": 222310
  },
  "files": [
    {
      "path": "tools/4slot/m1s2-problem-renderer-ui.cjs",
      "gitBlobSha1": "4321e8e5e1a10d158e4ab8ac87e0e17bc2c82836",
      "sha256": "9839283ab1b0f1affa7919618d7bea9fd3e9f5b2d8f5123812fc840546039223",
      "bytes": 32395
    },
    {
      "path": "tests/item-4slot-m1s2-current-ui-reuse.test.cjs",
      "gitBlobSha1": "6c64f558090dae1e9b58adee42904155fb5f22b4",
      "sha256": "354b4d9cb518d82d10df42781daa8e87ae5d934ddd7347e21782b5491d2565de",
      "bytes": 15066
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
      "gitBlobSha1": "37ae75f016b1ea7ef950df4e90f6f57e1a1f0daf",
      "sha256": "f61852df9d4ed2ccd9c06074b8ccc701fe10df7bff4f3dd3a8904b0494dd2e95",
      "bytes": 6678
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6.json",
      "gitBlobSha1": "11c13b3f9994d8840c41e62cf63bf1e611686dbd",
      "sha256": "b4051411a73e21e004684c6865e466ed5ac24ba83d5f611a07d8e303a7772f9c",
      "bytes": 6676
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3.json",
      "gitBlobSha1": "7677883751409a30eb7b9835423bcb1b724dd450",
      "sha256": "7d8bbc1aaaccf40a47b6d2c2e574f5bf19f0f2f3f329ffd9ad39211a4e4974c0",
      "bytes": 6697
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e.json",
      "gitBlobSha1": "a4cfb2cb9ce6ed5ebbb92b5527d1e3a4448a622e",
      "sha256": "85cdb1c5583d19ab9def4165b3b8e9aa3119d5ebd1b79fd19b342f2aad38eafb",
      "bytes": 6691
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15.json",
      "gitBlobSha1": "aa0fd6b93e5a9022f565bc04ae794f0f8fb01ff3",
      "sha256": "e0ced2ce4d5797544bce3b858d8b398b2d72ac96044342d3430582f6714f5c55",
      "bytes": 6697
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140.json",
      "gitBlobSha1": "662b480e1560d7ffa759e100005a5bed42022d79",
      "sha256": "0443bd24448aa4462ecf179bc10ab6f0add2c8120f7d2e853d477e0f3a9c3264",
      "bytes": 6692
    },
    {
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
      "gitBlobSha1": "3a361820e3ac959c759aed8bb421c319df6b0ae7",
      "sha256": "c060e456198a7fef9407723378b231b3f9cd52babcf483b7c6556d269f96ab82",
      "bytes": 6676
    },
    {
      "path": "tools/check-m1s2-problem-seven-browser.cjs",
      "gitBlobSha1": "b575897d190a512b48b04e03719bd3cc0cc02654",
      "sha256": "130fcab0be811c537ddce05f5c1f17a26e18cf9862ea690dbefcea419bde73e9",
      "bytes": 25233
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
      "sourceArchiveFile": "original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
      "count": 24,
      "sourceRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/exams/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
        "gitBlobSha1": "d0256aaf7b87627591de65458a1e635f9a506f53",
        "sha256": "b41f6ead7ff854bc353e2968ce3967e35c709acd400068aaf88c819bfbe4ce98",
        "bytes": 71132
      },
      "compactRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/data/item-4slot/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.4slot.json",
        "gitBlobSha1": "0dcc9c92bf7a4a059308ee0de7a8f278ac01a9ea",
        "sha256": "446ed95dac6d9469432bc6144efcc70986c287ea3b6e9462554542aa6b5c2706",
        "bytes": 7820
      },
      "dictionaryRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
      "count": 24,
      "sourceRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
        "gitBlobSha1": "f8cf25ac8c1b83019a62ad44bf13120cd540407a",
        "sha256": "97adbc97cb254aa121ad4ee5b783d482de6f0a2008f437bd0d31e0d08e36333a",
        "bytes": 80650
      },
      "compactRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/data/item-4slot/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.4slot.json",
        "gitBlobSha1": "f3b8a15997ffc9c77d8d7df476a2fe9c422f4099",
        "sha256": "5cfb9e509082b900073bba0942992c411596501a961195c169782a7ef1f43793",
        "bytes": 3723
      },
      "dictionaryRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
      "count": 23,
      "sourceRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
        "gitBlobSha1": "afa0d8e82b9ff6e64269217f0ad43e386a114dc3",
        "sha256": "890a1bb8c329b7a47d8112ab4311c894e283f6a4ace151747e50a1dedf675230",
        "bytes": 61534
      },
      "compactRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/data/item-4slot/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.4slot.json",
        "gitBlobSha1": "5dcaad558592ef918c09e992a5daca9ba58e9a1f",
        "sha256": "c8017d9fe3e3a23d81c13a036c994f3598c5455afe4f79e3f7aaa669dd949d26",
        "bytes": 4641
      },
      "dictionaryRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
      "count": 26,
      "sourceRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/exams/original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
        "gitBlobSha1": "8f15e842a390907fda9122cf9cda4e6a42ec8317",
        "sha256": "b3c9531e8e32135316fed2bc4dd6b30a614a6b01644560364471b00d0de0d100",
        "bytes": 69724
      },
      "compactRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/data/item-4slot/original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.4slot.json",
        "gitBlobSha1": "663c8ee8554671b36c800e46f3d503e2977bd7fb",
        "sha256": "0680f3f61709c645c6a61d4ef014a5599e26d2d0ebda69cce570065b5c50fbb3",
        "bytes": 9213
      },
      "dictionaryRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "docs/architecture/4slot/term-dictionary-v1.5.json",
        "gitBlobSha1": "f25c84d3d8dd84f2987317c13f59a63aa20fd4f0",
        "sha256": "c78c8817264970fed79026bd76e31113f7f3d3e3e184b36bd6a03af05330b2be",
        "bytes": 311356
      }
    },
    {
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "count": 24,
      "sourceRef": {
        "commit": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
        "path": "archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
        "gitBlobSha1": "8d58d972e74dbf781f8a7588c2ebcbc978e9d476",
        "sha256": "8bf40a9c8c891ab34bf668fdd903aa8ada10108771f53a187f26e2210d68b492",
        "bytes": 77213
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
      }
    }
  ],
  "selected": [
    {
      "questionUid": "qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "sourceOrdinal": 8,
      "sourceQuestionNo": "8",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246.json",
      "beforeGitBlobSha1": "62f472da789f277afe9f6603058e048509ffd8ec",
      "vectorSha256": "7ece9382a2d167c5daa97e4cc959f853a6e379c09d11bc869ddf6d44abf5aa5c"
    },
    {
      "questionUid": "qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6",
      "sourceArchiveFile": "original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
      "sourceOrdinal": 6,
      "sourceQuestionNo": "6",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6.json",
      "beforeGitBlobSha1": "47d21b5867150454cf6f00fa6fc11c7f0d85bc3c",
      "vectorSha256": "e49e55767cce8325583564cbd76cd1445f71c19312467a60d10c0ee59a3bd6c9"
    },
    {
      "questionUid": "qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3",
      "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
      "sourceOrdinal": 19,
      "sourceQuestionNo": "19",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3.json",
      "beforeGitBlobSha1": "e9c235775dd2b66cdbb91f75a03ebb6339fb5acf",
      "vectorSha256": "a2b79a4f214e12a61b676e68fb339ecbff708331b80ff86fb3c0d49006a4f635"
    },
    {
      "questionUid": "qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e",
      "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
      "sourceOrdinal": 18,
      "sourceQuestionNo": "18",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e.json",
      "beforeGitBlobSha1": "acd6443f3c167a6274b8f7ff46a71f58e1c959ac",
      "vectorSha256": "e0fadac57a25497634ad4e76f1572860799b1386caf884119c457dcb8a2188e9"
    },
    {
      "questionUid": "qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15",
      "sourceArchiveFile": "original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
      "sourceOrdinal": 17,
      "sourceQuestionNo": "17",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15.json",
      "beforeGitBlobSha1": "9bed94ffd50cd9a6ee4a739a786472567e8a002e",
      "vectorSha256": "fd34adb02c89406ceae43e6ad2ffe804820c91a45d6e222a4bf22c1445fef545"
    },
    {
      "questionUid": "qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140",
      "sourceArchiveFile": "original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
      "sourceOrdinal": 13,
      "sourceQuestionNo": "13",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140.json",
      "beforeGitBlobSha1": "30f89918905b9a4fdbc77ad0d817e071a8bab690",
      "vectorSha256": "2d2b128c9c2f900da053cf93977fbb0467e8c1907513adc7c8920dca50a97658"
    },
    {
      "questionUid": "qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",
      "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
      "sourceOrdinal": 6,
      "sourceQuestionNo": "6",
      "path": ".archive-meta-register/4slot-m1s2-problem-renderer-continuity/qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c.json",
      "beforeGitBlobSha1": "779fc4f6766d8b900408c7b0881ffcfd33f55a06",
      "vectorSha256": "56a2413062616754756dd4d17b6dc256654a7167b415e24cf924a9a24d767538"
    }
  ],
  "generatedPaths": [
    "archive/data/question_metadata.json",
    "archive/data/question_identity_map.json",
    "archive/data/svg-accessibility-index.js"
  ],
  "preservedNamedDebts": [],
  "sourceQuestionCount": 121
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
function need(ok,code){if(!ok)throw Error('M1S2_SCOPE_'+code);}
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
    e.ARCHIVE_M1S2_GATE_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
  const event=JSON.parse(fs.readFileSync(e.GITHUB_EVENT_PATH,'utf8'));
  need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
    event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
  need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
    e.GITHUB_JOB==='m1s2-existing-authority','OPS_RUN');
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
    sourceQuestionCount:121,selectedQuestionCount:7,outsideQuestionCount:114,
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
    const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'M1S2_EXISTING_AUTHORITY',
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
    const work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'m1s2-authority-scope-'));
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
        (/^docs\/operations\/m1s2-problem-seven-ui-26fc-20261116\//.test(pathname)||
        /^docs\/operations\/middle-current-ui-26fc-20261117\/run-44015662986\//.test(pathname));
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
      // Explicit holds are read only from these exact five compact files.
      for(const it of compact.items)if(it.registrationHold)for(const ref of Object.values(it.registrationHold)){
        if(ref&&typeof ref==='object'&&typeof ref.path==='string')copy(ref.path);
      }
    }
    need(states.length===121&&new Set(states.map(s=>s.questionUid)).size===121,'SOURCE121');
    const selected=new Set(CONFIG.selected.map(s=>s.questionUid)),allUids=new Set(states.map(s=>s.questionUid));
    for(const item of CONFIG.selected){
      const join=states.filter(s=>s.questionUid===item.questionUid);
      need(join.length===1&&join[0].sourceArchiveFile===item.sourceArchiveFile&&join[0].sourceOrdinal===item.sourceOrdinal,'SELECTED_JOIN');
    }
    const outside=states.filter(s=>!selected.has(s.questionUid));need(outside.length===114,'OUTSIDE114');
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
    report.actualBaseline={index:currentInputs.get(INDEX),sourceRows:121,selectedRegistered:0,selectedPending:7,
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
    need(relevantFiles.length===5,'ACTUAL_FILES5');
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
      technical.servedFiles.length===101&&technical.mirroredAssets.length===92&&technical.studentFontResources.length===38,'CAPTURE_SCOPE');
    queueDoc(CONFIG.rawTechnicalRef);
    const data=new Set(CONFIG.generatedPaths);
    // Match the original M1 live-input boundary exactly. Other captured image
    // rows stay immutable evidence; each owned current source/asset is already
    // authenticated by the complete seven sidecars and official verifier.
    for(const ref of technical.servedFiles){
      immutable(ref);
      if(!data.has(ref.path)&&!ref.path.startsWith('archive/exams/')&&!ref.path.startsWith('archive/assets/images/'))live(ref);
    }
    for(const ref of technical.mirroredAssets)immutable(ref);
    for(const ref of technical.studentFontResources)live(ref);
    for(const key of ['manifestRef','checkerRef','captureHelperRef','surfaceHelperRef','fontLicenseRef'])live(technical[key]);
    while(queue.length){
      const ref=queue.shift(),doc=JSON.parse(immutable(ref).toString());
      for(const nested of refsIn(doc)){const normalized=declared(nested);if(uiDocument(normalized.path))queueDoc(normalized);}
      need(queued.size<=96,'DOCUMENT_BOUND');
    }
    checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX&&!candidateBytes.has(x.path));
    const outsideSame=index=>{
      need(index.counts.files===5&&index.counts.items===121&&index.records.length+index.pending.length===121,'RESULT_DENOMINATOR');
      need(index.records.every(r=>allUids.has(r.questionUid))&&index.pending.every(r=>
        CONFIG.groups.some(g=>g.compactRef.path===r.path)&&Number.isSafeInteger(r.ordinal)),'RESULT_SCOPE');
      const now=outside.map(s=>stateOf(index,s));
      report.lastOutsideCheck={phase:report.phase,expectedSha256:sha(stable(actualOutside)),observedSha256:sha(stable(now)),
        changed:now.flatMap((row,i)=>stable(row)===stable(actualOutside[i])?[]:[{questionUid:row.questionUid,
          expectedWholeSha256:sha(stable(actualOutside[i])),observedWholeSha256:sha(stable(row)),
          expectedRegistered:!!actualOutside[i].record,observedRegistered:!!row.record,
          observedPending:row.pending.map(p=>safeReason(p.reason))}])};
      need(stable(now)===stable(actualOutside),'OUTSIDE114_CHANGED');
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
    report.existingRegisteredAuthority={verified:7,route:'official build -> m1Problem.verify -> prior REGISTERED/source/MD/ID/vector/original review/current UI guards',
      coreGitBlobSha1:CONFIG.codePins.find(p=>p.path.endsWith('/m1s2-problem-renderer-continuity.cjs')).gitBlobSha1,
      newFinalQaNativeApprovals:0,newSemanticApprovals:0,newFourSlotVectors:0,
      namedAuthorityDebtsPreserved:CONFIG.preservedNamedDebts};
    report.consumer={selected:7,queries,officialVerifyStatus:verified.status,officialScopeVerified:verified.verified,
      pendingPreserved:verified.pending,outsideWholeStateSha256:sha(stable(actualOutside))};
    phase(report,'COLD_CHECK');
    const privateIndex=file(fixture,INDEX);fs.chmodSync(privateIndex,0o644);
    fs.writeFileSync(privateIndex,JSON.stringify(after.index)+'\n');fs.chmodSync(privateIndex,0o444);
    const cold=builder.run(fixture,{check:true});
    need(cold.changed===false&&cold.revalidatedFiles===5&&cold.reusedFiles===0,'COLD_REPLAY');
    report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,
      counts:cold.counts,indexSha256:cold.indexSha256};
    phase(report,'SIDECAR_DELETION_REFUSAL');
    for(const rel of candidateBytes.keys())fs.unlinkSync(file(fixture,rel));
    const removed=builder.build(fixture,{previous:after.index,reuseCache:false});
    observedStable(removed);outsideSame(removed.index);
    need(removed.index.records.filter(r=>selected.has(r.questionUid)).length===0,'DELETED_CLAIM_REGISTERED');
    for(const s of states.filter(s=>selected.has(s.questionUid))){
      const row=stateOf(removed.index,s);
      need(row.pending.length===1&&row.pending[0].reason==='M1S2_PROBLEM_CONTINUITY_CLAIM_MISSING_OR_MIXED','DELETE_REASON');
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
      scope:'five immutable source banks; declared evidence only; no global outputDigests recursion'};
    report.phase='COMPLETE';report.status='PASS_PRIVATE_SCOPED_EXISTING_AUTHORITY';
    report.actualMainRegistration='NOT_PERFORMED';report.sourceApprovalMutation=0;
    writeReport();
    console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,selectedExistingAuthority:7,
      selectedConsumer:7,sourceQuestionCount:121,outsideWholeStatePreserved:114,coldChanged:false,deletionRejected:7,
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
    else throw Error('M1S2_SCOPE_UNKNOWN_ARGUMENT');
  }
  need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
