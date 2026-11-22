import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {specFor} from '../production/phase2.mjs';

// G bundle (2026-11-23), 2a-EQ: a figure drawn at a squeezed scale (the framer records axisRatio other than 1) keeps the window it was framed in.
// The engine widens a window by 8 % on each axis when the unit points (1,0) and (0,1) lie outside it, which breaks a recorded y/x ratio; viewport.declaredScale
// turns that widening off (visual_engine/engine.py reads it). phase2.mjs sets it for every squeezed figure, and only for those.
const quadratic=(extra={})=>({capability:'polynomial-spike-v1',caption:'이차함수',graphPlan:{
  family:'polynomial',coefficients:['5','8','2'],domain:[-4,0],viewport:[-4.43,0.43,-3.87,5.87],overviewFeatures:[],
  requiredPoints:[{id:'V',x:-2,y:-3}],equalUnits:true,plotCanvas:{width:448,height:448},...extra}});

test('a squeezed quadratic frame is declared, so the engine keeps its window',()=>{
  const spec=specFor(quadratic({axisRatio:0.5}),{},'squeezed-quadratic');
  assert.equal(spec.viewport.declaredScale,true);
  assert.equal(spec.viewport.equalUnits,undefined);
});

test('an equal-unit quadratic frame is as it was: equalUnits and no declaredScale',()=>{
  for(const extra of [{axisRatio:1},{}]){
    const spec=specFor(quadratic(extra),{},'equal-quadratic');
    assert.equal(spec.viewport.equalUnits,true);
    assert.equal(spec.viewport.declaredScale,undefined);
  }
});

// The python half of the bundle (framer and observer rules that need no browser).
test('graph G bundle python tests pass',{skip:process.env.GEOMETRY_SKIP_PYTHON==='1'},()=>{
  const here=path.dirname(fileURLToPath(import.meta.url));
  try{
    execFileSync(process.env.PYTHON||'python',['-m','unittest','test_graph_g_bundle'],{cwd:here,stdio:'pipe',encoding:'utf8'});
  }catch(error){
    assert.fail(String(error.stderr||error.stdout||error.message).slice(-4000));
  }
});
