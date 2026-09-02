from __future__ import annotations

"""Deterministic whole-exam operation checks for the High-1 unit lane.

This module does not generate model prose and does not publish Archive files.
It feeds the approved deterministic unit fixtures through the real staged
Run controller so that start, completion-marker resume, reconciliation,
assembly, render evidence, and packaging are exercised as one auditable
operation.
"""

import copy
import json
import shutil
from pathlib import Path
from typing import Any

from .fast_exam import _student_payload
from .high1_units import (
    ALL_UNIT_KEYS,
    _preview_answer,
    load_all_high1_fixtures,
    solve_high1_fixture,
)
from .high1_matrix import load_high1_matrix
from .run_store import atomic_write_json, sha256_file, utc_now
from .source_question import artifact_sha256
from .staged_exam import (
    StagedExamError,
    StagedRunStore,
    assemble_staged_exam,
    package_staged_exam,
    record_staged_render,
    reconcile_staged_run,
    start_staged_dispatch,
    start_staged_exam,
    mark_staged_task_complete,
)


OPERATION_SCHEMA_VERSION = "0.1.0"
OPERATION_ARTIFACT = "ALIVE_HIGH1_OPERATION_BENCHMARK"
OPERATION_SOURCE_DIR = Path("archive/exams/_generated/alive-high1-operation-inputs")
MAX_UNIT_ATTEMPTS = 2


class High1OperationError(ValueError):
    pass


def _unit_metadata(root: Path) -> dict[str, dict[str, Any]]:
    matrix = load_high1_matrix(root)
    return {item["unitKey"]: item for item in matrix["units"]}


def _slug(unit_key: str) -> str:
    return unit_key.lower().replace("_", "-")


def _course_label(unit_key: str) -> str:
    return "공통수학1" if unit_key.startswith("H22-C-") else "공통수학2"


def _source_question(
    fixture: dict[str, Any],
    result: dict[str, Any],
    ordinal: int,
    metadata: dict[str, Any],
) -> dict[str, Any]:
    detail = result["solutionDetail"]
    content = f"{detail['given']}<br>{detail['goal']} [3점]"
    answer = _preview_answer(fixture, result)
    unit_key = fixture["unitKey"]
    sub_unit = str(fixture.get("coverage") or metadata["label"])
    if fixture["unitKey"] == "H22-C2-03":
        sub_unit = {
            "circle_standard": "표준형과 일반형",
            "circle_line_relation": "원과 직선의 관계",
            "circle_tangent": "접선과 접점",
            "circle_circle_relation": "원과 원의 관계",
        }.get(fixture["kind"], sub_unit)
    return {
        "id": ordinal,
        "level": "중",
        "category": metadata["label"],
        "originalCategory": metadata["label"],
        "standardCourse": _course_label(unit_key),
        "standardUnitKey": unit_key,
        "standardUnit": metadata["label"],
        "standardUnitOrder": int(metadata["order"]),
        "subUnitKey": f"{unit_key}-{fixture['kind'].upper()}",
        "subUnit": sub_unit,
        "subUnitConfidence": "deterministic_fixture",
        "subUnitClassificationDepth": "complete_rule",
        "questionType": "주관식",
        "layoutTag": "grid",
        "tags": [metadata["label"], "ALIVE_OPERATION_FIXTURE"],
        "wide": False,
        "content": content,
        "choices": [],
        "answer": answer,
        "solution": "기준 풀이 원문은 생성 입력에서 숨긴다.",
    }


