from __future__ import annotations
import importlib.util, json, math, hashlib
from pathlib import Path
from xml.etree import ElementTree as ET

stage=Path(__import__('os').environ['TEMP'])/'H1_SD48_BV1'
repo=Path(r'C:\Users\USER\.codex\worktrees\h1-source-drift48\AP------')
base=stage/'manifest-maesan23.jsonl'
base_rows=[json.loads(s) for s in base.read_text(encoding='utf-8').splitlines() if s.strip()]
modspec=importlib.util.spec_from_file_location('maesan_builder',stage/'builder.py')
b=importlib.util.module_from_spec(modspec); modspec.loader.exec_module(b)

def sh(data): return hashlib.sha256(data).hexdigest()
def save_svg(path, parts):
    data=''.join(parts).encode('utf-8')
    ET.fromstring(data)
    path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(data)
    tags=[el.tag.split('}')[-1] for el in ET.fromstring(data).iter()]
    assert 'path' not in tags and all('transform' not in e.attrib for e in ET.fromstring(data).iter())
    return data

# #10 enlarged full-size candidate
uid10='qid_v1_1949955fe03c289af9801d75c271230919d09ddb61e89731084200acf2b97cca'
row10=next(x for x in base_rows if x['questionUid']==uid10)
W,H=720,590; L,R,T,B=130,684,112,484
xmin,xmax=30.0,52.0; ymin,ymax=0.0,2500.0
sx=(R-L)/(xmax-xmin); sy=(B-T)/(ymax-ymin)
X=lambda x:L+(x-xmin)*sx
Y=lambda y:B-(y-ymin)*sy
pts=[]
for i in range(201):
    x=(240/7)+(48-240/7)*i/200
    pts.append((X(x),Y(-1.5*x*x+120*x)))
left=(240/7,115200/49); vertex=(40.,2400.); right=(48.,2304.)
p=[b.root_open(W,H,'Maesan23 #10 area model','Source-constrained graph of A(x)=−3x²/2+120x on 240/7≤x<48; maximum at (40,2400).',b.facts_sha(b.FACTS10),'B-V1/H1_SOURCE_DRIFT48/q10',axis_mode='UNEQUAL_UNIT_DECLARED')]
p.append(b.rect(0,0,W,H,'#fff'))
p.append(b.text(34,38,'끈 조건: 3x+2y=240; A(x)=−(3/2)x²+120x',18,weight='bold'))
p.append(b.text(34,66,'가능한 정사각형 한 변: 240/7 ≤ x < 48 (m)',16))
for yy in [0,1000,2000,2500]:
    py=Y(yy); p.append(b.line(L,py,R,py,'#dddddd',1.0)); p.append(b.line(L-6,py,L+6,py,'#555555',1.2)); p.append(b.text(L-12,py+6,str(yy),16,'end','#333'))
for xx in [30,35,40,45,50]:
    px=X(xx); p.append(b.line(px,T,px,B,'#eeeeee',0.8)); p.append(b.line(px,B-6,px,B+6,'#555555',1.2)); p.append(b.text(px,B+25,str(xx).replace('-', '−'),16,'middle','#333'))
p.append(b.line(L,B,R,B,'#111111',1.7)); p.append(b.line(L,T,L,B,'#111111',1.7))
p.append(b.text((L+R)/2,B+58,'x (m)',16,'middle'))
p.append(b.text(L,T-18,'A(x) (m²)',16,'start'))
p.append(b.polyline(pts,'#111111',2.8,'none',attrs='id="AREA_CURVE"'))
for x,y,ident in [(left[0],left[1],'FEASIBLE_LEFT_GUIDE'),(40,2400,'VERTEX_GUIDE'),(48,2304,'FEASIBLE_RIGHT_GUIDE')]:
    p.append(b.line(X(x),Y(y),X(x),B,'#777777',1.2,'5 5',attrs=f'id="{ident}"'))
