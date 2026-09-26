import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { commonRoot, ensure, id } from './common.mjs';

export async function acquireLease(repo, { python = process.env.APMATH_PYTHON || 'python', root = commonRoot(repo), runId = id() } = {}) {
  const ownerToken = id();
  const child = spawn(python, ['-B', fileURLToPath(new URL('./lease.py', import.meta.url)), '--root', root, '--owner', ownerToken, '--parent', String(process.pid), '--run-id', runId], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  let live = true, stderr = '';
  child.stderr.on('data', data => { stderr += data; });
  child.stdin.on('error', () => { live = false; });
  child.on('exit', () => { live = false; });
  const ready = await new Promise((resolve, reject) => {
    const lines = createInterface({ input: child.stdout });
    lines.once('line', line => { lines.close(); try { resolve(JSON.parse(line)); } catch (e) { reject(e); } });
    child.once('error', reject);
    child.once('exit', code => { if (code !== 2) reject(new Error(`LEASE_HELPER_EXIT:${code}:${stderr}`)); });
  });
  if (ready.status !== 'ACQUIRED') return { status: ready.status };
  const assert = () => {
    ensure(live && child.exitCode === null, 'LEASE_LOST');
    const lease = JSON.parse(fs.readFileSync(path.join(root, 'lease.json'), 'utf8'));
    ensure(lease.ownerToken === ownerToken && lease.fencingToken === ready.fencingToken && !lease.releasedAt, 'LEASE_FENCED');
  };
  const heartbeat = setInterval(() => { if (live) child.stdin.write('heartbeat\n'); }, 15000);
  heartbeat.unref();
  return { status: 'ACQUIRED', runId, ownerToken, fencingToken: ready.fencingToken, assert,
    async release() {
      clearInterval(heartbeat);
      if (!live) return;
      const done = new Promise(resolve => child.once('exit', resolve));
      child.stdin.end('release\n'); await done;
    } };
}
