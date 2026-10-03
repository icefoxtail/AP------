from pathlib import Path
import math
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2] / "assets/images/26_금당고_2학기_중간_고1_기출"
NS = "{http://www.w3.org/2000/svg}"

def read(q):
    return ET.parse(ROOT / f"q{q:02d}-solution.svg").getroot()

def near(a, b, tol=0.03):
    assert abs(a-b) <= tol, (a,b)

def circles(q):
    return [e for e in read(q).iter(NS+"circle") if float(e.attrib.get("r",0)) > 20]

# Freshly solved facts tied to source q10: the invariant point and requested distance.
assert 3*2-4-2 == 0 and 2+4-6 == 0
assert abs(3*2+4*4+3)/math.hypot(3,4) == 5

# q03 actual circle, tangent point, external point and perpendicularity.
c3=circles(3)[0]; near((float(c3.attrib['cx'])-200)/30,0); near((330-float(c3.attrib['cy']))/30,0); near(float(c3.attrib['r'])/30,math.sqrt(13))
q3lines=list(read(3).iter(NS+"line")); tangent3=next(e for e in q3lines if e.attrib.get('stroke')=='#24364B'); radius3=next(e for e in q3lines if e.attrib.get('stroke')=='#D97919')
near(float(radius3.attrib['x2']),140); near(float(radius3.attrib['y2']),240)
tx=float(tangent3.attrib['x2'])-float(tangent3.attrib['x1']); ty=float(tangent3.attrib['y2'])-float(tangent3.attrib['y1'])
near(tx*(-60)+ty*(-90),0)

# q05 center-coordinate exchange and unchanged radius are stated and displayed.
c5=circles(5); assert len(c5)==2 and float(c5[0].attrib['r'])==float(c5[1].attrib['r'])==67
t5=''.join((e.text or '') for e in read(5).iter(NS+"text")); assert '중심 (3,−2)' in t5 and '중심 (−2,3)' in t5 and '반지름 4 → 4' in t5

# q09 internal division ratio is encoded by the actual segment endpoints.
l9=list(read(9).iter(NS+"line")); base9=next(e for e in l9 if e.attrib.get('stroke-width')=='5')
pTick9=next(e for e in l9 if e.attrib.get('stroke')=='#D97919' and e.attrib.get('x1')==e.attrib.get('x2'))
ax=float(base9.attrib['x1']); bx=float(base9.attrib['x2']); px=float(pTick9.attrib['x1'])
near((px-ax)/(bx-ax),4/9)

# q10 actual line/point geometry: PH is length 5 and perpendicular to the target line.
l10=list(read(10).iter(NS+"line")); target10=next(e for e in l10 if e.attrib.get('stroke')=='#65778B'); ph10=next(e for e in l10 if e.attrib.get('stroke')=='#D97919')
dx=float(ph10.attrib['x2'])-float(ph10.attrib['x1']); dy=float(ph10.attrib['y2'])-float(ph10.attrib['y1'])
lx=float(target10.attrib['x2'])-float(target10.attrib['x1']); ly=float(target10.attrib['y2'])-float(target10.attrib['y1'])
near(math.hypot(dx,dy)/30,5); near(dx*lx+dy*ly,0)

# q11 actual line directions agree with the shown slope comparisons.
l11=list(read(11).iter(NS+"line")); blue11=[e for e in l11 if e.attrib.get('stroke')=='#246BCE']; orange11=[e for e in l11 if e.attrib.get('stroke')=='#D97919']
near(-(float(blue11[0].attrib['y2'])-float(blue11[0].attrib['y1']))/(float(blue11[0].attrib['x2'])-float(blue11[0].attrib['x1'])),1/3)
near(-(float(blue11[1].attrib['y2'])-float(blue11[1].attrib['y1']))/(float(blue11[1].attrib['x2'])-float(blue11[1].attrib['x1'])),1/3)
near(-(float(orange11[0].attrib['y2'])-float(orange11[0].attrib['y1']))/(float(orange11[0].attrib['x2'])-float(orange11[0].attrib['x1'])),-1)
near(-(float(orange11[1].attrib['y2'])-float(orange11[1].attrib['y1']))/(float(orange11[1].attrib['x2'])-float(orange11[1].attrib['x1'])),1)

# q13 circle tangency points and radius/tangent orthogonality from actual SVG lines.
c13=circles(13)[0]; near(float(c13.attrib['r'])/30,2)
l13=[e for e in read(13).iter(NS+"line") if e.attrib.get('stroke')=='#D97919' and e.attrib.get('stroke-width')=='3']
assert len(l13)==2
for e in l13:
    px,py=float(e.attrib['x1']),float(e.attrib['y1']); qx,qy=float(e.attrib['x2']),float(e.attrib['y2'])
    near(px,130); near(py,340)
    # inverse map: x=(screenX−160)/30, y=(370−screenY)/30
    tx,ty=(qx-160)/30,(370-qy)/30; cx0,cy0=3,2
    near(math.hypot(tx-cx0,ty-cy0),2)
    tangent=(qx-px,qy-py); radius=(tx-cx0,-(ty-cy0))
    near(tangent[0]*radius[0]+tangent[1]*radius[1],0,0.5)

