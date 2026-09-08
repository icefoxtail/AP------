from __future__ import annotations

import html
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
MANIFEST = REPORT / "40_approved_candidate_visual_manifest_r9.json"
OUT_ROOT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908" / "render-r9"
OUTPUT = REPORT / "45_local_svg_render_review_r9.json"
SVG_NS = "{http://www.w3.org/2000/svg}"


def number(value: str | None, fallback: float = 0.0) -> float:
    if value is None:
        return fallback
    match = re.search(r"[-+]?\d*\.?\d+(?:e[-+]?\d+)?", value, re.I)
    return float(match.group(0)) if match else fallback


def color(value: str | None, fallback: tuple[int, int, int, int] = (0, 0, 0, 255)) -> tuple[int, int, int, int] | None:
    if not value or value == "none":
        return None
    named = {"#111": (17, 17, 17, 255), "#fff": (255, 255, 255, 255), "#555": (85, 85, 85, 255), "#4d6875": (77, 104, 117, 255), "#7a7a7a": (122, 122, 122, 255), "#728a54": (114, 138, 84, 255), "#536d3f": (83, 109, 63, 255), "#eef5e9": (238, 245, 233, 255), "#f7f9fa": (247, 249, 250, 255), "#aab5bb": (170, 181, 187, 255)}
    if value in named:
        return named[value]
    if value.startswith("#") and len(value) in {4, 7}:
        if len(value) == 4:
            return tuple(int(value[i] * 2, 16) for i in range(1, 4)) + (255,)
        return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
    return fallback


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def styles(root: ET.Element) -> dict[str, dict[str, str]]:
    style_text = "".join(node.text or "" for node in root.iter() if local_name(node.tag) == "style")
    output: dict[str, dict[str, str]] = {}
    for selector, declaration in re.findall(r"\.([\w-]+)\s*\{([^}]*)\}", style_text):
        output[selector] = {key.strip(): value.strip() for key, value in re.findall(r"([\w-]+)\s*:\s*([^;]+)", declaration)}
    return output


def font_for(size: int, italic: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [Path("C:/Windows/Fonts/NotoSansKR-VF.ttf"), Path("C:/Windows/Fonts/malgun.ttf"), Path("C:/Windows/Fonts/arial.ttf")]
    if italic:
        candidates.insert(0, Path("C:/Windows/Fonts/malgun.ttf"))
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), max(6, size))
    return ImageFont.load_default()


def parse_points(value: str) -> list[tuple[float, float]]:
    return [(float(x), float(y)) for x, y in re.findall(r"([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)", value)]


def clip_segment(start: tuple[int, int], end: tuple[int, int], box: tuple[int, int, int, int]) -> tuple[tuple[int, int], tuple[int, int]] | None:
    left, top, right, bottom = box
    x1, y1 = start; x2, y2 = end
    code1 = (1 if x1 < left else 0) | (2 if x1 > right else 0) | (4 if y1 < top else 0) | (8 if y1 > bottom else 0)
    code2 = (1 if x2 < left else 0) | (2 if x2 > right else 0) | (4 if y2 < top else 0) | (8 if y2 > bottom else 0)
    while True:
        if not (code1 | code2):
            return (round(x1), round(y1)), (round(x2), round(y2))
        if code1 & code2:
            return None
        outside = code1 or code2
        if outside & 8:
            x = x1 + (x2 - x1) * (bottom - y1) / (y2 - y1)
            y = bottom
        elif outside & 4:
            x = x1 + (x2 - x1) * (top - y1) / (y2 - y1)
            y = top
        elif outside & 2:
            y = y1 + (y2 - y1) * (right - x1) / (x2 - x1)
            x = right
        else:
            y = y1 + (y2 - y1) * (left - x1) / (x2 - x1)
            x = left
        if outside == code1:
            x1, y1 = x, y
            code1 = (1 if x1 < left else 0) | (2 if x1 > right else 0) | (4 if y1 < top else 0) | (8 if y1 > bottom else 0)
        else:
            x2, y2 = x, y
            code2 = (1 if x2 < left else 0) | (2 if x2 > right else 0) | (4 if y2 < top else 0) | (8 if y2 > bottom else 0)


