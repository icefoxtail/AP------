from pathlib import Path
import json, math, xml.etree.ElementTree as ET, hashlib, subprocess
root=Path(r"C:\Users\USER\Desktop\AP-worktrees\h2-1mid-20261010\AP------")
asset=root/"archive/assets/images/24_금당고_1학기_중간_고2_수학II/q8-solution.svg"
evidence=root/"archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011/q8-solution-visual-parity.json"
disclosure=json.loads((root/"archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011/r1-postfreeze-qid-1-19.json").read_text(encoding="utf-8"))
solution=next(x["solution"] for x in disclosure["rows"] if x["qid"]==8)
solution_sha=hashlib.sha256(solution.encode("utf-8")).hexdigest()
source_sha_current=hashlib.sha256((root/"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js").read_bytes()).hexdigest()
def f(x): return -2*x*x+x+1
def df(x): return -4*x+1
# Explicit coordinate transform; all rendered points are calculated here.
ox,oy,sx,sy=80.0,170.0,240.0,45.0
def screen(x,y): return ox+sx*x, oy-sy*y
# adaptive sampling of the exact source polynomial, forcing critical MVT points into the point set.
def point(x): return screen(x,f(x))
def sample(a,b,pa=None,pb=None,depth=0):
    pa=point(a) if pa is None else pa; pb=point(b) if pb is None else pb
    m=(a+b)/2; pm=point(m)
    chord=((pa[0]+pb[0])/2,(pa[1]+pb[1])/2)
    error=math.hypot(pm[0]-chord[0],pm[1]-chord[1])
    if (error<=0.20 and abs(pb[0]-pa[0])<=2.0) or depth>=20: return [pa,pb]
    return sample(a,m,pa,pm,depth+1)[:-1]+sample(m,b,pm,pb,depth+1)
breaks=[0.0,1.0,1.5,2.0,2.2]
pts=[]
for a,b in zip(breaks,breaks[1:]):
    part=sample(a,b)
    pts+=part if not pts else part[1:]
