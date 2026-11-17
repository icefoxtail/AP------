#!/usr/bin/env node
'use strict';
// Existing issued renderer authority only; mutable work is restricted to a disjoint private fixture.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const{execFileSync,spawnSync}=require('node:child_process');
const CONFIG={
  "schemaVersion": "archive-m3-existing-renderer-two-source45-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m3-existing-renderer-two-26fc-20261117",
  "integrationAncestor": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
  "groups": [
    {
      "examId": "E048",
      "sourceArchiveFile": "original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
      "count": 21,
      "sourcePin": {
        "path": "archive/exams/original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
        "sha256": "593994b906e074da4f6e39ba956b976534f9654add9404fe24de69f8aded72bb",
        "gitBlobSha1": "3e83797a4a7e0abdceb4dc47be8f7a60e5a268a7",
        "bytes": 58424
      },
      "compactPin": {
        "path": "archive/data/item-4slot/original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.4slot.json",
        "gitBlobSha1": "bff8ffcd304022116ba26730883e958131409b0a",
        "sha256": "e85ec61919947ed1c5b87418a74f5e5cc3f0cd579878f26d820a52da58e9b047",
        "bytes": 4280
      },
      "dictionaryPin": {
        "path": "docs/architecture/4slot/term-dictionary-v1.6.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "07920194882d3924ac50e8bbffc5b723c3fc5e89",
        "sha256": "9d55b5f1172b13c3d05802b65963a18368d50b1659b31fa36aa52a27605e579d",
        "bytes": 367619
      },
      "sidecarPin": {
        "path": ".archive-meta-register/4slot-renderer-continuity/qid_v1_b5db7dbd9bc79ba91bf5eca74ef301800fc9e8e049da8a90e58cd590cdc55974.json",
        "gitBlobSha1": "cf085289fd13f82cc357ba62f0a094c84fa79bd3",
        "sha256": "0d38f5a69c81bff7385e6b5735232bfe0587d93cdabea6fb87f4e46171c8f723",
        "bytes": 1903
      },
      "receiptPin": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e048-current695-native-preserve-20261115.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "e4dc9c621316a901e88eaf43d214d4001b1b6ec3",
        "sha256": "860f7304f4cee8073797b1b1eed944a3319973c185b3b22766339fe30b3492bf",
        "bytes": 123356
      },
      "rendererBindingPin": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e048-current695-native-preserve-20261115.renderer-binding.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "3710709d8d594219258fa176266e4c422c53f557",
        "sha256": "1ea6528d749f35c0802bfd90edc7419019b959ad6c5ccc7671b4292c444f6111",
        "bytes": 920
      },
      "rendererEvidencePin": {
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/E048.renderer-continuity.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "9fee4a4e1ff576e002760be36aaddfe7f5af7bb4",
        "sha256": "df7cd3fa667fcc871271952ba797152440dad42e77860acd36471bbf0a0bb31a",
        "bytes": 2063
      },
      "independentReviewPin": {
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/independent-review.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "4fbf07f8104eca4a35196cb29235315e194e72d6",
        "sha256": "5932ec33bbeeb59d1aa3ec86fe89a8dd73c0ac08c07dcad1c165b6bc0d7030cf",
        "bytes": 11735
      },
      "selected": {
        "questionUid": "qid_v1_b5db7dbd9bc79ba91bf5eca74ef301800fc9e8e049da8a90e58cd590cdc55974",
        "sourceOrdinal": 10,
        "sourceQuestionNo": "q10",
        "sourceDisplayNumber": 10,
        "compactItemSha256": "daea898397cd970d92d10fb6486511cecb2087a3785dc2f0726b596076c78b36",
        "issuedWholeSha256": {
          "metadata": "4a2fecdd4446e4a73ffdfd4d38ce90e43c78c4ad429dcc03265e5a1f3bb1d2d7",
          "identity": "c32b9dbe04381903c39cf941a412d76806a924bc662073bf5f0244c067c9ca7d",
          "runtime": "46b82d4fa1d4488832b01becfdb12c53f77b7793b9b6c624128bb6b72103033f"
        }
      },
      "nativeSource": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "archive/exams/original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
        "gitBlobSha1": "ad5edce2d6dde313439f8a55828d810a84af032c",
        "sha256": "7471f1b94a97b91e5613ad84784dbe799b070eb199c93ddf08d6cb10d76e0f27",
        "reviewCommitSourceBlobSha1": "ad5edce2d6dde313439f8a55828d810a84af032c"
      },
      "nativeReview": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "docs/operations/m3-s2-meta-full-20261114/exams/E048.meta.json",
        "sha256": "1faf78a953cf51245ca9b9d9f676e400af4f7a9da592b27b98eb1b1360dc80dc"
      },
      "rendererReview": {
        "commit": "c54f303dd84a78e7111cb0b4d095f78d503e65ea",
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/E048.renderer-continuity.json",
        "sha256": "df7cd3fa667fcc871271952ba797152440dad42e77860acd36471bbf0a0bb31a"
      },
      "sourceSnapshots": [
        {
          "commit": "5f8f509108cfc4bfac3ce47813839aaa3c558274",
          "path": "archive/exams/original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
          "gitBlobSha1": "856091ff53cadae2790ed7edb09a5644c66951f4",
          "sha256": "49441d69d97319f7550143e73640fd52c2139aa72ae3b82c110e830c9c2dca31",
          "questionSha256": "e0a18a2167230278b3cde03801a8682ed9b5e94745c19ee3043ba982aac4b549"
        },
        {
          "commit": "87c0aef6bb95b04963bcec5469a0b09d888d6dce",
          "path": "archive/exams/original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
          "gitBlobSha1": "3e83797a4a7e0abdceb4dc47be8f7a60e5a268a7",
          "sha256": "593994b906e074da4f6e39ba956b976534f9654add9404fe24de69f8aded72bb",
          "questionSha256": "e4a57894230ce293506cfcab842b15beb71714d9ff970001ebf940478f0bf8d5"
        }
      ],
      "assetDirectories": [
        "archive/assets/images/21_연향중_2학기_기말_중3_수학"
      ],
      "currentAssets": [
        {
          "path": "archive/assets/images/21_연향중_2학기_기말_중3_수학/q10-engine-upgrade.svg",
          "gitBlobSha1": "b3913a04f362a90abf6f712be65a2811c6b09457",
          "sha256": "d7e8364aa3521561d9160a24efaa798c129bc93b085deded5f3fe89f3bdcc016"
        },
        {
          "path": "archive/assets/images/21_연향중_2학기_기말_중3_수학/q10-solution.svg",
          "gitBlobSha1": "cf419c4d7e52f0efec5f970c281f550c43b62c5d",
          "sha256": "d554039fea11b37056dd83b9c29828e957b424ddad03716ca260aefb4a7fd11b"
        }
      ]
    },
    {
      "examId": "E053",
      "sourceArchiveFile": "original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
      "count": 24,
      "sourcePin": {
        "path": "archive/exams/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
        "sha256": "4ddd22f765e7f221ba26d2ff07ead8cc5c292a4c92ef0ac3510110247939c109",
        "gitBlobSha1": "29e8324717f9d94167fdba606124b62dd92e5971",
        "bytes": 107604
      },
      "compactPin": {
        "path": "archive/data/item-4slot/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.4slot.json",
        "gitBlobSha1": "7dbffc581a33736971da26b2af5b081281ffaaad",
        "sha256": "99b64ded8752e967efa9217abbd96061cb2ceb85ccaef8e1ed367842a85bd594",
        "bytes": 5197
      },
      "dictionaryPin": {
        "path": "docs/architecture/4slot/term-dictionary-v1.6.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "07920194882d3924ac50e8bbffc5b723c3fc5e89",
        "sha256": "9d55b5f1172b13c3d05802b65963a18368d50b1659b31fa36aa52a27605e579d",
        "bytes": 367619
      },
      "sidecarPin": {
        "path": ".archive-meta-register/4slot-renderer-continuity/qid_v1_0712df7eb36d8470adaa336d489d7fc15bf448252cf9259bbf3769060a235f04.json",
        "gitBlobSha1": "053eeb61874aeb4a7620f2ffc3917ff4d5696b37",
        "sha256": "2ffe51858d27fdbf1baf56068df0342dc037d1899e1f2467336e765456056e59",
        "bytes": 1896
      },
      "receiptPin": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e053-current695-native-preserve-20261115.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "4bc59a2ebeb67a7bac8cb02a5c82ebc847a80031",
        "sha256": "09b43c0882965d7dad5b141ea4ee9d3d5411b53ec1f3714b367cdf897734c4cc",
        "bytes": 152235
      },
      "rendererBindingPin": {
        "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-e053-current695-native-preserve-20261115.renderer-binding.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "815271268faaac12a53ba9dec446c1faecd1e786",
        "sha256": "15b0ae38cbe2dd118d557961c2d1d03694554195d98482af3da9cc2735d4624c",
        "bytes": 918
      },
      "rendererEvidencePin": {
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/E053.renderer-continuity.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "2d80cb88bcda39ef3fcc856e7563299acc81f15d",
        "sha256": "d0357cd874a58b97ff503c3c5c88eedd99c3c67d6e0c1898b3d5e4309027dc70",
        "bytes": 2057
      },
      "independentReviewPin": {
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/independent-review.json",
        "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
        "gitBlobSha1": "4fbf07f8104eca4a35196cb29235315e194e72d6",
        "sha256": "5932ec33bbeeb59d1aa3ec86fe89a8dd73c0ac08c07dcad1c165b6bc0d7030cf",
        "bytes": 11735
      },
      "selected": {
        "questionUid": "qid_v1_0712df7eb36d8470adaa336d489d7fc15bf448252cf9259bbf3769060a235f04",
        "sourceOrdinal": 19,
        "sourceQuestionNo": "19",
        "sourceDisplayNumber": 19,
        "compactItemSha256": "822d381af6565edba8d69813dfb15b96f6c2cba6ef48988e096a664d5f03d3e9",
        "issuedWholeSha256": {
          "metadata": "28f75951e7a81da89a1bf6743daf5d7fdead74c7120d17f118cf7f6d4873248a",
          "identity": "7141df080e4058f00e35775977b7dc72a0074c50d037b91c697a435a8c606661",
          "runtime": "cb13a68accf5e0300ae104b2a419f5f4e32ceaf2758c2646a77865c19d9af18c"
        }
      },
      "nativeSource": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "archive/exams/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
        "gitBlobSha1": "02a3526e43a69cc2a4dd69ebbb694740d43c3567",
        "sha256": "3fd102595c42ccdf9e32c8c9c498284d842dd46379070c630e2cc2aab365ca25",
        "reviewCommitSourceBlobSha1": "02a3526e43a69cc2a4dd69ebbb694740d43c3567"
      },
      "nativeReview": {
        "commit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427",
        "path": "docs/operations/m3-s2-meta-full-20261114/exams/E053.meta.json",
        "sha256": "d4d83b714748dcb61f985806a3e0e2371702823acde32233323b6a0d99b8f60b"
      },
      "rendererReview": {
        "commit": "c54f303dd84a78e7111cb0b4d095f78d503e65ea",
        "path": ".archive-meta-register/evidence/m3s2-current99-extra2-renderer-20261115/E053.renderer-continuity.json",
        "sha256": "d0357cd874a58b97ff503c3c5c88eedd99c3c67d6e0c1898b3d5e4309027dc70"
      },
      "sourceSnapshots": [
        {
          "commit": "5f8f509108cfc4bfac3ce47813839aaa3c558274",
          "path": "archive/exams/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
          "gitBlobSha1": "45c81f4c1e0e1d7d42a2d8ad17bc96219e2f46a5",
          "sha256": "c1991de72906533d51bb9a07baf10e3cd5f52df0df2c3297d222f2267e1c9eca",
          "questionSha256": "609c06573274decf1f8a3419c3b17448d26503ee207c3781187bf4890b371bbe"
        },
        {
          "commit": "87c0aef6bb95b04963bcec5469a0b09d888d6dce",
          "path": "archive/exams/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
          "gitBlobSha1": "29e8324717f9d94167fdba606124b62dd92e5971",
          "sha256": "4ddd22f765e7f221ba26d2ff07ead8cc5c292a4c92ef0ac3510110247939c109",
          "questionSha256": "ba859ff0d8b2da4d714eabb7b3df9f52448a85391ef1490b9bdedab35c8c69f7"
        }
      ],
      "assetDirectories": [
        "archive/assets/images/21_금당중_2학기_중간_중3_수학"
      ],
      "currentAssets": [
        {
          "path": "archive/assets/images/21_금당중_2학기_중간_중3_수학/q19-engine-upgrade.svg",
          "gitBlobSha1": "d96b1f65a757028cae869b4edb308ec25f9706eb",
          "sha256": "18e4ea153a2d53d297f2cbc74994215e42cb9bf79ea8649ffe164c00937af4f7"
        },
        {
          "path": "archive/assets/images/21_금당중_2학기_중간_중3_수학/q19-solution.svg",
          "gitBlobSha1": "c7ccad5be9240dba34b938ef9b2e0e5f3b9e384a",
          "sha256": "e88d0c2e00b5c6016e7554457a40bf817085bea7b6c388de06842ac3b14965fa"
        }
      ]
    }
  ],
  "codePins": [
    {
      "path": "tools/4slot/registered-renderer-continuity.mjs",
      "gitBlobSha1": "4ced47a9e712cc4b4def9d35d36f7a90f77a8482",
      "sha256": "b3f447bc44e1283b942eb2f70f778c32ceab667370ed1be2966687bbf573f3e8",
      "bytes": 8030
    },
    {
      "path": "tools/4slot/registered-renderer-continuity.cjs",
      "gitBlobSha1": "636508c172e4c2016cd285384d09b467920f4836",
      "sha256": "482b14918edf02eba8b794bbb350829b5ffc30f2fc89df23c0d360318dc27076",
      "bytes": 2728
    },
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
      "path": "archive/tools/meta-foundation/native-reviewed-renderer-reuse.mjs",
      "gitBlobSha1": "2a92763df7777114ed403b0fc9e5ca5481171daa",
      "sha256": "83de1798ec68b90d29271a9bfd7a175eb19e57fd7c93e03d35c6992666a09336",
      "bytes": 12520
    },
    {
      "path": "archive/tools/meta-foundation/reviewed-current-renderer-continuity.mjs",
      "gitBlobSha1": "73a5b83ae2411dcafc58bf3103d31937f7ef6ceb",
      "sha256": "98c416216dc754a1b5d144a81741adf2ccba62c487f1d4c7fadba0a107332c83",
      "bytes": 47223
    },
    {
      "path": "tools/4slot/exam-items.cjs",
      "gitBlobSha1": "debef5587df86821c04e543afb72a72b2e0fc1e4",
      "sha256": "60e348829239772dfb916763835d2e21659ecd8eb2ba96e2621867352a935cf2",
      "bytes": 2234
    }
  ],
  "dataMetadataAtAuthoring": {
    "commit": "2c06ec048d62b96ea446d2136cd264c17ae57f0c",
    "selectedData": [
      {
        "path": "archive/data/question_metadata.json",
        "gitBlobSha1": "ba94f96cdb46566ed589e1fde03453223576e046",
        "bytes": 74502366
      },
      {
        "path": "archive/data/question_identity_map.json",
        "gitBlobSha1": "002a0a23ba507454a3b2cf3c62f3711519879b7b",
        "bytes": 27938431
      },
      {
        "path": "archive/data/item-4slot-index.json",
        "gitBlobSha1": "10ac903273bac37da0298b1b40101975bcc6902e",
        "bytes": 20318514
      },
      {
        "path": "archive/data/svg-accessibility-index.js",
        "gitBlobSha1": "20f6bffe2a1a4d20bc23fba01545a8cbf9742b25",
        "bytes": 483619
      }
    ],
    "runtimeFiles": [
      {
        "path": "archive/data/meta-foundation/runtime/algebra-2022-v1.json",
        "gitBlobSha1": "1282c359bdb9d32d356aadb4e5ac45978139901b",
        "bytes": 619372
      },
      {
        "path": "archive/data/meta-foundation/runtime/derivative-v1.json",
        "gitBlobSha1": "5f2e384664021d16dc85d9b7f1d80017db9e0379",
        "bytes": 1018673
      },
      {
        "path": "archive/data/meta-foundation/runtime/exponents-logarithms-v1.json",
        "gitBlobSha1": "c28451bddff6f931b58bffa0d1af75019b704abb",
        "bytes": 518859
      },
      {
        "path": "archive/data/meta-foundation/runtime/functions-graphs-v1.json",
        "gitBlobSha1": "428eb15384d94dd3ee88ffa3afb7eb6725aeabad",
        "bytes": 2053774
      },
      {
        "path": "archive/data/meta-foundation/runtime/geometry-equations-v1.json",
        "gitBlobSha1": "81becd1551f6e98bda11b7c61a89d68fe0c4ca14",
        "bytes": 1328417
      },
      {
        "path": "archive/data/meta-foundation/runtime/geometry-v1.json",
        "gitBlobSha1": "ad8b73867dc4731a840d516bb3de1dd2fdb80a2f",
        "bytes": 450510
      },
      {
        "path": "archive/data/meta-foundation/runtime/h1-foundation-v1.json",
        "gitBlobSha1": "7b0d194710675e0477a6478f52a978d1d70e8e29",
        "bytes": 5674867
      },
      {
        "path": "archive/data/meta-foundation/runtime/h1-original-source-v1.json",
        "gitBlobSha1": "cff2c222c8e371eb55f66b8578a28db0b4bd1b90",
        "bytes": 6727222
      },
      {
        "path": "archive/data/meta-foundation/runtime/integral-calculus-v1.json",
        "gitBlobSha1": "10c08ce06eb44fccf9a2f0389b9d0b38dbc4eb96",
        "bytes": 587295
      },
      {
        "path": "archive/data/meta-foundation/runtime/limit-continuity-v1.json",
        "gitBlobSha1": "4cf57da44195ce3fb90e6fbe843dcf549bbd8e08",
        "bytes": 565410
      },
      {
        "path": "archive/data/meta-foundation/runtime/middle-geometry-v1.json",
        "gitBlobSha1": "c42ff5c9189dc837eb5ec938cb6ae022671eaa24",
        "bytes": 6976077
      },
      {
        "path": "archive/data/meta-foundation/runtime/middle1-v1.json",
        "gitBlobSha1": "8a096d74050fd2b1f1da8244ddcd9744e1ae14da",
        "bytes": 1643163
      },
      {
        "path": "archive/data/meta-foundation/runtime/middle2-v1.json",
        "gitBlobSha1": "080ab8bd96254ca63c93b855327e6367d48cd2a8",
        "bytes": 363789
      },
      {
        "path": "archive/data/meta-foundation/runtime/middle3-v1.json",
        "gitBlobSha1": "d7f4ada14637007b2c37a3b51815e8b8c2abcbae",
        "bytes": 845781
      },
      {
        "path": "archive/data/meta-foundation/runtime/probability-statistics-v1.json",
        "gitBlobSha1": "c0fe1817557e1b15e1a653ce4bc17d7165a35cb6",
        "bytes": 3840663
      },
      {
        "path": "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json",
        "gitBlobSha1": "41dda89e742fd85798b948981651327e2cf9c9f9",
        "bytes": 196128
      },
      {
        "path": "archive/data/meta-foundation/runtime/sets-propositions-v1.json",
        "gitBlobSha1": "69db3f1eae73b87c7314f3b8a92a083e4b4aa68a",
        "bytes": 1107549
      },
      {
        "path": "archive/data/meta-foundation/runtime/trigonometry-v1.json",
        "gitBlobSha1": "a3f767af73aa1cd8dab3674a3d73f9571417c01d",
        "bytes": 304551
      }
    ],
    "selectedRowEquality": "NOT_RUN_REQUIRES_SCOPED_GATE"
  },
  "diagnosticRef": {
    "gitBlobSha1": "19ad3802d2fea84ed4d3d8d37693ab82b60c5c6e",
    "sha256": "c3a656d5240d0fe4da290070d486c86f17b8603cf4439fed0eefa3305eba42e3",
    "bytes": 14080
  },
  "noNewApproval": true,
  "reviewCommit": "c54f303dd84a78e7111cb0b4d095f78d503e65ea",
  "nativeReviewCommit": "c17c09a24eb356e4eaf17e4f5bc43c9844cf7427"
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
function need(ok,code){if(!ok)throw Error('M3_SOURCE45_'+code);}
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
 need(ref&&OID.test(ref.commit||'')&&OID.test(ref.gitBlobSha1||'')&&SHA.test(ref.sha256||'')&&
  Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<=128*1024*1024,'IMMUTABLE_REF');
 return {commit:ref.commit,path:safeRelative(ref.path),gitBlobSha1:ref.gitBlobSha1,sha256:ref.sha256,bytes:ref.bytes};
}
function reportOutput(p){
 const base=fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),out=path.resolve(p);
 need(out.startsWith(base+path.sep),'REPORT_OUTSIDE_RUNNER_TEMP');return out;
}
function safeError(error){
 const raw=String(error?.message||error||''),code=raw.split(':')[0];
 return {code:/^[A-Z][A-Z0-9_+|-]{0,179}$/.test(code)?code:'UNCLASSIFIED_FAILURE',sha256:sha(raw)};
}
function phase(report,name){report.phase=name;console.log(JSON.stringify({schemaVersion:CONFIG.schemaVersion,phase:name,status:'RUNNING'}));}
function provenance(root){
 const e=process.env,head=git(root,['rev-parse','HEAD']).toString().trim();
 need(e.GITHUB_ACTIONS==='true'&&e.GITHUB_EVENT_NAME==='push'&&e.GITHUB_REPOSITORY===CONFIG.repository&&
  e.GITHUB_REF===CONFIG.branch&&e.GITHUB_SHA===head&&e.ARCHIVE_M3_SOURCE45_EXPECTED_SHA===head&&OID.test(head),'OPS_PROVENANCE');
 const event=json(fs.readFileSync(e.GITHUB_EVENT_PATH));
 need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
  event.repository?.full_name===CONFIG.repository&&event.repository?.fork===false,'OPS_EVENT');
 need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||'')&&
  /^[A-Za-z0-9_-]+$/.test(e.GITHUB_JOB||''),'OPS_JOB');
 git(root,['merge-base','--is-ancestor',CONFIG.integrationAncestor,head]);
 return{eventName:'push',repository:CONFIG.repository,ref:CONFIG.branch,checkoutCommit:head,eventCommit:event.after,
  runId:e.GITHUB_RUN_ID,runAttempt:Number(e.GITHUB_RUN_ATTEMPT),job:e.GITHUB_JOB,
  integrationAncestor:CONFIG.integrationAncestor,reviewCommit:CONFIG.reviewCommit,nativeReviewCommit:CONFIG.nativeReviewCommit};
}

