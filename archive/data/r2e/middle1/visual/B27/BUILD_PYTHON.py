import math,json,hashlib,html,xml.etree.ElementTree as ET
from pathlib import Path
OUT=Path("archive/assets/images/25_연향중_2학기_기말_중1_기출")
EVID=Path("tmp/m1-b01-b31-r2e-20260927/svg-upgrade/B27")
def n(v): return f"{v:.3f}".rstrip("0").rstrip(".") if abs(v-round(v))>1e-9 else str(round(v))
def esc(v): return html.escape(str(v),quote=False)
def polar(c,r,a): return (c[0]+r*math.cos(math.radians(a)),c[1]-r*math.sin(math.radians(a)))
def sha(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def head(w,h,title,facts):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-geometry-style-version="AP_GEOMETRY_PRINT_V1_0_DRAFT" data-geometry-preset="GEOMETRY_STANDARD" data-geometry-fact-hash="{sha(facts)}" data-visual-provenance="deterministic-python-independent-facts" style="max-width:100%;height:auto;stroke-linecap:round;stroke-linejoin:round"><title id="title">{esc(title)}</title><desc id="desc">{esc(title)}. 원문 조건과 독립 계산값을 사용한 해설 도형.</desc><style>.main{{fill:none;stroke:#111;stroke-width:2.05}}.secondary{{fill:none;stroke:#555;stroke-width:1.6}}.aux{{fill:none;stroke:#777;stroke-width:1;stroke-dasharray:4 4}}.hidden{{fill:none;stroke:#777;stroke-width:1.8;stroke-dasharray:4 4}}.title{{font:700 18px "Malgun Gothic",sans-serif;fill:#111}}.note{{font:14px "Malgun Gothic",sans-serif;fill:#111}}.formula{{font:15px "STIX Two Math","Times New Roman",serif;fill:#111}}.vertex{{font:italic 13.25px "STIX Two Math","Times New Roman",serif;fill:#111}}.angle{{font:11.75px "STIX Two Math","Times New Roman",serif;fill:#111}}.symbol{{font:italic 13.25px "STIX Two Math","Times New Roman",serif;fill:#111}}</style><rect width="{w}" height="{h}" fill="#fff"/>'
def text(x,y,s,kind="note",anchor="middle"):
 return f'<text x="{n(x)}" y="{n(y)}" text-anchor="{anchor}" class="{kind}">{esc(s)}</text>'
def line(a,b,kind="main"):
 return f'<line x1="{n(a[0])}" y1="{n(a[1])}" x2="{n(b[0])}" y2="{n(b[1])}" class="{kind}"/>'
def dot(p):return f'<circle cx="{n(p[0])}" cy="{n(p[1])}" r="2" fill="#111"/>'
def arc(a,b,rx,ry=None,sweep=1,large=0,kind="main"):
 return f'<path d="M {n(a[0])} {n(a[1])} A {n(rx)} {n(ry or rx)} 0 {large} {sweep} {n(b[0])} {n(b[1])}" class="{kind}"/>'
assets=[]
def save(q,parts,facts,coords):
 tree=ET.fromstring("".join(parts)+"</svg>")
 ET.register_namespace("","http://www.w3.org/2000/svg")
 tree.set("data-geometry-safe-margin","32")
 ns="{http://www.w3.org/2000/svg}"
 headers=[];layers={0:[],20:[],30:[],40:[],60:[],70:[],90:[]}
 for child in list(tree):
  tag=child.tag.removeprefix(ns);cls=child.get("class","")
  if tag in ("title","desc","style"):headers.append(child)
  elif tag=="rect" and child.get("fill")=="#fff":layers[0].append(child)
  elif tag=="text":layers[90].append(child)
  elif tag=="circle" and child.get("fill")=="#111":layers[70].append(child)
  elif child.get("stroke-width")=="0.8":layers[60].append(child)
  elif cls in ("aux","hidden"):layers[20].append(child)
  elif cls=="secondary":layers[30].append(child)
  else:layers[40].append(child)
  tree.remove(child)
 for child in headers:tree.append(child)
 for layer,children in layers.items():
  if not children:continue
  g=ET.SubElement(tree,ns+"g",{"data-geometry-layer":str(layer)})
  g.extend(children)
 raw=ET.tostring(tree,encoding="utf-8")+b"\n"
 p=OUT/f"q{q}-solution.svg";p.write_bytes(raw)
 assets.append({"q":q,"path":p.as_posix(),"sha256":hashlib.sha256(raw).hexdigest(),"factHash":sha(facts),"bytes":len(raw),"coordinates":coords})

f={"question":"B27 Q7","turnAngleDeg":90,"sideLengthsCm":{"AB":6,"AC":10,"AD":8},"lastCenter":"A","lastArcLengthCm":0,"distanceCm":"12*pi"}
s=[head(400,220,"A가 그리는 세 90° 원호",f),text(200,25,"A가 그리는 세 90° 원호","title")]
cs=[]
for i,(name,label,length) in enumerate([("B","AB",6),("C","AC",10),("D","AD",8)]):
 cx=48+i*126;cy=133;r=5*length
 a=(cx,cy-r);b=(cx+r,cy)
 s += [text(cx+22,59,name+" 중심"),line((cx,cy),a,"aux"),line((cx,cy),b,"aux"),arc(a,b,r),dot((cx,cy)),text(cx+22,163,label+"="+str(length)+" cm")]
 cs.append({"pivot":name,"radiusCm":length,"scalePxPerCm":5,"center":[cx,cy],"arcStart":a,"arcEnd":b})
s += [text(200,203,"마지막 A 중심 회전: 이동거리 0")]
save(7,s,f,cs)

f={"question":"B27 Q16","remainingCentralAngleDeg":240,"radiusCm":3,"heightCm":6,"curvedArea":"24*pi","sectorFacesTotal":"12*pi","cutFacesTotal":36,"totalSurfaceArea":"36*pi+36"}
c=(100,147);R=66;a=polar(c,R,150);b=polar(c,R,390)
s=[head(420,310,"잘린 원기둥의 노출된 면 넓이",f),text(210,25,"노출된 면의 넓이를 합하기","title"),text(100,58,"남은 중심각 240°")]
sector=f'M {n(a[0])} {n(a[1])} A {R} {R} 0 1 0 {n(b[0])} {n(b[1])} L {c[0]} {c[1]} Z'
s += [f'<path d="{sector}" fill="#eee" stroke="#111" stroke-width="2.05"/>',text(100,239,"r=3 cm · h=6 cm")]
for y,label,form in [(73,"옆 곡면","(240/360)·2π·3·6 = 24π"),(136,"위·아래 부채꼴","2·(240/360)·π·3² = 12π"),(199,"절단 직사각형 2개","2·3·6 = 36")]:
 s += [text(184,y,label,"note","start"),text(184,y+25,form,"formula","start")]
s += [text(210,289,"겉넓이 = 36π + 36 cm²","formula")]
save(16,s,f,{"center":c,"radiusPx":R,"arcStart":a,"arcEnd":b,"remainingAngleDeg":240})

x=(180-(180-48))/3;cod=180-4*x;O=(145,150);R=95
A=polar(O,R,180);B=polar(O,R,0);C=polar(O,R,132);D=polar(O,R,x)
t=(O[1]-D[1])/(C[1]-D[1]);P=(D[0]+t*(C[0]-D[0]),O[1])
assert abs(math.dist(O,D)-math.dist(D,P))<1e-7
f={"question":"B27 Q22","diameter":"AB","DO_equals_DP":True,"angleAOCdeg":48,"arcACcm":12,"angleBODdeg":x,"angleCODdeg":cod,"arcBDcm":4,"arcCDcm":29}
s=[head(420,345,"중심각과 호의 길이",f),text(210,25,"중심각과 호의 길이","title"),f'<circle cx="{O[0]}" cy="{O[1]}" r="{R}" class="main"/>']
s += [line(A,(P[0]+5,P[1]),"secondary"),line(C,(P[0]+5,P[1]),"main"),line(O,C,"aux"),line(O,D,"aux"),arc(A,C,R),arc(C,D,R)]
ticks=[]
for p1,p2 in [(O,D),(D,P)]:
 mid=((p1[0]+p2[0])/2,(p1[1]+p2[1])/2);dist=math.dist(p1,p2);normal=(-(p2[1]-p1[1])/dist,(p2[0]-p1[0])/dist)
 p1t=(mid[0]-3.5*normal[0],mid[1]-3.5*normal[1]);p2t=(mid[0]+3.5*normal[0],mid[1]+3.5*normal[1]);ticks.append([p1t,p2t])
 s.append(f'<line x1="{n(p1t[0])}" y1="{n(p1t[1])}" x2="{n(p2t[0])}" y2="{n(p2t[1])}" stroke="#555" stroke-width="0.8"/>')
for name,p,dx,dy in [("A",A,-11,18),("B",B,8,18),("C",C,-8,-9),("D",D,10,-8),("O",O,0,20),("P",P,12,20)]:
 s += [dot(p),text(p[0]+dx,p[1]+dy,name,"vertex")]
s += [text(O[0]-48,O[1]-9,"48°","angle"),text(210,274,"DO=DP · ∠AOC=48° · 호 AC=12 cm"),text(210,301,"∠BOD=16° · ∠COD=116°","formula"),text(210,329,"호 BD=4 cm · 호 CD=29 cm","formula")]
save(22,s,f,{"O":O,"A":A,"B":B,"C":C,"D":D,"P":P,"radiusPx":R,"equalTicks":ticks,"OD":math.dist(O,D),"DP":math.dist(D,P)})

f={"question":"B27 Q23","commonRadius":"r","commonHeight":"2r","coneVolume":"2/3*pi*r^3","sphereVolume":"4/3*pi*r^3","cylinderVolume":"2*pi*r^3","ratio":"1:2:3"}
s=[head(420,280,"같은 반지름 r, 원뿔·원기둥 높이 2r",f),text(210,25,"같은 반지름 r, 높이 2r","title")]
r=34;ry=9;top=81;bottom=top+2*r;coords=[]
for cx,label,form in [(70,"원뿔","2πr³/3"),(200,"구","4πr³/3"),(326,"원기둥","2πr³")]:
 s += [text(cx,58,label),text(cx,204,"반지름 r"),text(cx,232,form,"formula")]
 if label=="구":
  cy=(top+bottom)/2
  s += [f'<circle cx="{cx}" cy="{cy}" r="{r}" class="main"/>',arc((cx-r,cy),(cx+r,cy),r,ry,1,0,"hidden"),arc((cx-r,cy),(cx+r,cy),r,ry,0,0,"secondary")]
  endpoint=polar((cx,cy),r,45);s += [line((cx,cy),endpoint,"secondary"),text(cx+18,cy-23,"r","symbol")]
 else:
  if label=="원뿔":s += [line((cx,top),(cx-r,bottom)),line((cx,top),(cx+r,bottom))]
  else:s += [f'<ellipse cx="{cx}" cy="{top}" rx="{r}" ry="{ry}" class="main"/>',line((cx-r,top),(cx-r,bottom)),line((cx+r,top),(cx+r,bottom))]
  s += [arc((cx-r,bottom),(cx+r,bottom),r,ry,0,0,"main"),arc((cx+r,bottom),(cx-r,bottom),r,ry,0,0,"hidden"),line((cx+r+7,top),(cx+r+7,bottom),"aux"),text(cx+r+14,(top+bottom)/2,"2r","symbol")]
 coords.append({"shape":label,"centerX":cx,"radiusPx":r,"heightPx":2*r,"ellipseRy":ry,"topY":top,"bottomY":bottom})
s += [text(210,268,"부피의 비 1 : 2 : 3","title")]
save(23,s,f,coords)
evidence={"schemaVersion":"M1_R2E_PYTHON_GEOMETRY_EVIDENCE_v2","examCode":"B27","scope":[7,16,22,23],"rule":"도형추출.md v3.0","assets":assets,"compactDisplay":True,"corrections":["3D front arc solid / rear arc dashed","height labels outside shape strokes","equal OD=DP ticks","proportional Q7 arc radii","reduced canvas width to preserve mobile readability"]}
(EVID/"PYTHON_GEOMETRY_FACTS_B27.json").write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"built":len(assets),"questions":[a["q"] for a in assets]},ensure_ascii=False))
