"""Build question-specific solution SVGs for the 2022 high-school set pilot.

The generator is deliberately deterministic.  Every numeric coordinate used by
the SVGs is calculated here, and each asset records a hash of its compact fact
model in ``data-fact-hash``.
"""

from __future__ import annotations

import hashlib
import html
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[3]
ASSET_ROOT = ROOT / "archive" / "assets" / "images"
W = 760
FONT = '"Noto Sans KR","Pretendard","Apple SD Gothic Neo","Malgun Gothic",sans-serif'
MATH_FONT = '"STIX Two Math","Cambria Math","Times New Roman",serif'


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def tx(x: float, y: float, value: object, size: float = 16, *, cls: str = "text",
       anchor: str = "start", fill: str | None = None, weight: str | None = None) -> str:
    attrs = [f'x="{x:g}"', f'y="{y:g}"', f'font-size="{size:g}"',
             f'text-anchor="{anchor}"', f'class="{cls}"']
    if fill:
        attrs.append(f'fill="{fill}"')
    if weight:
        attrs.append(f'font-weight="{weight}"')
    return f'<text {" ".join(attrs)}>{esc(value)}</text>'


def tspans(x: float, y: float, lines: Iterable[object], size: float = 15,
           *, cls: str = "text", line_gap: float = 22, anchor: str = "start",
           fill: str | None = None, weight: str | None = None) -> str:
    attrs = [f'x="{x:g}"', f'y="{y:g}"', f'font-size="{size:g}"',
             f'text-anchor="{anchor}"', f'class="{cls}"']
    if fill:
        attrs.append(f'fill="{fill}"')
    if weight:
        attrs.append(f'font-weight="{weight}"')
    body = "".join(f'<tspan x="{x:g}" dy="{0 if i == 0 else line_gap:g}">{esc(line)}</tspan>'
                   for i, line in enumerate(lines))
    return f'<text {" ".join(attrs)}>{body}</text>'


def rect(x: float, y: float, w: float, h: float, *, fill: str = "#ffffff",
         stroke: str = "#cbd5e1", rx: float = 12, sw: float = 1.4,
         cls: str = "") -> str:
    extra = f' class="{cls}"' if cls else ""
    return (f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" '
            f'rx="{rx:g}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:g}"{extra}/>' )


def line(x1: float, y1: float, x2: float, y2: float, *, stroke: str = "#94a3b8",
         sw: float = 1.4, dash: str | None = None) -> str:
    extra = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" '
            f'stroke="{stroke}" stroke-width="{sw:g}" stroke-linecap="round"{extra}/>' )


def circle(cx: float, cy: float, r: float, *, fill: str, stroke: str,
           sw: float = 2.0, opacity: float = 0.3) -> str:
    return (f'<circle cx="{cx:g}" cy="{cy:g}" r="{r:g}" fill="{fill}" '
            f'fill-opacity="{opacity:g}" stroke="{stroke}" stroke-width="{sw:g}"/>' )


def panel(x: float, y: float, w: float, h: float, label: str, *, accent: str = "#2563eb") -> str:
    return rect(x, y, w, h, fill="#ffffff", stroke="#cbd5e1") + tx(
        x + 16, y + 27, label, 15, fill=accent, weight="700"
    )


def pill(x: float, y: float, w: float, label: str, *, fill: str = "#dbeafe",
         stroke: str = "#2563eb", text_fill: str = "#1d4ed8") -> str:
    return (rect(x, y, w, 30, fill=fill, stroke=stroke, rx=15, sw=1.2) +
            tx(x + w / 2, y + 20, label, 14, anchor="middle", fill=text_fill, weight="700"))


def document(title: str, desc: str, body: str, facts: dict) -> str:
    fact_json = json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    fact_hash = hashlib.sha256(fact_json.encode("utf-8")).hexdigest()
    title_id = "title"
    desc_id = "desc"
    style = f"""
    <style>
      .text {{ font-family:{FONT}; fill:#172033; }}
      .math {{ font-family:{MATH_FONT}; fill:#172033; }}
      .muted {{ font-family:{FONT}; fill:#56657a; }}
      .small {{ font-family:{FONT}; fill:#334155; }}
      .strong {{ font-family:{FONT}; fill:#172033; font-weight:700; }}
      .math-strong {{ font-family:{MATH_FONT}; fill:#172033; font-weight:700; }}
    </style>
    """
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="430" '
            f'viewBox="0 0 {W} 430" preserveAspectRatio="xMidYMid meet" role="img" '
            f'aria-labelledby="{title_id} {desc_id}" data-visual-case="set-2022-pilot" '
            f'data-fact-hash="{fact_hash}" data-visual-provenance="2026-09-05-set-visual-pilot">'
            f'<title id="{title_id}">{esc(title)}</title><desc id="{desc_id}">{esc(desc)}</desc>'
            f'{style}<rect width="{W}" height="430" fill="#f8fafc"/>{body}</svg>')


def save(exam: str, qid: int, title: str, desc: str, body: str, facts: dict) -> None:
    target = ASSET_ROOT / exam / f"q{qid:02d}-solution.svg"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(document(title, desc, body, facts), encoding="utf-8", newline="\n")
    print(target.relative_to(ROOT))


