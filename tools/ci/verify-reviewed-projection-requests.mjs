#!/usr/bin/env node
// One read-only projection phase, preserving request order and refusal isolation.
// Inputs may be shared; each request still invokes the existing v2 verifier.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fork, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ProjectionPhaseIntegrityError, createProjectionPhase, projectionPhaseSummary,
  assertProjectionPhaseUnchanged, closeProjectionPhase } from '../../archive/tools/meta-foundation/reviewed-projection-phase.mjs';

const HERE = fileURLToPath(import.meta.url);
const V2 = 'archive-reviewed-exam-meta-register-request-v2';
const PROJECTED = new Set([V2, 'archive-finalqa-pinpoint-register-request-v1', 'archive-finalqa-nonpt-register-request-v1',
  'archive-difficulty5-register-request-v1', 'archive-basic-scope-rebind-request-v1', 'archive-basic-parent-correction-request-v1',
  'archive-binding-course-correction-request-v1', 'archive-binding-course-correction-request-v2']);
// This is a per-request failure bound, not an extension to the existing workflow
// step/job limits. Production does not accept an environment or CLI override.
export const REQUEST_TIMEOUT_MS = 10 * 60 * 1000;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const errorText = error => String(error?.message || error).replaceAll('\0', '\\0').slice(0, 500);
const integrity = message => new ProjectionPhaseIntegrityError(message);
function registrarRefusal(error) {
  const line = String(error?.stack || error).split(/\r?\n/).filter(value => /^(Uncaught )?[A-Za-z]*Error: /.test(value)).at(-1);
  return (line || 'consumer projection verification failed (exit status 1)').replaceAll('\0', '\\0').slice(0, 500);
}
function requestFile(root, file) {
  if (typeof file !== 'string' || !file || file.includes('\0')) throw integrity('invalid request path');
  const full = path.resolve(root, file);
  if (!full.startsWith(root + path.sep)) throw integrity('request path outside checkout');
  return full;
}
function cliError(result) {
  const output = String(result.stdout || '') + '\n' + String(result.stderr || '');
  const match = output.split(/\r?\n/).filter(line => /^(Uncaught )?[A-Za-z]*Error: /.test(line)).at(-1);
  return (match || `consumer projection verification failed (exit status ${result.status ?? result.signal ?? result.error?.code ?? 'UNKNOWN'})`).slice(0, 500);
}
class WorkerStopped extends Error {
  constructor(message, started) { super(message); this.name = 'ProjectionWorkerStopped'; this.started = started; }
}
class ProjectionWorker {
  constructor(root, snapshotSha256, workerPath, requestTimeoutMs) {
    this.requestTimeoutMs = requestTimeoutMs; this.output = ''; this.dead = false; this.pending = null;
    this.child = fork(workerPath, ['--worker', root, snapshotSha256], {
      cwd: root, stdio: ['ignore', 'pipe', 'pipe', 'ipc'], env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }
    });
    this.exit = new Promise(resolve => {
      const ended = () => { this.exited = true; resolve(); };
      this.child.once('exit', ended); this.child.once('error', ended);
    });
    const output = data => { this.output = (this.output + data.toString()).slice(-65536); };
    this.child.stdout.on('data', output); this.child.stderr.on('data', output);
    this.child.on('message', message => this.receive(message));
    this.child.on('error', error => this.stop(errorText(error)));
    this.child.on('exit', (code, signal) => this.stop(`consumer projection verification failed (exit status ${signal || code})`));
    this.ready = this.wait('ready');
  }
  wait(type, request = null) {
    if (this.dead || this.pending) return Promise.reject(integrity('invalid worker lifecycle'));
    return new Promise((resolve, reject) => {
      const pending = this.pending = { type, request, resolve, reject, started: false, timer: null };
      if (type === 'result') pending.timer = setTimeout(() => {
        if (this.pending !== pending) return;
        this.child.kill('SIGKILL');
        this.stop(`projection request timed out after ${this.requestTimeoutMs} ms`);
      }, this.requestTimeoutMs);
    });
  }
  settle(error, value) {
    const p = this.pending; this.pending = null;
    if (!p) return;
    clearTimeout(p.timer); if (error) p.reject(error); else p.resolve(value);
  }
  stop(message) {
    this.dead = true;
    if (this.pending) this.settle(new WorkerStopped(message, this.pending.started));
  }
  receive(message) {
    const p = this.pending;
    if (!p || !message || typeof message !== 'object') { this.child.kill('SIGKILL'); this.stop('invalid worker protocol'); return; }
    if (message.type === 'fatal') {
      this.settle(integrity(message.error || 'worker phase failed')); this.child.kill('SIGKILL'); this.dead = true; return;
    }
    if (message.type === 'start' && p.type === 'result' && !p.started && message.index === p.request.index &&
        message.request === p.request.request && message.sha256 === p.request.sha256) { p.started = true; return; }
    if (message.type !== p.type || p.type === 'result' && (!p.started || message.index !== p.request.index ||
        message.request !== p.request.request || typeof message.ok !== 'boolean' || !message.ok && typeof message.error !== 'string')) {
      this.settle(integrity('invalid/incomplete worker result')); this.child.kill('SIGKILL'); this.dead = true; return;
    }
    this.settle(null, message);
  }
  async verify(row) {
    const result = this.wait('result', row);
    this.child.send({ type: 'verify', ...row }); return result;
  }
  async close() {
    const result = this.wait('closed'); this.child.send({ type: 'close' });
    const answer = await result; if (this.child.connected) this.child.disconnect(); await this.exit; return answer;
  }
  async terminate() { if (!this.exited) this.child.kill('SIGKILL'); await this.exit; }
}

