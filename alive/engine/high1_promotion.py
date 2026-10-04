from __future__ import annotations

"""Evidence-gated promotion for the canonical High-1 ALIVE unit lane.

The promotion command is deliberately fail-closed.  It reads the deterministic
unit benchmark, the completed staged whole-exam operation, and the browser
evidence that was recorded by the real Archive engine.  Only after all 18
units pass does it update the design matrix to ``ACTIVE_PRODUCTION``.  It
never copies a generated exam into the production Archive or question index.
"""

import copy
import json
from pathlib import Path
from typing import Any

from .high1_matrix import (
    EXPECTED_UNIT_KEYS,
    MATRIX_RELATIVE_PATH,
    _validate_matrix,
    load_high1_matrix,
)
from .run_store import atomic_write_json, sha256_file, utc_now
from .staged_exam import StagedRunStore


PROMOTION_SCHEMA_VERSION = "0.1.0"
PROMOTION_ARTIFACT = "ALIVE_HIGH1_FINAL_PROMOTION_REPORT"
REQUIRED_FIXTURE_CLASSES = {
    "ordinary",
    "boundary_or_degenerate",
    "composite_or_exam_like",
}
REQUIRED_ROUNDS = ("round1", "review1", "review2")


class High1PromotionError(ValueError):
    pass


def _read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise High1PromotionError(f"invalid JSON evidence: {path}") from error
    if not isinstance(value, dict):
        raise High1PromotionError(f"JSON evidence must be an object: {path}")
    return value


def _relative(root: Path, path: Path) -> str:
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return str(path.resolve())


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise High1PromotionError(message)


def _audit_unit_benchmark(root: Path, path: Path) -> dict[str, Any]:
    report = _read_json(path)
    _require(report.get("artifactType") == "ALIVE_HIGH1_UNIT_BENCHMARK_REPORT", "unit benchmark artifact type is invalid")
    _require(report.get("canonicalUnitCount") == 18, "unit benchmark does not cover 18 canonical units")
    _require(int(report.get("fixtureCount", 0)) >= 54, "unit benchmark has fewer than three fixtures per unit")
    _require(int(report.get("repetitions", 0)) >= 3, "unit benchmark needs at least three repetitions")
    for field in ("canonicalMapping", "mathematicalValidation", "solutionValidation", "independentReview"):
        _require(report.get(field) == "PASS", f"unit benchmark {field} is not PASS")
    _require(report.get("determinism", {}).get("status") == "PASS", "unit benchmark determinism is not PASS")
    units = report.get("units")
    _require(isinstance(units, dict), "unit benchmark unit reports are missing")
    _require(set(units) == set(EXPECTED_UNIT_KEYS), "unit benchmark unit set is not canonical")
    for unit_key in EXPECTED_UNIT_KEYS:
        unit = units[unit_key]
        _require(unit.get("status") == "PASS_STRUCTURAL", f"{unit_key} structural benchmark is not PASS")
        _require(int(unit.get("fixtureCount", 0)) >= 3, f"{unit_key} has fewer than three fixtures")
        classes = set(unit.get("fixtureClasses", []))
        _require(REQUIRED_FIXTURE_CLASSES.issubset(classes), f"{unit_key} is missing a required fixture class")
    return {
        "status": "PASS",
        "path": _relative(root, path),
        "sha256": sha256_file(path),
        "unitCount": report["canonicalUnitCount"],
        "fixtureCount": report["fixtureCount"],
        "repetitions": report["repetitions"],
        "visualValidation": report.get("visualValidation"),
    }


