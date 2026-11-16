'use strict';
// Reuse a published, independently inspected image replacement for selected
// existing 4slot vectors. The original full compact and every other row remain.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const P = require('./partial-submission.cjs');
const reviewed = require('./rebind-reviewed-partial.cjs');
const {sourceNumber} = require('./exam-items.cjs');

const INPUT_SCHEMA = 'archive-4slot-existing-typed-v2-renderer-input-v1';
const ACCEPTANCE_SCHEMA = 'archive-4slot-existing-typed-v2-renderer-acceptance-v1';
const RECEIPT_SCHEMA = 'archive-4slot-existing-typed-v2-renderer-receipt-v1';
const DESCRIPTOR_SCHEMA = 'archive-4slot-existing-typed-v2-renderer-binding-v1';
const DECISION = 'ACCEPT_EXISTING_TYPED_V2_RENDERER_FOUR_SLOT_REBIND';
const MARKER = 'currentRendererRebind';
const RECEIPTS = 'archive/data/item-4slot-renderer-receipts/v1/';
const PUBLIC = /^\.archive-meta-register\/evidence\/m3s2-[A-Za-z0-9_./-]+\.json$/;
const SOURCE = /^archive\/exams\/original\/middle\/m3\/2(?:mid|final)\/[^/]+\.js$/;
const eq = P.eq, hash = P.sha;
const fail = code => P.fail('EXISTING_RENDERER_V2_' + code);
const check = (ok, code) => { if (!ok) fail(code); };
const own = (o, k) => Object.hasOwn(o, k);
const delta = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])]
  .filter(k => !eq(a[k], b[k])).sort();
const fieldDigest = (q, field) => hash(P.stable({present: own(q, field), value: q[field] ?? null}));