p.append(b.circle(X(left[0]),Y(left[1]),5.2,'#111111','#111111',1.4,attrs='id="FEASIBLE_LEFT_INCLUDED"'))
p.append(b.circle(X(40),Y(2400),5.8,'#111111','#111111',1.4,attrs='id="AREA_VERTEX"'))
p.append(b.circle(X(48),Y(2304),5.6,'#ffffff','#111111',1.8,attrs='id="FEASIBLE_RIGHT_EXCLUDED"'))
p.append(b.text(X(left[0])-4,Y(left[1])+32,'240/7, 115200/49',16,'middle','#222',weight='bold'))
p.append(b.text(X(40)+17,Y(2400)-17,'(40, 2400)',16,'start','#111',weight='bold'))
p.append(b.text(X(48)+4,Y(2304)+32,'48, 미포함',16,'middle','#222',weight='bold'))
p.append(b.root_close())
svg10=save_svg(stage/'archive'/row10['intendedPath'],p)
# Estimate text placement separation in SVG screen coords; all plot labels remain in safe canvas bounds.
coords10={'viewBox':[0,0,W,H],'plot':[L,T,R,B],'xRange':[xmin,xmax],'yRange':[ymin,ymax],'sx':sx,'sy':sy,'leftIncluded':{'math':[left[0],left[1]],'screen':[X(left[0]),Y(left[1])],'labelBaseline':[X(left[0])-4,Y(left[1])+32]},'vertex':{'math':[40,2400],'screen':[X(40),Y(2400)],'labelBaseline':[X(40)+17,Y(2400)-17]},'rightExcluded':{'math':[48,2304],'screen':[X(48),Y(2304)],'labelBaseline':[X(48)+4,Y(2304)+32]},'textSizesPx':{'formula':18,'domain':16,'axis':16,'ticks':16,'keyLabels':16},'domain':'[240/7, 48)'}
assert X(left[0]) < X(40) < X(48) and X(48)+80 < W and Y(left[1])+32 < B and Y(2304)+32 < B

