const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const start = source.indexOf('const ARCHIVE_SUBJECT_SYNONYM_GROUPS');
const end = source.indexOf('\nfunction onFilterChange()', start);

assert.notStrictEqual(start, -1, 'archive subject synonym definitions should exist');
assert.notStrictEqual(end, -1, 'archive synonym helpers should be before onFilterChange');

const context = { console };
vm.createContext(context);
vm.runInContext(source.slice(start, end), context, { filename: 'archive-search-synonyms.js' });

function matches(query, parts) {
  const terms = context.expandArchiveSearchSubjectTerms(query);
  const haystack = context.buildArchiveSearchHaystack(parts);
  return !terms.length || terms.some(term => haystack.includes(term));
}

assert(matches('수학1', ['대수']), '수학1 should match 대수');
assert(matches('수학로마자1', ['수1']), '수학로마자1 should match 수1');
assert(matches('대수', ['수학Ⅰ']), '대수 should match 수학Ⅰ');
assert(matches('수1', ['수학I']), '수1 should match 수학I');

assert(matches('수학2', ['미적분1']), '수학2 should match 미적분1');
assert(matches('수학로마자2', ['수2']), '수학로마자2 should match 수2');
assert(matches('미적분1', ['수학Ⅱ']), '미적분1 should match 수학Ⅱ');

assert(matches('미적분', ['미적분2']), '미적분 should match 미적분2');
assert(matches('미적분2', ['미적분']), '미적분2 should match 미적분');
assert(!matches('미적분', ['미적분1']), '미적분 should not match 미적분1');

console.log('archive subject synonym search contract passed');
