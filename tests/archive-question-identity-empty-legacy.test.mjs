import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createQuestionIdentityResolver } from '../archive/tools/intelligence/question-identity-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(
  path.join(root, 'archive/tools/intelligence/sync-question-identity-map-v1.mjs'),
  'utf8'
);

function extractFunction(name, signature) {
  const pattern = new RegExp(`function ${name}\\(${signature}\\) \\{[\\s\\S]*?\\n\\}`);
  const match = source.match(pattern)?.[0];
  assert.ok(match, `${name} lookup helper exists`);
  return new Function(`return (${match})`)();
}

const addArray = extractFunction('addArray', 'obj, key, value');
const sortObject = extractFunction('sortObject', 'obj');
const buildLookups = new Function(
  'addArray',
  'sortObject',
  `return (${extractFunction('buildLookups', 'records').toString()})`
)(addArray, sortObject);

test('empty source question numbers stay in identity records but out of legacy lookup indexes', () => {
  const sourceArchiveFile = 'original/middle/m3/sample.js';
  const records = [
    { questionUid: 'uid-1', legacyQKey: `${sourceArchiveFile}_`, sourceArchiveFile, sourceOrdinal: 1, sourceQuestionNo: '' },
    { questionUid: 'uid-2', legacyQKey: `${sourceArchiveFile}_`, sourceArchiveFile, sourceOrdinal: 2, sourceQuestionNo: '' },
    { questionUid: 'uid-3', legacyQKey: `${sourceArchiveFile}_7`, sourceArchiveFile, sourceOrdinal: 3, sourceQuestionNo: '7' },
    { questionUid: 'uid-4', legacyQKey: `${sourceArchiveFile}_7`, sourceArchiveFile, sourceOrdinal: 4, sourceQuestionNo: '7' },
  ];
  const lookup = buildLookups(records);
  const resolver = createQuestionIdentityResolver({ schemaVersion: 'question-identity-map-v1', lookup });

  assert.equal(Object.keys(lookup.byQuestionUid).length, records.length);
  assert.ok(lookup.bySourceFileAndOrdinal[sourceArchiveFile]['1']);
  assert.equal(lookup.byLegacyQKey[`${sourceArchiveFile}_`], undefined);
  assert.equal(lookup.bySourceFileAndQuestionNo[sourceArchiveFile][''], undefined);
  assert.equal(resolver.resolve({ sourceArchiveFile, sourceQuestionNo: '' }).status, 'INSUFFICIENT_IDENTITY_REFERENCE');

  assert.equal(lookup.byLegacyQKey[`${sourceArchiveFile}_7`].length, 2);
  assert.equal(
    resolver.resolve({ sourceArchiveFile, sourceQuestionNo: '7' }).status,
    'AMBIGUOUS_LEGACY_REFERENCE'
  );
});
