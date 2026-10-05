#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireLease } from './lock.mjs';
import { commonRoot, ensure, id, atomicWrite } from './common.mjs';

const args = process.argv.slice(2), action = args.shift();
const option = name => { const at = args.indexOf(`--${name}`); return at < 0 ? null : args[at + 1]; };
const repo = path.resolve(option('repo') || fileURLToPath(new URL('../../..', import.meta.url)));
const directory = commonRoot(repo), ownerPath = path.join(directory, 'lease.json');
export function checkGuard(repo, runId) {
  const row = JSON.parse(fs.readFileSync(path.join(commonRoot(repo), 'lease.json'), 'utf8'));
  ensure(row.runId === runId && !row.releasedAt, 'RUN_DOES_NOT_OWN_GUARD');
  ensure(Date.now() / 1000 - row.heartbeatAt < 45, 'GUARD_HEARTBEAT_STALE');
  try { process.kill(row.pid, 0); process.kill(row.guardPid, 0); } catch { throw new Error('GUARD_PROCESS_NOT_ACTIVE'); }
  return row;
}
async function start() {
  const runId = option('run-id') || id(); ensure(/^[A-Za-z0-9_-]{1,120}$/.test(runId), 'INVALID_RUN_ID');
  const lease = await acquireLease(repo, { runId });
  if (lease.status !== 'ACQUIRED') { console.log(JSON.stringify({ status: lease.status })); return; }
  const activity = path.join(directory, `activity-${runId}.json`), stop = path.join(directory, `stop-${runId}.json`);
  atomicWrite(activity, JSON.stringify({ runId, at: Date.now() }));
  console.log(JSON.stringify({ status: 'ACQUIRED', runId, fencingToken: lease.fencingToken, pid: process.pid }));
  let closing = false;
  const close = async () => { if (closing) return; closing = true; clearInterval(timer); await lease.release(); };
  const timer = setInterval(() => {
    try {
      lease.assert();
      const latest = JSON.parse(fs.readFileSync(activity, 'utf8'));
      if (fs.existsSync(stop) || Date.now() - latest.at > 90 * 60000) close();
    } catch { close(); }
  }, 2000);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, close);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (action === 'start') await start();
    else {
      const runId = option('run-id'); ensure(/^[A-Za-z0-9_-]+$/.test(runId || ''), 'RUN_ID_REQUIRED');
      const row = checkGuard(repo, runId);
      if (action === 'heartbeat' || action === 'stop') atomicWrite(path.join(directory, `${action === 'stop' ? 'stop' : 'activity'}-${runId}.json`), JSON.stringify({ runId, at: Date.now() }));
      else ensure(action === 'check', 'UNKNOWN_GUARD_ACTION');
      console.log(JSON.stringify({ status: action === 'stop' ? 'STOP_REQUESTED' : 'GUARD_VALID', runId, fencingToken: row.fencingToken }));
    }
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', reason: error.message })); process.exitCode = 1; }
}