def _audit_operation(root: Path, operation_root: Path) -> dict[str, Any]:
    summary_path = operation_root / "summary.json"
    summary = _read_json(summary_path)
    _require(summary.get("artifactType") == "ALIVE_HIGH1_OPERATION_BENCHMARK", "operation artifact type is invalid")
    for field in ("start", "resume", "assembly", "browserRender", "package"):
        _require(summary.get(field) == "PASS", f"operation {field} is not PASS")
    _require(summary.get("overallStatus") == "PASS_RENDERED_PACKAGED", "whole-exam operation is not fully packaged")
    units = summary.get("units")
    _require(isinstance(units, list), "operation unit reports are missing")
    by_unit = {item.get("unitKey"): item for item in units if isinstance(item, dict)}
    _require(set(by_unit) == set(EXPECTED_UNIT_KEYS), "operation unit set is not canonical")
    store = StagedRunStore(operation_root / "staged-runs")
    package_count = 0
    checkpoint_count = 0
    operation_units: dict[str, dict[str, Any]] = {}
    for unit_key in EXPECTED_UNIT_KEYS:
        item = by_unit[unit_key]
        _require(item.get("status") == "RENDERED_PACKAGED", f"{unit_key} operation is not RENDERED_PACKAGED")
        _require(item.get("currentStage") == "S09_PACKAGE", f"{unit_key} operation stage is not S09_PACKAGE")
        _require(item.get("browserRender") == "PASS", f"{unit_key} browser gate is not PASS")
        _require(item.get("package") == "PASS", f"{unit_key} package gate is not PASS")
        _require(item.get("packageRoundTrip") == "PASS", f"{unit_key} package round-trip is not PASS")
        _require(item.get("publicationStatus") == "NOT_PUBLISHED", f"{unit_key} publication status is not closed")
        _require(str(item.get("sourcePath", "")).startswith("archive/exams/_generated/"), f"{unit_key} source escaped staging-only path")
        _require(str(item.get("renderScriptPath", "")).startswith("alive/runtime/high1-operation-benchmarks/"), f"{unit_key} render script escaped runtime path")
        for round_name in REQUIRED_ROUNDS:
            checkpoints = item.get("resumeCheckpoints", {}).get(round_name, [])
            _require(len(checkpoints) == 2, f"{unit_key} {round_name} does not contain two checkpointed batches")
            for checkpoint in checkpoints:
                _require(checkpoint.get("resumeCheckpoint") == "PASS", f"{unit_key} {round_name} resume checkpoint failed")
                _require(checkpoint.get("acceptedBeforeCompletionMarker") == 0, f"{unit_key} accepted before completion marker")
                _require(checkpoint.get("acceptedAfterCompletionMarker") == 1, f"{unit_key} did not accept after completion marker")
                checkpoint_count += 1
        run_id = item.get("runId")
        _require(isinstance(run_id, str) and run_id, f"{unit_key} operation run id is missing")
        manifest = store.load(run_id)
        _require(manifest.get("status") == "RENDERED_PACKAGED", f"{unit_key} manifest is not RENDERED_PACKAGED")
        _require(manifest.get("currentStage") == "S09_PACKAGE", f"{unit_key} manifest stage is not S09_PACKAGE")
        package = manifest.get("package", {})
        _require(package.get("roundTrip") == "PASS", f"{unit_key} manifest package round-trip failed")
        _require(package.get("publicationStatus") == "NOT_PUBLISHED", f"{unit_key} package publication status is not closed")
        package_path = store.run_dir(run_id) / "final/alive-staged-exam-pack.zip"
        _require(package_path.is_file(), f"{unit_key} package file is missing")
        _require(item.get("packageSha256") == sha256_file(package_path), f"{unit_key} package hash mismatch")
        package_count += 1
        operation_units[unit_key] = {
            "runId": run_id,
            "questionCount": int(manifest["request"]["expectedQuestionCount"]),
            "requiredSolutionVisualOrdinals": list(manifest.get("motherFinal", {}).get("solutionVisualRequiredOrdinals", [])),
            "packageSha256": item["packageSha256"],
        }
    index_path = root / "archive/question-index.js"
    if index_path.is_file():
        index_text = index_path.read_text(encoding="utf-8", errors="replace")
        _require("alive-high1-operation" not in index_text, "staging operation input was registered in production question-index")
    return {
        "status": "PASS",
        "path": _relative(root, summary_path),
        "sha256": sha256_file(summary_path),
        "unitCount": len(units),
        "checkpointCount": checkpoint_count,
        "packageCount": package_count,
        "units": operation_units,
        "publicationStatus": "NOT_PUBLISHED",
    }


