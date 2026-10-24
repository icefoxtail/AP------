import test from 'node:test';
import assert from 'node:assert/strict';
import {solveNumberLineFigure} from '../production/number-line-v1.mjs';

const O=value=>({value,state:'OPEN'}),C=value=>({value,state:'CLOSED'});
const set=(...pieces)=>({kind:'SET',pieces});
const piece=(lo,hi)=>({lo,hi});
const code=expected=>error=>error.message===expected;

test('an end may be an exact surd; the engine keeps it exact and orders it exactly', () => {
  const m=solveNumberLineFigure({variable:'k',rows:[set(piece(O('-sqrt(10)'),O('sqrt(10)'))),set(piece(null,O('-7')),piece(O('3'),null)),{kind:'RESULT',integerPoints:true}]});
  assert.equal(m.rows[0].pieces[0].lower.value,'-sqrt(10)');
  assert.equal(m.rows[0].pieces[0].upper.tex,String.raw`\sqrt{10}`);
  assert.deepEqual([m.rows[2].pieces[0].lower.value,m.rows[2].pieces[0].upper.value],['3','sqrt(10)']);
  assert.deepEqual(m.rows[2].integers,[]);
});
test('(1+sqrt(2))/2 and integer points between surd ends', () => {
  const m=solveNumberLineFigure({rows:[set(piece(C('-sqrt(3)'),C('2*sqrt(3)'))),set(piece(O('-5'),O('5'))),{kind:'RESULT',integerPoints:true}]});
  assert.deepEqual(m.rows[2].integers,['-1','0','1','2','3']);
  const q=solveNumberLineFigure({rows:[set(piece(C('(1+sqrt(2))/2'),null))]});
  assert.equal(q.rows[0].pieces[0].lower.value,'(1+sqrt(2))/2');
});
test('a surd end equal to a rational end is detected exactly (a one-point result is refused)', () => {
  assert.throws(()=>solveNumberLineFigure({rows:[set(piece(C('sqrt(4)'),null)),set(piece(null,C('2'))),{kind:'RESULT'}]}),code('NUMBER_LINE_RESULT_IS_A_POINT'));
});
test('two different radicals and non-surd text are refused', () => {
  assert.throws(()=>solveNumberLineFigure({rows:[set(piece(O('sqrt(2)'),null)),set(piece(O('sqrt(3)'),null)),{kind:'RESULT'}]}));
  assert.throws(()=>solveNumberLineFigure({rows:[set(piece(O('1.5'),null))]}),code('NUMBER_LINE_VALUE_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[set(piece(O('sqrt(-1)'),null))]}),code('NUMBER_LINE_VALUE_INVALID'));
});
