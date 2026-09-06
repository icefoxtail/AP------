const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../archive/print-contract.js');

function sourceRef(overrides = {}) {
  return {
    sourceArchiveFile: 'exams/2026/example.js',
    sourceQuestionUid: 'q:example:1',
    sourceQuestionOrdinal: 1,
    sourceQuestionNo: 7,
    ...overrides
  };
}

function question(overrides = {}) {
  return {
    sourceRef: sourceRef(),
    displayNo: 1,
    content: '문항',
    choices: ['①', '②'],
    answer: '①',
    solution: '풀이',
    sourcePayload: { id: 7 },
    ...overrides
  };
}

function policies(overrides = {}) {
  return {
    headerPolicy: { title: '계약 시험지', metaRight: '고1 수학 단원별 기출', firstPage: 'full', continuationPage: 'running' },
    qrPolicy: { enabled: false, kind: 'none', placement: 'flow' },
    duplexPolicy: { enabled: false, breakBetweenRecipients: false, ensureNextRecipientFrontSide: false, trailingBlankAllowed: false },
    qppPolicy: { allowed: [4, 6], default: 4, editable: false, source: 'production' },
    layoutPolicy: { pageSize: 'A4', orientation: 'portrait', columns: 2 },
    ...overrides
  };
}

function section(overrides = {}) {
  return {
    sectionId: 'exam-a',
    renderMode: 'exam',
    questions: [question()],
    ...policies(),
    ...overrides
  };
}

function authority(overrides = {}) {
  return {
    kind: 'ARCHIVE_STANDALONE',
    winnerId: 'data=exams/2026/example.js',
    evidence: { parameter: 'data' },
    fallbackUsed: false,
    ...overrides
  };
}

test('SourceAuthority rejects zero or multiple winners and retains the single winner evidence', () => {
  assert.throws(
    () => C.selectAuthoritativeSource([]),
    error => error.code === 'AUTHORITATIVE_SOURCE_COUNT' && error.details.count === 0
  );
  assert.throws(
    () => C.selectAuthoritativeSource([
      { ...authority(), authoritative: true },
      { ...authority({ kind: 'ARCHIVE_PREVIEW', winnerId: 'parent' }), authoritative: true }
    ]),
    error => error.code === 'AUTHORITATIVE_SOURCE_COUNT' && error.details.count === 2
  );

  const winner = C.selectAuthoritativeSource([{ ...authority(), authoritative: true }]);
  assert.deepEqual(winner, authority());
  assert.throws(
    () => C.createPrintJob({
      jobId: 'mismatch', source: 'mixer', sourceAuthority: winner, sections: [section()],
      runtimePolicy: {}, capabilitySnapshot: { adapter: 'MixerAdapter', transportCapabilities: ['browser'] }
    }),
    error => error.code === 'SOURCE_AUTHORITY_ENGINE_MISMATCH'
  );
});

test('SourceRef is canonical and never silently substitutes id, ordinal, or display number', () => {
  const ref = C.createSourceRef(sourceRef({ sourceQuestionNo: '17-1' }));
  assert.deepEqual(ref, sourceRef({ sourceQuestionNo: '17-1' }));
  assert.throws(() => C.createSourceRef({ id: 7, sourceArchiveFile: 'exams/a.js' }), error => error.code === 'MISSING_SOURCE_QUESTION_UID');
  assert.throws(() => C.createSourceRef(sourceRef({ sourceQuestionOrdinal: 0 })), error => error.code === 'INVALID_POSITIVE_INTEGER');

  const sameIdDifferentSource = C.createSourceRef(sourceRef({ sourceArchiveFile: 'exams/other.js', sourceQuestionUid: 'q:other:1' }));
  assert.equal(C.sameSourceRef(ref, sameIdDifferentSource), false);
  assert.notEqual(C.sourceRefKey(ref), C.sourceRefKey(sameIdDifferentSource));
});

test('PrintJob freezes pure renderer modes and composes review as answer then solution', () => {
  assert.equal(C.canonicalRenderMode('sol'), 'solution');
  assert.equal(C.canonicalRenderMode('ans'), 'answer');
  assert.throws(() => C.canonicalRenderMode('review'), error => error.code === 'INVALID_RENDER_MODE');

  const review = C.createReviewSections(
    section({ sectionId: 'student-a-answer', renderMode: 'answer' }),
    section({ sectionId: 'student-a-solution', renderMode: 'solution' })
  );
  assert.deepEqual(review.map(item => item.renderMode), ['answer', 'solution']);
  assert.throws(
    () => C.createReviewSections(section({ renderMode: 'exam' }), section({ renderMode: 'solution' })),
    error => error.code === 'INVALID_REVIEW_COMPOSITION'
  );

  const job = C.createPrintJob({
    jobId: 'archive-job',
    source: 'archive',
    sourceAuthority: authority(),
    sections: [section()],
    runtimePolicy: {},
    capabilitySnapshot: { adapter: 'ArchiveAdapter', transportCapabilities: ['browser', 'raster', 'native', 'gdi'] }
  });
  assert.equal(job.sections[0].renderMode, 'exam');
  assert.deepEqual(job.runtimePolicy.requiredStates, C.READINESS_STATES);
  assert.deepEqual(job.capabilitySnapshot.transportCapabilities, ['browser', 'raster', 'native', 'gdi']);
});

