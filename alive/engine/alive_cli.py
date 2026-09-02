from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import ENGINE_VERSION
from .contracts import FOLLOWUP_KINDS, GENERATION_MODES, OPERATION_MODES, OUTPUT_PROFILES, STAGES, initial_stages
from .run_store import RunStore, atomic_write_json, make_run_id, sha256_file, utc_now
from .source_resolver import resolve_explicit_source, resolve_source
from .task_runtime import (
    all_current_tasks_submitted,
    fail_task_dispatch,
    persist_task_packet,
    prepare_stage_tasks,
    start_task_dispatch,
    submit_task_artifact,
)


def repository_root() -> Path:
    return Path(__file__).resolve().parents[2]


def runtime_root(root: Path, override: str | None) -> Path:
    return Path(override).resolve() if override else root / "alive" / "runtime" / "runs"


def fast_runtime_root_path(root: Path, override: str | None) -> Path:
    from .fast_exam import fast_runtime_root

    return fast_runtime_root(root, override)


def staged_runtime_root_path(root: Path, override: str | None) -> Path:
    from .staged_exam import staged_runtime_root

    return staged_runtime_root(root, override)


def adaptive_runtime_root_path(root: Path, override: str | None) -> Path:
    from .adaptive_staged_exam import adaptive_runtime_root

    return adaptive_runtime_root(root, override)


def emit(payload: Any, as_json: bool = False) -> None:
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return
    if isinstance(payload, dict):
        for key, value in payload.items():
            rendered = json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else value
            print(f"{key}: {rendered}")
    else:
        print(payload)


def _optional_path_arg(args: argparse.Namespace, name: str) -> Path | None:
    value = getattr(args, name, None)
    return Path(value).resolve() if value else None


def _finalize_packaged_run(runtime_root: Path, args: argparse.Namespace, manifest: dict[str, Any]) -> dict[str, Any]:
    """Promote a package result unless the caller explicitly keeps the workdir."""

    if getattr(args, "keep_workdir", False):
        return {"runId": manifest["runId"], "status": "WORKDIR_RETAINED"}
    from .runtime_lifecycle import finalize_run

    return finalize_run(
        runtime_root,
        manifest["runId"],
        result_root=_optional_path_arg(args, "result_root"),
        quarantine_root=_optional_path_arg(args, "quarantine_root"),
    )


def _lifecycle_runtime_root(args: argparse.Namespace) -> Path:
    root = repository_root()
    if args.runtime_root:
        return Path(args.runtime_root).resolve()
    roots = {
        "legacy": runtime_root(root, None),
        "fast": fast_runtime_root_path(root, None),
        "staged": staged_runtime_root_path(root, None),
        "adaptive": adaptive_runtime_root_path(root, None),
    }
    return roots[args.runtime_kind]


def command_runtime_finalize(args: argparse.Namespace) -> int:
    from .runtime_lifecycle import finalize_run

    result = finalize_run(
        _lifecycle_runtime_root(args),
        args.run,
        result_root=_optional_path_arg(args, "result_root"),
        quarantine_root=_optional_path_arg(args, "quarantine_root"),
        allow_blocked=args.allow_blocked,
        move_workdir=not args.keep_workdir,
    )
    emit(result, args.json)
    return 0


def command_runtime_gc(args: argparse.Namespace) -> int:
    from .runtime_lifecycle import runtime_gc

    result = runtime_gc(
        repository_root(),
        runtime_root=Path(args.runtime_root).resolve() if args.runtime_root else None,
        result_root=_optional_path_arg(args, "result_root"),
        quarantine_root=_optional_path_arg(args, "quarantine_root"),
        older_than_hours=args.older_than_hours,
        apply=args.apply,
        include_blocked=args.include_blocked,
    )
    emit(result, args.json)
    return 0


def set_stage(manifest: dict[str, Any], stage_id: str, status: str, evidence: str | None = None) -> None:
    stage = next(item for item in manifest["stages"] if item["stageId"] == stage_id)
    stage["status"] = status
    if evidence:
        stage["evidence"].append(evidence)


def capability_issues(args: argparse.Namespace) -> list[str]:
    issues: list[str] = []
    if args.mode != "EXAM_FOLLOWUP":
        issues.append(f"generationMode={args.mode}")
    if args.mode == "EXAM_FOLLOWUP" and args.followup_kind != "CONFIRMATION":
        issues.append(f"followupKind={args.followup_kind}")
    if args.operation_mode not in {"GENERATE", "REVIEW_ONLY"}:
        issues.append(f"operationMode={args.operation_mode}")
    if args.output_profile not in {"REVIEW_TEXT", "JS_ARCHIVE"}:
        issues.append(f"outputProfile={args.output_profile}")
    return issues


def source_lock(root: Path, resolution: dict[str, Any]) -> dict[str, Any]:
    selected = resolution["selected"]
    path = root / selected["path"]
    return {
        "path": selected["path"],
        "sha256": sha256_file(path),
        "bytes": path.stat().st_size,
        "questionOrdinal": resolution.get("questionOrdinal"),
        "qKey": selected.get("qKey"),
        "resolvedBy": "question-index" if selected.get("sourceFile") else "explicit-path",
    }


def build_manifest(args: argparse.Namespace, resolution: dict[str, Any]) -> dict[str, Any]:
    now = utc_now()
    manifest: dict[str, Any] = {
        "schemaVersion": "0.1.0",
        "engineVersion": ENGINE_VERSION,
        "runId": make_run_id(args.query or args.source_file or "alive"),
        "createdAt": now,
        "updatedAt": now,
        "status": "PENDING",
        "currentStage": "R00_REQUEST_NORMALIZE",
        "codes": [],
        "request": {
            "query": args.query,
            "sourceFile": args.source_file,
            "questionOrdinal": args.question,
            "generationMode": args.mode,
            "followupKind": args.followup_kind if args.mode == "EXAM_FOLLOWUP" else None,
            "operationMode": args.operation_mode,
            "outputProfile": args.output_profile,
            "expectedQuestionCount": 1,
            "visualDependency": "NONE",
        },
        "sourceResolution": resolution,
        "sourceLock": None,
        "stages": initial_stages(),
        "events": [],
    }
    set_stage(manifest, "R00_REQUEST_NORMALIZE", "PASS", "request normalized")
    issues = capability_issues(args)
    if issues:
        set_stage(manifest, "R00A_CAPABILITY_PRECHECK", "BLOCKED", ", ".join(issues))
        manifest["status"] = "BLOCKED"
        manifest["currentStage"] = "R00A_CAPABILITY_PRECHECK"
        manifest["codes"].append("CAPABILITY_PRECHECK_FAIL")
        return manifest
    set_stage(manifest, "R00A_CAPABILITY_PRECHECK", "PASS", "V0.1 capability supported")
    if resolution["status"] == "UNIQUE":
        set_stage(manifest, "R01_SOURCE_RESOLVE", "PASS", "unique source selected")
        manifest["currentStage"] = "R02_SOURCE_LOCK"
    else:
        code = "SOURCE_AMBIGUOUS" if resolution["status"] == "AMBIGUOUS" else "SOURCE_NOT_FOUND"
        set_stage(manifest, "R01_SOURCE_RESOLVE", "BLOCKED", code)
        manifest["status"] = "BLOCKED"
        manifest["currentStage"] = "R01_SOURCE_RESOLVE"
        manifest["codes"].append(code)
    return manifest


def finalize_source_lock(root: Path, manifest: dict[str, Any]) -> None:
    manifest["sourceLock"] = source_lock(root, manifest["sourceResolution"])
    set_stage(manifest, "R02_SOURCE_LOCK", "PASS", manifest["sourceLock"]["sha256"])
    manifest["status"] = "READY_FOR_ORCHESTRATION"
    manifest["currentStage"] = "R03_SOURCE_ANALYSIS"


def command_doctor(args: argparse.Namespace) -> int:
    root = repository_root()
    from .fast_exam import fast_capability_report
    from .high1_matrix import High1MatrixError, load_high1_matrix, summarize_high1_matrix
    from .rule_pack import load_rule_pack
    from .staged_exam import staged_capability_report

    rule_pack = load_rule_pack(root)
    try:
        high1_matrix = load_high1_matrix(root)
        high1_matrix_check: dict[str, Any] = {
            "status": "READY",
            "path": str(root / "alive" / "05_DESIGN" / "ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json"),
            "summary": summarize_high1_matrix(high1_matrix),
        }
        high1_matrix_ready = True
    except High1MatrixError as error:
        high1_matrix_check = {"status": "INVALID", "error": str(error)}
        high1_matrix_ready = False
    checks = {
        "repositoryRoot": str(root),
        "questionIndex": (root / "archive" / "question-index.js").is_file(),
        "masterRulebook": (root / "alive" / "01_CANONICAL" / "ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md").is_file(),
        "implementationPlan": (root / "alive" / "05_DESIGN" / "ALIVE_FAST_EXAM_SKILL_REDESIGN_PLAN_v0.13.md").is_file(),
        "strictImplementationPlan": (root / "alive" / "05_DESIGN" / "ALIVE_CODEX_MULTI_AGENT_PIPELINE_IMPLEMENTATION_PLAN_v0.12.md").is_file(),
        "high1PromotionMatrix": high1_matrix_check,
        "runtimeRoot": str(runtime_root(root, args.runtime_root)),
        "engineVersion": ENGINE_VERSION,
        "fastExam": fast_capability_report(),
        "stagedExam": staged_capability_report(),
        "rulePack": {
            "status": rule_pack.get("status"),
            "required": rule_pack.get("required"),
            "snapshotSha256": rule_pack.get("snapshotSha256"),
            "codes": rule_pack.get("codes", []),
            "fileCount": len(rule_pack.get("files", [])),
            "compiledMaster": rule_pack.get("compiledMaster"),
        },
    }
    checks["ok"] = all(
        checks[key] for key in ("questionIndex", "masterRulebook", "implementationPlan", "strictImplementationPlan")
    ) and rule_pack.get("status") == "READY"
    checks["ok"] = checks["ok"] and high1_matrix_ready
    emit(checks, args.json)
    return 0 if checks["ok"] else 1


def command_high1_matrix(args: argparse.Namespace) -> int:
    from .high1_matrix import load_high1_matrix, summarize_high1_matrix

    matrix = load_high1_matrix(repository_root())
    emit({"matrix": matrix, "summary": summarize_high1_matrix(matrix)}, args.json)
    return 0


def command_rule_pack_inspect(args: argparse.Namespace) -> int:
    from .rule_pack import load_rule_pack

    snapshot = load_rule_pack(repository_root())
    emit(snapshot, args.json)
    return 0 if snapshot.get("status") == "READY" else 2


def _read_json_object(path: str) -> dict[str, Any]:
    value = json.loads(Path(path).resolve().read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"JSON object required: {path}")
    return value


def _read_json_value(path: str) -> Any:
    return json.loads(Path(path).resolve().read_text(encoding="utf-8"))


def command_universal_ir_validate(args: argparse.Namespace) -> int:
    from .universal_ir import validate_universal_question_ir

    report = validate_universal_question_ir(_read_json_object(args.input))
    emit(report, args.json)
    return 0 if report["status"] == "PASS" else 2


def command_variant_proof_validate(args: argparse.Namespace) -> int:
    from .variant_proof import validate_variant_proof_sidecar

    report = validate_variant_proof_sidecar(_read_json_object(args.input))
    emit(report, args.json)
    return 0 if report["status"] == "PASS" else 2


def command_variant_proof_reduce(args: argparse.Namespace) -> int:
    from .variant_proof import reduce_variant_class

    sidecar = _read_json_object(args.input)
    evidence_catalog = set(args.evidence_ref or []) if args.evidence_ref is not None else None
    result = reduce_variant_class(sidecar, evidence_catalog=evidence_catalog)
    emit(result, args.json)
    return 0 if result["status"] == "PASS" else 2


def command_family_capability(args: argparse.Namespace) -> int:
    from .structure_families import default_structure_family_registry

    registry = default_structure_family_registry()
    if args.family:
        result = registry.capability(args.family, args.transform)
    else:
        result = {
            "status": "PASS",
            "capabilities": registry.capability_report([args.transform]),
        }
    emit(result, args.json)
    return 0


def _universal_runtime_root(root: Path, override: str | None) -> Path:
    return Path(override).resolve() if override else root / "alive" / "runtime" / "universal-runs"


def command_universal_plan(args: argparse.Namespace) -> int:
    from .curriculum_adapters import load_high1_curriculum_adapters
    from .high1_variant_engine import high1_variant_registry
    from .mixed_exam_planner import build_mixed_exam_plan

    value = _read_json_value(args.input)
    questions = value.get("questions") if isinstance(value, dict) else value
    if not isinstance(questions, list):
        raise SystemExit("universal-plan input must be a JSON array or an object with questions[]")
    target_classes_text = args.target_classes
    if isinstance(value, dict) and value.get("targetClasses") is not None and args.target_classes == "A,B,C":
        target_classes_text = ",".join(str(item) for item in value["targetClasses"])
    target_classes = tuple(item.strip() for item in target_classes_text.split(",") if item.strip())
    planner_policy = value.get("plannerPolicy") if isinstance(value, dict) else None
    target_class_ranges = value.get("targetClassRanges") if isinstance(value, dict) else None
    school_profile = value.get("schoolProfile") if isinstance(value, dict) else None
    result = build_mixed_exam_plan(
        questions,
        registry=high1_variant_registry(),
        curriculum_registry=load_high1_curriculum_adapters(repository_root()),
        target_classes=target_classes,
        target_class_ranges=target_class_ranges,
        planner_policy=planner_policy,
        school_profile=school_profile,
    )
    emit(result, args.json)
    return 0 if result["status"] == "PASS" else 2


def command_universal_phase7_audit(args: argparse.Namespace) -> int:
    from .phase7_final_audit import audit_phase7

    result = audit_phase7(repository_root(), args.run)
    if args.output:
        atomic_write_json(Path(args.output).resolve(), result)
    emit(result, args.json)
    return 0 if result["status"] == "PASS_ACTIVE_BOUNDED" else 2


