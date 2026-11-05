'use strict';
// Read-only operator inventory for the explicitly authorized whole authoring snapshot.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=process.cwd(),ref=process.env.AUTHOR_SHA,out=process.env.REPORT_DIR;
if(!/^[a-f0-9]{40}$/.test(ref||'')||!out)throw Error('PINNED_AUTHOR_SHA_AND_REPORT_DIR_REQUIRED');
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});
const show=p=>git('show',ref+':'+p);
const save=(p,s)=>{const f=path.join(out,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s);};
const copy=p=>{if(fs.existsSync(path.join(root,p)))save('bundle/'+p,fs.readFileSync(path.join(root,p)));};
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const V=require(path.join(root,'tools/4slot/validate-4slot.cjs'));
const I=require(path.join(root,'tools/4slot/import-4slot.cjs'));
const dict=V.loadDict(root,V.DEFAULT_DICT),lut=V.buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
const prefix='archive-work/4slot-annotate-v1/out/';
const files=git('ls-tree','-r','-z','--name-only',ref,'--',prefix).split('\0').filter(p=>p.endsWith('.4slot.json')).sort();
const queuePath='archive-work/4slot-annotate-v1/QUEUE-original.json';
const queue=JSON.parse(show(queuePath));save('bundle/'+queuePath,JSON.stringify(queue));
const qm=new Map((queue.list||[]).map(q=>[I.examKey(q.path),q]));
const report={schemaVersion:'four-slot-bulk-comparison-v1',authoringCommit:ref,mainCommit:git('rev-parse','HEAD').trim(),totalOutputs:files.length,rows:[],totals:{existing:0,new:0,items:0,fail:0,sourceChanged:0},independentSemanticReview:'NOT_RUN',sourceMutation:0,authoredMutation:0};
for(const p of ['tools/4slot/validate-4slot.cjs','tools/4slot/exam-items.cjs','tools/4slot/import-4slot.cjs','tools/4slot/build-4slot-runtime.cjs','archive/item-4slot.js','tests/item-4slot-data.test.cjs','tests/item-4slot-runtime.test.cjs','archive/data/question_identity_map.json'])copy(p);
for(const p of Object.values(V.DICT_FILES))copy(p);
try{const p='archive-work/4slot-annotate-v1/REVIEW-rejected.json';save('bundle/'+p,show(p));}catch{}
const mainCompact=git('ls-files','-z','--','archive/data/item-4slot/').split('\0').filter(Boolean);for(const p of mainCompact)copy(p);
for(let k=0;k<files.length;k++){
 const p=files[k],raw=show(p);save('bundle/'+p,raw);
 let d;try{d=JSON.parse(raw);}catch(e){report.rows.push({path:p,status:'BAD_JSON',error:e.message});report.totals.fail++;continue;}
 const key=I.examKey(p),source=key+'.js',src='archive/exams/'+source,dest='archive/data/item-4slot/'+key+'.4slot.json';
 const q=qm.get(key),row={path:source,outPath:p,order:q?.order??null,items:(d.items||[]).length,evidenceBlob:git('rev-parse',ref+':'+p).trim(),evidenceSha256:hash(raw),declaredSourceBlob:d.sourceGitBlobSha,queueSourceBlob:q?.blob,declaredDictionary:d.dictionaryVersion,judgedBy:d.judgedBy,selfCheck:d.selfCheck,existing:fs.existsSync(path.join(root,dest))};
 report.totals.items+=row.items;report.totals[row.existing?'existing':'new']++;
 copy(src);
 try{row.currentSourceBlob=git('rev-parse','HEAD:'+src).trim();}catch{row.status='SOURCE_MISSING';report.rows.push(row);report.totals.fail++;continue;}
 const oldBlob=q?.blob||d.sourceGitBlobSha;
 row.sourceChanged=oldBlob!==row.currentSourceBlob;if(row.sourceChanged)report.totals.sourceChanged++;
 if(/^[a-f0-9]{40}$/.test(oldBlob||'')){try{save('historical/'+oldBlob+'.js',git('cat-file','blob',oldBlob));}catch(e){row.historicalSourceError=String(e.message).slice(0,120);}}
 let v;try{v=V.validateData(d,{root,dict,lut});}catch(e){v={fail:[e.stack],warn:[],stats:{}};}
 row.fail=v.fail;row.warn=v.warn;row.stats=v.stats;
 row.status=v.fail.length?'VALIDATION_FAIL':row.sourceChanged?'SOURCE_CHANGED':'VALIDATED';
 if(v.fail.length)report.totals.fail++;
 const candidate={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:oldBlob,dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'work/4slot-annotate-v1',commit:ref,path:p},reviewedBy:{agent:'GPT6_CHAT_TECHNICAL_IMPORT',at:'2026-11-05',sampled:[]},items:(d.items||[]).map(it=>I.compactItem(it,lut)).sort((a,b)=>a.ordinal-b.ordinal)};
 if(row.existing){const old=JSON.parse(fs.readFileSync(path.join(root,dest),'utf8'));row.compactItemsSame=stable(old.items)===stable(candidate.items);row.existingBlob=git('hash-object',dest).trim();}
 save('candidates/'+dest,I.serialize(candidate));
 report.rows.push(row);
 if((k+1)%50===0)console.log('COMPARED',k+1,'/',files.length);
}
report.queueCount=(queue.list||[]).length;
report.queueWithoutOutput=(queue.list||[]).filter(q=>!report.rows.some(r=>r.path===q.path)).map(q=>({order:q.order,path:q.path}));
save('comparison.json',JSON.stringify(report,null,2));
const dry=cp.spawnSync(process.execPath,['tools/4slot/import-4slot.cjs','--from-ref',ref,'--dry-run'],{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
save('official-import-preview.json',dry.stdout||'');save('official-import-preview.stderr',dry.stderr||'');
console.log(JSON.stringify({mainCommit:report.mainCommit,authoringCommit:ref,totalOutputs:files.length,queueCount:report.queueCount,totals:report.totals,sourceMutation:0,authoredMutation:0},null,2));
if(dry.status!==0)throw Error('OFFICIAL_PREVIEW_ERROR:'+dry.status);
git('diff','--exit-code');