test('Policies preserve layout authority boundaries and asset resolution stays adapter-owned', () => {
  const header = C.createHeaderPolicy({ title: '제목', metaRight: '우측 메타', firstPage: 'full', continuationPage: 'running' });
  assert.equal(header.metaRight, '우측 메타');
  const qrPolicies = C.createQrPolicies([
    { enabled: true, kind: 'submit', placement: 'flow' },
    { enabled: true, kind: 'solution', placement: 'reserved-overlay' }
  ]);
  assert.deepEqual(qrPolicies.map(policy => policy.kind), ['submit', 'solution']);
  assert.throws(() => C.createQrPolicies([
    { enabled: true, kind: 'submit', placement: 'flow' },
    { enabled: true, kind: 'submit', placement: 'reserved-overlay' }
  ]), error => error.code === 'DUPLICATE_QR_CHANNEL');
  const flow = C.createFlowExtension({ id: 'homework', kind: 'homework-checkbox', measuredBeforePagination: true, participatesInFlow: true });
  assert.equal(flow.participatesInFlow, true);
  assert.throws(
    () => C.createFlowExtension({ id: 'bad-flow', kind: 'note', measuredBeforePagination: false, participatesInFlow: true }),
    error => error.code === 'INVALID_FLOW_EXTENSION'
  );
  const overlay = C.createOverlayExtension({
    id: 'qr', kind: 'qr', canReflow: false,
    reservedRect: { x: 0, y: 0, width: 20, height: 20 }
  });
  assert.equal(overlay.canReflow, false);
  assert.throws(
    () => C.createOverlayExtension({ id: 'bad-overlay', kind: 'qr', canReflow: true, reservedRect: { x: 0, y: 0, width: 1, height: 1 } }),
    error => error.code === 'INVALID_OVERLAY_EXTENSION'
  );
  assert.throws(
    () => C.createQppPolicy({ allowed: [4], default: 2, editable: false, source: 'production' }),
    error => error.code === 'QPP_DEFAULT_NOT_ALLOWED'
  );

  const q = C.createCanonicalQuestion(question({ image: 'images/q.png' }));
  const url = C.callAssetResolver((assetRef, receivedQuestion, receivedRef) => {
    assert.equal(assetRef, 'images/q.png');
    assert.deepEqual(receivedQuestion, q);
    assert.equal(receivedRef.sourceQuestionUid, 'q:example:1');
    return '/archive/assets/images/q.png';
  }, q.image, q, q.sourceRef);
  assert.equal(url, '/archive/assets/images/q.png');
  assert.throws(() => C.callAssetResolver(() => '', 'x', q, q.sourceRef), error => error.code === 'INVALID_ASSET_RESOLVER_RESULT');
});

test('PageMap measures canonical source references instead of display numbers and readiness order is evidence-backed', () => {
  const first = C.createCanonicalQuestion(question());
  const second = C.createCanonicalQuestion(question({
    sourceRef: sourceRef({ sourceQuestionUid: 'q:example:2', sourceQuestionOrdinal: 2, sourceQuestionNo: 7 }),
    displayNo: 2
  }));
  const printSection = C.createPrintSection(section({ questions: [first, second] }));
  const pageMap = {
    pages: [{
      pageNo: 1,
      sectionId: 'exam-a',
      questionSourceRefs: [first.sourceRef, second.sourceRef],
      displayNos: [1, 2],
      continuations: [],
      hasBlankPage: false
    }]
  };
  assert.deepEqual(C.assertPageMapIntegrity(pageMap, [printSection]), {
    expectedCount: 2, observedCount: 2, omissionCount: 0, duplicationCount: 0
  });
  assert.throws(
    () => C.assertPageMapIntegrity({
      pages: [{ ...pageMap.pages[0], questionSourceRefs: [first.sourceRef, first.sourceRef], displayNos: [1, 2] }]
    }, [printSection]),
    error => error.code === 'PAGEMAP_DUPLICATE_SOURCE_REF'
  );

  const readiness = C.createReadinessEvidence(C.READINESS_STATES.map(state => ({ state, evidence: { state } })));
  assert.deepEqual(readiness.map(event => event.state), C.READINESS_STATES);
  assert.throws(
    () => C.createReadinessEvidence(C.READINESS_STATES.map((state, index) => ({ state: index === 1 ? 'IMAGE_READY' : state, evidence: {} }))),
    error => error.code === 'INVALID_READINESS_TRANSITION'
  );
  assert.deepEqual(C.DUAL_RUN_COMPARISON_FIELDS.slice(-3), ['qrLocations', 'recipientBoundaries', 'sourceIdentity']);
});
