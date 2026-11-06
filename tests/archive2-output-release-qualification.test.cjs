'use strict';

// Synthetic report documents exercise the decision boundary. These tests do
// not replace Chrome, generate browser evidence, or claim product readiness.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const Q = require('./archive2-output-release-qualification.cjs');
const CURRENT = '1'.repeat(40);
const hash = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const fullUids = Q.fixtureSpecs[0].sources.flatMap(({ file }, i) => Array.from({ length: i < 2 ? 24 : 2 }, (_, index) =>
  `loading:${file.slice('archive/exams/'.length)}:${index + 1}`));
const fullOrder = fullUids.map(uid => uid.slice('loading:'.length).replace(/:\d+$/, '') + '#' + uid);
const key = row => [row.purpose, row.fixture, row.repeat, row.network, row.operation].join('|');
const blocked = row => row.purpose === 'performance' && row.fixture === 'envelope50' &&
  ['sol-ans', 'ans-exam', 'exam-sol-warm', 'sol-ans-warm', 'same-ans'].includes(row.operation);
const negative = row => row.fixture === 'envelope50' && ['exam-sol', 'cold-sol', 'pdf-sol'].includes(row.operation);
const clippedLegacy = row => row.fixture === 'legacy50' && ['exam-sol', 'exam-sol-warm', 'pdf-sol'].includes(row.operation);
const cause = () => ({ tag: 'IMG', classes: [], sourceRef: Q.KNOWN.sourceRef,
  imageUrlSha256: Q.KNOWN.imageUrlSha256, imageNaturalWidth: 420, imageNaturalHeight: 300, imageLoaded: true,
  x: 12, y: 77, width: 420, height: 300 });
const clipping = () => ({ page: 8, classes: ['grid-col', 'sol-grid-col'], clientWidth: 340, scrollWidth: 432,
  clientHeight: 943, scrollHeight: 943, overflowX: 'hidden', overflowingDescendantCount: 1, overflowingDescendants: [cause()] });

