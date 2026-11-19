import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {freezeWire,validateResponse} from './contracts.mjs';
import {dependencyRoot} from './dependencies.mjs';
import path from 'node:path';
// GEOMETRY_WORKER_TIMEOUT_MS (milliseconds) lengthens the default 10 s limit on a slow PC; only a finite positive number up to 600000 is used, anything else (negative, 0, Infinity, text, 2^31 and more) keeps 10000
export const workerTimeoutMs=(raw)=>{const v=Number(raw);return Number.isFinite(v)&&v>0&&v<=600000?v:10000;};
const productionDir=path.dirname(fileURLToPath(import.meta.url));
const hostScript=path.join(productionDir,'worker_host.py');
// GEOMETRY_WORKER_REUSE=0 turns the long-lived python host off (one fresh python process per request, the original behaviour).
const reuseEnabled=()=>process.env.GEOMETRY_WORKER_REUSE!=='0';
const MAX_REQUESTS_PER_HOST=400;
const inProduction=script=>{const rel=path.relative(productionDir,path.resolve(script));return rel!==''&&!rel.startsWith('..')&&!path.isAbsolute(rel)&&!rel.includes(path.sep)&&rel.endsWith('.py')&&rel!=='worker_host.py';};

// ---- long-lived python host (worker_host.py): one process serves many requests of the production worker scripts -------------------
class Host {
  constructor(python){
    this.python=python;this.served=0;this.dead=false;this.job=null;this.chunks=[];this.size=0;
    const child=this.child=spawn(python,['-X','utf8',hostScript],{stdio:['pipe','pipe','pipe'],windowsHide:true,env:{...process.env,PYTHONPATH:path.join(dependencyRoot,'python')}});
    child.unref();child.stdin.unref?.();child.stdout.unref?.();child.stderr.unref?.();
    child.stderr.on('data',()=>{});
    child.stdin.on('error',()=>{});
    child.stdout.on('data',chunk=>this.onData(chunk));
    child.on('error',()=>this.die('HOST_SPAWN_ERROR'));
    child.on('close',()=>this.die('HOST_EXIT'));
  }
  die(reason){
    if(this.dead)return;this.dead=true;liveHosts.delete(this);
    if(this.child.exitCode===null&&this.child.signalCode===null)try{this.child.kill();}catch{}
    const job=this.job;this.job=null;if(job)job.fail(Error(reason));
  }
  onData(chunk){
    const job=this.job;if(!job)return;
    this.size+=chunk.length;
    if(this.size>job.maxBytes*3+65536){job.fail(Error('WORKER_OUTPUT_LIMIT'));this.job=null;this.die('WORKER_OUTPUT_LIMIT');return;}
    this.chunks.push(chunk);
    if(chunk[chunk.length-1]!==10)return;
    const text=Buffer.concat(this.chunks).toString('utf8');this.chunks=[];this.size=0;
    this.job=null;
    let reply;try{reply=JSON.parse(text);}catch{job.fail(Error('HOST_BAD_REPLY'));this.die('HOST_BAD_REPLY');return;}
    job.done(reply);
  }
  request(script,raw,{timeoutMs,maxBytes,signal}){
    return new Promise((resolve,reject)=>{
      let timer,abortListener,settled=false;
      const finish=(fn,value)=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',abortListener);fn(value);};
      const kill=code=>{this.job=null;finish(reject,Error(code));this.die(code);};
      abortListener=()=>kill('WORKER_CANCELLED');
      timer=setTimeout(()=>kill('WORKER_TIMEOUT'),timeoutMs);
      signal?.addEventListener('abort',abortListener,{once:true});
      this.job={maxBytes,done:reply=>finish(resolve,reply),fail:error=>finish(reject,error)};
      this.served++;
      this.child.stdin.write(JSON.stringify({script,request:raw})+'\n');
    });
  }
}
const idleHosts=[];const liveHosts=new Set();
function acquireHost(python){
  while(idleHosts.length){const h=idleHosts.pop();if(!h.dead&&h.python===python)return h;if(!h.dead)h.die('HOST_PYTHON_CHANGED');}
  const host=new Host(python);liveHosts.add(host);host.child.on('close',()=>liveHosts.delete(host));return host;
}
function releaseHost(host){if(host.dead)return;if(host.served>=MAX_REQUESTS_PER_HOST){host.die('HOST_RECYCLED');return;}idleHosts.push(host);}
// Ends every idle host (render runs call this when they finish); a process exit also kills any that are left.
export function closeWorkers(){while(idleHosts.length){const h=idleHosts.pop();h.dead=true;try{h.child.stdin.end();}catch{}try{h.child.kill();}catch{}}for(const h of liveHosts){h.dead=true;try{h.child.kill();}catch{}}liveHosts.clear();}
export const workerHostStats=()=>({live:liveHosts.size,idle:idleHosts.length,served:[...liveHosts].reduce((n,h)=>n+h.served,0)});
process.on('exit',()=>{for(const h of liveHosts)try{h.child.kill();}catch{}});

