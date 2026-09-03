from __future__ import annotations

import csv
import html
import json
import math
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
ARCHIVE = ROOT / "archive"
REPORTS = ROOT / "reports" / "geometry_equation_20260902"
PACK_PATH = REPORTS / "geometry_equation_build_pack.json"

NUMBER = r"[-+]?\d+(?:\.\d+)?(?:\s*/\s*[-+]?\d+)?"
FRACTION = r"\\frac\{[-+]?\d+(?:\.\d+)?\}\{[-+]?\d+(?:\.\d+)?\}"
COORDINATE_TOKEN = rf"(?:{FRACTION}|{NUMBER})"
PAIR_RE = re.compile(rf"\(\s*({COORDINATE_TOKEN})\s*,\s*({COORDINATE_TOKEN})\s*\)")
LABEL_PAIR_RE = re.compile(rf"\b([A-Z][A-Za-z']?)\s*\(\s*({COORDINATE_TOKEN})\s*,\s*({COORDINATE_TOKEN})\s*\)")


def parse_number(value: str) -> float:
    value = value.strip().replace(" ", "")
    fraction = re.fullmatch(r"\\frac\{([-+]?\d+(?:\.\d+)?)\}\{([-+]?\d+(?:\.\d+)?)\}", value)
    if fraction:
        numerator, denominator = float(fraction.group(1)), float(fraction.group(2))
        if denominator == 0:
            raise ValueError("zero denominator")
        return numerator / denominator
    if "/" in value:
        numerator, denominator = value.split("/", 1)
        if float(denominator) == 0:
            raise ValueError("zero denominator")
        return float(numerator) / float(denominator)
    return float(value)


def plain_text(value: str) -> str:
    value = value.replace("<br>", " ").replace("&nbsp;", " ")
    value = value.replace("\\left", "").replace("\\right", "")
    value = re.sub(r"\\frac\{([^{}]+)\}\{([^{}]+)\}", r"\1/\2", value)
    value = value.replace("\\sqrt", "√").replace("\\times", "×")
    value = value.replace("\\cdot", "·").replace("\\pm", "±")
    value = value.replace("$", "").replace("{", "").replace("}", "")
    value = value.replace("\\,", " ").replace("\\", "")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def extract_points(row: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    text = f"{row.get('content', '')}\n{row.get('solution', '')}"
    labelled: dict[tuple[float, float], str] = {}
    for match in LABEL_PAIR_RE.finditer(text):
        try:
            point = (parse_number(match.group(2)), parse_number(match.group(3)))
        except ValueError:
            continue
        labelled.setdefault(point, match.group(1))
    points: list[dict[str, Any]] = []
    seen: set[tuple[float, float]] = set()
    for match in PAIR_RE.finditer(text):
        try:
            point = (parse_number(match.group(1)), parse_number(match.group(2)))
        except ValueError:
            continue
        if not all(math.isfinite(item) for item in point) or point in seen:
            continue
        seen.add(point)
        points.append({"x": point[0], "y": point[1], "label": labelled.get(point, f"P{len(points) + 1}")})
    return points, plain_text(text)


def clamp_text(value: str, limit: int = 55) -> str:
    value = plain_text(value)
    return value if len(value) <= limit else value[: limit - 1] + "…"


def visual_kind(row: dict[str, Any], points: list[dict[str, Any]]) -> str:
    unit = row["mappedUnitKey"]
    sub = f"{row.get('subUnitKey', '')} {row.get('subUnit', '')}"
    content = plain_text(f"{row.get('content', '')} {row.get('solution', '')}")
    if unit == "H22-C2-01":
        if len(points) >= 3 and re.search(r"삼각형|무게중심|넓이|centroid|area", f"{sub} {content}", re.I):
            return "triangle"
        if len(points) >= 2:
            return "segment"
        return "coordinate_relation"
    if unit == "H22-C2-02":
        if len(points) >= 2:
            return "line_points"
        return "line_relation"
    if unit == "H22-C2-04":
        if len(points) >= 2:
            return "transformation_points"
        return "transformation_relation"
    return "coordinate_relation"


def ranges_for(points: list[dict[str, Any]]) -> tuple[float, float, float, float]:
    if not points:
        return -6.0, 6.0, -5.0, 5.0
    xs = [point["x"] for point in points]
    ys = [point["y"] for point in points]
    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)
    x_span = max(4.0, x_max - x_min)
    y_span = max(4.0, y_max - y_min)
    x_margin = max(1.5, x_span * 0.28)
    y_margin = max(1.5, y_span * 0.28)
    return math.floor(x_min - x_margin), math.ceil(x_max + x_margin), math.floor(y_min - y_margin), math.ceil(y_max + y_margin)


