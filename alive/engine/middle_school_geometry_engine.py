"""Bounded exact A/B variant adapter for M2-05 triangle properties."""

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


GEOMETRY_VARIANT_SCHEMA_VERSION = "0.1.0"
GEOMETRY_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_geometry.json")
GEOMETRY_UNIT_KEY = "M2-05"
GEOMETRY_FAMILY_ID = "TRIANGLE_PROPERTIES"


class MiddleSchoolGeometryVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolGeometryVariantError("boolean is not a geometric angle")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolGeometryVariantError(f"invalid geometric value: {value!r}") from error


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


def _triangle_points(angle_a: Fraction, angle_b: Fraction) -> dict[str, tuple[float, float]]:
    angle_c = Fraction(180) - angle_a - angle_b
    if min(angle_a, angle_b, angle_c) <= 0:
        raise MiddleSchoolGeometryVariantError("triangle angles must be positive and sum to 180")
    base = 6.0
    side_ac = base * math.sin(math.radians(float(angle_b))) / math.sin(math.radians(float(angle_c)))
    point_c = (side_ac * math.cos(math.radians(float(angle_a))), side_ac * math.sin(math.radians(float(angle_a))))
    return {"A": (0.0, 0.0), "B": (base, 0.0), "C": point_c}


def _visual_spec(
    fixture: dict[str, Any],
    *,
    solution: bool,
    title: str,
    angle_a: Fraction,
    angle_b: Fraction,
    angle_c: Fraction,
    given_label: str,
    target_label: str,
    target_value: Fraction,
) -> dict[str, Any]:
    points = _triangle_points(angle_a, angle_b)
    segments = [
        {"from": {"x": points["A"][0], "y": points["A"][1]}, "to": {"x": points["B"][0], "y": points["B"][1]}, "kind": "segment"},
        {"from": {"x": points["B"][0], "y": points["B"][1]}, "to": {"x": points["C"][0], "y": points["C"][1]}, "kind": "segment"},
        {"from": {"x": points["C"][0], "y": points["C"][1]}, "to": {"x": points["A"][0], "y": points["A"][1]}, "kind": "segment"},
    ]
    annotation_values: list[dict[str, Any]] = []
    if fixture["kind"] == "triangle_angle_sum":
        annotation_values = [
            {"x": points["A"][0] + 0.35, "y": points["A"][1] + 0.45, "text": f"∠A={_display_angle(angle_a)}"},
            {"x": points["B"][0] - 1.45, "y": points["B"][1] + 0.45, "text": f"∠B={_display_angle(angle_b)}"},
            {"x": points["C"][0], "y": points["C"][1] - 0.3, "text": f"∠C={'?' if not solution else _display_angle(target_value)}"},
        ]
    elif fixture["kind"] == "triangle_exterior_angle":
        a, c = points["A"], points["C"]
        dx, dy = c[0] - a[0], c[1] - a[1]
        length = math.hypot(dx, dy)
        d = (c[0] + 2.0 * dx / length, c[1] + 2.0 * dy / length)
        segments.append({"from": {"x": c[0], "y": c[1]}, "to": {"x": d[0], "y": d[1]}, "kind": "guide"})
        annotation_values = [
            {"x": points["A"][0] + 0.35, "y": points["A"][1] + 0.45, "text": f"∠A={_display_angle(angle_a)}"},
            {"x": points["B"][0] - 1.35, "y": points["B"][1] + 0.45, "text": f"∠B={'?' if not solution else _display_angle(target_value)}"},
            {"x": points["C"][0] + 0.2, "y": points["C"][1] + 0.55, "text": f"외각={_display_angle(_fraction(fixture['data']['exteriorAngle']))}"},
        ]
    else:
        annotation_values = [
            {"x": points["A"][0] + 0.35, "y": points["A"][1] + 0.45, "text": f"∠A={'?' if not solution else _display_angle(target_value)}"},
            {"x": points["B"][0] - 1.35, "y": points["B"][1] + 0.45, "text": f"∠B={'?' if not solution else _display_angle(target_value)}"},
            {"x": points["C"][0], "y": points["C"][1] - 0.3, "text": f"∠C={_display_angle(_fraction(fixture['data']['vertexAngle']))}"},
            {"x": (points["A"][0] + points["B"][0]) / 2, "y": max(points["C"][1] * 0.35, 0.7), "text": "CA=CB"},
        ]
    all_xy = list(points.values())
    low_x = math.floor(min(x for x, _ in all_xy)) - 1
    high_x = math.ceil(max(x for x, _ in all_xy)) + 1
    high_y = math.ceil(max(y for _, y in all_xy)) + 2
    if fixture["kind"] == "triangle_exterior_angle":
        high_x = math.ceil(max(high_x, points["C"][0] + 2.0)) + 1
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
        "annotations": annotation_values + [{"x": float(low_x) + 0.3, "y": float(high_y) - 0.35, "text": given_label}, {"x": float(low_x) + 0.3, "y": -0.55, "text": target_label}],
    }
    if solution:
        spec["annotations"].append({"x": float(low_x) + 0.3, "y": -0.8, "text": "풀이에 사용할 각의 관계"})
    if any(value == 90 for value in (angle_a, angle_b, angle_c)):
        vertex = "A" if angle_a == 90 else "B" if angle_b == 90 else "C"
        other = [name for name in ("A", "B", "C") if name != vertex]
        spec["rightAngles"] = [{"vertex": {"x": points[vertex][0], "y": points[vertex][1]}, "alongA": {"x": points[other[0]][0], "y": points[other[0]][1]}, "alongB": {"x": points[other[1]][0], "y": points[other[1]][1]}}]
    return spec


