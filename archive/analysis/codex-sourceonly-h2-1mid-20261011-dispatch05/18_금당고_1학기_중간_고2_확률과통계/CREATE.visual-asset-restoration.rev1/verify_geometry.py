from pathlib import Path
import xml.etree.ElementTree as ET, math, json, hashlib
root=Path.cwd(); assets=root/'archive/assets/images/18_금당고_1학기_중간_고2_확률과통계'; ev=root/'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/18_금당고_1학기_중간_고2_확률과통계/CREATE.visual-asset-restoration.rev1'; raster=ev
ns={'s':'http://www.w3.org/2000/svg'}
def parse(q): return ET.parse(assets/f'q{q}-solution.svg').getroot()
def poly_points(s): return [tuple(map(float,p.split(','))) for p in s.split()]
def area(poly): return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))/2)
# q11 actual primitive reverse map
r=parse(11); x0,y0,side=72.,62.,300.
def inv11(x,y): return ((x-x0)/side,1-(y-y0)/side)
valid=r.find("s:polygon[@id='valid-region']",ns); assert valid is not None
validmath=[inv11(*p) for p in poly_points(valid.attrib['points'])]
ex=r.findall("s:polygon[@data-role='excluded-region']",ns); excareas=[area([inv11(*p) for p in poly_points(e.attrib['points'])]) for e in ex]
lines={e.attrib['data-role']:e.attrib for e in r.findall('s:line',ns) if e.attrib.get('data-role','').startswith('boundary-')}
bound={}
for role,a in lines.items():
 p=inv11(float(a['x1']),float(a['y1'])); q=inv11(float(a['x2']),float(a['y2'])); bound[role]={'mathEndpoints':[p,q],'slope':(q[1]-p[1])/(q[0]-p[0]),'intercept':p[1]-p[0]}
assert len(ex)==2 and all(math.isclose(a,2/9,abs_tol=1e-9) for a in excareas) and math.isclose(area(validmath),5/9,abs_tol=1e-9)
assert math.isclose(bound['boundary-upper']['slope'],1,abs_tol=1e-9) and math.isclose(bound['boundary-upper']['intercept'],1/3,abs_tol=1e-9)
assert math.isclose(bound['boundary-lower']['slope'],1,abs_tol=1e-9) and math.isclose(bound['boundary-lower']['intercept'],-1/3,abs_tol=1e-9)
q11={'expectedFacts':[{'fact':'valid region |x-y|<=1/3','role':'GIVEN_CONDITION','expectedArea':'5/9'},{'fact':'two excluded corner triangles','role':'DERIVED_INTERMEDIATE','expectedEachArea':'2/9','legLength':'2/3'}], 'actualSvgPrimitives':{'validRegionPoints':validmath,'excludedTriangleAreas':excareas,'boundaryFacts':bound},'observedFacts':{'validArea':area(validmath),'excludedTriangleAreas':excareas,'boundaryFacts':bound},'tolerance':1e-9}
# q12 grid and corrected owner labels P lower, Q upper
r=parse(12); vx=r.findall('.//s:line[@data-grid-vertical]',ns); hy=r.findall('.//s:line[@data-grid-horizontal]',ns); fe=r.find("s:line[@data-role='forbidden-edge']",ns); assert len(vx)==7 and len(hy)==4 and fe is not None
x1,y1,x2,y2=[float(fe.attrib[k]) for k in ('x1','y1','x2','y2')]
def inv12(x,y): return ((x-70)/55,3-(y-70)/55)
edge=[inv12(x1,y1),inv12(x2,y2)]
labels={ (e.text or '').strip():(float(e.attrib['x']),float(e.attrib['y'])) for e in r.findall('s:text',ns) if (e.text or '').strip() in ('P','Q') }
assert set(labels)=={'P','Q'}
labelMath={k:inv12(*v) for k,v in labels.items()}
assert labelMath['P'][1] < labelMath['Q'][1] and {tuple(round(z,9) for z in p) for p in edge}=={(4.,1.),(4.,2.)}
assert abs(labelMath['P'][1]-1)<0.2 and abs(labelMath['Q'][1]-2)<0.2
q12={'expectedFacts':[{'fact':'6 columns x 3 rows','vertices':'A=(0,0), B=(6,3)'},{'fact':'forbidden vertical edge endpoints','P lower':'(4,1)','Q upper':'(4,2)'},{'fact':'path count','total':84,'throughEdge':15,'allowed':69}], 'actualSvgPrimitives':{'verticalGridLines':len(vx),'horizontalGridLines':len(hy),'forbiddenEdgeEndpoints':edge,'labelOwnerBindings':labelMath},'observedFacts':{'gridColumns':len(vx)-1,'gridRows':len(hy)-1,'forbiddenEdgeEndpoints':edge,'P':labelMath['P'],'Q':labelMath['Q'],'totalShortestPaths':math.comb(9,3),'pathsThroughForbiddenEdge':math.comb(5,1)*math.comb(3,1),'allowedShortestPaths':math.comb(9,3)-math.comb(5,1)*math.comb(3,1)},'tolerance':0.0}
assert (q12['observedFacts']['totalShortestPaths'],q12['observedFacts']['pathsThroughForbiddenEdge'],q12['observedFacts']['allowedShortestPaths'])==(84,15,69)
# q13 exact eight equal angular points and 4 antipodal pairs
r=parse(13); c=r.find("s:circle[@data-role='circumcircle']",ns); center=(float(c.attrib['cx']),float(c.attrib['cy'])); radius=float(c.attrib['r']); pts=r.findall("s:circle[@data-role='equally-spaced-point']",ns); xy=[(float(e.attrib['cx']),float(e.attrib['cy'])) for e in pts]; ang=sorted((math.degrees(math.atan2(y-center[1],x-center[0]))%360) for x,y in xy); gaps=[(ang[(i+1)%8]-ang[i])%360 for i in range(8)]; ds=r.findall("s:line[@data-role='diameter']",ns); pairs=[]
for e in ds:
 a=(float(e.attrib['x1']),float(e.attrib['y1'])); b=(float(e.attrib['x2']),float(e.attrib['y2'])); pairs.append(e.attrib['data-pair']); assert math.isclose(math.dist(a,b),2*radius,abs_tol=0.002) and math.dist(((a[0]+b[0])/2,(a[1]+b[1])/2),center)<0.002
