/* 직각삼각형을 밑면으로 하는 삼각뿔의 겉넓이와 부피. */
(function(){
'use strict'; const G=window.APL_SV;if(!G)return;
const {v3,V,P,mkV,rd,notes,scene3,sub3,cross3,unit3,mul3,dot3,centroid,polyMesh,prismMesh,xfMesh,shiftT,netBuild,netPose,applyT,bboxOf,ease}=G;
const A=v3(0,0,0),B=v3(6,0,0),C=v3(0,0,8),D=v3(0,9,0),pts=[[A,C,B],[A,B,D],[B,C,D],[C,A,D]],centre=v3(1.5,2.25,2);
function makeNet(){
 const f=pts.map((p,i)=>{let n=unit3(cross3(sub3(p[1],p[0]),sub3(p[2],p[0])));if(dot3(n,sub3(centroid(p),centre))<0)n=mul3(n,-1);
  return {pts:p,n,tag:i?'side':'base',parent:i?0:-1,hinge:i?[p[0],p[1]]:null,edges:p.map((_,j)=>({i:j,kind:'c'}))};});return netBuild(f,0);
}
const net=makeNet(),mesh=polyMesh(pts.map((p,i)=>({pts:p,tag:i?'side':'base'})),centre);
const PARAMS={tpT:P('전개',0,1,.01,1,{color:'green'})};
const model=s=>({started:!!s.tpStarted,vol:s.tpMode==='vol',surface:V(138),volume:V(72)});
function draw(b,s,M,Ctx){
 if(!s.tpStarted&&!M.vol&&Ctx.tab==='explore'&&!b.thumb){const D=scene3(b,s,Ctx);D.fit(pts.flat(),[],{l:60,r:(window.innerWidth>=700&&b.W>=560?245:45),t:60,b:65});D.body({mesh,fill:'sky',alpha:.035,edge:'ink',edgeW:2});return;}
 const src=scene3(b,s,Ctx), e=M.vol?0:ease(Ctx.problem?0:Ctx.t), yaw=s.svYaw==null?35:s.svYaw,pitch=s.svPitch==null?24:s.svPitch;
 const frames=Array.from({length:9},(_,i)=>{const u=i/8,cam=G.camOf(yaw*(1-u),pitch*(1-u)),T=netPose(net,u),p=[];net.pieces.forEach((f,k)=>f.pts.forEach(q=>p.push(G.proj(cam,applyT(T[k],q)))));const box=bboxOf(p);return{box};});
 const W=Math.max(...frames.map(f=>f.box.x1-f.box.x0)),H=Math.max(...frames.map(f=>f.box.y1-f.box.y0));
 const sourceOffset=src.hx(-W/2-8), sourceBox=bboxOf(pts.flat().map(p=>src.P(G.add3(p,sourceOffset)))), sy=-(sourceBox.y0+sourceBox.y1)/2;
 src.fit([], [{x:sourceBox.x0-1,y:Math.min(-H/2,sourceBox.y0+sy)-1},{x:W/2+1,y:Math.max(H/2,sourceBox.y1+sy)+1.5}],{l:30,r:(!Ctx.problem&&!b.thumb&&window.innerWidth>=700&&b.W>=560?245:30),t:58,b:55});
 const pp=src.P;src.P=p=>{const q=pp(p);return{x:q.x,y:q.y+sy}};
 const original=xfMesh(mesh,shiftT(sourceOffset));src.body({mesh:original,fill:'sky',alpha:.04,edge:'ink',edgeW:2});
 const cp=src.P(G.add3(A,sourceOffset));b.text({x:cp.x,y:sourceBox.y1+sy+1.2},'원래 입체',{size:src.fs(13),color:'ink',weight:700});
 const cam=G.camOf(yaw*(1-e),pitch*(1-e)),pose=netPose(net,e),p=[];net.pieces.forEach((f,k)=>f.pts.forEach(q=>p.push(G.proj(cam,applyT(pose[k],q)))));const box=bboxOf(p),cx=(box.x0+box.x1)/2,cy=(box.y0+box.y1)/2;
 const d=scene3(b,s,Ctx,{yaw:yaw*(1-e),pitch:pitch*(1-e)}),dp=d.P;d.P=q=>{const k=dp(q);return{x:k.x-cx,y:k.y-cy}};
 if(!M.vol){
  G.netDraw(d,net,pose,()=>({fill:'sky',alpha:.07,edge:'ink',ew:2}));
  if(e>.99){net.pieces.forEach((f,k)=>{const p=d.P(applyT(pose[k],centroid(f.pts)));b.text(p,['밑면 24','옆면 27','옆면 51','옆면 36'][k],{size:d.fs(12),color:'ink',weight:700});});const aa=applyT(pose[0],A),bb=applyT(pose[0],B),cc=applyT(pose[0],C);d.right(aa,sub3(bb,aa),sub3(cc,aa),.5,'ink');}
 }else{
  // 같은 밑면과 높이를 가진 삼각기둥과 그 안의 뿔을 비교합니다.
  const pr=prismMesh([[0,0],[6,0],[0,8]],0,9,{simple:true});
  d.body({mesh:pr,fill:'sky',alpha:.025,edge:'muted',edgeW:1.5});
  d.body({mesh,fill:'green',alpha:.10,edge:'ink',edgeW:2});
  const p=d.P(A),q=d.P(D);b.path([p,q],{color:'ink',width:1.5,dash:[4,4]});
  b.text({x:(p.x+q.x)/2,y:(p.y+q.y)/2},'높이 9',{dx:10,size:d.fs(13),color:'ink',weight:700});
 }
 src.arrow({x:sourceBox.x1+.15,y:Math.min(-H/2,sourceBox.y0+sy)-.3},{x:-W/2-.15,y:Math.min(-H/2,sourceBox.y0+sy)-.3},'muted',1.5);
}
G.register(21,'t8','삼각뿔','삼각뿔',PARAMS,[{
 id:'sv2-6',title:'삼각뿔의 겉넓이와 부피',short:'삼각뿔',question:'밑면과 옆면을 구분하고, 같은 밑면과 높이를 가진 기둥과 비교해 보세요.',
 cam0:{yaw:35,pitch:24},anim:{key:'tpT',dur:2.8,start:1,hideActions:true},ctl:()=>[],
 presets:()=>[{group:'구하는 것',label:'겉넓이',apply:(s,lab)=>{s.tpMode='surf';s.tpStarted=true;s.tpT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.svPick=null;lab?._buildProblem?.();s.playing=s.tpT===0},on:s=>s.tpStarted&&s.tpMode!=='vol'},{label:'부피',apply:(s,lab)=>{s.tpMode='vol';s.tpStarted=true;s.tpT=1;s.svPick=null;lab?._buildProblem?.();s.playing=false},on:s=>s.tpStarted&&s.tpMode==='vol'}],
 init:s=>{s.tpMode='surf';s.tpStarted=false;s.tpT=1},reroll:s=>{s.tpT=1},model,draw,
 check:s=>({ans:model(s).vol?6*8*9/6:24+27+36+51,model:G.vnum(model(s).vol?V(72):V(138))}),
 steps:M=>M.vol?['밑면은 밑변 6 cm, 높이 8 cm인 직각삼각형이므로 밑넓이는 24 cm²예요.','같은 밑면과 높이를 가진 삼각기둥의 부피는 24 × 9 = 216 cm³예요.','삼각뿔의 부피는 그 1/3이므로 72 cm³예요.']:
  ['직각삼각형인 밑면의 넓이는 6 × 8 ÷ 2 = 24 cm²예요.','옆면 세 개의 넓이는 각각 27 cm², 36 cm², 51 cm²예요.','겉넓이는 네 면을 모두 더해 138 cm²예요.'],
 view:(M,Ctx)=>Ctx.tab==='explore'&&!M.started?{guide:'겉넓이를 누르면 전개도로, 부피를 누르면 입체의 부피를 비교해 볼 수 있어요.',readouts:[]}:({
  tip:Ctx.tab==='explore'?(M.vol?'뿔의 부피는 밑면과 높이가 같은 기둥의 1/3이에요.':'삼각뿔은 삼각형인 밑면 한 개와 옆면 세 개로 이루어져요.'):null,
  card:(Ctx.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:M.vol?[{text:'밑넓이',color:'ink'},{text:'$6\\times8\\div2=24\\,\\mathrm{cm}^2$',color:'ink'},{text:'부피',color:'ink'},{text:'$\\frac13\\times24\\times9=72\\,\\mathrm{cm}^3$',color:'ink'}]:[{text:'밑넓이',color:'ink'},{text:'$6\\times8\\div2=24\\,\\mathrm{cm}^2$',color:'ink'},{text:'옆넓이',color:'ink'},{text:'$6\\times9\\div2=27$',color:'ink'},{text:'$8\\times9\\div2=36$',color:'ink'},{text:'$10\\times10.2\\div2=51$',color:'ink'},{text:'$27+36+51=114\\,\\mathrm{cm}^2$',color:'ink'},{text:'겉넓이',color:'ink'},{text:'$24+114=138\\,\\mathrm{cm}^2$',color:'ink'}]}:null,
  guide:M.vol?'삼각뿔과 같은 밑면·높이를 가진 삼각기둥을 비교해 보세요. 뿔의 부피는 기둥의 1/3입니다.':'밑면은 직각변이 6 cm와 8 cm인 삼각형, 뿔의 높이는 9 cm입니다. 나머지 옆면은 밑변이 10 cm, 그 옆면의 높이가 10.2 cm입니다.',
  readouts:(Ctx.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?[]:[rd(M.vol?'삼각뿔의 부피':'삼각뿔의 겉넓이',M.vol?'72 cm³':'138 cm²','ink')],notes:notes('밑면과 옆면은 모두 삼각형이에요.','부피를 구할 때는 옆면 높이가 아니라 밑면에 수직인 높이를 써요.')
 }),
 prob:M=>({tag:M.vol?'삼각뿔의 부피':'삼각뿔의 겉넓이',key:M.vol?'vol':'area',stem:M.vol?'밑면이 직각변 6 cm, 8 cm인 삼각형이고 높이가 9 cm인 삼각뿔의 부피는?':'밑넓이가 24 cm²이고 세 옆면의 넓이가 각각 27 cm², 36 cm², 51 cm²인 삼각뿔의 겉넓이는?',choices:mkV(M.vol?V(72):V(138),M.vol?[[V(216),'기둥 부피에 1/3을 곱해요.'],[V(108),'밑넓이와 높이를 확인해요.'],[V(24),'밑넓이를 확인해요.'],[V(144),'1/3을 곱해요.']]:[[V(114),'밑면을 더해요.'],[V(162),'밑면은 한 개예요.'],[V(87),'옆면 세 개를 더해요.'],[V(126),'네 면의 넓이를 모두 더해요.']],{dim:M.vol?3:2})})
}]);
})();
