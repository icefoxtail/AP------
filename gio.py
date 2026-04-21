import io
import re
import json
import argparse
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

plt.rcParams['svg.fonttype'] = 'path'


# =========================================================
# 1. Geometry Engine (FOV Clipping 검증 추가)
# =========================================================

class AdvancedGeometryEngine:
    def __init__(self, xlim=(0, 10), ylim=(0, 10), figsize=(6, 6), debug=False):
        self.debug = debug
        self.fig, self.ax = plt.subplots(figsize=figsize)
        self.ax.set_aspect('equal')
        self.ax.set_xlim(xlim)
        self.ax.set_ylim(ylim)
        self.ax.axis('off')
        self.warnings = [] # 클리핑 및 안전성 경고 기록

    @staticmethod
    def _to_np(p):
        return np.array(p, dtype=float)

    @staticmethod
    def _safe_unit(vec, eps=1e-12):
        vec = np.array(vec, dtype=float)
        norm = np.linalg.norm(vec)
        if norm < eps:
            return None
        return vec / norm

    def _check_bounds(self, p, label=""):
        """점이나 텍스트가 화각(FOV) 밖으로 나가는지 검사하여 경고를 누적합니다."""
        x, y = float(p[0]), float(p[1])
        xmin, xmax = self.ax.get_xlim()
        ymin, ymax = self.ax.get_ylim()
        margin_x = (xmax - xmin) * 0.05
        margin_y = (ymax - ymin) * 0.05
        
        if x < xmin + margin_x or x > xmax - margin_x or y < ymin + margin_y or y > ymax - margin_y:
            target_name = label if label else f"({x:.1f}, {y:.1f})"
            self.warnings.append(f"Clipping Warning: Point {target_name} is near or outside bounding box.")

    def add_point(self, p, label=None, offset=(0.16, 0.16), size=3):
        p = self._to_np(p)
        self.ax.plot(p[0], p[1], 'ko', ms=size)
        
        text_pos = (p[0] + offset[0], p[1] + offset[1])
        if label:
            self.ax.text(
                text_pos[0], text_pos[1], label,
                ha='left', va='bottom', fontsize=11
            )
        
        # 화각 안전성 검사
        self._check_bounds(p, label=f"Point {label}")
        self._check_bounds(text_pos, label=f"Label {label}")

    def add_segment(self, p1, p2, label=None, style='-', lw=1.5, color='black', label_offset=0.35):
        p1 = self._to_np(p1)
        p2 = self._to_np(p2)

        vec = p2 - p1
        unit = self._safe_unit(vec)
        if unit is None:
            return

        self.ax.plot([p1[0], p2[0]], [p1[1], p2[1]], ls=style, lw=lw, color=color)

        if label:
            mid = (p1 + p2) / 2
            normal = np.array([-unit[1], unit[0]]) * label_offset
            label_pos = mid + normal
            self.ax.text(
                label_pos[0], label_pos[1], label,
                ha='center', va='center', fontsize=11
            )
            self._check_bounds(label_pos, label=f"Segment Label {label}")

    def add_circle(self, center, r, lw=1.5, color='black'):
        center = self._to_np(center)
        circle = patches.Circle(center, r, fill=False, edgecolor=color, lw=lw)
        self.ax.add_patch(circle)

    def add_right_angle(self, p1, vertex, p3, size=0.3, lw=1.0, color='black'):
        p1 = self._to_np(p1)
        vertex = self._to_np(vertex)
        p3 = self._to_np(p3)

        u1 = self._safe_unit(p1 - vertex)
        u2 = self._safe_unit(p3 - vertex)
        if u1 is None or u2 is None:
            return

        a = vertex + u1 * size
        b = vertex + u2 * size
        c = vertex + (u1 + u2) * size

        self.ax.plot([a[0], c[0]], [a[1], c[1]], color=color, lw=lw)
        self.ax.plot([c[0], b[0]], [c[1], b[1]], color=color, lw=lw)

    def add_tangent_at_point(self, center, r, point_on_circle, length=8, lw=1.2):
        center = self._to_np(center)
        point_on_circle = self._to_np(point_on_circle)

        radius_vec = point_on_circle - center
        radius_unit = self._safe_unit(radius_vec)
        if radius_unit is None:
            raise ValueError("중심과 접점이 동일합니다.")

        tangent_unit = np.array([-radius_unit[1], radius_unit[0]])
        half = length / 2.0

        p1 = point_on_circle - tangent_unit * half
        p2 = point_on_circle + tangent_unit * half

        tangent_color = 'blue' if self.debug else 'black'
        self.ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=tangent_color, lw=lw)
        
        self._check_bounds(p1, label="Tangent Start")
        self._check_bounds(p2, label="Tangent End")
        return p1, p2

    def add_parabola(self, h, k, p, x_range=None, y_range=None, lw=1.5, color='black', samples=600):
        if abs(p) < 1e-12:
            raise ValueError("p는 0이 될 수 없습니다.")
            
        if x_range is not None:
            xs = np.linspace(x_range[0], x_range[1], samples)
            inside = 4 * p * (xs - h)
            mask = inside >= -1e-12
            xs = xs[mask]
            inside = np.clip(inside[mask], 0, None)
            ys1 = k + np.sqrt(inside)
            ys2 = k - np.sqrt(inside)
            self.ax.plot(xs, ys1, color=color, lw=lw)
            self.ax.plot(xs, ys2, color=color, lw=lw)
            return {"orientation": "x", "x_range": x_range}
        elif y_range is not None:
            ys = np.linspace(y_range[0], y_range[1], samples)
            xs = h + ((ys - k) ** 2) / (4 * p)
            self.ax.plot(xs, ys, color=color, lw=lw)
            return {"orientation": "y", "y_range": y_range}
        else:
            raise ValueError("포물선 작도에는 x_range 또는 y_range가 필요합니다.")

    def add_parabola_with_focus_directrix(self, h, k, p, orientation='x', curve_range=None):
        if orientation == 'x':
            if curve_range is None: curve_range = (h, h + max(6, 4 * abs(p)))
            self.add_parabola(h, k, p, x_range=curve_range)
            focus = (h + p, k)
        else:
            if curve_range is None: curve_range = (k, k + max(6, 4 * abs(p)))
            self.add_parabola(h, k, p, y_range=curve_range)
            focus = (h, k + p)

        self.add_point((h, k), "V", offset=(0.14, -0.34))
        self.add_point(focus, "F", offset=(0.14, 0.14))
        return {"vertex": (h, k), "focus": focus}

    def get_svg_and_warnings(self):
        buf = io.StringIO()
        plt.savefig(buf, format='svg', bbox_inches='tight', pad_inches=0.08)
        plt.close(self.fig)
        return buf.getvalue(), self.warnings


