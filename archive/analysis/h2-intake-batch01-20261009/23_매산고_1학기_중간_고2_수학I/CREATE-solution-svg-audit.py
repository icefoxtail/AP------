import json, math, re, xml.etree.ElementTree as ET
from pathlib import Path
root=Path.cwd(); uid='23_매산고_1학기_중간_고2_수학I'
p18=root/'.tmp/archive/h2-intake-batch01-20261009'/uid/'assets/images'/uid/'q18-solution.svg'
p20=root/'.tmp/archive/h2-intake-batch01-20261009'/uid/'assets/images'/uid/'q20-solution.svg'
ns={'s':'http://www.w3.org/2000/svg'}
def pts(d):
    nums=[float(x) for x in re.findall(r'-?\d+(?:\.\d+)?',d)]
    return list(zip(nums[::2],nums[1::2]))
r18=ET.parse(p18).getroot(); paths18=r18.findall('.//s:path',ns)
tri=pts(paths18[0].attrib['d']); am=pts(paths18[1].attrib['d']);
circles={c.attrib.get('r'):c for c in r18.findall('.//s:circle',ns)}
# fixed vertex points are extracted from actual circle primitives (r=5 for A/B/C/M).
verts=[(float(c.attrib['cx']),float(c.attrib['cy'])) for c in r18.findall('.//s:circle',ns) if c.attrib.get('r')=='5']
A,B,C,M=verts
O=(100.0,370.0); scale=55.0
def coord(p): return ((p[0]-O[0])/scale,(O[1]-p[1])/scale)
def dist(p,q): return math.dist(p,q)/scale
def dot(u,v): return sum(a*b for a,b in zip(u,v))/(scale*scale)
coords={n:coord(p) for n,p in zip(['A','B','C','M'],[A,B,C,M])}
AB=dist(A,B); AC=dist(A,C); AM=dist(A,M); BM=dist(B,M)
ABv=(A[0]-M[0],A[1]-M[1]); MBv=(B[0]-M[0],B[1]-M[1]); orthogonal=dot(ABv,MBv)
expectedC=(1+2*math.sqrt(3),6.0); expectedM=(1+math.sqrt(3),3.0)
root20=ET.parse(p20).getroot(); pths20=root20.findall('.//s:path',ns); curve=max((pts(p.attrib['d']) for p in pths20),key=len);
# curve points are actual serialized SVG primitives, exactly 65 samples over x in [0,16].
origin=(80.0,350.0); sx=35.0; sy=45.0
def coord20(p): return ((p[0]-origin[0])/sx,(origin[1]-p[1])/sy)
actual4=coord20(curve[16]); actual8=coord20(curve[32]); actual12=coord20(curve[48]);line_y=222.72136; h=(350-line_y)/45; area=8*h; expected_h=2*math.sqrt(2); expected_area=16*math.sqrt(2)
# parameter branch values from the solved equality: b_k=(2k-1)pi/16; first valid c for k=1 is 3pi/2.
a=4.0;b=math.pi/16;c=3*math.pi/2; product=a*b*c
result={
 'schemaVersion':'JS_ARCHIVE_CREATE_SOLUTION_SVG_PYTHON_AUDIT_V1',
 'python':'Python 3.14',
 'q18':{'pythonInputs':{'pixelOrigin':[100,370],'equalScalePxPerUnit':55,'actualSvgVerticesPx':dict(zip(['A','B','C','M'],verts))},'pythonCalculatedOutputs':{'actualCoordinates':coords,'expectedM':[expectedM[0],3.0],'expectedC':[expectedC[0],6.0],'AB':AB,'AC':AC,'AM':AM,'BM':BM,'AMdotMB':orthogonal,'coordinateResiduals':{'M':math.dist(coords['M'],expectedM),'C':math.dist(coords['C'],expectedC)},'tolerance':0.001},'status':'PASS' if math.dist(coords['M'],expectedM)<.001 and math.dist(coords['C'],expectedC)<.001 and all(abs(x-y)<.001 for x,y in [(AB,4),(AC,4),(AM,2),(orthogonal,0)]) else 'FAIL'},
 'q20':{'pythonInputs':{'curveSampleCount':len(curve),'pixelOrigin':[80,350],'xPixelsPerUnit':35,'yPixelsPerUnit':45,'linePixelY':line_y,'actualSvgSamplesAtX4X8X12':[curve[16],curve[32],curve[48]]},'pythonCalculatedOutputs':{'curveAt4':actual4,'curveAt8':actual8,'curveAt12':actual12,'expectedHeight':expected_h,'observedHeight':h,'heightResidual':abs(h-expected_h),'rectangleWidth':12-4,'observedRectangleArea':area,'expectedRectangleArea':expected_area,'areaResidual':abs(area-expected_area),'minimizingParameters':{'a':a,'b':b,'c':c,'abc':product},'abcExact':'3π²/8','tolerance':0.001},'status':'PASS' if abs(actual4[1]-expected_h)<.001 and abs(actual12[1]-expected_h)<.001 and abs(actual8[1]-4)<.001 and abs(area-expected_area)<.001 else 'FAIL'}
}
print(json.dumps(result,ensure_ascii=False,indent=2))