function rowFor(item, label, overrides = {}) {
  const spec = Q.fixtureSpecs.find(value => value.id === item.fixture), mode = overrides.mode || item.mode;
  const knownInput = spec.inputSha256 === Q.KNOWN.inputSha256;
  const sourceOrder = knownInput ? fullOrder : Array.from({ length: spec.questions }, (_, index) => `${spec.id}#source-${index + 1}`);
  const inputUids = knownInput ? fullUids : sourceOrder.map((_, index) => `${spec.id}-uid-${index + 1}`);
  const hasClipping = clippedLegacy(item) || (negative(item) && label === 'baseline' && item.operation !== 'cold-sol');
  const pageCount = hasClipping ? 23 : spec.id === 'envelope50' ? 13 : 2;
  const continuationCount = spec.id === 'continuation-golden' && mode === 'sol' ? 1 : 0;
  const emptySlots = mode === 'exam' ? (spec.qpp - sourceOrder.length % spec.qpp) % spec.qpp : 0;
  const blocks = [...sourceOrder, ...(continuationCount ? [sourceOrder.at(-1)] : []), ...Array(emptySlots).fill('')].map((sourceRef, index) =>
    ({ sourceRef, textHash: hash(sourceRef ? `${mode}-${sourceRef}` : ''), x: 12, y: index % 10 * 24, width: 316, height: 20 }));
  const pages = Array.from({ length: pageCount }, (_, index) => ({ width: 794, height: 1123,
    textHash: hash(`${spec.id}-${mode}-${index}`), blocks: blocks.filter((_, b) => Math.floor(b * pageCount / blocks.length) === index), images: [] }));
  const bodyHash = hash(`${spec.id}-${mode}`);
  const row = { ...item, label, name: `${spec.id}-${label}-${item.repeat}-${item.network}-${item.operation}`,
    pass: true, outcome: { ok: true, code: null }, mode, qpp: spec.qpp, questionCount: spec.questions,
    sourceOrder, expectedOrder: sourceOrder.slice(), inputUids, blockCount: blocks.length, pageCount, pages, images: [], bodyHash,
    inputHash: knownInput ? Q.KNOWN.projectedInputHash : hash(spec.id), mathMarkupHash: hash(`${spec.id}-${mode}-math`),
    mathCount: 1, mathErrors: 0, unrenderedMath: 0, mathGeometry: [{ width: 20, height: 12 }], firstBoxMs: 20,
    clippingCount: hasClipping ? 1 : 0, clippingEvidence: hasClipping ? [clipping()] : [], pageOverflowCount: 0, continuationCount,
    publicMs: label === 'baseline' ? 1000 + item.repeat : 600 + item.repeat, operationMath: { totalMs: 50, calls: 1 },
    cdp: { LayoutDurationMs: 10, LayoutCount: 20 }, pageErrors: [], imageBuildFailures: [],
    printPreflight: { ok: true, outputParity: { bodyHash, pages: pageCount, coordinateTolerancePx: 1 } },
    snapshotId: `${spec.id}-${label}-snapshot`, snapshotMode: mode, committedMode: mode,
    attempts: [{ state: 'SUCCEEDED', committed: true }],
    envelope: { present: spec.kind === 'envelope', mode, renderedIdentityMatches: true,
      verifiedIdentityMatches: true, urlIdentityMatches: true, errorPresent: false },
    ...overrides };
  delete row.labels;
  return row;
}
function pdfFor(row) {
  return { generated: true, pageCount: row.pageCount, mediaBoxes: row.pages.map(() => [0, 0, 594.96, 841.92]),
    afterPrintState: { snapshotId: row.snapshotId, mode: row.mode, snapshotMode: row.mode, committedMode: row.mode,
      attemptCount: 1, runtimeBusy: false, fontsStatus: 'loaded', renderOutcomeOk: true, activeRootMatches: true, envelope: clone(row.envelope) },
    screenParity: { bodyHash: row.bodyHash, pages: row.pageCount, coordinateTolerancePx: 1 },
    raster: { renderer: 'Poppler pdftoppm', dpi: 96, textSha256: hash(row.bodyHash), textBytes: 300,
      pages: row.pages.map((page, index) => ({ page: index + 1, width: 794, height: 1123, rgbSha256: hash(page.textHash) })) } };
}
function performanceReport(role) {
  const plan = Q.expectedPlan(role), purpose = role.startsWith('network:') ? 'network' : role;
  const report = { schema: 'ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1', currentSha: CURRENT, baselineSha: Q.BASELINE,
    chromeVersion: '157.0.8103.38', playwrightVersion: '1.62.1', profileOnly: false,
    phase: purpose === 'network' ? 'network-completion' : purpose, repeats: purpose === 'performance' ? 3 : 1,
    networkFixtureId: purpose === 'network' ? role.split(':')[1] : null,
    rows: [], pdfRows: [], comparisons: [], pdfComparisons: [], networkComparisons: [], cycles: [], failures: [],
    fixtures: clone(purpose === 'network' ? Q.fixtureSpecs.filter(item => item.id === role.split(':')[1]) : Q.fixtureSpecs),
    conditions: { viewport: { width: 1440, height: 1000 }, cpuThrottleRate: 1, coordinateTolerancePx: 1, networkCachePolicy: 'no-store',
      networkTransport: purpose === 'network' ? 'identity/no-store stress' : 'identity/no-store unthrottled',
      slowNetwork: { latencyMs: 100, downloadBytesPerSecond: 187500, uploadBytesPerSecond: 93750 } } };
  const rows = purpose === 'pdf' ? report.pdfRows : report.rows;
  const comparisons = purpose === 'pdf' ? report.pdfComparisons : purpose === 'network' ? report.networkComparisons : report.comparisons;
  for (const item of plan.measurements.filter(item => !blocked(item))) {
    const pair = ['baseline', 'current'].map(label => {
      let row;
      if (negative(item) && label === 'current' && item.operation !== 'cold-sol') {
        const before = rows.find(value => value.fixture === item.fixture && value.label === 'current' && value.repeat === item.repeat &&
          value.operation === (purpose === 'pdf' ? 'pdf-exam' : 'cold-exam'));
        row = { ...clone(before), ...item, label, name: `${item.fixture}-${label}-${item.repeat}-${item.operation}`, mode: 'exam' };
        delete row.labels; delete row.pdf;
      } else row = rowFor(item, label);
      if (negative(item)) {
        row.pass = false; row.outcome = { ok: false, code: 'PDF_CONTENT_CLIPPED', error: { count: 1 } };
        row.error = { code: 'EXPECTED_RENDER_READY', details: { code: 'PDF_CONTENT_CLIPPED' } };
        if (label === 'current') row.attempts = [{ state: 'FAILED', committed: false }];
        if (item.operation === 'cold-sol') {
          Object.assign(row, { pageCount: 0, pages: [], blockCount: 0, sourceOrder: [], clippingCount: 0, clippingEvidence: [] });
          row.envelope.errorPresent = true;
        }
        report.failures.push({ ...item, label, error: clone(row.error) });
      } else if (purpose === 'pdf') row.pdf = pdfFor(row);
      if (purpose === 'network') row.metadataTransfer = label === 'baseline' ?
        { state: 'COMPLETE', requests: [{ finished: true, httpStatus: 200, decodedDataBytes: 67136823 }] } :
        { state: 'NOT_REQUESTED', requests: [], loaderMode: 'frozen-source', notRequestedUnderFrozenSourcePolicy: true,
          renderCompletedWithoutMetadataRequest: true };
      rows.push(row); return row;
    });
    const comparison = { ...item, pass: !negative(item) }; delete comparison.labels; delete comparison.mode;
    if (negative(item)) comparison.error = { code: 'PARITY_INPUT_NOT_READY' };
    else Object.assign(comparison, { questions: pair[1].questionCount, pages: pair[1].pageCount, bodyHash: pair[1].bodyHash,
      sourceOrderHash: hash(pair[1].sourceOrder.join('\n')), coordinateTolerancePx: 1 });
    comparisons.push(comparison);
  }
  report.cycles = plan.cycles.map(cycle => {
    const failedOperation = cycle.operations.find(operation => negative({ ...cycle, operation }));
    return failedOperation ? { ...cycle, pass: false, failedOperation, completed: cycle.operations.indexOf(failedOperation),
      error: { code: 'EXPECTED_RENDER_READY', details: { code: 'PDF_CONTENT_CLIPPED' } } } :
      { ...cycle, pass: true, completed: cycle.operations.length };
  });
  const blockedPairs = plan.measurements.filter(blocked);
  const identity = ({ purpose, fixture, repeat, network, operation }) => ({ purpose, fixture, repeat, network, operation });
  report.coverage = { schema: 'ARCHIVE_OUTPUT_PERFORMANCE_COVERAGE_V1', phase: report.phase,
    networkTransport: report.conditions.networkTransport, measurements: plan.measurements, plannedRows: plan.measurements.length * 2,
    plannedPairs: plan.measurements.length, observedRows: rows.length, observedPairs: comparisons.length,
    missingRows: blockedPairs.flatMap(item => item.labels.map(label => ({ ...identity(item), label,
      status: 'BLOCKED_OR_FAILED_BEFORE_CAPTURE', precedingFailure: { operation: 'exam-sol', code: 'EXPECTED_RENDER_READY' } }))),
    missingPairs: blockedPairs.map(identity), duplicateRows: [], duplicatePairs: [], complete: !blockedPairs.length };
  report.pass = report.failures.length === 0;
  report.outputParity = report[purpose + 'Parity'] = report.pass ? 'PASS' : 'FAIL';
  return report;
}