# =========================================================
# 2. Verifier (직교 및 교점/접점 검증 추가)
# =========================================================

class GeometryVerifier:
    @staticmethod
    def verify_point_on_circle(center, r, point, tol=1e-6):
        center, point = np.array(center, dtype=float), np.array(point, dtype=float)
        return abs(np.linalg.norm(point - center) - r) < tol

    @staticmethod
    def verify_orthogonal(vec1, vec2, tol=1e-6):
        """두 벡터의 내적이 0인지(직교하는지) 검증"""
        v1, v2 = np.array(vec1, dtype=float), np.array(vec2, dtype=float)
        if np.linalg.norm(v1) < tol or np.linalg.norm(v2) < tol:
            return False
        return abs(np.dot(v1, v2)) < tol

    @staticmethod
    def verify_point_on_parabola(point, h, k, p, orientation='x', tol=1e-6):
        x, y = float(point[0]), float(point[1])
        if abs(p) < tol: return False
        
        if orientation == 'x':
            return abs((y - k) ** 2 - 4 * p * (x - h)) < tol
        else:
            return abs((x - h) ** 2 - 4 * p * (y - k)) < tol


# =========================================================
# 3. SVG Factory & Optimizer (웹 최적화 로직 추가)
# =========================================================

class GeometrySvgFactory:
    @staticmethod
    def clean_svg_for_web(svg_text):
        """엔진 렌더링에 적합하도록 SVG를 최적화합니다."""
        # 1. XML 선언 및 DOCTYPE 제거
        svg_text = re.sub(r'<\?xml.*?\?>\n?', '', svg_text)
        svg_text = re.sub(r'<!DOCTYPE.*?>\n?', '', svg_text)
        # 2. 폰트 패밀리를 웹 폰트(Pretendard/Nanum) 상속으로 강제 통일
        svg_text = re.sub(r'font-family="[^"]+"', 'font-family="inherit"', svg_text)
        # 3. matplotlib이 그리는 흰색 배경 사각형 투명화 처리
        svg_text = re.sub(r'<rect[^>]*fill="white"[^>]*/>', '', svg_text)
        return svg_text.strip()

    @staticmethod
    def render_circle_tangent():
        engine = AdvancedGeometryEngine(xlim=(0, 10), ylim=(0, 10), debug=False)
        center, r, point_on_circle = (5, 5), 3, (8, 5)

        engine.add_circle(center, r)
        engine.add_point(center, "O")
        engine.add_point(point_on_circle, "P")
        t1, t2 = engine.add_tangent_at_point(center, r, point_on_circle, length=8)
        engine.add_right_angle(center, point_on_circle, t2)

        raw_svg, warnings = engine.get_svg_and_warnings()
        
        report = {
            "type": "circle_tangent",
            "point_on_circle": GeometryVerifier.verify_point_on_circle(center, r, point_on_circle),
            "is_orthogonal": GeometryVerifier.verify_orthogonal(point_on_circle - np.array(center), t1 - t2),
            "clipping_warnings": warnings
        }
        return self.clean_svg_for_web(raw_svg), report

    @staticmethod
    def render_parabola():
        engine = AdvancedGeometryEngine(xlim=(-4, 10), ylim=(-7, 7), debug=False)
        h, k, p = 0, 0, 2
        info = engine.add_parabola_with_focus_directrix(h=h, k=k, p=p, orientation='x', curve_range=(0, 8))
        
        sample_point = (2, 4)
        engine.add_point(sample_point, "P", offset=(0.14, 0.14))
        
        raw_svg, warnings = engine.get_svg_and_warnings()

        report = {
            "type": "parabola",
            "point_on_parabola": GeometryVerifier.verify_point_on_parabola(sample_point, h, k, p, orientation='x'),
            "focus": info["focus"],
            "clipping_warnings": warnings
        }
        return self.clean_svg_for_web(raw_svg), report


