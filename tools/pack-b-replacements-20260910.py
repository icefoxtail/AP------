from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUN = ROOT / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
TARGETS = [
    "20_매산고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "20_매산여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_여천고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_여천고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "23_중앙여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "23_한영고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_부영여고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "24_여양고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_여천고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_여천고_2학기_중간_고1_기출_EXTERNAL_REVIEW",
    "24_중앙여고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
    "24_한영고_2학기_기말_고1_기출_EXTERNAL_REVIEW",
]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def manifest(root: Path) -> None:
    out = root / "reports" / "sha256_manifest.txt"
    rows = []
    for p in sorted(x for x in root.rglob("*") if x.is_file() and x != out):
        rows.append(f"{sha256(p)}  {p.relative_to(root).as_posix()}")
    out.write_text("\n".join(rows) + "\n", encoding="utf-8")


def pack(root: Path) -> None:
    zip_path = RUN / "packages" / f"{root.name}.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(x for x in root.rglob("*") if x.is_file()):
            zf.write(p, p.relative_to(root.parent).as_posix())


def verify(root: Path) -> dict:
    zip_path = RUN / "packages" / f"{root.name}.zip"
    with zipfile.ZipFile(zip_path) as zf:
        names = {n for n in zf.namelist() if not n.endswith("/")}
        expected = {p.relative_to(root.parent).as_posix() for p in root.rglob("*") if p.is_file()}
        return {"package": root.name, "zipEntries": len(names), "fileCount": len(expected), "fileSetMatch": names == expected, "mojibakeNames": any("�" in n for n in names)}


def main() -> None:
    results = []
    for name in TARGETS:
        root = RUN / "packages" / name
        if not root.is_dir():
            raise SystemExit(f"missing package: {name}")
        manifest(root)
        pack(root)
        results.append(verify(root))
        (root / "reports" / "B_REPLACEMENT_PACKAGE_CLOSURE.md").write_text(
            "# B replacement package closure\n\n"
            "- root JS and B lineage sidecars are packed from the exact review-package directory.\n"
            "- original source bytes remain under source/ and original-preserved.json.\n"
            "- production adoption remains unauthorized.\n"
            f"- zip file-set check: {results[-1]['fileSetMatch']}\n",
            encoding="utf-8",
        )
        manifest(root)
        pack(root)
    out = RUN / "audits" / "b-replacement-package-pack-20260910.json"
    out.write_text(json.dumps({"packageCount": len(results), "results": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"packageCount": len(results), "results": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
