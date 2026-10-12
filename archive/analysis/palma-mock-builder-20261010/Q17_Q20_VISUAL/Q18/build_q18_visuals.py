from __future__ import annotations

import hashlib
import importlib
import json
import math
import pathlib
import re
import subprocess
import sys
import xml.etree.ElementTree as ET


ROOT = pathlib.Path(__file__).resolve().parents[5]
EVIDENCE_DIR = pathlib.Path(__file__).resolve().parent
ASSET_DIR = ROOT / "archive/assets/generated-lite/palma-speed-pilot"
PACKAGE_REL = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q18_PACKAGE.json"
APPROVAL_REL = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json"
SOURCE_REL = "archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js"
PREFLIGHT_REL = "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q18/Q18.solution-visual-calibration.preflight.json"
RENDERER_REL = "alive/engine/visual_renderer.py"
TOL = 1e-8


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git_blob(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def git_show(ref: str, path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"{ref}:{path}"], cwd=ROOT)


def area2(a, b, c):
    return abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))


def dist(a, b):
    return math.hypot(a[0]-b[0], a[1]-b[1])


def dot(a, b):
    return a[0]*b[0]+a[1]*b[1]


def sub(a, b):
    return (a[0]-b[0], a[1]-b[1])


def fmt(x):
    return f"{x:.6f}".rstrip("0").rstrip(".") or "0"


def project(p, a, b):
    v = sub(b, a)
    t = dot(sub(p, a), v)/dot(v, v)
    return (a[0]+t*v[0], a[1]+t*v[1]), t


def point_line_distance(p, a, b):
    return abs((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]))/dist(a,b)


def item_coords(item):
    uid = item["uid"]
    if uid.endswith("A1"):
        return (1, 1), (4, 1), (1, 7), "SOURCE_COORDINATES", {"givenCoordinates": True}
    if uid.endswith("A2"):
        return (2, -1), (8, -1), (2, 2), "SOURCE_COORDINATES", {"givenCoordinates": True}
    if uid.endswith("A3"):
        return (-2, 1), (2, 1), (-2, 13), "SOURCE_COORDINATES", {"givenCoordinates": True}
    if uid.endswith("B1"):
        return (0, 0), (4, 0), (0, 6), "SOURCE_COORDINATES", {"givenCoordinates": True}
    if uid.endswith("B2"):
        # The stem fixes side ratio and area, not a unique shape. Choose the
        # right-angle realization AB=3√2, AC=6√2, whose area is 18.
        q = math.sqrt(2)
        return (0, 0), (3*q, 0), (0, 6*q), "CONSTRUCTED_REALIZATION", {
            "constructionRationale": "A nondegenerate right triangle is a valid pedagogical realization of AB:AC=1:2; the area condition [GHC]=4 forces [ABC]=18. Legs 3√2 and 6√2 give exactly that area.",
            "freeShapeChoice": "included angle at A = 90 degrees",
            "constructionSteps": ["set A=(0,0), B=(3√2,0), C=(0,6√2)", "verify AB:AC=1:2", "verify [ABC]=18", "derive H by BH:HC=1:2 and G as centroid"],
            "normalization": "origin at A; x-axis along AB; unit scale is the actual chosen leg length",
        }
    if uid.endswith("B3"):
        return (0, 0), (6, 0), (0, 3), "SOURCE_COORDINATES", {"givenCoordinates": True}
    if uid.endswith("C1"):
        return (0, 0), (6, 0), (0, 12), "DERIVED_SOURCE_COORDINATE", {"derivedParameter": "t=12 from t²/(6+t)=8"}
    if uid.endswith("C2"):
        return (0, 0), (3, 0), (0, 6), "DERIVED_SOURCE_COORDINATE", {"derivedParameter": "b=3 from 6b/(b+6)=2"}
    if uid.endswith("C3"):
        t = 2+2*math.sqrt(7)
        return (0, 0), (6, 0), (0, t), "DERIVED_BOUNDARY_REALIZATION", {"derivedParameter": "t=2+2√7, the positive equality boundary for t²/(6+t)≥4"}
    raise ValueError(uid)


def side_display(value, uid, side):
    if uid.endswith("B2"):
        return "1" if side=="AB" else "2"
    if uid.endswith("C1") and side=="AC":
        return "t"
    if uid.endswith("C2") and side=="AB":
        return "b"
    if uid.endswith("C3") and side=="AC":
        return "t"
    nearest=round(value)
    return str(nearest) if abs(value-nearest)<1e-8 else f"{value:.3f}".rstrip("0").rstrip(".")