# =========================================================
# 4. JS parser / writer
# =========================================================
# (기존 파서 로직과 동일 - 생략 없이 유지)
def extract_exam_title(js_text):
    m = re.search(r'window\.examTitle\s*=\s*(["\'])(.*?)\1\s*;', js_text, re.DOTALL)
    return m.group(2) if m else ""

def extract_question_bank_array_text(js_text):
    anchor = re.search(r'window\.questionBank\s*=\s*\[', js_text)
    start = js_text.find('[', anchor.start())
    i, depth_bracket, in_string, string_char, escape = start, 0, False, '', False

    while i < len(js_text):
        ch = js_text[i]
        if in_string:
            if escape: escape = False
            elif ch == '\\': escape = True
            elif ch == string_char: in_string = False
        else:
            if ch in ('"', "'"):
                in_string = True
                string_char = ch
            elif ch == '[': depth_bracket += 1
            elif ch == ']':
                depth_bracket -= 1
                if depth_bracket == 0: return js_text[start:i + 1]
        i += 1
    raise ValueError("questionBank 배열 끝을 찾지 못했습니다.")

def js_object_literal_to_json_text(js_array_text):
    s = re.sub(r'^\s*window\.questionBank\s*=\s*', '', js_array_text)
    s = re.sub(r'//.*', '', s)
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.DOTALL)

    out, in_string, quote, escape = [], False, '', False
    for ch in s:
        if in_string:
            if escape: out.append(ch); escape = False
            elif ch == '\\': out.append(ch); escape = True
            elif ch == quote: out.append('"'); in_string = False
            else: out.append(ch)
        else:
            if ch in ("'", '"'): in_string = True; quote = ch; out.append('"')
            else: out.append(ch)

    s = ''.join(out)
    s = re.sub(r'([{,]\s*)([A-Za-z_가-힣][A-Za-z0-9_가-힣]*)(\s*:)', r'\1"\2"\3', s)
    s = re.sub(r',(\s*[}\]])', r'\1', s)
    return s

def parse_question_bank(js_text):
    return json.loads(js_object_literal_to_json_text(extract_question_bank_array_text(js_text)))

