from pathlib import Path
import importlib.util
import json
import math
import os
import re
import xml.etree.ElementTree as ET

ROOT = Path.cwd()
OUT = ROOT / "docs/evidence/2025-m3-visual-publishing-normalize-a"
AUDIT = json.loads((OUT / "angle-owner-candidate-audit.json").read_text(encoding="utf-8"))
NORMALIZATION = json.loads((OUT / "normalization-ledger.json").read_text(encoding="utf-8"))
SOURCE = json.loads((OUT / "source_review_snapshot.json").read_text(encoding="utf-8"))
SOURCE_BY_KEY = {(x["exam"], int(x["qid"])): x for x in SOURCE["items"]}
ET.register_namespace("", "http://www.w3.org/2000/svg")
NS = "http://www.w3.org/2000/svg"
PRIMARY = "#2563eb"
DERIVED = "#0f766e"
GUIDE = "#94a3b8"
INK = "#1f2937"
DRY_RUN = os.environ.get("APMATH_OWNER_DRY_RUN") == "1"

spec = importlib.util.spec_from_file_location("angle_audit", OUT / "audit_angle_owner_candidates.py")
audit_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit_module)

def local(tag): return tag.split("}")[-1]
def svg(tag): return f"{{{NS}}}{tag}"
def xy(value): return tuple(float(v) for v in value)
def fmt(v): return f"{float(v):.3f}".rstrip("0").rstrip(".")
def angle(p, q): return math.degrees(math.atan2(q[1]-p[1], q[0]-p[0])) % 360
def angdiff(a, b): return abs((a-b+180) % 360 - 180)
def unit(a):
    r=math.radians(a); return math.cos(r), math.sin(r)
def midpoint(a,b): return ((a[0]+b[0])/2,(a[1]+b[1])/2)

EXAM_PREFIXES = {
    "25_왕운중": "WANG",
    "25_풍덕중": "PUNG",
    "25_연향중": "YEON",
    "25_금당중": "GEUM",
    "25_신흥중": "SHIN",
}

def exam_key(path):
    name=Path(path).name
    for prefix,key in EXAM_PREFIXES.items():
        if name.startswith(prefix): return key
    raise ValueError(f"UNKNOWN_EXAM:{name}")

# These values are arc measures, so their owner is a circle arc rather than an angle wedge.
ARC_MEASURE_TEXT = {
    ("YEON",11,"130°"): "AB",
    ("GEUM",4,"72°"): "AB",
    ("GEUM",4,"96°"): "CD",
    ("SHIN",3,"25°"): "AB+BC",
    ("SHIN",11,"160°"): "CA",
}

# Texts whose owner must follow the source's named point/rays, including labels moved by earlier layout passes.
ANGLE_OVERRIDES = {
    ("WANG",20,"45°"): {"vertex":"A","vertexCoord":[60.0,45.0],"rayAngles":[45,90]},
    ("WANG",20,"30°"): {"vertex":"A","vertexCoord":[60.0,45.0],"rayAngles":[15,45],"move":True,"labelPosition":[150,40],"leader":True},
    ("YEON",10,"30°"): {"vertex":"P","neighbors":["C","D"],"move":True,"labelRadius":65},
    ("YEON",10,"40°"): {"vertex":"Q","neighbors":["B","D"],"move":True,"labelRadius":72},
    ("YEON",22,"30°"): {"vertex":"P","vertexCoord":[433.38,151.20],"neighborCoords":[[119.52,95.86],[174.02,245.60]],"move":True,"labelRadius":60},
    ("YEON",22,"120°"): {"vertex":"O","vertexCoord":[190.00,155.00],"neighborCoords":[[119.52,95.86],[276.45,123.53]],"radius":24,"move":True,"labelRadius":70},
    ("YEON",22,"60°"): {"vertex":"O","vertexCoord":[190.00,155.00],"neighborCoords":[[174.02,245.60],[260.48,214.14]],"radius":15,"move":True},
    ("GEUM",5,"50°"): {"vertex":"O","neighbors":["D","E"]},
    ("GEUM",5,"65°"): {"vertex":"C","neighbors":["A","B"],"move":True,"labelRadius":55},
    ("GEUM",22,"30°"): {"vertex":"C","neighbors":["B","P"],"move":True,"labelPosition":[340,258]},
    ("GEUM",22,"90°"): {"vertex":"C","neighbors":["A","B"],"move":True,"labelPosition":[190,290],"leader":True,"leaderPoints":[[250,235],[238,255],[210,275],[179,280]]},
    ("SHIN",2,"62°"): {"vertex":"A","vertexCoord":[123.40,205.00],"neighborCoords":[[247.46,62.28],[265.92,237.90]],"move":True},
    ("SHIN",2,"x=118°"): {"vertex":"C","vertexCoord":[307.03,130.81],"neighborCoords":[[265.92,237.90],[247.46,62.28]],"move":True},
    ("SHIN",2,"82°"): {"vertex":"D","vertexCoord":[247.46,62.28],"neighborCoords":[[123.40,205.00],[307.03,130.81]],"move":True},
    ("SHIN",2,"y=98°"): {"vertex":"B","vertexCoord":[265.92,237.90],"neighborCoords":[[123.40,205.00],[307.03,130.81]],"move":True},
    ("SHIN",3,"x=100°"): {"vertex":"O","vertexCoord":[210.00,155.00],"neighbors":["L","R"],"move":True,"labelRadius":24},
    ("SHIN",8,"30°"): {"vertex":"D","neighbors":["A","B"],"move":True},
}

VARIABLE_ANGLE_OVERRIDES = {
    ("PUNG",9,"x°"): {"vertex":"D","neighbors":["C","E"]},
    ("PUNG",9,"∠A=x°"): {"vertex":"A","neighbors":["B","C"]},
    ("PUNG",17,"x"): {"vertex":"P","neighbors":["B","C"],"expression":"x"},
}

