import assert from 'node:assert/strict';

const workerModule = await import('../apmath/worker-backup/worker/index.js');
const worker = workerModule.default;

function makeEnv() {
  const calls = [];
  const env = {
    DB: {
      prepare(sql) {
        calls.push({ type: 'prepare', sql });
        const result = {
          first: async () => null,
          all: async () => ({ results: [] }),
          run: async () => ({ meta: { changes: 0 } })
        };
        return {
          ...result,
          bind: () => result
        };
      },
      batch(statements) {
        calls.push({ type: 'batch', count: statements.length });
        return Promise.resolve([]);
      }
    },
    D1_BACKUP_WORKFLOW: {
      create: async () => {
        calls.push({ type: 'workflow.create' });
        return { id: 'workflow-instance-from-cloudflare' };
      }
    }
  };
  return { env, calls };
}

async function runScheduled(cron, scheduledTime) {
  const fixture = makeEnv();
  const pending = [];
  await worker.scheduled(
    { cron, scheduledTime },
    fixture.env,
    { waitUntil(promise) { pending.push(promise); } }
  );
  await Promise.all(pending);
  return fixture.calls;
}

const DAILY_MEMO_CRON = '5 15 * * *';
const MONTH_END_CRON = '0 0 28-31 * *';
const D1_BACKUP_CRON = '0 18 * * *';
const MONTH_END_UTC = Date.parse('2026-06-29T15:00:00.000Z');

const memoCalls = await runScheduled(DAILY_MEMO_CRON, MONTH_END_UTC);
assert.equal(memoCalls.filter(call => call.type === 'workflow.create').length, 0);
assert.equal(memoCalls.filter(call => /UPDATE operation_memos/.test(call.sql || '')).length, 1, 'memo cron must run memo auto-complete');
assert.equal(memoCalls.filter(call => /ap_timetable_month_snapshots/.test(call.sql || '')).length, 0, 'memo cron must not archive timetable');

const monthEndCalls = await runScheduled(MONTH_END_CRON, MONTH_END_UTC);
assert.equal(monthEndCalls.filter(call => call.type === 'workflow.create').length, 0);
assert.equal(monthEndCalls.filter(call => /UPDATE operation_memos/.test(call.sql || '')).length, 1, 'month-end cron must run memo auto-complete');
assert.ok(monthEndCalls.some(call => /INSERT INTO ap_timetable_month_snapshots/.test(call.sql || '')), 'month-end cron must archive timetable');

const backupCalls = await runScheduled(D1_BACKUP_CRON, Date.parse('2026-09-14T18:00:00.000Z'));
assert.equal(backupCalls.filter(call => call.type === 'workflow.create').length, 1, 'backup cron must create one Workflow instance');
assert.equal(backupCalls.filter(call => /UPDATE operation_memos/.test(call.sql || '')).length, 0, 'backup cron must not auto-complete memos');
assert.equal(backupCalls.filter(call => /ap_timetable_month_snapshots/.test(call.sql || '')).length, 0, 'backup cron must not archive timetable');

console.log('AP scheduled routing test passed');