// workerPath/deadline injection is an in-process test seam; the production CLI
// always uses this exact file and the fixed ten-minute deadline above.
export async function verifyProjectionRequests({ root = process.cwd(), requests, workerPath = HERE,
  requestTimeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  root = fs.realpathSync(root);
  if (!Array.isArray(requests) || new Set(requests).size !== requests.length ||
      !Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs < 1) throw integrity('invalid phase arguments');
  const phase = createProjectionPhase(root), initial = projectionPhaseSummary(phase, root).snapshot;
  const report = { schemaVersion: 'archive-reviewed-projection-phase-report-v1', status: 'RUNNING',
    snapshot: initial, requestCount: requests.length, completedRequests: 0, workerCount: 0, workerPhases: [],
    cachedVerdicts: 0, checks: [], refusals: [], consumerCandidates: [] };
  let worker = null, phaseClosed = false;
  try {
    // The previous shell parsed schema outside the per-request refusal process.
    // Preserve that fail-closed behavior for malformed JSON/unreadable requests.
    const rows = requests.map((request, index) => {
      const bytes = fs.readFileSync(requestFile(root, request));
      return { index, request, sha256: sha(bytes), schema: JSON.parse(bytes).schemaVersion };
    });
    for (const row of rows) {
      let ok = true, error = null, failureKind = null;
      if (row.schema === V2) {
        if (!worker) {
          assertProjectionPhaseUnchanged(phase, root);
          worker = new ProjectionWorker(root, initial.sha256, workerPath, requestTimeoutMs);
          const ready = await worker.ready;
          if (ready.snapshotSha256 !== initial.sha256) throw integrity('worker began on another snapshot');
          report.workerCount++;
        }
        try {
          const result = await worker.verify(row); ok = result.ok; error = result.error || null;
          failureKind = ok ? null : 'REGISTRAR_REFUSAL';
        } catch (caught) {
          if (!(caught instanceof WorkerStopped) || !caught.started) throw caught;
          ok = false; failureKind = 'WORKER_STOPPED'; error = errorText(caught);
          report.workerPhases.push({ status: 'STOPPED', request: row.request, error, outputTail: worker.output });
          await worker.terminate(); worker = null;
          // A crash never licenses reuse of its partial state. A changed input
          // aborts the whole phase instead of becoming a request-level refusal.
          assertProjectionPhaseUnchanged(phase, root);
        }
      } else if (PROJECTED.has(row.schema)) {
        if (sha(fs.readFileSync(requestFile(root, row.request))) !== row.sha256) throw integrity('request bytes changed');
        const result = spawnSync(process.execPath, ['archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs',
          '--request', row.request, '--verify-projection'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28,
          timeout: REQUEST_TIMEOUT_MS, killSignal: 'SIGKILL' });
        ok = result.status === 0; if (!ok) { error = cliError(result); failureKind = 'REGISTRAR_REFUSAL'; }
      }
      report.checks.push({ request: row.request, schema: row.schema, requestSha256: row.sha256,
        status: ok ? (PROJECTED.has(row.schema) ? 'PASS' : 'SKIPPED_LEGACY_PROJECTION') : 'REFUSED', failureKind, ...(error ? { error } : {}) });
      report.completedRequests++;
      if (ok) report.consumerCandidates.push(row.request);
      else report.refusals.push({ request: row.request, error, stage: 'projection-verify' });
    }
    if (worker) {
      const closed = await worker.close();
      if (closed.summary?.snapshot?.sha256 !== initial.sha256 || closed.summary?.cachedVerdicts !== 0)
        throw integrity('worker closed without matching read-only proof');
      report.workerPhases.push({ status: 'CLOSED', ...closed.summary }); worker = null;
    }
    report.phase = closeProjectionPhase(phase, root); phaseClosed = true;
    report.status = report.refusals.length ? 'PASS_WITH_REQUEST_REFUSALS' : 'PASS';
    return report;
  } catch (error) {
    if (worker) { await worker.terminate(); worker = null; }
    report.status = 'FAIL'; report.error = errorText(error);
    if (!phaseClosed) {
      try { closeProjectionPhase(phase, root); } catch (closing) { report.integrityError = errorText(closing); }
      phaseClosed = true;
    }
    error.projectionReport = report; throw error;
  } finally { if (worker) await worker.terminate(); }
}

async function workerMain(root, expectedSha256) {
  if (!process.send || !/^[a-f0-9]{64}$/.test(expectedSha256 || '')) throw integrity('worker requires supervisor IPC');
  const phase = createProjectionPhase(root, expectedSha256);
  const { registerReviewedExamV2 } = await import('../../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  process.send({ type: 'ready', snapshotSha256: projectionPhaseSummary(phase, root).snapshot.sha256 });
  let busy = false;
  process.on('message', message => {
    try {
      if (busy || !message || !['verify', 'close'].includes(message.type)) throw integrity('invalid worker request');
      busy = true;
      if (message.type === 'close') {
        const summary = closeProjectionPhase(phase, root);
        process.send({ type: 'closed', summary }, () => { if (process.connected) process.disconnect(); }); return;
      }
      const { index, request, sha256 } = message;
      process.send({ type: 'start', index, request, sha256 });
      let ok = true, error = null;
      try {
        const bytes = fs.readFileSync(requestFile(root, request));
        if (sha(bytes) !== sha256) throw integrity('request bytes changed');
        const req = JSON.parse(bytes);
        if (req.schemaVersion !== V2) throw integrity('worker received another request schema');
        registerReviewedExamV2({ root, request: req, write: false, verifyProjection: true, projectionPhase: phase });
      } catch (caught) {
        if (caught instanceof ProjectionPhaseIntegrityError) throw caught;
        ok = false; error = registrarRefusal(caught);
      }
      busy = false; process.send({ type: 'result', index, request, ok, error });
    } catch (error) { process.send({ type: 'fatal', error: errorText(error) }, () => process.exit(1)); }
  });
}
function outside(root, file) {
  const full = path.resolve(file);
  if (full === root || full.startsWith(root + path.sep)) throw integrity('phase reports must be outside checkout');
  return full;
}
async function main() {
  const args = process.argv.slice(2), root = fs.realpathSync(process.cwd());
  if (args[0] === '--worker') { if (args.length !== 3) throw integrity('worker arguments'); return workerMain(args[1], args[2]); }
  if (args[0] !== '--report-file' || args[2] !== '--refusals-file' || args[4] !== '--candidates-file' || args[6] !== '--')
    throw new Error('usage: verify-reviewed-projection-requests.mjs --report-file <json> --refusals-file <nul> --candidates-file <nul> -- <request>...');
  const [reportFile, refusalsFile, candidatesFile] = [args[1], args[3], args[5]].map(file => outside(root, file));
  try {
    const report = await verifyProjectionRequests({ root, requests: args.slice(7) });
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(refusalsFile, report.refusals.map(row => `${row.request}\0${row.error}\0`).join(''));
    fs.writeFileSync(candidatesFile, report.consumerCandidates.map(file => file + '\0').join(''));
    console.log(`Projection phase: ${report.status}; requests=${report.completedRequests}/${report.requestCount}; workers=${report.workerCount}; refused=${report.refusals.length}`);
  } catch (error) {
    if (error.projectionReport) fs.writeFileSync(reportFile, JSON.stringify(error.projectionReport, null, 2) + '\n');
    throw error;
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === HERE) {
  main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
}
