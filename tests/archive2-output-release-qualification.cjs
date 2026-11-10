'use strict';

// This is a scoped, fail-closed release decision, not a replacement for the
// browser reports. The pinned real-50 qpp4 solution remains a quality failure.
// Never rewrite a raw report, call a blocked operation PASS, or accept an
// arbitrary PDF_CONTENT_CLIPPED error as the known defect below.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const BASELINE = '87d7a554448d8ecf9ab5a535f2ff5541b0c79a0a';
const ORIGINAL_BASELINE = 'f446e62a29f90d6d30a76b295e5c226f5ead72d2';
const sourceFiles = [
  ['archive/exams/original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js', '68547f3cf08c82ef4f3261e51ec9aa01b7aba7768bfbb92d7f30370407fc7a44'],
  ['archive/exams/original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js', 'f35d15d932be75d29e9ee713ff15fb0173f55668056d275e1131c4a2fa5e03e8'],
  ['archive/exams/original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js', 'cd1c72c86ab16ebf0a4d3a3fd74411cfaae9db5410f9893444a217935825f2f1'],
  ['archive/exams/original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js', 'dd796d74b890de0cbc45cf0be3111ec28b0772acfbf1cfe572aa2d0a157bdfad'],
  ['archive/exams/test-fixtures/render-authority-golden.js', '5fff5db0ea5864e6101965ea7b61fde0756412a5da1213d0f337684bde80a0b7']
].map(([file, sha256]) => ({ file, sha256 }));
const fullInputHash = 'a4c280aeb8370bd08f8b2650a8107e044bc829d63373ab14aa6def1222282b8f';
const fixtureSpecs = [
  ['envelope50', 'envelope', 4, 50, fullInputHash, [0, 1, 2]],
  ['envelope50-qpp1', 'envelope', 1, 50, fullInputHash, [0, 1, 2]],
  ['images24', 'original', 4, 24, '4df278a050d2c2b93413ce70bdb7f64ece34df0331dba98c9c4a35958f3023b0', [1]],
  ['long23', 'original', 4, 23, 'c0e5ca18f3602ea8eede79385fa0c03739287f03397569f3f46d43336813d7ab', [3]],
  ['ordinary', 'original', 4, 24, '99ba5a48bdf7e37c7cebb037d300e4567828b812ee060c4ae07bb73c00a3cc1b', [0]],
  ['envelope8', 'envelope', 4, 8, '341cfc41c17992ce0e23f259113c32aa86185886e463ce65ae13f95c6881ce4f', [0]],
  ['legacy50', 'legacy', 4, 50, fullInputHash, [0, 1, 2]],
  ['continuation-golden', 'original', 4, 8, 'fa8114b45d8619dd21a0a5a8e4b83272972d661a8f8e99854411158f26218bf6', [4]]
].map(([id, kind, qpp, questions, inputSha256, sources]) => ({ id, kind, qpp, questions, inputSha256, sources: sources.map(i => sourceFiles[i]) }));
const fixtureById = Object.fromEntries(fixtureSpecs.map(item => [item.id, item]));
const KNOWN = Object.freeze({ id: 'REAL50_QPP4_REMINDER_IMAGE_CLIPPING',
  sourceFile: sourceFiles[0].file, sourceSha256: sourceFiles[0].sha256,
  sourceUid: 'loading:original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js:17',
  sourceRef: 'original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js#loading:original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js:17',
  imageUrlSha256: 'b8540f83de484057de8a96edec2ee7a44307d7f4f72d62e221241b773d1a61ef',
  inputSha256: fullInputHash, projectedInputHash: '1648f066f61f6dff4e675e6da74249b1200a6dd2fec97b572fba72bd2a1a8260',
  sourceOrderSha256: '8a137211edea5492f6267aef076580941743dec0177a44bda11b0b2e077a3855',
  inputUidsSha256: '0699a1460354f5764ec8283f05ae148d640aa62d5406199e9697a4134d085d61' });
const operations = {
  mode: [['cold-exam', 'exam'], ['exam-sol', 'sol'], ['sol-ans', 'ans'], ['ans-exam', 'exam'], ['exam-sol-warm', 'sol'], ['sol-ans-warm', 'ans'], ['same-ans', 'ans']],
  cold: [['cold-sol', 'sol']], golden: [['cold-sol', 'sol'], ['sol-ans', 'ans'], ['ans-sol-warm', 'sol']],
  pdf: [['pdf-exam', 'exam'], ['pdf-sol', 'sol'], ['pdf-ans', 'ans']],
  network: [['cold-sol', 'sol'], ['sol-ans', 'ans'], ['ans-exam', 'exam'], ['exam-sol-warm', 'sol'], ['same-sol', 'sol']]
};
const blockedOperations = operations.mode.slice(2).map(([operation]) => operation);
const cacheCases = ['strict-cache-reuse-and-print', 'editor-source-and-option-invalidation', 'typeset-failure-and-retry',
  'actual-layout-failure-and-rollback', 'latest-public-request-wins', 'final-readiness-failure-and-retry',
  'pending-finalizer-decode-cancellation', 'known-real50-qpp4-clipping-preservation', 'solution-qr-refreshes-request-canvas',
  'pending-exam-image-cancellation'];
