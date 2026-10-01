import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workerSource = fs.readFileSync(
  new URL('../apmath/worker-backup/worker/index.js', import.meta.url),
  'utf8'
);

test('initial-data batches archive analysis lookups under the D1 variable limit and merges all rows', async () => {
  const start = workerSource.indexOf('          const questionReviewRows = [];');
  const end = workerSource.indexOf('          return new Response(JSON.stringify({', start);
  assert.notEqual(start, -1, 'initial-data archive lookup block should exist');
  assert.notEqual(end, -1, 'initial-data response should follow the archive lookup block');

  const lookupBlock = workerSource.slice(start, end);
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const lookup = new AsyncFunction('analysisArchiveFiles', 'env', `
    ${lookupBlock}
    return { questionReviewRows, analysisMetaRows };
  `);

  const queryCalls = [];
  const env = {
    DB: {
      prepare(sql) {
        return {
          bind(...params) {
            queryCalls.push({ sql, params });
            return {
              async all() {
                const column = sql.includes('exam_question_reviews') ? 'review' : 'meta';
                return { results: params.map(archive_file => ({ archive_file, column })) };
              }
            };
          }
        };
      }
    }
  };
  const candidates = Array.from({ length: 116 }, (_, index) => `archive-${index}.js`);
  const result = await lookup(candidates, env);

  assert.equal(queryCalls.length, 4, 'both tables should be queried once per 90-item batch');
  assert.ok(queryCalls.every(call => call.params.length <= 90));
  assert.equal(result.questionReviewRows.length, candidates.length);
  assert.equal(result.analysisMetaRows.length, candidates.length);
  assert.deepEqual(result.questionReviewRows.map(row => row.archive_file), candidates);
  assert.deepEqual(result.analysisMetaRows.map(row => row.archive_file), candidates);
});
