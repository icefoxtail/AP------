import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';

// A separate closed transport for seven independently reviewed M2S1 problem SVGs.
// It changes only the existing src URI inside the exact content string, and grants no approval.
export const M2S1_SVG7_IMAGE_POINTER_PROFILE = 'M2S1_SVG7_IMAGE_POINTER_V1';
export const M2S1_SVG7_IMAGE_POINTER_SCHEMA = 'archive-m2s1-svg7-image-pointer-materialization-v1';
export const M2S1_SVG7_STATIC_SCHEMA = 'archive-independent-m2s1-svg7-image-pointer-static-v1';
export const M2S1_SVG7_REVIEWED_SOURCE_COMMIT = '13c39484af09ca5fc0606f1e219daf7412b80be3';
export const M2S1_SVG7_ASSET_COMMIT = 'c39e2b8a727d1b170980b9decd2288a56102622f';
export const M2S1_SVG7_SCOPE = Object.freeze([
  {
    "key": "E037-Q3",
    "questionUid": "qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6",
    "sourceOrdinal": 3,
    "sourcePath": "archive/exams/original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
    "expectedBankCount": 25,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "7d44b0918a0f96757c1e18fb84d2772cbbcf623df58cff7b80fdc32f318af954",
    "pointerContentAfterSha256": "895a9eea5c952b31f2d49537eb10731740e46cce1002508c443075bd212a91bf",
    "oldAssetPath": "archive/assets/images/22_풍덕중_1학기_기말_중2_수학/q3-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/22_풍덕중_1학기_기말_중2_수학/q3-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "27caa8994a054468dd026f6b8ae47ec0dd408d97",
    "approvedAssetSha256": "af71f9ee6722aeb6987a73c722ba21df63fe9f33955f51003bad340e08175e4d",
    "approvedAssetBytes": 4820,
    "reviewedSourceGitBlobSha1": "a7fc0cdc6da6bfd0adc32ab9349167aa7b20aa60",
    "reviewedSourceSha256": "ea388ffaf7d2476b6d8711a0441ea230c9ef48791aab424f334dbae25b9b7091",
    "reviewedSourceBytes": 43785,
    "reviewedWholeQuestionSha256": "f8fb35595c868ba7e776b258672e0e05058cd8280e575d4563d436a52e8f1b5b",
    "reviewedOldAssetGitBlobSha1": "448ffe347b4b0eca2e6341a12feecd7c947e89c5",
    "reviewedOldAssetSha256": "725ba8aba41346b89141ef56fec498446d459724298c20ed7868cc4f3a1fdb79",
    "reviewedOldAssetBytes": 4833
  },
  {
    "key": "E037-Q15",
    "questionUid": "qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5",
    "sourceOrdinal": 15,
    "sourcePath": "archive/exams/original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
    "expectedBankCount": 25,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "449e0183c205413b2713f1ad32c6f61132d95fa925cf12094b75f0e2acc0b2ff",
    "pointerContentAfterSha256": "ae251210ebb17bc10adca3a3ebedee784d1baf6694c7f86231898a693b05e9d9",
    "oldAssetPath": "archive/assets/images/22_풍덕중_1학기_기말_중2_수학/q15-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/22_풍덕중_1학기_기말_중2_수학/q15-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "a90c300439e84fce81d9e297da5ffc6830d8feff",
    "approvedAssetSha256": "02cd1d0cb64f3a233c4557290c6705aac512e1a957f2b7d3518bb66dde2ef659",
    "approvedAssetBytes": 4496,
    "reviewedSourceGitBlobSha1": "a7fc0cdc6da6bfd0adc32ab9349167aa7b20aa60",
    "reviewedSourceSha256": "ea388ffaf7d2476b6d8711a0441ea230c9ef48791aab424f334dbae25b9b7091",
    "reviewedSourceBytes": 43785,
    "reviewedWholeQuestionSha256": "39e7548bd5b1f355951af3175f800f15c0caf78ff66bea3968e1460e9d73b385",
    "reviewedOldAssetGitBlobSha1": "b5313cdfe0eaefb4a1e1e66fd891a894dd1f4a13",
    "reviewedOldAssetSha256": "ada2f5277fbefe53a6c2430f9496e24726baceec5e1f4e3da5802408f53c701a",
    "reviewedOldAssetBytes": 3800
  },
  {
    "key": "E048-Q11",
    "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
    "sourceOrdinal": 11,
    "sourcePath": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
    "expectedBankCount": 26,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "408a99b9df8929f90968afc8b535cb236770d7a7747046c1c0c8aa350fb1952f",
    "pointerContentAfterSha256": "13d15bdacdf1f28b15822bdc6018257739c95caf9658059ca48daa9bd8617357",
    "oldAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q11-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q11-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "1f7d7e789339248ae3b45d8d45f292fbb9170077",
    "approvedAssetSha256": "8b31d959fdd7a6530f41fe27b118c6a7e4fb6c965c4fe83d3e89581a399edb18",
    "approvedAssetBytes": 3708,
    "reviewedSourceGitBlobSha1": "4a4f1f4afd4883225ca50546b087753350e23f5e",
    "reviewedSourceSha256": "d76f1a3f1d461400d9b7d1a81f5fd8b2c42757bd4e907b40de3706e9d22a8292",
    "reviewedSourceBytes": 40746,
    "reviewedWholeQuestionSha256": "46ce0563ce15ebdcc12602063ea3035d6bb13313e25c548a6a8db59fa5c96dd8",
    "reviewedOldAssetGitBlobSha1": "1ed914150e78821b483b64c3199b769c4b047a6e",
    "reviewedOldAssetSha256": "51b55f0c613e748e0603830aba7545e52c83191b9c8c4dc9d0ec7371a5feba9f",
    "reviewedOldAssetBytes": 3585
  },
  {
    "key": "E048-Q13",
    "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
    "sourceOrdinal": 13,
    "sourcePath": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
    "expectedBankCount": 26,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "bb4eef9f3110f8b6b6122b0fafca46fdfa665239fd5244b4db7dc0777affaa87",
    "pointerContentAfterSha256": "c77607a63e93b08228866c04f3accf321dc4e24e9be7c448588206746d8a3f55",
    "oldAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q13-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q13-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "e28d5f2f62da3197ea2fd2a1571288e6023d479a",
    "approvedAssetSha256": "81346a2433a587cb88772e20fa4c6f164c0a6fb96fd07c118d49b34192642639",
    "approvedAssetBytes": 1715,
    "reviewedSourceGitBlobSha1": "4a4f1f4afd4883225ca50546b087753350e23f5e",
    "reviewedSourceSha256": "d76f1a3f1d461400d9b7d1a81f5fd8b2c42757bd4e907b40de3706e9d22a8292",
    "reviewedSourceBytes": 40746,
    "reviewedWholeQuestionSha256": "bb0b8f3e2d577a946b60f973ddb0e7b165278fa1c76cfecfa4a079a35caede30",
    "reviewedOldAssetGitBlobSha1": "4b608d172c395890ddb98cdf2510ec09aa81653b",
    "reviewedOldAssetSha256": "c807820458c76f031f8e3931e4d604ec2d5d8083966a6b979f1e8ccb45390a82",
    "reviewedOldAssetBytes": 1715
  },
  {
    "key": "E048-Q24",
    "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
    "sourceOrdinal": 24,
    "sourcePath": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
    "expectedBankCount": 26,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "9951ad1b6a8a99a8c451dd9ac69be067886a100e6a5fb900aba9a92ba79b4fee",
    "pointerContentAfterSha256": "d9af584877f4b25246daf17c39e7a540da03895f24a62be4b6f37b3acf072353",
    "oldAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q24-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q24-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "e77c366e63ffa891cb53ccd3b8b334e4c541a57a",
    "approvedAssetSha256": "2b6aa6539acbc4f713ef09d9c1968825b1138416dc953449bb0392209ea28ca0",
    "approvedAssetBytes": 3555,
    "reviewedSourceGitBlobSha1": "4a4f1f4afd4883225ca50546b087753350e23f5e",
    "reviewedSourceSha256": "d76f1a3f1d461400d9b7d1a81f5fd8b2c42757bd4e907b40de3706e9d22a8292",
    "reviewedSourceBytes": 40746,
    "reviewedWholeQuestionSha256": "39c34da8970ad529b9437f76b8ce737afdee4a651e6f835fe043f2fba9081eb6",
    "reviewedOldAssetGitBlobSha1": "7f6ebc1954127191b3bc1f15674d3d9ce7aa8dd4",
    "reviewedOldAssetSha256": "60bf21c0223580f9e3eb70649a1e33f0714e084e9e2bc0704007b9b41abd3d4c",
    "reviewedOldAssetBytes": 2802
  },
  {
    "key": "E045-Q24",
    "questionUid": "qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd",
    "sourceOrdinal": 24,
    "sourcePath": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
    "expectedBankCount": 24,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "ea1627aa0fe1f10699f827297ab398ecaf2ba831a0357929fa5a28d7c1ff6031",
    "pointerContentAfterSha256": "75a81e1bfe516de552634a89e99b49bac96d1fe7cb770afd55c1f8284e47d604",
    "oldAssetPath": "archive/assets/images/21_팔마중_1학기_기말_중2_수학/q24-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/21_팔마중_1학기_기말_중2_수학/q24-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "a8d2ae54732aa2dfaa70ab1bf921546ad7ed0443",
    "approvedAssetSha256": "81bfacebf6caae6165866314c38d456602cd4ef6894450dbf6076f5db0cfdb3c",
    "approvedAssetBytes": 10634,
    "reviewedSourceGitBlobSha1": "3cbdb607dca83425e506413bd993205c06089be8",
    "reviewedSourceSha256": "9617fc74fc0a109307a0bef5dbf16a06577fd9a1a19139b89ecd892f2681f4cb",
    "reviewedSourceBytes": 44622,
    "reviewedWholeQuestionSha256": "d075d4109a219af8f4cce602302124309912170814eee6de8f3a96aea0f9faed",
    "reviewedOldAssetGitBlobSha1": "44f4562ad4d8121bd42a90dd29e533f4ab7f2062",
    "reviewedOldAssetSha256": "ad1adb7fac2b8ca221a368128eb44b2d03f5a9f931c30b9db6b4ce00ff1e9943",
    "reviewedOldAssetBytes": 9906
  },
  {
    "key": "E045-Q15",
    "questionUid": "qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569",
    "sourceOrdinal": 15,
    "sourcePath": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
    "expectedBankCount": 24,
    "pointerField": "content",
    "pointerKind": "EXACT_SINGLE_IMG_SRC_URI",
    "reviewedContentSha256": "b887cad9f0f543cf32969ff876ea8a97bf6470a0ae419c8e217135a1d9c88560",
    "pointerContentAfterSha256": "8f566982bc978031c2a027378beca1091d177bc5a0a483a4a10f1fa62087702b",
    "oldAssetPath": "archive/assets/images/21_팔마중_1학기_기말_중2_수학/q15-problem-visual-v2.svg",
    "newAssetPath": "archive/assets/images/21_팔마중_1학기_기말_중2_수학/q15-problem-visual-v2-source-repair-r1.svg",
    "approvedAssetGitBlobSha1": "a132105374964cd92b36c935fdd0aa97666acfe5",
    "approvedAssetSha256": "909e5d8728f7035e2eabf89671372e18d9d4c0c72a7bd43f09feb6cf1462c4af",
    "approvedAssetBytes": 12366,
    "reviewedSourceGitBlobSha1": "3cbdb607dca83425e506413bd993205c06089be8",
    "reviewedSourceSha256": "9617fc74fc0a109307a0bef5dbf16a06577fd9a1a19139b89ecd892f2681f4cb",
    "reviewedSourceBytes": 44622,
    "reviewedWholeQuestionSha256": "ed83a08ad8162891c0dfae499756549c46fe7f28f2edb6d88b6242078b9f9a85",
    "reviewedOldAssetGitBlobSha1": "7fea8a225505940091563772a0edec5f6ae5957f",
    "reviewedOldAssetSha256": "ba26f74e47f3e5026d767b35ac501f848ff970c327e3b8f964f6cd2044616fbe",
    "reviewedOldAssetBytes": 12000
  }
].map(row => Object.freeze(row)));
const STATIC_PATH = 'docs/operations/m2s1-svg7-source-repair-20261116/independent-static-v1.json';
const STATIC_BASIS = Object.freeze({
  rootOriginalFreezeSha256: '4fd7aaedd5666a65ccb32c5eefaf413cddd6e38f43b422f47ab146d23bf07344',
  rootStaticReviewSha256: 'd1f99134c54bc2771b49817996ab0eafe5c3bf1e74aa82566afa01c750d891f5',
  ownedSvgManifestSha256: '5e2ee7da2b0ae1a5817051abca5c26474f9b2b641070a8e45cab9dca403b7d13',
  expectedDisplayFreezeSha256: 'ad2e0fdd5daeb21a38309faea04d16fa9f015c7ca2165c78e9bb8315764e439a',
});
const IDENTITY = 'archive/data/question_identity_map.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const MAX_SOURCE = 16 * 1024 * 1024, MAX_ASSET = 4 * 1024 * 1024;
const filesInScope = [...new Set(M2S1_SVG7_SCOPE.map(r => r.sourcePath))];
const scoped = new Map(M2S1_SVG7_SCOPE.map(r => [r.key, r]));
const fail = code => { throw new Error(`SOURCE_M2S1_SVG7:${code}`); };
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

