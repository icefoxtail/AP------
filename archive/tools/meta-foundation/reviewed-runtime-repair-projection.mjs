export function applyReviewedRepairProjection({ runtimes, questionUid, packId, sourceStatus, record, existingRecordInPackScope = false, recordInPackScope = false }) {
  if (sourceStatus !== "VERIFIED") {
    const target = runtimes.get(packId);
    if (!target) throw new Error(`REPAIR target runtime pack missing: ${packId}`);
    const existing = target.runtime.records.find((row) => row.questionUid === questionUid);
    if (existing && existingRecordInPackScope) {
      return { promoted: false, preserved: true, affectedPackIds: [packId], removedFromPackIds: [] };
    }
    if (!existing) {
      return {
        promoted: false,
        preserved: false,
        affectedPackIds: recordInPackScope ? [] : [packId],
        removedFromPackIds: []
      };
    }

    target.runtime.records = target.runtime.records.filter((row) => row.questionUid !== questionUid);
    return {
      promoted: false,
      preserved: false,
      affectedPackIds: [packId],
      removedFromPackIds: [packId]
    };
  }

  const target = runtimes.get(packId);
  if (!target) throw new Error(`REPAIR target runtime pack missing: ${packId}`);
  const positions = [];
  for (const [index, row] of target.runtime.records.entries()) {
    if (row.questionUid === questionUid) positions.push(index);
  }
  if (positions.length > 1) throw new Error(`duplicate UID within runtime pack: ${questionUid}`);
  if (positions.length) Object.assign(target.runtime.records[positions[0]], record);
  else target.runtime.records.push(record);
  target.runtime.records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en"));

  return { promoted: true, preserved: false, affectedPackIds: [packId], removedFromPackIds: [] };
}
