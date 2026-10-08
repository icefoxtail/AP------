import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const generated=path.join(root,'.tmp/archive/adapter-node-regression/node-adapter-q01/visual-engine/production');
const command=path.join(root,'archive/tools/past-exam-pipeline/build-visual-candidate.mjs');
const bundle=()=>({schemaVersion:'past-exam-expected-facts-v1',questionUid:'node-adapter-q01',route:'STANDARD',visualType:'coordinate_geometry',viewport:{xMin:-3,xMax:3,yMin:-3,yMax:3},sourceFacts:{A:[0,0],B:[2,0],xAxis:[0,1,0],yAxis:[1,0,0]},derivedFacts:{},displayFacts:{},objects:[{id:'A',kind:'POINT',at:[0,0]},{id:'B',kind:'POINT',at:[2,0]},{id:'xAxis',kind:'LINE',coefficients:[0,1,0]},{id:'yAxis',kind:'LINE',coefficients:[1,0,0]},{id:'origin',kind:'INTERSECTION',refs:['xAxis','yAxis'],target:'A'}],axes:true});
const run=(input,extra=[])=>{
  fs.mkdirSync(generated,{recursive:true});
  const facts=path.join(generated,'expected-facts.json');fs.writeFileSync(facts,JSON.stringify(input));
  return spawnSync(process.execPath,[command,'--facts',facts,'--run-id','adapter-node-regression',...extra],{cwd:root,encoding:'utf8'});
};

test('Past Exam V3 adapter builds a hash-bound candidate below its Archive temporary workspace',()=>{
  const input=bundle(),before=JSON.stringify(input),result=run(input);
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.stringify(input),before);
  const emitted=JSON.parse(result.stdout.trim());
  assert.equal(emitted.route,'STANDARD');
  assert.equal(emitted.path,'.tmp/archive/adapter-node-regression/node-adapter-q01/visual-engine/production/candidate/node-adapter-q01');
  const folder=path.join(root,emitted.path),spec=JSON.parse(fs.readFileSync(path.join(folder,'visualSpec.json'))),witness=JSON.parse(fs.readFileSync(path.join(folder,'witness.json')));
  assert.equal(spec.sourceFacts.independentFactHash,emitted.independentFactHash);
  assert.equal(witness.independentFactHash,emitted.independentFactHash);
  assert.equal(witness.publicationAuthorized,false);
  assert.equal(fs.existsSync(path.join(folder,'visual.svg')),true);
});

test('frozen fact mutation changes the outer and inner SHA binding',()=>{
  const first=JSON.parse(run(bundle()).stdout.trim());const changed=bundle();changed.sourceFacts.B=[3,0];
  const second=JSON.parse(run(changed).stdout.trim());assert.notEqual(first.independentFactHash,second.independentFactHash);
});

test('adapter rejects a production output root before any production write',()=>{
  const before=fs.readdirSync(path.join(root,'archive/assets/images')).length;
  const result=run(bundle(),['--output-root','archive/assets/images/not-a-candidate']);
  assert.notEqual(result.status,0);assert.match(result.stderr,/PRODUCTION_WRITE_FORBIDDEN/);
  assert.equal(fs.readdirSync(path.join(root,'archive/assets/images')).length,before);
});

test('missing visual spec and invalid semantic relation fail closed',()=>{
  const missing=bundle();delete missing.objects;assert.notEqual(run(missing).status,0);
  const invalid=bundle();invalid.objects.at(-1).refs=['xAxis','unknown'];assert.notEqual(run(invalid).status,0);
});

test('adapter has no source-question mutation output or new completion fields',()=>{
  const contract=JSON.parse(fs.readFileSync(path.join(root,'archive/tools/past-exam-pipeline/completion-contract.json'),'utf8'));
  const emitted=JSON.parse(run(bundle()).stdout.trim());
  assert.deepEqual(Object.keys(emitted).sort(),['independentFactHash','path','route','status'].sort());
  assert.equal(contract.allowedCompletionFields.includes('geometryVisual'),false);
  assert.ok(contract.allowedCompletionFields.includes('solutionImage'));
  assert.deepEqual(contract.stages.slice(contract.stages.indexOf('EXPECTED_FACT_FREEZE'),contract.stages.indexOf('EXPECTED_FACT_FREEZE')+2),['EXPECTED_FACT_FREEZE','NUMERIC_VISUAL_BUILD']);
});
