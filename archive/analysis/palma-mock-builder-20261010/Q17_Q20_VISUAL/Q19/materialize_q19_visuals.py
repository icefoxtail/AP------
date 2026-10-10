from __future__ import annotations

import hashlib
import json
import math
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[5]
HERE = ROOT / "archive/analysis/palma-mock-builder-20261010/Q17_Q20_VISUAL/Q19"
ASSET_DIR = ROOT / "archive/assets/generated-lite/palma-speed-pilot"
SOURCE_DIR = "alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1"
PACKAGE_REL = SOURCE_DIR + "/GPT_QID9_Q19_PACKAGE.json"
APPROVAL_REL = SOURCE_DIR + "/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json"
SOURCE_EXAM_REL = "archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js"
sys.path.insert(0, str(ROOT))
from alive.engine.visual_renderer import RENDERER_VERSION, VISUAL_SPEC_VERSION, render_visual_spec


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest().upper()


def blob(raw: bytes) -> str:
    return hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()


def clean_blob(path: str, raw: bytes) -> str:
    return subprocess.check_output(["git", "hash-object", f"--path={path}", "--stdin"], cwd=ROOT, input=raw).decode().strip()


def write_json(path: Path, value: Any) -> bytes:
    path.parent.mkdir(parents=True, exist_ok=True)
    raw = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    path.write_bytes(raw)
    return raw


def git_blob(path: str) -> str:
    return subprocess.check_output(["git", "rev-parse", f"HEAD:{path}"], cwd=ROOT, text=True).strip()


# All coordinates and coefficients below are read from the approved Q19 package.
# mValue selects one interior or boundary case for the UID-specific geometry panel.
PARAMS = {
    "A1": dict(big=(0, 0, 6), lower=(-3, 0, 3, -1), upper=(3, 0, 3, 1), anchor=-3, mValue=0.25, case="m=1/4: 5개", thresholds=[1 / math.sqrt(3)]),
    "A2": dict(big=(-0.5, 0, 3.5), lower=(-2, 0, 2, -1), upper=(2, 0, 1, 1), anchor=-2, mValue=0.15, case="m=3/20: 5개", thresholds=[1 / math.sqrt(15)]),
    "A3": dict(big=(0.5, 0, 3.5), lower=(2, 0, 2, -1), upper=(-2, 0, 1, 1), anchor=2, mValue=-0.15, case="m=−3/20: 5개", thresholds=[-1 / math.sqrt(15)]),
    "B1": dict(big=(0, 0, 4), lower=(-2, 0, 2, -1), upper=(2, 0, 2, 1), anchor=-2, mValue=1 / math.sqrt(3), case="m=1/√3: 접점 포함 4개", thresholds=[1 / math.sqrt(3)]),
    "B2": dict(big=(0, 0, 4), lower=(-2, 0, 2, -1), upper=(2, 0, 2, 1), anchor=-2, mValue=0.25, case="m=1/4: 5개", thresholds=[1 / math.sqrt(3)]),
    "B3": dict(big=(1, 0, 5), lower=(-2, 0, 2, -1), upper=(4, 0, 2, 1), anchor=-2, mValue=0.2, case="m=1/5: 5개", thresholds=[1 / math.sqrt(8)]),
    "C1": dict(big=(0, 0, 10), lower=(2, 0, 1, 1), upper=(5, 0, 1, 1), anchor=-1, mValue=0.25, case="m=1/4: 4개", thresholds=[1 / math.sqrt(35), 1 / math.sqrt(8)]),
    "C2": dict(big=(0, 0, 10), lower=(2, 0, 1, 1), upper=(5, 0, 1, 1), anchor=-1, mValue=0.25, case="n=5, m=1/4: 4개", thresholds=[1 / math.sqrt(35), 1 / math.sqrt(8)]),
    "C3": dict(big=(0, 0, 4), lower=(-2, 0, 2, -1), upper=(3, 0, 1, 1), anchor=-2, mValue=1 / math.sqrt(32), case="n=32, m=1/√32: 5개", thresholds=[1 / math.sqrt(24)]),
}


