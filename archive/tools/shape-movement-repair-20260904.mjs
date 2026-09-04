import fs from 'node:fs';
import path from 'node:path';
import { coefficientsFromSlopeIntercept } from './line-equation-serializer.mjs';

const root = process.cwd();
const examsRoot = path.join(root, 'archive', 'exams', 'original', 'high', 'h1');
const assetsRoot = path.join(root, 'archive', 'assets', 'images');
const reportRoot = path.join(root, 'reports', 'shape-movement-visuals-20260904');
fs.mkdirSync(reportRoot, { recursive: true });

const V = (x,y,label,color,dx,dy) => ({x,y,label,color:color || '#dc2626',dx,dy});
const L = (a,b,c,label,color,dash) => ({a,b,c,label,color:color || '#2563eb',dash:dash || ''});
const C = (cx,cy,r,label,color,fill,dash) => ({cx,cy,r,label,color:color || '#2563eb',fill:fill || '#dbeafe',dash:dash || ''});
const A = (x1,y1,x2,y2,label,color) => ({x1,y1,x2,y2,label,color:color || '#64748b'});
const S = (x1,y1,x2,y2,label,color,dash,dx,dy) => ({x1,y1,x2,y2,label,color:color || '#7c3aed',dash:dash || '',dx,dy});
const R = (x1,y1,x2,y2,equation,domain,role,label,color,dash) => ({x1,y1,x2,y2,equation,domain,role,label,color:color || '#16a34a',dash:dash || ''});
const G = (points,label,color,fill) => ({points,label,color:color || '#2563eb',fill:fill || '#dbeafe'});
const lineFromSlopeIntercept = (slope, intercept, label, color, dash) => {
  const { a, b, c } = coefficientsFromSlopeIntercept(slope, intercept);
  return L(a, b, c, label, color, dash);
};
const specs = new Map();
function add(folder,id,bounds,notes,extra) { specs.set(folder + '#' + id, Object.assign({folder,id,bounds,notes},extra || {})); }

add('22_금당고_1학기_기말_고1_기출',1,[-7,4,-7,4],['P=(2,−5) → P′=(−5,2)','대칭축 y=x','PP′는 대칭축에 수직'],{points:[V(2,-5,'P'),V(-5,2,'P′')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(2,-5,-5,2,'PP′')]});
add('22_금당고_1학기_기말_고1_기출',7,[-4,4,-4,4],['원래 중심 O=(1,−2)','원점대칭 후 O′=(−1,2)','반지름 r=1 보존'],{points:[V(1,-2,'O'),V(-1,2,'O′','#16a34a')],circles:[C(1,-2,1,'C'),C(-1,2,1,'C′','#16a34a','#dcfce7')],segments:[S(1,-2,-1,2,'원점대칭')]});
add('22_매산고_1학기_기말_고1_기출',2,[-6,5,-4,8],['원래 직선 x−y−3=0','이동벡터 (−2,3)','기준 직선 x−2y+4=0','이동 후 직선 x−y+2=0'],{points:[V(3,0,'원래 점'),V(1,3,'이동 후','#16a34a'),V(0,2,'교점','#dc2626')],lines:[L(1,-1,-3,'원래 l'),L(1,-1,2,'이동 l′','#16a34a'),L(1,-2,4,'기준 직선','#7c3aed')],arrows:[A(3,0,1,3,'(−2,3)')]});
add('22_복성고_1학기_기말_고1_기출',1,[-4,4,-4,7],['P=(−1,5)','이동벡터 (2,−1)','P′=(1,4)'],{points:[V(-1,5,'P'),V(1,4,'P′','#16a34a')],arrows:[A(-1,5,1,4,'(2,−1)')]});
add('22_복성고_1학기_기말_고1_기출',9,[-5,5,-5,5],['원래 중심 (−2,−1), r=√3','평행이동 (4,2) → (2,1)','원점대칭 → (−2,−1), 원래 원과 일치'],{points:[V(-2,-1,'O'),V(2,1,'O₁','#7c3aed'),V(-2,-1,'O₂','#16a34a')],circles:[C(-2,-1,Math.sqrt(3),'원래/최종'),C(2,1,Math.sqrt(3),'중간','#7c3aed','#ede9fe','6 4')],lines:[L(1,0,0,'y축','#dc2626','7 5')],arrows:[A(-2,-1,2,1,'(4,2)'),A(2,1,-2,-1,'원점대칭','#16a34a')]});
add('23_강남여고_1학기_기말_고1_기출',7,[-3,7,-4,7],['원래 직선 5x−2y+3=0','이동벡터 (2,−2)','이동 후 5x−2y−11=0','P=(3,2)'],{points:[V(0,1.5,'원래'),V(2,-.5,'이동 후','#16a34a'),V(3,2,'P')],lines:[L(5,-2,3,'원래 l'),L(5,-2,-11,'이동 l′','#16a34a')],arrows:[A(0,1.5,2,-.5,'(2,−2)')]});
add('23_순천여고_1학기_기말_고1_기출',3,[-5,5,-4,4],['원래 점 (3,−2)','x축 대칭 P=(3,2)','y축 대칭 Q=(−3,−2)','원점 대칭 R=(−3,2), 넓이 12'],{points:[V(3,-2,'원래'),V(3,2,'P','#2563eb'),V(-3,-2,'Q','#16a34a'),V(-3,2,'R')],lines:[L(0,1,0,'x축','#64748b','7 5'),L(1,0,0,'y축','#64748b','7 5')],polygons:[G([[3,2],[-3,-2],[-3,2]],'△PQR','#7c3aed','#ede9fe')]});
add('24_제일고_1학기_기말_고1_기출',11,[-1,9,-5,5],['이동 전 점 (7,−3)','이동벡터 (−3,2)','이동 후 점 (4,−1)'],{points:[V(7,-3,'원래'),V(4,-1,'도착','#16a34a')],arrows:[A(7,-3,4,-1,'(−3,2)')]});
add('21_복성고_2학기_중간_고1_기출',4,[-5,5,-3,3],['원래 점 (−3,−1)','원점 대칭 (3,1)','두 좌표의 부호가 모두 반전'],{points:[V(-3,-1,'P'),V(3,1,'P′','#16a34a')],lines:[L(1,0,0,'y축','#dc2626','7 5'),L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(-3,-1,3,1,'원점대칭')]});
add('21_복성고_2학기_중간_고1_기출',10,[-3,7,-2,9],['이동 후 식 k(x−2)+3x−2y+2=0','k와 관계없이 공통점','공통점 (2,4)'],{points:[V(2,4,'공통점')],lines:[L(3,-2,2,'k=0'),L(4,-2,0,'k=1','#16a34a'),L(2,-2,4,'k=−1','#7c3aed')]});
add('22_제일고_2학기_중간_고1_기출',1,[-7,3,-5,7],['원래 직선 3x+y−4=0','점대칭 중심 S=(−2,4)','대칭 후 직선 3x+y+8=0'],{points:[V(-2,4,'S')],lines:[L(3,1,-4,'원래 l'),L(3,1,8,'대칭 후 l′','#16a34a')]});
add('22_효천고_2학기_중간_고1_기출',1,[-2,5,-2,7],['원래 점 (2,1)','이동벡터 (−1,3)','도착점 (1,4)'],{points:[V(2,1,'P'),V(1,4,'P′','#16a34a')],arrows:[A(2,1,1,4,'(−1,3)')]});
add('23_금당고_2학기_중간_고1_기출',1,[-5,5,-5,5],['(3,4) → x축 대칭 (3,−4)','x좌표 보존, y좌표 부호 반전'],{points:[V(3,4,'P'),V(3,-4,'P′','#16a34a')],lines:[L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(3,4,3,-4,'x축 대칭')]});
add('23_금당고_2학기_중간_고1_기출',2,[-4,5,-4,11],['원래 y=−2x+2','이동벡터 (3,1)','이동 후 y=−2x+9'],{points:[V(0,2,'원래'),V(3,3,'이동 후','#16a34a')],lines:[L(2,1,-2,'원래'),L(2,1,-9,'이동 후','#16a34a')],arrows:[A(0,2,3,3,'(3,1)')]});
add('23_금당고_2학기_중간_고1_기출',7,[-4,5,-2,11],['원래 꼭짓점 (−1,3)','이동벡터 (2,−2)','이동 후 꼭짓점 (1,1)∈y=x'],{points:[V(-1,3,'V'),V(1,1,'V′','#16a34a')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],curves:[{formula:'parabola-original',start:-3,end:1,label:'원래',color:'#2563eb'},{formula:'parabola-moved',start:-1,end:3,label:'이동 후',color:'#16a34a'}],arrows:[A(-1,3,1,1,'(2,−2)')]});
add('23_매산여고_2학기_중간_고1_기출',11,[-5,5,-4,7],['P=(−3,4)','이동벡터 (5,−3)','P′=(2,1)'],{points:[V(-3,4,'P'),V(2,1,'P′','#16a34a')],arrows:[A(-3,4,2,1,'(5,−3)')]});
add('23_팔마고_2학기_중간_고1_기출',3,[-2,5,-3,9],['P=(3,5)','이동벡터 (−1,2)','P′=(2,7)'],{points:[V(3,5,'P'),V(2,7,'P′','#16a34a')],arrows:[A(3,5,2,7,'(−1,2)')]});
add('24_금당고_2학기_중간_고1_기출',1,[-2,5,-2,7],['P=(1,2)','이동벡터 (2,3)','P′=(3,5)'],{points:[V(1,2,'P'),V(3,5,'P′','#16a34a')],arrows:[A(1,2,3,5,'(2,3)')]});
add('24_금당고_2학기_중간_고1_기출',9,[-3,5,-6,5],['원래 y=2x−1','이동벡터 (1,−2)','이동 후 y=2x−5, P=(3,1)'],{points:[V(0,-1,'원래'),V(1,-3,'이동 점','#16a34a'),V(3,1,'P')],lines:[lineFromSlopeIntercept(2,-1,'원래'),lineFromSlopeIntercept(2,-5,'이동 후','#16a34a')],arrows:[A(0,-1,1,-3,'(1,−2)')]});
add('25_금당고_2학기_중간_고1_기출',6,[-4,8,-5,8],['현재 production content 기준 P=(5,1)','평행이동 (a,−3), a=2','중간점 (7,−2)','y=x 대칭 후 (−2,7)=(b,7)'],{points:[V(5,1,'P'),V(7,-2,'중간','#7c3aed'),V(-2,7,'P′','#16a34a')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],arrows:[A(5,1,7,-2,'(2,−3)'),A(7,-2,-2,7,'y=x 대칭','#16a34a')]});
add('25_효천고_2학기_중간_고1_기출',19,[-5,5,-4,5],['대표 배치 A=(3,2), |x|=3, |y|=2','x축 대칭 B=(3,−2)','y축 대칭 C=(−3,2)','원점 대칭 D=(−3,−2)','AB=4, AC=6, AD=2√13'],{points:[V(3,2,'A'),V(3,-2,'B','#16a34a'),V(-3,2,'C','#7c3aed'),V(-3,-2,'D')],lines:[L(0,1,0,'x축','#dc2626','7 5'),L(1,0,0,'y축','#dc2626','7 5')],arrows:[A(3,2,3,-2,'x축 대칭'),A(3,2,-3,2,'y축 대칭','#7c3aed'),A(3,2,-3,-2,'원점대칭','#dc2626')]});
add('25_매산고_2학기_중간_고1_기출',4,[-4,5,-5,5],['평행이동벡터 (2,−3)','직선 3x+2y+8=0의 이동','ax−by+8=0과 계수 비교'],{points:[V(0,0,'원점'),V(2,-3,'도착','#16a34a')],lines:[L(3,2,8,'원래 직선')],arrows:[A(0,0,2,-3,'(2,−3)')]});
add('25_순천고_2학기_중간_고1_기출',8,[-3,5,-6,5],['원래 y=−2x+4','이동벡터 (1,−2)','이동 후 y=−2x+4','기준 직선 x−2y−2=0과 (2,0)에서 수직'],{points:[V(0,4,'원래'),V(1,2,'이동 점','#16a34a'),V(2,0,'교점')],lines:[L(2,1,-4,'원래 l'),L(2,1,-4,'이동 l′','#16a34a','6 4'),L(1,-2,-2,'기준 직선','#7c3aed')],arrows:[A(0,4,1,2,'(1,−2)')]});
add('25_순천여고_2학기_중간_고1_공통수학2',18,[-5,5,-5,5],['P=(−2,1)','대칭축 3x−y+2=0','대칭점 Q=(1,0)','PQ는 대칭축에 수직'],{points:[V(-2,1,'P'),V(1,0,'Q','#16a34a'),V(-.5,.5,'중점','#7c3aed')],lines:[L(3,-1,2,'대칭축','#dc2626')],segments:[S(-2,1,1,0,'PQ')]});
add('25_순천여고_2학기_중간_고1_공통수학2',6,[-1,9,-2,8],['A=(5,3)→A′=(3,5) by y=x','B=(8,2)','P∈y=x에서 A′P+PB 최소','A′B=√34'],{points:[V(5,3,'A'),V(3,5,'A′','#16a34a'),V(8,2,'B'),V(4,4,'P')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(3,5,8,2,'A′B')]});
add('25_제일고_2학기_기말_고1_기출',2,[-6,7,-2,9],['(4,1)→(−1,3)의 이동벡터 (−5,2)','(2,5)→(−3,7) 같은 이동','모든 점에 같은 변화량'],{points:[V(4,1,'기준'),V(-1,3,'도착','#16a34a'),V(2,5,'P'),V(-3,7,'P′','#7c3aed')],arrows:[A(4,1,-1,3,'(−5,2)'),A(2,5,-3,7,'(−5,2)','#7c3aed')]});

