from __future__ import annotations

import json
import re
from pathlib import Path

root = Path.cwd()
reports = sorted((root / "archive" / "textbook" / "reports").glob("archive_asset_image_quality_*.json"))
report_path = reports[-1]
report = json.loads(report_path.read_text(encoding="utf-8"))

js_roots = [root / "archive" / "exams", root / "archive" / "textbook"]
ref_re = re.compile(r"""image\s*:\s*["']([^"']+)["']|["']image["']\s*:\s*["']([^"']+)["']""")

refs: dict[str, list[str]] = {}
for js_root in js_roots:
    if not js_root.exists():
        continue
    for js in js_root.rglob("*.js"):
        try:
            text = js.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for match in ref_re.finditer(text):
            value = match.group(1) or match.group(2)
            if not value:
                continue
            candidates = [
                value.replace("\\", "/"),
                f"archive/{value}".replace("\\", "/"),
            ]
            for candidate in candidates:
                refs.setdefault(candidate, []).append(js.relative_to(root).as_posix())

rows = []
for row in report["worstProbabilityStatisticsImages"]:
    path = row["path"]
    ref_files = refs.get(path, [])
    if not ref_files and path.startswith("archive/"):
        ref_files = refs.get(path[len("archive/") :], [])
    rows.append(
        {
            **row,
            "referencedByCount": len(set(ref_files)),
            "referencedBy": sorted(set(ref_files))[:20],
        }
    )

확통_bad_all = []
for folder in report["folderSummary"]:
    pass

out = report_path.with_name(report_path.stem + "_with_refs.json")
out.write_text(
    json.dumps(
        {
            "sourceReport": report_path.relative_to(root).as_posix(),
            "worstProbabilityStatisticsImagesWithRefs": rows,
            "unreferencedWorstProbabilityStatisticsImages": [row for row in rows if row["referencedByCount"] == 0],
            "referencedWorstProbabilityStatisticsImages": [row for row in rows if row["referencedByCount"] > 0],
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding="utf-8",
)
print(
    json.dumps(
        {
            "out": out.relative_to(root).as_posix(),
            "worstProbStatRows": len(rows),
            "referenced": sum(1 for row in rows if row["referencedByCount"] > 0),
            "unreferenced": sum(1 for row in rows if row["referencedByCount"] == 0),
        },
        ensure_ascii=False,
        indent=2,
    )
)
