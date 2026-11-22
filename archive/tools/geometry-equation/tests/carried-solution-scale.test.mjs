import test from 'node:test';
import assert from 'node:assert/strict';
import {carriedSolutionImageScale,solutionImageScaleCandidates} from '../production/construction-archive-capture-v1.mjs';

test('a question that already carries a valid solutionImageScale (30-100) hands it to the measurement; anything else is ignored',()=>{
  assert.equal(carriedSolutionImageScale({id:7,solutionImageScale:85}),85);
  assert.equal(carriedSolutionImageScale({id:7,solutionImageScale:30}),30);
  assert.equal(carriedSolutionImageScale({id:7,solutionImageScale:100}),100);
  for(const bad of [undefined,null,'85',29,101,NaN,Infinity,true,0])assert.equal(carriedSolutionImageScale({id:7,solutionImageScale:bad}),undefined,String(bad));
  assert.equal(carriedSolutionImageScale({id:7}),undefined);
  assert.equal(carriedSolutionImageScale(undefined),undefined);
});

test('scale candidates stay between 30 and 100 percent of the column in steps of 5',()=>{
  for(const width of [548,610,720,790,860]){
    const list=solutionImageScaleCandidates({intrinsicSvg:{width,height:400},observation:{solutionMetaContentWidth:316.2}});
    for(const value of list){assert.ok(value>=30&&value<=100,String(value));assert.equal(value%5,0);}
  }
});
