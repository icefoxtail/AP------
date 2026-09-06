"""Bounded deterministic visual generation; never writes production Archive.

The JS schema/canonicalizer is the only semantic contract. Python computes
coordinates and verifies supported mathematical relations before serialization.
This build-side witness is NOT independent V2 or final C/D evidence.
"""
from __future__ import annotations

import argparse
import ast
import hashlib
import html
import json
import math
import re
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent


def digest(data: bytes) -> str:
    return "sha256:" + hashlib.sha256(data).hexdigest()


def _validate(fact: dict) -> dict:
    node = shutil.which("node")
    if not node:
        raise ValueError("NODE_CANONICAL_VALIDATOR_UNAVAILABLE")
    result = subprocess.run([node, str(HERE / "cli.mjs"), "fact", "--stdin"], input=json.dumps(fact, ensure_ascii=False), capture_output=True, text=True, encoding="utf-8", timeout=30)
    if result.returncode:
        raise ValueError("VISUAL_CONTRACT_BLOCKED: " + result.stdout.strip())
    return json.loads(result.stdout)


def polynomial_value(expression: str, x: float) -> float:
    tree = ast.parse(expression, mode="eval")
    if sum(1 for _ in ast.walk(tree)) > 100:
        raise ValueError("FORMULA_TOO_COMPLEX")

    def visit(node):
        if isinstance(node, ast.Expression):
            return visit(node.body)
        if isinstance(node, ast.Name) and node.id == "x":
            return x
        if isinstance(node, ast.Constant) and type(node.value) in (int, float) and math.isfinite(node.value):
            return node.value
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            return visit(node.operand) * (-1 if isinstance(node.op, ast.USub) else 1)
        if isinstance(node, ast.BinOp):
            left, right = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                return left * right
            if isinstance(node.op, ast.Pow) and isinstance(node.right, ast.Constant) and type(node.right.value) is int and 0 <= node.right.value <= 12:
                return left ** right
            if isinstance(node.op, ast.Div) and isinstance(node.right, ast.Constant) and right:
                return left / right
        raise ValueError("UNSUPPORTED_FORMULA_REQUIRES_REGISTERED_GENERATOR")

    result = visit(tree)
    if not math.isfinite(result):
        raise ValueError("NONFINITE_FUNCTION_VALUE")
    return result


