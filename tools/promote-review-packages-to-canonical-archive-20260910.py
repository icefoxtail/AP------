from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUN = ROOT / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
PACKAGES = RUN / "packages"
ARCHIVE = ROOT / "archive"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def promote_dir(package_name: str) -> dict:
    base = package_name.removesuffix("_EXTERNAL_REVIEW")
    package = PACKAGES / package_name
    year = base[:2]
    period = "2mid" if "2학기_중간" in base else "2final"
    js_source = package / f"{base}.js"
    if not js_source.exists():
        raise FileNotFoundError(js_source)
    destination = ARCHIVE / "exams" / "original" / "high" / "h1" / period / js_source.name
    if destination.exists():
        backup = RUN / "promotion-backup-20260910" / destination.relative_to(ROOT)
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(destination, backup)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(js_source, destination)
    asset_source = package / "assets" / "images" / base
    asset_destination = ARCHIVE / "assets" / "images" / base
    if asset_source.is_dir():
        asset_destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(asset_source, asset_destination, dirs_exist_ok=True)
    text = js_source.read_text(encoding="utf-8")
    b_count = text.count('"variantClass":"B"') + text.count('"variantClass": "B"')
    return {
        "examTitle": base,
        "package": package_name,
        "canonicalRelativePath": destination.relative_to(ROOT).as_posix(),
        "canonicalSha256": sha256(destination),
        "sourcePackageSha256": sha256(js_source),
        "assetDirectory": asset_destination.relative_to(ROOT).as_posix() if asset_destination.is_dir() else None,
        "bQuestionCount": b_count,
        "sourceOriginalPreserved": True,
        "promotionStatus": "CANONICAL_ARCHIVE_REVIEW_PROMOTED",
        "previousCanonicalBackup": str((RUN / "promotion-backup-20260910" / destination.relative_to(ROOT)).relative_to(RUN)).replace("\\", "/") if (RUN / "promotion-backup-20260910" / destination.relative_to(ROOT)).exists() else None,
    }


def main() -> None:
    package_names = sorted(p.name for p in PACKAGES.iterdir() if p.is_dir() and p.name.endswith("_EXTERNAL_REVIEW") and not p.name.endswith("_EXTERNAL_REVIEW_v2"))
    rows = [promote_dir(name) for name in package_names]
    out = RUN / "audits" / "canonical-archive-promotion-20260910.json"
    out.write_text(json.dumps({"schemaVersion": "CANONICAL_ARCHIVE_PROMOTION_v1", "status": "PROMOTED_CANDIDATE_PENDING_DB_INDEX_REBUILD", "count": len(rows), "rows": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PROMOTED_CANDIDATE_PENDING_DB_INDEX_REBUILD", "count": len(rows), "bQuestions": sum(r["bQuestionCount"] for r in rows)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
