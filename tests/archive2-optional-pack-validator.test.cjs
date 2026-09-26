const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
function fixture(t){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'inclusive-pack-validator-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const assignments=read('archive/data/meta-foundation/evidence/high1/v1/item_metadata_assignments_1170.json');
  const runtime=read('archive/data/meta-foundation/runtime/h1-foundation-v1.json');
  const row=assignments.items.find(row=>row.runtimeSelectable);
  const overlay=runtime.records.find(r=>r.questionUid===row.questionUid);
  for(const target of [row,overlay])for(const field of ['problemTypeKey','templateKey','l3Disposition','l4Disposition','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','crossConceptKeys','conditionKeys','integrationPattern'])delete target[field];
  return {dir,assignments,runtime,row,overlay};
}
function run(f){
  const a=path.join(f.dir,'assignments.json'),r=path.join(f.dir,'runtime.json');
  fs.writeFileSync(a,JSON.stringify(f.assignments));fs.writeFileSync(r,JSON.stringify(f.runtime));
  return spawnSync(process.execPath,['archive/tools/meta-foundation/validate-meta-foundation-pack.mjs',
    '--pack-dir','archive/data/meta-foundation/canonical/packs/h1-foundation','--assignments',a,'--runtime',r,
    '--compiled-root','archive/data/meta-foundation/compiled'],{cwd:root,encoding:'utf8'});
}
test('production pack validator permits all optional capabilities to be absent',t=>{
  const f=fixture(t),result=run(f);
  assert.equal(result.status,0,result.stdout+result.stderr);
  assert.equal(JSON.parse(result.stdout).status,'PASS');
});
test('present unregistered advanced keys still fail registry validation',t=>{
  const f=fixture(t);f.row.problemTypeKey=f.overlay.problemTypeKey='PT_UNREGISTERED';
  const result=run(f);
  assert.notEqual(result.status,0);
  assert.equal(JSON.parse(result.stdout).status,'FAIL');
});