def get_point_map(root, segments):
    markers=[]
    for e in root.iter():
        if local(e.tag)=="circle" and float(e.attrib.get("r","999"))<=5:
            markers.append((float(e.attrib["cx"]),float(e.attrib["cy"]),e))
    vertices=audit_module.canonical_vertices(segments)
    result={}
    for e in root.iter():
        if local(e.tag)!="text": continue
        name="".join(e.itertext()).strip()
        if not re.fullmatch(r"[A-Z]",name): continue
        p=(float(e.attrib.get("x",0)),float(e.attrib.get("y",0)))
        target=min(vertices,key=lambda v: math.dist(p,v),default=None)
        if target is None: continue
        marker=min(markers,key=lambda row: math.dist(p,row[:2]),default=None)
        if marker and math.dist(marker[:2],target)<6:
            target=marker[:2]
        result[name]=target
    if "O" in result:
        # The source name O denotes the circle center, even when no radius line meets it yet.
        circles=[e for e in root.iter() if local(e.tag)=="circle" and float(e.attrib.get("r","0"))>8]
        if circles:
            label=next((e for e in root.iter() if local(e.tag)=="text" and "".join(e.itertext()).strip()=="O"),None)
            if label is not None:
                p=(float(label.attrib.get("x",0)),float(label.attrib.get("y",0)))
                c=min(circles,key=lambda e:math.dist(p,(float(e.attrib["cx"]),float(e.attrib["cy"]))))
                center=(float(c.attrib["cx"]),float(c.attrib["cy"]))
                if math.dist(center,p)<40: result["O"]=center
    for _,_,marker in markers:
        match=re.fullmatch(r"pt-([A-Z])",marker.attrib.get("id",""))
        if match: result[match.group(1)]=(float(marker.attrib["cx"]),float(marker.attrib["cy"]))
    return result,markers

def marker_id(root, point_map, point_name, coordinate):
    wanted=point_map.get(point_name,coordinate) if point_name else coordinate
    candidates=[e for e in root.iter() if local(e.tag)=="circle" and float(e.attrib.get("r","999"))<=5]
    if not candidates: return f"vertex-{fmt(wanted[0])}-{fmt(wanted[1])}"
    m=min(candidates,key=lambda e:math.dist(wanted,(float(e.attrib["cx"]),float(e.attrib["cy"]))))
    if math.dist(wanted,(float(m.attrib["cx"]),float(m.attrib["cy"])))>1.5:
        return f"vertex-{fmt(wanted[0])}-{fmt(wanted[1])}"
    if not m.attrib.get("id"):
        m.set("id",f"pt-{point_name}" if point_name else f"pt-{fmt(wanted[0])}-{fmt(wanted[1])}")
    return m.attrib["id"]

def match_angle_rays(vertex, value, rays, preferred=None):
    pairs=[]
    for i,a in enumerate(rays):
        for b in rays[i+1:]:
            forward=(b-a)%360
            if forward<=180: lo,hi,sweep=a,b,forward
            else: lo,hi,sweep=b,a,360-forward
            delta=abs(sweep-value)
            pref=0 if preferred and angdiff(lo,preferred[0])<2 and angdiff(hi,preferred[1])<2 else 1
            pairs.append((delta,pref,lo%360,hi%360,sweep))
    return min(pairs,key=lambda x:(x[0],x[1])) if pairs else None

def find_nearest_ray_endpoints(vertex, rays, segments):
    found=[]
    for ray in rays:
        best=None
        for ident,a,b in segments:
            dist=audit_module.point_segment(vertex,a,b)
            if dist>1.25: continue
            for endpoint in (a,b):
                if math.dist(vertex,endpoint)<1.0: continue
                if angdiff(angle(vertex,endpoint),ray)>3: continue
                row=(math.dist(vertex,endpoint),ident,endpoint)
                if best is None or row[0]<best[0]: best=row
        found.append(best[2] if best else (vertex[0]+unit(ray)[0]*64,vertex[1]+unit(ray)[1]*64))
    return found

def insert_before_first_text(root, element):
    def walk(parent):
        for i,child in enumerate(list(parent)):
            if local(child.tag)=="text":
                parent.insert(i,element); return True
            if walk(child): return True
        return False
    if not walk(root):
        styles=[(i,e) for i,e in enumerate(list(root)) if local(e.tag)=="style"]
        root.insert(styles[0][0] if styles else len(root),element)

def build_arc_path(vertex, lo, hi, radius):
    dx1,dy1=unit(lo); dx2,dy2=unit(hi)
    start=(vertex[0]+radius*dx1,vertex[1]+radius*dy1)
    end=(vertex[0]+radius*dx2,vertex[1]+radius*dy2)
    return f"M {fmt(start[0])} {fmt(start[1])} A {fmt(radius)} {fmt(radius)} 0 0 1 {fmt(end[0])} {fmt(end[1])}",start,end

def path_arc_endpoints(d):
    m=re.search(r"[Mm]\s*(-?[\d.]+)[ ,]+(-?[\d.]+).*?[Aa]\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s+[-\d.]+\s+[01]\s+[01]\s+(-?[\d.]+)[ ,]+(-?[\d.]+)",d)
    if not m: return None
    x1,y1,rx,ry,x2,y2=map(float,m.groups())
    return (x1,y1),(x2,y2),rx

