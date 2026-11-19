import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import SvgIndex from '../../../tools/4slot/existing-vector-svg-index-continuity.cjs';
import {validateM2ProblemRendererUiTileEvidence} from './reviewed-m2-problem-renderer-continuity.mjs';

// An issued-source comparison view, never a new source or approval. Only the
// eight frozen UIDs may use current display evidence. The caller must replay its
// complete ordinary Native leaf while this private synchronous token is alive.
const contexts = new WeakMap();
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a,b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = value => sha(stable(value));
const blob = bytes => crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const fail = code => { throw Error('M2_P21_CURRENT8:'+code); };
const SHA1=/^[a-f0-9]{40}$/, SHA256=/^[a-f0-9]{64}$/;
const refKeys=['commit','path','gitBlobSha1','sha256','bytes'];
const exact=(value, keys)=>value && typeof value==='object' && !Array.isArray(value) && same(Object.keys(value).sort(),[...keys].sort());
const frozen = value => { if(value && typeof value==='object'){Object.values(value).forEach(frozen);Object.freeze(value);}return value; };
export const M2_P21_CURRENT_EIGHT_SCHEMA='archive-four-slot-registered-m2-problem21-current-ui-continuity-v1';
export const M2_P21_CURRENT_EIGHT_BINDING_REF=frozen({
  "commit": "aeabffcc23c70286f7862d69e815080c13490ad0",
  "path": "docs/operations/m2-closed8-current-ui-26fc-20261117/run-44023454159/current-eight-ui-binding-v1.json",
  "gitBlobSha1": "b92038ba35288cad66b5eac34c4fe1de05b10ec4",
  "sha256": "7eb531af870bce1b595a4946b671be04bcf455bc64109783e1af2104e905cee9",
  "bytes": 57478
});
export const M2_P21_CURRENT_EIGHT_ITEMS=frozen([
  {
    "key": "E017-Q04",
    "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
    "sourceOrdinal": 4,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q4-problem-visual-v4.svg",
      "gitBlobSha1": "8ceb67213019d19a316f585046f4dfb2a3866770",
      "sha256": "536b894d4b9c78180125ec685816040271a46e8c297e4b025ba5570efbafde7c",
      "bytes": 4426
    },
    "wholeQuestionSha256": "47f9c32f8c5dd19d0fc819d6dbb1212acdd19d73573190cff044e76bb5174c43",
    "problemPayloadSha256": "9425fc57e6154ccd067e0a2a78fad85b1f1a7554dd8230315a3064a11eede4b3",
    "problemFieldsSha256": "373e3735952f62b92f3020d268ff9f9babb2c82abc7e55ffb5a8a745ba2d8c8a",
    "presentationSha256": "aac3b9623073b1323f41aa03987cafc796c073db11af8ff0e91da2b47bb81291",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "2523ddb95a43650b994884d960ca7bf8121d7daee008790b6972f0e1947c2799",
    "issuedIdentitySha256": "7d12e222942992a2642871dad111e3d1c97edb611f36c526cd74740b050a3fe9",
    "issuedRuntimeSha256": "2b446bbf153084ccf3a28696bc4251674b3320a9a018392eadbc1c1a15db55a5",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q04.json",
      "gitBlobSha1": "b0c1aa4f63623f9dfa823a8757e3b70739b3a451",
      "sha256": "dc8e6c1ade7d686e5c45a2337930da40a299bbef1f84dff148dc8a563339eea8",
      "bytes": 2274
    },
    "derivedRecordSha256": "a72a163f5babe53d35a96ab48dce28a0c1188e50b47b09fcf85c6893124c2118"
  },
  {
    "key": "E017-Q05",
    "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
    "sourceOrdinal": 5,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q5-problem-visual-v4.svg",
      "gitBlobSha1": "28c9d60eee441984ce81ed941a477d661a556f3e",
      "sha256": "2c7fd8f8cbebe68fc21b52c3927382e609ae4238f5cd601ddfe6c58c9dd5a87e",
      "bytes": 17139
    },
    "wholeQuestionSha256": "3950314c5c63b927dc64ec2d89b0ed7dfcaebb8b10bd9930473c3f7bc05450db",
    "problemPayloadSha256": "fb6fa950c21c85414e9732144e6fa7e06fae71bf2296be16300adfa1899365a4",
    "problemFieldsSha256": "1212c40c73f5ebf9e0331033f729d2c012509f322f7b1464b076440a2404faa6",
    "presentationSha256": "7f46b4ca67c888c7872ae42b1d997789e616cb02e7f5e128faf07f71ce7be660",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "cbccad8c5428ed3d635e1b7e42b18f1e590994aca8f481f8da27f4403495178a",
    "issuedIdentitySha256": "76868509296556e36836d3341deb7e1fc65493eb3e72a6ac8c4e04c0a313cafe",
    "issuedRuntimeSha256": "5331042a6a52490ce27dd3c2f28509a6509e1c6d7ce1c4b2711b701544a3a1d8",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q05.json",
      "gitBlobSha1": "206d489d2ea9d733dc7eca1c311f342f3937bd79",
      "sha256": "dfb4a2e55221b4cffeecc711981a7b65566feb58e2e9873b65329d4c8e663145",
      "bytes": 2274
    },
    "derivedRecordSha256": "8eb2aeec34bb12550c0662dacc4a25b0f88022c0eebcdb3d852617edb59eb83d"
  },
  {
    "key": "E017-Q09",
    "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
    "sourceOrdinal": 9,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q9-problem-visual-v4.svg",
      "gitBlobSha1": "1c2b78a81b3e5a34be0ac1a7163bbfb19ca4b85e",
      "sha256": "b1378acc43d6a968bade6c4b4ab15a55cfd4738252fc044857093fffe1fdff20",
      "bytes": 4802
    },
    "wholeQuestionSha256": "7dbe985e218260fcfe3326ef0028fc1b46163653ac311552c16a4c30683ac105",
    "problemPayloadSha256": "2bae619d5a5a331043875340c4d151ad7ed811748060af71efc3b82d5ab7a6b2",
    "problemFieldsSha256": "f9c334968706beed2e091186f89d47010a54bbc823cb168f07896cdec55880d1",
    "presentationSha256": "fa8f3719ff2ae4f369877bd8f84677acb323c97e332a722b347e3c25ead01173",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "343c473761265af73a7ba4c187ec342275c6828a8c3c01cf249bce79412afc38",
    "issuedIdentitySha256": "9e4743f70f33be29b8b92de11c68a08a5ec230464c50ef5c3a277dac118b77a7",
    "issuedRuntimeSha256": "9b1129932dd021400c8accfd014e56eac85c1ff98367600335f6f6bbe78e0c97",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q09.json",
      "gitBlobSha1": "db6ed5eb4c67c82f963dc63119650580a3a5ff9a",
      "sha256": "6067620c3571b81e0e5a8f8d7e5f36d77596ce80fdecf1aad26eb13cc3d205fc",
      "bytes": 2274
    },
    "derivedRecordSha256": "d48ab8301815c5182badd68ce374a27a3a1f506a2d3e829592b92726b03872cf"
  },
  {
    "key": "E017-Q18",
    "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
    "sourceOrdinal": 18,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q18-problem-visual-v3.svg",
      "gitBlobSha1": "2cae8726c373f5c728f010860ae288e103982212",
      "sha256": "a301b3ff21f2f371ec0220600757e74b4473c5cad5f084494a233f16506ad37c",
      "bytes": 4257
    },
    "wholeQuestionSha256": "d5ae8b69995566b590ea9df2b317983a9c9fbcacd1392ea290aaa25024e704a3",
    "problemPayloadSha256": "4862d8e3cf5c65b13717b69252f2aa1e8b5a5872eeafe3caa256942ff47c419d",
    "problemFieldsSha256": "9a20ba1b3eceff3454901ba22ecf58e86ba5eff0b096c9a7f217e76d394f2c89",
    "presentationSha256": "eb930a92f1ffb18aeb882f6b7e5a42d4bba8bcc6843b1d796a66518bda6b2e6d",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "551f7ca35879d5423f976f411a2220b1201519d33df7d6bfeb7ee6f0242c0310",
    "issuedIdentitySha256": "4cbb3507e247e39bf49c0ce1adacb50b46845b039265463f046ff1caddfadaf7",
    "issuedRuntimeSha256": "c1ac7415231c589676416d5b518bd3b43bde75e585761c12a3bdc8992d4993b1",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q18.json",
      "gitBlobSha1": "03647587169a9341581b7896e8b4382ec0677211",
      "sha256": "1d6bda54762aafbab2fe3e5dfeb1e513b2ee2d654d0a825b5a19d0cd474b532b",
      "bytes": 2277
    },
    "derivedRecordSha256": "a4326f07972ea013fe76241e5f5646ea0aa9cc69eb2bf208348794b371689d0b"
  },
  {
    "key": "E017-Q20",
    "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
    "sourceOrdinal": 20,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q20-problem-visual-v3.svg",
      "gitBlobSha1": "c1c73664336bdbdd83136ea58773b1c23b189b90",
      "sha256": "a156e3687d04197ee3dff3dd65710e833908432b3c3d6440b854526b57145fe6",
      "bytes": 4437
    },
    "wholeQuestionSha256": "3e151ebd86eb8eb433c06f8ac5d701670a2f9a62c6ee3149d8d626a99952a3ed",
    "problemPayloadSha256": "a575879fa614faa4bcb954da513289d7bb8af65b3f4c77c2b04543ab0ec7630b",
    "problemFieldsSha256": "13221beb4c6b3b5a2054860eab3937aff67204d838e57820a002826a974b435a",
    "presentationSha256": "85a2607cf31517ed0bc9ef12ed328f665d7ae95eb65b028df76da5e9a28d4e13",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "b7a8e531572007579908841f92cc0a8589eb86ecdb4e5e64e66945a1ebe25156",
    "issuedIdentitySha256": "356bdbd0ba49feb521eb3129ef2755cae54dd8298efb4f89d15b5efa29b48bd0",
    "issuedRuntimeSha256": "6f050f738f257e2e94703841fe4eb34e9047560fddcfb299700113330730c36d",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q20.json",
      "gitBlobSha1": "26df64265146e0dd7eb2e9a7eed0f340a6782980",
      "sha256": "c7b5f83ac0b05400f7ed49d4b7adc3462575b0f1b4f4885684605d6cd99fe864",
      "bytes": 2277
    },
    "derivedRecordSha256": "53ebb6687d4c348b7e92b3c4adf8a4cfafcd7738c2bc7db6cf1ab01d0b94df84"
  },
  {
    "key": "E017-Q23",
    "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
    "sourceOrdinal": 23,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "f417b7e4e993ceb1a70c1b85de1e292a52d2b551",
      "sha256": "18caddd4282a3121e51eb6c2fe2e047c3a6e8e11074336b10a6098566529a68a",
      "bytes": 66605
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
      "gitBlobSha1": "35d1f2446122393d7bff665d131d9bb3d01d404f",
      "sha256": "3ab178dbf42bfdaacdb2796327e68e020034805236acb687cca810c0771449dc",
      "bytes": 66857
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q23-problem-visual-v3.svg",
      "gitBlobSha1": "2f865edf92807075f5ab0bb7fa36009a8b28693c",
      "sha256": "82f2b31b9133062ce50c6332a7668a7ce228c4bb21f6ba512103e9ad5ce94f1d",
      "bytes": 3713
    },
    "wholeQuestionSha256": "84a42ce64e3f148269da7d680e5199fa15b5405ba8a2237df3b6a4dca9e2bf91",
    "problemPayloadSha256": "85bfa07188830df408249b00912acca4a5acadfdff17ad1b59125ab96ab0ffe5",
    "problemFieldsSha256": "03cfbbd89ab1bd84bae680282966f27508405f4caf6e3b70562b7209c17df27b",
    "presentationSha256": "52fb9ac857cd34d4ae60cd9a31bde5184321fb81012533ac5f1d5ae53311f8b0",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.json",
      "gitBlobSha1": "89e93ce817dac8387c99cc1862346c552542b793",
      "sha256": "a2a9804f48bd3d9befc9ad54f34edbf0cc11fb23fa4c4949b34b7ab732a28a6d",
      "bytes": 316230
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e017-public14-20261116.source-review-binding.json",
      "gitBlobSha1": "b3be595cb47d572beebc1aba0cadea13536fb2b3",
      "sha256": "1d48370a6339bfcb4086640c04216a6260fe45c91f1d4411c6881cf1affa0eb0",
      "bytes": 114662
    },
    "issuedMetadataSha256": "8cb2111fee8650977645fed100b5ee5bbe22137231f3281a3b4c7aacef86a966",
    "issuedIdentitySha256": "83194ac1040f931a3b2c005ee7f47011b6fc05fcd5f26218e6b655303b30096f",
    "issuedRuntimeSha256": "e319dcfd14ecba115a7f4f8df69bdbee2fd99e8fd99349c317971824eb1a8270",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q23.json",
      "gitBlobSha1": "9efd42692ade9230e6cf5aa66a5bbfbf2f6a9e8f",
      "sha256": "b9ecfefe70567e2c4c9bd891c81c45bcf5882092fe1abcc46d0b8acd0c24972d",
      "bytes": 2277
    },
    "derivedRecordSha256": "56cf0a1077398d100fc758bb9634add014072e481dbffab6d6fbe4b0c85949be"
  },
  {
    "key": "E023-Q06",
    "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
    "sourceOrdinal": 6,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
      "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
      "bytes": 65146
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
      "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
      "bytes": 65146
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q6-problem-visual-v4.svg",
      "gitBlobSha1": "c42e846519c266ef9f30389c03e71d6f33c81d72",
      "sha256": "a92041578869d2121a0524f79dec4cb77d1711a59b530bbc2f1ca4e2cb860482",
      "bytes": 4003
    },
    "wholeQuestionSha256": "37b0784195a978a47de96fddd5f993f17c1c0b95d63ee01fb46130daa36a4def",
    "problemPayloadSha256": "3c1a320c17564b04f519b587c28d4de710b8777c4e6981eb500c226bedc054df",
    "problemFieldsSha256": "6ba16741fc095f4728b330eb617d4cc87323faa4cc446fba567666fa84307167",
    "presentationSha256": "4ec5e2e13894ea08581ac39d95ab1734aabe56c546aa9262bb28ac61d6fef4d0",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.json",
      "gitBlobSha1": "194e2f165c3347388e696227fcafd36b6a2d54a1",
      "sha256": "3c34d1cd787b689103701d6ed7d8ff66eab11cbdd1d4b86de05152d92d9f12f4",
      "bytes": 179506
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.source-review-binding.json",
      "gitBlobSha1": "4e44e217a5ce9f738d310438977d3a2ca094dbe2",
      "sha256": "4003bdf807260f13666029f6fc3f7fb8f4f63ef87ec935c424f95f929483edad",
      "bytes": 55032
    },
    "issuedMetadataSha256": "d47fbbf3613198540991e674ec3c8f15a8284c884d95a1a0f9fdbb607c1aa255",
    "issuedIdentitySha256": "eee0de875a366e7c78e27d9e2096b1bcc04da3ab03c9faf928cd3f907ca3a9d1",
    "issuedRuntimeSha256": "1ad1cfae776c646537b31a5438da487a12afbd1c53b6211e45eb59dc61aa0bdd",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e023-q06.json",
      "gitBlobSha1": "07d087288ef915ada881a02651ec12b1ee65707d",
      "sha256": "30cc3bcb06e635aee4cd689a6eb6a43c5e769cecfaa41b5c9947bd969a1b50ca",
      "bytes": 2294
    },
    "derivedRecordSha256": "5aa1b61e413007f5fe9a7cdbf8fdfb6a0b5052d1777305a56fc327a0271bde59"
  },
  {
    "key": "E023-Q10",
    "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
    "sourceOrdinal": 10,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "issuedSourceRef": {
      "commit": "e841eb07f25c9646df5bbf5b235fc9a1d815f4f7",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
      "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
      "bytes": 65146
    },
    "currentSourceRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      "gitBlobSha1": "a0aaefbea3f6c695d515dbdb873c1e1f3304d5c7",
      "sha256": "8a8cb1f63ca99513962e4191fe308efc552be0c8bf9f8befaf8008157d0c9d82",
      "bytes": 65146
    },
    "currentAssetRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q10-problem-visual-v4.svg",
      "gitBlobSha1": "56a4c294c7dcadb0271a9b13e4222afc2a764e8f",
      "sha256": "ad5ef51883df950f9b12f28083921b98b87547b382edc9326365a21fdf33a3f7",
      "bytes": 4979
    },
    "wholeQuestionSha256": "5f2860f8f1d2383ac0394a100434acd15ddb1680f8f8b8c8862c77de281db47a",
    "problemPayloadSha256": "8f045a67193d1e62abe7188ae68cc9126c80400dd0b6155d3ae308c1134dd998",
    "problemFieldsSha256": "c0a607e468cfeea67e719309b6e34bfb6ac080664f3f63fe19c19df7afe28403",
    "presentationSha256": "ea18839dd0053ed46bbdf4d7d1b2fb901d0532b596135720f9c2542822f2f872",
    "receiptRef": {
      "commit": "de634386a46b5fb081acd24813382a6a616f8d8b",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.json",
      "gitBlobSha1": "194e2f165c3347388e696227fcafd36b6a2d54a1",
      "sha256": "3c34d1cd787b689103701d6ed7d8ff66eab11cbdd1d4b86de05152d92d9f12f4",
      "bytes": 179506
    },
    "sourceReviewBindingRef": {
      "commit": "5a20d765998a2101899572ba84a359fef751ecfb",
      "path": "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2s2-display21-current626-e023-public-private6-20261116.source-review-binding.json",
      "gitBlobSha1": "4e44e217a5ce9f738d310438977d3a2ca094dbe2",
      "sha256": "4003bdf807260f13666029f6fc3f7fb8f4f63ef87ec935c424f95f929483edad",
      "bytes": 55032
    },
    "issuedMetadataSha256": "705fad964d46192563af52ebbc83b4774ab8eaf80371afe8046752a18e50691a",
    "issuedIdentitySha256": "1e9dfdf6335a36d2d5b773d3d2d502261baab4535d66feb92dc45688da6f5037",
    "issuedRuntimeSha256": "86de5f26e33da7de087b44ad40b12a59de25323e9afd2714ba65ac522478e36c",
    "sidecarRef": {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e023-q10.json",
      "gitBlobSha1": "594010ff306345d8ab5205df5be6be6bc0483d01",
      "sha256": "1e69d9a3decc92209acd464758b1368f02c3a0d5298f663ff9a94eacf66343bd",
      "bytes": 2297
    },
    "derivedRecordSha256": "d189af9942d54187e6a31b2b3922b99c0cecc8a94cc66b2ed7edd81f55e23fc1"
  }
]);
const EXPECTED_SOURCE_DELTA=frozen([
  {
    "ordinal": 2,
    "fields": [
      "image",
      "imageAlt",
      "imageSize",
      "layoutTag"
    ],
    "oldWholeSha256": "14ad87759519661f8b0c39ff681707e92a27a4e70c58aeb1403c2db652c13a78",
    "currentWholeSha256": "c14fbabea51bc074749dbe2ab012e692c846a4c42a3802f21ab405fee29a4bf5"
  },
  {
    "ordinal": 6,
    "fields": [
      "content"
    ],
    "oldWholeSha256": "491ff72d32c2168a243689b278c6b850c6e4406d359f41c7bf7fb22f12eb9650",
    "currentWholeSha256": "dc882e0d9aface8d5f8d2484808afd39fe7dcf5f4c0c437af5ca30f8087979ea"
  },
  {
    "ordinal": 17,
    "fields": [
      "solution"
    ],
    "oldWholeSha256": "2e615f502a261b496bd7f1ddbe193e5f3d27324b142f271e309baba2360edbd9",
    "currentWholeSha256": "ed9e710f08f32566bda61c6863faf77649677bbdf13976b05124707f347736e9"
  }
]);


