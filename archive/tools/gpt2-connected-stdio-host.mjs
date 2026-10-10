/**
 * GPT2 connector host bridge for a tool-authorized external controller.
 * A Node process cannot invoke connected ChatGPT tools directly. The trusted
 * controller must route each allowlisted RPC to the actual connected tool and
 * send its raw result back over stdin. No credentials live in this module.
 *
 * stdout: GPT2_HOST_CALL <json>\n
 * stdin:  GPT2_HOST_RESULT <json>\n
 *
 * IMPORTANT: An RPC handshake is NOT proof of remote CAS safety; the existing
 * coordinated adapter enforces the remote GitHub CAS + Library byte readback.
 */
import readline from 'node:readline';
import crypto from 'node:crypto';

export const REQUEST_PREFIX = 'GPT2_HOST_CALL ';
export const RESPONSE_PREFIX = 'GPT2_HOST_RESULT ';
const SUPPORTED = new Set([
  'files__list', 'files__materialize', 'files__manage_library',
  'mcp__GitHub__fetch_file', 'mcp__GitHub__create_file', 'mcp__GitHub__update_file',
]);
const integerWithin = (n, min, max) => Number.isSafeInteger(n) && n >= min && n <= max;

export function createRpcChannel({input = process.stdin, output = process.stdout, timeoutMs = 30_000, sessionId = crypto.randomUUID()} = {}) {
  if (!integerWithin(timeoutMs, 50, 300_000)) throw Error('INVALID_RPC_TIMEOUT');
  if (typeof sessionId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(sessionId))
    throw Error('INVALID_RPC_SESSION');
  const pending = new Map();
  const rl = readline.createInterface({input, terminal:false, crlfDelay:Infinity});
  let counter = 0;
  let closed = false;
  function rejectAll(error) {
    for (const {reject, timer} of pending.values()) {clearTimeout(timer); reject(error);}
    pending.clear();
  }
  rl.on('line', line => {
    if (!line.startsWith(RESPONSE_PREFIX)) return;
    let message;
    try {message = JSON.parse(line.slice(RESPONSE_PREFIX.length));} catch {return;}
    if (message?.schemaVersion !== 'GPT2_HOST_RPC_v1' || message?.sessionId !== sessionId ||
        typeof message.id !== 'string' || !pending.has(message.id)) return;
    const p = pending.get(message.id);
    pending.delete(message.id);
    clearTimeout(p.timer);
    if (message.ok === true) p.resolve(message.result);
    else p.reject(Error('CONNECTED_TOOL_FAILED:' + String(message.error || 'UNKNOWN').slice(0, 1024)));
  });
  rl.on('close', () => {closed = true; rejectAll(Error('GPT2_HOST_STDIN_CLOSED'));});
  input.on?.('error', e => {closed = true; rejectAll(e);});
  function call(tool, args) {
    if (tool !== '__hello' && !SUPPORTED.has(tool)) throw Error('HOST_RPC_ACTION_FORBIDDEN');
    if (closed) throw Error('GPT2_HOST_CHANNEL_CLOSED');
    const id = String(++counter);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {pending.delete(id); reject(Error('GPT2_HOST_RPC_TIMEOUT:' + tool));}, timeoutMs);
      pending.set(id, {resolve, reject, timer});
      const request = {schemaVersion:'GPT2_HOST_RPC_v1', sessionId, id, tool, args};
      output.write(REQUEST_PREFIX + JSON.stringify(request) + '\n', error => {
        if (error && pending.has(id)) {clearTimeout(timer); pending.delete(id); reject(error);}
      });
    });
  }
  return {call, sessionId, close() {closed = true; rl.close(); rejectAll(Error('GPT2_HOST_CHANNEL_CLOSED'));}};
}

/**
 * Adapter factory consumed by gpt2-connected-host-adapter.mjs.
 * Only authorize operations through an explicit live host controller. Preflight
 * must complete before any stage seal is attempted in one-shot.
 */
export async function createHostClients(options = {}) {
  const rpc = createRpcChannel(options);
  const ready = await rpc.call('__hello', {
    protocol: 'GPT2_HOST_RPC_v1', requestedTools: [...SUPPORTED],
    semantics: 'NO_FAKE_RAW_BYTES_NO_UNCHECKED_CAS',
  });
  if (ready?.protocol !== 'GPT2_HOST_RPC_v1' || ready?.connectedFiles !== true ||
      ready?.connectedGitHub !== true || ready?.toolResultBinding !== 'ACTUAL_TOOL_RETURN') {
    rpc.close();
    throw Error('AUTHORIZED_CONNECTED_HOST_PREFLIGHT_FAILED');
  }
  const files = {};
  for (const action of ['files__list','files__materialize','files__manage_library'])
    files[action] = args => rpc.call(action, args);
  const github = {};
  for (const [key, action] of [
    ['fetch_file','mcp__GitHub__fetch_file'],
    ['create_file','mcp__GitHub__create_file'],
    ['update_file','mcp__GitHub__update_file'],
  ]) github[key] = args => rpc.call(action, args);
  return {files, github, sessionId:rpc.sessionId};
}