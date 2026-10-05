from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = REPORT / "25_additional_v1_expected_facts.json"
OUT_ROOT = ROOT / "archive" / "_generated" / "hs-quadratic-svg-upgrade-20260908" / "candidate-r6" / "assets"
MANIFEST = REPORT / "26_additional_candidate_manifest_r6.json"
SOURCE_HOLDS = {
    "|26_금당고_1학기_중간_고1_기출_c|13",
    "|26_금당고_1학기_중간_고1_기출_c|17",
    "|26_매산여고_1학기_중간_고1_기출_c|19",
    "|26_팔마고_1학기_중간_고1_기출_c|9",
    "|26_팔마고_1학기_중간_고1_기출_c|15",
}


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


def ticks(low: float, high: float) -> list[int]:
    return list(range(math.ceil(low), math.floor(high) + 1))


def render(case_id: str, fact: dict) -> str:
    fn = fact["function"]
    a, b, c = fn["a"], fn["b"], fn["c"]
    if case_id == "hs-r6-geumdang-q6":
        width, height, x_low, x_high, y_low, y_high = 620, 380, -2, 4, -7, 12
        labels = [(3, -5, "V"), (-1, 11, "A"), (2, -4, "B")]
        guides = [(-1, -7, 11), (2, -7, -4)]
        caption = "구간 [−1,2]에서 꼭짓점과 양 끝값 비교"
    elif case_id == "hs-r6-geumdang-q9":
        width, height, x_low, x_high, y_low, y_high = 620, 360, -2, 2, -1, 6
        labels = [(0.25, 0, "T")]
        guides = [(0.25, -1, 0)]
        caption = "x축에 접하는 꼭짓점"
    elif case_id == "hs-r6-geumdang-q16":
        width, height, x_low, x_high, y_low, y_high = 620, 380, -2, 3, -12, 16
        labels = [(0.75, 1.875, "P"), (1.5, 5.625, "Q")]
        guides = [(0.75, -12, 1.875), (1.5, -12, 5.625)]
        caption = "두 교점의 x좌표 비와 꼭짓점형 최대값"
    elif case_id == "hs-r6-maesan-q6":
        width, height, x_low, x_high, y_low, y_high = 620, 360, -1, 7, -2, 18
        labels = [(3, 0, "T")]
        guides = [(3, -2, 0)]
        caption = "중근 조건과 x축 접점"
    elif case_id == "hs-r6-maesan-q7":
        width, height, x_low, x_high, y_low, y_high = 620, 340, 0, 4, -2, 5
        labels = [(1, -1, "V"), (3, 3, "B")]
        guides = [(1, -2, -1), (3, -2, 3)]
        caption = "구간 [1,3]에서 최댓값과 최솟값"
    elif case_id == "hs-r6-maesan-q13":
        width, height, x_low, x_high, y_low, y_high = 620, 380, -5, 1, -3, 16
        labels = [(-4, 11, "P"), (-2, 7, "Q")]
        guides = [(-4, -3, 11), (-2, -3, 7)]
        caption = "두 포물선과 직선의 두 교점"
    elif case_id == "hs-r6-maesan-q14":
        width, height, x_low, x_high, y_low, y_high = 620, 320, -1, 3, 4, 14
        labels = [(1, 5, "V")]
        guides = [(1, 4, 5)]
        caption = "최솟값 5를 만드는 구간의 축 포함 조건"
    elif case_id == "hs-r6-palma-q4":
        width, height, x_low, x_high, y_low, y_high = 620, 340, -2, 4, -1, 10
        labels = [(1, 1, "V")]
        guides = [(1, -1, 1)]
        caption = "x축과 만나지 않는 위로 열린 포물선"
    else:
        width, height, x_low, x_high, y_low, y_high = 620, 380, -3, 2, -10, 15
        labels = [(-1.25, -1.625, "T")]
        guides = [(-1.25, -10, -1.625)]
        caption = "포물선과 직선의 접점"
    margin = 48.0

    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    def ty(y: float) -> float:
        return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)

    def value(x: float) -> float:
        return a * x * x + b * x + c

    body = [f'<rect x="0" y="0" width="{width}" height="{height}" fill="#fff"/>']
    if y_low <= 0 <= y_high:
        y0 = ty(0)
        body.append(f'<line x1="{fmt(margin)}" y1="{fmt(y0)}" x2="{fmt(width-margin)}" y2="{fmt(y0)}" class="axis"/>')
        body.append(f'<path d="M {fmt(width-margin)} {fmt(y0)} l -8 -4 l 0 8 z" class="arrow"/>')
    if x_low <= 0 <= x_high:
        x0 = tx(0)
        body.append(f'<line x1="{fmt(x0)}" y1="{fmt(margin)}" x2="{fmt(x0)}" y2="{fmt(height-margin)}" class="axis"/>')
    for x in ticks(x_low, x_high):
        if x == 0 and x_low <= 0 <= x_high:
            continue
        y0 = ty(0) if y_low <= 0 <= y_high else height - margin
        body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(y0-4)}" x2="{fmt(tx(x))}" y2="{fmt(y0+4)}" class="tick"/>')
        body.append(f'<text x="{fmt(tx(x))}" y="{fmt(y0+20)}" text-anchor="middle" class="tick-label">{fmt(x)}</text>')
    if case_id == "hs-r6-geumdang-q16":
        line_fn = lambda x: 5 * x - 1.875
    elif case_id in {"hs-r6-maesan-q13", "hs-r6-palma-q5"}:
        line_fn = (lambda x: -2 * x + 3) if case_id == "hs-r6-maesan-q13" else (lambda x: -2 * x - 4.125)
    else:
        line_fn = None
    points = [f"{fmt(tx(x))},{fmt(ty(value(x)))}" for x in [x_low + (x_high-x_low)*i/400 for i in range(401)]]
    body.append(f'<polyline points="{" ".join(points)}" class="curve"/>')
    if line_fn is not None:
        body.append(f'<line x1="{fmt(tx(x_low))}" y1="{fmt(ty(line_fn(x_low)))}" x2="{fmt(tx(x_high))}" y2="{fmt(ty(line_fn(x_high)))}" class="secondary"/>')
    for x, low, high in guides:
        body.append(f'<line x1="{fmt(tx(x))}" y1="{fmt(ty(low))}" x2="{fmt(tx(x))}" y2="{fmt(ty(high))}" class="guide"/>')
    for x, y, label in labels:
        body.append(f'<circle cx="{fmt(tx(x))}" cy="{fmt(ty(y))}" r="3.5" class="point"/>')
        body.append(f'<text x="{fmt(tx(x)+7)}" y="{fmt(ty(y)-7)}" class="label">{esc(label)}</text>')
    if case_id == "hs-r6-geumdang-q16":
        body.append(f'<text x="{fmt(tx(1.75))}" y="{fmt(ty(13))}" class="annotation">y=5x−15/8</text>')
    elif case_id == "hs-r6-maesan-q13":
        body.append(f'<text x="{fmt(tx(-3.5))}" y="{fmt(ty(12))}" class="annotation">y=−2x＋3</text>')
    elif case_id == "hs-r6-palma-q5":
        body.append(f'<text x="{fmt(tx(-2.8))}" y="{fmt(ty(-5))}" class="annotation">y=−2x−33/8</text>')
    body.append(f'<text x="{fmt(margin)}" y="28" class="annotation">{esc(caption)}</text>')
    style = ".axis{stroke:#111;stroke-width:1.4;fill:none}.tick{stroke:#555;stroke-width:1}.curve{fill:none;stroke:#111;stroke-width:2.1;stroke-linejoin:round;stroke-linecap:round}.secondary{fill:none;stroke:#555;stroke-width:1.7}.guide{fill:none;stroke:#777;stroke-width:.95;stroke-dasharray:5 4}.point{fill:#111;stroke:#111}.tick-label,.axis-label,.label,.annotation{font:13px 'Malgun Gothic','Noto Sans KR',sans-serif;fill:#111}.annotation{font-style:italic}.arrow{fill:#111}"
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" data-visual-case="{case_id}" data-fact-hash="{fact_digest(fact)}" data-visual-provenance="candidate_builder_python_v1"><title>{esc(caption)}</title><desc>{esc(caption)}</desc><style>{style}</style>\n' + "\n".join(body) + "\n</svg>\n"


