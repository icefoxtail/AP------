import re
import json
import math
import argparse
from pathlib import Path
from copy import deepcopy


# =========================================================
# 0. 공통 설정
# =========================================================

PLACEHOLDERS = [
    "[도형필요]",
    "[해설도형필요]",
    "[SVG필요]",
    "[그래프필요]",
    "[도형]",
    "[해설도형]",
    "[표필요]",
    "[TABLE필요]",
]

SIZE_RULES = {
    "relation_table": {"max_width": 330, "font_pt_range": (8.4, 9.4)},
    "compact_value_table": {"max_width": 320, "font_pt_range": (8.2, 9.2)},
    "angle_conversion_table": {"max_width": 320, "font_pt_range": (8.2, 9.2)},
    "boxed_equivalence_layout": {"max_width": 360, "font_pt_range": (8.4, 9.6)},
    "custom_html": {"max_width": 360, "font_pt_range": (8.0, 10.0)},
    "exp_single_curve": {"max_width": 230, "max_height": 160, "font_px_range": (8, 12)},
    "annular_sector": {"max_width": 260, "max_height": 180, "font_px_range": (8, 11)},
    "quarter_arc_partition": {"max_width": 220, "max_height": 200, "font_px_range": (7, 11)},
    "trig_repetition_schematic": {"max_width": 240, "max_height": 135, "font_px_range": (8, 11)},
    "exp_log_line_intersection": {"max_width": 260, "max_height": 220, "font_px_range": (8, 11)},
    "trig_dual_curve_compare": {"max_width": 320, "max_height": 210, "font_px_range": (8, 11)},
    "custom_svg": {"max_width": 320, "max_height": 240, "font_px_range": (7, 12)},
}

REQUIRED_LABEL_RULES = {
    1: ["①", "②", "③", "④", "⑤"],
    3: ["2.3", "0.3636"],
    5: ["O", "x", "y", "2", "7/3"],
    6: ["60분법", "호도법", "π"],
    9: ["O", "A", "B", "C", "D", "6", "12", "2", "3", "π"],
    16: ["O", "P", "Q", "1"],
    18: ["0", "1", "-a+b", "4", "..."],
    20: ["O", "A", "B", "2k", "y=f(x)", "y=g(x)", "y=-x+2k"],
    23: ["π", "7π/4", "2π"],
}


HTML_LIKE_TYPES = {
    "relation_table",
    "compact_value_table",
    "angle_conversion_table",
    "boxed_equivalence_layout",
    "custom_html",
}

SVG_LIKE_TYPES = {
    "exp_single_curve",
    "annular_sector",
    "quarter_arc_partition",
    "trig_repetition_schematic",
    "exp_log_line_intersection",
    "trig_dual_curve_compare",
    "custom_svg",
}


# =========================================================
# 1. 파일 / 문자열 유틸
# =========================================================

def load_json(path: str | Path):
    path = Path(path)
    return json.loads(path.read_text(encoding="utf-8"))


def save_text(path: str | Path, text: str):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def normalize_br_spacing(text: str) -> str:
    if not isinstance(text, str):
        return text
    s = text.strip()
    s = re.sub(r'(?:\s*<br\s*/?>\s*){3,}', '<br><br>', s, flags=re.IGNORECASE)
    return s.strip()


def wrap_visual_block(fragment: str) -> str:
    return f'<div style="text-align:center;">\n{fragment.strip()}\n</div>'


def extract_first_svg_block(text: str):
    if not isinstance(text, str):
        return None
    m = re.search(r'<svg\b[\s\S]*?</svg>', text, flags=re.IGNORECASE)
    return m.group(0) if m else None


def extract_first_table_block(text: str):
    if not isinstance(text, str):
        return None
    m = re.search(r'<table\b[\s\S]*?</table>', text, flags=re.IGNORECASE)
    return m.group(0) if m else None


def strip_existing_visual_wrappers(text: str) -> str:
    if not isinstance(text, str):
        return text

    s = text
    s = re.sub(r'<div[^>]*>\s*(<svg\b[\s\S]*?</svg>)\s*</div>', '', s, flags=re.IGNORECASE)
    s = re.sub(r'<div[^>]*>\s*(<table\b[\s\S]*?</table>)\s*</div>', '', s, flags=re.IGNORECASE)
    s = re.sub(r'<svg\b[\s\S]*?</svg>', '', s, flags=re.IGNORECASE)
    s = re.sub(r'<table\b[\s\S]*?</table>', '', s, flags=re.IGNORECASE)
    return normalize_br_spacing(s)