def state_table(rows: list[tuple[str, str, str]], *, y: float = 105,
                row_h: float = 45, x: float = 44, label_w: float = 220,
                value_w: float = 430) -> str:
    out = rect(x, y, label_w + value_w, row_h * len(rows), fill="#ffffff", stroke="#cbd5e1")
    for i, (label, value, color) in enumerate(rows):
        yy = y + i * row_h
        if i:
            out += line(x, yy, x + label_w + value_w, yy, stroke="#e2e8f0", sw=1)
        out += rect(x, yy, label_w, row_h, fill="#f1f5f9", stroke="none", rx=0, sw=0)
        out += tx(x + 14, yy + 28, label, 15, weight="700")
        out += tx(x + label_w + 14, yy + 28, value, 15, fill=color)
    return out


def venn(x: float, y: float, *, universe: str, a_label: str, b_label: str,
         a_only: str, both: str, b_only: str, outside: str,
         title: str, accent: str = "#2563eb") -> str:
    out = panel(x, y, 330, 230, title, accent=accent)
    cx1, cx2, cy, r = x + 112, x + 205, y + 123, 67
    out += circle(cx1, cy, r, fill="#60a5fa", stroke="#2563eb", opacity=0.32)
    out += circle(cx2, cy, r, fill="#f59e0b", stroke="#d97706", opacity=0.30)
    out += tx(x + 86, y + 82, a_label, 14, fill="#1d4ed8", weight="700")
    out += tx(x + 227, y + 82, b_label, 14, fill="#b45309", weight="700")
    out += tx(cx1 - 29, cy + 4, a_only, 13, anchor="middle", fill="#1e40af", weight="700")
    out += tx((cx1 + cx2) / 2, cy + 4, both, 13, anchor="middle", fill="#166534", weight="700")
    out += tx(cx2 + 29, cy + 4, b_only, 13, anchor="middle", fill="#92400e", weight="700")
    out += tx(x + 262, y + 194, outside, 13, anchor="middle", fill="#64748b")
    out += tx(x + 18, y + 212, universe, 12, cls="muted")
    return out


