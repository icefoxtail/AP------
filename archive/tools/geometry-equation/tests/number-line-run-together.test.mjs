// Chrome- and python-using (composes number-line panels): run with --test-concurrency=1.
// Labels that run together on one line ("−3" "−2" read as "−3−2", "−2<x<−2" "−2<x<9" as a subtraction): the producer keeps them apart (integer labels fall back to the two ends, the labels of neighbouring
// pieces of a set stand apart with a comma) and the independent observer (its own constants) refuses what it reads back too close. Every rule has a plan that passes and a corrupted one that is refused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel,solveQuadraticInequality} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,separatePieces,rowLabelIsMath,rowLabelTex} from '../production/number-line-v1.mjs';
import {lineGap,runTogether,dropMiddleIntegers,RUN_GAP,PIECE_SEPARATED_GAP} from '../production/number-line-run-together.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const identity=tag=>assetIdentity(`run-together-${tag}|1`,'SOLUTION_VISUAL','decisive-relation');
const policy=font=>({baseFontPx:font,displayScale:1,fontFloorCssPx:11});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const open=value=>({value,state:'OPEN'});
const figure=async(numberLine,tag,font=21.4)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:identity(tag),typographyPolicy:policy(font)});
const q11={coefficients:['-15','-2','1'],comparator:'<',variable:'a',adjoinedPoints:['-3'],integerPoints:true};
const chain=async(font,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine:q11},model:solveQuadraticInequality(q11),identity:identity(tag),typographyPolicy:policy(font)});
// every label of a panel: its id, role and box, read from the svg
const labelsOf=svg=>[...svg.matchAll(/<g id="([^"]+)" [^>]*?data-label-role="([^"]+)"[^>]*? transform="translate\(([-\d.e]+) ([-\d.e]+)\)"[^>]*><svg [^>]*? width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({id:m[1],role:m[2],x:+m[3],y:+m[4],width:+m[5],height:+m[6]}));
const moveLabel=(svg,id,dx)=>svg.replace(new RegExp(`(<g id="${id}" [^>]*? transform="translate\\()([-\\d.e]+)( )`),(m,head,x,space)=>head+(+x+dx)+space);
const setTex=(svg,id,tex)=>svg.replace(new RegExp(`(<g id="${id}" [^>]*? data-tex=")[^"]*`),(m,head)=>head+tex);
// two pieces of one set whose bands are wide: their inequalities stand 60 px apart or so
const pieces={variable:'x',rows:[{kind:'SET',pieces:[{lo:open('-5'),hi:open('-1')},{lo:open('0'),hi:open('4')}]}]};

test('integer labels of the quadratic chain keep 5 px between neighbours: they fall back to the two ends at a font that makes them run together',async()=>{
  const roomy=await chain(21.4,'chain-roomy');
  assert.equal(roomy.status,'COMPOSED',JSON.stringify(roomy.detail));
  assert.match(roomy.svg,/data-integer-labels="ALL"/);
  const pass=await audit(roomy.svg,q11);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // a larger font: the same figure, the labels in between are left out (ENDS), and the observer reads that back
  const big=await chain(31,'chain-big');
  assert.equal(big.status,'COMPOSED',JSON.stringify(big.detail));
  assert.match(big.svg,/data-integer-labels="ENDS"/);
  assert.equal(labelsOf(big.svg).filter(label=>label.role==='integer').length,2);
  const bigPass=await audit(big.svg,q11);assert.equal(bigPass.status,'PASS',JSON.stringify(bigPass.errors));
  // corrupted: the same labels of the roomy figure pushed against each other, and an ENDS figure that still carries all the labels
  const [first,second]=labelsOf(roomy.svg).filter(label=>label.role==='integer');
  const close=moveLabel(roomy.svg,second.id,-(second.x-(first.x+first.width))+3);
  assert.ok(has(await audit(close,q11),'NL_LABELS_RUN_TOGETHER'));
  assert.ok(has(await audit(roomy.svg.replace('data-integer-labels="ALL"','data-integer-labels="ENDS"'),q11),'NL_LABEL_COUNT'));
});

test('a number-line figure: integer labels fall back to the ends too, and its crowded value labels never run together',async()=>{
  const crowded={variable:'x',rows:[{kind:'POINTS',points:[['A','-3'],['B','-2/3'],['C','-1/3'],['D','-1/4'],['E','0'],['F','2'],['G','7/2']].map(([id,value])=>({id,value,hideName:true}))}]};
  const composed=await figure(crowded,'crowded');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const boxes=labelsOf(composed.svg);
  for(const a of boxes)for(const b of boxes)if(a.id<b.id){
    const gap=lineGap(a,b);
    assert.ok(gap===null||gap>=5,`${a.id} and ${b.id} stand ${gap} px apart on one line`);
  }
  const pass=await audit(composed.svg,crowded);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // corrupted: the value label of 0 pushed against the label of its left neighbour on the same line
  const values=boxes.filter(label=>label.role==='point-value').sort((a,b)=>a.x-b.x);
  const pair=values.map((label,i)=>[values[i-1],label]).find(([left,right])=>left&&lineGap(left,right)!==null);
  assert.ok(pair,'two value labels stand on one line');
  const [left,right]=pair;
  const tight=moveLabel(composed.svg,right.id,-(right.x-(left.x+left.width))+2);
  assert.ok(has(await audit(tight,crowded),'NL_LABELS_RUN_TOGETHER')||has(await audit(tight,crowded),'NL_LABEL_NOT_CENTRED'));
});

test('the inequalities of neighbouring pieces of a set stand apart; closer than 30 px the earlier one ends with a comma; the observer re-reads both rules',async()=>{
  const composed=await figure(pieces,'pieces');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const pass=await audit(composed.svg,pieces);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  const [a,b]=labelsOf(composed.svg).filter(label=>label.role==='set').sort((x,y)=>x.x-y.x);
  const gap=lineGap(a,b);assert.ok(gap>=PIECE_SEPARATED_GAP-0.01,`the pieces stand ${gap} px apart`);
  // corrupted: the later one slid 40 px towards the earlier one (gap under 30 px, the earlier one has no comma): refused; with the comma it reads as two separated pieces
  const near=moveLabel(composed.svg,b.id,-(gap-28));
  assert.ok(has(await audit(near,pieces),'NL_PIECE_LABELS_NO_SEPARATOR'));
  const withComma=setTex(near,a.id,(composed.svg.match(new RegExp(`id="${a.id}" [^>]*? data-tex="([^"]*)"`))[1])+',');
  const separated=await audit(withComma,pieces);assert.equal(separated.status,'PASS',JSON.stringify(separated.errors));
  // touching ("−5<x<−1" "0<x<4" read as a subtraction), a comma where no piece follows, a label slid far off its band
  assert.ok(has(await audit(moveLabel(composed.svg,b.id,-(gap-8)),pieces),'NL_LABELS_RUN_TOGETHER'));
  const lastComma=setTex(composed.svg,b.id,(composed.svg.match(new RegExp(`id="${b.id}" [^>]*? data-tex="([^"]*)"`))[1])+',');
  assert.ok(has(await audit(lastComma,pieces),'NL_SET_COMMA_UNEXPECTED'));
  assert.ok(has(await audit(moveLabel(composed.svg,a.id,-70),pieces),'NL_LABEL_NOT_CENTRED'));
});

test('separatePieces: a comma and a slide give the pieces room, each stays over its band; no room is refused',async()=>{
  const typeset=({tex})=>({intrinsic:{width:100+(tex.endsWith(',')?8:0),height:20},fragmentSha256:'x'});
  const item=(id,tex,x,bandX,width)=>({label:{id,role:'set',row:1,tex,anchor:{x:bandX,y:30},rowHeight:30,owner:'b'},fragment:{intrinsic:{width,height:20}},box:{x,y:20,width,height:20}});
  const make=(ax,bx)=>{const a=item('a','x<1',ax,ax+50,100),b=item('b','x>2',bx,bx+50,100);return {a,b,placed:[a,b]};};
  const spec={rows:[{n:1}]};
  // 20 px apart: the earlier gets a comma (its box grows), the later slides right to 32 px
  const near=make(60,180);
  separatePieces(spec,near.placed,typeset,21.4,identity('sp'));
  assert.ok(near.a.label.tex.endsWith(','));
  const g=lineGap(near.a.box,near.b.box);assert.ok(g>=PIECE_SEPARATED_GAP-0.01&&g<PIECE_SEPARATED_GAP+0.5,String(g));
  for(const x of [near.a,near.b])assert.ok(x.label.anchor.x>x.box.x&&x.label.anchor.x<x.box.x+x.box.width,'over its own band');
  // far apart: untouched (its bytes stay)
  const far=make(60,300),before=JSON.stringify(far.placed);
  separatePieces(spec,far.placed,typeset,21.4,identity('sp2'));assert.equal(JSON.stringify(far.placed),before);
  // no room: the earlier piece stands at the left margin (it cannot slide left) and its neighbour's band is at its own left edge (it cannot slide right): refused
  const pinned=make(12,132);pinned.a.label.anchor.x=12+96;pinned.b.label.anchor.x=132+4;
  assert.throws(()=>separatePieces(spec,pinned.placed,typeset,21.4,identity('sp3')),error=>/NUMBER_LINE_LABELS_TOO_CLOSE/.test(`${error.message} ${error.status} ${error.code}`));
});

test('the shared helpers: the gap of boxes on one line, run-together pairs and the integer fallback',()=>{
  const box=(x,y=0,width=10,height=10)=>({x,y,width,height});
  assert.equal(lineGap(box(0),box(15)),5);assert.equal(lineGap(box(15),box(0)),5);assert.equal(lineGap(box(0),box(5)),-5);
  assert.equal(lineGap(box(0,0),box(15,20)),null,'not on one line');
  const label=(role,x)=>({label:{role,row:1},box:box(x)});
  assert.equal(runTogether(label('integer',0),label('integer',10+RUN_GAP-1)),true,'a gap under RUN_GAP');
  assert.equal(runTogether(label('integer',0),label('integer',10+RUN_GAP)),false,'a gap of RUN_GAP is room enough');
  assert.equal(runTogether(label('integer',0),label('integer',30)),false);
  assert.equal(runTogether(label('row-label',0),label('integer',12)),false,'a row label is not a number of the axis');
  const placed=[0,12,24,36,100].map(x=>({label:{role:'integer',row:1},box:box(x)}));
  assert.equal(dropMiddleIntegers(placed,1),true);assert.equal(placed.length,2);
  const roomy=[0,40,80].map(x=>({label:{role:'integer',row:1},box:box(x)}));
  assert.equal(dropMiddleIntegers(roomy,1),false);assert.equal(roomy.length,3);
});

test('a row label that states a relation is set in the math face (no upright x, no hyphen-minus); a word stays plain text; the observer reads both back',async()=>{
  assert.deepEqual(['−4≤x≤3','x≤6','x=−2','f(x)≥-3'].map(rowLabelIsMath),[true,true,true,true]);
  assert.deepEqual(['가능','abcdef','x','정수 x≤3','−4','a<b'].map(rowLabelIsMath),[false,false,false,false,false,false],'a word, no relation, a Hangul or a < is not math');
  assert.deepEqual(['−4≤x≤3','x≥-2'].map(rowLabelTex),['-4\\le x\\le 3','x\\ge -2']);
  const labelled=label=>({variable:'x',rows:[{kind:'SET',label,pieces:[{lo:open('-4'),hi:{value:'3',state:'CLOSED'}}]},{kind:'SET',label:'가능',pieces:[{lo:open('-1'),hi:null}]}]});
  const plan=labelled('−4≤x≤3');
  const composed=await figure(plan,'rowlabel');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.match(composed.svg,/id="r1-row-label"[^>]*data-tex="[^"]*le [^"]*"/);
  assert.doesNotMatch(composed.svg,/id="r1-row-label"[^>]*data-text=/);
  assert.match(composed.svg,/id="r2-row-label"[^>]*data-text="가능"/);
  const pass=await audit(composed.svg,plan);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // corrupted: the relation drawn as plain text, the word drawn as math, another relation
  const asText=composed.svg.replace(/(id="r1-row-label"[^>]*?) data-tex="[^"]*"/,'$1 data-text="−4≤x≤3"');
  assert.ok(has(await audit(asText,plan),'NL_ROW_LABEL_TEXT:1'));
  assert.ok(has(await audit(composed.svg.replace(/(id="r2-row-label"[^>]*?) data-text="가능"/,'$1 data-tex="x"'),plan),'NL_ROW_LABEL_TEXT:2'));
  assert.ok(has(await audit(composed.svg,labelled('−4≤x≤4')),'NL_ROW_LABEL_TEXT:1'));
});
