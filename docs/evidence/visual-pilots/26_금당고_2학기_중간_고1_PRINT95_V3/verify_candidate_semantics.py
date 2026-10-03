import json, math, pathlib, re, xml.etree.ElementTree as ET
from fractions import Fraction as F
E=pathlib.Path('docs/evidence/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3')
M=json.loads((E/'candidate_manifest.json').read_text(encoding='utf-8'))
NS='{http://www.w3.org/2000/svg}'
def val(s):
 s=str(s).replace('−','-').strip()
 z=re.fullmatch(r'([+-]?\d+(?:\.\d+)?)\s*([+-])\s*sqrt\((\d+(?:\.\d+)?)\)',s)
 if z:return float(z.group(1))+(1 if z.group(2)=='+' else -1)*math.sqrt(float(z.group(3)))
 try:return float(F(s))
 except:return float(s)
def parent_map(root):return {c:p for p in root.iter() for c in p}
def grp_of(e,parents):
 p=parents.get(e)
 while p is not None:
  if p.tag==NS+'g' and p.attrib.get('data-origin-x') is not None:return p
  p=parents.get(p)
 raise ValueError('point has no coordinate model')
def model(g):return tuple(float(g.attrib[k]) for k in ('data-origin-x','data-origin-y','data-sx','data-sy'))
def point(root,label,panel=None):
 parents=parent_map(root)
 for e in root.iter():
  if e.tag!=NS+'circle' or e.attrib.get('data-point-label')!=label:continue
  g=grp_of(e,parents)
  if panel and g.attrib.get('data-panel')!=panel:continue
  return (val(e.attrib['data-point-x']),val(e.attrib['data-point-y']))
 raise KeyError(label)
def screen(root,label,panel=None):
 parents=parent_map(root)
 for e in root.iter():
  if e.tag==NS+'circle' and e.attrib.get('data-point-label')==label:
   g=grp_of(e,parents)
   if panel and g.attrib.get('data-panel')!=panel:continue
   return (float(e.attrib['cx']),float(e.attrib['cy']))
 raise KeyError(label)
def dist(a,b):return math.hypot(a[0]-b[0],a[1]-b[1])
def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
def area(poly):return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly))))/2
def line_eval(eq,p):
 eq=eq.replace('−','-').replace(' ','').replace('sqrt','SQRT')
 # Current candidate equations are one of these explicitly authored forms.
 if eq=='3x-4y+5=0':return 3*p[0]-4*p[1]+5
 if eq=='x+y-1=0':return p[0]+p[1]-1
 if eq=='x+y-5-2SQRT(5)=0':return p[0]+p[1]-5-2*math.sqrt(5)
 if eq=='x-2y+4=0':return p[0]-2*p[1]+4
 if eq=='x-2y-6=0':return p[0]-2*p[1]-6
 if eq=='2x+y-9=0':return 2*p[0]+p[1]-9
 raise ValueError('unknown equation '+eq)
def line_by_owner(root,owner):
 return [e for e in root.iter() if e.tag==NS+'line' and e.attrib.get('data-owner')==owner]
def polygon_math(root,owner):
 parents=parent_map(root)
 for e in root.iter():
  if e.tag!=NS+'polygon' or e.attrib.get('data-owner')!=owner:continue
  g=grp_of(e,parents);ox,oy,sx,sy=model(g)
  nums=[float(x) for x in re.findall(r'[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',e.attrib['points'])]
  return [((nums[i]-ox)/sx,(oy-nums[i+1])/sy) for i in range(0,len(nums)-1,2)]
 raise KeyError(owner)
def pass_eq(name,condition,details):
 if not condition: raise AssertionError(name+': '+json.dumps(details,ensure_ascii=False))
 return {'check':name,'status':'PASS','details':details}
