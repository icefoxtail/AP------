import assert from 'node:assert/strict';
import test from 'node:test';
import {analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
function capture(){return{runtime:'playwright-chromium',synthetic:false,svg:{x:0,y:0,width:620,height:500},viewBox:{width:620,height:500},safeMargin:32,labels:[{id:'a',priority:0,client:{x:100,y:100,width:20,height:15},bbox:{width:20,height:15},missingGlyphCount:0}],geometry:[]};}
test('clear rendered bbox passes',()=>assert.equal(analyzeRenderedLayout(capture()).status,'PASS'));
test('synthetic capture cannot pass',()=>assert.throws(()=>analyzeRenderedLayout({...capture(),synthetic:true}),/ACTUAL_BROWSER/));
test('critical label overlap fails',()=>{const c=capture();c.labels.push({...c.labels[0],id:'b'});assert.equal(analyzeRenderedLayout(c).HARD_RENDERED_COLLISION,1);});
test('actual line through label fails',()=>{const c=capture();c.geometry.push({id:'line',kind:'line',points:[[0,105],[200,105]],client:{x:0,y:105,width:200,height:0}});assert.equal(analyzeRenderedLayout(c).criticalCollisionCount,1);});
test('clipping and glyph errors fail',()=>{const c=capture();c.labels[0].client.x=1;c.labels[0].missingGlyphCount=1;const r=analyzeRenderedLayout(c);assert.equal(r.CLIPPING,1);assert.equal(r.missingGlyphCount,1);});
test('own condition box must contain rendered multiline text',()=>{const c=capture();c.geometry.push({id:'a-box',kind:'conditionBox',client:{x:100,y:100,width:10,height:10}});assert.equal(analyzeRenderedLayout(c).overflowCount,1);});
test('leader crossing a core line is a hard rendered failure',()=>{const c=capture();c.labels=[];c.geometry=[{id:'lead',kind:'leader',points:[[50,50],[200,200]],client:{x:50,y:50,width:150,height:150}},{id:'core',kind:'line',points:[[50,200],[200,50]],client:{x:50,y:50,width:150,height:150}}];assert.ok(analyzeRenderedLayout(c).errors.some(v=>v.startsWith('LEADER_CROSSING')));});
