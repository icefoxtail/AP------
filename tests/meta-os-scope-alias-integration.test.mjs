import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveReviewedScope } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import { projectionBindingsWithAliases } from '../archive/tools/meta-foundation/rpm-active-resolver.mjs';

function fixture(course = '중2 수학') {
  const row = { curriculum: '2015', standardCourse: course, standardUnitKey: 'M2-01', subUnitKey: null,
    problemTypeKey: 'PT_TEST', templateKey: 'TPL_TEST', crossConceptKeys: [], conditionKeys: [],
    sourceArchiveFile: 'original/middle/m2/1mid/test.js' };
  const binding = { curriculum: '2015', standardCourse: '중2 수학', standardUnitKey: 'M2-01', subUnitKey: null,
    problemTypeKey: row.problemTypeKey, ownerPack: 'test', status: 'ACTIVE' };
  const pt = { problemTypeKey: row.problemTypeKey, ownerPack: 'test', status: 'ACTIVE' };
  const tpl = { templateKey: row.templateKey, parentProblemTypeKey: pt.problemTypeKey, status: 'ACTIVE' };
  const unit = { key: row.standardUnitKey, keyType: 'standardUnitKey', status: 'ACTIVE' };
  const pack = { meta: { curricula: ['2015'], standardCourses: ['중2 수학'] } };
  const key = b => JSON.stringify([b.curriculum,b.standardCourse,b.standardUnitKey,b.subUnitKey,b.problemTypeKey]);
  const tables = { pt: new Map([[pt.problemTypeKey, pt]]), tpl: new Map([[tpl.templateKey,tpl]]),
    cc: new Map(), cond: new Map(), master: new Map([[unit.key,unit]]), packs: new Map([['test',pack]]),
    bindings: new Map([[key(binding),binding]]), ext: { check() { throw Error('unexpected extension'); } } };
  return {row,binding,pt,tpl,unit,pack,tables,key};
}

test('registrar exact output remains unchanged and uses original objects', () => {
  const f = fixture();
  assert.deepEqual(resolveReviewedScope(f.row,f.tables), {pt:f.pt,tpl:f.tpl,unit:f.unit,sub:undefined,
    binding:f.binding,pack:f.pack,curriculum:'2015',course:'중2 수학',extensions:[]});
});
test('registrar observed spelling fallback is read-only and marked', () => {
  const f=fixture('중2-1'), snapshot=JSON.stringify(f.row);
  const result=resolveReviewedScope(f.row,f.tables);
  assert.equal(result.bindingMatch,'ALIAS'); assert.equal(result.binding,f.binding);
  assert.equal(result.course,'중2-1'); assert.equal(JSON.stringify(f.row),snapshot);
});
test('registrar alias still rejects inactive PT, wrong TPL parent and wrong pack curriculum',()=>{
  let f=fixture('중2-1');f.pt.status='INACTIVE';assert.throws(()=>resolveReviewedScope(f.row,f.tables),/inactive/);
  f=fixture('중2-1');f.tpl.parentProblemTypeKey='OTHER';assert.throws(()=>resolveReviewedScope(f.row,f.tables),/parent mismatch/);
  f=fixture('중2-1');f.pack.meta.curricula=['2022'];assert.throws(()=>resolveReviewedScope(f.row,f.tables),/scope missing/);
});
test('registrar refuses conflicting course, subunit, and ambiguous alias owners',()=>{
  let f=fixture('수학Ⅱ');assert.throws(()=>resolveReviewedScope(f.row,f.tables),/binding missing/);
  f=fixture('중2-1');f.binding.subUnitKey='OTHER';assert.throws(()=>resolveReviewedScope(f.row,f.tables),/binding missing/);
  f=fixture('중2-1');f.tables.bindings.set('extra',{...f.binding,standardCourse:'중2',ownerPack:'other'});
  assert.throws(()=>resolveReviewedScope(f.row,f.tables),/ambiguous/);
});
test('RPM projection retains exact rows even if an alias row also exists',()=>{
  const f=fixture(), extra={...f.binding,standardCourse:'중2'};
  assert.deepEqual(projectionBindingsWithAliases({bindingRows:[f.binding,extra]}, {},f.row,'PT_TEST'),{rows:[f.binding]});
});
test('RPM projection aliases preserve PT, curriculum and subunit boundaries',()=>{
  const f=fixture('중2-1'), registry={bindingRows:[f.binding]};
  assert.deepEqual(projectionBindingsWithAliases(registry,{},f.row,'PT_TEST'),{rows:[f.binding],bindingMatch:'ALIAS'});
  for (const override of [{curriculum:'2022'},{subUnitKey:'OTHER'},{standardCourse:'수학Ⅱ'}]) {
    assert.deepEqual(projectionBindingsWithAliases(registry,{}, {...f.row,...override},'PT_TEST'),{rows:[]});
  }
  assert.deepEqual(projectionBindingsWithAliases(registry,{},f.row,'OTHER'),{rows:[]});
  assert.deepEqual(projectionBindingsWithAliases(registry,{}, {...f.row,curriculum:'2022',standardCourse:'never-observed'},'PT_TEST'),{rows:[]});
});

test('full RPM result marks an alias without replacing semantic evidence or original binding rows', async()=>{
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const { loadActiveMetaRegistry } = await import('../archive/tools/meta-foundation/active-registry.mjs');
  const { resolveMetaRoute, questionUidForSource, validateResolverEvidence } = await import('../archive/tools/meta-foundation/rpm-active-resolver.mjs');
  const root = fileURLToPath(new URL('../',import.meta.url));
  const row = JSON.parse(readFileSync(new URL('../archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json',import.meta.url))).records.find(r=>r.id==='M2-RPM-067');
  const sourceArchiveFile='original/middle/m2/2mid/fixture.js';
  const input={sourceIdentity:{sourceArchiveFile,questionUid:questionUidForSource(sourceArchiveFile,1),sourceOrdinal:1,
    sourceIdentityKey:'fixture-1',contentHash:'content',choicesHash:'choices',imageRefHash:'image'},
    solutionIdentity:{status:'VERIFIED_FINAL',independentVerification:true,solutionHash:'solution'},
    curriculumContext:{grade:'M2',curriculum:row.curriculum,scope:row.scope,standardCourse:'중2 수학',standardUnitKey:row.standardUnitKey,subUnitKey:row.subUnitKey},
    semanticDecision:{primaryMethod:'삼각형의 내심을 이용한다.',decisiveStep:'내심에서 변까지의 거리는 같다.',rpmPath:{curriculum:row.curriculum,scope:row.scope,...row.rpmPath}}};
  const registry=loadActiveMetaRegistry(root), before=resolveMetaRoute(input,{repoRoot:root,registry});
  assert.equal(before.projectionStatus,'PROJECTION_REUSE',JSON.stringify(before));
  const changed={...registry,bindingRows:registry.bindingRows.map(b=>b.curriculum===row.curriculum && b.standardUnitKey===row.standardUnitKey && b.subUnitKey===row.subUnitKey && b.problemTypeKey===row.problemTypeKey ? {...b,standardCourse:'중2-2'} : b)};
  const after=resolveMetaRoute(input,{repoRoot:root,registry:changed});
  assert.equal(after.bindingMatch,'ALIAS'); assert.equal(after.legacyProjection.bindingMatch,'ALIAS');
  assert.deepEqual(after.rpmSemantic,before.rpmSemantic);
  assert.equal(after.problemTypeKey,before.problemTypeKey);assert.equal(after.templateKey,before.templateKey);
  assert.equal(validateResolverEvidence(input,after,{repoRoot:root,registry:changed}).status,'PASS');
});