// Strict JSON ranges preserve the existing content literal byte-for-byte except
// the one pinned img-src URI. No generic HTML rewriting or key insertion.
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
  let tree, literalEnd;
  if (source[start] === '[') { tree = literalTree(source, start); literalEnd = tree.end; }
  else {
    // E037/E045 use an existing JSON examData.questions literal followed by
    // this exact alias. Neither the object wrapper nor the alias is rewritten.
    need(/^window\.examData\.questions[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(start)), 'SOURCE_LITERAL_ARRAY');
    const objects = [...source.matchAll(/(?:^|\n)[ \t]*window\.examData[ \t]*=[ \t]*/gu)];
    need(objects.length === 1, 'SOURCE_LITERAL_EXAM_DATA');
    const objectStart = objects[0].index + objects[0][0].length;
    need(source[objectStart] === '{', 'SOURCE_LITERAL_EXAM_DATA');
    const object = literalTree(source, objectStart);
    need(object.end <= matches[0].index, 'SOURCE_LITERAL_EXAM_DATA_ORDER');
    tree = object.members?.get('questions'); literalEnd = object.end;
  }
  need(/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(literalEnd)) && tree?.elements?.length > 0
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
  } catch (error) { if (error.message.startsWith('SOURCE_M2S1_SVG7:')) throw error; fail('SOURCE_EXECUTION'); }
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

