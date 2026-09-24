#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const drift=JSON.parse(fs.readFileSync(path.join(root,global,'B01_B16_MAIN_CATALOG_DRIFT.json'),'utf8'));
const targetM1=new Set(JSON.parse(fs.readFileSync(path.join(root,global,'B01_B16_GLOBAL_COMPRESSION_INPUT.json'),'utf8')).batches.map((b)=>`archive/exams/${b.sourceArchiveFile}`));
const hash=(v)=>crypto.createHash('sha256').update(v).digest('hex');
const norm=(v)=>v.toString('utf8').replaceAll('\r\n','\n');
const fileRows=[];
for(const item of drift.changedSources){
  const p=`archive/exams/${item.sourceFile}`;
  if(!p.startsWith('archive/exams/original/')||targetM1.has(p)||item.sourceFile.includes('..'))throw new Error(`Unsafe catalog dependency ${p}`);
  try{execFileSync('git',['diff','--quiet','HEAD','--',p],{cwd:root});}catch{throw new Error(`Uncommitted source change; refusing to replace ${p}`);}
  const before=fs.readFileSync(path.join(root,p));
  const main=execFileSync('git',['show',`origin/main:${p}`],{cwd:root,maxBuffer:50*1024*1024});
  execFileSync('git',['restore','--source=origin/main','--',p],{cwd:root});
  const after=fs.readFileSync(path.join(root,p));
  if(norm(after)!==norm(main))throw new Error(`Main source parity ${p}`);
  fileRows.push({path:p,beforeSha256:hash(norm(before)),afterSha256:hash(norm(after)),mainSha256:hash(norm(main)),matchesOriginMain:true});
}
const receipt={schemaVersion:'m1-b01-b16-main-catalog-source-alignment-v1',originMainSha:drift.mainSha,dependencyCount:fileRows.length,b01B16SourceMutationCount:0,otherWorkerContentModifiedCount:0,files:fileRows};
fs.writeFileSync(path.join(root,global,'B01_B16_MAIN_SOURCE_ALIGN_RECEIPT.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({originMainSha:drift.mainSha,dependencyCount:fileRows.length,allMatchMain:fileRows.every((r)=>r.matchesOriginMain)},null,2));