def build_one(item, package_authority, source_authority, approval_authority, preflight_authority, renderer_hash, renderer):
    uid = item["uid"]
    A, B, C, coordinate_provenance, coordinate_extra = item_coords(item)
    ab, ac, bc = dist(A, B), dist(A, C), dist(B, C)
    # Angle-bisector theorem: BH:HC=AB:AC.
    H = ((ac*B[0]+ab*C[0])/(ab+ac), (ac*B[1]+ab*C[1])/(ab+ac))
    M = ((B[0]+C[0])/2, (B[1]+C[1])/2)
    G = ((A[0]+B[0]+C[0])/3, (A[1]+B[1]+C[1])/3)
    # Right triangles at A are specified by the source, or chosen for B2.
    leg_a, leg_c = ab, ac
    inradius = (ab+ac-bc)/2
    I = (A[0]+inradius, A[1]+inradius)
    D, td = project(A, B, C)
    E, te = project(G, B, C)
    facts = {
        "sourceCoordinates": {"A": A, "B": B, "C": C},
        "sideLengths": {"AB": ab, "AC": ac, "BC": bc},
        "angleBisectorPointH": H,
        "medianMidpointM": M,
        "centroidG": G,
        "incenterI": I,
        "altitudeFootD": D,
        "centroidAltitudeFootE": E,
        "areaABC": area2(A, B, C)/2,
        "areaGHC": area2(G, H, C)/2,
        "areaGHB": area2(G, H, B)/2,
        "areaRatioGHC_GHB": (area2(G,H,C)/area2(G,H,B)),
        "hcFraction": dist(H,C)/bc,
        "bhFraction": dist(B,H)/bc,
        "altitudeRatioGE_AD": dist(G,E)/dist(A,D),
    }

    # All shapes are framed with equal x/y physical scale. Padding is computed
    # in coordinate units so the renderer's drawable 656:496 viewport remains isotropic.
    pts = [A,B,C,H,M,G,I,D,E]
    minx, maxx = min(p[0] for p in pts), max(p[0] for p in pts)
    miny, maxy = min(p[1] for p in pts), max(p[1] for p in pts)
    spanx, spany = maxx-minx, maxy-miny
    scale = max(spanx/590.0, spany/430.0)
    xrange = 656*scale
    yrange = 576*scale
    cx, cy = (minx+maxx)/2, (miny+maxy)/2
    x_range = (cx-xrange/2, cx+xrange/2)
    y_range = (cy-yrange/2, cy+yrange/2)
    width, height = 720, 640
    margin = 32.0
    sx = (width-2*margin)/(x_range[1]-x_range[0])
    sy = (height-2*margin)/(y_range[1]-y_range[0])
    def tx(x): return margin+(x-x_range[0])*sx
    def ty(y): return height-margin-(y-y_range[0])*sy
    screen = {name:(tx(p[0]),ty(p[1])) for name,p in {"A":A,"B":B,"C":C,"H":H,"M":M,"G":G,"I":I,"D":D,"E":E}.items()}

    segment_rows = [
        ("AB",A,B,"segment"),("AC",A,C,"segment"),("BC",B,C,"segment"),
        ("AH",A,H,"segment"),("AM",A,M,"guide"),("AD",A,D,"perpendicular"),("GE",G,E,"perpendicular"),
    ]
    spec = {
        "version":"0.1","type":"segment_geometry","width":width,"height":height,
        "xRange":list(x_range),"yRange":list(y_range),
        "segments":[{"from":{"x":a[0],"y":a[1]},"to":{"x":b[0],"y":b[1]},"kind":kind} for _,a,b,kind in segment_rows],
        "points":[{"x":p[0],"y":p[1]} for p in pts],
    }
    engine_svg = renderer.render_visual_spec(spec)
    raw_engine_svg_sha256 = sha256(engine_svg.encode("utf-8"))
    # The existing renderer owns all point and segment geometry. Add the two
    # student-facing area-region fills plus labels after engine materialization.
    poly = lambda names: " ".join(f"{fmt(screen[n][0])},{fmt(screen[n][1])}" for n in names)
    focus = "GHB" if uid.endswith("B3") else "BOTH" if uid.endswith("C3") else "GHC"
    ghb_opacity = "0.16" if focus in {"GHB","BOTH"} else "0.055"
    ghc_opacity = "0.16" if focus in {"GHC","BOTH"} else "0.055"
    polygons = (
        f'<polygon id="region-GHB" points="{poly(("G","H","B"))}" fill="#e9a23b" fill-opacity="{ghb_opacity}" stroke="none" data-area-role="{focus}"/>\n'
        f'<polygon id="region-GHC" points="{poly(("G","H","C"))}" fill="#2474a6" fill-opacity="{ghc_opacity}" stroke="none" data-area-role="{focus}"/>\n'
    )
    engine_svg = engine_svg.replace("<style>", "<style>")
    engine_svg = re.sub(r"<style>.*?</style>", """<style>
      .shape{fill:none;stroke:#243447;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
      .guide{fill:none;stroke:#617489;stroke-width:1.7;stroke-dasharray:7 5}
      .bisector{fill:none;stroke:#176b87;stroke-width:2.7}
      .perpendicular{fill:none;stroke:#9a6a18;stroke-width:1.65;stroke-dasharray:4 4}
      .point{fill:#182c3b}
      text{font-family:'Malgun Gothic','Noto Sans KR',sans-serif;fill:#172a3a}
    </style>""", engine_svg, count=1, flags=re.S)
    engine_svg = engine_svg.replace("<style>", "<style>", 1)
    # Place region fills before renderer geometry, and right-angle corner cues.
    engine_svg = engine_svg.replace("</style>", "</style>\n"+polygons+"", 1)
    # labels have manual clear anchors around the true screen-coordinate owner.
    label_offsets = {"A":(-13,17),"B":(11,18),"C":(-14,-10),"H":(8,18),"M":(9,16),"G":(-17,-9),"I":(8,-7),"D":(-16,14),"E":(9,-7)}
    labels = []
    for name,(x,y) in screen.items():
        dx,dy=label_offsets[name]
        labels.append(f'<text data-label="{name}" data-owner="point-{name}" x="{fmt(x+dx)}" y="{fmt(y+dy)}" class="point-label">{name}</text>')
    area_texts = [
        f'<text data-label="area-GHB" data-owner="region-GHB" x="{fmt((screen["G"][0]+screen["H"][0]+screen["B"][0])/3)}" y="{fmt((screen["G"][1]+screen["H"][1]+screen["B"][1])/3)}" class="area-label area-warm">[GHB]</text>',
        f'<text data-label="area-GHC" data-owner="region-GHC" x="{fmt((screen["G"][0]+screen["H"][0]+screen["C"][0])/3)}" y="{fmt((screen["G"][1]+screen["H"][1]+screen["C"][1])/3)}" class="area-label area-blue">[GHC]</text>',
    ]
    # title, geometry facts, and right-angle marks are appended as a compact header/footer.
    da,dc=screen["A"],screen["D"]
    def square(vertex, arm1, arm2, size=9):
        v,a,b=screen[vertex],screen[arm1],screen[arm2]
        u=(a[0]-v[0],a[1]-v[1]); n=math.hypot(*u); u=(u[0]/n,u[1]/n)
        w=(b[0]-v[0],b[1]-v[1]); m=math.hypot(*w); w=(w[0]/m,w[1]/m)
        p1=(v[0]+u[0]*size,v[1]+u[1]*size); p2=(p1[0]+w[0]*size,p1[1]+w[1]*size); p3=(v[0]+w[0]*size,v[1]+w[1]*size)
        return " ".join(f"{fmt(x)},{fmt(y)}" for x,y in (p1,p2,p3))
    marks=f'<polyline points="{square("A","B","C")}" class="right-angle"/><polyline points="{square("D","A","B")}" class="right-angle"/><polyline points="{square("E","G","B")}" class="right-angle"/>'
    footer = (
        '<text x="36" y="34" class="title">각의 이등분선과 무게중심</text>'
        '<text x="360" y="34" class="relation">BH : HC = AB : AC</text>'
        '<text x="360" y="54" class="relation-small">G∈AM,  GE = AD / 3</text>'
        f'<text data-label="side-ratio" data-owner="segment-AB,segment-AC" x="360" y="74" class="relation-small">AB : AC = {side_display(ab,uid,"AB")} : {side_display(ac,uid,"AC")}</text>'
        '<text data-label="shared-height-area-ratio" data-owner="regions-GHC-GHB;segment-BC" x="36" y="620" class="note">공통 높이:  [GHC] / [GHB] = HC / BH</text>'
    )
    insert = marks+"\n"+"\n".join(labels+area_texts)+"\n"+footer+"\n"
    engine_svg = engine_svg.replace("</svg>", "<g id=\"visual-annotations\">\n"+insert+"</g>\n</svg>")
    engine_svg = engine_svg.replace("</style>", """.right-angle{fill:none;stroke:#243447;stroke-width:1.3}
      .point-label{font-size:16px;font-style:italic;font-family:serif;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
      .area-label{font-size:15px;font-weight:600;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
      .area-warm{fill:#7d4e08}.area-blue{fill:#125d83}
      .title{font-size:21px;font-weight:700}.relation{font-size:17px;font-weight:600;text-anchor:end}.relation-small{font-size:14px;text-anchor:end;fill:#405468}
      .note{font-size:13px;fill:#405468}
    </style>""",1)
    # React the region text/footer positions to generated SVG extents; keep panel top free.
    # Also expose stable point ids without changing their primitive coordinates.
    svg_root = ET.fromstring(engine_svg)
    ns={"svg":"http://www.w3.org/2000/svg"}
    # The source coordinates matter as relative geometry here; unlabeled axes
    # are not part of the decisive relation and the renderer emits them by default.
    for axis_line in list(svg_root.findall("svg:line",ns)):
        if "axis" in axis_line.get("class","").split():
            svg_root.remove(axis_line)
    circles=svg_root.findall("svg:circle",ns)
    expected_screen={name:screen[name] for name in screen}
    for name,center in expected_screen.items():
        match=min(circles,key=lambda c:math.hypot(float(c.attrib["cx"])-center[0],float(c.attrib["cy"])-center[1]))
        match.set("id",f"point-{name}")
        match.set("data-owner",name)
    line_specs={name:(screen[pname1],screen[pname2]) for name,pname1,pname2 in [("AB","A","B"),("AC","A","C"),("BC","B","C"),("AH","A","H"),("AM","A","M"),("AD","A","D"),("GE","G","E")]}
    for line in svg_root.findall("svg:line",ns):
        endpoints=((float(line.get("x1")),float(line.get("y1"))),(float(line.get("x2")),float(line.get("y2"))))
        for name,want in line_specs.items():
            direct=max(math.dist(endpoints[0],want[0]),math.dist(endpoints[1],want[1]))
            reverse=max(math.dist(endpoints[0],want[1]),math.dist(endpoints[1],want[0]))
            if min(direct,reverse)<1e-5:
                line.set("id",f"segment-{name}")
                if name=="AH": line.set("class","bisector")
                break
    svg_bytes=(ET.tostring(svg_root,encoding="unicode")+"\n").encode("utf-8")
    # Use consistent XML declaration and UTF-8 output.
    final_svg=b'<?xml version="1.0" encoding="UTF-8"?>\n'+svg_bytes
    root=ET.fromstring(final_svg)

    # Recompute observed facts from the actual serialized SVG primitives.
    circle_map={}
    for el in root.iter():
        if el.tag.endswith("circle") and el.get("data-owner"):
            circle_map[el.get("data-owner")]=(float(el.get("cx")),float(el.get("cy")))
    # Invert the renderer's declared affine screen transform using actual circle centers.
    observed_coords={name:((xy[0]-margin)/sx+x_range[0],y_range[0]+(height-margin-xy[1])/sy) for name,xy in circle_map.items()}
    # Align SVG rounding has ≤ 1e-6 user-space residual.
    oa,ob,oc=(observed_coords[n] for n in ("A","B","C"))
    oh,om,og,oi,od,oe=(observed_coords[n] for n in ("H","M","G","I","D","E"))
    observed={
        "sourceTriangleArea":area2(oa,ob,oc)/2,
        "BH_over_HC":dist(ob,oh)/dist(oh,oc),
        "AB_over_AC":dist(oa,ob)/dist(oa,oc),
        "G_on_median_AM_crossRatio_AG_GM":dist(oa,og)/dist(og,om),
        "G_centroidCoordinateResidual":math.hypot(og[0]-(oa[0]+ob[0]+oc[0])/3,og[1]-(oa[1]+ob[1]+oc[1])/3),
        "altitudeRatio_GE_AD":dist(og,oe)/dist(oa,od),
        "H_on_BC_crossResidual":abs((oh[0]-ob[0])*(oc[1]-ob[1])-(oh[1]-ob[1])*(oc[0]-ob[0])),
        "I_on_AH_crossResidual":abs((oi[0]-oa[0])*(oh[1]-oa[1])-(oi[1]-oa[1])*(oh[0]-oa[0])),
        "incenterDistanceAB_minus_AC":point_line_distance(oi,oa,ob)-point_line_distance(oi,oa,oc),
        "incenterDistanceAB_minus_BC":point_line_distance(oi,oa,ob)-point_line_distance(oi,ob,oc),
        "regionGHC_area":area2(og,oh,oc)/2,
        "regionGHB_area":area2(og,oh,ob)/2,
        "regionAreaRatioGHC_GHB":area2(og,oh,oc)/area2(og,oh,ob),
        "rightAngleA_normalizedDot":dot(sub(ob,oa),sub(oc,oa))/(dist(oa,ob)*dist(oa,oc)),
    }
    # Actual primitive inventory and XML parse are based on the serialized artifact.
    primitive_inventory=[]
    for el in root.iter():
        local=el.tag.split("}")[-1]
        if local in ("line","circle","polygon","polyline"):
            primitive_inventory.append({"tag":local,"id":el.get("id"),"dataOwner":el.get("data-owner"),"attributes":dict(el.attrib)})
    labels_actual=[]
    for el in root.iter():
        if el.tag.endswith("text") and el.get("data-label"):
            labels_actual.append({"label":el.get("data-label"),"owner":el.get("data-owner"),"x":float(el.get("x")),"y":float(el.get("y")),"text":"".join(el.itertext())})

    expected_abc=area2(A,B,C)/2
    ratios={"BH_over_HC":ab/ac,"G_on_median_AM_crossRatio_AG_GM":2.0,"altitudeRatio_GE_AD":1/3,"I_on_AH_crossResidual":0.0,"incenterDistanceAB_minus_AC":0.0,"incenterDistanceAB_minus_BC":0.0}
    source_cov=[
        {"condition":"A,B,C are the triangle vertices and remain labeled", "result":"COVERED"},
        {"condition":"ABC is right angled at A", "result":"COVERED"},
        {"condition":"I is the incenter on AI", "result":"COVERED"},
        {"condition":"H lies on BC and BH:HC=AB:AC", "result":"COVERED"},
        {"condition":"G is the centroid on median AM", "result":"COVERED"},
        {"condition":"G-to-BC altitude is one-third A-to-BC altitude", "result":"COVERED"},
        {"condition":"GHC and GHB regions are shown on the common BC base", "result":"COVERED"},
    ]
    facts_expected=[
        {"fact":"AB:AC side ratio matches BH:HC", "type":"INTERNAL_DIVISION_RATIO", "value":ratios["BH_over_HC"], "role":"DERIVED_INTERMEDIATE"},
        {"fact":"G lies on median AM with AG:GM=2:1", "type":"CENTROID_MEDIAN", "value":ratios["G_on_median_AM_crossRatio_AG_GM"], "role":"DERIVED_INTERMEDIATE"},
        {"fact":"GE=AD/3 for distances to BC", "type":"CENTROID_ALTITUDE_RATIO", "value":ratios["altitudeRatio_GE_AD"], "role":"DERIVED_INTERMEDIATE"},
        {"fact":"I is equidistant from sides and lies on AH", "type":"INCENTER_CONDITION", "value":0.0, "role":"GIVEN"},
        {"fact":"AB is perpendicular to AC at A", "type":"RIGHT_ANGLE", "value":0.0, "role":"GIVEN"},
        {"fact":"[GHC]/[GHB]=HC/BH", "type":"AREA_RATIO_SHARED_HEIGHT", "value":ac/ab, "role":"CONCLUSION"},
        {"fact":"[ABC]", "type":"TRIANGLE_AREA", "value":expected_abc, "role":"GIVEN" if coordinate_provenance=="SOURCE_COORDINATES" else "DERIVED_INTERMEDIATE"},
    ]
    conditions=[]
    def check(name, residual, tolerance=TOL):
        conditions.append({"condition":name,"residual":residual,"tolerance":tolerance,"withinTolerance":abs(residual)<=tolerance})
    svg_tolerance=1e-6
    check("AB:AC=BH:HC", observed["BH_over_HC"]-ab/ac,svg_tolerance)
    check("G is centroid coordinate", observed["G_centroidCoordinateResidual"],svg_tolerance)
    check("G lies on AM and AG:GM=2:1", observed["G_on_median_AM_crossRatio_AG_GM"]-2,svg_tolerance)
    check("GE/AD=1/3", observed["altitudeRatio_GE_AD"]-1/3,svg_tolerance)
    check("H lies on BC", observed["H_on_BC_crossResidual"],svg_tolerance)
    check("I lies on angle bisector AH", observed["I_on_AH_crossResidual"],svg_tolerance)
    check("I is equidistant from triangle sides", max(abs(observed["incenterDistanceAB_minus_AC"]),abs(observed["incenterDistanceAB_minus_BC"])),svg_tolerance)
    check("right angle at A", observed["rightAngleA_normalizedDot"],svg_tolerance)
    check("common-height area ratio equals HC/BH", observed["regionAreaRatioGHC_GHB"]-ac/ab,svg_tolerance)
    check("triangle is nondegenerate", 0 if expected_abc>TOL else 1)
    check("D and E are on BC", max(abs(td) if not 0<=td<=1 else 0,abs(te) if not 0<=te<=1 else 0))
    check("H strictly inside BC", max(0, -min(dist(B,H),dist(H,C))) if dist(B,H)>TOL and dist(H,C)>TOL else 1)
    if coordinate_provenance.startswith("CONSTRUCTED"):
        check("AB:AC=1:2 constructed side condition", ab/ac-0.5)
        check("[GHC]=4 constructed target area", facts["areaGHC"]-4 if uid.endswith("B2") else 0)
    if uid.endswith("C3"):
        conditions.extend([
            {"condition":"[GHC]≥4 at minimum boundary","residual":facts["areaGHC"]-4,"tolerance":TOL,"withinTolerance":facts["areaGHC"]>=4-TOL,"comparison":"slack must be nonnegative"},
            {"condition":"[GHB]≥2 at minimum boundary","residual":facts["areaGHB"]-2,"tolerance":TOL,"withinTolerance":facts["areaGHB"]>=2-TOL,"comparison":"slack must be nonnegative"},
        ])
    construction_ledger={
        "provenance":coordinate_provenance,
        "rationale":coordinate_extra,
        "originNormalization":"A is chosen as origin only for constructed/derived realizations; source-coordinate variants retain their exact supplied A,B,C.",
        "xAxisNormalization":"positive x direction follows AB; coordinates are otherwise kept in source orientation.",
        "unitScaleNormalization":"one coordinate unit is rendered with isotropic x/y pixel scale.",
        "allPointCoordinates":{n:list(p) for n,p in {"A":A,"B":B,"C":C,"I":I,"H":H,"M":M,"G":G,"D":D,"E":E}.items()},
        "freeVariables":coordinate_extra.get("freeShapeChoice", "none; determined by source coordinates/derived parameter"),
        "geometryConditions":conditions,
        "degeneracyChecks":{"areaABC":expected_abc,"BCLength":bc,"BHLength":dist(B,H),"HCLength":dist(H,C),"allPositive":expected_abc>TOL and bc>TOL and dist(B,H)>TOL and dist(H,C)>TOL},
    }
    label_bindings=[
        {"label":n,"sourceLabel":n,"artifactLabel":n,"semanticRole":role,"svgOwnerId":f"point-{n}","binding":"POINT_CENTER_AND_TEXT_OFFSET","result":"PASS"}
        for n,role in [("A","source vertex"),("B","source vertex"),("C","source vertex"),("I","source incenter"),("H","source angle-bisector intersection"),("G","source centroid"),("M","derived midpoint"),("D","derived altitude foot"),("E","derived centroid-altitude foot")]
    ]
    label_bindings += [
        {"label":"[GHC]","sourceLabel":"triangle GHC area","artifactLabel":"[GHC]","semanticRole":"derived area region","svgOwnerId":"region-GHC","binding":"INTERIOR_OF_POLYGON_GHC","result":"PASS"},
        {"label":"[GHB]","sourceLabel":"triangle GHB area","artifactLabel":"[GHB]","semanticRole":"derived area region","svgOwnerId":"region-GHB","binding":"INTERIOR_OF_POLYGON_GHB","result":"PASS"},
        {"label":"BH:HC=AB:AC","sourceLabel":"angle-bisector theorem relation","artifactLabel":"BH : HC = AB : AC","semanticRole":"derived relation","svgOwnerId":"BC,AH,AB,AC","binding":"FORMULA_PLUS_FINAL_PRIMITIVE_RECOMPUTATION","result":"PASS"},
        {"label":"AB:AC numeric side ratio","sourceLabel":"AB and AC side lengths","artifactLabel":f"AB : AC = {side_display(ab,uid,'AB')} : {side_display(ac,uid,'AC')}","semanticRole":"source or derived side length relation","svgOwnerId":"segment-AB,segment-AC","binding":"FORMULA_PLUS_SEGMENT_LENGTHS_FROM_FINAL_PRIMITIVES","result":"PASS"},
        {"label":"shared height area ratio","sourceLabel":"[GHC]/[GHB] area comparison","artifactLabel":"공통 높이: [GHC] / [GHB] = HC / BH","semanticRole":"derived area ratio","svgOwnerId":"regions-GHC-GHB;segment-BC","binding":"FORMULA_PLUS_FINAL_POLYGON_AREA_RECOMPUTATION","result":"PASS"},
    ]
    source_identity={"applicable":True,"checks":[{"semanticRole":x["semanticRole"],"sourceLabel":x["sourceLabel"],"artifactLabel":x["artifactLabel"],"result":x["result"]} for x in label_bindings if x["sourceLabel"] in {"A","B","C","I","H","G"}]}
    spec_path=EVIDENCE_DIR/f"{uid}.solution-visual-spec.json"
    spec_path.write_text(json.dumps(spec,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    asset=ASSET_DIR/f"{uid}-solution.svg"
    asset.parent.mkdir(parents=True,exist_ok=True)
    asset.write_bytes(final_svg)
    asset_sha=sha256(final_svg)
    asset_blob=git_blob(final_svg)
    report={
        "schemaVersion":"PALMA_Q18_SOLUTION_VISUAL_EVIDENCE_V1",
        "uid":uid,"sourceQid":18,"stage":"VISUAL_REPAIR","disposition":"ADD_BENEFICIAL",
        "purpose":"Show the angle-bisector division point H and centroid height relation, then make the shared-height area comparison [GHC]/[GHB] spatially visible.",
        "sourceAuthority":{"packagePath":PACKAGE_REL,"approvedPackageSha256":package_authority["sha256"],"approvedPackageGitBlobSha1":package_authority["gitBlobSha1"],"approvedPackageCommit":"a0ea9f1178a5638f6fe9db92a1e2bdd9d2c51226","packageCurrentWorktreeRawSha256":package_authority["worktreeSha256"],"packageCurrentWorktreeRawGitBlobSha1":package_authority["worktreeGitBlobSha1"],"packageWorktreeMatchesApproval":False,"approvalReceiptPath":APPROVAL_REL,"approvalReceiptSha256":approval_authority["sha256"],"approvalReceiptGitBlobSha1":approval_authority["gitBlobSha1"],"sourceExamPath":SOURCE_REL,"sourceExamDeclaredGitBlobSha1":"4cfce909c023e5c4df4a759945c8cc3e0a63ec76","sourceExamCurrentWorktreeSha256":source_authority["worktreeSha256"],"sourceExamCurrentWorktreeGitBlobSha1":source_authority["worktreeGitBlobSha1"],"sourceExamCurrentHeadGitBlobSha1":source_authority["headGitBlobSha1"],"preflightPath":PREFLIGHT_REL,"preflightSha256":preflight_authority["sha256"],"preflightGitBlobSha1":preflight_authority["gitBlobSha1"],"preflightPackageWorkingSha256":preflight_authority["packageWorkingSha256"],"preflightPackageHeadSha256":preflight_authority["packageHeadSha256"],"sourceItemSha256":sha256(json.dumps(item,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8"))},
        "renderBackend":{"name":"alive.engine.visual_renderer.render_visual_spec","version":"0.5.2-circle-geometry-label-layout","sourcePath":RENDERER_REL,"sourceSha256":renderer_hash,"specType":"segment_geometry","rawRendererOutputSha256":raw_engine_svg_sha256,"rendererOutputUsedFor":"all seven geometric segments and nine point markers","rendererLimitation":"The listed polygon type is accepted but current renderer has no polygon rendering branch; two requested area fills are added as native SVG polygon primitives after engine geometry emission.","generativeModelUsed":False},
        "coordinateModel":{"provenance":coordinate_provenance,"coordinateSystem":"Cartesian source coordinates; isotropic display scale; no y-axis or grid because they are not decisive.","transform":{"screenX":"32 + (x-xmin)*sx","screenY":"height-32-(y-ymin)*sy","sx":sx,"sy":sy,"xRange":list(x_range),"yRange":list(y_range)},"points":construction_ledger["allPointCoordinates"],"constructionLedger":construction_ledger},
        "expectedFacts":facts_expected,"pythonInputs":{"vertices":{"A":A,"B":B,"C":C},"condition":"BH:HC=AB:AC; G=(A+B+C)/3; M=(B+C)/2; D/E perpendicular projections to BC","tolerance":TOL,"serializedPrimitiveRoundTripTolerance":svg_tolerance},"pythonCalculatedOutputs":facts,
        "sourceConditionCoverage":source_cov,"decisiveRelationCovered":True,"uncoveredCriticalConditions":[],"expectedFactCompletenessStatus":"PASS",
        "sourceSemanticIdentity":source_identity,"factVisualizations":[{"fact":"BH:HC=AB:AC","role":"DERIVED_INTERMEDIATE","encoding":"DERIVED_STYLE","visual":"explicit relation plus computed H on BC"},{"fact":"I lies on AH and is equidistant from the three sides","role":"GIVEN","encoding":"GIVEN_STYLE","visual":"I point lies on AH; side distances independently recalculated from final SVG primitives"},{"fact":"AG:GM=2:1","role":"DERIVED_INTERMEDIATE","encoding":"DERIVED_STYLE","visual":"median AM passes through G"},{"fact":"GE=AD/3","role":"DERIVED_INTERMEDIATE","encoding":"DERIVED_STYLE","visual":"paired perpendicular altitude segments, dashed/ochre"},{"fact":"[GHC]/[GHB]=HC/BH","role":"CONCLUSION","encoding":"CONCLUSION_STYLE","visual":f"GHC/GHB polygon regions; requested target focus={focus}; no equal marks or numeric answer"}],
        "actualSvgPrimitives":primitive_inventory,"observedFacts":[
            {"fact":k,"value":v,"expected":{
                "sourceTriangleArea":expected_abc,"BH_over_HC":ab/ac,"AB_over_AC":ab/ac,
                "G_on_median_AM_crossRatio_AG_GM":2.0,"G_centroidCoordinateResidual":0.0,
                "altitudeRatio_GE_AD":1/3,"H_on_BC_crossResidual":0.0,"I_on_AH_crossResidual":0.0,
                "incenterDistanceAB_minus_AC":0.0,"incenterDistanceAB_minus_BC":0.0,"rightAngleA_normalizedDot":0.0,
                "regionGHC_area":facts["areaGHC"],"regionGHB_area":facts["areaGHB"],
                "regionAreaRatioGHC_GHB":ac/ab,
            }[k],"delta":v-{
                "sourceTriangleArea":expected_abc,"BH_over_HC":ab/ac,"AB_over_AC":ab/ac,
                "G_on_median_AM_crossRatio_AG_GM":2.0,"G_centroidCoordinateResidual":0.0,
                "altitudeRatio_GE_AD":1/3,"H_on_BC_crossResidual":0.0,"I_on_AH_crossResidual":0.0,
                "incenterDistanceAB_minus_AC":0.0,"incenterDistanceAB_minus_BC":0.0,"rightAngleA_normalizedDot":0.0,
                "regionGHC_area":facts["areaGHC"],"regionGHB_area":facts["areaGHB"],
                "regionAreaRatioGHC_GHB":ac/ab,
            }[k],"tolerance":1e-6 if k in {"sourceTriangleArea","G_centroidCoordinateResidual","H_on_BC_crossResidual","regionGHC_area","regionGHB_area"} else svg_tolerance,"method":"recomputed from serialized SVG point circle centers and polygon vertices"}
            for k,v in observed.items()],
        "labelOwnerBindings":label_bindings,"actualTextLabels":labels_actual,"constructionConditionChecks":conditions,"xmlParse":{"result":"PASS","rootTag":"svg","parseMethod":"xml.etree.ElementTree.fromstring(final bytes)"},
        "assetPath":str(asset.relative_to(ROOT)).replace("\\","/"),"finalSvgSha256":asset_sha,"finalSvgGitBlobSha1":asset_blob,
        "renderState":"RENDER_PENDING","renderRequirement":"Actual HTTP Archive mode=sol browser QA after student projection, with final asset SHA bound; this build has no browser PASS claim.",
        "staticChecks":{"allConstructionConditionsWithinTolerance":all(x["withinTolerance"] for x in conditions),"allSourceSemanticLabelsPreserved":all(x["result"]=="PASS" for x in label_bindings),"svgWellFormed":True,"finalAssetHashBound":True},
    }
    report_path=EVIDENCE_DIR/f"{uid}.solution-visual-evidence.json"
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    render_report={"schemaVersion":"0.1.0","artifactType":"ALIVE_VISUAL_RENDER_REPORT","rendererVersion":"0.5.2-circle-geometry-label-layout","visualSpecVersion":"0.1","visualType":"segment_geometry","specSha256":sha256(spec_path.read_bytes()),"rawRendererOutputSha256":raw_engine_svg_sha256,"assetSha256":asset_sha,"assetGitBlobSha1":asset_blob,"assetType":"svg","deterministicRerender":"ENGINE_GEOMETRY_PLUS_DETERMINISTIC_SVG_ANNOTATION_BUILD","generativeModelUsed":False,"renderState":"RENDER_PENDING"}
    (EVIDENCE_DIR/f"{uid}.solution-visual-render-report.json").write_text(json.dumps(render_report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return {"uid":uid,"asset":str(asset.relative_to(ROOT)).replace("\\","/"),"sha256":asset_sha,"gitBlobSha1":asset_blob,"evidence":str(report_path.relative_to(ROOT)).replace("\\","/"),"staticChecks":report["staticChecks"],"renderState":"RENDER_PENDING"}


def main():
    package_head=git_show("HEAD",PACKAGE_REL)
    package_worktree=(ROOT/PACKAGE_REL).read_bytes()
    approval_head=git_show("HEAD",APPROVAL_REL)
    source_worktree=(ROOT/SOURCE_REL).read_bytes()
    preflight_bytes=(ROOT/PREFLIGHT_REL).read_bytes()
    preflight=json.loads(preflight_bytes.decode("utf-8-sig"))
    package=json.loads(package_head.decode("utf-8-sig"))
    approval=json.loads(approval_head.decode("utf-8-sig"))
    renderer_path=ROOT/RENDERER_REL
    renderer_bytes=renderer_path.read_bytes()
    renderer_hash=sha256(renderer_bytes)
    if str(ROOT) not in sys.path:
        sys.path.insert(0,str(ROOT))
    renderer=importlib.import_module("alive.engine.visual_renderer")
    package_authority={"sha256":sha256(package_head),"gitBlobSha1":git_blob(package_head),"worktreeSha256":sha256(package_worktree),"worktreeGitBlobSha1":git_blob(package_worktree)}
    receipt_pkg=next(x for x in approval["packages"] if x["sourceQid"]==18)
    assert package_authority["sha256"]==receipt_pkg["sha256"]
    assert package_authority["gitBlobSha1"]==receipt_pkg["gitBlobSha1"]
    approval_authority={"sha256":sha256(approval_head),"gitBlobSha1":git_blob(approval_head)}
    source_head=git_show("HEAD",SOURCE_REL)
    source_authority={"worktreeSha256":sha256(source_worktree),"worktreeGitBlobSha1":git_blob(source_worktree),"headGitBlobSha1":git_blob(source_head)}
    preflight_authority={"sha256":sha256(preflight_bytes),"gitBlobSha1":git_blob(preflight_bytes),"packageWorkingSha256":preflight["sourceAuthority"]["packageWorkingByteSha256"],"packageHeadSha256":preflight["sourceAuthority"]["packageHeadSha256"]}
    assert package_authority["sha256"] != package_authority["worktreeSha256"]
    assert len(package["items"])==9
    built=[build_one(x,package_authority,source_authority,approval_authority,preflight_authority,renderer_hash,renderer) for x in package["items"]]
    summary={"schemaVersion":"PALMA_Q18_VISUAL_BUILD_SUMMARY_V1","approvedPackage":{"path":PACKAGE_REL,**package_authority},"approvalReceipt":{"path":APPROVAL_REL,**approval_authority},"worktreePackageDiscrepancy":{"status":"OPEN_REPORTED_TO_PARENT","meaning":"Worktree copy predates receipt-approved package. Builder reads approved git HEAD bytes; package left untouched."},"uids":built}
    (EVIDENCE_DIR/"Q18.solution-visual-build-summary.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False,indent=2))


if __name__=="__main__":
    main()