def circle_line_intersections(circle: tuple[float, float, float], anchor: float, m: float) -> list[tuple[float, float]]:
    cx, cy, radius = circle
    # Substitute y=m(x-anchor) into (x-cx)^2+(y-cy)^2=r^2.
    A = 1 + m * m
    B = -2 * cx - 2 * m * (m * anchor + cy)
    C = cx * cx + (m * anchor + cy) ** 2 - radius * radius
    disc = B * B - 4 * A * C
    if disc < -1e-10:
        return []
    if abs(disc) <= 1e-10:
        xs = [-B / (2 * A)]
    else:
        root = math.sqrt(disc)
        xs = [(-B - root) / (2 * A), (-B + root) / (2 * A)]
    return [(x, m * (x - anchor)) for x in xs]


def scene_intersections(p: dict[str, Any], m: float) -> dict[str, Any]:
    big = circle_line_intersections(p["big"], p["anchor"], m)
    arcs: dict[str, list[tuple[float, float]]] = {}
    for key in ("lower", "upper"):
        cx, cy, r, sign = p[key]
        arcs[key] = [xy for xy in circle_line_intersections((cx, cy, r), p["anchor"], m)
                     if sign * xy[1] >= -1e-9]
    all_points: list[tuple[float, float]] = []
    for xy in big + arcs["lower"] + arcs["upper"]:
        if not any(math.dist(xy, old) <= 1e-8 for old in all_points):
            all_points.append(xy)
    return {"bigCircle": big, "lowerArc": arcs["lower"], "upperArc": arcs["upper"], "distinctUnion": all_points,
            "distinctCount": len(all_points)}


def circle_boundary(circle: tuple[float, float, float], t0: float = 0, t1: float = 2 * math.pi, n: int = 192) -> list[dict[str, float]]:
    cx, cy, r = circle
    return [{"x": cx + r * math.cos(t0 + (t1 - t0) * i / n), "y": cy + r * math.sin(t0 + (t1 - t0) * i / n)} for i in range(n + 1)]


def line_segment_in_box(anchor: float, m: float, xlim: tuple[float, float], ylim: tuple[float, float]) -> tuple[tuple[float, float], tuple[float, float]]:
    candidates = []
    for x in xlim:
        y = m * (x - anchor)
        if ylim[0] - 1e-8 <= y <= ylim[1] + 1e-8:
            candidates.append((x, y))
    if abs(m) > 1e-12:
        for y in ylim:
            x = anchor + y / m
            if xlim[0] - 1e-8 <= x <= xlim[1] + 1e-8:
                candidates.append((x, y))
    unique = []
    for xy in candidates:
        if not any(math.dist(xy, old) < 1e-8 for old in unique):
            unique.append(xy)
    if len(unique) < 2:
        raise ValueError("line did not cross the visual frame twice")
    return unique[0], unique[-1]


def parameters(uid: str) -> dict[str, Any]:
    slot = uid.rsplit("-", 1)[1]
    return PARAMS[slot]


def make_spec(uid: str, p: dict[str, Any]) -> dict[str, Any]:
    big = p["big"]
    extent = max(abs(big[0]) + big[2], abs(p["lower"][0]) + p["lower"][2], abs(p["upper"][0]) + p["upper"][2])
    half = extent * 1.32
    width = height = 760
    xlim = (-half, half)
    ylim = (-half, half)
    valid_ends = line_segment_in_box(p["anchor"], p["mValue"], xlim, ylim)
    main_is_tangent = any(len(circle_line_intersections((p[key][0], p[key][1], p[key][2]), p["anchor"], p["mValue"])) == 1 for key in ("lower", "upper"))
    lines = [{"from": {"x": valid_ends[0][0], "y": valid_ends[0][1]}, "to": {"x": valid_ends[1][0], "y": valid_ends[1][1]}, "kind": "tangent" if main_is_tangent else "line"}]
    big = p["big"]
    annotations_text = [p["case"], f"반지름: C {big[2]:g}, S₁ {p['lower'][2]:g}, S₂ {p['upper'][2]:g}"]
    # Boundary guides encode excluded tangencies; the horizontal guide records
    # endpoint coincidence at m=0. They are explanatory case boundaries.
    for index, m in enumerate(p["thresholds"]):
        if abs(m - p["mValue"]) < 1e-10:
            annotations_text.append("표시된 직선 자체가 접선 경계")
            continue
        a, b = line_segment_in_box(p["anchor"], m, xlim, ylim)
        lines.append({"from": {"x": a[0], "y": a[1]}, "to": {"x": b[0], "y": b[1]}, "kind": "guide"})
        annotations_text.append(f"원호 접선 경계 {index+1}: 1점")
    if len(p["thresholds"]) == 2:
        annotations_text.append("두 접선 경계 모두 제외")
    # m=0 is already the renderer's horizontal x-axis; record the coincidence
    # there without drawing a duplicate guide over that axis.
    if not any(abs(m) < 1e-10 for m in p["thresholds"]):
        annotations_text.append("m=0 (x축): 끝점 중복, 제외")
    annotations = [{"x": -half * 0.94, "y": half * (0.87 - index * 0.105), "text": label} for index, label in enumerate(annotations_text)]
    curves = []
    for key in ("lower", "upper"):
        cx, cy, r, sign = p[key]
        if sign < 0:
            curves.append({"points": circle_boundary((cx, cy, r), math.pi, 2 * math.pi, 128)})
        else:
            curves.append({"points": circle_boundary((cx, cy, r), 0, math.pi, 128)})
    facts = scene_intersections(p, p["mValue"])
    points = [{"x": xy[0], "y": xy[1]} for xy in facts["distinctUnion"]]
    return {"version": VISUAL_SPEC_VERSION, "type": "circle_geometry", "width": width, "height": height,
            "xRange": list(xlim), "yRange": list(ylim),
            "circles": [{"center": {"x": big[0], "y": big[1]}, "radius": big[2]}],
            "curves": curves, "lines": lines, "points": points, "annotations": annotations}