def main() -> None:
    data = json.loads(FACTS.read_text(encoding="utf-8"))
    rows = []
    for item in data["rows"]:
        if any(item["questionUid"].endswith(suffix) for suffix in SOURCE_HOLDS):
            continue
        uid = item["questionUid"]
        if uid.endswith("|6") and "26_금당고" in uid:
            case_id = "hs-r6-geumdang-q6"
        elif uid.endswith("|9") and "26_금당고" in uid:
            case_id = "hs-r6-geumdang-q9"
        elif uid.endswith("|16") and "26_금당고" in uid:
            case_id = "hs-r6-geumdang-q16"
        elif uid.endswith("|6") and "26_매산여고" in uid:
            case_id = "hs-r6-maesan-q6"
        elif uid.endswith("|7"):
            case_id = "hs-r6-maesan-q7"
        elif uid.endswith("|13"):
            case_id = "hs-r6-maesan-q13"
        elif uid.endswith("|14"):
            case_id = "hs-r6-maesan-q14"
        elif uid.endswith("|4"):
            case_id = "hs-r6-palma-q4"
        elif uid.endswith("|5"):
            case_id = "hs-r6-palma-q5"
        else:
            raise ValueError(f"unmapped fact row {uid}")
        svg = render(case_id, item["facts"] | {"function": item["function"]})
        out = OUT_ROOT / f"{case_id}.svg"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(svg, encoding="utf-8", newline="\n")
        raw = out.read_bytes()
        rows.append({"questionUid": uid, "caseId": case_id, "assetPath": out.relative_to(ROOT).as_posix(), "assetBytes": len(raw), "assetSha256": digest(raw), "factSha256": fact_digest(item["facts"] | {"function": item["function"]}), "status": "CANDIDATE_GENERATED_NO_PASS"})
    output = {"schemaVersion": "HS_QUADRATIC_ADDITIONAL_CANDIDATE_MANIFEST_R6", "status": "CANDIDATE_GENERATED_NO_PASS", "productionAuthorized": False, "sourceFacts": FACTS.relative_to(ROOT).as_posix(), "rows": rows, "skippedSourceHoldCount": len(data["rows"]) - len(rows), "note": "Source-hold rows were deliberately skipped. These candidate SVGs still require artifact-only V2, V3 parity, and real render review."}
    MANIFEST.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"status": output["status"], "generated": len(rows), "skippedSourceHolds": output["skippedSourceHoldCount"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
