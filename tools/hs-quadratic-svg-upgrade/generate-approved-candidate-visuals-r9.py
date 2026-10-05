from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = REPORT / "39_approved_source_only_v1_expected_facts_r9.json"
OUT_ROOT = ROOT / "archive" / "_generated" / "hs-quadratic-svg-upgrade-20260908" / "candidate-r9" / "assets"
MANIFEST = REPORT / "40_approved_candidate_visual_manifest_r9.json"


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def fact_digest(fact: dict) -> str:
    return digest(json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def fmt(value: float) -> str:
    if abs(value) < 5e-10:
        value = 0.0
    return (f"{value:.6f}".rstrip("0").rstrip(".") or "0").replace("-", "−")


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def svg_shell(width: int, height: int, case_id: str, fact: dict, title: str, body: list[str]) -> str:
    style = """
    .bg{fill:#fff}.axis{stroke:#111;stroke-width:1.4;fill:none}.tick{stroke:#555;stroke-width:1}
    .curve{fill:none;stroke:#111;stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
    .curve2{fill:none;stroke:#4d6875;stroke-width:2.0;stroke-linejoin:round;stroke-linecap:round}
    .secondary{fill:none;stroke:#555;stroke-width:1.7}.guide{fill:none;stroke:#7a7a7a;stroke-width:1;stroke-dasharray:5 4}
    .level{fill:none;stroke:#728a54;stroke-width:1.2;stroke-dasharray:7 4}.highlight{fill:#eef5e9;stroke:#536d3f;stroke-width:1.5}
    .point{fill:#111;stroke:#111}.corner{fill:#fff;stroke:#111;stroke-width:1.8}.label,.annotation,.tick-label,.panel{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}
    .annotation{font-style:italic}.panel{font-size:14px}.small{font-size:12px}.arrow{fill:#111}.interval{stroke:#536d3f;stroke-width:8;stroke-linecap:round}
    .open{fill:#fff;stroke:#536d3f;stroke-width:3}.closed{fill:#536d3f;stroke:#536d3f;stroke-width:2}.box{fill:#f7f9fa;stroke:#aab5bb;stroke-width:1}
    """
    plot_width, plot_height, margin = width - 96, height - 96, 48
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" data-visual-case="{case_id}" data-fact-hash="{fact_digest(fact)}" data-visual-provenance="candidate_builder_python_v2">'
            f'<title>{esc(title)}</title><desc>{esc(title)}</desc><style>{style}</style><defs><clipPath id="plot-clip"><rect x="{margin}" y="{margin}" width="{plot_width}" height="{plot_height}"/></clipPath></defs>\n' + "\n".join(body) + "\n</svg>\n")


def chart_map(width: float, height: float, x_low: float, x_high: float, y_low: float, y_high: float, margin: float = 48.0):
    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    def ty(y: float) -> float:
        return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)

    return tx, ty