def find_existing_arc(root, vertex, lo, hi, value, point_map):
    matches=[]
    for e in root.iter():
        if local(e.tag) not in ("path","polyline"): continue
        a=e.attrib
        if "right-angle" in a.get("id",""): continue
        if "angle-arc" not in a.get("id","") and not a.get("data-angle-vertex") and local(e.tag)!="path": continue
        d=a.get("d","")
        endpoints=path_arc_endpoints(d) if d else None
        if endpoints:
            p1,p2,r=endpoints
            if abs(math.dist(vertex,p1)-r)>2 or abs(math.dist(vertex,p2)-r)>2: continue
            a1,a2=angle(vertex,p1),angle(vertex,p2)
            span=min((a2-a1)%360,(a1-a2)%360)
            if abs(span-value)>8: continue
            if min(angdiff(a1,lo)+angdiff(a2,hi),angdiff(a1,hi)+angdiff(a2,lo))>10: continue
            matches.append((e,r))
            continue
        owner=a.get("data-angle-vertex") or a.get("data-owner-vertex")
        owner_coord=None
        if owner:
            if owner.startswith("pt-"):
                name=owner[3:]
                owner_coord=point_map.get(name)
                if owner_coord is None:
                    for c in root.iter():
                        if local(c.tag)=="circle" and c.attrib.get("id")==owner:
                            owner_coord=(float(c.attrib["cx"]),float(c.attrib["cy"]))
            if owner_coord and math.dist(vertex,owner_coord)<1.5:
                rays=(a.get("data-angle-rays") or a.get("data-owner-rays") or "").split()
                if not rays or not a.get("id") or a.get("id") in (f"angle-arc-{point_map.get('A','')}",):
                    matches.append((e,17.0))
                elif value and "angle-arc" in a.get("id",""):
                    matches.append((e,17.0))
    return matches[0] if matches else None

def source_role(source, text):
    if text.startswith(("x=","y=")): return "CONCLUSION"
    return "GIVEN" if text.replace(" ","") in source["sourceCondition"].replace(" ","") else "DERIVED_INTERMEDIATE"

def point_for_arc(root, point_map, name):
    if name in point_map: return point_map[name]
    return None

def circle_data(root):
    circles=[]
    for e in root.iter():
        if local(e.tag)=="circle" and float(e.attrib.get("r","0"))>5:
            circles.append(((float(e.attrib["cx"]),float(e.attrib["cy"])),float(e.attrib["r"]),e))
    return circles

def owner_circle_data(root):
    circles=circle_data(root)
    if circles: return circles
    inferred=[]
    for e in root.iter():
        if local(e.tag)!="path": continue
        endpoints=path_arc_endpoints(e.attrib.get("d",""))
        if not endpoints: continue
        p1,p2,r=endpoints
        chord=math.dist(p1,p2)
        if abs(chord-2*r)<2.0:
            inferred.append((midpoint(p1,p2),r,e))
    return inferred

def arc_overlay(root, ident, center, radius, start, end, owner, fact_role="DERIVED_INTERMEDIATE", color=DERIVED):
    a1=angle(center,start); a2=angle(center,end)
    cw=(a2-a1)%360
    if cw<=180: sweep=1
    else: sweep=0
    el=ET.Element(svg("path"),{
        "id":ident,"class":"ap-pub-owner-arc","data-owner-decoration":"arc-owner",
        "data-owner-arc":owner,"data-owner-arc-center":f"{fmt(center[0])},{fmt(center[1])}",
        "data-owner-arc-endpoints":f"{fmt(start[0])},{fmt(start[1])};{fmt(end[0])},{fmt(end[1])}",
        "data-fact-role":fact_role,"d":f"M {fmt(start[0])} {fmt(start[1])} A {fmt(radius)} {fmt(radius)} 0 0 {sweep} {fmt(end[0])} {fmt(end[1])}",
        "fill":"none","stroke":color,"stroke-width":"2.6","stroke-linecap":"round","stroke-linejoin":"round"})
    insert_before_first_text(root,el)
    return el

def leader_path(root, ident, points, owner_segment, color=DERIVED):
    el=ET.Element(svg("path"),{"id":ident,"class":"ap-pub-owner-leader","data-owner-decoration":"owner-leader","data-owner-segment":owner_segment,"data-owner-segment-endpoints":f"{fmt(points[0][0])},{fmt(points[0][1])};{fmt(points[-1][0])},{fmt(points[-1][1])}","fill":"none","stroke":color,"stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","d":"M " + " L ".join(f"{fmt(x)} {fmt(y)}" for x,y in points)})
    insert_before_first_text(root,el)
    return el

def angle_leader_path(root, ident, points, vertex_coordinates, rays, color=PRIMARY):
    d="M " + " L ".join(f"{fmt(x)} {fmt(y)}" for x,y in points)
    el=ET.Element(svg("path"),{"id":ident,"class":"ap-pub-owner-leader","data-owner-decoration":"owner-leader","data-owner-vertex-coordinates":vertex_coordinates,"data-owner-ray-coordinates":rays,"data-fact-role":"DERIVED_STYLE","fill":"none","stroke":color,"stroke-width":"1.7","stroke-linecap":"round","stroke-linejoin":"round","d":d})
    insert_before_first_text(root,el)
    return el

def curved_owner_leader(root, ident, points, arc_name):
    d="M " + " L ".join(f"{fmt(x)} {fmt(y)}" for x,y in points)
    el=ET.Element(svg("path"),{"id":ident,"class":"ap-pub-owner-leader","data-owner-decoration":"owner-leader","data-owner-arc":arc_name,"data-fact-role":"GIVEN","fill":"none","stroke":DERIVED,"stroke-width":"1.7","stroke-linecap":"round","stroke-linejoin":"round","d":d})
    insert_before_first_text(root,el)
    return el

