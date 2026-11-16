import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fixture} from './fixtures/type-judgment/context.mjs';
import {loadUnits, resolveUnitScope} from '../archive/tools/type-judgment/units.mjs';
import {validateLedger, compareLedgers} from '../archive/tools/type-judgment/check-ledger.mjs';

function setup() {
  const {context,exam}=fixture();
  const ledger={schemaVersion:'type-judgment-ledger-v1',exam:exam.exam,entries:[{
    questionUid:exam.rows[0].questionUid,sourceOrdinal:1,decision:'PICK',problemTypeKey:'PT_A',templateKey:'TPL_A',
    decisiveStep:'양변에서 1을 뺀다.',cue:'x+1=2',
  }]};
  return {context,exam,ledger};
}
test('explicit UID override resolves only units, records source and never mutates canonical',()=>{
  const {context,exam}=setup(),row=exam.rows[0];row.metadata.subUnitKey='UNKNOWN';
  const before=JSON.stringify(row),units={[row.questionUid]:{standardUnitKey:'U-01',subUnitKey:'S-01'}};
  const result=resolveUnitScope(context,row,exam.questions[0],units);
  assert.equal(result.unitSource,'OVERRIDE');assert.equal(result.scope.sub,'S-01');assert.deepEqual(result.errors,[]);
  assert.equal(result.scope.course,'수학');assert.equal(JSON.stringify(row),before);
});
test('inline is explicit, used only on invalid canonical units, and validates master parent/status',()=>{
  const {context,exam}=setup(),row=exam.rows[0],question={...exam.questions[0],standardUnitKey:'U-01',subUnitKey:'S-01'};
  assert.equal(resolveUnitScope(context,row,question,'inline').unitSource,'CANONICAL');
  row.metadata.subUnitKey='UNKNOWN';
  assert.equal(resolveUnitScope(context,row,question).errors[0].code,'CANONICAL_SUBUNIT_INVALID');
  assert.deepEqual(resolveUnitScope(context,row,question,'inline').errors,[]);
  assert.equal(resolveUnitScope(context,row,question,'inline').unitSource,'INLINE');
  assert.ok(resolveUnitScope(context,row,{...question,standardUnitKey:'U-03'},'inline').errors.length);
  context.master.get('S-01').status='RETIRED';
  assert.ok(resolveUnitScope(context,row,question,'inline').errors.length);
});
test('external units loader rejects repository/symlink/foreign checkout and malformed maps',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'type-units-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const repo=path.join(root,'repo');fs.mkdirSync(repo);
  const data={q1:{standardUnitKey:'U-01',subUnitKey:'S-01'}},outside=path.join(root,'units.json');fs.writeFileSync(outside,JSON.stringify(data));
  assert.deepEqual(loadUnits(outside,repo),data);assert.equal(loadUnits('inline',repo),'inline');
  fs.writeFileSync(path.join(repo,'units.json'),JSON.stringify(data));fs.symlinkSync(path.join(repo,'units.json'),path.join(root,'link.json'));
  assert.throws(()=>loadUnits(path.join(root,'link.json'),repo),/INSIDE_REPOSITORY/);
  const other=path.join(root,'other');fs.mkdirSync(other);fs.writeFileSync(path.join(other,'.git'),'gitdir: elsewhere');fs.writeFileSync(path.join(other,'units.json'),JSON.stringify(data));
  assert.throws(()=>loadUnits(path.join(other,'units.json'),repo),/INSIDE_REPOSITORY/);
  for(const bad of [[],{q1:null},{q1:{standardUnitKey:'U-01',extra:true}},{q1:{standardUnitKey:2}}])assert.throws(()=>loadUnits(bad,repo),/UNITS_/);
});
test('ledger and comparison use the same override scope; inactive keys and wrong parents remain invalid',()=>{
  const {context,exam,ledger}=setup();exam.rows[0].metadata.subUnitKey='MISSING';
  const units={[exam.rows[0].questionUid]:{standardUnitKey:'U-01',subUnitKey:'S-01'}};
  assert.equal(validateLedger(context,ledger,exam).valid,false);
  const result=validateLedger(context,ledger,exam,{units});assert.equal(result.valid,true);assert.equal(result.rows[0].unitSource,'OVERRIDE');
  assert.equal(compareLedgers(context,ledger,ledger,exam,{units}).counts.AGREE,1);
  ledger.entries[0].templateKey='TPL_OTHER';assert.equal(validateLedger(context,ledger,exam,{units}).valid,false);
});
test('no exact course binding is debt, not rejection; no false registration approval',()=>{
  const {context,exam,ledger}=setup();exam.rows[0].metadata.courseKey='unbound alias';
  const result=validateLedger(context,ledger,exam);
  assert.equal(result.valid,true);assert.equal(result.rows[0].status,'NEEDS_BINDING');assert.equal(result.approval,'NOT_EVALUATED');
  assert.equal(result.rows[0].warnings[0].code,'CANONICAL_COURSE_ALIAS_UNVERIFIED');
  context.registry.problemTypes.get('PT_A').status='RETIRED';assert.equal(validateLedger(context,ledger,exam).valid,false);
});