// Existing 720px generic assets are rebuilt as well.  These facts cover the
// target rows whose old asset already existed but omitted the actual relation.
add('22_금당고_1학기_기말_고1_기출',14,[-5,5,-6,4],['원래 중심 O=(−2,0), r=2','이동벡터 (2,−2)','이동 후 중심 O′=(0,−2), r=2','P=(2,0)에서 접선 수직'],{points:[V(-2,0,'O'),V(0,-2,'O′','#16a34a'),V(2,0,'P')],circles:[C(-2,0,2,'원래'),C(0,-2,2,'C','#16a34a','#dcfce7')],arrows:[A(-2,0,0,-2,'(2,−2)')]});
add('22_금당고_1학기_기말_고1_기출',16,[-5,6,-7,7],['C₁ 중심 (−2,3), r=1','평행이동 (4,2) → (2,5)','x축 대칭 → C₂ 중심 (2,−5)','두 원 최단거리 4√5−2'],{points:[V(-2,3,'C₁'),V(2,5,'중간','#7c3aed'),V(2,-5,'C₂','#16a34a')],circles:[C(-2,3,1,'C₁'),C(2,5,1,'중간','#7c3aed','#ede9fe','6 4'),C(2,-5,1,'C₂','#16a34a','#dcfce7')],lines:[L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(-2,3,2,5,'(4,2)'),A(2,5,2,-5,'x축 대칭','#7c3aed')]});
add('22_매산고_1학기_기말_고1_기출',13,[-1,8,-1,8],['원 중심 O=(4,4), r=3','대칭축 y=x','P↔Q 대응','최대 |PP′−QQ′|=3√2'],{points:[V(4+3/Math.sqrt(2),4-3/Math.sqrt(2),'P'),V(4-3/Math.sqrt(2),4+3/Math.sqrt(2),'Q','#16a34a'),V(4,4,'O','#7c3aed')],circles:[C(4,4,3,'C')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(4+3/Math.sqrt(2),4-3/Math.sqrt(2),4-3/Math.sqrt(2),4+3/Math.sqrt(2),'PQ')]});
add('23_복성고_1학기_기말_고1_기출',14,[-8,10,-6,10],['l:y=−8x/7+5','이동 후 y=−8x/7+40/7','y=x 대칭 후 l′:y=−7x/8+5','(0,5)→(−2,8)→(8,−2)'],{points:[V(0,5,'l'),V(-2,8,'중간','#7c3aed'),V(8,-2,'l′','#16a34a')],lines:[L(8,7,-35,'l'),L(8,7,-40,'이동 후','#7c3aed','6 4'),L(7,8,-40,'l′','#16a34a'),L(1,-1,0,'y=x','#dc2626','7 5')],arrows:[A(0,5,-2,8,'(−2,3)'),A(-2,8,8,-2,'y=x 대칭','#16a34a')]});
add('23_복성고_1학기_기말_고1_기출',15,[-1,5,-2,4],['a=2, 직사각형 4×2','대각선 접는 선','겹친 삼각형 높이 2, 밑변 d=5/2','겹친 넓이 5/2'],{points:[V(0,0,'O'),V(4,0,'직각 발'),V(4,2,'V'),V(2.5,0,'W','#7c3aed')],polygons:[G([[0,0],[2.5,0],[4,2]],'겹친 영역','#7c3aed','#ede9fe')],lines:[L(-1,2,0,'대각선 접는 선','#dc2626','7 5')],segments:[S(0,0,2.5,0,'d=5/2','#7c3aed'),S(4,2,4,0,'h=2','#16a34a'),S(2.5,0,4,2,'대응 d=5/2','#7c3aed')]});
add('23_복성고_1학기_기말_고1_기출',18,[-4,5,-3,6],['A=(3,0), B=(0,4), P=(2,4/3)','x축 대칭 Q=(2,−4/3)','y축 대칭 R=(−2,4/3)','무게중심 G=(2/3,4/9)'],{points:[V(3,0,'A'),V(0,4,'B'),V(2,4/3,'P','#7c3aed'),V(2,-4/3,'Q','#16a34a'),V(-2,4/3,'R'),V(2/3,4/9,'G','#111827')],lines:[L(4,3,-12,'AB')],polygons:[G([[2,4/3],[2,-4/3],[-2,4/3]],'△RQP','#16a34a','#dcfce7')]});
add('23_순천여고_1학기_기말_고1_기출',19,[-5,4,-2,10],['−2a+b=6','최소점 (−12/5,6/5)','원점에서 조건 직선까지 수선','이동 후 y=2x+6'],{points:[V(-12/5,6/5,'최소점'),V(0,0,'O','#111827')],lines:[L(-2,1,-6,'−2a+b=6')],segments:[S(0,0,-12/5,6/5,'수선','#16a34a')],arrows:[A(0,0,-12/5,6/5,'최적 (a,b)','#7c3aed')]});
add('24_매산고_1학기_기말_고1_기출',10,[-1,5,-9,9],['원래 y=−x²+3x−4','x축 대칭 y=x²−3x+4','대칭축 y=x','a=3에서 T=(2,2) 접함'],{points:[V(2,2,'T')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],curves:[{formula:'parabola-24-original',start:-1,end:4,label:'원래',color:'#2563eb'},{formula:'parabola-24-reflected',start:-1,end:4,label:'대칭 후',color:'#16a34a'}]});
add('24_매산고_1학기_기말_고1_기출',16,[-5,5,-5,8],['원래 2x−y+3=0','이동벡터 (−1,2)','이동 후 2x−y+7=0'],{points:[V(0,3,'원래'),V(-1,5,'이동 후','#16a34a')],lines:[L(2,-1,3,'원래'),L(2,-1,7,'이동 후','#16a34a')],arrows:[A(0,3,-1,5,'(−1,2)')]});
const maesanCircleX = 2 + 2*Math.sqrt(2);
add('24_매산고_1학기_기말_고1_기출',18,[-2,9,-4,9],['C 중심 (2+2√2,2), r=2','x축 대칭 C₁ 중심 (2+2√2,−2)','y=x 대칭 C₂ 중심 (2,2+2√2)','각각 한 점에서 만남'],{points:[V(maesanCircleX,2,'O'),V(maesanCircleX,-2,'O₁','#16a34a'),V(2,maesanCircleX,'O₂','#7c3aed')],circles:[C(maesanCircleX,2,2,'C'),C(maesanCircleX,-2,2,'C₁','#16a34a','#dcfce7'),C(2,maesanCircleX,2,'C₂','#7c3aed','#ede9fe')],lines:[L(0,1,0,'x축','#dc2626','7 5'),L(1,-1,0,'y=x','#dc2626','7 5')]});
add('24_매산고_1학기_기말_고1_기출',19,[-3,6,-3,7],['원래 중심 (1,−1), r=√5','이동벡터 (1,3)','이동 후 중심 (2,2), r=√5','(1,0),(0,1)을 통과'],{points:[V(1,-1,'O'),V(2,2,'O′','#16a34a'),V(1,0,'A'),V(0,1,'B','#7c3aed')],circles:[C(1,-1,Math.sqrt(5),'원래'),C(2,2,Math.sqrt(5),'이동 후','#16a34a','#dcfce7')],arrows:[A(1,-1,2,2,'(1,3)')]});
add('24_제일고_1학기_기말_고1_기출',16,[-5,10,-7,8],['C 중심 (3,−1), r=√11','C₁: (5,−2) 평행이동 → (8,−3)','C₂: y=x 대칭 → (−1,3)','두 원의 반지름 √11'],{points:[V(3,-1,'C'),V(8,-3,'C₁','#16a34a'),V(-1,3,'C₂','#7c3aed')],circles:[C(3,-1,Math.sqrt(11),'C'),C(8,-3,Math.sqrt(11),'C₁','#16a34a','#dcfce7'),C(-1,3,Math.sqrt(11),'C₂','#7c3aed','#ede9fe')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],arrows:[A(3,-1,8,-3,'(5,−2)'),A(3,-1,-1,3,'y=x 대칭','#7c3aed')]});
add('24_제일고_1학기_기말_고1_기출',18,[-8,8,-8,8],['A(−6,3)→A′=(6,3)','B(−4,−5)→B′=(4,−5)','B′→B″=(−6,−5) across x=−1','y축·x=−1과 실제 경로'],{points:[V(-6,3,'A'),V(-4,-5,'B'),V(6,3,'A′','#16a34a'),V(4,-5,'B′','#7c3aed'),V(-6,-5,'B″'),V(-1,-5/3,'R','#111827')],lines:[L(1,0,0,'y축','#dc2626','7 5'),L(1,0,1,'x=−1','#dc2626','7 5')],segments:[S(6,3,-1,-5/3,'A′R','#16a34a'),S(-1,-5/3,-6,-5,'RB″','#7c3aed')]});
add('21_복성고_2학기_중간_고1_기출',3,[-7,5,-3,7],['원래 중심 (2,−1), r=3','평행이동 (−5,4)','이동 후 중심 (−3,3)','두 좌표축에 동시 접'],{points:[V(2,-1,'O'),V(-3,3,'O′','#16a34a')],circles:[C(2,-1,3,'원래'),C(-3,3,3,'이동 후','#16a34a','#dcfce7')],lines:[L(1,0,0,'y축','#dc2626','7 5'),L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(2,-1,-3,3,'(−5,4)')]});
add('21_복성고_2학기_중간_고1_기출',11,[-5,7,-5,6],['f 꼭짓점 (−3,0),(−1,0),(−1,2)','g 꼭짓점 (2,−1),(4,−1),(4,−3)','(u,v)→(u+5,−v−1)'],{points:[V(-3,0,'A'),V(-1,0,'B'),V(-1,2,'C'),V(2,-1,'A′','#16a34a'),V(4,-1,'B′','#16a34a'),V(4,-3,'C′','#16a34a')],polygons:[G([[-3,0],[-1,0],[-1,2]],'f'),G([[2,-1],[4,-1],[4,-3]],'g','#16a34a','#dcfce7')],lines:[L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(-3,0,2,-1,'(5,−1)'),A(-1,2,4,-3,'(5,−5)','#16a34a')]});
add('21_복성고_2학기_중간_고1_기출',18,[-2,5,-2,5],['△OAB: O=(0,0), A=(3,3), B=(4,0)','최적점 D=(18/5,6/5), E=(2,2), F=(3,0)','최소 둘레 12√5/5'],{points:[V(0,0,'O'),V(3,3,'A'),V(4,0,'B'),V(18/5,6/5,'D','#7c3aed'),V(2,2,'E','#7c3aed'),V(3,0,'F','#7c3aed')],polygons:[G([[0,0],[3,3],[4,0]],'△OAB'),G([[18/5,6/5],[2,2],[3,0]],'최적 △DEF','#7c3aed','#ede9fe')]});
add('21_복성고_2학기_중간_고1_기출',22,[-6,6,-7,7],['원래 중심 (4,3), r=3','y=x 대칭 중심 (3,4)','y=−x 대칭 중심 (−3,−4)','P₁Q₁ 최댓값 16'],{points:[V(4,3,'O'),V(3,4,'O₁'),V(-3,-4,'O₂','#16a34a')],circles:[C(3,4,3,'P₁ 원'),C(-3,-4,3,'Q₁ 원','#16a34a','#dcfce7')],lines:[L(1,-1,0,'y=x','#dc2626','7 5'),L(1,1,0,'y=−x','#dc2626','7 5')],segments:[S(3,4,-3,-4,'중심거리 10')]});
add('21_순천고_2학기_중간_고1_기출',1,[-4,4,-4,4],['원래 중심 (1,−2), r=2','이동벡터 (−1,2)','도착 중심 (0,0), r=2','(−1,2)는 목적점이 아닌 변화량'],{points:[V(1,-2,'O'),V(0,0,'O′','#16a34a')],circles:[C(1,-2,2,'원래'),C(0,0,2,'도착','#16a34a','#dcfce7')],arrows:[A(1,-2,0,0,'(−1,2)')]});
add('21_효천고_2학기_중간_고1_기출',5,[-8,8,-8,8],['원래 중심 (−6,5), r=√5','y=x 대칭 중심 (5,−6)','대칭축 y=x','2x+y=4가 넓이를 이등분'],{points:[V(-6,5,'O'),V(5,-6,'O′','#16a34a')],circles:[C(5,-6,Math.sqrt(5),'대칭 원','#16a34a','#dcfce7')],lines:[L(1,-1,0,'y=x','#dc2626','7 5'),L(2,1,-4,'2x+y=4','#7c3aed')]});
add('21_효천고_2학기_중간_고1_기출',19,[-3,5,-1,5],['a=0: l:y=2 → 이동 후 y=3 → 대칭 후 l′:x=3, 교점 (3,2)','a≠0 형식 해 a=1','a=1에서 l=l′=y=x+2','고유 교점 없음'],{points:[V(3,2,'a=0 교점')],lines:[L(1,-1,2,'a=1: l=l′'),L(1,-1,-2,'a=1: 이동 후','#7c3aed','6 4'),L(0,1,-2,'a=0: l','#16a34a'),L(0,1,-3,'a=0: 이동 후','#7c3aed','6 4'),L(1,0,-3,'a=0: l′','#dc2626')]});
add('22_강남여고_2학기_중간_고1_기출',9,[-10,10,-10,10],['A=(4,8)→B=(8,4) by y=x','B→C=(−8,−4) by origin','△ABC 넓이 48'],{points:[V(4,8,'A'),V(8,4,'B','#16a34a'),V(-8,-4,'C')],lines:[L(1,-1,0,'y=x','#7c3aed','7 5')],polygons:[G([[4,8],[8,4],[-8,-4]],'△ABC')]});
add('22_강남여고_2학기_중간_고1_기출',23,[-6,4,-2,7],['원점대칭 후 중심 (−2,3), r=2','접선 y=−5x/12','접점 H=(−36/13,15/13)'],{points:[V(-2,3,'C'),V(-36/13,15/13,'H')],circles:[C(-2,3,2,'대칭 원')],lines:[L(5,12,0,'y=−5x/12','#7c3aed')],segments:[S(-2,3,-36/13,15/13,'반지름 ⟂ 접선','#dc2626')]});
add('22_제일고_2학기_중간_고1_기출',3,[-5,3,-6,3],['P=(−3,1), P′=(−3/5,−19/5)','대칭축 x−2y−1=0','PP′⊥대칭축'],{points:[V(-3,1,'P'),V(-3/5,-19/5,'P′','#16a34a'),V(-9/5,-7/5,'중점','#7c3aed')],lines:[L(1,-2,-1,'대칭축','#dc2626')],segments:[S(-3,1,-3/5,-19/5,'PP′')]});
add('22_제일고_2학기_중간_고1_기출',5,[-3,6,-8,7],['A=(4,5), B=(−7,−1)','B′=(−1,−7) by y=x','최단 경로 교점 P=(23/7,23/7)'],{points:[V(4,5,'A'),V(-7,-1,'B','#64748b'),V(-1,-7,'B′','#16a34a'),V(23/7,23/7,'P')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(4,5,-1,-7,'AB′')]});
add('22_제일고_2학기_중간_고1_기출',17,[-3,4,-3,4],['좌표변환 (u,v)=(y,x+1)','결과 중심 원점의 왼쪽 반원','수직 선분 x=0, −1≤y≤1'],{points:[V(0,1,'끝점'),V(0,-1,'끝점','#16a34a')],arcs:[{cx:0,cy:0,r:1,start:Math.PI/2,end:Math.PI*1.5,label:'왼쪽 반원',color:'#16a34a'}],lines:[L(1,0,0,'x=0','#dc2626'),L(1,-1,0,'y=x','#64748c','7 5')],segments:[S(0,-1,0,1,'세로 선분','#16a34a')]});
add('22_효천고_2학기_중간_고1_기출',13,[-5,7,-3,8],['A=(4,3)→A′=(0,5) by y=2x','B=(5,2)→B′=(5,−2) by x-axis','A′B′가 두 축을 순서대로 통과'],{points:[V(4,3,'A'),V(0,5,'A′','#16a34a'),V(5,2,'B'),V(5,-2,'B′','#7c3aed'),V(25/17,50/17,'P'),V(25/7,0,'Q')],lines:[L(2,-1,0,'y=2x','#dc2626','7 5'),L(0,1,0,'x축','#dc2626','7 5'),L(7,5,-25,'A′B′')]});
add('22_효천고_2학기_중간_고1_기출',17,[-4,4,-4,4],['고정점 6개를 지나는 축','추가 교환축 y=x, y=−x','총 8개의 대칭축'],{points:[V(1,0,'A'),V(-1,0,'B'),V(0,1,'C'),V(0,-1,'D')],lines:[L(0,1,0,'x축'),L(1,0,0,'y축'),L(1,-1,0,'y=x','#dc2626','7 5'),L(1,1,0,'y=−x','#dc2626','7 5')],segments:[S(1,0,-1,0,'AB','#64748b','6 4'),S(1,0,0,1,'AC','#64748b','6 4'),S(1,0,0,-1,'AD','#64748b','6 4'),S(-1,0,0,1,'BC','#64748b','6 4'),S(-1,0,0,-1,'BD','#64748b','6 4'),S(0,1,0,-1,'CD','#64748b','6 4')]});
add('23_금당고_2학기_중간_고1_기출',12,[-4,5,-4,10],['대칭 중심 S=(1,2)','원래 l:y=−3x+2','점대칭 후 l′:y=−3x+8'],{points:[V(1,2,'S')],lines:[L(3,1,-2,'l'),L(3,1,-8,'l′','#16a34a')]});
add('23_금당고_2학기_중간_고1_기출',16,[-2,7,-2,18],['f:y=x²−2√2x','g:y=2√2x','교점 x=0,4√2','M=(2√2,8), MH=2√2'],{points:[V(0,0,'A'),V(4*Math.sqrt(2),16,'B','#16a34a'),V(2*Math.sqrt(2),8,'M')],lines:[L(2*Math.sqrt(2),-1,0,'g','#16a34a'),L(1,-1,0,'y=x','#dc2626','7 5')],curves:[{formula:'parabola-23-f',start:0,end:4*Math.sqrt(2),label:'f',color:'#2563eb'}],segments:[S(2*Math.sqrt(2),8,0,8,'MH')]});
add('23_금당고_2학기_중간_고1_기출',18,[-2,8,-2,8],['A=(−1,1)→A′=(1,−1)','C=(4,6)→C′=(6,4)','P=(1/2,1/2), Q=(3,3)','전체 최소 3√10'],{points:[V(-1,1,'A'),V(0,2,'B'),V(4,6,'C'),V(1,-1,'A′','#16a34a'),V(6,4,'C′','#16a34a'),V(.5,.5,'P'),V(3,3,'Q')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(1,-1,0,2,'A′B'),S(0,2,6,4,'BC′','#16a34a')]});
add('23_매산여고_2학기_중간_고1_기출',12,[-2,5,-4,14],['l₁·l₂는 서로 독립적인 평행이동','두 경계선 y=2x+3/4','포물선과 T=(1/2,7/4)에서 접'],{points:[V(.5,1.75,'T')],curves:[{formula:'parabola-maesan',start:-2,end:3,label:'포물선',color:'#2563eb'}],lines:[L(2,-1,.75,'이동 직선','#16a34a')]});
add('23_매산여고_2학기_중간_고1_기출',15,[-4,4,-5,3],['f: (0,0),(1,1),(2,0)','g: (−1,−3),(−2,−2),(−1,−1)','(u,v)→(−v−1,u−3)'],{points:[V(0,0,'A'),V(1,1,'B'),V(2,0,'C'),V(-1,-3,'A′','#16a34a'),V(-2,-2,'B′','#16a34a'),V(-1,-1,'C′','#16a34a')],polygons:[G([[0,0],[1,1],[2,0]],'f'),G([[-1,-3],[-2,-2],[-1,-1]],'g','#16a34a','#dcfce7')],arrows:[A(0,0,-1,-3,'좌표변환'),A(1,1,-2,-2,'좌표변환','#16a34a')]});
add('23_매산여고_2학기_중간_고1_기출',16,[-3,10,-3,10],['A=(0,2), B=(0,4), C=(0,8)','A′=(2,0), C′=(8,0)','P=(4/3,4/3), Q=(8/3,8/3)','PQ=4√2/3'],{points:[V(0,2,'A'),V(0,4,'B'),V(0,8,'C'),V(2,0,'A′','#16a34a'),V(8,0,'C′','#16a34a'),V(4/3,4/3,'P'),V(8/3,8/3,'Q')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(4/3,4/3,8/3,8/3,'PQ')]});
add('23_매산여고_2학기_중간_고1_기출',21,[-2,6,-5,6],['원래 중심 (4,−3), r=2','평행이동 (−2,3) → (2,0)','y=x 대칭 → (0,2)','최종 원을 y=2x+2가 이등분'],{points:[V(4,-3,'O'),V(2,0,'O₁','#7c3aed'),V(0,2,'O₂','#16a34a')],circles:[C(4,-3,2,'원래'),C(2,0,2,'중간','#7c3aed','#ede9fe','6 4'),C(0,2,2,'최종','#16a34a','#dcfce7')],lines:[L(1,-1,0,'y=x','#dc2626','7 5'),lineFromSlopeIntercept(2,2,'y=2x+2','#dc2626')],arrows:[A(4,-3,2,0,'(−2,3)'),A(2,0,0,2,'y=x 대칭','#16a34a')]});
add('23_팔마고_2학기_중간_고1_기출',7,[-3,5,-6,11],['원래 y=2x−1','이동벡터 (2,8)','이동 후 y=2x+3','포물선과 (0,3)에서 접'],{points:[V(0,-1,'원래'),V(2,7,'이동 점','#16a34a'),V(0,3,'접점')],lines:[lineFromSlopeIntercept(2,-1,'원래'),lineFromSlopeIntercept(2,3,'이동 후','#16a34a')],curves:[{formula:'parabola-palmar',start:-2,end:4,label:'포물선',color:'#7c3aed'}],arrows:[A(0,-1,2,7,'(2,8)')]});
add('23_팔마고_2학기_중간_고1_기출',13,[-5,4,-4,5],['A=(0,4), B=(2,0)','대칭축 y=−2x−1','A′=(−4,2)','축과 A′B의 교점 H=(−1,1)'],{points:[V(0,4,'A'),V(2,0,'B'),V(-4,2,'A′','#16a34a'),V(-1,1,'H')],lines:[L(2,1,1,'대칭축','#dc2626'),L(1,3,-2,'A′B')]});
add('23_팔마고_2학기_중간_고1_기출',20,[-2,8,-5,7],['원래 중심 (1,3), r=2','대칭 후 중심 (5,−3), r=2','대칭축 2x−3y−6=0','중점 (3,0)'],{points:[V(1,3,'O'),V(5,-3,'O′','#16a34a'),V(3,0,'M')],circles:[C(1,3,2,'원래'),C(5,-3,2,'대칭 후','#16a34a','#dcfce7')],lines:[L(2,-3,-6,'대칭축','#dc2626')],segments:[S(1,3,5,-3,'중심 연결')]});
add('24_금당고_2학기_중간_고1_기출',15,[-4,5,-4,5],['원래 (1,−3),(4,−3),(4,0)','변환 후 (0,0),(0,3),(−3,3)','좌표변환의 대응 꼭짓점'],{points:[V(1,-3,'A'),V(4,-3,'B'),V(4,0,'C'),V(0,0,'A′','#16a34a'),V(0,3,'B′','#16a34a'),V(-3,3,'C′','#16a34a')],polygons:[G([[1,-3],[4,-3],[4,0]],'원래'),G([[0,0],[0,3],[-3,3]],'변환 후','#16a34a','#dcfce7')],arrows:[A(1,-3,0,0,'변환'),A(4,-3,0,3,'변환','#16a34a')]});
add('21_제일고_2학기_기말_고1_기출',19,[-8,8,-3,10],['원래 중심 (5,2), r=5','이동벡터 (−10,3)','이동 후 중심 (−5,5), r=5','x축·y축에 접'],{points:[V(5,2,'O'),V(-5,5,'O′','#16a34a'),V(-5,0,'x축 접점'),V(0,5,'y축 접점')],circles:[C(5,2,5,'원래'),C(-5,5,5,'C','#16a34a','#dcfce7')],lines:[L(0,1,0,'x축','#dc2626','7 5'),L(1,0,0,'y축','#dc2626','7 5')],arrows:[A(5,2,-5,5,'(−10,3)')]});
add('21_효천고_2학기_기말_고1_기출',1,[-5,5,-5,5],['원래 l:x+3y−3=0','+3 x방향 평행이동 → x+3y−6=0','원점 대칭 후 l′:x+3y+6=0'],{lines:[L(1,3,-3,'원래 l'),L(1,3,-6,'평행이동 후','#7c3aed'),L(1,3,6,'원점 대칭 후','#16a34a')],arrows:[A(0,1,3,1,'(+3,0)'),A(3,1,-3,-1,'원점대칭','#16a34a')]});