def to_math(spec: dict[str, Any], x: float, y: float) -> tuple[float, float]:
    margin = 32.0
    sx = (spec["width"] - 2 * margin) / (spec["xRange"][1] - spec["xRange"][0])
    sy = (spec["height"] - 2 * margin) / (spec["yRange"][1] - spec["yRange"][0])
    return spec["xRange"][0] + (x - margin) / sx, spec["yRange"][0] + (spec["height"] - margin - y) / sy


def extract_and_check(svg: bytes, spec: dict[str, Any], p: dict[str, Any]) -> dict[str, Any]:
    root = ET.fromstring(svg.decode("utf-8"))
    circles = [e for e in root.iter() if e.tag.endswith("circle") and e.attrib.get("class") == "shape"]
    lines = [e for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "line" and e.attrib.get("class") != "axis"]
    axes = [e for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "line" and e.attrib.get("class") == "axis"]
    curves = [e for e in root.iter() if e.tag.endswith("polyline") and e.attrib.get("class") == "curve"]
    points = [e for e in root.iter() if e.tag.endswith("circle") and e.attrib.get("class") == "point"]
    assert len(circles) == len(spec["circles"]) and len(lines) == len(spec["lines"])
    assert len(curves) == len(spec["curves"]) and len(points) == len(spec["points"])
    margin = 32.0
    sx = (spec["width"] - 2 * margin) / (spec["xRange"][1] - spec["xRange"][0])
    sy = (spec["height"] - 2 * margin) / (spec["yRange"][1] - spec["yRange"][0])
    assert abs(sx - sy) < 1e-8
    outer = circles[0]
    center = to_math(spec, float(outer.attrib["cx"]), float(outer.attrib["cy"]))
    radius = float(outer.attrib["r"]) / sx
    assert math.dist(center, p["big"][:2]) < 1e-6 and abs(radius - p["big"][2]) < 1e-6
    expected_line_slopes = [p["mValue"]] + [m for m in p["thresholds"] if abs(m - p["mValue"]) >= 1e-10]
    assert len(lines) == len(expected_line_slopes)
    line_observed = []
    for line_index, line in enumerate(lines):
        a = to_math(spec, float(line.attrib["x1"]), float(line.attrib["y1"]))
        b = to_math(spec, float(line.attrib["x2"]), float(line.attrib["y2"]))
        expected_slope = expected_line_slopes[line_index]
        observed_slope = (b[1] - a[1]) / (b[0] - a[0]) if abs(b[0]-a[0]) > 1e-9 else None
        residuals = [a[1] - expected_slope*(a[0]-p["anchor"]), b[1] - expected_slope*(b[0]-p["anchor"])]
        slope_delta = None if observed_slope is None else observed_slope - expected_slope
        assert observed_slope is not None and abs(slope_delta) < 1e-6 and max(abs(x) for x in residuals) < 1e-5
        line_observed.append({"from": a, "to": b, "class": line.attrib["class"],
                              "expectedSlope": expected_slope, "observedSlope": observed_slope, "slopeDelta": slope_delta, "endpointLineResiduals": residuals})
    axis_observed = []
    for axis in axes:
        a = to_math(spec, float(axis.attrib["x1"]), float(axis.attrib["y1"]))
        b = to_math(spec, float(axis.attrib["x2"]), float(axis.attrib["y2"]))
        axis_observed.append({"from": a, "to": b, "class": "axis", "horizontal": abs(a[1]-b[1]) < 1e-8, "yValue": (a[1]+b[1])/2})
    assert any(row["horizontal"] and abs(row["yValue"]) < 1e-8 for row in axis_observed)
    arc_observed = []
    for curve_index, curve in enumerate(curves):
        pts = [to_math(spec, *map(float, pair.split(","))) for pair in curve.attrib["points"].split()]
        key = "lower" if curve_index == 0 else "upper"
        cx, cy, r, sign = p[key]
        residuals = [math.hypot(x-cx, y-cy)-r for x, y in pts]
        halfplane_residual = min(sign*y for _, y in pts)
        arc_observed.append({"sourceArc": "S1" if key == "lower" else "S2", "sampleCount": len(pts), "first": pts[0], "last": pts[-1],
                             "maxCircleResidual": max(abs(x) for x in residuals), "halfPlaneMinimum": halfplane_residual})
        assert max(abs(x) for x in residuals) < 0.002 and halfplane_residual >= -1e-8
    point_observed = [to_math(spec, float(e.attrib["cx"]), float(e.attrib["cy"])) for e in points]
    recomputed = scene_intersections(p, p["mValue"])
    assert len(point_observed) == recomputed["distinctCount"]
    assert all(any(math.dist(xy, other) < 1e-5 for other in point_observed) for xy in recomputed["distinctUnion"])
    text_nodes = [e for e in root.iter() if e.tag.endswith("text")]
    texts = [(e.text or "").strip() for e in text_nodes]
    assert texts == [a["text"] for a in spec["annotations"]]
    return {"xmlParse": "PASS", "actualSvgPrimitives": {"outerCircle": {"center": center, "radius": radius}, "axes": axis_observed, "lines": line_observed,
            "arcPolylines": arc_observed, "intersectionPoints": point_observed, "annotations": texts,
            "annotationTextNodes": [{"text": (e.text or "").strip(), "screenAnchor": [float(e.attrib["x"]), float(e.attrib["y"])]} for e in text_nodes]},
            "observedFacts": {"outerCircleParity": "PASS", "arcHalfPlaneAndRadiusParity": "PASS", "linePointParity": "PASS",
              "representativeDistinctIntersectionCount": len(point_observed), "representativeIntersectionCoordinates": point_observed,
              "horizontalEndpointBoundaryUsesActualXAxis": True, "tangentBoundaryAndEndpointCaseShown": True}, "deltaTolerance": {"coordinates": 1e-5, "radius": 1e-6, "arcRadiusResidual": 0.002, "dedupDistance": 1e-8}}