def add_axes(body: list[str], tx, ty, width: float, height: float, x_low: float, x_high: float, y_low: float, y_high: float, margin: float = 48.0):
    if y_low <= 0 <= y_high:
        y0 = ty(0)
        body.append(f'<line x1="{fmt(margin)}" y1="{fmt(y0)}" x2="{fmt(width-margin)}" y2="{fmt(y0)}" class="axis"/>')
        body.append(f'<path d="M {fmt(width-margin)} {fmt(y0)} l -8 -4 l 0 8 z" class="arrow"/>')
        body.append(f'<text x="{fmt(width-margin-4)}" y="{fmt(y0-8)}" text-anchor="end" class="tick-label">x</text>')
    if x_low <= 0 <= x_high:
        x0 = tx(0)
        body.append(f'<line x1="{fmt(x0)}" y1="{fmt(margin)}" x2="{fmt(x0)}" y2="{fmt(height-margin)}" class="axis"/>')
        body.append(f'<path d="M {fmt(x0)} {fmt(margin)} l -4 8 l 8 0 z" class="arrow"/>')
        body.append(f'<text x="{fmt(x0+8)}" y="{fmt(margin+10)}" class="tick-label">y</text>')
    for x in range(math.ceil(x_low), math.floor(x_high) + 1):
        if x == 0 or not (y_low <= 0 <= y_high):
            continue
        y0 = ty(0)
        body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(y0-4)}" x2="{fmt(tx(x))}" y2="{fmt(y0+4)}" class="tick"/>')
        body.append(f'<text x="{fmt(tx(x))}" y="{fmt(y0+20)}" text-anchor="middle" class="tick-label">{fmt(x)}</text>')
    for y in range(math.ceil(y_low), math.floor(y_high) + 1):
        if y == 0 or not (x_low <= 0 <= x_high) or y % 2:
            continue
        x0 = tx(0)
        body.append(f'<line x1="{fmt(x0-4)}" y1="{fmt(ty(y))}" x2="{fmt(x0+4)}" y2="{fmt(ty(y))}" class="tick"/>')
        body.append(f'<text x="{fmt(x0-9)}" y="{fmt(ty(y)+4)}" text-anchor="end" class="tick-label">{fmt(y)}</text>')


def polyline(body: list[str], tx, ty, fn, x_low: float, x_high: float, klass: str = "curve"):
    points = [f"{fmt(tx(x))},{fmt(ty(fn(x)))}" for x in [x_low + (x_high - x_low) * i / 480 for i in range(481)]]
    body.append(f'<polyline points="{" ".join(points)}" class="{klass}" clip-path="url(#plot-clip)"/>')


def q13(fact: dict) -> str:
    width, height = 760, 430
    tx, ty = chart_map(width, height, -4, 2, -8, 4)
    body = ['<rect x="0" y="0" width="760" height="430" class="bg"/>']
    add_axes(body, tx, ty, width, height, -4, 2, -8, 4)
    polyline(body, tx, ty, lambda x: x*x + 4*x - 2, -4, 2)
    body.append(f'<line x1="{fmt(tx(-4))}" y1="{fmt(ty(-11))}" x2="{fmt(tx(2))}" y2="{fmt(ty(1))}" class="secondary" clip-path="url(#plot-clip)"/>')
    x, y = -1, -5
    body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4.5" class="point"/>')
    body.append(f'<text x="{fmt(tx(x)+9)}" y="{fmt(ty(y)-10)}" class="label">접점 (−1,−5)</text>')
    body.append(f'<text x="{fmt(tx(-3.8))}" y="{fmt(ty(3.2))}" class="annotation">k=1 대표 그래프</text>')
    body.append(f'<text x="{fmt(tx(-3.8))}" y="{fmt(ty(2.5))}" class="annotation">직선 y=2x−3</text>')
    body.append('<rect x="520" y="48" width="205" height="112" rx="8" class="box"/>')
    body.append('<text x="536" y="76" class="panel">k≠0에서 Δ/4=0</text>')
    body.append('<text x="536" y="101" class="panel small">한 점에서 만남(접함)</text>')
    body.append('<text x="536" y="128" class="panel small">k=0은 두 그래프 일치</text>')
    body.append('<text x="48" y="28" class="annotation">조건 보강 후: k≠0인 매개변수 그래프</text>')
    return svg_shell(width, height, "hs-r9-geumdang-q13", fact, "k≠0에서 한 점에서 만나는 포물선과 직선", body)


