// Static import/spawn closure of the scripts the registration lanes run (test and investigation helper; the lane policy itself does not use it).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {indexRows} from './archive-registration-writer.mjs';
export function producerClosure(root,lanes) {
  const tracked=new Set(indexRows(root).map(r=>r.path));
  const byBase=new Map();
  for(const p of tracked)if(/^(?:archive\/tools|tools)\/.+\.(?:mjs|cjs|js|py|sh)$/.test(p)){const b=path.posix.basename(p);byBase.set(b,[...(byBase.get(b)||[]),p]);}
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'producer-closure-'));
  fs.mkdirSync(path.join(tmp,'archive-meta-register-pass/requests'),{recursive:true});fs.mkdirSync(path.join(tmp,'archive-main-auto-meta'),{recursive:true});
  fs.writeFileSync(path.join(tmp,'archive-main-auto-meta/report.json'),'{}');
  const entries=[];
  for(const lane of lanes) {
    const finals=typeof lane.finalCommands==='function'?lane.finalCommands({env:{RUNNER_TEMP:tmp}}):(lane.finalCommands||[]);
    for(const c of [...lane.commands,...finals])for(const a of c.args||[])if(/\.(?:mjs|cjs|js|py|sh)$/.test(a)&&tracked.has(a))entries.push(a);
  }
  fs.rmSync(tmp,{recursive:true,force:true});
  const seen=new Set(),queue=[...new Set(entries)],parent=new Map();
  const resolveRel=(from,spec)=>{
    const base=path.posix.normalize(path.posix.join(path.posix.dirname(from),spec));
    return [base,base+'.mjs',base+'.js',base+'.cjs',base+'/index.js',base+'/index.mjs'].find(p=>tracked.has(p));
  };
  while(queue.length) {
    const file=queue.pop();
    if(seen.has(file))continue;seen.add(file);
    let text;try{text=fs.readFileSync(path.join(root,file),'utf8');}catch{continue;}
    const next=[];
    for(const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s+)['"`](\.{1,2}\/[^'"`]+)['"`]/g)){const r=resolveRel(file,m[1]);if(r)next.push(r);}
    // A path literal inside a script is a spawn of that script. Test lists and runners that merely name other tests are not producers.
    // Only the spawn shapes count: an argument list that starts with the script, or "node <script>" / "bash <script>" / "python <script>".
    for(const m of text.matchAll(/(?:\[\s*['"`]|\b(?:node|bash|python3?)\s+['"`]?)((?:archive|tools)\/[^'"`\s$,\]]+\.(?:mjs|cjs|js|py|sh))/g))if(tracked.has(m[1])&&m[1]!=='tools/run-tests.js')next.push(m[1]);
    if(file.endsWith('.sh')||file.endsWith('.py'))for(const m of text.matchAll(/(?:^|[^\w./-])((?:archive|tools|tests)\/[\w./-]+\.(?:mjs|cjs|js|py|sh))/g))if(tracked.has(m[1]))next.push(m[1]);
    if(file.endsWith('.py'))for(const m of text.matchAll(/["']([\w.-]+\.(?:mjs|cjs|js))["']/g))next.push(...(byBase.get(m[1])||[]));
    for(const n of next)if(!seen.has(n)){queue.push(n);if(!parent.has(n))parent.set(n,file);}
  }
  return {entries:[...new Set(entries)],visited:[...seen],parent};
}
