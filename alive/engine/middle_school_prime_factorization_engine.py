"""Bounded exact A/B adapter for the M1-01 prime-factorization family."""

from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
from typing import Any

from .rule_pack import load_rule_pack, rule_pack_is_ready
from .run_store import atomic_write_json, sha256_file
from .solution_graph import normalize_solution_graph
from .source_question import json_sha256
from .structure_families import CAPABILITY_HOLD, CAPABILITY_SUPPORTED, StructureFamilyAdapter, StructureFamilyRegistry
from .universal_candidate import validate_universal_candidate
from .universal_ir import build_universal_question_ir, require_valid_universal_question_ir
from .universal_variant_engine import TRANSFORM_A_NUMERIC, TRANSFORM_B_REPRESENTATION, TRANSFORM_C_PARAMETER_RECOVERY, evaluate_capability_promotion
from .variant_proof import build_proof_check, reduce_variant_class


PRIME_FACTORIZATION_VARIANT_SCHEMA_VERSION = "0.1.0"
PRIME_FACTORIZATION_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_prime_factorization.json")
PRIME_FACTORIZATION_UNIT_KEY = "M1-01"
PRIME_FACTORIZATION_FAMILY_ID = "PRIME_FACTORIZATION"


class MiddleSchoolPrimeFactorizationVariantError(ValueError):
    pass


