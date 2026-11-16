#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {NOTICE,parseArgs,outsideOutput} from './lib.mjs';
const key=r=>JSON.stringify([r.curriculum,r.course,r.standardUnitKey,r.subUnitKey]);
export function findGaps(map,{maxUnknown=0.1}={}) {
  if(map.schemaVersion!=='archive-coverage-map-v1')throw Error('UNSUPPORTED_MAP');
  if(!Number.isFinite(maxUnknown)||maxUnknown<0||maxUnknown>1)throw Error('INVALID_MAX_UNKNOWN');
  const candidates=[];
  for(const [view,data] of Object.entries(map.views)) {
    const units=new Map(data.units.map(r=>[key(r),r]));
    if(!Array.isArray(data.observedTypes))throw Error('TYPE_OBSERVATIONS_MISSING');
    for(const observed of data.observedTypes) {
      const first=observed,unit=units.get(key(first));
      if(!unit)throw Error('CELL_UNIT_MISSING');
      const course=data.courses.find(c=>c.curriculum===first.curriculum&&c.course===first.course);
      // Unit-less questions could belong to any unit of their course. Unknown course
      // questions could belong anywhere. Charge them conservatively, never silently lose them.
      const unallocated=(course?.missingUnit||0)+data.courses.filter(c=>!c.course||!c.curriculum).reduce((n,c)=>n+c.total,0);
      const denominator=unit.total+unallocated,unknown=unit.unknownAny+unallocated;
      const ratio=denominator?unknown/denominator:1;
      const base={view,curriculum:first.curriculum,course:first.course,standardUnitKey:first.standardUnitKey,subUnitKey:first.subUnitKey,problemTypeKey:first.problemTypeKey,templateKey:first.templateKey,unknownNumerator:unknown,denominator,unknownRatio:ratio,unallocatedAtCourse:unallocated,status:map.unquantifiedInput||ratio>maxUnknown?'UNKNOWN_COVERAGE':'CONFIRMED_GAP_CANDIDATE'};
      const evidence=rows=>[...new Map(rows.map(r=>[JSON.stringify(r),r])).values()].slice(0,3);
      const emit=(kind,rows,extra={})=>candidates.push({...base,kind,...extra,examples:evidence(rows)});
      if(observed.bySource.textbookWorkbook>0&&observed.bySource.original===0)emit('TEXTBOOK_WITHOUT_ORIGINAL',observed.sourceExamples.textbookWorkbook);
      const levels=observed.levels.slice().sort();
      for(let level=2;level<=4;level++)if(!levels.includes(level)&&levels.some(n=>n<level)&&levels.some(n=>n>level)) {
        const below=Math.max(...levels.filter(n=>n<level)),above=Math.min(...levels.filter(n=>n>level));
        emit('INTERIOR_DIFFICULTY_GAP',[...(observed.levelExamples[below]||[]).slice(0,1),...(observed.levelExamples[above]||[]).slice(0,2)],{difficultyBucket:level,neighborLevels:[below,above]});
      }
      const methods=observed.methods.map(m=>JSON.stringify(m));
      if(methods.length===1)emit('SINGLE_METHOD_GROUP',observed.methodExamples,{method:JSON.parse(methods[0])});
    }
  }
  return {schemaVersion:'archive-coverage-gaps-v1',notice:NOTICE,maxUnknown,candidates,summary:{total:candidates.length,byKind:Object.fromEntries(['TEXTBOOK_WITHOUT_ORIGINAL','INTERIOR_DIFFICULTY_GAP','SINGLE_METHOD_GROUP'].map(k=>[k,candidates.filter(r=>r.kind===k).length])),confirmed:candidates.filter(r=>r.status==='CONFIRMED_GAP_CANDIDATE').length}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{const o=parseArgs(process.argv.slice(2),['--map','--out','--max-unknown']);if(!o.map)throw Error('--map is required');const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..'),out=outsideOutput(root,o.out);const result=findGaps(JSON.parse(fs.readFileSync(o.map,'utf8')),{maxUnknown:o['max-unknown']===undefined?0.1:Number(o['max-unknown'])});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.summary));}catch(e){console.error(e.message);process.exitCode=1;}
}
