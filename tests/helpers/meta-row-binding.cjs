// Re-derives, with the library the catalog builder uses, whether a metadata row is bound to the CURRENT stem and choices of its question.
// "row": the row is about this stem+choices (explanation/answer/figure edits do not matter); "type": only the problem-type judgment is bound; "": not confirmed.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const lib = require('../../archive/tools/meta-foundation/text-binding-lib.mjs');
const reader = require('../../archive/exam-source-reader.js');

const root = path.resolve(__dirname, '../..');
let metaByUid;
let rebinds;
const banks = new Map();

function questionOf(sourceFile, ordinal) {
  if (!banks.has(sourceFile)) {
    const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(scope);
    const source = fs.readFileSync(path.join(root, 'archive/exams', sourceFile), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
    vm.runInContext(source, scope, { timeout: 5000 });
    banks.set(sourceFile, reader.readQuestionArray(scope.window));
  }
  return banks.get(sourceFile)[Number(ordinal) - 1];
}

function bindingKindOf(record) {
  metaByUid ||= new Map(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8')).records
    .map(row => [row.questionUid, row]));
  rebinds ||= lib.loadRebinds(root);
  const meta = metaByUid.get(record.questionUid);
  const question = questionOf(record.sourceFile, record.sourceOrdinal);
  if (!meta || !question) return '';
  return lib.classifyMetaBinding({ meta, question, assignmentFingerprint: lib.contentFingerprint(question), rebinds });
}

module.exports = { bindingKindOf };
