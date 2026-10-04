from __future__ import annotations
import json, math, re, xml.etree.ElementTree as ET
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8',errors='replace')
ET.register_namespace('', 'http://www.w3.org/2000/svg')
ROOT=Path('.')
SVG='http://www.w3.org/2000/svg'
COL={'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}
STROKE='#25344a'; AUX='#64748b'; TEXTFONT='Arial, "Malgun Gothic", sans-serif'
results=[]
def el(parent,tag,attrs): return ET.SubElement(parent,f'{{{SVG}}}{tag}',{k:str(v) for k,v in attrs.items() if v is not None})
def segname(a,b):return f'{a}-{b}'
def fresh(exam,qid,w,h,title):
 root=ET.Element(f'{{{SVG}}}svg',{'viewBox':f'0 0 {w} {h}','width':str(w),'height':str(h),'role':'img','aria-labelledby':f'q{qid}-title','aria-label':title})
 el(root,'title',{'id':f'q{qid}-title'}).text=title
 el(root,'desc',{'id':f'q{qid}-desc'}).text=title+'의 풀이에 필요한 조건과 보조 구조를 나타낸다.'
 el(root,'rect',{'id':f'q{qid}-background','x':0,'y':0,'width':w,'height':h,'fill':'#fff'})
 return root

def line(root,a,b,an,bn,role='GIVEN',width=2.7,dash=None):
 attrs={'id':f'seg-{an}-{bn}','x1':f'{a[0]:.3f}','y1':f'{a[1]:.3f}','x2':f'{b[0]:.3f}','y2':f'{b[1]:.3f}','stroke':COL.get(role,STROKE),'stroke-width':width,'stroke-linecap':'round','data-segment-pair':segname(an,bn),'data-start-point':an,'data-end-point':bn,'data-fact-role':role}
 if dash:attrs['stroke-dasharray']=dash
 el(root,'line',attrs)

def rawline(root,a,b,id,role='DERIVED_INTERMEDIATE',width=2.2,dash=None):
 attrs={'id':id,'x1':f'{a[0]:.3f}','y1':f'{a[1]:.3f}','x2':f'{b[0]:.3f}','y2':f'{b[1]:.3f}','stroke':COL.get(role,AUX),'stroke-width':width,'stroke-linecap':'round','data-fact-role':role}
 if dash:attrs['stroke-dasharray']=dash
 el(root,'line',attrs)

def polygon(root,pts,id,fill,stroke='none',role='GIVEN'):
 el(root,'polygon',{'id':id,'points':' '.join(f'{x:.3f},{y:.3f}' for x,y in pts),'fill':fill,'stroke':stroke,'stroke-width':2,'data-owner-region':id,'data-fact-role':role})

def polyline(root,pts,id,role='DERIVED_INTERMEDIATE',width=1.8,marker=None,owner_vertex=None,owner_rays=None):
 attrs={'id':id,'points':' '.join(f'{x:.3f},{y:.3f}' for x,y in pts),'fill':'none','stroke':COL[role],'stroke-width':width,'stroke-linecap':'round','data-fact-role':role}
 if marker:attrs['data-marker-kind']=marker
 if owner_vertex:attrs['data-owner-vertex']=owner_vertex
 if owner_rays:attrs['data-owner-rays']=' '.join(owner_rays)
 el(root,'polyline',attrs)

def circle(root,c,r,id,fill='none',role='GIVEN',width=2.5):
 el(root,'circle',{'id':id,'cx':f'{c[0]:.3f}','cy':f'{c[1]:.3f}','r':f'{r:.3f}','fill':fill,'stroke':COL.get(role,STROKE) if fill=='none' else 'none','stroke-width':width,'data-fact-role':role})

def pt(root,name,p,dx=0,dy=-18,role='GIVEN'):
 el(root,'circle',{'id':f'point-{name}','cx':f'{p[0]:.3f}','cy':f'{p[1]:.3f}','r':3.1,'fill':STROKE,'data-marker-kind':'point','data-owner-point':name,'data-point-x':f'{p[0]:.6f}','data-point-y':f'{p[1]:.6f}','data-fact-role':role})
 t=el(root,'text',{'id':f'label-point-{name}','x':f'{p[0]+dx:.3f}','y':f'{p[1]+dy:.3f}','text-anchor':'middle','dominant-baseline':'middle','font-size':24,'font-family':TEXTFONT,'font-weight':700,'fill':COL[role],'data-label-kind':'point','data-owner-point':name,'data-point-x':f'{p[0]:.6f}','data-point-y':f'{p[1]:.6f}','data-fact-role':role});t.text=name

def text(root,label,x,y,id,role='DERIVED_INTERMEDIATE',size=22,anchor='middle',baseline='middle',attrs=None):
 size=max(size,24)
 a={'id':id,'x':f'{x:.3f}','y':f'{y:.3f}','text-anchor':anchor,'dominant-baseline':baseline,'font-size':size,'font-family':TEXTFONT,'fill':COL[role],'data-fact-role':role}
 if attrs:a.update(attrs)
 t=el(root,'text',a);t.text=label;return t

def length(root,label,a,b,an,bn,id,role='DERIVED_INTERMEDIATE',side=1,size=22,offset=22):
 dx=b[0]-a[0];dy=b[1]-a[1];L=math.hypot(dx,dy);nx=-dy/L;ny=dx/L
 mid=((a[0]+b[0])/2+nx*side*offset,(a[1]+b[1])/2+ny*side*offset)
 deg=math.degrees(math.atan2(dy,dx));deg=((deg+90)%180)-90
 t=text(root,label,mid[0],mid[1],id,role,size,attrs={'data-label-kind':'length','data-owner-segment':segname(an,bn),'data-owner-start-point':an,'data-owner-end-point':bn,'data-label-id':id,'transform':f'rotate({deg:.3f} {mid[0]:.3f} {mid[1]:.3f})' if abs(deg)>.2 else None})
 return t

def dimension(root,label,a,b,an,bn,id,role='DERIVED_INTERMEDIATE',side=1,size=22,offset=26):
 dx=b[0]-a[0];dy=b[1]-a[1];L=math.hypot(dx,dy);tx=dx/L;ty=dy/L;nx=-ty;ny=tx
 p=(a[0]+nx*side*offset,a[1]+ny*side*offset);q=(b[0]+nx*side*offset,b[1]+ny*side*offset)
 rawline(root,p,q,'dim-'+id,role,1.6)
 for k,v in enumerate((p,q)):
  c=(v[0]-nx*6,v[1]-ny*6);d=(v[0]+nx*6,v[1]+ny*6)
  rawline(root,c,d,f'dim-{id}-cap{k+1}',role,1.6)
 clearance=max(size,24)*.65+7
 mid=((a[0]+b[0])/2+nx*side*(offset+clearance),(a[1]+b[1])/2+ny*side*(offset+clearance))
 ang=math.degrees(math.atan2(dy,dx));ang=((ang+90)%180)-90
 text(root,label,mid[0],mid[1],id,role,size,attrs={'data-label-kind':'length','data-owner-segment':segname(an,bn),'data-owner-start-point':an,'data-owner-end-point':bn,'data-owner-dimension':'dim-'+id,'data-label-id':id,'transform':f'rotate({ang:.3f} {mid[0]:.3f} {mid[1]:.3f})' if abs(ang)>.2 else None})

def angle(root,v,ray1,ray2,n1,n2,measure,id,role='DERIVED_INTERMEDIATE',radius=20,labelRadius=43):
 a=math.atan2(ray1[1]-v[1],ray1[0]-v[0]);b=math.atan2(ray2[1]-v[1],ray2[0]-v[0]);delta=(b-a)%(2*math.pi)
 if delta>math.pi:a,b=b,a;delta=2*math.pi-delta;n1,n2=n2,n1
 pts=[]
 for i in range(25):
  t=i/24;z=a+delta*t;pts.append((v[0]+radius*math.cos(z),v[1]+radius*math.sin(z)))
 polyline(root,pts,f'angle-arc-{id}',role,1.9,'angle-arc',id.split('-')[0],(f'{id.split("-")[0]}-{n1}',f'{id.split("-")[0]}-{n2}'))
 mid=a+delta/2;labelRadius=max(labelRadius,max(len(measure)*24*.52,24)/(2*max(.12,math.sin(delta/2)))+24*.35);lab=(v[0]+labelRadius*math.cos(mid),v[1]+labelRadius*math.sin(mid))
 text(root,measure,lab[0],lab[1],id,role,22,attrs={'data-label-kind':'angle','data-owner-vertex':id.split('-')[0],'data-owner-rays':f'{id.split("-")[0]}-{n1} {id.split("-")[0]}-{n2}','data-label-id':id})

def right(root,v,r1,r2,vertex,n1,n2,id,role='DERIVED_INTERMEDIATE',size=12):
 a=(r1[0]-v[0],r1[1]-v[1]);b=(r2[0]-v[0],r2[1]-v[1]);la=math.hypot(*a);lb=math.hypot(*b);a=(a[0]/la,a[1]/la);b=(b[0]/lb,b[1]/lb)
 pts=[(v[0]+a[0]*size,v[1]+a[1]*size),(v[0]+(a[0]+b[0])*size,v[1]+(a[1]+b[1])*size),(v[0]+b[0]*size,v[1]+b[1]*size)]
 polyline(root,pts,f'right-angle-{id}',role,1.8,'right-angle-square',vertex,(f'{vertex}-{n1}',f'{vertex}-{n2}'))

def tick(root,a,b,an,bn,id,role='DERIVED_INTERMEDIATE',count=1):
 dx=b[0]-a[0];dy=b[1]-a[1];L=math.hypot(dx,dy);tx=dx/L;ty=dy/L;nx=-ty;ny=tx
 mid=((a[0]+b[0])/2,(a[1]+b[1])/2)
 for k in range(count):
  shift=(k-(count-1)/2)*6;c=(mid[0]+tx*shift,mid[1]+ty*shift);p=(c[0]-nx*7,c[1]-ny*7);q=(c[0]+nx*7,c[1]+ny*7)
  rawline(root,p,q,f'equal-{id}-{k+1}',role,1.8)
  root[-1].set('data-marker-kind','congruent-tick');root[-1].set('data-owner-segment',segname(an,bn))

def arrow(root,a,b,id,role='GIVEN'):
 rawline(root,a,b,id,role,2.2)
 dx=b[0]-a[0];dy=b[1]-a[1];L=math.hypot(dx,dy);ux=dx/L;uy=dy/L
 pts=[b,(b[0]-ux*12-uy*5,b[1]-uy*12+ux*5),(b[0]-ux*12+uy*5,b[1]-uy*12-ux*5)]
 el(root,'polygon',{'id':id+'-arrow','points':' '.join(f'{x:.2f},{y:.2f}' for x,y in pts),'fill':COL.get(role,STROKE),'stroke':'none','data-fact-role':role})

def finish(root,folder,qid,calc):
 settle_point_labels(root)
 ET.indent(root,space='  ');p=ROOT/'archive/assets/images'/folder/f'q{qid}-solution.svg';p.parent.mkdir(parents=True,exist_ok=True);ET.ElementTree(root).write(p,encoding='utf-8',xml_declaration=False)
 results.append({'qid':qid,'path':p.as_posix(),'viewBox':root.get('viewBox'),'pythonInputs':calc[0],'pythonCalculatedOutputs':calc[1]})

def box_overlap(a,b,pad=0):
    return a['x']-pad<b['x']+b['width'] and b['x']-pad<a['x']+a['width'] and a['y']-pad<b['y']+b['height'] and b['y']-pad<a['y']+a['height']

def seg_box_hit(a,b,box,pad=1.0):
    x1=box['x']-pad;x2=box['x']+box['width']+pad;y1=box['y']-pad;y2=box['y']+box['height']+pad
    dx=b[0]-a[0];dy=b[1]-a[1];p=(-dx,dx,-dy,dy);q=(a[0]-x1,x2-a[0],a[1]-y1,y2-a[1]);lo=0.;hi=1.
    for pp,qq in zip(p,q):
        if abs(pp)<1e-10:
            if qq<0:return False
        else:
            t=qq/pp
            if pp<0:lo=max(lo,t)
            else:hi=min(hi,t)
            if lo>hi:return False
    return True

def settle_point_labels(root):
    points={};labels=[];edges=[]
    for e in root.iter():
        kind=e.tag.rsplit('}',1)[-1]
        if kind=='circle' and e.get('data-owner-point') and e.get('cx'):
            points[e.get('data-owner-point')]=(float(e.get('cx')),float(e.get('cy')))
        if kind=='line':edges.append(((float(e.get('x1')),float(e.get('y1'))),(float(e.get('x2')),float(e.get('y2'))),e))
        elif kind in ('polyline','polygon'):
            vals=[float(z) for z in re.split(r'[ ,]+',e.get('points','').strip()) if z];pts=list(zip(vals[::2],vals[1::2]));edges.extend((a,b,e) for a,b in zip(pts,pts[1:]))
            if kind=='polygon' and len(pts)>2:edges.append((pts[-1],pts[0],e))
        elif kind=='text' and e.get('data-label-kind')=='point':labels.append(e)
    if not labels:return
    fixed=[]
    for e in root.iter():
        if e.tag.rsplit('}',1)[-1]!='text' or e.get('data-label-kind')=='point':continue
        s=''.join(e.itertext()).strip();fs=float(e.get('font-size') or 24);w=max(fs*.6,len(s)*fs*.52)
        try:x=float(e.get('x'));y=float(e.get('y'))
        except:continue
        if e.get('text-anchor')=='middle':cx=x
        elif e.get('text-anchor')=='end':cx=x-w/2
        else:cx=x+w/2
        cy=y if e.get('dominant-baseline') in ('middle','central') else y-fs*.3
        fixed.append({'x':cx-w/2,'y':cy-fs*.52,'width':w,'height':fs*1.04})
    svgpts=[]
    for a,b,e in edges:svgpts.append((a,b,float(e.get('stroke-width') or 1)/2+1))
    # Visible marker circles remain real geometry during label placement.
    circles=[e for e in root.iter() if e.tag.rsplit('}',1)[-1]=='circle' and e.get('data-marker-kind')]
    for elab in labels:
        name=elab.get('data-owner-point');p=points.get(name)
        if not p:continue
        try:fs=float(elab.get('font-size') or 24);oldx=float(elab.get('x'));oldy=float(elab.get('y'))
        except:continue
        s=''.join(elab.itertext()).strip();w=max(fs*.6,len(s)*fs*.52);h=fs*1.04
        neigh=[]
        for a,b,e in edges:
            if math.dist(p,a)<1.2:u=b
            elif math.dist(p,b)<1.2:u=a
            else:continue
            z=math.atan2(u[1]-p[1],u[0]-p[0])%(2*math.pi)
            if all(abs((z-v+math.pi)%(2*math.pi)-math.pi)>.05 for v in neigh):neigh.append(z)
        if neigh:
            angles=sorted(neigh);gaps=[]
            for i,a in enumerate(angles):
                b=angles[(i+1)%len(angles)]+(2*math.pi if i==len(angles)-1 else 0);gaps.append(((a+b)/2%(2*math.pi),b-a))
            dirs=[a for a,_ in sorted(gaps,key=lambda x:x[1],reverse=True)]
        else:
            oldc=(oldx,oldy);dirs=[math.atan2(oldc[1]-p[1],oldc[0]-p[0])]
        candidates=[]
        for z in dirs:
            for rad in (fs*.95,fs*1.3,fs*1.7,fs*2.2,fs*2.8):
                c=(p[0]+rad*math.cos(z),p[1]+rad*math.sin(z));box={'x':c[0]-w/2,'y':c[1]-h/2,'width':w,'height':h}
                hits=sum(1 for a,b,pad in svgpts if seg_box_hit(a,b,box,pad))
                hits+=sum(1 for circ in circles if math.hypot(max(box['x']-float(circ.get('cx')),0,float(circ.get('cx'))-box['x']-box['width']),max(box['y']-float(circ.get('cy')),0,float(circ.get('cy'))-box['y']-box['height']))<float(circ.get('r') or 0)+1)
                thits=sum(1 for b in fixed if box_overlap(box,b,2))
                penalty=hits*2000+thits*1000+math.dist(c,(oldx,oldy))*0.2+rad*.15
                candidates.append((penalty,c,box))
        _,c,box=min(candidates,key=lambda x:x[0]);elab.set('x',f'{c[0]:.2f}');elab.set('y',f'{c[1]:.2f}');elab.set('text-anchor','middle');elab.set('dominant-baseline','middle')
        fixed.append(box)

def build_sinh_q7():
 q=7;r=fresh('shin',q,560,440,'직선의 기울기와 각 a')
 origin=(310,350);A=(110,350);O=origin;Y=(310,250);Q=(160,350);P=(160,325);B=Y
 arrow(r,(40,350),(520,350),'x-axis');arrow(r,(310,405),(310,65),'y-axis')
 line(r,A,B,'A','B','GIVEN',2.8)
 line(r,A,Q,'A','Q','DERIVED_INTERMEDIATE',2.2)
 line(r,Q,P,'Q','P','DERIVED_INTERMEDIATE',2.2)
 line(r,A,P,'A','P','DERIVED_INTERMEDIATE',2.2)
 right(r,Q,A,P,'Q','A','P','slope-right')
 # no point labels for construction foot Q's relation to x-axis duplicates the axis
 for n,p,dx,dy in [('A',A,-4,27),('O',O,0,24),('B',B,18,-10)]:pt(r,n,p,dx,dy,'GIVEN' if n=='O' else 'DERIVED_INTERMEDIATE')
 for label in r.iter():
  if label.get('id')=='label-point-A':label.text='A(−8,0)';label.set('x','98');label.set('y','389')
  if label.get('id')=='label-point-B':label.text='B(0,4)';label.set('x','375');label.set('y','230')
 rawline(r,B,(333,242),'leader-point-B','GIVEN',1.2,'3 3')
 angle(r,A,P,Q,'P','Q','a','A-angle-a','DERIVED_INTERMEDIATE',18,39)
 length(r,'2',A,Q,'A','Q','A-Q-run','DERIVED_INTERMEDIATE',1,22,24)
 length(r,'1',Q,P,'Q','P','Q-P-rise','DERIVED_INTERMEDIATE',1,22,20)
 length(r,'√5',A,P,'A','P','A-P-hyp','DERIVED_INTERMEDIATE',-1,22,24)
 # Prevent point-name duplicates from overlapping coordinate labels: point labels remain small and adjacent.
 polygon(r,[(164,411),(456,411),(456,463),(164,463)],'result-panel','#fff7ed','#b45309','CONCLUSION')
 text(r,'sin a + cos a = 3√5/5',310,438,'answer-q7','CONCLUSION',23,attrs={'data-label-kind':'region','data-owner-region':'result-panel'})
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'line':'y=x/2+4','run':2,'rise':1,'scale':25},{'x-intercept':[-8,0],'y-intercept':[0,4],'hypotenuse':'√5','sine+cosine':'3√5/5'}))