checks={}
# q1 open interval / included integer marks.
r=ET.parse(pathlib.Path(M['candidates'][0]['path'])).getroot(); marks={int(e.attrib['data-k']):e.attrib['data-interval-endpoint'] for e in r.iter() if e.tag==NS+'circle' and e.attrib.get('data-k')}
checks[1]=[pass_eq('strict_integer_marks',marks=={-1:'open',0:'closed',1:'closed',2:'closed',3:'closed',4:'closed',5:'open'},marks)]
# q4 exact displacement.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q04-candidate.svg').getroot();a=point(r,'A');b=point(r,'B');d=(b[0]-a[0],b[1]-a[1])
checks[4]=[pass_eq('translation_vector',(d==(1.0,4.0)),{'A':a,'B':b,'B-A':d})]
# q9 collinearity/order/ratio using exact coordinates.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q09-candidate.svg').getroot();a=point(r,'A');p=point(r,'P');b=point(r,'B');d1=dist(a,p);d2=dist(p,b)
checks[9]=[pass_eq('internal_4_to_5_division',abs(cross(a,p,b))<1e-9 and d1<d2 and abs(d1/d2-4/5)<1e-9,{'A':a,'P':p,'B':b,'AP/PB':d1/d2})]
# q12 center line and chord 3-4-5.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q12-candidate.svg').getroot(); c1=point(r,'C1','C1');O=point(r,'O','C2-chord');H=point(r,'H','C2-chord');A=point(r,'A','C2-chord');B=point(r,'B','C2-chord')
line1=[e for e in line_by_owner(r,'bisecting-line-through-C1')][0]; eq=line1.attrib['data-equation'];c2checks=[]
c2checks.append(pass_eq('C1_bisector_through_center',abs(line_eval(eq,c1))<1e-9,{'C1':c1,'equation':eq,'lineValue':line_eval(eq,c1)}))
c2checks.append(pass_eq('C2_chord_3_4_5',abs(dist(O,H)-3)<1e-9 and abs(dist(A,H)-4)<1e-9 and abs(dist(B,H)-4)<1e-9 and abs(dist(O,A)-5)<1e-9 and abs(cross(A,H,B))<1e-9 and abs((O[0]-H[0])*(B[0]-A[0])+(O[1]-H[1])*(B[1]-A[1]))<1e-9,{'O':O,'H':H,'A':A,'B':B,'OH':dist(O,H),'AH':dist(A,H),'BH':dist(B,H),'OA':dist(O,A)}))
checks[12]=c2checks
# q14 reflection, straightened collinearity, nearest circle point, triangle area.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q14-candidate.svg').getroot();a=point(r,'A','reflection-plane');ap=point(r,'A′','reflection-plane');p=point(r,'P0','reflection-plane');q=point(r,'Q0','reflection-plane');c=point(r,'C','reflection-plane')
checks[14]=[
 pass_eq('reflection_swap',ap==(a[1],a[0]),{'A':a,'A-prime':ap}),
 pass_eq('straightened_order',abs(cross(ap,p,q))<1e-9 and abs(cross(ap,q,c))<1e-9 and dist(ap,p)<dist(ap,q)<dist(ap,c),{'A-prime':ap,'P0':p,'Q0':q,'C':c}),
 pass_eq('nearest_circle_point_and_area',abs(dist(c,q)-2)<1e-9 and abs(p[0]-p[1])<1e-9 and abs(area([a,p,q])-21/10)<1e-9,{'CQ0':dist(c,q),'P0':p,'area':area([a,p,q])})]
# q15 base, far radial point, circle radius and tangent.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q15-candidate.svg').getroot();a=point(r,'A');b=point(r,'B');c=point(r,'C');pm=point(r,'P−');pp=point(r,'P+')
tangent=next(e.attrib['data-equation'] for e in r.iter() if e.tag==NS+'line' and e.attrib.get('data-owner')=='tangent-at-P-plus')
checks[15]=[
 pass_eq('fixed_base_line',abs(a[0]+a[1]-1)<1e-9 and abs(b[0]+b[1]-1)<1e-9,{'A':a,'B':b}),
 pass_eq('farthest_circle_point',abs(dist(c,pp)-math.sqrt(10))<1e-9 and abs(dist(c,pm)-math.sqrt(10))<1e-9 and abs((pp[0]-c[0])*(b[0]-a[0])+(pp[1]-c[1])*(b[1]-a[1]))<1e-9,{'C':c,'P-minus':pm,'P-plus':pp,'radius':dist(c,pp)}),
 pass_eq('tangent_at_selected_point',abs(line_eval(tangent,pp))<1e-9,{'equation':tangent,'P-plus':pp,'lineValue':line_eval(tangent,pp)})]
