// Test-only observer. It never authorizes current metadata production or source release.
// f9e49a0 is the completed actual writer 43988393301. This fixed issued snapshot
// authenticates retention; the original Native and planQuestion still own current reuse.
"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const SvgIndexContinuity = require("../../tools/4slot/existing-vector-svg-index-continuity.cjs");
const ExistingVectorUi = require("../../tools/4slot/existing-registered-vector-ui.cjs");
const SVG_INDEX = "archive/data/svg-accessibility-index.js";
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const ACTIVE_INDEX = "archive/data/meta-foundation/canonical/registry_index.json";
const FAMILY3_UIDS = Object.freeze([
  "qid_v1_3c72535bb4d43798192918e723d32bd646b2415bde8c5e8ad872b445496b7bfd",
  "qid_v1_76b2be613350f59166e128170c6f38b6150078c9ed44e727733d5de0bbf76942",
  "qid_v1_9a0686ad7215cc2afff66c158131fd343a64bd2111f30341df6b8383aaba1b7c"
]);
// Historical MD/ID are authenticated as streams; no old database is installed
// over the current selected rows. Only immutable digests may be memoized.
const STREAM_GIT_PINS = `const {spawn}=require("node:child_process"),c=require("node:crypto");
const expected=Number(process.argv[2]),s256=c.createHash("sha256"),s1=c.createHash("sha1");
s1.update("blob "+expected+String.fromCharCode(0));let n=0;
const p=spawn("git",["cat-file","blob",process.argv[1]],{stdio:["ignore","pipe","pipe"]});
p.stdout.on("data",b=>{n+=b.length;s256.update(b);s1.update(b)});p.stderr.resume();
p.on("error",()=>process.exit(2));p.on("close",code=>{if(code!==0||n!==expected)process.exit(2);
process.stdout.write(JSON.stringify({gitBlobSha1:s1.digest("hex"),sha256:s256.digest("hex"),bytes:n}))});`;
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const same = (a, b) => stable(a) === stable(b);
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const pins = bytes => ({ gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length });

const OBSERVATION = Object.freeze({
  "anchor": "f9e49a0e0c18f18c63f31d7547bd504f07a821c6",
  "observed": "735596ae7fdf37e920569271def0c2bc4add6f86",
  "served": [
    {
      "path": "archive/engine.html",
      "before": {
        "gitBlobSha1": "905952ae39138e1f6dc0aa2d7c7c8a64403f527b",
        "sha256": "a963c562478b96f7f9d8ae09ad6e5c85b3262296d734e7abd001836e1c3f317b",
        "bytes": 201060
      },
      "after": {
        "gitBlobSha1": "226342544e896cd6a6f35aa946947b89ef3c893e",
        "sha256": "671f89999fe07b0f5695bb088ef9d262d7d2da95947689117241bb6f3b633ce5",
        "bytes": 196085
      }
    },
    {
      "path": "archive/screen-runtime-adapter.js",
      "before": {
        "gitBlobSha1": "3d8f3159934c99637c4df893649adbc331065d96",
        "sha256": "2834bd3d0f3b40264921e15a85840df3d2374c7fcc6158844ce12883fb7cdd93",
        "bytes": 52980
      },
      "after": {
        "gitBlobSha1": "fb0ee7afc7eed48b30975874c5536eb283f308c9",
        "sha256": "ed0b267dc3b27675c2c0ed0aa985991a0aad3d3863ce5bcd43f0acb28033d709",
        "bytes": 53393
      }
    },
    {
      "path": "archive/render-feedback.js",
      "before": {
        "gitBlobSha1": "d1dd28351e42c887269744fa127f5979b81f213c",
        "sha256": "a55be90c452de08090ba648c1e8150f6fdecbfc9e10a9bd2e1ed59ccad727052",
        "bytes": 7419
      },
      "after": {
        "gitBlobSha1": "bba4a0a028b08260de01ae66a936dd9b77a849af",
        "sha256": "324177edefdcb996b4717a7853fc8bd542ac98098e3c6b8eabd42124eb424631",
        "bytes": 7461
      }
    },
    {
      "path": "archive/css/js-archive-theme-override.css",
      "before": {
        "gitBlobSha1": "930e73b8d48bb793d5ec4cc7effabd6eef40dd4f",
        "sha256": "4dfc5092355c90859e75f62a0fb0d7bf150c54202ce51d2cb5a48951adb2b7a2",
        "bytes": 15557
      },
      "after": {
        "gitBlobSha1": "5e168d7e3753639e8a0b92753b0797bef0d9d3e2",
        "sha256": "205a1d456fc21ee150550a61f1959b027a4fcd22f20e623471b637481b4702a4",
        "bytes": 13947
      }
    },
    {
      "path": "archive/archive2-reader-controls.css",
      "before": {
        "gitBlobSha1": "66a223f9e2c737a4caa0bd9b2fd0710ad5b4ee49",
        "sha256": "24631292b2c7a8831fd6cb01de7eb4662d2c69d3c6542d380a5abaa0c43bafe3",
        "bytes": 3687
      },
      "after": {
        "gitBlobSha1": "8bbb2202ba3d8c04aa6f7867031fbbebff0c511d",
        "sha256": "5e53a4a96dcf8e1e08eb8e55096ef61299946269aa8d3b33b4d35ad604c022eb",
        "bytes": 4905
      }
    }
  ],
  "source": {
    "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "before": {
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "after": {
      "gitBlobSha1": "2b9a077f00f0fc3ec6ee5c03ae5037076ecf88cb",
      "sha256": "11b02d6fd4916e30dbbcd0f98b0386388f44d9980d76b8c02bf5047058f529ae",
      "bytes": 66844
    }
  }
});

const SOURCE_ONLY = Object.freeze({
  "schemaVersion": "EXACT_E017_Q11_Q15_SOURCE_PRESERVATION",
  "source": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
  "expectedQuestionCount": 23,
  "child": {
    "requestId": "m2s2-image8-source-preservation-20261116-01-e017-finalqa2",
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-image8-source-preservation-20261116-01-e017-finalqa2.json",
    "bytes": 17192,
    "sha256": "dde6864582f6718194bc698ec662ed2fe38431820357ccc70fea5b59978790b5",
    "gitBlobSha1": "604545637d955a2fe5ad32efcd441bfe2cbf9a66"
  },
  "prior": {
    "requestId": "m2s2-native78-current-r9-20261116-20-e017",
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-native78-current-r9-20261116-20-e017.json",
    "bytes": 22923,
    "sha256": "ebaebf777097b20355ae68591a49f91fb80844001fb9904f865c19b358c2c56a",
    "gitBlobSha1": "b12b32003ee71b63ddbdc2fb86ba2523ed4a53fd"
  },
  "priorSource": {
    "gitBlobSha1": "05cf74896963b16a7e6ecb4c0a9e0cfafb604a76",
    "sha256": "f881c6bb1a663ba2a48959234b4e4718e688cbecf67a51bc540b4f95bf0ea353",
    "bytes": 66605
  },
  "subjects": [
    {
      "questionUid": "qid_v1_061f56b801d84fca7fb2dccabc0f36cd424db51a71705aaf9907bbe01c0206a4",
      "sourceOrdinal": 11
    },
    {
      "questionUid": "qid_v1_4ad4963857cd28e9d6dc520af77e1d6ef455036cb0da5de3f01f20341805078a",
      "sourceOrdinal": 15
    }
  ],
  "changedSourceOrdinal": 2,
  "changedSourceFields": [
    "image",
    "imageAlt",
    "imageSize",
    "layoutTag"
  ],
  "currentRejection": "NATIVE_SOURCE_PRESERVATION_REVALIDATION_FAILED"
});

// These later source bytes are an observed blocking condition, never a source
// approval. The exact edition and the complete changed-field inventory are fixed.
const SOURCE_EDITION_2372 = Object.freeze({
  "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
  "pins": {
    "bytes": 66857,
    "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
    "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f"
  },
  "changes": [
    {
      "sourceOrdinal": 2,
      "fields": [
        "image",
        "imageAlt",
        "imageSize",
        "layoutTag"
      ]
    },
    {
      "sourceOrdinal": 6,
      "fields": [
        "content"
      ]
    },
    {
      "sourceOrdinal": 17,
      "fields": [
        "solution"
      ]
    }
  ]
});

const RHS_ONLY = Object.freeze({
  "schemaVersion": "EXACT_E017_Q2_ISSUED_RHS_SOURCE_BLOCK",
  "questionUid": "qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9",
  "sourceOrdinal": 2,
  "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
  "expectedQuestionCount": 23,
  "requestId": "m2s2-display21-current626-e017-existing-rhs1-20261116",
  "requestSha256": "fb902c9c631d8cfcc848dd544ebfb3fad6371534c71eb36d3431b8411bb1c176",
  "receipt": {
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-existing-rhs1-20261116.json",
    "bytes": 26178,
    "sha256": "5aa6d34e837537778e9f228f889f512658abc7f2cdfe5e7cf6deaae5b67ca740",
    "gitBlobSha1": "310ad0cb7f1ccbba4835c961360941661513181c"
  },
  "sourceBinding": {
    "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-existing-rhs1-20261116.source-review-binding.json",
    "bytes": 9069,
    "sha256": "b5586ffc169d8309a7e1fd917b8ccebe1d3cbc45512abd68b08c75551b6859a3",
    "gitBlobSha1": "b0f2b4244e08e3cc9b561f1a73e51f9517fcb273"
  },
  "reviewBinding": {
    "commit": "3f7430d37ca2257ede52175baa94c160c0125f7a",
    "path": "docs/operations/m2-e017-rhs-continuity-20261116/final-ui-binding-r1.json",
    "bytes": 6009,
    "sha256": "12084de0ea2681bb6cf78a6ec6f60b00eb79fa6605b9b48dbf7dc8a1003dcb6d",
    "gitBlobSha1": "6235ee120366c52d2e6035dfba8a9431a5104fca"
  },
  "nativeSourceRef": {
    "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
    "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "bytes": 40638,
    "sha256": "ec693aa011e6a82f41c63f640666d061c2751a972abfb730ca91e954565ad9c3",
    "gitBlobSha1": "6a96cbd5c2671c61a63b0e964777ec6d6ac3369d"
  },
  "sourceReviewSha256": "cecf291e5adf9ccb8fc84a1539620a997db3882c3bab167fd3e74ae7d17a04bd",
  "typedProofSha256": "010cd67a316b38b058aee0949f6cea26e55dda4b964b14aacd9547e79445bde5"
});