def build_shin_q8():
 q=8;r=fresh('shin',q,500,480,'A에서 BC에 내린 높이와 두 직각삼각형')
 B=(75,365);H=(145,365);A=(145,243.756);C=(316.464,365)
 line(r,A,B,'A','B','GIVEN');line(r,A,C,'A','C','GIVEN');line(r,B,H,'B','H','GIVEN');line(r,H,C,'H','C','GIVEN');line(r,A,H,'A','H','DERIVED_INTERMEDIATE',2.5)
 right(r,H,A,B,'H','A','B','altitude-square')
 for n,p,dx,dy,role in [('A',A,0,-22,'GIVEN'),('B',B,-15,18,'GIVEN'),('H',H,20,-18,'DERIVED_INTERMEDIATE'),('C',C,15,18,'GIVEN')]:pt(r,n,p,dx,dy,role)
 angle(r,B,A,C,'A','C','60°','B-angle-60','GIVEN',17,41)
 length(r,'AB=4',A,B,'A','B','AB-given','GIVEN',-1,23,23)
 length(r,'AC=6',A,C,'A','C','AC-given','GIVEN',1,23,23)
 length(r,'BH=2',B,H,'B','H','BH-derived','DERIVED_INTERMEDIATE',1,22,18)
 length(r,'AH=2√3',A,H,'A','H','AH-derived','DERIVED_INTERMEDIATE',1,22,24)
 dimension(r,'HC=2√6',H,C,'H','C','HC-derived','DERIVED_INTERMEDIATE',1,22,28)
 dimension(r,'BC=2+2√6',B,C,'B','C','BC-conclusion','CONCLUSION',1,22,34)
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'AB':4,'AC':6,'angleB_deg':60,'scale':35},{'BH':2,'AH':'2√3','HC':'2√6','BC':'2+2√6'}))