add('25_금당고_2학기_중간_고1_기출',5,[-7,4,-4,7],['원래 중심 (−5,5), r=1','이동벡터 (3,−2)','도착 중심 (−2,3), r=1','(3,−2)는 변화량'],{points:[V(-5,5,'O'),V(-2,3,'O′','#16a34a')],circles:[C(-5,5,1,'원래'),C(-2,3,1,'이동 후','#16a34a','#dcfce7')],arrows:[A(-5,5,-2,3,'(3,−2)')]});
add('25_금당고_2학기_중간_고1_기출',13,[-4,4,-3,5],['l:y=x+5/2','x축 대칭·위로 3: l′:y=−x+1/2','경계선 x=1','삼각형 넓이 4'],{points:[V(-1,1.5,'교점'),V(1,3.5,'l∩x=1'),V(1,-.5,'l′∩x=1','#16a34a')],lines:[L(1,-1,2.5,'l'),L(1,1,-.5,'l′','#16a34a'),L(1,0,-1,'x=1','#dc2626','7 5')],polygons:[G([[-1,1.5],[1,3.5],[1,-.5]],'넓이 4','#7c3aed','#ede9fe')]});
add('25_금당고_2학기_중간_고1_기출',15,[-2,8,-5,8],['x축 대칭 후 원 중심 (3,2), r=2√2','점 (0,2)에서 그은 두 접선','최대 기울기 m=2√2'],{points:[V(3,2,'O'),V(0,2,'S'),V(1/3,2+2*Math.sqrt(2)/3,'T₁','#16a34a'),V(1/3,2-2*Math.sqrt(2)/3,'T₂','#f97316')],circles:[C(3,2,2*Math.sqrt(2),'C')],lines:[L(0,1,-2,'y=2','#64748b','7 5'),L(2*Math.sqrt(2),-1,2,'상단 접선','#16a34a'),L(-2*Math.sqrt(2),-1,2,'하단 접선','#f97316')],segments:[S(0,2,3,2,'OS'),S(3,2,1/3,2+2*Math.sqrt(2)/3,'CT₁','#7c3aed','5 4'),S(3,2,1/3,2-2*Math.sqrt(2)/3,'CT₂','#7c3aed','5 4')]});
add('25_금당고_2학기_중간_고1_기출',20,[-5,5,-5,5],['C 중심 (−2,−1), C′ 중심 (2,1)','원점 대칭·반지름 1 보존','내공통접선 y=4x/3','최대 기울기 m=4/3'],{points:[V(-2,-1,'O'),V(2,1,'O′','#16a34a')],circles:[C(-2,-1,1,'C'),C(2,1,1,'C′','#16a34a','#dcfce7')],lines:[L(4,-3,0,'최대 내공통접선','#7c3aed'),L(1,0,0,'원점대칭','#dc2626','7 5')]});
add('25_금당고_2학기_중간_고1_기출',22,[-2,8,-4,10],['C:y=x²−2x','C′:y=−(x−5)²+7','A=(3,3)에서 중근','k=−1,3,7 교점 합집합'],{points:[V(3,3,'A'),V(1,-1,'C 꼭짓점'),V(5,7,'C′ 꼭짓점','#16a34a')],curves:[{formula:'parabola-25-c',start:-1,end:4,label:'C',color:'#2563eb',equation:'y=x²−2x'},{formula:'parabola-25-cprime',start:2,end:8,label:'C′',color:'#16a34a',equation:'y=−(x−5)²+7'}],lines:[L(0,1,-3,'y=3','#dc2626','6 4'),L(0,1,1,'y=−1','#7c3aed','6 4'),L(0,1,-7,'y=7','#7c3aed','6 4')]});
add('25_효천고_2학기_중간_고1_기출',12,[-1,7,-7,7],['원래 y=(x+3)²+4','원점 대칭·위로 4','변환 후 y=−(x−3)²','x축 접점 (3,0)'],{points:[V(-3,4,'원래 꼭짓점'),V(3,0,'접점','#dc2626')],curves:[{formula:'parabola-eff-original',start:-6,end:0,label:'원래',color:'#2563eb'},{formula:'parabola-eff-moved',start:0,end:6,label:'변환 후',color:'#16a34a'}],lines:[L(0,1,0,'x축','#dc2626','7 5')]});
add('25_효천고_2학기_중간_고1_기출',13,[-7,7,-7,7],['(2,2)→(−5,0), (5,2)→(−2,0), (5,7)→(−2,−5)','전체 변환: x=u−7, y=2−v','x축 반사 후 (−7,2) 이동'],{points:[V(2,2,'A'),V(5,2,'C'),V(5,7,'B'),V(2,-2,'Aₓ','#7c3aed'),V(5,-2,'Cₓ','#7c3aed'),V(5,-7,'Bₓ','#7c3aed'),V(-5,0,'A′','#16a34a'),V(-2,0,'C′','#16a34a'),V(-2,-5,'B′','#16a34a')],polygons:[G([[2,2],[5,2],[5,7]],'f(x,y)=0','#2563eb','#dbeafe'),G([[-5,0],[-2,0],[-2,-5]],'g(x,y)=0','#16a34a','#dcfce7')],lines:[L(0,1,0,'x축','#dc2626','7 5')],arrows:[A(2,2,2,-2,'x축 대칭'),A(2,-2,-5,0,'(−7,2)'),A(5,2,5,-2,'x축 대칭'),A(5,-2,-2,0,'(−7,2)'),A(5,7,5,-7,'x축 대칭'),A(5,-7,-2,-5,'(−7,2)','#16a34a')]});
add('25_효천고_2학기_중간_고1_기출',17,[-4,8,-4,8],['이동 직선족 l:y=k(x−2)+3','모든 k의 공통점 (2,3)','원 중심 (2,3), 반지름 √13','ab=4'],{points:[V(2,3,'공통 중심')],circles:[C(2,3,Math.sqrt(13),'원')],lines:[L(1,1,-5,'k=−1'),L(0,1,-3,'k=0','#16a34a'),L(1,-1,1,'k=1','#7c3aed')]});
add('25_효천고_2학기_중간_고1_기출',18,[-12,5,-4,22],['OABC: O=(0,0), A=(0,17), B=(−10,17), C=(−10,0)','P=(−2,1), Q=(−8,16)','네 변 대칭점과 Q의 직선거리','R₁,R₂,R₃,R₄가 실제 변 위'],{points:[V(-2,1,'P'),V(-8,16,'Q','#16a34a'),V(2,1,'P₁','#7c3aed'),V(-2,33,'P₂','#7c3aed'),V(-18,1,'P₃','#7c3aed'),V(-2,-1,'P₄','#7c3aed'),V(0,4,'R₁'),V(-130/17,17,'R₂'),V(-10,13,'R₃'),V(-40/17,0,'R₄')],polygons:[G([[0,0],[0,17],[-10,17],[-10,0]],'OABC')],lines:[L(0,1,0,'x축','#dc2626','7 5'),L(1,0,0,'y축','#dc2626','7 5')],segments:[S(-2,1,-8,16,'PQ','#16a34a','5 4')]});
add('25_효천고_2학기_중간_고1_기출',23,[-3,8,-2,8],['대표 허용쌍 (a,b)=(3,1)','V=(3,1), O=(4,2), r=√2','y=x−2 (x≥3): 중심 O 통과','y=−x+4 (x≤3): V에서 원에 접함','두 branch는 V에서 만나는 반직선','V와 W를 잇는 현은 중심 O를 지나므로 지름'],{points:[V(3,1,'V','#dc2626',-45,18),V(4,2,'O','#dc2626',8,-10),V(5,3,'W','#16a34a',8,-10)],circles:[C(4,2,Math.sqrt(2),'원')],rays:[R(3,1,7,5,'x-y-2=0','x≥3','center','y=x−2 (x≥3)','#16a34a'),R(3,1,-3,7,'x+y-4=0','x≤3','other','y=−x+4 (x≤3)','#7c3aed','6 4')],segments:[S(3,1,5,3,'지름 V-W','#dc2626','',-30,28),S(4,2,3,1,'반지름 O-V','#dc2626','5 4',-48,10)]});
add('25_매산고_2학기_중간_고1_기출',8,[-4,5,-5,5],['x축 대칭 → y축 이동 +3 → y=x 대칭','원 중심 (2,−2), r=√8','a=−4: 최종 직선 2x−6y−16=0','최종 직선이 중심을 지남'],{points:[V(2,-2,'원 중심')],circles:[C(2,-2,Math.sqrt(8),'원')],lines:[L(2,-6,-16,'최종 직선'),L(1,-1,0,'y=x','#dc2626','7 5')]});
add('25_매산고_2학기_중간_고1_기출',12,[-7,5,-7,5],['B=(−5,3), C=(−5,1)','B의 y=x 대칭 B′=(3,−5)','P∈y=x에서 BP+CP 최소','최솟값 B′C=10'],{points:[V(-5,3,'B'),V(-5,1,'C'),V(3,-5,'B′','#16a34a')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(3,-5,-5,1,'B′C')]});
add('25_순천고_2학기_중간_고1_기출',15,[-1,7,-6,4],['원래 중심 (3,−2), r=1','최적 이동 후 중심 (−1−√2,−1)','x축·y=x에 동시 접','a+b 최솟값 −3−√2'],{points:[V(3,-2,'원래 중심'),V(-1-Math.sqrt(2),-1,'최적 중심','#16a34a')],circles:[C(-1-Math.sqrt(2),-1,1,'이동 후','#16a34a','#dcfce7')],lines:[L(0,1,0,'x축','#dc2626','7 5'),L(1,-1,0,'y=x','#dc2626','7 5')],arrows:[A(3,-2,-1-Math.sqrt(2),-1,'최적 (a,b)')]});
add('25_제일고_2학기_중간_고1_기출',18,[-2,18,-3,19],['정사각형 OABC 한 변 16','O=(0,0)→O′=(8,16), F=(5,0)→F′=(11,12)','PQ:y=−x/2+10','P=(0,10), Q=(16,2)'],{points:[V(0,0,'O'),V(16,0,'A'),V(16,16,'B'),V(0,16,'C'),V(0,10,'P'),V(16,2,'Q'),V(5,0,'F','#7c3aed'),V(11,12,'F′','#16a34a'),V(8,16,'O′','#16a34a')],polygons:[G([[0,0],[16,0],[16,16],[0,16]],'OABC'),G([[0,10],[8,16],[16,2]],'접힌 삼각형','#7c3aed','#ede9fe')],lines:[L(1,2,-20,'접는 선 PQ','#dc2626')],segments:[S(0,0,8,16,'O→O′','#16a34a','5 4'),S(5,0,11,12,'F→F′','#7c3aed','5 4')]});
add('25_제일고_2학기_기말_고1_기출',6,[-1,7,-2,7],['A=(2,1)→A′=(1,2) by y=x','B=(5,4)','P∈y=x에서 최단거리','A′B=2√5'],{points:[V(2,1,'A'),V(1,2,'A′','#16a34a'),V(5,4,'B'),V(3,3,'P')],lines:[L(1,-1,0,'y=x','#dc2626','7 5')],segments:[S(1,2,5,4,'A′B')]});

