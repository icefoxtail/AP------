const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const CLI=path.resolve(__dirname,'../archive/tools/build-archive2-ready-catalog.mjs');
const CATALOG='archive/tools/build-archive2-catalog.mjs';
const READY='archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs';
const RUNTIME='archive/data/meta-foundation/runtime/middle-geometry-v1.json';
const RECEIPT='archive/data/meta-foundation/runtime/runtime-bridge-receipt.json';
const MANIFEST='archive/data/archive2-canonical-input-manifest.json';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

// Exercise the actual production CLI and shared subprocess helper against a
// fresh registered runtime. These small file producers model the independent
// digest/receipt contract, not a precomputed command-order success response.
function fixture(t,flags={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-ready-catalog-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const put=(rel,value)=>{const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});
    fs.writeFileSync(full,typeof value==='string'?value:JSON.stringify(value)+'\n');};
  const rows=[{questionUid:'existing-approved',fieldStatus:{problemType:'approved_final_qa'}},
    {questionUid:'newly-registered',fieldStatus:{problemType:'approved_final_qa'}}];
  put(RUNTIME,{packId:'MIDDLE_GEOMETRY',counts:{total:1},records:rows});
  put('archive/data/question_metadata.json',{records:rows});
  put('archive/exams/original/fixture.js','window.questionBank=[{id:1,content:"fixed source"}];\n');
  put('flags.json',flags);
  const prelude=`import fs from 'node:fs';import crypto from 'node:crypto';
const runtime=${JSON.stringify(RUNTIME)},manifest=${JSON.stringify(MANIFEST)},receipt=${JSON.stringify(RECEIPT)};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v)+'\\n');
const flags=read('flags.json');`;
  put(CATALOG,prelude+`
write(manifest,{runtimeSha256:sha(fs.readFileSync(runtime)),projectionVersion:'canonical:'+sha(fs.readFileSync(runtime))});
`);
  put(READY,prelude+`
const mode=process.argv[2],m=read(manifest),r=read(runtime);
if(m.runtimeSha256!==sha(fs.readFileSync(runtime)))throw Error('canonical input digest mismatch');
if(mode==='--check'){
  if(flags.failCheck)throw Error('runtime identity join mismatch');
  if(r.counts.total!==r.records.length||read(receipt).projectionVersion!==m.projectionVersion)throw Error('runtime receipt stale');
  console.log(JSON.stringify({status:'PASS',mode}));
}else if(mode==='--write'){
  const changedFiles=[],desired=flags.unstable?r.counts.total+1:r.records.length;
  if(r.counts.total!==desired){r.counts.total=desired;write(runtime,r);changedFiles.push(runtime);}
  if(!fs.existsSync(receipt)||read(receipt).projectionVersion!==m.projectionVersion){write(receipt,{projectionVersion:m.projectionVersion});changedFiles.push(receipt);}
  if(flags.invalidScope)changedFiles.push('archive/data/question_metadata.json');
  console.log(JSON.stringify({status:'PASS',mode,changedFiles}));
}else throw Error('strict readiness mode required');
`);
  const protectedPaths=['archive/data/question_metadata.json','archive/exams/original/fixture.js'];
  const protectedBefore=protectedPaths.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]);
  const run=args=>spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:15000});
  return {root,rows,run,read:rel=>JSON.parse(fs.readFileSync(path.join(root,rel))),
    unchanged:()=>{for(const[p,h]of protectedBefore)assert.equal(sha(fs.readFileSync(path.join(root,p))),h);},
    cli:()=>run([CLI,'--repo-root',root])};
}

test('the old production final-catalog/write/check order reproduces fresh runtime digest drift',t=>{
  const f=fixture(t);
  assert.equal(f.run([CATALOG]).status,0);
  assert.equal(f.run([READY,'--write']).status,0);
  const result=f.run([READY,'--check']);assert.equal(result.status,1);assert.match(result.stderr,/canonical input digest mismatch/);
  f.unchanged();
});

test('one production CLI run closes fresh runtime counts, manifest and receipt without changing approvals',t=>{
  const f=fixture(t),result=f.cli();assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout.trim().split('\n').at(-1)),{status:'PASS',catalogBuilds:2,readinessVerified:true});
  assert.deepEqual(f.read(RUNTIME).records,f.rows);assert.equal(f.read(RUNTIME).counts.total,2);
  assert.equal(f.read(MANIFEST).runtimeSha256,sha(fs.readFileSync(path.join(f.root,RUNTIME))));
  assert.equal(f.read(RECEIPT).projectionVersion,f.read(MANIFEST).projectionVersion);
  assert.equal(f.run([READY,'--check']).status,0);f.unchanged();
  const replay=f.cli();assert.equal(replay.status,0,replay.stderr);
  assert.equal(JSON.parse(replay.stdout.trim().split('\n').at(-1)).catalogBuilds,1);f.unchanged();
});

for(const [name,flags,message]of [
  ['strict check failure',{failCheck:true},/runtime identity join mismatch/],
  ['non-stabilizing runtime',{unstable:true},/did not stabilize/],
  ['out-of-scope readiness report',{invalidScope:true},/invalid output scope/],
])test('production ready-catalog remains fatal on '+name,t=>{
  const f=fixture(t,flags),result=f.cli();assert.equal(result.status,1);assert.match(result.stderr,message);
  assert.ok(!result.stdout.includes('"readinessVerified":true'));f.unchanged();
});
