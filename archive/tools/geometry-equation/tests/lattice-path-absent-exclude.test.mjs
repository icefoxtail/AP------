// lattice-path-figure-v1 absent roads (roads that do not exist) and excluded crossings (counted paths may not pass; the written value is 0).
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {PALETTE} from '../production/palette.mjs';
import {solveLattice,composeLatticePathFigure,FIGURE_CAPABILITY} from '../production/lattice-path-v1.mjs';

const observer=fileURLToPath(new URL('../production/lattice-path-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(lattice,expected)=>assert.throws(()=>solveLattice(lattice),code(expected),expected);
const plan=lattice=>({capability:FIGURE_CAPABILITY,lattice,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'lattice'}],newVisualInformation:['n']});
const grid=(cols,rows,extra={})=>({grid:{cols,rows},...extra,points:{A:[0,0],B:[cols,rows],...(extra.points??{})}});
const countAt=(model,x,y)=>model.counts.find(c=>c[0]===x&&c[1]===y)?.[2];
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 22 효천고 확률과통계 q13: a 4x4 network with six roads that do not exist (top left and bottom right) and the crossing P that may not be used
const ABSENT13=[[[3,0],[4,0]],[[0,4],[1,4]],[[1,4],[2,4]],[[0,3],[0,4]],[[1,3],[1,4]],[[4,0],[4,1]]];
const q13=grid(4,4,{points:{P:[2,2]},absent:ABSENT13,exclude:['P'],counts:true});
const without=(lattice,...keys)=>{const copy={...lattice};for(const k of keys)delete copy[k];return copy;};
const MATHBF0='\\mathbf{0}';

test('absent roads and an excluded crossing: the q13 network counts 28 paths and writes 0 at P',()=>{
  const m=solveLattice(q13);
  assert.equal(m.total,28);
  // the numbers of the solution: bottom row 1,1,1,1 / 1,2,3,4,4 / 1,3,P,4,8 / 1,4,4,8,16 / top row 4,12 and B
  const rows=[[1,1,1,1],[1,2,3,4,4],[1,3,null,4,8],[1,4,4,8,16],[undefined,undefined,4,12,28]];
  rows.forEach((row,y)=>row.forEach((c,x)=>{if(c!==null)assert.equal(countAt(m,x,y),c,`(${x},${y})`);}));
  assert.equal(countAt(m,2,2),undefined);                              // nothing is counted at P ...
  assert.deepEqual(m.excluded,[[2,2]]);assert.ok(m.shown.some(c=>c[0]===2&&c[1]===2&&c[2]===0));   // ... but its 0 is written
  assert.ok(!m.shown.some(c=>c[0]===4&&c[1]===4));                     // the answer at B stays hidden
  assert.ok(!m.counts.some(c=>c[0]===4&&c[1]===0));                    // (4,0) has no road: no number
  assert.equal(m.absent.length,6);assert.deepEqual(m.forbidden,[]);   // absent is kept apart from forbidden
  // complement check: 64 paths without the six missing roads, 6 x 6 of them through P
  assert.equal(solveLattice(without(q13,'exclude')).total,64);
  assert.equal(64-6*6,m.total);
  // a counts list that does not name P writes no 0; one that names it writes only that 0
  assert.ok(!solveLattice({...q13,counts:['A',[1,1]]}).shown.some(c=>c[2]===0));
  assert.deepEqual(solveLattice({...q13,counts:['P']}).shown,[[2,2,0]]);
  // a plan without the new fields has the same model as before (no new keys)
  const plain=solveLattice(grid(6,3,{points:{P:[4,1],Q:[4,2]},forbidden:[['P','Q']],counts:true}));
  assert.ok(!('absent' in plain)&&!('excluded' in plain));
  // absent alone only leaves a gap; the excluded crossing can also be named by its coordinates
  assert.equal(solveLattice(grid(2,2,{absent:[[[1,2],[2,2]]]})).absent.length,1);
  assert.deepEqual(solveLattice({...q13,exclude:[[2,2]]}).excluded,[[2,2]]);
});