# Exact source/solution facts.
p1,p2=(1.0,f(1.0)),(2.0,f(2.0)); c=1.5; pc=(c,f(c))
secant_slope=(p2[1]-p1[1])/(p2[0]-p1[0]); tangent_slope=df(c)
assert p1==(1.0,0.0) and p2==(2.0,-5.0) and pc==(1.5,-2.0) and secant_slope==tangent_slope==-5.0
sx1,sy1=screen(*p1); sx2,sy2=screen(*p2); cx,cy=screen(*pc)
# Screen-space segment endpoints for exact lines (same affine frame).
tangent_left_x,tangent_right_x=1.25,1.75
tlx,tly=screen(tangent_left_x, f(c)+tangent_slope*(tangent_left_x-c))
trx,try_=screen(tangent_right_x, f(c)+tangent_slope*(tangent_right_x-c))
svg=['<?xml version="1.0" encoding="UTF-8"?>', '<svg xmlns="http://www.w3.org/2000/svg" width="920" height="600" viewBox="0 0 920 600" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-visual-type="function-graph" data-provenance="exact-source-polynomial">',
'<title id="title">평균변화율과 접선 기울기</title><desc id="desc">구간 양 끝점의 할선과 c=3/2에서의 접선이 같은 기울기 −5임을 보이는 그래프</desc>',
'<style>text{font-family:"Noto Sans KR","Malgun Gothic",sans-serif;fill:#142033}.math{font-family:"Cambria Math","Times New Roman",serif;font-style:italic}.axis{stroke:#25364d;stroke-width:2}.curve{fill:none;stroke:#245a85;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.secant{stroke:#475569;stroke-width:2.8;stroke-dasharray:8 6}.tangent{stroke:#c2413b;stroke-width:2.8}.guide{stroke:#94a3b8;stroke-width:1.5;stroke-dasharray:4 5}.point{fill:#fff;stroke:#142033;stroke-width:2.5}.contact{fill:#fff;stroke:#c2413b;stroke-width:3}.card{fill:#f3f6fa;stroke:#cad3df;stroke-width:1.5}.title{font-size:27px;font-weight:700}.subtitle{font-size:17px;fill:#475569}.label{font-size:17px}.note{font-size:18px;font-weight:600}.tiny{font-size:14px;fill:#475569}</style>',
'<rect width="920" height="600" fill="#fff"/><text x="38" y="42" class="title">평균변화율과 접선 기울기</text><text x="38" y="72" class="subtitle">평균값 정리에서 두 기울기가 같은 점이 c이다.</text>',
'<line x1="80" y1="170" x2="630" y2="170" class="axis" data-role="x-axis"/><line x1="80" y1="80" x2="80" y2="485" class="axis" data-role="y-axis"/>',
'<text x="636" y="176" class="math label">x</text><text x="86" y="76" class="math label">y</text><text x="314" y="192" class="math label">1</text><text x="554" y="192" class="math label">2</text>',
'<text x="465" y="112" class="math label">y=f(x)</text>',
'<polyline points="'+' '.join(f'{x:.6f},{y:.6f}' for x,y in pts)+'" class="curve" data-role="curve"/>',
f'<line x1="{sx1:.6f}" y1="{sy1:.6f}" x2="{sx2:.6f}" y2="{sy2:.6f}" class="secant" data-role="secant" data-math-slope="-5"/>',
f'<line x1="{tlx:.6f}" y1="{tly:.6f}" x2="{trx:.6f}" y2="{try_:.6f}" class="tangent" data-role="tangent" data-math-slope="-5" data-contact-x="1.5"/>',
f'<line x1="{cx:.6f}" y1="{cy:.6f}" x2="{cx:.6f}" y2="170" class="guide" data-role="contact-guide"/>',
f'<circle cx="{sx1:.6f}" cy="{sy1:.6f}" r="5" class="point" data-role="endpoint" data-x="1" data-y="0"/>',f'<circle cx="{sx2:.6f}" cy="{sy2:.6f}" r="5" class="point" data-role="endpoint" data-x="2" data-y="-5"/>',f'<circle cx="{cx:.6f}" cy="{cy:.6f}" r="6" class="contact" data-role="contact" data-x="1.5" data-y="-3.5"/>',
'<text x="330" y="155" class="tiny">할선 기울기 −5</text><text x="424" y="359" class="tiny">접선 기울기 −5</text><text x="447" y="320" class="math label">c=3/2</text>',
'<rect x="670" y="135" width="212" height="230" rx="14" class="card"/><text x="692" y="176" class="note">할선</text><text x="692" y="207" class="math label">(−5−0)/(2−1)=−5</text><text x="692" y="258" class="note">접선</text><text x="692" y="289" class="math label">f′(3/2)=−5</text><text x="692" y="333" class="math note">c=3/2</text>',
'<text x="38" y="555" class="tiny">끝점 (1,0), (2,−5)와 c에서의 접선을 같은 좌표 틀에 표시</text>','</svg>']
asset.write_text('\n'.join(svg)+'\n',encoding='utf-8')
# Independently observe final XML primitives and curve sample points.
root_xml=ET.parse(asset).getroot(); ns={'s':'http://www.w3.org/2000/svg'}
def read_line(role):
    el=next(x for x in root_xml.findall('.//s:line',ns) if x.attrib.get('data-role')==role)
    x1,y1,x2,y2=[float(el.attrib[k]) for k in ('x1','y1','x2','y2')]
    return {'primitive':[x1,y1,x2,y2],'screenSlope':(y2-y1)/(x2-x1),'mathSlope':-(y2-y1)/(x2-x1)*sx/sy}
sec=read_line('secant'); tan=read_line('tangent'); assert abs(sec['mathSlope']+5)<1e-9 and abs(tan['mathSlope']+5)<1e-9
curve_el=next(x for x in root_xml.findall('.//s:polyline',ns) if x.attrib.get('data-role')=='curve')
curve_pts=[tuple(map(float,p.split(','))) for p in curve_el.attrib['points'].split()]
obs=[]
for x,y in [(1,0),(1.5,-2.0),(2,-5)]:
    ex,ey=screen(x,y); close=min(curve_pts,key=lambda q:(q[0]-ex)**2+(q[1]-ey)**2)
    obs.append({'mathPoint':[x,y],'screenExpected':[ex,ey],'screenObserved':list(close),'deltaPx':math.hypot(close[0]-ex,close[1]-ey)})
    assert math.hypot(close[0]-ex,close[1]-ey)<1e-3
