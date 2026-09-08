import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const PHASES = ['U1', 'U2', 'U3'];
const JOB = process.argv[process.argv.indexOf('--job') + 1];
if (!JOB) throw new Error('CODEX_APPSERVER_JOB_REQUIRED');

const stateRelative = `alive/runtime/provider-bridge/${JOB}/codex-appserver-state.json`;
const statePath = path.resolve(ROOT, stateRelative.replaceAll('/', path.sep));
const stateDir = path.dirname(statePath);
const scriptPath = fileURLToPath(import.meta.url);

const readStdin = () => new Promise((resolve, reject) => {
  let value = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { value += chunk; });
  process.stdin.on('end', () => {
    try { resolve(JSON.parse(value)); } catch (error) { reject(error); }
  });
  process.stdin.on('error', reject);
});

const writeState = state => {
  fs.mkdirSync(stateDir, { recursive: true });
  const temporary = `${statePath}.next`;
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  fs.renameSync(temporary, statePath);
};

const readState = () => JSON.parse(fs.readFileSync(statePath, 'utf8'));

class AppServerClient {
  constructor() {
    this.proc = spawn('codex', ['app-server', '--stdio'], { stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true });
    this.buffer = '';
    this.nextId = 1;
    this.pending = new Map();
    this.notifications = [];
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdout.on('data', chunk => this.consume(chunk));
    this.proc.on('exit', (code, signal) => {
      for (const pending of this.pending.values()) pending.reject(new Error(`CODEX_APPSERVER_EXIT:${code ?? signal}`));
      this.pending.clear();
    });
  }

  consume(chunk) {
    this.buffer += chunk;
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      let message;
      try { message = JSON.parse(line); } catch { continue; }
      if (message.id !== undefined && this.pending.has(String(message.id))) {
        const pending = this.pending.get(String(message.id));
        this.pending.delete(String(message.id));
        if (message.error) pending.reject(new Error(`CODEX_APPSERVER_RPC:${JSON.stringify(message.error)}`));
        else pending.resolve(message.result);
      } else this.notifications.push(message);
    }
  }

  request(method, params) {
    const id = this.nextId++;
    const request = { jsonrpc: '2.0', id, method, params };
    return new Promise((resolve, reject) => {
      this.pending.set(String(id), { resolve, reject });
      this.proc.stdin.write(`${JSON.stringify(request)}\n`);
    });
  }

  close() { this.proc.kill(); }
}

const threadParams = (phase, developerInstructions) => ({
  model: 'gpt-5.6-luna',
  cwd: ROOT,
  ephemeral: true,
  approvalPolicy: 'never',
  sandbox: 'read-only',
  dynamicTools: [],
  multiAgentMode: 'explicitRequestOnly',
  developerInstructions,
  config: { mcp_servers: {} },
  runtimeWorkspaceRoots: [ROOT],
  sessionStartSource: 'startup'
});

