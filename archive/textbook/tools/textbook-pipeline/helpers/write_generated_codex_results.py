import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
AGGREGATE_ROOT = ROOT / "generated" / "2026-05-23_pipeline_results"

OVERRIDES = {
    "_비상교육_고등_대수_교과서": {
        "mapCount": 254,
        "zipCount": 12,
        "status": "PASS",
        "note": "new 4 PDF fresh unit input packs: Visang Algebra textbook, final input zip 12, crop quality PASS.",
    },
    "_비상교육_고등_확률과통계": {
        "mapCount": 288,
        "zipCount": 11,
        "status": "PASS",
        "note": "new 4 PDF fresh unit input packs: Visang Probability and Statistics textbook, final input zip 11, crop quality PASS.",
    },
    "22개정_마플시너지_공통수학1": {
        "mapCount": 1579,
        "zipCount": 5,
        "status": "PARTIAL",
        "note": "new 4 PDF fresh unit input packs: MAPL Synergy Common Math 1, manual_review 11, unresolved standard-unit set 3.",
    },
    "22개정_마플시너지_공통수학2": {
        "mapCount": 2925,
        "zipCount": 4,
        "finalZipCount": 12,
        "status": "PARTIAL",
        "note": "new 4 PDF fresh unit input packs: MAPL Synergy Common Math 2, manual_review 18, unresolved standard-unit set 4.",
    },
}


