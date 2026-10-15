from __future__ import annotations

import hashlib
import html
import json
import math
import os
import uuid
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json, sha256_file


VISUAL_SPEC_VERSION = "0.1"
RENDERER_VERSION = "0.5.3-student-language-accessibility"
SUPPORTED_TYPES = {
    "coordinate_plane", "simple_function_graph", "segment_geometry",
    "polygon", "circle", "circle_geometry", "table",
}

_MATH_WORDS = {
    "sin", "cos", "tan", "cot", "sec", "csc", "log", "ln", "lim", "max", "min", "sqrt", "pi",
    "theta", "alpha", "beta", "gamma", "delta", "omega", "xy", "xz", "yz", "mm", "cm", "km", "m", "kg", "g", "ha",
}
_INTERNAL_WORDS = {"svg", "apmath", "source", "bound", "debug", "generator", "renderer", "candidate", "provenance"}
_COMPOUND_VARIABLE_PRODUCTS = {"ab", "uv", "nm"}
_MIXED_CASE_POINT_LABELS = {"Apr", "Bpr", "Cp", "Tx", "Ty"}
_DESCRIPTION_MARKERS = {
    "관계", "위치", "조건", "교점", "접점", "중심", "반지름", "접선", "수직", "평행", "변", "각", "넓이", "길이",
    "그래프", "표", "구간", "영역", "대칭", "이동", "원", "점", "선분", "직선", "곡선", "변화", "분포", "확률",
    "값", "풀이", "단계", "수량", "거리", "최댓값", "최솟값", "선택지", "참", "거짓", "겉면", "곡면", "도형의", "함수",
    "비교", "보여", "도식", "다이어그램", "벤", "내분", "사분면", "볼록", "인수", "약분", "여집합", "포함", "집합", "합집합", "교집합", "수직선", "대응",
}


def _validate_student_text(value: str, surface: str) -> None:
    if "축척" in value or re.search(r"\bscale(?:d|s|ing)?\b", value, re.IGNORECASE):
        raise ValueError(f"SVG_SCALE_GUIDANCE_FORBIDDEN:{surface}:{value}")
    for match in re.finditer(r"[A-Za-z]+", value):
        token = match.group(0)
        lower = token.lower()
        if lower in _INTERNAL_WORDS:
            raise ValueError(f"SVG_INTERNAL_STUDENT_TEXT_FORBIDDEN:{surface}:{token}:{value}")
        before = value[match.start() - 1] if match.start() else ""
        after = value[match.end()] if match.end() < len(value) else ""
        nearby = value[max(0, match.start() - 3) : min(len(value), match.end() + 3)]
        compact_math = bool(re.fullmatch(r"[A-Za-z]{2,4}", token)) and (
            bool(before) and before in "0123456789=+-*/^_([{≤≥±−×÷⋅·"
            or bool(after) and after in "0123456789₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹=+-*/^_)}]≤≥±−×÷⋅·(′’'"
        )
        inline_equation_identifier = bool(re.fullmatch(r"[a-z]{2,3}", token)) and bool(re.search(r"[=+*/^_≤≥±−×÷⋅·]", nearby))
        integral_marker = lower == "int" and after in "0123456789₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜ⁰¹²³⁴⁵⁶⁷⁸⁹[(" and bool(re.search(r"[=+]", value[max(0, match.start() - 3) : match.start()]))
        differential = lower in {"dx", "dt"} and (
            bool(re.search(r"(?:∫|\\int|\bint)", value, re.IGNORECASE))
            or bool(before) and before in ")]}|0123456789" and bool(after) and after in " ,.;:)]}[가를은는이에"
            or bool(re.match(r"d[xt][[(]", value[match.start() : match.start() + 4]))
        )
        mixed_case_math_label = token in _MIXED_CASE_POINT_LABELS or bool(re.fullmatch(r"[A-Z]{1,2}(?:min|max)", token)) or bool(re.fullmatch(r"[xy][A-Z]{1,3}", token))
        if lower in _MATH_WORDS or len(token) == 1 or re.fullmatch(r"[A-Z]{2,4}", token) or mixed_case_math_label or lower in _COMPOUND_VARIABLE_PRODUCTS or compact_math or inline_equation_identifier or integral_marker or differential:
            continue
        raise ValueError(f"SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW:{surface}:{token}:{value}")


