/* Current-question solutions. Each case follows the actual target and supplied
   numbers; exploration constructions and their controls remain in t1–t6. */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { pt, mid, bboxOf, fit, fillPoly, line, poly, tick, par, parAll, ang, T, tagOut, sideTag, para, inter } = G;
  const answer = Q => Q.choices.find(c => c.ok);
  const displayAnswer = Q => answer(Q).h || (answer(Q).t != null ? '$' + answer(Q).t + '$' : answer(Q).p);
  const finish = Q => `따라서 이 문제의 답은 ${displayAnswer(Q)}예요.`;
  const given = Q => (Q.stem || Q.html).replace(/<[^>]*>/g, '');
  const book = {
    'q1-1': (m,s,q) => m.K===2 ? [given(q),'평행사변형의 마주 보는 변은 각각 길이가 같아요.',`CD=AB=${m.s}, AD=BC=${m.w}이므로 네 변을 모두 더해요.`,`둘레=2×(${m.s}+${m.w})=${2*(m.s+m.w)}`,finish(q)] : [given(q),m.K===0?'평행사변형의 마주 보는 두 각은 같아요.':'AD∥BC이므로 같은 쪽 내각 ∠A와 ∠B의 합은 180°예요.',m.K===0?`∠D=∠B=${m.beta}°`:`∠A=180°−${m.beta}°=${m.alpha}°`,finish(q)],
    'q1-2': (m,s,q) => m.K===0 ? [given(q),`BE가 ∠B를 이등분하므로 ∠EBC=${m.beta}°÷2=${m.hb}°예요.`,`AD∥BC이므로 ∠AEB=∠EBC (엇각)예요.`,`∠AEB=${m.hb}°`,finish(q)] : [given(q),`이웃한 두 각의 합이 180°이므로 ∠A=180°−${m.beta}°=${m.alpha}°예요.`,`AE가 ∠A를 이등분하므로 ∠DAE=${m.alpha}°÷2=${m.ha}°예요.`,`AD∥BC이므로 ∠AEB=∠DAE=${m.ha}° (엇각)예요.`,finish(q)],
    'q1-3': (m,s,q) => [given(q),'대각선은 서로 이등분하므로 OA=OC예요. AD∥BC의 엇각과 맞꼭지각을 이용하면 △AOE≡△COF (ASA)예요.','합동인 대응변 AE와 CF가 같고, O를 중심으로 180° 돌리면 ABFE와 CD EF가 포개져요.'.replace('CD EF','CDEF'),m.K===0?`BF=BC−FC=AD−AE=${m.w}−${m.e}=${m.rest}`:m.K===1?`FC=AE=${m.e}`:`ABFE와 CDEF의 넓이가 같으므로 ABFE의 넓이=${m.S}÷2=${m.S/2}`,finish(q)],
    'q1-4': (m,s,q) => [given(q),`두 대각선은 서로 이등분하므로 OA=${m.ac}÷2=${m.p}, OB=${m.bd}÷2=${m.q}예요.`,m.K===0?'△ABO의 세 변 AB, BO, OA를 더해요.':'△ABO의 둘레에서 이미 구한 OA와 OB를 빼요.',m.K===0?`둘레=${m.c}+${m.p}+${m.q}=${m.per}`:`AB=${m.per}−${m.p}−${m.q}=${m.c}`,finish(q)],
    'q1-5': (m,s,q) => [given(q),'AE는 ∠A의 이등분선이므로 ∠BAE=∠DAE예요. AD∥BC이므로 ∠DAE=∠AEB (엇각)예요.','△ABE의 두 밑각이 같으므로 BE=AB예요.',m.K===0?`E가 BC 안에 있으므로 EC=BC−BE=${m.w}−${m.s}=${m.ec}`:`E가 C 바깥에 있으므로 CE=BE−BC=${m.bb}−${m.a}=${m.bb-m.a}`,finish(q)],
    'q2-2': (m,s,q) => [given(q),'평행한 바로 그 한 쌍의 대변 AD와 BC의 길이가 같으므로 ABCD는 평행사변형이에요.',m.K===0?'평행사변형의 마주 보는 각 ∠B와 ∠D는 같아요.':'평행사변형의 대변 AB와 DC도 길이가 같아요.',m.K===0?`∠D=∠B=${m.beta}°`:`둘레=2×(${m.bc}+4)=${m.per}`,finish(q)],
    'q2-3': (m,s,q) => [given(q),'직각삼각형 ABE와 CDF에서 AB=CD, 대응하는 엇각이 같으므로 합동이에요.','대응변 AE=CF이므로 AC=AE+EF+CF=2AE+EF예요.',m.K===0?`AE=(${m.L}−${m.ef})÷2=${m.e}`:`EF=${m.L}−2×${m.e}=${m.ef}`,finish(q)],
    'q2-4': (m,s,q) => [given(q),'사각형의 네 각의 합은 360°이고 두 쌍의 대각이 같으므로 ∠A+∠B=180°예요.',`BA를 A 너머로 연장한 점이 E이므로 ∠EAD=180°−∠A=180°−${m.a}°=${m.beta}°예요.`,m.K===0?`구하는 외각 ∠EAD는 ${m.beta}°예요.`:'∠EAD=∠B이고 두 각은 동위각이에요. 따라서 AD∥BC를 얻어요.',finish(q)],
    'q3-1': (m,s,q) => m.K===0 ? [given(q),'직사각형의 대각선은 길이가 같고 서로 이등분하므로 OB=OC예요.',`△OBC는 이등변삼각형이므로 ∠OCB=∠OBC=${m.th}°예요.`,`∠AOB는 △OBC의 외각이므로 ∠AOB=${m.th}°+${m.th}°=${2*m.th}°예요.`,finish(q)] : [given(q),'직사각형의 두 대각선은 길이가 같으므로 BD=AC예요.','대각선은 서로 이등분하므로 OB는 BD의 절반이에요.',`OB=${m.acv}÷2=${m.acv/2}`,finish(q)],
    'q3-2': (m,s,q) => m.K===0 ? [given(q),`이웃한 내각의 합이 180°이므로 ∠B=180°−${m.al}°=${180-m.al}°예요.`,'마름모의 대각선 BD는 ∠B를 이등분해요.',`∠ABD=${180-m.al}°÷2=${(180-m.al)/2}°`,finish(q)] : [given(q),'마름모의 두 대각선은 수직이므로 ∠AOB=90°예요.',`직각삼각형 ABO의 두 예각의 합은 90°예요.`,`∠BAO=90°−${m.th}°=${90-m.th}°`,finish(q)],
    'q3-3': (m,s,q) => [given(q),m.K===0?'정사각형은 네 각이 직각이고 네 변의 길이가 모두 같아요.':'이미 직사각형이므로 네 각은 직각이에요. 여기에 네 변이 같다는 조건이 필요해요.',m.K===0?'평행사변형에 직사각형이 되는 조건과 마름모가 되는 조건을 함께 더해요.':'직사각형은 대변의 길이가 같으므로 이웃한 두 변까지 같으면 네 변이 모두 같아져요.',answer(q).hint || '서로 다른 두 성질을 동시에 만족하는지 확인해요.',finish(q)],
    'q3-4': (m,s,q) => [given(q),'평행사변형에서는 이미 대변이 평행하고 두 대각선이 서로 이등분해요. 추가 조건을 구분해요.',m.K===0?'두 대각선의 길이가 같거나 한 내각이 직각이면 직사각형이에요. 이웃한 두 각이 같아도 그 합이 180°이므로 둘 다 90°예요.':'이웃한 두 변이 같으면 네 변이 모두 같아져 마름모예요. 두 대각선이 수직이면 이등분된 직각삼각형들의 합동으로 이웃한 두 변이 같아져요.',`현재 보기에서 선택할 조건: ${displayAnswer(q)}`,finish(q)],
    'q3-5': (m,s,q) => [given(q),'포함 관계에서 작은 영역 안의 도형은 바깥 영역의 성질을 모두 가져요. 거꾸로는 항상 성립하지 않아요.','정사각형은 직사각형이면서 마름모예요. 직사각형과 마름모는 각각 평행사변형이고, 평행사변형은 사다리꼴이에요.',m.K===0?(answer(q).hint || '선택한 문장의 반대 방향과 혼동하지 마세요. 직각 조건과 네 변이 같다는 조건은 서로 달라요.'):`${displayAnswer(q)} 이 포함 방향은 성립해요.`,finish(q)],
    'q4-1': (m,s,q) => m.K===2 ? [given(q),'등변사다리꼴에서 AB=DC이고 아랫변 양 끝각 ∠B=∠C예요.','△ABC와 △DCB는 두 변과 끼인각이 같아 합동(SAS)이므로 두 대각선도 같아요.',`BD=AC=${m.a+m.bb-2}`,finish(q)] : [given(q),'AD∥BC이므로 한쪽 다리에 이웃한 두 내각의 합은 180°예요.',m.K===0?`∠A=180°−${m.t}°=${m.top}°예요.`:`∠B=180°−${m.top}°=${m.t}°예요.`,m.K===0?'구하는 각은 ∠A예요.':'등변사다리꼴의 아랫변 양 끝각이 같으므로 ∠C=∠B예요.',finish(q)],
    'q4-2': (m,s,q) => [given(q),'D에서 AB와 평행한 선분 DE를 그어요. AD∥BE이므로 ABED는 평행사변형이에요.','∠B=∠C=60°이고 ∠DEC=60°이므로 △DEC는 정삼각형이에요. 따라서 EC=DC=AB이고 BE=AD예요.',m.K===0?`BC=AD+AB=${m.a}+${m.l}=${m.bc}`:m.K===1?`AD=BC−AB=${m.bc}−${m.l}=${m.a}`:`BC=${m.a}+${m.l}=${m.bc}이므로 둘레=${m.a}+${m.bc}+2×${m.l}=${m.per}`,finish(q)],
    'q5-1': (m,s,q) => [given(q),'△ACD와 △ACE는 밑변 AC가 같고 D와 E는 AC에 평행한 직선 위에 있으므로 높이도 같아요.','따라서 △ACD와 △ACE의 넓이는 같고, △ABE=△ABC+△ACE예요.',m.K===0?`△ABE=${m.S1}+${m.S2}=${m.tot}`:m.K===1?`△ACE=△ACD=${m.S2}`:`△ACD=△ACE=${m.tot}−${m.S1}=${m.S2}`,finish(q)],
    'q5-2': (m,s,q) => [given(q),'△ABD와 △ADC는 꼭짓점 A에서 BC까지의 높이가 같아요.',`높이가 같은 삼각형의 넓이의 비는 밑변의 비 ${m.m}:${m.n}과 같아요.`,m.K===0?`△ABD=${m.S}×${m.m}÷(${m.m}+${m.n})=${m.S1}`:`△ADC=${m.S1}×${m.n}÷${m.m}=${m.S2}`,finish(q)],
    'q5-3': (m,s,q) => [given(q),'AD∥BC이므로 △ABD와 △ACD는 밑변 AD와 높이가 같아 넓이가 같아요.','두 삼각형에서 공통인 △AOD를 빼면 △ABO=△DCO예요.',m.K===0?`△DCO는 △DBC에서 △OBC를 뺀 넓이예요. ${m.dbc} − ${m.dn} = ${m.side}이므로 △ABO도 ${m.side}예요.`:`△DCO = △ABO = ${m.side}`,finish(q)],
    'q5-4': (m,s,q) => [given(q),'마주 보는 두 변을 밑변으로 하는 삼각형의 높이의 합은 평행사변형의 높이예요.','따라서 △PAB+△PCD=△PBC+△PDA=전체 넓이÷2예요.',m.K===0?`△PCD=${m.S}÷2−${m.lf}=${m.rt}`:`△PDA=${m.lf}+${m.rt}−${m.bot}=${m.top}`,finish(q)],
    'q5-5': (m,s,q) => [given(q),'△EBC는 평행사변형과 밑변 BC와 높이가 같으므로 전체 넓이의 절반이에요.','나머지 △ABE와 △ECD의 넓이의 합도 전체의 절반이에요.',m.K===0?`△EBC=${m.S}÷2=${m.half}`:m.K===1?`전체 넓이=2×(${m.abe}+${m.ecd})=${m.S}`:`△ECD=${m.S}÷2−${m.abe}=${m.ecd}`,finish(q)],
    'q6-1': (m,s,q) => [given(q),'접으면 ∠DAC=∠D′AC이고, AD∥BC의 엇각으로 ∠DAC=∠ACB예요.','∠AEB는 △AEC의 외각이므로 ∠AEB=∠EAC+∠ECA=2×∠DAC예요.',m.K===0?`∠AEB=2×${m.th}°=${m.aeb}°`:`∠DAC=${m.aeb}°÷2=${m.th}°`,finish(q)],
    'q6-2': (m,s,q) => [given(q),'C와 A가 포개어지므로 접는 선 EF는 ∠AEC를 이등분해요.',`∠AEC=180°−${m.aeb}°=${180-m.aeb}°이므로 ∠AEF=∠CEF=${180-m.aeb}°÷2=${m.aef}°예요.`,m.K===0?`구하는 ∠AEF는 ${m.aef}°예요.`:`EC∥FD이므로 ∠EFD=180°−∠CEF=180°−${m.aef}°=${m.efd}°예요.`,finish(q)],
    'q6-3': (m,s,q) => [given(q),'정사각형에서 AB=AD이고 AC가 ∠A를 이등분해요. AE는 공통이므로 △ABE≡△ADE (SAS)예요.',`A,E,C는 한 직선 위에 있으므로 ∠AEB=180°−${m.th}°=${m.aeb}°예요.`,m.K===0?`∠ADE=∠ABE=180°−45°−${m.aeb}°=${m.g}°`:`∠AED=∠AEB=${m.aeb}° (합동의 대응각)`,finish(q)],
    'q6-4': (m,s,q) => [given(q),'AB=BC=BE이고 ∠ABE=90°−60°=30°이므로 △ABE는 이등변삼각형이에요.','∠BAE=∠AEB=(180°−30°)÷2=75°예요. 대칭인 △DCE에서도 밑각은 75°예요.',m.K===0?'구하는 ∠BAE는 75°예요.':m.K===1?'∠EAD=∠EDA=90°−75°=15°이므로 ∠AED=180°−15°−15°=150°예요.':m.K===2?'∠EAD=90°−∠BAE=90°−75°=15°예요.':'구하는 ∠AEB는 75°예요.',finish(q)],
    'q6-5': (m,s,q) => m.K===0 ? [given(q),'AB=BC, BE=CF이고 ∠ABE=∠BCF=90°이므로 △ABE≡△BCF (SAS)예요.',`합동인 대응각 ∠CBF=∠BAE=${m.th}°예요.`,`△BCF는 직각삼각형이므로 ∠BFC=90°−${m.th}°=${90-m.th}°예요.`,finish(q)] : [given(q),'정사각형의 네 변은 같으므로 CD는 한 변의 길이와 같아요.','F는 선분 CD 안에 있으므로 FD=CD−CF예요.',`FD=${m.S}−${m.e}=${m.fd}`,finish(q)],
    'q6-6': (m,s,q) => [given(q),'O에서 만나는 두 변은 직각이에요. 이 두 반직선을 90°씩 돌려 정사각형 ABCD를 네 영역으로 나눠요.','정사각형은 O 주위로 90° 회전해도 포개지므로 그 네 영역은 서로 합동이에요. 따라서 겹친 넓이는 전체 넓이의 4분의 1이에요.',m.K===0?`전체 넓이=${m.S}×${m.S}=${m.area}이므로 겹친 넓이=${m.area}÷4=${m.ov}`:`전체 넓이=겹친 넓이×4=${m.ov}×4=${m.area}`,finish(q)]
  };
  function conditionSteps(m,s,q) {
    return [given(q),'조건이 성립하는 예와, 조건은 만족하지만 평행사변형이 아닌 반례를 구분해요.',q.answerReason,`현재 보기에서 ${q.wantTrue?'성립하는 조건':'반례가 있는 조건'}은 ${displayAnswer(q)}예요.`,finish(q)];
  }
  function namePoints(b,g) {
    const cen = G.centroid([g.A,g.B,g.C,g.D]);
    for(const k of ['A','B','C','D']){b.point(g[k],{color:'ink',r:4.5});tagOut(b,g[k],cen,k,{size:17,gap:12});}
    if(g.O){b.point(g.O,{color:'ink',r:4});T(b,g.O,'O',{dx:12,dy:12,size:15});}
  }
  function conditionDiagram(b,Q,step,lesson=false) {
    const id=Q.conditionId;
    let g;
    if(id==='f1'||id==='f3') g={A:pt(2,-4),B:pt(0,0),C:pt(8,0),D:pt(6,-4)};
    else if(id==='f2'||id==='f6') g={A:pt(-3,0),B:pt(0,-2),C:pt(3,0),D:pt(0,5)};
    else if(id==='f4'||id==='f5') g={A:pt(0,-2),B:pt(-3,0),C:pt(0,5),D:pt(3,0)};
    else g=para(8,4,66);
    g.O=inter(g.A,g.C,g.B,g.D);const{A,B,C,D,O}=g;
    fit(b,bboxOf([A,B,C,D]),{t:42,b:lesson?110:48,l:46,r:46});fillPoly(b,[A,B,C,D],'sky',.08);poly(b,[A,B,C,D],'ink',3.3);
    if(step>=2){
      if(['t4','f3','f4','f5'].includes(id)){line(b,A,C,'green',2.7);line(b,B,D,'green',2.7);}
      if(id==='t1')parAll(b,g);
      if(id==='t2'){tick(b,A,B,1);tick(b,C,D,1);tick(b,A,D,2);tick(b,B,C,2);}
      if(id==='t3'||id==='f6'){ang(b,A,B,D,{rings:1,color:'sky'});ang(b,C,B,D,{rings:1,color:'sky'});if(id==='t3'){ang(b,B,A,C,{rings:2,color:'green'});ang(b,D,A,C,{rings:2,color:'green'});}}
      if(id==='t4'){tick(b,A,O,1);tick(b,O,C,1);tick(b,B,O,2);tick(b,O,D,2);}
      if(id==='t5'||id==='f1'){par(b,A,D,1,'green');par(b,B,C,1,'green');if(id==='t5'){tick(b,A,D,1);tick(b,B,C,1);}else{tick(b,A,B,1);tick(b,C,D,1);}}
      if(id==='f2'){tick(b,A,B,1);tick(b,B,C,1);tick(b,C,D,2);tick(b,D,A,2);}
      if(id==='f3'){tick(b,A,C,1);tick(b,B,D,1);}
      if(id==='f4')b.right(O,A,B,{size:12,color:'green'});
      if(id==='f5'){tick(b,B,O,1);tick(b,O,D,1);}
    }
    namePoints(b,g);
    if(step>=3&&['f1','f3'].includes(id)){sideTag(b,A,D,O,'AD=4',{color:'sky'});sideTag(b,B,C,O,'BC=8',{color:'sky'});}
    if(step>=3&&['f4','f5'].includes(id)){T(b,mid(A,O),'2',{dx:20,color:'sky'});T(b,mid(O,C),'5',{dx:20,color:'sky'});}
  }
  function support(b,s,m,id,n){
    if(n<2)return;
    const g=id==='q1-5'?(m.K?m.pq:m.p):m.p||m;
    const {A,B,C,D,O}=g;
    if(id==='q1-1'&&m.K!==2)line(b,A,C,'green',2.6,{dash:[7,5]});
    if(id==='q1-1'&&m.K===2){tick(b,A,B,1);tick(b,C,D,1);tick(b,A,D,2);tick(b,B,C,2);}
    if(id==='q1-2')fillPoly(b,[m.p.A,m.p.B,m.K===0?m.E0:m.E1],'amber',.1);
    if(id==='q1-3'){fillPoly(b,[m.p.A,m.p.O,m.E],'green',.11);fillPoly(b,[m.p.C,m.p.O,m.F],'green',.11);tick(b,m.p.A,m.p.O,1);tick(b,m.p.O,m.p.C,1);}
    if(id==='q1-5'){const E=m.K?m.Eq:m.E;fillPoly(b,[A,B,E],'amber',.1);if(n>=3){tick(b,A,B,1);tick(b,B,E,1);}}
    if(id==='q3-1'){const r=m.K===0?m.rr:para(8,5,90);tick(b,r.B,r.O,1);tick(b,r.O,r.C,1);if(n>=3)fillPoly(b,[r.O,r.B,r.C],'green',.1);}
    if(id==='q3-2'){const r=m.K===0?m.rp:m.rq;if(m.K===0){line(b,r.B,r.D,'green',2.8);tick(b,r.A,r.B,1);tick(b,r.B,r.C,1);}else{b.right(r.O,r.A,r.B,{size:12,color:'green'});if(n>=3)fillPoly(b,[r.A,r.O,r.B],'green',.1);}}
    if(id==='q4-2'){line(b,m.D,m.E,'green',3,{dash:[7,5]});if(n>=3)fillPoly(b,[m.D,m.E,m.C],'green',.12);}
    if(id==='q5-1'){line(b,m.A,m.C,'green',2.8,{dash:[7,5]});if(n>=3){fillPoly(b,[m.A,m.C,m.D],'sky',.09);fillPoly(b,[m.A,m.C,m.E],'green',.09);}}
    if(id==='q5-2'){line(b,m.A,m.D,'green',2.8);if(n>=3){fillPoly(b,[m.A,m.B,m.D],'sky',.1);fillPoly(b,[m.A,m.D,m.C],'green',.1);}}
    if(id==='q5-3'){fillPoly(b,[m.A,m.B,m.D],'sky',.08);fillPoly(b,[m.A,m.C,m.D],'green',.08);if(n>=3)fillPoly(b,[m.A,m.O,m.D],'rose',.12);}
    if(id==='q5-4'&&n>=3){fillPoly(b,[m.P,m.A,m.B],'sky',.1);fillPoly(b,[m.P,m.C,m.D],'sky',.1);}
    if(id==='q5-5'&&n>=3)fillPoly(b,[m.E,m.B,m.C],'green',.1);
    if(id==='q6-1'){line(b,m.A,m.C,'green',3,{dash:[7,5]});if(n>=3)fillPoly(b,[m.A,m.E,m.C],'green',.1);}
    if(id==='q6-2'){line(b,m.E,m.F,'green',3,{dash:[7,5]});if(n>=3){tick(b,m.E,m.A,1);tick(b,m.E,m.C,1);}}
    if(id==='q6-3'){fillPoly(b,[m.A,m.B,m.E],'sky',.1);fillPoly(b,[m.A,m.D,m.E],'green',.1);}
    if(id==='q6-4'){tick(b,m.A,m.B,1);tick(b,m.B,m.E,1);fillPoly(b,[m.A,m.B,m.E],'amber',.1);}
    if(id==='q6-5'){const z=m.K===0?m.g2:m;fillPoly(b,[z.A,z.B,z.E],'sky',.1);fillPoly(b,[z.B,z.C,z.F],'green',.1);}
    if(id==='q6-6'&&n>=3){const u=G.sub(m.sq2[1],m.O),end=G.add(m.O,G.mul(u,m.h/Math.max(Math.abs(u.x),Math.abs(u.y))));for(let i=0;i<4;i++){const p=G.rotP(end,m.O,90*i);line(b,m.O,p,'green',2,{dash:[6,5]});}}
  }
  for(const group of window.APL_QD_GROUPS||[])for(const scene of group.scenes){
    const D=scene.qd;
    D.solve=book[D.id]||conditionSteps;
    D.solveDraw=(b,s,m,c,solution)=>{
      const n=Math.max(1,s.step||1),final=n>=solution.steps.length,Q=solution.question;
      if(Q.conditionId&&n>=2){conditionDiagram(b,Q,n,!!c.lesson);return;}
      if(D.id==='q3-3'&&n>=2){D.draw(b,s,m,{...c,problem:false,review:true,step:n-1});return;}
      if(D.id==='q3-4'&&n>=2){D.draw(b,s,{...m,bi:true,le:n>=3&&m.K===0,pe:n>=3&&m.K===1},{...c,problem:false,review:false,step:99});return;}
      if(D.id==='q3-5'&&n>=2){
        const name=answer(Q).p.split('은')[0].split('는')[0],k={'정사각형':'sq','직사각형':'rect','마름모':'rhomb','평행사변형':'para','사다리꼴':'trap'}[name]||'sq';
        D.draw(b,s,D.model({...s,qcSh:k}),{...c,problem:false,review:false,step:99});return;
      }
      // Draw the current question, including its target-specific construction.
      // Replace its unknown only on the final step; intermediate calculations
      // appear in the step panel and supporting lines are added below.
      const text=b.text;
      b.text=function(p,str,o){
        if(final&&!answer(Q).h){
          str=String(str).replace(/x(?:°|\s*cm)?$/,answer(Q).p);
          // The inverse area question puts x before the target's description.
          if(D.id==='q5-5')str=str.replace(/^x(?=\s*=)/,answer(Q).p);
        }
        return text.call(this,p,str,o);
      };
      try{D.draw(b,s,m,{...c,problem:true,review:false,full:false,step:99,t:1});}finally{b.text=text;}
      support(b,s,m,D.id,n);
    };
  }
})();