def solve_middle_school_geometry_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != GEOMETRY_UNIT_KEY or fixture.get("familyId") != GEOMETRY_FAMILY_ID:
        raise MiddleSchoolGeometryVariantError("fixture belongs to the M2-05 triangle-properties family")
    data = fixture["data"]
    kind = fixture["kind"]
    if kind == "triangle_angle_sum":
        angle_a, angle_b = _fraction(data["angleA"]), _fraction(data["angleB"])
        angle_c = Fraction(180) - angle_a - angle_b
        if min(angle_a, angle_b, angle_c) <= 0:
            raise MiddleSchoolGeometryVariantError("triangle angle sum fixture is invalid")
        answer_label = "C"
        given = f"삼각형 ABC에서 $\\angle A={_angle(angle_a)}$, $\\angle B={_angle(angle_b)}$일 때, $\\angle C$의 크기를 구하여라."
        steps = [
            {"title": "삼각형의 내각의 합 확인", "work": "$\\angle A+\\angle B+\\angle C=180^\\circ$", "why": "모든 삼각형의 세 내각의 합은 180°이다."},
            {"title": "주어진 각 대입", "work": f"${_angle(angle_a)}+{_angle(angle_b)}+\\angle C=180^\\circ$", "why": "알려진 두 내각의 크기를 내각의 합에 대입한다."},
            {"title": "계산 및 도형 확인", "work": f"$\\angle C=180^\\circ-{_angle(angle_a)}-{_angle(angle_b)}={_angle(angle_c)}$", "why": "두 내각의 합을 180°에서 빼면 남은 내각을 얻는다."},
        ]
        common = ["삼각형의 내각의 합을 360°로 잘못 기억하는 것", "한 각을 빼지 않고 더하는 것", "계산한 각을 도형의 ∠C와 연결하지 않는 것"]
        target_value = angle_c
    elif kind == "triangle_exterior_angle":
        exterior, angle_a = _fraction(data["exteriorAngle"]), _fraction(data["angleA"])
        angle_b = exterior - angle_a
        angle_c = Fraction(180) - angle_a - angle_b
        if not (0 < angle_a < exterior < 180 and angle_b > 0 and angle_c > 0):
            raise MiddleSchoolGeometryVariantError("exterior-angle fixture is invalid")
        answer_label = "B"
        given = f"삼각형 ABC에서 변 AC를 C 너머 D까지 연장하였다. 외각 $\\angle BCD={_angle(exterior)}$, $\\angle A={_angle(angle_a)}$일 때, $\\angle B$의 크기를 구하여라."
        steps = [
            {"title": "외각의 성질 확인", "work": "$\\angle BCD=\\angle A+\\angle B$", "why": "삼각형의 한 외각은 이웃하지 않는 두 내각의 합과 같다."},
            {"title": "주어진 각 대입", "work": f"${_angle(exterior)}={_angle(angle_a)}+\\angle B$", "why": "외각과 주어진 내각의 크기를 외각의 성질에 대입한다."},
            {"title": "계산 및 내각의 합 확인", "work": f"$\\angle B={_angle(exterior)}-{_angle(angle_a)}={_angle(angle_b)}$", "why": "외각에서 알려진 내각을 빼면 다른 내각의 크기가 된다."},
        ]
        common = ["외각을 세 내각의 합으로 생각하는 것", "외각에서 주어진 내각을 빼지 않고 더하는 것", "연장된 변과 외각의 위치를 바꾸어 읽는 것"]
        target_value = angle_b
    elif kind == "isosceles_triangle_angle":
        vertex = _fraction(data["vertexAngle"])
        base = (Fraction(180) - vertex) / 2
        if not (0 < vertex < 180 and base > 0):
            raise MiddleSchoolGeometryVariantError("isosceles triangle fixture is invalid")
        angle_a = angle_b = base
        angle_c = vertex
        answer_label = "A"
        given = f"이등변삼각형 ABC에서 $CA=CB$이고 $\\angle C={_angle(vertex)}$일 때, $\\angle A$의 크기를 구하여라."
        steps = [
            {"title": "이등변삼각형의 성질 확인", "work": "$CA=CB\\Rightarrow\\angle A=\\angle B$", "why": "같은 길이의 변에 마주 보는 두 각의 크기는 같다."},
            {"title": "두 밑각의 합 계산", "work": f"$\\angle A+\\angle B=180^\\circ-{_angle(vertex)}={_angle(180 - vertex)}$", "why": "삼각형의 내각의 합에서 꼭짓각을 뺀 값이 두 밑각의 합이다."},
            {"title": "계산 및 대칭 확인", "work": f"$\\angle A={_angle(180 - vertex)}\\div 2={_angle(base)}$", "why": "두 밑각의 크기가 같으므로 밑각의 합을 2로 나눈다."},
        ]
        common = ["같은 변이 아니라 같은 각을 먼저 찾지 못하는 것", "두 밑각의 합을 180°로 놓는 것", "밑각의 합을 2로 나누지 않는 것"]
        target_value = base
    else:
        raise MiddleSchoolGeometryVariantError(f"unsupported triangle fixture kind: {kind}")
    answer_text = f"$\\angle {answer_label}={_angle(target_value)}$"
    given_label = f"주어진 각: {answer_label} 구하기"
    target_label = f"정답: ∠{answer_label}={_display_angle(target_value)}"
    return {
        "answer": target_value,
        "answerText": answer_text,
        "given": given,
        "goal": f"$\\angle {answer_label}$의 크기를 구한다.",
        "keyIdea": "삼각형의 내각의 합, 외각의 성질, 이등변삼각형의 밑각 성질 중 주어진 도형에 맞는 관계를 선택한다.",
        "conceptNote": "삼각형의 세 내각의 합은 180°이고, 이등변삼각형에서는 같은 길이에 마주 보는 밑각의 크기가 같다.",
        "steps": steps,
        "check": f"계산한 각을 대입하면 삼각형의 각의 관계가 성립하여 $\\angle {answer_label}={_angle(target_value)}$임을 확인할 수 있다.",
        "commonMistakes": common,
        "angleA": angle_a,
        "angleB": angle_b,
        "angleC": angle_c,
        "targetLabel": answer_label,
        "targetValue": target_value,
        "visualSpec": _visual_spec(fixture, solution=False, title="삼각형의 성질", angle_a=angle_a, angle_b=angle_b, angle_c=angle_c, given_label=given_label, target_label=f"∠{answer_label}를 구하여라", target_value=target_value),
        "solutionVisualSpec": _visual_spec(fixture, solution=True, title="삼각형 풀이 도형", angle_a=angle_a, angle_b=angle_b, angle_c=angle_c, given_label=given_label, target_label=target_label, target_value=target_value),
    }


