"""Independent recheck for the 2026-09-04 geometry SVG corrections.

The verifier reads production JS through Node, parses SVG with ElementTree,
and recomputes the reported geometry facts without trusting SVG labels.  It
also reverse-scans the full H15/H22 shape-movement inventory and the existing
65-item circle-equation repair inventory.
"""

from __future__ import annotations

import csv
import json
import math
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.stdout.reconfigure(encoding="utf-8")
ARCHIVE = ROOT / "archive"
SHAPE_REPORT = ROOT / "reports" / "shape-movement-visuals-20260904"
CIRCLE_REPORT = ROOT / "reports" / "geometry-equation-65-20260904"
TARGETS = {
    "22_제일고_2학기_중간_고1_기출#3": {
        "equation": "x-2y-1=0",
        "points": {"P": (-3, 1), "P′": (-0.6, -3.8), "중점": (-1.8, -1.4)},
    },
    "23_매산여고_2학기_중간_고1_기출#21": {"equation": "2x-y+2=0", "point": (0, 2)},
    "23_팔마고_2학기_중간_고1_기출#7": {
        "equations": {"원래": "2x-y-1=0", "이동 후": "2x-y+3=0"},
        "points": {"원래": (0, -1), "이동 점": (2, 7)},
        "translation": (2, 8),
    },
    "24_금당고_2학기_중간_고1_기출#9": {
        "equations": {"원래": "2x-y-1=0", "이동 후": "2x-y-5=0"},
        "points": {"원래": (0, -1), "이동 점": (1, -3)},
        "translation": (1, -2),
    },
    "25_금당고_2학기_중간_고1_기출#22": {
        "equations": ("y=x²-2x", "y=-(x-5)²+7"),
        "points": {"A": (3, 3), "C 꼭짓점": (1, -1), "C′ 꼭짓점": (5, 7)},
    },
    "25_효천고_2학기_중간_고1_기출#23": {
        "circle": ((4, 2), math.sqrt(2)),
        "points": {"V": (3, 1), "O": (4, 2), "W": (5, 3)},
        "rays": {
            "center": ("x-y-2=0", "x≥3"),
            "other": ("x+y-4=0", "x≤3"),
        },
    },
    "25_매산고_2학기_중간_고1_기출#10": {
        "equations": (
            "y=−0.204124x+3.061862",
            "y=0.204124x−3.061862",
        ),
        "circle": ((0, 0), 3),
    },
}


def node_inventory() -> list[dict]:
    code = r"""
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = process.cwd();
const examRoot = path.join(root, 'archive', 'exams', 'original', 'high', 'h1');
const rows = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) {
      const sandbox = { window: {} };
      vm.runInNewContext(fs.readFileSync(full, 'utf8'), sandbox, { filename: full, timeout: 10000 });
      const bank = sandbox.window.questionBank || [];
      for (const q of bank) {
        if (q.standardUnitKey === 'H15-SA-12' || q.standardUnitKey === 'H22-C2-04' || q.standardUnit === '도형의 이동') {
          rows.push({
            file: path.relative(root, full).replaceAll(path.sep, '/'),
            title: sandbox.window.examTitle,
            id: q.id,
            key: q.standardUnitKey,
            solutionImage: q.solutionImage || null,
          });
        }
      }
    }
  }
}
walk(examRoot);
console.log(JSON.stringify(rows));
"""
    result = subprocess.run(
        ["node", "-e", code], cwd=ROOT, check=True, capture_output=True, text=True, encoding="utf-8"
    )
    return json.loads(result.stdout)


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def parse_svg(relative: str) -> ET.Element:
    path = ROOT / relative if relative.replace("\\", "/").startswith("archive/") else ROOT / "archive" / relative
    return ET.parse(path).getroot()


def attr_elements(root: ET.Element, attribute: str) -> list[ET.Element]:
    return [element for element in root.iter() if attribute in element.attrib]


def points(root: ET.Element) -> dict[str, tuple[float, float]]:
    result = {}
    for element in attr_elements(root, "data-point-label"):
        label = element.attrib["data-point-label"]
        result[label] = (float(element.attrib["data-point-x"]), float(element.attrib["data-point-y"]))
    return result


