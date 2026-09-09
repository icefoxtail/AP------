from __future__ import annotations

import hashlib
import json
import tempfile
import zipfile
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None


RUN_ROOT = Path(__file__).resolve().parents[1] / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
PACKAGES = RUN_ROOT / "packages"
ALLOWED_MISSING_IMAGES = {
    "23_여천고_2학기_중간_고1_기출_EXTERNAL_REVIEW": {10, 17},
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def check_package(root: Path) -> dict:
    errors = []
    manifest = root / "reports" / "sha256_manifest.txt"
    if not manifest.exists():
        errors.append("missing reports/sha256_manifest.txt")
    else:
        listed = {}
        for line in manifest.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            digest, rel = line.split("  ", 1)
            listed[rel] = digest
            target = root / rel
            if not target.exists():
                errors.append(f"manifest missing file: {rel}")
            elif sha256(target) != digest:
                errors.append(f"manifest hash mismatch: {rel}")
        actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() and p != manifest}
        if actual != set(listed):
            errors.append(f"manifest file-set mismatch: listed={len(listed)} actual={len(actual)}")
    js_files = list(root.glob("*.js"))
    if len(js_files) != 1:
        errors.append(f"expected one root JS, found {len(js_files)}")
    if Image is not None:
        for image in root.rglob("*.png"):
            try:
                with Image.open(image) as handle:
                    handle.verify()
                with Image.open(image) as handle:
                    if handle.width <= 0 or handle.height <= 0:
                        errors.append(f"invalid PNG dimensions: {image.relative_to(root)}")
            except Exception as exc:
                errors.append(f"PNG decode failed {image.relative_to(root)}: {exc}")
    return {"name": root.name, "files": len([p for p in root.rglob("*") if p.is_file()]), "errors": errors}


def check_zip(root: Path, archive_path: Path) -> dict:
    errors = []
    with zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        prefix = root.name + "/"
        if any(not name.startswith(prefix) for name in names):
            errors.append("entry outside package root")
        if any(any(token in name for token in ("�", "║", "╬", "▒", "┐", "┴")) for name in names):
            errors.append("mojibake entry name")
        package_files = {p.relative_to(root.parent).as_posix() for p in root.rglob("*") if p.is_file()}
        zip_files = {name for name in names if not name.endswith("/")}
        if package_files != zip_files:
            errors.append(f"zip/package file-set mismatch: zip={len(zip_files)} package={len(package_files)}")
        for rel in sorted(package_files):
            target = root.parent / rel
            if archive.read(rel) != target.read_bytes():
                errors.append(f"zip content mismatch: {rel}")
        with tempfile.TemporaryDirectory(prefix="fresh-zip-") as tmp:
            archive.extractall(tmp)
            extracted_root = Path(tmp) / root.name
            extracted_js = list(extracted_root.glob("*.js"))
            if len(extracted_js) != 1 or extracted_js[0].read_bytes() != list(root.glob("*.js"))[0].read_bytes():
                errors.append("fresh-extract JS mismatch")
    return {"name": archive_path.name, "entries": len(names), "errors": errors}


def main() -> None:
    dirs = sorted(p for p in PACKAGES.iterdir() if p.is_dir() and p.name.endswith(("_EXTERNAL_REVIEW", "_EXTERNAL_REVIEW_v2")))
    zips = sorted(PACKAGES.glob("*_EXTERNAL_REVIEW*.zip"))
    package_results = [check_package(root) for root in dirs]
    zip_results = [check_zip(root, PACKAGES / (root.name + ".zip")) for root in dirs]
    result = {
        "packageCount": len(package_results),
        "zipCount": len(zip_results),
        "packageErrors": [item for item in package_results if item["errors"]],
        "zipErrors": [item for item in zip_results if item["errors"]],
        "pngVerifier": "Pillow" if Image is not None else "unavailable",
    }
    out = RUN_ROOT / "audits" / "external-review-rebuild-validation-20260909.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if result["packageErrors"] or result["zipErrors"] or len(dirs) != 31 or len(zips) != 31:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
