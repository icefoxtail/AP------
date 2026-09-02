from __future__ import annotations

"""Source-visual reconnaissance for the staged whole-exam pipeline.

This module deliberately stops short of semantic visual approval.  It proves
that a source visual reference is local, decodable, and safely copyable into a
Run.  Human/browser inspection remains a later gate.
"""

import copy
import re
import shutil
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, Iterable

from .run_store import atomic_write_json, sha256_file
from .source_question import json_sha256


VISUAL_RECON_VERSION = "0.1.0"
_ASSET_SUFFIXES = {".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
_PROBLEM_KEYS = {
    "image", "images", "imageasset", "imageassets", "choiceimages", "diagram", "svg", "png",
}
_SOLUTION_KEYS = {"solutionimage", "solutionimages", "solutionvisual"}
_INLINE_REF_RE = re.compile(r"(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)
_REMOTE_PREFIXES = ("http://", "https://", "//", "data:", "blob:")


class VisualReconError(ValueError):
    pass


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        temporary.replace(target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _normal_key(value: Any) -> str:
    return str(value).strip().casefold().replace("_", "").replace("-", "")


def _string_values(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        if value.strip():
            yield value.strip()
    elif isinstance(value, list):
        for item in value:
            yield from _string_values(item)
    elif isinstance(value, dict):
        for key in ("path", "src", "href", "file", "asset", "url"):
            if key in value:
                yield from _string_values(value[key])


def _visual_refs(question: dict[str, Any], role: str) -> list[str]:
    keys = _PROBLEM_KEYS if role == "problem" else _SOLUTION_KEYS
    found: list[str] = []

    def visit(value: Any) -> None:
        if isinstance(value, dict):
            for key, nested in value.items():
                if _normal_key(key) in keys:
                    found.extend(_string_values(nested))
                visit(nested)
        elif isinstance(value, list):
            for nested in value:
                visit(nested)

    visit(question)
    text = question.get("content" if role == "problem" else "solution", "")
    if isinstance(text, str):
        found.extend(_INLINE_REF_RE.findall(text))
    unique: list[str] = []
    seen: set[str] = set()
    for ref in found:
        if ref not in seen:
            seen.add(ref)
            unique.append(ref)
    return unique


def _resolve_asset(root: Path, reference: str) -> tuple[Path | None, str | None, str | None]:
    value = reference.strip().replace("\\", "/")
    lowered = value.casefold()
    if lowered.startswith(_REMOTE_PREFIXES):
        return None, "VISUAL_SOURCE_REMOTE_OR_EMBEDDED", "remote/data/embedded visual references are unsupported"
    candidate_text = value[8:] if lowered.startswith("archive/") else value
    candidate = (root / "archive" / candidate_text).resolve()
    archive_root = (root / "archive").resolve()
    try:
        candidate.relative_to(archive_root)
    except ValueError:
        return None, "VISUAL_SOURCE_PATH_ESCAPE", "visual source asset escapes archive/"
    if candidate.suffix.casefold() not in _ASSET_SUFFIXES:
        return None, "VISUAL_SOURCE_TYPE_UNSUPPORTED", "visual source asset type is unsupported"
    if not candidate.is_file():
        return None, "VISUAL_SOURCE_ASSET_MISSING", "visual source asset is missing"
    return candidate, None, None


def _asset_type_and_error(path: Path) -> tuple[str | None, str | None]:
    try:
        header = path.read_bytes()[:1024]
    except OSError:
        return None, "VISUAL_SOURCE_ASSET_UNREADABLE"
    suffix = path.suffix.casefold()
    if suffix == ".png" and header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png", None
    if suffix in {".jpg", ".jpeg"} and header.startswith(b"\xff\xd8\xff"):
        return "jpeg", None
    if suffix == ".gif" and header.startswith((b"GIF87a", b"GIF89a")):
        return "gif", None
    if suffix == ".webp" and header.startswith(b"RIFF") and header[8:12] == b"WEBP":
        return "webp", None
    if suffix == ".svg":
        try:
            root = ET.fromstring(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, ET.ParseError):
            return None, "VISUAL_SOURCE_SVG_INVALID"
        if root.tag.rsplit("}", 1)[-1].casefold() != "svg":
            return None, "VISUAL_SOURCE_SVG_INVALID"
        lowered = path.read_text(encoding="utf-8").casefold()
        if any(token in lowered for token in ("<script", "<foreignobject", "xlink:href", "href=\"http", "href='http")):
            return None, "VISUAL_SOURCE_SVG_ACTIVE_CONTENT"
        return "svg", None
    return None, "VISUAL_SOURCE_SIGNATURE_INVALID"


def _inspect_role(root: Path, question: dict[str, Any], role: str) -> dict[str, Any]:
    refs = _visual_refs(question, role)
    assets: list[dict[str, Any]] = []
    issues: list[dict[str, str]] = []
    for reference in refs:
        path, code, message = _resolve_asset(root, reference)
        if path is None:
            issues.append({"reference": reference, "code": code or "VISUAL_SOURCE_INVALID", "message": message or "invalid reference"})
            continue
        asset_type, signature_error = _asset_type_and_error(path)
        if signature_error:
            issues.append({"reference": reference, "code": signature_error, "message": "asset signature or XML validation failed"})
            continue
        assets.append({
            "reference": reference,
            "archivePath": path.relative_to(root / "archive").as_posix(),
            "sourcePath": path.relative_to(root).as_posix(),
            "assetType": asset_type,
            "bytes": path.stat().st_size,
            "sha256": sha256_file(path),
        })
    return {
        "role": role,
        "references": refs,
        "assets": assets,
        "issues": issues,
        "status": "PASS" if refs and assets and not issues else "HOLD" if refs or issues else "NOT_FOUND",
    }


def inspect_source_visuals(root: Path, exam: dict[str, Any], preflight: dict[str, Any]) -> dict[str, Any]:
    """Inspect all source visual references before any model generation."""

    questions: dict[str, Any] = {}
    held: list[int] = []
    visual_count = 0
    preflight_items = preflight.get("questions", [])
    for ordinal, question in enumerate(exam.get("questions", []), 1):
        item = preflight_items[ordinal - 1] if ordinal <= len(preflight_items) else {}
        dependency = item.get("visualDependency", "NONE")
        roles = {
            "problem": _inspect_role(root, question, "problem"),
            "solution": _inspect_role(root, question, "solution"),
        }
        required_roles = ["problem"] if dependency == "ESSENTIAL" else ["solution"] if dependency == "OPTIONAL" else []
        issues = [issue for role in required_roles for issue in roles[role]["issues"]]
        missing = [role for role in required_roles if roles[role]["status"] != "PASS"]
        status = "NOT_REQUIRED" if dependency == "NONE" else "PASS" if not missing and not issues else "HOLD"
        if dependency != "NONE":
            visual_count += 1
        if status == "HOLD":
            held.append(ordinal)
        fingerprint_payload = {
            "dependency": dependency,
            "roles": roles,
            "semanticInspection": "HUMAN_REQUIRED",
            "browserInspection": "REQUIRED_BEFORE_FINAL_PASS",
        }
        questions[str(ordinal)] = {
            "ordinal": ordinal,
            "visualDependency": dependency,
            "status": status,
            "requiredRoles": required_roles,
            "roles": roles,
            "visualFingerprint": {
                "sha256": json_sha256(fingerprint_payload),
                "dependency": dependency,
                "assetSha256": sorted(
                    asset["sha256"]
                    for role in roles.values()
                    for asset in role["assets"]
                ),
                "semanticInspection": "HUMAN_REQUIRED",
                "browserInspection": "REQUIRED_BEFORE_FINAL_PASS",
            },
            "codes": sorted({issue["code"] for issue in issues}),
        }
    ready = not held
    return {
        "schemaVersion": VISUAL_RECON_VERSION,
        "artifactType": "ALIVE_STAGED_VISUAL_RECON",
        "status": "NOT_REQUIRED" if visual_count == 0 else "READY" if ready else "BLOCKED",
        "ready": ready,
        "visualQuestionCount": visual_count,
        "heldOrdinals": held,
        "humanInspectionRequired": visual_count > 0,
        "browserInspectionRequired": visual_count > 0,
        "inspectionScope": "local-asset-decode-and-safe-path-only",
        "questions": questions,
    }


def materialize_visual_recon(
    run_dir: Path, report: dict[str, Any], repository_root: Path | None = None
) -> dict[str, Any]:
    """Copy source assets into the immutable Run snapshot and return it."""

    materialized = copy.deepcopy(report)
    for ordinal, item in materialized.get("questions", {}).items():
        for role in item.get("roles", {}).values():
            for index, asset in enumerate(role.get("assets", []), 1):
                if repository_root is None:
                    raise VisualReconError("visual recon repository root is missing")
                source = repository_root.resolve() / asset["sourcePath"]
                target_relative = f"source/visual/q{int(ordinal):03d}/{role['role']}-{index}-{Path(asset['archivePath']).name}"
                target = run_dir / target_relative
                _atomic_copy(source, target)
                asset["runPath"] = target_relative
                asset["runSha256"] = sha256_file(target)
    atomic_write_json(run_dir / "source/visual-recon.json", materialized)
    return materialized


def prepare_visual_recon(root: Path, exam: dict[str, Any], preflight: dict[str, Any]) -> dict[str, Any]:
    """Build a recon report; materialization receives the repository root explicitly."""

    return inspect_source_visuals(root, exam, preflight)
