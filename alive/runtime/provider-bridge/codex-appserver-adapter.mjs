import fs from 'node:fs';
import { createRequire } from 'node:module';
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
const jobIndex = process.argv.indexOf('--job');
const JOB = jobIndex >= 0 ? process.argv[jobIndex + 1] : null;
const MODEL = process.env.APMATH_CODEX_MODEL || 'gpt-5.6-luna';
const REASONING_EFFORT = process.env.APMATH_CODEX_REASONING_EFFORT || 'xhigh';
const MODEL_ROUTE = `${MODEL}/${REASONING_EFFORT}`;
const stateRelative = JOB ? `alive/runtime/provider-bridge/${JOB}/codex-appserver-state.json` : null;
const statePath = stateRelative ? path.resolve(ROOT, stateRelative.replaceAll('/', path.sep)) : null;
const stateDir = statePath ? path.dirname(statePath) : null;
const scriptPath = fileURLToPath(import.meta.url);

export function nativeImageInput(url) {
  if (typeof url !== 'string' || !url.startsWith('data:image/')) throw new Error('CODEX_NATIVE_IMAGE_URL_REQUIRED');
  return { type: 'image', url, detail: 'original' };
}

export function bindU2DefectsToPacketAssetSha(packet, defects) {
  const bySha = new Map();
  for (const row of packet?.payload || []) {
    const uid = row?.questionUid;
    if (typeof uid !== 'string') continue;
    const assets = [row.artifact, ...(Array.isArray(row.problemAssets) ? row.problemAssets : [])];
    for (const asset of assets) for (const key of ['sha256', 'nativeSha256']) {
      const sha = asset?.[key];
      if (typeof sha !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(sha)) continue;
      const matches = bySha.get(sha) || new Set();
      matches.add(uid);
      bySha.set(sha, matches);
    }
  }
  return defects.map(defect => {
    if (typeof defect?.questionUid === 'string') return defect;
    const matches = bySha.get(defect?.subjectSha);
    if (matches?.size !== 1) return defect;
    const questionUid = [...matches][0];
    return { ...defect, questionUid, subjectShaBinding: { status: 'PASS', matchedField: 'artifact.sha256|nativeSha256', questionUid } };
  });
}

let sharp;
function loadSharp() {
  if (!sharp) {
    const require = createRequire(process.env.APMATH_NODE_MODULES
      ? path.join(process.env.APMATH_NODE_MODULES, '..', 'package.json') : import.meta.url);
    sharp = require('sharp');
  }
  return sharp;
}

async function optimizeNativeImage(record) {
  const match = record.url.match(/^data:image\/(png|jpe?g|webp);base64,(.*)$/s);
  if (!match) return { ...record, transferUrl: record.url, transferMimeType: record.mimeType, originalBytes: null, transferBytes: null };
  const original = Buffer.from(match[2], 'base64');
  const renderWitness = /(?:^|\/)pipeline-renders\//.test(record.path || '');
  const nativeSvg = path.extname(record.path || '').toLowerCase() === '.svg';
  if (original.length <= 150_000 && !renderWitness && !nativeSvg) return { ...record, transferUrl: record.url, transferMimeType: record.mimeType, originalBytes: original.length, transferBytes: original.length };
  const image = loadSharp()(original, { limitInputPixels: 40_000_000 });
  const metadata = await image.metadata();
  // SVG-native PNGs may carry a transparent canvas. Codex displays those
  // alpha pixels as black in some native image paths, so flatten them to the
  // white canvas used by the archive renderer before transfer encoding.
  const flattened = metadata.hasAlpha ? await loadSharp()(original, { limitInputPixels: 40_000_000 }).flatten({ background: '#ffffff' }).png().toBuffer() : original;
  const flattenedUrl = metadata.hasAlpha ? `data:image/png;base64,${flattened.toString('base64')}` : record.url;
  const transferBase = metadata.hasAlpha ? flattened : original;
  if (transferBase.length <= 150_000 && !renderWitness) return { ...record, transferUrl: flattenedUrl, transferMimeType: 'image/png', originalBytes: original.length, transferBytes: transferBase.length };
  const pipeline = loadSharp()(transferBase, { limitInputPixels: 40_000_000 });
  const optimized = renderWitness
    ? await pipeline.resize({ width: 960, height: 800, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 75, mozjpeg: true }).toBuffer()
    : await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  if (optimized.length >= transferBase.length) return { ...record, transferUrl: flattenedUrl, transferMimeType: metadata.hasAlpha ? 'image/png' : record.mimeType, originalBytes: original.length, transferBytes: transferBase.length };
  return { ...record, transferUrl: `data:image/jpeg;base64,${optimized.toString('base64')}`, transferMimeType: 'image/jpeg', originalBytes: original.length, transferBytes: optimized.length };
}