assert len(pts)==8 and len(ds)==4 and all(math.isclose(math.hypot(x-center[0],y-center[1]),radius,abs_tol=0.002) for x,y in xy) and all(math.isclose(g,45,abs_tol=0.002) for g in gaps)
assert sorted(pairs)==['0,4','1,5','2,6','3,7']
q13={'expectedFacts':[{'fact':'8 equally spaced circumference points','pointCount':8,'angularGapDegrees':45},{'fact':'antipodal diameter pairs','pairs':pairs,'diameterCount':4},{'fact':'right triangle probability','favorable':24,'total':56,'probability':'3/7'}], 'actualSvgPrimitives':{'circumcenter':center,'radius':radius,'points':xy,'angularGapsDegrees':gaps,'diameters':pairs},'observedFacts':{'pointCount':len(pts),'angularGapsDegrees':gaps,'diameterCount':len(ds),'pairs':sorted(pairs),'totalTriples':math.comb(8,3),'rightTriangles':4*6,'probability':'3/7'},'tolerance':0.002}
assert q13['observedFacts']['totalTriples']==56 and q13['observedFacts']['rightTriangles']==24
# XML parse was completed by ET.parse; raster bytes are recorded for manually viewed static render.
result={'schemaVersion':'JS_ARCHIVE_VISUAL_ASSET_RESTORATION_PHYSICAL_EVIDENCE_V1','executionLine':'CODEX','qualityContractVersion':'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','stage':'CREATE','workMode':'QID_SCOPED_VISUAL_ASSET_REAUTHOR','assetRoot':'archive/assets/images/18_금당고_1학기_중간_고2_확률과통계','rows':[{'qid':q,'solutionSha256':hashlib.sha256((assets/f'q{q}-solution.svg').read_bytes()).hexdigest(),'xmlParse':'PASS','staticRasterPath':str((raster/f'q{q}-solution.static.png').relative_to(root)).replace('\\','/'),'staticRasterSha256':hashlib.sha256((raster/f'q{q}-solution.static.png').read_bytes()).hexdigest(),'geometry':g} for q,g in [(11,q11),(12,q12),(13,q13)]], 'actualArchiveBrowserRenderStatus':'NOT_RUN_R1_R2_REBIND_AND_R3_WHOLE_EXAM_RENDER_REQUIRED'}
(ev/'geometry-static-evidence.raw.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'ok':True,'rows':[{'qid':x['qid'],'solutionSha256':x['solutionSha256'],'rasterSha256':x['staticRasterSha256'],'observed':x['geometry']['observedFacts']} for x in result['rows']]},ensure_ascii=False))
