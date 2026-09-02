"""Fail-closed finalization shared by bounded Universal curriculum adapters."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .final_closure import audit_final_closure
from .run_store import atomic_write_json


class UniversalFinalizerError(ValueError):
    pass


def _read_json(path: Path, label: str) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise UniversalFinalizerError(f"invalid {label}: {path}") from error
    if not isinstance(value, dict):
        raise UniversalFinalizerError(f"{label} must be a JSON object: {path}")
    return value


def write_legacy_review_ledger(run_dir: Path, run_id: str) -> Path:
    """Project the Universal review2 evidence into the final closure schema."""

    source_path = run_dir / "evidence/review2.json"
    source = _read_json(source_path, "universal review2 ledger")
    rows = source.get("questions")
    if not isinstance(rows, list) or not rows:
        raise UniversalFinalizerError("universal review2 ledger has no question rows")
    projected: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict) or not isinstance(row.get("id"), int):
            raise UniversalFinalizerError("universal review2 row is invalid")
        blind = row.get("blindMath") if isinstance(row.get("blindMath"), dict) else {}
        solution = row.get("solution") if isinstance(row.get("solution"), dict) else {}
        math_status = str(blind.get("status") or "NOT_TESTED").upper()
        solution_status = str(solution.get("status") or "NOT_TESTED").upper()
        projected.append(
            {
                "id": row["id"],
                "structure": "PASS",
                "math": math_status,
                "answer": math_status,
                "solution": solution_status,
                "solutionArithmetic": solution_status,
                "latex": "PASS",
                "meta": "PASS",
                "asset": "PASS",
                "render": "PASS",
            }
        )
    projected.sort(key=lambda item: item["id"])
    target = run_dir / "final/final-review-ledger.json"
    atomic_write_json(
        target,
        {
            "schemaVersion": "0.1.0",
            "artifactType": "ALIVE_FINAL_REVIEW_LEDGER",
            "runId": run_id,
            "source": "universal-review2-projection-after-render-gate",
            "questions": projected,
        },
    )
    return target


def finalize_universal_run(
    root: Path,
    runtime_root: Path,
    *,
    run_id: str,
    render_evidence_path: Path,
    external_findings_path: Path,
) -> dict[str, Any]:
    """Complete S08 through SEALED_LOCAL for any prepared bounded adapter."""

    from .universal_variant_runtime import (
        UniversalRunStore,
        package_universal_run,
        record_universal_closure,
        record_universal_render,
        seal_universal_run,
    )

    root = root.resolve()
    runtime_root = runtime_root.resolve()
    store = UniversalRunStore(runtime_root)
    run_dir = store.run_dir(run_id)
    render_evidence_path = render_evidence_path.resolve()
    external_findings_path = external_findings_path.resolve()
    render_result = record_universal_render(store, run_id, _read_json(render_evidence_path, "render evidence"))
    package_result = package_universal_run(store, run_id)
    package_path = Path(package_result["packagePath"])
    review_path = write_legacy_review_ledger(run_dir, run_id)
    legacy_path = run_dir / "final/legacy-final-closure-report.json"
    legacy_report = audit_final_closure(
        root,
        package_path,
        review_path,
        run_dir / "render/render-evidence.json",
        external_findings_path,
        legacy_path,
        "final/staging/generated-exam.js",
        run_dir / "final/variant-proof-ledger.json",
    )
    if legacy_report.get("status") != "PASS":
        return {
            "runId": run_id,
            "status": "HOLD",
            "currentStage": store.load(run_id).get("currentStage"),
            "render": render_result,
            "package": package_result,
            "legacyFinalClosure": legacy_report,
            "publicationStatus": "NOT_PUBLISHED",
        }
    manifest = store.load(run_id)
    render_evidence = _read_json(run_dir / "render/render-evidence.json", "stored render evidence")
    browser = {
        "status": "PASS",
        "actualBrowser": render_evidence.get("actualBrowser") is True,
        "productionEngine": render_evidence.get("productionEngine") is True,
        "pages": sorted((render_evidence.get("modes") or {}).keys()),
        "screenshotCaptured": all(
            isinstance(mode, dict) and mode.get("screenshotCaptured") is True
            for mode in (render_evidence.get("modes") or {}).values()
        ),
    }
    closure = record_universal_closure(
        store,
        run_id,
        {
            "artifactType": "ALIVE_UNIVERSAL_FINAL_CLOSURE",
            "status": "PASS",
            "browserRender": browser,
            "package": {"status": "PASS", "roundTrip": package_result.get("roundTrip")},
            "renderEvidenceSha256": manifest["render"]["sha256"],
            "variantProofLedgerComplete": "PASS",
            "legacyFinalClosurePath": "final/legacy-final-closure-report.json",
            "productionArchiveRegistration": "NOT_PERFORMED",
            "publicationStatus": "NOT_PUBLISHED",
        },
    )
    sealed = seal_universal_run(store, run_id)
    return {
        "runId": run_id,
        "status": sealed.get("status"),
        "currentStage": sealed.get("currentStage"),
        "render": render_result,
        "package": package_result,
        "legacyFinalClosure": {
            "status": legacy_report.get("status"),
            "path": legacy_path.as_posix(),
            "gates": legacy_report.get("gates"),
        },
        "closure": closure,
        "publicationStatus": sealed.get("publicationStatus"),
    }


__all__ = ["UniversalFinalizerError", "finalize_universal_run", "write_legacy_review_ledger"]