def split_prompt_and_rest(content: str):
    """
    발문 / 나머지 본문 분리
    - 첫 visual(svg/table/div+svg/div+table) 앞까지 = 발문
    - visual 제거 후 뒤 텍스트 = rest
    """
    if not isinstance(content, str):
        return "", ""

    original = content.strip()
    positions = []

    patterns = [
        r'<svg\b',
        r'<table\b',
        r'<div[^>]*>\s*<svg\b',
        r'<div[^>]*>\s*<table\b',
    ]

    for pat in patterns:
        m = re.search(pat, original, flags=re.IGNORECASE)
        if m:
            positions.append(m.start())

    if not positions:
        return normalize_br_spacing(original), ""

    cut = min(positions)
    prompt = original[:cut].strip()
    remainder = original[cut:].strip()
    rest = strip_existing_visual_wrappers(remainder).strip()

    return normalize_br_spacing(prompt), normalize_br_spacing(rest)


def rebuild_content_with_visual(prompt: str, fragment: str, rest: str = "") -> str:
    """
    최상위 규칙:
    발문 -> 시각자료 -> 나머지 본문
    """
    parts = []
    prompt = (prompt or "").strip()
    fragment = (fragment or "").strip()
    rest = (rest or "").strip()

    if prompt:
        parts.append(prompt)
    if fragment:
        parts.append(fragment)
    if rest:
        parts.append(rest)

    return "<br><br>".join(parts).strip()


def replace_or_insert_visual(text: str, fragment: str) -> str:
    if not isinstance(text, str):
        return text

    wrapped = wrap_visual_block(fragment)

    for token in PLACEHOLDERS:
        if token in text:
            return normalize_br_spacing(text.replace(token, wrapped))

    prompt, rest = split_prompt_and_rest(text)
    return rebuild_content_with_visual(prompt, wrapped, rest)


# =========================================================
# 2. JS parser / writer
# =========================================================

def extract_exam_title(js_text: str) -> str:
    m = re.search(r'window\.examTitle\s*=\s*(["\'])(.*?)\1\s*;', js_text, re.DOTALL)
    return m.group(2) if m else ""


def extract_question_bank_array_text(js_text: str) -> str:
    anchor = re.search(r'window\.questionBank\s*=\s*\[', js_text)
    if not anchor:
        raise ValueError("window.questionBank 배열을 찾지 못했습니다.")

    start = js_text.find('[', anchor.start())
    if start == -1:
        raise ValueError("questionBank 시작 대괄호를 찾지 못했습니다.")

    i = start
    depth = 0
    in_string = False
    quote = ""
    escape = False

    while i < len(js_text):
        ch = js_text[i]

        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == quote:
                in_string = False
        else:
            if ch in ("'", '"'):
                in_string = True
                quote = ch
            elif ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    return js_text[start:i + 1]
        i += 1

    raise ValueError("questionBank 배열 끝을 찾지 못했습니다.")


def js_object_literal_to_json_text(js_array_text: str) -> str:
    s = js_array_text

    s = re.sub(r'^\s*window\.questionBank\s*=\s*', '', s)
    s = re.sub(r'//.*', '', s)
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.DOTALL)

    out = []
    in_string = False
    quote = ""
    escape = False

    for ch in s:
        if in_string:
            if escape:
                out.append(ch)
                escape = False
            elif ch == "\\":
                out.append(ch)
                escape = True
            elif ch == quote:
                out.append('"')
                in_string = False
            else:
                out.append(ch)
        else:
            if ch in ("'", '"'):
                in_string = True
                quote = ch
                out.append('"')
            else:
                out.append(ch)

    s = ''.join(out)
    s = re.sub(r'([{,]\s*)([A-Za-z_가-힣][A-Za-z0-9_가-힣]*)(\s*:)', r'\1"\2"\3', s)
    s = re.sub(r',(\s*[}\]])', r'\1', s)
    return s


def parse_question_bank(js_text: str):
    array_text = extract_question_bank_array_text(js_text)
    json_text = js_object_literal_to_json_text(array_text)
    return json.loads(json_text)