def make_gangnam_q10() -> None:
    exam = "22_강남여고_2학기_중간_고1_기출"
    body = tx(28, 38, "반드시 포함·반드시 제외·자유 선택을 나눈다", 22, weight="700")
    body += tx(28, 67, "A∪X=X와 (B−A)∩X={4,8}를 원소별 조건으로 바꾼 결과", 15, cls="muted")
    body += state_table([
        ("전체집합 U", "{1,2,3,4,5,6,7,8,9,10}", "#334155"),
        ("반드시 포함", "{1,3} ∪ {4,8} = {1,3,4,8}", "#166534"),
        ("반드시 제외", "{6}", "#b91c1c"),
        ("자유 선택", "{2,5,7,9,10}  →  5개", "#1d4ed8"),
    ])
    body += pill(44, 315, 300, "n(X)=2⁵=32", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(44, 378, "자유 원소 다섯 개만 각각 포함 여부를 선택한다.", 15, cls="muted")
    save(exam, 10, "문항 10 해설: X의 강제·금지·자유 원소", "U={1,…,10}에서 X에 반드시 들어가거나 빠지는 원소와 자유 원소를 분류한 표", body,
         {"U": list(range(1, 11)), "forced": [1, 3, 4, 8], "forbidden": [6], "free": [2, 5, 7, 9, 10], "count": 32})


def make_keumdang_mid_q13() -> None:
    exam = "22_금당고_2학기_중간_고1_기출"
    body = tx(28, 38, "두 여집합 조건에서 대칭차집합을 바로 복원한다", 22, weight="700")
    body += tx(28, 67, "구하는 집합은 (A∪B)∩(A∩B)ᶜ = (A−B)∪(B−A)", 15, cls="muted")
    body += panel(36, 94, 330, 230, "네 영역 판정", accent="#7c3aed")
    body += rect(52, 134, 298, 42, fill="#fee2e2", stroke="#dc2626", rx=8)
    body += tx(68, 161, "A만 = A−B", 15, weight="700", fill="#991b1b")
    body += tx(236, 161, "{3,4,6}", 17, anchor="middle", fill="#991b1b", weight="700")
    body += rect(52, 184, 298, 42, fill="#ffedd5", stroke="#d97706", rx=8)
    body += tx(68, 211, "B만 = B−A", 15, weight="700", fill="#9a3412")
    body += tx(236, 211, "{1,5,8}", 17, anchor="middle", fill="#9a3412", weight="700")
    body += rect(52, 234, 298, 58, fill="#f1f5f9", stroke="#94a3b8", rx=8)
    body += tspans(68, 258, ["A∩B와 바깥", "현재 조건에서 구분 불필요: {2,7,9}"], 14, line_gap=20, fill="#475569")
    body += panel(394, 94, 330, 230, "대칭차집합의 합", accent="#2563eb")
    body += tspans(414, 143, ["A△B", "= {1,3,4,5,6,8}"], 19, line_gap=32, fill="#1d4ed8", weight="700")
    body += line(414, 208, 704, 208, stroke="#e2e8f0")
    body += tx(414, 246, "1+3+4+5+6+8", 20, cls="math-strong")
    body += tx(414, 286, "= 27", 24, fill="#166534", weight="700")
    body += tx(36, 374, "첫째 조건의 여집합은 B−A={1,5,8}, 둘째 조건의 여집합은 A−B={3,4,6}이다.", 14, cls="muted")
    save(exam, 13, "문항 13 해설: 대칭차집합의 네 영역", "U={1,…,9}에서 두 조건으로 A−B와 B−A를 찾아 대칭차집합의 원소 합을 구하는 도식", body,
         {"U": list(range(1, 10)), "A_minus_B": [3, 4, 6], "B_minus_A": [1, 5, 8], "undetermined": [2, 7, 9], "target_sum": 27})


def make_keumdang_mid_q16() -> None:
    exam = "22_금당고_2학기_중간_고1_기출"
    body = tx(28, 38, "Y=Xᶜ로 정한 뒤, 64의 포함 여부를 판정한다", 22, weight="700")
    body += tx(28, 67, "S(X)>S(Y)와 n(X)의 홀짝을 동시에 만족시키는 선택", 15, cls="muted")
    body += panel(36, 95, 310, 235, "전체집합과 합", accent="#7c3aed")
    body += tspans(56, 143, ["U={2,3,4,8,16,32,64}", "S(U)=129", "Y=Xᶜ", "S(X)>64.5"], 17, line_gap=34, fill="#334155")
    body += panel(370, 95, 354, 235, "홀수 원소 수를 만드는 선택", accent="#2563eb")
    body += pill(392, 122, 290, "64 ∈ X  (강제)", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(392, 184, "나머지 {2,3,4,8,16,32}에서", 16, cls="small")
    body += tx(392, 212, "짝수 개를 선택하면 n(X)가 홀수", 16, cls="small")
    body += tx(392, 250, "단, 0개 선택은 S(X)=64라 제외", 15, fill="#b91c1c")
    body += tx(392, 292, "C(6,2)+C(6,4)+C(6,6)=15+15+1", 16, cls="math-strong")
    body += pill(392, 345, 230, "총 31개", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    save(exam, 16, "문항 16 해설: 64를 포함하는 홀수 크기 부분집합", "U={2,3,4,8,16,32,64}에서 Y=Xᶜ와 합·홀짝 조건으로 X의 경우를 세는 상태도", body,
         {"U": [2, 3, 4, 8, 16, 32, 64], "sumU": 129, "forced": [64], "remaining": [2, 3, 4, 8, 16, 32], "count": 31})


def make_maesan_q6() -> None:
    exam = "22_매산고_2학기_중간_고1_기출"
    body = tx(28, 38, "집합 등식을 원소의 포함 조건으로 바꾼다", 22, weight="700")
    body += tx(28, 67, "X∪A=X이면 A는 X에 포함되고, X−B=X이면 X와 B는 서로소", 15, cls="muted")
    body += state_table([
        ("U", "{1,2,3,4,5,6,7,8,9,10}", "#334155"),
        ("반드시 포함", "A={2,4,6}", "#166534"),
        ("반드시 제외", "B={1,3,5,7,9}", "#b91c1c"),
        ("자유 선택", "{8,10}  →  2개", "#1d4ed8"),
    ])
    body += pill(44, 315, 280, "n(X)=2²=4", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(44, 378, "고정되지 않은 8과 10만 선택하거나 제외할 수 있다.", 15, cls="muted")
    save(exam, 6, "문항 6 해설: X의 고정 원소와 자유 원소", "U={1,…,10}, A={2,4,6}, B={1,3,5,7,9}에서 등식이 정하는 X의 상태표", body,
         {"U": list(range(1, 11)), "forced": [2, 4, 6], "forbidden": [1, 3, 5, 7, 9], "free": [8, 10], "count": 4})


def make_maesan_q17() -> None:
    exam = "22_매산고_2학기_중간_고1_기출"
    pairs = [(a, 21 - a, a * (21 - a)) for a in range(1, 11)]
    body = tx(28, 38, "n=21에서 1부터 20까지가 정확히 10쌍으로 묶인다", 22, weight="700")
    body += tx(28, 67, "a(21−a)는 a와 21−a를 바꾸어도 같은 출력값을 만든다", 15, cls="muted")
    body += panel(28, 92, 704, 242, "A={1,2,…,20}의 실제 중복쌍", accent="#2563eb")
    for i, (a, b, value) in enumerate(pairs):
        col, row = i % 2, i // 2
        x = 48 + col * 330
        y = 158 + row * 35
        body += tx(x, y, f"({a},{b})", 16, cls="math-strong")
        body += tx(x + 105, y, "→", 16, fill="#64748b")
        body += tx(x + 133, y, str(value), 16, fill="#1d4ed8", weight="700")
    body += tx(28, 372, "서로 다른 입력값의 충돌 조건: (a−b)(21−a−b)=0", 15, cls="math-strong")
    body += pill(420, 348, 130, "|B₂₁|=10", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    body += pill(562, 348, 82, "α=20", fill="#fef3c7", stroke="#d97706", text_fill="#92400e")
    body += pill(656, 348, 76, "41", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    save(exam, 17, "문항 17 해설: n=21의 열 쌍과 출력값", "A={1,…,20}에서 n=21일 때 실제 열 쌍 10개와 B₂₁의 출력값을 모두 표시한 도식", body,
         {"n": 21, "A": list(range(1, 21)), "pairs": pairs, "distinct_outputs": [p[2] for p in pairs], "k": 21, "alpha": 20, "result": 41})


def make_maesan_q19() -> None:
    exam = "22_매산고_2학기_중간_고1_기출"
    body = tx(28, 38, "합집합을 먼저 140명으로 고정한 뒤 교집합을 움직인다", 22, weight="700")
    body += tx(28, 67, "제주도만 신청한 수 = 85−t/2  (t=n(A∩B))", 15, cls="muted")
    body += venn(34, 96, universe="200명 중 바깥 60명", a_label="A=제주도", b_label="B=서울",
                 a_only="85−t/2", both="t", b_only="55−t/2", outside="합집합 140명", title="일반적인 t")
    body += panel(388, 96, 336, 230, "두 끝값", accent="#16a34a")
    body += tspans(410, 140, ["t=0  →  제주도만 85명", "t=110 →  제주도만 30명", "t는 짝수: 0≤t≤110"], 16, line_gap=39, fill="#334155")
    body += line(410, 266, 704, 266, stroke="#e2e8f0")
    body += tx(410, 305, "85+30=115", 24, fill="#166534", weight="700")
    body += tx(34, 374, "n(A∪B)=140, n(A)−n(B)=30에서 n(A)=85+t/2, n(B)=55+t/2이다.", 14, cls="muted")
    save(exam, 19, "문항 19 해설: 제주도만 신청한 학생 수의 범위", "200명 학급에서 합집합 140명과 교집합 t에 따른 네 영역의 인원 변화를 보여 주는 Venn diagram", body,
         {"total": 200, "union": 140, "intersection_range": [0, 110], "a_only_formula": "85−t/2", "max": 85, "min": 30, "sum": 115})


def make_bokseong_q15() -> None:
    exam = "22_복성고_2학기_중간_고1_기출"
    body = tx(28, 38, "대칭차집합 조건을 만족하는 a 후보를 비교한다", 22, weight="700")
    body += tx(28, 67, "2가 대칭차집합에 없으므로 2∈A, 따라서 a=4,3,−3", 15, cls="muted")
    body += rect(34, 95, 692, 218, fill="#ffffff", stroke="#cbd5e1")
    headers = [(52, "a", 55), (124, "A", 185), (320, "B", 185), (516, "A△B", 180)]
    for x, label, _ in headers:
        body += tx(x, 123, label, 15, weight="700")
    body += line(44, 136, 716, 136, stroke="#94a3b8")
    rows = [("4", "{2,3,9}", "{1,2,3}", "{1,9}", "#b91c1c"),
            ("3", "{1,2,3}", "{0,2,3}", "{0,1}  ✓", "#166534"),
            ("−3", "{−5,2,3}", "{−6,2,3}", "{−6,−5}", "#b91c1c")]
    for i, row in enumerate(rows):
        y = 174 + i * 45
        if i:
            body += line(44, y - 25, 716, y - 25, stroke="#e2e8f0", sw=1)
        for (x, _, _), value in zip(headers, row[:4]):
            body += tx(x, y, value, 16, cls="math-strong" if x == 52 else "text", fill=row[4] if x == 516 else None)
    body += pill(48, 345, 270, "a=3, B={0,2,3}, b=5", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(344, 366, "a+b=3+5=8", 22, fill="#1d4ed8", weight="700")
    save(exam, 15, "문항 15 해설: 대칭차집합 후보표", "a=4,3,−3의 실제 집합과 대칭차집합을 비교해 a=3을 고르는 표", body,
         {"candidates": [{"a": 4, "symmetric_difference": [1, 9]}, {"a": 3, "symmetric_difference": [0, 1]}, {"a": -3, "symmetric_difference": [-6, -5]}], "b": 5, "result": 8})


def make_bokseong_q21() -> None:
    exam = "22_복성고_2학기_중간_고1_기출"
    body = tx(28, 38, "교집합에 들어갈 두 약수를 먼저 고정하고 k를 나열한다", 22, weight="700")
    body += tx(28, 67, "B={2,5,6}, 정확히 두 개가 약수인 k만 남긴 뒤 A−B의 합의 홀짝을 확인", 15, cls="muted")
    body += rect(34, 94, 692, 244, fill="#ffffff", stroke="#cbd5e1")
    cols = [(52, "k", 70), (146, "B와의 교집합", 170), (342, "A−B", 230), (604, "합", 72)]
    for x, label, _ in cols:
        body += tx(x, 122, label, 15, weight="700")
    body += line(44, 136, 716, 136, stroke="#94a3b8")
    rows = [("10", "{2,5}", "{1,10}", "11", "#166534"), ("20", "{2,5}", "{1,4,10,20}", "35", "#166534"),
            ("6", "{2,6}", "{1,3}", "4", "#64748b"), ("12", "{2,6}", "{1,3,4,12}", "20", "#64748b"),
            ("18", "{2,6}", "{1,3,9,18}", "31", "#166534")]
    for i, row in enumerate(rows):
        y = 169 + i * 34
        if i:
            body += line(44, y - 24, 716, y - 24, stroke="#e2e8f0", sw=1)
        for (x, _, _), value in zip(cols, row[:4]):
            body += tx(x, y, value, 15, cls="math-strong" if x == 52 else "text", fill=row[4] if x in (52, 604) else None)
    body += pill(48, 358, 300, "홀수인 k={10,20,18}", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(382, 380, "10+20+18=48", 22, fill="#1d4ed8", weight="700")
    save(exam, 21, "문항 21 해설: 약수 후보와 A−B 합 표", "k≤20에서 B와 정확히 두 원소를 공유하는 다섯 후보와 A−B의 원소 합을 비교한 표", body,
         {"B": [2, 5, 6], "candidates": [10, 20, 6, 12, 18], "difference_sums": {"10": 11, "20": 35, "6": 4, "12": 20, "18": 31}, "result": 48})


def make_suncheon_q4() -> None:
    exam = "22_순천여고_2학기_중간_고1_기출"
    body = tx(28, 38, "합집합과 교집합을 Venn 영역으로 분리한다", 22, weight="700")
    body += tx(28, 67, "바깥 8명에서 합집합 42명을 구하고 포함배제로 교집합을 구한다", 15, cls="muted")
    body += venn(46, 96, universe="U=50명", a_label="A=31", b_label="B=23", a_only="19", both="12", b_only="11", outside="바깥 8", title="실제 인원 배치")
    body += panel(410, 96, 314, 230, "빈칸 계산", accent="#16a34a")
    body += tspans(432, 143, ["a=n(A∪B)=50−8=42", "31+23=a+b", "b=12", "a−b=42−12=30"], 17, line_gap=39, fill="#334155")
    body += tx(46, 374, "두 원의 겹친 영역 12명이 두 번 세어진다는 점을 보정한다.", 14, cls="muted")
    save(exam, 4, "문항 4 해설: 두 영화 관람 인원 Venn diagram", "50명 중 A=31, B=23, 바깥=8인 실제 네 영역과 a,b의 계산", body,
         {"total": 50, "A": 31, "B": 23, "neither": 8, "union": 42, "intersection": 12, "difference": 30})


def make_suncheon_q8() -> None:
    exam = "22_순천여고_2학기_중간_고1_기출"
    body = tx(28, 38, "X에 반드시 들어갈 원소와 들어갈 수 없는 원소를 나눈다", 22, weight="700")
    body += tx(28, 67, "X∩A=A는 A⊆X, X−B=X는 X∩B=∅와 같다", 15, cls="muted")
    body += state_table([
        ("전체집합 U", "{1,2,3,4,5,6,7}", "#334155"),
        ("반드시 포함", "A={1,2}", "#166534"),
        ("반드시 제외", "B={5,7}", "#b91c1c"),
        ("자유 선택", "{3,4,6}  →  3개", "#1d4ed8"),
    ])
    body += pill(44, 315, 280, "n(X)=2³=8", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(44, 378, "자유 원소 3,4,6의 포함 여부만 선택한다.", 15, cls="muted")
    save(exam, 8, "문항 8 해설: X의 포함·제외·자유 원소", "U={1,…,7}, A={1,2}, B={5,7}에서 X의 원소 상태를 분류한 표", body,
         {"U": list(range(1, 8)), "forced": [1, 2], "forbidden": [5, 7], "free": [3, 4, 6], "count": 8})


def make_palma_q7() -> None:
    exam = "22_팔마고_2학기_중간_고1_기출"
    body = tx(28, 38, "교집합의 두 극단을 실제 인원 배치로 확인한다", 22, weight="700")
    body += tx(28, 67, "M은 작은 집합 B에 모두 겹칠 때, m은 합집합이 24명이 될 때", 15, cls="muted")
    body += venn(34, 96, universe="전체 24명", a_label="A=14", b_label="B=12", a_only="2", both="12", b_only="0", outside="10", title="최대 M=12", accent="#16a34a")
    body += venn(388, 96, universe="전체 24명", a_label="A=14", b_label="B=12", a_only="12", both="2", b_only="10", outside="0", title="최소 m=2", accent="#2563eb")
    body += pill(34, 352, 220, "M=12", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += pill(272, 352, 220, "m=14−24+12=2", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    body += tx(520, 374, "M+m=14", 24, fill="#1d4ed8", weight="700")
    save(exam, 7, "문항 7 해설: 교집합의 최대·최소 배치", "24명 중 A=14명, B=12명일 때 교집합의 최대와 최소를 두 Venn 배치로 비교", body,
         {"total": 24, "A": 14, "B": 12, "max_intersection": 12, "min_intersection": 2, "result": 14})


def make_palma_q14() -> None:
    exam = "22_팔마고_2학기_중간_고1_기출"
    body = tx(28, 38, "A♥B는 같은 소속인 두 영역을 남기는 연산이다", 22, weight="700")
    body += tx(28, 67, "U={a,b,c,d,e,f}, A♥B=(A−B)ᶜ∩(B−A)ᶜ", 15, cls="muted")
    body += panel(30, 94, 330, 232, "네 영역의 의미", accent="#7c3aed")
    cx1, cx2, cy, r = 138, 232, 196, 64
    body += circle(cx1, cy, r, fill="#ef4444", stroke="#b91c1c", opacity=0.28)
    body += circle(cx2, cy, r, fill="#ef4444", stroke="#b91c1c", opacity=0.28)
    body += rect(74, 268, 220, 38, fill="#dcfce7", stroke="#16a34a", rx=8)
    body += tx(184, 293, "A♥B: 함께 또는 둘 다 아님", 13, anchor="middle", fill="#166534", weight="700")
    body += tx(101, 195, "A만", 14, fill="#991b1b", weight="700")
    body += tx(269, 195, "B만", 14, fill="#991b1b", weight="700")
    body += tx(185, 199, "A∩B", 14, anchor="middle", fill="#166534", weight="700")
    body += tx(54, 160, "U 밖", 13, fill="#166534")
    body += tx(46, 316, "빨강=A△B, 초록=A♥B", 13, cls="muted")
    body += panel(388, 94, 336, 232, "보기별 결정 단계", accent="#2563eb")
    body += tspans(408, 158, ["ㄱ: 첫 결과 크기 4, 둘째 결과 크기 4", "ㄴ: A♥Bᶜ=Aᶜ♥B", "ㄷ: A♥B=U → A=B → 2⁶=64"], 14, line_gap=35, fill="#334155")
    body += line(408, 264, 704, 264, stroke="#e2e8f0")
    body += tx(408, 302, "따라서 ㄱ, ㄴ만 참", 18, fill="#1d4ed8", weight="700")
    save(exam, 14, "문항 14 해설: A♥B의 네 영역과 보기 검토", "U={a,b,c,d,e,f}에서 대칭차집합과 그 여집합의 네 영역 및 세 보기의 핵심 계산", body,
         {"U": ["a", "b", "c", "d", "e", "f"], "same_membership": ["A∩B", "U−(A∪B)"], "different_membership": ["A−B", "B−A"], "q_g_count": 4, "q_d_count": 64})


def make_palma_q20() -> None:
    exam = "22_팔마고_2학기_중간_고1_기출"
    body = tx(28, 38, "집합 등식의 양쪽에만 나타나는 원소는 X에 고정된다", 22, weight="700")
    body += tx(28, 67, "(A−B)∪X = X∪(B−A)의 양변을 비교한 상태표", 15, cls="muted")
    body += state_table([
        ("전체집합 U", "{1,2,4,8,11,13,15}", "#334155"),
        ("왼쪽에만 나타남", "A−B={4,11}  →  X에 포함", "#166534"),
        ("오른쪽에만 나타남", "B−A={2,13}  →  X에 포함", "#166534"),
        ("자유 선택", "{1,8,15}  →  3개", "#1d4ed8"),
    ])
    body += pill(44, 315, 310, "{2,4,11,13}⊆X", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(390, 337, "n(X)=2³=8", 24, fill="#1d4ed8", weight="700")
    body += tx(44, 378, "고정된 네 원소 외의 1,8,15는 등식의 양변에 이미 대칭적으로 나타난다.", 14, cls="muted")
    save(exam, 20, "문항 20 해설: X의 고정·자유 원소", "U={1,2,4,8,11,13,15}에서 A−B와 B−A를 비교해 X를 세는 상태표", body,
         {"U": [1, 2, 4, 8, 11, 13, 15], "A_minus_B": [4, 11], "B_minus_A": [2, 13], "forced": [2, 4, 11, 13], "free": [1, 8, 15], "count": 8})


def make_keumdang_final_q20() -> None:
    exam = "22_금당고_2학기_기말_고1_기출"
    pairs = ["(5,{1,9})", "(5,{2,8})", "(5,{3,7})", "(5,{4,6})",
             "(10,{1,8})", "(10,{2,7})", "(10,{3,6})", "(10,{4,5})"]
    triples = ["(5,{1,2,7})", "(5,{1,3,6})", "(10,{1,2,6})", "(10,{1,3,5})", "(10,{2,3,4})"]
    body = tx(28, 38, "c+5ΣS=55를 만족하는 S의 크기를 나누어 센다", 22, weight="700")
    body += tx(28, 67, "c는 공통 원소, S=(A−B)∪(B−A)인 대칭차집합", 15, cls="muted")
    body += panel(30, 94, 342, 262, "|S|=2", accent="#2563eb")
    body += tx(48, 151, "후보 8개", 16, fill="#1d4ed8", weight="700")
    for i, value in enumerate(pairs):
        col, row = i // 4, i % 4
        body += tx(48 + col * 155, 169 + row * 31, value, 14, cls="math")
    body += line(48, 292, 354, 292, stroke="#e2e8f0")
    body += tx(48, 322, "8×2²=8×4=32", 18, fill="#166534", weight="700")
    body += panel(388, 94, 342, 262, "|S|=3", accent="#7c3aed")
    body += tx(406, 151, "후보 5개", 16, fill="#6d28d9", weight="700")
    for i, value in enumerate(triples):
        body += tx(406, 169 + i * 27, value, 14, cls="math")
    body += line(406, 292, 712, 292, stroke="#e2e8f0")
    body += tx(406, 322, "5×2³=5×8=40", 18, fill="#166534", weight="700")
    body += pill(30, 376, 230, "|S|=2: 32", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    body += pill(274, 376, 230, "|S|=3: 40", fill="#ede9fe", stroke="#7c3aed", text_fill="#6d28d9")
    body += tx(530, 399, "32+40=72", 22, fill="#166534", weight="700")
    save(exam, 20, "문항 20 해설: S의 크기별 후보와 배분 경우", "c+5ΣS=55에서 |S|=2의 8개 후보와 |S|=3의 5개 후보 및 각 배분 경우를 나눈 표", body,
         {"equation": "c+5ΣS=55", "size2": pairs, "size2_count": 8, "size2_assignments": 4, "size3": triples, "size3_count": 5, "size3_assignments": 8, "result": 72})


def make_hyocheon_q10() -> None:
    exam = "22_효천고_2학기_중간_고1_기출"
    body = tx(28, 38, "교집합의 최대·최소를 두 Venn 배치로 확인한다", 22, weight="700")
    body += tx(28, 67, "45명 중 A=28명, B=23명인 실제 네 영역", 15, cls="muted")
    body += venn(34, 96, universe="전체 45명", a_label="A=28", b_label="B=23", a_only="5", both="23", b_only="0", outside="17", title="최대 x=23", accent="#16a34a")
    body += venn(388, 96, universe="전체 45명", a_label="A=28", b_label="B=23", a_only="22", both="6", b_only="17", outside="0", title="최소 x=6", accent="#2563eb")
    body += pill(34, 352, 220, "x최대=23", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += pill(272, 352, 220, "x최소=28+23−45=6", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    body += tx(520, 374, "23+6=29", 24, fill="#1d4ed8", weight="700")
    save(exam, 10, "문항 10 해설: 두 영화 교집합의 극단", "45명 중 두 영화 관람 인원 28명과 23명에서 교집합의 최대·최소를 비교한 Venn diagram", body,
         {"total": 45, "A": 28, "B": 23, "max_intersection": 23, "min_intersection": 6, "result": 29})


def make_hyocheon_q12() -> None:
    exam = "22_효천고_2학기_중간_고1_기출"
    body = tx(28, 38, "2가 대칭차집합에 없다는 조건으로 후보를 좁힌다", 22, weight="700")
    body += tx(28, 67, "a=3,2,−2를 원래 집합에 대입해 A△B={0,1}인지 확인", 15, cls="muted")
    body += rect(34, 94, 692, 218, fill="#ffffff", stroke="#cbd5e1")
    headers = [(52, "a", 55), (124, "A", 185), (320, "B", 185), (516, "A△B", 180)]
    for x, label, _ in headers:
        body += tx(x, 123, label, 15, weight="700")
    body += line(44, 136, 716, 136, stroke="#94a3b8")
    rows = [("3", "{3,2,7}", "{2,3,1}", "{1,7}", "#b91c1c"),
            ("2", "{1,2,3}", "{0,2,3}", "{0,1}  ✓", "#166534"),
            ("−2", "{3,−3,2}", "{2,3,−4}", "{−4,−3}", "#b91c1c")]
    for i, row in enumerate(rows):
        y = 174 + i * 45
        if i:
            body += line(44, y - 25, 716, y - 25, stroke="#e2e8f0", sw=1)
        for (x, _, _), value in zip(headers, row[:4]):
            body += tx(x, y, value, 16, cls="math-strong" if x == 52 else "text", fill=row[4] if x == 516 else None)
    body += pill(48, 345, 270, "a=2, b=6", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(344, 366, "b−a=6−2=4", 22, fill="#1d4ed8", weight="700")
    save(exam, 12, "문항 12 해설: 대칭차집합 후보표", "a=3,2,−2에 따른 A와 B 및 실제 대칭차집합을 비교한 표", body,
         {"candidates": [{"a": 3, "symmetric_difference": [1, 7]}, {"a": 2, "symmetric_difference": [0, 1]}, {"a": -2, "symmetric_difference": [-4, -3]}], "b": 6, "result": 4})


def make_jeil_q11() -> None:
    exam = "22_제일고_2학기_중간_고1_기출"
    body = tx(28, 38, "A의 두 원소가 B에 들어가는 a 후보의 교집합을 찾는다", 22, weight="700")
    body += tx(28, 67, "a∈B의 후보와 a+2∈B의 후보를 각각 계산", 15, cls="muted")
    body += panel(34, 96, 330, 214, "첫 번째 원소 a", accent="#2563eb")
    body += tspans(54, 141, ["a=3a−4 → a=2", "a=2a−2 → a=2", "a=2a−3 → a=3", "후보: {2,3}"], 15, line_gap=35, fill="#334155")
    body += panel(394, 96, 330, 214, "두 번째 원소 a+2", accent="#7c3aed")
    body += tspans(414, 141, ["a+2=3a−4 → a=3", "a+2=2a−2 → a=4", "a+2=2a−3 → a=5", "후보: {3,4,5}"], 15, line_gap=35, fill="#334155")
    body += line(184, 334, 576, 334, stroke="#16a34a", sw=2.2)
    body += tx(380, 326, "공통 후보 a=3", 18, anchor="middle", fill="#166534", weight="700")
    body += tx(38, 374, "a=3이면 A={3,5}, B={3,4,5}이므로 A⊊B가 실제로 성립한다.", 15, cls="muted")
    save(exam, 11, "문항 11 해설: 진부분집합 후보 교집합", "A의 두 원소가 B의 세 식 중 하나와 같아지는 후보를 비교해 a=3을 고르는 도식", body,
         {"first_candidates": [2, 3], "second_candidates": [3, 4, 5], "intersection": [3], "A": [3, 5], "B": [3, 4, 5]})


def make_jeil_q13() -> None:
    exam = "22_제일고_2학기_중간_고1_기출"
    body = tx(28, 38, "두 괄호를 먼저 정리하면 B와 Bᶜ가 남는다", 22, weight="700")
    body += tx(28, 67, "분배법칙: (X∪Z)∩(Y∪Z)=(X∩Y)∪Z", 15, cls="muted")
    body += panel(34, 98, 692, 214, "문항의 실제 식을 두 줄로 변형", accent="#2563eb")
    body += tx(54, 145, "(A∪B)∩(Aᶜ∪B)", 19, cls="math-strong")
    body += tx(350, 145, "= (A∩Aᶜ)∪B = B", 19, fill="#1d4ed8", weight="700")
    body += tx(54, 205, "(Aᶜ∪Bᶜ)∩(A∪Bᶜ)", 19, cls="math-strong")
    body += tx(350, 205, "= (Aᶜ∩A)∪Bᶜ = Bᶜ", 19, fill="#1d4ed8", weight="700")
    body += line(54, 242, 704, 242, stroke="#e2e8f0")
    body += pill(54, 270, 260, "B∪Bᶜ=U", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(354, 293, "최종 결과: U", 22, fill="#166534", weight="700")
    save(exam, 13, "문항 13 해설: 집합식의 두 단계 분배", "문항에 제시된 두 괄호가 각각 B와 Bᶜ로 정리된 뒤 전체집합 U가 되는 변형 흐름", body,
         {"first_reduction": "B", "second_reduction": "Bᶜ", "result": "U"})


def make_jeil_q19() -> None:
    exam = "22_제일고_2학기_중간_고1_기출"
    body = tx(28, 38, "교집합 x의 상한과 하한을 실제 배치로 달성한다", 22, weight="700")
    body += tx(28, 67, "x≤min(25,32), 25+32−x≤50", 15, cls="muted")
    body += venn(34, 96, universe="전체 50명", a_label="A=25", b_label="B=32", a_only="0", both="25", b_only="7", outside="18", title="최대 x=25", accent="#16a34a")
    body += venn(388, 96, universe="전체 50명", a_label="A=25", b_label="B=32", a_only="18", both="7", b_only="25", outside="0", title="최소 x=7", accent="#2563eb")
    body += tx(388, 342, "최소 배치에서는 합집합이 50명이 되도록 x=7", 14, cls="muted")
    body += pill(34, 352, 220, "x최대=25", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += pill(272, 352, 220, "x최소=25+32−50=7", fill="#dbeafe", stroke="#2563eb", text_fill="#1d4ed8")
    save(exam, 19, "문항 19 해설: 교집합 x의 최대·최소", "50명 학급에서 A=25명, B=32명일 때 x=25와 x=7을 보여 주는 두 Venn 배치", body,
         {"total": 50, "A": 25, "B": 32, "max_intersection": 25, "min_intersection": 7})


def make_jeil_q20() -> None:
    exam = "22_제일고_2학기_중간_고1_기출"
    body = tx(28, 38, "교집합의 두 원소와 제곱 관계를 순서대로 확정한다", 22, weight="700")
    body += tx(28, 67, "a₁+a₄=10, A∩B={a₁,a₄}, Σ(aᵢ+aᵢ²)=242", 15, cls="muted")
    body += panel(34, 96, 326, 220, "앞의 두 원소", accent="#7c3aed")
    body += tspans(54, 140, ["a₁=1  (a₁이 제곱수 집합에 속해야 함)", "a₄=9", "9∈B → 3∈A"], 15, line_gap=39, fill="#334155")
    body += panel(394, 96, 330, 220, "합 조건으로 나머지 결정", accent="#2563eb")
    body += tspans(414, 140, ["T(t)=t²+t", "T(1)+T(9)=92", "T(a₂)+T(a₃)+T(a₅)=150", "a₂=2, a₃=3, a₅=11"], 15, line_gap=35, fill="#334155")
    body += pill(54, 342, 260, "A={1,2,3,9,11}", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(350, 364, "B={1,4,9,81,121}", 18, fill="#1d4ed8", weight="700")
    save(exam, 20, "문항 20 해설: A와 제곱 집합의 후보 결정", "A∩B={a₁,a₄}, a₁+a₄=10, 합집합 원소 합 232에서 실제 A와 B를 복원하는 수치 흐름", body,
         {"a1": 1, "a4": 9, "a2": 2, "a3": 3, "a5": 11, "A": [1, 2, 3, 9, 11], "B": [1, 4, 9, 81, 121], "sumT_remaining": 150})


def make_final_gangnam_q5() -> None:
    exam = "22_강남여고_2학기_기말_고1_기출"
    body = tx(28, 38, "차집합을 교집합으로 바꾸고 A를 묶는다", 22, weight="700")
    body += tx(28, 67, "문항의 실제 식 (A−B)∪(A∩C)와 다섯 번째 보기를 비교", 15, cls="muted")
    body += panel(34, 98, 692, 214, "동일한 집합으로 가는 두 경로", accent="#2563eb")
    body += tx(54, 143, "(A−B)∪(A∩C)", 19, cls="math-strong")
    body += tx(335, 143, "= (A∩Bᶜ)∪(A∩C)", 18, fill="#1d4ed8", weight="700")
    body += tx(54, 205, "= A∩(Bᶜ∪C)", 20, fill="#166534", weight="700")
    body += tx(335, 205, "= A−(B−C)", 20, fill="#166534", weight="700")
    body += line(54, 242, 704, 242, stroke="#e2e8f0")
    body += pill(54, 270, 260, "정답 보기: A−(B−C)", fill="#dcfce7", stroke="#16a34a", text_fill="#166534")
    body += tx(354, 293, "A∩(Bᶜ∪C)와 같은 식", 18, fill="#1d4ed8", weight="700")
    save(exam, 5, "문항 5 해설: 집합 연산식의 동치 변형", "문항의 실제 연산식이 A−(B−C)와 같아지는 두 단계 대수 변형", body,
         {"left": "(A−B)∪(A∩C)", "middle": "A∩(Bᶜ∪C)", "matching_choice": "A−(B−C)"})


def main() -> None:
    make_gangnam_q10()
    make_keumdang_mid_q13()
    make_keumdang_mid_q16()
    make_maesan_q6()
    make_maesan_q17()
    make_maesan_q19()
    make_bokseong_q15()
    make_bokseong_q21()
    make_suncheon_q4()
    make_suncheon_q8()
    make_palma_q7()
    make_palma_q14()
    make_palma_q20()
    make_keumdang_final_q20()
    make_hyocheon_q10()
    make_hyocheon_q12()
    make_jeil_q11()
    make_jeil_q13()
    make_jeil_q19()
    make_jeil_q20()
    make_final_gangnam_q5()


if __name__ == "__main__":
    main()