def build_shin_q11():
 q=11;r=fresh('shin',q,560,500,'이등변삼각형과 보조 작도')
 # Panel 1: the source isosceles triangle; panel 2: the auxiliary construction.
 side=5+5*math.sqrt(3);base=5*math.sqrt(2);half=base/2;height=math.sqrt(side*side-half*half);scale=17
 A=(130,75.73);B=(130-half*scale,300);C=(130+half*scale,300)
 line(r,A,B,'A','B','GIVEN');line(r,A,C,'A','C','GIVEN');line(r,B,C,'B','C','GIVEN')
 for n,p,dx,dy,role in [('A',A,0,-21,'GIVEN'),('B',B,-16,12,'GIVEN'),('C',C,16,12,'GIVEN')]:pt(r,n,p,dx,dy,role)
 angle(r,A,B,C,'B','C','30°','A-30','DERIVED_INTERMEDIATE',14,38)
 angle(r,B,A,C,'A','C','75°','B-75','GIVEN',14,42)
 angle(r,C,B,A,'B','A','75°','C-75','DERIVED_INTERMEDIATE',14,42)
 tick(r,A,B,'A','B','isosceles-AB','GIVEN');tick(r,A,C,'A','C','isosceles-AC','GIVEN')
 dimension(r,'BC=5√2',B,C,'B','C','BC-given','GIVEN',1,22,31)
 rawline(r,(270,52),(270,452),'panel-divider-q11','DERIVED_INTERMEDIATE',1.3,'5 5')
 A2=(410,70);D2=(410,70+height*17);B2=(410-half*17,D2[1]);E2=(410,D2[1]-half*17)
 v=(E2[0]-B2[0],E2[1]-B2[1]);t=((A2[0]-B2[0])*v[0]+(A2[1]-B2[1])*v[1])/(v[0]*v[0]+v[1]*v[1]);F2=(B2[0]+t*v[0],B2[1]+t*v[1])
 line(r,A2,B2,'A2','B2','DERIVED_INTERMEDIATE');line(r,A2,D2,'A2','D2','DERIVED_INTERMEDIATE');line(r,B2,D2,'B2','D2','DERIVED_INTERMEDIATE')
 line(r,D2,E2,'D2','E2','DERIVED_INTERMEDIATE');line(r,B2,E2,'B2','E2','DERIVED_INTERMEDIATE');line(r,E2,F2,'E2','F2','DERIVED_INTERMEDIATE');line(r,A2,F2,'A2','F2','DERIVED_INTERMEDIATE')
 right(r,D2,A2,B2,'D2','A2','B2','altitude-square-q11');right(r,F2,A2,E2,'F2','A2','E2','AF-perp-BE-q11')
 for n,p,dx,dy,role,display in [('A2',A2,0,-21,'DERIVED_INTERMEDIATE','A'),('B2',B2,-14,14,'DERIVED_INTERMEDIATE','B'),('D2',D2,0,19,'DERIVED_INTERMEDIATE','D'),('E2',E2,16,0,'DERIVED_INTERMEDIATE','E'),('F2',F2,16,0,'DERIVED_INTERMEDIATE','F')]:
  pt(r,n,p,dx,dy,role)
  for lbl in r.iter():
   if lbl.get('id')==f'label-point-{n}':lbl.text=display;lbl.set('data-source-label',display)
 angle(r,B2,A2,E2,'A2','E2','30°','B2-30','DERIVED_INTERMEDIATE',14,38)
 tick(r,B2,D2,'B2','D2','equal-BD','DERIVED_INTERMEDIATE');tick(r,D2,E2,'D2','E2','equal-DE','DERIVED_INTERMEDIATE')
 length(r,'BE=5',B2,E2,'B2','E2','BE-derived-q11','DERIVED_INTERMEDIATE',-1,22,25)
 dimension(r,'AB=5+5√3',A2,B2,'A2','B2','AB-conclusion-q11','CONCLUSION',-1,22,26)
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'AB_equals_AC':True,'BC':'5√2','scale':17,'F_projection_t':t},{'A_angle_deg':30,'C_angle_deg':75,'BE':5,'AB':'5+5√3','AF_perpendicular_BE':True}))

