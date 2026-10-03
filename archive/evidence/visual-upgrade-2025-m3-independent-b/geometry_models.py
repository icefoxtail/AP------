"""Python-only coordinate and expected-fact models for the M3 visual pilot.

All numeric inputs are copied from the source question/final solution. Canvas
placement parameters are explicit inputs; all dependent coordinates, lengths,
angles, areas and SVG coordinates are recomputed below.
"""
import math


def unit(v):
    n = math.hypot(v[0], v[1])
    if not n:
        raise ValueError("ZERO_VECTOR")
    return (v[0] / n, v[1] / n)


def norm(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1]


def angle(a, v, b):
    u = (a[0] - v[0], a[1] - v[1])
    w = (b[0] - v[0], b[1] - v[1])
    return math.degrees(math.atan2(abs(cross(u, w)), dot(u, w)))


def distance_check(name, a, b, expected, scale=1, tol=0.004):
    return {"id": name, "type": "distance", "points": [a, b],
            "expected": expected, "scalePxPerUnit": scale, "tolerance": tol}


def perpendicular_check(name, seg_a, seg_b, tol=1e-6):
    return {"id": name, "type": "perpendicular", "segments": [seg_a, seg_b],
            "expectedResidual": 0, "tolerance": tol}


def angle_check(name, vertex, ray_a, ray_b, expected, tol=0.02):
    return {"id": name, "type": "angle", "vertex": vertex,
            "rays": [ray_a, ray_b], "expected": expected, "tolerance": tol}


def ratio_check(name, numerator, denominator, expected, tol=0.003):
    return {"id": name, "type": "ratio", "segments": [numerator, denominator],
            "expected": expected, "tolerance": tol}


def midpoint_check(name, mid, a, b, tol=0.003):
    return {"id": name, "type": "midpoint", "point": mid, "ends": [a, b],
            "expectedFraction": 0.5, "tolerance": tol}


