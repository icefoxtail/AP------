"""Local universal-engine Run/resume/package/SEALED lifecycle.

This lifecycle is intentionally separate from the existing staged B Run until
the universal candidate artifacts are ready to be connected.  It provides the
same interruption-safe properties: frozen batch plan, monotonic stages,
attempt-independent artifacts, package round-trip, and fail-closed sealing.
"""

from __future__ import annotations

import copy
import json
import os
import uuid
import zipfile
from pathlib import Path
from typing import Any, Iterable

from .run_store import RunStore, atomic_write_json, sha256_file, utc_now
from .phase3 import ARCHIVE_FIELDS, _archive_projection, _parse_serialized_js
from .universal_candidate import UniversalCandidateError, validate_universal_candidate
from .universal_ir import split_student_proof_ir, validate_universal_question_ir
from .universal_review import validate_universal_review_ledger
from .universal_variant_engine import build_variant_proof_ledger
from .visual_renderer import render_visual_spec


UNIVERSAL_RUNTIME_SCHEMA_VERSION = "0.1.0"
UNIVERSAL_STAGES = (
    "S00_SOURCE_LOCK",
    "S01_PREFLIGHT",
    "S01A_VISUAL_RECON",
    "S01B_UNIVERSAL_IR_ANALYSIS",
    "S01C_VARIANT_ROUTER_CAPABILITY",
    "S02_ROUND1_GENERATION",
    "S02A_VARIANT_PROOF_PRECHECK",
    "S03_REVIEW1",
    "S04_BOUNDED_REVISION",
    "S05_REVIEW2",
    "S06_MOTHER_FINAL",
    "S07_ASSEMBLY",
    "S08_BROWSER_RENDER",
    "S09_PACKAGE",
    "S09A_FINAL_CLOSURE",
    "SEALED",
)


class UniversalRuntimeError(ValueError):
    pass


def _atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            output.write(text)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


class UniversalRunStore(RunStore):
    _DIRECTORIES = ("source", "plans", "candidates", "evidence", "render", "final", "inbox", "tasks")

    def create(self, run_id: str, manifest: dict[str, Any]) -> Path:
        run_dir = self.run_dir(run_id)
        run_dir.mkdir(parents=False, exist_ok=False)
        for name in self._DIRECTORIES:
            (run_dir / name).mkdir()
        atomic_write_json(run_dir / "manifest.json", manifest)
        return run_dir


def _stage_status(manifest: dict[str, Any], stage_id: str) -> str:
    for stage in manifest.get("stages", []):
        if stage.get("stageId") == stage_id:
            return str(stage.get("status") or "PENDING")
    raise UniversalRuntimeError(f"unknown universal stage: {stage_id}")