def _validate_student_svg(svg: str, title: str, description: str) -> None:
    try:
        root = ET.fromstring(svg)
    except ET.ParseError as error:
        raise ValueError("visual renderer emitted malformed SVG") from error
    local = lambda name: name.rsplit("}", 1)[-1].casefold()
    if local(root.tag) != "svg" or root.attrib.get("role") != "img":
        raise ValueError("SVG_ACCESSIBILITY_ROLE_IMG_REQUIRED")
    elements = list(root.iter())
    titles = [node for node in elements if local(node.tag) == "title"]
    descriptions = [node for node in elements if local(node.tag) == "desc"]
    if len(titles) != 1 or len(descriptions) != 1:
        raise ValueError("SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED")
    ids = [node.attrib["id"] for node in elements if "id" in node.attrib]
    if len(set(ids)) != len(ids):
        raise ValueError("SVG_ACCESSIBILITY_DUPLICATE_ID")
    title_id = titles[0].attrib.get("id")
    description_id = descriptions[0].attrib.get("id")
    labelled_by = root.attrib.get("aria-labelledby", "").split()
    described_by = root.attrib.get("aria-describedby", "").split()
    if not title_id or not description_id or title_id == description_id or title_id not in labelled_by or (
        description_id not in labelled_by and description_id not in described_by
    ):
        raise ValueError("SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID")
    if any(ids.count(identifier) != 1 for identifier in labelled_by + described_by):
        raise ValueError("SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID")
    for surface, node, minimum_korean in (("title", titles[0], 2), ("desc", descriptions[0], 8)):
        value = " ".join("".join(node.itertext()).split())
        if len(re.findall(r"[가-힣]", value)) < minimum_korean:
            raise ValueError(f"SVG_ACCESSIBILITY_KOREAN_MEANING_REQUIRED:{surface}")
        _validate_student_text(value, surface)
    title_text = " ".join("".join(titles[0].itertext()).split())
    description_text = " ".join("".join(descriptions[0].itertext()).split())
    if title_text == description_text or not any(marker in description_text for marker in _DESCRIPTION_MARKERS):
        raise ValueError(f"SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE:{description_text}")
    for index, node in enumerate(elements):
        if local(node.tag) == "text":
            _validate_student_text(" ".join("".join(node.itertext()).split()), f"text[{index}]")
        if node.attrib.get("aria-label"):
            _validate_student_text(node.attrib["aria-label"], f"aria-label[{index}]")
        if node.attrib.get("title"):
            _validate_student_text(node.attrib["title"], f"title-attribute[{index}]")
        for attribute in ("aria-labelledby", "aria-describedby"):
            refs = node.attrib.get(attribute, "").split()
            if len(set(refs)) != len(refs) or any(ids.count(identifier) != 1 for identifier in refs):
                raise ValueError(f"SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID:{attribute}[{index}]")
    if title != " ".join("".join(titles[0].itertext()).split()) or description != " ".join("".join(descriptions[0].itertext()).split()):
        raise ValueError("SVG_ACCESSIBILITY_SPEC_MISMATCH")


def _number(value: Any, name: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value):
        raise ValueError(f"visualSpec {name} must be a finite number")
    return float(value)


def _integer(value: Any, name: str, minimum: int, maximum: int) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or not minimum <= value <= maximum:
        raise ValueError(f"visualSpec {name} must be an integer from {minimum} through {maximum}")
    return value


def _range(value: Any, name: str) -> tuple[float, float]:
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"visualSpec {name} must contain two numbers")
    low, high = _number(value[0], f"{name}[0]"), _number(value[1], f"{name}[1]")
    if low >= high:
        raise ValueError(f"visualSpec {name} must be strictly increasing")
    return low, high


def _safe_label(value: Any, name: str) -> str:
    if not isinstance(value, str) or not value.strip() or len(value) > 40:
        raise ValueError(f"visualSpec {name} must be a non-empty label of at most 40 characters")
    return html.escape(value.strip(), quote=True)


