#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { plan, verify } from './gpt2-library-commit.mjs';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');

/** createIfAbsent(path, bytes) MUST be one provider-side atomic conditional
 * create (true=created, false=already existed). A get()+put() implementation
 * is invalid. Every successful operation is confirmed by raw-byte readback.
 */
export async function createImmutable(adapter, remotePath, expected) {
  const before=await adapter.get(remotePath);
  if(before!=null&&!Buffer.isBuffer(before))throw Error('ADAPTER_BYTES_REQUIRED');
  if(before!=null&&!before.equals(expected))throw Error('REMOTE_IMMUTABLE_CONFLICT:'+remotePath);
  if(before==null){
    const created=await adapter.createIfAbsent(remotePath,expected);
    if(typeof created!=='boolean')throw Error('ADAPTER_ATOMIC_CREATE_RESULT_REQUIRED');
  }
  const remote=await adapter.get(remotePath);
  if(!Buffer.isBuffer(remote))throw Error('REMOTE_READBACK_MISSING:'+remotePath);
  if(!remote.equals(expected))throw Error('REMOTE_IMMUTABLE_CONFLICT:'+remotePath);
  return remote;
}

/** Adapter.get returns persisted Library bytes. Adapter.createIfAbsent is a
 * provider-side atomic conditional create. No get→put fallback is permitted.
 * Commit marker creation uses the same primitive and is performed last.
 */
export async function closeout(options,adapter){
  if(typeof adapter?.get!=='function')throw Error('LIBRARY_ADAPTER_REQUIRED');
  if(typeof adapter?.createIfAbsent!=='function')throw Error('REMOTE_ATOMIC_CREATE_REQUIRED');
  const p=plan(options); const observations=[];
  for(const item of p.items){
    const expected=await fs.readFile(item.localPath);
    if(digest(expected)!==item.sha256||expected.length!==item.sizeBytes)
      throw Error('LOCAL_PLAN_BYTES_MISMATCH:'+item.remotePath);
    const remote=await createImmutable(adapter,item.remotePath,expected);
    observations.push({remotePath:item.remotePath,sha256:digest(remote),sizeBytes:remote.length,readbackConfirmed:true});
  }
  const commit=verify(options,observations);
  const commitBytes=Buffer.from(JSON.stringify(commit,null,2)+'\n');
  const existing=await createImmutable(adapter,p.commitPath,commitBytes);
  return {...commit,committed:true,commitSha256:digest(existing)};
}
