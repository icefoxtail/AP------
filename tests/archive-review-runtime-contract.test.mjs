import assert from 'node:assert/strict';
import test from 'node:test';
import normalizer from '../archive/render-state-normalizer.js';

const { createCandidate } = normalizer;

function reviewCandidate() {
  return {
    mode: 'exam',
    qpp: 4,
    input: {
      mode: 'exam',
      sourceKind: 'review-snapshot',
      sourceRequestId: 'review-source-1',
      bridgeEpoch: 1,
      sourceEpoch: 2,
      revision: 3,
      reviewSnapshot: { questionBank: [{ id: 1, content: '수정' }] },
    },
    source: {
      targetSessionId: 'session-1',
      sourceRequestId: 'review-source-1',
      sourceKind: 'review-snapshot',
      safeDataUrl: 'review/fixture.js',
      sourceArchiveFile: 'fixture.js',
      bridgeEpoch: 1,
      sourceEpoch: 2,
      revision: 3,
      canonicalDataFingerprint: 'digest',
      canonicalRenderData: [{
        sourceRef: { sourceArchiveFile: 'fixture.js', sourceQuestionUid: 'q1' },
        displayNo: 1,
        content: '수정',
        choices: [],
        answer: '',
        solution: '',
        image: '',
        imageSize: '',
        layoutTag: '',
        wide: false,
        sourcePayload: { content: '수정' },
        renderInput: { id: 1, content: '수정', sourceArchiveFile: 'fixture.js', sourceOrdinal: 1 },
      }],
      title: '검수 시험',
      identityTitle: '검수 시험',
      displayTitle: '검수 시험',
      businessData: [{ id: 1 }],
    },
    printHeaderOptions: { title: '검수 시험', metaRight: '', subtitle: '', showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
    qrState: { submit: false, sol: false, preview: true, hasClass: false, renderSubmit: false, renderSolution: false, solutionUrl: '', submitUrl: '', assignmentDate: '' },
    rendererMode: 'batch',
    profile: {},
    layoutOptions: {},
    environment: { url: 'http://localhost/archive/engine.html?preview=1&reviewBridge=1', examAuthority: 'shared', solutionAuthority: 'shared', answerAuthority: 'shared' },
    fingerprints: { engine: 'e', renderAuthority: 'r', layoutAuthority: 'l', executor: 'x', pageLayout: 'p', font: 'f', asset: 'a', qrPolicy: 'q', qrPayload: 'qp', printHeader: 'ph', profile: 'pr' },
  };
}

test('immutable candidate contract accepts an in-memory review source and its revision tuple', () => {
  const candidate = createCandidate(reviewCandidate());
  assert.equal(candidate.source.sourceKind, 'review-snapshot');
  assert.deepEqual(
    { bridgeEpoch: candidate.source.bridgeEpoch, sourceEpoch: candidate.source.sourceEpoch, revision: candidate.source.revision },
    { bridgeEpoch: 1, sourceEpoch: 2, revision: 3 }
  );
  assert.deepEqual(candidate.input.reviewSnapshot.questionBank, [{ id: 1, content: '수정' }]);
});

test('review snapshot candidates can represent an intentionally empty bank', () => {
  const value = reviewCandidate();
  value.input.reviewSnapshot.questionBank = [];
  value.source.canonicalRenderData = [];
  value.source.businessData = [];
  const candidate = createCandidate(value);
  assert.deepEqual(candidate.source.canonicalRenderData, []);
  assert.deepEqual(candidate.input.reviewSnapshot.questionBank, []);
});
