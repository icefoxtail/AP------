export function parseJsonObjectItems(items, fieldName) {
  if (!Array.isArray(items)) throw new Error('CODEX_APPSERVER_OUTPUT_ARRAY_REQUIRED:' + fieldName);
  return items.map((item, index) => {
    if (typeof item !== 'string') throw new Error('CODEX_APPSERVER_OUTPUT_ITEM_STRING_REQUIRED:' + fieldName + ':' + index);
    let parsed;
    try {
      parsed = JSON.parse(item);
    } catch {
      throw new Error('CODEX_APPSERVER_OUTPUT_ITEM_JSON_INVALID:' + fieldName + ':' + index);
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('CODEX_APPSERVER_OUTPUT_ITEM_OBJECT_REQUIRED:' + fieldName + ':' + index);
    }
    return parsed;
  });
}
