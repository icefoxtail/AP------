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

// (P-A) scales a figure that the width-only list cannot reach: measured page values (solution column 298.16 px, A4 column 316.2 px) written here, not computed by the code under test.
const observation={solutionMetaContentWidth:298.15625};
const candidates=(width,height)=>solutionImageScaleCandidates({intrinsicSvg:{width,height},observation});
test('a 828x406 grid (two Venn panels) is carried by 94 percent, the largest whole percent the column allows',()=>{
  // 828 wide needs 11.25/32 = 0.3516 display scale = 291.1 px; 90 % shows 284.6 px (32.7 base font, over the cap), 94 % shows 297.2 px (31.3).
  assert.deepEqual(candidates(828,406),[94]);
});
test('a tall 410x788 stack is limited by its height, so the scales that reach 0.3516 of 788 (277 px, i.e. 88 %) are added after the old list',()=>{
  const list=candidates(410,788);
  assert.deepEqual(list.slice(0,3),[65,70,75]);                 // the old width-only list is untouched and stays first
  assert.ok(list.includes(90)&&list.includes(94));
  assert.ok(!list.slice(3).some(value=>value<88));              // nothing below 88 % can show the labels at the floor
});
test('a figure no scale can carry still has no candidate (the 11 px label floor and the 32 base-font cap are not relaxed)',()=>{
  assert.deepEqual(candidates(1168,400),[]);
  assert.deepEqual(candidates(848,300),[]);                       // 94 % shows 297.2 px: 32.1 over the cap
});
// The lists main produced (width-only rule) for the same inputs, frozen: the new list starts with exactly these, so a figure one of them carried keeps choosing the same scale.
const FROZEN_MAIN_LISTS=[[400,300,[60,65,70]],[400,400,[60,65,70]],[400,600,[60,65,70]],[400,788,[60,65,70]],[548,300,[85,90]],[548,400,[85,90]],[548,600,[85,90]],[548,788,[85,90]],[610,300,[90]],[610,400,[90]],[610,600,[90]],[610,788,[90]],[720,300,[90]],[720,400,[90]],[720,600,[90]],[720,788,[90]],[776,300,[90]],[776,400,[90]],[776,600,[90]],[776,788,[90]],[790,300,[90]],[790,400,[90]],[790,600,[90]],[790,788,[90]],[860,300,[]],[860,400,[]],[860,600,[]],[860,788,[]]];
test('the list main produced is always the front of the new one',()=>{
  for(const [width,height,before] of FROZEN_MAIN_LISTS){
    const list=candidates(width,height);
    assert.deepEqual(list.slice(0,before.length),before,width+'x'+height);
    for(const value of list)assert.ok(value>=30&&value<=100);
    // what follows is strictly bigger than everything the old list tried
    for(const value of list.slice(before.length))assert.ok(before.length===0||value>Math.max(...before),width+'x'+height);
  }
});
