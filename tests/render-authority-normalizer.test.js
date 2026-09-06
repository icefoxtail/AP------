const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../archive/render-authority.js');

function policies() {
  return {
    headerPolicy: { title: '정규화 시험지', firstPage: 'full', continuationPage: 'running' },
    qrPolicy: { enabled: false, kind: 'none', placement: 'flow' },
    duplexPolicy: { enabled: false, breakBetweenRecipients: false, ensureNextRecipientFrontSide: false, trailingBlankAllowed: false },
    qppPolicy: { allowed: [4, 6], default: 4, editable: false, source: 'production' },
    layoutPolicy: { pageSize: 'A4', orientation: 'portrait', columns: 2 },
    capabilitySnapshot: { adapter: 'test', transportCapabilities: ['browser'] }
  };
}

test('Archive normalizer creates source-derived identity without treating id as SourceRef authority', () => {
  const raw = [{ id: 99, content: '문항', choices: ['①'], answer: '①', solution: '풀이' }];
  const questions = A.normalizeArchiveQuestions(raw, { sourceArchiveFile: 'exams/archive.js' });
  assert.equal(questions[0].sourceRef.sourceArchiveFile, 'exams/archive.js');
  assert.equal(questions[0].sourceRef.sourceQuestionUid, 'legacy:exams/archive.js#ordinal:1');
  assert.equal(questions[0].sourceRef.sourceQuestionNo, null);
  assert.equal(questions[0].displayNo, 1);
  assert.equal(questions[0].sourcePayload, raw[0]);
  assert.equal(Object.isFrozen(questions[0]), true);
  assert.equal(raw[0].sourceQuestionUid, undefined, 'normalization must not mutate raw source data');
});

test('Mixer normalizer retains per-question provenance for same-id/different-source inputs', () => {
  const raw = [
    { id: 7, _sourceFile: 'exams/a.js', questionUid: 'uid-a', sourceQuestionOrdinal: 3, sourceQuestionNo: 7, content: 'A' },
    { id: 7, _sourceFile: 'exams/b.js', questionUid: 'uid-b', sourceQuestionOrdinal: 3, sourceQuestionNo: 7, content: 'B' }
  ];
  const questions = A.normalizeMixedQuestions(raw, {});
  assert.deepEqual(questions.map(question => question.sourceRef.sourceArchiveFile), ['exams/a.js', 'exams/b.js']);
  assert.deepEqual(questions.map(question => question.sourceRef.sourceQuestionUid), ['uid-a', 'uid-b']);
  assert.deepEqual(questions.map(question => question.displayNo), [1, 2]);
});

test('Mixer adapter may resolve canonical source ordinal independently of mixed cart order', () => {
  const [question] = A.normalizeMixedQuestions([{ id: 2, _sourceFile: 'exams/original.js', content: 'A' }], {
    resolveSourceRef(raw) {
      assert.equal(raw.id, 2);
      return { sourceArchiveFile: 'exams/original.js', sourceQuestionOrdinal: 17, sourceQuestionNo: 2 };
    }
  });
  assert.deepEqual(question.sourceRef, {
    sourceArchiveFile: 'exams/original.js', sourceQuestionUid: 'legacy:exams/original.js#ordinal:17', sourceQuestionOrdinal: 17, sourceQuestionNo: 2
  });
});

test('Clinic normalizer resolves payload aliases only into canonical fields and preserves restored provenance', () => {
  const raw = [{
    _sourceArchiveFile: 'exams/original.js', sourceQuestionUid: 'uid-clinic', sourceQuestionOrdinal: 4,
    sourceQuestionNo: 17, prompt: '복원 문항', options: ['가', '나'], correctAnswer: '나',
    commentary: '복원 해설', imageUrl: 'problem.png', solutionImage: 'solution.svg'
  }];
  const [question] = A.normalizeClinicQuestions(raw, {});
  assert.equal(question.content, '복원 문항');
  assert.deepEqual(question.choices, ['가', '나']);
  assert.equal(question.answer, '나');
  assert.equal(question.solution, '복원 해설');
  assert.equal(question.image, 'problem.png');
  assert.equal(question.solutionImage, 'solution.svg');
  assert.deepEqual(question.sourceRef, {
    sourceArchiveFile: 'exams/original.js', sourceQuestionUid: 'uid-clinic', sourceQuestionOrdinal: 4, sourceQuestionNo: 17
  });
});

test('Normalizers create only pure PrintJobs and preserve source-authority boundaries', () => {
  const base = policies();
  const job = A.createArchivePrintJob({
    jobId: 'archive-1',
    sourceAuthority: { kind: 'ARCHIVE_STANDALONE', winnerId: 'data=exams/a.js', evidence: { data: true }, fallbackUsed: false },
    rawQuestions: [{ content: '문항' }],
    sourceArchiveFile: 'exams/a.js',
    ...base
  });
  assert.equal(job.source, 'archive');
  assert.equal(job.sections.length, 1);
  assert.equal(job.sections[0].renderMode, 'exam');
  const multiQrJob = A.createArchivePrintJob({
    jobId: 'archive-two-qr-channels',
    sourceAuthority: { kind: 'ARCHIVE_STANDALONE', winnerId: 'data=exams/a.js', evidence: { data: true }, fallbackUsed: false },
    rawQuestions: [{ content: '문항' }],
    sourceArchiveFile: 'exams/a.js',
    ...base,
    qrPolicy: { enabled: false, kind: 'none', placement: 'flow' },
    qrPolicies: [
      { enabled: true, kind: 'submit', placement: 'flow' },
      { enabled: true, kind: 'solution', placement: 'reserved-overlay' }
    ]
  });
  assert.deepEqual(multiQrJob.sections[0].qrPolicies.map(policy => policy.kind), ['submit', 'solution']);
  assert.throws(() => A.createMixedPrintJob({
    jobId: 'bad',
    sourceAuthority: { kind: 'ARCHIVE_STANDALONE', winnerId: 'data', evidence: {}, fallbackUsed: false },
    rawQuestions: [{ _sourceFile: 'exams/a.js' }],
    ...base
  }), error => error.code === 'SOURCE_AUTHORITY_ENGINE_MISMATCH');
});
