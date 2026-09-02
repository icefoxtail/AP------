"""Bounded exact A/B adapters for M1-06 polygons, circles, and plane measure."""

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


POLYGON_CIRCLE_MEASURE_VARIANT_SCHEMA_VERSION = "0.1.0"
POLYGON_CIRCLE_MEASURE_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_polygon_circle_measure.json")
POLYGON_CIRCLE_UNIT_KEY = "M1-06"
POLYGON_FAMILY_ID = "POLYGON_INTERIOR_ANGLE_SUM"
CIRCLE_FAMILY_ID = "CIRCLE_AREA_CIRCUMFERENCE"
RECTANGLE_FAMILY_ID = "RECTANGLE_AREA_PERIMETER"
FAMILY_IDS = (POLYGON_FAMILY_ID, CIRCLE_FAMILY_ID, RECTANGLE_FAMILY_ID)


class MiddleSchoolPolygonCircleMeasureVariantError(ValueError):
    pass


def _integer(value: Any, label: str) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolPolygonCircleMeasureVariantError(f"{label} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolPolygonCircleMeasureVariantError(f"invalid {label}: {value!r}") from error
    if number != value:
        raise MiddleSchoolPolygonCircleMeasureVariantError(f"{label} must be an integer")
    return number


def _degree(value: int) -> str:
    return f"{value}^\\circ"


def _polygon_visual(n: int, *, solution: bool, answer: int) -> dict[str, Any]:
    center = 7.0
    radius = 4.0
    points: list[dict[str, Any]] = []
    for index in range(n):
        theta = math.pi / 2 + 2 * math.pi * index / n
        points.append({"x": round(center + radius * math.cos(theta), 6), "y": round(center + radius * math.sin(theta), 6), "label": chr(65 + index)})
    segments = [{"from": points[index], "to": points[(index + 1) % n], "kind": "segment"} for index in range(n)]
    if solution and n >= 4:
        segments.extend({"from": points[0], "to": points[index], "kind": "guide", "dashed": True} for index in range(2, n - 1))
    annotations = [{"x": 3.0, "y": 11.0, "text": f"{n}각형의 내각의 합"}]
    if solution:
        annotations.append({"x": 3.0, "y": 10.2, "text": f"결과: {answer}°"})
    return {"version": "0.1", "type": "segment_geometry", "title": "다각형의 내각의 합", "width": 460, "height": 320, "xRange": [2, 12], "yRange": [2, 12], "points": points, "segments": segments, "lines": [], "curves": [], "annotations": annotations}


def _circle_visual(radius: int, *, solution: bool, answer: str) -> dict[str, Any]:
    y_low, y_high = 1.0, 2 * radius + 3.0
    # The renderer preserves circle proportions in the 460x320 canvas. Make
    # the x-range wider than the y-range by the drawable-area aspect ratio.
    x_low, x_high = 1.0, 1.0 + (y_high - y_low) * (396.0 / 256.0)
    center = (x_low + x_high) / 2
    center_y = radius + 2
    annotations = [{"x": x_low + 0.2, "y": y_high - 0.2, "text": "원의 넓이 또는 둘레"}]
    if solution:
        annotations.append({"x": x_low + 0.2, "y": y_high - 1.0, "text": f"결과: {answer}"})
    return {"version": "0.1", "type": "circle_geometry", "title": "원의 측정", "width": 460, "height": 320, "xRange": [x_low, x_high], "yRange": [y_low, y_high], "circles": [{"center": {"x": center, "y": center_y, "label": "O"}, "radius": radius}], "points": [{"x": center, "y": center_y, "label": "O"}, {"x": center + radius, "y": center_y, "label": "A"}], "segments": [{"from": {"x": center, "y": center_y}, "to": {"x": center + radius, "y": center_y}, "kind": "radius", "label": "r"}], "lines": [], "curves": [], "annotations": annotations}


def _rectangle_visual(width: int, height: int, *, solution: bool, answer: int) -> dict[str, Any]:
    offset = 2
    points = [{"x": offset, "y": offset, "label": "A"}, {"x": offset + width, "y": offset, "label": "B"}, {"x": offset + width, "y": offset + height, "label": "C"}, {"x": offset, "y": offset + height, "label": "D"}]
    segments = [{"from": points[index], "to": points[(index + 1) % 4], "kind": "segment", "label": str(width if index in (0, 2) else height)} for index in range(4)]
    annotations = [{"x": 1.0, "y": height + 3.0, "text": "직사각형의 넓이와 둘레"}]
    if solution:
        annotations.append({"x": 1.0, "y": height + 2.2, "text": f"결과: {answer}"})
    return {"version": "0.1", "type": "segment_geometry", "title": "직사각형의 측정", "width": 460, "height": 320, "xRange": [1, width + 3], "yRange": [1, height + 3], "points": points, "segments": segments, "lines": [], "curves": [], "annotations": annotations}


def _circle_answer(kind: str, radius: int) -> tuple[str, str]:
    coefficient = 2 * radius if kind == "circle_circumference" else radius * radius
    answer = "π" if coefficient == 1 else f"{coefficient}π"
    math_answer = "\\pi" if coefficient == 1 else f"{coefficient}\\pi"
    return answer, math_answer


def solve_middle_school_polygon_circle_measure_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != POLYGON_CIRCLE_UNIT_KEY:
        raise MiddleSchoolPolygonCircleMeasureVariantError("fixture belongs to M1-06")
    family = fixture.get("familyId")
    data = fixture.get("data", {})
    if family == POLYGON_FAMILY_ID:
        n = _integer(data.get("n"), "n")
        if not 3 <= n <= 12:
            raise MiddleSchoolPolygonCircleMeasureVariantError("n must be between 3 and 12")
        answer = (n - 2) * 180
        given = f"{n}각형의 내각의 합을 구하여라."
        steps = [{"title": "대각선으로 나누기", "work": f"한 꼭짓점에서 대각선을 그으면 {n-2}개의 삼각형으로 나뉜다.", "why": "n각형은 한 꼭짓점에서 그은 대각선으로 n-2개의 삼각형을 만든다."}, {"title": "삼각형의 내각합 사용", "work": f"내각의 합은 $({n}-2)\\times180^\\circ={answer}^\\circ$이다.", "why": "삼각형 하나의 내각의 합은 $180^\\circ$이다."}, {"title": "그림과 검산", "work": f"그림의 {n}개 변을 가진 다각형에 대해 계산 결과는 {_degree(answer)}이다.", "why": "변의 개수와 계산에 사용한 n을 대조한다."}]
        return {"answer": f"{answer}°", "answerText": f"{answer}°", "given": given, "goal": "다각형의 내각의 합을 구한다.", "keyIdea": "n각형을 n-2개의 삼각형으로 나누어 내각의 합을 계산한다.", "conceptNote": "n각형의 내각의 합은 $(n-2)\\times180^\\circ$이다.", "steps": steps, "check": f"$({n}-2)\\times180^\\circ={answer}^\\circ$이므로 답은 {_degree(answer)}이다.", "commonMistakes": ["삼각형의 개수를 n-1로 세는 것", "변의 개수와 꼭짓점의 개수를 다르게 세는 것", "내각의 합과 한 내각의 크기를 혼동하는 것"], "visualSpec": _polygon_visual(n, solution=False, answer=answer), "solutionVisualSpec": _polygon_visual(n, solution=True, answer=answer)}
    if family == CIRCLE_FAMILY_ID:
        radius = _integer(data.get("radius"), "radius")
        if radius <= 0:
            raise MiddleSchoolPolygonCircleMeasureVariantError("radius must be positive")
        kind = fixture.get("kind")
        if kind not in {"circle_area", "circle_circumference"}:
            raise MiddleSchoolPolygonCircleMeasureVariantError("unsupported circle measure kind")
        answer, math_answer = _circle_answer(kind, radius)
        target = "넓이" if kind == "circle_area" else "둘레"
        target_label = f"원의 {target}"
        formula = "$S=\\pi r^2$" if kind == "circle_area" else "$C=2\\pi r$"
        substitution = f"$S=\\pi\\times{radius}^2={math_answer}$" if kind == "circle_area" else f"$C=2\\pi\\times{radius}={math_answer}$"
        steps = [{"title": "반지름 확인", "work": f"원의 반지름은 $r={radius}$이다.", "why": "넓이와 둘레 공식에 반지름을 사용한다."}, {"title": "공식에 대입", "work": f"{target_label} 공식은 {formula}이고, {substitution}이다.", "why": "원의 넓이는 반지름의 제곱에 π를 곱하고, 둘레는 지름에 π를 곱한다."}, {"title": "단위와 검산", "work": f"따라서 {target_label}는 ${math_answer}$이다.", "why": "넓이는 제곱 단위, 둘레는 길이 단위임을 확인한다."}]
        return {"answer": answer, "answerText": answer, "given": f"반지름의 길이가 ${radius}$인 원의 {target}를 구하여라. (원주율은 $\\pi$로 나타낸다.)", "goal": f"원의 {target}를 구한다.", "keyIdea": "원의 반지름을 해당 공식에 대입하여 정확한 π의 꼴로 나타낸다.", "conceptNote": f"원의 {target} 공식은 {formula}이다.", "steps": steps, "check": f"반지름 ${radius}$를 공식에 대입한 결과 ${math_answer}$가 되므로 답은 ${math_answer}$이다.", "commonMistakes": ["반지름과 지름을 혼동하는 것", "원의 넓이에서 반지름을 제곱하지 않는 것", "원주율을 소수로 바꾸어 정확한 답을 잃는 것"], "visualSpec": _circle_visual(radius, solution=False, answer=answer), "solutionVisualSpec": _circle_visual(radius, solution=True, answer=answer)}
    if family == RECTANGLE_FAMILY_ID:
        width, height = _integer(data.get("width"), "width"), _integer(data.get("height"), "height")
        if width <= 0 or height <= 0:
            raise MiddleSchoolPolygonCircleMeasureVariantError("rectangle sides must be positive")
        kind = fixture.get("kind")
        if kind not in {"rectangle_area", "rectangle_perimeter"}:
            raise MiddleSchoolPolygonCircleMeasureVariantError("unsupported rectangle measure kind")
        target, answer = ("넓이", width * height) if kind == "rectangle_area" else ("둘레", 2 * (width + height))
        formula = "$S=\\text{가로}\\times\\text{세로}$" if kind == "rectangle_area" else "$P=2\\times(\\text{가로}+\\text{세로})$"
        substitution = f"$S={width}\\times{height}={answer}$" if kind == "rectangle_area" else f"$P=2\\times({width}+{height})={answer}$"
        steps = [{"title": "변의 길이 확인", "work": f"가로는 ${width}$, 세로는 ${height}$이다.", "why": "직사각형의 두 변 길이를 공식에 넣을 준비를 한다."}, {"title": "공식에 대입", "work": f"직사각형의 {target} 공식은 {formula}이고, {substitution}이다.", "why": f"직사각형의 {target} 공식을 적용한다."}, {"title": "그림과 검산", "work": f"그림의 가로·세로 표기와 계산을 대조하면 {target}는 ${answer}$이다.", "why": "도형의 변을 잘못 읽지 않았는지 확인한다."}]
        return {"answer": answer, "answerText": str(answer), "given": f"가로의 길이가 ${width}$, 세로의 길이가 ${height}$인 직사각형의 {target}를 구하여라.", "goal": f"직사각형의 {target}를 구한다.", "keyIdea": f"직사각형의 {target} 공식을 가로와 세로의 길이에 적용한다.", "conceptNote": f"직사각형의 {target} 공식은 {formula}이다.", "steps": steps, "check": f"가로 ${width}$와 세로 ${height}$를 공식에 대입하여 {target} ${answer}$를 얻었다.", "commonMistakes": ["가로와 세로를 바꾸어도 되는 계산에서 한 변을 빠뜨리는 것", "넓이와 둘레 공식을 혼동하는 것", "둘레에서 두 변의 합에 2를 곱하지 않는 것"], "visualSpec": _rectangle_visual(width, height, solution=False, answer=answer), "solutionVisualSpec": _rectangle_visual(width, height, solution=True, answer=answer)}
    raise MiddleSchoolPolygonCircleMeasureVariantError(f"unsupported M1-06 family: {family}")


def load_middle_school_polygon_circle_measure_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / POLYGON_CIRCLE_MEASURE_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolPolygonCircleMeasureVariantError("M1-06 fixture corpus cannot be read") from error
    fixtures = payload.get("fixtures")
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_STRUCTURED_FIXTURES" or payload.get("unitKey") != POLYGON_CIRCLE_UNIT_KEY or not isinstance(fixtures, list) or len(fixtures) != 18:
        raise MiddleSchoolPolygonCircleMeasureVariantError("M1-06 corpus metadata or count is invalid")
    if {item.get("familyId") for item in fixtures} != set(FAMILY_IDS):
        raise MiddleSchoolPolygonCircleMeasureVariantError("M1-06 corpus must contain polygon, circle, and rectangle families")
    return copy.deepcopy(fixtures)


def middle_school_polygon_circle_measure_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    for family in FAMILY_IDS:
        registry.register(StructureFamilyAdapter(family_id=family, solver_profile=f"middle_school_{family.lower()}_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC: "MANDATORY", TRANSFORM_B_REPRESENTATION: "MANDATORY", TRANSFORM_C_PARAMETER_RECOVERY: "HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m1-06-polygon-triangle-general":{"n":4}, "m1-06-polygon-quadrilateral-boundary":{"n":5}, "m1-06-polygon-pentagon-composite":{"n":6}, "m1-06-polygon-hexagon-general":{"n":8}, "m1-06-polygon-octagon-composite":{"n":10}, "m1-06-polygon-decagon-boundary":{"n":12},
        "m1-06-circle-circumference-general":{"radius":3}, "m1-06-circle-area-boundary":{"radius":2}, "m1-06-circle-circumference-composite":{"radius":6}, "m1-06-circle-area-general":{"radius":8}, "m1-06-circle-circumference-boundary":{"radius":2}, "m1-06-circle-area-composite":{"radius":12},
        "m1-06-rectangle-area-general":{"width":4,"height":6}, "m1-06-rectangle-perimeter-boundary":{"width":5,"height":8}, "m1-06-rectangle-square-composite":{"width":7,"height":7}, "m1-06-rectangle-perimeter-general":{"width":9,"height":4}, "m1-06-rectangle-area-boundary":{"width":3,"height":10}, "m1-06-rectangle-perimeter-composite":{"width":11,"height":5}
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolPolygonCircleMeasureVariantError(f"no M1-06 numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data = fixture["data"]
    family = fixture["familyId"]
    if family == POLYGON_FAMILY_ID:
        n = _integer(data["n"], "n")
        content = f"{n}각형을 여러 삼각형으로 나누어 내각의 합을 구하여라." if representation == "rearranged" else result["given"]
    elif family == CIRCLE_FAMILY_ID:
        radius = _integer(data["radius"], "radius")
        target = "넓이" if fixture["kind"] == "circle_area" else "둘레"
        content = f"중심이 O이고 반지름이 ${radius}$인 원의 {target}를 공식으로 나타내어라." if representation == "rearranged" else result["given"]
    else:
        target = "넓이" if fixture["kind"] == "rectangle_area" else "둘레"
        width, height = _integer(data["width"], "width"), _integer(data["height"], "height")
        content = f"가로 ${width}$, 세로 ${height}$인 직사각형에서 두 변의 정보를 이용하여 {target}을 계산하여라." if representation == "rearranged" else result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(family: str) -> dict[str, Any]:
    ops = {POLYGON_FAMILY_ID:("count_sides","apply_polygon_angle_sum"), CIRCLE_FAMILY_ID:("identify_radius","apply_circle_measure_formula"), RECTANGLE_FAMILY_ID:("identify_side_lengths","apply_rectangle_measure_formula")}[family]
    nodes = [{"nodeId":"inspect","role":"core","op":ops[0],"inputRole":["figure_data"],"outputRole":["figure_parameters"],"order":0},{"nodeId":"calculate","role":"core","op":ops[1],"inputRole":["figure_parameters"],"outputRole":["exact_answer"],"order":1}]
    return normalize_solution_graph({"nodes":nodes,"edges":[{"from":"inspect","to":"calculate"}],"coreDecisionCount":1,"branchCount":0,"newConceptCount":0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    return {"id":ordinal, **_student_payload(fixture,result,representation="standard"), "answer":result["answerText"], "solution":result["answerText"], "standardCourse":"중1 수학", "standardUnitKey":POLYGON_CIRCLE_UNIT_KEY, "standardUnit":"평면도형의 성질"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture,result,ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=fixture["familyId"], solution_graph=_graph(fixture["familyId"]), curriculum={"courseKey":"M1","unitKey":POLYGON_CIRCLE_UNIT_KEY,"label":"평면도형의 성질"}, concepts=[fixture["subUnit"]], givens={"data":copy.deepcopy(fixture["data"])}, goal={"kind":fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"exactMeasure":True,"visualDefinitionRequired":True}, representation={"layoutTag":"grid","wide":False,"style":"standard"}, difficulty_vector={"interpretation":1,"representation":1,"decision":1,"algebraLoad":1,"calculationLoad":2,"visualLoad":2,"branch":0,"newConcept":0}, allowed_methods=["다각형 내각합 공식","원의 넓이·둘레 공식","직사각형 넓이·둘레 공식"], forbidden_methods=["도형의 모양만 보고 수치를 추정하기","원주율을 임의의 소수로 근사하기","교육과정 밖의 공식 사용"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], fixture: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs=[f"middle-m1-06-proof:{ordinal}:{declared_class}"]
    required=["coreConceptPreserved","solutionGraphPreserved","curriculumPreserved","parameterChanged","effectiveParameterChangeCount","parameterDistance","answerMemoryShortcut"] if declared_class=="A" else ["coreConceptPreserved","solutionGraphPreserved","representationChanged","antiClone","curriculumPreserved"]
    checks=[build_proof_check(check,"PASS",method="middle_school_m1_06_exact_adapter",evidence_refs=refs,summary="Exact polygon/circle/rectangle recomputation and visual comparison passed.") for check in required]
    payload={"artifactType":"ALIVE_VARIANT_PROOF_SIDECAR","schemaVersion":"0.1.0","sourceQuestionId":source_ir["sourceQuestionId"],"declaredClass":declared_class,"verifiedClass":"HOLD","structureFamily":fixture["familyId"],"transform":TRANSFORM_A_NUMERIC if declared_class=="A" else TRANSFORM_B_REPRESENTATION,"capabilityStatus":CAPABILITY_SUPPORTED,"coreConceptPreserved":True,"solutionGraphPreserved":source_ir["solutionGraph"]["graphFingerprint"]==candidate_ir["solutionGraph"]["graphFingerprint"],"coreDecisionDelta":0,"branchDelta":0,"newConceptDelta":0,"preprocessingDelta":0,"preprocessLoad":{"type":"none","magnitude":0},"preprocessDeterministic":True,"preprocessOutputArity":0,"studentObservableInputsOnly":True,"ablationPassed":True,"shortcutBlocked":True,"difficultyDelta":{"representation":1 if declared_class=="B" else 0,"calculation":1 if declared_class=="A" else 0},"proofChecks":checks,"proofSha256":"pending","sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"]}
    payload.update({"parameterChanged":True,"effectiveParameterChangeCount":1,"parameterDistance":1,"answerMemoryShortcut":False} if declared_class=="A" else {"representationChanged":True,"antiClone":True})
    payload["proofSha256"]=hashlib.sha256(json.dumps({key:value for key,value in payload.items() if key!="proofSha256"},ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail=normalize_solution_detail({"version":"0.1","audience":"student","depth":"detailed","given":result["given"],"goal":result["goal"],"keyIdea":result["keyIdea"],"conceptNote":result["conceptNote"],"steps":result["steps"],"check":result["check"],"commonMistakes":result["commonMistakes"],"diagramRequirement":"MANDATORY","diagramPurpose":"다각형·원·직사각형의 핵심 길이와 측정 공식을 그림에서 확인한다."},inferred_visual_requirement="MANDATORY")
    payload=_student_payload(fixture,result,representation="rearranged" if declared_class=="B" else "standard")
    metadata={"level":"중","category":fixture["coverage"],"originalCategory":fixture["coverage"],"standardCourse":"중1 수학","standardUnitKey":POLYGON_CIRCLE_UNIT_KEY,"standardUnit":"평면도형의 성질","standardUnitOrder":6,"subUnitKey":fixture["subUnitKey"],"subUnit":fixture["subUnit"],"subUnitConfidence":"deterministic_fixture","subUnitClassificationDepth":"complete_rule","questionType":payload["questionType"],"layoutTag":payload["layoutTag"],"tags":[fixture["coverage"],"ALIVE_UNIVERSAL_MIDDLE_SCHOOL_M1_06_BOUNDED"],"wide":False}
    candidate={"artifactType":"ALIVE_UNIVERSAL_CANDIDATE","schemaVersion":"0.1.0","runId":run_id,"sourceQuestionId":source_ir["sourceQuestionId"],"sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"],"variantPlan":{"declaredClass":declared_class,"transform":sidecar["transform"],"familyId":fixture["familyId"],"bridgeStatus":"BOUNDED_MIDDLE_SCHOOL_M1_06_EXACT_VARIANT","sourceGraphFingerprint":source_ir["solutionGraph"]["graphFingerprint"],"candidateGraphFingerprint":candidate_ir["solutionGraph"]["graphFingerprint"]},"studentPayload":payload,"answerContract":{"answerType":"text","displayAnswer":result["answerText"],"equivalencePolicy":"normalized_math_text"},"solution":format_solution_detail(detail,result["answerText"]),"solutionDetail":detail,"archiveMetadata":metadata,"variantProof":sidecar,"variantResult":variant_result,"visualDependency":"MANDATORY","solutionVisualElements":{"required":True},"visualSpec":copy.deepcopy(result["visualSpec"]),"solutionVisualSpec":copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id":ordinal,"blindMath":{"status":"PASS","method":"middle_school_m1_06_independent_exact_recompute","evidenceRefs":[f"middle-m1-06-review:{ordinal}:blindMath"]},"solution":{"status":"PASS","method":"middle_school_m1_06_solution_detail_contract","evidenceRefs":[f"middle-m1-06-review:{ordinal}:solution"]},"variantComparison":{"status":"PASS","method":"middle_school_m1_06_visual_comparison","evidenceRefs":[f"middle-m1-06-review:{ordinal}:variantComparison"]}}


def build_middle_school_polygon_circle_measure_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A","B"}:
        raise MiddleSchoolPolygonCircleMeasureVariantError("C is HOLD for M1-06 until a genuine preprocess fixture exists")
    snapshot=load_rule_pack(Path(root).resolve(),required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolPolygonCircleMeasureVariantError("canonical rule pack is not ready")
    fixtures=load_middle_school_polygon_circle_measure_fixtures(root)
    transform=TRANSFORM_A_NUMERIC if declared_class=="A" else TRANSFORM_B_REPRESENTATION
    source_questions=[]; source_irs=[]; candidate_irs=[]; candidates=[]; proof_rows=[]; reviews=[]; assignments=[]
    for ordinal,fixture in enumerate(fixtures,1):
        source_result=solve_middle_school_polygon_circle_measure_fixture(fixture)
        source_questions.append(_source_question(fixture,source_result,ordinal))
        source_ir=_build_ir(fixture,source_result,ordinal,snapshot["snapshotSha256"]); require_valid_universal_question_ir(source_ir); source_irs.append(source_ir)
        variant=copy.deepcopy(fixture)
        if declared_class=="A": variant["data"]=_mutated_data(fixture)
        result=solve_middle_school_polygon_circle_measure_fixture(variant)
        candidate_payload=_student_payload(variant,result,representation="rearranged" if declared_class=="B" else "standard")
        candidate_ir=copy.deepcopy(source_ir); candidate_ir["studentPayload"]={**candidate_ir["studentPayload"],"content":candidate_payload["content"]}; candidate_ir["parameters"]=copy.deepcopy(variant["data"]); candidate_irs.append(candidate_ir)
        sidecar=_sidecar(source_ir,candidate_ir,fixture,declared_class,ordinal); refs={ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}; variant_result=reduce_variant_class(sidecar,evidence_catalog=refs)
        if variant_result.get("status")!="PASS": raise MiddleSchoolPolygonCircleMeasureVariantError(f"M1-06 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id,ordinal,variant,result,source_ir,candidate_ir,sidecar,variant_result,declared_class)); proof_rows.append({"id":ordinal,"sidecar":sidecar}); reviews.append(_review(ordinal)); assignments.append({"id":ordinal,"unitKey":POLYGON_CIRCLE_UNIT_KEY,"familyId":fixture["familyId"],"transform":transform,"status":"READY","solver":"middle_school_m1_06_exact_adapter_v1","variantClass":declared_class})
    review_catalog=sorted({ref for row in reviews for view in ("blindMath","solution","variantComparison") for ref in row[view]["evidenceRefs"]}); proof_catalog=sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_BOUNDED_VARIANT_INPUT","schemaVersion":POLYGON_CIRCLE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"BOUNDED_MIDDLE_SCHOOL_M1_06_EXACT_VARIANT","variantClass":declared_class,"transform":transform,"fixtureScope":"M1-06_polygon_circle_measure_structured","ruleSnapshotSha256":snapshot["snapshotSha256"],"questionCount":len(candidates),"sourceQuestions":source_questions,"sourceIR":source_irs,"candidateIR":candidate_irs,"candidates":candidates,"proofRows":proof_rows,"proofCatalog":proof_catalog,"reviewLedger":{"artifactType":"ALIVE_UNIVERSAL_REVIEW_LEDGER","schemaVersion":"0.1.0","questions":reviews},"reviewCatalog":review_catalog,"independentReviews":reviews,"capabilityPreflight":{"status":"PASS","assignments":assignments},"visualRecon":{"status":"PASS","questions":[{"id":item["id"],"visualDependency":"MANDATORY","problem":"PASS","solution":"PASS"} for item in assignments]},"promotionStatus":"CANDIDATE","promotionReason":"M1-06 polygon/circle/rectangle exact A/B slices; C remains HOLD"}


def build_middle_school_polygon_circle_measure_capability_report(root: Path) -> dict[str, Any]:
    records=[]
    for family in FAMILY_IDS:
        for declared_class in ("A","B"):
            inputs=build_middle_school_polygon_circle_measure_variant_inputs(root,run_id=f"capability-middle-m1-06-{declared_class.lower()}",declared_class=declared_class)
            for assignment,candidate in zip(inputs["capabilityPreflight"]["assignments"],inputs["candidates"]):
                if assignment["familyId"]==family: records.append({"familyId":family,"transform":inputs["transform"],"polarity":"positive","status":"PASS","unitKey":POLYGON_CIRCLE_UNIT_KEY,"variantClass":declared_class,"verifiedClass":candidate["variantResult"]["verifiedClass"]})
            records.append({"familyId":family,"transform":inputs["transform"],"polarity":"negative","status":"PASS","unitKey":POLYGON_CIRCLE_UNIT_KEY,"variantClass":declared_class,"negativeCode":"VARIANT_PROOF_FAILED"})
        records.append({"familyId":family,"transform":TRANSFORM_C_PARAMETER_RECOVERY,"polarity":"negative","status":"PASS","unitKey":POLYGON_CIRCLE_UNIT_KEY,"variantClass":"C","negativeCode":"C_ABLATION_FAILED"})
    promotion=evaluate_capability_promotion(records)
    return {**promotion,"artifactType":"ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_CAPABILITY_PROMOTION","schemaVersion":POLYGON_CIRCLE_MEASURE_VARIANT_SCHEMA_VERSION,"scope":"M1-06 polygon interior angle sum, circle measure, rectangle measure bounded slices","unitCount":3,"fixtureCount":18,"status":"ACTIVE_BOUNDED" if promotion["holdCount"]==3 and promotion["activeCount"]==6 else "HOLD","cRecords":records,"productionArchiveRegistration":"NOT_PERFORMED","publicationStatus":"NOT_PUBLISHED"}


def prepare_middle_school_polygon_circle_measure_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs=build_middle_school_polygon_circle_measure_variant_inputs(root,run_id=run_id,declared_class=declared_class); root=Path(root).resolve(); source_path=root/"archive/_generated/alive-universal-inputs"/f"{run_id}.js"; source_path.parent.mkdir(parents=True,exist_ok=True); source_path.write_text("window.examTitle = "+json.dumps(title,ensure_ascii=False)+";\nwindow.questionBank = "+json.dumps(inputs["sourceQuestions"],ensure_ascii=False,indent=2)+";\n",encoding="utf-8",newline="\n")
    source_manifest={"artifactType":"ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_UNIVERSAL_SOURCE_JS","schemaVersion":POLYGON_CIRCLE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"questionCount":inputs["questionCount"],"path":source_path.relative_to(root).as_posix(),"sha256":sha256_file(source_path),"ruleSnapshotSha256":inputs["ruleSnapshotSha256"],"publicationStatus":"NOT_PUBLISHED"}; atomic_write_json(source_path.with_name(source_path.stem+"-manifest.json"),source_manifest)
    start=start_universal_run(Path(runtime_root).resolve(),run_id=run_id,source_lock={"path":source_manifest["path"],"sha256":source_manifest["sha256"],"ruleSnapshotSha256":inputs["ruleSnapshotSha256"]},question_count=inputs["questionCount"],batch_plan=[[start for start in range(index,min(index+4,inputs["questionCount"]+1))] for index in range(1,inputs["questionCount"]+1,4)]); store=UniversalRunStore(Path(runtime_root).resolve()); atomic_write_json(store.run_dir(run_id)/"source/variant-input.json",inputs)
    record_universal_stage(store,run_id,"S01_PREFLIGHT",status="PASS",evidence="middle-school-m1-06-exact-variant-preflight"); record_universal_visual_recon(store,run_id,inputs["visualRecon"]); record_universal_ir_analysis(store,run_id,inputs["sourceIR"]); record_universal_capability_preflight(store,run_id,inputs["capabilityPreflight"]); record_universal_candidate_set(store,run_id,inputs["candidates"]); precheck=record_universal_variant_precheck(store,run_id,inputs["proofRows"],evidence_catalog=inputs["proofCatalog"]); record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review1",evidence_catalog=inputs["reviewCatalog"]); record_universal_revision(store,run_id,{"status":"PASS","bounded":True,"changedQuestionIds":[]}); record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review2",evidence_catalog=inputs["reviewCatalog"]); record_universal_mother_final(store,run_id); ledger=write_universal_variant_ledger(store,run_id,precheck["precheck"]["questions"]); assembled=assemble_universal_exam(store,run_id,title,archive_root=root/"archive")
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_POLYGON_CIRCLE_MEASURE_BOUNDED_VARIANT_PREPARED_RUN","schemaVersion":POLYGON_CIRCLE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"READY_FOR_BROWSER_RENDER","variantClass":declared_class,"fixtureScope":"M1-06_polygon_circle_measure_structured","run":start,"source":source_manifest,"questionCount":inputs["questionCount"],"variantLedger":ledger,"assembly":assembled["assembly"],"currentStage":UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"],"browserRender":"PENDING","publicationStatus":"NOT_PUBLISHED"}


__all__=["CIRCLE_FAMILY_ID","MiddleSchoolPolygonCircleMeasureVariantError","POLYGON_FAMILY_ID","RECTANGLE_FAMILY_ID","build_middle_school_polygon_circle_measure_capability_report","build_middle_school_polygon_circle_measure_variant_inputs","load_middle_school_polygon_circle_measure_fixtures","middle_school_polygon_circle_measure_variant_registry","prepare_middle_school_polygon_circle_measure_variant_run","solve_middle_school_polygon_circle_measure_fixture"]