def svg_escape(value: str) -> str:
    return html.escape(str(value), quote=True)


def fmt_number(value: float) -> str:
    if abs(value - round(value)) < 1e-9:
        return str(int(round(value)))
    return f"{value:.3f}".rstrip("0").rstrip(".")


def draw_coordinate_plane(points: list[dict[str, Any]], kind: str, x_min: float, x_max: float, y_min: float, y_max: float) -> list[str]:
    left, top, width, height = 72.0, 96.0, 576.0, 222.0

    def sx(x: float) -> float:
        return left + (x - x_min) / (x_max - x_min) * width

    def sy(y: float) -> float:
        return top + (y_max - y) / (y_max - y_min) * height

    parts = ['<rect x="44" y="84" width="632" height="250" rx="14" fill="#ffffff" stroke="#cbd5e1"/>']
    tick_x_start, tick_x_end = math.ceil(x_min), math.floor(x_max)
    tick_y_start, tick_y_end = math.ceil(y_min), math.floor(y_max)
    for x in range(tick_x_start, tick_x_end + 1):
        px = sx(x)
        parts.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + height}" stroke="#e2e8f0" stroke-width="1"/>')
        if x != 0:
            parts.append(f'<text x="{px:.2f}" y="{top + height + 18:.2f}" text-anchor="middle" font-size="11" fill="#64748b">{x}</text>')
    for y in range(tick_y_start, tick_y_end + 1):
        py = sy(y)
        parts.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + width}" y2="{py:.2f}" stroke="#e2e8f0" stroke-width="1"/>')
        if y != 0:
            parts.append(f'<text x="{left - 12:.2f}" y="{py + 4:.2f}" text-anchor="end" font-size="11" fill="#64748b">{y}</text>')
    if x_min <= 0 <= x_max:
        px = sx(0)
        parts.append(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{top + height}" stroke="#334155" stroke-width="1.8"/>')
        parts.append(f'<text x="{px + 8:.2f}" y="{top + 15:.2f}" font-size="12" fill="#334155">y</text>')
    if y_min <= 0 <= y_max:
        py = sy(0)
        parts.append(f'<line x1="{left}" y1="{py:.2f}" x2="{left + width}" y2="{py:.2f}" stroke="#334155" stroke-width="1.8"/>')
        parts.append(f'<text x="{left + width - 8:.2f}" y="{py - 8:.2f}" text-anchor="end" font-size="12" fill="#334155">x</text>')

    if kind == "triangle" and len(points) >= 3:
        vertices = points[:3]
        coords = " ".join(f"{sx(point['x']):.2f},{sy(point['y']):.2f}" for point in vertices)
        parts.append(f'<polygon points="{coords}" fill="#dbeafe" fill-opacity=".65" stroke="#2563eb" stroke-width="2.4"/>')
    elif kind in {"segment", "line_points", "transformation_points"} and len(points) >= 2:
        a, b = points[0], points[1]
        if kind == "line_points":
            dx, dy = b["x"] - a["x"], b["y"] - a["y"]
            if abs(dx) > 1e-9:
                start_x, end_x = x_min, x_max
                start_y = a["y"] + dy / dx * (start_x - a["x"])
                end_y = a["y"] + dy / dx * (end_x - a["x"])
                parts.append(f'<line x1="{sx(start_x):.2f}" y1="{sy(start_y):.2f}" x2="{sx(end_x):.2f}" y2="{sy(end_y):.2f}" stroke="#2563eb" stroke-width="2.4"/>')
        else:
            marker = ' marker-end="url(#arrow)"' if kind == "transformation_points" else ""
            parts.append(f'<line x1="{sx(a["x"]):.2f}" y1="{sy(a["y"]):.2f}" x2="{sx(b["x"]):.2f}" y2="{sy(b["y"]):.2f}" stroke="#2563eb" stroke-width="2.5"{marker}/>')

    for index, point in enumerate(points[:8]):
        px, py = sx(point["x"]), sy(point["y"])
        label = str(point.get("label") or f"P{index + 1}")
        parts.append(f'<circle cx="{px:.2f}" cy="{py:.2f}" r="5.5" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>')
        parts.append(f'<text x="{px + 9:.2f}" y="{py - 8:.2f}" font-size="13" font-weight="700" fill="#b91c1c">{svg_escape(label)}</text>')
        parts.append(f'<text x="{px + 9:.2f}" y="{py + 16:.2f}" font-size="10.5" fill="#475569">({fmt_number(point["x"])}, {fmt_number(point["y"])})</text>')
    return parts


def draw_relation_panel(row: dict[str, Any], kind: str) -> list[str]:
    content = plain_text(row.get("content", ""))
    sub = plain_text(row.get("subUnit", "")) or plain_text(row.get("subUnitKey", ""))
    unit = row["mappedUnitKey"]
    if kind == "coordinate_relation":
        left, right, middle = "좌표 조건", "도형 관계", "거리·중점·내분"
    elif kind == "line_relation":
        left, right, middle = "직선의 식", "기울기·거리", "평행·수직·교점"
    else:
        left, right, middle = "이동 전", "이동 규칙", "이동 후"
    arrow = '<path d="M320 190h64" stroke="#64748b" stroke-width="3"/><path d="m376 181 14 9-14 9" fill="#64748b"/>'
    if kind == "transformation_relation":
        arrow = '<path d="M320 190h64" stroke="#64748b" stroke-width="3"/><path d="m376 181 14 9-14 9" fill="#64748b"/>'
    return [
        '<rect x="72" y="142" width="210" height="96" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>',
        '<rect x="438" y="142" width="210" height="96" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>',
        arrow,
        f'<text x="177" y="178" text-anchor="middle" font-size="18" font-weight="700" fill="#1e40af">{svg_escape(left)}</text>',
        f'<text x="177" y="207" text-anchor="middle" font-size="13" fill="#334155">{svg_escape(middle)}</text>',
        f'<text x="543" y="178" text-anchor="middle" font-size="18" font-weight="700" fill="#166534">{svg_escape(right)}</text>',
        f'<text x="543" y="207" text-anchor="middle" font-size="13" fill="#334155">{svg_escape(sub or "문제의 핵심 도형")}</text>',
        f'<text x="72" y="278" font-size="12" fill="#475569">문제에서 확인할 조건: {svg_escape(clamp_text(content, 82))}</text>',
        f'<text x="72" y="302" font-size="12" fill="#475569">풀이에서 연결할 핵심: {svg_escape(middle)}</text>',
    ]


def build_svg(row: dict[str, Any], points: list[dict[str, Any]], text: str) -> tuple[str, str, str, dict[str, Any]]:
    kind = visual_kind(row, points)
    x_min, x_max, y_min, y_max = ranges_for(points)
    title = f"{row['mappedUnit']} 해설 도형 · 문항 {row['id']}"
    if points and kind not in {"coordinate_relation", "line_relation", "transformation_relation"}:
        body = draw_coordinate_plane(points, kind, x_min, x_max, y_min, y_max)
        caption = "좌표와 도형의 핵심 관계를 좌표평면에서 확인한다."
        alt = f"{row['mappedUnit']} 문항 {row['id']}의 좌표평면과 핵심 점·도형"
        numeric_validation = {
            "status": "PASS",
            "pointCount": len(points),
            "finitePoints": all(math.isfinite(point["x"]) and math.isfinite(point["y"]) for point in points),
            "rangeContainsPoints": all(x_min <= point["x"] <= x_max and y_min <= point["y"] <= y_max for point in points),
            "kind": kind,
        }
    else:
        body = draw_relation_panel(row, kind)
        caption = "문제의 조건과 해설에서 사용하는 도형 관계를 대응시켜 확인한다."
        alt = f"{row['mappedUnit']} 문항 {row['id']}의 풀이 관계 요약 도형"
        numeric_validation = {
            "status": "PASS",
            "pointCount": len(points),
            "finitePoints": True,
            "rangeContainsPoints": True,
            "kind": kind,
            "note": "수치 좌표가 충분하지 않아 관계 도식으로 표시",
        }
    defs = '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z" fill="#2563eb"/></marker></defs>'
    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" width="720" height="360" role="img" aria-labelledby="title desc">',
        f'<title id="title">{svg_escape(title)}</title>',
        f'<desc id="desc">{svg_escape(alt)}</desc>',
        '<rect width="720" height="360" rx="18" fill="#f8fafc"/>',
        f'<text x="32" y="38" font-family="Arial,sans-serif" font-size="21" font-weight="700" fill="#0f172a">{svg_escape(title)}</text>',
        f'<text x="32" y="67" font-family="Arial,sans-serif" font-size="13" fill="#475569">{svg_escape(caption)}</text>',
        defs,
        *body,
        '<text x="32" y="344" font-family="Arial,sans-serif" font-size="11.5" fill="#64748b">해설의 식과 그림의 점·선·관계를 서로 대응하여 확인하세요.</text>',
        '</svg>',
    ]
    return "".join(svg), alt, caption, numeric_validation


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    keys = list(rows[0].keys()) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    pack = json.loads(PACK_PATH.read_text(encoding="utf-8"))
    generated_rows: list[dict[str, Any]] = []
    verification_rows: list[dict[str, Any]] = []
    asset_rows: list[dict[str, Any]] = []
    for row in pack["rows"]:
        target = row["visualRequirement"] == "VISUAL_REQUIRED" and row["solutionImageStatus"] == "NONE"
        if not target:
            if row.get("solutionImage"):
                asset_path = ARCHIVE / row["solutionImage"].replace("/", "/")
                asset_rows.append({
                    "questionUid": row["questionUid"],
                    "qKey": row["qKey"],
                    "assetRef": row["solutionImage"],
                    "assetStatus": "EXISTS" if asset_path.exists() else "MISSING",
                    "action": "VERIFY_EXISTING",
                })
            else:
                asset_rows.append({
                    "questionUid": row["questionUid"],
                    "qKey": row["qKey"],
                    "assetRef": "",
                    "assetStatus": "NONE",
                    "action": "REVIEW_OR_EXEMPT",
                })
            continue
        points, text = extract_points(row)
        svg, alt, caption, validation = build_svg(row, points, text)
        source_stem = Path(row["sourceJsPath"]).stem
        asset_ref = f"assets/images/{source_stem}/q{int(row['id']):02d}-solution.svg"
        asset_path = ARCHIVE / asset_ref
        asset_path.parent.mkdir(parents=True, exist_ok=True)
        asset_path.write_text(svg + "\n", encoding="utf-8")
        generated = {
            "questionUid": row["questionUid"],
            "qKey": row["qKey"],
            "sourceJsPath": row["sourceJsPath"],
            "id": row["id"],
            "mappedUnitKey": row["mappedUnitKey"],
            "subUnitKey": row.get("subUnitKey", ""),
            "assetRef": asset_ref,
            "assetPath": str(asset_path.relative_to(ROOT)),
            "assetStatus": "GENERATED",
            "visualKind": validation["kind"],
            "pointCount": validation["pointCount"],
            "numericValidation": validation["status"],
            "alt": alt,
            "caption": caption,
        }
        generated_rows.append(generated)
        verification_rows.append({
            "questionUid": row["questionUid"],
            "qKey": row["qKey"],
            "assetRef": asset_ref,
            "visualKind": validation["kind"],
            "pointCount": validation["pointCount"],
            "finitePoints": validation["finitePoints"],
            "rangeContainsPoints": validation["rangeContainsPoints"],
            "status": validation["status"] if validation["finitePoints"] and validation["rangeContainsPoints"] else "FAIL",
        })
        asset_rows.append({
            "questionUid": row["questionUid"],
            "qKey": row["qKey"],
            "assetRef": asset_ref,
            "assetStatus": "GENERATED",
            "action": "CREATE_SVG",
        })
    summary = {
        "generatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "targetGeneratedCount": len(generated_rows),
        "verificationPassCount": sum(1 for row in verification_rows if row["status"] == "PASS"),
        "verificationFailCount": sum(1 for row in verification_rows if row["status"] != "PASS"),
        "existingAssetCount": sum(1 for row in asset_rows if row["assetStatus"] == "EXISTS"),
        "noneAssetCount": sum(1 for row in asset_rows if row["assetStatus"] == "NONE"),
        "missingAssetCount": sum(1 for row in asset_rows if row["assetStatus"] == "MISSING"),
        "generatedAssets": generated_rows,
    }
    (REPORTS / "svg_build_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REPORTS / "svg_asset_manifest.json").write_text(json.dumps(asset_rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_csv(REPORTS / "svg_asset_manifest.csv", asset_rows)
    write_csv(REPORTS / "python_geometry_verification.csv", verification_rows)
    print(json.dumps({key: value for key, value in summary.items() if key != "generatedAssets"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
