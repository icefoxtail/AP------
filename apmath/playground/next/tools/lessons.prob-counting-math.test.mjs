// Independent exhaustive enumeration of the 19 actual source problem types.
// No production factorial/combination/permutation/surjection/counting helper is used.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/prob-counting-lesson-runtime.mjs';

const lab=await load(),source=lab.api;
const range=n=>Array.from({length:n},(_,i)=>i);
const values=n=>range(n).map(i=>i+1);
const plain=x=>JSON.parse(JSON.stringify(x));
const expected={
 combo:{low:21,cap:29,coef:13,color:100},
 func:{mono:35,atleast:369,range:180,comp:575},
 perm:{ends:60,adj:60,via:16,viaAvoid:10},
 gap:{ppl:1440,ident:35,seats:210},
 circ:{plain:120,adj:12,sep:144,pick:90}
};
assert.deepEqual(Object.keys(expected).sort(),Array.from(lab.list,sc=>sc.id).sort());
for(const [id,types] of Object.entries(expected))assert.deepEqual(Object.keys(types).sort(),plain(source.types(id)).sort());

function words(alphabet,length,visit,prefix=[]){
 if(prefix.length===length){visit(prefix);return;}
 for(const value of alphabet)words(alphabet,length,visit,[...prefix,value]);
}
function arrangements(items,length,visit,prefix=[]){
 if(prefix.length===length){visit(prefix);return;}
 for(let i=0;i<items.length;i++)arrangements([...items.slice(0,i),...items.slice(i+1)],length,visit,[...prefix,items[i]]);
}
function multiset(counts,visit,prefix=[]){
 if(counts.every(n=>n===0)){visit(prefix);return;}
 for(let i=0;i<counts.length;i++)if(counts[i]){
  const next=counts.slice();next[i]--;multiset(next,visit,[...prefix,i]);
 }
}
function allocations(total,boxes,min=0){
 const result=[];
 const visit=(left,k,prefix)=>{
  if(k===1){if(left>=min)result.push([...prefix,left]);return;}
  for(let x=min;x<=left-(k-1)*min;x++)visit(left-x,k-1,[...prefix,x]);
 };
 visit(total,boxes,[]);return result;
}
function paths(start,end){
 const out=[];
 const walk=(x,y,points)=>{
  if(x===end.i&&y===end.j){out.push(points);return;}
  if(x<end.i)walk(x+1,y,[...points,[x+1,y]]);
  if(y<end.j)walk(x,y+1,[...points,[x,y+1]]);
 };
 walk(start.i,start.j,[[start.i,start.j]]);return out;
}
const visits=(path,p)=>path.some(([x,y])=>x===p.i&&y===p.j);
function circleKey(row){
 const first=row.indexOf(Math.min(...row));
 return [...row.slice(first),...row.slice(0,first)].join(',');
}
function circles(items,seats,predicate=()=>true){
 const classes=new Map();
 arrangements(items,seats,row=>{
  if(!predicate(row))return;
  const key=circleKey(row);classes.set(key,(classes.get(key)||0)+1);
 });
 for(const multiplicity of classes.values())assert.equal(multiplicity,seats,'only the rotations are identified');
 return classes;
}
function answer(id,kind,count){
 assert.equal(count,source.packet(id,kind).ans,'enumerated count equals the actual original answer');
 assert.equal(count,expected[id][kind],'verified representative packet');
}

test('combo/low: enumerate all allocations with the original minimum for each named student',()=>{
 const q=source.packet('combo','low'),all=allocations(q.N,q.K,q.m);
 answer('combo','low',all.length);
 const reduced=all.map(row=>row.map(x=>x-q.m));
 assert.ok(reduced.every(row=>row.every(x=>x>=0)&&row.reduce((a,b)=>a+b,0)===q.n2));
 assert.deepEqual(reduced,allocations(q.n2,q.K,0),'subtracting the mandatory shares is a bijection');
});

test('combo/cap: directly filter both capacities and enumerate the disjoint violation sets',()=>{
 const q=source.packet('combo','cap'),all=allocations(q.n,3);
 const badA=all.filter(([a])=>a>q.a),badB=all.filter(([,b])=>b>q.b);
 const valid=all.filter(([a,b])=>a<=q.a&&b<=q.b);
 assert.equal(all.length,q.tot);assert.equal(badA.length,q.t1);assert.equal(badB.length,q.t2);
 assert.equal(all.filter(([a,b])=>a>q.a&&b>q.b).length,0);
 answer('combo','cap',valid.length);
});