function phaseImageLanes(packet) {
  const records = [];
  const collect = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.dataUrl === 'string' && value.dataUrl.startsWith('data:image/')) {
      if (!records.some(record => record.url === value.dataUrl)) records.push({
        index: records.length,
        url: value.dataUrl,
        path: typeof value.path === 'string' ? value.path : null,
        sha256: typeof value.sha256 === 'string' ? value.sha256 : null,
        mimeType: typeof value.mimeType === 'string' ? value.mimeType : null,
      });
    }
    if (Array.isArray(value)) value.forEach(collect);
    else for (const [key, child] of Object.entries(value)) if (key !== 'sourceRef' && key !== 'dataUrl') collect(child);
  };
  for (const row of Array.isArray(packet.payload) ? packet.payload : [packet.payload]) {
    if (packet.phase === 'U1') { collect(row.problemAssets); collect(row.sourcePixels); }
    if (packet.phase === 'U2') { collect(row.artifact); collect(row.renderWitnesses); }
    if (packet.phase === 'U3') {
      collect(row.currentQuestion?.problemAssets);
      // U3 audits the student solution. The full six-case render matrix is
      // already hash-bound to the work batch; attach only the desktop solution
      // witness per item, which is the view needed for item-level readability.
      for (const witness of (row.renderWitnesses || []).filter(witness => witness.mode === 'solution'
        && witness.viewportProfile === 'desktop'
        && !/-b\d+-s\d+\.png$/i.test(witness.screenshot?.path || ''))) collect(witness.screenshot);
    }
  }
  return records;
}

function promptPacketWithoutImageBytes(value, imageIndexByUrl) {
  if (Array.isArray(value)) return value.map(item => promptPacketWithoutImageBytes(item, imageIndexByUrl));
  if (!value || typeof value !== 'object') return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === 'dataUrl') {
      const imageInputIndex = imageIndexByUrl.get(child);
      if (imageInputIndex !== undefined) result.nativeImageInputIndex = imageInputIndex;
      else result.nativeImageInputOmitted = true;
      continue;
    }
    result[key] = promptPacketWithoutImageBytes(child, imageIndexByUrl);
  }
  return result;
}

function compactPromptText(prompt, packet, images) {
  if (typeof prompt !== 'string' || !images.length) return prompt;
  let parsed;
  try { parsed = JSON.parse(prompt); } catch { return prompt; }
  if (!parsed || typeof parsed !== 'object' || !Object.hasOwn(parsed, 'packet')) return prompt;
  const imageIndexByUrl = new Map(images.map(record => [record.url, record.index]));
  parsed.packet = promptPacketWithoutImageBytes(parsed.packet, imageIndexByUrl);
  parsed.nativeImageInputs = images.map(({ index, path, sha256, mimeType, transferMimeType, originalBytes, transferBytes }) => ({ index, path, sha256, mimeType, transferMimeType, originalBytes, transferBytes }));
  return JSON.stringify(parsed);
}