def model(qid):
    """Return source-bound inputs, computed point/primitive model, and facts."""
    if qid == "왕운#1":
        s = 26
        pts = {"A": (70, 230), "B": (278, 230), "C": (278, 74)}
        seg = [("AB", "A", "B", "main"), ("BC", "B", "C", "main"),
               ("AC", "A", "C", "main")]
        return {
            "inputs": {"scalePxPerUnit": s, "BC": 6, "AC": 10, "rightAt": "B"},
            "points": pts, "segments": seg, "circles": [],
            "pointOffsets": {"A": (-12, 18), "B": (0, 18), "C": (14, -5)},
            "lengthLabels": [("BC", "BC=6", "BC", 14), ("AC", "AC=10", "AC", -13)],
            "angles": [], "rightAngles": [("B", "A", "C")], "ticks": [], "notes": [],
            "checks": [distance_check("BC", "B", "C", 6, s),
                       distance_check("AC", "A", "C", 10, s),
                       perpendicular_check("right-at-B", "AB", "BC"),
                       ratio_check("sin-A", "BC", "AC", 0.6)],
            "computed": {"AB": 8, "BC": 6, "AC": 10, "sinA": 0.6},
            "alt": "직각삼각형 ABC에서 A의 맞은변 BC=6과 빗변 AC=10",
            "caption": "sin A에서 맞은변과 빗변의 위치를 확인한다.",
        }
    if qid == "왕운#2":
        s = 15
        pts = {"A": (100, 245), "B": (175, 245), "C": (175, 65)}
        return {
            "inputs": {"scalePxPerUnit": s, "AB:BC": [5, 12], "AC": 13, "rightAt": "B"},
            "points": pts, "segments": [("AB", "A", "B", "main"), ("BC", "B", "C", "main"),
                                        ("AC", "A", "C", "main")], "circles": [],
            "pointOffsets": {"A": (-12, 18), "B": (0, 18), "C": (14, -5)},
            "lengthLabels": [("AB", "5k", "AB", 14), ("BC", "12k", "BC", -14),
                             ("AC", "13k", "AC", -12)],
            "angles": [], "rightAngles": [("B", "A", "C")], "ticks": [], "notes": [],
            "checks": [distance_check("AB", "A", "B", 5, s),
                       distance_check("BC", "B", "C", 12, s),
                       distance_check("AC", "A", "C", 13, s),
                       perpendicular_check("right-at-B", "AB", "BC"),
                       ratio_check("cos-A", "AB", "AC", 5/13)],
            "computed": {"AB": 5, "BC": 12, "AC": 13, "cosA": 5/13},
            "alt": "5k-12k-13k 직각삼각형 ABC",
            "caption": "tan A가 정하는 두 직각변을 빗변과 함께 비교한다.",
        }
    if qid == "왕운#10":
        s = 70
        pts = {"A": (80, 78), "C": (80, 78 + math.sqrt(3)*s), "B": (80+s, 78+math.sqrt(3)*s)}
        a, b, c = angle(pts["B"], pts["A"], pts["C"]), angle(pts["A"], pts["B"], pts["C"]), 90.0
        return {
            "inputs": {"scalePxPerUnit": s, "angleRatio": [1, 2, 3], "triangleAngleSum": 180},
            "points": pts, "segments": [("AB", "A", "B", "main"), ("BC", "B", "C", "main"),
                                        ("CA", "C", "A", "main")], "circles": [],
            "pointOffsets": {"A": (-10, -8), "B": (12, 18), "C": (-12, 18)},
            "lengthLabels": [], "angles": [("A", "A", "B", "C", "30°", 10, 42),
                                           ("B","B","A","C","60°",7,22),
                                           ("C", "C", "A", "B", "90°", 14, 30)],
            "rightAngles": [("C", "A", "B")], "ticks": [],
            "notes": [("note-ratio", "sin A = cos B = 1/2", 210, 265, 13)],
            "checks": [angle_check("A", "A", "B", "C", 30), angle_check("B", "B", "A", "C", 60),
                       angle_check("C", "C", "A", "B", 90)],
            "computed": {"anglesDeg": {"A": a, "B": b, "C": c},
                         "sideUnits": {"AC": math.sqrt(3), "BC": 1, "AB": 2},
                         "sinA": 0.5, "cosB": 0.5},
            "alt": "30°, 60°, 90° 내각을 표시한 직각삼각형 ABC",
            "caption": "각의 비 1:2:3에서 얻는 세 각과 sin A=cos B를 연결한다.",
        }
    if qid == "왕운#11":
        s = 25
        pts = {"B": (60, 230), "C": (260, 230), "H": (335, 230), "A": (335, 230-3*math.sqrt(3)*s)}
        return {
            "inputs": {"scalePxPerUnit": s, "BC": 8, "area": 12*math.sqrt(3),
                       "angleC": 120, "footBeyondC": True},
            "points": pts, "segments": [("AB", "A", "B", "main"), ("AC", "A", "C", "main"),
                                        ("BC", "B", "C", "main"), ("CH", "C", "H", "extension"),
                                        ("AH", "A", "H", "aux")], "circles": [],
            "pointOffsets": {"A": (0, -12), "B": (-12, 18), "C": (-1, 20), "H": (10, 20)},
            "lengthLabels": [("BC", "8", "BC", 15), ("AH", "3√3", "AH", -15),
                             ("CH", "3", "CH", 14)],
            "angles": [("C", "C", "B", "A", "120°", 20, 36)],
            "rightAngles": [("H", "A", "C")], "ticks": [], "notes": [],
            "checks": [distance_check("BC", "B", "C", 8, s),
                       distance_check("AH", "A", "H", 3*math.sqrt(3), s, .005),
                       perpendicular_check("AH-perp-BC", "AH", "BC"),
                       angle_check("C", "C", "B", "A", 120),
                       {"id": "area-ABC", "type": "area", "triangle": ["A", "B", "C"],
                        "expected": 12*math.sqrt(3), "scalePxPerUnit": s, "tolerance": .006}],
            "computed": {"BC": 8, "AH": 3*math.sqrt(3), "CH": 3, "area": 12*math.sqrt(3)},
            "alt": "120°인 C와 BC 연장선 위의 H, 수선 AH를 표시한 삼각형",
            "caption": "밑변 BC와 높이 AH가 만드는 넓이 관계를 본다.",
        }
    if qid == "왕운#13":
        s = 100/13
        pts = {"O": (210, 145), "A": (210-12*s, 145+5*s), "B": (210+12*s, 145+5*s), "H": (210, 145+5*s)}
        return {
            "inputs": {"scalePxPerUnit": s, "AB": 24, "OH": 5, "AH": 12},
            "points": pts, "segments": [("AB", "A", "B", "main"), ("OH", "O", "H", "aux"),
                                        ("OA", "O", "A", "aux"), ("AH", "A", "H", "aux"), ("HB", "H", "B", "aux")],
            "circles": [("main", "O", 100, "main", None)],
            "pointOffsets": {"O": (16, -10), "A": (-20, 16), "B": (20, 14), "H": (18, -10)},
            "lengthLabels": [("OH","5","OH",24,.75), ("AB","24","AB",-24,.75),
                             ("OA","x","OA",16,.25)],
            "angles": [], "rightAngles": [("H", "O", "A")], "ticks": [("AH", 1), ("HB", 1)],
            "notes": [],
            "checks": [distance_check("OA-radius", "O", "A", 13, s),
                       distance_check("OH", "O", "H", 5, s),
                       distance_check("AH", "A", "H", 12, s),
                       perpendicular_check("OH-perp-AB", "OH", "AB"),
                       midpoint_check("H-midpoint-AB", "H", "A", "B"),
                       {"id": "A-on-circle", "type": "circle_point", "circle": "main", "point": "A",
                        "scalePxPerUnit": s, "tolerance": .002}],
            "computed": {"radius": 13, "OH": 5, "AH": 12, "x": 13},
            "alt": "현 AB=24의 중점 H와 중심 O에서 내린 수선",
            "caption": "중심에서 현에 내린 수선이 현을 이등분해 반지름 직각삼각형을 만든다.",
        }
    if qid == "왕운#21":
        s = 20
        B=(60,240); C=(300,240); H=(120,240)
        A=(H[0], 240 - 9*s*(2*math.sqrt(2)/3))
        return {
            "inputs": {"scalePxPerUnit": s, "AB": 9, "BC": 12, "sinB": 2*math.sqrt(2)/3,
                       "footInsideBC": True},
            "points": {"A":A,"B":B,"C":C,"H":H},
            "segments": [("AB","A","B","main"),("AC","A","C","main"),("BC","B","C","main"),
                         ("AH","A","H","aux"),("BH","B","H","aux")], "circles": [],
            "pointOffsets": {"A":(-5,-12),"B":(-12,18),"C":(12,18),"H":(0,19)},
            "lengthLabels": [("AB","9","AB",14),("BC","12","BC",14),("AH","6√2","AH",-14)],
            "angles": [], "rightAngles": [("H","A","B")], "ticks": [], "notes": [],
            "checks": [distance_check("AB","A","B",9,s,.005),distance_check("BC","B","C",12,s),
                       distance_check("AH","A","H",6*math.sqrt(2),s,.005),
                       perpendicular_check("AH-perp-BC","AH","BC"),
                       ratio_check("sin-B","AH","AB",2*math.sqrt(2)/3,.004),
                       {"id":"area-ABC","type":"area","triangle":["A","B","C"],"expected":36*math.sqrt(2),
                        "scalePxPerUnit":s,"tolerance":.006}],
            "computed":{"AB":9,"BC":12,"AH":6*math.sqrt(2),"area":36*math.sqrt(2),
                        "angleBdeg":math.degrees(math.asin(2*math.sqrt(2)/3))},
            "alt":"AB=9, BC=12인 삼각형에서 A의 수선 AH와 sin B 비",
            "caption":"sin B가 밑변 BC에 대한 높이 AH를 정하고 삼각형 넓이를 만든다.",
        }
    if qid == "왕운#22":
        s=30;pts={"A":(80,80),"B":(80,170),"C":(200,170)}
        return {
            "inputs":{"scalePxPerUnit":s,"sideRatio":{"AB":3,"BC":4,"AC":5},"rightAt":"B"},
            "points":pts,"segments":[("AB","A","B","main"),("BC","B","C","main"),("AC","A","C","main")],
            "circles":[],"pointOffsets":{"A":(-12,-10),"B":(-14,16),"C":(15,16)},
            "lengthLabels":[("AB","3k","AB",-13),("BC","4k","BC",14),("AC","5k","AC",-13)],
            "angles":[],"rightAngles":[("B","A","C")],"ticks":[],
            "notes":[("note-ratios","sin A = 4/5     tan A = 4/3",210,260,13)],
            "checks":[distance_check("AB","A","B",3,s),distance_check("BC","B","C",4,s),
                      distance_check("AC","A","C",5,s),perpendicular_check("right-at-B","AB","BC"),
                      ratio_check("sin-A","BC","AC",.8)],
            "computed":{"AB":3,"BC":4,"AC":5,"sinA":.8,"tanA":4/3},
            "alt":"AB:BC:AC=3:4:5인 직각삼각형 ABC",
            "caption":"cos A가 정하는 3-4-5 변 관계에서 sin A와 tan A를 읽는다.",
        }
    if qid == "풍덕#1":
        s=70;pts={"A":(190,220),"B":(260,220),"C":(260,80)}
        return {"inputs":{"scalePxPerUnit":s,"AB":1,"BC":2,"rightAt":"B"},"points":pts,
            "segments":[("AB","A","B","main"),("BC","B","C","main"),("AC","A","C","main")],"circles":[],
            "pointOffsets":{"A":(-10,18),"B":(0,18),"C":(13,-4)},
            "lengthLabels":[("AB","1","AB",14),("BC","2","BC",14)],"angles":[("A","A","B","C","A",15,27)],
            "rightAngles":[("B","A","C")],"ticks":[],"notes":[],
            "checks":[distance_check("AB","A","B",1,s),distance_check("BC","B","C",2,s),
                      perpendicular_check("right-at-B","AB","BC"),ratio_check("tan-A","BC","AB",2)],
            "computed":{"AB":1,"BC":2,"tanA":2},
            "alt":"직각삼각형 ABC에서 AB=1, BC=2","caption":"tan A의 맞은변 BC와 이웃변 AB를 구별한다."}
    if qid == "풍덕#2":
        s=27;C=(85,225);A=(85,144);B=(85+3*math.sqrt(3)*s,225)
        return {"inputs":{"scalePxPerUnit":s,"hypotenuse":6,"angleB":30,"rightAt":"C"},
            "points":{"A":A,"B":B,"C":C},"segments":[("AB","A","B","main"),("BC","B","C","main"),("CA","C","A","main")],
            "circles":[],"pointOffsets":{"A":(-13,-5),"B":(14,18),"C":(-12,17)},
            "lengthLabels":[("AB","6","AB",-13),("AC","x=3","CA",-15),("BC","y=3√3","BC",-23)],
            "angles":[("B","B","A","C","30°",10,36)],"rightAngles":[("C","C","A","B")],"ticks":[],"notes":[],
            "checks":[distance_check("AB","A","B",6,s,.004),distance_check("AC","A","C",3,s),
                      distance_check("BC","B","C",3*math.sqrt(3),s,.004),
                      perpendicular_check("right-at-C","CA","BC"),angle_check("B","B","A","C",30)],
            "computed":{"AB":6,"AC":3,"BC":3*math.sqrt(3),"xy":9*math.sqrt(3)},
            "alt":"빗변 AB=6, ∠B=30°인 직각삼각형 ABC","caption":"30°의 맞은변 x와 이웃변 y를 빗변 AB에 연결한다."}
    if qid == "풍덕#6":
        s=45;B=(125,235);A=(125,145);C=(125+math.sqrt(5)*s,235)
        return {"inputs":{"scalePxPerUnit":s,"sinA":math.sqrt(5)/3,"hypotenuse":3,"rightAt":"B"},
            "points":{"A":A,"B":B,"C":C},"segments":[("AB","A","B","main"),("BC","B","C","main"),("AC","A","C","main")],
            "circles":[],"pointOffsets":{"A":(-12,-5),"B":(-12,18),"C":(13,18)},
            "lengthLabels":[("AB","2","AB",-14),("BC","√5","BC",15),("AC","3","AC",-13)],
            "angles":[],"rightAngles":[("B","B","A","C")],"ticks":[],"notes":[],
            "checks":[distance_check("AB","A","B",2,s),distance_check("BC","B","C",math.sqrt(5),s,.004),
                      distance_check("AC","A","C",3,s),perpendicular_check("right-at-B","AB","BC"),
                      ratio_check("sin-A","BC","AC",math.sqrt(5)/3,.003),
                      ratio_check("tan-C","AB","BC",2/math.sqrt(5),.004)],
            "computed":{"AB":2,"BC":math.sqrt(5),"AC":3,"tanC":2/math.sqrt(5)},
            "alt":"sin A=√5/3인 직각삼각형에서 AB=2, BC=√5, AC=3","caption":"sin A로 정한 변 비와 피타고라스 길이를 확인한다."}
    if qid == "풍덕#7":
        s=24;B=(190,150);C=(190,150+2*math.sqrt(3)*s);D=(C[0]+6*s,C[1]);A=(B[0]-2*math.sqrt(3)*s,B[1])
        return {"inputs":{"scalePxPerUnit":s,"triangleBCD":{"rightAt":"C","angleD":30,"CD":6},
                          "triangleABC":{"rightAt":"B","angleA":45},"shared":"BC"},
            "points":{"A":A,"B":B,"C":C,"D":D},
            "segments":[("AB","A","B","main"),("BC","B","C","main"),("AC","A","C","main"),
                        ("CD","C","D","main"),("BD","B","D","main")],"circles":[],
            "pointOffsets":{"A":(-10,-10),"B":(-9,-10),"C":(18,-18),"D":(12,17)},
            "lengthLabels":[("BC","2√3","BC",-13),("CD","6","CD",14),("AC","2√6","AC",-13)],
            "angles":[("A","A","B","C","45°",10,32),("D","D","B","C","30°",8,40)],
            "rightAngles":[("B","B","A","C"),("C","C","B","D")],"ticks":[],"notes":[],
            "checks":[distance_check("BC","B","C",2*math.sqrt(3),s,.005),distance_check("CD","C","D",6,s),
                      distance_check("AC","A","C",2*math.sqrt(6),s,.005),perpendicular_check("B-right","AB","BC"),
                      perpendicular_check("C-right","BC","CD"),angle_check("A","A","B","C",45),
                      angle_check("D","D","B","C",30)],
            "computed":{"BC":2*math.sqrt(3),"CD":6,"AB":2*math.sqrt(3),"AC":2*math.sqrt(6)},
            "alt":"BC를 공유하는 45°-45°-90°와 30° 직각삼각형","caption":"두 삼각형에서 구한 공통 길이 BC로 AC를 결정한다."}
    if qid == "풍덕#11":
        ox,oy,s=210,238,34;x0=-2*math.sqrt(3);x1=3.5;y1=x1/math.sqrt(3)+2
        pts={"O":(ox,oy),"X0":(ox+s*x0,oy),"Y":(ox,oy-2*s),"X1":(ox+s*x1,oy-s*y1),
             "D30":(ox+s*1.7*math.cos(math.pi/6),oy-s*1.7*math.sin(math.pi/6)),
             "XP":(ox+s*1.7,oy)}
        return {"inputs":{"mathOrigin":[0,0],"scalePxPerUnit":s,"slope":1/math.sqrt(3),"yIntercept":2,
                          "inclinationDeg":30},"points":pts,
            "segments":[("xAxis","X0","X1","aux"),("yAxis","O","Y","aux"),("line","X0","X1","main"),
                        ("dir30","O","D30","aux"),("xRay","O","XP","aux"),("OY","O","Y","aux")],
            "circles":[],"pointOffsets":{"O":(-10,17)},"markerPoints":["O","Y"],
            "lengthLabels":[("intercept","2","OY",14)],
            "angles":[("inclination","O","D30","XP","30°",9,40)],"rightAngles":[],"ticks":[],
            "notes":[("equation","y = (√3/3)x + 2",306,74,13)],
            "checks":[{"id":"slope","type":"line_slope","segment":"line","origin":[ox,oy],"scalePxPerUnit":s,
                       "expected":1/math.sqrt(3),"tolerance":.004},
                      {"id":"y-intercept","type":"line_intercept","segment":"line","origin":[ox,oy],"scalePxPerUnit":s,
                       "expected":2,"tolerance":.004},
                      {"id":"direction-parallel","type":"parallel","segments":["line","dir30"],"tolerance":1e-6},
                      angle_check("inclination","O","D30","XP",30,1.0)],
            "computed":{"slope":1/math.sqrt(3),"yIntercept":2,"xIntercept":x0},
            "alt":"기울기 30°인 직선과 y절편 2가 표시된 좌표평면","caption":"기울기 tan30°와 y절편 2가 직선식의 계수로 대응한다."}
    if qid == "풍덕#13":
        s=25;B=(55,220);H=(B[0]+4*math.sqrt(3)*s,220);C=(H[0]+4*s,220);A=(H[0],120)
        return {"inputs":{"scalePxPerUnit":s,"AB":8,"angleB":30,"angleC":45,"foot":"H"},
            "points":{"A":A,"B":B,"C":C,"H":H},
            "segments":[("AB","A","B","main"),("AC","A","C","main"),("BC","B","C","main"),("AH","A","H","aux"),("BH","B","H","aux"),("HC","H","C","aux")],
            "circles":[],"pointOffsets":{"A":(0,-12),"B":(-12,18),"C":(12,18),"H":(0,18)},
            "lengthLabels":[("AB","8 km","AB",-13),("BH","4√3","BH",24),("HC","4","HC",24)],
            "angles":[("B","B","A","C","30°",8,38),("C","C","B","A","45°",8,38)],
            "rightAngles":[("H","H","A","B")],"ticks":[],
            "checks":[distance_check("AB","A","B",8,s,.006),distance_check("BH","B","H",4*math.sqrt(3),s,.005),
                      distance_check("HC","H","C",4,s,.003),perpendicular_check("AH-perp-BC","AH","BC"),
                      angle_check("B","B","A","C",30),angle_check("C","C","B","A",45),
                      distance_check("BC","B","C",4*math.sqrt(3)+4,s,.006)],
            "computed":{"AB":8,"AH":4,"BH":4*math.sqrt(3),"HC":4,"BC":4*math.sqrt(3)+4},
            "alt":"산 정상 A에서 터널 바닥 BC에 내린 H와 양쪽 직각삼각형","caption":"BH와 HC를 삼각비로 구해 터널 길이 BC를 더한다."}
    if qid == "풍덕#14":
        s=20;cx,cy=210,150;r=5*s;half=4*s;d=math.sqrt(r*r-half*half);theta=math.radians(225);n=(math.cos(theta),math.sin(theta));t=(-n[1],n[0]);N=(cx+n[0]*d,cy+n[1]*d);E=(N[0]-t[0]*half,N[1]-t[1]*half);F=(N[0]+t[0]*half,N[1]+t[1]*half)
        return {"inputs":{"scalePxPerUnit":s,"radius":5,"halfChord":4,"lowerCenterDistance":3,
                          "upperChordNormalAngleScreenDeg":225},
            "points":{"O":(cx,cy),"A":(cx-half,cy+3*s),"B":(cx+half,cy+3*s),
                      "H":(cx,cy+3*s),"E":E,"F":F,"N":N},
            "segments":[("AB","A","B","main"),("EF","E","F","main"),("EN","E","N","aux"),
                        ("NF","N","F","aux"),("OH","O","H","aux"),("ON","O","N","aux"),
                        ("AH","A","H","aux")],
            "circles":[("main","O",r,"main",None)],
            "pointOffsets":{"O":(18,-10),"A":(-12,17),"B":(12,17),"H":(18,-10),"E":(-10,16),"F":(25,-3),"N":(-8,-12)},
            "lengthLabels":[("AB","8","AB",-24,.25),("upperHalf","4","EN",-13),("OH","3","OH",14),("x","x","ON",-13)],
            "angles":[],"rightAngles":[("H","H","O","A"),("N","N","O","E")],
            "ticks":[("AB",1),("EF",1)],"notes":[],
            "checks":[distance_check("AB","A","B",8,s,.004),distance_check("EF","E","F",8,s,.004),
                      distance_check("OH","O","H",3,s,.003),distance_check("ON","O","N",3,s,.003),
                      perpendicular_check("OH-perp-AB","OH","AB"),perpendicular_check("ON-perp-EF","ON","EF"),
                      midpoint_check("H-midpoint-AB","H","A","B"),midpoint_check("N-midpoint-EF","N","E","F"),
                      {"id":"A-on-circle","type":"circle_point","circle":"main","point":"A","scalePxPerUnit":s,"tolerance":.003},
                      {"id":"E-on-circle","type":"circle_point","circle":"main","point":"E","scalePxPerUnit":s,"tolerance":.003}],
            "computed":{"radius":5,"halfChord":4,"lowerDistance":3,"upperDistance":d/s,"x":d/s}}
    if qid == "풍덕#15":
        R=100;half=45;d=math.sqrt(R*R-half*half);cx,cy=210,160
        return {"inputs":{"outerRadiusPx":R,"halfChordPx":half,"centerDistancePx":d,
                          "equalChordLengthPx":2*half},
            "points":{"O":(cx,cy),"A":(cx-half,cy-d),"B":(cx+half,cy-d),"M":(cx,cy-d),
                      "C":(cx-half,cy+d),"D":(cx+half,cy+d),"N":(cx,cy+d)},
            "segments":[("AB","A","B","main"),("CD","C","D","main"),("OM","O","M","aux"),("ON","O","N","aux"),
                        ("AM","A","M","aux"),("MB","M","B","aux"),("CN","C","N","aux"),("ND","N","D","aux")],
            "circles":[("main","O",R,"main",None),("midpointLocus","O",d,"aux","5 4")],
            "pointOffsets":{"O":(12,-12),"A":(-9,-8),"B":(10,-8),"M":(10,24),"C":(0,-24),"D":(-4,-24),"N":(10,-24)},
            "lengthLabels":[],"angles":[],"rightAngles":[("M","M","O","A"),("N","N","O","C")],
            "ticks":[("AB",1),("CD",1)],"notes":[],
            "checks":[distance_check("AB","A","B",2*half,1,.003),distance_check("CD","C","D",2*half,1,.003),
                      perpendicular_check("OM-perp-AB","OM","AB"),perpendicular_check("ON-perp-CD","ON","CD"),
                      midpoint_check("M-midpoint-AB","M","A","B"),midpoint_check("N-midpoint-CD","N","C","D"),
                      {"id":"M-on-locus","type":"circle_point","circle":"midpointLocus","point":"M","scalePxPerUnit":1,"tolerance":.003},
                      {"id":"N-on-locus","type":"circle_point","circle":"midpointLocus","point":"N","scalePxPerUnit":1,"tolerance":.003}],
            "computed":{"radiusPx":R,"halfChordPx":half,"centerDistancePx":d,"equalChordPx":2*half}}
    if qid == "풍덕#17":
        R=100;cx,cy=210,155
        polar=lambda deg:(cx+R*math.cos(math.radians(deg)),cy+R*math.sin(math.radians(deg)))
        P=polar(180);B=polar(298);C=polar(56);M=((P[0]+B[0])/2,(P[1]+B[1])/2);N=((B[0]+C[0])/2,(B[1]+C[1])/2)
        return {"inputs":{"circleRadiusPx":R,"polarAnglesScreenDeg":{"P":180,"B":298,"C":56},"givenVertexAngleB":62},
            "points":{"O":(cx,cy),"P":P,"B":B,"C":C,"M":M,"N":N},
            "segments":[("PB","P","B","main"),("BC","B","C","main"),("PC","P","C","main"),
                        ("OM","O","M","aux"),("ON","O","N","aux"),("MP","M","P","aux"),("MB","M","B","aux"),("NB","N","B","aux"),("NC","N","C","aux")],
            "circles":[("main","O",R,"main",None)],
            "pointOffsets":{"O":(12,-12),"P":(-14,4),"B":(8,-10),"C":(23,12)},
            "lengthLabels":[],"angles":[("B","B","P","C","62°",16,46),("P","P","B","C","x",16,46)],
            "rightAngles":[("M","M","P","O"),("N","N","B","O")],
            "ticks":[("OM",1),("ON",1)],"notes":[],
            "checks":[distance_check("PB", "P","B",norm(P,B),1,.004),distance_check("BC","B","C",norm(B,C),1,.004),
                      perpendicular_check("OM-perp-PB","OM","PB"),perpendicular_check("ON-perp-BC","ON","BC"),
                      {"id":"OM=ON","type":"equal","segments":["OM","ON"],"tolerance":.004},
                      angle_check("apex-B","B","P","C",62,.03),angle_check("base-P","P","B","C",59,.04)],
            "computed":{"radiusPx":R,"chordPBpx":norm(P,B),"chordBCpx":norm(B,C),
                        "centerDistancePx":norm((cx,cy),M),"angleB":angle(P,B,C),"baseAngle":(180-angle(P,B,C))/2}}
    if qid == "풍덕#18":
        s=30;A=(220,65);B=(310,65);C=(200,65+s*8*math.sqrt(5)/3)
        I=(A[0]+s,A[1]+s*math.sqrt(5)/2);r=s*math.sqrt(5)/2
        T_AB=(A[0]+s,A[1]);T_AC=(A[0]-s/9,A[1]+s*4*math.sqrt(5)/9)
        T_BC=(B[0]+s*(-22/21),B[1]+s*(16*math.sqrt(5)/21))
        return {"inputs":{"scalePxPerUnit":s,"sideLengths":{"AB":3,"AC":6,"BC":7},
                          "semiperimeter":8,"tangentLengths":{"A":1,"B":2,"C":5}},
            "points":{"A":A,"B":B,"C":C,"I":I,"F":T_AB,"E":T_AC,"D":T_BC},
            "segments":[("AB","A","B","main"),("BC","B","C","main"),("CA","C","A","main"),
                        ("AF","A","F","aux"),("BF","B","F","aux"),("AE","A","E","aux"),
                        ("CE","C","E","aux"),("BD","B","D","aux"),("CD","C","D","aux")],
            "circles":[("incircle","I",r,"aux",None)],
            "pointOffsets":{"A":(0,-12),"B":(12,-10),"C":(-12,14),"I":(12,0),"F":(0,-11),"E":(-12,0),"D":(23,10)},
            "lengthLabels":[("AB","3","AB",-12),("AC","6","CA",-12),("BC","7","BC",-23.5),("x","x","CD",18,.9)],
            "angles":[],"rightAngles":[],"ticks":[("AF",1),("AE",1),("BF",2),("BD",2),("CE",3),("CD",3)],"notes":[],
            "checks":[distance_check("AB","A","B",3,s,.004),distance_check("AC","A","C",6,s,.005),
                      distance_check("BC","B","C",7,s,.005),distance_check("AF","A","F",1,s,.005),
                      distance_check("BF","B","F",2,s,.005),distance_check("CD","C","D",5,s,.008),
                      {"id":"F-on-incircle","type":"circle_point","circle":"incircle","point":"F","scalePxPerUnit":s,"tolerance":.012},
                      {"id":"E-on-incircle","type":"circle_point","circle":"incircle","point":"E","scalePxPerUnit":s,"tolerance":.012},
                      {"id":"D-on-incircle","type":"circle_point","circle":"incircle","point":"D","scalePxPerUnit":s,"tolerance":.012}],
            "computed":{"incenterScreen":I,"inradiusPx":r,"tangentLengths":{"A":1,"B":2,"C":5},"x":5}}
    if qid == "풍덕#20":
        cx,cy=200,150;r=52;d=82;h=math.sqrt(d*d-r*r);P=(cx+d,cy);O=(cx,cy);xf=cx+r*r/d;dy=r*h/d;A=(xf,cy-dy);B=(xf,cy+dy)
        return {"inputs":{"circleRadiusPx":r,"OPpx":d,"externalPoint":"P"},
            "points":{"O":O,"P":P,"A":A,"B":B},
            "segments":[("PA","P","A","main"),("PB","P","B","main"),("OA","O","A","aux"),("OB","O","B","aux"),("OP","O","P","aux")],
            "circles":[("main","O",r,"main",None)],
            "pointOffsets":{"O":(-10,-10),"P":(12,0),"A":(16,-19),"B":(18,18)},
            "lengthLabels":[("OA","r","OA",-12),("OB","r","OB",13)],
            "angles":[],"rightAngles":[("A","A","O","P"),("B","B","O","P")],
            "ticks":[("PA",1),("PB",1)],"notes":[],
            "checks":[{"id":"A-on-circle","type":"circle_point","circle":"main","point":"A","scalePxPerUnit":1,"tolerance":.004},
                      {"id":"B-on-circle","type":"circle_point","circle":"main","point":"B","scalePxPerUnit":1,"tolerance":.004},
                      perpendicular_check("OA-perp-PA","OA","PA"),perpendicular_check("OB-perp-PB","OB","PB"),
                      {"id":"OA=OB","type":"equal","segments":["OA","OB"],"tolerance":.004},
                      {"id":"PA=PB","type":"equal","segments":["PA","PB"],"tolerance":.004}],
            "computed":{"circleRadiusPx":r,"OPpx":d,"tangentLengthPx":h,"projectionPx":r*r/d,"perpendicularOffsetPx":dy}}
    if qid == "풍덕#22":
        s=24;        A=(75,240);B=(75,204);E=(183,240);D=(183,204);C=(183,204-4.5*math.tan(math.radians(54))*s)
        return {"inputs":{"scalePxPerUnit":s,"AE":4.5,"eyeHeight":1.5,"tan54":1.38},
            "points":{"A":A,"B":B,"E":E,"D":D,"C":C},
            "segments":[("AB","A","B","main"),("AE","A","E","main"),("DE","D","E","main"),
                        ("BD","B","D","aux"),("BC","B","C","main"),("CE","C","E","aux"),("CD","C","D","aux")],
            "circles":[],"pointOffsets":{"A":(-10,16),"B":(-12,-7),"E":(18,-18),"D":(13,-5),"C":(14,-6)},
            "lengthLabels":[("AE","4.5 m","AE",14,.25),("AB","1.5 m","AB",-23.5,.65,15)],
            "angles":[("B","B","D","C","54°",15,29)],
            "rightAngles":[("D","D","B","C"),("E","E","D","A")],"ticks":[("AB",1),("DE",1),("AE",2),("BD",2)],
            "notes":[],
            "checks":[distance_check("AE","A","E",4.5,s,.004),distance_check("AB","A","B",1.5,s),
                      distance_check("DE","D","E",1.5,s),distance_check("BD","B","D",4.5,s),
                      distance_check("CD-exact-54","C","D",4.5*math.tan(math.radians(54)),s,.006),
                      perpendicular_check("BD-perp-DE","BD","DE"),angle_check("elevation","B","D","C",54,.04),
                      {"id":"CE-height-sum-exact","type":"height_sum","segments":["CD","DE"],"scalePxPerUnit":s,"expected":4.5*math.tan(math.radians(54))+1.5,"tolerance":.008}],
            "computed":{"BD":4.5,"CDExact":4.5*math.tan(math.radians(54)),"CDTableRounded":6.21,
                        "CDRoundingDelta":4.5*math.tan(math.radians(54))-6.21,"DE":1.5,
                        "CEExact":4.5*math.tan(math.radians(54))+1.5,"CETableRounded":7.71,
                        "CERoundingDelta":4.5*math.tan(math.radians(54))+1.5-7.71}}
    if qid == "풍덕#23":
        s=14;B=(90,110);C=(90,194);A=(90+6*math.sqrt(3)*s,110);D=(90+8*s*math.cos(math.radians(30)),194+8*s*math.sin(math.radians(30)))
        return {"inputs":{"scalePxPerUnit":s,"BC":6,"CD":8,"angleCAB":30,"angleACD":60,"rightAtB":True},
            "points":{"A":A,"B":B,"C":C,"D":D},
            "segments":[("AB","A","B","main"),("BC","B","C","main"),("CD","C","D","main"),("DA","D","A","main"),("AC","A","C","aux")],
            "circles":[],"pointOffsets":{"A":(11,-9),"B":(-12,17),"C":(-10,16),"D":(23,10)},
            "lengthLabels":[("BC","6","BC",14),("CD","8","CD",13)],
            "angles":[("A","A","B","C","30°",8,40),("C","C","A","D","60°",8,40)],
            "rightAngles":[("B","B","A","C")],"ticks":[],
            "fills":[{"id":"triangle-ABC","points":["A","B","C"],"fill":"#8fa8bc","opacity":.10},
                     {"id":"triangle-ACD","points":["A","C","D"],"fill":"#bc9a8f","opacity":.10}],
            "checks":[distance_check("BC","B","C",6,s),distance_check("CD","C","D",8,s,.005),
                      distance_check("AC","A","C",12,s,.006),perpendicular_check("AB-perp-BC","AB","BC"),
                      angle_check("A","A","B","C",30,.05),angle_check("C","C","A","D",60,.05),
                      {"id":"area-ABCD","type":"quad_area","points":["A","B","C","D"],"scalePxPerUnit":s,
                       "expected":42*math.sqrt(3),"tolerance":.015}],
            "computed":{"AB":6*math.sqrt(3),"BC":6,"AC":12,"CD":8,
                        "areaABC":18*math.sqrt(3),"areaACD":24*math.sqrt(3),"areaABCD":42*math.sqrt(3)}}
    if qid == "왕운#6":
        s=40;A=(60,240);B=(260,240);H=(300,240);C=(300,240-2*math.sin(math.radians(60))*s)
        return {"inputs":{"scalePxPerUnit":s,"AB":5,"BC":2,"angleABC":120,"extensionBeyondB":True},
            "points":{"A":A,"B":B,"H":H,"C":C},
            "segments":[("AB","A","B","main"),("BC","B","C","main"),("AC","A","C","main"),
                        ("BH","B","H","extension"),("CH","C","H","aux")],
            "circles":[],"pointOffsets":{"A":(-18,0),"B":(-15,20),"H":(16,0),"C":(14,-5)},
            "lengthLabels":[("AB","5","AB",22),("BC","2","BC",-8,.5),("CH","√3","CH",-21)],
            "angles":[("ABC","B","A","C","120°",10,28),("CBH","B","C","H","60°",8,24,-15)],
            "rightAngles":[("H","H","C","B")],"ticks":[],"notes":[],
            "checks":[distance_check("AB","A","B",5,s),distance_check("BC","B","C",2,s),
                      distance_check("CH","C","H",math.sqrt(3),s,.004),
                      angle_check("ABC","B","A","C",120,.05),angle_check("CBH","B","C","H",60,.05),
                      perpendicular_check("CH-perp-BH","CH","BH"),
                      {"id":"area-ABC","type":"area","triangle":["A","B","C"],"scalePxPerUnit":s,
                       "expected":5*math.sqrt(3)/2,"tolerance":.006}],
            "computed":{"AB":5,"BC":2,"BH":1,"angleABC":120,"angleCBH":60,"CH":math.sqrt(3),"area":5*math.sqrt(3)/2}}
    raise KeyError(qid)


TARGETS={
 "25_왕운중_2학기_중간_중3_수학.js":[1,2,10,11,13,21,22,6],
 "25_풍덕중_2학기_중간_중3_수학.js":[1,2,6,7,11,13,14,15,17,18,20,22,23],
}