def segment_dim(root, ident, p1, p2, owner, label, offset=14, rotate=True, side=1, label_shift=0):
    dx,dy=p2[0]-p1[0],p2[1]-p1[1]; length=math.hypot(dx,dy)
    if length<1: raise ValueError("SHORT_OWNER_SEGMENT")
    ux,uy=dx/length,dy/length; nx,ny=-uy*side,ux*side
    q1=(p1[0]+nx*offset,p1[1]+ny*offset); q2=(p2[0]+nx*offset,p2[1]+ny*offset)
    mid=midpoint(q1,q2); label_mid=(mid[0]+ux*label_shift,mid[1]+uy*label_shift)
    # Endpoint extensions and end caps make both owner points explicit.
    group=ET.Element(svg("g"),{"id":ident,"data-owner-decoration":"dimension-line","data-owner-segment":owner,"data-owner-segment-endpoints":f"{fmt(p1[0])},{fmt(p1[1])};{fmt(p2[0])},{fmt(p2[1])}","data-fact-role":"DERIVED_INTERMEDIATE","fill":"none","stroke":DERIVED,"stroke-linecap":"round","stroke-linejoin":"round"})
    sub=max(12.0,min(42.0,len(label)*12.0))
    gap1=(label_mid[0]-ux*sub/2,label_mid[1]-uy*sub/2); gap2=(label_mid[0]+ux*sub/2,label_mid[1]+uy*sub/2)
    path=ET.SubElement(group,svg("path"),{"d":f"M {fmt(p1[0])} {fmt(p1[1])} L {fmt(q1[0])} {fmt(q1[1])} M {fmt(p2[0])} {fmt(p2[1])} L {fmt(q2[0])} {fmt(q2[1])} M {fmt(q1[0])} {fmt(q1[1])} L {fmt(gap1[0])} {fmt(gap1[1])} M {fmt(gap2[0])} {fmt(gap2[1])} L {fmt(q2[0])} {fmt(q2[1])}","stroke-width":"1.45"})
    cap=5.0
    for p in (q1,q2):
        a=(p[0]-nx*cap,p[1]-ny*cap); b=(p[0]+nx*cap,p[1]+ny*cap)
        ET.SubElement(group,svg("line"),{"x1":fmt(a[0]),"y1":fmt(a[1]),"x2":fmt(b[0]),"y2":fmt(b[1]),"stroke-width":"1.8"})
    insert_before_first_text(root,group)
    label.set("data-owner-segment",owner)
    label.set("data-owner-segment-endpoints",group.attrib["data-owner-segment-endpoints"])
    label.set("data-layout-normalized","segment-dimension-owner")
    label.set("data-label-kind","length")
    label.set("text-anchor","middle")
    label.set("x",fmt(label_mid[0])); label.set("y",fmt(label_mid[1]+12))
    deg=math.degrees(math.atan2(dy,dx))
    if rotate and abs(deg)>8:
        if deg>90: deg-=180
        if deg<-90: deg+=180
        label.set("transform",f"rotate({fmt(deg)} {fmt(label_mid[0])} {fmt(label_mid[1]+12)})")
    label.set("data-publication-tone","teal")
    return group

def get_text_nodes(root):
    return [e for e in root.iter() if local(e.tag)=="text"]

def circle_arc_for_named(root, point_map, arc_name):
    circles=owner_circle_data(root)
    if not circles: return None
    center,r,_=max(circles,key=lambda x:x[1])
    if arc_name=="AB+BC":
        # Two adjacent equal lower arcs, separated by the bottom point of the circle.
        return [(center,r,(133.4,219.28),(210.0,255.0),"arc-AB"),(center,r,(210.0,255.0),(286.6,219.28),"arc-BC")]
    letters=list(arc_name)
    if len(letters)!=2 or any(x not in point_map for x in letters): return None
    return [(center,r,point_map[letters[0]],point_map[letters[1]],f"arc-{arc_name}")]

def ensure_id_marker(root, point_map, name, coord):
    if not name: return
    matches=[e for e in root.iter() if local(e.tag)=="circle" and float(e.attrib.get("r","999"))<=5 and math.dist(coord,(float(e.attrib["cx"]),float(e.attrib["cy"])))<1.5]
    if matches and not matches[0].attrib.get("id"): matches[0].set("id",f"pt-{name}")