def q17(fact: dict) -> str:
    width, height = 760, 360
    body = ['<rect x="0" y="0" width="760" height="360" class="bg"/>']
    x0, x1 = 70, 520
    y = 150
    def px(a: float) -> float:
        return x0 + (a / 5.0) * (x1 - x0)
    body.append(f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" class="axis"/>')
    body.append(f'<path d="M {x1} {y} l -9 -5 l 0 10 z" class="arrow"/>')
    body.append('<text x="528" y="155" class="tick-label">a</text>')
    for value in [0, 1, 4, 5]:
        x = px(value)
        body.append(f'<line x1="{fmt(x)}" y1="{y-8}" x2="{fmt(x)}" y2="{y+8}" class="tick"/>')
        body.append(f'<text x="{fmt(x)}" y="{y+31}" text-anchor="middle" class="tick-label">{value}</text>')
    body.append(f'<line x1="{fmt(px(1)+8)}" y1="{y}" x2="{fmt(px(4)-8)}" y2="{y}" class="interval"/>')
    body.append(f'<circle cx="{fmt(px(1))}" cy="{y}" r="7" class="open"/><circle cx="{fmt(px(4))}" cy="{y}" r="7" class="open"/>')
    body.append(f'<text x="{fmt((px(1)+px(4))/2)}" y="{y-23}" text-anchor="middle" class="annotation">정확히 3개</text>')
    body.append('<text x="70" y="72" class="annotation">정확히 세 교점의 매개변수 범위</text>')
    body.append('<text x="70" y="100" class="panel">1 &lt; a &lt; 4</text>')
    body.append('<text x="70" y="202" class="small label">a≤1 : 2개</text>')
    body.append('<text x="250" y="202" class="small label">1&lt;a&lt;4 : 3개</text>')
    body.append('<text x="430" y="202" class="small label">a=4 : 4개</text>')
    body.append('<text x="580" y="202" class="small label">a&gt;4 : 5개</text>')
    body.append('<rect x="70" y="240" width="580" height="76" rx="8" class="box"/>')
    body.append('<text x="90" y="268" class="panel">끝점 1, 4는 포함되지 않음</text>')
    body.append('<text x="90" y="294" class="panel">따라서 이 범위에는 최댓값이 없다.</text>')
    return svg_shell(width, height, "hs-r9-geumdang-q17", fact, "정확히 세 교점인 a의 범위", body)


def q19(fact: dict) -> str:
    width, height = 780, 480
    tx, ty = chart_map(width, height, -2, 6, -2, 8)
    body = ['<rect x="0" y="0" width="780" height="480" class="bg"/>']
    add_axes(body, tx, ty, width, height, -2, 6, -2, 8)
    polyline(body, tx, ty, lambda x: (x - 1) ** 2, -2, 6, "curve")
    polyline(body, tx, ty, lambda x: -(x - 2) ** 2 + 5, -2, 6, "curve2")
    body.append(f'<text x="{fmt(tx(4.35))}" y="{fmt(ty(7.1))}" class="annotation">y=(x−1)^2</text>')
    body.append(f'<text x="{fmt(tx(2.7))}" y="{fmt(ty(5.8))}" class="annotation">y=−(x−2)^2+5</text>')
    for level in [0, 1, 4, 5]:
        y = ty(level)
        body.append(f'<line x1="{fmt(tx(-1.85))}" y1="{fmt(y)}" x2="{fmt(tx(5.75))}" y2="{fmt(y)}" class="level"/>')
        body.append(f'<text x="{fmt(tx(-1.78))}" y="{fmt(y-7)}" class="small label">t={level}</text>')
    for x, y, label in [(0, 1, "공유점"), (3, 4, "공유점")]:
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4.5" class="point"/>')
        body.append(f'<text x="{fmt(tx(x)+8)}" y="{fmt(ty(y)-9)}" class="small label">{label} ({x},{y})</text>')
    body.append('<rect x="535" y="46" width="205" height="100" rx="8" class="box"/>')
    body.append('<text x="550" y="75" class="panel">3개의 서로 다른 점</text>')
    body.append('<text x="550" y="101" class="panel small">t = 0, 1, 4, 5</text>')
    body.append('<text x="550" y="127" class="panel small">합 = 10</text>')
    body.append('<text x="48" y="28" class="annotation">수평선 y=t와 두 포물선의 교점 수</text>')
    return svg_shell(width, height, "hs-r9-maesan-q19", fact, "수평선과 두 포물선의 서로 다른 교점", body)


def q9(fact: dict) -> str:
    width, height = 800, 500
    tx, ty = chart_map(width, height, -4, 4, -10, 4)
    body = ['<rect x="0" y="0" width="800" height="500" class="bg"/>']
    add_axes(body, tx, ty, width, height, -4, 4, -10, 4)
    polyline(body, tx, ty, lambda x: -x*x/3 + 3, -4, 4, "curve")
    polyline(body, tx, ty, lambda x: x*x - 9, -4, 4, "curve2")
    t = 0.75
    top = -t*t/3 + 3
    bottom = t*t - 9
    left, right = -t, t
    body.append(f'<rect x="{fmt(tx(left))}" y="{fmt(ty(top))}" width="{fmt(tx(right)-tx(left))}" height="{fmt(ty(bottom)-ty(top))}" class="highlight"/>')
    for x in [left, right]:
        body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(ty(bottom))}" x2="{fmt(tx(x))}" y2="{fmt(ty(top))}" class="secondary"/>')
    for x, y, label in [(right, top, "A"), (left, top, "B"), (left, bottom, "C"), (right, bottom, "D")]:
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4" class="corner"/>')
        body.append(f'<text x="{fmt(tx(x)+8)}" y="{fmt(ty(y)-8)}" class="label">{label}</text>')
    body.append(f'<line x1="{fmt(tx(0))}" y1="{fmt(ty(bottom)-18)}" x2="{fmt(tx(t))}" y2="{fmt(ty(bottom)-18)}" class="guide"/>')
    body.append(f'<text x="{fmt(tx(t/2))}" y="{fmt(ty(bottom)-25)}" text-anchor="middle" class="small label">t=3/4</text>')
    body.append(f'<text x="{fmt(tx(-3.7))}" y="{fmt(ty(2.9))}" class="annotation">위 y=−x²/3+3</text>')
    body.append(f'<text x="{fmt(tx(-3.7))}" y="{fmt(ty(-9.4))}" class="annotation">아래 y=x²−9</text>')
    body.append('<rect x="535" y="44" width="220" height="132" rx="8" class="box"/>')
    body.append('<text x="550" y="73" class="panel">너비 = 2t</text>')
    body.append('<text x="550" y="100" class="panel">높이 = 12−4t²/3</text>')
    body.append('<text x="550" y="127" class="panel small">P(t)=−8t²/3+4t+24</text>')
    body.append('<text x="550" y="153" class="panel small">t=3/4에서 최대</text>')
    body.append('<text x="48" y="28" class="annotation">두 포물선 사이 직사각형의 둘레</text>')
    return svg_shell(width, height, "hs-r9-palma-q9", fact, "두 포물선 사이 직사각형과 둘레의 최대", body)


