import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AUDITOR_OUTPUT_SCHEMA } from './auditor-output-schema.mjs';
import { parseJsonObjectItems } from './auditor-output-normalizer.mjs';
import { classifyAppServerMessage, completedTurnFor, completedTurnFromThreadRead, completedTurnFromTurnsList, completedTurnText, parseAuditorOutputText, summarizeAppServerMessage, turnFromStartResponse, withTimeout } from './auditor-turn-output.mjs';
import { APP_SERVER_PHASES, getOrCreateLaunchContext, phaseContextForLaunch } from './codex-appserver-launch-state.mjs';

const ROOT = process.cwd();
const PHASES = ['U1', 'U2', 'U3'];
const HISTORY_RPC_TIMEOUT_MS = 1000;
const JOB = process.argv[process.argv.indexOf('--job') + 1];
const stateRelative = JOB ? `alive/runtime/provider-bridge/${JOB}/codex-appserver-state.json` : null;
const statePath = stateRelative ? path.resolve(ROOT, stateRelative.replaceAll('/', path.sep)) : null;
const stateDir = statePath ? path.dirname(statePath) : null;
const scriptPath = fileURLToPath(import.meta.url);

export function nativeImageInput(url) {
  if (typeof url !== 'string' || !url.startsWith('data:image/')) throw new Error('CODEX_NATIVE_IMAGE_URL_REQUIRED');
  return { type: 'image', url, detail: 'original' };
}

// Only traverse the phase-authorized visual lanes, never arbitrary metadata.
export function buildNativeTurnInput(prompt, packet) {
  const urls = new Set();
  const collect = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.dataUrl === 'string') urls.add(value.dataUrl);
    if (Array.isArray(value)) value.forEach(collect);
    else for (const [key, child] of Object.entries(value)) if (key !== 'sourceRef') collect(child);
  };
  for (const row of Array.isArray(packet.payload) ? packet.payload : [packet.payload]) {
    if (packet.phase === 'U1') collect(row.problemAssets);
    if (packet.phase === 'U2') collect(row.artifact);
    if (packet.phase === 'U3') {
      collect(row.currentQuestion?.problemAssets);
      collect(row.renderWitnesses);
    }
  }
  return [{ type: 'text', text: prompt }, ...[...urls].map(nativeImageInput)];
}

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
    this.tracePath = path.join(stateDir, 'appserver-message-trace.jsonl');
    this.traceSequence = 0;
    fs.mkdirSync(stateDir, { recursive: true });
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
      const route = classifyAppServerMessage(message, this.pending);
      try {
        fs.appendFileSync(this.tracePath, `${JSON.stringify(summarizeAppServerMessage(message, route, ++this.traceSequence))}\n`, 'utf8');
      } catch {
        // Diagnostics must never change provider behavior.
      }
      if (route === 'notification') {
        this.notifications.push(message);
      } else if (route === 'response') {
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
  const priorState = fs.existsSync(statePath) ? readState() : null;
  const legacyBootstrap = priorState && !priorState.adapterVersion ? { control: priorState.control || null, contexts: priorState.contexts || null, pid: priorState.pid || null, startedAt: priorState.startedAt || null } : priorState?.legacyBootstrap || null;
  const runtime = {
    state: {
      ...(priorState || {}),
      adapterVersion: 'APMATH_CODEX_APPSERVER_ADAPTER_v2',
      job: JOB,
      provider: 'CodexAppServer',
      model: 'gpt-5.6-luna/xhigh',
      pid: process.pid,
      launches: priorState?.launches || {},
      ...(legacyBootstrap ? { legacyBootstrap } : {})
    },
    app,
    appServerVersion: null
  };
  const server = net.createServer(socket => {
    let buffer = '';
    socket.on('data', chunk => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) if (line.trim()) handleDaemonRequest(runtime, JSON.parse(line)).then(result => socket.write(`${JSON.stringify(result)}\n`)).catch(error => socket.write(`${JSON.stringify({ status: 'ERROR', error: error.message })}\n`));
    });
  });
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once?.('error', reject));
  const address = server.address();
  runtime.state = { ...runtime.state, schemaVersion: 'APMATH_CODEX_APPSERVER_BRIDGE_v2', host: '127.0.0.1', port: address.port, startedAt: new Date().toISOString() };
  writeState(runtime.state);
  process.on('SIGTERM', () => { server.close(); app.close(); process.exit(0); });
  process.on('SIGINT', () => { server.close(); app.close(); process.exit(0); });
}

