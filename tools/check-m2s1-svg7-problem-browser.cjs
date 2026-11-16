'use strict';

// Exact public SVG7 problem-only UI evidence. No mathematical, metadata,
// difficulty, REVIEW2, Native or four-slot approval is issued by this checker.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const cp = require('node:child_process');
const H = require('./check-reviewed-problem-renderer-browser.cjs');
const A = require('./m2s1-svg7-problem-capture.cjs');
const { stable, sha256, gitBlob, createGitReader, studentFontResourcePath, checkedStudentFontRefs, FONT_DIR, FONT_STYLESHEET,
  fontFailureDiagnostic, readScreenshotArtifacts, assertScreenshotInventory } = H;
const MANIFEST_PATH = 'tests/fixtures/archive-m2s1-svg7-problem-ui.json';
const CHECKER_PATH = 'tools/check-m2s1-svg7-problem-browser.cjs';
const SHARED_CHECKER_PATH = 'tools/check-reviewed-problem-renderer-browser.cjs';
const SHARED_CHECKER_SHA256 = 'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673';
const ROLE_CAPTURE_PATH = 'tools/m2s1-svg7-problem-capture.cjs';
const ROLE_CAPTURE_SHA256 = 'a4092b992d01f5069a4a084598d7c4fe7d20488d122e120ec718bf226c44d585';
const IDENTITY_PATH = 'archive/data/question_identity_map.json';
const SCHEMA = 'archive-m2s1-svg7-problem-ui-preview-v1';
const FONT_FAMILY = 'Nanum Myeongjo';
const SHA1 = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const EXPECTED_MANIFEST_SHA256 = '7841708cf55979eee55c2dc051bef354ddd1fabb1253bed0699b9dba24ff800c';
const EXPECTED_ITEMS_SHA256 = '955387d143c582ddfb39dc88a8a59043dd77ab21f4cfa3e836422d9bcd1d26bc';
const VIEWPORTS = Object.freeze([{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]);
const SEALED = 'SEALED_PUBLIC_SOURCE_CANDIDATE';
const ownSnapshot = (question, fields) => Object.fromEntries(fields.map(field => [field,
  { present: Object.hasOwn(question, field), value: question[field] ?? null }]));
function ownKeys(value, keys, code) {
  assert(value && typeof value === 'object' && !Array.isArray(value), code);
  assert.deepEqual(Object.keys(value).sort(), keys.slice().sort(), code);
}
function validateManifest(manifest) {
  ownKeys(manifest, ['schemaVersion', 'scope', 'bindingState', 'surface', 'mode', 'sourceCandidateCommit', 'expectedCases', 'viewports',
    'sourceTransportReceiptRef', 'staticEvidenceRef', 'priorStaticEvidenceRef', 'identityBinding', 'engineBinding', 'sharedHelperBinding', 'sourceBindings', 'items'], 'UI_SVG7_MANIFEST_KEYS');
  assert.equal(manifest.schemaVersion, 'archive-m2s1-svg7-problem-ui-manifest-v2', 'UI_SVG7_MANIFEST_SCHEMA');
  assert.equal(manifest.scope, 'EXACT_M2S1_SVG7_PROBLEM_DISPLAY_NO_APPROVAL', 'UI_SVG7_MANIFEST_SCOPE');
  assert(manifest.surface === 'PROBLEM' && manifest.mode === 'exam', 'UI_SVG7_PROBLEM_ONLY');
  assert.equal(manifest.bindingState, SEALED, 'UI_SVG7_PUBLIC_SOURCE_SEAL_REQUIRED');
  assert.equal(manifest.expectedCases, 14, 'UI_SVG7_CASE_COUNT');
  assert.deepEqual(manifest.viewports, VIEWPORTS, 'UI_SVG7_EXACT_VIEWPORTS');
  assert(Array.isArray(manifest.items) && manifest.items.length === 7, 'UI_SVG7_EXACT_ITEMS');
  assert.equal(sha256(stable(manifest.items)), EXPECTED_ITEMS_SHA256, 'UI_SVG7_EXACT_TARGET_BINDING');
  assert.equal(new Set(manifest.items.map(item => item.questionUid)).size, 7, 'UI_SVG7_UNIQUE_UID');
  const sources = [...new Set(manifest.items.map(item => item.sourcePath))].sort();
  assert.equal(sources.length, 3, 'UI_SVG7_THREE_BANKS');
  assert(Array.isArray(manifest.sourceBindings) && manifest.sourceBindings.length === 3, 'UI_SVG7_SOURCE_BINDINGS');
  assert.deepEqual(manifest.sourceBindings.map(row => row.sourcePath).sort(), sources, 'UI_SVG7_SOURCE_INVENTORY');
  for (const row of manifest.sourceBindings) {
    ownKeys(row, ['sourcePath', 'gitBlobSha1', 'sha256', 'bytes', 'expectedQuestionCount'], 'UI_SVG7_SOURCE_BINDING_KEYS');
    assert(SHA1.test(row.gitBlobSha1) && SHA256.test(row.sha256) && Number.isSafeInteger(row.bytes) && row.bytes > 0, 'UI_SVG7_SOURCE_BINDING_VALUES');
  }
  assert.equal(sha256(stable(manifest)), EXPECTED_MANIFEST_SHA256, 'UI_SVG7_IMMUTABLE_MANIFEST');
  return manifest;
}
const requireSealedManifest = validateManifest;
function checkoutEvidence(actualCommit, env = process.env) {
  const expectedCommit = env.ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA;
  assert(typeof expectedCommit === 'string' && SHA1.test(expectedCommit), 'UI_SVG7_EXPECTED_CHECKOUT_REQUIRED');
  assert.equal(actualCommit, expectedCommit, 'UI_SVG7_CHECKOUT_MISMATCH');
  assert(env.GITHUB_SHA === undefined || (typeof env.GITHUB_SHA === 'string' && SHA1.test(env.GITHUB_SHA)), 'UI_SVG7_EVENT_SHA');
  return { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: actualCommit, githubEventCommit: env.GITHUB_SHA ?? null };
}
function loadQuestions(bytes) {
  const sandbox = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext('globalThis.window = Object.create(null);', sandbox, { timeout: 1500 });
  vm.runInContext(bytes.toString('utf8'), sandbox, { timeout: 1500, filename: 'svg7-source.js' });
  const bank = sandbox.window.questionBank ?? sandbox.questionBank ?? sandbox.window.examData?.questions ?? sandbox.examData?.questions;
  assert(Array.isArray(bank), 'UI_SVG7_BANK_REQUIRED');
  return bank;
}
function assertBoundQuestion(item, question) {
  assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_SVG7_ORDINAL');
  assert.equal(sha256(stable(question)), item.questionSha256, 'UI_SVG7_WHOLE_QUESTION_DRIFT');
  assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_SVG7_PROBLEM_PAYLOAD_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['content', 'question', 'choices']))), item.problemFieldsSha256, 'UI_SVG7_PROBLEM_OWN_FIELDS_DRIFT');
  assert.equal(sha256(stable(ownSnapshot(question, ['image', 'imageAlt', 'imageSize', 'layoutTag']))), item.presentationSha256, 'UI_SVG7_PRESENTATION_DRIFT');
  assert(typeof question.content === 'string' && item.imageBinding === 'CONTENT_SINGLE_IMG' && !Object.hasOwn(question, 'image'), 'UI_SVG7_INLINE_IMAGE_PROFILE');
  assert.equal(sha256(question.content), item.contentSha256, 'UI_SVG7_CONTENT_DRIFT');
  const inline = [...question.content.matchAll(/<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1/gi)].map(match => match[2]);
  assert.deepEqual(inline, [item.assetPath.slice('archive/'.length)], 'UI_SVG7_SINGLE_INLINE_IMAGE');
  assert(Array.isArray(question.choices) && question.choices.length === item.choiceCount, 'UI_SVG7_CHOICE_COUNT');
  if (item.key === A.EMBEDDED_CHOICE_KEY) {
    const binding = A.assertEmbeddedChoiceRow(item);
    assert(Object.hasOwn(question, 'choicesEmbeddedInImage') && question.choicesEmbeddedInImage === true &&
      question.sourcePayload?.choicesEmbeddedInImage !== true && question.choices.every(value => typeof value === 'string' && value.trim().length > 0) &&
      sha256(stable(question.choices)) === binding.choicesSha256, 'UI_SVG7_BOUND_EMBEDDED_CHOICES');
  } else assert(item.embeddedChoiceBinding === undefined && question.choicesEmbeddedInImage !== true && question.sourcePayload?.choicesEmbeddedInImage !== true,
    'UI_SVG7_UNSUPPORTED_EMBEDDED_CHOICES');
}
function readBound(reader, ref, code) {
  const bytes = reader.read(ref.path);
  assert.equal(gitBlob(bytes), ref.gitBlobSha1, code);
  assert.equal(sha256(bytes), ref.sha256, code);
  assert.equal(bytes.length, ref.bytes, code);
  return bytes;
}
function readHistoricalBound(reader, ref) {
  ownKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'], 'UI_SVG7_ORIGINAL_REF');
  assert(SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) && SHA256.test(ref.sha256) && Number.isSafeInteger(ref.bytes) && ref.bytes > 0 &&
    typeof ref.path === 'string' && !path.posix.isAbsolute(ref.path) && path.posix.normalize(ref.path) === ref.path &&
    !ref.path.includes('\\') && !ref.path.split('/').some(part => part === '.' || part === '..'), 'UI_SVG7_ORIGINAL_REF');
  const git = args => cp.execFileSync('git', ['-C', reader.root, ...args], { maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(git(['rev-parse', '--verify', ref.commit + '^{commit}']).toString().trim(), ref.commit, 'UI_SVG7_ORIGINAL_COMMIT');
  assert.equal(git(['ls-tree', '-z', ref.commit, '--', ref.path]).toString(), `100644 blob ${ref.gitBlobSha1}\t${ref.path}\0`, 'UI_SVG7_ORIGINAL_REGULAR_BLOB');
  const bytes = git(['cat-file', 'blob', ref.gitBlobSha1]);
  assert(gitBlob(bytes) === ref.gitBlobSha1 && sha256(bytes) === ref.sha256 && bytes.length === ref.bytes, 'UI_SVG7_ORIGINAL_BYTES');
  return bytes;
}
function validateEmbeddedOriginal(reader, item, question, staticRow) {
  const binding = A.assertEmbeddedChoiceRow(item);
  assert.deepEqual(binding.beforeSourceRef, staticRow.beforeSourceRef, 'UI_SVG7_ORIGINAL_STATIC_JOIN');
  assert.equal(binding.beforeQuestionSha256, staticRow.wholeQuestionBeforeSha256, 'UI_SVG7_ORIGINAL_STATIC_JOIN');
  assert.deepEqual(binding.oldAssetRef, staticRow.oldAssetRef, 'UI_SVG7_ORIGINAL_STATIC_JOIN');
  const bank = loadQuestions(readHistoricalBound(reader, binding.beforeSourceRef));
  assert.equal(bank.length, item.expectedBankCount, 'UI_SVG7_ORIGINAL_BANK');
  const old = bank[item.sourceOrdinal - 1];
  assert(sha256(stable(old)) === binding.beforeQuestionSha256 && String(old.id ?? old.number) === String(item.sourceOrdinal), 'UI_SVG7_ORIGINAL_QUESTION');
  assert(old.choicesEmbeddedInImage === true && Object.hasOwn(old, 'choicesEmbeddedInImage') && old.sourcePayload?.choicesEmbeddedInImage !== true &&
    sha256(stable(old.choices)) === binding.choicesSha256 && stable(old.choices) === stable(question.choices), 'UI_SVG7_ORIGINAL_EMBEDDED_CHOICES');
  readHistoricalBound(reader, binding.oldAssetRef);
  const beforeOther = { ...old }, afterOther = { ...question }; delete beforeOther.content; delete afterOther.content;
  assert.deepEqual(JSON.parse(stable(beforeOther)), JSON.parse(stable(afterOther)), 'UI_SVG7_ORIGINAL_NON_URI_FIELDS');
  const beforeUri = binding.oldAssetRef.path.slice('archive/'.length), afterUri = item.assetPath.slice('archive/'.length);
  assert(typeof old.content === 'string' && old.content.split(beforeUri).length === 2 && old.content.replace(beforeUri, afterUri) === question.content,
    'UI_SVG7_ORIGINAL_SINGLE_URI_REPLACEMENT');
}
// The new immutable root capsule changes one label position. It does not
// replace the original seven-problem static review or widen the capture scope.
function assertOriginOnlyDelta(beforeBytes, afterBytes) {
  const before = beforeBytes.toString('utf8'), after = afterBytes.toString('utf8');
  const matches = [...before.matchAll(/<text\b[^>]*>O<\/text>/gu)];
  assert(matches.length === 1 && matches[0][0].split('x="118.158"').length === 2, 'UI_SVG7_ORIGIN_ORIGINAL_LABEL');
  const oldElement = matches[0][0], newElement = oldElement.replace('x="118.158"', 'x="158.158"');
  const expected = before.slice(0, matches[0].index) + newElement + before.slice(matches[0].index + oldElement.length);
  assert(Buffer.from(expected).equals(afterBytes) && after.replace(newElement, oldElement) === before, 'UI_SVG7_ORIGIN_ONLY_X_DELTA');
  return { tag: 'text', text: 'O', attribute: 'x', before: '118.158', after: '158.158' };
}
function validateRevisionStatic(manifest, receipt, prior, revision) {
  requireSealedManifest(manifest);
  ownKeys(revision, ['schemaVersion', 'transportProfile', 'producer', 'reviewer', 'priorStaticRef', 'repair', 'staticDecision',
    'actualUi', 'newFullMathematicalQa', 'newNativeApprovals', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotVectors'], 'UI_SVG7_REVISION_CAPSULE_KEYS');
  assert(revision.schemaVersion === 'archive-independent-m2s1-svg7-q24-origin-label-static-v2' &&
    revision.transportProfile === 'M2S1_SVG7_IMAGE_POINTER_Q24_ORIGIN_V2' &&
    revision.producer === 'GPT_M2S1_RELEASE' && revision.reviewer === 'GPT_ROOT_C8F1B0BFB4FA' && revision.reviewer !== revision.producer &&
    revision.staticDecision === 'ACCEPT_ORIGIN_LABEL_POSITION_ONLY' && revision.actualUi === 'PENDING' && revision.newFullMathematicalQa === false &&
    ['newNativeApprovals', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotVectors'].every(key => revision[key] === 0), 'UI_SVG7_REVISION_AUTHORITY');
  assert.deepEqual(revision.priorStaticRef, manifest.priorStaticEvidenceRef, 'UI_SVG7_PRIOR_STATIC_JOIN');
  const repair = revision.repair, item = manifest.items.find(row => row.key === 'E045-Q24');
  ownKeys(repair, ['key', 'questionUid', 'sourceOrdinal', 'priorRepairAssetRef', 'newAssetRef', 'attributeDelta', 'xmlPropertyProofSha256'], 'UI_SVG7_REPAIR_KEYS');
  assert(repair.key === item.key && repair.questionUid === item.questionUid && repair.sourceOrdinal === item.sourceOrdinal &&
    repair.xmlPropertyProofSha256 === 'ae35439e0fec97839bf8bac613c90e51c27b3b20d9c61cc3c31e82aa4d727bec', 'UI_SVG7_REPAIR_SCOPE');
  assert.deepEqual(repair.attributeDelta, { tag: 'text', text: 'O', attribute: 'x', before: '118.158', after: '158.158' }, 'UI_SVG7_REPAIR_ATTRIBUTE');
  assert(Array.isArray(prior.rows) && prior.rows.length === 7 && new Set(prior.rows.map(row => row.questionUid)).size === 7, 'UI_SVG7_PRIOR_SEVEN');
  const old = prior.rows.find(row => row.key === item.key);
  assert(old && old.questionUid === item.questionUid && old.sourceOrdinal === item.sourceOrdinal, 'UI_SVG7_PRIOR_SCOPE');
  assert.deepEqual(repair.priorRepairAssetRef, old.newAssetRef, 'UI_SVG7_PRIOR_ASSET_JOIN');
  assert.deepEqual(repair.newAssetRef, { commit: '987990e2452af47732dc62e1925c1bc397d474e4', path: item.assetPath,
    gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes }, 'UI_SVG7_NEW_ASSET_JOIN');
  const closure = receipt.inputClosure;
  assert(receipt.schemaVersion === 'archive-reviewed-source-candidate-receipt-v1' &&
    receipt.materializationId === 'm2s1-svg7-q24-origin-v2-20261116' && receipt.inputCommit === '828b47b23a29be265ad73264e3ac7274afeefc9b' &&
    receipt.baseCommit === 'd7111057c89ad4f4a418e2805eeeb1b04447f99f' &&
    closure?.transportProfile === revision.transportProfile && closure.selectedUidCount === 7 && closure.selection?.length === 7 &&
    new Set(closure.selection.map(row => row.questionUid)).size === 7 && closure.assetRevisionKey === item.key && closure.unchangedPriorAssets === 6 &&
    closure.requestCount === 0 && closure.preservationRequestCount === 0 && closure.newApprovals === 0 && closure.approvalEffect === 'NONE' &&
    closure.actualUi === 'PENDING' && receipt.approvalEffect === 'NONE' && receipt.registrationStatus === 'NOT_REGISTERED' &&
    closure.selectedOtherFieldsChanged === 0 && closure.nonselectedWholeQuestionChanges === 0 && closure.originalAssetsChanged === 0 &&
    closure.sourcePrefixSuffixChanged === 0 && closure.literalChangeKind === 'EXACT_SINGLE_IMG_SRC_URI_ONLY', 'UI_SVG7_REVISION_RECEIPT');
  assert.deepEqual(closure.sourceFieldsChanged, ['content'], 'UI_SVG7_REVISION_RECEIPT');
  assert.deepEqual(closure.staticEvidenceRef, manifest.staticEvidenceRef, 'UI_SVG7_REVISION_RECEIPT');
  assert.deepEqual(closure.priorStaticEvidenceRef, manifest.priorStaticEvidenceRef, 'UI_SVG7_REVISION_RECEIPT');
  assert.deepEqual(closure.assetRevisionChange, repair.attributeDelta, 'UI_SVG7_REVISION_RECEIPT');
  const rows = prior.rows.map(row => {
    const transport = closure.selection.find(entry => entry.key === row.key), target = manifest.items.find(entry => entry.key === row.key);
    assert(transport && target && transport.questionUid === row.questionUid && transport.sourceOrdinal === row.sourceOrdinal &&
      transport.beforeWholeQuestionSha256 === row.wholeQuestionBeforeSha256 && transport.contentBeforeSha256 === row.contentBeforeSha256 &&
      transport.afterWholeQuestionSha256 === target.questionSha256 && transport.contentAfterSha256 === target.contentSha256 &&
      transport.pointerField === 'content' && transport.pointerKind === 'EXACT_SINGLE_IMG_SRC_URI', 'UI_SVG7_REVISION_ORIGINAL_JOIN');
    return row.key === item.key ? { ...row, newAssetRef: repair.newAssetRef, contentAfterSha256: target.contentSha256 } : row;
  });
  return { ...prior, rows };
}
function readRevisionStatic(reader, manifest, receipt) {
  const priorBytes = readBound(reader, manifest.priorStaticEvidenceRef, 'UI_SVG7_PRIOR_STATIC_DRIFT');
  const revisionBytes = readBound(reader, manifest.staticEvidenceRef, 'UI_SVG7_STATIC_REVIEW_DRIFT');
  assert.deepEqual(readHistoricalBound(reader, manifest.priorStaticEvidenceRef), priorBytes, 'UI_SVG7_PRIOR_STATIC_IMMUTABLE');
  assert.deepEqual(readHistoricalBound(reader, manifest.staticEvidenceRef), revisionBytes, 'UI_SVG7_REVISION_IMMUTABLE');
  const prior = JSON.parse(priorBytes), revision = JSON.parse(revisionBytes);
  const result = validateRevisionStatic(manifest, receipt, prior, revision);
  const before = readHistoricalBound(reader, revision.repair.priorRepairAssetRef), after = readHistoricalBound(reader, revision.repair.newAssetRef);
  assert.deepEqual(assertOriginOnlyDelta(before, after), revision.repair.attributeDelta, 'UI_SVG7_REVISION_DELTA_JOIN');
  return result;
}

function preflight(reader, manifest) {
  requireSealedManifest(manifest);
  const identityBytes = readBound(reader, manifest.identityBinding, 'UI_SVG7_IDENTITY_DRIFT'), identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_SVG7_IDENTITY_RECORDS');
  const receiptBytes = readBound(reader, manifest.sourceTransportReceiptRef, 'UI_SVG7_TRANSPORT_RECEIPT_DRIFT');
  assert.deepEqual(readHistoricalBound(reader, manifest.sourceTransportReceiptRef), receiptBytes, 'UI_SVG7_RECEIPT_IMMUTABLE');
  const receipt = JSON.parse(receiptBytes), staticReview = readRevisionStatic(reader, manifest, receipt);
  readBound(reader, manifest.engineBinding, 'UI_SVG7_ENGINE_DRIFT');
  readBound(reader, manifest.sharedHelperBinding, 'UI_SVG7_SHARED_HELPER_DRIFT');
  assert.equal(receipt.sourceFiles.length, 3, 'UI_SVG7_RECEIPT_SOURCES');
  assert.equal(receipt.inputClosure.selection.length, 7, 'UI_SVG7_RECEIPT_SCOPE');
  const banks = new Map();
  for (const binding of manifest.sourceBindings) {
    const bytes = readBound(reader, { ...binding, path: binding.sourcePath }, 'UI_SVG7_SOURCE_DRIFT');
    assert.deepEqual(receipt.sourceFiles.find(row => row.path === binding.sourcePath),
      { path: binding.sourcePath, blobSha1: binding.gitBlobSha1, sha256: binding.sha256, bytes: binding.bytes }, 'UI_SVG7_ISSUED_SOURCE');
    const questions = loadQuestions(bytes);
    assert.equal(questions.length, binding.expectedQuestionCount, 'UI_SVG7_BANK_COUNT');
    banks.set(binding.sourcePath, { bytes, questions });
  }
  const items = manifest.items.map(item => {
    const { bytes, questions } = banks.get(item.sourcePath);
    assert.equal(questions.length, item.expectedBankCount, 'UI_SVG7_BANK_COUNT');
    assertBoundQuestion(item, questions[item.sourceOrdinal - 1]);
    const transport = receipt.inputClosure.selection.find(row => row.key === item.key);
    const staticRow = staticReview.rows.find(row => row.key === item.key);
    assert(transport && staticRow && transport.questionUid === item.questionUid && staticRow.questionUid === item.questionUid &&
      transport.sourceOrdinal === item.sourceOrdinal && staticRow.sourceOrdinal === item.sourceOrdinal &&
      transport.afterWholeQuestionSha256 === item.questionSha256 && staticRow.contentAfterSha256 === item.contentSha256, 'UI_SVG7_STATIC_TRANSPORT_JOIN');
    if (item.key === A.EMBEDDED_CHOICE_KEY) validateEmbeddedOriginal(reader, item, questions[item.sourceOrdinal - 1], staticRow);
    const asset = readBound(reader, { path: item.assetPath, gitBlobSha1: item.assetGitBlobSha1, sha256: item.assetSha256, bytes: item.assetBytes }, 'UI_SVG7_ASSET_DRIFT');
    for (const [target, field] of [['path', 'assetPath'], ['gitBlobSha1', 'assetGitBlobSha1'], ['sha256', 'assetSha256'], ['bytes', 'assetBytes']])
      assert.equal(staticRow.newAssetRef[target], item[field], 'UI_SVG7_STATIC_ASSET_JOIN');
    const matched = identity.records.filter(row => row.sourceArchiveFile === item.sourcePath.slice('archive/exams/'.length) && Number(row.sourceOrdinal) === item.sourceOrdinal);
    assert.equal(matched.length, 1, 'UI_SVG7_UNIQUE_IDENTITY');
    assert.equal(matched[0].questionUid, item.questionUid, 'UI_SVG7_IDENTITY_UID');
    return { ...item, sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), sourceTransportReceiptRef: reader.ref(manifest.sourceTransportReceiptRef.path),
    staticEvidenceRef: reader.ref(manifest.staticEvidenceRef.path), priorStaticEvidenceRef: reader.ref(manifest.priorStaticEvidenceRef.path), engineRef: reader.ref(manifest.engineBinding.path), items };
}
function assertTechnicalState(technical, expectedBankCount) {
  assert([24, 25, 26].includes(expectedBankCount), 'UI_SVG7_EXPECTED_BANK_COUNT');
  assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
  assert.equal(technical.questions, expectedBankCount, 'UI_SVG7_RENDERED_BANK_COUNT');
  assert.equal(technical.readiness, 'RENDER_READY', 'UI_SVG7_RENDER_READY');
  assert(technical.pages > 0 && technical.imagesComplete === true, 'UI_RENDERED_IMAGES');
  assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
  assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
  assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
  assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
}
function assertCompletedResults(results, inputs, manifest, artifacts) {
  requireSealedManifest(manifest);
  assert.equal(results.length, 14, 'UI_SVG7_FOURTEEN_LOGICAL_CASES');
  assert.equal(inputs.items.length, 7, 'UI_SVG7_INPUT_INVENTORY');
  const seen = new Set();
  for (const row of results) {
    const item = inputs.items.find(item => item.key === row.key), viewport = VIEWPORTS.find(viewport => viewport.name === row.viewport?.name);
    assert(item && viewport, 'UI_SVG7_RESULT_TARGET');assert.deepEqual(row.viewport, viewport, 'UI_SVG7_RESULT_VIEWPORT');
    const key = item.questionUid + '#' + viewport.name;assert(!seen.has(key), 'UI_SVG7_DUPLICATE_LOGICAL_CASE');seen.add(key);
    assert(row.status === 'PASS' && row.visualReview === 'PENDING' && row.questionUid === item.questionUid && row.sourceOrdinal === item.sourceOrdinal, 'UI_SVG7_RESULT_TARGET');
    assert.deepEqual(row.sourceRef, item.sourceRef, 'UI_SVG7_RESULT_SOURCE');assert.deepEqual(row.assetRef, item.assetRef, 'UI_SVG7_RESULT_ASSET');
    assertTechnicalState(row.technical, item.expectedBankCount);
    const fonts = row.technical.fontReadiness;
    assert(fonts && fonts.status === 'loaded' && fonts.family === FONT_FAMILY && Array.isArray(fonts.weights) &&
      fonts.weights.length === 3 && fonts.weights.every((font, index) => font.weight === [400, 700, 800][index] && font.loadedFaces > 0 && font.allLoaded === true && font.checked === true) &&
      Array.isArray(fonts.problemFontFamilies) && fonts.problemFontFamilies.length > 0 && fonts.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_SVG7_COMPLETED_FONT_READINESS');
    const capture = row.capture;
    assert(capture.schemaVersion === H.TILE_SCHEMA && capture.method === 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' && capture.overlapCssPixels === 32 && capture.tileLimit === 8 &&
      capture.cssWrites === 0 && capture.domWrites === 0 && capture.viewportChanges === 0 && capture.compositeImageCreated === false && capture.feedbackIdle === true && capture.foreignContentHits === 0, 'UI_SVG7_UNCHANGED_CAPTURE_REQUIRED');
    assert.deepEqual(capture.coverage, H.assertTileCoverage(capture.content.height, capture.tiles), 'UI_SVG7_COMPLETE_COVERAGE');
    if (capture.visibleChildren === 2) {
      const roles = capture.closedProblemRoles;
      assert(roles && roles.key === item.key && roles.questionUid === item.questionUid && roles.sourceOrdinal === item.sourceOrdinal &&
        roles.numberRoleCount === 1 && roles.contentRoleCount === 1 && roles.targetImageCount === 1 &&
        roles.originalSharedHelperUnchanged === true && SHA256.test(roles.initialFrameSha256), 'UI_SVG7_COMPLETED_TWO_ROLES');
      if (item.key === A.EMBEDDED_CHOICE_KEY) {
        const binding = A.assertEmbeddedChoiceRow(item), state = roles.choiceState;
        assert(roles.schemaVersion === 'archive-m2s1-svg7-embedded-image-choices-v1' && roles.expectedChoiceCount === 5 && roles.emptyZeroHeightNodeCount === 0 &&
          state?.choiceCount === 5 && state.allChoicesNonemptyStrings === true && state.ownEmbeddedFlag === true && state.embeddedFlagValue === true &&
          state.nestedEmbeddedFlag === false && state.choicesSha256 === binding.choicesSha256, 'UI_SVG7_COMPLETED_EMBEDDED_CHOICES');
        assert.deepEqual(roles.embeddedChoiceBinding, binding, 'UI_SVG7_COMPLETED_EMBEDDED_CHOICES');
      } else assert(A.TWO_ROLE_KEYS.includes(item.key) && item.choiceCount === 0 && roles.schemaVersion === 'archive-m2s1-svg7-two-direct-roles-v1' &&
        roles.expectedChoiceCount === 0 && roles.emptyZeroHeightNodeCount === 1 && !Object.hasOwn(roles, 'embeddedChoiceBinding') && !Object.hasOwn(roles, 'choiceState'),
        'UI_SVG7_COMPLETED_TWO_ROLES');
      assert.deepEqual(roles.sourceRef, item.sourceRef, 'UI_SVG7_COMPLETED_TWO_ROLES');
      assert.deepEqual(roles.assetRef, item.assetRef, 'UI_SVG7_COMPLETED_TWO_ROLES');
    } else assert(item.key !== A.EMBEDDED_CHOICE_KEY && Number.isInteger(capture.visibleChildren) && capture.visibleChildren >= 3 && !Object.hasOwn(capture, 'closedProblemRoles'), 'UI_SVG7_UNCHANGED_SHARED_CAPTURE');
    for (const tile of capture.tiles) {
      assert(tile.feedbackIdle === true && tile.obstructionsIntersectingClip === 0 && tile.foreignContentHits === 0 && tile.hitTestSamples > 0 && tile.domSha256 === capture.domSha256, 'UI_SVG7_UNOBSTRUCTED_ORIGINAL_TILE');
    }
    assert(row.geometry?.imageInsideQuestion === true && row.geometry.naturalWidth > 0 && row.geometry.image.width > 0, 'UI_SVG7_RESULT_IMAGE_GEOMETRY');
    for (const field of ['pageErrors', 'requestFailures', 'externalRequests']) assert.deepEqual(row[field], [], 'UI_SVG7_NETWORK_OR_PAGE_FAILURE');
  }
  assert.equal(seen.size, 14, 'UI_SVG7_COMPLETE_LOGICAL_INVENTORY');
  return assertScreenshotInventory(results, artifacts);
}
function checkedOutput(root, out) {
  root = path.resolve(root); out = path.resolve(out);
  assert(out !== root && !out.startsWith(root + path.sep), 'UI_SVG7_OUTPUT_OUTSIDE_CHECKOUT');
  for (let current = out; current !== path.dirname(current); current = path.dirname(current))
    if (fs.existsSync(current)) assert(!fs.lstatSync(current).isSymbolicLink(), 'UI_SVG7_OUTPUT_SYMLINK');
  assert(!fs.existsSync(out) || fs.readdirSync(out).length === 0, 'UI_SVG7_EMPTY_OUTPUT_REQUIRED');
  return out;
}

// The bounded browser driver below is copied from the independently checked
// Q22 problem-only driver; only the closed cohort names and bank counts differ.
const mime = rel => ({ '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' }[path.extname(rel)] || 'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath, githubEventCommit = null }) {
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  assert(SHA1.test(expectedCommit), 'UI_SVG7_EXPECTED_CHECKOUT_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const captureHelperRef = reader.ref(SHARED_CHECKER_PATH);
  assert.equal(captureHelperRef.sha256, SHARED_CHECKER_SHA256, 'UI_SVG7_CAPTURE_HELPER_CHANGED');
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  const roleCaptureHelperRef = reader.ref(ROLE_CAPTURE_PATH);
  assert.equal(roleCaptureHelperRef.sha256, ROLE_CAPTURE_SHA256, 'UI_SVG7_ROLE_HELPER_CHANGED');
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [];
  let activeCase = null;
  const roleDiagnostics = [];
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: reader.commit,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef, roleCaptureHelperRef, ...inputs,
    checkout: { expectedCheckoutCommit: expectedCommit, actualCheckoutCommit: reader.commit, githubEventCommit },
    newParentApprovals: 0, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW',
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertCompletedResults(results, inputs, manifest, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, roleDiagnostics, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
      studentFontResources: [...studentFontResources.values()], externalFontResources: [], failures };
    fs.writeFileSync(path.join(out, 'technical-proof.json'), JSON.stringify(proof, null, 2) + '\n');
    return proof;
  };
  let browser;
  const server = http.createServer((request, response) => {
    try {
      const rel = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '');
      if (rel === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      // The engine also loads its tracked ../apmath navigation resources.
      // read() requires an exact regular file in this immutable checkout tree;
      // it cannot expose an untracked file, symlink, traversal or Git internals.
      const bytes = reader.read(rel);
      served.set(rel, reader.ref(rel, bytes));
      response.writeHead(200, { 'Content-Type': mime(rel), 'Cache-Control': 'no-store' });
      response.end(bytes);
    } catch {
      failures.push({ code: 'UI_STATIC_FILE_UNAVAILABLE', requestSha256: sha256(request.url || '') });
      response.writeHead(404); response.end();
    }
  });
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 240000);
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath, headless: true, timeout: 30000 });
    proofBase.browserVersion = browser.version();
    const banks = [...new Set(manifest.items.map(item => item.sourcePath))];
    for (const viewport of manifest.viewports) for (const sourcePath of banks) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
        isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', serviceWorkers: 'block' });
      let page, casesCompleted = false, caseFailure = null;
      const pageErrors = [], requestFailures = [], externalRequests = [];
      const fontState = { declaredFonts: new Set(), fontRefs, fontWeights, studentFontResources, fontResources: new Map(), failures };
      const routeLifecycle = H.createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) return H.serveStudentFont(route, url, fontPath, fontState);
          if (url.origin === origin) {
            if (url.pathname.startsWith('/' + FONT_DIR)) {
              failures.push({ code: 'UI_FONT_NOT_DECLARED', requestSha256: sha256(url.href) });
              return route.abort('blockedbyclient');
            }
            return route.continue();
          }
          if (url.protocol === 'https:' && url.hostname === 'img.wangjiedu.com' && url.pathname.startsWith('/exams/images/')) {
            try {
              const rel = 'archive/assets/images/' + decodeURIComponent(url.pathname.slice('/exams/images/'.length));
              const bytes = reader.read(rel);
              mirrored.set(rel, reader.ref(rel, bytes));
              return route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' }, contentType: mime(rel), body: bytes });
            } catch { failures.push({ code: 'UI_MIRRORED_ASSET_UNAVAILABLE', requestSha256: sha256(route.request().url()) }); }
          }
          externalRequests.push({ host: url.hostname, urlSha256: sha256(url.href) });
          return route.abort('blockedbyclient');
        }));
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(() => {
          const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
          return readiness.state === 'RENDER_READY' && typeof AppState !== 'undefined' && AppState.mode === 'exam' && AppState.data.length > 0;
        }, null, { timeout: 40000 });
        const fontReadiness = await page.evaluate(async family => {
          await document.fonts.ready;
          const weights = [];
          for (const weight of [400, 700, 800]) {
            const faces = await document.fonts.load(`${weight} 12px "${family}"`, '한글 ABC 123');
            weights.push({ weight, loadedFaces: faces.length, allLoaded: faces.length > 0 && faces.every(face =>
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family && face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        await routeLifecycle.drain();
        routeLifecycle.assertSettled();
        const respondingWeights = [...fontState.fontResources.keys()].map(file => fontWeights.get(file));
        assert(fontState.fontResources.has(FONT_STYLESHEET) && fontReadiness.weights.every(row =>
          respondingWeights.filter(weight => weight === row.weight).length >= row.loadedFaces),
          'UI_FONT_RESPONSES_REQUIRED');
        await page.waitForFunction(() => JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state === 'RENDER_READY', null, { timeout: 30000 });
        const technical = await page.evaluate(() => ({
          mode: AppState.mode, questions: AppState.data.length, pages: document.querySelectorAll('#print-area .page').length,
          readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
          imagesComplete: [...document.querySelectorAll('#print-area img')].every(image => image.complete && image.naturalWidth > 0),
          mathErrors: document.querySelectorAll('#print-area mjx-merror,#print-area [data-mjx-error]').length,
          unrenderedMath: window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')),
          mathJaxSource: window.__AP_MATHJAX_SOURCE__,
          solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length
        }));
        assertTechnicalState(technical, inputs.items.find(item => item.sourceRef.path === sourcePath).expectedBankCount);
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const capture = await A.captureClosedSvg7ProblemTiles({ root, expectedCommit, item, viewport, surface: 'PROBLEM', mode: 'exam', page, target, file: path.join(out, screenshotPath),
            onInitialFrame: frame => { assert(roleDiagnostics.length < 14, 'UI_SVG7_DIAGNOSTIC_LIMIT');
              roleDiagnostics.push({ key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name, frame }); } });
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        casesCompleted = true;
      } catch (error) {
        caseFailure = error;
        throw error;
      } finally {
        await H.closeStudentContext(page, context, () => {
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assertCompletedResults(results, inputs, manifest, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, roleCaptureHelperRef, inputs.identityRef, inputs.sourceTransportReceiptRef, inputs.staticEvidenceRef, inputs.priorStaticEvidenceRef, inputs.engineRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
    return writeProof('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  } catch (error) {
    writeProof('FAIL', /^UI_[A-Z0-9_]+$/.test(error.message) ? error.message : 'UI_BROWSER_CHECK_FAILED');
    throw error;
  } finally {
    clearTimeout(watchdog);
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}


async function main() {
  const args = process.argv.slice(2);
  assert(args.length === 2 && args[0] === '--output' && typeof args[1] === 'string' &&
    path.isAbsolute(args[1]) && !/[\x00-\x1f\x7f]/.test(args[1]), 'UI_SVG7_ARGUMENTS');
  const root = process.cwd(), out = checkedOutput(root, args[1]);
  const reader = createGitReader(root), checkout = checkoutEvidence(reader.commit);
  const proof = await inspectStudentUi({ root, out, expectedCommit: checkout.expectedCheckoutCommit,
    githubEventCommit: checkout.githubEventCommit, executablePath: process.env.CHROME_BIN });
  console.log(JSON.stringify({ status: proof.status, logicalCases: proof.results.length,
    screenshotArtifacts: proof.screenshotArtifactCount, checkoutCommit: proof.checkoutCommit,
    newParentApprovals: 0, releaseGate: proof.releaseGate }));
}
module.exports = { MANIFEST_PATH, CHECKER_PATH, SHARED_CHECKER_PATH, SHARED_CHECKER_SHA256, ROLE_CAPTURE_PATH, ROLE_CAPTURE_SHA256, IDENTITY_PATH, SCHEMA,
  EXPECTED_MANIFEST_SHA256, EXPECTED_ITEMS_SHA256, VIEWPORTS, SEALED, ownSnapshot, validateManifest, requireSealedManifest, checkoutEvidence, loadQuestions, assertBoundQuestion, readBound, readHistoricalBound, validateEmbeddedOriginal, assertOriginOnlyDelta, validateRevisionStatic, readRevisionStatic, preflight, assertTechnicalState, assertCompletedResults, checkedOutput };
if (require.main === module) main().catch(error => {
  const message = String(error?.message || ''), code = message.split('\n')[0];
  console.error(JSON.stringify({ schemaVersion: SCHEMA, status: 'FAIL', newParentApprovals: 0,
    releaseGate: 'PENDING_ACTUAL_STUDENT_UI', failureCode: /^UI_[A-Z0-9_]+$/.test(code) ? code : 'UI_SVG7_PREFLIGHT_FAILED',
    errorMessageSha256: sha256(message) }));
  process.exitCode = 1;
});
