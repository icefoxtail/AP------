from __future__ import annotations

import hashlib
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUN = ROOT / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
TARGETS = ["23_한영고_2학기_중간_고1_기출_EXTERNAL_REVIEW"]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


for name in TARGETS:
    root = RUN / "packages" / name
    manifest = root / "reports" / "sha256_manifest.txt"
    rows = [f"{sha256(p)}  {p.relative_to(root).as_posix()}" for p in sorted(root.rglob("*")) if p.is_file() and p != manifest]
    manifest.write_text("\n".join(rows) + "\n", encoding="utf-8")
    with zipfile.ZipFile(RUN / "packages" / f"{name}.zip", "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(root.rglob("*")):
            if p.is_file():
                zf.write(p, p.relative_to(root.parent).as_posix())
    print(f"REFRESHED {name}")
