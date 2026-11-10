// Summarizes render attempt logs: walks <runs-root>/**/attempts.jsonl (written by production/render-plan.mjs) and prints
//   1. per capability/family: renders per question (median, p90, max) and invocations per question
//   2. the top error codes, by count and by the stage where they occur
//   3. coordinate-label fallback usage
// usage: node archive/tools/geometry-equation/ops/tools/attempt-stats.mjs <runs-root> [--json]
// A question = one item in one output folder. A render = one attempt line (the internal retries of one render-plan call count separately);
// an invocation that failed before any attempt (frame, model, read-plan ...) counts as one render, except read-plan failures and EXEMPT/UNSUPPORTED plans, which render nothing.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const ATTEMPT_LOG_FILE='attempts.jsonl';
const SKIP_DIRS=new Set(['node_modules','.git']);

export function findLogs(root){
  const found=[];
  const walk=dir=>{
    let entries;
    try{entries=fs.readdirSync(dir,{withFileTypes:true});}catch{return;}
    for(const entry of entries){
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()){if(!SKIP_DIRS.has(entry.name))walk(full);}
      else if(entry.name===ATTEMPT_LOG_FILE)found.push(full);
    }
  };
  walk(root);
  return found.sort();
}

export function readLog(file){
  const lines=[];let malformed=0;
  for(const text of fs.readFileSync(file,'utf8').split('\n')){
    if(!text.trim())continue;
    try{const record=JSON.parse(text);if(record&&typeof record==='object')lines.push(record);else malformed++;}catch{malformed++;}
  }
  return {lines,malformed};
}

const nearestRank=(sorted,p)=>sorted.length?sorted[Math.max(0,Math.ceil(p*sorted.length)-1)]:null;
const median=sorted=>{
  if(!sorted.length)return null;
  const mid=sorted.length>>1;
  return sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2;
};
const distribution=values=>{
  const sorted=[...values].sort((a,b)=>a-b);
  return {median:median(sorted),p90:nearestRank(sorted,0.9),max:sorted.length?sorted[sorted.length-1]:null};
};
const bump=(map,key,by=1)=>map.set(key,(map.get(key)||0)+by);
const classOf=record=>(record.capability||'(unknown)')+(record.family?'/'+record.family:'');

// logs: [{dir, lines:[record,...]}]  ->  plain summary object (see printSummary for the layout)
export function summarize(logs){
  const questions=new Map();// dir|item -> {class, runs: Map(invocation -> {attempts, final})}
  const codes=new Map(),codeStages=new Map(),fallbacks=new Map();
  let lineCount=0;
  for(const {dir,lines} of logs){
    for(const record of lines){
      lineCount++;
      const questionKey=dir+'\u0000'+(record.item??'');
      let question=questions.get(questionKey);
      if(!question){question={class:classOf(record),runs:new Map()};questions.set(questionKey,question);}
      if(record.capability)question.class=classOf(record);
      const runKey=record.invocation??'?';
      let run=question.runs.get(runKey);
      if(!run){run={attempts:[],final:null};question.runs.set(runKey,run);}
      if(record.kind==='attempt')run.attempts.push(record);
      else if(record.kind==='final')run.final=record;
    }
  }
  const perClass=new Map();
  for(const question of questions.values()){
    let renders=0,invocations=0,rendered=false;
    for(const run of question.runs.values()){
      const lastAttempt=run.attempts[run.attempts.length-1];
      // fail codes: every failed attempt, plus the final failure unless the last attempt already reported that same failure
      for(const attempt of run.attempts)if(attempt.ok===false){bump(codes,attempt.code);bump(codeStages,attempt.code+'\u0000'+attempt.stage);}
      const final=run.final;
      if(final&&final.ok===false&&!(lastAttempt&&lastAttempt.ok===false&&lastAttempt.code===final.code)){bump(codes,final.code);bump(codeStages,final.code+'\u0000'+final.stage);}
      const steps=new Set();
      for(const record of [...run.attempts,...(final?[final]:[])])for(const step of record.fallback||[])steps.add(step);
      for(const step of steps)bump(fallbacks,step);
      invocations++;
      const noRender=final&&(final.stage==='read-plan'||final.status==='EXEMPT'||final.status==='UNSUPPORTED');
      if(run.attempts.length||(final&&!noRender)){renders+=Math.max(1,run.attempts.length);rendered=true;}
    }
    if(!rendered)continue;
    const entry=perClass.get(question.class)||{renders:[],invocations:[]};
    entry.renders.push(renders);entry.invocations.push(invocations);
    perClass.set(question.class,entry);
  }
  const classes=[...perClass.entries()].map(([name,entry])=>({name,questions:entry.renders.length,rendersPerQuestion:distribution(entry.renders),invocationsPerQuestion:distribution(entry.invocations)})).sort((a,b)=>b.questions-a.questions||a.name.localeCompare(b.name));
  const total=classes.reduce((sum,c)=>sum+c.questions,0);
  const all=[...perClass.values()];
  const overall={questions:total,rendersPerQuestion:distribution(all.flatMap(e=>e.renders)),invocationsPerQuestion:distribution(all.flatMap(e=>e.invocations))};
  const errorCodes=[...codes.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([code,count])=>({code,count,stages:Object.fromEntries([...codeStages.entries()].filter(([key])=>key.split('\u0000')[0]===code).map(([key,n])=>[key.split('\u0000')[1],n]).sort((a,b)=>b[1]-a[1]))}));
  return {lines:lineCount,overall,classes,errorCodes,fallbacks:[...fallbacks.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([step,runs])=>({step,runs}))};
}

