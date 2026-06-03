from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path.cwd()
ASSET_ROOT = ROOT / "archive" / "assets" / "images"
GEN_ROOTS = [
    ROOT / "archive" / "_generated" / "past-exams" / "high_h2_probability_statistics_all_terms",
    ROOT / "archive" / "_generated" / "past-exams",
]
REPORT_DIR = ROOT / "archive" / "textbook" / "reports"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def norm(s: str) -> str:
    return re.sub(r"[^0-9A-Za-z가-힣]+", "", s).lower()


def info(path: Path) -> dict:
    try:
        with Image.open(path) as im:
            im.load()
            return {"width": im.width, "height": im.height, "bytes": path.stat().st_size}
    except Exception as exc:
        return {"error": str(exc), "bytes": path.stat().st_size if path.exists() else None}


def is_fullpage(path: Path) -> bool:
    rp = rel(path).lower()
    name = path.name.lower()
    if not path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
        return False
    if "/pages/" in rp or "\\pages\\" in rp:
        return True
    if "page_full" in rp or "full_page" in rp or "page_render" in rp:
        return True
    if re.search(r"page[_-]?p?\d+\.png$", name) or re.search(r"p\d+\.png$", name):
        return True
    return False


def generated_exam_folder(path: Path) -> str | None:
    parts = path.parts
    for marker in ["high_h2_probability_statistics_all_terms", "past-exams"]:
        if marker in parts:
            idx = parts.index(marker)
            # high_h2.../{term}/{exam}/..., or past-exams/{collection}/{term}/{exam}/...
            for offset in [2, 3]:
                if len(parts) > idx + offset:
                    candidate = parts[idx + offset]
                    if "확률" in candidate or "candidate" in candidate or "怨" in candidate or re.match(r"\d{2}_", candidate):
                        return candidate
    return None


def main() -> None:
    asset_folders = sorted(
        [p for p in ASSET_ROOT.iterdir() if p.is_dir() and ("확률과통계" in p.name or "확통" in p.name)],
        key=lambda p: p.name,
    )
    fullpages = []
    seen = set()
    for root in GEN_ROOTS:
        if not root.exists():
            continue
        for p in root.rglob("*"):
            if not p.is_file() or not is_fullpage(p):
                continue
            key = p.resolve()
            if key in seen:
                continue
            seen.add(key)
            exam = generated_exam_folder(p) or ""
            fullpages.append({"path": rel(p), "examFolder": exam, "examKey": norm(exam), **info(p)})

    by_asset = []
    for folder in asset_folders:
        fkey = norm(folder.name)
        matches = []
        for fp in fullpages:
            ekey = fp["examKey"]
            if fkey and ekey and (fkey in ekey or ekey in fkey):
                matches.append(fp)
        if not matches:
            chunks = [norm(c) for c in folder.name.split("_") if norm(c)]
            for fp in fullpages:
                hit = sum(1 for c in chunks if c in fp["examKey"])
                if hit >= 3:
                    matches.append(fp)
        by_asset.append(
            {
                "assetFolder": folder.name,
                "assetImages": len(list(folder.glob("*"))),
                "matchedFullpages": len(matches),
                "fullpages": sorted(matches, key=lambda x: x["path"])[:20],
            }
        )

    report = {
        "scope": "확통 asset folders -> generated full-page crops/pages",
        "assetFolders": len(asset_folders),
        "fullpageCandidates": len(fullpages),
        "matchedAssetFolders": sum(1 for item in by_asset if item["matchedFullpages"]),
        "unmatchedAssetFolders": [item for item in by_asset if not item["matchedFullpages"]],
        "matches": by_asset,
    }
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    out = REPORT_DIR / "probstat_fullpage_crop_index.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "out": rel(out),
        "assetFolders": report["assetFolders"],
        "fullpageCandidates": report["fullpageCandidates"],
        "matchedAssetFolders": report["matchedAssetFolders"],
        "unmatchedAssetFolders": len(report["unmatchedAssetFolders"]),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
