const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const operations = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/operations.js'), 'utf8');
const workerIndex = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/index.js'), 'utf8');
const wrangler = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/wrangler.jsonc'), 'utf8');
const memoClient = fs.readFileSync(path.join(root, 'apmath/js/memo.js'), 'utf8');

function loadAutoCompleteFunction() {
  const start = operations.indexOf('function todaySeoul');
  const end = operations.indexOf('function pickText', start);
  assert.ok(start >= 0 && end > start, 'auto-complete helper source must exist');
  const context = { Date, Number };
  vm.createContext(context);
  vm.runInContext(operations.slice(start, end).replace('export async function', 'async function'), context);
  return context.autoCompleteExpiredOperationMemos;
}

test('한국 날짜가 다음 날이 되면 그보다 이른 미완료 메모를 완료 처리한다', async () => {
  const autoComplete = loadAutoCompleteFunction();
  let sql = '';
  let boundDate = '';
  const env = {
    DB: {
      prepare(statement) {
        sql = statement;
        return {
          bind(value) {
            boundDate = value;
            return { run: async () => ({ meta: { changes: 2 } }) };
          }
        };
      }
    }
  };

  const result = await autoComplete(env, new Date('2026-08-10T15:05:00.000Z'));

  assert.equal(boundDate, '2026-08-11');
  assert.equal(result.completed, 2);
  assert.match(sql, /COALESCE\(is_done, 0\) = 0/);
  assert.match(sql, /DATE\(memo_date\) < DATE\(\?\)/);
});

test('일반 선생님의 조회 보정은 본인 및 공용 메모 범위로 제한된다', async () => {
  const autoComplete = loadAutoCompleteFunction();
  let bound = [];
  const env = {
    DB: {
      prepare() {
        return {
          bind(...values) {
            bound = values;
            return { run: async () => ({ meta: { changes: 1 } }) };
          }
        };
      }
    }
  };

  await autoComplete(env, new Date('2026-08-10T15:05:00.000Z'), '김선생');
  assert.deepEqual(bound, ['2026-08-11', '김선생']);
});

test('날짜 변경 동기화가 실패하면 다음 검사에서 다시 시도한다', async () => {
  let nowMs = Date.parse('2026-08-10T14:59:00.000Z');
  class FakeDate extends Date {
    constructor(...args) { super(args.length ? args[0] : nowMs); }
    static now() { return nowMs; }
  }
  let requests = 0;
  const context = {
    Date: FakeDate,
    Promise,
    Array,
    Error,
    console: { error() {} },
    api: { get: async () => (++requests === 1 ? {} : { operation_memos: [] }) },
    state: { db: { operation_memos: [{ id: 'old' }] } },
    getSession: () => ({ id: 'teacher' }),
    document: { getElementById: () => null },
    appHistoryState: { currentView: null },
    renderTodoMemoRows: () => ''
  };
  vm.createContext(context);
  const start = memoClient.indexOf('let todoMemoLastKstDate');
  const end = memoClient.indexOf("if (typeof window !== 'undefined'", start);
  vm.runInContext(memoClient.slice(start, end), context);

  nowMs = Date.parse('2026-08-10T15:01:00.000Z');
  await context.syncTodoMemosAfterKstDateChange();
  await context.syncTodoMemosAfterKstDateChange();

  assert.equal(requests, 2);
  assert.deepEqual(context.state.db.operation_memos, []);
});

test('자동 완료는 매일 자정 직후와 데이터 조회 시 모두 실행된다', () => {
  assert.match(wrangler, /"5 15 \* \* \*"/, '00:05 KST daily cron must be configured');
  assert.match(workerIndex, /async scheduled[\s\S]*autoCompleteExpiredOperationMemos\(env, scheduledAt\)/);
  assert.match(workerIndex, /if \(event\?\.cron !== '5 15 \* \* \*'\)/, 'daily memo cron must not run month-end archive');
  assert.match(workerIndex, /resource === 'initial-data'[\s\S]*await autoCompleteExpiredOperationMemos\(/);
  assert.match(operations, /if \(method === 'GET'\) \{\s*await autoCompleteExpiredOperationMemos\(/);
  assert.match(memoClient, /setInterval\(syncTodoMemosAfterKstDateChange, 60 \* 1000\)/);
  assert.match(memoClient, /visibilitychange/);
});
