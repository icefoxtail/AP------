#!/usr/bin/env node
'use strict';
// The one text form of archive/data/item-4slot-index.json: every top-level key in its own order on its own line; each row of
// `files`, `records` and `pending`, and each dictionary version of `terms`, on a line of its own. Same content and key order
// as the old single-line form (JSON.parse gives the identical object), only the line breaks differ. A registration that
// changes a few rows then changes a few lines in git instead of storing a new 20 MB single-line blob.
// Every writer and every "did the file change?" comparison goes through item4SlotIndexText (build-4slot-runtime.cjs serialize()).
// CLI: node tools/4slot/item-4slot-index-format.cjs [--check|--write] [path]   (default path: the committed index)
const json = value => JSON.stringify(value) ?? 'null';
function item4SlotIndexText(doc) {
  const parts = [];
  for (const key of Object.keys(doc)) {
    const value = doc[key];
    if (value === undefined) continue; // JSON.stringify drops such a key too
    let text;
    if (Array.isArray(value) && value.length) text = `[\n${value.map(row => `    ${json(row)}`).join(',\n')}\n  ]`;
    else if (key === 'terms' && value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length)
      text = `{\n${Object.keys(value).map(version => `    ${json(version)}: ${json(value[version])}`).join(',\n')}\n  }`;
    else text = json(value);
    parts.push(`  ${json(key)}: ${text}`);
  }
  return `{\n${parts.join(',\n')}\n}\n`;
}
module.exports = { item4SlotIndexText, INDEX_PATH: 'archive/data/item-4slot-index.json' };
if (require.main === module) {
  const fs = require('node:fs'), path = require('node:path');
  const args = process.argv.slice(2), mode = args.includes('--write') ? 'write' : 'check';
  const file = path.resolve(args.find(a => !a.startsWith('--')) || path.join(__dirname, '../..', module.exports.INDEX_PATH));
  const raw = fs.readFileSync(file, 'utf8'), text = item4SlotIndexText(JSON.parse(raw));
  if (raw === text) console.log('item-4slot-index: already in the row-per-line form');
  else if (mode === 'write') { fs.writeFileSync(file + '.tmp', text); fs.renameSync(file + '.tmp', file); console.log('item-4slot-index: rewritten in the row-per-line form'); }
  else { console.error('item-4slot-index: not in the row-per-line form (run with --write)'); process.exitCode = 1; }
}