const TOKEN_KEY='m2Problem21CurrentUiContinuation';
const MD='archive/data/question_metadata.json', ID='archive/data/question_identity_map.json', SVG='archive/data/svg-accessibility-index.js';
const MAX=128*1024*1024, immutableCache=new Map();
function git(root,args,maxBuffer=MAX){
  try{return execFileSync('git',args,{cwd:root,maxBuffer,timeout:30000,stdio:['ignore','pipe','pipe'],
    env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}});}catch{fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE');}
}
function localPath(root,relative,missing=false){
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||/[\\\x00-\x1f\x7f]/.test(relative)||
      relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('PATH');
  let at=root;const parts=relative.split('/');
  for(let i=0;i<parts.length;i++){
    at=path.join(at,parts[i]);let st;
    try{st=fs.lstatSync(at);}catch(e){if(missing&&e.code==='ENOENT')return null;fail('FILE_UNAVAILABLE');}
    if(st.isSymbolicLink()||(i===parts.length-1?!st.isFile():!st.isDirectory()))fail('REGULAR_FILE');
    if(i===parts.length-1&&(st.size<1||st.size>MAX))fail('FILE_SIZE');
  }return at;
}
function refOnly(ref){return Object.fromEntries(refKeys.map(k=>[k,ref[k]]));}
function checked(bytes,ref){
  if(!Buffer.isBuffer(bytes)||bytes.length!==ref.bytes||sha(bytes)!==ref.sha256||blob(bytes)!==ref.gitBlobSha1)fail('RAW_GIT_PIN');
  return bytes;
}
function immutable(root,ref){
  if(!exact(ref,refKeys)||!SHA1.test(ref.commit||'')||!SHA1.test(ref.gitBlobSha1||'')||!SHA256.test(ref.sha256||'')||
      !Number.isSafeInteger(ref.bytes)||ref.bytes<1||ref.bytes>MAX)fail('EXACT_REF');
  // Validate the path independently of sparse working-tree presence.
  if(typeof ref.path!=='string'||!ref.path||path.isAbsolute(ref.path)||/[\\\x00-\x1f\x7f]/.test(ref.path)||ref.path.split('/').some(p=>!p||p==='.'||p==='..'))fail('PATH');
  const key=root+'\0'+stable(ref);
  if(immutableCache.has(key))return Buffer.from(immutableCache.get(key));
  if(git(root,['rev-parse','--verify',ref.commit+'^{commit}']).toString().trim()!==ref.commit||
      git(root,['ls-tree','-z',ref.commit,'--',ref.path]).toString()!=='100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0')fail('COMMIT_PATH_PIN');
  const bytes=checked(git(root,['cat-file','blob',ref.gitBlobSha1]),ref);
  if(bytes.length<=1024*1024)immutableCache.set(key,Buffer.from(bytes));
  return bytes;
}
function fileDigest(root,relative){
  const fd=fs.openSync(localPath(root,relative),'r'),sum=crypto.createHash('sha256'),buffer=Buffer.alloc(65536);
  let size=0,n;
  try{while((n=fs.readSync(fd,buffer,0,buffer.length,null))){size+=n;sum.update(buffer.subarray(0,n));}}
  finally{fs.closeSync(fd);}
  return{path:relative,sha256:sum.digest('hex'),bytes:size};
}
function remember(ctx,ref){
  const before=ctx.liveRefs.get(ref.path),value={path:ref.path,sha256:ref.sha256,bytes:ref.bytes};
  if(before&&!same(before,value))fail('CONFLICTING_LIVE_DEPENDENCY');
  ctx.liveRefs.set(ref.path,value);
}
// Render engine files may change after the capture; only their captured Git bytes are authenticated (user decision 2026-11-18).
const isRenderEngineFile=p => p === "archive/engine.html" || p === "archive/mixed_engine.html" || p === "apmath/wrong_print_engine.html" ||/^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||/^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
function live(ctx,ref,read=false){
  const digest=fileDigest(ctx.root,ref.path);
  if(digest.bytes!==ref.bytes||digest.sha256!==ref.sha256)fail('LIVE_DEPENDENCY_DRIFT');
  remember(ctx,ref);
  return read?fs.readFileSync(localPath(ctx.root,ref.path)):null;
}
function parseJson(bytes){try{return JSON.parse(bytes);}catch{fail('JSON');}}