test('combo/coef: enumerate positive quadruples satisfying x+y+z+t w=N',()=>{
 const q=source.packet('combo','coef'),rows=new Map();let total=0;
 for(let x=1;x<=q.N;x++)for(let y=1;y<=q.N;y++)for(let z=1;z<=q.N;z++)for(let w=1;w<=q.N;w++){
  if(x+y+z+q.t*w!==q.N)continue;
  total++;rows.set(w,(rows.get(w)||0)+1);
 }
 assert.deepEqual([...rows].sort((a,b)=>a[0]-b[0]),plain(q.rows).map(r=>[r.w,r.cnt]));
 for(const r of q.rows)assert.equal(r.m,q.N-q.t*r.w);
 answer('combo','coef',total);
});

test('combo/color: enumerate every pair of positive white and nonnegative black allocations',()=>{
 const q=source.packet('combo','color'),white=allocations(q.p,q.K,1),black=allocations(q.q,q.K,0),pairs=new Set();
 for(const w of white)for(const b of black)pairs.add(w.map((x,i)=>x+':'+b[i]).join('|'));
 assert.equal(white.length,10);assert.equal(black.length,10);
 answer('combo','color',pairs.size);
});

test('func/mono: enumerate every function and retain only the bounded nondecreasing images',()=>{
 const q=source.packet('func','mono'),histograms=new Set();let count=0;
 words(values(q.n),q.m,f=>{
  if(!f.every((x,i)=>x>=q.a&&x<=q.b&&(i===0||f[i-1]<=x)))return;
  count++;histograms.add(values(q.b-q.a+1).map((_,i)=>f.filter(x=>x===q.a+i).length).join(','));
 });
 answer('func','mono',count);assert.equal(histograms.size,count,'usage multiplicities uniquely determine a nondecreasing function');
});

test('func/atleast: enumerate repeated-letter words containing the distinguished first letter',()=>{
 const q=source.packet('func','atleast');let contains=0,absent=0,total=0;
 words(values(q.n),q.m,f=>{total++;if(f.includes(1))contains++;else absent++;});
 assert.equal(total,625);assert.equal(absent,256);
 answer('func','atleast',contains);
});

test('func/range: enumerate functions with exactly r image values and partition by their actual image set',()=>{
 const q=source.packet('func','range'),groups=new Map();let count=0;
 words(values(q.n),q.m,f=>{
  const image=[...new Set(f)].sort((a,b)=>a-b);
  if(image.length!==q.r)return;
  count++;const key=image.join(',');groups.set(key,(groups.get(key)||0)+1);
 });
 assert.equal(groups.size,6);
 for(const size of groups.values())assert.equal(size,30,'each selected pair is used at least once');
 answer('func','range',count);
});

test('func/comp: enumerate functions whose first two values have product different from c',()=>{
 const q=source.packet('func','comp'),badPairs=[];let good=0,bad=0;
 for(const a of values(q.n))for(const b of values(q.n))if(a*b===q.c)badPairs.push([a,b]);
 assert.equal(badPairs.length,q.d);assert.deepEqual(badPairs,[[2,4],[4,2]],'the two orders are distinct');
 words(values(q.n),q.m,f=>{if(f[0]*f[1]!==q.c)good++;else bad++;});
 assert.equal(bad,50);answer('func','comp',good);
});

test('perm/ends: enumerate distinct multiset words with the specified card at both ends',()=>{
 const q=source.packet('perm','ends');let count=0;
 assert.equal(q.cnt.reduce((a,b)=>a+b,0),q.N);
 multiset(plain(q.cnt),row=>{if(row[0]===q.x&&row.at(-1)===q.x)count++;});
 answer('perm','ends',count);
});

test('perm/adj: enumerate distinct multiset words in which all specified cards form one run',()=>{
 const q=source.packet('perm','adj');let count=0;
 multiset(plain(q.cnt),row=>{
  const positions=row.flatMap((x,i)=>x===q.x?[i]:[]);
  if(positions.at(-1)-positions[0]+1===positions.length)count++;
 });
 answer('perm','adj',count);
});