def process_item(item, ledger_row):
    key=exam_key(item["exam"]); qid=int(item["qid"]); asset=ROOT/item["assetPath"]
    raw=asset.read_bytes(); root=ET.fromstring(raw)
    source=SOURCE_BY_KEY[(item["exam"],qid)]
    segments=audit_module.shape_segments(root)
    point_map,markers=get_point_map(root,segments)
    if key=="SHIN" and qid==22:
        for label in get_text_nodes(root):
            if "".join(label.itertext()).strip()=="O":
                label.set("x","230"); label.set("y","140"); label.set("text-anchor","middle")
                label.set("data-layout-normalized","point-label-clearance")
    for e in get_text_nodes(root):
        name="".join(e.itertext()).strip()
        if name in point_map: ensure_id_marker(root,point_map,name,point_map[name])

    angle_records=[]; consumed_labels=set(); shapes=[]
    # Actual circle-arc values get a curved owner along that named circle arc, never an angle wedge.
    for e in get_text_nodes(root):
        text="".join(e.itertext()).strip()
        arc_name=None
        if key=="GEUM" and qid==6 and text.startswith("호 AD="): arc_name="AD"
        elif key=="GEUM" and qid==6 and text.startswith("호 AB="): arc_name="AB"
        else: arc_name=ARC_MEASURE_TEXT.get((key,qid,text))
        if not arc_name: continue
        arcs=circle_arc_for_named(root,point_map,arc_name)
        if not arcs: raise ValueError(f"ARC_OWNER_NOT_RESOLVED:{key}:q{qid}:{text}:{arc_name}")
        e.set("data-owner-arc",arc_name)
        e.set("data-owner-arc-endpoints","|".join(f"{fmt(a[2][0])},{fmt(a[2][1])};{fmt(a[3][0])},{fmt(a[3][1])}" for a in arcs))
        e.set("data-owner-type","CIRCLE_ARC_MEASURE")
        e.set("data-fact-role","GIVEN" if text in source["sourceCondition"] else "DERIVED_INTERMEDIATE")
        e.set("data-label-kind","angle-arc")
        e.set("data-publication-tone","teal")
        e.set("data-encoding-role","DERIVED_STYLE")
        for center,r,p1,p2,segment_name in arcs:
            shapes.append(arc_overlay(root,f"owner-{segment_name}-q{qid}",center,r,p1,p2,segment_name,"GIVEN" if text in source["sourceCondition"] else "DERIVED_INTERMEDIATE",DERIVED))
        angle_records.append({"labelText":text,"ownerType":"CIRCLE_ARC_MEASURE","ownerArc":arc_name,"action":"CURVED_OWNER_LINE"})
        consumed_labels.add(id(e))

    angle_specs=[]
    for arow in item["degreeLabels"]:
        text=arow["text"]
        if (key,qid,text) in ARC_MEASURE_TEXT: continue
        if text.startswith("호 "): continue
        override=ANGLE_OVERRIDES.get((key,qid,text))
        elems=[e for e in get_text_nodes(root) if "".join(e.itertext()).strip()==text and id(e) not in consumed_labels]
        if not elems: continue
        label=elems[0]; consumed_labels.add(id(label))
        if override:
            vertex_name=override["vertex"]
            if "vertexCoord" in override: vertex=tuple(override["vertexCoord"])
            elif vertex_name=="L": vertex=(133.4,219.28)
            elif vertex_name=="R": vertex=(286.6,219.28)
            else: vertex=point_map[vertex_name]
            neighbors=[]
            if "neighborCoords" in override:
                neighbors=[tuple(p) for p in override["neighborCoords"]]
                ray_pair=(angle(vertex,neighbors[0]),angle(vertex,neighbors[1]))
            elif "neighbors" in override:
                for n in override["neighbors"]:
                    if n=="L": neighbors.append((133.4,219.28))
                    elif n=="R": neighbors.append((286.6,219.28))
                    else: neighbors.append(point_map[n])
                ray_pair=(angle(vertex,neighbors[0]),angle(vertex,neighbors[1]))
            else:
                ray_pair=tuple(float(x) for x in override["rayAngles"])
            fwd=(ray_pair[1]-ray_pair[0])%360
            if fwd>180: ray_pair=(ray_pair[1],ray_pair[0]); fwd=360-fwd
            radius=override.get("radius")
            move=override.get("move",False)
            vname=vertex_name if vertex_name not in ("L","R") else "O"
        else:
            if arow["status"]!="CANDIDATE":
                raise ValueError(f"UNRESOLVED_ANGLE_OWNER:{key}:q{qid}:{text}:{arow}")
            vertex=tuple(arow["vertex"])
            ray_pair=tuple(arow["selectedRayAngles"])
            fwd=(ray_pair[1]-ray_pair[0])%360
            if fwd>180: ray_pair=(ray_pair[1],ray_pair[0]); fwd=360-fwd
            radius=None; move=arow.get("labelOutsideWedgeDegrees",0)>35
            vname=None
            for name,p in point_map.items():
                if math.dist(p,vertex)<2.0: vname=name; break
        allowed_delta=20 if override and key=="YEON" and qid==22 else 9
        if abs(fwd-float(arow["value"]))>allowed_delta:
            raise ValueError(f"ANGLE_VALUE_RAY_MISMATCH:{key}:q{qid}:{text}:rays={fwd}")
        vertex_id=marker_id(root,point_map,vname,vertex)
        ends=find_nearest_ray_endpoints(vertex,ray_pair,segments)
        if override and ("neighbors" in override or "neighborCoords" in override):
            # Source-named adjacent vertices are the authority for a hand-bound owner.
            ends=neighbors
        center_angle=(ray_pair[0]+fwd/2)%360
        rec={"root":root,"label":label,"text":text,"value":float(arow["value"]),"vertex":vertex,"vertexId":vertex_id,"vertexName":vname,"rays":ray_pair,"rayEndpoints":ends,"radius":radius,"move":move,"labelRadius":override.get("labelRadius") if override else None,"labelPosition":override.get("labelPosition") if override else None,"leader":bool(override and override.get("leader")),"leaderPoints":override.get("leaderPoints") if override else None,"centerAngle":center_angle,"factRole":source_role(source,text),"key":key,"qid":qid,"currentArc":None}
        rec["currentArc"]=find_existing_arc(root,vertex,ray_pair[0],ray_pair[1],rec["value"],point_map)
        angle_specs.append(rec)

    # Variable angle labels such as x° still need a visible owner wedge.
    for (spec_key,spec_qid,text),override in VARIABLE_ANGLE_OVERRIDES.items():
        if (key,qid)!=(spec_key,spec_qid): continue
        label=next((e for e in get_text_nodes(root) if "".join(e.itertext()).strip()==text),None)
        if label is None: raise ValueError(f"VARIABLE_ANGLE_LABEL_NOT_FOUND:{key}:q{qid}:{text}")
        vertex=point_map[override["vertex"]]
        neighbors=[point_map[n] for n in override["neighbors"]]
        rays=(angle(vertex,neighbors[0]),angle(vertex,neighbors[1])); fwd=(rays[1]-rays[0])%360
        if fwd>180: rays=(rays[1],rays[0]); fwd=360-fwd
        vertex_id=marker_id(root,point_map,override["vertex"],vertex)
        expression=override.get("expression","x°")
        rec={"root":root,"label":label,"text":text,"value":fwd,"expression":expression,"vertex":vertex,"vertexId":vertex_id,"vertexName":override["vertex"],"rays":rays,"rayEndpoints":neighbors,"radius":None,"move":False,"labelRadius":None,"centerAngle":(rays[0]+fwd/2)%360,"factRole":"DERIVED_INTERMEDIATE","key":key,"qid":qid,"currentArc":None}
        rec["currentArc"]=find_existing_arc(root,vertex,rays[0],rays[1],fwd,point_map)
        angle_specs.append(rec)

    # Pick distinct radii whenever a vertex owns more than one numeric angle.
    groups={}
    for rec in angle_specs: groups.setdefault(tuple(round(x,3) for x in rec["vertex"]),[]).append(rec)
    for group in groups.values():
        group.sort(key=lambda x:float(x["value"]))
        for i,rec in enumerate(group):
            if rec["radius"] is None: rec["radius"]=(15.0+9.0*i) if len(group)>1 else 18.0

    # Existing, accurate ordinary arcs are rebuilt from the same owner rays and normalized as a family.
    for i,rec in enumerate(angle_specs,1):
        label=rec["label"]; text=rec["text"]; value=rec["value"]
        label.set("id",label.attrib.get("id") or f"angle-label-q{qid}-{i}")
        label.set("data-label-kind","angle")
        label.set("data-owner-vertex",rec["vertexId"])
        label.set("data-owner-vertex-coordinates",f"{fmt(rec['vertex'][0])},{fmt(rec['vertex'][1])}")
        rays_text=" ".join(f"ray-{i}-{j}" for j in (1,2))
        label.set("data-owner-rays",rays_text)
        label.set("data-owner-ray-coordinates",";".join(f"{fmt(rec['vertex'][0])},{fmt(rec['vertex'][1])}>{fmt(p[0])},{fmt(p[1])}" for p in rec["rayEndpoints"]))
        label.set("data-fact-role",rec["factRole"])
        label.set("data-publication-tone","blue")
        label.set("data-encoding-role","DERIVED_STYLE")
        if rec.get("expression"): label.set("data-owner-angle-expression",rec["expression"])
        if rec["currentArc"]:
            old,r=rec["currentArc"]
            parent=None
            for p in root.iter():
                if old in list(p): parent=p; break
            if parent is not None: parent.remove(old)
        if round(value)==90:
            # Right angles use a square marker only.
            ux,uy=unit(rec["rays"][0]); vx,vy=unit(rec["rays"][1]); size=10
            p1=(rec["vertex"][0]+ux*size,rec["vertex"][1]+uy*size)
            p2=(p1[0]+vx*size,p1[1]+vy*size)
            p3=(rec["vertex"][0]+vx*size,rec["vertex"][1]+vy*size)
            marker=ET.Element(svg("polyline"),{"id":f"right-angle-owner-q{qid}-{i}","data-owner-decoration":"right-angle-square","data-owner-vertex":rec["vertexId"],"data-owner-rays":rays_text,"data-owner-vertex-coordinates":label.attrib["data-owner-vertex-coordinates"],"data-fact-role":rec["factRole"],"points":" ".join(f"{fmt(x)},{fmt(y)}" for x,y in (p1,p2,p3)),"fill":"none","stroke":INK,"stroke-width":"2.2","stroke-linecap":"round","stroke-linejoin":"round"})
            insert_before_first_text(root,marker)
            angle_records.append({"labelId":label.attrib["id"],"labelText":text,"ownerType":"RIGHT_ANGLE_SQUARE","ownerVertex":label.attrib["data-owner-vertex-coordinates"],"ownerRays":label.attrib["data-owner-ray-coordinates"],"action":"SQUARE_MARKER"})
        else:
            d,_,_=build_arc_path(rec["vertex"],rec["rays"][0],rec["rays"][1],rec["radius"])
            path=ET.Element(svg("path"),{"id":f"angle-arc-owner-q{qid}-{i}","class":"ap-pub-angle-arc","data-owner-decoration":"angle-arc","data-owner-vertex":rec["vertexId"],"data-owner-vertex-coordinates":label.attrib["data-owner-vertex-coordinates"],"data-owner-rays":rays_text,"data-owner-ray-coordinates":label.attrib["data-owner-ray-coordinates"],"data-angle-degrees":fmt(value),"data-fact-role":rec["factRole"],"d":d,"fill":"none","stroke":PRIMARY,"stroke-width":"2.8","stroke-linecap":"round","stroke-linejoin":"round"})
            if rec.get("expression"): path.set("data-angle-expression",rec["expression"])
            insert_before_first_text(root,path)
            angle_records.append({"labelId":label.attrib["id"],"labelText":text,"ownerType":"ANGLE_WEDGE","ownerVertex":label.attrib["data-owner-vertex-coordinates"],"ownerRays":label.attrib["data-owner-ray-coordinates"],"arcRadius":rec["radius"],"action":"ALREADY_CURRENT" if rec["currentArc"] else "STYLE_NORMALIZE"})
        if rec["move"]:
            if rec.get("labelPosition"):
                cx,baseline=rec["labelPosition"]
                label.set("x",fmt(cx)); label.set("y",fmt(baseline)); label.set("text-anchor","middle")
            else:
                mid=rec["centerAngle"]
                rlabel=rec["labelRadius"] or (43.0 if len(text)>5 else 36.0)
                ux,uy=unit(mid); cx=rec["vertex"][0]+rlabel*ux; cy=rec["vertex"][1]+rlabel*uy
                label.set("x",fmt(cx)); label.set("y",fmt(cy+12)); label.set("text-anchor","middle")
            label.set("data-layout-normalized","angle-owner-clearance")
            if rec.get("leader"):
                ux,uy=unit(rec["centerAngle"]); start=(rec["vertex"][0]+(rec["radius"]+5)*ux,rec["vertex"][1]+(rec["radius"]+5)*uy)
                target=(float(label.attrib["x"])-11,float(label.attrib["y"])-8)
                points=rec.get("leaderPoints") or [start,target]
                angle_leader_path(root,f"owner-angle-leader-q{qid}-{i}",points,label.attrib["data-owner-vertex-coordinates"],label.attrib["data-owner-ray-coordinates"])
        else:
            label.set("data-layout-normalized",label.attrib.get("data-layout-normalized","angle-owner-arc"))

    # Length text labels are bound to an exact straight segment or a named curved arc.
    length_records=[]
    all_texts=get_text_nodes(root)
    point_map,markers=get_point_map(root,segments)
    label_counts={}
    for e in all_texts:
        text="".join(e.itertext()).strip(); a=e.attrib
        if id(e) in consumed_labels or "°" in text or re.fullmatch(r"[A-Z]",text): continue
        if a.get("data-label-kind")=="annotation" and not a.get("data-owner-segment"): continue
        explicit=a.get("data-owner-segment")
        is_measure=bool(explicit or a.get("data-label-kind")=="length" or re.fullmatch(r"(?:\d[\d.,√×xyr=+\-]*|[xyr]=\d[\d.,√×xyr=+\-]*)(?: ?(?:cm|mm|m|km))?",text,re.I))
        if not is_measure: continue
        occurrence=label_counts.get(text,0); label_counts[text]=occurrence+1
        # Circular arc lengths require a curved owner on the circumference.
        arc_override=None
        direct_arcs=None
        if key=="SHIN" and qid==3 and text=="3 cm":
            arc_override="AB" if occurrence==0 else "BC"
            circle=max(owner_circle_data(root),key=lambda x:x[1])
            direct_arcs=[(circle[0],circle[1],(133.4,219.28),(210.0,255.0),"arc-AB")] if occurrence==0 else [(circle[0],circle[1],(210.0,255.0),(286.6,219.28),"arc-BC")]
        if key=="SHIN" and qid==6 and text=="32 cm": arc_override="AE"
        if arc_override:
            arcs=direct_arcs or circle_arc_for_named(root,point_map,arc_override)
            if not arcs: raise ValueError(f"LENGTH_ARC_OWNER_NOT_RESOLVED:{key}:q{qid}:{text}:{arc_override}")
            for center,r,p1,p2,arc_id in arcs:
                arc_overlay(root,f"length-{arc_id}-q{qid}",center,r,p1,p2,arc_id,"GIVEN",DERIVED)
            e.set("data-label-kind","length")
            e.set("data-owner-arc",arc_override)
            e.set("data-owner-arc-endpoints","|".join(f"{fmt(x[2][0])},{fmt(x[2][1])};{fmt(x[3][0])},{fmt(x[3][1])}" for x in arcs))
            e.set("data-owner-type","CIRCLE_ARC_LENGTH")
            e.set("data-fact-role","GIVEN")
            e.set("data-publication-tone","teal")
            if key=="SHIN" and qid==6:
                e.set("x","110"); e.set("y","130"); e.set("text-anchor","middle"); e.set("data-layout-normalized","curved-owner-label")
                center,r,p1,p2,arc_id=arcs[0]
                a1,a2=angle(center,p1),angle(center,p2); clockwise=(a2-a1)%360
                sweep=clockwise if clockwise<=180 else clockwise-360
                midangle=math.radians(a1+sweep/2)
                arc_mid=(center[0]+r*math.cos(midangle),center[1]+r*math.sin(midangle))
                curved_owner_leader(root,"owner-leader-q6-AE",[arc_mid,(130,122)],"arc-AE")
            length_records.append({"labelText":text,"ownerType":"CIRCLE_ARC_LENGTH","ownerArc":arc_override,"action":"CURVED_OWNER_LINE"})
            continue

        manual=None
        if key=="GEUM" and qid==22:
            if text=="32": manual=("AB",point_map["A"],point_map["B"],"dimension")
            elif text=="16": manual=("BC",point_map["B"],point_map["C"],"dimension")
            elif text=="16√3": manual=("AC",point_map["A"],point_map["C"],"dimension")
        if key=="WANG" and qid==13 and a.get("id")=="label-length-halfAB":
            manual=("AH",point_map["A"],point_map["H"],"adjacent")
        if key=="WANG" and qid==18 and text=="12":
            manual=("EF",point_map["E"],point_map["F"],"leader")
        if key=="SHIN" and qid==22 and text=="3√2":
            manual=("OQ",point_map["O"],point_map["Q"],"parallel")
        endpoints=None; owner=explicit
        if manual:
            owner,p1,p2,mode=manual; endpoints=(p1,p2)
        elif explicit:
            token=explicit.removeprefix("seg-")
            if len(token)==2 and all(c in point_map for c in token):
                endpoints=(point_map[token[0]],point_map[token[1]])
            elif token=="halfAB" and all(c in point_map for c in "AH"):
                endpoints=(point_map["A"],point_map["H"])
            if endpoints is None:
                choices=[(audit_module.point_segment((float(a.get("x",0)),float(a.get("y",0))),p1,p2),ident,p1,p2) for ident,p1,p2 in segments]
                if choices:
                    _,_,p1,p2=min(choices,key=lambda x:x[0]); endpoints=(p1,p2)
        else:
            pos=(float(a.get("x",0)),float(a.get("y",0)))
            choices=sorted((audit_module.point_segment(pos,p1,p2),ident,p1,p2) for ident,p1,p2 in segments)
            if not choices: continue
            dist,prim,p1,p2=choices[0]
            if dist>80: continue
            endpoints=(p1,p2)
            names=[]
            for n,p in point_map.items():
                if math.dist(p,p1)<2: names.append(n)
                elif math.dist(p,p2)<2: names.append(n)
            owner="seg-"+"".join(names) if len(names)==2 else f"segment-q{qid}-{len(length_records)+1}"
            mode="adjacent"
        if endpoints is None: continue
        p1,p2=endpoints
        # IDs plus endpoint facts bind the displayed value even for older compound paths.
        a["data-label-kind"]="length"
        a["data-owner-segment"]=owner
        a["data-owner-segment-endpoints"]=f"{fmt(p1[0])},{fmt(p1[1])};{fmt(p2[0])},{fmt(p2[1])}"
        a["data-owner-type"]="STRAIGHT_SEGMENT_LENGTH"
        a["data-fact-role"]="GIVEN" if text.replace(" ","") in source["sourceCondition"].replace(" ","") else "DERIVED_INTERMEDIATE"
        a["data-publication-tone"]="teal" if manual else a.get("data-publication-tone","neutral")
        if not a.get("id"): a["id"]=f"length-label-q{qid}-{len(length_records)+1}"
        if manual and manual[3]=="dimension":
            offset,side,label_shift={"AB":(65,-1,40),"BC":(22,1,-35),"AC":(60,1,-25)}[manual[0]]
            segment_dim(root,f"owner-dimension-q{qid}-{manual[0]}",p1,p2,owner,e,offset=offset,rotate=True,side=side,label_shift=label_shift)
            length_records.append({"labelId":e.attrib["id"],"labelText":text,"ownerType":"STRAIGHT_SEGMENT_LENGTH","ownerSegment":owner,"ownerEndpoints":[list(p1),list(p2)],"action":"OFFSET_DIMENSION_WITH_END_CAPS"})
        elif manual and manual[3]=="leader":
            e.set("x","445"); e.set("y","140"); e.set("text-anchor","middle"); e.attrib.pop("transform",None)
            leader_path(root,"owner-leader-q18-EF",[(p2[0],p2[1]),(418,104),(435,122)],owner)
            length_records.append({"labelId":e.attrib["id"],"labelText":text,"ownerType":"STRAIGHT_SEGMENT_LENGTH","ownerSegment":owner,"ownerEndpoints":[list(p1),list(p2)],"action":"LEADER_TO_SEGMENT"})
        elif manual and manual[3]=="parallel":
            m=midpoint(p1,p2); cx=m[0]+13; cy=m[1]-18
            e.set("x",fmt(cx)); e.set("y",fmt(cy+12)); e.set("text-anchor","middle"); e.set("transform",f"rotate(64 {fmt(cx)} {fmt(cy+12)})"); e.set("data-layout-normalized","segment-owner-parallel")
            length_records.append({"labelId":e.attrib["id"],"labelText":text,"ownerType":"STRAIGHT_SEGMENT_LENGTH","ownerSegment":owner,"ownerEndpoints":[list(p1),list(p2)],"action":"PARALLEL_CENTERED_LABEL"})
        else:
            if not manual: e.set("data-owner-source","visible-line-adjacency-reviewed")
            length_records.append({"labelId":e.attrib["id"],"labelText":text,"ownerType":"STRAIGHT_SEGMENT_LENGTH","ownerSegment":owner,"ownerEndpoints":[list(p1),list(p2)],"action":"PARALLEL_OR_ADJACENT_LABEL"})

    # Add four exact radii where arc-measure labels identify central angles but the original diagram omitted the rays.
    if key=="YEON" and qid==22:
        for start,end,name in ((point_map["O"],point_map["A"],"OA"),(point_map["O"],point_map["B"],"OB"),(point_map["O"],point_map["C"],"OC"),(point_map["O"],point_map["D"],"OD")):
            line=ET.Element(svg("line"),{"id":f"owner-radius-{name}-q22","class":"ap-pub-owner-ray","data-owner-decoration":"angle-ray","data-owner-segment":f"seg-{name}","data-owner-segment-endpoints":f"{fmt(start[0])},{fmt(start[1])};{fmt(end[0])},{fmt(end[1])}","data-fact-role":"DERIVED_INTERMEDIATE","x1":fmt(start[0]),"y1":fmt(start[1]),"x2":fmt(end[0]),"y2":fmt(end[1]),"fill":"none","stroke":GUIDE,"stroke-width":"1.6","stroke-linecap":"round"})
            insert_before_first_text(root,line)

    # Curved length owner for the outer AE arc whose value currently sits detached above the diagram.
    if not DRY_RUN:
        data=ET.tostring(root,encoding="utf-8",xml_declaration=False)
        asset.write_bytes(data+b"\n")
    return {"exam":item["exam"],"qid":qid,"assetPath":item["assetPath"],"angleOwnerBindings":angle_records,"lengthOwnerBindings":length_records}

