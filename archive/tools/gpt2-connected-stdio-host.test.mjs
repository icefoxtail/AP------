import test from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
import {createRpcChannel, createHostClients, REQUEST_PREFIX, RESPONSE_PREFIX} from './gpt2-connected-stdio-host.mjs';
import {once} from 'node:events';
import readline from 'node:readline';

function harness(t, {handler, timeoutMs = 1500} = {}) {
  const input=new PassThrough(), output=new PassThrough();
  t.after(() => {input.end(); output.end();});
  const requests=[];
  const reader=readline.createInterface({input:output, crlfDelay:Infinity});
  t.after(() => reader.close());
  reader.on('line', async line => {
    if(!line.startsWith(REQUEST_PREFIX))return;
    const req=JSON.parse(line.slice(REQUEST_PREFIX.length));
    requests.push(req);
    try {
      const value=await handler(req);
      if(value!==undefined) input.write(RESPONSE_PREFIX+JSON.stringify({schemaVersion:'GPT2_HOST_RPC_v1',sessionId:req.sessionId,id:req.id,ok:true,result:value})+'\n');
    } catch(e) {
      input.write(RESPONSE_PREFIX+JSON.stringify({schemaVersion:'GPT2_HOST_RPC_v1',sessionId:req.sessionId,id:req.id,ok:false,error:e.message})+'\n');
    }
  });
  return {input,output,requests,timeoutMs};
}

test('connected host dispatches exact allowed tool payloads',async t=>{
  const h=harness(t,{handler:r=>r.tool==='__hello'?{protocol:'GPT2_HOST_RPC_v1',connectedFiles:true,connectedGitHub:true,toolResultBinding:'ACTUAL_TOOL_RETURN'}:{result:{sha:'abc',content:'{}'}}});
  const x=await createHostClients({input:h.input,output:h.output,timeoutMs:1500});
  const ans=await x.github.fetch_file({repository_full_name:'icefoxtail/AP------',ref:'ops/gpt2-cas',path:'test.json'});
  assert.equal(ans.result.sha,'abc');
  assert.equal(h.requests[1].tool,'mcp__GitHub__fetch_file');
  assert.equal(h.requests[1].args.path,'test.json');
});

test('preflight fails closed without actual connected tool attestation',async t=>{
  const h=harness(t,{handler:()=>({protocol:'GPT2_HOST_RPC_v1',connectedFiles:false,connectedGitHub:true,toolResultBinding:'ACTUAL_TOOL_RETURN'})});
  await assert.rejects(createHostClients({input:h.input,output:h.output,timeoutMs:500}),/AUTHORIZED_CONNECTED_HOST_PREFLIGHT_FAILED/);
});

test('RPC refuses arbitrary tool names before emitting request',async t=>{
  const h=harness(t,{handler:()=>({})});
  const rpc=createRpcChannel({input:h.input,output:h.output,timeoutMs:1000});
  assert.throws(()=>rpc.call('mcp__GitHub__merge_pull_request',{}),/HOST_RPC_ACTION_FORBIDDEN/);
  assert.equal(h.requests.length,0);
  rpc.close();
});

test('remote tool error propagates without pretending success',async t=>{
  const h=harness(t,{handler:r=>{throw Error('GitHub 409 CAS conflict');}});
  const rpc=createRpcChannel({input:h.input,output:h.output,timeoutMs:1000});
  await assert.rejects(rpc.call('mcp__GitHub__update_file',{sha:'abc'}),/CONNECTED_TOOL_FAILED:GitHub 409 CAS conflict/);
  rpc.close();
});

test('unanswered requests time out and do not issue implicit pass',async t=>{
  const h=harness(t,{handler:()=>undefined});
  const rpc=createRpcChannel({input:h.input,output:h.output,timeoutMs:80});
  await assert.rejects(rpc.call('files__list',{}),/GPT2_HOST_RPC_TIMEOUT/);
  rpc.close();
});

test('distinct pending responses correlate by id even when delivered out of order',async t=>{
  const input=new PassThrough(),output=new PassThrough();
  t.after(()=>{input.end();output.end();});
  const rpc=createRpcChannel({input,output,timeoutMs:1000,sessionId:'SESSION_TWO'});
  t.after(()=>rpc.close());
  const seen=[];
  const rd=readline.createInterface({input:output});
  t.after(()=>rd.close());
  rd.on('line',line=>{
    if(!line.startsWith(REQUEST_PREFIX))return;
    const m=JSON.parse(line.slice(REQUEST_PREFIX.length));
    seen.push(m);
    if(seen.length!==2)return;
    for(const r of [...seen].reverse())input.write(RESPONSE_PREFIX+JSON.stringify({schemaVersion:'GPT2_HOST_RPC_v1',sessionId:r.sessionId,id:r.id,ok:true,result:r.args.i})+'\n');
  });
  const results=await Promise.all([rpc.call('files__list',{i:1}),rpc.call('files__list',{i:2})]);
  assert.deepEqual(results,[1,2]);
});

test('foreign session reply cannot complete a legitimate request',async t=>{
  const input=new PassThrough(),output=new PassThrough();
  t.after(()=>{input.end();output.end();});
  const rpc=createRpcChannel({input,output,timeoutMs:90,sessionId:'GOOD'});
  const rd=readline.createInterface({input:output});t.after(()=>rd.close());
  rd.on('line',line=>{
    if(!line.startsWith(REQUEST_PREFIX))return;
    const m=JSON.parse(line.slice(REQUEST_PREFIX.length));
    input.write(RESPONSE_PREFIX+JSON.stringify({schemaVersion:'GPT2_HOST_RPC_v1',sessionId:'OTHER',id:m.id,ok:true,result:'BAD'})+'\n');
  });
  await assert.rejects(rpc.call('files__list',{}),/GPT2_HOST_RPC_TIMEOUT/);
  rpc.close();
});