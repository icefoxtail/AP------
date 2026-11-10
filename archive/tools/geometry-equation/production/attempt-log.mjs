// Render attempt log: one JSON line per attempt (and one "final" line per render) appended to <outDir>/attempts.jsonl.
// Instrumentation only. It never throws, never changes what renderPlan returns, and attempts.jsonl is an additional file nobody else reads
// (figure-result.json / state / solution.svg are untouched; the publishing tools name the files they take, so they never see this one).
// Line fields: ts, kind ('attempt'|'final'), item, invocation (one renderPlan call), run (one process), planSha256, capability, family,
//   attemptIndex (1.. within the invocation; attempt lines), attempts (count so far; final line), stage, ok, status (final), code, detail (<=200 chars),
//   fallback (coordinate-label chain steps used so far, e.g. ["COORDINATE_LEADER"]), variant (which retry this attempt was), durationMs, stageMs.
//   A failed "final" line also carries hint (the engine's advice strings, each cut to 300 chars) and fix (the machine-usable repair steps of figure-result.json), or null.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ATTEMPT_LOG_FILE='attempts.jsonl';
const RUN_ID=crypto.randomUUID().slice(0,8);
const CODE=/[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+/;

// The most specific error code in an engine detail / thrown value, or null.
export function errorCode(x,depth=0){
  if(x===null||x===undefined||depth>5)return null;
  if(typeof x==='string')return CODE.exec(x)?.[0]??null;
  if(typeof x!=='object')return null;
  if(typeof x.code==='string')return x.code;
  const inner=errorCode(x.detail,depth+1)??errorCode(x.result,depth+1)??errorCode(x.error,depth+1)??errorCode(x.message,depth+1);
  if(inner)return inner;
  if(Array.isArray(x.errors))for(const e of x.errors){const c=errorCode(e,depth+1);if(c)return c;}
  if(typeof x.status==='string'&&x.status!=='OK'&&CODE.test(x.status))return x.status;
  return null;
}

const text200=v=>{
  if(v===undefined||v===null)return null;
  let s;
  try{s=typeof v==='string'?v:JSON.stringify(v);}catch{s=String(v);}
  return String(s??'').slice(0,200);
};

export function sha256Hex(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}

// Sha of the plan file bytes (a path), or of the plan's JSON (an object). null when unreadable.
export function planDigest(planInput){
  try{
    if(typeof planInput==='string')return sha256Hex(fs.readFileSync(planInput));
    if(planInput&&typeof planInput==='object')return sha256Hex(Buffer.from(JSON.stringify(planInput)));
  }catch{/* unreadable plan: the render itself reports it */}
  return null;
}

// Per-stage wall clock: lap('measure') adds the time since the previous lap to ms.measure.
export function stopwatch(){
  const start=Date.now();let last=start;const ms={};
  return {ms,lap(name){const now=Date.now();ms[name]=(ms[name]||0)+(now-last);last=now;},total:()=>Date.now()-start};
}

export function createAttemptLog({outDir,item,invocation,planSha256=null}){
  const file=path.join(outDir,ATTEMPT_LOG_FILE);
  const ctx={capability:null,family:null};
  let attempts=0;
  const write=record=>{
    try{fs.appendFileSync(file,JSON.stringify({ts:new Date().toISOString(),...record})+'\n');}catch{/* the log must never break a render */}
  };
  const common=()=>({item,invocation,run:RUN_ID,planSha256,capability:ctx.capability,family:ctx.family});
  return {
    setPlan(plan,fallbackFamily){
      try{
        ctx.capability=typeof plan?.capability==='string'?plan.capability:null;
        ctx.family=plan?.graphPlan?.family??plan?.family??fallbackFamily??null;
        if(typeof ctx.family!=='string')ctx.family=null;
      }catch{/* keep nulls */}
    },
    attempt({variant='initial',stage,ok,code=null,detail=null,fallback=null,watch}){
      try{
        attempts++;
        write({kind:'attempt',...common(),attemptIndex:attempts,variant,stage:stage??null,ok:!!ok,code:ok?null:(code??'UNCLASSIFIED'),detail:ok?null:text200(detail),fallback:fallback&&fallback.length?fallback:null,durationMs:watch?.total?.()??null,stageMs:watch?.ms&&Object.keys(watch.ms).length?{...watch.ms}:null});
      }catch{/* ignore */}
    },
    final({status,stage,code=null,detail=null,fallback=null,durationMs=null,hint=null,fix=null}){
      try{
        const ok=status!=='FAILED';
        write({kind:'final',...common(),attempts,stage:stage??null,ok,status:status??null,code:ok?null:(code??'UNCLASSIFIED'),detail:ok?null:text200(detail),fallback:fallback&&fallback.length?fallback:null,hint:!ok&&Array.isArray(hint)&&hint.length?hint.map(h=>String(h).slice(0,300)):null,fix:!ok&&Array.isArray(fix)&&fix.length?fix:null,durationMs});
      }catch{/* ignore */}
    },
  };
}