// Fixed actual readonly run 44031397094: all11 Native null, nine
// CANONICAL_LABELS_MISSING and two ID fingerprint refusals; no generated final.
// This records retained approvals only. Other no-binding receipts remain closed.
const ORIGINAL_RECEIPT_BLOCKS = Object.freeze({
  "schemaVersion": "EXACT_ISSUED_ORIGINAL_RECEIPT_SOURCE_BLOCK",
  "observation": {
    "snapshot": "b4dc3bf65c37106ef2661173a0d1b83dc0e0417b",
    "runId": "44031397094",
    "job": "observe-current-main",
    "report": {
      "gitBlobSha1": "3806aeae18d0112ad93b848df2411c9775d690b6",
      "sha256": "1643e7eb9c55739ff1933addcb8a9a00e6b2e1e8fca41e0b77c3ee38cc993b3e",
      "bytes": 57929
    }
  },
  "profiles": [
    {
      "key": "E034_ORDINARY_FINAL_QA_10",
      "requestId": "m3s2-e034-residual-exclude-q22-d5-26fc-20261116",
      "source": "original/middle/m3/2final/22_팔마중_2학기_기말_중3_기출.js",
      "expectedQuestions": 25,
      "receipt": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e034-residual-exclude-q22-d5-26fc-20261116.json",
        "bytes": 177976,
        "sha256": "9c93ebc1a234322a2f166a973401124de385f1f816c77b4f4d62eb825e9020f2",
        "gitBlobSha1": "17af77b58b75ecfe11bab8f08fe0771a06b0ad25"
      },
      "issuedSource": {
        "bytes": 60370,
        "sha256": "dc9825f384aae4907f9b5f7c305f89a64a5146dba4ec2c7513954c66b8d5da4d",
        "gitBlobSha1": "8108aa4a2cf717e85b45c5f4c27cdf74eca77c3f"
      },
      "observedSource": {
        "bytes": 60399,
        "sha256": "95b0866ca1c8b1aa99e79cffc7caa386a999106f8f25606122bc1e263347eac4",
        "gitBlobSha1": "66e8619639246f6d37d3042501eeeb7d29d447d2"
      },
      "changes": [
        {
          "sourceOrdinal": 3,
          "fields": [
            "solution"
          ],
          "beforeWholeSha256": "c51d0943e0723590164ec7b56479d4ebd31660a265a4e98811af443689a0f6c7",
          "afterWholeSha256": "1cadc29d1b05fe51873319edf2bf16e27f8089722485b67457c298444420f9bc"
        }
      ],
      "subjects": [
        {
          "questionUid": "qid_v1_a26c7d6f842a730adcaa3d42d71cbe72075494e97bab0468f3a4203f82bee4d6",
          "sourceOrdinal": 1,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "0596a35262a5c52fb7b6e6bef60e90de6ce9ee6cf7f6576bfcaf5a2f0974784a",
          "identityWholeSha256": "fc41c9a0e80a3d8375827a5b44d021f8f4ae92b30699cb02f9bb418c5ecd677e",
          "runtimeWholeSha256": "9d67e1e0fcaab0f67817bf33f8b66f34ab99f833489142f719e48b1d967c40da",
          "currentQuestionWholeSha256": "e1dd9e62300f89f6fb78055e9ac6e3eda0bba0fbb125221e5e55a564a05fdcb9"
        },
        {
          "questionUid": "qid_v1_7066d139739ae9c4b2fb16b4a772e952fa8f6143475934c317643980919abc8b",
          "sourceOrdinal": 2,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "4788f859335b18e5d8e6c81d4e23d75f88e3661c22ed0aac12f8168ca997e3c2",
          "identityWholeSha256": "bbfd9dbcf54816cab0a2f9303c32d701492255415546cbb81f58ea9ced9001e4",
          "runtimeWholeSha256": "dce1378c64d73bc9983b4c8cf79be1e6842e07e528abf4c24262300320d9d19e",
          "currentQuestionWholeSha256": "b232c07d77a71acb797d9581e94a83414a1993326edd206661a6e3da0e1146b0"
        },
        {
          "questionUid": "qid_v1_5b5b90743fb6bec35ef5986475b04e9a14a689b472da9757ccfa92732b4678c0",
          "sourceOrdinal": 3,
          "expectedPlanReason": "IDENTITY_SOURCE_FINGERPRINT_MISMATCH",
          "metadataWholeSha256": "af40af24bb2b461af8e6a63a00129e12c836e8b6c6b8847a1fb53b940438b761",
          "identityWholeSha256": "ae12dd5efb98db394aea419feb415dd57acd72823ac8dcb6ad18f947b9638e9d",
          "runtimeWholeSha256": "575e9b659b3cb85095399513c69656c8e9bfaf25d4e976d703da7178fe19848b",
          "currentQuestionWholeSha256": "1cadc29d1b05fe51873319edf2bf16e27f8089722485b67457c298444420f9bc"
        },
        {
          "questionUid": "qid_v1_0bdbb9d2ce4f341a9d117bcf188d05e143790a9637d0a50d598f0e15dbafe4a6",
          "sourceOrdinal": 4,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "73fec5b5dcb59a18ae8b7d7926c3f6cb3c85388ec2697b115352d2fc2372e05d",
          "identityWholeSha256": "77d6c725f88bb91e403be2b9d1b3f49ab5a2088ead927aaaef9112fde63a1189",
          "runtimeWholeSha256": "2195492df667c5cf9ee956792cb4597ef5c6cc95d65a0eef92e36d39a7f9ca12",
          "currentQuestionWholeSha256": "d804b3c334a3553b7f4f2ac50289852525d8407afd53167d638025c634f48203"
        },
        {
          "questionUid": "qid_v1_7c79820d88c11aef337163cec75f347205403c7f8e7b67035dcc91e0e02a0122",
          "sourceOrdinal": 5,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "85e88f553c3084f952c07b02ef07b8898b2d3e041059bcb3abac5a7c52b0a839",
          "identityWholeSha256": "1b098d99d3dfb0786e04eed52140fb25eff072f5174a58b0db3726316d79f9fd",
          "runtimeWholeSha256": "f21bb0d0e785c18cf9bd456eec2db8b6faf209701ad940041a7a04fbd9c1783d",
          "currentQuestionWholeSha256": "1c3d078dce9589ffcfc9bbc14db0c47a079bee93443b8cefa4a46a8a49343440"
        },
        {
          "questionUid": "qid_v1_c32668aa2b2154aa78729796280b217d09bd39192ef30100931b02dd96efc488",
          "sourceOrdinal": 6,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "4657cac88606bc251193938ddcf2889fdce15007a7e429504c1c2c843419e545",
          "identityWholeSha256": "196c3c6fdc4601c399cfe01d828195b7e0831e31ac885f588c25822411a2bb56",
          "runtimeWholeSha256": "b7c4f3a6d6d5b99829c3d4382b927cd6f59397c9472c05307fe5661b4f135d78",
          "currentQuestionWholeSha256": "7c17e52e1beca34a8b640a1228f4b39af67c2cfb8d42f098ebcc8e40883abc13"
        },
        {
          "questionUid": "qid_v1_55930b3d0fc2a8cce684c54cc2471649b40dbba7fff48e8cc721e86f82290d41",
          "sourceOrdinal": 8,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "75ba0228798ae988162cbbe14656d9cea5f7ba2273a52e48ed15e99014b2bc6e",
          "identityWholeSha256": "0b6447fc1c480f561243ec7b2a9ae547b7d732ffea56a5df95d87308125308c7",
          "runtimeWholeSha256": "e5026a91a2e735ecdd4f051da874956960203d9ebbc5cb868294c9da007c6711",
          "currentQuestionWholeSha256": "4f548d427260cbb3e1174ef07b9d67c4b7ebe7792fb6938eb5311d760ae9beb0"
        },
        {
          "questionUid": "qid_v1_7a5833ac5d37d022a6e5491e026b6905e36ce9af61437cd7e93700646f61c876",
          "sourceOrdinal": 9,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "68a2d72d85b048054e7a8e04130f076875bf47a31a50fe688c0f34cc6e957e6f",
          "identityWholeSha256": "6d012ba8d0db31eac1bb6c34e30b16a3004a6641d38eeb968b491739cc139cdf",
          "runtimeWholeSha256": "b38dc1396d3f54fda2673b32d9cd04eb0f264c50a5084f263fd635ec28ba943a",
          "currentQuestionWholeSha256": "ed9e3085b0c5c8469b29230b4aee35e2b3ce051f6050007258f3189f2003d0c9"
        },
        {
          "questionUid": "qid_v1_c0e1f59be8499e6f2f4fd0d4bf07911c922b5ab3861139c80cd91fd8d6dff631",
          "sourceOrdinal": 10,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "c65279e0653a8ddf4422808e2e18214ddb45b51bc7255e57d595b5d7d796cce5",
          "identityWholeSha256": "10714b9fb1ffb28ec996b19f2d4fcd7bba0fb25161722f0ed79961e56ab08f96",
          "runtimeWholeSha256": "f603c9d61551d9499c523d1c33bf7fe9bbd675a09b3c8e418a93a4d31209b081",
          "currentQuestionWholeSha256": "8cc9edbd862028b02898e4ae363bdff5b74cab9834a49e679c487aabc0a11d1f"
        },
        {
          "questionUid": "qid_v1_64661daf2fea0bc0430a163d82c8fbb7340274320504caa149dc5927fd0411c6",
          "sourceOrdinal": 23,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "e1642b2941ee0e101616b4e3595e9eea5e84852036e248514eb01534c53795d5",
          "identityWholeSha256": "4a1c5418bc2a0c2606ff05174f4338dcd341837af9b37113d6c8383f7805fb61",
          "runtimeWholeSha256": "e61f1cc46abc51f8acd0288669d214d53402654fcaf0e1f8e00138d1df0588d2",
          "currentQuestionWholeSha256": "224fe7d6e82869eb4a2841214049660b3db8847dafcec31fca1a2a6b19f2f7e8"
        }
      ],
      "originalSources": [
        {
          "bytes": 51120,
          "sha256": "2ca0e2ffb3ed82fca6ff7a679cf9422f90be354c76837e4806b9676a48fbf17c",
          "gitBlobSha1": "6b30a6ed97c0e44560ff1bdedcd719224f4f2e66"
        }
      ],
      "nativeReview": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "docs/operations/m3-s2-meta-full-20261114/exams/E034.meta.json",
        "livePath": ".archive-meta-register/evidence/m3s2-follow428-native-20261115/E034.meta.json",
        "bytes": 186411,
        "sha256": "c82745c755f3c7ba4dfb22a2bbfeb9eb298c777057c16df5de3f4e64f94c941e",
        "gitBlobSha1": "85c5b82703c539380279fa7b9d3beb9651f12c11"
      },
      "sourceReviewSha256ByUid": {
        "qid_v1_a26c7d6f842a730adcaa3d42d71cbe72075494e97bab0468f3a4203f82bee4d6": "9f9a09b63c21e2f355ea10950d3878f5d2ae358b8824a18c71558852709c1fcd",
        "qid_v1_7066d139739ae9c4b2fb16b4a772e952fa8f6143475934c317643980919abc8b": "71250db66ad9174e47a664b93e43496c9b97b376ba6bd8681ee67002470482dc",
        "qid_v1_5b5b90743fb6bec35ef5986475b04e9a14a689b472da9757ccfa92732b4678c0": "1241bb402945608174facaa7de1504892c6e7412811e68109629a1d57a4f6350",
        "qid_v1_0bdbb9d2ce4f341a9d117bcf188d05e143790a9637d0a50d598f0e15dbafe4a6": "6f40ff49a2dbdf901b9fe37fa81da32bf0558d889d6eca4b70d0bbf111c5ecf8",
        "qid_v1_7c79820d88c11aef337163cec75f347205403c7f8e7b67035dcc91e0e02a0122": "4602a2e95bd45c137c67b3da580dfe93eb15468fe50262bb38b4db69069e52c8",
        "qid_v1_c32668aa2b2154aa78729796280b217d09bd39192ef30100931b02dd96efc488": "3b5742fec5bf9a980997c2b60273592248ae0b857daebe7605b080ce6aec4f13",
        "qid_v1_55930b3d0fc2a8cce684c54cc2471649b40dbba7fff48e8cc721e86f82290d41": "2acd72b5199d908859b26c6c46e53cfcb44b42add4ac237eb9ce783a531013f3",
        "qid_v1_7a5833ac5d37d022a6e5491e026b6905e36ce9af61437cd7e93700646f61c876": "d163761e0e0654c198c7d1db69c27e851213357332cf7211efa9c43a97a667d8",
        "qid_v1_c0e1f59be8499e6f2f4fd0d4bf07911c922b5ab3861139c80cd91fd8d6dff631": "8c487a0d51af516a7b09a2194545174ed456ffc651cae1a17012183239b7cff9",
        "qid_v1_64661daf2fea0bc0430a163d82c8fbb7340274320504caa149dc5927fd0411c6": "d951c04a5ca322dd9e4d0c68714a9740c205249b46e45423a178df4a165e7117"
      }
    },
    {
      "key": "HYANGRIM_Q5_SOURCE_PRESERVATION_1",
      "requestId": "m2s2-closeout-20261115-E013-Q5-preserve",
      "source": "original/middle/m2/2final/24_향림중_2학기_기말_중2_기출.js",
      "expectedQuestions": 24,
      "receipt": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-closeout-20261115-E013-Q5-preserve.json",
        "bytes": 9339,
        "sha256": "4f091bd3276b2b014468a91e3540b2a93d39a12249090dac4c04414d63844c74",
        "gitBlobSha1": "061942ba4cdc674e9147885e392d63ffd8343843"
      },
      "issuedSource": {
        "bytes": 58496,
        "sha256": "a4748d233f9150752ac0c6d2c11dd576f51871310689e698f9076ff6129cf44e",
        "gitBlobSha1": "dc90dee3aa1373c5842241324db00a3753a80cfd"
      },
      "observedSource": {
        "bytes": 62388,
        "sha256": "12fe8f1e2f4970a8c9cae76b0f558e80b92cda4258c94d300afe30c6e638fd23",
        "gitBlobSha1": "2e5c6dfa390ff329c4982e3dfc5b3df3429c2b05"
      },
      "changes": [
        {
          "sourceOrdinal": 1,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "f484cf3290b502178c9f95c2cd448faa49ab57326e3c1c116a6932a07561de04",
          "afterWholeSha256": "57d991843dbd3d98b982284b1d1527797bb962388af01dcbcf7182c33d3e5775"
        },
        {
          "sourceOrdinal": 2,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "6d3cdfc60670ed159c0f066f018b6562e7651e1ed1199ad2ea87e9b34df7e48f",
          "afterWholeSha256": "73d0bf9758bcef7c5b7ef7e4fa7b580cc291305b0a6f223fbe4f256149e2091b"
        },
        {
          "sourceOrdinal": 3,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "882f4977b6d74537b51335fc91a484ef0a42ad68356181fb14624e9fc49f819c",
          "afterWholeSha256": "305ae9ccb4eb012f511209d41dd98dec4fded0ac9059552b8cdae42be3c37f30"
        },
        {
          "sourceOrdinal": 4,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "ed3a63354b0ae128bfbda3746b28007ea957d198ead0570b89423d0ad716dd54",
          "afterWholeSha256": "b9cfe31bb984119cd83d76acf6487df6b4aa8e5e4f3c50163e485083248a0b17"
        },
        {
          "sourceOrdinal": 5,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "ace73e6d31df907896be57cfcf46ad2573a77b14c80a5a296018833c9cb1c4f9",
          "afterWholeSha256": "79d8fccf30a82dc8fe8dc6743ada631d4f48b4e6eb7b604c5e665394ec01155e"
        },
        {
          "sourceOrdinal": 6,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "dda244e16eae0aba6fe899a9790b29b9a1396d76e649fda9f71e81819fcabb20",
          "afterWholeSha256": "905ee5dd19e62c38ee763bff889c98b46cd6499ab4c3d38a00433e4d55a12950"
        },
        {
          "sourceOrdinal": 7,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "6db57fdd0eea2df287e82dfcdd499259d4c20411fac1c2f71221a483fa122154",
          "afterWholeSha256": "19473846101b016d6727866e6429cd2d06ef55cd33819c09a370d91b30798d38"
        },
        {
          "sourceOrdinal": 8,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "4a706817854a6507ec21ba84e0fe980e2b45e4be95e1fe61972da139d918908b",
          "afterWholeSha256": "277bb376205158fa744e6e0a30a325a7c4460be438a64e52ac0fbb5f695679d3"
        },
        {
          "sourceOrdinal": 9,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "f8101bb993e81e939adccc3d7ae67c4097131156753cd101b6cd46d518d4e2d2",
          "afterWholeSha256": "ae8e285bda7c56497f00b68fac14627596c4ef62c45731dbc93c97535214fd43"
        },
        {
          "sourceOrdinal": 10,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "5fbbad3688426ad797669f9a2a2db1242c4181396d86058177ec9415fea86ed9",
          "afterWholeSha256": "05e14c6dc9ea24ac460e02c3e4c83c09c5e5c42c2c8d88b35e2a5194875ac1c3"
        },
        {
          "sourceOrdinal": 11,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "346d0876afec76f3d90b6a87517e6eefa0c36032503d8e821bf70686bf24f963",
          "afterWholeSha256": "c252a1541a4cbb55a86cccd2cddcea605639c9668e68e3929f30e9ea35624056"
        },
        {
          "sourceOrdinal": 12,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "686f0f9f219283e878b01847de4ef0b9c0f960945648bc175f1a4cade5900dca",
          "afterWholeSha256": "fc8a5b1c4a265e91dcd6e1cc0312cd1f731033c86b1e0d5160a99a0360bd8417"
        },
        {
          "sourceOrdinal": 13,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "eb93a6dc8c02bc792dbe63a0ddebaa262d201207660457e7a3d768b2c6f9517d",
          "afterWholeSha256": "eeccbcda9bfc0dde1723852a2ab8db7dc401c00e9827cf379e872f8368e23f40"
        },
        {
          "sourceOrdinal": 16,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag",
            "solutionImage",
            "solutionImageAlt",
            "solutionImageCaption",
            "solutionImageSize"
          ],
          "beforeWholeSha256": "06b85b478f01d17ce61266cd0a441e624ff14b70630a6a5d68046f0b7013afdb",
          "afterWholeSha256": "123bf0aea44e381a2d954e05dc866d9abfe0ebfe34eec0088bf7f0ff0fcdde6a"
        },
        {
          "sourceOrdinal": 19,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "5e1731b4c43afcb2e80d33fbe3a8f72b772a17b6c2edfd0b8c0e735e39d8dbc1",
          "afterWholeSha256": "3440cea7178c175cf6a8e7f0911cd50beab52bfc1b4db68463d384a83dc38fc2"
        },
        {
          "sourceOrdinal": 21,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "561ebc7c4ab929450be775ade1865f0a58253f383cd75b71eaf090a209004059",
          "afterWholeSha256": "728d5b8f49f9510db6220183daad4e36850f53f3251f93ce84267f882596e7de"
        },
        {
          "sourceOrdinal": 22,
          "fields": [
            "image",
            "imageAlt",
            "imageSize",
            "layoutTag"
          ],
          "beforeWholeSha256": "dffb7fc4b1032567b5ab43a01e7532729398ab7b1f97b455217b7383ee45b73b",
          "afterWholeSha256": "487ca175d2f5571c7a3623c69bee6590e6cfff6e6a79882d89367cc5c8b5d019"
        }
      ],
      "subjects": [
        {
          "questionUid": "qid_v1_f3fba2de253b38cab38675605796ab01f17928228c1a099b7ba27b4e0f6b1a6b",
          "sourceOrdinal": 5,
          "expectedPlanReason": "IDENTITY_SOURCE_FINGERPRINT_MISMATCH",
          "metadataWholeSha256": "13448c17f6da10d59f4f11c5aa8007b9248b97e2a30787aafb0a919724ac0ec5",
          "identityWholeSha256": "fe72b3e52a856840cc7c158dd1624447ae90488fc1c5ea7c89f84c1c6b0e8a1c",
          "runtimeWholeSha256": "a9d7597a67b56a113f6d0b8329450df6cdb86953ca34f4467b881c7310594f1d",
          "currentQuestionWholeSha256": "79d8fccf30a82dc8fe8dc6743ada631d4f48b4e6eb7b604c5e665394ec01155e"
        }
      ],
      "originalSources": [
        {
          "bytes": 53090,
          "sha256": "d124fc5e5bd036bacfec7f3cd290cafbfd41fcfaf21af07b76932df70a1a341f",
          "gitBlobSha1": "db4faa58133e8e3919ae21802bc0102aa100ae4a"
        },
        {
          "bytes": 53399,
          "sha256": "11ff710f7beaf7801952e66dc5016bea73e982f93414e5d7899e2804fb774918",
          "gitBlobSha1": "15ba5f4da8db32a7ec7d8219a0a1063a8db8cdeb"
        }
      ],
      "priorReceipt": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2-s2-partial-e013-q5-20261114.json",
        "bytes": 9347,
        "sha256": "1142df9a34c2970ff2b6d89cc496292e74538bb57e9f26cfd14cf2493dbf962a",
        "gitBlobSha1": "063f37d2fe3a161eaf16e6f90d9c795f574c3e12"
      }
    },
    {
      "key": "E006_ORDINARY_FINAL_QA_12",
      "requestId": "m3s2-e006-residual-current410-r8-20261116",
      "source": "original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js",
      "expectedQuestions": 23,
      "observation": {
        "snapshot": "90ba4c2c3ce042b0bee4d68588ce83aa37e3f95f",
        "runId": "44041254171",
        "job": "observe-current-main",
        "report": {
          "gitBlobSha1": "d4f20db9affab008ad98ace5cff40f6bacff990e",
          "sha256": "09d60da9a770ee2c3440612b12acf4746f7f5cadc8c33122a421518bbc24a87a",
          "bytes": 55235
        }
      },
      "receipt": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e006-residual-current410-r8-20261116.json",
        "bytes": 208512,
        "sha256": "73176562cdc8dd91b7025f23cd9d9595c5acbfa6470c3403876367b9f7068677",
        "gitBlobSha1": "253c5aeae229085d9bf6bb51942f114743981d44"
      },
      "issuedSource": {
        "bytes": 63775,
        "sha256": "c2a0244074bd4257961b5facb672786361ae88526c6b35f55beb3b1c595d93fb",
        "gitBlobSha1": "305e21cf2fb3155b46d3fa7937cde4e4c0e5de18"
      },
      "observedSource": {
        "bytes": 64226,
        "sha256": "b0e801cecba43ad4cffd2009a1a5cb1a5e533330481bfd24e9401e0d7480470e",
        "gitBlobSha1": "a06c36b865b617f8c327cc90e1f4a931668a3e19"
      },
      "changes": [
        {
          "sourceOrdinal": 3,
          "fields": [
            "answer",
            "content",
            "solution"
          ],
          "beforeWholeSha256": "9e4b23a6e4af7f4d98a02f0dedd506a3bd92b3f0d51856c053716d1e7b344ec3",
          "afterWholeSha256": "9b61d0d47383d73f5f09e45e6d9472231fbabaafee73891f2485eb8df06a5813"
        }
      ],
      "subjects": [
        {
          "questionUid": "qid_v1_1629824d0b99dd6df92f964bb2f7681caddfbfd33e01e5d02bf92163ea060cda",
          "sourceOrdinal": 1,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "1b0a4c316246ae9bb2af861345ee968a4c5af2637d1036a9bf6b5080a2fc5cc3",
          "identityWholeSha256": "2fda55d84515f6cb4647be55b79992f60f49a735fb858b454e0ddbaddf4fcfd9",
          "runtimeWholeSha256": "1ccc97ec1f7dc9c5d21a5e927fa78a3e6121ecea8df1081ba9a762f05071b8ee",
          "currentQuestionWholeSha256": "881bd58bfeedebfd455378b90752515806c725c44c91b06ee3f4744964e13cf1"
        },
        {
          "questionUid": "qid_v1_7716a1d4f757041ef0f10c447e3c22d4d1bbeee9d6b01c1cdf531f6ec9fb9c1f",
          "sourceOrdinal": 2,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "535b909d876f1b258aa1cf828039cfe3ca440140b435db68e8da1eedf0762249",
          "identityWholeSha256": "f6563076f880c2b04f16b50294c5a6137674c92c18d60206c8f90cbb956ebc68",
          "runtimeWholeSha256": "d914c929f414bbfb135ca9d0fd53b189fbf94a8a047167f77b0b11c3cde3139a",
          "currentQuestionWholeSha256": "103f39c23efc41dd28043295b10af6a921ac9b862e1a5fce2fb96bf1c56bcdee"
        },
        {
          "questionUid": "qid_v1_8da9c6b955714eada8c0673e9faff6d6c1b994ccde93ed478c74b726314d5d32",
          "sourceOrdinal": 3,
          "expectedPlanReason": "IDENTITY_SOURCE_FINGERPRINT_MISMATCH",
          "metadataWholeSha256": "e97c38b4f9e82b1b7aebd13ce1c4f895905d501d6424db75de06ec6ca5071baa",
          "identityWholeSha256": "a69ff87701146ba58077bfdfca8a09b742482f442bfc464f81aa66ce75995e91",
          "runtimeWholeSha256": "60330133912bc21e6393e37f2207651df40faa3ead9fd8a078603011c4d80cdf",
          "currentQuestionWholeSha256": "9b61d0d47383d73f5f09e45e6d9472231fbabaafee73891f2485eb8df06a5813"
        },
        {
          "questionUid": "qid_v1_c2f698969ecc2c3a25f4a02f14dedfdac862634ee41cfc129fc818430ad3fb9c",
          "sourceOrdinal": 4,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "64f6f4e6b21b31769c965a80f8e3699dbc58be709073c61f6203d8fb9a3874fb",
          "identityWholeSha256": "b2902d975f9be69e4cd76b519628f102621f7fde51de85fb987e5333be207c31",
          "runtimeWholeSha256": "82ac157d104f561c599cf5b95589749b3d0ef4dc0041b3be61ff8dd8e091399b",
          "currentQuestionWholeSha256": "4cd8b90c75bf8b28d6941d1135d82b8a3b584b1301ce9c75da7fe0bf20f70824"
        },
        {
          "questionUid": "qid_v1_4b65c4d5f07e51a20f54254f3cb58c9896ffb5937c786ce253157270ef683c1a",
          "sourceOrdinal": 5,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "04c892c6d909d7d74004427ce5a193cf2b2105758bc1180ad0e0a0e5573b36cd",
          "identityWholeSha256": "01f120c525f0d832f9ce23841b27d1a4867d7418c8a9154fb790eab7dacfd030",
          "runtimeWholeSha256": "861a4ea8a9737858a01e4da2c249898da1ca898fd847bdfc06dc787df835446a",
          "currentQuestionWholeSha256": "05a69be5f5aa3f668068fbca57e326e36115d312322d580c9d12ad8b7f289a1c"
        },
        {
          "questionUid": "qid_v1_12860943ddaef3358660134a0d8d5007891be0a15104be47196a1797e9d5cc61",
          "sourceOrdinal": 6,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "bbfdf7edd65876b63794fc5570291acda7bf0e0beddaaf4f7942e9ce8342df89",
          "identityWholeSha256": "760b5999bafe8d07ad7d446846cf19a331aec2a55229f030a0f07e85aab2b6cb",
          "runtimeWholeSha256": "3c32986bf41c3f0d3782244dcae31fb0da54d7156d9b8356fdeba2a38956ec1a",
          "currentQuestionWholeSha256": "8544cf9f41c2e2600f950ebbdbb4df1e1e5de538ef59bbf875d114f8de03ec72"
        },
        {
          "questionUid": "qid_v1_8c2f1c37ae92a5f8d9c4248d0b4488395355b22592f7956c514c7af797045a3e",
          "sourceOrdinal": 7,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "dd30d90fc33a1131af987054e9cbb0b2633cab6441b4169591e14cba8cbe7503",
          "identityWholeSha256": "2a323be5fe19d56f9d578e13be102a843b9aad2384ee8f1a9d8f6109ad59f656",
          "runtimeWholeSha256": "b00dd31549abc6e34eb6cd93bc5b2d55d0bfe4555614c5f9b6d67153a818aa58",
          "currentQuestionWholeSha256": "e2f93e1239d916ae609fe2591e105a0df4bd1ac37dbddc0cad90cc8c344e5df4"
        },
        {
          "questionUid": "qid_v1_006d3d7fb3c9f11a0355c15b8df9cc7ec43e9de53da5b4e7d3171318ff7e23d3",
          "sourceOrdinal": 8,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "97b0a8051bbc2bd40944caad64ca6e700e079a2e8e9379c7f3659defabb48595",
          "identityWholeSha256": "dbca474d6f08bfb044a22493a36ecb8741bae1bc4951f3bb44812f1120592246",
          "runtimeWholeSha256": "805624f706e71ee36cc4511bbc014e4858cf37a5864991d8d13e241e1d4b2998",
          "currentQuestionWholeSha256": "b99e57e6a75aca02c096ae218404ad7102caa7d9d7992b981d91bc93576e3f9b"
        },
        {
          "questionUid": "qid_v1_f02ca0c6d6f22a766861024269c0d890a68808e08b50949ab0ecc68d1d5268ed",
          "sourceOrdinal": 10,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "d775755247e7bc544d05e9db22d642441c49af7583f08e0d2af5823c224af42a",
          "identityWholeSha256": "1ee3fa6eff3d50b28d3cd85a8bd07a7cf232564ae72fbb87a60cbd5d8fa81e4e",
          "runtimeWholeSha256": "e7b9ee86d024202c307e862674c501acb86a416a830555a80e8db93bcb6586b6",
          "currentQuestionWholeSha256": "5a1ed553e3556f595235dc4141f3d30a212e978c83522699f3fc78721cfbc521"
        },
        {
          "questionUid": "qid_v1_a2f1a03cd4f81c3ee3d3dcdff678cee5f47b574e3301c902048786b927e22e56",
          "sourceOrdinal": 11,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "41514f3823b5eb41467d0c00dbb232530ec0a6809988ecf74473986507a6b50f",
          "identityWholeSha256": "e1a62b8a298c4ff3c3952b7aa07cefa04271933082944075950658d94999f4f2",
          "runtimeWholeSha256": "cc782ecb30e23397334d1a5b5c4b20fcbae76c6bb9dfe5721998dd486421ce33",
          "currentQuestionWholeSha256": "6d22f5f5e17813bb8a2b94a578836e8951ae5a7020de5c15fe9fd8c18788a1ba"
        },
        {
          "questionUid": "qid_v1_ab1ed1af925a924cf90ec8f3e94c66f7ae52b07ac17faa277ab571c89c853c09",
          "sourceOrdinal": 21,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "22cd7995455e33b814ce82f58499f9341c2132d702abdf76e9771f1cfd9a97cb",
          "identityWholeSha256": "f3e0428963047a0e5ed88de5957229a51cd018b8161ca730159c53af5fe190c8",
          "runtimeWholeSha256": "83711665c8d339913cc6086f3a6b6f546d405c8d9dc88b7c22457aee9d14e67b",
          "currentQuestionWholeSha256": "1a58f9ad2cc519019f8cd51c1753f2ff0599153285d837348a9aa4925ae06243"
        },
        {
          "questionUid": "qid_v1_8d53b4019a9c831c7abc15952c4eec1b1c5901130240eaf4119697527a595993",
          "sourceOrdinal": 22,
          "expectedPlanReason": "CANONICAL_LABELS_MISSING",
          "metadataWholeSha256": "01818d9e63f7d276dc29a6c8afdfd058410a819ddf596b4d3727873fd0d90757",
          "identityWholeSha256": "af8326d2da0e402d5ab20d41e4a8b40c7fc6739ab5a4df27e0a0e350332ee90e",
          "runtimeWholeSha256": "29710fb31b76cc111c8ed47ba3322b5377c5ebdea851404ef14f583bb04072f6",
          "currentQuestionWholeSha256": "8c58f057f8307b308f7fa90db77ab1b075f8d1fcb411062c3b1f8057ee536303"
        }
      ],
      "originalSources": [
        {
          "bytes": 55265,
          "sha256": "676734f37b99f50d43c9c3b3eba48c0c2d07bff28a95a2964521f0ab4581cdc8",
          "gitBlobSha1": "5337c69314c63984522645b9ccbc658cd8e93ec4"
        }
      ],
      "nativeReview": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "docs/operations/m3-s2-meta-full-20261114/exams/E006.meta.json",
        "livePath": ".archive-meta-register/evidence/m3s2-follow428-native-20261115/E006.meta.json",
        "bytes": 132701,
        "sha256": "888a93bffe0cfc4968f9cd6bc0408cea67106e2fd43bd263ea67f4f4ce53ab2c",
        "gitBlobSha1": "0442f2f5fd975ae4697c9657fb61bd1c72dd83e5"
      },
      "sourceReviewSha256ByUid": {
        "qid_v1_1629824d0b99dd6df92f964bb2f7681caddfbfd33e01e5d02bf92163ea060cda": "e532aea2a3743ac73b35dbfba7f9be788a260bfd0fecb3ca69152e9350e94335",
        "qid_v1_7716a1d4f757041ef0f10c447e3c22d4d1bbeee9d6b01c1cdf531f6ec9fb9c1f": "e23d49ff89ac090ca89724a2f0692c7060c9b3c60738afcbe389c1af281d3bf6",
        "qid_v1_8da9c6b955714eada8c0673e9faff6d6c1b994ccde93ed478c74b726314d5d32": "989ca4cc074dbfa6b2661203ad68b9834de3dec800e92bb7c93294ced04a08cb",
        "qid_v1_c2f698969ecc2c3a25f4a02f14dedfdac862634ee41cfc129fc818430ad3fb9c": "79d53d0c2262c3bcb32a7b27039e189b50531549228cef79f459a58c6974ba5e",
        "qid_v1_4b65c4d5f07e51a20f54254f3cb58c9896ffb5937c786ce253157270ef683c1a": "431ea06820bef66880eec03c9f4a163356538796c92e3ade4b744b9ecf163d44",
        "qid_v1_12860943ddaef3358660134a0d8d5007891be0a15104be47196a1797e9d5cc61": "6b0b7ec6593d213d0609133d20e53dc11a05c6368c2cb6027408ba520ab91670",
        "qid_v1_8c2f1c37ae92a5f8d9c4248d0b4488395355b22592f7956c514c7af797045a3e": "0557e1495752da2a220f610fb2d4df42c43667dc6b4b97e8679ba230d101e309",
        "qid_v1_006d3d7fb3c9f11a0355c15b8df9cc7ec43e9de53da5b4e7d3171318ff7e23d3": "d95cce3064ea57fb760de590d8829fc7c3778c4552830a30381987ca5bc87b00",
        "qid_v1_f02ca0c6d6f22a766861024269c0d890a68808e08b50949ab0ecc68d1d5268ed": "92e85b6b2b5c02acd3b40724addc43591c0f9f6ef8f9a0a8a78f4143c4ba975f",
        "qid_v1_a2f1a03cd4f81c3ee3d3dcdff678cee5f47b574e3301c902048786b927e22e56": "e647af88c604575c74ef1d8f8053d1c4d805c834ad56fcd147171eb24479fbd9",
        "qid_v1_ab1ed1af925a924cf90ec8f3e94c66f7ae52b07ac17faa277ab571c89c853c09": "715351a19f67fb5fb3744b798d49d211df1dc6b8fa1cb34c244850713ee70dc3",
        "qid_v1_8d53b4019a9c831c7abc15952c4eec1b1c5901130240eaf4119697527a595993": "5f8f3e540aaa63ffd62ae7a80dee67f4e7a9d128f6bbdda7f312a63aa9efe2bd"
      }
    }
  ]
});

