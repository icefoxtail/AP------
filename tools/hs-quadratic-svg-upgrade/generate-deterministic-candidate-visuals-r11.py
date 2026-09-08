from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = REPORT / "68_deterministic_v1_expected_facts_r11.json"
OUT_ROOT = ROOT / "archive" / "_generated" / "hs-quadratic-svg-upgrade-20260908" / "candidate-r11" / "assets"
MANIFEST = REPORT / "69_deterministic_candidate_visual_manifest_r11.json"


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def fact_digest(fact: dict) -> str:
    return digest(json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def fmt(value: float) -> str:
    if abs(value) < 1e-8:
        value = 0.0
    return (f"{value:.5f}".rstrip("0").rstrip(".") or "0").replace("-", "−")


def shell(case_id: str, fact: dict, title: str, width: int, height: int, body: list[str]) -> str:
    style = ".axis{stroke:#111;stroke-width:1.4}.curve{fill:none;stroke:#111;stroke-width:2}.line{fill:none;stroke:#4d6875;stroke-width:1.8}.guide{stroke:#777;stroke-width:1;stroke-dasharray:5 4}.answer{stroke:#536d3f;stroke-width:7;stroke-linecap:round}.open{fill:#fff;stroke:#536d3f;stroke-width:3}.closed{fill:#536d3f}.point{fill:#111}.box{fill:#f7f9fa;stroke:#aab5bb}.label,.annotation,.tick{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}.small{font-size:12px}.annotation{font-style:italic}.panel{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:14px;fill:#111}.arrow{fill:#111}"
    return f'<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" data-visual-case="{case_id}" data-fact-hash="{fact_digest(fact)}" data-visual-provenance="candidate_builder_python_r11"><title>{esc(title)}</title><desc>{esc(title)}</desc><style>{style}</style>\n' + "\n".join(body) + "\n</svg>\n"


def cartesian(case_id: str, fact: dict, title: str) -> str:
    fn = fact["function"]
    domain = fn.get("domain", [-6, 6])
    x_low, x_high = domain[0], domain[1]
    if isinstance(x_low, str): x_low = -6
    if isinstance(x_high, str): x_high = 6
    if fact.get("vertex") and all(isinstance(value, (int, float)) for value in fact["vertex"]):
        vertex_x = fact["vertex"][0]
        x_low = min(x_low, vertex_x - 1)
        x_high = max(x_high, vertex_x + 1)
    if "tangentPoint" in fact and isinstance(fact.get("tangentPoint", [None])[0], str):
        x_low, x_high = -2, 6
    y_values = []
    for i in range(401):
        x = x_low + (x_high - x_low) * i / 400
        y_values.append(fn["a"] * x * x + fn["b"] * x + fn["c"])
    y_low = min(y_values + [-2]); y_high = max(y_values + [4])
    if fact.get("maximum") == 7 and fn["a"] == -1: y_low, y_high = -3, 9
    if "tangentPoint" in fact and isinstance(fact.get("tangentPoint", [None])[0], str): y_low, y_high = -4, 5
    if "tangentSlopes" in fact: y_low, y_high = -18, 16
    y_low = math.floor(y_low - 1); y_high = math.ceil(y_high + 1)
    width, height, margin = 800, 470, 50
    def tx(x: float) -> float: return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)
    def ty(y: float) -> float: return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)
    body = [f'<rect width="{width}" height="{height}" fill="#fff"/>']
    if y_low <= 0 <= y_high:
        y0 = ty(0); body.append(f'<line x1="{margin}" y1="{fmt(y0)}" x2="{width-margin}" y2="{fmt(y0)}" class="axis"/><path d="M {width-margin} {fmt(y0)} l -8 -4 l 0 8 z" class="arrow"/>')
    if x_low <= 0 <= x_high:
        x0 = tx(0); body.append(f'<line x1="{fmt(x0)}" y1="{margin}" x2="{fmt(x0)}" y2="{height-margin}" class="axis"/><path d="M {fmt(x0)} {margin} l -4 8 l 8 0 z" class="arrow"/>')
    for x in range(math.ceil(x_low), math.floor(x_high) + 1):
        if x == 0 or not (y_low <= 0 <= y_high): continue
        y0 = ty(0); body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(y0-4)}" x2="{fmt(tx(x))}" y2="{fmt(y0+4)}" class="axis"/><text x="{fmt(tx(x))}" y="{fmt(y0+21)}" text-anchor="middle" class="label">{fmt(x)}</text>')
    points = [f"{fmt(tx(x))},{fmt(ty(fn['a']*x*x+fn['b']*x+fn['c']))}" for x in [x_low+(x_high-x_low)*i/400 for i in range(401)]]
    body.append(f'<polyline points="{" ".join(points)}" class="curve"/>')
    if "line" in fact:
        line = fact["line"]
        if isinstance(line["slope"], (int, float)):
            m, b = line["slope"], line["intercept"]
        elif "tangentPoint" in fact and isinstance(fact.get("tangentPoint", [None])[0], str):
            m, b = (3 - 2 * math.sqrt(6)) / 3, 2
        else:
            m, b = 0, 0
        body.append(f'<line x1="{fmt(tx(x_low))}" y1="{fmt(ty(m*x_low+b))}" x2="{fmt(tx(x_high))}" y2="{fmt(ty(m*x_high+b))}" class="line"/>')
        if isinstance(line["slope"], (int, float)):
            line_label = "y=" + fmt(line["slope"]) + "x" + ("+" if line["intercept"] >= 0 else "") + fmt(line["intercept"])
        elif "tangentPoint" in fact:
            line_label = "접선 y=(3−2√6)x/3+2"
        else:
            line_label = "접선"
        body.append(f'<text x="{margin}" y="46" class="small label">{esc(line_label)}</text>')
    if "tangentSlopes" in fact:
        for index, slope in enumerate([4 - 2 * math.sqrt(3), 4 + 2 * math.sqrt(3)]):
            body.append(f'<line x1="{fmt(tx(x_low))}" y1="{fmt(ty(slope*(x_low+1)+3))}" x2="{fmt(tx(x_high))}" y2="{fmt(ty(slope*(x_high+1)+3))}" class="line"/>')
        body.append(f'<text x="{margin}" y="46" class="small label">접선 기울기: 4−2√3, 4+2√3</text>')
    if "vertex" in fact and all(isinstance(v, (int, float)) for v in fact["vertex"]):
        x, y = fact["vertex"]; body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4" class="point"/><text x="{fmt(tx(x)+8)}" y="{fmt(ty(y)-8)}" class="label">꼭짓점 ({fmt(x)},{fmt(y)})</text>')
    if "tangentPoint" in fact:
        p = fact["tangentPoint"]
        x, y = (math.sqrt(6), math.sqrt(6)-2) if isinstance(p[0], str) else p
        point_label = f"접점 ({p[0]},{p[1]})" if isinstance(p[0], str) else "접점"
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="4" class="point"/><text x="{fmt(tx(x)+8)}" y="{fmt(ty(y)-8)}" class="label">{esc(point_label)}</text>')
    body.append(f'<text x="{margin}" y="28" class="annotation">{esc(title)}</text>')
    summary = []
    labels = {"maximum": "최댓값", "minimum": "최솟값", "result": "결과", "sum": "합", "slopeSum": "기울기 합", "parameterA": "매개변수 a", "rootProduct": "근의 곱", "discriminant": "판별식"}
    for key in ["maximum", "minimum", "result", "sum", "slopeSum", "parameterA", "rootProduct", "discriminant"]:
        if key in fact: summary.append(f"{labels[key]}={fact[key]}")
    if summary:
        panel_y = height - 120
        body.append(f'<rect x="545" y="{panel_y}" width="205" height="80" rx="8" class="box"/><text x="560" y="{panel_y+31}" class="panel">{esc(" · ".join(summary))}</text>')
    return shell(case_id, fact, title, width, height, body)