def build_shin_q14():
 q=14;r=fresh('shin',q,560,470,'정삼각형 중심과 중선의 2:1 분할')
 A=(280,68);B=(176.077,248);C=(383.923,248);M=(280,248);O=(280,188)
 R=120
 circle(r,O,R,'circumcircle-O','none','GIVEN',2.2)
 line(r,A,B,'A','B','GIVEN');line(r,B,C,'B','C','GIVEN');line(r,C,A,'C','A','GIVEN')
 line(r,A,M,'A','M','DERIVED_INTERMEDIATE',2.2);line(r,O,A,'O','A','DERIVED_INTERMEDIATE',2.5);line(r,O,M,'O','M','DERIVED_INTERMEDIATE',2.2)
 # Exact perpendicular feet from O to the three sides are computed from the segment projection.
 def foot(P,X,Y):
  ux=Y[0]-X[0];uy=Y[1]-X[1];t=((P[0]-X[0])*ux+(P[1]-X[1])*uy)/(ux*ux+uy*uy);return (X[0]+t*ux,X[1]+t*uy)
 D=foot(O,A,B);E=foot(O,B,C);F=foot(O,C,A)
 for n,p in [('D',D),('E',E),('F',F)]:line(r,O,p,'O',n,'GIVEN',1.8)
 right(r,D,O,A,'D','O','A','foot-D');right(r,E,O,B,'E','O','B','foot-E');right(r,F,O,C,'F','O','C','foot-F')
 for n,p,dx,dy,role in [('A',A,0,-20,'GIVEN'),('B',B,-18,18,'GIVEN'),('C',C,18,18,'GIVEN'),('O',O,0,22,'GIVEN'),('D',D,-14,0,'GIVEN'),('E',E,0,19,'GIVEN'),('F',F,14,0,'GIVEN')]:pt(r,n,p,dx,dy,role)
 for label in r.iter():
  if label.get('id')=='label-point-E':label.text='M=E';label.set('x',f'{E[0]+14:.2f}');label.set('y',f'{E[1]+22:.2f}');label.set('data-owner-point-alias','M');label.set('data-fact-role','DERIVED_INTERMEDIATE');label.set('fill',COL['DERIVED_INTERMEDIATE'])
 dimension(r,'AB=4√3',A,B,'A','B','AB-given','GIVEN',-1,22,33)
 dimension(r,'AO=4',A,O,'A','O','AO-derived','DERIVED_INTERMEDIATE',-1,22,23)
 dimension(r,'OM=2',O,M,'O','M','OM-derived','DERIVED_INTERMEDIATE',1,22,23)
 tick(r,A,B,'A','B','side-ab','DERIVED_INTERMEDIATE');tick(r,B,C,'B','C','side-bc','DERIVED_INTERMEDIATE');tick(r,C,A,'C','A','side-ca','DERIVED_INTERMEDIATE')
 tick(r,O,D,'O','D','equal-radii-d','GIVEN');tick(r,O,E,'O','E','equal-radii-e','GIVEN');tick(r,O,F,'O','F','equal-radii-f','GIVEN')
 tick(r,B,M,'B','M','mid-bm','DERIVED_INTERMEDIATE');tick(r,M,C,'M','C','mid-mc','DERIVED_INTERMEDIATE')
 polygon(r,[(360,353),(535,353),(535,405),(360,405)],'area-result-q14','#fff7ed','#b45309','CONCLUSION')
 text(r,'넓이 16π',448,379,'area-result-q14-text','CONCLUSION',22,attrs={'data-label-kind':'region','data-owner-region':'circumcircle-O'})
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'side':'4√3','median':6,'centroidRatio':'2:1','scale':30},{'height':6,'AO':4,'OM':2,'area':'16π','feet':[D,E,F]}))