def render_svg(path: Path, viewport_width: int) -> tuple[Image.Image, list[str]]:
    root = ET.fromstring(path.read_bytes())
    width = number(root.attrib.get("width")); height = number(root.attrib.get("height"))
    scale = min(1.0, viewport_width / width)
    out_width, out_height = round(width * scale), round(height * scale)
    image = Image.new("RGBA", (out_width, out_height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(image)
    rules = styles(root)
    overflows: list[str] = []

    def xy(value: float) -> int:
        return round(value * scale)

    def resolved(node: ET.Element) -> dict[str, str]:
        result: dict[str, str] = {}
        for klass in node.attrib.get("class", "").split():
            result.update(rules.get(klass, {}))
        result.update({key: value for key, value in node.attrib.items() if key in {"fill", "stroke", "stroke-width", "font-size", "font-style", "text-anchor"}})
        return result

    for node in root:
        tag = local_name(node.tag)
        if tag in {"style", "title", "desc"}:
            continue
        style = resolved(node)
        fill = color(style.get("fill"))
        stroke = color(style.get("stroke"))
        sw = max(1, round(number(style.get("stroke-width"), 1) * scale))
        if tag == "rect":
            box = (xy(number(node.attrib.get("x"))), xy(number(node.attrib.get("y"))), xy(number(node.attrib.get("x")) + number(node.attrib.get("width"))), xy(number(node.attrib.get("y")) + number(node.attrib.get("height"))))
            draw.rounded_rectangle(box, radius=xy(number(node.attrib.get("rx"))), fill=fill, outline=stroke, width=sw)
        elif tag == "line":
            start = (xy(number(node.attrib.get("x1"))), xy(number(node.attrib.get("y1"))))
            end = (xy(number(node.attrib.get("x2"))), xy(number(node.attrib.get("y2"))))
            segment = clip_segment(start, end, (xy(48), xy(48), xy(width - 48), xy(height - 48))) if node.attrib.get("clip-path") else (start, end)
            if segment:
                draw.line((*segment[0], *segment[1]), fill=stroke or fill, width=sw)
        elif tag in {"polyline", "polygon"}:
            points = [(xy(x), xy(y)) for x, y in parse_points(node.attrib.get("points", ""))]
            if len(points) >= 2:
                if node.attrib.get("clip-path"):
                    clip_left, clip_top, clip_right, clip_bottom = xy(48), xy(48), xy(width - 48), xy(height - 48)
                    clipped = [clip_segment(points[index], points[index + 1], (clip_left, clip_top, clip_right, clip_bottom)) for index in range(len(points) - 1)]
                    points = []
                    for segment in clipped:
                        if segment:
                            points.extend(segment)
                if tag == "polygon":
                    draw.polygon(points, fill=fill, outline=stroke)
                else:
                    draw.line(points, fill=stroke or fill, width=sw, joint="curve")
        elif tag == "circle":
            cx, cy, radius = xy(number(node.attrib.get("cx"))), xy(number(node.attrib.get("cy"))), xy(number(node.attrib.get("r")))
            draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=fill, outline=stroke, width=sw)
        elif tag == "path":
            tokens = re.findall(r"[MLZmlz]|[-+]?\d*\.?\d+", node.attrib.get("d", ""))
            points: list[tuple[int, int]] = []
            i = 0
            current = [0.0, 0.0]
            command = ""
            while i < len(tokens):
                if tokens[i].isalpha():
                    command = tokens[i]; i += 1
                    if command.lower() == "z":
                        break
                if command.lower() == "m" and i + 1 < len(tokens):
                    current = [float(tokens[i]), float(tokens[i + 1])]; i += 2; points.append((xy(current[0]), xy(current[1]))); command = "l" if command == "m" else "l"
                elif command.lower() == "l" and i + 1 < len(tokens):
                    if command == "L":
                        current = [float(tokens[i]), float(tokens[i + 1])]
                    else:
                        current = [current[0] + float(tokens[i]), current[1] + float(tokens[i + 1])]
                    i += 2; points.append((xy(current[0]), xy(current[1])))
                else:
                    i += 1
            if len(points) >= 2:
                if "z" in node.attrib.get("d", "").lower():
                    draw.polygon(points, fill=fill, outline=stroke)
                else:
                    draw.line(points, fill=stroke or fill, width=sw)
        elif tag == "text":
            value = "".join(node.itertext())
            size = max(7, round(number(style.get("font-size"), 13) * scale))
            font = font_for(size, style.get("font-style") == "italic")
            x, y = xy(number(node.attrib.get("x"))), xy(number(node.attrib.get("y")))
            anchor = style.get("text-anchor", "start")
            bbox = draw.textbbox((0, 0), value, font=font, anchor="ls")
            text_x = x
            if anchor == "middle":
                text_x -= (bbox[2] - bbox[0]) // 2
            elif anchor == "end":
                text_x -= bbox[2] - bbox[0]
            draw.text((text_x, y), value, font=font, fill=fill or (17, 17, 17, 255), anchor="ls")
            if bbox[0] + text_x < 0 or bbox[2] + text_x > out_width or bbox[1] + y < 0 or bbox[3] + y > out_height:
                overflows.append(value)
    return image.convert("RGB"), overflows


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    rows = []
    desktop_tiles: list[Image.Image] = []
    mobile_tiles: list[Image.Image] = []
    for item in manifest["rows"]:
        source = ROOT / item["assetPath"]
        desktop, desktop_overflows = render_svg(source, 1280)
        mobile, mobile_overflows = render_svg(source, 360)
        desktop_path = OUT_ROOT / f"{item['caseId']}-desktop.png"
        mobile_path = OUT_ROOT / f"{item['caseId']}-mobile.png"
        desktop.save(desktop_path); mobile.save(mobile_path)
        desktop_thumb = desktop.copy(); desktop_thumb.thumbnail((380, 260)); desktop_tiles.append(desktop_thumb)
        mobile_thumb = mobile.copy(); mobile_thumb.thumbnail((180, 260)); mobile_tiles.append(mobile_thumb)
        rows.append({"questionUid": item["questionUid"], "caseId": item["caseId"], "desktopPath": desktop_path.relative_to(ROOT).as_posix(), "mobilePath": mobile_path.relative_to(ROOT).as_posix(), "desktopViewportWidth": 1280, "mobileViewportWidth": 360, "desktopOverflowLabels": desktop_overflows, "mobileOverflowLabels": mobile_overflows, "status": "LOCAL_RENDER_REVIEWED" if not desktop_overflows and not mobile_overflows else "LOCAL_RENDER_OVERFLOW_REVIEW_REQUIRED"})
    def sheet(tiles: list[Image.Image], tile_width: int, tile_height: int, name: str) -> str:
        sheet_image = Image.new("RGB", (tile_width * 3, tile_height * 2), "white")
        for index, tile in enumerate(tiles):
            x = (index % 3) * tile_width; y = (index // 3) * tile_height
            sheet_image.paste(tile, (x, y))
        destination = OUT_ROOT / name
        sheet_image.save(destination)
        return destination.relative_to(ROOT).as_posix()
    desktop_sheet = sheet(desktop_tiles, 380, 260, "desktop-contact-sheet.png")
    mobile_sheet = sheet(mobile_tiles, 180, 260, "mobile-contact-sheet.png")
    overflow_count = sum(len(row["desktopOverflowLabels"]) + len(row["mobileOverflowLabels"]) for row in rows)
    output = {"schemaVersion": "HS_QUADRATIC_LOCAL_SVG_RENDER_REVIEW_R9", "status": "LOCAL_RENDER_REVIEW_RECORDED_NO_FINAL_PASS" if not overflow_count else "LOCAL_RENDER_OVERFLOW_REVIEW_REQUIRED", "productionAuthorized": False, "renderer": "PIL_SVG_SUBSET_LOCAL_RASTERIZER", "rows": rows, "desktopContactSheet": desktop_sheet, "mobileContactSheet": mobile_sheet, "overflowLabelCount": overflow_count, "note": "Local raster preview at desktop/mobile widths. Browser provider capture was unavailable because local file URLs were policy-blocked; this evidence does not substitute for provider-attested render capture or final audit."}
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": output["status"], "rows": len(rows), "overflowLabelCount": overflow_count, "desktopContactSheet": desktop_sheet, "mobileContactSheet": mobile_sheet}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