async function createLaunchContextSet(app, launchId, requestSha) {
  const controlResult = await app.request('thread/start', threadParams('CONTROL', `Provider control-plane for logical launch ${launchId}. Do not start a model turn.`));
  const phaseResults = {};
  for (const phase of PHASES) phaseResults[phase] = await app.request('thread/start', threadParams(phase, `You are the isolated ${phase} auditor for logical launch ${launchId}. Do not call tools, spawn subagents, or access any context outside the packet supplied in your turn. Return only the requested JSON evidence.`));
  const control = controlResult.thread;
  const contexts = Object.fromEntries(PHASES.map(phase => {
    const thread = phaseResults[phase].thread;
    return [phase, { sessionId: thread.sessionId, contextId: thread.id, threadId: thread.id }];
  }));
  return { launchId, requestSha, control: { id: control.id, sessionId: control.sessionId, threadId: control.id }, contexts, appServerVersion: control.cliVersion };
}

function preflightResponse(runtime, launch) {
  const contexts = Object.fromEntries(PHASES.map(phase => [phase, { sessionId: launch.contexts[phase].sessionId, contextId: launch.contexts[phase].contextId }]));
  return {
    schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
    operation: 'PREPARE_STATELESS_FINAL_AUDIT',
    status: 'READY',
    provider: runtime.state.provider,
    model: runtime.state.model,
    externalTaskId: launch.control.id,
    auditorId: launch.control.id,
    auditorSessionId: launch.control.sessionId,
    contextIsolation: 'STATELESS_INPUTS',
    subagentToolsEnabled: false,
    modelInvocationCount: 0,
    contexts,
    runtimeAttestation: JSON.stringify({ provider: runtime.state.provider, appServerVersion: launch.appServerVersion || runtime.state.appServerVersion || null, logicalLaunchId: launch.launchId, controlThreadId: launch.control.threadId, phaseThreadIds: Object.fromEntries(PHASES.map(phase => [phase, launch.contexts[phase].threadId])), threadStartOnly: true, turnStartCount: 0, dynamicToolsCount: 0, multiAgentMode: 'explicitRequestOnly', approvalPolicy: 'never', sandbox: 'read-only' })
  };
}

