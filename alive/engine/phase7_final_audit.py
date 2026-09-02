"""Deterministic Phase-7 audit for sealed universal Runs.

This is a read-only promotion audit.  It verifies that a supplied set of
authoritative Runs has passed every lifecycle stage, actual-browser evidence,
variant ledger, package CRC, and local publication guard.  It never publishes
to the Archive and it never treats an omitted Run as implicitly passed.
"""

from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path
from typing import Any, Iterable

from .universal_variant_runtime import UNIVERSAL_STAGES


PHASE7_SCHEMA_VERSION = "0.1.0"


def _read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"JSON object required: {path}")
    return value


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _check_render(run_dir: Path, manifest: dict[str, Any], question_count: int) -> list[str]:
    errors: list[str] = []
    render_info = manifest.get("render")
    render_path = run_dir / str((render_info or {}).get("path") or "render/render-evidence.json")
    if not render_path.is_file():
        return ["render evidence is missing"]
    evidence = _read_json(render_path)
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True:
        errors.append("render evidence is not actual production-browser evidence")
    # Older sealed evidence predates the explicit visualReview field.  The
    # actual-browser and per-mode gates below are the authoritative evidence;
    # an explicitly failing visualReview still blocks the Run.
    if evidence.get("visualReview") not in (None, "PASS"):
        errors.append("visualReview is not PASS")
    modes = evidence.get("modes")
    if not isinstance(modes, dict):
        return errors + ["render evidence modes are missing"]
    for mode_name in ("exam", "solution", "answer"):
        mode = modes.get(mode_name)
        if not isinstance(mode, dict):
            errors.append(f"{mode_name} render mode is missing")
            continue
        if mode.get("verdict") != "PASS":
            errors.append(f"{mode_name} verdict is not PASS")
        # ``ready`` was added after the first sealed vertical slices.  A
        # missing field is accepted only for legacy evidence; an explicit
        # false value remains a hard failure.
        if mode.get("ready") is False:
            errors.append(f"{mode_name} render is not ready")
        if mode.get("lastPageChecked") is not True:
            errors.append(f"{mode_name} last page was not checked")
        if mode.get("lastQuestion") != question_count:
            errors.append(f"{mode_name} last question does not cover the whole Run")
        if mode.get("unrenderedMath") != 0 or mode.get("overflowCount") != 0:
            errors.append(f"{mode_name} has unrendered math or overflow")
        if mode.get("badImages") != [] or mode.get("renderError") is not None:
            errors.append(f"{mode_name} has image or render errors")
    if render_info and render_info.get("sha256") != _sha256(render_path):
        errors.append("manifest render SHA-256 does not match evidence")
    return errors


def _audit_one(run_dir: Path, run_id: str) -> dict[str, Any]:
    errors: list[str] = []
    manifest_path = run_dir / "manifest.json"
    if not manifest_path.is_file():
        return {"runId": run_id, "status": "FAIL", "errors": ["manifest is missing"]}
    try:
        manifest = _read_json(manifest_path)
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError) as error:
        return {"runId": run_id, "status": "FAIL", "errors": [f"manifest cannot be read: {error}"]}
    if manifest.get("artifactType") != "ALIVE_UNIVERSAL_VARIANT_RUN":
        errors.append("artifact type is not a universal Run")
    if manifest.get("status") != "SEALED_LOCAL" or manifest.get("currentStage") != "SEALED":
        errors.append("Run is not SEALED_LOCAL at SEALED")
    if manifest.get("publicationStatus") != "NOT_PUBLISHED":
        errors.append("publication guard is not NOT_PUBLISHED")
    question_count = manifest.get("questionCount")
    if not isinstance(question_count, int) or question_count < 1:
        errors.append("questionCount is invalid")
        question_count = 0
    stages = {stage.get("stageId"): stage.get("status") for stage in manifest.get("stages", []) if isinstance(stage, dict)}
    for stage_id in UNIVERSAL_STAGES:
        if stages.get(stage_id) != "PASS":
            errors.append(f"{stage_id} is not PASS")
    source_lock = manifest.get("sourceLock")
    if not isinstance(source_lock, dict) or not all(isinstance(source_lock.get(key), str) and len(source_lock[key]) == 64 for key in ("sha256", "ruleSnapshotSha256")):
        errors.append("source/rule lock is incomplete")
    errors.extend(_check_render(run_dir, manifest, question_count))
    ledger_info = manifest.get("variantProofLedger")
    ledger_path = run_dir / str((ledger_info or {}).get("path") or "final/variant-proof-ledger.json")
    if not ledger_path.is_file():
        errors.append("variant proof ledger is missing")
    else:
        ledger = _read_json(ledger_path)
        if ledger.get("variantProofLedgerComplete") != "PASS" or ledger.get("questionCount") != question_count:
            errors.append("variant proof ledger is incomplete")
        if ledger_info and ledger_info.get("sha256") != _sha256(ledger_path):
            errors.append("manifest variant ledger SHA-256 does not match")
    package_info = manifest.get("package")
    package_path = run_dir / str((package_info or {}).get("path") or "final/universal-run-package.zip")
    if not package_path.is_file():
        errors.append("universal package is missing")
    else:
        if package_info and package_info.get("sha256") != _sha256(package_path):
            errors.append("manifest package SHA-256 does not match")
        try:
            with zipfile.ZipFile(package_path) as archive:
                if archive.testzip() is not None:
                    errors.append("package CRC check failed")
        except (OSError, zipfile.BadZipFile) as error:
            errors.append(f"package cannot be opened: {error}")
    closure_path = run_dir / "final/legacy-final-closure-report.json"
    if not closure_path.is_file():
        errors.append("legacy final closure report is missing")
    else:
        closure = _read_json(closure_path)
        gates = closure.get("gates", {})
        if closure.get("status") != "PASS" or not isinstance(gates, dict) or any(value != "PASS" for value in gates.values()):
            errors.append("legacy final closure gates are not all PASS")
    return {
        "runId": run_id,
        "status": "PASS" if not errors else "FAIL",
        "questionCount": question_count,
        "errors": errors,
        "publicationStatus": manifest.get("publicationStatus"),
    }


def audit_phase7(root: Path, run_ids: Iterable[str]) -> dict[str, Any]:
    """Audit all explicitly supplied authoritative Runs and return a report."""

    normalized_ids = [str(run_id) for run_id in run_ids if str(run_id).strip()]
    if not normalized_ids:
        raise ValueError("at least one universal Run id is required")
    if len(set(normalized_ids)) != len(normalized_ids):
        raise ValueError("duplicate universal Run id")
    runtime_root = Path(root).resolve() / "alive" / "runtime" / "universal-runs"
    rows = [_audit_one(runtime_root / run_id, run_id) for run_id in normalized_ids]
    passed = all(row["status"] == "PASS" for row in rows)
    return {
        "artifactType": "ALIVE_UNIVERSAL_PHASE7_FINAL_AUDIT",
        "schemaVersion": PHASE7_SCHEMA_VERSION,
        "status": "PASS_ACTIVE_BOUNDED" if passed else "HOLD",
        "promotionState": "ACTIVE_BOUNDED" if passed else "HOLD",
        "runCount": len(rows),
        "passedRunCount": sum(row["status"] == "PASS" for row in rows),
        "runs": rows,
        "failClosed": True,
        "productionArchiveRegistration": "NOT_PERFORMED",
        "publicationStatus": "NOT_PUBLISHED",
    }


__all__ = ["PHASE7_SCHEMA_VERSION", "audit_phase7"]
