#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { plan, verify } from './gpt2-library-commit.mjs';
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
/** Adapter.get must return the real persisted Library bytes, not a hash claim.
 * Adapter.put must be a real Library upload. Commit marker is stored LAST.
 */
export async function closeout(options,adapter){
  if(typeof adapter?.get!=='function'||typeof adapter?.put!=='function')throw Error('LIBRARY_ADAPTER_REQUIRED');
  const p=plan(options); const observations=[];
  for(const item of p.items){
    const expected=await fs.readFile(item.localPath);
    let remote=await adapter.get(item.remotePath);
    if(remote!=null&&!Buffer.isBuffer(remote))throw Error('ADAPTER_BYTES_REQUIRED');
    if(remote==null){await adapter.put(item.remotePath,expected);remote=await adapter.get(item.remotePath);}
    if(!Buffer.isBuffer(remote)||digest(remote)!==item.sha256||remote.length!==item.sizeBytes)
      throw Error('REMOTE_READBACK_MISMATCH:'+item.remotePath);
    observations.push({remotePath:item.remotePath,sha256:digest(remote),sizeBytes:remote.length,readbackConfirmed:true});
  }
  const commit=verify(options,observations);
  const commitBytes=Buffer.from(JSON.stringify(commit,null,2)+'\n');
  let existing=await adapter.get(p.commitPath);
  if(existing==null){await adapter.put(p.commitPath,commitBytes);existing=await adapter.get(p.commitPath);}
  if(!Buffer.isBuffer(existing)||!existing.equals(commitBytes))throw Error('REMOTE_COMMIT_CONFLICT');
  return {...commit,committed:true,commitSha256:digest(existing)};
}