const qrRowNames = ['solution-qr-refreshes-request-canvas-initial', 'qr-first-solution-miss', 'qr-exam-after-solution-rebuilt',
  'qr-first-answer-miss', 'qr-exam-after-answer-rebuilt', 'qr-exam-safe-print-vector', 'qr-solution-cache-hit', 'qr-answer-cache-hit'];
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isHash = value => /^[a-f0-9]{64}$/.test(value || '');
const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
function requireThat(value, code, details = {}) {
  if (!value) throw Object.assign(new Error(code), { code, details });
}
function key(row, label = false) {
  return [row.purpose, row.fixture, row.repeat, row.network, row.operation, ...(label === true ? [row.label] : [])].join('|');
}
function exactSet(actual, expected, code) {
  requireThat(Array.isArray(actual) && actual.length === expected.length && new Set(actual).size === actual.length &&
    actual.every(value => expected.includes(value)), code, { expected: expected.length, observed: actual?.length });
}
function expectedPlan(role) {
  const measurements = [], cycles = [];
  const purpose = role.startsWith('network:') ? 'network' : role;
  const network = purpose === 'network' ? 'slow-complete' : 'normal';
  function add(fixture, repeat, cycleOperations) {
    for (const [operation, mode] of cycleOperations) measurements.push({ purpose, fixture: fixture.id, qpp: fixture.qpp,
      repeat, network, operation, mode, labels: ['baseline', 'current'] });
    for (const label of ['baseline', 'current']) cycles.push({ purpose, fixture: fixture.id, qpp: fixture.qpp,
      repeat, network, label, operations: cycleOperations.map(([operation]) => operation) });
  }
  if (purpose === 'network') add(fixtureById[role.split(':')[1]], 1, operations.network);
  else if (purpose === 'pdf') {
    for (const fixture of fixtureSpecs) add(fixture, 1, operations.pdf);
    // The ordinary qpp4 cycle fails at sol. Its answer still needs actual PDF
    // coverage in a separate context; it is already in the measurement plan.
    for (const label of ['baseline', 'current']) cycles.push({ purpose, fixture: 'envelope50', qpp: 4,
      repeat: 1, network, label, operations: ['pdf-ans'] });
  } else {
    for (let repeat = 1; repeat <= 3; repeat += 1) for (const fixture of fixtureSpecs.slice(0, 6)) {
      add(fixture, repeat, operations.mode);
      if (fixture.kind === 'envelope') add(fixture, repeat, operations.cold);
    }
    add(fixtureById.legacy50, 1, operations.mode);
    add(fixtureById['continuation-golden'], 1, operations.golden);
  }
  return { measurements, cycles };
}
function isBlocked(item) {
  return item.purpose === 'performance' && item.fixture === 'envelope50' && item.network === 'normal' &&
    [1, 2, 3].includes(item.repeat) && blockedOperations.includes(item.operation);
}
function isKnownFailure(item) {
  return item.fixture === 'envelope50' && item.network === 'normal' &&
    ((item.purpose === 'performance' && ['exam-sol', 'cold-sol'].includes(item.operation)) ||
      (item.purpose === 'pdf' && item.operation === 'pdf-sol'));
}
function isKnownLegacy(item) {
  return item.fixture === 'legacy50' && item.network === 'normal' && ['exam-sol', 'exam-sol-warm', 'pdf-sol'].includes(item.operation);
}
function assertCause(cause, column) {
  requireThat(cause?.tag === 'IMG' && cause.sourceRef === KNOWN.sourceRef && cause.imageUrlSha256 === KNOWN.imageUrlSha256 &&
    cause.imageNaturalWidth === 420 && cause.imageNaturalHeight === 300 && cause.imageLoaded === true &&
    column.page === 8 && column.clientWidth === 340 && column.scrollWidth === 432 &&
    column.clientHeight === 943 && column.scrollHeight === 943 && column.overflowX === 'hidden' &&
    same(column.classes, ['grid-col', 'sol-grid-col']) &&
    [['x', 12], ['y', 77], ['width', 420], ['height', 300]].every(([field, value]) =>
      typeof cause[field] === 'number' && Math.abs(cause[field] - value) <= 1), 'KNOWN_CLIPPING_SIGNATURE_CHANGED');
}
function assertClipping(row) {
  requireThat(row.qpp === 4 && row.questionCount === 50 && row.inputHash === KNOWN.projectedInputHash &&
    row.pageCount === 23 && row.clippingCount === 1 && row.pageOverflowCount === 0 && row.clippingEvidence?.length === 1,
  'KNOWN_CLIPPING_DENOMINATOR_CHANGED');
  const column = row.clippingEvidence[0];
  requireThat(column.overflowingDescendantCount === 1 && column.overflowingDescendants?.length === 1,
    'KNOWN_CLIPPING_DESCENDANTS_CHANGED');
  assertCause(column.overflowingDescendants[0], column);
}
function assertReady(row, spec, { extended = true, allowKnownClip = false } = {}) {
  requireThat(row.pass === true && row.outcome?.ok === true && row.questionCount === spec.questions && row.qpp === spec.qpp,
    'NORMAL_ROW_NOT_READY');
  requireThat(Array.isArray(row.expectedOrder) && row.expectedOrder.length === spec.questions &&
    new Set(row.expectedOrder).size === spec.questions && same(row.sourceOrder, row.expectedOrder) &&
    row.inputUids?.length === spec.questions, 'SOURCE_ORDER_INCOMPLETE');
  requireThat(row.mathErrors === 0 && row.unrenderedMath === 0 && Number.isInteger(row.mathCount) && row.mathCount >= 0 &&
    isHash(row.bodyHash) && finite(row.firstBoxMs), 'MATH_OR_VISIBLE_READINESS_MISSING');
  requireThat(Number.isInteger(row.pageCount) && row.pageCount > 0 && row.pages?.length === row.pageCount &&
    row.blockCount >= spec.questions && row.pages.reduce((sum, page) => sum + page.blocks.length, 0) === row.blockCount,
  'PAGE_OR_BLOCK_EVIDENCE_INCOMPLETE');
  requireThat(Array.isArray(row.images) && row.images.every(image => image.loaded === true && isHash(image.sourceHash) &&
    image.width > 0 && image.height > 0), 'IMAGE_READINESS_MISSING');
  for (const page of row.pages) {
    requireThat(page.width > 0 && page.height > 0 && isHash(page.textHash) && Array.isArray(page.images), 'PAGE_EVIDENCE_INVALID');
    // Exam grids retain empty final slots. They are geometry, not missing
    // questions: accept only their empty-text digest and compare every slot.
    for (const block of page.blocks) requireThat(typeof block.sourceRef === 'string' &&
      (block.sourceRef || row.mode === 'exam' && block.textHash === digest('')) && isHash(block.textHash) &&
      ['x', 'y', 'width', 'height'].every(axis => finite(block[axis])), 'BLOCK_EVIDENCE_INVALID');
  }
  if (!extended) return;
  if (spec.inputSha256 === KNOWN.inputSha256) requireThat(row.inputHash === KNOWN.projectedInputHash &&
    digest(JSON.stringify(row.expectedOrder)) === KNOWN.sourceOrderSha256 && digest(JSON.stringify(row.inputUids)) === KNOWN.inputUidsSha256,
  'REAL50_SOURCE_IDENTITY_CHANGED');
  requireThat(isHash(row.inputHash) && isHash(row.mathMarkupHash) && Array.isArray(row.mathGeometry) &&
    row.mathGeometry.length === row.mathCount && row.mathGeometry.every(item => finite(item.width) && finite(item.height)),
  'MATH_OR_INPUT_EVIDENCE_MISSING');
  requireThat(row.pageOverflowCount === 0 && (allowKnownClip || row.clippingCount === 0), 'UNCLASSIFIED_OUTPUT_CLIPPING');
  if (allowKnownClip) assertClipping(row);
  requireThat(row.pageErrors?.length === 0 && !row.error && row.printPreflight?.ok === true &&
    row.printPreflight.outputParity?.bodyHash === row.bodyHash &&
    row.printPreflight.outputParity?.pages === row.pageCount &&
    row.printPreflight.outputParity?.coordinateTolerancePx === 1, 'PRINT_OR_BROWSER_READINESS_MISSING');
  requireThat(finite(row.publicMs) && finite(row.operationMath?.totalMs) && Number.isInteger(row.operationMath?.calls) &&
    finite(row.cdp?.LayoutDurationMs) && Number.isInteger(row.cdp?.LayoutCount), 'PERFORMANCE_ACCOUNTING_MISSING');
  if (spec.kind === 'envelope') requireThat(row.envelope?.present === true && row.envelope.mode === row.mode &&
    row.envelope.verifiedIdentityMatches === true && row.envelope.renderedIdentityMatches === true &&
    row.envelope.urlIdentityMatches === true && row.envelope.errorPresent === false, 'ENVELOPE_READINESS_MISSING');
  if (spec.id === 'continuation-golden' && row.mode === 'sol') requireThat(row.continuationCount > 0, 'CONTINUATION_NOT_EXERCISED');
}
function assertParity(before, after, extended = true) {
  for (const field of ['questionCount', 'qpp', 'blockCount', 'pageCount', 'bodyHash', 'sourceOrder', 'inputUids', 'mathCount', 'images'])
    requireThat(same(before[field], after[field]), 'OUTPUT_PARITY_CHANGED', { field });
  requireThat(before.pages.length === after.pages.length, 'PAGE_COUNT_CHANGED');
  before.pages.forEach((page, pageIndex) => {
    const target = after.pages[pageIndex];
    for (const field of ['width', 'height', 'textHash', 'images'])
      requireThat(same(page[field], target[field]), 'PAGE_PARITY_CHANGED', { field, page: pageIndex + 1 });
    requireThat(page.blocks.length === target.blocks.length, 'PAGE_BLOCK_COUNT_CHANGED');
    page.blocks.forEach((block, blockIndex) => {
      const other = target.blocks[blockIndex];
      requireThat(block.sourceRef === other.sourceRef && block.textHash === other.textHash, 'BLOCK_SOURCE_OR_CONTENT_CHANGED');
      for (const axis of ['x', 'y', 'width', 'height']) requireThat(Math.abs(block[axis] - other[axis]) <= 1, 'BLOCK_GEOMETRY_CHANGED');
    });
  });
  if (!extended) return;
  for (const field of ['inputHash', 'mathMarkupHash', 'clippingCount', 'pageOverflowCount', 'continuationCount'])
    requireThat(same(before[field], after[field]), 'EXTENDED_OUTPUT_PARITY_CHANGED', { field });
  requireThat(before.mathGeometry.length === after.mathGeometry.length, 'MATH_GEOMETRY_COUNT_CHANGED');
  before.mathGeometry.forEach((item, i) => {
    for (const axis of ['width', 'height']) requireThat(Math.abs(item[axis] - after.mathGeometry[i][axis]) <= 1, 'MATH_GEOMETRY_CHANGED');
  });
}
function assertPdf(before, after) {
  for (const row of [before, after]) {
    const pdf = row.pdf;
    requireThat(pdf?.generated === true && pdf.pageCount === row.pageCount && pdf.mediaBoxes?.length === row.pageCount &&
      pdf.raster?.pages?.length === row.pageCount && pdf.raster.renderer === 'Poppler pdftoppm' && pdf.raster.dpi === 96 &&
      isHash(pdf.raster.textSha256) && Number.isInteger(pdf.raster.textBytes) && pdf.raster.textBytes > 0 &&
      pdf.screenParity?.bodyHash === row.bodyHash && pdf.screenParity.pages === row.pageCount &&
      pdf.screenParity.coordinateTolerancePx === 1, 'PDF_EVIDENCE_INCOMPLETE');
    pdf.raster.pages.forEach((page, index) => requireThat(page.page === index + 1 && page.width > 0 && page.height > 0 &&
      isHash(page.rgbSha256), 'PDF_RASTER_PAGE_MISSING'));
    const stable = pdf.afterPrintState;
    requireThat(stable?.snapshotId && stable.mode === row.mode && stable.snapshotMode === row.mode && stable.committedMode === row.mode &&
      stable.runtimeBusy === false && stable.fontsStatus === 'loaded' && stable.renderOutcomeOk === true && stable.activeRootMatches === true &&
      Number.isInteger(stable.attemptCount) && stable.attemptCount > 0, 'POST_PRINT_STABLE_STATE_MISSING');
    if (row.envelope?.present) requireThat(stable.envelope?.present === true && stable.envelope.mode === row.mode &&
      stable.envelope.renderedIdentityMatches === true && stable.envelope.verifiedIdentityMatches === true &&
      stable.envelope.urlIdentityMatches === true && stable.envelope.errorPresent === false, 'POST_PRINT_ENVELOPE_NOT_READY');
  }
  requireThat(same(before.pdf.mediaBoxes, after.pdf.mediaBoxes) &&
    same(before.pdf.raster.pages, after.pdf.raster.pages) && before.pdf.raster.textSha256 === after.pdf.raster.textSha256 &&
    before.pdf.raster.textBytes === after.pdf.raster.textBytes, 'PDF_PIXEL_OR_TEXT_CHANGED');
}
function assertSources(report, expectedFixtures) {
  exactSet(report.fixtures?.map(item => item.id), expectedFixtures.map(item => item.id), 'FIXTURE_COVERAGE_CHANGED');
  for (const expected of expectedFixtures) {
    const actual = report.fixtures.find(item => item.id === expected.id);
    for (const field of ['kind', 'qpp', 'questions', 'inputSha256', 'sources'])
      requireThat(same(actual[field], expected[field]), 'PINNED_FIXTURE_CHANGED', { fixture: expected.id, field });
  }
}
function assertNetworkTransfer(row) {
  const transfer = row.metadataTransfer;
  requireThat(transfer && Array.isArray(transfer.requests), 'NETWORK_TRANSFER_EVIDENCE_MISSING');
  if (row.label === 'baseline') requireThat(transfer.state === 'COMPLETE' && transfer.requests.length > 0 &&
    transfer.requests.every(item => item.finished === true && item.failed !== true && item.httpStatus === 200 && item.decodedDataBytes > 0),
  'BASELINE_METADATA_TRANSFER_INCOMPLETE');
  else requireThat(transfer.state === 'NOT_REQUESTED' && transfer.requests.length === 0 && transfer.loaderMode === 'frozen-source' &&
    transfer.notRequestedUnderFrozenSourcePolicy === true && transfer.renderCompletedWithoutMetadataRequest === true,
  'FROZEN_METADATA_POLICY_NOT_OBSERVED');
}
function assertAttestation(comparison, row, spec) {
  requireThat(comparison.pass === true && comparison.questions === spec.questions && comparison.pages === row.pageCount &&
    comparison.bodyHash === row.bodyHash && comparison.sourceOrderHash === digest(row.sourceOrder.join('\n')) &&
    comparison.coordinateTolerancePx === 1, 'PARITY_ATTESTATION_INCOMPLETE');
}
function validateRepairedNetwork(report, output, artifacts) {
  // Only the pinned baseline's pre-geometry image deadline may be repaired.
  // The candidate must finish every operation. Missing baseline observations
  // remain missing; output parity is checked against complete normal baselines.
  const role = 'network:envelope50-qpp1', spec = fixtureById['envelope50-qpp1'], plan = expectedPlan(role);
  const blockedOps = ['exam-sol-warm', 'same-sol'], code = 'QUESTION_IMAGE_READINESS_INCOMPLETE';
  const rows = [...report.rows, ...report.pdfRows], comparisons = [...report.comparisons, ...report.pdfComparisons, ...report.networkComparisons];
  const expectedRows = plan.measurements.flatMap(item => item.labels.filter(label =>
    label !== 'baseline' || !blockedOps.includes(item.operation)).map(label => ({ ...item, label })));
  exactSet(rows.map(row => key(row, true)), expectedRows.map(row => key(row, true)), 'REPAIRED_NETWORK_ROW_COVERAGE_INCOMPLETE');
  exactSet(comparisons.map(key), plan.measurements.map(key), 'REPAIRED_NETWORK_COMPARISONS_INCOMPLETE');
  const missing = plan.measurements.filter(item => blockedOps.includes(item.operation)).map(item => ({ ...item, label: 'baseline' }));
  const coverage = report.coverage;
  requireThat(coverage.plannedRows === 10 && coverage.plannedPairs === 5 && coverage.observedRows === 8 && coverage.observedPairs === 5 &&
    coverage.complete === false && coverage.duplicateRows?.length === 0 && coverage.duplicatePairs?.length === 0 &&
    coverage.missingPairs?.length === 0, 'REPAIRED_NETWORK_COVERAGE_ACCOUNTING_CHANGED');
  exactSet(coverage.missingRows?.map(item => key(item, true)), missing.map(item => key(item, true)), 'REPAIRED_NETWORK_MISSING_ROWS_CHANGED');
  requireThat(coverage.missingRows.every(item => item.status === 'BLOCKED_OR_FAILED_BEFORE_CAPTURE' &&
    item.precedingFailure?.operation === 'ans-exam' && item.precedingFailure.code === 'EXPECTED_RENDER_READY'), 'REPAIRED_NETWORK_BLOCKED_CAUSE_CHANGED');
  const expectedFailure = { ...plan.measurements.find(item => item.operation === 'ans-exam'), label: 'baseline' };
  exactSet(report.failures?.map(item => key(item, true)), [key(expectedFailure, true)], 'REPAIRED_NETWORK_UNEXPECTED_FAILURE');
  requireThat(report.failures[0].error?.code === 'EXPECTED_RENDER_READY' && report.failures[0].error.details?.code === code &&
    report.pass === false && report.outputParity === 'FAIL' && report.networkParity === 'FAIL' && !report.fatal,
  'REPAIRED_NETWORK_RAW_FAILURE_CHANGED');
  const cycleKey = item => [item.purpose, item.fixture, item.repeat, item.network, item.label, item.qpp, item.operations.join(',')].join('|');
  exactSet(report.cycles?.map(cycleKey), plan.cycles.map(cycleKey), 'REPAIRED_NETWORK_CYCLE_COVERAGE_CHANGED');
  for (const cycle of report.cycles) requireThat(cycle.label === 'baseline' ?
    cycle.pass === false && cycle.completed === 2 && cycle.failedOperation === 'ans-exam' &&
      cycle.error?.code === 'EXPECTED_RENDER_READY' && cycle.error.details?.code === code :
    cycle.pass === true && cycle.completed === 5 && !cycle.error && !cycle.failedOperation, 'REPAIRED_NETWORK_CYCLE_FAILURE_CHANGED');
  const findRow = (label, operation) => rows.find(row => row.label === label && row.operation === operation);
  const failed = findRow('baseline', 'ans-exam'), previous = findRow('baseline', 'sol-ans');
  for (const row of rows.filter(row => row !== failed)) {
    const requested = plan.measurements.find(item => item.operation === row.operation);
    requireThat(row.mode === requested.mode && row.imageBuildFailures?.length === 0, 'REPAIRED_NETWORK_CANDIDATE_OR_READY_BASELINE_FAILED');
    assertReady(row, spec); assertNetworkTransfer(row);
  }
  for (const item of plan.measurements) {
    const comparison = comparisons.find(row => key(row) === key(item));
    requireThat(comparison.qpp === 1, 'COMPARISON_OPTIONS_CHANGED');
    if (['cold-sol', 'sol-ans'].includes(item.operation)) {
      assertParity(findRow('baseline', item.operation), findRow('current', item.operation));
      assertAttestation(comparison, findRow('current', item.operation), spec);
    } else requireThat(comparison.pass === false && comparison.error?.code === 'PARITY_INPUT_NOT_READY' &&
      comparison.error.details?.baselinePass === false && comparison.error.details.currentPass === true,
    'REPAIRED_NETWORK_FALSE_PAIRED_PASS');
  }
  requireThat(failed.pass === false && failed.outcome?.ok === false && failed.outcome.code === code &&
    failed.error?.code === 'EXPECTED_RENDER_READY' && failed.error.details?.code === code &&
    failed.qpp === 1 && failed.questionCount === 50 && failed.inputHash === KNOWN.projectedInputHash &&
    digest(JSON.stringify(failed.expectedOrder)) === KNOWN.sourceOrderSha256 && digest(JSON.stringify(failed.inputUids)) === KNOWN.inputUidsSha256 &&
    failed.operationMath?.calls === 0 && failed.operationMath.totalMs === 0 && failed.pageErrors?.length === 0 &&
    failed.attempts?.length === previous.attempts.length + 1 && same(failed.attempts.slice(0, -1), previous.attempts) &&
    failed.attempts.at(-1).state === 'FAILED' && failed.attempts.at(-1).committed === false && failed.attempts.at(-1).code === code &&
    failed.adapters?.filter(item => item.method === 'build').length === 1 &&
    !failed.adapters.some(item => ['validate', 'freezeSnapshot', 'capture', 'attach', 'commit', 'finalize', 'visible'].includes(item.method)),
  'REPAIRED_BASELINE_FAILURE_STAGE_CHANGED');
  assertNetworkTransfer(failed); assertParity(previous, failed);
  requireThat(failed.mode === 'ans' && failed.snapshotMode === 'ans' && failed.committedMode === 'ans' && failed.snapshotId === previous.snapshotId &&
    failed.envelope?.mode === 'ans' && failed.envelope.renderedIdentityMatches === true && failed.envelope.verifiedIdentityMatches === true &&
    failed.envelope.urlIdentityMatches === true && failed.envelope.errorPresent === false, 'REPAIRED_BASELINE_OLD_ANSWER_NOT_PRESERVED');
  requireThat(output.coverage.performance && output.coverage.pdf && artifacts.performance && artifacts.pdf,
    'REPAIRED_NETWORK_NORMAL_BASELINE_UNQUALIFIED');
  const normalReferences = operation => artifacts.performance.rows.filter(row => row.fixture === spec.id && row.label === 'baseline' &&
    row.network === 'normal' && row.purpose === 'performance' && row.operation === operation);
  const normalExam = normalReferences('cold-exam');
  exactSet(normalExam.map(row => row.repeat), [1, 2, 3], 'REPAIRED_NETWORK_NORMAL_EXAM_REFERENCES_MISSING');
  normalExam.forEach(row => assertReady(row, spec));
  requireThat(failed.imageBuildFailures?.length === 1, 'REPAIRED_BASELINE_IMAGE_DIAGNOSTIC_MISSING');
  const diagnostic = failed.imageBuildFailures[0], results = diagnostic.results;
  requireThat(diagnostic.operation === 2 && diagnostic.attemptedMode === 'exam' && diagnostic.qpp === 1 && diagnostic.code === code &&
    diagnostic.wait?.method === 'waitForImages' && diagnostic.wait.timeoutMs === 1200 && finite(diagnostic.wait.elapsedMs) &&
    diagnostic.wait.elapsedMs >= 1190 && finite(diagnostic.buildElapsedMs) && diagnostic.buildElapsedMs >= diagnostic.wait.elapsedMs - 1 &&
    !diagnostic.diagnosticCaptureFailed && Array.isArray(results) && results.length > 0, 'REPAIRED_BASELINE_DEADLINE_NOT_OBSERVED');
  const timedOut = results.filter(item => item.status === 'timeout');
  requireThat(timedOut.length > 0 && results.every((item, index) => item.index === index && ['loaded', 'timeout'].includes(item.status)) &&
    diagnostic.firstUnreadyIndex === results.findIndex(item => item.status !== 'loaded') &&
    diagnostic.summary?.images === results.length && diagnostic.summary.loaded === results.length - timedOut.length &&
    diagnostic.summary.errors === 0 && diagnostic.summary.timeouts === timedOut.length, 'REPAIRED_BASELINE_IMAGE_STATUS_CHANGED');
  const boundImages = timedOut.map(item => {
    requireThat(item.reason === 'LOAD_TIMEOUT' && item.completeAtFailure === false &&
      item.inStagingHost === true && item.inTargetArea === false && typeof item.sourceRef === 'string' && isHash(item.imageUrlSha256),
    'REPAIRED_BASELINE_IMAGE_NOT_PENDING');
    // Chrome may expose dimensions from an image header before the complete
    // resource has loaded. H.capture records naturalWidth/naturalHeight, so a
    // positive partial-header observation must exactly match that same ready
    // image's intrinsic dimensions in every normal baseline repetition.
    const unknownDimensions = item.naturalWidth === 0 && item.naturalHeight === 0;
    requireThat(Number.isInteger(item.naturalWidth) && Number.isInteger(item.naturalHeight) &&
      (unknownDimensions || item.naturalWidth > 0 && item.naturalHeight > 0), 'REPAIRED_BASELINE_IMAGE_DIMENSIONS_INVALID');
    let pageNumber;
    for (const reference of normalExam) {
      const pages = reference.pages.map((page, index) => ({ page, index })).filter(({ page }) => page.blocks.some(block => block.sourceRef === item.sourceRef));
      requireThat(pages.length === 1, 'REPAIRED_BASELINE_IMAGE_NOT_IN_PINNED_PAGE');
      const matchingImages = pages[0].page.images.filter(image => image.sourceHash === item.imageUrlSha256 && image.loaded === true &&
        image.width > 0 && image.height > 0);
      requireThat(matchingImages.length > 0, 'REPAIRED_BASELINE_IMAGE_NOT_IN_PINNED_PAGE');
      requireThat(unknownDimensions || matchingImages.every(image => image.width === item.naturalWidth && image.height === item.naturalHeight),
        'REPAIRED_BASELINE_IMAGE_DIMENSIONS_MISMATCH');
      pageNumber = pages[0].index + 1;
    }
    return { index: item.index, sourceRef: item.sourceRef, imageUrlSha256: item.imageUrlSha256, baselinePage: pageNumber,
      intrinsicDimensionsAtTimeout: { width: item.naturalWidth, height: item.naturalHeight }, intrinsicDimensionsKnown: !unknownDimensions };
  });
  const crossContext = [];
  for (const [operation, normalOperation] of [['ans-exam', 'cold-exam'], ['exam-sol-warm', 'exam-sol'], ['same-sol', 'exam-sol-warm']]) {
    const current = findRow('current', operation), references = normalReferences(normalOperation);
    exactSet(references.map(row => row.repeat), [1, 2, 3], 'REPAIRED_NETWORK_NORMAL_REFERENCES_MISSING');
    for (const reference of references) { assertReady(reference, spec); assertParity(reference, current); }
    const pdf = artifacts.pdf.pdfRows.filter(row => row.fixture === spec.id && row.label === 'baseline' && row.operation === 'pdf-' + current.mode);
    requireThat(pdf.length === 1, 'REPAIRED_NETWORK_PDF_REFERENCE_MISSING');
    assertReady(pdf[0], spec); assertParity(pdf[0], current);
    crossContext.push({ operation, baselineOperation: normalOperation, baselineRepeats: references.map(row => row.repeat),
      pdfBaselineOperation: pdf[0].operation, bodyHash: current.bodyHash, pageCount: current.pageCount });
  }
  output.repairs[role] = { classification: 'REPAIRED_BASELINE_IMAGE_READINESS', baselineQualityPass: false,
    baselineSha: BASELINE, fixture: spec.id, inputSha256: spec.inputSha256, baselineFailedOperation: 'ans-exam',
    baselineBlockedOperations: blockedOps, failureCode: code, observedWait: diagnostic.wait, timedOutImages: boundImages,
    baselineOldAnswerPreserved: true, candidateReadyOperations: 5, directTimingAndOutputPairs: 2, crossContextOutputComparisons: crossContext,
    limitation: 'No successful baseline network timing exists for the final three operations; their candidate output is checked against all three normal baseline repetitions and the qualified PDF baseline.' };
  output.coverage[role] = { plannedPairs: 5, observedPairs: 5, normalQualifiedPairs: 2, crossContextQualifiedOperations: 3,
    rawFailedComparisons: 3, baselineFailedOperations: ['ans-exam'], baselineBlockedOperations: blockedOps,
    candidateReadyOperations: 5, rawCoverageComplete: false };
}
function validateReport(report, role, output, artifacts) {
  const plan = expectedPlan(role), purpose = role.startsWith('network:') ? 'network' : role;
  const phase = purpose === 'network' ? 'network-completion' : purpose;
  requireThat(report.schema === 'ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1' && report.phase === phase && report.profileOnly === false &&
    report.baselineSha === BASELINE && report.repeats === (purpose === 'performance' ? 3 : 1), 'REPORT_ROLE_OR_BASELINE_CHANGED');
  const specs = purpose === 'network' ? [fixtureById[role.split(':')[1]]] : fixtureSpecs;
  assertSources(report, specs);
  const condition = report.conditions;
  requireThat(same(condition?.viewport, { width: 1440, height: 1000 }) && condition.cpuThrottleRate === 1 &&
    condition.coordinateTolerancePx === 1 && condition.networkCachePolicy === 'no-store' &&
    condition.networkTransport === (purpose === 'network' ? 'identity/no-store stress' : 'identity/no-store unthrottled') &&
    same(condition.slowNetwork, { latencyMs: 100, downloadBytesPerSecond: 187500, uploadBytesPerSecond: 93750 }),
  'BENCHMARK_CONDITIONS_CHANGED');
  requireThat(report.coverage?.schema === 'ARCHIVE_OUTPUT_PERFORMANCE_COVERAGE_V1' && report.coverage.phase === phase &&
    report.coverage.networkTransport === condition.networkTransport, 'COVERAGE_MANIFEST_MISSING');
  exactSet(report.coverage.measurements?.map(item => JSON.stringify(item)), plan.measurements.map(item => JSON.stringify(item)), 'PLANNED_COVERAGE_CHANGED');
  if (role === 'network:envelope50-qpp1' && report.rows.some(row => row.label === 'baseline' && row.operation === 'ans-exam' && row.pass === false))
    return validateRepairedNetwork(report, output, artifacts);
  const rows = [...report.rows, ...report.pdfRows];
  const comparisons = [...report.comparisons, ...report.pdfComparisons, ...report.networkComparisons];
  const blocked = plan.measurements.filter(isBlocked), observed = plan.measurements.filter(item => !isBlocked(item));
  const expectedRowKeys = observed.flatMap(item => item.labels.map(label => key({ ...item, label }, true)));
  exactSet(rows.map(row => key(row, true)), expectedRowKeys, 'MISSING_OR_UNEXPECTED_ROW');
  exactSet(comparisons.map(key), observed.map(key), 'MISSING_OR_UNEXPECTED_COMPARISON');
  const coverage = report.coverage;
  requireThat(coverage.plannedRows === plan.measurements.length * 2 && coverage.plannedPairs === plan.measurements.length &&
    coverage.observedRows === rows.length && coverage.observedPairs === comparisons.length &&
    coverage.complete === (blocked.length === 0) && coverage.duplicateRows?.length === 0 && coverage.duplicatePairs?.length === 0,
  'COVERAGE_ACCOUNTING_CHANGED');
  exactSet(coverage.missingRows?.map(item => key(item, true)), blocked.flatMap(item => item.labels.map(label => key({ ...item, label }, true))), 'UNCLASSIFIED_MISSING_ROW');
  exactSet(coverage.missingPairs?.map(key), blocked.map(key), 'UNCLASSIFIED_MISSING_PAIR');
  requireThat(coverage.missingRows.every(item => item.status === 'BLOCKED_OR_FAILED_BEFORE_CAPTURE' &&
    item.precedingFailure?.operation === 'exam-sol' && item.precedingFailure.code === 'EXPECTED_RENDER_READY'), 'BLOCKED_CAUSE_CHANGED');
  const cycleKey = item => [item.purpose, item.fixture, item.repeat, item.network, item.label, item.qpp, item.operations.join(',')].join('|');
  exactSet(report.cycles?.map(cycleKey), plan.cycles.map(cycleKey), 'CYCLE_COVERAGE_CHANGED');
  for (const cycle of report.cycles) {
    const failOp = cycle.operations.find(operation => isKnownFailure({ ...cycle, operation }));
    requireThat(failOp ? cycle.pass === false && cycle.failedOperation === failOp && cycle.completed === cycle.operations.indexOf(failOp) &&
      cycle.error?.code === 'EXPECTED_RENDER_READY' && cycle.error.details?.code === 'PDF_CONTENT_CLIPPED' :
      cycle.pass === true && cycle.completed === cycle.operations.length && !cycle.error && !cycle.failedOperation,
    'UNCLASSIFIED_CYCLE_FAILURE');
  }
  const failures = rows.filter(isKnownFailure);
  exactSet(report.failures?.map(item => key(item, true)), failures.map(item => key(item, true)), 'UNCLASSIFIED_REPORT_FAILURE');
  requireThat(report.failures.every(item => item.error?.code === 'EXPECTED_RENDER_READY' && item.error.details?.code === 'PDF_CONTENT_CLIPPED'),
    'UNEXPECTED_FAILURE_CAUSE');
  requireThat(report.pass === (failures.length === 0) && report.outputParity === (failures.length ? 'FAIL' : 'PASS') &&
    report[purpose + 'Parity'] === (failures.length ? 'FAIL' : 'PASS') && !report.fatal, 'RAW_RESULT_REWRITTEN_OR_INCOMPLETE');
  const rowMap = new Map(rows.map(row => [key(row, true), row]));
  for (const expected of observed) {
    const pair = expected.labels.map(label => rowMap.get(key({ ...expected, label }, true)));
    const comparison = comparisons.find(item => key(item) === key(expected));
    requireThat(comparison.qpp === expected.qpp, 'COMPARISON_OPTIONS_CHANGED');
    if (isKnownFailure(expected)) {
      requireThat(comparison.pass === false && comparison.error?.code === 'PARITY_INPUT_NOT_READY', 'KNOWN_FAILURE_FALSELY_PASSED');
      for (const row of pair) requireThat(row.pass === false && row.outcome?.ok === false && row.outcome.code === 'PDF_CONTENT_CLIPPED' &&
        row.outcome.error?.count === 1 && row.error?.code === 'EXPECTED_RENDER_READY' && row.error.details?.code === 'PDF_CONTENT_CLIPPED' &&
        row.qpp === 4 && row.questionCount === 50 && row.inputHash === KNOWN.projectedInputHash && !row.pdf?.generated,
      'KNOWN_FAILURE_CAUSE_CHANGED');
      requireThat(same(pair[0].expectedOrder, pair[1].expectedOrder) && same(pair[0].inputUids, pair[1].inputUids), 'FAILED_INPUT_IDENTITY_CHANGED');
      requireThat(digest(JSON.stringify(pair[0].expectedOrder)) === KNOWN.sourceOrderSha256 &&
        digest(JSON.stringify(pair[0].inputUids)) === KNOWN.inputUidsSha256, 'REAL50_SOURCE_IDENTITY_CHANGED');
      const current = pair[1];
      requireThat(current.attempts?.at(-1)?.state === 'FAILED' && current.attempts.at(-1).committed === false, 'FAILED_ATTEMPT_COMMITTED');
      if (expected.operation !== 'cold-sol') {
        assertClipping(pair[0]);
        const before = rowMap.get(key({ ...expected, operation: purpose === 'pdf' ? 'pdf-exam' : 'cold-exam', label: 'current' }, true));
        assertParity(before, current);
        const previousSnapshotId = purpose === 'pdf' ? before.pdf?.afterPrintState?.snapshotId : before.snapshotId;
        requireThat(previousSnapshotId && current.mode === 'exam' && current.snapshotId === previousSnapshotId && current.snapshotMode === 'exam' &&
          current.committedMode === 'exam' && current.envelope.renderedIdentityMatches === true && current.envelope.urlIdentityMatches === true,
        'KNOWN_FAILURE_DID_NOT_RESTORE_HEALTHY_VIEW');
      } else requireThat(current.pageCount === 0 && current.envelope?.errorPresent === true, 'COLD_FAILED_OUTPUT_FALSELY_READY');
      continue;
    }
    const spec = fixtureById[expected.fixture], knownLegacy = isKnownLegacy(expected);
    for (const row of pair) {
      requireThat(row.mode === expected.mode, 'REQUESTED_MODE_NOT_RENDERED');
      assertReady(row, spec, { allowKnownClip: knownLegacy });
    }
    assertParity(...pair);
    assertAttestation(comparison, pair[1], spec);
    if (purpose === 'pdf') assertPdf(...pair);
    if (purpose === 'network') pair.forEach(assertNetworkTransfer);
  }
  output.coverage[role] = { plannedPairs: plan.measurements.length, observedPairs: comparisons.length,
    normalQualifiedPairs: observed.filter(item => !isKnownFailure(item) && !isKnownLegacy(item)).length,
    knownFailurePairs: observed.filter(isKnownFailure).length, unchangedClippedLegacyPairs: observed.filter(isKnownLegacy).length,
    blockedByKnownFailure: blocked.map(item => ({ fixture: item.fixture, repeat: item.repeat, operation: item.operation })),
    rawCoverageComplete: coverage.complete };
}

