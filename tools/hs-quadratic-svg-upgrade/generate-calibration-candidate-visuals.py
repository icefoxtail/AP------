from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FACTS = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908" / "01_calibration_v1_source_only.json"
OUT_ROOT = ROOT / "archive" / "_generated" / "hs-quadratic-svg-upgrade-20260908" / "candidate-r3"
MANIFEST = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908" / "04_calibration_candidate_manifest_r3.json"


def sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def fact_hash(fact: dict) -> str:
    payload = json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256(payload)


def fmt(value: float) -> str:
    if abs(value) < 5e-10:
        value = 0.0
    text = f"{value:.6f}".rstrip("0").rstrip(".") or "0"
    return text.replace("-", "−")


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def nice_ticks(low: float, high: float) -> list[float]:
    span = high - low
    step = 1.0 if span <= 10 else 2.0 if span <= 20 else 5.0
    first = math.ceil((low - 1e-9) / step) * step
    values = []
    value = first
    while value <= high + 1e-9 and len(values) < 25:
        values.append(0.0 if abs(value) < 1e-9 else value)
        value += step
    return values


def frame(width: int, height: int, x_low: float, x_high: float, y_low: float, y_high: float):
    margin = 48.0

    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    def ty(y: float) -> float:
        return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)

    body = [f'<rect x="0" y="0" width="{width}" height="{height}" fill="#fff"/>']
    if x_low <= 0 <= x_high:
        x0 = tx(0)
        body.append(f'<line x1="{fmt(x0)}" y1="{fmt(margin)}" x2="{fmt(x0)}" y2="{fmt(height-margin)}" class="axis"/>')
    if y_low <= 0 <= y_high:
        y0 = ty(0)
        body.append(f'<line x1="{fmt(margin)}" y1="{fmt(y0)}" x2="{fmt(width-margin)}" y2="{fmt(y0)}" class="axis"/>')
    if y_low <= 0 <= y_high:
        y0 = ty(0)
        body.append(f'<path d="M {fmt(width-margin)} {fmt(y0)} l -8 -4 l 0 8 z" class="arrow"/>')
    for tick in nice_ticks(x_low, x_high):
        if abs(tick) < 1e-9 and x_low <= 0 <= x_high:
            continue
        x = tx(tick)
        y0 = ty(0) if y_low <= 0 <= y_high else height - margin
        body.append(f'<line x1="{fmt(x)}" y1="{fmt(y0-4)}" x2="{fmt(x)}" y2="{fmt(y0+4)}" class="tick"/>')
        body.append(f'<text x="{fmt(x)}" y="{fmt(y0+20)}" text-anchor="middle" class="tick-label">{fmt(tick)}</text>')
    for tick in nice_ticks(y_low, y_high):
        if abs(tick) < 1e-9 and y_low <= 0 <= y_high:
            continue
        y = ty(tick)
        x0 = tx(0) if x_low <= 0 <= x_high else margin
        body.append(f'<line x1="{fmt(x0-4)}" y1="{fmt(y)}" x2="{fmt(x0+4)}" y2="{fmt(y)}" class="tick"/>')
        body.append(f'<text x="{fmt(x0-8)}" y="{fmt(y+4)}" text-anchor="end" class="tick-label">{fmt(tick)}</text>')
    body.append(f'<text x="{fmt(width-22)}" y="{fmt(ty(0)-8 if y_low <= 0 <= y_high else height-margin)}" class="axis-label">x</text>')
    if x_low <= 0 <= x_high:
        body.append(f'<text x="{fmt(tx(0)+8)}" y="{fmt(margin+6)}" class="axis-label">y</text>')
    return tx, ty, body


def polyline(tx, ty, fn, low: float, high: float, count: int = 401) -> str:
    points = []
    for index in range(count):
        x = low + (high - low) * index / (count - 1)
        y = fn(x)
        points.append(f"{fmt(tx(x))},{fmt(ty(y))}")
    return f'<polyline points="{" ".join(points)}" class="curve"/>'


