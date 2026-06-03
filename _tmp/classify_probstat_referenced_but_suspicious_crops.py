from __future__ import annotations

import json
from pathlib import Path

ROOT = Path.cwd()
REPORT_DIR = ROOT / "archive" / "textbook" / "reports"

quality_path = sorted(REPORT_DIR.glob("archive_asset_image_quality_*.json"))[-1]
link_path = sorted(REPORT_DIR.glob("unneeded_image_crops_probstat_common2_*.json"))[-1]
fullpage_path = REPORT_DIR / "probstat_fullpage_crop_index.json"

quality = json.loads(quality_path.read_text(encoding="utf-8"))
links = json.loads(link_path.read_text(encoding="utf-8"))
fullpages = json.loads(fullpage_path.read_text(encoding="utf-8")) if fullpage_path.exists() else {"matches": []}

quality_by_path = {}
for row in quality.get("worstProbabilityStatisticsImages", []):
    quality_by_path[row["path"]] = row
# Worst list may be capped. Reconstruct from CSV-like bad list is not available in JSON,
# so use worst list plus baseline defaults for non-worst.

fp_by_folder = {item["assetFolder"]: item.get("fullpages", []) for item in fullpages.get("matches", [])}

items = []
for item in links["items"]:
    if item["scope"] != "probability_statistics":
        continue
    qrow = quality_by_path.get(item["asset"], {})
    score = qrow.get("score", 0)
    width = qrow.get("width")
    height = qrow.get("height")
    flags = qrow.get("flags", [])
    tiny_or_bad = score >= 40 or "tiny_resolution" in flags or "small_area" in flags or "small_file" in flags
    no_hint = item.get("contentHasImageHint") is False
    has_hint = item.get("contentHasImageHint") is True
    if not tiny_or_bad and not no_hint:
        continue
    if no_hint and tiny_or_bad:
        bucket = "probable_unnecessary_text_or_noise_crop"
    elif no_hint:
        bucket = "referenced_but_content_has_no_image_hint"
    elif has_hint and tiny_or_bad:
        bucket = "bad_crop_but_question_may_need_image"
    else:
        bucket = "review"
    items.append({
        **item,
        "bucket": bucket,
        "qualityScore": score,
        "width": width,
        "height": height,
        "bytes": qrow.get("bytes"),
        "qualityFlags": flags,
        "fullpageCandidates": fp_by_folder.get(item["folder"], [])[:6],
    })

bucket_counts = {}
folder_counts = {}
for item in items:
    bucket_counts[item["bucket"]] = bucket_counts.get(item["bucket"], 0) + 1
    folder_counts.setdefault(item["folder"], {"folder": item["folder"], "total": 0, "buckets": {}, "worstScore": 0, "examples": []})
    f = folder_counts[item["folder"]]
    f["total"] += 1
    f["buckets"][item["bucket"]] = f["buckets"].get(item["bucket"], 0) + 1
    f["worstScore"] = max(f["worstScore"], item["qualityScore"])
    if len(f["examples"]) < 5:
        f["examples"].append(item["asset"])

out = REPORT_DIR / "probstat_referenced_suspicious_crop_classification.json"
out.write_text(json.dumps({
    "qualityReport": quality_path.relative_to(ROOT).as_posix(),
    "linkReport": link_path.relative_to(ROOT).as_posix(),
    "bucketCounts": bucket_counts,
    "folders": sorted(folder_counts.values(), key=lambda x: (x["total"], x["worstScore"]), reverse=True),
    "items": sorted(items, key=lambda x: (x["bucket"], x["qualityScore"]), reverse=True),
}, ensure_ascii=False, indent=2), encoding="utf-8")

print(json.dumps({
    "out": out.relative_to(ROOT).as_posix(),
    "bucketCounts": bucket_counts,
    "folders": len(folder_counts),
    "items": len(items),
}, ensure_ascii=False, indent=2))