// Only traverse the phase-authorized visual lanes, never arbitrary metadata.
export async function buildNativeTurnInput(prompt, packet) {
  const images = await Promise.all(phaseImageLanes(packet).map(optimizeNativeImage));
  const compactPrompt = compactPromptText(prompt, packet, images);
  return [{ type: 'text', text: compactPrompt }, ...images.map(image => nativeImageInput(image.transferUrl))];
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
  constructor({ traceDir = stateDir } = {}) {
    this.proc = spawn(process.env.CODEX_CLI_PATH || 'codex', ['app-server', '--stdio'], { stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true });
    this.buffer = '';
    this.nextId = 1;
    this.pending = new Map();
    this.notifications = [];
    this.tracePath = traceDir ? path.join(traceDir, 'appserver-message-trace.jsonl') : null;
    this.traceSequence = 0;
    if (traceDir) fs.mkdirSync(traceDir, { recursive: true });
    this.exitRecord = null;
    this.closeRecord = null;
    this.closeEvent = new Promise(resolve => this.proc.once('close', (code, signal) => {
      this.closeRecord = { code: code ?? null, signal: signal ?? null, observedAt: Date.now() };
      resolve(this.closeRecord);
    }));
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdout.on('data', chunk => this.consume(chunk));
    this.proc.on('exit', (code, signal) => {
      this.exitRecord = { code: code ?? null, signal: signal ?? null, observedAt: Date.now() };
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
        if (this.tracePath) fs.appendFileSync(this.tracePath, `${JSON.stringify(summarizeAppServerMessage(message, route, ++this.traceSequence))}\n`, 'utf8');
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

  async closeAndObserve({ timeoutMs = 5000 } = {}) {
    const pid = Number.isInteger(this.proc.pid) ? this.proc.pid : null;
    let killRequested = false, killError = null, closeWaitTimedOut = false;
    if (this.proc.exitCode === null && this.proc.signalCode === null) {
      try { killRequested = this.proc.kill(); }
      catch (error) { killError = String(error); }
    }
    if (!this.closeRecord) {
      try { await withTimeout(this.closeEvent, timeoutMs, 'CODEX_APPSERVER_CLOSE_TIMEOUT'); }
      catch { closeWaitTimedOut = true; }
    }
    return {
      pid,
      killRequested,
      killError,
      exitObserved: Boolean(this.exitRecord),
      exitCode: this.exitRecord?.code ?? this.proc.exitCode ?? null,
      exitSignal: this.exitRecord?.signal ?? this.proc.signalCode ?? null,
      closeObserved: Boolean(this.closeRecord),
      closeCode: this.closeRecord?.code ?? null,
      closeSignal: this.closeRecord?.signal ?? null,
      closeWaitTimedOut
    };
  }
}

async function interruptTurnAndObserve(app, threadId, turnId, { ackTimeoutMs = 2000, completionTimeoutMs = 3000 } = {}) {
  const prior = completedTurnFor(app.notifications, threadId, turnId);
  if (prior) return {
    schemaVersion: 'APPSERVER_REMOTE_TURN_CANCELLATION_v1',
    status: prior.params.turn.status === 'interrupted' ? 'REMOTE_INTERRUPT_CONFIRMED' : 'REMOTE_TERMINAL_BEFORE_INTERRUPT',
    threadId, turnId, interruptRequested: false, acknowledgementReceived: false,
    terminalNotificationObserved: true, terminalStatus: prior.params.turn.status
  };
  let acknowledgement = null, acknowledgementError = null;
  try {
    acknowledgement = await withTimeout(app.request('turn/interrupt', { threadId, turnId }), ackTimeoutMs, 'VISUAL_PROVIDER_INTERRUPT_TIMEOUT');
  } catch (error) { acknowledgementError = String(error.message || error); }
  const deadline = Date.now() + completionTimeoutMs;
  let terminal = completedTurnFor(app.notifications, threadId, turnId);
  while (!terminal && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 25));
    terminal = completedTurnFor(app.notifications, threadId, turnId);
  }
  const terminalStatus = terminal?.params?.turn?.status || null;
  return {
    schemaVersion: 'APPSERVER_REMOTE_TURN_CANCELLATION_v1',
    status: terminalStatus === 'interrupted' ? 'REMOTE_INTERRUPT_CONFIRMED' : terminal ? 'REMOTE_TERMINAL_NON_INTERRUPT' : acknowledgementError ? 'REMOTE_INTERRUPT_UNCONFIRMED' : 'INTERRUPT_ACK_WITHOUT_TERMINAL',
    threadId, turnId, interruptRequested: true,
    acknowledgementReceived: acknowledgement !== null,
    acknowledgementKeys: acknowledgement && typeof acknowledgement === 'object' ? Object.keys(acknowledgement).sort() : null,
    acknowledgementError,
    terminalNotificationObserved: Boolean(terminal), terminalStatus,
    elapsedMs: completionTimeoutMs - Math.max(0, deadline - Date.now())
  };
}

const threadParams = (phase, developerInstructions) => ({
  model: MODEL,
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

/** Narrow engine continuation using the existing authenticated AppServer.
 * This is not a work-batch FINAL_AUDIT or a Seal. Each call has a fresh ephemeral
 * input context, no tools, and returns provider-issued thread/turn identities.
 */
export async function invokeVisualContinuation({root,traceDir,purpose,input,outputSchema,timeoutMs=180000}) {
  if(!root||!purpose||!Array.isArray(input)||!outputSchema)throw new Error('VISUAL_CONTINUATION_INPUT_REQUIRED');
  const app=new AppServerClient({traceDir});let threadId=null,turnId=null,remoteCancellation=null,providerFailure=null,result=null;
  try {
    const initialized=await withTimeout(app.request('initialize',{clientInfo:{name:'apmath-visual-continuation',version:'1.0.0'},capabilities:{experimentalApi:true}}),15000,'VISUAL_PROVIDER_INITIALIZE_TIMEOUT');
    app.proc.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'initialized',params:{}})+'\n');
    const catalog=await withTimeout(app.request('model/list',{limit:100}),15000,'VISUAL_PROVIDER_CATALOG_TIMEOUT');
    const selected=(catalog.data||[]).find(m=>m.isDefault)||(catalog.data||[]).find(m=>m.model===MODEL||m.id===MODEL);
    const selectedModel=process.env.APMATH_CODEX_MODEL||selected?.model||selected?.id||MODEL;
    const efforts=(selected?.supportedReasoningEfforts||[]).map(e=>typeof e==='string'?e:e.reasoningEffort);
    const selectedEffort=process.env.APMATH_CODEX_REASONING_EFFORT||(efforts.includes(REASONING_EFFORT)?REASONING_EFFORT:selected?.defaultReasoningEffort||'high');
    const start=await withTimeout(app.request('thread/start',{...threadParams(purpose,'You are an isolated APMath visual planning or review worker. Use only supplied inputs. Do not call tools or spawn subagents. Return the requested JSON. A missing condition or unsupported construction must remain unresolved.'),model:selectedModel,cwd:root,runtimeWorkspaceRoots:[root]}),15000,'VISUAL_PROVIDER_THREAD_TIMEOUT');
    const thread=start.thread;threadId=thread.id;
    const response=await withTimeout(app.request('turn/start',{threadId:thread.id,model:selectedModel,effort:selectedEffort,input,outputSchema,approvalPolicy:'never',sandboxPolicy:{type:'readOnly',networkAccess:false},collaborationMode:{mode:'default',settings:{model:selectedModel,developer_instructions:null}}}),15000,'VISUAL_PROVIDER_TURN_TIMEOUT');
    const turn=turnFromStartResponse(response);if(!turn?.id)throw new Error('VISUAL_PROVIDER_TURN_ID_MISSING');
    turnId=turn.id;
    const deadline=Date.now()+timeoutMs;let text='';
    while(Date.now()<deadline){
      text=completedTurnText(app.notifications,thread.id,turn.id);
      const completion=completedTurnFor(app.notifications,thread.id,turn.id);
      if(completion){
        if(completion.params.turn.status!=='completed')throw new Error('VISUAL_PROVIDER_TURN_'+completion.params.turn.status+':'+JSON.stringify(completion.params.turn.error||{}));
        if(!text)throw new Error('VISUAL_PROVIDER_EMPTY_OUTPUT');
        result={provider:'CodexAppServer',model:selectedModel+'/'+selectedEffort,purpose,sessionId:thread.sessionId,contextId:thread.id,providerInvocationId:turn.id,providerTerminalStatus:completion.params.turn.status,appServerVersion:initialized?.serverInfo?.version||thread.cliVersion||null,subagentToolsEnabled:false,rawOutput:text,output:JSON.parse(text)};
        return result;
      }
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    throw new Error('VISUAL_PROVIDER_TIMEOUT');
  }catch(error){
    providerFailure=error;
    if(threadId&&turnId){
      try{remoteCancellation=await interruptTurnAndObserve(app,threadId,turnId);}
      catch(interruptError){remoteCancellation={schemaVersion:'APPSERVER_REMOTE_TURN_CANCELLATION_v1',status:'INTERRUPT_FLOW_ERROR',threadId,turnId,interruptRequested:true,acknowledgementReceived:false,terminalNotificationObserved:false,error:String(interruptError.message||interruptError)};}
    }else remoteCancellation={schemaVersion:'APPSERVER_REMOTE_TURN_CANCELLATION_v1',status:'TURN_ID_UNAVAILABLE',threadId,turnId,interruptRequested:false,acknowledgementReceived:false,terminalNotificationObserved:false};
    throw error;
  }finally{
    const providerProcessCleanup=await app.closeAndObserve();
    if(providerFailure){providerFailure.providerRemoteCancellation=remoteCancellation;providerFailure.providerProcessCleanup=providerProcessCleanup;}
    if(result)result.providerProcessCleanup=providerProcessCleanup;
  }
}

async function daemonMain() {
  const app = new AppServerClient();
  await app.request('initialize', { clientInfo: { name: 'apmath-codex-provider-bridge', version: '1.0.0' }, capabilities: { experimentalApi: true } });
  app.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'initialized', params: {} })}\n`);
  const catalog = await app.request('model/list', { limit: 100, includeHidden: true });
  const model = (catalog.data || []).find(row => row.model === MODEL || row.id === MODEL);
  const supportedEfforts = (model?.supportedReasoningEfforts || []).map(row => typeof row === 'string' ? row : row.reasoningEffort);
  if (!model || !supportedEfforts.includes(REASONING_EFFORT)) throw new Error(`CODEX_APPSERVER_MODEL_EFFORT_UNAVAILABLE:${MODEL_ROUTE}`);
  const priorState = fs.existsSync(statePath) ? readState() : null;
  const legacyBootstrap = priorState && !priorState.adapterVersion ? { control: priorState.control || null, contexts: priorState.contexts || null, pid: priorState.pid || null, startedAt: priorState.startedAt || null } : priorState?.legacyBootstrap || null;
  const runtime = {
    state: {
      ...(priorState || {}),
      adapterVersion: 'APMATH_CODEX_APPSERVER_ADAPTER_v2',
      job: JOB,
      provider: 'CodexAppServer',
      model: MODEL_ROUTE,
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
    model: MODEL,
    effort: REASONING_EFFORT,
    input: await buildNativeTurnInput(request.prompt, request.packet),
    outputSchema: AUDITOR_OUTPUT_SCHEMA,
    approvalPolicy: 'never',
    sandboxPolicy: { type: 'readOnly', networkAccess: false },
    collaborationMode: { mode: 'default', settings: { model: MODEL, developer_instructions: null } }
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
  const scopedDefects = request.phase === 'U2' ? bindU2DefectsToPacketAssetSha(request.packet, defects) : defects;
  return { schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1', operation: 'INVOKE_STATELESS_AUDITOR_PHASE', status: 'COMPLETED', inputSha: request.inputSha, packetSha: request.packet.packetSha, externalTaskId: launch.control.id, phase: request.phase, sessionId: context.sessionId, contextId: context.contextId, providerInvocationId: turnId, inputVisibilityProfile: request.packet.inputVisibilityProfile, priorReviewVisibility: request.packet.priorReviewVisibility, subagentToolsEnabled: false, usedTokens: 'NOT_AVAILABLE', evidence, defects: scopedDefects };
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
      reviewContract: request.reviewContract,
      outputContract: {
        evidence: 'Return an array of JSON-encoded strings. Each string must encode exactly one evidence object.',
        defects: 'Return an array of JSON-encoded strings. Each string must encode exactly one defect object.',
        assessments: 'For an explicit correctness claim, evidence.payload.assessments may contain {domain: SOURCE|MATH|VISUAL|SOLUTION, status: PASS|FAIL, subjectSha: the reviewed source/candidate/artifact SHA}. Report only domains you actually reviewed. Never infer agreement from absent findings. Conflicts are resolved by a deterministic merger, not by an auditor.',
      },
    }),
  });
  process.stdout.write(JSON.stringify(response));
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  if (!JOB) throw new Error('CODEX_APPSERVER_JOB_REQUIRED');
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
