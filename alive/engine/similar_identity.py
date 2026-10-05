"""Canonical identity and install-layout helpers for similar-exam packages."""

from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path
from typing import Any


_TITLE_RE = re.compile(r"window\.examTitle\s*=\s*(\"(?:\\.|[^\"\\])*\")")
_QUESTION_BANK_RE = re.compile(r"window\.questionBank\s*=\s*(\[.*\])\s*;?\s*$", re.S)
_ASSET_RE = re.compile(r"(?:^|/)(q)(\d{1,3})(-solution)?\.(svg|png)$", re.I)
_VARIANT_IDENTITY_RE = re.compile(r"^유사(?:(?P<class>[abc])(?P<class_number>\d*)|(?P<number>\d+))?$", re.I)


def _normalize_variant(variant: str | None) -> str:
    """Normalize a variant token without allocating a collision number."""

    raw = str(variant or "유사").strip().strip("_")
    if raw.lower() in {"a", "b", "c"}:
        raw = f"유사{raw.upper()}"
    match = _VARIANT_IDENTITY_RE.fullmatch(raw)
    if not match:
        raise ValueError("variant must be 유사, A/B/C, 유사A/B/C, or a legacy numbered 유사 token")
    variant_class = match.group("class")
    if variant_class:
        number = match.group("class_number") or ""
        return f"유사{variant_class.upper()}{number}"
    return raw


def _identity_family_base(identity: str) -> str:
    """Return the source identity without a similar-variant suffix."""

    return re.sub(
        r"_(?:유사(?:[ABC]?\d*)?|유사문제|강화유사문제|심화유사문제)$",
        "",
        identity,
        flags=re.I,
    )


def _numbered_collision_root(identity: str) -> tuple[str, int]:
    """Split a variant identity into its unnumbered root and next suffix."""

    match = re.match(r"^(?P<root>.+_유사(?:[ABC])?)(?P<number>\d+)?$", identity, re.I)
    if not match:
        return identity, 2
    existing_number = int(match.group("number") or "1")
    return match.group("root"), max(2, existing_number + 1)


def canonical_similar_identity(source_file: str, variant: str = "유사") -> str:
    """Derive an Archive-safe identity from a canonical original source path."""

    stem = Path(source_file.replace("\\", "/")).stem.strip()
    stem = re.sub(r"_(?:기출|원본)$", "", stem)
    stem = re.sub(
        r"_(?:유사(?:[ABC]?\d*)?|유사문제|강화유사문제|심화유사문제)$",
        "",
        stem,
        flags=re.I,
    )
    suffix = _normalize_variant(variant)
    return f"{stem}_{suffix}"


def human_display_title(identity: str) -> str:
    parts = identity.split("_")
    if len(parts) < 6:
        return identity
    year, school, semester, exam_type, grade = parts[:5]
    subject = "_".join(parts[5:])
    subject = subject.replace("확률과통계", "확률과 통계")
    variant_match = re.search(
        r"_(?P<base>유사)(?:(?P<class>[ABC])(?P<class_number>\d*)|(?P<number>\d+))?$",
        subject,
        flags=re.I,
    )
    variant_label = "유사문제"
    if variant_match:
        subject = subject[: variant_match.start()]
        variant_class = variant_match.group("class")
        class_number = variant_match.group("class_number")
        number = variant_match.group("number")
        if variant_class:
            variant_label = f"유사문제 {variant_class.upper()}형"
            if class_number:
                variant_label += f" {class_number}"
        elif number:
            variant_label = f"유사문제 {number}"
    year_label = f"{year}년" if len(year) == 2 and year.isdigit() else year
    exam_label = {"중간": "중간고사", "기말": "기말고사"}.get(exam_type, exam_type)
    return f"{year_label} {school} {grade} {semester} {exam_label} {subject} {variant_label}"


