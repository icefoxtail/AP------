import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { restoreReviewedReplayCanonicalBefore as restore } from '../archive/tools/meta-foundation/reviewed-replay-registry-context.mjs';

const prefix='archive/data/meta-foundation/canonical/';
const tuple=b=>JSON.stringify([b.curriculum,b.standardCourse,b.standardUnitKey,b.subUnitKey??null,b.problemTypeKey]);
function fixture(){
 const pt={problemTypeKey:'PT_NEW',canonicalLabelKo:'Primary',definition:'Reviewed definition',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE'},
 tpl={templateKey:'TPL_NEW',parentProblemTypeKey:'PT_NEW',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE'},
 cc={conceptKey:'CC_NEW',ownerConceptShard:'PLANE_GEOMETRY',status:'ACTIVE'},
 cond={conditionKey:'COND_NEW',status:'ACTIVE'},
 binding={curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-QUADRILATERAL_PROPERTIES',problemTypeKey:'PT_NEW',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE'};
 const rows=[['problemTypes','pt','problemTypeKey',pt,'packs/middle-geometry/taxonomy.json'],['templates','tpl','templateKey',tpl,'packs/middle-geometry/taxonomy.json'],['concepts','cc','conceptKey',cc,'concepts/plane-geometry.json'],['conditions','cond','conditionKey',cond,'condition_registry.json']];
 const tables={packs:new Map([['MIDDLE_GEOMETRY',{meta:{packId:'MIDDLE_GEOMETRY',canonicalStatus:'ACTIVE'}}]]),master:new Map(),bindings:new Map([[tuple(binding),binding]])};
 for(const[,name,key,record]of rows)tables[name]=new Map([[record[key],record],['EXISTING',{status:'ACTIVE',untouched:true}]]);
 const changes=rows.map(([collection,,key,record,path])=>({path:prefix+path,collection,match:{[key]:record[key]},before:null,after:record}));
 changes.push({path:prefix+'packs/middle-geometry/bindings.json',collection:'bindings',match:Object.fromEntries(['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'].map(k=>[k,binding[k]])),before:null,after:binding});
 const item={questionUid:'qid',sourceOrdinal:1,after:{...binding,templateKey:'TPL_NEW',crossConceptKeys:['CC_NEW'],conditionKeys:['COND_NEW']},sourceReview:{proposalFinalization:{schemaVersion:'archive-native-proposal-finalization-v3'}}};
 const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',scope:'PARTIAL_UIDS',approval:{type:'FINAL_QA',metadataReviewed:true},items:[item],registryChanges:changes};
 return{request,currentTables:tables};
}
test('reconstructs the five add-only lookup kinds without mutating current tables or request',()=>{
 const f=fixture(),before=structuredClone(f),result=restore(f);
 for(const name of ['pt','tpl','cc','cond']){assert.equal(result[name].size,1);assert.equal(result[name].get('EXISTING').untouched,true);assert.equal(f.currentTables[name].size,2);}
 assert.equal(result.bindings.size,0);assert.equal(f.currentTables.bindings.size,1);assert.deepEqual(f,before);assert.strictEqual(result.packs,f.currentTables.packs);
});
test('requests without changes retain the exact existing current context',()=>{
 for(const registryChanges of [undefined,[]]){const f=fixture();f.request.registryChanges=registryChanges;assert.strictEqual(restore(f),f.currentTables);}
});
test('exact native scope binding uses the same add-only context with existing primary definitions',()=>{
 const f=fixture();f.request.registryChanges=f.request.registryChanges.slice(-1);f.request.items[0].sourceReview={scopeFieldBinding:{schemaVersion:'archive-native-reviewed-scope-fields-v1'}};
 const before=restore(f);assert.equal(before.bindings.size,0);assert.strictEqual(before.pt,f.currentTables.pt);
});
test('v1, v2 and v3 proposal scopes share the exact read-only reconstruction',()=>{
 for(const version of [1,2,3]){const f=fixture();f.request.items[0].sourceReview.proposalFinalization.schemaVersion='archive-native-proposal-finalization-v'+version;assert.equal(restore(f).pt.has('PT_NEW'),false);}
});
test('nonenumerable lookup descriptors remain available',()=>{
 const f=fixture(),ext={check(){}};Object.defineProperty(f.currentTables,'ext',{value:ext,enumerable:false});const before=restore(f);assert.strictEqual(before.ext,ext);assert.equal(Object.keys(before).includes('ext'),false);
});
const negatives=[
 ['unsupported request schema',f=>f.request.schemaVersion='other'],
 ['whole exam',f=>delete f.request.scope],
 ['wrong approval',f=>f.request.approval.type='REVIEW2'],
 ['missing metadata approval',f=>delete f.request.approval.metadataReviewed],
 ['source rebind',f=>f.request.approval.sourceRebind={}],
 ['registration mode',f=>f.request.registrationMode='other'],
 ['no source proof opt-in',f=>f.request.items[0].sourceReview={}],
 ['unknown proposal schema',f=>f.request.items[0].sourceReview.proposalFinalization.schemaVersion='v999'],
 ['non-array changes',f=>f.request.registryChanges={}],
 ['missing items',f=>f.request.items=[]],
 ['replacement',f=>f.request.registryChanges[0].before={problemTypeKey:'PT_NEW'}],
 ['missing before',f=>delete f.request.registryChanges[0].before],
 ['deletion',f=>f.request.registryChanges[0].after=null],
 ['inactive after',f=>f.request.registryChanges[0].after={...f.request.registryChanges[0].after,status:'DRAFT'}],
 ['whole document change',f=>delete f.request.registryChanges[0].collection],
 ['unsupported collection',f=>f.request.registryChanges[0].collection='aliases'],
 ['different key match',f=>f.request.registryChanges[0].match={problemTypeKey:'PT_OTHER'}],
 ['extra key match',f=>f.request.registryChanges[0].match.extra='value'],
 ['unselected new definition',f=>f.request.items[0].after.problemTypeKey='PT_OTHER'],
 ['wrong pack path',f=>f.request.registryChanges[0].path=prefix+'packs/other/taxonomy.json'],
 ['path traversal',f=>f.request.registryChanges[0].path=prefix+'packs/middle-geometry/../taxonomy.json'],
 ['inactive current owner',f=>f.currentTables.packs.get('MIDDLE_GEOMETRY').meta.canonicalStatus='DRAFT'],
 ['owner mismatch',f=>f.request.registryChanges[0].after={...f.request.registryChanges[0].after,ownerPack:'OTHER'}],
 ['wrong concept shard path',f=>f.request.registryChanges[2].path=prefix+'concepts/other.json'],
 ['wrong condition path',f=>f.request.registryChanges[3].path=prefix+'other.json'],
 ['missing current record',f=>f.currentTables.pt.delete('PT_NEW')],
 ['current definition drift',f=>f.currentTables.pt.set('PT_NEW',{...f.currentTables.pt.get('PT_NEW'),definition:'Changed'})],
 ['current owner drift',f=>f.currentTables.pt.set('PT_NEW',{...f.currentTables.pt.get('PT_NEW'),ownerPack:'OTHER'})],
 ['current extra field drift',f=>f.currentTables.pt.set('PT_NEW',{...f.currentTables.pt.get('PT_NEW'),extra:true})],
 ['duplicate change',f=>f.request.registryChanges.push(structuredClone(f.request.registryChanges[0]))],
 ['binding match missing key',f=>delete f.request.registryChanges[4].match.subUnitKey],
 ['binding context differs',f=>f.request.registryChanges[4].match.curriculum='2022'],
 ['binding unselected scope',f=>f.request.items[0].after.curriculum='2022'],
 ['binding unselected parent',f=>f.request.items[0].after.standardUnitKey='M2-07'],
 ['binding wrong file',f=>f.request.registryChanges[4].path=prefix+'packs/middle3/bindings.json'],
 ['scope adapter cannot remove definitions',f=>f.request.items[0].sourceReview={scopeFieldBinding:{schemaVersion:'archive-native-reviewed-scope-fields-v1'}}],
];
for(const[name,mutate]of negatives)test('rejects '+name+' without mutation',()=>{const f=fixture();mutate(f);const snapshot=structuredClone(f);assert.throws(()=>restore(f),/native replay registry context:/);assert.deepEqual(f,snapshot);});

function completeFixture(t) {
 const f=fixture();f.root=fs.mkdtempSync(path.join(os.tmpdir(),'archive-replay-context-'));
 t.after(()=>fs.rmSync(f.root,{recursive:true,force:true}));
 const put=(file,value)=>{const p=path.join(f.root,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(value));};
 const rows=f.request.registryChanges.map(c=>structuredClone(c.after)),[pt,tpl,cc,cond,binding]=rows;
 delete tpl.ownerPack;delete cc.ownerConceptShard;delete binding.ownerPack;
 const unusedTemplate={...tpl,templateKey:'TPL_UNUSED'},unusedConcept={...cc,conceptKey:'CC_UNUSED'};
 const packEntry={id:'MIDDLE_GEOMETRY',version:'1.0.0',status:'ACTIVE'},shardEntry={id:'PLANE_GEOMETRY',version:'1.0.0',status:'ACTIVE'};
 const base=prefix+'packs/middle-geometry',meta={schemaVersion:'meta-foundation-pack-v1',packId:'MIDDLE_GEOMETRY',packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중2 수학']},
 taxonomy={status:'ACTIVE',problemTypes:[pt],templates:[tpl,unusedTemplate]},bindings={status:'ACTIVE',bindings:[binding]},aliases={aliases:[]},
 shard={shardId:'PLANE_GEOMETRY',shardVersion:'1.0.0',concepts:[cc,unusedConcept]};
 const master=[{key:binding.standardUnitKey,keyType:'standardUnitKey',labelKo:'unit',status:'active'},
 {key:binding.subUnitKey,keyType:'subUnitKey',labelKo:'subunit',status:'active',parentKey:binding.standardUnitKey,standardUnitKey:binding.standardUnitKey}];
 f.request.items[0].sourceReview.proposalFinalization.schemaVersion='archive-native-proposal-finalization-v1';
 f.request.registryChanges=[
 {path:prefix+'registry_index.json',collection:'activePacks',match:{id:packEntry.id},before:null,after:packEntry},
 ...[['pack',meta],['taxonomy',taxonomy],['bindings',bindings],['aliases',aliases]].map(([name,after])=>({path:base+'/'+name+'.json',before:null,after})),
 {path:prefix+'registry_index.json',collection:'activeConceptShards',match:{id:shardEntry.id},before:null,after:shardEntry},
 {path:prefix+'concepts/plane-geometry.json',before:null,after:shard},
 {path:prefix+'condition_registry.json',collection:'conditions',match:{conditionKey:cond.conditionKey},before:null,after:cond},
 ...master.map(after=>({path:'archive/data/master_tables/js_archive_tag_master.json',collection:'$',match:{key:after.key},before:null,after}))];
 const currentMeta={...meta,problemTypeCount:1,templateCount:2,bindingCount:1,aliasCount:0},currentTaxonomy={...taxonomy,problemTypeCount:1,templateCount:2},currentBindings={...bindings,bindingCount:1};
 f.currentTables.packs.set(packEntry.id,{entry:packEntry,base,meta:currentMeta,taxonomy:currentTaxonomy,bindings:currentBindings,aliases});
 for(const row of taxonomy.templates)f.currentTables.tpl.set(row.templateKey,row);
 for(const row of shard.concepts)f.currentTables.cc.set(row.conceptKey,row);
 f.currentTables.bindings.set(tuple(binding),binding);
 for(const row of master)f.currentTables.master.set(row.key,row);
 for(const [name,doc]of [['pack',currentMeta],['taxonomy',currentTaxonomy],['bindings',currentBindings],['aliases',aliases]])put(base+'/'+name+'.json',doc);
 const index={activePacks:[packEntry],activeConceptShards:[{...shardEntry,conceptCount:2}]};
 put(prefix+'registry_index.json',index);put(prefix+'concepts/plane-geometry.json',{...shard,conceptCount:2});
 return {...f,put,index,base,meta,taxonomy,bindings,aliases,shard};
}
test('complete newly registered pack and shard retain the original v1 empty-before context',t=>{
 const f=completeFixture(t),input={request:structuredClone(f.request),tables:structuredClone(f.currentTables)},result=restore(f);
 for(const name of ['pt','tpl','cc','cond'])assert.deepEqual([...result[name].keys()],['EXISTING']);
 for(const name of ['master','bindings','packs'])assert.equal(result[name].size,0);
 assert.deepEqual(f.request,input.request);assert.deepEqual(f.currentTables,input.tables);
});
const completeNegatives=[
 ['missing root',f=>delete f.root],
 ['missing owner index',f=>f.request.registryChanges=f.request.registryChanges.filter(c=>c.collection!=='activePacks')],
 ['incomplete new pack',f=>f.request.registryChanges=f.request.registryChanges.filter(c=>!c.path.endsWith('/aliases.json'))],
 ['unsupported whole path',f=>f.request.registryChanges.push({path:'unowned.json',before:null,after:{}})],
 ['duplicate whole path',f=>f.request.registryChanges.push(structuredClone(f.request.registryChanges[1]))],
 ['duplicate owner index',f=>f.request.registryChanges.push(structuredClone(f.request.registryChanges[0]))],
 ['owner version drift',f=>f.currentTables.packs.get('MIDDLE_GEOMETRY').meta.packVersion='1.0.1'],
 ['owner additional row',f=>{f.taxonomy.templates.push({...f.taxonomy.templates[0],templateKey:'UNREQUESTED'});f.put(f.base+'/taxonomy.json',f.taxonomy);}],
 ['owner alias drift',f=>f.put(f.base+'/aliases.json',{aliases:[{alias:'drift'}]})],
 ['shard identity drift',f=>f.put(prefix+'concepts/plane-geometry.json',{...f.shard,shardId:'OTHER',conceptCount:2})],
 ['shard derived count drift',f=>f.put(prefix+'concepts/plane-geometry.json',{...f.shard,conceptCount:99})],
 ['shard index count drift',f=>{f.index.activeConceptShards[0].conceptCount=99;f.put(prefix+'registry_index.json',f.index);}],
 ['duplicate current index',f=>{f.index.activePacks.push(f.index.activePacks[0]);f.put(prefix+'registry_index.json',f.index);}],
 ['explicit template owner mismatch',f=>f.taxonomy.templates[0].ownerPack='OTHER'],
 ['explicit concept owner mismatch',f=>f.shard.concepts[0].ownerConceptShard='OTHER'],
 ['unselected complete owner',f=>{f.request.items[0].after.problemTypeKey='OTHER';f.request.items[0].after.templateKey='OTHER';}],
 ['scope-only complete owner',f=>f.request.items[0].sourceReview={scopeFieldBinding:{schemaVersion:'archive-native-reviewed-scope-fields-v1'}}],
 ['master status drift',f=>f.currentTables.master.set('M2-05',{...f.currentTables.master.get('M2-05'),status:'inactive'})],
 ['master parent mismatch',f=>f.request.registryChanges.at(-1).after.parentKey='OTHER'],
 ['unselected master addition',f=>{const row={key:'UNSELECTED',keyType:'standardUnitKey',status:'active'};f.currentTables.master.set(row.key,row);f.request.registryChanges.push({path:'archive/data/master_tables/js_archive_tag_master.json',collection:'$',match:{key:row.key},before:null,after:row});}],
 ['whole and individual duplicate',f=>{const row=f.taxonomy.problemTypes[0];f.request.registryChanges.push({path:f.base+'/taxonomy.json',collection:'problemTypes',match:{problemTypeKey:row.problemTypeKey},before:null,after:row});}],
];
for(const[name,mutate]of completeNegatives)test('rejects complete owner '+name,t=>{
 const f=completeFixture(t);mutate(f);const request=structuredClone(f.request),tables=structuredClone(f.currentTables);
 assert.throws(()=>restore(f),/native replay registry context:/);assert.deepEqual(f.request,request);assert.deepEqual(f.currentTables,tables);
});
