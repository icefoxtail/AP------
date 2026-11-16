import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';

export const M2_PROBLEM_IMAGE_REPAIR8_PROFILE = 'M2_PROBLEM_IMAGE_REPAIR8_V1';
export const M2_PROBLEM_IMAGE_REPAIR8_SCHEMA = 'archive-m2-problem-image-repair8-materialization-v1';
export const M2_PROBLEM_IMAGE_REPAIR8_STATIC_SCHEMA = 'archive-independent-m2-problem-image-repair8-static-v2';
export const M2_PROBLEM_IMAGE_REPAIR8_STATIC_SOURCE_COMMIT = '61830b6cd7ef773f6d9c963142a7e95af4c48e82';
// This is a closed transport inventory, not a generic image-field allowlist.
// The approved asset bytes are supplied by the separate immutable static review.
export const M2_PROBLEM_IMAGE_REPAIR8_SCOPE = Object.freeze([
  {
    "key": "E017-Q04",
    "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
    "sourceOrdinal": 4,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q4-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q4-problem-visual-v4.svg",
    "approvedAssetGitBlobSha1": "8ceb67213019d19a316f585046f4dfb2a3866770",
    "approvedAssetSha256": "536b894d4b9c78180125ec685816040271a46e8c297e4b025ba5570efbafde7c",
    "approvedAssetBytes": 4426,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "3736b4f8ee991d4aa3bd67261c97d832b9d58cf5bce8a1837d84a271482f5e5c",
    "reviewedOldAssetGitBlobSha1": "7b60b51d28f8f147fad306c00b1f48fa8a4e5c9a",
    "reviewedOldAssetSha256": "16a8a8902061bf4c480f8d9fba1518b950cc226c1aed530239d32a68aeff61f5",
    "reviewedOldAssetBytes": 4426
  },
  {
    "key": "E017-Q05",
    "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
    "sourceOrdinal": 5,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q5-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q5-problem-visual-v4.svg",
    "approvedAssetGitBlobSha1": "28c9d60eee441984ce81ed941a477d661a556f3e",
    "approvedAssetSha256": "2c7fd8f8cbebe68fc21b52c3927382e609ae4238f5cd601ddfe6c58c9dd5a87e",
    "approvedAssetBytes": 17139,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "ce8103923ed5c5bfca92f9697782b23f120f19356c513989251e5f4814f27aeb",
    "reviewedOldAssetGitBlobSha1": "a2e851ec2e5fe722404c95e6dff473ea99bc67d3",
    "reviewedOldAssetSha256": "ccc1ad41b2646af1db94ae70d03b17de2eadf027a5ad59a47db1f9f0d28e6603",
    "reviewedOldAssetBytes": 17139
  },
  {
    "key": "E017-Q09",
    "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
    "sourceOrdinal": 9,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q9-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q9-problem-visual-v4.svg",
    "approvedAssetGitBlobSha1": "1c2b78a81b3e5a34be0ac1a7163bbfb19ca4b85e",
    "approvedAssetSha256": "b1378acc43d6a968bade6c4b4ab15a55cfd4738252fc044857093fffe1fdff20",
    "approvedAssetBytes": 4802,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "6a974c5c580e9113c80e8c510b120b280b003670b8a4e51b45cc983951f228c5",
    "reviewedOldAssetGitBlobSha1": "2d06fb735ded3015612ba2b61ffc14fa7491a300",
    "reviewedOldAssetSha256": "4f2009813162dfc535b5a4953ffb93a3ec00142c29e07729af414335fcb0ed1a",
    "reviewedOldAssetBytes": 4802
  },
  {
    "key": "E017-Q18",
    "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
    "sourceOrdinal": 18,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q18-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q18-problem-visual-v3.svg",
    "approvedAssetGitBlobSha1": "2cae8726c373f5c728f010860ae288e103982212",
    "approvedAssetSha256": "a301b3ff21f2f371ec0220600757e74b4473c5cad5f084494a233f16506ad37c",
    "approvedAssetBytes": 4257,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "00fbe83939b129710d835f180067e1b24c08aab3ec299108916d7d11d16822d2",
    "reviewedOldAssetGitBlobSha1": "147eaf6f09ea70d3b3f5793565d4e310163c6c24",
    "reviewedOldAssetSha256": "f63db390bc0192177f2110a124b3ed8fa7fb04ea4db03586dc3093ca22bce604",
    "reviewedOldAssetBytes": 3888
  },
  {
    "key": "E017-Q20",
    "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
    "sourceOrdinal": 20,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q20-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q20-problem-visual-v3.svg",
    "approvedAssetGitBlobSha1": "c1c73664336bdbdd83136ea58773b1c23b189b90",
    "approvedAssetSha256": "a156e3687d04197ee3dff3dd65710e833908432b3c3d6440b854526b57145fe6",
    "approvedAssetBytes": 4437,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "bae4cfa9892ad7c9a80940e9da6502a505832df234536a65433e8d17e35330bb",
    "reviewedOldAssetGitBlobSha1": "b06bbbe91eb11f6b223a78f3e914080f3245e789",
    "reviewedOldAssetSha256": "615fe21e2ed5cf66e86f2816eaeee26412dfc9aefc48c2367e7fd32b9c85f528",
    "reviewedOldAssetBytes": 4437
  },
  {
    "key": "E017-Q23",
    "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
    "sourceOrdinal": 23,
    "sourcePath": "archive/exams/original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js",
    "oldAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q23-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/24_연향중_2학기_중간_중2_수학/q23-problem-visual-v3.svg",
    "approvedAssetGitBlobSha1": "2f865edf92807075f5ab0bb7fa36009a8b28693c",
    "approvedAssetSha256": "82f2b31b9133062ce50c6332a7668a7ce228c4bb21f6ba512103e9ad5ce94f1d",
    "approvedAssetBytes": 3713,
    "reviewedSourceGitBlobSha1": "a6a8419ba3ea9b6e271b57c34b920088277dc226",
    "reviewedSourceSha256": "916dd50a26c8ca09fc87d67012d70f0a410d4eb3803ba844b46969f63df6b687",
    "reviewedSourceBytes": 66448,
    "reviewedWholeQuestionSha256": "d34a95cbc008087500ae79d5cd0ff1de97bc92f0b600652f2a81e3f6bdb511e4",
    "reviewedOldAssetGitBlobSha1": "6cb01593a000a050d3d66505a398dc400cf4808b",
    "reviewedOldAssetSha256": "80759968165b6eb1f4d4407a2fd2ea098e9136e18d9e946c5852f4e16cd9ae32",
    "reviewedOldAssetBytes": 3802
  },
  {
    "key": "E023-Q06",
    "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
    "sourceOrdinal": 6,
    "sourcePath": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "oldAssetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q6-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q6-problem-visual-v4.svg",
    "approvedAssetGitBlobSha1": "c42e846519c266ef9f30389c03e71d6f33c81d72",
    "approvedAssetSha256": "a92041578869d2121a0524f79dec4cb77d1711a59b530bbc2f1ca4e2cb860482",
    "approvedAssetBytes": 4003,
    "reviewedSourceGitBlobSha1": "f0cd94780d1f2c277bad52142cfa20cb932e0e96",
    "reviewedSourceSha256": "e3eea28235f0054b79858ad6451af0a82c94ffb9ab7470f481710519a2887cdf",
    "reviewedSourceBytes": 63986,
    "reviewedWholeQuestionSha256": "caae7e59357b0c7b05617d68cb12a80d3cbd6d96c3c4373806ea53de9825f38c",
    "reviewedOldAssetGitBlobSha1": "3dcea544368e02f93e731a1486e6574494a40b06",
    "reviewedOldAssetSha256": "0b6d3c33968f697061cdbf81df4de88bdbc160a79a4ece5109287bc220fa21b1",
    "reviewedOldAssetBytes": 4003
  },
  {
    "key": "E023-Q10",
    "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
    "sourceOrdinal": 10,
    "sourcePath": "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
    "oldAssetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q10-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/23_연향중_2학기_기말_중2_기출/q10-problem-visual-v4.svg",
    "approvedAssetGitBlobSha1": "56a4c294c7dcadb0271a9b13e4222afc2a764e8f",
    "approvedAssetSha256": "ad5ef51883df950f9b12f28083921b98b87547b382edc9326365a21fdf33a3f7",
    "approvedAssetBytes": 4979,
    "reviewedSourceGitBlobSha1": "f0cd94780d1f2c277bad52142cfa20cb932e0e96",
    "reviewedSourceSha256": "e3eea28235f0054b79858ad6451af0a82c94ffb9ab7470f481710519a2887cdf",
    "reviewedSourceBytes": 63986,
    "reviewedWholeQuestionSha256": "ac78e14ff872c69b9052ece2cf36fdfd8b616aa90aa6d1b658c383aafb15cdd7",
    "reviewedOldAssetGitBlobSha1": "e832ac49ce35315abfa52803f8f22a82b501c97e",
    "reviewedOldAssetSha256": "0fb3fec7dd6f8c71ed094d0047ee298bf246347c535167a98a526f348df7deff",
    "reviewedOldAssetBytes": 4979
  }
].map(row => Object.freeze(row)));
const STATIC_PATH = 'docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json';
const PRIOR_STATIC = Object.freeze({"commit": "e0c968d539ea5d76ce134c38956a32bc280989fe", "path": "docs/operations/m2-problem-image8-repair-20261116/independent-static-v1.json", "gitBlobSha1": "c37c57e7b5993d2431b6e1399529c86b3bdd06b6", "sha256": "f608d253890e072e79ed6bc4dcabfb98e9058fcfc4dc60641bf57736f8eff7fb", "bytes": 4127});
const BASIS_REVIEW = 'dfbb871b69c9176828c096f84afbe16b7464ddac21e9faee9e10faa1379ed8dc';
const REPAIR_PLAN = '14b8d208d4b4e87fb0bd2fb180308dcd23085d43566ef1044badefa3abaa98bd';
const IDENTITY = 'archive/data/question_identity_map.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const MAX_SOURCE = 16 * 1024 * 1024, MAX_ASSET = 4 * 1024 * 1024;
const filesInScope = [...new Set(M2_PROBLEM_IMAGE_REPAIR8_SCOPE.map(r => r.sourcePath))];
const scoped = new Map(M2_PROBLEM_IMAGE_REPAIR8_SCOPE.map(r => [r.key, r]));
const fail = code => { throw new Error(`SOURCE_IMAGE_REPAIR8:${code}`); };
const need = (condition, code) => { if (!condition) fail(code); };
const sha = b => createHash('sha256').update(b).digest('hex');
const blob = b => createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
const equal = isDeepStrictEqual;
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
function keys(v, names, code) {
  need(plain(v) && Object.keys(v).length === names.length && names.every(k => Object.hasOwn(v, k)), code);
}
function safePath(p) {
  need(typeof p === 'string' && p.length > 0 && p.length <= 500 && p === p.normalize('NFC')
    && !/[\\:\x00-\x1f\x7f]/u.test(p) && !path.posix.isAbsolute(p)
    && p.split('/').every(x => x && !['.', '..', '.git'].includes(x)), 'PATH');
  return p;
}
function git(root, args, max = 192 * 1024 * 1024) {
  try { return execFileSync('git', ['-C', root, ...args], {
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' },
    maxBuffer: max, stdio: ['ignore', 'pipe', 'pipe'],
  }); } catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
function gitBytes(root, commit, rel, max) {
  need(SHA1.test(commit || ''), 'COMMIT'); safePath(rel);
  need(git(root, ['cat-file', '-t', commit], 1024).toString().trim() === 'commit', 'COMMIT_OBJECT');
  const rows = git(root, ['ls-tree', '-z', commit, '--', rel], 4096).toString().split('\0').filter(Boolean);
  need(rows.length === 1, 'GIT_FILE_REQUIRED');
  const [header, actualPath] = rows[0].split('\t'), [mode, type, oid] = header.split(' ');
  need(mode === '100644' && type === 'blob' && actualPath === rel && SHA1.test(oid), 'GIT_REGULAR_FILE');
  const size = Number(git(root, ['cat-file', '-s', oid], 1024).toString().trim());
  need(Number.isSafeInteger(size) && size > 0 && size <= max, 'GIT_FILE_SIZE');
  const raw = git(root, ['cat-file', 'blob', oid], max + 1024);
  need(raw.length === size && blob(raw) === oid, 'GIT_BYTES');
  return raw;
}
function hashPair(ref, code) {
  keys(ref, ['blobSha1', 'sha256'], code);
  need(SHA1.test(ref.blobSha1) && SHA256.test(ref.sha256), code);
}
function assertPair(raw, ref, code) { need(blob(raw) === ref.blobSha1 && sha(raw) === ref.sha256, code); }
function immutableRef(root, ref, { expectedPath, expectedCommit, inputCommit, max = MAX_ASSET } = {}) {
  keys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'], 'IMMUTABLE_REF_SHAPE');
  need(SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) && SHA256.test(ref.sha256)
    && Number.isSafeInteger(ref.bytes) && ref.bytes > 0 && ref.bytes <= max, 'IMMUTABLE_REF_HASH');
  need(ref.commit !== inputCommit && (!expectedCommit || ref.commit === expectedCommit)
    && (!expectedPath || ref.path === expectedPath), 'IMMUTABLE_REF_BINDING');
  const raw = gitBytes(root, ref.commit, ref.path, max);
  need(raw.length === ref.bytes && blob(raw) === ref.gitBlobSha1 && sha(raw) === ref.sha256, 'IMMUTABLE_REF_DRIFT');
  return raw;
}
function parseJson(raw) {
  need(Buffer.from(raw.toString('utf8')).equals(raw), 'JSON_UTF8');
  const source = raw.toString(), stack = [];
  for (let i = 0; i < source.length; i++) {
    const c = source[i], top = stack.at(-1);
    if (c === '"') {
      const start = i++;
      for (; i < source.length; i++) { if (source[i] === '\\') i++; else if (source[i] === '"') break; }
      if (top?.keys && top.key) {
        let key; try { key = JSON.parse(source.slice(start, i + 1)); } catch { fail('JSON'); }
        need(!top.keys.has(key), 'DUPLICATE_JSON_KEY'); top.keys.add(key); top.key = false;
      }
    } else if (c === '{') stack.push({ keys: new Set(), key: true });
    else if (c === '[') stack.push({});
    else if (c === '}' || c === ']') stack.pop();
    else if (c === ',' && top?.keys) top.key = true;
  }
  try { return JSON.parse(source); } catch { fail('JSON'); }
}
function staticReview(root, ref, inputCommit) {
  const raw = immutableRef(root, ref, { expectedPath: STATIC_PATH, inputCommit }), doc = parseJson(raw);
  keys(doc, ['schemaVersion', 'profile', 'producer', 'reviewer', 'basisReviewSha256', 'repairPlanSha256', 'rows',
    'actualUi', 'newFullMathematicalQa', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments', 'priorStaticRef'], 'STATIC_SHAPE');
  need(doc.schemaVersion === M2_PROBLEM_IMAGE_REPAIR8_STATIC_SCHEMA && doc.profile === M2_PROBLEM_IMAGE_REPAIR8_PROFILE,
    'STATIC_PROFILE');
  const role = x => typeof x === 'string' && /^[A-Za-z0-9_:-]{3,100}$/.test(x);
  need(role(doc.producer) && role(doc.reviewer) && doc.producer.toUpperCase() !== doc.reviewer.toUpperCase(), 'REVIEWER_SEPARATION');
  need(doc.basisReviewSha256 === BASIS_REVIEW && doc.repairPlanSha256 === REPAIR_PLAN, 'STATIC_BASIS');
  need(doc.actualUi === 'PENDING' && doc.newFullMathematicalQa === false && doc.newReview2Claims === 0
    && doc.newMetadataApprovals === 0 && doc.newDifficultyJudgments === 0, 'STATIC_EFFECT');
  need(Array.isArray(doc.rows) && doc.rows.length === 8, 'STATIC_SCOPE');
  need(equal(doc.priorStaticRef, PRIOR_STATIC), 'STATIC_PRIOR_REF');
  const prior = parseJson(immutableRef(root, doc.priorStaticRef, { expectedPath: PRIOR_STATIC.path,
    expectedCommit: PRIOR_STATIC.commit, inputCommit }));
  keys(prior, ['schemaVersion', 'profile', 'producer', 'reviewer', 'basisReviewSha256', 'repairPlanSha256', 'rows',
    'actualUi', 'newFullMathematicalQa', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments'], 'STATIC_PRIOR_SHAPE');
  need(prior.schemaVersion === 'archive-independent-m2-problem-image-repair8-static-v1' && Array.isArray(prior.rows)
    && prior.rows.length === 8 && new Set(prior.rows.map(r => r.key)).size === 8, 'STATIC_PRIOR_SCOPE');
  for (const key of Object.keys(prior).filter(k => !['schemaVersion', 'rows'].includes(k)))
    need(equal(doc[key], prior[key]), 'STATIC_PRIOR_LINEAGE');
  const seen = new Set(), historicalBanks = new Map();
  for (const row of doc.rows) {
    keys(row, ['key', 'newAssetRef', 'staticDecision', 'beforeSourceRef', 'wholeQuestionBeforeSha256', 'oldAssetRef'], 'STATIC_ROW_SHAPE');
    const scope = scoped.get(row.key);
    need(scope && !seen.has(row.key) && row.staticDecision === 'ACCEPTED', 'STATIC_ROW_SCOPE'); seen.add(row.key);
    need(row.newAssetRef?.gitBlobSha1 === scope.approvedAssetGitBlobSha1 && row.newAssetRef?.sha256 === scope.approvedAssetSha256
      && row.newAssetRef?.bytes === scope.approvedAssetBytes, 'APPROVED_ASSET_BYTES');
    immutableRef(root, row.newAssetRef, { expectedPath: scope.newAssetPath, inputCommit });
    const priorRow = prior.rows.find(r => r.key === row.key);
    keys(priorRow, ['key', 'newAssetRef', 'staticDecision'], 'STATIC_PRIOR_ROW');
    need(equal(row.newAssetRef, priorRow.newAssetRef) && row.staticDecision === priorRow.staticDecision, 'STATIC_PRIOR_LINEAGE');
    // A resealed A2 cannot substitute another historical problem or old image.
    // These are the exact original reviewed 61830 bytes, not a caller-selected
    // semantic authority or a current-source digest supplied only by B.
    need(row.beforeSourceRef?.commit === M2_PROBLEM_IMAGE_REPAIR8_STATIC_SOURCE_COMMIT
      && row.beforeSourceRef?.path === scope.sourcePath
      && row.beforeSourceRef?.gitBlobSha1 === scope.reviewedSourceGitBlobSha1
      && row.beforeSourceRef?.sha256 === scope.reviewedSourceSha256
      && row.beforeSourceRef?.bytes === scope.reviewedSourceBytes, 'STATIC_GIVEN_FIXED');
    if (!historicalBanks.has(scope.sourcePath)) {
      const oldSource = immutableRef(root, row.beforeSourceRef, { expectedPath: scope.sourcePath,
        expectedCommit: M2_PROBLEM_IMAGE_REPAIR8_STATIC_SOURCE_COMMIT, inputCommit, max: MAX_SOURCE });
      historicalBanks.set(scope.sourcePath, executedBank(oldSource));
    }
    const historical = historicalBanks.get(scope.sourcePath)[scope.sourceOrdinal - 1];
    need(row.wholeQuestionBeforeSha256 === scope.reviewedWholeQuestionSha256
      && sha(stable(historical)) === row.wholeQuestionBeforeSha256, 'STATIC_GIVEN_DIGEST');
    need(row.oldAssetRef?.commit === M2_PROBLEM_IMAGE_REPAIR8_STATIC_SOURCE_COMMIT
      && row.oldAssetRef?.path === scope.oldAssetPath
      && row.oldAssetRef?.gitBlobSha1 === scope.reviewedOldAssetGitBlobSha1
      && row.oldAssetRef?.sha256 === scope.reviewedOldAssetSha256
      && row.oldAssetRef?.bytes === scope.reviewedOldAssetBytes, 'STATIC_OLD_ASSET_FIXED');
    immutableRef(root, row.oldAssetRef, { expectedPath: scope.oldAssetPath,
      expectedCommit: M2_PROBLEM_IMAGE_REPAIR8_STATIC_SOURCE_COMMIT, inputCommit });
  }
  return doc;
}

// Strict JSON with value ranges. Only an existing, top-level image string is
// replaceable. No key insertion, generic AST mutation, or source reformatting.
function literalTree(source, start) {
  let i = start;
  const space = () => { while (/[ \t\r\n]/u.test(source[i] ?? '\0')) i++; };
  function string() {
    const a = i++;
    for (; i < source.length; i++) {
      if (source[i] === '\\') i++;
      else if (source[i] === '"') {
        i++; try { return JSON.parse(source.slice(a, i)); } catch { fail('SOURCE_LITERAL_JSON'); }
      }
    }
    fail('SOURCE_LITERAL_JSON');
  }
  function value(depth = 0) {
    need(depth < 100, 'SOURCE_LITERAL_DEPTH'); space(); const a = i, c = source[i];
    if (c === '{') {
      i++; space(); const members = new Map(), result = {};
      if (source[i] === '}') { i++; return { start: a, end: i, value: result, members }; }
      while (i < source.length) {
        space(); need(source[i] === '"', 'SOURCE_LITERAL_JSON'); const key = string(); space();
        need(!members.has(key) && !['__proto__', 'constructor', 'prototype'].includes(key), 'SOURCE_DUPLICATE_OR_UNSAFE_KEY');
        need(source[i++] === ':', 'SOURCE_LITERAL_JSON'); const child = value(depth + 1);
        members.set(key, child); Object.defineProperty(result, key, { value: child.value, enumerable: true });
        space(); const end = source[i++];
        if (end === '}') return { start: a, end: i, value: result, members };
        need(end === ',', 'SOURCE_LITERAL_JSON');
      }
    } else if (c === '[') {
      i++; space(); const elements = [];
      if (source[i] === ']') { i++; return { start: a, end: i, value: [], elements }; }
      while (i < source.length) {
        elements.push(value(depth + 1)); space(); const end = source[i++];
        if (end === ']') return { start: a, end: i, value: elements.map(x => x.value), elements };
        need(end === ',', 'SOURCE_LITERAL_JSON');
      }
    } else if (c === '"') return { start: a, value: string(), end: i };
    else {
      const token = /^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/u.exec(source.slice(i));
      need(token, 'SOURCE_LITERAL_JSON'); i += token[0].length; const v = JSON.parse(token[0]);
      need(typeof v !== 'number' || Number.isFinite(v), 'SOURCE_LITERAL_NUMBER'); return { start: a, end: i, value: v };
    }
    fail('SOURCE_LITERAL_JSON');
  }
  return value();
}
function layout(raw) {
  const source = raw.toString('utf8'); need(Buffer.from(source).equals(raw), 'SOURCE_UTF8');
  const matches = [...source.matchAll(/(?:^|\n)[ \t]*window\.questionBank[ \t]*=[ \t]*/gu)];
  need(matches.length === 1, 'SOURCE_LITERAL_ASSIGNMENT');
  const start = matches[0].index + matches[0][0].length;
  need(source[start] === '[', 'SOURCE_LITERAL_ARRAY'); const tree = literalTree(source, start);
  need(/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(tree.end)) && tree.elements?.length > 0
    && tree.elements.every(x => plain(x.value)), 'SOURCE_LITERAL_BANK');
  return { source, tree };
}
function executedBank(raw) {
  need(raw.length <= MAX_SOURCE, 'SOURCE_SIZE');
  try {
    // Construct exposed objects inside the VM so their constructors cannot
    // refer back to the host realm's Function implementation.
    const ctx = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
    new vm.Script('globalThis.window = {}; globalThis.console = { log() {}, warn() {}, error() {} };')
      .runInContext(ctx, { timeout: 3000 });
    new vm.Script(raw.toString('utf8'), { filename: 'immutable-source-bank.js' }).runInContext(ctx, { timeout: 3000 });
    const json = new vm.Script(`(() => {
      const bank = window.questionBank || window.questions || globalThis.questionBank || globalThis.questions || window.examData?.questions;
      if (!Array.isArray(bank) || !bank.length) throw new Error('bank');
      const seen = new Set();
      function data(v) {
        if (v === null || typeof v === 'string' || typeof v === 'boolean') return;
        if (typeof v === 'number' && Number.isFinite(v)) return;
        if (!v || typeof v !== 'object' || seen.has(v)) throw new Error('data');
        seen.add(v);
        if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype) throw new Error('object');
        const ds = Object.getOwnPropertyDescriptors(v);
        for (const k of Reflect.ownKeys(ds)) {
          if (Array.isArray(v) && k === 'length') continue;
          const d = ds[k];
          if (typeof k !== 'string' || !d.enumerable || !('value' in d)) throw new Error('descriptor');
          data(d.value);
        }
        if (Array.isArray(v) && Object.keys(v).length !== v.length) throw new Error('array');
        seen.delete(v);
      }
      data(bank); return JSON.stringify(bank);
    })()`).runInContext(ctx, { timeout: 3000 });
    const bank = JSON.parse(json);
    need(Array.isArray(bank) && bank.length > 0 && bank.every(plain), 'EXECUTED_BANK'); return bank;
  } catch (error) { if (error.message.startsWith('SOURCE_IMAGE_REPAIR8:')) throw error; fail('SOURCE_EXECUTION'); }
}
function identityAt(identity, resolver, file, bank, change) {
  const sourceArchiveFile = file.path.slice('archive/exams/'.length);
  const rows = identity.records.filter(r => r.sourceArchiveFile === sourceArchiveFile);
  need(rows.length === bank.length && new Set(rows.map(r => r.sourceOrdinal)).size === bank.length
    && rows.every(r => Number.isSafeInteger(r.sourceOrdinal) && r.sourceOrdinal > 0 && r.sourceOrdinal <= bank.length), 'IDENTITY_DENOMINATOR');
  const matches = identity.records.filter(r => r.questionUid === change.questionUid), record = matches[0];
  need(matches.length === 1 && record.sourceArchiveFile === sourceArchiveFile && record.sourceOrdinal === change.sourceOrdinal,
    'IDENTITY_UID_JOIN');
  const byUid = resolver.resolve({ questionUid: change.questionUid }), byOrdinal = resolver.resolve({ sourceArchiveFile, sourceOrdinal: change.sourceOrdinal });
  need(byUid.status === 'RESOLVED_CANONICAL_UID' && byOrdinal.status === 'RESOLVED_SOURCE_ORDINAL'
    && [byUid, byOrdinal].every(r => r.questionUid === change.questionUid && r.sourceArchiveFile === sourceArchiveFile
      && r.sourceOrdinal === change.sourceOrdinal), 'IDENTITY_LOOKUP_JOIN');
  const q = bank[change.sourceOrdinal - 1];
  need(!Object.hasOwn(q, 'sourceOrdinal') || q.sourceOrdinal === change.sourceOrdinal, 'SOURCE_ORDINAL');
  need(!Object.hasOwn(q, 'questionUid') || q.questionUid === change.questionUid || isUnambiguousLegacySourceUidAlias({
    question: q, sourceArchiveFile, sourceOrdinal: change.sourceOrdinal, identityRecord: record, identityMap: identity, bank }), 'EXPLICIT_SOURCE_UID');
}
function isolatedOutput(root, out) {
  need(typeof out === 'string' && path.isAbsolute(out), 'ABSOLUTE_OUTPUT');
  const repo = fs.realpathSync(root), resolved = path.resolve(out), parent = fs.realpathSync(path.dirname(out));
  need(path.join(parent, path.basename(out)) === resolved && resolved !== repo && !resolved.startsWith(repo + path.sep)
    && !repo.startsWith(resolved + path.sep) && !fs.existsSync(resolved), 'ISOLATED_NEW_OUTPUT');
  return resolved;
}

/** Read immutable current source, change exactly eight image URI literals, then
 * execute both whole banks to prove every other own field and suffix effect. */
export function materializeM2ProblemImageRepair8({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, write = false }) {
  need(write === false || write === true, 'WRITE_BOOLEAN');
  keys(manifest, ['schemaVersion', 'transportProfile', 'materializationId', 'baseCommit', 'identityRef', 'staticEvidenceRef', 'outputScope', 'files'], 'MANIFEST_SHAPE');
  need(manifest.schemaVersion === M2_PROBLEM_IMAGE_REPAIR8_SCHEMA && manifest.transportProfile === M2_PROBLEM_IMAGE_REPAIR8_PROFILE
    && /^[a-z0-9][a-z0-9-]{5,80}$/.test(manifest.materializationId || ''), 'MANIFEST_PROFILE');
  need(SHA1.test(baseCommit || '') && SHA1.test(inputCommit || '') && baseCommit !== inputCommit
    && manifest.baseCommit === baseCommit, 'MANIFEST_BASE');
  need(git(repoRoot, ['cat-file', '-t', inputCommit], 1024).toString().trim() === 'commit', 'INPUT_COMMIT_OBJECT');
  need(equal(manifest.outputScope, filesInScope) && Array.isArray(manifest.files) && manifest.files.length === 2
    && equal(manifest.files.map(f => f.path), filesInScope), 'FILE_SCOPE');
  keys(manifest.identityRef, ['path', 'blobSha1', 'sha256'], 'IDENTITY_REF');
  need(manifest.identityRef.path === IDENTITY && SHA1.test(manifest.identityRef.blobSha1) && SHA256.test(manifest.identityRef.sha256), 'IDENTITY_REF');
  const identityRaw = gitBytes(repoRoot, baseCommit, IDENTITY, 192 * 1024 * 1024); assertPair(identityRaw, manifest.identityRef, 'IDENTITY_DRIFT');
  let identity; try { identity = JSON.parse(identityRaw); } catch { fail('IDENTITY_JSON'); }
  need(identity.schemaVersion === 'question-identity-map-v1' && Array.isArray(identity.records), 'IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity), review = staticReview(repoRoot, manifest.staticEvidenceRef, inputCommit);
  const reviewed = new Map(review.rows.map(r => [r.key, r])), seen = new Set(), output = [], selection = [];
  for (const file of manifest.files) {
    keys(file, ['path', 'sourceBeforeRef', 'after', 'expectedQuestionCount', 'changes'], 'FILE_SHAPE');
    hashPair(file.after, 'AFTER_REF');
    const raw = immutableRef(repoRoot, file.sourceBeforeRef, { expectedPath: file.path, expectedCommit: baseCommit, inputCommit, max: MAX_SOURCE });
    const before = executedBank(raw), literal = layout(raw);
    need(Number.isSafeInteger(file.expectedQuestionCount) && file.expectedQuestionCount === before.length
      && literal.tree.elements.length === before.length, 'SOURCE_DENOMINATOR');
    const scope = M2_PROBLEM_IMAGE_REPAIR8_SCOPE.filter(r => r.sourcePath === file.path);
    need(Array.isArray(file.changes) && file.changes.length === scope.length, 'CHANGE_SCOPE');
    const edits = [], wanted = structuredClone(before);
    for (const change of file.changes) {
      keys(change, ['key', 'questionUid', 'sourceOrdinal', 'wholeQuestionBeforeSha256', 'imageBefore', 'imageAfter', 'oldAssetRef', 'newAssetRef'], 'CHANGE_SHAPE');
      const fixed = scoped.get(change.key);
      need(fixed && fixed.sourcePath === file.path && fixed.questionUid === change.questionUid
        && fixed.sourceOrdinal === change.sourceOrdinal && !seen.has(change.key), 'CHANGE_FIXED_SCOPE'); seen.add(change.key);
      need(SHA256.test(change.wholeQuestionBeforeSha256) && sha(stable(before[change.sourceOrdinal - 1])) === change.wholeQuestionBeforeSha256,
        'WHOLE_QUESTION_BEFORE');
      need(change.imageBefore === fixed.oldAssetPath.slice('archive/'.length) && change.imageAfter === fixed.newAssetPath.slice('archive/'.length)
        && change.imageBefore !== change.imageAfter, 'IMAGE_URI_SCOPE');
      identityAt(identity, resolver, file, before, change);
      need(change.wholeQuestionBeforeSha256 === reviewed.get(change.key).wholeQuestionBeforeSha256,
        'STATIC_CURRENT_WHOLE_QUESTION');
      const q = before[change.sourceOrdinal - 1], node = literal.tree.elements[change.sourceOrdinal - 1].members?.get('image');
      need(Object.hasOwn(q, 'image') && typeof q.image === 'string' && q.image === change.imageBefore
        && node && typeof node.value === 'string' && node.value === change.imageBefore, 'IMAGE_BEFORE');
      immutableRef(repoRoot, change.oldAssetRef, { expectedPath: fixed.oldAssetPath, expectedCommit: baseCommit, inputCommit });
      for (const key of ['path', 'gitBlobSha1', 'sha256', 'bytes'])
        need(change.oldAssetRef[key] === reviewed.get(change.key).oldAssetRef[key], 'STATIC_CURRENT_OLD_ASSET');
      need(equal(change.newAssetRef, reviewed.get(change.key).newAssetRef), 'ASSET_STATIC_JOIN');
      immutableRef(repoRoot, change.newAssetRef, { expectedPath: fixed.newAssetPath, inputCommit });
      edits.push({ start: node.start, end: node.end, before: literal.source.slice(node.start, node.end), after: JSON.stringify(change.imageAfter) });
      wanted[change.sourceOrdinal - 1].image = change.imageAfter;
      selection.push({ key: change.key, questionUid: change.questionUid, sourceOrdinal: change.sourceOrdinal,
        beforeWholeQuestionSha256: change.wholeQuestionBeforeSha256, afterWholeQuestionSha256: sha(stable(wanted[change.sourceOrdinal - 1])) });
    }
    let after = literal.source;
    for (const edit of [...edits].sort((a, b) => b.start - a.start)) after = after.slice(0, edit.start) + edit.after + after.slice(edit.end);
    const afterRaw = Buffer.from(after); assertPair(afterRaw, file.after, 'SOURCE_AFTER_DRIFT');
    const executed = executedBank(afterRaw);
    need(equal(executed, wanted), 'EXECUTED_WHOLE_BANK_DRIFT');
    // Inverse exactness also covers whitespace, comments, prefix, trailing
    // metadata statements, original PNG references and every unselected byte.
    let inverse = after;
    for (const edit of [...edits].sort((a, b) => a.start - b.start)) {
      const at = edit.start; need(inverse.slice(at, at + edit.after.length) === edit.after, 'PATCH_RANGE');
      inverse = inverse.slice(0, at) + edit.before + inverse.slice(at + edit.after.length);
    }
    need(inverse === literal.source, 'SOURCE_INVERSE_DRIFT');
    output.push({ path: file.path, raw: afterRaw, blobSha1: blob(afterRaw), sha256: sha(afterRaw), bytes: afterRaw.length,
      expectedQuestionCount: before.length, selectedCount: scope.length, nonselectedWholeQuestionsPreserved: before.length - scope.length });
  }
  need(seen.size === 8, 'EXACT_EIGHT_REQUIRED');
  if (write) {
    const target = isolatedOutput(repoRoot, outputRoot); fs.mkdirSync(target);
    for (const file of output) { const f = path.join(target, file.path); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, file.raw, { flag: 'wx' }); }
  }
  return { transportProfile: M2_PROBLEM_IMAGE_REPAIR8_PROFILE, requestCount: 0, preservationRequestCount: 0,
    selectedUidCount: 8, evidenceFileCount: 1, newApprovals: 0, approvalEffect: 'NONE', actualUi: 'PENDING',
    staticEvidenceRef: manifest.staticEvidenceRef, sourceFiles: output.map(({ raw, ...r }) => r), selection,
    evidenceTraversal: 'EXACT_STATIC_A1_A2_ORIGINAL61830_AND_CURRENT_SOURCE_IDENTITY', sourceFieldsChanged: ['image'],
    selectedOtherFieldsChanged: 0, nonselectedWholeQuestionChanges: 0, originalAssetsChanged: 0, sourcePrefixSuffixChanged: 0 };
}

export function validateM2ProblemImageRepair8Candidate({ root, baseCommit, inputCommit, envelope, manifestFile, files }) {
  need(!Object.hasOwn(envelope, 'preservationRequestRefs') && files.size === 1 && files.get(manifestFile.path) === manifestFile,
    'INPUT_GRAPH_SCOPE');
  return materializeM2ProblemImageRepair8({ repoRoot: root, manifest: manifestFile.value, baseCommit, inputCommit, write: false });
}
