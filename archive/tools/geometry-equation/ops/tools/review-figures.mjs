// Independent fidelity review of the figures before they are published: a headless reviewer (Claude CLI, or REVIEW_BACKEND=opencode) reads the question, the stored solution and the rendered figure.
// usage: node review-figures.mjs <rows.json> <worktreeRoot> <outDir>      (resumable: items that already have review.json are skipped)
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {spawn,spawnSync} from 'node:child_process';
const CHROME=process.env.APMS_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [rowsPath,root,outDir]=process.argv.slice(2);
const CLAUDE=process.env.APMS_CLAUDE||'C:/Users/USER/AppData/Roaming/Claude/claude-code/2.1.299/f0584be0fbaf/claude.exe';
const AUTO=path.dirname(decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\//,''));
const CHUNK=Number(process.env.REVIEW_CHUNK||6),PARALLEL=Number(process.env.REVIEW_PARALLEL||3),MODEL=process.env.REVIEW_MODEL||'sonnet';
const {launchBrowser}=await import(new URL('../../visual-browser-runtime.mjs',import.meta.url).href);
const browser=await launchBrowser();
let rows=JSON.parse(fs.readFileSync(rowsPath,'utf8'));
if(process.env.REVIEW_FILTER){const keep=new Set(JSON.parse(fs.readFileSync(process.env.REVIEW_FILTER,'utf8')));rows=rows.filter(r=>keep.has(path.basename(r.src.split(String.fromCharCode(92)).join('/'),'.js')+'__q'+r.ord));}fs.mkdirSync(outDir,{recursive:true});
const log=(...a)=>console.log('[review]',...a);
const bankOf=text=>{const w={};vm.runInNewContext(text.replace(/^\uFEFF/,''),{window:w});return w.questionBank;};
const banks=new Map();
const itemDirs=[];
for(const r of rows){
  const rel=r.src.split(/archive[\\/]/).pop(),uid=path.basename(rel,'.js'),id=`${uid}__q${r.ord}`,dir=path.join(outDir,'items',id);
  r.id=id;r.dir=dir;
  if(fs.existsSync(path.join(dir,'review.json')))continue;
  if(!banks.has(rel))banks.set(rel,bankOf(fs.readFileSync(path.join(root,'archive',rel),'utf8')));
  const q=banks.get(rel).find(x=>x.id===r.ord);if(!q)continue;
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'item.json'),JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution},null,1));
  // Render the figure at its own size with Playwright (one browser for all figures); the campaign report PNGs use a fixed window and cut tall figures.
  const svgText=fs.readFileSync(r.svg,'utf8'),w=Number(/<svg[^>]*\swidth="([\d.]+)"/.exec(svgText)?.[1]||640),h=Number(/<svg[^>]*\sheight="([\d.]+)"/.exec(svgText)?.[1]||640);
  const out=path.join(dir,'figure.png');
  try{const pg=await browser.newPage({viewport:{width:Math.ceil(w)+20,height:Math.ceil(h)+20},deviceScaleFactor:1});await pg.setContent('<body style="margin:10px;background:#fff">'+svgText+'</body>');await pg.screenshot({path:out,fullPage:true});await pg.close();}catch(e){log('render failed',id,String(e.message).slice(0,60));}
  if(!fs.existsSync(out))fs.copyFileSync(r.svg,path.join(dir,'figure.svg'));
  itemDirs.push(dir);
}
log('items to review',itemDirs.length);
const prompt=dir=>`You are an independent reviewer of math solution figures for a Korean high-school exam bank. Work ONLY in ${dir}. Each subfolder (named like <exam>__q<N>) has item.json (the question text with LaTeX, choices, answer and the stored student solution) and figure.png (the rendered figure that will be shown under the solution; if only figure.svg exists, read it as text and judge from its labels). For EVERY subfolder, open item.json and look at the figure image, then write review.json in that subfolder: {"verdict":"PASS"|"FAIL"|"UNCERTAIN","reasons":["short Korean sentences"]}.
Judge strictly and independently, do not trust the figure:
1. Consistency: every number, coordinate, length, point name and equation visible in the figure must agree with the question and the stored solution (no invented, contradicting or wrongly computed values; recompute simple values yourself).
2. Relevance: the figure must show geometry/graph that the solution actually uses (not a different configuration than the problem describes).
3. Legibility: labels are readable, not overlapping the drawing in a confusing way, nothing important cut off.
PASS only if all three hold. FAIL when you can point to a concrete contradiction or an unreadable/misleading figure. UNCERTAIN when you cannot tell. Do not edit anything except review.json files. Reply with one line when all are written.`;
// REVIEW_BACKEND=opencode: the reviewer runs on the OpenCode Go subscription instead of the Claude CLI (when Claude tokens are out).
// REVIEW_OPENCODE_MODEL picks a vision-capable model of a DIFFERENT family than the implementer (default gemini-4-argon; DeepSeek implements).
const OC_BIN=process.env.OPENCODE_BIN||'C:/nvm4w/nodejs/node_modules/opencode-ai/bin/opencode.exe';
const BACKEND=process.env.REVIEW_BACKEND||'claude',OC_MODEL=process.env.REVIEW_OPENCODE_MODEL||'opencode-go/gemini-4-argon';
const OC_CONFIG=process.env.OPENCODE_CONFIG||path.join(AUTO,'..','workers','opencode-worker.json');
const spawnOpencode=(dir,p)=>new Promise(res=>{const c=spawn(OC_BIN,['run',p,'--model',OC_MODEL,'--dir',dir,'--auto','--title','review-'+path.basename(dir)],{cwd:dir,env:{...process.env,OPENCODE_CONFIG:OC_CONFIG},stdio:['ignore','pipe','pipe']});let o='',e='';c.stdout.on('data',d=>o+=d);c.stderr.on('data',d=>e+=d);const t=setTimeout(()=>c.kill(),25*60e3);
  c.on('close',code=>{clearTimeout(t);try{const list=spawnSync(OC_BIN,['session','list'],{encoding:'utf8'}).stdout||'';for(const line of list.split('\n'))if(line.includes('review-'+path.basename(dir)))spawnSync(OC_BIN,['session','delete',line.trim().split(/\s+/)[0]]);}catch{}
    res({code,o:JSON.stringify({result:o.slice(-400),is_error:code!==0||/Failed to execute statement/.test(o+e)}),e});});});
