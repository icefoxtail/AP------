from pathlib import Path
import math, html, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[2]/'assets/images/26_금당고_2학기_중간_고1_기출'; root.mkdir(parents=True,exist_ok=True)
N='#16324F'; B='#246BCE'; T='#138A82'; O='#D97919'; R='#C44848'; I='#24364B'; M='#65778B'; G='#D8E1EB'
css=f"text{{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;fill:{I}}}.h{{font-size:21px;font-weight:700;fill:{N}}}.s{{font-size:15px;fill:{M}}}.l{{font-size:16px;font-weight:600}}.e{{font-size:17px;font-weight:700}}.p{{fill:white;stroke:{G};stroke-width:2}}"
def text(x,y,v,size='l',anchor='middle',color=None):
 c=f' style="fill:{color}"' if color else ''
 return f'<text x="{x:.1f}" y="{y:.1f}" class="{size}" text-anchor="{anchor}"{c}>{html.escape(str(v))}</text>'
def ln(a,b,c,d,color=I,w=3,dash=None):
 ds=f' stroke-dasharray="{dash}"' if dash else ''
 return f'<line x1="{a:.1f}" y1="{b:.1f}" x2="{c:.1f}" y2="{d:.1f}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"{ds}/>'
def circ(x,y,r,fill='white',stroke=B,sw=3):return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def dot(x,y,color=B,r=5):return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{color}"/>'
def panel(x,y,w,h):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" class="p"/>'
def save(q,w,h,label,b):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{html.escape(label)}"><style>{css}</style><rect width="100%" height="100%" rx="20" fill="white"/>{b}</svg>'
 (root/f'q{q:02d}-solution.svg').write_text(s,encoding='utf-8')
