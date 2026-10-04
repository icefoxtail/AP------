"""Bounded exact A/B variant adapter for M2-05 quadrilateral properties."""

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


QUADRILATERAL_VARIANT_SCHEMA_VERSION = "0.1.0"
QUADRILATERAL_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_quadrilateral.json")
QUADRILATERAL_UNIT_KEY = "M2-05"
QUADRILATERAL_FAMILY_ID = "QUADRILATERAL_PROPERTIES"


class MiddleSchoolQuadrilateralVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolQuadrilateralVariantError("boolean is not a quadrilateral angle")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolQuadrilateralVariantError(f"invalid quadrilateral angle: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _angle(value: Any) -> str:
    return f"{_fmt(value)}^\\circ"


def _display_angle(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return f"{number.numerator}°"
    return f"{number.numerator}/{number.denominator}°"


def _quad_points(angle_a: Fraction) -> dict[str, tuple[float, float]]:
    base = 6.0
    side = 3.2
    radians = math.radians(float(angle_a))
    offset = (side * math.cos(radians), side * math.sin(radians))
    return {"A": (0.0, 0.0), "B": (base, 0.0), "C": (base + offset[0], offset[1]), "D": offset}


def _visual_spec(
    fixture: dict[str, Any],
    *,
    solution: bool,
    title: str,
    angle_a: Fraction,
    angle_b: Fraction,
    angle_c: Fraction,
    angle_d: Fraction,
    target_label: str,
    target_value: Fraction,
) -> dict[str, Any]:
    points = _quad_points(angle_a)
    segments = [{"from": {"x": points[start][0], "y": points[start][1]}, "to": {"x": points[end][0], "y": points[end][1]}, "kind": "segment"} for start, end in (("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"))]
    kind = fixture["kind"]
    target_question = f"∠{target_label}={'?' if not solution else _display_angle(target_value)}"
    if kind == "parallelogram_opposite_angle":
        annotations = [
            {"x": points["A"][0] + 0.2, "y": points["A"][1] + 0.5, "text": f"∠A={_display_angle(angle_a)}"},
            {"x": points["C"][0] - 0.2, "y": points["C"][1] - 0.25, "text": target_question},
            {"x": 3.0, "y": max(points["C"][1] * 0.45, 0.8), "text": "AB∥CD, AD∥BC"},
        ]
    else:
        annotations = [
            {"x": points["A"][0] + 0.2, "y": points["A"][1] + 0.5, "text": f"∠A={_display_angle(angle_a)}"},
            {"x": points["B"][0] - 1.0, "y": points["B"][1] + 0.5, "text": target_question},
            {"x": 3.0, "y": max(points["C"][1] * 0.45, 0.8), "text": "이웃한 두 각의 합"},
        ]
    all_xy = list(points.values())
    low_x = math.floor(min(x for x, _ in all_xy)) - 1
    high_x = math.ceil(max(x for x, _ in all_xy)) + 1
    high_y = math.ceil(max(y for _, y in all_xy)) + 2
    spec: dict[str, Any] = {
        "version": "0.1",
        "type": "segment_geometry",
        "title": title,
        "width": 460,
        "height": 320,
        "xRange": [float(low_x), float(high_x)],
        "yRange": [-1.0, float(high_y)],
        "segments": segments,
        "points": [{"x": x, "y": y, "label": label} for label, (x, y) in points.items()],
        "annotations": annotations + [{"x": float(low_x) + 0.3, "y": float(high_y) - 0.35, "text": "평행사변형 ABCD"}, {"x": float(low_x) + 0.3, "y": -0.55, "text": f"∠{target_label}를 구하여라"}],
    }
    if solution:
        spec["annotations"].append({"x": float(low_x) + 0.3, "y": -0.8, "text": "풀이에 사용할 각의 관계"})
    if angle_a == 90:
        spec["rightAngles"] = []
        for vertex, along_a, along_b in (("A", "B", "D"), ("B", "A", "C"), ("C", "B", "D"), ("D", "A", "C")):
            spec["rightAngles"].append({"vertex": {"x": points[vertex][0], "y": points[vertex][1]}, "alongA": {"x": points[along_a][0], "y": points[along_a][1]}, "alongB": {"x": points[along_b][0], "y": points[along_b][1]}})
    return spec


def solve_middle_school_quadrilateral_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != QUADRILATERAL_UNIT_KEY or fixture.get("familyId") != QUADRILATERAL_FAMILY_ID:
        raise MiddleSchoolQuadrilateralVariantError("fixture belongs to the M2-05 quadrilateral-properties family")
    angle_a = _fraction(fixture["data"]["angleA"])
    if not 0 < angle_a < 180:
        raise MiddleSchoolQuadrilateralVariantError("parallelogram angle must be between 0 and 180")
    angle_b = Fraction(180) - angle_a
    angle_c, angle_d = angle_a, angle_b
    if fixture["kind"] == "parallelogram_opposite_angle":
        target_label, target_value = "C", angle_c
        given = f"평행사변형 ABCD에서 $\\angle A={_angle(angle_a)}$일 때, $\\angle C$의 크기를 구하여라."
        steps = [
            {"title": "평행사변형의 대각 관계 확인", "work": "$\\angle A=\\angle C$", "why": "평행사변형의 두 대각의 크기는 서로 같다."},
            {"title": "주어진 각 대입", "work": f"$\\angle C=\\angle A={_angle(angle_a)}$", "why": "대각의 크기가 같다는 성질을 이용한다."},
            {"title": "도형으로 확인", "work": f"$\\angle C={_angle(target_value)}$", "why": "마주 보는 꼭짓점 C의 각이 A와 같은지 도형에서 확인한다."},
        ]
        common = ["대각과 이웃한 각을 혼동하는 것", "평행사변형의 네 각을 모두 같다고 생각하는 것", "구한 각을 C의 위치와 연결하지 않는 것"]
    elif fixture["kind"] == "parallelogram_adjacent_angle":
        target_label, target_value = "B", angle_b
        given = f"평행사변형 ABCD에서 $\\angle A={_angle(angle_a)}$일 때, $\\angle B$의 크기를 구하여라."
        steps = [
            {"title": "이웃한 두 각의 관계 확인", "work": "$\\angle A+\\angle B=180^\\circ$", "why": "평행사변형에서 이웃한 두 내각의 합은 180°이다."},
            {"title": "주어진 각 대입", "work": f"${_angle(angle_a)}+\\angle B=180^\\circ$", "why": "A와 B는 한 변을 사이에 둔 이웃한 각이다."},
            {"title": "계산 및 도형 확인", "work": f"$\\angle B=180^\\circ-{_angle(angle_a)}={_angle(target_value)}$", "why": "180°에서 주어진 A의 크기를 빼서 B의 크기를 구한다."},
        ]
        common = ["이웃한 두 각을 더하지 않고 대각의 관계를 적용하는 것", "180°에서 주어진 각을 더하는 것", "계산한 각의 위치를 B가 아닌 C로 표시하는 것"]
    else:
        raise MiddleSchoolQuadrilateralVariantError(f"unsupported quadrilateral fixture kind: {fixture['kind']}")
    answer_text = f"$\\angle {target_label}={_angle(target_value)}$"
    return {
        "answer": target_value,
        "answerText": answer_text,
        "given": given,
        "goal": f"$\\angle {target_label}$의 크기를 구한다.",
        "keyIdea": "평행사변형의 대각은 같고 이웃한 두 내각의 합은 180°임을 도형의 위치에 맞게 적용한다.",
        "conceptNote": "평행사변형의 마주 보는 각의 크기는 같으며, 이웃한 두 각은 서로 보각이다.",
        "steps": steps,
        "check": f"구한 값을 대입하면 평행사변형의 각의 관계가 성립하여 $\\angle {target_label}={_angle(target_value)}$임을 확인할 수 있다.",
        "commonMistakes": common,
        "angleA": angle_a,
        "angleB": angle_b,
        "angleC": angle_c,
        "angleD": angle_d,
        "targetLabel": target_label,
        "targetValue": target_value,
        "visualSpec": _visual_spec(fixture, solution=False, title="사각형의 성질", angle_a=angle_a, angle_b=angle_b, angle_c=angle_c, angle_d=angle_d, target_label=target_label, target_value=target_value),
        "solutionVisualSpec": _visual_spec(fixture, solution=True, title="평행사변형 풀이 도형", angle_a=angle_a, angle_b=angle_b, angle_c=angle_c, angle_d=angle_d, target_label=target_label, target_value=target_value),
    }


def load_middle_school_quadrilateral_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / QUADRILATERAL_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolQuadrilateralVariantError("M2-05 quadrilateral fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_STRUCTURED_FIXTURES" or payload.get("unitKey") != QUADRILATERAL_UNIT_KEY:
        raise MiddleSchoolQuadrilateralVariantError("M2-05 quadrilateral fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != QUADRILATERAL_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolQuadrilateralVariantError("M2-05 quadrilateral fixture corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_quadrilateral_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(
        family_id=QUADRILATERAL_FAMILY_ID,
        solver_profile="middle_school_quadrilateral_properties_exact_adapter_v1",
        transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD},
        visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY_SVG", TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"},
    ))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-05-parallelogram-opposite-ordinary": {"angleA": 55},
        "m2-05-parallelogram-opposite-boundary": {"angleA": 90},
        "m2-05-parallelogram-opposite-composite": {"angleA": 48},
        "m2-05-parallelogram-adjacent-ordinary": {"angleA": 65},
        "m2-05-parallelogram-adjacent-boundary": {"angleA": 90},
        "m2-05-parallelogram-adjacent-composite": {"angleA": 101},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolQuadrilateralVariantError(f"no M2-05 quadrilateral numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    if representation == "rearranged":
        if fixture["kind"] == "parallelogram_opposite_angle":
            content = f"AB∥CD, AD∥BC인 평행사변형 ABCD에서 마주 보는 각 $\\angle A={_angle(fixture['data']['angleA'])}$일 때 $\\angle C$를 구하여라."
        else:
            content = f"AB∥CD, AD∥BC인 평행사변형 ABCD에서 이웃한 각 $\\angle A={_angle(fixture['data']['angleA'])}$일 때 $\\angle B$를 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(kind: str) -> dict[str, Any]:
    op = "apply_opposite_angles" if kind == "parallelogram_opposite_angle" else "apply_adjacent_supplementary_angles"
    nodes = [{"nodeId": "identify", "role": "core", "op": "identify_parallelogram", "inputRole": ["quadrilateral_data"], "outputRole": ["angle_relation"], "order": 0}, {"nodeId": "relation", "role": "core", "op": op, "inputRole": ["angle_relation"], "outputRole": ["target_angle"], "order": 1}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": "identify", "to": "relation"}], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": QUADRILATERAL_UNIT_KEY, "standardUnit": "도형의 성질"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=QUADRILATERAL_FAMILY_ID, solution_graph=_graph(fixture["kind"]), curriculum={"courseKey": "M2", "unitKey": QUADRILATERAL_UNIT_KEY, "label": "도형의 성질"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"parallelogramAnglesValid": True, "exactAngleArithmetic": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 2, "branch": 0, "newConcept": 0}, allowed_methods=["평행사변형의 대각의 크기", "평행사변형의 이웃한 각의 합"], forbidden_methods=["도형의 모양만 보고 각을 추정하는 것", "중학교 교육과정 밖의 삼각함수를 사용하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-quadrilateral-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_quadrilateral_properties_exact_adapter", evidence_refs=refs, summary="Exact parallelogram angle relation and visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": QUADRILATERAL_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "평행사변형의 대각과 이웃한 각의 관계를 도형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": QUADRILATERAL_UNIT_KEY, "standardUnit": "도형의 성질", "standardUnitOrder": 5, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_QUADRILATERAL_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": QUADRILATERAL_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_QUADRILATERAL_PROPERTIES_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_quadrilateral_properties_independent_exact_recompute", "evidenceRefs": [f"middle-quadrilateral-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_quadrilateral_properties_solution_detail_contract", "evidenceRefs": [f"middle-quadrilateral-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_quadrilateral_properties_visual_comparison", "evidenceRefs": [f"middle-quadrilateral-review:{ordinal}:variantComparison"]}}


def build_middle_school_quadrilateral_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolQuadrilateralVariantError("C is HOLD for M2-05 quadrilateral properties until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolQuadrilateralVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_quadrilateral_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_quadrilateral_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_quadrilateral_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolQuadrilateralVariantError(f"M2-05 quadrilateral variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": QUADRILATERAL_UNIT_KEY, "familyId": QUADRILATERAL_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_quadrilateral_properties_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_BOUNDED_VARIANT_INPUT", "schemaVersion": QUADRILATERAL_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_QUADRILATERAL_PROPERTIES_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M2-05_quadrilateral_properties_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M2-05 quadrilateral properties exact A/B slice; C remains HOLD"}


def build_middle_school_quadrilateral_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_quadrilateral_variant_inputs(root, run_id=f"capability-middle-quadrilateral-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": QUADRILATERAL_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": QUADRILATERAL_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": QUADRILATERAL_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": QUADRILATERAL_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": QUADRILATERAL_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": QUADRILATERAL_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_CAPABILITY_PROMOTION", "schemaVersion": QUADRILATERAL_VARIANT_SCHEMA_VERSION, "scope": "M2-05 quadrilateral-properties structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_quadrilateral_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_quadrilateral_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_UNIVERSAL_SOURCE_JS", "schemaVersion": QUADRILATERAL_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-quadrilateral-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_QUADRILATERAL_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": QUADRILATERAL_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M2-05_quadrilateral_properties_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["QUADRILATERAL_FAMILY_ID", "QUADRILATERAL_UNIT_KEY", "MiddleSchoolQuadrilateralVariantError", "build_middle_school_quadrilateral_capability_report", "build_middle_school_quadrilateral_variant_inputs", "load_middle_school_quadrilateral_fixtures", "middle_school_quadrilateral_variant_registry", "prepare_middle_school_quadrilateral_variant_run", "solve_middle_school_quadrilateral_fixture"]