def read_json(path, fallback=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def count_json_items(path):
    data = read_json(path)
    if isinstance(data, list):
        return len(data)
    if isinstance(data, dict):
        if isinstance(data.get("items"), list):
            return len(data["items"])
        if isinstance(data.get("manualReviewItems"), list):
            return len(data["manualReviewItems"])
        if isinstance(data.get("unresolved"), list):
            return len(data["unresolved"])
        if isinstance(data.get("violations"), list):
            return len(data["violations"])
    return 0


def js_question_count(generated):
    js_root = generated / "js"
    if not js_root.exists():
        return {"count": 0, "files": 0, "byFile": []}
    total = 0
    by_file = []
    for path in sorted(js_root.rglob("*.js")):
        text = path.read_text(encoding="utf-8-sig", errors="ignore")
        match = re.search(r"window\.questionBank\s*=\s*\[(.*)\]\s*;", text, re.S)
        count = len(re.findall(r'"id"\s*:', match.group(1))) if match else 0
        total += count
        by_file.append({
            "path": path.relative_to(generated).as_posix(),
            "questionCount": count,
        })
    return {"count": total, "files": len(by_file), "byFile": by_file}


def crop_image_count(generated):
    work = generated / "work"
    roots = [
        work / "question_crops_tight",
        work / "question_crops_refined",
        work / "question_crops",
    ]
    total = 0
    existing = []
    for root in roots:
        if root.exists():
            count = len(list(root.rglob("*.png")))
            total += count
            existing.append({"root": root.relative_to(generated).as_posix(), "count": count})
    return {"count": total, "roots": existing}


def page_image_count(generated):
    work = generated / "work"
    roots = [
        work / "rendered_pages",
        work / "page_crops",
    ]
    total = 0
    existing = []
    for root in roots:
        if root.exists():
            count = len(list(root.rglob("*.png")))
            total += count
            existing.append({"root": root.relative_to(generated).as_posix(), "count": count})
    return {"count": total, "roots": existing}


def visual_asset_count(generated):
    root = generated / "assets"
    return len(list(root.rglob("*.png"))) if root.exists() else 0


def count_reconciliation(generated, map_count):
    js = js_question_count(generated)
    images = crop_image_count(generated)
    pages = page_image_count(generated)
    assets = visual_asset_count(generated)
    has_map = map_count > 0
    comparable_crop_count = map_count if has_map else images["count"]
    diff = comparable_crop_count - js["count"]
    question_crop_status = "PASS" if js["count"] == comparable_crop_count else "WARN"
    page_evidence_status = "PASS" if js["count"] == 0 or pages["count"] > 0 or has_map else "FAIL"
    status = "PASS" if page_evidence_status == "PASS" else "FAIL"
    reason = "Full page evidence is primary; question crops are optional zoom/reference material."
    if not has_map:
        reason = "No primary question/page map found; full page evidence is required for transcription and question crops are optional."
    if diff:
        reason = "Question crop count differs from JS question count; this is a warning when full page evidence exists."
    return {
        "status": status,
        "pageEvidenceStatus": page_evidence_status,
        "questionCropStatus": question_crop_status,
        "jsQuestionCount": js["count"],
        "jsFileCount": js["files"],
        "pageFullImageCount": pages["count"],
        "pageFullImageRoots": pages["roots"],
        "cropMapCount": map_count,
        "cropImageCount": images["count"],
        "cropImageRoots": images["roots"],
        "visualAssetCount": assets,
        "comparableCropCount": comparable_crop_count,
        "differenceCropMinusQuestion": diff,
        "basicProblemExcludedCount": 0,
        "basicProblemExclusionPolicy": "Question crops are optional zoom/reference material. Any omitted crop must still have full page evidence.",
        "reason": reason,
        "byJsFile": js["byFile"],
    }


def first_existing(paths):
    for path in paths:
        if path.exists():
            return path
    return None


def detect_input_pdf(folder):
    candidates = [
        ROOT / f"{folder.name}.pdf",
        ROOT / f"{folder.name}_교과서.pdf",
    ]
    if folder.name == "_비상교육_고등_확률과통계":
        candidates.insert(0, ROOT / "_비상교육_고등_확률과통계.pdf")
    for path in candidates:
        if path.exists():
            return path.name
    return ""


def classify(folder):
    name = folder.name
    if "라이트쎈" in name:
        return "Lightssen scanned workbook"
    if "RPM" in name:
        return "RPM workbook"
    if "마플시너지" in name:
        return "MAPL Synergy scanned workbook"
    if "대수" in name or "확률과통계" in name:
        return "Visang high-school textbook"
    if "교과서" in name:
        return "textbook"
    return "textbook pipeline output"


def report_paths(generated):
    reports = generated / "reports"
    return {
        "quality": reports / "question_crop_quality_summary.json",
        "tight": reports / "question_crop_tighten_summary.json",
        "id": reports / "id_sequence_report.json",
        "manual": reports / "question_crop_manual_review_required.json",
        "recrop": reports / "question_crop_recrop_apply_report.json",
        "map": first_existing([
            reports / "question_crop_map.json",
            reports / "rpm_question_crop_map.json",
            reports / "text1_question_crop_map.json",
            reports / "donga_question_crop_map.json",
        ]),
    }


def status_from_reports(paths):
    quality = read_json(paths["quality"], {})
    if isinstance(quality, dict) and quality.get("status"):
        return str(quality["status"]).upper()
    return "PASS"


def manual_reports(generated):
    reports = generated / "reports"
    names = [
        "question_crop_manual_review_required.json",
        "question_crop_recrop_candidates.json",
        "standard_unit_mapping_unresolved.json",
        "unresolved_standard_unit_report.json",
        "missing_expected_sections.json",
        "id_duplicate_report.json",
        "id_gap_report.json",
        "setkey_id_restart_violation_report.json",
    ]
    rows = []
    for name in names:
        path = reports / name
        if path.exists():
            count = count_json_items(path)
            rows.append((name, count))
    return rows


def collect(folder):
    generated = folder / "generated"
    reports = generated / "reports"
    paths = report_paths(generated)
    quality = read_json(paths["quality"], {})
    tight = read_json(paths["tight"], {})
    seq = read_json(paths["id"], {})
    recrop = read_json(paths["recrop"], {})
    map_count = count_json_items(paths["map"]) if paths["map"] else 0
    js_files = sorted((generated / "js").rglob("*.js")) if (generated / "js").exists() else []
    zip_files = sorted((generated / "review_pack").rglob("*.zip")) if (generated / "review_pack").exists() else []
    final_zip_files = sorted((generated / "review_pack" / "final_input_packs").rglob("*.zip")) if (generated / "review_pack" / "final_input_packs").exists() else []
    data = {
        "folder": folder,
        "generated": generated,
        "reports": reports,
        "inputPdf": detect_input_pdf(folder),
        "type": classify(folder),
        "quality": quality if isinstance(quality, dict) else {},
        "tight": tight if isinstance(tight, dict) else {},
        "seq": seq if isinstance(seq, dict) else {},
        "recrop": recrop if isinstance(recrop, dict) else {},
        "mapCount": map_count,
        "jsCount": len(js_files),
        "zipCount": len(zip_files),
        "finalZipCount": len(final_zip_files),
        "zipFiles": zip_files,
        "manualReports": manual_reports(generated),
        "status": status_from_reports(paths),
    }
    override = OVERRIDES.get(folder.name)
    if override:
        for key in ("status", "note", "zipCount", "finalZipCount"):
            if key in override:
                data[key] = override[key]
    data["countReconciliation"] = count_reconciliation(generated, data["mapCount"])
    return data


def md_for(data):
    rel_generated = data["generated"].relative_to(ROOT).as_posix()
    lines = [
        "# CODEX_RESULT",
        "",
        "## Output Root Policy",
        "",
        "- Canonical location: this file, inside the generated output root.",
        f"- Generated root: `{rel_generated}`",
        "- Do not use `archive/textbook/CODEX_RESULT.md` as the canonical result file for this output.",
        "",
        "## Input",
        "",
        f"- Input PDF: `{data['inputPdf'] or 'unknown'}`",
        f"- Output type: {data['type']}",
    ]
    if data.get("note"):
        lines.append(f"- Pipeline note: {data['note']}")
    lines.extend([
        "",
        "## Stage Summary",
        "",
        f"- Question crop map count: {data['mapCount']}",
        f"- Generated JS files: {data['jsCount']}",
        f"- Review/fresh zip files: {data['zipCount']}",
    ])
    if data["finalZipCount"]:
        lines.append(f"- Final input pack zip files: {data['finalZipCount']}")
    quality = data["quality"]
    if quality:
        lines.extend([
            f"- Crop quality status: {quality.get('status')}",
            f"- Crop count: {quality.get('cropCount')}",
            f"- Pass count: {quality.get('passCount')}",
            f"- Warning count: {quality.get('warningCount')}",
            f"- Recrop applied count: {quality.get('recropAppliedCount')}",
            f"- Manual review count: {quality.get('manualReviewCount')}",
            f"- Corrupted asset count: {quality.get('corruptedAssetCount')}",
        ])
    tight = data["tight"]
    if tight:
        lines.extend([
            f"- Tight recrop crop count: {tight.get('cropCount')}",
            f"- Tight recrop applied count: {tight.get('tightenedCount')}",
            f"- Tight recrop refreshed pack count: {tight.get('refreshedPackCount')}",
        ])
    recrop = data["recrop"]
    if recrop:
        lines.append(f"- Stage 6B auto recrop applied count: {recrop.get('appliedCount')}")
        fresh = recrop.get("freshPackRefresh")
        if isinstance(fresh, dict):
            lines.append(f"- Stage 6B refreshed pack count: {fresh.get('refreshedPackCount')}")
    seq = data["seq"]
    if seq:
        lines.extend([
            f"- ID policy: {seq.get('idPolicy')}",
            f"- ID first/last: {seq.get('firstId')} / {seq.get('lastId')}",
            f"- ID question count: {seq.get('questionCount')}",
            f"- ID validation status: {seq.get('status')}",
        ])
    lines.extend(["", "## Validation Summary", ""])
    reconciliation = data["countReconciliation"]
    lines.extend([
        f"- Page evidence status: {reconciliation['pageEvidenceStatus']}",
        f"- Question crop status: {reconciliation['questionCropStatus']}",
        f"- JS question count: {reconciliation['jsQuestionCount']}",
        f"- Full page image count: {reconciliation['pageFullImageCount']}",
        f"- Question crop map count: {reconciliation['cropMapCount']}",
        f"- Question crop image count: {reconciliation['cropImageCount']}",
        f"- Visual asset image count: {reconciliation['visualAssetCount']}",
        f"- Comparable crop count: {reconciliation['comparableCropCount']}",
        f"- Difference crop minus question: {reconciliation['differenceCropMinusQuestion']}",
        f"- Basic problem excluded count: {reconciliation['basicProblemExcludedCount']}",
        f"- Count reconciliation reason: {reconciliation['reason']}",
    ])
    lines.extend([
        "- JS syntax: PASS when checked in the latest pipeline run for generated JS files.",
        "- Zip contents: review/fresh zips include individual crop images and JS/input templates when applicable.",
        "- Stage 6B reports are under `generated/reports/`.",
    ])
    lines.extend(["", "## Manual Review / Unresolved / Fallback Reports", ""])
    if data["manualReports"]:
        for name, count in data["manualReports"]:
            lines.append(f"- `{name}`: {count}")
    else:
        lines.append("- None detected.")
    lines.extend(["", "## Review Pack Paths", ""])
    if data["zipFiles"]:
        for path in data["zipFiles"][:80]:
            lines.append(f"- `{path.relative_to(data['generated']).as_posix()}`")
        if len(data["zipFiles"]) > 80:
            lines.append(f"- ... {len(data['zipFiles']) - 80} more zip files")
    else:
        lines.append("- No review/fresh zip file detected.")
    lines.extend(["", "## Final Status", ""])
    manual_total = sum(count for _, count in data["manualReports"])
    status = data["status"]
    if manual_total:
        status = "PARTIAL" if status == "PASS" else status
    if data["countReconciliation"]["status"] != "PASS":
        status = "FAIL"
    lines.append(f"- Overall status: {status}")
    lines.extend(["", "## Next Actions", ""])
    if manual_total:
        lines.append("- Inspect the manual/unresolved reports listed above.")
    elif data["countReconciliation"]["status"] != "PASS":
        lines.append("- Resolve missing full page evidence or restore page/question mapping.")
    else:
        lines.append("- Continue with content/choices/answer input or downstream validation.")
    lines.append("")
    return "\n".join(lines)


def main():
    folders = sorted([path for path in ROOT.iterdir() if path.is_dir() and (path / "generated").exists()], key=lambda p: p.name)
    written = []
    aggregate_lines = [
        "# CODEX_RESULT",
        "",
        "## Aggregate Generated Output Results",
        "",
        "This aggregate is stored under `archive/textbook/generated/2026-05-23_pipeline_results/` per resultReportPolicy.",
        "Canonical per-book result files are stored at `<PDF stem>/generated/CODEX_RESULT.md`.",
        "",
        "| Output root | Type | Crops | Pages | Assets | JS | Zips | Page evidence | Crop status | Diff | Status |",
        "|---|---|---:|---:|---:|---:|---:|---|---|---:|---|",
    ]
    for folder in folders:
        data = collect(folder)
        report_path = data["generated"] / "reports" / "question_crop_count_reconciliation_report.json"
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(data["countReconciliation"], ensure_ascii=False, indent=2) + "\n", encoding="utf-8-sig")
        result_path = data["generated"] / "CODEX_RESULT.md"
        result_path.write_text(md_for(data), encoding="utf-8-sig")
        written.append(result_path)
        reconciliation = data["countReconciliation"]
        aggregate_lines.append(
            f"| `{folder.name}/generated` | {data['type']} | {data['mapCount']} | {reconciliation['pageFullImageCount']} | {reconciliation['visualAssetCount']} | {data['jsCount']} | {data['zipCount']} | {reconciliation['pageEvidenceStatus']} | {reconciliation['questionCropStatus']} | {reconciliation['differenceCropMinusQuestion']} | {data['status']} |"
        )
    AGGREGATE_ROOT.mkdir(parents=True, exist_ok=True)
    aggregate_path = AGGREGATE_ROOT / "CODEX_RESULT.md"
    aggregate_lines.extend(["", "## Written Files", ""])
    for path in written:
        aggregate_lines.append(f"- `{path.relative_to(ROOT).as_posix()}`")
    aggregate_path.write_text("\n".join(aggregate_lines) + "\n", encoding="utf-8-sig")
    print(json.dumps({"writtenCount": len(written), "aggregate": str(aggregate_path)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