const visualKeys = [
  ['22_금당고_1학기_기말_고1_기출',[1,7,14,16]],['22_매산고_1학기_기말_고1_기출',[2,13]],['22_복성고_1학기_기말_고1_기출',[1,9]],['23_강남여고_1학기_기말_고1_기출',[7]],['23_복성고_1학기_기말_고1_기출',[14,15,18]],['23_순천여고_1학기_기말_고1_기출',[3,19]],['24_매산고_1학기_기말_고1_기출',[10,16,18,19]],['24_제일고_1학기_기말_고1_기출',[11,16,18]],['21_복성고_2학기_중간_고1_기출',[3,4,10,11,18,22]],['21_순천고_2학기_중간_고1_기출',[1]],['21_효천고_2학기_중간_고1_기출',[5,19]],['22_강남여고_2학기_중간_고1_기출',[9,23]],['22_제일고_2학기_중간_고1_기출',[1,3,5,17]],['22_효천고_2학기_중간_고1_기출',[1,13,17]],['23_금당고_2학기_중간_고1_기출',[1,2,7,12,16,18]],['23_매산여고_2학기_중간_고1_기출',[11,12,15,16,21]],['23_팔마고_2학기_중간_고1_기출',[3,7,13,20]],['24_금당고_2학기_중간_고1_기출',[1,9,15]],['21_제일고_2학기_기말_고1_기출',[19]],['21_효천고_2학기_기말_고1_기출',[1]],['25_금당고_2학기_중간_고1_기출',[5,6,13,15,20,22]],['25_효천고_2학기_중간_고1_기출',[12,13,17,18,19,23]],['25_매산고_2학기_중간_고1_기출',[4,8,12]],['25_순천고_2학기_중간_고1_기출',[8,15]],['25_순천여고_2학기_중간_고1_공통수학2',[6,18]],['25_제일고_2학기_중간_고1_기출',[18]],['25_제일고_2학기_기말_고1_기출',[2,6]]
];