def command_universal_high1_prepare(args: argparse.Namespace) -> int:
    from .universal_high1_bridge import prepare_high1_universal_run

    root = repository_root()
    result = prepare_high1_universal_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
    )
    emit(result, args.json)
    return 0


def command_universal_high1_variant_prepare(args: argparse.Namespace) -> int:
    from .high1_variant_engine import prepare_high1_variant_run

    root = repository_root()
    result = prepare_high1_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
        fixture_scope=args.fixture_scope,
    )
    emit(result, args.json)
    return 0


def command_universal_high1_capability(args: argparse.Namespace) -> int:
    from .high1_variant_engine import build_high1_capability_promotion

    root = repository_root()
    report = build_high1_capability_promotion(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_HIGH1_UNIVERSAL_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {"status": report["status"], "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output), "activeCount": report["activeCount"], "holdCount": report["holdCount"], "unitCount": report["unitCount"], "publicationStatus": "NOT_PUBLISHED"}
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_variant_engine import prepare_middle_school_variant_run

    root = repository_root()
    result = prepare_middle_school_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_capability(args: argparse.Namespace) -> int:
    from .middle_school_variant_engine import build_middle_school_capability_report

    root = repository_root()
    report = build_middle_school_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_function_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_function_engine import prepare_middle_school_function_variant_run

    root = repository_root()
    result = prepare_middle_school_function_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_function_capability(args: argparse.Namespace) -> int:
    from .middle_school_function_engine import build_middle_school_function_capability_report

    root = repository_root()
    report = build_middle_school_function_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_FUNCTION_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_geometry_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_geometry_engine import prepare_middle_school_geometry_variant_run

    root = repository_root()
    result = prepare_middle_school_geometry_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_geometry_capability(args: argparse.Namespace) -> int:
    from .middle_school_geometry_engine import build_middle_school_geometry_capability_report

    root = repository_root()
    report = build_middle_school_geometry_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_GEOMETRY_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_quadrilateral_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_quadrilateral_engine import prepare_middle_school_quadrilateral_variant_run

    root = repository_root()
    result = prepare_middle_school_quadrilateral_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_quadrilateral_capability(args: argparse.Namespace) -> int:
    from .middle_school_quadrilateral_engine import build_middle_school_quadrilateral_capability_report

    root = repository_root()
    report = build_middle_school_quadrilateral_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_similarity_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_similarity_engine import prepare_middle_school_similarity_variant_run

    root = repository_root()
    result = prepare_middle_school_similarity_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_similarity_capability(args: argparse.Namespace) -> int:
    from .middle_school_similarity_engine import build_middle_school_similarity_capability_report

    root = repository_root()
    report = build_middle_school_similarity_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_SIMILARITY_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_parallel_ratio_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_parallel_ratio_engine import prepare_middle_school_parallel_ratio_variant_run

    root = repository_root()
    result = prepare_middle_school_parallel_ratio_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_parallel_ratio_capability(args: argparse.Namespace) -> int:
    from .middle_school_parallel_ratio_engine import build_middle_school_parallel_ratio_capability_report

    root = repository_root()
    report = build_middle_school_parallel_ratio_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_PARALLEL_RATIO_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_pythagorean_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_pythagorean_engine import prepare_middle_school_pythagorean_variant_run

    root = repository_root()
    result = prepare_middle_school_pythagorean_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_pythagorean_capability(args: argparse.Namespace) -> int:
    from .middle_school_pythagorean_engine import build_middle_school_pythagorean_capability_report

    root = repository_root()
    report = build_middle_school_pythagorean_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_pythagorean_application_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_pythagorean_application_engine import prepare_middle_school_pythagorean_application_variant_run

    root = repository_root()
    result = prepare_middle_school_pythagorean_application_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_pythagorean_application_capability(args: argparse.Namespace) -> int:
    from .middle_school_pythagorean_application_engine import build_middle_school_pythagorean_application_capability_report

    root = repository_root()
    report = build_middle_school_pythagorean_application_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_probability_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_probability_engine import prepare_middle_school_probability_variant_run

    root = repository_root()
    result = prepare_middle_school_probability_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
        family_id=args.family_id,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_probability_capability(args: argparse.Namespace) -> int:
    from .middle_school_probability_engine import build_middle_school_probability_capability_report

    root = repository_root()
    report = build_middle_school_probability_capability_report(root, args.family_id)
    output = Path(args.output).resolve() if args.output else root / f"alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_{args.family_id}_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "familyId": args.family_id,
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_prime_factorization_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_prime_factorization_engine import prepare_middle_school_prime_factorization_variant_run

    root = repository_root()
    result = prepare_middle_school_prime_factorization_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_prime_factorization_capability(args: argparse.Namespace) -> int:
    from .middle_school_prime_factorization_engine import build_middle_school_prime_factorization_capability_report

    root = repository_root()
    report = build_middle_school_prime_factorization_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_rational_arithmetic_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_rational_arithmetic_engine import prepare_middle_school_rational_arithmetic_variant_run

    root = repository_root()
    result = prepare_middle_school_rational_arithmetic_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_rational_arithmetic_capability(args: argparse.Namespace) -> int:
    from .middle_school_rational_arithmetic_engine import build_middle_school_rational_arithmetic_capability_report

    root = repository_root()
    report = build_middle_school_rational_arithmetic_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_coordinate_plane_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_coordinate_plane_engine import prepare_middle_school_coordinate_plane_variant_run

    root = repository_root()
    result = prepare_middle_school_coordinate_plane_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_coordinate_plane_capability(args: argparse.Namespace) -> int:
    from .middle_school_coordinate_plane_engine import build_middle_school_coordinate_plane_capability_report

    root = repository_root()
    report = build_middle_school_coordinate_plane_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_COORDINATE_PLANE_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_basic_geometry_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_basic_geometry_engine import prepare_middle_school_basic_geometry_variant_run

    root = repository_root()
    result = prepare_middle_school_basic_geometry_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_basic_geometry_capability(args: argparse.Namespace) -> int:
    from .middle_school_basic_geometry_engine import build_middle_school_basic_geometry_capability_report

    root = repository_root()
    report = build_middle_school_basic_geometry_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_polygon_circle_measure_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_polygon_circle_measure_engine import prepare_middle_school_polygon_circle_measure_variant_run

    root = repository_root()
    result = prepare_middle_school_polygon_circle_measure_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_polygon_circle_measure_capability(args: argparse.Namespace) -> int:
    from .middle_school_polygon_circle_measure_engine import build_middle_school_polygon_circle_measure_capability_report

    root = repository_root()
    report = build_middle_school_polygon_circle_measure_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_solid_figure_measure_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_solid_figure_measure_engine import prepare_middle_school_solid_figure_measure_variant_run

    root = repository_root()
    result = prepare_middle_school_solid_figure_measure_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_solid_figure_measure_capability(args: argparse.Namespace) -> int:
    from .middle_school_solid_figure_measure_engine import build_middle_school_solid_figure_measure_capability_report

    root = repository_root()
    report = build_middle_school_solid_figure_measure_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_universal_middle_school_data_variant_prepare(args: argparse.Namespace) -> int:
    from .middle_school_data_organization_interpretation_engine import prepare_middle_school_data_variant_run

    root = repository_root()
    result = prepare_middle_school_data_variant_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        title=args.title,
        declared_class=args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_universal_middle_school_data_capability(args: argparse.Namespace) -> int:
    from .middle_school_data_organization_interpretation_engine import build_middle_school_data_capability_report

    root = repository_root()
    report = build_middle_school_data_capability_report(root)
    output = Path(args.output).resolve() if args.output else root / "alive/05_DESIGN/ALIVE_MIDDLE_SCHOOL_DATA_BOUNDED_CAPABILITY_PROMOTION_v0.1.json"
    atomic_write_json(output, report)
    result = {
        "status": report["status"],
        "reportPath": output.relative_to(root).as_posix() if output.is_relative_to(root) else str(output),
        "activeCount": report["activeCount"],
        "holdCount": report["holdCount"],
        "unitCount": report["unitCount"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    emit(result if not args.json else {**result, "report": report}, args.json)
    return 0 if report["status"] == "ACTIVE_BOUNDED" else 2


def command_curriculum_adapter_report(args: argparse.Namespace) -> int:
    from .curriculum_adapters import load_high1_curriculum_adapters
    from .structure_families import default_structure_family_registry

    registry = load_high1_curriculum_adapters(repository_root())
    report = registry.capability_report(default_structure_family_registry())
    emit(report, args.json)
    return 0


def command_curriculum_catalog_report(args: argparse.Namespace) -> int:
    from .curriculum_catalog import load_curriculum_catalog

    report = load_curriculum_catalog(repository_root()).capability_report()
    emit(report, args.json)
    return 0


def command_universal_run_start(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import start_universal_run

    root = repository_root()
    source_lock = _read_json_object(args.source_lock)
    batch_plan = _read_json_value(args.batch_plan)
    if not isinstance(batch_plan, list) or any(not isinstance(batch, list) for batch in batch_plan):
        raise SystemExit("batch-plan must be a JSON array of integer arrays")
    result = start_universal_run(
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run_id,
        source_lock=source_lock,
        question_count=args.question_count,
        batch_plan=batch_plan,
    )
    emit(result, args.json)
    return 0


def command_universal_run_status(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore

    manifest = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root)).load(args.run)
    emit(manifest, args.json)
    return 0


def command_universal_run_resume(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, resume_universal_run

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    batch_plan = _read_json_value(args.batch_plan) if args.batch_plan else None
    result = resume_universal_run(store, args.run, batch_plan=batch_plan)
    emit(result, args.json)
    return 0


def command_universal_run_stage(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_stage

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_stage(
        store,
        args.run,
        args.stage,
        status=args.status,
        evidence=args.evidence,
    )
    emit(result, args.json)
    return 0 if args.status == "PASS" else 2


def command_universal_run_candidates(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_candidate_set

    value = _read_json_value(args.input)
    candidates = value.get("candidates") if isinstance(value, dict) else value
    if not isinstance(candidates, list):
        raise SystemExit("universal-run-candidates input must be a JSON array or an object with candidates[]")
    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_candidate_set(store, args.run, candidates)
    emit(result, args.json)
    return 0


def command_universal_run_precheck(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_variant_precheck

    value = _read_json_object(args.input)
    rows = value.get("rows")
    catalog = value.get("evidenceCatalog")
    if not isinstance(rows, list) or not isinstance(catalog, list):
        raise SystemExit("universal-run-precheck input must contain rows[] and evidenceCatalog[]")
    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_variant_precheck(store, args.run, rows, evidence_catalog=catalog)
    emit(result, args.json)
    return 0 if result["precheck"]["status"] == "PASS" else 2


def command_universal_run_review(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_review

    value = _read_json_object(args.input)
    ledger = value.get("ledger")
    catalog = value.get("evidenceCatalog")
    if not isinstance(ledger, dict) or not isinstance(catalog, list):
        raise SystemExit("universal-run-review input must contain ledger{} and evidenceCatalog[]")
    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_review(
        store,
        args.run,
        ledger,
        round_name=args.round,
        evidence_catalog=catalog,
    )
    emit(result, args.json)
    return 0 if result["review"]["status"] == "PASS" else 2


def command_universal_run_revision(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_revision

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_revision(store, args.run, _read_json_object(args.input))
    emit(result, args.json)
    return 0


def command_universal_run_mother_final(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_mother_final

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_mother_final(store, args.run)
    emit(result, args.json)
    return 0


def command_universal_run_assemble(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    archive_root = Path(args.archive_root).resolve() if args.archive_root else None
    result = assemble_universal_exam(store, args.run, args.title, archive_root=archive_root)
    emit(result, args.json)
    return 0


def command_universal_run_render(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_render

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_render(store, args.run, _read_json_object(args.input))
    emit(result, args.json)
    return 0


def command_universal_run_ledger(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, write_universal_variant_ledger

    value = _read_json_value(args.input)
    rows = value.get("rows") if isinstance(value, dict) else value
    if not isinstance(rows, list):
        raise SystemExit("universal-run-ledger input must be a JSON array or an object with rows[]")
    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = write_universal_variant_ledger(store, args.run, rows)
    emit(result, args.json)
    return 0 if result["status"] == "PASS" else 2


def command_universal_run_package(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, package_universal_run

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = package_universal_run(store, args.run, files=args.file or ())
    emit(result, args.json)
    return 0


def command_universal_run_closure(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, record_universal_closure

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = record_universal_closure(store, args.run, _read_json_object(args.input))
    emit(result, args.json)
    return 0


def command_universal_run_seal(args: argparse.Namespace) -> int:
    from .universal_variant_runtime import UniversalRunStore, seal_universal_run

    store = UniversalRunStore(_universal_runtime_root(repository_root(), args.runtime_root))
    result = seal_universal_run(store, args.run)
    emit(result, args.json)
    return 0


def command_universal_high1_finalize(args: argparse.Namespace) -> int:
    """Close a prepared High-1 Universal Run in one fail-closed operation."""

    from .final_closure import audit_final_closure
    from .universal_variant_runtime import (
        UniversalRunStore,
        package_universal_run,
        record_universal_closure,
        record_universal_render,
        seal_universal_run,
    )

    root = repository_root()
    store = UniversalRunStore(_universal_runtime_root(root, args.runtime_root))
    run_dir = store.run_dir(args.run)
    render_path = Path(args.render_evidence).resolve()
    review_path = Path(args.review_ledger).resolve()
    external_path = Path(args.external_findings).resolve()
    render_result = record_universal_render(store, args.run, _read_json_object(render_path))
    package_result = package_universal_run(store, args.run)
    package_path = Path(package_result["packagePath"])
    legacy_path = run_dir / "final/legacy-final-closure-report.json"
    legacy_report = audit_final_closure(
        root,
        package_path,
        review_path,
        run_dir / "render/render-evidence.json",
        external_path,
        legacy_path,
        "final/staging/generated-exam.js",
        run_dir / "final/variant-proof-ledger.json",
    )
    if legacy_report.get("status") != "PASS":
        emit(
            {
                "runId": args.run,
                "status": "HOLD",
                "currentStage": store.load(args.run).get("currentStage"),
                "render": render_result,
                "package": package_result,
                "legacyFinalClosure": legacy_report,
                "publicationStatus": "NOT_PUBLISHED",
            },
            args.json,
        )
        return 2
    manifest = store.load(args.run)
    render_evidence = _read_json_object(run_dir / "render/render-evidence.json")
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
        args.run,
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
    sealed = seal_universal_run(store, args.run)
    emit(
        {
            "runId": args.run,
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
        },
        args.json,
    )
    return 0


def command_universal_bounded_finalize(args: argparse.Namespace) -> int:
    from .universal_run_finalizer import finalize_universal_run

    root = repository_root()
    result = finalize_universal_run(
        root,
        _universal_runtime_root(root, args.runtime_root),
        run_id=args.run,
        render_evidence_path=Path(args.render_evidence),
        external_findings_path=Path(args.external_findings),
    )
    emit(result, args.json)
    return 0 if result["status"] == "SEALED_LOCAL" else 2


def command_resolve(args: argparse.Namespace) -> int:
    result = resolve_source(repository_root(), args.query, args.question, args.limit)
    emit(result, args.json)
    return 0 if result["status"] == "UNIQUE" else 2


def command_start(args: argparse.Namespace) -> int:
    root = repository_root()
    if not args.query and not args.source_file:
        raise SystemExit("start requires --query or --source-file")
    resolution = (
        resolve_explicit_source(root, args.source_file, args.question)
        if args.source_file
        else resolve_source(root, args.query, args.question, args.limit)
    )
    manifest = build_manifest(args, resolution)
    if resolution["status"] == "UNIQUE" and manifest["status"] != "BLOCKED":
        finalize_source_lock(root, manifest)
    store = RunStore(runtime_root(root, args.runtime_root))
    run_dir = store.create(manifest["runId"], manifest)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "codes": manifest["codes"],
            "runDir": str(run_dir),
            "candidateCount": resolution.get("candidateCount", 0),
        },
        args.json,
    )
    return 0 if manifest["status"] == "READY_FOR_ORCHESTRATION" else 2


def command_status(args: argparse.Namespace) -> int:
    store = RunStore(runtime_root(repository_root(), args.runtime_root))
    manifest = store.load(args.run)
    if args.json:
        emit(manifest, True)
    else:
        emit(
            {
                "runId": manifest["runId"],
                "status": manifest["status"],
                "currentStage": manifest["currentStage"],
                "codes": manifest["codes"],
                "source": manifest.get("sourceLock"),
            }
        )
        for stage in manifest["stages"]:
            if stage["status"] != "PENDING":
                print(f"{stage['stageId']}: {stage['status']}")
    return 0


def command_resume(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = store.load(args.run)
    source_block_codes = {"SOURCE_AMBIGUOUS", "SOURCE_NOT_FOUND"}.intersection(manifest["codes"])
    if manifest["status"] == "BLOCKED" and args.source_file and source_block_codes:
        resolution = resolve_explicit_source(root, args.source_file, args.question)
        manifest["sourceResolution"] = resolution
        manifest["codes"] = [
            code for code in manifest["codes"] if code not in {"SOURCE_AMBIGUOUS", "SOURCE_NOT_FOUND"}
        ]
        set_stage(manifest, "R01_SOURCE_RESOLVE", "PASS", "explicit source supplied on resume")
        finalize_source_lock(root, manifest)
        manifest["events"].append({"at": utc_now(), "type": "SOURCE_RESOLVED_ON_RESUME"})
        store.save(args.run, manifest)
    elif manifest["status"] == "BLOCKED" and "CAPABILITY_PRECHECK_FAIL" in manifest["codes"]:
        raise SystemExit("Run uses a capability unsupported by this engine milestone; start a supported Run")
    elif manifest["status"] == "BLOCKED":
        raise SystemExit("source-blocked Run requires --source-file to resume")
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "codes": manifest["codes"],
        },
        args.json,
    )
    return 0 if manifest["status"] == "READY_FOR_ORCHESTRATION" else 2


def command_list(args: argparse.Namespace) -> int:
    store = RunStore(runtime_root(repository_root(), args.runtime_root))
    rows = [
        {
            "runId": item.get("runId"),
            "status": item.get("status"),
            "currentStage": item.get("currentStage"),
            "updatedAt": item.get("updatedAt"),
        }
        for item in store.list_runs()[: args.limit]
    ]
    emit({"runs": rows}, args.json)
    return 0


def _phase2_run(store: RunStore, run_id: str) -> tuple[dict[str, Any], Path]:
    manifest = store.load(run_id)
    run_dir = store.run_dir(run_id)
    stage_number = int(str(manifest["currentStage"])[1:3])
    if not 3 <= stage_number <= 12:
        raise ValueError("Run is not at a Phase 2 stage")
    source_lock_data = manifest.get("sourceLock")
    if not isinstance(source_lock_data, dict):
        raise ValueError("Run has no source lock")
    locked_path = repository_root() / source_lock_data["path"]
    if not locked_path.is_file() or sha256_file(locked_path) != source_lock_data["sha256"]:
        raise ValueError("SOURCE_LOCK_DRIFT")
    return manifest, run_dir


def command_prepare(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase2_run(store, args.run)
    if manifest["status"] not in {"READY_FOR_ORCHESTRATION", "ACTIVE"}:
        raise ValueError(f"Run cannot prepare tasks from status {manifest['status']}")
    if manifest["currentStage"] == "R03_SOURCE_ANALYSIS":
        source_question_path = run_dir / "source" / "source-question.json"
        if not source_question_path.exists():
            from .source_question import extract_source_question

            payload = extract_source_question(
                root / manifest["sourceLock"]["path"],
                int(manifest["sourceLock"]["questionOrdinal"]),
                manifest["sourceLock"],
            )
            atomic_write_json(source_question_path, payload)
            manifest.setdefault("phase2", {}).setdefault("artifacts", {})["source/source-question.json"] = {
                "kind": "source_question",
                "sha256": sha256_file(source_question_path),
            }
    packets = prepare_stage_tasks(run_dir, manifest)
    set_stage(manifest, manifest["currentStage"], "ACTIVE", f"{len(packets)} task packet(s) prepared")
    manifest["status"] = "ACTIVE"
    manifest.setdefault("events", []).append(
        {"at": utc_now(), "type": "PHASE2_TASKS_PREPARED", "stageId": manifest["currentStage"]}
    )
    store.save(args.run, manifest)
    emit(
        {
            "runId": args.run,
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "tasks": packets,
        },
        args.json,
    )
    return 0


def command_submit(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase2_run(store, args.run)
    from .phase2_artifacts import validate_artifact

    task = submit_task_artifact(
        run_dir,
        manifest,
        args.task,
        Path(args.file).resolve(),
        validate_artifact,
    )
    manifest.setdefault("events", []).append(
        {"at": utc_now(), "type": "PHASE2_ARTIFACT_SUBMITTED", "taskId": args.task}
    )
    store.save(args.run, manifest)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "artifactKind": task["artifactKind"],
            "outputPath": task["outputPath"],
            "artifactHash": task["artifactHash"],
            "stageReady": all_current_tasks_submitted(manifest),
        },
        args.json,
    )
    return 0


def command_dispatch_start(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase2_run(store, args.run)
    task, idempotent = start_task_dispatch(
        manifest,
        args.task,
        args.external_id,
        args.route,
    )
    receipt = task["dispatch"]["attempts"][-1]
    if not idempotent:
        manifest.setdefault("events", []).append(
            {
                "at": utc_now(),
                "type": "PHASE2_TASK_DISPATCHED",
                "taskId": task["taskId"],
                "externalId": receipt["externalId"],
                "route": receipt["route"],
                "attempt": receipt["attempt"],
            }
        )
        # The manifest is the dispatch receipt of record: save it atomically before any follow-up work.
        store.save(args.run, manifest)
        persist_task_packet(run_dir, task)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "externalId": receipt["externalId"],
            "route": receipt["route"],
            "attempt": receipt["attempt"],
            "idempotent": idempotent,
        },
        args.json,
    )
    return 0


def command_dispatch_fail(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase2_run(store, args.run)
    task = fail_task_dispatch(manifest, args.task, args.code)
    failure = task["dispatch"]["lastFailure"]
    manifest.setdefault("events", []).append(
        {
            "at": utc_now(),
            "type": "PHASE2_TASK_DISPATCH_FAILED",
            "taskId": task["taskId"],
            "code": failure["code"],
            "attempt": failure["attempt"],
            "externalId": failure["externalId"],
        }
    )
    store.save(args.run, manifest)
    persist_task_packet(run_dir, task)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "dispatchStatus": "DISPATCH_FAILED",
            "failure": failure,
        },
        args.json,
    )
    return 0


def _next_stage(stage_id: str) -> str:
    ids = [item[0] for item in STAGES]
    index = ids.index(stage_id)
    if index + 1 >= len(ids):
        raise ValueError("no next stage")
    return ids[index + 1]


def command_reduce(args: argparse.Namespace) -> int:
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase2_run(store, args.run)
    if not all_current_tasks_submitted(manifest):
        raise ValueError("current stage has pending task artifacts")
    from .phase2_artifacts import reduce_phase2_stage

    stage_id = manifest["currentStage"]
    result = reduce_phase2_stage(stage_id, run_dir, manifest)
    outcome = result.get("outcome")
    codes = [str(code) for code in result.get("codes", [])]
    updates = result.get("manifestUpdates", {})
    if isinstance(updates, dict):
        phase_updates = updates.get("phase2", updates)
        if isinstance(phase_updates, dict):
            manifest.setdefault("phase2", {}).update(phase_updates)
    if outcome == "PASS":
        if stage_id == "R12_FINAL_REDUCER":
            selected_id = manifest.get("phase2", {}).get("selectedCandidateId")
            selected_judge = None
            for task in manifest.get("phase2", {}).get("tasks", {}).values():
                if task.get("stageId") != stage_id or task.get("artifactKind") != "candidate_judge_input":
                    continue
                candidate_judge = json.loads(
                    (run_dir / task["outputPath"]).read_text(encoding="utf-8")
                )
                if candidate_judge.get("candidate", {}).get("artifactId") == selected_id:
                    selected_judge = candidate_judge
                    break
            if selected_judge is None:
                raise ValueError("selected candidate judge artifact is missing")
            atomic_write_json(run_dir / "final" / "selected-candidate.json", selected_judge["candidate"])
            atomic_write_json(
                run_dir / "final" / "selection-report.json",
                {
                    "stageId": stage_id,
                    "verdict": "PASS",
                    "selectedCandidateId": selected_id,
                    "selectedJudgeArtifactId": selected_judge["artifactId"],
                    "survivingCandidateIds": manifest.get("phase2", {}).get("survivingCandidateIds", []),
                    "visualEvidence": selected_judge.get("visualEvidence", []),
                },
            )
        set_stage(manifest, stage_id, "PASS", "deterministic reducer PASS")
        manifest["currentStage"] = _next_stage(stage_id)
        manifest["status"] = "PHASE2_COMPLETE" if stage_id == "R12_FINAL_REDUCER" else "ACTIVE"
    elif outcome == "BLOCKED":
        set_stage(manifest, stage_id, "BLOCKED", ", ".join(codes) or "reducer blocked")
        manifest["status"] = "BLOCKED"
        manifest["codes"] = sorted(set(manifest["codes"] + codes))
    elif outcome == "FAIL":
        set_stage(manifest, stage_id, "FAIL", ", ".join(codes) or "reducer failed")
        manifest["status"] = "FAILED"
        manifest["codes"] = sorted(set(manifest["codes"] + codes))
    else:
        raise ValueError("reducer returned invalid outcome")
    manifest.setdefault("events", []).append(
        {"at": utc_now(), "type": "PHASE2_STAGE_REDUCED", "stageId": stage_id, "outcome": outcome}
    )
    store.save(args.run, manifest)
    emit(
        {
            "runId": args.run,
            "reducedStage": stage_id,
            "outcome": outcome,
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "codes": manifest["codes"],
        },
        args.json,
    )
    return 0 if outcome == "PASS" else 2


def _phase3_run(store: RunStore, run_id: str) -> tuple[dict[str, Any], Path]:
    manifest = store.load(run_id)
    if manifest.get("currentStage") not in {
        "R13_STRUCTURED_ADAPTER", "R14_JS_SERIALIZER", "R15_REAL_RENDER", "R16_PACKAGE", "R17_LOCAL_FREEZE"
    }:
        raise ValueError("Run is not at a Phase 3 stage")
    source_lock_data = manifest.get("sourceLock")
    if not isinstance(source_lock_data, dict):
        raise ValueError("Run has no source lock")
    locked_path = repository_root() / source_lock_data["path"]
    if not locked_path.is_file() or sha256_file(locked_path) != source_lock_data["sha256"]:
        raise ValueError("SOURCE_LOCK_DRIFT")
    return manifest, store.run_dir(run_id)


def _complete_phase3_stage(store: RunStore, manifest: dict[str, Any], stage_id: str, updates: dict[str, Any]) -> None:
    set_stage(manifest, stage_id, "PASS", "deterministic Phase 3 gate PASS")
    manifest.setdefault("phase3", {}).update(updates)
    manifest.setdefault("events", []).append({"at": utc_now(), "type": "PHASE3_STAGE_PASS", "stageId": stage_id})
    manifest["currentStage"] = _next_stage(stage_id) if stage_id != "R17_LOCAL_FREEZE" else stage_id
    manifest["status"] = "LOCALLY_FROZEN" if stage_id == "R17_LOCAL_FREEZE" else "ACTIVE"
    store.save(manifest["runId"], manifest)


def command_adapt(args: argparse.Namespace) -> int:
    from .phase3 import adapt_selected_candidate
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase3_run(store, args.run)
    updates = adapt_selected_candidate(root, run_dir, manifest, Path(args.context).resolve())
    _complete_phase3_stage(store, manifest, "R13_STRUCTURED_ADAPTER", updates)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], **updates}, args.json)
    return 0


def command_serialize(args: argparse.Namespace) -> int:
    from .phase3 import serialize_structured_question
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase3_run(store, args.run)
    updates = serialize_structured_question(root, run_dir, manifest, args.title)
    _complete_phase3_stage(store, manifest, "R14_JS_SERIALIZER", updates)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], **updates}, args.json)
    return 0


def command_record_render(args: argparse.Namespace) -> int:
    from .phase3 import record_render_evidence
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase3_run(store, args.run)
    updates = record_render_evidence(run_dir, manifest, Path(args.file).resolve())
    _complete_phase3_stage(store, manifest, "R15_REAL_RENDER", updates)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], **updates}, args.json)
    return 0


def command_package(args: argparse.Namespace) -> int:
    from .phase3 import package_run
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase3_run(store, args.run)
    updates = package_run(run_dir, manifest)
    _complete_phase3_stage(store, manifest, "R16_PACKAGE", updates)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], **updates}, args.json)
    return 0


