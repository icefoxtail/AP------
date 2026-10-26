/* AP Math Playground — native Canvas relationship engine v2.0 (offline, shared).
   Reads the HOST LAB's real face/edge geometry, not a separate sample diagram.
   Hooks are intentionally NO-OP when disabled. Handles non-cubic Platonic solids.
*/
(function(){'use strict';
const script=document.currentScript;
const TYPE=script?.dataset.boardMode||'solid';
const C={selected:'#ffdc85',parallel:'#5ce6a3',meet:'#ff9eac',skew:'#bba5ff',coplanar:'#7fd2f2',vertex:'#73d9ff'};
const vec=(a,b)=>[b.x-a.x,b.y-a.y,b.z-a.z], cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len=a=>Math.hypot(...a);
const near=(a,b,eps=1e-3)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<eps;
const pk=p=>[p.x,p.y,p.z].map(n=>Math.round(n*1e3)/1e3).join(',');
const ek=(a,b)=>[a,b].sort().join('|');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=window.APBoardRelHost;
if(!host||!document.getElementById('boardCanvas'))return;
const canvas=document.getElementById('boardCanvas'),parent=canvas.parentElement;
let active=false,sampling=false,sampleScheduled=false,faces=[],rawLines=[],reference=null,referenceKey='',sceneSeen='',choice=null,filter='parallel';
let overlay,button,controls,message,filters,svg;
function sceneKey(){const st=host.getState();return [st.mode,st.subType?.[st.mode]||'',st.n||''].join(':');}
function applicable(){const s=host.getState();if(TYPE==='net')return s.mode===1||s.mode===2;if(TYPE==='foldsolid')return s.mode===1;if(TYPE==='spatial')return s.mode===1;return true;}
function captureFaces(batch){if(!active)return; if(!Array.isArray(batch))return;faces.push(...batch.filter(f=>f.pts?.length>=3).map(f=>({pts:f.pts.map(p=>({...p})),label:f.label||''})));}
function captureLine(a,b){if(active&&TYPE==='spatial'&&host.getState().mode===1)rawLines.push({a:{...a},b:{...b}});}
function begin(){if(!active)return;const key=sceneKey();if(key!==sceneSeen){choice=null;reference=null;referenceKey='';sceneSeen=key;}faces=[];rawLines=[];}
function finish(){if(!active)return;if(sampling)return; if(TYPE==='net'||TYPE==='foldsolid'){
 const key=sceneKey();if(referenceKey!==key&&!sampleScheduled){sampleScheduled=true;setTimeout(()=>{sampleScheduled=false;if(!active)return;sampleFinal();},0);}
 }draw();}
function sampleFinal(){if(!active||!(TYPE==='net'||TYPE==='foldsolid')||!applicable())return;
 const st=host.getState(),progressField=TYPE==='net'?'fold':'prog',orig=st[progressField];if(typeof orig!=='number')return;
 const savedFaces=faces,savedLines=rawLines;
 try{sampling=true;st[progressField]=1;host.render();reference=faces.map(f=>({pts:f.pts.map(p=>({...p})),label:f.label}));referenceKey=sceneKey();}
 catch(e){reference=null;referenceKey='';console.warn('fold relation sample:',e);}
 finally{sampling=false;st[progressField]=orig;faces=savedFaces;rawLines=savedLines;host.render();}
}
function getFacesEdges(){let groups=[],edges=[],verts=[];
 const fs=faces;
 // During folding, obtain equivalence classes from this LAB's fully-folded geometry.
 const folded=(TYPE==='net'||TYPE==='foldsolid')&&reference&&referenceKey===sceneKey()&&reference.length===fs.length;
 const physical=(fi,vi)=>pk(folded?(reference[fi]?.pts[vi]||fs[fi].pts[vi]):fs[fi].pts[vi]);
 fs.forEach((f,fi)=>f.pts.forEach((p,i)=>{const key=physical(fi,i),a=physical(fi,i),b=physical(fi,(i+1)%f.pts.length);
 verts.push({p,key,fi,i});edges.push({a:p,b:f.pts[(i+1)%f.pts.length],key:ek(a,b),fi,i});}));
 return {edges,verts,folded};}
function getSolidEdges(){if(TYPE==='spatial'){
 // LAB mode 1 defines exactly 12 physical cuboid edges; ignore its optional distance connector.
 return rawLines.slice(0,12).map(({a,b},i)=>({a,b,key:ek(pk(a),pk(b)),name:'모서리 '+(i+1)}));}
 const {edges}=getFacesEdges();const map=new Map();for(const e of edges){if(near(e.a,e.b))continue;const id=ek(pk(e.a),pk(e.b));if(!map.has(id))map.set(id,{a:e.a,b:e.b,key:id,name:'모서리 '+(map.size+1)});}return [...map.values()].slice(0,250);}
function classify(a,b){if(a.key===b.key)return 'selected';const x=vec(a.a,a.b),y=vec(b.a,b.b),n=len(x)*len(y);if(n<1e-8)return 'coplanar';const cp=cross(x,y);if(near(a.a,b.a)||near(a.a,b.b)||near(a.b,b.a)||near(a.b,b.b))return 'meet';if(len(cp)/n<1e-4)return 'parallel';const sep=vec(a.a,b.a);return Math.abs(dot(sep,cp))/(len(cp)*Math.max(len(sep),1e-9))>1e-4?'skew':'coplanar';}
const sgLine=(p,q,color,w,attrs='')=>`<line x1="${p.x.toFixed(2)}" y1="${p.y.toFixed(2)}" x2="${q.x.toFixed(2)}" y2="${q.y.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${attrs}/>`;
const sgDot=(p,r,color,attrs='')=>`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r}" fill="${color}" ${attrs}/>`;
function project(p){try{const q=host.project(p.x,p.y,p.z);if(!Number.isFinite(q.x)||!Number.isFinite(q.y))return null;return q;}catch(_){return null;}}
function netView(){const {edges,verts,folded}=getFacesEdges();let html='',cnt=0;for(let i=0;i<edges.length;i++){
 const e=edges[i],p=project(e.a),q=project(e.b);if(!p||!q)continue;const chosen=choice?.kind==='edge'&&choice.key===e.key;
 if(chosen){html+=sgLine(p,q,C.selected,7,'class="apboard-active"');cnt++;}
 html+=sgLine(p,q,'transparent',22,`class="apboard-hit" data-board-edge="${escape(e.key)}" aria-label="접으면 맞닿는 변 선택"`);
 }
 // Draw visible dots only when selected, but leave accessible touch targets for all corners.
 for(const v of verts){const p=project(v.p);if(!p)continue;const chosen=choice?.kind==='vertex'&&choice.key===v.key;
 if(chosen){html+=sgDot(p,6.5,C.vertex,'class="apboard-active"');cnt++;}
 html+=sgDot(p,11,'transparent',`class="apboard-point-hit" data-board-vertex="${escape(v.key)}" aria-label="접으면 만나는 꼭짓점 선택"`);
 }
 const n=choice?.kind==='edge'?edges.filter(e=>e.key===choice.key).length:choice?.kind==='vertex'?verts.filter(v=>v.key===choice.key).length:0;
 if(choice){message.innerHTML=choice.kind==='edge'?`선택한 <b>면 경계 ${n}개</b>가 접힌 뒤 같은 모서리를 이룹니다. 현재 도형 위에서 노란색으로 같이 빛납니다.`:`전개도에서 <b>${n}개 점</b>이 접히면 한 꼭짓점이 됩니다. 하늘색으로 함께 표시합니다.`;}
 else message.innerHTML=folded?'실제 <b>전개도 점·변을 터치</b>하세요. 접힌 뒤 같은 꼭짓점·모서리의 위치가 동시에 빛납니다.':'접힌 모양 계산 중입니다.';
 return html;}
function solidView(){const edges=getSolidEdges();if(!edges.length){message.textContent='현재 장면에서는 다면체의 모서리 관계를 추출하지 않았습니다. 다면체 장면을 선택해 주세요.';return '';}
 if(!edges.some(e=>e.key===choice?.key))choice=null;
 const selected=edges.find(e=>e.key===choice?.key),counts={parallel:0,meet:0,skew:0,coplanar:0};
 let html='';for(const e of edges){const p=project(e.a),q=project(e.b);if(!p||!q)continue;const r=selected?classify(selected,e):null;
 if(r&&r!=='selected')counts[r]++;
 if(r==='selected')html+=sgLine(p,q,C.selected,9,'class="apboard-active"');
 else if(r&&(filter==='all'||r===filter))html+=sgLine(p,q,C[r],6,'class="apboard-active"');
 html+=sgLine(p,q,'transparent',23,`class="apboard-hit" data-board-edge="${escape(e.key)}" aria-label="모서리 선택"`);
 }
 if(selected){const rName={parallel:'평행',meet:'한 꼭짓점에서 만나는',skew:'꼬인 위치',coplanar:'같은 평면에서 연장선이 만나는',all:'전체'};
 message.innerHTML=`선택 모서리 기준 <b>${rName[filter]} 관계 ${filter==='all'?edges.length-1:counts[filter]}개</b> · 평행 ${counts.parallel} / 만남 ${counts.meet} / 꼬임 ${counts.skew}${counts.coplanar?' / 같은 평면 '+counts.coplanar:''}. <b>도형을 돌려도</b> 강조가 따라갑니다.`;
 }else message.innerHTML=`지금 칠판의 모서리 <b>${edges.length}개 중 하나</b>를 터치하세요. ${TYPE==='solid'?'정다면체의 모서리 관계도 살펴보세요.':'실제 입체 모서리에 관계를 표시합니다.'}`;
 return html;}
function draw(){if(!active||!svg)return;const rect=parent.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${Math.max(1,rect.width)} ${Math.max(1,rect.height)}`);
 if(!applicable()){svg.innerHTML='';message.textContent='현재 원뿔·원기둥 등 곡면 장면에는 모서리 관계 하이라이트가 적용되지 않습니다. 다면체 장면으로 이동해 주세요.';return;}
 svg.innerHTML=(TYPE==='net'||TYPE==='foldsolid')?netView():solidView();}
function updateFilter(){if(!filters)return;
 const net=TYPE==='net'||TYPE==='foldsolid';filters.innerHTML=net?'':'<button data-board-filter="parallel">평행</button><button data-board-filter="meet">만남</button><button data-board-filter="skew">꼬인 위치</button><button data-board-filter="coplanar">한 평면</button><button data-board-filter="all">전체</button>';
 filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.boardFilter===filter)));}
function init(){if(!parent)return;
 button=document.createElement('button');button.className='apboard-toggle';button.type='button';button.textContent='도형에서 관계 찾기';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','현재 도형 위에서 점과 모서리 관계 직접 찾기');
 overlay=document.createElement('div');overlay.className='apboard-overlay';overlay.hidden=true;overlay.style.display='none';overlay.innerHTML='<svg aria-label="현재 칠판에 겹친 관계 하이라이트" role="group"></svg>';
 svg=overlay.firstChild;
 controls=document.createElement('div');controls.className='apboard-controls';controls.style.display='none';controls.innerHTML='<div class="apboard-filters"></div><div class="apboard-description" aria-live="polite"></div><div class="apboard-legend"><span><i style="background:#ffdc85"></i>선택</span><span><i style="background:#5ce6a3"></i>평행</span><span><i style="background:#ff9eac"></i>만남</span><span><i style="background:#bba5ff"></i>꼬임</span><span><i style="background:#73d9ff"></i>같은 점</span></div>';
 filters=controls.firstChild;message=controls.children[1];parent.append(overlay,button,controls);
 button.addEventListener('click',()=>{active=!active;button.setAttribute('aria-pressed',String(active));overlay.style.display=active?'block':'none';controls.style.display=active?'block':'none';if(active){choice=null;reference=null;referenceKey='';updateFilter();sampleFinal();host.render();}else{svg.innerHTML='';}});
 filters.addEventListener('click',e=>{const b=e.target.closest('[data-board-filter]');if(!b)return;filter=b.dataset.boardFilter;updateFilter();draw();});
 svg.addEventListener('click',e=>{const el=e.target.closest('[data-board-edge],[data-board-vertex]');if(!el)return;e.stopPropagation();choice=el.hasAttribute('data-board-vertex')?{kind:'vertex',key:el.dataset.boardVertex}:{kind:'edge',key:el.dataset.boardEdge};draw();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){active=false;overlay.style.display='none';controls.style.display='none';button.setAttribute('aria-pressed','false');}});
 function placeControls(){if(window.innerWidth<1024){parent.before(controls);}else{parent.appendChild(controls);}if(active)draw();}
 placeControls();window.addEventListener('resize',placeControls,{passive:true});}
window.APBoardRel={begin,captureFaces,captureLine,finish,debug:()=>({active,type:TYPE,scene:sceneKey(),faces:faces.length,lines:rawLines.length,reference:!!reference,finalVertices:reference?new Set(reference.flatMap(f=>f.pts.map(pk))).size:0,finalEdges:reference?new Set(reference.flatMap(f=>f.pts.map((p,i)=>ek(pk(p),pk(f.pts[(i+1)%f.pts.length]))))).size:0,physicalEdges:TYPE==='spatial'?getSolidEdges().length:getFacesEdges().edges.length})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