def svg_root(case_id: str, fact: dict, title: str, desc: str, body: list[str], width: int, height: int) -> str:
    digest = fact_hash(fact)
    style = (
        ".axis{stroke:#111;stroke-width:1.4;fill:none}.tick{stroke:#555;stroke-width:1}"
        ".curve{fill:none;stroke:#111;stroke-width:2.1;stroke-linejoin:round;stroke-linecap:round}"
        ".secondary{fill:none;stroke:#555;stroke-width:1.7;stroke-linejoin:round}"
        ".guide{fill:none;stroke:#777;stroke-width:0.95;stroke-dasharray:5 4}"
        ".point{fill:#111;stroke:#111;stroke-width:1}.open{fill:#fff;stroke:#111;stroke-width:1.5}"
        ".shade{stroke:#555;stroke-width:10;stroke-linecap:butt}.tick-label{font:11px 'Malgun Gothic','Noto Sans KR',sans-serif;fill:#111}"
        ".axis-label,.label,.annotation{font:13px 'Malgun Gothic','Noto Sans KR',sans-serif;fill:#111}"
        ".annotation{font-style:italic}.arrow{fill:#111}"
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" '
        'preserveAspectRatio="xMidYMid meet" role="img" '
        f'data-visual-case="{esc(case_id)}" data-fact-hash="{digest}" data-visual-provenance="candidate_builder_python_v1">\n'
        f'<title>{esc(title)}</title><desc>{esc(desc)}</desc><style>{style}</style>\n'
        + "\n".join(body)
        + "\n</svg>\n"
    )