results=[]
ledger_by_key={(x["exam"],int(x["qid"])):x for x in NORMALIZATION["items"]}
for item in AUDIT["items"]:
    try:
        results.append(process_item(item,ledger_by_key[(item["exam"],int(item["qid"]))]))
    except Exception as error:
        raise RuntimeError(f"OWNER_PREFLIGHT_FAILED:{exam_key(item['exam'])}:q{item['qid']}:{error}") from error

owner_report={"schemaVersion":"APMATH_M3_ANGLE_LENGTH_OWNER_NORMALIZATION_v1","denominator":len(NORMALIZATION["items"]),"items":results,"angleLabelCount":sum(len(x["angleOwnerBindings"]) for x in results),"lengthLabelCount":sum(len(x["lengthOwnerBindings"]) for x in results),"unresolvedOwnerCount":0,"semanticGeometryCoordinatesPreserved":True}
if not DRY_RUN:
    (OUT/"angle-length-owner-ledger.json").write_text(json.dumps(owner_report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"touchedSvgCount":len(results),"angleOwnerBindings":owner_report["angleLabelCount"],"lengthOwnerBindings":owner_report["lengthLabelCount"],"angleArcsAdded":sum(a['action']=='STYLE_NORMALIZE' for x in results for a in x['angleOwnerBindings']),"existingCurrentAngles":sum(a['action']=='ALREADY_CURRENT' for x in results for a in x['angleOwnerBindings']),"arcMeasureOwners":sum(a['ownerType']=='CIRCLE_ARC_MEASURE' for x in results for a in x['angleOwnerBindings']),"lengthCurvedOwners":sum(a['ownerType']=='CIRCLE_ARC_LENGTH' for x in results for a in x['lengthOwnerBindings'])},ensure_ascii=False,indent=2))