def command_freeze(args: argparse.Namespace) -> int:
    from .phase3 import package_run
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest, run_dir = _phase3_run(store, args.run)
    if manifest.get("currentStage") != "R17_LOCAL_FREEZE":
        raise ValueError("Run is not ready for R17")
    if manifest.get("status") == "LOCALLY_FROZEN":
        updates = package_run(run_dir, manifest)
        manifest.setdefault("phase3", {}).update(updates)
        manifest.setdefault("events", []).append({
            "at": utc_now(), "type": "PHASE3_LOCAL_FREEZE_REVALIDATED", "stageId": "R17_LOCAL_FREEZE"
        })
        store.save(manifest["runId"], manifest)
        emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], **updates}, args.json)
        return 0
    required = (run_dir / "final" / "alive-evidence-pack.zip", run_dir / "final" / "package-report.json")
    if not all(path.is_file() for path in required):
        raise ValueError("R17 package evidence is missing")
    _complete_phase3_stage(store, manifest, "R17_LOCAL_FREEZE", {"localFreeze": "PASS"})
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"]}, args.json)
    return 0


def command_exam_preflight(args: argparse.Namespace) -> int:
    from .exam_batch import preflight_exam
    _, report = preflight_exam(repository_root(), args.source_file)
    emit(report, args.json)
    return 0 if report["wholeExamReady"] else 2