def cartesian_svg(case_id: str, expected: dict) -> tuple[str, dict]:
    if case_id == "hs-q20-parabola-intersection":
        width, height, x_low, x_high, y_low, y_high = 620, 380, 0.5, 4.5, -1, 9
        tx, ty, body = frame(width, height, x_low, x_high, y_low, y_high)
        f = lambda x: -x * x + 6 * x - 1
        g = lambda x: x + 3
        body.extend([
            polyline(tx, ty, f, x_low, x_high),
            f'<line x1="{fmt(tx(x_low))}" y1="{fmt(ty(g(x_low)))}" x2="{fmt(tx(x_high))}" y2="{fmt(ty(g(x_high)))}" class="secondary"/>',
            f'<line x1="{fmt(tx(3))}" y1="{fmt(ty(y_low))}" x2="{fmt(tx(3))}" y2="{fmt(ty(y_high))}" class="guide"/>',
            f'<circle cx="{fmt(tx(1))}" cy="{fmt(ty(4))}" r="3.5" class="point"/><text x="{fmt(tx(1)+7)}" y="{fmt(ty(4)-7)}" class="label">P</text>',
            f'<circle cx="{fmt(tx(4))}" cy="{fmt(ty(7))}" r="3.5" class="point"/><text x="{fmt(tx(4)-18)}" y="{fmt(ty(7)-7)}" class="label">Q</text>',
            f'<circle cx="{fmt(tx(3))}" cy="{fmt(ty(8))}" r="3.5" class="point"/><text x="{fmt(tx(3)+7)}" y="{fmt(ty(8)-7)}" class="label">V</text>',
            f'<text x="{fmt(tx(1.8))}" y="{fmt(ty(8.5))}" class="annotation">f(x)</text>',
            f'<text x="{fmt(tx(3.7))}" y="{fmt(ty(6.8))}" class="annotation">y=x＋3</text>',
        ])
        return svg_root(case_id, expected, "이차함수와 직선의 교점", "축과 두 교점, 구간의 끝점을 계산한 후보 그래프", body, width, height), {"kind": "cartesian", "curveBranches": 1, "sampleCount": 401}
    if case_id == "hs-q22-parabola-domain":
        width, height, x_low, x_high, y_low, y_high = 620, 300, 0.5, 4.8, 12, 24
        tx, ty, body = frame(width, height, x_low, x_high, y_low, y_high)
        f = lambda x: (x - 4) * (x - 4) + 13
        body.extend([
            polyline(tx, ty, f, 1, 3),
            f'<line x1="{fmt(tx(4))}" y1="{fmt(ty(y_low))}" x2="{fmt(tx(4))}" y2="{fmt(ty(y_high))}" class="guide"/>',
            f'<line x1="{fmt(tx(1))}" y1="{fmt(ty(y_low))}" x2="{fmt(tx(1))}" y2="{fmt(ty(22))}" class="guide"/>',
            f'<line x1="{fmt(tx(3))}" y1="{fmt(ty(y_low))}" x2="{fmt(tx(3))}" y2="{fmt(ty(14))}" class="guide"/>',
            f'<circle cx="{fmt(tx(1))}" cy="{fmt(ty(22))}" r="3.5" class="point"/><text x="{fmt(tx(1)+7)}" y="{fmt(ty(22)-7)}" class="label">A</text>',
            f'<circle cx="{fmt(tx(3))}" cy="{fmt(ty(14))}" r="3.5" class="point"/><text x="{fmt(tx(3)+7)}" y="{fmt(ty(14)-7)}" class="label">B</text>',
            f'<text x="{fmt(tx(1.2))}" y="{fmt(ty(23.2))}" class="annotation">x=1</text>',
            f'<text x="{fmt(tx(2.7))}" y="{fmt(ty(13.0))}" class="annotation">x=3</text>',
            f'<text x="{fmt(tx(4)+7)}" y="{fmt(ty(22.5))}" class="annotation">축 x=4</text>',
        ])
        return svg_root(case_id, expected, "구간에서의 이차함수", "정의역 구간과 축의 위치를 나타낸 후보 그래프", body, width, height), {"kind": "cartesian", "curveBranches": 1, "sampleCount": 401}
    width, height, x_low, x_high, y_low, y_high = 620, 360, -2, 4, 0, 18
    tx, ty, body = frame(width, height, x_low, x_high, y_low, y_high)
    f = lambda x: x * x - 2 * x + 10
    body.extend([
        polyline(tx, ty, f, x_low, x_high),
        f'<circle cx="{fmt(tx(1))}" cy="{fmt(ty(9))}" r="3.5" class="point"/>',
        f'<text x="{fmt(tx(1)+7)}" y="{fmt(ty(9)-7)}" class="label">V</text>',
        f'<text x="{fmt(tx(1.7))}" y="{fmt(ty(12.7))}" class="annotation">y=(x−1)²＋9</text>',
        f'<text x="{fmt(tx(-1.8))}" y="{fmt(ty(1.2))}" class="annotation">x축과 만나지 않음</text>',
    ])
    return svg_root(case_id, expected, "이차함수의 최솟값", "꼭짓점과 x축의 상대 위치를 나타낸 후보 그래프", body, width, height), {"kind": "cartesian", "curveBranches": 1, "sampleCount": 401}


