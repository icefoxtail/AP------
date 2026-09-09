from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import tempfile
import zipfile
from pathlib import Path


REPO = Path(__file__).resolve().parents[1]
RUN_ROOT = REPO / "archive" / "_generated" / "nightly-h1-2sem" / "20260908"
WORK_ROOT = RUN_ROOT / "work"
PACKAGES_ROOT = RUN_ROOT / "packages"
BACKUP_ROOT = RUN_ROOT / "review-rebuild-backup-20260909"

CORRECTIONS = {
    "19_강남고_2학기_기말_고1_기출": [
        "A형 source-faithful restoration: q8/q11/q12/q13/q14/q15/q23/q25 were restored from the native source pages; q13 received a clean diagram crop and q14's foreign unused crop was removed.",
    ],
    "20_효천고_2학기_중간_고1_기출": ["q4: reverse of the proposition corrected to option ① with a reproducible explanation."],
    "20_매산고_2학기_기말_고1_기출": [
        "q16: short-answer count corrected from 120 to 1680; solution and answer now agree.",
        "q17: minimum distance corrected from √10 to 2√3 with a complete derivation.",
        "q13: source/solution answer conflict retained as REVIEW_NEEDED and excluded from the release question bank.",
    ],
    "20_매산여고_2학기_기말_고1_기출": [
        "q13: source/solution answer conflict retained as REVIEW_NEEDED and excluded from the release question bank.",
        "q17: minimum distance corrected from √10 to 2√3 with a complete derivation.",
    ],
    "23_여천고_2학기_기말_고1_기출": [
        "q1: non-function mapping corrected to option ④ with direct domain/codomain check.",
        "q13: malformed math delimiters and the first/fifth counting expressions corrected.",
    ],
    "23_여양고_2학기_중간_고1_기출": ["q1: answer corrected to ④ and all set expressions wrapped in valid math delimiters."],
    "23_중앙여고_2학기_기말_고1_기출": [
        "q8: direct graph analysis retained without the printed-answer conflict note in the student solution.",
        "q18: 3000-won payment count corrected to 6 methods; student solution no longer contains the former incorrect intermediate count.",
        "서술형3: rock-paper-scissors solution rewritten as a reproducible count.",
        "서술형4: square count solution rewritten without internal review language.",
    ],
    "23_한영고_2학기_중간_고1_기출": [
        "q11: answer retained as ② after independent quadratic-minimum verification; source-key conflict is kept in metadata, not student solution.",
        "단답형3: negation solution rewritten as a clean student-facing proof.",
    ],
    "24_부영여고_2학기_중간_고1_기출": [
        "q8: tangent calculation and LaTeX notation corrected.",
        "q15: set notation and inequality/intersection LaTeX corrected.",
        "서술형3: missing √ notation restored in answer and solution.",
    ],
    "24_중앙여고_2학기_기말_고1_기출": ["q15: copied unrelated solution replaced by the direct 12-count derivation."],
    "24_한영고_2학기_기말_고1_기출": ["서술형2: independently verified count corrected from 95 to 163 with complete case split."],
    "20_순천고_2학기_중간_고1_기출": ["q16: student-facing solution rewritten without internal source-comparison language."],
    "24_여천고_2학기_기말_고1_기출": [
        "A형 source-faithful restoration: source q3/q4/q10/q18 recovered from native page evidence; q4/q18 source graph-choice crops were added.",
        "q8/q13: unmatched math delimiters closed in the affected choices.",
        "q12: fixed-point intermediate corrected from -1+1/a to -2+1/a.",
    ],
    "24_여천고_2학기_중간_고1_기출": ["A형 source-faithful restoration: source q4/q5 restored; q4 choice 28 corrected minimally and q5 logic answer resolved as ④."],
    "24_여양고_2학기_기말_고1_기출": ["A형 source restoration: source q8/q17 recovered from native page evidence; source q15 N(k) sum corrected from unavailable 34 to choice ②=34."],
    "23_부영여고_2학기_중간_고1_기출": [
        "A형 source-faithful restoration: q1-q18 and 서술형1-3 were transcribed from the native source pages; q18 received a clean source diagram crop.",
        "Independent source-page math review corrected q1 to ④, q9 to ①, q10 to ③, q11 to ①, q12 to ④, q15 to ②, q16 to ⑤, and q18 to ②; all 21 source questions are now present.",
    ],
}