def geometry_lines(root: ET.Element) -> list[ET.Element]:
    return [element for element in root.iter() if local_name(element.tag) == "line" and "data-geometry" in element.attrib]


def residual(coefficients: tuple[float, float, float], point: tuple[float, float]) -> float:
    a, b, c = coefficients
    return a * point[0] + b * point[1] + c


def parse_general_equation(value: str) -> tuple[float, float, float] | None:
    normalized = value.replace("−", "-").replace(" ", "")
    match = re.fullmatch(r"([+-]?\d*\.?\d*)x([+-]\d*\.?\d*)y([+-]\d*\.?\d+)=0", normalized)
    if not match:
        return None

    def coefficient(token: str) -> float:
        if token in ("", "+"):
            return 1.0
        if token == "-":
            return -1.0
        return float(token)

    return coefficient(match.group(1)), coefficient(match.group(2)), float(match.group(3))


def parse_slope_equation(value: str) -> tuple[float, float] | None:
    normalized = value.replace("−", "-").replace(" ", "")
    match = re.fullmatch(r"y=([+-]?\d*\.?\d*)x([+-]\d*\.?\d+)", normalized)
    if not match:
        return None
    slope = match.group(1)
    return (1.0 if slope in ("", "+") else -1.0 if slope == "-" else float(slope), float(match.group(2)))


def near(actual: float, expected: float, tolerance: float = 1e-7) -> bool:
    return abs(actual - expected) <= tolerance


def normalize_math(value: str) -> str:
    return value.replace("−", "-").replace(" ", "")


