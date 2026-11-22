// Chrome- and python-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1, 2nd engine round: N08 value labels that collide on one line move to a lane (over the dot / a second line under, slid sideways and joined to their own dot by a leader),
// N04b plain ids for points whose name is not drawn and a row of one point, N04a longer row labels. The independent observer re-reads every lane from the final SVG.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,figureLayout} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:21.4,displayScale:1,fontFloorCssPx:11};
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`lanes-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const clone=value=>JSON.parse(JSON.stringify(value));
const open=value=>({value,state:'OPEN'});
const hidden=(list,extra={})=>({kind:'POINTS',points:list.map(([id,value])=>({id,value,hideName:true})),...extra});

// 16 연향중 1학기 중간 q6: seven numbers on a line, three of them within a few px of each other
const seven=['-3','-2/3','-1/3','-1/4','0','2','7/2'];
const crowdedPoints={rows:[hidden(seven.map((value,i)=>['ABCDEFG'[i],value]))]};
// an end of a set 1/100 apart from the other
const closeEnds={rows:[{kind:'SET',pieces:[{lo:open('3'),hi:open('3.01')}]}]};
const leadersOf=svg=>[...svg.matchAll(/<line id="([^"]+)" data-role="label-leader"[^>]*? data-of="([^"]+)" data-label="([^"]+)"[^>]*? x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map(m=>({id:m[1],of:m[2],label:m[3],x1:+m[4],y1:+m[5],x2:+m[6],y2:+m[7]}));

test('a row whose labels do not collide keeps its layout and has no lanes or leaders',async()=>{
  const roomy={rows:[hidden([['A','-3'],['B','0'],['C','2']])]};
  assert.ok(figureLayout(solveNumberLineFigure(roomy)).rows.every(row=>!row.lanes));
  const composed=await compose(roomy,'roomy');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!composed.svg.includes('label-leader'));
});

test('crowded value labels move over the dot or to a second line with a leader; the observer re-reads every lane',async()=>{
  const model=solveNumberLineFigure(crowdedPoints),layout=figureLayout(model);
  assert.ok(layout.rows[0].lanes?.above&&layout.rows[0].lanes?.below2,'names are hidden, so the row keeps both lanes');
  const composed=await compose(crowdedPoints,'crowded');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const leaders=leadersOf(composed.svg);
  assert.ok(leaders.length>=1,'at least one label stands apart from its dot and is joined to it');
  for(const leader of leaders){
    const dot=composed.svg.match(new RegExp(`<circle id="${leader.of}"[^>]*? cx="([\\d.]+)" cy="([\\d.]+)"`));
    assert.ok(dot&&Math.abs(+dot[1]-leader.x1)<0.01,'a leader starts at the middle of its own dot');
  }
  const pass=await audit(composed.svg,crowdedPoints);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // a set whose two ends are close
  const ends=await compose(closeEnds,'ends');
  assert.equal(ends.status,'COMPOSED',JSON.stringify(ends.detail));
  assert.ok(leadersOf(ends.svg).length>=1);
  const endsPass=await audit(ends.svg,closeEnds);assert.equal(endsPass.status,'PASS',JSON.stringify(endsPass.errors));
});

test('tamper: a missing, moved, stray or crossing leader and a label off its lane make the observer fail',async()=>{
  const {svg}=await compose(crowdedPoints,'crowded-t');
  const [leader]=leadersOf(svg),line=new RegExp(`<g data-layer="35"><line id="${leader.id}"[^>]*/></g>`);
  assert.ok(line.test(svg));
  assert.ok(has(await audit(svg.replace(line,''),crowdedPoints),'NL_LABEL_LANE_LEADER'),'a label away from its dot with no leader');
  assert.ok(has(await audit(svg.replace(new RegExp(`(id="${leader.id}"[^>]*? x1=")[\\d.]+`),(m,head)=>head+(leader.x1+3)),crowdedPoints),'NL_LABEL_LANE_LEADER'),'a leader that does not start at its dot');
  assert.ok(has(await audit(svg.replace(new RegExp(`(id="${leader.id}"[^>]*? y2=")[\\d.]+`),(m,head)=>head+(leader.y2-12)),crowdedPoints),'NL_LABEL_LANE_LEADER'),'a leader that stops short of its label');
  assert.ok(has(await audit(svg.replace(new RegExp(`(id="${leader.id}"[^>]*? data-of=")[^"]+`),(m,head)=>head+'r1-pt-A'),crowdedPoints),'NL_LABEL_LANE_LEADER'),'a leader that names another dot');
  // a leader drawn for a label that stands on the first line
  const stray=`<g data-layer="35"><line id="r1-pt-A-value-leader" data-role="label-leader" data-row="1" data-of="r1-pt-A" data-label="r1-pt-A-value" stroke="#111" stroke-width="1" fill="none" x1="${leader.x1}" y1="${leader.y1}" x2="${leader.x2}" y2="${leader.y2}"/></g>`;
  assert.ok(has(await audit(svg.replace(line,m=>m+stray),crowdedPoints),'NL_LEADER_UNEXPECTED'));
  // a leader swung across the label of another point
  const across=svg.replace(new RegExp(`(id="${leader.id}"[^>]*? x2=")[\\d.]+`),(m,head)=>head+(leader.x2-60));
  assert.ok((await audit(across,crowdedPoints)).errors.some(error=>/^NL_LEADER_CROSSES_(LABEL|DOT)|^NL_LABEL_LANE_LEADER/.test(error)));
  // a plan that draws a name the figure does not have
  const named=clone(crowdedPoints);named.rows[0].points[1].hideName=false;
  assert.ok((await audit(svg,named)).errors.length>0);
});