// The E006 display proof stores its UI locators as evidence pairs. Resolve only
// this fixed issued Q3/Q21 profile to its original full immutable refs; it cannot
// turn an unknown typed receipt or changed source into a retained approval.
const E006_TYPED_UI = Object.freeze({
  requestId: "m2s2-e006-problem-continuity-20261116",
  source: "original/middle/m2/2final/25_연향중_2학기_기말_중2_기출.js",
  receipt: { gitBlobSha1: "63537f5a234f2b86a36cb4ba58f1bdfc6246300a",
    sha256: "7d6f0aed188fe8f8012d9a2d87d5853aeda0f296cf157833ed5c58de4ff16ad0", bytes: 76468 },
  sourcePins: { gitBlobSha1: "5566eba8e4c5e3f47d34525e6414d1fe3c7d225d",
    sha256: "0211cff2daaea021b40a685b20ad2ee1ca4d1b7480e5db706087c74942a24762", bytes: 58252 },
  checkoutCommit: "b6b605bf0d660f48e64646a9e59688c77e3e8a01",
  technicalRef: { commit: "cdad05c2efd43d947d3dfa29325d8e32f9589514",
    path: "docs/operations/m2-e006-problem-continuity-20261116/student-ui-technical-v1.json",
    gitBlobSha1: "cda984193a4fa02b6bc7a45808e5db4df90fc880",
    sha256: "6c36bb0f768012fd47d654865bb3cbf5cdeb763c453b90e239190c844a0c7b32", bytes: 90462 },
  visualRef: { commit: "cdad05c2efd43d947d3dfa29325d8e32f9589514",
    path: "docs/operations/m2-e006-problem-continuity-20261116/student-ui-independent-v1.json",
    gitBlobSha1: "b0a8b94ce6c7b9103b6836ad6100e55439f2b3e8",
    sha256: "eaa4c0ff0adcaf3764cf46867e563d81aa615f2c3357f5becbe4d6c19e1dfe35", bytes: 4054 },
  subjects: [
    { questionUid: "qid_v1_77bdb41803d8e38bf819ade572a121911b9ef1bf783541203c671df15ec0985f", sourceOrdinal: 3,
      sourceReviewSha256: "955f57ecd749064a1399e5540ee979395852a7d1dcca7c388d493ddcfaa664d6" },
    { questionUid: "qid_v1_df7a46a1d2551864d378ffa34389721380b230aa6e36d5a8d064be61aada21ea", sourceOrdinal: 21,
      sourceReviewSha256: "614b81227a771a7f1f42b89a5c62eb51d33c3495cd6643e654adcfcfbd5d2d8c" }
  ]
});
function assertM2E006TypedProfile(input, kept, repair) {
  const label = "ISSUED_RETENTION:E006_TYPED_PROFILE";
  const subject = single(E006_TYPED_UI.subjects, value => value.questionUid === input.current?.questionUid &&
    value.sourceOrdinal === input.ordinal, label + ": exact subject");
  assert.strictEqual(input.source, E006_TYPED_UI.source, label + ": source");
  assert.strictEqual(kept.receipt.requestId, E006_TYPED_UI.requestId, label + ": receipt");
  assert.deepStrictEqual(pins(Buffer.from(kept.live(kept.receiptPath))), E006_TYPED_UI.receipt, label + ": receipt bytes");
  assert.deepStrictEqual(pins(input.nativeSource.bytes), E006_TYPED_UI.sourcePins, label + ": source bytes");
  assert.strictEqual(input.nativeSource.bank.length, 23, label + ": source count");
  assert.strictEqual(kept.sourceChangedSinceAnchor, false, label + ": no source-edition exception");
  assert.strictEqual(sha(stable(repair.sourceReview)), subject.sourceReviewSha256, label + ": issued whole source proof");
  const typed = repair.sourceReview.m2E006ProblemContinuity;
  assert(typed?.schemaVersion === "archive-m2-e006-problem-continuity-v1" && typed.questionUid === subject.questionUid &&
    typed.sourceOrdinal === subject.sourceOrdinal && typed.sourceArchiveFile === E006_TYPED_UI.source,
    label + ": typed subject");
  for (const [key, full] of [["technicalRef", E006_TYPED_UI.technicalRef], ["visualRef", E006_TYPED_UI.visualRef]])
    assert.deepStrictEqual(typed.ui[key], { path: full.path, sha256: full.sha256 }, label + ": fixed evidence pair");
  assert(typed.ui.checkoutCommit === E006_TYPED_UI.checkoutCommit && typed.ui.logicalCases === 4 &&
    typed.ui.screenshotArtifactCount === 5 && typed.ui.selectedLogicalCases === 2,
    label + ": original UI inventory");
  return { ...subject, technicalRef: { ...E006_TYPED_UI.technicalRef }, visualRef: { ...E006_TYPED_UI.visualRef } };
}

