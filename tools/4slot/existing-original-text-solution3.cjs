'use strict';
// Only an internal asset-presence permission for three previously registered
// vectors. The caller still verifies immutable sources, Native authority,
// full-bank identity/vector/MD equality, independent static evidence and actual
// solution UI. This module neither normalizes a source nor returns approval.
const crypto = require('node:crypto');
const SCHEMA = 'archive-existing-vector-original-solution-text-figure-v1';
const PREFIX = 'EXISTING_ORIGINAL_TEXT_SOLUTION3_';
const OID = /^[a-f0-9]{40}$/;
const own = (x, k) => Object.prototype.hasOwnProperty.call(x || {}, k);
const object = x => !!x && typeof x === 'object' && !Array.isArray(x);
const stable = x => JSON.stringify(x, (_, v) => object(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const hash = x => crypto.createHash('sha256').update(stable(x)).digest('hex');
const equal = (a, b) => stable(a) === stable(b);
const fail = code => { throw Error(PREFIX + code); };
const exact = (x, keys, code) => {
  if (!object(x) || !equal(Object.keys(x).sort(), [...keys].sort())) fail(code + '_KEYS');
};
function freeze(x) {
  if (x && typeof x === 'object') { Object.values(x).forEach(freeze); Object.freeze(x); }
  return x;
}
// Hash-only bindings to the immutable original/current public sources and the
// exact new SVG. Private solution text and prior reviewer conclusions are not
// embedded in these constants.
const SUBJECTS = freeze([
  {
    "key": "E044-Q21",
    "nativeItemSha256": "52365dd1d1e5019931a4d112fc65b4b7a9f356d79a45aa9596325d8d705fc724",
    "questionUid": "qid_v1_1554811ec6e62874443dc420e0fb4252a3f65e4279e3c1dd3c06bd30127c073a",
    "sourceOrdinal": 21,
    "sourceQuestionNo": "21",
    "sourceQuestionCount": 24,
    "surface": "SOLUTION",
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "gitBlobSha1": "98c73ce210f2ac806c231c11a0beb31c6e008e93",
      "sha256": "44963a42f426ccf2aedc6888018a16dcb60f7faa1bd22054bb85e9ee66ed5e4e",
      "bytes": 49196
    },
    "currentSourceRef": {
      "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
      "path": "archive/exams/original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "gitBlobSha1": "2956e5636732240120db8891993694eab699944c",
      "sha256": "0a077578327834561e6a90731289e8c9d6752684d2765c9b857a4c5fc22721e5",
      "bytes": 51162
    },
    "priorQuestionSha256": "8a77c8582220a34735bd1b73f1b934b2d9eeb4ddbcc4b35fca50e0ec6b92ac1d",
    "currentQuestionSha256": "7f99dc464645061333220795d9d0d7b09595903a4ff45eb190e4698125af33ec",
    "changedFields": [
      {
        "field": "solutionImage",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "ab9ee5cd539c2e9264fcabce363a060e6bfe0b2cb0267ee3c24933446dc33599"
      },
      {
        "field": "solutionImageAlt",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "4007409f44484a595a7b1a071e347c06e313abd1b100e8ae269dd8b62444f628"
      },
      {
        "field": "solutionImageCaption",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "5c497f1cba2cd5621209e6b5098b45ba4d25e26c9f035504b2612ecbbe150a88"
      },
      {
        "field": "solutionImageSize",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "e35e20b103860e7c8606a3419bb574aa5257b3fdebb994bf6ab9974394fb4267"
      }
    ],
    "priorAssets": [],
    "currentAssets": [
      {
        "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
        "path": "archive/assets/images/21_이수중_1학기_기말_중2_수학/q21-solution-visual-v2.svg",
        "gitBlobSha1": "e92285ac3c46808090258d093ba704da5e3734d3",
        "sha256": "06c151b67ae25fa8e1d351c01d3d9819a0b0384f1072576f306610a5ec9b53a5",
        "bytes": 2983
      }
    ],
    "vectorSha256": "8872669fadc7a40583fdb013ff8b5bd1fe228ce5abc67a55b0ee5a8da04cc4bb",
    "priorMetadataSha256": "84b55ecf8994d48d9bd0274f2201a81afba71ffb198e7d9ab7cb52597f10aadb",
    "priorIdentitySha256": "80cddcdf2ed1c68d4914e109fa3b266efeaff589373c590fb7e8f69ecc5cc07b",
    "inlineEdits": []
  },
  {
    "key": "E044-Q24",
    "nativeItemSha256": "a71c90fb63c592e54a145b778e2b45c36d5144b72f9b83d577ebd24a10476dea",
    "questionUid": "qid_v1_a34dd926bbebe44733ec9bc8421e99b688f5d9bea46e0d6ae0c5e89c80bc173e",
    "sourceOrdinal": 24,
    "sourceQuestionNo": "24",
    "sourceQuestionCount": 24,
    "surface": "SOLUTION",
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "gitBlobSha1": "98c73ce210f2ac806c231c11a0beb31c6e008e93",
      "sha256": "44963a42f426ccf2aedc6888018a16dcb60f7faa1bd22054bb85e9ee66ed5e4e",
      "bytes": 49196
    },
    "currentSourceRef": {
      "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
      "path": "archive/exams/original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "gitBlobSha1": "2956e5636732240120db8891993694eab699944c",
      "sha256": "0a077578327834561e6a90731289e8c9d6752684d2765c9b857a4c5fc22721e5",
      "bytes": 51162
    },
    "priorQuestionSha256": "0fcad6c38deee066370a17b5f1e65eb2d2fcaeb03223a6164663f8bb00d2e73a",
    "currentQuestionSha256": "49e53a25b5e3a1833c8fd9abf589c2e0fffdd10dfcfc9d91f827b95acdd0790f",
    "changedFields": [
      {
        "field": "solutionImage",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "109d09a91441dbae9f046c851baeaf8dde8b422821685c611a7794eff70d6209"
      },
      {
        "field": "solutionImageAlt",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "df86c6a84f018dbf7da509399b04385c6827b10d24063abb9e00cf92ae0d4810"
      },
      {
        "field": "solutionImageCaption",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "fe4d8894a3ec71028c3072efdf73788f7be1c19c2754ee7d87fe6e611eb62aa8"
      },
      {
        "field": "solutionImageSize",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "e35e20b103860e7c8606a3419bb574aa5257b3fdebb994bf6ab9974394fb4267"
      }
    ],
    "priorAssets": [],
    "currentAssets": [
      {
        "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
        "path": "archive/assets/images/21_이수중_1학기_기말_중2_수학/q24-solution-visual-v2.svg",
        "gitBlobSha1": "e168be79b029c05a8185412e2164be1ca6217307",
        "sha256": "6bf407945083b3420b31794a8a0de1f1b469a724e904639a3748af4ca4a80d48",
        "bytes": 7328
      }
    ],
    "vectorSha256": "c2c45934a551adf4b4a8fac8f5dfe38aa8bbf93131ad72b88f929a4dcd347a6d",
    "priorMetadataSha256": "dc28432e303c96f82bdf2e24df7fdb0b6ddc92972dc77e2c1f21aabf24a9c6f4",
    "priorIdentitySha256": "f7f162cc5b3cfc487f82e66294068967c8a0bcf4068d2bebbd52f86d90642a52",
    "inlineEdits": []
  },
  {
    "key": "E051-Q15",
    "nativeItemSha256": "ab024cfbcd74ca8245643a402734a1a1d46911b8fddc7f0c6cd3209735466e38",
    "questionUid": "qid_v1_afdacbb3734acfe658f8d1f2f820c0f23554c0d762412e449d0993e7e757c957",
    "sourceOrdinal": 15,
    "sourceQuestionNo": "15",
    "sourceQuestionCount": 24,
    "surface": "SOLUTION",
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "ca6696cfda0af3138a2b04ea5226afb9290a08fe",
      "sha256": "b7e19578c5c4ca232a046929a096eb02f7fe5a62ef1c9a3bc4e411d8d8d76b7d",
      "bytes": 31353
    },
    "currentSourceRef": {
      "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
      "path": "archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "621d0dc7b3716e684c9a700036f5389702db21c4",
      "sha256": "a495ec0a366e80af8729186ec243d694181bb28ba18e783e837c61e37c6ac44d",
      "bytes": 31121
    },
    "priorQuestionSha256": "047bf96cf13075aa96da64d4fc5bc180597f6e819a1ba028a2b9b7ad56bc1e8c",
    "currentQuestionSha256": "fe909e4720826141cac0e2ee64637ccfa53c77f20f574e3fd470bcd8cd1ccd2b",
    "changedFields": [
      {
        "field": "solutionImage",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "506759da0faf9a43eb7efc0fa8b49ffd0b14ecd17cd549100aedbbbb2fb13213"
      },
      {
        "field": "solutionImageAlt",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "d7c475e7bfa01068005cb71c6593028ff40a87ccabdac3723cd80d70216c36b3"
      },
      {
        "field": "solutionImageCaption",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "3b373aaa95865277e9ca9b311f371652d72143b1bd5c4eec09c7cc67bce3a095"
      },
      {
        "field": "solutionImageSize",
        "beforeOwnSha256": "398b676e47d03a29016ee92fe378b8b4f1b3e965390c4c64ce78d27f79df74d1",
        "afterOwnSha256": "e35e20b103860e7c8606a3419bb574aa5257b3fdebb994bf6ab9974394fb4267"
      }
    ],
    "priorAssets": [],
    "currentAssets": [
      {
        "commit": "d7111057c89ad4f4a418e2805eeeb1b04447f99f",
        "path": "archive/assets/images/21_왕운중_1학기_중간_중2_기출/q15-solution-visual-v2.svg",
        "gitBlobSha1": "408651273cca0b61f3923967f69452fdd0e296af",
        "sha256": "f86aaacfd97aa3beab83304003041cdc2403f7e3d5f0558a66c5c3f200b23478",
        "bytes": 4956
      }
    ],
    "vectorSha256": "8428a46dfc3644e499b6a7778f8d1331aaa4e6fb31acc0c2fcb0362be30e7b04",
    "priorMetadataSha256": "c3d7d3fb55a6053516765acdeea049250e2660a69bce2f5187e215bb2b9e3969",
    "priorIdentitySha256": "50cd5e4b504b82496ba55f4f67fe064ca69bc0bff63bcdf50bfdc068883ff404",
    "inlineEdits": []
  }
]);
const BINDING_KEYS = ['questionUid','sourceOrdinal','sourceQuestionNo','sourceQuestionCount','surface',
  'priorSourceRef','currentSourceRef','priorQuestionSha256','currentQuestionSha256','changedFields',
  'priorAssets','currentAssets','vectorSha256','priorMetadataSha256','priorIdentitySha256','inlineEdits'];