def _occupied(root: Path, identity: str) -> dict[str, Any]:
    js = root / "archive/exams/similar" / _grade_path(identity) / f"{identity}.js"
    assets = root / "archive/assets/images" / identity
    legacy = []
    family_base = _identity_family_base(identity)
    for legacy_suffix in ("유사", "유사문제", "유사1", "강화유사문제", "심화유사문제"):
        legacy_identity = f"{family_base}_{legacy_suffix}"
        if legacy_identity == identity:
            continue
        legacy_js = root / "archive/exams/similar" / _grade_path(identity) / f"{legacy_identity}.js"
        legacy_assets = root / "archive/assets/images" / legacy_identity
        if legacy_js.is_file() or legacy_assets.is_dir():
            legacy.append(legacy_identity)
    return {
        "identity": identity,
        "jsPath": js.as_posix(),
        "assetPath": assets.as_posix(),
        "jsExists": js.is_file(),
        "assetDirExists": assets.is_dir(),
        "occupied": js.is_file() or assets.is_dir(),
        "legacyMatches": legacy,
    }


def _grade_path(identity: str) -> str:
    parts = identity.split("_")
    grade = next((part for part in parts if re.fullmatch(r"고\d+", part)), "고1")
    semester = next((part for part in parts if part in {"1학기", "2학기"}), "2학기")
    exam_type = next((part for part in parts if part in {"중간", "기말"}), "중간")
    period = f"{semester[0]}{'mid' if exam_type == '중간' else 'final'}"
    return f"high/h{grade[1:]}/{period}"


def install_exam_path(identity: str) -> str:
    """Return the install-ready Archive path for a similar-exam script."""

    return f"install/archive/exams/similar/{_grade_path(identity)}/{identity}.js"


def allocate_similar_identity(root: Path, base_identity: str) -> dict[str, Any]:
    """Allocate a variant identity or its lowest unused class-local suffix.

    New class-aware identities use ``_유사A``, ``_유사B``, or ``_유사C`` and
    continue as ``_유사A2`` when the same class is generated again. The
    historical untyped ``_유사`` family keeps its existing ``_유사2`` form.
    """

    checks: list[dict[str, Any]] = []
    first = _occupied(root, base_identity)
    checks.append(first)
    if not first["occupied"]:
        return {"identity": base_identity, "collision": False, "checks": checks}
    collision_root, number = _numbered_collision_root(base_identity)
    while True:
        candidate = f"{collision_root}{number}"
        current = _occupied(root, candidate)
        checks.append(current)
        if not current["occupied"]:
            return {"identity": candidate, "collision": True, "checks": checks}
        number += 1


def _parse_script(script: str) -> tuple[str, list[dict[str, Any]]]:
    title_match = _TITLE_RE.search(script)
    bank_match = _QUESTION_BANK_RE.search(script)
    if not title_match or not bank_match:
        raise ValueError("generated JS does not contain parseable examTitle/questionBank")
    return json.loads(title_match.group(1)), json.loads(bank_match.group(1))


def _format_asset_path(value: str, identity: str) -> str:
    match = _ASSET_RE.search(value.replace("\\", "/"))
    if not match or "assets" not in value.replace("\\", "/"):
        return value
    ordinal = int(match.group(2))
    suffix = match.group(3) or ""
    extension = match.group(4).lower()
    return f"assets/images/{identity}/q{ordinal:02d}{suffix}.{extension}"


def _rewrite_paths(value: Any, identity: str) -> Any:
    if isinstance(value, str):
        return _format_asset_path(value, identity)
    if isinstance(value, list):
        return [_rewrite_paths(item, identity) for item in value]
    if isinstance(value, dict):
        return {key: _rewrite_paths(item, identity) for key, item in value.items()}
    return value


def _question_assets(bank: list[dict[str, Any]]) -> dict[str, str]:
    result: dict[str, str] = {}

    def visit(value: Any) -> None:
        if isinstance(value, str):
            match = _ASSET_RE.search(value.replace("\\", "/"))
            if match and "assets" in value.replace("\\", "/"):
                ordinal = int(match.group(2))
                suffix = match.group(3) or ""
                extension = match.group(4).lower()
                result[f"q{ordinal:02d}{suffix}.{extension}"] = f"q{ordinal:03d}{suffix}.{extension}"
        elif isinstance(value, list):
            for item in value:
                visit(item)
        elif isinstance(value, dict):
            for item in value.values():
                visit(item)

    visit(bank)
    return result