def question_bank_to_js(question_bank, exam_title: str = "") -> str:
    title_line = f'window.examTitle = {json.dumps(exam_title, ensure_ascii=False)};\n\n' if exam_title else ""
    bank_json = json.dumps(question_bank, ensure_ascii=False, indent=2)
    return f'{title_line}window.questionBank = {bank_json};\n'


# =========================================================
# 3. 렌더러
# =========================================================

def render_relation_table(spec: dict):
    p = spec["params"]
    title = p.get("title", "")
    rows = p.get("rows", [])
    max_width = int(p.get("maxWidth", 290))
    font_pt = float(p.get("fontPt", 8.6))
    line_height = float(p.get("lineHeight", 1.3))

    html = []
    html.append('<div style="text-align:center;">')
    html.append(
        f'<table style="width:100%; max-width:{max_width}px; text-align:center; margin: 3px auto 0 auto; border: none; font-size: {font_pt}pt; line-height: {line_height};">'
    )

    if title:
        colspan = max(1, len(rows[0]) if rows else 1)
        html.append(f'<tr><td colspan="{colspan}" style="padding-bottom:2px;">{title}</td></tr>')

    for row in rows:
        html.append("<tr>")
        for cell in row:
            html.append(f"<td>{cell}</td>")
        html.append("</tr>")

    html.append("</table>")
    html.append("</div>")
    return "".join(html), {"type": "relation_table"}


def render_compact_value_table(spec: dict):
    p = spec["params"]

    if p.get("custom_html"):
        html = p["html"]
        return html, {"type": "compact_value_table"}

    headers = p["headers"]
    row_headers = p.get("rowHeaders", p.get("row_headers", []))
    cells = p["cells"]
    width = int(p.get("width", 220))
    font_pt = float(p.get("fontPt", 8.6))
    pad_px = int(p.get("cellPaddingPx", 2))

    html = []
    html.append('<div style="text-align:center;">')
    html.append(
        f'<table style="border-collapse: collapse; text-align: center; margin: 4px auto 0 auto; width: {width}px; border: 1.2px solid black; font-family: serif; font-size: {font_pt}pt;">'
    )
    html.append('<tr style="background:#fcfcfc;">')
    html.append(f'<th style="border: 1px solid black; padding: {pad_px}px;"></th>')
    for h in headers:
        html.append(f'<th style="border: 1px solid black; padding: {pad_px}px;">{h}</th>')
    html.append("</tr>")

    for i, rh in enumerate(row_headers):
        html.append("<tr>")
        html.append(f'<td style="border: 1px solid black; padding: {pad_px}px; font-weight: bold;">{rh}</td>')
        for c in cells[i]:
            html.append(f'<td style="border: 1px solid black; padding: {pad_px}px;">{c}</td>')
        html.append("</tr>")

    html.append("</table>")
    html.append("</div>")
    return "".join(html), {"type": "compact_value_table"}


