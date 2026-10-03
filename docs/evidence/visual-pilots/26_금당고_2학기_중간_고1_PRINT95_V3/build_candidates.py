from __future__ import annotations
import hashlib, json, math
from fractions import Fraction as F
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT=Path('.')
EVID=Path('docs/evidence/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3')
DEST=Path('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3')
DEST.mkdir(parents=True,exist_ok=True)
ET.register_namespace('', 'http://www.w3.org/2000/svg')
NS='{http://www.w3.org/2000/svg}'
FACTS=json.loads((EVID/'independent_math_facts.json').read_text(encoding='utf-8'))['facts']
SPECS=json.loads((EVID/'visual_specs.json').read_text(encoding='utf-8'))
TEXT_FONT='"Noto Sans KR", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif'
MATH_FONT='"STIX Two Math", "Cambria Math", "Times New Roman", serif'
CURRENT_QID=0
STYLE=f'''
* {{ box-sizing:border-box; }}
.title {{ font:700 18px {TEXT_FONT}; fill:#111; }}
.panel-title {{ font:700 16px {TEXT_FONT}; fill:#111; }}
.note {{ font:14px {TEXT_FONT}; fill:#222; }}
.small {{ font:13px {TEXT_FONT}; fill:#333; }}
.label {{ font:italic 15px {MATH_FONT}; fill:#111; }}
.value {{ font:700 16px {MATH_FONT}; fill:#111; }}
.strong {{ font:700 17px {TEXT_FONT}; fill:#111; }}
.shape {{ fill:none; stroke:#111; stroke-width:2.05; stroke-linecap:round; stroke-linejoin:round; }}
.secondary {{ fill:none; stroke:#333; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }}
.aux {{ fill:none; stroke:#555; stroke-width:1; stroke-linecap:round; stroke-linejoin:round; }}
.indicator {{ fill:none; stroke:#333; stroke-width:.8; stroke-linecap:round; stroke-linejoin:round; }}
.axis {{ fill:none; stroke:#333; stroke-width:1.2; stroke-linecap:round; }}
.panel {{ fill:#fff; stroke:#bbb; stroke-width:1; }}
.region {{ fill:#f2f2f2; stroke:none; }}
.hatch {{ stroke:#aaa; stroke-width:.75; }}
'''

def n(x):
    if isinstance(x,F): x=float(x)
    if isinstance(x,int): return str(x)
    return f'{float(x):.3f}'.rstrip('0').rstrip('.')