test('absent roads and excluded crossings the engine cannot draw faithfully are refused with explicit codes',()=>{
  refuse(grid(3,3,{absent:'x'}),'LATTICE_ABSENT_INVALID');
  refuse(grid(3,3,{absent:[['A','Z']]}),'LATTICE_ABSENT_INVALID');
  refuse(grid(3,3,{absent:[['A','B']]}),'LATTICE_ABSENT_INVALID');                // not neighbouring crossings
  refuse(grid(6,6,{absent:Array.from({length:13},(_,i)=>[[i%6,Math.floor(i/6)+3],[i%6+1,Math.floor(i/6)+3]])}),'LATTICE_ABSENT_INVALID');   // more than 12
  refuse(grid(3,3,{absent:[[[2,2],[3,2]],[[3,2],[2,2]]]}),'LATTICE_ABSENT_DUPLICATE');
  refuse(grid(3,3,{absent:[[[2,2],[3,2]]],forbidden:[[[2,2],[3,2]]]}),'LATTICE_ABSENT_CONFLICT');
  refuse(grid(3,3,{absent:[[[2,2],[3,2]]],via:[[[3,2],[2,2]]],counts:true}),'LATTICE_ABSENT_CONFLICT');
  refuse(grid(3,3,{absent:[[[0,0],[1,0]]],highlightPath:['A',[1,0]]}),'LATTICE_ABSENT_CONFLICT');
  refuse(grid(3,3,{absent:[[[0,0],[1,0]],[[0,0],[0,1]]],counts:true}),'LATTICE_ABSENT_ENDPOINT_ISOLATED');
  refuse(grid(3,3,{absent:[[[3,3],[2,3]],[[3,3],[3,2]]],counts:true}),'LATTICE_ABSENT_ENDPOINT_ISOLATED');
  refuse(grid(3,3,{absent:[[[3,0],[2,0]],[[3,0],[3,1]]],points:{C:[3,0]}}),'LATTICE_ABSENT_POINT_ISOLATED');   // a named point no road reaches
  refuse(grid(2,2,{absent:[[[1,0],[2,0]],[[2,0],[2,1]],[[1,1],[2,1]],[[2,1],[2,2]],[[1,2],[2,2]]]}),'LATTICE_ABSENT_EMPTY_LINE');   // no road reaches the column x=2
  refuse(grid(2,1,{absent:[[[0,0],[0,1]],[[1,0],[1,1]],[[2,0],[2,1]]],counts:true}),'LATTICE_NO_PATH');             // no road goes up: nothing joins A to B
  refuse(grid(3,3,{exclude:'P'}),'LATTICE_EXCLUDE_INVALID');
  refuse(grid(3,3,{exclude:[],counts:true}),'LATTICE_EXCLUDE_INVALID');
  refuse(grid(3,3,{exclude:['Z'],counts:true}),'LATTICE_EXCLUDE_INVALID');
  refuse(grid(3,3,{exclude:[[1,1],[1,2],[2,1],[2,2]],counts:true}),'LATTICE_EXCLUDE_INVALID');                    // more than 3
  refuse(grid(3,3,{exclude:[[1,1]]}),'LATTICE_EXCLUDE_INVALID');                                                  // the numbers must be asked for
  refuse({grid:{cols:5,rows:5},points:{A:[0,0],B:[2,2]},exclude:[[4,4]],counts:true},'LATTICE_EXCLUDE_INVALID');   // outside the start-target rectangle
  refuse(grid(3,3,{absent:[[[1,1],[2,1]],[[1,1],[0,1]],[[1,1],[1,2]],[[1,1],[1,0]]],exclude:[[1,1]],counts:true}),'LATTICE_EXCLUDE_INVALID');   // no road reaches it: its 0 would float
  refuse(grid(3,3,{exclude:[[1,1],[1,1]],counts:true}),'LATTICE_EXCLUDE_DUPLICATE');
  refuse(grid(3,3,{exclude:['A'],counts:true}),'LATTICE_EXCLUDE_ENDPOINT');
  refuse(grid(3,3,{exclude:['B'],counts:true}),'LATTICE_EXCLUDE_ENDPOINT');
  refuse(grid(3,3,{exclude:[[1,1]],via:[[[1,1],[2,1]]],counts:true}),'LATTICE_EXCLUDE_VIA_CONFLICT');
  refuse(grid(3,3,{exclude:[[1,1]],counts:true,highlightPath:['A',[1,0],[1,1]]}),'LATTICE_EXCLUDE_PATH_CONFLICT');
  refuse(grid(1,1,{exclude:[[1,0],[0,1]],counts:true}),'LATTICE_NO_PATH');                                         // no path is left
});

