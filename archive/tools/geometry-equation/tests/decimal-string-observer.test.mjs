// A decimal coordinate the SymPy model writes (no short closed form) must be a plain number string the independent Cindy peer reads.
// The observer's grammar stays strict: SymPy's mantissa-less zero (0.e-149) is still refused; the producer no longer writes it.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {scalar} from '../production/cindy-observer.mjs';

const integer=value=>({kind:'integer',value:String(value)});
const source=(id,x,y)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[integer(x),integer(y)]},outputType:'POINT',factRole:'GIVEN'});
const polar=(id,center,reference,length,angle,turn='CCW')=>({id,op:'POLAR_POINT',inputs:[center,reference],args:{length:integer(length),angleDeg:integer(angle),turn},outputType:'POINT',factRole:'GIVEN'});
const plane=nodes=>({schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes});

test('the observer reads a plain zero and a plain small decimal, and still refuses the old mantissa-less zero', () => {
  assert.equal(scalar({kind:'decimal',value:'0'}),0);
  assert.equal(scalar({kind:'decimal',value:'-0.5'}),-0.5);
  assert.ok(Math.abs(scalar({kind:'decimal',value:'0.0000000000000000000000000002414213562373095048801688724209698'})-2.414213562373095e-28)<1e-40);
  for(const bad of ['0.e-149','-0.e-147','.5','1.','0x10'])assert.throws(()=>scalar({kind:'decimal',value:bad}),/UNSUPPORTED_CINDY_SCALAR/,bad);
});

test('every decimal the real model worker emits for a non-special angle is a plain number the observer reads', async () => {
  const result=await pythonWorker({action:'construction',graph:plane([source('B',0,0),source('C',6,0),polar('A','B','C',4,40),polar('D','A','B',3,25,'CW')])},{timeoutMs:90000});
  assert.equal(result.status,'OK');
  const decimals=Object.values(result.result.points).flatMap(point=>point.exact).filter(value=>value.kind==='decimal');
  assert.ok(decimals.length>=4);
  for(const value of decimals){
    assert.match(value.value,/^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/,'plain positional decimal: '+value.value);
    assert.ok(Number.isFinite(scalar(value)));
  }
});
