import test from 'node:test';
import assert from 'node:assert/strict';
import {exactSurd,lineEquationText} from '../production/phase2.mjs';

const I=value=>({kind:'integer',value}),R=(numerator,denominator)=>({kind:'rational',numerator,denominator});
const sq=n=>({kind:'expression',op:'sqrt',args:[I(String(n))]});
const ex=(op,...args)=>({kind:'expression',op,args});
const eq=(a,b,c,form)=>lineEquationText(exactSurd(a),exactSurd(b),exactSurd(c),form);

test('rational lines are written exactly as before', () => {
  assert.equal(eq(I('2'),I('1'),I('-2'),'GENERAL'),'2*x+y-2=0');
  assert.equal(eq(I('3'),I('-1'),I('-1'),'SLOPE_INTERCEPT'),'y=3*x-1');
});
test('an irrational slope or intercept is written as an exact surd', () => {
  assert.equal(eq(sq(3),I('-1'),I('6'),'SLOPE_INTERCEPT'),'y=+sqrt(3)x+6'.replace('=+','='));
  assert.equal(eq(sq(3),I('-1'),I('-6'),'SLOPE_INTERCEPT'),'y=sqrt(3)x-6');
  assert.equal(eq(ex('neg',sq(3)),I('-1'),I('0'),'SLOPE_INTERCEPT'),'y=-sqrt(3)x');
  assert.equal(eq(I('1'),I('-1'),ex('neg',sq(2)),'SLOPE_INTERCEPT'),'y=x+(-sqrt(2))');
});
test('sqrt simplifies and a perfect square is rational', () => {
  assert.deepEqual(exactSurd(sq(12)),{p:[0n,1n],q:[2n,1n],r:3n});
  assert.deepEqual(exactSurd(sq(9)),{p:[3n,1n],q:[0n,1n],r:0n});
  assert.deepEqual(exactSurd(ex('sqrt',R('1','4'))).p,[1n,2n]);
});
test('two different radicals, a surd y coefficient in slope form and a vertical line are refused', () => {
  assert.throws(()=>exactSurd(ex('add',sq(2),sq(3))),/LINE_LABEL_COEFFICIENT_NOT_RATIONAL/);
  assert.throws(()=>eq(I('1'),sq(3),I('0'),'SLOPE_INTERCEPT'),/LINE_LABEL_COEFFICIENT_NOT_RATIONAL/);
  assert.throws(()=>eq(sq(3),I('0'),I('1'),'SLOPE_INTERCEPT'),/LINE_LABEL_SLOPE_FORM_NEEDS_NONVERTICAL_LINE/);
});