function cacheReport() {
  const print = ready => ({ printCalls: ready ? 1 : 0, newAttempts: 0, alerts: ready ? 0 : 1,
    event: ready ? { readyOutcome: { ok: true } } : null, visibleParity: { bodyHash: hash('safe-visible') } });
  const rawCause = cause(), rawColumn = clipping();
  const knownIssue = { ...Q.KNOWN, qualityPass: false, status: 'UNRESOLVED', guardPass: true, questionCount: 50, qpp: 4,
    expectedFailureCode: 'PDF_CONTENT_CLIPPED', observedCauses: [1, 2].map(index => ({ attemptedMode: 'sol', qpp: 4,
      candidatePageCount: 23, attemptedRequestId: `rejected-${index}`, causes: [{ ...rawCause, page: 8,
        imageX: rawCause.x, imageY: rawCause.y, imageWidth: rawCause.width, imageHeight: rawCause.height,
        columnClasses: rawColumn.classes, columnClientWidth: 340, columnScrollWidth: 432,
        columnClientHeight: 943, columnScrollHeight: 943, columnOverflowX: 'hidden' }] })) };
  const cases = [
    { initialMiss: true, sameModeNoBuild: true, corruptedSnapshotRebuilt: true, modeHits: ['exam', 'sol', 'ans'], print: print(true) },
    { sameUidContentInvalidated: true, qppInvalidated: true, headerInvalidated: true, qrInvalidated: true, changedOptionsReused: true },
    { failedRequestPreservedVisibleDocument: true, inputPreserved: true, retry: true, blocked: print(false), printed: print(true) },
    { realClippingRejected: true, previousDocumentAndBindingPreserved: true, retry: true },
    { first: { ok: false, code: 'DISCARDED_STALE' }, latest: { ok: true }, oldDocumentPreservedWhilePending: true },
    { failureVisible: true, previousDocumentAndBindingPreserved: true, targetModeRetry: true, blocked: print(false), printed: print(true) },
    { first: { ok: false, code: 'DISCARDED_STALE' }, latest: { ok: true }, maxLatestReadyMs: 3000, latestReadyMs: 40,
      heldDecodeStillPendingAtLatestReady: true, noOverwriteAfterNativeDecodeSettled: true,
      previousDocumentRetainedWhilePending: { unchanged: true, retainedBySnapshot: true, decodeReleased: false },
      previousViewRestoredBeforeLatestCommit: { oldRootRestored: true, oldSnapshotRestored: true, oldEnvelopeRestored: true, oldUrlRestored: true } },
    { knownIssue: clone(knownIssue), failedOperationQualityPass: false, subsequentAnswerReady: true, subsequentExamReady: true,
      noLateOverwrite: true, blockedPrints: [print(false), print(false)], failures: [1, 2].map(attempt => ({ attempt,
        code: 'PDF_CONTENT_CLIPPED', committed: false, previousSnapshotPreserved: true, inputPreserved: true, failedRequestSealedReady: false })) }
  ].map((item, index) => ({ ...item, name: Q.cacheCases[index], pass: true }));
  const qrNames = ['solution-qr-refreshes-request-canvas-initial', 'qr-first-solution-miss', 'qr-exam-after-solution-rebuilt',
    'qr-first-answer-miss', 'qr-exam-after-answer-rebuilt', 'qr-exam-safe-print-vector', 'qr-solution-cache-hit', 'qr-answer-cache-hit'];
  const qrRows = qrNames.map((name, index) => {
    const mode = [1, 6].includes(index) ? 'sol' : [3, 7].includes(index) ? 'ans' : 'exam';
    const hit = index >= 6, row = rowFor({ fixture: 'envelope8', mode, repeat: 1 }, 'current');
    const requestId = `qr-request-${index}`;
    return { ...row, name, cacheStatus: hit ? 'HIT' : 'MISS', snapshotId: mode === 'exam' ? `qr-exam-snapshot-${index}` : `qr-${mode}-snapshot`,
      operationMath: { totalMs: hit ? 0 : 20, calls: hit ? 0 : 1 }, adapters: hit ? [] : [{ method: 'build' }],
      binding: { envelopePresent: true, renderOutcomeOk: true, renderErrorPresent: false, verifiedIdentityMatches: true,
        renderedIdentityMatches: true, outputRequestId: requestId, urlRequestId: requestId, mode,
        snapshotMode: mode, candidateMode: mode, urlMode: mode, qr: { canvases: mode === 'exam' ? 1 : 0 } } };
  });
  const examProofs = [0, 2, 4].map((index, i) => ({ rowName: qrNames[index], outputRequestId: qrRows[index].binding.outputRequestId,
    snapshotId: qrRows[index].snapshotId, cacheStatus: 'MISS', buildCalls: 1, newRoot: i ? true : null, newCanvas: i ? true : null,
    qr: { requestId: qrRows[index].binding.outputRequestId, currentIdentityMatches: true, targetMode: 'sol', qrFlag: '1',
      sourceKeyHash: hash('same-source-key'), pixelSha256: hash(`qr-pixels-${index}`), expectedPixelSha256: hash(`qr-pixels-${index}`),
      width: 100, height: 100, blackPixels: 5000, whitePixels: 5000, opaquePixels: 10000, unclipped: true,
      page: 1, x: 500, y: 10, displayWidth: 100, displayHeight: 100 } }));
  cases.push({ name: Q.cacheCases[8], pass: true, examRequestTokenChanged: true, examCanvasPixelsChanged: true, examCacheMiss: true,
    examNewRoot: true, examBuildObserved: true, sourceAndGeometryParity: true, freshEnvelopeBinding: true, solutionCacheHit: true,
    answerCacheHit: true, examProofs, parity: [2, 4].map(index => ({ baseline: qrNames[0], current: qrNames[index],
      bodyHash: qrRows[index].bodyHash, pages: qrRows[index].pageCount, coordinateTolerancePx: 1 })),
    print: { ...print(true), qrPixelSha256: examProofs[2].qr.pixelSha256 },
    modeHits: [6, 7].map(index => ({ rowName: qrNames[index], mode: qrRows[index].mode, snapshotId: qrRows[index].snapshotId,
      cacheStatus: 'HIT', mathCalls: 0, buildCalls: 0, outputRequestId: qrRows[index].binding.outputRequestId })) });
  const imageNames = ['pending-exam-image-cancellation-initial', 'exam-staging-decode-pending', 'latest-answer-cancels-exam-image',
    'released-exam-image-cannot-overwrite-answer', 'exam-image-cancellation-safe-print'];
  const imageRows = imageNames.map((name, index) => {
    const row = rowFor({ fixture: 'envelope8', mode: 'ans', repeat: 1 }, 'current'), requestId = index >= 2 ? 'latest-image-answer' : 'initial-image-answer';
    return { ...row, name, qpp: 1, pass: index !== 1, outcome: index === 1 ? { ok: false, code: 'QA_EXAM_IMAGE_PENDING' } : { ok: true },
      snapshotId: 'retained-answer-snapshot', cacheStatus: index >= 2 ? 'HIT' : 'MISS', operationMath: { calls: 0, totalMs: 0 }, adapters: [],
      attemptCount: index >= 2 ? 3 : index + 1,
      attempts: index >= 2 ? [{ state: 'SUCCEEDED', committed: true }, { state: 'DISCARDED_STALE', committed: false }, { state: 'SUCCEEDED', committed: true }] : [{ state: 'SUCCEEDED', committed: true }],
      binding: { mode: 'ans', qpp: 1, snapshotId: 'retained-answer-snapshot', sessionId: 'same-session', snapshotMode: 'ans', candidateMode: 'ans',
        keyHash: hash('same-key'), inputControlsHash: hash('same-input'), headerOptionsHash: hash('same-header'), outputRequestId: requestId,
        payloadHash: hash(requestId), envelopeMode: 'ans', urlMode: 'ans', urlRequestId: requestId, verifiedIdentityMatches: true,
        renderedIdentityMatches: true, envelopePresent: true, renderOutcomeOk: index !== 1, renderErrorPresent: false, runtimeBusy: index === 1 } };
  });
  cases.push({ name: Q.cacheCases[9], pass: true, first: { ok: false, code: 'DISCARDED_STALE' }, latest: { ok: true }, latestReadyMs: 40,
    maxLatestReadyMs: 3000, heldDecodeStillPendingAtLatestReady: true, oldDocumentPreservedWhilePending: true,
    inputAndBindingPreservedWhilePending: true, noGeometryBeforeImages: true, restoredAnswerSnapshotHit: true, noOverwriteAfterNativeDecodeSettled: true,
    printed: print(true), pendingEvidence: { rootPreserved: true, snapshotPreserved: true, unexpectedVisibleRoot: false, geometryReads: 0,
      candidatePages: 0, decodeReleased: false, decodeSettled: false, mathCalls: 0, mode: 'ans', snapshotId: 'retained-answer-snapshot',
      outputRequestId: 'initial-image-answer', inputAndBindingPreserved: true },
    latestEvidence: { mode: 'ans', cacheStatus: 'HIT', snapshotId: 'retained-answer-snapshot', outputRequestId: 'latest-image-answer', attemptCount: 3,
      decodeReleased: false, decodeSettled: false, geometryReads: 0, rootPreserved: true, inputPreserved: true },
    settledEvidence: { decodeSettled: true, lateNativeDecodeRejected: false, geometryReads: 0, unexpectedVisibleRoot: false,
      mode: 'ans', snapshotId: 'retained-answer-snapshot', outputRequestId: 'latest-image-answer', attemptCount: 3 } });
  const failed = [
    ['typeset-failure-preserves-exam', 'QA_TYPESET_FAILURE'], ['failed-typeset-print-blocked', 'QA_TYPESET_FAILURE'],
    ['actual-clipping-rolls-back-commit', 'PDF_CONTENT_CLIPPED'], ['pending-solution-keeps-exam', 'QA_PENDING'],
    ['final-pdf-readiness-failure', 'QA_FINAL_PDF_FAILURE'], ['final-pdf-failure-print-blocked', 'QA_FINAL_PDF_FAILURE'],
    ['full-finalizer-decode-pending', 'QA_DECODE_PENDING'], ['real50-qpp4-clipping-attempt-1', 'PDF_CONTENT_CLIPPED'],
    ['real50-qpp4-clipping-attempt-2', 'PDF_CONTENT_CLIPPED'], ['real50-qpp4-failed-print-1', 'PDF_CONTENT_CLIPPED'],
    ['real50-qpp4-failed-print-2', 'PDF_CONTENT_CLIPPED']
  ].map(([name, code]) => ({ name, pass: false, outcome: { ok: false, code } }));
  return { schema: 'ARCHIVE_OUTPUT_CACHE_CHROME_V1', currentSha: CURRENT, chromeVersion: '157.0.8103.38', pass: true, cases, knownIssue,
    fixture: { questions: 8, inputSha256: Q.fixtureSpecs.find(item => item.id === 'envelope8').inputSha256 },
    rows: [...failed, ...Array.from({ length: 38 }, (_, index) => ({ name: `valid-cache-${index}`, pass: true,
      outcome: { ok: true }, clippingCount: 0, pageOverflowCount: 0 })), ...qrRows, ...imageRows] };
}
function originalReport() {
  const readyNames = ['actual-50-baseline-1', 'actual-50-current-1', 'actual-50-baseline-2', 'actual-50-current-2',
    'actual-50-qpp1-baseline', 'actual-50-qpp1-current', 'actual-50-qpp2-baseline', 'actual-50-qpp2-current',
    'slow-svg-1600ms-current', 'slow-svg-6000ms-current', 'original-real-sol-baseline', 'original-real-sol-current'];
  const rows = readyNames.map(name => {
    const row = rowFor({ fixture: name.startsWith('original-') ? 'ordinary' : 'envelope50-qpp1', mode: 'sol', repeat: 1 }, 'current');
    Object.assign(row, { name, qpp: /qpp1/.test(name) ? 1 : /qpp2/.test(name) ? 2 : 4 });
    return row;
  });
  rows.push(...['image-broken-blocks-print', 'image-hanging-blocks-print', 'mixed-mode-failure-retry',
    'original-real-modes-with-raf-suppressed'].map(name => ({ name, pass: true })));
  return { schema: 'ARCHIVE_SOLUTION_LOADING_CHROME_V1', currentSha: CURRENT, baselineSha: Q.ORIGINAL_BASELINE,
    chromeVersion: '157.0.8103.38', repeats: 2, pass: true, rows,
    comparisons: ['actual-50-parity-1', 'actual-50-parity-2', 'actual-50-performance', 'actual-50-qpp1-parity',
      'actual-50-qpp2-parity', 'original-real-sol-parity'].map(name => ({ name, pass: true })),
    fixture: { questions: 50, baselinePayloadSha256: Q.KNOWN.inputSha256, currentPayloadSha256: Q.KNOWN.inputSha256,
      sources: clone(Q.fixtureSpecs[0].sources), solutionImages: 37,
      solutionAssets: { references: 37, uniqueFiles: 37, totalBytes: 3700, largestFileBytes: 100,
        files: Array.from({ length: 37 }, (_, index) => ({ path: `assets/images/test/${index}.svg`, bytes: 100, sha256: hash(`asset-${index}`) })) } } };
}
function artifacts() {
  return { performance: performanceReport('performance'), pdf: performanceReport('pdf'), cache: cacheReport(),
    'network:envelope50-qpp1': performanceReport('network:envelope50-qpp1'), 'network:envelope8': performanceReport('network:envelope8'),
    original: originalReport() };
}
function evaluate(input) { return Q.qualify(input, { currentSha: CURRENT }); }
function rejects(change, expectedCode) {
  const input = artifacts(); change(input); const result = evaluate(input);
  assert.equal(result.scopedReleasePass, false, 'an incomplete or changed product observation must fail closed');
  if (expectedCode) assert.ok(result.failures.some(item => item.code === expectedCode), JSON.stringify(result.failures));
  assert.equal(result.qualityPass, false);
}
function repairedNetworkArtifacts() {
  const input = artifacts(), network = input['network:envelope50-qpp1'];
  // This synthetic image is attached to its question's baseline page. The
  // classifier must find the same loaded image on that page in every repeat.
  const image = { loaded: true, sourceHash: hash('late-question-image'), width: 420, height: 300 };
  for (const report of [input.performance, input.pdf, network]) for (const row of [...report.rows, ...report.pdfRows]) {
    if (row.fixture === 'envelope50-qpp1' && row.mode === 'exam') {
      row.images = [clone(image)]; row.pages[0].images = [clone(image)];
    }
  }
  const previous = network.rows.find(row => row.label === 'baseline' && row.operation === 'sol-ans');
  const index = network.rows.findIndex(row => row.label === 'baseline' && row.operation === 'ans-exam');
  const failed = { ...clone(previous), operation: 'ans-exam', name: 'baseline-network-image-failure', pass: false,
    outcome: { ok: false, code: 'QUESTION_IMAGE_READINESS_INCOMPLETE' },
    error: { code: 'EXPECTED_RENDER_READY', details: { code: 'QUESTION_IMAGE_READINESS_INCOMPLETE' } },
    operationMath: { calls: 0, totalMs: 0 }, adapters: [{ method: 'build', ms: 1205 }],
    attempts: [...clone(previous.attempts), { state: 'FAILED', committed: false, code: 'QUESTION_IMAGE_READINESS_INCOMPLETE' }],
    imageBuildFailures: [{ operation: 2, attemptedMode: 'exam', qpp: 1, code: 'QUESTION_IMAGE_READINESS_INCOMPLETE',
      buildElapsedMs: 1205, wait: { method: 'waitForImages', timeoutMs: 1200, elapsedMs: 1201 },
      summary: { images: 1, loaded: 0, errors: 0, timeouts: 1 }, firstUnreadyIndex: 0,
      results: [{ index: 0, status: 'timeout', reason: 'LOAD_TIMEOUT', completeAtFailure: false,
        naturalWidth: 0, naturalHeight: 0, inStagingHost: true, inTargetArea: false,
        sourceRef: fullOrder[0], imageUrlSha256: image.sourceHash }] }] };
  network.rows[index] = failed;
  network.rows = network.rows.filter(row => !(row.label === 'baseline' && ['exam-sol-warm', 'same-sol'].includes(row.operation)));
  const cycle = network.cycles.find(item => item.label === 'baseline');
  Object.assign(cycle, { pass: false, completed: 2, failedOperation: 'ans-exam', error: clone(failed.error) });
  network.failures = [{ ...failed, error: clone(failed.error) }];
  for (const comparison of network.networkComparisons.filter(row => ['ans-exam', 'exam-sol-warm', 'same-sol'].includes(row.operation))) {
    Object.assign(comparison, { pass: false, error: { code: 'PARITY_INPUT_NOT_READY', details: { baselinePass: false, currentPass: true } } });
  }
  Object.assign(network.coverage, { observedRows: 8, complete: false,
    missingRows: network.coverage.measurements.filter(row => ['exam-sol-warm', 'same-sol'].includes(row.operation)).map(item => ({
      purpose: item.purpose, fixture: item.fixture, repeat: item.repeat, network: item.network, operation: item.operation, label: 'baseline',
      status: 'BLOCKED_OR_FAILED_BEFORE_CAPTURE', precedingFailure: { operation: 'ans-exam', code: 'EXPECTED_RENDER_READY' } })) });
  network.pass = false; network.outputParity = network.networkParity = 'FAIL';
  return input;
}
function rejectsRepair(change, expectedCode) {
  const input = repairedNetworkArtifacts(); change(input); const result = evaluate(input);
  assert.equal(result.scopedReleasePass, false);
  assert.ok(result.failures.some(item => item.code === expectedCode), JSON.stringify(result.failures));
}

