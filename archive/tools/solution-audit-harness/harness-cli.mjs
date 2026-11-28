#!/usr/bin/env node
/** External/Git worker only. Gemini does NOT invoke this CLI. */
import fs from 'node:fs';
import { freezePacket, extractFromRepository, validateDraft, writeNewJson } from './harness-core.mjs';

function parse(args){
  const [operation,...rest]=args;if(!['extract','validate'].includes(operation))throw Error('USAGE: extract|validate --...');
  const o={};for(let i=0;i<rest.length;i+=2){let key=rest[i];if(!/^--[a-z-]+$/.test(key)||!rest[i+1])throw Error('INVALID_ARGUMENT');o[key.slice(2)]=rest[i+1]}return {operation,...o};
}
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
try{
  const a=parse(process.argv.slice(2));
  if(!a.out)throw Error('OUT_REQUIRED');
  if(a.operation==='extract'){
    for(const k of ['repo','exam','batch'])if(!a[k])throw Error('EXTRACT_'+k.toUpperCase()+'_REQUIRED');
    const packet=extractFromRepository({repo:a.repo,relative:a.exam,batchId:a.batch,headSha:a['expected-head'],identityMap:a['identity-map']?load(a['identity-map']):null});
    writeNewJson(a.out,packet);console.log(JSON.stringify({status:'PACKET_FROZEN',examCount:packet.examCount,packetSha256:packet.packetSha256,identityHolds:packet.items.filter(i=>i.identityStatus==='IDENTITY_HOLD').length}));
  }else{
    for(const k of ['packet','draft'])if(!a[k])throw Error('VALIDATE_'+k.toUpperCase()+'_REQUIRED');
    const res=validateDraft({packet:load(a.packet),draft:load(a.draft),currentSource:a['current-source']?fs.readFileSync(a['current-source'],'utf8'):null,expectedGitBlobSha:a['expected-blob']});
    writeNewJson(a.out,res);console.log(JSON.stringify({status:res.status,errors:res.errors}));
    if(res.errors.length)process.exitCode=1;
  }
}catch(err){console.error(JSON.stringify({status:'ERROR',error:err.message}));process.exitCode=1;}
