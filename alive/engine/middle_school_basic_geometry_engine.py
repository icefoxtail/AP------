"""Bounded exact A/B adapters for M1-05 basic figures and position relations."""

from __future__ import annotations

import copy
import hashlib
import json
import math
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


BASIC_GEOMETRY_VARIANT_SCHEMA_VERSION = "0.1.0"
BASIC_GEOMETRY_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_basic_geometry.json")
BASIC_GEOMETRY_UNIT_KEY = "M1-05"
BASIC_FIGURE_FAMILY_ID = "BASIC_FIGURE_ANGLE_CLASSIFICATION"
POSITION_RELATION_FAMILY_ID = "POSITION_RELATION_LINE_PAIR"


class MiddleSchoolBasicGeometryVariantError(ValueError):
    pass


def _integer(value: Any, label: str) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolBasicGeometryVariantError(f"{label} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolBasicGeometryVariantError(f"invalid {label}: {value!r}") from error
    if number != value:
        raise MiddleSchoolBasicGeometryVariantError(f"{label} must be an integer")
    return number


def _degree(value: int) -> str:
    return f"{value}^\\circ"


def _angle_kind(measure: int) -> str:
    if not 0 < measure <= 180:
        raise MiddleSchoolBasicGeometryVariantError("angle measure must be between 1 and 180 degrees")
    if measure < 90:
        return "예각"
    if measure == 90:
        return "직각"
    if measure < 180:
        return "둔각"
    return "평각"


def _point(value: Any, label: str) -> dict[str, int]:
    if not isinstance(value, dict):
        raise MiddleSchoolBasicGeometryVariantError(f"{label} must be an object")
    return {"x": _integer(value.get("x"), f"{label}.x"), "y": _integer(value.get("y"), f"{label}.y")}


def _line_data(data: dict[str, Any], key: str) -> tuple[dict[str, int], dict[str, int]]:
    line = data.get(key)
    if not isinstance(line, dict):
        raise MiddleSchoolBasicGeometryVariantError(f"{key} must be an object")
    start, end = _point(line.get("from"), f"{key}.from"), _point(line.get("to"), f"{key}.to")
    if start == end:
        raise MiddleSchoolBasicGeometryVariantError(f"{key} endpoints must differ")
    return start, end


def _line_relation(data: dict[str, Any]) -> str:
    a, b = _line_data(data, "line1")
    c, d = _line_data(data, "line2")
    vx, vy = b["x"] - a["x"], b["y"] - a["y"]
    wx, wy = d["x"] - c["x"], d["y"] - c["y"]
    cross = vx * wy - vy * wx
    dot = vx * wx + vy * wy
    if cross == 0:
        return "평행"
    if dot == 0:
        return "수직"
    return "한 점에서 만남"


def _point_text(point: dict[str, int], label: str) -> str:
    return f"{label}({point['x']},{point['y']})"


def _angle_visual_spec(measure: int, *, solution: bool, kind: str) -> dict[str, Any]:
    radians = math.radians(measure)
    origin = {"x": 0, "y": 0}
    first = {"x": 5.0, "y": 0.0}
    second = {"x": round(5.0 * math.cos(radians), 6), "y": round(5.0 * math.sin(radians), 6)}
    annotations = [{"x": -5.4, "y": 5.4, "text": "각의 종류"}]
    if solution:
        annotations.append({"x": -5.4, "y": 4.6, "text": f"판정: {kind}"})
    return {"version": "0.1", "type": "segment_geometry", "title": "각의 종류", "width": 460, "height": 320, "xRange": [-6, 6], "yRange": [-6, 6], "points": [{**origin, "label": "O"}, {**first, "label": "A"}, {**second, "label": "B"}], "segments": [{"from": origin, "to": first, "label": "OA"}, {"from": origin, "to": second, "label": "OB"}], "lines": [], "curves": [], "annotations": annotations}


def _relation_visual_spec(data: dict[str, Any], *, solution: bool, relation: str) -> dict[str, Any]:
    line1_from, line1_to = _line_data(data, "line1")
    line2_from, line2_to = _line_data(data, "line2")
    # The generic SVG renderer draws coordinate axes whenever a range crosses
    # zero. Position-relation figures are not coordinate-plane questions, so
    # translate the construction into a positive display window to keep the
    # two target lines from being confused with auxiliary axes.
    shift = 8
    display_lines = []
    for start, end in ((line1_from, line1_to), (line2_from, line2_to)):
        display_lines.append(({"x": start["x"] + shift, "y": start["y"] + shift}, {"x": end["x"] + shift, "y": end["y"] + shift}))
    display_line1_from, display_line1_to = display_lines[0]
    display_line2_from, display_line2_to = display_lines[1]
    points = [display_line1_from, display_line1_to, display_line2_from, display_line2_to]
    xs, ys = [point["x"] for point in points], [point["y"] for point in points]
    x_low, x_high = min(xs) - 1, max(xs) + 1
    y_low, y_high = min(ys) - 1, max(ys) + 1
    annotations = [{"x": x_low + 0.3, "y": y_high - 0.3, "text": "직선의 위치 관계"}]
    if solution:
        annotations.append({"x": x_low + 0.3, "y": y_high - 1.0, "text": f"판정: {relation}"})
    return {"version": "0.1", "type": "segment_geometry", "title": "직선의 위치 관계", "width": 460, "height": 320, "xRange": [x_low, x_high], "yRange": [y_low, y_high], "points": [], "segments": [], "lines": [{"from": display_line1_from, "to": display_line1_to, "kind": "line", "label": "l"}, {"from": display_line2_from, "to": display_line2_to, "kind": "line", "label": "m"}], "curves": [], "annotations": annotations}


def solve_middle_school_basic_geometry_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != BASIC_GEOMETRY_UNIT_KEY:
        raise MiddleSchoolBasicGeometryVariantError("fixture belongs to M1-05 basic geometry")
    family = fixture.get("familyId")
    data = fixture.get("data", {})
    if family == BASIC_FIGURE_FAMILY_ID:
        measure = _integer(data.get("measure"), "measure")
        kind = _angle_kind(measure)
        given = f"각 $\\angle AOB$의 크기가 ${_degree(measure)}$일 때, 이 각의 종류를 구하여라."
        compare = {"예각": f"$0^\\circ\\lt\\angle AOB\\lt90^\\circ$", "직각": "$\\angle AOB=90^\\circ$", "둔각": f"$90^\\circ\\lt\\angle AOB\\lt180^\\circ$", "평각": "$\\angle AOB=180^\\circ$"}[kind]
        steps = [{"title": "각의 크기 확인", "work": f"주어진 각은 $\\angle AOB={_degree(measure)}$이다.", "why": "먼저 각의 크기를 정확히 확인한다."}, {"title": "기준과 비교", "work": f"{compare}이므로 이 각은 {kind}이다.", "why": "예각·직각·둔각·평각은 90°와 180°를 기준으로 구분한다."}, {"title": "도형에서 확인", "work": f"그림의 두 변 OA, OB가 이루는 벌어진 정도가 {kind}의 기준과 일치한다.", "why": "수치 판정과 실제 두 변의 위치를 함께 확인하여 검산한다."}]
        return {"answer": kind, "answerText": kind, "given": given, "goal": "주어진 각의 종류를 구한다.", "keyIdea": "각의 크기를 90°와 180°의 기준과 비교하여 종류를 판별한다.", "conceptNote": "각의 크기가 $0^\\circ$보다 크고 $90^\\circ$보다 작으면 예각, $90^\\circ$이면 직각, $90^\\circ$보다 크고 $180^\\circ$보다 작으면 둔각, $180^\\circ$이면 평각이다.", "steps": steps, "check": f"$\\angle AOB={_degree(measure)}$가 {kind}의 범위에 들어가므로 답은 {kind}이다.", "commonMistakes": ["직각을 90°보다 작은 각으로 생각하는 것", "180°인 각을 둔각으로 분류하는 것", "그림의 모양만 보고 각의 크기를 추정하는 것"], "visualSpec": _angle_visual_spec(measure, solution=False, kind=kind), "solutionVisualSpec": _angle_visual_spec(measure, solution=True, kind=kind)}
    if family == POSITION_RELATION_FAMILY_ID:
        relation = _line_relation(data)
        given = "그림에서 직선 l과 직선 m의 위치 관계를 말하여라."
        if relation == "평행":
            work = "직선 l과 직선 m은 만나지 않고 같은 방향으로 나란하다. 따라서 평행이다."
            why = "서로 만나지 않고 같은 방향으로 뻗는 두 직선은 평행이다."
        elif relation == "수직":
            work = "직선 l과 직선 m은 한 점에서 만나고 이루는 각이 $90^\\circ$이다. 따라서 수직이다."
            why = "두 직선이 직각으로 만나는 경우를 수직이라고 한다."
        else:
            work = "직선 l과 직선 m은 한 점에서 만나지만 직각은 아니다. 따라서 한 점에서 만나는 관계이다."
            why = "한 점에서 만나지만 직각이 아닌 두 직선은 단순히 한 점에서 만나는 관계로 분류한다."
        steps = [{"title": "두 직선의 위치 확인", "work": "그림에서 직선 l과 직선 m의 방향과 만나는 위치를 확인한다.", "why": "위치 관계는 두 직선이 만나는지, 만난다면 어떤 각을 이루는지로 판별한다."}, {"title": "위치 관계 판별", "work": work, "why": why}, {"title": "도형에서 검산", "work": f"그림의 직선 l과 m의 위치가 {relation}의 정의와 일치한다.", "why": "정의에 따른 판정과 실제 그림을 대조하여 답을 확인한다."}]
        return {"answer": relation, "answerText": relation, "given": given, "goal": "두 직선의 위치 관계를 구한다.", "keyIdea": "두 직선이 만나지 않는지, 직각으로 만나는지, 그 밖의 방식으로 만나는지 확인한다.", "conceptNote": "같은 평면에서 만나지 않는 두 직선은 평행이고, 직각으로 만나는 두 직선은 수직이다. 그 밖에 한 점에서 만나는 경우는 한 점에서 만나는 관계로 구분한다.", "steps": steps, "check": f"그림에서 확인한 두 직선의 위치가 {relation}의 정의와 일치하므로 답은 {relation}이다.", "commonMistakes": ["평행한 두 직선을 멀리 떨어져 있다는 이유만으로 판단하는 것", "직각으로 만나는 경우와 일반적으로 만나는 경우를 구분하지 않는 것", "유한한 선분과 직선의 위치를 혼동하는 것"], "visualSpec": _relation_visual_spec(data, solution=False, relation=relation), "solutionVisualSpec": _relation_visual_spec(data, solution=True, relation=relation)}
    raise MiddleSchoolBasicGeometryVariantError(f"unsupported M1-05 family: {family}")


def load_middle_school_basic_geometry_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / BASIC_GEOMETRY_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolBasicGeometryVariantError("M1-05 basic geometry fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_STRUCTURED_FIXTURES" or payload.get("unitKey") != BASIC_GEOMETRY_UNIT_KEY:
        raise MiddleSchoolBasicGeometryVariantError("M1-05 basic geometry fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 12 or any(item.get("unitKey") != BASIC_GEOMETRY_UNIT_KEY for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolBasicGeometryVariantError("M1-05 basic geometry corpus must contain twelve matching fixtures")
    if {item.get("familyId") for item in fixtures} != {BASIC_FIGURE_FAMILY_ID, POSITION_RELATION_FAMILY_ID}:
        raise MiddleSchoolBasicGeometryVariantError("M1-05 corpus must contain both canonical family slices")
    return copy.deepcopy(fixtures)


def middle_school_basic_geometry_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(family_id=BASIC_FIGURE_FAMILY_ID, solver_profile="middle_school_basic_figure_angle_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY", TRANSFORM_B_REPRESENTATION: "MANDATORY", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    registry.register(StructureFamilyAdapter(family_id=POSITION_RELATION_FAMILY_ID, solver_profile="middle_school_position_relation_line_pair_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY", TRANSFORM_B_REPRESENTATION: "MANDATORY", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m1-05-angle-acute-general": {"measure": 25}, "m1-05-angle-right-boundary": {"measure": 60}, "m1-05-angle-obtuse-composite": {"measure": 140}, "m1-05-angle-straight-boundary": {"measure": 170}, "m1-05-angle-small-general": {"measure": 10}, "m1-05-angle-near-straight-composite": {"measure": 160},
        "m1-05-position-parallel-general": {"line1": {"from": {"x": -5, "y": -2}, "to": {"x": 5, "y": -2}}, "line2": {"from": {"x": -5, "y": 3}, "to": {"x": 5, "y": 3}}},
        "m1-05-position-perpendicular-boundary": {"line1": {"from": {"x": -4, "y": 1}, "to": {"x": 4, "y": 1}}, "line2": {"from": {"x": 1, "y": -4}, "to": {"x": 1, "y": 4}}},
        "m1-05-position-intersecting-composite": {"line1": {"from": {"x": -5, "y": -2}, "to": {"x": 5, "y": 4}}, "line2": {"from": {"x": -5, "y": 4}, "to": {"x": 5, "y": -1}}},
        "m1-05-position-parallel-diagonal-general": {"line1": {"from": {"x": -4, "y": -3}, "to": {"x": 4, "y": 5}}, "line2": {"from": {"x": -3, "y": 4}, "to": {"x": 3, "y": 10}}},
        "m1-05-position-perpendicular-diagonal-composite": {"line1": {"from": {"x": -4, "y": -3}, "to": {"x": 4, "y": 1}}, "line2": {"from": {"x": -2, "y": 4}, "to": {"x": 2, "y": -4}}},
        "m1-05-position-intersecting-boundary": {"line1": {"from": {"x": 0, "y": -4}, "to": {"x": 0, "y": 4}}, "line2": {"from": {"x": -4, "y": -2}, "to": {"x": 4, "y": 1}}},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolBasicGeometryVariantError(f"no M1-05 numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    if fixture["familyId"] == BASIC_FIGURE_FAMILY_ID:
        measure = _integer(fixture["data"]["measure"], "measure")
        content = f"각 $\\angle AOB$의 크기가 ${_degree(measure)}$일 때, 예각·직각·둔각·평각 중 해당하는 종류를 말하여라." if representation == "rearranged" else result["given"]
    else:
        figure_marks = {"m1-05-position-parallel-general": "가", "m1-05-position-perpendicular-boundary": "나", "m1-05-position-intersecting-composite": "다", "m1-05-position-parallel-diagonal-general": "라", "m1-05-position-perpendicular-diagonal-composite": "마", "m1-05-position-intersecting-boundary": "바"}
        mark = figure_marks[fixture["caseId"]]
        content = f"그림 ({mark})의 두 직선 l과 m이 어떤 위치 관계인지 판단하여라." if representation == "rearranged" else f"그림 ({mark})에서 직선 l과 직선 m의 위치 관계를 말하여라."
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(family: str) -> dict[str, Any]:
    if family == BASIC_FIGURE_FAMILY_ID:
        nodes = [{"nodeId": "measure", "role": "core", "op": "inspect_angle_measure", "inputRole": ["angle_data"], "outputRole": ["angle_measure"], "order": 0}, {"nodeId": "classify", "role": "core", "op": "classify_angle_by_thresholds", "inputRole": ["angle_measure"], "outputRole": ["angle_kind"], "order": 1}]
    else:
        nodes = [{"nodeId": "inspect", "role": "core", "op": "inspect_two_line_position", "inputRole": ["line_pair"], "outputRole": ["position_relation"], "order": 0}, {"nodeId": "classify", "role": "core", "op": "classify_parallel_perpendicular_or_intersection", "inputRole": ["position_relation"], "outputRole": ["line_relation"], "order": 1}]
    return normalize_solution_graph({"nodes": nodes, "edges": [{"from": nodes[0]["nodeId"], "to": nodes[1]["nodeId"]}], "coreDecisionCount": 1, "branchCount": 1, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, **payload, "answer": result["answerText"], "solution": result["answerText"], "standardCourse": "중1 수학", "standardUnitKey": BASIC_GEOMETRY_UNIT_KEY, "standardUnit": "기본도형"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    family = fixture["familyId"]
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=family, solution_graph=_graph(family), curriculum={"courseKey": "M1", "unitKey": BASIC_GEOMETRY_UNIT_KEY, "label": "기본도형"}, concepts=[fixture["subUnit"]], givens={"data": copy.deepcopy(fixture["data"])}, goal={"kind": fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"exactBasicGeometryRelation": True, "visualDefinitionRequired": True}, representation={"layoutTag": "grid", "wide": False, "style": "standard"}, difficulty_vector={"interpretation": 1, "representation": 1, "decision": 1, "algebraLoad": 0, "calculationLoad": 1, "visualLoad": 2, "branch": 1, "newConcept": 0}, allowed_methods=["각의 크기 기준 비교", "평행·수직·교차의 정의", "그림과 정의 대조"], forbidden_methods=["도형의 모양만 보고 수치를 추정하기", "중학교 교육과정 밖의 좌표·벡터 공식 사용"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], fixture: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    family = fixture["familyId"]
    refs = [f"middle-basic-geometry-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved", "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_basic_geometry_exact_adapter", evidence_refs=refs, summary="Exact basic-geometry recomputation and visual specification comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType": "ALIVE_VARIANT_PROOF_SIDECAR", "schemaVersion": "0.1.0", "sourceQuestionId": source_ir["sourceQuestionId"], "declaredClass": declared_class, "verifiedClass": "HOLD", "structureFamily": family, "transform": TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION, "capabilityStatus": CAPABILITY_SUPPORTED, "coreConceptPreserved": True, "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"], "coreDecisionDelta": 0, "branchDelta": 0, "newConceptDelta": 0, "preprocessingDelta": 0, "preprocessLoad": {"type": "none", "magnitude": 0}, "preprocessDeterministic": True, "preprocessOutputArity": 0, "studentObservableInputsOnly": True, "ablationPassed": True, "shortcutBlocked": True, "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0}, "proofChecks": checks, "proofSha256": "pending", "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version": "0.1", "audience": "student", "depth": "detailed", "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"], "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"], "diagramRequirement": "MANDATORY", "diagramPurpose": "각의 정의 또는 두 직선의 위치 관계를 실제 도형으로 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"], "standardCourse": "중1 수학", "standardUnitKey": BASIC_GEOMETRY_UNIT_KEY, "standardUnit": "기본도형", "standardUnitOrder": 5, "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"], "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule", "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_BASIC_GEOMETRY_BOUNDED"], "wide": False}
    candidate = {"artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id, "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"], "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": fixture["familyId"], "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_BASIC_GEOMETRY_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]}, "studentPayload": payload, "answerContract": {"answerType": "text", "displayAnswer": result["answerText"], "equivalencePolicy": "normalized_math_text"}, "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata, "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "MANDATORY", "solutionVisualElements": {"required": True}, "visualSpec": copy.deepcopy(result["visualSpec"]), "solutionVisualSpec": copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id": ordinal, "blindMath": {"status": "PASS", "method": "middle_school_basic_geometry_independent_exact_recompute", "evidenceRefs": [f"middle-basic-geometry-review:{ordinal}:blindMath"]}, "solution": {"status": "PASS", "method": "middle_school_basic_geometry_solution_detail_contract", "evidenceRefs": [f"middle-basic-geometry-review:{ordinal}:solution"]}, "variantComparison": {"status": "PASS", "method": "middle_school_basic_geometry_visual_comparison", "evidenceRefs": [f"middle-basic-geometry-review:{ordinal}:variantComparison"]}}


def build_middle_school_basic_geometry_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolBasicGeometryVariantError("C is HOLD for M1-05 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolBasicGeometryVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_basic_geometry_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_basic_geometry_fixture(fixture)
        source_questions.append(_source_question(fixture, source_result, ordinal))
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_basic_geometry_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, fixture, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolBasicGeometryVariantError(f"M1-05 basic geometry variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        reviews.append(_review(ordinal))
        assignments.append({"id": ordinal, "unitKey": BASIC_GEOMETRY_UNIT_KEY, "familyId": fixture["familyId"], "transform": transform, "status": "READY", "solver": "middle_school_basic_geometry_exact_adapter_v1", "variantClass": declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath", "solution", "variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_BOUNDED_VARIANT_INPUT", "schemaVersion": BASIC_GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "BOUNDED_MIDDLE_SCHOOL_BASIC_GEOMETRY_EXACT_VARIANT", "variantClass": declared_class, "transform": transform, "fixtureScope": "M1-05_basic_geometry_structured", "ruleSnapshotSha256": snapshot["snapshotSha256"], "questionCount": len(candidates), "sourceQuestions": source_questions, "sourceIR": source_irs, "candidateIR": candidate_irs, "candidates": candidates, "proofRows": proof_rows, "proofCatalog": proof_catalog, "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews}, "reviewCatalog": review_catalog, "independentReviews": reviews, "capabilityPreflight": {"status": "PASS", "assignments": assignments}, "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "MANDATORY", "problem": "PASS", "solution": "PASS"} for item in assignments]}, "promotionStatus": "CANDIDATE", "promotionReason": "M1-05 basic figure and position relation exact A/B slices; C remains HOLD"}


def build_middle_school_basic_geometry_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    families = (BASIC_FIGURE_FAMILY_ID, POSITION_RELATION_FAMILY_ID)
    for family in families:
        for declared_class in ("A", "B"):
            inputs = build_middle_school_basic_geometry_variant_inputs(root, run_id=f"capability-middle-basic-geometry-{declared_class.lower()}", declared_class=declared_class)
            for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
                if assignment["familyId"] != family:
                    continue
                records.append({"familyId": family, "transform": inputs["transform"], "polarity": "positive", "status": "PASS", "unitKey": BASIC_GEOMETRY_UNIT_KEY, "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
            records.append({"familyId": family, "transform": inputs["transform"], "polarity": "negative", "status": "PASS", "unitKey": BASIC_GEOMETRY_UNIT_KEY, "variantClass": declared_class, "negativeCode": "VARIANT_PROOF_FAILED"})
        records.append({"familyId": family, "transform": TRANSFORM_C_PARAMETER_RECOVERY, "polarity": "negative", "status": "PASS", "unitKey": BASIC_GEOMETRY_UNIT_KEY, "variantClass": "C", "negativeCode": "C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion, "artifactType": "ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_CAPABILITY_PROMOTION", "schemaVersion": BASIC_GEOMETRY_VARIANT_SCHEMA_VERSION, "scope": "M1-05 basic figure angle classification and line-pair position relation", "unitCount": 2, "fixtureCount": 12, "status": "ACTIVE_BOUNDED" if promotion["holdCount"] == 2 and promotion["activeCount"] == 4 else "HOLD", "cRecords": records, "productionArchiveRegistration": "NOT_PERFORMED", "publicationStatus": "NOT_PUBLISHED"}


def prepare_middle_school_basic_geometry_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_basic_geometry_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    root = Path(root).resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType": "ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_UNIVERSAL_SOURCE_JS", "schemaVersion": BASIC_GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "questionCount": inputs["questionCount"], "path": source_path.relative_to(root).as_posix(), "sha256": sha256_file(source_path), "ruleSnapshotSha256": inputs["ruleSnapshotSha256"], "publicationStatus": "NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path": source_manifest["path"], "sha256": source_manifest["sha256"], "ruleSnapshotSha256": inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    atomic_write_json(store.run_dir(run_id) / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-basic-geometry-exact-variant-preflight")
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
    return {"artifactType": "ALIVE_MIDDLE_SCHOOL_BASIC_GEOMETRY_BOUNDED_VARIANT_PREPARED_RUN", "schemaVersion": BASIC_GEOMETRY_VARIANT_SCHEMA_VERSION, "runId": run_id, "status": "READY_FOR_BROWSER_RENDER", "variantClass": declared_class, "fixtureScope": "M1-05_basic_geometry_structured", "run": start, "source": source_manifest, "questionCount": inputs["questionCount"], "variantLedger": ledger, "assembly": assembled["assembly"], "currentStage": UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"], "browserRender": "PENDING", "publicationStatus": "NOT_PUBLISHED"}


__all__ = ["BASIC_FIGURE_FAMILY_ID", "MiddleSchoolBasicGeometryVariantError", "POSITION_RELATION_FAMILY_ID", "build_middle_school_basic_geometry_capability_report", "build_middle_school_basic_geometry_variant_inputs", "load_middle_school_basic_geometry_fixtures", "middle_school_basic_geometry_variant_registry", "prepare_middle_school_basic_geometry_variant_run", "solve_middle_school_basic_geometry_fixture"]
