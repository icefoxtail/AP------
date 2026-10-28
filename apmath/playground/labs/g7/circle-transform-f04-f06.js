/* F04–F06: original interactive constructions for the existing transformation lab. */
(function(){
'use strict';
const states={};
function vSemi(cx,cy,r,side='left'){return `M ${cx} ${cy-r} A ${r} ${r} 0 0 ${side==='left'?0:1} ${cx} ${cy+r} L ${cx} ${cy-r} Z`;}
function seg(cx,cy,r,a,b){const p=tlPolar(cx,cy,r,a),q=tlPolar(cx,cy,r,b);return `M ${tlXY(p)} A ${r} ${r} 0 ${Math.abs(b-a)>180?1:0} ${b>=a?1:0} ${tlXY(q)} Z`;}
function lower(cx,cy,r){return `M ${cx-r} ${cy} A ${r} ${r} 0 0 0 ${cx+r} ${cy} L ${cx-r} ${cy} Z`;}
const tlVerticalSemi=vSemi,tlCircleSegment=seg,tlBottomSemi=lower;
function f04(id,st,g){
 const {mobile,vw,vh,s,centerX,centerY}=g,parts=[],pi=PI,fmt=tlF01Num;
 const line=(name,color,a,b)=>tlF03LinePart(name,color,a,b,g),arc=(name,color,cx,cy,r,a,b)=>tlF03ArcPart(name,color,cx,cy,r,a,b,g);
 let shapeA='',shapeB='',commonPath='',svg='',partsOut=parts,title='',stage='',hint='',areaLines=[],periLines=[],areaMetric='',periMetric='',areaNum=0,perimeterNum=0,note='',observation='',splitText='',highlightPath='';
 if(id==='f04-01'){
  const r=4,R=r*s,w=16*s,cy=centerY,left=(vw-(w+R))/2,x0=left+R,x1=x0+w,t=st.move/100;
  let px,py;
  if(t<.15){px=x0-R*(t/.15);py=cy;}else if(t<.3){px=x0-R;py=cy-2*R*((t-.15)/.15);}else if(t<.7){px=x0-R+(x1+R-(x0-R))*((t-.3)/.4);py=cy-2*R;}else if(t<.85){px=x1+R;py=cy-2*R*(1-(t-.7)/.15);}else{px=x1+R*(1-(t-.85)/.15);py=cy;}
  const body=tlF03Rect(x0,cy-R,w,2*R),notch=tlVerticalSemi(x1,cy,R,'left'),piece=tlVerticalSemi(px,py,R,'left');
  svg=`<path d="${body} ${notch}" fill="#174433" fill-opacity=".72" fill-rule="evenodd" stroke="#88b79a" stroke-width="2.2"/><path d="${tlVerticalSemi(x0,cy,R,'left')}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 5"/><path d="${notch}" fill="none" stroke="#fb7185" stroke-width="2" stroke-dasharray="6 5"/><path d="${piece}" fill="#fbbf24" fill-opacity=".9" stroke="#ffe8a3" stroke-width="2.5"/>`;
  const baseParts=[line('판 윗변','#38bdf8',{x:x0,y:cy-R},{x:x1,y:cy-R}),line('판 아랫변','#38bdf8',{x:x1,y:cy+R},{x:x0,y:cy+R}),arc('반원 홈 원호','#fb7185',x1,cy,R,-90,-270)];
  if(t===0){partsOut.push(...baseParts,arc('돌출 반원 원호','#fbbf24',x0,cy,R,-90,-270));perimeterNum=2*w/s+2*pi*r;}
  else if(t===1){partsOut.push(line('왼쪽 변','#38bdf8',{x:x0,y:cy-R},{x:x0,y:cy+R}),line('오른쪽 변','#38bdf8',{x:x1,y:cy-R},{x:x1,y:cy+R}),line('윗변','#38bdf8',{x:x0,y:cy-R},{x:x1,y:cy-R}),line('아랫변','#38bdf8',{x:x1,y:cy+R},{x:x0,y:cy+R}));perimeterNum=2*w/s+4*r;}
  else {partsOut.push(...baseParts,line('판 왼쪽 변','#38bdf8',{x:x0,y:cy-R},{x:x0,y:cy+R}),arc('옮기는 반원 원호','#fbbf24',px,py,R,-90,-270),line('옮기는 조각 지름','#fbbf24',{x:px,y:py-R},{x:px,y:py+R}));perimeterNum=2*w/s+4*r+2*pi*r;}
  title='반원 돌출부를 같은 반원 홈으로 옮기기';stage='반원 조각을 들어 올려 반대쪽 홈에 맞추기';hint='같은 반원 조각을 옮기므로 전체 넓이는 그대로';
  areaLines=['S_1=S_b+S_p-S_h','S_2=S_b-S_h+S_p','S_1=S_2'];periLines=[`L=${fmt(perimeterNum)}\\,\\mathrm{cm}`];
  areaMetric=`${fmt(w/s*2*r)}\\,\\mathrm{cm}^{2}`;periMetric=`${fmt(perimeterNum)}\\,\\mathrm{cm}`;areaNum=w/s*2*r;
  note='왼쪽 돌출부와 오른쪽 홈은 같은 반원입니다. 반원을 옮기면 왼쪽 홈과 오른쪽 돌출이 서로 바뀌지만 넓이는 보존됩니다.';observation='이동 중에는 조각을 판 바깥으로 들어 옮깁니다. 목적지 홈은 같은 반원의 경계로 정확히 맞습니다.';splitText='노란 반원은 처음 위치와 홈 위치에서 크기와 모양이 같습니다.';shapeA=piece;highlightPath=piece;
 }else if(id==='f04-02'){
  const r=4,R=r*s,cy=centerY,x0=centerX-3*R,x1=centerX+3*R,t=st.move/100,px=x0+(x1-x0)*t,turn=90*t;
  const piece=tlF03Sector(px,cy,R,180+turn,270+turn),home=tlF03Sector(x1,cy,R,270,360),source=tlF03Sector(x0,cy,R,180,270);
  svg=`<path d="${source}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 5"/><path d="${home}" fill="none" stroke="#fb7185" stroke-width="2.2" stroke-dasharray="6 5"/><path d="${piece}" fill="#fbbf24" fill-opacity=".88" stroke="#ffe8a3" stroke-width="2.5"/>`;
  partsOut.push(arc('사분원 원호','#fbbf24',px,cy,R,180+turn,270+turn),line('사분원 반지름 1','#fbbf24',{x:px,y:cy},tlPolar(px,cy,R,180+turn)),line('사분원 반지름 2','#fbbf24',{x:px,y:cy},tlPolar(px,cy,R,270+turn)));
  title='사분원 돌출 조각을 90° 회전해 홈에 넣기';stage='평행이동으로 맞지 않는 조각은 회전해 맞춥니다';hint='곡선과 두 반지름이 같은 사분원 홈에 포개집니다';
  areaLines=['S_{조각}=\\dfrac{\\pi r^2}{4}'];periLines=['L_{조각}=2r+\\dfrac{\\pi r}{2}'];areaMetric='4\\pi\\,\\mathrm{cm}^{2}';periMetric='8+2\\pi\\,\\mathrm{cm}';areaNum=pi*r*r/4;perimeterNum=2*r+pi*r/2;
  note='사분원 조각을 90° 돌려 같은 크기의 홈에 넣습니다. 회전은 모양과 넓이를 보존합니다.';observation=`현재 회전각 ${fmt(turn)}°입니다. 끝에 가면 두 반지름과 원호가 홈 경계에 정확히 맞습니다.`;splitText='점선은 조각의 출발 모양과 홈을 나타내며 노란 조각은 실제 회전·이동합니다.';shapeA=source;shapeB=home;highlightPath=piece;
 }else if(id==='f04-03'||id==='f04-04'){
  const r=3,R=r*s,cy=centerY,xL=centerX-3*R,xR=centerX+3*R,t=st.move/100;
  const qLeft=(cx,yy)=>tlF03Sector(cx,yy,R,180,270),qRight=(cx,yy)=>tlF03Sector(cx,yy,R,270,360);
  let a,b,ghost1,ghost2;
  if(id==='f04-03'){
   const c1x=xL+(xR-xL)*t,c1y=cy+(-R-cy+cy)*t; // destination centers are vertically separated around the shared source center
   const c2x=c1x,c2y=cy+(R)*t;
   a=qLeft(c1x,c1y);b=qRight(c2x,c2y);ghost1=qLeft(xR,cy-R);ghost2=qRight(xR,cy+R);
  }else{
   const c1x=xL+(xR-xL)*t,c2x=c1x,c1y=cy-R*(1-t),c2y=cy+R*(1-t);
   a=qLeft(c1x,c1y);b=qRight(c2x,c2y);ghost1=qLeft(xR,cy);ghost2=qRight(xR,cy);
  }
  svg=`<path d="${ghost1} ${ghost2}" fill="none" stroke="#a8bdaf" stroke-width="1.7" stroke-dasharray="6 5"/><path d="${a}" fill="#38bdf8" fill-opacity=".72"/><path d="${b}" fill="#fb7185" fill-opacity=".72"/>`;
  const c1={x:xL+(xR-xL)*t,y:id==='f04-03'?cy-R*t:cy-R*(1-t)},c2={x:c1.x,y:id==='f04-03'?cy+R*t:cy+R*(1-t)},joined=id==='f04-03'?t===0:t===1;
  partsOut.push(arc('첫째 사분원호','#38bdf8',c1.x,c1.y,R,180,270),arc('둘째 사분원호','#fb7185',c2.x,c2.y,R,270,360));
  if(joined)partsOut.push(line('합친 반원의 지름','#fbbf24',{x:c1.x-R,y:c1.y},{x:c1.x+R,y:c1.y}));
  else {
   partsOut.push(line('첫째 사분원 반지름','#38bdf8',{x:c1.x,y:c1.y},tlPolar(c1.x,c1.y,R,180)),line('첫째 사분원 반지름','#38bdf8',{x:c1.x,y:c1.y},tlPolar(c1.x,c1.y,R,270)),line('둘째 사분원 반지름','#fb7185',{x:c2.x,y:c2.y},tlPolar(c2.x,c2.y,R,270)),line('둘째 사분원 반지름','#fb7185',{x:c2.x,y:c2.y},tlPolar(c2.x,c2.y,R,360)));
  }
  const area=pi*r*r/2,perimeter=joined?pi*r+2*r:pi*r+4*r;
  title=id==='f04-03'?'반원 조각을 둘로 잘라 두 홈을 채우기':'사분원 두 조각으로 반원 홈 채우기';stage=id==='f04-03'?'한 반원을 정확히 두 사분원으로 나누어 옮깁니다':'두 사분원은 회전·이동해 반원 홈을 빈틈없이 채웁니다';hint='각 조각을 나누거나 합쳐도 넓이는 보존';
  areaLines=['2\\cdot\\dfrac{\\pi r^2}{4}=\\dfrac{\\pi r^2}{2}'];periLines=[joined?'L=\\pi r+2r':'L=\\pi r+4r'];areaMetric='\\dfrac{9\\pi}{2}\\,\\mathrm{cm}^{2}';periMetric=joined?'3\\pi+6\\,\\mathrm{cm}':'3\\pi+12\\,\\mathrm{cm}';areaNum=area;perimeterNum=perimeter;
  note=id==='f04-03'?'반원 하나를 두 사분원으로 나누면 두 떨어진 홈을 각각 채울 수 있습니다.':'두 사분원이 합동이고 반원 홈의 면을 정확히 채웁니다.';observation='접합한 반지름은 홈을 채운 뒤 내부선이 되므로 둘레에 더하지 않습니다.';splitText='파란색·분홍색 사분원은 각각 실제로 이동하는 합동 조각입니다.';shapeA=a;shapeB=b;highlightPath=a+' '+b;
 }else if(id==='f04-05'){
  const r=4,R=r*s,cy=centerY,x0=centerX-3*R,x1=centerX+3*R,t=st.move/100,px=x0+(x1-x0)*t,turn=180*t;
  const piece=tlCircleSegment(px,cy,R,-90+turn,0+turn),target=tlCircleSegment(x1,cy,R,90,180),source=tlCircleSegment(x0,cy,R,-90,0),arcLen=pi*r/2,chord=r*Math.SQRT2;
  svg=`<path d="${source}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 5"/><path d="${target}" fill="none" stroke="#fb7185" stroke-width="2" stroke-dasharray="6 5"/><path d="${piece}" fill="#fbbf24" fill-opacity=".85" stroke="#ffe8a3" stroke-width="2.5"/>`;
  partsOut.push(arc('활꼴 원호','#38bdf8',px,cy,R,-90+turn,0+turn),line('활꼴 현','#fbbf24',tlPolar(px,cy,R,-90+turn),tlPolar(px,cy,R,turn)));
  const area=pi*r*r/4-r*r/2,perimeter=arcLen+chord;
  title='현과 원호가 같은 활꼴 조각을 홈에 맞추기';stage='현 길이와 원호 모양까지 합동인 조각';hint='활꼴을 회전해 합동 홈을 채웁니다';
  areaLines=['S=\\dfrac{\\pi r^2}{4}-\\dfrac{r^2}{2}',`=${tlF01Pi(r*r,4)}-${tlF01Rat(r*r,2)}\\,\\mathrm{cm}^{2}`];periLines=['L=\\dfrac{\\pi r}{2}+r\\sqrt2'];areaMetric=`${tlF01Pi(r*r,4)}-${tlF01Rat(r*r,2)}\\,\\mathrm{cm}^{2}`;periMetric=`${tlF01Pi(r/2)}+${r}\\sqrt2\\,\\mathrm{cm}`;areaNum=area;perimeterNum=perimeter;
  note='같은 넓이만으로는 홈에 맞는다고 할 수 없습니다. 이 장면은 중심각·반지름이 같아 원호와 현까지 합동인 활꼴을 옮깁니다.';observation='노란 활꼴은 180° 회전하며 점선 홈과 같은 두 경계를 맞춥니다.';splitText='보조선 현과 곡선 원호가 모두 일치해야 빈틈없이 맞습니다.';shapeA=source;shapeB=target;highlightPath=piece;
 }else if(id==='f04-06'){
  const r=4,Rsemi=r*s,Rquarter=r*Math.SQRT2*s,cy=centerY,t=st.overlay/100,cxA=centerX-(Rquarter+Rsemi+2*s)/2+(Rquarter+s)*t,cxB=centerX+(Rquarter+Rsemi+2*s)/2-(Rsemi+s)*t;
  shapeA=tlF03Sector(cxA,cy,Rquarter,-90,0);shapeB=tlF01SemiPath(cxB,cy,Rsemi);
  svg=tlF03Regions(shapeA,shapeB,id,{opacity:.58,commonOpacity:.9});
  partsOut.push(arc('같은 넓이인 사분원 원호','#38bdf8',cxA,cy,Rquarter,-90,0),line('사분원 반지름','#38bdf8',{x:cxA,y:cy},tlPolar(cxA,cy,Rquarter,-90)),line('사분원 반지름','#38bdf8',{x:cxA,y:cy},tlPolar(cxA,cy,Rquarter,0)),arc('같은 넓이인 반원 원호','#fb7185',cxB,cy,Rsemi,180,360),line('반원의 지름','#fb7185',{x:cxB-Rsemi,y:cy},{x:cxB+Rsemi,y:cy}));
  const area=8*pi;
  title='넓이는 같지만 합동이 아닌 사분원과 반원';stage='면적 일치와 모양의 합동은 다른 관계';hint='두 도형을 포개도 경계가 일치하지 않습니다';
  areaLines=['S_Q=\\dfrac{\\pi(4\\sqrt2)^2}{4}=8\\pi','S_H=\\dfrac{\\pi\\cdot4^2}{2}=8\\pi'];periLines=['L_Q=8\\sqrt2+2\\sqrt2\\pi','L_H=8+4\\pi'];
  areaMetric='8\\pi\\,\\mathrm{cm}^{2}';periMetric='(8\\sqrt2+2\\sqrt2\\pi)+(8+4\\pi)\\,\\mathrm{cm}';areaNum=area;perimeterNum=2*4*Math.SQRT2+pi*4*Math.SQRT2/2+2*4+pi*4;
  note='반지름이 다른 사분원과 반원을 같은 넓이로 골랐습니다. 한 도형을 움직여 겹쳐도 곡선·직선 경계가 서로 맞지 않아 합동이 아닙니다.';
  observation='사분원 반지름 4√2 cm, 반원 반지름 4 cm로 넓이는 각각 8π cm²입니다.';splitText='도형의 위치를 바꿔도 모양의 차이는 사라지지 않습니다.';highlightPath=shapeA+' '+shapeB;
 }else if(id==='f04-07'){
  const u=s,xA=centerX-2*u,yA=centerY+u,A={x:xA,y:yA},B={x:xA+4*u,y:yA},C={x:xA,y:yA-3*u},cx=(B.x+C.x)/2,cy=(B.y+C.y)/2,R=2.5*u;
  const small1=tlBottomSemi((A.x+B.x)/2,yA,2*u),small2=tlVerticalSemi(A.x,yA-1.5*u,1.5*u,'left'),big=`M ${tlXY(B)} A ${R} ${R} 0 0 1 ${tlXY(C)} L ${tlXY(B)} Z`;
  const m1=`<mask id="hippo1" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="520" style="mask-type:luminance"><rect width="760" height="520" fill="#fff"/><path d="${big}" fill="#000"/></mask>`,m2=`<mask id="hippo2" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="520" style="mask-type:luminance"><rect width="760" height="520" fill="#fff"/><path d="${big}" fill="#000"/></mask>`;
  const reveal=st.reveal/100;svg=`<defs>${m1}${m2}</defs><path d="${small1} ${small2}" fill="#b6dbc5" fill-opacity="${.22*(1-reveal)}"/><path d="${big}" fill="#fbbf24" fill-opacity="${.13*(1-reveal)}"/><path d="${small1}" fill="#38bdf8" fill-opacity="${.2+.64*reveal}" mask="url(#hippo1)"/><path d="${small2}" fill="#fb7185" fill-opacity="${.2+.64*reveal}" mask="url(#hippo2)"/><path d="${big}" fill="none" stroke="#c8d8cf" stroke-width="2" stroke-dasharray="6 5"/><path d="M ${tlXY(A)} L ${tlXY(B)} L ${tlXY(C)} Z" fill="none" stroke="#fbbf24" stroke-width="2"/>`;
  const angleA=(Math.atan2(A.y-cy,A.x-cx)*180/PI+360)%360,angleB=(Math.atan2(B.y-cy,B.x-cx)*180/PI+360)%360,angleC=(Math.atan2(C.y-cy,C.x-cx)*180/PI+360)%360;
  partsOut.push(arc('첫째 초승달의 작은 반원호','#38bdf8',(A.x+B.x)/2,yA,2*u,0,180),arc('둘째 초승달의 작은 반원호','#fb7185',A.x,yA-1.5*u,1.5*u,-90,-270),arc('큰 반원호 · AB 구간','#fbbf24',cx,cy,R,angleB,angleA),arc('큰 반원호 · AC 구간','#fbbf24',cx,cy,R,angleA,angleC));
  title='직각삼각형의 세 반원과 히포크라테스 초승달';stage='두 초승달의 넓이 합은 직각삼각형 넓이';hint='초승달을 삼각형에 끼우지 않고 면적을 상쇄';
  areaLines=['S_{L_1}+S_{L_2}=S_{\\triangle ABC}','=\\dfrac{3\\cdot4}{2}=6\\,\\mathrm{cm}^{2}','\\dfrac{\\pi\\cdot2^2}{2}+\\dfrac{\\pi(3/2)^2}{2}=\\dfrac{\\pi(5/2)^2}{2}'];periLines=['L_{L_1}+L_{L_2}=6\\pi\\,\\mathrm{cm}'];
  areaMetric='6\\,\\mathrm{cm}^{2}';periMetric='6\\pi\\,\\mathrm{cm}';areaNum=6;perimeterNum=6*pi;
  note='직각삼각형의 세 변을 지름으로 반원을 만듭니다. 두 작은 반원의 전체 넓이는 큰 반원과 같으므로 겹치는 면을 상쇄하면 두 초승달의 합이 삼각형 넓이와 같습니다.';
  observation='노란 점선 큰 반원은 비교용 경계입니다. 초승달 영역은 작은 반원에서 큰 반원과 겹치는 면을 뺀 부분입니다.';splitText='초승달 두 영역을 각각 색칠해 합을 삼각형 넓이와 비교합니다.';shapeA=small1;shapeB=small2;highlightPath=small1+' '+small2;
 }
 return {title,stage,hint,svg,parts:partsOut,areaLines,periLines,areaMetric,periMetric,areaNum,perimeterNum,note,observation,splitText,shapeA,shapeB,commonPath,regionMode:'all',highlightPath};
}
function f05(id,st,g){
 const {s,centerX:cx,centerY:cy}=g,r=6,R=r*s,parts=[],arc=(name,color,x,y,rad,a,b)=>tlF03ArcPart(name,color,x,y,rad,a,b,g),line=(name,color,a,b)=>tlF03LinePart(name,color,a,b,g),col=['#38bdf8','#fb7185','#34d399','#fbbf24'];
 let svg='',shapeA='',shapeB='',areaMetric='',periMetric='',areaLines=[],periLines=[],note='',observation='',stage='',hint='',areaNum=0,perimeterNum=0;
 if(id==='f05-01'){
  const top=cy-R,bot=cy+R,h=R/2,outerL=`M ${cx} ${top} A ${R} ${R} 0 0 0 ${cx} ${bot}`,outerR=`M ${cx} ${top} A ${R} ${R} 0 0 1 ${cx} ${bot}`,back=` A ${h} ${h} 0 0 1 ${cx} ${cy} A ${h} ${h} 0 0 0 ${cx} ${top} Z`;
  shapeA=outerL+back;shapeB=outerR+back;svg=`<path d="${shapeA}" fill="${st.swap?'#fb7185':'#38bdf8'}" fill-opacity=".65"/><path d="${shapeB}" fill="${st.swap?'#38bdf8':'#fb7185'}" fill-opacity=".65"/><path d="M ${cx} ${top} A ${h} ${h} 0 0 1 ${cx} ${cy} A ${h} ${h} 0 0 0 ${cx} ${bot}" fill="none" stroke="#fbbf24" stroke-width="${2+st.split/30}"/>`;
  parts.push(st.region==='A'?arc('A 바깥 반원호',st.swap?col[1]:col[0],cx,cy,R,-90,-270):arc('B 바깥 반원호',st.swap?col[0]:col[1],cx,cy,R,-90,90),arc('공통 S 위 원호',col[3],cx,cy-h,h,-90,90),arc('공통 S 아래 원호',col[3],cx,cy+h,h,-90,-270));areaMetric='18\\pi\\,\\mathrm{cm}^{2}';periMetric='12\\pi\\,\\mathrm{cm}';areaNum=18*PI;perimeterNum=12*PI;areaLines=['S_A=S_B=\\dfrac{\\pi r^2}{2}'];periLines=['L_A=L_B=\\pi r+\\pi r=2\\pi r'];stage='두 영역이 같은 S자 경계를 나눕니다';hint='내부 S자도 각 영역의 둘레에는 포함';note='두 작은 반원호가 한 S자 경계를 이룹니다. 각 색 영역의 둘레에는 이 공통 경계가 각각 들어갑니다.';observation=`선택한 ${st.region} 영역의 바깥 호와 S자 호의 길이는 각각 πr입니다.`;
 }else if(id==='f05-02'||id==='f05-08'){
  const x0=cx-R,x1=cx+R,m=x0+8*s,r1=4*s,r2=2*s,c1=x0+r1,c2=m+r2,big=tlF01SemiPath(cx,cy,R),small=tlF01SemiPath(c1,cy,r1)+' '+tlF01SemiPath(c2,cy,r2);
  shapeA=big;shapeB=small;svg=`<path d="${big} ${small}" fill="#38bdf8" fill-opacity=".52" fill-rule="evenodd"/>`;
  parts.push(arc('큰 원호 A→C',col[0],cx,cy,R,180,360),arc('작은 원호 C→B',col[1],c2,cy,r2,360,180),arc('작은 원호 B→A',col[2],c1,cy,r1,360,180));
  const k=(id==='f05-08'?st.segment:st.focus)-1;parts.forEach((p,i)=>svg+=`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="${i===k?6:2}"/>`);
  svg+=tlTextSvg('A',x0,cy+18)+tlTextSvg('B',m,cy+18)+tlTextSvg('C',x1,cy+18)+[cx,c1,c2].map((x,i)=>`<circle cx="${x}" cy="${cy}" r="${i===[0,2,1][k]?5:3}" fill="${i===[0,2,1][k]?'#fbbf24':'#b9d5c5'}"/>`+tlTextSvg(['O','O₁','O₂'][i],x,cy+36,'#ffe6a0',11,'middle')).join('');areaMetric='8\\pi\\,\\mathrm{cm}^{2}';periMetric='12\\pi\\,\\mathrm{cm}';areaNum=8*PI;perimeterNum=12*PI;areaLines=['S=\\dfrac{\\pi R^2}{2}-\\dfrac{\\pi r_1^2}{2}-\\dfrac{\\pi r_2^2}{2}=8\\pi'];periLines=['L=\\pi R+\\pi r_1+\\pi r_2=12\\pi'];stage=id==='f05-08'?'A→C→B→A로 원호를 이어 닫기':'크기가 다른 세 반원호가 닫힌 경계를 만듭니다';hint='중심과 시작점·끝점을 순서대로 확인';note='세 원호의 끝점이 이어져 한 경계를 만듭니다. 지름은 색칠 면의 외곽선에 더하지 않습니다.';observation=['A에서 C까지, 중심 O','C에서 B까지, 중심 O₂','B에서 A까지, 중심 O₁'][k]||'A에서 C까지, 중심 O';
 }else if(id==='f05-03'){
  const x1=cx-R,x2=cx+R,a=tlF01SemiPath(x1,cy,R),b=st.orientation==='same'?tlF01SemiPath(x2,cy,R):lower(x2,cy,R);shapeA=a;shapeB=b;svg=`<path d="${a}" fill="#38bdf8" fill-opacity=".6"/><path d="${b}" fill="#fb7185" fill-opacity=".6"/>`;parts.push(arc('첫 반원호',col[0],x1,cy,R,180,360),arc('둘째 반원호',col[1],x2,cy,R,st.orientation==='same'?180:0,st.orientation==='same'?360:180),line('첫 지름',col[3],{x:x1-R,y:cy},{x:x1+R,y:cy}),line('둘째 지름',col[3],{x:x2-R,y:cy},{x:x2+R,y:cy}));areaMetric='36\\pi\\,\\mathrm{cm}^{2}';periMetric='12\\pi+24\\,\\mathrm{cm}';areaNum=36*PI;perimeterNum=12*PI+24;areaLines=['S=2\\cdot\\dfrac{\\pi r^2}{2}=\\pi r^2'];periLines=['L=2\\pi r+4r'];stage='반원호 둘의 방향을 바꾸어 보기';hint='같은 호 길이도 배치에 따라 다른 모양';note='같은 반원호 두 개를 같은 방향 또는 반대 방향에 놓습니다. 호의 길이 합은 같고 영역의 모양은 달라집니다.';observation='두 반원의 지름도 각 영역의 경계입니다.';
 }else if(id==='f05-04'||id==='f05-05'){
  const d=(id==='f05-04'?st.distance:6),D=d*s,x1=cx-D/2,x2=cx+D/2,beta=Math.acos(Math.min(1,d/(2*r))),deg=beta*180/PI,lens=2*r*r*beta-d/2*Math.sqrt(Math.max(0,4*r*r-d*d)),cres=id==='f05-05'&&st.region==='crescent';shapeA=tlF03Circle(x1,cy,R);shapeB=tlF03Circle(x2,cy,R);
  if(cres){svg=`<defs><mask id="f05cres" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="520" style="mask-type:luminance"><rect width="760" height="520" fill="#fff"/><path d="${shapeB}" fill="#000"/></mask></defs><path d="${shapeA}" fill="#38bdf8" fill-opacity=".7" mask="url(#f05cres)"/><path d="${shapeB}" fill="none" stroke="#fb7185" stroke-dasharray="5 5"/>`;parts.push(arc('A의 바깥 큰 원호',col[0],x1,cy,R,deg,360-deg),arc('B의 안쪽 작은 원호',col[1],x2,cy,R,180+deg,180-deg));areaNum=PI*r*r-lens;perimeterNum=2*PI*r;areaMetric='12\\pi+18\\sqrt3\\,\\mathrm{cm}^{2}';periMetric='12\\pi\\,\\mathrm{cm}';}
  else {svg=tlF03Regions(shapeA,shapeB,id,{mode:'common',opacity:.18,commonOpacity:.72});if(deg>0)parts.push(arc('첫 원의 렌즈 원호',col[0],x1,cy,R,360-deg,360+deg),arc('둘째 원의 렌즈 원호',col[1],x2,cy,R,180+deg,180-deg));areaNum=lens;perimeterNum=4*r*beta;areaMetric=d===6?'24\\pi-18\\sqrt3\\,\\mathrm{cm}^{2}':`${tlF01Num(lens)}\\,\\mathrm{cm}^{2}`;periMetric=d===6?'8\\pi\\,\\mathrm{cm}':`${tlF01Num(perimeterNum)}\\,\\mathrm{cm}`;}
  areaLines=[cres?'S_{A\\setminus B}=S_A-S_{A\\cap B}':'S_{A\\cap B}=S_{sector1}+S_{sector2}-S_{rhombus}'];periLines=[`L=${periMetric}`];stage=cres?'같은 두 원에서 한쪽만 남긴 초승달':'두 원의 공통 렌즈';hint='선택한 면을 닫는 원호만 둘레에 포함';note='같은 원 배치라도 공통 면과 차집합은 서로 다른 원호를 경계로 채택합니다.';observation='원의 교점을 실제 좌표로 계산해 선택한 두 원호를 연결합니다.';
 }else if(id==='f05-06'){
  const q=8*s,x=cx-q/2,y=cy-q/2,a=tlF03Sector(x,y,q,0,90),b=tlF03Sector(x+q,y+q,q,180,270);shapeA=a;shapeB=b;svg=`<rect x="${x}" y="${y}" width="${q}" height="${q}" fill="none" stroke="#9dbdaf" stroke-dasharray="5 5"/>`+tlF03Regions(a,b,id,{mode:'common',opacity:.12,commonOpacity:st.shade?.8:.3});parts.push(arc('첫 90° 원호',col[0],x,y,q,0,90),arc('둘째 90° 원호',col[1],x+q,y+q,q,180,270));areaMetric='32\\pi-64\\,\\mathrm{cm}^{2}';periMetric='8\\pi\\,\\mathrm{cm}';areaNum=(PI/2-1)*64;perimeterNum=8*PI;areaLines=['S_{petal}=2\\cdot\\dfrac{\\pi s^2}{4}-s^2'];periLines=['L=2\\cdot\\dfrac{\\pi s}{2}=\\pi s'];stage='정사각형 속 두 사분원호로 꽃잎 한 장';hint='두 90° 원호가 닫힌 경계를 이룹니다';note='두 사분원 넓이의 합에서 정사각형 넓이를 빼면 공통 꽃잎의 넓이가 됩니다.';observation='대각선과 사각형 변은 꽃잎의 둘레가 아닙니다.';
 }else{
  const pr=2*s,offset=3*s,axes=[[0,-1],[1,0],[0,1],[-1,0]],d=2*s,areaOne=8*PI/3-2*Math.sqrt(3);let defs='',fills='';
  axes.forEach(([dx,dy],i)=>{const mx=cx+dx*offset,my=cy+dy*offset,a={x:mx-dx*d/2,y:my-dy*d/2},b={x:mx+dx*d/2,y:my+dy*d/2},pa=tlF03Circle(a.x,a.y,pr),pb=tlF03Circle(b.x,b.y,pr),phi=Math.atan2(dy,dx)*180/PI;defs+=`<clipPath id="petal${i}"><path d="${pb}"/></clipPath>`;fills+=`<path d="${pa}" fill="${col[i]}" fill-opacity=".7" clip-path="url(#petal${i})"/>`;parts.push(arc(`꽃잎 ${i+1} 원호 1`,col[i],a.x,a.y,pr,phi-60,phi+60),arc(`꽃잎 ${i+1} 원호 2`,col[i],b.x,b.y,pr,phi+120,phi+240));});
  svg=`<defs>${defs}</defs><rect x="${cx-5*s}" y="${cy-5*s}" width="${10*s}" height="${10*s}" fill="none" stroke="#9dbdaf"/>${fills}<rect x="${cx-2*s}" y="${cy-2*s}" width="${4*s}" height="${4*s}" fill="${st.showCenter?'#fbbf24':'none'}" fill-opacity=".28" stroke="#fbbf24" stroke-dasharray="5 5"/>`;
  if(st.showCenter){parts.length=0;const a={x:cx-2*s,y:cy-2*s},b={x:cx+2*s,y:cy-2*s},c={x:cx+2*s,y:cy+2*s},d0={x:cx-2*s,y:cy+2*s};parts.push(line('중앙 윗변',col[3],a,b),line('중앙 오른쪽 변',col[3],b,c),line('중앙 아랫변',col[3],c,d0),line('중앙 왼쪽 변',col[3],d0,a));areaNum=16;perimeterNum=16;areaMetric='16\\,\\mathrm{cm}^{2}';periMetric='16\\,\\mathrm{cm}';areaLines=['S=4\\times4=16'];periLines=['L=4\\times4=16'];}
  else {areaNum=4*areaOne;perimeterNum=32*PI/3;areaMetric='32\\pi/3-8\\sqrt3\\,\\mathrm{cm}^{2}';periMetric='32\\pi/3\\,\\mathrm{cm}';areaLines=['S_{4}=4(8\\pi/3-2\\sqrt3)'];periLines=['L_{4}=4\\cdot 8\\pi/3'];}
  stage='회전 복제한 네 꽃잎과 가운데 빈 정사각형';hint='각 꽃잎의 두 원호와 중앙 빈 면을 따로 셉니다';note='같은 렌즈 꽃잎 네 개를 90°씩 회전해 배치했습니다. 가운데 한 변 4 cm의 정사각형은 빈 면입니다.';observation=st.showCenter?'선택한 중앙 정사각형의 네 변을 경계로 셉니다.':'꽃잎마다 두 원호가 있으므로 네 장의 경계는 여덟 원호입니다.';
 }
 return {title:stage,stage,hint,svg,parts,areaMetric,periMetric,areaNum,perimeterNum,areaLines,periLines,note,observation,splitText:note,shapeA,shapeB,regionMode:'all'};
}
function rotatePoint(p,o,angle){const a=angle*PI/180,c=Math.cos(a),d=Math.sin(a),x=p.x-o.x,y=p.y-o.y;return {x:o.x+x*c-y*d,y:o.y+x*d+y*c};}
function f06(id,st,g){
 const {s,centerX:cx,centerY:cy,vw}=g,parts=[],colors=['#38bdf8','#fb7185','#34d399','#fbbf24'];let svg='',note='',observation='',stage='',hint='',radiusText='',lengthText='',total=0,areaLines=[],periLines=[],shapeA='';
 const addArc=(name,color,o,r,a,b)=>{if(r<1e-7||Math.abs(b-a)<1e-7)return;if(Math.abs(b-a)>=359.999){parts.push(tlF03ArcPart(name,color,o.x,o.y,r,a,a+180,g),tlF03ArcPart(name,color,o.x,o.y,r,a+180,b,g));}else parts.push(tlF03ArcPart(name,color,o.x,o.y,r,a,b,g));};
 const poly=p=>`M ${p.map(tlXY).join(' L ')} Z`,dot=(p,c)=>`<circle cx="${p.x}" cy="${p.y}" r="5" fill="${c}" stroke="#fff" stroke-width="1.5"/>`;
 if(id==='f06-01'||id==='f06-08'){
  const r=6,R=r*s,o={x:cx,y:cy},angle=st.turn,start=-90,p0=tlPolar(cx,cy,R,start),p=tlPolar(cx,cy,R,start+angle),distance=2*PI*r*angle/360,chord=2*r*Math.sin(angle*PI/360);
  shapeA=tlF03Circle(cx,cy,R);svg=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#6b9980" stroke-dasharray="5 5"/><path d="M ${tlXY(o)} L ${tlXY(p)}" stroke="#fbbf24" stroke-width="2"/>${dot(o,'#fbbf24')}${dot(p,colors[0])}`+tlTextSvg('r=6 cm',(o.x+p.x)/2+10,(o.y+p.y)/2-8,'#ffe6a0',12);
  if(id==='f06-08')svg+=`<path d="M ${tlXY(p0)} L ${tlXY(p)}" stroke="#fb7185" stroke-width="3" stroke-dasharray="6 4"/>`;
  addArc('점이 움직인 원호',colors[0],o,R,start,start+angle);total=distance;radiusText='6\\,\\mathrm{cm}';lengthText=angle===90?'3\\pi\\,\\mathrm{cm}':`${tlF01Num(distance)}\\,\\mathrm{cm}`;
  areaLines=[`l=\\dfrac{${angle}}{360}2\\pi r`];periLines=[id==='f06-08'?(angle===90?'AB=6\\sqrt2\\,\\mathrm{cm}':`AB\\approx${tlF01Num(chord)}\\,\\mathrm{cm}`):`l=${lengthText}`];stage=id==='f06-08'?'원호로 움직인 거리와 출발·도착 직선거리':'한 점이 중심 주위를 회전합니다';hint='중심에서 점까지의 거리가 원호의 반지름';note=id==='f06-08'?'원호 길이는 실제 이동 거리이고, 출발점과 도착점을 이은 선분은 직선거리입니다.':'점은 중심에서 같은 거리를 유지하며 원호를 따라 움직입니다.';observation=`회전각 ${angle}°, 반지름 6 cm입니다.`;
 }else if(id==='f06-02'||id==='f06-03'||id==='f06-04'){
  let points,pivot,tracked,angle=st.turn??90;
  if(id==='f06-02'){pivot={x:cx-2*s,y:cy+s};points=[pivot,{x:pivot.x+4*s,y:pivot.y},{x:pivot.x,y:pivot.y-3*s}];tracked=[1,2];radiusText='3,\\;4\\,\\mathrm{cm}';stage='삼각형의 두 꼭짓점 경로를 비교합니다';}
  else {const x=cx-3*s,y=cy+2*s,w=6*s,h=(id==='f06-03'?3:4)*s;points=[{x,y},{x:x+w,y},{x:x+w,y:y-h},{x,y:y-h}];if(id==='f06-04'){pivot=st.pivot==='corner'?points[0]:st.pivot==='midpoint'?{x:x+w/2,y}:{x:x+w/2,y:y-h/2};tracked=[3];radiusText=st.pivot==='corner'?'4\\,\\mathrm{cm}':st.pivot==='midpoint'?'5\\,\\mathrm{cm}':'\\sqrt{13}\\,\\mathrm{cm}';stage='같은 직사각형에서 회전 중심을 바꿉니다';}else{pivot=points[0];tracked=[1,2,3];radiusText='3,\\;6,\\;3\\sqrt5\\,\\mathrm{cm}';stage='직사각형 꼭짓점마다 회전 반지름이 다릅니다';}}
  const moved=points.map(p=>rotatePoint(p,pivot,angle));shapeA=poly(moved);svg=`<path d="${poly(points)}" fill="none" stroke="#789584" stroke-dasharray="5 5"/><path d="${shapeA}" fill="#38bdf8" fill-opacity=".3" stroke="#bdebd0" stroke-width="2"/>${dot(pivot,'#fbbf24')}`;
  tracked.forEach((i,j)=>{const p=points[i],rad=Math.hypot(p.x-pivot.x,p.y-pivot.y),a=Math.atan2(p.y-pivot.y,p.x-pivot.x)*180/PI,label=id==='f06-02'?['4 cm','3 cm'][j]:id==='f06-03'?['6 cm','3√5 cm','3 cm'][j]:st.pivot==='corner'?'4 cm':st.pivot==='midpoint'?'5 cm':'√13 cm';addArc(`꼭짓점 ${i+1} 경로`,colors[j],pivot,rad,a,a+angle);svg+=`<path d="M ${tlXY(pivot)} L ${tlXY(moved[i])}" stroke="${colors[j]}" stroke-opacity=".55" stroke-dasharray="4 4"/>`+dot(moved[i],colors[j])+tlTextSvg(label,(pivot.x+moved[i].x)/2+8,(pivot.y+moved[i].y)/2-8-j*8,colors[j],11);});
  const radii=tracked.map(i=>Math.hypot(points[i].x-pivot.x,points[i].y-pivot.y)/s);total=radii.reduce((a,b)=>a+b*2*PI*angle/360,0);lengthText=`${tlF01Num(total)}\\,\\mathrm{cm}\\;(합)`;areaLines=[`l_i=\\dfrac{${angle}}{360}2\\pi r_i`];periLines=[`l_{합}\\approx${tlF01Num(total)}\\,\\mathrm{cm}`];hint='같은 각도에서 반지름이 길수록 원호도 깁니다';note=id==='f06-04'?'같은 도형도 중심을 바꾸면 같은 꼭짓점의 반지름과 경로가 달라집니다.':'각 꼭짓점의 중심까지 거리를 직접 표시해 경로 길이를 비교합니다.';observation=`회전각 ${angle}°에서 표시된 꼭짓점들의 경로를 색으로 구분합니다.`;
 }else if(id==='f06-05'){
  const a=4*s,A={x:cx-2*s,y:cy+2*s},B={x:A.x+a,y:A.y},C={x:A.x+a,y:A.y-a},D={x:A.x,y:A.y-a},theta=st.turn,orig=[A,B,C,D],first=orig.map(p=>rotatePoint(p,A,theta)),pivot=first[1],final=first.map(p=>rotatePoint(p,pivot,theta)),p=first[2],aa=Math.atan2(C.y-A.y,C.x-A.x)*180/PI,bb=Math.atan2(p.y-pivot.y,p.x-pivot.x)*180/PI;
  addArc('첫 중심 A의 원호',colors[0],A,a*Math.SQRT2,aa,aa+theta);addArc('바뀐 중심 B의 원호',colors[1],pivot,a,bb,bb+theta);shapeA=poly(final);svg=`<path d="${poly(orig)}" fill="none" stroke="#789584" stroke-dasharray="5 5"/><path d="${shapeA}" fill="#38bdf8" fill-opacity=".3" stroke="#bdebd0"/>${dot(A,'#fbbf24')}${dot(pivot,'#fb7185')}${dot(final[2],colors[0])}`;total=(4*Math.SQRT2+4)*2*PI*theta/360;radiusText='4\\sqrt2,\\;4\\,\\mathrm{cm}';lengthText=theta===90?'(2\\sqrt2+2)\\pi\\,\\mathrm{cm}':`${tlF01Num(total)}\\,\\mathrm{cm}`;areaLines=[`l=\\dfrac{${theta}}{360}2\\pi(4\\sqrt2+4)`];periLines=[`l=${lengthText}`];stage='첫 회전 뒤 다른 꼭짓점을 중심으로 다시 회전';hint='두 원호의 중심과 반지름이 바뀝니다';note='첫 회전 후 이동한 꼭짓점을 새 중심으로 삼아 두 번째 원호를 이어 그립니다.';observation='표시한 점의 반지름은 첫 구간 4√2 cm, 둘째 구간 4 cm입니다.';
 }else{
  const tri=id==='f06-06',floor=cy+4*s,x0=tri?cx-8*s:cx-12*s,points=tri?[{x:x0,y:floor},{x:x0+4*s,y:floor},{x:x0+2*s,y:floor-2*Math.sqrt(3)*s}]:[{x:x0,y:floor},{x:x0+6*s,y:floor},{x:x0+6*s,y:floor-3*s},{x:x0,y:floor-3*s}],pivots=tri?[1,2,0]:[1,2,3,0],stepAngle=tri?120:90;let current=points.map(p=>({...p})),roll=st.roll;
  for(let j=0;j<pivots.length;j++){const f=Math.max(0,Math.min(1,roll-j));if(!f)break;const o=current[pivots[j]],p=current[0],rad=Math.hypot(p.x-o.x,p.y-o.y),start=Math.atan2(p.y-o.y,p.x-o.x)*180/PI;addArc(`접점 ${j+1}의 이동 원호`,colors[j],o,rad,start,start+stepAngle*f);total+=rad/s*stepAngle*f*PI/180;current=current.map(q=>rotatePoint(q,o,stepAngle*f));if(f<1)break;}
  shapeA=poly(current);svg=`<path d="M 20 ${floor} H ${vw-20}" stroke="#bad7c6" stroke-width="2"/><path d="${shapeA}" fill="#38bdf8" fill-opacity=".3" stroke="#bdebd0" stroke-width="2"/>${dot(current[0],colors[0])}`;radiusText=tri?'4,\\;4,\\;0\\,\\mathrm{cm}':'6,\\;3\\sqrt5,\\;3,\\;0\\,\\mathrm{cm}';lengthText=`${tlF01Num(total)}\\,\\mathrm{cm}`;areaLines=[tri?'\\theta=120^\\circ':'\\theta=90^\\circ',`l\\approx${tlF01Num(total)}\\,\\mathrm{cm}`];periLines=['l_i=\\dfrac{\\theta_i}{360}2\\pi r_i'];stage=tri?'정삼각형이 한 변씩 바닥을 따라 넘어갑니다':'긴 변과 짧은 변이 번갈아 바닥에 닿습니다';hint='현재 접점이 회전 중심이며 접점인 꼭짓점은 잠시 멈춥니다';note='각 구간은 고정된 접점 주위의 회전으로 계산합니다. 추적 점이 접점이 되는 구간에서는 움직이지 않습니다.';observation=`현재 ${tlF01Num(roll)}번 변을 넘긴 상태입니다.`;
 }
 return {title:stage,stage,hint,svg,parts,areaMetric:radiusText,periMetric:lengthText,areaNum:0,perimeterNum:total,areaLines,periLines,note,observation,splitText:note,shapeA,shapeB:'',regionMode:'all'};
}
const groups={
 f04:['반원 돌출·홈','사분원 회전','반원 조각 둘로','사분원 둘로 채우기','합동 활꼴','같은 넓이 다른 모양','히포크라테스 초승달'],
 f05:['태극형 S자','아르벨로스 세 원호','반원 두 개 물결','대칭 렌즈','초승달 차집합','정사각형 꽃잎','꽃잎 넷과 중앙','원호 경계 이어 보기'],
 f06:['한 점의 회전','삼각형 꼭짓점 추적','직사각형 꼭짓점 추적','회전 중심 바꾸기','회전 중심 연속 변경','삼각형 굴리기','직사각형 굴리기','경로와 직선거리']
};
const labels={f04:'잘라서 채우기',f05:'복합 원호',f06:'점의 이동'};
const nav=tlGet('tlFamily');
for(const [group,names] of Object.entries(groups)){
 const head=document.createElement('span');head.className='tl-family-label';head.textContent=`${group.toUpperCase()} · ${labels[group]}`;nav.appendChild(head);
 names.forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.dataset.tlFamily=`${group}-${String(i+1).padStart(2,'0')}`;b.textContent=`${['①','②','③','④','⑤','⑥','⑦','⑧'][i]} ${name}`;nav.appendChild(b);});
}
const groupSelect=document.createElement('select');groupSelect.className='tl-group-select';groupSelect.setAttribute('aria-label','변환군 선택');groupSelect.innerHTML='<option value="f01">F01 · 넣기·파내기</option><option value="f02">F02 · 나누기·합치기</option><option value="f03">F03 · 겹치기·상쇄</option><option value="f04">F04 · 잘라서 채우기</option><option value="f05">F05 · 복합 원호</option><option value="f06">F06 · 점의 이동</option>';nav.prepend(groupSelect);
function groupOf(id){return id==='sector'||id==='circle'?'f01':id.slice(0,3);}
function showGroup(group){groupSelect.value=group;nav.querySelectorAll('.tl-family-label').forEach(x=>x.hidden=true);nav.querySelectorAll('[data-tl-family]').forEach(b=>{b.hidden=groupOf(b.dataset.tlFamily)!==group;});}
groupSelect.addEventListener('change',()=>{const group=groupSelect.value;showGroup(group);const b=[...nav.querySelectorAll('[data-tl-family]')].find(x=>groupOf(x.dataset.tlFamily)===group);if(b)b.click();});
nav.addEventListener('click',e=>{const b=e.target.closest('[data-tl-family]');if(b)showGroup(groupOf(b.dataset.tlFamily));});showGroup(groupOf(TL.family));
const isExtra=id=>/^f0[456]-/.test(id);
function initial(id){if(id.startsWith('f04-'))return id==='f04-06'?{overlay:0}:id==='f04-07'?{reveal:0}:{move:0};if(id.startsWith('f05-'))return id==='f05-01'?{split:30,swap:false,region:'A'}:id==='f05-02'?{focus:1}:id==='f05-03'?{orientation:'same'}:id==='f05-04'?{distance:6}:id==='f05-05'?{region:'lens'}:id==='f05-06'?{shade:true}:id==='f05-07'?{showCenter:false}:{segment:1};if(id==='f06-04')return {pivot:'corner'};if(id==='f06-06'||id==='f06-07')return {roll:0};return {turn:90};}
function state(id){return states[id]||(states[id]=initial(id));}
function layout(id){const mobile=innerWidth<=660,vw=mobile?480:760,vh=mobile?400:420,span=id==='f04-07'?10:id==='f05-03'?26:id==='f06-07'?24:id==='f06-06'?20:id.startsWith('f04-')?27:18,cap=id==='f04-07'?(mobile?28:40):id==='f04-01'?(mobile?13:16):id==='f06-06'?(mobile?20:32):id==='f06-07'?(mobile?17:28):id.startsWith('f04-')?(mobile?13:18):(mobile?16:23),s=Math.min(cap,(vw-48)/span);return {mobile,vw,vh,s,centerX:vw/2,centerY:vh/2};}
function range(key,title,min,max,step,value,unit){return `<div class="tl-range"><label for="ex-${key}">${title}</label><input id="ex-${key}" data-ex-range="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output id="ex-${key}-value">${value}${unit}</output></div>`;}
function choice(text,key,value,active){return `<button type="button" class="tl-f03-choice${active?' active':''}" data-ex-key="${key}" data-ex-value="${value}" aria-pressed="${active}">${text}</button>`;}
function controls(id,st){
 if(id.startsWith('f04-')){let k=id==='f04-06'?'overlay':id==='f04-07'?'reveal':'move';return range(k,id==='f04-07'?'공통 면 상쇄':'조각 이동·회전',0,100,1,st[k],'%');}
 if(id==='f05-01')return choice('영역 A','region','A',st.region==='A')+choice('영역 B','region','B',st.region==='B')+choice('기본 색','swap','false',!st.swap)+choice('색 바꾸기','swap','true',st.swap)+range('split','공통 S 경계 강조',0,100,1,st.split,'%');
 if(id==='f05-02'||id==='f05-08'){const k=id==='f05-02'?'focus':'segment';return range(k,'강조할 경계',1,3,1,st[k],'번');}
 if(id==='f05-03')return choice('같은 방향','orientation','same',st.orientation==='same')+choice('반대 방향','orientation','opposite',st.orientation==='opposite');
 if(id==='f05-04')return range('distance','중심 사이 거리',3,12,.5,st.distance,' cm');
 if(id==='f05-05')return choice('렌즈','region','lens',st.region==='lens')+choice('초승달','region','crescent',st.region==='crescent');
 if(id==='f05-06')return choice('꽃잎 강조','shade','true',st.shade)+choice('경계 보기','shade','false',!st.shade);
 if(id==='f05-07')return choice('네 꽃잎','showCenter','false',!st.showCenter)+choice('중앙 빈 면','showCenter','true',st.showCenter);
 if(id==='f06-04')return choice('꼭짓점','pivot','corner',st.pivot==='corner')+choice('변의 중점','pivot','midpoint',st.pivot==='midpoint')+choice('도형 중심','pivot','center',st.pivot==='center');
 if(id==='f06-06'||id==='f06-07')return range('roll','넘긴 변의 수',0,id==='f06-06'?3:4,.01,st.roll,'');
 return range('turn',id==='f06-05'?'각 회전의 각도':'회전각',0,id==='f06-05'?180:id==='f06-08'?180:360,5,st.turn,'°');
}
function model(id,st,g){return id.startsWith('f04-')?f04(id,st,g):id.startsWith('f05-')?f05(id,st,g):f06(id,st,g);}
function draw(){const id=TL.family,st=state(id),g=layout(id),m=model(id,st,g),svg=tlGet('tlScene');svg.setAttribute('viewBox',`0 0 ${g.vw} ${g.vh}`);svg.style.aspectRatio=`${g.vw}/${g.vh}`;svg.setAttribute('aria-label',`${m.stage}. ${m.note}`);let out=`<rect width="${g.vw}" height="${g.vh}" fill="#0a2118"/><g opacity="${TL.mode==='perimeter'?.25:1}">${m.svg}</g>`;if(TL.mode!=='area'||id.startsWith('f06-'))m.parts.forEach((p,i)=>{out+=`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="${TL.focus===i?6:4}" stroke-opacity="${TL.focus<0||TL.focus===i?1:.2}" stroke-linecap="round"/><path d="${p.d}" fill="none" stroke="transparent" stroke-width="20" data-tl-part="${i}"/>`;});if(TL.trace>0){let n=TL.trace*m.parts.reduce((a,p)=>a+p.lenPx,0);m.parts.forEach(p=>{const v=Math.max(0,Math.min(p.lenPx,n));n-=p.lenPx;if(v>.01)out+=`<path d="${p.d}" fill="none" stroke="#ffe59c" stroke-width="7" stroke-linecap="round" stroke-dasharray="${v} ${p.lenPx+5}"/>`;});}svg.innerHTML=out;}
function renderExtra(force=false){const id=TL.family,st=state(id),g=layout(id),m=model(id,st,g),box=tlGet('tlFamilyControls');['tlAngleRow','tlAnglePresets','tlOffsetRow','tlOuterRow','tlInnerRow'].forEach(x=>tlGet(x).hidden=true);box.hidden=false;if(force||box.dataset.family!==id){box.dataset.family=id;box.innerHTML=controls(id,st);}const prefix=id.slice(0,3);tlGet('tlKicker').textContent=`${prefix.toUpperCase()} · 도형 변환`;tlGet('tlLabTitle').textContent=labels[prefix];tlGet('tlLabDescription').textContent='직접 조작하며 도형과 경계의 변화를 살펴보세요.';tlGet('tlShapeName').textContent=m.stage;tlGet('tlStageHint').textContent=m.hint;const small=document.querySelectorAll('.tl-metric small');small[0].textContent=prefix==='f06'?'회전 반지름':'색칠한 면의 넓이';small[1].textContent=prefix==='f06'?'이동 거리':'실제 경계선의 둘레';tlGet('tlAreaNum').innerHTML=mathHTML(`\\(${m.areaMetric}\\)`);tlGet('tlPeriNum').innerHTML=mathHTML(`\\(${m.periMetric}\\)`);tlGet('tlFormulaArea').innerHTML=m.areaLines.map(x=>`<div class="tl-mathline">${mathHTML(`\\(${x}\\)`)}</div>`).join('');tlGet('tlFormulaPeri').innerHTML=m.periLines.map(x=>`<div class="tl-mathline">${mathHTML(`\\(${x}\\)`)}</div>`).join('');tlGet('tlSplitText').textContent=m.splitText||m.note;tlGet('tlAreaObservation').textContent=m.observation;tlGet('tlLegend').innerHTML=m.parts.map((p,i)=>`<button type="button" data-tl-focus="${i}"><span class="tl-dot" style="background:${p.color}"></span>${p.name} · ${tlF01Num(p.length)} cm</button>`).join('');tlGet('tlBoundaryExpr').innerHTML=mathHTML(`\\(${m.periMetric}\\)`);tlGet('tlBoundaryNote').textContent=m.observation;tlGet('tlBeforeTitle').textContent='조작 전 도형';tlGet('tlAfterTitle').textContent='현재 배치';tlGet('tlBeforeSVG').innerHTML=tlF03Mini(m,g,'source');tlGet('tlAfterSVG').innerHTML=tlF03Mini(m,g,'selected');tlGet('tlBeforeValue').textContent=m.note;tlGet('tlAfterValue').textContent=m.observation;tlGet('tlDiff').textContent=m.note;tlGet('tlSplit').innerHTML=[['a','도형 A'],['b','도형 B'],['selected','현재 배치']].map(([k,t])=>`<div class="tl-split-part">${tlF03Mini(m,g,k)}<b>${t}</b></div>`).join('');document.querySelectorAll('[data-tl-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.tlMode===TL.mode);b.setAttribute('aria-pressed',String(b.dataset.tlMode===TL.mode));});if(!m.shapeB){const miniBody=m.svg.replace(/id="([^"]+)"/g,(_,x)=>`id="mini-${x}"`).replace(/url\(#([^)]*)\)/g,(_,x)=>`url(#mini-${x})`),mini=`<svg viewBox="0 0 ${g.vw} ${g.vh}" xmlns="http://www.w3.org/2000/svg">${miniBody}</svg>`;tlGet('tlSplit').innerHTML=`<div class="tl-split-part" style="grid-column:1/-1">${mini}<b>현재 장면</b></div>`;if(!m.shapeA){tlGet('tlBeforeSVG').innerHTML=mini;tlGet('tlAfterSVG').innerHTML=mini;}}tlGet('tlPlay').textContent=TL.animationType?'❚❚ 정지':'▶ 재생';draw();}
const oldRender=renderTransformLab;renderTransformLab=function(){if(isExtra(TL.family)){renderExtra();return;}const small=document.querySelectorAll('.tl-metric small');small[0].textContent='색칠한 면의 넓이';small[1].textContent='실제 경계선의 둘레';oldRender();};
const oldDraw=tlDrawScene;tlDrawScene=function(){if(isExtra(TL.family))draw();else oldDraw();};
const box=tlGet('tlFamilyControls');box.addEventListener('input',e=>{const key=e.target.dataset.exRange;if(!key||!isExtra(TL.family))return;state(TL.family)[key]=+e.target.value;const o=tlGet(`ex-${key}-value`);if(o)o.textContent=e.target.value+(key==='turn'?'°':key==='distance'?' cm':key==='move'||key==='overlay'||key==='reveal'||key==='split'?'%':'');tlStop();TL.trace=0;TL.focus=-1;renderExtra();});
box.addEventListener('click',e=>{const b=e.target.closest('[data-ex-key]');if(!b||!isExtra(TL.family))return;const v=b.dataset.exValue;state(TL.family)[b.dataset.exKey]=v==='true'?true:v==='false'?false:v;tlStop();TL.trace=0;TL.focus=-1;renderExtra(true);});
tlGet('tlReset').addEventListener('click',()=>{if(isExtra(TL.family)){delete states[TL.family];TL.trace=0;renderExtra(true);}});
tlGet('tlPlay').addEventListener('click',e=>{
 if(!isExtra(TL.family))return;e.stopImmediatePropagation();
 if(TL.animationType){tlStop();renderExtra();return;}
 const id=TL.family,st=state(id),key=id.startsWith('f04-')?(id==='f04-06'?'overlay':id==='f04-07'?'reveal':'move'):id.startsWith('f06-')?(id==='f06-06'||id==='f06-07'?'roll':id==='f06-04'?null:'turn'):id==='f05-01'?'split':null;
 const kind=TL.mode==='perimeter'||!key?'trace':'motion',target=key==='roll'?(id==='f06-06'?3:4):key==='turn'?(id==='f06-05'||id==='f06-08'?90:360):100,start=performance.now();let lastInfo=0;
 TL.trace=0;TL.animationType='extra';
 const setProgress=t=>{if(kind==='trace')TL.trace=t;else if(key){st[key]=target*t;const input=tlGet(`ex-${key}`),output=tlGet(`ex-${key}-value`);if(input)input.value=st[key];if(output)output.textContent=tlF01Num(st[key])+(key==='turn'?'°':key==='roll'?'':'%');}};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){setProgress(1);tlStop();renderExtra(true);return;}
 function frame(now){const t=Math.min(1,(now-start)/3000);setProgress(t);if(now-lastInfo>150){renderExtra();lastInfo=now;}else draw();if(t<1)TL.animation=requestAnimationFrame(frame);else{tlStop();renderExtra(true);}}
 TL.animation=requestAnimationFrame(frame);renderExtra();
},true);
})();