export function formatSummary(summary,{files=0,malformed=0}={}){
  const out=[];
  const dist=d=>`median ${d.median}  p90 ${d.p90}  max ${d.max}`;
  out.push(`attempt logs: ${files} file(s), ${summary.lines} line(s)${malformed?`, ${malformed} malformed line(s) skipped`:''}`);
  out.push('');
  out.push(`Renders per question (all rendered questions: ${summary.overall.questions}): ${summary.overall.questions?dist(summary.overall.rendersPerQuestion):'-'}`);
  out.push('');
  out.push('Per capability/family   [questions | renders per question | invocations per question]');
  for(const c of summary.classes)out.push(`  ${c.name}  [${c.questions} | ${dist(c.rendersPerQuestion)} | ${dist(c.invocationsPerQuestion)}]`);
  if(!summary.classes.length)out.push('  (none)');
  out.push('');
  out.push('Error codes (failed attempts and final failures)   [count: stage=count ...]');
  for(const e of summary.errorCodes.slice(0,15))out.push(`  ${e.code}  [${e.count}: ${Object.entries(e.stages).map(([stage,n])=>`${stage}=${n}`).join(' ')}]`);
  if(!summary.errorCodes.length)out.push('  (none)');
  out.push('');
  out.push('Fallback steps used   [renders that stepped]');
  for(const f of summary.fallbacks)out.push(`  ${f.step}  [${f.runs}]`);
  if(!summary.fallbacks.length)out.push('  (none)');
  return out.join('\n')+'\n';
}

export function main(argv){
  const args=argv.filter(a=>!a.startsWith('--'));
  const asJson=argv.includes('--json');
  if(args.length!==1){console.error('usage: node attempt-stats.mjs <runs-root> [--json]');return 2;}
  const root=path.resolve(args[0]);
  if(!fs.existsSync(root)){console.error('runs root not found: '+root);return 2;}
  const files=findLogs(root);
  let malformed=0;
  const logs=files.map(file=>{const {lines,malformed:bad}=readLog(file);malformed+=bad;return {dir:path.dirname(file),lines};});
  const summary=summarize(logs);
  process.stdout.write(asJson?JSON.stringify({files:files.length,malformed,...summary},null,1)+'\n':formatSummary(summary,{files:files.length,malformed}));
  return 0;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)process.exit(main(process.argv.slice(2)));
