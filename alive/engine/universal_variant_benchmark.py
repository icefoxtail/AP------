"""Deterministic Phase 0.5~7 contract benchmark for the universal engine.

The benchmark exercises the structured A/B/C lanes, negative reduction,
mixed-exam planning, the local Run lifecycle, and repeatability.  It is a
bounded contract benchmark, not a claim that free-form whole-exam generation
is already supported for every curriculum family.
"""

from __future__ import annotations

import copy
import json
import tempfile
from pathlib import Path
from typing import Any

from .mixed_exam_planner import build_mixed_exam_plan
from .curriculum_adapters import load_high1_curriculum_adapters
from .run_store import atomic_write_json, sha256_file
from .structure_families import StructureFamilyAdapter, default_structure_family_registry
from .universal_variant_runtime import (
    UNIVERSAL_STAGES,
    UniversalRunStore,
    assemble_universal_exam,
    package_universal_run,
    record_universal_closure,
    record_universal_candidate_set,
    record_universal_mother_final,
    record_universal_render,
    record_universal_revision,
    record_universal_review,
    record_universal_stage,
    record_universal_variant_precheck,
    seal_universal_run,
    start_universal_run,
    write_universal_variant_ledger,
)
from .universal_ir import build_universal_question_ir
from .universal_variant_engine import (
    TRANSFORM_C_PARAMETER_RECOVERY,
    adapt_b_candidate,
    apply_a_parameter_variant,
    build_c_variant,
    build_variant_proof_ledger,
    evaluate_capability_promotion,
)
from .variant_proof import REQUIRED_CHECKS, build_proof_check, reduce_variant_class


BENCHMARK_SCHEMA_VERSION = "0.1.0"
FIXTURES_RELATIVE_PATH = Path("alive/engine/fixtures_universal_variant_contracts.json")


class UniversalVariantBenchmarkError(ValueError):
    pass


def load_universal_variant_fixtures(root: Path) -> list[dict[str, Any]]:
    path = root / FIXTURES_RELATIVE_PATH
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise UniversalVariantBenchmarkError(f"universal fixture file cannot be read: {path}") from error
    if not isinstance(value, dict) or value.get("schemaVersion") != BENCHMARK_SCHEMA_VERSION or value.get("artifactType") != "ALIVE_UNIVERSAL_VARIANT_CONTRACT_FIXTURES":
        raise UniversalVariantBenchmarkError("universal fixture envelope is invalid")
    fixtures = value.get("fixtures")
    if not isinstance(fixtures, list) or not fixtures:
        raise UniversalVariantBenchmarkError("universal fixtures must not be empty")
    required = {"fixtureId", "familyId", "transform", "variantClass", "polarity", "fixtureClass", "status"}
    for fixture in fixtures:
        if not isinstance(fixture, dict) or not required.issubset(fixture):
            raise UniversalVariantBenchmarkError("universal fixture is missing required fields")
    return copy.deepcopy(fixtures)


def _graph() -> dict[str, Any]:
    return {
        "nodes": [
            {"nodeId": "source", "role": "core", "op": "read", "inputRole": ["given"], "outputRole": ["equation"], "order": 0},
            {"nodeId": "solve", "role": "core", "op": "solve", "inputRole": ["equation"], "outputRole": ["answer"], "order": 1},
        ],
        "edges": [{"source": "source", "target": "solve"}],
    }


def _source_ir() -> dict[str, Any]:
    return build_universal_question_ir(
        {
            "id": 1,
            "questionType": "객관식",
            "content": "{{a}}x+1=3의 해를 구하시오.",
            "choices": ["{{a}}", "2", "3", "4", "5"],
            "answer": "②",
            "layoutTag": "grid",
        },
        source_question_sha256="a" * 64,
        rule_snapshot_sha256="b" * 64,
        structure_family="LINEAR_EQUATION",
        solution_graph=_graph(),
        curriculum={"courseKey": "H22-C", "unitKey": "H22-C-01"},
        parameters={"a": 1},
        mutable_parameters=["a"],
        goal={"type": "solve", "target": "x"},
    )


def _registry():
    registry = default_structure_family_registry()
    for family_id in ("LINEAR_EQUATION", "DIRECT_CALCULATION", "QUADRATIC_EQUATION", "INEQUALITY_SOLVE"):
        registry.register(
            StructureFamilyAdapter(
                family_id=family_id,
                transform_capabilities={
                    "numeric": "SUPPORTED",
                    "representation": "SUPPORTED",
                    TRANSFORM_C_PARAMETER_RECOVERY: "SUPPORTED",
                },
                solver_profile="universal-contract-fixture",
            )
        )
    return registry