def build_shin_q18():
 q=18;r=fresh('shin',q,560,470,'직사각형 안 원의 접선 길이와 삼각형')
 A=(95,85);D=(395,85);C=(395,325);B=(95,325);O=(215,205);U=(215,85);V=(215,325);E=(295,325);T=(325.769,251.154)
 polygon(r,[D,E,C],'triangle-DEC-fill','#fff7ed','none','CONCLUSION')
 line(r,A,U,'A','U','GIVEN');line(r,U,D,'U','D','GIVEN');line(r,D,C,'D','C','GIVEN');line(r,C,E,'C','E','GIVEN');line(r,E,V,'E','V','GIVEN');line(r,V,B,'V','B','GIVEN');line(r,B,A,'B','A','GIVEN')
 circle(r,O,120,'incircle-O','none','GIVEN',2.7)
 line(r,O,U,'O','U','DERIVED_INTERMEDIATE',1.7);line(r,O,V,'O','V','DERIVED_INTERMEDIATE',1.7)
 line(r,D,T,'D','T','DERIVED_INTERMEDIATE',2.8);line(r,T,E,'T','E','DERIVED_INTERMEDIATE',2.8)
 right(r,C,D,B,'C','D','B','triangle-right-C')
 for n,p,dx,dy,role in [('A',A,-15,-15,'GIVEN'),('B',B,-15,18,'GIVEN'),('C',C,16,18,'GIVEN'),('D',D,18,-14,'GIVEN'),('E',E,18,20,'GIVEN'),('O',O,0,-20,'GIVEN'),('U',U,29,4,'DERIVED_INTERMEDIATE'),('V',V,0,24,'DERIVED_INTERMEDIATE'),('T',T,22,8,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 dimension(r,'AD=10',A,D,'A','D','AD-given','GIVEN',-1,22,26)
 dimension(r,'AB=8',A,B,'A','B','AB-given','GIVEN',-1,22,26)
 length(r,'OU=4',O,U,'O','U','radius-derived','DERIVED_INTERMEDIATE',1,21,20)
 length(r,'EC=10/3',E,C,'E','C','EC-derived','DERIVED_INTERMEDIATE',-1,21,22)
 tick(r,D,U,'D','U','tangent-DU','DERIVED_INTERMEDIATE');tick(r,D,T,'D','T','tangent-DT','DERIVED_INTERMEDIATE')
 tick(r,E,V,'E','V','tangent-EV','DERIVED_INTERMEDIATE');tick(r,E,T,'E','T','tangent-ET','DERIVED_INTERMEDIATE')
 # Shade the region owned by triangle DEC and keep its area in conclusion styling.
 polygon(r,[(350,398),(520,398),(520,452),(350,452)],'area-result-panel-q18','#fff7ed','#b45309','CONCLUSION')
 text(r,'[DEC]=40/3',435,425,'area-result-q18','CONCLUSION',23,attrs={'data-label-kind':'region','data-owner-region':'triangle-DEC-fill'})
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'rectangle':'10 by 8','radius':4,'scale':30,'D_tangent':6,'E_tangent':'8/3'},{'EC':'10/3','DE':'26/3','area_DEC':'40/3','tangency':T}))

