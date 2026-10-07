import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {typesetter} from '../production/typography.mjs';
import {pythonWorker} from '../production/worker.mjs';
const script=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
test('independent XML observer rejects coordinate, owner, glyph and ancestor transform mutations',async()=>{
  const f=typesetter()({id:'A-name',owner:'A',factRole:'GIVEN',fontPx:20,kind:'MATH',tex:'A'},{visualAssetKey:'test'});
  const prefix='<svg xmlns="http://www.w3.org/2000/svg"><circle id="A" data-role="point" cx="10" cy="20" r="2"/>';
  const suffix='<g id="A-name" data-owner="A" data-fragment-sha="'+f.fragmentSha256+'" transform="translate(20 20)">'+f.svg+'</g></svg>';
  const p={svg:prefix+suffix,points:{A:[1,-2]},segments:[],rightAngles:[],transform:{originX:0,originY:0,sx:10,sy:10},fragments:{'A-name':f},coordinateMode:'SOURCE_COORDINATES'};
  assert.equal((await pythonWorker(p,{script})).result.status,'PASS');
  for(const svg of [p.svg.replace('cx="10"','cx="12"'),p.svg.replace('data-owner="A"','data-owner="B"'),p.svg.replace(f.svg,'<!--'+f.svg+'-->'+f.svg.replace('<path','<path opacity="0.5"')),p.svg.replace('<circle','<g transform="translate(100 0)"><circle').replace('/><g id="A-name"','/></g><g id="A-name"')]){
    const observed=(await pythonWorker({...p,svg},{script})).result;assert.equal(observed.status,'FAIL',JSON.stringify(observed));
  }
});
test('independent XML observer rejects hidden tick axis and fragment presentation attributes',async()=>{
  const f=typesetter()({id:'tick-label',owner:'tick',factRole:'GIVEN',fontPx:12,kind:'MATH',tex:'-2'},{visualAssetKey:'test-visibility'});
  const baseSvg='<svg xmlns="http://www.w3.org/2000/svg"><g id="geometry-root"><line id="x-axis" data-role="axis" x1="0" y1="0" x2="30" y2="0" stroke="#111"/><line id="tick" data-role="tick" x1="10" y1="-4" x2="10" y2="4" stroke="#111"/></g><g id="tick-label" data-owner="tick" data-fragment-sha="'+f.fragmentSha256+'" transform="translate(8 12)">'+f.svg+'</g></svg>';
  const p={svg:baseSvg,points:{},segments:[],rightAngles:[],transform:{originX:0,originY:0,sx:1,sy:1},fragments:{'tick-label':f},coordinateMode:'SOURCE_COORDINATES'};
  assert.equal((await pythonWorker(p,{script})).result.status,'PASS');
  for(const mutation of [
    ['<g id="geometry-root">','<g id="geometry-root" opacity="0">','HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE:tick'],
    ['id="tick" data-role="tick"','id="tick" data-role="tick" opacity="0"','HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE:tick'],
    ['id="tick" data-role="tick"','id="tick" data-role="tick" display="none"','HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE:tick'],
    ['id="tick" data-role="tick"','id="tick" data-role="tick" visibility="hidden"','HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE:tick'],
    ['x2="10" y2="4" stroke="#111"','x2="10" y2="4" stroke="none"','HIDDEN_GEOMETRY_STROKE:tick'],
    ['id="x-axis" data-role="axis"','id="x-axis" data-role="axis" stroke-opacity="0"','HIDDEN_GEOMETRY_STROKE:x-axis']
  ]){const observed=(await pythonWorker({...p,svg:p.svg.replace(mutation[0],mutation[1])},{script})).result;assert.ok(observed.errors.includes(mutation[2]),JSON.stringify({mutation,observed}));}
  for(const mutation of [
    ['<g id="tick-label"','<g id="tick-label" opacity="0"','HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE:tick-label'],
    ['<g id="tick-label"','<g id="tick-label" display="none"','HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE:tick-label'],
    ['<g id="tick-label"','<g id="tick-label" visibility="hidden"','HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE:tick-label'],
    ['<g id="tick-label"','<g id="tick-label" clip-path="url(#empty)"','UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK:tick-label'],
    ['<g id="tick-label"','<g id="tick-label" mask="url(#emptyMask)"','UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK:tick-label']
  ]){const observed=(await pythonWorker({...p,svg:p.svg.replace(mutation[0],mutation[1])},{script})).result;assert.ok(observed.errors.includes(mutation[2]),JSON.stringify({mutation,observed}));}
});
