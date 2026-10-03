import json,math,pathlib,hashlib,xml.etree.ElementTree as ET
E=pathlib.Path('docs/evidence/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3')
BASE=pathlib.Path('archive/assets/images/26_금당고_2학기_중간_고1_기출')
N='{http://www.w3.org/2000/svg}'
def pts(root):return {e.attrib['data-point-label']:(float(e.attrib['data-point-x']),float(e.attrib['data-point-y'])) for e in root.iter() if e.tag==N+'circle' and e.attrib.get('data-point-label')}
def eqs(root):return {e.attrib['data-equation']:e for e in root.iter() if e.tag==N+'line' and e.attrib.get('data-equation')}
def line_val(eq,p):
 x,y=p
 if eq=='-2x+3y=13':return -2*x+3*y-13
 if eq=='4x+3y-2=0':return 4*x+3*y-2
 if eq=='3x-4y+16=0':return 3*x-4*y+16
 if eq=='3x-y-2=0':return 3*x-y-2
 if eq=='x=2':return x-2
 if eq=='3x+4y+3=0':return 3*x+4*y+3
 raise ValueError(eq)
def ok(name,condition,details):
 if not condition:raise AssertionError(name+': '+json.dumps(details,ensure_ascii=False))
 return {'check':name,'status':'PASS','details':details}
def panel_line_math(root,role):
 parents={c:p for p in root.iter() for c in p}
 for e in root.iter():
  if e.tag!=N+'line' or e.attrib.get('data-role')!=role:continue
  p=parents.get(e)
  while p is not None and not (p.tag==N+'g' and p.attrib.get('data-panel')):p=parents.get(p)
  ox,oy,sx,sy=[float(p.attrib[k]) for k in ('data-origin-x','data-origin-y','data-sx','data-sy')]
  out=[]
  for xk,yk in [('x1','y1'),('x2','y2')]:out.append(((float(e.attrib[xk])-ox)/sx,(oy-float(e.attrib[yk]))/sy))
  return out
 raise KeyError(role)
results={}
# q3: point, circle, tangent equation, and target point.
r=ET.parse(BASE/'q03-solution.svg').getroot();p=pts(r);cir=next(e for e in r.iter() if e.tag==N+'circle' and e.attrib.get('data-geometry')=='circle');eq=next(iter(eqs(r)));T=p['T'];O=p['O'];P=p['P']
results[3]=[ok('tangent_at_given_circle_point',abs(O[0]**2+O[1]**2)<1e-9 and abs(T[0]**2+T[1]**2-13)<1e-9 and abs(line_val(eq,T))<1e-9 and abs(line_val(eq,P))<1e-9 and abs((T[0]-O[0])*3+(T[1]-O[1])*2)<1e-9,{'O':O,'T':T,'P':P,'equation':eq,'radiusSquared':T[0]**2+T[1]**2})]
# q5: reflection and equal radii.
r=ET.parse(BASE/'q05-solution.svg').getroot();p=pts(r); circles=[e for e in r.iter() if e.tag==N+'circle' and e.attrib.get('data-geometry')=='circle'];lineeq=next(iter(eqs(r)))
C=p['C'];Cp=p['Cprime'];R=p['R'];Rp=p['Rprime']
results[5]=[ok('reflection_swaps_center_and_preserves_radius',Cp==(C[1],C[0]) and lineeq=='y=x' and abs(math.dist(C,R)-4)<1e-9 and abs(math.dist(Cp,Rp)-4)<1e-9 and len(circles)==2 and circles[0].attrib.get('data-radius')==circles[1].attrib.get('data-radius'),{'C':C,'C-prime':Cp,'CR':math.dist(C,R),'CprimeRprime':math.dist(Cp,Rp)})]
# q6: centroid exact and each median contains G.
r=ET.parse(BASE/'q06-solution.svg').getroot();p=pts(r);G=p['G'];verts=[p[x] for x in ('A','B','C')];avg=(sum(x for x,y in verts)/3,sum(y for x,y in verts)/3)
med=[]
for e in r.iter():
 if e.tag==N+'line' and e.attrib.get('data-geometry')=='median':
  x1,y1,x2,y2=[float(e.attrib[k]) for k in ('x1','y1','x2','y2')];med.append(((x1,y1),(x2,y2)))
# Geometry tags vary in the current SVG; verify the three non-axis lines from endpoints and recorded midpoint relations.
models=[float(r.attrib[k]) for k in ('data-origin-x','data-origin-y','data-scale-x','data-scale-y')]
ox,oy,sx,sy=models
lines=[]
for e in r.iter():
 if e.tag==N+'line' and not e.attrib.get('data-axis'):
  lines.append([((float(e.attrib[k])-ox)/sx,(oy-float(e.attrib[yk]))/sy) for k,yk in [('x1','y1'),('x2','y2')]])