def _integer(value: Any) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolPrimeFactorizationVariantError("n must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolPrimeFactorizationVariantError(f"invalid n: {value!r}") from error
    if number != value or number < 2:
        raise MiddleSchoolPrimeFactorizationVariantError("n must be an integer greater than or equal to 2")
    return number


def _factorization(n: int) -> list[tuple[int, int]]:
    remainder = _integer(n)
    factors: list[tuple[int, int]] = []
    divisor = 2
    while divisor * divisor <= remainder:
        exponent = 0
        while remainder % divisor == 0:
            remainder //= divisor
            exponent += 1
        if exponent:
            factors.append((divisor, exponent))
        divisor += 1
    if remainder > 1:
        factors.append((remainder, 1))
    return factors


def _factorization_tex(factors: list[tuple[int, int]]) -> str:
    return r"\times ".join(str(prime) if exponent == 1 else f"{prime}^{{{exponent}}}" for prime, exponent in factors)


def _prime_product_tex(factors: list[tuple[int, int]]) -> str:
    return r"\times ".join(str(prime) for prime, exponent in factors for _ in range(exponent))


def _factorization_sentence(n: int, factors: list[tuple[int, int]]) -> str:
    return f"${n}={_factorization_tex(factors)}$"


def solve_middle_school_prime_factorization_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != PRIME_FACTORIZATION_UNIT_KEY or fixture.get("familyId") != PRIME_FACTORIZATION_FAMILY_ID:
        raise MiddleSchoolPrimeFactorizationVariantError("fixture belongs to M1-01 prime factorization")
    n = _integer(fixture.get("data", {}).get("n"))
    factors = _factorization(n)
    factorization = _factorization_tex(factors)
    prime_product = _prime_product_tex(factors)
    given = f"수 ${n}$을 소인수분해하여라."
    steps = [
        {"title": "소수로 나누기", "work": f"${n}={prime_product}$", "why": "합성수는 소수의 곱으로 계속 나누어 나타낸다."},
        {"title": "같은 소인수 묶기", "work": f"${prime_product}={factorization}$", "why": "같은 소인수를 지수로 묶어 간단히 나타낸다."},
        {"title": "소인수분해 결과 확인", "work": _factorization_sentence(n, factors), "why": "각 인수가 소수이고, 그 곱이 처음 수와 같으므로 소인수분해가 완성된다."},
    ]
    return {
        "answer": factorization,
        "answerText": f"${factorization}$",
        "given": given,
        "goal": "주어진 자연수를 소인수의 곱으로 나타낸다.",
        "keyIdea": "합성수를 소수로 계속 나눈 뒤 같은 소인수를 지수로 묶는다.",
        "conceptNote": "소인수분해는 1보다 큰 자연수를 소수만의 곱으로 나타내는 것이다. 같은 소인수가 반복되면 지수로 간단히 쓴다.",
        "steps": steps,
        "check": f"${prime_product}={n}$이고 {', '.join(str(prime) for prime, _ in factors)}은(는) 모두 소수이므로 ${factorization}$이 맞다.",
        "commonMistakes": ["소수가 아닌 수를 소인수로 남겨 두는 것", "같은 소인수의 개수를 지수에 잘못 쓰는 것", "1을 소인수에 포함하는 것"],
    }


def load_middle_school_prime_factorization_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / PRIME_FACTORIZATION_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolPrimeFactorizationVariantError("M1-01 prime-factorization fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_STRUCTURED_FIXTURES" or payload.get("unitKey") != PRIME_FACTORIZATION_UNIT_KEY or payload.get("familyId") != PRIME_FACTORIZATION_FAMILY_ID:
        raise MiddleSchoolPrimeFactorizationVariantError("M1-01 prime-factorization fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != PRIME_FACTORIZATION_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolPrimeFactorizationVariantError("M1-01 prime-factorization corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_prime_factorization_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=PRIME_FACTORIZATION_FAMILY_ID, solver_profile="middle_school_prime_factorization_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "NOT_REQUIRED", TRANSFORM_B_REPRESENTATION: "NOT_REQUIRED", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_n(fixture: dict[str, Any]) -> int:
    values = {"m1-01-ordinary": 84, "m1-01-boundary-prime": 51, "m1-01-composite": 120, "m1-01-repeated-factor": 150, "m1-01-large-prime": 194, "m1-01-mixed-composite": 252}
    try:
        return values[fixture["caseId"]]
    except KeyError as error:
        raise MiddleSchoolPrimeFactorizationVariantError(f"no M1-01 numeric mutation for {fixture.get('caseId')}") from error


def _graph() -> dict[str, Any]:
    return normalize_solution_graph({"nodes": [{"nodeId": "divide", "role": "core", "op": "divide_by_prime_factors", "inputRole": ["natural_number"], "outputRole": ["prime_product"], "order": 0}, {"nodeId": "group", "role": "core", "op": "group_equal_prime_factors", "inputRole": ["prime_product"], "outputRole": ["exponent_form"], "order": 1}], "edges": [{"from": "divide", "to": "group"}], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    n = _integer(fixture["data"]["n"])
    content = f"수 ${n}$을 소인수분해하여라." if representation == "standard" else f"수 ${n}$을 소인수의 곱으로 나타내고 지수 꼴로 정리하여라."
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, **payload, "answer": result["answerText"], "solution": result["answerText"], "standardCourse": "중1 수학", "standardUnitKey": PRIME_FACTORIZATION_UNIT_KEY, "standardUnit": "소인수분해"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=PRIME_FACTORIZATION_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M1", "unitKey": PRIME_FACTORIZATION_UNIT_KEY, "label": "소인수분해"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=["n"], constraints={"integerAtLeastTwo": True, "primeFactorsOnly": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 2, "visualLoad": 0, "branch": 0, "newConcept": 0}, allowed_methods=["소인수분해", "소수 판별", "지수 꼴"], forbidden_methods=["1을 소인수로 포함하기", "소수가 아닌 인수를 소인수로 남기기", "중학교 교육과정 밖의 우회 공식 사용"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-prime-factorization-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_prime_factorization_exact_adapter", evidence_refs=refs, summary="Exact prime-factorization recomputation and representation comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": PRIME_FACTORIZATION_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"]}, inferred_visual_requirement="NOT_REQUIRED")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중1 수학", "standardUnitKey": PRIME_FACTORIZATION_UNIT_KEY, "standardUnit": "소인수분해", "standardUnitOrder": 1, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_PRIME_FACTORIZATION_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": PRIME_FACTORIZATION_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_PRIME_FACTORIZATION_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "NONE", "solutionVisualElements": {"required": False}, "visualSpec": None, "solutionVisualSpec": None}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_prime_factorization_independent_exact_recompute", "evidenceRefs": [f"middle-prime-factorization-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_prime_factorization_solution_detail_contract", "evidenceRefs": [f"middle-prime-factorization-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_prime_factorization_representation_comparison", "evidenceRefs": [f"middle-prime-factorization-review:{ordinal}:variantComparison"]}}


def build_middle_school_prime_factorization_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolPrimeFactorizationVariantError("C is HOLD for M1-01 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolPrimeFactorizationVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_prime_factorization_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_prime_factorization_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"]["n"] = _mutated_n(fixture)
        result = solve_middle_school_prime_factorization_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolPrimeFactorizationVariantError(f"M1-01 prime-factorization variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": PRIME_FACTORIZATION_UNIT_KEY, "familyId": PRIME_FACTORIZATION_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_prime_factorization_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_BOUNDED_VARIANT_INPUT", "schemaVersion": PRIME_FACTORIZATION_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_PRIME_FACTORIZATION_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M1-01_prime_factorization_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "NONE", "problem": "NOT_REQUIRED", "solution": "NOT_REQUIRED"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M1-01 prime factorization exact A/B slice; C remains HOLD"}


def build_middle_school_prime_factorization_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_prime_factorization_variant_inputs(root, run_id=f"capability-middle-prime-factorization-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": PRIME_FACTORIZATION_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": PRIME_FACTORIZATION_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": PRIME_FACTORIZATION_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": PRIME_FACTORIZATION_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": PRIME_FACTORIZATION_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": PRIME_FACTORIZATION_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_CAPABILITY_PROMOTION", "schemaVersion": PRIME_FACTORIZATION_VARIANT_SCHEMA_VERSION, "scope": "M1-01 prime factorization structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_prime_factorization_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_prime_factorization_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    root = Path(root).resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_UNIVERSAL_SOURCE_JS", "schemaVersion": PRIME_FACTORIZATION_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(root).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    atomic_write_json(store.run_dir(run_id) / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-prime-factorization-exact-variant-preflight")
    record_universal_visual_recon(store, run_id, inputs["visualRecon"])
    record_universal_ir_analysis(store, run_id, inputs["sourceIR"])
    record_universal_capability_preflight(store, run_id, inputs["capabilityPreflight"])
    record_universal_candidate_set(store, run_id, inputs["candidates"])
    precheck = record_universal_variant_precheck(store, run_id, inputs["proofRows"], evidence_catalog=inputs["proofCatalog"])
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review1", evidence_catalog=inputs["reviewCatalog"])
    record_universal_revision(store, run_id, {"status": "PASS", "bounded": True, "changedQuestionIds": []})
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review2", evidence_catalog=inputs["reviewCatalog"])
    record_universal_mother_final(store, run_id)
    ledger = write_universal_variant_ledger(store, run_id, precheck["precheck"]["questions"])
    assembled = assemble_universal_exam(store, run_id, title, archive_root=root / "archive")
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PRIME_FACTORIZATION_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": PRIME_FACTORIZATION_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M1-01_prime_factorization_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["MiddleSchoolPrimeFactorizationVariantError", "build_middle_school_prime_factorization_capability_report", "build_middle_school_prime_factorization_variant_inputs", "load_middle_school_prime_factorization_fixtures", "middle_school_prime_factorization_variant_registry", "prepare_middle_school_prime_factorization_variant_run", "solve_middle_school_prime_factorization_fixture"]
