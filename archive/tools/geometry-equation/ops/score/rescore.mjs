// Re-score stored render results with the score table, without rendering again.
// node rescore.mjs --out <result.tsv> --json <result.json> <root> [<root> ...]
// A root is a folder that holds <exam>/out/<item>-result.json (batch folders, anti-out/_night, ...).
// An item that is ARCHIVE_BOUND in any root is "RENDERED" (a figure exists) and is not counted as a failure.
import fs from 'node:fs';
import path from 'node:path';
import {scoreResult,loadTable} from './score.mjs';

const args=process.argv.slice(2);
const arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
const outTsv=arg('--out'),outJson=arg('--json');
const roots=args.filter((a,i)=>!a.startsWith('--')&&args[i-1]!=='--out'&&args[i-1]!=='--json');

const rows=new Map();
function walk(dir,root){
  let entries;try{entries=fs.readdirSync(dir,{withFileTypes:true})}catch{return}
  for(const e of entries){
    const p=path.join(dir,e.name);
    if(e.isDirectory()){if(e.name==='pk'||e.name==='node_modules')continue;walk(p,root);continue;}
    if(!/-result\.json$/.test(e.name))continue;
    let result;try{result=JSON.parse(fs.readFileSync(p,'utf8'))}catch{continue}
    const item=e.name.replace(/-result\.json$/,''),exam=path.basename(path.dirname(path.dirname(p)));
    const svg=fs.readdirSync(dir).find(f=>f.startsWith(item)&&f.endsWith('.svg'));
    const key=exam+'\t'+item;
    const rec={exam,item,root:path.basename(root),file:p,status:result.status,svg:svg?path.join(dir,svg):null,result};
    const prev=rows.get(key);
    // a figure beats a failure; otherwise keep the later root
    if(!prev||(rec.svg&&!prev.svg)||(!prev.svg&&!rec.svg))rows.set(key,rec);
  }
}
for(const r of roots)walk(path.resolve(r),r);

const table=loadTable();
const report=[];
for(const rec of rows.values()){
  const hasSvg=!!rec.svg;
  const s=rec.status==='ARCHIVE_BOUND'||hasSvg&&rec.status!=='FAILED'
    ?{verdict:'RENDERED',score:null,findings:[]}
    :scoreResult(rec.result,{hasSvg});
  const codes=s.findings.map(f=>f.code);
  report.push({exam:rec.exam,item:rec.item,root:rec.root,status:rec.status,hasSvg,svg:rec.svg,code:rec.result.code||'',codes,tracks:[...new Set(s.findings.map(f=>f.track))],stages:[...new Set(s.findings.map(f=>f.stage))],verdict:s.verdict,ifSvg:s.ifSvg||'',score:s.score,degree:s.findings.map(f=>f.degree).filter(Boolean)[0]||null,blockReason:s.blockReason||''});
}
report.sort((a,b)=>(a.exam+a.item).localeCompare(b.exam+b.item));
const tsv=['exam\titem\troot\tstatus\thasSvg\tcode\tcodes\ttracks\tstages\tverdict\tifSvg\tscore\tblockReason',...report.map(r=>[r.exam,r.item,r.root,r.status,r.hasSvg?'Y':'N',r.code,r.codes.join(','),r.tracks.join(','),r.stages.join(','),r.verdict,r.ifSvg,r.score??'',r.blockReason].join('\t'))].join('\n')+'\n';
if(outTsv)fs.writeFileSync(outTsv,tsv);
if(outJson)fs.writeFileSync(outJson,JSON.stringify({tableVersion:table.version,passScore:table.passScore,items:report},null,1));

const count=(f)=>{const m={};for(const r of report){const k=f(r);m[k]=(m[k]||0)+1}return Object.entries(m).sort((a,b)=>b[1]-a[1])};
console.log('tableVersion',table.version,'items',report.length);
console.log('verdict',JSON.stringify(count(r=>r.verdict)));
const failed=report.filter(r=>r.status==='FAILED'||(r.verdict!=='RENDERED'));
console.log('failed items',failed.length,'with svg',failed.filter(r=>r.hasSvg).length,'without',failed.filter(r=>!r.hasSvg).length);
console.log('if a candidate SVG existed (ifSvg):',JSON.stringify(count(r=>r.ifSvg||'-')));