def command_exam_start(args: argparse.Namespace) -> int:
    from .exam_batch import start_exam_batch
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = start_exam_batch(root, store, args.source_file, args.query, ENGINE_VERSION)
    emit({
        "runId": manifest["runId"],
        "status": manifest["status"],
        "currentStage": manifest["currentStage"],
        "questionCount": manifest["request"]["expectedQuestionCount"],
        "supportedCount": manifest["preflight"]["supportedCount"],
        "heldCount": manifest["preflight"]["heldCount"],
        "heldOrdinals": manifest["preflight"]["heldOrdinals"],
        "childRuns": manifest["children"],
    }, args.json)
    return 2 if manifest["status"] == "BLOCKED" else 0


def command_exam_sync(args: argparse.Namespace) -> int:
    from .exam_batch import sync_exam_batch
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = sync_exam_batch(root, store, args.run)
    emit({
        "runId": manifest["runId"], "status": manifest["status"],
        "currentStage": manifest["currentStage"], "codes": manifest["codes"],
        "progress": manifest.get("progress", {}),
    }, args.json)
    return 0 if manifest["status"] not in {"HOLD", "FAILED"} else 2


def command_exam_status(args: argparse.Namespace) -> int:
    from .exam_orchestration import build_exam_status

    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    emit(build_exam_status(store, args.run), args.json)
    return 0


def command_exam_assemble(args: argparse.Namespace) -> int:
    from .exam_batch import assemble_exam
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = assemble_exam(root, store, args.run, args.title)
    emit({
        "runId": manifest["runId"], "status": manifest["status"],
        "currentStage": manifest["currentStage"], "assembly": manifest["assembly"],
    }, args.json)
    return 0


def command_exam_record_render(args: argparse.Namespace) -> int:
    from .exam_batch import record_exam_render
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = record_exam_render(store, args.run, Path(args.file).resolve())
    emit({
        "runId": manifest["runId"], "status": manifest["status"],
        "currentStage": manifest["currentStage"],
        "renderEvidenceSha256": manifest["renderEvidenceSha256"],
    }, args.json)
    return 0


def command_exam_package(args: argparse.Namespace) -> int:
    from .exam_batch import package_exam
    root = repository_root()
    store = RunStore(runtime_root(root, args.runtime_root))
    manifest = package_exam(store, args.run)
    emit({
        "runId": manifest["runId"], "status": manifest["status"],
        "currentStage": manifest["currentStage"], "package": manifest["package"],
    }, args.json)
    return 0


def command_visual_render(args: argparse.Namespace) -> int:
    from .visual_renderer import render_visual_file
    report = render_visual_file(
        Path(args.spec).resolve(), Path(args.output).resolve(), Path(args.report).resolve()
    )
    emit(report, args.json)
    return 0


def command_visual_benchmark(args: argparse.Namespace) -> int:
    from .visual_benchmark import run_visual_benchmarks

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root
        / "alive"
        / "runtime"
        / "visual-benchmarks"
        / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-experimental-visual")
    )
    summary = run_visual_benchmarks(output, repeats=args.repeat, topic=args.topic)
    emit(summary, args.json)
    return 0 if summary["overallStatus"] != "FAIL" else 1


def command_coordinate_benchmark(args: argparse.Namespace) -> int:
    from .coordinate_geometry import run_coordinate_fixture_benchmark

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root
        / "alive"
        / "runtime"
        / "high1-benchmarks"
        / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-h22-c2-01-coordinate")
    )
    summary = run_coordinate_fixture_benchmark(root, output, repeats=args.repeat)
    emit(summary, args.json)
    return 0 if summary["overallStatus"] != "FAIL" else 1


def command_high1_benchmark(args: argparse.Namespace) -> int:
    from .high1_units import run_high1_unit_benchmark

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root
        / "alive"
        / "runtime"
        / "high1-benchmarks"
        / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-high1-units")
    )
    summary = run_high1_unit_benchmark(root, output, repeats=args.repeat)
    emit(summary, args.json)
    return 0 if summary["overallStatus"] != "FAIL" else 1


def command_universal_variant_benchmark(args: argparse.Namespace) -> int:
    from .universal_variant_benchmark import run_universal_variant_benchmark

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root
        / "alive"
        / "runtime"
        / "universal-variant-benchmarks"
        / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-contracts")
    )
    summary = run_universal_variant_benchmark(root, output, repeats=args.repeat)
    emit(summary, args.json)
    phase_status = summary.get("phaseStatus", {})
    return 0 if summary.get("determinism", {}).get("status") == "PASS" and not any(value == "FAIL" for value in phase_status.values()) else 1


def command_high1_preview(args: argparse.Namespace) -> int:
    from .high1_units import write_high1_preview_exam

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root / "alive" / "runtime" / "high1-preview" / f"{args.unit.lower()}.js"
    )
    manifest = write_high1_preview_exam(root, output, unit_key=args.unit)
    emit(manifest, args.json)
    return 0


def command_high1_operation_benchmark(args: argparse.Namespace) -> int:
    from .high1_operations import run_high1_operation_benchmark

    root = repository_root()
    output = (
        Path(args.output).resolve()
        if args.output
        else root
        / "alive"
        / "runtime"
        / "high1-operation-benchmarks"
        / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ-high1-operation")
    )
    summary = run_high1_operation_benchmark(root, output)
    emit(summary, args.json)
    return 0 if summary["overallStatus"] != "HOLD" else 1


def command_high1_operation_record_render(args: argparse.Namespace) -> int:
    from .high1_operations import record_high1_operation_render_evidence

    root = repository_root()
    summary = record_high1_operation_render_evidence(
        root,
        Path(args.output).resolve(),
        Path(args.evidence).resolve(),
    )
    emit(summary, args.json)
    return 0 if summary["overallStatus"] == "PASS_RENDERED_PACKAGED" else 1


def command_high1_finalize_promotion(args: argparse.Namespace) -> int:
    from .high1_promotion import finalize_high1_promotion

    root = repository_root()
    report = (
        Path(args.report).resolve()
        if args.report
        else root / "alive" / "05_DESIGN" / "ALIVE_HIGH1_FINAL_PROMOTION_REPORT_v0.1.json"
    )
    result = finalize_high1_promotion(
        root,
        Path(args.unit_benchmark).resolve(),
        Path(args.operation).resolve(),
        Path(args.evidence).resolve(),
        report,
    )
    emit(result, args.json)
    return 0 if result["status"] == "PASS_ACTIVE_PRODUCTION" else 1


def command_fast_exam_start(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, start_fast_exam
    from .source_resolver import resolve_source

    root = repository_root()
    resolution = None
    source_file = args.source_file
    if not source_file and args.query:
        resolution = resolve_source(root, args.query, None, args.limit)
        if resolution["status"] != "UNIQUE":
            emit(resolution, args.json)
            return 2
        source_file = resolution["selected"]["path"]
    if not source_file:
        raise SystemExit("fast-exam-start requires --source-file or a unique --query")
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    manifest = start_fast_exam(
        root,
        store,
        source_file,
        args.query,
        ENGINE_VERSION,
        source_resolution=resolution,
        variation_mode=args.variation_mode,
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "questionCount": manifest["request"]["expectedQuestionCount"],
            "supportedCount": manifest["preflight"]["supportedCount"],
            "heldCount": manifest["preflight"]["heldCount"],
            "runDir": str(store.run_dir(manifest["runId"])),
        },
        args.json,
    )
    return 2 if manifest["status"] == "BLOCKED" else 0


def command_fast_exam_prepare(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, prepare_fast_exam

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    manifest = prepare_fast_exam(store, args.run)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "taskCount": len(manifest.get("tasks", {})),
            "progress": manifest.get("progress", {}),
        },
        args.json,
    )
    return 0


def command_fast_exam_status(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, build_fast_status

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    emit(build_fast_status(store, args.run), args.json)
    return 0


def command_fast_dispatch_start(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, start_fast_dispatch

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    task, idempotent = start_fast_dispatch(
        store, args.run, args.task, args.external_id, args.route
    )
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "idempotent": idempotent,
            "dispatch": task.get("dispatch", {}),
        },
        args.json,
    )
    return 0


def command_fast_dispatch_fail(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, fail_fast_dispatch

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    task = fail_fast_dispatch(store, args.run, args.task, args.code)
    manifest = store.load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "dispatchStatus": task["dispatch"]["attempts"][-1]["status"],
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_fast_submit(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, submit_fast_artifact

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    result = submit_fast_artifact(store, args.run, args.task, Path(args.file).resolve())
    emit(
        {
            "runId": args.run,
            "taskId": args.task,
            "status": result["task"]["status"],
            "idempotent": result["idempotent"],
            "questionStatus": result["questionStatus"],
            "parentStatus": result.get("parentStatus", store.load(args.run)["status"]),
            "acceptedPath": result.get("acceptedPath"),
        },
        args.json,
    )
    return 0


def command_fast_reconcile(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, reconcile_fast_run

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    emit(reconcile_fast_run(store, args.run), args.json)
    return 0


def command_fast_exam_assemble(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, assemble_fast_exam

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    manifest = assemble_fast_exam(root, store, args.run, args.title)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "assembly": manifest.get("assembly"),
        },
        args.json,
    )
    return 0


def command_fast_exam_record_render(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, record_fast_render

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    manifest = record_fast_render(store, args.run, Path(args.file).resolve())
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "render": manifest.get("render"),
        },
        args.json,
    )
    return 0


def command_fast_exam_package(args: argparse.Namespace) -> int:
    from .fast_exam import FastRunStore, package_fast_exam

    root = repository_root()
    store = FastRunStore(fast_runtime_root_path(root, args.runtime_root))
    manifest = package_fast_exam(store, args.run)
    finalization = _finalize_packaged_run(store.runtime_root, args, manifest)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "package": manifest.get("package"),
            "cleanup": finalization,
        },
        args.json,
    )
    return 0


def command_staged_exam_start(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, start_staged_exam

    root = repository_root()
    if not args.source_file and not args.query:
        raise SystemExit("staged-exam-start requires --source-file or --query")
    if args.source_file:
        resolution = resolve_explicit_source(root, args.source_file, args.question)
        source_file = resolution["selected"]["path"]
    else:
        resolution = resolve_source(root, args.query, None, args.limit)
        if resolution["status"] != "UNIQUE":
            emit(resolution, args.json)
            return 2
        source_file = resolution["selected"]["path"]
    store = StagedRunStore(staged_runtime_root_path(root, args.runtime_root))
    manifest = start_staged_exam(
        root,
        store,
        source_file,
        args.query,
        ENGINE_VERSION,
        source_resolution=resolution,
        batch_count=args.batch_count,
        variation_mode=args.variation_mode,
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "questionCount": manifest["request"]["expectedQuestionCount"],
            "batchCount": manifest["request"]["batchCount"],
            "taskCount": len(manifest.get("tasks", {})),
            "runDir": str(store.run_dir(manifest["runId"])),
        },
        args.json,
    )
    return 2 if manifest["status"] == "BLOCKED" else 0


def command_staged_exam_status(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, build_staged_status

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    emit(build_staged_status(store, args.run), args.json)
    return 0


def command_staged_dispatch_start(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, start_staged_dispatch

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    task, idempotent = start_staged_dispatch(
        store, args.run, args.task, args.external_id, args.route
    )
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "idempotent": idempotent,
            "dispatch": task.get("dispatch", {}),
        },
        args.json,
    )
    return 0


