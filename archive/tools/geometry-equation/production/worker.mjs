import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {freezeWire,validateResponse} from './contracts.mjs';
import {dependencyRoot} from './dependencies.mjs';
import path from 'node:path';
// GEOMETRY_WORKER_TIMEOUT_MS (milliseconds) lengthens the default 10 s limit on a slow PC; only a finite positive number up to 600000 is used, anything else (negative, 0, Infinity, text, 2^31 and more) keeps 10000
export const workerTimeoutMs=(raw)=>{const v=Number(raw);return Number.isFinite(v)&&v>0&&v<=600000?v:10000;};
export async function pythonWorker(payload, {python = process.env.GEOMETRY_PYTHON || 'python', timeoutMs = workerTimeoutMs(process.env.GEOMETRY_WORKER_TIMEOUT_MS), maxBytes = 4000000, script = fileURLToPath(new URL('worker.py',import.meta.url)),signal} = {}) {
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