def _audit_browser_evidence(
    root: Path,
    path: Path,
    operation: dict[str, Any],
) -> dict[str, Any]:
    evidence = _read_json(path)
    units = evidence.get("units")
    _require(isinstance(units, list), "browser evidence units are missing")
    by_unit = {item.get("unitKey"): item for item in units if isinstance(item, dict)}
    _require(set(by_unit) == set(EXPECTED_UNIT_KEYS), "browser evidence does not cover all 18 units")
    mode_count = 0
    screenshot_count = 0
    required_visual_count = 0
    for unit_key in EXPECTED_UNIT_KEYS:
        item = by_unit[unit_key]
        _require(item.get("actualBrowser") is True, f"{unit_key} was not checked in an actual browser")
        _require(item.get("productionEngine") is True, f"{unit_key} was not checked in the production Archive engine")
        modes = item.get("modes")
        _require(isinstance(modes, dict) and set(modes) == {"exam", "solution", "answer"}, f"{unit_key} browser modes are incomplete")
        expected = operation["units"][unit_key]
        for mode_name, result in modes.items():
            _require(isinstance(result, dict), f"{unit_key} {mode_name} evidence is invalid")
            for field, expected_value in (("verdict", "PASS"), ("ready", True), ("renderError", None), ("lastQuestion", expected["questionCount"]), ("lastPageChecked", True), ("unrenderedMath", 0), ("overflowCount", 0), ("badImages", [])):
                _require(result.get(field) == expected_value, f"{unit_key} {mode_name} browser field {field} failed")
            _require(result.get("screenshotCaptured") is True and int(result.get("screenshotBytes", 0)) > 0, f"{unit_key} {mode_name} screenshot is missing")
            mode_count += 1
            screenshot_count += 1
        coverage = modes["solution"].get("solutionVisualCoverage")
        _require(isinstance(coverage, dict), f"{unit_key} solution visual coverage is missing")
        required = expected["requiredSolutionVisualOrdinals"]
        _require(coverage.get("requiredOrdinals") == required, f"{unit_key} required solution visual ordinals mismatch")
        _require(coverage.get("renderedOrdinals") == required, f"{unit_key} required solution visual render is incomplete")
        _require(coverage.get("missingOrdinals") == [] and coverage.get("verdict") == "PASS", f"{unit_key} solution visual gate failed")
        required_visual_count += len(required)
    return {
        "status": "PASS",
        "path": _relative(root, path),
        "sha256": sha256_file(path),
        "unitCount": len(units),
        "modeCount": mode_count,
        "screenshotCount": screenshot_count,
        "requiredSolutionVisualCount": required_visual_count,
    }


def audit_high1_promotion(
    root: Path,
    unit_benchmark_path: Path,
    operation_root: Path,
    browser_evidence_path: Path,
) -> dict[str, Any]:
    root = root.resolve()
    matrix = load_high1_matrix(root)
    unit_benchmark = _audit_unit_benchmark(root, unit_benchmark_path.resolve())
    operation = _audit_operation(root, operation_root.resolve())
    browser = _audit_browser_evidence(root, browser_evidence_path.resolve(), operation)
    return {
        "schemaVersion": PROMOTION_SCHEMA_VERSION,
        "artifactType": PROMOTION_ARTIFACT,
        "status": "PASS",
        "matrixStatusBeforePromotion": matrix["status"],
        "canonicalUnitCount": len(EXPECTED_UNIT_KEYS),
        "unitBenchmark": unit_benchmark,
        "operation": operation,
        "browser": browser,
        "productionArchiveRegistration": "NOT_PERFORMED",
        "publicationStatus": "NOT_PUBLISHED",
    }


