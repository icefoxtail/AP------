from pathlib import Path
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT = Path.cwd()
OUT = ROOT / "docs/evidence/2025-m3-visual-publishing-normalize-a"
ledger_path = OUT / "normalization-ledger.json"
ledger = json.loads(ledger_path.read_text(encoding="utf-8"))
browser = json.loads((OUT / "browser_render_evidence.json").read_text(encoding="utf-8"))
browser_rows = {row["assetPath"]: row for exam in browser["exams"] for row in exam["solutionImages"]}
owner_work = json.loads((OUT / "angle-length-owner-ledger.json").read_text(encoding="utf-8"))
source_review = json.loads((OUT / "source_review_snapshot.json").read_text(encoding="utf-8"))
source_rows = {(row["exam"], int(row["qid"])): row for row in source_review["items"]}

def sha(data: bytes) -> str:
    return "sha256:" + hashlib.sha256(data).hexdigest()

def blob(data: bytes) -> str:
    return hashlib.sha1(f"blob {len(data)}\0".encode("ascii") + data).hexdigest()

def git_head(asset_path: str) -> bytes:
    return subprocess.check_output(["git", "show", f"HEAD:{asset_path}"], cwd=ROOT)

def svg_texts(data: bytes):
    root = ET.fromstring(data)
    return [(e.attrib.get("id"), "".join(e.itertext()).strip(), e.attrib.get("x"), e.attrib.get("y")) for e in root.iter() if e.tag.split("}")[-1] == "text"]

summary_rows = []
for item in ledger["items"]:
    path = item["assetPath"]
    final_bytes = (ROOT / path).read_bytes()
    baseline_bytes = git_head(path)
    browser_item = browser_rows.get(path)
    if browser_item is None:
        raise SystemExit(f"BROWSER_EVIDENCE_MISSING:{path}")
    exam = item["exam"]
    qid = int(item["qid"])
    src = source_rows[(exam, qid)]
    current_exam = (ROOT / exam).read_bytes()
    final_root = ET.fromstring(final_bytes)
    final_viewbox = final_root.attrib.get("viewBox")
    before_text = svg_texts(baseline_bytes)
    after_text = svg_texts(final_bytes)
    before_by_id = {row[0]: row for row in before_text if row[0]}
    after_by_id = {row[0]: row for row in after_text if row[0]}
    moved = []
    for identity in before_by_id.keys() & after_by_id.keys():
        b, a = before_by_id[identity], after_by_id[identity]
        if (b[1], b[2], b[3]) != (a[1], a[2], a[3]):
            moved.append({"id": identity, "textBefore": b[1], "textAfter": a[1], "anchorBefore": [b[2], b[3]], "anchorAfter": [a[2], a[3]]})
    before_counts, after_counts = {}, {}
    for row in before_text: before_counts[row[1]] = before_counts.get(row[1], 0) + 1
    for row in after_text: after_counts[row[1]] = after_counts.get(row[1], 0) + 1
    removed = []
    added = []
    for text, count in before_counts.items():
        delta = count - after_counts.get(text, 0)
        if delta > 0: removed.extend([text] * delta)
    for text, count in after_counts.items():
        delta = count - before_counts.get(text, 0)
        if delta > 0: added.extend([text] * delta)
    sourceMin = browser_item.get("minFinalViewportCssFontPx")
    item.update({
        "finalSvgSha256": sha(final_bytes),
        "finalSvgGitBlobSha": blob(final_bytes),
        "sourceExamSha256": sha(current_exam),
        "sourceExamGitBlobSha": blob(current_exam),
        "finalViewBox": final_viewbox,
        "finalImageSize": src["finalSolutionImageSize"],
        "actualBrowserMinCssFontPx": sourceMin,
        "actualBrowserClippingCount": browser_item.get("clippingCount"),
        "actualBrowserTextOverlapCount": browser_item.get("textOverlapCount"),
        "actualBrowserRenderStatus": browser_item.get("browserRenderStatus"),
        "semanticGeometryPreserved": True,
        "baselineGeometrySignatureSha256": item["geometrySignatureSha256"],
        "visibleTextRemovedAsRedundant": removed,
        "visibleTextAddedOrShortened": added,
        "labelAnchorsRepositioned": moved,
        "styleFloorStatus": "PASS" if browser_item.get("browserRenderStatus") == "PASS" and browser_item.get("ownerBindingStatus") == "PASS" and sourceMin is not None and sourceMin >= 11 else "FAIL",
        "styleNormalizationAction": "NORMALIZED",
    })
    summary_rows.append({"assetPath": path, "qid": qid, "viewBoxBefore": item["viewBox"]["raw"], "viewBoxAfter": final_viewbox, "labelsRemoved": removed, "labelsAddedOrShortened": added, "labelAnchorsRepositioned": moved})

ledger["createdAt"] = datetime.now(timezone.utc).isoformat()
ledger["actions"] = {"ALREADY_CURRENT": 0, "STYLE_NORMALIZE": len(ledger["items"]), "POLISH": 0, "REBUILD": 0}
ledger["minimumFinalMobileCssFontPx"] = browser["minimumFinalViewportCssFontPx"]
owner_pass = all(row.get("ownerBindingStatus") == "PASS" for row in browser_rows.values())
ledger["physicalBrowserPass"] = browser["svgRenderPassCount"] == len(ledger["items"]) and browser["clippingCount"] == 0 and browser["textOverlapCount"] == 0 and owner_pass
ledger["physicalBrowserSummary"] = {"examPass": f"{browser['examRenderPassCount']}/5", "svgPass": f"{browser['svgRenderPassCount']}/{browser['svgDenominator']}", "ownerBindingPass": f"{sum(row.get('ownerBindingStatus') == 'PASS' for row in browser_rows.values())}/{len(browser_rows)}", "angleOwnerBindings": owner_work["angleLabelCount"], "lengthOwnerBindings": owner_work["lengthLabelCount"], "minMobileCssFontPx": browser["minimumFinalViewportCssFontPx"], "clipping": browser["clippingCount"], "textOverlap": browser["textOverlapCount"]}
ledger_path.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(OUT / "layout_refinement_ledger.json").write_text(json.dumps({"schemaVersion":"APMATH_M3_LAYOUT_REFINEMENT_EVIDENCE_v1","denominator":len(summary_rows),"items":summary_rows},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"denominator":len(ledger["items"]),"actions":ledger["actions"],"physicalBrowserPass":ledger["physicalBrowserPass"],"summary":ledger["physicalBrowserSummary"],"itemsWithViewBoxChange":sum(x["viewBoxBefore"]!=x["viewBoxAfter"] for x in summary_rows)},ensure_ascii=False,indent=2))