def _accessibility_text(value: Any, name: str, maximum: int) -> str:
    if not isinstance(value, str) or not value.strip() or len(value.strip()) > maximum:
        raise ValueError(f"visualSpec {name} must be non-empty Korean student-facing text of at most {maximum} characters")
    return html.escape(value.strip(), quote=True)


def _derive_accessibility_description(spec: dict[str, Any]) -> str:
    title = spec.get("title")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("visualSpec title is required for an accessible student visual")
    parts: list[str] = []
    point_labels = [item.get("label") for item in spec.get("points", []) if isinstance(item, dict) and isinstance(item.get("label"), str)]
    circle_labels = [item.get("center", {}).get("label") for item in spec.get("circles", []) if isinstance(item, dict) and isinstance(item.get("center"), dict) and isinstance(item.get("center", {}).get("label"), str)]
    labels = list(dict.fromkeys(point_labels + circle_labels))
    if labels:
        parts.append("점 " + ", ".join(labels))
    segments = [item.get("label") for item in spec.get("segments", []) if isinstance(item, dict) and isinstance(item.get("label"), str)]
    lines = [item.get("label") for item in spec.get("lines", []) if isinstance(item, dict) and isinstance(item.get("label"), str)]
    curves = [item.get("label") for item in spec.get("curves", []) if isinstance(item, dict) and isinstance(item.get("label"), str)]
    if segments:
        parts.append("선분 " + ", ".join(dict.fromkeys(segments)))
    if lines:
        parts.append("직선 " + ", ".join(dict.fromkeys(lines)))
    if spec.get("circles"):
        parts.append("중심과 반지름을 갖는 원")
    if curves:
        parts.append("함수 그래프 " + ", ".join(dict.fromkeys(curves)))
    annotations = [item.get("text") for item in spec.get("annotations", []) if isinstance(item, dict) and isinstance(item.get("text"), str) and item.get("text").strip()]
    if annotations:
        parts.append("풀이에 필요한 관계 " + "; ".join(annotations[:2]))
    if spec.get("type") == "table":
        rows = spec.get("rows", [])
        columns = len(rows[0]) if rows and isinstance(rows[0], list) else 0
        parts.append(f"{len(rows)}행 {columns}열의 조건과 값")
    if not parts:
        visual_type = spec.get("type")
        if visual_type in {"coordinate_plane", "simple_function_graph"}:
            parts.append("좌표와 그래프의 관계")
        elif visual_type in {"circle", "circle_geometry"}:
            parts.append("원의 중심과 반지름")
        elif visual_type in {"segment_geometry", "polygon"}:
            parts.append("도형의 점과 변의 위치 관계")
        elif visual_type == "table":
            parts.append("조건과 값의 표 관계")
    return f"{title.strip()}: {'; '.join(parts)}를 나타낸 그림."


def _fmt(value: float) -> str:
    if abs(value) < 5e-10:
        value = 0.0
    rendered = f"{value:.6f}".rstrip("0").rstrip(".")
    return rendered or "0"