def finalize_high1_promotion(
    root: Path,
    unit_benchmark_path: Path,
    operation_root: Path,
    browser_evidence_path: Path,
    report_path: Path,
) -> dict[str, Any]:
    root = root.resolve()
    audit = audit_high1_promotion(root, unit_benchmark_path, operation_root, browser_evidence_path)
    matrix = load_high1_matrix(root)
    promoted = copy.deepcopy(matrix)
    promoted["status"] = "ACTIVE_PRODUCTION"
    promoted.setdefault("firstVerticalSlice", {})["status"] = "COMPLETE"
    evidence_paths = {
        "unitBenchmark": _relative(root, unit_benchmark_path.resolve()),
        "operation": _relative(root, operation_root.resolve() / "summary.json"),
        "browser": _relative(root, browser_evidence_path.resolve()),
    }
    operation_units = audit["operation"]["units"]
    for unit in promoted["units"]:
        unit_key = unit["unitKey"]
        unit["promotionState"] = "ACTIVE_UNIT"
        unit["promotionEvidence"] = {
            "status": "PASS",
            "operationRunId": operation_units[unit_key]["runId"],
            "packageSha256": operation_units[unit_key]["packageSha256"],
            "evidence": evidence_paths,
        }
    report_path = report_path.resolve()
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report = {
        **audit,
        "status": "PASS_ACTIVE_PRODUCTION",
        "matrixStatusAfterPromotion": "ACTIVE_PRODUCTION",
        "unitPromotionState": "ACTIVE_UNIT",
        "activatedAt": utc_now(),
        "evidence": evidence_paths,
        "unitPromotionCount": len(promoted["units"]),
        "productionArchiveRegistration": "NOT_PERFORMED",
        "publicationStatus": "NOT_PUBLISHED",
    }
    current_evidence = copy.deepcopy(promoted.get("currentEvidence", {}))
    current_evidence.update(
        {
            "stagedEngineVersion": "0.1.7-high1-official-promotion",
            "benchmarkStatus": "PASS",
            "productionPromotion": "ACTIVE_PRODUCTION",
            "high1OfficialPromotionReport": _relative(root, report_path),
            "high1UnitBenchmark": {
                "command": "high1-benchmark",
                "fixtureCount": audit["unitBenchmark"]["fixtureCount"],
                "unitCount": 18,
                "status": "PASS_STRUCTURAL",
                "mathValidation": "PASS",
                "solutionValidation": "PASS",
                "independentReview": "PASS",
                "determinism": "PASS",
                "visualValidation": audit["unitBenchmark"]["visualValidation"],
                "browserRender": "PASS",
                "operation": "PASS_RENDERED_PACKAGED",
                "productionPromotion": "ACTIVE_PRODUCTION",
            },
            "high1Operation": {
                "summary": evidence_paths["operation"],
                "status": "PASS_RENDERED_PACKAGED",
                "unitCount": 18,
                "checkpointCount": audit["operation"]["checkpointCount"],
                "packageCount": audit["operation"]["packageCount"],
                "browserRender": "PASS",
                "package": "PASS",
                "publicationStatus": "NOT_PUBLISHED",
            },
            "high1BrowserRender": {
                "evidence": evidence_paths["browser"],
                "status": "PASS",
                "unitCount": audit["browser"]["unitCount"],
                "modeCount": audit["browser"]["modeCount"],
                "screenshotCount": audit["browser"]["screenshotCount"],
                "requiredSolutionVisualCount": audit["browser"]["requiredSolutionVisualCount"],
            },
            "note": "All 18 bounded High-1 unit contracts passed the structural, independent, actual-browser, whole-exam resume, assembly, and package gates. Generated operation fixtures remain staging-only.",
        }
    )
    promoted["currentEvidence"] = current_evidence
    promoted["promotion"] = {
        "status": "ACTIVE_PRODUCTION",
        "activatedAt": report["activatedAt"],
        "unitState": "ACTIVE_UNIT",
        "unitCount": 18,
        "gate": "PASS",
        "report": _relative(root, report_path),
        "productionArchiveRegistration": "NOT_PERFORMED",
        "publicationStatus": "NOT_PUBLISHED",
    }
    _validate_matrix(promoted, root)
    atomic_write_json(root / MATRIX_RELATIVE_PATH, promoted)
    validated = load_high1_matrix(root)
    report["matrixSha256"] = sha256_file(root / MATRIX_RELATIVE_PATH)
    report["validatedStatus"] = validated["status"]
    atomic_write_json(report_path, report)
    return report


__all__ = [
    "High1PromotionError",
    "PROMOTION_ARTIFACT",
    "PROMOTION_SCHEMA_VERSION",
    "audit_high1_promotion",
    "finalize_high1_promotion",
]