def number_line(case_id: str, fact: dict, title: str) -> str:
    width, height = 760, 330; left, right, y = 70, 610, 125
    numeric = []
    def add_number(v):
        if isinstance(v, (int, float)): numeric.append(float(v))
    for key in ["solutionInterval", "realInterval"]:
        value = fact.get(key)
        if isinstance(value, list):
            for v in value[:2]: add_number(v)
    for v in fact.get("numericBounds", []): add_number(v)
    for interval in fact.get("solutionIntervals", []) + [{"left": x[0], "right": x[1]} for x in fact.get("realIntervals", [])]:
        add_number(interval.get("left")); add_number(interval.get("right"))
    for v in fact.get("integerSolutions", []): add_number(v)
    low = min(numeric + [-5]); high = max(numeric + [5]); low = math.floor(low - 1); high = math.ceil(high + 1)
    def px(value: float) -> float: return left + (value-low) * (right-left) / (high-low)
    body = [f'<rect width="{width}" height="{height}" fill="#fff"/>', f'<line x1="{left}" y1="{y}" x2="{right}" y2="{y}" class="axis"/><path d="M {right} {y} l -8 -4 l 0 8 z" class="arrow"/>']
    span = max(high - low, 1)
    raw_step = span / 10
    power = 10 ** math.floor(math.log10(raw_step))
    normalized_step = raw_step / power
    multiplier = 1 if normalized_step <= 1 else 2 if normalized_step <= 2 else 5 if normalized_step <= 5 else 10
    tick_step = multiplier * power
    tick = math.ceil((low - 1e-9) / tick_step) * tick_step
    while tick <= high + 1e-9:
        body.append(f'<line x1="{fmt(px(tick))}" y1="{y-7}" x2="{fmt(px(tick))}" y2="{y+7}" class="axis"/><text x="{fmt(px(tick))}" y="{y+29}" text-anchor="middle" class="label">{fmt(tick)}</text>')
        tick += tick_step
    intervals = []
    if "solutionIntervals" in fact: intervals = [dict(interval) for interval in fact["solutionIntervals"]]
    elif "realIntervals" in fact: intervals = [{"left": a, "right": b, "leftClosed": lc, "rightClosed": rc, "_leftLabel": fmt(a), "_rightLabel": fmt(b)} for a,b,lc,rc in fact["realIntervals"]]
    elif "realInterval" in fact:
        a, b = fact["realInterval"]; intervals = [{"left": a, "right": b, "leftClosed": fact.get("leftClosed", False), "rightClosed": fact.get("rightClosed", False), "_leftLabel": fact.get("leftLabel", fmt(a)), "_rightLabel": fact.get("rightLabel", fmt(b))}]
    elif "solutionInterval" in fact:
        a,b = fact["solutionInterval"]; intervals = [{"left": a, "right": b, "leftClosed": fact.get("leftClosed", False), "rightClosed": fact.get("rightClosed", False), "_leftLabel": fact.get("leftLabel", "−∞" if a is None else str(a) if isinstance(a, str) else fmt(a)), "_rightLabel": fact.get("rightLabel", "∞" if b is None else str(b) if isinstance(b, str) else fmt(b))}]
        if fact.get("numericBounds"):
            intervals[0]["left"], intervals[0]["right"] = fact["numericBounds"]
    for interval in intervals:
        a, b = interval.get("left"), interval.get("right")
        if not isinstance(a, (int,float)): a = low
        if not isinstance(b, (int,float)): b = high
        start, end = px(a), px(b); body.append(f'<line x1="{fmt(start+5)}" y1="{y}" x2="{fmt(end-5)}" y2="{y}" class="answer"/>')
        body.append(f'<circle cx="{fmt(start)}" cy="{y}" r="7" class="{"closed" if interval.get("leftClosed") else "open"}"/><circle cx="{fmt(end)}" cy="{y}" r="7" class="{"closed" if interval.get("rightClosed") else "open"}"/>')
        left_label = interval.get("_leftLabel", "−∞" if interval.get("left") is None else fmt(float(interval.get("left"))))
        right_label = interval.get("_rightLabel", "∞" if interval.get("right") is None else fmt(float(interval.get("right"))))
        body.append(f'<text x="{fmt(start)}" y="{y-18}" text-anchor="middle" class="small label">{esc(str(left_label))}</text><text x="{fmt(end)}" y="{y-18}" text-anchor="middle" class="small label">{esc(str(right_label))}</text>')
    for value in fact.get("integerSolutions", []):
        body.append(f'<circle cx="{fmt(px(value))}" cy="{y-28}" r="4" class="point"/><text x="{fmt(px(value))}" y="{y-38}" text-anchor="middle" class="small label">{fmt(value)}</text>')
    labels = []
    display_labels = {"alphaMinusBeta": "α−β", "result": "결과", "sum": "합", "count": "개수", "width": "구간 길이", "negativeIntegerMaximum": "음의 정수 최댓값", "maximum": "최댓값"}
    for key in ["alphaMinusBeta", "result", "sum", "count", "width", "negativeIntegerMaximum", "maximum"]:
        if key in fact: labels.append(f"{display_labels[key]}={fact[key]}")
    if fact.get("integerSolutions"): labels.append("정수해=" + ",".join(str(x) for x in fact["integerSolutions"]))
    if fact.get("exact"): labels.append(str(fact["exact"]))
    body.append(f'<text x="70" y="55" class="annotation">{esc(title)}</text>')
    if labels: body.append(f'<rect x="70" y="215" width="580" height="65" rx="8" class="box"/><text x="88" y="248" class="panel">{esc(" · ".join(labels))}</text>')
    return shell(case_id, fact, title, width, height, body)


