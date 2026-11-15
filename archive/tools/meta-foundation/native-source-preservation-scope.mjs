// A smaller source-only release is an exact partition of an existing approval,
// never a new approval or a reconstructed/truncated prior receipt.
export const NATIVE_PRESERVATION_SUBSET_SCHEMA = 'archive-native-source-preservation-subset-v1';
const fail = message => { throw Error('sourceRebind subset: ' + message); };
const sameKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
const inventory = (rows, label) => {
  if (!Array.isArray(rows) || !rows.length) fail(label + ' inventory missing');
  const out = new Map(), ordinals = new Set();
  for (const row of rows) {
    if (typeof row?.questionUid !== 'string' || !row.questionUid || out.has(row.questionUid) ||
        !Number.isSafeInteger(row.sourceOrdinal) || row.sourceOrdinal < 1 || ordinals.has(row.sourceOrdinal))
      fail(label + ' UID/ordinal missing or duplicated');
    out.set(row.questionUid, row); ordinals.add(row.sourceOrdinal);
  }
  return out;
};

// Read the legacy full-exam shape as an immutable terminal ancestor. Do not
// manufacture partial scope fields or infer a full approval from a short array.
export function fullNativePreservationAncestor(receipt, expectedQuestionCount) {
  if (!receipt || ['scope', 'partialUidCount', 'expectedQuestionCount', 'registrationMode'].some(key => Object.hasOwn(receipt, key)) ||
      receipt.schemaVersion !== 'archive-reviewed-exam-meta-registration-v2' || receipt.metadataRegistrationStatus !== 'REGISTERED' ||
      receipt.approval?.type !== 'FINAL_QA' || receipt.approval.metadataReviewed !== true ||
      !String(receipt.approval.approvedBy || '').trim() || Object.hasOwn(receipt.approval, 'sourceRebind') ||
      receipt.newMetadataApprovals === 0 && receipt.preservedMetadataApprovals > 0 ||
      !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(receipt.requestId || '') ||
      !/^[a-f0-9]{64}$/.test(receipt.requestSha256 || '') || !/^[a-f0-9]{40}$/.test(receipt.sourceBlobSha1 || '') ||
      !/^[a-f0-9]{64}$/.test(receipt.sourceRawSha256 || '') || !String(receipt.examUid || '').trim() ||
      typeof receipt.sourceArchiveFile !== 'string' || !receipt.sourceArchiveFile.endsWith('.js'))
    fail('an unmodified terminal FULL FINAL_QA ancestor is required');
  const count = receipt.totalQuestions;
  if (!Number.isSafeInteger(count) || count < 1 || expectedQuestionCount !== undefined && count !== expectedQuestionCount)
    fail('full ancestor denominator differs from the actual exam');
  const records = inventory(receipt.appliedRecords, 'full metadata'), identities = inventory(receipt.appliedIdentityRecords, 'full identity'),
    runtimes = inventory(receipt.runtimeRecords, 'full runtime');
  if ([records, identities, runtimes].some(map => map.size !== count) ||
      receipt.appliedRecords.some((row, index) => row.sourceOrdinal !== index + 1))
    fail('full ancestor requires complete contiguous 1..N inventories');
  for (const [uid, row] of records) for (const value of [row, identities.get(uid), runtimes.get(uid)])
    if (!value || value.sourceArchiveFile !== receipt.sourceArchiveFile || value.sourceOrdinal !== row.sourceOrdinal)
      fail('full ancestor UID/source/ordinal inventories differ');
  return { kind: 'FULL_EXAM', count, expectedQuestionCount: count };
}

export function validateNativePreservationScope(spec, priorRecords, selectedItems) {
  const prior = inventory(priorRecords, 'prior'), selected = inventory(selectedItems, 'selected');
  for (const [uid, row] of selected) if (prior.get(uid)?.sourceOrdinal !== row.sourceOrdinal)
    fail('selected UID/ordinal is outside the original approval');
  if (!Object.hasOwn(spec || {}, 'selectedSubset')) {
    if (!sameKeys(spec, ['priorReceiptRef']) || selected.size !== prior.size)
      fail('exact prior selection or explicit excluded inventory required');
    return [];
  }
  const subset = spec.selectedSubset;
  if (!sameKeys(spec, ['priorReceiptRef', 'selectedSubset']) ||
      !sameKeys(subset, ['schemaVersion', 'excludedItems']) ||
      subset.schemaVersion !== NATIVE_PRESERVATION_SUBSET_SCHEMA || selected.size >= prior.size)
    fail('explicit strict subset contract required');
  const excluded = inventory(subset.excludedItems, 'excluded');
  if (selected.size + excluded.size !== prior.size) fail('selected/excluded denominator differs from prior approval');
  for (const [uid, row] of excluded) if (!sameKeys(row, ['questionUid', 'sourceOrdinal', 'reason']) ||
      row.reason !== 'CURRENT_SOURCE_REVIEW_REQUIRED' || selected.has(uid) ||
      prior.get(uid)?.sourceOrdinal !== row.sourceOrdinal)
    fail('excluded UID/ordinal/reason differs from exact prior complement');
  return [...excluded.values()];
}