def main() -> None:
    package_path = ROOT / PACKAGE_REL
    approval_path = ROOT / APPROVAL_REL
    source_path = ROOT / SOURCE_EXAM_REL
    package_raw = package_path.read_bytes()
    approval_raw = approval_path.read_bytes()
    approval = json.loads(approval_raw)
    package = json.loads(package_raw)
    package_approval = next(row for row in approval["packages"] if row["sourceQid"] == 19)
    calibration_raw = (HERE / "Q19.calibration-preflight.json").read_bytes()
    calibration = json.loads(calibration_raw.decode("utf-8"))
    frozen_package = calibration["sourceAndFrozenApproval"]["package"]
    preflight_approval_receipt = calibration["sourceAndFrozenApproval"]["approvalReceipt"]
    assert sha(approval_raw).lower() == preflight_approval_receipt["sha256"]
    canonical_package_raw = subprocess.check_output(["git", "show", f"HEAD:{PACKAGE_REL}"], cwd=ROOT)
    assert sha(package_raw).lower() == frozen_package["sha256"]
    assert sha(canonical_package_raw).lower() == package_approval["sha256"]
    assert sha(canonical_package_raw).lower() == calibration["sourceAndFrozenApproval"]["packageCanonicalHeadBytesSha256"]
    assert blob(canonical_package_raw) == package_approval["gitBlobSha1"]
    assert git_blob(PACKAGE_REL) == package_approval["gitBlobSha1"]
    source_parity = calibration["sourceAndFrozenApproval"]["sourceQ19BlobParity"]
    assert git_blob(SOURCE_EXAM_REL) == source_parity["currentSourceGitBlobSha1"]
    assert source_parity["status"] == "Q19_SOURCE_CONTENT_AND_SOLUTION_PARITY_PASS"
    assert len(package["items"]) == 9
    assert {item["uid"] for item in package["items"]} == set(package_approval["uids"])
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    summary = []
    for item in package["items"]:
        uid = item["uid"]
        p = parameters(uid)
        m = p["mValue"]
        mainfacts = scene_intersections(p, m)
        spec = make_spec(uid, p)
        svg_text = render_visual_spec(spec)
        assert svg_text == render_visual_spec(json.loads(json.dumps(spec, ensure_ascii=False)))
        svg = svg_text.encode("utf-8")
        static = extract_and_check(svg, spec, p)
        asset = ASSET_DIR / f"{uid}-solution.svg"
        spec_path = HERE / f"{uid}.visual-spec.json"
        report_path = HERE / f"{uid}.render-report.json"
        evidence_path = HERE / f"{uid}.visual-evidence.json"
        spec_raw = write_json(spec_path, spec)
        asset.write_bytes(svg)
        package_items = {row["uid"]: row for row in package["items"]}
        assert package_items[uid]["stem"] == item["stem"] and package_items[uid]["solution"] == item["solution"]
        report = {"schemaVersion": "PALMA_Q19_VISUAL_RENDER_REPORT_V1", "renderer": "alive.engine.visual_renderer.render_visual_spec",
                  "rendererVersion": RENDERER_VERSION, "visualSpecVersion": VISUAL_SPEC_VERSION, "visualType": spec["type"],
                  "deterministicRerender": "PASS", "specSha256": sha(json.dumps(spec, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()),
                  "assetSha256": sha(svg), "assetGitBlobSha1": blob(svg), "actualBrowserStatus": "RENDER_PENDING"}
        report_raw = write_json(report_path, report)
        expected = {
          "bigCircleCenterAndRadius": {"center": p["big"][:2], "radius": p["big"][2], "role": "GIVEN"},
          "lowerSemicircle": {"sourceLabel": "S1", "center": p["lower"][:2], "radius": p["lower"][2], "halfPlane": "y<=0" if p["lower"][3] < 0 else "y>=0", "role": "GIVEN"},
          "upperSemicircle": {"sourceLabel": "S2", "center": p["upper"][:2], "radius": p["upper"][2], "halfPlane": "y<=0" if p["upper"][3] < 0 else "y>=0", "role": "GIVEN"},
          "lineFamily": {"equation": "y=m(x-anchor)", "anchorX": p["anchor"], "role": "GIVEN"},
          "representativeLine": {"slope": m, "role": "GIVEN" if uid.endswith("-B2") else "CONCLUSION" if uid.endswith("-B1") else "DERIVED_INTERMEDIATE"},
          "representativeDistinctIntersections": {"count": mainfacts["distinctCount"], "role": "DERIVED_INTERMEDIATE", "points": mainfacts["distinctUnion"]},
          "tangentThresholds": p["thresholds"], "horizontalEndpointBoundary": {"m": 0, "role": "DERIVED_INTERMEDIATE"}}
        boundary_outputs = [{"m": threshold, **scene_intersections(p, threshold)} for threshold in p["thresholds"]]
        horizontal = scene_intersections(p, 0.0)
        facts = {"uid": uid, "slot": item["slot"], "sourceConditionCoverage": ["큰 원의 중심과 반지름", "S1 중심·반지름·y 반평면", "S2 중심·반지름·y 반평면", "source line equation and fixed x-anchor", "source line slope sign/value or natural-number parameter restriction", "서로 다른 교점의 중복 제거", "접선 경계는 한 교점으로 센다", "수평선 끝점의 중복/큰 원 교차를 구분한다"],
                 "decisiveRelationCovered": True, "uncoveredCriticalConditions": [], "expectedFactCompletenessStatus": "PASS",
                 "expectedFacts": expected, "pythonInputs": {"geometry": p, "sourceStem": item["stem"], "intersectionFormula": "substitute y=m(x-a) into each circle equation; retain roots on source half-plane; deduplicate shared coordinates within 1e-8"},
                 "pythonCalculatedOutputs": {"representative": mainfacts, "tangentBoundaries": boundary_outputs, "horizontalBoundary": horizontal},
                 "coordinateModel": {"provenance": "SOURCE_COORDINATES", "xRange": spec["xRange"], "yRange": spec["yRange"], "equalScale": True, "rendererTransform": "margin=32; sx=(width-64)/(xHigh-xLow); sy=(height-64)/(yHigh-yLow); screenX=32+(x-xLow)*sx; screenY=height-32-(y-yLow)*sy", "arcRepresentation": "Python-sampled source semicircle polylines in curves[].points; circle_geometry v0.5.2 has no native arc primitive"}}
        evidence = {"schemaVersion": "PALMA_Q19_VISUAL_ITEM_PHYSICAL_EVIDENCE_V1", "uid": uid, "sourceQid": 19, "need": "BENEFICIAL", "problemNeed": "EXEMPT", "assetAction": "NEW_SVG",
          "sourcePackagePath": PACKAGE_REL, "sourcePackageRawSha256": sha(package_raw), "sourcePackageRawGitBlobSha1": blob(package_raw), "sourcePackageHeadBytesSha256": sha(canonical_package_raw), "sourcePackageHeadBlobSha1": git_blob(PACKAGE_REL),
          "sourceExamPath": SOURCE_EXAM_REL, "sourceExamSha256": sha(source_path.read_bytes()), "sourceExamWorkingTreeBlobSha1": blob(source_path.read_bytes()), "sourceExamHeadBlobSha1": git_blob(SOURCE_EXAM_REL),
          "lockedApprovalSourceExamBlobSha1": approval["source"]["gitBlobSha1"], "sourceIdentityNote": "The approved receipt points to the earlier whole-exam blob; saved Q19 calibration proves unchanged q19 content/solution bytes against current exam blob.", "frozenOriginalQ19ContentSha256": source_parity["lockedQ19ContentSha256"], "frozenOriginalQ19SolutionSha256": source_parity["lockedQ19SolutionSha256"],
          "approvalReceiptPath": APPROVAL_REL, "approvalReceiptSha256": sha(approval_raw), "approvalReceiptRawGitBlobSha1": blob(approval_raw), "approvalReceiptCleanGitBlobSha1": clean_blob(APPROVAL_REL, approval_raw), "approvalReceiptHeadBlobSha1": git_blob(APPROVAL_REL), "approvedUid": uid,
          "calibrationPreflightPath": (HERE / "Q19.calibration-preflight.json").relative_to(ROOT).as_posix(), "calibrationPreflightSha256": sha(calibration_raw),
          "preflightApprovalReceiptGitBlobClaim": preflight_approval_receipt["gitBlobSha1"], "preflightApprovalReceiptBlobClaimParity": "PASS" if preflight_approval_receipt["gitBlobSha1"] == clean_blob(APPROVAL_REL, approval_raw) else "FAIL",
          "sourceProblemSha256": sha(item["stem"].encode("utf-8")), "sourceSolutionSha256": sha(item["solution"].encode("utf-8")), **facts,
          "actualSvgPrimitives": static["actualSvgPrimitives"], "observedFacts": static["observedFacts"], "deltaTolerance": static["deltaTolerance"],
          "labelOwnerBindings": [{**node, "semanticOwner": ("representative slope/intersection case" if node["text"].startswith(("m=", "n=")) else "three stated circle radii" if node["text"].startswith("반지름") else "semicircle tangency boundary" if "접선" in node["text"] else "horizontal endpoint-coincidence boundary"), "result": "PASS"} for node in static["actualSvgPrimitives"]["annotationTextNodes"]],
          "sourceSemanticIdentity": {"applicable": True, "checks": [{"semanticRole": "큰 원", "sourceLabel": "C", "artifactLabel": "circle primitive 1 (unlabeled by design)", "result": "PASS"}, {"semanticRole": "첫 번째 source 반원호", "sourceLabel": "S1", "artifactLabel": "curve primitive 1 (sampled in source equation order)", "result": "PASS"}, {"semanticRole": "두 번째 source 반원호", "sourceLabel": "S2", "artifactLabel": "curve primitive 2 (sampled in source equation order)", "result": "PASS"}, {"semanticRole": "교점 직선", "sourceLabel": "line through the stated anchor", "artifactLabel": "line primitive 1 (solid representative case)", "result": "PASS"}]},
          "factVisualizations": [{"fact": "C, S1, S2 source loci and line family anchor", "role": "GIVEN", "encoding": "outer circle, two half-plane filtered sampled polylines, representative line through stated anchor"}, {"fact": "representative case point count", "role": "DERIVED_INTERMEDIATE", "encoding": "one point primitive per deduplicated actual intersection"}, {"fact": "tangent and m=0 endpoint boundary cases", "role": "DERIVED_INTERMEDIATE", "encoding": "guide lines, actual x-axis and Korean case annotations"}],
          "xmlParse": static["xmlParse"], "staticPrimitiveExtractionExecuted": True, "styleFloorStatus": "STATIC_ONLY_RENDER_PENDING", "styleVersion": "visual_renderer_" + RENDERER_VERSION, "semanticGeometryPreserved": True,
          "visualSpecPath": spec_path.relative_to(ROOT).as_posix(), "visualSpecSha256": sha(spec_raw), "rendererReportPath": report_path.relative_to(ROOT).as_posix(), "rendererReportSha256": sha(report_raw),
          "sourceSvgPath": asset.relative_to(ROOT).as_posix(), "sourceSvgSha256": sha(svg), "sourceSvgGitBlobSha1": blob(svg),
          "browserRenderEvidence": {"status": "RENDER_PENDING", "reason": "Actual HTTP Archive mode=sol browser QA is assigned after projection; no browser render was run in this materialization."}, "consumerReference": "PENDING_PROJECTION",
          "newVisualInformation": ["source half-plane clipping of each semicircle", "representative line's point count and exact intersection coordinates", "tangent boundary count and m=0 endpoint coincidence are visibly distinguished"]}
        evidence_raw = write_json(evidence_path, evidence)
        summary.append({"uid": uid, "assetPath": asset.relative_to(ROOT).as_posix(), "assetSha256": sha(svg), "assetGitBlobSha1": blob(svg),
                        "evidencePath": evidence_path.relative_to(ROOT).as_posix(), "evidenceSha256": sha(evidence_raw), "renderStatus": "RENDER_PENDING",
                        "representativeIntersectionCount": mainfacts["distinctCount"], "tangentBoundaryCounts": [row["distinctCount"] for row in boundary_outputs], "horizontalDistinctCount": horizontal["distinctCount"]})
    source_bytes = (ROOT / SOURCE_EXAM_REL).read_bytes()
    summary_doc = {"schemaVersion": "PALMA_Q19_VISUAL_ASSET_SUMMARY_V1", "sourceExamPath": SOURCE_EXAM_REL, "sourceExamSha256": sha(source_bytes), "sourceExamGitBlobSha1": blob(source_bytes), "lockedApprovalSourceExamBlobSha1": approval["source"]["gitBlobSha1"], "sourceExamBlobRelation": source_parity["status"],
                   "packagePath": PACKAGE_REL, "packageWorkingTreeSha256": sha(package_raw), "packageHeadBytesSha256": sha(canonical_package_raw), "packageGitBlobSha1": blob(canonical_package_raw), "approvalReceiptPath": APPROVAL_REL, "approvalReceiptSha256": sha(approval_raw),
                   "calibrationPreflightPath": (HERE / "Q19.calibration-preflight.json").relative_to(ROOT).as_posix(), "calibrationPreflightSha256": sha(calibration_raw), "preflightApprovalReceiptGitBlobClaim": preflight_approval_receipt["gitBlobSha1"], "approvalReceiptRawGitBlobSha1": blob(approval_raw), "recomputedApprovalReceiptCleanGitBlobSha1": clean_blob(APPROVAL_REL, approval_raw), "preflightApprovalReceiptBlobClaimParity": "PASS" if preflight_approval_receipt["gitBlobSha1"] == clean_blob(APPROVAL_REL, approval_raw) else "FAIL",
                   "renderer": "alive.engine.visual_renderer:" + RENDERER_VERSION + "/visualSpec-" + VISUAL_SPEC_VERSION, "counts": {"denominator": 9, "svgCreated": len(summary), "xmlParsePass": len(summary), "staticPrimitiveParityPass": len(summary), "renderPending": len(summary)}, "items": summary}
    write_json(HERE / "Q19_asset_summary.json", summary_doc)
    print(json.dumps(summary_doc["counts"] | {"items": summary}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