def generate(fact: dict) -> tuple[str, dict]:
    preflight = subprocess.run([shutil.which('node') or 'node', str(HERE / 'cli.mjs'), 'rules'], capture_output=True, text=True, encoding='utf-8', timeout=30)
    if preflight.returncode:
        raise ValueError('RULE_ROUTING_BLOCKED: ' + preflight.stdout.strip())
    rule_pack = json.loads(preflight.stdout)
    validation = _validate(fact)
    s, kind = fact["semantic"], fact["visualType"]
    elements, computed = [], []
    width, height = 360, 320

    def text(x, y, value, size=17, anchor="middle"):
        if re.search(r'\\[A-Za-z]|\$', str(value)):
            raise ValueError('SVG_LABEL_REQUIRES_PLAIN_MATH')
        estimated_width = sum(0.98 if ord(char) > 255 else 0.58 for char in str(value)) * size
        available = width - x - 14 if anchor == "start" else x - 14 if anchor == "end" else 2 * min(x - 8, width - x - 8)
        if estimated_width > available:
            raise ValueError("LABEL_REQUIRES_BOUNDED_REWRITE_OR_HTML_TABLE")
        elements.append(f'<text x="{x:.6g}" y="{y:.6g}" font-size="{size}" text-anchor="{anchor}" fill="#111">{html.escape(str(value))}</text>')

    def circle(x, y, radius, label=None, fill="none"):
        elements.append(f'<circle cx="{x:.6g}" cy="{y:.6g}" r="{radius:.6g}" fill="{fill}" stroke="#222" stroke-width="1.8"/>')
        computed.append({"shape": "circle", "x": x, "y": y, "radius": radius, "label": label})

    def line(x1, y1, x2, y2, stroke="#222"):
        elements.append(f'<line x1="{x1:.6g}" y1="{y1:.6g}" x2="{x2:.6g}" y2="{y2:.6g}" stroke="{stroke}" stroke-width="1.8"/>')

    def universe(y, panel_height):
        elements.append(f'<rect x="12" y="{y}" width="336" height="{panel_height}" fill="none" stroke="#222"/>')
        text(27, y + 23, s["universeId"])

    if kind == 'proof-flow':
        height = 40 + 125 * len(s['steps'])
        locations = {step['id']:22+125*i for i,step in enumerate(s['steps'])}
        for i, step in enumerate(s['steps']):
            for j, premise in enumerate(step['premiseIds']):
                source_y, target_y, lane = locations[premise]+48, locations[step['id']]+48, 20+5*j
                line(56, source_y, lane, source_y); line(lane, source_y, lane, target_y); line(lane, target_y, 56, target_y)
                line(56, target_y, 49, target_y-5); line(56, target_y, 49, target_y+5)
        for i, step in enumerate(s['steps']):
            y = 22 + 125*i
            elements.append(f'<rect x="56" y="{y}" width="292" height="95" fill="white" stroke="#222"/>')
            text(202, y+25, step['id']+': '+step['statement'], 18)
            text(202, y+53, step['justification'], 16)
            text(202, y+79, ', '.join(step['premiseIds']) if step['premiseIds'] else '주어진 조건', 16)
        computed.append({'proofStepOrder':[step['id'] for step in s['steps']], 'edges':[(p,step['id']) for step in s['steps'] for p in step['premiseIds']]})
        if s['contradictionTarget'] is not None:
            text(202, height-12, '모순: '+s['contradictionTarget'], 17)
    elif kind == 'quantifier-negation':
        symbol = {'FOR_ALL':'∀', 'EXISTS':'∃'}
        text(180, 60, f'{symbol[s["originalQuantifier"]]}{s["variable"]}∈{s["domain"]}', 23)
        text(180, 100, s['predicate'], 21)
        line(180, 127, 180, 165); line(180, 165, 174, 155); line(180, 165, 186, 155)
        text(226, 152, '부정', 17)
        text(180, 215, f'{symbol[s["negatedQuantifier"]]}{s["variable"]}∈{s["domain"]}', 23)
        text(180, 258, s['negatedPredicate'], 21)
        computed.append({'domainPreserved':s['domain'], 'quantifiersSwapped':True})
    elif kind == "set-inclusion":
        universe(12, 280)
        relation = s["relation"]
        if relation == "DISJOINT":
            a, b = (98, 145, 64), (262, 145, 64)
        elif relation == "EQUAL":
            a = b = (180, 145, 90)
        else:
            a, b = (180, 160, 50), (180, 140, 90)
        distance = math.hypot(a[0] - b[0], a[1] - b[1])
        if relation in ("SUBSET_OR_EQUAL", "PROPER_SUBSET") and distance + a[2] > b[2]:
            raise ValueError("GENERATED_CONTAINMENT_FAIL")
        if relation == "DISJOINT" and distance <= a[2] + b[2]:
            raise ValueError("GENERATED_DISJOINTNESS_FAIL")
        circle(*b, s["outer"])
        if relation != "EQUAL":
            circle(*a, s["inner"])
        text(a[0], a[1], s["inner"] if relation != "EQUAL" else f'{s["inner"]} = {s["outer"]}')
        if relation != "EQUAL":
            text(b[0], b[1] - 45, s["outer"])
        symbol = {"DISJOINT": "∩", "EQUAL": "=", "SUBSET_OR_EQUAL": "⊆", "PROPER_SUBSET": "⊊"}[relation]
        text(180, 267, f'{s["inner"]} {symbol} {s["outer"]}' + (" = ∅" if relation == "DISJOINT" else ""))
    elif kind == "set-cardinality":
        height = 600
        a, b, u = s["aCount"], s["bCount"], s["universeCount"]
        for y, role, intersection in [(12, "최대", s["maximumIntersection"]), (302, "최소", s["minimumIntersection"])]:
            universe(y, 274)
            text(180, y + 27, f'{role}: n({s["setIds"][0]}∩{s["setIds"][1]})={intersection}')
            a_only, b_only = a - intersection, b - intersection
            computed.append({"role": role, "aOnly": a_only, "intersection": intersection, "bOnly": b_only, "outside": u - a - b + intersection})
            if a == 0 or b == 0:
                if a or b:
                    circle(180, y + 132, 72)
                text(180, y + 130, f'{s["setIds"][0]}={"∅" if not a else a}, {s["setIds"][1]}={"∅" if not b else b}')
            elif a_only == 0 and b_only == 0:
                circle(180, y + 135, 72)
                text(180, y + 135, f'{s["setIds"][0]}={s["setIds"][1]}: {intersection}')
            elif a_only == 0 or b_only == 0:
                inner = s["setIds"][0] if a_only == 0 else s["setIds"][1]
                outer = s["setIds"][1] if a_only == 0 else s["setIds"][0]
                circle(180, y + 135, 83, outer)
                circle(195, y + 148, 47, inner)
                text(195, y + 152, f'{inner}: {intersection}')
                text(153, y + 87, f'{outer}만: {max(a_only, b_only)}')
            elif intersection == 0:
                circle(98, y + 132, 66, s["setIds"][0]); circle(262, y + 132, 66, s["setIds"][1])
                text(98, y + 136, f'{s["setIds"][0]}: {a}'); text(262, y + 136, f'{s["setIds"][1]}: {b}')
            else:
                circle(136, y + 134, 72, s["setIds"][0]); circle(224, y + 134, 72, s["setIds"][1])
                text(103, y + 138, a_only); text(180, y + 138, intersection); text(257, y + 138, b_only)
                text(109, y + 84, s["setIds"][0]); text(251, y + 84, s["setIds"][1])
            text(180, y + 242, f'U={u}, 바깥={u-a-b+intersection}')
        text(180, 595, "넓이는 원소 수에 비례하지 않음", 15)
    elif kind == "set-regions":
        height = 410
        centers = [(145, 167, 84), (225, 167, 84)] if len(s["setIds"]) == 2 else [(180, 137, 79), (135, 217, 79), (225, 217, 79)]
        definitions = []
        for i, (x, y, radius) in enumerate(centers):
            definitions.append(f'<clipPath id="inside{i}"><circle cx="{x}" cy="{y}" r="{radius}"/></clipPath><mask id="outside{i}" maskUnits="userSpaceOnUse" x="12" y="12" width="336" height="306"><rect x="12" y="12" width="336" height="306" fill="white"/><circle cx="{x}" cy="{y}" r="{radius}" fill="black"/></mask>')
        elements.append('<defs>' + ''.join(definitions) + '</defs>')
        for region in sorted(s["regions"]):
            groups = ''.join(f'<g {"clip-path" if bit == "1" else "mask"}="url(#{"inside" if bit == "1" else "outside"}{i})">' for i, bit in enumerate(region))
            elements.append(groups + '<rect x="12" y="12" width="336" height="306" fill="#bbb"/>' + '</g>' * len(region))
        universe(12, 306)
        for label, (x, y, radius) in zip(s["setIds"], centers):
            circle(x, y, radius, label); text(x, y - radius + 24, label)
        for i, step in enumerate(s["decisiveSteps"]):
            text(180, 345 + i * 24, step, 16)
        height = max(height, 362 + 24 * len(s["decisiveSteps"]))
    elif kind == "case-table":
        # Stacked case cards remain readable in a mobile-width container.
        line_count = sum(3 + len(row["cells"]) for row in s["rows"])
        height = 80 + 26 * line_count
        text(18, 28, s["exhaustivenessReason"], 16, "start")
        y = 62
        for index, row in enumerate(sorted(s["rows"], key=lambda r: r["id"]), 1):
            disposition = {'KEEP':'선택', 'REJECT':'제외', 'NEUTRAL':'확인'}[row['disposition']]
            text(18, y, f'경우 {index} — {disposition}', 18, "start"); y += 26
            for label, cell in zip(s["columns"], row["cells"]):
                text(18, y, f'{label}: {cell}', 17, "start"); y += 26
            text(18, y, row["reason"], 16, "start"); y += 26
            line(12, y, 348, y); y += 26
    elif kind == "number-line":
        values = [v for interval in s["intervals"] for v in (interval["left"], interval["right"]) if v is not None]
        lo, hi = (min(values) - 2, max(values) + 2) if values else (-5, 5)
        X = lambda value: 35 + (value - lo) * 290 / (hi - lo)
        height = 85 + 80 * len(s["intervals"])
        for i, interval in enumerate(s["intervals"]):
            y = 60 + i * 80
            line(25, y, 335, y, '#aaa')
            left, right = interval["left"], interval["right"]
            x1, x2 = X(left) if left is not None else 25, X(right) if right is not None else 335
            line(x1, y, x2, y)
            for x, value, closed in [(x1, left, interval["leftClosed"]), (x2, right, interval["rightClosed"])]:
                if value is None:
                    direction = -1 if x == x1 else 1
                    line(x, y, x - direction * 10, y - 6); line(x, y, x - direction * 10, y + 6)
                else:
                    circle(x, y, 4, fill='#111' if closed else '#fff'); text(x, y + 28, value)
        text(335, height - 12, s["variable"])
    elif kind == "cartesian":
        legend_offset = max(0, len(s['branches'])-1)*44
        height = 390 + legend_offset
        X = lambda x: 38 + (x - s["xMin"]) * 284 / (s["xMax"] - s["xMin"])
        Y = lambda y: 312 + legend_offset - (y - s["yMin"]) * 264 / (s["yMax"] - s["yMin"])
        if s["xMin"] <= 0 <= s["xMax"]:
            line(X(0), 46 + legend_offset, X(0), 320 + legend_offset)
            if math.floor(s['yMax'])-math.ceil(s['yMin']) <= 10:
                for value in range(math.ceil(s['yMin']), math.floor(s['yMax'])+1):
                    if value: line(X(0)-4,Y(value),X(0)+4,Y(value)); text(X(0)-8,Y(value)+5,value,14,'end')
        if s["yMin"] <= 0 <= s["yMax"]:
            line(28, Y(0), 332, Y(0))
            if math.floor(s['xMax'])-math.ceil(s['xMin']) <= 10:
                for value in range(math.ceil(s['xMin']), math.floor(s['xMax'])+1):
                    if value: line(X(value),Y(0)-4,X(value),Y(0)+4); text(X(value),Y(0)+23,value,14)
        superscript = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')
        for index, branch in enumerate(s["branches"]):
            display_formula = re.sub(r'\*\*(\d+)', lambda m:m.group(1).translate(superscript), branch['formula']).replace('*','·')
            text(180, 20+index*44, f'{branch["id"]}(x)={display_formula}', 18)
            lo, hi = branch['points'][0]['x'], branch['points'][-1]['x']
            text(180, 40+index*44, f'그림 구간: {lo} {"≤" if branch["leftClosed"] else "<"} x {"≤" if branch["rightClosed"] else "<"} {hi}', 16)
            for point in branch["points"]:
                if not math.isclose(polynomial_value(branch["formula"], point["x"]), point["y"], rel_tol=1e-9, abs_tol=1e-9):
                    raise ValueError("FUNCTION_SAMPLE_MISMATCH")
            # Dense samples are calculated in Python; no sparse hand-drawn path.
            lo, hi = branch["points"][0]["x"], branch["points"][-1]["x"]
            samples = [(lo + (hi - lo) * i / 512) for i in range(513)]
            coords = [(X(x), Y(polynomial_value(branch["formula"], x))) for x in samples]
            if any(y < 48+legend_offset or y > 312+legend_offset for _, y in coords):
                raise ValueError("GRAPH_VIEW_CLIPS_BRANCH")
            elements.append('<polyline fill="none" stroke="#111" stroke-width="2" points="' + ' '.join(f'{x:.6g},{y:.6g}' for x, y in coords) + '"/>')
            for point, closed in [(branch["points"][0], branch["leftClosed"]), (branch["points"][-1], branch["rightClosed"])]:
                circle(X(point["x"]), Y(point["y"]), 4, fill='#111' if closed else '#fff')
            computed.append({"branch": branch["id"], "sampleCount": 513, "coordinates": coords})
        for point in s["keyPoints"]:
            circle(X(point["x"]), Y(point["y"]), 3, point["id"], '#111')
            if point['x'] == 0 and point['y'] == 0:
                text(X(point['x'])-8,Y(point['y'])+18,point['id'],16,'end')
            else:
                anchor = 'start' if X(point['x']) < 180 else 'end'
                text(X(point['x'])+(8 if anchor == 'start' else -8),Y(point['y'])-10,f'{point["id"]}({point["x"]},{point["y"]})',16,anchor)
        text(333, 338+legend_offset, 'x'); text(25, 64+legend_offset, 'y')
        text(180, height-12, f'표시 범위 x: {s["xMin"]}~{s["xMax"]}, y: {s["yMin"]}~{s["yMax"]}', 15)
    elif kind == "geometry":
        points = {p["id"]: p for p in s["points"]}
        circles = {p["id"]: p for p in s["circles"]}
        segments = {p["id"]: p for p in s["segments"]}
        def vector(segment):
            start, end = points[segment["start"]], points[segment["end"]]
            v = (end["x"] - start["x"], end["y"] - start["y"])
            if math.hypot(*v) == 0:
                raise ValueError("DEGENERATE_SEGMENT")
            return v
        for relation in s["relations"]:
            a, b, kind_relation = relation["from"], relation["to"], relation["relation"]
            if kind_relation in ("parallel", "perpendicular") and a in segments and b in segments:
                va, vb = vector(segments[a]), vector(segments[b])
                value = va[0]*vb[1]-va[1]*vb[0] if kind_relation == "parallel" else va[0]*vb[0]+va[1]*vb[1]
                valid = abs(value) <= 1e-9 * math.hypot(*va) * math.hypot(*vb)
            elif a in circles and b in circles:
                ca, cb = circles[a], circles[b]
                distance = math.hypot(ca["x"]-cb["x"], ca["y"]-cb["y"])
                valid = (distance+cb["radius"] <= ca["radius"]+1e-9 if kind_relation == "contains" else distance > ca["radius"]+cb["radius"]+1e-9 if kind_relation == "disjoint" else distance < 1e-9 and abs(ca["radius"]-cb["radius"]) < 1e-9 if kind_relation == "equal" else False)
            elif kind_relation == "segment" and a in points and b in points:
                valid = points[a] != points[b]
            else:
                raise ValueError("UNSUPPORTED_GEOMETRY_RELATION")
            if not valid:
                raise ValueError("GEOMETRY_RELATION_FALSE")
            computed.append({"relation": relation, "verified": True})
        bounds = [(p["x"], p["y"]) for p in points.values()]
        for c in circles.values():
            bounds.extend([(c["x"]-c["radius"], c["y"]-c["radius"]), (c["x"]+c["radius"], c["y"]+c["radius"])])
        if not bounds:
            raise ValueError("EMPTY_GEOMETRY")
        xmin, xmax = min(x for x, _ in bounds), max(x for x, _ in bounds)
        ymin, ymax = min(y for _, y in bounds), max(y for _, y in bounds)
        scale = min(264/max(xmax-xmin, 1), 220/max(ymax-ymin, 1))
        X = lambda x: 180 + (x-(xmin+xmax)/2)*scale
        Y = lambda y: 154 - (y-(ymin+ymax)/2)*scale
        for segment in segments.values():
            a, b = points[segment["start"]], points[segment["end"]]
            vector(segment); line(X(a["x"]), Y(a["y"]), X(b["x"]), Y(b["y"]))
        for c in circles.values():
            if c['radius'] == 0:
                circle(X(c['x']), Y(c['y']), 3, c['id'], '#111'); text(X(c['x']), Y(c['y'])-12, c['id']+': r=0')
            else:
                circle(X(c["x"]), Y(c["y"]), c["radius"]*scale, c["id"]); text(X(c["x"]), Y(c["y"]), c["id"])
        for p in points.values():
            circle(X(p["x"]), Y(p["y"]), 2.5, p["id"], '#111'); text(X(p["x"]), Y(p["y"])-10, p["id"])
        for i, relation in enumerate(s["relations"]):
            symbol = {"parallel": "∥", "perpendicular": "⊥", "contains": "⊇", "equal": "=", "disjoint": "∩", "segment": "—"}[relation["relation"]]
            display = lambda identity: segments[identity]['start']+segments[identity]['end'] if identity in segments else identity
            text(180, 286+i*24, display(relation["from"])+symbol+display(relation["to"])+("=∅" if relation["relation"] == "disjoint" else ""))
        coordinate_labels = [f'{p["id"]}({p["x"]},{p["y"]})' for p in points.values()]
        legend_y = 286+24*len(s['relations'])
        for i in range(0,len(coordinate_labels),2):
            text(180,legend_y,'  '.join(coordinate_labels[i:i+2]),15);legend_y += 24
        for c in circles.values():
            text(180,legend_y,f'{c["id"]}({c["x"]},{c["y"]}), r={c["radius"]}',15);legend_y += 24
        height = max(320, legend_y+20)
        computed.append({"equalUnitScale": scale, "xOrigin": (xmin+xmax)/2, "yOrigin": (ymin+ymax)/2})
    else:
        raise ValueError("UNSUPPORTED_VISUAL_TYPE")

    title = {"set-regions": "집합 영역", "set-inclusion": "집합 포함 관계", "set-cardinality": "교집합의 최대와 최소", "case-table": "경우별 검산", "number-line": "해집합", "cartesian": "좌표 그래프", "geometry": "도형의 관계", "proof-flow": "증명 흐름", "quantifier-negation": "양화 명제의 부정"}[kind]
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{title}의 문항별 수학 사실을 표시한다.</desc><g font-family="Arial, sans-serif">' + ''.join(elements) + '</g></svg>\n'
    evidence = {"schemaVersion": "APMATH_GENERATOR_WITNESS_v1", "status": "BUILD_SIDE_ONLY", "generator": "pipeline-core/generator.py", "generatorSha": digest(Path(__file__).read_bytes()), "rulePackSha": rule_pack['rulePackSha'], "appliedRuleRefs": rule_pack['refs'], "semanticSha": validation["semanticSha"], "visualSpecSha": validation["specSha"], "artifactSha": digest(svg.encode()), "numericExecution": "PYTHON_EXECUTED", "computedPrimitives": computed, "independentReview": "NOT_TESTED", "render": "NOT_TESTED"}
    return svg, evidence


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--fact", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--evidence", required=True, type=Path)
    args = parser.parse_args()
    repo = HERE.parents[2]
    for target in (args.out, args.evidence):
        resolved = target.resolve()
        for protected in (repo / "archive/exams", repo / "archive/assets"):
            if resolved.is_relative_to(protected.resolve()):
                raise ValueError("PRODUCTION_WRITE_FORBIDDEN")
        if resolved.exists():
            raise ValueError("APPEND_ONLY_OUTPUT_ALREADY_EXISTS")
    svg, evidence = generate(json.loads(args.fact.read_text(encoding="utf-8")))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.evidence.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("x", encoding="utf-8", newline="\n") as output:
        output.write(svg)
    with args.evidence.open("x", encoding="utf-8", newline="\n") as output:
        json.dump(evidence, output, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
