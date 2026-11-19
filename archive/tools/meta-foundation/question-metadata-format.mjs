// The one text form of archive/data/question_metadata.json: top-level keys in their own order, head keys pretty-printed
// with two spaces, `records` one compact record per line. Same content and key order as the old pretty form, but about 20% smaller:
// the pretty form reached GitHub's 100 MB file limit. Every writer and every "did the file change?" comparison uses this function.
export function questionMetadataText(doc) {
  const parts = Object.keys(doc).map(key => {
    if (key === 'records' && Array.isArray(doc.records) && doc.records.length)
      return `  "records": [\n${doc.records.map(record => `    ${JSON.stringify(record)}`).join(',\n')}\n  ]`;
    return `  ${JSON.stringify(key)}: ${JSON.stringify(doc[key], null, 2).replace(/\n/g, '\n  ')}`;
  });
  return `{\n${parts.join(',\n')}\n}\n`;
}
