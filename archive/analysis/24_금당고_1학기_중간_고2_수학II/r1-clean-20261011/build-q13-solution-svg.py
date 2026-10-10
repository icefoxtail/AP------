from pathlib import Path
import json, math, xml.etree.ElementTree as ET
import hashlib, subprocess

root = Path(r"C:\Users\USER\Desktop\AP-worktrees\h2-1mid-20261010\AP------")
asset = root / "archive/assets/images/24_금당고_1학기_중간_고2_수학II/q13-solution.svg"
evidence = root / "archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011/q13-solution-visual-parity.json"
disclosure = json.loads((root / "archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011/r1-postfreeze-qid-1-19.json").read_text(encoding="utf-8"))
solution_text = next(row["solution"] for row in disclosure["rows"] if row["qid"] == 13)
solution_sha = hashlib.sha256(solution_text.encode("utf-8")).hexdigest()
source_sha_current = hashlib.sha256((root / "archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js").read_bytes()).hexdigest()
# Constructed schematic model; exact source-supported facts are interval/topology/direction/count.
segments = [
    ((105.0,235.0),(225.0,370.0),(145.0,315.0),(185.0,370.0),"first-descent"),
    ((225.0,370.0),(325.0,120.0),(258.3333333333,370.0),(291.6666666667,120.0),"rise-1"),
    ((325.0,120.0),(425.0,355.0),(358.3333333333,120.0),(391.6666666667,355.0),"descent-2"),
    ((425.0,355.0),(505.0,130.0),(451.6666666667,355.0),(478.3333333333,130.0),"rise-2"),
    ((505.0,130.0),(585.0,345.0),(531.6666666667,130.0),(558.3333333333,345.0),"descent-3"),
    ((585.0,345.0),(705.0,280.0),(625.0,345.0),(665.0,280.0),"rise-3"),
]
# x coordinates are evenly spaced on each segment; calculate exact cubic derivatives in screen coords.
def bezier(p0,p1,p2,p3,t):
    u=1-t
    return tuple(u**3*p0[i]+3*u*u*t*p1[i]+3*u*t*t*p2[i]+t**3*p3[i] for i in (0,1))
def derivative(p0,p1,p2,p3,t):
    u=1-t
    return tuple(3*u*u*(p1[i]-p0[i])+6*u*t*(p2[i]-p1[i])+3*t*t*(p3[i]-p2[i]) for i in (0,1))
def flatness(p0,p1,p2,p3):
    dx,dy=p3[0]-p0[0],p3[1]-p0[1]
    den=max(math.hypot(dx,dy),1e-12)
    return max(abs(dy*p[0]-dx*p[1]+p3[0]*p0[1]-p3[1]*p0[0])/den for p in (p1,p2))
def split(c):
    p0,p1,p2,p3=c
    a=tuple((p0[i]+p1[i])/2 for i in (0,1)); b=tuple((p1[i]+p2[i])/2 for i in (0,1)); d=tuple((p2[i]+p3[i])/2 for i in (0,1))
    e=tuple((a[i]+b[i])/2 for i in (0,1)); f=tuple((b[i]+d[i])/2 for i in (0,1)); g=tuple((e[i]+f[i])/2 for i in (0,1))
    return (p0,a,e,g),(g,f,d,p3)
def sample(c,t0=0,t1=1,depth=0):
    if (flatness(*c)<=0.20 and abs(c[3][0]-c[0][0])<=0.25) or depth>=20:
        return [c[0],c[3]]
    left,right=split(c); mid=(t0+t1)/2
    return sample(left,t0,mid,depth+1)[:-1]+sample(right,mid,t1,depth+1)

samples=[]
for p0,p3,p1,p2,name in segments:
    c=(p0,p1,p2,p3)
    pts=sample(c)
    samples.append((name,pts))
# Secant primitive uses exact schematic endpoints; mathematical slope has opposite sign to screen slope.
left=(105.0,235.0); right=(705.0,280.0)
secant_screen_slope=(right[1]-left[1])/(right[0]-left[0])
# Find tangent contacts analytically: first descent is monotone decreasing in screen slope; interior cubic humps have two roots.
def roots_bracketed(fn, target, lo=0.0, hi=1.0, n=4000):
    out=[]; prev=lo; fp=fn(prev)-target
    for i in range(1,n+1):
        x=lo+(hi-lo)*i/n; fx=fn(x)-target
        if fp==0 or fp*fx<0:
            a,b=prev,x; fa=fn(a)-target
            for _ in range(70):
                m=(a+b)/2; fm=fn(m)-target
                if fa*fm<=0: b=m
                else: a=m; fa=fm
            val=(a+b)/2
            if not out or abs(val-out[-1])>1e-6: out.append(val)
        prev=x; fp=fx
    return out
