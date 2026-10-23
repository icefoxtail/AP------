import test from 'node:test';
import assert from 'node:assert/strict';
import {typesetter,MATH_GLYPH_STROKE_UNITS} from '../production/typography.mjs';

test('math fragments stroke their glyph outlines so thin bars (=, −, fraction rules) keep a visible thickness',()=>{
  const fragment=typesetter()({id:'e',owner:'o',factRole:'GIVEN',fontPx:20,kind:'MATH',tex:String.raw`y=-x+\frac{13}{4}`},{visualAssetKey:'k'});
  assert.equal(MATH_GLYPH_STROKE_UNITS,30);
  assert.match(fragment.svg,new RegExp(`stroke="currentColor" fill="currentColor" stroke-width="${MATH_GLYPH_STROKE_UNITS}"`));
  assert.doesNotMatch(fragment.svg,/stroke-width="0"/);
  const text=typesetter()({id:'t',owner:'o',factRole:'GIVEN',fontPx:20,kind:'TEXT',text:'일 때'},{visualAssetKey:'k'});
  assert.doesNotMatch(text.svg,/stroke-width/);
});
