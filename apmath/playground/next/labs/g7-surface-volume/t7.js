/* 남은 구: 서로 수직인 중심 절단면에서 3/4 또는 7/8이 남은 경우. */
(function(){
'use strict';
const G=window.APL_SV;if(!G)return;
const {PI,P,V,vadd,vnum,tx,plainVal,clamp,rint,mkV,rd,notes,scene3,v3,revolveMesh,sphereProfile,cube8}=G;
const PARAMS={remR:P('구의 반지름',1,12,1,3,{color:'ink',format:v=>v+' cm'}),remT:P('잘라 보기',0,1,.01,1,{color:'ink'})};
const model=s=>{
 const r=clamp(Math.round(s.remR||3),1,12), oct=s.remKind==='seven', vol=s.remMode==='vol';
 const fraction=oct?'7/8':'3/4', curve=V(0,(oct?3.5:3)*r*r), flat=V(0,(oct?.75:1)*r*r), area=vadd(curve,flat);
 const volume=V(0,(oct?7/6:1)*r*r*r), ans=vol?volume:area;
 return {r,oct,vol,fraction,curve,flat,area,volume,ans};
};
const draw=(b,s,M,C)=>{
 const D=scene3(b,s,C), R=1.7, start=95*PI/180, end=start+3*PI/2, e=C.problem||!s.remStarted?1:G.ease(C.t);
 const compare=C.tab==='explore'&&!C.problem&&!b.thumb&&b.W>=1000, left=compare?D.hx(-2.2):v3(0,0,0), right=compare?D.hx(2.2):v3(0,0,0);
 const projected=[D.P(right)].concat(compare?[D.P(left)]:[]).flatMap(q=>[{x:q.x-R,y:q.y-R},{x:q.x+R,y:q.y+R}]);
 D.fit([],projected,{l:b.W<500?12:30,r:(!C.problem&&!b.thumb&&window.innerWidth>=700&&b.W>=560?245:b.W<500?12:30),t:compare?65:C.tab==='explore'?40:b.W<500?12:25,b:compare?70:b.W<500?12:25});
 if(compare){
  const whole=revolveMesh(sphereProfile(R,-90,90,48),{N:64,O:left});
  D.body({mesh:whole,fill:'sky',alpha:.025,edge:'ink',edgeW:2});
  D.path(D.circ(left,v3(1,0,0),v3(0,0,1),R,0,2*PI,72),'muted',1.3,{dash:[5,4],alpha:.6});
  const a=D.P(left),z=D.P(right);D.arrow({x:a.x+R+.15,y:a.y-R-.3},{x:z.x-R-.15,y:z.y-R-.3},'muted',1.5);
  b.text({x:a.x,y:a.y+R},'원래 구',{dy:16,size:D.fs(13),color:'ink',weight:700});
  b.text({x:z.x,y:z.y+R},'남은 구',{dy:16,size:D.fs(13),color:'ink',weight:700});
 }
 if(e<.99){const full=G.xfMesh(revolveMesh(sphereProfile(R,-90,90,48),{N:64}),G.shiftT(right));D.body({mesh:full,fill:'sky',alpha:.03*(1-e),edge:'ink',edgeW:2,edgeFn:()=>({alpha:1-e})});}
 const eq=e=>Math.abs(e.a.y)<1e-6&&Math.abs(e.b.y)<1e-6;
 if(!M.oct){
  const m=G.xfMesh(revolveMesh(sphereProfile(R,-90,90,48),{N:64,a0:start,a1:end}),G.shiftT(right));
  D.body({mesh:m,fill:'sky',alpha:.04*e,edge:'ink',edgeW:2.2,edgeFn:()=>({alpha:e}),faceStyle:f=>f.cut?{fill:f.tag==='cut0'?'sky':'amber',alpha:.1*e}:{}});
 }else{
  const lower=G.xfMesh(revolveMesh(sphereProfile(R,-90,0,32),{N:64}),G.shiftT(right));
  const upper=G.xfMesh(revolveMesh([[0,0],...sphereProfile(R,0,90,32)],{N:64,a0:start,a1:end,tags:['cap']}),G.shiftT(right));
  D.body({mesh:lower,fill:'sky',alpha:.04*e,edge:'ink',edgeW:2.2,edgeFn:edge=>eq(edge)?{skip:true}:{alpha:e}});
  D.body({mesh:upper,fill:'sky',alpha:.04*e,edge:'ink',edgeW:2.2,edgeFn:edge=>eq(edge)?{skip:true}:{alpha:e},faceStyle:f=>f.tag==='cap'?{skip:true}:f.cut?{fill:f.tag==='cut0'?'sky':'amber',alpha:.1*e}:{}});
  // 떼어 낸 1/8 자리에 드러나는 수평 사분원 단면.
  const arc=[right];for(let i=0;i<=36;i++){const th=end+(PI/2)*i/36;arc.push(G.add3(right,v3(R*Math.cos(th),0,R*Math.sin(th))));}
  D.path(arc,'ink',2,{close:true,fill:'green',fillAlpha:.08*e,alpha:e});
 }
 const center=right, ends=[start,end].map(a=>G.add3(right,v3(R*Math.cos(a),0,R*Math.sin(a))));
 if(e>.95) D.right(center,G.sub3(ends[0],center),G.sub3(ends[1],center),R*0.11,'ink');
 const rim=ends.reduce((best,p)=>Math.abs(D.px(p).x-D.px(center).x)>Math.abs(D.px(best).x-D.px(center).x)?p:best);
 if(e>.95) D.radius(center,rim,String(M.r),{color:'ink',gap:5});
};
G.register(31,'t7','남은 구','남은 구',PARAMS,[{
 id:'sv3-7',title:'잘라 내고 남은 구',short:'3/4·7/8 남은 구',
 question:'잘라 낸 뒤 남은 곡면과 새로 드러난 단면을 구분해 보세요.',
 cam0:{yaw:28,pitch:22},anim:{key:'remT',dur:2.2,hideActions:true},ctl:()=>['remR'],
 presets:()=>[
  {group:'남은 부분',label:'3/4',apply:(s,lab)=>{s.remKind='three';s.remStarted=true;s.remT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.playing=s.remT===0;s.revealed=false;s.step=0;lab?._buildProblem?.();},on:s=>s.remKind!=='seven'},
  {label:'7/8',apply:(s,lab)=>{s.remKind='seven';s.remStarted=true;s.remT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.playing=s.remT===0;s.revealed=false;s.step=0;lab?._buildProblem?.();},on:s=>s.remKind==='seven'},
  {group:'구하는 것',label:'겉넓이',apply:(s,lab)=>{s.remMode='surf';s.remStarted=true;s.remT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.playing=s.remT===0;s.revealed=false;s.step=0;lab?._buildProblem?.();},on:s=>s.remMode!=='vol'},
  {label:'부피',apply:(s,lab)=>{s.remMode='vol';s.remStarted=true;s.remT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.playing=s.remT===0;s.revealed=false;s.step=0;lab?._buildProblem?.();},on:s=>s.remMode==='vol'}],
 init:s=>{s.remR=3;s.remKind='three';s.remMode='surf';s.remT=1;s.remStarted=false;},
 reroll:s=>{s.remR=rint(2,8);},model,draw,
 check:s=>{const M=model(s),r=M.r;return {ans:M.vol?(M.oct?7/6:1)*PI*r**3:((M.oct?3.5:3)+(M.oct?.75:1))*PI*r*r,model:vnum(M.ans)};},
 steps:M=>M.vol?[
  `전체 구의 부피는 $\\frac{4}{3}\\pi\\times${M.r}^3$이에요.`,
  `남은 부분은 전체의 $${M.oct?'\\frac78':'\\frac34'}$이에요.`,
  `남은 부피는 $${tx(M.volume)}\\,\\mathrm{cm}^3$예요.`
 ]:[
  `남은 곡면은 전체 구의 겉넓이 $4\\pi r^2$의 $${M.oct?'\\frac78':'\\frac34'}$이에요.`,
  M.oct?'새 단면은 사분원 3개예요.':'새 단면은 반원 2개예요.',
  `겉넓이는 곡면과 새 단면을 더해 $${tx(M.curve)}+${tx(M.flat)}=${tx(M.area)}\\,\\mathrm{cm}^2$예요.`
 ],
 view:(M,C)=>({
  card:(C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:M.vol?[
   {text:'전체 구의 부피',color:'ink'}, {text:`$\\frac43\\pi\\times${M.r}^3\\,\\mathrm{cm}^3$`,color:'ink'},
   {text:'남은 부피',color:'ink'}, {text:`$\\frac43\\pi\\times${M.r}^3\\times${M.oct?'\\frac78':'\\frac34'}=${tx(M.volume)}\\,\\mathrm{cm}^3$`,color:'ink'}
  ]:[
   {text:'남은 곡면',color:'ink'}, {text:`$4\\pi\\times${M.r}^2\\times${M.oct?'\\frac78':'\\frac34'}=${tx(M.curve)}\\,\\mathrm{cm}^2$`,color:'ink'},
   {text:M.oct?'새 단면: 사분원 3개':'새 단면: 반원 2개',color:'ink'},
   {text:`$${M.oct?'\\frac14':'\\frac12'}\\pi\\times${M.r}^2\\times${M.oct?3:2}=${tx(M.flat)}\\,\\mathrm{cm}^2$`,color:'ink'},
   {text:'겉넓이',color:'ink'}, {text:`$${tx(M.curve)}+${tx(M.flat)}=${tx(M.area)}\\,\\mathrm{cm}^2$`,color:'ink'}
  ]}:null,
  tip:C.tab==='explore'?(M.vol?'부피는 남은 비율만큼 구 전체 부피에 곱해요.':'남은 곡면뿐 아니라 잘라서 새로 생긴 단면도 더해요.'):null,
  guide:`서로 수직이고 구의 중심을 지나는 평면으로 ${M.oct?'1/8':'1/4'}을 잘라 냈어요. 남은 입체는 구의 ${M.fraction}입니다. ${M.vol?'전체 부피에 남은 비율을 곱해요.':'새로 생긴 평평한 면도 겉넓이에 더해요.'}`,
  readouts:(C.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?[]:M.vol?[rd('남은 부피',plainVal(M.volume)+' cm³','ink')]:[rd('남은 곡면',plainVal(M.curve)+' cm²','ink'),rd('새 단면',plainVal(M.flat)+' cm²','ink'),rd('전체 겉넓이',plainVal(M.area)+' cm²','ink')],
  formula:M.vol?`<p>남은 부피 $=\\frac43\\pi r^3\\times${M.oct?'\\frac78':'\\frac34'}$</p>`:`<p>겉넓이 $=$ 남은 곡면 $+$ 새 단면</p>`,
  notes:notes('잘라 낸 비율과 남은 비율을 구분해요.','겉넓이는 새로 생긴 단면도 더해요. 부피는 남은 비율을 곱해요.')
 }),
 prob:M=>({tag:`${M.fraction} 남은 구`,key:`${M.fraction}|${M.vol}|${M.r}`,
  stem:`반지름이 $${M.r}\\,\\mathrm{cm}$인 구를 중심을 지나는 서로 수직인 ${M.oct?'세':'두'} 평면으로 잘라 얻은 ${M.oct?'여덟':'네'} 조각 중 하나를 제거했다. 남은 입체의 ${M.vol?'부피':'겉넓이'}는?`,
  choices:mkV(M.ans,M.vol?[[V(0,4*M.r**3/3),'전체 구의 부피예요.'],[V(0,M.r**3/3),'잘라 낸 부분을 구했어요.'],[V(0,M.r**3/2),'반구와 구분해요.'],[V(0,2*M.r**3),'남은 비율을 확인해요.']]:[[M.curve,'새로 생긴 단면을 더해야 해요.'],[V(0,4*M.r*M.r),'단면을 빠뜨리거나 남은 곡면을 확인해요.'],[V(0,5*M.r*M.r),'남은 비율과 단면 수를 확인해요.'],[V(0,2*M.r*M.r),'남은 곡면을 확인해요.']],{dim:M.vol?3:2})})
}]);
})();