function run(root,output){
 root=fs.realpathSync(root);output=reportOutput(output);
 const report={schemaVersion:CONFIG.schemaVersion,status:'RUNNING',phase:'PROVENANCE',
  sourceQuestionCount:45,selectedQuestionCount:2,outsideQuestionCount:43,
  newMathematicalQa:0,newSemanticApprovals:0,newFourSlotVectors:0,newNativeApprovals:0,
  globalBuilderRun:false,sourceWrites:0,mainWrites:0,trackedCheckoutWrites:0,ChromeRuns:0};
 let work,fixture,rootHead,rootStatus,checkpoint=[];
 const currentInputs=new Map(),immutableInputs=new Map(),fixtureInputs=new Map(),rawPins=new Map();
 const publish=()=>{
  fs.mkdirSync(path.dirname(output),{recursive:true});const raw=Buffer.from(JSON.stringify(report,null,2)+'\n');
  need(raw.length<=2*1024*1024,'REPORT_SIZE');fs.writeFileSync(output,raw);
  const payload=raw.toString('base64'),width=6000,chunks=Math.ceil(payload.length/width);
  const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'M3_SOURCE45_EXISTING_RENDERER_TWO',
   bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw),chunks};
  console.log('ARCHIVE_SCOPED_REPORT_BEGIN '+JSON.stringify(receipt));
  for(let i=0;i<chunks;i++)console.log('ARCHIVE_SCOPED_REPORT_CHUNK '+JSON.stringify({index:i,data:payload.slice(i*width,(i+1)*width)}));
  console.log('ARCHIVE_SCOPED_REPORT_END '+JSON.stringify(receipt));
 };
 try{
  report.execution=provenance(root);rootHead=report.execution.checkoutCommit;
  rootStatus=git(root,['status','--porcelain=v1','--untracked-files=all']).toString();need(rootStatus==='','ROOT_DIRTY');
  for(const expected of[...CONFIG.codePins,...CONFIG.groups.map(g=>g.sidecarPin)]){
   pin(fs.readFileSync(file(root,expected.path)),expected,'CODE_OR_SIDECAR');
   need(git(root,['rev-parse',rootHead+':'+expected.path]).toString().trim()===expected.gitBlobSha1,'CODE_HEAD');
  }
  const builder=require(path.join(root,'tools/4slot/build-4slot-runtime.cjs'));
  const consumer=require(path.join(root,'archive/item-4slot.js'));
  const {sourceNumber,sourceIdentityNumber}=require(path.join(root,'tools/4slot/exam-items.cjs'));
  work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'m3-source45-'));
  fixture=path.join(work,'fixture');
  git(root,['clone','--quiet','--shared','--no-checkout','--no-hardlinks',root,fixture]);
  need(git(fixture,['rev-parse','HEAD']).toString().trim()===rootHead,'PRIVATE_HEAD');
  const commits=new Set(),objectSeen=new Set(),objectCache=new Map(),parsedDocs=new Set();
  let objectCacheBytes=0;
  const sourcePaths=new Set(CONFIG.groups.map(g=>g.sourcePin.path));
  const assetDirectories=CONFIG.groups.flatMap(g=>g.assetDirectories);
  function ensureCommit(commit){
   need(OID.test(commit),'COMMIT');if(commits.has(commit))return;
   try{git(root,['cat-file','-e',commit+'^{commit}']);}
   catch{git(root,['fetch','--quiet','--no-tags','--no-write-fetch-head','https://github.com/'+CONFIG.repository+'.git',commit]);}
   git(root,['cat-file','-e',commit+'^{commit}']);commits.add(commit);need(commits.size<=128,'COMMIT_BOUND');
  }
  function object(oid){
   need(OID.test(oid),'OBJECT_OID');if(objectCache.has(oid))return objectCache.get(oid);
   const bytes=git(root,['cat-file','blob',oid]);need(blob(bytes)===oid,'OBJECT_BYTES');objectSeen.add(oid);
   rawPins.set(oid,{gitBlobSha1:oid,sha256:sha(bytes),bytes:bytes.length});
   if(bytes.length<=4*1024*1024&&objectCacheBytes+bytes.length<=96*1024*1024){objectCache.set(oid,bytes);objectCacheBytes+=bytes.length;}
   return bytes;
  }
  function treeEntry(commit,rel){
   safeRelative(rel);ensureCommit(commit);
   const entry=git(root,['ls-tree','-z',commit,'--',rel]).toString();
   const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
   if(!(match&&match[3]===rel))report.failedTreeRead={commit,path:rel,treeEntrySha256:sha(entry)};
   need(match&&match[3]===rel,'IMMUTABLE_PATH');
   return{path:rel,gitBlobSha1:match[2]};
  }
  function immutable(ref){
   ref=refShape(ref);
   if(ref.path.startsWith('archive/exams/'))need(sourcePaths.has(ref.path),'UNRELATED_SOURCE_REF');
   const entry=treeEntry(ref.commit,ref.path);
   if(entry.gitBlobSha1!==ref.gitBlobSha1)report.failedImmutableRef={expected:ref,observed:entry};
   need(entry.gitBlobSha1===ref.gitBlobSha1,'IMMUTABLE_PATH');
   const bytes=object(ref.gitBlobSha1);pin(bytes,ref,'IMMUTABLE');
   const key=ref.commit+':'+ref.path,old=immutableInputs.get(key);
   if(old)need(stable(old)===stable(ref),'IMMUTABLE_CONFLICT');else immutableInputs.set(key,ref);
   need(immutableInputs.size<=1800,'IMMUTABLE_BOUND');return bytes;
  }
  function current(rel){
   safeRelative(rel);
   let bytes;try{bytes=fs.readFileSync(file(root,rel));}catch(error){report.failedCurrentRead={path:rel,error:safeError(error)};throw error;}
   const entry=treeEntry(rootHead,rel);need(blob(bytes)===entry.gitBlobSha1,'CURRENT_HEAD');
   const p={path:rel,gitBlobSha1:entry.gitBlobSha1,sha256:sha(bytes),bytes:bytes.length},old=currentInputs.get(rel);
   if(old)need(stable(old)===stable(p),'CURRENT_CHANGED');else currentInputs.set(rel,p);
   return bytes;
  }
  function put(rel,bytes){
   const full=path.join(fixture,safeRelative(rel));fs.mkdirSync(path.dirname(full),{recursive:true});
   if(fs.existsSync(full)){need(sha(fs.readFileSync(file(fixture,rel)))===sha(bytes),'PRIVATE_CONFLICT');return;}
   fs.writeFileSync(full,bytes,{flag:'wx',mode:0o444});
   fixtureInputs.set(rel,{path:rel,gitBlobSha1:blob(bytes),sha256:sha(bytes),bytes:bytes.length});
   const a=fs.statSync(full),b=fs.statSync(file(root,rel));need(a.dev!==b.dev||a.ino!==b.ino,'SHARED_WRITABLE_INODE');
  }
  function copy(rel){if(fixtureInputs.has(rel))return fs.readFileSync(file(fixture,rel));const bytes=current(rel);put(rel,bytes);return bytes;}
  function copyPinned(expected){const bytes=copy(expected.path);pin(bytes,expected,'CURRENT_FIXED');return bytes;}
  function copyPrefix(prefix,filter=()=>true){
   const entries=git(root,['ls-tree','-r','-z',rootHead,'--',prefix]).toString().split('\0').filter(Boolean);
   need(entries.length<=2500,'PREFIX_BOUND');
   for(const entry of entries){const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);need(m,'PREFIX_REGULAR');if(filter(m[3]))copy(m[3]);}
  }
  function declaredRef(ref){
   need(ref&&typeof ref.path==='string'&&OID.test(ref.commit||'')&&SHA.test(ref.sha256||''),'DECLARED_REF');
   if(ref.path.startsWith('archive/exams/'))need(sourcePaths.has(ref.path),'UNRELATED_SOURCE_REF');
   const entry=treeEntry(ref.commit,safeRelative(ref.path));
   if(Object.hasOwn(ref,'gitBlobSha1'))need(ref.gitBlobSha1===entry.gitBlobSha1,'DECLARED_GIT_DRIFT');
   const bytes=object(entry.gitBlobSha1);
   const normalized={commit:ref.commit,path:ref.path,gitBlobSha1:entry.gitBlobSha1,sha256:ref.sha256,bytes:bytes.length};
   if(Object.hasOwn(ref,'bytes'))need(ref.bytes===bytes.length,'DECLARED_SIZE_DRIFT');
   immutable(normalized);return{bytes,ref:normalized};
  }
  const metadataPath=rel=>typeof rel==='string'&&rel.endsWith('.json')&&
   /^(?:docs\/operations\/|archive\/data\/(?:meta-review|meta-foundation\/evidence)\/|\.archive-meta-register\/evidence\/)/.test(rel);
  function metadata(ref){
   need(metadataPath(ref.path)&&SHA.test(ref.sha256||''),'METADATA_REF');
   const bytes=ref.commit?declaredRef(ref).bytes:copy(ref.path);
   need(sha(bytes)===ref.sha256,'METADATA_BYTES');
   if(ref.commit&&fs.existsSync(path.join(root,ref.path)))copy(ref.path);
   const key=(ref.commit||rootHead)+':'+ref.path+':'+ref.sha256;
   if(parsedDocs.has(key))return json(bytes);
   parsedDocs.add(key);need(parsedDocs.size<=160&&bytes.length<=4*1024*1024,'DOC_BOUND');
   const data=json(bytes);
   // Whole issued rows are authenticated separately. Global output inventories
   // and unrelated applied-row provenance are never recursively interpreted.
   if(data.schemaVersion==='archive-reviewed-exam-meta-registration-v2'){
    for(const r of data.approval?.evidenceRefs||[])metadata(r);
   }else if(data.schemaVersion!=='m3-s2-complete-semantic-review-v1')hydrateDocument(data);
   return data;
  }
  function hydrateDocument(value){
   if(Array.isArray(value)){for(const x of value)hydrateDocument(x);return;}
   if(!value||typeof value!=='object')return;
   if(typeof value.path==='string'&&SHA.test(value.sha256||'')){
    if(value.commit){
     const out=declaredRef(value);
     if(metadataPath(value.path))metadata(value);
     else if(fs.existsSync(path.join(root,value.path)))copy(value.path);
     return;
    }
    if(metadataPath(value.path)){metadata(value);return;}
   }
   if(OID.test(value.reviewCommit||'')&&metadataPath(value.reviewRef?.path))
    metadata({...value.reviewRef,commit:value.reviewCommit});
   for(const[k,x]of Object.entries(value)){
    if(['outputDigests','appliedRecords','appliedIdentityRecords','runtimeRecords','metadataBefore','identityBefore','records'].includes(k))continue;
    if(k==='fingerprintRepairs'){
     for(const row of x||[])if(CONFIG.groups.some(g=>g.selected.questionUid===row.questionUid))hydrateDocument(row.sourceReview);
    }else hydrateDocument(x);
   }
  }
  function historicalAssets(commit,directory){
   ensureCommit(commit);need(assetDirectories.includes(directory),'ASSET_DIRECTORY_SCOPE');
   const entries=git(root,['ls-tree','-r','-z',commit,'--',directory]).toString().split('\0').filter(Boolean);
   need(entries.length<=512,'ASSET_COUNT_BOUND');
   for(const entry of entries){
    const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);need(m&&m[3].startsWith(directory+'/'),'ASSET_GIT');
    const bytes=object(m[2]);immutable({commit,path:m[3],gitBlobSha1:m[2],sha256:sha(bytes),bytes:bytes.length});
   }
  }
  phase(report,'AUTHENTICATED_INPUTS');
  const actualIndex=json(copy(INDEX)),identity=json(copy(ID)),metadataRows=json(copy(MD));copy(SVG);
  need(actualIndex.schemaVersion===builder.SCHEMA&&Array.isArray(actualIndex.records)&&Array.isArray(actualIndex.pending)&&
   Array.isArray(actualIndex.files),'ACTUAL_INDEX');
  need(identity.schemaVersion==='question-identity-map-v1'&&Array.isArray(identity.records)&&Array.isArray(metadataRows.records),'MD_ID');
  report.authoringDataComparison=CONFIG.dataMetadataAtAuthoring.selectedData.map(old=>({path:old.path,
   authoringGitBlobSha1:old.gitBlobSha1,currentGitBlobSha1:currentInputs.get(old.path).gitBlobSha1,
   wholeFileEqual:old.gitBlobSha1===currentInputs.get(old.path).gitBlobSha1,
   interpretation:'Current HEAD bytes are authenticated; selected whole rows are independently required below.'}));
  const joinMap=new Map(),uidUses=new Map(),states=[],compacts=new Map(),sidecarBytes=new Map(),receipts=new Map();
  for(const row of identity.records){
   const key=row.sourceArchiveFile+'#'+row.sourceOrdinal;if(!joinMap.has(key))joinMap.set(key,[]);
   joinMap.get(key).push(row);uidUses.set(row.questionUid,(uidUses.get(row.questionUid)||0)+1);
  }
  for(const group of CONFIG.groups){
   const source=copyPinned(group.sourcePin),compact=json(copyPinned(group.compactPin));
   copyPinned(group.dictionaryPin);sidecarBytes.set(group.sidecarPin.path,copyPinned(group.sidecarPin));
   const bank=builder.loadBank(source);need(bank.length===group.count&&compact.items.length===group.count&&
    compact.sourceArchiveFile===group.sourceArchiveFile&&!Object.hasOwn(compact,'scope'),'BANK_DENOMINATOR');
   compacts.set(group.sourceArchiveFile,compact);need(OID.test(compact.sourceGitBlobSha),'COMPACT_BASELINE');object(compact.sourceGitBlobSha);
   for(let i=0;i<bank.length;i++){
    const ids=joinMap.get(group.sourceArchiveFile+'#'+(i+1))||[],display=sourceNumber(bank[i]);
    need(ids.length===1&&UID.test(ids[0].questionUid)&&uidUses.get(ids[0].questionUid)===1,'UID_JOIN');
    need(String(ids[0].sourceQuestionNo)===sourceIdentityNumber(bank[i]),'IDENTITY_NUMBER');
    need(Number.isSafeInteger(display)&&display>0&&compact.items.filter(x=>x.ordinal===display).length===1,'DISPLAY_JOIN');
    states.push({questionUid:ids[0].questionUid,sourceArchiveFile:group.sourceArchiveFile,sourceOrdinal:i+1,
     sourceQuestionNo:sourceIdentityNumber(bank[i]),displayNumber:display,compactPath:group.compactPin.path});
   }
   for(const dir of group.assetDirectories)copyPrefix(dir);
   const receipt=json(copyPinned(group.receiptPin));receipts.set(group.examId,receipt);
   copyPinned(group.rendererBindingPin);copyPinned(group.rendererEvidencePin);copyPinned(group.independentReviewPin);
   need(receipt.metadataRegistrationStatus==='REGISTERED'&&receipt.scope==='PARTIAL_UIDS'&&
    receipt.approval?.type==='FINAL_QA'&&receipt.sourceArchiveFile===group.sourceArchiveFile&&
    receipt.sourceBlobSha1===group.sourcePin.gitBlobSha1&&receipt.sourceRawSha256===group.sourcePin.sha256&&
    receipt.expectedQuestionCount===group.count,'ISSUED_RECEIPT_SCOPE');
   for(const ref of receipt.approval.evidenceRefs||[])metadata(ref);
   const repair=receipt.fingerprintRepairs.filter(x=>x.questionUid===group.selected.questionUid);
   need(repair.length===1&&repair[0].sourceOrdinal===group.selected.sourceOrdinal,'SELECTED_ISSUED_REPAIR');
   hydrateDocument(repair[0].sourceReview);
   metadata(group.nativeReview);metadata(group.rendererReview);
   const nativeBytes=object(group.nativeSource.gitBlobSha1);
   need(group.nativeSource.gitBlobSha1===group.nativeSource.reviewCommitSourceBlobSha1,'NATIVE_SOURCE_SNAPSHOT');
   immutable({...group.nativeSource,bytes:nativeBytes.length});
   for(const ref of group.sourceSnapshots)declaredRef(ref);
   const historicalCommits=new Set([group.nativeSource.commit,...group.sourceSnapshots.map(r=>r.commit)]);
   for(const commit of historicalCommits)for(const dir of group.assetDirectories)historicalAssets(commit,dir);
   for(const asset of group.currentAssets){
    const bytes=copy(asset.path);need(blob(bytes)===asset.gitBlobSha1&&sha(bytes)===asset.sha256,'CURRENT_SELECTED_ASSET');
   }
  }
  need(states.length===45&&new Set(states.map(s=>s.questionUid)).size===45,'SOURCE45');
  const selected=new Set(CONFIG.groups.map(g=>g.selected.questionUid)),allUids=new Set(states.map(s=>s.questionUid));
  for(const group of CONFIG.groups){
   const s=states.filter(x=>x.questionUid===group.selected.questionUid);
   need(s.length===1&&s[0].sourceArchiveFile===group.sourceArchiveFile&&s[0].sourceOrdinal===group.selected.sourceOrdinal&&
    s[0].sourceQuestionNo===group.selected.sourceQuestionNo&&s[0].displayNumber===group.selected.sourceDisplayNumber,'SELECTED_TUPLE');
  }
  const outside=states.filter(s=>!selected.has(s.questionUid));need(outside.length===43,'OUTSIDE43');
  const stateOf=(index,tuple)=>{
   const records=index.records.filter(r=>r.questionUid===tuple.questionUid);
   const pending=index.pending.filter(r=>r.path===tuple.compactPath&&(r.ordinal==null||r.ordinal===tuple.displayNumber));
   need(records.length<=1&&(records.length===1?pending.length===0:pending.length>0),'STATE_PARTITION');
   if(records.length)need(records[0].sourceArchiveFile===tuple.sourceArchiveFile&&records[0].sourceOrdinal===tuple.sourceOrdinal&&
    String(records[0].sourceQuestionNo)===tuple.sourceQuestionNo,'STATE_TUPLE');
   return{questionUid:tuple.questionUid,record:records[0]||null,pending:pending.slice().sort((a,b)=>stable(a).localeCompare(stable(b),'en'))};
  };
  const actualOutside=outside.map(s=>stateOf(actualIndex,s)),selectedStates=states.filter(s=>selected.has(s.questionUid));
  const actualSelected=selectedStates.map(s=>stateOf(actualIndex,s));
  need(actualSelected.every(s=>s.record===null&&s.pending.length===1&&s.pending[0].reason==='STALE_STUDENT_PAYLOAD'),'CURRENT_TARGET_REQUIRES_REPLAN');
  report.actualBaseline={index:currentInputs.get(INDEX),selectedRegistered:0,selectedPending:2,
   outsideRegistered:actualOutside.filter(s=>s.record).length,outsidePending:actualOutside.filter(s=>!s.record).length,
   selectedWholeStateSha256:sha(stable(actualSelected)),outsideWholeStateSha256:sha(stable(actualOutside))};
  copyPrefix('archive/data/meta-foundation/canonical');copyPrefix('archive/data/meta-foundation/compiled');
  copyPrefix('archive/data/meta-foundation/runtime',p=>p.endsWith('.json'));
  copy('archive/data/master_tables/js_archive_tag_master.json');copyPrefix('archive/tools/meta-foundation');
  const registry=json(current('archive/data/meta-foundation/canonical/registry_index.json'));
  for(const ref of[...(registry.canonicalSources||[]),...(registry.compiledArtifacts||[])])copy(ref.path);
  copy('archive/data/meta-foundation/canonical/metadata_rules.json');
  const claimEntries=git(root,['ls-tree','-r','-z',rootHead,'--','.archive-meta-register']).toString().split('\0').filter(Boolean);
  for(const entry of claimEntries){
   const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);need(m,'CLAIM_TREE');
   const rel=m[3],uid=path.posix.basename(rel,'.json');
   if(!/^\.archive-meta-register\/4slot-[^/]+\//.test(rel)||!allUids.has(uid))continue;
   const doc=json(copy(rel));need(allUids.has(doc.questionUid)&&states.some(s=>s.questionUid===doc.questionUid&&
    s.sourceArchiveFile===doc.sourceArchiveFile&&s.sourceOrdinal===doc.sourceOrdinal),'CLAIM_SCOPE');
   hydrateDocument(doc);
  }
  function single(rows,group,label){
   const found=(rows||[]).filter(x=>x.questionUid===group.selected.questionUid);
   need(found.length===1&&found[0].sourceArchiveFile===group.sourceArchiveFile&&found[0].sourceOrdinal===group.selected.sourceOrdinal,label+'_UNIQUE');
   return found[0];
  }
  const runtimeContainers=[];
  for(const p of fixtureInputs.keys())if(p.startsWith('archive/data/meta-foundation/runtime/')&&p.endsWith('.json'))
   runtimeContainers.push({path:p,value:json(fs.readFileSync(file(fixture,p)))});
  report.selectedStoredAuthority=[];
  for(const group of CONFIG.groups){
   const receipt=receipts.get(group.examId),md=single(metadataRows.records,group,'CURRENT_MD'),id=single(identity.records,group,'CURRENT_ID');
   const issuedMd=single(receipt.appliedRecords,group,'ISSUED_MD'),issuedId=single(receipt.appliedIdentityRecords,group,'ISSUED_ID');
   const issuedRuntime=single(receipt.runtimeRecords,group,'ISSUED_RUNTIME'),matches=[];
   for(const c of runtimeContainers)for(const row of c.value.records||[])if(row.questionUid===group.selected.questionUid)matches.push({path:c.path,container:c.value,row});
   need(matches.length===1,'RUNTIME_GLOBAL_UNIQUE');
   const runtime=matches[0];need(runtime.container.status==='ACTIVE'&&runtime.container.packId===md.metaFoundationPackId,'RUNTIME_OWNER');
   for(const[k,a,b]of[['metadata',md,issuedMd],['identity',id,issuedId],['runtime',runtime.row,issuedRuntime]])
    need(stable(a)===stable(b)&&sha(stable(b))===group.selected.issuedWholeSha256[k],'ISSUED_WHOLE_'+k);
   need(md.metadataApprovalType==='FINAL_QA'&&String(md.metadataStatus).startsWith('approved_')&&md.metaFoundationStatus==='ACTIVE','STORED_FINAL_AUTHORITY');
   report.selectedStoredAuthority.push({questionUid:group.selected.questionUid,sourceOrdinal:group.selected.sourceOrdinal,
    metadataWholeSha256:sha(stable(md)),identityWholeSha256:sha(stable(id)),runtimeWholeSha256:sha(stable(runtime.row)),
    runtimePath:runtime.path,packId:md.metaFoundationPackId,packVersion:md.metaFoundationPackVersion,
    metadataApprovalType:md.metadataApprovalType,metadataStatus:md.metadataStatus,wholeIssuedEquality:true});
  }
  report.closure={currentFileCount:currentInputs.size,immutableRefCount:immutableInputs.size,
   metadataDocuments:parsedDocs.size,scope:'exact source2 and issued renderer proofs; no global outputDigests recursion'};
  phase(report,'ORIGINAL_NATIVE_RENDERER_AUTHORITY');
  report.authority=[];
  for(const group of CONFIG.groups){
   const child=spawnSync(process.execPath,[path.join(root,'tools/4slot/registered-renderer-continuity.mjs'),fixture,group.sidecarPin.path],
    {cwd:root,encoding:'utf8',timeout:120000,maxBuffer:4*1024*1024,
     env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0',NODE_OPTIONS:'--max-old-space-size=6144'}});
   const stdout=String(child.stdout||''),stderr=String(child.stderr||'');
   const execution={questionUid:group.selected.questionUid,sourceOrdinal:group.selected.sourceOrdinal,exitCode:child.status,
    stdoutSha256:sha(stdout),stderrSha256:sha(stderr),error:stderr?safeError(stderr):null};
   report.authority.push(execution);need(child.status===0&&!child.error,'ORIGINAL_NATIVE_WORKER');
   const result=json(Buffer.from(stdout));
   need(result.status==='PASS'&&result.questionUid===group.selected.questionUid&&result.sourceOrdinal===group.selected.sourceOrdinal&&
    result.sourceBinding==='REGISTERED_RENDERER_CONTINUITY'&&result.independentReviewClaim===false&&result.newFourSlotApprovals===0,'WORKER_RESULT');
   Object.assign(execution,{status:result.status,sourceBinding:result.sourceBinding,originalNativeRendererRequired:true,
    existingIssuedAuthority:true,newNativeApprovals:0,newFourSlotApprovals:0});
  }
  checkpoint=[...fixtureInputs.values()].filter(x=>x.path!==INDEX);
  const outsideSame=index=>{
   need(index.counts.files===2&&index.counts.items===45&&index.records.length+index.pending.length===45,'RESULT_DENOMINATOR');
   need(index.records.every(r=>allUids.has(r.questionUid))&&index.pending.every(r=>CONFIG.groups.some(g=>g.compactPin.path===r.path)&&
    Number.isSafeInteger(r.ordinal)),'RESULT_SCOPE');
   const now=outside.map(s=>stateOf(index,s));
   report.lastOutsideCheck={phase:report.phase,expectedSha256:sha(stable(actualOutside)),observedSha256:sha(stable(now)),
    changed:now.flatMap((x,i)=>stable(x)===stable(actualOutside[i])?[]:[{questionUid:x.questionUid,
     expectedWholeSha256:sha(stable(actualOutside[i])),observedWholeSha256:sha(stable(x)),
     expectedRegistered:!!actualOutside[i].record,observedRegistered:!!x.record,pending:x.pending.map(p=>safeError(p.reason))}])};
   need(stable(now)===stable(actualOutside),'OUTSIDE43_CHANGED');
  };
  const observedStable=result=>{for(const[p,h]of result.observed)need(sha(fs.readFileSync(file(fixture,p)))===h,'BUILD_OBSERVED_DRIFT');};
  const selectedSummary=index=>selectedStates.map(s=>{
   const x=stateOf(index,s);return{questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,registered:!!x.record,
    recordSha256:x.record?sha(stable(x.record)):null,pending:x.pending.map(p=>safeError(p.reason))};
  });
  function replacePrivate(rel,bytes){
   const full=path.join(fixture,safeRelative(rel));
   if(fs.existsSync(full)){file(fixture,rel);fs.chmodSync(full,0o644);}else fs.mkdirSync(path.dirname(full),{recursive:true});
   fs.writeFileSync(full,bytes,{mode:0o444});fs.chmodSync(full,0o444);
  }
  function build(previous){
   const result=builder.build(fixture,{previous,reuseCache:false});observedStable(result);outsideSame(result.index);return result;
  }
  phase(report,'BASELINE_WITHOUT_NEW_BINDINGS');
  for(const group of CONFIG.groups)fs.unlinkSync(file(fixture,group.sidecarPin.path));
  const before=build(actualIndex);
  need(before.index.records.filter(r=>selected.has(r.questionUid)).length===0,'BASELINE_ALREADY_REGISTERED');
  for(const s of selectedStates){
   const p=stateOf(before.index,s);need(p.pending.length===1&&p.pending[0].reason==='STALE_STUDENT_PAYLOAD','BASELINE_REASON');
  }
  report.before={counts:before.index.counts,selected:selectedSummary(before.index),outsideWholeStateSha256:sha(stable(actualOutside))};
  phase(report,'OFFICIAL_SOURCE45_BUILDER');
  for(const[p,bytes]of sidecarBytes)replacePrivate(p,bytes);
  const after=build(before.index),rows=after.index.records.filter(r=>selected.has(r.questionUid));
  report.after={counts:after.index.counts,selected:selectedSummary(after.index)};
  need(rows.length===2&&after.index.counts.registered===before.index.counts.registered+2&&
   after.index.counts.pending===before.index.counts.pending-2,'EXACT_TWO_RECOVERED');
  for(const group of CONFIG.groups){
   const row=rows.find(r=>r.questionUid===group.selected.questionUid);
   const item=compacts.get(group.sourceArchiveFile).items.find(it=>it.ordinal===group.selected.sourceDisplayNumber);
   need(row&&row.registrationStatus==='REGISTERED'&&row.sourceBinding==='REGISTERED_RENDERER_CONTINUITY'&&
    row.independentReviewClaim===false&&row.rendererContinuityRef?.path===group.sidecarPin.path&&
    row.rendererContinuityRef?.sha256===group.sidecarPin.sha256&&sha(stable(item))===group.selected.compactItemSha256&&
    stable(vector(row))===stable(vector(item)),'EXACT_EXISTING_VECTOR');
  }
  const verified=builder.verify(after.index),api=consumer.createIndex(after.index);let queries=0;
  for(const row of rows){
   need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_GET');queries++;
   for(const slot of builder.SLOTS)for(const term of row[slot]){
    need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_HAS_TERM');queries++;
   }
  }
  report.consumer={selected:2,queries,officialScopeVerified:verified.verified,status:verified.status,
   pendingPreserved:verified.pending,outsideWholeStateSha256:sha(stable(actualOutside))};
  phase(report,'COLD_REPLAY');
  replacePrivate(INDEX,Buffer.from(JSON.stringify(after.index)+'\n'));
  const cold=builder.run(fixture,{check:true});
  need(cold.changed===false&&cold.revalidatedFiles===2&&cold.reusedFiles===0,'COLD_CHECK');
  report.cold={changed:cold.changed,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,
   counts:cold.counts,indexSha256:cold.indexSha256};
  phase(report,'DECLARED_INDEPENDENT_REVIEW_DELETION');
  const sharedRef=CONFIG.groups[0].independentReviewPin;
  need(CONFIG.groups.every(g=>g.independentReviewPin.path===sharedRef.path&&g.independentReviewPin.sha256===sharedRef.sha256),'SHARED_REVIEW_REF');
  const reviewRaw=fs.readFileSync(file(fixture,sharedRef.path));fs.unlinkSync(file(fixture,sharedRef.path));
  const withoutReview=build(after.index);
  need(withoutReview.index.records.filter(r=>selected.has(r.questionUid)).length===0,'MISSING_INDEPENDENT_REVIEW_ACCEPTED');
  report.independentReviewDeletion={path:sharedRef.path,selectedRegistered:0,selectedRejected:2,
   selected:selectedSummary(withoutReview.index),outsideWholeStateSha256:sha(stable(actualOutside))};
  replacePrivate(sharedRef.path,reviewRaw);
  phase(report,'BOUND_COMPACT_ITEM_TAMPER');
  const first=CONFIG.groups[0],other=CONFIG.groups[1],tampered=json(sidecarBytes.get(first.sidecarPin.path));
  tampered.compactItemSha256='0'.repeat(64);
  replacePrivate(first.sidecarPin.path,Buffer.from(JSON.stringify(tampered,null,2)+'\n'));
  const badItem=build(after.index),lost=stateOf(badItem.index,selectedStates.find(s=>s.questionUid===first.selected.questionUid));
  const kept=badItem.index.records.find(r=>r.questionUid===other.selected.questionUid),otherPrior=rows.find(r=>r.questionUid===other.selected.questionUid);
  need(lost.record===null&&lost.pending.length===1&&kept&&stable(kept)===stable(otherPrior),'TAMPER_BOUNDARY');
  report.boundCompactItemTamper={questionUid:first.selected.questionUid,registered:false,otherSelectedWholeUnchanged:true,
   pending:lost.pending.map(p=>safeError(p.reason)),compactBytesChanged:false,outsideWholeStateSha256:sha(stable(actualOutside))};
  replacePrivate(first.sidecarPin.path,sidecarBytes.get(first.sidecarPin.path));
  phase(report,'NEW_SIDECAR_DELETION');
  for(const group of CONFIG.groups)fs.unlinkSync(file(fixture,group.sidecarPin.path));
  const deleted=build(after.index);need(deleted.index.records.filter(r=>selected.has(r.questionUid)).length===0,'DELETED_SIDECAR_ACCEPTED');
  for(const s of selectedStates){const x=stateOf(deleted.index,s);need(x.pending.length===1&&x.pending[0].reason==='STALE_STUDENT_PAYLOAD','SIDECAR_DELETE_REASON');}
  report.deleted={selectedRegistered:0,selectedRejected:2,counts:deleted.index.counts,selected:selectedSummary(deleted.index),
   outsideWholeStateSha256:sha(stable(actualOutside)),deletionFailClosed:true};
  for(const[p,bytes]of sidecarBytes)replacePrivate(p,bytes);
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
  report.actualMainRegistration='NOT_PERFORMED';report.actualPagesVerification='NOT_PERFORMED';publish();
  console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,sourceQuestionCount:45,
   selectedExistingAuthority:2,selectedConsumer:2,outsideWholeStatePreserved:43,coldChanged:false,
   independentReviewDeletionRejected:2,sidecarDeletionRejected:2,newNativeApprovals:0,mainWrites:0,reportSha256:sha(fs.readFileSync(output))}));
  return report;
 }catch(error){
  report.status='FAIL';report.error=safeError(error);report.actualMainRegistration='NOT_PERFORMED';
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
  else throw Error('M3_SOURCE45_UNKNOWN_ARGUMENT');
 }
 need(output,'OUTPUT_REQUIRED');run(root,output);
}
module.exports={run};