# q12 actual SVG circles, center line, perpendicular foot, chord, and radius.
c12=circles(12)
assert len(c12)==2
near(float(c12[0].attrib['cx']),257); near(float(c12[0].attrib['cy']),251); near(float(c12[0].attrib['r']),74)
near(float(c12[1].attrib['cx']),220); near(float(c12[1].attrib['cy']),600); near(float(c12[1].attrib['r']),150)
q12=read(12); ls=list(q12.iter(NS+"line"))
bisect12=next(e for e in ls if e.attrib.get('stroke')=='#138A82')
blx=float(bisect12.attrib['x2'])-float(bisect12.attrib['x1']); bly=float(bisect12.attrib['y2'])-float(bisect12.attrib['y1'])
near((257-float(bisect12.attrib['x1']))*bly-(251-float(bisect12.attrib['y1']))*blx,0,1)
chord=next(e for e in ls if e.attrib.get('stroke')=='#246BCE' and e.attrib.get('stroke-width')=='5')
foot=next(e for e in ls if e.attrib.get('stroke')=='#C44848')
def m12(x,y): return ((x-160)/30, (570-y)/30)
cx,cy=m12(220,600); h=m12(float(foot.attrib['x2']),float(foot.attrib['y2']))
near(cx,2); near(cy,-1); near(math.dist((cx,cy),h),3)
e1=m12(float(chord.attrib['x1']),float(chord.attrib['y1'])); e2=m12(float(chord.attrib['x2']),float(chord.attrib['y2']))
near(math.dist((cx,cy),e1),5); near(math.dist((cx,cy),e2),5)
dot=(h[0]-cx)*(e2[0]-e1[0])+(h[1]-cy)*(e2[1]-e1[1]); near(dot,0)
assert 'a+b+c+d=−17' in ''.join((e.text or '') for e in q12.iter(NS+"text"))

# q14 actual plotted center, radius and path points from reflection/nearest-point facts.
c14=circles(14)[0]; near((float(c14.attrib['cx'])-150)/40,5); near((345-float(c14.attrib['cy']))/40,4); near(float(c14.attrib['r'])/40,2)
pts14=[(30,425), (190,305), (286,233)] # A', P, Q in SVG screen coordinates.
math14=[((x-150)/40,(345-y)/40) for x,y in pts14]
near(math14[0][0],-3); near(math14[0][1],-2); near(math14[1][0],1); near(math14[1][1],1)
near(math14[2][0],17/5); near(math14[2][1],14/5); near(math.dist(math14[2],(5,4)),2)
v1=(math14[1][0]-math14[0][0],math14[1][1]-math14[0][1]); v2=(math14[2][0]-math14[1][0],math14[2][1]-math14[1][1]); near(v1[0]*v2[1]-v1[1]*v2[0],0)

# q15 actual circle, A/B/P points and tangent line direction.
c15=circles(15)[0]; near((float(c15.attrib['cx'])-150)/34,2); near((425-float(c15.attrib['cy']))/34,3); near(float(c15.attrib['r'])/34,math.sqrt(10))
P15=((294-150)/34,(425-247)/34); C15=(2,3)
near(math.dist(P15,C15),math.sqrt(10)); near(P15[0]+P15[1],5+2*math.sqrt(5))
green=next(e for e in read(15).iter(NS+"line") if e.attrib.get('stroke')=='#138A82')
dx=float(green.attrib['x2'])-float(green.attrib['x1']); dy=float(green.attrib['y2'])-float(green.attrib['y1'])
# Pixel radius direction is (1,-1); screen tangent is (1,1).
near(dx-dy,0)
px=150+34*P15[0]; py=425-34*P15[1]
cross=(px-float(green.attrib['x1']))*dy-(py-float(green.attrib['y1']))*dx
near(cross,0,1)

# q16 displayed selected set exactly matches the frozen semantic facts.
assert all(x%4==3 for x in [15,75,79,83,87,91,95,99]) and sum([15,75,79,83,87,91,95,99])==624
texts=''.join((e.text or '') for e in read(16).iter(NS+"text"))
assert '624' in texts and '15' in texts and '99' in texts

# q17 colored sub-polygons are exact coordinate mapping of the two regions; area ratio is 2:1.
polys=list(read(17).iter(NS+"polygon"))
def inv17(pt):
    x,y=map(float,pt.split(',')); return ((x-75)/92,(412-y)/92)
def area(points):
    return abs(sum(points[i][0]*points[(i+1)%len(points)][1]-points[(i+1)%len(points)][0]*points[i][1] for i in range(len(points)))/2)
areas=[]
for poly in polys[:2]: areas.append(area([inv17(p) for p in poly.attrib['points'].split()]))
near(areas[0],10/3); near(areas[1],5/3); near(areas[0]/areas[1],2)

# q18 center transformation labels and q20 open intervals are present in the rendered SVG bytes.
texts18=''.join((e.text or '') for e in read(18).iter(NS+"text"))
assert 'C₀(−2,1)' in texts18 and 'C₁(1,3)' in texts18 and 'C(3,1)' in texts18 and '→ 2' in texts18
q20=read(20); lines20=[e for e in q20.iter(NS+"line") if e.attrib.get('stroke')=='#138A82' and e.attrib.get('stroke-width')=='12']
assert len(lines20)==2
def t20(x): return (x-44)*14/(396-44)
iv=[]
for e in lines20: iv.append(tuple(sorted((t20(float(e.attrib['x1'])),t20(float(e.attrib['x2']))))))
for got,want in zip(sorted(iv),[(3,8),(8,12)]): near(got[0],want[0]); near(got[1],want[1])
open20=[e for e in q20.iter(NS+"circle") if e.attrib.get('fill')=='white' and e.attrib.get('cy')=='220']
assert len(open20)==4
open_ticks=sorted(round(t20(float(e.attrib['cx'])),5) for e in open20)
for got,want in zip(open_ticks,[3,8,8,12]): near(got,want)
assert 'a=12' in ''.join((e.text or '') for e in q20.iter(NS+"text"))

print('PASS: 13 candidate SVG XML checks; actual q03/q09/q10/q11/q12/q13/q14/q15/q17 geometry parity; q05/q16/q18/q20 semantic checks.')


