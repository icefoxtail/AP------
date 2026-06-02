import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path

import fitz
from PIL import Image, ImageDraw


VISUAL_ASSET_MAX_PAGE_AREA_RATIO = 0.40
VISUAL_ASSET_MIN_WIDTH = 20
VISUAL_ASSET_MIN_HEIGHT = 20


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(path, rows, fieldnames):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in fieldnames})


def safe_rel(path, root):
    try:
        return str(Path(path).resolve().relative_to(Path(root).resolve())).replace("\\", "/")
    except Exception:
        return str(path).replace("\\", "/")


def render_pdf(pdf_path, out_dir, prefix, dpi):
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    matrix = fitz.Matrix(dpi / 72, dpi / 72)
    items = []
    for index, page in enumerate(doc):
        page_no = index + 1
        out_file = out_dir / f"{prefix}_p{page_no:03d}.png"
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        pix.save(out_file)
        items.append({
            "pageNo": page_no,
            "imagePath": str(out_file),
            "relativeImagePath": str(out_file.relative_to(out_dir.parent)).replace("\\", "/"),
            "width": pix.width,
            "height": pix.height,
        })
    return items


def fixed_4page_20_plus_4_boxes():
    """Legacy debug-only boxes. Do not use for production candidate image fields."""
    return [
        (1, "1", 1, (50, 560, 915, 960)),
        (2, "2", 1, (50, 1120, 915, 1480)),
        (3, "3", 1, (50, 1680, 915, 2300)),
        (4, "4", 1, (900, 430, 1765, 790)),
        (5, "5", 1, (900, 950, 1765, 1240)),
        (6, "6", 1, (900, 1340, 1765, 1785)),
        (7, "7", 1, (900, 1840, 1765, 2220)),
        (8, "8", 2, (50, 150, 915, 390)),
        (9, "9", 2, (50, 620, 915, 910)),
        (10, "10", 2, (50, 1160, 915, 1490)),
        (11, "11", 2, (50, 1680, 915, 2310)),
        (12, "12", 2, (900, 130, 1765, 400)),
        (13, "13", 2, (900, 560, 1765, 980)),
        (14, "14", 2, (900, 1160, 1765, 1450)),
        (15, "15", 2, (900, 1880, 1765, 2180)),
        (16, "16", 3, (50, 150, 915, 900)),
        (17, "17", 3, (50, 1080, 915, 1430)),
        (18, "18", 3, (50, 1780, 915, 2360)),
        (19, "19", 3, (900, 140, 1765, 680)),
        (20, "20", 3, (900, 980, 1765, 1600)),
        (21, "서논술형1", 4, (50, 430, 915, 820)),
        (22, "서논술형2", 4, (50, 1360, 915, 1820)),
        (23, "서논술형3", 4, (900, 150, 1765, 430)),
        (24, "서논술형4", 4, (900, 980, 1765, 1380)),
    ]


def make_debug_question_crops(root, page_items, expected_count):
    if len(page_items) != 4 or expected_count not in (0, 24):
        return []
    crops_dir = root / "crops" / "debug_questions"
    crops_dir.mkdir(parents=True, exist_ok=True)
    items = []
    for qid, display, page_no, box in fixed_4page_20_plus_4_boxes():
        page_img = root / "pages" / f"page_p{page_no:03d}.png"
        if not page_img.exists():
            continue
        crop_path = crops_dir / f"q{qid:02d}.png"
        img = Image.open(page_img)
        img.crop(box).save(crop_path)
        x1, y1, x2, y2 = box
        items.append({
            "id": qid,
            "displayNo": display,
            "pageNo": page_no,
            "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "debugCropPath": str(crop_path),
            "policy": "debug_only_not_candidate_image",
        })
    return items


