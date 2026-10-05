#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const require=createRequire(import.meta.url);
const core=require(path.join(root,'archive/archive2-core.js'));
const file='archive/data/archive2-catalog.json';
const branchBytes=fs.readFileSync(path.join(root,file));
const mainBytes=execFileSync('git',['show',`origin/main:${file}`],{cwd:root,maxBuffer:100*1024*1024});
const mainSha=execFileSync('git',['rev-parse','origin/main'],{cwd:root}).toString().trim();
const hash=(bytes)=>crypto.createHash('sha256').update(bytes).digest('hex');
const before=core.decodeCatalog(JSON.parse(branchBytes.toString('utf8'))),after=core.decodeCatalog(JSON.parse(mainBytes.toString('utf8')));
const old=new Map(before.records.map((r)=>[r.questionUid,r])),next=new Map(after.records.map((r)=>[r.questionUid,r]));
const changed=[],added=[],removed=[];
for(const [uid,row] of next){const prior=old.get(uid);if(!prior)added.push(uid);else if(JSON.stringify(prior)!==JSON.stringify(row))changed.push({questionUid:uid,sourceFile:row.sourceFile,changedFields:[...new Set([...Object.keys(prior),...Object.keys(row)])].filter((k)=>JSON.stringify(prior[k])!==JSON.stringify(row[k]))});}
for(const uid of old.keys())if(!next.has(uid))removed.push(uid);
const oldHashes=new Map(before.sourceHashes),newHashes=new Map(after.sourceHashes);
const changedSources=[...newHashes].filter(([p,h])=>oldHashes.get(p)!==h).map(([p,h])=>({sourceFile:p,oldSha256:oldHashes.get(p)||null,newSha256:h}));
const output={schemaVersion:'m1-b01-b16-main-catalog-drift-v1',mainSha,branchHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root}).toString().trim(),
  branchCatalogSha256:hash(branchBytes),mainCatalogSha256:hash(mainBytes),
  counts:{branchRecords:before.records.length,mainRecords:after.records.length,changedRecords:changed.length,addedRecords:added.length,removedRecords:removed.length,changedSources:changedSources.length,
    changedM1B01B16Records:changed.filter((r)=>r.sourceFile?.startsWith('original/middle/m1/')).length},
  changed,added,removed,changedSources};
const out=path.join(root,'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_MAIN_CATALOG_DRIFT.json');
fs.writeFileSync(out,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({mainSha,counts:output.counts,changedSources:changedSources.slice(0,10),changedRecords:changed.slice(0,10)},null,2));
