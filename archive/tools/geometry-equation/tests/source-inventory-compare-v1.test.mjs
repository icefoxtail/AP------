import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {objectSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {compareFrozenSourceConditionInventories} from '../production/source-inventory-compare-v1.mjs';

const repositoryRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const evidenceRoot=path.join(repositoryRoot,'.tmp/archive/svg-engine-development-20261015/A3-1/fixtures');
fs.mkdirSync(evidenceRoot,{recursive:true});
let fixtureId=0;
function harness(leftRows=[{id:'l1',condition:'AB = e\u0301'},{id:'l2',condition:'AB = e\u0301'},{id:'l3',condition:'x < 2'}],rightRows=[{id:'r9',condition:'AB = é'},{id:'r8',condition:'x < 2'},{id:'r7',condition:'AB = é'}],options={}){
  const root=fs.mkdtempSync(path.join(evidenceRoot,`case-${++fixtureId}-`));
  const source=options.source??{content:'원의 중심은 O이다.',choices:['A','B'],sourceImageRequired:true};
  const imageShas=options.imageShas??['sha256:'+'a'.repeat(64)];
  const policy=options.policy??'sha256:'+'b'.repeat(64);
  const make=(rows,side,overrides={})=>{
    const inputPacket={instruction:'독립적으로 조건을 추출한다.',visibility:'SOURCE_ONLY',source,policySha256:policy,inputBindingSha256:`sha256:${side==='left'?'c':'d'}${'c'.repeat(63)}`};
    const rec={inputPacket,inputSha256:objectSha(inputPacket),output:{status:'PASS'},payload:{sourceConditions:rows,uncoveredConditions:[]},imageShas,model:`model-${side}`,contextId:`context-${side}`,providerInvocationId:`invoke-${side}`,subagentToolsEnabled:false,...overrides};
    const name=`${side}.json`;fs.writeFileSync(path.join(root,name),JSON.stringify(rec));
    return {ref:fileRef(root,name),record:rec};
  };
  return {root,left:make(leftRows,'left',options.leftOverrides),right:make(rightRows,'right',options.rightOverrides)};
}
function compare(h){return compareFrozenSourceConditionInventories({root:h.root,leftRef:h.left.ref,rightRef:h.right.ref});}
function mutateRecord(h,which,fn){const item=h[which],value=JSON.parse(fs.readFileSync(path.join(h.root,item.ref.path),'utf8'));fn(value);fs.writeFileSync(path.join(h.root,item.ref.path),JSON.stringify(value));return fileRef(h.root,item.ref.path);}

test('pairs complete NFC-equal text by first unmatched occurrence and preserves raw witnesses and multiplicity',()=>{
  const h=harness(),result=compare(h);
  assert.equal(result.comparisonStatus,'TEXTUALLY_AGREED');
  assert.deepEqual(result.matched.map(x=>[x.left.id,x.right.id]),[['l1','r9'],['l2','r7'],['l3','r8']]);
  assert.equal(result.matched[0].left.condition,'AB = e\u0301');
  assert.equal(result.matched[0].right.condition,'AB = é');
  assert.equal(result.matched[0].normalizedCondition,'AB = é');
  assert.equal(result.matched[0].normalizationApplied,true);
  assert.deepEqual(result.onlyLeft,[]);assert.deepEqual(result.onlyRight,[]);
  assert.equal(result.evidenceStatus,'EVIDENCE_DEBT');assert.equal(result.productionAuthorized,false);
  assert.deepEqual(result.debts,['SOURCE_LOCATION_UNVERIFIED','SEMANTIC_EQUIVALENCE_NOT_VERIFIED','EXTRACTION_COMPLETENESS_NOT_VERIFIED','INDEPENDENCE_NOT_VERIFIED','PHYSICAL_SOURCE_IMAGE_BINDING_UNVERIFIED']);
});

test('reports text multiplicity and exact textual differences without semantic conflict claims',()=>{
  const h=harness([{id:'same',condition:'A → B'},{id:'again',condition:'A → B'},{id:'unit',condition:'길이 3 cm'}],[{id:'same',condition:'B → A'},{id:'unit',condition:'길이 3 m'}]);
  const r=compare(h);assert.equal(r.comparisonStatus,'UNRESOLVED_INVENTORY_DIFFERENCES');
  assert.deepEqual(r.onlyLeft.map(x=>x.condition),['A → B','A → B','길이 3 cm']);
  assert.deepEqual(r.onlyRight.map(x=>x.condition),['B → A','길이 3 m']);
  assert.ok([...r.onlyLeft,...r.onlyRight].every(x=>x.reason==='UNRESOLVED_TEXTUAL_INVENTORY_DIFFERENCE'));
  assert.equal(JSON.stringify(r).includes('SOURCE_EXTRACTION_CONFLICT'),false);
});

test('does not equate changed operators, whitespace, algebra, scope, endpoints, values, signs, or domains',()=>{
  const pairs=[['x < 2','x ≤ 2'],['AB=3','AB = 3'],['x+1=3','x=2'],['x>0','x≥0'],['x∈R','x∈Z'],['−2','2'],['cm','m'],['모든 x','어떤 x'],['조건 A이다.','결론 A이다.']];
  for(const [left,right] of pairs){const r=compare(harness([{id:'a',condition:left}],[{id:'a',condition:right}],{source:{content:'x',choices:null,sourceImageRequired:false},imageShas:[]}));assert.equal(r.comparisonStatus,'UNRESOLVED_INVENTORY_DIFFERENCES',`${left} / ${right}`);}
});

test('requires exact raw source, ordered images and policy while accepting opaque input binding differences',()=>{
  const ok=harness();assert.notEqual(ok.left.record.inputPacket.inputBindingSha256,ok.right.record.inputPacket.inputBindingSha256);assert.equal(compare(ok).comparisonStatus,'TEXTUALLY_AGREED');
  let h=harness();mutateRecord(h,'right',x=>{x.inputPacket.source.content='원의 중심은 Ò이다.';x.inputSha256=objectSha(x.inputPacket);});h.right.ref=fileRef(h.root,h.right.ref.path);assert.throws(()=>compare(h),{message:'SOURCE_INPUT_MISMATCH'});
  h=harness();mutateRecord(h,'right',x=>{x.imageShas=['sha256:'+'e'.repeat(64)];});h.right.ref=fileRef(h.root,h.right.ref.path);assert.throws(()=>compare(h),{message:'SOURCE_IMAGE_BINDING_MISMATCH'});
  h=harness();mutateRecord(h,'right',x=>{x.inputPacket.policySha256='sha256:'+'f'.repeat(64);x.inputSha256=objectSha(x.inputPacket);});h.right.ref=fileRef(h.root,h.right.ref.path);assert.throws(()=>compare(h),{message:'SOURCE_POLICY_MISMATCH'});
  h=harness();mutateRecord(h,'right',x=>{x.inputPacket.source.choices=['B','A'];x.inputSha256=objectSha(x.inputPacket);});h.right.ref=fileRef(h.root,h.right.ref.path);assert.throws(()=>compare(h),{message:'SOURCE_INPUT_MISMATCH'});
  h=harness(undefined,undefined,{imageShas:['sha256:'+'a'.repeat(64),'sha256:'+'e'.repeat(64)]});mutateRecord(h,'right',x=>{x.imageShas.reverse();});h.right.ref=fileRef(h.root,h.right.ref.path);assert.throws(()=>compare(h),{message:'SOURCE_IMAGE_BINDING_MISMATCH'});
  h=harness();mutateRecord(h,'right',x=>{x.inputPacket.inputBindingSha256='sha256:'+'9'.repeat(64);x.inputSha256=objectSha(x.inputPacket);});h.right.ref=fileRef(h.root,h.right.ref.path);assert.equal(compare(h).comparisonStatus,'TEXTUALLY_AGREED');
  h=harness();mutateRecord(h,'left',x=>{x.inputPacket.source.sourceImageRequired=true;x.imageShas=[];});h.left.ref=fileRef(h.root,h.left.ref.path);h.right.ref=mutateRecord(h,'right',x=>{x.inputPacket.source.sourceImageRequired=true;x.imageShas=[];});assert.throws(()=>compare(h),{message:'REQUIRED_IMAGE_BINDING_MISSING'});
});

test('rejects stale file bindings, malformed frozen data, forged hashes, malformed inventories and source leaks',()=>{
  let h=harness();assert.throws(()=>compareFrozenSourceConditionInventories({root:h.root,leftRef:{...h.left.ref,bytes:h.left.ref.bytes+1},rightRef:h.right.ref}),/STALE_FILE/);
  h=harness();mutateRecord(h,'left',x=>{x.inputSha256='sha256:'+'0'.repeat(64);});h.left.ref=fileRef(h.root,h.left.ref.path);assert.throws(()=>compare(h),{message:'INPUT_HASH_MISMATCH'});
  for(const rows of [[{id:' ',condition:'x'}],[{id:'x',condition:'x'},{id:'x',condition:'y'}],[{id:'é',condition:'x'},{id:'e\u0301',condition:'y'}],[{id:'x',condition:'  '}],[{id:'x',condition:'x',extra:1}]]){h=harness(rows);assert.throws(()=>compare(h),/INVALID_CONDITION_ROW/);}
  h=harness();mutateRecord(h,'left',x=>{x.payload.uncoveredConditions=['missing'];});h.left.ref=fileRef(h.root,h.left.ref.path);assert.throws(()=>compare(h),{message:'BLIND_RECORD_NOT_CLOSED'});
  h=harness();mutateRecord(h,'left',x=>{x.inputPacket.source.answer='42';});h.left.ref=fileRef(h.root,h.left.ref.path);assert.throws(()=>compare(h),/BLIND_SOURCE_LEAK/);
  h=harness();fs.writeFileSync(path.join(h.root,h.left.ref.path),'{broken');h.left.ref=fileRef(h.root,h.left.ref.path);assert.throws(()=>compare(h),{message:'MALFORMED_FROZEN_JSON'});
});

test('retains claimed metadata as debt and output mutation cannot alter files or caller refs',()=>{
  const h=harness(undefined,undefined,{leftOverrides:{model:'',contextId:'shared',providerInvocationId:'same',subagentToolsEnabled:'no'},rightOverrides:{model:null,contextId:'shared',providerInvocationId:'same',subagentToolsEnabled:true}});
  const before=fs.readFileSync(path.join(h.root,h.left.ref.path));const result=compare(h);
  assert.equal(result.left.metadata.model,null);assert.equal(result.left.metadata.subagentToolsEnabled,null);
  assert.ok(result.debts.includes('LEFT_MODEL_UNVERIFIED'));assert.ok(result.debts.includes('LEFT_SUBAGENT_TOOLS_STATE_UNVERIFIED'));
  assert.ok(result.debts.includes('REUSED_CONTEXT_OR_INVOCATION_METADATA'));
  result.left.metadata.model='tampered';result.left.source.content='tampered';result.matched[0].left.condition='tampered';
  assert.deepEqual(fs.readFileSync(path.join(h.root,h.left.ref.path)),before);assert.equal(h.left.record.model,'');
});

test('rejects non-string hash values without RegExp coercion after a valid recomputed packet hash',()=>{
  const valid='sha256:'+'a'.repeat(64);
  for(const field of ['policySha256','inputBindingSha256'])for(const value of [[valid],[[valid]],{value:valid}]){
    const h=harness();mutateRecord(h,'left',record=>{record.inputPacket[field]=value;record.inputSha256=objectSha(record.inputPacket);});h.left.ref=fileRef(h.root,h.left.ref.path);
    assert.throws(()=>compare(h),{message:'INVALID_SOURCE_INPUT_HASH'},`${field}=${JSON.stringify(value)}`);
  }
  for(const wrap of [hash=>[hash],hash=>[[hash]]]){
    const h=harness();mutateRecord(h,'left',record=>{record.inputSha256=wrap(record.inputSha256);});h.left.ref=fileRef(h.root,h.left.ref.path);
    assert.throws(()=>compare(h),{message:'INVALID_SOURCE_INPUT_HASH'},`inputSha256=${JSON.stringify(wrap(valid))}`);
  }
});

test('snapshots caller file-ref scalars once for both byte validation and returned provenance',()=>{
  const h=harness(),raw={...h.left.ref};let pathReads=0;
  const changingRef={get path(){pathReads++;return pathReads===1?raw.path:'different-unread.json';},bytes:raw.bytes,sha256:raw.sha256};
  const result=compareFrozenSourceConditionInventories({root:h.root,leftRef:changingRef,rightRef:h.right.ref});
  assert.equal(pathReads,1);
  assert.deepEqual(result.left.ref,raw);
  assert.notEqual(result.left.ref,changingRef);
  assert.equal(result.left.ref.bytes,raw.bytes);assert.equal(result.left.ref.sha256,raw.sha256);
});


