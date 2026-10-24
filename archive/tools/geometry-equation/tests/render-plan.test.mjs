import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const item={sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'};
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'render-plan-'));
const readResult=(dir,name)=>JSON.parse(fs.readFileSync(path.join(dir,`${name}-result.json`),'utf8'));

test('EXEMPT plan passes through without rendering',async()=>{
  const out=tmp();
  const r=await renderPlan({item,plan:{status:'EXEMPT',reason:'text is enough'},outDir:out});
  assert.equal(r.status,'EXEMPT');assert.equal(r.detail,'text is enough');assert.ok(r.identity);
  assert.deepEqual(readResult(out,'t'),JSON.parse(JSON.stringify(r)));
  assert.equal(fs.existsSync(path.join(out,'t-solution.svg')),false);
});

test('UNSUPPORTED plan passes through',async()=>{
  const out=tmp();
  const r=await renderPlan({item,plan:{status:'UNSUPPORTED',reason:'no family'},outDir:out});
  assert.equal(r.status,'UNSUPPORTED');assert.equal(r.detail,'no family');
  assert.equal(readResult(out,'t').status,'UNSUPPORTED');
});

test('missing plan file is FAILED at read-plan',async()=>{
  const out=tmp();
  const r=await renderPlan({item,plan:path.join(out,'nope.json'),outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'read-plan');assert.match(r.detail,/not found/);
  assert.equal(readResult(out,'t').status,'FAILED');
});