def _write_operation_source(
    root: Path,
    unit_key: str,
    fixtures: list[dict[str, Any]],
    results: list[dict[str, Any]],
    metadata: dict[str, Any],
) -> Path:
    source = root / OPERATION_SOURCE_DIR / f"{_slug(unit_key)}.js"
    source.parent.mkdir(parents=True, exist_ok=True)
    questions = [
        _source_question(fixture, result, ordinal, metadata)
        for ordinal, (fixture, result) in enumerate(zip(fixtures, results), 1)
    ]
    script = (
        "window.examTitle = "
        + json.dumps(f"ALIVE 고1 {unit_key} operation fixture", ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n"
    )
    source.write_text(script, encoding="utf-8", newline="\n")
    return source


def _draft_payload(
    manifest: dict[str, Any],
    task: dict[str, Any],
    source_questions: list[dict[str, Any]],
    fixtures: list[dict[str, Any]],
    results: list[dict[str, Any]],
) -> dict[str, Any]:
    questions: list[dict[str, Any]] = []
    for ordinal in task["ordinals"]:
        fixture = fixtures[ordinal - 1]
        result = results[ordinal - 1]
        answer = _preview_answer(fixture, result)
        item: dict[str, Any] = {
            "ordinal": ordinal,
            "studentPayload": _student_payload(source_questions[ordinal - 1]),
            "answerContract": {
                "answerType": "text",
                "canonicalAnswer": answer,
                "displayAnswer": answer,
                "acceptableAnswers": [],
                "equivalencePolicy": "normalized_string",
            },
            "solution": result["solution"],
            "solutionDetail": copy.deepcopy(result["solutionDetail"]),
            "transformationPlan": {
                "kind": "deterministic_fixture_replay",
                "unitKey": fixture["unitKey"],
                "caseId": fixture["caseId"],
                "fixtureClass": fixture.get("fixtureClass"),
                "variationMode": manifest["request"]["variationMode"],
            },
            "sourceFingerprint": {
                "caseId": fixture["caseId"],
                "coverage": fixture.get("coverage"),
            },
            "riskFlags": [],
        }
        if isinstance(result.get("solutionVisualSpec"), dict):
            item["solutionVisualSpec"] = copy.deepcopy(result["solutionVisualSpec"])
            item["solutionVisualPlan"] = {
                "source": "deterministic_high1_fixture",
                "caseId": fixture["caseId"],
            }
        questions.append(item)
    payload = {
        "artifactType": "ALIVE_STAGED_BATCH_DRAFT",
        "runId": manifest["runId"],
        "batchId": task["batchId"],
        "round": task["round"],
        "batchOrdinals": list(task["ordinals"]),
        "questions": questions,
    }
    payload["artifactSha256"] = artifact_sha256(payload)
    return payload


def _visual_check(asset: dict[str, Any]) -> dict[str, Any]:
    return {
        "verdict": "PASS",
        "assetSha256": asset["sha256"],
        "visualSpecSha256": asset["specSha256"],
        "checks": {
            "topology": "PASS",
            "semanticOwnership": "PASS",
            "labels": "PASS",
            "determinism": "PASS",
        },
    }


def _review_payload(
    manifest: dict[str, Any],
    task: dict[str, Any],
    candidate: dict[str, Any],
) -> dict[str, Any]:
    reviews: list[dict[str, Any]] = []
    for item in candidate["questions"]:
        solution_asset = item.get("solutionVisualAsset")
        solution_review: dict[str, Any] = {
            "verdict": "PASS",
            "studentCanFollow": True,
            "checks": {
                "readability": "PASS",
                "stepReasons": "PASS",
                "theoremJustification": "NOT_APPLICABLE",
                "answerCheck": "PASS",
                "diagramConsistency": "PASS" if isinstance(solution_asset, dict) else "NOT_APPLICABLE",
            },
            "findings": [],
        }
        if isinstance(solution_asset, dict):
            solution_review["visualCheck"] = _visual_check(solution_asset)
        reviews.append(
            {
                "ordinal": int(item["ordinal"]),
                "verdict": "PASS",
                "independentAnswer": {
                    "answerType": "text",
                    "canonicalAnswer": item["answerContract"]["canonicalAnswer"],
                },
                "checks": {
                    "mathematics": "PASS",
                    "responseForm": "PASS",
                    "solution": "PASS",
                },
                "findings": [],
                "solutionReview": solution_review,
            }
        )
    payload = {
        "artifactType": "ALIVE_STAGED_BATCH_REVIEW",
        "runId": manifest["runId"],
        "batchId": task["batchId"],
        "round": task["round"],
        "batchOrdinals": list(task["ordinals"]),
        "reviews": reviews,
    }
    payload["artifactSha256"] = artifact_sha256(payload)
    return payload


def _dispatch_write_resume(
    store: StagedRunStore,
    run_id: str,
    task_id: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    manifest = store.load(run_id)
    task = manifest["tasks"][task_id]
    start_staged_dispatch(
        store,
        run_id,
        task_id,
        f"local-fixture-{task_id}",
        route="local-deterministic-fixture",
    )
    run_dir = store.run_dir(run_id)
    output = run_dir / task["outputPath"]
    atomic_write_json(output, payload)
    before_marker = reconcile_staged_run(store, run_id)
    if before_marker["accepted"]:
        raise High1OperationError(f"{task_id} accepted before completion marker")
    mark_staged_task_complete(store, run_id, task_id)
    after_marker = reconcile_staged_run(store, run_id)
    if len(after_marker["accepted"]) != 1:
        raise High1OperationError(f"{task_id} did not accept after completion marker")
    return {
        "taskId": task_id,
        "resumeCheckpoint": "PASS",
        "acceptedBeforeCompletionMarker": len(before_marker["accepted"]),
        "acceptedAfterCompletionMarker": len(after_marker["accepted"]),
    }


def _drive_round(
    store: StagedRunStore,
    run_id: str,
    round_name: str,
    *,
    source_questions: list[dict[str, Any]],
    fixtures: list[dict[str, Any]],
    results: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    manifest = store.load(run_id)
    tasks = [
        copy.deepcopy(task)
        for task in manifest["tasks"].values()
        if task.get("round") == round_name and task.get("status") == "PENDING"
    ]
    if not tasks:
        raise High1OperationError(f"{run_id} has no pending {round_name} tasks")
    checkpoints: list[dict[str, Any]] = []
    for task in tasks:
        if round_name in {"round1", "revision"}:
            payload = _draft_payload(manifest, task, source_questions, fixtures, results)
        else:
            batch = manifest["batches"][task["batchId"]]
            accepted_path = (
                batch.get("revisionAcceptedPath")
                if round_name == "review2"
                else batch.get("round1AcceptedPath")
            )
            if not isinstance(accepted_path, str):
                raise High1OperationError(f"{task['taskId']} candidate path is missing")
            candidate = json.loads(
                (store.run_dir(run_id) / accepted_path).read_text(encoding="utf-8")
            )
            payload = _review_payload(manifest, task, candidate)
        checkpoints.append(_dispatch_write_resume(store, run_id, task["taskId"], payload))
        manifest = store.load(run_id)
    return checkpoints


def _run_one_unit(
    root: Path,
    output_root: Path,
    unit_key: str,
    fixtures: list[dict[str, Any]],
    metadata: dict[str, Any],
) -> dict[str, Any]:
    results = [solve_high1_fixture(fixture) for fixture in fixtures]
    source = _write_operation_source(root, unit_key, fixtures, results, metadata)
    runtime = output_root / "staged-runs"
    store = StagedRunStore(runtime)
    manifest = start_staged_exam(
        root,
        store,
        source.relative_to(root).as_posix(),
        f"ALIVE 고1 {unit_key} operation fixture 전체 유사",
        "high1-operation-benchmark",
        batch_count=2,
        variation_mode="STRUCTURAL_VARIANT",
    )
    if manifest["status"] != "ROUND1_GENERATING":
        raise High1OperationError(
            f"{unit_key} did not enter ROUND1_GENERATING: {manifest['status']} {manifest.get('codes')}"
        )
    run_id = manifest["runId"]
    source_questions = json.loads(
        (store.run_dir(run_id) / "source/source-exam.json").read_text(encoding="utf-8")
    )["questions"]
    checkpoints: dict[str, list[dict[str, Any]]] = {}
    checkpoints["round1"] = _drive_round(
        store,
        run_id,
        "round1",
        source_questions=source_questions,
        fixtures=fixtures,
        results=results,
    )
    checkpoints["review1"] = _drive_round(
        store,
        run_id,
        "review1",
        source_questions=source_questions,
        fixtures=fixtures,
        results=results,
    )
    manifest = store.load(run_id)
    if manifest["currentStage"] != "S05_REVIEW2":
        raise High1OperationError(
            f"{unit_key} did not reach review2: {manifest['currentStage']}"
        )
    checkpoints["review2"] = _drive_round(
        store,
        run_id,
        "review2",
        source_questions=source_questions,
        fixtures=fixtures,
        results=results,
    )
    manifest = store.load(run_id)
    if manifest["status"] != "READY_FOR_ASSEMBLY":
        raise High1OperationError(
            f"{unit_key} did not reach assembly: {manifest['status']} {manifest.get('codes')}"
        )
    assemble_staged_exam(root, store, run_id, f"ALIVE 고1 {unit_key} operation fixture")
    manifest = store.load(run_id)
    if manifest["status"] != "READY_FOR_MANUAL_REVIEW":
        raise High1OperationError(f"{unit_key} assembly status is {manifest['status']}")
    render_script = output_root / "render-scripts" / f"{_slug(unit_key)}.js"
    render_script.parent.mkdir(parents=True, exist_ok=True)
    source_script = store.run_dir(run_id) / "final/staging/generated-exam.js"
    shutil.copyfile(source_script, render_script)
    if sha256_file(source_script) != sha256_file(render_script):
        raise High1OperationError(f"{unit_key} render script hash mismatch")
    return {
        "unitKey": unit_key,
        "label": metadata["label"],
        "fixtureCount": len(fixtures),
        "runId": run_id,
        "sourcePath": source.relative_to(root).as_posix(),
        "status": "READY_FOR_BROWSER_RENDER",
        "currentStage": manifest["currentStage"],
        "checkpointCounts": {name: len(items) for name, items in checkpoints.items()},
        "resumeCheckpoints": checkpoints,
        "assembly": {
            "status": "PASS",
            "structuredExamSha256": manifest["assembly"]["structuredExamSha256"],
            "semanticRoundTrip": manifest["assembly"]["semanticRoundTrip"],
            "publicationStatus": "NOT_PUBLISHED",
        },
        "renderScriptPath": render_script.relative_to(root).as_posix(),
        "renderScriptSha256": sha256_file(render_script),
        "browserRender": "NOT_RUN",
        "package": "NOT_RUN",
        "publicationStatus": "NOT_PUBLISHED",
    }


def run_high1_operation_benchmark(
    root: Path,
    output_root: Path,
) -> dict[str, Any]:
    root = root.resolve()
    output_root = output_root.resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    metadata_by_unit = _unit_metadata(root)
    fixtures_by_unit: dict[str, list[dict[str, Any]]] = {
        unit: [
            fixture
            for fixture in load_all_high1_fixtures(root)
            if fixture.get("unitKey") == unit
        ]
        for unit in ALL_UNIT_KEYS
    }
    units: list[dict[str, Any]] = []
    for unit_key in ALL_UNIT_KEYS:
        fixtures = fixtures_by_unit[unit_key]
        if len(fixtures) < 3:
            units.append(
                {
                    "unitKey": unit_key,
                    "status": "HOLD",
                    "reason": "minimum fixture count is not met",
                    "browserRender": "NOT_RUN",
                    "package": "NOT_RUN",
                    "publicationStatus": "NOT_PUBLISHED",
                }
            )
            continue
        retry_reasons: list[str] = []
        for attempt in range(1, MAX_UNIT_ATTEMPTS + 1):
            try:
                completed = _run_one_unit(
                    root,
                    output_root,
                    unit_key,
                    fixtures,
                    metadata_by_unit[unit_key],
                )
                completed["attempts"] = attempt
                completed["retryCount"] = attempt - 1
                completed["retryReasons"] = retry_reasons
                units.append(completed)
                break
            except (High1OperationError, StagedExamError, OSError, ValueError, json.JSONDecodeError) as error:
                retry_reasons.append(str(error))
                if attempt == MAX_UNIT_ATTEMPTS:
                    units.append(
                        {
                            "unitKey": unit_key,
                            "status": "HOLD",
                            "reason": str(error),
                            "attempts": attempt,
                            "retryCount": attempt - 1,
                            "retryReasons": retry_reasons,
                            "browserRender": "NOT_RUN",
                            "package": "NOT_RUN",
                            "publicationStatus": "NOT_PUBLISHED",
                        }
                    )
    all_ready = all(unit.get("status") == "READY_FOR_BROWSER_RENDER" for unit in units)
    summary = {
        "schemaVersion": OPERATION_SCHEMA_VERSION,
        "artifactType": OPERATION_ARTIFACT,
        "mode": "STAGED_WHOLE_EXAM_OPERATION_ROUND_TRIP",
        "createdAt": utc_now(),
        "canonicalUnitCount": len(ALL_UNIT_KEYS),
        "units": units,
        "start": "PASS" if all_ready else "HOLD",
        "resume": "PASS" if all_ready else "HOLD",
        "assembly": "PASS" if all_ready else "HOLD",
        "browserRender": "NOT_RUN",
        "package": "NOT_RUN",
        "overallStatus": "READY_FOR_BROWSER_RENDER" if all_ready else "HOLD",
        "productionPromotion": "NOT_PROMOTED",
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(output_root / "summary.json", summary)
    return summary


def _load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise High1OperationError(f"invalid JSON: {path}") from error
    if not isinstance(value, dict):
        raise High1OperationError(f"JSON root must be an object: {path}")
    return value


def record_high1_operation_render_evidence(
    root: Path,
    output_root: Path,
    evidence_path: Path,
) -> dict[str, Any]:
    root = root.resolve()
    output_root = output_root.resolve()
    summary_path = output_root / "summary.json"
    summary = _load_json(summary_path)
    evidence = _load_json(evidence_path.resolve())
    by_unit = {
        str(item.get("unitKey")): item
        for item in evidence.get("units", [])
        if isinstance(item, dict)
    }
    if set(by_unit) != set(ALL_UNIT_KEYS):
        raise High1OperationError("render evidence must cover all 18 canonical units")
    store = StagedRunStore(output_root / "staged-runs")
    updated_units: list[dict[str, Any]] = []
    for unit in summary.get("units", []):
        unit_key = unit.get("unitKey")
        if unit_key not in ALL_UNIT_KEYS or unit.get("status") != "READY_FOR_BROWSER_RENDER":
            updated_units.append(unit)
            continue
        unit_evidence = by_unit[unit_key]
        run_id = unit.get("runId")
        if not isinstance(run_id, str):
            raise High1OperationError(f"{unit_key} runId is missing")
        run_dir = store.run_dir(run_id)
        input_path = run_dir / "render/browser-evidence-input.json"
        atomic_write_json(input_path, unit_evidence)
        rendered = record_staged_render(store, run_id, input_path)
        packaged = package_staged_exam(store, run_id)
        updated = copy.deepcopy(unit)
        updated["browserRender"] = "PASS"
        updated["package"] = "PASS"
        updated["status"] = packaged["status"]
        updated["currentStage"] = packaged["currentStage"]
        updated["renderEvidenceSha256"] = rendered["render"]["evidenceSha256"]
        updated["packageSha256"] = packaged["package"]["zipSha256"]
        updated["packageRoundTrip"] = packaged["package"]["roundTrip"]
        updated_units.append(updated)
    all_pass = all(
        unit.get("status") == "RENDERED_PACKAGED"
        and unit.get("browserRender") == "PASS"
        and unit.get("package") == "PASS"
        for unit in updated_units
    )
    result = {
        **summary,
        "updatedAt": utc_now(),
        "units": updated_units,
        "browserEvidenceSource": evidence_path.resolve().relative_to(root).as_posix()
        if evidence_path.resolve().is_relative_to(root)
        else str(evidence_path.resolve()),
        "browserRender": "PASS" if all_pass else "HOLD",
        "package": "PASS" if all_pass else "HOLD",
        "overallStatus": "PASS_RENDERED_PACKAGED" if all_pass else "HOLD",
        "productionPromotion": "NOT_PROMOTED",
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(summary_path, result)
    return result


__all__ = [
    "High1OperationError",
    "OPERATION_ARTIFACT",
    "OPERATION_SCHEMA_VERSION",
    "record_high1_operation_render_evidence",
    "run_high1_operation_benchmark",
]
