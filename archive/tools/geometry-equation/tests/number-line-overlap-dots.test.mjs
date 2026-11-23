// Chrome- and python-using (composes number-line panels): run with --test-concurrency=1.
// Two point dots of one row whose circles overlap (the values -1/3 and -1/4 of 16 연향중 1학기 중간 q6, 3 px apart): each value is joined to its own dot by a leader, the left dot's value stands wholly left of
// it, the right dot's wholly right of it, and no leader is flatter than 30 degrees. The independent observer re-reads all three; the figure that 6a604889bc drew (the value of -1/3 over both dots with no leader, the
// 3 of its denominator over the dot of -1/4) is refused by it. B2: the comma that separates the pieces of a set is read with the whitespace after it (a regex written ",s*$" lost its backslash once).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const identity=tag=>assetIdentity(`overlap-dots-${tag}|1`,'SOLUTION_VISUAL','decisive-relation');
const policy={baseFontPx:21.4,displayScale:1,fontFloorCssPx:11};
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const figure=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:identity(tag),typographyPolicy:policy});
const open=value=>({value,state:'OPEN'});
const hidden=list=>({variable:'x',rows:[{kind:'POINTS',points:list.map(([id,value])=>({id,value,hideName:true}))}]});
// 16 연향중 1학기 중간 q6: seven numbers on a line, -1/3 and -1/4 (C and D) 3 px apart
const q6=hidden([['A','-3'],['B','-2/3'],['C','-1/3'],['D','-1/4'],['E','0'],['F','2'],['G','7/2']]);
const drawnBy6a60=fs.readFileSync(new URL('./fixtures/number-line-q6-6a604889bc.svg',import.meta.url),'utf8');
const labelsOf=svg=>[...svg.matchAll(/<g id="([^"]+)" [^>]*?data-label-role="([^"]+)"[^>]*? transform="translate\(([-\d.e]+) ([-\d.e]+)\)"[^>]*><svg [^>]*? width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({id:m[1],role:m[2],x:+m[3],y:+m[4],width:+m[5],height:+m[6]}));
const dotX=(svg,id)=>+new RegExp(`<circle id="${id}"[^>]*? cx="([\\d.]+)"`).exec(svg)[1];
const leaderOf=(svg,label)=>{const m=new RegExp(`<line id="${label}-leader" data-role="label-leader"[^>]*? x1="([\\d.]+)" y1="([\\d.]+)" x2="([\\d.]+)" y2="([\\d.]+)"`).exec(svg);return m&&{x1:+m[1],y1:+m[2],x2:+m[3],y2:+m[4]};};
const angle=leader=>Math.atan2(Math.abs(leader.y2-leader.y1),Math.abs(leader.x2-leader.x1))*180/Math.PI;
const moveLabel=(svg,id,dx)=>svg.replace(new RegExp(`(<g id="${id}" [^>]*? transform="translate\\()([-\\d.e]+)( )`),(m,head,x,space)=>head+(+x+dx)+space);

test('overlapped dots: -1/3 stands wholly left of its dot and -1/4 wholly right of its, each with a leader from its own dot, none flatter than 30 degrees',async()=>{
  const composed=await figure(q6,'q6');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const svg=composed.svg,labels=labelsOf(svg),box=id=>labels.find(label=>label.id===id);
  const c=box('r1-pt-C-value'),d=box('r1-pt-D-value'),cx=dotX(svg,'r1-pt-C'),dx=dotX(svg,'r1-pt-D');
  assert.ok(Math.abs(dx-cx)<10,'the two circles (radius 5) overlap');
  assert.ok(c.x+c.width<=cx+4,'the value of the left dot stands left of it');
  assert.ok(d.x>=dx-4,'the value of the right dot stands right of it');
  assert.ok(c.x+c.width/2<d.x+d.width/2,'the values keep the order of the dots');
  for(const id of ['r1-pt-C-value','r1-pt-D-value']){
    const leader=leaderOf(svg,id);assert.ok(leader,`${id} has a leader`);
    assert.ok(angle(leader)>=30,`${id}: leader at ${angle(leader)} degrees`);
    assert.ok(Math.abs(leader.x1-(id.includes('-C-')?cx:dx))<0.01,'it leaves its own dot');
  }
  // the owners from the left: -3 -2/3 -1/3 -1/4 0 2 7/2, each label of the other points stands at its own dot
  const order=['A','B','C','D','E','F','G'].map(id=>box(`r1-pt-${id}-value`));
  for(const label of order)assert.ok(label,'every value is drawn');
  const pass=await audit(svg,q6);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // corrupted: no leader for -1/3, a value stood on the wrong side of its dot, a leader flatter than 30 degrees, the values swapped in order
  const withoutLeader=svg.replace(new RegExp('<g data-layer="35"><line id="r1-pt-C-value-leader"[^>]*/></g>'),'');
  assert.notEqual(withoutLeader,svg);
  assert.ok(has(await audit(withoutLeader,q6),'NL_OVERLAP_DOTS_NO_LEADER:r1-pt-C-value'));
  assert.ok(has(await audit(moveLabel(svg,'r1-pt-D-value',-(d.x-cx)-d.width),q6),'NL_OVERLAP_DOTS_NOT_OUTWARD:r1-pt-D-value'));
  assert.ok(has(await audit(moveLabel(svg,'r1-pt-C-value',(dx-c.x)+5),q6),'NL_OVERLAP_DOTS_NOT_OUTWARD:r1-pt-C-value'));
  const leader=leaderOf(svg,'r1-pt-D-value');
  const flat=svg.replace(new RegExp(`(id="r1-pt-D-value-leader"[^>]*? y2=")[\\d.]+`),(m,head)=>head+(leader.y1+2));
  assert.notEqual(flat,svg);
  assert.ok(has(await audit(flat,q6),'NL_LEADER_TOO_SHALLOW:r1-pt-D-value-leader'));
  // a stub of 3 px joins nothing
  const stub=svg.replace(new RegExp(`(id="r1-pt-D-value-leader"[^>]*? x2=")[\\d.]+`),(m,head)=>head+leader.x1).replace(new RegExp(`(id="r1-pt-D-value-leader"[^>]*? y2=")[\\d.]+`),(m,head)=>head+(leader.y1+3));
  assert.notEqual(stub,svg);
  assert.ok(has(await audit(stub,q6),'NL_LEADER_TOO_SHORT:r1-pt-D-value-leader'));
  // and the leaders of the figure are at least 8 px long
  for(const id of ['r1-pt-C-value','r1-pt-D-value']){const l=leaderOf(svg,id);assert.ok(Math.hypot(l.x2-l.x1,l.y2-l.y1)>=8);}
});

test('the figure 6a604889bc drew for q6 is refused: -1/3 over both dots with no leader, the denominator of -1/3 over the dot of -1/4',async()=>{
  const result=await audit(drawnBy6a60,q6);
  assert.equal(result.status,'FAIL');
  assert.ok(has(result,'NL_OVERLAP_DOTS_NO_LEADER:r1-pt-C-value'),JSON.stringify(result.errors));
  assert.ok(has(result,'NL_OVERLAP_DOTS_NOT_OUTWARD:r1-pt-C-value')&&has(result,'NL_OVERLAP_DOTS_NOT_OUTWARD:r1-pt-D-value'),JSON.stringify(result.errors));
});

test('dots that do not overlap keep their labels under them with no leader (nothing of the rule applies)',async()=>{
  const roomy=hidden([['A','-3'],['B','0'],['C','2']]);
  const composed=await figure(roomy,'roomy');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!composed.svg.includes('label-leader'));
  const pass=await audit(composed.svg,roomy);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
});