test('only the precise scope qualifies; raw failures, known defect, and blocked coverage stay visible and immutable', () => {
  const input = artifacts(), originalBytes = JSON.stringify(input), result = evaluate(input);
  assert.deepEqual(result.failures, []);
  assert.equal(result.scopedReleasePass, true);
  assert.equal(result.qualityPass, false); assert.equal(result.universalProductPass, false);
  assert.equal(result.knownIssue.status, 'UNRESOLVED');
  assert.equal(result.rawReports.performance.pass, false); assert.equal(result.rawReports.pdf.outputParity, 'FAIL');
  assert.deepEqual([result.coverage.performance.plannedPairs, result.coverage.performance.observedPairs], [145, 130]);
  assert.equal(result.coverage.performance.blockedByKnownFailure.length, 15);
  assert.equal(result.coverage.performance.rawCoverageComplete, false);
  assert.equal(result.coverage.pdf.plannedPairs, 24); assert.equal(result.coverage.pdf.normalQualifiedPairs, 22);
  assert.equal(result.coverage.pdf.unchangedClippedLegacyPairs, 1);
  assert.equal(result.performance.measuredImprovement, true);
  assert.equal(JSON.stringify(input), originalBytes, 'qualification must never repair or rewrite raw evidence');
});

test('missing, duplicate, partial, or renamed observations cannot pass through a reduced manifest', () => {
  rejects(input => { delete input.original; }, 'ARTIFACT_SET_INCOMPLETE');
  rejects(input => { input.performance.rows.pop(); }, 'MISSING_OR_UNEXPECTED_ROW');
  rejects(input => { input.pdf.pdfRows = input.pdf.pdfRows.filter(row => !(row.fixture === 'envelope50' && row.operation === 'pdf-ans')); }, 'MISSING_OR_UNEXPECTED_ROW');
  rejects(input => { input.performance.rows[3] = clone(input.performance.rows[0]); }, 'MISSING_OR_UNEXPECTED_ROW');
  rejects(input => { input.performance.coverage.measurements.pop(); }, 'PLANNED_COVERAGE_CHANGED');
  rejects(input => { input.cache.cases.pop(); }, 'CACHE_CASE_COVERAGE_CHANGED');
  rejects(input => { input.original.rows.pop(); }, 'ORIGINAL_CASE_COVERAGE_CHANGED');
  rejects(input => { input.original.fixture.solutionAssets.files.pop(); }, 'ORIGINAL_SOLUTION_ASSET_EVIDENCE_INCOMPLETE');
});

