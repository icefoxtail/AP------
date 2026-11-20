// Does a metadata field count as a conflict between the exam file's own value and the metadata row's value?
// Used by build-archive2-catalog.mjs (metadataConflicts of a catalog record) and tested on its own.
// The exam's embedded problemTypeKey/templateKey never count: a registered type judgment wins over the type written in the exam JS
// (2026-11-20; the written value is kept as typeApproval.examEmbeddedType). Every other field keeps the old rule.
export const TYPE_FIELDS_NEVER_CONFLICT = new Set(["problemTypeKey", "templateKey"]);

export function isMetadataConflict(field, sourceValue, value, { metaV2Sidecar = false } = {}) {
  if (TYPE_FIELDS_NEVER_CONFLICT.has(field)) return false;
  return sourceValue !== undefined && sourceValue !== null && String(sourceValue).trim() !== "" &&
    value !== undefined && JSON.stringify(sourceValue) !== JSON.stringify(value) && !metaV2Sidecar;
}
