#!/usr/bin/env node
'use strict';
// Closed read-only ops gate; only a disjoint private derived index and UI proof copies vary.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const{execFileSync,spawnSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-m3-current-ui-source49-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m3-current-ui-registration-26fc-20261117",
  "integrationAncestor": "6d8819debc1aa33b6bb0a41dcb8c6cb852c1e458",
  "visualAncestor": "e371e50ba8cb3e317c32cf1d1478b832bb0444c2",
  "files": [
    {
      "path": "archive/tools/meta-foundation/reviewed-m3-e052-q5-complete-given.mjs",
      "gitBlobSha1": "9395012e8c6c7af8cae33586b3e39f3081ffea04",
      "sha256": "904f664a60ffb4c6e5503916a8a3f60d664318633018fec8f8d35a7d4c6a64e2",
      "bytes": 50976
    },
    {
      "path": "tools/4slot/m3-e052-q5-complete-given-continuity.cjs",
      "gitBlobSha1": "a3929b0965545a279486c81b060357bfc66b5d03",
      "sha256": "f26f136f4e1fea5409512df26fec6815929d88177ce235d5fecdfdf5cb6ac3b7",
      "bytes": 9456
    },
    {
      "path": "tools/4slot/m3-e052-q5-complete-given-continuity.mjs",
      "gitBlobSha1": "d0f424928ccca3905055bbac0569f0460cfbe376",
      "sha256": "2cf2b87e7f0dab41a0073edf392e41d8d28c41f18e5463042730685650c2ee42",
      "bytes": 16035
    },
    {
      "path": "tools/4slot/m3s2-layout-continuity.cjs",
      "gitBlobSha1": "ba7f9dd3772cf0a40d1110618b1fd6be2f3bb130",
      "sha256": "c811ffdff4e2cfe98c476e7f84d23185a18c43e6e5824d0fae0df21fe2f3fcf1",
      "bytes": 44099
    },
    {
      "path": ".archive-meta-register/4slot-m3s2-layout-continuity/qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf.json",
      "gitBlobSha1": "8a54a3d9a00dabed465b495b0c89723eb0a600cb",
      "sha256": "09f91865024aaa7b2162244d8abaf6a2bdd76c7df81342bd1e242a013659dfd4",
      "bytes": 6642
    },
    {
      "path": "tests/archive-m3-e052-q5-current-ui-reuse.test.mjs",
      "gitBlobSha1": "a11402180c3b1f5a124905dbdb5e1ff78c34d600",
      "sha256": "896f16b36f9cb2878f758f80ed0a836fde765dc78cfc76d9f697af691004e1ac",
      "bytes": 8192
    },
    {
      "path": "tests/archive-m3s2-current-ui-reuse.test.cjs",
      "gitBlobSha1": "4679eaa3bd8c11589babe4d2f1a741f976063fa7",
      "sha256": "f6ca2113f54ac97d06954e7c3234ae7c093a35a3dc41e229b90f73e012f598e7",
      "bytes": 11069
    },
    {
      "path": "tools/ci/archive-pr-native-preview.mjs",
      "gitBlobSha1": "5960a0744db1e3979c95b1108856d56a834ab118",
      "sha256": "a495f97b108967ee291cebc84e8a1942d8b09f52ff1025baa698b1618b8f52c8",
      "bytes": 116747
    },
    {
      "path": "tests/archive-pr-q5-current-ui-shadow.test.mjs",
      "gitBlobSha1": "132b230ab813a07659f0b07d11f3ae8bffccb2f3",
      "sha256": "786cd692fcfd2485b91f72ff3a205a0e482aa14d89f03857d3717797ae6cb3ce",
      "bytes": 22883
    },
    {
      "path": ".archive-meta-register/4slot-m3-e052-q5-complete-given/qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1.json",
      "gitBlobSha1": "d5776277d104277ab625fa6e66c5d50b90f283e8",
      "sha256": "edcbd2bd8d55c8fc111ba8d693a6cd1ead274f7a225b2849b75a621d865a8fdc",
      "bytes": 4614
    }
  ],
  "codePins": [
    {
      "path": "tools/4slot/build-4slot-runtime.cjs",
      "gitBlobSha1": "9fb98cdddc54bd5474ccf81b68d589617396de1c",
      "sha256": "1a84c4543209fb842065093fa05aa35c02fb2216e3fb6482745c91f3dc435873",
      "bytes": 41001
    },
    {
      "path": "archive/item-4slot.js",
      "gitBlobSha1": "249e0af23b6a011d1247399ef487a635222e1e27",
      "sha256": "0845bd881541a0b3f8faaf709b12274d09f29805bc36870bc245d12f4bfdab7d",
      "bytes": 8639
    },
    {
      "path": "archive/tools/meta-foundation/reviewed-source-reassessment.mjs",
      "gitBlobSha1": "67a469c022bf3e04049723098d659b025eaa9c88",
      "sha256": "9efe04730bf2e2d54081a9c255c0d1d6e6de6926826cddf7db28e36b8658da46",
      "bytes": 37364
    }
  ],
  "groups": [
    {
      "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
      "count": 25,
      "sourceRef": {
        "commit": "dd2d5d9dca6ee625500d0d5b3d201717190a9a7e",
        "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
        "gitBlobSha1": "82c627bacb59105e9bd3a5397d4828757308d587",
        "sha256": "996ba1f2538b060c96f6528fc90c62affa567285a6a24d2106051199f9a348d1",
        "bytes": 66658
      },
      "compactRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "archive/data/item-4slot/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.4slot.json",
        "gitBlobSha1": "4f996d2c2d1c170554b2711e664c7fe9422591ec",
        "sha256": "5f821ee0847061d5f964b4a6f84597b0102c66e3c30075c84cef406c694971a1",
        "bytes": 5278
      },
      "dictionaryRef": {
        "commit": "bc0af77466f92f32b2044c452e2f1418bbae4cf0",
        "path": "docs/architecture/4slot/term-dictionary-v1.6.json",
        "gitBlobSha1": "07920194882d3924ac50e8bbffc5b723c3fc5e89",
        "sha256": "9d55b5f1172b13c3d05802b65963a18368d50b1659b31fa36aa52a27605e579d",
        "bytes": 367619
      }
    },
    {
      "sourceArchiveFile": "original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js",
      "count": 24,
      "sourceRef": {
        "commit": "a66a389b96525f67e2868a000184039e08627e9f",
        "path": "archive/exams/original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js",
        "gitBlobSha1": "80043be4a26d379664740f0846720bba38f31d5a",
        "sha256": "02614aa1dcd88aa933aa81712074fb66597867fd3d3673bb3bb23312bc91636b",
        "bytes": 63188
      },
      "compactRef": {
        "commit": "8377221debc9200dff7e647ae1a772d8d5a2e8be",
        "path": "archive/data/item-4slot/original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.4slot.json",
        "gitBlobSha1": "f4893c501ed00113c370827bf508f86a73a5e8b1",
        "sha256": "43350f9e38ee141503b5f738ee2cd76100975604b6c1c265adc68d4c940dd89f",
        "bytes": 4821
      },
      "dictionaryRef": {
        "commit": "8377221debc9200dff7e647ae1a772d8d5a2e8be",
        "path": "docs/architecture/4slot/term-dictionary-v1.6.json",
        "gitBlobSha1": "07920194882d3924ac50e8bbffc5b723c3fc5e89",
        "sha256": "9d55b5f1172b13c3d05802b65963a18368d50b1659b31fa36aa52a27605e579d",
        "bytes": 367619
      }
    }
  ],
  "selected": [
    {
      "key": "Q5",
      "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
      "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
      "sourceOrdinal": 5,
      "path": ".archive-meta-register/4slot-m3-e052-q5-complete-given/qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1.json",
      "binding": "M3_E052_Q5_COMPLETE_GIVEN_EXISTING_VECTOR",
      "refField": "q5CompleteGivenContinuityRef",
      "deleteReason": "M3_Q5_CLAIM_MISSING_OR_MIXED"
    },
    {
      "key": "Q16",
      "questionUid": "qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf",
      "sourceArchiveFile": "original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js",
      "sourceOrdinal": 16,
      "path": ".archive-meta-register/4slot-m3s2-layout-continuity/qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf.json",
      "binding": "M3S2_EXISTING_LAYOUT_CONTINUITY",
      "refField": "layoutContinuityRef",
      "deleteReason": "M3S2_LAYOUT_CLAIM_MISSING_OR_MIXED"
    }
  ],
  "q5Refs": {
    "technicalRef": {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/technical-proof.json",
      "gitBlobSha1": "0cd74ab0be77a70badcabc655b811bb02cbb9209",
      "sha256": "9248d818ec7c44d3f8f4273526c4af1d70624385d185b63db3270e1324b2c279",
      "bytes": 76724
    },
    "visualRef": {
      "commit": "e371e50ba8cb3e317c32cf1d1478b832bb0444c2",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/visual-current-reuse-v1.json",
      "gitBlobSha1": "c12986521a343b4d4ea3dac5fb5282617c5cc69f",
      "sha256": "f7b575307f2105c5e03a96b4b601e8c22953263723810843338a30c043a7ebf3",
      "bytes": 7372
    },
    "priorTechnicalRef": {
      "commit": "1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2",
      "path": "docs/operations/m3-e052-q5-complete-given-20261116/student-ui-technical-v1.json",
      "gitBlobSha1": "e3acc11099e73b7b8cf7d9d1f5d975a3acc10ccb",
      "sha256": "c96b586c177b4958620c658a0d135e04c3e66d66e4374a4e2b6941c847d44e2f",
      "bytes": 76825
    },
    "priorVisualRef": {
      "commit": "1dbeaaa687d48f74b381c1dc5d2c330f1bfe4ea2",
      "path": "docs/operations/m3-e052-q5-complete-given-20261116/student-ui-independent-v1.json",
      "gitBlobSha1": "ba2b198f2e8876f2667f29e12e595556714460c5",
      "sha256": "d3a1eaa44d2801af173f7721d634cc6788ecfad46428ac80693f9fccbb2bf95e",
      "bytes": 1736
    },
    "witnessRef": {
      "commit": "006e6455f69c092c3251d440daf0c4b07da7a469",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m3/current-four-display-equivalence-v1.json",
      "gitBlobSha1": "56ec9409ca900e94a46d6562e6e9189aedac7d43",
      "sha256": "07632bee16334ab68a80b3433db7b32daa145053b68156b68244b9145ebeaa7e",
      "bytes": 37970
    },
    "framesRef": {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/producer-frames.jsonl",
      "gitBlobSha1": "439b8fc9187f3907a63a16af5841251952024533",
      "sha256": "c822e4bac3fb2ba1a21657f89f838d35bedbe08820d418021ec75c72c666d628",
      "bytes": 197175
    },
    "artifacts": [
      {
        "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
        "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-desktop-tile-01.png",
        "gitBlobSha1": "9d96646282e97104a032c81c03451bda8794eb1b",
        "sha256": "600ad7c79c86889cc1f1bba376c929d67fc942aa495a08dcb77c2a48f612aa1f",
        "bytes": 28776
      },
      {
        "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
        "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q5/E052-Q5-mobile-tile-01.png",
        "gitBlobSha1": "a977c9c35a5b2a5bb4fd90c23ffbc16d30e9d908",
        "sha256": "d83399fdf70d554a7505310b038b490ca55730d962f040e83bbf2606e614ccab",
        "bytes": 30805
      }
    ]
  },
  "q16Refs": {
    "technicalRef": {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q16/technical-proof.json",
      "gitBlobSha1": "93f7d450d8c025a0e9e13f8fe7d2e853fcdf16e5",
      "sha256": "f3aed5e059efdb74b542c9ff3ca71f5668d5b4505599af628307d76f57297a12",
      "bytes": 72140
    },
    "visualRef": {
      "commit": "e371e50ba8cb3e317c32cf1d1478b832bb0444c2",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q16/visual-current-reuse-v1.json",
      "gitBlobSha1": "e97b9239521286baa7dec7216de745b30c3f55a5",
      "sha256": "587e750ec40543da076f3f1129a02a34e3caaf509696043d2629ffd78a4dcca5",
      "bytes": 6909
    },
    "priorTechnicalRef": {
      "commit": "29494e8d5a1dac11a542b0b402d0f854c5cb452e",
      "path": "docs/operations/m3s2-q16-layout-ui-26fc-20261116/technical-proof.json",
      "gitBlobSha1": "ed5e933876e02bbbe597f4df34e3d85ce3cc47ab",
      "sha256": "31cdd2904799b243ff7d85e43756f27c5c055e2c4e9f5bac4a648652db23fce1",
      "bytes": 72254
    },
    "priorVisualRef": {
      "commit": "933fb9238f617d1924aa823633ff6f23fde8a37d",
      "path": "docs/operations/m3s2-q16-layout-ui-26fc-20261116/independent-visual-review.json",
      "gitBlobSha1": "9030d5bdbd75858eff6af3884ae806ee30088510",
      "sha256": "7faa8035dcc9b6b3f2d608588adb39a5fb242de22ae33347bfd84ef2678f73d3",
      "bytes": 2048
    },
    "witnessRef": {
      "commit": "006e6455f69c092c3251d440daf0c4b07da7a469",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m3/current-four-display-equivalence-v1.json",
      "gitBlobSha1": "56ec9409ca900e94a46d6562e6e9189aedac7d43",
      "sha256": "07632bee16334ab68a80b3433db7b32daa145053b68156b68244b9145ebeaa7e",
      "bytes": 37970
    },
    "framesRef": {
      "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
      "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q16/producer-frames.jsonl",
      "gitBlobSha1": "f321736234b755d5acd5173fc8a00276389ef659",
      "sha256": "aba4b5c5555269eb8187241f576914c833b487ebeca8820e3d2d8cb0c4b9d17b",
      "bytes": 161762
    },
    "artifacts": [
      {
        "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
        "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q16/E008-Q16-desktop-tile-01.png",
        "gitBlobSha1": "9b2057478538aae62881fc434f4ca825ce7e7256",
        "sha256": "b12e1f0ac18d5d903518afa714a311c67cdcfda191c3bf9ee5d20b67df32fc61",
        "bytes": 28361
      },
      {
        "commit": "90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3",
        "path": "docs/operations/middle-current-ui-26fc-20261117/run-44015662986/q16/E008-Q16-mobile-tile-01.png",
        "gitBlobSha1": "d4353601dda1f361da12e3b885861be0e64096dc",
        "sha256": "3fe2010b0513b607f302625dfb2298f1dbe370d9237d6d728b8e56c1bd03ce1f",
        "bytes": 10552
      }
    ]
  },
  "q5OldCursorRef": {
    "commit": "8c27587b8e7bbab6d35e0bc1d95d0c2a1beb63cd",
    "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
    "gitBlobSha1": "5a9e25d32e96a19bb6bb2f2f8265446cb92fee34",
    "sha256": "ccab19ec3a0546078515c3a5d0da6396d18bb7f134c9e53847d7b7fc7f7cadb9",
    "bytes": 66266
  },
  "oldQ16SidecarRef": {
    "commit": "8c5b782f706f7c47bbbce56129844899c1697075",
    "path": ".archive-meta-register/4slot-m3s2-layout-continuity/qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf.json",
    "gitBlobSha1": "0874eaad4c591ab35ad0996c1e445ade67f98c61",
    "sha256": "1b25e5e592d05428e6818d63f27f0f18c20940524622bd3928e14623e64fad6a",
    "bytes": 6568
  },
  "focusedReuse": {
    "report": {
      "path": "docs/operations/m3-current-ui-source49-26fc-20261117/run-44052082242/scoped-report.json",
      "gitBlobSha1": "55b4d012fb9a3c828169fdcc252501947cdf4c2c",
      "sha256": "19a81e954085c7e993e88afb1269cd324c3d8b2e2dead1608300480f888384da",
      "bytes": 9581
    },
    "runId": "44052082242",
    "head": "e0533cb4b9f5b371165eac6d5efd2e8d95a7c0d7",
    "gate": {
      "commit": "e0533cb4b9f5b371165eac6d5efd2e8d95a7c0d7",
      "path": "tools/4slot/check-m3-current-ui-scoped.cjs",
      "gitBlobSha1": "53fb919e8f6112394a931bca73b61d148c2a0a6b",
      "sha256": "e6b4b19dede67ebf432b2bbfc84c2fe62a084ffdb0974c596f84a6a4183a1273",
      "bytes": 53316
    },
    "focusedGroups": [
      {
        "name": "Q5_SHADOW_READONLY61",
        "observed": 61,
        "reuse": 61
      },
      {
        "name": "Q5_FOCUSED44_AND_ORIGINAL_NATIVE1",
        "observed": 45,
        "reuse": 44
      },
      {
        "name": "Q16_FOCUSED43_AND_EXISTING_AUTHORITY1",
        "observed": 44,
        "reuse": 44
      }
    ],
    "allowedCodeDeltas": [
      {
        "path": "archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs",
        "before": {
          "gitBlobSha1": "0fcbb1be605cd1418bd71fa91b24acd3bda0fc87",
          "sha256": "b9485fb7db68ea6f15b9e2b4d0f7c0567c9457faa5ab82dfceba903e1a5a6c0b",
          "bytes": 65666
        },
        "after": {
          "gitBlobSha1": "7a2cc6c166deef9d2664f8d4ff29835c3854ea3d",
          "sha256": "c1fcd1eacfcb5a1737396bbf3433028a60af6346ef4fe24e0b3d2c04e4615079",
          "bytes": 68629
        }
      },
      {
        "path": "archive/tools/meta-foundation/reviewed-source-reassessment.mjs",
        "before": {
          "gitBlobSha1": "02549be443e029f094ae9e0213865b91063d6930",
          "sha256": "324d1d6bc33f4ad13928f80cb59eab1270c946457e76f2dc494e6fae6c7ed89b",
          "bytes": 36945
        },
        "after": {
          "gitBlobSha1": "67a469c022bf3e04049723098d659b025eaa9c88",
          "sha256": "9efe04730bf2e2d54081a9c255c0d1d6e6de6926826cddf7db28e36b8658da46",
          "bytes": 37364
        }
      },
      {
        "path": "archive/tools/meta-foundation/reviewed-m2-native-rpm-course.mjs",
        "before": {
          "gitBlobSha1": "df188f7e3666cfa71c7ec9caaed21ee138734bcf",
          "sha256": "2d49c620ea3387f8779d198c351af38f3f4dc962a3f9fad6303c952f37bcef0d",
          "bytes": 41786
        },
        "after": {
          "gitBlobSha1": "8a5fce2336624f24866ba32133a92aabdc25b52e",
          "sha256": "f4a4581b14aa3c370fc288184b7876e7493a2340fa1ce570365572f6cac8d09d",
          "bytes": 42180
        }
      }
    ],
    "codeDeltaIndependentReview": {
      "gitBlobSha1": "be639bd37a7f8e5a06a1ef2cf4456610549bfaf6",
      "sha256": "a5a854dbb106a72331f78c462d5de4b7d07b6ecc87125eb915adbc2694540132",
      "bytes": 6798
    }
  },
  "q5OriginalTypedAncestorLiveRefs": [
    {
      "commit": "50d001f8ab5a9a4dbfc749edb30916fb15c8dc0a",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-audit-e052-native2-course-r2-20261116.json",
      "gitBlobSha1": "e01550ad3fde0f4970467a9386c3a8c06bd6f12c",
      "sha256": "c44a99b1b1b09bfdde74d46819115d1369fb9bbbc7f602c79477375450848be3",
      "bytes": 29781
    },
    {
      "commit": "50d001f8ab5a9a4dbfc749edb30916fb15c8dc0a",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-audit-e052-native2-course-r2-20261116.source-review-binding.json",
      "gitBlobSha1": "119bcc32412c805aa144700a4652be195c650092",
      "sha256": "de13eeb7e26812fdf3970cf15cb54c49b8f0e39f53884ac5808af963ea195126",
      "bytes": 15753
    }
  ],
  "q5OriginalTypedSourceRef": {
    "commit": "d422885a338e06169739815f0f717d7d035ef7a1",
    "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
    "gitBlobSha1": "533c93f017e1640ba9764925b2f164aaeaae9bb7",
    "sha256": "cc6c9ac3347716da154d24321207395cc24539b34a6b99087ae2e5866e087c27",
    "bytes": 66316
  },
  "generatedPaths": [
    "archive/data/question_metadata.json",
    "archive/data/question_identity_map.json",
    "archive/data/svg-accessibility-index.js"
  ]
};