def make_debug_contact_sheet(root, debug_items):
    tiles = []
    for item in debug_items:
        image_path = Path(item["debugCropPath"])
        if not image_path.exists():
            continue
        im = Image.open(image_path).convert("RGB")
        im.thumbnail((420, 300))
        tile = Image.new("RGB", (440, 340), "white")
        draw = ImageDraw.Draw(tile)
        draw.text((10, 8), f"debug q{item['id']:02d} / {item['displayNo']}", fill="black")
        tile.paste(im, (10, 35))
        tiles.append(tile)
    if not tiles:
        return ""
    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 440, rows * 340), "white")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % cols) * 440, (index // cols) * 340))
    out = root / "reports" / "debug_question_crop_contact_sheet.jpg"
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, quality=90)
    return str(out)


def load_vision_json(path):
    if not path:
        return None
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"vision json not found: {p}")
    data = json.loads(p.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return {"pages": data}
    if "pages" in data:
        return data
    if "questions" in data:
        return {"pages": [data]}
    raise ValueError("vision json must contain pages[] or questions[]")


def question_type_from_raw(raw, display_no):
    value = str(raw or "").strip()
    if value:
        if "서" in value or "술" in value or "essay" in value.lower() or "subjective" in value.lower():
            return "서술형"
        if "객" in value or "choice" in value.lower() or "multiple" in value.lower():
            return "객관식"
        return value
    display = str(display_no or "")
    if "서" in display or "술" in display:
        return "서술형"
    return "객관식"


def as_float(value, default=0.0):
    try:
        return float(value)
    except Exception:
        return default


def normalize_bbox(raw):
    if not raw:
        return None
    if isinstance(raw, dict):
        keys = ["x1", "y1", "x2", "y2"]
        if all(key in raw for key in keys):
            return {key: int(round(as_float(raw[key]))) for key in keys}
        alt = ["left", "top", "right", "bottom"]
        if all(key in raw for key in alt):
            return {
                "x1": int(round(as_float(raw["left"]))),
                "y1": int(round(as_float(raw["top"]))),
                "x2": int(round(as_float(raw["right"]))),
                "y2": int(round(as_float(raw["bottom"]))),
            }
    if isinstance(raw, (list, tuple)) and len(raw) == 4:
        return {"x1": int(round(as_float(raw[0]))), "y1": int(round(as_float(raw[1]))), "x2": int(round(as_float(raw[2]))), "y2": int(round(as_float(raw[3])))}
    return None


def bbox_validation(bbox, page_width, page_height):
    if not bbox:
        return False, ["visual_asset_bbox_missing"]
    x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
    reasons = []
    if x2 <= x1 or y2 <= y1:
        reasons.append("visual_asset_bbox_invalid_order")
    if x1 < 0 or y1 < 0 or x2 > page_width or y2 > page_height:
        reasons.append("visual_asset_bbox_outside_page")
    width = x2 - x1
    height = y2 - y1
    if width < VISUAL_ASSET_MIN_WIDTH or height < VISUAL_ASSET_MIN_HEIGHT:
        reasons.append("visual_asset_bbox_too_small")
    area_ratio = (width * height) / max(page_width * page_height, 1)
    if area_ratio > VISUAL_ASSET_MAX_PAGE_AREA_RATIO:
        reasons.append("visual_asset_bbox_too_large_possible_question_or_page_crop")
    return not reasons, reasons


def normalize_vision_questions(manifest, page_items, vision_data, root):
    page_by_no = {int(item["pageNo"]): item for item in page_items}
    questions = []
    review_rows = []
    schema_errors = []
    pages = vision_data.get("pages") or []
    sequential_id = 1
    seen_display = set()

    for page in pages:
        page_no = int(page.get("pageNo") or page.get("page") or 0)
        page_meta = page_by_no.get(page_no)
        if not page_meta:
            schema_errors.append({"pageNo": page_no, "error": "pageNo_not_rendered"})
            continue
        for raw_q in page.get("questions") or []:
            display_no = str(raw_q.get("displayNo") or raw_q.get("questionNo") or raw_q.get("sourceQuestionNo") or sequential_id).strip()
            if not display_no:
                display_no = str(sequential_id)
            duplicate = display_no in seen_display
            seen_display.add(display_no)
            qid = int(raw_q.get("id") or sequential_id)
            sequential_id += 1
            content = str(raw_q.get("content") or "").strip()
            raw_choices = raw_q.get("choices") or []
            choices = [str(choice).strip() for choice in raw_choices if str(choice).strip()]
            has_visual = bool(raw_q.get("hasVisualAsset") or raw_q.get("cropNeeded") or raw_q.get("hasImage"))
            visual_type = str(raw_q.get("visualAssetType") or raw_q.get("imageType") or ("unknown" if has_visual else "none")).strip() or "none"
            bbox = normalize_bbox(raw_q.get("visualAssetBBox") or raw_q.get("visualAssetBBoxOnPage") or raw_q.get("bbox"))
            bbox_ok, bbox_reasons = bbox_validation(bbox, int(page_meta["width"]), int(page_meta["height"])) if has_visual else (True, [])
            review_reasons = []
            if duplicate:
                review_reasons.append("displayNo_duplicate")
            if not content:
                review_reasons.append("content_empty_or_not_extracted")
            if question_type_from_raw(raw_q.get("questionType"), display_no) == "객관식" and len(choices) not in (0, 5):
                review_reasons.append("objective_choices_count_not_5")
            if has_visual and not bbox_ok:
                review_reasons.extend(bbox_reasons)
            for key, threshold in (("contentConfidence", 0.75), ("choicesConfidence", 0.75), ("visualAssetConfidence", 0.70)):
                value = as_float(raw_q.get(key), 0.0)
                if value and value < threshold:
                    review_reasons.append(f"{key}_low")
            raw_review = raw_q.get("reviewReason") or []
            if isinstance(raw_review, str):
                raw_review = [raw_review]
            review_reasons.extend(str(reason) for reason in raw_review if str(reason).strip())
            question = {
                "id": qid,
                "level": "",
                "category": "",
                "originalCategory": "",
                "standardCourse": manifest.get("course") or "",
                "standardUnitKey": "",
                "standardUnit": "",
                "standardUnitOrder": 0,
                "questionType": question_type_from_raw(raw_q.get("questionType"), display_no),
                "layoutTag": "grid",
                "tags": ["기출"],
                "wide": False,
                "content": content,
                "choices": choices,
                "answer": "",
                "solution": "",
                "image": "",
                "visualAsset": "",
                "hasVisualAsset": has_visual,
                "visualAssetType": visual_type,
                "visualAssetBBoxOnPage": bbox,
                "visualAssetStatus": "bbox_pending_crop" if has_visual and bbox_ok else ("bbox_manual_review" if has_visual else "no_visual_asset_required"),
                "examId": manifest["examId"],
                "sourceFile": manifest["pdfPath"],
                "sourceQuestionNo": display_no,
                "displayNo": display_no,
                "pageNo": page_no,
                "cropPath": "",
                "fullPageImagePath": page_meta["imagePath"],
                "fullPageImageRelPath": page_meta["relativeImagePath"],
                "imageStatus": "visual_asset_pending_crop" if has_visual and bbox_ok else "no_question_crop",
                "contentSource": "vision_page" if content else "vision_required",
                "choicesSource": "vision_page" if choices else "vision_required",
                "answerSource": "not_in_pipeline",
                "solutionSource": "not_in_pipeline",
                "answerStatus": "external_agent_required",
                "solutionStatus": "external_agent_required",
                "extractionStatus": "vision_extracted" if content else "vision_extract_incomplete",
                "reviewStatus": "manual_review" if review_reasons or raw_q.get("reviewNeeded") else "vision_extracted_pending_answer_solution",
                "reviewReason": sorted(set(review_reasons)),
                "contentConfidence": as_float(raw_q.get("contentConfidence"), 0.0),
                "choicesConfidence": as_float(raw_q.get("choicesConfidence"), 0.0),
                "visualAssetConfidence": as_float(raw_q.get("visualAssetConfidence"), 0.0),
                "tagConfidence": "low",
                "tagStatus": "manual_review",
            }
            questions.append(question)
            if question["reviewReason"]:
                review_rows.append({
                    "id": qid,
                    "displayNo": display_no,
                    "pageNo": page_no,
                    "reason": ";".join(question["reviewReason"]),
                    "contentStatus": "ok" if content else "empty",
                    "choicesStatus": "ok" if choices else "empty_or_not_required",
                    "hasVisualAsset": str(has_visual),
                })
    return questions, review_rows, schema_errors


def build_skeleton_questions(manifest, page_items):
    expected = int(manifest.get("expectedQuestionCount") or 0)
    questions = []
    for index in range(expected):
        qid = index + 1
        page_meta = page_items[min(len(page_items) - 1, index * max(len(page_items), 1) // max(expected, 1))] if page_items else {"pageNo": 0, "imagePath": "", "relativeImagePath": ""}
        questions.append({
            "id": qid,
            "level": "",
            "category": "",
            "originalCategory": "",
            "standardCourse": manifest.get("course") or "",
            "standardUnitKey": "",
            "standardUnit": "",
            "standardUnitOrder": 0,
            "questionType": "",
            "layoutTag": "grid",
            "tags": ["기출"],
            "wide": False,
            "content": "",
            "choices": [],
            "answer": "",
            "solution": "",
            "image": "",
            "visualAsset": "",
            "hasVisualAsset": False,
            "visualAssetType": "none",
            "visualAssetBBoxOnPage": None,
            "visualAssetStatus": "vision_extract_required",
            "examId": manifest["examId"],
            "sourceFile": manifest["pdfPath"],
            "sourceQuestionNo": str(qid),
            "displayNo": str(qid),
            "pageNo": page_meta.get("pageNo", 0),
            "cropPath": "",
            "fullPageImagePath": page_meta.get("imagePath", ""),
            "fullPageImageRelPath": page_meta.get("relativeImagePath", ""),
            "imageStatus": "no_question_crop",
            "contentSource": "vision_required",
            "choicesSource": "vision_required",
            "answerSource": "not_in_pipeline",
            "solutionSource": "not_in_pipeline",
            "answerStatus": "external_agent_required",
            "solutionStatus": "external_agent_required",
            "extractionStatus": "vision_extract_required",
            "reviewStatus": "manual_review",
            "reviewReason": ["vision_page_extract_json_missing"],
            "tagConfidence": "low",
            "tagStatus": "manual_review",
        })
    return questions


def write_candidate_js(manifest, questions, candidate_file):
    candidate_file.parent.mkdir(parents=True, exist_ok=True)
    candidate_file.write_text(
        "window.examTitle = "
        + json.dumps(manifest["examId"], ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


def crop_visual_assets(root, questions):
    results = []
    for q in questions:
        if not q.get("hasVisualAsset"):
            continue
        bbox = q.get("visualAssetBBoxOnPage")
        page_path = Path(str(q.get("fullPageImagePath") or ""))
        result = {
            "id": q.get("id"),
            "displayNo": q.get("displayNo"),
            "pageNo": q.get("pageNo"),
            "fullPageImagePath": str(page_path),
            "bbox": bbox,
        }
        if not page_path.exists():
            result.update({"status": "full_page_image_missing"})
            q["visualAssetStatus"] = "manual_review_full_page_missing"
            q["reviewStatus"] = "manual_review"
            q.setdefault("reviewReason", []).append("full_page_image_missing_for_visual_asset")
            results.append(result)
            continue
        try:
            with Image.open(page_path).convert("RGB") as image:
                ok, reasons = bbox_validation(bbox, image.width, image.height)
                if not ok:
                    result.update({"status": "visual_asset_bbox_rejected", "reasons": reasons})
                    q["visualAssetStatus"] = "bbox_manual_review"
                    q["imageStatus"] = "visual_asset_crop_failed_no_fallback"
                    q["reviewStatus"] = "manual_review"
                    q.setdefault("reviewReason", []).extend(reasons)
                    results.append(result)
                    continue
                x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
                asset_rel = f"assets/q{int(q['id']):03d}_visual.png"
                asset_path = root / asset_rel
                asset_path.parent.mkdir(parents=True, exist_ok=True)
                image.crop((x1, y1, x2, y2)).save(asset_path)
                q["image"] = asset_rel
                q["visualAsset"] = asset_rel
                q["visualAssetStatus"] = "cropped_from_full_page_bbox"
                q["imageStatus"] = "visual_asset_only"
                result.update({
                    "status": "asset_crop_success",
                    "assetRel": asset_rel,
                    "assetPath": str(asset_path),
                    "width": x2 - x1,
                    "height": y2 - y1,
                    "areaRatioOfPage": round(((x2 - x1) * (y2 - y1)) / max(image.width * image.height, 1), 6),
                })
        except Exception as exc:
            result.update({"status": "visual_asset_crop_exception", "error": str(exc)})
            q["visualAssetStatus"] = "manual_review_crop_exception"
            q["imageStatus"] = "visual_asset_crop_failed_no_fallback"
            q["reviewStatus"] = "manual_review"
            q.setdefault("reviewReason", []).append("visual_asset_crop_exception")
        results.append(result)
    return results


def image_path_gate(questions):
    items = []
    bad_terms = ["pages/", "pages\\", "crops/questions", "crops\\questions", "debug_questions", "page_p"]
    for q in questions:
        image = str(q.get("image") or "")
        visual_asset = str(q.get("visualAsset") or "")
        statuses = []
        normalized = image.replace("\\", "/")
        if image:
            if any(term in image for term in bad_terms) or any(term in normalized for term in ["pages/", "crops/questions", "debug_questions", "page_p"]):
                statuses.append("image_points_to_page_or_question_crop")
            if q.get("cropPath") and image == q.get("cropPath"):
                statuses.append("image_equals_question_crop_path")
            if q.get("fullPageImagePath") and image == q.get("fullPageImagePath"):
                statuses.append("image_equals_full_page_path")
            if visual_asset and image != visual_asset:
                statuses.append("image_not_equal_to_visual_asset")
        if q.get("hasVisualAsset") and not visual_asset:
            statuses.append("has_visual_asset_but_asset_missing")
        if statuses:
            items.append({
                "id": q.get("id"),
                "displayNo": q.get("displayNo"),
                "image": image,
                "visualAsset": visual_asset,
                "cropPath": q.get("cropPath") or "",
                "fullPageImagePath": q.get("fullPageImagePath") or "",
                "statuses": statuses,
                "status": statuses[0],
            })
    return {"status": "ok" if not items else "fail", "itemCount": len(items), "items": items}


def write_vision_contract_reports(root, manifest, page_items):
    reports = root / "reports"
    schema = {
        "type": "object",
        "required": ["pages"],
        "properties": {
            "pages": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["pageNo", "questions"],
                    "properties": {
                        "pageNo": {"type": "integer"},
                        "questions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": ["displayNo", "questionType", "content", "choices", "hasVisualAsset", "visualAssetType", "visualAssetBBox", "reviewNeeded", "reviewReason"],
                                "properties": {
                                    "displayNo": {"type": "string"},
                                    "questionType": {"type": "string", "description": "객관식 or 서술형"},
                                    "content": {"type": "string"},
                                    "choices": {"type": "array", "items": {"type": "string"}},
                                    "hasVisualAsset": {"type": "boolean"},
                                    "visualAssetType": {"type": "string", "description": "graph|figure|table|diagram|image|none|unknown"},
                                    "visualAssetBBox": {"description": "page-coordinate bbox {x1,y1,x2,y2}; null if no visual asset"},
                                    "contentConfidence": {"type": "number"},
                                    "choicesConfidence": {"type": "number"},
                                    "visualAssetConfidence": {"type": "number"},
                                    "reviewNeeded": {"type": "boolean"},
                                    "reviewReason": {"type": "array", "items": {"type": "string"}},
                                },
                            },
                        },
                    },
                },
            },
        },
    }
    prompt = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "task": "Analyze each full page image and return only the JSON matching reports/vision_page_extract_schema.json.",
        "strictRules": [
            "Extract displayNo, questionType, content, choices, hasVisualAsset, visualAssetType, visualAssetBBox, confidence fields, reviewNeeded, and reviewReason from full-page evidence.",
            "Do not solve questions.",
            "Do not fill answer.",
            "Do not write solution.",
            "Do not guess missing text or choices. contentSource/choicesSource=vision_required must remain manual review, not dummy text.",
            "If content, choices, formula, or visual bbox is uncertain, set reviewNeeded=true with a concrete reviewReason.",
            "visualAssetBBox must surround only the graph/figure/table/diagram/image inside the question, not the whole question and not the whole page.",
            "Full page evidence is the source of truth for content and choices; crops are auxiliary zoom evidence only.",
            "If there is no graph/figure/table/diagram/image, set hasVisualAsset=false, visualAssetType='none', visualAssetBBox=null.",
        ],
        "pages": [
            {
                "pageNo": item["pageNo"],
                "imagePath": item["imagePath"],
                "width": item["width"],
                "height": item["height"],
            }
            for item in page_items
        ],
    }
    write_json(reports / "vision_page_extract_schema.json", schema)
    write_json(reports / "vision_page_extract_request.json", prompt)
    md = """# Vision Page Extract Request\n\nReturn JSON only. Do not solve, do not fill answers, and do not write solutions.\n\nFor each full page image, extract every question on that page and return:\n\n- displayNo\n- questionType\n- content\n- choices\n- hasVisualAsset\n- visualAssetType\n- visualAssetBBox on the full page image coordinate system\n- contentConfidence\n- choicesConfidence\n- visualAssetConfidence\n- reviewNeeded\n- reviewReason\n\nThe visualAssetBBox must crop only the visual asset inside the question, such as a graph, figure, table, diagram, or image. It must not be the whole question crop.\n\nAnswers and solutions are intentionally outside this extraction pipeline.\n"""
    (reports / "VISION_PAGE_EXTRACT_REQUEST.md").write_text(md, encoding="utf-8")
    return schema, prompt


