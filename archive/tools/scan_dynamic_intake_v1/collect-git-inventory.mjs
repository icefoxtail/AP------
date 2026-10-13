#!/usr/bin/env node
/**
 * Read-only Git/GitHub inventory collector, for use in an authenticated checkout.
 * Fails closed if remote branch coverage or open PR inspection is incomplete.
 * Library and stage receipts are connector-backed, imported separately as JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gitSnapshot } from './scan-dispatch.mjs';
const cli=(a)=>{const o={};for(let i=0;i<a.length;i++){
 const x=a[i];if(!x.startsWith('--'))throw Error('Invalid option '+x);
 if(x==='--help'){o.help=true;continue;}
 if(i+1>=a.length||a[i+1].startsWith('--'))throw Error('Missing value for '+x);o[x.slice(2)]=a[++i];
}return o;};
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:80*1024*1024,timeout:120000});
const gh=(...a)=>execFileSync('gh',a,{encoding:'utf8',maxBuffer:80*1024*1024,timeout:120000});
const recordError=e=>(e?.message||String(e)).slice(0,600);
function remoteBranches(){
 let remoteRows=[];try{
  const lines=git('ls-remote','--heads','origin').trim().split('\n').filter(Boolean);
  remoteRows=lines.map(x=>{const m=x.match(/^([0-9a-f]{40})\s+refs\/heads\/(.+)$/);if(!m)throw Error('Bad ls-remote row');return {ref:'origin/'+m[2],name:m[2],sha:m[1]};});
 }catch(e){return {complete:false,reason:'Cannot query all remote branch heads: '+recordError(e),branches:[]};}
 let local=[];try{
   local=git('for-each-ref','--format=%(refname:short) %(objectname)','refs/remotes/origin/').trim().split('\n').filter(Boolean).map(x=>{
    const m=x.match(/^(.+) ([a-f0-9]{40})$/);if(!m)throw Error('Bad for-each-ref row');return{ref:m[1],sha:m[2]};});
 }catch(e){return {complete:false,reason:'Cannot inspect local remote-tracking refs: '+recordError(e),branches:[]};}
 const lookup=new Map(local.map(x=>[x.ref,x.sha]));const missing=remoteRows.filter(x=>lookup.get(x.ref)!==x.sha);
 if(missing.length)return {complete:false,reason:`${missing.length}/${remoteRows.length} remote heads missing/stale in checkout. Fetch remote refs explicitly before retrying.`,missing:missing.slice(0,25),branches:[],remoteCount:remoteRows.length};
 const filtered=[];const treeCache=new Map();
 for(const x of remoteRows){
  if(x.name==='main')continue;
  let treeSha;
  try{treeSha=git('rev-parse',`${x.ref}:archive/exams/original`).trim();}
  catch(e){treeSha='ABSENT';}
  if(!treeCache.has(treeSha)){
    if(treeSha==='ABSENT'){treeCache.set(treeSha,[]);continue;}
    try{
      const text=git('ls-tree','-r',x.ref,'--','archive/exams/original');
      const names=text.trim().split('\n').map(v=>v.match(/^[0-9]+ blob [a-f0-9]{40}\t(.+)$/)?.[1]).filter(Boolean).filter(p=>p.endsWith('.js'));
      treeCache.set(treeSha,names);
    }catch(e){return{complete:false,reason:`Branch ${x.ref} read failed: ${recordError(e)}`,branches:filtered,remoteCount:remoteRows.length};}
  }
  const names=treeCache.get(treeSha);
  if(names.length)filtered.push({name:x.name,ref:x.ref,head:x.sha,files:names});
 }
 return{complete:true,branchCount:remoteRows.length,source:'git ls-remote vs all local refs; remote heads SHA matched',branches:filtered};
}
function prSnapshot(repo){
 const limit=500;
 try{
  const p=JSON.parse(gh('pr','list','--repo',repo,'--state','open','--limit',String(limit),'--json','number,url,headRefName'));
  if(p.length>=limit)return{complete:false,reason:`PR count >= ${limit}, pagination completeness unknown`,prs:[]};
  const prs=[];
  for(const x of p){const url=`repos/${repo}/pulls/${x.number}/files?per_page=100`;
    let files=gh('api','--paginate','--jq','.[].filename',url).trim().split('\n').filter(Boolean);
    prs.push({number:x.number,url:x.url,headRefName:x.headRefName,files});
  }
  return {complete:true,prs,prCount:p.length,source:'gh pr list + gh api paginated PR files'};
 }catch(e){return {complete:false,prs:[],reason:'GitHub CLI open PR index unavailable: '+recordError(e)};}
}
function write(f,data){fs.writeFileSync(f,JSON.stringify(data,null,2)+'\n','utf8');}
function main(args){
 const o=cli(args);if(o.help){console.log('Usage: node collect-git-inventory.mjs --outdir path [--repo icefoxtail/AP------] [--source-ref origin/codex/scan-intake-deliverables-20261012] [--production-ref origin/main]');return;}
 const outdir=o.outdir||'./scan-snapshots';fs.mkdirSync(outdir,{recursive:true});
 const refs={sourceRef:o['source-ref']||'origin/codex/scan-intake-deliverables-20261012',productionRef:o['production-ref']||'origin/main'};
 const snapshot=gitSnapshot(refs),branches=remoteBranches(),prs=prSnapshot(o.repo||'icefoxtail/AP------');
 write(path.join(outdir,'git-source-index.json'),snapshot.source);
 write(path.join(outdir,'git-production-index.json'),snapshot.production);
 write(path.join(outdir,'git-branches-index.json'),branches);
 write(path.join(outdir,'git-open-prs-index.json'),prs);
 const summary={generatedAt:new Date().toISOString(),scope:'READ_ONLY',sourceHead:snapshot.source.sha,mainHead:snapshot.production.sha,sourceCount:snapshot.source.items.length,productionFiles:snapshot.production.files.length,branchesComplete:branches.complete,prComplete:prs.complete,branchCount:branches.branchCount,prCount:prs.prCount,blockers:[branches.reason,prs.reason].filter(Boolean)};
 write(path.join(outdir,'collector-summary.json'),summary);console.log(JSON.stringify(summary,null,2));
 if(!branches.complete||!prs.complete)process.exitCode=2;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main(process.argv.slice(2));}catch(e){console.error(e.stack||e);process.exitCode=1;}
}