def command_staged_dispatch_fail(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, fail_staged_dispatch

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    task = fail_staged_dispatch(store, args.run, args.task, args.code)
    manifest = store.load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "dispatchStatus": task["dispatch"]["attempts"][-1]["status"],
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_staged_recover(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, recover_staged_task

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    task = recover_staged_task(store, args.run, args.task)
    manifest = store.load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "recoveryCount": task.get("recoveryCount", 0),
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_staged_mark_complete(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, mark_staged_task_complete

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    task = mark_staged_task_complete(store, args.run, args.task)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "completionMarkerPath": task["completionMarkerPath"],
        },
        args.json,
    )
    return 0


def command_staged_reconcile(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, reconcile_staged_run

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    emit(reconcile_staged_run(store, args.run), args.json)
    return 0


def command_staged_exam_parent_resolve(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, resolve_staged_manual_review

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    manifest = resolve_staged_manual_review(store, args.run, Path(args.file).resolve())
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "motherFinal": manifest.get("motherFinal"),
            "manualResolution": manifest.get("manualResolution"),
        },
        args.json,
    )
    return 0


def command_staged_exam_assemble(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, assemble_staged_exam

    root = repository_root()
    store = StagedRunStore(staged_runtime_root_path(root, args.runtime_root))
    title = args.title or store.load(args.run)["request"]["query"]
    manifest = assemble_staged_exam(root, store, args.run, title)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "assembly": manifest.get("assembly"),
        },
        args.json,
    )
    return 0


def command_staged_exam_record_render(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, record_staged_render

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    manifest = record_staged_render(store, args.run, Path(args.file).resolve())
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "render": manifest.get("render"),
        },
        args.json,
    )
    return 0


def command_staged_exam_package(args: argparse.Namespace) -> int:
    from .staged_exam import StagedRunStore, package_staged_exam

    store = StagedRunStore(staged_runtime_root_path(repository_root(), args.runtime_root))
    manifest = package_staged_exam(store, args.run)
    finalization = _finalize_packaged_run(store.runtime_root, args, manifest)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "package": manifest.get("package"),
            "cleanup": finalization,
        },
        args.json,
    )
    return 0


def command_adaptive_exam_start(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import start_adaptive_staged_exam
    from .staged_exam import StagedRunStore

    root = repository_root()
    if not args.source_file and not args.query:
        raise SystemExit("adaptive-staged-exam-start requires --source-file or --query")
    if args.source_file:
        resolution = resolve_explicit_source(root, args.source_file, args.question)
        source_file = resolution["selected"]["path"]
    else:
        resolution = resolve_source(root, args.query, None, args.limit)
        if resolution["status"] != "UNIQUE":
            emit(resolution, args.json)
            return 2
        source_file = resolution["selected"]["path"]
    store = StagedRunStore(adaptive_runtime_root_path(root, args.runtime_root))
    manifest = start_adaptive_staged_exam(
        root,
        store,
        source_file,
        args.query,
        ENGINE_VERSION,
        source_resolution=resolution,
        batch_count=args.batch_count,
        variation_mode=args.variation_mode,
        batch_strategy=args.batch_strategy,
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "questionCount": manifest["request"]["expectedQuestionCount"],
            "batchCount": manifest["request"]["batchCount"],
            "taskCount": len(manifest.get("tasks", {})),
            "runDir": str(store.run_dir(manifest["runId"])),
        },
        args.json,
    )
    return 2 if manifest["status"] == "BLOCKED" else 0


def _adaptive_store(args: argparse.Namespace):
    from .staged_exam import StagedRunStore

    return StagedRunStore(adaptive_runtime_root_path(repository_root(), args.runtime_root))