async function handleDaemonRequest(runtime, request) {
  if (request.operation === 'preflight') {
    const result = await getOrCreateLaunchContext(runtime.state, { launchId: request.launchId, requestSha: request.requestSha, create: () => createLaunchContextSet(runtime.app, request.launchId, request.requestSha) });
    runtime.state = { ...result.state, appServerVersion: result.launch.appServerVersion || runtime.state.appServerVersion };
    writeState(runtime.state);
    return { ...preflightResponse(runtime, result.launch), requestSha: request.requestSha };
  }
  if (request.operation !== 'phase') throw new Error('CODEX_APPSERVER_UNKNOWN_OPERATION');
  const { launch, context } = phaseContextForLaunch(runtime.state, request.logicalLaunchId, request.phase);
  const threadId = context.threadId;
  const turnResponse = await runtime.app.request('turn/start', {
    threadId,
    model: 'gpt-5.6-luna',
    input: buildNativeTurnInput(request.prompt, request.packet),
    outputSchema: AUDITOR_OUTPUT_SCHEMA,
    approvalPolicy: 'never',
    sandboxPolicy: { type: 'readOnly', networkAccess: false },
    collaborationMode: { mode: 'default', settings: { model: 'gpt-5.6-luna', developer_instructions: null } }
  });
  const turn = turnFromStartResponse(turnResponse);
  if (!turn?.id) throw new Error('CODEX_APPSERVER_TURN_ID_MISSING');
  const turnId = turn.id;
  let text = '';
  const deadline = Date.now() + 300000;
  let nextHistoryReadAt = 0;
  let historyRecoveryInFlight = null;
  while (Date.now() < deadline) {
    const completedText = completedTurnText(runtime.app.notifications, threadId, turnId);
    if (completedText.length > text.length) text = completedText;
    if (completedTurnFor(runtime.app.notifications, threadId, turnId) || parseAuditorOutputText(text)) break;

    if (!historyRecoveryInFlight && Date.now() >= nextHistoryReadAt) {
      nextHistoryReadAt = Date.now() + 1000;
      historyRecoveryInFlight = (async () => {
        try {
          const turns = await withTimeout(
            runtime.app.request('thread/turns/list', { threadId, itemsView: 'full', limit: 20, sortDirection: 'desc' }),
            HISTORY_RPC_TIMEOUT_MS,
            'CODEX_APPSERVER_HISTORY_LIST_TIMEOUT'
          );
          const listedTurn = completedTurnFromTurnsList(turns, turnId);
          if (listedTurn) runtime.app.notifications.push({ method: 'turn/completed', params: { threadId, turn: listedTurn } });
        } catch {
          // Notification delivery remains primary; history polling is bounded recovery.
        }
        try {
          const history = await withTimeout(
            runtime.app.request('thread/read', { threadId }),
            HISTORY_RPC_TIMEOUT_MS,
            'CODEX_APPSERVER_HISTORY_READ_TIMEOUT'
          );
          const historyTurn = completedTurnFromThreadRead(history, threadId, turnId);
          if (historyTurn) runtime.app.notifications.push({ method: 'turn/completed', params: { threadId, turn: historyTurn } });
        } catch {
          // Notification delivery remains primary; history polling is bounded recovery.
        }
      })().finally(() => { historyRecoveryInFlight = null; });
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!text) throw new Error('CODEX_APPSERVER_EMPTY_AGENT_OUTPUT');
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('CODEX_APPSERVER_AGENT_OUTPUT_NOT_JSON');
  const output = JSON.parse(text.slice(start, end + 1));
  const evidence = parseJsonObjectItems(output.evidence, 'evidence');
  const defects = parseJsonObjectItems(output.defects, 'defects');
  return { schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1', operation: 'INVOKE_STATELESS_AUDITOR_PHASE', status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: launch.control.id, phase: request.phase, sessionId: context.sessionId, contextId: context.contextId, providerInvocationId: turnId, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 'NOT_AVAILABLE', evidence, defects };
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

async function ensureLaunchAwareDaemon() {
  const current = fs.existsSync(statePath) ? readState() : null;
  if (current?.adapterVersion === 'APMATH_CODEX_APPSERVER_ADAPTER_v2') return current;
  const child = spawn(process.execPath, [scriptPath, '--daemon', '--job', JOB], { detached: true, stdio: 'ignore', windowsHide: true });
  child.unref();
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (fs.existsSync(statePath)) {
      const state = readState();
      if (state.adapterVersion === 'APMATH_CODEX_APPSERVER_ADAPTER_v2') return state;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('HOLD:CODEX_APPSERVER_LAUNCH_AWARE_DAEMON_START_TIMEOUT');
}

async function main() {
  if (process.argv.includes('--daemon')) return daemonMain();
  const request = await readStdin();
  if (request.operation === 'PREPARE_STATELESS_FINAL_AUDIT') {
    await ensureLaunchAwareDaemon();
    const response = await callDaemon({ operation: 'preflight', launchId: request.launchId, requestSha: request.requestSha });
    process.stdout.write(JSON.stringify(response));
    return;
  }
  const response = await callDaemon({
    operation: 'phase',
    phase: request.phase,
    logicalLaunchId: request.logicalLaunchId,
    inputSha: request.inputSha,
    packet: request.packet,
    prompt: JSON.stringify({
      packet: request.packet,
      outputContract: {
        evidence: 'Return an array of JSON-encoded strings. Each string must encode exactly one evidence object.',
        defects: 'Return an array of JSON-encoded strings. Each string must encode exactly one defect object.',
      },
    }),
  });
  process.stdout.write(JSON.stringify(response));
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  if (!JOB) throw new Error('CODEX_APPSERVER_JOB_REQUIRED');
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