def render_exp_single_curve(spec: dict):
    p = spec["params"]

    width = int(p.get("width", 220))
    height = int(p.get("height", 145))
    base = float(p.get("base", 3))
    shift_x = float(p.get("shift_x", 1))
    shift_y = float(p.get("shift_y", 2))
    x_min = float(p.get("x_min", -1.2))
    x_max = float(p.get("x_max", 1.35))
    y_min = float(p.get("y_min", 1.8))
    y_max = float(p.get("y_max", 7.2))
    marked_x = float(p.get("marked_point_x", 0))
    marked_label = str(p.get("marked_point_label", "7/3"))
    asymptote_y = float(p.get("asymptote_y", 2))
    sample_count = int(p.get("sample_count", 100))
    show_origin = bool(p.get("show_origin", True))

    pad_l, pad_r, pad_t, pad_b = 10, 25, 10, 25
    x0, x1 = pad_l, width - pad_r
    y0, y1 = pad_t, height - pad_b

    def map_x(x):
        return x0 + (x - x_min) / (x_max - x_min) * (x1 - x0)

    def map_y(y):
        return y1 - (y - y_min) / (y_max - y_min) * (y1 - y0)

    def f(x):
        return (base ** (x - shift_x)) + shift_y

    pts = []
    for i in range(sample_count + 1):
        x = x_min + (x_max - x_min) * i / sample_count
        y = f(x)
        if y_min <= y <= y_max:
            pts.append((map_x(x), map_y(y)))

    point_str = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)

    axis_y = map_y(0)
    axis_x = map_x(0)
    asym_y = map_y(asymptote_y)
    mx = map_x(marked_x)
    my = map_y(f(marked_x))

    origin_text = ""
    if show_origin:
        origin_text = f'<text x="{axis_x-11:.1f}" y="{axis_y+15:.1f}" font-size="11" font-family="serif">O</text>'

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="{x0:.1f}" y1="{axis_y:.1f}" x2="{x1:.1f}" y2="{axis_y:.1f}" stroke="black" stroke-width="1.2"/>
  <polygon points="{x1:.1f},{axis_y:.1f} {x1-6:.1f},{axis_y-3:.1f} {x1-6:.1f},{axis_y+3:.1f}" fill="black"/>
  <line x1="{axis_x:.1f}" y1="{y1:.1f}" x2="{axis_x:.1f}" y2="{y0:.1f}" stroke="black" stroke-width="1.2"/>
  <polygon points="{axis_x:.1f},{y0:.1f} {axis_x-3:.1f},{y0+6:.1f} {axis_x+3:.1f},{y0+6:.1f}" fill="black"/>
  {origin_text}
  <line x1="{x0:.1f}" y1="{asym_y:.1f}" x2="{x1-10:.1f}" y2="{asym_y:.1f}" stroke="black" stroke-width="0.9" stroke-dasharray="3 3"/>
  <text x="{x0+4:.1f}" y="{asym_y-6:.1f}" font-size="10.5" font-family="serif">y=2</text>
  <circle cx="{mx:.1f}" cy="{my:.1f}" r="2.6" fill="black"/>
  <text x="{mx+7:.1f}" y="{my+3:.1f}" font-size="11" font-family="serif">{marked_label}</text>
  <polyline points="{point_str}" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
""".strip()

    return svg, {"type": "exp_single_curve"}


def render_annular_sector(spec: dict):
    p = spec["params"]

    width = int(p.get("width", 220))
    height = int(p.get("height", 155))
    cx = float(p.get("cx", 110))
    cy = float(p.get("cy", 145))
    r_outer = float(p.get("r_outer", 100))
    r_inner = float(p.get("r_inner", 50))
    theta1_deg = float(p.get("theta1_deg", 150))
    theta2_deg = float(p.get("theta2_deg", 30))

    def pol(r, deg):
        th = math.radians(deg)
        return (cx + r * math.cos(th), cy - r * math.sin(th))

    x1o, y1o = pol(r_outer, theta1_deg)
    x2o, y2o = pol(r_outer, theta2_deg)
    x1i, y1i = pol(r_inner, theta1_deg)
    x2i, y2i = pol(r_inner, theta2_deg)

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <path d="M {cx:.1f} {cy:.1f} L {x1o:.1f} {y1o:.1f} A {r_outer:.1f} {r_outer:.1f} 0 0 1 {x2o:.1f} {y2o:.1f} Z" fill="none" stroke="black" stroke-width="1.8"/>
  <path d="M {cx:.1f} {cy:.1f} L {x1i:.1f} {y1i:.1f} A {r_inner:.1f} {r_inner:.1f} 0 0 1 {x2i:.1f} {y2i:.1f} Z" fill="none" stroke="black" stroke-width="1.8"/>
  <text x="{cx:.1f}" y="{cy+7:.1f}" font-size="10" font-family="serif" text-anchor="middle">O</text>
  <text x="{x1i-5:.1f}" y="{y1i+2:.1f}" font-size="9" font-family="serif" text-anchor="end">B</text>
  <text x="{x2i+5:.1f}" y="{y2i+2:.1f}" font-size="9" font-family="serif" text-anchor="start">A</text>
  <text x="{x1o-3:.1f}" y="{y1o:.1f}" font-size="9" font-family="serif" text-anchor="end">D</text>
  <text x="{x2o+3:.1f}" y="{y2o:.1f}" font-size="9" font-family="serif" text-anchor="start">C</text>
  <text x="{cx-25:.1f}" y="{cy-5:.1f}" font-size="9" font-family="serif" text-anchor="end">6cm</text>
  <text x="{cx+35:.1f}" y="{cy-35:.1f}" font-size="9" font-family="serif" text-anchor="start">12cm</text>
  <text x="{cx:.1f}" y="{cy-15:.1f}" font-size="10" font-family="serif" text-anchor="middle">2π/3</text>
</svg>
""".strip()

    return svg, {"type": "annular_sector"}