def _canonical_batch_plan(batch_plan: list[list[int]]) -> str:
    return json.dumps(batch_plan, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _digest(text: str) -> str:
    import hashlib

    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def start_universal_run(
    runtime_root: Path,
    *,
    run_id: str,
    source_lock: dict[str, Any],
    question_count: int,
    batch_plan: list[list[int]],
) -> dict[str, Any]:
    """Create a universal Run with a frozen, validated batch plan."""

    if question_count < 1:
        raise UniversalRuntimeError("question_count must be positive")
    expected = set(range(1, question_count + 1))
    flattened = [ordinal for batch in batch_plan for ordinal in batch]
    if set(flattened) != expected or len(flattened) != len(set(flattened)):
        raise UniversalRuntimeError("batch_plan must cover every source ordinal exactly once")
    if not isinstance(source_lock, dict) or not source_lock.get("sha256"):
        raise UniversalRuntimeError("source_lock with sha256 is required")
    for field in ("sha256", "ruleSnapshotSha256"):
        value = source_lock.get(field)
        if not isinstance(value, str) or len(value) != 64 or any(char not in "0123456789abcdef" for char in value.lower()):
            raise UniversalRuntimeError(f"source_lock.{field} must be a lowercase SHA-256 hex digest")
    stages = [{"stageId": stage, "status": "PENDING", "evidence": []} for stage in UNIVERSAL_STAGES]
    stages[0]["status"] = "PASS"
    stages[0]["evidence"].append(str(source_lock["sha256"]))
    now = utc_now()
    manifest = {
        "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
        "artifactType": "ALIVE_UNIVERSAL_VARIANT_RUN",
        "runId": run_id,
        "createdAt": now,
        "updatedAt": now,
        "status": "RUNNING",
        "currentStage": "S01_PREFLIGHT",
        "sourceLock": copy.deepcopy(source_lock),
        "questionCount": question_count,
        "batchPlan": copy.deepcopy(batch_plan),
        "batchPlanSha256": _digest(_canonical_batch_plan(batch_plan)),
        "batchPlanFrozen": True,
        "stages": stages,
        "route": {"model": "gpt-5.6-luna", "reasoning": "xhigh"},
        "publicationStatus": "NOT_PUBLISHED",
        "events": [{"at": now, "type": "UNIVERSAL_RUN_CREATED"}],
    }
    store = UniversalRunStore(runtime_root)
    run_dir = store.create(run_id, manifest)
    source_lock_path = run_dir / "source/source-lock.json"
    batch_plan_path = run_dir / "plans/batch-plan.json"
    atomic_write_json(
        source_lock_path,
        {
            "artifactType": "ALIVE_UNIVERSAL_SOURCE_LOCK",
            "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
            "runId": run_id,
            "sourceLock": copy.deepcopy(source_lock),
        },
    )
    atomic_write_json(
        batch_plan_path,
        {
            "artifactType": "ALIVE_UNIVERSAL_BATCH_PLAN",
            "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
            "runId": run_id,
            "questionCount": question_count,
            "batchPlan": copy.deepcopy(batch_plan),
            "sha256": manifest["batchPlanSha256"],
        },
    )
    manifest["artifacts"] = {
        "sourceLock": "source/source-lock.json",
        "batchPlan": "plans/batch-plan.json",
    }
    store.save(run_id, manifest)
    return {"runId": run_id, "runDir": run_dir.as_posix(), "status": manifest["status"], "currentStage": manifest["currentStage"], "batchPlanSha256": manifest["batchPlanSha256"]}


def record_universal_stage(
    store: UniversalRunStore,
    run_id: str,
    stage_id: str,
    *,
    status: str,
    evidence: str,
    _internal: bool = False,
) -> dict[str, Any]:
    """Advance exactly one stage monotonically."""

    manifest = store.load(run_id)
    if manifest.get("status") == "SEALED_LOCAL":
        raise UniversalRuntimeError("sealed universal Run cannot be mutated")
    if stage_id not in UNIVERSAL_STAGES:
        raise UniversalRuntimeError(f"unknown universal stage: {stage_id}")
    if stage_id in {
        "S02_ROUND1_GENERATION",
        "S02A_VARIANT_PROOF_PRECHECK",
        "S03_REVIEW1",
        "S04_BOUNDED_REVISION",
        "S05_REVIEW2",
        "S06_MOTHER_FINAL",
        "S07_ASSEMBLY",
        "S08_BROWSER_RENDER",
        "S09_PACKAGE",
        "S09A_FINAL_CLOSURE",
        "SEALED",
    } and not _internal:
        raise UniversalRuntimeError(f"{stage_id} must be completed by its dedicated lifecycle command")
    index = UNIVERSAL_STAGES.index(stage_id)
    current = str(manifest.get("currentStage"))
    if current != stage_id:
        raise UniversalRuntimeError(f"universal stage is not current: expected {current}, received {stage_id}")
    if status not in {"PASS", "HOLD", "BLOCKED", "FAIL"}:
        raise UniversalRuntimeError("universal stage status is invalid")
    stage = manifest["stages"][index]
    stage["status"] = status
    stage.setdefault("evidence", []).append(str(evidence))
    if status == "PASS" and index + 1 < len(UNIVERSAL_STAGES):
        manifest["currentStage"] = UNIVERSAL_STAGES[index + 1]
        manifest["status"] = "RUNNING"
    elif status != "PASS":
        manifest["status"] = status
    manifest.setdefault("events", []).append({"at": utc_now(), "type": "UNIVERSAL_STAGE_RECORDED", "stageId": stage_id, "status": status})
    store.save(run_id, manifest)
    return {"runId": run_id, "stageId": stage_id, "status": manifest["status"], "currentStage": manifest["currentStage"]}


def resume_universal_run(
    store: UniversalRunStore,
    run_id: str,
    *,
    batch_plan: list[list[int]] | None = None,
) -> dict[str, Any]:
    """Resume without reconstructing or silently replacing the frozen plan."""

    manifest = store.load(run_id)
    if manifest.get("batchPlanFrozen") is not True:
        raise UniversalRuntimeError("universal Run batch plan is not frozen")
    if batch_plan is not None:
        digest = _digest(_canonical_batch_plan(batch_plan))
        if digest != manifest.get("batchPlanSha256"):
            raise UniversalRuntimeError("resume batch plan differs from the frozen plan")
    return {
        "runId": run_id,
        "status": manifest.get("status"),
        "currentStage": manifest.get("currentStage"),
        "batchPlanSha256": manifest.get("batchPlanSha256"),
        "resumed": True,
    }


def record_universal_visual_recon(
    store: UniversalRunStore,
    run_id: str,
    report: dict[str, Any],
) -> dict[str, Any]:
    """Persist the initial visual dependency inspection before generation."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S01A_VISUAL_RECON":
        raise UniversalRuntimeError("universal visual recon is not the current stage")
    if not isinstance(report, dict) or report.get("status") != "PASS":
        raise UniversalRuntimeError("universal visual recon must be an explicit PASS report")
    questions = report.get("questions")
    expected = int(manifest["questionCount"])
    if not isinstance(questions, list) or len(questions) != expected:
        raise UniversalRuntimeError("visual recon must cover every expected question")
    ids = [item.get("id") for item in questions if isinstance(item, dict)]
    if ids != list(range(1, expected + 1)):
        raise UniversalRuntimeError("visual recon question ids must be complete and ordered")
    for item in questions:
        if not isinstance(item, dict) or item.get("problem") not in {"PASS", "NOT_REQUIRED"} or item.get("solution") not in {"PASS", "NOT_REQUIRED"}:
            raise UniversalRuntimeError("visual recon contains an invalid problem or solution status")
    target = store.run_dir(run_id) / "source/visual-recon.json"
    atomic_write_json(target, {"artifactType": "ALIVE_UNIVERSAL_VISUAL_RECON", "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION, "runId": run_id, **report})
    manifest = store.load(run_id)
    manifest["visualRecon"] = {"path": target.relative_to(store.run_dir(run_id)).as_posix(), "status": "PASS", "sha256": sha256_file(target)}
    store.save(run_id, manifest)
    return record_universal_stage(store, run_id, "S01A_VISUAL_RECON", status="PASS", evidence=sha256_file(target))


def record_universal_ir_analysis(
    store: UniversalRunStore,
    run_id: str,
    ir_rows: list[dict[str, Any]],
) -> dict[str, Any]:
    """Validate and persist the complete Universal Question IR bundle."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S01B_UNIVERSAL_IR_ANALYSIS":
        raise UniversalRuntimeError("universal IR analysis is not the current stage")
    expected = int(manifest["questionCount"])
    if not isinstance(ir_rows, list) or len(ir_rows) != expected:
        raise UniversalRuntimeError("universal IR analysis must cover every expected question")
    normalized: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    student_rows: list[dict[str, Any]] = []
    for ordinal, value in enumerate(ir_rows, 1):
        report = validate_universal_question_ir(value)
        if report.get("status") != "PASS":
            raise UniversalRuntimeError(f"universal IR q{ordinal} is invalid: {report.get('errors')}")
        if str(value.get("sourceQuestionId")) != str(ordinal):
            raise UniversalRuntimeError(f"universal IR q{ordinal} sourceQuestionId is not ordinal-aligned")
        split = split_student_proof_ir(value)
        normalized.append(value)
        proof_rows.append(split["proofIR"])
        student_rows.append(split["studentIR"])
    run_dir = store.run_dir(run_id)
    ir_path = run_dir / "source/universal-question-ir.json"
    proof_path = run_dir / "source/source-proof-ir.json"
    student_path = run_dir / "source/student-ir.json"
    atomic_write_json(ir_path, {"artifactType": "ALIVE_UNIVERSAL_QUESTION_IR_BUNDLE", "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION, "runId": run_id, "questionCount": expected, "questions": normalized})
    atomic_write_json(proof_path, {"artifactType": "ALIVE_UNIVERSAL_SOURCE_PROOF_IR_BUNDLE", "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION, "runId": run_id, "questionCount": expected, "questions": proof_rows})
    atomic_write_json(student_path, {"artifactType": "ALIVE_UNIVERSAL_STUDENT_IR_BUNDLE", "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION, "runId": run_id, "questionCount": expected, "questions": student_rows})
    manifest = store.load(run_id)
    manifest["ir"] = {
        "status": "PASS",
        "path": ir_path.relative_to(run_dir).as_posix(),
        "sha256": sha256_file(ir_path),
        "proofPath": proof_path.relative_to(run_dir).as_posix(),
        "studentPath": student_path.relative_to(run_dir).as_posix(),
    }
    store.save(run_id, manifest)
    return record_universal_stage(store, run_id, "S01B_UNIVERSAL_IR_ANALYSIS", status="PASS", evidence=sha256_file(ir_path))


def record_universal_capability_preflight(
    store: UniversalRunStore,
    run_id: str,
    report: dict[str, Any],
) -> dict[str, Any]:
    """Persist exact family×transform routing evidence before dispatch."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S01C_VARIANT_ROUTER_CAPABILITY":
        raise UniversalRuntimeError("universal capability preflight is not the current stage")
    if not isinstance(report, dict) or report.get("status") != "PASS":
        raise UniversalRuntimeError("universal capability preflight must be an explicit PASS report")
    assignments = report.get("assignments")
    expected = int(manifest["questionCount"])
    if not isinstance(assignments, list) or len(assignments) != expected:
        raise UniversalRuntimeError("capability preflight must cover every expected question")
    for ordinal, item in enumerate(assignments, 1):
        if not isinstance(item, dict) or item.get("id") != ordinal or item.get("status") != "READY":
            raise UniversalRuntimeError(f"capability preflight q{ordinal} is not READY")
        if not isinstance(item.get("familyId"), str) or not isinstance(item.get("transform"), str):
            raise UniversalRuntimeError("capability preflight familyId and transform are required")
    target = store.run_dir(run_id) / "source/capability-report.json"
    atomic_write_json(target, {"artifactType": "ALIVE_UNIVERSAL_CAPABILITY_PREFLIGHT", "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION, "runId": run_id, **report})
    manifest = store.load(run_id)
    manifest["capabilityPreflight"] = {"path": target.relative_to(store.run_dir(run_id)).as_posix(), "status": "PASS", "sha256": sha256_file(target)}
    store.save(run_id, manifest)
    return record_universal_stage(store, run_id, "S01C_VARIANT_ROUTER_CAPABILITY", status="PASS", evidence=sha256_file(target))


def record_universal_candidate_set(
    store: UniversalRunStore,
    run_id: str,
    candidates: list[dict[str, Any]],
) -> dict[str, Any]:
    """Validate and persist the complete first-round candidate set."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S02_ROUND1_GENERATION":
        raise UniversalRuntimeError("universal candidates are not the current stage")
    if not isinstance(candidates, list) or len(candidates) != int(manifest["questionCount"]):
        raise UniversalRuntimeError("candidate set must contain every expected question")
    normalized: dict[int, dict[str, Any]] = {}
    for candidate in candidates:
        try:
            value = validate_universal_candidate(candidate)
        except UniversalCandidateError as error:
            raise UniversalRuntimeError(str(error)) from error
        if value.get("runId") != run_id:
            raise UniversalRuntimeError("candidate runId does not match universal Run")
        try:
            ordinal = int(value["sourceQuestionId"])
        except (TypeError, ValueError) as error:
            raise UniversalRuntimeError("candidate sourceQuestionId must be an integer ordinal") from error
        if ordinal in normalized or ordinal < 1 or ordinal > int(manifest["questionCount"]):
            raise UniversalRuntimeError(f"candidate ordinal is duplicated or out of range: {ordinal}")
        normalized[ordinal] = value
    expected = set(range(1, int(manifest["questionCount"]) + 1))
    if set(normalized) != expected:
        raise UniversalRuntimeError("candidate set does not cover every source ordinal")
    run_dir = store.run_dir(run_id)
    paths: dict[str, str] = {}
    for ordinal, candidate in sorted(normalized.items()):
        target = run_dir / f"candidates/q{ordinal:03d}/candidate.json"
        atomic_write_json(target, candidate)
        paths[str(ordinal)] = target.relative_to(run_dir).as_posix()
    manifest["candidates"] = {
        "count": len(paths),
        "paths": paths,
        "status": "PASS",
    }
    store.save(run_id, manifest)
    result = record_universal_stage(
        store,
        run_id,
        "S02_ROUND1_GENERATION",
        status="PASS",
        evidence="candidate-set",
        _internal=True,
    )
    return {**result, "candidateCount": len(paths), "candidatePaths": paths}


def record_universal_variant_precheck(
    store: UniversalRunStore,
    run_id: str,
    rows: list[dict[str, Any]],
    *,
    evidence_catalog: Iterable[str],
) -> dict[str, Any]:
    """Reduce every candidate sidecar before any independent review dispatch."""

    from .variant_proof import reduce_variant_class

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S02A_VARIANT_PROOF_PRECHECK":
        raise UniversalRuntimeError("variant proof precheck is not the current stage")
    catalog = set(evidence_catalog)
    if not catalog:
        raise UniversalRuntimeError("variant proof precheck evidence catalog is required")
    if not isinstance(rows, list) or len(rows) != int(manifest["questionCount"]):
        raise UniversalRuntimeError("variant proof precheck must contain every expected question")
    reduced: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict) or not isinstance(row.get("id"), int) or not isinstance(row.get("sidecar"), dict):
            raise UniversalRuntimeError("variant proof precheck row is invalid")
        result = reduce_variant_class(row["sidecar"], evidence_catalog=catalog)
        reduced.append({"id": row["id"], "result": result})
    reduced.sort(key=lambda item: item["id"])
    expected = list(range(1, int(manifest["questionCount"]) + 1))
    complete = [item["id"] for item in reduced] == expected and all(item["result"]["status"] == "PASS" for item in reduced)
    report = {
        "artifactType": "ALIVE_UNIVERSAL_VARIANT_PRECHECK",
        "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
        "runId": run_id,
        "questionCount": int(manifest["questionCount"]),
        "status": "PASS" if complete else "HOLD",
        "questions": reduced,
        "evidenceCatalogCount": len(catalog),
    }
    target = store.run_dir(run_id) / "evidence/variant-proof-precheck.json"
    atomic_write_json(target, report)
    manifest = store.load(run_id)
    manifest["variantPrecheck"] = {
        "path": target.relative_to(store.run_dir(run_id)).as_posix(),
        "status": report["status"],
        "sha256": sha256_file(target),
    }
    store.save(run_id, manifest)
    result = record_universal_stage(
        store,
        run_id,
        "S02A_VARIANT_PROOF_PRECHECK",
        status="PASS" if complete else "HOLD",
        evidence=sha256_file(target),
        _internal=True,
    )
    return {**result, "precheck": report}


def record_universal_review(
    store: UniversalRunStore,
    run_id: str,
    review_ledger: dict[str, Any],
    *,
    round_name: str,
    evidence_catalog: Iterable[str],
) -> dict[str, Any]:
    """Record a complete independent three-view review for round 1 or 2."""

    if round_name not in {"review1", "review2"}:
        raise UniversalRuntimeError("universal review round must be review1 or review2")
    from .universal_review import UniversalReviewError

    stage_id = "S03_REVIEW1" if round_name == "review1" else "S05_REVIEW2"
    manifest = store.load(run_id)
    if manifest.get("currentStage") != stage_id:
        raise UniversalRuntimeError(f"universal {round_name} is not the current stage")
    report = validate_universal_review_ledger(
        review_ledger,
        int(manifest["questionCount"]),
        evidence_catalog=evidence_catalog,
    )
    if report.get("status") not in {"PASS", "FAIL"}:
        raise UniversalRuntimeError("universal review validator returned an invalid status")
    target = store.run_dir(run_id) / f"evidence/{round_name}.json"
    atomic_write_json(target, {**review_ledger, "validation": report})
    manifest = store.load(run_id)
    manifest.setdefault("reviews", {})[round_name] = {
        "path": target.relative_to(store.run_dir(run_id)).as_posix(),
        "status": report["status"],
        "sha256": sha256_file(target),
    }
    store.save(run_id, manifest)
    result = record_universal_stage(
        store,
        run_id,
        stage_id,
        status="PASS" if report["status"] == "PASS" else "HOLD",
        evidence=sha256_file(target),
        _internal=True,
    )
    return {**result, "review": report}


def record_universal_revision(
    store: UniversalRunStore,
    run_id: str,
    revision_report: dict[str, Any],
) -> dict[str, Any]:
    """Close the bounded revision slot without allowing an unbounded loop."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S04_BOUNDED_REVISION":
        raise UniversalRuntimeError("universal revision is not the current stage")
    if not isinstance(revision_report, dict) or revision_report.get("status") != "PASS":
        raise UniversalRuntimeError("universal revision must be an explicit PASS report")
    if revision_report.get("bounded") is not True:
        raise UniversalRuntimeError("universal revision must declare bounded=true")
    changed = revision_report.get("changedQuestionIds", [])
    if not isinstance(changed, list) or any(not isinstance(item, int) for item in changed):
        raise UniversalRuntimeError("universal revision changedQuestionIds must be an integer array")
    target = store.run_dir(run_id) / "evidence/revision.json"
    atomic_write_json(target, revision_report)
    manifest = store.load(run_id)
    manifest["revision"] = {
        "path": target.relative_to(store.run_dir(run_id)).as_posix(),
        "status": "PASS",
        "sha256": sha256_file(target),
        "changedQuestionIds": sorted(set(changed)),
    }
    store.save(run_id, manifest)
    return record_universal_stage(
        store,
        run_id,
        "S04_BOUNDED_REVISION",
        status="PASS",
        evidence=sha256_file(target),
        _internal=True,
    )


def record_universal_mother_final(store: UniversalRunStore, run_id: str) -> dict[str, Any]:
    """Aggregate accepted candidate/review evidence before assembly."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S06_MOTHER_FINAL":
        raise UniversalRuntimeError("universal Mother final is not the current stage")
    candidates = manifest.get("candidates")
    precheck = manifest.get("variantPrecheck")
    reviews = manifest.get("reviews")
    if not isinstance(candidates, dict) or candidates.get("status") != "PASS":
        raise UniversalRuntimeError("universal Mother final requires accepted candidates")
    if not isinstance(precheck, dict) or precheck.get("status") != "PASS":
        raise UniversalRuntimeError("universal Mother final requires variant precheck PASS")
    if not isinstance(reviews, dict) or any(
        not isinstance(reviews.get(name), dict) or reviews[name].get("status") != "PASS"
        for name in ("review1", "review2")
    ):
        raise UniversalRuntimeError("universal Mother final requires review1 and review2 PASS")
    run_dir = store.run_dir(run_id)
    paths = candidates.get("paths")
    if not isinstance(paths, dict) or len(paths) != int(manifest["questionCount"]):
        raise UniversalRuntimeError("universal Mother final candidate paths are incomplete")
    for relative in paths.values():
        if not (run_dir / str(relative)).is_file():
            raise UniversalRuntimeError("universal Mother final candidate artifact is missing")
    report = {
        "artifactType": "ALIVE_UNIVERSAL_MOTHER_FINAL",
        "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
        "runId": run_id,
        "status": "PASS",
        "questionCount": int(manifest["questionCount"]),
        "candidate": "PASS",
        "variantProof": "PASS",
        "review1": "PASS",
        "review2": "PASS",
        "publicationStatus": "NOT_PUBLISHED",
    }
    target = run_dir / "final/mother-final.json"
    atomic_write_json(target, report)
    manifest = store.load(run_id)
    manifest["motherFinal"] = {
        "path": target.relative_to(run_dir).as_posix(),
        "status": "PASS",
        "sha256": sha256_file(target),
    }
    store.save(run_id, manifest)
    return record_universal_stage(
        store,
        run_id,
        "S06_MOTHER_FINAL",
        status="PASS",
        evidence=sha256_file(target),
        _internal=True,
    )


def assemble_universal_exam(
    store: UniversalRunStore,
    run_id: str,
    title: str,
    *,
    archive_root: Path | None = None,
) -> dict[str, Any]:
    """Assemble validated universal candidates into the strict Archive JS envelope."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S07_ASSEMBLY":
        raise UniversalRuntimeError("universal assembly is not the current stage")
    if not isinstance(title, str) or not title.strip():
        raise UniversalRuntimeError("universal assembly title is required")
    if not isinstance(manifest.get("motherFinal"), dict) or manifest["motherFinal"].get("status") != "PASS":
        raise UniversalRuntimeError("universal assembly requires Mother final PASS")
    if not isinstance(manifest.get("variantProofLedger"), dict) or manifest["variantProofLedger"].get("status") != "PASS":
        raise UniversalRuntimeError("universal assembly requires variant proof ledger PASS")
    candidates = manifest.get("candidates")
    if not isinstance(candidates, dict) or candidates.get("status") != "PASS" or not isinstance(candidates.get("paths"), dict):
        raise UniversalRuntimeError("universal assembly requires accepted candidates")
    run_dir = store.run_dir(run_id)
    structured_questions: list[dict[str, Any]] = []
    archive_questions: list[dict[str, Any]] = []
    asset_hashes: dict[str, str] = {}
    archive_root = archive_root.resolve() if archive_root is not None else None
    for ordinal in range(1, int(manifest["questionCount"]) + 1):
        relative = candidates["paths"].get(str(ordinal))
        if not isinstance(relative, str):
            raise UniversalRuntimeError(f"universal candidate path is missing for q{ordinal}")
        try:
            candidate = validate_universal_candidate(json.loads((run_dir / relative).read_text(encoding="utf-8")))
        except (OSError, ValueError, UniversalCandidateError, json.JSONDecodeError) as error:
            raise UniversalRuntimeError(f"universal candidate q{ordinal} failed assembly validation: {error}") from error
        metadata = copy.deepcopy(candidate["archiveMetadata"])
        student = candidate["studentPayload"]
        question: dict[str, Any] = {
            **metadata,
            "id": ordinal,
            "questionType": student["questionType"],
            "layoutTag": student["layoutTag"],
            "wide": student["wide"],
            "content": student["content"],
            "choices": copy.deepcopy(student["choices"]),
            "answer": candidate["answerContract"]["displayAnswer"],
            "solution": candidate["solution"],
            "solutionDetail": copy.deepcopy(candidate["solutionDetail"]),
            "visualRequirement": candidate["visualRequirement"],
        }
        for role, spec, suffix in (
            ("problem", candidate.get("visualSpec"), ""),
            ("solution", candidate.get("solutionVisualSpec"), "-solution"),
        ):
            if not isinstance(spec, dict):
                continue
            filename = f"q{ordinal:03d}{suffix}.svg"
            final_asset = run_dir / "final/assets" / filename
            _atomic_write_text(final_asset, render_visual_spec(copy.deepcopy(spec)))
            asset_hashes[f"{ordinal}:{role}"] = sha256_file(final_asset)
            if archive_root is None:
                raise UniversalRuntimeError("visual candidates require archive_root for browser asset assembly")
            shadow = archive_root / "_generated" / "alive-universal-runs" / run_id / "assets" / filename
            shadow.parent.mkdir(parents=True, exist_ok=True)
            _atomic_write_text(shadow, final_asset.read_text(encoding="utf-8"))
            path = f"_generated/alive-universal-runs/{run_id}/assets/{filename}"
            if role == "problem":
                question["image"] = path
                question["imageSize"] = "medium"
            else:
                question["solutionImage"] = path
                question["solutionImageSize"] = "medium"
        structured_questions.append(question)
        archive_questions.append(_archive_projection(question))
    identity_keys = [
        json.dumps({"content": item["content"], "choices": item.get("choices", [])}, ensure_ascii=False, sort_keys=True)
        for item in structured_questions
    ]
    if len(identity_keys) != len(set(identity_keys)):
        raise UniversalRuntimeError("universal assembly contains duplicate student questions")
    structured = {
        "schemaVersion": "0.4.0",
        "artifactType": "ALIVE_STRUCTURED_EXAM",
        "examTitle": title,
        "questionCount": len(structured_questions),
        "questions": structured_questions,
    }
    structured_path = run_dir / "final/structured-exam.json"
    atomic_write_json(structured_path, structured)
    script = (
        f"window.examTitle = {json.dumps(title, ensure_ascii=False)};\n\n"
        f"window.questionBank = {json.dumps(archive_questions, ensure_ascii=False, indent=2)};\n"
    )
    script_path = run_dir / "final/staging/generated-exam.js"
    _atomic_write_text(script_path, script)
    parsed_title, parsed_questions = _parse_serialized_js(script)
    if parsed_title != title or parsed_questions != archive_questions:
        raise UniversalRuntimeError("universal assembly serializer semantic round-trip mismatch")
    report = {
        "artifactType": "ALIVE_UNIVERSAL_ASSEMBLY_REPORT",
        "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
        "runId": run_id,
        "status": "PASS",
        "questionCount": len(structured_questions),
        "structuredExamSha256": sha256_file(structured_path),
        "stagingSha256": sha256_file(script_path),
        "semanticRoundTrip": "PASS",
        "duplicateQuestionCheck": "PASS",
        "assets": asset_hashes,
        "publicationStatus": "NOT_PUBLISHED",
    }
    report_path = run_dir / "final/assembly-report.json"
    atomic_write_json(report_path, report)
    result = record_universal_stage(
        store,
        run_id,
        "S07_ASSEMBLY",
        status="PASS",
        evidence=sha256_file(report_path),
        _internal=True,
    )
    manifest = store.load(run_id)
    manifest["assembly"] = {
        "path": report_path.relative_to(run_dir).as_posix(),
        "status": "PASS",
        "sha256": sha256_file(report_path),
    }
    store.save(run_id, manifest)
    return {**result, "assembly": report}


def write_universal_variant_ledger(
    store: UniversalRunStore,
    run_id: str,
    rows: list[dict[str, Any]],
    *,
    question_count: int | None = None,
) -> dict[str, Any]:
    manifest = store.load(run_id)
    if manifest.get("status") == "SEALED_LOCAL":
        raise UniversalRuntimeError("sealed universal Run cannot receive a ledger")
    current_index = UNIVERSAL_STAGES.index(str(manifest.get("currentStage")))
    if current_index >= UNIVERSAL_STAGES.index("S09_PACKAGE"):
        raise UniversalRuntimeError("variant proof ledger is immutable once package staging begins")
    ledger = build_variant_proof_ledger(rows, question_count=question_count or int(manifest["questionCount"]))
    run_dir = store.run_dir(run_id)
    path = run_dir / "final/variant-proof-ledger.json"
    atomic_write_json(path, ledger)
    manifest["variantProofLedger"] = {
        "path": "final/variant-proof-ledger.json",
        "status": ledger["variantProofLedgerComplete"],
        "sha256": sha256_file(path),
    }
    store.save(run_id, manifest)
    return {"path": path.as_posix(), "status": ledger["variantProofLedgerComplete"], "sha256": sha256_file(path)}


def package_universal_run(
    store: UniversalRunStore,
    run_id: str,
    *,
    files: Iterable[str] = (),
) -> dict[str, Any]:
    """Create the package before final closure, then let closure audit it."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S09_PACKAGE":
        raise UniversalRuntimeError("universal package requires S09_PACKAGE as the current stage")
    run_dir = store.run_dir(run_id)
    requested = list(files) or [
        "final/structured-exam.json",
        "final/staging/generated-exam.js",
        "final/assembly-report.json",
        "final/variant-proof-ledger.json",
        "render/render-evidence.json",
    ]
    requested = requested + [
        path.relative_to(run_dir).as_posix()
        for path in sorted((run_dir / "final/assets").glob("*"))
        if path.is_file() and path.relative_to(run_dir).as_posix() not in requested
    ]
    required_members = {
        "final/structured-exam.json",
        "final/staging/generated-exam.js",
        "final/assembly-report.json",
        "final/variant-proof-ledger.json",
        "render/render-evidence.json",
    }
    if not required_members.issubset(set(Path(item).as_posix() for item in requested)):
        raise UniversalRuntimeError("universal package must include variant ledger and render evidence")
    members: list[tuple[str, Path]] = []
    for relative in requested:
        path = (run_dir / relative).resolve()
        try:
            path.relative_to(run_dir.resolve())
        except ValueError as error:
            raise UniversalRuntimeError("package member escaped the Run") from error
        if not path.is_file():
            raise UniversalRuntimeError(f"package member is missing: {relative}")
        members.append((Path(relative).as_posix(), path))
    package_path = run_dir / "final/universal-run-package.zip"
    package_manifest = {
        "artifactType": "ALIVE_UNIVERSAL_PACKAGE_MANIFEST",
        "schemaVersion": UNIVERSAL_RUNTIME_SCHEMA_VERSION,
        "runId": run_id,
        "members": [{"path": name, "sha256": sha256_file(path), "bytes": path.stat().st_size} for name, path in members],
        "publicationStatus": "NOT_PUBLISHED",
    }
    package_manifest_path = run_dir / "final/package-manifest.json"
    atomic_write_json(package_manifest_path, package_manifest)
    with zipfile.ZipFile(package_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.write(package_manifest_path, "package-manifest.json")
        for name, path in members:
            archive.write(path, name)
    with zipfile.ZipFile(package_path, "r") as archive:
        if archive.testzip() is not None:
            raise UniversalRuntimeError("universal package CRC round-trip failed")
    result = record_universal_stage(
        store,
        run_id,
        "S09_PACKAGE",
        status="PASS",
        evidence=sha256_file(package_path),
        _internal=True,
    )
    manifest = store.load(run_id)
    manifest["package"] = {"path": "final/universal-run-package.zip", "sha256": sha256_file(package_path), "roundTrip": "PASS", "publicationStatus": "NOT_PUBLISHED"}
    store.save(run_id, manifest)
    return {**result, "packagePath": package_path.as_posix(), "packageSha256": sha256_file(package_path), "roundTrip": "PASS"}


def _validate_universal_render_evidence(evidence: dict[str, Any], question_count: int) -> None:
    if not isinstance(evidence, dict) or evidence.get("artifactType") != "ALIVE_FINAL_RENDER_EVIDENCE":
        raise UniversalRuntimeError("universal render evidence artifactType is invalid")
    if evidence.get("actualBrowser") is not True or evidence.get("productionEngine") is not True:
        raise UniversalRuntimeError("universal render requires actual production-engine browser evidence")
    modes = evidence.get("modes")
    if not isinstance(modes, dict) or set(modes) != {"exam", "solution", "answer"}:
        raise UniversalRuntimeError("universal render requires exam, solution, and answer modes")
    expectations = {
        "verdict": "PASS",
        "lastQuestion": question_count,
        "lastPageChecked": True,
        "unrenderedMath": 0,
        "overflowCount": 0,
        "badImages": [],
        "renderError": None,
        "screenshotCaptured": True,
    }
    for mode, result in modes.items():
        if not isinstance(result, dict):
            raise UniversalRuntimeError(f"universal render mode {mode} is invalid")
        for field, expected in expectations.items():
            if result.get(field) != expected:
                raise UniversalRuntimeError(f"universal render mode {mode}.{field} is not {expected!r}")


def record_universal_render(
    store: UniversalRunStore,
    run_id: str,
    evidence: dict[str, Any],
) -> dict[str, Any]:
    """Accept only complete actual-browser evidence for the universal S08 gate."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S08_BROWSER_RENDER":
        raise UniversalRuntimeError("universal render is not the current stage")
    _validate_universal_render_evidence(evidence, int(manifest["questionCount"]))
    target = store.run_dir(run_id) / "render/render-evidence.json"
    atomic_write_json(target, evidence)
    evidence_hash = sha256_file(target)
    result = record_universal_stage(
        store,
        run_id,
        "S08_BROWSER_RENDER",
        status="PASS",
        evidence=evidence_hash,
        _internal=True,
    )
    manifest = store.load(run_id)
    manifest["render"] = {
        "path": "render/render-evidence.json",
        "sha256": evidence_hash,
        "actualBrowser": True,
        "productionEngine": True,
    }
    store.save(run_id, manifest)
    return {**result, "renderEvidencePath": target.as_posix(), "renderEvidenceSha256": evidence_hash}


def record_universal_closure(
    store: UniversalRunStore,
    run_id: str,
    closure_report: dict[str, Any],
) -> dict[str, Any]:
    """Record an already-run final closure report as the S09A evidence."""

    if not isinstance(closure_report, dict) or closure_report.get("status") != "PASS":
        raise UniversalRuntimeError("universal final closure must be PASS")
    browser = closure_report.get("browserRender")
    if not isinstance(browser, dict) or browser.get("status") != "PASS":
        raise UniversalRuntimeError("universal closure needs PASS browserRender evidence")
    if browser.get("actualBrowser") is not True or browser.get("productionEngine") is not True:
        raise UniversalRuntimeError("universal closure needs actual production-engine browser evidence")
    required_pages = {"exam", "solution", "answer"}
    if not required_pages.issubset(set(browser.get("pages") or [])):
        raise UniversalRuntimeError("browserRender evidence must cover exam, solution, and answer")
    package = closure_report.get("package")
    if not isinstance(package, dict) or package.get("status") != "PASS" or package.get("roundTrip") != "PASS":
        raise UniversalRuntimeError("universal closure needs PASS package round-trip evidence")
    manifest = store.load(run_id)
    if manifest.get("currentStage") != "S09A_FINAL_CLOSURE":
        raise UniversalRuntimeError("universal closure is not the current stage")
    ledger = manifest.get("variantProofLedger")
    if not isinstance(ledger, dict) or ledger.get("status") != "PASS":
        raise UniversalRuntimeError("variant proof ledger must pass before final closure")
    ledger_path = store.run_dir(run_id) / str(ledger.get("path") or "")
    if not ledger_path.is_file():
        raise UniversalRuntimeError("variant proof ledger artifact is missing")
    packaged = manifest.get("package")
    if not isinstance(packaged, dict) or packaged.get("roundTrip") != "PASS":
        raise UniversalRuntimeError("universal package round-trip is missing")
    package_path = store.run_dir(run_id) / str(packaged.get("path") or "")
    if not package_path.is_file() or sha256_file(package_path) != packaged.get("sha256"):
        raise UniversalRuntimeError("universal package hash or artifact is invalid")
    render = manifest.get("render")
    if not isinstance(render, dict) or render.get("sha256") != closure_report.get("renderEvidenceSha256"):
        raise UniversalRuntimeError("closure render evidence does not match the stored S08 evidence")
    legacy_path_ref = closure_report.get("legacyFinalClosurePath")
    if legacy_path_ref:
        legacy_path = Path(str(legacy_path_ref))
        if not legacy_path.is_absolute():
            legacy_path = store.run_dir(run_id) / legacy_path
        try:
            legacy_path = legacy_path.resolve()
            legacy_path.relative_to(store.run_dir(run_id).resolve())
        except ValueError as error:
            raise UniversalRuntimeError("legacy final closure path must remain inside the universal Run") from error
        if not legacy_path.is_file():
            raise UniversalRuntimeError("legacy final closure audit artifact is missing")
        try:
            legacy_report = json.loads(legacy_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, json.JSONDecodeError) as error:
            raise UniversalRuntimeError("legacy final closure audit artifact is invalid JSON") from error
        if not isinstance(legacy_report, dict) or legacy_report.get("artifactType") != "ALIVE_FINAL_CLOSURE_AUDIT":
            raise UniversalRuntimeError("legacy final closure audit artifact type is invalid")
        if legacy_report.get("status") != "PASS":
            raise UniversalRuntimeError("legacy final closure audit must be PASS")
        gates = legacy_report.get("gates")
        if not isinstance(gates, dict) or any(gates.get(name) != "PASS" for name in ("package", "node", "questions", "browser", "externalReview", "variant")):
            raise UniversalRuntimeError("legacy final closure audit has a non-PASS gate")
        closure_report["legacyFinalClosureSha256"] = sha256_file(legacy_path)
    path = store.run_dir(run_id) / "final/universal-closure-report.json"
    atomic_write_json(path, closure_report)
    return record_universal_stage(
        store,
        run_id,
        "S09A_FINAL_CLOSURE",
        status="PASS",
        evidence=sha256_file(path),
        _internal=True,
    )


def seal_universal_run(store: UniversalRunStore, run_id: str) -> dict[str, Any]:
    """Seal only after package, closure, and variant ledger all pass."""

    manifest = store.load(run_id)
    if manifest.get("currentStage") != "SEALED":
        raise UniversalRuntimeError("universal Run is not ready for sealing")
    if _stage_status(manifest, "S09_PACKAGE") != "PASS" or _stage_status(manifest, "S09A_FINAL_CLOSURE") != "PASS":
        raise UniversalRuntimeError("package and final closure must both pass before sealing")
    ledger = manifest.get("variantProofLedger")
    if not isinstance(ledger, dict) or ledger.get("status") != "PASS":
        raise UniversalRuntimeError("variant proof ledger must pass before sealing")
    sealed = record_universal_stage(
        store,
        run_id,
        "SEALED",
        status="PASS",
        evidence="local-seal",
        _internal=True,
    )
    manifest = store.load(run_id)
    manifest["status"] = "SEALED_LOCAL"
    manifest["sealedAt"] = utc_now()
    manifest["publicationStatus"] = "NOT_PUBLISHED"
    store.save(run_id, manifest)
    return {**sealed, "status": "SEALED_LOCAL", "publicationStatus": "NOT_PUBLISHED"}


__all__ = [
    "UNIVERSAL_RUNTIME_SCHEMA_VERSION",
    "UNIVERSAL_STAGES",
    "UniversalRunStore",
    "UniversalRuntimeError",
    "assemble_universal_exam",
    "package_universal_run",
    "record_universal_closure",
    "record_universal_candidate_set",
    "record_universal_capability_preflight",
    "record_universal_ir_analysis",
    "record_universal_mother_final",
    "record_universal_render",
    "record_universal_revision",
    "record_universal_review",
    "record_universal_stage",
    "record_universal_variant_precheck",
    "record_universal_visual_recon",
    "resume_universal_run",
    "seal_universal_run",
    "start_universal_run",
    "write_universal_variant_ledger",
]
