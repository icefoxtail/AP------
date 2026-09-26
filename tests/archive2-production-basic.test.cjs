const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const core = require('../archive/archive2-core.js');
const source = require('../archive/archive2-source.js');
const root = path.resolve(__dirname,'..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const raw = core.decodeCatalog(read('archive/data/archive2-catalog.json'));
async function loadProduction() {
  const ctx={window:{Archive2Core:core},document:{baseURI:'http://archive.test/archive/'},URL,console,
    fetch:async url=>({ok:true,json:async()=>read('archive/'+new URL(url).pathname.slice('/archive/'.length))})};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root,'archive/meta-foundation-runtime.js'),'utf8'),ctx);
  return {catalog:await ctx.window.applyArchiveMetaFoundationCatalog(raw),packs:ctx.window.ARCHIVE_META_FOUNDATION_RUNTIMES};
}
test('all active runtime records join exactly and BASIC matches the actual production loader',async()=>{
  const {catalog,packs}=await loadProduction();
  const byUid=new Map(catalog.records.map(r=>[r.questionUid,r]));
  const rows=packs.flatMap(p=>p.records);
  assert.equal(rows.length,5087);
  assert.equal(new Set(rows.map(r=>r.questionUid)).size,rows.length);
  assert.equal(new Set(rows.map(r=>core.normalizeFile(r.sourceArchiveFile)+'#'+r.sourceOrdinal)).size,rows.length);
  for(const pack of packs){
    let count=0;
    for(const row of pack.records){
      const actual=byUid.get(row.questionUid);
      assert.ok(actual,row.questionUid);
      assert.equal(core.normalizeFile(actual.sourceFile),core.normalizeFile(row.sourceArchiveFile));
      assert.equal(actual.sourceOrdinal,row.sourceOrdinal);
      assert.equal(core.basicEligibility(actual).ok,row.runtimeSelectable,row.questionUid+':'+core.basicEligibility(actual).reasons);
      assert.equal(actual.automatic,row.runtimeSelectable);
      if(row.runtimeSelectable)count++;
    }
    assert.equal(pack.counts.runtimeSelectable,count,pack.packId);
  }
});
test('production advanced-incomplete records compose and restore protected source content',async()=>{
  const {catalog}=await loadProduction();
  const eligible=catalog.records.filter(r=>core.basicEligibility(r).ok);
  const targets=[eligible.find(r=>!core.capabilities(r).difficulty),
    eligible.find(r=>!core.capabilities(r).l3),eligible.find(r=>!core.capabilities(r).l4),
    eligible.find(r=>r.l4Disposition==='HOLD'||r.metaFoundationL4Status==='EXPLICIT_HOLD'),
    eligible.find(r=>r.advancedHoldReasons?.includes('LEGACY_L4_FOUNDATION_GAP'))];
  assert(targets.every(Boolean),'actual missing/UNKNOWN difficulty, L3, L4 and L4_HOLD witnesses required');
  const priorDocument=global.document,priorFetch=global.fetch;
  global.document={baseURI:'http://archive.test/archive/'};
  global.fetch=async url=>({ok:true,text:async()=>fs.readFileSync(path.join(root,decodeURIComponent(new URL(url).pathname.slice(1))),'utf8')});
  try{
    for(const row of targets){
      const p=core.pathKey(row,4);
      const req={filters:{grade:row.effectiveBrowseGrade,primaryPaths:[p]},rows:[{id:'basic',path:p,depth:4,count:1}],pins:[{questionUid:row.questionUid,rowId:'basic'}]};
      const selected=core.selectBlueprint(catalog.records,req);
      assert.equal(selected.ok,true,row.questionUid);
      const restored=await source.restore(selected.selected,raw);
      assert.equal(restored.length,1);
      const bank=source.evaluate(fs.readFileSync(path.join(root,'archive/exams',row.sourceFile),'utf8'),row.sourceFile);
      const original=bank[row.sourceOrdinal-1];
      for(const field of ['id','content','choices','answer','solution','image','imageSize','layoutTag','wide'])
        assert.deepEqual(restored[0][field],original[field],field);
      assert.equal(core.matches(row,{difficultyBuckets:[2]}),row.difficultyBucket===2);
      if(!core.capabilities(row).l3)assert.equal(core.matches(row,{L3:'mf:PT_UNKNOWN'}),false);
    }
  } finally {global.document=priorDocument;global.fetch=priorFetch;}
});