test('a shared forged pass flag cannot hide source, image, math, page, continuation, or printed-pixel changes', () => {
  const current = input => input.performance.rows.find(row => row.fixture === 'images24' && row.label === 'current');
  rejects(input => { current(input).bodyHash = hash('changed'); }, 'PRINT_OR_BROWSER_READINESS_MISSING');
  rejects(input => { current(input).inputHash = hash('changed'); }, 'EXTENDED_OUTPUT_PARITY_CHANGED');
  rejects(input => { current(input).mathMarkupHash = hash('changed'); }, 'EXTENDED_OUTPUT_PARITY_CHANGED');
  rejects(input => { current(input).mathGeometry[0].width += 2; }, 'MATH_GEOMETRY_CHANGED');
  rejects(input => { current(input).pages[0].blocks[0].y += 2; }, 'BLOCK_GEOMETRY_CHANGED');
  rejects(input => { current(input).pages[0].blocks[0].sourceRef = ''; }, 'BLOCK_EVIDENCE_INVALID');
  rejects(input => { current(input).images.push({ loaded: false, sourceHash: hash('image'), width: 100, height: 100 }); }, 'IMAGE_READINESS_MISSING');
  rejects(input => { const row = input.performance.rows.find(row => row.fixture === 'continuation-golden' && row.mode === 'sol'); row.continuationCount = 0; }, 'CONTINUATION_NOT_EXERCISED');
  rejects(input => { input.pdf.pdfRows.find(row => row.label === 'current' && row.pdf).pdf.raster.pages[0].rgbSha256 = hash('changed'); }, 'PDF_PIXEL_OR_TEXT_CHANGED');
  rejects(input => { input.pdf.pdfRows.find(row => row.label === 'current' && row.pdf).pdf.raster.pages.pop(); }, 'PDF_EVIDENCE_INCOMPLETE');
  rejects(input => { input.pdf.pdfRows.find(row => row.label === 'current' && row.pdf).pdf.raster.textSha256 = hash('changed'); }, 'PDF_PIXEL_OR_TEXT_CHANGED');
});

