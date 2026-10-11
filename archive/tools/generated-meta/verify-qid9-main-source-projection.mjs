#!/usr/bin/env node
// Generic exact-roster audit for configured QID9 main-source imports.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const spec=read('archive/data/generated-source-import-roots-v1.json');
const index=read('archive/data/generated-lite-consumer/v1/index.json');
const byUid=new Map();
for(const row of index.records||[]){if(!byUid.has(row.uid))byUid.set(row.uid,[]);byUid.get(row.uid).push(row);}
let count=0,assets=0,shards=new Set();
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const entry of spec.roots){
 let local=0;const dir=path.join(root,entry.directory),names=fs.readdirSync(dir).filter(n=>/^GPT_QID9_Q\d{2}_CREATE_DRAFT\.json$/.test(n)).sort();
 if(names.length!==entry.expectedSourceQidCount)throw Error('PROJECTION_SOURCE_QID_COUNT:'+names.length);
 for(const name of names){
  const doc=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
  const originalSha=doc.source?.gitBlobSha1||doc.source?.gitBlob;
  if(doc.questions?.length!==9)throw Error('PROJECTION_SOURCE_9_SLOTS:'+name);
  for(const q of doc.questions){
   const rows=byUid.get(q.uid)||[];
   if(rows.length!==1)throw Error('PROJECTION_UID_MISSING_OR_DUPLICATE:'+q.uid+':'+rows.length);
   const r=rows[0];
   if(!r.mainSourceAvailable||r.technicalStatus!=='READY'||r.consumerSelectable===false||r.userDisabled)throw Error('PROJECTION_NOT_STUDENT_AVAILABLE:'+q.uid+':'+r.technicalStatus);
   if(r.sourceQid!==q.sourceQid||r.sourceExamPath!==doc.source.path||r.sourceExamBlobSha!==originalSha)throw Error('PROJECTION_SOURCE_BINDING:'+q.uid);
   if(!eq(r.meta,q.meta))throw Error('PROJECTION_METADATA_PARITY:'+q.uid);
   if(!r.sourceShard.startsWith('archive/generated/lite/v1/')||!r.sourceShard.endsWith('.js'))throw Error('PROJECTION_SOURCE_SHARD:'+q.uid);
   const consumer=read('archive/'+r.shard),records=(consumer.records||[]).filter(x=>x.generatedUid===q.uid);
   if(records.length!==1)throw Error('PROJECTION_CONSUMER_MISSING_OR_DUPLICATE:'+q.uid);
   const o=records[0].question;
   if(!o||o.uid!==q.uid||!eq(o.choices,q.choices)||o.content!==q.content||o.answer!==q.answer||o.solution!==q.solution||!eq(o.provenance,q.provenance))throw Error('PROJECTION_STUDENT_BODY_PARITY:'+q.uid);
   for(const field of ['image','solutionImage']){
    if(!q[field])continue;
    const ref=o[field];
    if(typeof ref!=='string'||!ref.startsWith('assets/generated-lite/qid9/'))throw Error('PROJECTION_ASSET_REFERENCE:'+q.uid+':'+field);
    const physical=path.join(root,'archive',ref);
    if(!fs.existsSync(physical)||fs.statSync(physical).size===0)throw Error('PROJECTION_ASSET_MISSING:'+q.uid+':'+ref);
    if(ref.endsWith('.svg')){
     const s=fs.readFileSync(physical,'utf8');
     if(!s.includes('<svg')||!s.includes('</svg>'))throw Error('PROJECTION_SVG_MALFORMED:'+q.uid);
    }
    assets++;
   }
   shards.add(r.sourceShard);local++;count++;
  }
 }
 if(local!==entry.expectedUidCount)throw Error('PROJECTION_ROSTER_COUNT:'+local);
}
if(count!==spec.expectedTotalUids||shards.size!==spec.roots.reduce((n,e)=>n+e.expectedSourceQidCount,0))throw Error('PROJECTION_TOTAL_COUNT:'+count+':'+shards.size);
console.log('QID9_COMMON_PROJECTION_PASS '+JSON.stringify({uidCount:count,uniqueUidCount:count,sourceShards:shards.size,verifiedVisualRefs:assets,approvalNotUsedAsAvailabilityGate:true}));