def question_bank_to_js(question_bank, exam_title=""):
    title_line = f'window.examTitle = {json.dumps(exam_title, ensure_ascii=False)};\n\n' if exam_title else ""
    return f'{title_line}window.questionBank = {json.dumps(question_bank, ensure_ascii=False, indent=2)};\n'


# =========================================================
# 5. Classifier / Inserter
# =========================================================

PLACEHOLDERS = ["[도형필요]", "[해설도형필요]", "[SVG필요]", "[그래프필요]", "[도형]", "[해설도형]"]

def has_placeholder(text):
    return any(token in text for token in PLACEHOLDERS) if isinstance(text, str) else False

def infer_figure_type(item):
    text = " ".join(str(item.get(k, "")) for k in ["category", "content", "solution", "standardUnit"])
    if re.search(r'원|접선|원주각', text): return "circle_tangent"
    if re.search(r'포물선|준선|초점', text): return "parabola"
    return None

def make_svg_for_type(figure_type):
    if figure_type == "circle_tangent": return GeometrySvgFactory.render_circle_tangent()
    if figure_type == "parabola": return GeometrySvgFactory.render_parabola()
    raise ValueError(f"지원하지 않는 도형 타입: {figure_type}")

def wrap_svg(svg_text):
    return f'\n<div class="figure-block">{svg_text}</div>\n'

def insert_svg_into_text(text, svg_text):
    if not isinstance(text, str): return text
    wrapped = wrap_svg(svg_text)
    for token in PLACEHOLDERS:
        if token in text: return text.replace(token, wrapped)
    return text

def process_question_bank(question_bank, target_field="auto"):
    reports, updated = [], []
    for item in question_bank:
        new_item = dict(item)
        content_has = has_placeholder(new_item.get("content", ""))
        solution_has = has_placeholder(new_item.get("solution", ""))

        if not (content_has or solution_has):
            updated.append(new_item); continue

        figure_type = infer_figure_type(new_item)
        if not figure_type:
            reports.append({"id": new_item.get("id"), "status": "SKIPPED", "reason": "추론 실패"})
            updated.append(new_item); continue

        try:
            svg_text, verify_report = make_svg_for_type(figure_type)
        except Exception as e:
            reports.append({"id": new_item.get("id"), "status": "FAILED", "reason": str(e)})
            updated.append(new_item); continue

        applied = []
        if (target_field in ("auto", "content")) and content_has:
            new_item["content"] = insert_svg_into_text(new_item.get("content", ""), svg_text)
            applied.append("content")
        if (target_field in ("auto", "solution")) and solution_has:
            new_item["solution"] = insert_svg_into_text(new_item.get("solution", ""), svg_text)
            applied.append("solution")

        reports.append({"id": new_item.get("id"), "status": "UPDATED", "applied": applied, "verify": verify_report})
        updated.append(new_item)

    return updated, reports


# =========================================================
# 6. File pipeline & CLI
# =========================================================

def process_js_file(input_path, output_path=None, report_path=None, target_field="auto"):
    input_path = Path(input_path)
    text = input_path.read_text(encoding="utf-8")

    exam_title = extract_exam_title(text)
    updated_bank, reports = process_question_bank(parse_question_bank(text), target_field=target_field)

    if not output_path: output_path = input_path.with_name(input_path.stem + "_svg삽입.js")
    else: output_path = Path(output_path)
    output_path.write_text(question_bank_to_js(updated_bank, exam_title=exam_title), encoding="utf-8")

    if not report_path: report_path = output_path.with_suffix(".report.json")
    else: report_path = Path(report_path)
    
    report_obj = {
        "summary": {"total": len(updated_bank), "updated": sum(1 for r in reports if r["status"] == "UPDATED")},
        "items": reports
    }
    report_path.write_text(json.dumps(report_obj, ensure_ascii=False, indent=2), encoding="utf-8")
    return report_obj

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="수리·기하 SVG 자동 삽입 파이프라인 v2")
    parser.add_argument("input", help="입력 JS 파일 경로")
    parser.add_argument("--output", help="출력 JS 파일 경로", default=None)
    args = parser.parse_args()

    report = process_js_file(input_path=args.input, output_path=args.output)
    print(json.dumps(report, ensure_ascii=False, indent=2))