def make_svg(qid,w,h,title,desc,backend,math_geometry=True,hybrid=False):
    global CURRENT_QID
    CURRENT_QID=qid
    fh=hashlib.sha256(json.dumps(FACTS[str(qid)],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    attrs={'width':str(w),'height':str(h),'viewBox':f'0 0 {w} {h}','preserveAspectRatio':'xMidYMid meet','role':'img','aria-labelledby':'title desc','data-qid':str(qid),'data-visual-stage':'PRINT95_CANDIDATE','data-visual-backend':backend,'data-visual-provenance':'independent-python-facts','data-fact-hash':fh}
    if math_geometry:
        attrs.update({'data-geometry-style-version':'AP_GEOMETRY_PRINT_V1_0_DRAFT','data-geometry-preset':'GEOMETRY_STANDARD','data-geometry-fact-hash':fh})
        if hybrid: attrs.update({'data-geometry-mode':'COORDINATE_GEOMETRY_HYBRID','data-axis-scale-mode':'EQUAL_UNIT'})
    root=ET.Element(NS+'svg',attrs)
    ET.SubElement(root,NS+'title',{'id':'title'}).text=title
    ET.SubElement(root,NS+'desc',{'id':'desc'}).text=desc
    defs=ET.SubElement(root,NS+'defs')
    marker=ET.SubElement(defs,NS+'marker',{'id':f'arrow-{qid}','markerWidth':'7','markerHeight':'7','refX':'6','refY':'3.5','orient':'auto','markerUnits':'strokeWidth'})
    ET.SubElement(marker,NS+'path',{'d':'M0,0 L7,3.5 L0,7 Z','fill':'#222'})
    pattern=ET.SubElement(defs,NS+'pattern',{'id':f'hatch-{qid}','patternUnits':'userSpaceOnUse','width':'5','height':'5','patternTransform':'rotate(45)'})
    ET.SubElement(pattern,NS+'line',{'x1':'0','y1':'0','x2':'0','y2':'5','stroke':'#aaa','stroke-width':'.75'})
    ET.SubElement(root,NS+'style').text=STYLE
    ET.SubElement(root,NS+'rect',{'x':'0','y':'0','width':str(w),'height':str(h),'fill':'#fff','data-layer':'Z00_BACKGROUND'})
    return root,fh

def group(root, panel=None, model=None):
    attrs={}
    if panel: attrs['data-panel']=panel
    if model:
        ox,oy,sx,sy=model
        attrs.update({'data-origin-x':n(ox),'data-origin-y':n(oy),'data-sx':n(sx),'data-sy':n(sy),'data-coordinate-rule':'screenX=originX+sx*x;screenY=originY-sy*y'})
    return ET.SubElement(root,NS+'g',attrs)
def xy(model,p):
    ox,oy,sx,sy=model
    return (ox+sx*float(p[0]),oy-sy*float(p[1]))
def line(g,p1,p2,cls='shape',owner='',dash=None,arrow=False,equation=None):
    layer={'shape':'Z40_MAIN_SHAPE','secondary':'Z30_SECONDARY_SHAPE','axis':'Z30_COORDINATE_AXIS'}.get(cls,'Z20_AUXILIARY')
    attrs={'x1':n(p1[0]),'y1':n(p1[1]),'x2':n(p2[0]),'y2':n(p2[1]),'class':cls,'data-layer':layer}
    if owner: attrs['data-owner']=owner
    if dash: attrs['stroke-dasharray']=dash
    if arrow: attrs['marker-end']=f'url(#arrow-{CURRENT_QID})'
    if equation: attrs['data-equation']=equation
    return ET.SubElement(g,NS+'line',attrs)
def cpoint(g,model,label,p,r=4.5,filled=True,exact=None):
    x,y=xy(model,p); exact=exact or (str(p[0]),str(p[1]))
    attrs={'cx':n(x),'cy':n(y),'r':n(r),'fill':'#111' if filled else '#fff','stroke':'#111','stroke-width':'1.3','data-point-label':label,'data-point-x':exact[0],'data-point-y':exact[1],'data-layer':'Z70_POINT'}
    return (x,y,ET.SubElement(g,NS+'circle',attrs))
def circle(g,model,center,radius,cls='shape',label=None,exact=None):
    cx,cy=xy(model,center); rp=abs(float(radius)*float(model[2]))
    attrs={'cx':n(cx),'cy':n(cy),'r':n(rp),'class':cls,'data-geometry':'circle','data-center-x':str(center[0]),'data-center-y':str(center[1]),'data-radius':str(radius),'data-layer':'Z40_MAIN_SHAPE'}
    el=ET.SubElement(g,NS+'circle',attrs)
    if label: el.set('data-point-label',label); el.set('data-point-x',exact[0] if exact else str(center[0])); el.set('data-point-y',exact[1] if exact else str(center[1]))
    return el
def poly(g,points,fill='none',stroke='#111',width=2.05,owner='',pattern=False,model=None,qid=None):
    pix=[xy(model,p) for p in points] if model else points
    layer='Z10_FILL_HATCH' if pattern or fill!='none' else 'Z40_MAIN_SHAPE'
    attrs={'points':' '.join(f'{n(x)},{n(y)}' for x,y in pix),'fill':f'url(#hatch-{qid})' if pattern else fill,'stroke':stroke,'stroke-width':n(width),'stroke-linejoin':'round','stroke-linecap':'round','data-layer':layer}
    if owner: attrs['data-owner']=owner
    return ET.SubElement(g,NS+'polygon',attrs)
def xyline(g,model,points,cls='shape',owner=''):
    pix=[xy(model,p) for p in points]
    return ET.SubElement(g,NS+'polyline',{'points':' '.join(f'{n(x)},{n(y)}' for x,y in pix),'class':cls,'fill':'none','data-owner':owner,'data-layer':'Z40_MAIN_SHAPE'})
def text(g,x,y,value,cls='note',anchor='start',owner='',layer='Z90_LABEL'):
    attrs={'x':n(x),'y':n(y),'class':cls,'text-anchor':anchor,'data-layer':layer}
    if owner: attrs['data-label-owner']=owner
    el=ET.SubElement(g,NS+'text',attrs)
    el.text=value
    return el
def panel(g,x,y,w,h,head):
    ET.SubElement(g,NS+'rect',{'x':n(x),'y':n(y),'width':n(w),'height':n(h),'rx':'8','class':'panel','data-layer':'Z00_BACKGROUND'})
    text(g,x+16,y+25,head,'panel-title')
def mark_cross(g,x,y,size=5):
    line(g,(x-size,y-size),(x+size,y+size),'aux')
    line(g,(x-size,y+size),(x+size,y-size),'aux')
def right_angle(g,h,u,v,size=10):
    ux,uy=u; vx,vy=v
    p1=(h[0]+size*ux,h[1]+size*uy); p2=(p1[0]+size*vx,p1[1]+size*vy); p3=(h[0]+size*vx,h[1]+size*vy)
    ET.SubElement(g,NS+'polyline',{'points':' '.join(f'{n(x)},{n(y)}' for x,y in (p1,p2,p3)),'class':'indicator','data-geometry':'right-angle','data-owner':'perpendicular-at-foot','data-layer':'Z60_INDICATOR'})
def write(qid,root,model_rows,meta):
    model_rows=[]
    layer_rank={'Z00_BACKGROUND':0,'Z10_FILL_HATCH':10,'Z20_AUXILIARY':20,'Z30_SECONDARY_SHAPE':30,'Z30_COORDINATE_AXIS':30,'Z40_MAIN_SHAPE':40,'Z50_DIMENSION':50,'Z60_INDICATOR':60,'Z70_POINT':70,'Z80_LEADER_LINE':80,'Z90_LABEL':90}
    for parent in root.iter():
        if parent.tag==NS+'g':
            children=list(parent)
            children.sort(key=lambda el:layer_rank.get(el.attrib.get('data-layer'),15))
            parent[:]=children
    for el in root.iter():
        if el.tag.endswith('}g') and el.attrib.get('data-panel') and el.attrib.get('data-origin-x'):
            model_rows.append({'panel':el.attrib['data-panel'],'originX':el.attrib['data-origin-x'],'originY':el.attrib['data-origin-y'],'sx':el.attrib['data-sx'],'sy':el.attrib['data-sy'],'formula':'screenX=originX+sx*x;screenY=originY-sy*y'})
    data=ET.tostring(root,encoding='unicode',xml_declaration=False)
    data='<?xml version="1.0" encoding="UTF-8"?>\n'+data+'\n'
    out=DEST/f'q{qid:02}-candidate.svg'
    with out.open('w',encoding='utf-8',newline='') as stream: stream.write(data)
    meta.append({'qid':qid,'path':out.as_posix(),'sha256':'sha256:'+hashlib.sha256(data.encode('utf-8')).hexdigest(),'backend':root.attrib['data-visual-backend'],'factHash':root.attrib['data-geometry-fact-hash'] if 'data-geometry-fact-hash' in root.attrib else root.attrib['data-fact-hash'],'viewBox':root.attrib['viewBox'],'coordinateModels':model_rows})

meta=[]
# q1: strict integer interval number line
r,fh=make_svg(1,640,270,'원의 반지름 조건과 가능한 정수 k','r²>0 gives the open interval -1<k<5; the five filled integer marks are 0 through 4.','MINIMAL_EXAM_DIAGRAM',math_geometry=False)
r.attrib.update({'data-graph-style-version':'AP_GRAPH_PRINT_V1_1_DRAFT','data-graph-preset':'SOLUTION_GRAPH','data-visual-family':'NUMBER_LINE_INTERVAL'})
g=group(r,'integer-interval')
text(g,40,52,'반지름 제곱이 양수인 구간','title')
text(g,40,80,'r² = 9 − (k − 2)² > 0  ⇔  −1 < k < 5','note')
left,right=72,552; y=136
line(g,(left,y),(right,y),'axis',owner='k-number-line')
for k in range(-1,6):
    x=left+(k+1)*80
    line(g,(x,y-7),(x,y+7),'secondary',owner=f'tick:k={k}')
    closed=0<=k<=4
    ET.SubElement(g,NS+'circle',{'cx':n(x),'cy':n(y),'r':'4.2' if closed else '4.8','fill':'#111' if closed else '#fff','stroke':'#111','stroke-width':'1.6','data-interval-endpoint':'closed' if closed else 'open','data-k':str(k),'data-layer':'Z70_POINT'})
    text(g,x,y+33,str(k) if k>=0 else '−1','label','middle',owner=f'k={k}')
text(g,40,218,'가능한 정수: 0, 1, 2, 3, 4  (5개)','strong')
write(1,r,[],meta)

# q4: exact translation components
r,fh=make_svg(4,620,360,'점의 평행이동','A(-2,3) moves by (1,4) to B(-1,7).','MINIMAL_EXAM_DIAGRAM',math_geometry=True,hybrid=True)
model=(300,285,28,28); g=group(r,'coordinate-translation',model)
text(g,40,52,'점 A에서 B로의 평행이동','title')
line(g,(45,285),(575,285),'axis',owner='x-axis')
line(g,(300,325),(300,80),'axis',owner='y-axis')
A=xy(model,(-2,3)); X=xy(model,(-1,3)); B=xy(model,(-1,7))
line(g,A,X,'secondary',owner='horizontal-component +1',arrow=True,dash='5 3')
line(g,X,B,'secondary',owner='vertical-component +4',arrow=True,dash='5 3')
text(g,(A[0]+X[0])/2+7, A[1]+25,'x방향 +1','note','middle',owner='translation-x')
text(g,X[0]-14,(X[1]+B[1])/2,'y방향 +4','note','end','translation-y')
cpoint(g,model,'A',(-2,3),2,True,('-2','3')); cpoint(g,model,'B',(-1,7),2,True,('-1','7'))
text(g,A[0]-15,A[1]+24,'A(−2,3)','label','end','point:A')
text(g,B[0]-12,B[1]-8,'B(−1,7)','label','end','point:B')
text(g,410,318,'a − b = 1 − 7 = −6','strong')
write(4,r,[{'panel':'coordinate-translation','originX':300,'originY':285,'sx':28,'sy':28,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q9: true-scale segment and internal division
r,fh=make_svg(9,700,400,'선분의 내분','A, P, B are collinear in that order and AP:PB=4:5.','MINIMAL_EXAM_DIAGRAM',math_geometry=True,hybrid=True)
model=(200,220,16,16); g=group(r,'section-segment',model)
text(g,40,52,'선분 위에서 AP:PB = 4:5','title')
text(g,40,80,'점 P는 A와 B 사이의 내분점','note')
A=(-3,-8); P=(5,-4); B=(15,1)
line(g,xy(model,A),xy(model,B),'shape',owner='segment:A-B')
for label,p,exact in [('A',A,('-3','-8')),('P',P,('5','-4')),('B',B,('15','1'))]:
    px,py,_=cpoint(g,model,label,p,2,True,exact)
    if label=='A': text(g,px-8,py+10,'A(−3,−8)','label','end','point:A')
    elif label=='P': text(g,px,py+30,'P(5,−4)','label','middle','point:P')
    else: text(g,px+10,py-10,'B(15,1)','label','start','point:B')
text(g,520,150,'AP = 4 parts','note','start','segment:A-P')
text(g,520,182,'PB = 5 parts','note','start','segment:P-B')
text(g,520,226,'P = (5,−4)','value',owner='point:P')
text(g,520,258,'p + q = 1','strong',owner='result:p+q')
write(9,r,[{'panel':'section-segment','originX':200,'originY':220,'sx':16,'sy':16,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q12: two exact circle relationships in separate panels
r,fh=make_svg(12,940,500,'두 원에서 중심과 현의 관계','C1 is bisected by a line through its center. In C2, OH is perpendicular to chord AB.','COMPOSITE_PANEL',math_geometry=True,hybrid=True)
g=group(r,'composite-circle-facts')
panel(g,40,78,410,370,'① C1의 넓이를 이등분')
panel(g,490,78,410,370,'② C2와 현 AB의 길이')
m1=(255,260,32,32); p1=group(g,'C1',m1)
C1=(1,2); circle(p1,m1,C1,2,'shape')
C1p=xy(m1,C1); v=(4/5,3/5); e1=(C1p[0]-100*v[0],C1p[1]+100*v[1]); e2=(C1p[0]+100*v[0],C1p[1]-100*v[1])
line(p1,e1,e2,'secondary',owner='bisecting-line-through-C1',equation='3x-4y+5=0')
cpoint(p1,m1,'C1',C1,2,True,('1','2'))
text(p1,C1p[0]-15,C1p[1]-20,'C1','label','end','point:C1')
text(p1,300,330,'r1 = 2','note')
text(p1,60,360,'3x − 4y + 5 = 0 passes through C1','small',owner='bisecting-line-through-C1')
text(p1,60,384,'Center C1 = (1,2),  r1 = 2','small',owner='center:C1')
text(p1,60,420,'Therefore a = 5','value',owner='result:a')
m2=(664,260,28,28); p2=group(g,'C2-chord',m2)
O=(2,-1); H=(F(1,5),F(7,5)); A=(F(17,5),F(19,5)); B=(-3,-1)
circle(p2,m2,O,5,'shape')
line(p2,xy(m2,A),xy(m2,B),'shape',owner='chord:A-B')
line(p2,xy(m2,O),xy(m2,H),'aux',owner='perpendicular:center-to-chord',dash='5 3')
# radii distinguish the actual circle; no extra non-source construction is added.
line(p2,xy(m2,O),xy(m2,A),'secondary',owner='radius:O-A',dash='4 3')
line(p2,xy(m2,O),xy(m2,B),'secondary',owner='radius:O-B',dash='4 3')
hx,hy=xy(m2,H); right_angle(p2,(hx,hy),(0.8,-0.6),(0.6,0.8),10)
for label,pt,exact in [('O',O,('2','-1')),('H',H,('1/5','7/5')),('A',A,('17/5','19/5')),('B',B,('-3','-1'))]:
    px,py,_=cpoint(p2,m2,label,pt,2,True,exact)
    if label=='O': text(p2,px+8,py+20,'O(2,−1)','label','start','point:O')
    elif label=='H': text(p2,px-12,py-14,'H(1/5,7/5)','small','end','point:H')
    elif label=='A': text(p2,px+7,py-10,'A','label','start','point:A')
    else: text(p2,px-8,py+20,'B','label','end','point:B')
text(p2,515,405,'OH = 3,  AH = HB = 4','note',owner='chord-midpoint-right-triangle')
text(p2,515,430,'OA = 5  →  d = −20','value',owner='radius-and-constant-d')
text(g,40,455,'a + b + c + d = −17','strong')
write(12,r,[{'panel':'C1','originX':255,'originY':260,'sx':32,'sy':32,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'},{'panel':'C2-chord','originX':664,'originY':260,'sx':28,'sy':28,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q14: reflection geometry plus compact area panel
r,fh=make_svg(14,1020,520,'반사로 최단 경로를 곧게 펴기','Reflecting A in y=x turns AP+PQ into A′Q; then use the triangle height.','COMPOSITE_PANEL',math_geometry=True,hybrid=True)
g=group(r,'composite-reflection-area')
panel(g,40,75,555,410,'① 대칭으로 최단 경로 결정')
panel(g,625,75,350,410,'② 삼각형 넓이')
m=(310,355,34,34); p=group(g,'reflection-plane',m)
A=(-2,-3); Ap=(-3,-2); P=(1,1); Q=(F(17,5),F(14,5)); C=(5,4)
# Fill original triangle lightly beneath its boundary.
poly(p,[A,P,Q],fill='#f3f3f3',stroke='none',width=0,owner='triangle:A-P0-Q0',model=m,qid=14)
for u,v,edge in [(A,P,'A-P0'),(P,Q,'P0-Q0'),(Q,A,'Q0-A')]: line(p,xy(m,u),xy(m,v),'secondary',owner='triangle-edge:'+edge)
# Reflection axis y=x and straightened line A′-P0-Q0-C.
line(p,xy(m,(-3,-3)),xy(m,(5,5)),'aux',owner='reflection-axis:y=x',dash='5 4',equation='y=x')
line(p,xy(m,A),xy(m,Ap),'aux',owner='reflection-pair:A-A-prime',dash='4 4')
line(p,xy(m,Ap),xy(m,C),'secondary',owner='straightened-line:A-prime-C')
circle(p,m,C,2,'shape')
line(p,xy(m,C),xy(m,Q),'aux',owner='radius:C-Q0',dash='4 3')
for label,pt,exact in [('A',A,('-2','-3')),('A′',Ap,('-3','-2')),('P0',P,('1','1')),('Q0',Q,('17/5','14/5')),('C',C,('5','4'))]:
    px,py,_=cpoint(p,m,label,pt,2,True,exact)
    places={'A':(px+18,py+10,'start'),'A′':(px-4,py-10,'end'),'P0':(px-12,py-28,'end'),'Q0':(px+15,py+31,'start'),'C':(px+10,py+16,'start')}
    tx,ty,an=places[label]
    shown={'A':'A(−2,−3)','A′':'A′(−3,−2)','P0':'P0(1,1)','Q0':'Q0(17/5,14/5)','C':'C(5,4)'}[label]
    text(p,tx,ty,shown,'small' if label in ('A','A′') else 'label',an,'point:'+label)
    if label=='Q0':
        lead=line(p,(px+3,py+3),(px+13,py+15),'aux',owner='label-leader:Q0')
        lead.set('data-layer','Z80_LEADER_LINE')
text(p,90,130,'AP0 = A′P0','note',owner='reflection-distance-preserved')
text(p,90,160,'A′Q0 = A′C − 2 = 8','note',owner='nearest-point-on-circle')
# Right panel is a clean measurement/area derivation, not a second distorted triangle.
text(g,655,135,'AP0 = 5','value',owner='base:AP0')
text(g,655,178,'높이 = 21/25','value',owner='height:Q0-to-AP0')
text(g,655,225,'S = 1/2 × 5 × 21/25','note',owner='triangle-area')
text(g,655,260,'S = 21/10','strong',owner='triangle-area-result')
text(g,655,315,'10S = 21','value',owner='requested-result')
text(g,655,370,'A′–P0–Q0–C are collinear','small',owner='straightened-line:A-prime-C')
text(g,655,397,'Q0 is 2 units from C','small',owner='radius:C-Q0')
write(14,r,[{'panel':'reflection-plane','originX':310,'originY':355,'sx':34,'sy':34,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q15: exact circle, fixed chord, farthest point and tangent
r,fh=make_svg(15,760,500,'고정된 밑변에서 가장 먼 원 위의 점','The farthest circle point from AB maximizes the triangle area; its tangent is perpendicular to CP+.','MINIMAL_EXAM_DIAGRAM',math_geometry=True,hybrid=True)
m=(250,370,34,34); g=group(r,'circle-chord-tangent',m)
text(g,35,52,'AB를 밑변으로 고정하면 P에서 AB까지의 거리를 최대화','title')
C=(2,3); A=(1,0); B=(-1,2); Pp=(2+math.sqrt(5),3+math.sqrt(5)); Pm=(2-math.sqrt(5),3-math.sqrt(5)); H=(0,1)
circle(g,m,C,math.sqrt(10),'shape')
line(g,xy(m,A),xy(m,B),'shape',owner='fixed-base:AB',equation='x+y-1=0')
# CP normal passes through both extremal circle points and the foot H on AB.
line(g,xy(m,Pm),xy(m,Pp),'aux',owner='normal-through-center-and-extrema',dash='5 4')
# Tangent at P+ is parallel to AB; explicit endpoints are computed along (1,-1).
pplus=xy(m,Pp); tanvec=(1/math.sqrt(2),1/math.sqrt(2))
line(g,(pplus[0]-92*tanvec[0],pplus[1]-92*tanvec[1]),(pplus[0]+92*tanvec[0],pplus[1]+92*tanvec[1]),'secondary',owner='tangent-at-P-plus',equation='x+y-5-2sqrt(5)=0')
line(g,xy(m,C),xy(m,H),'aux',owner='perpendicular-from-center-to-AB')
hp=xy(m,H); right_angle(g,hp,(1/math.sqrt(2),1/math.sqrt(2)),(1/math.sqrt(2),-1/math.sqrt(2)),11)
for label,pt,exact,filled in [('A',A,('1','0'),True),('B',B,('-1','2'),True),('C',C,('2','3'),True),('P−',Pm,('2-sqrt(5)','3-sqrt(5)'),False),('P+',Pp,('2+sqrt(5)','3+sqrt(5)'),True)]:
    px,py,_=cpoint(g,m,label,pt,2,filled,exact)
    if label=='A': text(g,px+5,py+26,'A(1,0)','small',owner='point:A')
    elif label=='B': text(g,px-6,py-11,'B(−1,2)','small','end','point:B')
    elif label=='C': text(g,px+8,py+18,'C(2,3)','label',owner='point:C')
    elif label=='P−': text(g,px-6,py+22,'P−','label','end','point:P-minus')
    else: text(g,px+8,py-10,'P+(2+√5,3+√5)','small','start','point:P-plus')
text(g,35,438,'P+ is the far intersection on the outward perpendicular','small',owner='selected-extremum:P-plus')
text(g,520,132,'AB: x + y − 1 = 0','note')
text(g,520,174,'C = (2,3),  r = √10','note')
text(g,520,216,'CP+ ⟂ AB','value',owner='perpendicular:CP-plus-to-AB')
text(g,520,258,'P+ maximizes the height','small',owner='selected-extremum:P-plus')
text(g,520,310,'Tangent at P+:','note',owner='tangent-at-P-plus')
text(g,520,338,'x + y − 5 − 2√5 = 0','small',owner='tangent-at-P-plus')
text(g,520,390,'a + b + c = −6','strong',owner='requested-result')
write(15,r,[{'panel':'circle-chord-tangent','originX':250,'originY':370,'sx':34,'sy':34,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q17: true-scale quadrilateral with two area regions and a compact minimization key
r,fh=make_svg(17,760,460,'넓이비와 최소 PQ','P and Q divide opposite sides; the area ratio fixes s+t, then PQ² is minimized at s=t.','MINIMAL_EXAM_DIAGRAM',math_geometry=True,hybrid=True)
m=(170,360,80,80); g=group(r,'quadrilateral-cut',m)
text(g,35,52,'사각형을 가르는 선분 PQ','title')
A=(0,2); B=(1,0); C=(3,1); D=(2,3); P=(F(2,3),F(2,3)); Q=(F(8,3),F(5,3))
# Region APQD hatch is beneath the shape boundaries.
poly(g,[A,P,Q,D],fill='#f7f7f7',stroke='none',width=0,owner='region:APQD',pattern=True,model=m,qid=17)
poly(g,[P,B,C,Q],fill='#fff',stroke='none',width=0,owner='region:PBCQ',model=m,qid=17)
poly(g,[A,B,C,D],fill='none',stroke='#111',width=2.05,owner='quadrilateral:ABCD',model=m,qid=17)
line(g,xy(m,P),xy(m,Q),'shape',owner='transversal:P-Q')
for label,pt,exact in [('A',A,('0','2')),('B',B,('1','0')),('C',C,('3','1')),('D',D,('2','3')),('P',P,('2/3','2/3')),('Q',Q,('8/3','5/3'))]:
    px,py,_=cpoint(g,m,label,pt,2,True,exact)
    places={'A':(px-12,py-8,'end'),'B':(px-5,py+24,'middle'),'C':(px+11,py+8,'start'),'D':(px,py-16,'middle'),'P':(px-8,py+22,'end'),'Q':(px+12,py-11,'start')}
    tx,ty,an=places[label]
    shown={'A':'A(0,2)','B':'B(1,0)','C':'C(3,1)','D':'D(2,3)','P':'P(2/3,2/3)','Q':'Q(8/3,5/3)'}[label]
    text(g,tx,ty,shown,'small' if label in ('P','Q') else 'label',an,'point:'+label)
text(g,260,187,'APQD: 10/3','small','middle','region:APQD')
text(g,310,305,'PBCQ: 5/3','small','middle','region:PBCQ')
text(g,500,104,'Area ratio = 2:1','value',owner='regions:APQD-to-PBCQ')
text(g,500,148,'s + t = 4/3','note')
text(g,500,194,'PQ² = 5 + 5(s − t)²','note')
text(g,500,230,'minimum at s = t = 2/3','note')
text(g,500,278,'m = 1/2,  n = 1/3','note')
text(g,500,322,'30(m+n) = 25','strong')
write(17,r,[{'panel':'quadrilateral-cut','originX':170,'originY':360,'sx':80,'sy':80,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q18: transformation path and signed parallel-distance choices in separate panels
r,fh=make_svg(18,940,500,'중심을 옮긴 뒤 두 평행선 중 선택','The transformed center is C(3,1); two parallel lines are at distance √5, and only y-intercept 2 is positive.','COMPOSITE_PANEL',math_geometry=True,hybrid=True)
g=group(r,'composite-transformation-distance')
panel(g,35,78,385,390,'① 중심의 평행이동과 대칭')
panel(g,450,78,455,390,'② 거리 √5인 두 평행선')
m1=(220,300,45,45); p1=group(g,'center-transformations',m1)
C0=(-2,1); C1=(1,3); C18=(3,1)
line(p1,xy(m1,C0),xy(m1,C1),'secondary',owner='translation:+3,+2',arrow=True)
line(p1,xy(m1,C1),xy(m1,C18),'secondary',owner='reflection:y=x',arrow=True,dash='5 3')
line(p1,xy(m1,(-2,-2)),xy(m1,(4,4)),'aux',owner='reflection-axis:y=x',dash='4 4')
for label,pt,exact in [('C0',C0,('-2','1')),('C1',C1,('1','3')),('C',C18,('3','1'))]:
    px,py,_=cpoint(p1,m1,label,pt,2,True,exact)
    shown={'C0':'C0(−2,1)','C1':'C1(1,3)','C':'C(3,1)'}[label]
    
    if label=='C0': text(p1,px-8,py-8,shown,'small','end','point:'+label)
    else: text(p1,px+8,py-8,shown,'small','start','point:'+label)
text(p1,62,425,'(+3,+2)  →  좌표를 서로 바꿈','small',owner='center-transformations:C0-C1-C')
m2=(680,260,30,30); p2=group(g,'signed-parallel-lines',m2)
C=(3,1); H=(2,3); J=(4,-1); Yp=(0,2); Ym=(0,-3)
# line segments for the two parallel alternatives and perpendicular source line.
line(p2,xy(m2,(-.5,1.75)),xy(m2,(5,4.5)),'shape',owner='positive-intercept-line',equation='x-2y+4=0')
line(p2,xy(m2,Ym),xy(m2,(5,-.5)),'secondary',owner='negative-intercept-line',equation='x-2y-6=0')
line(p2,xy(m2,(2.5,4)),xy(m2,(4.5,0)),'aux',owner='given-perpendicular-line',equation='2x+y-9=0')
line(p2,xy(m2,C),xy(m2,H),'aux',owner='normal:CH',dash='4 3')
line(p2,xy(m2,C),xy(m2,J),'aux',owner='normal:CJ',dash='4 3')
for label,pt,exact in [('C',C,('3','1')),('H',H,('2','3')),('J',J,('4','-1')),('Y+',Yp,('0','2')),('Y-',Ym,('0','-3'))]:
    px,py,_=cpoint(p2,m2,label,pt,2,True,exact)
    offset={'C':(8,-9,'start'),'H':(-18,-12,'end'),'J':(7,17,'start'),'Y+':(-12,-8,'end'),'Y-':(-12,18,'end')}[label]
    text(p2,px+offset[0],py+offset[1],{'Y+':'2','Y-':'−3'}.get(label,label),'small',offset[2],'point:'+label)
text(g,465,430,'양의 y절편을 선택하면 2','strong',owner='positive-y-intercept')
write(18,r,[{'panel':'center-transformations','originX':220,'originY':300,'sx':45,'sy':45,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'},{'panel':'signed-parallel-lines','originX':680,'originY':260,'sx':30,'sy':30,'formula':'screenX=originX+sx*x;screenY=originY-sy*y'}],meta)

# q20: final interval structure and maximal open length-2 window
r,fh=make_svg(20,700,360,'g(t)=2인 두 구간과 길이 2의 창','Open intervals (3,8) and (8,12) split at the tangent value t=8; the rightmost length-two window ends at 12.','MINIMAL_EXAM_DIAGRAM',math_geometry=False)
r.attrib.update({'data-graph-style-version':'AP_GRAPH_PRINT_V1_1_DRAFT','data-graph-preset':'SOLUTION_GRAPH','data-visual-family':'NUMBER_LINE_INTERVALS'})
g=group(r,'g-of-t-intervals')
g.attrib.update({'data-domain-origin-x':'60','data-domain-scale':'40','data-numberline-y':'148'})
text(g,40,54,'g(t) = 2인 구간','title')
text(g,40,82,'(3,8)  ∪  (8,12)','value',owner='interval:g(t)=2')
x0,scale,y=60,40,148
line(g,(x0,y),(x0+14*scale,y),'axis',owner='t-number-line')
for t in range(0,15,2):
    x=x0+t*scale
    line(g,(x,y-5),(x,y+5),'secondary',owner=f'tick:{t}')
    text(g,x,y+25,str(t),'small','middle',owner=f'tick-label:{t}')
for a,b in [(3,8),(8,12)]:
    xa=x0+a*scale; xb=x0+b*scale
    line(g,(xa+5,y),(xb-5,y),'shape',owner=f'g(t)=2 on ({a},{b})')
for t in (3,8,12):
    x=x0+t*scale
    ET.SubElement(g,NS+'circle',{'cx':n(x),'cy':n(y),'r':'4.5','fill':'#fff','stroke':'#111','stroke-width':'1.7','data-interval-endpoint':'open','data-t':str(t),'data-layer':'Z70_POINT'})
for t,label in [(3,'t=3'),(8,'t=8, g=1'),(12,'t=12')]:
    text(g,x0+t*scale,y-19,label,'small','middle',owner=f'boundary:{t}')
text(g,40,222,'길이 2의 열린구간 (a−2,a)','note')
ya=266; xa=x0+10*scale; xb=x0+12*scale
line(g,(xa,ya),(xb,ya),'secondary',owner='maximal-window-(10,12)')
for t in (10,12): ET.SubElement(g,NS+'circle',{'cx':n(x0+t*scale),'cy':n(ya),'r':'4.5','fill':'#fff','stroke':'#111','stroke-width':'1.5','data-interval-endpoint':'open','data-t':str(t),'data-layer':'Z70_POINT'})
text(g,(xa+xb)/2,ya+29,'(10,12)','note','middle','window:10-12')
text(g,630,310,'a = 12','strong','end')
write(20,r,[],meta)

manifest={'target':SPECS['target'],'targetSha256':SPECS['targetSha256'],'candidateCount':len(meta),'constructionReferencePolicy':'Existing Geumdang solution SVGs were audited only after facts were frozen; builder read no existing target SVG bytes. Candidate source is independent_math_facts.json + visual_specs.json.','actualBrowserRender':'NOT_RUN_BROWSER_POLICY_BLOCK','overallQualification':'PRINT95_RENDER_PENDING','candidates':meta}
(EVID/'candidate_geometry_models.json').write_text(json.dumps({'models':[{'qid':x['qid'],'path':x['path'],'coordinateModels':x['coordinateModels']} for x in meta]},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(EVID/'candidate_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'candidateCount':len(meta),'paths':[x['path'] for x in meta],'hashes':[{'qid':x['qid'],'sha256':x['sha256']} for x in meta]},ensure_ascii=False,indent=2))