test('B2: the comma that ends an earlier piece label is read with the whitespace after it; a tex that ends in ",s" is not a comma',async()=>{
  const pieces={variable:'x',rows:[{kind:'SET',pieces:[{lo:open('-5'),hi:open('-1')},{lo:open('0'),hi:open('4')}]}]};
  const composed=await figure(pieces,'pieces');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const [a,b]=labelsOf(composed.svg).filter(label=>label.role==='set').sort((x,y)=>x.x-y.x);
  const texOf=id=>new RegExp(`id="${id}" [^>]*? data-tex="([^"]*)"`).exec(composed.svg)[1];
  // the later piece slid close to the earlier one (so the earlier one must end with a comma); the comma may be followed by spaces
  const near=moveLabel(composed.svg,b.id,-(b.x-(a.x+a.width)-28));
  const nearWith=tex=>near.replace(new RegExp(`(<g id="${a.id}" [^>]*? data-tex=")[^"]*`),(m,head)=>head+tex);
  for(const tail of [',',', ',',  ',', '+String.fromCharCode(9)]){
    const result=await audit(nearWith(texOf(a.id)+tail),pieces);
    assert.equal(result.status,'PASS',`a comma followed by ${JSON.stringify(tail.slice(1))}: ${JSON.stringify(result.errors)}`);
  }
  // not a comma: the tex ends in ",s" (what the lost-backslash regex ",s*$" would have removed) or in a letter; such a label is unreadable or not separated
  for(const tail of [',s',',x','s']){
    const result=await audit(nearWith(texOf(a.id)+tail),pieces);
    assert.equal(result.status,'FAIL',`tex ending in ${JSON.stringify(tail)} is refused`);
  }
});
