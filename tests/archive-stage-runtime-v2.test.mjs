import assert from 'node:assert/strict';
import {
  buildContinuation,
  buildStageState,
  drainMasterContinuations,
  handoffContinuation,
  resolveClosurePending,
} from '../archive/tools/archive-stage-runtime-v2.mjs';

const state = buildStageState({ stage: 'R1', workComplete: true, closurePending: false, ignored: 'x' });
assert.deepEqual(state, { stage: 'R1', workComplete: true, closurePending: false });
assert.deepEqual(resolveClosurePending({ stage: 'R1', workComplete: true, closurePending: true }), {
  stage: 'R1',
  workComplete: true,
  closurePending: false,
});

const continuation = buildContinuation({
  stage: 'R1',
  examUid: 'exam-1',
  inputArtifactSha: 'in-1',
  finalArtifactSha: 'final-1',
  evidenceRef: 'evidence://1',
  completedStep: 'review-complete',
  firstMissingClosureStep: 'validator',
  exactReason: 'validator execution pending',
});
const handoff = handoffContinuation({ state, continuation });
assert.equal(handoff.state.workComplete, true);
assert.equal(handoff.state.closurePending, true);
assert.equal(handoff.continuation.examUid, 'exam-1');

assert.throws(() => buildContinuation({
  stage: 'R2',
  examUid: 'exam-2',
  inputArtifactSha: 'in-2',
  finalArtifactSha: 'final-2',
  evidenceRef: 'evidence://2',
  completedStep: 'review-complete',
  exactReason: 'missing closure step',
}), /CONTINUATION_FIRST_MISSING_CLOSURE_STEP_REQUIRED/);

const queue = [1, 2, 3].map(id => buildContinuation({
  stage: 'R2',
  examUid: 'exam-' + id,
  inputArtifactSha: 'in-' + id,
  finalArtifactSha: 'final-' + id,
  evidenceRef: 'evidence://' + id,
  completedStep: 'review-complete',
  firstMissingClosureStep: 'receipt',
  exactReason: 'receipt pending',
}));

const visited = [];
const drained = await drainMasterContinuations({
  continuations: queue,
  execute: async item => {
    visited.push(item.examUid);
    if (item.examUid !== 'exam-2') return { closed: true };
    return {
      closed: false,
      continuation: {
        ...item,
        finalArtifactSha: 'final-2b',
        completedStep: 'validator-pass',
        firstMissingClosureStep: 'receipt-write',
        exactReason: 'receipt write still pending',
      },
    };
  },
});
assert.deepEqual(visited, ['exam-1', 'exam-2', 'exam-3']);
assert.equal(drained.processedCount, 3);
assert.equal(drained.closedCount, 2);
assert.equal(drained.remaining.length, 1);
assert.equal(drained.remaining[0].finalArtifactSha, 'final-2b');

assert.rejects(() => drainMasterContinuations({
  continuations: [queue[0], { ...queue[0], finalArtifactSha: 'other' }],
  execute: async () => ({ closed: true }),
}), /MASTER_DUPLICATE_CONTINUATION/);

console.log('ARCHIVE_STAGE_RUNTIME_V2_PASS');

const gptState = buildStageState({stage:'R1',workComplete:true,qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'GPT_SCHEDULED',campaignId:'H1_GPT2_20261006',stream:'A'});
assert.equal(gptState.campaignId,'H1_GPT2_20261006');
assert.equal(gptState.stream,'A');
assert.throws(()=>buildStageState({stage:'R1',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'GPT_SCHEDULED'}),/STAGE_GPT_CAMPAIGN_ID_REQUIRED/);
const gptContinuation=buildContinuation({stage:'R2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'GPT_SCHEDULED',campaignId:'H1_GPT2_20261006',stream:'B',examUid:'gpt-1',inputArtifactSha:'in',finalArtifactSha:'out',evidenceRef:'ev',completedStep:'work',firstMissingClosureStep:'validator',exactReason:'pending'});
assert.equal(gptContinuation.stream,'B');