# #20 enlarged full-size candidate; both panels retain independent equal-unit scaling.
uid20='qid_v1_c0ed374f651cfb56856bce63178444ab31976984a3b1a7a488834c6985f6bf8f'
row20=next(x for x in base_rows if x['questionUid']==uid20)
W2,H2=900,1160
q=[b.root_open(W2,H2,'매산고 2023 #20 접선과 넓이 비교','포물선 y=−x²+6x의 허용 접점에서 접선과 절편 삼각형을 비교한다.',b.facts_sha(b.FACTS20),'B-V1/H1_SOURCE_DRIFT48/q20',True,'EQUAL_UNIT','SOLUTION_GRAPH')]
q.append(b.rect(0,0,W2,H2,'#fff'))
q.append(b.text(34,34,'포물선 y=−x²+6x; 허용되는 접점 구간 0<t<6',18,weight='bold'))
def panel(y0,case,t,xmin,xmax,ymin,ymax,exact_ratio):
    x0,x1=54,846; top=y0+52; bottom=y0+486
    pw=x1-x0; ph=bottom-top; s=min(pw/(xmax-xmin),ph/(ymax-ymin))
    plotw=s*(xmax-xmin); ploth=s*(ymax-ymin)
    L=x0+(pw-plotw)/2; T=top+(ph-ploth)/2; R=L+plotw; B=T+ploth
    X=lambda x:L+(x-xmin)*s; Y=lambda yy:B-(yy-ymin)*s
    a=6-2*t; bb=t*t; cx=t; cy=-t*t+6*t; ax=-bb/a; by=bb; dx=t
    O=(0.,0.); A=(ax,0.); BP=(0.,by); C=(cx,cy); D=(dx,0.)
    areaABO=abs(ax*by)/2; areaACD=abs((dx-ax)*cy)/2; ratio=areaACD/areaABO
    q.append(b.text(W2/2,y0+28,case,19,'middle','#111',weight='bold'))
    triABO=[(X(A[0]),Y(A[1])),(X(BP[0]),Y(BP[1])),(X(0),Y(0))]
    triACD=[(X(A[0]),Y(A[1])),(X(C[0]),Y(C[1])),(X(D[0]),Y(D[1]))]
    if areaABO>=areaACD:
        q.append(b.polygon(triABO,'#e4e4e4','#777777',1.1,attrs='id="TRIANGLE_ABO"'))
        q.append(b.polygon(triACD,'#bdbdbd','#555555',1.1,attrs='id="TRIANGLE_ACD"'))
    else:
        q.append(b.polygon(triACD,'#e4e4e4','#777777',1.1,attrs='id="TRIANGLE_ACD"'))
        q.append(b.polygon(triABO,'#bdbdbd','#555555',1.1,attrs='id="TRIANGLE_ABO"'))
    q.append(b.line(X(0),Y(ymin),X(0),Y(ymax),'#555555',1.5,attrs='id="Y_AXIS"'))
    q.append(b.line(X(xmin),Y(0),X(xmax),Y(0),'#555555',1.5,attrs='id="X_AXIS"'))
    for xx in range(math.ceil(xmin),math.floor(xmax)+1):
        q.append(b.line(X(xx),Y(0)-4,X(xx),Y(0)+4,'#555555',1.0))
        if xx in [math.ceil(xmin),0,math.floor(xmax)]: q.append(b.text(X(xx),Y(0)+23,str(xx).replace('-', '−'),16,'middle','#333'))
    for yy in range(math.ceil(ymin),math.floor(ymax)+1,2):
        if yy==0: continue
        q.append(b.line(X(0)-4,Y(yy),X(0)+4,Y(yy),'#555555',1.0))
        if yy in [2,4,6,8,10,20]: q.append(b.text(X(0)-9,Y(yy)+6,str(yy),16,'end','#333'))
    q.append(b.text(R+10,Y(0)-10,'x',16,'start','#111',italic=True))
    q.append(b.text(X(0)+10,T+20,'y',16,'start','#111',italic=True))
    arc=[(X(i*(6/160)),Y(-(i*6/160)**2+6*(i*6/160))) for i in range(161)]
    q.append(b.polyline(arc,'#111111',2.7,attrs='id="PARABOLA_ARCH"'))
    ta=(X(A[0]),Y(0)); tc=(X(C[0]),Y(C[1]))
    q.append(b.line(ta[0],ta[1],tc[0],tc[1],'#444444',2.1,attrs='id="TANGENT_SEGMENT"'))
    q.append(b.line(X(dx),Y(0),X(dx),Y(cy),'#777777',1.3,'5 5',attrs='id="CD_PERPENDICULAR"'))
    point_list=[('A',A),('B',BP),('O',O),('C',C),('D',D)]
    point_screens={}; label_screens={}
    for name,(xx,yy) in point_list:
        sxp,syp=X(xx),Y(yy); point_screens[name]=[sxp,syp]
        q.append(b.circle(sxp,syp,4.8,'#ffffff','#111111',1.7,attrs=f'id="POINT_{name}"'))
        config=({'A':(-12,-12,'end'),'B':(12,-10,'start'),'O':(-7,-22,'end'),'C':(12,-10,'start'),'D':(14,-10,'start')} if t < 3 else {'A':(10,-14,'start'),'B':(12,-10,'start'),'O':(-7,-22,'end'),'C':(12,-10,'start'),'D':(-10,-12,'end')})[name]
        ox,oy,anchor=config
        label_screens[name]={'x':sxp+ox,'y':syp+oy,'anchor':anchor}
        q.append(b.text(sxp+ox,syp+oy,name,18,anchor,'#111',italic=True,attrs=f'data-point="{name}"'))
    q.append(b.text(L+8,T+22,'y=−x²+6x',16,'start','#111',italic=True))
    if t < 3:
        # △ACD fits near the broad base; △ABO is identified beside its narrow region.
        q.append(b.text(X(A[0])+0.62*(X(D[0])-X(A[0])),Y(0.85),'△ACD',16,'middle','#222'))
        q.append(b.text(X(A[0])-5,Y(1.1),'△ABO',16,'end','#222'))
        q.append(b.line(X(A[0])-2,Y(1.1),X(A[0])+15,Y(1.1),'#555555',1.1))
    else:
        # △ABO is labeled inside its broad face; a short leader marks narrow △ACD.
        q.append(b.text(X(2.5),Y(5.42),'△ABO',16,'middle','#222'))
        mid_y=(Y(C[1])+Y(0))/2
        q.append(b.text(X(C[0])+46,mid_y+6,'△ACD',16,'start','#222'))
    q.append(b.text((x0+x1)/2,bottom+34,f'a={b.fmt(a).replace('-', '−')}, |b|={b.fmt(bb)}; [ACD]/[ABO]={exact_ratio}',17,'middle','#222',weight='bold'))
    return {'t':t,'a':a,'b':bb,'C':[cx,cy],'A':[ax,0],'B':[0,by],'D':[dx,0],'O':[0,0],'areas':{'ABO':areaABO,'ACD':areaACD,'ratio_ACD_to_ABO':ratio,'exactDisplayedRatio':exact_ratio},'coordinateMap':{'origin':[X(0),Y(0)],'scaleEqualUnit':s,'xRange':[xmin,xmax],'yRange':[ymin,ymax],'plot':[L,T,R,B]},'pointScreenCoordinates':point_screens,'pointLabelScreenPositions':label_screens,'triangleLabelLayout':({'ACD':{'screen':[X(A[0])+0.62*(X(D[0])-X(A[0])),Y(0.85)],'anchor':'middle'},'ABO':{'screen':[X(A[0])-5,Y(1.1)],'anchor':'end'},'ABOLeader':[[X(A[0])-2,Y(1.1)],[X(A[0])+15,Y(1.1)]]} if t < 3 else {'ABO':{'screen':[X(2.5),Y(5.42)],'anchor':'middle'},'ACD':{'screen':[X(C[0])+46,(Y(C[1])+Y(0))/2+6],'anchor':'start'}}),'layoutReview':['Point labels near the horizontal axis use separated anchors; the second-case A and D labels are placed on opposite sides.','The narrow second-case △ACD label sits beside its face, clear of the parabola.','Browser render and human visual review remain pending.'],'textSizesPx':{'panelHeading':19,'pointLabels':18,'axisAndTicks':16,'triangleLabels':16,'ratio':17}}
