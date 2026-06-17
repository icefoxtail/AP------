const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cumulativeSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'cumulative.js'), 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `${name} should exist`);
  const nextFunction = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, nextFunction === -1 ? source.length : nextFunction);
}

const presentMeta = extractFunction(cumulativeSource, 'isCumulativeAttendancePresentMeta');
assert.match(
  presentMeta,
  /countMakeupAsPresent\s*=\s*options\.countMakeupAsPresent\s*!==\s*false/,
  'makeup tags must be opt-out from present counting'
);
assert.match(
  presentMeta,
  /countMakeupAsPresent\s*&&\s*!!meta\?\.hasMakeup/,
  'makeup tags should only count as present when the caller allows it'
);

const cellRenderer = extractFunction(cumulativeSource, 'renderAttendanceCellContent');
assert.match(
  cellRenderer,
  /isCumulativeAttendancePresentMeta\(meta,\s*\{\s*countMakeupAsPresent:\s*isClassDay\s*\}\)/,
  'monthly ledger cells should not turn non-class-day makeup tags into attendance circles'
);

const printCell = extractFunction(cumulativeSource, 'getAttendanceLedgerPrintCell');
assert.match(
  printCell,
  /isCumulativeAttendancePresentMeta\(meta,\s*\{\s*countMakeupAsPresent:\s*isClassDay\s*\}\)/,
  'print ledger cells should follow the same non-class-day makeup display contract'
);

console.log('attendance ledger makeup display contract passed');