def q15(fact: dict) -> str:
    width, height = 800, 640
    tx, ty = chart_map(width, height, -4.5, 4.5, -8, 50)
    body = ['<rect x="0" y="0" width="800" height="500" class="bg"/>']
    add_axes(body, tx, ty, width, height, -4.5, 4.5, -8, 50)
    fn = lambda x: 3 * (x + 3) * (x - 1) + 7
    polyline(body, tx, ty, fn, -4.5, 4.5, "curve")
    body.append(f'<line x1="{fmt(tx(-4.5))}" y1="{fmt(ty(7))}" x2="{fmt(tx(4.5))}" y2="{fmt(ty(7))}" class="secondary" clip-path="url(#plot-clip)"/>')
    body.append(f'<text x="{fmt(tx(3.1))}" y="{fmt(ty(7)-8)}" class="annotation">y=7</text>')
    for x in [-3, 1]:
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(7))}" r="4.5" class="point"/>')
        body.append(f'<text x="{fmt(tx(x)+7)}" y="{fmt(ty(7)-9)}" class="small label">({fmt(x)},7)</text>')
    for x in [-2, 2]:
        body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(ty(0))}" x2="{fmt(tx(x))}" y2="{fmt(ty(fn(x)))}" class="guide"/>')
        body.append(f'<text x="{fmt(tx(x))}" y="{fmt(ty(-3))}" text-anchor="middle" class="small label">{fmt(x)}</text>')
    for x, y, label in [(2, 22, "최대 (2,22)"), (3, 43, "(3,43)")]:
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4.5" class="point"/>')
        body.append(f'<text x="{fmt(tx(x)+8)}" y="{fmt(ty(y)-9)}" class="small label">{label}</text>')
    body.append('<rect x="535" y="480" width="220" height="100" rx="8" class="box"/>')
    body.append('<text x="550" y="507" class="panel small">f(x)=3(x+3)(x−1)+7</text>')
    body.append('<text x="550" y="534" class="panel small">−2≤x≤2에서 최대 22</text>')
    body.append('<text x="550" y="561" class="panel small">따라서 f(3)=43</text>')
    body.append('<text x="48" y="28" class="annotation">두 교점과 구간 최댓값으로 정해지는 이차함수</text>')
    return svg_shell(width, height, "hs-r9-palma-q15", fact, "이차함수의 그래프와 구간 최댓값", body)