const REF_KEYS = ['commit','path','gitBlobSha1','sha256','bytes'];
const IMAGE_FIELDS = ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize'];
function refMatches(actual, expected, {sameCommit = true} = {}) {
  exact(actual, REF_KEYS, 'REF');
  if (!OID.test(actual.commit || '') || ['path','gitBlobSha1','sha256','bytes'].some(k => actual[k] !== expected[k]) ||
      sameCommit && actual.commit !== expected.commit) fail('IMMUTABLE_REF');
}
function checkExactBinding(claim, binding) {
  exact(claim, ['schemaVersion'], 'OPT_IN');
  if (claim.schemaVersion !== SCHEMA) fail('OPT_IN_SCHEMA');
  exact(binding, BINDING_KEYS, 'BINDING');
  const selected = SUBJECTS.filter(x => x.questionUid === binding.questionUid);
  if (selected.length !== 1) fail('UID_SCOPE');
  const subject = selected[0];
  for (const key of BINDING_KEYS.filter(k => !['priorSourceRef','currentSourceRef','currentAssets'].includes(k)))
    if (!equal(binding[key], subject[key])) fail('BINDING_' + key.toUpperCase());
  refMatches(binding.priorSourceRef, subject.priorSourceRef);
  // A current immutable checkout may have the same whole source/asset bytes.
  // The caller reads each commit:path and checks live bytes before this call.
  refMatches(binding.currentSourceRef, subject.currentSourceRef, {sameCommit:false});
  if (!Array.isArray(binding.currentAssets) || binding.currentAssets.length !== 1) fail('CURRENT_ASSET_INVENTORY');
  refMatches(binding.currentAssets[0], subject.currentAssets[0], {sameCommit:false});
  if (binding.currentAssets[0].commit !== binding.currentSourceRef.commit) fail('CURRENT_ASSET_CHECKOUT');
  return subject;
}
function checkOriginalTextFields(prior, current) {
  if (!object(prior) || !object(current)) fail('QUESTIONS_REQUIRED');
  if (!equal(Object.keys(prior).filter(k => /^solution/i.test(k)).sort(), ['solution']) ||
      !equal(Object.keys(current).filter(k => /^solution/i.test(k)).sort(), ['solution',...IMAGE_FIELDS].sort()))
    fail('SOLUTION_OWN_PRESENCE');
  if (typeof prior.solution !== 'string' || !prior.solution.length ||
      typeof current.solution !== 'string' || prior.solution !== current.solution) fail('SOLUTION_TEXT_CHANGED');
  if (own(prior, 'answer') !== own(current, 'answer') || !equal(prior.answer, current.answer)) fail('ANSWER_CHANGED');
  if (IMAGE_FIELDS.some(k => typeof current[k] !== 'string' || !current[k].length)) fail('CURRENT_DISPLAY_FIELDS');
}
function verifyOriginalTextSolutionFigure(args) {
  exact(args, ['claim','binding','priorQuestion','currentQuestion','nativeItemSha256'], 'ARGUMENT');
  const {claim,binding,priorQuestion,currentQuestion,nativeItemSha256} = args;
  const subject = checkExactBinding(claim, binding);
  if (nativeItemSha256 !== subject.nativeItemSha256) fail('NATIVE_ITEM_BINDING');
  if (hash(priorQuestion) !== subject.priorQuestionSha256 || hash(currentQuestion) !== subject.currentQuestionSha256)
    fail('WHOLE_QUESTION_BINDING');
  checkOriginalTextFields(priorQuestion, currentQuestion);
  return {schemaVersion:SCHEMA, questionUid:subject.questionUid, sourceOrdinal:subject.sourceOrdinal,
    surface:'SOLUTION', permittedPriorAssetCount:0, requiredCurrentAssetCount:1,
    independentStaticReviewStillRequired:true, actualSolutionUiStillRequired:true,
    newSemanticApproval:0, newFourSlotVector:0};
}
module.exports = {SCHEMA, SUBJECTS, checkExactBinding, checkOriginalTextFields, verifyOriginalTextSolutionFigure};
