import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {typesetter} from '../production/typography.mjs';
import {pythonWorker} from '../production/worker.mjs';
const script=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
test('independent XML observer rejects coordinate, owner, glyph and ancestor transform mutations',async()=>{
  const f=typesetter()({id:'A-name',owner:'A',factRole:'GIVEN',fontPx:20,kind:'MATH',tex:'A'},{visualAssetKey:'test'});
  const prefix='<svg xmlns="http://www.w3.org/2000/svg"><circle id="A" data-role="point" cx="10" cy="20" r="2"/>';
  const suffix='<g id="A-name" data-owner="A" data-fragment-sha="'+f.fragmentSha256+'" transform="translate(20 20)">'+f.svg+'</g></svg>';
  const p={svg:prefix+suffix,points:{A:[1,-2]},segments:[],rightAngles:[],transform:{originX:0,originY:0,sx:10,sy:10},fragments:{'A-name':f},coordinateMode:'SOURCE_COORDINATES'};
  assert.equal((await pythonWorker(p,{script})).result.status,'PASS');
  for(const svg of [p.svg.replace('cx="10"','cx="12"'),p.svg.replace('data-owner="A"','data-owner="B"'),p.svg.replace(f.svg,'<!--'+f.svg+'-->'+f.svg.replace('<path','<path opacity="0.5"')),p.svg.replace('<circle','<g transform="translate(100 0)"><circle').replace('/><g id="A-name"','/></g><g id="A-name"')]){
    const observed=(await pythonWorker({...p,svg},{script})).result;assert.equal(observed.status,'FAIL',JSON.stringify(observed));
  }
});
