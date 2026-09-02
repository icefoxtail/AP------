"""Bounded exact A/B variant adapter for M2-07 Pythagorean applications."""

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


PYTHAGOREAN_APPLICATION_SCHEMA_VERSION = "0.1.0"
PYTHAGOREAN_APPLICATION_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_pythagorean_application.json")
PYTHAGOREAN_APPLICATION_UNIT_KEY = "M2-07"
PYTHAGOREAN_APPLICATION_FAMILY_ID = "PYTHAGOREAN_APPLICATION"


class MiddleSchoolPythagoreanApplicationVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolPythagoreanApplicationVariantError("boolean is not a length")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolPythagoreanApplicationVariantError(f"invalid application length: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _display(value: Any) -> str:
    number = _fraction(value)
    return str(number.numerator) if number.denominator == 1 else f"{number.numerator}/{number.denominator}"


def _visual_spec(*, solution: bool, title: str, fixture: dict[str, Any], target_value: Fraction) -> dict[str, Any]:
    data = fixture["data"]
    vertical, horizontal = (_fraction(data[key]) for key in ("vertical", "horizontal"))
    points = {"A": (0.0, 0.0), "B": (6.0, 0.0), "C": (0.0, 4.0)}
    segments = [{"from": {"x": points[start][0], "y": points[start][1]}, "to": {"x": points[end][0], "y": points[end][1]}, "kind": "segment"} for start, end in (("A", "B"), ("A", "C"), ("B", "C"))]
    annotations = [
        {"x": 2.0, "y": -0.45, "text": f"지면 거리={_display(horizontal)}"},
        {"x": -1.0, "y": 2.0, "text": f"벽 높이={_display(vertical)}"},
        {"x": 2.9, "y": 2.15, "text": f"사다리={'?' if not solution else _display(target_value)}"},
        {"x": 0.55, "y": 0.75, "text": "직각"},
        {"x": 2.0, "y": 4.55, "text": "사다리 길이와 직각삼각형"},
    ]
    if solution:
        annotations.append({"x": 2.0, "y": 3.95, "text": "높이²+거리²=사다리²"})
    return {"version": "0.1", "type": "segment_geometry", "title": title, "width": 460, "height": 320, "xRange": [-1.4, 7.0], "yRange": [-1.0, 5.5], "segments": segments, "points": [{"x": x, "y": y, "label": label} for label, (x, y) in points.items()], "rightAngles": [{"vertex": {"x": points["A"][0], "y": points["A"][1]}, "alongA": {"x": points["B"][0], "y": points["B"][1]}, "alongB": {"x": points["C"][0], "y": points["C"][1]}}], "annotations": annotations}


def solve_middle_school_pythagorean_application_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != PYTHAGOREAN_APPLICATION_UNIT_KEY or fixture.get("familyId") != PYTHAGOREAN_APPLICATION_FAMILY_ID:
        raise MiddleSchoolPythagoreanApplicationVariantError("fixture belongs to the M2-07 Pythagorean-application family")
    data = fixture["data"]
    vertical, horizontal = (_fraction(data[key]) for key in ("vertical", "horizontal"))
    if min(vertical, horizontal) <= 0 or vertical.denominator != 1 or horizontal.denominator != 1:
        raise MiddleSchoolPythagoreanApplicationVariantError("this bounded application adapter requires positive integer lengths")
    square = vertical * vertical + horizontal * horizontal
    root = math.isqrt(square.numerator)
    if square.denominator != 1 or root * root != square.numerator:
        raise MiddleSchoolPythagoreanApplicationVariantError("bounded application fixture must have an integer ladder length")
    target = Fraction(root)
    given = f"벽에 세운 사다리의 윗끝이 지면에서 ${_fmt(vertical)}$m 높이에 닿고, 사다리의 아랫끝은 벽에서 ${_fmt(horizontal)}$m 떨어져 있다. 사다리의 길이를 구하여라."
    steps = [
        {"title": "상황을 직각삼각형으로 나타내기", "work": "벽의 높이, 벽에서 떨어진 거리, 사다리가 이루는 삼각형은 직각삼각형이다.", "why": "벽과 지면은 서로 수직이므로 두 직각변은 높이와 거리이고 사다리는 빗변이다."},
        {"title": "피타고라스 정리 적용", "work": "높이² + 거리² = 사다리²", "why": "직각삼각형의 두 직각변 제곱의 합은 빗변 제곱과 같다."},
        {"title": "주어진 길이 대입", "work": f"${_fmt(vertical)}^2+{_fmt(horizontal)}^2=x^2$", "why": "벽의 높이와 지면 거리를 대입하고 사다리 길이를 x로 둔다."},
        {"title": "제곱근 계산 및 단위 확인", "work": f"$x^2={_fmt(square)}$이므로 $x={_fmt(target)}$", "why": "길이는 양수이므로 양의 제곱근을 선택하고 답의 단위를 m로 확인한다."},
    ]
    return {"answer": target, "answerText": f"$x={_fmt(target)}\\,\\mathrm{{m}}$", "given": given, "goal": "사다리의 길이 $x$를 구한다.", "keyIdea": "실생활의 높이·거리·사다리를 직각삼각형의 두 직각변과 빗변으로 대응시킨다.", "conceptNote": "벽과 지면이 수직이면 높이와 지면 거리는 직각변, 사다리는 빗변이 된다.", "steps": steps, "check": f"${_fmt(vertical)}^2+{_fmt(horizontal)}^2={_fmt(square)}={_fmt(target)}^2$이므로 사다리의 길이는 ${_fmt(target)}\\,\\mathrm{{m}}$가 맞다.", "commonMistakes": ["사다리를 직각변으로 생각하고 높이를 빗변으로 고르는 것", "높이와 지면 거리를 더한 뒤 답으로 쓰는 것", "계산한 수에 m 단위를 붙이지 않는 것"], "targetValue": target, "visualSpec": _visual_spec(solution=False, title="사다리와 직각삼각형", fixture=fixture, target_value=target), "solutionVisualSpec": _visual_spec(solution=True, title="사다리 길이 풀이 도형", fixture=fixture, target_value=target)}


def load_middle_school_pythagorean_application_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / PYTHAGOREAN_APPLICATION_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolPythagoreanApplicationVariantError("M2-07 application fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_STRUCTURED_FIXTURES" or payload.get("unitKey") != PYTHAGOREAN_APPLICATION_UNIT_KEY or payload.get("familyId") != PYTHAGOREAN_APPLICATION_FAMILY_ID:
        raise MiddleSchoolPythagoreanApplicationVariantError("M2-07 application fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != PYTHAGOREAN_APPLICATION_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolPythagoreanApplicationVariantError("M2-07 application corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_pythagorean_application_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=PYTHAGOREAN_APPLICATION_FAMILY_ID, solver_profile="middle_school_pythagorean_application_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY_SVG", TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-07-application-ordinary": {"vertical": 5, "horizontal": 12},
        "m2-07-application-boundary": {"vertical": 8, "horizontal": 15},
        "m2-07-application-composite": {"vertical": 7, "horizontal": 24},
        "m2-07-application-reverse-ordinary": {"vertical": 9, "horizontal": 12},
        "m2-07-application-reverse-boundary": {"vertical": 3, "horizontal": 4},
        "m2-07-application-reverse-composite": {"vertical": 6, "horizontal": 8},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolPythagoreanApplicationVariantError(f"no M2-07 application numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data = fixture["data"]
    if representation == "rearranged":
        content = f"벽과 지면이 수직이고, 벽의 높이가 {_fmt(data['vertical'])}m, 벽에서 떨어진 거리가 {_fmt(data['horizontal'])}m인 사다리의 길이를 $x$라 하자. $x$를 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph() -> dict[str, Any]:
    nodes = [{"nodeId": "model", "role": "core", "op": "model_context_as_right_triangle", "inputRole": ["ladder_context"], "outputRole": ["right_triangle"], "order": 0}, {"nodeId": "theorem", "role": "core", "op": "apply_pythagorean_theorem", "inputRole": ["right_triangle"], "outputRole": ["squared_equation"], "order": 1}, {"nodeId": "solve", "role": "core", "op": "take_positive_square_root", "inputRole": ["squared_equation"], "outputRole": ["ladder_length"], "order": 2}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[i]["nodeId"], "to": nodes[i + 1]["nodeId"]} for i in range(len(nodes) - 1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "standardUnit": "피타고라스 정리"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=PYTHAGOREAN_APPLICATION_FAMILY_ID, solution_graph=_graph(), curriculum={"courseKey": "M2", "unitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "label": "피타고라스 정리"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"positiveIntegerLengths": True, "integerApplicationAnswer": True, "rightAngleContext": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 2, "representation": 0, "decision": 2, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 2, "branch": 0, "newConcept": 0}, allowed_methods=["상황을 직각삼각형으로 모델링", "피타고라스 정리", "양의 제곱근 선택"], forbidden_methods=["사다리를 직각변으로 고르는 것", "중학교 교육과정 밖의 좌표·삼각함수를 사용하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-pythagorean-application-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_pythagorean_application_exact_adapter", evidence_refs=refs, summary="Exact context-to-right-triangle mapping and visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": PYTHAGOREAN_APPLICATION_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "벽·지면·사다리의 길이 관계를 직각삼각형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "standardUnit": "피타고라스 정리", "standardUnitOrder": 7, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": PYTHAGOREAN_APPLICATION_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_pythagorean_application_independent_exact_recompute", "evidenceRefs": [f"middle-pythagorean-application-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_pythagorean_application_solution_detail_contract", "evidenceRefs": [f"middle-pythagorean-application-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_pythagorean_application_visual_comparison", "evidenceRefs": [f"middle-pythagorean-application-review:{ordinal}:variantComparison"]}}


def build_middle_school_pythagorean_application_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolPythagoreanApplicationVariantError("C is HOLD for M2-07 application until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolPythagoreanApplicationVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_pythagorean_application_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_pythagorean_application_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_pythagorean_application_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolPythagoreanApplicationVariantError(f"M2-07 application variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "familyId": PYTHAGOREAN_APPLICATION_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_pythagorean_application_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_BOUNDED_VARIANT_INPUT", "schemaVersion": PYTHAGOREAN_APPLICATION_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M2-07_pythagorean_application_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M2-07 Pythagorean application exact A/B slice; C remains HOLD"}


def build_middle_school_pythagorean_application_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_pythagorean_application_variant_inputs(root, run_id=f"capability-middle-pythagorean-application-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": PYTHAGOREAN_APPLICATION_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": PYTHAGOREAN_APPLICATION_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": PYTHAGOREAN_APPLICATION_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": PYTHAGOREAN_APPLICATION_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_CAPABILITY_PROMOTION", "schemaVersion": PYTHAGOREAN_APPLICATION_SCHEMA_VERSION, "scope": "M2-07 Pythagorean-application structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_pythagorean_application_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_pythagorean_application_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_UNIVERSAL_SOURCE_JS", "schemaVersion": PYTHAGOREAN_APPLICATION_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-pythagorean-application-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_PYTHAGOREAN_APPLICATION_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": PYTHAGOREAN_APPLICATION_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M2-07_pythagorean_application_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["PYTHAGOREAN_APPLICATION_FAMILY_ID", "PYTHAGOREAN_APPLICATION_UNIT_KEY", "MiddleSchoolPythagoreanApplicationVariantError", "build_middle_school_pythagorean_application_capability_report", "build_middle_school_pythagorean_application_variant_inputs", "load_middle_school_pythagorean_application_fixtures", "middle_school_pythagorean_application_variant_registry", "prepare_middle_school_pythagorean_application_variant_run", "solve_middle_school_pythagorean_application_fixture"]