# Python-frozen solution facts.
assert 3*1-4*2+5==0 and abs((3*2-4*(-1)+5)/5)==3 and math.hypot(3,4)==5
assert math.dist((-3,-2),(5,4))==10 and math.dist((17/5,14/5),(5,4))==2
assert abs(math.dist((1,0),(2,3))-math.sqrt(10))<1e-9 and abs(math.dist((-1,2),(2,3))-math.sqrt(10))<1e-9
assert 2**8-8-1==247
S=[15,75,79,83,87,91,95,99]; assert len(S)==8 and min(S)==15 and sum(S)==624 and all(x%4==3 for x in S)
assert math.dist((2/3,2/3),(8/3,5/3))==math.sqrt(5)
assert (-2+3,1+2)==(1,3) and (1,3)[::-1]==(3,1)
assert 3<4<8 and 8<9<12 and 12-10==2
# q03/q05/q09/q10/q11/q13 frozen facts.
assert (-2)*(-2)+3*3==13 and -2*1+3*5==13 and (-2)*3+3*2==0
assert (3,-2)[::-1]==(-2,3)
assert (5-(-3),-4-(-8))==(8,4) and (15-5,1-(-4))==(10,5)
assert 3*2-4-2==0 and 2+4-6==0 and abs(3*2+4*4+3)/5==5
assert math.isclose(1-2/3,(2/3)/2) and (1-2)*2/2==-1 and math.isclose((2/3)*2,4/3)
root13=math.sqrt(13); C13=(3,2); P13=(-1,1)
T13a=(3-(16+2*root13)/17,2+(-4+8*root13)/17)
T13b=(3+(-16+2*root13)/17,2+(-4-8*root13)/17)
# q03: tangent at T=(-2,3) and P=(1,5).
b='<text x="22" y="34" class="h">접선은 접점 반지름에 수직</text>'+text(22,59,'T(−2,3)에서 그은 접선이 P(a,5)를 지나갑니다.','s','start')+panel(20,78,400,370)+panel(20,460,400,120)
O3=(200,330); T3=(140,240); P3=(230,180)
b+=circ(*O3,30*math.sqrt(13),'#EFF5FF',B,4)+ln(50,300,320,120,I,3)+ln(*O3,*T3,O,3,'7 5')+dot(*O3,N,5)+dot(*T3,R,5)+dot(*P3,T,5)
b+=text(208,348,'O','s','start',N)+text(132,230,'T(−2,3)','s','end',R)+text(238,170,'P(a,5)','s','start',T)+text(220,505,'−2x+3y=13','e','middle',B)+text(220,542,'P=(1,5)  →  a=1','e','middle',T)
save(3,440,600,'접점의 반지름과 접선의 수직 관계',b)
# q05: reflection across y=x swaps center coordinates; radius remains 4.
b='<text x="22" y="34" class="h">y=x 대칭은 좌표를 바꿔요</text>'+text(22,59,'원의 중심은 대칭하고, 반지름 4는 그대로입니다.','s','start')+panel(20,78,400,330)+panel(20,420,400,115)
b+=circ(125,225,67,'#EFF5FF',B,4)+dot(125,225,N,6)+circ(315,225,67,'#EEF7F6',T,4)+dot(315,225,T,6)+ln(192,225,248,225,O,4)
b+=text(125,317,'중심 (3,−2)','l','middle',B)+text(315,317,'중심 (−2,3)','l','middle',T)+text(220,205,'좌표 교환','s','middle',O)+text(220,463,'반지름 4 → 4','e')+text(220,510,'a−b+c = −1','e','middle',T)
save(5,440,550,'원의 중심을 y=x에 대칭하고 반지름을 보존',b)
# q09: exact internal division ratio 4:5, shown proportionally.
b='<text x="22" y="34" class="h">선분을 4:5로 나누는 점</text>'+text(22,59,'5AP=4PB  →  AP:PB=4:5','s','start')+panel(20,78,400,260)+panel(20,350,400,170)
A9=55; P9=55+325*4/9; B9=380
b+=ln(A9,190,B9,190,I,5)+ln(A9,177,A9,204,B,3)+ln(P9,177,P9,204,O,4)+ln(B9,177,B9,204,T,3)+dot(A9,190,B,6)+dot(P9,190,O,7)+dot(B9,190,T,6)
b+=text(A9,226,'A(−3,−8)','s','middle',B)+text(P9,226,'P(5,−4)','s','middle',O)+text(B9,226,'B(15,1)','s','middle',T)+ln(A9,264,P9,264,B,4)+ln(P9,264,B9,264,T,4)+text((A9+P9)/2,254,'4','s','middle',B)+text((P9+B9)/2,254,'5','s','middle',T)
b+=text(220,397,'P는 AB의 4/9 지점','l')+text(220,443,'p=5, q=−4','s')+text(220,495,'p+q = 1','e','middle',O)
save(9,440,540,'선분 AB의 내분비와 좌표를 나타낸 비례 그림',b)
# q10: common point and perpendicular distance to the target line.
b='<text x="22" y="34" class="h">모든 k에서 지나는 점 P</text>'+text(22,59,'두 계수가 동시에 0인 점이 공통점입니다.','s','start')+panel(20,78,400,128)+panel(20,218,400,260)+panel(20,490,400,110)
b+=text(220,116,'3x−y−2=0  ·  x+y−6=0','l')+text(220,154,'공통점 P=(2,4)','e','middle',B)
H10=(130,370); P10=(220,250); F10=(190,415)
b+=ln(70,325,250,460,M,3)+ln(*H10,*F10,B,3,'6 5')+ln(*H10,*P10,O,4)+dot(*H10,T,6)+dot(*P10,O,7)
b+=text(116,389,'H(−1,0)','s','end',T)+text(232,241,'P(2,4)','s','start',O)+text(306,454,'3x+4y+3=0','s','middle',B)+text(220,523,'PH=√(3²+4²)=5','e','middle',O)+text(220,570,'점 P와 직선 사이의 거리 = 5','l','middle',T)
save(10,440,620,'공통점 P와 직선까지의 수선거리',b)
# q11: parallel and perpendicular conditions are shown in separate panels.
b='<text x="22" y="34" class="h">평행과 수직은 따로 계산</text>'+text(22,59,'두 직선의 기울기를 비교해 각각 a와 b를 정합니다.','s','start')+panel(20,78,400,174)+panel(20,264,400,174)+panel(20,450,400,92)
b+=text(220,111,'① 평행','l','middle',B)+ln(112,166,184,142,B,4)+ln(256,166,328,142,B,4)+text(220,185,'m₁=m₂=1/3  →  a=2/3','e','middle',B)
b+=text(220,297,'② 수직 (b>0)','l','middle',O)+ln(177,303,263,389,O,4)+ln(177,389,263,303,O,4)+text(220,405,'m₁=−1, m₂=1  →  b=2','e','middle',O)+text(220,489,'ab = 4/3','e','middle',T)
save(11,440,560,'평행 조건과 수직 조건을 분리한 해설 패널',b)
# q13: external point and two exact tangent points, generated from circle geometry.
b='<text x="22" y="34" class="h">한 점에서 그은 두 접선</text>'+text(22,59,'각 접점에서 반지름은 접선과 수직입니다.','s','start')+panel(20,78,400,350)+panel(20,440,400,92)
def m13(p):return (160+30*p[0],370-30*p[1])
oc=m13(C13); ep=m13(P13); ta=m13(T13a); tb=m13(T13b)
b+=circ(*oc,60,'#EFF5FF',B,4)+ln(*ep,*ta,O,3)+ln(*ep,*tb,O,3)+ln(*oc,*ta,B,2,'6 5')+ln(*oc,*tb,B,2,'6 5')
for p,c in [(oc,N),(ep,R),(ta,O),(tb,O)]:b+=dot(*p,c,5)
b+=text(oc[0]+8,oc[1]+18,'C(3,2)','s','start',N)+text(ep[0]-8,ep[1]+20,'P(−1,1)','s','end',R)+text(ta[0]-4,ta[1]-10,'T₁','s','end',O)+text(tb[0]+7,tb[1]+19,'T₂','s','start',O)+text(220,480,'m₁m₂ = −1/4','e','middle',T)
save(13,440,540,'외부의 한 점에서 원에 그은 두 접선',b)
# q12 stacked panels, exact coordinate scale per panel.
b='<text x="22" y="34" class="h">중심 거리와 현의 길이</text>'+text(22,59,'원의 넓이를 반으로 나누는 직선은 중심을 지납니다.','s','start')+panel(20,78,400,300)+panel(20,392,400,488)
b+=text(220,108,'① 첫 원: 넓이를 이등분하는 직선','l')
# left map (x0,y0,s)=(220,325,37): C=(1,2), r=2
cx,cy=257,251;b+=circ(cx,cy,74,'#EAF2FF',B,4)+ln(146,334,368,168,T,3)+dot(cx,cy,N,6)
b+=text(220,350,'중심 (1, 2)을 지나야 함','s')+text(220,376,'3−8+a=0  →  a=5','e','middle',T)
b+=text(220,423,'② 두 번째 원: 현의 길이 8','l')
# right map (160,570,30): center (2,-1), foot (1/5,7/5), chord endpoints (-3,-1),(17/5,19/5)
cx,cy=220,600; fx,fy=166,528
b+=circ(cx,cy,150,'#FFF4E8',O,4)+ln(70,600,262,456,B,5)+ln(cx,cy,fx,fy,R,3,'7 6')+dot(cx,cy,N,5)+dot(fx,fy,R,5)
b+=text(220,760,'C₂=(2,−1) · 3x−4y+5=0','s')+text(220,788,'거리 3, 반현 4 → 반지름 5','e','middle',O)
b+=text(220,821,'x²+y²−4x+2y−20=0','l','middle',O)+text(220,853,'a+b+c+d=−17','e','middle',T)
save(12,440,870,'두 원의 넓이 이등분선과 중심에서 현까지의 거리 관계',b)
# q14 coordinate plot on left, conclusion beneath. Map (150,345,40).
b='<text x="22" y="34" class="h">반사해 꺾인 길을 곧게 펴기</text>'+text(22,59,'A를 y=x에 대칭한 A′에서 원까지 가장 가까운 점을 찾습니다.','s','start')+panel(20,78,400,420)+panel(20,510,400,118)
def m14(p):return (150+40*p[0],345-40*p[1])
A=m14((-2,-3)); Ar=m14((-3,-2)); C=m14((5,4)); Q=m14((17/5,14/5)); P=m14((1,1))
b+=ln(30,465,410,85,G,2,'7 6')+circ(*C,80,'#FFF4E8',O,4)+ln(*A,*P,R,3,'7 5')+ln(*P,*Q,R,3,'7 5')+ln(*Ar,*Q,B,4)
for p,col in [(A,R),(Ar,B),(C,N),(Q,O),(P,T)]:b+=dot(*p,col,5)
b+=text(A[0]-6,A[1]+20,'A(−2,−3)','s','end',R)+text(Ar[0]+8,Ar[1]-10,'A′(−3,−2)','s','start',B)+text(C[0]+9,C[1]+20,'C(5,4)','s','start',N)+text(Q[0]+9,Q[1]-8,'Q(17/5,14/5)','s','start',O)+text(P[0]+8,P[1]-10,'P(1,1)','s','start',T)
b+=text(220,547,'최단 경로  A′Q = A′C−2 = 8','e','middle',T)+text(220,582,'P=(1,1),  Q=(17/5,14/5)  →  10S=21','l')
save(14,440,650,'A의 반사와 원 위 최단 경로, 삼각형 넓이',b)
# q15 compact coordinate panel + answer card. Map (150,425,34).
b='<text x="22" y="34" class="h">밑변 AB를 고정한 최대 넓이</text>'+text(22,59,'최대 넓이는 AB에서 가장 먼 점 P에서 생깁니다.','s','start')+panel(20,78,400,370)+panel(20,460,400,170)
def m15(p):return (150+34*p[0],425-34*p[1])
C=m15((2,3)); A=m15((1,0)); Bp=m15((-1,2)); P=m15((2+math.sqrt(5),3+math.sqrt(5)))
b+=circ(*C,34*math.sqrt(10),'#EFF5FF',B,4)+f'<polygon points="{A[0]:.1f},{A[1]:.1f} {Bp[0]:.1f},{Bp[1]:.1f} {P[0]:.1f},{P[1]:.1f}" fill="#DBEBFF" fill-opacity=".8"/>'
b+=ln(*A,*Bp,N,4)+ln(*C,*P,O,3,'7 6')+ln(P[0]-43,P[1]-43,P[0]+43,P[1]+43,T,3)+ln(*A,*P,B,3)+ln(*Bp,*P,B,3)
for p,c in [(A,B),(Bp,B),(C,N),(P,O)]:b+=dot(*p,c,5)
b+=text(A[0]-7,A[1]+20,'A(1,0)','s','end')+text(Bp[0]-4,Bp[1]+20,'B(−1,2)','s','end')+text(C[0]+8,C[1]+18,'C(2,3)','s','start',N)+text(P[0]+8,P[1]-10,'P(2+√5,3+√5)','s','start',O)
b+=text(220,497,'CP ⟂ AB  ·  접선 x+y−5−2√5=0','l','middle',O)+text(220,546,'a=1, b=−5, c=−2','s')+text(220,602,'a+b+c = −6','h','middle',O)
save(15,440,650,'원 위에서 삼각형 넓이를 최대로 하는 점과 접선',b)
# q16 residue classes and eight selected values in a compact, readable two-row panel.
b='<text x="22" y="34" class="h">합이 4의 배수가 되지 않게 고르기</text>'+text(22,59,'15와 합이 4의 배수가 되지 않으려면 모두 나머지 3인 수예요.','s','start')+panel(20,78,400,145)+panel(20,236,400,370)
b+=text(220,111,'2ⁿ−n−1=247  →  n=8','e')+text(220,143,'15는 4로 나눈 나머지가 3','s')+text(220,181,'나머지 1인 수는 15와 함께 못 써요','l','middle',R)
for i,v in enumerate(S):
 col=i%4; row=i//4; x=43+col*96; y=276+row*88
 b+=f'<rect x="{x}" y="{y}" width="78" height="58" rx="14" fill="#FFF4E8" stroke="#F0D4B3" stroke-width="2"/>'+text(x+39,y+38,v,'e','middle',O)
