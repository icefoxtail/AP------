from __future__ import annotations

import json
from pathlib import Path

ROOT = Path.cwd()
REPORT = ROOT / "archive" / "textbook" / "reports" / "probstat_referenced_suspicious_crop_classification.json"
data = json.loads(REPORT.read_text(encoding="utf-8"))

print("REPORT", REPORT.relative_to(ROOT).as_posix())
print("BUCKETS", data["bucketCounts"])

print("\n## Folder summary")
for f in data["folders"][:50]:
    print(f"- {f['folder']} | total={f['total']} worst={f['worstScore']} buckets={f['buckets']}")
    for ex in f["examples"][:3]:
        print(f"  - {ex}")

print("\n## Probable unnecessary text/noise crops")
for item in [x for x in data["items"] if x["bucket"] == "probable_unnecessary_text_or_noise_crop"][:80]:
    fp = item["fullpageCandidates"][0]["path"] if item["fullpageCandidates"] else ""
    print(
        f"- score={item['qualityScore']} {item['width']}x{item['height']} "
        f"q{item['q']} | {item['asset']} | js={item['questionJs']} | fullpage={fp}"
    )
    print(f"  content: {item['contentPreview'][:140]}")

print("\n## Bad crop but question may need image")
for item in [x for x in data["items"] if x["bucket"] == "bad_crop_but_question_may_need_image"][:50]:
    fp = item["fullpageCandidates"][0]["path"] if item["fullpageCandidates"] else ""
    print(
        f"- score={item['qualityScore']} {item['width']}x{item['height']} "
        f"q{item['q']} | {item['asset']} | fullpage={fp}"
    )
    print(f"  content: {item['contentPreview'][:140]}")