def _sidecar(declared: str, *, failed_check: str | None = None) -> tuple[dict[str, Any], set[str]]:
    preprocessing_delta = 1 if declared == "C" else 0
    checks: list[dict[str, Any]] = []
    for name in REQUIRED_CHECKS[declared]:
        status = "FAIL" if name == failed_check else "PASS"
        checks.append(
            build_proof_check(
                name,
                status,
                method="universal_contract_benchmark",
                evidence_refs=[f"benchmark:{declared}:{name}"],
            )
        )
    sidecar = {
        "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
        "schemaVersion": "0.1.0",
        "sourceQuestionId": "1",
        "declaredClass": declared,
        "verifiedClass": "HOLD",
        "structureFamily": "LINEAR_EQUATION",
        "transform": "numeric" if declared == "A" else "representation" if declared == "B" else TRANSFORM_C_PARAMETER_RECOVERY,
        "capabilityStatus": "SUPPORTED",
        "coreConceptPreserved": True,
        "solutionGraphPreserved": True,
        "coreDecisionDelta": 0,
        "branchDelta": 0,
        "newConceptDelta": 0,
        "preprocessingDelta": preprocessing_delta,
        "preprocessLoad": {"type": "inference" if declared == "C" else "none", "magnitude": preprocessing_delta},
        "preprocessDeterministic": True,
        "preprocessOutputArity": 1 if declared == "C" else 0,
        "studentObservableInputsOnly": True,
        "ablationPassed": True,
        "shortcutBlocked": True,
        "difficultyDelta": {},
        "proofChecks": checks,
        "proofSha256": f"benchmark-proof-{declared}",
    }
    return sidecar, {ref for item in checks for ref in item["evidenceRefs"]}