const spawnCli=(dir,p)=>BACKEND==='opencode'?spawnOpencode(dir,p):spawnClaude(dir,p);
const spawnClaude=(dir,p)=>new Promise(res=>{const c=spawn(CLAUDE,['-p',p,'--model',MODEL,'--allowedTools','Read','Write','Glob','Grep','--permission-mode','acceptEdits','--add-dir',dir,'--no-session-persistence','--output-format','json'],{cwd:dir,stdio:['ignore','pipe','pipe']});let o='',e='';c.stdout.on('data',d=>o+=d);c.stderr.on('data',d=>e+=d);const t=setTimeout(()=>c.kill(),25*60e3);c.on('close',code=>{clearTimeout(t);res({code,o,e});});});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let tokens=0,calls=0;
const run=async chunk=>{
  // stage the chunk as one folder of symlink-free copies so the reviewer only sees its own items
  const cdir=path.join(outDir,'chunks',`c${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`);fs.mkdirSync(cdir,{recursive:true});
  for(const d of chunk){const t=path.join(cdir,path.basename(d));fs.mkdirSync(t,{recursive:true});for(const f of fs.readdirSync(d))if(f!=='review.json')fs.copyFileSync(path.join(d,f),path.join(t,f));}
  const started=Date.now();
  for(;;){
    const r=await spawnCli(cdir,prompt(cdir));let j=null;try{j=JSON.parse(r.o);}catch{}
    if(j?.usage){tokens+=(j.usage.input_tokens||0)+(j.usage.output_tokens||0)+(j.usage.cache_creation_input_tokens||0);calls++;}
    if(j?.is_error||r.code!==0){fs.appendFileSync(path.join(outDir,'cli-errors.log'),`${new Date().toISOString()} ${String(j?.result||r.e).slice(0,200)}\n`);if(Date.now()-started>8*3600e3){log('gave up');return;}log('cli failed, waiting 10 min');await sleep(600e3);continue;}
    break;
  }
  for(const d of chunk){const f=path.join(cdir,path.basename(d),'review.json');if(fs.existsSync(f))fs.copyFileSync(f,path.join(d,'review.json'));}
  log('chunk done',chunk.length,'tokens so far',tokens,'calls',calls);
};
const chunks=[];for(let i=0;i<itemDirs.length;i+=CHUNK)chunks.push(itemDirs.slice(i,i+CHUNK));
const queue=[...chunks];await Promise.all(Array.from({length:PARALLEL},async()=>{while(queue.length)await run(queue.shift());}));
const out={};for(const r of rows){try{out[r.id]=JSON.parse(fs.readFileSync(path.join(r.dir,'review.json'),'utf8'));}catch{out[r.id]={verdict:'MISSING'};}}
fs.writeFileSync(path.join(outDir,'review-summary.json'),JSON.stringify(out,null,1));
const c={};for(const v of Object.values(out))c[v.verdict]=(c[v.verdict]||0)+1;log('verdicts',JSON.stringify(c));await browser.close();