def number_line_svg(case_id: str, expected: dict) -> tuple[str, dict]:
    width, height = 620, 180
    x_low, x_high = (-1, 5) if case_id == "hs-q2-absolute-inequality-number-line" else (-3, 4)
    margin = 56.0
    axis_y = 94.0

    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    interval = expected["expectedFacts"]["inequalityInterval"]
    low, high = interval["left"], interval["right"]
    body = [
        '<rect x="0" y="0" width="620" height="180" fill="#fff"/>',
        f'<line x1="{fmt(margin-12)}" y1="{fmt(axis_y)}" x2="{fmt(width-margin+12)}" y2="{fmt(axis_y)}" class="axis"/>',
        f'<path d="M {fmt(margin-12)} {fmt(axis_y)} l 8 -5 l 0 10 z M {fmt(width-margin+12)} {fmt(axis_y)} l -8 -5 l 0 10 z" class="arrow"/>',
    ]
    for tick in range(math.ceil(x_low), math.floor(x_high) + 1):
        x = tx(tick)
        body.append(f'<line x1="{fmt(x)}" y1="{fmt(axis_y-6)}" x2="{fmt(x)}" y2="{fmt(axis_y+6)}" class="tick"/>')
        body.append(f'<text x="{fmt(x)}" y="{fmt(axis_y+25)}" text-anchor="middle" class="tick-label">{fmt(tick)}</text>')
    body.extend([
        f'<line x1="{fmt(tx(low))}" y1="{fmt(axis_y)}" x2="{fmt(tx(high))}" y2="{fmt(axis_y)}" class="shade"/>',
        f'<circle cx="{fmt(tx(low))}" cy="{fmt(axis_y)}" r="6" class="open"/>',
        f'<circle cx="{fmt(tx(high))}" cy="{fmt(axis_y)}" r="6" class="open"/>',
        f'<text x="{fmt(tx(low))}" y="{fmt(axis_y-18)}" text-anchor="middle" class="annotation">{fmt(low)}</text>',
        f'<text x="{fmt(tx(high))}" y="{fmt(axis_y-18)}" text-anchor="middle" class="annotation">{fmt(high)}</text>',
    ])
    for point in expected["expectedFacts"].get("naturalNumberSolutions", []):
        x = tx(point)
        body.append(f'<circle cx="{fmt(x)}" cy="{fmt(axis_y)}" r="3.5" class="point"/>')
        body.append(f'<text x="{fmt(x)}" y="{fmt(axis_y-30)}" text-anchor="middle" class="label">{fmt(point)}</text>')
    caption = "0＜x＜4, 자연수 해" if case_id == "hs-q2-absolute-inequality-number-line" else "−1＜x＜2"
    body.append(f'<text x="{fmt(margin)}" y="28" class="annotation">{esc(caption)}</text>')
    return svg_root(case_id, expected, "부등식의 해집합 수직선", "열린 끝점을 포함한 해집합 후보 수직선", body, width, height), {"kind": "number-line", "interval": [low, high], "endpointStyle": "open"}


def main() -> None:
    payload = json.loads(FACTS.read_text(encoding="utf-8"))
    rows = []
    for question in payload["questions"]:
        case_id = question["questionUid"].split("|")[-2].replace("/", "-") + f"-q{question['id']}"
        # Keep stable, readable case ids independent of filesystem encoding.
        if question["id"] == 20 and "금당고" in question["sourceJsPath"]:
            case_id = "hs-q20-parabola-intersection"
        elif question["id"] == 22:
            case_id = "hs-q22-parabola-domain"
        elif question["id"] == 5:
            case_id = "hs-q5-parabola-minimum"
        elif question["id"] == 2:
            case_id = "hs-q2-absolute-inequality-number-line"
        else:
            case_id = "hs-q4-compound-inequality-number-line"
        if question["expectedVisualType"] == "cartesian":
            svg, stats = cartesian_svg(case_id, question)
            name = f"{case_id}.svg"
        else:
            svg, stats = number_line_svg(case_id, question)
            name = f"{case_id}.svg"
        output_path = OUT_ROOT / "assets" / name
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(svg, encoding="utf-8", newline="\n")
        raw = output_path.read_bytes()
        rows.append({
            "questionUid": question["questionUid"],
            "caseId": case_id,
            "assetPath": output_path.relative_to(ROOT).as_posix(),
            "assetBytes": len(raw),
            "assetSha256": sha256(raw),
            "factSha256": fact_hash(question["expectedFacts"]),
            "visualType": question["expectedVisualType"],
            "stats": stats,
            "status": "CANDIDATE_GENERATED_NO_PASS",
        })
    output = {
        "schemaVersion": "HS_QUADRATIC_CANDIDATE_VISUAL_MANIFEST_V1",
        "status": "CANDIDATE_GENERATED_NO_PASS",
        "generator": "tools/hs-quadratic-svg-upgrade/generate-calibration-candidate-visuals.py",
        "sourceFacts": FACTS.relative_to(ROOT).as_posix(),
        "productionAuthorized": False,
        "rows": rows,
        "note": "Candidate SVGs are not V1/V2/V3 PASS evidence. Independent artifact-only extraction and parity remain required.",
    }
    MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
