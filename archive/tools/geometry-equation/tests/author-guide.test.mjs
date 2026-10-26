import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildGuide,contractText,guidePath} from '../production/build-author-guide.mjs';

test('AUTHOR_GUIDE.md is the current build of its body plus the phase2 contract',()=>{
  assert.equal(fs.readFileSync(guidePath,'utf8'),buildGuide(),'run node production/build-author-guide.mjs and commit AUTHOR_GUIDE.md');
});

test('the guide carries the contract passages an author needs',()=>{
  const guide=fs.readFileSync(guidePath,'utf8');
  const contract=contractText();
  for(const capability of ['polynomial-spike-v1','composite-panels-v1','piecewise-polynomial-spike-v1','quadratic-inequality-chain-v1','construction-spike-v1','stat-chart-figure-v1','set-diagram-figure-v1']){
    assert.ok(contract.includes(capability),'contract text lacks '+capability);
    assert.ok(guide.includes(capability),'guide lacks '+capability);
  }
  assert.ok(contract.includes('axisVariable'),'contract text lacks axisVariable');
  assert.ok(guide.includes('SOURCE_COORDINATE_AXES_v1'),'guide must explain plane marks on a coordinate construction plan');
  assert.ok(guide.includes('PLANE_MARKS_UNSUPPORTED_ON_GRAPH'),'guide must state that a graph plan refuses planeMarks');
  assert.ok(guide.includes('EXEMPT')&&guide.includes('UNSUPPORTED'),'guide must explain the no-figure outcomes');
  assert.ok(guide.includes('sourceQuote'),'guide must explain the item-binding quote');
});

test('the guide has no stray carriage returns and keeps its generated-file notice',()=>{
  const guide=fs.readFileSync(guidePath,'utf8');
  assert.equal(guide.includes('\r'),false);
  assert.ok(guide.startsWith('<!-- 자동 생성 파일입니다.'));
});