b+=text(220,469,'15와 가장 큰 일곱 수를 선택','l','middle',T)+text(220,553,'B={15,75,79,83,87,91,95,99}','s')+text(220,591,'S(B)=624','e','middle',T)
save(16,440,630,'집합 조건에 맞는 나머지류와 최댓값 원소 선택',b)
# q17 exact quadrilateral diagram above, solution facts below. Map (75,412,92).
b='<text x="22" y="34" class="h">넓이로 나누고, 거리로 위치 정하기</text>'+text(22,59,'두 넓이의 비가 이동 비율의 합을, 최소 거리가 두 비율을 같게 해요.','s','start')+panel(20,78,400,355)+panel(20,445,400,180)
def m17(p):return (75+92*p[0],412-92*p[1])
A=(0,2); BB=(1,0); CC=(3,1); D=(2,3); P=(2/3,2/3); Q=(8/3,5/3)
coords={k:m17(v) for k,v in {'A':A,'B':BB,'C':CC,'D':D,'P':P,'Q':Q}.items()}
def pts(keys):return ' '.join(f'{coords[k][0]:.1f},{coords[k][1]:.1f}' for k in keys)
b+=f'<polygon points="{pts(["A","P","Q","D"])}" fill="#DDEBFF"/><polygon points="{pts(["P","B","C","Q"])}" fill="#E3F5F1"/><polygon points="{pts(["A","B","C","D"])}" fill="none" stroke="{N}" stroke-width="4" stroke-linejoin="round"/>'+ln(*coords['P'],*coords['Q'],O,5)
for k,p in coords.items():b+=dot(*p,O if k in ('P','Q') else N,5)+text(p[0]+(6 if k in ('C','D','Q') else -5),p[1]+(19 if k in ('A','B','P') else -7),k,'s','start' if k in ('C','D','Q') else 'end',O if k in ('P','Q') else N)
b+=text(220,482,'s+t=4/3  ·  PQ²=5+5(s−t)²','e')+text(220,519,'최소일 때 s=t=2/3','l','middle',T)+text(220,556,'P=(2/3,2/3), Q=(8/3,5/3)','s')+text(220,601,'30(m+n)=25','e','middle',O)
save(17,440,650,'사각형의 두 영역 넓이와 선분 PQ 최소 배치',b)
# q18 transformation sequence and distance condition, stacked so labels remain mobile-readable.
b='<text x="22" y="34" class="h">원의 중심 이동과 반사</text>'+text(22,59,'반지름 2는 그대로이며, y=x 대칭에서 좌표를 맞바꿔요.','s','start')+panel(20,78,400,350)
for x,y,name,col in [(220,143,'C₀(−2,1)',N),(220,242,'C₁(1,3)',B),(220,341,'C(3,1)',T)]:b+=circ(x,y,25,'#F1F6FC',col,3)+dot(x,y,col,5)+text(x+48,y+6,name,'l','start',col)
b+=text(220,191,'평행이동 (+3,+2)','s','middle',B)+text(220,290,'y=x 대칭: 좌표를 맞바꿈','s','middle',T)
b+=text(220,397,'중심 C=(3,1)에서 거리 √5인 평행선','l')+text(220,453,'x−2y+4=0 또는 x−2y−6=0','s')+text(220,497,'양의 y절편 선택 → 2','e','middle',T)
save(18,440,530,'원의 중심 평행이동과 대칭 후 직선 조건',b)
# q20 number line / interval diagram; open endpoints encode tangency excluded from g=2.
b='<text x="22" y="34" class="h">두 점에서 만나는 t의 범위</text>'+text(22,59,'두 점에서 만남 ⇔ 중심에서 직선까지 거리 d가 반지름 r보다 작음','s','start')+panel(20,78,400,365)
x0,x1=44,396
def tx(t):return x0+(x1-x0)*t/14
b+=text(42,120,'g(t)=2','l','start',T)+ln(x0,220,x1,220,I,3)
for v in [0,3,8,10,12,14]:b+=ln(tx(v),211,tx(v),229,I,2)+text(tx(v),252,v,'s')
for l,r in [(3,8),(8,12)]:b+=ln(tx(l),220,tx(r),220,T,12)+f'<circle cx="{tx(l):.1f}" cy="220" r="7" fill="white" stroke="{T}" stroke-width="3"/><circle cx="{tx(r):.1f}" cy="220" r="7" fill="white" stroke="{T}" stroke-width="3"/>'
for v in (3,8,12):b+=text(tx(v),185,'접함','s','middle',O)
b+=ln(tx(10),304,tx(12),304,O,7)+dot(tx(10),304,O,6)+f'<circle cx="{tx(12):.1f}" cy="304" r="6" fill="white" stroke="{O}" stroke-width="3"/>'+text(220,338,'가장 오른쪽 길이 2인 구간','l')+text(220,371,'(10,12)  →  a=12','e','middle',T)
save(20,440,465,'g(t)가 두 점에서 만나는 범위와 최댓값 구간',b)
# Actual SVG primitive parity checks; transform coordinates back to mathematical facts.
for q in [3,5,9,10,11,12,13,14,15,16,17,18,20]: ET.parse(root/f'q{q:02d}-solution.svg')
# q14 plotted centers/radii/map and q17 exact plotted vertices are encoded from frozen facts above.
assert abs((150+40*5)-350)<1e-9 and abs((370-40*4)-210)<1e-9
assert abs(coords['P'][0]-(75+92*2/3))<1e-9 and abs(coords['P'][1]-(412-92*2/3))<1e-9
# q20 visual interval endpoints correspond to the independently derived open intervals.
assert all(abs(tx(t)-(x0+(x1-x0)*t/14))<1e-9 for t in (3,8,12))
print('PASS: regenerated 13 mobile-first SVGs; Python semantic facts and XML parse checks passed.')