export async function pythonWorker(payload, options = {}) {
  const {python,script = fileURLToPath(new URL('worker.py',import.meta.url)),signal} = options;
  if(python===undefined&&reuseEnabled()&&inProduction(script)){
    const result=await persistentWorker(payload,options);
    if(result!==undefined)return result;
  }
  return classicWorker(payload,options);
}

async function persistentWorker(payload,{python = process.env.GEOMETRY_PYTHON || 'python', timeoutMs = workerTimeoutMs(process.env.GEOMETRY_WORKER_TIMEOUT_MS), maxBytes = 4000000, script = fileURLToPath(new URL('worker.py',import.meta.url)),signal} = {}) {
  if(signal!==undefined&&(!signal||typeof signal.aborted!=='boolean'||typeof signal.addEventListener!=='function'||typeof signal.removeEventListener!=='function'))throw Error('WORKER_SIGNAL_INVALID');
  if(signal?.aborted)throw Error('WORKER_CANCELLED');
  const request=freezeWire(payload);
  const raw=JSON.stringify(request);
  const host=acquireHost(python);
  let reply;
  try{reply=await host.request(path.resolve(script),raw,{timeoutMs,maxBytes,signal});}
  catch(error){
    if(['WORKER_TIMEOUT','WORKER_CANCELLED','WORKER_OUTPUT_LIMIT'].includes(error.message))throw error;
    return undefined; // host start/exit trouble: let the one-process path answer this request
  }
  if(reply.code!==0){host.die('HOST_SCRIPT_FAILED');return undefined;}
  releaseHost(host); // replay in a fresh process so the failure text is the classic one
  if(Buffer.byteLength(reply.stdout,'utf8')>maxBytes)throw Error('WORKER_OUTPUT_LIMIT');
  return validateResponse(JSON.parse(reply.stdout),request.objectSha256);
}

async function classicWorker(payload, {python = process.env.GEOMETRY_PYTHON || 'python', timeoutMs = workerTimeoutMs(process.env.GEOMETRY_WORKER_TIMEOUT_MS), maxBytes = 4000000, script = fileURLToPath(new URL('worker.py',import.meta.url)),signal} = {}) {
  if(signal!==undefined&&(!signal||typeof signal.aborted!=='boolean'||typeof signal.addEventListener!=='function'||typeof signal.removeEventListener!=='function'))throw Error('WORKER_SIGNAL_INVALID');
  if(signal?.aborted)throw Error('WORKER_CANCELLED');
  const request = freezeWire(payload);
  return await new Promise((resolve,reject) => {
    const child = spawn(python,['-X','utf8',script],{stdio:['pipe','pipe','pipe'],windowsHide:true,env:{...process.env,PYTHONPATH:path.join(dependencyRoot,'python')}});
    const chunks=[];let count=0,stderr='',failure;
    const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abortListener);};
    const stop = code => {if(failure)return;failure=Error(code);if(child.exitCode===null&&child.signalCode===null)child.kill();};
    const abortListener=()=>stop('WORKER_CANCELLED');
    const timer = setTimeout(() => stop('WORKER_TIMEOUT'),timeoutMs);
    signal?.addEventListener('abort',abortListener,{once:true});
    if(signal?.aborted)abortListener();
    child.stdout.on('data',chunk => {if(failure)return;count+=chunk.length;if(count>maxBytes)stop('WORKER_OUTPUT_LIMIT');else chunks.push(chunk);});
    child.stderr.on('data',chunk => {if(stderr.length<8192)stderr+=chunk;});
    child.on('error',error => {cleanup();reject(failure||error);});
    child.stdin.on('error',() => {});
    child.on('close',code => {
      cleanup();
      if(failure) return reject(failure);
      if(code!==0) return reject(Error('WORKER_EXIT:'+code+':'+stderr));
      try {resolve(validateResponse(JSON.parse(Buffer.concat(chunks).toString('utf8')),request.objectSha256));} catch(error){reject(error);}
    });
    child.stdin.end(JSON.stringify(request));
  });
}
