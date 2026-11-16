#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadRecords,aggregate,parseArgs,outsideOutput,toTsv} from './lib.mjs';
export function buildMap(root,selection){const {records,taxonomy,issues}=loadRecords(root,selection);return {...aggregate(records,{taxonomy,selection}),inputIssues:issues,unquantifiedInput:issues.some(r=>r.unquantified)};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{const o=parseArgs(process.argv.slice(2),['--scope','--course','--out','--format']);const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),out=outsideOutput(root,o.out);if(o.format&&!['json','tsv'].includes(o.format))throw Error('INVALID_FORMAT');const start=performance.now();const map=buildMap(root,{scope:o.scope,course:o.course});map.elapsedMs=Math.round(performance.now()-start);fs.writeFileSync(out,o.format==='tsv'?toTsv(map):JSON.stringify(map,null,2)+'\n');console.log(JSON.stringify({out,elapsedMs:map.elapsedMs,values:map.views.values.summary,approved:map.views.approved.summary,inputIssues:map.inputIssues.length}));}catch(e){console.error(e.message);process.exitCode=1;}
}
