import test from 'node:test';
import assert from 'node:assert/strict';
import {quadraticVertexNotation} from '../production/polynomial-notation.mjs';
import {pythonWorker} from '../production/worker.mjs';

test('exact quadratic vertex notation agrees with original coefficients on independently sampled graph points',async()=>{
 const cases=[['-1','0','3'],['8','-6','1'],['-1/2','3','1/2'],['-17/3','5/7','-3/2']];
 for(const coefficients of cases){
  const notation=quadraticVertexNotation(coefficients);
  const response=await pythonWorker({action:'prepare',spec:{id:'quadratic-notation',visualType:'function_graph',axes:false,viewport:{xMin:-4,xMax:4,yMin:-40,yMax:40,width:384,height:320,panel:0},sourceFacts:{},derivedFacts:{},displayFacts:{},objects:[{id:'g',kind:'FUNCTION_GRAPH',expression:notation.expression,domain:[-4,4]}]}});
  assert.equal(response.status,'OK');
  const [c,b,a]=coefficients.map(v=>{const[n,d='1']=v.split('/');return Number(n)/Number(d);});
  const model=response.result.coordinateModel;
  assert.ok(model.sx>0&&model.sy>0);
  let sampleCount=0;
  for(const primitive of response.result.prepared.primitives.filter(p=>p.role==='curve'))for(const[x,y]of primitive.points){
   const sourceX=(x-model.originX)/model.sx,sourceY=(model.originY-y)/model.sy;
   if(Math.abs(sourceY)>=40-1e-7)continue; // clipped polyline endpoints are interpolated
   assert.ok(Math.abs(sourceY-(a*sourceX**2+b*sourceX+c))<1e-6,JSON.stringify({coefficients,expression:notation.expression,sourceX,sourceY}));sampleCount++;
  }
  assert.ok(sampleCount>8);
  assert.equal(notation.basis,'EXACT_COMPLETING_THE_SQUARE');
 }
 assert.equal(quadraticVertexNotation(['8','-6','1']).expression,'(x-3)^2-1');
 assert.equal(quadraticVertexNotation(['-1/2','3','1/2']).expression,'(1/2)*(x+3)^2-5');
 assert.equal(quadraticVertexNotation(['1','2']),null);
 assert.throws(()=>quadraticVertexNotation(['1/0','1','2']),/ZERO_DENOMINATOR/);
});