function checkedStaticReview(root, ref, inputCommit) {
  const raw = immutableRef(root, ref, { expectedPath: STATIC_PATH, inputCommit });
  const doc = parseJson(raw);
  keys(doc, ['schemaVersion', 'transportProfile', 'producer', 'reviewer', ...Object.keys(STATIC_BASIS), 'rows',
    'actualUi', 'newFullMathematicalQa', 'newNativeApprovals', 'newReview2Claims', 'newMetadataApprovals',
    'newDifficultyJudgments', 'newFourSlotVectors'], 'STATIC_SHAPE');
  need(doc.schemaVersion === M2S1_SVG7_STATIC_SCHEMA && doc.transportProfile === M2S1_SVG7_IMAGE_POINTER_PROFILE,
    'STATIC_PROFILE');
  need(doc.producer === 'GPT_REGISTRAR_REPAIR' && doc.reviewer === 'GPT_ROOT_C8F1B0BFB4FA'
    && doc.producer !== doc.reviewer, 'STATIC_INDEPENDENT_ROLES');
  for (const [key, value] of Object.entries(STATIC_BASIS)) need(doc[key] === value, 'STATIC_BASIS');
  need(doc.actualUi === 'PENDING' && doc.newFullMathematicalQa === false && doc.newNativeApprovals === 0
    && doc.newReview2Claims === 0 && doc.newMetadataApprovals === 0 && doc.newDifficultyJudgments === 0
    && doc.newFourSlotVectors === 0, 'STATIC_NO_APPROVAL');
  need(Array.isArray(doc.rows) && equal(doc.rows.map(r => r?.key), M2S1_SVG7_SCOPE.map(r => r.key)), 'STATIC_EXACT_SEVEN');
  const banks = new Map();
  for (const row of doc.rows) {
    keys(row, ['key', 'questionUid', 'sourceOrdinal', 'expectedBankCount', 'pointerField', 'pointerKind',
      'contentBeforeSha256', 'contentAfterSha256', 'beforeSourceRef', 'wholeQuestionBeforeSha256',
      'oldAssetRef', 'newAssetRef', 'staticDecision'], 'STATIC_ROW_SHAPE');
    const fixed = scoped.get(row.key);
    need(row.questionUid === fixed.questionUid && row.sourceOrdinal === fixed.sourceOrdinal
      && row.expectedBankCount === fixed.expectedBankCount && row.pointerField === 'content'
      && row.pointerKind === 'EXACT_SINGLE_IMG_SRC_URI'
      && row.staticDecision === 'ACCEPT_STATIC_DISPLAY_REPAIR', 'STATIC_ROW_SCOPE');
    need(row.contentBeforeSha256 === fixed.reviewedContentSha256
      && row.contentAfterSha256 === fixed.pointerContentAfterSha256, 'STATIC_CONTENT_DIGEST');
    need(row.beforeSourceRef?.commit === M2S1_SVG7_REVIEWED_SOURCE_COMMIT
      && row.beforeSourceRef?.path === fixed.sourcePath
      && row.beforeSourceRef?.gitBlobSha1 === fixed.reviewedSourceGitBlobSha1
      && row.beforeSourceRef?.sha256 === fixed.reviewedSourceSha256
      && row.beforeSourceRef?.bytes === fixed.reviewedSourceBytes, 'STATIC_FIXED_SOURCE');
    if (!banks.has(fixed.sourcePath)) {
      const b = immutableRef(root, row.beforeSourceRef, { expectedPath: fixed.sourcePath,
        expectedCommit: M2S1_SVG7_REVIEWED_SOURCE_COMMIT, inputCommit, max: MAX_SOURCE });
      banks.set(fixed.sourcePath, executedBank(b));
    }
    const bank = banks.get(fixed.sourcePath), q = bank[fixed.sourceOrdinal - 1];
    need(bank.length === fixed.expectedBankCount && q && String(q.id ?? q.number) === String(fixed.sourceOrdinal)
      && row.wholeQuestionBeforeSha256 === fixed.reviewedWholeQuestionSha256
      && sha(stable(q)) === fixed.reviewedWholeQuestionSha256, 'STATIC_FIXED_WHOLE_QUESTION');
    need(row.oldAssetRef?.commit === M2S1_SVG7_REVIEWED_SOURCE_COMMIT
      && row.oldAssetRef?.path === fixed.oldAssetPath
      && row.oldAssetRef?.gitBlobSha1 === fixed.reviewedOldAssetGitBlobSha1
      && row.oldAssetRef?.sha256 === fixed.reviewedOldAssetSha256
      && row.oldAssetRef?.bytes === fixed.reviewedOldAssetBytes, 'STATIC_FIXED_OLD_ASSET');
    immutableRef(root, row.oldAssetRef, { expectedPath: fixed.oldAssetPath,
      expectedCommit: M2S1_SVG7_REVIEWED_SOURCE_COMMIT, inputCommit });
    need(row.newAssetRef?.commit === M2S1_SVG7_ASSET_COMMIT && row.newAssetRef?.path === fixed.newAssetPath
      && row.newAssetRef?.gitBlobSha1 === fixed.approvedAssetGitBlobSha1
      && row.newAssetRef?.sha256 === fixed.approvedAssetSha256
      && row.newAssetRef?.bytes === fixed.approvedAssetBytes, 'STATIC_FIXED_NEW_ASSET');
    immutableRef(root, row.newAssetRef, { expectedPath: fixed.newAssetPath,
      expectedCommit: M2S1_SVG7_ASSET_COMMIT, inputCommit });
  }
  return doc;
}

