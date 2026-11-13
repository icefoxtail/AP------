/* Polyhedron proofs use the captured native solid, never a legacy lesson clock.
 * Counting follows actual face/edge/vertex incidence. Detached faces rotate as
 * rigid polygons and then move horizontally in the current projected view. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root?.APLab) {
    root.APLab.G7ShortPolyhedra = api;
    Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
    Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
  }
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const clone = s => JSON.parse(JSON.stringify(s));
  const clamp = x => Math.max(0, Math.min(1, x));
  const phase = (t, a, z) => { const u = clamp((t - a) / (z - a)); return u * u * (3 - 2 * u); };
  const frame = (label, formula = '', answer = false) => ({ label, formula, answer });
  const NAMES = { F: '면', E: '모서리', V: '꼭짓점' };
  const KINDS = { prism: '각기둥', pyr: '각뿔', fr: '각뿔대' };
  const SHAPES = { prism: '직사각형', pyr: '삼각형', fr: '사다리꼴' };
  const kinds = [['prism', '각기둥'], ['pyr', '각뿔'], ['fr', '각뿔대']];
  const PALETTE = ['sky', 'rose', 'amber'];
  const BOTTOM = { align: 'center', baseline: 'middle', size: 14, weight: 750 };

  function bind(id, lab, state, updates = {}) {
    const G = typeof window === 'undefined' ? lab.api : window.APL_PH;
    const D = lab.scene?.ph;
    if (!G || !D || D.id !== id) return null;
    const s = { ...clone(state), ...updates, lessonOn: false, lessonEntry: false };
    return { id, G, D, s, M: D.model(s) };
  }
  function prepare(b, d, points, extra = {}) {
    b.kind = 'figure'; b.aspect = '1:1'; b.setPanes(null);
    b.setInsets({ top: 42, right: 24, bottom: 66, left: 24 });
    b.zoom = 1; b.panX = 0; b.panY = 0;
    const D = d.G.scene3(b, d.s, { txt: true, problem: false, review: false, thumb: false });
    D.fitPts(points, { t: 30, b: 30, l: 28, r: 28, ...extra });
    return D;
  }
  function plain(D, S, G, color = 'sky') {
    return G.drawPoly(D, S, {
      face: (_, vis) => vis ? { c: color, a: .065 } : null,
      edge: () => ({ color: 'muted', width: 2.1 })
    });
  }
  function groups(S, target) {
    const zmin = Math.min(...S.V.map(p => p.z)), zmax = Math.max(...S.V.map(p => p.z));
    const bottom = p => Math.abs(p.z - zmin) < 1e-7, top = p => Math.abs(p.z - zmax) < 1e-7;
    if (target === 'F') return [
      S.F.map((f,i) => i).filter(i => S.F[i].i.every(v => bottom(S.V[v])) || S.F[i].i.every(v => top(S.V[v]))),
      S.F.map((f,i) => i).filter(i => !S.F[i].i.every(v => bottom(S.V[v])) && !S.F[i].i.every(v => top(S.V[v])))
    ];
    if (target === 'E') return [
      S.E.map((e,i) => i).filter(i => bottom(S.V[S.E[i].a]) && bottom(S.V[S.E[i].b])),
      S.E.map((e,i) => i).filter(i => top(S.V[S.E[i].a]) && top(S.V[S.E[i].b])),
      S.E.map((e,i) => i).filter(i => !(bottom(S.V[S.E[i].a]) && bottom(S.V[S.E[i].b])) && !(top(S.V[S.E[i].a]) && top(S.V[S.E[i].b])))
    ].filter(g => g.length);
    return [S.V.map((p,i) => i).filter(i => bottom(S.V[i])), S.V.map((p,i) => i).filter(i => !bottom(S.V[i]))];
  }
  function countPose(S, target, t) {
    const gs = groups(S, target), n = gs.flat().length, progress = phase(t, .9, 5.6) * n;
    let k = 0;
    return gs.flatMap((list, gi) => list.map((index, local) => ({ index, group: gi, local, visible: k++ < progress, color: PALETTE[gi] })));
  }
  function drawCount(b, t, d, target, solid = d.M.S) {
    const G = d.G, D = prepare(b, d, solid.V), rows = countPose(solid, target, t), active = new Map(rows.filter(r => r.visible).map(r => [r.index, r]));
    G.drawPoly(D, solid, {
      face: (i, vis) => target === 'F' && active.has(i) ? { c: active.get(i).color, a: vis ? .24 : .09, hidden: true } : vis ? { c: 'sky', a: .055 } : null,
      edge: i => target === 'E' && active.has(i) ? { color: active.get(i).color, width: 4.2 } : { color: 'muted', width: 2 }
    });
    solid.V.forEach((p, i) => D.dot(p, target === 'V' && active.has(i) ? active.get(i).color : 'muted', target === 'V' && active.has(i) ? 5.5 : 2.8));
    const current = rows.filter(r => r.visible).at(-1);
    if (current && t < 6.6) {
      const point = target === 'F' ? solid.F[current.index].c : target === 'E' ? G.mid3(solid.V[solid.E[current.index].a], solid.V[solid.E[current.index].b]) : solid.V[current.index];
      D.label(point, `${NAMES[target]} ${active.size}`, { color: current.color, size: 15, gap: 14 });
    }
    D.flush();
    if (t >= 5.6) b.stext(b.W / 2, b.H - 31, groups(solid, target).map(g => g.length).join(' + ') + `  (${NAMES[target]})`, { ...BOTTOM, color: 'ink' });
  }
  function countFrame(t, d, target) {
    const gs = groups(d.M.S, target), total = gs.flat().length;
    if (t < .9) return frame(`${d.M.name}에서 ${NAMES[target]}만 구별해 셉니다.`);
    if (t < 5.6) return frame(target === 'F' ? '밑면을 먼저 세고 옆면을 한 장씩 표시합니다. 뒤쪽 면도 포함합니다.' : target === 'E' ? '밑모서리와 옆모서리를 다른 색으로 한 번씩 표시합니다.' : '아래쪽 점을 센 다음 위쪽 점을 셉니다. 같은 점을 중복하지 않습니다.');
    if (t < 7.1) return frame('색으로 나눈 묶음은 서로 겹치지 않고 전체를 덮습니다.');
    return frame(`${NAMES[target]}의 전체 개수를 합합니다.`, `$${target}=${gs.map(g => g.length).join('+')}=${total}\\text{개}$`, true);
  }
  function facingFace(d, S, fi, turn, shift) {
    const G = d.G, f = S.F[fi], c = f.c, cam = G.camOf(d.s);
    const toward = G.v3(-cam.sy * cam.cp, -cam.cy * cam.cp, cam.sp);
    let axis = G.cross3(f.n, toward), angle = Math.acos(Math.max(-1, Math.min(1, G.dot3(f.n, toward))));
    if (G.len3(axis) < 1e-9) axis = G.cross3(f.n, Math.abs(f.n.z) < .8 ? G.v3(0,0,1) : G.v3(1,0,0));
    axis = G.unit3(axis);
    const offset = G.hxOf(d.s, shift);
    return f.i.map(i => G.add3(G.rotAxis(S.V[i], c, axis, angle * turn), offset));
  }
  function drawSide(b, t, d) {
    const { G, M } = d, S = M.S, fi = M.fi ?? S.F.findIndex(f => Math.abs(f.n.z) < .999);
    const final = facingFace(d, S, fi, 1, 3.4), D = prepare(b, d, S.V.concat(final)), f = S.F[fi];
    plain(D, S, G);
    D.panel(f.i.map(i => S.V[i]), 'amber', .16, 'amber', 2.5, { dash: D.facing(f.n) ? undefined : [5,4] });
    if (t > .8) {
      const moved = facingFace(d, S, fi, phase(t,.8,3), 3.4 * phase(t,3.2,5.5));
      D.panel(moved, 'amber', .22, 'amber', 3.2);
      if (t >= 5.5 && M.kind === 'prism') for (let i = 0; i < moved.length; i++) b.right(D.P(moved[i]), D.P(moved[(i+1)%moved.length]), D.P(moved[(i+moved.length-1)%moved.length]), { size: 10, color: 'sky' });
      if (t >= 5.5 && M.kind === 'fr') {
        for (let i = 0; i < f.i.length; i++) {
          const j = (i + 1) % f.i.length;
          if (Math.abs(S.V[f.i[i]].z - S.V[f.i[j]].z) < 1e-8) D.par(moved[i], moved[j], 1, 'sky');
        }
      }
      if (t >= 7.1) D.label(G.cen3(moved), SHAPES[M.kind], { color: 'green', size: 16, at: [[0,0]] });
    }
    D.flush();
  }
  function sideFrame(t, d) {
    if (t < .8) return frame(`${d.M.name}에서 선택한 옆면을 표시합니다.`);
    if (t < 3.2) return frame('옆면을 변의 길이가 변하지 않도록 제자리에서 돌려 정면으로 봅니다.');
    if (t < 5.5) return frame('같은 옆면을 가로로 꺼내 입체의 밑면과 구별합니다.');
    if (t < 7.1) return frame(d.M.kind === 'prism' ? '네 각이 모두 직각입니다.' : d.M.kind === 'pyr' ? '세 변이 둘러싼 평면 도형입니다.' : '평행한 두 변의 길이가 서로 다릅니다.');
    return frame(`이 ${KINDS[d.M.kind]}의 옆면은 ${SHAPES[d.M.kind]}입니다.`, '', true);
  }
  function drawClassify(b, t, d, target) {
    const { G, M } = d;
    if (M.kd.poly) { drawCount(b,t,{...d,M:{...M,S:G.solidOfKind(M.kd.id,M.n,.5)}},'F'); return; }
    const D = prepare(b,d,[G.v3(-1.6,-1.6,-1.6),G.v3(1.6,1.6,1.6)]);
    G.drawCurved(D, {cyl:'cylinder',cone:'cone',sph:'sphere'}[M.kd.id], G.v3(0,0,0),1.4,2.7,{color:t>1?'amber':'sky',alpha:.2,width:3});
    if (t >= 1.1) {
      const u=phase(t,1.1,5.6), z=M.kd.id==='cone'?-1.35+2.7*u:M.kd.id==='cyl'?-1.35+2.7*u:-1.4+2.8*u;
      const r=M.kd.id==='cone'?1.4*(1-u):M.kd.id==='cyl'?1.4:Math.sqrt(Math.max(0,1.96-z*z));
      const ring=Array.from({length:49},(_,i)=>G.v3(r*Math.cos(i*Math.PI/24),r*Math.sin(i*Math.PI/24),z));
      D.path(ring,'rose',3); if(t>5.6)D.label(G.v3(0,0,.2),'곡면',{color:'rose',size:17});
    }
    D.flush(); void target;
  }
  function classFrame(t,d,target) {
    if(t<1.1)return frame('현재 고른 입체의 겉면을 확인합니다.');
    if(t<5.6)return frame(d.M.kd.poly?'다각형인 면을 빠짐없이 한 장씩 표시합니다.':'겉면을 따라 단면을 옮겨 곡면을 확인합니다.');
    if(t<7.1)return frame(d.M.kd.poly?'모든 면이 평평한 다각형입니다.':'곡면은 다각형인 면이 아닙니다.');
    return target==='classify'?frame(d.M.kd.poly?'다각형인 면으로만 둘러싸인 다면체입니다.':'곡면이 있으므로 다면체가 아닙니다.','',true):frame(d.M.kd.poly?'입체의 면을 센 개수로 몇 면체인지 부릅니다.':'다면체가 아니므로 몇 면체로 분류하지 않습니다.',d.M.kd.poly?`$${d.M.F}\\text{면체}$`:'',true);
  }
  function drawBases(b,t,d){
    const {G,M}=d,S=M.S,D=prepare(b,d,S.V),bases=S.F.filter(f=>Math.abs(f.n.z)>.999);
    plain(D,S,G);
    bases.forEach((f,i)=>{D.panel(f.i.map(v=>S.V[v]),i?'rose':'sky',t>=1?.18:.07,i?'rose':'sky',3,{dash:D.facing(f.n)?undefined:[5,4]});
      if(t>1.5)D.par(S.V[f.i[0]],S.V[f.i[1]],1,i?'rose':'sky');
      if(t>4.8)D.label(f.c,f.n.z>0?'작은 밑면':'큰 밑면',{color:i?'rose':'sky',size:14});
    });D.flush();
  }
  function drawSideCount(b,t,d){
    const {G,M}=d,S=M.S,D=prepare(b,d,S.V),sides=groups(S,'F')[1],shown=Math.ceil(sides.length*phase(t,.9,5.6)),selected=sides.slice(0,shown);
    G.drawPoly(D,S,{face:(i,vis)=>selected.includes(i)?{c:'amber',a:vis?.24:.09,hidden:true}:vis?{c:'sky',a:.05}:null,edge:()=>({color:'muted',width:2.1})});
    if(shown>0&&t<6.6)D.label(S.F[selected.at(-1)].c,`옆면 ${shown}`,{color:'amber',size:15,gap:14});
    D.flush();
  }
  function drawEuler(b,t,d){
    const {G,M}=d,S=M.S,D=prepare(b,d,S.V,{b:85});
    G.drawPoly(D,S,{face:(_,vis)=>vis?{c:'amber',a:t>2.6?.2:.05}:null,edge:()=>({color:t>4.5?'rose':'muted',width:t>4.5?3.5:2})});
    S.V.forEach(p=>D.dot(p,t>.8?'sky':'muted',t>.8?5:2.8));D.flush();
    if(t>5.2){const total=S.V.length+S.F.length,left=32,scale=(b.W-64)/total,y=b.H-69;
      const bar=(yy,parts)=>{let x=left;for(const [n,c]of parts){G.sRect(b,x,yy,x+n*scale,yy+12,c,.6);x+=n*scale;}};
      bar(y,[[S.V.length,'sky'],[S.F.length,'amber']]);bar(y+24,[[S.E.length,'rose'],[2,'green']]);
      b.stext(b.W/2,y-12,'V + F  =  E + 2',{...BOTTOM,color:'ink',size:12});
    }
  }
  const FACE_NAMES={3:'정삼각형',4:'정사각형',5:'정오각형',6:'정육각형'};
  function cornerPolygons(p,q){
    const theta=(180-360/p)*Math.PI/180,edge=2*Math.PI/p,base=[{x:0,y:0}];
    let x=0,y=0;for(let i=0;i<p-1;i++){x+=Math.cos(i*edge);y+=Math.sin(i*edge);base.push({x,y});}
    return Array.from({length:q},(_,i)=>base.map(v=>({x:v.x*Math.cos(i*theta)-v.y*Math.sin(i*theta),y:v.x*Math.sin(i*theta)+v.y*Math.cos(i*theta)})));
  }
  function flatSetup(b,points){
    b.kind='figure';b.aspect='1:1';b.setPanes(null);b.setInsets({top:46,right:32,bottom:75,left:32});b.zoom=1;b.panX=0;b.panY=0;
    const xs=points.map(p=>p.x),ys=points.map(p=>p.y),w=Math.max(1,Math.max(...xs)-Math.min(...xs)),h=Math.max(1,Math.max(...ys)-Math.min(...ys));
    b.setFocus({x:[Math.min(...xs)-w*.15,Math.max(...xs)+w*.15],y:[Math.min(...ys)-h*.15,Math.max(...ys)+h*.15]},false);
  }
  function drawCorner(b,t,d,compare=false){
    const {p,q,th,sum}=d.M,polys=cornerPolygons(p,q);flatSetup(b,polys.flat());
    const n=q*phase(t,.8,5.5);
    polys.forEach((points,i)=>{b.path(points,{close:true,color:i<n?'amber':'muted',fill:i<n?'amber':'sky',fillAlpha:i<n?.17:.04,width:2});
      if(i<n){const a=(i+.5)*th*Math.PI/180,r=.55;b.text({x:r*Math.cos(a),y:r*Math.sin(a)},`${th}°`,{size:13,color:'amber',align:'center',baseline:'middle'});}
    });
    b.point({x:0,y:0},{r:5,color:'rose'});
    if(t>=5.5){b.circle({x:0,y:0},.42,{color:compare?'rose':'green',width:2,dash:[4,3]});b.stext(b.W/2,b.H-36,`${q} × ${th}°  ${sum<360?'<':sum===360?'=':'>'}  360°`,{...BOTTOM,color:sum<360?'green':'rose'});}
  }
  function cornerFrame(t,d,compare=false){
    const {p,q,th,sum}=d.M;
    if(t<.8)return frame(`${FACE_NAMES[p]} ${q}개의 같은 꼭짓점을 한 점에 모읍니다.`);
    if(t<5.5)return frame(compare?'한 꼭짓점 둘레 360°를 넘거나 채우는지 각 조각으로 비교합니다.':'각 면의 내각을 크기와 변 길이를 바꾸지 않고 차례로 모읍니다.');
    if(t<7.1)return frame(sum<360?'360°보다 작은 빈틈이 남아 입체의 꼭짓점이 될 수 있습니다.':sum===360?'한 바퀴를 모두 채워 평평해집니다.':'한 바퀴보다 커서 면이 겹칩니다.');
    return frame(sum<360?'이 조합은 정다면체의 꼭짓점을 만들 수 있습니다.':'이 조합으로 정다면체의 꼭짓점을 만들 수 없습니다.',`$${q}\\times${th}°=${sum}°${sum<360?'\\lt ':sum===360?'=':'\\gt '}360°$`,true);
  }
  function drawPlatonic(b,t,d,target){
    const {G,M}=d,S=M.S,D=prepare(b,d,S.V),faceIndex=Math.min(M.hf||0,S.F.length-1),vertex=Math.min(M.hv||0,S.V.length-1),adjacent=S.vf[vertex];
    G.drawPoly(D,S,{face:(i,vis)=>target==='face'?(i===faceIndex?{c:'amber',a:.27,hidden:true}:vis?{c:'sky',a:.05}:null):(adjacent.slice(0,Math.ceil(adjacent.length*phase(t,.8,5.5))).includes(i)?{c:'amber',a:vis?.25:.09,hidden:true}:vis?{c:'sky',a:.05}:null),edge:()=>({color:'muted',width:2.2})});
    if(target==='face'&&t>.8){const f=S.F[faceIndex],n=Math.ceil(f.i.length*phase(t,.8,5.5));for(let j=0;j<n;j++){const a=S.V[f.i[j]],z=S.V[f.i[(j+1)%f.i.length]];D.line(a,z,'amber',4);D.tick(a,z,1,'rose');}if(t>5.5)D.label(f.c,`${f.i.length}개의 같은 변`,{color:'amber',size:14});}
    if(target==='vertex'){D.dot(S.V[vertex],'rose',6);if(t>5.5)D.label(S.V[vertex],`${adjacent.length}개 면`,{color:'rose',size:15,gap:17});}D.flush();
  }
  function exceptionSolid(d){
    const G=d.G;if(d.M.ex==='sq')return G.pyrS(4,1.4,2.3);
    return G.solidOf(G.ring(3,1,0,0).concat([G.v3(0,0,Math.SQRT2),G.v3(0,0,-Math.SQRT2)]));
  }
  function drawException(b,t,d,target){
    const {G,M}=d,S=M.S;
    if(M.ex==='bi'&&t<2.4){
      const base=S.V.filter(p=>Math.abs(p.z)<1e-8),top=S.V.find(p=>p.z>1),bottom=S.V.find(p=>p.z< -1),offset=G.hxOf(d.s,2.8*(1-M.join)*(1-phase(t,.8,2.4)));
      const a=G.solidOf(base.concat([top])),c=G.solidOf(base.concat([bottom]).map(p=>G.add3(p,offset))),D=prepare(b,d,a.V.concat(c.V));plain(D,a,G);plain(D,c,G,'amber');D.flush();return;
    }
    if(target!=='reason'){drawCount(b,Math.max(0,(t-2.4)*1.7),d,target);return;}
    const D=prepare(b,d,S.V);plain(D,S,G);
    if(t>2.4)S.V.forEach((p,i)=>{const q=S.vf[i].length;D.dot(p,q===4?'rose':'sky',5.5);if(t>4)D.label(p,String(q),{color:q===4?'rose':'sky',size:15,gap:13});});
    if(M.ex==='sq'&&t>4){const f=S.F.find(f=>f.i.length===4);D.panel(f.i.map(i=>S.V[i]),'amber',.18,'amber',3,{dash:[5,4]});}D.flush();
  }
  function incidenceCounts(S,target,faces){
    if(target==='V')return S.V.map((_,i)=>faces.filter(fi=>S.F[fi].i.includes(i)).length);
    return S.E.map(e=>faces.filter(fi=>S.F[fi].i.includes(e.a)&&S.F[fi].i.includes(e.b)).length);
  }
  function drawIncidence(b,t,d,target){
    const {G,M}=d,S=M.S,faces=S.F.map((_,i)=>i).slice(0,Math.ceil(S.F.length*phase(t,.8,5.6))),counts=incidenceCounts(S,target,faces),D=prepare(b,d,S.V);
    G.drawPoly(D,S,{face:(i,vis)=>vis?{c:faces.includes(i)?'amber':'sky',a:faces.includes(i)?.13:.035}:null,edge:(i)=>({color:target==='E'&&counts[i]===2?'green':target==='E'&&counts[i]?'amber':'muted',width:target==='E'&&counts[i]?3.5:1.8})});
    if(target==='V')S.V.forEach((p,i)=>D.dot(p,counts[i]===M.I.q?'green':counts[i]?'amber':'muted',counts[i]?5:2.5));
    if(t>=5.6){const p=target==='E'?G.mid3(S.V[S.E[0].a],S.V[S.E[0].b]):S.V[0];D.label(p,target==='E'?'2번 세어짐':`${M.I.q}번 세어짐`,{color:'green',size:14,gap:18});}D.flush();
  }
  function drawDual(b,t,d,target){
    const {G,M}=d,{S,T}=M.dual,D=prepare(b,d,S.V);plain(D,S,G);
    const dots=Math.ceil(S.F.length*phase(t,.7,2.4));S.F.slice(0,dots).forEach(f=>D.dot(f.c,'amber',4.5));
    if(t<5.7){const edges=T.E.slice(0,Math.ceil(T.E.length*phase(t,2.6,5.7)));edges.forEach(e=>D.line(T.V[e.a],T.V[e.b],'amber',3,{dash:e.f.some(i=>D.facing(T.F[i].n))?undefined:[5,4]}));}
    if(t>=5.7)G.drawPoly(D,T,{face:(_,vis)=>vis?{c:'green',a:.18}:null,edge:()=>({color:target==='E'?'rose':'amber',width:3})});
    if(t>=5.7&&target==='F'){const f=T.F[0];D.panel(f.i.map(i=>T.V[i]),'rose',.2,'rose',3,{dash:D.facing(f.n)?undefined:[5,4]});D.dot(S.V[0],'sky',5);}
    D.flush();
  }
  function drawFive(b,t,d){
    if(t<5.5){drawCorner(b,t,d,true);return;}
    const G=d.G,keys=['tetra','octa','icosa','cube','dodeca'],layout=[[-2.5,1.7],[0,1.7],[2.5,1.7],[-1.3,-1.6],[1.3,-1.6]],items=keys.map((k,i)=>{const S=G.platS(k),scale=.65/S.R,off=G.add3(G.hxOf(d.s,layout[i][0]),G.v3(0,0,layout[i][1]));return{k,S:{...S,V:S.V.map(p=>G.add3(G.mul3(p,scale),off))},off};});
    const D=prepare(b,d,items.flatMap(x=>x.S.V),{b:45,t:35});items.forEach((x,i)=>{plain(D,x.S,G,'green');D.label(x.off,`${G.PLAT[x.k].p}각형·${G.PLAT[x.k].q}개`,{color:'ink',size:12,at:[[0,52]]});});D.flush();
  }
  function netPoint(net,k,f){
    const faces=net.at(f);for(let i=0;i<net.ptOf.length;i++){const j=net.ptOf[i].indexOf(k);if(j>=0)return faces[i][j];}return null;
  }
  function matchingPoints(net,k){return net.pt.map((_,i)=>i).filter(i=>i!==k&&net.ptCl[i]===net.ptCl[k]);}
  function netFold(d,t){const start=clamp(d.s.phFold||0);return t<1.8?start*(1-phase(t,.6,1.8)):phase(t,2,5.7);}
  function drawNet(b,t,d,o={}){
    const {G,M}=d,net=M.net,fold=netFold(d,t),faces=net.at(fold),view={...d,s:{...d.s,phYaw:(d.s.phYaw||0)-22*fold,phPitch:Math.max(28,84-56*fold)}};
    const D=prepare(b,view,faces.flat(),{t:28,b:34,l:35,r:35}),shown=t>=5.7,ref=M.refFace,paired=M.paired||[],point=M.point;
    const hi=point==null?[]:[point,...(t>=2?M.partners||[]:[])];
    const order=faces.map((ps,i)=>({i,depth:D.depth(G.cen3(ps))})).sort((a,z)=>z.depth-a.depth);
    order.forEach(({i})=>{
      const ps=faces[i],normal=G.mul3(G.cross3(G.sub3(ps[1],ps[0]),G.sub3(ps[2],ps[0])),d.netSigns[i]);
      const isRef=i===ref,isPaired=shown&&paired.includes(i),bad=shown&&o.overlap&&net.overlap[i];
      const color=bad?'rose':isRef?'amber':isPaired?'green':'sky';
      D.panel(ps,color,isRef||isPaired||bad?.24:.055,color,isRef||isPaired?3.2:1.8,{dash:fold>.9&&!D.facing(normal)?[5,4]:undefined});
      if(o.faceNames){const text=o.dice?(i===M.hidden?(t>=7.1?String(M.values[i]):'?'):String(M.values[i])):String.fromCharCode(65+(net.num?net.num[i]-1:i));
        if(fold<.8||isRef||isPaired||i===M.hidden)D.label(G.cen3(ps),text,{color:isRef?'amber':isPaired?'green':'ink',size:o.dice?21:16,at:[[0,0],[0,-17],[0,17]]});}
    });
    if(point!=null&&net.pt.length<=26){
      // The question's complete lettering is part of the given diagram. Keep
      // neutral points visible while only the tracked copies gain emphasis.
      const groups=fold>.999?net.cl.map((_,c)=>net.pt.map((_,k)=>k).filter(k=>net.ptCl[k]===c)):net.pt.map((_,k)=>[k]);
      groups.filter(ks=>ks.length).forEach(ks=>{
        const p=netPoint(net,ks[0],fold),selected=ks.includes(point),tracked=ks.some(k=>hi.includes(k)),color=selected?'amber':tracked?'rose':'muted';
        D.dot(p,color,tracked?5:2.8);
        D.label(p,ks.map(k=>net.ptName[k]).join(' · '),{color,size:tracked?14:12,gap:tracked?13:9});
      });
    }else hi.forEach((k,i)=>{const p=netPoint(net,k,fold);if(!p)return;D.dot(p,i?'rose':'amber',5);if(i===0)D.label(p,shown?`기준점과 다른 ${hi.length-1}개 점`:'기준점',{color:'amber',size:14,gap:13});});
    D.flush();
  }
  function drawNetCollection(b,t,d){
    if(t<5.7){drawNet(b,t,d,{overlap:true});return;}
    const nets=d.G.CUBE_NETS,cols=b.W<560?3:4,rows=Math.ceil(nets.length/cols),cw=6.4,ch=5.1,all=[];
    const tiles=nets.map((n,i)=>{const xs=n.cells.map(c=>c[0]),ys=n.cells.map(c=>c[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0+1,h=Math.max(...ys)-y0+1,cx=(i%cols+.5)*cw,cy=(Math.floor(i/cols)+.5)*ch;return{n,cx,cy,cells:n.cells.map(([x,y])=>({x:cx+x-x0-w/2,y:cy+y-y0-h/2}))};});
    tiles.forEach(q=>q.cells.forEach(p=>all.push(p,{x:p.x+1,y:p.y+1})));flatSetup(b,all);
    tiles.forEach((q,i)=>{q.cells.forEach(p=>b.path([p,{x:p.x+1,y:p.y},{x:p.x+1,y:p.y+1},{x:p.x,y:p.y+1}],{close:true,color:'green',fill:'green',fillAlpha:.15,width:1.4}));b.text({x:q.cx,y:q.cy+2.3},String(i+1),{align:'center',size:12,color:'ink'});});void rows;
  }
  function bindVertex(d,useQuestion=true){
    const net=useQuestion&&d.M.qnet?d.M.qnet:d.M.net,point=useQuestion&&d.M.qk!=null?d.M.qk:d.M.k;
    return {...d,M:{...d.M,net,point,partners:matchingPoints(net,point)}};
  }
  function vertexFrame(t,d){
    const {net,point,partners}=d.M,n=net.ptName[point],names=partners.map(i=>net.ptName[i]);
    if(!n){
      if(t<1.8)return frame('현재 전개도의 노란 기준점과 이어진 면을 확인합니다.');
      if(t<5.7)return frame('접는 선을 경첩으로 돌리면서 기준점과 다른 점들의 위치를 따라갑니다.');
      if(t<7.1)return frame('접힌 입체에서 한 꼭짓점에 도착한 점들을 확인합니다.');
      return frame(partners.length?`기준점과 다른 ${partners.length}개 점이 한 꼭짓점에서 만납니다.`:'현재 기준점과 따로 겹치는 점은 없습니다.','',true);
    }
    if(t<1.8)return frame(`현재 전개도의 점 ${n}과 이어진 면을 확인합니다.`);
    if(t<5.7)return frame('접는 선을 경첩으로 돌립니다. 각 면의 길이와 각은 바뀌지 않습니다.');
    if(t<7.1)return frame('입체에서 같은 위치에 도착한 점들을 확인합니다.');
    return frame(names.length?`점 ${n}과 ${names.join(', ')}이 한 꼭짓점에서 만납니다.`:`현재 점 ${n}과 따로 겹치는 점은 없습니다.`,'',true);
  }
  function skewPose(d,t){
    const start=clamp(d.s.phFold||0),fold=start+(1-start)*phase(t,.5,2.6);
    return{fold,faces:d.M.net.at(fold)};
  }
  function drawSkew(b,t,d){
    const {G,M}=d,sol=M.sol,{fold,faces}=skewPose(d,t),D=prepare(b,d,faces.flat()),stage=t<2.6?'fold':t<4.3?'meet':t<5.7?'par':t<6.5?'rest':'skew';
    if(fold<.999){
      faces.map((ps,i)=>({i,depth:D.depth(G.cen3(ps))})).sort((a,z)=>z.depth-a.depth).forEach(({i})=>D.panel(faces[i],'sky',.055,'muted',1.7));
      const labelled=new Set();
      faces.forEach((ps,i)=>ps.forEach((p,j)=>{
        const key=M.net.edgeKey(i,j);if(key!==M.ref.key)return;
        const q=ps[(j+1)%ps.length];D.line(p,q,'amber',4.5);
        const center=G.mid3(p,q),signature=[center.x,center.y,center.z].map(v=>v.toFixed(6)).join(',');
        if(!labelled.has(signature)){labelled.add(signature);D.label(center,M.ref.name,{color:'amber',size:16,gap:13});}
      }));
      D.flush();return;
    }
    const visible=new Set();M.net.faceInfo.forEach((f,i)=>{if(D.facing(f.n))M.net.faces[i].poly.forEach((_,j)=>visible.add(M.net.edgeKey(i,j)));});
    const parts=projectedEdgePieces(sol,D,G);
    sol.edges.slice().sort((a,z)=>Number(visible.has(a.key))-Number(visible.has(z.key))).forEach(e=>{
      const r=G.relEdges(sol,M.ref,e),selected=stage==='meet'&&(r==='meet'||r==='ext')||stage==='par'&&r==='par'||stage==='skew'&&r==='skew';
      for(const[a,z]of parts.get(e.key))D.line(a,z,r==='ref'?'amber':selected?(r==='par'?'sky':r==='skew'?'green':'rose'):'muted',r==='ref'?4.5:selected?3.8:1.6,{dash:visible.has(e.key)?undefined:[5,4],alpha:visible.has(e.key)?1:.7});
    });
    D.label(G.mid3(sol.verts[M.ref.u],sol.verts[M.ref.v]),M.ref.name,{color:'amber',size:16});D.flush();
  }
  function projectedEdgePieces(sol,D,G){
    const edges=sol.edges.map(e=>({e,a:D.P(sol.verts[e.u]),z:D.P(sol.verts[e.v]),cuts:[]})),cross=(a,z)=>a.x*z.y-a.y*z.x,sub=(a,z)=>({x:a.x-z.x,y:a.y-z.y});
    for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
      const x=edges[i],y=edges[j];if([x.e.u,x.e.v].some(k=>k===y.e.u||k===y.e.v))continue;
      const u=sub(x.z,x.a),v=sub(y.z,y.a),w=sub(y.a,x.a),den=cross(u,v);if(Math.abs(den)<1e-10)continue;
      const a=cross(w,v)/den,c=cross(w,u)/den;if(a<=.001||a>=.999||c<=.001||c>=.999)continue;
      const depth=(q,t)=>D.depth(G.lerp3(sol.verts[q.e.u],sol.verts[q.e.v],t)),dx=depth(x,a),dy=depth(y,c);if(Math.abs(dx-dy)<1e-8)continue;
      const farther=dx>dy?x:y,t=dx>dy?a:c,L=Math.hypot(farther.z.x-farther.a.x,farther.z.y-farther.a.y)*(D.b.k||50),gap=5/Math.max(1,L);
      farther.cuts.push([Math.max(0,t-gap),Math.min(1,t+gap)]);
    }
    return new Map(edges.map(q=>{let at=0;const intervals=[];for(const[a,z]of q.cuts.sort((a,z)=>a[0]-z[0])){if(a>at)intervals.push([at,a]);at=Math.max(at,z);}if(at<1)intervals.push([at,1]);return[q.e.key,intervals.map(([a,z])=>[G.lerp3(sol.verts[q.e.u],sol.verts[q.e.v],a),G.lerp3(sol.verts[q.e.u],sol.verts[q.e.v],z)])];}));
  }
  function shortestGeometry(d,t){
    const a=d.M.a,initial=clamp(d.s.phFold||0),unfold=phase(t,.8,3.2),angle=Math.PI/2*initial*(1-unfold),r=d.M.r+(.5-d.M.r)*phase(t,3.4,6.2),G=d.G;
    const A=G.v3(0,0,0),E=G.v3(0,a,0),F=G.v3(a,a,0),end=G.v3(a,a+a*Math.cos(angle),a*Math.sin(angle)),H=G.v3(0,a+a*Math.cos(angle),a*Math.sin(angle)),P=G.v3(r*a,a,0);
    return {a,A,E,F,end,H,P,first:[A,G.v3(a,0,0),F,E],second:[E,F,end,H],unfold,r};
  }
  function drawShortest(b,t,d){
    const G=d.G,q=shortestGeometry(d,t),view={...d,s:{...d.s,phYaw:(d.s.phYaw||0)*(1-q.unfold),phPitch:(d.s.phPitch||24)+(90-(d.s.phPitch||24))*q.unfold}},D=prepare(b,view,q.first.concat(q.second));
    D.panel(q.first,'sky',.12,'sky',2.5);D.panel(q.second,'green',.12,'green',2.5);D.line(q.E,q.F,'muted',2,{dash:[5,4]});
    D.path([q.A,q.P,q.end],'rose',3.4);if(t>=3.2)D.line(q.A,q.end,'amber',2.5,{dash:[5,4]});
    [[q.A,'A'],[q.E,'E'],[q.F,'F'],[q.P,'P'],[q.end,'G']].forEach(([p,n])=>{D.dot(p,n==='P'?'rose':'ink',4);D.label(p,n,{color:n==='P'?'rose':'ink',size:15,gap:12});});
    if(t>=6.2){D.tick(q.E,q.P,1,'rose');D.tick(q.P,q.F,1,'rose');}D.flush();
  }
  function sectionWorld(G,B,p){
    const yaw=-Math.PI/6,e1=G.v3(Math.cos(yaw),-Math.sin(yaw),0),e2=G.v3(Math.sin(yaw),Math.cos(yaw),0);
    return G.add3(G.add3(G.mul3(e1,G.dot3(p,B.n)),G.mul3(e2,G.dot3(p,B.u))),G.v3(0,0,G.dot3(p,B.w)));
  }
  function sectionModel(d,vertices=false){
    const {G,M}=d,CS=G.cubeSec,asPoint=p=>G.v3(...p),original=Object.values(CS.POS).map(asPoint);
    if(!vertices){
      const world=p=>sectionWorld(G,M.sec.B,p),cube=G.solidOf(original.map(world)),L=1.45;
      const plane=[[-L,-L],[L,-L],[L,L],[-L,L]].map(([u,w])=>world(G.add3(G.mul3(M.sec.n,M.sec.d),G.add3(G.mul3(M.sec.B.u,u),G.mul3(M.sec.B.w,w)))));
      return{...d,M:{...M,cube,sectionPoints:M.sec.pts.map(world),sectionName:M.name,givenPoints:[],plane}};
    }
    const current=M.sec||M.qsec,cube=G.solidOf(original);
    return{...d,M:{...M,cube,section:current,sectionPoints:current.poly.map(L=>asPoint(CS.pos(L))),sectionName:current.name,givenPoints:current.tri.map(L=>asPoint(CS.pos(L))),givenLetters:current.tri,source:M.sec?'현재 선택':'현재 생성 문제',initialExpansion:M.sec?clamp(d.s.phTe??0):0}};
  }
  function sectionExpansion(d,t){
    const initial=d.M.initialExpansion||0;
    return t<1.7?initial*(1-phase(t,.5,1.6)):phase(t,1.8,5.6);
  }
  function drawSection(b,t,d,method='trace'){
    const{G,M}=d,S=M.cube,points=M.sectionPoints,D=prepare(b,d,S.V.concat(M.plane||[])),n=points.length;
    plain(D,S,G);
    if(M.section){
      const patch=G.cubeSec.patchAt(M.section,sectionExpansion(d,t)).map(p=>G.v3(...p));
      D.panel(patch,'rose',.12,'rose',2.4);
      if(method==='expand'&&M.section.fourth&&t>=1.8&&t<5.6){
        const j=M.section.poly.indexOf(M.section.fourth),goal=points[j];D.dot(patch[j],'amber',6);D.line(patch[j],goal,'amber',2,{dash:[4,4]});
      }
      G.cubeSec.NAMES.split('').forEach(L=>{const p=G.v3(...G.cubeSec.pos(L)),selected=M.givenLetters.includes(L),fourth=t>=5.6&&L===M.section.fourth,color=selected?'amber':fourth?'green':'muted';D.dot(p,color,selected?5.5:3);D.label(p,L,{color,size:selected?16:14,gap:13});});
    }else{
      D.panel(M.plane,'sky',.035,'sky',1.4,{dash:[5,4]});
      if(n>=3)D.panel(points,'rose',.05,'rose',1.2,{dash:[5,4]});
      else if(n===2)D.line(points[0],points[1],'rose',4);
      else if(n===1)D.dot(points[0],'rose',6);
    }
    const progress=n*phase(t,M.section?1.8:.8,5.6);
    points.forEach((p,i)=>{const u=clamp(progress-i);if(u>0){D.line(p,G.lerp3(p,points[(i+1)%n],u),'rose',3.6);D.dot(p,'rose',4);} });
    if(t>=5.6&&n>=3){
      D.panel(points,'rose',.19,'rose',3.4);
      if(M.section?.fourth){const q=G.v3(...G.cubeSec.pos(M.section.fourth));D.dot(q,'green',6);}
      if(method==='shape'&&M.section)points.forEach((p,i)=>{if(M.section.shape.right[i])D.right(p,G.sub3(points[(i+1)%n],p),G.sub3(points[(i+n-1)%n],p),.15,'sky');if(M.section.shape.allEq)D.tick(p,points[(i+1)%n],1,'amber');});
    }
    D.flush();
  }
  function truncationPose(d,u){
    const {G,M}=d,O=M.original,S=M.S;
    const V=S.V.map(p=>{let nearest=O.V[0];for(const q of O.V)if(G.len3(G.sub3(p,q))<G.len3(G.sub3(p,nearest)))nearest=q;return G.lerp3(nearest,p,u);});
    return{...S,V,F:S.F.map(f=>({...f,c:G.cen3(f.i.map(i=>V[i]))}))};
  }
  function drawTruncation(b,t,d,target){
    const{G,M}=d,O=M.original,D=prepare(b,d,O.V),u=phase(t,.9,4.8),S=truncationPose(d,u);
    G.drawPoly(D,O,{face:(_,vis)=>u<.02&&vis?{c:'sky',a:.1}:null,edge:()=>({color:'muted',width:1.4,alpha:u>.98?.35:.8,dash:u>.02?[5,4]:undefined})});
    if(u>.001)G.drawPoly(D,S,{face:(i,vis)=>vis?{c:S.F[i].cut?'rose':'green',a:S.F[i].cut?.22:.1}:null,edge:i=>({color:target==='E'&&S.E[i].f.some(fi=>S.F[fi].cut)?'rose':'ink',width:target==='E'?2.5:1.8})});
    if(t>=4.8&&target==='V'){
      const e=O.E[0],A=O.V[e.a],B=O.V[e.b],u1=G.lerp3(A,B,M.r),u2=G.lerp3(A,B,1-M.r);D.line(A,B,'sky',3,{dash:[4,4]});[u1,u2].forEach(p=>D.dot(p,'amber',6));D.label(G.mid3(u1,u2),'한 모서리 → 새 점 2개',{color:'amber',size:13,gap:17});
    }
    if(t>=4.8&&target==='F'){
      const f=S.F.find(f=>f.cut);D.panel(f.i.map(i=>S.V[i]),'rose',.3,'rose',3);D.label(f.c,'새 면',{color:'rose',size:14,gap:13});
    }
    D.flush();
  }
  const recipes={},registry={},lessonInfo={};
  function add(id,legacyLabel,title,build,draw,describe,given){(recipes[id]||=[]).push({legacyLabel,title,build,draw,describe,given});}
  for(const [target,label]of[['classify','다면체'],['faces','몇면체']])add('p1-0',label,'현재 입체의 면 확인',d=>d,(b,t,d)=>drawClassify(b,t,d,target),(t,d)=>classFrame(t,d,target),d=>`현재 선택: ${d.M.name}`);
  for(const [id,kind]of[['p1-1','prism'],['p1-2','pyr'],['p1-3','fr']])for(const target of ['F','E','V'])add(id,NAMES[target],`${KINDS[kind]}의 ${NAMES[target]} 세기`,d=>d,(b,t,d)=>drawCount(b,t,d,target),(t,d)=>countFrame(t,d,target),d=>`${d.M.name} · 밑면의 변 ${d.M.n}개 · ${NAMES[target]} 구하기`);
  for(const [kind,label]of kinds){
    add('p1-4',label,'현재 밑면 크기로 옆면 확인',d=>({...d,M:d.D.model({...d.s,phK4:kind})}),drawSide,sideFrame,d=>`${d.M.name} · ${Math.min(d.s.phFace,d.M.sides.length)}번 옆면`);
    add('p1-5',label,'면 수에서 밑면 이름 찾기',d=>({...d,M:{...d.M,n:d.M.nn[kind],name:KINDS[kind],S:d.G.solidOfKind(kind,d.M.nn[kind],.5),kind}}),(b,t,d)=>drawCount(b,t,d,'F'),(t,d)=>t<.9?frame(`면이 ${d.M.F}개인 ${KINDS[kind]}를 봅니다.`):t<5.6?frame('밑면과 옆면을 다른 색으로 분리합니다.'):t<7.1?frame(`밑면 ${kind==='pyr'?1:2}개를 빼면 옆면 수가 남습니다.`):frame('옆면 하나마다 밑면의 변 하나가 대응합니다.',`$n=${d.M.F}-${kind==='pyr'?1:2}=${d.M.n}$ · ${d.G.nameOf(kind,d.M.n)}`,true),d=>`${KINDS[kind]} · 전체 면 ${d.M.F}개`);
  }
  add('p1-6','두밑면','두 밑면의 평행과 크기',d=>d,drawBases,(t,d)=>t<1.5?frame('윗밑면과 아랫밑면을 다른 색으로 표시합니다.'):t<4.8?frame('같은 방향의 변을 짝지어 평행을 확인합니다.'):t<7.1?frame('두 밑면의 대응변 길이는 서로 다릅니다.'):frame('두 밑면은 평행하고 모양이 같지만 크기가 달라 합동은 아닙니다.','',true),d=>`${d.M.n}각뿔대 · 현재 절단 비율 ${Math.round(d.M.k*100)}%`);
  add('p1-6','옆면모양','각뿔대의 평행한 두 변',d=>({...d,M:{...d.M,kind:'fr',name:d.G.nameOf('fr',d.M.n)}}),drawSide,sideFrame,d=>`${d.M.n}각뿔대의 옆면`);
  add('p1-6','옆면개수','밑면 한 변에 옆면 한 장',d=>d,drawSideCount,(t,d)=>t<.9?frame('두 밑면을 구별하고 옆면을 찾습니다.'):t<5.6?frame('밑면의 각 변에서 옆면 한 장씩을 셉니다.'):t<7.1?frame('각 변에 대응하는 옆면을 빠짐없이 한 번씩 셌습니다.'):frame('옆면 수는 밑면의 변 수와 같습니다.',`$${d.M.n}\\text{개}$`,true),d=>`밑면이 ${d.M.n}각형인 각뿔대 · 옆면 수 구하기`);
  add('p1-7','공식확인','현재 볼록다면체에서 개수 비교',d=>d,drawEuler,(t,d)=>t<2.6?frame('꼭짓점을 표시해 V를 셉니다.'):t<4.5?frame('면 F를 표시하여 V와 합합니다.'):t<7.1?frame('모서리 E를 센 막대와 비교하면 두 칸이 남습니다.'):frame('현재 볼록다면체에서 오일러 관계를 확인합니다.',`$${d.M.V}-${d.M.E}+${d.M.F}=2$`,true),d=>`${d.M.name} · V−E+F 확인`);
  add('p1-7','공식활용','현재 문제의 빠진 개수 구하기',d=>({...d,M:{...d.M,...d.M.qe,S:d.M.qS,name:d.M.qname,ask:d.M.Q.ask}}),drawEuler,(t,d)=>t<2.6?frame('현재 문제의 입체에서 주어진 두 종류를 확인합니다.'):t<5.2?frame('볼록다면체에서 V−E+F=2 관계를 사용합니다.'):t<7.1?frame('두 막대의 길이가 같도록 빠진 개수를 구합니다.'):frame(`빠진 ${NAMES[d.M.ask]}의 수를 구했습니다.`,`$${d.M.ask}=${d.M[d.M.ask]}\\text{개}$`,true),d=>`${d.M.name} · ${['V','E','F'].filter(x=>x!==d.M.ask).map(x=>`${x}=${d.M[x]}`).join(', ')} · ${d.M.ask}=?`);
  for(const [label,compare]of[['가능한 경우',false],['불가한 경우',true]])add('p2-1',label,compare?'현재 조합을 한 바퀴와 비교':'현재 면들의 각 조각 모으기',d=>d,(b,t,d)=>drawCorner(b,t,d,compare),(t,d)=>cornerFrame(t,d,compare),d=>`${FACE_NAMES[d.M.p]} ${d.M.q}개 · 한 내각 ${d.M.th}°`);
  for(const[target,label]of[['face','면의 모양'],['vertex','모인 면 수']])add('p2-2',label,'현재 정다면체의 한 면과 한 꼭짓점',d=>({...d,M:{...d.M,S:d.G.platS(d.M.k)}}),(b,t,d)=>drawPlatonic(b,t,d,target),(t,d)=>t<.8?frame(`${d.M.I.name}의 ${target==='face'?'한 면':'한 꼭짓점'}을 고릅니다.`):t<5.5?frame(target==='face'?'면의 변을 차례로 표시해 같은 길이임을 확인합니다.':'이 꼭짓점에 닿는 면만 차례로 표시합니다.'):t<7.1?frame(target==='face'?'같은 모양의 정다각형이 모든 면을 이룹니다.':'모든 꼭짓점에서 같은 수의 면이 모입니다.'):frame(target==='face'?`한 면은 ${d.M.I.face}입니다.`:`한 꼭짓점에는 ${d.M.I.q}개 면이 모입니다.`,'',true),d=>`${d.M.I.name} · ${target==='face'?'한 면의 모양':'한 꼭짓점에 모인 면의 수'}`);
  for(const[target,label]of[['reason','이유'],['F','면의 수'],['V','꼭짓점 수']])add('p2-3',label,'정다면체가 아닌 현재 입체 확인',d=>({...d,M:{...d.M,S:exceptionSolid(d),name:d.M.ex==='bi'?'정사면체 두 개를 붙인 입체':'정사각뿔'}}),(b,t,d)=>drawException(b,t,d,target),(t,d)=>t<2.4?frame(d.M.ex==='bi'?'두 정사면체의 합동인 면을 맞대어 붙입니다.':'정사각뿔의 밑면과 옆면을 확인합니다.'):t<6.5?frame(target==='reason'?'각 꼭짓점에 모인 면 수를 비교합니다.':'붙인 안쪽 면과 중복되는 점을 제외하고 겉면의 요소를 셉니다.'):t<7.1?frame(target==='reason'?'면 수가 다른 꼭짓점이 있으므로 정다면체 조건에 맞지 않습니다.':'서로 겹치지 않는 대상을 모두 셌습니다.'):frame(target==='reason'?'모든 꼭짓점에서 같은 수의 면이 모이는 조건을 만족하지 않습니다.':`${NAMES[target]}은 ${d.M.S[target].length}개입니다.`,target==='reason'?'':`$${d.M.S[target].length}\\text{개}$`,true),d=>d.M.name);
  for(const[target,label]of[['E','모서리'],['V','꼭짓점']])add('p2-4',label,'면마다 센 뒤 중복 바로잡기',d=>d,(b,t,d)=>drawIncidence(b,t,d,target),(t,d)=>t<.8?frame(`${d.M.I.name}의 각 면에서 ${NAMES[target]}을 셉니다.`):t<5.6?frame(`면 ${d.M.I.F}개마다 ${d.M.I.p}개씩 포함되지만 같은 ${NAMES[target]}이 여러 면에 닿습니다.`):t<7.1?frame(target==='E'?'모서리 하나는 두 면이 공유하므로 두 번 셌습니다.':`꼭짓점 하나에는 ${d.M.I.q}개 면이 모여 ${d.M.I.q}번 셌습니다.`):frame('같은 대상을 센 횟수로 나눕니다.',`$${target}=${d.M.I.F}\\times${d.M.I.p}\\div${target==='E'?2:d.M.I.q}=${d.M.I[target]}\\text{개}$`,true),d=>`${d.M.I.name} · 한 면은 ${d.M.I.face}`);
  add('p2-5','','면의 중심에서 새 꼭짓점 만들기',d=>({...d,M:{...d.M,dual:d.G.dualOf(d.M.k)}}),(b,t,d)=>drawDual(b,t,d,'V'),(t,d)=>t<2.4?frame('원래 입체의 각 면 중심에 점을 하나씩 찍습니다.'):t<5.7?frame('이웃한 면의 중심끼리 선분으로 이어 새 모서리를 만듭니다.'):t<7.1?frame('새 꼭짓점 수는 원래 면 수와 같습니다.'):frame(`중심을 이으면 ${d.M.dual.name}이 됩니다.`,`$V_{새}=${d.M.dual.T.V.length}$`,true),d=>`${d.M.I.name}의 면 중심 잇기`);
  add('p2-6','','한 꼭짓점의 각으로 가능한 조합 제한',d=>d,drawFive,(t,d)=>t<2.6?frame('한 꼭짓점에는 최소 세 면이 모이고, 각의 합은 360°보다 작아야 합니다.'):t<5.5?frame('정삼각형은 3·4·5개, 정사각형과 정오각형은 3개까지 가능합니다.'):t<7.1?frame('정육각형 이상은 세 내각만으로 360° 이상이 되어 제외됩니다.'):frame('남은 다섯 조합에 대응하는 정다면체가 있습니다.','$3+1+1=5\\text{가지}$',true),d=>`현재 ${FACE_NAMES[d.M.p]} ${d.M.q}개에서 출발해 전체 조합 비교`);
  add('p3-1','종류 수','전개도 모양의 중복을 제외해 세기',d=>d,drawNetCollection,(t,d)=>t<1.8?frame('현재 선택한 여섯 정사각형의 연결 모양을 확인합니다.'):t<5.7?frame('경첩으로 접어 서로 다른 여섯 면을 이루는지 확인합니다.'):t<7.1?frame('회전하거나 뒤집어 같은 모양은 한 가지로 묶습니다. 겹치지 않는 모양만 모읍니다.'):frame('정육면체를 만드는 서로 다른 전개도입니다.',`$${d.G.CUBE_NETS.length}\\text{가지}$`,true),d=>`${d.M.spec.label} · 같은 모양을 중복하지 않고 전체 유형 비교`);
  add('p3-1','겹침 판단','현재 여섯 면의 겹침 확인',d=>d,(b,t,d)=>drawNet(b,t,d,{overlap:true}),(t,d)=>t<1.8?frame('여섯 정사각형이 서로 어떻게 연결되어 있는지 확인합니다.'):t<5.7?frame('붙어 있는 변을 경첩으로 면을 접습니다.'):t<7.1?frame(d.M.net.overlap.some(Boolean)?'접힌 두 면이 같은 자리를 차지합니다.':'접힌 여섯 면이 서로 다른 자리를 차지합니다.'):frame(d.M.net.overlap.some(Boolean)?'면이 겹쳐서 정육면체의 전개도가 아닙니다.':'면이 겹치지 않고 정육면체를 만듭니다.','',true),d=>`현재 선택한 ${d.M.spec.label}`);
  for(const id of ['p3-2','p3-5'])add(id,'겹치는 점','현재 문제의 점을 따라 접기',d=>bindVertex(d),(b,t,d)=>drawNet(b,t,d),vertexFrame,d=>`현재 문제 전개도 · 점 ${d.M.net.ptName[d.M.point]}과 겹치는 점`);
  for(const[target,label]of[['parallel','평행한 면'],['perpendicular','수직인 면']])add('p3-3',label,'현재 기준 면의 위치 관계',d=>{const ref=d.M.fR,net=d.M.net;return{...d,M:{...d.M,refFace:ref,paired:target==='parallel'?[net.opposite[ref]]:net.faces.map((_,i)=>i).filter(i=>i!==ref&&i!==net.opposite[ref])}};},(b,t,d)=>drawNet(b,t,d,{faceNames:true}),(t,d)=>t<1.8?frame('노란 기준 면과 전개도의 연결 순서를 확인합니다.'):t<5.7?frame('면을 접으면서 기준 면과 만나는 방향을 봅니다.'):t<7.1?frame(target==='parallel'?'마주 보는 두 면은 만나지 않고 평행합니다.':'맞은편 면을 제외한 네 면은 기준 면과 직각으로 만납니다.'):frame(`${target==='parallel'?'평행한':'수직인'} 면: ${d.M.paired.map(i=>String.fromCharCode(65+d.M.net.num[i]-1)).join(', ')}`,'',true),d=>`현재 전개도의 기준 면 ${String.fromCharCode(65+d.M.net.num[d.M.refFace]-1)}`);
  for(const[i,label]of[[0,'정육면체'],[1,'정사면체'],[2,'정팔면체']])add('p3-4',label,'만남과 평행을 제외해 꼬인 모서리 찾기',d=>({...d,M:d.D.model({...d.s,phSolid:i,phNet:(d.s.phSolid||0)===i?d.s.phNet:0})}),drawSkew,(t,d)=>t<.5?frame('현재 접힘과 노란 기준 모서리를 확인합니다.'):t<2.6?frame('접는 선을 축으로 면을 회전시켜 완성된 입체에서 위치 관계를 살핍니다.'):t<4.3?frame('기준 모서리와 만나거나 연장하면 만나는 모서리를 먼저 제외합니다.'):t<5.7?frame('다음으로 평행한 모서리를 제외합니다.'):t<6.5?frame('같은 모서리도 빼고 남은 모서리들의 위치를 확인합니다.'):t<7.1?frame('남은 직선은 만나지 않고 평행하지 않아 꼬인 위치입니다.'):frame(`꼬인 위치의 모서리는 ${d.M.c.nSkew}개입니다.`,`$${d.M.c.total}-1-${d.M.c.nMeet+d.M.c.nExt}-${d.M.c.nPar}=${d.M.c.nSkew}$`,true),d=>`${label} · 현재 기준 모서리 ${d.M.ref.name}`);
  for(const[index,label]of[[0,'정팔면체'],[3,'정십이면체'],[4,'정이십면체']])add('p3-6',label,'선택한 정다면체의 점을 따라 접기',d=>bindVertex({...d,M:d.D.model({...d.s,phNet:index===0&&d.s.phNet<3?d.s.phNet:index})},false),(b,t,d)=>drawNet(b,t,d),vertexFrame,d=>`${label} · ${d.M.net.ptName[d.M.point]?`점 ${d.M.net.ptName[d.M.point]}`:'노란 기준점'}과 겹치는 점`);
  for(const[target,label]of[['point','지나는 점'],['length','EP 길이']])add('p3-7',label,'두 면을 펼쳐 꺾인 길을 직선으로',d=>d,drawShortest,(t,d)=>t<3.2?frame('접는 선을 경첩으로 두 면을 펼칩니다. 면 위의 길이는 변하지 않습니다.'):t<6.2?frame('A와 G 사이를 직선으로 이어 가장 짧은 길을 찾습니다.'):t<7.1?frame('같은 크기 두 정사각형의 대칭으로 EF의 가운데를 지납니다.'):frame(target==='point'?'최단 경로는 EF의 중점을 지납니다.':'한 변을 반으로 나눈 길이입니다.',target==='point'?'$EP=PF$':`$EP=${d.M.a}\\div2=${d.M.a/2}\\;\\mathrm{cm}$`,true),d=>`현재 모서리 ${d.M.a} cm · 처음 EP=${Math.round(d.M.ep*100)/100} cm`);
  add('p3-8','맞은편 눈','현재 주사위 문제의 맞은편 면 찾기',d=>{const net=d.M.qn,hidden=d.M.hid,opposite=net.opposite[hidden];return{...d,M:{...d.M,net,values:d.M.qv,hidden,refFace:hidden,paired:[opposite],opposite}};},(b,t,d)=>drawNet(b,t,d,{faceNames:true,dice:true}),(t,d)=>t<1.8?frame('현재 문제의 물음표 면을 기준으로 전개도를 봅니다.'):t<5.7?frame('면을 접어 물음표와 마주 보는 면을 찾습니다.'):t<7.1?frame(`마주 보는 면의 눈 ${d.M.values[d.M.opposite]}과 합하면 7입니다.`):frame('전체 7에서 맞은편 눈을 뺍니다.',`$7-${d.M.values[d.M.opposite]}=${d.M.values[d.M.hidden]}$`,true),d=>`현재 생성된 주사위 전개도 · 마주 보는 눈의 합 7`);
  add('p4-1','','현재 평면과 여섯 면의 교선 잇기',d=>sectionModel(d),(b,t,d)=>drawSection(b,t,d),(t,d)=>t<.8?frame('현재 위치와 방향의 절단 평면을 확인합니다.'):d.M.sectionPoints.length<3?(t<7.1?frame('평면이 입체와 만나는 점 또는 선분에는 넓이가 없습니다.'):frame(`${d.M.sectionName} — 넓이가 있는 다각형 단면은 생기지 않습니다.`,'',true)):t<5.6?frame('정육면체의 각 면에서 평면과 만나는 선분을 차례로 잇습니다.'):t<7.1?frame('이어진 경계의 변을 세어 단면의 모양을 정합니다.'):frame(`단면은 변이 ${d.M.sectionPoints.length}개인 ${d.M.sectionName}입니다.`,'',true),d=>`현재 방향 ${d.s.phTa}°, ${d.s.phTb}° · 단면판 위치 ${Math.round(d.s.phTd*100)}%`);
  for(const[method,label]of[['trace','A·G·H'],['expand','B·D·E'],['shape','A·B·C']])add('p4-3',label,method==='trace'?'현재 세 점에서 면마다 교선 찾기':method==='expand'?'현재 세 점의 평면 넓히기':'현재 단면의 변과 각 확인',d=>sectionModel(d,true),(b,t,d)=>drawSection(b,t,d,method),(t,d)=>t<.8?frame('선택한 세 점은 하나의 평면을 정합니다.'):t<1.8&&d.M.initialExpansion>0?frame('현재 넓힌 부분에서 출발하여 세 점을 이은 삼각형을 다시 구분합니다.'):t<5.6?frame(method==='expand'?'세 점을 이은 삼각형에서 같은 평면을 넓혀 입체 표면까지 확인합니다.':'같은 면 위에 있는 교선을 이어 절단 평면 전체의 경계를 찾습니다.'):t<7.1?frame(d.M.section.fourth?`같은 평면에 있는 넷째 점 ${d.M.section.fourth}도 포함해야 합니다.`:'세 점 외에 경계에 추가되는 꼭짓점이 없습니다.'):frame(`전체 단면은 ${d.M.section.label}입니다.`,'',true),d=>`${d.M.source} ${d.M.givenLetters.join('·')} · 세 점을 지나는 평면`);
  for(const target of ['F','V','E'])add('p4-2',NAMES[target],`잘라 낸 입체의 ${NAMES[target]} 대응`,d=>({...d,M:{...d.M,original:d.G.platS(d.M.k)}}),(b,t,d)=>drawTruncation(b,t,d,target),(t,d)=>t<.9?frame('현재 정다면체의 모든 꼭짓점을 같은 비율로 자릅니다.'):t<4.8?frame('각 꼭짓점 주변에 새 면이 생기고 원래 모서리의 양 끝이 잘립니다.'):t<7.1?frame(target==='F'?'원래 면은 남고, 원래 꼭짓점마다 새 면 한 개가 추가됩니다.':target==='V'?'원래 모서리마다 양쪽 끝에 새 꼭짓점 두 개가 생깁니다.':'원래 모서리가 잘려 남은 선과 새 절단면의 변을 따로 셉니다.'):frame(`${NAMES[target]}의 개수를 원래 요소와 대응해 구합니다.`,target==='F'?`$F=${d.M.I.F}+${d.M.I.V}=${d.M.c.F}$`:target==='V'?`$V=2\\times${d.M.I.E}=${d.M.c.V}$`:`$E=${d.M.I.E}+2\\times${d.M.I.E}=${d.M.c.E}$`,true),d=>`${d.M.I.name} · 모서리의 ${Math.round(d.M.r*10000)/100}%만큼 양 끝 절단`);
  for(const[target,label]of[['V','입체·꼭짓점'],['F','새 면'],['E','새 모서리']])add('p4-4',label,'원래 요소와 새 입체 요소의 대응',d=>({...d,M:{...d.M,dual:d.G.dualOf(d.M.k)}}),(b,t,d)=>drawDual(b,t,d,target),(t,d)=>t<2.4?frame('각 면 중심을 새 꼭짓점으로 표시합니다.'):t<5.7?frame('원래 모서리를 공유하는 두 면의 중심을 연결합니다.'):t<7.1?frame(target==='V'?'원래 면 하나마다 새 꼭짓점 하나가 생깁니다.':target==='F'?'원래 꼭짓점 주변의 면 중심을 이으면 새 면 한 개를 이룹니다.':'원래 모서리 하나를 사이에 둔 두 중심은 새 모서리 하나로 이어집니다.'):frame(target==='V'?`${d.M.dual.name}이 만들어집니다.`:'원래 입체와 새 입체의 요소가 하나씩 대응합니다.',`$${target}_{\\text{새}}=${target==='V'?d.M.dual.S.F.length:target==='F'?d.M.dual.S.V.length:d.M.dual.S.E.length}$`,true),d=>`${d.G.PLAT[d.M.k].name}의 면 중심을 이어 ${NAMES[target]} 구하기`);
  for(const[id,rows]of Object.entries(recipes)){
    const key=`g7-polyhedra/${id}`;lessonInfo[key]=rows.map(r=>({legacyLabel:r.legacyLabel,duration:9.4}));
    registry[key]=(lab,state)=>{const source=bind(id,lab,state);if(!source)return[];return rows.map((r,i)=>{const d=r.build(source);if(d.M.net){const closed=d.M.net.at(1);d.netSigns=closed.map((ps,j)=>Math.sign(d.G.dot3(d.G.cross3(d.G.sub3(ps[1],ps[0]),d.G.sub3(ps[2],ps[0])),d.M.net.faceInfo[j].n))||1);}return{id:`polyhedra-${id}-${i}`,label:id==='p2-1'||id==='p4-3'?r.title:r.legacyLabel||'그림으로 풀이',legacyLabel:r.legacyLabel,title:r.title,duration:9.4,stops:[.8,2.6,4.5,5.6,7.1],model:d,given:r.given(d),draw:r.draw,frame:r.describe};});};
  }
  return {bind,groups,countPose,facingFace,cornerPolygons,incidenceCounts,exceptionSolid,netPoint,matchingPoints,netFold,skewPose,projectedEdgePieces,shortestGeometry,sectionWorld,sectionModel,sectionExpansion,truncationPose,prepare,plain,recipes,registry,lessonInfo};
});
