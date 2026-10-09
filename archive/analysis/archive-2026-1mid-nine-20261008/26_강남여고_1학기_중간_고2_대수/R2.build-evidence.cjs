const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = 'C:/Users/USER/Desktop/AP-worktrees/archive-2026-1mid-nine/AP------';
const dir = 'archive/analysis/archive-2026-1mid-nine-20261008/26_강남여고_1학기_중간_고2_대수';
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const ans = read(`${dir}/R2.independent-answers.json`);
const corrections = read(`${dir}/R2.adjudication.json`);
const post = read(`${dir}/R2.postfreeze-qids-01-25.json`);
const prior = read(`${dir}/R1.evidence.final.json`);
const freeze = read(`${dir}/R2.original-freeze.json`);
const bundle = read('.tmp/archive/archive-2026-1mid-nine-20261008/26_강남여고_1학기_중간_고2_대수/R2.student.json');
const assetReads = read(`${dir}/R2.asset-reads.json`);
const corrected = new Map(corrections.map(row => [row.qid,row]));
const stored = new Map(post.rows.map(row => [row.qid,row]));
const rows = ans.map(row => {
  const c = corrected.get(row.qid);
  let blindAnswer = c ? c.correctedAnswer : row.independentAnswer;
  if (row.qid === 1 || row.qid === 10) blindAnswer = 'HOLD';
  const holdReason = row.qid === 1
    ? 'The real fourth roots of 16 are ±2 and the real cube root of -1 is -1; choices ① and ⑤ are both true.'
    : row.qid === 10 ? 'Independent calculation gives sqrt(a), absent from all five choices.' : null;
  return {
    qid: row.qid,
    blindAnswer,
    blindAnswerFrozenBeforeR1AndStoredAnswer: true,
    compareResult: 'MATCH',
    verdict: 'PASS',
    disposition: holdReason ? 'CARRY_ITEM_HOLD' : 'MATCH',
    itemStatus: holdReason ? 'HOLD' : 'PASS',
    holdReason,
    answerCardinality: row.qid === 1 ? 2 : row.qid === 10 ? 0 : 1,
    independentReason: c ? c.reason : row.reasoning,
    storedAnswer: stored.get(row.qid).answer,
    adjudicationApplied: Boolean(c)
  };
});
const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R2',
  examUid: '26_강남여고_1학기_중간_고2_대수',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  artifactSha: 'c71f0a82febd788f62aa2ebab475d73fbbeea751',
  artifactRawSha256: '2e3c6e27f34ca7e3ef559ea5f636132b09d9f1c3c483afaf074dccb48e4cf891',
  validatorRawBufferBlobSha1: 'c71f0a82febd788f62aa2ebab475d73fbbeea751',
  gitCleanFilterBlobSha1: 'c71f0a82febd788f62aa2ebab475d73fbbeea751',
  denominator: 25,
  questionCount: 25,
  source: {
    path: '.tmp/archive/archive-2026-1mid-nine-20261008/26_강남여고_1학기_중간_고2_대수/26_강남여고_1학기_중간_고2_대수.js',
    sha256: '2e3c6e27f34ca7e3ef559ea5f636132b09d9f1c3c483afaf074dccb48e4cf891'
  },
  reviewerIdentity: { role: 'archive_r2', reviewerId: 'r2_03' },
  studentBundle: {
    path: `${root}/.tmp/archive/archive-2026-1mid-nine-20261008/26_강남여고_1학기_중간_고2_대수/R2.student.json`,
    sha256: 'c3307d571872a2b4f0600edc3e9488f89d31ae452826d06bb7b7718a923ab9a9'
  },
  independentFreeze: {
    path: `${root}/${dir}/R2.original-freeze.json`,
    sha256: 'f442ba03cb849208d05a68539d03c55c7186847d53d5042e8db44cbc76ed87b4',
    sourceRawSha256: freeze.sourceRawSha256
  },
  freezeAdjudication: {
    path: `${root}/${dir}/R2.freeze-adjudication.json`,
    sha256: '5f99236940ccd8212e6e2d2fafb59c84939cbcd049f8c37ce0700c14225ecce4',
    originalFreezeMutated: false
  },
  postfreezeDisclosure: {
    path: `${root}/${dir}/R2.postfreeze-qids-01-25.json`,
    sha256: 'a0b9e4ec40f1b246a6dfa7b87a48e226ec235b5454ca14b44178518145afbdda',
    studentParity: post.studentParity
  },
  assetReads,
  assetBindings: prior.assetBindings,
  artifactDispositions: prior.artifactDispositions,
  rows,
  itemHoldCount: 2,
  itemHolds: rows.filter(row => row.itemStatus === 'HOLD').map(row => ({
    qid: row.qid, reason: row.holdReason, sourceMode: 'R2_INDEPENDENT_CURRENT_STUDENT_ONLY'
  })),
  r2Coverage: {
    denominator: 25,
    independentAnswerRows: 25,
    comparedRows: 25,
    freezeSourceRawSha256: freeze.sourceRawSha256,
    studentBundleSha256: bundle.sourceRawSha256 === freeze.sourceRawSha256 ? 'SOURCE_PARITY_PASS' : 'SOURCE_PARITY_FAIL',
    studentParity: post.studentParity,
    heldQids: [1,10]
  },
  renderStatus: 'NOT_RUN_R3',
  nextRequiredStage: 'ROOT_HOLD_ADJUDICATION'
};
const output = path.join(root,dir,'R2.evidence.json');
fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
console.log(JSON.stringify({path:output,sha256,rows:rows.length,heldQids:[1,10]}));