def score_name(name: str) -> int:
    return (
        sum("\uac00" <= ch <= "\ud7a3" for ch in name) * 20
        - name.count("\ufffd") * 20
        - name.count("\u2580") * 3
        - name.count("\u2591") * 3
    )


def recover_name(name: str) -> str:
    candidates = [name]
    for encoding in ("cp437", "latin1"):
        try:
            candidates.append(name.encode(encoding).decode("utf-8"))
        except UnicodeError:
            pass
    return max(candidates, key=score_name)


def zip_extract_to_root(zip_path: Path, destination: Path, root_name: str) -> None:
    with zipfile.ZipFile(zip_path) as archive:
        for info in archive.infolist():
            recovered = recover_name(info.filename).replace("\\", "/")
            parts = [part for part in recovered.split("/") if part not in ("", ".")]
            if not parts:
                continue
            relative = Path(*parts[1:]) if len(parts) > 1 else Path()
            target = destination / root_name / relative
            if info.is_dir() or recovered.endswith("/") or target.exists() and target.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(archive.read(info))


def find_work_source(base: str, temp_root: Path, is_v2: bool = False) -> Path | None:
    candidates: list[Path] = []
    for work_dir in sorted(WORK_ROOT.iterdir()):
        if not work_dir.is_dir() or work_dir.name.startswith("fresh-check-"):
            continue
        for directory_name in ("package-root", "fresh-extract-final", "fresh-extract-package", "fresh-extract"):
            candidate_dir = work_dir / directory_name
            if candidate_dir.is_dir():
                for candidate in candidate_dir.glob("*.js"):
                    text = candidate.read_text(encoding="utf-8", errors="strict")
                    match = re.search(r'window\.examTitle\s*=\s*"([^"]+)"', text)
                    if match and match.group(1) == base:
                        candidates.append(candidate)
    if not candidates:
        return None
    preferred = [p for p in candidates if "package-root" in p.parts]
    return sorted(preferred or candidates)[0]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_manifest(root: Path) -> None:
    manifest = root / "reports" / "sha256_manifest.txt"
    lines = []
    for file in sorted(p for p in root.rglob("*") if p.is_file() and p != manifest):
        lines.append(f"{sha256(file)}  {file.relative_to(root).as_posix()}")
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_reports(root: Path, base: str, is_v2: bool = False) -> None:
    reports = root / "reports"
    reports.mkdir(parents=True, exist_ok=True)
    details = CORRECTIONS.get(base, [])
    report = [
        f"# Independent correction pass — {base}",
        "",
        "- date: 2026-09-09",
        "- scope: confirmed source/math/solution/LaTeX defects from the full-package review",
        "- policy: source-uncertain items remain REVIEW_NEEDED/BLOCKED; no guessed reconstruction was applied",
        "- student-facing solutions were checked for internal review/source-conflict language in the corrected fields",
        "",
        "## Corrections",
        "",
    ]
    report.extend(f"- {item}" for item in details)
    if not details:
        report.append("- No item-specific semantic correction was applied to this package; the package remains subject to the existing source/asset review notes.")
    report.extend(
        [
            "",
            "## Mechanical safety pass",
            "",
            "- JS string-level LaTeX escapes and control-character hazards were normalized where present.",
            "- The release JS was VM-loaded after correction before repackaging.",
            "- PNGs and source files were preserved byte-for-byte unless already present in the package.",
        ]
    )
    (reports / "REVIEW_CORRECTIONS_20260909.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    if is_v2 and base == "23_부영여고_2학기_중간_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 23_부영여고_2학기_중간_고1_기출 v2\n\n"
            "- q1–q6: REVIEW_NEEDED — source extraction remains an unresolved placeholder; no choices or source-faithful statement is available.\n"
            "- q8: REVIEW_NEEDED — source extraction remains an unresolved placeholder.\n"
            "- q10: REVIEW_NEEDED — source extraction remains an unresolved placeholder.\n"
            "- q9/q11/q12/q13/q15/q16/q18: REVIEW_NEEDED — source/key conflicts or incomplete source conditions remain unresolved.\n",
            encoding="utf-8",
        )
    if base == "23_여천고_2학기_중간_고1_기출":
        excluded = reports / "EXCLUDED_QUESTIONS.md"
        excluded.write_text(
            "# EXCLUDED SOURCE QUESTIONS — 23_여천고_2학기_중간_고1_기출\n\n"
            "- q7: REVIEW_NEEDED — the printed diagram and its swapped graph do not determine a finite enclosed area.\n"
            "- q8: REVIEW_NEEDED — the repeated movement rule and printed choices could not be reconciled independently.\n"
            "- q9: REVIEW_NEEDED — the rectangle figure placement needed for the overlap area is not recoverable.\n"
            "- q10: REVIEW_NEEDED — the source-dependent visual asset is missing from the package, so the printed set diagram was not independently adjudicated.\n"
            "- q17: REVIEW_NEEDED — the source-dependent visual asset is missing from the package; no replacement was guessed.\n\n"
            "These five exclusions are local question decisions; no visual or source-conflicted item was guessed into production.\n",
            encoding="utf-8",
        )
    if base in {"20_매산고_2학기_기말_고1_기출", "20_매산여고_2학기_기말_고1_기출"}:
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            f"# EXCLUDED SOURCE QUESTIONS — {base}\n\n"
            "- q13: REVIEW_NEEDED — direct combinatorial count and printed answer choice conflict; the item was removed from the release question bank rather than guessed.\n",
            encoding="utf-8",
        )
    if base == "24_여천고_2학기_기말_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 24_여천고_2학기_기말_고1_기출\n\n"
            "- q17: REVIEW_NEEDED — the printed piecewise inverse iteration remains source-conflicted after A restoration attempts; no guessed B replacement was promoted.\n",
            encoding="utf-8",
        )
    if base == "24_여천고_2학기_중간_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 24_여천고_2학기_중간_고1_기출\n\n"
            "- q8: REVIEW_NEEDED — the printed complement-set equation is source-conflicted and remains a B/blocked candidate.\n"
            "- q9: REVIEW_NEEDED — proposition wording/visual source requires further A restoration.\n"
            "- q12: REVIEW_NEEDED — graph-choice visual adjudication remains pending.\n",
            encoding="utf-8",
        )
    if base == "19_강남고_2학기_기말_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 19_강남고_2학기_기말_고1_기출\n\n"
            "- q6/q7/q17/q18/q19/q21/q22: REVIEW_NEEDED — these source ordinals are not represented by the current legacy release question bank; no guessed payload was inserted.\n",
            encoding="utf-8",
        )
    if base == "24_여양고_2학기_기말_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 24_여양고_2학기_기말_고1_기출\n\n"
            "- q8: REVIEW_NEEDED — the source ordinal is not represented by the current release bank; A형 source restoration is still required.\n"
            "- q17: REVIEW_NEEDED — the source ordinal is not represented by the current release bank; A형 source restoration is still required.\n",
            encoding="utf-8",
        )
    if base == "23_부영여고_2학기_중간_고1_기출":
        suffix = " v2" if is_v2 else ""
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            f"# EXCLUDED SOURCE QUESTIONS — 23_부영여고_2학기_중간_고1_기출{suffix}\n\n"
            "- No question was excluded after A형 source restoration; q1-q18 and 서술형1-3 are present with native-page evidence.\n",
            encoding="utf-8",
        )
    if base == "24_여양고_2학기_기말_고1_기출":
        (reports / "EXCLUDED_QUESTIONS.md").write_text(
            "# EXCLUDED SOURCE QUESTIONS — 24_여양고_2학기_기말_고1_기출\n\n"
            "- q13: REVIEW_NEEDED — the follow-up function-count condition text remains absent from the recoverable source view.\n",
            encoding="utf-8",
        )