def build_shin_q20():
 q=20;r=fresh('shin',q,560,500,'접선과 평행선을 이용한 닮음')
 A=(94.12,350);B=(405.88,350);O=(250,350);D=(94.12,260);E=(405.88,80);C=(172.06,215);F=(C[0],350);L=(94.12,215);R=(405.88,215)
 # Semicircle through the two base tangency points; its top contact C lies on DE.
 pts=[]
 for i in range(61):
  th=math.pi+math.pi*i/60;pts.append((O[0]+155.88*math.cos(th),O[1]+155.88*math.sin(th)))
 polyline(r,pts,'semicircle-O','GIVEN',2.7,'semicircle')
 line(r,A,L,'A','L','GIVEN');line(r,L,D,'L','D','GIVEN');line(r,B,R,'B','R','GIVEN');line(r,R,E,'R','E','GIVEN');line(r,D,C,'D','C','GIVEN',2.8);line(r,C,E,'C','E','GIVEN',2.8)
 line(r,A,F,'A','F','GIVEN');line(r,F,B,'F','B','GIVEN')
 line(r,C,F,'C','F','DERIVED_INTERMEDIATE',2.2)
 rawline(r,L,R,'parallel-through-C','DERIVED_INTERMEDIATE',2.2,'6 5')
 # Parallel chevrons are repeated on AB and the helper, never used as congruence marks.
 for y,id in [(350,'parallel-AB'),(215,'parallel-through-C')]:
  x=250;polyline(r,[(x-8,y-6),(x,y),(x+8,y-6)],id,'DERIVED_INTERMEDIATE',1.8,'parallel-mark')
 right(r,F,C,B,'F','C','B','foot-square')
 for n,p,dx,dy,role in [('A',A,-18,18,'GIVEN'),('B',B,18,18,'GIVEN'),('O',O,0,20,'GIVEN'),('D',D,-16,-13,'GIVEN'),('C',C,-4,-20,'GIVEN'),('E',E,18,-10,'GIVEN'),('F',F,0,22,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 for n,p in [('L',L),('R',R)]:el(r,'circle',{'id':f'point-{n}','cx':f'{p[0]:.2f}','cy':f'{p[1]:.2f}','r':2.6,'fill':STROKE,'data-marker-kind':'construction-point','data-owner-point':n,'data-point-x':f'{p[0]:.4f}','data-point-y':f'{p[1]:.4f}','data-fact-role':'DERIVED_INTERMEDIATE'})
 length(r,'DA=3',D,A,'D','A','DA-given','GIVEN',-1,21,19)
 length(r,'EB=9',E,B,'E','B','EB-given','GIVEN',1,21,20)
 length(r,'DC=3',D,C,'D','C','DC-derived','DERIVED_INTERMEDIATE',1,20,19)
 length(r,'CE=9',C,E,'C','E','CE-derived','DERIVED_INTERMEDIATE',-1,21,20)
 length(r,'DL=x−3',D,L,'D','L','DL-height','DERIVED_INTERMEDIATE',-1,19,19)
 length(r,'RE=9−x',R,E,'R','E','RE-height','DERIVED_INTERMEDIATE',1,19,20)
 dimension(r,'CF=9/2',C,F,'C','F','CF-conclusion','CONCLUSION',1,22,24)
 tick(r,D,A,'D','A','tangent-DA','GIVEN');tick(r,D,C,'D','C','tangent-DC','DERIVED_INTERMEDIATE')
 tick(r,E,B,'E','B','tangent-EB','GIVEN');tick(r,C,E,'C','E','tangent-CE','DERIVED_INTERMEDIATE')
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'DA':3,'EB':9,'DC_tangent':3,'CE_tangent':9,'scale':30},{'DC_over_CE':'1:3','CF':4.5,'parallel_helper':'L-C-R parallel AB'}))

