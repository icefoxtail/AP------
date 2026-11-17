import {readM2Problem21CurrentRpmSource} from './m2-problem21-current-ui-continuity.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {buildReviewedSourceBinding, reviewedSourceBindingPath} from './reviewed-source-binding.mjs';

export const M2_NATIVE_RPM_COURSE_SCHEMA = 'archive-m2-native-rpm-course-transport-v1';
const NATIVE_COMMIT = 'c28641f67d91bfb27352b11faaef4552f46c45be';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const ORIGINAL_RPM = Object.freeze({
  "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
  "path": "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json",
  "gitBlobSha1": "b473778736362698a70d213b68e203218fc64d59",
  "sha256": "924ae2c0b02dbf29784551eaa90c63e27a5d6de39ab5cb65b563f59e6e2c0c39",
  "bytes": 156288
});
export const M2_NATIVE_RPM_COURSE_ITEMS = Object.freeze([
  {
    "questionUid": "qid_v1_fc40513f50e6014b508eb1e8061f135682b5a065fbf336fa755918de6c97ccf7",
    "sourceOrdinal": 1,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "86271332bb90c4f38aba92d799d1813f6c4a58c88377e1ee1e49e3e7d69ad878",
    "rpmRecordId": "M2-RPM-062",
    "rpmRecordSha256": "08cb70092be909d177e64a68fa1cf5f3cc30c3ebebd1fe064eae8f1feb81861f"
  },
  {
    "questionUid": "qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9",
    "sourceOrdinal": 2,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "7965970ce20afa01019e35d813be95a040e2008a4dbcc308955a5ca612f82ac3",
    "rpmRecordId": "M2-RPM-070",
    "rpmRecordSha256": "d183adab22c1a6692fc5eb66cdc5c564d86d10ad22fb45ffb5f3e7c0ff1e09bc"
  },
  {
    "questionUid": "qid_v1_f867386595af4f85ce29e7ce9d88ded95c6ad8c288eceb582812d0b4b8d171f7",
    "sourceOrdinal": 3,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "e0898b07fd8f895a9efc1f2d9b16ebe8fe1b5a0e6a5d378ec9f59e1254d014ea",
    "rpmRecordId": "M2-RPM-065",
    "rpmRecordSha256": "de56b84d73d3ada78da2bd48beae335d2247758d46253e91bf6ded7da9cf2eda"
  },
  {
    "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
    "sourceOrdinal": 4,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "3749d8bb211c7c2b80d1964be9e94fa1eeffb4e2bc286f80e0a0c86542bc821c",
    "rpmRecordId": "M2-RPM-066",
    "rpmRecordSha256": "61d87529d4a56670a8b15558c6a42f0f3b6607c3f18373e709d2e3cdab60f150"
  },
  {
    "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
    "sourceOrdinal": 5,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "c83cd87fc3f203806106d0bf13c4e6c975c17df3f0cc008e1edb695cc5001c25",
    "rpmRecordId": "M2-RPM-064",
    "rpmRecordSha256": "06025308ec93c184214b92bbc12ab6c338117806ffacc442656209b12d80c2e4"
  },
  {
    "questionUid": "qid_v1_56134964da05fe0b1f0c03da443c3f5b954bf9479a9ee8b7250ff9363f2db98d",
    "sourceOrdinal": 7,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "360ac76bec80ee42f18dd95e7718d4a3af18fff740af3a6cb87bf4cc7baec5f6",
    "rpmRecordId": "M2-RPM-065",
    "rpmRecordSha256": "de56b84d73d3ada78da2bd48beae335d2247758d46253e91bf6ded7da9cf2eda"
  },
  {
    "questionUid": "qid_v1_76f0b67bec2a21754fd8f036418aae1956e62d1f19d0f60bf9acd93ba2606cc8",
    "sourceOrdinal": 8,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "ad4d19ed95ae7967a4b57be92353b2e1820adc0bef7a41733893fd7f871b49ab",
    "rpmRecordId": "M2-RPM-072",
    "rpmRecordSha256": "d973400f42104c858cb2b0fa72d2c268dae1b0c720d452dae1a6d24f57c6bb30"
  },
  {
    "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
    "sourceOrdinal": 9,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "80bcfe4ec316b2c996fa8845ed6d46a321d912d3c515e94d457d908f75cbdb65",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "questionUid": "qid_v1_204dd3224ff8354e6989356a1f9151983e1bb875d1705e1aaf2d884aeafcfbc9",
    "sourceOrdinal": 10,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "df2acddea22312174f38ebaa56f27f7b7b82bddcec6eb65829678a086cff5795",
    "rpmRecordId": "M2-RPM-082",
    "rpmRecordSha256": "53552be92695194f997e1a9ad133e662bdada15385b5d3bc928fc2d45bc6c14b"
  },
  {
    "questionUid": "qid_v1_9a1c71c7ed648940f63646fd8f2062e131ad914bdf109362eef3aef1a880d7f2",
    "sourceOrdinal": 12,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "1ce8ca7818f31919fee81464c660ab6ca39bbf84fec16665ec4f0129a8216cd8",
    "rpmRecordId": "M2-RPM-079",
    "rpmRecordSha256": "95c49f8258a78b00ad98ecada057be6641695b349bb6fd7792f0ad2533aaa607"
  },
  {
    "questionUid": "qid_v1_f609573d96834aca9d5a21693e0ac6150be59ed77721e3cccc0005ed5f6e89fa",
    "sourceOrdinal": 17,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "a5756f39697b09d94d9da5321936f50e44d8ddf408636dbdf83d5c7cd4ddcd8c",
    "rpmRecordId": "M2-RPM-089",
    "rpmRecordSha256": "696e996d527e8f04da2e17cc69f8c36e4835f4e4323004c19c40a5a99a341f4a"
  },
  {
    "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
    "sourceOrdinal": 18,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "9ed3bb1408feab1658d27d57899a536b253c458e8a166b562bbf9d83ced425f2",
    "rpmRecordId": "M2-RPM-084",
    "rpmRecordSha256": "88a55efa1b006443d0615a7f054c9206564dd16441133687a17dbfb703b1c35a"
  },
  {
    "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
    "sourceOrdinal": 20,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "a9436960b9171946206ee886157397c6d09dc9cfb334abeea1ff8bb71cc49617",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "questionUid": "qid_v1_8d5adb66553e5a1bd552ef118800a9e9daa315723365055741bff1a87eafa26d",
    "sourceOrdinal": 21,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "7140b236e8754c7cf3e514a928ea86d418f472276f54d540b576da84e8015d66",
    "rpmRecordId": "M2-RPM-070",
    "rpmRecordSha256": "d183adab22c1a6692fc5eb66cdc5c564d86d10ad22fb45ffb5f3e7c0ff1e09bc"
  },
  {
    "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
    "sourceOrdinal": 23,
    "sourceArchiveFile": "original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "expectedQuestionCount": 23,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E017/review.json",
    "reviewSha256": "f5d321f7ad0b43045075ea06e6e573f89641507df89c40bc1d89915c46c956f0",
    "nativeItemSha256": "4156e656a08d598b22731f6cd4f9b55b0b8b2916f499fadbc0150a8fab6e8c76",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "questionUid": "qid_v1_848012b5f539fa1f58a6358ff0c5aaea032b0acc9c134b9f91cba0b749a1e303",
    "sourceOrdinal": 4,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "efe999e3e1377497a5ed98daa1c0f432efea9df8301cec9b33a9971674f39932",
    "rpmRecordId": "M2-RPM-100",
    "rpmRecordSha256": "00da97789e5be6aab21d39f61cdd23559e1f381fe1dd7f042bd76a27a9fa3159"
  },
  {
    "questionUid": "qid_v1_8b5f4eefcea6be04066923235f2898bf46c052a4994adbd1161554f69511b5e4",
    "sourceOrdinal": 5,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "9093d79fdcc78c108d5d9b56bbaefdacf22accff2028e747a374cc20606bf448",
    "rpmRecordId": "M2-RPM-105",
    "rpmRecordSha256": "9e7f5042d99c8c417a43f3d3f822aa6a5e496391af6410541ed16bcf88a5bf36"
  },
  {
    "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
    "sourceOrdinal": 6,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "db3c4611f9a7a2804e2c63dd6ce90c0273e5351404dd3ed20b787959c657cc50",
    "rpmRecordId": "M2-RPM-101",
    "rpmRecordSha256": "6e3cde43873a5cdc4f7c6f4b09bcad9fc3781dc2ca29de2e4ececea4d5a779e9"
  },
  {
    "questionUid": "qid_v1_ac6ea5f6d4266e383b7db2063dbeb68348852d5420e02746ba76e62781138ede",
    "sourceOrdinal": 8,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "86dda94f73ee282619b34ab16721c708d10844c7cb900206f35da1117bb818c7",
    "rpmRecordId": "M2-RPM-086",
    "rpmRecordSha256": "c7c66090e977e9231ee8cd88a9db76ac5e75db7c4a5fec2b4364e56794ed9591"
  },
  {
    "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
    "sourceOrdinal": 10,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "59918ae28343619e565faac2198af9114431edef30bf1f415c3b3c4353aab9d9",
    "rpmRecordId": "M2-RPM-105",
    "rpmRecordSha256": "9e7f5042d99c8c417a43f3d3f822aa6a5e496391af6410541ed16bcf88a5bf36"
  },
  {
    "questionUid": "qid_v1_3cd4b66acdc9f4b61132f18d6577c7cc9166137ad5135988bb892f15d3b94643",
    "sourceOrdinal": 19,
    "sourceArchiveFile": "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "expectedQuestionCount": 24,
    "reviewPath": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "reviewSha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "nativeItemSha256": "c4823d53747eb05d1c491b113d313a5d09118d8403f25f509c0a9030f4cb869d",
    "rpmRecordId": "M2-RPM-117",
    "rpmRecordSha256": "b1f8df237ce26a33e22d41cef78270445f0bef15fa6dd11cf0dea82a9c611a13"
  }
].map(Object.freeze));