cases=[panel(42,'경우 1 · 접점 t=3/2',1.5,-2,6.5,-1,10,'9'),panel(590,'경우 2 · 접점 t=9/2',4.5,-7.5,7.5,-1,22,'1/9')]
q.append(b.text(34,H2-28,'a=6−2t, b=t², |b|=(a−6)²/4',17,'start','#333'))
q.append(b.root_close())
svg20=save_svg(stage/'archive'/row20['intendedPath'],q)

# Build standalone revised manifest rows. Keep prior row context and history; staged only.
script=Path(__file__); scripth=sh(script.read_bytes())
for row,svg,calc,label in [(row10,svg10,coords10,'readability revision 2: full-size, 16–18 px labels, English footer removed'),(row20,svg20,{'formula':'y=−x²+6x; tangent y=(6−2t)x+t²; [ACD]/[ABO]=(6−t)²/t²','domain':'0<t<6; a≠0 excludes t=3','cases':cases,'admissibleContacts':[1.5,4.5],'resultPairs':[{'a':3,'abs_b':2.25},{'a':-3,'abs_b':20.25}],'axisScale':'EQUAL_UNIT per panel; scales remain separate','exactRatiosDisplayed':['9','1/9'],'viewBox':[0,0,W2,H2]},'readability revision 2: full-size panels, larger Korean labels and exact ratio text')]:
    prev=row.get('svgSha256')
    row['revisionHistory']=(row.get('revisionHistory') or [])+[{'revision':1,'svgSha256':prev,'reason':'prior candidate reviewed; visual axis held for readability/precision','status':'SUPERSEDED'}]
    row['revision']=2; row['revisionReason']=label
    row['svgSha256']=sh(svg); row['pythonScriptPath']=str(script.resolve()); row['pythonScriptSha256']=scripth
    row['beforeAsset']={'status':'PRESENT','sha256':('8bbacc8ef0d6dc53523bf8a609cb7918dd808ab178016135abfade6da927a868' if row['questionUid']==uid10 else '735a8c3cd14e0b75d6db328e0e5261fc571aa337cd6f5cc76155620df6972a79')}
    row['originalBaselineAsset']={'status':'PRESENT','sha256':('d743d07aeaca3f1b54625bdbbf5b630920f718397da8369c4474abbcfab4dae1' if row['questionUid']==uid10 else '753dc23f86d6fddd17e826ddb2aa53b8e895915dbcf85342c04b7d46e7c0d534')}
    row['supersedes']={'revision':1,'svgSha256':row['beforeAsset']['sha256']}
    xroot=ET.fromstring(svg); xels=list(xroot.iter()); xtags=[e.tag.split('}')[-1] for e in xels]
    row['staticXmlCheck']={'status':'PASS','elementCount':len(xels),'viewBox':xroot.attrib.get('viewBox'),'preserveAspectRatio':xroot.attrib.get('preserveAspectRatio'),'noPathTransform':('path' not in xtags and all('transform' not in e.attrib for e in xels)),'primitiveTags':sorted(set(t for t in xtags if t in {'line','polyline','polygon','circle','rect'}))}
    row['pythonCalculationOutput']=calc; row['solutionImageSize']='full'
    row['nativeRenderStatus']='NOT_TESTED'; row['staticXmlValidation']='PASS'; row['primitivePolicyCheck']='PASS: no path or transform; uses line/polyline/polygon/circle/rect'
    row['visualQaStatus']='PENDING_ROOT_RENDER_AND_C_REVIEW'
    if row['questionUid']==uid10:
        row['solutionImageAlt']='정사각형의 한 변 x에 따른 넓이의 합 A(x); 240/7≤x<48에서 x=40일 때 최댓값 2400m²이다.'
        row['solutionImageCaption']='A(x)=−3x²/2+120x; 허용 구간 240/7≤x<48 m에서 최댓값은 x=40m, 2400m²이다.'
        row['qaRisks']=['x (m)와 A(x) (m²)는 서로 다른 단위의 축으로 각각 표시한다.','Full-size candidate is staged only; repository asset remains unchanged until Root applies it.','Native sharp renderer unavailable in this environment; Root browser render and C visual-axis review are pending.']
    else:
        row['solutionImageAlt']='포물선 y=−x²+6x의 두 허용 접점에서 접선과 절편 삼각형 ABO, ACD를 비교한다.'
        row['solutionImageCaption']='접점은 포물선에서 허용되는 구간 0<t<6이며, 실제 접점은 t=3/2와 9/2이다.'
        row['qaRisks']=['각 경우는 서로 다른 보기 창을 사용하지만, 한 패널 안의 x/y 축은 동일한 단위 길이이며 패널끼리 길이를 비교하지 않는다.','The source question has no printed diagram; this is a solution-only construction from D wording and frozen solution facts.','Full-size candidate is staged only; repository asset remains unchanged until Root applies it.','Native sharp renderer unavailable in this environment; Root browser render and C visual-axis review are pending.']
    row['revisionArtifactSha256']=sh(svg)
    row['generatedSvgBytes']=len(svg)

rev_manifest=stage/'manifest-maesan23-rev2.jsonl'
rows=[row10,row20]
rev_manifest.write_text('\n'.join(json.dumps(x,ensure_ascii=False,separators=(',',':')) for x in rows)+'\n',encoding='utf-8')
print(json.dumps({'stage':str(stage),'manifest':str(rev_manifest),'manifestBytes':rev_manifest.stat().st_size,'manifestSha256':sh(rev_manifest.read_bytes()),'scriptPath':str(script.resolve()),'scriptSha256':scripth,'rows':[{'uid':r['questionUid'],'stagedPath':r['stagedPath'],'svgSha256':r['svgSha256'],'bytes':r['generatedSvgBytes'],'solutionImageSize':r['solutionImageSize'],'staticXmlValidation':r['staticXmlValidation']} for r in rows],'q10Coordinates':coords10,'q20Cases':cases},ensure_ascii=False))