test('perm/via: enumerate all shortest grid paths and select those visiting P',()=>{
 const q=source.packet('perm','via'),A={i:0,j:0},B={i:q.ga,j:q.gb};
 const all=paths(A,B),valid=all.filter(path=>visits(path,q.via));
 assert.equal(paths(A,q.via).length,q.AP);assert.equal(paths(q.via,B).length,q.PB);
 assert.ok(valid.every(path=>path.length===q.ga+q.gb+1));
 answer('perm','via',valid.length);
});

test('perm/viaAvoid: directly select paths that visit P and never visit forbidden Q',()=>{
 const q=source.packet('perm','viaAvoid'),A={i:0,j:0},B={i:q.ga,j:q.gb};
 const valid=paths(A,B).filter(path=>visits(path,q.via)&&!visits(path,q.q));
 assert.ok(q.q.i>=q.via.i&&q.q.j>=q.via.j);
 assert.equal(paths(A,q.via).length,q.AP);assert.equal(paths(q.via,B).length,q.PB);
 assert.equal(paths(q.via,q.q).length,q.PQ);assert.equal(paths(q.q,B).length,q.QB);
 answer('perm','viaAvoid',valid.length);
});

test('gap/ppl: enumerate labelled students and reject each adjacent pair of female students',()=>{
 const q=source.packet('gap','ppl');let count=0;
 arrangements(range(q.a+q.b),q.a+q.b,row=>{
  if(row.every((x,i)=>i===0||x<q.a||row[i-1]<q.a))count++;
 });
 answer('gap','ppl',count);
});

test('gap/ident: enumerate all distinct two-colour words and reject adjacent black balls',()=>{
 const q=source.packet('gap','ident');let count=0;
 multiset([q.p,q.q],row=>{if(row.every((x,i)=>i===0||x===0||row[i-1]===0))count++;});
 answer('gap','ident',count);
});

test('gap/seats: enumerate labelled people assigned to actual chair positions with empty chairs',()=>{
 const q=source.packet('gap','seats');let count=0;const occupiedSets=new Map();
 // The ith selected chair belongs to person i, so each ordered assignment is counted once.
 arrangements(range(q.N),q.m,chairs=>{
  const sorted=chairs.toSorted((a,b)=>a-b);
  if(!sorted.every((x,i)=>i===0||x-sorted[i-1]>1))return;
  count++;const key=sorted.join(',');occupiedSets.set(key,(occupiedSets.get(key)||0)+1);
 });
 assert.equal(occupiedSets.size,35);for(const multiplicity of occupiedSets.values())assert.equal(multiplicity,6);
 answer('gap','seats',count);
});

test('circ/plain: enumerate all labelled arrangements and identify rotations while preserving reflections',()=>{
 const q=source.packet('circ','plain'),classes=circles(range(q.n),q.n);
 const row=range(q.n);assert.notEqual(circleKey(row),circleKey(row.toReversed()));
 answer('circ','plain',classes.size);
});

test('circ/adj: enumerate circular arrangements with A and B adjacent, including across the last seat',()=>{
 const q=source.packet('circ','adj');
 const classes=circles(range(q.n),q.n,row=>{
  const d=Math.abs(row.indexOf(0)-row.indexOf(1));return d===1||d===q.n-1;
 });
 assert.ok(classes.has('0,2,3,4,1'),'adjacency across the closing edge is included');
 answer('circ','adj',classes.size);
});

test('circ/sep: enumerate circular students and enforce nonadjacency also across the closing edge',()=>{
 const q=source.packet('circ','sep'),n=q.a+q.b;
 const classes=circles(range(n),n,row=>row.every((x,i)=>x<q.a||row[(i+1)%n]<q.a));
 answer('circ','sep',classes.size);
 // This arrangement is valid as a line but fails around a circle.
 const line=[q.a,0,q.a+1,1,2,3,q.a+2];
 assert.ok(line.every((x,i)=>i===0||x<q.a||line[i-1]<q.a));
 assert.ok(line[0]>=q.a&&line.at(-1)>=q.a);assert.ok(!classes.has(circleKey(line)));
});

test('circ/pick: enumerate ordered choices of participants and identify only rotations of each chosen subset',()=>{
 const q=source.packet('circ','pick'),classes=circles(range(q.n),q.k),subsets=new Map();
 for(const key of classes.keys()){
  const participants=key.split(',').map(Number).sort((a,b)=>a-b).join(',');
  subsets.set(participants,(subsets.get(participants)||0)+1);
 }
 assert.equal(subsets.size,15);for(const size of subsets.values())assert.equal(size,6);
 answer('circ','pick',classes.size);
});