test('PDF rollback is bound to the stable post-print snapshot after legitimate font invalidation', () => {
  const input = artifacts(), before = input.pdf.pdfRows.find(row => row.fixture === 'envelope50' && row.label === 'current' && row.operation === 'pdf-exam');
  const failed = input.pdf.pdfRows.find(row => row.fixture === 'envelope50' && row.label === 'current' && row.operation === 'pdf-sol');
  before.pdf.afterPrintState.snapshotId = 'stable-after-font-invalidation';
  failed.snapshotId = 'stable-after-font-invalidation';
  assert.equal(evaluate(input).scopedReleasePass, true);
  failed.snapshotId = before.snapshotId;
  assert.ok(evaluate(input).failures.some(item => item.code === 'KNOWN_FAILURE_DID_NOT_RESTORE_HEALTHY_VIEW'));
  rejects(value => { delete value.pdf.pdfRows.find(row => row.pdf).pdf.afterPrintState; }, 'POST_PRINT_STABLE_STATE_MISSING');
});

test('known clipping is bound to the pinned input, sole PNG, dimensions, page and column, and raw failure', () => {
  rejects(input => { input.pdf.fixtures[0].inputSha256 = hash('new input'); }, 'PINNED_FIXTURE_CHANGED');
  rejects(input => { input.cache.knownIssue.sourceUid = 'another UID'; }, 'KNOWN_ISSUE_GUARD_NOT_BOUND');
  rejects(input => { input.performance.rows.find(row => negative(row) && row.label === 'baseline' && row.operation === 'exam-sol').clippingEvidence[0].overflowingDescendants[0].imageUrlSha256 = hash('another image'); }, 'KNOWN_CLIPPING_SIGNATURE_CHANGED');
  rejects(input => { input.pdf.pdfRows.find(row => negative(row) && row.label === 'baseline').clippingEvidence[0].scrollWidth = 433; }, 'KNOWN_CLIPPING_SIGNATURE_CHANGED');
  rejects(input => { input.performance.rows.find(row => negative(row)).outcome.code = 'PDF_READINESS_TIMEOUT'; }, 'KNOWN_FAILURE_CAUSE_CHANGED');
  rejects(input => { input.performance.pass = true; }, 'RAW_RESULT_REWRITTEN_OR_INCOMPLETE');
  rejects(input => { input.pdf.pdfComparisons.find(row => !row.pass).pass = true; }, 'KNOWN_FAILURE_FALSELY_PASSED');
  rejects(input => { input.performance.coverage.complete = true; }, 'COVERAGE_ACCOUNTING_CHANGED');
  rejects(input => { input.performance.coverage.missingRows[0].precedingFailure.code = 'OUTPUT_READY_TIMEOUT'; }, 'BLOCKED_CAUSE_CHANGED');
});

test('successful normal output cannot reuse the known clipping exception', () => {
  rejects(input => { const row = input.performance.rows.find(row => row.fixture === 'images24'); row.clippingCount = 1; row.clippingEvidence = [clipping()]; }, 'UNCLASSIFIED_OUTPUT_CLIPPING');
  rejects(input => { const row = input.performance.rows.find(row => row.fixture === 'envelope50-qpp1'); row.pageOverflowCount = 1; }, 'UNCLASSIFIED_OUTPUT_CLIPPING');
  rejects(input => { input.performance.failures.push({ purpose: 'performance', fixture: 'ordinary', repeat: 1, network: 'normal', label: 'current', operation: 'cold-exam', error: { code: 'PDF_CONTENT_CLIPPED' } }); }, 'UNCLASSIFIED_REPORT_FAILURE');
});

test('rollback, input retention, print blocking, and abort latency are required even when cases claim PASS', () => {
  rejects(input => { const row = input.performance.rows.find(row => negative(row) && row.label === 'current'); row.snapshotId = 'wrong'; }, 'KNOWN_FAILURE_DID_NOT_RESTORE_HEALTHY_VIEW');
  rejects(input => { input.cache.cases[7].failures[0].inputPreserved = false; }, 'KNOWN_FAILURE_PRESERVATION_NOT_PROVEN');
  rejects(input => { input.cache.cases[7].blockedPrints[0].printCalls = 1; }, 'PRINT_GUARD_NOT_PROVEN');
  rejects(input => { input.cache.cases[7].failedOperationQualityPass = true; }, 'KNOWN_ISSUE_GUARD_NOT_BOUND');
  rejects(input => { input.cache.cases[6].latestReadyMs = 3001; }, 'PENDING_DECODE_CANCELLATION_NOT_PROVEN');
  rejects(input => { input.cache.cases[6].heldDecodeStillPendingAtLatestReady = false; }, 'PENDING_DECODE_CANCELLATION_NOT_PROVEN');
  rejects(input => { input.cache.cases[6].previousViewRestoredBeforeLatestCommit.oldUrlRestored = false; }, 'PENDING_DECODE_CANCELLATION_NOT_PROVEN');
});

test('only complete cold network observations with the measured policy qualify', () => {
  rejects(input => { input['network:envelope50-qpp1'].rows[0].metadataTransfer.state = 'PENDING'; }, 'BASELINE_METADATA_TRANSFER_INCOMPLETE');
  rejects(input => { input['network:envelope8'].rows.find(row => row.label === 'current').metadataTransfer.notRequestedUnderFrozenSourcePolicy = false; }, 'FROZEN_METADATA_POLICY_NOT_OBSERVED');
  rejects(input => { input['network:envelope8'].conditions.slowNetwork.latencyMs = 0; }, 'BENCHMARK_CONDITIONS_CHANGED');
  rejects(input => { input['network:envelope8'].failures.push({ error: { code: 'PERFORMANCE_OPERATION_TIMEOUT' } }); }, 'UNCLASSIFIED_REPORT_FAILURE');
});

