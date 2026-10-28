/* F02 integration from codex/circle-sector-f02-split-join. */
(function(){
'use strict';
TL.f02ByFamily={};
function tlF02Spec(id){
 const specs={
  'f02-01':{name:'원 → 합동 반원 둘',parent:'원',total:360,start:-90,n:2,discovery:'지름으로 나눈 두 반원을 벌렸다 붙입니다. 붙이면 공통 지름은 바깥 둘레에서 사라집니다.'},
  'f02-02':{name:'반원 → 사분원 둘',parent:'반원',total:180,start:180,n:2,discovery:'반원의 대칭 반지름을 따라 자릅니다. 두 90° 조각을 붙이면 이음 반지름이 내부 선이 됩니다.'},
  'f02-03':{name:'원 → 사분원 넷',parent:'원',total:360,start:-90,n:4,discovery:'네 사분원의 호는 원주를 이루고, 네 반지름은 붙인 뒤 내부에서 만납니다.'},
  'f02-04':{name:'원 → 120° 부채꼴 셋',parent:'원',total:360,start:-90,n:3,discovery:'세 중심각은 각각 120°이고 합은 360°입니다. 세 원호를 붙이면 하나의 원주가 됩니다.'},
  'f02-05':{name:'원 → 60° 부채꼴 여섯',parent:'원',total:360,start:-90,n:6,discovery:'여섯 호의 합은 원주 그대로이고, 조각이 늘면 분리된 반지름 경계의 합이 커집니다.'},
  'f02-06':{name:'사분원 → 45° 부채꼴 둘',parent:'사분원',total:90,start:-90,n:2,discovery:'90°를 합동인 45° 조각 둘로 나눕니다. 결합하면 가운데 자른 반지름이 둘레에서 빠집니다.'},
  'f02-07':{name:'반원 → 60° 부채꼴 셋',parent:'반원',total:180,start:180,n:3,discovery:'180°를 60°씩 세 조각으로 나눕니다. 세 호의 합은 반원호이고 세 각의 합은 180°입니다.'},
  'f02-08':{name:'자유 분할과 둘레',parent:'원',total:360,start:-90,n:2,freePieces:true,discovery:'조각 수를 바꾸어도 원의 넓이와 원주는 같습니다. 분리한 조각의 반지름 경계는 조각 수에 따라 늘어납니다.'}
 };
 return specs[id]||specs['f02-01'];
}
function tlF02Defaults(id){return {R:6,n:tlF02Spec(id).n};}
function tlF02Current(){
 if(!TL.f02ByFamily[TL.family])TL.f02ByFamily[TL.family]=tlF02Defaults(TL.family);
 return TL.f02ByFamily[TL.family];
}
function tlSetF02Control(which,value){
 const st=tlF02Current();if(which==='R')st.R=Math.round(value);if(which==='r')st.n=Math.round(value);
 tlStop();TL.trace=0;renderTransformLab();
}
function tlF02SectorPath(cx,cy,r,start,angle){
 if(angle>=360)return tlCircularPath(cx,cy,r);
 const end=start+angle,p0=tlPolar(cx,cy,r,start),p1=tlPolar(cx,cy,r,end);
 return `M ${cx} ${cy} L ${tlXY(p0)} A ${r} ${r} 0 ${angle>180?1:0} 1 ${tlXY(p1)} Z`;
}
function tlF02Layout(st){
 const mobile=innerWidth<=660,vw=mobile?480:760,vh=mobile?400:420,cx=vw/2,cy=vh/2;
 const scale=Math.min(mobile?13:17,118/st.R);
 return {mobile,vw,vh,cx,cy,s:scale,gap:mobile?17:24};
}
function tlF02Part(name,color,length,label,d,at){return {name,color,lenPx:length,label,d,at};}
function tlF02Model(st,g,detached){
 const spec=tlF02Spec(TL.family),Rpx=st.R*g.s,step=spec.total/st.n,parent=tlF02SectorPath(g.cx,g.cy,Rpx,spec.start,spec.total);
 const pieces=[];
 for(let i=0;i<st.n;i++){
  const a=spec.start+i*step,b=a+step,mid=(a+b)/2,dx=detached?g.gap*Math.cos(tlRad(mid)):0,dy=detached?g.gap*Math.sin(tlRad(mid)):0,cx=g.cx+dx,cy=g.cy+dy;
  pieces.push({i,a,b,mid,cx,cy,dx,dy,path:tlF02SectorPath(cx,cy,Rpx,a,step)});
 }
 const parts=[],arcAt=(cx,cy,r,a,b,t)=>tlPolar(cx,cy,r,a+(b-a)*t),
  addArc=(name,r,a,b,cx,cy,label)=>parts.push(tlF02Part(name,'#38bdf8',r*Math.abs(tlRad(b-a)),label,b-a>=360?tlCircularPath(cx,cy,r):tlF01ArcD(cx,cy,r,a,b),t=>arcAt(cx,cy,r,a,b,t))),
  addLine=(name,A,B,label)=>parts.push(tlF02Part(name,'#fbbf24',Math.hypot(B.x-A.x,B.y-A.y),label,`M ${tlXY(A)} L ${tlXY(B)}`,t=>({x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t})));
 if(detached){
  pieces.forEach(p=>{
   addArc(`조각 ${p.i+1} 원호`,Rpx,p.a,p.b,p.cx,p.cy,`${tlF01Pi(Rpx/g.s*step/180)} cm`);
   const A=tlPolar(p.cx,p.cy,Rpx,p.a),B=tlPolar(p.cx,p.cy,Rpx,p.b),O={x:p.cx,y:p.cy};
   addLine(`조각 ${p.i+1} 첫 반지름`,O,A,'R');addLine(`조각 ${p.i+1} 둘째 반지름`,O,B,'R');
  });
 }else{
  addArc('바깥 원호',Rpx,spec.start,spec.start+spec.total,g.cx,g.cy,tlF01Pi(Rpx/g.s*spec.total/180));
  if(spec.total<360){
   const O={x:g.cx,y:g.cy},A=tlPolar(g.cx,g.cy,Rpx,spec.start),B=tlPolar(g.cx,g.cy,Rpx,spec.start+spec.total);
   addLine('첫 바깥 반지름',O,A,'R');addLine('끝 바깥 반지름',O,B,'R');
  }
 }
 const arcCoef=tlRatTex(st.R*spec.total,180,true),areaCoef=tlRatTex(st.R*st.R*spec.total,360,true),
  joinedStraight=spec.total===360?0:2*st.R,joinedNum=st.R*Math.PI*spec.total/180+joinedStraight,
  separatedNum=st.R*Math.PI*spec.total/180+2*st.n*st.R,
  joinedTex=joinedStraight?`${arcCoef}+${joinedStraight}`:arcCoef,
  separatedTex=`${arcCoef}+${2*st.n*st.R}`;
 return {spec,Rpx,parent,pieces,parts,areaCoef,arcCoef,joinedStraight,joinedNum,separatedNum,joinedTex,separatedTex,
  areaNum:Math.PI*st.R*st.R*spec.total/360,perimeterNum:detached?separatedNum:joinedNum,
  pieceAngle:step,note:detached?`분리된 ${st.n}개 조각의 둘레에는 잘린 반지름 ${2*st.n}개가 모두 들어갑니다.`:`붙은 도형의 둘레는 바깥 원호${joinedStraight?`와 반지름 ${joinedStraight} cm`:''}입니다. 접합선은 내부에 있어 둘레가 아닙니다.`};
}
function tlF02Mini(st,g,kind){
 const m=tlF02Model(st,g,kind==='piece');
 const body=kind==='piece'?m.pieces.map((p,i)=>`<path d="${p.path}" fill="${['#38bdf8','#34d399','#fbbf24','#c084fc','#fb7185','#4ade80'][i%6]}" fill-opacity=".76" stroke="#e4f5e8" stroke-width="1.8"/>`).join(''):`<path d="${m.parent}" fill="#38bdf8" fill-opacity=".58" stroke="#38bdf8" stroke-width="2.2"/>`;
 return `<svg viewBox="0 0 ${g.vw} ${g.vh}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
function tlDrawF02(){
 const st=tlF02Current(),g=tlF02Layout(st),detached=TL.detach>.015,m=tlF02Model(st,g,detached),svg=tlGet('tlScene');
 svg.setAttribute('viewBox',`0 0 ${g.vw} ${g.vh}`);svg.style.aspectRatio=`${g.vw}/${g.vh}`;
 let out=`<defs><pattern id="tlGrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#5d886a" stroke-opacity=".13" stroke-width=".6"/></pattern></defs><rect width="${g.vw}" height="${g.vh}" fill="url(#tlGrid)"/>`;
 if(!detached){
  out+=`<path d="${m.parent}" fill="#38bdf8" fill-opacity="${TL.mode==='perimeter'?'.12':'.58'}" stroke="#38bdf8" stroke-width="2.4"/>`;
  const first=m.spec.total===360?0:1;
  for(let i=first;i<st.n;i++){const p=tlPolar(g.cx,g.cy,m.Rpx,m.spec.start+i*m.pieceAngle);out+=`<path d="M ${g.cx} ${g.cy} L ${tlXY(p)}" stroke="#fbbf24" stroke-opacity=".9" stroke-width="2" stroke-dasharray="5 4"/>`;}
 }else{
  m.pieces.forEach((p,i)=>out+=`<path d="${p.path}" fill="${['#38bdf8','#34d399','#fbbf24','#c084fc','#fb7185','#4ade80'][i%6]}" fill-opacity=".72" stroke="#e4f5e8" stroke-width="2.2"/>`);
 }
 const perimeterMode=TL.mode==='perimeter'||TL.mode==='both';
 if(perimeterMode)m.parts.forEach((p,i)=>{
  const opacity=TL.focus<0||TL.focus===i?1:.2;
  out+=`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-opacity="${opacity}" stroke-width="${TL.focus===i?6:4}" stroke-linecap="round"/>`;
  out+=`<path d="${p.d}" fill="none" stroke="transparent" stroke-width="20" data-tl-part="${i}" style="cursor:pointer"/>`;
 });
 if(TL.trace>0){let rem=TL.trace*m.parts.reduce((sum,p)=>sum+p.lenPx,0);m.parts.forEach(p=>{const shown=Math.max(0,Math.min(p.lenPx,rem));rem-=p.lenPx;if(shown>.01)out+=`<path d="${p.d}" fill="none" stroke="#ffe59c" stroke-width="7" stroke-linecap="round" stroke-dasharray="${shown.toFixed(3)} ${(p.lenPx+5).toFixed(3)}"/>`;});}
 if(detached){
  const p=m.pieces[0],end=tlPolar(p.cx,p.cy,m.Rpx,p.mid),label=tlPolar(p.cx,p.cy,m.Rpx*.58,p.mid);
  out+=`<path d="M ${p.cx} ${p.cy} L ${tlXY(end)}" stroke="#d4e5d8" stroke-width="1.6" stroke-dasharray="5 5" opacity=".8"/><circle cx="${p.cx}" cy="${p.cy}" r="3.3" fill="#ffe6a0"/>`;
  out+=tlTextSvg(`R=${st.R} cm`,label.x,label.y-5,'#c5efff',g.mobile?11:13,'middle')+tlF01Angle(p.cx,p.cy,Math.min(16,m.Rpx*.18),p.a,p.b,`${m.pieceAngle}°`,'#ffe6a0',g.mobile?9:10);
 }else{
  const mainAngle=m.spec.total===360?specSafeStart(m.spec):m.spec.start+m.spec.total/2,mid=tlPolar(g.cx,g.cy,m.Rpx*.55,mainAngle),radiusEnd=tlPolar(g.cx,g.cy,m.Rpx,mainAngle);
  out+=`<path d="M ${g.cx} ${g.cy} L ${tlXY(radiusEnd)}" stroke="#d4e5d8" stroke-width="1.6" stroke-dasharray="5 5" opacity=".75"/><circle cx="${g.cx}" cy="${g.cy}" r="3.3" fill="#ffe6a0"/>`;
  out+=tlTextSvg(`R=${st.R} cm`,mid.x,mid.y-5,'#c5efff',g.mobile?12:14,'middle');
  if(m.spec.total===360)out+=tlTextSvg(`360° · ${st.n}개 조각`,g.cx,g.cy+28,'#ffe6a0',g.mobile?10:12,'middle');
  else out+=tlF01Angle(g.cx,g.cy,Math.min(22,m.Rpx*.22),m.spec.start,m.spec.start+m.spec.total,`${m.spec.total}°`,'#ffe6a0',g.mobile?10:12);
 }
 if(detached&&TL.detach>.55)out+=tlTextSvg(`${st.n}개 조각`,g.cx,g.vh-16,'#ffe4a1',g.mobile?12:14,'middle');
 svg.innerHTML=out;
}
function specSafeStart(spec){return spec.total===360?-90:spec.start+spec.total/2}
function tlRenderF02(){
 const st=tlF02Current(),spec=tlF02Spec(TL.family),g=tlF02Layout(st),m=tlF02Model(st,g,TL.detach>.5),play=tlGet('tlPlay');
 tlUpdateFamilyControls();
 tlGet('tlShapeName').textContent=spec.name;
 tlGet('tlStageHint').textContent=spec.discovery;
 play.textContent=TL.animationType?'❚❚ 정지':'▶ 재생';play.classList.toggle('playing',Boolean(TL.animationType));
 play.setAttribute('aria-label',TL.animationType?'애니메이션 정지':TL.mode==='perimeter'?'둘레 추적 재생':'조각 분리·합치기 재생');
 document.querySelectorAll('[data-tl-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.tlMode===TL.mode);b.setAttribute('aria-pressed',String(b.dataset.tlMode===TL.mode))});
 const arcArea=tlRatTex(st.R*st.R*spec.total,360,true),pieceArea=tlRatTex(st.R*st.R*spec.total,360*st.n,true);
 tlGet('tlAreaNum').innerHTML=mathHTML(`\\(${arcArea}\\,\\mathrm{cm}^{2}\\)`);
 tlGet('tlPeriNum').innerHTML=mathHTML(`\\(${TL.detach>.5?m.separatedTex:m.joinedTex}\\,\\mathrm{cm}\\)`);
 tlGet('tlFormulaArea').innerHTML='<div class="tl-formula-label">나누어도 전체 넓이는 같습니다</div>'+`<div class="tl-mathline">${mathHTML(`\\(S=${spec.total}/360\\cdot\\pi R^2=${arcArea}\\,\\mathrm{cm}^{2}\\)`)}</div>`+`<div class="tl-mathline">${mathHTML(`\\(한 조각=${pieceArea}\\,\\mathrm{cm}^{2}\\)`)}</div>`;
 tlGet('tlFormulaPeri').innerHTML='<div class="tl-formula-label">붙인 도형과 분리한 조각의 실제 둘레</div>'+`<div class="tl-mathline">${mathHTML(`\\(붙임: L=${m.joinedTex}\\,\\mathrm{cm}\\)`)}</div>`+`<div class="tl-mathline">${mathHTML(`\\(분리: L=${m.separatedTex}\\,\\mathrm{cm}\\)`)}</div>`;
 tlGet('tlSplit').innerHTML=[['whole','붙인 도형'],['piece','분리 조각'],['whole','다시 붙인 도형']].map(([kind,label])=>`<div class="tl-split-part">${tlF02Mini(st,g,kind)}<b>${label}</b></div>`).join('');
 tlGet('tlSplitText').textContent=spec.discovery;tlGet('tlAreaObservation').textContent=TL.detach>.5?m.note:'재생을 누르면 정확히 합동인 조각이 벌어집니다. 다시 재생하면 접합선이 바깥 경계에서 사라집니다.';
 tlGet('tlLegend').innerHTML=m.parts.map((p,i)=>`<button type="button" data-tl-focus="${i}" class="${TL.focus===i?'active':''}"><span class="tl-dot" style="background:${p.color}"></span>${p.name} · ${p.label}</button>`).join('');
 tlGet('tlBoundaryExpr').innerHTML=mathHTML(`\\(L=${TL.detach>.5?m.separatedTex:m.joinedTex}\\,\\mathrm{cm}\\)`);tlGet('tlBoundaryNote').textContent=m.note;
 tlGet('tlBeforeTitle').textContent='붙임 상태';tlGet('tlAfterTitle').textContent=TL.detach>.5?'분리 상태':'현재 상태';
 tlGet('tlBeforeSVG').innerHTML=tlF02Mini(st,g,'whole');tlGet('tlAfterSVG').innerHTML=tlF02Mini(st,g,TL.detach>.5?'piece':'whole');
 tlGet('tlBeforeValue').innerHTML=mathHTML(`넓이 \\(${arcArea}\\) · 둘레 \\(${m.joinedTex}\\)`);tlGet('tlAfterValue').innerHTML=mathHTML(`넓이 \\(${arcArea}\\) · 둘레 \\(${TL.detach>.5?m.separatedTex:m.joinedTex}\\)`);
 tlGet('tlDiff').textContent=m.note;tlDrawF02();
}
function tlPlayF02(){
 if(TL.animationType){tlStop();renderTransformLab();return}
 tlStop();const tracing=TL.mode==='perimeter',from=TL.detach,to=tracing?from:(from>.5?0:1);
 TL.animationType=tracing?'trace':'split';TL.trace=0;
 const start=performance.now(),duration=tracing?3600:1700;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){if(!tracing)TL.detach=to;TL.trace=tracing?1:0;tlStop();renderTransformLab();return}
 function frame(now){
  const t=Math.min(1,(now-start)/duration),smooth=x=>x*x*(3-2*x);
  if(tracing)TL.trace=t;else TL.detach=from+(to-from)*smooth(t);
  tlDrawScene();
  if(t<1)TL.animation=requestAnimationFrame(frame);else{tlStop();renderTransformLab()}
 }
 TL.animation=requestAnimationFrame(frame);renderTransformLab();
}

const nav=tlGet('tlFamily'),head=document.createElement('span');head.className='tl-family-label';head.textContent='F02 · 나누기·합치기';nav.appendChild(head);
[['f02-01','① 원 → 반원 둘'],['f02-02','② 반원 → 사분원 둘'],['f02-03','③ 원 → 사분원 넷'],['f02-04','④ 원 → 120° 부채꼴 셋'],['f02-05','⑤ 원 → 60° 부채꼴 여섯'],['f02-06','⑥ 사분원 → 45° 부채꼴 둘'],['f02-07','⑦ 반원 → 60° 부채꼴 셋'],['f02-08','⑧ 자유 분할과 둘레']].forEach(([id,label])=>{const b=document.createElement('button');b.type='button';b.dataset.tlFamily=id;b.textContent=label;nav.appendChild(b)});
const isF02=()=>TL.family.startsWith('f02-');
const oldControls=tlUpdateFamilyControls;tlUpdateFamilyControls=function(){if(!isF02()){oldControls();return}const spec=tlF02Spec(TL.family),st=tlF02Current();['tlAngleRow','tlAnglePresets','tlOffsetRow','tlFamilyControls'].forEach(x=>tlGet(x).hidden=true);tlGet('tlOuterRow').hidden=false;tlGet('tlInnerRow').hidden=!spec.freePieces;tlGet('tlOuterLabel').textContent='반지름 R';Object.assign(tlGet('tlOuter'),{min:'3',max:'8',step:'1',value:String(st.R)});tlGet('tlOuterVal').textContent=`${st.R} cm`;if(spec.freePieces){tlGet('tlInnerLabel').textContent='조각 수 n';Object.assign(tlGet('tlInner'),{min:'2',max:'6',step:'1',value:String(st.n)});tlGet('tlInnerVal').textContent=`${st.n}개`}};
const oldRender=renderTransformLab;renderTransformLab=function(){if(!isF02()){oldRender();return}tlGet('tlKicker').textContent='F02 · 나누기·합치기';tlGet('tlLabTitle').textContent='나누기·합치기 · 조각과 경계';tlGet('tlLabDescription').textContent='조각을 분리하고 다시 붙여 넓이와 실제 둘레를 비교합니다.';tlRenderF02()};
const oldDraw=tlDrawScene;tlDrawScene=function(){if(isF02())tlDrawF02();else oldDraw()};
[['tlOuter','R'],['tlInner','r']].forEach(([id,key])=>tlGet(id).addEventListener('input',e=>{if(!isF02())return;e.stopImmediatePropagation();tlSetF02Control(key,+e.target.value)},true));
tlGet('tlReset').addEventListener('click',e=>{if(!isF02())return;e.stopImmediatePropagation();tlStop();delete TL.f02ByFamily[TL.family];Object.assign(TL,{mode:'both',detach:0,trace:0,focus:-1});renderTransformLab()},true);
tlGet('tlPlay').addEventListener('click',e=>{if(!isF02())return;e.stopImmediatePropagation();tlPlayF02()},true);
})();
