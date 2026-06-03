from __future__ import annotations

import json
from pathlib import Path

ROOT = Path.cwd()
REPORT = ROOT / "archive" / "textbook" / "reports" / "probstat_fullpage_crop_index.json"
QUALITY_REPORTS = sorted((ROOT / "archive" / "textbook" / "reports").glob("archive_asset_image_quality_*.json"))

index = json.loads(REPORT.read_text(encoding="utf-8"))
quality = json.loads(QUALITY_REPORTS[-1].read_text(encoding="utf-8"))

bad_folders = {}
for item in quality["folderSummary"]:
    if item.get("probabilityStatistics") and item.get("badCount", 0) > 0:
        bad_folders[item["folder"]] = item

print("## 확통 불량 후보 폴더 -> 풀페이지 위치")
for item in index["matches"]:
    folder = item["assetFolder"]
    if folder not in bad_folders:
        continue
    bad = bad_folders[folder]
    print(f"\n### {folder}")
    print(f"- bad: {bad['badCount']}/{bad['count']} | worst={bad['worstScore']} | worstAsset={bad['worstPath']}")
    print(f"- fullpages matched: {item['matchedFullpages']}")
    for fp in item["fullpages"][:8]:
        print(f"  - {fp['width']}x{fp['height']} {fp['bytes']} bytes | {fp['path']}")