function parseQuestionBankJson(raw) {
 const patterns=[
  {kind:'DIRECT_WINDOW_QUESTIONBANK_JSON_ARRAY',re:/\bwindow\.questionBank\s*=\s*\[/g,opening:'[',closing:']'},
  {kind:'WINDOW_EXAMDATA_JSON_QUESTIONS_ALIAS',re:/\bwindow\.examData\s*=\s*\{/g,opening:'{',closing:'}'}
 ];
 const found=patterns.flatMap(p=>[...raw.matchAll(p.re)].map(m=>({p,m})));
 if(found.length!==1)fail('SOURCE_BANK_JSON_WRAPPER_NOT_UNIQUE');
 const {p,m}=found[0],start=m.index+m[0].lastIndexOf(p.opening);
 let depth=0,inString=false,escape=false,end=-1;
 for(let i=start;i<raw.length;i++){
  const ch=raw[i];
  if(inString){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')inString=false;continue;}
  if(ch==='"'){inString=true;continue;}
  if(ch===p.opening)depth++;else if(ch===p.closing){depth--;if(depth===0){end=i+1;break;}}
 }
 if(end<0||inString||depth!==0)fail('SOURCE_BANK_JSON_UNCLOSED');
 const literal=raw.slice(start,end),value=JSON.parse(literal);
 const prefix=raw.slice(0,m.index),suffix=raw.slice(end);
 const stripComments=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\r\n]*/g,'').trim();
 if(!/^(?:window\.examTitle\s*=\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*;\s*)?$/.test(stripComments(prefix)))fail('SOURCE_BANK_EXECUTABLE_PREFIX');
 let data;
 if(p.kind==='DIRECT_WINDOW_QUESTIONBANK_JSON_ARRAY'){
  if(!/^\s*;?\s*$/.test(stripComments(suffix)))fail('SOURCE_BANK_EXECUTABLE_SUFFIX');
  data=value;
 }else{
  if(!/^\s*;\s*(?:window\.questionBank\s*=\s*window\.examData\.questions\s*;?\s*)?$/.test(stripComments(suffix)))fail('SOURCE_BANK_ALIAS_SUFFIX_NOT_EXACT');
  data=value?.questions;
 }
 if(!Array.isArray(data)||!data.every(q=>q&&typeof q==='object'&&!Array.isArray(q)))fail('SOURCE_BANK_QUESTION_ARRAY_SHAPE');
 return{kind:p.kind,data,literal,prefix:raw.slice(0,start),suffix};
}
function sourcePair(item,oldBytes,currentBytes){
  checked(oldBytes,item.issuedSourceRef);checked(currentBytes,item.currentSourceRef);
  const before=parseQuestionBankJson(oldBytes.toString('utf8')),after=parseQuestionBankJson(currentBytes.toString('utf8'));
  if(before.data.length!==item.expectedQuestionCount||after.data.length!==item.expectedQuestionCount||
      before.kind!==after.kind||before.prefix!==after.prefix||before.suffix!==after.suffix)fail('SOURCE_WRAPPER_OR_DENOMINATOR');
  const changes=[];
  for(let i=0;i<before.data.length;i++)if(!same(before.data[i],after.data[i])){
    const a=before.data[i],b=after.data[i],keys=[...new Set([...Object.keys(a),...Object.keys(b)])];
    changes.push({ordinal:i+1,fields:keys.filter(k=>!same({present:Object.hasOwn(a,k),value:a[k]},{present:Object.hasOwn(b,k),value:b[k]})).sort(),
      oldWholeSha256:hash(a),currentWholeSha256:hash(b)});
  }
  if(!same(changes,item.key.startsWith('E017')?EXPECTED_SOURCE_DELTA:[]))fail('EXACT_NONSELECTED_SOURCE_DELTA');
  for(const fixed of M2_P21_CURRENT_EIGHT_ITEMS.filter(i=>i.sourceArchiveFile===item.sourceArchiveFile))
    if(hash(before.data[fixed.sourceOrdinal-1])!==fixed.wholeQuestionSha256||
        hash(after.data[fixed.sourceOrdinal-1])!==fixed.wholeQuestionSha256)fail('SELECTED_WHOLE_QUESTION');
  return{oldBank:before.data,currentBank:after.data,changes};
}
export function verifyM2Problem21CurrentSourcePair({sourceArchiveFile,oldBytes,currentBytes}){
  const item=M2_P21_CURRENT_EIGHT_ITEMS.find(i=>i.sourceArchiveFile===sourceArchiveFile);
  if(!item)fail('SOURCE_OUTSIDE_CLOSED_TWO');
  const p=sourcePair(item,oldBytes,currentBytes);
  return{status:'PASS',sourceArchiveFile,count:p.currentBank.length,changes:p.changes,
    selectedWholeQuestionHashes:M2_P21_CURRENT_EIGHT_ITEMS.filter(i=>i.sourceArchiveFile===sourceArchiveFile)
      .map(i=>({questionUid:i.questionUid,sourceOrdinal:i.sourceOrdinal,sha256:i.wholeQuestionSha256}))};
}
function exactOne(rows,predicate,code){
  if(!Array.isArray(rows))fail(code);const found=rows.filter(predicate);if(found.length!==1)fail(code);return found[0];
}
function selectedRows(bytes,kind){
  const doc=parseJson(bytes);if(!Array.isArray(doc.records))fail('DATA_RECORDS');
  const seen=new Set(),joins=new Set(),selected=new Map();
  for(const row of doc.records){
    if(!row||typeof row.questionUid!=='string'||seen.has(row.questionUid))fail('GLOBAL_UID_NOT_UNIQUE');
    seen.add(row.questionUid);
    if(kind==='IDENTITY'){
      const join=stable([row.sourceArchiveFile,row.sourceOrdinal]);
      if(joins.has(join))fail('GLOBAL_IDENTITY_JOIN_NOT_UNIQUE');joins.add(join);
    }
    const item=M2_P21_CURRENT_EIGHT_ITEMS.find(i=>i.questionUid===row.questionUid);
    if(item){
      if(row.sourceArchiveFile!==item.sourceArchiveFile||row.sourceOrdinal!==item.sourceOrdinal)fail('SELECTED_DATA_IDENTITY');
      const expected=kind==='IDENTITY'?item.issuedIdentitySha256:item.issuedMetadataSha256;
      if(hash(row)!==expected)fail('SELECTED_DATA_WHOLE_DRIFT');selected.set(row.questionUid,row);
    }
  }
  if(selected.size!==8)fail('SELECTED_DATA_INVENTORY');
  return selected;
}
export function verifyM2Problem21CurrentDataProjection({capturedBytes,currentBytes,kind}){
  if(!['IDENTITY','METADATA'].includes(kind))fail('DATA_KIND');
  const before=selectedRows(capturedBytes,kind),after=selectedRows(currentBytes,kind);
  if(!same([...before.entries()].sort(([a],[b])=>a.localeCompare(b)),[...after.entries()].sort(([a],[b])=>a.localeCompare(b))))fail('CAPTURE_CURRENT_SELECTED_DATA_DRIFT');
  return{status:'PASS',kind,selected:8};
}


function assertExecution(technical){
  const x=technical.execution,head='de634386a46b5fb081acd24813382a6a616f8d8b';
  if(technical.schemaVersion!=='archive-m2s2-closed-eight-current-ui-raw-v1'||
      technical.checkoutCommit!==head||technical.executionOwner!=='GITHUB_ACTIONS_CHROMIUM_CLOSED_M2S2_EIGHT_PUSH_HEAD'||
      !x||x.provider!=='GITHUB_ACTIONS'||x.repository!=='icefoxtail/AP------'||x.eventName!=='push'||
      x.ref!=='refs/heads/ops/m2-closed8-current-renderer-26fc-20261117'||
      x.headSha!==head||x.capturedHead!==head||x.eventSha!==head||x.runId!=='44023454159'||x.runAttempt!==1||
      x.workflow!=='M2 Closed Eight Current Renderer'||x.job!=='current-ui'||x.pullRequest!==null||x.baseSha!==null||
      !same(technical.checkout,{expectedCheckoutCommit:head,actualCheckoutCommit:head,githubEventCommit:head}))fail('ACTUAL_CAPTURE_EXECUTION');
  if(technical.status!=='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'||technical.mode!=='exam'||technical.problemOnlyScreenshots!==true||
      technical.solutionsOpened!==false||technical.sourceOverlay!==false||technical.sourceOverlayCount!==0||technical.sourceWrites!==0||
      technical.newFullMathematicalQa!==false||['newParentApprovals','newNativeApprovals','newMetadataApprovals','newDifficultyJudgments','newReviewPassCount','newFourSlotApprovals'].some(k=>technical[k]!==0)||
      technical.expectedLogicalCases!==16||technical.completedLogicalCases!==16||technical.results?.length!==16||
      technical.items?.length!==8||technical.screenshotArtifactCount!==18||technical.screenshotArtifacts?.length!==18||
      !same(technical.failures,[])||!same(technical.externalFontResources,[]))fail('CURRENT_UI_SCOPE');
  if(!Array.isArray(technical.servedFiles)||technical.servedFiles.length!==99||
      new Set(technical.servedFiles.map(r=>r.path)).size!==99||technical.mirroredAssets?.length!==58||
      new Set(technical.mirroredAssets.map(r=>r.path)).size!==58||technical.studentFontResources?.length!==40)fail('ACTUAL_DEPENDENCY_INVENTORY');
}
function assertBinding(binding){
  if(binding.schemaVersion!=='archive-m2-problem21-current-eight-ui-binding-v1'||
      binding.scope!=='EXACT_E017_SIX_E023_TWO_CURRENT_UI_EXISTING_ISSUED_AUTHORITY_ONLY'||
      binding.status!=='EVIDENCE_BOUND_ORDINARY_NATIVE_AND_FOUR_SLOT_GATES_REQUIRED'||
      binding.checkoutCommit!=='de634386a46b5fb081acd24813382a6a616f8d8b'||
      !same(binding.items,M2_P21_CURRENT_EIGHT_ITEMS.map(({sidecarRef,derivedRecordSha256,...i})=>i))||
      binding.records?.length!==16||binding.authorityBoundary?.originalNativeAuthorityRequired!==true||
      binding.authorityBoundary.originalQ10SeparateObserverRequired!==true||
      binding.authorityBoundary.originalE023SolutionDisplayRequired!==true||
      binding.authorityBoundary.existingSemanticHoldsUnchanged!==true||
      ['newMathematicalQa','newMetadataApprovals','newDifficultyJudgments','newNativeApprovals','newFourSlotApprovals','sourceWrites','metadataOrIdentityWrites'].some(k=>binding.authorityBoundary[k]!==0))
    fail('BINDING_AUTHORITY_SCOPE');
}
export function verifyM2Problem21CurrentUiMetadata({root,binding,technical,originalTechnical,originalObserved,reuse,mobile,readback}){
  assertBinding(binding);assertExecution(technical);
  if(!same(binding.execution,technical.execution)||!same(reuse.currentTechnicalRef,binding.currentTechnicalRef)||
      !same(reuse.originalTechnicalRef,binding.originalTechnicalRef)||!same(reuse.originalObservedRef,binding.originalObservedRef)||
      reuse.schemaVersion!=='archive-m2-closed8-current-display-reuse-v1'||
      reuse.status!=='EXACT_TEN_ORIGINAL_DISPLAY_OBSERVATIONS_REUSED_SIX_REQUIRE_SEPARATE_CURRENT_VISUAL'||
      reuse.records?.length!==16||reuse.scope?.exactScreenshotCases!==10||reuse.scope?.changedMobileCases!==6||
      mobile.schemaVersion!=='archive-independent-m2-closed8-mobile-six-visual-v1'||
      mobile.reviewer!=='GPT_M3S2_RELEASE_26FC42390A50_DIRECT_PNG_REVIEW'||
      mobile.decision!=='ACCEPT_SIX_CURRENT_MOBILE_PROBLEM_DISPLAYS_ONLY'||mobile.records?.length!==6||
      !same(mobile.technicalRef,binding.currentTechnicalRef)||mobile.authorityBoundary?.newMathematicalQa!==0||
      mobile.authorityBoundary.newNativeApprovals!==0||mobile.authorityBoundary.newFourSlotApprovals!==0||
      originalTechnical.checkoutCommit!=='e841eb07f25c9646df5bbf5b235fc9a1d815f4f7'||
      originalTechnical.results?.length!==48||originalTechnical.screenshotArtifacts?.length!==51||
      originalObserved.cases?.length!==42||originalObserved.roleDisclosure?.engineCodeAuthor!==true||
      originalObserved.roleDisclosure.independentMathQa!==false)fail('EXISTING_AND_CURRENT_VISUAL_SCOPE');
  if(readback.schemaVersion!=='archive-m2-closed8-raw-root-readback-v1'||readback.status!=='RAW_TRANSPORT_FULL_READBACK_VERIFIED'||
      !same(readback.technicalRef,binding.currentTechnicalRef)||readback.counts?.files!==19||readback.counts.pngs!==18||
      readback.counts.logicalCases!==16||readback.checks?.pngFullRemoteReadback!==18||
      readback.checks.pngSignatureAndDimensionsVerified!==true)fail('ACTUAL_RAW_PUBLICATION');
  const fonts=new Map();
  for(const font of technical.studentFontResources){
    if(font.status!==200||font.commit!==technical.checkoutCommit||!SHA256.test(font.resourceId||'')||
        !['STYLESHEET','FONT'].includes(font.kind)||fonts.has(font.resourceId))fail('CURRENT_FONT_INVENTORY');
    fonts.set(font.resourceId,font);
  }
  const shots=[],seen=new Set();let reused=0,direct=0;
  for(const result of technical.results){
    const item=M2_P21_CURRENT_EIGHT_ITEMS.find(i=>i.questionUid===result.questionUid&&i.sourceOrdinal===result.sourceOrdinal&&i.key===result.key);
    const viewport=result.viewport?.name,key=result.questionUid+'#'+viewport;
    if(!item||!['desktop','mobile'].includes(viewport)||seen.has(key)||
        !same(result.viewport,viewport==='desktop'?{name:'desktop',width:1365,height:1000}:{name:'mobile',width:390,height:844}))fail('CURRENT_CASE_IDENTITY');
    seen.add(key);
    const it=exactOne(technical.items,i=>i.questionUid===item.questionUid,'CURRENT_ITEM');
    if(it.key!==item.key||it.sourceOrdinal!==item.sourceOrdinal||it.expectedBankCount!==item.expectedQuestionCount||
        it.imageBinding!=='QUESTION_IMAGE'||it.problemPayloadSha256!==item.problemPayloadSha256||
        it.problemFieldsSha256!==item.problemFieldsSha256||it.presentationSha256!==item.presentationSha256||
        !same(it.sourceRef,item.currentSourceRef)||!same(it.assetRef,item.currentAssetRef)||
        !same(result.sourceRef,item.currentSourceRef)||!same(result.assetRef,item.currentAssetRef))fail('CURRENT_CASE_INPUT');
    const t=result.technical,g=result.geometry,f=t?.fontReadiness;
    if(result.status!=='PASS'||result.visualReview!=='PENDING'||t?.mode!=='exam'||t.questions!==item.expectedQuestionCount||
        t.readiness!=='RENDER_READY'||t.imagesComplete!==true||t.mathErrors!==0||t.unrenderedMath!==0||
        t.mathJaxSource!=='local'||t.solutionNodes!==0||g?.imageInsideQuestion!==true||g.naturalWidth<=0||g.naturalHeight<=0||
        Number(String(g.questionNumber).match(/^\d+/)?.[0])!==item.sourceOrdinal||
        [result.pageErrors,result.requestFailures,result.externalRequests].some(x=>!same(x,[]))||
        f?.status!=='loaded'||f.family!=='Nanum Myeongjo'||f.weights?.length!==3||
        f.weights.some((w,i)=>w.weight!==[400,700,800][i]||w.allLoaded!==true||w.checked!==true||w.loadedFaces<1)||
        !Array.isArray(t.fontResourceIds)||!t.fontResourceIds.length||new Set(t.fontResourceIds).size!==t.fontResourceIds.length||
        t.fontResourceIds.some(id=>!fonts.has(id)))fail('CURRENT_CASE_READINESS');
    const bound=exactOne(binding.records,r=>r.questionUid===item.questionUid&&r.viewport?.name===viewport,'BOUND_CASE');
    if(bound.key!==item.key||bound.sourceOrdinal!==item.sourceOrdinal||!same(bound.viewport,result.viewport)||
        bound.currentCaptureSha256!==hash(result.capture)||bound.currentGeometrySha256!==hash(result.geometry))fail('BOUND_CAPTURE');
    const r=exactOne(reuse.records,r=>r.questionUid===item.questionUid&&r.viewport===viewport,'REUSE_CASE');
    const changed=item.key.startsWith('E017')&&viewport==='mobile';
    if(changed){
      const v=exactOne(mobile.records,r=>r.questionUid===item.questionUid&&r.viewport?.name===viewport,'MOBILE_VISUAL');
      if(bound.observationMode!=='CURRENT_INDEPENDENT_MOBILE_SIX'||!same(bound.observationRef,binding.currentMobileVisualRef)||
          bound.observationRecordSha256!==hash(v)||v.sourceOrdinal!==item.sourceOrdinal||v.key!==item.key||v.surface!=='PROBLEM'||
          v.decision!=='ACCEPT_PROBLEM_DISPLAY_ONLY'||v.captureSha256!==hash(result.capture)||v.geometrySha256!==hash(result.geometry)||
          !same(v.sourceRef,item.currentSourceRef)||!same(v.assetRef,item.currentAssetRef)||r.newVisualRequired!==true||
          ['questionNumberVisible','stemVisible','allDisplayedFigurePartsContained','labelsReadable','readableAtCapturedMobileScale'].some(k=>v.displayObservations?.[k]!==true)||
          ['unintendedDuplicateFigureObserved','croppedContentObserved','overlappingContentObserved','solutionOrAnswerPanelObserved'].some(k=>v.displayObservations?.[k]!==false)||
          v.screenshots?.length!==result.screenshots.length||v.screenshots.some(s=>s.actualDirectVisualInspection!==true||
            s.decision!=='ACCEPT_PROBLEM_DISPLAY_ONLY'))fail('DIRECT_CURRENT_MOBILE_VISUAL');
      direct++;
    }else{
      const old=exactOne(originalTechnical.results,r=>r.questionUid===item.questionUid&&r.viewport?.name===viewport,'ORIGINAL_CASE');
      const obs=exactOne(originalObserved.cases,r=>r.questionUid===item.questionUid&&r.viewport===viewport,'ORIGINAL_OBSERVATION');
      // This immutable transport case carries the original observation-record
      // digest. It is not a digest of the transport case that contains it.
      if(!exact(obs,['key','questionUid','sourceOrdinal','viewport','decision','observationRecordSha256','screenshots'])||
          obs.key!==item.key||obs.sourceOrdinal!==item.sourceOrdinal||!SHA256.test(obs.observationRecordSha256||'')||
          bound.observationMode!=='ORIGINAL_OBSERVATION_SAME_PNG_AND_GEOMETRY'||!same(bound.observationRef,binding.originalObservedRef)||
          bound.observationRecordSha256!==obs.observationRecordSha256||obs.decision!=='DISPLAY_CONTINUITY_ACCEPTABLE'||
          !same(obs.screenshots,old.screenshots)||!same(result.screenshots,old.screenshots)||!same(result.geometry,old.geometry)||
          r.oldObservationReused!==true||r.newVisualRequired!==false||r.screenshotsWholeExact!==true||r.geometryWholeExact!==true||
          r.originalObservationRecordSha256!==obs.observationRecordSha256||r.oldScreenshotInventorySha256!==hash(old.screenshots)||
          r.currentScreenshotInventorySha256!==hash(result.screenshots))fail('ORIGINAL_SAME_PNG_OBSERVATION_REUSE');
      reused++;
    }
    validateM2ProblemRendererUiTileEvidence({root},result,{questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,viewport,
      screenshots:result.screenshots,decision:'PASS',conditionsAndLabelsPreserved:true,legible:true,notClipped:true,completeProblemCoverage:true},item.key);
    if(bound.screenshots?.length!==result.screenshots.length)fail('BOUND_PNG_COUNT');
    for(const shot of result.screenshots){
      const p=exactOne(bound.screenshots,s=>s.tileIndex===shot.tileIndex,'BOUND_PNG'),f=exactOne(readback.files,s=>s.path===shot.path,'PUBLISHED_PNG');
      if(p.path!==shot.path||p.sha256!==shot.sha256||p.bytes!==shot.bytes||p.width!==f.dimensions?.width||p.height!==f.dimensions?.height||
          p.immutableRef.commit!==binding.currentTechnicalRef.commit||
          p.immutableRef.path!==path.posix.dirname(binding.currentTechnicalRef.path)+'/'+shot.path||
          p.immutableRef.gitBlobSha1!==f.gitBlobSha1||p.immutableRef.sha256!==shot.sha256||p.immutableRef.bytes!==shot.bytes||
          f.captureCaseCompleted!==true)fail('BOUND_PNG_REF');
      shots.push(shot);
    }
  }
  const artifact=r=>({path:r.path,sha256:r.sha256,bytes:r.bytes}),sort=xs=>xs.slice().sort((a,b)=>a.path.localeCompare(b.path));
  if(seen.size!==16||reused!==10||direct!==6||shots.length!==18||new Set(shots.map(s=>s.path)).size!==18||
      !same(sort(shots.map(artifact)),sort(technical.screenshotArtifacts)))fail('FULL_CURRENT_16_18_INVENTORY');
  return{status:'PASS',logicalCases:16,pngs:18,reusedOriginalVisual:10,directCurrentVisual:6,newApprovals:0};
}


function png(bytes,pin){
  if(bytes.length<24||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||
      bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)!==pin.width||bytes.readUInt32BE(20)!==pin.height)
    fail('PNG_ACTUAL_BYTES_AND_DIMENSIONS');
}
export function verifyM2Problem21CurrentSvgProjection({capturedBytes,currentBytes}){
  const before=SvgIndex.parseIndex(capturedBytes),after=SvgIndex.parseIndex(currentBytes),rows=[];
  for(const item of M2_P21_CURRENT_EIGHT_ITEMS){
    const old=SvgIndex.selectEntries(before,[item.currentAssetRef]),cur=SvgIndex.selectEntries(after,[item.currentAssetRef]);
    // The actual current Chrome capture had no index entry for these eight.
    // The only permitted addition is the separately reviewed generator result
    // carried by this fixed table, including every field and both-role lookup.
    if(old.length!==0||cur.length>1||cur.length===1&&(cur[0].visualRole!=='problem'||
        hash(cur[0])!==item.derivedRecordSha256||cur[0].svgSha256!=='sha256:'+item.currentAssetRef.sha256||
        cur[0].gitBlobSha!==item.currentAssetRef.gitBlobSha1))fail('CLOSED_DERIVED_SVG_RECORD');
    rows.push({questionUid:item.questionUid,capturedRecords:0,currentRecords:cur.length,
      currentRecordSha256:cur.length?hash(cur[0]):null});
  }
  return{status:'PASS',selected:8,rows};
}
const bases=new Map();
function headOf(root){
  const head=git(root,['rev-parse','--verify','HEAD^{commit}']).toString().trim();
  if(!SHA1.test(head))fail('HEAD_REQUIRED');return head;
}
function runtimeInventory(root){
  let directory=root;
  for(const part of ['archive','data','meta-foundation','runtime']){
    directory=path.join(directory,part);let st;
    try{st=fs.lstatSync(directory);}catch{fail('RUNTIME_DIRECTORY');}
    if(st.isSymbolicLink()||!st.isDirectory())fail('RUNTIME_DIRECTORY');
  }
  return fs.readdirSync(directory).filter(name=>name.endsWith('.json')).sort();
}
function identityRecordsDigest(records){
  if(!Array.isArray(records))fail('CALLER_IDENTITY_RECORDS');
  const uids=new Set(),joins=new Set();
  for(const row of records){
    if(!row||typeof row.questionUid!=='string'||uids.has(row.questionUid))fail('CALLER_IDENTITY_UID_NOT_UNIQUE');
    const join=stable([row.sourceArchiveFile,row.sourceOrdinal]);
    if(joins.has(join))fail('CALLER_IDENTITY_JOIN_NOT_UNIQUE');
    uids.add(row.questionUid);joins.add(join);
  }
  return hash([...records].sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en')));
}
function assertCallerIdentityMap(value,ctx){
  if(value===undefined)return;
  if(value instanceof Map&&Object.getPrototypeOf(value)===Map.prototype){
    const records=[];
    for(const [uid,row]of value){
      if(!row||uid!==row.questionUid)fail('CALLER_IDENTITY_MAP_KEY');
      records.push(row);
    }
    if(identityRecordsDigest(records)!==ctx.identityRecordsSha256)fail('CALLER_IDENTITY_MAP');
    return;
  }
  if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype||
      identityRecordsDigest(value.records)!==ctx.identityRecordsSha256||hash(value)!==ctx.identityDocumentSha256)
    fail('CALLER_IDENTITY_DOCUMENT');
}
function assertLive(ctx){
  if(headOf(ctx.root)!==ctx.head)fail('HEAD_CHANGED_DURING_VALIDATION');
  if(!Array.isArray(ctx.runtimeFiles)||!same(runtimeInventory(ctx.root),ctx.runtimeFiles))fail('RUNTIME_JSON_INVENTORY_CHANGED');
  for(const ref of ctx.liveRefs.values())if(!same(fileDigest(ctx.root,ref.path),ref))fail('LIVE_INPUT_CHANGED_DURING_VALIDATION');
}
function fixedDocument(ctx,ref){
  const bytes=immutable(ctx.root,ref);live(ctx,ref);return parseJson(bytes);
}
function runtimeRows(ctx,metadata){
  ctx.runtimeFiles=Object.freeze(runtimeInventory(ctx.root));
  const selected=new Map();
  for(const name of ctx.runtimeFiles){
    const relative='archive/data/meta-foundation/runtime/'+name;
    const raw=fs.readFileSync(localPath(ctx.root,relative)),doc=parseJson(raw);
    remember(ctx,{path:relative,sha256:sha(raw),bytes:raw.length});
    if(doc.records===undefined)continue;
    if(!Array.isArray(doc.records))fail('RUNTIME_RECORDS');
    for(const row of doc.records){
      const item=M2_P21_CURRENT_EIGHT_ITEMS.find(i=>i.questionUid===row.questionUid);
      if(!item)continue;
      if(selected.has(item.questionUid)||doc.status!=='ACTIVE'||doc.packId!==metadata.get(item.questionUid).metaFoundationPackId||
          row.sourceArchiveFile!==item.sourceArchiveFile||row.sourceOrdinal!==item.sourceOrdinal||
          hash(row)!==item.issuedRuntimeSha256)fail('CURRENT_RUNTIME_UNIQUE_OWNER_AND_WHOLE_ROW');
      selected.set(item.questionUid,row);
    }
  }
  if(selected.size!==8)fail('CURRENT_RUNTIME_EIGHT_REQUIRED');
  return selected;
}
function buildBase(root,head){
  const ctx={root,head,liveRefs:new Map()};
  git(root,['merge-base','--is-ancestor',M2_P21_CURRENT_EIGHT_BINDING_REF.commit,head]);
  const binding=fixedDocument(ctx,M2_P21_CURRENT_EIGHT_BINDING_REF);
  assertBinding(binding);
  const documents={};
  for(const key of ['currentTechnicalRef','originalTechnicalRef','originalObservedRef','originalQ10IndependentRef',
      'currentReuseRef','currentMobileVisualRef','rootRawReadbackRef','sourcePreservationRef'])
    documents[key]=fixedDocument(ctx,binding[key]);
  const technical=documents.currentTechnicalRef;
  verifyM2Problem21CurrentUiMetadata({root,binding,technical,originalTechnical:documents.originalTechnicalRef,
    originalObserved:documents.originalObservedRef,reuse:documents.currentReuseRef,mobile:documents.currentMobileVisualRef,
    readback:documents.rootRawReadbackRef});
  for(const r of binding.records)for(const shot of r.screenshots){
    const raw=immutable(root,shot.immutableRef);live(ctx,shot.immutableRef);png(raw,shot);
  }
  // Every real capture dependency is authenticated at commit:path, then compared
  // with the current file. Only generated MD/ID and the named SVG projection
  // use selected-record continuity; all renderer/font/source/asset bytes stay exact.
  for(const key of ['checkerRef','manifestRef','captureHelperRef','fontLicenseRef']){
    immutable(root,technical[key]);live(ctx,technical[key]);
  }
  let metadata;
  for(const ref of technical.servedFiles){
    if(ref.commit!==technical.checkoutCommit)fail('SERVED_CAPTURE_COMMIT');
    const raw=immutable(root,ref);
    if(ref.path===MD){
      const current=fs.readFileSync(localPath(root,MD));
      verifyM2Problem21CurrentDataProjection({capturedBytes:raw,currentBytes:current,kind:'METADATA'});
      metadata=selectedRows(current,'METADATA');remember(ctx,{path:MD,sha256:sha(current),bytes:current.length});
    }else if(ref.path===SVG){
      const current=fs.readFileSync(localPath(root,SVG));
      verifyM2Problem21CurrentSvgProjection({capturedBytes:raw,currentBytes:current});
      remember(ctx,{path:SVG,sha256:sha(current),bytes:current.length});
    }else if(!isRenderEngineFile(ref.path))live(ctx,ref);
  }
  if(!metadata||!ctx.liveRefs.has(SVG))fail('SERVED_SELECTED_DATA_REQUIRED');
  if(technical.identityRef.path!==ID||technical.identityRef.commit!==technical.checkoutCommit)fail('CAPTURE_IDENTITY_REF');
  const capturedId=immutable(root,technical.identityRef),currentId=fs.readFileSync(localPath(root,ID));
  verifyM2Problem21CurrentDataProjection({capturedBytes:capturedId,currentBytes:currentId,kind:'IDENTITY'});
  const identities=selectedRows(currentId,'IDENTITY'),identityDocument=parseJson(currentId);
  ctx.identityDocumentSha256=hash(identityDocument);
  ctx.identityRecordsSha256=identityRecordsDigest(identityDocument.records);
  remember(ctx,{path:ID,sha256:sha(currentId),bytes:currentId.length});
  for(const full of technical.studentFontResources){
    const ref=refOnly(full);immutable(root,ref);live(ctx,ref);
  }
  for(const ref of technical.mirroredAssets){
    if(ref.commit!==technical.checkoutCommit)fail('MIRRORED_CAPTURE_COMMIT');
    immutable(root,ref);live(ctx,ref);
  }
  const sources=new Map(),receipts=new Map(),bindings=new Map();
  for(const item of M2_P21_CURRENT_EIGHT_ITEMS){
    if(!sources.has(item.sourceArchiveFile)){
      const oldBytes=immutable(root,item.issuedSourceRef),currentBytes=immutable(root,item.currentSourceRef);
      live(ctx,item.currentSourceRef);
      sources.set(item.sourceArchiveFile,{...sourcePair(item,oldBytes,currentBytes),oldBytes,currentBytes});
      const receipt=fixedDocument(ctx,item.receiptRef),issuedBinding=fixedDocument(ctx,item.sourceReviewBindingRef);
      if(receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||receipt.metadataRegistrationStatus!=='REGISTERED'||
          receipt.sourceArchiveFile!==item.sourceArchiveFile||receipt.expectedQuestionCount!==item.expectedQuestionCount||
          receipt.sourceBlobSha1!==item.issuedSourceRef.gitBlobSha1||receipt.sourceRawSha256!==item.issuedSourceRef.sha256||
          item.receiptRef.path!=='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+receipt.requestId+'.json'||
          issuedBinding.requestId!==receipt.requestId||issuedBinding.sourceArchiveFile!==item.sourceArchiveFile||
          issuedBinding.sourceBlobSha1!==receipt.sourceBlobSha1||issuedBinding.sourceRawSha256!==receipt.sourceRawSha256||
          issuedBinding.requestSnapshot?.expectedSourceBlobSha1!==receipt.sourceBlobSha1||
          !same(issuedBinding.requestSnapshot.approval,receipt.approval))fail('ORIGINAL_ISSUED_RECEIPT_AND_REQUEST');
      receipts.set(item.sourceArchiveFile,receipt);bindings.set(item.sourceArchiveFile,issuedBinding);
    }
    immutable(root,item.currentAssetRef);live(ctx,item.currentAssetRef);
    const receipt=receipts.get(item.sourceArchiveFile);
    for(const [key,wanted] of [['appliedRecords',item.issuedMetadataSha256],['appliedIdentityRecords',item.issuedIdentitySha256],
        ['runtimeRecords',item.issuedRuntimeSha256]]){
      const row=exactOne(receipt[key],r=>r.questionUid===item.questionUid&&r.sourceOrdinal===item.sourceOrdinal,'ISSUED_SELECTED_UNIQUE');
      if(row.sourceArchiveFile!==item.sourceArchiveFile||hash(row)!==wanted)fail('ISSUED_SELECTED_WHOLE');
    }
  }
  const runtimes=runtimeRows(ctx,metadata);
  Object.assign(ctx,{binding,technical,sources,receipts,bindings,metadata,identities,runtimes});
  assertLive(ctx);return ctx;
}
function getBase(root,head){
  const prior=bases.get(root);
  if(prior&&prior.head===head){
    try{assertLive(prior);return prior;}catch{bases.delete(root);}
  }
  const ctx=buildBase(root,head);bases.set(root,ctx);return ctx;
}
function authenticate(args){
  const n=args.nativeSource;
  if(!n||typeof n.root!=='string')return null;
  const item=M2_P21_CURRENT_EIGHT_ITEMS.find(i=>i.questionUid===args.identity?.questionUid);
  if(!item)return null;
  const source=args.source??args.receipt?.sourceArchiveFile,ordinal=args.ordinal;
  if(source!==item.sourceArchiveFile||ordinal!==item.sourceOrdinal)fail('CLOSED_UID_SOURCE_ORDINAL');
  if([TOKEN_KEY,'e015IssuedSourceContinuation','issuedRpmHistoryContext','issuedSolutionRpmHistoryContext'].some(k=>Object.hasOwn(n,k)))
    fail('MIXED_PRIVATE_CONTINUATION');
  const root=fs.realpathSync(n.root),sidecarPath=localPath(root,item.sidecarRef.path,true);
  if(!sidecarPath)return null;
  const sidecarRaw=fs.readFileSync(sidecarPath),sidecar=parseJson(sidecarRaw);
  if(sidecar.schemaVersion!==M2_P21_CURRENT_EIGHT_SCHEMA)return null;
  checked(sidecarRaw,item.sidecarRef);
  if(sidecar.questionUid!==item.questionUid||sidecar.sourceOrdinal!==ordinal||sidecar.sourceArchiveFile!==source||
      sidecar.scope!=='EXISTING_VECTOR_ONLY'||sidecar.newFourSlotApprovals!==0||sidecar.newMathematicalQa!==false||
      !same(sidecar.currentUiBindingRef,M2_P21_CURRENT_EIGHT_BINDING_REF))fail('SIDECAR_CLOSED_OPT_IN');
  const base=getBase(root,headOf(root)),pair=base.sources.get(source),receipt=base.receipts.get(source);
  if(!Buffer.isBuffer(n.bytes)||n.blobSha1!==item.currentSourceRef.gitBlobSha1||!n.bytes.equals(pair.currentBytes)||
      !same(n.bank,pair.currentBank)||hash(args.question)!==item.wholeQuestionSha256||
      !same(args.question,pair.currentBank[ordinal-1])||!same(args.current,base.metadata.get(item.questionUid))||
      !same(args.identity,base.identities.get(item.questionUid))||n.runtimeStatus!=='ACTIVE'||
      !same(n.runtimeRecord,base.runtimes.get(item.questionUid))||
      args.receipt!==undefined&&!same(args.receipt,receipt))fail('ACTUAL_SELECTED_NATIVE_INPUTS');
  assertCallerIdentityMap(n.identityMap,base);
  const ctx={...base,item,receipt,issuedBinding:base.bindings.get(source),oldBytes:pair.oldBytes,oldBank:pair.oldBank,
    current:structuredClone(args.current),identity:structuredClone(args.identity),runtime:structuredClone(n.runtimeRecord),
    liveRefs:new Map(base.liveRefs)};
  remember(ctx,{path:item.sidecarRef.path,sha256:item.sidecarRef.sha256,bytes:item.sidecarRef.bytes});
  assertLive(ctx);return ctx;
}
export function assertM2Problem21CurrentUiLeaf({context,nativeSource,current,identity,source,ordinal,question,receipt}){
  const ctx=context&&contexts.get(context);
  if(!ctx||source!==ctx.item.sourceArchiveFile||ordinal!==ctx.item.sourceOrdinal||identity?.questionUid!==ctx.item.questionUid||
      !nativeSource||fs.realpathSync(nativeSource.root)!==ctx.root||nativeSource[TOKEN_KEY]!==context||
      nativeSource.blobSha1!==ctx.item.issuedSourceRef.gitBlobSha1||!Buffer.isBuffer(nativeSource.bytes)||!nativeSource.bytes.equals(ctx.oldBytes)||
      !same(nativeSource.bank,ctx.oldBank)||!same(question,ctx.oldBank[ordinal-1])||!same(current,ctx.current)||
      !same(identity,ctx.identity)||nativeSource.runtimeStatus!=='ACTIVE'||!same(nativeSource.runtimeRecord,ctx.runtime)||
      receipt!==undefined&&!same(receipt,ctx.receipt))fail('PRIVATE_SELECTED_LEAF');
  assertCallerIdentityMap(nativeSource.identityMap,ctx);
  assertLive(ctx);return true;
}
export function readM2Problem21CurrentUiContinuation({context,root,request,patch,current,question,relativePath}){
  if(context===undefined)return null;
  const ctx=context&&contexts.get(context);
  if(!ctx||fs.realpathSync(root)!==ctx.root||relativePath!==ctx.item.currentSourceRef.path||
      !same(request,ctx.issuedBinding.requestSnapshot)||!same(current,ctx.current)||
      patch?.questionUid!==ctx.item.questionUid||patch?.sourceOrdinal!==ctx.item.sourceOrdinal||
      !same(patch,ctx.issuedBinding.requestSnapshot.items.find(i=>i.questionUid===ctx.item.questionUid))||
      !same(question,ctx.oldBank[ctx.item.sourceOrdinal-1]))fail('PRIVATE_ORIGINAL_P21_READER');
  assertLive(ctx);return Buffer.from(ctx.oldBytes);
}
// The ordinary RPM leaf replays the issued course proof after P21/E023 have
// authenticated and removed only their display options. Keep the real current
// file bound as well; the bytes returned here are explicitly the issued view.
// This cannot mint a token, normalize a question, or grant course authority.
export function readM2Problem21CurrentRpmSource({context,root,request,patch,metadata,final,issuedProof,relativePath,currentSourceBytes}){
  if(context===undefined)return null;
  const ctx=context&&contexts.get(context);
  if(!ctx||fs.realpathSync(root)!==ctx.root||relativePath!==ctx.item.currentSourceRef.path||
      ctx.item.issuedSourceRef.path!==relativePath||!same(request,ctx.issuedBinding.requestSnapshot)||
      request.expectedSourceBlobSha1!==ctx.item.issuedSourceRef.gitBlobSha1||
      patch?.questionUid!==ctx.item.questionUid||patch?.sourceOrdinal!==ctx.item.sourceOrdinal)
    fail('PRIVATE_ISSUED_RPM_SOURCE_CONTEXT');
  const original=exactOne(ctx.issuedBinding.requestSnapshot.items,
    row=>row.questionUid===ctx.item.questionUid&&row.sourceOrdinal===ctx.item.sourceOrdinal,'PRIVATE_ISSUED_RPM_ITEM');
  const normalized=structuredClone(original);
  if(!normalized.sourceReview?.m2ProblemRenderer21Continuity||!normalized.targetParentRef?.nativeRpmCourseTransport)
    fail('PRIVATE_ISSUED_RPM_OPTIONS');
  delete normalized.sourceReview.m2ProblemRenderer21Continuity;
  if(Object.hasOwn(normalized.sourceReview,'e023SolutionDisplayContinuity')){
    if(ctx.item.sourceArchiveFile!=='original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js')
      fail('PRIVATE_ISSUED_RPM_COMPANION');
    delete normalized.sourceReview.e023SolutionDisplayContinuity;
  }
  if(!same(patch,normalized)||!same(final,ctx.current)||!same(metadata,{...ctx.current,...original.before}))
    fail('PRIVATE_ISSUED_RPM_NORMALIZED_PATCH');
  const repair=exactOne(ctx.receipt.fingerprintRepairs,
    row=>row.questionUid===ctx.item.questionUid&&row.sourceOrdinal===ctx.item.sourceOrdinal,'PRIVATE_ISSUED_RPM_REPAIR');
  const expected=repair.sourceReview?.nativeRpmCourseTransport;
  if(!expected||!issuedProof||!same(issuedProof,expected)||
      expected.questionUid!==ctx.item.questionUid||expected.sourceOrdinal!==ctx.item.sourceOrdinal||
      expected.currentSource?.path!==relativePath||expected.currentSource?.gitBlobSha1!==ctx.item.issuedSourceRef.gitBlobSha1||
      expected.currentSource?.sha256!==ctx.item.issuedSourceRef.sha256)
    fail('PRIVATE_ISSUED_RPM_PROOF');
  assertLive(ctx);
  const actual=currentSourceBytes===undefined?fs.readFileSync(localPath(ctx.root,relativePath)):currentSourceBytes;
  if(!Buffer.isBuffer(actual))fail('PRIVATE_ISSUED_RPM_CURRENT_BYTES');
  checked(actual,ctx.item.currentSourceRef);
  if(!actual.equals(ctx.sources.get(ctx.item.sourceArchiveFile).currentBytes))fail('PRIVATE_ISSUED_RPM_CURRENT_BYTES');
  checked(ctx.oldBytes,ctx.item.issuedSourceRef);
  return Buffer.from(ctx.oldBytes);
}
function replay(args,expected){
  const ctx=authenticate(args);if(!ctx)return null;
  if(typeof args.revalidateLeaf!=='function')fail('ORDINARY_NATIVE_CALLBACK');
  const token=Object.freeze(Object.create(null));contexts.set(token,ctx);
  try{
    const bank=structuredClone(ctx.oldBank),nativeSource={...args.nativeSource,bytes:Buffer.from(ctx.oldBytes),
      blobSha1:ctx.item.issuedSourceRef.gitBlobSha1,bank,[TOKEN_KEY]:token};
    const result=args.revalidateLeaf({nativeSource,question:bank[ctx.item.sourceOrdinal-1]});
    if(result!==expected(ctx))fail('ORDINARY_NATIVE_VALIDATION_REQUIRED');
    assertCallerIdentityMap(nativeSource.identityMap,ctx);
    assertLive(ctx);return result;
  }finally{contexts.delete(token);}
}
export function replayM2Problem21CurrentUiContinuation(args){return replay(args,ctx=>ctx.item.receiptRef.path);}
export function replayM2Problem21CurrentUiRebind(args){return replay(args,()=>true);}