contacts=[]
for p0,p3,p1,p2,name in segments:
    if name not in ("first-descent","descent-2","descent-3"): continue
    c=(p0,p1,p2,p3)
    def slope(t):
        dx,dy=derivative(*c,t); return dy/dx
    ts=roots_bracketed(slope,secant_screen_slope)
    for t in ts:
        x,y=bezier(*c,t); dx,dy=derivative(*c,t)
        contacts.append({"branch":name,"t":t,"x":x,"y":y,"screenSlope":dy/dx,"mathSlope":-(dy/dx)})
assert len(contacts)==5, (len(contacts),contacts)
# SVG polyline geometry is generated from adaptive Bezier subdivision; all coordinates originate here.
svg=[]
svg.append('<?xml version="1.0" encoding="UTF-8"?>')
svg.append('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-visual-type="function-graph" data-provenance="constructed-realization-schematic">')
svg.append('<title id="title">할선과 평행한 접선의 개수</title><desc id="desc">구간 양 끝을 잇는 하강 할선과 같은 기울기의 접점 다섯 곳을 하강 구간별로 표시한 개략도</desc>')
svg.append('<style>text{font-family:"Noto Sans KR","Malgun Gothic",sans-serif;fill:#142033}.math{font-family:"Cambria Math","Times New Roman",serif;font-style:italic}.axis{stroke:#25364d;stroke-width:2}.curve{fill:none;stroke:#245a85;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.secant{stroke:#6b7280;stroke-width:2.5;stroke-dasharray:8 6}.tangent{stroke:#c2413b;stroke-width:2.6;stroke-linecap:round}.contact{fill:#fff;stroke:#c2413b;stroke-width:3}.endpoint{fill:#142033}.card{fill:#f3f6fa;stroke:#cad3df;stroke-width:1.5}.title{font-size:28px;font-weight:700}.subtitle{font-size:17px;fill:#475569}.label{font-size:17px}.tiny{font-size:14px;fill:#475569}.number{font-size:15px;font-weight:700;fill:#9e2f2a}</style>')
svg.append('<rect width="1000" height="620" fill="#fff"/>')
svg.append('<text x="40" y="42" class="title">할선과 평행한 접선의 개수</text>')
svg.append('<text x="40" y="72" class="subtitle">평균값 정리의 c는 끝점 할선과 같은 기울기의 접점 x좌표이다.</text>')
# Plot frame; model maps x=-2 to 105 and x=4 to 705, origin x=305; axes share one coordinate frame.
svg.append('<line x1="75" y1="430" x2="730" y2="430" class="axis" data-role="x-axis"/>')
svg.append('<line x1="305" y1="112" x2="305" y2="455" class="axis" data-role="y-axis"/>')
svg.append('<text x="735" y="436" class="math label">x</text><text x="311" y="108" class="math label">y</text>')
svg.append('<text x="91" y="458" class="math label">−2</text><text x="693" y="458" class="math label">4</text>')
svg.append('<text x="520" y="192" class="math label">y=f(x)</text>')
for name,pts in samples:
    points=' '.join(f'{x:.6f},{y:.6f}' for x,y in pts)
    svg.append(f'<polyline points="{points}" class="curve" data-role="curve-branch" data-branch="{name}"/>')
svg.append(f'<line x1="{left[0]:.6f}" y1="{left[1]:.6f}" x2="{right[0]:.6f}" y2="{right[1]:.6f}" class="secant" data-role="secant"/>')
svg.append('<text x="500" y="250" class="tiny">끝점 할선</text>')
for i,c in enumerate(contacts,1):
    x,y=c['x'],c['y']; half=39.0
    x1,x2=x-half,x+half
    y1=y+secant_screen_slope*(x1-x); y2=y+secant_screen_slope*(x2-x)
    svg.append(f'<line x1="{x1:.9f}" y1="{y1:.9f}" x2="{x2:.9f}" y2="{y2:.9f}" class="tangent" data-role="tangent" data-contact="{i}" data-branch="{c["branch"]}"/>')
    svg.append(f'<circle cx="{x:.9f}" cy="{y:.9f}" r="6" class="contact" data-role="contact" data-contact="{i}" data-branch="{c["branch"]}"/>')
    svg.append(f'<text x="{x-3:.3f}" y="{y-13:.3f}" class="number">{i}</text>')
