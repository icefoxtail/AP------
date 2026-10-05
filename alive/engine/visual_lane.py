from __future__ import annotations

"""Deterministic visual candidate lane for staged exam Runs."""

import copy
import json
import os
import shutil
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

from .run_store import atomic_write_json, sha256_file
from .source_question import json_sha256
from .visual_renderer import RENDERER_VERSION, VISUAL_SPEC_VERSION, render_visual_file, render_visual_spec


VISUAL_LANE_VERSION = "0.1.0"


class VisualLaneError(ValueError):
    pass


def _atomic_copy(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        shutil.copyfile(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def _inside(run_dir: Path, relative: str) -> Path:
    root = run_dir.resolve()
    candidate = (root / relative).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as error:
        raise VisualLaneError("visual candidate path must stay inside the Run") from error
    return candidate


def _normal_spec(spec: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(spec, dict):
        raise VisualLaneError("visualSpec must be an object")
    normalized = copy.deepcopy(spec)
    normalized.setdefault("version", VISUAL_SPEC_VERSION)
    # Rendering is the schema validator.  It also ensures unsupported geometry
    # cannot enter the candidate lane.
    render_visual_spec(normalized)
    return normalized


def _reject_active_svg(path: Path) -> None:
    try:
        tree_root = ET.fromstring(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, ET.ParseError) as error:
        raise VisualLaneError("visual SVG is not well-formed XML") from error
    if tree_root.tag.rsplit("}", 1)[-1].casefold() != "svg":
        raise VisualLaneError("visual asset root must be svg")
    for element in tree_root.iter():
        if element.tag.rsplit("}", 1)[-1].casefold() in {"script", "foreignobject"}:
            raise VisualLaneError("visual SVG contains active content")
        for key, value in element.attrib.items():
            if key.rsplit("}", 1)[-1].casefold() in {"href", "href"} and value:
                raise VisualLaneError("visual SVG contains an external or embedded reference")


def validate_staged_visual_asset(
    run_dir: Path, visual_spec: dict[str, Any], visual_asset: dict[str, Any]
) -> dict[str, Any]:
    spec = _normal_spec(visual_spec)
    if not isinstance(visual_asset, dict):
        raise VisualLaneError("visualAsset must be an object")
    if visual_asset.get("assetType") != "svg":
        raise VisualLaneError("staged visual asset must be SVG")
    asset_relative = visual_asset.get("path")
    report_relative = visual_asset.get("reportPath")
    spec_relative = visual_asset.get("specPath")
    if not all(isinstance(value, str) and value for value in (asset_relative, report_relative, spec_relative)):
        raise VisualLaneError("visual asset paths are incomplete")
    asset_path = _inside(run_dir, asset_relative)
    report_path = _inside(run_dir, report_relative)
    spec_path = _inside(run_dir, spec_relative)
    if asset_path.suffix.casefold() != ".svg" or asset_path.name != "visual.svg":
        raise VisualLaneError("visual asset filename must be visual.svg")
    if report_path.name != "visual-render-report.json" or spec_path.name != "visual-spec.json":
        raise VisualLaneError("visual visual-contract filenames are invalid")
    if not asset_path.is_file() or not report_path.is_file() or not spec_path.is_file():
        raise VisualLaneError("visual asset, spec, or report is missing")
    stored_spec = json.loads(spec_path.read_text(encoding="utf-8"))
    if stored_spec != spec:
        raise VisualLaneError("visual spec snapshot differs from the candidate spec")
    spec_sha = json_sha256(spec)
    asset_sha = sha256_file(asset_path)
    if visual_asset.get("specSha256") != spec_sha or visual_asset.get("sha256") != asset_sha:
        raise VisualLaneError("visual asset or spec SHA-256 mismatch")
    report = json.loads(report_path.read_text(encoding="utf-8"))
    if (
        report.get("assetSha256") != asset_sha
        or report.get("specSha256") != spec_sha
        or report.get("deterministicRerender") != "PASS"
        or report.get("generativeModelUsed") is not False
    ):
        raise VisualLaneError("visual render provenance did not PASS")
    if asset_path.read_text(encoding="utf-8") != render_visual_spec(spec):
        raise VisualLaneError("visual SVG does not match deterministic renderer output")
    _reject_active_svg(asset_path)
    return {
        "specSha256": spec_sha,
        "assetSha256": asset_sha,
        "rendererVersion": visual_asset.get("rendererVersion", RENDERER_VERSION),
        "assetPath": asset_relative,
        "reportPath": report_relative,
        "specPath": spec_relative,
    }


def render_staged_visual(
    run_dir: Path,
    batch_id: str,
    round_name: str,
    ordinal: int,
    visual_spec: dict[str, Any],
    role: str = "problem",
) -> dict[str, Any]:
    if role not in {"problem", "solution"}:
        raise VisualLaneError("visual role must be problem or solution")
    spec = _normal_spec(visual_spec)
    # Keep problem and solution construction drawings side by side without
    # allowing one role to overwrite the other.  The role is part of the
    # candidate path and remains covered by the existing visual allowlist.
    base = run_dir / "candidates" / batch_id / round_name / "visual" / f"q{ordinal:03d}" / role
    spec_path = base / "visual-spec.json"
    asset_path = base / "visual.svg"
    report_path = base / "visual-render-report.json"
    atomic_write_json(spec_path, spec)
    report = render_visual_file(spec_path, asset_path, report_path)
    report.update({
        "laneVersion": VISUAL_LANE_VERSION,
        "role": role,
        "batchId": batch_id,
        "round": round_name,
        "ordinal": ordinal,
    })
    atomic_write_json(report_path, report)
    asset = {
        "path": asset_path.relative_to(run_dir).as_posix(),
        "reportPath": report_path.relative_to(run_dir).as_posix(),
        "specPath": spec_path.relative_to(run_dir).as_posix(),
        "assetType": "svg",
        "sha256": report["assetSha256"],
        "specSha256": report["specSha256"],
        "rendererVersion": report["rendererVersion"],
        "deterministicRerender": report["deterministicRerender"],
        "generativeModelUsed": report["generativeModelUsed"],
        "role": role,
    }
    validate_staged_visual_asset(run_dir, spec, asset)
    return asset


def materialize_final_visual(
    root: Path,
    run_dir: Path,
    run_id: str,
    ordinal: int,
    visual_spec: dict[str, Any],
    visual_asset: dict[str, Any],
) -> dict[str, Any]:
    role = visual_asset.get("role", "problem")
    if role not in {"problem", "solution"}:
        raise VisualLaneError("visual role must be problem or solution")
    validated = validate_staged_visual_asset(run_dir, visual_spec, visual_asset)
    source = _inside(run_dir, visual_asset["path"])
    filename = f"q{ordinal:03d}{'-solution' if role == 'solution' else ''}.svg"
    final_relative = f"final/assets/{filename}"
    final_path = run_dir / final_relative
    _atomic_copy(source, final_path)
    shadow_relative = f"_generated/alive-staged-exam-runs/{run_id}/assets/{filename}"
    shadow_path = root / "archive" / shadow_relative
    _atomic_copy(source, shadow_path)
    spec_target = run_dir / "final" / "assets" / f"q{ordinal:03d}{'-solution' if role == 'solution' else ''}-visual-spec.json"
    report_target = run_dir / "final" / "assets" / f"q{ordinal:03d}{'-solution' if role == 'solution' else ''}-visual-render-report.json"
    atomic_write_json(spec_target, _normal_spec(visual_spec))
    atomic_write_json(report_target, json.loads(_inside(run_dir, visual_asset["reportPath"]).read_text(encoding="utf-8")))
    return {
        "visualSpecVersion": _normal_spec(visual_spec).get("version", VISUAL_SPEC_VERSION),
        "visualType": _normal_spec(visual_spec).get("type"),
        "assetType": "svg",
        "role": role,
        "assetLocalPath": final_relative,
        "assetSha256": validated["assetSha256"],
        "specSha256": validated["specSha256"],
        "renderer": validated["rendererVersion"],
        "visualValidator": "PASS",
        "renderReportLocalPath": report_target.relative_to(run_dir).as_posix(),
        "visualSpecLocalPath": spec_target.relative_to(run_dir).as_posix(),
        "archiveRelativePath": shadow_relative,
    }