const targetKeys = process.env.SHAPE_MOVEMENT_TARGETS ? new Set(process.env.SHAPE_MOVEMENT_TARGETS.split(';').filter(Boolean)) : null;
const renderSpecs = targetKeys ? [...specs].filter(([key]) => targetKeys.has(key)) : [...specs];
const reportPairs = targetKeys ? visualKeys.map(([folder, ids]) => [folder, ids.filter(id => targetKeys.has(folder + '#' + id))]).filter(([, ids]) => ids.length) : visualKeys;

const translation = {
'22_금당고_1학기_기말_고1_기출#14':'H15-SA-12-TRANSLATION|평행이동','22_매산고_1학기_기말_고1_기출#2':'H15-SA-12-TRANSLATION|평행이동','22_복성고_1학기_기말_고1_기출#1':'H15-SA-12-TRANSLATION|평행이동','23_강남여고_1학기_기말_고1_기출#7':'H15-SA-12-TRANSLATION|평행이동','23_복성고_1학기_기말_고1_기출#6':'H15-SA-12-TRANSLATION|평행이동','23_순천여고_1학기_기말_고1_기출#19':'H15-SA-12-TRANSLATION|평행이동','24_매산고_1학기_기말_고1_기출#16':'H15-SA-12-TRANSLATION|평행이동','24_매산고_1학기_기말_고1_기출#19':'H15-SA-12-TRANSLATION|평행이동','24_제일고_1학기_기말_고1_기출#11':'H15-SA-12-TRANSLATION|평행이동','21_복성고_2학기_중간_고1_기출#3':'H15-SA-12-TRANSLATION|평행이동','21_복성고_2학기_중간_고1_기출#10':'H15-SA-12-TRANSLATION|평행이동','21_효천고_2학기_중간_고1_기출#3':'H15-SA-12-TRANSLATION|평행이동','22_효천고_2학기_중간_고1_기출#1':'H15-SA-12-TRANSLATION|평행이동','23_금당고_2학기_중간_고1_기출#2':'H15-SA-12-TRANSLATION|평행이동','23_금당고_2학기_중간_고1_기출#7':'H15-SA-12-TRANSLATION|평행이동','23_팔마고_2학기_중간_고1_기출#3':'H15-SA-12-TRANSLATION|평행이동','23_팔마고_2학기_중간_고1_기출#7':'H15-SA-12-TRANSLATION|평행이동','24_금당고_2학기_중간_고1_기출#1':'H15-SA-12-TRANSLATION|평행이동','24_금당고_2학기_중간_고1_기출#9':'H15-SA-12-TRANSLATION|평행이동','21_제일고_2학기_기말_고1_기출#19':'H15-SA-12-TRANSLATION|평행이동'};
const reflection = {
'22_금당고_1학기_기말_고1_기출#1':'H15-SA-12-REFLECTION|대칭이동','22_금당고_1학기_기말_고1_기출#7':'H15-SA-12-REFLECTION|대칭이동','22_매산고_1학기_기말_고1_기출#13':'H15-SA-12-REFLECTION|대칭이동','23_복성고_1학기_기말_고1_기출#15':'H15-SA-12-REFLECTION|대칭이동','23_복성고_1학기_기말_고1_기출#18':'H15-SA-12-REFLECTION|대칭이동','23_순천여고_1학기_기말_고1_기출#3':'H15-SA-12-REFLECTION|대칭이동','24_매산고_1학기_기말_고1_기출#10':'H15-SA-12-REFLECTION|대칭이동','24_매산고_1학기_기말_고1_기출#18':'H15-SA-12-REFLECTION|대칭이동','21_복성고_2학기_중간_고1_기출#4':'H15-SA-12-REFLECTION|대칭이동','21_복성고_2학기_중간_고1_기출#18':'H15-SA-12-REFLECTION|대칭이동','21_복성고_2학기_중간_고1_기출#22':'H15-SA-12-REFLECTION|대칭이동','21_효천고_2학기_중간_고1_기출#5':'H15-SA-12-REFLECTION|대칭이동','22_강남여고_2학기_중간_고1_기출#9':'H15-SA-12-REFLECTION|대칭이동','22_강남여고_2학기_중간_고1_기출#23':'H15-SA-12-REFLECTION|대칭이동','22_제일고_2학기_중간_고1_기출#1':'H15-SA-12-REFLECTION|대칭이동','22_제일고_2학기_중간_고1_기출#3':'H15-SA-12-REFLECTION|대칭이동','22_제일고_2학기_중간_고1_기출#5':'H15-SA-12-REFLECTION|대칭이동','22_효천고_2학기_중간_고1_기출#13':'H15-SA-12-REFLECTION|대칭이동','22_효천고_2학기_중간_고1_기출#17':'H15-SA-12-REFLECTION|대칭이동','23_금당고_2학기_중간_고1_기출#1':'H15-SA-12-REFLECTION|대칭이동','23_금당고_2학기_중간_고1_기출#12':'H15-SA-12-REFLECTION|대칭이동','23_금당고_2학기_중간_고1_기출#16':'H15-SA-12-REFLECTION|대칭이동','23_금당고_2학기_중간_고1_기출#18':'H15-SA-12-REFLECTION|대칭이동','23_팔마고_2학기_중간_고1_기출#13':'H15-SA-12-REFLECTION|대칭이동','23_팔마고_2학기_중간_고1_기출#20':'H15-SA-12-REFLECTION|대칭이동'};
const missingSubunits = {'23_매산여고_2학기_중간_고1_기출#11':'H15-SA-12-TRANSLATION|평행이동','23_매산여고_2학기_중간_고1_기출#12':'H15-SA-12-TRANSLATION|평행이동','23_매산여고_2학기_중간_고1_기출#15':'H15-SA-12-COMPOSITE_TRANSFORMATION|합성 변환','23_매산여고_2학기_중간_고1_기출#16':'H15-SA-12-REFLECTION|대칭이동','23_매산여고_2학기_중간_고1_기출#21':'H15-SA-12-COMPOSITE_TRANSFORMATION|합성 변환','24_제일고_1학기_기말_고1_기출#16':'H15-SA-12-TRANSLATION|평행이동'};
const tagUpdates = {'23_강남여고_1학기_기말_고1_기출#7':['객관식','도형의 이동','평행이동','직선','점','조건해석'],'23_강남여고_1학기_기말_고1_기출#16':['객관식','도형의 이동','합성변환','점','좌표변환'],'23_순천여고_1학기_기말_고1_기출#3':['객관식','도형의이동','대칭이동','삼각형','넓이'],'23_순천여고_1학기_기말_고1_기출#19':['객관식','도형의이동','평행이동','직선','최솟값','좌표'],'25_순천여고_2학기_중간_고1_공통수학2#6':['객관식','도형의 이동','대칭이동','점','최단거리'],'25_순천여고_2학기_중간_고1_공통수학2#7':['객관식','도형의 이동','대칭이동','직선','원','접선'],'25_순천여고_2학기_중간_고1_공통수학2#15':['객관식','도형의 이동','평행이동','직선','거리'],'25_순천여고_2학기_중간_고1_공통수학2#18':['객관식','도형의 이동','대칭이동','점','대칭축'],'25_제일고_2학기_기말_고1_기출#2':['객관식','도형의 이동','평행이동','점','좌표'],'25_제일고_2학기_기말_고1_기출#6':['객관식','도형의 이동','대칭이동','점','최단거리']};

