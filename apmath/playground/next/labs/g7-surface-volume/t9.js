/* 직각삼각형을 밑면으로 하는 삼각뿔대: 닮은 작은 뿔을 잘라 냅니다. */
(function(){
'use strict'; const G=window.APL_SV;if(!G)return;
const {v3,V,P,mkV,rd,notes,scene3,sub3,cross3,unit3,mul3,dot3,centroid,polyMesh,xfMesh,shiftT,netBuild,netPose,applyT,bboxOf,ease}=G;
const A=v3(0,0,0),B=v3(6,0,0),C=v3(0,0,8),a=v3(0,4.5,0),b=v3(3,4.5,0),c=v3(0,4.5,4),centre=v3(1.2,1.8,1.6);
const faces=[[A,C,B],[A,B,b,a],[B,C,c,b],[C,A,a,c],[a,b,c]];
function makeNet(){const f=faces.map((pts,i)=>{let n=unit3(cross3(sub3(pts[1],pts[0]),sub3(pts[2],pts[0])));if(dot3(n,sub3(centroid(pts),centre))<0)n=mul3(n,-1);return {pts,n,tag:i===0?'base':i===4?'top':'side',parent:i===0?-1:i===4?1:0,hinge:i===0?null:i===4?[b,a]:[pts[0],pts[1]],edges:pts.map((_,j)=>({i:j,kind:'c'}))};});return netBuild(f,0);}
const net=makeNet(),mesh=polyMesh(faces.map((p,i)=>({pts:p,tag:i===0?'base':i===4?'top':'side'})),centre);
const PARAMS={tfT:P('전개',0,1,.01,1,{color:'green'})};
const model=s=>({started:!!s.tfStarted,vol:s.tfMode==='vol',surface:V(115.5),volume:V(63)});
function draw(bd,s,M,Ctx){
 if(!s.tfStarted&&!M.vol&&Ctx.tab==='explore'&&!bd.thumb){const D=scene3(bd,s,Ctx);D.fit(faces.flat(),[],{l:60,r:(window.innerWidth>=700&&bd.W>=560?245:45),t:60,b:65});D.body({mesh,fill:'sky',alpha:.035,edge:'ink',edgeW:2});return;}
 const src=scene3(bd,s,Ctx),e=M.vol?0:ease(Ctx.problem?0:Ctx.t),yaw=s.svYaw==null?35:s.svYaw,pitch=s.svPitch==null?24:s.svPitch;
 const frame=u=>{const cam=G.camOf(yaw*(1-u),pitch*(1-u)),T=netPose(net,u),p=[];net.pieces.forEach((f,k)=>f.pts.forEach(q=>p.push(G.proj(cam,applyT(T[k],q)))));const box=bboxOf(p);return{T,box,cx:(box.x0+box.x1)/2,cy:(box.y0+box.y1)/2};};
 const frames=Array.from({length:9},(_,i)=>frame(i/8)),W=Math.max(...frames.map(f=>f.box.x1-f.box.x0)),H=Math.max(...frames.map(f=>f.box.y1-f.box.y0));
 const sourceOffset=src.hx(-W/2-7),sourceBox=bboxOf(faces.flat().map(p=>src.P(G.add3(p,sourceOffset)))),sy=-(sourceBox.y0+sourceBox.y1)/2;
 src.fit([],[{x:sourceBox.x0-1,y:Math.min(-H/2,sourceBox.y0+sy)-1},{x:W/2+(M.vol?8:1),y:Math.max(H/2,sourceBox.y1+sy)+1.5}],{l:30,r:(!Ctx.problem&&!bd.thumb&&window.innerWidth>=700&&bd.W>=560?245:30),t:58,b:55});
 const sp=src.P;src.P=p=>{const q=sp(p);return{x:q.x,y:q.y+sy};};src.body({mesh:xfMesh(mesh,shiftT(sourceOffset)),fill:'sky',alpha:.04,edge:'ink',edgeW:2});
 const cp=src.P(G.add3(A,sourceOffset));bd.text({x:cp.x,y:sourceBox.y1+sy+1.0},'원래 입체',{size:src.fs(13),color:'ink',weight:700});
 const f=frame(e),D=scene3(bd,s,Ctx,{yaw:yaw*(1-e),pitch:pitch*(1-e)}),dp=D.P;D.P=p=>{const q=dp(p);return{x:q.x-f.cx,y:q.y-f.cy};};
 if(!M.vol){G.netDraw(D,net,f.T,pc=>({fill:pc.tag==='side'?'green':'sky',alpha:.07,edge:'ink',ew:2}));if(e>.99){net.pieces.forEach((piece,k)=>{const p=D.P(applyT(f.T[k],centroid(piece.pts)));bd.text(p,['아랫면','옆면','옆면','옆면','윗면'][k],{size:D.fs(12),color:'ink',weight:700});});const aa=applyT(f.T[0],A),bb=applyT(f.T[0],B),cc=applyT(f.T[0],C);D.right(aa,sub3(bb,aa),sub3(cc,aa),.5,'ink');}}
 else {
   // 같은 모양의 큰 삼각뿔에서 닮음비 1:2인 작은 삼각뿔을 빼는 비교도입니다.
   const apex=v3(0,9,0),small=polyMesh([[a,c,b],[a,b,apex],[b,c,apex],[c,a,apex]].map(p=>({pts:p})),v3(.75,5.625,1));
   const shift=D.hx(7*ease(Ctx.problem?0:Ctx.t));
   D.body({mesh,fill:'green',alpha:.07,edge:'ink',edgeW:2});
   D.body({mesh:xfMesh(small,shiftT(shift)),fill:'sky',alpha:.06,edge:'ink',edgeW:1.8});
 }
 const nx=-W/2;if(nx-sourceBox.x1>.3)src.arrow({x:sourceBox.x1+.1,y:-H/2-.35},{x:nx-.1,y:-H/2-.35},'muted',1.4);
}
G.register(22,'t9','삼각뿔대','삼각뿔대',PARAMS,[{
 id:'sv2-7',title:'삼각뿔대의 겉넓이와 부피',short:'삼각뿔대',question:'삼각뿔을 밑면에 평행하게 자르면 어떤 면이 생길까요?',cam0:{yaw:35,pitch:24},anim:{key:'tfT',dur:2.8,start:1,hideActions:true},ctl:()=>[],
 presets:()=>[{group:'구하는 것',label:'겉넓이',apply:(s,lab)=>{s.tfMode='surf';s.tfStarted=true;s.tfT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.svPick=null;lab?._buildProblem?.();s.playing=s.tfT===0;},on:s=>s.tfStarted&&s.tfMode!=='vol'},{label:'부피',apply:(s,lab)=>{s.tfMode='vol';s.tfStarted=true;s.tfT=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:0;s.svPick=null;lab?._buildProblem?.();s.playing=s.tfT===0;},on:s=>s.tfStarted&&s.tfMode==='vol'}],
 init:s=>{s.tfMode='surf';s.tfStarted=false;s.tfT=1},reroll:s=>{s.tfT=1},model,draw,
 check:s=>({ans:model(s).vol?72-9:24+6+114-28.5,model:G.vnum(model(s).vol?V(63):V(115.5))}),
 steps:M=>M.vol?['큰 삼각뿔의 부피는 24 × 9 ÷ 3 = 72 cm³예요.','잘라 낸 작은 뿔의 밑넓이는 6 cm², 높이는 4.5 cm이므로 부피는 6 × 4.5 ÷ 3 = 9 cm³예요.','뿔대의 부피는 72 − 9 = 63 cm³예요.']:['아랫면과 윗면의 넓이는 각각 24 cm², 6 cm²예요.','큰 뿔 옆넓이 114 cm²에서 작은 뿔 옆넓이 28.5 cm²를 빼면 85.5 cm²예요.','두 밑면과 옆면을 더하면 115.5 cm²예요.'],
 view:(M,Ctx)=>Ctx.tab==='explore'&&!M.started?{guide:'겉넓이를 누르면 전개도로, 부피를 누르면 입체의 부피를 비교해 볼 수 있어요.',readouts:[]}:({tip:Ctx.tab==='explore'?(M.vol?'작은 뿔의 부피도 밑넓이 × 높이 ÷ 3으로 구해요.':'잘라 낸 자리에 새로 생긴 윗면도 겉넓이에 포함해요.'):null,
 card:(Ctx.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?{title:'',lines:M.vol?[{text:'큰 삼각뿔',color:'ink'},{text:'$24\\times9\\div3=72$',color:'ink'},{text:'작은 삼각뿔',color:'ink'},{text:'$6\\times4.5\\div3=9$',color:'ink'},{text:'삼각뿔대의 부피',color:'ink'},{text:'$72-9=63\\,\\mathrm{cm}^3$',color:'ink'}]:[{text:'아랫면 + 윗면',color:'ink'},{text:'$24+6=30$',color:'ink'},{text:'옆면',color:'ink'},{text:'$114-28.5=85.5$',color:'ink'},{text:'겉넓이',color:'ink'},{text:'$30+85.5=115.5\\,\\mathrm{cm}^2$',color:'ink'}]}:null,
 guide:M.vol?'큰 삼각뿔의 밑넓이는 24 cm², 높이는 9 cm입니다. 잘라 낸 작은 뿔은 밑넓이 6 cm², 높이 4.5 cm입니다.':'아랫면은 직각변 6 cm, 8 cm인 삼각형이고 윗면의 넓이는 6 cm²입니다. 큰 뿔의 옆넓이는 114 cm², 잘라 낸 작은 뿔의 옆넓이는 28.5 cm²입니다.',
 readouts:(Ctx.tab==='explore'&&window.innerWidth>=700&&document.querySelector('.apl-canvas-wrap')?.clientWidth>=560)?[]:[rd(M.vol?'부피':'겉넓이',M.vol?'63 cm³':'115.5 cm²','ink')],notes:notes('잘라 생긴 윗면도 겉면이에요.','뿔대의 부피는 큰 뿔의 부피에서 잘라 낸 작은 뿔의 부피를 빼요.')}),
 prob:M=>({tag:M.vol?'삼각뿔대의 부피':'삼각뿔대의 겉넓이',key:M.vol?'vol':'area',stem:M.vol?'큰 삼각뿔의 부피가 72 cm³이고 잘라 낸 작은 삼각뿔의 부피가 9 cm³일 때, 남은 뿔대의 부피는?':'삼각뿔대의 아랫면·윗면·옆면의 넓이가 각각 24 cm², 6 cm², 85.5 cm²일 때 겉넓이는?',choices:mkV(M.vol?V(63):V(115.5),M.vol?[[V(81),'잘라 낸 부피는 빼요.'],[V(72),'작은 뿔을 빼요.'],[V(36),'큰 뿔에서 잘라 낸 작은 뿔의 부피를 빼요.'],[V(9),'남은 부분을 구해요.']]:[[V(109.5),'윗면을 더해요.'],[V(85.5),'밑면 두 개도 더해요.'],[V(139.5),'아랫면은 한 번만 더해요.'],[V(30),'옆면을 더해요.']],{dim:M.vol?3:2})})
}]);
})();