def command_adaptive_exam_status(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import build_adaptive_status

    emit(build_adaptive_status(_adaptive_store(args), args.run), args.json)
    return 0


def command_adaptive_dispatch_start(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import start_adaptive_staged_dispatch

    task, idempotent = start_adaptive_staged_dispatch(
        _adaptive_store(args), args.run, args.task, args.external_id, args.route
    )
    emit({"runId": args.run, "taskId": args.task, "status": task["status"], "idempotent": idempotent, "dispatch": task.get("dispatch", {})}, args.json)
    return 0


def command_adaptive_dispatch_fail(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import fail_adaptive_dispatch

    task = fail_adaptive_dispatch(
        _adaptive_store(args), args.run, args.task, args.code
    )
    emit(
        {
            "runId": args.run,
            "taskId": args.task,
            "status": task["status"],
            "dispatch": task.get("dispatch", {}),
        },
        args.json,
    )
    return 0


def command_adaptive_heartbeat(args: argparse.Namespace) -> int:
    from .staged_exam import record_staged_task_heartbeat

    payload = record_staged_task_heartbeat(
        _adaptive_store(args),
        args.run,
        args.task,
        args.phase,
        args.progress,
        args.note,
    )
    emit(payload, args.json)
    return 0


def command_adaptive_resume(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import resume_adaptive_staged_run

    emit(
        resume_adaptive_staged_run(
            _adaptive_store(args), args.run, args.timeout_seconds
        ),
        args.json,
    )
    return 0


def command_adaptive_recover(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import recover_adaptive_staged_task

    task = recover_adaptive_staged_task(
        _adaptive_store(args), args.run, args.task
    )
    manifest = _adaptive_store(args).load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": args.task,
            "status": task["status"],
            "recoveryCount": task.get("recoveryCount", 0),
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_adaptive_revalidate_review(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import revalidate_adaptive_correction_review

    manifest = revalidate_adaptive_correction_review(
        _adaptive_store(args), args.run, args.task
    )
    emit(
        {
            "runId": args.run,
            "taskId": args.task,
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
        },
        args.json,
    )
    return 0


def command_adaptive_render_readiness(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import record_adaptive_render_readiness

    manifest = record_adaptive_render_readiness(
        _adaptive_store(args), args.run, Path(args.file).resolve()
    )
    emit(
        {
            "runId": args.run,
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "renderReadiness": manifest.get("renderReadiness"),
        },
        args.json,
    )
    return 0


def command_adaptive_mark_complete(args: argparse.Namespace) -> int:
    from .staged_exam import mark_staged_task_complete

    store = _adaptive_store(args)
    task = mark_staged_task_complete(store, args.run, args.task)
    emit({"runId": args.run, "taskId": args.task, "status": task["status"], "completionMarkerPath": task["completionMarkerPath"]}, args.json)
    return 0


def command_adaptive_reconcile(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import reconcile_adaptive_staged_run

    emit(reconcile_adaptive_staged_run(_adaptive_store(args), args.run), args.json)
    return 0


def command_adaptive_visual_inspection(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import record_adaptive_visual_inspection

    emit(record_adaptive_visual_inspection(_adaptive_store(args), args.run, Path(args.file).resolve()), args.json)
    return 0


def command_adaptive_correction_start(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import start_adaptive_correction_cycle

    emit(start_adaptive_correction_cycle(_adaptive_store(args), args.run), args.json)
    return 0


def command_adaptive_assemble(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import assemble_adaptive_exam

    root = repository_root()
    store = _adaptive_store(args)
    title = args.title or store.load(args.run)["request"]["query"]
    manifest = assemble_adaptive_exam(root, store, args.run, title)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], "assembly": manifest.get("assembly")}, args.json)
    return 0


def command_adaptive_render(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import record_adaptive_render

    manifest = record_adaptive_render(_adaptive_store(args), args.run, Path(args.file).resolve())
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], "render": manifest.get("render")}, args.json)
    return 0


def command_adaptive_package(args: argparse.Namespace) -> int:
    from .adaptive_quality_runtime import package_adaptive_exam

    store = _adaptive_store(args)
    manifest = package_adaptive_exam(store, args.run)
    finalization = _finalize_packaged_run(store.runtime_root, args, manifest)
    emit({"runId": args.run, "status": manifest["status"], "currentStage": manifest["currentStage"], "package": manifest.get("package"), "cleanup": finalization}, args.json)
    return 0


def command_canonicalize_similar_package(args: argparse.Namespace) -> int:
    from .similar_identity import canonicalize_result_package

    result = canonicalize_result_package(
        repository_root(),
        Path(args.input).resolve(),
        Path(args.output).resolve(),
        args.source_file,
        args.display_title,
        args.variant_class,
    )
    emit(result, args.json)
    return 0


def command_external_review_package(args: argparse.Namespace) -> int:
    from .similar_identity import external_review_package

    result = external_review_package(
        repository_root(),
        Path(args.input).resolve(),
        Path(args.output).resolve(),
        args.source_file,
    )
    emit(result, args.json)
    return 0


def command_final_closure_audit(args: argparse.Namespace) -> int:
    from .final_closure import audit_final_closure

    result = audit_final_closure(
        repository_root(),
        Path(args.input).resolve(),
        Path(args.review_ledger).resolve() if args.review_ledger else None,
        Path(args.render_evidence).resolve() if args.render_evidence else None,
        Path(args.external_findings).resolve() if args.external_findings else None,
        Path(args.output).resolve() if args.output else None,
        args.js_path,
        Path(args.variant_proof_ledger).resolve() if args.variant_proof_ledger else None,
    )
    emit(result, args.json)
    return 0 if result["status"] == "PASS" else 2


def add_common_output(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--runtime-root")
    parser.add_argument("--json", action="store_true")


def add_package_cleanup(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--keep-workdir",
        action="store_true",
        help="keep the verbose Run directory instead of moving it to quarantine",
    )
    parser.add_argument("--result-root")
    parser.add_argument("--quarantine-root")


def build_parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(prog="alive", description="ALIVE repository-local pipeline runtime")
    commands = root.add_subparsers(dest="command", required=True)

    doctor = commands.add_parser("doctor")
    add_common_output(doctor)
    doctor.set_defaults(func=command_doctor)

    high1_matrix = commands.add_parser("high1-matrix")
    add_common_output(high1_matrix)
    high1_matrix.set_defaults(func=command_high1_matrix)

    rule_pack = commands.add_parser("rule-pack-inspect")
    add_common_output(rule_pack)
    rule_pack.set_defaults(func=command_rule_pack_inspect)

    universal_ir_validate = commands.add_parser("universal-ir-validate")
    universal_ir_validate.add_argument("--input", required=True)
    universal_ir_validate.add_argument("--json", action="store_true")
    universal_ir_validate.set_defaults(func=command_universal_ir_validate)

    variant_proof_validate = commands.add_parser("variant-proof-validate")
    variant_proof_validate.add_argument("--input", required=True)
    variant_proof_validate.add_argument("--json", action="store_true")
    variant_proof_validate.set_defaults(func=command_variant_proof_validate)

    variant_proof_reduce = commands.add_parser("variant-proof-reduce")
    variant_proof_reduce.add_argument("--input", required=True)
    variant_proof_reduce.add_argument(
        "--evidence-ref",
        action="append",
        help="resolvable evidence id; repeat once per evidence reference",
    )
    variant_proof_reduce.add_argument("--json", action="store_true")
    variant_proof_reduce.set_defaults(func=command_variant_proof_reduce)

    family_capability = commands.add_parser("family-capability")
    family_capability.add_argument("--family")
    family_capability.add_argument("--transform", default="numeric")
    family_capability.add_argument("--json", action="store_true")
    family_capability.set_defaults(func=command_family_capability)

    universal_plan = commands.add_parser("universal-plan")
    universal_plan.add_argument("--input", required=True, help="source question JSON array or {questions: []}")
    universal_plan.add_argument("--target-classes", default="A,B,C")
    universal_plan.add_argument("--json", action="store_true")
    universal_plan.set_defaults(func=command_universal_plan)

    universal_phase7_audit = commands.add_parser("universal-phase7-audit")
    universal_phase7_audit.add_argument("--run", action="append", required=True, help="authoritative universal Run id; repeat for a batch")
    universal_phase7_audit.add_argument("--output")
    universal_phase7_audit.add_argument("--json", action="store_true")
    universal_phase7_audit.set_defaults(func=command_universal_phase7_audit)

    universal_high1_prepare = commands.add_parser("universal-high1-prepare")
    universal_high1_prepare.add_argument("--run-id", required=True)
    universal_high1_prepare.add_argument("--title", required=True)
    add_common_output(universal_high1_prepare)
    universal_high1_prepare.set_defaults(func=command_universal_high1_prepare)

    universal_high1_variant_prepare = commands.add_parser("universal-high1-variant-prepare")
    universal_high1_variant_prepare.add_argument("--run-id", required=True)
    universal_high1_variant_prepare.add_argument("--title", required=True)
    universal_high1_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    universal_high1_variant_prepare.add_argument("--fixture-scope", choices=("ordinary_per_unit", "all_structured"), default="all_structured")
    add_common_output(universal_high1_variant_prepare)
    universal_high1_variant_prepare.set_defaults(func=command_universal_high1_variant_prepare)

    universal_high1_capability = commands.add_parser("universal-high1-capability")
    universal_high1_capability.add_argument("--output")
    universal_high1_capability.add_argument("--json", action="store_true")
    universal_high1_capability.set_defaults(func=command_universal_high1_capability)

    universal_middle_school_variant_prepare = commands.add_parser("universal-middle-school-variant-prepare")
    universal_middle_school_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_variant_prepare)
    universal_middle_school_variant_prepare.set_defaults(func=command_universal_middle_school_variant_prepare)

    universal_middle_school_capability = commands.add_parser("universal-middle-school-capability")
    universal_middle_school_capability.add_argument("--output")
    universal_middle_school_capability.add_argument("--json", action="store_true")
    universal_middle_school_capability.set_defaults(func=command_universal_middle_school_capability)

    universal_middle_school_function_variant_prepare = commands.add_parser("universal-middle-school-function-variant-prepare")
    universal_middle_school_function_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_function_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_function_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_function_variant_prepare)
    universal_middle_school_function_variant_prepare.set_defaults(func=command_universal_middle_school_function_variant_prepare)

    universal_middle_school_function_capability = commands.add_parser("universal-middle-school-function-capability")
    universal_middle_school_function_capability.add_argument("--output")
    universal_middle_school_function_capability.add_argument("--json", action="store_true")
    universal_middle_school_function_capability.set_defaults(func=command_universal_middle_school_function_capability)

    universal_middle_school_geometry_variant_prepare = commands.add_parser("universal-middle-school-geometry-variant-prepare")
    universal_middle_school_geometry_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_geometry_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_geometry_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_geometry_variant_prepare)
    universal_middle_school_geometry_variant_prepare.set_defaults(func=command_universal_middle_school_geometry_variant_prepare)

    universal_middle_school_geometry_capability = commands.add_parser("universal-middle-school-geometry-capability")
    universal_middle_school_geometry_capability.add_argument("--output")
    universal_middle_school_geometry_capability.add_argument("--json", action="store_true")
    universal_middle_school_geometry_capability.set_defaults(func=command_universal_middle_school_geometry_capability)

    universal_middle_school_quadrilateral_variant_prepare = commands.add_parser("universal-middle-school-quadrilateral-variant-prepare")
    universal_middle_school_quadrilateral_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_quadrilateral_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_quadrilateral_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_quadrilateral_variant_prepare)
    universal_middle_school_quadrilateral_variant_prepare.set_defaults(func=command_universal_middle_school_quadrilateral_variant_prepare)

    universal_middle_school_quadrilateral_capability = commands.add_parser("universal-middle-school-quadrilateral-capability")
    universal_middle_school_quadrilateral_capability.add_argument("--output")
    universal_middle_school_quadrilateral_capability.add_argument("--json", action="store_true")
    universal_middle_school_quadrilateral_capability.set_defaults(func=command_universal_middle_school_quadrilateral_capability)

    universal_middle_school_similarity_variant_prepare = commands.add_parser("universal-middle-school-similarity-variant-prepare")
    universal_middle_school_similarity_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_similarity_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_similarity_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_similarity_variant_prepare)
    universal_middle_school_similarity_variant_prepare.set_defaults(func=command_universal_middle_school_similarity_variant_prepare)

    universal_middle_school_similarity_capability = commands.add_parser("universal-middle-school-similarity-capability")
    universal_middle_school_similarity_capability.add_argument("--output")
    universal_middle_school_similarity_capability.add_argument("--json", action="store_true")
    universal_middle_school_similarity_capability.set_defaults(func=command_universal_middle_school_similarity_capability)

    universal_middle_school_parallel_ratio_variant_prepare = commands.add_parser("universal-middle-school-parallel-ratio-variant-prepare")
    universal_middle_school_parallel_ratio_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_parallel_ratio_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_parallel_ratio_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_parallel_ratio_variant_prepare)
    universal_middle_school_parallel_ratio_variant_prepare.set_defaults(func=command_universal_middle_school_parallel_ratio_variant_prepare)

    universal_middle_school_parallel_ratio_capability = commands.add_parser("universal-middle-school-parallel-ratio-capability")
    universal_middle_school_parallel_ratio_capability.add_argument("--output")
    universal_middle_school_parallel_ratio_capability.add_argument("--json", action="store_true")
    universal_middle_school_parallel_ratio_capability.set_defaults(func=command_universal_middle_school_parallel_ratio_capability)

    universal_middle_school_pythagorean_variant_prepare = commands.add_parser("universal-middle-school-pythagorean-variant-prepare")
    universal_middle_school_pythagorean_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_pythagorean_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_pythagorean_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_pythagorean_variant_prepare)
    universal_middle_school_pythagorean_variant_prepare.set_defaults(func=command_universal_middle_school_pythagorean_variant_prepare)

    universal_middle_school_pythagorean_capability = commands.add_parser("universal-middle-school-pythagorean-capability")
    universal_middle_school_pythagorean_capability.add_argument("--output")
    universal_middle_school_pythagorean_capability.add_argument("--json", action="store_true")
    universal_middle_school_pythagorean_capability.set_defaults(func=command_universal_middle_school_pythagorean_capability)

    universal_middle_school_pythagorean_application_variant_prepare = commands.add_parser("universal-middle-school-pythagorean-application-variant-prepare")
    universal_middle_school_pythagorean_application_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_pythagorean_application_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_pythagorean_application_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_pythagorean_application_variant_prepare)
    universal_middle_school_pythagorean_application_variant_prepare.set_defaults(func=command_universal_middle_school_pythagorean_application_variant_prepare)

    universal_middle_school_pythagorean_application_capability = commands.add_parser("universal-middle-school-pythagorean-application-capability")
    universal_middle_school_pythagorean_application_capability.add_argument("--output")
    universal_middle_school_pythagorean_application_capability.add_argument("--json", action="store_true")
    universal_middle_school_pythagorean_application_capability.set_defaults(func=command_universal_middle_school_pythagorean_application_capability)

    universal_middle_school_probability_variant_prepare = commands.add_parser("universal-middle-school-probability-variant-prepare")
    universal_middle_school_probability_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_probability_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_probability_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    universal_middle_school_probability_variant_prepare.add_argument("--family-id", choices=("PROBABILITY_BASIC", "PROBABILITY_COUNTING"), required=True)
    add_common_output(universal_middle_school_probability_variant_prepare)
    universal_middle_school_probability_variant_prepare.set_defaults(func=command_universal_middle_school_probability_variant_prepare)

    universal_middle_school_probability_capability = commands.add_parser("universal-middle-school-probability-capability")
    universal_middle_school_probability_capability.add_argument("--family-id", choices=("PROBABILITY_BASIC", "PROBABILITY_COUNTING"), required=True)
    universal_middle_school_probability_capability.add_argument("--output")
    universal_middle_school_probability_capability.add_argument("--json", action="store_true")
    universal_middle_school_probability_capability.set_defaults(func=command_universal_middle_school_probability_capability)

    universal_middle_school_prime_factorization_variant_prepare = commands.add_parser("universal-middle-school-prime-factorization-variant-prepare")
    universal_middle_school_prime_factorization_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_prime_factorization_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_prime_factorization_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_prime_factorization_variant_prepare)
    universal_middle_school_prime_factorization_variant_prepare.set_defaults(func=command_universal_middle_school_prime_factorization_variant_prepare)

    universal_middle_school_prime_factorization_capability = commands.add_parser("universal-middle-school-prime-factorization-capability")
    universal_middle_school_prime_factorization_capability.add_argument("--output")
    universal_middle_school_prime_factorization_capability.add_argument("--json", action="store_true")
    universal_middle_school_prime_factorization_capability.set_defaults(func=command_universal_middle_school_prime_factorization_capability)

    universal_middle_school_rational_arithmetic_variant_prepare = commands.add_parser("universal-middle-school-rational-arithmetic-variant-prepare")
    universal_middle_school_rational_arithmetic_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_rational_arithmetic_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_rational_arithmetic_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_rational_arithmetic_variant_prepare)
    universal_middle_school_rational_arithmetic_variant_prepare.set_defaults(func=command_universal_middle_school_rational_arithmetic_variant_prepare)

    universal_middle_school_rational_arithmetic_capability = commands.add_parser("universal-middle-school-rational-arithmetic-capability")
    universal_middle_school_rational_arithmetic_capability.add_argument("--output")
    universal_middle_school_rational_arithmetic_capability.add_argument("--json", action="store_true")
    universal_middle_school_rational_arithmetic_capability.set_defaults(func=command_universal_middle_school_rational_arithmetic_capability)

    universal_middle_school_coordinate_plane_variant_prepare = commands.add_parser("universal-middle-school-coordinate-plane-variant-prepare")
    universal_middle_school_coordinate_plane_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_coordinate_plane_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_coordinate_plane_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_coordinate_plane_variant_prepare)
    universal_middle_school_coordinate_plane_variant_prepare.set_defaults(func=command_universal_middle_school_coordinate_plane_variant_prepare)

    universal_middle_school_coordinate_plane_capability = commands.add_parser("universal-middle-school-coordinate-plane-capability")
    universal_middle_school_coordinate_plane_capability.add_argument("--output")
    universal_middle_school_coordinate_plane_capability.add_argument("--json", action="store_true")
    universal_middle_school_coordinate_plane_capability.set_defaults(func=command_universal_middle_school_coordinate_plane_capability)

    universal_middle_school_basic_geometry_variant_prepare = commands.add_parser("universal-middle-school-basic-geometry-variant-prepare")
    universal_middle_school_basic_geometry_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_basic_geometry_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_basic_geometry_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_basic_geometry_variant_prepare)
    universal_middle_school_basic_geometry_variant_prepare.set_defaults(func=command_universal_middle_school_basic_geometry_variant_prepare)

    universal_middle_school_basic_geometry_capability = commands.add_parser("universal-middle-school-basic-geometry-capability")
    universal_middle_school_basic_geometry_capability.add_argument("--output")
    universal_middle_school_basic_geometry_capability.add_argument("--json", action="store_true")
    universal_middle_school_basic_geometry_capability.set_defaults(func=command_universal_middle_school_basic_geometry_capability)

    universal_middle_school_polygon_circle_measure_variant_prepare = commands.add_parser("universal-middle-school-polygon-circle-measure-variant-prepare")
    universal_middle_school_polygon_circle_measure_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_polygon_circle_measure_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_polygon_circle_measure_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_polygon_circle_measure_variant_prepare)
    universal_middle_school_polygon_circle_measure_variant_prepare.set_defaults(func=command_universal_middle_school_polygon_circle_measure_variant_prepare)

    universal_middle_school_polygon_circle_measure_capability = commands.add_parser("universal-middle-school-polygon-circle-measure-capability")
    universal_middle_school_polygon_circle_measure_capability.add_argument("--output")
    universal_middle_school_polygon_circle_measure_capability.add_argument("--json", action="store_true")
    universal_middle_school_polygon_circle_measure_capability.set_defaults(func=command_universal_middle_school_polygon_circle_measure_capability)

    universal_middle_school_solid_figure_measure_variant_prepare = commands.add_parser("universal-middle-school-solid-figure-measure-variant-prepare")
    universal_middle_school_solid_figure_measure_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_solid_figure_measure_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_solid_figure_measure_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_solid_figure_measure_variant_prepare)
    universal_middle_school_solid_figure_measure_variant_prepare.set_defaults(func=command_universal_middle_school_solid_figure_measure_variant_prepare)

    universal_middle_school_solid_figure_measure_capability = commands.add_parser("universal-middle-school-solid-figure-measure-capability")
    universal_middle_school_solid_figure_measure_capability.add_argument("--output")
    universal_middle_school_solid_figure_measure_capability.add_argument("--json", action="store_true")
    universal_middle_school_solid_figure_measure_capability.set_defaults(func=command_universal_middle_school_solid_figure_measure_capability)

    universal_middle_school_data_variant_prepare = commands.add_parser("universal-middle-school-data-variant-prepare")
    universal_middle_school_data_variant_prepare.add_argument("--run-id", required=True)
    universal_middle_school_data_variant_prepare.add_argument("--title", required=True)
    universal_middle_school_data_variant_prepare.add_argument("--variant-class", choices=("A", "B", "C"), required=True)
    add_common_output(universal_middle_school_data_variant_prepare)
    universal_middle_school_data_variant_prepare.set_defaults(func=command_universal_middle_school_data_variant_prepare)

    universal_middle_school_data_capability = commands.add_parser("universal-middle-school-data-capability")
    universal_middle_school_data_capability.add_argument("--output")
    universal_middle_school_data_capability.add_argument("--json", action="store_true")
    universal_middle_school_data_capability.set_defaults(func=command_universal_middle_school_data_capability)

    curriculum_adapter_report = commands.add_parser("curriculum-adapter-report")
    curriculum_adapter_report.add_argument("--json", action="store_true")
    curriculum_adapter_report.set_defaults(func=command_curriculum_adapter_report)

    curriculum_catalog_report = commands.add_parser("curriculum-catalog-report")
    curriculum_catalog_report.add_argument("--json", action="store_true")
    curriculum_catalog_report.set_defaults(func=command_curriculum_catalog_report)

    universal_run_start = commands.add_parser("universal-run-start")
    universal_run_start.add_argument("--run-id", required=True)
    universal_run_start.add_argument("--source-lock", required=True)
    universal_run_start.add_argument("--question-count", required=True, type=int)
    universal_run_start.add_argument("--batch-plan", required=True)
    add_common_output(universal_run_start)
    universal_run_start.set_defaults(func=command_universal_run_start)

    universal_run_status = commands.add_parser("universal-run-status")
    universal_run_status.add_argument("--run", required=True)
    add_common_output(universal_run_status)
    universal_run_status.set_defaults(func=command_universal_run_status)

    universal_run_resume = commands.add_parser("universal-run-resume")
    universal_run_resume.add_argument("--run", required=True)
    universal_run_resume.add_argument("--batch-plan")
    add_common_output(universal_run_resume)
    universal_run_resume.set_defaults(func=command_universal_run_resume)

    universal_run_stage = commands.add_parser("universal-run-stage")
    universal_run_stage.add_argument("--run", required=True)
    universal_run_stage.add_argument("--stage", required=True)
    universal_run_stage.add_argument("--status", choices=("PASS", "HOLD", "BLOCKED", "FAIL"), required=True)
    universal_run_stage.add_argument("--evidence", required=True)
    add_common_output(universal_run_stage)
    universal_run_stage.set_defaults(func=command_universal_run_stage)

    universal_run_candidates = commands.add_parser("universal-run-candidates")
    universal_run_candidates.add_argument("--run", required=True)
    universal_run_candidates.add_argument("--input", required=True, help="candidate JSON array or {candidates: []}")
    add_common_output(universal_run_candidates)
    universal_run_candidates.set_defaults(func=command_universal_run_candidates)

    universal_run_precheck = commands.add_parser("universal-run-precheck")
    universal_run_precheck.add_argument("--run", required=True)
    universal_run_precheck.add_argument("--input", required=True, help="{rows: [], evidenceCatalog: []}")
    add_common_output(universal_run_precheck)
    universal_run_precheck.set_defaults(func=command_universal_run_precheck)

    universal_run_review = commands.add_parser("universal-run-review")
    universal_run_review.add_argument("--run", required=True)
    universal_run_review.add_argument("--round", choices=("review1", "review2"), required=True)
    universal_run_review.add_argument("--input", required=True, help="{ledger: {}, evidenceCatalog: []}")
    add_common_output(universal_run_review)
    universal_run_review.set_defaults(func=command_universal_run_review)

    universal_run_revision = commands.add_parser("universal-run-revision")
    universal_run_revision.add_argument("--run", required=True)
    universal_run_revision.add_argument("--input", required=True, help="bounded revision report JSON")
    add_common_output(universal_run_revision)
    universal_run_revision.set_defaults(func=command_universal_run_revision)

    universal_run_mother_final = commands.add_parser("universal-run-mother-final")
    universal_run_mother_final.add_argument("--run", required=True)
    add_common_output(universal_run_mother_final)
    universal_run_mother_final.set_defaults(func=command_universal_run_mother_final)

    universal_run_assemble = commands.add_parser("universal-run-assemble")
    universal_run_assemble.add_argument("--run", required=True)
    universal_run_assemble.add_argument("--title", required=True)
    universal_run_assemble.add_argument("--archive-root")
    add_common_output(universal_run_assemble)
    universal_run_assemble.set_defaults(func=command_universal_run_assemble)

    universal_run_ledger = commands.add_parser("universal-run-ledger")
    universal_run_ledger.add_argument("--run", required=True)
    universal_run_ledger.add_argument("--input", required=True, help="variant rows JSON array or {rows: []}")
    add_common_output(universal_run_ledger)
    universal_run_ledger.set_defaults(func=command_universal_run_ledger)

    universal_run_render = commands.add_parser("universal-run-render")
    universal_run_render.add_argument("--run", required=True)
    universal_run_render.add_argument("--input", required=True, help="actual production-engine browser evidence JSON")
    add_common_output(universal_run_render)
    universal_run_render.set_defaults(func=command_universal_run_render)

    universal_run_package = commands.add_parser("universal-run-package")
    universal_run_package.add_argument("--run", required=True)
    universal_run_package.add_argument("--file", action="append", help="Run-relative package member; repeatable")
    add_common_output(universal_run_package)
    universal_run_package.set_defaults(func=command_universal_run_package)

    universal_run_closure = commands.add_parser("universal-run-closure")
    universal_run_closure.add_argument("--run", required=True)
    universal_run_closure.add_argument("--input", required=True, help="PASS closure report JSON")
    add_common_output(universal_run_closure)
    universal_run_closure.set_defaults(func=command_universal_run_closure)

    universal_run_seal = commands.add_parser("universal-run-seal")
    universal_run_seal.add_argument("--run", required=True)
    add_common_output(universal_run_seal)
    universal_run_seal.set_defaults(func=command_universal_run_seal)

    universal_high1_finalize = commands.add_parser("universal-high1-finalize")
    universal_high1_finalize.add_argument("--run", required=True)
    universal_high1_finalize.add_argument("--render-evidence", required=True)
    universal_high1_finalize.add_argument("--review-ledger", required=True)
    universal_high1_finalize.add_argument("--external-findings", required=True)
    add_common_output(universal_high1_finalize)
    universal_high1_finalize.set_defaults(func=command_universal_high1_finalize)

    universal_bounded_finalize = commands.add_parser("universal-bounded-finalize")
    universal_bounded_finalize.add_argument("--run", required=True)
    universal_bounded_finalize.add_argument("--render-evidence", required=True)
    universal_bounded_finalize.add_argument("--external-findings", required=True)
    add_common_output(universal_bounded_finalize)
    universal_bounded_finalize.set_defaults(func=command_universal_bounded_finalize)

    runtime_finalize = commands.add_parser("runtime-finalize")
    runtime_finalize.add_argument("--run", required=True)
    runtime_finalize.add_argument(
        "--runtime-kind",
        choices=("legacy", "fast", "staged", "adaptive"),
        default="adaptive",
    )
    runtime_finalize.add_argument("--result-root")
    runtime_finalize.add_argument("--quarantine-root")
    runtime_finalize.add_argument("--allow-blocked", action="store_true")
    runtime_finalize.add_argument("--keep-workdir", action="store_true")
    add_common_output(runtime_finalize)
    runtime_finalize.set_defaults(func=command_runtime_finalize)

    runtime_gc_command = commands.add_parser("runtime-gc")
    runtime_gc_command.add_argument("--older-than-hours", type=float, default=24)
    runtime_gc_command.add_argument("--apply", action="store_true")
    runtime_gc_command.add_argument("--include-blocked", action="store_true")
    runtime_gc_command.add_argument("--result-root")
    runtime_gc_command.add_argument("--quarantine-root")
    add_common_output(runtime_gc_command)
    runtime_gc_command.set_defaults(func=command_runtime_gc)

    resolve = commands.add_parser("resolve")
    resolve.add_argument("--query", required=True)
    resolve.add_argument("--question", type=int)
    resolve.add_argument("--limit", type=int, default=10)
    resolve.add_argument("--json", action="store_true")
    resolve.set_defaults(func=command_resolve)

    start = commands.add_parser("start")
    start.add_argument("--query")
    start.add_argument("--source-file")
    start.add_argument("--question", type=int)
    start.add_argument("--mode", choices=GENERATION_MODES, default="EXAM_FOLLOWUP")
    start.add_argument("--followup-kind", choices=FOLLOWUP_KINDS, default="CONFIRMATION")
    start.add_argument("--operation-mode", choices=OPERATION_MODES, default="GENERATE")
    start.add_argument("--output-profile", choices=OUTPUT_PROFILES, default="JS_ARCHIVE")
    start.add_argument("--limit", type=int, default=10)
    add_common_output(start)
    start.set_defaults(func=command_start)

    status = commands.add_parser("status")
    status.add_argument("--run", required=True)
    add_common_output(status)
    status.set_defaults(func=command_status)

    resume = commands.add_parser("resume")
    resume.add_argument("--run", required=True)
    resume.add_argument("--source-file")
    resume.add_argument("--question", type=int)
    add_common_output(resume)
    resume.set_defaults(func=command_resume)

    listing = commands.add_parser("list")
    listing.add_argument("--limit", type=int, default=20)
    add_common_output(listing)
    listing.set_defaults(func=command_list)

    prepare = commands.add_parser("prepare")
    prepare.add_argument("--run", required=True)
    add_common_output(prepare)
    prepare.set_defaults(func=command_prepare)

    submit = commands.add_parser("submit")
    submit.add_argument("--run", required=True)
    submit.add_argument("--task", required=True)
    submit.add_argument("--file", required=True)
    add_common_output(submit)
    submit.set_defaults(func=command_submit)

    dispatch_start = commands.add_parser("dispatch-start")
    dispatch_start.add_argument("--run", required=True)
    dispatch_start.add_argument("--task", required=True)
    dispatch_start.add_argument("--external-id", required=True)
    dispatch_start.add_argument("--route")
    add_common_output(dispatch_start)
    dispatch_start.set_defaults(func=command_dispatch_start)

    dispatch_fail = commands.add_parser("dispatch-fail")
    dispatch_fail.add_argument("--run", required=True)
    dispatch_fail.add_argument("--task", required=True)
    dispatch_fail.add_argument("--code", required=True)
    add_common_output(dispatch_fail)
    dispatch_fail.set_defaults(func=command_dispatch_fail)

    reduce_command = commands.add_parser("reduce")
    reduce_command.add_argument("--run", required=True)
    add_common_output(reduce_command)
    reduce_command.set_defaults(func=command_reduce)

    adapt = commands.add_parser("adapt")
    adapt.add_argument("--run", required=True)
    adapt.add_argument("--context", required=True)
    add_common_output(adapt)
    adapt.set_defaults(func=command_adapt)

    serialize = commands.add_parser("serialize")
    serialize.add_argument("--run", required=True)
    serialize.add_argument("--title", required=True)
    add_common_output(serialize)
    serialize.set_defaults(func=command_serialize)

    record_render = commands.add_parser("record-render")
    record_render.add_argument("--run", required=True)
    record_render.add_argument("--file", required=True)
    add_common_output(record_render)
    record_render.set_defaults(func=command_record_render)

    package = commands.add_parser("package")
    package.add_argument("--run", required=True)
    add_common_output(package)
    package.set_defaults(func=command_package)

    freeze = commands.add_parser("freeze")
    freeze.add_argument("--run", required=True)
    add_common_output(freeze)
    freeze.set_defaults(func=command_freeze)

    exam_preflight = commands.add_parser("exam-preflight")
    exam_preflight.add_argument("--source-file", required=True)
    exam_preflight.add_argument("--json", action="store_true")
    exam_preflight.set_defaults(func=command_exam_preflight)

    exam_start = commands.add_parser("exam-start")
    exam_start.add_argument("--source-file", required=True)
    exam_start.add_argument("--query")
    add_common_output(exam_start)
    exam_start.set_defaults(func=command_exam_start)

    exam_sync = commands.add_parser("exam-sync")
    exam_sync.add_argument("--run", required=True)
    add_common_output(exam_sync)
    exam_sync.set_defaults(func=command_exam_sync)

    exam_status = commands.add_parser("exam-status")
    exam_status.add_argument("--run", required=True)
    add_common_output(exam_status)
    exam_status.set_defaults(func=command_exam_status)

    exam_assemble = commands.add_parser("exam-assemble")
    exam_assemble.add_argument("--run", required=True)
    exam_assemble.add_argument("--title", required=True)
    add_common_output(exam_assemble)
    exam_assemble.set_defaults(func=command_exam_assemble)

    exam_render = commands.add_parser("exam-record-render")
    exam_render.add_argument("--run", required=True)
    exam_render.add_argument("--file", required=True)
    add_common_output(exam_render)
    exam_render.set_defaults(func=command_exam_record_render)

    exam_package = commands.add_parser("exam-package")
    exam_package.add_argument("--run", required=True)
    add_common_output(exam_package)
    exam_package.set_defaults(func=command_exam_package)

    fast_exam_start = commands.add_parser("fast-exam-start")
    fast_exam_start.add_argument("--source-file")
    fast_exam_start.add_argument("--query")
    fast_exam_start.add_argument("--limit", type=int, default=10)
    fast_exam_start.add_argument(
        "--variation-mode",
        choices=("CONFIRMATION", "STRUCTURAL_VARIANT"),
        default="STRUCTURAL_VARIANT",
        help="CONFIRMATION allows numeric confirmation; STRUCTURAL_VARIANT requires a non-numeric structural change",
    )
    add_common_output(fast_exam_start)
    fast_exam_start.set_defaults(func=command_fast_exam_start)

    fast_exam_prepare = commands.add_parser("fast-exam-prepare")
    fast_exam_prepare.add_argument("--run", required=True)
    add_common_output(fast_exam_prepare)
    fast_exam_prepare.set_defaults(func=command_fast_exam_prepare)

    fast_exam_status = commands.add_parser("fast-exam-status")
    fast_exam_status.add_argument("--run", required=True)
    add_common_output(fast_exam_status)
    fast_exam_status.set_defaults(func=command_fast_exam_status)

    fast_dispatch_start = commands.add_parser("fast-dispatch-start")
    fast_dispatch_start.add_argument("--run", required=True)
    fast_dispatch_start.add_argument("--task", required=True)
    fast_dispatch_start.add_argument("--external-id", required=True)
    fast_dispatch_start.add_argument("--route")
    add_common_output(fast_dispatch_start)
    fast_dispatch_start.set_defaults(func=command_fast_dispatch_start)

    fast_dispatch_fail = commands.add_parser("fast-dispatch-fail")
    fast_dispatch_fail.add_argument("--run", required=True)
    fast_dispatch_fail.add_argument("--task", required=True)
    fast_dispatch_fail.add_argument("--code", required=True)
    add_common_output(fast_dispatch_fail)
    fast_dispatch_fail.set_defaults(func=command_fast_dispatch_fail)

    fast_submit = commands.add_parser("fast-submit")
    fast_submit.add_argument("--run", required=True)
    fast_submit.add_argument("--task", required=True)
    fast_submit.add_argument("--file", required=True)
    add_common_output(fast_submit)
    fast_submit.set_defaults(func=command_fast_submit)

    fast_reconcile = commands.add_parser("fast-reconcile")
    fast_reconcile.add_argument("--run", required=True)
    add_common_output(fast_reconcile)
    fast_reconcile.set_defaults(func=command_fast_reconcile)

    fast_exam_assemble = commands.add_parser("fast-exam-assemble")
    fast_exam_assemble.add_argument("--run", required=True)
    fast_exam_assemble.add_argument("--title")
    add_common_output(fast_exam_assemble)
    fast_exam_assemble.set_defaults(func=command_fast_exam_assemble)

    fast_exam_render = commands.add_parser("fast-exam-record-render")
    fast_exam_render.add_argument("--run", required=True)
    fast_exam_render.add_argument("--file", required=True)
    add_common_output(fast_exam_render)
    fast_exam_render.set_defaults(func=command_fast_exam_record_render)

    fast_exam_package = commands.add_parser("fast-exam-package")
    fast_exam_package.add_argument("--run", required=True)
    add_common_output(fast_exam_package)
    add_package_cleanup(fast_exam_package)
    fast_exam_package.set_defaults(func=command_fast_exam_package)

    staged_exam_start = commands.add_parser("staged-exam-start")
    staged_exam_start.add_argument("--source-file")
    staged_exam_start.add_argument("--query")
    staged_exam_start.add_argument("--question", type=int)
    staged_exam_start.add_argument("--limit", type=int, default=10)
    staged_exam_start.add_argument(
        "--batch-count",
        type=int,
        default=4,
        help="number of whole-exam batches, capped at four",
    )
    staged_exam_start.add_argument(
        "--variation-mode",
        choices=("QUICK", "STRUCTURAL_VARIANT"),
        default="QUICK",
        help="QUICK keeps the first MVP permissive; STRUCTURAL_VARIANT requests a structural change",
    )
    add_common_output(staged_exam_start)
    staged_exam_start.set_defaults(func=command_staged_exam_start)

    staged_exam_status = commands.add_parser("staged-exam-status")
    staged_exam_status.add_argument("--run", required=True)
    add_common_output(staged_exam_status)
    staged_exam_status.set_defaults(func=command_staged_exam_status)

    staged_dispatch_start = commands.add_parser("staged-dispatch-start")
    staged_dispatch_start.add_argument("--run", required=True)
    staged_dispatch_start.add_argument("--task", required=True)
    staged_dispatch_start.add_argument("--external-id", required=True)
    staged_dispatch_start.add_argument("--route")
    add_common_output(staged_dispatch_start)
    staged_dispatch_start.set_defaults(func=command_staged_dispatch_start)

    staged_dispatch_fail = commands.add_parser("staged-dispatch-fail")
    staged_dispatch_fail.add_argument("--run", required=True)
    staged_dispatch_fail.add_argument("--task", required=True)
    staged_dispatch_fail.add_argument("--code", required=True)
    add_common_output(staged_dispatch_fail)
    staged_dispatch_fail.set_defaults(func=command_staged_dispatch_fail)

    staged_recover = commands.add_parser("staged-recover")
    staged_recover.add_argument("--run", required=True)
    staged_recover.add_argument("--task", required=True)
    add_common_output(staged_recover)
    staged_recover.set_defaults(func=command_staged_recover)

    staged_mark_complete = commands.add_parser("staged-mark-complete")
    staged_mark_complete.add_argument("--run", required=True)
    staged_mark_complete.add_argument("--task", required=True)
    add_common_output(staged_mark_complete)
    staged_mark_complete.set_defaults(func=command_staged_mark_complete)

    staged_reconcile = commands.add_parser("staged-reconcile")
    staged_reconcile.add_argument("--run", required=True)
    add_common_output(staged_reconcile)
    staged_reconcile.set_defaults(func=command_staged_reconcile)

    staged_exam_parent_resolve = commands.add_parser("staged-exam-parent-resolve")
    staged_exam_parent_resolve.add_argument("--run", required=True)
    staged_exam_parent_resolve.add_argument("--file", required=True)
    add_common_output(staged_exam_parent_resolve)
    staged_exam_parent_resolve.set_defaults(func=command_staged_exam_parent_resolve)

    staged_exam_assemble = commands.add_parser("staged-exam-assemble")
    staged_exam_assemble.add_argument("--run", required=True)
    staged_exam_assemble.add_argument("--title")
    add_common_output(staged_exam_assemble)
    staged_exam_assemble.set_defaults(func=command_staged_exam_assemble)

    staged_exam_render = commands.add_parser("staged-exam-record-render")
    staged_exam_render.add_argument("--run", required=True)
    staged_exam_render.add_argument("--file", required=True)
    add_common_output(staged_exam_render)
    staged_exam_render.set_defaults(func=command_staged_exam_record_render)

    staged_exam_package = commands.add_parser("staged-exam-package")
    staged_exam_package.add_argument("--run", required=True)
    add_common_output(staged_exam_package)
    add_package_cleanup(staged_exam_package)
    staged_exam_package.set_defaults(func=command_staged_exam_package)

    adaptive_exam_start = commands.add_parser("adaptive-staged-exam-start")
    adaptive_exam_start.add_argument("--source-file")
    adaptive_exam_start.add_argument("--query")
    adaptive_exam_start.add_argument("--question", type=int)
    adaptive_exam_start.add_argument("--limit", type=int, default=10)
    adaptive_exam_start.add_argument(
        "--batch-count",
        type=int,
        default=None,
        help="explicit batch count; omitted means automatic maximum four questions per batch",
    )
    adaptive_exam_start.add_argument(
        "--batch-strategy",
        choices=("AUTO", "FOUR_BALANCED"),
        default="AUTO",
        help="AUTO keeps the default small contiguous batches; FOUR_BALANCED uses four weighted batches",
    )
    adaptive_exam_start.add_argument("--variation-mode", choices=("QUICK", "STRUCTURAL_VARIANT"), default="QUICK")
    add_common_output(adaptive_exam_start)
    adaptive_exam_start.set_defaults(func=command_adaptive_exam_start)

    adaptive_status = commands.add_parser("adaptive-staged-exam-status")
    adaptive_status.add_argument("--run", required=True)
    add_common_output(adaptive_status)
    adaptive_status.set_defaults(func=command_adaptive_exam_status)

    adaptive_dispatch = commands.add_parser("adaptive-staged-dispatch-start")
    adaptive_dispatch.add_argument("--run", required=True)
    adaptive_dispatch.add_argument("--task", required=True)
    adaptive_dispatch.add_argument("--external-id", required=True)
    adaptive_dispatch.add_argument("--route")
    add_common_output(adaptive_dispatch)
    adaptive_dispatch.set_defaults(func=command_adaptive_dispatch_start)

    adaptive_dispatch_fail = commands.add_parser("adaptive-staged-dispatch-fail")
    adaptive_dispatch_fail.add_argument("--run", required=True)
    adaptive_dispatch_fail.add_argument("--task", required=True)
    adaptive_dispatch_fail.add_argument("--code", required=True)
    add_common_output(adaptive_dispatch_fail)
    adaptive_dispatch_fail.set_defaults(func=command_adaptive_dispatch_fail)

    adaptive_heartbeat = commands.add_parser("adaptive-staged-heartbeat")
    adaptive_heartbeat.add_argument("--run", required=True)
    adaptive_heartbeat.add_argument("--task", required=True)
    adaptive_heartbeat.add_argument("--phase", required=True)
    adaptive_heartbeat.add_argument("--progress", type=float)
    adaptive_heartbeat.add_argument("--note")
    add_common_output(adaptive_heartbeat)
    adaptive_heartbeat.set_defaults(func=command_adaptive_heartbeat)

    adaptive_resume = commands.add_parser("adaptive-staged-resume")
    adaptive_resume.add_argument("--run", required=True)
    adaptive_resume.add_argument(
        "--timeout-seconds", type=int, default=1800,
        help="stale dispatch timeout used by the watchdog",
    )
    add_common_output(adaptive_resume)
    adaptive_resume.set_defaults(func=command_adaptive_resume)

    adaptive_recover = commands.add_parser("adaptive-staged-recover")
    adaptive_recover.add_argument("--run", required=True)
    adaptive_recover.add_argument("--task", required=True)
    add_common_output(adaptive_recover)
    adaptive_recover.set_defaults(func=command_adaptive_recover)

    adaptive_revalidate = commands.add_parser("adaptive-staged-revalidate-review")
    adaptive_revalidate.add_argument("--run", required=True)
    adaptive_revalidate.add_argument("--task", required=True)
    add_common_output(adaptive_revalidate)
    adaptive_revalidate.set_defaults(func=command_adaptive_revalidate_review)

    adaptive_readiness = commands.add_parser("adaptive-staged-render-readiness")
    adaptive_readiness.add_argument("--run", required=True)
    adaptive_readiness.add_argument("--file", required=True)
    add_common_output(adaptive_readiness)
    adaptive_readiness.set_defaults(func=command_adaptive_render_readiness)

    adaptive_complete = commands.add_parser("adaptive-staged-mark-complete")
    adaptive_complete.add_argument("--run", required=True)
    adaptive_complete.add_argument("--task", required=True)
    add_common_output(adaptive_complete)
    adaptive_complete.set_defaults(func=command_adaptive_mark_complete)

    adaptive_reconcile = commands.add_parser("adaptive-staged-reconcile")
    adaptive_reconcile.add_argument("--run", required=True)
    add_common_output(adaptive_reconcile)
    adaptive_reconcile.set_defaults(func=command_adaptive_reconcile)

    adaptive_visual = commands.add_parser("adaptive-staged-visual-inspection")
    adaptive_visual.add_argument("--run", required=True)
    adaptive_visual.add_argument("--file", required=True)
    add_common_output(adaptive_visual)
    adaptive_visual.set_defaults(func=command_adaptive_visual_inspection)

    adaptive_correction = commands.add_parser("adaptive-staged-correction-start")
    adaptive_correction.add_argument("--run", required=True)
    add_common_output(adaptive_correction)
    adaptive_correction.set_defaults(func=command_adaptive_correction_start)

    adaptive_assemble = commands.add_parser("adaptive-staged-exam-assemble")
    adaptive_assemble.add_argument("--run", required=True)
    adaptive_assemble.add_argument("--title")
    add_common_output(adaptive_assemble)
    adaptive_assemble.set_defaults(func=command_adaptive_assemble)

    adaptive_render = commands.add_parser("adaptive-staged-exam-record-render")
    adaptive_render.add_argument("--run", required=True)
    adaptive_render.add_argument("--file", required=True)
    add_common_output(adaptive_render)
    adaptive_render.set_defaults(func=command_adaptive_render)

    adaptive_package = commands.add_parser("adaptive-staged-exam-package")
    adaptive_package.add_argument("--run", required=True)
    add_common_output(adaptive_package)
    add_package_cleanup(adaptive_package)
    adaptive_package.set_defaults(func=command_adaptive_package)

    canonicalize_package = commands.add_parser("similar-package-canonicalize")
    canonicalize_package.add_argument("--input", required=True)
    canonicalize_package.add_argument("--output", required=True)
    canonicalize_package.add_argument("--source-file", required=True)
    canonicalize_package.add_argument("--display-title")
    canonicalize_package.add_argument("--variant-class", choices=("A", "B", "C"), help="new similar identity class")
    add_common_output(canonicalize_package)
    canonicalize_package.set_defaults(func=command_canonicalize_similar_package)

    external_review = commands.add_parser("similar-package-external-review")
    external_review.add_argument("--input", required=True)
    external_review.add_argument("--output", required=True)
    external_review.add_argument("--source-file", required=True)
    add_common_output(external_review)
    external_review.set_defaults(func=command_external_review_package)

    final_closure = commands.add_parser("final-closure-audit")
    final_closure.add_argument("--input", required=True, help="final JS or ZIP to audit")
    final_closure.add_argument("--js-path", help="ZIP member path when the ZIP has more than one JS")
    final_closure.add_argument("--review-ledger", help="per-question independent review ledger JSON")
    final_closure.add_argument("--render-evidence", help="exam/solution/answer browser evidence JSON")
    final_closure.add_argument("--external-findings", help="external review findings JSON")
    final_closure.add_argument("--variant-proof-ledger", help="optional universal A/B/C variant proof ledger JSON")
    final_closure.add_argument("--output", help="write the final closure report JSON")
    add_common_output(final_closure)
    final_closure.set_defaults(func=command_final_closure_audit)

    visual_render = commands.add_parser("visual-render")
    visual_render.add_argument("--spec", required=True)
    visual_render.add_argument("--output", required=True)
    visual_render.add_argument("--report", required=True)
    visual_render.add_argument("--json", action="store_true")
    visual_render.set_defaults(func=command_visual_render)

    visual_benchmark = commands.add_parser("visual-benchmark")
    visual_benchmark.add_argument("--output")
    visual_benchmark.add_argument("--repeat", type=int, default=3)
    visual_benchmark.add_argument(
        "--topic",
        choices=("coordinate_plane", "line_equation", "shape_translation", "function", "inequality", "conic", "calculus"),
    )
    visual_benchmark.add_argument("--json", action="store_true")
    visual_benchmark.set_defaults(func=command_visual_benchmark)

    coordinate_benchmark = commands.add_parser("coordinate-benchmark")
    coordinate_benchmark.add_argument("--output")
    coordinate_benchmark.add_argument("--repeat", type=int, default=3)
    coordinate_benchmark.add_argument("--json", action="store_true")
    coordinate_benchmark.set_defaults(func=command_coordinate_benchmark)

    high1_benchmark = commands.add_parser("high1-benchmark")
    high1_benchmark.add_argument("--output")
    high1_benchmark.add_argument("--repeat", type=int, default=3)
    high1_benchmark.add_argument("--json", action="store_true")
    high1_benchmark.set_defaults(func=command_high1_benchmark)

    universal_variant_benchmark = commands.add_parser("universal-variant-benchmark")
    universal_variant_benchmark.add_argument("--output")
    universal_variant_benchmark.add_argument("--repeat", type=int, default=3)
    universal_variant_benchmark.add_argument("--json", action="store_true")
    universal_variant_benchmark.set_defaults(func=command_universal_variant_benchmark)

    high1_preview = commands.add_parser("high1-preview")
    high1_preview.add_argument("--unit", default="H22-C2-01")
    high1_preview.add_argument("--output")
    high1_preview.add_argument("--json", action="store_true")
    high1_preview.set_defaults(func=command_high1_preview)

    high1_operation = commands.add_parser("high1-operation-benchmark")
    high1_operation.add_argument("--output")
    high1_operation.add_argument("--json", action="store_true")
    high1_operation.set_defaults(func=command_high1_operation_benchmark)

    high1_operation_render = commands.add_parser("high1-operation-record-render")
    high1_operation_render.add_argument("--output", required=True)
    high1_operation_render.add_argument("--evidence", required=True)
    high1_operation_render.add_argument("--json", action="store_true")
    high1_operation_render.set_defaults(func=command_high1_operation_record_render)

    high1_finalize = commands.add_parser("high1-finalize-promotion")
    high1_finalize.add_argument("--unit-benchmark", required=True)
    high1_finalize.add_argument("--operation", required=True)
    high1_finalize.add_argument("--evidence", required=True)
    high1_finalize.add_argument("--report")
    high1_finalize.add_argument("--json", action="store_true")
    high1_finalize.set_defaults(func=command_high1_finalize_promotion)
    return root


def main(argv: list[str] | None = None) -> int:
    # Rule-pack paths include the repository's Unicode protocol filenames.
    # Keep inspection and JSON output usable on Windows consoles whose legacy
    # code page cannot encode those names.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")
    args = build_parser().parse_args(argv)
    try:
        return int(args.func(args))
    except (FileNotFoundError, ValueError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