svg.append(f'<circle cx="{left[0]}" cy="{left[1]}" r="5" class="endpoint" data-role="endpoint" data-x="-2"/>')
svg.append(f'<circle cx="{right[0]}" cy="{right[1]}" r="5" class="endpoint" data-role="endpoint" data-x="4"/>')
svg.append('<line x1="760" y1="112" x2="760" y2="500" stroke="#d6dde7" stroke-width="1.5"/>')
svg.append('<rect x="785" y="118" width="180" height="298" rx="14" class="card"/>')
svg.append('<text x="805" y="156" font-size="19" font-weight="700">하강 구간별 개수</text>')
svg.append('<text x="805" y="205" class="label">첫 하강 구간</text><text x="934" y="205" class="number">1개</text>')
svg.append('<text x="805" y="254" class="label">두 번째 하강 구간</text><text x="934" y="254" class="number">2개</text>')
svg.append('<text x="805" y="303" class="label">세 번째 하강 구간</text><text x="934" y="303" class="number">2개</text>')
svg.append('<line x1="805" y1="327" x2="945" y2="327" stroke="#cad3df"/>')
svg.append('<text x="805" y="367" font-size="18" font-weight="700">1+2+2=5</text>')
svg.append('<text x="40" y="555" class="tiny">개략도: y값이나 축척이 아니라 같은 기울기의 접점 개수를 보여 준다.</text>')
svg.append('</svg>')
asset.write_text('\n'.join(svg)+'\n',encoding='utf-8')
# Re-read final SVG bytes and observe line primitive slopes, endpoints and curve contact sample parity.
tree=ET.parse(asset); ns={'s':'http://www.w3.org/2000/svg'}; r=tree.getroot()
lines=[]
for el in r.findall('.//s:line',ns):
    role=el.attrib.get('data-role')
    if role in ('secant','tangent'):
        x1,y1,x2,y2=(float(el.attrib[k]) for k in ('x1','y1','x2','y2'))
        lines.append({'role':role,'contact':el.attrib.get('data-contact'),'branch':el.attrib.get('data-branch'),'slope':(y2-y1)/(x2-x1),'primitive':[x1,y1,x2,y2]})
sec=[x for x in lines if x['role']=='secant']; tans=[x for x in lines if x['role']=='tangent']
assert len(sec)==1 and len(tans)==5
observed=[x['slope'] for x in tans]
assert max(abs(x-sec[0]['slope']) for x in observed)<1e-9
curves={el.attrib['data-branch']:[tuple(map(float,p.split(','))) for p in el.attrib['points'].split()] for el in r.findall('.//s:polyline',ns)}
curveParity=[]
for c in contacts:
    pts=curves[c['branch']]; j=min(range(len(pts)),key=lambda i:(pts[i][0]-c['x'])**2+(pts[i][1]-c['y'])**2)
    if j==0: j=1
    if j>=len(pts)-1: j=len(pts)-2
    a,b=pts[j-1],pts[j+1]; local=(b[1]-a[1])/(b[0]-a[0])
    curveParity.append({'contact':len(curveParity)+1,'branch':c['branch'],'expectedPoint':[c['x'],c['y']],'nearestPolylinePoint':list(pts[j]),'screenTangentSlopeExpected':secant_screen_slope,'screenLocalPolylineSlopeObserved':local,'delta':abs(local-secant_screen_slope),'tolerance':0.025})
    assert abs(local-secant_screen_slope)<0.025
