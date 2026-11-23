'use strict';
// 유사 시험지 이름 규칙을 "… 유사문제 2" → "… · 유사2"로 바꿔도(archive2-output.js displayTitle),
// 옛 이름("유사문제 2")으로 저장된 문제지는 계속 검증·열기·출제된다. 보이는 제목은 snapshot 해시·검증 입력이 아니다:
// Worker는 저장된 행의 제목과 snapshot에 든 제목을 비교하고(archive-saved-papers.js), 그 snapshot을 저장된 그대로 해시한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const core = require('../archive/archive2-core.js');
const source = require('../archive/archive2-source.js');
const { catalog } = require('./helpers/archive2-scope-harness.cjs');

const OLD_TITLE = '2025 강남여고 고1 1학기 기말고사 유사문제 2';
const NEW_TITLE = '2025 강남여고 고1 1학기 기말고사 · 유사2';

function assetResponse(url) {
  const pathname = decodeURIComponent(new URL(String(url)).pathname);
  const prefix = pathname.startsWith('/AP------/archive/') ? '/AP------/archive/' : pathname.startsWith('/AP------/docs/') ? '/AP------/docs/' : '';
  if (!prefix) return new Response('Not found', { status: 404 });
  const file = path.join(root, prefix === '/AP------/archive/' ? 'archive' : 'docs', pathname.slice(prefix.length));
  if (!fs.existsSync(file)) return new Response('Not found', { status: 404 });
  return new Response(fs.readFileSync(file), { status: 200 });
}
const env = { ARCHIVE_PUBLIC_BASE_URL: 'https://archive.test/AP------/archive', ARCHIVE2_ASSETS: { fetch: async url => assetResponse(url) } };

test('옛 "유사문제 2" 제목으로 저장된 문제지는 새 규칙 뒤에도 저장·검증되고, 새 제목으로 저장한 것도 같은 방식으로 통과한다', async () => {
  const { prepareSavedPaperBatch, readAndVerifySavedSnapshot, SAVED_PAPER_SCHEMA } =
    await import('../apmath/worker-backup/worker/helpers/archive-saved-papers.js');
  const record = catalog.records.find(row => row.automatic && !row.image && core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(record, 'need an approved BASIC record');
  const raw = source.evaluate(fs.readFileSync(path.join(root, 'archive/exams', record.sourceFile), 'utf8'), record.sourceFile)[record.sourceOrdinal - 1];
  const question = { ...raw, questionUid: record.questionUid, sourceArchiveFile: record.sourceFile, sourceOrdinal: record.sourceOrdinal, sourceQuestionNo: record.sourceQuestionNo, sourceFingerprint: record.sourceFingerprint };
  for (const field of core.META_FIELDS) if (record[field] !== undefined) question[field] = record[field];
  const selectionFilters = { grade: record.sourceGrade, primaryPaths: [core.pathKey(record, 4)], scopeQuestionUids: [record.questionUid] };
  const input = title => ({
    schema_version: SAVED_PAPER_SCHEMA, save_batch_id: '11111111-1111-4111-8111-111111111111', index_version: catalog.indexVersion,
    selection_filters: structuredClone(selectionFilters),
    papers: [{ part_index: 0, questions: [structuredClone(question)], meta: { title, qpp: 4, questionUids: [record.questionUid], printHeaderOptions: { title } } }],
  });
  const hashes = [];
  for (const title of [OLD_TITLE, NEW_TITLE]) {
    const prepared = await prepareSavedPaperBatch(env, input(title));
    const stored = { ...prepared.papers[0] };
    assert.equal(stored.title, title);
    const snapshot = await readAndVerifySavedSnapshot(stored);
    assert.equal(snapshot.meta.title, title, '저장된 제목은 그대로 남는다');
    assert.equal(snapshot.meta.printHeaderOptions.title, title);
    hashes.push(stored.snapshot_hash);
  }
  assert.notEqual(hashes[0], hashes[1], '제목은 저장된 snapshot의 일부일 뿐, 현재 displayTitle로 다시 계산되지 않는다');
  // 옛 제목으로 저장된 행은 행의 제목과 snapshot의 제목이 같을 때만 통과한다(다른 제목으로 바꿔치기하면 거부).
  const old = (await prepareSavedPaperBatch(env, input(OLD_TITLE))).papers[0];
  await assert.rejects(readAndVerifySavedSnapshot({ ...old, title: NEW_TITLE }), error => error.status === 409);
});