def _asset_references(value: Any) -> set[str]:
    """Collect local archive asset references from a question payload."""

    result: set[str] = set()

    def visit(item: Any) -> None:
        if isinstance(item, str):
            normalized = item.replace("\\", "/")
            match = re.search(r"(assets/images/[^\s\"']+\.(?:svg|png))", normalized, re.I)
            if match:
                result.add(match.group(1))
        elif isinstance(item, list):
            for child in item:
                visit(child)
        elif isinstance(item, dict):
            for child in item.values():
                visit(child)

    visit(value)
    return result


def external_review_package(
    root: Path,
    input_zip: Path,
    output_zip: Path,
    source_file: str,
) -> dict[str, Any]:
    """Create a compact original-vs-similar package for external review.

    The two lanes keep their own ``archive`` root so the JS-relative asset
    paths remain valid when either lane is opened independently.
    """

    source_path = Path(source_file)
    if not source_path.is_absolute():
        source_path = root / source_path
    source_path = source_path.resolve()
    try:
        source_relative = source_path.relative_to(root.resolve()).as_posix()
    except ValueError as exc:
        raise ValueError("source_file must be inside the repository root") from exc
    if not source_relative.startswith("archive/exams/original/"):
        raise ValueError("external review source must be an Archive original exam JS")
    if not source_path.is_file():
        raise ValueError(f"missing original exam JS: {source_relative}")

    original_script = source_path.read_text(encoding="utf-8")
    original_title, original_bank = _parse_script(original_script)
    original_refs = _asset_references(original_bank)

    with zipfile.ZipFile(input_zip, "r") as source:
        package_members = {
            info.filename: source.read(info.filename)
            for info in source.infolist()
            if not info.is_dir()
        }
    manifest_name = "final/identity-manifest.json"
    manifest = json.loads(package_members[manifest_name].decode("utf-8")) if manifest_name in package_members else {}
    similar_identity = manifest.get("identity")
    if not isinstance(similar_identity, str) or not similar_identity:
        candidates = sorted(
            name
            for name in package_members
            if name.startswith("install/archive/exams/similar/") and name.endswith(".js")
        )
        if len(candidates) != 1:
            raise ValueError("canonical package must contain one install-ready similar JS")
        similar_identity = Path(candidates[0]).stem
    similar_js_name = manifest.get("installJsPath") or install_exam_path(similar_identity)
    if similar_js_name not in package_members:
        raise ValueError(f"missing canonical similar JS: {similar_js_name}")
    similar_script = package_members[similar_js_name].decode("utf-8")
    similar_title, similar_bank = _parse_script(similar_script)
    similar_refs = _asset_references(similar_bank)

    members: dict[str, bytes] = {
        f"original/{source_relative}": source_path.read_bytes(),
        f"similar/{similar_js_name.removeprefix('install/')}": package_members[similar_js_name],
    }
    original_assets: list[str] = []
    for ref in sorted(original_refs):
        source_asset = root / "archive" / ref
        if not source_asset.is_file():
            raise ValueError(f"missing original visual asset: archive/{ref}")
        target = f"original/archive/{ref}"
        members[target] = source_asset.read_bytes()
        original_assets.append(target)

    similar_assets: list[str] = []
    for ref in sorted(similar_refs):
        source_asset = f"install/archive/{ref}"
        if source_asset not in package_members:
            raise ValueError(f"missing similar visual asset: {source_asset}")
        target = f"similar/archive/{ref}"
        members[target] = package_members[source_asset]
        similar_assets.append(target)

    if any(Path(name).suffix.lower() not in {".js", ".svg", ".png"} for name in members):
        raise ValueError("external review package contains a non-review file")
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED) as target:
        for name in sorted(members):
            target.writestr(name, members[name])
    with zipfile.ZipFile(output_zip, "r") as check:
        if check.testzip() is not None:
            raise ValueError("external review package ZIP round-trip failed")
    return {
        "status": "EXTERNAL_REVIEW_PACKAGED",
        "output": output_zip.as_posix(),
        "originalIdentity": Path(source_relative).stem,
        "originalTitle": original_title,
        "originalJsPath": f"original/{source_relative}",
        "originalAssetCount": len(original_assets),
        "similarIdentity": similar_identity,
        "similarTitle": similar_title,
        "similarJsPath": f"similar/{similar_js_name.removeprefix('install/')}",
        "similarAssetCount": len(similar_assets),
        "fileCount": len(members),
        "roundTrip": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }


