import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY_MS = 24 * 60 * 60 * 1000;
const SIGNATURE_FIELDS = [
  'schedule_type',
  'title',
  'start_time',
  'end_time',
  'memo',
  'target_scope',
  'student_id'
];

function normalizeValue(value, trim = false) {
  const normalized = value == null ? '' : String(value);
  return trim ? normalized.trim() : normalized;
}

function normalizeDate(value) {
  const text = normalizeValue(value, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const [year, month, day] = text.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return null;
  return { text, timestamp };
}

function isCandidate(row) {
  if (Number(row?.is_deleted ?? 0) !== 0) return false;
  const id = normalizeValue(row?.id, true);
  const seriesId = normalizeValue(row?.series_id, true);
  return Boolean(id) && (!seriesId || seriesId === id);
}

function signatureFor(row) {
  return JSON.stringify(SIGNATURE_FIELDS.map(field =>
    normalizeValue(row?.[field], field === 'title')
  ));
}

function createSeriesId(timestamp, sequence) {
  const randomPart = Math.random().toString(36).slice(2, 8).padEnd(6, '0');
  return `srs_bf_${timestamp + sequence}_${randomPart}`;
}

export function buildSeriesBackfill(rows) {
  const groups = new Map();

  for (const row of Array.isArray(rows) ? rows : []) {
    if (!isCandidate(row)) continue;
    const date = normalizeDate(row.schedule_date);
    if (!date) continue;
    const signature = signatureFor(row);
    if (!groups.has(signature)) groups.set(signature, []);
    groups.get(signature).push({ row, date });
  }

  const results = [];
  const timestamp = Date.now();
  let sequence = 0;

  for (const entries of groups.values()) {
    entries.sort((a, b) =>
      a.date.timestamp - b.date.timestamp ||
      normalizeValue(a.row.id).localeCompare(normalizeValue(b.row.id))
    );

    let run = [];
    const flushRun = () => {
      if (run.length >= 2) {
        const firstDate = run[0].date.text;
        const lastDate = run.at(-1).date.text;
        results.push({
          seriesId: createSeriesId(timestamp, sequence++),
          seriesKind: 'range',
          seriesUntil: lastDate,
          ids: run.map(entry => normalizeValue(entry.row.id, true)),
          firstDate,
          lastDate
        });
      }
      run = [];
    };

    for (const entry of entries) {
      if (!run.length) {
        run.push(entry);
        continue;
      }
      const previous = run.at(-1);
      if (entry.date.timestamp - previous.date.timestamp === DAY_MS) {
        run.push(entry);
      } else {
        flushRun();
        run.push(entry);
      }
    }
    flushRun();
  }

  return results.sort((a, b) =>
    a.firstDate.localeCompare(b.firstDate) ||
    a.ids[0].localeCompare(b.ids[0])
  );
}

function stripJsonComments(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function loadDatabaseName(configPath) {
  const config = JSON.parse(stripJsonComments(readFileSync(configPath, 'utf8')));
  const database = config.d1_databases?.find(item => item.binding === 'DB') || config.d1_databases?.[0];
  if (!database?.database_name) throw new Error(`D1 database_name not found in ${configPath}`);
  return database.database_name;
}

function extractRows(payload) {
  const queue = Array.isArray(payload) ? [...payload] : [payload];
  while (queue.length) {
    const value = queue.shift();
    if (!value || typeof value !== 'object') continue;
    if (Array.isArray(value.results)) return value.results;
    queue.push(...Object.values(value).filter(item => item && typeof item === 'object'));
  }
  throw new Error('Wrangler JSON output did not contain a results array.');
}

function readRemoteRows(workerDir, configPath, databaseName) {
  const query = [
    'SELECT id, schedule_date, schedule_type, title, start_time, end_time, memo,',
    'target_scope, student_id, series_id, is_deleted',
    'FROM academy_schedules WHERE is_deleted=0'
  ].join(' ');
  let executable = 'wrangler';
  const args = [
    'd1', 'execute', databaseName,
    '--remote',
    '--json',
    '--config', configPath,
    '--command', query
  ];
  if (process.platform === 'win32') {
    const wranglerEntry = join(process.env.APPDATA || '', 'npm', 'node_modules', 'wrangler', 'bin', 'wrangler.js');
    if (!existsSync(wranglerEntry)) throw new Error(`Wrangler entrypoint not found: ${wranglerEntry}`);
    executable = process.execPath;
    args.unshift(wranglerEntry);
  }
  const result = spawnSync(executable, args, {
    cwd: workerDir,
    encoding: 'utf8',
    windowsHide: true
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `wrangler exited ${result.status}`).trim());
  }
  return extractRows(JSON.parse(result.stdout));
}

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function validateIds(ids) {
  for (const id of ids) {
    if (!/^(?:acs|srs)_[A-Za-z0-9_-]+$/.test(id)) {
      throw new Error(`Unsafe academy_schedules id: ${id}`);
    }
  }
}

function renderBackfillSql(series) {
  const statements = series.map(item => {
    validateIds(item.ids);
    const ids = item.ids.map(sqlLiteral).join(',');
    return [
      `-- ${item.firstDate} ~ ${item.lastDate} (${item.ids.length} rows)`,
      'UPDATE academy_schedules',
      `   SET series_id=${sqlLiteral(item.seriesId)}, series_kind='range', series_until=${sqlLiteral(item.seriesUntil)}, updated_at=DATETIME('now')`,
      ` WHERE id IN (${ids}) AND is_deleted=0;`
    ].join('\n');
  });
  return `${statements.join('\n\n')}\n`;
}

function renderRollbackSql(series) {
  const statements = series.map(item => {
    validateIds(item.ids);
    const ids = item.ids.map(sqlLiteral).join(',');
    return [
      `-- rollback ${item.firstDate} ~ ${item.lastDate} (${item.ids.length} rows)`,
      "UPDATE academy_schedules SET series_id=id, series_kind='single', series_until=NULL, updated_at=DATETIME('now')",
      ` WHERE id IN (${ids});`
    ].join('\n');
  });
  return `${statements.join('\n\n')}\n`;
}

function summarize(rows, series) {
  const byId = new Map(rows.map(row => [String(row.id), row]));
  const rowCount = series.reduce((sum, item) => sum + item.ids.length, 0);
  console.log(`묶일 시리즈 수: ${series.length}`);
  console.log(`대상 row 수: ${rowCount}`);
  if (!series.length) return;
  console.log('예시:');
  for (const item of series.slice(0, 5)) {
    const first = byId.get(item.ids[0]) || {};
    const signature = SIGNATURE_FIELDS
      .map(field => `${field}=${normalizeValue(first[field], field === 'title')}`)
      .join(', ');
    console.log(`- ${item.firstDate} ~ ${item.lastDate} / ${item.ids.length}건 / ${signature}`);
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const workerDir = join(rootDir, 'apmath', 'worker-backup', 'worker');
  const configPath = join(workerDir, 'wrangler.jsonc');
  const databaseName = loadDatabaseName(configPath);
  const rows = readRemoteRows(workerDir, configPath, databaseName);
  const series = buildSeriesBackfill(rows);

  summarize(rows, series);
  if (dryRun) return;

  const dateStamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const migrationDir = join(rootDir, 'migrations');
  const backfillPath = join(migrationDir, `${dateStamp}_academy_schedules_series_backfill.sql`);
  const rollbackPath = join(migrationDir, `${dateStamp}_academy_schedules_series_backfill_rollback.sql`);
  writeFileSync(backfillPath, renderBackfillSql(series), 'utf8');
  writeFileSync(rollbackPath, renderRollbackSql(series), 'utf8');
  console.log(`백필 SQL: ${backfillPath}`);
  console.log(`롤백 SQL: ${rollbackPath}`);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