def render_quarter_arc_partition(spec: dict):
    p = spec["params"]

    width = int(p.get("width", 215))
    height = int(p.get("height", 190))
    ox = float(p.get("ox", 35))
    oy = float(p.get("oy", 155))
    r = float(p.get("radius", 150))
    n = int(p.get("n_partition", 9))

    pts = []
    for i in range(1, n):
        th = (math.pi / 2) - (math.pi / 2) * (i / n)
        px = ox + r * math.cos(th)
        py = oy - r * math.sin(th)
        pts.append((px, py))

    rays, drops, p_labels, q_labels = [], [], [], []

    sub_map = {
        1: "₁", 2: "₂", 3: "₃", 4: "₄",
        5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉"
    }

    for i, (px, py) in enumerate(pts, start=1):
        sub = sub_map.get(i, str(i))
        rays.append(f'<line x1="{ox:.1f}" y1="{oy:.1f}" x2="{px:.1f}" y2="{py:.1f}" stroke="black" stroke-width="0.6"/>')
        drops.append(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{px:.1f}" y2="{oy:.1f}" stroke="black" stroke-width="0.5" stroke-dasharray="2 1" opacity="0.4"/>')
        p_labels.append(f'<text x="{px-3:.1f}" y="{py-1:.1f}" font-size="7.2" font-family="serif">P{sub}</text>')
        q_labels.append(f'<text x="{px:.1f}" y="{oy+13:.1f}" font-size="7.2" font-family="serif" text-anchor="middle">Q{sub}</text>')

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <path d="M {ox:.1f} {oy:.1f} L {ox+r:.1f} {oy:.1f}" fill="none" stroke="black" stroke-width="1.2"/>
  <path d="M {ox:.1f} {oy:.1f} L {ox:.1f} {oy-r:.1f}" fill="none" stroke="black" stroke-width="1.2"/>
  <path d="M {ox:.1f} {oy-r:.1f} A {r:.1f} {r:.1f} 0 0 1 {ox+r:.1f} {oy:.1f}" fill="none" stroke="black" stroke-width="1.5"/>
  {"".join(rays)}
  {"".join(drops)}
  <text x="{ox-13:.1f}" y="{oy+13:.1f}" font-size="10" font-family="serif">O</text>
  <text x="{ox+r+2:.1f}" y="{oy+13:.1f}" font-size="10" font-family="serif">P</text>
  <text x="{ox-13:.1f}" y="{oy-r+5:.1f}" font-size="10" font-family="serif">Q</text>
  {"".join(p_labels)}
  {"".join(q_labels)}
  <text x="{ox+r/2:.1f}" y="{oy-5:.1f}" font-size="10" font-family="serif">1</text>
</svg>
""".strip()

    return svg, {"type": "quarter_arc_partition"}


def render_trig_repetition_schematic(spec: dict):
    p = spec["params"]
    width = int(p.get("width", 215))
    height = int(p.get("height", 112))

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="65" x2="200" y2="65" stroke="black" stroke-width="1.2"/>
  <line x1="30" y1="15" x2="30" y2="100" stroke="black" stroke-width="1.2"/>
  <line x1="20" y1="35" x2="200" y2="35" stroke="#ccc" stroke-width="0.8" stroke-dasharray="4 3"/>
  <line x1="20" y1="95" x2="200" y2="95" stroke="#ccc" stroke-width="0.8" stroke-dasharray="4 3"/>
  <text x="18" y="110" font-size="10" font-family="serif">0</text>
  <text x="205" y="40" font-size="9" font-family="serif">1</text>
  <text x="202" y="102" font-size="9" font-family="serif">-a+b</text>
  <polyline points="30,95 35,95 40,35 50,95 60,35 70,95 80,35" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="105" y="65" font-size="14" font-family="serif" text-anchor="middle">...</text>
  <polyline points="140,95 145,95 150,35 160,95 170,35 180,65" fill="none" stroke="black" stroke-width="1.2" opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="180" y="110" font-size="10" font-family="serif" text-anchor="middle">4</text>
</svg>
""".strip()

    return svg, {"type": "trig_repetition_schematic"}


def render_exp_log_line_intersection(spec: dict):
    p = spec["params"]
    width = int(p.get("width", 205))
    height = int(p.get("height", 132))

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="15" y1="105" x2="190" y2="105" stroke="black" stroke-width="1.1"/>
  <polygon points="190,105 184,102 184,108" fill="black"/>
  <line x1="50" y1="120" x2="50" y2="15" stroke="black" stroke-width="1.1"/>
  <polygon points="50,15 47,21 53,21" fill="black"/>
  <text x="40" y="118" font-size="11" font-family="serif">O</text>
  <line x1="30" y1="15" x2="140" y2="115" stroke="black" stroke-width="1.3"/>
  <path d="M 10 50 Q 25 35 42 12 T 48 -10" fill="none" stroke="black" stroke-width="1.5"/>
  <path d="M 85 125 Q 92 90 115 80 T 175 70" fill="none" stroke="black" stroke-width="1.5"/>
  <circle cx="115" cy="80" r="2.6" fill="black"/>
  <circle cx="42" cy="12" r="2.6" fill="black"/>
  <text x="118" y="78" font-size="10" font-family="serif">A</text>
  <text x="32" y="15" font-size="10" font-family="serif">B</text>
  <text x="125" y="118" font-size="10" font-family="serif">2k</text>
  <text x="165" y="100" font-size="9" font-family="serif">y=f(x)</text>
  <text x="15" y="60" font-size="9" font-family="serif">y=g(x)</text>
  <text x="150" y="125" font-size="9" font-family="serif">y=-x+2k</text>
</svg>
""".strip()

    return svg, {"type": "exp_log_line_intersection"}


def render_trig_dual_curve_compare(spec: dict):
    p = spec["params"]
    width = int(p.get("width", 230))
    height = int(p.get("height", 126))

    svg = f"""
<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="15" y1="95" x2="215" y2="95" stroke="black" stroke-width="1.1"/>
  <line x1="28" y1="110" x2="28" y2="15" stroke="black" stroke-width="1.1"/>
  <g stroke="black" stroke-width="0.7" stroke-dasharray="2 2" opacity="0.5">
    <line x1="50" y1="30" x2="50" y2="95"/><line x1="72" y1="30" x2="72" y2="95"/>
    <line x1="94" y1="30" x2="94" y2="95"/><line x1="116" y1="30" x2="116" y2="95"/>
    <line x1="138" y1="30" x2="138" y2="95"/><line x1="160" y1="30" x2="160" y2="95"/>
    <line x1="182" y1="30" x2="182" y2="95"/><line x1="204" y1="30" x2="204" y2="95"/>
  </g>
  <text x="116" y="108" font-size="9" font-family="serif" text-anchor="middle">π</text>
  <text x="182" y="108" font-size="9" font-family="serif" text-anchor="middle">7π/4</text>
  <text x="204" y="108" font-size="9" font-family="serif" text-anchor="middle">2π</text>
  <path d="M 28 65 Q 50 35 72 35 T 116 65 T 160 95 T 182 80 T 204 65" fill="none" stroke="black" stroke-width="1.5"/>
  <path d="M 28 95 Q 50 95 72 65 T 116 35 T 160 65 T 182 80 T 204 95" fill="none" stroke="#999" stroke-width="1.5"/>
  <circle cx="182" cy="80" r="2.4" fill="black"/>
  <text x="185" y="75" font-size="9" font-family="serif">(7π/4,0)</text>
</svg>
""".strip()

    return svg, {"type": "trig_dual_curve_compare"}


def render_fragment_by_spec(spec: dict):
    dtype = spec["type"]

    if dtype == "relation_table":
        return render_relation_table(spec)
    if dtype == "compact_value_table":
        return render_compact_value_table(spec)
    if dtype == "exp_single_curve":
        return render_exp_single_curve(spec)
    if dtype == "annular_sector":
        return render_annular_sector(spec)
    if dtype == "quarter_arc_partition":
        return render_quarter_arc_partition(spec)
    if dtype == "trig_repetition_schematic":
        return render_trig_repetition_schematic(spec)
    if dtype == "exp_log_line_intersection":
        return render_exp_log_line_intersection(spec)
    if dtype == "trig_dual_curve_compare":
        return render_trig_dual_curve_compare(spec)

    if dtype == "custom_html":
        html = spec["params"]["html"]
        return html, {"type": "custom_html"}

    if dtype == "custom_svg":
        svg = spec["params"]["svg"]
        return svg, {"type": "custom_svg"}

    raise ValueError(f"지원하지 않는 spec type: {dtype}")


# =========================================================
# 4. 검사기
# =========================================================

def extract_font_sizes(block: str):
    values = []
    if not isinstance(block, str):
        return values

    for m in re.finditer(r'font-size\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*(pt|px)', block, flags=re.IGNORECASE):
        values.append(float(m.group(1)))
    for m in re.finditer(r'font-size\s*=\s*"([0-9]+(?:\.[0-9]+)?)"', block, flags=re.IGNORECASE):
        values.append(float(m.group(1)))
    return values


def extract_dimensions(block: str):
    widths, heights = [], []

    if not isinstance(block, str):
        return {"widths": widths, "heights": heights}

    for m in re.finditer(r'\bwidth\s*=\s*"([0-9]+(?:\.[0-9]+)?)"', block, flags=re.IGNORECASE):
        widths.append(float(m.group(1)))
    for m in re.finditer(r'\bheight\s*=\s*"([0-9]+(?:\.[0-9]+)?)"', block, flags=re.IGNORECASE):
        heights.append(float(m.group(1)))
    for m in re.finditer(r'width\s*:\s*([0-9]+(?:\.[0-9]+)?)px', block, flags=re.IGNORECASE):
        widths.append(float(m.group(1)))
    for m in re.finditer(r'height\s*:\s*([0-9]+(?:\.[0-9]+)?)px', block, flags=re.IGNORECASE):
        heights.append(float(m.group(1)))
    for m in re.finditer(r'max-width\s*:\s*([0-9]+(?:\.[0-9]+)?)px', block, flags=re.IGNORECASE):
        widths.append(float(m.group(1)))

    return {"widths": widths, "heights": heights}


def inspect_fragment(fragment: str, visual_type: str, qid: int):
    summary = {
        "required_labels": REQUIRED_LABEL_RULES.get(qid, []),
        "missing_labels": [],
        "font_sizes": [],
        "widths": [],
        "heights": [],
        "status": "pass_candidate",
        "reasons": []
    }

    plain_fragment = re.sub(r'<[^>]+>', ' ', fragment)
    plain_fragment = plain_fragment.replace('\u200b', ' ')
    plain_fragment = re.sub(r'\s+', ' ', plain_fragment)

    for label in summary["required_labels"]:
        if label not in plain_fragment and label not in fragment:
            summary["missing_labels"].append(label)

    fonts = extract_font_sizes(fragment)
    dims = extract_dimensions(fragment)

    summary["font_sizes"] = sorted(set(fonts))
    summary["widths"] = sorted(set(dims["widths"]))
    summary["heights"] = sorted(set(dims["heights"]))

    if summary["missing_labels"]:
        summary["reasons"].append("missing_required_labels")

    rule = SIZE_RULES.get(visual_type, {})

    if visual_type in HTML_LIKE_TYPES:
        lo, hi = rule.get("font_pt_range", (0, 999))
        if fonts and any(f < lo or f > hi for f in fonts):
            summary["reasons"].append("table_font_out_of_range")
        if dims["widths"] and any(w > rule.get("max_width", 9999) for w in dims["widths"]):
            summary["reasons"].append("table_width_too_large")

    elif visual_type in SVG_LIKE_TYPES:
        lo, hi = rule.get("font_px_range", (0, 999))
        if fonts and any(f < lo or f > hi for f in fonts):
            summary["reasons"].append("svg_font_out_of_range")
        if dims["widths"] and any(w > rule.get("max_width", 9999) for w in dims["widths"]):
            summary["reasons"].append("svg_width_too_large")
        if dims["heights"] and any(h > rule.get("max_height", 9999) for h in dims["heights"]):
            summary["reasons"].append("svg_height_too_large")

    if summary["reasons"]:
        summary["status"] = "fail"

    return summary


# =========================================================
# 5. 메인 처리기
# =========================================================

def process_question_bank(question_bank, specs, target_field="auto", dry_run=False):
    reports = []
    updated = []

    for item in question_bank:
        new_item = dict(item)
        qid = str(new_item.get("id"))

        if qid not in specs:
            reports.append({
                "id": new_item.get("id"),
                "status": "SKIPPED",
                "reason": "spec 없음"
            })
            updated.append(new_item)
            continue

        spec = deepcopy(specs[qid])

        try:
            fragment, verify_report = render_fragment_by_spec(spec)
            visual_type = verify_report["type"]
            inspection = inspect_fragment(fragment, visual_type, new_item.get("id"))
        except Exception as e:
            reports.append({
                "id": new_item.get("id"),
                "status": "FAILED",
                "reason": str(e)
            })
            updated.append(new_item)
            continue

        applied_fields = []

        if not dry_run:
            if target_field == "content":
                new_item["content"] = replace_or_insert_visual(new_item.get("content", ""), fragment)
                applied_fields.append("content")
            elif target_field == "solution":
                new_item["solution"] = replace_or_insert_visual(new_item.get("solution", ""), fragment)
                applied_fields.append("solution")
            else:
                if any(token in str(new_item.get("solution", "")) for token in PLACEHOLDERS):
                    new_item["solution"] = replace_or_insert_visual(new_item.get("solution", ""), fragment)
                    applied_fields.append("solution")
                else:
                    new_item["content"] = replace_or_insert_visual(new_item.get("content", ""), fragment)
                    applied_fields.append("content")

        reports.append({
            "id": new_item.get("id"),
            "status": "UPDATED" if applied_fields else "DRY_RUN",
            "visual_type": visual_type,
            "applied_fields": applied_fields,
            "verification": verify_report,
            "inspection": inspection
        })

        updated.append(new_item)

    return updated, reports


def process_js_file(input_path, spec_path, output_path=None, report_path=None, target_field="auto", dry_run=False):
    input_path = Path(input_path)
    js_text = input_path.read_text(encoding="utf-8")

    exam_title = extract_exam_title(js_text)
    question_bank = parse_question_bank(js_text)
    specs = load_json(spec_path)

    updated_bank, reports = process_question_bank(
        question_bank=question_bank,
        specs=specs,
        target_field=target_field,
        dry_run=dry_run
    )

    output_js = question_bank_to_js(updated_bank, exam_title=exam_title)

    if output_path is None:
        suffix = "_spec_pipeline_dryrun.js" if dry_run else "_spec_pipeline.js"
        output_path = input_path.with_name(input_path.stem + suffix)
    else:
        output_path = Path(output_path)

    if not dry_run:
        save_text(output_path, output_js)

    if report_path is None:
        if dry_run:
            report_path = input_path.with_name(input_path.stem + "_spec_pipeline_dryrun.report.json")
        else:
            report_path = output_path.with_suffix(".report.json")
    else:
        report_path = Path(report_path)

    report_obj = {
        "input_file": str(input_path),
        "spec_file": str(spec_path),
        "output_file": str(output_path),
        "examTitle": exam_title,
        "summary": {
            "total_questions": len(question_bank),
            "updated_count": sum(1 for r in reports if r["status"] == "UPDATED"),
            "dryrun_count": sum(1 for r in reports if r["status"] == "DRY_RUN"),
            "skipped_count": sum(1 for r in reports if r["status"] == "SKIPPED"),
            "failed_count": sum(1 for r in reports if r["status"] == "FAILED"),
            "inspection_fail_count": sum(
                1 for r in reports
                if r.get("inspection", {}).get("status") == "fail"
            )
        },
        "items": reports
    }

    save_text(report_path, json.dumps(report_obj, ensure_ascii=False, indent=2))
    return report_obj


# =========================================================
# 6. CLI
# =========================================================

def build_arg_parser():
    parser = argparse.ArgumentParser(
        description="외부 spec.json 기반 시험지용 visual pipeline"
    )
    parser.add_argument("input", help="입력 JS 파일")
    parser.add_argument("spec", help="외부 spec.json 파일")
    parser.add_argument("--output", default=None, help="출력 JS 파일")
    parser.add_argument("--report", default=None, help="출력 리포트 JSON")
    parser.add_argument("--target-field", choices=["auto", "content", "solution"], default="auto")
    parser.add_argument("--dry-run", action="store_true")
    return parser


def main():
    parser = build_arg_parser()
    args = parser.parse_args()

    report_obj = process_js_file(
        input_path=args.input,
        spec_path=args.spec,
        output_path=args.output,
        report_path=args.report,
        target_field=args.target_field,
        dry_run=args.dry_run
    )

    print(json.dumps(report_obj, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()