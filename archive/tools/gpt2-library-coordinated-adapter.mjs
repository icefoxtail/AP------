/**
 * Host-side Library adapter for GPT2 one-shot closeout.
 *
 * The ChatGPT Files upload API does not have create-if-absent: collisions are
 * renamed to (1), (2), etc.  Never mark that API itself as atomic.
 * Instead, claim each immutable remote *path* in a separately atomic CAS ledger,
 * then upload without overwrite and verify real bytes before confirming.
 * The ledger MUST have cross-session atomic creation and versioned CAS updates.
 * This module does not contain credentials or silently activate any job.
 */
import crypto from 'node:crypto';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const SCOPE = /^[\p{L}\p{N}_-]+$/u;
const DEFAULT_LEASE_MS = 8 * 60 * 1000;
const REQUIRED_LIB = ['getRaw', 'uploadCreateOnly'];
const REQUIRED_LEDGER = ['get', 'createIfAbsent', 'compareAndSwap'];

export function createCoordinatedAdapter({
  library, ledger, campaignId, stream, examUid,
  ownerId = crypto.randomUUID(), now = () => Date.now(), leaseMs = DEFAULT_LEASE_MS,
} = {}) {
  if (![campaignId, examUid].every(x => typeof x === 'string' && SCOPE.test(x)) ||
      !['A', 'B', 'C'].includes(stream) || typeof ownerId !== 'string' || !ownerId.trim())
    throw Error('INVALID_LIBRARY_SCOPE');
  if (!library || library.capabilities?.rawByteReadback !== true ||
      library.capabilities?.createOnlyNoOverwrite !== true ||
      REQUIRED_LIB.some(k => typeof library[k] !== 'function'))
    throw Error('LIBRARY_CREATE_ONLY_RAW_READBACK_REQUIRED');
  if (!ledger || ledger.capabilities?.atomicCreateIfAbsent !== true ||
      ledger.capabilities?.atomicCompareAndSwap !== true ||
      ledger.capabilities?.readAfterWrite !== true ||
      REQUIRED_LEDGER.some(k => typeof ledger[k] !== 'function'))
    throw Error('DISTRIBUTED_CAS_LEDGER_REQUIRED');
  if (!Number.isInteger(leaseMs) || leaseMs < 10_000 || typeof now !== 'function')
    throw Error('INVALID_LEDGER_LEASE');

  const prefix = `/Archive2-GPT/generations/${campaignId}/${stream}/${examUid}/TECHNICAL/GPT2_V2/`;
  const allowed = remotePath => {
    if (typeof remotePath !== 'string' || !remotePath.startsWith(prefix) ||
        remotePath.includes('..') || remotePath.includes('//') || remotePath.includes('\\') ||
        /[\0\r\n]/.test(remotePath)) throw Error('OUT_OF_SCOPE_LIBRARY_PATH');
    if (!/(?:\/seals\/(?:CREATE|R1|R2|R3)\/[a-f0-9]{40}(?:\.validator)?\.json|\/handoffs\/(?:R1|R2|R3|PUBLICATION)\.json|\/commits\/(?:CREATE|R1|R2|R3)-[a-f0-9]{40}\.json)$/.test(remotePath))
      throw Error('INVALID_LIBRARY_CLOSEOUT_PATH');
    return remotePath;
  };
  const key = remotePath => `gpt2-locks/${sha256(Buffer.from(remotePath))}.json`;
  async function readActual(remotePath) {
    const result = await library.getRaw(allowed(remotePath));
    if (result === null) return null;
    if (!Buffer.isBuffer(result)) throw Error('LIBRARY_RAW_BYTES_REQUIRED');
    return result;
  }
  function match(bytes, expected, remotePath) {
    if (!bytes.equals(expected)) throw Error('LIBRARY_IMMUTABLE_CONFLICT:' + remotePath);
  }
  function claim(remotePath, bytes) {
    return { schemaVersion: 'GPT2_LIBRARY_CAS_CLAIM_v1', remotePath, sha256: sha256(bytes),
      ownerId, status: 'CLAIMED', leaseUntilMs: now() + leaseMs, sizeBytes: bytes.length };
  }
  function checkedRecord(snapshot, remotePath, bytes) {
    const state = snapshot?.value;
    if (!state || state.remotePath !== remotePath || state.schemaVersion !== 'GPT2_LIBRARY_CAS_CLAIM_v1' ||
        state.sha256 !== sha256(bytes) || state.sizeBytes !== bytes.length)
      throw Error('CAS_LEDGER_IMMUTABLE_CONFLICT:' + remotePath);
    if (!['CLAIMED', 'VERIFIED'].includes(state.status)) throw Error('CAS_LEDGER_STATE_INVALID');
    return state;
  }
  async function claimWriter(remotePath, bytes) {
    const lockKey = key(remotePath), proposed = claim(remotePath, bytes);
    const created = await ledger.createIfAbsent(lockKey, proposed);
    if (created?.created === true) {
      const snapshot = await ledger.get(lockKey);
      if (!snapshot?.version || checkedRecord(snapshot, remotePath, bytes).ownerId !== ownerId)
        throw Error('CAS_LEDGER_CREATE_READBACK_FAILED');
      return { lockKey, snapshot };
    }
    if (created?.created !== false) throw Error('CAS_LEDGER_CREATE_RESULT_REQUIRED');
    const existing = await ledger.get(lockKey);
    if (!existing?.version) throw Error('CAS_LEDGER_STALE_AFTER_CONFLICT');
    const state = checkedRecord(existing, remotePath, bytes);
    if (state.status === 'VERIFIED') throw Error('CAS_LEDGER_VERIFIED_WITH_MISSING_LIBRARY_BYTES');
    if (state.ownerId !== ownerId && Number(state.leaseUntilMs) > now())
      throw Error('CAS_LEDGER_ACTIVE_WRITER');
    const updated = await ledger.compareAndSwap(lockKey, existing.version, proposed);
    if (updated?.updated !== true) throw Error('CAS_LEDGER_CONCURRENT_RETRY');
    const latest = await ledger.get(lockKey);
    if (!latest?.version || checkedRecord(latest, remotePath, bytes).ownerId !== ownerId)
      throw Error('CAS_LEDGER_TAKEOVER_READBACK_FAILED');
    return { lockKey, snapshot: latest };
  }
  async function finalize(lockKey, snapshot, remotePath, bytes) {
    const state = checkedRecord(snapshot, remotePath, bytes);
    if (state.ownerId !== ownerId) throw Error('CAS_LEDGER_OWNERSHIP_LOST');
    const updated = await ledger.compareAndSwap(lockKey, snapshot.version,
      { ...state, status: 'VERIFIED', leaseUntilMs: 0 });
    if (updated?.updated !== true) throw Error('CAS_LEDGER_FINALIZE_CONFLICT');
    const check = await ledger.get(lockKey);
    if (!check?.version || checkedRecord(check, remotePath, bytes).status !== 'VERIFIED')
      throw Error('CAS_LEDGER_FINAL_READBACK_FAILED');
  }

  return {
    capabilities: { atomicCreateIfAbsent: true, rawByteReadback: true },
    async get(remotePath) { return readActual(remotePath); },
    async putIfAbsent(remotePath, bytes) {
      allowed(remotePath);
      if (!Buffer.isBuffer(bytes)) throw Error('LIBRARY_BYTES_REQUIRED');
      const expected = Buffer.from(bytes);
      let actual = await readActual(remotePath);
      if (actual !== null) { match(actual, expected, remotePath); return false; }
      const { lockKey, snapshot } = await claimWriter(remotePath, expected);
      actual = await readActual(remotePath);
      if (actual !== null) {
        match(actual, expected, remotePath);
        await finalize(lockKey, snapshot, remotePath, expected);
        return false;
      }
      // The provider may auto-rename duplicates. A renamed path is NEVER a successful write.
      const receipt = await library.uploadCreateOnly(remotePath, expected);
      if (typeof receipt?.path !== 'string') throw Error('LIBRARY_UPLOAD_PATH_REQUIRED');
      if (receipt.path !== remotePath) {
        // This can occur if an unmanaged writer raced us. Cleanup is best effort.
        if (receipt.fileId && typeof library.deleteById === 'function') {
          try { await library.deleteById(receipt.fileId); } catch { /* do not conceal collision */ }
        }
        throw Error('LIBRARY_UNEXPECTED_RENAME:' + receipt.path);
      }
      actual = await readActual(remotePath);
      if (actual === null) throw Error('LIBRARY_REMOTE_READBACK_MISSING');
      match(actual, expected, remotePath);
      await finalize(lockKey, snapshot, remotePath, expected);
      return true;
    },
  };
}