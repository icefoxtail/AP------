import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

const workerSource = fs.readFileSync(
  new URL('../apmath/worker-backup/worker/index.js', import.meta.url),
  'utf8'
);

test('public inquiry initialization adds updated_at and backfills it from created_at', async () => {
  const start = workerSource.indexOf('async function ensurePublicInquiryColumn');
  const end = workerSource.indexOf('async function hashPublicInquiryIp', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const setup = new AsyncFunction('env', `${workerSource.slice(start, end)}\nreturn ensurePublicInquiriesTable;`);
  const columns = new Set(['id', 'created_at', 'source', 'phone_digits', 'status']);
  const statements = [];
  const env = {
    DB: {
      prepare(sql) {
        return {
          async all() {
            if (/PRAGMA table_info\(public_inquiries\)/i.test(sql)) {
              return { results: [...columns].map(name => ({ name })) };
            }
            return { results: [] };
          },
          async run() {
            statements.push(sql);
            const addedColumn = sql.match(/ALTER TABLE public_inquiries ADD COLUMN (\w+)/i)?.[1];
            if (addedColumn) columns.add(addedColumn);
            return { meta: { changes: 0 } };
          }
        };
      }
    }
  };

  const ensurePublicInquiriesTable = await setup(env);
  await ensurePublicInquiriesTable(env);

  assert.ok(columns.has('updated_at'));
  assert.ok(statements.some(sql => /ALTER TABLE public_inquiries ADD COLUMN updated_at TEXT/i.test(sql)));
  assert.ok(statements.some(sql => /SET updated_at = created_at\s+WHERE updated_at IS NULL AND created_at IS NOT NULL/i.test(sql)));
  assert.ok(!statements.some(sql => /ALTER TABLE public_inquiries ADD COLUMN created_at/i.test(sql)));
});

test('exam session ordering and date fallback tolerate NULL created_at', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(`
      CREATE TABLE exam_sessions (
        id TEXT PRIMARY KEY,
        exam_date TEXT,
        created_at DATETIME,
        updated_at DATETIME
      );
      INSERT INTO exam_sessions (id, exam_date, created_at, updated_at)
      VALUES ('legacy', NULL, NULL, '2026-10-01 10:00:00');
    `);
    const row = db.prepare(`
      SELECT id, COALESCE(NULLIF(exam_date, ''), created_at, updated_at, '') AS session_date
      FROM exam_sessions
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 1
    `).get();
    assert.equal(row.id, 'legacy');
    assert.equal(row.session_date, '2026-10-01 10:00:00');
  } finally {
    db.close();
  }
});