async function daemonMain() {
  const app = new AppServerClient();
  await app.request('initialize', { clientInfo: { name: 'apmath-codex-provider-bridge', version: '1.0.0' }, capabilities: { experimentalApi: true } });
  app.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'initialized', params: {} })}\n`);
  const controlResult = await app.request('thread/start', threadParams('CONTROL', 'Provider control-plane only. Do not start a model turn.'));
  const phaseResults = {};
  for (const phase of PHASES) {
    phaseResults[phase] = await app.request('thread/start', threadParams(phase, `You are the isolated ${phase} auditor. Do not call tools, spawn subagents, or access any context outside the packet supplied in your turn. Return only the requested JSON evidence.`));
  }
  const control = controlResult.thread;
  const contexts = Object.fromEntries(PHASES.map(phase => {
    const thread = phaseResults[phase].thread;
    return [phase, { sessionId: thread.sessionId, contextId: thread.id }];
  }));
  const response = {
    schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    status: 'READY',
    provider: 'CodexAppServer',
    model: 'gpt-5.6-luna/xhigh',
    externalTaskId: control.id,
    auditorId: control.id,
    auditorSessionId: control.sessionId,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    modelInvocationCount: 0,
    contexts,
    runtimeAttestation: JSON.stringify({
      provider: 'CodexAppServer',
      appServerVersion: controlResult.thread.cliVersion,
      controlThreadId: control.id,
      phaseThreadIds: Object.fromEntries(PHASES.map(phase => [phase, phaseResults[phase].thread.id])),
      threadStartOnly: true,
      turnStartCount: 0,
      dynamicToolsCount: 0,
      multiAgentMode: 'explicitRequestOnly',
      approvalPolicy: 'never',
      sandbox: 'read-only'
    })
  };
  const server = net.createServer(socket => {
    let buffer = '';
    socket.on('data', chunk => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) if (line.trim()) handleDaemonRequest(app, JSON.parse(line), contexts, control, phaseResults).then(result => socket.write(`${JSON.stringify(result)}\n`)).catch(error => socket.write(`${JSON.stringify({ status: 'ERROR', error: error.message })}\n`));
    });
  });
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once?.('error', reject));
  const address = server.address();
  writeState({ schemaVersion: 'APMATH_CODEX_APPSERVER_BRIDGE_v1', job: JOB, pid: process.pid, host: '127.0.0.1', port: address.port, control, contexts, model: response.model, provider: response.provider, startedAt: new Date().toISOString() });
  process.on('SIGTERM', () => { server.close(); app.close(); process.exit(0); });
  process.on('SIGINT', () => { server.close(); app.close(); process.exit(0); });
}

async function handleDaemonRequest(app, request, contexts, control, phaseResults) {
  if (request.operation === 'preflight') return request.responseBase;
  if (request.operation !== 'phase') throw new Error('CODEX_APPSERVER_UNKNOWN_OPERATION');
  const thread = phaseResults[request.phase].thread;
  const turn = await app.request('turn/start', {
    threadId: thread.id,
    input: [{ type: 'text', text: request.prompt }],
    outputSchema: { type: 'object', additionalProperties: false, properties: { evidence: { type: 'array' }, defects: { type: 'array' } }, required: ['evidence', 'defects'] },
    approvalPolicy: 'never',
    sandboxPolicy: { type: 'readOnly', networkAccess: 'restricted' },
    collaborationMode: { mode: 'default', settings: { developer_instructions: null } }
  });
  const turnId = turn.id;
  let text = '';
  const deadline = Date.now() + 300000;
  while (Date.now() < deadline) {
    const index = app.notifications.findIndex(message => message.method === 'turn/completed' && message.params?.threadId === thread.id && message.params?.turn?.id === turnId);
    const delta = app.notifications.filter(message => message.method === 'item/agentMessage/delta' && message.params?.threadId === thread.id && message.params?.turnId === turnId).map(message => message.params.delta).join('');
    if (delta.length > text.length) text = delta;
    if (index >= 0) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!text) throw new Error('CODEX_APPSERVER_EMPTY_AGENT_OUTPUT');
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('CODEX_APPSERVER_AGENT_OUTPUT_NOT_JSON');
  const output = JSON.parse(text.slice(start, end + 1));
  return { schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1', operation: 'INVOKE_STATELESS_AUDITOR_PHASE', status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: control.id, phase: request.phase, sessionId: contexts[request.phase].sessionId, contextId: contexts[request.phase].contextId, providerInvocationId: turnId, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 'NOT_AVAILABLE', evidence: output.evidence, defects: output.defects };
}

function callDaemon(request) {
  const state = readState();
  return new Promise((resolve, reject) => {
    const socket = net.connect(state.port, state.host, () => socket.write(`${JSON.stringify(request)}\n`));
    let buffer = '';
    socket.setTimeout(360000);
    socket.on('data', chunk => {
      buffer += chunk.toString('utf8');
      const line = buffer.split(/\r?\n/)[0];
      if (!line) return;
      socket.end();
      const response = JSON.parse(line);
      response.status === 'ERROR' ? reject(new Error(`HOLD:${response.error}`)) : resolve(response);
    });
    socket.on('error', reject);
    socket.on('timeout', () => { socket.destroy(); reject(new Error('HOLD:CODEX_APPSERVER_DAEMON_TIMEOUT')); });
  });
}

async function main() {
  if (process.argv.includes('--daemon')) return daemonMain();
  const request = await readStdin();
  if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
    if (!fs.existsSync(statePath)) {
      const child = spawn(process.execPath, [scriptPath, '--daemon', '--job', JOB], { detached: true, stdio: 'ignore', windowsHide: true });
      child.unref();
      const deadline = Date.now() + 30000;
      while (!fs.existsSync(statePath) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 100));
    }
    const state = readState();
    const response = { schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1', operation: 'PREPARE_STATELESS_FINAL_AUDIT', status: 'READY', provider: state.provider, model: state.model, externalTaskId: state.control.id, auditorId: state.control.id, auditorSessionId: state.control.sessionId, contextIsolation: 'STATELESS_INPUTS', subagentToolsEnabled: false, modelInvocationCount: 0, contexts: state.contexts, runtimeAttestation: JSON.stringify({ provider: state.provider, daemonPid: state.pid, controlThreadId: state.control.id, contexts: state.contexts, turnStartCount: 0 }), requestSha: request.requestSha };
    process.stdout.write(JSON.stringify(response));
    return;
  }
  const response = await callDaemon({ operation: 'phase', phase: request.phase, inputSha: request.inputSha, packet: request.packet, prompt: JSON.stringify(request.packet) });
  process.stdout.write(JSON.stringify(response));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