def build_shin_q22():
 q=22;r=fresh('shin',q,560,470,'열기구 높이를 수선으로 분해')
 A=(90,355);B=(390,355);H=(280.193,355);h=(B[0]-A[0])*math.sqrt(3)/(1+math.sqrt(3));C=(H[0],355-h)
 line(r,A,H,'A','H','GIVEN');line(r,H,B,'H','B','GIVEN');line(r,A,C,'A','C','GIVEN');line(r,B,C,'B','C','GIVEN');line(r,C,H,'C','H','DERIVED_INTERMEDIATE',2.5)
 right(r,H,C,A,'H','C','A','height-square')
 for n,p,dx,dy,role in [('A',A,-15,18,'GIVEN'),('B',B,15,18,'GIVEN'),('C',C,0,-22,'GIVEN'),('H',H,0,21,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 angle(r,A,C,H,'C','H','45°','A-45','GIVEN',18,43)
 angle(r,B,C,A,'C','A','60°','B-60','GIVEN',18,43)
 dimension(r,'AB=50 m',A,B,'A','B','AB-given','GIVEN',1,22,27)
 length(r,'AH=h',A,H,'A','H','AH-derived','DERIVED_INTERMEDIATE',-1,21,22)
 length(r,'BH=h/√3',H,B,'H','B','BH-derived','DERIVED_INTERMEDIATE',-1,21,22)
 dimension(r,'CH=75−25√3 m',C,H,'C','H','CH-conclusion','CONCLUSION',1,21,28)
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'AB':50,'angleA_deg':45,'angleB_deg':60},{'AH_over_BH':'√3','height_m':'75−25√3'}))

def build_shin_q24():
 q=24;r=fresh('shin',q,560,500,'두 접선과 중심각으로 넓이 분해')
 P=(90,275);O=(354,275);rad=132;A=(288,160.69);B=(288,389.31)
 # Shade the tangent region outside the circular sector, following the minor arc from A to B.
 arcpts=[]
 for i in range(49):
  th=math.radians(-120-120*i/48);arcpts.append((O[0]+rad*math.cos(th),O[1]+rad*math.sin(th)))
 polygon(r,[P,A,*arcpts[1:-1],B],'shaded-tangent-segment','#fff7ed','none','CONCLUSION')
 circle(r,O,rad,'circle-O','none','GIVEN',2.7)
 line(r,P,A,'P','A','GIVEN');line(r,P,B,'P','B','GIVEN')
 line(r,O,A,'O','A','DERIVED_INTERMEDIATE');line(r,O,B,'O','B','DERIVED_INTERMEDIATE')
 # The two tangents make a 60 degree angle at P; the minor central angle is 120 degrees.
 right(r,A,P,O,'A','P','O','radius-tangent-A');right(r,B,P,O,'B','P','O','radius-tangent-B')
 for n,p,dx,dy,role in [('P',P,-15,0,'GIVEN'),('A',A,0,-20,'GIVEN'),('B',B,0,20,'GIVEN'),('O',O,20,0,'GIVEN')]:pt(r,n,p,dx,dy,role)
 angle(r,P,A,B,'A','B','60°','P-60','GIVEN',18,43)
 angle(r,O,A,B,'A','B','120°','O-120','DERIVED_INTERMEDIATE',20,47)
 length(r,'PA=6√3',P,A,'P','A','PA-given','GIVEN',-1,21,23)
 length(r,'PB=6√3',P,B,'P','B','PB-derived','DERIVED_INTERMEDIATE',1,21,23)
 length(r,'OA=6',O,A,'O','A','OA-derived','DERIVED_INTERMEDIATE',-1,21,23)
 length(r,'OB=6',O,B,'O','B','OB-derived','DERIVED_INTERMEDIATE',1,21,23)
 tick(r,P,A,'P','A','tangent-equal-PA','DERIVED_INTERMEDIATE');tick(r,P,B,'P','B','tangent-equal-PB','DERIVED_INTERMEDIATE')
 tick(r,O,A,'O','A','radii-equal-OA','GIVEN');tick(r,O,B,'O','B','radii-equal-OB','GIVEN')
 polygon(r,[(234,435),(526,435),(526,485),(234,485)],'answer-q24','#fff7ed','#b45309','CONCLUSION')
 text(r,'넓이 = 36√3−12π',380,460,'answer-q24-text','CONCLUSION',22,attrs={'data-label-kind':'region','data-owner-region':'shaded-tangent-segment'})
 finish(r,'25_신흥중_2학기_중간_중3_수학',q,({'PA':'6√3','angleAPB_deg':60,'scale':22},{'OA_OB':6,'angleAOB_deg':120,'shadedArea':'36√3−12π'}))

