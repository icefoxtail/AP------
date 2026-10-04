from pathlib import Path
import json
import math
import re
import xml.etree.ElementTree as ET

ROOT = Path.cwd()
OUT = ROOT / "docs/evidence/2025-m3-visual-publishing-normalize-a"
ledger = json.loads((OUT / "normalization-ledger.json").read_text(encoding="utf-8"))

def local(tag):
    return tag.split("}")[-1]

def num(value):
    return float(value)

def path_segments(d):
    if re.search(r"[AaCcQqSsTt]", d):
        return []
    tokens = re.findall(r"[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?", d)
    out, i, cmd, current, start = [], 0, None, (0.0, 0.0), None
    while i < len(tokens):
        if tokens[i].isalpha():
            cmd = tokens[i]
            i += 1
            if cmd.upper() == "Z":
                if start and math.dist(current, start) > 1e-6:
                    out.append((current, start))
                current = start or current
                continue
        if cmd is None:
            break
        upper = cmd.upper()
        relative = cmd.islower()
        if upper == "M" or upper == "L":
            if i + 1 >= len(tokens) or tokens[i].isalpha():
                break
            x, y = float(tokens[i]), float(tokens[i + 1])
            i += 2
            if relative:
                x += current[0]; y += current[1]
            nxt = (x, y)
            if upper == "M":
                current = nxt
                start = nxt
                cmd = "l" if relative else "L"
            else:
                if math.dist(current, nxt) > 1e-6:
                    out.append((current, nxt))
                current = nxt
        elif upper in ("H", "V"):
            if i >= len(tokens) or tokens[i].isalpha():
                break
            value = float(tokens[i]); i += 1
            if upper == "H":
                x = current[0] + value if relative else value
                nxt = (x, current[1])
            else:
                y = current[1] + value if relative else value
                nxt = (current[0], y)
            if math.dist(current, nxt) > 1e-6:
                out.append((current, nxt))
            current = nxt
        else:
            break
    return out

def shape_segments(root):
    rows = []
    for el in root.iter():
        tag, a = local(el.tag), el.attrib
        ident = a.get("id") or tag
        if any(token in ident for token in ("angle-arc", "right-angle", "dimension-owner", "owner-mark")):
            continue
        if tag == "line":
            try: rows.append((ident, (num(a["x1"]), num(a["y1"])), (num(a["x2"]), num(a["y2"]))))
            except (KeyError, ValueError): pass
        elif tag in ("polyline", "polygon"):
            values = [float(x) for x in re.findall(r"[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?", a.get("points", ""))]
            pts = list(zip(values[::2], values[1::2]))
            for p, q in zip(pts, pts[1:]): rows.append((ident, p, q))
            if tag == "polygon" and len(pts) > 2: rows.append((ident, pts[-1], pts[0]))
        elif tag == "path" and "d" in a:
            for p, q in path_segments(a["d"]): rows.append((ident, p, q))
    return rows