const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const COURSE = 'M2-2', CURRICULUM = '2015', STANDARD_COURSE = '중2 수학';
const SCOPE_FIELDS = ['curriculum', 'curriculumKey', 'courseKey'];
// These aliases are absent in this exact cohort. They cannot supply a second,
// possibly contradictory scope beside the one explicit RPM scope below.
const ABSENT_ALIASES = ['courseSemester', 'gradeKey', 'grade', 'semester'];
const own = (value, key) => value !== null && typeof value === 'object' && Object.hasOwn(value, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const stable = value => JSON.stringify(value, (_, v) => object(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = value => sha(stable(value));
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const exactKeys = (value, keys) => object(value) && same(Object.keys(value).sort(), [...keys].sort());
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const fail = code => { throw new Error(`M2_NATIVE_RPM_COURSE:${code}`); };

function safePath(root, relative) {
  if (!nonempty(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f\x7f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('UNSAFE_PATH');
  const base = path.resolve(root), full = path.resolve(base, relative);
  for (let p = full; p !== base; p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('SYMLINK_PATH');
  return full;
}
function localBytes(root, relative) {
  const file = safePath(root, relative);
  try { return fs.readFileSync(file); } catch { fail('LOCAL_INPUT_UNAVAILABLE'); }
}
function git(root, args) {
  try { return execFileSync('git', args, { cwd: root, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
function gitBytes(root, commit, file) {
  safePath(root, file);
  if (!SHA1.test(commit || '') || git(root, ['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit)
    fail('EXACT_COMMIT_REQUIRED');
  const entry = git(root, ['ls-tree', '-z', commit, '--', file]).toString();
  const match = /^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
  if (!match || match[2] !== file) fail('EXACT_REGULAR_GIT_PATH_REQUIRED');
  const bytes = git(root, ['cat-file', 'blob', match[1]]);
  if (blob(bytes) !== match[1]) fail('GIT_BLOB_MISMATCH');
  return { bytes, gitBlobSha1: match[1] };
}
function immutableRef(root, ref) {
  if (!exactKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes']) ||
      !SHA1.test(ref.commit || '') || !SHA1.test(ref.gitBlobSha1 || '') || !SHA256.test(ref.sha256 || '') ||
      !Number.isSafeInteger(ref.bytes) || ref.bytes <= 0) fail('EXACT_FIVE_KEY_REF_REQUIRED');
  const found = gitBytes(root, ref.commit, ref.path);
  if (found.gitBlobSha1 !== ref.gitBlobSha1 || found.bytes.length !== ref.bytes || sha(found.bytes) !== ref.sha256)
    fail('IMMUTABLE_REF_MISMATCH');
  return found.bytes;
}
function json(bytes) {
  try { return JSON.parse(bytes.toString('utf8')); } catch { fail('INVALID_JSON'); }
}
function evidence(root, request, patch, ref) {
  if (!object(ref) || !SHA256.test(ref.sha256 || '') ||
      ![request.approval?.evidenceRefs, patch.evidenceRefs].every(refs => Array.isArray(refs) &&
        refs.filter(r => r?.path === ref.path && r?.sha256 === ref.sha256).length === 1 &&
        refs.filter(r => r?.path === ref.path).length === 1)) fail('APPROVAL_AND_ITEM_EVIDENCE_REQUIRED');
  const bytes = localBytes(root, ref.path);
  if (sha(bytes) !== ref.sha256) fail('CURRENT_EVIDENCE_SHA_MISMATCH');
  return bytes;
}
function bank(bytes) {
  try {
    const ctx = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
    vm.runInContext('globalThis.window = {}; globalThis.console = { log() {}, warn() {}, error() {} };', ctx, { timeout: 2000 });
    vm.runInContext(bytes.toString('utf8'), ctx, { timeout: 2000 });
    const value = ctx.window.questionBank || ctx.window.questions || ctx.questionBank || ctx.questions || ctx.window.examData?.questions;
    if (!Array.isArray(value)) fail('SOURCE_BANK_REQUIRED');
    return JSON.parse(JSON.stringify(value));
  } catch { fail('SOURCE_BANK_REQUIRED'); }
}
function checkScope(value, { courseAbsent = true } = {}) {
  if (!object(value) || courseAbsent && own(value, 'courseKey') || ABSENT_ALIASES.some(k => own(value, k)) ||
      ['curriculum', 'curriculumKey'].some(k => own(value, k) && value[k] !== CURRICULUM) ||
      own(value, 'standardCourse') && value.standardCourse !== STANDARD_COURSE) fail('SCOPE_ABSENCE_OR_CONFLICT');
}
// The registrar's cold replay overlays patch.before on the issued final row.
// Fields omitted from before (notably its derived curriculumKey) and the
// registrar's approval markers therefore remain in that view. Only the exact
// persisted receipt, typed proof and digest-bound sidecar can authenticate it.
function checkedIssuedBeforeView({root, request, patch, metadata, final, issuedProof, item}) {
  if (issuedProof === undefined) return false;
  if (!object(issuedProof) || !object(metadata) || !object(patch.before) || !object(patch.sourceReview))
    fail('ISSUED_PRESENCE_PROOF_REQUIRED');
  const issuedMarkers = [metadata, final].some(value => value?.metadataApprovalType === 'FINAL_QA' ||
    value?.metaFoundationStatus === 'ACTIVE');
  const inheritedCurriculum = issuedProof?.metadataBeforeScopePresence?.curriculumKey?.present === false &&
    own(metadata, 'curriculumKey') && metadata.curriculumKey !== null;
  if (!issuedMarkers && !inheritedCurriculum) return false;
  const requested = Array.isArray(request.items) ? request.items.filter(value =>
    value.questionUid === item.questionUid && value.sourceOrdinal === item.sourceOrdinal) : [];
  const rawPatch = requested?.[0], removed = Object.keys(rawPatch?.sourceReview || {}).filter(key => !own(patch.sourceReview, key));
  const displayOptions = item.reviewPath.includes('/E023/') ? {
    m2ProblemRenderer21Continuity: 'archive-reviewed-m2-problem21-continuity-v1',
    e023SolutionDisplayContinuity: 'archive-m2-e023-solution-display6-continuity-v1',
  } : item.sourceOrdinal === 2 ? {e017RhsContinuity: 'archive-m2-e017-existing-rhs-solution-continuity-v1'} : {
    m2ProblemRenderer21Continuity: 'archive-reviewed-m2-problem21-continuity-v1',
  };
  // Central display validators recurse with only their named option removed.
  // Authenticate that metadata-only view against the untouched request; this
  // grants no renderer authority and accepts no other patch normalization.
  const comparison = rawPatch && {...rawPatch, sourceReview: {...rawPatch.sourceReview}};
  for (const key of removed) {
    const option = rawPatch.sourceReview[key];
    if (!own(displayOptions, key) || !exactKeys(option, ['schemaVersion', 'reviewCommit', 'reviewRef']) ||
        option.schemaVersion !== displayOptions[key] || !SHA1.test(option.reviewCommit || '') ||
        !exactKeys(option.reviewRef, ['path', 'sha256']) || !nonempty(option.reviewRef.path) ||
        !SHA256.test(option.reviewRef.sha256 || '')) fail('ISSUED_METADATA_REQUEST_VIEW_MISMATCH');
    delete comparison.sourceReview[key];
  }
  if (request.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' ||
      !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(request.requestId || '') ||
      !Array.isArray(request.items) || requested.length !== 1 || !same(comparison, patch) ||
      !same(metadata, {...final, ...patch.before}) || final.questionUid !== item.questionUid ||
      final.sourceOrdinal !== item.sourceOrdinal || final.sourceArchiveFile !== item.sourceArchiveFile ||
      final.metadataApprovalType !== 'FINAL_QA' || final.metaFoundationStatus !== 'ACTIVE' ||
      !own(final, 'curriculumKey') || final.curriculumKey !== CURRICULUM ||
      !nonempty(final.metadataRevision) || !final.metadataRevision.endsWith(`:exam-final_qa-v2:${request.requestId}`))
    fail('ISSUED_METADATA_BEFORE_VIEW_REQUIRED');
  const receiptPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
  const receipt = json(localBytes(root, receiptPath));
  if (receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.requestId !== request.requestId ||
      receipt.requestSha256 !== hash(request) || receipt.sourceArchiveFile !== item.sourceArchiveFile ||
      receipt.sourceBlobSha1 !== request.expectedSourceBlobSha1 ||
      receipt.sourceRawSha256 !== issuedProof.currentSource?.sha256 ||
      receipt.scope !== 'PARTIAL_UIDS' || receipt.expectedQuestionCount !== item.expectedQuestionCount ||
      receipt.totalQuestions !== request.items.length || receipt.partialUidCount !== request.items.length ||
      receipt.metadataRegistrationStatus !== 'REGISTERED' || !same(receipt.approval, request.approval) ||
      !same(receipt.registryChanges, []) || !Array.isArray(receipt.appliedRecords) ||
      receipt.appliedRecords.length !== request.items.length ||
      receipt.appliedRecords.filter(value => value.questionUid === item.questionUid && same(value, final)).length !== 1)
    fail('ISSUED_METADATA_RECEIPT_MISMATCH');
  const repairs = receipt.fingerprintRepairs?.filter(value => value.questionUid === item.questionUid &&
    value.sourceOrdinal === item.sourceOrdinal), repair = repairs?.[0];
  if (repairs?.length !== 1 || !same(repair.sourceReview?.nativeRpmCourseTransport, issuedProof) ||
      removed.some(key => !object(repair.sourceReview?.[key]) ||
        !SHA256.test(repair.sourceReview[key].originalSourceReviewSha256 || '')) ||
      !same(repair.metadataBefore, {sourceFingerprint: patch.before.sourceFingerprint, contentFingerprint: patch.before.contentFingerprint}) ||
      !same(repair.after, {sourceFingerprint: final.sourceFingerprint, contentFingerprint: final.contentFingerprint}) ||
      own(patch, 'identityBefore') && !same(repair.identityBefore, patch.identityBefore))
    fail('ISSUED_METADATA_REPAIR_MISMATCH');
  const sidecarPath = reviewedSourceBindingPath(request.requestId), sidecarBytes = localBytes(root, sidecarPath);
  const digests = receipt.outputDigests?.filter(value => value.path === sidecarPath);
  let expected;
  try { expected = buildReviewedSourceBinding({...receipt, request}); }
  catch { fail('ISSUED_METADATA_SIDECAR_MISMATCH'); }
  if (digests?.length !== 1 || digests[0].sha256 !== sha(sidecarBytes) || !same(json(sidecarBytes), expected) ||
      ![receiptPath, sidecarPath].every(p => Array.isArray(final.approvalEvidence) &&
        final.approvalEvidence.filter(value => value === p).length === 1)) fail('ISSUED_METADATA_SIDECAR_MISMATCH');
  return true;
}
function checkedPresence(metadata, before, issuedProof, item, issuedBeforeView, after) {
  if (!object(metadata) || !object(before) || !own(before, 'courseKey') || before.courseKey !== null)
    fail('ORIGINAL_COURSE_BEFORE_NULL_REQUIRED');
  const issued = issuedProof?.metadataBeforeScopePresence;
  if (issuedProof !== undefined && (!object(issuedProof) || issuedProof.schemaVersion !== M2_NATIVE_RPM_COURSE_SCHEMA ||
      issuedProof.questionUid !== item.questionUid || issuedProof.sourceOrdinal !== item.sourceOrdinal ||
      !exactKeys(issued, SCOPE_FIELDS))) fail('ISSUED_PRESENCE_PROOF_REQUIRED');
  const result = {};
  for (const field of SCOPE_FIELDS) {
    const expected = field === 'courseKey' ? COURSE : CURRICULUM;
    if (issuedProof !== undefined && (!exactKeys(issued[field], issued[field]?.present === true ? ['present', 'valueSha256'] : ['present']) ||
        typeof issued[field].present !== 'boolean' || issued[field].present && issued[field].valueSha256 !== hash(expected) ||
        field === 'courseKey' && issued[field].present)) fail('ISSUED_PRESENCE_PROOF_REQUIRED');
    const wasAbsent = issuedProof !== undefined ? issued[field].present === false : !own(metadata, field);
    const issuedDerivedCurriculum = issuedBeforeView && field === 'curriculumKey' && wasAbsent &&
      !own(before, field) && !own(after, field) && metadata[field] === CURRICULUM;
    if (wasAbsent ? own(metadata, field) && (issuedProof === undefined || metadata[field] !== null) && !issuedDerivedCurriculum :
        !own(metadata, field) || metadata[field] !== expected || field === 'courseKey') fail('METADATA_SCOPE_PRESENCE_CONFLICT');
    if (own(before, field) ? before[field] !== (wasAbsent ? null : expected) : !wasAbsent)
      fail('METADATA_SCOPE_BEFORE_MISMATCH');
    result[field] = wasAbsent ? { present: false } : { present: true, valueSha256: hash(expected) };
  }
  if (ABSENT_ALIASES.some(k => own(metadata, k)) ||
      own(metadata, 'standardCourse') && metadata.standardCourse !== STANDARD_COURSE) fail('METADATA_SCOPE_CONFLICT');
  return result;
}
function activeTuple(before, after, final, nativeAfter) {
  if (!before || !after || !nonempty(final.standardUnitKey) || !nonempty(final.subUnitKey)) fail('CURRENT_ACTIVE_TUPLE_REQUIRED');
  const tuple = [CURRICULUM, STANDARD_COURSE, final.standardUnitKey, final.subUnitKey, nativeAfter.problemTypeKey];
  const key = stable(tuple), binding = before.bindings?.get(key), next = after.bindings?.get(key);
  const pt = before.pt?.get(nativeAfter.problemTypeKey), tpl = before.tpl?.get(nativeAfter.templateKey);
  const owner = binding?.ownerPack || pt?.ownerPack, pack = before.packs?.get(owner);
  if (!binding || !pt || !tpl || !pack || binding.status !== 'ACTIVE' || pt.status !== 'ACTIVE' || tpl.status !== 'ACTIVE' ||
      binding.curriculum !== CURRICULUM || binding.standardCourse !== STANDARD_COURSE ||
      binding.standardUnitKey !== final.standardUnitKey || binding.subUnitKey !== final.subUnitKey ||
      binding.problemTypeKey !== nativeAfter.problemTypeKey || pt.problemTypeKey !== nativeAfter.problemTypeKey ||
      tpl.templateKey !== nativeAfter.templateKey || tpl.parentProblemTypeKey !== pt.problemTypeKey ||
      !nonempty(binding.ownerPack) || !nonempty(pt.ownerPack) || !nonempty(tpl.ownerPack) ||
      pack.meta?.packId !== owner || pack.meta.canonicalStatus !== 'ACTIVE' ||
      !pack.meta.curricula?.includes(CURRICULUM) || !pack.meta.standardCourses?.includes(STANDARD_COURSE) ||
      !pack.meta.standardCourses?.includes(COURSE) ||
      !same(binding, next) || !same(pt, after.pt?.get(pt.problemTypeKey)) || !same(tpl, after.tpl?.get(tpl.templateKey)) ||
      !same(pack.meta, after.packs?.get(owner)?.meta)) fail('CURRENT_ACTIVE_TUPLE_OR_OWNER_CONFLICT');
  // Definition owners can differ from the binding owner. Every owner must still
  // be an unchanged ACTIVE pack; the RPM row never creates one of these tuples.
  for (const id of new Set([pt.ownerPack, tpl.ownerPack])) {
    const p = before.packs?.get(id);
    if (p?.meta?.canonicalStatus !== 'ACTIVE' || p.meta.packId !== id || !same(p.meta, after.packs?.get(id)?.meta))
      fail('CURRENT_ACTIVE_DEFINITION_OWNER_CONFLICT');
  }
  const units = [];
  for (const [unitKey, keyType] of [[final.standardUnitKey, 'standardUnitKey'], [final.subUnitKey, 'subUnitKey']]) {
    const unit = before.master?.get(unitKey);
    if (!unit || unit.status !== 'active' || unit.keyType !== keyType || !same(unit, after.master?.get(unitKey)) ||
        keyType === 'subUnitKey' && (unit.parentKey || unit.standardUnitKey) !== final.standardUnitKey)
      fail('CURRENT_ACTIVE_UNIT_PARENT_CONFLICT');
    units.push({ key: unitKey, sha256: hash(unit) });
  }
  // Pack version/counts can advance for unrelated registrations. Revalidate
  // the current owning scope above on every replay, but do not turn that global
  // bookkeeping into immutable authority for this one transported field.
  return { tuple, bindingSha256: hash(binding), problemTypeSha256: hash(pt), templateSha256: hash(tpl),
    ownerPack: owner, units };
}

// Called only inside the existing Native reassessment, after its whole-source
// and field guards. It contributes exactly one missing scope field. All other
// after-values, ordinary parent validation, receipt/sidecar and replay checks
// remain mandatory in the caller. In particular GAP/RPM_ONLY is not a PT/TPL grant.
export function bindReviewedM2NativeRpmCourse({ root, request, patch, native, row, metadata,
  question, committedQuestion, accepted, final, canonicalBefore, canonicalAfter, issuedProof, m2Problem21CurrentUiContinuation }) {
  if (!own(patch?.targetParentRef, 'nativeRpmCourseTransport')) return null;
  const target = patch.targetParentRef, spec = target.nativeRpmCourseTransport;
  const item = M2_NATIVE_RPM_COURSE_ITEMS.find(x => x.questionUid === patch.questionUid);
  if (!item || patch.sourceOrdinal !== item.sourceOrdinal || request.sourceArchiveFile !== item.sourceArchiveFile ||
      request.expectedQuestionCount !== item.expectedQuestionCount) fail('EXACT_21_UID_SOURCE_DENOMINATOR_REQUIRED');
  if (!exactKeys(spec, ['schemaVersion', 'field', 'nativeRpmRef', 'currentRpmRef']) ||
      spec.schemaVersion !== M2_NATIVE_RPM_COURSE_SCHEMA || spec.field !== 'courseKey' ||
      !same(spec.nativeRpmRef, ORIGINAL_RPM) || spec.currentRpmRef?.path !== ORIGINAL_RPM.path ||
      !exactKeys(target, ['path', 'sha256', 'curriculum', 'scope', 'majorUnit', 'midUnit', 'nativeRpmCourseTransport',
        ...(own(target, 'crosswalkRef') ? ['crosswalkRef'] : [])])) fail('CLOSED_COURSE_CARRIER_REQUIRED');
  if (request.scope !== 'PARTIAL_UIDS' || request.approval?.type !== 'FINAL_QA' || request.approval.metadataReviewed !== true ||
      own(request, 'registrationMode') || own(request, 'sourceRebind') || own(request.approval, 'sourceRebind') ||
      !Array.isArray(request.registryChanges) || request.registryChanges.length ||
      ['rebind', 'sourceRebind', 'typeHold', 'basicScopeParentRef', 'semanticBinding', 'approvedMetadataRef'].some(k => own(patch, k)))
    fail('EXCLUSIVE_FINAL_QA_PARTIAL_WITHOUT_MUTATIONS_REQUIRED');
  if (!object(patch.after) || !object(accepted) || !object(final) || !own(patch.after, 'courseKey') ||
      patch.after.courseKey !== COURSE || final.courseKey !== COURSE || own(accepted, 'courseKey') ||
      patch.after.curriculum !== CURRICULUM || accepted.curriculum !== CURRICULUM || final.curriculum !== CURRICULUM ||
      patch.after.standardCourse !== STANDARD_COURSE || final.standardCourse !== STANDARD_COURSE ||
      !own(patch.after, 'sourceFingerprint') || !SHA256.test(patch.after.sourceFingerprint || '') ||
      final.sourceFingerprint !== patch.after.sourceFingerprint || !SHA1.test(request.expectedSourceBlobSha1 || ''))
    fail('EXACT_NATIVE_COURSE_AFTER_REQUIRED');
  const issuedBeforeView = checkedIssuedBeforeView({root, request, patch, metadata, final, issuedProof, item});
  const metadataBeforeScopePresence = checkedPresence(metadata, patch.before, issuedProof, item, issuedBeforeView, patch.after);
  const sr = patch.sourceReview;
  if (!object(sr) || sr.schemaVersion !== 'archive-reviewed-source-reassessment-v1' || sr.reviewCommit !== NATIVE_COMMIT ||
      sr.reviewPath !== item.reviewPath || !exactKeys(sr.reviewRef, ['path', 'sha256']) || sr.reviewRef.sha256 !== item.reviewSha256)
    fail('PINNED_NATIVE_REVIEW_REQUIRED');
  const reviewBytes = gitBytes(root, NATIVE_COMMIT, item.reviewPath).bytes;
  if (sha(reviewBytes) !== item.reviewSha256 || !reviewBytes.equals(evidence(root, request, patch, sr.reviewRef)))
    fail('PINNED_NATIVE_REVIEW_MISMATCH');
  const review = json(reviewBytes), matches = review.items?.filter(x => x.questionUid === item.questionUid && x.sourceOrdinal === item.sourceOrdinal);
  if (review.schemaVersion !== 'm2-s2-meta-review-v1' || review.sourceArchiveFile !== item.sourceArchiveFile ||
      review.reviewedQuestionCount !== item.expectedQuestionCount || review.items?.length !== item.expectedQuestionCount ||
      matches?.length !== 1 || !object(row) || hash(row) !== item.nativeItemSha256 || !same(row, matches[0]) ||
      !['CORRECT', 'KEEP', 'KEEP_SEMANTIC_RPM'].includes(row.rpmDecision) || !nonempty(row.fieldReview?.classification) ||
      !nonempty(row.fieldReview?.binding) || !same(native?.review, review) || !same(native.rows?.get(item.sourceOrdinal), row))
    fail('EXACT_SETTLED_NATIVE_ITEM_REQUIRED');
  // The pinned historical before has curriculum:null. It supplies no scope
  // authority. Its entire item hash is already checked; only the missing course
  // property is relevant here, while after/current curriculum stays strict.
  if (!object(row.before) || own(row.before, 'courseKey') || ABSENT_ALIASES.some(k => own(row.before, k)))
    fail('NATIVE_BEFORE_COURSE_ABSENCE_REQUIRED');
  checkScope(row.after); checkScope(accepted);
  const original = json(immutableRef(root, spec.nativeRpmRef));
  const currentBytes = immutableRef(root, spec.currentRpmRef);
  if (!currentBytes.equals(evidence(root, request, patch, spec.currentRpmRef))) fail('CURRENT_RPM_LIVE_BYTES_MISMATCH');
  const current = json(currentBytes), oldRows = original.records?.filter(x => x.id === item.rpmRecordId),
    newRows = current.records?.filter(x => x.id === item.rpmRecordId), rpm = oldRows?.[0];
  if ([original, current].some(doc => doc.schemaVersion !== 'rpm-primary-active-crosswalk-v1' || doc.grade !== 'M2' || doc.status !== 'ACTIVE_REFERENCE') ||
      oldRows?.length !== 1 || newRows?.length !== 1 ||
      hash(rpm) !== item.rpmRecordSha256 || !same(rpm, newRows[0]) || row.rpmRecordId !== item.rpmRecordId ||
      rpm.curriculum !== CURRICULUM || rpm.scope !== COURSE ||
      !['DIRECT_ACTIVE', 'DIRECT_BINDING_GAP', 'RPM_ONLY'].includes(rpm.mappingStatus)) fail('EXACT_UNCHANGED_NATIVE_RPM_ROW_REQUIRED');
  const after = row.after, rpmPath = after.rpmPrimaryPath;
  if (!object(rpmPath) || !['majorUnit', 'midUnit', 'l3', 'l4'].every(k => nonempty(rpmPath[k])) ||
      !same(rpm.rpmPath, rpmPath) || after.curriculum !== CURRICULUM || after.rpmL1 !== rpmPath.majorUnit || after.rpmL2 !== rpmPath.midUnit ||
      ['problemTypeKey', 'templateKey', 'rpmPrimaryPath', 'rpmL1', 'rpmL2'].some(k => !own(after, k) ||
        !same(accepted[k], after[k]) || !same(patch.after[k], after[k]) || !same(final[k], after[k])))
    fail('ORIGINAL_NATIVE_AFTER_AUTHORITY_REQUIRED');
  if (target.path !== MASTER || target.curriculum !== CURRICULUM || target.scope !== COURSE ||
      target.majorUnit !== rpmPath.majorUnit || target.midUnit !== rpmPath.midUnit) fail('EXACT_ORDINARY_TARGET_PARENT_REQUIRED');
  if (own(target, 'crosswalkRef') && (!exactKeys(target.crosswalkRef, ['path', 'sha256', 'recordId']) ||
      target.crosswalkRef.path !== spec.currentRpmRef.path || target.crosswalkRef.sha256 !== spec.currentRpmRef.sha256 ||
      target.crosswalkRef.recordId !== item.rpmRecordId)) fail('ORDINARY_CROSSWALK_REF_CONFLICT');
  const master = json(evidence(root, request, patch, target));
  const parents = master.records?.filter(x => x.curriculum === CURRICULUM && x.scope === COURSE &&
    x.majorUnit === target.majorUnit && x.midUnit === target.midUnit), concepts = parents?.[0]?.concepts?.filter(x => x.concept === rpmPath.l3),
    leaves = concepts?.[0]?.problemTypes?.filter(x => x.problemType === rpmPath.l4);
  if (master.schemaVersion !== 'js-archive-taxonomy-rpm-primary-v1.0' || master.authorityStatus !== 'LOCKED' ||
      parents?.length !== 1 || concepts?.length !== 1 || leaves?.length !== 1 ||
      [parents[0], concepts[0], leaves[0]].some(x => x.defaultSelectable !== true)) fail('EXACT_SELECTABLE_MASTER_LEAF_REQUIRED');
  const sourcePath = `archive/exams/${item.sourceArchiveFile}`;
  const originalSource = gitBytes(root, review.baseSha, sourcePath), committedSource = gitBytes(root, NATIVE_COMMIT, sourcePath);
  if (originalSource.gitBlobSha1 !== review.sourceGitBlobSha || native.sourceBlob !== originalSource.gitBlobSha1 ||
      native.committedBlob !== committedSource.gitBlobSha1 || native.sourceSha256 !== sha(originalSource.bytes)) fail('NATIVE_SOURCE_REF_MISMATCH');
  const liveSource = localBytes(root, sourcePath);
  const issuedSourceView = readM2Problem21CurrentRpmSource({context:m2Problem21CurrentUiContinuation,root,request,patch,
    metadata,final,issuedProof,relativePath:sourcePath,currentSourceBytes:liveSource});
  const currentSource = issuedSourceView ?? liveSource;
  const reviewedBank = bank(originalSource.bytes), committedBank = bank(committedSource.bytes), currentBank = bank(currentSource);
  if ([reviewedBank, committedBank, currentBank].some(x => x.length !== item.expectedQuestionCount) ||
      !same(native.reviewedBank, reviewedBank) || !same(native.committedBank, committedBank) ||
      !same(committedQuestion, committedBank[item.sourceOrdinal - 1]) || blob(currentSource) !== request.expectedSourceBlobSha1)
    fail('EXACT_SOURCE_BANK_OR_AFTER_BLOB_REQUIRED');
  const liveQuestion = currentBank[item.sourceOrdinal - 1];
  const currentFingerprint = sha(JSON.stringify({ content: liveQuestion.content ?? null,
    choices: Array.isArray(liveQuestion.choices) ? liveQuestion.choices : null,
    answer: liveQuestion.answer ?? null, solution: liveQuestion.solution ?? null, image: liveQuestion.image ?? null }));
  if (patch.after.sourceFingerprint !== currentFingerprint) fail('CURRENT_SOURCE_FINGERPRINT_AFTER_REQUIRED');
  for (const q of [reviewedBank[item.sourceOrdinal - 1], committedQuestion, currentBank[item.sourceOrdinal - 1], question]) checkScope(q);
  if (!issuedBeforeView && (['FINAL_QA'].includes(metadata.metadataApprovalType) || metadata.metaFoundationStatus === 'ACTIVE')) {
    for (const k of ['problemTypeKey', 'templateKey', 'rpmPrimaryPath'])
      if (own(metadata, k) && !same(metadata[k], after[k])) fail('EXISTING_APPROVED_METADATA_CONFLICT');
  }
  const canonical = activeTuple(canonicalBefore, canonicalAfter, final, after);
  const proof = { schemaVersion: M2_NATIVE_RPM_COURSE_SCHEMA, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    transportedFields: ['courseKey'], fieldSha256: hash(COURSE), authority: 'EXPLICIT_NATIVE_AFTER_AND_UNCHANGED_IMMUTABLE_RPM_SCOPE',
    nativeReviewCommit: NATIVE_COMMIT, nativeReviewRef: sr.reviewRef, nativeReviewPath: item.reviewPath,
    nativeItemSha256: item.nativeItemSha256, nativeRpmRef: spec.nativeRpmRef, currentRpmRef: spec.currentRpmRef,
    courseCarrierSha256: hash(spec), rpmRecordId: item.rpmRecordId, rpmRecordSha256: item.rpmRecordSha256,
    originalRpmMappingStatus: rpm.mappingStatus, classificationAuthority: 'ORIGINAL_NATIVE_AFTER_AND_CURRENT_ACTIVE_TUPLE',
    masterRef: { path: MASTER, sha256: target.sha256 }, masterLeafSha256: hash(leaves[0]), canonical,
    nativeSource: { gitBlobSha1: originalSource.gitBlobSha1, sha256: sha(originalSource.bytes) },
    nativeCommittedSource: { gitBlobSha1: committedSource.gitBlobSha1, sha256: sha(committedSource.bytes) },
    currentSource: { path: sourcePath, gitBlobSha1: request.expectedSourceBlobSha1, sha256: sha(currentSource) },
    metadataBeforeScopePresence, originalSourceCourseAbsent: true, currentSourceCourseAbsent: true,
    ordinaryParentValidationRequired: true, newPrimaryJudgment: false, newMathematicalQa: false,
    crosswalkClassificationGranted: false, sourceFieldsChanged: false, canonicalDefinitionsModified: false,
    inferredFromYearOrFilename: false };
  if (issuedProof !== undefined && !same(proof, issuedProof)) fail('ISSUED_COURSE_PROOF_MISMATCH');
  return { fields: { courseKey: COURSE }, proof };
}
