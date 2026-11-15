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
