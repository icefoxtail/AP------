from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

from PIL import Image

ROOT = Path.cwd()
ASSET_ROOT = ROOT / "archive" / "assets" / "images"
GENERATED_ROOT = ROOT / "archive" / "_generated" / "past-exams" / "high_h2_probability_statistics_all_terms"
REPORT_DIR = ROOT / "archive" / "textbook" / "reports"


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def norm(s: str) -> str:
    # Normalize enough to bridge folders with mojibake/candidate suffixes.
    return re.sub(r"[^0-9A-Za-z가-힣]+", "", s).lower()


def image_info(path: Path) -> dict:
    try:
        with Image.open(path) as im:
            im.load()
            return {"width": im.width, "height": im.height, "bytes": path.stat().st_size}
    except Exception as exc:
        return {"error": str(exc), "bytes": path.stat().st_size if path.exists() else None}


def build_generated_index() -> dict[str, list[Path]]:
    files = []
    if GENERATED_ROOT.exists():
        files = [
            p
            for p in GENERATED_ROOT.rglob("*")
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg"}
        ]
    index: dict[str, list[Path]] = {}
    for p in files:
        parts = p.parts
        try:
            root_idx = parts.index("high_h2_probability_statistics_all_terms")
        except ValueError:
            continue
        exam_folder = None
        # Expected: high_h2_probability_statistics_all_terms/{term}/{exam}/...
        if len(parts) > root_idx + 2:
            exam_folder = parts[root_idx + 2]
        if not exam_folder:
            continue
        key = norm(exam_folder)
        index.setdefault(key, []).append(p)
    return index


def q_no(name: str) -> int | None:
    m = re.search(r"q0*(\d+)", name.lower())
    return int(m.group(1)) if m else None


def find_sources(asset: Path, index: dict[str, list[Path]]) -> list[Path]:
    folder = asset.parent.name
    folder_key = norm(folder)
    candidates: list[Path] = []
    for key, paths in index.items():
        # Exact readable folders are best; mojibake folders still usually keep year/term fragments.
        if folder_key and (folder_key in key or key in folder_key):
            candidates.extend(paths)
    if not candidates:
        # Fall back to year + school-ish fragments.
        chunks = [c for c in re.split(r"[_\s]+", folder) if c]
        for key, paths in index.items():
            hit = sum(1 for c in chunks if norm(c) and norm(c) in key)
            if hit >= 3:
                candidates.extend(paths)
    q = q_no(asset.name)
    if q is None:
        return sorted(set(candidates), key=lambda p: rel(p))[:20]
    q_patterns = [f"q{q:02d}", f"q{q}", f"q0{q}"]
    direct = [
        p
        for p in candidates
        if any(pattern in p.name.lower() for pattern in q_patterns)
        and ("crop" in rel(p).lower() or "question" in rel(p).lower())
    ]
    if direct:
        return sorted(set(direct), key=lambda p: rel(p))[:10]
    page_or_any = [
        p
        for p in candidates
        if ("page" in p.name.lower() or "pages" in rel(p).lower())
    ]
    return sorted(set(page_or_any or candidates), key=lambda p: rel(p))[:10]


def main() -> None:
    quality_reports = sorted(REPORT_DIR.glob("archive_asset_image_quality_*.json"))
    if not quality_reports:
        raise SystemExit("quality report missing")
    quality = json.loads(quality_reports[-1].read_text(encoding="utf-8"))
    rows = [
        row
        for row in quality["worstProbabilityStatisticsImages"]
        if row["score"] >= 40
    ]
    index = build_generated_index()
    compared = []
    for row in rows:
        asset = ROOT / row["path"]
        sources = find_sources(asset, index)
        source_rows = [{"path": rel(src), **image_info(src)} for src in sources]
        best = source_rows[0] if source_rows else None
        verdict = "source_not_found"
        if best:
            aw = row.get("width") or 0
            ah = row.get("height") or 0
            sw = best.get("width") or 0
            sh = best.get("height") or 0
            if sw and sh and (aw < sw * 0.45 or ah < sh * 0.45):
                verdict = "asset_smaller_than_generated_source"
            elif sw and sh and aw == sw and ah == sh:
                verdict = "same_dimensions_as_generated_source"
            else:
                verdict = "source_found_check_visual"
        compared.append(
            {
                **row,
                "assetInfo": image_info(asset),
                "sourceCount": len(source_rows),
                "sources": source_rows,
                "verdict": verdict,
            }
        )

    by_verdict = {}
    for row in compared:
        by_verdict[row["verdict"]] = by_verdict.get(row["verdict"], 0) + 1

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = REPORT_DIR / f"probstat_asset_vs_generated_source_{stamp}.json"
    out.write_text(
        json.dumps(
            {
                "generatedAt": datetime.now().isoformat(),
                "qualityReport": rel(quality_reports[-1]),
                "generatedRoot": rel(GENERATED_ROOT),
                "checked": len(compared),
                "verdictCounts": by_verdict,
                "items": compared,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "out": rel(out),
                "checked": len(compared),
                "verdictCounts": by_verdict,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