def write_final_reports(root, manifest, page_items, questions, manual_review_rows, schema_errors, crop_results, image_gate, candidate_file, debug_items, debug_contact_sheet):
    reports = root / "reports"
    answer_solution_rows = [
        {
            "id": q.get("id"),
            "displayNo": q.get("displayNo"),
            "questionType": q.get("questionType"),
            "pageNo": q.get("pageNo"),
            "hasVisualAsset": str(bool(q.get("hasVisualAsset"))),
            "fullPageImagePath": q.get("fullPageImagePath") or "",
            "image": q.get("image") or "",
            "answerStatus": q.get("answerStatus") or "external_agent_required",
            "solutionStatus": q.get("solutionStatus") or "external_agent_required",
        }
        for q in questions
    ]
    write_csv(reports / "extraction_manual_review.csv", manual_review_rows, ["id", "displayNo", "pageNo", "reason", "contentStatus", "choicesStatus", "hasVisualAsset"])
    write_csv(reports / "answer_solution_required.csv", answer_solution_rows, ["id", "displayNo", "questionType", "pageNo", "hasVisualAsset", "fullPageImagePath", "image", "answerStatus", "solutionStatus"])
    write_json(reports / "vision_schema_errors.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "ok" if not schema_errors else "manual_review", "items": schema_errors})
    write_json(reports / "vision_asset_crop_map.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "ok", "items": crop_results})
    write_json(reports / "visual_asset_link_audit.json", {"examId": manifest["examId"], "generatedAt": now_iso(), **image_gate})
    write_json(reports / "question_crop_map.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "policy": "question_crops_disabled_by_default", "questionCount": 0, "items": []})
    write_json(reports / "debug_question_crop_map.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "policy": "debug_only_not_candidate_image", "questionCount": len(debug_items), "contactSheet": debug_contact_sheet, "items": debug_items})
    write_json(reports / "content_manual_review.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "manual_review" if manual_review_rows else "ok", "items": manual_review_rows})
    write_json(reports / "missing_answer_report.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "external_agent_required", "policy": "answer_is_not_in_extraction_pipeline", "items": answer_solution_rows})
    write_json(reports / "missing_solution_report.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "external_agent_required", "policy": "solution_is_not_in_extraction_pipeline", "items": answer_solution_rows})
    for report_name in [
        "crop_failed.json",
        "answer_solution_manual_review.json",
        "formula_manual_review.json",
        "missing_image_report.json",
        "tag_low_confidence_report.json",
        "duplicate_question_report.json",
    ]:
        write_json(reports / report_name, {"examId": manifest["examId"], "generatedAt": now_iso(), "status": "ok", "items": []})
    handoff_manifest = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "handoffTarget": "GPT/Gemini answer-solution agent",
        "policy": "candidate JS plus full-page images are passed to the external agent. The extraction pipeline does not fill answer or solution. Full-page evidence is the source of truth for content/choices; crops are auxiliary only.",
        "candidateJs": str(candidate_file),
        "requiredFiles": [
            str(candidate_file),
            *[item["imagePath"] for item in page_items],
            str(reports / "answer_solution_required.csv"),
            str(reports / "extraction_manual_review.csv"),
            str(reports / "vision_asset_crop_map.json"),
        ],
        "allowedExternalAgentEdits": ["answer", "solution", "answerStatus", "solutionStatus"],
        "contentChoicesPolicy": "content/choices/image are extraction outputs. External answer-solution agent must not change them unless it verifies the mismatch against full-page evidence and records an explicit extraction_correction_report item. cropPath/debug crops are auxiliary zoom evidence only.",
        "items": answer_solution_rows,
    }
    write_json(reports / "gpt_gemini_handoff_manifest.json", handoff_manifest)
    next_actions = """# Past Exam Pipeline V2 Next Actions\n\n## Current policy\n\n- Full page PNG images are the extraction evidence.\n- Page-level Vision JSON is the extraction source for content, choices, and visual asset bbox.\n- Question-wide crops are disabled by default.\n- Candidate `image` must never point to a page image or question crop.\n- Candidate `image` may point only to a visual asset crop made from `visualAssetBBoxOnPage`.\n- `answer` and `solution` are intentionally outside this extraction pipeline.\n\n## Next handoff\n\nSend the candidate JS, pages directory, assets directory, and reports directory to GPT/Gemini for answer/solution fill.\n"""
    (reports / "NEXT_ACTIONS.md").write_text(next_actions, encoding="utf-8")
    generated_files = [
        "manifest.json",
        safe_rel(candidate_file, root),
        "pages/",
        "assets/",
        "reports/page_render_report.json",
        "reports/vision_page_extract_schema.json",
        "reports/vision_page_extract_request.json",
        "reports/vision_asset_crop_map.json",
        "reports/visual_asset_link_audit.json",
        "reports/extraction_manual_review.csv",
        "reports/answer_solution_required.csv",
        "reports/gpt_gemini_handoff_manifest.json",
        "reports/NEXT_ACTIONS.md",
    ]
    write_json(reports / "generated_files_manifest.json", {"examId": manifest["examId"], "generatedAt": now_iso(), "files": generated_files})
    has_required_vision_missing = any(q.get("extractionStatus") == "vision_extract_required" for q in questions)
    status = "ok" if questions and image_gate["status"] == "ok" and not schema_errors and not manual_review_rows and not has_required_vision_missing else "manual_review"
    validation = {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "candidateFile": str(candidate_file),
        "currentStage": "full_page_vision_extraction_package",
        "status": status,
        "questionCount": len(questions),
        "pageCount": len(page_items),
        "answerSolutionPolicy": "excluded_from_pipeline_external_agent_required",
        "questionCropPolicy": "disabled_by_default_debug_only",
        "imageFieldPolicy": "visual_asset_only_never_question_crop",
        "manualReviewCount": len(manual_review_rows),
        "schemaErrorCount": len(schema_errors),
        "visualAssetCropCount": sum(1 for item in crop_results if item.get("status") == "asset_crop_success"),
        "imageGateStatus": image_gate["status"],
        "blockedReasons": [] if status == "ok" else [
            *( ["vision_json_missing_or_incomplete"] if has_required_vision_missing else [] ),
            *( ["visual_asset_link_gate_failed"] if image_gate["status"] != "ok" else [] ),
            *( ["vision_schema_errors_present"] if schema_errors else [] ),
        ],
        "notFailures": ["answer_blank", "solution_blank", "blank_image_when_no_visual_asset"],
        "fullPageFirstPolicy": "fullPageImagePath/sourcePageEvidencePaths are the source of truth for displayNo/content/choices; cropPath is auxiliary only",
    }
    write_json(reports / "validation_summary.json", validation)
    return validation


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--candidate-file", required=True)
    parser.add_argument("--vision-json", default="")
    parser.add_argument("--create-question-crops", action="store_true", help="debug only; generated crops are never linked to candidate image")
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    root = Path(args.out)
    reports = root / "reports"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    root.mkdir(parents=True, exist_ok=True)
    reports.mkdir(parents=True, exist_ok=True)

    page_items = render_pdf(Path(manifest["pdfPath"]), root / "pages", "page", args.dpi)
    write_json(reports / "page_render_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "ok",
        "dpi": args.dpi,
        "pageCount": len(page_items),
        "items": page_items,
    })

    write_json(reports / "solution_page_render_report.json", {
        "examId": manifest["examId"],
        "generatedAt": now_iso(),
        "status": "skipped",
        "policy": "answer_and_solution_are_not_in_extraction_pipeline",
        "solutionPdfPath": manifest.get("solutionPdfPath", ""),
        "answerPdfPath": manifest.get("answerPdfPath", ""),
        "pageCount": 0,
        "items": [],
    })

    write_vision_contract_reports(root, manifest, page_items)
    vision_path = args.vision_json or manifest.get("visionPageExtractJsonPath") or manifest.get("visionExtractJsonPath") or ""
    vision_data = load_vision_json(vision_path) if vision_path else None
    if vision_data:
        write_json(reports / "vision_page_extract.json", vision_data)
        questions, manual_review_rows, schema_errors = normalize_vision_questions(manifest, page_items, vision_data, root)
    else:
        questions = build_skeleton_questions(manifest, page_items)
        manual_review_rows = [
            {
                "id": q["id"],
                "displayNo": q["displayNo"],
                "pageNo": q["pageNo"],
                "reason": "vision_page_extract_json_missing",
                "contentStatus": "empty",
                "choicesStatus": "empty_or_not_required",
                "hasVisualAsset": "False",
            }
            for q in questions
        ]
        schema_errors = []
        write_json(reports / "vision_page_extract.json", {
            "examId": manifest["examId"],
            "generatedAt": now_iso(),
            "status": "not_provided",
            "policy": "use reports/vision_page_extract_request.json and schema, then rerun with --vision-json",
            "pages": [],
        })

    manifest["expectedQuestionCount"] = len(questions) or int(manifest.get("expectedQuestionCount") or 0)
    manifest["pipelineVersion"] = "past_exam_full_page_vision_v2"
    manifest["questionCropPolicy"] = "disabled_by_default_debug_only"
    manifest["answerSolutionPolicy"] = "excluded_from_extraction_pipeline"
    write_json(root / "manifest.json", manifest)

    crop_results = crop_visual_assets(root, questions)
    image_gate = image_path_gate(questions)
    write_candidate_js(manifest, questions, Path(args.candidate_file))

    debug_items = []
    debug_contact_sheet = ""
    if args.create_question_crops:
        debug_items = make_debug_question_crops(root, page_items, int(manifest.get("expectedQuestionCount") or 0))
        debug_contact_sheet = make_debug_contact_sheet(root, debug_items)

    validation = write_final_reports(root, manifest, page_items, questions, manual_review_rows, schema_errors, crop_results, image_gate, Path(args.candidate_file), debug_items, debug_contact_sheet)
    print(json.dumps(validation, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
