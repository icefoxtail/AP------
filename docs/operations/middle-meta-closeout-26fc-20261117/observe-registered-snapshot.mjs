#!/usr/bin/env node
/**
 * Read-only evidence collector for the fixed five-semester Archive cohort.
 * This file is copied out of the candidate checkout, then run from the actual
 * registered snapshot checkout. It never evaluates question-bank JavaScript,
 * runs a builder/registrar, changes approvals, or writes tracked repository files.
 * Anonymous Git lazy reads may hydrate the immutable object read cache only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const CONFIG = {
  "baselineCommit": "22f79c4ffd5ad5f811c2840a532422e0ecabd3e1",
  "baselinePins": {
    "archive/data/question_identity_map.json": {
      "gitBlobSha1": "e455443e6348ec1f04a7b2bad726cb5bef66a110",
      "sha256": "4b917f2f33cb01104710d475ba4f8a957d7f7c18028777bdea4921ebab671f85",
      "bytes": 27938431
    },
    "archive/data/question_metadata.json": {
      "gitBlobSha1": "1064850acded7cc6169f285971d397faa2e21ee1",
      "sha256": "d4f4190b5901d37b00f84beb4076bd5ed9833f3d03204a6f50e38c9ce8a3f337",
      "bytes": 72794957
    },
    "archive/data/item-4slot-index.json": {
      "gitBlobSha1": "8af67c9067ea855b3898e0cc196fc4efc01641ab",
      "sha256": "a74519a13b233a1d774c8e8b8699465590aff7a9ea8c21d63fb5c0ba55fda422",
      "bytes": 20402039
    }
  },
  "denominators": {
    "M1S1": 286,
    "M1S2": 761,
    "M2S1": 1780,
    "M2S2": 1604,
    "M3S2": 1958
  },
  "consumer": {
    "path": "archive/item-4slot.js",
    "gitBlobSha1": "249e0af23b6a011d1247399ef487a635222e1e27",
    "sha256": "0845bd881541a0b3f8faaf709b12274d09f29805bc36870bc245d12f4bfdab7d",
    "bytes": 8639
  },
  "protectedGroups": {
    "originalM2ReviewHolds36": {
      "policy": "PRESERVE_BASELINE_D5_AUTHORITY_AND_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_04c3d102a777b46c2697761d8705a9914d436b993e7dbd615255b5f5fec48afb"
        },
        {
          "questionUid": "qid_v1_0d87a02b59f98a9f543e1be29489a0bc43e7febd4017d67d9bcba9b27fb62bf9"
        },
        {
          "questionUid": "qid_v1_16d7f39f001c81db4788b40d7f16b55ff87a124b24e334570872b58338ab717f"
        },
        {
          "questionUid": "qid_v1_1ae6c0b27056dacf0e5048181adcccd478d8171f924d467e3600b7bd54dfdf7c"
        },
        {
          "questionUid": "qid_v1_1bd38d319596bd53d3cf63517f7e0fcdcb3f943689c22e48a6a5155388c6e18c"
        },
        {
          "questionUid": "qid_v1_22a9ffd4f499d05ed3de7ed12f4de48231c166d790d8be65b445569cc62a9845"
        },
        {
          "questionUid": "qid_v1_2cc9c4780dca8975f92ba7ed5d3306628554a28088350e533f8fa1b58a7d7583"
        },
        {
          "questionUid": "qid_v1_367e012776642d6e80755d48a5fb420cbc1af507280a4627110830e2dab502f4"
        },
        {
          "questionUid": "qid_v1_39d8117846b4f90aa0324a084694153a16a445097d2732572b3b5905ef778448"
        },
        {
          "questionUid": "qid_v1_3ace257ad3afd1bde0589c7d9c45a52309a789010770032226a28a7816be50ab"
        },
        {
          "questionUid": "qid_v1_3e2915ca0d650e815da2c14f7c485556b1de06fa1ccbe31f4a62be4ac9e3f50e"
        },
        {
          "questionUid": "qid_v1_4ceb0bdbddacfe4d9737f943b966a542e296123fa20cdae9498e7cfbc2accfac"
        },
        {
          "questionUid": "qid_v1_4daa03572ff93ccfa7b90ccfd12808e7004cca4b0ec93ec0e6d9ebe3617ffb91"
        },
        {
          "questionUid": "qid_v1_55fd6b255eeb5b4ce5e8c1d25ff545ab5f17252e219e17c55c2542fbe8d8e14f"
        },
        {
          "questionUid": "qid_v1_5ea7778dbac6e3f48afc272885bbd1807cd92b8ddb2dbd79e4f55f6dc85f02ce"
        },
        {
          "questionUid": "qid_v1_6083ec375d3b2a9f0e432de61c84a533c239a2b21aa5fe3f978d37416e3bc273"
        },
        {
          "questionUid": "qid_v1_6c59e9e4406e0d62ed5464d02180957b75ca763b877e459ba2076249cb7e9711"
        },
        {
          "questionUid": "qid_v1_6eeb88c697961f3b4f2f00395f4c4928483ef2107108f9a1267d4dbc6b94b3da"
        },
        {
          "questionUid": "qid_v1_7b6f35220efcfae2fddf05cff7c60ea79ef54b66e0de4d1c98d9d772da7e6835"
        },
        {
          "questionUid": "qid_v1_80e416719b9c305445c7ca0a408aa6b501a43c2cbb0c1d13dd9fb717b6e23111"
        },
        {
          "questionUid": "qid_v1_815dd58f2f0e0b1ff1d4917a740e6ba23e6d7c45310a862bcf3f5059f3c6fdb1"
        },
        {
          "questionUid": "qid_v1_84b8f337f11de70b4e5f78556667435b68bc7c497c81341cf06b8cf84a5a40d6"
        },
        {
          "questionUid": "qid_v1_8a8022ea4db53d559711e09960cdae09bccae92129b0877d05c83e9bc986d945"
        },
        {
          "questionUid": "qid_v1_951164b70d75fc3e2b5f83343b70d96f4789fc3c16761ec67cf4c54857093182"
        },
        {
          "questionUid": "qid_v1_9e97e29e22c5ef6dfa1fe87a9145ec59a2cf6e8bee436ae79d194590ed8daa2b"
        },
        {
          "questionUid": "qid_v1_b91045524e4a13e5c4465bd497aa69622ba0186ca58aab74fc4204dbdcb6c519"
        },
        {
          "questionUid": "qid_v1_bc40c0b577c15f8114402fd7fcd3e55180927bba6fc8ebc36b57098c68b15a75"
        },
        {
          "questionUid": "qid_v1_be9cc27468f94662d3ca96dcfa280b43ff18b1ef239bd54f83c1b90306e65203"
        },
        {
          "questionUid": "qid_v1_cf74a1f77b263aedd61c770a11a203584da72439041b23a6316c682c16774665"
        },
        {
          "questionUid": "qid_v1_d5a7d623d9a356650d37df03955161e82aea38b1ad8303c41e6c4c0921c93d3b"
        },
        {
          "questionUid": "qid_v1_e00d7e23c46a1468b70b358ae7ccf2d1511974039c2571072d0f5ec79bf42af0"
        },
        {
          "questionUid": "qid_v1_f0d437ed043c09185f9beb639a6e6a92ad5703ea65f67f330e3acb4ca472dd80"
        },
        {
          "questionUid": "qid_v1_f25f0903341857fdfee45f1c3e5b0a0e2d1d3e335098a90bb7be676940701111"
        },
        {
          "questionUid": "qid_v1_f738345d75348c9f769b8120c8aeb7b384dbea0fe8606a2e0e2c13c822bbc7d5"
        },
        {
          "questionUid": "qid_v1_fd38acbc6175aaf889113ee736396df076128e008d2984a3ff169bc4d2831fcf"
        },
        {
          "questionUid": "qid_v1_ff5129c97cc92f71068cf6ad1c43c8a0613fc67b46bade77a17cc7033b522a0a"
        }
      ],
      "authorityAxis": "D5"
    },
    "hyangrimQ5": {
      "policy": "PRESERVE_BASELINE_REGISTERED_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_d3998bfef5cb06a7fa4f1c95a69a433064b76b872f2fd9da0690d9e5b97b12b8",
          "sourceArchiveFile": "original/middle/m2/2final/20_향림중_2학기_기말_중2_기출.js",
          "sourceOrdinal": 5
        }
      ]
    },
    "m2ClosedEight": {
      "policy": "OBSERVE_REGISTRATION_AND_PRESERVE_EXISTING_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 4
        },
        {
          "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 5
        },
        {
          "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 9
        },
        {
          "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 18
        },
        {
          "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 20
        },
        {
          "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
          "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
          "sourceOrdinal": 23
        },
        {
          "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
          "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
          "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
          "sourceOrdinal": 10
        }
      ]
    },
    "m1RestorationTwelve": {
      "policy": "PRESERVE_BASELINE_REGISTERED_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_cee13b386e463414b43c2b70cd54cf16f32d671aa80d8b0cd34728e0f9413f90",
          "sourceArchiveFile": "original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 20
        },
        {
          "questionUid": "qid_v1_f396d65be774ad30b02478c81036d0c742e9a26db49362a463356d6bc8fe66b4",
          "sourceArchiveFile": "original/middle/m1/2final/23_왕운중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 10
        },
        {
          "questionUid": "qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140",
          "sourceArchiveFile": "original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 13
        },
        {
          "questionUid": "qid_v1_9194f2667ed473c402677062a770c695c172fb4b15542a27a6f981b00539bb27",
          "sourceArchiveFile": "original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 24
        },
        {
          "questionUid": "qid_v1_3fd69cfc2c3ccb74b00dcf9a3d8f100ea3c92eed09c007523934726f071afcc1",
          "sourceArchiveFile": "original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 8
        },
        {
          "questionUid": "qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15",
          "sourceArchiveFile": "original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 17
        },
        {
          "questionUid": "qid_v1_0e2c7aa4fc34b42aa0782b80ff5c5085f2eaa97a6f6d143d51ce7e1ec39c29d4",
          "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 8
        },
        {
          "questionUid": "qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e",
          "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 18
        },
        {
          "questionUid": "qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3",
          "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 19
        },
        {
          "questionUid": "qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6",
          "sourceArchiveFile": "original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",
          "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",
          "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 8
        }
      ]
    },
    "m1TypedSeven": {
      "policy": "OBSERVE_REGISTRATION_AND_PRESERVE_EXISTING_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246",
          "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 8
        },
        {
          "questionUid": "qid_v1_04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6",
          "sourceArchiveFile": "original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3",
          "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 19
        },
        {
          "questionUid": "qid_v1_a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e",
          "sourceArchiveFile": "original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 18
        },
        {
          "questionUid": "qid_v1_b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15",
          "sourceArchiveFile": "original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 17
        },
        {
          "questionUid": "qid_v1_dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140",
          "sourceArchiveFile": "original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 13
        },
        {
          "questionUid": "qid_v1_ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c",
          "sourceArchiveFile": "original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js",
          "sourceOrdinal": 6
        }
      ]
    },
    "m1ContentHoldsFour": {
      "policy": "MUST_REMAIN_UNREGISTERED_AND_METADATA_UNCHANGED",
      "rows": [
        {
          "questionUid": "qid_v1_957c3b3bfe04be724b389d76145bd21ccf7cfa6289d7d3188cf2612ddc37ef0a",
          "sourceArchiveFile": "original/middle/m1/2final/23_연향중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 19,
          "documentaryReason": "SOLUTION_IMAGE_CHANGED_NOT_APPROVED_BY_PROBLEM_ONLY_EVIDENCE"
        },
        {
          "questionUid": "qid_v1_f498f0a348a7c01027483e35fad90b8059a6243c26167ad801c30d4f45326a67",
          "sourceArchiveFile": "original/middle/m1/2final/25_왕의중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 20,
          "documentaryReason": "SOLUTION_IMAGE_CHANGED_NOT_APPROVED_BY_PROBLEM_ONLY_EVIDENCE"
        },
        {
          "questionUid": "qid_v1_7ee583a6f035d52d87cbee33e22094ec767345471ceca06fdf3660f137ea314f",
          "sourceArchiveFile": "original/middle/m1/2final/24_연향중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 14,
          "documentaryReason": "SOLUTION_TEXT_CHANGED_WITHOUT_CURRENT_MATHEMATICAL_APPROVAL"
        },
        {
          "questionUid": "qid_v1_94b9edd5af5208527e7259ed4dcf08fc04febf24cd888ddbdb30740819639294",
          "sourceArchiveFile": "original/middle/m1/2final/24_연향중_2학기_기말_중1_기출.js",
          "sourceOrdinal": 18,
          "documentaryReason": "PROBLEM_TEXT_CHANGED_WITHOUT_CURRENT_MATHEMATICAL_APPROVAL"
        }
      ]
    },
    "m1DocumentaryPending43": {
      "policy": "OBSERVE_PHYSICAL_SEPARATELY_FROM_UNRESOLVED_ACCEPTANCE",
      "rows": [
        {
          "questionUid": "qid_v1_b9d7d447afbcfd599462717c77fbe38f00f172a60b100880b1ffd5d1b8bf07d8",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 10
        },
        {
          "questionUid": "qid_v1_484e6d95ce96d3634950b7de620d866e15b2d2d1e7e93fcaf11f932de4731fd7",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 11
        },
        {
          "questionUid": "qid_v1_cdabb11b2a4e461389781a8132e50d726250357b740393e40af02559df852259",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 12
        },
        {
          "questionUid": "qid_v1_e6f671fb5c42ec9c26acf7ab8e7d99a4820ef4ff37e14b8bd7d8bea5caa4da67",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 13
        },
        {
          "questionUid": "qid_v1_b9d33f2b5b9a55cc413dbb9fd52399075d8c44581aa3191fe8badcac3e68dc50",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 14
        },
        {
          "questionUid": "qid_v1_c52522288ff65425f7f7ff23a2de2ef59f039524cba13128449f78536ea3ba09",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 15
        },
        {
          "questionUid": "qid_v1_cb7a537436ae8fd42eb85518e6acbc1b001afb645baaeae7bba127846eed525a",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 16
        },
        {
          "questionUid": "qid_v1_ad709943a1a6e3f2e5bc6e0b84896555274cf143b8a858213c0b5457110e368f",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 17
        },
        {
          "questionUid": "qid_v1_0b40b2cbc98bc9435d0e78ce3690c7799ef5446a333a70fba544d1e37cad8ab5",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 18
        },
        {
          "questionUid": "qid_v1_36a9c3aae1c92e4996800e96d3a74a94778839d5cab92145cbabe227b31b7222",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 19
        },
        {
          "questionUid": "qid_v1_2e57de2c53204013dd96317d274069537db1672516e0797707dc13f55167161f",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 20
        },
        {
          "questionUid": "qid_v1_8ef5ba063705db6f671d5e21c33aa4a97ed7c810900890d9f8fe0b33ca04523d",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 21
        },
        {
          "questionUid": "qid_v1_8aaf2fd741c5b73ac02e21f63a17bc06fe1de7f06fc3f1174ef18cb3a369e187",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 22
        },
        {
          "questionUid": "qid_v1_a83d7815861b1fbae504b39ebad15a6816c8a12580e96ed0c995a6d5092c83c1",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 23
        },
        {
          "questionUid": "qid_v1_a2b0cce70d4bdacb7349d01c0cd0972d38e8a2be5ea93fac8232b4f71222027e",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 24
        },
        {
          "questionUid": "qid_v1_e5c6c39a303f03299f61f46ad735e90e05c224fef51c619dd0ee5c9db2fce109",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 2
        },
        {
          "questionUid": "qid_v1_49ccafc9fb4fd2cb7a0c8a92eeed51bc0b82243c184f000f731c545267b2aa43",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 3
        },
        {
          "questionUid": "qid_v1_480baed40d0cab463401e14466227872bcab7e46e23e756718b8e20808e36cc9",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_546fa738b36a4c08a612fa69f963ccc184639925057461b268906a3def839687",
          "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
          "sourceOrdinal": 9
        },
        {
          "questionUid": "qid_v1_cfd95d786b0c6ebdd73ae922cf0848876b672c813654245de48cd86b50417cdd",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 10
        },
        {
          "questionUid": "qid_v1_31240c14148ac835d5fa413a2c1f2ddec761cc97e08d619a850effa20044a39e",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 11
        },
        {
          "questionUid": "qid_v1_af43fa6f95f310083fca054f5078763dd5a352f7c096ee3dabd2cb7323bc4d43",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 12
        },
        {
          "questionUid": "qid_v1_166fa40c76545fe976ba0662a7b8f71eb8b7c27414071ea3bb51ee3c28ad2daa",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 13
        },
        {
          "questionUid": "qid_v1_adb80c7886a9d65a0600241849cc4636953bbacc415e7da81ea98c463f577499",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 14
        },
        {
          "questionUid": "qid_v1_d1d8d1f29d81896f68ad20120f073f7e366fc96a1dafdd59777f03fff1ed0072",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 15
        },
        {
          "questionUid": "qid_v1_1e4df329a2bd739a060fe2d1f93211a63f7749f4f3b2ef843779762e9e6a5bf5",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 16
        },
        {
          "questionUid": "qid_v1_c23862f44cc5d4cb982877460c7ca53b991276d0ec1185604ce88324a4f6259d",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 17
        },
        {
          "questionUid": "qid_v1_45933b226dd4980c877d5ea83b49ca98825968c60f758222c963c3ae757c9887",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 18
        },
        {
          "questionUid": "qid_v1_61ca901eb7d7028acbb19974851cf36a7590659077392d15dd1fc3a61e8a21fe",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 19
        },
        {
          "questionUid": "qid_v1_54c6820c76afd2705802ae22a3ede27a4ad9f7665693b7c8a3eee0d23382a38c",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 1
        },
        {
          "questionUid": "qid_v1_0def22a114a45b0d6f241af682c8bfef74f17ce31718254e837462adf17a58a8",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 20
        },
        {
          "questionUid": "qid_v1_adc6eadf8ff6805ad0e8c0576b866dc8ad8d28f89a95d4baae0c017c292ab891",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 21
        },
        {
          "questionUid": "qid_v1_d3a543e6e33d17c184230397e9da97fa64a7551927a66cd140c26c0e317c4f78",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 23
        },
        {
          "questionUid": "qid_v1_466c40d150769a114cea911b41ac66c5792568a4a8503a3dea4b66a5652a5077",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 24
        },
        {
          "questionUid": "qid_v1_b7758a8c3c9680b0d4002de238cf6841dcd9386c06774572e3f78b3e80e1e61a",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 25
        },
        {
          "questionUid": "qid_v1_d57c23d646907fcd575778df6c6771c9b8f380ef2562df7e8ef08a416e89c220",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 2
        },
        {
          "questionUid": "qid_v1_722cc10a5815f1e876b30555e0c3e6e90e72af2f7c303706eb5ddd3ae9862142",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 3
        },
        {
          "questionUid": "qid_v1_2235d90110c0d0d1d945c4f7ff7698f9476bdf3679a9790b483f37f11111eaaa",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 4
        },
        {
          "questionUid": "qid_v1_55a647567a90db17015d22feaeda97999920b92d7c79b56a24b777f7939513a2",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 5
        },
        {
          "questionUid": "qid_v1_0bb62569df556fa2b64b7b9a77d2bd3f5e4a77e52e9303e1fe47d4e408cb4813",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 6
        },
        {
          "questionUid": "qid_v1_40fd398616d8da954d3398e977a61f7fa1d6f2b24bd230f2ef85e170ddf0ded9",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 7
        },
        {
          "questionUid": "qid_v1_8e9e6ecb3b33aa09c0248754042a54120df462426a3e8ccdf7032525137b31d4",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 8
        },
        {
          "questionUid": "qid_v1_a711da3a9b6e12bd4b11c2ba27df1f774a36bb1cdbcbe293bb42c262efb1792b",
          "sourceArchiveFile": "original/middle/m1/1mid/17_금당중_1학기_중간_중1_수학.js",
          "sourceOrdinal": 9
        }
      ]
    },
    "m1ParentSix": {
      "policy": "PRESERVE_MAIN_MERGE_REVIEW_REQUIRED",
      "rows": [
        {
          "questionUid": "qid_v1_412754443f85747ce4890e8afc74aeb5d0ad694ce29aa65e1291f9c480f21418",
          "sourceOrdinal": 2,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        },
        {
          "questionUid": "qid_v1_deee38d5b788ac6e915dbad15defbb555f74f983d513849c7eb1ad227a9d3f07",
          "sourceOrdinal": 7,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        },
        {
          "questionUid": "qid_v1_26ab5e93f881b70d55b8517d61e1c779c737157a7306f28cd6f70bd28b86aed6",
          "sourceOrdinal": 11,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        },
        {
          "questionUid": "qid_v1_bce899674693d26cd6cb08ce76c09d9bfeb8845bc519f43f7f2c7a05dd478b46",
          "sourceOrdinal": 12,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        },
        {
          "questionUid": "qid_v1_8bfafdeba785feb2052349ea5279d59dfb74bfacc5ccdc8e0a0161c3c9357729",
          "sourceOrdinal": 16,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        },
        {
          "questionUid": "qid_v1_930f72bdad783a8a1f7a0f12e1a4cbe0eb244d9024cfa5ff15a55756ad8cc849",
          "sourceOrdinal": 19,
          "sourceArchiveFile": "original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js"
        }
      ]
    },
    "m2s1SvgSeven": {
      "policy": "PRESERVE_BASELINE_REGISTERED_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6",
          "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
          "sourceOrdinal": 3
        },
        {
          "questionUid": "qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569",
          "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
          "sourceOrdinal": 15
        },
        {
          "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
          "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
          "sourceOrdinal": 11
        },
        {
          "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
          "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
          "sourceOrdinal": 24
        },
        {
          "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
          "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
          "sourceOrdinal": 13
        },
        {
          "questionUid": "qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5",
          "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
          "sourceOrdinal": 15
        },
        {
          "questionUid": "qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd",
          "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
          "sourceOrdinal": 24
        }
      ]
    },
    "m3Q5Q12": {
      "policy": "PRESERVE_BASELINE_REGISTERED_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
          "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 5
        },
        {
          "questionUid": "qid_v1_1aac12db1a167973138e8dc51afcd5e0b19fcf73d4bb030ea406701acd0b8c4a",
          "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 12
        }
      ]
    },
    "m3LayoutQ16": {
      "policy": "PRESERVE_BASELINE_REGISTERED_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_0ec5ac5da3b680c3a3e688406be0da91045d4ea581a83b6ec224927defe57bdf",
          "sourceArchiveFile": "original/middle/m3/2final/25_풍덕중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 16
        }
      ]
    },
    "m3D5HoldsTwo": {
      "policy": "PRESERVE_BASELINE_D5_AUTHORITY_AND_VECTOR",
      "rows": [
        {
          "questionUid": "qid_v1_ea54d4de580aa038ed971c46902e27cf8b8a72529784fc6906318c4344933a0a",
          "sourceArchiveFile": "original/middle/m3/2final/24_신흥중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 22
        },
        {
          "questionUid": "qid_v1_40aa1327b3aeda600f2226057de38a1988b8382da15cd58d43abc7bfbdd79310",
          "sourceArchiveFile": "original/middle/m3/2final/22_팔마중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 22
        }
      ],
      "authorityAxis": "D5"
    },
    "m3RemainingThree": {
      "policy": "REQUIRE_METADATA_IDENTITY_RUNTIME_EQUALITY",
      "rows": [
        {
          "questionUid": "qid_v1_1cf3d85ff4d544dc0a3e559c81a1fe06863b63152549eaa68eef1b06415ac34f",
          "sourceArchiveFile": "original/middle/m3/2mid/26_왕운중_2학기_중간_중3_기출.js",
          "sourceOrdinal": 16
        },
        {
          "questionUid": "qid_v1_5500746079d438e07f5bfdada0a10468f60c1bd571d20536e7059d277697913b",
          "sourceArchiveFile": "original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 9
        },
        {
          "questionUid": "qid_v1_eb3225d943fd75e92d94862dc752a32c94bdaed14dcd5111028f8a89e0a7587b",
          "sourceArchiveFile": "original/middle/m3/2final/21_팔마중_2학기_기말_중3_기출.js",
          "sourceOrdinal": 6
        }
      ]
    }
  },
  "evidence": {
    "membership": {
      "libraryFileId": "libfile_4f02e5d6dc088191b5f66381986d60d4",
      "version": "28",
      "pointer": "/currentCloseoutRepairs/actual6bcFiveSemesterReconciliation/document",
      "originalReportedSha256": "926cbf5323660e3573cd212136fdc36782c4b88cbee4edc16d16daf993db20d0"
    },
    "protected36": {
      "gitBlobSha1": "e82b83f4acc8e9f8fcad43ce52c3ed7b4ccf3ac1",
      "sha256": "be31e4e5985c43c7eb9fabf0228d39f77c952050c62e2d2833ed85895107a706",
      "bytes": 22607,
      "pointer": "/protectedScope"
    },
    "documentary43": {
      "gitBlobSha1": "7d070e85f88a1e6b3fe338d48463a225f6eb8dcb",
      "sha256": "75d2f7bacb1fe17168d02c24027a19dfe75953285439d6b9a62608ee5a1dac79",
      "bytes": 96847,
      "primaryPartition": {
        "methodAcceptanceMissing": 42,
        "sourceVersionConflict": 1
      },
      "methodMissingAxisIncludingConflict": 43
    },
    "restored12": {
      "libraryFileId": "libfile_4f02e5d6dc088191b5f66381986d60d4",
      "version": "28",
      "pointer": "/currentCloseoutRepairs/actualB46M1TwelveConsumer/document"
    },
    "publicPaths": {
      "libraryFileId": "libfile_4f02e5d6dc088191b5f66381986d60d4",
      "version": "28",
      "pointer": "/publicDeploymentEvidence/proof/document",
      "originalReportedSha256": "16a72d081860961fa5d3987c8162af4b16e901f1155315f1a92b7a7c6efa21f7",
      "selection": "Nine metadata/runtime/basic-parent paths from the prior verified public20 inventory; no new URL path inferred."
    },
    "publicPathMappingCode": [
      {
        "path": "tools/ci/archive-pages-release-identity.mjs",
        "gitBlobSha1": "fa7d97f5d81e5f412412c11250fa30a0ed835cfb",
        "basis": "M3 independent current735 code reading"
      },
      {
        "path": "tools/ci/student-portal-public-release.mjs",
        "gitBlobSha1": "ad72b767019273c25ba364f11196c04b9493ea49",
        "basis": "M3 independent current735 code reading"
      },
      {
        "path": "tools/build-archive-pages-site.mjs",
        "gitBlobSha1": "26e6080101edd4f7dfe5d0824c3e389d9d62d2ad",
        "basis": "M3 independent current735 code reading"
      }
    ]
  },
  "publicBase": "https://icefoxtail.github.io/AP------/",
  "publicPaths": [
    "archive/data/archive2-canonical-input-manifest.json",
    "archive/data/archive2-catalog.json",
    "archive/data/archive2-source-verification-index.json",
    "archive/data/item-4slot-index.json",
    "archive/data/svg-accessibility-index.js",
    "archive/data/basic-scope-parent-links.json",
    "archive/data/meta-foundation/runtime/middle-geometry-v1.json",
    "archive/data/meta-foundation/runtime/middle1-v1.json",
    "archive/data/question_metadata.json"
  ],
  "documentaryConflictUid": "qid_v1_c52522288ff65425f7f7ff23a2de2ef59f039524cba13128449f78536ea3ba09",
  "resolvedTranscriptionUid": "qid_v1_2e57de2c53204013dd96317d274069537db1672516e0797707dc13f55167161f"
};

const UID_RE = /^qid_v1_[a-f0-9]{64}$/;
const SHA_RE = /^[a-f0-9]{40}$/;
const SLOTS = ['given', 'goal', 'method', 'condition'];
const ID_PATH = 'archive/data/question_identity_map.json';
const MD_PATH = 'archive/data/question_metadata.json';
const INDEX_PATH = 'archive/data/item-4slot-index.json';
const VERIFY_PATH = '.archive-meta-register/auto/4slot/last-verification.json';
const RUNTIME_PATHS = [
  'archive/data/meta-foundation/runtime/middle-geometry-v1.json',
  'archive/data/meta-foundation/runtime/middle1-v1.json',
  'archive/data/meta-foundation/runtime/middle2-v1.json',
  'archive/data/meta-foundation/runtime/middle3-v1.json'
];
const PREFIXES = [
  ['M1S1', 'original/middle/m1/1mid/'], ['M1S1', 'original/middle/m1/1final/'],
  ['M1S2', 'original/middle/m1/2mid/'], ['M1S2', 'original/middle/m1/2final/'],
  ['M2S1', 'original/middle/m2/1mid/'], ['M2S1', 'original/middle/m2/1final/'],
  ['M2S2', 'original/middle/m2/2mid/'], ['M2S2', 'original/middle/m2/2final/'],
  ['M3S2', 'original/middle/m3/2mid/'], ['M3S2', 'original/middle/m3/2final/']
];
const AXIS_FIELDS = [
  'metadataApprovalType', 'reviewStatus', 'metadataStatus', 'tagStatus',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
  'legacyLevelCompatibility', 'defaultSelectable'
];
const D5_FIELDS = [
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
  'legacyLevelCompatibility'
];

// Closed metadata-only repair for the five source schemas actually observed
// with nonnumeric identity IDs. These exact source bytes contain JSON data;
// repository JavaScript is never executed or transformed into executable code.
const LEGACY_NUMBERING_PINS = [
  {
    "sourceArchiveFile": "original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js",
    "gitBlobSha1": "a370abb83cfa7bb65a8de980422c5b4869c3490f",
    "sha256": "d6930f0aab817111af7c25fce3cfdbf7a4b5002269523719e004734e6c3c245d",
    "bytes": 11847,
    "questionCount": 24
  },
  {
    "sourceArchiveFile": "original/middle/m3/2final/19_동산여중_2학기_기말_중3_수학.js",
    "gitBlobSha1": "c9efd5c9641d21127bbbeb0b77f69cd270e7b632",
    "sha256": "b97ed85296292713204bb12a4cdbb6f47f40892922da35df005dd12cd46975a4",
    "bytes": 80832,
    "questionCount": 25
  },
  {
    "sourceArchiveFile": "original/middle/m3/2final/21_연향중_2학기_기말_중3_수학.js",
    "gitBlobSha1": "3e83797a4a7e0abdceb4dc47be8f7a60e5a268a7",
    "sha256": "593994b906e074da4f6e39ba956b976534f9654add9404fe24de69f8aded72bb",
    "bytes": 58424,
    "questionCount": 21
  },
  {
    "sourceArchiveFile": "original/middle/m3/2mid/18_연향중_2학기_중간_중3_수학.js",
    "gitBlobSha1": "0a2b4a0ffb487e85a2b00a6f8203556adb0e375a",
    "sha256": "325b015724d732bdbe9b258116bbf220aed2fc0f316c1fca5e076d1ce1ae50b7",
    "bytes": 61507,
    "questionCount": 23
  },
  {
    "sourceArchiveFile": "original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js",
    "gitBlobSha1": "36c738026dc11bd0483ece6039154d43e624eafc",
    "sha256": "0e9f0f3e3c9e413f62ff38090b4022b45951887a57131651ce9573cfa735c098",
    "bytes": 134945,
    "questionCount": 23
  }
];
const DIAGNOSTIC_E017_Q11 = {
  questionUid: 'qid_v1_061f56b801d84fca7fb2dccabc0f36cd424db51a71705aaf9907bbe01c0206a4',
  sourceArchiveFile: 'original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js',
  sourceOrdinal: 11
};

const inputRefs = new Map();
let repoRoot = null;
let options = null;
const report = {
  schemaVersion: 'archive-middle-registered-snapshot-observation-v1',
  role: 'READ_ONLY_OPERATIONAL_OBSERVATION',
  status: 'RUNNING',
  observedAtUtc: new Date().toISOString(),
  validationExecution: 'THIS_REPORT_IS_CREATED_ONLY_BY_THE_EXPLICIT_SNAPSHOT_JOB',
  checks: [],
  inputRefs: [],
  evidenceBasis: CONFIG.evidence,
  boundaries: {
    physicalRegistrationIsSemanticApproval: false,
    storedFinalQaIsCurrentNativeValidation: false,
    literalDifficultyIsIssuedD5Request: false,
    currentNativeValidation: 'NOT_EVALUATED',
    issuedSemanticReceiptStock: 'NOT_RECOUNTED',
    wholeSemanticQuality: 'NOT_EVALUATED',
    sourceQuestionEvaluation: 0,
    sourceTextOutput: 0,
    answersOrSolutionsOutput: 0,
    newMathReviews: 0,
    newVisualReviews: 0,
    builderRuns: 0,
    registrarRuns: 0,
    registrationWrites: 0,
    approvalWrites: 0,
    trackedRepositoryWrites: 0,
    remoteRefWrites: 0,
    gitObjectCacheHydration: 'ALLOWED_READ_CACHE_ONLY_FROM_PUBLIC_ORIGIN',
    excludedSemesterClassification: 0
  }
};
function must(condition, code) {
  if (!condition) throw new Error(code);
}
function check(code, condition, details) {
  report.checks.push({ code, pass: Boolean(condition), ...(details === undefined ? {} : { details }) });
  return Boolean(condition);
}
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function gitBlob(value) {
  return createHash('sha1').update('blob ' + value.length + '\0').update(value).digest('hex');
}
function stable(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
}
function digest(value) { return value == null ? null : sha256(stable(value)); }
function parseJson(bytes) {
  try { return JSON.parse(bytes.toString('utf8')); } catch { throw new Error('INPUT_JSON_INVALID'); }
}
function safeRepoPath(p) {
  must(typeof p === 'string' && p.length > 0 && !path.posix.isAbsolute(p) &&
    !/[\\\x00-\x1f\x7f:]/.test(p) &&
    p.split('/').every(part => part && part !== '.' && part !== '..'), 'REPOSITORY_PATH_INVALID');
  return p;
}
function git(args, maxBuffer = 160 * 1024 * 1024) {
  try {
    const environment = { ...process.env, GIT_OPTIONAL_LOCKS: '0' };
    delete environment.GIT_NO_LAZY_FETCH;
    return execFileSync('git', args, {
      cwd: repoRoot || process.cwd(),
      encoding: null,
      maxBuffer,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: environment
    });
  } catch { throw new Error('GIT_READ_FAILED'); }
}
function gitText(args) { return git(args).toString('utf8').trim(); }
function entryAt(commit, p) {
  must(SHA_RE.test(commit), 'COMMIT_INVALID');
  safeRepoPath(p);
  const raw = git(['ls-tree', '-z', commit, '--', p], 1024 * 1024).toString('utf8');
  if (!raw) return null;
  const parts = raw.split('\0').filter(Boolean);
  must(parts.length === 1, 'GIT_PATH_AMBIGUOUS');
  const match = /^([0-9]{6}) blob ([a-f0-9]{40})\t([\s\S]+)$/.exec(parts[0]);
  must(match && match[1] === '100644' && match[3] === p, 'GIT_PATH_NOT_REGULAR_FILE');
  return { path: p, gitBlobSha1: match[2] };
}
function readBlob(commit, p, required = true) {
  const entry = entryAt(commit, p);
  if (!entry) {
    must(!required, 'GIT_REQUIRED_PATH_MISSING');
    return null;
  }
  const bytes = git(['show', commit + ':' + p]);
  must(gitBlob(bytes) === entry.gitBlobSha1, 'GIT_BLOB_CONTENT_MISMATCH');
  const ref = { commit, path: p, gitBlobSha1: entry.gitBlobSha1, sha256: sha256(bytes), bytes: bytes.length };
  const expected = commit === CONFIG.baselineCommit ? CONFIG.baselinePins[p] : null;
  if (expected) must(ref.gitBlobSha1 === expected.gitBlobSha1 &&
    ref.sha256 === expected.sha256 && ref.bytes === expected.bytes, 'BASELINE_IMMUTABLE_INPUT_MISMATCH');
  inputRefs.set(commit + ':' + p, ref);
  return { bytes, ref };
}
function readJson(commit, p, required = true) {
  const result = readBlob(commit, p, required);
  return result ? { data: parseJson(result.bytes), ref: result.ref } : null;
}
function recordsOf(data) {
  must(data && Array.isArray(data.records), 'RECORDS_ARRAY_REQUIRED');
  return data.records;
}
function scopeForSource(source) {
  if (typeof source !== 'string') return null;
  for (const [semester, prefix] of PREFIXES) {
    if (source.startsWith(prefix) && source.endsWith('.js') &&
        !source.slice(prefix.length).includes('/') && !/[\x00-\x1f\x7f\\]/.test(source)) return semester;
  }
  return null;
}
function sourceTuple(row) { return row.sourceArchiveFile + '#' + row.sourceOrdinal; }
function compactPath(source) {
  must(scopeForSource(source), 'COMPACT_SOURCE_OUTSIDE_SCOPE');
  return 'archive/data/item-4slot/' + source.slice(0, -3) + '.4slot.json';
}
function positiveDisplay(value) {
  if ((typeof value === 'number' || typeof value === 'string') &&
      /^[0-9]+$/.test(String(value)) && Number.isSafeInteger(Number(value)) && Number(value) > 0) return Number(value);
  return null;
}
function identityCohort(data) {
  const rows = recordsOf(data).filter(row => scopeForSource(row.sourceArchiveFile));
  const byUid = new Map(), byTuple = new Map(), byDisplay = new Map(), bySource = new Map(), displayByUid = new Map();
  const counts = Object.fromEntries(Object.keys(CONFIG.denominators).map(k => [k, 0]));
  for (const row of rows) {
    must(UID_RE.test(row.questionUid) && Number.isSafeInteger(row.sourceOrdinal) && row.sourceOrdinal > 0,
      'IDENTITY_TARGET_INVALID');
    const tuple = sourceTuple(row);
    must(!byUid.has(row.questionUid) && !byTuple.has(tuple), 'IDENTITY_TARGET_DUPLICATE');
    byUid.set(row.questionUid, row); byTuple.set(tuple, row);
    const display = positiveDisplay(row.sourceQuestionNo);
    if (display !== null) {
      const key = row.sourceArchiveFile + '#' + display;
      must(!byDisplay.has(key), 'IDENTITY_DISPLAY_NUMBER_AMBIGUOUS');
      byDisplay.set(key, row);
      displayByUid.set(row.questionUid, display);
    }
    if (!bySource.has(row.sourceArchiveFile)) bySource.set(row.sourceArchiveFile, []);
    bySource.get(row.sourceArchiveFile).push(row);
    counts[scopeForSource(row.sourceArchiveFile)]++;
  }
  const scopedUids = new Set(byUid.keys()), globalSelectedUses = new Map();
  for (const row of recordsOf(data)) if (scopedUids.has(row.questionUid))
    globalSelectedUses.set(row.questionUid, (globalSelectedUses.get(row.questionUid) || 0) + 1);
  must([...globalSelectedUses.values()].every(n => n === 1), 'IDENTITY_UID_USED_OUTSIDE_UNIQUE_TARGET');
  rows.sort((a, b) => a.questionUid.localeCompare(b.questionUid));
  return { rows, byUid, byTuple, byDisplay, bySource, displayByUid, counts };
}

function displayForIdentity(cohort, row) {
  return row ? cohort.displayByUid.get(row.questionUid) ?? null : null;
}
function attachClosedSourceNumbering(cohort, commit) {
  const observations = [];
  for (const pin of LEGACY_NUMBERING_PINS) {
    const source = pin.sourceArchiveFile;
    const identityRows = cohort.bySource.get(source);
    must(identityRows?.length === pin.questionCount, 'CLOSED_NUMBER_SOURCE_IDENTITY_COUNT_MISMATCH');
    const read = readBlob(commit, 'archive/exams/' + source);
    must(read.ref.gitBlobSha1 === pin.gitBlobSha1 && read.ref.sha256 === pin.sha256 &&
      read.ref.bytes === pin.bytes, 'CLOSED_NUMBER_SOURCE_BYTES_CHANGED');
    // Accept only one JSON object assignment and the two known inert aliases.
    // Comments are allowed before the assignment only. No VM/eval/import runs.
    const match = /^\s*(?:(?:\/\/[^\r\n]*(?:\r?\n|$)|\/\*[\s\S]*?\*\/)\s*)*window\.examData\s*=\s*(\{[\s\S]*\})\s*;?\s*(?:window\.questionBank\s*=\s*window\.examData\.questions\s*;\s*window\.examTitle\s*=\s*window\.examData\.(?:title|examTitle)\s*;?\s*)?$/.exec(read.bytes.toString('utf8'));
    must(match, 'CLOSED_NUMBER_SOURCE_NOT_DATA_ONLY_WRAPPER');
    let data;
    try { data = JSON.parse(match[1]); } catch { throw new Error('CLOSED_NUMBER_SOURCE_NOT_STRICT_JSON'); }
    must(data && !Array.isArray(data) && Array.isArray(data.questions) &&
      data.questions.length === pin.questionCount, 'CLOSED_NUMBER_SOURCE_ARRAY_COUNT_MISMATCH');
    const seen = new Set(), projected = [];
    for (let i = 0; i < data.questions.length; i++) {
      const question = data.questions[i], sourceOrdinal = i + 1;
      must(question && typeof question === 'object' && !Array.isArray(question),
        'CLOSED_NUMBER_SOURCE_ITEM_NOT_OBJECT');
      const fromId = positiveDisplay(question.id), fromNumber = positiveDisplay(question.number);
      must(fromId === null || fromNumber === null || fromId === fromNumber,
        'CLOSED_NUMBER_SOURCE_AMBIGUOUS');
      const display = fromId ?? fromNumber;
      must(display !== null && !seen.has(display), 'CLOSED_NUMBER_SOURCE_MISSING_OR_DUPLICATE');
      seen.add(display);
      const identity = cohort.byTuple.get(source + '#' + sourceOrdinal);
      must(identity && identityRows.includes(identity), 'CLOSED_NUMBER_SOURCE_ORDINAL_IDENTITY_MISMATCH');
      const priorDisplay = displayForIdentity(cohort, identity);
      must(priorDisplay === null || priorDisplay === display, 'CLOSED_NUMBER_IDENTITY_NUMERIC_CONTRADICTION');
      const key = source + '#' + display, priorRow = cohort.byDisplay.get(key);
      must(!priorRow || priorRow.questionUid === identity.questionUid, 'CLOSED_NUMBER_IDENTITY_COLLISION');
      cohort.byDisplay.set(key, identity);
      cohort.displayByUid.set(identity.questionUid, display);
      projected.push({ questionUid: identity.questionUid, sourceOrdinal, displayNumber: display,
        identityRawNumberSha256: digest(identity.sourceQuestionNo ?? null) });
    }
    observations.push({ sourceArchiveFile: source, sourceRef: read.ref, count: projected.length,
      schema: 'EXACT_WINDOW_EXAM_DATA_JSON_QUESTIONS',
      displayRule: 'OFFICIAL_POSITIVE_ID_ELSE_NUMBER_WITH_AMBIGUITY_AND_DUPLICATE_REJECTION',
      arrayOrdinalIsDisplayNumberAssumed: false,
      projectionSha256: digest(projected), rows: projected });
  }
  return { commit, status: 'PASS_CLOSED_METADATA_NUMBER_PROJECTION',
    sourceCount: observations.length, sourceEvaluation: 0, sourceBodyOutput: 0,
    newApprovalInferred: false, observations };
}

function metadataMap(data, uids) {
  const map = new Map();
  for (const row of recordsOf(data)) if (uids.has(row.questionUid)) {
    must(!map.has(row.questionUid), 'METADATA_TARGET_UID_DUPLICATE');
    map.set(row.questionUid, row);
  }
  return map;
}
function safeAtom(value) {
  if (value == null) return null;
  if (typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return value;
  if (typeof value === 'string' && (/^[A-Za-z0-9_.:-]{1,100}$/.test(value) ||
    ['상', '중', '하', '최상', '최하', '중상', '중하'].includes(value))) return value;
  return { redactedValueSha256: digest(value) };
}
function safeAxis(field, value) {
  if (value == null) return null;
  const enums = {
    metadataApprovalType: ['FINAL_QA', 'MAIN_MERGE', 'AUDIT', 'BASIC', 'D5'],
    reviewStatus: ['review_required', 'reviewed_pass', 'verified', 'VERIFIED', 'unreviewed', 'pending', 'hold', 'rejected', 'reviewed'],
    metadataStatus: ['registered_merged_source', 'registered', 'REGISTERED', 'pending', 'not_registered', 'unregistered'],
    tagStatus: ['verified', 'VERIFIED', 'reviewed', 'review_required', 'pending', 'unreviewed', 'confirmed', 'AUTO', 'auto', 'COMPLETE', 'complete', 'hold'],
    legacyLevelCompatibility: ['상', '중', '하', '최상', '최하', '중상', '중하', 'upper', 'middle', 'lower', 'HIGH', 'MEDIUM', 'LOW'],
    difficultyBucket: [1, 2, 3, 4, 5, '1', '2', '3', '4', '5', 'D1', 'D2', 'D3', 'D4', 'D5']
  };
  if (enums[field]?.includes(value)) return value;
  if (field === 'difficultyConfidence' && typeof value === 'number' && Number.isFinite(value)) return value;
  if (['difficultyBoundaryFlag', 'defaultSelectable'].includes(field) && typeof value === 'boolean') return value;
  return { redactedValueSha256: digest(value) };
}
function axes(row) {
  return Object.fromEntries(AXIS_FIELDS.map(key => [key, safeAxis(key, row?.[key])]));
}
function changedKeys(before, after) {
  if (!before || !after) return [before ? 'ROW_REMOVED' : 'ROW_ADDED'];
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(key =>
    Object.hasOwn(before, key) !== Object.hasOwn(after, key) || stable(before[key] ?? null) !== stable(after[key] ?? null)
  ).sort().map(key => /^[A-Za-z_][A-Za-z0-9_]{0,99}$/.test(key) ? key : 'HASHED_FIELD_' + sha256(key));
}
function vectorDigest(row) {
  if (!row) return null;
  return digest(Object.fromEntries(['dictionaryVersion', 'format', ...SLOTS, 'candidates'].map(k => [k, row[k] ?? null])));
}
function d5AuthorityDigest(row) {
  if (!row) return null;
  return digest(Object.fromEntries([...D5_FIELDS, 'metadataApprovalType', 'reviewStatus', 'metadataStatus'].map(k => [k, row[k] ?? null])));
}
function safeReason(value) {
  const raw = typeof value === 'string' ? value : 'UNSPECIFIED';
  return /^[A-Z][A-Z0-9_]*(?::[A-Z0-9_]+)*$/.test(raw) && raw.length <= 240 ?
    { reason: raw } :
    { reason: (/^([A-Z][A-Z0-9_]+)/.exec(raw) || [null, 'NON_ENUM_REASON'])[1], reasonSha256: sha256(raw) };
}
function nextAction(reason, uid) {
  if (uid === CONFIG.documentaryConflictUid) return 'CONFIRM_REVIEWED_SOURCE_VERSION_THEN_OBTAIN_ACCEPTED_METHOD; DO_NOT_REOPEN_RESOLVED_Q20_TRANSCRIPTION';
  if (CONFIG.protectedGroups.m1DocumentaryPending43.rows.some(r => r.questionUid === uid))
    return 'REUSE_EXISTING_REVIEW_DECISION_AND_OBTAIN_EXPLICIT_METHOD_ACCEPTANCE_BEFORE_PUBLIC_VECTOR_SUBMISSION';
  if (reason.includes('GIT_PATH_BINDING') || reason.includes('LIVE_BYTES_CHANGED'))
    return 'CHECK_EXACT_GENERATED_DATA_OR_RENDERER_CONTINUITY_REPAIR_AND_NEXT_ACTUAL_WRITER; DO_NOT_INFER_NEW_APPROVAL';
  if (CONFIG.protectedGroups.originalM2ReviewHolds36.rows.some(r => r.questionUid === uid))
    return 'RETAIN_EXISTING_D5_AUTHORITY_HOLD_AND_SATISFY_ITS_NAMED_EVIDENCE; PHYSICAL_FOUR_SLOT_REGISTRATION_IS_A_SEPARATE_AXIS';
  if (reason.includes('EXPLICIT_REVIEW_HOLD') || reason.includes('SOURCE_EVIDENCE') || reason.includes('ORIGINAL_SOURCE'))
    return 'RETAIN_EXPLICIT_HOLD_AND_SATISFY_ITS_EXISTING_NAMED_EVIDENCE_REQUIREMENT';
  if (reason === 'NOT_SUBMITTED') return 'LOCATE_AN_ACCEPTED_PUBLIC_VECTOR_AND_ITS_REGISTRATION_AUTHORITY; SOURCE_ABSENCE_IS_NOT_ESTABLISHED';
  if (reason.includes('STALE_STUDENT_PAYLOAD'))
    return 'COMPARE_EXACT_REVIEWED_VERSION_AND_CURRENT_PAYLOAD; REBIND_ONLY_WITH_VALID_EXISTING_AUTHORITY';
  return 'RESOLVE_THE_REPORTED_CONTRACT_REASON_USING_EXACT_CURRENT_EVIDENCE';
}
function safeError(error) {
  const message = String(error?.message || 'UNKNOWN_ERROR');
  return { code: /^([A-Z][A-Z0-9_]+)$/.test(message) ? message : 'NON_ENUM_OBSERVATION_ERROR',
    messageSha256: sha256(message) };
}
function parseOptions() {
  const result = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    must(['--snapshot', '--out', '--public-base'].includes(arg) && i + 1 < process.argv.length,
      'CLI_ARGUMENT_INVALID');
    must(!Object.hasOwn(result, arg), 'CLI_ARGUMENT_DUPLICATE');
    result[arg] = process.argv[++i];
  }
  must(SHA_RE.test(result['--snapshot'] || '') && typeof result['--out'] === 'string', 'CLI_REQUIRED_ARGUMENT_MISSING');
  must(path.isAbsolute(result['--out']), 'OUTPUT_MUST_BE_ABSOLUTE');
  if (result['--public-base'] !== undefined)
    must(result['--public-base'] === CONFIG.publicBase, 'PUBLIC_BASE_OUTSIDE_CLOSED_SCOPE');
  return { snapshot: result['--snapshot'], out: result['--out'], publicBase: result['--public-base'] || null };
}
function assertOutputPath(out) {
  const parent = path.dirname(out), actualParent = fs.realpathSync(parent);
  must(actualParent === parent && fs.statSync(parent).isDirectory(), 'OUTPUT_PARENT_MUST_BE_EXISTING_REAL_DIRECTORY');
  const relative = path.relative(repoRoot, out);
  must(relative === '..' || relative.startsWith('..' + path.sep), 'OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
  must(!fs.existsSync(out), 'OUTPUT_ALREADY_EXISTS');
}
function assertRegularCheckoutFile(p) {
  const parts = safeRepoPath(p).split('/');
  let current = repoRoot;
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const stat = fs.lstatSync(current);
    must(!stat.isSymbolicLink() && (i === parts.length - 1 ? stat.isFile() : stat.isDirectory()),
      'CHECKOUT_FILE_NOT_REGULAR');
  }
  return current;
}

function indexView(data, cohort) {
  must(data?.schemaVersion === 'archive-item-4slot-runtime-v1' &&
    Array.isArray(data.records) && Array.isArray(data.files) && Array.isArray(data.pending),
    'FOUR_SLOT_DOCUMENT_SCHEMA_INVALID');
  const byUid = new Map(), files = new Map();
  const targetUids = new Set(cohort.byUid.keys());
  for (const row of data.records) if (targetUids.has(row.questionUid)) {
    must(!byUid.has(row.questionUid), 'FOUR_SLOT_TARGET_UID_DUPLICATE');
    const identity = cohort.byUid.get(row.questionUid);
    must(row.sourceArchiveFile === identity.sourceArchiveFile &&
      row.sourceOrdinal === identity.sourceOrdinal && row.registrationStatus === 'REGISTERED',
      'FOUR_SLOT_TARGET_IDENTITY_MISMATCH');
    byUid.set(row.questionUid, row);
  }
  for (const file of data.files) {
    if (typeof file.path !== 'string') continue;
    const fromPath = file.path.startsWith('archive/data/item-4slot/') && file.path.endsWith('.4slot.json') ?
      file.path.slice('archive/data/item-4slot/'.length, -'.4slot.json'.length) + '.js' : null;
    if (!cohort.bySource.has(file.sourceArchiveFile) && !cohort.bySource.has(fromPath)) continue;
    must(fromPath && cohort.bySource.has(fromPath), 'FOUR_SLOT_FILE_SOURCE_PATH_MISMATCH');
    if (Object.hasOwn(file, 'sourceArchiveFile'))
      must(file.sourceArchiveFile === fromPath, 'FOUR_SLOT_FILE_SOURCE_PATH_MISMATCH');
    const source = fromPath;
    must(file.path === compactPath(source) && !files.has(file.path), 'FOUR_SLOT_FILE_METADATA_AMBIGUOUS');
    files.set(file.path, { sourceArchiveFile: source, status: file.status, itemCount: file.itemCount });
  }
  const pending = data.pending.filter(row => {
    if (targetUids.has(row.questionUid)) return true;
    if (cohort.bySource.has(row.sourceArchiveFile)) return true;
    if (typeof row.path !== 'string') return false;
    if (files.has(row.path)) return true;
    if (!row.path.startsWith('archive/data/item-4slot/') || !row.path.endsWith('.4slot.json')) return false;
    const source = row.path.slice('archive/data/item-4slot/'.length, -'.4slot.json'.length) + '.js';
    return cohort.bySource.has(source);
  });
  return {
    schemaVersion: data.schemaVersion, byUid, files, pending,
    builderSha256: data.builderSha256,
    inputDigest: data.inputDigest, counts: data.counts,
    globalRecordCount: data.records.length, globalPendingEntryCount: data.pending.length,
    globalFileCount: data.files.length
  };
}
function pendingAssignments(index, cohort, snapshot) {
  const byUid = new Map(), unresolved = [], compactCache = new Map();
  function add(uid, reason, basis) {
    if (!byUid.has(uid)) byUid.set(uid, []);
    const value = { ...safeReason(reason), basis };
    if (!byUid.get(uid).some(x => stable(x) === stable(value))) byUid.get(uid).push(value);
  }
  function sourceOf(pending) {
    const candidates = [];
    if (Object.hasOwn(pending, 'sourceArchiveFile')) {
      must(typeof pending.sourceArchiveFile === 'string' && cohort.bySource.has(pending.sourceArchiveFile),
        'PENDING_EXPLICIT_SOURCE_OUTSIDE_COHORT');
      candidates.push(pending.sourceArchiveFile);
    }
    if (Object.hasOwn(pending, 'path')) {
      must(typeof pending.path === 'string' && pending.path.startsWith('archive/data/item-4slot/') &&
        pending.path.endsWith('.4slot.json'), 'PENDING_EXPLICIT_PATH_INVALID');
      const fromPath = pending.path.slice('archive/data/item-4slot/'.length, -'.4slot.json'.length) + '.js';
      must(cohort.bySource.has(fromPath) && pending.path === compactPath(fromPath),
        'PENDING_EXPLICIT_PATH_OUTSIDE_COHORT');
      candidates.push(fromPath);
      const fromFile = index.files.get(pending.path)?.sourceArchiveFile;
      if (fromFile !== undefined) candidates.push(fromFile);
    }
    const unique = [...new Set(candidates)];
    must(unique.length <= 1, 'PENDING_SOURCE_DISAGREEMENT');
    return unique[0] || null;
  }
  for (const pending of index.pending) {
    const source = sourceOf(pending);
    let row = null;
    if (pending.questionUid != null) {
      must(UID_RE.test(pending.questionUid), 'PENDING_UID_INVALID');
      row = cohort.byUid.get(pending.questionUid) || null;
      must(row && (!source || row.sourceArchiveFile === source), 'PENDING_UID_SOURCE_MISMATCH');
    }
    if (pending.sourceOrdinal != null) {
      must(source && Number.isSafeInteger(pending.sourceOrdinal) && pending.sourceOrdinal > 0,
        'PENDING_SOURCE_ORDINAL_INVALID');
      const byOrdinal = cohort.byTuple.get(source + '#' + pending.sourceOrdinal);
      must(byOrdinal && (!row || byOrdinal.questionUid === row.questionUid), 'PENDING_ORDINAL_UID_MISMATCH');
      row = byOrdinal;
    }
    if (pending.ordinal != null) {
      const display = positiveDisplay(pending.ordinal);
      must(display !== null && source, 'PENDING_DISPLAY_NUMBER_INVALID');
      const byNumber = cohort.byDisplay.get(source + '#' + display);
      const knownDisplay = displayForIdentity(cohort, row);
      if (row && knownDisplay !== null)
        must(knownDisplay === display, 'PENDING_DISPLAY_UID_MISMATCH');
      if (!byNumber) {
        unresolved.push({ ...(row ? { questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal } : {}),
          sourceArchiveFile: source, compactPath: compactPath(source),
          displayNumber: display, ...safeReason(pending.reason), basis: 'NO_AUTHENTICATED_IDENTITY_NUMBER_JOIN' });
        continue;
      }
      must(!row || byNumber.questionUid === row.questionUid, 'PENDING_DISPLAY_UID_MISMATCH');
      row = byNumber;
    }
    if (row) {
      must(!index.byUid.has(row.questionUid), 'REGISTERED_AND_ITEM_PENDING_COLLISION');
      add(row.questionUid, pending.reason, pending.questionUid ? 'INDEX_EXPLICIT_UID' :
        pending.sourceOrdinal != null ? 'INDEX_SOURCE_ORDINAL' : 'INDEX_DISPLAY_NUMBER_TO_AUTHENTICATED_NUMBER_MAP');
    } else {
      must(source && pending.ordinal == null, 'PENDING_TARGET_UNRESOLVED');
      for (const id of cohort.bySource.get(source))
        if (!index.byUid.has(id.questionUid)) add(id.questionUid, pending.reason, 'INDEX_FILE_LEVEL_FAILURE');
    }
  }
  for (const id of cohort.rows) {
    if (index.byUid.has(id.questionUid) || byUid.has(id.questionUid)) continue;
    const p = compactPath(id.sourceArchiveFile);
    if (!compactCache.has(p)) compactCache.set(p, readJson(snapshot, p, false)?.data || null);
    const compact = compactCache.get(p);
    if (!compact) {
      add(id.questionUid, 'NOT_SUBMITTED', 'NO_COMPACT_FILE_AT_EXACT_SNAPSHOT');
      continue;
    }
    must(compact.sourceArchiveFile === id.sourceArchiveFile && Array.isArray(compact.items),
      'COMPACT_METADATA_SCOPE_INVALID');
    const display = displayForIdentity(cohort, id);
    if (display !== null && !compact.items.some(item => positiveDisplay(item.ordinal) === display)) {
      add(id.questionUid, 'NOT_SUBMITTED', 'EXACT_COMPACT_OMITS_AUTHENTICATED_DISPLAY_NUMBER');
    } else {
      add(id.questionUid, 'UNRESOLVED_INDEX_ABSENCE', 'NO_ITEM_OR_FILE_REASON_PROVES_THIS_IDENTITY');
      unresolved.push({ questionUid: id.questionUid, sourceArchiveFile: id.sourceArchiveFile,
        sourceOrdinal: id.sourceOrdinal, reason: 'UNRESOLVED_INDEX_ABSENCE' });
    }
  }
  check('PENDING_IDENTITY_JOINS_COMPLETE', unresolved.length === 0, { unresolved });
  return byUid;
}
function fieldCount(rows, field, value) {
  return rows.filter(row => row?.[field] === value).length;
}
function metadataSummary(cohort, md) {
  const result = {};
  for (const semester of Object.keys(CONFIG.denominators)) {
    const ids = cohort.rows.filter(row => scopeForSource(row.sourceArchiveFile) === semester);
    const rows = ids.map(row => md.get(row.questionUid));
    const valueCounts = field => {
      const counts = Object.create(null);
      for (const row of rows) {
        const value = safeAxis(field, row?.[field]);
        const key = value == null ? 'NULL_OR_MISSING' : typeof value === 'object' ?
          'REDACTED_' + value.redactedValueSha256 : String(value);
        counts[key] = (counts[key] || 0) + 1;
      }
      return counts;
    };
    result[semester] = {
      target: ids.length,
      metadataRowsPresent: rows.filter(Boolean).length,
      metadataRowsMissing: rows.filter(row => !row).length,
      storedFinalQa: fieldCount(rows, 'metadataApprovalType', 'FINAL_QA'),
      storedMainMerge: fieldCount(rows, 'metadataApprovalType', 'MAIN_MERGE'),
      storedReviewStatusCounts: valueCounts('reviewStatus'),
      storedMetadataStatusCounts: valueCounts('metadataStatus'),
      storedDifficultyBucketCounts: valueCounts('difficultyBucket'),
      storedDifficultyFieldPresence: Object.fromEntries(D5_FIELDS.map(field =>
        [field, rows.filter(row => row && Object.hasOwn(row, field) && row[field] != null).length])),
      issuedD5RequestCount: 'NOT_EVALUATED',
      currentNativeOrSemanticApprovalCount: 'NOT_EVALUATED'
    };
  }
  return result;
}
function physicalSummary(cohort, index, pending) {
  const result = {};
  for (const semester of Object.keys(CONFIG.denominators)) {
    const ids = cohort.rows.filter(row => scopeForSource(row.sourceArchiveFile) === semester);
    const registered = ids.filter(row => index.byUid.has(row.questionUid));
    const unregistered = ids.filter(row => !index.byUid.has(row.questionUid));
    const reasons = {};
    for (const row of unregistered) for (const reason of pending.get(row.questionUid) || [])
      reasons[reason.reason] = (reasons[reason.reason] || 0) + 1;
    result[semester] = {
      total: ids.length, registered: registered.length, remaining: unregistered.length,
      notSubmitted: unregistered.filter(row => (pending.get(row.questionUid) || [])
        .some(value => value.reason === 'NOT_SUBMITTED')).length,
      pendingReasonMemberships: reasons,
      reasonCountsMayOverlap: true
    };
  }
  return result;
}
function runtimeSelection(commit, targets) {
  const selected = new Map();
  for (const p of RUNTIME_PATHS) {
    const read = readJson(commit, p, false);
    if (!read) continue;
    for (const row of recordsOf(read.data)) if (targets.has(row.questionUid)) {
      must(!selected.has(row.questionUid), 'SELECTED_RUNTIME_OWNER_DUPLICATE');
      selected.set(row.questionUid, { path: p, packId: safeAtom(read.data.packId), row, sha256: digest(row) });
    }
  }
  return selected;
}
function proveRemainingThree(baseMd, currentMd, baseline, current, baseRuntime, actualRuntime) {
  const rows = CONFIG.protectedGroups.m3RemainingThree.rows.map(subject => {
    const uid = subject.questionUid, before = baseRuntime.get(uid), after = actualRuntime.get(uid);
    const row = {
      questionUid: uid, sourceArchiveFile: subject.sourceArchiveFile, sourceOrdinal: subject.sourceOrdinal,
      metadata: { baselineSha256: digest(baseMd.get(uid)), currentSha256: digest(currentMd.get(uid)) },
      identity: { baselineSha256: digest(baseline.byUid.get(uid)), currentSha256: digest(current.byUid.get(uid)) },
      runtime: { baselineSha256: before?.sha256 || null, currentSha256: after?.sha256 || null,
        baselinePath: before?.path || null, currentPath: after?.path || null,
        baselinePackId: before?.packId || null, currentPackId: after?.packId || null }
    };
    row.metadata.equal = Boolean(baseMd.get(uid) && currentMd.get(uid) &&
      row.metadata.baselineSha256 === row.metadata.currentSha256);
    row.identity.equal = Boolean(baseline.byUid.get(uid) && current.byUid.get(uid) &&
      row.identity.baselineSha256 === row.identity.currentSha256);
    row.runtime.equal = Boolean(before && after && before.path === after.path &&
      before.packId === after.packId && before.sha256 === after.sha256);
    check('M3_SELECTED_THREE_WHOLE_ROW_EQUALITY', row.metadata.equal && row.identity.equal && row.runtime.equal,
      { questionUid: uid });
    return row;
  });
  return { baselineCommit: CONFIG.baselineCommit, currentCommit: options.snapshot,
    status: rows.every(row => row.metadata.equal && row.identity.equal && row.runtime.equal) ? 'PASS' : 'FAIL',
    meaning: 'Stored MD, identity and runtime row equality only; no current Native/UI/whole-item approval is inferred.',
    rows };
}

function diagnosticToken(value, maximum = 300) {
  if (value == null) return null;
  if (typeof value === 'string' && value.length <= maximum &&
    /^[A-Za-z0-9_@.:\-]+$/.test(value)) return value;
  return { redactedValueSha256: digest(value) };
}
function diagnosticFingerprints(row) {
  return Object.fromEntries(['sourceFingerprint', 'contentFingerprint', 'approvedSourceFingerprint',
    'identityFingerprint'].map(field => {
    const value = row?.[field];
    return [field, value == null ? null : typeof value === 'string' && /^(?:sha256:)?[a-f0-9]{64}$/.test(value) ?
      value : { redactedValueSha256: digest(value) }];
  }));
}
function diagnosticNativeReceiptLocators(row) {
  const values = row?.approvalEvidence;
  if (values == null) return { present: false, locators: [], otherEntrySha256s: [] };
  if (!Array.isArray(values)) return { present: true, array: false, valueSha256: digest(values) };
  const locators = [], otherEntrySha256s = [];
  for (const value of values) {
    if (typeof value === 'string' &&
      /^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_.-]+\.json$/.test(value))
      locators.push(value);
    else otherEntrySha256s.push(digest(value));
  }
  return { present: true, array: true, entryCount: values.length, locators, otherEntrySha256s };
}
function diagnosticStoredMetadata(row) {
  if (!row) return { present: false, wholeRowSha256: null };
  return { present: true, wholeRowSha256: digest(row),
    metadataRevision: diagnosticToken(row.metadataRevision),
    metadataApprovalType: safeAxis('metadataApprovalType', row.metadataApprovalType),
    reviewStatus: safeAxis('reviewStatus', row.reviewStatus),
    metadataStatus: safeAxis('metadataStatus', row.metadataStatus),
    tagStatus: safeAxis('tagStatus', row.tagStatus),
    defaultSelectable: safeAxis('defaultSelectable', row.defaultSelectable),
    metaFoundationPackVersion: diagnosticToken(row.metaFoundationPackVersion),
    ownerFields: Object.fromEntries(['ownerPack', 'metaFoundationPackId', 'metaFoundationPack',
      'metaFoundationOwnerPack'].map(field => [field, diagnosticToken(row[field])])),
    fingerprints: diagnosticFingerprints(row),
    approvalEvidence: diagnosticNativeReceiptLocators(row) };
}
function diagnosticStoredIdentity(row) {
  if (!row) return { present: false, wholeRowSha256: null };
  return { present: true, wholeRowSha256: digest(row), questionUid: row.questionUid,
    sourceArchiveFile: row.sourceArchiveFile, sourceOrdinal: row.sourceOrdinal,
    sourceQuestionNo: typeof row.sourceQuestionNo === 'number' && Number.isSafeInteger(row.sourceQuestionNo) ?
      row.sourceQuestionNo : diagnosticToken(row.sourceQuestionNo, 100),
    status: diagnosticToken(row.status), fingerprintVersion: diagnosticToken(row.fingerprintVersion),
    fingerprints: diagnosticFingerprints(row) };
}
function diagnosticStoredRuntime(entry) {
  if (!entry) return { present: false, wholeRowSha256: null };
  const row = entry.row;
  return { present: true, path: entry.path, packId: entry.packId, wholeRowSha256: entry.sha256,
    metadataRevision: diagnosticToken(row.metadataRevision),
    metadataApprovalType: safeAxis('metadataApprovalType', row.metadataApprovalType),
    reviewStatus: safeAxis('reviewStatus', row.reviewStatus),
    metadataStatus: safeAxis('metadataStatus', row.metadataStatus),
    fingerprints: diagnosticFingerprints(row),
    approvalEvidence: diagnosticNativeReceiptLocators(row) };
}
function observeExactNativeFailureUid(baseline, current, baseMd, currentMd, baseIndex, actualIndex,
  beforeRuntime, afterRuntime, pending) {
  const subject = DIAGNOSTIC_E017_Q11, uid = subject.questionUid;
  const beforeIdentity = baseline.byUid.get(uid), afterIdentity = current.byUid.get(uid);
  for (const identity of [beforeIdentity, afterIdentity])
    must(identity && identity.sourceArchiveFile === subject.sourceArchiveFile &&
      identity.sourceOrdinal === subject.sourceOrdinal, 'EXACT_DIAGNOSTIC_UID_IDENTITY_MISMATCH');
  const beforeMd = baseMd.get(uid), afterMd = currentMd.get(uid);
  return { schemaVersion: 'archive-observer-exact-native-failure-metadata-v1',
    purpose: 'EXACT_E017_Q11_RECEIPT_LOCATOR_AND_STORED_IDENTITY_DIAGNOSTIC_ONLY',
    questionUid: uid, sourceArchiveFile: subject.sourceArchiveFile, sourceOrdinal: subject.sourceOrdinal,
    baselineCommit: CONFIG.baselineCommit, currentCommit: options.snapshot,
    separateF9Read: 'NOT_PERFORMED',
    baseline: { metadata: diagnosticStoredMetadata(beforeMd),
      identity: diagnosticStoredIdentity(beforeIdentity),
      runtime: diagnosticStoredRuntime(beforeRuntime.get(uid)),
      registered: baseIndex.byUid.has(uid), fourSlotWholeRowSha256: digest(baseIndex.byUid.get(uid)) },
    current: { metadata: diagnosticStoredMetadata(afterMd),
      identity: diagnosticStoredIdentity(afterIdentity),
      runtime: diagnosticStoredRuntime(afterRuntime.get(uid)),
      registered: actualIndex.byUid.has(uid), fourSlotWholeRowSha256: digest(actualIndex.byUid.get(uid)),
      pending: pending.get(uid) || [] },
    wholeRowEquality: {
      metadata: Boolean(beforeMd && afterMd && digest(beforeMd) === digest(afterMd)),
      identity: digest(beforeIdentity) === digest(afterIdentity),
      runtime: Boolean(beforeRuntime.has(uid) && afterRuntime.has(uid) &&
        beforeRuntime.get(uid).path === afterRuntime.get(uid).path &&
        beforeRuntime.get(uid).sha256 === afterRuntime.get(uid).sha256),
      fourSlot: digest(baseIndex.byUid.get(uid)) === digest(actualIndex.byUid.get(uid))
    },
    existingLoadedRowsOnly: true, newSourceReadForDiagnostic: 0,
    currentNativeValidation: 'NOT_RUN', newClassification: 0, newApprovalInferred: false };
}

function protectedObservations(baseline, current, baseMd, currentMd, baseIndex, actualIndex, pending) {
  const groups = {};
  for (const [name, group] of Object.entries(CONFIG.protectedGroups)) {
    const rows = group.rows.map(subject => {
      const uid = subject.questionUid, identity = current.byUid.get(uid);
      must(identity, 'PROTECTED_UID_NOT_IN_FIXED_COHORT');
      if (subject.sourceArchiveFile) must(identity.sourceArchiveFile === subject.sourceArchiveFile &&
        identity.sourceOrdinal === subject.sourceOrdinal, 'PROTECTED_IDENTITY_TUPLE_DRIFT');
      const oldRow = baseIndex.byUid.get(uid), row = actualIndex.byUid.get(uid);
      const oldMetadata = baseMd.get(uid), metadata = currentMd.get(uid);
      const beforeMdHash = digest(oldMetadata), afterMdHash = digest(metadata);
      const beforeVector = vectorDigest(oldRow), afterVector = vectorDigest(row);
      const mdEqual = beforeMdHash === afterMdHash;
      const observation = {
        questionUid: uid, sourceArchiveFile: identity.sourceArchiveFile, sourceOrdinal: identity.sourceOrdinal,
        baselineRegistered: Boolean(oldRow), currentRegistered: Boolean(row),
        baselineRecordSha256: digest(oldRow), currentRecordSha256: digest(row),
        baselineVectorSha256: beforeVector, currentVectorSha256: afterVector,
        existingVectorEqual: oldRow && row ? beforeVector === afterVector : null,
        baselineMetadataSha256: beforeMdHash, currentMetadataSha256: afterMdHash,
        metadataWholeEqual: mdEqual,
        metadataChangedFields: mdEqual ? [] : changedKeys(oldMetadata, metadata),
        baselineIdentitySha256: digest(baseline.byUid.get(uid)), currentIdentitySha256: digest(identity),
        pending: pending.get(uid) || [], storedAxes: axes(metadata),
        ...(subject.documentaryReason ? { documentaryReason: subject.documentaryReason } : {})
      };
      if (group.policy === 'MUST_REMAIN_UNREGISTERED_AND_METADATA_UNCHANGED')
        check('PROTECTED_EXPLICIT_HOLD_RETAINED', !row && mdEqual, { group: name, questionUid: uid });
      if (group.policy === 'PRESERVE_BASELINE_REGISTERED_VECTOR' && oldRow)
        check('PROTECTED_REGISTERED_VECTOR_PRESERVED', Boolean(row) && beforeVector === afterVector,
          { group: name, questionUid: uid });
      if (group.policy === 'OBSERVE_REGISTRATION_AND_PRESERVE_EXISTING_VECTOR' && oldRow && row)
        check('PROTECTED_EXISTING_VECTOR_UNCHANGED', beforeVector === afterVector, { group: name, questionUid: uid });
      if (group.policy === 'PRESERVE_BASELINE_D5_AUTHORITY_AND_VECTOR') {
        const d5Equal = Boolean(oldMetadata && metadata) && d5AuthorityDigest(oldMetadata) === d5AuthorityDigest(metadata);
        observation.d5AuthorityFieldsEqual = d5Equal;
        observation.baselinePhysicalVectorPreserved = !oldRow || (Boolean(row) && beforeVector === afterVector);
        observation.physicalRegistrationIsD5Approval = false;
        observation.wholeMetadataAuthorityPreserved = mdEqual;
        check('PROTECTED_D5_HOLD_AUTHORITY_UNCHANGED', d5Equal && mdEqual && observation.baselinePhysicalVectorPreserved,
          { group: name, questionUid: uid });
      }
      if (group.policy === 'PRESERVE_MAIN_MERGE_REVIEW_REQUIRED') {
        const retained = metadata?.metadataApprovalType === 'MAIN_MERGE' && metadata?.reviewStatus === 'review_required';
        observation.operationalMainMergeRegistered = metadata?.metadataApprovalType === 'MAIN_MERGE' &&
          metadata?.metadataStatus === 'registered_merged_source';
        observation.continuingSemanticHold = 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING';
        observation.nextAction = 'OBTAIN_FORMAL_FINAL_QA_AUTHORITY_BEFORE_STRICT_DISPLAY_PUBLICATION; DO_NOT_REPEAT_PARENT_REGISTRATION';
        check('PARENT_SIX_OPERATIONAL_AND_SEMANTIC_AXES_PRESERVED', retained &&
          observation.operationalMainMergeRegistered, { questionUid: uid });
      }
      if (group.policy === 'OBSERVE_PHYSICAL_SEPARATELY_FROM_UNRESOLVED_ACCEPTANCE') {
        observation.documentaryAcceptanceStatus = uid === CONFIG.documentaryConflictUid ?
          'SOURCE_VERSION_CONFLICT_AND_METHOD_ACCEPTANCE_MISSING' : 'METHOD_ACCEPTANCE_MISSING';
        observation.documentaryEvidenceIsNewApproval = false;
        observation.currentAcceptedMethodReevaluation = 'NOT_PERFORMED';
        if (uid === CONFIG.resolvedTranscriptionUid)
          observation.existingScopedTranscriptionCorrection = 'PRESERVED_AS_RESOLVED; METHOD_ACCEPTANCE_REMAINS_SEPARATE';
      }
      return observation;
    });
    groups[name] = { policy: group.policy, ...(group.authorityAxis ? { authorityAxis: group.authorityAxis } : {}), selected: rows.length, rows };
  }
  groups.omittedNamedSubgroups = [{
    name: 'E032_SELECTED_FOUR',
    reason: 'EXACT_FOUR_UID_LIST_NOT_RECOVERED; THEIR_UIDS_REMAIN_INCLUDED_IN_FULL_FIXED_COHORT_DELTAS',
    inferredMembership: false
  }];
  return groups;
}

function verifyIssuedIndexReceipt(index, indexRef) {
  const verification = readJson(options.snapshot, VERIFY_PATH);
  const value = verification.data;
  must(value?.schemaVersion === 'archive-4slot-registration-verification-v1' &&
    ['PASS', 'PASS_WITH_SUPPLEMENTS'].includes(value.status) &&
    /^[a-f0-9]{64}$/.test(value.indexSha256 || ''), 'OFFICIAL_VERIFICATION_SCHEMA_INVALID');
  const receiptPath = '.archive-meta-register/auto/4slot/receipts/' + value.indexSha256 + '.json';
  const receipt = readJson(options.snapshot, receiptPath);
  const issued = receipt.data;
  const fields = [
    'schemaVersion', 'status', 'indexSha256', 'inputDigest', 'counts', 'consumerVerified',
    'replayChanged', 'sourceMutation', 'authored4SlotMutation', 'semanticApprovalMutation',
    'independentReviewClaim'
  ];
  const proofMatches = fields.every(field => stable(value[field] ?? null) === stable(issued[field] ?? null));
  const bound = value.indexSha256 === indexRef.sha256 && value.inputDigest === index.inputDigest &&
    stable(value.counts) === stable(index.counts) &&
    value.consumerVerified === index.globalRecordCount && value.replayChanged === false &&
    value.sourceMutation === 0 && value.authored4SlotMutation === 0 &&
    value.semanticApprovalMutation === 0 && value.independentReviewClaim === false;
  must(SHA_RE.test(issued.sourceCommit || ''), 'OFFICIAL_RECEIPT_SOURCE_COMMIT_INVALID');
  git(['merge-base', '--is-ancestor', issued.sourceCommit, options.snapshot], 1024 * 1024);
  check('OFFICIAL_INDEX_VERIFICATION_AND_RECEIPT_BOUND', proofMatches && bound);
  return {
    verificationRef: verification.ref, receiptRef: receipt.ref,
    status: proofMatches && bound ? 'PASS' : 'FAIL',
    reportedStatus: value.status, sourceCommit: issued.sourceCommit,
    sourceCommitIsAncestorOfSnapshot: true,
    indexSha256: value.indexSha256, inputDigest: value.inputDigest,
    consumerVerified: value.consumerVerified, counts: value.counts,
    replayChanged: value.replayChanged, sourceMutation: value.sourceMutation,
    authored4SlotMutation: value.authored4SlotMutation,
    semanticApprovalMutation: value.semanticApprovalMutation,
    independentReviewClaim: value.independentReviewClaim,
    currentScopedConsumerExecutionIsSeparate: true
  };
}
function verifyScopedConsumer(index, cohort) {
  const ref = readBlob(options.snapshot, CONFIG.consumer.path);
  must(ref.ref.gitBlobSha1 === CONFIG.consumer.gitBlobSha1 &&
    ref.ref.sha256 === CONFIG.consumer.sha256 && ref.ref.bytes === CONFIG.consumer.bytes,
    'CURRENT_CONSUMER_REQUIRES_NEW_CODE_REVIEW');
  const local = assertRegularCheckoutFile(CONFIG.consumer.path);
  const currentBytes = fs.readFileSync(local);
  must(gitBlob(currentBytes) === ref.ref.gitBlobSha1 && sha256(currentBytes) === ref.ref.sha256,
    'CHECKOUT_CONSUMER_DOES_NOT_MATCH_ACTUAL_SNAPSHOT');
  const require = createRequire(import.meta.url);
  const official = require(local);
  must(typeof official.createIndex === 'function', 'OFFICIAL_CONSUMER_API_MISSING');
  const rows = [...index.byUid.values()];
  const api = official.createIndex({ schemaVersion: index.schemaVersion, records: rows });
  must(api.size === rows.length, 'SCOPED_CONSUMER_COUNT_MISMATCH');
  let wholeGets = 0, termQueries = 0, absentGets = 0;
  for (const row of rows) {
    must(stable(api.get(row.questionUid)) === stable(row), 'SCOPED_CONSUMER_WHOLE_RECORD_MISMATCH');
    wholeGets++;
    for (const slot of SLOTS) for (const term of row[slot]) {
      must(api.hasTerm(row.questionUid, slot, term, row.dictionaryVersion), 'SCOPED_CONSUMER_TERM_MISSING');
      termQueries++;
    }
  }
  for (const identity of cohort.rows) if (!index.byUid.has(identity.questionUid)) {
    must(api.get(identity.questionUid) === null, 'SCOPED_CONSUMER_PENDING_NOT_EXCLUDED');
    absentGets++;
  }
  check('OFFICIAL_SNAPSHOT_CONSUMER_SCOPED_GET_AND_POSTINGS', true);
  return {
    status: 'PASS_STORED_FOUR_SLOT_CONSUMER_ONLY',
    codeRef: ref.ref, checkoutBytesExact: true,
    selectedIdentityCount: cohort.rows.length, registered: rows.length,
    wholeRecordGets: wholeGets, exactTermPostingQueries: termQueries, pendingGetExclusions: absentGets,
    rawSourceEvaluation: 0, sourceFreshnessRevalidation: 'NOT_PERFORMED',
    currentNativeValidation: 'NOT_PERFORMED', newApproval: false
  };
}
function membershipTuples(cohort) {
  return cohort.rows.map(row => [row.questionUid, row.sourceArchiveFile, row.sourceOrdinal]);
}
function summarizePending(cohort, index, pending, md, examIds) {
  return cohort.rows.filter(row => !index.byUid.has(row.questionUid)).map(row => {
    const reasons = pending.get(row.questionUid) || [{ reason: 'UNRESOLVED_INDEX_ABSENCE', basis: 'NO_REASON_BOUND' }];
    return {
      questionUid: row.questionUid, semester: scopeForSource(row.sourceArchiveFile),
      examId: examIds.get(row.sourceArchiveFile), sourceOrdinal: row.sourceOrdinal,
      sourceDisplayNumber: displayForIdentity(cohort, row),
      compactPath: compactPath(row.sourceArchiveFile),
      physicalStatus: reasons.some(value => value.reason === 'NOT_SUBMITTED') ? 'NOT_SUBMITTED' : 'PENDING',
      reasons,
      nextActions: [...new Set(reasons.map(value => nextAction(value.reason, row.questionUid)))],
      storedAxes: axes(md.get(row.questionUid)),
      existingDocumentaryAxes: Object.entries(CONFIG.protectedGroups).filter(([, group]) =>
        group.rows.some(subject => subject.questionUid === row.questionUid)).map(([name, group]) => ({
          group: name, policy: group.policy,
          ...(group.rows.find(subject => subject.questionUid === row.questionUid)?.documentaryReason ?
            { reason: group.rows.find(subject => subject.questionUid === row.questionUid).documentaryReason } : {})
        })),
      sourceAbsenceEstablished: false
    };
  });
}
function selectedDeltas(baseline, current, baseMd, currentMd, baseIndex, actualIndex) {
  const changes = [];
  for (const oldIdentity of baseline.rows) {
    const uid = oldIdentity.questionUid, identity = current.byUid.get(uid);
    const oldMetadata = baseMd.get(uid), metadata = currentMd.get(uid);
    const oldFour = baseIndex.byUid.get(uid), four = actualIndex.byUid.get(uid);
    const pairs = {
      identity: [oldIdentity, identity], metadata: [oldMetadata, metadata], fourSlotRecord: [oldFour, four]
    };
    const delta = {};
    for (const [kind, [before, after]] of Object.entries(pairs)) {
      const oldHash = digest(before), hash = digest(after);
      if (oldHash !== hash) delta[kind] = {
        baselineSha256: oldHash, currentSha256: hash, changedFields: changedKeys(before, after)
      };
    }
    if (Object.keys(delta).length) changes.push({
      questionUid: uid, sourceArchiveFile: oldIdentity.sourceArchiveFile, sourceOrdinal: oldIdentity.sourceOrdinal,
      changes: delta,
      baselineRegistered: Boolean(oldFour), currentRegistered: Boolean(four),
      storedAxes: axes(metadata), newApprovalInferred: false
    });
  }
  return { baselineCommit: CONFIG.baselineCommit, currentCommit: options.snapshot,
    observedChangedUids: changes.length, rows: changes };
}
async function fetchDigest(url, maxBytes, collectBody = false, timeoutMs = 45000) {
  let response;
  try {
    response = await fetch(url, { cache: 'no-store', redirect: 'error',
      signal: AbortSignal.timeout(Math.max(1, Math.min(45000, timeoutMs))), headers: { Accept: 'application/octet-stream' } });
  } catch {
    return { url, ok: false, status: 'FETCH_UNAVAILABLE' };
  }
  if (!response.ok) return { url, ok: false, status: 'HTTP_' + response.status };
  if (!response.body) return { url, ok: false, status: 'BODY_MISSING' };
  const hash = createHash('sha256'), parts = [];
  let bytes = 0;
  try {
    const reader = response.body.getReader();
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      const part = Buffer.from(next.value);
      bytes += part.length;
      if (bytes > maxBytes) {
        await reader.cancel();
        return { url, ok: false, status: 'BODY_EXCEEDS_CLOSED_SIZE_LIMIT', bytes };
      }
      hash.update(part);
      if (collectBody) parts.push(part);
    }
  } catch { return { url, ok: false, status: 'BODY_READ_UNAVAILABLE', bytes }; }
  return { url, ok: true, httpStatus: response.status, bytes, sha256: hash.digest('hex'),
    ...(collectBody ? { body: Buffer.concat(parts) } : {}) };
}
async function publicMarker(base, timeoutMs = 30000) {
  if (timeoutMs <= 0) return { url: base + '_archive-release.json', ok: false, status: 'PUBLIC_TOTAL_BUDGET_EXHAUSTED' };
  const fetched = await fetchDigest(base + '_archive-release.json', 65536, true, Math.min(30000, timeoutMs));
  const { body, ...safe } = fetched;
  if (!fetched.ok) return safe;
  let parsed;
  try { parsed = JSON.parse(body.toString('utf8')); } catch {
    return { ...safe, ok: false, status: 'MARKER_JSON_INVALID' };
  }
  const valid = parsed?.schemaVersion === 'ARCHIVE_PAGES_RELEASE_V1' &&
    SHA_RE.test(parsed.registeredMainSHA || '') && parsed.releaseGate === 'RELEASE_GATE_PASS';
  return {
    ...safe, ok: valid, status: valid ? 'VALID_RELEASE_MARKER' : 'MARKER_CONTRACT_NOT_RECOGNIZED',
    schemaVersion: parsed?.schemaVersion === 'ARCHIVE_PAGES_RELEASE_V1' ? parsed.schemaVersion : null,
    registeredMainSHA: SHA_RE.test(parsed?.registeredMainSHA || '') ? parsed.registeredMainSHA : null,
    releaseGate: parsed?.releaseGate === 'RELEASE_GATE_PASS' ? parsed.releaseGate : null
  };
}
async function observePublic() {
  if (!options.publicBase) return {
    status: 'NOT_REQUESTED',
    expectedOption: '--public-base ' + CONFIG.publicBase,
    globalDeploymentApprovalInferred: false
  };
  const started = Date.now(), deadline = started + 240000;
  const before = await publicMarker(options.publicBase, Math.min(30000, deadline - Date.now())), files = [];
  for (const p of CONFIG.publicPaths) {
    const url = options.publicBase + p.split('/').map(encodeURIComponent).join('/');
    if (deadline - Date.now() <= 30000) {
      files.push({ path: p, url, exactBytes: false, transportStatus: 'PUBLIC_TOTAL_BUDGET_EXHAUSTED',
        expectedSnapshot: options.snapshot });
      continue;
    }
    const key = options.snapshot + ':' + p;
    let expected = inputRefs.get(key);
    if (!expected) expected = readBlob(options.snapshot, p).ref;
    const observed = await fetchDigest(url, expected.bytes + 1024, false,
      Math.min(45000, Math.max(1, deadline - Date.now() - 30000)));
    files.push({
      path: p, url, expectedGitBlobSha1: expected.gitBlobSha1,
      expectedSha256: expected.sha256, expectedBytes: expected.bytes,
      observedSha256: observed.sha256 || null, observedBytes: observed.bytes ?? null,
      transportStatus: observed.status || 'HTTP_' + observed.httpStatus,
      exactBytes: observed.ok === true && observed.bytes === expected.bytes && observed.sha256 === expected.sha256
    });
  }
  const after = await publicMarker(options.publicBase, Math.max(0, deadline - Date.now()));
  const markerStable = before.ok === true && after.ok === true &&
    before.sha256 === after.sha256 && before.bytes === after.bytes &&
    before.registeredMainSHA === after.registeredMainSHA;
  const filesExact = files.every(row => row.exactBytes);
  const exactSnapshotMarker = markerStable && before.registeredMainSHA === options.snapshot;
  return {
    status: filesExact && exactSnapshotMarker ? 'PASS_SCOPED_PUBLIC_BYTES_AND_SNAPSHOT_MARKER' : 'PENDING_PUBLIC',
    pathScope: 'NINE_PREVIOUSLY_VERIFIED_PUBLIC20_METADATA_RUNTIME_AND_BASIC_PARENT_PATHS',
    totalPublicBudgetMs: 240000, elapsedPublicMs: Date.now() - started,
    sourceOrAnswerBodyOutput: 0, identityPublicPath: 'NOT_IN_PRIOR_PUBLIC20_MAPPING; GIT_CAS_ONLY',
    publicFileBytes: filesExact ? 'PASS_EXACT_SELECTED_BYTES' : 'NOT_YET_EXACT',
    snapshotReleaseIdentity: exactSnapshotMarker ? 'PASS_EXACT_SNAPSHOT_MARKER' :
      'NOT_PROVEN; A_DIFFERENT_STABLE_MARKER_MAY_BE_VALID_FOR_A_NO_OP_RELEASE',
    markerBefore: before, markerAfter: after, markerStable,
    noOpReleaseEquivalence: exactSnapshotMarker ? 'NOT_NEEDED' : 'NOT_EVALUATED',
    files, globalDeploymentApprovalInferred: false
  };
}
async function observe() {
  options = parseOptions();
  const actualRoot = gitText(['rev-parse', '--show-toplevel']);
  repoRoot = fs.realpathSync(process.cwd());
  must(actualRoot === repoRoot, 'CWD_MUST_BE_ACTUAL_SNAPSHOT_REPOSITORY_ROOT');
  assertOutputPath(options.out);
  const head = gitText(['rev-parse', '--verify', 'HEAD']);
  must(head === options.snapshot && gitText(['rev-parse', '--verify', options.snapshot + '^{commit}']) === options.snapshot,
    'CHECKOUT_HEAD_MUST_EQUAL_EXPLICIT_SNAPSHOT');
  git(['merge-base', '--is-ancestor', CONFIG.baselineCommit, options.snapshot], 1024 * 1024);
  const codeCommit = process.env.OBSERVATION_CODE_SHA;
  must(SHA_RE.test(codeCommit || ''), 'OBSERVATION_CODE_SHA_REQUIRED');
  const codePath = 'docs/operations/middle-meta-closeout-26fc-20261117/observe-registered-snapshot.mjs';
  const codeRef = readBlob(codeCommit, codePath);
  const executingBytes = fs.readFileSync(new URL(import.meta.url));
  must(gitBlob(executingBytes) === codeRef.ref.gitBlobSha1 && sha256(executingBytes) === codeRef.ref.sha256,
    'EXECUTING_OBSERVER_DOES_NOT_MATCH_DECLARED_CODE_COMMIT');
  report.inputs = { snapshot: options.snapshot, checkoutHead: head, observationCodeCommit: codeCommit,
    observer: codeRef.ref, baselineCommit: CONFIG.baselineCommit,
    actualDataAndCandidateObserverCodeAreSeparate: true };
  const initialTrackedState = gitText(['status', '--porcelain', '--untracked-files=no']);
  must(initialTrackedState === '', 'ACTUAL_CHECKOUT_HAS_TRACKED_CHANGES');
  const baseIdentityRead = readJson(CONFIG.baselineCommit, ID_PATH);
  const baseline = identityCohort(baseIdentityRead.data);
  baseIdentityRead.data = null;
  const expectedTotal = Object.values(CONFIG.denominators).reduce((a, b) => a + b, 0);
  must(expectedTotal === 6389 && baseline.rows.length === expectedTotal &&
    Object.keys(CONFIG.denominators).every(k => baseline.counts[k] === CONFIG.denominators[k]),
    'BASELINE_COHORT_DOES_NOT_MATCH_FROZEN_DENOMINATORS');
  const currentIdentityRead = readJson(options.snapshot, ID_PATH);
  const current = identityCohort(currentIdentityRead.data);
  currentIdentityRead.data = null;
  const oldTuples = membershipTuples(baseline), currentTuples = membershipTuples(current);
  const sameMembership = stable(oldTuples) === stable(currentTuples);
  const missing = baseline.rows.filter(row => !current.byUid.has(row.questionUid)).map(row => row.questionUid);
  const added = current.rows.filter(row => !baseline.byUid.has(row.questionUid)).map(row => row.questionUid);
  report.scope = {
    baselineCommit: CONFIG.baselineCommit, expectedTotal, expectedDenominators: CONFIG.denominators,
    definition: 'Frozen baseline identity rows in M1S1, M1S2, M2S1, M2S2, M3S2 only.',
    baselineIdentityRef: baseIdentityRead.ref, currentIdentityRef: currentIdentityRead.ref,
    baselineMembershipSha256: digest(oldTuples), currentMembershipSha256: digest(currentTuples),
    currentMembershipEqual: sameMembership, missingUids: missing, additionalUids: added,
    baselineCounts: baseline.counts, currentIdentityCounts: current.counts
  };
  check('FIXED_6389_IDENTITY_MEMBERSHIP_EXACT', sameMembership);
  must(sameMembership, 'CURRENT_COHORT_MEMBERSHIP_DRIFT');
  const uids = new Set(baseline.byUid.keys());
  const baseMdRead = readJson(CONFIG.baselineCommit, MD_PATH);
  const baseMd = metadataMap(baseMdRead.data, uids);
  baseMdRead.data = null;
  const currentMdRead = readJson(options.snapshot, MD_PATH);
  const currentMd = metadataMap(currentMdRead.data, uids);
  currentMdRead.data = null;
  const baselineIndexRead = readJson(CONFIG.baselineCommit, INDEX_PATH);
  const baseIndex = indexView(baselineIndexRead.data, baseline);
  baselineIndexRead.data = null;
  const currentIndexRead = readJson(options.snapshot, INDEX_PATH);
  const actualIndex = indexView(currentIndexRead.data, current);
  currentIndexRead.data = null;
  check('ACTUAL_INDEX_GLOBAL_COUNTS_SELF_CONSISTENT',
    actualIndex.counts?.registered === actualIndex.globalRecordCount &&
    actualIndex.counts?.pending === actualIndex.globalPendingEntryCount &&
    actualIndex.counts?.files === actualIndex.globalFileCount);
  report.closedSourceNumbering = {
    baseline: attachClosedSourceNumbering(baseline, CONFIG.baselineCommit),
    current: attachClosedSourceNumbering(current, options.snapshot),
    scope: 'FIVE_OBSERVED_LEGACY_BANKS_ONLY; RAW_ID_IS_NOT_ASSUMED_TO_BE_DISPLAY_NUMBER'
  };
  const basePending = pendingAssignments(baseIndex, baseline, CONFIG.baselineCommit);
  const pending = pendingAssignments(actualIndex, current, options.snapshot);
  const sources = [...baseline.bySource.keys()].sort();
  const examIds = new Map(sources.map((source, i) => [source, i + 1]));
  report.scope.exams = sources.map(source => ({
    examId: examIds.get(source), semester: scopeForSource(source), sourceArchiveFile: source,
    targetCount: baseline.bySource.get(source).length
  }));
  report.scope.membershipTupleSchema = ['questionUid', 'examId', 'sourceOrdinal', 'currentRegistered'];
  report.scope.membershipTuples = baseline.rows.map(row => [
    row.questionUid, examIds.get(row.sourceArchiveFile), row.sourceOrdinal, actualIndex.byUid.has(row.questionUid)
  ]);
  report.officialFourSlotReceipt = verifyIssuedIndexReceipt(actualIndex, currentIndexRead.ref);
  report.consumer = verifyScopedConsumer(actualIndex, current);
  report.physical = {
    currentRegistered: actualIndex.byUid.size, currentRemaining: baseline.rows.length - actualIndex.byUid.size,
    baselineRegistered: baseIndex.byUid.size,
    globalIndexReportedCounts: actualIndex.counts,
    globalCountsAreNotTheScopedDenominator: true,
    currentSemesters: physicalSummary(current, actualIndex, pending),
    baselineSemesters: physicalSummary(baseline, baseIndex, basePending),
    pendingRows: summarizePending(current, actualIndex, pending, currentMd, examIds)
  };
  report.storedMetadataAxes = {
    note: 'Stored labels and literal difficulty fields only. No issued D5 count or new/current semantic approval is inferred.',
    current: metadataSummary(current, currentMd), baseline: metadataSummary(baseline, baseMd)
  };
  report.baselineToSnapshotSelectedRowDeltas = selectedDeltas(baseline, current, baseMd, currentMd, baseIndex, actualIndex);
  const targets = new Set([...CONFIG.protectedGroups.m3RemainingThree.rows.map(row => row.questionUid),
    DIAGNOSTIC_E017_Q11.questionUid]);
  const beforeRuntime = runtimeSelection(CONFIG.baselineCommit, targets);
  const afterRuntime = runtimeSelection(options.snapshot, targets);
  report.remainingThreeStoredRowCas = proveRemainingThree(baseMd, currentMd, baseline, current, beforeRuntime, afterRuntime);
  report.exactNativeFailureDiagnostic = observeExactNativeFailureUid(baseline, current, baseMd, currentMd,
    baseIndex, actualIndex, beforeRuntime, afterRuntime, pending);
  report.protectedSubgroups = protectedObservations(baseline, current, baseMd, currentMd, baseIndex, actualIndex, pending);
  report.public = await observePublic();
  const finalTrackedState = gitText(['status', '--porcelain', '--untracked-files=no']);
  check('TRACKED_REPOSITORY_UNCHANGED', finalTrackedState === initialTrackedState);
  const dataPass = report.checks.every(value => value.pass);
  report.operationalDataStatus = dataPass ? 'PASS' : 'FAIL';
  report.status = !dataPass ? 'FAIL_OBSERVATION_CHECKS' :
    report.public.status === 'PENDING_PUBLIC' ? 'PASS_OPERATIONAL_DATA_WITH_PENDING_PUBLIC' : 'PASS_OPERATIONAL_DATA';
}
function emit() {
  report.inputRefs = [...inputRefs.values()].sort((a, b) => (a.commit + ':' + a.path).localeCompare(b.commit + ':' + b.path));
  report.finishedAtUtc = new Date().toISOString();
  const text = JSON.stringify(report, null, 2) + '\n';
  if (options?.out && repoRoot) {
    try {
      assertOutputPath(options.out);
      fs.writeFileSync(options.out, text, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    } catch (error) {
      report.outputWriteError = safeError(error);
      report.status = 'FAIL_OBSERVATION_OUTPUT';
      process.exitCode = 1;
    }
  }
  process.stdout.write('BEGIN_MIDDLE_META_OBSERVATION_JSON\n' + JSON.stringify(report, null, 2) +
    '\nEND_MIDDLE_META_OBSERVATION_JSON\n');
}
try {
  await observe();
  if (report.operationalDataStatus !== 'PASS') process.exitCode = 1;
} catch (error) {
  report.status = 'FAIL_READ_ONLY_OBSERVATION';
  report.observationError = safeError(error);
  process.exitCode = 1;
} finally {
  emit();
}
