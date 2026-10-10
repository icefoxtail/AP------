import fs from 'node:fs'; import {execFileSync} from 'node:child_process';
const root=process.cwd(),assetRel='archive/assets/images/24_순천고_1학기_중간_고2_수학I';
const outputDir=assetRel;
const sample=(fn,a,b,n)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return {x,y:fn(x)}});
const bisect=(f,a,b)=>{let fa=f(a);for(let i=0;i<80;i++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0)b=m;else{a=m;fa=fm}}return(a+b)/2};
const v18=[[-7,4],[-5,0],[-3,2],[-1,0],[0,1],[1,0],[3,2],[5,0],[7,4]].map(([x,y])=>({x,y}));
const exp18=x=>Math.pow(2,-x/3), f18=x=>x<=-5?-2*x-10:x<=-3?-x-1:x<=-1?x+1:x<=0?1-x:x<=3?x-1:x<=5?5-x:2*x-10;
const roots18=[-3,0,bisect(x=>x-1-exp18(x),1,3),bisect(x=>5-x-exp18(x),3,5),bisect(x=>2*x-10-exp18(x),5,7)];
const spec18={version:'0.1',type:'simple_function_graph',width:760,height:440,xRange:[-7.5,7.5],yRange:[-0.5,6],curves:[{points:v18},{points:sample(exp18,-7,7,160)}],points:roots18.map(x=>({x,y:exp18(x)})),annotations:[{x:5.1,y:2.5,text:'f(x)'},{x:-5.6,y:2.7,text:'2^(-x/3)'},{x:0.6,y:5.5,text:'교점 5개'}]};
const exp20=x=>Math.pow(5,x-1), log20=x=>Math.log(x-1)/Math.log(5), other20=x=>Math.log(x-2)/Math.log(1/3);
const pts20=[{x:0,y:0},{x:1,y:0},{x:1,y:1},...Array.from({length:6},(_,y)=>({x:2,y}))];
const spec20={version:'0.1',type:'simple_function_graph',width:760,height:460,xRange:[-0.15,3.15],yRange:[-0.5,6.5],curves:[{points:sample(exp20,0,Math.log(7.2)/Math.log(5)+1,100).filter(p=>p.y<=6.4)},{points:sample(log20,1.01,3,120)},{points:sample(other20,2.004,3,120)}],points:pts20,annotations:[{x:1.15,y:2.2,text:'5^(x-1)'},{x:2.35,y:0.65,text:'log_5(x-1)'},{x:2.15,y:1.55,text:'log_(1/3)(x-2)'},{x:0.2,y:5.8,text:'정수 좌표 9개'}]};
const f1=x=>Math.pow(1.5,x+1)+2,f2=x=>Math.pow(1.5,x-2)-1,line=x=>-x+5.25;
const spec24={version:'0.1',type:'simple_function_graph',width:760,height:460,xRange:[-0.5,5],yRange:[-0.5,8],curves:[{points:sample(f1,-0.4,4.1,120)},{points:sample(f2,-0.3,5,120)},{points:sample(line,-0.2,4.8,20)}],segments:[{from:{x:0,y:0},to:{x:1,y:4.25},kind:'guide'},{from:{x:1,y:4.25},to:{x:4,y:1.25},kind:'guide'},{from:{x:4,y:1.25},to:{x:0,y:0},kind:'guide'},{from:{x:2.5,y:2.75},to:{x:2.5,y:0},kind:'guide',dashed:true}],points:[{x:0,y:0,label:'O'},{x:1,y:4.25,label:'A'},{x:4,y:1.25,label:'B'},{x:2.5,y:2.75,label:'M'}],annotations:[{x:0.15,y:7.1,text:'(3/2)^(x+1)+2'},{x:4.05,y:1.9,text:'(3/2)^(x-2)-1'},{x:2.8,y:4.8,text:'y=-x+21/4'}]};
const specs={18:spec18,20:spec20,24:spec24};
for(const [qid,spec] of Object.entries(specs)){const file=`${outputDir}/q${qid}-solution.visualSpec.json`;fs.writeFileSync(file,JSON.stringify(spec,null,2)+'\n');}
const py='from pathlib import Path\nfrom alive.engine.visual_renderer import render_visual_file\nroot=Path.cwd()\nfor qid in (18,20,24):\n d=root/"archive/assets/images/24_순천고_1학기_중간_고2_수학I"\n print(render_visual_file(d/f"q{qid}-solution.visualSpec.json",d/f"q{qid}-solution.svg",d/f"q{qid}-solution.render-report.json"))\n';
execFileSync('python',['-c',py],{cwd:root,stdio:'inherit'});

