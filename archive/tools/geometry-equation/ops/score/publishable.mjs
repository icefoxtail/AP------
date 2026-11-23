// The list of figures that may be published on a score (score gate, ops/score): render results that are ARCHIVE_BOUND and carry scoreGate SCORED_PASS
// (render-plan --accept-scored 1). Each entry is the receipt: SCORED_PASS, score, passScore, tableVersion, deductions and the bound SVG.
// A figure that passed without a score has no scoreGate and is not listed (it is published as before). The listing re-checks the receipt against the current table.
//   node publishable.mjs --out <list.json> [--min <score, can only raise the table pass line>] <root> [<root> ...]     a root holds <exam>/out/<item>-result.json (batch folders) or <item>-result.json directly
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadTable} from './score.mjs';

export function listPublishable(roots,{min}={}){
  const table=loadTable(),passScore=Math.max(table.passScore,min??0),out=[];
  const walk=dir=>{
    let entries;try{entries=fs.readdirSync(dir,{withFileTypes:true})}catch{return}
    for(const e of entries){
      const p=path.join(dir,e.name);
      if(e.isDirectory()){if(e.name==='pk'||e.name==='node_modules'||e.name==='.git')continue;walk(p);continue;}
      if(!/-result\.json$/.test(e.name))continue;
      let result;try{result=JSON.parse(fs.readFileSync(p,'utf8'))}catch{continue}
      const gate=result.scoreGate;
      if(result.status!=='ARCHIVE_BOUND'||!gate)continue;
      const item=e.name.replace(/-result\.json$/,''),svg=path.join(dir,item+'-solution.svg');
      const problems=[];
      if(gate.status!=='SCORED_PASS')problems.push('STATUS_NOT_SCORED_PASS');
      if(!(gate.score>=passScore))problems.push('SCORE_BELOW_PASS');
      if(!gate.tableVersion)problems.push('NO_TABLE_VERSION');
      else if(gate.tableVersion!==table.version)problems.push('OLD_TABLE_RESCORE');
      if(!fs.existsSync(svg))problems.push('NO_BOUND_SVG');
      out.push({exam:path.basename(path.dirname(dir)),item,result:p,svg:fs.existsSync(svg)?svg:null,receipt:'SCORED_PASS',score:gate.score,passScore:gate.passScore,tableVersion:gate.tableVersion,stage:gate.stage,deductions:gate.deductions,publishable:problems.length===0,problems});
    }
  };
  for(const r of roots)walk(path.resolve(r));
  return out.sort((a,b)=>(a.exam+a.item).localeCompare(b.exam+b.item));
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
  const roots=args.filter((a,i)=>!a.startsWith('--')&&args[i-1]!=='--out'&&args[i-1]!=='--min');
  const list=listPublishable(roots,{min:arg('--min')==null?undefined:Number(arg('--min'))});
  if(arg('--out'))fs.writeFileSync(arg('--out'),JSON.stringify({tableVersion:loadTable().version,items:list},null,1));
  console.log('scored-pass receipts',list.length,'publishable',list.filter(x=>x.publishable).length);
  const byTable={};for(const x of list){byTable[x.tableVersion]=(byTable[x.tableVersion]||0)+1;}
  console.log('by tableVersion',JSON.stringify(byTable));
}