def point_segment(p, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    den = dx*dx+dy*dy
    if den == 0: return math.dist(p, a)
    t = max(0.0, min(1.0, ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den))
    return math.dist(p, (a[0]+t*dx, a[1]+t*dy))

def intersection(a, b, c, d):
    ax, ay = a; bx, by = b; cx, cy = c; dx, dy = d
    den = (ax-bx)*(cy-dy)-(ay-by)*(cx-dx)
    if abs(den) < 1e-9: return None
    det1, det2 = ax*by-ay*bx, cx*dy-cy*dx
    x = (det1*(cx-dx)-(ax-bx)*det2)/den
    y = (det1*(cy-dy)-(ay-by)*det2)/den
    if point_segment((x,y),a,b) < 1e-5 and point_segment((x,y),c,d) < 1e-5:
        return (x,y)
    return None

def canonical_vertices(segments):
    points = [p for _, a, b in segments for p in (a,b)]
    for i, (_, a, b) in enumerate(segments):
        for _, c, d in segments[i+1:]:
            p = intersection(a,b,c,d)
            if p is not None: points.append(p)
    unique = []
    for p in points:
        if not any(math.dist(p,q) < 0.75 for q in unique): unique.append(p)
    return unique

def rays_at(vertex, segments):
    values = []
    for _, a, b in segments:
        if point_segment(vertex,a,b) > 0.75: continue
        for endpoint in (a,b):
            dx,dy=endpoint[0]-vertex[0],endpoint[1]-vertex[1]
            if math.hypot(dx,dy) < 0.75: continue
            angle=math.degrees(math.atan2(dy,dx))%360
            if not any(abs((angle-old+180)%360-180)<2 for old in values): values.append(angle)
    return sorted(values)

def degree_value(text):
    if "°" not in text or "호" in text or re.search(r"[+−=]", text.replace("=", "", 1)):
        return None
    if re.search(r"(?:arc|호)\s*[A-Z]{2}", text, re.I): return None
    match = re.search(r"(?:^|=)\s*(\d+(?:\.\d+)?)\s*°", text)
    return float(match.group(1)) if match else None

def angular_diff(a,b): return abs((a-b+180)%360-180)

def inspect_asset(row):
    root = ET.parse(ROOT / row["assetPath"]).getroot()
    segments = shape_segments(root)
    vertices = canonical_vertices(segments)
    texts=[]
    point_ids={}
    for el in root.iter():
        if local(el.tag)=="circle" and el.attrib.get("id") and float(el.attrib.get("r", "99")) <= 5:
            point_ids[el.attrib["id"]]=(float(el.attrib["cx"]),float(el.attrib["cy"]))
    for el in root.iter():
        if local(el.tag)!="text": continue
        text="".join(el.itertext()).strip(); value=degree_value(text)
        if value is None: continue
        a=el.attrib; anchor=(float(a.get("x",0)),float(a.get("y",0)))
        explicit=a.get("data-owner-vertex")
        owner=point_ids.get(explicit)
        if owner is None and explicit:
            # Older owner values can directly encode an SVG point label rather than a marker ID.
            owner=point_ids.get("pt-"+explicit.removeprefix("pt-"))
        options=[]
        for vertex in vertices:
            rays=rays_at(vertex,segments)
            if len(rays)<2: continue
            distance=math.dist(anchor,vertex)
            if owner is not None: distance += 1000*math.dist(owner,vertex)
            direction=math.degrees(math.atan2(anchor[1]-16-vertex[1],anchor[0]-vertex[0]))%360
            for i,first in enumerate(rays):
                for second in rays[i+1:]:
                    forward=(second-first)%360
                    if forward<=180:
                        lo,hi,sweep=first,second,forward
                    else:
                        lo,hi,sweep=second,first,360-forward
                    mid=(lo+sweep/2)%360
                    delta=abs(sweep-value)
                    direction_delta=angular_diff(direction,mid)
                    outside=max(0.0,direction_delta-sweep/2-18)
                    score=delta*5+outside*0.8+direction_delta*0.1+distance*0.35
                    options.append((score,distance,vertex,rays,lo%360,hi%360,sweep,delta,direction_delta))
        if not options: texts.append({"text":text,"value":value,"id":a.get("id"),"status":"NO_RAY_VERTEX"}); continue
        option=min(options,key=lambda x:x[0])
        _,distance,vertex,rays,lo,hi,sweep,delta,direction_delta=option
        outside=max(0.0,direction_delta-sweep/2-18)
        texts.append({"text":text,"value":value,"id":a.get("id"),"ownerVertex":a.get("data-owner-vertex"),"explicitRays":a.get("data-owner-rays"),"anchor":list(anchor),"vertex":list(vertex),"vertexDistance":round(distance,2),"rayAngles":rays,"selectedRayAngles":[round(lo,2),round(hi,2)],"wedgeDegrees":round(sweep,2),"angleValueDelta":round(delta,2),"labelToWedgeCenterDelta":round(direction_delta,2),"labelOutsideWedgeDegrees":round(outside,2),"status":"CANDIDATE" if delta<=8 and distance<130 and outside<=35 else "REVIEW_REQUIRED"})
    existing_arcs=[]
    for el in root.iter():
        a=el.attrib; tag=local(el.tag)
        if tag in ("path","polyline") and ("angle-arc" in a.get("id","") or a.get("data-angle-vertex") or a.get("data-owner-vertex")):
            existing_arcs.append({"id":a.get("id"),"ownerVertex":a.get("data-angle-vertex") or a.get("data-owner-vertex"),"rays":a.get("data-angle-rays") or a.get("data-owner-rays")})
    return {"exam":row["exam"],"qid":row["qid"],"assetPath":row["assetPath"],"degreeLabels":texts,"existingOwnedArcs":existing_arcs}

report={"schemaVersion":"APMATH_ANGLE_OWNER_CANDIDATE_AUDIT_v1","denominator":len(ledger["items"]),"items":[inspect_asset(row) for row in ledger["items"]]}
(OUT/"angle-owner-candidate-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
totals={"degreeLabels":sum(len(x["degreeLabels"]) for x in report["items"]),"candidate":sum(t["status"]=="CANDIDATE" for x in report["items"] for t in x["degreeLabels"]),"reviewRequired":sum(t["status"]=="REVIEW_REQUIRED" for x in report["items"] for t in x["degreeLabels"]),"noRays":sum(t["status"]=="NO_RAY_VERTEX" for x in report["items"] for t in x["degreeLabels"]),"existingOwnerArcLabels":sum(len(x["existingOwnedArcs"]) for x in report["items"])}
print(json.dumps(totals,ensure_ascii=False,indent=2))