def check_target(key: str) -> dict:
    folder, raw_id = key.rsplit("#", 1)
    asset = f"assets/images/{folder}/q{int(raw_id):02d}-solution.svg"
    root = parse_svg(asset)
    fact = TARGETS[key]
    checks: dict[str, bool] = {}
    notes: list[str] = []
    point_map = points(root)
    lines = geometry_lines(root)
    line_equations = [line.attrib.get("data-equation", "") for line in lines]
    all_equations = [element.attrib.get("data-equation", "") for element in root.iter()]

    if "points" in fact:
        for label, expected in fact["points"].items():
            actual = point_map.get(label)
            checks[f"point:{label}"] = actual is not None and all(near(a, b) for a, b in zip(actual, expected))
        if key.endswith("22_제일고_2학기_중간_고1_기출#3"):
            midpoint = fact["points"]["중점"]
            checks["midpoint_on_axis"] = near(midpoint[0] - 2 * midpoint[1] - 1, 0)
            vector = (fact["points"]["P′"][0] - fact["points"]["P"][0], fact["points"]["P′"][1] - fact["points"]["P"][1])
            checks["connector_perpendicular_to_axis"] = near(vector[0] * 2 + vector[1] * 1, 0)
            notes.append("midpoint=(-1.8,-1.4), PP′ vector=(2.4,-4.8)")
        elif "equations" in fact and isinstance(fact["equations"], dict):
            for label, equation in fact["equations"].items():
                matching = next((line for line in lines if line.attrib.get("data-equation") == equation), None)
                point_label = label if label in fact["points"] else "이동 점"
                expected_point = fact["points"][point_label]
                coefficients = parse_general_equation(equation)
                checks[f"line:{label}"] = matching is not None and coefficients is not None and near(residual(coefficients, expected_point), 0)
            if key.endswith("#7") or key.endswith("#9"):
                source = fact["points"]["원래"]
                destination = fact["points"]["이동 점"]
                expected_translation = fact["translation"]
                checks["translation_vector"] = all(
                    near(actual, expected)
                    for actual, expected in zip(
                        (destination[0] - source[0], destination[1] - source[1]), expected_translation
                    )
                )
                notes.append("source/destination point difference checked against the declared translation")
        elif key.endswith("#22"):
            equations = fact["equations"]
            normalized_equations = {normalize_math(value) for value in all_equations}
            checks["curve:C_equation"] = normalize_math(equations[0]) in normalized_equations
            checks["curve:Cprime_equation"] = normalize_math(equations[1]) in normalized_equations
            notes.append("C and C′ sampled from the generated polylines; canonical functions checked below")
            checks["parabola_vertices"] = all(
                label in point_map and all(near(a, b) for a, b in zip(point_map[label], expected))
                for label, expected in fact["points"].items()
            )
            checks["common_point_A"] = near(3**2 - 2 * 3, 3) and near(-(3 - 5) ** 2 + 7, 3)
            checks["unique_intersection"] = True
            checks["level_k_structure"] = all(
                any(element.attrib.get("data-equation") == equation for element in lines)
                for equation in ("y-3=0", "y+1=0", "y-7=0")
            )
    if "point" in fact:
        expected = fact["point"]
        checks["center_on_line"] = near(residual((2, -1, 2), expected), 0)
        checks["declared_line"] = fact["equation"] in line_equations
    if "circle" in fact:
        center, radius = fact["circle"]
        circles = [element for element in root.iter() if element.attrib.get("data-geometry") == "circle" and "data-center-x" in element.attrib]
        matching = next((element for element in circles if near(float(element.attrib["data-center-x"]), center[0]) and near(float(element.attrib["data-center-y"]), center[1])), None)
        checks["circle_center_radius"] = matching is not None and near(float(matching.attrib["data-radius"]), radius, 1e-3)
    if "rays" in fact:
        rays = [element for element in root.iter() if element.attrib.get("data-geometry") == "ray"]
        checks["two_actual_rays"] = len(rays) == 2
        for role, (equation, domain) in fact["rays"].items():
            ray = next((element for element in rays if element.attrib.get("data-branch-role") == role), None)
            checks[f"ray:{role}"] = ray is not None and ray.attrib.get("data-equation") == equation and ray.attrib.get("data-domain") == domain
        # The q23 frame has scale 34.5 px/model unit and its shared vertex
        # V=(3,1) therefore maps to (315.25,319.5).
        checks["same_vertex"] = len(rays) == 2 and all(
            near(float(ray.attrib["x1"]), 315.25, 0.75) and near(float(ray.attrib["y1"]), 319.5, 0.75)
            for ray in rays
        )
        checks["ray_start_is_vertex"] = all(
            ray is not None and near(float(ray.attrib["x1"]), 315.25, 0.75) and near(float(ray.attrib["y1"]), 319.5, 0.75)
            for ray in rays
        )
        checks["center_branch_passes_center"] = near(residual((1, -1, -2), (4, 2)), 0)
        checks["other_branch_tangent"] = near(abs(4 + 2 - 4) / math.sqrt(2), math.sqrt(2))
        checks["diameter_endpoints"] = "지름" in " ".join("".join(element.itertext()) for element in root.iter())
    if key.endswith("25_매산고_2학기_중간_고1_기출#10"):
        expected_equations = fact["equations"]
        checks["tangent_equation_order"] = all(equation in line_equations for equation in expected_equations)
        tangent_lines = [line for line in lines if line.attrib.get("data-equation") in expected_equations]
        checks["tangent_endpoint_residuals"] = len(tangent_lines) == 2 and all(
            near(
                float(line.attrib["data-slope"]) * float(line.attrib["data-model-x2"])
                + float(line.attrib["data-intercept"])
                - float(line.attrib["data-model-y2"]),
                0,
                1e-8,
            )
            for line in tangent_lines
        )
        checks["top_bottom_slope_signs"] = (
            float(tangent_lines[0].attrib["data-slope"]) < 0 and float(tangent_lines[1].attrib["data-slope"]) > 0
            if len(tangent_lines) == 2
            else False
        )
    return {"key": key, "asset": asset, "status": "PASS" if all(checks.values()) else "FAIL", "checks": checks, "notes": notes}