def build_yeon_q11():
 q=11;r=fresh('yeon',q,560,450,'밑변에 내린 높이로 넓이를 나타내기')
 B=(90,355);C=(390,355);A=(238.492,206.508);H=(A[0],355)
 line(r,A,B,'A','B','GIVEN');line(r,A,C,'A','C','GIVEN');line(r,B,C,'B','C','GIVEN');line(r,A,H,'A','H','DERIVED_INTERMEDIATE',2.4)
 right(r,H,A,B,'H','A','B','height-square')
 for n,p,dx,dy,role in [('A',A,0,-20,'GIVEN'),('B',B,-16,17,'GIVEN'),('C',C,17,17,'GIVEN'),('H',H,0,19,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 angle(r,B,A,H,'A','H','45°','B-45','GIVEN',18,42)
 length(r,'AB=7 cm',A,B,'A','B','AB-given','GIVEN',-1,22,24)
 dimension(r,'BC=10 cm',B,C,'B','C','BC-given','GIVEN',1,22,26)
 length(r,'AH=7√2/2',A,H,'A','H','AH-height','DERIVED_INTERMEDIATE',1,20,23)
 polygon(r,[(325,395),(528,395),(528,445),(325,445)],'area-answer-q11','#fff7ed','#b45309','CONCLUSION')
 text(r,'[ABC]=35√2/2',426,420,'area-answer-q11-text','CONCLUSION',22,attrs={'data-label-kind':'region','data-owner-region':'triangle-ABC'})
 finish(r,'25_연향중_2학기_중간_중3_수학',q,({'AB':7,'BC':10,'angleB_deg':45},{'AH':'7√2/2','area':'35√2/2'}))

def build_yeon_q12():
 q=12;r=fresh('yeon',q,560,490,'호의 비에서 중심각과 수선의 발까지')
 O=(280,275);rad=120;A=(280,155);B=(383.923,335);C=(176.077,335);M=((A[0]+B[0])/2,(A[1]+B[1])/2)
 circle(r,O,rad,'circle-O','none','GIVEN',2.7)
 line(r,A,M,'A','M','GIVEN');line(r,M,B,'M','B','GIVEN');line(r,B,C,'B','C','GIVEN');line(r,C,A,'C','A','GIVEN')
 line(r,O,A,'O','A','GIVEN');line(r,O,B,'O','B','GIVEN');line(r,O,C,'O','C','GIVEN')
 line(r,O,M,'O','M','DERIVED_INTERMEDIATE',2.5)
 right(r,M,O,A,'M','O','A','radius-perp-chord')
 tick(r,A,M,'A','M','chord-half-AM','DERIVED_INTERMEDIATE');tick(r,M,B,'M','B','chord-half-MB','DERIVED_INTERMEDIATE')
 for n,p,dx,dy,role in [('A',A,0,-20,'GIVEN'),('B',B,18,16,'GIVEN'),('C',C,-18,16,'GIVEN'),('O',O,0,20,'GIVEN'),('M',M,13,3,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 angle(r,O,A,B,'A','B','120°','O-120','DERIVED_INTERMEDIATE',18,42)
 angle(r,O,A,M,'A','M','60°','O-half-60','DERIVED_INTERMEDIATE',23,51)
 length(r,'OA=8 cm',O,A,'O','A','OA-given','GIVEN',-1,22,23)
 length(r,'OM=4',O,M,'O','M','OM-height','DERIVED_INTERMEDIATE',-1,22,22)
 dimension(r,'AB=8√3',A,B,'A','B','AB-derived','DERIVED_INTERMEDIATE',1,21,28)
 polygon(r,[(325,415),(527,415),(527,465),(325,465)],'area-answer-q12','#fff7ed','#b45309','CONCLUSION')
 text(r,'[ABO]=16√3',426,440,'area-answer-q12-text','CONCLUSION',22,attrs={'data-label-kind':'region','data-owner-region':'triangle-AOB'})
 finish(r,'25_연향중_2학기_중간_중3_수학',q,({'radius':8,'arcRatio':'3:4:2','scale':15},{'angleAOB_deg':120,'angleAOM_deg':60,'OM':4,'AM':'4√3','areaABO':'16√3'}))

def build_yeon_q16():
 q=16;r=fresh('yeon',q,560,455,'접는 선은 OP의 수직이등분선')
 O=(280,245);P=(280,125);M=(280,185);A=(176.077,185);B=(383.923,185);rad=120
 circle(r,O,rad,'circle-O','none','GIVEN',2.7)
 line(r,O,M,'O','M','DERIVED_INTERMEDIATE',2.7);line(r,M,P,'M','P','DERIVED_INTERMEDIATE',2.7)
 line(r,O,A,'O','A','DERIVED_INTERMEDIATE',1.8,'5 5');line(r,O,B,'O','B','DERIVED_INTERMEDIATE',1.8,'5 5')
 line(r,A,M,'A','M','DERIVED_INTERMEDIATE',2.8);line(r,M,B,'M','B','DERIVED_INTERMEDIATE',2.8)
 tick(r,O,M,'O','M','fold-OM','DERIVED_INTERMEDIATE');tick(r,M,P,'M','P','fold-MP','DERIVED_INTERMEDIATE')
 right(r,M,O,A,'M','O','A','fold-perp-square')
 for n,p,dx,dy,role in [('O',O,0,20,'GIVEN'),('P',P,0,-20,'DERIVED_INTERMEDIATE'),('A',A,-15,16,'GIVEN'),('B',B,15,16,'GIVEN'),('M',M,0,-19,'DERIVED_INTERMEDIATE')]:pt(r,n,p,dx,dy,role)
 length(r,'OP=4 cm',O,P,'O','P','OP-given','GIVEN',-1,22,22)
 length(r,'OM=2 cm',O,M,'O','M','OM-derived','DERIVED_INTERMEDIATE',1,22,19)
 dimension(r,'AB=4√3 cm',A,B,'A','B','AB-conclusion','CONCLUSION',1,22,27)
 finish(r,'25_연향중_2학기_중간_중3_수학',q,({'radius':4,'scale':30,'P_to_O_fold':True},{'OM':2,'OM_perp_AB':True,'M_midpoint_OP':True,'AB':'4√3'}))

for build in [build_sinh_q7,build_shin_q8,build_shin_q11,build_shin_q14,build_shin_q18,build_shin_q20,build_shin_q22,build_shin_q24,build_yeon_q11,build_yeon_q12,build_yeon_q16]:build()
EVID=Path('archive/evidence/visual-upgrade-2025-m3-batch2')
(EVID/'new_visual_build_evidence.json').write_text(json.dumps({'schemaVersion':'M3_VISUAL_UPGRADE_ADDITIONS_v1','assetCount':len(results),'assets':results},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'assetCount':len(results),'assets':results},ensure_ascii=False,indent=2))