test('a crowd the lanes cannot hold is still refused, never squeezed',async()=>{
  // a row with a span keeps one line: its labels cannot move, so two values 1/10 apart collide as before
  const stuck={rows:[{kind:'POINTS',points:[{id:'A',value:'1',hideName:true},{id:'B',value:'11/10',hideName:true},{id:'C',value:'3',hideName:true}],spans:[{from:'A',to:'C'}]}]};
  const composed=await compose(stuck,'stuck');
  assert.equal(composed.status,'NUMBER_LINE_LABELS_TOO_CLOSE',JSON.stringify(composed.detail));
});

test('N04b: a point whose name is not drawn may have a plain id; a row may hold one point (no band)',async()=>{
  const eight={rows:[hidden([...Array(8).keys()].map(i=>['P'+i,String(i+1)]))]};
  assert.doesNotThrow(()=>solveNumberLineFigure(eight));
  const composed=await compose(eight,'p8');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal((await audit(composed.svg,eight)).status,'PASS');
  // the id is only a handle: a drawn name still needs a capital letter, a plain id must not be a drawn one
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'P0',value:'1'},{id:'P1',value:'2'}]}]}),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[hidden([['P0','1'],['p-1','2']])]}),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[hidden([['P0','1'],['P0','2']])]}),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[hidden([['ABCDEFG','1'],['B','2']])]}),code('NUMBER_LINE_POINTS_INVALID'));
  const one={rows:[hidden([['P0','1']])]};
  const single=await compose(one,'one');
  assert.equal(single.status,'COMPOSED',JSON.stringify(single.detail));
  assert.ok(!single.svg.includes('data-role="solution-band"'));
  assert.equal((await audit(single.svg,one)).status,'PASS');
  // an observer reading a plan that draws a name on a plain id refuses
  const drawnName=clone(eight);delete drawnName.rows[0].points[0].hideName;
  assert.ok(has(await audit(composed.svg,drawnName),'NL_POINT_ID_NEEDS_HIDDEN_NAME'));
});

test('N04a: a longer row label reserves the room it needs (measured when placed) and a label that cannot fit is refused',async()=>{
  const labelled=label=>({rows:[{kind:'SET',label,pieces:[{lo:{value:'-2',state:'CLOSED'},hi:open('5')}]}]});
  const composed=await compose(labelled('−2≤x<5'),'row-label');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal((await audit(composed.svg,labelled('−2≤x<5'))).status,'PASS');
  const six=await compose(labelled('가나다라마바'),'six'),bare=await compose({rows:[labelled('x').rows[0]]},'one-char');
  assert.equal(six.status,'COMPOSED');assert.equal(bare.status,'COMPOSED');
  const mapLeft=text=>Number(/data-px-left="([\d.]+)"/.exec(text)[1]);
  assert.equal(mapLeft(six.svg),32+14+Math.max(0,12+6*22+10-32),'a label of up to six characters keeps the 22 px per character it always had');
  assert.throws(()=>solveNumberLineFigure(labelled('f(1)=a, f(3)=a-7이 4를 사이에 두는 a의 범위')),code('NUMBER_LINE_ROW_LABEL_INVALID'));
});