test('only a proven baseline image deadline may be classified repaired, with all five current operations ready', () => {
  const input = repairedNetworkArtifacts(), before = JSON.stringify(input), result = evaluate(input);
  assert.deepEqual(result.failures, []);
  assert.equal(result.scopedReleasePass, true);
  assert.equal(result.rawReports['network:envelope50-qpp1'].pass, false);
  assert.equal(result.qualityPass, false);
  const repair = result.repairs['network:envelope50-qpp1'];
  assert.equal(repair.classification, 'REPAIRED_BASELINE_IMAGE_READINESS');
  assert.equal(repair.baselineQualityPass, false);
  assert.equal(repair.candidateReadyOperations, 5);
  assert.equal(repair.directTimingAndOutputPairs, 2);
  assert.equal(repair.crossContextOutputComparisons.length, 3);
  assert.equal(repair.timedOutImages[0].imageUrlSha256, hash('late-question-image'));
  assert.equal(result.coverage['network:envelope50-qpp1'].rawFailedComparisons, 3);
  assert.equal(JSON.stringify(input), before);
});

test('repaired baseline classification rejects wrong deadlines, unknown images, changed statuses, and candidate errors', () => {
  const failure = input => input['network:envelope50-qpp1'].rows.find(row => row.label === 'baseline' && row.operation === 'ans-exam');
  const diagnostic = input => failure(input).imageBuildFailures[0];
  rejectsRepair(input => { diagnostic(input).wait.timeoutMs = 15000; }, 'REPAIRED_BASELINE_DEADLINE_NOT_OBSERVED');
  rejectsRepair(input => { diagnostic(input).wait.method = 'waitForImage'; }, 'REPAIRED_BASELINE_DEADLINE_NOT_OBSERVED');
  rejectsRepair(input => { diagnostic(input).results[0].imageUrlSha256 = hash('unknown image'); }, 'REPAIRED_BASELINE_IMAGE_NOT_IN_PINNED_PAGE');
  rejectsRepair(input => { diagnostic(input).results[0].sourceRef = fullOrder.at(-1); }, 'REPAIRED_BASELINE_IMAGE_NOT_IN_PINNED_PAGE');
  rejectsRepair(input => { diagnostic(input).results[0].status = 'error'; }, 'REPAIRED_BASELINE_IMAGE_STATUS_CHANGED');
  rejectsRepair(input => { diagnostic(input).results[0].reason = 'DECODE_TIMEOUT'; }, 'REPAIRED_BASELINE_IMAGE_NOT_PENDING');
  rejectsRepair(input => { diagnostic(input).results[0].completeAtFailure = true; }, 'REPAIRED_BASELINE_IMAGE_NOT_PENDING');
  rejectsRepair(input => { failure(input).operationMath.calls = 1; }, 'REPAIRED_BASELINE_FAILURE_STAGE_CHANGED');
  rejectsRepair(input => { failure(input).adapters.push({ method: 'attach' }); }, 'REPAIRED_BASELINE_FAILURE_STAGE_CHANGED');
  rejectsRepair(input => { failure(input).snapshotId = 'unrelated-answer'; }, 'REPAIRED_BASELINE_OLD_ANSWER_NOT_PRESERVED');
  rejectsRepair(input => { failure(input).imageBuildFailures = []; }, 'REPAIRED_BASELINE_IMAGE_DIAGNOSTIC_MISSING');
  rejectsRepair(input => { input['network:envelope50-qpp1'].rows.find(row => row.label === 'current' && row.operation === 'ans-exam').pass = false; }, 'NORMAL_ROW_NOT_READY');
  rejectsRepair(input => { input['network:envelope50-qpp1'].rows.pop(); }, 'REPAIRED_NETWORK_ROW_COVERAGE_INCOMPLETE');
  rejectsRepair(input => { input['network:envelope50-qpp1'].fixtures[0].sources[0].sha256 = hash('patched source'); }, 'PINNED_FIXTURE_CHANGED');
});

test('repaired outputs need complete qualified normal/PDF references; missing network observations never become paired PASS', () => {
  rejectsRepair(input => { input.performance.rows = input.performance.rows.filter(row => !(row.label === 'baseline' && row.fixture === 'envelope50-qpp1' && row.operation === 'cold-exam')); }, 'REPAIRED_NETWORK_NORMAL_BASELINE_UNQUALIFIED');
  rejectsRepair(input => { delete input.pdf; }, 'REPAIRED_NETWORK_NORMAL_BASELINE_UNQUALIFIED');
  rejectsRepair(input => { input['network:envelope50-qpp1'].networkComparisons.find(row => row.operation === 'same-sol').pass = true; }, 'REPAIRED_NETWORK_FALSE_PAIRED_PASS');
  rejectsRepair(input => { input['network:envelope50-qpp1'].coverage.complete = true; }, 'REPAIRED_NETWORK_COVERAGE_ACCOUNTING_CHANGED');
  rejectsRepair(input => { const row = input['network:envelope50-qpp1'].rows.find(item => item.label === 'current' && item.operation === 'ans-exam'); row.mathMarkupHash = hash('different math'); }, 'EXTENDED_OUTPUT_PARITY_CHANGED');
});

test('a pending image header may expose only the exact intrinsic dimensions verified by every ready baseline page', () => {
  const pending = input => input['network:envelope50-qpp1'].rows.find(row => row.label === 'baseline' && row.operation === 'ans-exam').imageBuildFailures[0].results[0];
  const input = repairedNetworkArtifacts();
  Object.assign(pending(input), { naturalWidth: 420, naturalHeight: 300 });
  const result = evaluate(input);
  assert.deepEqual(result.failures, []);
  assert.equal(result.scopedReleasePass, true);
  assert.equal(result.rawReports['network:envelope50-qpp1'].pass, false);
  assert.equal(result.repairs['network:envelope50-qpp1'].timedOutImages[0].intrinsicDimensionsKnown, true);
  assert.deepEqual(result.repairs['network:envelope50-qpp1'].timedOutImages[0].intrinsicDimensionsAtTimeout, { width: 420, height: 300 });
  rejectsRepair(value => { Object.assign(pending(value), { naturalWidth: 421, naturalHeight: 300 }); }, 'REPAIRED_BASELINE_IMAGE_DIMENSIONS_MISMATCH');
  for (const [width, height] of [[0, 300], [420, 0], [-420, 300], [420, -300], [Infinity, 300], [420, NaN], [420.5, 300]])
    rejectsRepair(value => { Object.assign(pending(value), { naturalWidth: width, naturalHeight: height }); }, 'REPAIRED_BASELINE_IMAGE_DIMENSIONS_INVALID');
  rejectsRepair(value => {
    Object.assign(pending(value), { naturalWidth: 420, naturalHeight: 300 });
    for (const row of value.performance.rows.filter(row => row.fixture === 'envelope50-qpp1' && row.operation === 'cold-exam' && row.repeat === 3)) {
      row.images[0].height = 301; row.pages[0].images[0].height = 301;
    }
  }, 'REPAIRED_BASELINE_IMAGE_DIMENSIONS_MISMATCH');
});