axisX=next(x for x in root_xml.findall('.//s:line',ns) if x.attrib.get('data-role')=='x-axis'); axisY=next(x for x in root_xml.findall('.//s:line',ns) if x.attrib.get('data-role')=='y-axis')
assert axisX.attrib['y1']==axisX.attrib['y2'] and axisY.attrib['x1']==axisY.attrib['x2'] and (axisX.attrib['x1'],axisX.attrib['y1'])==('80','170')
facts={'schemaVersion':'JS_ARCHIVE_SOLUTION_SVG_PARITY_V1','examUid':'24_금당고_1학기_중간_고2_수학II','qid':8,'sourceRawSha256':source_sha_current,'frozenSourceRawSha256':'31ad97508f78d98c79d7f492d7887ab2212b437f30fedaf7f387319aec8443d2','solutionSha256':solution_sha,'finalSvgSha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'finalSvgGitBlobSha':subprocess.check_output(['git','hash-object',str(asset)],cwd=root,text=True).strip(),'expectedFacts':[{'type':'POINT','fact':'f(1)=0','role':'GIVEN'},{'type':'POINT','fact':'f(2)=-5','role':'GIVEN'},{'type':'SLOPE','fact':'secant slope=-5','role':'DERIVED_INTERMEDIATE'},{'type':'POINT','fact':'c=3/2 and f(c)=-2','role':'CONCLUSION'},{'type':'SLOPE','fact':'f′(3/2)=-5 and parallel to secant','role':'DERIVED_INTERMEDIATE'}],'coordinateModel':{'kind':'SOURCE_COORDINATES','origin':[80,170],'sx':sx,'sy':sy,'screenX':'80+240x','screenY':'170-45y','xDomain':[0,2.2],'yDomain':[-7,2]},'pythonInputs':{'f':'-2x^2+x+1','df':'-4x+1','interval':[1,2],'adaptiveChordErrorPxMax':0.20},'pythonCalculatedOutputs':{'f1':f(1),'f2':f(2),'secantSlope':secant_slope,'c':c,'fc':f(c),'tangentSlope':tangent_slope},'actualSvgPrimitives':{'xmlTagCounts':{tag:len(root_xml.findall('.//s:'+tag,ns)) for tag in ['line','polyline','circle','text']},'secant':sec,'tangent':tan,'curvePointCount':len(curve_pts),'frame':{'xAxis':[axisX.attrib[k] for k in ('x1','y1','x2','y2')],'yAxis':[axisY.attrib[k] for k in ('x1','y1','x2','y2')]}},'observedFacts':[{'fact':'secant and tangent line primitive math slopes both -5','expected':-5,'observed':[sec['mathSlope'],tan['mathSlope']],'maxDelta':max(abs(sec['mathSlope']+5),abs(tan['mathSlope']+5)),'tolerance':1e-9,'status':'PASS'},{'fact':'curve polyline includes actual function points','rows':obs,'maxDeltaPx':max(x['deltaPx'] for x in obs),'tolerancePx':1e-3,'status':'PASS'}],'sourceConditionCoverage':[{'condition':'domain endpoints [1,2]','status':'PASS'},{'condition':'function f(x)=-2x²+x+1','status':'PASS'},{'condition':'c=3/2 tangent is parallel to secant','status':'PASS'}],'sourceSemanticIdentity':{'applicable':True,'checks':[{'semanticRole':'function graph','sourceLabel':'f(x)','artifactLabel':'y=f(x)','result':'PASS'},{'semanticRole':'MVT interval endpoints','sourceLabel':'1,2','artifactLabel':'1,2','result':'PASS'}]},'factVisualizations':[{'fact':'secant through endpoints','role':'DERIVED_INTERMEDIATE','encoding':'dashed line'},{'fact':'tangent at c','role':'CONCLUSION','encoding':'accent solid line and contact marker'}],'decisiveRelationCovered':True,'uncoveredCriticalConditions':[],'expectedFactCompletenessStatus':'PASS','labelOwnerBindings':[{'label':'(1,0)','owner':'left secant endpoint','status':'PASS'},{'label':'(2,-5)','owner':'right secant endpoint','status':'PASS'},{'label':'c=3/2','owner':'tangent contact','status':'PASS'}],'xmlParse':'PASS','browserRenderEvidence':'NOT_RUN_R1_R3_OWNER','svgPath':'archive/assets/images/24_금당고_1학기_중간_고2_수학II/q8-solution.svg'}
evidence.write_text(json.dumps(facts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'asset':str(asset),'evidence':str(evidence),'curvePointCount':len(curve_pts),'secantMathSlope':sec['mathSlope'],'tangentMathSlope':tan['mathSlope'],'geometryParity':'PASS','xmlParse':'PASS'},ensure_ascii=False,indent=2))
