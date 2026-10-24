// Function-family graph plans (cubic, rational, sqrt-affine, absolute-value, piecewise-affine, exponential, logarithmic, trigonometric)
// composed and rendered end to end through renderPlan. Chrome is used: run with --test-concurrency=1.
// By default two families are rendered (the slowest, a wide rational graph that needs the full-size retry, and a cosine);
// FUNCTION_FAMILIES_ALL=1 renders every family.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const item={sourcePath:'archive/exams/original/high/h2/1final/21_금당고_1학기_기말_고2_수학I.js',ordinal:1,dir:'fam'};
const all=process.env.FUNCTION_FAMILIES_ALL==='1';
const R={family:'rational',numerator:['1','1'],denominator:['-1','1'],domain:[-4,4],viewport:[-4,4,-4,4],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[],axisTickValues:{x:[],y:[]}};
const PLANS={
  rational:{capability:'rational-spike-v1',graphPlan:R,caption:'분모가 0이 되는 곳의 점근선'},
  cos:{capability:'trigonometric-spike-v1',graphPlan:{family:'trigonometric',function:'COS',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-4,4],viewport:[-5,5,-5,5],axisTickValues:{x:[],y:[]}},caption:'코사인 함수의 한 주기'},
  cubic:{capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['0','-3','0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,3],viewport:[-3,3,-4,4],requiredPoints:[]},caption:'삼차함수의 극값'},
  sqrt:{capability:'sqrt-affine-spike-v1',graphPlan:{family:'sqrt-affine',radicand:['-2','2'],sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[1,10],viewport:[-1,12,-1,6],requiredPoints:[]},caption:'무리함수의 시작점'},
  abs:{capability:'absolute-value-spike-v1',graphPlan:{family:'absolute-value',coefficients:['-2','2','1','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-5,7],viewport:[-6,8,-2,15],requiredPoints:[]},caption:'절댓값 함수의 꺾이는 점'},
  pwaff:{capability:'piecewise-affine-spike-v1',graphPlan:{family:'piecewise-affine',sourceDomain:{kind:'CLOSED_INTERVAL',range:['-4','4']},domain:[-4,4],viewport:[-5,5,-5,5],piecewise:{breakX:'0',owner:'RIGHT',left:['1','1'],right:['1','-1']}},caption:'두 조각으로 이어진 함수'},
  exp:{capability:'exponential-affine-spike-v1',graphPlan:{family:'exponential-affine',coefficients:['1','1','0'],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-3,3,-2,12]},caption:'지수함수의 증가와 점근선'},
  log:{capability:'logarithmic-affine-spike-v1',graphPlan:{family:'logarithmic-affine',coefficients:['1','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},domain:[0.1,4],viewport:[-1,5,-5,5],axisTickValues:{x:[],y:[]}},caption:'자연로그 함수의 정의역 경계와 기준점'}
};
const names=all?Object.keys(PLANS):['rational','cos'];

test('every family contract reaches the author contract text',()=>{
  const text=contractText();
  for(const name of ['rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1','trigonometric-spike-v1'])assert.ok(text.includes(`'${name}'`),name);
  assert.ok(text.includes('degree 3 or 4'));
});

for(const name of names){
  test(`family ${name} renders to ARCHIVE_BOUND`,{timeout:600000},async()=>{
    const out=fs.mkdtempSync(path.join(os.tmpdir(),`family-${name}-`));
    const r=await renderPlan({item,plan:PLANS[name],outDir:out});
    assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r).slice(0,600));
    assert.ok(fs.existsSync(path.join(out,'fam-solution.svg')));
  });
}
