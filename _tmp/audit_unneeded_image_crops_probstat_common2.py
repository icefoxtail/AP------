# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path.cwd()
ASSET_ROOT = ROOT / "archive" / "assets" / "images"
REPORT_DIR = ROOT / "archive" / "textbook" / "reports"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def q_no(name: str) -> int | None:
    m = re.search(r"q0*(\d+)", name.lower())
    return int(m.group(1)) if m else None


def has_image_hint(text: str) -> bool:
    return bool(re.search(r"그림|그래프|표|도형|좌표평면|오른쪽|아래|문제\s*이미지|lattice|figure|table", text or "", re.I))


def extract_questions(js: Path) -> list[dict]:
    text = js.read_text(encoding="utf-8", errors="ignore")
    questions = []
    for m in re.finditer(r'"id"\s*:\s*(\d+).*?"content"\s*:\s*("(?:\\.|[^"\\])*").*?"image"\s*:\s*"([^"]*)"', text, re.S):
        try:
            content = json.loads(m.group(2))
        except Exception:
            content = m.group(2)
        questions.append({"id": int(m.group(1)), "content": content, "image": m.group(3), "js": rel(js)})
    if questions:
        return questions
    for m in re.finditer(r"id\s*:\s*(\d+).*?content\s*:\s*('(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\").*?image\s*:\s*['\"]([^'\"]*)", text, re.S):
        content = m.group(2).strip("'\"")
        questions.append({"id": int(m.group(1)), "content": content, "image": m.group(3), "js": rel(js)})
    return questions


def main() -> None:
    js_files = [
        p for p in (ROOT / "archive").rglob("*.js")
        if "확률과통계" in rel(p) or "공통수학2" in rel(p)
    ]
    questions = []
    for js in js_files:
        try:
            questions.extend(extract_questions(js))
        except Exception:
            pass
    by_asset = {}
    for q in questions:
        image = q["image"].replace("\\", "/")
        if image:
            by_asset.setdefault(image, []).append(q)
            by_asset.setdefault(f"archive/{image}", []).append(q)

    items = []
    for folder in ASSET_ROOT.iterdir():
        if not folder.is_dir() or not ("확률과통계" in folder.name or "공통수학2" in folder.name):
            continue
        for asset in folder.glob("q*.png"):
            asset_rel = rel(asset)
            qs = by_asset.get(asset_rel, []) or by_asset.get(asset_rel.removeprefix("archive/"), [])
            if not qs:
                status = "no_matching_js_question"
                q = None
            else:
                q = qs[0]
                status = "js_references_this_asset"
            items.append({
                "scope": "probability_statistics" if "확률과통계" in folder.name else "common_math2",
                "asset": asset_rel,
                "folder": folder.name,
                "q": q_no(asset.name),
                "status": status,
                "questionImage": q["image"] if q else None,
                "questionJs": q["js"] if q else None,
                "contentHasImageHint": has_image_hint(q["content"]) if q else None,
                "contentPreview": (q["content"][:220] if q else ""),
            })

    report = {
        "generatedAt": datetime.now().isoformat(),
        "assetFolders": len({item["folder"] for item in items}),
        "assetItems": len(items),
        "statusCounts": {},
        "scopeCounts": {},
        "items": items,
        "probableUnneeded": [item for item in items if item["status"] != "js_references_this_asset" and item["contentHasImageHint"] is not True],
        "needsFullpageReview": [item for item in items if item["contentHasImageHint"] is True],
    }
    for item in items:
        report["statusCounts"][item["status"]] = report["statusCounts"].get(item["status"], 0) + 1
        report["scopeCounts"].setdefault(item["scope"], {})
        report["scopeCounts"][item["scope"]][item["status"]] = report["scopeCounts"][item["scope"]].get(item["status"], 0) + 1

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    out = REPORT_DIR / f"unneeded_image_crops_probstat_common2_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "out": rel(out),
        "assetFolders": report["assetFolders"],
        "assetItems": report["assetItems"],
        "statusCounts": report["statusCounts"],
        "scopeCounts": report["scopeCounts"],
        "probableUnneeded": len(report["probableUnneeded"]),
        "needsFullpageReview": len(report["needsFullpageReview"]),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