def _atomic_write(path: Path, data: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            output.write(data)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def _point(item: Any, name: str) -> tuple[float, float, str | None]:
    if not isinstance(item, dict):
        raise ValueError(f"visualSpec {name} must be an object")
    x = _number(item.get("x"), f"{name}.x")
    y = _number(item.get("y"), f"{name}.y")
    label = item.get("label")
    if label is not None:
        label = _safe_label(label, f"{name}.label")
    return x, y, label


class _LabelPlacer:
    """Place SVG labels deterministically without changing geometry."""

    def __init__(self, width: int, height: int, padding: float = 4.0) -> None:
        self.width = float(width)
        self.height = float(height)
        self.padding = padding
        self.boxes: list[tuple[float, float, float, float]] = []
        self.seen: set[tuple[float, float, str]] = set()

    @staticmethod
    def _box(x: float, y: float, text: str, font_size: float, anchor: str) -> tuple[float, float, float, float]:
        text_width = max(font_size * 0.6, font_size * 0.6 * len(text))
        x1 = x - text_width / 2 if anchor == "middle" else x - text_width if anchor == "end" else x
        return x1, y - font_size, x1 + text_width, y + 3

    @staticmethod
    def _overlap(left: tuple[float, float, float, float], right: tuple[float, float, float, float]) -> bool:
        return left[0] < right[2] and right[0] < left[2] and left[1] < right[3] and right[1] < left[3]

    def place(
        self,
        x: float,
        y: float,
        text: str,
        font_size: float = 14.0,
        anchor: str = "start",
    ) -> tuple[float, float] | None:
        key = (round(x, 6), round(y, 6), text)
        if key in self.seen:
            return None
        self.seen.add(key)
        width = max(font_size * 0.6, font_size * 0.6 * len(text))
        candidates = [
            (x, y),
            (x + 8, y + font_size + 5),
            (x + 8, y - font_size - 5),
            (x - width - 8, y + font_size + 5),
            (x - width - 8, y - font_size - 5),
        ]
        for candidate_x, candidate_y in candidates:
            box = self._box(candidate_x, candidate_y, text, font_size, anchor)
            if (
                box[0] < self.padding
                or box[1] < self.padding
                or box[2] > self.width - self.padding
                or box[3] > self.height - self.padding
                or any(self._overlap(box, previous) for previous in self.boxes)
            ):
                continue
            self.boxes.append(box)
            return candidate_x, candidate_y
        # Keep the original candidate visible; the adaptive pre-review gate
        # will report the unresolved collision instead of silently hiding it.
        original = self._box(x, y, text, font_size, anchor)
        self.boxes.append(original)
        return x, y


def _coordinate_svg(spec: dict[str, Any], width: int, height: int) -> list[str]:
    x_low, x_high = _range(spec.get("xRange"), "xRange")
    y_low, y_high = _range(spec.get("yRange"), "yRange")
    margin = 32.0

    def tx(x: float) -> float:
        return margin + (x - x_low) * (width - 2 * margin) / (x_high - x_low)

    def ty(y: float) -> float:
        return height - margin - (y - y_low) * (height - 2 * margin) / (y_high - y_low)

    labels = _LabelPlacer(width, height)

    def label_text(x: float, y: float, text: str, class_name: str | None = None) -> str:
        font_size = 13.0 if class_name in {"element-label", "annotation"} else 14.0
        placed = labels.place(x, y, text, font_size=font_size)
        if placed is None:
            return ""
        px, py = placed
        class_attribute = f' class="{class_name}"' if class_name else ""
        return f'<text x="{_fmt(px)}" y="{_fmt(py)}"{class_attribute}>{text}</text>'

    lines: list[str] = []
    if x_low <= 0 <= x_high:
        x0 = _fmt(tx(0))
        lines.append(f'<line x1="{x0}" y1="{_fmt(margin)}" x2="{x0}" y2="{_fmt(height-margin)}" class="axis"/>')
    if y_low <= 0 <= y_high:
        y0 = _fmt(ty(0))
        lines.append(f'<line x1="{_fmt(margin)}" y1="{y0}" x2="{_fmt(width-margin)}" y2="{y0}" class="axis"/>')
    asymptotes = spec.get("asymptotes", [])
    if not isinstance(asymptotes, list):
        raise ValueError("visualSpec asymptotes must be an array")
    for index, item in enumerate(asymptotes):
        if not isinstance(item, dict) or set(item) - {"x", "y", "label"}:
            raise ValueError(f"visualSpec asymptotes[{index}] is invalid")
        if ("x" in item) == ("y" in item):
            raise ValueError(f"visualSpec asymptotes[{index}] requires exactly one of x or y")
        if "x" in item:
            x = tx(_number(item["x"], f"asymptotes[{index}].x"))
            lines.append(f'<line x1="{_fmt(x)}" y1="{_fmt(margin)}" x2="{_fmt(x)}" y2="{_fmt(height-margin)}" class="guide"/>')
        else:
            y = ty(_number(item["y"], f"asymptotes[{index}].y"))
            lines.append(f'<line x1="{_fmt(margin)}" y1="{_fmt(y)}" x2="{_fmt(width-margin)}" y2="{_fmt(y)}" class="guide"/>')
    segments = spec.get("segments", [])
    if not isinstance(segments, list):
        raise ValueError("visualSpec segments must be an array")
    for index, segment in enumerate(segments):
        if not isinstance(segment, dict):
            raise ValueError(f"visualSpec segments[{index}] must be an object")
        x1, y1, _ = _point(segment.get("from"), f"segments[{index}].from")
        x2, y2, _ = _point(segment.get("to"), f"segments[{index}].to")
        kind = str(segment.get("kind", "segment")).strip().casefold()
        if kind not in {"segment", "radius", "tangent", "chord", "perpendicular", "guide"}:
            raise ValueError(f"visualSpec segments[{index}].kind is unsupported")
        style = {
            "radius": "radius",
            "tangent": "tangent",
            "perpendicular": "perpendicular",
            "guide": "guide",
        }.get(kind, "guide" if segment.get("dashed") is True else "shape")
        lines.append(f'<line x1="{_fmt(tx(x1))}" y1="{_fmt(ty(y1))}" x2="{_fmt(tx(x2))}" y2="{_fmt(ty(y2))}" class="{style}"/>')
        label = segment.get("label")
        if label is not None:
            label = _safe_label(label, f"segments[{index}].label")
            lines.append(label_text((tx(x1)+tx(x2))/2+5, (ty(y1)+ty(y2))/2-5, label, "element-label"))

    raw_lines = spec.get("lines", [])
    if not isinstance(raw_lines, list):
        raise ValueError("visualSpec lines must be an array")
    for index, line in enumerate(raw_lines):
        if not isinstance(line, dict):
            raise ValueError(f"visualSpec lines[{index}] must be an object")
        x1, y1, _ = _point(line.get("from"), f"lines[{index}].from")
        x2, y2, _ = _point(line.get("to"), f"lines[{index}].to")
        kind = str(line.get("kind", "line")).strip().casefold()
        if kind not in {"line", "tangent", "guide", "perpendicular"}:
            raise ValueError(f"visualSpec lines[{index}].kind is unsupported")
        style = {
            "tangent": "tangent",
            "perpendicular": "perpendicular",
            "guide": "guide",
        }.get(kind, "guide" if line.get("dashed") is True else "shape")
        lines.append(f'<line x1="{_fmt(tx(x1))}" y1="{_fmt(ty(y1))}" x2="{_fmt(tx(x2))}" y2="{_fmt(ty(y2))}" class="{style}"/>')
        label = line.get("label")
        if label is not None:
            label = _safe_label(label, f"lines[{index}].label")
            lines.append(label_text((tx(x1)+tx(x2))/2+5, (ty(y1)+ty(y2))/2-5, label, "element-label"))
    curves = spec.get("curves", [])
    if not isinstance(curves, list):
        raise ValueError("visualSpec curves must be an array")
    for index, curve in enumerate(curves):
        if not isinstance(curve, dict) or not isinstance(curve.get("points"), list) or len(curve["points"]) < 2:
            raise ValueError(f"visualSpec curves[{index}].points requires at least two points")
        points = []
        for point_index, item in enumerate(curve["points"]):
            x, y, _ = _point(item, f"curves[{index}].points[{point_index}]")
            points.append(f"{_fmt(tx(x))},{_fmt(ty(y))}")
        lines.append(f'<polyline points="{" ".join(points)}" class="curve"/>')
    points = spec.get("points", [])
    if not isinstance(points, list):
        raise ValueError("visualSpec points must be an array")
    for index, item in enumerate(points):
        x, y, label = _point(item, f"points[{index}]")
        px, py = tx(x), ty(y)
        lines.append(f'<circle cx="{_fmt(px)}" cy="{_fmt(py)}" r="3" class="point"/>')
        if label:
            lines.append(label_text(px+6, py-6, label))

    raw_right_angles = spec.get("rightAngles", [])
    if not isinstance(raw_right_angles, list):
        raise ValueError("visualSpec rightAngles must be an array")
    for index, marker in enumerate(raw_right_angles):
        if not isinstance(marker, dict):
            raise ValueError(f"visualSpec rightAngles[{index}] must be an object")
        vx, vy, _ = _point(marker.get("vertex"), f"rightAngles[{index}].vertex")
        ax, ay, _ = _point(marker.get("alongA"), f"rightAngles[{index}].alongA")
        bx, by, _ = _point(marker.get("alongB"), f"rightAngles[{index}].alongB")
        avx, avy = ax - vx, ay - vy
        bvx, bvy = bx - vx, by - vy
        dot = avx * bvx + avy * bvy
        scale = max(1.0, math.hypot(avx, avy) * math.hypot(bvx, bvy))
        if abs(dot) > 1e-6 * scale:
            raise ValueError(f"visualSpec rightAngles[{index}] arms are not perpendicular")
        svx, svy = tx(ax) - tx(vx), ty(ay) - ty(vy)
        tvx, tvy = tx(bx) - tx(vx), ty(by) - ty(vy)
        sn, tn = math.hypot(svx, svy), math.hypot(tvx, tvy)
        if sn < 1e-9 or tn < 1e-9:
            raise ValueError(f"visualSpec rightAngles[{index}] arms must be non-zero")
        size = min(12.0, sn * 0.22, tn * 0.22)
        sux, suy, tux, tuy = svx / sn, svy / sn, tvx / tn, tvy / tn
        px, py = tx(vx), ty(vy)
        p1 = (px + sux * size, py + suy * size)
        p2 = (p1[0] + tux * size, p1[1] + tuy * size)
        p3 = (px + tux * size, py + tuy * size)
        points_text = " ".join(f"{_fmt(x)},{_fmt(y)}" for x, y in (p1, p2, p3))
        lines.append(f'<polyline points="{points_text}" class="right-angle"/>')
    circles = spec.get("circles", [])
    if not isinstance(circles, list):
        raise ValueError("visualSpec circles must be an array")
    x_scale = (width - 2 * margin) / (x_high - x_low)
    y_scale = (height - 2 * margin) / (y_high - y_low)
    if circles and abs(x_scale - y_scale) > 1e-6:
        raise ValueError("visualSpec circles require equal x/y scale")
    for index, circle in enumerate(circles):
        if not isinstance(circle, dict):
            raise ValueError(f"visualSpec circles[{index}] must be an object")
        cx, cy, label = _point(circle.get("center"), f"circles[{index}].center")
        radius = _number(circle.get("radius"), f"circles[{index}].radius")
        if radius <= 0:
            raise ValueError(f"visualSpec circles[{index}].radius must be positive")
        lines.append(f'<circle cx="{_fmt(tx(cx))}" cy="{_fmt(ty(cy))}" r="{_fmt(radius*x_scale)}" class="shape"/>')
        if spec.get("type") == "circle_geometry":
            lines.append(f'<circle cx="{_fmt(tx(cx))}" cy="{_fmt(ty(cy))}" r="3.4" class="center-point"/>')
        if label:
            lines.append(label_text(tx(cx)+6, ty(cy)-6, label))

    annotations = spec.get("annotations", [])
    if not isinstance(annotations, list):
        raise ValueError("visualSpec annotations must be an array")
    for index, annotation in enumerate(annotations):
        if not isinstance(annotation, dict):
            raise ValueError(f"visualSpec annotations[{index}] must be an object")
        x = tx(_number(annotation.get("x"), f"annotations[{index}].x"))
        y = ty(_number(annotation.get("y"), f"annotations[{index}].y"))
        label = _safe_label(annotation.get("text"), f"annotations[{index}].text")
        lines.append(label_text(x, y, label, "annotation"))
    return lines


def _table_svg(spec: dict[str, Any], width: int, height: int) -> list[str]:
    rows = spec.get("rows")
    if not isinstance(rows, list) or not rows or any(not isinstance(row, list) or not row for row in rows):
        raise ValueError("visualSpec table rows must be a non-empty rectangular array")
    columns = len(rows[0])
    if any(len(row) != columns for row in rows):
        raise ValueError("visualSpec table rows must be rectangular")
    if any(not isinstance(cell, str) or len(cell) > 80 for row in rows for cell in row):
        raise ValueError("visualSpec table cells must be strings of at most 80 characters")
    margin = 16.0
    cell_w = (width - 2 * margin) / columns
    cell_h = (height - 2 * margin) / len(rows)
    lines: list[str] = []
    for row_index, row in enumerate(rows):
        for column_index, cell in enumerate(row):
            x, y = margin + column_index * cell_w, margin + row_index * cell_h
            lines.append(f'<rect x="{_fmt(x)}" y="{_fmt(y)}" width="{_fmt(cell_w)}" height="{_fmt(cell_h)}" class="cell"/>')
            lines.append(f'<text x="{_fmt(x+cell_w/2)}" y="{_fmt(y+cell_h/2)}" class="cell-text">{html.escape(cell)}</text>')
    return lines


def render_visual_spec(spec: dict[str, Any]) -> str:
    if not isinstance(spec, dict):
        raise ValueError("visualSpec must be an object")
    if spec.get("version", VISUAL_SPEC_VERSION) != VISUAL_SPEC_VERSION:
        raise ValueError(f"visualSpec version must equal {VISUAL_SPEC_VERSION}")
    visual_type = spec.get("type")
    if visual_type not in SUPPORTED_TYPES:
        raise ValueError("visualSpec type is unsupported")
    width = _integer(spec.get("width"), "width", 120, 1200)
    height = _integer(spec.get("height"), "height", 120, 1200)
    title = _accessibility_text(spec.get("title"), "title", 120)
    description_source = spec.get("description") or _derive_accessibility_description(spec)
    description = _accessibility_text(description_source, "description", 1000)
    if visual_type == "circle_geometry":
        if not isinstance(spec.get("circles"), list) or not spec["circles"]:
            raise ValueError("circle_geometry requires at least one circle")
        if not isinstance(spec.get("segments", []), list) or not isinstance(spec.get("lines", []), list):
            raise ValueError("circle_geometry segments and lines must be arrays")
        if not spec.get("segments") and not spec.get("lines"):
            raise ValueError("circle_geometry requires a line or segment construction")
    if visual_type == "table":
        body = _table_svg(spec, width, height)
    else:
        body = _coordinate_svg(spec, width, height)
    style = (
        ".axis{stroke:#111;stroke-width:1.2}.shape,.curve{fill:none;stroke:#111;stroke-width:1.8}"
        ".guide{fill:none;stroke:#555;stroke-width:1;stroke-dasharray:5 4}.point{fill:#111}"
        ".radius{fill:none;stroke:#1f4e79;stroke-width:1.5}.tangent{fill:none;stroke:#111;stroke-width:2.1}"
        ".perpendicular{fill:none;stroke:#555;stroke-width:1;stroke-dasharray:3 3}.right-angle{fill:none;stroke:#111;stroke-width:1.2}"
        ".center-point{fill:#1f4e79}.element-label,.annotation{font:13px sans-serif}.annotation{font-style:italic}"
        "text{font:14px sans-serif;fill:#111}.cell{fill:#fff;stroke:#111;stroke-width:1}"
        ".cell-text{text-anchor:middle;dominant-baseline:middle;font:13px sans-serif}"
    )
    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" role="img" aria-labelledby="visual-title" aria-describedby="visual-description">\n'
        f'<title id="visual-title">{title}</title>\n'
        f'<desc id="visual-description">{description}</desc>\n'
        f'<style>{style}</style>\n' + "\n".join(body) + "\n</svg>\n"
    )
    _validate_student_svg(svg, html.unescape(title), html.unescape(description))
    return svg


def render_visual_file(spec_path: Path, output_path: Path, report_path: Path) -> dict[str, Any]:
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    svg = render_visual_spec(spec)
    if svg != render_visual_spec(json.loads(json.dumps(spec, ensure_ascii=False))):
        raise ValueError("visual renderer is nondeterministic")
    if output_path.suffix.lower() != ".svg":
        raise ValueError("deterministic visual renderer currently outputs SVG only")
    _atomic_write(output_path, svg)
    spec_hash = hashlib.sha256(
        json.dumps(spec, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    report = {
        "schemaVersion": "0.1.0",
        "artifactType": "ALIVE_VISUAL_RENDER_REPORT",
        "visualSpecVersion": VISUAL_SPEC_VERSION,
        "rendererVersion": RENDERER_VERSION,
        "visualType": spec["type"],
        "specSha256": spec_hash,
        "assetSha256": sha256_file(output_path),
        "assetType": "svg",
        "deterministicRerender": "PASS",
        "generativeModelUsed": False,
    }
    atomic_write_json(report_path, report)
    return report