def canonicalize_result_package(
    root: Path,
    input_zip: Path,
    output_zip: Path,
    source_file: str,
    display_title: str | None = None,
    variant_class: str | None = None,
) -> dict[str, Any]:
    """Create a derived install-ready package without rewriting the closed Run."""

    base = canonical_similar_identity(source_file, variant_class or "유사")
    allocation = allocate_similar_identity(root, base)
    identity = allocation["identity"]
    display = display_title or human_display_title(identity)

    with zipfile.ZipFile(input_zip, "r") as source:
        members = {info.filename: source.read(info.filename) for info in source.infolist() if not info.is_dir()}
    script_name = "final/staging/generated-exam.js"
    old_title, bank = _parse_script(members[script_name].decode("utf-8"))
    rewritten_bank = _rewrite_paths(bank, identity)
    canonical_script = (
        f"window.examTitle = {json.dumps(identity, ensure_ascii=False)};\n"
        f"window.examDisplayTitle = {json.dumps(display, ensure_ascii=False)};\n\n"
        f"window.questionBank = {json.dumps(rewritten_bank, ensure_ascii=False, indent=2)};\n"
    ).encode("utf-8")
    members[script_name] = canonical_script

    structured_name = "final/structured-exam.json"
    if structured_name in members:
        structured = json.loads(members[structured_name].decode("utf-8"))
        structured["examTitle"] = identity
        structured["displayTitle"] = display
        structured["questions"] = _rewrite_paths(structured.get("questions", []), identity)
        members[structured_name] = (json.dumps(structured, ensure_ascii=False, indent=2) + "\n").encode("utf-8")

    assets = _question_assets(bank)
    install_js = install_exam_path(identity)
    members[install_js] = canonical_script
    installed_assets: list[str] = []
    for target_name, source_name in sorted(assets.items()):
        source_member = f"final/assets/{source_name}"
        if source_member not in members:
            raise ValueError(f"missing packaged visual asset: {source_member}")
        target_member = f"install/archive/assets/images/{identity}/{target_name}"
        members[target_member] = members[source_member]
        installed_assets.append(target_member)

    identity_manifest = {
        "schemaVersion": "0.1.0",
        "artifactType": "ALIVE_SIMILAR_IDENTITY_CANONICALIZATION",
        "sourcePackage": input_zip.name,
        "sourceFile": source_file,
        "sourceTitleBefore": old_title,
        "identity": identity,
        "variantClass": (
            re.search(r"_유사([ABC])(?:\d+)?$", identity, re.I).group(1).upper()
            if re.search(r"_유사([ABC])(?:\d+)?$", identity, re.I)
            else None
        ),
        "displayTitle": display,
        "collision": allocation,
        "installJsPath": install_js,
        "installAssetRoot": f"install/archive/assets/images/{identity}/",
        "installedAssets": installed_assets,
        "publicationStatus": "NOT_PUBLISHED",
        "originalClosedRunPreserved": True,
    }
    members["final/identity-manifest.json"] = (json.dumps(identity_manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")

    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED) as target:
        for name in sorted(members):
            target.writestr(name, members[name])
    with zipfile.ZipFile(output_zip, "r") as check:
        if check.testzip() is not None:
            raise ValueError("canonicalized package ZIP round-trip failed")
    return {
        "status": "CANONICALIZED_PACKAGED",
        "output": output_zip.as_posix(),
        "identity": identity,
        "displayTitle": display,
        "installJsPath": install_js,
        "installAssetRoot": f"install/archive/assets/images/{identity}/",
        "assetCount": len(installed_assets),
        "collision": allocation,
        "roundTrip": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