def _run_once(curriculum_registry: Any) -> dict[str, Any]:
    registry = _registry()
    source = _source_ir()
    a = apply_a_parameter_variant(source, parameter_bindings={"a": 2}, registry=registry)
    b = adapt_b_candidate(
        source,
        candidate_payload={**source["studentPayload"], "content": "다른 표현으로 일차방정식의 해를 구한다."},
        candidate_solution_graph=source["solutionGraph"],
        registry=registry,
    )
    c = build_c_variant(
        source,
        preprocess_node={
            "nodeId": "p0",
            "role": "preprocess",
            "op": "recover_parameter",
            "deterministic": True,
            "branchCount": 0,
            "newConcept": False,
            "required": True,
            "outputArity": 1,
            "studentObservableInputsOnly": True,
        },
        transform=TRANSFORM_C_PARAMETER_RECOVERY,
        registry=registry,
    )
    reductions: dict[str, dict[str, Any]] = {}
    positive_results: list[dict[str, Any]] = []
    for declared in ("A", "B", "C"):
        sidecar, catalog = _sidecar(declared)
        result = reduce_variant_class(sidecar, evidence_catalog=catalog)
        reductions[declared] = result
        positive_results.append(result)
    fake_c, fake_catalog = _sidecar("C", failed_check="ablationPassed")
    reductions["FAKE_C"] = reduce_variant_class(fake_c, evidence_catalog=fake_catalog)
    advanced = copy.deepcopy(_sidecar("B")[0])
    advanced["coreDecisionDelta"] = 1
    advanced_catalog = {ref for item in advanced["proofChecks"] for ref in item["evidenceRefs"]}
    reductions["ADVANCED"] = reduce_variant_class(advanced, evidence_catalog=advanced_catalog)
    ledger = build_variant_proof_ledger([{"id": index, "result": result} for index, result in enumerate(positive_results, 1)])
    promotion = evaluate_capability_promotion(
        [
            {"familyId": "LINEAR_EQUATION", "transform": "numeric", "polarity": "positive", "status": "PASS"},
            {"familyId": "LINEAR_EQUATION", "transform": "numeric", "polarity": "negative", "status": "PASS"},
            {"familyId": "LINEAR_EQUATION", "transform": "representation", "polarity": "positive", "status": "PASS"},
            {"familyId": "LINEAR_EQUATION", "transform": "representation", "polarity": "negative", "status": "PASS"},
            {"familyId": "LINEAR_EQUATION", "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "positive", "status": "PASS"},
            {"familyId": "LINEAR_EQUATION", "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS"},
        ]
    )
    planner = build_mixed_exam_plan(
        [
            {"id": 1, "unitKey": "H22-C-02", "structureFamily": "DIRECT_CALCULATION"},
            {"id": 2, "unitKey": "H22-C-04", "structureFamily": "QUADRATIC_EQUATION"},
            {"id": 3, "unitKey": "H22-C-06", "structureFamily": "INEQUALITY_SOLVE"},
        ],
        registry=registry,
        curriculum_registry=curriculum_registry,
        target_classes=("A", "B", "C"),
    )
    lifecycle = _run_local_lifecycle_smoke(ledger)
    return {
        "a": {"status": a["status"], "effectiveParameterChangeCount": a["evidence"]["effectiveParameterChangeCount"]},
        "b": {"status": b["status"], "coreGraphPreserved": b["evidence"]["coreGraphPreserved"]},
        "c": {"status": c["status"], "preprocessingStepCount": c["candidateIR"]["preprocessingStepCount"]},
        "reductions": reductions,
        "ledger": ledger,
        "promotion": promotion,
        "planner": {
            "status": planner["status"],
            "readyCount": planner["readyCount"],
            "holdCount": planner["holdCount"],
        },
        "lifecycle": lifecycle,
    }


def _run_local_lifecycle_smoke(ledger: dict[str, Any]) -> dict[str, Any]:
    """Exercise Run/resume/package/closure/SEALED without publishing artifacts."""

    with tempfile.TemporaryDirectory() as temporary:
        runtime_root = Path(temporary)
        run_id = "universal-contract-smoke"
        batch_plan = [[1, 2], [3]]
        start_universal_run(
            runtime_root,
            run_id=run_id,
            source_lock={"path": "fixture-source.js", "sha256": "a" * 64, "ruleSnapshotSha256": "b" * 64},
            question_count=3,
            batch_plan=batch_plan,
        )
        store = UniversalRunStore(runtime_root)
        for stage_id in UNIVERSAL_STAGES[1:5]:
            record_universal_stage(store, run_id, stage_id, status="PASS", evidence=f"benchmark:{stage_id}")

        candidates: list[dict[str, Any]] = []
        proof_rows: list[dict[str, Any]] = []
        proof_catalog: set[str] = set()
        for ordinal, declared in enumerate(("A", "B", "C"), 1):
            sidecar, refs = _runtime_sidecar(ordinal, declared)
            result = reduce_variant_class(sidecar, evidence_catalog=refs)
            candidates.append(_runtime_candidate(run_id, ordinal, declared, sidecar, result))
            proof_rows.append({"id": ordinal, "sidecar": sidecar})
            proof_catalog.update(refs)
        record_universal_candidate_set(store, run_id, candidates)
        precheck = record_universal_variant_precheck(
            store,
            run_id,
            proof_rows,
            evidence_catalog=proof_catalog,
        )
        review, review_catalog = _runtime_review_ledger(3)
        record_universal_review(store, run_id, review, round_name="review1", evidence_catalog=review_catalog)
        record_universal_revision(
            store,
            run_id,
            {"status": "PASS", "bounded": True, "changedQuestionIds": []},
        )
        record_universal_review(store, run_id, review, round_name="review2", evidence_catalog=review_catalog)
        record_universal_mother_final(store, run_id)
        write_universal_variant_ledger(
            store,
            run_id,
            precheck["precheck"]["questions"],
        )
        assembled = assemble_universal_exam(store, run_id, "universal-contract-smoke")
        render = record_universal_render(store, run_id, _render_evidence(3))
        packaged = package_universal_run(store, run_id)
        record_universal_closure(
            store,
            run_id,
            {
                "artifactType": "ALIVE_UNIVERSAL_FINAL_CLOSURE",
                "status": "PASS",
                "browserRender": {
                    "status": "PASS",
                    "actualBrowser": True,
                    "productionEngine": True,
                    "pages": ["exam", "solution", "answer"],
                },
                "package": {"status": "PASS", "roundTrip": packaged["roundTrip"]},
                "renderEvidenceSha256": render["renderEvidenceSha256"],
            },
        )
        sealed = seal_universal_run(store, run_id)
        return {
            "status": sealed["status"],
            "currentStage": store.load(run_id)["currentStage"],
            "publicationStatus": sealed["publicationStatus"],
            "packageRoundTrip": packaged["roundTrip"],
            "assembly": assembled["assembly"]["status"],
        }


def _runtime_sidecar(ordinal: int, declared: str) -> tuple[dict[str, Any], set[str]]:
    """Build a small deterministic sidecar set for the lifecycle contract."""

    checks: list[dict[str, Any]] = []
    refs: set[str] = set()
    for name in REQUIRED_CHECKS[declared]:
        ref = f"benchmark-runtime:{ordinal}:{declared}:{name}"
        refs.add(ref)
        checks.append(build_proof_check(name, "PASS", method="universal_runtime_benchmark", evidence_refs=[ref]))
    delta = 1 if declared == "C" else 0
    return {
        "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
        "schemaVersion": "0.1.0",
        "sourceQuestionId": str(ordinal),
        "declaredClass": declared,
        "verifiedClass": "HOLD",
        "structureFamily": "LINEAR_EQUATION",
        "transform": "numeric" if declared == "A" else "representation" if declared == "B" else TRANSFORM_C_PARAMETER_RECOVERY,
        "capabilityStatus": "SUPPORTED",
        "coreConceptPreserved": True,
        "solutionGraphPreserved": True,
        "coreDecisionDelta": 0,
        "branchDelta": 0,
        "newConceptDelta": 0,
        "preprocessingDelta": delta,
        "preprocessLoad": {"type": "inference" if declared == "C" else "none", "magnitude": delta},
        "preprocessDeterministic": True,
        "preprocessOutputArity": 1 if declared == "C" else 0,
        "studentObservableInputsOnly": True,
        "ablationPassed": True,
        "shortcutBlocked": True,
        "difficultyDelta": {},
        "proofChecks": checks,
        "proofSha256": f"benchmark-runtime-proof-{ordinal}-{declared}",
    }, refs


def _runtime_candidate(
    run_id: str,
    ordinal: int,
    declared: str,
    sidecar: dict[str, Any],
    result: dict[str, Any],
) -> dict[str, Any]:
    detail = {
        "version": "0.1",
        "audience": "student",
        "depth": "detailed",
        "given": f"{ordinal}x+1=3이 주어져 있다.",
        "goal": "x의 값을 구한다.",
        "keyIdea": "양변에서 1을 빼고 계수로 나눈다.",
        "conceptNote": "일차방정식의 기본 성질을 사용한다.",
        "steps": [
            {"title": "정리", "work": f"{ordinal}x=2", "why": "양변에서 1을 뺀다."},
            {"title": "계산", "work": "x=2/a", "why": "양변을 계수로 나눈다."},
        ],
        "check": "얻은 값을 원래 식에 대입해 확인한다.",
        "commonMistakes": ["이항할 때 부호를 바꾸지 않는 것"],
        "diagramRequirement": "NOT_REQUIRED",
    }
    return {
        "artifactType": "ALIVE_UNIVERSAL_CANDIDATE",
        "schemaVersion": "0.1.0",
        "runId": run_id,
        "sourceQuestionId": str(ordinal),
        "sourceQuestionSha256": "a" * 64,
        "ruleSnapshotSha256": "b" * 64,
        "variantPlan": {"declaredClass": declared, "transform": sidecar["transform"]},
        "studentPayload": {
            "content": f"{ordinal}x+1=3의 해를 구하시오.",
            "choices": [],
            "questionType": "주관식",
            "layoutTag": "grid",
            "wide": False,
        },
        "answerContract": {"displayAnswer": "2"},
        "solution": "[풀이 과정] 양변에서 1을 빼고 계수로 나눈다.",
        "solutionDetail": detail,
        "archiveMetadata": {
            "level": "중",
            "category": "일차방정식",
            "originalCategory": "일차방정식",
            "standardCourse": "공통수학1",
            "standardUnitKey": "H22-C-01",
            "standardUnit": "다항식의 연산",
            "standardUnitOrder": 1,
            "subUnitKey": "H22-C-01-TEST",
            "subUnit": "기본 계산",
            "subUnitConfidence": "fixture",
            "subUnitClassificationDepth": "complete_rule",
            "questionType": "주관식",
            "layoutTag": "grid",
            "tags": [],
            "wide": False,
        },
        "variantProof": sidecar,
        "variantResult": result,
    }


def _runtime_review_ledger(question_count: int) -> tuple[dict[str, Any], set[str]]:
    catalog: set[str] = set()
    rows: list[dict[str, Any]] = []
    for ordinal in range(1, question_count + 1):
        row: dict[str, Any] = {"id": ordinal}
        for view in ("blindMath", "solution", "variantComparison"):
            ref = f"benchmark-review:{ordinal}:{view}"
            catalog.add(ref)
            row[view] = {"status": "PASS", "method": "universal_runtime_benchmark", "evidenceRefs": [ref]}
        rows.append(row)
    return {
        "artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER",
        "schemaVersion": "0.1.0",
        "questions": rows,
    }, catalog


def _render_evidence(question_count: int) -> dict[str, Any]:
    mode = {
        "verdict": "PASS",
        "lastQuestion": question_count,
        "lastPageChecked": True,
        "unrenderedMath": 0,
        "overflowCount": 0,
        "badImages": [],
        "renderError": None,
        "screenshotCaptured": True,
    }
    return {
        "artifactType": "ALIVE_FINAL_RENDER_EVIDENCE",
        "actualBrowser": True,
        "productionEngine": True,
        "modes": {name: mode for name in ("exam", "solution", "answer")},
    }


def run_universal_variant_benchmark(root: Path, output_root: Path, repeats: int = 3) -> dict[str, Any]:
    """Run the contract benchmark repeatedly and write compact checkpoint artifacts."""

    if repeats < 1:
        raise UniversalVariantBenchmarkError("repeats must be positive")
    fixtures = load_universal_variant_fixtures(root)
    curriculum_registry = load_high1_curriculum_adapters(root)
    runs = [_run_once(curriculum_registry) for _ in range(repeats)]
    serialized = [json.dumps(item, ensure_ascii=False, sort_keys=True, separators=(",", ":")) for item in runs]
    deterministic = len(set(serialized)) == 1
    output_root = output_root.resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    report = {
        "artifactType": "ALIVE_UNIVERSAL_VARIANT_CONTRACT_BENCHMARK",
        "schemaVersion": BENCHMARK_SCHEMA_VERSION,
        "fixturePath": FIXTURES_RELATIVE_PATH.as_posix(),
        "fixtureCount": len(fixtures),
        "repetitions": repeats,
        "phaseStatus": {
            "phase0Contracts": "PASS",
            "phase05VariantReducer": "PASS" if runs[0]["reductions"]["A"]["status"] == "PASS" else "FAIL",
            "phase1A": "PASS" if runs[0]["a"]["status"] == "CANDIDATE_READY_FOR_SOLVER" else "FAIL",
            "phase2B": "PASS" if runs[0]["b"]["status"] == "CANDIDATE_READY_FOR_PROOF" else "FAIL",
            "phase3C": "PASS" if runs[0]["c"]["status"] == "CANDIDATE_READY_FOR_PROOF" else "FAIL",
            "phase4Negative": "PASS" if runs[0]["reductions"]["FAKE_C"]["verifiedClass"] == "FAKE_C" and runs[0]["reductions"]["ADVANCED"]["verifiedClass"] == "ADVANCED" else "FAIL",
            "phase5Capability": "PASS" if runs[0]["promotion"]["activeCount"] == 3 else "HOLD",
            "phase6Planner": "PASS" if runs[0]["planner"]["status"] == "PASS" else "FAIL",
            "phase7Promotion": "PASS_LOCAL_SEALED_NOT_PUBLISHED" if runs[0]["lifecycle"]["status"] == "SEALED_LOCAL" else "FAIL",
        },
        "determinism": {"status": "PASS" if deterministic else "FAIL"},
        "latest": runs[-1],
        "implementationScope": {
            "status": "BOUNDED_CONTRACT_READY",
            "productionStatus": "HOLD",
            "holds": [
                "UNIVERSAL_EXACT_SOLVER_NOT_CONNECTED",
                "UNIVERSAL_REAL_BROWSER_RENDER_NOT_EXECUTED",
                "CURRICULUM_FAMILY_ADAPTERS_NOT_PROMOTED",
            ],
        },
        "productionArchiveRegistration": "NOT_PERFORMED",
    }
    report_path = output_root / "summary.json"
    report["summaryPath"] = report_path.as_posix()
    atomic_write_json(report_path, report)
    report["summarySha256"] = sha256_file(report_path)
    return report


__all__ = [
    "BENCHMARK_SCHEMA_VERSION",
    "FIXTURES_RELATIVE_PATH",
    "UniversalVariantBenchmarkError",
    "load_universal_variant_fixtures",
    "run_universal_variant_benchmark",
]