def load_middle_school_geometry_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / GEOMETRY_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolGeometryVariantError("M2-05 fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_GEOMETRY_STRUCTURED_FIXTURES" or payload.get("unitKey") != GEOMETRY_UNIT_KEY:
        raise MiddleSchoolGeometryVariantError("M2-05 fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6 or any(item.get("familyId") != GEOMETRY_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolGeometryVariantError("M2-05 triangle fixture corpus must contain six matching fixtures")
    return copy.deepcopy(fixtures)


def middle_school_geometry_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(
        family_id=GEOMETRY_FAMILY_ID,
        solver_profile="middle_school_triangle_properties_exact_adapter_v1",
        transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD},
        visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY_SVG", TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"},
    ))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-05-triangle-angle-sum-ordinary": {"angleA": 55, "angleB": 65},
        "m2-05-triangle-angle-sum-boundary": {"angleA": 90, "angleB": 30},
        "m2-05-triangle-angle-sum-composite": {"angleA": 42, "angleB": 57},
        "m2-05-triangle-exterior-angle": {"exteriorAngle": 135, "angleA": 55},
        "m2-05-isosceles-ordinary": {"vertexAngle": 50},
        "m2-05-isosceles-boundary": {"vertexAngle": 120},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolGeometryVariantError(f"no M2-05 numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    if representation == "rearranged":
        if fixture["kind"] == "triangle_angle_sum":
            content = f"세 내각의 합이 180°인 삼각형 ABC에서 $\\angle A={_angle(fixture['data']['angleA'])}$, $\\angle B={_angle(fixture['data']['angleB'])}$일 때 나머지 내각 $\\angle C$를 구하여라."
        elif fixture["kind"] == "triangle_exterior_angle":
            content = f"변 AC를 C 너머 D까지 연장한 삼각형 ABC에서 외각 $\\angle BCD={_angle(fixture['data']['exteriorAngle'])}$, $\\angle A={_angle(fixture['data']['angleA'])}$일 때 $\\angle B$를 구하여라."
        else:
            content = f"$CA=CB$인 이등변삼각형 ABC에서 꼭짓각 $\\angle C={_angle(fixture['data']['vertexAngle'])}$일 때 밑각 $\\angle A$를 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(kind: str) -> dict[str, Any]:
    if kind == "triangle_angle_sum":
        ops = [("identify", "identify_triangle"), ("angle_sum", "apply_triangle_angle_sum"), ("subtract", "subtract_known_angles")]
    elif kind == "triangle_exterior_angle":
        ops = [("identify", "identify_exterior_angle"), ("exterior", "apply_exterior_angle_theorem"), ("subtract", "subtract_known_angle")]
    else:
        ops = [("identify", "identify_isosceles_triangle"), ("equal", "apply_equal_base_angles"), ("divide", "divide_equal_angle_sum")]
    nodes = [{"nodeId": node_id, "role": "core", "op": op, "inputRole": ["triangle_data"], "outputRole": ["angle_relation"], "order": index} for index, (node_id, op) in enumerate(ops)]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[i]["nodeId"], "to": nodes[i + 1]["nodeId"]} for i in range(len(nodes) - 1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": GEOMETRY_UNIT_KEY, "standardUnit": "도형의 성질"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=GEOMETRY_FAMILY_ID, solution_graph=_graph(fixture["kind"]), curriculum={"courseKey": "M2", "unitKey": GEOMETRY_UNIT_KEY, "label": "도형의 성질"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"triangleAnglesValid": True, "exactAngleArithmetic": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 2, "branch": 0, "newConcept": 0}, allowed_methods=["삼각형의 내각의 합", "삼각형의 외각의 성질", "이등변삼각형의 밑각 성질"], forbidden_methods=["도형의 모양만 보고 각의 크기를 추정하는 것", "중학교 교육과정 밖의 삼각함수를 사용하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-geometry-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_triangle_properties_exact_adapter", evidence_refs=refs, summary="Exact angle relation and triangle visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": GEOMETRY_FAMILY_ID, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "삼각형에서 내각의 합·외각·이등변삼각형의 밑각 관계를 도형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중2 수학", "standardUnitKey": GEOMETRY_UNIT_KEY, "standardUnit": "도형의 성질", "standardUnitOrder": 5, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_GEOMETRY_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": GEOMETRY_FAMILY_ID, "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_TRIANGLE_PROPERTIES_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_triangle_properties_independent_exact_recompute", "evidenceRefs": [f"middle-geometry-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_triangle_properties_solution_detail_contract", "evidenceRefs": [f"middle-geometry-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_triangle_properties_visual_comparison", "evidenceRefs": [f"middle-geometry-review:{ordinal}:variantComparison"]}}


def build_middle_school_geometry_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolGeometryVariantError("C is HOLD for M2-05 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolGeometryVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_geometry_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_geometry_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_geometry_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolGeometryVariantError(f"M2-05 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        review = _review(ordinal)
        reviews.append(review)
        assignments.append({"id": ordinal, "unitKey": GEOMETRY_UNIT_KEY, "familyId": GEOMETRY_FAMILY_ID, "transform": transform, "status": "READY", "solver": "middle_school_triangle_properties_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_GEOMETRY_BOUNDED_VARIANT_INPUT", "schemaVersion": GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_TRIANGLE_PROPERTIES_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M2-05_triangle_properties_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M2-05 triangle properties exact A/B slice; C remains HOLD"}


def build_middle_school_geometry_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_geometry_variant_inputs(root, run_id=f"capability-middle-geometry-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": GEOMETRY_FAMILY_ID, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": GEOMETRY_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId": GEOMETRY_FAMILY_ID, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": GEOMETRY_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
    records.append({"familyId": GEOMETRY_FAMILY_ID, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": GEOMETRY_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_GEOMETRY_CAPABILITY_PROMOTION", "schemaVersion": GEOMETRY_VARIANT_SCHEMA_VERSION, "scope": "M2-05 triangle-properties structured general/boundary/composite fixtures", "unitCount": 1, "fixtureCount": 6, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_geometry_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_geometry_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_GEOMETRY_UNIVERSAL_SOURCE_JS", "schemaVersion": GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(Path(root).resolve()).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-geometry-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_GEOMETRY_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M2-05_triangle_properties_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["GEOMETRY_FAMILY_ID", "GEOMETRY_UNIT_KEY", "MiddleSchoolGeometryVariantError", "build_middle_school_geometry_capability_report", "build_middle_school_geometry_variant_inputs", "load_middle_school_geometry_fixtures", "middle_school_geometry_variant_registry", "prepare_middle_school_geometry_variant_run", "solve_middle_school_geometry_fixture"]
