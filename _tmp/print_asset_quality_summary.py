from __future__ import annotations

import json
from pathlib import Path

root = Path.cwd()
reports = sorted((root / "archive" / "textbook" / "reports").glob("archive_asset_image_quality_*.json"))
report = json.loads(reports[-1].read_text(encoding="utf-8"))

print("REPORT", reports[-1].relative_to(root).as_posix())
print("TOTAL", report["totalImages"])
print("확통", report["probabilityStatisticsImages"])
print("BAD", report["badImagesScoreGte40"])
print("BAD_확통", report["badProbabilityStatisticsImagesScoreGte40"])

print("\n## Worst 확통 images")
for row in report["worstProbabilityStatisticsImages"][:60]:
    print(
        f'{row["score"]:3} | {row["width"]}x{row["height"]} | {row["bytes"]:7} | '
        f'blur={row["blur"]} contrast={row["contrast"]} | {",".join(row["flags"])} | {row["path"]}'
    )

print("\n## 확통 folders with badCount")
for item in report["folderSummary"]:
    if item["probabilityStatistics"] and (item["badCount"] or item["worstScore"] >= 35):
        print(
            f'{item["badCount"]:2}/{item["count"]:2} bad | worst={item["worstScore"]:3} | '
            f'{item["folder"]} | {item["worstPath"]}'
        )

print("\n## Full page like / page name")
for row in report["worstImages"]:
    if "full_page_like" in row["flags"] or "page_like_name" in row["flags"]:
        print(
            f'{row["score"]:3} | {row["width"]}x{row["height"]} | {row["bytes"]:7} | '
            f'{",".join(row["flags"])} | {row["path"]}'
        )
