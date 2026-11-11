// Point display names in a composite: unique per panel (a panel is its own plan), and unique per pointNameGroups group inside one panel.
// The pure model tests need no Chrome; the render tests do (golden item151pnamegroups): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pointNameModel} from '../production/point-names.mjs';
import {expectedNameTokens,glyphTokens,labelGroups} from '../production/point-name-observer.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {compositePanelBytes} from '../production/composite-candidate-svg-v1.mjs';

const golden=JSON.parse(fs.readFileSync(new URL('../ops/golden/item151pnamegroups/plan.json',import.meta.url),'utf8'));
const item={sourcePath:'archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js',ordinal:12,dir:'pg'};
const thrown=fn=>{try{fn();}catch(error){return error.message;}return null;};
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'name-groups-'));
const withPanel2=extra=>{const plan=structuredClone(golden);Object.assign(plan.panels[1].plan,extra);return plan;};
const without=key=>{const plan=structuredClone(golden);delete plan.panels[1].plan[key];return plan;};

test('model: the same name twice in one figure is refused, in two groups it is allowed',()=>{
  const ids=['A','O','C','B','O2','D'],names={O2:'O'};
  assert.equal(thrown(()=>pointNameModel({pointNames:names},ids)),'POINT_DISPLAY_NAME_DUPLICATE:O');
  assert.equal(thrown(()=>pointNameModel({pointNames:names,pointNameGroups:[['A','O','C','B','O2'],['D']]},ids)),'POINT_DISPLAY_NAME_DUPLICATE:O');
  const model=pointNameModel({pointNames:names,pointNameGroups:[['A','O','C'],['B','O2','D']]},ids);
  assert.equal(model.text('O2'),'O');assert.equal(model.text('O'),'O');
  // points left out of every group form one more group
  assert.equal(thrown(()=>pointNameModel({pointNames:{O2:'O',D:'C'},pointNameGroups:[['A','O'],['B','O2']]},ids)),'POINT_DISPLAY_NAME_DUPLICATE:C');
  assert.equal(thrown(()=>pointNameModel({pointNames:{O2:'O'},pointNameGroups:[['A','O'],['B','O2']]},ids)),null);
});

test('model: pointNameGroups is checked',()=>{
  const ids=['A','B','O','O2'],names={O2:'O'};
  for(const [groups,code] of [[[['A','O'],['B','O']],'O'],[[['A','Q'],['B']],'Q'],[[['A'],['B'],['A']],'A'],[[['A','O','B','O2']],'pointNameGroups'],[[],'pointNameGroups'],[[['A'],[]],'pointNameGroups'],['A','pointNameGroups']])
    assert.equal(thrown(()=>pointNameModel({pointNames:names,pointNameGroups:groups},ids)),'POINT_NAME_GROUPS_INVALID:'+code,JSON.stringify(groups));
  assert.equal(thrown(()=>pointNameModel({pointNameGroups:[['A'],['B']]},ids)),'POINT_NAME_GROUPS_INVALID:pointNames');
});

test('composite: panels reuse the same letters and the second panel shows O twice (one per triangle)',async()=>{
  const out=tmp(),r=await renderPlan({item,plan:golden,outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  const panels=compositePanelBytes(fs.readFileSync(path.join(out,'pg-solution.svg'),'utf8')).map(panel=>panel.bytes.toString('utf8'));
  const shown=(svg,letter)=>labelGroups(svg).filter(g=>g.kind==='POINT_NAME'&&JSON.stringify(glyphTokens(g.markup))===JSON.stringify(expectedNameTokens(letter))).length;
  assert.equal(panels.length,2);
  // the original panel and the triangle panel both show A, B, C, D, O; the triangle panel shows O twice (one per triangle) and every other letter once
  for(const letter of ['A','B','C','D'])assert.deepEqual(panels.map(svg=>shown(svg,letter)),[1,1],letter);
  assert.deepEqual(panels.map(svg=>shown(svg,'O')),[1,2]);
});

test('composite: the same name twice in one panel is still refused without groups, and within a group',async()=>{
  for(const [plan,why] of [[without('pointNameGroups'),'no groups'],[withPanel2({pointNameGroups:[['A','O','C','B','O2'],['D']]}),'one group'],[withPanel2({pointNames:{O2:'B'}}),'another clash inside a group']]){
    const r=await renderPlan({item:{...item,dir:'pb'},plan,outDir:tmp()});
    assert.equal(r.status,'FAILED',why);
    assert.ok(String(r.detail).includes('POINT_DISPLAY_NAME_DUPLICATE'),why+': '+r.detail);
  }
});
