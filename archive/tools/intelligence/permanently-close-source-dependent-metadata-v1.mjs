#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const parentPath = path.join(repo, 'archive', '_generated', 'intelligence', 'phase3', 'archive-db-source-unavailable-closure-v1.json');
const outputPath = path.join(repo, 'archive', '_generated', 'intelligence', 'phase3', 'archive-db-source-permanent-closure-v1.json');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const parent = JSON.parse(fs.readFileSync(parentPath, 'utf8'));

if (parent.status !== 'CLOSED_SOURCE_UNAVAILABLE') throw new Error(`unexpected parent status: ${parent.status}`);
if (parent.scope?.emptySchoolRecords !== 28 || parent.scope?.requiredFieldGapRecords !== 60) {
  throw new Error('permanent closure scope does not match the approved 28/60 queue');
}
if (parent.scope?.exactSourceBasenameMatches !== 0 || parent.scope?.exactTextSourceMatches !== 0) {
  throw new Error('direct source evidence exists; refusing permanent closure');
}
if (parent.closureRules?.dbWrites !== false || parent.closureRules?.productionJsWrites !== false) {
  throw new Error('parent closure contains unexpected writes');
}

const report = {
  schemaVersion: 'archive-db-source-permanent-closure-v1',
  generatedAt: new Date().toISOString(),
  status: 'PERMANENT_SOURCE_UNAVAILABLE',
  disposition: '원본이 확인되지 않은 28/60 source-dependent 메타데이터를 활성 queue에서 영구 제외한다. 빈 DB 필드와 감사 기록은 보존하며 값을 추정하거나 물리 파일을 삭제하지 않는다.',
  parentClosure: 'archive/_generated/intelligence/phase3/archive-db-source-unavailable-closure-v1.json',
  parentClosureDigest: parent.digest,
  scope: parent.scope,
  fieldOccurrenceCounts: parent.fieldOccurrenceCounts,
  scopeCounts: parent.scopeCounts,
  closureRules: {
    metadataValuesFabricated: false,
    dbWrites: false,
    productionJsWrites: false,
    questionIndexWrites: false,
    identityRuntimeWrites: false,
    activeQueueRemoved: true,
    reopenOnlyWhen: 'never',
    physicalArchiveDeletion: false,
    auditLedgerRetained: true,
    contextualMatchesAccepted: false,
  },
  rows: parent.rows.map(row => ({
    file: row.file,
    scope: row.scope,
    field: row.field,
    status: 'PERMANENT_SOURCE_UNAVAILABLE',
    reason: 'source_deleted_or_unavailable_by_policy',
  })),
};

report.digest = sha256(JSON.stringify(report));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  output: path.relative(repo, outputPath).replaceAll('\\', '/'),
  status: report.status,
  emptySchoolRecords: report.scope.emptySchoolRecords,
  requiredFieldGapRecords: report.scope.requiredFieldGapRecords,
  closedFieldOccurrences: report.scope.closedFieldOccurrences,
  activeQueueRemoved: report.closureRules.activeQueueRemoved,
  physicalArchiveDeletion: report.closureRules.physicalArchiveDeletion,
  digest: report.digest,
}, null, 2));