const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const SVG='archive/data/svg-accessibility-index.js',INDEX='archive/data/item-4slot-index.json';
const OID=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
 ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const vector=row=>Object.fromEntries(['format','given','goal','method','condition','candidates'].map(k=>[k,row[k]]));
const json=b=>JSON.parse(b.toString('utf8'));
function need(ok,code){if(!ok)throw Error('M3_SOURCE49_'+code);}
function safeRelative(rel){
 need(typeof rel==='string'&&rel.length>0&&!path.posix.isAbsolute(rel)&&!/[\\\x00-\x1f]/.test(rel)&&
  rel.split('/').every(p=>p&&p!=='.'&&p!=='..'),'PATH');
 return rel;
}
function file(root,rel){
 safeRelative(rel);let p=root;
 for(const part of rel.split('/')){p=path.join(p,part);const s=fs.lstatSync(p);need(!s.isSymbolicLink(),'SYMLINK');}
 need(fs.statSync(p).isFile(),'REGULAR_FILE');return p;
}
function git(root,args,options={}){
 const env={...process.env};delete env.GIT_NO_LAZY_FETCH;env.GIT_OPTIONAL_LOCKS='0';
 return execFileSync('git',['-C',root,...args],{env,maxBuffer:160*1024*1024,timeout:180000,
  stdio:['ignore','pipe','pipe'],...options});
}
function pin(raw,expected,label){
 need(Buffer.isBuffer(raw)&&raw.length===expected.bytes&&blob(raw)===expected.gitBlobSha1&&sha(raw)===expected.sha256,'PIN_'+label);
}
function refShape(ref){
 const valid=ref&&OID.test(ref.commit||'')&&OID.test(ref.gitBlobSha1||'')&&SHA.test(ref.sha256||'')&&
  Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<=128*1024*1024;
 if(!valid){
  const fields={};
  for(const key of['commit','path','gitBlobSha1','sha256','bytes']){
   const value=ref?.[key],type=value===null?'null':Array.isArray(value)?'array':typeof value;
   const entry={present:!!ref&&Object.hasOwn(ref,key),type};
   if(type==='string'){
    const safeValue=key==='path'?value.length<=512&&!/[\x00-\x1f]/.test(value):
     key==='sha256'?SHA.test(value):key==='commit'||key==='gitBlobSha1'?OID.test(value):false;
    if(safeValue)entry.value=value;else{entry.characters=value.length;entry.valueSha256=sha(value);}
   }else if(type==='number'&&Number.isFinite(value))entry.value=value;
   fields[key]=entry;
  }
  const error=Error('M3_SOURCE49_IMMUTABLE_REF');error.referenceShapeFailure={fields};throw error;
 }
 return {commit:ref.commit,path:safeRelative(ref.path),gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes};
}
function refsIn(value,out=[],pointer='$',owner=null,resolveDeclared=null){
 if(Array.isArray(value)){for(let i=0;i<value.length;i++)refsIn(value[i],out,pointer+'['+i+']',owner,resolveDeclared);}
 else if(value&&typeof value==='object'){
  if(Object.hasOwn(value,'commit')&&Object.hasOwn(value,'gitBlobSha1')&&Object.hasOwn(value,'path')){
   try{out.push(refShape(resolveDeclared?resolveDeclared(value,owner,pointer):value));}
   catch(error){
    if(error.referenceShapeFailure)error.referenceShapeFailure.location={
     document:owner?{commit:owner.commit||null,path:owner.path||null}:null,
     pointer:pointer.length<=2048?pointer:null,pointerSha256:sha(pointer)};
    throw error;
   }
  }else for(const[k,x]of Object.entries(value))if(k!=='outputDigests')refsIn(x,out,pointer+'.'+k,owner,resolveDeclared);
 }
 return out;
}
function leafPaths(value,out=[]){
 if(Array.isArray(value)){for(const x of value)leafPaths(x,out);}
 else if(value&&typeof value==='object'){
  for(const[k,x]of Object.entries(value)){
   if(k==='outputDigests')continue;
   if(typeof x==='string'&&/^(?:docs\/operations\/|archive\/data\/(?:meta-review|meta-foundation\/evidence)\/|\.archive-meta-register\/evidence\/)/.test(x)&&x.endsWith('.json'))out.push(safeRelative(x));
   else if(x&&typeof x==='object')leafPaths(x,out);
  }
 }
 return out;
}
function reportOutput(p){
 const base=fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),out=path.resolve(p);
 need(out.startsWith(base+path.sep),'REPORT_OUTSIDE_RUNNER_TEMP');return out;
}
function safeError(error){
 const raw=String(error?.message||error||''),code=raw.split(':')[0];
 return {code:/^[A-Z][A-Z0-9_+|-]{0,179}$/.test(code)?code:'UNCLASSIFIED_FAILURE',sha256:sha(raw)};
}
function focusedFailureMetadata(stdout,stderr){
 const source=String(stdout),lines=source.split(/\r?\n/),starts=[];
 for(let i=0;i<lines.length;i++)if(/^\s*not ok [0-9]+ - /.test(lines[i]))starts.push(i);
 const enumTokens=text=>[...new Set(String(text).match(/\b(?:PR_NATIVE_PREVIEW:[A-Z][A-Z0-9_]*|Q5_SHADOW_[A-Z0-9_]+|M3_[A-Z0-9_]+|M2_[A-Z0-9_]+|ERR_[A-Z0-9_]+|ENOENT|ENOTDIR|EISDIR|EACCES|ETIMEDOUT)\b/g)||[])].slice(0,16);
 const failed=starts.slice(0,64).map(start=>{
  const header=lines[start].match(/^\s*not ok ([0-9]+) - (.*)$/),name=header[2];
  let end=start+1;
  while(end<lines.length&&!/^\s*(?:# Subtest:|(?:not )?ok [0-9]+ - |1\.\.[0-9]+|# (?:tests|pass|fail) [0-9]+)/.test(lines[end]))end++;
  const block=lines.slice(start,end).join('\n'),fields={},locations=[];
  for(const line of lines.slice(start+1,end)){
   const field=line.match(/^\s+(failureType|code|operator):\s*['"]?([A-Za-z][A-Za-z0-9_]{0,79})['"]?\s*$/);
   if(field)fields[field[1]]=field[2];
  }
  for(const match of block.matchAll(/((?:tests|tools|archive\/tools)\/[A-Za-z0-9_./-]+\.(?:mjs|cjs|js)):([0-9]+):([0-9]+)/g)){
   const value={path:match[1],line:Number(match[2]),column:Number(match[3])};
   if(!locations.some(x=>x.path===value.path&&x.line===value.line&&x.column===value.column))locations.push(value);
   if(locations.length===8)break;
  }
  return{testNumber:Number(header[1]),testName:/^[A-Za-z0-9 _./:#(),+\[\]-]{1,360}$/.test(name)?name:null,
   testNameSha256:sha(name),...fields,guardTokens:enumTokens(block),locations,blockSha256:sha(block)};
 });
 return{schemaVersion:'archive-focused-test-failure-metadata-v1',observedFailureHeaders:starts.length,
  reportedFailureHeaders:failed.length,truncated:starts.length>failed.length,failed,
  stderrGuardTokens:enumTokens(stderr),freeErrorTextIncluded:false,actualExpectedValuesIncluded:false,sourcePayloadIncluded:false};
}
function phase(report,name){report.phase=name;console.log(JSON.stringify({schemaVersion:CONFIG.schemaVersion,phase:name,status:'RUNNING'}));}
function provenance(root){
 const e=process.env,head=git(root,['rev-parse','HEAD']).toString().trim();
 need(e.GITHUB_ACTIONS==='true'&&e.GITHUB_EVENT_NAME==='push'&&e.GITHUB_REPOSITORY===CONFIG.repository&&
  e.GITHUB_REF===CONFIG.branch&&e.GITHUB_SHA===head&&e.ARCHIVE_M3_SOURCE49_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
 const event=json(fs.readFileSync(e.GITHUB_EVENT_PATH));
 need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
  event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
 need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
  e.GITHUB_JOB==='m3-current-authority','OPS_RUN');
 need(git(root,['rev-parse','--is-shallow-repository']).toString().trim()==='false','FULL_HISTORY_REQUIRED');
 for(const commit of[CONFIG.integrationAncestor,CONFIG.visualAncestor])git(root,['merge-base','--is-ancestor',commit,head]);
 return {provider:'GITHUB_ACTIONS',repository:CONFIG.repository,eventName:'push',ref:CONFIG.branch,checkoutCommit:head,
  eventCommit:event.after,runId:e.GITHUB_RUN_ID,runAttempt:Number(e.GITHUB_RUN_ATTEMPT),job:e.GITHUB_JOB,
  integrationAncestor:CONFIG.integrationAncestor,visualAncestor:CONFIG.visualAncestor};
}

function run(root,output){
 root=fs.realpathSync(root);output=reportOutput(output);
 const report={schemaVersion:CONFIG.schemaVersion,status:'RUNNING',phase:'PROVENANCE',
  sourceQuestionCount:49,selectedQuestionCount:2,outsideQuestionCount:47,
  newMathematicalQa:0,newSemanticApprovals:0,newFourSlotVectors:0,newNativeApprovals:0,
  globalBuilderRun:false,mainWrites:0,sourceWrites:0,trackedCheckoutWrites:0,ChromeRuns:0};
 let work,fixture,rootHead,rootStatus,checkpoint=[];
 const currentInputs=new Map(),immutableInputs=new Map(),fixtureInputs=new Map(),rawPins=new Map();
 const publish=()=>{
  fs.mkdirSync(path.dirname(output),{recursive:true});
  const raw=Buffer.from(JSON.stringify(report,null,2)+'\n');need(raw.length<=2*1024*1024,'REPORT_SIZE');
  fs.writeFileSync(output,raw);
  const payload=raw.toString('base64'),width=6000,chunks=Math.ceil(payload.length/width);
  const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'M3_SOURCE49_EXISTING_AUTHORITY',
   bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw),chunks};
  console.log('ARCHIVE_SCOPED_REPORT_BEGIN '+JSON.stringify(receipt));
  for(let i=0;i<chunks;i++)console.log('ARCHIVE_SCOPED_REPORT_CHUNK '+JSON.stringify({index:i,data:payload.slice(i*width,(i+1)*width)}));
  console.log('ARCHIVE_SCOPED_REPORT_END '+JSON.stringify(receipt));
 };
 try{
  report.execution=provenance(root);rootHead=report.execution.checkoutCommit;
  rootStatus=git(root,['status','--porcelain=v1','--untracked-files=all']).toString();need(rootStatus==='','ROOT_DIRTY');
  for(const expected of[...CONFIG.files,...CONFIG.codePins]){
   const bytes=fs.readFileSync(file(root,expected.path));pin(bytes,expected,'CODE');
   need(git(root,['rev-parse',rootHead+':'+expected.path]).toString().trim()===expected.gitBlobSha1,'CODE_HEAD');
  }
  const builder=require(path.join(root,'tools/4slot/build-4slot-runtime.cjs'));
  const consumer=require(path.join(root,'archive/item-4slot.js'));
  const Q5=require(path.join(root,'tools/4slot/m3-e052-q5-complete-given-continuity.cjs'));
  const Q16=require(path.join(root,'tools/4slot/m3s2-layout-continuity.cjs'));
  const {sourceNumber,sourceIdentityNumber}=require(path.join(root,'tools/4slot/exam-items.cjs'));
  work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'m3-source49-'));
  fixture=path.join(work,'fixture');
  git(root,['clone','--quiet','--shared','--no-checkout','--no-hardlinks',root,fixture]);
  need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD');
  const commits=new Set(),objectSeen=new Set(),objectCache=new Map(),queue=[],queued=new Set(),parsedDocs=new Set();
  let objectCacheBytes=0;
  function ensureCommit(commit){
   need(OID.test(commit),'COMMIT');if(commits.has(commit))return;
   try{git(root,['cat-file','-e',commit+'^{commit}']);}
   catch{git(root,['fetch','--quiet','--no-tags','--no-write-fetch-head','https://github.com/'+CONFIG.repository+'.git',commit]);}
   git(root,['cat-file','-e',commit+'^{commit}']);commits.add(commit);need(commits.size<=128,'COMMIT_BOUND');
  }
  function object(oid){
   need(OID.test(oid),'OBJECT_OID');if(objectCache.has(oid))return objectCache.get(oid);
   const bytes=git(root,['cat-file','blob',oid]);need(blob(bytes)===oid,'OBJECT_BYTES');
   objectSeen.add(oid);rawPins.set(oid,{gitBlobSha1:oid,sha256:sha(bytes),bytes:bytes.length});
   if(bytes.length<=4*1024*1024&&objectCacheBytes+bytes.length<=96*1024*1024){objectCache.set(oid,bytes);objectCacheBytes+=bytes.length;}
   return bytes;
  }
  function immutable(ref){
   ref=refShape(ref);const key=ref.commit+':'+ref.path;
   if(ref.path.startsWith('archive/exams/'))need(CONFIG.groups.some(g=>g.sourceRef.path===ref.path),'UNRELATED_SOURCE_REF');
   ensureCommit(ref.commit);
   const entry=git(root,['ls-tree','-z',ref.commit,'--',ref.path]).toString();
   const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
   if(!(match&&match[2]===ref.gitBlobSha1&&match[3]===ref.path))report.immutablePathFailure={
    expected:ref,observed:{singleRegularBlob:Boolean(match),gitBlobSha1:match?match[2]:null,
     path:match?match[3]:null,treeEntrySha256:sha(entry),treeEntryBytes:Buffer.byteLength(entry)}};
   need(match&&match[2]===ref.gitBlobSha1&&match[3]===ref.path,'IMMUTABLE_PATH');
   let bytes=null;const known=rawPins.get(ref.gitBlobSha1);
   if(known)need(known.bytes===ref.bytes&&known.sha256===ref.sha256,'IMMUTABLE_RAW_ALIAS');
   if(!known||ref.bytes<=4*1024*1024){bytes=object(ref.gitBlobSha1);pin(bytes,ref,'IMMUTABLE');}
   const old=immutableInputs.get(key);
   if(old)need(stable(old)===stable(ref),'IMMUTABLE_CONFLICT');else immutableInputs.set(key,ref);
   need(immutableInputs.size<=1800,'IMMUTABLE_BOUND');return bytes;
  }
  function current(rel){
   safeRelative(rel);const full=file(root,rel),bytes=fs.readFileSync(full);
   const entry=git(root,['ls-tree','-z',rootHead,'--',rel]).toString();
   const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
   need(match&&match[3]===rel&&blob(bytes)===match[2],'CURRENT_HEAD');
   const p={path:rel,gitBlobSha1:match[2],sha256:sha(bytes),bytes:bytes.length},old=currentInputs.get(rel);
   if(old)need(stable(old)===stable(p),'CURRENT_CHANGED');else currentInputs.set(rel,p);
   return bytes;
  }
  function put(rel,bytes){
   safeRelative(rel);const full=path.join(fixture,rel);
   fs.mkdirSync(path.dirname(full),{recursive:true});
   if(fs.existsSync(full)){need(sha(fs.readFileSync(file(fixture,rel)))===sha(bytes),'PRIVATE_CONFLICT');return;}
   fs.writeFileSync(full,bytes,{flag:'wx',mode:0o444});
   fixtureInputs.set(rel,{path:rel,gitBlobSha1:blob(bytes),sha256:sha(bytes),bytes:bytes.length});
   const a=fs.statSync(full),b=fs.statSync(file(root,rel));need(a.dev!==b.dev||a.ino!==b.ino,'SHARED_WRITABLE_INODE');
  }
  function copy(rel){if(fixtureInputs.has(rel))return fs.readFileSync(file(fixture,rel));const bytes=current(rel);put(rel,bytes);return bytes;}
  function live(ref){immutable(ref);const bytes=current(ref.path);pin(bytes,ref,'LIVE');put(ref.path,bytes);return bytes;}
  function docScope(rel){
   return rel.endsWith('.json')&&/^(?:docs\/operations\/|archive\/data\/(?:meta-review|meta-foundation\/evidence)\/|\.archive-meta-register\/evidence\/)/.test(rel);
  }
  function queueDoc(bytes,ref,liveDocument=false){
   need(Buffer.isBuffer(bytes)&&bytes.length<=4*1024*1024&&docScope(ref.path),'DOC_SCOPE');
   const key=(ref.commit||rootHead)+':'+ref.path+':'+sha(bytes);
   if(queued.has(key))return;queued.add(key);need(queued.size<=160,'DOC_BOUND');
   queue.push({bytes,ref,liveDocument,key});
  }
  function hydrateRef(ref,{recursive=true,copyCurrent=true}={}){
   const bytes=immutable(ref);
   if(copyCurrent&&!fixtureInputs.has(ref.path)&&fs.existsSync(path.join(root,ref.path))){
    if(ref.path.startsWith('archive/data/item-4slot/'))need(CONFIG.groups.some(g=>g.compactRef.path===ref.path),'OTHER_COMPACT');
    if(!ref.path.startsWith('archive/exams/')||CONFIG.groups.some(g=>g.sourceRef.path===ref.path))copy(ref.path);
   }
   if(recursive&&docScope(ref.path))queueDoc(bytes,ref,false);
   return bytes;
  }
  function hydrateMetadataDocument(rel){
   safeRelative(rel);need(docScope(rel),'METADATA_SCOPE');const bytes=copy(rel);
   queueDoc(bytes,{commit:rootHead,path:rel},true);return bytes;
  }
  function declaredFourFieldRef(ref,owner,pointer){
   // One authenticated preparation document declares four-field references.
   // Do not generalize absence of bytes to any other document or reference.
   const spec={
     "schemaVersion": "archive-issued-source-continuity-preparation-v1",
     "owner": {
       "path": ".archive-meta-register/evidence/middle-audit-repair-34c2-m3-current-target/e052-after-issued-source-continuity-4b504e10b1ce.json",
       "gitBlobSha1": "1893482704d0a57c3e7acb2deceeed3199e1c666",
       "sha256": "fdd5a03136bafc83e08869c85cc738ddf8de72481a4ffcbd6009091c4e06b5fb",
       "bytes": 6031
     },
     "references": {
       "$.beforeSourceRef": {
         "commit": "4b504e10b1ce7a90576486663b3862ef99922325",
         "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
         "gitBlobSha1": "5a9e25d32e96a19bb6bb2f2f8265446cb92fee34",
         "sha256": "ccab19ec3a0546078515c3a5d0da6396d18bb7f134c9e53847d7b7fc7f7cadb9"
       },
       "$.actualPriorReceipts[0].inputRef": {
         "commit": "b645719341bc7deae6ed3b21a78f878109dc7789",
         "path": ".archive-meta-register/inbox/m3s2-e052-preserve2-current-source-20261116.json",
         "gitBlobSha1": "2b80a243176fe3168f360ce72572184fdcfd0641",
         "sha256": "79ad2bdcff426007be3f3b4035f366e37e2bb070a47f7696e52e1c160c281338"
       },
       "$.actualPriorReceipts[0].receiptRef": {
         "commit": "4b504e10b1ce7a90576486663b3862ef99922325",
         "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e052-preserve2-current-source-20261116.json",
         "gitBlobSha1": "4405ebae958741e97c4e24639655780ab1ff8441",
         "sha256": "0148fc582202473ca7a5d78d1f9c75f259aab7ab611192d5cb70a7b3e5e5c325"
       }
     }
   };
   if(Object.hasOwn(ref,'bytes')||owner?.path!==spec.owner.path||!Object.hasOwn(spec.references,pointer))return ref;
   const expected=spec.references[pointer];
   need(Object.keys(ref).length===4&&stable(ref)===stable(expected),'DECLARED_FOUR_FIELD_REF');
   const ownerRef={commit:owner.commit,...spec.owner};
   const ownerBytes=immutable(ownerRef);need(json(ownerBytes).schemaVersion===spec.schemaVersion,'DECLARED_FOUR_FIELD_SCHEMA');
   ensureCommit(ref.commit);
   const entry=git(root,['ls-tree','-z',ref.commit,'--',ref.path]).toString();
   const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
   need(match&&match[2]===ref.gitBlobSha1&&match[3]===ref.path,'DECLARED_FOUR_FIELD_TREE');
   const size=Number(git(root,['cat-file','-s',ref.gitBlobSha1]).toString().trim());
   need(Number.isSafeInteger(size)&&size>0&&size<=128*1024*1024,'DECLARED_FOUR_FIELD_SIZE');
   const authenticated={...expected,bytes:size};pin(object(ref.gitBlobSha1),authenticated,'DECLARED_FOUR_FIELD');
   const observed={owner:ownerRef,pointer,reference:authenticated};
   report.authenticatedFourFieldReferences??=[];
   if(!report.authenticatedFourFieldReferences.some(row=>row.owner.commit===ownerRef.commit&&row.pointer===pointer))
    report.authenticatedFourFieldReferences.push(observed);
   return authenticated;
  }
  function hydrateDocument(value,owner=null){
   for(const ref of refsIn(value,[],'$',owner,declaredFourFieldRef))hydrateRef(ref);
   for(const rel of new Set(leafPaths(value)))if(fs.existsSync(path.join(root,rel)))hydrateMetadataDocument(rel);
  }
  function hydrateOriginalNativeSource(carrier){
   // Only the existing exact application declares which review commit owns the
   // original Native bank. A relocated document's publication commit is not a
   // source-version declaration. Every actual strong reference stays strict.
   const basis=json(immutable(carrier.refs.applicationRef));
   need(basis.schemaVersion==='archive-m3-e052-q5-complete-given-application-basis-v1'&&
    basis.scope==='EXACT_E052_Q5_COMPLETE_GIVEN_ONLY'&&basis.questionUid===Q5.UID&&
    basis.sourceOrdinal===5,'ORIGINAL_NATIVE_BASIS');
   const nativeRef=refShape(basis.nativeReviewRef),review=json(immutable(nativeRef));
   need(review.schemaVersion==='m3-s2-complete-semantic-review-v1'&&
    review.sourceArchiveFile===Q5.SOURCE&&review.questionCount===25,'ORIGINAL_NATIVE_REVIEW_SCOPE');
   const bytes=object(review.sourceAfterBlob);
   need(sha(bytes)===review.sourceAfterSha256,'NATIVE_REVIEW_SOURCE_BYTES');
   const sourceRef={commit:nativeRef.commit,path:'archive/exams/'+Q5.SOURCE,
    gitBlobSha1:review.sourceAfterBlob,sha256:review.sourceAfterSha256,bytes:bytes.length};
   immutable(sourceRef);
   report.originalNativeSourceHydration={applicationRef:carrier.refs.applicationRef,
    nativeReviewRef:nativeRef,sourceRef,contract:'EXACT_APPLICATION_NATIVE_REVIEW_COMMIT',
    originalNativeAuthorityExecuted:false};
  }
  function drain(){
   while(queue.length){
    const item=queue.shift();if(parsedDocs.has(item.key))continue;parsedDocs.add(item.key);
    hydrateDocument(json(item.bytes),item.ref);
   }
  }
  function copyPrefix(prefix,filter=()=>true){
   const entries=git(root,['ls-tree','-r','-z',rootHead,'--',prefix]).toString().split('\0').filter(Boolean);
   need(entries.length<=2500,'PREFIX_BOUND');
   for(const entry of entries){
    const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);need(match,'PREFIX_REGULAR');
    if(filter(match[3]))copy(match[3]);
   }
  }
  phase(report,'AUTHENTICATED_INPUTS');
  const actualIndex=json(copy(INDEX)),identity=json(copy(ID));copy(MD);copy(SVG);
  need(actualIndex.schemaVersion===builder.SCHEMA&&Array.isArray(actualIndex.files)&&
   Array.isArray(actualIndex.records)&&Array.isArray(actualIndex.pending),'ACTUAL_INDEX');
  need(identity.schemaVersion==='question-identity-map-v1'&&Array.isArray(identity.records),'IDENTITY');
  const joinMap=new Map(),uidUses=new Map();
  for(const row of identity.records){
   const key=row.sourceArchiveFile+'#'+row.sourceOrdinal;if(!joinMap.has(key))joinMap.set(key,[]);
   joinMap.get(key).push(row);uidUses.set(row.questionUid,(uidUses.get(row.questionUid)||0)+1);
  }
  const states=[],compacts=new Map();
  for(const group of CONFIG.groups){
   live(group.sourceRef);live(group.compactRef);live(group.dictionaryRef);
   const bank=builder.loadBank(current(group.sourceRef.path)),compact=json(current(group.compactRef.path));
   need(bank.length===group.count&&compact.items.length===group.count&&compact.sourceArchiveFile===group.sourceArchiveFile&&
    !Object.hasOwn(compact,'scope'),'BANK_DENOMINATOR');compacts.set(group.sourceArchiveFile,compact);
   need(OID.test(compact.sourceGitBlobSha),'COMPACT_BASELINE');object(compact.sourceGitBlobSha);
   for(let i=0;i<bank.length;i++){
    const rows=joinMap.get(group.sourceArchiveFile+'#'+(i+1))||[],display=sourceNumber(bank[i]);
    need(rows.length===1&&UID.test(rows[0].questionUid)&&uidUses.get(rows[0].questionUid)===1,'UID_JOIN');
    need(String(rows[0].sourceQuestionNo)===sourceIdentityNumber(bank[i]),'IDENTITY_NUMBER');
    need(Number.isSafeInteger(display)&&display>0&&compact.items.filter(x=>x.ordinal===display).length===1,'DISPLAY_JOIN');
    states.push({questionUid:rows[0].questionUid,sourceArchiveFile:group.sourceArchiveFile,sourceOrdinal:i+1,
     sourceQuestionNo:sourceIdentityNumber(bank[i]),displayNumber:display,compactPath:group.compactRef.path});
   }
   const assets=new Set(),fields=['id','number','questionType','content','question','choices','answer','solution',
    'image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
   for(const q of bank){
    const text=JSON.stringify(Object.fromEntries(fields.map(k=>[k,q[k]??null]))).replaceAll('\\/','/');
    for(const match of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
     assets.add(match[0].startsWith('archive/')?match[0]:'archive/'+match[0]);
   }
   for(const rel of[...assets].sort())copy(rel);
   for(const it of compact.items)if(it.registrationHold)hydrateDocument(it.registrationHold,{commit:rootHead,path:group.compactRef.path});
  }
  need(states.length===49&&new Set(states.map(s=>s.questionUid)).size===49,'SOURCE49');
  const selected=new Set(CONFIG.selected.map(s=>s.questionUid)),allUids=new Set(states.map(s=>s.questionUid));
  for(const item of CONFIG.selected){
   const rows=states.filter(s=>s.questionUid===item.questionUid);
   need(rows.length===1&&rows[0].sourceArchiveFile===item.sourceArchiveFile&&rows[0].sourceOrdinal===item.sourceOrdinal,'SELECTED_JOIN');
  }
  const outside=states.filter(s=>!selected.has(s.questionUid));need(outside.length===47,'OUTSIDE47');
  const stateOf=(index,tuple)=>{
   const records=index.records.filter(r=>r.questionUid===tuple.questionUid);
   const pending=index.pending.filter(r=>r.path===tuple.compactPath&&(r.ordinal==null||r.ordinal===tuple.displayNumber));
   need(records.length<=1&&(records.length===1?pending.length===0:pending.length>0),'STATE_PARTITION');
   if(records.length)need(records[0].sourceArchiveFile===tuple.sourceArchiveFile&&records[0].sourceOrdinal===tuple.sourceOrdinal&&
    records[0].sourceQuestionNo===tuple.sourceQuestionNo,'STATE_TUPLE');
   return {questionUid:tuple.questionUid,record:records[0]||null,pending:pending.slice().sort((a,b)=>stable(a).localeCompare(stable(b),'en'))};
  };
  const actualOutside=outside.map(s=>stateOf(actualIndex,s)),actualSelected=states.filter(s=>selected.has(s.questionUid)).map(s=>stateOf(actualIndex,s));
  need(actualSelected.every(s=>s.record===null),'ACTUAL_TARGET_ALREADY_REGISTERED');
  report.actualBaseline={index:currentInputs.get(INDEX),selectedRegistered:0,selectedPending:2,
   outsideRegistered:actualOutside.filter(x=>x.record).length,outsidePending:actualOutside.filter(x=>!x.record).length,
   outsideWholeStateSha256:sha(stable(actualOutside)),selectedWholeStateSha256:sha(stable(actualSelected))};
  const q5CarrierRaw=copy(Q5.FILE),q5Carrier=json(q5CarrierRaw);Q5.assertDescriptor(q5Carrier);
  const q16Path=CONFIG.selected[1].path,q16Raw=copy(q16Path),q16Doc=json(q16Raw);Q16.assertSubject(q16Doc);
  for(const[doc,relative]of[[q5Carrier,Q5.FILE],[q16Doc,q16Path]])
   for(const ref of refsIn(doc,[],'$',{commit:rootHead,path:relative}))hydrateRef(ref);
  immutable(CONFIG.q5OldCursorRef);
  const oldQ16Raw=immutable(CONFIG.oldQ16SidecarRef);for(const ref of refsIn(json(oldQ16Raw),[],'$',CONFIG.oldQ16SidecarRef))hydrateRef(ref);
  // Follow only the exact issued Q5 packet and explicit Native provenance; global
  // runtime/canonical documents and output inventories never enter this queue.
  for(const rel of[Q5.REQUEST_WITNESS,Q5.RECEIPT,Q5.SOURCE_BINDING])hydrateMetadataDocument(rel);
  // Native's original typed ancestor requires this fixed live pair as well as
  // its immutable source object. No historical source is staged as current.
  for(const ref of CONFIG.q5OriginalTypedAncestorLiveRefs){
   const bytes=live(ref);queueDoc(bytes,ref,true);
  }
  immutable(CONFIG.q5OriginalTypedSourceRef);
  report.originalTypedAncestorInputs={liveRefs:CONFIG.q5OriginalTypedAncestorLiveRefs,
   immutableSourceRef:CONFIG.q5OriginalTypedSourceRef,liveDocuments:2,
   historicalSourceCopiedAsCurrent:false,originalNativeExecuted:false};
  copyPrefix('archive/data/meta-foundation/canonical');
  copyPrefix('archive/data/meta-foundation/compiled');
  copyPrefix('archive/data/meta-foundation/runtime',p=>p.endsWith('.json'));
  copy('archive/data/master_tables/js_archive_tag_master.json');
  // Preserve every tracked byte in the existing Q5 Native-code cache input
  // directory. These files are copied opaquely; execution uses the pinned code.
  copyPrefix('archive/tools/meta-foundation');
  const registry=json(current('archive/data/meta-foundation/canonical/registry_index.json'));
  for(const ref of[...(registry.canonicalSources||[]),...(registry.compiledArtifacts||[])])copy(ref.path);
  copy('archive/data/meta-foundation/canonical/metadata_rules.json');
  const candidateUi=new Map();
  for(const spec of[CONFIG.q5Refs,CONFIG.q16Refs]){
   for(const ref of Object.values(spec).flat()){
    const bytes=hydrateRef(ref);if([spec.technicalRef,spec.visualRef,spec.witnessRef,spec.framesRef,...spec.artifacts].includes(ref)){
     const liveBytes=current(ref.path);pin(liveBytes,ref,'CURRENT_UI');candidateUi.set(ref.path,liveBytes);
    }
   }
   const tech=json(immutable(spec.technicalRef));
   need(tech.completedLogicalCases===2&&tech.results.length===2,'CURRENT_CASE2');
   for(const ref of refsIn(tech,[],'$',spec.technicalRef))hydrateRef(ref);
  }
  // Other existing claims are included only when their filename and declared
  // identity belong to these exact 49 rows; no unrelated packet is inspected.
  const claimEntries=git(root,['ls-tree','-r','-z',rootHead,'--','.archive-meta-register']).toString().split('\0').filter(Boolean);
  for(const entry of claimEntries){
   const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);need(match,'CLAIM_TREE');
   const rel=match[3],uid=path.posix.basename(rel,'.json');
   if(!/^\.archive-meta-register\/4slot-[^/]+\//.test(rel)||!allUids.has(uid))continue;
   const bytes=copy(rel),doc=json(bytes);
   need(allUids.has(doc.questionUid)&&states.some(s=>s.questionUid===doc.questionUid&&s.sourceArchiveFile===doc.sourceArchiveFile&&
    s.sourceOrdinal===doc.sourceOrdinal),'CLAIM_SCOPE');
   for(const ref of refsIn(doc,[],'$',{commit:rootHead,path:rel}))hydrateRef(ref);
  }
  hydrateOriginalNativeSource(q5Carrier);
  drain();
  report.closure={currentFileCount:currentInputs.size,immutableRefCount:immutableInputs.size,declaredMetadataDocuments:parsedDocs.size,
   scope:'source2/current canonical+runtime metadata; fixed original Q5 receipt/binding and exact UI refs; no outputDigests recursion'};
  phase(report,'FOCUSED_AND_ORIGINAL_AUTHORITY');
  report.focused=[];
  function command(name,args,expected){
   const child=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024,
    env:{...process.env,NODE_OPTIONS:'--max-old-space-size=6144'}});
   const stdout=String(child.stdout||''),stderr=String(child.stderr||'');
   const get=label=>{const matches=[...stdout.matchAll(new RegExp('^# '+label+' ([0-9]+)$','gm'))];return matches.length?Number(matches.at(-1)[1]):null;};
   const item={name,exitCode:child.status,tests:get('tests'),pass:get('pass'),fail:get('fail'),stdoutSha256:sha(stdout),stderrSha256:sha(stderr),
    error:child.error?safeError(child.error):null};
   if(child.error||child.status!==0||item.tests!==expected||item.pass!==expected||item.fail!==0)
    item.failureDiagnostics=focusedFailureMetadata(stdout,stderr);
   report.focused.push(item);
   need(!child.error&&child.status===0&&item.tests===expected&&item.pass===expected&&item.fail===0,'FOCUSED_'+name);
  }
  // The original run passed all 150 focused cases before its sparse builder
  // refused Q5. Reuse only the named 149; do not turn the failed gate into PASS.
  const reuseSpec=CONFIG.focusedReuse;
  const priorRaw=current(reuseSpec.report.path);pin(priorRaw,reuseSpec.report,'FOCUSED_REUSE_REPORT');
  const prior=json(priorRaw);immutable(reuseSpec.gate);
  need(prior.schemaVersion===CONFIG.schemaVersion&&prior.status==='FAIL'&&
   prior.phase==='OFFICIAL_BUILDER_SOURCE49'&&prior.execution?.provider==='GITHUB_ACTIONS'&&
   prior.execution.repository===CONFIG.repository&&prior.execution.ref===CONFIG.branch&&
   prior.execution.eventName==='push'&&prior.execution.checkoutCommit===reuseSpec.head&&
   prior.execution.eventCommit===reuseSpec.head&&prior.execution.runId===reuseSpec.runId&&
   prior.execution.runAttempt===1&&prior.execution.job==='m3-current-authority'&&
   prior.rootHeadUnchanged===true&&prior.rootStatusUnchanged===true&&
   prior.sourceQuestionCount===49&&prior.selectedQuestionCount===2&&prior.outsideQuestionCount===47,
   'FOCUSED_REUSE_PROVENANCE');
  need(prior.focused?.length===3&&reuseSpec.focusedGroups.every((spec,i)=>{
   const item=prior.focused[i];
   return item.name===spec.name&&item.exitCode===0&&item.tests===spec.observed&&
    item.pass===spec.observed&&item.fail===0&&item.error===null&&
    SHA.test(item.stdoutSha256)&&SHA.test(item.stderrSha256);
  }),'FOCUSED_REUSE_RESULT');
  need(prior.actualBaseline.selectedWholeStateSha256===report.actualBaseline.selectedWholeStateSha256&&
   prior.actualBaseline.outsideWholeStateSha256===report.actualBaseline.outsideWholeStateSha256,
   'FOCUSED_REUSE_SOURCE49_STATE');
  // exam-items is a direct dependency of the original Q5 resolver. Native's
  // complete code directory and its data/font/asset closure were read above.
  current('tools/4slot/exam-items.cjs');
  const reuseInputs=[...currentInputs.values()].filter(x=>x.path!==reuseSpec.report.path)
   .sort((a,b)=>a.path.localeCompare(b.path,'en'));
  const entries=git(root,['ls-tree','-z',reuseSpec.head,'--',...reuseInputs.map(x=>x.path)])
   .toString().split('\0').filter(Boolean),priorFiles=new Map();
  for(const entry of entries){
   const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);
   need(m&&!priorFiles.has(m[3]),'FOCUSED_REUSE_TREE');priorFiles.set(m[3],m[2]);
  }
  const codeDeltas=new Map(reuseSpec.allowedCodeDeltas.map(x=>[x.path,x])),changed=[];
  for(const actual of reuseInputs){
   const oldBlob=priorFiles.get(actual.path),delta=codeDeltas.get(actual.path);
   if(delta){
    need(oldBlob===delta.before.gitBlobSha1&&actual.gitBlobSha1===delta.after.gitBlobSha1&&
     actual.sha256===delta.after.sha256&&actual.bytes===delta.after.bytes,'FOCUSED_REUSE_CLOSED_M2_DELTA');
    changed.push({path:actual.path,before:delta.before,after:delta.after});
   }else need(oldBlob===actual.gitBlobSha1,'FOCUSED_REUSE_INPUT_DRIFT');
  }
  need(changed.length===3&&codeDeltas.size===3,'FOCUSED_REUSE_CLOSED_M2_INVENTORY');
  report.focusedReuse={status:'REUSED_FROM_RUN_44052082242',report:reuseSpec.report,
   originalExecution:prior.execution,originalGateStatus:prior.status,originalGateFailure:prior.error,
   originalObservedFocusedTests:150,reusedTests:149,originalQ5Native1CountedAsFresh:false,
   currentInputCount:reuseInputs.length,unchangedInputCount:reuseInputs.length-changed.length,
   inputWholeSha256:sha(stable(reuseInputs)),allowedCodeDeltas:changed,
   codeDeltaIndependentReview:reuseSpec.codeDeltaIndependentReview,
   codeDeltaScope:'Closed M2 private continuation only; ordinary undefined-context paths preserve original guards.',
   currentSource49StateExact:true};
  report.focused=reuseSpec.focusedGroups.map((spec,i)=>({
   name:spec.name,status:'REUSED_FROM_RUN_44052082242',reusedTests:spec.reuse,reusedPass:spec.reuse,
   freshTests:0,sourceObservedGroup:prior.focused[i],sourceReport:reuseSpec.report,
   sourceRunId:reuseSpec.runId,subset:spec.observed===45?'metadata44 only; original Native1 is not reused as a new execution':'whole original group'
  }));
  // Run exactly the original dispatcher CLI against the newly authenticated
  // private fixture. The existing test modules and original Native stay intact.
  const nativeArgs=[path.join(root,'tools/4slot/m3-e052-q5-complete-given-continuity.mjs'),fixture,Q5.FILE];
  const nativeChild=spawnSync(process.execPath,nativeArgs,{cwd:root,encoding:'utf8',timeout:240000,
   maxBuffer:8*1024*1024,env:{...process.env,NODE_OPTIONS:'--max-old-space-size=6144'}});
  const nativeStdout=String(nativeChild.stdout||''),nativeStderr=String(nativeChild.stderr||'');
  report.privateOriginalNative={status:'RUNNING',executions:1,rootKind:'AUTHENTICATED_PRIVATE_FIXTURE',
   cli:'tools/4slot/m3-e052-q5-complete-given-continuity.mjs',exitCode:nativeChild.status,
   stdoutSha256:sha(nativeStdout),stderrSha256:sha(nativeStderr),
   error:nativeChild.error?safeError(nativeChild.error):null,
   stderrGuardTokens:[...new Set(nativeStderr.match(/\b(?:M3_Q5_VECTOR_[A-Z0-9_]+|ENOENT|ERR_[A-Z0-9_]+)\b/g)||[])].slice(0,16)};
  need(!nativeChild.error&&nativeChild.status===0,'PRIVATE_ORIGINAL_NATIVE_COMMAND');
  const nativeResult=json(Buffer.from(nativeStdout));
  need(nativeResult.status==='PASS'&&nativeResult.questionUid===Q5.UID&&nativeResult.sourceOrdinal===5&&
   nativeResult.existingVectorCount===25&&nativeResult.outside24WholeQuestionsUnchanged===true&&
   nativeResult.newFourSlotApprovals===0&&nativeResult.newMathematicalQa===false&&nativeResult.newMetadataApprovals===0&&
   Array.isArray(nativeResult.observed),'PRIVATE_ORIGINAL_NATIVE_RESULT');
  const nativeSeen=new Map();
  for(const entry of nativeResult.observed){
   need(Array.isArray(entry)&&entry.length===2&&typeof entry[0]==='string'&&SHA.test(entry[1])&&
    !nativeSeen.has(entry[0]),'PRIVATE_ORIGINAL_NATIVE_OBSERVED');
   need(sha(fs.readFileSync(file(fixture,entry[0])))===entry[1],'PRIVATE_ORIGINAL_NATIVE_INPUT_CHANGED');
   nativeSeen.set(entry[0],entry[1]);
  }
  for(const rel of Q5.CURRENT_UI_PATHS)need(nativeSeen.has(rel),'PRIVATE_ORIGINAL_NATIVE_UI_UNOBSERVED');
  const nativeTechnical=json(fs.readFileSync(file(fixture,CONFIG.q5Refs.technicalRef.path)));
  for(const ref of[...nativeTechnical.servedFiles,...nativeTechnical.mirroredAssets,...nativeTechnical.studentFontResources])
   need(nativeSeen.has(ref.path),'PRIVATE_ORIGINAL_NATIVE_RENDER_UNOBSERVED');
  Object.assign(report.privateOriginalNative,{status:'PASS',questionUid:Q5.UID,sourceOrdinal:5,
   existingVectorCount:25,outside24WholeQuestionsUnchanged:true,observedInputs:nativeSeen.size,
   observedWholeSha256:sha(stable([...nativeSeen].sort((a,b)=>a[0].localeCompare(b[0],'en'))))});
  report.focusedSummary={reusedTests:149,freshFocusedTests:0,freshPrivateOriginalNativeExecutions:1,
   actualCurrentBuilderAndConsumer:'NEXT_PHASE'};
  report.authority={q5OriginalNativeGivenUiAndAncestor:true,q5ExistingVectorCount:25,q5Outside24WholeUnchanged:true,
   q5Observation:'FRESH_ORIGINAL_CLI_ON_AUTHENTICATED_PRIVATE_FIXTURE',
   q16OriginalVectorCount:24,q16SelectedMdIdAndLiveUi:true,q16Observation:'REUSED_FROM_RUN_44052082242',
   source:'149 authenticated prior cases plus one fresh original Q5 resolver; current scoped builder follows',
   newNativeApprovals:0,newFourSlotVectors:0};

  checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX);
  const outsideSame=index=>{
   need(index.counts.files===2&&index.counts.items===49&&index.records.length+index.pending.length===49,'RESULT_DENOMINATOR');
   need(index.records.every(r=>allUids.has(r.questionUid))&&index.pending.every(r=>CONFIG.groups.some(g=>g.compactRef.path===r.path)&&
    Number.isSafeInteger(r.ordinal)),'RESULT_SCOPE');
   const now=outside.map(s=>stateOf(index,s));
   report.lastOutsideCheck={phase:report.phase,expectedSha256:sha(stable(actualOutside)),observedSha256:sha(stable(now)),
    changed:now.flatMap((x,i)=>stable(x)===stable(actualOutside[i])?[]:[{questionUid:x.questionUid,
     expectedWholeSha256:sha(stable(actualOutside[i])),observedWholeSha256:sha(stable(x)),expectedRegistered:!!actualOutside[i].record,
     observedRegistered:!!x.record,pending:x.pending.map(p=>safeError(p.reason))}])};
   need(stable(now)===stable(actualOutside),'OUTSIDE47_CHANGED');
  };
  const observedStable=result=>{
   for(const[p,h]of result.observed)need(sha(fs.readFileSync(file(fixture,p)))===h,'BUILD_OBSERVED_DRIFT');
  };
  const selectedSummary=index=>states.filter(s=>selected.has(s.questionUid)).map(s=>{
   const state=stateOf(index,s);
   return {questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,registered:!!state.record,
    recordSha256:state.record?sha(stable(state.record)):null,pending:state.pending.map(p=>safeError(p.reason))};
  });
  function replacePrivate(rel,bytes){
   const full=path.join(fixture,safeRelative(rel));
   if(fs.existsSync(full)){file(fixture,rel);fs.chmodSync(full,0o644);}
   else fs.mkdirSync(path.dirname(full),{recursive:true});
   fs.writeFileSync(full,bytes,{mode:0o444});fs.chmodSync(full,0o444);
  }
  function build(previous){const result=builder.build(fixture,{previous,reuseCache:false});observedStable(result);outsideSame(result.index);return result;}
  phase(report,'OLD_DISPLAY_BINDING_BASELINE');
  for(const rel of candidateUi.keys())fs.unlinkSync(file(fixture,rel));
  replacePrivate(q16Path,oldQ16Raw);
  const before=build(actualIndex);
  need(before.index.records.filter(r=>selected.has(r.questionUid)).length===0,'OLD_BINDINGS_MUST_REFUSE');
  report.before={counts:before.index.counts,selected:selectedSummary(before.index),outsideWholeStateSha256:sha(stable(actualOutside))};
  phase(report,'OFFICIAL_BUILDER_SOURCE49');
  for(const[rel,bytes]of candidateUi)replacePrivate(rel,bytes);
  replacePrivate(q16Path,q16Raw);
  const after=build(before.index),rows=after.index.records.filter(r=>selected.has(r.questionUid));
  report.after={counts:after.index.counts,selected:selectedSummary(after.index)};
  need(rows.length===2&&after.index.counts.registered===before.index.counts.registered+2&&
   after.index.counts.pending===before.index.counts.pending-2,'EXACT_TWO_RECOVERED');
  for(const item of CONFIG.selected){
   const row=rows.find(r=>r.questionUid===item.questionUid),tuple=states.find(s=>s.questionUid===item.questionUid);
   const expected=compacts.get(item.sourceArchiveFile).items.find(it=>it.ordinal===tuple.displayNumber);
   const sidecarPin=currentInputs.get(item.path);
   need(row&&row.registrationStatus==='REGISTERED'&&row.sourceBinding===item.binding&&row.independentReviewClaim===false&&
    row[item.refField]?.path===item.path&&row[item.refField]?.sha256===sidecarPin.sha256&&
    stable(vector(row))===stable(vector(expected)),'UNCHANGED_VECTOR_AUTHORITY');
  }
  const verification=builder.verify(after.index),api=consumer.createIndex(after.index);let queries=0;
  for(const row of rows){
   need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_GET');queries++;
   for(const slot of builder.SLOTS)for(const term of row[slot]){
    need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_HAS_TERM');queries++;
   }
  }
  report.consumer={selected:2,queries,officialScopeVerified:verification.verified,pendingPreserved:verification.pending,
   status:verification.status,outsideWholeStateSha256:sha(stable(actualOutside))};
  phase(report,'COLD_REPLAY');
  replacePrivate(INDEX,Buffer.from(JSON.stringify(after.index)+'\n'));
  const cold=builder.run(fixture,{check:true});
  need(cold.changed===false&&cold.revalidatedFiles===2&&cold.reusedFiles===0,'COLD_CHECK');
  report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,
   counts:cold.counts,indexSha256:cold.indexSha256};
  report.evidenceDeletion=[];
  for(const[key,ref]of[['Q5',CONFIG.q5Refs.visualRef],['Q16',CONFIG.q16Refs.visualRef]]){
   phase(report,'CURRENT_VISUAL_DELETION_'+key);
   const item=CONFIG.selected.find(s=>s.key===key),other=CONFIG.selected.find(s=>s.key!==key);
   fs.unlinkSync(file(fixture,ref.path));
   const missing=build(after.index);
   const lost=stateOf(missing.index,states.find(s=>s.questionUid===item.questionUid));
   need(lost.record===null&&lost.pending.length===1,'DELETED_CURRENT_VISUAL_REGISTERED');
   const kept=missing.index.records.find(r=>r.questionUid===other.questionUid),prior=rows.find(r=>r.questionUid===other.questionUid);
   need(kept&&stable(kept)===stable(prior),'UNRELATED_SELECTED_CHANGED');
   report.evidenceDeletion.push({key,questionUid:item.questionUid,removedPath:ref.path,registered:false,
    reason:safeError(lost.pending[0].reason),otherSelectedWholeUnchanged:true,
    outsideWholeStateSha256:sha(stable(actualOutside))});
   replacePrivate(ref.path,candidateUi.get(ref.path));
  }
  phase(report,'CARRIER_SIDECAR_DELETION');
  for(const item of CONFIG.selected)fs.unlinkSync(file(fixture,item.path));
  const deleted=build(after.index);
  need(deleted.index.records.filter(r=>selected.has(r.questionUid)).length===0,'DELETED_CLAIM_REGISTERED');
  for(const item of CONFIG.selected){
   const state=stateOf(deleted.index,states.find(s=>s.questionUid===item.questionUid));
   need(state.pending.length===1&&state.pending[0].reason===item.deleteReason,'DELETE_REASON');
  }
  report.deleted={selectedRegistered:0,selectedRejected:2,counts:deleted.index.counts,
   outsideWholeStateSha256:sha(stable(actualOutside)),claimDeletionFailClosed:true};
  replacePrivate(Q5.FILE,q5CarrierRaw);replacePrivate(q16Path,q16Raw);
  phase(report,'FINAL_INPUT_PRESERVATION');
  for(const expected of checkpoint)pin(fs.readFileSync(file(fixture,expected.path)),expected,'PRIVATE_INPUT_UNCHANGED');
  for(const expected of currentInputs.values())pin(fs.readFileSync(file(root,expected.path)),expected,'ROOT_INPUT_UNCHANGED');
  need(git(root,['rev-parse','HEAD']).toString().trim()===rootHead&&
   git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus,'ROOT_MUTATION');
  need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD_CHANGED');
  report.inputs={current:[...currentInputs.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),
   immutable:[...immutableInputs.values()].sort((a,b)=>(a.commit+':'+a.path).localeCompare(b.commit+':'+b.path,'en')),
   currentFileCount:currentInputs.size,immutableRefCount:immutableInputs.size,opaqueHistoricalObjectCount:objectSeen.size,
   privateNonderivedFilesUnchanged:checkpoint.length,sharedWritableHardlinks:0,otherQuestionSourceBanksRead:0,
   rootTrackedRepositoryWrites:0,remoteRefWrites:0};
  report.phase='COMPLETE';report.status='PASS_PRIVATE_SCOPED_EXISTING_AUTHORITY';
  report.actualMainRegistration='NOT_PERFORMED';report.actualPagesVerification='NOT_PERFORMED';
  publish();
  console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,selectedExistingAuthority:2,
   selectedConsumer:2,sourceQuestionCount:49,outsideWholeStatePreserved:47,coldChanged:false,
   currentVisualDeletionRejected:2,carrierDeletionRejected:2,newNativeApprovals:0,mainWrites:0,
   reportSha256:sha(fs.readFileSync(output))}));
  return report;
 }catch(error){
  report.status='FAIL';report.error=safeError(error);report.actualMainRegistration='NOT_PERFORMED';
  if(error.referenceShapeFailure)report.failedReferenceShape=error.referenceShapeFailure;
  if(rootHead)try{
   report.rootHeadUnchanged=git(root,['rev-parse','HEAD']).toString().trim()===rootHead;
   report.rootStatusUnchanged=git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus;
  }catch{report.rootInputCheck='UNAVAILABLE';}
  report.currentInputCount=currentInputs.size;report.immutableRefCount=immutableInputs.size;
  publish();console.error(JSON.stringify({schemaVersion:report.schemaVersion,status:'FAIL',phase:report.phase,
   error:report.error,selected:report.after?.selected||report.before?.selected||null,reportSha256:sha(fs.readFileSync(output))}));
  process.exitCode=1;return report;
 }finally{if(work)fs.rmSync(work,{recursive:true,force:true});}
}
if(require.main===module){
 const args=process.argv.slice(2);let root=path.resolve(__dirname,'../..'),output;
 for(let i=0;i<args.length;i++){
  if(args[i]==='--root')root=path.resolve(args[++i]);
  else if(args[i]==='--output')output=args[++i];
  else throw Error('M3_SOURCE49_UNKNOWN_ARGUMENT');
 }
 need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
