#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const global='archive/_generated/intelligence/phase1/middle1-foundation/global';
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha=(bytes)=>crypto.createHash('sha256').update(bytes).digest('hex');
const mapping=read(`${global}/B01_B16_CANONICAL_MAPPING.json`);
const input=read(`${global}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`);
const identity=read('archive/data/question_identity_map.json');
const bySource=new Map(identity.records.map((r)=>[`${r.sourceArchiveFile}#${r.sourceOrdinal}`,r]));
const byUid=new Map(mapping.uidMappings.map((m)=>[m.questionUid,m]));
const dryRun=process.argv.includes('--dry-run');
const loadBank=(source,file)=>{const context={window:{},console:{log(){},warn(){},error(){}}};context.globalThis=context;vm.createContext(context);vm.runInContext(source,context,{filename:file,timeout:3000});return context.window.questionBank||context.window.questions||context.questionBank||context.questions;};
const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const protectedKeys=new Set(['content','choices','answer','solution','image','layoutTag','wide']);
const allowed=new Set(['problemTypeKey','templateKey','crossConceptKeys']);
const fileReceipts=[];
let changedUid=0;
for(const batch of input.batches){
  const p=`archive/exams/${batch.sourceArchiveFile}`;
  const full=path.join(root,p);
  const beforeBytes=fs.readFileSync(full);
  if(sha(beforeBytes)!==batch.sourceJsSha256)throw new Error(`Source drift before normalization: ${p}`);
  const before=beforeBytes.toString('utf8');
  const lines=before.split(/\r?\n/),eol=before.includes('\r\n')?'\r\n':'\n';
  const blocks=[];let start=-1;
  for(let i=0;i<lines.length;i++){
    if(lines[i]==='  {'){if(start!==-1)throw new Error(`Nested block ${p}:${i}`);start=i;}
    else if(start!==-1&&/^  \},?$/.test(lines[i])){blocks.push({start,end:i});start=-1;}
  }
  const bank=loadBank(before,p);
  if(blocks.length!==batch.questionCount||bank.length!==batch.questionCount)throw new Error(`Question count ${p}`);
  const replacements=new Map();const changes=[];
  for(let i=0;i<bank.length;i++){
    const ordinal=i+1;
    const id=bySource.get(`${batch.sourceArchiveFile}#${ordinal}`);
    if(!id)throw new Error(`Missing identity ${p}#${ordinal}`);
    const m=byUid.get(id.questionUid);
    if(!m)continue; // explicit semantic HOLD or ROUTE_OUT, source remains untouched
    if(m.batchNo!==batch.batchNo||m.sourceOrdinal!==ordinal||m.sourceArchiveFile!==batch.sourceArchiveFile)throw new Error(`UID map mismatch ${id.questionUid}`);
    const q=bank[i];
    if(q.problemTypeKey!==m.oldProblemTypeKey||q.templateKey!==m.oldTemplateKey||!same(q.crossConceptKeys,m.oldCrossConceptKeys))throw new Error(`Provisional source metadata mismatch ${id.questionUid}`);
    const block=lines.slice(blocks[i].start,blocks[i].end+1);
    const fields={problemTypeKey:m.finalProblemTypeKey,templateKey:m.finalTemplateKey,crossConceptKeys:m.finalCrossConceptKeys};
    for(const [key,value] of Object.entries(fields)){
      const idx=block.findIndex((line)=>line.startsWith(`    "${key}":`));
      if(idx<0)throw new Error(`Missing existing ${key} ${id.questionUid}`);
      const comma=block[idx].trimEnd().endsWith(',')?',':'';
      block[idx]=`    "${key}": ${JSON.stringify(value)}${comma}`;
    }
    replacements.set(blocks[i].start,{end:blocks[i].end,lines:block});
    changes.push({questionUid:id.questionUid,sourceOrdinal:ordinal,oldProblemTypeKey:m.oldProblemTypeKey,finalProblemTypeKey:m.finalProblemTypeKey,oldTemplateKey:m.oldTemplateKey,finalTemplateKey:m.finalTemplateKey,oldCrossConceptKeys:m.oldCrossConceptKeys,finalCrossConceptKeys:m.finalCrossConceptKeys});
  }
  const next=[];
  for(let i=0;i<lines.length;i++){const replacement=replacements.get(i);if(replacement){next.push(...replacement.lines);i=replacement.end;}else next.push(lines[i]);}
  const after=next.join(eol),afterBank=loadBank(after,p);
  if(afterBank.length!==bank.length)throw new Error(`After bank count ${p}`);
  for(let i=0;i<bank.length;i++){
    for(const key of new Set([...Object.keys(bank[i]),...Object.keys(afterBank[i])])){
      if(allowed.has(key))continue;
      if(!same(bank[i][key],afterBank[i][key]))throw new Error(`Non-metadata mutation ${p}#${i+1}:${key}`);
    }
    for(const key of protectedKeys)if(!same(bank[i][key],afterBank[i][key]))throw new Error(`Protected mutation ${p}#${i+1}:${key}`);
  }
  if(!dryRun)fs.writeFileSync(full,after,'utf8');
  changedUid+=changes.length;
  fileReceipts.push({batchNo:batch.batchNo,sourceArchiveFile:batch.sourceArchiveFile,beforeSha256:sha(beforeBytes),afterSha256:sha(Buffer.from(after)),questionCount:bank.length,changedUidCount:changes.length,heldOrRouteOutUnchanged:bank.length-changes.length,protectedMutationCount:0,nonMetadataMutationCount:0,changes});
}
const receipt={schemaVersion:'m1-b01-b16-source-normalization-receipt-v1',sourceHead:input.sourceHead,files:fileReceipts.length,uidDenominator:input.counts.uniqueUid,changedUidCount:changedUid,holdOrRouteOutUnchanged:input.counts.uniqueUid-changedUid,protectedMutationCount:0,nonMetadataMutationCount:0,dryRun,fileReceipts};
if(changedUid!==mapping.uidMappings.length)throw new Error(`Writeback ${changedUid}/${mapping.uidMappings.length}`);
if(!dryRun)fs.writeFileSync(path.join(root,`${global}/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json`),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({dryRun,files:receipt.files,uidDenominator:receipt.uidDenominator,changedUidCount:receipt.changedUidCount,holdOrRouteOutUnchanged:receipt.holdOrRouteOutUnchanged,protectedMutationCount:0},null,2));
