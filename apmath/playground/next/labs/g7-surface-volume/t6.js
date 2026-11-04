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
    return {kind,mode,k,h,r,a,topH,l,join,lowerSide,upperSide,
      lowerSurface,upperSurface,hidden,surface,lowerVolume,upperVolume,
      volume,ans:mode==='vol'?volume:surface,...TYPES[kind]};
  };
  const draw = (b,s,M,C) => {
    const D = scene3(b,s,C), square = M.kind==='pyramid';
    const width = square?M.a:2*M.r, capHeight = M.kind==='hemi'?M.r:M.topH;
    const scale = 4 / Math.max(width,M.h+capHeight);
    const w=width*scale,r=M.r*scale,a=M.a*scale,h=M.h*scale,
      topH=M.topH*scale,y0=-h/2,yj=h/2;
    const t=C.problem?0:C.t, open=ease(lin01(t,0,0.55));
    const shift=D.hx(open*w*0.9), unfolded=ease(lin01(t,0.48,1));
    const narrow=b.W<560, showSolid=!(narrow&&unfolded>0.12);
    const base = square ? boxMesh(-a/2,a/2,y0,yj,-a/2,a/2) :
      revolveMesh([[0,0],[r,0],[r,h],[0,h]],
        {O:v3(0,y0,0),N:44,tags:['bot','side','top']});
    let top;
    if (M.kind==='hemi') top=revolveMesh([[0,0],[r,0],
      ...sphereProfile(r,0,90,15).slice(1)],
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
    const bb=bboxOf(pts.map(D.P)),rowTop=bb.y1+0.8;
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
    const bars=!C.problem&&M.mode==='vol'?[
      {v:vnum(M.lowerVolume),fill:'sky',label:M.lower+' '+plainVal(M.lowerVolume)},
      {v:vnum(M.upperVolume),fill:'green',label:M.upper+' '+plainVal(M.upperVolume)}
    ]:null;
    const reg=rows?[{x:-rows.total/2,y:rowTop},
      {x:rows.total/2,y:rowTop+rows.height+2.3}]:
      bars?[{x:-3,y:rowTop},{x:3,y:rowTop+2.4}]:[];
    D.fit(showSolid?pts:[],unfolded>0.06&&reg.length?reg:[],
      {l:83,r:76,t:50,b:85});
    if(showSolid){
      D.body({mesh:base,fill:'sky',alpha:0.22,edge:'ink',
        faceStyle:f=>f.tag==='top'&&open<0.07?{skip:true}:
          f.tag==='top'?{fill:'red',alpha:0.25}:{}});
      D.body({mesh:top,fill:'green',alpha:0.28,edge:'ink',
        faceStyle:f=>f.tag==='bot'&&open<0.07?{skip:true}:
          f.tag==='bot'?{fill:'red',alpha:0.25}:{}});
      if(open>0.07){
        if(square){
          const q=[v3(-a/2,yj,-a/2),v3(a/2,yj,-a/2),
            v3(a/2,yj,a/2),v3(-a/2,yj,a/2)];
          for(let i=0;i<4;i++)D.line(q[i],q[(i+1)%4],'red',2.5);
        } else D.path(D.circ(v3(0,yj,0),v3(1,0,0),v3(0,0,1),
          r,0,TAU,48),'red',2.5);
      }
      if(square){
        D.dim(v3(-a/2,y0,a/2),v3(a/2,y0,a/2),String(M.a),
          {from:v3(0,0,0),off:16});
      } else {
        const c=v3(0,yj,0);
        D.radius(c,add3(c,mul3(D.rightFront(),r)),
          '반지름 '+M.r,{end:true,gap:12,color:'amber'});
      }
      D.dim(v3(-w/2,y0,square?w/2:0),
        v3(-w/2,yj,square?w/2:0),'높이 '+M.h,
        {side:{x:-1,y:0},off:17,color:'amber'});
      if(M.kind!=='hemi'){
        const foot=add3(v3(0,yj,0),shift);
        const apex=add3(v3(0,yj+topH,0),shift);
        D.height(foot,apex,'높이 '+M.topH,{color:'amber',side:{x:-1,y:0}});
        if(square){
          const faceMid=add3(v3(0,yj,a/2),shift);
          D.line(faceMid,apex,'amber',2,{dash:[5,4]});
          D.edgeLab(faceMid,apex,'옆면 높이 '+M.l,{side:{x:1,y:0},gap:6});
        }else D.edgeLab(add3(v3(r,yj,0),shift),apex,
          '모선 '+M.l,{side:{x:1,y:0},gap:6});
      }
    }
    if(rows&&unfolded>0.1){
      G.drawTileRows(D,rows,0,rowTop);
      if(unfolded>0.96)b.text({x:0,y:rowTop+rows.height+0.8},
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
    question:'접합면은 겉넓이에서 빼고, 부피는 두 입체의 부피를 더해 보자.',
    cam0:{yaw:28,pitch:24},thumbT:0,problemT:0,
    anim:{key:'jcT',dur:5,label:'분리해서 맞붙은 면 보기'},
    stepT:n=>[0,0.12,0.4,0.82,1][Math.min(n,4)],
    ctl:()=>['jcK','jcH','jcT'],
    presets:()=>Object.keys(TYPES).map((k,i)=>({
      group:i===0?'필수 결합 모형':'',label:TYPES[k].name,
      apply:s=>{s.jcKind=k;s.jcT=0;},on:s=>kindOf(s)===k
    })).concat([
      {group:'구하는 것',label:'겉넓이',
        apply:s=>{s.jcMode='surf';},on:s=>s.jcMode!=='vol'},
      {label:'부피',apply:s=>{s.jcMode='vol';},on:s=>s.jcMode==='vol'}
    ]),
    init:s=>{s.jcKind='hemi';s.jcMode='surf';s.jcK=1;s.jcH=5;s.jcT=0;},
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
    view:M=>({
      guide:'<b>원기둥+반구 · 원기둥+원뿔 · 사각기둥+사각뿔</b> 중 하나를 골라 보세요. '+
        '<b>분리해서 맞붙은 면 보기</b>를 움직이면 접합면과 면적 비교 그림을 볼 수 있어요.'+
        (M.kind==='hemi'?' 반구의 곡면은 전개할 수 없어 같은 넓이의 원 두 개로 비교합니다.':''),
      readouts:M.mode==='vol'?[
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
        '반구 곡면은 전개도가 아니며 같은 넓이인 원 두 개로 비교해요.')
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