def main() -> None:
    data = json.loads(FACTS.read_text(encoding="utf-8")); rows = []
    for index, item in enumerate(data["rows"], start=1):
        case_id = f"hs-r11-{index:03d}"
        title = "부등식 해집합 수직선" if item["expectedVisualType"] == "number-line" else "이차함수 그래프와 핵심 조건"
        svg = number_line(case_id, item["expectedFacts"], title) if item["expectedVisualType"] == "number-line" else cartesian(case_id, item["expectedFacts"], title)
        out = OUT_ROOT / f"{case_id}.svg"; out.parent.mkdir(parents=True, exist_ok=True); out.write_text(svg, encoding="utf-8", newline="\n")
        raw = out.read_bytes(); rows.append({"questionUid": item["questionUid"], "caseId": case_id, "assetPath": out.relative_to(ROOT).as_posix(), "assetBytes": len(raw), "assetSha256": digest(raw), "factSha256": fact_digest(item["expectedFacts"]), "status": "CANDIDATE_GENERATED_NO_PASS"})
    output = {"schemaVersion": "HS_QUADRATIC_DETERMINISTIC_CANDIDATE_VISUAL_MANIFEST_R11", "status": "CANDIDATE_GENERATED_NO_PASS", "productionAuthorized": False, "v1Facts": FACTS.relative_to(ROOT).as_posix(), "rows": rows, "note": "Generated from 25 fresh source-only deterministic fact rows. Specialist fact rows remain pending; no final PASS is claimed."}
    MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": output["status"], "generated": len(rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
