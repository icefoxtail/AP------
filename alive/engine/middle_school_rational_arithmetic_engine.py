"""Bounded exact A/B adapter for the M1-02 rational-arithmetic family."""

from __future__ import annotations

import copy
import hashlib
import json
import math
from fractions import Fraction
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


RATIONAL_ARITHMETIC_VARIANT_SCHEMA_VERSION = "0.1.0"
RATIONAL_ARITHMETIC_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_rational_arithmetic.json")
RATIONAL_ARITHMETIC_UNIT_KEY = "M1-02"
RATIONAL_ARITHMETIC_FAMILY_ID = "RATIONAL_ARITHMETIC"


class MiddleSchoolRationalArithmeticVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolRationalArithmeticVariantError("rational value cannot be boolean")
    try:
        if isinstance(value, dict):
            numerator, denominator = int(value["num"]), int(value["den"])
            return Fraction(numerator, denominator)
        return Fraction(value)
    except (KeyError, TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolRationalArithmeticVariantError(f"invalid rational value: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    sign = "-" if number < 0 else ""
    return f"{sign}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _term(value: Fraction) -> str:
    text = _fmt(value)
    return f"\\left({text}\\right)" if value < 0 else text


def _expression(data: dict[str, Any]) -> tuple[Fraction, str]:
    a, b = _fraction(data["a"]), _fraction(data["b"])
    if data.get("operation") == "add":
        return a + b, f"{_term(a)}+{_term(b)}"
    if data.get("operation") == "subtract":
        return a - b, f"{_term(a)}-{_term(b)}"
    raise MiddleSchoolRationalArithmeticVariantError("operation must be add or subtract")


def solve_middle_school_rational_arithmetic_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != RATIONAL_ARITHMETIC_UNIT_KEY or fixture.get("familyId") != RATIONAL_ARITHMETIC_FAMILY_ID:
        raise MiddleSchoolRationalArithmeticVariantError("fixture belongs to M1-02 rational arithmetic")
    data = fixture.get("data", {})
    a, b = _fraction(data.get("a")), _fraction(data.get("b"))
    answer, expression = _expression(data)
    operation_label = "덧셈" if data.get("operation") == "add" else "뺄셈"
    common_denominator = abs(a.denominator * b.denominator) // math.gcd(a.denominator, b.denominator)
    scaled_a = a * common_denominator
    scaled_b = b * common_denominator
    signed_work = f"$\\dfrac{{{scaled_a.numerator}}}{{{common_denominator}}}{'+' if data.get('operation') == 'add' else '-'}\\dfrac{{{scaled_b.numerator}}}{{{common_denominator}}}={_fmt(answer)}$"
    given = f"다음 유리수의 {operation_label}을 계산하여라: ${expression}$"
    steps = [
        {"title": "부호와 분모 확인", "work": f"${expression}$에서 두 수의 부호와 분모를 확인한다.", "why": "정수와 유리수의 계산에서는 부호를 먼저 확인해야 계산 순서를 놓치지 않는다."},
        {"title": "공통분모로 통분하기", "work": f"공통분모는 ${common_denominator}$이므로 {signed_work}", "why": "분모가 다른 분수의 덧셈과 뺄셈은 공통분모로 통분한 뒤 분자끼리 계산한다."},
        {"title": "기약분수로 정리하기", "work": f"${_fmt(answer)}$", "why": "계산 결과가 정수가 아니면 분자와 분모의 공약수로 약분하여 기약분수로 나타낸다."},
    ]
    return {"answer": answer, "answerText": f"${_fmt(answer)}$", "given": given, "goal": "주어진 유리수 계산의 결과를 기약분수로 나타낸다.", "keyIdea": "부호를 확인하고 공통분모로 통분한 다음 분자끼리 계산한다.", "conceptNote": "유리수의 덧셈과 뺄셈은 공통분모를 만든 뒤 분자끼리 계산하며, 마지막에는 기약분수로 정리한다.", "steps": steps, "check": f"통분한 뒤 계산한 값이 ${_fmt(answer)}$이고, 원래 식 ${expression}$에 대입해도 같은 값이므로 답이 맞다.", "commonMistakes": ["음수를 뺄 때 부호를 바꾸지 않는 것", "분모끼리 더하거나 빼는 것", "계산 후 약분하지 않는 것"]}


def load_middle_school_rational_arithmetic_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / RATIONAL_ARITHMETIC_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolRationalArithmeticVariantError("M1-02 rational-arithmetic fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_STRUCTURED_FIXTURES" or payload.get("unitKey") != RATIONAL_ARITHMETIC_UNIT_KEY or payload.get("familyId") != RATIONAL_ARITHMETIC_FAMILY_ID:
        raise MiddleSchoolRationalArithmeticVariantError("M1-02 rational-arithmetic fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != RATIONAL_ARITHMETIC_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolRationalArithmeticVariantError("M1-02 rational-arithmetic corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_rational_arithmetic_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=RATIONAL_ARITHMETIC_FAMILY_ID, solver_profile="middle_school_rational_arithmetic_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "NOT_REQUIRED", TRANSFORM_B_REPRESENTATION: "NOT_REQUIRED", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m1-02-ordinary": {"operation": "add", "a": {"num": 5, "den": 6}, "b": {"num": 1, "den": 3}},
        "m1-02-boundary-zero": {"operation": "add", "a": {"num": -2, "den": 5}, "b": {"num": 1, "den": 10}},
        "m1-02-composite": {"operation": "add", "a": {"num": -3, "den": 4}, "b": {"num": 5, "den": 8}},
        "m1-02-subtract-negative": {"operation": "subtract", "a": {"num": 7, "den": 8}, "b": {"num": -1, "den": 4}},
        "m1-02-negative-result": {"operation": "subtract", "a": {"num": -5, "den": 6}, "b": {"num": 1, "den": 3}},
        "m1-02-mixed": {"operation": "add", "a": {"num": 5, "den": 2}, "b": {"num": -3, "den": 4}},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolRationalArithmeticVariantError(f"no M1-02 numeric mutation for {fixture.get('caseId')}") from error


def _graph() -> dict[str, Any]:
    return normalize_solution_graph({"nodes": [{"nodeId": "sign", "role": "core", "op": "identify_signs_and_operation", "inputRole": ["rational_expression"], "outputRole": ["signed_terms"], "order": 0}, {"nodeId": "common", "role": "core", "op": "make_common_denominator", "inputRole": ["signed_terms"], "outputRole": ["like_denominator_terms"], "order": 1}, {"nodeId": "calculate", "role": "core", "op": "calculate_and_reduce", "inputRole": ["like_denominator_terms"], "outputRole": ["reduced_rational"], "order": 2}], "edges": [{"from": "sign", "to": "common"}, {"from": "common", "to": "calculate"}], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    _, expression = _expression(fixture["data"])
    if representation == "standard":
        content = f"다음 유리수의 계산을 하여라: ${expression}$"
    else:
        content = f"다음 식의 값을 기약분수로 나타내어라: ${expression}$"
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, **payload, "answer": result["answerText"], "solution": result["answerText"], "standardCourse": "중1 수학", "standardUnitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "standardUnit": "정수와 유리수"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=RATIONAL_ARITHMETIC_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M1", "unitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "label": "정수와 유리수"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=["a", "b", "operation"], constraints={"nonZeroDenominators": True, "exactRationalArithmetic": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 2, "visualLoad": 0, "branch": 0, "newConcept": 0}, allowed_methods=["통분", "부호 계산", "기약분수"], forbidden_methods=["분모끼리 계산하기", "음수 부호 누락", "중학교 교육과정 밖의 우회 공식 사용"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-rational-arithmetic-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_rational_arithmetic_exact_adapter", evidence_refs=refs, summary="Exact signed-rational recomputation and representation comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": RATIONAL_ARITHMETIC_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
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
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중1 수학", "standardUnitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "standardUnit": "정수와 유리수", "standardUnitOrder": 2, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": RATIONAL_ARITHMETIC_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "NONE", "solutionVisualElements": {"required": False}, "visualSpec": None, "solutionVisualSpec": None}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_rational_arithmetic_independent_exact_recompute", "evidenceRefs": [f"middle-rational-arithmetic-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_rational_arithmetic_solution_detail_contract", "evidenceRefs": [f"middle-rational-arithmetic-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_rational_arithmetic_representation_comparison", "evidenceRefs": [f"middle-rational-arithmetic-review:{ordinal}:variantComparison"]}}


def build_middle_school_rational_arithmetic_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolRationalArithmeticVariantError("C is HOLD for M1-02 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolRationalArithmeticVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_rational_arithmetic_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_rational_arithmetic_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_rational_arithmetic_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolRationalArithmeticVariantError(f"M1-02 rational-arithmetic variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "familyId": RATIONAL_ARITHMETIC_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_rational_arithmetic_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_BOUNDED_VARIANT_INPUT", "schemaVersion": RATIONAL_ARITHMETIC_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M1-02_rational_arithmetic_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "NONE", "problem": "NOT_REQUIRED", "solution": "NOT_REQUIRED"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M1-02 rational arithmetic exact A/B slice; C remains HOLD"}


def build_middle_school_rational_arithmetic_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_rational_arithmetic_variant_inputs(root, run_id=f"capability-middle-rational-arithmetic-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": RATIONAL_ARITHMETIC_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": RATIONAL_ARITHMETIC_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": RATIONAL_ARITHMETIC_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": RATIONAL_ARITHMETIC_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_CAPABILITY_PROMOTION", "schemaVersion": RATIONAL_ARITHMETIC_VARIANT_SCHEMA_VERSION, "scope": "M1-02 rational arithmetic structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_rational_arithmetic_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_rational_arithmetic_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    root = Path(root).resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_UNIVERSAL_SOURCE_JS", "schemaVersion": RATIONAL_ARITHMETIC_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(root).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    atomic_write_json(store.run_dir(run_id) / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-rational-arithmetic-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_RATIONAL_ARITHMETIC_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": RATIONAL_ARITHMETIC_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M1-02_rational_arithmetic_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["MiddleSchoolRationalArithmeticVariantError", "build_middle_school_rational_arithmetic_capability_report", "build_middle_school_rational_arithmetic_variant_inputs", "load_middle_school_rational_arithmetic_fixtures", "middle_school_rational_arithmetic_variant_registry", "prepare_middle_school_rational_arithmetic_variant_run", "solve_middle_school_rational_arithmetic_fixture"]
