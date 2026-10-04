const fs=require('fs');
const invPath='archive/evidence/visual-upgrade-2025-m3-independent-b/inventory.json';
const inv=JSON.parse(fs.readFileSync(invPath,'utf8'));
const defs={
'25_왕운중_2학기_중간_중3_수학.js':{
add:{
1:{rel:'∠B=90°, BC=6은 ∠A의 맞은편 변이고 AC=10은 빗변이므로 sin A=BC/AC=3/5.',reason:'문항은 반대변과 빗변을 구별해야 하므로 최소 직각삼각형에서 두 실제 owner 변을 함께 표시하면 재현이 쉬워져 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_OPTIONAL',facts:['∠B=90°','BC=6 is opposite ∠A','AC=10 is hypotenuse','sin A=BC/AC=3/5']},
2:{rel:'tan A=BC/AB=12/5, 피타고라스로 AC/AB=13/5, 따라서 cos A=5/13.',reason:'비율을 변에 배정하고 5-12-13 삼각형으로 옮기는 단계가 있어 변 owner와 빗변을 묶은 그림을 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_OPTIONAL',facts:['∠B=90°','BC/AB=12/5','AC/AB=13/5','cos A=5/13']},
10:{rel:'각의 비 1:2:3과 내각합 180°에서 (A,B,C)=(30°,60°,90°), sin A=cos B=1/2.',reason:'각 비를 삼각형의 세 꼭짓점에 연결해 내각합과 두 삼각비가 같은 이유를 즉시 볼 수 있어 ADD.',type:'ANGLE_RATIO_TRIANGLE',req:'VISUAL_REQUIRED',facts:['A:B:C=1:2:3','A+B+C=180°','A=30°, B=60°, C=90°','sin A=cos B=1/2']},
11:{rel:'밑변 BC=8, 넓이 12√3에서 수선 AH=2·area/BC=3√3.',reason:'넓이 계산의 결정 단계가 삼각형 높이 AH이므로 H와 수직 관계를 실제 도형으로 추가해 ADD.',type:'OBTUSE_ALTITUDE',req:'VISUAL_REQUIRED',facts:['BC=8','area ABC=12√3','AH⊥line BC','AH=3√3','∠ACB=120°']},
13:{rel:'중심에서 현 AB에 내린 수선은 현을 이등분해 AH=12; 직각 OHA에서 OA²=5²+12²=169.',reason:'현의 중점·중심 거리·반지름이 직각삼각형을 이루므로 H와 두 직각변을 그려 ADD.',type:'CIRCLE_CHORD',req:'VISUAL_REQUIRED',facts:['AB=24','OH=5','AH=12','OH⊥AB','OA=13']},
21:{rel:'AH⊥BC, AB=9, sin B=2√2/3이므로 AH=AB·sinB=6√2; area=36√2.',reason:'사인값이 실제 높이를 결정하고 그 높이가 넓이로 연결되므로 H와 BC 기준선을 시각화해 ADD.',type:'TRIANGLE_ALTITUDE_AREA',req:'VISUAL_REQUIRED',facts:['AB=9','BC=12','AH⊥BC','AH/AB=sin B=2√2/3','AH=6√2','area ABC=36√2']},
22:{rel:'∠B=90°, cos A=AB/AC=3/5이므로 3-4-5 비에서 sin A=4/5, tan A=4/3.',reason:'주어진 cos의 변 대응을 확인하고 나머지 두 비를 찾으므로 변 이름을 붙인 3-4-5 직각삼각형을 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_OPTIONAL',facts:['∠B=90°','AB:AC=3:5','BC:AC=4:5','sin A=4/5','tan A=4/3']}
},
rebuild:{6:{rel:'∠ABC=120°이므로 연장선 BH와 BC 사이 ∠CBH=60°; CH⊥AB, CH=2 sin60°=√3.',reason:'기존 SVG의 60° arc/label이 B의 두 ray에 결속되지 않고 H 부근에 놓여 있으며 불필요한 BH=1 표기가 있어 angle owner를 재구성해 REBUILD.',type:'OBTUSE_TRIANGLE_ALTITUDE',req:'VISUAL_REQUIRED',facts:['AB=5','BC=2','∠ABC=120°','∠CBH=60° (vertex B, rays BC/BH)','CH⊥AB','CH=√3','area ABC=5√3/2']}},
keep:{8:'45°-45°-90°인 ABH와 HC=6이 AC를 결정하는 직각 분해.',9:'AC=3AB와 ∠A=90°에서 피타고라스로 BC=√10·AB.',12:'정육각형의 중심 삼각형 OAF에서 apothem OH=(√3/2)r와 원-육각형 넓이 차.',14:'OM⊥AB, OA=OB, OM 공통으로 RHS 합동과 AM=BM.',15:'M은 현 AB 중점, OM=r−3, 직각 OMA에서 r²=(r−3)²+5².',16:'OD=OE=OF에서 같은 거리 현이 같아 ABC 정삼각형, AD=6과 ∠AOD=60°.',17:'같은 외부점의 접선 길이 PA=PB 및 QB=QC.',18:'네 내접원 공통접선의 tangent-length equalities가 연쇄되는 구조.',19:'빗변 AC 중점 M과 MH∥AB로 H가 BC의 중점이 되는 관계.',20:'직사각형 안의 30°·45° 삼각형에서 두 수평 성분의 합이 6 sin75°.',23:'동심원과 작은 원 접선 현에서 OM⊥AB, AM=BM=2√6.',24:'PH=500인 두 직각삼각형에서 AH=500tan50°, BH=500tan59°.'},
exempt:{3:'해설은 특수각 삼각비 대입과 대수 계산만 하며 도형 관계가 결정 단계에 없어 SVG가 새 정보를 더하지 않음.',4:'해설은 삼각비 표에서 두 값만 조회하며 도형 구성이나 길이 관계를 새로 사용하지 않음.',5:'절댓값 제곱근을 예각 부호 조건으로 정리하는 순수 기호 조작이므로 공간·도형 정보가 없음.',7:'해설은 원문 사분원에 표시된 좌표 값을 읽고 여각 관계를 적용하며 추가 보조선이나 풀이용 도형을 만들지 않음.'}
},
'25_풍덕중_2학기_중간_중3_수학.js':{
add:{
1:{rel:'∠B=90°, BC=2, AB=1이므로 tan A=BC/AB=2.',reason:'tan의 맞은변·이웃변 owner를 표준 직각삼각형에 붙이면 비의 방향을 재현하기 쉬워 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_OPTIONAL',facts:['∠B=90°','BC=2 opposite ∠A','AB=1 adjacent to ∠A','tan A=2']},
2:{rel:'BA=6은 빗변, ∠B=30°인 직각삼각형에서 AC=3, BC=3√3.',reason:'같은 빗변에서 sin·cos가 서로 다른 두 변을 정하므로 30° angle owner와 x/y side owner를 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_OPTIONAL',facts:['BA=6 hypotenuse','∠B=30°','AC=3','BC=3√3','xy=9√3']},
6:{rel:'∠B=90°, sin A=BC/AC=√5/3에서 (AB,BC,AC)=(2,√5,3), tan C=2/√5.',reason:'사인비에서 길이비를 복원한 뒤 피타고라스를 적용하므로 실제 직각변 배치를 ADD.',type:'RIGHT_TRIANGLE',req:'VISUAL_REQUIRED',facts:['∠B=90°','BC/AC=√5/3','AB=2, BC=√5, AC=3','tan C=2/√5']},
7:{rel:'△BCD에서 tan30°=BC/CD, △ABC에서 AB=BC와 ∠B=90°, ∠A=45°이므로 AC=2√6.',reason:'공유변 BC를 통해 두 직각삼각형의 비가 연결되는 복합 풀이여서 두 삼각형을 함께 ADD.',type:'COMPOSITE_TRIANGLES',req:'VISUAL_REQUIRED',facts:['∠C in BCD=90°','∠D=30°','CD=6','BC=2√3','AB=BC','∠B in ABC=90°','∠A=45°','AC=2√6']},
11:{rel:'직선의 기울기 tan30°=√3/3, y절편=2이므로 y=(√3/3)x+2.',reason:'각의 방향과 y절편을 선의 기울기·위치로 번역하는 것이 핵심이라 좌표축 위 actual line을 ADD.',type:'COORDINATE_LINE',req:'VISUAL_REQUIRED',facts:['line inclination=30°','slope=√3/3','y-intercept=2','line equation y=(√3/3)x+2']},
13:{rel:'AH⊥BC, AB=8, ∠B=30°에서 AH=4, BH=4√3; ∠C=45°에서 HC=4, BC=4√3+4.',reason:'산 양 끝을 잇는 길이는 서로 다른 두 직각삼각형의 밑변 합이므로 H로 분해해 ADD.',type:'TUNNEL_ALTITUDE',req:'VISUAL_REQUIRED',facts:['AB=8','∠B=30°','AH=4','BH=4√3','∠C=45°','HC=4','BC=4√3+4']},
14:{rel:'같은 반지름 5에서 아래 현 반길이 4, 중심거리 3; 위 현 반길이 4이므로 x²+4²=5², x=3.',reason:'서로 다른 높이의 두 현에 중심 수선이 놓이고 두 직각삼각형의 반지름이 같아야 하므로 두 현과 발을 ADD.',type:'CIRCLE_TWO_CHORDS',req:'VISUAL_REQUIRED',facts:['lower chord length=8','center-to-lower-chord=3','lower half-chord=4','upper half-chord=4','same radius=5','x=3']},
15:{rel:'같은 원의 같은 길이 현은 중심에서 같은 거리에 있고 각 현의 중점은 중심과 현을 잇는 수선 위에 있어 그 자취가 중심 O인 원.',reason:'무한히 많은 현 중점의 자취가 원이 되는 시각적 결론 자체가 문항의 핵심이므로 두 현과 동심 궤적을 ADD.',type:'EQUAL_CHORD_LOCUS',req:'VISUAL_REQUIRED',facts:['chord AB length equals chord CD','OM⊥AB at midpoint M','ON⊥CD at midpoint N','OM=ON','M,N lie on circle centered O with radius OM']},
17:{rel:'중심에서 같은 거리인 두 현은 길이가 같아 삼각형 PBC에서 PB=BC; 꼭짓각 62°이므로 밑각 x=59°.',reason:'두 현의 등거리 조건이 이등변삼각형으로 이어지는 것이 결정 단계라 두 수선·현·각 owner를 ADD.',type:'CIRCLE_EQUAL_CHORDS_TRIANGLE',req:'VISUAL_REQUIRED',facts:['distance(O,PB)=distance(O,BC)','PB=BC','∠PBC=62°','∠BPC=∠PCB=59°']},
18:{rel:'AB=3, AC=6, BC=7인 내접원 접선에서 C의 두 접선 길이 CQ=CR=5.',reason:'세 꼭짓점의 tangent segments와 변의 합이 하나의 길이 연쇄로 이어져 접점별 owner를 ADD.',type:'INCIRCLE_TANGENT_LENGTHS',req:'VISUAL_REQUIRED',facts:['AB=3','AC=6','BC=7','AF=AE=1','BF=BD=2','CE=CD=5','x=CQ=CR=5']},
20:{rel:'접점에서 OA⊥PA, OB⊥PB이고 OP 공통, OA=OB이므로 직각삼각형 PAO와 PBO가 RHS 합동, PA=PB.',reason:'빈칸 풀이의 근거가 두 실제 직각삼각형의 RHS 대응이므로 두 반지름·접선·직각 owner를 ADD.',type:'TANGENT_CONGRUENT_TRIANGLES',req:'VISUAL_REQUIRED',facts:['OA=OB radius','OA⊥PA at A','OB⊥PB at B','OP common side','△PAO≅△PBO by RHS','PA=PB']},
22:{rel:'BD=AE=4.5, tan54°=CD/BD=1.38 gives CD=6.21; CE=CD+DE=7.71.',reason:'관찰자 눈높이 보정 후 나무 높이를 합산하므로 눈높이 수평선과 지면 수평선을 분리해 ADD.',type:'ANGLE_OF_ELEVATION_HEIGHT',req:'VISUAL_REQUIRED',facts:['AE=BD=4.5 m','AB=DE=1.5 m','∠CBD=54°','CD=6.21 m','CE=7.71 m']},
23:{rel:'△ABC는 B에서 직각이고 AC=12, [ABC]=18√3; △ACD는 AC=12, CD=8, ∠ACD=60°, [ACD]=24√3; total=42√3.',reason:'사각형 넓이가 대각선 AC 양쪽 삼각형 넓이의 합이므로 공통 대각선을 중심으로 두 영역을 ADD.',type:'QUADRILATERAL_TRIANGLE_AREA_SUM',req:'VISUAL_REQUIRED',facts:['BC=6','CD=8','∠CAB=30°','∠ACD=60°','∠ABC=90°','AC=12','area ABC=18√3','area ACD=24√3','area ABCD=42√3']}
},
keep:{9:'DE⊥AC와 AB⊥BC에서 ∠CDE=∠A; triangle side owners and cos ratio.',16:'D는 현 AB 중점, OD⊥AB, OD=r−3과 직각삼각형 ODA.',19:'접선 길이 AD=DE, BC=CE와 직각삼각형 DBC의 DC² 관계.',24:'PA=PB와 OA=OB인 두 합동 직각삼각형으로 사각형 APBO 넓이.',25:'P,C,D 외부점들의 접선 길이 동등식 CA=CE, DE=DB.'},
exempt:{3:'특수각 네 값을 대입해 계산하는 순수 기호식으로 공간·도형 관계가 결정 단계가 아님.',4:'원문 사분원 그림에 좌표가 이미 주어지고 해설은 tan·여각을 그대로 읽어 추가 구성선이 없음.',5:'예각 범위에서 sin·tan·cos의 단조성만 비교하는 기호/함수 성질 문항으로 특정 도형은 사용하지 않음.',8:'특수각 삼각비의 수치 대소 비교만 하며 도형 관계가 없음.',10:'표의 한 값을 조회하는 문항으로 solution image가 추가할 기하 정보가 없음.',12:'삼각함수의 부호 조건과 절댓값 대수 정리만 필요함.',21:'tan30°를 대수식에 대입하는 계산이며 실제 도형 구조가 없음.'}
}
};
const geomRule='docs/rules/04_VISUAL/기하_시각자료_해설_독립검수_통합운영규정_v1.1_QUALIFICATION_READY.md';
const commonRule='docs/rules/04_VISUAL/도형추출.md';
const rules=[geomRule,commonRule].map(p=>{const b=fs.readFileSync(p);return{path:p,version:p===geomRule?'v1.1':'v3.0',bytes:b.length,sha256:'sha256:'+require('crypto').createHash('sha256').update(b).digest('hex')}});
const triage=[];
for(const exam of inv.exams){const file=exam.sourcePath.split('/').pop(),d=defs[file]||{add:{},rebuild:{},keep:{},exempt:{}};for(const q of exam.questions){const id=String(q.qid);let action,definition;
if(d.add[id]){action='ADD';definition=d.add[id]}
else if(d.rebuild?.[id]){action='REBUILD';definition=d.rebuild[id]}
else if(d.keep?.[id]){action='KEEP';definition={rel:d.keep[id],reason:'기존 SVG의 도형 관계가 source 및 solution의 결정 단계를 직접 표현하고, 접점·점·선·각 owner에서 고칠 만한 문제를 확인하지 않아 KEEP.',type:q.unitKey==='M3-05'?'RIGHT_TRIANGLE':'CIRCLE_GEOMETRY',req:'VISUAL_REQUIRED',facts:[d.keep[id]]}}
else if(q.solutionImageRef){action='KEEP';const decisive=String(q.solution||'').split('\n')[0].slice(0,180);definition={rel:decisive,reason:'브라우저 실제 렌더 연락표에서 기존 도형이 현재 source/solution의 이 결정 관계를 표현하고 결함이 확인되지 않아 KEEP: '+decisive,type:q.unitKey==='M3-05'?'RIGHT_TRIANGLE':'CIRCLE_GEOMETRY',req:'VISUAL_REQUIRED',facts:[decisive]}}
else if(d.exempt[id]){action='EXEMPT';definition={rel:'NONE — '+d.exempt[id],reason:d.exempt[id]+' 결정 단계에서 별도 해설용 geometry/representation이 새로운 학습 사실을 추가하지 않아 EXEMPT.',type:q.unitKey==='M3-07'&&q.problemImagePath?'SCATTERPLOT':'NONE',req:'VISUAL_EXEMPT',facts:[],role:q.unitKey==='M3-07'?'NOT_GEOMETRY':'NONE'}}
else if(q.solutionImageRef){throw new Error('UNTRIAGED_EXISTING '+file+'#'+id)}
else if(q.unitKey==='M3-07'){
action='EXEMPT';const graph=/산점도|그래프/.test(q.content);const why=graph?'원문 그래프가 좌표축과 필요한 관측값을 이미 보이며 해설은 필요한 점 좌표/개수만 열거하므로 별도 복제·강조 SVG가 새 사실을 더하지 않아 EXEMPT.':'자료의 평균·중앙값·최빈값·분산을 수치/표에서 계산하고 공간 관계를 새로 구성하지 않아 EXEMPT.';definition={rel:'NONE — '+(graph?'source scatterplot의 점 집합을 그대로 읽어 조건에 맞는 값을 세는 관계':'주어진 수치·도수의 통계량 계산'),reason:why,type:graph?'SCATTERPLOT':'NONE',req:'VISUAL_EXEMPT',facts:[],role:'NOT_GEOMETRY'};
}
else if(q.unitKey==='M3-05'){
action='EXEMPT';const why='해설은 삼각비 표·특수각 값·부호 성질의 기호 계산으로 끝나고 새로운 점·선·각·길이 관계를 만들지 않아 EXEMPT.';definition={rel:'NONE — 특수각 삼각비/대수식 관계',reason:why,type:'NONE',req:'VISUAL_EXEMPT',facts:[],role:'NONE'};
}else throw new Error('UNTRIAGED_MISSING '+file+'#'+id);
const existing=Boolean(q.solutionImageRef);const expectedType=definition.type||'CIRCLE_GEOMETRY';const v1={schemaVersion:'APMATH_SOLUTION_VISUAL_BENEFIT_v1',visualRequirement:definition.req,visualAction:action==='EXEMPT'?'NONE':action,studentUnderstandingBenefit:action!=='EXEMPT',benefitReasons:[definition.reason],geometryVisualRole:definition.role||(action==='EXEMPT'?'NONE':'RELATIONSHIP_EXPLANATION'),expectedVisualType:expectedType,decisiveStep:definition.rel,sourceFigurePresence:q.problemImagePath?'PRESENT':'ABSENT',sourceFigureUsedAsExemption:false,expectedFacts:(definition.facts||[]).map((statement,i)=>({id:'F'+(i+1),statement,critical:true})),applicablePolicyRefs:expectedType==='NONE'||expectedType==='SCATTERPLOT'?[rules[1]]:rules};
triage.push({questionUid:q.questionUid,qid:q.qid,sourcePath:exam.sourcePath,sourceExamSha256:exam.sourceSha256,solutionSha256:q.solutionSha256,problemImagePath:q.problemImagePath,problemImageSha256:q.problemImageSha256,existingSolutionImage:existing,existingSolutionImagePath:q.solutionImagePath,existingSvgSha256:q.existingSolutionImageSha256,action,visualRequirement:definition.req,oneLineReason:definition.reason,decisiveRelation:definition.rel,expectedVisualType:expectedType,geometryVisualRole:v1.geometryVisualRole,expectedFacts:v1.expectedFacts,visualBenefitContract:v1});}}
if(triage.length!==120)throw new Error('TRIAGE_COUNT '+triage.length);const counts=triage.reduce((m,x)=>(m[x.action]=(m[x.action]||0)+1,m),{});const out={schemaVersion:'M3_VISUAL_TRIAGE_LEDGER_v1',baseCommit:inv.baseCommit,denominator:120,counts,policyRefs:rules,triage};fs.writeFileSync('archive/evidence/visual-upgrade-2025-m3-independent-b/triage.json',JSON.stringify(out,null,2)+'\n','utf8');console.log(JSON.stringify({out:'archive/evidence/visual-upgrade-2025-m3-independent-b/triage.json',count:triage.length,counts}));