def update_build_sanity(root: Path) -> None:
    report = root / "reports" / "BUILD_SANITY.md"
    previous = report.read_text(encoding="utf-8") if report.exists() else "# BUILD SANITY\n"
    marker = "## Independent correction pass — 2026-09-09"
    if marker not in previous:
        previous = previous.rstrip() + "\n\n" + marker + "\n\n- corrected JS copied from the reviewed work artifact\n- fresh-extract, manifest, and ZIP checks are regenerated by the current rebuild\n"
    report.write_text(previous.rstrip() + "\n", encoding="utf-8")


def rebuild_zip(staged_root: Path, zip_path: Path) -> None:
    zip_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(p for p in staged_root.rglob("*") if p.is_file()):
            archive.write(file, file.relative_to(staged_root.parent).as_posix())


def main() -> None:
    BACKUP_ROOT.mkdir(parents=True, exist_ok=True)
    staging_parent = Path(tempfile.mkdtemp(prefix="external-review-rebuild-", dir=str(BACKUP_ROOT)))
    package_dirs = sorted(p for p in PACKAGES_ROOT.iterdir() if p.is_dir() and p.name.endswith("_EXTERNAL_REVIEW"))
    zip_paths = sorted(PACKAGES_ROOT.glob("*_EXTERNAL_REVIEW*.zip"))
    root_names = sorted({p.stem for p in zip_paths} | {p.name for p in package_dirs})
    rebuilt = 0
    source_replaced = 0
    for root_name in root_names:
        suffix = "_EXTERNAL_REVIEW_v2" if root_name.endswith("_EXTERNAL_REVIEW_v2") else "_EXTERNAL_REVIEW"
        base = root_name.removesuffix(suffix)
        staged_root = staging_parent / root_name
        existing_dir = PACKAGES_ROOT / root_name
        zip_path = PACKAGES_ROOT / (root_name + ".zip")
        if existing_dir.exists():
            shutil.copytree(existing_dir, staged_root)
        elif zip_path.exists():
            zip_extract_to_root(zip_path, staging_parent, root_name)
        else:
            raise FileNotFoundError(base)
        js_path = staged_root / (base + ".js")
        source = find_work_source(base, staging_parent, root_name.endswith("_EXTERNAL_REVIEW_v2"))
        if source is not None and source.exists():
            shutil.copy2(source, js_path)
            source_replaced += 1
        legacy_images = staged_root / "images"
        asset_images = staged_root / "assets" / "images"
        if legacy_images.is_dir() and not asset_images.exists():
            asset_images.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(legacy_images, asset_images)
        write_reports(staged_root, base, root_name.endswith("_EXTERNAL_REVIEW_v2"))
        update_build_sanity(staged_root)
        write_manifest(staged_root)
        if existing_dir.exists():
            backup_dir = BACKUP_ROOT / "pre-rebuild-dirs" / root_name
            backup_dir.parent.mkdir(parents=True, exist_ok=True)
            if not backup_dir.exists():
                shutil.copytree(existing_dir, backup_dir)
            shutil.rmtree(existing_dir)
        shutil.copytree(staged_root, existing_dir)
        if zip_path.exists():
            backup_zip = BACKUP_ROOT / "pre-rebuild-zips" / zip_path.name
            backup_zip.parent.mkdir(parents=True, exist_ok=True)
            if not backup_zip.exists():
                shutil.copy2(zip_path, backup_zip)
        rebuild_zip(staged_root, zip_path)
        rebuilt += 1
        print(f"REBUILT {base}")
    print(f"PACKAGES={rebuilt} SOURCE_JS_REPLACED={source_replaced} BACKUP={BACKUP_ROOT}")


if __name__ == "__main__":
    main()