function exactContentPointer(q, node, literal, fixed, change) {
  need(change.pointerField === 'content' && change.pointerKind === 'EXACT_SINGLE_IMG_SRC_URI'
    && change.pointerBefore === fixed.oldAssetPath.slice('archive/'.length)
    && change.pointerAfter === fixed.newAssetPath.slice('archive/'.length)
    && change.pointerBefore !== change.pointerAfter, 'POINTER_FIXED_SCOPE');
  need(Object.hasOwn(q, 'content') && typeof q.content === 'string'
    && node && typeof node.value === 'string' && node.value === q.content, 'CONTENT_EXISTING_LITERAL');
  need(change.contentBeforeSha256 === fixed.reviewedContentSha256 && sha(q.content) === fixed.reviewedContentSha256,
    'CONTENT_BEFORE');
  const oldUri = change.pointerBefore, newUri = change.pointerAfter;
  const tags = [...q.content.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])([^"']+)\1[^>]*>/giu)];
  need(q.content.split(oldUri).length === 2 && tags.filter(x => x[2] === oldUri).length === 1
    && !q.content.includes(newUri), 'ONE_EXISTING_IMG_SRC');
  const beforeToken = literal.source.slice(node.start, node.end);
  need(beforeToken.split(oldUri).length === 2 && !beforeToken.includes(newUri)
    && literal.source.split(oldUri).length === 2 && !literal.source.includes(newUri), 'POINTER_LITERAL_UNIQUE');
  const nextContent = q.content.replace(oldUri, newUri);
  need(change.contentAfterSha256 === fixed.pointerContentAfterSha256
    && sha(nextContent) === fixed.pointerContentAfterSha256, 'CONTENT_AFTER');
  const afterToken = beforeToken.replace(oldUri, newUri);
  need(JSON.parse(afterToken) === nextContent && afterToken.replace(newUri, oldUri) === beforeToken,
    'CONTENT_LITERAL_INVERSE');
  const at = node.start + beforeToken.indexOf(oldUri);
  return { content: nextContent, edit: { start: at, end: at + oldUri.length, before: oldUri, after: newUri } };
}

/** Only seven exact, already independently reviewed img-src URI replacements.
 * Full parsed banks and inverse source bytes retain every other field and byte. */
export function materializeM2s1Svg7ImagePointer({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, write = false }) {
  need(write === false || write === true, 'WRITE_BOOLEAN');
  keys(manifest, ['schemaVersion', 'transportProfile', 'materializationId', 'baseCommit', 'identityRef',
    'staticEvidenceRef', 'outputScope', 'files'], 'MANIFEST_SHAPE');
  need(manifest.schemaVersion === M2S1_SVG7_IMAGE_POINTER_SCHEMA
    && manifest.transportProfile === M2S1_SVG7_IMAGE_POINTER_PROFILE
    && /^[a-z0-9][a-z0-9-]{5,80}$/.test(manifest.materializationId || ''), 'MANIFEST_PROFILE');
  need(SHA1.test(baseCommit || '') && SHA1.test(inputCommit || '') && baseCommit !== inputCommit
    && manifest.baseCommit === baseCommit, 'MANIFEST_BASE');
  need(git(repoRoot, ['cat-file', '-t', inputCommit], 1024).toString().trim() === 'commit', 'INPUT_COMMIT_OBJECT');
  need(equal(manifest.outputScope, filesInScope) && Array.isArray(manifest.files) && manifest.files.length === 3
    && equal(manifest.files.map(f => f.path), filesInScope), 'FILE_SCOPE');
  keys(manifest.identityRef, ['path', 'blobSha1', 'sha256'], 'IDENTITY_REF');
  need(manifest.identityRef.path === IDENTITY && SHA1.test(manifest.identityRef.blobSha1)
    && SHA256.test(manifest.identityRef.sha256), 'IDENTITY_REF');
  const identityRaw = gitBytes(repoRoot, baseCommit, IDENTITY, 192 * 1024 * 1024);
  assertPair(identityRaw, manifest.identityRef, 'IDENTITY_DRIFT');
  const identity = parseJson(identityRaw);
  need(identity.schemaVersion === 'question-identity-map-v1' && Array.isArray(identity.records), 'IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity);
  const review = checkedStaticReview(repoRoot, manifest.staticEvidenceRef, inputCommit);
  const reviewed = new Map(review.rows.map(r => [r.key, r])), seen = new Set(), output = [], selection = [];
  for (const file of manifest.files) {
    keys(file, ['path', 'sourceBeforeRef', 'after', 'expectedQuestionCount', 'changes'], 'FILE_SHAPE');
    hashPair(file.after, 'AFTER_REF');
    const raw = immutableRef(repoRoot, file.sourceBeforeRef, { expectedPath: file.path, expectedCommit: baseCommit,
      inputCommit, max: MAX_SOURCE });
    const before = executedBank(raw), literal = layout(raw);
    const scope = M2S1_SVG7_SCOPE.filter(r => r.sourcePath === file.path);
    need(Number.isSafeInteger(file.expectedQuestionCount) && file.expectedQuestionCount === scope[0].expectedBankCount
      && before.length === file.expectedQuestionCount && literal.tree.elements.length === before.length, 'SOURCE_DENOMINATOR');
    need(Array.isArray(file.changes) && file.changes.length === scope.length, 'CHANGE_SCOPE');
    const edits = [], wanted = structuredClone(before);
    for (const change of file.changes) {
      keys(change, ['key', 'questionUid', 'sourceOrdinal', 'wholeQuestionBeforeSha256', 'pointerField', 'pointerKind',
        'pointerBefore', 'pointerAfter', 'contentBeforeSha256', 'contentAfterSha256', 'oldAssetRef', 'newAssetRef'], 'CHANGE_SHAPE');
      const fixed = scoped.get(change.key);
      need(fixed && fixed.sourcePath === file.path && fixed.questionUid === change.questionUid
        && fixed.sourceOrdinal === change.sourceOrdinal && !seen.has(change.key), 'CHANGE_FIXED_SCOPE');
      seen.add(change.key);
      const q = before[change.sourceOrdinal - 1];
      need(q && String(q.id ?? q.number) === String(change.sourceOrdinal)
        && change.wholeQuestionBeforeSha256 === fixed.reviewedWholeQuestionSha256
        && sha(stable(q)) === fixed.reviewedWholeQuestionSha256, 'STATIC_CURRENT_WHOLE_QUESTION');
      identityAt(identity, resolver, file, before, change);
      const node = literal.tree.elements[change.sourceOrdinal - 1].members?.get('content');
      const patch = exactContentPointer(q, node, literal, fixed, change);
      immutableRef(repoRoot, change.oldAssetRef, { expectedPath: fixed.oldAssetPath, expectedCommit: baseCommit, inputCommit });
      for (const key of ['path', 'gitBlobSha1', 'sha256', 'bytes'])
        need(change.oldAssetRef[key] === reviewed.get(change.key).oldAssetRef[key], 'STATIC_CURRENT_OLD_ASSET');
      need(equal(change.newAssetRef, reviewed.get(change.key).newAssetRef), 'ASSET_STATIC_JOIN');
      immutableRef(repoRoot, change.newAssetRef, { expectedPath: fixed.newAssetPath,
        expectedCommit: M2S1_SVG7_ASSET_COMMIT, inputCommit });
      edits.push(patch.edit);wanted[change.sourceOrdinal - 1].content = patch.content;
      selection.push({ key:change.key, questionUid:change.questionUid, sourceOrdinal:change.sourceOrdinal,
        beforeWholeQuestionSha256:change.wholeQuestionBeforeSha256,
        afterWholeQuestionSha256:sha(stable(wanted[change.sourceOrdinal - 1])),
        pointerField:'content', pointerKind:'EXACT_SINGLE_IMG_SRC_URI', contentBeforeSha256:change.contentBeforeSha256,
        contentAfterSha256:change.contentAfterSha256 });
    }
    let after = literal.source;
    for (const edit of [...edits].sort((a,b) => b.start-a.start))
      after = after.slice(0,edit.start)+edit.after+after.slice(edit.end);
    const afterRaw = Buffer.from(after);assertPair(afterRaw,file.after,'SOURCE_AFTER_DRIFT');
    need(equal(executedBank(afterRaw),wanted),'EXECUTED_WHOLE_BANK_DRIFT');
    let inverse=after;
    for (const edit of [...edits].sort((a,b) => a.start-b.start)) {
      need(inverse.slice(edit.start,edit.start+edit.after.length) === edit.after,'PATCH_RANGE');
      inverse=inverse.slice(0,edit.start)+edit.before+inverse.slice(edit.start+edit.after.length);
    }
    need(inverse === literal.source,'SOURCE_INVERSE_DRIFT');
    output.push({path:file.path,raw:afterRaw,blobSha1:blob(afterRaw),sha256:sha(afterRaw),bytes:afterRaw.length,
      expectedQuestionCount:before.length,selectedCount:scope.length,nonselectedWholeQuestionsPreserved:before.length-scope.length});
  }
  need(seen.size === 7,'EXACT_SEVEN_REQUIRED');
  if (write) {
    const target=isolatedOutput(repoRoot,outputRoot);fs.mkdirSync(target);
    for (const file of output) {const p=path.join(target,file.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,file.raw,{flag:'wx'});}
  }
  return {transportProfile:M2S1_SVG7_IMAGE_POINTER_PROFILE,requestCount:0,preservationRequestCount:0,selectedUidCount:7,
    evidenceFileCount:1,newApprovals:0,approvalEffect:'NONE',actualUi:'PENDING',staticEvidenceRef:manifest.staticEvidenceRef,
    sourceFiles:output.map(({raw,...r})=>r),selection,evidenceTraversal:'EXACT_ROOT_STATIC7_CURRENT_WHOLE_SOURCE_AND_IDENTITY',
    sourceFieldsChanged:['content'],literalChangeKind:'EXACT_SINGLE_IMG_SRC_URI_ONLY',selectedOtherFieldsChanged:0,
    nonselectedWholeQuestionChanges:0,originalAssetsChanged:0,sourcePrefixSuffixChanged:0};
}

export function validateM2s1Svg7ImagePointerCandidate({root,baseCommit,inputCommit,envelope,manifestFile,files}) {
  need(!Object.hasOwn(envelope,'preservationRequestRefs') && files.size === 1 && files.get(manifestFile.path) === manifestFile,
    'INPUT_GRAPH_SCOPE');
  return materializeM2s1Svg7ImagePointer({repoRoot:root,manifest:manifestFile.value,baseCommit,inputCommit,write:false});
}