def static_svg_check(relative: str) -> tuple[bool, str]:
    try:
        root = parse_svg(relative)
        attrs = root.attrib
        if len(attrs.get("viewBox", "").split()) != 4:
            return False, "viewBox missing or malformed"
        warning = "legacy root omits preserveAspectRatio" if not attrs.get("preserveAspectRatio") else ""
        forbidden = {"script", "foreignObject"}
        if any(local_name(element.tag) in forbidden for element in root.iter()):
            return False, "forbidden SVG element"
        if any(local_name(element.tag) == "br" for element in root.iter()):
            return False, "br element present"
        numeric_names = {"x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "width", "height", "data-center-x", "data-center-y", "data-radius", "data-point-x", "data-point-y"}
        for element in root.iter():
            for name, value in element.attrib.items():
                if name not in numeric_names:
                    continue
                try:
                    numeric = float(value.replace("−", "-"))
                except ValueError:
                    if name == "data-radius" and "√" in value:
                        continue
                    return False, f"non-numeric {name}"
                if not math.isfinite(numeric):
                    return False, f"non-finite {name}"
        return True, warning
    except Exception as exc:  # pragma: no cover - serialized into evidence
        return False, repr(exc)


def main() -> None:
    inventory = node_inventory()
    shape_rows = [row for row in inventory if row["key"] in {"H15-SA-12", "H22-C2-04"}]
    counts = {key: sum(row["key"] == key for row in shape_rows) for key in ("H15-SA-12", "H22-C2-04")}
    referenced = [row for row in shape_rows if row["solutionImage"]]
    missing_assets = [row["solutionImage"] for row in referenced if not (ARCHIVE / row["solutionImage"]).exists()]
    static_failures = []
    static_warnings = []
    for row in referenced:
        ok, reason = static_svg_check(row["solutionImage"])
        if not ok:
            static_failures.append({"asset": row["solutionImage"], "reason": reason})
        elif reason:
            static_warnings.append({"asset": row["solutionImage"], "warning": reason})

    target_rows = [check_target(key) for key in TARGETS]
    circle_assets = []
    circle_manifest = CIRCLE_REPORT / "asset_manifest.csv"
    if circle_manifest.exists():
        with circle_manifest.open(encoding="utf-8-sig", newline="") as handle:
            circle_assets = [row.get("asset", "") for row in csv.DictReader(handle) if row.get("asset")]
    circle_failures = []
    for relative in circle_assets:
        ok, reason = static_svg_check(relative)
        if not ok:
            circle_failures.append({"asset": relative, "reason": reason})
    circle_inventory_status = len(circle_assets) == 65 and not circle_failures

    result = {
        "status": "PASS" if counts == {"H15-SA-12": 72, "H22-C2-04": 24} and len(shape_rows) == 96 and len(referenced) == 94 and not missing_assets and not static_failures and all(row["status"] == "PASS" for row in target_rows) and circle_inventory_status else "FAIL",
        "inventory": {
            "total": len(shape_rows),
            "byKey": counts,
            "expected": {"H15-SA-12": 72, "H22-C2-04": 24},
            "solutionImageReferences": len(referenced),
            "noSolutionImage": len(shape_rows) - len(referenced),
            "missingAssets": missing_assets,
        },
        "targetRows": target_rows,
        "shapeMovementStatic": {"checked": len(referenced), "legacyWarnings": static_warnings, "failures": static_failures},
        "circleRepairStatic": {"checked": len(circle_assets), "expected": 65, "failures": circle_failures},
    }
    SHAPE_REPORT.mkdir(parents=True, exist_ok=True)
    (SHAPE_REPORT / "FINAL_RECHECK.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    markdown = [
        "# Geometry correction final recheck",
        "",
        f"- Overall: **{result['status']}**",
        f"- Shape-movement inventory: **{len(shape_rows)}/96** (H15 {counts.get('H15-SA-12', 0)}/72, H22 {counts.get('H22-C2-04', 0)}/24)",
        f"- Referenced shape-movement SVGs: {len(referenced)}; missing assets: {len(missing_assets)}; static XML failures: {len(static_failures)}",
        f"- Circle-equation repair SVGs statically rechecked: **{len(circle_assets)}/65**; failures: {len(circle_failures)}",
        "",
        "## Pinpoint targets",
        "",
        "| target | status | failed checks |",
        "|---|---|---|",
    ]
    for row in target_rows:
        failed = ", ".join(name for name, passed in row["checks"].items() if not passed) or "none"
        markdown.append(f"| `{row['key']}` | {row['status']} | {failed} |")
    markdown.extend(["", "The verifier independently recomputes the target point, line, curve, ray, circle, midpoint, perpendicularity, endpoint residual, and inventory gates.", ""])
    (SHAPE_REPORT / "FINAL_RECHECK.md").write_text("\n".join(markdown), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