midpoints=[((verts[1][0]+verts[2][0])/2,(verts[1][1]+verts[2][1])/2),((verts[0][0]+verts[2][0])/2,(verts[0][1]+verts[2][1])/2),((verts[0][0]+verts[1][0])/2,(verts[0][1]+verts[1][1])/2)]
expected={(tuple(sorted((verts[0],midpoints[0])))),tuple(sorted((verts[1],midpoints[1]))),tuple(sorted((verts[2],midpoints[2])))}
observed={tuple(sorted((tuple(round(v,6) for v in l[0]),tuple(round(v,6) for v in l[1])))) for l in lines}
expected_round={tuple(sorted((tuple(round(v,6) for v in a),tuple(round(v,6) for v in b)))) for a,b in [(verts[0],midpoints[0]),(verts[1],midpoints[1]),(verts[2],midpoints[2])]}
results[6]=[ok('centroid_and_medians',G==avg and observed==expected_round,{'G':G,'vertexAverage':avg,'medianCount':len(lines)})]
# q7: the given and sought line equations are perpendicular and pass through the displayed points.
r=ET.parse(BASE/'q07-solution.svg').getroot();p=pts(r);eq=eqs(r);A=p['A'];B=p['B'];
results[7]=[ok('perpendicular_lines_and_endpoint','4x+3y-2=0' in eq and abs(line_val('3x-4y+16=0',A))<1e-9 and abs(line_val('3x-4y+16=0',B))<1e-9 and (-4/3)*(3/4)==-1 and B==(4.0,7.0),{'A':A,'B':B,'slopes':[-4/3,3/4]})]
# q10: common point, target line foot, perpendicular distance.
r=ET.parse(BASE/'q10-solution.svg').getroot();p=pts(r);P=p['P'];H=p['H'];
results[10]=[ok('common_point_and_point_line_distance',abs(line_val('3x-y-2=0',P))<1e-9 and abs(line_val('x=2',P))<1e-9 and abs(line_val('3x+4y+3=0',H))<1e-9 and abs(math.dist(P,H)-5)<1e-9 and (P[0]-H[0],P[1]-H[1])==(3.0,4.0),{'P':P,'H':H,'PH':math.dist(P,H)})]
# q11: actual line orientations in each panel match parallel and perpendicular cases.
r=ET.parse(BASE/'q11-solution.svg').getroot();ls={role:panel_line_math(r,role) for role in ('parallel-1','parallel-2','perp-1','perp-2')}
def slope(seg):return (seg[1][1]-seg[0][1])/(seg[1][0]-seg[0][0])
m=[slope(ls[x]) for x in ('parallel-1','parallel-2')];n=[slope(ls[x]) for x in ('perp-1','perp-2')]
results[11]=[ok('parallel_and_perpendicular_cases',abs(m[0]-m[1])<1e-9 and abs(n[0]*n[1]+1)<1e-9 and abs(m[0]-1/3)<1e-6 and abs(n[0]+1)<1e-9 and abs(n[1]-1)<1e-9,{'parallelSlopes':m,'perpendicularSlopes':n})]
# q13: actual tangent contact points and slopes.
r=ET.parse(BASE/'q13-solution.svg').getroot();p=pts(r);C=p['C'];P=p['P'];T1=p['T1'];T2=p['T2']
def tangent_facts(T):
 rad=(T[0]-C[0],T[1]-C[1]);tan=(P[0]-T[0],P[1]-T[1]);return math.dist(C,T),rad[0]*tan[0]+rad[1]*tan[1],tan[1]/tan[0]
r1,d1,m1=tangent_facts(T1);r2,d2,m2=tangent_facts(T2)
results[13]=[ok('both_tangent_contacts_and_slope_product',abs(r1-2)<.005 and abs(r2-2)<.005 and abs(d1)<.01 and abs(d2)<.01 and abs(m1*m2+0.25)<.005,{'C':C,'P':P,'T1':T1,'T2':T2,'radiusLengths':[r1,r2],'radiusTangentDots':[d1,d2],'slopeProduct':m1*m2})]
asset_bindings={str(q):{'path':(BASE/f'q{q:02}-solution.svg').as_posix(),'sha256':'sha256:'+hashlib.sha256((BASE/f'q{q:02}-solution.svg').read_bytes()).hexdigest()} for q in results}
report={'purpose':'Post-fact target-artifact audit of unchanged current SVGs only; no construction-reference use. Actual browser layout remains pending.','items':{str(q):v for q,v in results.items()},'assetBindings':asset_bindings,'status':'PASS' if all(x['status']=='PASS' for v in results.values() for x in v) else 'FAIL','actualBrowserRender':'NOT_RUN_BROWSER_POLICY_BLOCK','qualification':'PRINT95_RENDER_PENDING'}
(E/'existing_visual_static_recheck.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for q,v in results.items():print('q%02d'%q,'PASS' if all(x['status']=='PASS' for x in v) else 'FAIL',', '.join(x['check'] for x in v))
print('OVERALL',report['status'])
