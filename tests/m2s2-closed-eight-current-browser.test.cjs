'use strict';
// Boundary fixtures only. No Chrome, question-bank evaluation, Native approval or registration.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const C = require('../tools/check-m2s2-closed-eight-current-browser.cjs');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-m2s2-closed-eight-current-ui.json'), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const HEAD = '1'.repeat(40), REPOSITORY = 'icefoxtail/AP------';
const SUBJECTS = [
  {
    "key": "E017-Q04",
    "questionUid": "qid_v1_aa3c1ee5ab7ec90917755d06c8c44c1b8d06b3a14fde0c985c4fc769572eb51b",
    "sourceOrdinal": 4
  },
  {
    "key": "E017-Q05",
    "questionUid": "qid_v1_ef2f75003ed913b20f7bb4d1482589a1566675e22862440bf9c035c2da9b8490",
    "sourceOrdinal": 5
  },
  {
    "key": "E017-Q09",
    "questionUid": "qid_v1_7d1571b986962c1d131481898b66de1a5f13030e0a5c19a4435ccda48b68f1ad",
    "sourceOrdinal": 9
  },
  {
    "key": "E017-Q18",
    "questionUid": "qid_v1_e13b9dba98304967b524525611b6af91ed51580938601d9986ea7335cb415c67",
    "sourceOrdinal": 18
  },
  {
    "key": "E017-Q20",
    "questionUid": "qid_v1_ea8f9602a6a276cbaafa321190b673abbc47deafe5eae964c6d3caf81a3bfdb7",
    "sourceOrdinal": 20
  },
  {
    "key": "E017-Q23",
    "questionUid": "qid_v1_59226ef933e59db710d0814eb8f94bfc56270f061f29a306a03837395c1b7472",
    "sourceOrdinal": 23
  },
  {
    "key": "E023-Q06",
    "questionUid": "qid_v1_a14cd28d820b2cb2aabe1fc601fc72ebd6679b7eeaf1451c6773b3727ea77758",
    "sourceOrdinal": 6
  },
  {
    "key": "E023-Q10",
    "questionUid": "qid_v1_54940cea5cf2027a3c3cbc2fc16025f7ccb632d5bd8ee0cff0eb747e108537c9",
    "sourceOrdinal": 10
  }
];
function push() {
  return {
    env: { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_REPOSITORY: REPOSITORY,
      GITHUB_REF: C.CLOSED_PUSH_REF, GITHUB_SHA: HEAD, GITHUB_RUN_ID: '44000000001', GITHUB_RUN_ATTEMPT: '1',
      GITHUB_WORKFLOW: 'M2 Closed Eight Current Renderer', GITHUB_JOB: 'current-ui',
      ARCHIVE_M2S2_CLOSED8_UI_EXPECTED_SHA: HEAD },
    event: { ref: C.CLOSED_PUSH_REF, after: HEAD, deleted: false, repository: { full_name: REPOSITORY, fork: false } },
    actual: HEAD
  };
}
test('only the fixed eight existing UIDs and two current banks form the sixteen-case manifest', () => {
  assert.equal(C.requireSealedManifest(clone(fixture)).expectedCases, 16);
  assert.deepEqual(fixture.items.map(({key,questionUid,sourceOrdinal})=>({key,questionUid,sourceOrdinal})), SUBJECTS);
  assert.equal(fixture.sourceBindings.length, 2);
  assert.equal(C.SHARED_CHECKER_SHA256, 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673');
  assert.equal(fixture.items.every(item=>item.imageBinding==='QUESTION_IMAGE'), true);
});
test('exact push provenance records its own event and captured head, never a PR head', () => {
  const p=push(), result=C.checkoutEvidence(p.actual,p.env,p.event);
  assert.equal(result.expectedCheckoutCommit,HEAD);assert.equal(result.actualCheckoutCommit,HEAD);
  assert.equal(result.githubEventCommit,HEAD);
  assert.deepEqual(result.execution,{provider:'GITHUB_ACTIONS',repository:REPOSITORY,eventName:'push',
    ref:C.CLOSED_PUSH_REF,headSha:HEAD,capturedHead:HEAD,eventSha:HEAD,runId:'44000000001',runAttempt:1,
    workflow:'M2 Closed Eight Current Renderer',job:'current-ui',pullRequest:null,baseSha:null});
});
for (const [name, mutate] of [
  ['missing expected SHA', p=>{delete p.env.ARCHIVE_M2S2_CLOSED8_UI_EXPECTED_SHA;}],
  ['abbreviated expected SHA', p=>{p.env.ARCHIVE_M2S2_CLOSED8_UI_EXPECTED_SHA='1'.repeat(7);}],
  ['different checked-out head', p=>{p.actual='2'.repeat(40);}],
  ['not GitHub Actions', p=>{p.env.GITHUB_ACTIONS='false';}],
  ['another environment repository', p=>{p.env.GITHUB_REPOSITORY='example/other';}],
  ['pull request event', p=>{p.env.GITHUB_EVENT_NAME='pull_request';}],
  ['manual dispatch', p=>{p.env.GITHUB_EVENT_NAME='workflow_dispatch';}],
  ['different GitHub SHA', p=>{p.env.GITHUB_SHA='2'.repeat(40);}],
  ['another environment branch', p=>{p.env.GITHUB_REF='refs/heads/main';}],
  ['the other protected-ops branch', p=>{p.env.GITHUB_REF='refs/heads/ops/middle-protected9-current-renderer-26fc-20261117';}],
  ['another payload branch', p=>{p.event.ref='refs/heads/main';}],
  ['different payload after', p=>{p.event.after='2'.repeat(40);}],
  ['deleted push', p=>{p.event.deleted=true;}],
  ['missing deletion field', p=>{delete p.event.deleted;}],
  ['fork repository', p=>{p.event.repository.fork=true;}],
  ['missing fork field', p=>{delete p.event.repository.fork;}],
  ['another payload repository', p=>{p.event.repository.full_name='example/other';}],
  ['missing payload repository', p=>{delete p.event.repository;}],
  ['missing payload ref', p=>{delete p.event.ref;}],
  ['missing payload after', p=>{delete p.event.after;}],
  ['missing run ID', p=>{delete p.env.GITHUB_RUN_ID;}],
  ['zero run ID', p=>{p.env.GITHUB_RUN_ID='0';}],
  ['unsafe run attempt', p=>{p.env.GITHUB_RUN_ATTEMPT='9007199254740992';}],
  ['fractional run attempt', p=>{p.env.GITHUB_RUN_ATTEMPT='1.5';}],
  ['zero run attempt', p=>{p.env.GITHUB_RUN_ATTEMPT='0';}],
  ['missing workflow', p=>{delete p.env.GITHUB_WORKFLOW;}],
  ['unsafe job name', p=>{p.env.GITHUB_JOB='../current-ui';}]
]) test('closed eight provenance rejects '+name, () => {
  const p=push();mutate(p);assert.throws(()=>C.checkoutEvidence(p.actual,p.env,p.event),/UI_CLOSED8_/);
});
for (const [name, mutate] of [
  ['the old 24-question schema', m=>{m.schemaVersion='archive-m2-problem24-renderer-ui-manifest-v1';}],
  ['the old authority scope', m=>{m.scope='EXACT_PROBLEM21_PLUS_FAMILY3_NO_APPROVAL';}],
  ['forty-eight logical cases', m=>{m.expectedCases=48;}],
  ['a changed viewport', m=>{m.viewports[1].width=391;}],
  ['a missing selected item', m=>{m.items.pop();}],
  ['a duplicate selected item', m=>{m.items[1]=clone(m.items[0]);}],
  ['reordered items', m=>{m.items.reverse();}],
  ['a foreign UID', m=>{m.items[0].questionUid='qid_v1_'+'a'.repeat(64);}],
  ['another ordinal', m=>{m.items[0].sourceOrdinal++;}],
  ['a changed question digest', m=>{m.items[0].problemPayloadSha256='0'.repeat(64);}],
  ['changed own-field presence', m=>{m.items[0].problemFieldsSha256='0'.repeat(64);}],
  ['changed presentation fields', m=>{m.items[0].presentationSha256='0'.repeat(64);}],
  ['another selected source', m=>{m.items[0].sourcePath='archive/exams/other.js';}],
  ['another selected asset', m=>{m.items[0].assetPath='archive/assets/images/other.svg';}],
  ['a changed asset digest', m=>{m.items[0].assetSha256='0'.repeat(64);}],
  ['the historical E017 bank', m=>{m.sourceBindings[1].gitBlobSha1='f417b7e4e993ceb1a70c1b85de1e292a52d2b551';}],
  ['the superseded 2b9 bank after the current source refresh', m=>{m.sourceBindings[1].gitBlobSha1='2b9a077f00f0fc3ec6ee5c03ae5037076ecf88cb';}],
  ['a changed current source raw hash', m=>{m.sourceBindings[1].sha256='0'.repeat(64);}],
  ['a changed source byte count', m=>{m.sourceBindings[1].bytes++;}],
  ['duplicate source bindings', m=>{m.sourceBindings[1]=clone(m.sourceBindings[0]);}],
  ['a third source binding', m=>{m.sourceBindings.push(clone(m.sourceBindings[0]));}],
  ['an unknown top-level field', m=>{m.newApproval=true;}],
  ['an unsealed source candidate', m=>{m.bindingState=C.DRAFT;}]
]) test('closed eight manifest refuses '+name, () => {
  const m=clone(fixture);mutate(m);assert.throws(()=>C.requireSealedManifest(m),/UI_CLOSED8_/);
});