const PROOF_KINDS = Object.freeze([
  ["m2ProblemRenderer21Continuity", "archive-reviewed-m2-problem21-continuity-v1", "archive-m2-problem24-student-ui-preview-v1"],
  ["m2Family3ProblemContinuity", "archive-m2-family3-problem-continuity-v1", "archive-m2-problem24-student-ui-preview-v1"],
  ["q5CompleteGivenApplication", "archive-m3-e052-q5-complete-given-application-v1", "archive-m3-e052-q5-student-ui-preview-v1"],
  ["m2E006ProblemContinuity", "archive-m2-e006-problem-continuity-v1", "archive-m2-e006-student-ui-preview-v1"]
]);
function relativePath(value) {
  assert(typeof value === "string" && value.length > 0 && value.length < 800 &&
    !path.isAbsolute(value) && !/[\u0000-\u001f\\]/.test(value) &&
    value.split("/").every(part => part && part !== "." && part !== ".."), "ISSUED_RETENTION:PATH");
  return value;
}
function regularRead(root, relative) {
  const base = fs.realpathSync(root);
  let current = base;
  const parts = relativePath(relative).split("/");
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const stat = fs.lstatSync(current);
    assert(!stat.isSymbolicLink() && (i === parts.length - 1 ? stat.isFile() : stat.isDirectory()),
      "ISSUED_RETENTION:REGULAR_PATH:" + relative);
  }
  assert(current.startsWith(base + path.sep), "ISSUED_RETENTION:PATH_ESCAPE");
  return fs.readFileSync(current);
}
function single(rows, predicate, label) {
  assert(Array.isArray(rows), label);
  const matches = rows.filter(predicate);
  assert.strictEqual(matches.length, 1, label);
  return matches[0];
}
function uniqueRows(rows, label) {
  assert(Array.isArray(rows) && rows.length > 0, label);
  const byUid = new Map(), joins = new Set();
  for (const row of rows) {
    assert(UID.test(row.questionUid) && typeof row.sourceArchiveFile === "string" &&
      Number.isSafeInteger(row.sourceOrdinal) && row.sourceOrdinal > 0, label);
    const join = row.sourceArchiveFile + "#" + row.sourceOrdinal;
    assert(!byUid.has(row.questionUid) && !joins.has(join), label + ": duplicate UID/source");
    byUid.set(row.questionUid, row); joins.add(join);
  }
  return byUid;
}
function assertOriginalNativeSourceBytes(raw, prior) {
  assert(prior && prior.sourceBlobSha1 === SOURCE_ONLY.priorSource.gitBlobSha1 &&
    prior.sourceRawSha256 === SOURCE_ONLY.priorSource.sha256, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_REF");
  assert(Buffer.isBuffer(raw), "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_BYTES");
  assert.deepStrictEqual(pins(raw), SOURCE_ONLY.priorSource, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_BYTES");
  return raw;
}
function readOriginalNativeSource(root, prior) {
  assert(prior && prior.sourceBlobSha1 === SOURCE_ONLY.priorSource.gitBlobSha1 &&
    prior.sourceRawSha256 === SOURCE_ONLY.priorSource.sha256, "ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_REF");
  // This is the original immutable input consumed by source preservation.
  // Re-read its object in the caller's Git context; the child-source refusal
  // occurs earlier in Native and cannot establish that this object is present.
  const raw = execFileSync("git", ["cat-file", "blob", SOURCE_ONLY.priorSource.gitBlobSha1], {
    cwd: root, maxBuffer: 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  return assertOriginalNativeSourceBytes(raw, prior);
}
function assertRhsOriginalNativeSourceBytes(raw) {
  assert(Buffer.isBuffer(raw), "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_BYTES");
  const ref = RHS_ONLY.nativeSourceRef;
  assert.deepStrictEqual(pins(raw), { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
    "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_BYTES");
  return raw;
}
function readRhsOriginalNativeSource(root) {
  const ref = RHS_ONLY.nativeSourceRef;
  const options = { cwd: root, maxBuffer: 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"] };
  // Re-read the original required source in this caller's Git object context.
  // The current whole-source refusal occurs before Native reaches this input.
  const entry = execFileSync("git", ["--literal-pathspecs", "ls-tree", "-z", ref.commit, "--", ref.path], options).toString("utf8");
  assert.strictEqual(entry, "100644 blob " + ref.gitBlobSha1 + "\t" + ref.path + "\0",
    "ISSUED_RETENTION:RHS_ORIGINAL_SOURCE_PATH");
  return assertRhsOriginalNativeSourceBytes(execFileSync("git", ["cat-file", "blob", ref.gitBlobSha1], options));
}
function originalReceiptProfile(requestId) {
  return single(ORIGINAL_RECEIPT_BLOCKS.profiles, value => value.requestId === requestId,
    "ISSUED_RETENTION:FIXED_ORIGINAL_RECEIPT");
}
function assertOriginalReceiptSourceBytes(raw, requestId, index) {
  const profile = originalReceiptProfile(requestId);
  assert(Number.isSafeInteger(index) && index >= 0 && index < profile.originalSources.length,
    "ISSUED_RETENTION:ORIGINAL_RECEIPT_SOURCE_INDEX");
  assert(Buffer.isBuffer(raw), "ISSUED_RETENTION:ORIGINAL_RECEIPT_SOURCE_BYTES");
  assert.deepStrictEqual(pins(raw), profile.originalSources[index],
    "ISSUED_RETENTION:ORIGINAL_RECEIPT_SOURCE_BYTES");
  return raw;
}
function readOriginalReceiptSource(root, requestId, index) {
  const profile = originalReceiptProfile(requestId);
  assert(Number.isSafeInteger(index) && index >= 0 && index < profile.originalSources.length,
    "ISSUED_RETENTION:ORIGINAL_RECEIPT_SOURCE_INDEX");
  const raw = execFileSync("git", ["cat-file", "blob", profile.originalSources[index].gitBlobSha1], {
    cwd: root, maxBuffer: 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  return assertOriginalReceiptSourceBytes(raw, requestId, index);
}
function createIssuedApprovalObserver(api) {
  const immutableCache = new Map(), ancestorCache = new Set();
  const git = (root, args) => execFileSync("git", args, {
    cwd: root, maxBuffer: 16 * 1024 * 1024, timeout: 30000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  function ancestor(root, commit) {
    const head = git(root, ["rev-parse", "HEAD"]).toString("utf8").trim();
    assert(SHA1.test(head) && SHA1.test(commit), "ISSUED_RETENTION:COMMIT");
    const key = fs.realpathSync(root) + ":" + head + ":" + commit;
    if (!ancestorCache.has(key)) {
      git(root, ["merge-base", "--is-ancestor", commit, head]);
      ancestorCache.add(key);
    }
    return head;
  }
  function immutable(root, commit, relative) {
    relativePath(relative); assert(SHA1.test(commit), "ISSUED_RETENTION:IMMUTABLE_COMMIT");
    const key = commit + ":" + relative;
    if (!immutableCache.has(key)) {
      const entry = git(root, ["--literal-pathspecs", "ls-tree", "-z", commit, "--", relative]).toString("utf8");
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      assert(match && match[3] === relative, "ISSUED_RETENTION:GIT_REGULAR_FILE:" + relative);
      const raw = git(root, ["cat-file", "blob", match[2]]);
      assert.strictEqual(blob(raw), match[2], "ISSUED_RETENTION:GIT_BLOB:" + relative);
      immutableCache.set(key, raw);
    }
    return immutableCache.get(key);
  }
  function boundImmutable(root, ref) {
    assert(ref && SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) &&
      SHA256.test(ref.sha256) && Number.isSafeInteger(ref.bytes) && ref.bytes > 0,
      "ISSUED_RETENTION:IMMUTABLE_REF");
    const raw = immutable(root, ref.commit, ref.path);
    assert.deepStrictEqual(pins(raw), { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
      "ISSUED_RETENTION:IMMUTABLE_REF_BYTES:" + ref.path);
    return raw;
  }

  const authenticatedRefs = new Set();
  function authenticateRef(root, ref) {
    assert(ref && SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) &&
      SHA256.test(ref.sha256) && Number.isSafeInteger(ref.bytes) &&
      ref.bytes > 0 && ref.bytes <= 128 * 1024 * 1024, "ISSUED_RETENTION:IMMUTABLE_REF");
    const relative = relativePath(ref.path), key = stable([ref.commit, relative, ref.gitBlobSha1, ref.sha256, ref.bytes]);
    if (authenticatedRefs.has(key)) return;
    if (ref.bytes <= 8 * 1024 * 1024) boundImmutable(root, ref);
    else {
      const entry = git(root, ["--literal-pathspecs", "ls-tree", "-z", ref.commit, "--", relative]).toString("utf8");
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
      assert(match && match[2] === ref.gitBlobSha1 && match[3] === relative, "ISSUED_RETENTION:GIT_REGULAR_LARGE_REF");
      const actual = JSON.parse(execFileSync(process.execPath,
        ["-e", STREAM_GIT_PINS, ref.gitBlobSha1, String(ref.bytes)], {
          cwd: root, timeout: 30000, maxBuffer: 4096, stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" }
        }).toString("utf8"));
      assert.deepStrictEqual(actual, { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes },
        "ISSUED_RETENTION:IMMUTABLE_LARGE_REF_BYTES");
    }
    authenticatedRefs.add(key);
  }
  function assertObservedSourceEdition(root, relative, issued, actual, label) {
    assert.strictEqual(relative, OBSERVATION.source.path, label + ": unknown source change");
    assert.deepStrictEqual(pins(issued), OBSERVATION.source.before, label + ": known source before");
    const editions = [
      { commit: OBSERVATION.observed, pins: OBSERVATION.source.after,
        changes: [{ sourceOrdinal: SOURCE_ONLY.changedSourceOrdinal, fields: SOURCE_ONLY.changedSourceFields }] },
      SOURCE_EDITION_2372
    ];
    const edition = single(editions, value => same(value.pins, pins(actual)), label + ": unobserved source edition");
    const head = ancestor(root, edition.commit);
    assert(actual.equals(immutable(root, edition.commit, relative)) && actual.equals(immutable(root, head, relative)),
      label + ": exact observed source and current HEAD bytes");
    const beforeBank = api.loadBank(issued.toString("utf8"), relative);
    const currentBank = api.loadBank(actual.toString("utf8"), relative);
    assert.strictEqual(beforeBank.length, SOURCE_ONLY.expectedQuestionCount, label);
    assert.strictEqual(currentBank.length, SOURCE_ONLY.expectedQuestionCount, label);
    const changes = beforeBank.map((before, index) => {
      const after = currentBank[index];
      if (same(before, after)) return null;
      return { sourceOrdinal: index + 1, fields: [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .filter(field => !same(before[field], after[field])).sort() };
    }).filter(Boolean);
    assert.deepStrictEqual(changes, edition.changes, label + ": exact known source field inventory");
    return { commit: edition.commit, pins: edition.pins, changes, beforeBank, currentBank };
  }
  function assertOriginalReceiptSourceEdition(root, profile, relative, issued, actual, label) {
    assert.strictEqual(relative, "archive/exams/" + profile.source, label + ": fixed original source path");
    assert.deepStrictEqual(pins(issued), profile.issuedSource, label + ": fixed issued original source");
    assert.deepStrictEqual(pins(actual), profile.observedSource, label + ": unobserved original source edition");
    const commit = (profile.observation || ORIGINAL_RECEIPT_BLOCKS.observation).snapshot, head = ancestor(root, commit);
    assert(actual.equals(immutable(root, commit, relative)) && actual.equals(immutable(root, head, relative)),
      label + ": actual observed edition and current HEAD source bytes");
    const beforeBank = api.loadBank(issued.toString("utf8"), relative);
    const currentBank = api.loadBank(actual.toString("utf8"), relative);
    assert.strictEqual(beforeBank.length, profile.expectedQuestions, label);
    assert.strictEqual(currentBank.length, profile.expectedQuestions, label);
    const changes = beforeBank.map((before, index) => {
      const after = currentBank[index];
      if (same(before, after)) return null;
      return { sourceOrdinal: index + 1, fields: [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .filter(field => !same(before[field], after[field])).sort(),
        beforeWholeSha256: sha(stable(before)), afterWholeSha256: sha(stable(after)) };
    }).filter(Boolean);
    assert.deepStrictEqual(changes, profile.changes, label + ": exact observed whole-bank change inventory");
    return { commit, pins: profile.observedSource, changes, beforeBank, currentBank };
  }
  function assertRetained(input, label) {
    const { current, identity, source, ordinal, question, previous, registry, runtimeOwner, nativeSource } = input;
    const row = nativeSource?.runtimeRecord, root = nativeSource?.root;
    assert(root && current && identity && row && registry?.status === "ACTIVE", label + ": retained inputs");
    ancestor(root, OBSERVATION.anchor);
    assert(UID.test(current.questionUid) && current.questionUid === identity.questionUid &&
      current.questionUid === row.questionUid, label + ": retained UID");
    for (const value of [current, identity, row])
      assert(value.sourceArchiveFile === source && value.sourceOrdinal === ordinal, label + ": retained join");
    assert(Number.isSafeInteger(ordinal) && ordinal > 0, label + ": retained ordinal");
    const uniqueIdentity = single(nativeSource.identityMap?.records, value => value.questionUid === identity.questionUid,
      label + ": identity UID must be globally unique");
    assert.deepStrictEqual(uniqueIdentity, identity, label);
    assert.strictEqual(single(nativeSource.identityMap.records,
      value => value.sourceArchiveFile === source && value.sourceOrdinal === ordinal, label + ": identity join").questionUid,
      identity.questionUid, label);
    assert.deepStrictEqual(nativeSource.identityByJoin?.get(source + "#" + ordinal), identity, label);
    if (identity.status) assert.strictEqual(identity.status, "VERIFIED", label);
    assert.strictEqual(nativeSource.runtimeStatus, "ACTIVE", label);
    assert.strictEqual(current.metaFoundationStatus, "ACTIVE", label);
    assert.strictEqual(current.metaFoundationPackId, runtimeOwner, label);
    assert.strictEqual(row.metaFoundationPackId, runtimeOwner, label);
    assert.notStrictEqual(current.metadataStatus, "SOURCE_HOLD", label);
    assert(["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType), label + ": retained approval kind");
    assert.strictEqual(current.sourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(row.sourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(row.approvedSourceFingerprint, identity.sourceFingerprint, label);
    assert.strictEqual(String(current.sourceQuestionNo), String(identity.sourceQuestionNo), label);
    assert(Array.isArray(nativeSource.bank) && Buffer.isBuffer(nativeSource.bytes), label);
    assert.deepStrictEqual(nativeSource.bank[ordinal - 1], question, label + ": current bank binding");
    assert.deepStrictEqual(previous, question, label + ": read-only current-input probe");
    assert.strictEqual(blob(nativeSource.bytes), nativeSource.blobSha1, label + ": current source blob");
    assert.strictEqual(String(row.sourceQuestionNo), String(question.sourceQuestionNo ?? question.id ?? ""), label);
    if (question.questionUid && question.questionUid !== identity.questionUid)
      assert(api.isUnambiguousLegacySourceUidAlias({ question, sourceArchiveFile: source, sourceOrdinal: ordinal,
        identityRecord: identity, identityMap: nativeSource.identityMap, bank: nativeSource.bank }), label);
    const classification = Object.fromEntries([
      "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
      "standardUnitKey", "subUnitKey", "sourceArchiveFile"
    ].map(key => [key, current[key]]));
    const check = api.validateActiveMetaFields(classification, registry, { requireFields: false });
    assert.strictEqual(check.status, "VALIDATED", label + ": retained ACTIVE classification");
    assert.strictEqual(check.activeBinding, true, label);
    const context = api.activeBindingContext({ candidate: current, check, registry, runtimeOwner });
    assert(!context.reason && context.ownerPack === runtimeOwner, label + ": retained ACTIVE owner");
    const prefix = "meta-foundation:" + runtimeOwner + "@" + current.metaFoundationPackVersion +
      ":exam-" + current.metadataApprovalType.toLowerCase() + "-v2:";
    assert(typeof current.metadataRevision === "string" && current.metadataRevision.startsWith(prefix), label);
    const requestId = current.metadataRevision.slice(prefix.length);
    assert(/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId), label);
    const receiptPath = RECEIPTS + requestId + ".json", readPaths = new Set();
    const live = relative => { readPaths.add(relative); return regularRead(root, relative); };
    assert(current.approvalEvidence?.includes(receiptPath) && row.approvalEvidence?.includes(receiptPath), label);
    const issuedBytes = immutable(root, OBSERVATION.anchor, receiptPath);
    assert(live(receiptPath).equals(issuedBytes), label + ": current receipt must equal issued anchor bytes");
    const receipt = JSON.parse(issuedBytes);
    assert(receipt.schemaVersion === "archive-reviewed-exam-meta-registration-v2" &&
      receipt.metadataRegistrationStatus === "REGISTERED" && receipt.requestId === requestId &&
      SHA256.test(receipt.requestSha256) && receipt.sourceArchiveFile === source &&
      SHA1.test(receipt.sourceBlobSha1) && SHA256.test(receipt.sourceRawSha256), label + ": issued receipt");
    assert.strictEqual(receipt.approval?.type, current.metadataApprovalType, label);
    assert.strictEqual(receipt.approval.metadataReviewed, true, label);
    assert(typeof receipt.approval.approvedBy === "string" && receipt.approval.approvedBy.trim(), label);
    if (receipt.approval.type === "REVIEW2") assert.strictEqual(receipt.approval.reviewPassCount, 2, label);
    const issuedMaps = [receipt.appliedRecords, receipt.appliedIdentityRecords, receipt.runtimeRecords]
      .map((records, i) => uniqueRows(records, label + ": issued inventory " + i));
    const uids = [...issuedMaps[0].keys()].sort();
    for (const records of issuedMaps) {
      assert.deepStrictEqual([...records.keys()].sort(), uids, label + ": issued inventory UID set");
      for (const value of records.values())
        assert(value.sourceArchiveFile === source && value.sourceOrdinal === issuedMaps[0].get(value.questionUid).sourceOrdinal,
          label + ": issued inventory source/ordinal");
    }
    assert.strictEqual(receipt.totalQuestions, uids.length, label);
    if (receipt.scope === "PARTIAL_UIDS") assert.strictEqual(receipt.partialUidCount, uids.length, label);
    assert.deepStrictEqual(issuedMaps[0].get(current.questionUid), current, label + ": retained metadata whole row");
    assert.deepStrictEqual(issuedMaps[1].get(current.questionUid), identity, label + ": retained identity whole row");
    assert.deepStrictEqual(issuedMaps[2].get(current.questionUid), row, label + ": retained runtime whole row");
    assert.deepStrictEqual(current.fieldStatus, row.fieldStatus, label);
    assert.strictEqual(current.metadataApprovalType, row.metadataApprovalType, label);
    const evidence = receipt.approval.evidenceRefs, seenEvidence = new Set();
    assert(Array.isArray(evidence) && evidence.length > 0, label + ": evidence inventory");
    for (const ref of evidence) {
      assert(ref && SHA256.test(ref.sha256) && !seenEvidence.has(relativePath(ref.path)), label + ": evidence ref");
      seenEvidence.add(ref.path);
      const raw = immutable(root, OBSERVATION.anchor, ref.path);
      assert.strictEqual(sha(raw), ref.sha256, label + ": issued evidence digest");
      assert(live(ref.path).equals(raw), label + ": current evidence bytes");
    }
    const originalReceipt = ORIGINAL_RECEIPT_BLOCKS.profiles.find(value => value.requestId === requestId);
    const sourceOnly = requestId === SOURCE_ONLY.child.requestId;
    let bindingPath = null, patch = null;
    if (sourceOnly) {
      assert.strictEqual(receiptPath, SOURCE_ONLY.child.path, label + ": closed source receipt path");
      assert.deepStrictEqual(pins(issuedBytes), pinsOnly(SOURCE_ONLY.child), label + ": closed issued source receipt");
      assert(source === SOURCE_ONLY.source && SOURCE_ONLY.subjects.some(value =>
        value.questionUid === current.questionUid && value.sourceOrdinal === ordinal), label + ": closed source target");
    } else if (originalReceipt) {
      assert.strictEqual(receiptPath, originalReceipt.receipt.path, label + ": fixed original receipt path");
      assert.deepStrictEqual(pins(issuedBytes), pinsOnly(originalReceipt.receipt), label + ": fixed original issued receipt bytes");
      assert(source === originalReceipt.source && originalReceipt.subjects.some(value =>
        value.questionUid === current.questionUid && value.sourceOrdinal === ordinal), label + ": fixed original receipt subject");
    } else {
      bindingPath = RECEIPTS + requestId + ".source-review-binding.json";
      const digest = single(receipt.outputDigests, ref => ref.path === bindingPath, label + ": source-review output");
      assert(SHA256.test(digest.sha256) && current.approvalEvidence.includes(bindingPath) &&
        row.approvalEvidence.includes(bindingPath), label + ": typed provenance");
      const bindingBytes = immutable(root, OBSERVATION.anchor, bindingPath);
      assert.strictEqual(sha(bindingBytes), digest.sha256, label + ": issued binding digest");
      assert(live(bindingPath).equals(bindingBytes), label + ": current binding bytes");
      const binding = JSON.parse(bindingBytes), request = binding.requestSnapshot;
      assert(binding.schemaVersion === "archive-reviewed-source-binding-v1" && binding.requestId === requestId &&
        request?.requestId === requestId && request.sourceArchiveFile === source, label + ": typed binding");
      assert.deepStrictEqual(request.approval, receipt.approval, label);
      patch = single(request.items, value => value.questionUid === current.questionUid && value.sourceOrdinal === ordinal,
        label + ": issued typed request target");
      assert(patch.sourceReview?.schemaVersion === "archive-reviewed-source-reassessment-v1", label);

      assert(Array.isArray(patch.evidenceRefs) && patch.evidenceRefs.length > 0, label + ": selected evidence inventory");
      const selectedEvidence = new Set();
      for (const ref of patch.evidenceRefs) {
        assert(ref && SHA256.test(ref.sha256) && !selectedEvidence.has(relativePath(ref.path)),
          label + ": selected evidence ref");
        selectedEvidence.add(ref.path);
        const evidenceBytes = immutable(root, OBSERVATION.anchor, ref.path);
        assert.strictEqual(sha(evidenceBytes), ref.sha256, label + ": issued selected evidence digest");
        assert(live(ref.path).equals(evidenceBytes), label + ": current selected evidence bytes");
      }
    }
    const sourcePath = "archive/exams/" + source, currentSource = live(sourcePath);
    assert(currentSource.equals(nativeSource.bytes), label + ": current source bytes");
    const anchorSource = immutable(root, OBSERVATION.anchor, sourcePath);
    const sourceChangedSinceAnchor = !currentSource.equals(anchorSource);
    const sourceEdition = sourceChangedSinceAnchor
      ? originalReceipt ? assertOriginalReceiptSourceEdition(root, originalReceipt, sourcePath, anchorSource, currentSource, label)
        : assertObservedSourceEdition(root, sourcePath, anchorSource, currentSource, label) : null;
    if (sourceEdition) assert.deepStrictEqual(sourceEdition.currentBank, nativeSource.bank, label + ": observed caller source bank");
    const rhsOnly = requestId === RHS_ONLY.requestId;
    if (rhsOnly) {
      assert(source === RHS_ONLY.sourceArchiveFile && ordinal === RHS_ONLY.sourceOrdinal &&
        current.questionUid === RHS_ONLY.questionUid, label + ": exact issued RHS singleton");
      assert.deepStrictEqual(pins(issuedBytes), pinsOnly(RHS_ONLY.receipt), label + ": fixed RHS issued receipt");
    }
    return { kind: originalReceipt ? ORIGINAL_RECEIPT_BLOCKS.schemaVersion : sourceOnly ? SOURCE_ONLY.schemaVersion : rhsOnly ? RHS_ONLY.schemaVersion : "ISSUED_TYPED_UI",
      receiptPath, receipt, bindingPath, patch, context, readPaths, sourceChangedSinceAnchor, sourceEdition, live,
      proof: { approval: "RETAINED_ISSUED_APPROVAL", anchor: OBSERVATION.anchor,
        receipt: { path: receiptPath, ...pins(issuedBytes) }, questionUid: current.questionUid,
        sourceArchiveFile: source, sourceOrdinal: ordinal, metadataSha256: sha(stable(current)),
        identitySha256: sha(stable(identity)), runtimeSha256: sha(stable(row)),
        sourceChangedSinceAnchor, newMetadataApprovals: 0 } };
  }
  function assertAuthorityInputs(input, kept, label) {
    const { registry, nativeSource } = input, root = nativeSource.root;
    // The current ACTIVE registry is re-read with the same digest policy as the
    // ordinary Native reader. Its owner/binding was checked by assertRetained.
    assert.deepStrictEqual(JSON.parse(kept.live(ACTIVE_INDEX)), registry.files?.index,
      label + ": current ACTIVE registry input");
    const registryRefs = [...registry.files.index.canonicalSources, ...registry.files.index.compiledArtifacts];
    assert(registryRefs.length > 0, label + ": ACTIVE input closure");
    for (const entry of registryRefs) {
      assert(entry && /^sha256:[a-f0-9]{64}$|^[a-f0-9]{64}$/.test(entry.sha256 || ""), label + ": ACTIVE digest");
      assert.strictEqual(sha(Buffer.from(kept.live(entry.path).toString("utf8").replaceAll("\r\n", "\n"))),
        entry.sha256.replace(/^sha256:/, ""), label + ": ACTIVE declared input drift:" + entry.path);
    }
    assert(kept.live(MASTER).equals(immutable(root, OBSERVATION.anchor, MASTER)),
      label + ": unknown master input drift");

  }
  function assertKnownSourceOnlyInputs(input, kept, label) {
    const { nativeSource, source, ordinal, current, identity } = input, root = nativeSource.root;
    assert.strictEqual(kept.kind, SOURCE_ONLY.schemaVersion, label + ": exact source-only lane");
    assert(kept.sourceChangedSinceAnchor && source === SOURCE_ONLY.source, label + ": exact observed source drift required");
    const child = kept.receipt, expectedSubjects = SOURCE_ONLY.subjects.map(value => value.questionUid).sort();
    assert(child.scope === "PARTIAL_UIDS" && child.partialUidCount === 2 && child.totalQuestions === 2 &&
      child.expectedQuestionCount === SOURCE_ONLY.expectedQuestionCount && child.newMetadataApprovals === 0 &&
      child.preservedMetadataApprovals === 2 && child.registryChanges?.length === 0 &&
      child.fingerprintRepairs?.length === 0, label + ": exact approval-preserving child inventory");
    assert.deepStrictEqual(child.appliedRecords.map(value => value.questionUid).sort(), expectedSubjects, label);
    assert.deepStrictEqual(child.approval.evidenceRefs,
      [{ path: SOURCE_ONLY.prior.path, sha256: SOURCE_ONLY.prior.sha256 }], label + ": closed parent evidence");
    assert.deepStrictEqual(child.approval.sourceRebind,
      { priorReceiptRef: child.approval.evidenceRefs[0] }, label + ": exact source preservation claim");
    assert.deepStrictEqual({ gitBlobSha1: child.sourceBlobSha1, sha256: child.sourceRawSha256 },
      { gitBlobSha1: OBSERVATION.source.before.gitBlobSha1, sha256: OBSERVATION.source.before.sha256 }, label);

    const priorBytes = immutable(root, OBSERVATION.anchor, SOURCE_ONLY.prior.path);
    assert.deepStrictEqual(pins(priorBytes), pinsOnly(SOURCE_ONLY.prior), label + ": immutable original Native receipt");
    assert(kept.live(SOURCE_ONLY.prior.path).equals(priorBytes), label + ": live original Native receipt");
    const prior = JSON.parse(priorBytes);
    const originalNativeSource = readOriginalNativeSource(root, prior);
    assert(prior.schemaVersion === "archive-reviewed-exam-meta-registration-v2" &&
      prior.metadataRegistrationStatus === "REGISTERED" && prior.requestId === SOURCE_ONLY.prior.requestId &&
      prior.sourceArchiveFile === source && prior.expectedQuestionCount === SOURCE_ONLY.expectedQuestionCount &&
      prior.scope === "PARTIAL_UIDS" && prior.partialUidCount === 2 && prior.totalQuestions === 2 &&
      prior.approval?.type === "FINAL_QA" && prior.approval.metadataReviewed === true &&
      prior.registryChanges?.length === 0, label + ": original complete Native approval");
    const withoutTransport = value => {
      const copy = { ...value }; delete copy.metadataRevision; delete copy.approvalEvidence; return copy;
    };
    for (const collection of ["appliedRecords", "appliedIdentityRecords", "runtimeRecords"]) {
      const oldRows = uniqueRows(prior[collection], label + ": original " + collection);
      const newRows = uniqueRows(child[collection], label + ": child " + collection);
      assert.deepStrictEqual([...oldRows.keys()].sort(), expectedSubjects, label);
      assert.deepStrictEqual([...newRows.keys()].sort(), expectedSubjects, label);
      for (const subject of SOURCE_ONLY.subjects) {
        const before = oldRows.get(subject.questionUid), after = newRows.get(subject.questionUid);
        assert(before.sourceOrdinal === subject.sourceOrdinal && after.sourceOrdinal === subject.sourceOrdinal, label);
        assert.deepStrictEqual(collection === "appliedIdentityRecords" ? after : withoutTransport(after),
          collection === "appliedIdentityRecords" ? before : withoutTransport(before), label + ": original approved whole state");
      }
    }
    const priorEvidencePaths = [], seen = new Set();
    assert(Array.isArray(prior.approval.evidenceRefs) && prior.approval.evidenceRefs.length > 0, label);
    for (const ref of prior.approval.evidenceRefs) {
      assert(SHA256.test(ref.sha256) && !seen.has(relativePath(ref.path)) &&
        !ref.path.startsWith(RECEIPTS), label + ": exact terminal original evidence closure");
      seen.add(ref.path);
      const raw = immutable(root, OBSERVATION.anchor, ref.path);
      assert.strictEqual(sha(raw), ref.sha256, label + ": original evidence SHA");
      assert(kept.live(ref.path).equals(raw), label + ": live original evidence");
      priorEvidencePaths.push(ref.path);
    }
    assertAuthorityInputs(input, kept, label);
    for (const subject of SOURCE_ONLY.subjects) {
      const actual = api.currentRows(subject.questionUid);
      assert(actual.runtimeStatus === "ACTIVE" && actual.runtimeOwner === "MIDDLE_GEOMETRY",
        label + ": both current runtime owners must be ACTIVE");
      for (const [key, collection] of [["metadata", "appliedRecords"], ["identity", "appliedIdentityRecords"], ["runtime", "runtimeRecords"]])
        assert.deepStrictEqual(actual[key], single(child[collection], value => value.questionUid === subject.questionUid,
          label + ": issued source pair " + key), label + ": both current source-pair whole rows");
      const classification = Object.fromEntries([
        "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
        "standardUnitKey", "subUnitKey", "sourceArchiveFile"
      ].map(field => [field, actual.metadata[field]]));
      const check = api.validateActiveMetaFields(classification, input.registry, { requireFields: false });
      assert(check.status === "VALIDATED" && check.activeBinding, label + ": both current source-pair classifications");
      const context = api.activeBindingContext({ candidate: actual.metadata, check, registry: input.registry,
        runtimeOwner: actual.runtimeOwner });
      assert(!context.reason && context.ownerPack === actual.runtimeOwner, label + ": both current source-pair ACTIVE owners");
    }

    // Existing source bytes are parsed only for exact structural equality.
    // No mathematical review, rendering, new approval or source rewrite occurs.
    const sourcePath = "archive/exams/" + source, beforeBytes = immutable(root, OBSERVATION.anchor, sourcePath);
    assert.deepStrictEqual(pins(beforeBytes), OBSERVATION.source.before, label + ": issued source edition");
    const edition = kept.sourceEdition;
    assert(edition && nativeSource.bytes.equals(immutable(root, edition.commit, sourcePath)),
      label + ": exact observed source edition");
    const oldBank = edition.beforeBank, newBank = edition.currentBank;
    assert.deepStrictEqual(newBank, nativeSource.bank, label + ": caller bank must be the current source bytes");
    const changedFields = single(edition.changes, value => value.sourceOrdinal === SOURCE_ONLY.changedSourceOrdinal,
      label + ": original observed question change").fields;
    for (const subject of SOURCE_ONLY.subjects)
      assert.deepStrictEqual(newBank[subject.sourceOrdinal - 1], oldBank[subject.sourceOrdinal - 1],
        label + ": selected source question whole unchanged");
    assert.deepStrictEqual(input.question, newBank[ordinal - 1], label);
    assert.strictEqual(api.sourceFingerprint(input.question), identity.sourceFingerprint, label + ": selected current fingerprint");
    return { ...kept, declaredInputs: {
      readonlyPaths: priorEvidencePaths.slice().sort(), fontPaths: [], assetPaths: [], sourcePaths: [sourcePath],
      inventorySize: kept.readPaths.size, priorEvidencePaths,
      originalNativeSource: pins(originalNativeSource),
      selectedSource: { anchor: OBSERVATION.anchor, path: sourcePath,
        subjects: SOURCE_ONLY.subjects.map(value => ({ ...value,
          wholeQuestionSha256: sha(stable(newBank[value.sourceOrdinal - 1])) })),
        changedOrdinal: SOURCE_ONLY.changedSourceOrdinal, changedFields,
        observedCommit: edition.commit, completeChangedFields: edition.changes,
        currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: [{ path: sourcePath, issued: OBSERVATION.source.before, current: edition.pins }] };
  }
  function assertKnownRhsInputs(input, kept, label) {
    const { current, identity, source, ordinal, nativeSource } = input, root = nativeSource.root;
    assert(kept.kind === RHS_ONLY.schemaVersion && current.questionUid === RHS_ONLY.questionUid &&
      source === RHS_ONLY.sourceArchiveFile && ordinal === RHS_ONLY.sourceOrdinal &&
      kept.sourceChangedSinceAnchor && kept.sourceEdition, label + ": exact RHS blocking scope");
    const receipt = kept.receipt;
    assert(receipt.scope === "PARTIAL_UIDS" && receipt.partialUidCount === 1 && receipt.totalQuestions === 1 &&
      receipt.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      receipt.requestSha256 === RHS_ONLY.requestSha256 && receipt.registryChanges?.length === 0 &&
      receipt.approval?.type === "FINAL_QA" && receipt.approval.sourceRebind === undefined &&
      receipt.sourceBlobSha1 === OBSERVATION.source.before.gitBlobSha1 &&
      receipt.sourceRawSha256 === OBSERVATION.source.before.sha256, label + ": fixed original RHS issuance");
    assert.strictEqual(kept.receiptPath, RHS_ONLY.receipt.path, label);
    assert.strictEqual(kept.bindingPath, RHS_ONLY.sourceBinding.path, label);
    const bindingBytes = immutable(root, OBSERVATION.anchor, kept.bindingPath);
    assert.deepStrictEqual(pins(bindingBytes), pinsOnly(RHS_ONLY.sourceBinding), label + ": exact issued RHS source binding");
    assert(kept.live(kept.bindingPath).equals(bindingBytes), label);
    const request = JSON.parse(bindingBytes).requestSnapshot, patch = kept.patch;
    assert(request.items.length === 1 && request.requestId === RHS_ONLY.requestId &&
      request.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      request.expectedSourceBlobSha1 === OBSERVATION.source.before.gitBlobSha1 &&
      request.registrationMode === undefined && patch.rebind === undefined, label + ": closed original RHS request");
    assert.deepStrictEqual(Object.keys(patch.sourceReview).sort(),
      ["schemaVersion", "reviewCommit", "reviewPath", "reviewRef", "e017RhsContinuity"].sort(),
      label + ": unmixed original RHS marker");
    const marker = patch.sourceReview.e017RhsContinuity;
    assert.deepStrictEqual(marker, { schemaVersion: "archive-m2-e017-existing-rhs-solution-continuity-v1",
      reviewCommit: RHS_ONLY.reviewBinding.commit,
      reviewRef: { path: RHS_ONLY.reviewBinding.path, sha256: RHS_ONLY.reviewBinding.sha256 } },
      label + ": exact original RHS binding marker");
    const repair = single(receipt.fingerprintRepairs, value => value.questionUid === current.questionUid &&
      value.sourceOrdinal === ordinal, label + ": exact original RHS repair");
    assert.strictEqual(receipt.fingerprintRepairs.length, 1, label);
    const original = repair.sourceReview, typed = original.e017RhsContinuity;
    assert.strictEqual(sha(stable(original)), RHS_ONLY.sourceReviewSha256, label + ": complete original RHS source-review proof");
    assert.strictEqual(sha(stable(typed)), RHS_ONLY.typedProofSha256, label + ": complete original RHS typed proof");
    const documentBytes = boundImmutable(root, RHS_ONLY.reviewBinding);
    assert(kept.live(RHS_ONLY.reviewBinding.path).equals(documentBytes) &&
      immutable(root, OBSERVATION.anchor, RHS_ONLY.reviewBinding.path).equals(documentBytes),
      label + ": immutable and live RHS binding document");
    const document = JSON.parse(documentBytes);
    assert(document.schemaVersion === "archive-m2-e017-existing-rhs-binding-v1" &&
      document.scope === "EXACT_E017_Q2_EXISTING_RHS_FIRST_LINE_ONLY" &&
      document.questionUid === current.questionUid && document.sourceOrdinal === ordinal &&
      document.sourceArchiveFile === source && document.expectedQuestionCount === RHS_ONLY.expectedQuestionCount &&
      document.newMathematicalQa === false && document.newMetadataApprovals === 0,
      label + ": original RHS binding scope");
    for (const key of ["nativeReviewRef", "nativeItemSha256", "authorityRefs", "reviewedCurrentSourceRef",
      "currentSourceRef", "currentAssetRefs", "solutionAssetRefs", "transition",
      "studentUiTechnicalRef", "studentUiVisualRef"])
      assert.deepStrictEqual(document[key], typed[key], label + ": original RHS declared " + key);
    assert.deepStrictEqual(pinsOnly(document.currentSourceRef), OBSERVATION.source.before, label);
    assert.strictEqual(document.currentSourceRef.path, "archive/exams/" + source, label);

    // Authenticate the complete original reader closure. Only paths that the
    // original reader consumes live are compared with current regular files;
    // no new review, current screenshot or historical database is manufactured.
    const immutableRefs = [document.nativeReviewRef, ...document.authorityRefs,
      document.reviewedCurrentSourceRef, document.currentSourceRef,
      document.studentUiTechnicalRef, document.studentUiVisualRef];
    const rpm = original.nativeRpmCourseTransport;
    assert(rpm?.schemaVersion === "archive-m2-native-rpm-course-transport-v1" &&
      rpm.questionUid === current.questionUid && rpm.sourceOrdinal === ordinal &&
      rpm.ordinaryParentValidationRequired === true && rpm.newMathematicalQa === false &&
      rpm.nativeSource.gitBlobSha1 === RHS_ONLY.nativeSourceRef.gitBlobSha1 &&
      rpm.nativeSource.sha256 === RHS_ONLY.nativeSourceRef.sha256, label + ": original RHS RPM transport");
    immutableRefs.push(rpm.nativeRpmRef, rpm.currentRpmRef);
    for (const ref of immutableRefs) authenticateRef(root, ref);
    const originalSource = readRhsOriginalNativeSource(root);
    assert(boundImmutable(root, RHS_ONLY.nativeSourceRef).equals(originalSource),
      label + ": original RHS source commit and object binding");
    assert.strictEqual(original.reviewedSourceBlobSha1, RHS_ONLY.nativeSourceRef.gitBlobSha1, label);
    assert.strictEqual(original.reviewCommitSourceBlobSha1, RHS_ONLY.nativeSourceRef.gitBlobSha1, label);
    assert.strictEqual(original.reviewedSourceSha256, RHS_ONLY.nativeSourceRef.sha256, label);
    assert(kept.live(original.reviewRef.path).equals(boundImmutable(root, document.nativeReviewRef)),
      label + ": original Native review live witness");
    assert(kept.live(rpm.currentRpmRef.path).equals(boundImmutable(root, rpm.currentRpmRef)),
      label + ": original current RPM live witness");

    const assetPaths = [];
    assert.strictEqual(document.currentAssetRefs.length, 2, label + ": original RHS asset inventory");
    for (const ref of document.currentAssetRefs) {
      const raw = boundImmutable(root, ref);
      assert(raw.equals(boundImmutable(root, { ...ref, commit: RHS_ONLY.nativeSourceRef.commit })) &&
        raw.equals(kept.live(ref.path)), label + ": original RHS asset history/live bytes");
      assetPaths.push(ref.path);
    }
    const technical = JSON.parse(boundImmutable(root, document.studentUiTechnicalRef));
    const visual = JSON.parse(boundImmutable(root, document.studentUiVisualRef));
    assert(technical.expectedLogicalCases === 1 && technical.completedLogicalCases === 1 &&
      technical.results?.length === 1 && visual.records?.length === 1,
      label + ": immutable original RHS solution-one UI");
    assert.deepStrictEqual(ExistingVectorUi.verifyUi({
      technical, visual, technicalRef: document.studentUiTechnicalRef,
      readRef: ref => boundImmutable(root, ref), questionUid: current.questionUid,
      sourceOrdinal: ordinal, surface: "SOLUTION", sourceRef: document.currentSourceRef,
      assetRefs: document.solutionAssetRefs
    }), typed.ui, label + ": original issued UI contract only");
    assertAuthorityInputs(input, kept, label);
    const edition = kept.sourceEdition, sourcePath = "archive/exams/" + source;
    assert.deepStrictEqual(edition.currentBank, nativeSource.bank, label + ": exact current RHS source bank");
    assert.deepStrictEqual(input.question, edition.currentBank[ordinal - 1], label);
    const q2Change = single(edition.changes, value => value.sourceOrdinal === ordinal,
      label + ": exact observed Q2 source change");
    assert.deepStrictEqual(q2Change.fields, SOURCE_ONLY.changedSourceFields, label + ": known Q2 image/layout change only");
    const expectedPlanReason = api.sourceFingerprint(input.question) === identity.sourceFingerprint
      ? "NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED" : "IDENTITY_SOURCE_FINGERPRINT_MISMATCH";
    return { ...kept, expectedPlanReason, declaredInputs: {
      readonlyPaths: [...kept.readPaths].filter(relative => relative !== sourcePath && !assetPaths.includes(relative)).sort(),
      fontPaths: [], assetPaths: assetPaths.sort(), sourcePaths: [sourcePath], inventorySize: kept.readPaths.size,
      immutableRefs, originalNativeSource: pins(originalSource),
      originalSolutionUi: { technicalRef: document.studentUiTechnicalRef, visualRef: document.studentUiVisualRef,
        logicalCases: 1, originalTiles: 1, currentUiContinuity: "NOT_ASSERTED" },
      selectedSource: { anchor: OBSERVATION.anchor, path: sourcePath, observedCommit: edition.commit,
        changes: edition.changes, currentQuestionSha256: sha(stable(input.question)), currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: [{ path: sourcePath, issued: OBSERVATION.source.before, current: edition.pins }] };
  }
  function assertKnownOriginalReceiptInputs(input, kept, label) {
    const { current, identity, source, ordinal, nativeSource, registry } = input, root = nativeSource.root;
    const profile = originalReceiptProfile(kept.receipt.requestId), receipt = kept.receipt;
    assert(kept.kind === ORIGINAL_RECEIPT_BLOCKS.schemaVersion && source === profile.source &&
      kept.sourceChangedSinceAnchor && kept.sourceEdition, label + ": exact original receipt source block");
    const subject = single(profile.subjects, value => value.questionUid === current.questionUid &&
      value.sourceOrdinal === ordinal, label + ": fixed observed original subject");
    assert(receipt.scope === "PARTIAL_UIDS" && receipt.partialUidCount === profile.subjects.length &&
      receipt.totalQuestions === profile.subjects.length && receipt.expectedQuestionCount === profile.expectedQuestions &&
      receipt.approval.type === "FINAL_QA" && receipt.registryChanges?.length === 0,
      label + ": original closed issuance scope");
    assert.strictEqual(receipt.sourceBlobSha1, profile.issuedSource.gitBlobSha1, label);
    assert.strictEqual(receipt.sourceRawSha256, profile.issuedSource.sha256, label);
    assert.deepStrictEqual(receipt.appliedRecords.map(value => ({
      questionUid: value.questionUid, sourceOrdinal: value.sourceOrdinal
    })).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal),
    profile.subjects.map(value => ({ questionUid: value.questionUid, sourceOrdinal: value.sourceOrdinal })), label);
    const bindingPath = RECEIPTS + receipt.requestId + ".source-review-binding.json";
    assert(!receipt.outputDigests.some(value => value.path === bindingPath) &&
      [...receipt.appliedRecords, ...receipt.runtimeRecords].every(value => !value.approvalEvidence.includes(bindingPath)),
      label + ": fixed original issuance did not declare a typed binding");
    assertAuthorityInputs(input, kept, label);
    for (const expected of profile.subjects) {
      const actual = api.currentRows(expected.questionUid);
      assert(actual.runtimeStatus === "ACTIVE" && actual.runtimeOwner === "MIDDLE_GEOMETRY",
        label + ": all original receipt targets retain their owner");
      for (const [key, collection, digestKey] of [
        ["metadata", "appliedRecords", "metadataWholeSha256"],
        ["identity", "appliedIdentityRecords", "identityWholeSha256"],
        ["runtime", "runtimeRecords", "runtimeWholeSha256"]
      ]) {
        const issued = single(receipt[collection], value => value.questionUid === expected.questionUid &&
          value.sourceOrdinal === expected.sourceOrdinal, label + ": original subject " + key);
        assert.deepStrictEqual(actual[key], issued, label + ": all original receipt targets retain whole " + key);
        assert.strictEqual(sha(stable(actual[key])), expected[digestKey], label + ": observed whole " + key);
      }
      const classification = Object.fromEntries([
        "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
        "standardUnitKey", "subUnitKey", "sourceArchiveFile"
      ].map(field => [field, actual.metadata[field]]));
      const check = api.validateActiveMetaFields(classification, registry, { requireFields: false });
      assert(check.status === "VALIDATED" && check.activeBinding, label + ": original current classification");
      const context = api.activeBindingContext({ candidate: actual.metadata, check, registry, runtimeOwner: actual.runtimeOwner });
      assert(!context.reason && context.ownerPack === actual.runtimeOwner, label + ": original current ACTIVE owner");
      assert.strictEqual(sha(stable(nativeSource.bank[expected.sourceOrdinal - 1])),
        expected.currentQuestionWholeSha256, label + ": exact observed target question bytes");
    }
    const sourcePath = "archive/exams/" + source, edition = kept.sourceEdition;
    const originalSources = profile.originalSources.map((ref, index) =>
      readOriginalReceiptSource(root, receipt.requestId, index));
    if (profile.key === "E034_ORDINARY_FINAL_QA_10" || profile.key === "E006_ORDINARY_FINAL_QA_12") {
      assert(receipt.approval.sourceRebind === undefined && receipt.registrationMode === undefined &&
        receipt.fingerprintRepairs.length === profile.subjects.length, label + ": original ordinary FINAL_QA");
      const ref = profile.nativeReview, reviewBytes = boundImmutable(root, ref);
      assert(kept.live(ref.livePath).equals(reviewBytes), label + ": original Native review witness bytes");
      const reviewedSource = immutable(root, ref.commit, sourcePath);
      assert(reviewedSource.equals(originalSources[0]), label + ": original review source commit/path");
      for (const expected of profile.subjects) {
        const repair = single(receipt.fingerprintRepairs, value => value.questionUid === expected.questionUid &&
          value.sourceOrdinal === expected.sourceOrdinal, label + ": original ordinary reassessment");
        assert(repair.rebind === undefined, label + ": original ordinary reassessment kind");
        const review = repair.sourceReview;
        assert.strictEqual(sha(stable(review)), profile.sourceReviewSha256ByUid[expected.questionUid],
          label + ": whole original Native review descriptor");
        assert(review.schemaVersion === "archive-reviewed-source-reassessment-v1" &&
          review.nativeSchemaVersion === "m3-s2-complete-semantic-review-v1" &&
          review.reviewCommit === ref.commit && review.reviewPath === ref.path &&
          review.reviewRef.path === ref.livePath && review.reviewRef.sha256 === ref.sha256 &&
          review.reviewedSourceBlobSha1 === profile.originalSources[0].gitBlobSha1 &&
          review.reviewCommitSourceBlobSha1 === profile.originalSources[0].gitBlobSha1 &&
          review.reviewedSourceSha256 === profile.originalSources[0].sha256 &&
          review.scope === "METADATA_SOURCE_BINDING_ONLY" && review.newMathematicalQa === false, label);
      }
    } else {
      assert.strictEqual(profile.key, "HYANGRIM_Q5_SOURCE_PRESERVATION_1", label);
      assert(receipt.newMetadataApprovals === 0 && receipt.preservedMetadataApprovals === 1 &&
        receipt.fingerprintRepairs.length === 0, label + ": original single approval preservation");
      assert.deepStrictEqual(receipt.approval.sourceRebind,
        { priorReceiptRef: { path: profile.priorReceipt.path, sha256: profile.priorReceipt.sha256 } }, label);
      const priorBytes = immutable(root, OBSERVATION.anchor, profile.priorReceipt.path);
      assert.deepStrictEqual(pins(priorBytes), pinsOnly(profile.priorReceipt), label + ": fixed original prior receipt");
      assert(kept.live(profile.priorReceipt.path).equals(priorBytes), label + ": current original prior receipt");
      const prior = JSON.parse(priorBytes);
      assert(prior.schemaVersion === "archive-reviewed-exam-meta-registration-v2" &&
        prior.metadataRegistrationStatus === "REGISTERED" && prior.scope === "PARTIAL_UIDS" &&
        prior.totalQuestions === 1 && prior.partialUidCount === 1 && prior.expectedQuestionCount === profile.expectedQuestions &&
        prior.approval.type === "FINAL_QA" && prior.approval.metadataReviewed === true &&
        prior.sourceArchiveFile === source && prior.examUid === receipt.examUid &&
        prior.sourceBlobSha1 === profile.originalSources[0].gitBlobSha1 &&
        prior.sourceRawSha256 === profile.originalSources[0].sha256, label + ": original prior authority");
      const withoutTransport = value => {
        const copy = { ...value }; delete copy.metadataRevision; delete copy.approvalEvidence; return copy;
      };
      for (const collection of ["appliedRecords", "appliedIdentityRecords", "runtimeRecords"]) {
        assert.strictEqual(prior[collection].length, 1, label);
        const before = prior[collection][0], after = receipt[collection][0];
        assert(before.questionUid === current.questionUid && before.sourceOrdinal === ordinal, label);
        assert.deepStrictEqual(collection === "appliedIdentityRecords" ? after : withoutTransport(after),
          collection === "appliedIdentityRecords" ? before : withoutTransport(before), label + ": original approved whole row");
        if (collection !== "appliedIdentityRecords")
          assert.deepStrictEqual(after.approvalEvidence,
            [...new Set([...before.approvalEvidence, kept.receiptPath])], label + ": exact preservation evidence append");
      }
      for (const ref of prior.approval.evidenceRefs) {
        assert(SHA256.test(ref.sha256), label);
        const original = immutable(root, OBSERVATION.anchor, ref.path);
        assert.strictEqual(sha(original), ref.sha256, label + ": original prior evidence");
        assert(kept.live(ref.path).equals(original), label + ": current prior evidence");
      }
      const priorBank = api.loadBank(originalSources[0].toString("utf8"), sourcePath);
      assert.strictEqual(priorBank.length, profile.expectedQuestions, label);
      assert.deepStrictEqual(priorBank[ordinal - 1], edition.beforeBank[ordinal - 1],
        label + ": source preservation kept the original whole selected question");
      const repair = single(prior.fingerprintRepairs, value => value.questionUid === current.questionUid &&
        value.sourceOrdinal === ordinal, label + ": original solution repair");
      assert.strictEqual(prior.fingerprintRepairs.length, 1, label);
      assert.strictEqual(repair.rebind.priorSourceBlobSha1, profile.originalSources[1].gitBlobSha1, label);
      assert.strictEqual(api.loadBank(originalSources[1].toString("utf8"), sourcePath).length,
        profile.expectedQuestions, label + ": original solution input denominator");
    }
    assert.deepStrictEqual(edition.currentBank, nativeSource.bank, label);
    assert.strictEqual(sha(stable(input.question)), subject.currentQuestionWholeSha256, label);
    if (subject.expectedPlanReason === "CANONICAL_LABELS_MISSING")
      assert.strictEqual(api.sourceFingerprint(input.question), identity.sourceFingerprint, label);
    else {
      assert.strictEqual(subject.expectedPlanReason, "IDENTITY_SOURCE_FINGERPRINT_MISMATCH", label);
      assert.notStrictEqual(api.sourceFingerprint(input.question), identity.sourceFingerprint, label);
    }
    return { ...kept, expectedPlanReason: subject.expectedPlanReason,
      declaredInputs: { readonlyPaths: [...kept.readPaths].filter(relative => relative !== sourcePath).sort(),
        fontPaths: [], assetPaths: [], sourcePaths: [sourcePath], inventorySize: kept.readPaths.size,
        originalSources: profile.originalSources, originalRequestId: receipt.requestId,
        actualReadonlyObservation: profile.observation || ORIGINAL_RECEIPT_BLOCKS.observation,
        originalReceiptShape: profile.key,
        selectedSource: { anchor: OBSERVATION.anchor, path: sourcePath, observedCommit: edition.commit,
          changes: edition.changes, currentQuestionSha256: subject.currentQuestionWholeSha256,
          currentNativeAuthority: "NOT_GRANTED", currentDisplayQuality: "NOT_REVIEWED" } },
      authenticatedDrifts: [{ path: sourcePath, issued: profile.issuedSource, current: profile.observedSource }] };
  }
  function assertM2E006OriginalInputs(input, kept, repair, profile, label) {
    const root = input.nativeSource.root, typed = repair.sourceReview.m2E006ProblemContinuity;
    const originalRefs = new Map();
    const read = ref => {
      assert(ref && SHA1.test(ref.commit) && SHA256.test(ref.sha256), label + ": original immutable ref");
      const raw = immutable(root, ref.commit, relativePath(ref.path));
      assert.strictEqual(sha(raw), ref.sha256, label + ": original immutable raw");
      if (ref.gitBlobSha1 !== undefined) assert.strictEqual(blob(raw), ref.gitBlobSha1, label + ": original immutable Git");
      if (ref.bytes !== undefined) assert.strictEqual(raw.length, ref.bytes, label + ": original immutable size");
      originalRefs.set(ref.commit + ":" + ref.path, { commit: ref.commit, path: ref.path, ...pins(raw) });
      return raw;
    };
    // The receipt's whole sourceReview is fixed above. Only explicit refs in
    // that issued proof are traversed; global outputDigests are never expanded.
    const refs = value => {
      if (!value || typeof value !== "object") return;
      if (value.commit && value.path && value.sha256) read(value);
      for (const child of Object.values(value)) if (child && typeof child === "object") refs(child);
    };
    refs(repair.sourceReview);
    for (const key of ["nativeReviewedSource", "nativeCommittedSource", "prefigureSource", "currentSource"]) {
      const ref = typed[key], raw = read(ref);
      assert.strictEqual(ref.path, "archive/exams/" + input.source, label + ": original source path");
      const bank = api.loadBank(raw.toString("utf8"), ref.path);
      assert.strictEqual(bank.length, 23, label + ": original source count");
      assert.strictEqual(sha(stable(bank[input.ordinal - 1])), ref.questionSha256, label + ": original selected question whole");
    }
    for (const [sourceKey, assetsKey] of [["nativeReviewedSource", "nativeAssets"], ["nativeCommittedSource", "nativeAssets"],
      ["prefigureSource", "prefigureAssets"], ["currentSource", "currentAssets"]]) {
      const inventory = typed[assetsKey];
      assert(Array.isArray(inventory) && inventory.length > 0 && new Set(inventory.map(ref => ref.path)).size === inventory.length,
        label + ": original asset inventory");
      for (const ref of inventory) {
        assert(ref.path.startsWith("archive/assets/"), label + ": original asset path");
        const raw = read({ ...ref, commit: typed[sourceKey].commit });
        assert(kept.live(ref.path).equals(raw), label + ": original/current declared asset drift");
      }
    }
    const boundEvidence = (ref, commit) => {
      for (const list of [kept.receipt.approval.evidenceRefs, kept.patch.evidenceRefs])
        assert.strictEqual(list.filter(value => same(value, ref)).length, 1, label + ": original evidence pair");
      const raw = read({ ...ref, commit });
      assert(kept.live(ref.path).equals(raw), label + ": original witness live bytes");
      return JSON.parse(raw);
    };
    boundEvidence(typed.reviewRef, typed.reviewCommit);
    for (const ref of typed.originalReviewRefs) {
      const document = boundEvidence(ref, typed.reviewCommit);
      // Authenticate only this target's original observation refs. Other rows
      // in the same immutable review are not a new source/review scope.
      if (Array.isArray(document.rows)) {
        const selected = single(document.rows, row => row.questionUid === input.current.questionUid &&
          row.sourceOrdinal === input.ordinal, label + ": original observed subject");
        refs(selected);
      } else {
        assert(document.questionUid === input.current.questionUid && document.sourceOrdinal === input.ordinal,
          label + ": original singleton observation");
        refs(document);
      }
    }
    for (const full of [profile.technicalRef, profile.visualRef]) {
      const evidence = { path: full.path, sha256: full.sha256 };
      boundEvidence(evidence, full.commit);
      assert.deepStrictEqual(pins(read(full)), { gitBlobSha1: full.gitBlobSha1, sha256: full.sha256, bytes: full.bytes }, label);
    }
    return [...originalRefs.values()].sort((a, b) => (a.commit + a.path).localeCompare(b.commit + b.path));
  }

  function assertKnownInputs(input, label) {
    const kept = assertRetained(input, label), { current, identity, source, ordinal, nativeSource, registry } = input;
    const root = nativeSource.root, head = ancestor(root, OBSERVATION.observed);
    if (kept.kind === ORIGINAL_RECEIPT_BLOCKS.schemaVersion) return assertKnownOriginalReceiptInputs(input, kept, label);
    if (kept.kind === SOURCE_ONLY.schemaVersion) return assertKnownSourceOnlyInputs(input, kept, label);
    if (kept.kind === RHS_ONLY.schemaVersion) return assertKnownRhsInputs(input, kept, label);
    const repair = single(kept.receipt.fingerprintRepairs,
      value => value.questionUid === current.questionUid && value.sourceOrdinal === ordinal, label + ": issued typed repair");
    const candidates = PROOF_KINDS.filter(([key]) => repair.sourceReview?.[key] !== undefined);
    assert.strictEqual(candidates.length, 1, label + ": known typed UI obligation required");
    const [key, schema, technicalSchema] = candidates[0], typed = repair.sourceReview[key];
    assert(typed.schemaVersion === schema && typed.questionUid === current.questionUid &&
      typed.sourceOrdinal === ordinal && typed.sourceArchiveFile === source &&
      typed.requiresOrdinaryNativeValidation !== false, label + ": typed target");
    const isE006 = key === "m2E006ProblemContinuity";
    const e006 = isE006 ? assertM2E006TypedProfile(input, kept, repair) : null;
    const originalE006Inputs = isE006 ? assertM2E006OriginalInputs(input, kept, repair, e006, label) : null;
    const ref = isE006 ? e006.technicalRef : typed.ui?.technicalRef;
    const declared = single(kept.receipt.approval.evidenceRefs, value => value.path === ref?.path,
      label + ": technical evidence ref");
    assert.strictEqual(declared.sha256, ref.sha256, label);
    const raw = boundImmutable(root, ref);
    assert(kept.live(ref.path).equals(raw) && immutable(root, OBSERVATION.anchor, ref.path).equals(raw),
      label + ": issued technical bytes");
    const technical = JSON.parse(raw);
    assert(technical.schemaVersion === technicalSchema && SHA1.test(technical.checkoutCommit) &&
      technical.checkoutCommit === typed.ui.checkoutCommit &&
      technical.status === "TECHNICAL_PASS_VISUAL_REVIEW_PENDING" &&
      technical.executionOwner === "GITHUB_ACTIONS_SUPPORTED_CHROME" &&
      technical.expectedLogicalCases === technical.completedLogicalCases &&
      technical.results?.length === technical.completedLogicalCases &&
      technical.failures?.length === 0 && technical.externalFontResources?.length === 0,
      label + ": issued technical transport");
    const isQ5 = key === "q5CompleteGivenApplication";
    assert.strictEqual(technical.items?.length, isE006 ? 2 : isQ5 ? 1 : 24, label + ": immutable item inventory");
    assert.strictEqual(technical.completedLogicalCases, isE006 ? 4 : isQ5 ? 2 : 48, label + ": immutable case inventory");
    const selected = single(technical.items, value => value.questionUid === identity.questionUid &&
      value.sourceOrdinal === ordinal && value.sourceRef?.path === "archive/exams/" + source,
      label + ": exact UI selected UID/source");

    // Authenticate the original technical inventory first. A known renderer
    // difference never exempts an additional code/font/asset from this loop.
    const inputs = new Map(), sources = new Set(), fontPaths = new Set(), assetPaths = new Set();
    const add = (ref, live, kind) => {
      assert(ref && ref.commit === technical.checkoutCommit, label + ": capture checkout ref");
      authenticateRef(root, ref);
      const previous = inputs.get(ref.path);
      if (previous) assert.deepStrictEqual(pinsOnly(ref), pinsOnly(previous.ref), label + ": mixed declared input pins");
      const row = previous || { ref, live: false, kinds: new Set() };
      row.live ||= live; row.kinds.add(kind); inputs.set(ref.path, row);
      if (kind === "font") fontPaths.add(ref.path);
      if (ref.path.startsWith("archive/assets/")) assetPaths.add(ref.path);
    };
    const addList = (rows, live, kind) => {
      assert(Array.isArray(rows) && rows.length > 0, label + ": declared " + kind + " inventory");
      assert.strictEqual(new Set(rows.map(row => row.path)).size, rows.length, label + ": duplicate " + kind + " path");
      for (const row of rows) add(row, live, kind);
    };
    for (const item of technical.items) {
      assert(UID.test(item.questionUid) && Number.isSafeInteger(item.sourceOrdinal) &&
        item.sourceOrdinal > 0 && item.sourceRef?.path.startsWith("archive/exams/") &&
        item.assetRef?.path.startsWith("archive/assets/"), label + ": declared item binding");
      sources.add(item.sourceRef.path);
      add(item.sourceRef, true, "source"); add(item.assetRef, true, "asset");
    }
    assert.strictEqual(new Set(technical.items.map(item => item.questionUid)).size, technical.items.length,
      label + ": duplicate technical UID");
    addList(technical.servedFiles, true, "served");
    addList(technical.mirroredAssets, !isE006, "mirrored");
    addList(technical.studentFontResources, true, "font");
    for (const value of [technical.manifestRef, technical.checkerRef, technical.identityRef])
      add(value, false, "immutable");
    add(technical.captureHelperRef, isQ5, "capture-helper");
    add(technical.fontLicenseRef, isQ5, "font-license");
    if (isQ5) addList(technical.surfaceRefs, true, "surface");
    if (isE006) {
      addList(technical.surfaceRefs, false, "surface");
      addList(technical.originalFirstBasisRefs, false, "original-basis");
    }

    assertAuthorityInputs(input, kept, label);

    const drifts = [], readonlyPaths = [];
    for (const [relative, entry] of inputs) {
      if (!entry.live) continue;
      // The ordinary selected MD/ID/runtime whole rows are already joined to
      // f9's issued receipt. Never require an old whole generated database.
      if (relative === "archive/data/question_metadata.json" || relative === "archive/data/question_identity_map.json" ||
          relative === SVG_INDEX) continue;
      const actual = kept.live(relative);
      if (sources.has(relative)) {
        const issued = immutable(root, OBSERVATION.anchor, relative);
        if (!actual.equals(issued)) {
          assertObservedSourceEdition(root, relative, issued, actual, label + ": declared source dependency");
        }
        continue;
      }
      const known = OBSERVATION.served.find(row => row.path === relative);
      if (known) {
        assert.deepStrictEqual(pinsOnly(entry.ref), known.before, label + ": unknown captured renderer revision");
        assert.deepStrictEqual(pins(actual), known.after, label + ": unknown live renderer change");
        assert(actual.equals(immutable(root, OBSERVATION.observed, relative)) &&
          actual.equals(immutable(root, head, relative)), label + ": current observed renderer bytes");
        drifts.push({ path: relative, captured: known.before, current: known.after });
      } else {
        assert.deepStrictEqual(pins(actual), pinsOnly(entry.ref), label + ": unknown declared input drift:" + relative);
        readonlyPaths.push(relative);
      }
    }
    assert(drifts.length > 0, label + ": unknown Native null without authenticated observed drift");

    // Use the production normalizer, both roles and global-duplicate rejection.
    // This compares actual issued f9 -> current selected footprint. It does not
    // assert captured UI -> f9 equality, approve closed8 additions or pass Native.
    assert(inputs.get(SVG_INDEX)?.live, label + ": declared generated SVG input");
    let assetRefs;
    if (key === "m2ProblemRenderer21Continuity" || isE006) assetRefs = [selected.assetRef];
    else if (key === "m2Family3ProblemContinuity") {
      assetRefs = FAMILY3_UIDS.map(uid =>
        single(technical.items, item => item.questionUid === uid, label + ": family3 footprint target").assetRef);
    } else {
      assetRefs = [...technical.servedFiles, ...technical.mirroredAssets]
        .filter(value => value.path.startsWith("archive/assets/"));
    }
    assert(assetRefs.length > 0, label + ": closed SVG footprint");
    const issuedSvg = immutable(root, OBSERVATION.anchor, SVG_INDEX), liveSvg = kept.live(SVG_INDEX);
    const issuedEntries = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(issuedSvg), assetRefs);
    const liveEntries = SvgIndexContinuity.selectEntries(SvgIndexContinuity.parseIndex(liveSvg), assetRefs);
    assert.deepStrictEqual(liveEntries, issuedEntries, label + ": unknown selected generated SVG drift");
    return { ...kept, declaredInputs: {
      readonlyPaths: readonlyPaths.sort(), fontPaths: [...fontPaths].sort(), assetPaths: [...assetPaths].sort(),
      sourcePaths: [...sources].sort(), inventorySize: inputs.size,
      selectedSvg: { anchor: OBSERVATION.anchor, path: SVG_INDEX,
        assetPaths: [...new Set(assetRefs.map(value => value.path))].sort(),
        records: issuedEntries.length, sha256: sha(stable(issuedEntries)),
        capturedUiContinuity: "NOT_ASSERTED", currentNativeAuthority: "NOT_GRANTED" }
    }, authenticatedDrifts: drifts, ...(isE006 ? { originalE006Inputs, typedProfile: "EXACT_M2_E006_Q3_Q21" } : {}) };
  }
  function pinsOnly(ref) {
    return { gitBlobSha1: ref.gitBlobSha1, sha256: ref.sha256, bytes: ref.bytes };
  }
  function assertBlocked(input, label) {
    const kept = assertKnownInputs(input, label), { current, identity, source, ordinal, nativeSource } = input;
    const before = sha(stable({ current, identity, runtime: nativeSource.runtimeRecord,
      question: input.question, previous: input.previous, sourceBytes: sha(nativeSource.bytes) }));
    assert.strictEqual(api.nativeReviewReceipt({ ...input, pt: kept.context.pt, tpl: kept.context.tpl,
      ownerPack: kept.context.ownerPack }), null, label + ": current Native must remain unverified");
    const result = api.planQuestion({ ...input, validate: api.validateActiveMetaFields });
    assert.strictEqual(result.status, "SUPPLEMENT_PENDING", label + ": current producer must refuse");
    assert.deepStrictEqual(Object.keys(result).sort(),
      ["status", "reasons", "questionUid", "sourceArchiveFile", "sourceOrdinal"].sort(), label + ": no generated metadata");
    assert.strictEqual(result.questionUid, current.questionUid, label);
    assert.strictEqual(result.sourceArchiveFile, source, label);
    assert.strictEqual(result.sourceOrdinal, ordinal, label);
    const sourceOnly = kept.kind === SOURCE_ONLY.schemaVersion;
    const allowed = new Set([kept.kind === ORIGINAL_RECEIPT_BLOCKS.schemaVersion ? kept.expectedPlanReason
      : sourceOnly ? SOURCE_ONLY.currentRejection : "NATIVE_SOURCE_REVIEW_REVALIDATION_FAILED"]);
    if (!sourceOnly && kept.sourceChangedSinceAnchor) {
      allowed.add("IDENTITY_SOURCE_FINGERPRINT_MISMATCH");
      allowed.add("METADATA_SOURCE_FINGERPRINT_CONFLICT");
    }
    assert(Array.isArray(result.reasons) && result.reasons.length > 0 &&
      result.reasons.every(reason => allowed.has(reason)), label + ": unknown current refusal");
    if (kept.kind === RHS_ONLY.schemaVersion || kept.kind === ORIGINAL_RECEIPT_BLOCKS.schemaVersion)
      assert.deepStrictEqual(result.reasons, [kept.expectedPlanReason], label + ": exact observed current refusal");
    assert.strictEqual(sha(stable({ current, identity, runtime: nativeSource.runtimeRecord,
      question: input.question, previous: input.previous, sourceBytes: sha(nativeSource.bytes) })), before,
      label + ": original producer probe must not mutate issued inputs");
    return { ...kept, proof: { ...kept.proof, currentNativeReady: false, currentReadiness: "BLOCKED", readinessBasis: kept.kind,
      currentPlan: { status: result.status, reasons: result.reasons }, authenticatedDrifts: kept.authenticatedDrifts,
      declaredInputs: kept.declaredInputs,
      firstNativeFailureSite: "NOT_INFERRED_FROM_NULL", currentDisplayQuality: "NOT_REVIEWED" } };
  }
  return { assertRetained, assertKnownInputs, assertBlocked };
}
module.exports = { createIssuedApprovalObserver, readOriginalNativeSource, assertOriginalNativeSourceBytes,
  readRhsOriginalNativeSource, assertRhsOriginalNativeSourceBytes,
  readOriginalReceiptSource, assertOriginalReceiptSourceBytes, assertM2E006TypedProfile };