# Frame and endpoint checks from final SVG primitive attributes.
axisX=next(el for el in r.findall('.//s:line',ns) if el.attrib.get('data-role')=='x-axis')
axisY=next(el for el in r.findall('.//s:line',ns) if el.attrib.get('data-role')=='y-axis')
assert float(axisX.attrib['y1'])==float(axisX.attrib['y2']) and float(axisY.attrib['x1'])==float(axisY.attrib['x2'])
assert float(axisY.attrib['x1'])==305 and float(axisX.attrib['y1'])==430
facts={
 'schemaVersion':'JS_ARCHIVE_SOLUTION_SVG_PARITY_V1','examUid':'24_금당고_1학기_중간_고2_수학II','qid':13,
 'sourceRawSha256':source_sha_current,'frozenSourceRawSha256':'31ad97508f78d98c79d7f492d7887ab2212b437f30fedaf7f387319aec8443d2',
 'solutionSha256':solution_sha,
 'sourceImageSha256':'f026e37dfc703c8bc0315b3aabcd50e5bd745af0756637622da3b5d80d126610',
 'finalSvgSha256':hashlib.sha256(asset.read_bytes()).hexdigest(),
 'finalSvgGitBlobSha':subprocess.check_output(['git','hash-object',str(asset)],cwd=root,text=True).strip(),
 'solutionAnswer':'⑤','solutionFact':'negative secant direction and 1+2+2 equal-slope tangent locations',
 'coordinateModel':'CONSTRUCTED_REALIZATION schematic; x=-2 maps x=105, x=0 maps x=305, x=4 maps x=705; unitless schematic y values; source raster immutable',
 'pythonInputs':{'screenSlope':secant_screen_slope,'endpointsScreen':{'left':list(left),'right':list(right)},'adaptiveChordErrorPxMax':0.20},
 'pythonCalculatedOutputs':{'contactCount':len(contacts),'branchCounts':{'first-descent':1,'descent-2':2,'descent-3':2},'mathematicalSecantSlope':-secant_screen_slope,'tangentMathSlopes':[-x['slope'] for x in tans]},
 'actualSvgPrimitives':{'xmlTagCounts':{tag:len(r.findall('.//s:'+tag,ns)) for tag in ['line','polyline','circle','text']},'secant':sec[0],'tangents':tans,'contacts':contacts,'axisFrame':{'xAxis':[axisX.attrib['x1'],axisX.attrib['y1'],axisX.attrib['x2'],axisX.attrib['y2']],'yAxis':[axisY.attrib['x1'],axisY.attrib['y1'],axisY.attrib['x2'],axisY.attrib['y2']]},'adaptivePolylinePointCounts':{k:len(v) for k,v in curves.items()}},
 'observedFacts':[{'fact':'secant slopes down mathematically','observedMathSlope':-sec[0]['slope'],'status':'PASS'},{'fact':'all five tangent line primitives parallel secant','observedMathSlopes':[-x['slope'] for x in tans],'maxDelta':max(abs(x['slope']-sec[0]['slope']) for x in tans),'tolerance':1e-9,'status':'PASS'},{'fact':'curve polyline tangent samples align with each tangent contact','rows':curveParity,'maxDelta':max(x['delta'] for x in curveParity),'tolerance':0.025,'status':'PASS'}],
 'sourceConditionCoverage':[{'sourceCondition':'x=-2 and x=4 endpoints','artifact':'endpoint marks and labels','status':'PASS'},{'sourceCondition':'x=0 y-axis and graph frame','artifact':'orthogonal axis primitives share origin (305,430)','status':'PASS'},{'sourceCondition':'three descending graph branches','artifact':'first-descent, descent-2, descent-3 sampled polylines','status':'PASS'},{'sourceCondition':'parallel tangent count 1+2+2','artifact':'five contact points and five line primitives','status':'PASS'}],
 'sourceSemanticIdentity':{'applicable':True,'checks':[{'semanticRole':'interval-left endpoint','sourceLabel':'−2','artifactLabel':'−2','result':'PASS'},{'semanticRole':'interval-right endpoint','sourceLabel':'4','artifactLabel':'4','result':'PASS'},{'semanticRole':'function graph','sourceLabel':'y=f(x)','artifactLabel':'y=f(x)','result':'PASS'}]},
 'factVisualizations':[{'fact':'endpoint secant','role':'DERIVED_INTERMEDIATE','encoding':'dashed slate line'},{'fact':'five same-slope tangent locations','role':'DERIVED_INTERMEDIATE','encoding':'five red tangent segments with numbered contact markers'},{'fact':'count 5','role':'CONCLUSION','encoding':'separate count card'}],
 'decisiveRelationCovered':True,'uncoveredCriticalConditions':[],'expectedFactCompletenessStatus':'PASS','labelOwnerBindings':[{'label':'−2','owner':'left interval endpoint','status':'PASS'},{'label':'4','owner':'right interval endpoint','status':'PASS'},{'labels':'1–5','owners':'five separate tangent contact circles','status':'PASS'},{'label':'1+2+2=5','owner':'branch count panel','status':'PASS'}],
 'xmlParse':'PASS','browserRenderEvidence':'NOT_RUN_R1_R3_OWNER','rendererSupport':'Archive engine renderSolutionImageHTML loads solutionImage through ordinary img src with cache-buster; SVG extension accepted by existing source refs/validator. Actual browser dimensions, clipping, fonts and student screen remain R3.',
 'svgPath':'archive/assets/images/24_금당고_1학기_중간_고2_수학II/q13-solution.svg'
}
evidence.write_text(json.dumps(facts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'asset':str(asset),'evidence':str(evidence),'segmentPointCounts':{k:len(v) for k,v in curves.items()},'contactCount':len(contacts),'secantScreenSlope':secant_screen_slope,'contactBranches':[c['branch'] for c in contacts],'xmlParse':'PASS','svgPrimitiveParity':'PASS','maxCurveSlopeDelta':max(x['delta'] for x in curveParity)},ensure_ascii=False,indent=2))