def render(case_id: str, fact: dict) -> str:
    if case_id == "hs-r9-geumdang-q13":
        return q13(fact)
    if case_id == "hs-r9-geumdang-q17":
        return q17(fact)
    if case_id == "hs-r9-maesan-q19":
        return q19(fact)
    if case_id == "hs-r9-palma-q9":
        return q9(fact)
    if case_id == "hs-r9-palma-q15":
        return q15(fact)
    raise ValueError(case_id)


def main() -> None:
    data = json.loads(FACTS.read_text(encoding="utf-8"))
    rows = []
    for item in data["rows"]:
        school = item["sourceJsPath"].split("/")[-1].split("_")[1]
        if "금당고" in item["sourceJsPath"] and item["id"] == 13:
            case_id = "hs-r9-geumdang-q13"
        elif "금당고" in item["sourceJsPath"] and item["id"] == 17:
            case_id = "hs-r9-geumdang-q17"
        elif "매산여고" in item["sourceJsPath"] and item["id"] == 19:
            case_id = "hs-r9-maesan-q19"
        elif "팔마고" in item["sourceJsPath"] and item["id"] == 9:
            case_id = "hs-r9-palma-q9"
        elif "팔마고" in item["sourceJsPath"] and item["id"] == 15:
            case_id = "hs-r9-palma-q15"
        else:
            raise ValueError(f"unmapped row {item['questionUid']}")
        out = OUT_ROOT / f"{case_id}.svg"
        out.parent.mkdir(parents=True, exist_ok=True)
        svg = render(case_id, item["expectedFacts"])
        out.write_text(svg, encoding="utf-8", newline="\n")
        raw = out.read_bytes()
        rows.append({"questionUid": item["questionUid"], "caseId": case_id, "assetPath": out.relative_to(ROOT).as_posix(), "assetBytes": len(raw), "assetSha256": digest(raw), "factSha256": fact_digest(item["expectedFacts"]), "status": "CANDIDATE_GENERATED_NO_PASS"})
    output = {"schemaVersion": "HS_QUADRATIC_APPROVED_CANDIDATE_VISUAL_MANIFEST_R9", "status": "CANDIDATE_GENERATED_NO_PASS", "productionAuthorized": False, "v1Facts": FACTS.relative_to(ROOT).as_posix(), "rows": rows, "note": "Five newly generated candidate SVGs correspond to the approved source-repaired questions. They require artifact-only V2, V3 parity, actual desktop/mobile render review, and final audit."}
    MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "generated": len(rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
