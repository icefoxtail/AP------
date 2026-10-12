from pathlib import Path
import xml.etree.ElementTree as ET
import json, math, itertools
ROOT=Path.cwd(); d=ROOT/'archive/assets/images/18_금당고_1학기_중간_고2_확률과통계'; out=ROOT/'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1_18_geumdang_visual_geometry_parity.json'; ns={'s':'http://www.w3.org/2000/svg'}
def tree(q): return ET.parse(d/f'q{q}-solution.svg').getroot()
def area(poly):
    return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))/2)
def coords_list(s): return [tuple(map(float,p.split(','))) for p in s.split()]
# q11 reconstruct mathematical points from actual SVG pixel primitives.
r=tree(11); x0,y0,side=72.0,62.0,300.0
def inv11(x,y): return ((x-x0)/side,1-(y-y0)/side)
valid_px=coords_list(r.find("s:polygon[@id='valid-region']",ns).attrib['points']); valid_math=[inv11(*p) for p in valid_px]
excluded=[inv11(*p) for poly in r.findall("s:polygon[@data-role='excluded-region']",ns) for p in coords_list(poly.attrib['points'])]
exc_els=r.findall("s:polygon[@data-role='excluded-region']",ns); exc_areas=[area([inv11(*p) for p in coords_list(e.attrib['points'])]) for e in exc_els]
lines={e.attrib['data-role']:e.attrib for e in r.findall('s:line',ns) if e.attrib.get('data-role','').startswith('boundary-')}
boundary_facts={}
for role,a in lines.items():
    p1=inv11(float(a['x1']),float(a['y1'])); p2=inv11(float(a['x2']),float(a['y2']))
    intercept=p1[1]-p1[0]; slope=(p2[1]-p1[1])/(p2[0]-p1[0]); boundary_facts[role]={'mathEndpoints':[p1,p2],'slope':slope,'intercept':intercept}
area_valid=area(valid_math)
assert len(exc_areas)==2 and all(math.isclose(v,2/9,abs_tol=1e-9) for v in exc_areas)
assert math.isclose(area_valid,5/9,abs_tol=1e-9)
assert math.isclose(boundary_facts['boundary-upper']['slope'],1,abs_tol=1e-9) and math.isclose(boundary_facts['boundary-upper']['intercept'],1/3,abs_tol=1e-9)
assert math.isclose(boundary_facts['boundary-lower']['slope'],1,abs_tol=1e-9) and math.isclose(boundary_facts['boundary-lower']['intercept'],-1/3,abs_tol=1e-9)
# q12 actual grid primitives and forbidden edge inverse map.
r=tree(12); vx=r.findall('.//s:line[@data-grid-vertical]',ns); hy=r.findall('.//s:line[@data-grid-horizontal]',ns); fe=r.find("s:line[@data-role='forbidden-edge']",ns); assert len(vx)==7 and len(hy)==4
x1,y1,x2,y2=[float(fe.attrib[k]) for k in ['x1','y1','x2','y2']]
def inv12(x,y): return ((x-70)/55,3-(y-70)/55)
edge=[inv12(x1,y1),inv12(x2,y2)]; assert {tuple(round(t,9) for t in p) for p in edge}=={(4.0,1.0),(4.0,2.0)}
total=math.comb(9,3); through=math.comb(5,1)*math.comb(3,1); allowed=total-through; assert (total,through,allowed)==(84,15,69)
# q13 actual circle, eight points and four opposite-point diameter primitives.
r=tree(13); c=r.find("s:circle[@data-role='circumcircle']",ns); center=(float(c.attrib['cx']),float(c.attrib['cy'])); radius=float(c.attrib['r']); pe=r.findall("s:circle[@data-role='equally-spaced-point']",ns); xy=[(float(e.attrib['cx']),float(e.attrib['cy'])) for e in pe]; angles=sorted((math.degrees(math.atan2(y-center[1],x-center[0]))%360) for x,y in xy); gaps=[(angles[(i+1)%8]-angles[i])%360 for i in range(8)]; diam=r.findall("s:line[@data-role='diameter']",ns);
assert len(pe)==8 and len(diam)==4 and all(math.isclose(math.hypot(x-center[0],y-center[1]),radius,abs_tol=0.002) for x,y in xy) and all(math.isclose(g,45,abs_tol=0.002) for g in gaps)
for e in diam:
    a=(float(e.attrib['x1']),float(e.attrib['y1'])); b=(float(e.attrib['x2']),float(e.attrib['y2'])); assert math.isclose((a[0]+b[0])/2,center[0],abs_tol=0.002) and math.isclose((a[1]+b[1])/2,center[1],abs_tol=0.002) and math.isclose(math.dist(a,b),2*radius,abs_tol=0.002)
triples=math.comb(8,3); right=4*6; assert (triples,right)==(56,24)
result={'schemaVersion':'JS_ARCHIVE_R1_VISUAL_GEOMETRY_PARITY_V1','reviewer':'codex-r1-18-geumdang-20261012','items':{'q11':{'status':'PASS','observedValidArea':area_valid,'expectedValidArea':5/9,'observedExcludedTriangleAreas':exc_areas,'boundaryFacts':boundary_facts,'primitiveSource':'q11-solution.svg actual polygons and lines'},'q12':{'status':'PASS','observedGridColumns':len(vx)-1,'observedGridRows':len(hy)-1,'observedForbiddenEdgeMathEndpoints':edge,'totalShortestPaths':total,'pathsThroughForbiddenEdge':through,'allowedShortestPaths':allowed,'primitiveSource':'q12-solution.svg actual grid/edge lines'},'q13':{'status':'PASS','observedCircumcenter':center,'observedRadius':radius,'observedPointCount':len(pe),'observedAngularGapsDegrees':gaps,'observedDiameterCount':len(diam),'totalTriples':triples,'rightTriangles':right,'probability':'3/7','primitiveSource':'q13-solution.svg actual circle/point/diameter primitives'}},'archiveBrowserRenderStatus':'NOT_RUN_R1_RENDER_OWNED_BY_R3','method':'Reparsed final SVG bytes and derived facts from primitive coordinates; compared with independent source/frozen-solution facts.'}
out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result,ensure_ascii=False))