test('request-bound QR must rebuild actual pixels for the fresh request while retaining safe mode hits', () => {
  rejects(input => { input.cache.cases[8].examProofs[1].qr.expectedPixelSha256 = hash('stale QR'); }, 'QR_PIXELS_OR_IDENTITY_NOT_VERIFIED');
  rejects(input => { input.cache.cases[8].examProofs[1].qr.pixelSha256 = input.cache.cases[8].examProofs[0].qr.pixelSha256; }, 'QR_REQUEST_OR_PIXELS_STALE');
  rejects(input => { input.cache.cases[8].examProofs[1].newRoot = false; }, 'QR_EXAM_WAS_NOT_REBUILT');
  rejects(input => { input.cache.cases[8].examProofs[1].qr.blackPixels = 0; }, 'QR_PIXELS_OR_IDENTITY_NOT_VERIFIED');
  rejects(input => { input.cache.cases[8].examProofs[1].qr.unclipped = false; }, 'QR_PIXELS_OR_IDENTITY_NOT_VERIFIED');
  rejects(input => { input.cache.cases[8].print.qrPixelSha256 = hash('changed during print'); }, 'QR_PRINT_PIXELS_CHANGED');
  rejects(input => { input.cache.cases[8].modeHits[0].buildCalls = 1; }, 'QR_SAFE_MODE_CACHE_NOT_REUSED');
  rejects(input => { const row = input.cache.rows.find(item => item.name === 'qr-exam-after-solution-rebuilt'); row.binding.urlRequestId = 'stale'; }, 'QR_ROW_BINDING_NOT_READY');
  rejects(input => { const row = input.cache.rows.find(item => item.name === 'qr-exam-after-solution-rebuilt'); row.inputHash = hash('changed input'); }, 'EXTENDED_OUTPUT_PARITY_CHANGED');
});

test('the longer image budget cannot hold a newer request, measure unready geometry, or overwrite its answer later', () => {
  rejects(input => { input.cache.cases[9].latestReadyMs = 3001; }, 'EXAM_IMAGE_CANCELLATION_NOT_PROVEN');
  rejects(input => { input.cache.cases[9].pendingEvidence.geometryReads = 1; }, 'PENDING_EXAM_IMAGE_MEASURED_OR_REPLACED_VIEW');
  rejects(input => { input.cache.cases[9].pendingEvidence.candidatePages = 1; }, 'PENDING_EXAM_IMAGE_MEASURED_OR_REPLACED_VIEW');
  rejects(input => { input.cache.cases[9].latestEvidence.decodeReleased = true; }, 'LATEST_ANSWER_WAITED_FOR_EXAM_IMAGE');
  rejects(input => { input.cache.cases[9].latestEvidence.decodeSettled = true; }, 'LATEST_ANSWER_WAITED_FOR_EXAM_IMAGE');
  rejects(input => { input.cache.cases[9].settledEvidence.geometryReads = 1; }, 'RELEASED_EXAM_IMAGE_RESUMED_LAYOUT');
  rejects(input => { input.cache.cases[9].printed.printCalls = 0; }, 'PRINT_GUARD_NOT_PROVEN');
  rejects(input => { input.cache.rows.find(row => row.name === 'exam-staging-decode-pending').binding.inputControlsHash = hash('lost input'); }, 'PENDING_EXAM_IMAGE_CHANGED_PREVIOUS_BINDING');
  rejects(input => { input.cache.rows.find(row => row.name === 'released-exam-image-cannot-overwrite-answer').binding.payloadHash = hash('late overwrite'); }, 'RELEASED_EXAM_IMAGE_REPLACED_BINDING');
});

test('same-source final commit and Chrome versions are mandatory across all artifacts', () => {
  rejects(input => { input.cache.currentSha = '2'.repeat(40); }, 'ARTIFACT_SHA_MISMATCH');
  rejects(input => { input.pdf.chromeVersion = '156.0.0.0'; }, 'CHROME_VERSION_MISMATCH');
  rejects(input => { input.original.baselineSha = Q.BASELINE; }, 'ORIGINAL_REGRESSION_NOT_PASSED');
  rejects(input => { input.performance.baselineSha = Q.ORIGINAL_BASELINE; }, 'REPORT_ROLE_OR_BASELINE_CHANGED');
});

test('parity without repeat-supported performance improvement does not qualify, and slowdowns stay in the result', () => {
  rejects(input => { for (const row of input.performance.rows) row.publicMs = 1000; }, 'NO_REPEAT_SUPPORTED_PERFORMANCE_GAIN');
  const input = artifacts();
  for (const row of input.performance.rows.filter(row => row.fixture === 'ordinary' && row.label === 'current')) row.publicMs = 1200;
  const result = evaluate(input);
  assert.equal(result.scopedReleasePass, true);
  assert.equal(result.performance.slowdowns.filter(item => item.fixture === 'ordinary').length, 7);
  assert.equal(result.performance.gains[0].current.p95Ms, 603);
});

test('CLI consumes exactly one complete artifact set, emits explicit scoped status, and exits nonzero on missing evidence', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-release-qualifier-test-'));
  const filename = path.resolve(__dirname, 'archive2-output-release-qualification.cjs');
  try {
    const input = artifacts();
    for (const [role, report] of Object.entries(input)) {
      const folder = path.join(directory, role.replace(':', '-')); fs.mkdirSync(folder);
      fs.writeFileSync(path.join(folder, role === 'cache' ? 'output-cache.json' : role === 'original' ? 'solution-loading.json' : 'output-performance.json'), JSON.stringify(report));
    }
    const stdout = execFileSync(process.execPath, [filename, '--artifacts', directory, '--current-sha', CURRENT], { encoding: 'utf8', maxBuffer: 1024 * 1024 });
    assert.equal(JSON.parse(stdout).scopedReleasePass, true);
    const saved = JSON.parse(fs.readFileSync(path.join(directory, 'output-release-qualification.json'), 'utf8'));
    assert.equal(saved.qualityPass, false); assert.equal(saved.artifacts.length, 6);
    fs.rmSync(path.join(directory, 'original'), { recursive: true });
    const failed = spawnSync(process.execPath, [filename, '--artifacts', directory, '--current-sha', CURRENT], { encoding: 'utf8' });
    assert.equal(failed.status, 1); assert.equal(JSON.parse(failed.stdout).scopedReleasePass, false);
    fs.copyFileSync(path.join(directory, 'cache', 'output-cache.json'), path.join(directory, 'output-cache.json'));
    assert.throws(() => Q.loadArtifacts(directory), /UNKNOWN_OR_DUPLICATE_ARTIFACT/);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