# q17 actual region polygons and point incidence.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q17-candidate.svg').getroot();A=point(r,'A');B=point(r,'B');C=point(r,'C');D=point(r,'D');P=point(r,'P');Q=point(r,'Q');apqd=polygon_math(r,'region:APQD');pbcq=polygon_math(r,'region:PBCQ')
checks[17]=[
 pass_eq('cut_point_incidence',abs(cross(A,P,B))<1e-9 and abs(cross(D,Q,C))<1e-9,{'A':A,'P':P,'Q':Q,'B':B,'D':D,'C':C}),
 pass_eq('region_area_ratio',abs(area(apqd)-10/3)<1e-5 and abs(area(pbcq)-5/3)<1e-5 and abs(area(apqd)/area(pbcq)-2)<1e-5,{'APQD_area':area(apqd),'PBCQ_area':area(pbcq),'ratio':area(apqd)/area(pbcq)}),
 pass_eq('optimal_segment_length',abs((Q[0]-P[0])**2+(Q[1]-P[1])**2-5)<1e-9,{'PQ_squared':(Q[0]-P[0])**2+(Q[1]-P[1])**2})]
# q18 transformations and signed offsets.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q18-candidate.svg').getroot();c0=point(r,'C0','center-transformations');c1=point(r,'C1','center-transformations');c=point(r,'C','C2-chord') if False else point(r,'C','center-transformations');h=point(r,'H','signed-parallel-lines');j=point(r,'J','signed-parallel-lines')
linep=next(e.attrib['data-equation'] for e in r.iter() if e.tag==NS+'line' and e.attrib.get('data-owner')=='positive-intercept-line');linen=next(e.attrib['data-equation'] for e in r.iter() if e.tag==NS+'line' and e.attrib.get('data-owner')=='negative-intercept-line');line_minus=next(e for e in r.iter() if e.tag==NS+'line' and e.attrib.get('data-owner')=='negative-intercept-line');ym_screen=screen(r,'Y-','signed-parallel-lines')
checks[18]=[
 pass_eq('center_transformations',c1==(c0[0]+3,c0[1]+2) and c==(c1[1],c1[0]),{'C0':c0,'C1':c1,'C':c}),
 pass_eq('two_signed_parallel_distances',abs(line_eval(linep,h))<1e-9 and abs(line_eval(linen,j))<1e-9 and abs(dist(c,h)-math.sqrt(5))<1e-9 and abs(dist(c,j)-math.sqrt(5))<1e-9,{'H':h,'J':j,'CH':dist(c,h),'CJ':dist(c,j),'positiveEquation':linep,'negativeEquation':linen}),
 pass_eq('negative_intercept_marker_bound_to_line',abs(float(line_minus.attrib['x1'])-ym_screen[0])<1e-6 and abs(float(line_minus.attrib['y1'])-ym_screen[1])<1e-6,{'Y-minus-screen':ym_screen,'negative-line-start':[float(line_minus.attrib['x1']),float(line_minus.attrib['y1'])]}),
 pass_eq('positive_intercept_selected',linep=='x-2y+4=0' and linen=='x-2y-6=0',{'positiveYIntercept':2,'negativeYIntercept':-3})]
# q20 interval endpoint topology and maximal window.
r=ET.parse('archive/candidates/visual-pilots/26_금당고_2학기_중간_고1_PRINT95_V3/q20-candidate.svg').getroot();marks={int(e.attrib['data-t']):e.attrib['data-interval-endpoint'] for e in r.iter() if e.tag==NS+'circle' and e.attrib.get('data-t')};segments=[e.attrib.get('data-owner','') for e in r.iter() if e.tag==NS+'line']
checks[20]=[pass_eq('open_interval_topology',marks=={3:'open',8:'open',12:'open',10:'open'},marks),pass_eq('two_components_and_rightmost_window',any('(3,8)' in x for x in segments) and any('(8,12)' in x for x in segments) and any('(10,12)' in x for x in segments),segments)]
# Serialize final independent parity evidence.
summary={str(q):items for q,items in checks.items()}
report={'status':'PASS' if all(x['status']=='PASS' for v in checks.values() for x in v) else 'FAIL','independentInputRef':'independent_math_facts.json','candidateRef':'candidate_manifest.json','questionCount':len(checks),'checks':summary,'actualBrowserRender':'NOT_RUN_BROWSER_POLICY_BLOCK','qualification':'PRINT95_RENDER_PENDING'}
(E/'candidate_semantic_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for q,items in checks.items():print('q%02d'%q, 'PASS' if all(x['status']=='PASS' for x in items) else 'FAIL', ', '.join(x['check'] for x in items))
print('OVERALL',report['status'])