test('the written 0 of an excluded crossing has the C1 WARM line colour and the observer keeps the same value',()=>{
  const py=fs.readFileSync(fileURLToPath(new URL('../production/lattice_path_observer.py',import.meta.url)),'utf8');
  assert.ok(py.includes(`EXCLUDED_COLOR = '${PALETTE.WARM.line}'`));
});

test('the q13 figure composes with six roads missing and a bold 0 at P; the observer re-walks the paths without P and catches every tamper',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(lattice,n)=>{
      const composed=await composeLatticePathFigure({plan:plan(lattice),model:solveLattice(lattice),identity:assetIdentity('22_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(lattice,svg)=>(await pythonWorker({lattice,svg},{script:observer})).result;
    const edit=(svg,re,fn)=>{const m=re.exec(svg);assert.ok(m,String(re));return svg.replace(m[0],fn(m[0]));};
    const svg=await compose(q13,10);
    const pass=await audit(q13,svg);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
    // the six absent roads are not drawn, every other road is (4*5 + 5*4 - 6 = 34), and nothing stands at the isolated crossing (4,0)
    assert.equal((svg.match(/<line /g)??[]).length,34);
    for(const e of ABSENT13)assert.ok(!svg.includes(`id="road-${[...e[0],...e[1]].join('-')}"`)&&!svg.includes(`id="road-${[...e[1],...e[0]].join('-')}"`));
    assert.ok(!/id="count-4-0"/.test(svg)&&!/id="count-4-4"/.test(svg));
    // the 0 at P is its own label kind in the WARM colour, in the bold face
    const zero=/<g id="count-2-2"[^>]*>/.exec(svg)[0];
    assert.ok(zero.includes('data-label-role="count-excluded"')&&zero.includes(`color="${PALETTE.WARM.line}"`)&&zero.includes('data-count="0"')&&zero.includes(`data-tex="${MATHBF0}"`));
    // the full lattice is caught by the plan that says six roads do not exist
    const full=await compose(without(q13,'absent','exclude'),11);
    assert.ok(has(await audit(q13,full),'LP_ABSENT_ROAD_DRAWN'));
    // a road missing that the plan says exists, and an absent road found drawn
    assert.ok(has(await audit({...q13,absent:ABSENT13.slice(1)},svg),'LP_ROAD_MISSING'));
    assert.ok(has(await audit({...q13,absent:[...ABSENT13,[[1,1],[2,1]]]},svg),'LP_ABSENT_ROAD_DRAWN'));
    // a number changed; the 0 changed, uncoloured, turned into an ordinary count or moved to another crossing
    assert.ok(has(await audit(q13,edit(svg,/<g id="count-3-2"[^>]*>/,tag=>tag.replace('data-tex="4"','data-tex="5"').replace('data-count="4"','data-count="5"'))),'LP_COUNT_MISMATCH:3,2'));
    assert.ok(has(await audit(q13,edit(svg,/<g id="count-2-2"[^>]*>/,tag=>tag.replace(`data-tex="${MATHBF0}"`,'data-tex="6"'))),'LP_EXCLUDED_NOT_ZERO:2,2'));
    assert.ok(has(await audit(q13,edit(svg,/<g id="count-2-2"[^>]*>/,tag=>tag.replace(` color="${PALETTE.WARM.line}"`,''))),'LP_EXCLUDED_NOT_EMPHASISED:2,2'));
    assert.ok(has(await audit(q13,edit(svg,/<g id="count-2-2"[^>]*>/,tag=>tag.replace('data-label-role="count-excluded"','data-label-role="count"').replace(`data-tex="${MATHBF0}"`,'data-tex="0"'))),'LP_COUNT_'));
    assert.ok(has(await audit(q13,edit(svg,/<g id="count-2-2"[^>]*>/,tag=>tag.replace('data-node="2,2"','data-node="1,1"'))),'LP_EXCLUDED_'));
    // the plan without exclude: the figure's 0 is unexpected and the values that counted P out no longer match
    const withoutExclude=await audit(without(q13,'exclude'),svg);
    assert.ok(has(withoutExclude,'LP_EXCLUDED_UNEXPECTED:2,2')&&has(withoutExclude,'LP_COUNT_'));
    assert.ok(has(await audit({...q13,counts:['A']},svg),'LP_EXCLUDED_UNEXPECTED:2,2'));
    // a figure drawn without the 0 fails against the plan that asks for it
    assert.ok(has(await audit(q13,await compose({...q13,counts:['A',[1,1]]},12)),'LP_EXCLUDED_MISSING:2,2'));
  }finally{await browser.close();}
});
