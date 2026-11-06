/* 중1 겉넓이·부피: 실전 기본 결합 입체 3종. 기존 26장면은 변경하지 않음. */
(function basicJoinedLab() {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { PI, DEG, TAU, P, V, vadd, vsub, vmul, vnum, tx, plainVal,
    clamp, ease, lin01, rint, pick, mkV, rd, notes, scene3,
    v3, add3, mul3, boxMesh, revolveMesh, sphereProfile, polyMesh,
    xfMesh, shiftT, bboxOf } = G;
  const TYPES = {
    hemi: { name: '원기둥 + 반구', lower: '원기둥', upper: '반구' },
    cone: { name: '원기둥 + 원뿔', lower: '원기둥', upper: '원뿔' },
    pyramid: { name: '사각기둥 + 사각뿔', lower: '사각기둥', upper: '사각뿔' }
  };
  const PARAMS = {
    jcK: P('모형의 크기', 1, 3, 1, 1,
      { color: 'amber', format: v => `${v}배` }),
    jcH: P('아래 기둥 높이', 2, 14, 1, 5,
      { color: 'sky', format: v => `${v} cm` }),
    jcT: P('붙은 면 확인 · 펼치기', 0, 1, 0.01, 0,
      { color: 'green', format: v => v < 0.02 ? '붙어 있음' :
        v > 0.98 ? '면 넓이 비교' : `${Math.round(v * 100)}%` })
  };
  const kindOf = s => Object.prototype.hasOwnProperty.call(TYPES, s.jcKind) ? s.jcKind : 'hemi';
  const model = s => {
    const kind = kindOf(s), mode = s.jcMode === 'vol' ? 'vol' : 'surf';
    const k = clamp(Math.round(s.jcK || 1), 1, 3);
    const h = clamp(Math.round(s.jcH || 5), 2, 14);
    s.jcK = k; s.jcH = h;
    // 3:4:5 비례로 원뿔의 모선과 사각뿔의 옆면 높이를 모두 정수로 유지.
    const r = 3*k, a = 6*k, topH = 4*k, l = 5*k;
    const square = kind === 'pyramid';
    const join = square ? V(a*a) : V(0,r*r);
    const lowerSide = square ? V(4*a*h) : V(0,2*r*h);
    const upperSide = kind === 'hemi' ? V(0,2*r*r) :
      kind === 'cone' ? V(0,r*l) : V(2*a*l);
    const lowerSurface = vadd(vmul(join,2), lowerSide);
    const upperSurface = vadd(join,upperSide);
    const hidden = vmul(join,2);
    const surface = vsub(vadd(lowerSurface,upperSurface),hidden);
    const lowerVolume = square ? V(a*a*h) : V(0,r*r*h);
    const upperVolume = kind === 'hemi' ? V(0,2*r*r*r/3) :
      kind === 'cone' ? V(0,r*r*topH/3) : V(a*a*topH/3);
    const volume = vadd(lowerVolume,upperVolume);
    return {kind,mode,k,h,r,a,topH,l,started:!!s.jcStarted,join,lowerSide,upperSide,
      lowerSurface,upperSurface,hidden,surface,lowerVolume,upperVolume,
      volume,ans:mode==='vol'?volume:surface,...TYPES[kind]};
  };
  // 바깥 면을 실제 경첩으로 펼칩니다. 원래 입체와 같은 눈금으로 고정합니다.
  function drawJoinedUnfold(b,s,M,C,t) {
    const square=M.kind==='pyramid',cone=M.kind==='cone',r=M.r,h=M.h,a=M.a,H=M.topH,N=32,e=ease(t),src=scene3(b,s,C);
    const sn=square?G.solidNet([[-a/2,-a/2],[a/2,-a/2],[a/2,a/2],[-a/2,a/2]],h,1,[false,false,false,false],2):G.solidNet(G.circleBase(r,N),h,1,Array(N).fill(true),N/2);
    if(square){
      const pieces=sn.net.pieces,apex=v3(0,h+H,0);
      for(let k=0;k<4;k++){
        const p=sn.B[k],q=sn.B[(k+1)%4],pts=[p,q,apex];
        let n=G.unit3(G.cross3(G.sub3(q,p),G.sub3(apex,p)));
        if(G.dot3(n,G.sub3(G.centroid(pts),v3(0,h+H/3,0)))<0)n=mul3(n,-1);
        const ix=pieces.length;pieces.push({pts,n,tag:'roof',parent:sn.lat[k],hinge:[p,q],edges:[{i:0,kind:'c',nb:sn.lat[k]},{i:1,kind:'c'},{i:2,kind:'c'}]});
        pieces[sn.lat[k]].edges[2].nb=ix;
      }
      sn.net=G.netBuild(pieces,sn.root);
    }
    const snCone=cone?G.solidNet(G.circleBase(r,N),H,0,Array(N).fill(true),N/2):null;
    function frameFor(net,skip,u){
      const cam=G.camOf((s.svYaw==null?28:s.svYaw)*(1-u),(s.svPitch==null?24:s.svPitch)*(1-u));
      const pose=G.netPose(net,u), points=[];
      net.pieces.forEach((pc,k)=>{if(pc.tag!==skip)pc.pts.forEach(p=>points.push(G.proj(cam,G.applyT(pose[k],p))));});
      const box=bboxOf(points), cx=(box.x0+box.x1)/2,cy=(box.y0+box.y1)/2;
      return {pose,cam,cx,cy,box};
    }
    const netFrame=u=>frameFor(sn.net,'top',u), coneFrame=u=>frameFor(snCone.net,'bot',u);
    const frames=Array.from({length:9},(_,i)=>netFrame(i/8)), cframes=cone?Array.from({length:9},(_,i)=>coneFrame(i/8)):[];
    const maxW=Math.max(...frames.map(f=>f.box.x1-f.box.x0)),maxH=Math.max(...frames.map(f=>f.box.y1-f.box.y0));
    const coneW=cone?Math.max(...cframes.map(f=>f.box.x1-f.box.x0)):0, coneH=cone?Math.max(...cframes.map(f=>f.box.y1-f.box.y0)):0;
    const totalW=maxW+(cone?coneW+3:0), mainX=cone?-(coneW+3)/2:0, coneX=cone?(maxW+3)/2:0;
    const extent=square?a/2:r, cap=(square||cone)?H:r, O=src.hx(-totalW/2-extent-1.4), sourcePts=[];
    for(const x of [-extent,extent])for(const z of [-extent,extent])for(const y of [-h/2,h/2+cap])sourcePts.push(src.P(add3(O,v3(x,y,z))));
    const sb=bboxOf(sourcePts), sy=-(sb.y0+sb.y1)/2;
    const hemiTop=(!square&&!cone)?-maxH/2-2*r-1.5:0;
    const hideRef=b.W<560, left=(hideRef ? -totalW/2 : Math.min(-totalW/2,sb.x0))-1,right=totalW/2+1,top=Math.min(-maxH/2,-coneH/2,sb.y0+sy,hemiTop)-1,bottom=Math.max(maxH/2,coneH/2,sb.y1+sy)+1.5;
    src.fit([], [{x:left,y:top},{x:right,y:bottom}],{l:30,r:(!b.thumb&&window.innerWidth>=700&&b.W>=560?245:30),t:40,b:35});
    const prev=src.P;src.P=p=>{const q=prev(p);return {x:q.x,y:q.y+sy};};
    if(!hideRef) {
    const joint=add3(O,v3(0,h/2,0));
    if(square){
      const base=xfMesh(boxMesh(-a/2,a/2,-h/2,h/2,-a/2,a/2),shiftT(O));
      const q=[v3(-a/2,h/2,-a/2),v3(a/2,h/2,-a/2),v3(a/2,h/2,a/2),v3(-a/2,h/2,a/2)], apex=v3(0,h/2+H,0),faces=[{pts:q.slice().reverse(),tag:'bot'}];
      for(let i=0;i<4;i++)faces.push({pts:[q[i],q[(i+1)%4],apex],tag:'side'});
      const roof=xfMesh(polyMesh(faces,v3(0,h/2+H/3,0)),shiftT(O));
      const back=e=>Math.abs(e.a.y-joint.y)<1e-6&&Math.abs(e.b.y-joint.y)<1e-6&&((e.a.x+e.b.x-2*O.x)*src.vw.x+(e.a.z+e.b.z-2*O.z)*src.vw.z)<0;
      src.body({mesh:base,fill:'sky',alpha:.04,edge:'ink',edgeW:2,edgeFn:e=>back(e)?{skip:true}:{},faceStyle:f=>f.tag==='top'?{skip:true}:{}});
      src.body({mesh:roof,fill:'sky',alpha:.04,edge:'ink',edgeW:2,edgeFn:e=>back(e)?{skip:true}:{},faceStyle:f=>f.tag==='bot'?{skip:true}:{}});
      for(let i=0;i<4;i++){const p=add3(q[i],O),v=add3(q[(i+1)%4],O);if(back({a:p,b:v}))src.line(p,v,'ink',1.7,{dash:[5,4],alpha:.7});}
    }else{
      const cylinder=revolveMesh([[0,0],[r,0],[r,h],[0,h]],{O:add3(O,v3(0,-h/2,0)),N:48,tags:['bot','side','top']});
      const dome=cone?revolveMesh([[0,0],[r,0],[0,H]],{O:joint,N:48,tags:['bot','side']}):revolveMesh([[0,0],[r,0],...sphereProfile(r,0,90,48).slice(1)],{O:joint,N:48,tags:['bot']});
      const dash=e=>e.chain&&Math.abs(e.a.y-joint.y)<1e-6?joint:null;
      src.body({mesh:cylinder,fill:'sky',alpha:.04,edge:'ink',edgeW:2,dashBack:dash,faceStyle:f=>f.tag==='top'?{skip:true}:{}});
      src.body({mesh:dome,fill:'sky',alpha:.04,edge:'ink',edgeW:2,dashBack:dash,faceStyle:f=>f.tag==='bot'?{skip:true}:{}});
    }
    const foot=src.P(add3(O,v3(0,-h/2,0)));b.text({x:foot.x,y:sb.y1+sy+0.9},'원래 입체',{size:src.fs(14),color:'ink',weight:700});
    }
    const f=netFrame(e), nd=scene3(b,s,C,{yaw:(s.svYaw==null?28:s.svYaw)*(1-e),pitch:(s.svPitch==null?24:s.svPitch)*(1-e)}), np=nd.P;
    nd.P=p=>{const q=np(p);return {x:q.x-f.cx+mainX,y:q.y-f.cy};};
    G.netDraw(nd,sn.net,f.pose,pc=>pc.tag==='top'?{skip:true}:{fill:'sky',alpha:.07,edge:'ink',ew:2});
    if(e>0.99){
      // 원통의 매끈한 이음매 중 양쪽 끝은 펼친 뒤 바깥 경계가 됩니다.
      const lp=sn.lat.flatMap(k=>sn.net.pieces[k].pts.map(p=>nd.P(G.applyT(f.pose[k],p))));
      const q=bboxOf(lp);
      b.path([{x:q.x0,y:q.y0},{x:q.x0,y:q.y1}],{color:'ink',width:2});
      b.path([{x:q.x1,y:q.y0},{x:q.x1,y:q.y1}],{color:'ink',width:2});
      b.text({x:(q.x0+q.x1)/2,y:(q.y0+q.y1)/2},square?'사각기둥 옆면':'원기둥 옆면',{size:nd.fs(14),color:'ink',weight:700});
      if(!square)b.text({x:(q.x0+q.x1)/2,y:q.y0-0.5},`밑면의 둘레 ${plainVal(V(0,2*r))}` ,{size:nd.fs(13),color:'ink',weight:700});
      b.text({x:q.x0-0.35,y:(q.y0+q.y1)/2},String(h),{size:nd.fs(14),color:'ink',weight:700});
      const bot=sn.net.pieces[sn.bot], bc=nd.P(G.applyT(f.pose[sn.bot],G.centroid(bot.pts)));
      if(!square){
      const rim=bot.pts.map(p=>nd.P(G.applyT(f.pose[sn.bot],p))).reduce((a,p)=>p.x>a.x?p:a);
      b.path([bc,rim],{color:'ink',width:1.4});
      b.text({x:(bc.x+rim.x)/2,y:bc.y-0.3},String(r),{size:nd.fs(13),color:'ink',weight:700});
      b.text({x:bc.x,y:bc.y+r+1.05},'아랫면',{size:nd.fs(13),color:'ink',weight:700});
      } else b.text(bc,'아랫면',{size:nd.fs(13),color:'ink',weight:700});
    }
    if(!square&&!cone){
      // 구의 곡면은 평면 전개도가 아니므로 반구를 입체로 남겨 둡니다.
      const hd=scene3(b,s,C), hp=hd.P, dome=revolveMesh([[0,0],[r,0],...sphereProfile(r,0,90,48).slice(1)],{O:v3(0,0,0),N:48,tags:['bot']});
      const hb=bboxOf(dome.faces.flatMap(face=>face.pts.map(p=>hp(p))));
      const hx=(hb.x0+hb.x1)/2, hy=(hb.y0+hb.y1)/2, targetY=-maxH/2-r-0.8;
      // 전개 전에는 반구 밑면 중심을 원기둥 윗면 중심에 맞추고, 전개가 진행되며 위로 분리합니다.
      const base=hp(v3(0,0,0)), joint2=nd.P(G.applyT(f.pose[sn.root],v3(0,h,0)));
      const dx0=joint2.x-base.x, dy0=joint2.y-base.y, dx1=mainX-hx, dy1=targetY-hy;
      hd.P=p=>{const q=hp(p);return{x:q.x+dx0*(1-e)+dx1*e,y:q.y+dy0*(1-e)+dy1*e};};
      hd.body({mesh:dome,fill:'sky',alpha:.05,edge:'ink',edgeW:2,faceStyle:f=>f.tag==='bot'?{skip:true}:{}});
      if(e>.99)b.text({x:mainX,y:targetY-r-0.3},'반구의 곡면',{size:hd.fs(13),color:'ink',weight:700});
    }
    if(cone){
      const cf=coneFrame(e), cd=scene3(b,s,C,{yaw:(s.svYaw==null?28:s.svYaw)*(1-e),pitch:(s.svPitch==null?24:s.svPitch)*(1-e)}), cp=cd.P;
      cd.P=p=>{const q=cp(p);return {x:q.x-cf.cx+coneX,y:q.y-cf.cy};};
      G.netDraw(cd,snCone.net,cf.pose,pc=>pc.tag==='bot'?{skip:true}:{fill:'sky',alpha:.07,edge:'ink',ew:2});
      if(e>0.99){
        // 전개도에서 이웃하지 않는 잘린 변만 외곽으로 남깁니다.
        const edges=new Map(), key=p=>`${Math.round(p.x*1e4)},${Math.round(p.y*1e4)}`;
        snCone.lat.forEach(k=>{const pts=snCone.net.pieces[k].pts.map(p=>cd.P(G.applyT(cf.pose[k],p)));for(let j=0;j<pts.length;j++){const p=pts[j],q=pts[(j+1)%pts.length],ka=key(p),kb=key(q),id=ka<kb?ka+'|'+kb:kb+'|'+ka,old=edges.get(id);if(old)old.n++;else edges.set(id,{p,q,n:1});}});
        edges.forEach(v=>{if(v.n===1)b.path([v.p,v.q],{color:'ink',width:2});});
        b.text({x:coneX,y:cf.box.y1-cf.cy+0.7},'원뿔 옆면',{size:cd.fs(13),color:'ink',weight:700});
      }
    }

  }
  const draw = (b,s,M,C) => {
    const D = scene3(b,s,C), square = M.kind==='pyramid';
    const width = square?M.a:2*M.r, capHeight = M.kind==='hemi'?M.r:M.topH;
    const scale = 4 / Math.max(width,M.h+capHeight);
    const w=width*scale,r=M.r*scale,a=M.a*scale,h=M.h*scale,
      topH=M.topH*scale,y0=-h/2,yj=h/2;
    const t=C.problem||(!s.jcStarted&&C.tab==='explore')?0:C.t, open=ease(lin01(t,0,0.55));
    if(M.mode==='surf' && (s.jcStarted||C.tab!=='explore') && !C.problem && !b.thumb) { drawJoinedUnfold(b,s,M,C,t); return; }
    const shift=D.hx(open*w*1.35), unfolded=ease(lin01(t,0.48,1));
    const narrow=b.W<560, showSolid=true;
    const base = square ? boxMesh(-a/2,a/2,y0,yj,-a/2,a/2) :
      revolveMesh([[0,0],[r,0],[r,h],[0,h]],
        {O:v3(0,y0,0),N:44,tags:['bot','side','top']});
    let top;
    if (M.kind==='hemi') top=revolveMesh([[0,0],[r,0],
      ...sphereProfile(r,0,90,48).slice(1)],
      {O:v3(0,yj,0),N:44,tags:['bot']});
    else if(M.kind==='cone') top=revolveMesh(
      [[0,0],[r,0],[0,topH]],{O:v3(0,yj,0),N:44,tags:['bot','side']});
    else {
      const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),
        v3(a/2,yj,a/2),v3(-a/2,yj,a/2)];
      const apex=v3(0,yj+topH,0),faces=[{pts:q.slice().reverse(),tag:'bot'}];
      for(let i=0;i<4;i++)faces.push({pts:[q[i],q[(i+1)%4],apex],tag:'side'});
      top=polyMesh(faces,v3(0,yj+topH*0.3,0));
    }
    top=xfMesh(top,shiftT(shift));
    const pts=[v3(-w/2,y0,-w/2),v3(w/2,y0,w/2),
      v3(-w/2,yj,w/2),v3(w/2,yj,-w/2),
      add3(v3(-w/2,yj,-w/2),shift),
      add3(v3(w/2,yj+capHeight*scale,w/2),shift)];
    for(const x of [-w/2,w/2]) for(const z of [-w/2,w/2]) {
      pts.push(add3(v3(x,yj,z),shift), add3(v3(x,yj+capHeight*scale,z),shift));
    }
    if(!s.jcStarted && C.tab==='explore' && !b.thumb){
      D.fit(pts,[],{l:60,r:60,t:60,b:65});
      const hiddenJoin=e=>square&&Math.abs(e.a.y-yj)<1e-6&&Math.abs(e.b.y-yj)<1e-6&&((e.a.x+e.b.x)*D.vw.x+(e.a.z+e.b.z)*D.vw.z)<0;
      const jointDash=e=>!square&&Math.abs(e.a.y-yj)<1e-6?v3(0,yj,0):null;
      D.body({mesh:base,fill:'sky',alpha:.03,edge:'ink',edgeW:2,dashBack:jointDash,edgeFn:e=>hiddenJoin(e)?{skip:true}:{},faceStyle:f=>f.tag==='top'?{skip:true}:{}});
      D.body({mesh:top,fill:'sky',alpha:.03,edge:'ink',edgeW:2,dashBack:jointDash,edgeFn:e=>hiddenJoin(e)?{skip:true}:{},faceStyle:f=>f.tag==='bot'?{skip:true}:{}});
      if(square){const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),v3(a/2,yj,a/2),v3(-a/2,yj,a/2)];for(let i=0;i<4;i++){const e={a:q[i],b:q[(i+1)%4]};if(hiddenJoin(e))D.line(e.a,e.b,'ink',1.7,{dash:[5,4],alpha:.7});}}
      return;
    }
    const miniScale=1, miniOff=D.hx(-w*1.5), miniT={R:[[miniScale,0,0],[0,miniScale,0],[0,0,miniScale]],t:miniOff};
    if(C.tab==='explore' && !C.problem && !narrow) for(const x of [-w/2,w/2]) for(const z of [-w/2,w/2])
      for(const y of [y0,yj+capHeight*scale]) pts.push(G.applyT(miniT,v3(x,y,z)));
    const bb=bboxOf(pts.map(D.P)),rowTop=showSolid ? bb.y1+0.8 : -2.0;
    const emphBase=C.review&&(C.step===1||C.step===2)?2:1;
    const emphTop=C.review&&C.step===3?2:1;
    let rows=null;
    if(!C.problem&&M.mode==='surf'){
      const lower=square?[
        {w:M.a,h:M.h,shape:'rect',count:4,fill:'sky',
          label:String(M.a*M.h),cap:'기둥 옆면 ×4',hl:emphBase},
        {w:M.a,h:M.a,shape:'rect',fill:'sky',
          label:String(M.a*M.a),cap:'아랫면',hl:emphBase}
      ]:[
        {w:2*PI*M.r,h:M.h,shape:'rect',fill:'sky',
          label:plainVal(M.lowerSide),cap:'기둥 옆면',hl:emphBase},
        {w:2*M.r,h:2*M.r,shape:'circle',fill:'sky',
          label:plainVal(M.join),cap:'아랫면 원',hl:emphBase}
      ];
      let upper;
      if(M.kind==='hemi'){
        upper={w:2*M.r,h:2*M.r,shape:'circle',count:2,fill:'green',
          label:plainVal(M.join),cap:'반구 곡면 = 원 2개 넓이',hl:emphTop};
      } else if(M.kind==='cone'){
        upper={w:2*M.l,h:2*M.l,shape:'sector',deg:216,fill:'green',
          label:plainVal(M.upperSide),cap:'원뿔 옆면 부채꼴',hl:emphTop};
      } else {
        upper={w:M.a,h:M.l,shape:'poly',
          pts:[[0,1],[0.5,0],[1,1]],count:4,fill:'green',
          label:String(M.a*M.l/2),cap:'뿔 옆면 삼각형 ×4',hl:emphTop};
      }
      rows=G.layoutTileRows([lower,[upper]],narrow?4.3:6.5,2,1.4,2);
    }
    const bars=null; // 부피는 막대 대신 실제 분해된 입체를 보여줍니다.
    const reg=rows?[{x:-rows.total/2,y:rowTop},
      {x:rows.total/2,y:rowTop+rows.height+2.3}]:
      bars?[{x:-3,y:rowTop},{x:3,y:rowTop+2.4}]:[];
    D.fit(showSolid?pts:[],unfolded>0.06&&reg.length?reg:[],
      {l:C.problem?22:(narrow?25:45),r:(!C.problem && !b.thumb && window.innerWidth>=700 && b.W>=560 ? 245 : (C.problem?22:(narrow?25:45))),t:C.problem?24:(narrow?30:65),b:C.problem?24:(narrow?30:65)});
    if(showSolid){
      if(C.tab==='explore' && !C.problem && !narrow){
        const miniBase=xfMesh(base,miniT), miniTop=xfMesh(xfMesh(top,shiftT(mul3(shift,-1))),miniT);
        const miniJoint=G.applyT(miniT,v3(0,yj,0));
        const miniDash=e=>!square&&e.chain&&Math.abs(e.a.y-miniJoint.y)<1e-6?miniJoint:null;
        const miniHidden=e=>square&&Math.abs(e.a.y-miniJoint.y)<1e-6&&Math.abs(e.b.y-miniJoint.y)<1e-6&&((e.a.x+e.b.x-2*miniJoint.x)*D.vw.x+(e.a.z+e.b.z-2*miniJoint.z)*D.vw.z)<0;
        D.body({mesh:miniBase,fill:'sky',alpha:0.03,edge:'ink',edgeW:1.8,dashBack:miniDash,edgeFn:e=>miniHidden(e)?{skip:true}:{},faceStyle:f=>f.tag==='top'?{skip:true}:{}});
        D.body({mesh:miniTop,fill:'sky',alpha:0.03,edge:'ink',edgeW:1.8,dashBack:miniDash,edgeFn:e=>miniHidden(e)?{skip:true}:{},faceStyle:f=>f.tag==='bot'?{skip:true}:{}});
        if(square){const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),v3(a/2,yj,a/2),v3(-a/2,yj,a/2)].map(p=>G.applyT(miniT,p));for(let i=0;i<4;i++){const e={a:q[i],b:q[(i+1)%4]};if(miniHidden(e))D.line(e.a,e.b,'ink',1.6,{dash:[5,4],alpha:.7});}}
        const source=D.P(miniOff), target=D.P(v3(0,0,0)), y=D.P(v3(0,yj+capHeight*scale,0)).y-0.5;
        D.arrow({x:source.x+w/2+0.08,y},{x:target.x-w/2-0.08,y},'muted',1.5);
        const p=D.P(G.applyT(miniT,v3(0,y0,0)));
        b.text({x:p.x,y:p.y+1.2},'원래 입체',{size:D.fs(13),color:'ink',weight:700});
      }
      // 결합된 각뿔의 뒤쪽 이음 모서리는 실제로 가려져 점선으로 표시합니다.
      const backJoin = e => square && open<0.07 && Math.abs(e.a.y-yj)<1e-6 &&
        Math.abs(e.b.y-yj)<1e-6 && ((e.a.x+e.b.x)*D.vw.x+(e.a.z+e.b.z)*D.vw.z)<0;
      D.body({mesh:base,fill:'sky',alpha:0.22,edge:'ink',
        dashBack: e => !square && open<0.07 && Math.abs(e.a.y-yj)<1e-6 ? v3(0,yj,0) : null,
        edgeFn: e => backJoin(e) ? {skip:true} : {},
        faceStyle:f=>f.tag==='top'&&open<0.07?{skip:true}:
          f.tag==='top'&&M.mode==='surf'?{fill:'red',alpha:0.12}:{}});
      D.body({mesh:top,fill:'green',alpha:0.28,edge:'ink',
        dashBack: e => !square && open<0.07 && Math.abs(e.a.y-yj)<1e-6 ? v3(0,yj,0) : null,
        edgeFn: e => backJoin(e) ? {skip:true} : {},
        faceStyle:f=>f.tag==='bot'&&open<0.07?{skip:true}:
          f.tag==='bot'&&M.mode==='surf'?{fill:'red',alpha:0.12}:{}});
      if(square && open<0.07) {
        const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),v3(a/2,yj,a/2),v3(-a/2,yj,a/2)];
        for(let i=0;i<4;i++) { const e={a:q[i],b:q[(i+1)%4]};
          if(backJoin(e)) D.line(e.a,e.b,'ink',2.4,{dash:[6,5],alpha:0.7}); }
      }
      if(open>0.07 && M.mode==='surf'){
        if(square){
          const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),
            v3(a/2,yj,a/2),v3(-a/2,yj,a/2)];
          for(let i=0;i<4;i++)D.line(q[i],q[(i+1)%4],'red',2.5);
        } else {
          D.path(D.circ(v3(0,yj,0),v3(1,0,0),v3(0,0,1),r,0,TAU,48),'red',1.8);
          D.disc(add3(v3(0,yj,0),shift),v3(1,0,0),v3(0,0,1),r,'red',0.06,'red',1.8,{dash:[5,4]});
        }
      }
      if(square){
        D.dim(v3(-a/2,y0,a/2),v3(a/2,y0,a/2),String(M.a),
          {from:v3(0,0,0),off:16});
      } else {
        const c=v3(0,yj,0);
        D.radius(c,add3(c,mul3(D.rightFront(),r)),
          String(M.r),{gap:6,color:'ink'});
      }
      if (square) {
        D.dim(v3(-w/2,y0,w/2), v3(-w/2,yj,w/2), String(M.h),
          {side:{x:-1,y:0},off:17,color:'ink'});
      } else {
        // 회전 후에도 실제 원기둥의 왼쪽 윤곽에 닿는 점을 골라 높이를 표시합니다.
        const ring = D.circ(v3(0,yj,0),v3(1,0,0),v3(0,0,1),r,0,TAU,72);
        const left = ring.reduce((a,p) => D.px(p).x < D.px(a).x ? p : a);
        D.curveDim(v3(left.x,y0,left.z), left, String(M.h), {side:{x:-1,y:0}});
      }
      if(M.kind!=='hemi'){
        const foot=add3(v3(0,yj,0),shift);
        const apex=add3(v3(0,yj+topH,0),shift);
        D.height(foot,apex,String(M.topH),{color:'ink',side:{x:1,y:0},gap:18,alongFrac:-0.5,backdrop:true});
        if(square){
          const mids = [v3(0,yj,a/2),v3(a/2,yj,0),v3(0,yj,-a/2),v3(-a/2,yj,0)];
          const visible = mids.filter(p => G.dot3(p,D.vw) > 1e-6);
          const rightFace = (visible.length ? visible : mids).reduce((best,p) => D.px(p).x > D.px(best).x ? p : best);
          const faceMid=add3(rightFace,shift);
          D.line(faceMid,apex,'ink',1.8);
          D.edgeLab(faceMid,apex,String(M.l),{side:{x:1,y:0},gap:7,along:-40,color:'ink'});
        }else {
          // 모선 숫자는 실제 화면에 보이는 오른쪽 윤곽선에 붙입니다.
          const silhouettes = G.silLines(top, D.vw).filter(seg =>
            seg.some(p => Math.abs(p.y-(yj+shift.y))<1e-5));
          if (silhouettes.length) {
            const right = silhouettes.reduce((best, seg) =>
              Math.max(...seg.map(p => D.px(p).x)) > Math.max(...best.map(p => D.px(p).x)) ? seg : best);
            D.edgeLab(right[0], right[1], String(M.l), {side:{x:1,y:0},gap:6,color:'ink'});
          }
        }
      }
    }
    if(rows&&unfolded>0.1 && C.tab!=='explore'){
      G.drawTileRows(D,rows,0,rowTop);
      if(unfolded>0.96)b.text({x:0,y:rowTop+rows.height+1.6},
        '겉넓이 = '+plainVal(M.surface),
        {size:D.fs(15),weight:800,color:'green',baseline:'middle'});
    }
    if(bars&&unfolded>0.1){
      G.drawBars(D,bars,0,rowTop,5.4,0,{});
      if(unfolded>0.96)b.text({x:0,y:rowTop+0.7},
        '전체 부피 = '+plainVal(M.volume),
        {dy:32,size:D.fs(15),weight:800,color:'green',baseline:'middle'});
    }
  };
  G.register(60,'t6','⑥ 기본 결합 모형','기본 결합',PARAMS,[{
    id:'sv6-1',title:'필수 결합 입체 3종',short:'기본 모형 3종',
    question:'붙은 입체의 겉넓이와 부피는 각각 어떻게 구할까요?',
    cam0:{yaw:28,pitch:24},thumbT:0,problemT:0,
    anim:{key:'jcT',dur:2.8,start:1,hideActions:true,label:s=>s.jcMode==='vol'?'입체 분리해 보기':'겉면 펼쳐 비교하기'},
    stepT:n=>[0,0.12,0.4,0.82,1][Math.min(n,4)],
    ctl:()=>['jcH'],
    presets:()=>Object.keys(TYPES).map((k,i)=>({
      group:i===0?'필수 결합 모형':'',label:TYPES[k].name,
      apply:(s,lab)=>{s.jcKind=k;s.jcStarted=false;s.jcT=0;s.playing=false;s.revealed=false;s.step=0;lab?._buildProblem?.();s.svYaw=k==='pyramid'?35:28;s.svPitch=k==='pyramid'?30:24;},on:s=>kindOf(s)===k
    })).concat([
      {group:'구하는 것',label:'겉넓이',apply:(s,lab)=>{s.jcMode='surf';s.revealed=false;s.step=0;s.jcStarted=true;s.jcT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.svPick=null;lab?._buildProblem?.();s.playing=s.jcT===0;},on:s=>s.jcStarted&&s.jcMode!=='vol'},
      {label:'부피',apply:(s,lab)=>{s.jcMode='vol';s.revealed=false;s.step=0;s.jcStarted=true;s.jcT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.svPick=null;lab?._buildProblem?.();s.playing=s.jcT===0;},on:s=>s.jcStarted&&s.jcMode==='vol'}
    ]),
    init:s=>{s.jcKind='hemi';s.jcMode='surf';s.jcStarted=false;s.jcK=1;s.jcH=5;s.jcT=1;},
    reroll:s=>{s.jcKind=pick(Object.keys(TYPES),s.jcKind);
      s.jcK=rint(1,3);s.jcH=rint(3,12);s.jcT=0;},
    model,draw,
    check:s=>{
      const M=model(s),{r,a,h,topH,l}=M;
      const area=M.kind==='pyramid'?a*a+4*a*h+2*a*l:
        PI*r*r+2*PI*r*h+(M.kind==='hemi'?2*PI*r*r:PI*r*l);
      const vol=M.kind==='pyramid'?a*a*(h+topH/3):
        PI*r*r*(h+(M.kind==='hemi'?2*r/3:topH/3));
      return {ans:M.mode==='vol'?vol:area,model:vnum(M.ans)};
    },
    steps:M=>M.mode==='vol'?[
      `아래 ${M.lower}의 부피는 $${M.kind==='pyramid'?
        `${M.a}^2\\times${M.h}`:`\\pi\\times${M.r}^2\\times${M.h}`}=${tx(M.lowerVolume)}\\,\\mathrm{cm}^3$예요.`,
      `위 ${M.upper}의 부피는 $${M.kind==='hemi'?
        `\\frac12\\times\\frac43\\pi\\times${M.r}^3`:
        M.kind==='cone'?`\\frac13\\times\\pi\\times${M.r}^2\\times${M.topH}`:
          `\\frac13\\times${M.a}^2\\times${M.topH}`}=${tx(M.upperVolume)}\\,\\mathrm{cm}^3$예요.`,
      `전체 부피는 $${tx(M.lowerVolume)}+${tx(M.upperVolume)}=${tx(M.volume)}\\,\\mathrm{cm}^3$예요.`
    ]:[
      `각각의 겉넓이는 아래 ${M.lower}가 $${tx(M.lowerSurface)}$, 위 ${M.upper}(밑면 포함)가 $${tx(M.upperSurface)}\\,\\mathrm{cm}^2$예요.`,
      `붙은 면의 넓이 $${tx(M.join)}\\,\\mathrm{cm}^2$가 양쪽에서 하나씩 가려져요. 총 $${tx(M.hidden)}\\,\\mathrm{cm}^2$를 빼야 해요.`,
      `실제 겉넓이 = $${tx(M.lowerSurface)}+${tx(M.upperSurface)}-${tx(M.hidden)}=${tx(M.surface)}\\,\\mathrm{cm}^2$예요.`
    ],
    view:(M,C)=>C.tab==='explore'&&!M.started?{guide:'겉넓이를 누르면 겉면을 살펴보고, 부피를 누르면 붙은 입체를 나누어 볼 수 있어요.',readouts:[]}:({
      tip: C.tab!=='explore' ? null : M.mode==='vol' ? '분해한 두 입체의 부피를 각각 구한 뒤 더해요.' : M.kind==='hemi' ? '반구의 아랫면과 원기둥의 윗면은 맞닿아 안쪽에 숨어요.' : M.kind==='cone' ? '원뿔 옆면은 부채꼴이고, 호의 길이는 원기둥 밑면의 둘레와 같아요.' : '맞닿은 두 면은 안쪽에 숨어 겉넓이에 넣지 않아요.',
      card: (C.tab==='explore' && window.innerWidth>=700 && document.querySelector('.apl-canvas-wrap')?.clientWidth>=560) ? {
        title:'', lines: M.mode==='vol' ? [
          {text:M.lower+' 부피',color:'ink'},
          {text:`$${M.kind==='pyramid'?`${M.a}^2\\times${M.h}`:`\\pi\\times${M.r}^2\\times${M.h}`}=${tx(M.lowerVolume)}\\,\\mathrm{cm}^3$`,color:'ink'},
          {text:M.upper+' 부피',color:'ink'},
          {text:`$${M.kind==='hemi'?`\\frac12\\times\\frac43\\pi\\times${M.r}^3`:M.kind==='cone'?`\\frac13\\pi\\times${M.r}^2\\times${M.topH}`:`\\frac13\\times${M.a}^2\\times${M.topH}`}=${tx(M.upperVolume)}$`,color:'ink'},
          {text:'전체 부피',color:'ink'},
          {text:`$${tx(M.lowerVolume)}+${tx(M.upperVolume)}=${tx(M.volume)}\\,\\mathrm{cm}^3$`,color:'ink'}
        ] : [
          {text:M.lower+' 겉넓이 + '+M.upper+' 겉넓이',color:'ink'},
          {text:`$${tx(M.lowerSurface)}+${tx(M.upperSurface)}$`,color:'ink'},
          {text:M.kind==='hemi'?'반구 곡면은 구 겉넓이의 절반':'맞닿은 두 면은 안쪽이에요.',color:'ink'},
          {text:`맞닿은 두 면 $${tx(M.hidden)}$ 빼기`,color:'ink'},
          {text:`$${tx(M.lowerSurface)}+${tx(M.upperSurface)}-${tx(M.hidden)}=${tx(M.surface)}\\,\\mathrm{cm}^{2}$`,color:'ink'}
        ]
      } : null,
      guide:'<b>원기둥+반구 · 원기둥+원뿔 · 사각기둥+사각뿔</b> 중 하나를 골라 보세요. '+
        (M.mode==='surf'?'겉면을 펼쳐 비교하면 접합면을 제외한 겉면을 볼 수 있어요.':'입체를 분리해 각각의 부피를 비교해 보세요.')+
        (M.kind==='hemi'&&M.mode==='surf'?' 반구의 곡면은 구 겉넓이의 절반이에요. 반구의 아랫면은 원기둥과 붙어 결합한 입체의 안쪽에 숨습니다.':''),
      readouts:(C.tab==='explore' && window.innerWidth>=700 && document.querySelector('.apl-canvas-wrap')?.clientWidth>=560) ? [] : M.mode==='vol'?[ 
        rd(M.lower+' 부피',plainVal(M.lowerVolume)+' cm³','sky'),
        rd(M.upper+' 부피',plainVal(M.upperVolume)+' cm³','green'),
        rd('전체 부피',plainVal(M.volume)+' cm³','amber')
      ]:[
        rd('각 입체 겉넓이의 합',plainVal(vadd(M.lowerSurface,M.upperSurface))+' cm²','sky'),
        rd('맞붙어 가려진 면 2개','−'+plainVal(M.hidden)+' cm²','red'),
        rd('실제 겉넓이',plainVal(M.surface)+' cm²','green')
      ],
      formula:'<p>겉넓이 = 두 입체의 겉넓이의 합 − 접합면 2개</p>'+
        '<p>부피 = 아래 입체 부피 + 위 입체 부피</p>',
      rule:'붙은 면 2개는 겉넓이에서 빼고, 부피는 합해요.',
      notes:notes('겉넓이는 바깥으로 노출된 면만 더해요.',
        '사각뿔의 옆면은 삼각형 4개이며 옆면 높이와 수직 높이는 달라요.',
        '반구의 곡면은 구의 겉넓이의 절반이에요. 반구의 밑면은 따로 놓았을 때는 겉면이지만 붙이면 안쪽에 숨습니다.')
    }),
    prob:M=>{
      const givens=M.kind==='pyramid'?
        `사각기둥 밑면 한 변 ${M.a} cm, 기둥 높이 ${M.h} cm, 사각뿔 높이 ${M.topH} cm, 옆면 높이 ${M.l} cm`:
        `공통 밑면 반지름 ${M.r} cm, 원기둥 높이 ${M.h} cm`+
        (M.kind==='cone'?`, 원뿔 높이 ${M.topH} cm, 모선 ${M.l} cm`:'');
      const wrongs=M.mode==='vol'?[
        [M.lowerVolume,'위 입체의 부피도 더해야 해요.'],
        [vadd(M.lowerVolume,vmul(M.upperVolume,3)),'뿔은 1/3, 반구는 구의 절반을 적용해요.'],
        [vsub(M.lowerVolume,M.upperVolume),'붙인 도형의 부피는 더해요.'],
        [vmul(M.volume,2),'부피를 두 배로 계산하지 마세요.']
      ]:[
        [vadd(M.surface,M.hidden),'붙은 면을 두 군데 모두 빼야 해요.'],
        [vadd(M.surface,M.join),'맞붙은 면의 한쪽이 남았어요.'],
        [vsub(M.surface,M.join),'바닥에 드러난 면은 빼지 않아요.'],
        [vsub(M.surface,M.upperSide),'위쪽 곡면이나 옆면을 빠뜨렸어요.']
      ];
      return {tag:TYPES[M.kind].name+' · '+(M.mode==='vol'?'부피':'겉넓이'),
        key:`${M.kind}|${M.mode}|${M.k}|${M.h}`,
        stem:`${givens}인 ${TYPES[M.kind].name} 결합 입체의 ${M.mode==='vol'?'부피':'겉넓이'}는?`,
        choices:mkV(M.ans,wrongs,{dim:M.mode==='vol'?3:2})};
    }
  }]);
})();