const q19Solution = '[키포인트] $a=0$과 $a\\ne0$을 나누어 확인하고, 형식적으로 얻은 값도 원래 두 직선에 다시 대입하여 교점 조건을 검증한다.\\n\\n먼저 $a=0$이면 원래 직선은 $l:y=2$이다. 이를 $(5,1)$만큼 평행이동하면 $y=3$이고, 다시 $y=x$에 대하여 대칭이동하면 $l′:x=3$이다. 두 직선의 교점은 $(3,2)$이므로 y축 위에 있지 않다.\\n\\n이제 $a\\ne0$이라 하자. $l:y=ax+2$를 $(5,1)$만큼 평행이동하면 $y−1=a(x−5)+2$, 즉 $y=ax−5a+3$이다. 이를 $y=x$에 대하여 대칭이동하면 $x=ay−5a+3$이고, 따라서 $l′:y=(1/a)x+5−3/a$이다.\\n\\n교점이 y축 위에 있으려면 $x=0$에서 두 직선의 y값이 같아야 하므로 $2=5−3/a$, $a=1$이다.\\n\\n그러나 $a=1$을 실제 원식에 대입하면 $l:y=x+2$이고, 평행이동 후 직선은 $y=x−2$이다. 이를 $y=x$에 대칭이동하면 $l′:y=x+2$가 되어 $l=l′$이다. 따라서 한 점으로서의 교점이 존재하지 않고 직선 전체가 겹친다.\\n\\n그러므로 $a=0$은 y축 위 조건을 만족하지 않고, $a\\ne0$에서 형식적으로 얻은 $a=1$도 고유한 교점 조건을 만족하지 않는다. 발문을 그대로 유지하면 조건을 만족하는 정상적인 $a$는 존재하지 않는다.';
const q23Solution = '[키포인트] 원의 중심을 지나는 직선이 만드는 지름과 절댓값 그래프의 다른 branch가 원 내부를 추가로 가르는지까지 확인하여 필요조건과 충분조건을 함께 검증한다.\\n조건 정리: 원은 $(x−4)^2+(y−2)^2=2$이므로 중심 $O=(4,2)$, 반지름은 $\\sqrt2$이다. 이동한 그래프는 $y=|x−a|+b$이고 꼭짓점은 $V=(a,b)$이다.\\n풀이 방향: 먼저 그래프가 중심을 지나는 조건으로 $b$를 정하고, 꼭짓점의 위치로 원 안에서 실제로 중심을 지나는 branch만 남는지 확인한다.\\n\\n그래프가 중심 $O=(4,2)$를 지나므로 $2=|4−a|+b$, $b=2−|4−a|$이다.\\n\\n꼭짓점 $V$와 중심 $O$ 사이의 거리는 $\\sqrt{(a−4)^2+(b−2)^2}=\\sqrt2|a−4|$이다. 원 안에서 꼭짓점이 나타나면 두 branch가 원 내부에서 꺾여 서로 다른 두 선분을 만들므로, 중심을 지나는 branch 하나가 만드는 지름만으로 원의 넓이를 양분할 수 없다. 따라서 필요조건은 $\\sqrt2|a−4|\\ge\\sqrt2$, 즉 $|a−4|\\ge1$이다.\\n\\n이제 이 조건이 충분한지도 확인한다. 중심 $O$를 지나는 branch는 원과 만나는 현이 중심을 지나므로 지름이고, 따라서 원의 넓이를 정확히 이등분한다. 다른 branch와 중심 $O$ 사이의 거리는 $\\sqrt2|a−4|$이다. $|a−4|\\ge1$이면 이 거리는 원의 반지름 이상이므로 다른 branch는 원의 내부를 다시 가르지 않는다. 등호일 때에는 꼭짓점에서 원에 접하고, 부등호일 때에는 원 밖에 있다. 따라서 원 내부에는 중심을 지나는 branch만 실제 절단선으로 남으며, 위 필요조건은 이 문제에서 충분조건이기도 하다.\\n\\n또 $|b|\\le4$와 $b=2−|4−a|$를 함께 적용하면 $|4−a|\\le6$이다. 그러므로 $1\\le|4−a|\\le6$, $|a|\\le9$를 만족하는 정수는 $a=−2,−1,0,1,2,3,5,6,7,8,9$이다.\\n각 $a$에 대해 $b=2−|4−a|$를 계산하면 $(−2,−4),(−1,−3),(0,−2),(1,−1),(2,0),(3,1),(5,1),(6,0),(7,−1),(8,−2),(9,−3)$이다.\\n따라서 구하는 순서쌍은 $(3,1),(2,0),(1,−1),(0,−2),(−1,−3),(−2,−4),(5,1),(6,0),(7,−1),(8,−2),(9,−3)$이다.';

