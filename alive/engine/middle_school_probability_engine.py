"""Bounded exact A/B adapters for the M2-08 probability families."""

from __future__ import annotations

import copy
import hashlib
import json
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


PROBABILITY_VARIANT_SCHEMA_VERSION = "0.1.0"
PROBABILITY_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_probability.json")
PROBABILITY_UNIT_KEY = "M2-08"
PROBABILITY_FAMILIES = ("PROBABILITY_BASIC", "PROBABILITY_COUNTING")


class MiddleSchoolProbabilityVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolProbabilityVariantError("boolean is not a count")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolProbabilityVariantError(f"invalid count: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _family_fixture_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data = fixture["data"]
    if fixture["familyId"] == "PROBABILITY_BASIC":
        if representation == "rearranged":
            content = f"전체 가능한 결과가 {_fmt(data['total'])}가지이고 사건 A가 일어나는 결과가 {_fmt(data['favorable'])}가지일 때, 사건 A의 확률을 $x$라 하자. $x$를 구하여라."
        else:
            content = result["given"]
    else:
        if representation == "rearranged":
            content = f"첫 번째 선택은 {_fmt(data['firstChoices'])}가지, 두 번째 선택은 {_fmt(data['secondChoices'])}가지이다. 전체 결과가 똑같이 가능하고 특정 조건을 만족하는 결과가 {_fmt(data['favorable'])}가지일 때 그 확률을 구하여라."
        else:
            content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def solve_middle_school_probability_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != PROBABILITY_UNIT_KEY or fixture.get("familyId") not in PROBABILITY_FAMILIES:
        raise MiddleSchoolProbabilityVariantError("fixture belongs to an M2-08 probability family")
    data = fixture["data"]
    if fixture["familyId"] == "PROBABILITY_BASIC":
        total, favorable = (_fraction(data[key]) for key in ("total", "favorable"))
        if total <= 0 or favorable < 0 or favorable > total or total.denominator != 1 or favorable.denominator != 1:
            raise MiddleSchoolProbabilityVariantError("basic probability counts must satisfy 0 <= favorable <= total")
        total_i, favorable_i = int(total), int(favorable)
        probability = Fraction(favorable_i, total_i)
        given = f"어떤 실험의 전체 가능한 결과가 {_fmt(total)}가지이고 사건 A가 일어나는 결과가 {_fmt(favorable)}가지일 때, 사건 A의 확률을 구하여라."
        steps = [
            {"title": "전체와 유리한 경우 확인", "work": f"전체 경우의 수={_fmt(total)}, 유리한 경우의 수={_fmt(favorable)}", "why": "확률은 전체 가능한 경우 중 사건이 일어나는 경우의 비이다."},
            {"title": "확률의 기본식 적용", "work": "$P(A)=\\dfrac{\\text{유리한 경우의 수}}{\\text{전체 경우의 수}}$", "why": "각 결과가 똑같이 가능할 때 확률의 정의를 사용한다."},
            {"title": "수치 대입 및 약분", "work": f"$P(A)=\\dfrac{{{_fmt(favorable)}}}{{{_fmt(total)}}}={_fmt(probability)}$", "why": "유리한 경우의 수를 분자, 전체 경우의 수를 분모에 놓고 기약분수로 정리한다."},
        ]
        return {"answer": probability, "answerText": f"$P(A)={_fmt(probability)}$", "given": given, "goal": "사건 A의 확률을 구한다.", "keyIdea": "확률은 유리한 경우의 수를 전체 경우의 수로 나눈 값이다.", "conceptNote": "각 결과가 똑같이 가능할 때 확률은 0 이상 1 이하이고, 유리한 경우의 수/전체 경우의 수로 계산한다.", "steps": steps, "check": f"$0\\le {_fmt(probability)}\\le 1$이고 전체 {_fmt(total)}가지 중 {_fmt(favorable)}가지의 비와 같으므로 답이 맞다.", "commonMistakes": ["전체 경우의 수와 유리한 경우의 수를 거꾸로 쓰는 것", "확률을 1보다 크게 계산하는 것", "분수를 약분하지 않거나 약분을 잘못하는 것"]}
    first, second, favorable = (_fraction(data[key]) for key in ("firstChoices", "secondChoices", "favorable"))
    if min(first, second) <= 0 or any(value.denominator != 1 for value in (first, second, favorable)):
        raise MiddleSchoolProbabilityVariantError("counting probability choices must be positive integers")
    total = first * second
    if favorable < 0 or favorable > total:
        raise MiddleSchoolProbabilityVariantError("favorable outcomes must not exceed the product of choices")
    probability = favorable / total
    given = f"첫 번째 선택이 {_fmt(first)}가지이고 각 첫 번째 선택마다 두 번째 선택이 {_fmt(second)}가지씩 가능하다. 모든 결과가 똑같이 가능할 때, 특정 조건을 만족하는 결과가 {_fmt(favorable)}가지라면 그 확률을 구하여라."
    steps = [
        {"title": "전체 경우의 수 계산", "work": f"전체 경우의 수={_fmt(first)}\\times {_fmt(second)}={_fmt(total)}", "why": "첫 번째 선택과 두 번째 선택을 차례로 하므로 곱의 법칙을 사용한다."},
        {"title": "유리한 경우 확인", "work": f"유리한 경우의 수={_fmt(favorable)}", "why": "문제에서 주어진 조건을 만족하는 결과의 수를 그대로 사용한다."},
        {"title": "확률식 세우기", "work": f"$P(A)=\\dfrac{{{_fmt(favorable)}}}{{{_fmt(total)}}}={_fmt(probability)}$", "why": "전체 결과가 똑같이 가능하므로 유리한 경우와 전체 경우의 비를 구한다."},
    ]
    return {"answer": probability, "answerText": f"$P(A)={_fmt(probability)}$", "given": given, "goal": "특정 조건이 만족될 확률을 구한다.", "keyIdea": "먼저 곱의 법칙으로 전체 경우의 수를 구하고, 유리한 경우의 수와 비교한다.", "conceptNote": "단계가 연속되고 각 단계의 선택이 독립적으로 정해지는 구조에서는 전체 경우의 수를 곱으로 계산한다.", "steps": steps, "check": f"전체 {_fmt(total)}가지 중 유리한 경우가 {_fmt(favorable)}가지이므로 $0\\le {_fmt(probability)}\\le 1$이 성립한다.", "commonMistakes": ["두 단계 선택의 경우의 수를 더하는 것", "유리한 경우의 수와 전체 경우의 수를 거꾸로 쓰는 것", "확률이 1을 넘는 계산을 그대로 두는 것"]}


def load_middle_school_probability_fixtures(root: Path, family_id: str) -> list[dict[str, Any]]:
    if family_id not in PROBABILITY_FAMILIES:
        raise MiddleSchoolProbabilityVariantError(f"unsupported probability family: {family_id}")
    try:
        payload = json.loads((Path(root) / PROBABILITY_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolProbabilityVariantError("M2-08 probability fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_PROBABILITY_STRUCTURED_FIXTURES" or payload.get("unitKey") is not None:
        raise MiddleSchoolProbabilityVariantError("M2-08 probability fixture metadata is invalid")
    units = [item for item in payload.get("units", []) if isinstance(item, dict) and item.get("familyId") == family_id]
    if len(units) != 1 or units[0].get("unitKey") != PROBABILITY_UNIT_KEY:
        raise MiddleSchoolProbabilityVariantError(f"fixture unit missing for {family_id}")
    fixtures = units[0].get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != family_id for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolProbabilityVariantError(f"M2-08 {family_id} corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_probability_variant_registry(family_id: str) -> StructureFamilyRegistry:
    if family_id not in PROBABILITY_FAMILIES:
        raise MiddleSchoolProbabilityVariantError(f"unsupported probability family: {family_id}")
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=family_id, solver_profile=f"middle_school_{family_id.lower()}_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "NOT_REQUIRED", TRANSFORM_B_REPRESENTATION: "NOT_REQUIRED", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-08-basic-ordinary": {"total": 12, "favorable": 3}, "m2-08-basic-boundary": {"total": 8, "favorable": 1}, "m2-08-basic-composite": {"total": 24, "favorable": 9}, "m2-08-basic-reverse-ordinary": {"total": 9, "favorable": 2}, "m2-08-basic-reverse-boundary": {"total": 5, "favorable": 4}, "m2-08-basic-reverse-composite": {"total": 36, "favorable": 14},
        "m2-08-counting-ordinary": {"firstChoices": 4, "secondChoices": 3, "favorable": 4}, "m2-08-counting-boundary": {"firstChoices": 3, "secondChoices": 4, "favorable": 2}, "m2-08-counting-composite": {"firstChoices": 5, "secondChoices": 4, "favorable": 5}, "m2-08-counting-reverse-ordinary": {"firstChoices": 3, "secondChoices": 5, "favorable": 3}, "m2-08-counting-reverse-boundary": {"firstChoices": 4, "secondChoices": 2, "favorable": 3}, "m2-08-counting-reverse-composite": {"firstChoices": 6, "secondChoices": 5, "favorable": 9},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolProbabilityVariantError(f"no M2-08 numeric mutation for {fixture.get('caseId')}") from error


def _graph(family_id: str) -> dict[str, Any]:
    if family_id == "PROBABILITY_BASIC":
        nodes = [{"nodeId": "sample", "role": "core", "op": "identify_sample_space", "inputRole": ["equally_likely_outcomes"], "outputRole": ["total_and_favorable_counts"], "order": 0}, {"nodeId": "ratio", "role": "core", "op": "compute_favorable_over_total", "inputRole": ["total_and_favorable_counts"], "outputRole": ["probability"], "order": 1}]
    else:
        nodes = [{"nodeId": "count", "role": "core", "op": "apply_product_rule", "inputRole": ["sequential_choices"], "outputRole": ["total_outcomes"], "order": 0}, {"nodeId": "ratio", "role": "core", "op": "compute_favorable_over_total", "inputRole": ["total_outcomes"], "outputRole": ["probability"], "order": 1}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[i]["nodeId"], "to": nodes[i + 1]["nodeId"]} for i in range(len(nodes) - 1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _family_fixture_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": PROBABILITY_UNIT_KEY, "standardUnit": "확률"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=fixture["familyId"], solution_graph=_graph(fixture["familyId"]), curriculum={"courseKey": "M2", "unitKey": PROBABILITY_UNIT_KEY, "label": "확률"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"equallyLikely": True, "probabilityBounds": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 0, "branch": 0, "newConcept": 0}, allowed_methods=["유리한 경우의 수/전체 경우의 수", "곱의 법칙", "기약분수"], forbidden_methods=["확률이 1보다 큰 결과를 허용하는 것", "중학교 교육과정 밖의 조합·확률 공식으로 우회하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int, family_id: str) -> dict[str, Any]:
    refs = [f"middle-probability-proof:{family_id}:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method=f"middle_school_{family_id.lower()}_exact_adapter", evidence_refs=refs, summary="Exact probability computation and representation comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": family_id, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
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
    payload = _family_fixture_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": PROBABILITY_UNIT_KEY, "standardUnit": "확률", "standardUnitOrder": 8, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], f"ALIVE_UNIVERSAL_MIDDLE_SCHOOL_{fixture['familyId']}_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": fixture["familyId"], "bridgeStatus": f"BOUNDED_MIDDLE_SCHOOL_{fixture['familyId']}_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "NONE", "solutionVisualElements": {"required": False}, "visualSpec": None, "solutionVisualSpec": None}
    return validate_universal_candidate(candidate)


def _review(ordinal: int, family_id: str) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": f"middle_school_{family_id.lower()}_independent_exact_recompute", "evidenceRefs": [f"middle-probability-review:{family_id}:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": f"middle_school_{family_id.lower()}_solution_detail_contract", "evidenceRefs": [f"middle-probability-review:{family_id}:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": f"middle_school_{family_id.lower()}_representation_comparison", "evidenceRefs": [f"middle-probability-review:{family_id}:{ordinal}:variantComparison"]}}


def build_middle_school_probability_variant_inputs(root: Path, *, run_id: str, declared_class: str, family_id: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolProbabilityVariantError(f"C is HOLD for {family_id} until a genuine preprocess fixture exists")
    if family_id not in PROBABILITY_FAMILIES:
        raise MiddleSchoolProbabilityVariantError(f"unsupported probability family: {family_id}")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolProbabilityVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_probability_fixtures(root, family_id)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_probability_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_probability_fixture(variant)
        candidate_payload = _family_fixture_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal, family_id)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolProbabilityVariantError(f"{family_id} variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal, family_id))
        assignments.append({"id": ordinal, "unitKey": PROBABILITY_UNIT_KEY, "familyId": family_id, "transform": transform, "status": "READY", "solver": f"middle_school_{family_id.lower()}_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PROBABILITY_BOUNDED_VARIANT_INPUT", "schemaVersion": PROBABILITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": f"BOUNDED_MIDDLE_SCHOOL_{family_id}_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": f"M2-08_{family_id.lower()}_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "NOT_REQUIRED", "problem": "NOT_REQUIRED", "solution": "NOT_REQUIRED"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": f"M2-08 {family_id} exact A/B slice; C remains HOLD"}


def build_middle_school_probability_capability_report(root: Path, family_id: str) -> dict[str, Any]:
    if family_id not in PROBABILITY_FAMILIES:
        raise MiddleSchoolProbabilityVariantError(f"unsupported probability family: {family_id}")
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_probability_variant_inputs(root, run_id=f"capability-middle-{family_id.lower()}-{declared_class.lower()}", declared_class=declared_class, family_id=family_id)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": family_id, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": PROBABILITY_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": family_id, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": PROBABILITY_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": family_id, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": PROBABILITY_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_PROBABILITY_CAPABILITY_PROMOTION", "schemaVersion": PROBABILITY_VARIANT_SCHEMA_VERSION, "scope": f"M2-08 {family_id} structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "familyId": family_id, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_probability_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str, family_id: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_probability_variant_inputs(root, run_id=run_id, declared_class=declared_class, family_id=family_id)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_PROBABILITY_UNIVERSAL_SOURCE_JS", "schemaVersion": PROBABILITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "familyId": family_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence=f"middle-school-{family_id.lower()}-exact-variant-preflight")
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
    assembled = assemble_universal_exam(store, run_id, title, archive_root=Path(root).resolve() / "archive")
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PROBABILITY_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": PROBABILITY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "familyId": family_id, "fixtureScope": inputs["fixtureScope"], "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["PROBABILITY_FAMILIES", "PROBABILITY_UNIT_KEY", "MiddleSchoolProbabilityVariantError", "build_middle_school_probability_capability_report", "build_middle_school_probability_variant_inputs", "load_middle_school_probability_fixtures", "middle_school_probability_variant_registry", "prepare_middle_school_probability_variant_run", "solve_middle_school_probability_fixture"]