function validateCache(report) {
  requireThat(report.schema === 'ARCHIVE_OUTPUT_CACHE_CHROME_V1' && report.pass === true && !report.fatal &&
    report.fixture?.questions === 8 && report.fixture.inputSha256 === fixtureById.envelope8.inputSha256, 'CACHE_REPORT_NOT_QUALIFIED');
  exactSet(report.cases?.map(item => item.name), cacheCases, 'CACHE_CASE_COVERAGE_CHANGED');
  requireThat(report.cases.every(item => item.pass === true && !item.error), 'CACHE_CASE_FAILED');
  const cases = Object.fromEntries(report.cases.map(item => [item.name, item]));
  const booleans = {
    'strict-cache-reuse-and-print': ['initialMiss', 'sameModeNoBuild', 'corruptedSnapshotRebuilt'],
    'editor-source-and-option-invalidation': ['sameUidContentInvalidated', 'qppInvalidated', 'headerInvalidated', 'qrInvalidated', 'changedOptionsReused'],
    'typeset-failure-and-retry': ['failedRequestPreservedVisibleDocument', 'inputPreserved', 'retry'],
    'actual-layout-failure-and-rollback': ['realClippingRejected', 'previousDocumentAndBindingPreserved', 'retry'],
    'latest-public-request-wins': ['oldDocumentPreservedWhilePending'],
    'final-readiness-failure-and-retry': ['failureVisible', 'previousDocumentAndBindingPreserved', 'targetModeRetry']
  };
  for (const [name, fields] of Object.entries(booleans)) requireThat(fields.every(field => cases[name][field] === true), 'CACHE_GUARD_EVIDENCE_MISSING', { name });
  exactSet(cases[cacheCases[0]].modeHits, ['exam', 'sol', 'ans'], 'CACHE_MODE_HITS_INCOMPLETE');
  const printProbe = (probe, ready) => requireThat(probe?.printCalls === (ready ? 1 : 0) && probe.newAttempts === 0 &&
    (ready ? probe.alerts === 0 && probe.event?.readyOutcome?.ok === true : probe.alerts > 0 && probe.event === null) &&
    isHash(probe.visibleParity?.bodyHash), 'PRINT_GUARD_NOT_PROVEN');
  printProbe(cases[cacheCases[0]].print, true);
  for (const name of [cacheCases[2], cacheCases[5]]) {
    printProbe(cases[name].blocked, false); printProbe(cases[name].printed, true);
  }
  for (const name of [cacheCases[4], cacheCases[6]]) requireThat(cases[name].first?.ok === false &&
    cases[name].first.code === 'DISCARDED_STALE' && cases[name].latest?.ok === true, 'LATEST_REQUEST_GUARD_FAILED');
  const abort = cases[cacheCases[6]];
  requireThat(abort.maxLatestReadyMs === 3000 && finite(abort.latestReadyMs) && abort.latestReadyMs < 3000 &&
    abort.heldDecodeStillPendingAtLatestReady === true && abort.noOverwriteAfterNativeDecodeSettled === true &&
    abort.previousDocumentRetainedWhilePending?.unchanged === true && abort.previousDocumentRetainedWhilePending.retainedBySnapshot === true &&
    abort.previousDocumentRetainedWhilePending.decodeReleased === false &&
    ['oldRootRestored', 'oldSnapshotRestored', 'oldEnvelopeRestored', 'oldUrlRestored'].every(field => abort.previousViewRestoredBeforeLatestCommit?.[field] === true),
  'PENDING_DECODE_CANCELLATION_NOT_PROVEN');
  const guard = cases[cacheCases[7]], issue = report.knownIssue;
  requireThat(issue?.id === KNOWN.id && issue.status === 'UNRESOLVED' && issue.qualityPass === false && issue.guardPass === true &&
    issue.inputSha256 === KNOWN.inputSha256 && issue.sourceFile === KNOWN.sourceFile && issue.sourceSha256 === KNOWN.sourceSha256 &&
    issue.sourceUid === KNOWN.sourceUid && issue.questionCount === 50 && issue.qpp === 4 && issue.expectedFailureCode === 'PDF_CONTENT_CLIPPED' &&
    same(guard.knownIssue, issue) && guard.failedOperationQualityPass === false && guard.subsequentAnswerReady === true &&
    guard.subsequentExamReady === true && guard.noLateOverwrite === true, 'KNOWN_ISSUE_GUARD_NOT_BOUND');
  requireThat(issue.observedCauses?.length === 2 && guard.failures?.length === 2 && guard.blockedPrints?.length === 2, 'KNOWN_ISSUE_RETRY_NOT_OBSERVED');
  issue.observedCauses.forEach(call => {
    requireThat(call.attemptedMode === 'sol' && call.qpp === 4 && call.candidatePageCount === 23 && call.causes?.length === 1, 'KNOWN_CANDIDATE_GEOMETRY_CHANGED');
    const cause = call.causes[0];
    assertCause({ ...cause, x: cause.imageX, y: cause.imageY, width: cause.imageWidth, height: cause.imageHeight },
      { page: cause.page, classes: cause.columnClasses, clientWidth: cause.columnClientWidth, scrollWidth: cause.columnScrollWidth,
        clientHeight: cause.columnClientHeight, scrollHeight: cause.columnScrollHeight, overflowX: cause.columnOverflowX });
  });
  guard.failures.forEach((item, index) => requireThat(item.attempt === index + 1 && item.code === 'PDF_CONTENT_CLIPPED' && item.committed === false &&
    item.previousSnapshotPreserved === true && item.inputPreserved === true && item.failedRequestSealedReady === false, 'KNOWN_FAILURE_PRESERVATION_NOT_PROVEN'));
  guard.blockedPrints.forEach(probe => printProbe(probe, false));
  requireThat(Array.isArray(report.rows) && report.rows.length === 62 && new Set(report.rows.map(row => row.name)).size === 62,
    'CACHE_ROW_COVERAGE_INCOMPLETE');
  const failedNames = {
    'typeset-failure-preserves-exam': 'QA_TYPESET_FAILURE', 'failed-typeset-print-blocked': 'QA_TYPESET_FAILURE',
    'actual-clipping-rolls-back-commit': 'PDF_CONTENT_CLIPPED', 'pending-solution-keeps-exam': 'QA_PENDING',
    'final-pdf-readiness-failure': 'QA_FINAL_PDF_FAILURE', 'final-pdf-failure-print-blocked': 'QA_FINAL_PDF_FAILURE',
    'full-finalizer-decode-pending': 'QA_DECODE_PENDING', 'real50-qpp4-clipping-attempt-1': 'PDF_CONTENT_CLIPPED',
    'real50-qpp4-clipping-attempt-2': 'PDF_CONTENT_CLIPPED', 'real50-qpp4-failed-print-1': 'PDF_CONTENT_CLIPPED',
    'real50-qpp4-failed-print-2': 'PDF_CONTENT_CLIPPED', 'exam-staging-decode-pending': 'QA_EXAM_IMAGE_PENDING'
  };
  exactSet(report.rows.filter(row => row.pass === false).map(row => row.name), Object.keys(failedNames), 'UNCLASSIFIED_CACHE_FAILURE');
  for (const row of report.rows) requireThat(failedNames[row.name] ? row.outcome?.ok === false && row.outcome.code === failedNames[row.name] :
    row.pass === true && row.outcome?.ok === true && row.clippingCount === 0 && row.pageOverflowCount === 0, 'CACHE_ROW_STATE_CHANGED');
  const qrCase = cases[cacheCases[8]], qrRows = new Map(report.rows.filter(row => qrRowNames.includes(row.name)).map(row => [row.name, row]));
  exactSet([...qrRows.keys()], qrRowNames, 'QR_CASE_ROW_COVERAGE_INCOMPLETE');
  requireThat(['examRequestTokenChanged', 'examCanvasPixelsChanged', 'examCacheMiss', 'examNewRoot', 'examBuildObserved',
    'sourceAndGeometryParity', 'freshEnvelopeBinding', 'solutionCacheHit', 'answerCacheHit'].every(field => qrCase[field] === true) &&
    qrCase.examProofs?.length === 3 && qrCase.parity?.length === 2 && qrCase.modeHits?.length === 2, 'QR_GUARD_EVIDENCE_MISSING');
  exactSet(qrCase.examProofs.map(proof => proof.rowName), [qrRowNames[0], qrRowNames[2], qrRowNames[4]], 'QR_EXAM_PROOFS_INCOMPLETE');
  requireThat(new Set(qrCase.examProofs.map(proof => proof.outputRequestId)).size === 3 &&
    new Set(qrCase.examProofs.map(proof => proof.snapshotId)).size === 3 &&
    new Set(qrCase.examProofs.map(proof => proof.qr?.pixelSha256)).size === 3, 'QR_REQUEST_OR_PIXELS_STALE');
  for (const row of qrRows.values()) {
    assertReady(row, fixtureById.envelope8, { extended: false });
    const binding = row.binding;
    requireThat(binding?.envelopePresent === true && binding.renderOutcomeOk === true && binding.renderErrorPresent === false &&
      binding.verifiedIdentityMatches === true && binding.renderedIdentityMatches === true &&
      binding.outputRequestId === binding.urlRequestId && binding.mode === row.mode && binding.snapshotMode === row.mode &&
      binding.candidateMode === row.mode && binding.urlMode === row.mode, 'QR_ROW_BINDING_NOT_READY');
  }
  const initialExam = qrRows.get(qrRowNames[0]), initialQr = qrCase.examProofs[0].qr;
  qrCase.examProofs.forEach((proof, index) => {
    const row = qrRows.get(proof.rowName), qr = proof.qr;
    requireThat(row.mode === 'exam' && proof.outputRequestId === row.binding.outputRequestId && typeof proof.outputRequestId === 'string' &&
      proof.outputRequestId.length > 0 && proof.snapshotId === row.snapshotId && proof.cacheStatus === 'MISS' && row.cacheStatus === 'MISS' &&
      Number.isInteger(proof.buildCalls) && proof.buildCalls > 0 && row.adapters.filter(item => item.method === 'build').length === proof.buildCalls &&
      (index === 0 ? proof.newRoot === null && proof.newCanvas === null : proof.newRoot === true && proof.newCanvas === true), 'QR_EXAM_WAS_NOT_REBUILT');
    requireThat(qr?.requestId === proof.outputRequestId && qr.currentIdentityMatches === true && qr.targetMode === 'sol' && qr.qrFlag === '1' &&
      isHash(qr.sourceKeyHash) && qr.sourceKeyHash === initialQr.sourceKeyHash && isHash(qr.pixelSha256) && qr.pixelSha256 === qr.expectedPixelSha256 &&
      Number.isInteger(qr.width) && qr.width > 0 && qr.width === qr.height && qr.opaquePixels === qr.width * qr.height &&
      qr.blackPixels > 0 && qr.whitePixels > 0 && qr.blackPixels + qr.whitePixels <= qr.opaquePixels && qr.unclipped === true &&
      ['width', 'height', 'page', 'x', 'y', 'displayWidth', 'displayHeight'].every(field => finite(qr[field]) &&
        Math.abs(qr[field] - initialQr[field]) <= 1), 'QR_PIXELS_OR_IDENTITY_NOT_VERIFIED');
    if (index > 0) {
      assertParity(initialExam, row);
      const parity = qrCase.parity[index - 1];
      requireThat(parity.baseline === initialExam.name && parity.current === row.name && parity.bodyHash === row.bodyHash &&
        parity.pages === row.pageCount && parity.coordinateTolerancePx === 1, 'QR_SOURCE_PARITY_NOT_PROVEN');
    }
  });
  printProbe(qrCase.print, true);
  requireThat(qrCase.print.qrPixelSha256 === qrCase.examProofs[2].qr.pixelSha256, 'QR_PRINT_PIXELS_CHANGED');
  exactSet(qrCase.modeHits.map(proof => proof.mode), ['sol', 'ans'], 'QR_OTHER_MODE_HITS_INCOMPLETE');
  for (const hit of qrCase.modeHits) {
    const row = qrRows.get(hit.rowName), previous = qrRows.get(hit.mode === 'sol' ? qrRowNames[1] : qrRowNames[3]);
    requireThat(row && hit.rowName === (hit.mode === 'sol' ? qrRowNames[6] : qrRowNames[7]) && row.mode === hit.mode &&
      hit.cacheStatus === 'HIT' && row.cacheStatus === 'HIT' && hit.mathCalls === 0 && hit.buildCalls === 0 &&
      row.operationMath.calls === 0 && row.adapters.filter(item => item.method === 'build').length === 0 &&
      hit.outputRequestId === row.binding.outputRequestId && hit.snapshotId === row.snapshotId && row.snapshotId === previous.snapshotId &&
      row.binding.qr?.canvases === 0, 'QR_SAFE_MODE_CACHE_NOT_REUSED');
    assertParity(previous, row);
  }
  const imageCase = cases[cacheCases[9]], imageRowNames = ['pending-exam-image-cancellation-initial', 'exam-staging-decode-pending',
    'latest-answer-cancels-exam-image', 'released-exam-image-cannot-overwrite-answer', 'exam-image-cancellation-safe-print'];
  const imageRows = new Map(report.rows.filter(row => imageRowNames.includes(row.name)).map(row => [row.name, row]));
  exactSet([...imageRows.keys()], imageRowNames, 'EXAM_IMAGE_CANCELLATION_ROWS_MISSING');
  const [beforeImage, pendingImage, latestImage, settledImage, printedImage] = imageRowNames.map(name => imageRows.get(name));
  const pendingProof = imageCase.pendingEvidence, latestProof = imageCase.latestEvidence, settledProof = imageCase.settledEvidence;
  requireThat(['heldDecodeStillPendingAtLatestReady', 'oldDocumentPreservedWhilePending', 'inputAndBindingPreservedWhilePending',
    'noGeometryBeforeImages', 'restoredAnswerSnapshotHit', 'noOverwriteAfterNativeDecodeSettled'].every(field => imageCase[field] === true) &&
    imageCase.first?.ok === false && imageCase.first.code === 'DISCARDED_STALE' && imageCase.latest?.ok === true &&
    imageCase.maxLatestReadyMs === 3000 && finite(imageCase.latestReadyMs) && imageCase.latestReadyMs < 3000,
  'EXAM_IMAGE_CANCELLATION_NOT_PROVEN');
  for (const row of [beforeImage, latestImage, settledImage, printedImage]) {
    assertReady(row, { ...fixtureById.envelope8, qpp: 1 }, { extended: false });
    requireThat(row.mode === 'ans' && row.binding?.envelopePresent === true && row.binding.renderOutcomeOk === true &&
      row.binding.renderErrorPresent === false && row.binding.verifiedIdentityMatches === true && row.binding.renderedIdentityMatches === true &&
      row.binding.outputRequestId === row.binding.urlRequestId && row.binding.mode === 'ans' && row.binding.snapshotMode === 'ans' &&
      row.binding.candidateMode === 'ans' && row.binding.urlMode === 'ans', 'EXAM_IMAGE_LATEST_BINDING_NOT_READY');
  }
  for (const field of ['mode', 'qpp', 'snapshotId', 'sessionId', 'snapshotMode', 'candidateMode', 'keyHash', 'inputControlsHash',
    'headerOptionsHash', 'outputRequestId', 'payloadHash', 'envelopeMode', 'urlMode', 'urlRequestId', 'verifiedIdentityMatches', 'renderedIdentityMatches'])
    requireThat(beforeImage.binding[field] !== undefined && beforeImage.binding[field] === pendingImage.binding[field], 'PENDING_EXAM_IMAGE_CHANGED_PREVIOUS_BINDING');
  requireThat(pendingImage.binding.runtimeBusy === true && pendingProof?.rootPreserved === true && pendingProof.snapshotPreserved === true &&
    pendingProof.unexpectedVisibleRoot === false && pendingProof.geometryReads === 0 && pendingProof.candidatePages === 0 &&
    pendingProof.decodeReleased === false && pendingProof.decodeSettled === false && pendingProof.mathCalls === 0 && pendingImage.operationMath.calls === 0 &&
    pendingProof.mode === 'ans' && pendingProof.snapshotId === beforeImage.snapshotId && pendingProof.outputRequestId === beforeImage.binding.outputRequestId &&
    pendingProof.inputAndBindingPreserved === true, 'PENDING_EXAM_IMAGE_MEASURED_OR_REPLACED_VIEW');
  for (const row of [pendingImage, latestImage, settledImage, printedImage]) assertParity(beforeImage, row);
  requireThat(latestImage.cacheStatus === 'HIT' && latestImage.snapshotId === beforeImage.snapshotId && latestImage.operationMath.calls === 0 &&
    latestImage.adapters.filter(item => item.method === 'build').length === 0 && latestImage.attemptCount === beforeImage.attemptCount + 2 &&
    latestImage.attempts.some(attempt => attempt.committed === false && (attempt.state === 'DISCARDED_STALE' || attempt.code === 'DISCARDED_STALE')) &&
    latestImage.binding.outputRequestId !== beforeImage.binding.outputRequestId &&
    latestImage.binding.inputControlsHash === beforeImage.binding.inputControlsHash &&
    latestProof?.mode === 'ans' && latestProof.cacheStatus === 'HIT' && latestProof.snapshotId === latestImage.snapshotId &&
    latestProof.outputRequestId === latestImage.binding.outputRequestId && latestProof.attemptCount === latestImage.attemptCount &&
    latestProof.decodeReleased === false && latestProof.decodeSettled === false && latestProof.geometryReads === 0 &&
    latestProof.rootPreserved === true && latestProof.inputPreserved === true, 'LATEST_ANSWER_WAITED_FOR_EXAM_IMAGE');
  for (const field of ['snapshotId', 'outputRequestId', 'payloadHash', 'mode', 'urlMode', 'urlRequestId'])
    requireThat(latestImage.binding[field] === settledImage.binding[field], 'RELEASED_EXAM_IMAGE_REPLACED_BINDING');
  requireThat(settledImage.attemptCount === latestImage.attemptCount && settledProof?.decodeSettled === true &&
    settledProof.geometryReads === 0 && settledProof.unexpectedVisibleRoot === false && settledProof.mode === 'ans' &&
    settledProof.snapshotId === latestImage.snapshotId && settledProof.outputRequestId === latestImage.binding.outputRequestId &&
    settledProof.attemptCount === latestImage.attemptCount, 'RELEASED_EXAM_IMAGE_RESUMED_LAYOUT');
  printProbe(imageCase.printed, true);
}
function validateOriginal(report) {
  requireThat(report.schema === 'ARCHIVE_SOLUTION_LOADING_CHROME_V1' && report.baselineSha === ORIGINAL_BASELINE &&
    report.repeats === 2 && report.pass === true && !report.fatal, 'ORIGINAL_REGRESSION_NOT_PASSED');
  requireThat(report.fixture?.questions === 50 && report.fixture.baselinePayloadSha256 === KNOWN.inputSha256 &&
    report.fixture.currentPayloadSha256 === KNOWN.inputSha256 && same(report.fixture.sources, sourceFiles.slice(0, 3)) &&
    report.fixture.solutionImages === 37, 'ORIGINAL_FIXTURE_CHANGED');
  const assets = report.fixture.solutionAssets;
  requireThat(assets?.references === 37 && assets.uniqueFiles === 37 && assets.files?.length === 37 &&
    new Set(assets.files.map(file => file.path)).size === 37 &&
    assets.files.every(file => typeof file.path === 'string' && file.path.startsWith('assets/images/') && file.bytes > 0 && isHash(file.sha256)) &&
    assets.totalBytes === assets.files.reduce((sum, file) => sum + file.bytes, 0) &&
    assets.largestFileBytes === Math.max(...assets.files.map(file => file.bytes)), 'ORIGINAL_SOLUTION_ASSET_EVIDENCE_INCOMPLETE');
  const readyNames = ['actual-50-baseline-1', 'actual-50-current-1', 'actual-50-baseline-2', 'actual-50-current-2',
    'actual-50-qpp1-baseline', 'actual-50-qpp1-current', 'actual-50-qpp2-baseline', 'actual-50-qpp2-current',
    'slow-svg-1600ms-current', 'slow-svg-6000ms-current', 'original-real-sol-baseline', 'original-real-sol-current'];
  exactSet(report.rows?.map(row => row.name), [...readyNames, 'image-broken-blocks-print', 'image-hanging-blocks-print',
    'mixed-mode-failure-retry', 'original-real-modes-with-raf-suppressed'], 'ORIGINAL_CASE_COVERAGE_CHANGED');
  exactSet(report.comparisons?.map(row => row.name), ['actual-50-parity-1', 'actual-50-parity-2', 'actual-50-performance',
    'actual-50-qpp1-parity', 'actual-50-qpp2-parity', 'original-real-sol-parity'], 'ORIGINAL_COMPARISON_COVERAGE_CHANGED');
  requireThat([...report.rows, ...report.comparisons].every(row => row.pass === true && !row.error), 'ORIGINAL_CASE_FAILED');
  const map = new Map(report.rows.map(row => [row.name, row]));
  for (const name of readyNames) {
    const row = map.get(name), questions = name.startsWith('original-') ? 24 : 50;
    assertReady(row, { questions, qpp: /qpp1/.test(name) ? 1 : /qpp2/.test(name) ? 2 : 4 }, { extended: false });
  }
  for (const [baseline, current] of [['actual-50-baseline-1', 'actual-50-current-1'], ['actual-50-baseline-2', 'actual-50-current-2'],
    ['actual-50-qpp1-baseline', 'actual-50-qpp1-current'], ['actual-50-qpp2-baseline', 'actual-50-qpp2-current'],
    ['original-real-sol-baseline', 'original-real-sol-current']]) assertParity(map.get(baseline), map.get(current), false);
}
function summary(values) {
  const sorted = [...values].sort((a, b) => a - b), mid = Math.floor(sorted.length / 2);
  return { n: sorted.length, medianMs: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1] };
}
function performanceEvidence(report) {
  const groups = new Map();
  for (const row of report.rows.filter(row => row.pass && !isKnownLegacy(row))) {
    const id = [row.fixture, row.operation].join(':');
    if (!groups.has(id)) groups.set(id, { fixture: row.fixture, operation: row.operation, baseline: [], current: [] });
    groups.get(id)[row.label].push(row);
  }
  const timings = [...groups.values()].map(group => {
    const baseline = summary(group.baseline.map(row => row.publicMs)), current = summary(group.current.map(row => row.publicMs));
    const fasterRepeats = group.current.filter(row => row.publicMs < group.baseline.find(item => item.repeat === row.repeat)?.publicMs).length;
    return { fixture: group.fixture, operation: group.operation, baseline, current,
      deltaMs: current.medianMs - baseline.medianMs,
      improvementPercent: baseline.medianMs > 0 ? 100 * (baseline.medianMs - current.medianMs) / baseline.medianMs : null,
      fasterRepeats };
  });
  const gains = timings.filter(item => item.fixture === 'envelope50-qpp1' &&
    ['cold-exam', 'cold-sol', 'exam-sol', 'exam-sol-warm', 'sol-ans-warm'].includes(item.operation) &&
    item.baseline.n === 3 && item.current.n === 3 && item.fasterRepeats >= 2 && item.deltaMs < -20 && item.improvementPercent > 5);
  requireThat(gains.length > 0, 'NO_REPEAT_SUPPORTED_PERFORMANCE_GAIN');
  return { measuredImprovement: true, minimumEvidence: 'At least one targeted valid real-50 operation: n=3, >20ms and >5% median reduction, >=2 faster pairs.',
    p95Meaning: 'Nearest rank; n=3 P95 is the observed maximum, not a population tail estimate.',
    gains, slowdowns: timings.filter(item => item.deltaMs > 0), timings };
}
function qualify(artifacts, { currentSha } = {}) {
  const output = { schema: 'ARCHIVE_OUTPUT_SCOPED_RELEASE_QUALIFICATION_V1', currentSha, baselineSha: BASELINE,
    scopedReleasePass: false, qualityPass: false, universalProductPass: false,
    qualityStatus: 'UNRESOLVED_KNOWN_QPP4_CLIPPING',
    scope: 'Complete valid output comparisons plus verified failure preservation. The real-50 qpp4 solution and its blocked warm transitions are not quality-qualified.',
    knownIssue: { ...KNOWN, status: 'UNRESOLVED', qualityPass: false },
    rawReports: {}, coverage: {}, repairs: {}, failures: [], notes: [
      'Raw performance/PDF reports remain FAIL. The existing qpp4 reminder PNG still clips; no quality criterion or product gate is relaxed.',
      'Exactly 15 performance pairs after the known qpp4 solution failure are blocked, not passed. Direct qpp4 answer PDF and independent rollback/retry guards are required.',
      'Legacy qpp4 solution pixel equality proves unchanged defective output, not clean output quality.'
    ] };
  const roles = ['performance', 'pdf', 'cache', 'network:envelope50-qpp1', 'network:envelope8', 'original'];
  const checked = (role, work) => {
    try { work(); }
    catch (error) { output.failures.push({ artifact: role, code: error.code || 'MALFORMED_EVIDENCE', ...(error.details ? { details: error.details } : {}) }); }
  };
  checked('provenance', () => {
    requireThat(/^[a-f0-9]{40}$/.test(currentSha || '') && currentSha !== BASELINE, 'EXACT_CURRENT_SHA_REQUIRED');
    exactSet(Object.keys(artifacts), roles, 'ARTIFACT_SET_INCOMPLETE');
    const versions = roles.map(role => artifacts[role]?.chromeVersion);
    requireThat(versions.every(version => /^\d+\.\d+\.\d+\.\d+$/.test(version || '') && version === versions[0]), 'CHROME_VERSION_MISMATCH');
  });
  for (const role of roles) checked(role, () => {
    const report = artifacts[role];
    requireThat(report && report.currentSha === currentSha, 'ARTIFACT_SHA_MISMATCH');
    output.rawReports[role] = { schema: report.schema, pass: report.pass, outputParity: report.outputParity ?? null,
      rawCoverageComplete: report.coverage?.complete ?? null, currentSha: report.currentSha };
    if (role === 'cache') validateCache(report);
    else if (role === 'original') validateOriginal(report);
    else validateReport(report, role, output, artifacts);
  });
  if (!output.failures.length) checked('performance-proof', () => { output.performance = performanceEvidence(artifacts.performance); });
  output.scopedReleasePass = output.failures.length === 0;
  return output;
}
function loadArtifacts(directory) {
  const reports = {}, files = [];
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(filename);
      else if (entry.isFile() && ['output-performance.json', 'output-cache.json', 'solution-loading.json'].includes(entry.name)) files.push(filename);
    }
  }
  walk(directory);
  const references = [];
  for (const filename of files) {
    const bytes = fs.readFileSync(filename), report = JSON.parse(bytes);
    const role = report.schema === 'ARCHIVE_OUTPUT_CACHE_CHROME_V1' ? 'cache' :
      report.schema === 'ARCHIVE_SOLUTION_LOADING_CHROME_V1' ? 'original' :
        report.schema === 'ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1' ?
          (report.phase === 'network-completion' ? 'network:' + report.networkFixtureId : report.phase) : null;
    requireThat(role && !reports[role], 'UNKNOWN_OR_DUPLICATE_ARTIFACT');
    reports[role] = report;
    references.push({ role, file: path.relative(directory, filename), sha256: digest(bytes), bytes: bytes.length });
  }
  return { reports, references };
}
if (require.main === module) {
  let result;
  const args = process.argv.slice(2), value = name => args[args.indexOf(name) + 1];
  try {
    requireThat(args.includes('--artifacts') && args.includes('--current-sha'), 'USAGE_ARTIFACTS_AND_CURRENT_SHA_REQUIRED');
    const { reports, references } = loadArtifacts(path.resolve(value('--artifacts')));
    result = qualify(reports, { currentSha: value('--current-sha') });
    result.artifacts = references;
  } catch (error) {
    result = { schema: 'ARCHIVE_OUTPUT_SCOPED_RELEASE_QUALIFICATION_V1', scopedReleasePass: false, qualityPass: false,
      universalProductPass: false, failures: [{ code: error.code || 'ARTIFACT_READ_FAILED' }] };
  }
  const outputFile = args.includes('--output') ? path.resolve(value('--output')) :
    args.includes('--artifacts') ? path.join(path.resolve(value('--artifacts')), 'output-release-qualification.json') : null;
  if (outputFile) fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  if (!result.scopedReleasePass) process.exitCode = 1;
}
module.exports = { qualify, loadArtifacts, expectedPlan, BASELINE, ORIGINAL_BASELINE, KNOWN, fixtureSpecs, cacheCases };
