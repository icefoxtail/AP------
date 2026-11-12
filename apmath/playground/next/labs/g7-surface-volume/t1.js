/* ==========================================================================
   중1 · 겉넓이와 부피 — 탭 ① 「기둥의 겉넓이와 부피」 (t1.js, order 10) — 장면 5개
   · sv1-1 전개도로 보는 겉넓이(직사각형·직각삼각형·사다리꼴·원 밑면) · sv1-2 부채꼴기둥[함정: 호만 곱함]
   · sv1-3 원기둥 굴리기(2πr) · sv1-4 부피 V=Sh(밑면이 아래, 판이 왼쪽에서 들어와 위로 쌓임) · sv1-5 기둥 종합(직사각형+반원 밑면)
   전개도가 겉넓이 식의 첫 단계입니다: 입체를 펼치면 「밑면 2개 + 옆면 직사각형 1개(가로 = 밑면 둘레 전체, 세로 = 높이)」가 보입니다.
   모든 글자·식·보기·정답은 지금의 값으로 다시 계산됩니다. 정확한 값은 π 가 들어간 식으로 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SV;
  if (!G) return;
  const { cube8, PI, DEG, clamp, ease, seg01, lin01, v3, add3, sub3, mul3, lerp3, mid3, dot3, unit3, len3, V, vadd, vmul, vnum, tx, plainVal, mkV, mkText, P, fmtN, jo, pick, rint, shuffle, notes, rd, span, scene3, solidNet, circleBase, sectorBase, netScene, roleStyle, layoutTiles, drawTiles, prismMesh, revolveMesh, xfMesh, rotM } = G;

  const PARAMS = {
    sA: P('가로', 2, 15, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    sB: P('세로', 2, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sK: P('직각삼각형의 크기', 1, 3, 1, 1, { color: 'amber', hint: '세 변이 3·4·5, 6·8·10, 9·12·15 cm인 직각삼각형이에요', format: (v) => `${3 * v}·${4 * v}·${5 * v} cm` }),
    sU: P('사다리꼴의 윗변', 1, 15, 1, 3, { color: 'amber', hint: '아랫변은 윗변보다 6 cm 길고, 높이 4 cm·다리 5 cm는 그대로예요', format: (v) => `${v} cm (아랫변 ${v + 6} cm)` }),
    sR: P('반지름', 1, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sH: P('기둥의 높이', 2, 20, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT: P('펼치기', 0, 1, 0.01, 0, { color: 'green', hint: '오른쪽으로 끌수록 입체가 전개도로 펼쳐져요', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv1-2 부채꼴기둥
    sTh: P('부채꼴의 중심각', 60, 300, 30, 120, { color: 'amber', format: (v) => v + '°' }),
    sR2: P('부채꼴의 반지름', 2, 15, 1, 6, { color: 'amber', format: (v) => v + ' cm' }),
    sH2: P('기둥의 높이', 2, 20, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT2: P('펼치기', 0, 1, 0.01, 0, { color: 'green', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') }),
    // sv1-3 굴리기
    sR3: P('원기둥의 반지름', 1, 15, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    sH3: P('원기둥의 높이', 2, 20, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT3: P('굴러 가기', 0, 1, 0.01, 0, { color: 'green', hint: '한 바퀴 굴러 간 길이가 옆면의 가로예요', format: (v) => (v < 0.02 ? '출발' : v > 0.98 ? '한 바퀴' : Math.round(v * 100) + '%') }),
    // sv1-4 판 쌓기
    sT4: P('판 쌓기', 0, 1, 0.01, 0, { color: 'green', hint: '얇은 판이 하나씩 쌓여 높이만큼 늘어나요', format: (v) => (v < 0.02 ? '시작' : v > 0.98 ? '모두 쌓음' : Math.round(v * 100) + '%') }),
    // sv1-5 종합
    sW: P('직사각형 부분의 길이', 2, 15, 1, 4, { color: 'amber', format: (v) => v + ' cm' }),
    sRr: P('반원의 반지름', 1, 15, 1, 2, { color: 'amber', format: (v) => v + ' cm' }),
    sH5: P('기둥의 높이', 2, 20, 1, 5, { color: 'sky', format: (v) => v + ' cm' }),
    sT5: P('펼치기', 0, 1, 0.01, 0, { color: 'green', hint: '오른쪽으로 끌수록 겉넓이를 구하는 입체가 전개도로 펼쳐져요', format: (v) => (v < 0.02 ? '입체' : v > 0.98 ? '전개도' : Math.round(v * 100) + '%') })
  };

  // 좁은 조각에서는 글자가 이웃 조각으로 넘치지 않게 이름·설명을 빼고 값만 씁니다
  const wTxt = (D, str, size) => G.textW(str, D.fs(size || 14) * D.b.fs * D.b._ts());
  const dimTxt = (D, g) => ((g.x1 - g.x0) >= wTxt(D, g.dim, 15) + 26 ? g.dim : g.len);
  // 분수가 들어간 값은 세로로 길게 그려지므로 두 줄로 나누지 않고 한 줄로 둡니다
  // o.small: 면이 글자보다 좁으면(px 폭) 면 밖의 빈 자리에 이름 붙은 글자를 놓습니다
  const aLab = (D, p, name, val, o = {}) => {
    if (o.small != null && !o.fig && o.small < wTxt(D, `${name} ${val}`, o.size || 14) + 8) { D.label(p, `${name} ${val}`, { dir: o.dir || { x: 0, y: -1 }, gap: o.gap || 8, size: o.size || 14, alpha: o.alpha }); return null; }
    return D.areaLab(p, name, val, String(val).includes('/') ? Object.assign({}, o, { maxW: undefined }) : o);
  };
  // 한 줄 글자: 무대보다 길면 글자를 줄이고, 무대 안에 들어오게 가운데를 옮겨요 (화면 픽셀 좌표)
  const fitLine = (D, cx, y, str, o = {}) => {
    const b = D.b, W = b.W - b.insets.left - b.insets.right, k = 1.1; // 글자 폭 어림에 10% 여유
    let size = 15;
    const w = wTxt(D, str, 15) * k;
    if (w > W * 0.94) size = Math.max(10, (15 * W * 0.94) / w);
    const half = (wTxt(D, str, size) * k) / 2, rightPad = D.narrow && y > b.H - 60 ? 100 : 3; // 폰: 아래쪽 줄은 오른쪽 아래의 도구 단추를 피해요
    const x = Math.max(b.insets.left + half + 3, Math.min(b.W - b.insets.right - half - rightPad, cx));
    b.text(b.toW(x, y), str, { color: o.color || 'green', size: D.fs(size), weight: 800, align: 'center', baseline: 'middle', alpha: o.alpha });
  };
  const areaName = (D, g, name) => ((g.x1 - g.x0) * 0.9 >= wTxt(D, name, 14) + 6 ? name : '');

  /* ------------------------------------------------------------ 밑면 모델 (직사각형·직각삼각형·사다리꼴·원) */
  const SHAPE_ORDER = ['rect', 'tri', 'trap', 'circ'];
  const SHAPE_LABEL = { rect: '직사각형', tri: '직각삼각형', trap: '사다리꼴', circ: '원' };
  const SHAPE_SOLID = { rect: '직육면체', tri: '삼각기둥', trap: '사각기둥', circ: '원기둥' };
  function baseModel(shape, s) {
    let m;
    if (shape === 'rect') {
      const a = clamp(Math.round(s.sA), 2, 15), b = clamp(Math.round(s.sB), 2, 15);
      m = { poly: [[-a / 2, -b / 2], [a / 2, -b / 2], [a / 2, b / 2], [-a / 2, b / 2]], smooth: null, sides: [a, b, a, b], root: 1, area: V(a * b), per: V(2 * (a + b)), areaTex: `${a}\\times${b}`, perTex: `${a}+${b}+${a}+${b}`, given: `가로 ${a} cm, 세로 ${b} cm`, one: V(a) };
    } else if (shape === 'tri') {
      const k = clamp(Math.round(s.sK), 1, 3);
      m = { poly: [[0, 0], [3 * k, 0], [0, 4 * k]], smooth: null, sides: [3 * k, 5 * k, 4 * k], root: 0, area: V(6 * k * k), per: V(12 * k), areaTex: `\\frac{1}{2}\\times${3 * k}\\times${4 * k}`, perTex: `${3 * k}+${4 * k}+${5 * k}`, given: `세 변 ${3 * k} cm, ${4 * k} cm, ${5 * k} cm`, one: V(3 * k), legs: [3 * k, 4 * k] };
    } else if (shape === 'trap') {
      const u = clamp(Math.round(s.sU), 1, 15), wb = u + 6;
      m = { poly: [[-wb / 2, 0], [wb / 2, 0], [u / 2, 4], [-u / 2, 4]], smooth: null, sides: [wb, 5, u, 5], root: 0, area: V(((u + wb) * 4) / 2), per: V(u + wb + 10), areaTex: `\\frac{1}{2}\\times(${u}+${wb})\\times4`, perTex: `${u}+${wb}+5+5`, given: `윗변 ${u} cm, 아랫변 ${wb} cm, 높이 4 cm, 다리 5 cm`, one: V(u), u, wb };
    } else {
      const r = clamp(Math.round(s.sR), 1, 15);
      m = { poly: circleBase(r, 36), smooth: Array(36).fill(true), sides: null, root: 18, area: V(0, r * r), per: V(0, 2 * r), areaTex: `\\pi\\times${r}^2`, perTex: `2\\pi\\times${r}`, given: `반지름 ${r} cm`, one: V(0, r), r };
    }
    const xs = m.poly.map((p) => p[0]), zs = m.poly.map((p) => p[1]);
    m.shape = shape; m.name = SHAPE_LABEL[shape]; m.solid = SHAPE_SOLID[shape];
    m.cx = (Math.min(...xs) + Math.max(...xs)) / 2; m.cz = (Math.min(...zs) + Math.max(...zs)) / 2;
    m.ex = Math.max(...xs) - Math.min(...xs); m.ez = Math.max(...zs) - Math.min(...zs);
    return m;
  }
  const scaledPoly = (bm, sc) => bm.poly.map((p) => [(p[0] - bm.cx) * sc, (p[1] - bm.cz) * sc]);
  const hNum = (h) => `\\times${h}`;

  /* ================================================================ sv1-1 전개도로 보는 겉넓이 */
  function sv11() {
    const model = (s) => {
      const shape = SHAPE_ORDER.includes(s.svShape) ? s.svShape : 'rect', bm = baseModel(shape, s), h = clamp(Math.round(s.sH), 2, 20);
      const L = vmul(bm.per, h), S2 = vmul(bm.area, 2), tot = vadd(S2, L);
      return { shape, bm, h, S: bm.area, S2, P: bm.per, L, tot, vol: vmul(bm.area,h), mode: s.sv11Mode === 'vol' ? 'vol' : 'surf', started: !!s.sv11Started };
    };
    // 밑면의 변 ↔ 옆면에서 맞붙는 변은 같은 색(원 밑면은 한 색): 전개도에서 어느 변끼리 붙는지 보입니다
    const glueColor = (bm, k) => (bm.shape === 'circ' ? 'violet' : G.pairColor(k));
    // 원래 입체와 전개도를 같은 눈금으로 나란히 두고, 실제 면을 펼칩니다.
    const drawArea = (b,s,M,C) => {
      const bm=M.bm,sc=5.2/Math.max(bm.ex,bm.ez,M.h),poly=scaledPoly(bm,sc),h=M.h*sc;
      if(!s.sv11Started){
        const D=scene3(b,s,C),mesh=prismMesh(poly,0,h,{simple:true,smooth:bm.smooth}),pts=[];
        for(const x of [-bm.ex*sc/2,bm.ex*sc/2])for(const z of [-bm.ez*sc/2,bm.ez*sc/2])for(const y of [0,h])pts.push(v3(x,y,z));
        D.fit(pts,[],{l:b.W<500?22:45,r:b.W<500?22:45,t:25,b:38});
        D.body({mesh,fill:'sky',alpha:.035,edge:'ink',edgeW:2});
        const left=poly.reduce((a,p)=>D.P(v3(p[0],0,p[1])).x<D.P(v3(a[0],0,a[1])).x?p:a,poly[0]);
        D.curveDim(v3(left[0],0,left[1]),v3(left[0],h,left[1]),`높이 ${M.h}`,{side:{x:-1,y:0},size:13});
        if(bm.shape==='circ'){
          const centre=v3(0,h,0),rim=add3(centre,D.hx(bm.r*sc));
          D.radius(centre,rim,`반지름 ${bm.r}`,{size:13});
        }
        if(bm.shape==='rect'){
          const sides=poly.map((p,i)=>{const q=poly[(i+1)%poly.length],a=v3(p[0],0,p[1]),z=v3(q[0],0,q[1]);return{i,a,z,y:(D.P(a).y+D.P(z).y)/2};}).sort((a,b)=>b.y-a.y).slice(0,2);
          sides.forEach(x=>D.curveDim(x.a,x.z,String(bm.sides[x.i]),{side:{x:0,y:1},size:13}));
        }
        return;
      }
      const sn=solidNet(poly,h,1,bm.smooth,bm.root),e=G.ease(C.t),yaw=s.svYaw==null?28:s.svYaw,pitch=s.svPitch==null?22:s.svPitch;
      const frame=u=>{const cam=G.camOf(yaw*(1-u),pitch*(1-u)),pose=G.netPose(sn.net,u),p=[];sn.net.pieces.forEach((f,k)=>f.pts.forEach(v=>p.push(G.proj(cam,G.applyT(pose[k],v)))));const box=G.bboxOf(p);return {pose,box,cx:(box.x0+box.x1)/2,cy:(box.y0+box.y1)/2};};
      const entryFit=s.lessonEntry&&(C.t||0)<0.02; // 해설 우선 진입 화면: 닫힌 입체만 보이므로 펼친 전개도 크기가 아니라 입체에 맞춰 크게(탐구·수업 모드는 그대로)
      const frames=Array.from({length:entryFit?1:9},(_,i)=>frame(i/8)),W=Math.max(...frames.map(f=>f.box.x1-f.box.x0)),H=Math.max(...frames.map(f=>f.box.y1-f.box.y0));
      const src=scene3(b,s,C),extent=Math.max(bm.ex,bm.ez)*sc/2,off=src.hx(-W/2-extent-3),base=prismMesh(poly,0,h,{simple:true,smooth:bm.smooth});
      const srcPts=[];for(const x of [-extent,extent])for(const z of [-extent,extent])for(const y of [0,h])srcPts.push(src.P(add3(off,v3(x,y,z))));
      const sb=G.bboxOf(srcPts),sy=-(sb.y0+sb.y1)/2, pair=b.W>=1000;
      src.fit([],[{x:(pair?Math.min(sb.x0,-W/2):-W/2)-1,y:(pair?Math.min(sb.y0+sy,-H/2):-H/2)-1},{x:W/2+1,y:(pair?Math.max(sb.y1+sy,H/2):H/2)+1.5}],{l:20,r:(window.innerWidth>=700&&b.W>=560?245:20),t:pair?58:20,b:pair?60:20});
      const sp=src.P;src.P=p=>{const q=sp(p);return{x:q.x,y:q.y+sy};};if(pair){src.body({mesh:xfMesh(base,G.shiftT(off)),fill:'sky',alpha:.035,edge:'ink',edgeW:1.8});
      const p0=src.P(off);b.text({x:p0.x,y:sb.y1+sy+1},'원래 입체',{size:src.fs(13),color:'ink',weight:700});}
      const f=frame(e),D=scene3(b,s,C,{yaw:yaw*(1-e),pitch:pitch*(1-e)}),dp=D.P;D.P=p=>{const q=dp(p);return{x:q.x-f.cx,y:q.y-f.cy};};
      G.netDraw(D,sn.net,f.pose,pc=>({fill:pc.tag==='lat'?'green':'sky',alpha:.07,edge:'ink',ew:2}));
      if(e>.99){
        if(bm.shape==='circ'){
          const side=sn.lat.flatMap(k=>sn.net.pieces[k].pts.map(p=>D.P(G.applyT(f.pose[k],p)))),box=G.bboxOf(side);
          b.path([{x:box.x0,y:box.y0},{x:box.x0,y:box.y1}],{color:'ink',width:2});
          b.path([{x:box.x1,y:box.y0},{x:box.x1,y:box.y1}],{color:'ink',width:2});
        }
        [sn.top,sn.bot].forEach(k=>{if(k<0)return;const piece=sn.net.pieces[k],p=D.P(G.applyT(f.pose[k],G.centroid(piece.pts)));b.text(p,'밑면',{size:D.fs(12),color:'ink',weight:700});});
        const k=sn.lat[Math.floor(sn.lat.length/2)],piece=sn.net.pieces[k],p=D.P(G.applyT(f.pose[k],G.centroid(piece.pts)));
        b.text(p,'옆면',{size:D.fs(12),color:'ink',weight:700});
      }
      const nx=-W/2;if(pair&&nx-sb.x1>.3)src.arrow({x:sb.x1+.1,y:-H/2-.5},{x:nx-.1,y:-H/2-.5},'muted',1.4);
    };
    // 부피(정리 탭): 단계마다 한 가지씩 — 1 밑면(하늘색 강조 + 밑넓이 + 반지름) → 2 높이(노랑 치수선, 조각이 모여 한 덩어리일 때) → 3 부피(초록 결과).
    // 결과는 해설이 재생 중이면(s.lessonOn) 해설이 svShowV 를 켤 때까지 아낍니다(결론 자막보다 먼저 보이지 않게). 값이 작은 그림에서는 글자를 그림 밖으로 빼고 선으로 이어요.
    const volLabels = (b,s,M,C,D,g) => {
      const { poly, h, gap, open, pair } = g, bm = M.bm, st = C.step || 0;
      const yTop = h / 2 + 2 * gap, top3 = (p) => v3(p[0], yTop, p[1]), cTop = v3(0, yTop, 0);
      const xs = poly.map((p) => D.px(top3(p))), x0 = Math.min(...xs.map((q) => q.x)), x1 = Math.max(...xs.map((q) => q.x)), y0 = Math.min(...xs.map((q) => q.y)), y1 = Math.max(...xs.map((q) => q.y));
      const c = D.px(cTop), faceW = x1 - x0, faceH = y1 - y0;
      const txt = (x, y, str, color, size) => { b.text(b.toW(x, y), str, { color, size: D.fs(size), weight: 800, align: 'center', baseline: 'middle' }); };
      const line = (ax, ay, bx, by, color) => b.path([b.toW(ax, ay), b.toW(bx, by)], { color, width: 1.8, alpha: 0.9 });
      if (st >= 1) {
        D.panel(poly.map(top3), 'sky', 0.30, 'sky', 2.6); // 밑면 강조
        const name = `밑넓이 ${plainVal(M.S)}`, w = wTxt(D, name, 14) + 8;
        if (faceW >= w * 1.45 && faceH >= 30) {
          // 면이 넉넉하면 면 안, 반지름 선이 뻗는 오른쪽을 피해 왼쪽 반에
          const lx = c.x - Math.min(faceW * 0.5 - w / 2 - 4, w / 2 + 16);
          txt(lx, c.y - faceH * 0.05, name, 'ink', 14);
          D.boxes.push({ x0: lx - w / 2, x1: lx + w / 2, y0: c.y - faceH * 0.05 - 10, y1: c.y - faceH * 0.05 + 10 });
        } else {
          // 면이 좁으면 면 밖(오른쪽 위)으로 빼고 면의 중심과 선으로 잇습니다
          const lx = x1 + 12 + w / 2, ly = y0 - 8;
          line(c.x, c.y, lx - w / 2, ly + 6, 'ink');
          D.dot(cTop, 'ink', 3.5);
          txt(lx, ly, name, 'ink', 14);
          D.boxes.push({ x0: lx - w / 2, x1: lx + w / 2, y0: ly - 10, y1: ly + 10 });
        }
        if (st === 1 && bm.shape === 'circ' && !pair) {
          const rim = D.rimPick(cTop, poly.map(top3));
          D.radius(cTop, rim, `반지름 ${bm.r}`, { size: 13, end: faceW < b.W * 0.55 });
        }
      }
      if (st >= 2 && !pair) {
        // 해설 재생 중: 조각이 벌어져 있는 동안은 높이를 재지 않고(모였을 때 나타남). 해설이 아닌 정리 탭: 조각이 늘 벌어져 있으므로(stepT 1) 벌어진 쌓임 전체에 높이를 항상 그립니다.
        const alpha = s.lessonOn ? Math.max(0, Math.min(1, 1 - open * 8)) : 1, yEnd = s.lessonOn ? h / 2 : h / 2 + 2 * gap;
        const left = poly.reduce((a, p) => (D.P(v3(p[0], 0, p[1])).x < D.P(v3(a[0], 0, a[1])).x ? p : a), poly[0]);
        D.dim(v3(left[0], -h / 2, left[1]), v3(left[0], yEnd, left[1]), `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 16, color: 'amber', size: 14, alpha });
      }
      if (st >= 3 && (!s.lessonOn || s.svShowV)) {
        const str = `부피 = ${plainVal(M.S)} × ${M.h} = ${plainVal(M.vol)} cm³`;
        const ty = Math.min(y0, D.px(v3(0, -h / 2, 0)).y) - 30;
        const W = b.W - b.insets.left - b.insets.right, size = Math.max(11, Math.min(16, (15 * W * 0.94) / (wTxt(D, str, 15) * 1.1)));
        txt(Math.max(b.insets.left + 8 + wTxt(D, str, size) / 2, Math.min(b.W - b.insets.right - 8 - wTxt(D, str, size) / 2, c.x)), Math.max(14, ty), str, 'green', size);
      }
    };
    const drawVol = (b,s,M,C) => {
      const bm=M.bm, sc=4.6/Math.max(bm.ex,bm.ez,M.h), poly=scaledPoly(bm,sc), h=M.h*sc;
      const D=scene3(b,s,C), width=Math.max(bm.ex,bm.ez)*sc, src=D.hx(-width*1.6), smooth=bm.smooth, pair=!C.problem && b.W>=1000;
      if(C.problem){const mesh=prismMesh(poly,-h/2,h/2,{simple:true,smooth});D.fit(mesh.faces.flatMap(f=>f.pts),[],{l:12,r:12,t:12,b:12});D.body({mesh,fill:'sky',alpha:.035,edge:'ink',edgeW:2});return;}
      const open=G.ease(C.problem?0:C.t), gap=(0.45+0.35*width)*open, pts=[];
      for(const x of [-width/2,width/2])for(const z of [-width/2,width/2])for(const y of [-h/2,h/2+2*gap]) {pts.push(v3(x,y,z));if(pair)pts.push(add3(v3(x,y,z),src));}
      const lab=C.review&&!b.thumb; // 정리 탭(해설 재생 포함): 자막이 말하는 값을 그림에 보입니다. 탐구·문제 탭과 작은 그림은 예전 그대로입니다.
      if(lab) D.fit(pts,[],{l:pair?25:(D.narrow?74:90),r:25,t:pair?65:62,b:pair?65:28});
      else D.fit(pts,[],{l:25,r:(!C.problem&&!b.thumb&&window.innerWidth>=700&&b.W>=560?245:25),t:pair?65:25,b:pair?65:25});
      const ref=xfMesh(prismMesh(poly,-h/2,h/2,{simple:true,smooth}),G.shiftT(src));
      if(pair) D.body({mesh:ref,fill:'sky',alpha:.035,edge:'ink',edgeW:2});
      if(pair&&!b.thumb){
        const left=poly.reduce((a,p)=>D.P(add3(src,v3(p[0],0,p[1]))).x<D.P(add3(src,v3(a[0],0,a[1]))).x?p:a,poly[0]);
        D.curveDim(add3(src,v3(left[0],-h/2,left[1])),add3(src,v3(left[0],h/2,left[1])),`높이 ${M.h}`,{side:{x:-1,y:0},size:12});
        if(bm.shape==='circ'){const c=add3(src,v3(0,h/2,0));D.radius(c,add3(c,D.hx(bm.r*sc)),`반지름 ${bm.r}`,{size:12});}
      }
      if(pair){const b0=D.P(add3(src,v3(0,-h/2,0)));b.text({x:b0.x,y:b0.y+width*.55+0.4},'원래 입체',{size:D.fs(13),color:'ink',weight:700});}
      for(let i=0;i<3;i++){
        const y0=-h/2+i*h/3+i*gap,y1=y0+h/3;
        D.body({mesh:prismMesh(poly,y0,y1,{simple:true,smooth}),fill:'sky',alpha:.06,edge:'ink',edgeW:1.7});
      }
      if(lab) volLabels(b,s,M,C,D,{poly,h,gap,open,pair,sc});
      const a=D.P(src),q=D.P(v3(0,0,0)),y=Math.min(D.P(v3(0,h/2+2*gap,0)).y,D.P(add3(src,v3(0,h/2,0))).y)-.8;
      if(pair&&q.x-a.x>width+1)D.arrow({x:a.x+width/2+.1,y},{x:q.x-width/2-.1,y},'muted',1.4);
    };
    const draw = (b, s, M, C) => {
      if(M.mode==='vol')return drawVol(b,s,M,C);
      if(C.tab==='explore'&&!C.problem&&!b.thumb)return drawArea(b,s,M,C);
      const bm = M.bm, sc = 5.2 / Math.max(bm.ex, bm.ez, M.h), hu = M.h * sc, poly = scaledPoly(bm, sc);
      const sn = solidNet(poly, hu, 1, bm.smooth, bm.root);
      const n = poly.length, st = C.step;
      const lvB = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t, eNow = G.ease(t), glue = eNow > 0.3 && !C.problem && !b.thumb;
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 84, r: 40, t: 40, b: 112 },
        style: (pc) => Object.assign(roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB), {
          edgeStyle: (e, p) => {
            if (!glue) return null;
            const k = p.tag === 'lat' ? (e.i === 0 || e.i === 2 ? p.k : -1) : e.nb;
            return k != null && k >= 0 ? { color: glueColor(bm, k), width: 3.6 } : null;
          }
        }),
        labels: (ctx) => {
          if (b.thumb) return;
          const { D, tp, e } = ctx, vw = D.vw, A = sn.A, B = sn.B, L = sn.lat, at = ctx.at;
          const solidA = 1 - G.lin01(e, 0.05, 0.45), flatA = G.lin01(e, 0.78, 0.98);
          const cen = at(sn.root, add3(G.centroid(A), v3(0, hu / 2, 0)));
          const vis = (k) => dot3(tp[L[k]].n, vw) > 0.35;
          const topSeen = sn.top >= 0 && tp[sn.top].front;
          // 입체: 보이는 옆면의 밑변 길이는 그 변 바깥(아래)에 치수선으로
          if (bm.sides && solidA > 0.02) {
            L.forEach((idx, k) => { if (vis(k)) D.dim(at(idx, A[k]), at(idx, A[(k + 1) % n]), fmtN(bm.sides[k]), { from: cen, off: 15, alpha: solidA }); });
            // 가려진 옆면의 밑변 길이는 윗면의 변 바깥에(보이는 변과 길이가 같으면 생략)
            if (topSeen) L.forEach((idx, k) => {
              if (vis(k) || L.some((j, kk) => vis(kk) && bm.sides[kk] === bm.sides[k])) return;
              D.dim(at(idx, B[k]), at(idx, B[(k + 1) % n]), fmtN(bm.sides[k]), { from: cen, off: 15, alpha: solidA });
            });
          }
          // 높이: 가장 왼쪽 세로 모서리 바깥에 세로 치수선(입체와 전개도에서 같은 모서리를 따라 움직임)
          let hk = null, xL = 1e9;
          L.forEach((idx, k) => [k, (k + 1) % n].forEach((j) => { const x = D.px(at(idx, A[j])).x; if (x < xL - 0.5) { xL = x; hk = { idx, j }; } }));
          D.dim(at(hk.idx, A[hk.j]), at(hk.idx, B[hk.j]), `높이 ${M.h}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
          // 전개도: 각 옆면 아래 바깥에 치수선 + 그 아래 긴 괄호(밑면의 둘레)
          if (flatA > 0.02) {
            const items = L.map((idx, k) => { const a = D.px(at(idx, A[k])), c = D.px(at(idx, A[(k + 1) % n])); return { k, a: at(idx, A[k]), c: at(idx, A[(k + 1) % n]), x0: Math.min(a.x, c.x), x1: Math.max(a.x, c.x), y: a.y }; }).sort((p, q) => p.x0 - q.x0);
            const rowY = Math.max(...ctx.all.map((p) => D.px(p).y)) + 16, xl = items[0].x0, xr = items[items.length - 1].x1;
            if (bm.sides) items.forEach((it) => D.dim(it.a, it.c, fmtN(bm.sides[it.k]), { side: { x: 0, y: 1 }, off: rowY - it.y, color: glueColor(bm, it.k), alpha: flatA }));
            const sum = bm.sides ? items.map((it) => fmtN(bm.sides[it.k])).join('+') : `2×π×${bm.r}`;
            D.brace({ x: xl, y: rowY }, { x: xr, y: rowY }, `밑면의 둘레 = ${sum} = ${plainVal(M.P)}`, { px: true, side: { x: 0, y: 1 }, off: 14, color: 'amber', alpha: flatA });
          }
          // 밑면: 넓이 이름표(보이는 밑면마다), 모양별 표시는 처음 보이는 밑면 한 곳에만
          let first = true;
          [sn.top, sn.bot].forEach((k) => {
            if (k < 0 || !tp[k].front) return;
            const pts = k === sn.top ? B : A, c3 = at(k, G.centroid(pts)), cs = D.px(c3);
            const xs = pts.map((p) => D.px(at(k, p)).x), ys = pts.map((p) => D.px(at(k, p)).y), faceW = Math.max(...xs) - Math.min(...xs), faceH = Math.max(...ys) - Math.min(...ys);
            let dx = 0, dy = 0, rimTo = null, maxW = faceW * 0.86;
            if (bm.shape === 'tri') maxW = faceW * 0.5; // 삼각형은 아래쪽이 좁아 일찍 두 줄로
            if (bm.shape !== 'circ') dx = (bm.shape === 'trap' ? 0.25 : -0.2) * faceW * (1 - G.lin01(e, 0.1, 0.5)); // 입체에서는 뒤쪽 점선 모서리를 피해 왼쪽으로
            if (bm.shape === 'trap') { // 전개도: 높이 점선(직각 표시)과 밑변 선에서 떨어지도록 점선의 반대쪽·밑변에서 한 칸 위로
              const a0 = at(k, pts[0]), a1 = at(k, pts[1]), t2 = at(k, pts[2]), dir = unit3(sub3(a1, a0)), fx = D.px(add3(a0, mul3(dir, dot3(sub3(t2, a0), dir)))).x;
              dx += (cs.x >= fx ? 1 : -1) * 0.16 * faceW * G.lin01(e, 0.1, 0.5);
              dy = 0.2 * faceH * G.lin01(e, 0.5, 0.9);
            }
            if (bm.shape === 'circ') {
              rimTo = D.rimPick(c3, pts.map((p) => at(k, p)));
              if (first) { const rp = D.px(rimTo), R = Math.hypot(rp.x - cs.x, rp.y - cs.y); dx = -0.12 * R; dy = -0.23 * faceH; maxW = R * 1.6; } // 반지름 중심 점과 글자 끝이 맞닿지 않게 중심 위쪽에
            }
            // 작은 화면(가로 휴대폰)에서 원이 글자보다 좁으면 「밑넓이 9π」를 면 밖 왼쪽으로 빼 반지름 선과 겹치지 않게 합니다(넓은 면은 예전 그대로)
            if (!C.problem) aLab(D, c3, '밑넓이', plainVal(M.S), bm.shape === 'circ' ? { dx, dy, maxW, small: faceW, dir: { x: -1, y: -0.15 }, gap: 20 } : { dx, dy, maxW });
            if (!first) return;
            first = false;
            if (bm.shape === 'circ') D.radius(c3, rimTo, `반지름 ${bm.r}`, { end: true });
            else if (bm.shape === 'tri') D.right(at(k, pts[0]), sub3(at(k, pts[1]), at(k, pts[0])), sub3(at(k, pts[2]), at(k, pts[0])), 0.3, 'amber');
            else if (bm.shape === 'trap') {
              const a0 = at(k, pts[0]), a1 = at(k, pts[1]), t2 = at(k, pts[2]), dir = unit3(sub3(a1, a0)), foot = add3(a0, mul3(dir, dot3(sub3(t2, a0), dir)));
              D.height(foot, t2, '높이 4', { a: dir, side: { x: 1, y: 0 }, size: 14, alongFrac: 0.3 });
            }
          });
        }
      });
    };
    return {
      id: 'sv1-1', title: '기둥의 겉넓이와 부피', short: '기둥의 겉넓이·부피',
      question: '기둥의 겉넓이와 부피는 각각 무엇을 구하는 걸까요?',
      anim: { key: 'sT', dur: 2.8, label: '펼쳐 보기', hideActions: true }, cam0: { yaw: 28, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: (s) => ({ rect: ['sA', 'sB'], tri: ['sK'], trap: ['sU'], circ: ['sR'] }[s.svShape || 'rect'].concat(['sH'])),
      presets: () => SHAPE_ORDER.map((k, i) => ({ group: i === 0 ? '밑면 모양' : '', label: SHAPE_LABEL[k], apply: (st,lab) => { st.svShape = k; st.revealed=false; st.step=0; lab?._buildProblem?.(); }, on: (st) => (st.svShape || 'rect') === k })).concat([
        {group:'구하는 것',label:'겉넓이',apply:(st,lab)=>{st.sv11Mode='surf';st.sv11Started=true;st.sT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;st.svPick=null;st.revealed=false;st.step=0;lab?._buildProblem?.();st.playing=st.sT===0;},on:st=>st.sv11Started&&st.sv11Mode!=='vol'},
        {label:'부피',apply:(st,lab)=>{st.sv11Mode='vol';st.sv11Started=true;st.sT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;st.svPick=null;st.revealed=false;st.step=0;lab?._buildProblem?.();st.playing=st.sT===0;},on:st=>st.sv11Started&&st.sv11Mode==='vol'}]),
      init: (s) => { s.sv11Mode = 'surf'; s.sv11Started = false; s.svShape = 'rect'; s.sA = 4; s.sB = 3; s.sK = 1; s.sU = 3; s.sR = 3; s.sH = 5; s.sT = 0; },
      reroll: (s) => {
        s.svShape = pick(SHAPE_ORDER, s.svShape);
        s.sA = rint(2, 7); s.sB = pick([2, 3, 4, 5, 6, 7], s.sA); s.sK = rint(1, 2); s.sU = rint(1, 5); s.sR = rint(2, 5); s.sH = rint(2, 8); s.sT = 0;
      },
      model, draw,
      check: (s) => {
        const M = model(s), poly = M.shape === 'circ' ? circleBase(M.bm.r, 4000) : M.bm.poly;
        let A2 = 0, Pm = 0;
        poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length]; A2 += p[0] * q[1] - q[0] * p[1]; Pm += Math.hypot(q[0] - p[0], q[1] - p[1]); });
        return M.mode==='vol' ? {ans:Math.abs(A2)*M.h/2,model:vnum(M.vol)} : { ans: Math.abs(A2) + Pm * M.h, model: vnum(M.tot) };
      },
      steps: (M) => {
        const { bm, h } = M;
        if(M.mode==='vol')return [`밑면은 ${bm.name}이고 밑넓이는 $${bm.areaTex}=${tx(M.S)}$예요.`, `같은 밑면이 높이 $${h}$만큼 쌓인 입체예요.`, `(부피) $=${tx(M.S)}\\times${h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`];
        return [
          `밑면은 ${bm.name}이고 2개예요. 밑넓이 $=${bm.areaTex}=${tx(M.S)}$이므로 밑면 2개의 넓이는 $${tx(M.S)}\\times2=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
          `전개도에서 옆면을 이어 보면 하나의 직사각형 띠예요. 띠의 가로는 밑면의 둘레 전체 $${bm.perTex}=${tx(M.P)}$, 세로는 높이 $${h}$이므로 옆넓이는 $${tx(M.P)}\\times${h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
          `(겉넓이) $=$ (밑넓이)$\\times2+$(옆넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
        ];
      },
      view: (M, C) => {
        const { bm, h } = M;
        if(C.tab==='explore' && !M.started) return {guide:'겉넓이를 누르면 전개도로, 부피를 누르면 나누어진 입체로 살펴볼 수 있어요. 밑면 모양과 길이를 바꾸거나 입체를 돌려 보세요.',readouts:[],notes:notes('겉넓이는 바깥 면의 넓이, 부피는 입체가 차지하는 양이에요.')};
        if(M.mode==='vol'){
          const card=(C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:[{text:'밑넓이',color:'ink'},{text:`$${bm.areaTex}=${tx(M.S)}\\,\\mathrm{cm}^2$`,color:'ink'},{text:'부피',color:'ink'},{text:`$${tx(M.S)}\\times${h}=${tx(M.vol)}\\,\\mathrm{cm}^3$`,color:'ink'}]}:null;
          return {card,tip:C.tab==='explore'?'부피는 같은 밑면이 높이만큼 쌓인 양이에요.':null,guide:'나누어진 조각을 보며 기둥의 부피가 밑넓이에 높이를 곱한 값임을 살펴보세요.',readouts:card?[]:[rd('밑넓이',plainVal(M.S)+' cm²','ink'),rd('부피',plainVal(M.vol)+' cm³','ink')],formula:`<p>부피 $=${tx(M.S)}\\times${h}=${tx(M.vol)}\\,\\mathrm{cm}^3$</p>`,notes:notes('부피는 면의 넓이가 아니라 입체가 차지하는 양이에요.')};
        }
        const areaCard=(C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:[{text:'밑넓이',color:'ink'},{text:`$${bm.areaTex}=${tx(M.S)}\\,\\mathrm{cm}^2$`,color:'ink'},{text:'옆넓이',color:'ink'},{text:`$(${bm.perTex})\\times${h}=${tx(M.L)}\\,\\mathrm{cm}^2$`,color:'ink'},{text:'겉넓이',color:'ink'},{text:`$${tx(M.S)}\\times2+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$`,color:'ink'}]}:null;
        return {
          card:areaCard, tip:C.tab==='explore'?'기둥은 밑면 두 개와 옆면으로 둘러싸여 있어요.':null,
          guide: `<b>겉넓이</b>를 누르면 선택한 입체가 전개도로 펼쳐져요. <b>밑면 모양 칩</b>과 <b>길이 막대</b>로 값을 바꿀 수 있고, 빈 곳을 끌면 입체가 돌아가요. 펼치면 ${span('sky', '밑면 2개')}와 ${span('green', '이어진 옆면의 띠')}가 나와요.`,
          readouts: areaCard ? [] : [
            rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', bm.areaTex.replace(/\\frac\{1\}\{2\}/g, '½').replace(/\\times/g, '×').replace(/\\pi/g, 'π')),
            rd('밑면의 둘레', plainVal(M.P) + ' cm', 'amber', '옆면의 가로'),
            rd('옆넓이', plainVal(M.L) + ' cm²', 'green', `${plainVal(M.P)} × ${h}`),
            rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', `${plainVal(M.S)} × 2 + ${plainVal(M.L)}`)
          ],
          formula: `<p>(겉넓이) $=$ (밑넓이)$\\times2+$(옆넓이) $=$ (밑넓이)$\\times2+$(밑면의 둘레)$\\times$(높이)</p>`,
          rule: '기둥의 옆면은 직사각형: 가로 = 밑면의 둘레 전체, 세로 = 높이',
          notes: notes('옆면의 가로는 밑면의 <b>한 변이 아니라 둘레 전체</b>예요. 전개도에서 옆면을 한 줄로 펴 보면 알 수 있어요.', '밑면은 위·아래 <b>2개</b>예요. 밑넓이를 두 번 더해요.', '부피(밑넓이$\\times$높이)와 겉넓이를 헷갈리지 않아요. 겉넓이는 면의 넓이의 합이에요.')
        };
      },
      prob: (M) => {
        const { bm, h } = M, one = vmul(bm.one, h);
        if(M.mode==='vol') return {tag:'기둥의 부피',key:`vol|${M.shape}|${bm.given}|${h}`,stem:`밑넓이가 $${tx(M.S)}\\,\\mathrm{cm}^2$이고 높이가 $${h}\\,\\mathrm{cm}$인 기둥의 부피는?`,choices:mkV(M.vol,[[M.S,'높이를 곱해요.'],[M.tot,'겉넓이가 아닌 부피를 구해요.'],[vmul(M.vol,2),'밑넓이 하나에 높이를 곱해요.'],[vmul(M.vol,1/2),'기둥의 부피는 밑넓이 곱하기 높이예요.'],[M.L,'옆넓이가 아닌 부피예요.']],{dim:3})};
        const wrongs = [
          [vadd(M.S, M.L), '밑면은 위·아래 2개예요. 밑넓이를 두 번 더해야 해요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vmul(M.S, h), '부피(밑넓이×높이)를 구했어요. 겉넓이는 면의 넓이의 합이에요.'],
          [vadd(M.S2, one), '옆면의 가로는 한 변(또는 반지름)이 아니라 밑면의 둘레 전체예요.'],
          [vadd(M.S2, vmul(M.L, 2)), '옆면은 한 번만 더해요.']
        ];
        const stem = { rect: `그림과 같이 밑면의 가로가 $${bm.sides ? bm.sides[0] : ''}\\,\\mathrm{cm}$, 세로가 $${bm.sides ? bm.sides[1] : ''}\\,\\mathrm{cm}$이고 높이가 $${h}\\,\\mathrm{cm}$인 직육면체의 겉넓이는?`,
          tri: `그림과 같이 밑면이 세 변의 길이가 $${bm.sides ? bm.sides.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$인 직각삼각형이고 높이가 $${h}\\,\\mathrm{cm}$인 삼각기둥의 겉넓이는?`,
          trap: `그림과 같이 밑면이 윗변 $${bm.u}\\,\\mathrm{cm}$, 아랫변 $${bm.wb}\\,\\mathrm{cm}$, 높이 $4\\,\\mathrm{cm}$, 다리 $5\\,\\mathrm{cm}$인 사다리꼴이고 기둥의 높이가 $${h}\\,\\mathrm{cm}$인 사각기둥의 겉넓이는?`,
          circ: `그림과 같이 밑면의 반지름이 $${bm.r}\\,\\mathrm{cm}$이고 높이가 $${h}\\,\\mathrm{cm}$인 원기둥의 겉넓이는?` }[M.shape];
        return { tag: '기둥의 겉넓이', key: `${M.shape}|${bm.given}|${h}`, stem, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-2 부채꼴기둥 */
  const lessonReady = (s, key) => !(s.lessonOn || s.lessonEntry) || s[key] === true;

  function sv12() {
    const model = (s) => {
      const th = clamp(Math.round(s.sTh / 30) * 30, 60, 300), r = clamp(Math.round(s.sR2), 2, 15), h = clamp(Math.round(s.sH2), 2, 20);
      const S = V(0, (r * r * th) / 360), arc = V(0, (r * th) / 180), Pm = vadd(arc, V(2 * r)), L = vmul(Pm, h), S2 = vmul(S, 2), tot = vadd(S2, L);
      return { th, r, h, S, arc, P: Pm, L, S2, tot };
    };
    const draw = (b, s, M, C) => {
      const { th, r, h } = M, sc = 5.2 / Math.max(r * (th > 180 ? 2 : 1.4), h), ru = r * sc, hu = h * sc;
      const sb = sectorBase(ru, th), N = sb.pts.length - 2, mid = 1 + Math.floor(N / 2);
      const sn = solidNet(sb.pts, hu, 1, sb.smooth, mid);
      const A = sn.A, B = sn.B, n = sb.pts.length, st = C.step;
      const lvB = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvL = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      const t = C.problem ? 0 : C.t, eNow = G.ease(t), glue = eNow > 0.3 && !C.problem && !b.thumb;
      // 옆면 번호 → 밑면의 어느 변과 맞붙는가: 0 = 반지름 한 쪽, 1 = 호, 2 = 반지름 다른 쪽
      const grp = (k) => (k === 0 ? 0 : k === n - 1 ? 2 : 1);
      netScene(b, s, C, {
        sn, t, fitOpt: { l: 30, r: (C.tab === 'explore' && !b.thumb && window.innerWidth >= 700 && b.W >= 560 ? 235 : 30), t: 25, b: 30 },
        style: (pc) => Object.assign(roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB), {
          fill: (pc.tag === 'lat' ? lvL : lvB) === 2 ? 'amber' : (pc.tag === 'lat' ? 'green' : 'violet'),
          alpha: C.problem ? 0.025 : (C.review ? 0.10 : (eNow < 0.03 ? 0.025 : 0.10)),
          edgeStyle: (e, p) => {
            if (!glue) return null;
            const k = p.tag === 'lat' ? (e.i === 0 || e.i === 2 ? p.k : -1) : e.nb;
            return k != null && k >= 0 ? { color: 'ink', width: 1.6 } : null;
          }
        }),
        labels: (ctx) => {
          if (b.thumb || (C.review && !s.lessonOn) || (C.tab === 'explore' && ctx.e > 0.5)) return; // 해설 재생 중에는 정리 탭에도 길이·넓이 이름표
          const { D, tp, e } = ctx, vw = D.vw, L = sn.lat, at = ctx.at;
          const outside = (p, q, center) => { const A = D.px(p), B = D.px(q), C = D.px(center); return { x: (A.x+B.x)/2-C.x, y: (A.y+B.y)/2-C.y }; };
          const solidA = 1 - G.lin01(e, 0.05, 0.45), flatA = G.lin01(e, 0.78, 0.98);
          // 교재식 곡선 치수 표시: 양 끝이 실제 변에 닿고 중앙이 바깥으로 살짝 휩니다.
          const curveDim = (p, q, label, outward) => {
            const A2 = D.px(p), B2 = D.px(q), dx = B2.x - A2.x, dy = B2.y - A2.y, L2 = Math.hypot(dx, dy);
            if (L2 < 18) return;
            let nx = -dy / L2, ny = dx / L2;
            if (nx * outward.x + ny * outward.y < 0) { nx = -nx; ny = -ny; }
            const bow = Math.max(8, Math.min(18, L2 * 0.09));
            const point = (t) => ({ x: A2.x + dx*t + nx * 4*bow*t*(1-t), y: A2.y + dy*t + ny * 4*bow*t*(1-t) });
            const pts = Array.from({length: 25}, (_, i) => { const p = point(i/24); return b.toW(p.x, p.y); });
            b.path(pts, { color: 'ink', width: 1.5 });
            const m = point(0.5); b.text(b.toW(m.x + nx*12, m.y + ny*12), label, { color: 'ink', size: D.fs(14), weight: 700, align: 'center', baseline: 'middle' });
          };
          const cen = at(sn.root, add3(G.centroid(A), v3(0, hu / 2, 0)));
          // 높이: 가장 왼쪽 세로 모서리 바깥에 세로 치수선
          let hk = null, xL = 1e9;
          L.forEach((idx, k) => [k, (k + 1) % n].forEach((j) => { const x = D.px(at(idx, A[j])).x; if (x < xL - 0.5) { xL = x; hk = { idx, j }; } }));
          curveDim(at(hk.idx, A[hk.j]), at(hk.idx, B[hk.j]), String(h), { x: -1, y: 0 });
          // 밑면(부채꼴): 반지름 두 변, 중심각, 넓이 이름표. 반지름 글자는 처음 보이는 밑면에만
          let first = true;
          const angleJobs = []; // 중심각 글자는 다른 글자를 모두 놓은 뒤 남은 자리에 놓아요
          [sn.top, sn.bot].forEach((k) => {
            if (k < 0 || !tp[k].front) return;
            const pts = k === sn.top ? B : A, O3 = at(k, pts[0]), M3 = at(k, pts[mid]), c3 = at(k, G.centroid(pts));
            const Rpx = Math.hypot(D.px(O3).x - D.px(M3).x, D.px(O3).y - D.px(M3).y);
            // 90도는 모서리에서 작은 직각 표시로, 그 밖의 각은 짧은 호로 표시합니다.
            if (th === 90) {
              const u = mul3(sub3(pts[1], pts[0]), 0.14), v = mul3(sub3(pts[n - 1], pts[0]), 0.14);
              D.path([at(k, add3(pts[0], u)), at(k, add3(add3(pts[0], u), v)), at(k, add3(pts[0], v))], 'ink', 1.8);
            } else {
              const arcPts = [];
              for (let i = 1; i < n; i++) arcPts.push(at(k, lerp3(pts[0], pts[i], 0.16)));
              D.path(arcPts, 'ink', 1.8);
            }
            // 반지름 두 변: 중심각이 크면 두 글자가 겹치므로 한 번만 쓰고 두 변에 같은 길이 표시(눈금)
            if (first) {
              first = false;
              curveDim(at(k, pts[0]), at(k, pts[1]), String(r), outside(at(k, pts[0]), at(k, pts[1]), c3));
              if (th <= 180) curveDim(at(k, pts[0]), at(k, pts[n - 1]), String(r), outside(at(k, pts[0]), at(k, pts[n - 1]), c3));
              else { D.tick(at(k, pts[0]), at(k, pts[1]), 1, 'ink'); D.tick(at(k, pts[0]), at(k, pts[n - 1]), 1, 'ink'); }
            }
            if (!C.problem && C.t > 0.78 && lessonReady(s, 'svBaseReady')) aLab(D, lerp3(O3, M3, th > 180 ? 0.66 : 0.68), '밑넓이', plainVal(M.S), { maxW: Math.max(40, 1.1 * Rpx * Math.sin((Math.min(th, 180) * DEG) / 2)), size: 14 });
            // 중심각 글자: 좁거나(90° 이하) 180°가 넘는 부채꼴은 꼭짓점 바깥(호의 반대쪽)에 둬요
            angleJobs.push(() => {
              if (th > 180 || th <= 90) { const o2 = D.px(O3), m2 = D.px(M3), dl = Math.hypot(o2.x - m2.x, o2.y - m2.y) || 1; D.label(O3, `${th}°`, { dir: { x: (o2.x - m2.x) / dl, y: (o2.y - m2.y) / dl }, gap: 4, size: 14, color: 'amber' }); }
              else D.label(lerp3(O3, M3, 0.34), `${th}°`, { dir: { x: 0, y: 1 }, gap: 8, size: 14, color: 'ink' });
            });
          });
          // 전개도: 옆면 조각 아래 치수선(반지름 · 호 · 반지름) + 둘레 괄호 + 옆넓이 + 합
          if (flatA > 0.02 && !C.problem) {
            const grpK = [[0], Array.from({ length: n - 2 }, (_, i) => i + 1), [n - 1]];
            const info = grpK.map((ks, gi) => {
              const cs = [];
              ks.forEach((k) => [k, (k + 1) % n].forEach((j) => { const p3 = at(L[k], A[j]), q = D.px(p3); cs.push({ p3, x: q.x, y: q.y }); }));
              const lo = cs.reduce((a, c) => (c.x < a.x ? c : a)), hi = cs.reduce((a, c) => (c.x > a.x ? c : a));
              const km = ks[Math.floor(ks.length / 2)];
              return { gi, lo, hi, x0: lo.x, x1: hi.x, color: G.pairColor(gi), len: gi === 1 ? plainVal(M.arc) : String(r), dim: gi === 1 ? `호의 길이 ${plainVal(M.arc)}` : String(r), area: gi === 1 ? plainVal(vmul(M.arc, h)) : String(r * h), c3: at(L[km], G.centroid(sn.net.pieces[L[km]].pts)) };
            }).sort((p, q) => p.x0 - q.x0);
            const rowY = Math.max(...ctx.all.map((p) => D.px(p).y)) + 16, xl = info[0].x0, xr = info[2].x1;
            info.forEach((g) => D.dim(g.lo.p3, g.hi.p3, (lessonReady(s, 'svOtherReady') || g.gi !== 1) ? dimTxt(D, g) : '호의 길이', { side: { x: 0, y: 1 }, off: rowY - g.lo.y, color: g.color, alpha: flatA }));
            if (lessonReady(s, 'svOtherReady')) D.brace({ x: xl, y: rowY }, { x: xr, y: rowY }, `밑면의 둘레 = ${info.map((g) => g.len).join('+')} = ${plainVal(M.P)}`, { px: true, side: { x: 0, y: 1 }, off: 14, color: 'amber', alpha: flatA });
            if (lessonReady(s, 'svSideReady')) info.forEach((g) => aLab(D, g.c3, areaName(D, g, '옆넓이'), g.area, { maxW: (g.x1 - g.x0) * 0.9, size: 14, alpha: flatA }));
            if (!D.lessonHide) fitLine(D, (xl + xr) / 2, rowY + 76, `겉넓이 = ${plainVal(M.S)}×2 + (${info.map((g) => g.area).join('+')}) = ${plainVal(M.tot)}`, { alpha: flatA });
          }
          angleJobs.forEach((f) => f());
        }
      });
    };
    return {
      view3: false, id: 'sv1-2', title: '부채꼴기둥', short: '부채꼴기둥',
      question: '밑면이 부채꼴인 기둥을 펼치면 옆면의 가로는 얼마일까? 호의 길이만 곱하면 될까?',
      anim: { key: 'sT2', dur: 1.5, label: '펼쳐 보기' }, cam0: { yaw: 78, pitch: 22 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['sTh', 'sR2', 'sH2', 'sT2'],
      init: (s) => { s.sTh = 90; s.sR2 = 4; s.sH2 = 7; s.sT2 = 0; },
      reroll: (s) => {
        const th = pick([60, 90, 120, 180, 240, 270, 300], s.sTh);
        const rs = { 60: [3, 6], 90: [2, 4, 6, 8], 120: [3, 6], 180: [2, 4, 6, 8], 240: [3, 6], 270: [2, 4, 6, 8], 300: [3, 6] }[th];
        s.sTh = th; s.sR2 = pick(rs, -1); s.sH2 = rint(2, 8); s.sT2 = 0;
      },
      model, draw,
      check: (s) => {
        const M = model(s), r = M.r, th = M.th * DEG, N = 4000;
        let per = 2 * r, A = 0;
        for (let i = 0; i < N; i++) { const a0 = (th * i) / N, a1 = (th * (i + 1)) / N; per += Math.hypot(r * (Math.cos(a1) - Math.cos(a0)), r * (Math.sin(a1) - Math.sin(a0))); A += 0.5 * r * r * Math.sin(a1 - a0); }
        return { ans: 2 * A + per * M.h, model: vnum(M.tot) };
      },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$, 중심각 $${M.th}^\\circ$인 부채꼴이 2개예요. 밑넓이 $=\\pi\\times${M.r}^2\\times\\frac{${M.th}}{360}=${tx(M.S)}$이므로 밑면 2개의 넓이는 $${tx(M.S)}\\times2=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `옆면은 직사각형 하나이고 가로는 밑면의 둘레 전체예요. 호의 길이는 $2\\pi\\times${M.r}\\times\\frac{${M.th}}{360}=${tx(M.arc)}$이고 반지름 2개($2\\times${M.r}$)도 더해야 해요. 옆면의 가로 $=${tx(M.arc)}+${2 * M.r}=${tx(M.P)}$, 옆넓이 $=(${tx(M.P)})\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C, s) => ({
        tip: C.tab !== 'explore' ? null : s.sT2 > 0.75
          ? '옆면의 가로에는 호의 길이와 반지름 두 개가 모두 들어가요.'
          : '잘라서 새로 생긴 두 평평한 면도 바깥에 드러나요.',
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? { title: '', lines: [
          { text: '밑넓이', color: 'ink' },
          { text: `$\\pi\\times${M.r}^{2}\\times\\frac{${M.th}}{360}=${tx(M.S)}\\,\\mathrm{cm}^{2}$`, color: 'ink' },
          { text: '옆넓이', color: 'ink' },
          { text: `$(${tx(M.P)})\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^{2}$`, color: 'ink' },
          { text: '겉넓이', color: 'ink' },
          { text: `$2\\times${tx(M.S)}+(${tx(M.L)})=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`, color: 'ink' }
        ] } : null,
        guide: `<b>중심각·반지름·높이 막대</b>를 움직이고 <b>펼치기</b>를 끌어 보세요. 부채꼴기둥의 옆면은 ${span('green', '곡면 1개 + 평평한 직사각형 2개')}가 한 줄로 이어진 직사각형이에요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [
          rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', `π×${M.r}×${M.r}×${M.th}/360`),
          rd('호의 길이', plainVal(M.arc) + ' cm', 'amber', `2π×${M.r}×${M.th}/360`),
          rd('옆면의 가로', plainVal(M.P) + ' cm', 'amber', '호 + 반지름 2개'),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'green', `2×${plainVal(M.S)} + ${plainVal(M.L)}`)
        ],
        formula: `<p>(옆면의 가로) $=$ (호의 길이) $+$ (반지름)$\\times2$ &nbsp;→&nbsp; (겉넓이) $=$ (밑넓이)$\\times2+$(옆면의 가로)$\\times$(높이)</p>`,
        rule: '부채꼴기둥: 옆면의 가로 = 호 + 반지름 2개 (밑면의 둘레 전체)',
        notes: notes('<b>함정</b>: 호의 길이만 곱하면 안 돼요. 부채꼴의 두 <b>반지름</b> 위에도 잘라서 생긴 평평한 옆면이 있어요.', 'π가 붙은 항과 붙지 않은 항은 동류항이 아니므로 각각 정리해 더한 채로 써요.', '중심각이 $180^\\circ$를 넘어도 같은 원리예요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S2, vmul(M.arc, M.h)), '옆면의 가로에 반지름 2개를 빠뜨렸어요. 호 + 반지름 2개 = 둘레 전체예요.'],
          [vadd(M.S, M.L), '밑면은 2개예요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vadd(M.S2, vmul(V(2 * M.r, 2 * M.r), M.h)), '호가 아니라 원 전체의 둘레를 썼어요. 부채꼴의 호는 중심각만큼만이에요.'],
          [vmul(M.S, M.h), '부피를 구했어요.']
        ];
        return { tag: '부채꼴기둥의 겉넓이', key: `${M.th}|${M.r}|${M.h}`, stem: `그림과 같이 밑면이 반지름 $${M.r}\\,\\mathrm{cm}$, 중심각 $${M.th}^\\circ$인 부채꼴이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-3 원기둥 굴리기 */
  function sv13() {
    const model = (s) => {
      const r = clamp(Math.round(s.sR3), 1, 15), h = clamp(Math.round(s.sH3), 2, 20);
      const S = V(0, r * r), S2 = vmul(S, 2), per = V(0, 2 * r), L = vmul(per, h), tot = vadd(S2, L);
      return { r, h, S, S2, per, L, tot };
    };
    const draw = (b, s, M, C) => {
      const { r, h } = M, sc = 2.2 / Math.max(r, h * 0.42), ru = r * sc, hu = h * sc, Ltot = 2 * PI * ru;
      const t = C.problem ? 0 : ease(C.t), xs = -Ltot / 2, xc = C.problem ? 0 : xs + Ltot * t;
      const D = scene3(b, s, C);
      const cylM = revolveMesh([[0, -hu / 2], [ru, -hu / 2], [ru, hu / 2], [0, hu / 2]], { axis: 'z', O: v3(xc, 0, 0), N: 44, tags: ['back', 'side', 'front'] });
      const st = C.step, lvC = !C.review ? 1 : st === 1 ? 2 : st === 2 ? 1 : 3, lvR = !C.review ? 1 : st === 1 ? 0 : st === 2 ? 2 : 3;
      // 지금 보이는 원기둥을 무대 폭의 약 절반(폰 60%)으로 크게 잡고(굴러 가는 동안 화면이 따라가요), 전개도 조각은 입체 아래 한 줄로 화면 폭에 맞춰요
      const isN = !b.thumb, capV = D.narrow ? 0.6 : 0.5, ccn = [-1, 1].flatMap((i) => [-1, 1].map((j) => [-1, 1].map((k2) => v3(xc + i * ru, j * ru, k2 * hu / 2)))).flat();
      let wvN = 0;
      if (isN) wvN = D.fitCore(ccn, [], { l: 30, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 30), t: 30, b: 30 }, { floor: 0.6, cap: capV }).wv;
      // 마지막 구간(진행 80~100%): 굴러간 옆면 띠 전체(출발선~원기둥)가 보이도록 화면이 부드럽게 물러나요
      const wz = isN && !C.problem ? ease(lin01(C.t, 0.8, 1)) : 0, lerpN = (p, q) => p + (q - p) * wz;
      const bbC = G.bboxOf(ccn.map(D.P)), fullPts = [xs - ru, -xs + ru].flatMap((xx) => [-1, 1].flatMap((j) => [-1, 1].map((k2) => v3(xx, j * ru, k2 * hu / 2)))), bbF = G.bboxOf(fullPts.map(D.P));
      const LB = { x0: lerpN(bbC.x0, bbF.x0), x1: lerpN(bbC.x1, bbF.x1), y0: lerpN(bbC.y0, bbF.y0), y1: lerpN(bbC.y1, bbF.y1) };
      const fullW = 2 * PI * ru + 2 * ru, rowW = isN ? lerpN(Math.min(fullW, wvN * 0.9), fullW) : fullW;
      // 전개도 조각: 밑면(원) · 옆면(직사각형) · 밑면(원). 이름·넓이는 아래에서 직접 씁니다
      const gapT = Math.max(0.5, 0.35 * r);
      const row = (s.lessonOn && s.svRollMode === 'surf' && s.svBaseReady) ? layoutTiles([
        { w: 2 * r, h: 2 * r, shape: 'circle', fill: 'sky' },
        { w: 2 * PI * r, h, shape: 'rect', fill: 'green' },
        { w: 2 * r, h: 2 * r, shape: 'circle', fill: 'sky' }
      ], rowW, Math.max(ru * 2, hu), gapT) : null; // 해설에서만 면별 계산을 순서대로 짚습니다.

      const xe = C.problem ? 0 : -xs, xb = C.problem ? 0 : xs;
      const bb = isN ? LB : G.bboxOf([v3(xb - ru, -ru, -hu / 2), v3(xe + ru, -ru, -hu / 2), v3(xb - ru, ru, hu / 2), v3(xe + ru, ru, hu / 2)].map(D.P));
      const ccx = (bb.x0 + bb.x1) / 2, rowGap = lerpN(0.9, 1.9);
      const extra = row ? [{ x: ccx - row.total / 2, y: bb.y1 + rowGap }, { x: ccx + row.total / 2, y: bb.y1 + rowGap + row.height + 0.9 }] : [];
      if (isN && C.problem) D.fit(ccn, [], { l: 35, r: 35, t: 25, b: 35 });
      else if (isN) D.fitCore(ccn, extra.concat(wz > 0 ? [{ x: LB.x0, y: LB.y0 }, { x: LB.x1, y: LB.y1 }] : []), { l: 30, r: (C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560 ? 245 : 30), t: 30, b: 30 }, { floor: wz > 0 ? 0 : 0.6, cap: capV });
      else D.fit(ccn, extra, { l: 36, r: 36, t: 36, b: 36 });
      // 굴러간 자리(옆면이 펼쳐진 직사각형)
      if (!C.problem && xc > xs + 1e-3) D.panel([v3(xs, -ru, -hu / 2), v3(xc, -ru, -hu / 2), v3(xc, -ru, hu / 2), v3(xs, -ru, hu / 2)], 'green', lvR === 2 ? 0.14 : 0.08, lvR === 2 ? 'amber' : 'green', 2.4);
      if (!C.problem) { D.line(v3(xs - ru * 1.2, -ru, -hu / 2), v3(-xs + ru * 1.2, -ru, -hu / 2), 'muted', 1.4, { alpha: 0.5 }); D.line(v3(xs - ru * 1.2, -ru, hu / 2), v3(-xs + ru * 1.2, -ru, hu / 2), 'muted', 1.4, { alpha: 0.5 }); }
      D.body({ mesh: cylM, fill: 'sky', alpha: 0.045, faceStyle: (f) => (f.tag === 'front' && lvC === 2 ? { fill: 'amber', alpha: 0.42 } : f.tag === 'back' && lvC === 2 ? { fill: 'amber', alpha: 0.3 } : f.tag === 'side' && lvR === 2 ? { fill: 'amber', alpha: 0.3 } : {}) });
      // 출발선과 지금 닿는 선(옆면 위의 같은 자리)
      if (!C.problem) {
        D.line(v3(xs, -ru, -hu / 2), v3(xs, -ru, hu / 2), 'amber', 4);
        const phi = -PI / 2 - (xc - xs) / ru, nrm = v3(Math.cos(phi), Math.sin(phi), 0), pa = add3(v3(xc, 0, -hu / 2), mul3(nrm, ru)), pb = add3(v3(xc, 0, hu / 2), mul3(nrm, ru));
        D.line(pa, pb, 'amber', 4, { dash: dot3(nrm, D.vw) > 0 ? undefined : [6, 5] });
        D.dot(add3(v3(xc, 0, hu / 2), mul3(nrm, ru)), 'amber', 5);
      }
      // 반지름(앞 밑면의 중심에서 오른쪽으로) · 높이(오른쪽 아래 윤곽선을 따라 치수선)
      const fc = v3(xc, 0, hu / 2);
      D.radius(fc, add3(fc, v3(ru, 0, 0)), `반지름 ${r}`, {});
      const phS = Math.atan2(-D.cam.sy * D.cam.cp, D.cam.sp), sx0 = xc + ru * Math.cos(phS), sy0 = ru * Math.sin(phS);
      D.dim(v3(sx0, sy0, -hu / 2), v3(sx0, sy0, hu / 2), `높이 ${h}`, { side: { x: Math.cos(phS), y: -Math.sin(phS) * 0.6 }, off: 12, color: 'ink' });
      if (!C.problem) {
        const done = t > 0.985, rollA = lin01(t, 0.02, 0.1);
        // 굴러 간 길이 = 원의 둘레 (옆면의 가로): 바닥의 치수선
        // 굴러 가는 동안 화면이 원기둥을 따라가므로 진행률은 닿는 자리 아래에 쓰고, 한 바퀴를 다 굴러 화면이 물러난 뒤에 전체 길이 치수선을 그려요
        if (t > 0.02 && t <= 0.8) D.tag(v3(xc, -ru, hu / 2), `한 바퀴의 ${Math.round(t * 100)}%`, { dy: 22, size: 15, color: 'orange', alpha: rollA });
        if (t > 0.8) D.dim(v3(xs, -ru, hu / 2), v3(xc, -ru, hu / 2), done ? (lessonReady(s, 'svOtherReady') ? `원의 둘레 = 지름 × π = ${plainVal(M.per)}` : '한 바퀴 굴러간 거리') : `한 바퀴의 ${Math.round(t * 100)}%`, { side: { x: 0, y: 1 }, off: 14, color: 'ink', alpha: lin01(t, 0.8, 0.9) });
        if (row) {
          drawTiles(D, row, ccx, bb.y1 + rowGap);
          const base = bb.y1 + rowGap + row.height, kpx = b.k;
          row.tiles.forEach((tl, i) => {
            const cx2 = ccx + tl.x + tl.sw / 2, cy2 = base - tl.sh / 2, mw = tl.sw * kpx * 0.92;
            if (i === 1 && lessonReady(s, 'svSideReady')) aLab(D, { x: cx2, y: cy2 }, '옆넓이', `${plainVal(M.per)}×${h} = ${plainVal(M.L)}`, { fig: true, maxW: mw, size: 14 });
            else if (i !== 1 && lessonReady(s, 'svBaseReady')) aLab(D, { x: cx2, y: cy2 }, '밑넓이', plainVal(M.S), { fig: true, maxW: mw, size: 14 });
          });
          const sp = D.b.toS({ x: ccx, y: base });
          if (lessonReady(s, 'svShowV')) fitLine(D, sp.x, sp.y + 30, `겉넓이 = ${plainVal(M.S)} + ${plainVal(M.L)} + ${plainVal(M.S)} = ${plainVal(M.tot)}`);
        }
      }
    };
    return {
      id: 'sv1-3', title: '원기둥 굴리기', short: '원기둥 굴리기',
      question: '원기둥을 한 바퀴 굴리면 옆면이 어떤 모양으로 펼쳐질까? 가로의 길이는 얼마일까?',
      anim: { key: 'sT3', dur: 2.5, label: '굴려 보기' }, cam0: { yaw: 42, pitch: 20 }, stepT: () => 1, thumbT: 1, problemT: 0,
      ctl: () => ['sR3', 'sH3', 'sT3'],
      init: (s) => { s.sR3 = 3; s.sH3 = 5; s.sT3 = 0; },
      reroll: (s) => { s.sR3 = rint(1, 6); s.sH3 = rint(2, 10); s.sT3 = 0; },
      model, draw,
      check: (s) => { const M = model(s); return { ans: 2 * PI * M.r * M.r + 2 * PI * M.r * M.h, model: vnum(M.tot) }; },
      steps: (M) => [
        `밑면은 반지름 $${M.r}$인 원이 2개예요. 밑넓이 $\\pi\\times${M.r}^2=${tx(M.S)}$, 2개이면 $${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `한 바퀴 굴러 간 길이는 원의 둘레 $2\\pi\\times${M.r}=${tx(M.per)}$예요. 옆면은 가로 $${tx(M.per)}$, 세로 $${M.h}$인 직사각형이므로 옆넓이는 $${tx(M.per)}\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$ &nbsp;($=2\\pi r(r+h)$)`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? { title: '', lines: [
          {text:'밑면의 둘레 = 지름 × 원주율',color:'ink'}, {text:`$${2*M.r}\\times\\pi=${tx(M.per)}\\,\\mathrm{cm}$`,color:'ink'},
          {text:'옆넓이',color:'ink'}, {text:`$${tx(M.per)}\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^{2}$`,color:'ink'},
          {text:'겉넓이',color:'ink'}, {text:`$2\\times${tx(M.S)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'}
        ] } : null,
        guide: `<b>굴려 보기</b>를 누르면 한 바퀴 굴러간 길이가 ${span('green', '밑면의 둘레')}와 같다는 것을 볼 수 있어요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [
          rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', `π × ${M.r} × ${M.r}`),
          rd('옆면의 가로', plainVal(M.per) + ' cm', 'amber', `원의 둘레 2 × π × ${M.r}`),
          rd('옆넓이', plainVal(M.L) + ' cm²', 'green', `${plainVal(M.per)} × ${M.h}`),
          rd('겉넓이', plainVal(M.tot) + ' cm²', 'amber', `${plainVal(M.S)} × 2 + ${plainVal(M.L)}`)
        ],
        formula: `<p>(겉넓이) $=2\\times\\pi r^2+2\\pi r\\times h=2\\pi r(r+h)$</p>`,
        rule: '원기둥의 옆면은 가로 2πr, 세로 h인 직사각형',
        notes: notes('옆면의 가로는 <b>지름이 아니라 원의 둘레 $2\\pi r$</b>예요.', '밑면은 2개이므로 $\\pi r^2$을 두 번 더해요.', '반지름이 아니라 지름이 주어지면 반으로 나눈 뒤 계산해요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S, M.L), '밑면은 위·아래 2개예요.'],
          [M.L, '옆넓이만 구했어요. 밑넓이 2개도 더해야 해요.'],
          [vmul(M.S, M.h), '부피 $\\pi r^2h$를 구했어요.'],
          [vadd(M.S2, vmul(V(0, M.r), M.h)), '옆면의 가로는 $2\\pi r$이에요. $\\pi r$만 썼어요.'],
          [vadd(vmul(V(0, 2 * M.r), 1), M.L), '밑넓이는 $\\pi r^2$이에요. $2\\pi r$(둘레)를 밑넓이로 썼어요.']
        ];
        return { tag: '원기둥의 겉넓이', key: `${M.r}|${M.h}`, stem: `그림과 같이 밑면의 반지름이 $${M.r}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 원기둥의 겉넓이는?`, choices: mkV(M.tot, wrongs, { dim: 2 }) };
      }
    };
  }

  /* ================================================================ sv1-4 부피 V = Sh (판 쌓기) */
  function sv14() {
    const model = (s) => {
      const shape = SHAPE_ORDER.includes(s.svShape) ? s.svShape : 'rect', bm = baseModel(shape, s), h = clamp(Math.round(s.sH), 2, 20);
      return { shape, bm, h, S: bm.area, vol: vmul(bm.area, h), L: vmul(bm.per, h) };
    };
    // 밑면이 아래: 얇은 판(두께 1cm)을 위로 쌓습니다. 판은 왼쪽에서 오른쪽으로(가로로) 들어와 제자리에 놓여요.
    const slab = (bm, sc, y0, y1) => (bm.shape === 'circ' ? revolveMesh([[0, y0], [bm.r * sc, y0], [bm.r * sc, y1], [0, y1]], { N: 32, tags: ['bot', 'side', 'top'] }) : prismMesh(scaledPoly(bm, sc), y0, y1));
    const draw = (b, s, M, C) => {
      const { bm, h } = M, sc = Math.min(3.0 / Math.max(bm.ex, bm.ez), 5.0 / h), t = C.problem ? 1 : C.t, D = scene3(b, s, C);
      const ext = Math.max(bm.ex, bm.ez) * sc, H = h * sc, y0 = -H / 2, cnt = t * h, slide = ext * 1.05 + 0.4, st = C.step;
      const plates = [];
      for (let k = 0; k < h; k++) {
        const loc = clamp(cnt - k, 0, 1);
        if (loc <= 0 && !C.problem) continue;
        const off = -(1 - ease(loc)) * slide; // 왼쪽에서 오른쪽으로 들어옴
        plates.push({ k, loc, mesh: xfMesh(slab(bm, sc, y0 + k * sc, y0 + (k + 1) * sc), G.shiftT(D.hx(off))), fly: loc < 1 });
      }
      const nDone = plates.filter((p) => p.loc >= 1).length;
      const pts = cube8(v3(0, 0, 0), Math.max(ext / 2, H / 2)).map((p) => v3(p.x, p.y, p.z)).concat([add3(v3(-ext / 2, y0, 0), D.hx(-slide))]);
      // 쌓인 기둥을 크게(판이 날아 들어올 자리는 따로 확보하지 않고, 판은 화면 가장자리에서 들어와요)
      const colPts = [-1, 1].flatMap((i) => [0, 1].flatMap((j) => [-1, 1].map((k2) => v3(i * ext / 2, y0 + j * H, k2 * ext / 2))));
      if (D.narrow && !b.thumb) D.fitCore(colPts, [], { l: 40, r: 60, t: 34, b: 40 }, { floor: 0.64, cap: 0.64 });
      else if (!b.thumb) D.fitCore(colPts.concat([pts[pts.length - 1]]), [], { l: 35, r: (C.tab === 'explore' && !C.problem && window.innerWidth >= 700 && b.W >= 560 ? 245 : 45), t: 30, b: 40 }, { cap: 0.9 });
      else D.fit(pts, [], { l: 40, r: 70, t: 36, b: 40 });
      const hlS = !C.review ? 1 : st === 1 ? 2 : 1, hlH = !C.review ? 1 : st === 2 ? 2 : 1;
      const poly = bm.shape === 'circ' ? G.circleBase(bm.r * sc, 32) : scaledPoly(bm, sc);
      if (!C.problem && nDone < h) D.body({ mesh: prismMesh(poly, y0, y0 + H, { simple: true, smooth: bm.shape === 'circ' ? Array(poly.length).fill(true) : null }), fill: null, edge: 'muted', edgeW: 1.6, hiddenAlpha: 0.5, hidden: true });
      if (C.problem || nDone === h) {
        const whole = slab(bm, sc, y0, y0 + H);
        D.body({ mesh: whole, fill: hlH === 2 ? 'amber' : 'sky', alpha: 0.06, edge: 'ink', edgeW: 2 });
        if (!C.problem && bm.shape === 'circ') {
          const facing = Math.atan2(D.vw.z, D.vw.x);
          for (let k = 1; k < h; k++) D.path(D.circ(v3(0, y0 + k * sc, 0), v3(1, 0, 0), v3(0, 0, 1), bm.r * sc, facing - PI / 2, facing + PI / 2), 'muted', 1.4);
        } else if (!C.problem) {
          const visible = whole.faces.filter(f => f.tag === 'side' && dot3(f.n, D.vw) > 0);
          for (let k = 1; k < h; k++) visible.forEach(f => D.line(v3(f.pts[0].x, y0 + k * sc, f.pts[0].z), v3(f.pts[1].x, y0 + k * sc, f.pts[1].z), 'muted', 1.4));
        }
      } else plates.forEach((p) => D.body({ mesh: p.mesh, fill: hlH === 2 ? 'amber' : 'sky', alpha: p.fly ? 0.34 : 0.2, edge: 'ink', edgeW: 2.2, faceStyle: (f) => (p.k === 0 && f.tag === 'bot' ? {} : f.tag === 'top' && p.k === h - 1 && hlS === 2 ? { fill: 'amber', alpha: 0.5 } : {}) }));
      if (b.thumb) return;
      // ---- 길이 표시: 밑면의 변은 입체 바깥 치수선, 반지름은 윗면에, 높이는 오른쪽 윤곽을 따라 쌓인 만큼
      const topY = y0 + H, full = prismMesh(poly, y0, topY), cenB = v3(0, y0 + H / 2, 0), nShow = C.problem ? h : nDone;
      if (bm.sides) {
        const fs = full.faces.filter((f) => f.tag === 'side'), seen = fs.filter((f) => dot3(f.n, D.vw) > 0.35);
        fs.forEach((f) => {
          const txt = fmtN(bm.sides[f.k]);
          if (seen.includes(f)) D.dim(f.pts[0], f.pts[1], txt, { from: cenB, off: 15 });
          else if (!seen.some((q) => fmtN(bm.sides[q.k]) === txt)) D.dim(f.pts[3], f.pts[2], txt, { from: cenB, off: 15 }); // 가려진 변: 윗면의 변 바깥에
        });
      }
      const topP = poly.map((q) => v3(q[0], topY, q[1])), cTop = G.centroid(topP), cTs = D.px(cTop);
      const xsP = topP.map((p3) => D.px(p3).x), faceW = Math.max(...xsP) - Math.min(...xsP);
      if (bm.shape === 'circ') {
        const rim = D.rimPick(cTop, topP);
        D.radius(cTop, rim, `${bm.r}`, { end: true });
      } else if (bm.shape === 'tri') D.right(topP[0], sub3(topP[1], topP[0]), sub3(topP[2], topP[0]), 0.2 * sc, 'amber');
      else if (bm.shape === 'trap') {
        const dir = unit3(sub3(topP[1], topP[0])), foot = add3(topP[0], mul3(dir, dot3(sub3(topP[2], topP[0]), dir)));
        D.height(foot, topP[2], '높이 4', { a: dir, side: { x: 1, y: 0 }, size: 14, alongFrac: 0.3 });
      }
      const topDone = C.problem || nDone === h || t >= 0.999;
      if (!C.problem && topDone && !(C.tab === 'explore' && window.innerWidth >= 700 && b.W >= 560)) {
        const dxa = bm.shape === 'circ' ? -0.12 * faceW : bm.shape === 'trap' ? 0.2 * faceW : bm.shape === 'tri' ? 0.1 * faceW : -0.2 * faceW;
        aLab(D, cTop, '밑넓이', plainVal(M.S), { dx: dxa, dy: bm.shape === 'circ' ? -0.06 * faceW : 0, maxW: faceW * (bm.shape === 'tri' ? 0.5 : 0.8), size: 15, small: faceW * 0.8 });
      }
      // 높이: 오른쪽 윤곽 세로 모서리(화면에서 가장 오른쪽 꼭짓점)를 따라 쌓인 높이만큼
      if (nShow > 0) {
        let rp = poly[0], rx = -1e9, lp = poly[0], lx = 1e9;
        poly.forEach((q) => { const x = D.px(v3(q[0], y0, q[1])).x; if (x > rx) { rx = x; rp = q; } if (x < lx) { lx = x; lp = q; } });
        D.dim(v3(rp[0], y0, rp[1]), v3(rp[0], y0 + nShow * sc, rp[1]), `높이 ${nShow}`, { side: { x: 1, y: 0 }, off: 16, color: 'amber' });
        // 층 번호: 왼쪽 윤곽을 따라, 판이 얇으면 몇 장씩 건너뛰어(글자가 서로 겹치지 않게)
        if (!C.problem) {
          const platePx = sc * 0.93 * b.k, step = Math.max(1, Math.ceil(15 / Math.max(platePx, 1)));
          plates.forEach((p) => { if (p.loc >= 1 && (p.k + 1) % step === 0) D.tag(v3(lp[0], y0 + (p.k + 0.5) * sc, lp[1]), String(p.k + 1), { size: 13, dx: -11, color: 'muted' }); });
        }
      }
      // 정리 탭 3단계: 결과를 위쪽 한 줄로(해설 재생 중에는 해설이 svShowV 를 켤 때까지 아낌). 탐구·문제 탭·썸네일은 그대로.
      if (C.review && !b.thumb && st >= 3 && !D.lessonHide) G.sumRows(D, [[{ t: `부피 = ${plainVal(M.S)} × ${M.h} = ${plainVal(M.vol)} cm³`, c: 'green' }]], 1);
    };
    return {
      id: 'sv1-4', title: '기둥의 부피', short: '기둥의 부피',
      question: '밑면과 같은 모양의 얇은 판을 한 장씩 쌓으면 기둥이 만들어져. 판이 쌓일수록 부피는 어떻게 늘어날까?',
      anim: { key: 'sT4', dur: 2.5, label: '판 쌓기', start: 1 }, cam0: { yaw: 28, pitch: 22 }, stepT: (st) => 1, thumbT: 1, problemT: 1,
      ctl: (s) => ({ rect: ['sA', 'sB'], tri: ['sK'], trap: ['sU'], circ: ['sR'] }[s.svShape || 'rect'].concat(['sH', 'sT4'])),
      presets: () => SHAPE_ORDER.map((k, i) => ({ group: i === 0 ? '밑면 모양' : '', label: SHAPE_LABEL[k], apply: (st) => { st.svShape = k; st.revealed = false; st.step = 1; }, on: (st) => (st.svShape || 'rect') === k })),
      init: (s) => { s.svShape = 'rect'; s.sA = 4; s.sB = 3; s.sK = 1; s.sU = 3; s.sR = 3; s.sH = 5; s.sT4 = 1; },
      reroll: (s) => {
        s.svShape = pick(SHAPE_ORDER, s.svShape);
        s.sA = rint(2, 7); s.sB = pick([2, 3, 4, 5, 6, 7], s.sA); s.sK = rint(1, 2); s.sU = rint(1, 5); s.sR = rint(2, 5); s.sH = rint(2, 8); s.sT4 = 1;
      },
      model, draw,
      check: (s) => {
        const M = model(s), poly = M.shape === 'circ' ? circleBase(M.bm.r, 4000) : M.bm.poly;
        let A2 = 0;
        poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length]; A2 += p[0] * q[1] - q[0] * p[1]; });
        return { ans: Math.abs(A2) / 2 * M.h, model: vnum(M.vol) };
      },
      steps: (M) => [
        `밑면은 ${M.bm.name}이에요. 밑넓이 $S=${M.bm.areaTex}=${tx(M.S)}\\,\\mathrm{cm}^2$예요. (판 한 장의 부피가 $S\\times1$)`,
        `높이가 $h=${M.h}$이면 판이 $${M.h}$장 쌓여요. 판 한 장의 부피가 $${tx(M.S)}\\times1$이므로 $${M.h}$장이면 $${tx(M.S)}\\times${M.h}$예요.`,
        `(부피) $=S\\times h=${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ],
      view: (M, C) => ({
        card: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[
          {text:'밑넓이',color:'ink'}, {text:`$${M.bm.areaTex}=${tx(M.S)}\\,\\mathrm{cm}^{2}$`,color:'ink'},
          {text:'부피 = 밑넓이 × 높이',color:'ink'}, {text:`$${tx(M.S)}\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$`,color:'ink'}
        ]} : null,
        guide: `<b>판 쌓기</b> 막대를 끌거나 ▶를 눌러 보세요. 같은 모양의 판이 왼쪽에서 가로로 들어와 ${span('sky', '높이')}만큼 위로 쌓여요. 밑면 모양 칩과 길이 막대로 바꿔 보세요.`,
        readouts: (C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [
          rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', M.bm.areaTex.replace(/\\frac\{1\}\{2\}/g, '½').replace(/\\times/g, '×').replace(/\\pi/g, 'π')),
          rd('높이', M.h + ' cm', 'amber', `판 ${M.h}장`),
          rd('부피', plainVal(M.vol) + ' cm³', 'green', `${plainVal(M.S)} × ${M.h}`)
        ],
        formula: `<p>(기둥의 부피) $V=S\\times h$ &nbsp; ($S$ 밑넓이, $h$ 높이)</p>`,
        rule: '기둥의 부피 = (밑넓이) × (높이)',
        notes: notes('부피는 <b>밑넓이를 한 번만</b> 곱해요. 밑면이 2개라고 2를 곱하지 않아요(겉넓이와 달라요).', '밑넓이는 밑면의 모양(직사각형·삼각형·사다리꼴·원)에 맞게 구해요.')
      }),
      prob: (M) => {
        const wrongs = [
          [vadd(M.S, V(M.h)), '부피는 밑넓이에 높이를 더하는 것이 아니라 곱해요.'],
          [vmul(M.vol, 1 / 3), '$\\frac{1}{3}$을 곱하는 것은 뿔의 부피예요. 기둥은 $S\\times h$예요.'],
          [vmul(M.vol, 2), '밑면이 2개라고 2를 곱하지 않아요.'],
          [M.L, '옆넓이를 구했어요. 부피는 밑넓이×높이예요.'],
          [vadd(vmul(M.S, 2), M.L), '겉넓이를 구했어요. 부피는 밑넓이×높이예요.']
        ];
        const bm = M.bm;
        const stem = { rect: `그림과 같이 밑면의 가로가 $${bm.sides ? bm.sides[0] : ''}\\,\\mathrm{cm}$, 세로가 $${bm.sides ? bm.sides[1] : ''}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 직육면체의 부피는?`,
          tri: `그림과 같이 밑면이 세 변의 길이가 $${bm.sides ? bm.sides.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$인 직각삼각형이고 높이가 $${M.h}\\,\\mathrm{cm}$인 삼각기둥의 부피는? (직각을 낀 두 변은 $${bm.legs ? bm.legs.join('\\,\\mathrm{cm},\\ ') : ''}\\,\\mathrm{cm}$)`,
          trap: `그림과 같이 밑면이 윗변 $${bm.u}\\,\\mathrm{cm}$, 아랫변 $${bm.wb}\\,\\mathrm{cm}$, 높이 $4\\,\\mathrm{cm}$인 사다리꼴이고 기둥의 높이가 $${M.h}\\,\\mathrm{cm}$인 사각기둥의 부피는?`,
          circ: `그림과 같이 밑면의 반지름이 $${bm.r}\\,\\mathrm{cm}$이고 높이가 $${M.h}\\,\\mathrm{cm}$인 원기둥의 부피는?` }[M.shape];
        return { tag: '기둥의 부피', key: `${M.shape}|${bm.given}|${M.h}`, stem, choices: mkV(M.vol, wrongs, { dim: 3 }) };
      }
    };
  }

  /* ================================================================ sv1-5 기둥 종합 (직사각형 + 반원 밑면) */
  function sv15() {
    const model = (s) => {
      const w = clamp(Math.round(s.sW), 2, 15), r = clamp(Math.round(s.sRr), 1, 15), h = clamp(Math.round(s.sH5), 2, 20), mode = s.svMode === 'vol' ? 'vol' : 'surf';
      const S = V(2 * w * r, (r * r) / 2), Pm = V(2 * w + 2 * r, r), L = vmul(Pm, h), S2 = vmul(S, 2), tot = vadd(S2, L), vol = vmul(S, h);
      return { w, r, h, mode, started: !!s.sv15Started, S, P: Pm, L, S2, tot, vol, ans: mode === 'vol' ? vol : tot };
    };
    const polyOf = (w, r) => {
      const poly = [[0, -r], [w, -r]], sm = [false, false], N = 14;
      for (let i = 1; i < N; i++) { const a = -PI / 2 + (PI * i) / N; poly.push([w + r * Math.cos(a), r * Math.sin(a)]); sm.push(true); }
      poly.push([w, r]); sm.push(false); poly.push([0, r]); sm.push(false);
      // 아치 모양에서 호의 양 끝(w,-r),(w,r)도 곡면과 평면의 경계(각진 꼭짓점)
      return { poly, sm };
    };
    // 밑면의 변(옆면 번호 k) → 길이 글자: 직사각형의 긴 변 2개 = 가로, 붙은 쪽의 변 = 2×반지름, 곡면 조각은 글자 없음
    const sideText = (M, k) => (k === 0 || k === 15 ? String(M.w) : k === 16 ? String(2 * M.r) : null);
    const draw = (b, s, M, C) => {
      const { w, r, h } = M, sc = 5 / Math.max(w + r, 2 * r, h), hu = h * sc, surf = M.mode === 'surf';
      const { poly, sm } = polyOf(w * sc, r * sc);
      const n = poly.length, st = C.step;
      const lvB = !C.review ? 1 : st <= 1 ? 2 : 1, lvL = !C.review ? 1 : st === 2 ? 2 : 1;
      const t = C.problem || !surf ? 0 : (C.review && !s.lessonOn && !s.lessonEntry) || b.thumb ? 1 : clamp(s.sT5 || 0, 0, 1);
      const arcR = V(0, r), terms = ['w', 'arc', 'w', 'two'];
      if (surf) {
        const sn = solidNet(poly, hu, 1, sm, 8), A = sn.A, B = sn.B, eNow = ease(t), glue = eNow > 0.3 && !C.problem && !b.thumb;
        const grp = (k) => (k === 0 ? 0 : k === 15 ? 2 : k === 16 ? 3 : 1);
        // 옆 패널이 있는 가로 태블릿에서 아래 밑면 끝이 도구막대에 가리지 않게 합니다.
        // 짧은 폰의 종료 카드 위에도 둘레식과 겉넓이식 두 줄의 자리를 남깁니다.
        const bottom = C.lesson && b.W < 560 && b.H < 400 && eNow > 0.78 ? 112 : C.review && b.W >= 560 && b.W < 800 ? 54 : 30;
        netScene(b, s, C, {
          sn, t, fitOpt: { l: b.W < 560 ? 78 : 30, r: (M.started && C.tab === 'explore' && !C.problem && window.innerWidth >= 700 && b.W >= 560 ? 245 : 30), t: 25, b: bottom },
          style: (pc) => Object.assign(roleStyle(pc.tag === 'lat' ? 'lat' : 'base', pc.tag === 'lat' ? lvL : lvB), {
            edgeStyle: (e, p) => {
              if (!glue) return null;
              const k = p.tag === 'lat' ? (e.i === 0 || e.i === 2 ? p.k : -1) : e.nb;
              return k != null && k >= 0 ? { color: 'ink', width: 1.6 } : null;
            }
          }),
          labels: (ctx) => {
            if (b.thumb || (C.review && !s.lessonOn) || (C.tab === 'explore' && ctx.e > 0.5)) return; // 해설 재생 중에는 정리 탭에도 길이·넓이 이름표
            const { D, tp, e } = ctx, vw = D.vw, L = sn.lat, at = ctx.at;
            const solidA = 1 - G.lin01(e, 0.05, 0.45), flatA = G.lin01(e, 0.78, 0.98);
            const cen = at(sn.root, add3(G.centroid(A), v3(0, hu / 2, 0)));
            const vis = (k) => dot3(tp[L[k]].n, vw) > 0.35, topSeen = sn.top >= 0 && tp[sn.top].front;
            // 입체: 보이는 옆면의 밑변 길이는 바깥 치수선, 가려진 면은 윗면의 변 바깥에(같은 길이가 보이면 생략)
            if (solidA > 0.02) {
              const shown = L.map((_, k) => (vis(k) ? sideText(M, k) : null)).filter(Boolean);
              L.forEach((idx, k) => {
                const txt = sideText(M, k);
                if (!txt) return;
                if (vis(k)) D.dim(at(idx, A[k]), at(idx, A[(k + 1) % n]), txt, { from: cen, off: 15, alpha: solidA });
                else if (topSeen && !shown.includes(txt)) D.dim(at(idx, B[k]), at(idx, B[(k + 1) % n]), txt, { from: cen, off: 15, alpha: solidA });
              });
            }
            // 높이: 가장 왼쪽 세로 모서리 바깥
            let hk = null, xL = 1e9;
            L.forEach((idx, k) => [k, (k + 1) % n].forEach((j) => { const x = D.px(at(idx, A[j])).x; if (x < xL - 0.5) { xL = x; hk = { idx, j }; } }));
            D.dim(at(hk.idx, A[hk.j]), at(hk.idx, B[hk.j]), `높이 ${h}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
            // 밑면: 직사각형 가운데에 넓이 이름표, 반원의 중심에서 반지름
            let first = true;
            [sn.top, sn.bot].forEach((k) => {
              if (k < 0 || !tp[k].front) return;
              const pts = k === sn.top ? B : A, rc = G.centroid([pts[0], pts[1], pts[15], pts[16]]), c3 = at(k, rc);
              const xs = pts.map((p3) => D.px(at(k, p3)).x), faceW = Math.max(...xs) - Math.min(...xs);
              if (!C.problem && C.review && lessonReady(s, 'svBaseReady')) aLab(D, at(k, lerp3(rc, G.centroid([pts[0], pts[16]]), 0.2)), '밑넓이', plainVal(M.S), { maxW: faceW * 0.5, size: 14, small: faceW * 0.5 });
              if (!first) return;
              first = false;
              const ctr = at(k, mid3(pts[1], pts[15]));
              D.radius(ctr, D.rimPick(ctr, pts.slice(2, 15).map((p3) => at(k, p3)), k === sn.top && flatA > 0.5 ? { x: Math.cos(25 * DEG), y: -Math.sin(25 * DEG) } : undefined), `반지름 ${r}`, { end: true });
            });
            // 전개도: 옆면 조각 아래 치수선 + 둘레 괄호 + 옆넓이 + 합
            if (flatA > 0.02 && !C.problem) {
              const grpK = [[0], Array.from({ length: 14 }, (_, i) => i + 1), [15], [16]];
              const info = grpK.map((ks, gi) => {
                const cs = [];
                ks.forEach((k) => [k, (k + 1) % n].forEach((j) => { const p3 = at(L[k], A[j]), q = D.px(p3); cs.push({ p3, x: q.x, y: q.y }); }));
                const lo = cs.reduce((a0, c) => (c.x < a0.x ? c : a0)), hi = cs.reduce((a0, c) => (c.x > a0.x ? c : a0));
                const km = ks[Math.floor(ks.length / 2)], len = gi === 1 ? plainVal(arcR) : String(gi === 3 ? 2 * r : w);
                return { gi, lo, hi, x0: lo.x, x1: hi.x, color: G.pairColor(gi), len, dim: gi === 1 ? `호의 길이 ${len}` : len, area: gi === 1 ? plainVal(vmul(arcR, h)) : String((gi === 3 ? 2 * r : w) * h), c3: at(L[km], G.centroid(sn.net.pieces[L[km]].pts)) };
              }).sort((p0, q0) => p0.x0 - q0.x0);
              const rowY = Math.max(...ctx.all.map((p) => D.px(p).y)) + 16, xl = info[0].x0, xr = info[3].x1;
              info.forEach((g) => D.dim(g.lo.p3, g.hi.p3, (lessonReady(s, 'svOtherReady') || g.gi !== 1) ? dimTxt(D, g) : '호의 길이', { side: { x: 0, y: 1 }, off: rowY - g.lo.y, color: g.color, alpha: flatA }));
              if (lessonReady(s, 'svOtherReady')) D.brace({ x: xl, y: rowY }, { x: xr, y: rowY }, `밑면의 둘레 = ${info.map((g) => g.len).join('+')} = ${plainVal(M.P)}`, { px: true, side: { x: 0, y: 1 }, off: 14, color: 'amber', alpha: flatA });
              if (lessonReady(s, 'svSideReady')) info.forEach((g) => aLab(D, g.c3, areaName(D, g, '옆넓이'), g.area, { maxW: (g.x1 - g.x0) * 0.9, size: 14, alpha: flatA }));
              if (!D.lessonHide) fitLine(D, (xl + xr) / 2, rowY + 76, `겉넓이 = (${plainVal(M.S)})×2 + (${info.map((g) => g.area).join('+')}) = ${plainVal(M.tot)}`, { alpha: flatA });
            }
          }
        });
        return;
      }
      // 부피: 직육면체와 반원기둥을 실제 붙은 면에서 분리합니다.
      if (M.started && C.tab === 'explore' && !C.problem && !b.thumb) {
        const D = scene3(b, s, C), cx = (w + r) * sc / 2, e = ease(clamp(s.sT5 || 0, 0, 1));
        const box = [[-cx,-r*sc],[w*sc-cx,-r*sc],[w*sc-cx,r*sc],[-cx,r*sc]];
        const half = poly.slice(1,16).map(q => [q[0]-cx,q[1]]);
        const offsets = [D.hx(-0.7*e),D.hx(0.7*e)], shapes = [box,half];
        const meshes = shapes.map((q,i) => xfMesh(prismMesh(q,0,hu,{simple:true,smooth:i ? Array(q.length).fill(true).map((v,k)=>k<q.length-1) : null}),G.shiftT(offsets[i])));
        const points = meshes.flatMap(m => m.faces.flatMap(f => f.pts));
        D.fit(points,[],{l:30,r:(window.innerWidth>=700&&b.W>=560?245:30),t:30,b:45});
        meshes.forEach(m => D.body({mesh:m,fill:'sky',alpha:0.06,edge:'ink',edgeW:2}));
        return;
      }
      // 문제·정리에서는 원래의 기둥을 보여 줍니다.
      const D = scene3(b, s, C), cxm = ((w + r) * sc) / 2, pc = poly.map((q) => [q[0] - cxm, q[1]]), ctr = v3(0, hu / 2, 0);
      const mesh = prismMesh(pc, 0, hu, { smooth: sm, ctr });
      const pts = []; pc.forEach((q) => { pts.push(v3(q[0], 0, q[1])); pts.push(v3(q[0], hu, q[1])); });
      D.fit(pts, [], { l: 84, r: 56, t: 40, b: C.problem ? 40 : 96 });
      D.body({ mesh, fill: 'sky', alpha: 0.2, edge: 'ink', faceStyle: (f) => (f.tag === 'top' || f.tag === 'bot' ? { fill: 'amber', alpha: lvB === 2 ? 0.46 : 0.34 } : f.tag === 'side' ? { fill: 'green', alpha: lvL === 2 ? 0.34 : 0.2 } : {}) });
      if (b.thumb) return;
      if (!C.problem) for (let k = 1; k < h; k++) D.path(pc.map((q) => v3(q[0], (hu * k) / h, q[1])), 'muted', 1.1, { close: true, alpha: 0.5 });
      const cenB = v3(0, hu / 2, 0), fs = mesh.faces.filter((f) => f.tag === 'side'), seen = fs.filter((f) => dot3(f.n, D.vw) > 0.35), shown = seen.map((f) => sideText(M, f.k)).filter(Boolean);
      fs.forEach((f) => {
        const txt = sideText(M, f.k);
        if (!txt) return;
        if (seen.includes(f)) D.dim(f.pts[0], f.pts[1], txt, { from: cenB, off: 15 });
        else if (!shown.includes(txt)) D.dim(f.pts[3], f.pts[2], txt, { from: cenB, off: 15 });
      });
      let lp = pc[0], lx = 1e9;
      pc.forEach((q) => { const x = D.px(v3(q[0], 0, q[1])).x; if (x < lx) { lx = x; lp = q; } });
      D.dim(v3(lp[0], 0, lp[1]), v3(lp[0], hu, lp[1]), `높이 ${h}`, { side: { x: -1, y: 0 }, off: 18, color: 'amber' });
      const topP = pc.map((q) => v3(q[0], hu, q[1])), rc = G.centroid([topP[0], topP[1], topP[15], topP[16]]), xs2 = topP.map((p3) => D.px(p3).x), faceW = Math.max(...xs2) - Math.min(...xs2);
      const ctr2 = mid3(topP[1], topP[15]);
      D.radius(ctr2, D.rimPick(ctr2, topP.slice(2, 15)), `반지름 ${r}`, { end: true });
      if (!C.problem) {
        if (lessonReady(s, 'svBaseReady')) aLab(D, lerp3(rc, G.centroid([topP[0], topP[16]]), 0.2), '밑넓이', plainVal(M.S), { maxW: faceW * 0.5, size: 14, small: faceW * 0.5 });
        const low = Math.max(...pts.map((p3) => D.px(p3).y)), cx2 = (Math.min(...pts.map((p3) => D.px(p3).x)) + Math.max(...pts.map((p3) => D.px(p3).x))) / 2;
        if (lessonReady(s, 'svShowV')) fitLine(D, cx2, low + 40, `부피 = 밑넓이 × 높이 = (${plainVal(M.S)})×${h} = ${plainVal(M.vol)}`);
      }
    };
    return {
      id: 'sv1-5', title: '기둥 종합 문제', short: '기둥 종합',
      question: '밑면이 직사각형에 반원을 붙인 모양이어도 같은 방법으로 풀 수 있을까? 겉넓이와 부피를 각각 구해 보자.',
      anim: { key: 'sT5', dur: 1.5, label: '다시 보기' }, cam0: { yaw: 28, pitch: 22 }, problemT: 1,
      ctl: () => ['sW', 'sRr', 'sH5'],
      presets: () => [{ group: '구하는 것', label: '겉넓이', apply: (st, lab) => { st.svMode = 'surf'; st.sv15Started = true; st.sT5 = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.sT5 === 0; }, on: (st) => st.sv15Started && st.svMode !== 'vol' }, { label: '부피', apply: (st, lab) => { st.svMode = 'vol'; st.sv15Started = true; st.sT5 = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0; st.revealed = false; st.step = 0; lab?._buildProblem?.(); st.playing = st.sT5 === 0; }, on: (st) => st.sv15Started && st.svMode === 'vol' }],
      init: (s) => { s.sW = 4; s.sRr = 2; s.sH5 = 5; s.sT5 = 0; s.svMode = 'surf'; s.sv15Started = false; },
      reroll: (s) => { s.sW = rint(2, 8); s.sRr = rint(1, 4); s.sH5 = rint(2, 8); s.sT5 = 0; s.svMode = pick(['surf', 'vol'], s.svMode); },
      model, draw,
      check: (s) => {
        const M = model(s), N = 4000, w = M.w, r = M.r;
        let per = 2 * w + 2 * r, A = 2 * w * r;
        for (let i = 0; i < N; i++) { const a0 = -PI / 2 + (PI * i) / N, a1 = -PI / 2 + (PI * (i + 1)) / N; per += Math.hypot(r * (Math.cos(a1) - Math.cos(a0)), r * (Math.sin(a1) - Math.sin(a0))); A += 0.5 * r * r * Math.sin(a1 - a0); }
        return { ans: M.mode === 'vol' ? A * M.h : 2 * A + per * M.h, model: vnum(M.ans) };
      },
      steps: (M) => M.mode === 'vol' ? [
        `밑면은 직사각형($${M.w}\\times${2 * M.r}$)과 반원(반지름 $${M.r}$)을 붙인 모양이에요. 직사각형의 넓이는 $${M.w}\\times${2 * M.r}=${2 * M.w * M.r}$예요.`,
        `반원의 넓이는 $\\frac{1}{2}\\times\\pi\\times${M.r}^2=${tx(V(0, M.r * M.r / 2))}$이므로 밑넓이 $S=${tx(M.S)}$예요.`,
        `(부피) $=S\\times h=(${tx(M.S)})\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^3$예요.`
      ] : [
        `밑넓이: 직사각형 $${2 * M.w * M.r}$ + 반원 $${tx(V(0, M.r * M.r / 2))}$ $=${tx(M.S)}$이고 밑면이 2개이므로 $2S=${tx(M.S2)}\\,\\mathrm{cm}^2$예요.`,
        `밑면의 둘레(붙인 변은 뺌): $${M.w}+${M.w}+${2 * M.r}+\\pi\\times${M.r}=${tx(M.P)}$. 옆넓이 $=(${tx(M.P)})\\times${M.h}=${tx(M.L)}\\,\\mathrm{cm}^2$예요.`,
        `(겉넓이) $=${tx(M.S2)}+${tx(M.L)}=${tx(M.tot)}\\,\\mathrm{cm}^2$예요.`
      ],
      view: (M, C) => ({
        card: (M.started && C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? {title:'',lines:[
          {text:'밑넓이',color:'ink'}, {text:`$${M.w}\\times${2*M.r}+\\frac{1}{2}\\pi\\times${M.r}^{2}=${tx(M.S)}\\,\\mathrm{cm}^{2}$`,color:'ink'},
          {text:M.mode === 'vol' ? '부피' : '겉넓이',color:'ink'}, {text:M.mode === 'vol' ? `$(${tx(M.S)})\\times${M.h}=${tx(M.vol)}\\,\\mathrm{cm}^{3}$` : `$2\\times(${tx(M.S)})+(${tx(M.P)})\\times${M.h}=${tx(M.tot)}\\,\\mathrm{cm}^{2}$`,color:'ink'}
        ]} : null,
        guide: `<b>겉넓이</b>와 <b>부피</b>를 눌러 살펴보세요. 밑면의 둘레에는 반원의 호가 포함돼요.`,
        readouts: (M.started && C.tab === 'explore' && window.innerWidth >= 700 && document.querySelector('.apl-canvas-wrap')?.clientWidth >= 560) ? [] : [
          rd('밑넓이', plainVal(M.S) + ' cm²', 'sky', `${2 * M.w * M.r} + ${plainVal(V(0, M.r * M.r / 2))}`),
          rd('밑면의 둘레', plainVal(M.P) + ' cm', 'amber', `${M.w} + ${M.w} + ${2 * M.r} + π × ${M.r}`),
          rd('겉넓이', plainVal(M.tot) + ' cm²', M.mode === 'surf' ? 'green' : 'muted'),
          rd('부피', plainVal(M.vol) + ' cm³', M.mode === 'vol' ? 'green' : 'muted')
        ],
        formula: `<p>(겉넓이) $=$ (밑넓이)$\\times2+$(밑면의 둘레)$\\times$(높이) &nbsp;,&nbsp; (부피) $=$ (밑넓이)$\\times$(높이)</p>`,
        rule: '밑면이 복잡해도: 밑넓이와 밑면의 둘레만 구하면 기둥은 모두 같은 식',
        notes: notes('밑면의 둘레에는 붙인 변(반원의 지름)이 들어가지 않아요. 바깥 테두리만 세요: 가로 2개 + 반지름 2개 + 반원의 호.', '반원의 넓이는 원의 <b>절반</b> $\\frac{1}{2}\\pi r^2$예요.')
      }),
      prob: (M) => {
        const half = V(0, M.r * M.r / 2);
        let wrongs, stem;
        if (M.mode === 'vol') {
          wrongs = [
            [vmul(V(2 * M.w * M.r), M.h), '반원 부분의 넓이를 빠뜨렸어요.'],
            [vmul(V(2 * M.w * M.r, M.r * M.r), M.h), '반원의 넓이는 원의 절반 $\\frac{1}{2}\\pi r^2$이에요. 원 전체를 더했어요.'],
            [M.S, '높이를 곱하지 않았어요.'],
            [vmul(M.vol, 2), '부피에는 2를 곱하지 않아요.'],
            [vadd(M.S, V(M.h)), '밑넓이에 높이를 더하지 않고 곱해요.']
          ];
          stem = `그림과 같이 밑면이 직사각형($${M.w}\\,\\mathrm{cm}\\times${2 * M.r}\\,\\mathrm{cm}$)에 반원(반지름 $${M.r}\\,\\mathrm{cm}$)을 붙인 모양이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 부피는?`;
        } else {
          wrongs = [
            [vadd(M.S2, vmul(V(2 * M.w + 2 * M.r), M.h)), '옆면의 가로에 반원의 호 $\\pi r$를 빠뜨렸어요.'],
            [vadd(M.S2, vmul(V(2 * M.w + 4 * M.r, M.r), M.h)), '붙인 변(반원의 지름)은 겉면이 아니므로 둘레에 들어가지 않아요.'],
            [vadd(M.S, M.L), '밑면은 2개예요.'],
            [vadd(vmul(vadd(V(2 * M.w * M.r), V(0, M.r * M.r)), 2), M.L), '반원의 넓이는 원의 절반이에요.'],
            [M.vol, '부피를 구했어요.']
          ];
          void half;
          stem = `그림과 같이 밑면이 직사각형($${M.w}\\,\\mathrm{cm}\\times${2 * M.r}\\,\\mathrm{cm}$)에 반원(반지름 $${M.r}\\,\\mathrm{cm}$)을 붙인 모양이고 높이가 $${M.h}\\,\\mathrm{cm}$인 기둥의 겉넓이는?`;
        }
        return { tag: M.mode === 'vol' ? '기둥의 부피 (종합)' : '기둥의 겉넓이 (종합)', key: `${M.mode}|${M.w}|${M.r}|${M.h}`, stem, choices: mkV(M.ans, wrongs, { dim: M.mode === 'vol' ? 3 : 2 }) };
      }
    };
  }

  G.register(10, 't1', '① 기둥', '기둥', PARAMS, [sv11(), sv12(), sv13(), sv14(), sv15()]);
})();