function git(root, args) {
  try {
    return execFileSync('git', ['-C', root, ...args], {
      maxBuffer: 32 * 1024 * 1024, timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
function publicRef(root, ref) {
  P.keys(ref, ['path', 'sha256'], 'EXISTING_RENDERER_V2_PUBLIC_REFERENCE_FIELDS');
  check(PUBLIC.test(ref.path || '') && P.SHA.test(ref.sha256 || ''), 'PUBLIC_REFERENCE');
  const raw = fs.readFileSync(P.safe(root, ref.path));
  check(hash(raw) === ref.sha256, 'PUBLIC_REFERENCE_HASH');
  return {raw, data: JSON.parse(raw)};
}
function immutable(root, ref, {json = true} = {}) {
  check(ref && P.GIT.test(ref.commit || '') && P.SHA.test(ref.sha256 || ''), 'GIT_REFERENCE');
  P.safe(root, ref.path);
  const raw = git(root, ['show', ref.commit + ':' + ref.path]);
  check(hash(raw) === ref.sha256 && (!ref.gitBlobSha1 || P.blob(raw) === ref.gitBlobSha1), 'GIT_REFERENCE_BYTES');
  return {raw, data: json ? JSON.parse(raw) : null};
}
function exactGitRef(ref) {
  P.keys(ref, ['commit', 'path', 'sha256', 'gitBlobSha1'], 'EXISTING_RENDERER_V2_GIT_REFERENCE_FIELDS');
  check(P.GIT.test(ref.gitBlobSha1 || ''), 'GIT_BLOB_REQUIRED');
}
function one(rows, uid, ordinal) {
  const found = (rows || []).filter(r => r.questionUid === uid && (r.sourceOrdinal ?? r.ordinal) === ordinal);
  check(found.length === 1, 'UNIQUE_REVIEW_ROW');
  return found[0];
}
function sourceAt(root, ref, sourcePath, ordinal) {
  P.keys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'questionSha256'], 'EXISTING_RENDERER_V2_SOURCE_REFERENCE_FIELDS');
  check(ref.path === sourcePath && P.SHA.test(ref.questionSha256 || ''), 'SOURCE_REFERENCE');
  const raw = immutable(root, ref, {json: false}).raw, bank = P.loadBank(raw), question = bank[ordinal - 1];
  check(question && hash(P.stable(question)) === ref.questionSha256, 'SOURCE_QUESTION_HASH');
  return {raw, bank, question};
}
function verifyAssets(root, refs, question, sourceCommit, {live = false} = {}) {
  const paths = reviewed.assets(question);
  check(Array.isArray(refs) && eq(refs.map(r => r.path).sort(), paths), 'ASSET_DENOMINATOR');
  for (const ref of refs) {
    check(ref.commit === sourceCommit && ref.visuallyInspected === true &&
      P.GIT.test(ref.gitBlobSha1 || '') && P.SHA.test(ref.sha256 || ''), 'ASSET_REVIEW_REFERENCE');
    check(Object.keys(ref).every(k => ['commit', 'path', 'gitBlobSha1', 'sha256', 'visuallyInspected', 'renderSha256'].includes(k)), 'ASSET_REFERENCE_FIELDS');
    if (ref.renderSha256 != null) check(P.SHA.test(ref.renderSha256), 'ASSET_RASTER_HASH');
    const raw = immutable(root, ref, {json: false}).raw;
    if (live) {
      check(fs.readFileSync(P.safe(root, ref.path)).equals(raw), 'CURRENT_ASSET_BYTES');
      check(git(root, ['rev-parse', 'HEAD:' + ref.path]).toString().trim() === ref.gitBlobSha1, 'CURRENT_ASSET_HEAD');
    }
  }
  return refs.map(r => ({path: r.path, sha256: r.sha256, gitBlobSha1: r.gitBlobSha1}));
}
function existingReview(root, ref, uid, ordinal, sourcePath, priorSourceBlob, currentQuestion) {
  exactGitRef(ref);
  check(PUBLIC.test(ref.path || '') && ref.path.endsWith('.renderer-continuity.json'), 'CONTINUITY_PATH');
  const doc = immutable(root, ref).data;
  P.keys(doc, ['schemaVersion', 'scope', 'sourceArchiveFile', 'expectedQuestionCount', 'selectedUidCount',
    'newFullMathematicalQa', 'newReviewPassCount', 'newMetadataApprovals', 'newDifficultyJudgments', 'items'], 'EXISTING_RENDERER_V2_CONTINUITY_FIELDS');
  check(doc.schemaVersion === 'archive-reviewed-renderer-continuity-evidence-v1' &&
    doc.scope === 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER' &&
    doc.sourceArchiveFile === sourcePath.slice('archive/exams/'.length) &&
    doc.newFullMathematicalQa === false && doc.newReviewPassCount === 0 &&
    doc.newMetadataApprovals === 0 && doc.newDifficultyJudgments === 0 &&
    doc.selectedUidCount === doc.items?.length && new Set(doc.items.map(r => r.questionUid)).size === doc.items.length, 'CONTINUITY_SCOPE');
  const item = one(doc.items, uid, ordinal);
  P.keys(item, ['questionUid', 'sourceOrdinal', 'nativeReviewRef', 'nativeItemSha256', 'prefigureSourceRef',
    'currentSourceRef', 'independentReviewRef'], 'EXISTING_RENDERER_V2_CONTINUITY_ROW_FIELDS');
  P.keys(item.independentReviewRef, ['path', 'sha256'], 'EXISTING_RENDERER_V2_INDEPENDENT_REFERENCE_FIELDS');
  check(PUBLIC.test(item.independentReviewRef.path || ''), 'INDEPENDENT_PATH');
  const independentRef = {commit: ref.commit, ...item.independentReviewRef};
  const independent = immutable(root, independentRef).data;
  P.keys(independent, ['schemaVersion', 'scope', 'reviewer', 'decision', 'nativeReviewCommit',
    'prefigureCommit', 'currentCommit', 'counts', 'rows'], 'EXISTING_RENDERER_V2_INDEPENDENT_FIELDS');
  P.keys(independent.counts, ['selected', 'newFullMathApprovals', 'newMetadataApprovals',
    'newDifficultyApprovals', 'newReviewPassCount'], 'EXISTING_RENDERER_V2_INDEPENDENT_COUNT_FIELDS');
  check(independent.schemaVersion === 'archive-independent-current-renderer-review-v2' &&
    independent.scope === 'EXACT_RENDERER_METADATA_AND_TWO_IMAGE_CONTAINERS' &&
    typeof independent.reviewer === 'string' && independent.reviewer.trim() &&
    independent.decision === 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION' &&
    independent.counts.selected === independent.rows?.length &&
    new Set(independent.rows.map(r => r.questionUid)).size === independent.rows.length &&
    ['newFullMathApprovals', 'newMetadataApprovals', 'newDifficultyApprovals', 'newReviewPassCount']
      .every(k => independent.counts[k] === 0), 'INDEPENDENT_SCOPE');
  const row = one(independent.rows, uid, ordinal);
  P.keys(row, ['questionUid', 'sourceOrdinal', 'decision', 'visualInspectionPerformed', 'nativeReviewRef',
    'nativeItemSha256', 'nativeSourceRef', 'prefigureSourceRef', 'currentSourceRef', 'changedRendererFields',
    'fieldDeltaHashes', 'contentTransition', 'nonRendererFieldChanges', 'mathematicalStemBytesUnchanged',
    'choicesAnswerSolutionDifficultyUnchanged', 'assets', 'visualEvidence', 'observed'], 'EXISTING_RENDERER_V2_INDEPENDENT_ROW_FIELDS');
  check(row.decision === independent.decision && row.visualInspectionPerformed === true &&
    row.mathematicalStemBytesUnchanged === true && row.choicesAnswerSolutionDifficultyUnchanged === true &&
    eq(row.nonRendererFieldChanges, []) && typeof row.observed === 'string' && row.observed.trim() &&
    eq(row.nativeReviewRef, item.nativeReviewRef) && row.nativeItemSha256 === item.nativeItemSha256 &&
    eq(row.prefigureSourceRef, item.prefigureSourceRef) && eq(row.currentSourceRef, item.currentSourceRef) &&
    independent.nativeReviewCommit === row.nativeReviewRef.commit &&
    independent.prefigureCommit === row.prefigureSourceRef.commit && independent.currentCommit === row.currentSourceRef.commit,
  'INDEPENDENT_ROW_BINDING');
  P.keys(row.nativeReviewRef, ['commit', 'path', 'sha256'], 'EXISTING_RENDERER_V2_NATIVE_REFERENCE_FIELDS');
  check(/^docs\/operations\/m3-s2-meta-full-20261114\/exams\/E\d{3}\.meta\.json$/.test(row.nativeReviewRef.path), 'NATIVE_METADATA_PATH');
  const native = immutable(root, row.nativeReviewRef).data, nativeItem = one(native.items, uid, ordinal);
  check(native.schemaVersion === 'm3-s2-complete-semantic-review-v1' &&
    native.sourceArchiveFile === doc.sourceArchiveFile && hash(P.stable(nativeItem)) === row.nativeItemSha256 &&
    independent.reviewer !== native.author && native.sourceAfterBlob === row.nativeSourceRef?.gitBlobSha1 &&
    native.sourceAfterSha256 === row.nativeSourceRef?.sha256, 'NATIVE_METADATA_ROW');
  sourceAt(root, row.nativeSourceRef, sourcePath, ordinal);
  const before = sourceAt(root, row.prefigureSourceRef, sourcePath, ordinal), current = sourceAt(root, row.currentSourceRef, sourcePath, ordinal);
  check(doc.expectedQuestionCount === before.bank.length && current.bank.length === before.bank.length &&
    row.prefigureSourceRef.gitBlobSha1 === priorSourceBlob && eq(currentQuestion, current.question), 'SELECTED_CURRENT_QUESTION');
  const fields = delta(before.question, current.question);
  check(fields.includes('image') && fields.every(f => ['image', 'imageSize'].includes(f)) &&
    typeof current.question.image === 'string' && current.question.image &&
    eq(fields, row.changedRendererFields) && eq(row.fieldDeltaHashes, fields.map(field => ({field,
      beforeSha256: fieldDigest(before.question, field), afterSha256: fieldDigest(current.question, field)}))), 'IMAGE_FIELDS_ONLY');
  if (fields.includes('imageSize')) check(typeof current.question.imageSize === 'string' &&
    /^[a-z0-9_-]{1,32}$/.test(current.question.imageSize), 'IMAGE_SIZE_TOKEN');
  P.keys(row.contentTransition, ['kind', 'beforeSha256', 'afterSha256'], 'EXISTING_RENDERER_V2_CONTENT_TRANSITION_FIELDS');
  check(row.contentTransition.kind === 'UNCHANGED' && typeof before.question.content === 'string' &&
    before.question.content === current.question.content && row.contentTransition.beforeSha256 === hash(before.question.content) &&
    row.contentTransition.afterSha256 === hash(current.question.content), 'UNCHANGED_STEM');
  P.keys(row.assets, ['before', 'current'], 'EXISTING_RENDERER_V2_ASSET_FIELDS');
  const beforeAssets = verifyAssets(root, row.assets.before, before.question, row.prefigureSourceRef.commit);
  const currentAssets = verifyAssets(root, row.assets.current, currentQuestion, row.currentSourceRef.commit, {live: true});
  P.keys(row.visualEvidence, ['contactSha256', 'renderedAssetCount'], 'EXISTING_RENDERER_V2_VISUAL_EVIDENCE_FIELDS');
  check(P.SHA.test(row.visualEvidence.contactSha256 || '') && row.visualEvidence.renderedAssetCount > 0 &&
    row.visualEvidence.renderedAssetCount === new Set([...beforeAssets, ...currentAssets].map(a => a.sha256)).size, 'COMPLETE_VISUAL_EVIDENCE');
  return {independentRef, independentRowSha256: hash(P.stable(row)), originalMetadataNativeRef: row.nativeReviewRef,
    originalMetadataNativeItemSha256: row.nativeItemSha256, beforeWholeQuestionSha256: hash(P.stable(before.question)),
    currentWholeQuestionSha256: hash(P.stable(currentQuestion)), beforeAssets, currentAssets, changedFields: fields};
}

function derive(root, inputRef, acceptanceRef, {issuing = false} = {}) {
  root = path.resolve(root);
  const {raw: inputRaw, data: d} = publicRef(root, inputRef), {raw: acceptanceRaw, data: a} = publicRef(root, acceptanceRef);
  P.keys(d, ['schemaVersion', 'requestId', 'author', 'preparedAtUtc', 'source', 'dictionary', 'priorCompact',
    'expectedCompactSha256', 'scope', 'items', 'newSemanticApproval', 'newMathQa', 'sourceChanges'], 'EXISTING_RENDERER_V2_INPUT_FIELDS');
  check(d.schemaVersion === INPUT_SCHEMA && /^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(d.requestId || '') &&
    typeof d.author === 'string' && d.author.trim() && Number.isFinite(Date.parse(d.preparedAtUtc)) &&
    d.newSemanticApproval === 0 && d.newMathQa === 0 && d.sourceChanges === 0, 'INPUT_SCHEMA');
  P.keys(a, ['schemaVersion', 'author', 'reviewer', 'decision', 'reviewedAtUtc', 'allowedScope', 'newSemanticApproval',
    'otherUidApprovals', 'newMathQa', 'sourceChanges', 'candidates'], 'EXISTING_RENDERER_V2_ACCEPTANCE_FIELDS');
  check(a.schemaVersion === ACCEPTANCE_SCHEMA && a.author === d.author && typeof a.reviewer === 'string' &&
    a.reviewer.trim() && a.reviewer !== d.author && a.decision === DECISION &&
    /^\d{4}-\d{2}-\d{2}T.*(?:Z|\+00:00)$/.test(a.reviewedAtUtc || '') &&
    Number.isFinite(Date.parse(a.reviewedAtUtc)) && a.allowedScope === 'FOUR_SLOT_VECTOR_ONLY' &&
    a.newSemanticApproval === 0 && a.otherUidApprovals === 0 && a.newMathQa === 0 && a.sourceChanges === 0 &&
    Array.isArray(a.candidates) && a.candidates.length && new Set(a.candidates.map(r => r.requestId)).size === a.candidates.length, 'ROOT_ACCEPTANCE');
  for (const candidate of a.candidates) {
    P.keys(candidate, ['requestId', 'inputSha256'], 'EXISTING_RENDERER_V2_ACCEPTED_INPUT_FIELDS');
    check(P.SHA.test(candidate.inputSha256 || ''), 'ACCEPTED_INPUT_HASH');
  }
  check(a.candidates.filter(r => r.requestId === d.requestId && r.inputSha256 === hash(inputRaw)).length === 1, 'EXACT_ROOT_ACCEPTED_INPUT');
  exactGitRef(d.source); check(SOURCE.test(d.source.path || ''), 'SOURCE_SCOPE');
  const sourceArchiveFile = d.source.path.slice('archive/exams/'.length), publishedSource = immutable(root, d.source, {json: false}).raw;
  const sourceRaw = fs.readFileSync(P.safe(root, d.source.path)), bank = P.loadBank(sourceRaw), acceptedBank = P.loadBank(publishedSource);
  check(git(root, ['rev-parse', 'HEAD:' + d.source.path]).toString().trim() === P.blob(sourceRaw), 'LIVE_SOURCE_HEAD');
  if (issuing) check(sourceRaw.equals(publishedSource), 'ISSUANCE_SOURCE_CAS');
  check(bank.length === acceptedBank.length, 'LIVE_SOURCE_DENOMINATOR');
  P.keys(d.dictionary, ['path', 'version', 'gitBlobSha1', 'sha256'], 'EXISTING_RENDERER_V2_DICTIONARY_FIELDS');
  check(/^docs\/architecture\/4slot\/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/.test(d.dictionary.path || ''), 'DICTIONARY_PATH');
  const dictionaryRaw = fs.readFileSync(P.safe(root, d.dictionary.path)), dictionary = JSON.parse(dictionaryRaw);
  check(hash(dictionaryRaw) === d.dictionary.sha256 && P.blob(dictionaryRaw) === d.dictionary.gitBlobSha1 &&
    dictionary.dictionaryVersion === d.dictionary.version &&
    git(root, ['rev-parse', 'HEAD:' + d.dictionary.path]).toString().trim() === d.dictionary.gitBlobSha1, 'DICTIONARY_BINDING');
  exactGitRef(d.priorCompact);
  const compactPath = 'archive/data/item-4slot/' + sourceArchiveFile.replace(/\.js$/, '.4slot.json');
  check(d.priorCompact.path === compactPath, 'PRIOR_COMPACT_PATH');
  const {raw: priorRaw, data: prior} = immutable(root, d.priorCompact);
  check(hash(priorRaw) === d.expectedCompactSha256 && !P.hasScope(prior) && !own(prior, MARKER) &&
    prior.schemaVersion === 'archive-meta-4slot-compact-v1' && prior.sourceArchiveFile === sourceArchiveFile &&
    prior.dictionaryVersion === dictionary.dictionaryVersion && P.GIT.test(prior.sourceGitBlobSha || '') &&
    Array.isArray(prior.items) && prior.items.length === bank.length, 'PRIOR_FULL_COMPACT');
  P.keys(d.scope, ['expectedQuestionCount', 'selected', 'untouched'], 'EXISTING_RENDERER_V2_SCOPE_FIELDS');
  const scope = P.partition(root, {scope: P.SCOPE, sourceArchiveFile, sourceGitBlobSha: P.blob(sourceRaw),
    expectedQuestionCount: d.scope.expectedQuestionCount, selected: d.scope.selected, unsubmitted: d.scope.untouched}, {bank, sourceRaw});
  check(Array.isArray(d.items) && d.items.length === scope.selected.length, 'SELECTED_DENOMINATOR');
  const originalByNumber = new Map(prior.items.map(it => [it.ordinal, it]));
  check(originalByNumber.size === bank.length && bank.every(q => originalByNumber.has(sourceNumber(q))), 'ORIGINAL_FULL_DENOMINATOR');
  const seen = new Set(), records = [];
  for (const row of d.items) {
    P.keys(row, ['questionUid', 'sourceOrdinal', 'sourceQuestionNo', 'priorCompactItemSha256', 'nativeFourSlot',
      'nativeRowSha256', 'rendererContinuity'], 'EXISTING_RENDERER_V2_SELECTED_ROW_FIELDS');
    const tuple = scope.selected.find(r => r.questionUid === row.questionUid && r.sourceOrdinal === row.sourceOrdinal && r.sourceQuestionNo === row.sourceQuestionNo);
    check(tuple && !seen.has(row.questionUid), 'SELECTED_IDENTITY'); seen.add(row.questionUid);
    const q = bank[row.sourceOrdinal - 1], original = originalByNumber.get(tuple.displayNumber);
    check(!own(original, 'registrationHold') && hash(P.stable(original)) === row.priorCompactItemSha256 &&
      eq(q, acceptedBank[row.sourceOrdinal - 1]), 'SELECTED_CURRENT_AND_VECTOR_CAS');
    exactGitRef(row.nativeFourSlot);
    check(prior.evidence?.commit === row.nativeFourSlot.commit && prior.evidence?.path === row.nativeFourSlot.path &&
      prior.evidence?.sha256 === row.nativeFourSlot.sha256, 'ORIGINAL_COMPACT_NATIVE_REFERENCE');
    check(/^(?:docs\/operations\/m3-s2-meta-full-20261114|archive-work\/m3s2-4slot-current-20261115)\/exams\/E\d{3}\.4slot\.json$/.test(row.nativeFourSlot.path || ''), 'FOUR_SLOT_NATIVE_PATH');
    const native = immutable(root, row.nativeFourSlot).data, nativeItem = one(native.items, row.questionUid, row.sourceOrdinal);
    check(native.schemaVersion === 'archive-meta-4slot-v0' && native.sourceArchiveFile === sourceArchiveFile &&
      hash(P.stable(nativeItem)) === row.nativeRowSha256, 'FOUR_SLOT_NATIVE_ROW');
    const quoteBindings = reviewed.nativeBindings(nativeItem, q, original, dictionary);
    const renderer = existingReview(root, row.rendererContinuity, row.questionUid, row.sourceOrdinal,
      d.source.path, prior.sourceGitBlobSha, q);
    records.push({questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal, sourceQuestionNo: row.sourceQuestionNo,
      compactItemSha256: row.priorCompactItemSha256, nativeFourSlot: row.nativeFourSlot, nativeRowSha256: row.nativeRowSha256,
      rendererContinuity: row.rendererContinuity, quoteBindings, ...renderer});
  }
  records.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const receipt = {schemaVersion: RECEIPT_SCHEMA, requestId: d.requestId, source: d.source, dictionary: d.dictionary,
    priorCompact: d.priorCompact, originalSourceHeader: prior.sourceGitBlobSha, originalFullVectorSetSha256: hash(P.stable(prior.items)),
    scope: d.scope, publicEvidence: {input: inputRef, acceptance: acceptanceRef},
    acceptance: {author: d.author, reviewer: a.reviewer, decision: a.decision, reviewedAtUtc: a.reviewedAtUtc,
      inputSha256: hash(inputRaw), independentAcceptanceSha256: hash(acceptanceRaw), newSemanticApproval: 0, newMathQa: 0}, records};
  const receiptPath = RECEIPTS + d.requestId + '.json', receiptBytes = JSON.stringify(receipt, null, 2) + '\n';
  const descriptor = {schemaVersion: DESCRIPTOR_SCHEMA, receipt: {path: receiptPath, sha256: hash(receiptBytes)}};
  const output = {...prior, [MARKER]: descriptor};
  const originalText = require('./import-4slot.cjs').serialize(prior);
  const compactBytes = originalText.replace('  "items": [', '  "' + MARKER + '": ' + JSON.stringify(descriptor) + ',\n  "items": [');
  check(eq(JSON.parse(compactBytes), output), 'OUTPUT_DERIVATION');
  return {input: d, output, receipt, receiptPath, receiptBytes, compactPath, compactBytes,
    evidenceDigests: [inputRef, acceptanceRef], summary: {expectedQuestionCount: bank.length, selected: records.length,
      untouched: scope.unsubmitted.length, originalVectorsChanged: 0, sourceChanges: 0, newSemanticApproval: 0, newMathQa: 0}};
}
function importExistingRenderer({root, input, acceptance, expectedCompactSha256, write = false}) {
  const plan = derive(root, input, acceptance, {issuing: true});
  check(expectedCompactSha256 === plan.input.expectedCompactSha256, 'EXPLICIT_COMPACT_CAS');
  const dest = P.safe(root, plan.compactPath), receiptDest = P.safe(root, plan.receiptPath), current = fs.readFileSync(dest);
  const replay = current.toString() === plan.compactBytes;
  if (!replay) check(hash(current) === expectedCompactSha256, 'CURRENT_COMPACT_CAS');
  if (fs.existsSync(receiptDest)) check(fs.readFileSync(receiptDest, 'utf8') === plan.receiptBytes, 'IMMUTABLE_RECEIPT_CONFLICT');
  if (replay) check(fs.existsSync(receiptDest), 'REPLAY_RECEIPT_MISSING');
  const fresh = derive(root, input, acceptance, {issuing: true});
  check(eq(fresh.receipt, plan.receipt), 'INPUT_CHANGED_DURING_IMPORT');
  check(fs.readFileSync(dest).equals(current), 'COMPACT_CHANGED_DURING_IMPORT');
  if (write && !replay) for (const [file, bytes] of [[receiptDest, plan.receiptBytes], [dest, plan.compactBytes]]) {
    fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file + '.tmp', bytes); fs.renameSync(file + '.tmp', file);
  }
  return {status: 'PASS_EXISTING_TYPED_V2_RENDERER_REBIND', ...plan.summary, write, replay,
    compact: {path: plan.compactPath, sha256: hash(plan.compactBytes)}, receipt: {path: plan.receiptPath, sha256: hash(plan.receiptBytes)},
    output: plan.output, publicReceipt: plan.receipt};
}
function verifyPublished(root, compact) {
  check(!P.hasScope(compact), 'FULL_COMPACT_ONLY');
  P.keys(compact[MARKER], ['schemaVersion', 'receipt'], 'EXISTING_RENDERER_V2_DESCRIPTOR_FIELDS');
  const descriptor = compact[MARKER];
  check(descriptor.schemaVersion === DESCRIPTOR_SCHEMA &&
    new RegExp('^' + RECEIPTS.replaceAll('/', '\\/') + '[A-Za-z0-9_-]+\\.json$').test(descriptor.receipt?.path || '') &&
    P.SHA.test(descriptor.receipt?.sha256 || ''), 'DESCRIPTOR_TYPE');
  P.keys(descriptor.receipt, ['path', 'sha256'], 'EXISTING_RENDERER_V2_RECEIPT_REFERENCE_FIELDS');
  const raw = fs.readFileSync(P.safe(root, descriptor.receipt.path)); check(hash(raw) === descriptor.receipt.sha256, 'RECEIPT_HASH');
  const receipt = JSON.parse(raw);
  check(receipt.schemaVersion === RECEIPT_SCHEMA, 'RECEIPT_SCHEMA');
  P.keys(receipt.publicEvidence, ['input', 'acceptance'], 'EXISTING_RENDERER_V2_PUBLIC_EVIDENCE_FIELDS');
  const plan = derive(root, receipt.publicEvidence.input, receipt.publicEvidence.acceptance);
  check(eq(plan.output, compact) && eq(plan.receipt, receipt) && descriptor.receipt.path === plan.receiptPath, 'PUBLISHED_DERIVATION');
  return {byUid: new Map(receipt.records.map(r => [r.questionUid, r])), evidenceDigests: [descriptor.receipt, ...plan.evidenceDigests],
    selectedCount: receipt.records.length, descriptorSha256: hash(P.stable(descriptor))};
}
module.exports = {INPUT_SCHEMA, ACCEPTANCE_SCHEMA, RECEIPT_SCHEMA, DESCRIPTOR_SCHEMA, DECISION, MARKER, RECEIPTS,
  derive, importExistingRenderer, verifyPublished};