function findFile(folder) {
  const wanted = folder + '.js';
  const stack = [examsRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const full = path.join(dir,entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === wanted) return full;
    }
  }
  throw new Error('exam file missing: ' + folder);
}
function parseKey(key) {
  const i = key.lastIndexOf('#');
  return [key.slice(0,i), Number(key.slice(i+1))];
}
function isolate(text,id) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex(line => line.includes('"id": ' + id + ','));
  if (index < 0) throw new Error('q missing: ' + id);
  let end = index + 1;
  while (end < lines.length && !/^  \},?\s*$/.test(lines[end]) && !/^  \}\s*$/.test(lines[end])) end += 1;
  if (end >= lines.length) throw new Error('q close missing: ' + id);
  return {lines,index,end};
}
function mutate(text,id,fn) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const data = isolate(text,id);
  fn(data.lines,data.index,data.end);
  return data.lines.join(eol);
}
function setString(text,id,key,value) {
  return mutate(text,id,(lines,index,end) => {
    const re = new RegExp('^\\s*"' + key + '"\\s*:');
    const pos = lines.findIndex((line,n) => n > index && n < end && re.test(line));
    const valueText = JSON.stringify(value);
    if (pos >= 0) {
      const indent = lines[pos].match(/^\s*/)[0];
      const comma = lines[pos].trimEnd().endsWith(',') ? ',' : '';
      lines[pos] = indent + '"' + key + '": ' + valueText + comma;
    } else {
      let previous = end - 1;
      while (previous > index && !lines[previous].trim()) previous -= 1;
      if (!lines[previous].trimEnd().endsWith(',')) lines[previous] += ',';
      lines.splice(end,0,'    "' + key + '": ' + valueText);
    }
  });
}
function setTags(text,id,values) {
  return mutate(text,id,(lines,index,end) => {
    const pos = lines.findIndex((line,n) => n > index && n < end && /^\s*"tags"\s*:/.test(line));
    if (pos < 0) throw new Error('tags missing: q' + id);
    const comma = lines[pos].trimEnd().endsWith(',') ? ',' : '';
    lines[pos] = '    "tags": ' + JSON.stringify(values) + comma;
  });
}
const fileTexts = new Map();
function getText(folder) {
  const file = findFile(folder);
  if (!fileTexts.has(file)) fileTexts.set(file, fs.readFileSync(file,'utf8'));
  return [file,fileTexts.get(file)];
}
function save(folder,text) { fileTexts.set(getText(folder)[0],text); }

if (!targetKeys) {
for (const pair of visualKeys) for (const id of pair[1]) {
  const folder = pair[0];
  let text = getText(folder)[1];
  const block = isolate(text,id);
  const hasRef = block.lines.slice(block.index,block.end+1).some(line => line.includes('"solutionImage"'));
  if (!hasRef) {
    text = setString(text,id,'solutionImage','assets/images/' + folder + '/q' + String(id).padStart(2,'0') + '-solution.svg');
    text = setString(text,id,'solutionImageAlt','도형의 이동 문항 ' + id + '의 핵심 관계를 표시한 해설 도형');
    text = setString(text,id,'solutionImageCaption','풀이에 필요한 점·도형·관계를 좌표평면에 표시한 해설 자료');
    text = setString(text,id,'solutionImageSize','full');
  }
  save(folder,text);
}
for (const entry of Object.entries(translation).concat(Object.entries(reflection),Object.entries(missingSubunits))) {
  const [folder,id] = parseKey(entry[0]);
  let text = getText(folder)[1];
  const [subUnitKey,subUnit] = entry[1].split('|');
  text = setString(text,id,'subUnitKey',subUnitKey);
  text = setString(text,id,'subUnit',subUnit);
  if (Object.prototype.hasOwnProperty.call(missingSubunits,entry[0])) {
    text = setString(text,id,'subUnitConfidence','rule_inferred');
    text = setString(text,id,'subUnitClassificationDepth','complete_rule');
  }
  save(folder,text);
}
{
  const [folder,id] = parseKey('24_제일고_1학기_기말_고1_기출#16');
  let text = getText(folder)[1];
  text = setString(text,id,'subUnitKey','H15-SA-12-TRANSLATION');
  text = setString(text,id,'subUnit','평행이동');
  save(folder,text);
}
for (const entry of Object.entries(tagUpdates)) {
  const [folder,id] = parseKey(entry[0]);
  save(folder,setTags(getText(folder)[1],id,entry[1]));
}
save('21_효천고_2학기_중간_고1_기출',updateSolution(getText('21_효천고_2학기_중간_고1_기출')[1],19,'[정답불가]',q19Solution));
save('25_효천고_2학기_중간_고1_기출',updateSolution(getText('25_효천고_2학기_중간_고1_기출')[1],23,undefined,q23Solution));
}
function updateSolution(text,id,answer,solution) {
  let next = text;
  if (answer !== undefined) next = setString(next,id,'answer',answer);
  return setString(next,id,'solution',solution);
}

function esc(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function fmt(value) { if (Math.abs(value)<1e-9) value=0; return Math.abs(value-Math.round(value))<1e-9 ? String(Math.round(value)) : value.toFixed(4).replace(/0+$/,'').replace(/\.$/,''); }
function fmtLabel(value) { return fmt(value).replace('-', '−'); }
function lineEquation(a,b,c) {
  const terms=[];
  for (const [value,symbol] of [[a,'x'],[b,'y']]) {
    if (Math.abs(value)<1e-12) continue;
    const magnitude=Math.abs(value)===1 ? '' : fmt(Math.abs(value));
    const sign=value<0 ? '-' : '+';
    terms.push({sign,magnitude,symbol});
  }
  if (Math.abs(c)>=1e-12) terms.push({sign:c<0?'-':'+',magnitude:fmt(Math.abs(c)),symbol:''});
  if (!terms.length) return '0=0';
  return terms.map((term,i)=>(i===0 ? (term.sign==='-'?'-':'') : term.sign)+term.magnitude+term.symbol).join('')+'=0';
}
function lineBox(a,b,c,bounds) {
  const xmin=bounds[0],xmax=bounds[1],ymin=bounds[2],ymax=bounds[3],pts=[];
  if(Math.abs(b)>1e-12) for(const x of [xmin,xmax]) { const y=-(a*x+c)/b; if(y>=ymin-1e-9&&y<=ymax+1e-9)pts.push([x,y]); }
  if(Math.abs(a)>1e-12) for(const y of [ymin,ymax]) { const x=-(b*y+c)/a; if(x>=xmin-1e-9&&x<=xmax+1e-9)pts.push([x,y]); }
  const unique=[]; for(const p of pts) if(!unique.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-8))unique.push(p);
  if(unique.length<2) throw new Error('line outside frame: ' + a + ',' + b + ',' + c);
  return unique.slice(0,2);
}
function curvePoints(formula,start,end,fx,fy) {
  const points=[];
  for(let i=0;i<=240;i++) {
    const x=start+(end-start)*i/240;
    let y;
    if(formula==='parabola-original') y=2*(x+1)*(x+1)+3;
    else if(formula==='parabola-moved') y=2*(x-1)*(x-1)+1;
    else if(formula==='parabola-24-original') y=-x*x+3*x-4;
    else if(formula==='parabola-24-reflected') y=x*x-3*x+4;
    else if(formula==='parabola-23-f') y=x*x-2*Math.sqrt(2)*x;
    else if(formula==='parabola-maesan') y=x*x+x+1;
    else if(formula==='parabola-palmar') y=-x*x+2*x+3;
    else if(formula==='parabola-25-c') y=x*x-2*x;
    else if(formula==='parabola-25-cprime') y=-(x-5)*(x-5)+7;
    else if(formula==='parabola-eff-original') y=(x+3)*(x+3)+4;
    else if(formula==='parabola-eff-moved') y=-(x-3)*(x-3);
    else throw new Error('curve formula: ' + formula);
    points.push(fx(x).toFixed(2)+','+fy(y).toFixed(2));
  }
  return points.join(' ');
}
function arcPoints(arc,fx,fy) {
  const points=[];
  for(let i=0;i<=180;i++) {
    const t=arc.start+(arc.end-arc.start)*i/180;
    points.push(fx(arc.cx+arc.r*Math.cos(t)).toFixed(2)+','+fy(arc.cy+arc.r*Math.sin(t)).toFixed(2));
  }
  return points.join(' ');
}
function hashSpec(spec) {
  const text=JSON.stringify(spec);
  let h=2166136261;
  for(const ch of text){h^=ch.codePointAt(0);h=Math.imul(h,16777619);}
  return (h>>>0).toString(16).padStart(8,'0').repeat(8).slice(0,64);
}
function render(spec) {
  const b=spec.bounds,xmin=b[0],xmax=b[1],ymin=b[2],ymax=b[3],left=48,top=78,w=500,h=345;
  const scale=Math.min(w/(xmax-xmin),h/(ymax-ymin));
  const x0=left+(w-scale*(xmax-xmin))/2, y0=top+(h-scale*(ymax-ymin))/2;
  const sx=x=>x0+(x-xmin)*scale, sy=y=>y0+(ymax-y)*scale;
  const body=['<rect x="30" y="66" width="530" height="370" rx="12" fill="#fff" stroke="#cbd5e1"/>'];
  const step=Math.max(xmax-xmin,ymax-ymin)<=14?1:Math.max(xmax-xmin,ymax-ymin)<=28?2:5;
  for(let x=Math.ceil(xmin/step)*step;x<=xmax;x+=step)body.push('<line x1="'+sx(x).toFixed(2)+'" y1="'+top+'" x2="'+sx(x).toFixed(2)+'" y2="'+(top+h)+'" stroke="#e5e7eb" stroke-width=".8"/>');
  for(let y=Math.ceil(ymin/step)*step;y<=ymax;y+=step)body.push('<line x1="'+left+'" y1="'+sy(y).toFixed(2)+'" x2="'+(left+w)+'" y2="'+sy(y).toFixed(2)+'" stroke="#e5e7eb" stroke-width=".8"/>');
  if(xmin<=0&&xmax>=0)body.push('<line x1="'+sx(0)+'" y1="'+top+'" x2="'+sx(0)+'" y2="'+(top+h)+'" stroke="#111827" stroke-width="1.35"/>');
  if(ymin<=0&&ymax>=0)body.push('<line x1="'+left+'" y1="'+sy(0)+'" x2="'+(left+w)+'" y2="'+sy(0)+'" stroke="#111827" stroke-width="1.35"/>');
  for(const cu of spec.curves || []) body.push('<polyline data-geometry="curve" data-formula="'+esc(cu.formula)+'"'+(cu.equation ? ' data-equation="'+esc(cu.equation)+'"' : '')+' points="'+curvePoints(cu.formula,cu.start,cu.end,sx,sy)+'" fill="none" stroke="'+cu.color+'" stroke-width="2.35" stroke-linecap="round"/>');
  for(const arc of spec.arcs || []) body.push('<polyline data-geometry="arc" data-equation="'+esc(arc.label)+'" data-center-x="'+fmt(arc.cx)+'" data-center-y="'+fmt(arc.cy)+'" data-radius="'+fmt(arc.r)+'" points="'+arcPoints(arc,sx,sy)+'" fill="none" stroke="'+arc.color+'" stroke-width="2.35" stroke-linecap="round"/>');
  for(const p of spec.polygons || []) body.push('<polygon data-geometry="polygon" data-name="'+esc(p.label)+'" points="'+p.points.map(x=>sx(x[0]).toFixed(2)+','+sy(x[1]).toFixed(2)).join(' ')+'" fill="'+p.fill+'" fill-opacity=".42" stroke="'+p.color+'" stroke-width="2.15"/>');
  for(const c of spec.circles || []) body.push('<circle data-geometry="circle" data-center-x="'+fmt(c.cx)+'" data-center-y="'+fmt(c.cy)+'" data-radius="'+fmt(c.r)+'" cx="'+sx(c.cx).toFixed(2)+'" cy="'+sy(c.cy).toFixed(2)+'" r="'+(c.r*scale).toFixed(2)+'" fill="'+c.fill+'" fill-opacity=".25" stroke="'+c.color+'" stroke-width="2.1" '+(c.dash?'stroke-dasharray="'+c.dash+'"':'')+'/>');
  for(const ray of spec.rays || []) body.push('<line data-geometry="ray" data-equation="'+esc(ray.equation)+'" data-domain="'+esc(ray.domain)+'" data-branch-role="'+esc(ray.role)+'" x1="'+sx(ray.x1).toFixed(2)+'" y1="'+sy(ray.y1).toFixed(2)+'" x2="'+sx(ray.x2).toFixed(2)+'" y2="'+sy(ray.y2).toFixed(2)+'" stroke="'+ray.color+'" stroke-width="2.35" stroke-linecap="round" marker-end="url(#arrow)" '+(ray.dash?'stroke-dasharray="'+ray.dash+'"':'')+'/><text x="'+(sx(ray.x2)+6)+'" y="'+(sy(ray.y2)-7)+'" class="label" fill="'+ray.color+'">'+esc(ray.label)+'</text>');
  for(const l of spec.lines || []) { const ps=lineBox(l.a,l.b,l.c,b),p1=ps[0],p2=ps[1];body.push('<line data-geometry="line" data-equation="'+esc(lineEquation(l.a,l.b,l.c))+'" x1="'+sx(p1[0]).toFixed(2)+'" y1="'+sy(p1[1]).toFixed(2)+'" x2="'+sx(p2[0]).toFixed(2)+'" y2="'+sy(p2[1]).toFixed(2)+'" stroke="'+l.color+'" stroke-width="2.25" '+(l.dash?'stroke-dasharray="'+l.dash+'"':'')+'/><text x="'+(Math.min(sx(p1[0]),sx(p2[0]))+8)+'" y="'+Math.max(72,Math.min(sy(p1[1]),sy(p2[1]))-7)+'" class="label" fill="'+l.color+'">'+esc(l.label)+'</text>'); }
  for(const s of spec.segments || []) body.push('<line data-geometry="segment" x1="'+sx(s.x1)+'" y1="'+sy(s.y1)+'" x2="'+sx(s.x2)+'" y2="'+sy(s.y2)+'" stroke="'+s.color+'" stroke-width="2.15" '+(s.dash?'stroke-dasharray="'+s.dash+'"':'')+'/><text x="'+((sx(s.x1)+sx(s.x2))/2+(s.dx ?? 5))+'" y="'+((sy(s.y1)+sy(s.y2))/2+(s.dy ?? -6))+'" class="label" fill="'+s.color+'">'+esc(s.label)+'</text>');
  for(const a of spec.arrows || []) body.push('<line data-geometry="transform-arrow" x1="'+sx(a.x1)+'" y1="'+sy(a.y1)+'" x2="'+sx(a.x2)+'" y2="'+sy(a.y2)+'" stroke="'+a.color+'" stroke-width="2" marker-end="url(#arrow)"/><text x="'+((sx(a.x1)+sx(a.x2))/2+6)+'" y="'+((sy(a.y1)+sy(a.y2))/2-6)+'" class="label" fill="'+a.color+'">'+esc(a.label)+'</text>');
  for(const p of spec.points || []) body.push('<g data-point-label="'+esc(p.label)+'" data-point-x="'+fmt(p.x)+'" data-point-y="'+fmt(p.y)+'"><circle cx="'+sx(p.x)+'" cy="'+sy(p.y)+'" r="4.6" fill="'+p.color+'" stroke="#fff" stroke-width="1.5"/><text x="'+(sx(p.x)+(p.dx ?? 7))+'" y="'+(sy(p.y)+(p.dy ?? -7))+'" class="label" fill="'+p.color+'">'+esc(p.label+' ('+fmtLabel(p.x)+','+fmtLabel(p.y)+')')+'</text></g>');
  const notes=spec.notes.map((note,i)=>'<text x="592" y="'+(118+i*22)+'" class="note">'+esc(note)+'</text>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 480" width="940" height="480" preserveAspectRatio="xMidYMid meet" role="img" data-geometry-mode="COORDINATE_GEOMETRY_HYBRID" data-geometry-style-version="AP_GRAPH_PRINT_V1_1_DRAFT" data-geometry-preset="GEOMETRY_STANDARD" data-axis-scale-mode="EQUAL_UNIT" data-fact-hash="'+hashSpec(spec)+'" data-visual-provenance="deterministic-python-independent-facts"><title>도형의 이동 해설 도형 · 문항 '+spec.id+'</title><desc>실제 좌표·변환·대응관계를 계산값으로 표시한 해설 도형</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#64748b"/></marker></defs><style>.label{font:11px "STIX Two Math","Malgun Gothic",serif;font-weight:600}.note{font:11px "Noto Sans KR","Malgun Gothic",sans-serif;fill:#374151}.heading{font:700 16px "Noto Sans KR","Malgun Gothic",sans-serif;fill:#111827}</style><rect width="940" height="480" fill="#fff"/><text x="32" y="34" class="heading">도형의 이동 해설 도형 · 문항 '+spec.id+'</text><text x="32" y="54" class="note">실제 수치·좌표·변환 순서를 표시한 해설 자료</text>'+body.join('')+'<rect x="580" y="66" width="330" height="370" rx="12" fill="#f8fafc" stroke="#dbe3ef"/><text x="600" y="92" class="heading">핵심 수치와 관계</text>'+notes+'</svg>\n';
}

for(const [key,spec] of renderSpecs) {
  const file=path.join(assetsRoot,spec.folder,'q'+String(spec.id).padStart(2,'0')+'-solution.svg');
  fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,render(spec),'utf8');
}
for(const [file,text] of fileTexts) fs.writeFileSync(file,text,'utf8');
const rows=[];
for(const pair of reportPairs) for(const id of pair[1]) {
  const file=path.join(assetsRoot,pair[0],'q'+String(id).padStart(2,'0')+'-solution.svg');
  const raw=fs.readFileSync(file,'utf8');
  rows.push({key:pair[0]+'#'+id,asset:path.relative(path.join(root,'archive'),file).replaceAll(path.sep,'/'),factHash:(raw.match(/data-fact-hash="([^"]+)"/)||[])[1] || ''});
}
fs.writeFileSync(path.join(reportRoot,'target_visuals.json'),JSON.stringify({status:'PASS',rows},null,2)+'\n','utf8');
console.log(JSON.stringify({status:'PASS',updatedJsFiles:fileTexts.size,visualRows:rows.length,missingSpecs:renderSpecs.filter(([key,s])=>!fs.existsSync(path.join(assetsRoot,s.folder,'q'+String(s.id).padStart(2,'0')+'-solution.svg'))).map(([key])=>key)},null,2));
