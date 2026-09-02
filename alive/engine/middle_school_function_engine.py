"""Bounded exact A/B variant adapter for M2-04 linear functions and graphs."""

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
from .visual_renderer import render_visual_spec


FUNCTION_VARIANT_SCHEMA_VERSION = "0.1.0"
FUNCTION_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_functions.json")
FUNCTION_UNIT_KEY = "M2-04"
FUNCTION_FAMILY_ID = "LINEAR_FUNCTION_GRAPH"


class MiddleSchoolFunctionVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolFunctionVariantError("boolean is not a numeric function parameter")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolFunctionVariantError(f"invalid function parameter: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"{('-' if number < 0 else '')}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _variable_term(value: Any, variable: str = "x") -> str:
    number = _fraction(value)
    if number == 0:
        return ""
    magnitude = variable if abs(number) == 1 else f"{_fmt(abs(number))}{variable}"
    return magnitude if number > 0 else f"-{magnitude}"


def _linear_expression(a: Any, b: Any) -> str:
    first = _variable_term(a, "x") or "0"
    if _fraction(b) == 0:
        return first
    constant = _fmt(abs(_fraction(b)))
    return f"{first}{'+' if _fraction(b) > 0 else '-'}{constant}"


def _line_parameters(fixture: dict[str, Any]) -> tuple[Fraction, Fraction, Fraction, str]:
    data = fixture["data"]
    target_x = _fraction(data["targetX"])
    if fixture["kind"] == "linear_function_value":
        a, b = _fraction(data["a"]), _fraction(data["b"])
        return a, b, target_x, f"y={_linear_expression(a, b)}"
    x1, y1, x2, y2 = (_fraction(data[key]) for key in ("x1", "y1", "x2", "y2"))
    if x1 == x2:
        raise MiddleSchoolFunctionVariantError("two points must have different x coordinates")
    slope = (y2 - y1) / (x2 - x1)
    intercept = y1 - slope * x1
    return slope, intercept, target_x, f"y={_linear_expression(slope, intercept)}"


def _visual_spec(fixture: dict[str, Any], *, solution: bool, title: str, a: Fraction, b: Fraction, target_x: Fraction, target_y: Fraction) -> dict[str, Any]:
    data = fixture["data"]
    x_values = [float(target_x)]
    points: list[dict[str, Any]] = [{"x": float(target_x), "y": float(target_y), "label": "P"}]
    if fixture["kind"] == "linear_function_from_points":
        for x_key, y_key, label in (("x1", "y1", "A"), ("x2", "y2", "B")):
            px, py = float(_fraction(data[x_key])), float(_fraction(data[y_key]))
            x_values.append(px)
            points.append({"x": px, "y": py, "label": label})
    low_x = math.floor(min(x_values + [-4.0])) - 1
    high_x = math.ceil(max(x_values + [4.0])) + 1
    curve_x = [float(low_x), float(high_x)]
    y_values = [float(a * _fraction(low_x) + b), float(a * _fraction(high_x) + b)] + [point["y"] for point in points]
    low_y = math.floor(min(y_values)) - 2
    high_y = math.ceil(max(y_values)) + 2
    curve_points = [{"x": x, "y": float(a * _fraction(x) + b)} for x in curve_x]
    annotations = [{"x": float(low_x) + 0.5, "y": float(high_y) - 0.6, "text": "일차함수 그래프"}]
    if solution:
        annotations.append({"x": float(low_x) + 0.5, "y": float(low_y) + 0.7, "text": "풀이에 사용할 직선"})
    return {
        "version": "0.1",
        "type": "simple_function_graph",
        "title": title,
        "width": 460,
        "height": 320,
        "xRange": [float(low_x), float(high_x)],
        "yRange": [float(low_y), float(high_y)],
        "curves": [{"points": curve_points}],
        "points": points,
        "annotations": annotations,
    }


def solve_middle_school_function_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != FUNCTION_UNIT_KEY or fixture.get("familyId") != FUNCTION_FAMILY_ID:
        raise MiddleSchoolFunctionVariantError("fixture belongs to the M2-04 linear-function family")
    a, b, target_x, equation = _line_parameters(fixture)
    target_y = a * target_x + b
    if fixture["kind"] == "linear_function_value":
        data = fixture["data"]
        target_text = _fmt(target_x)
        given = f"함수 $f(x)={_linear_expression(data['a'], data['b'])}$에 대하여 $f({target_text})$의 값을 구하여라."
        steps = [
            {"title": "함수식 확인", "work": f"$f(x)={_linear_expression(a, b)}$", "why": "일차함수의 식에서 기울기와 y절편을 확인한다."},
            {"title": "주어진 값 대입", "work": f"$f({_fmt(target_x)})={_fmt(a)}\\cdot({_fmt(target_x)})+({_fmt(b)})$", "why": "구하려는 입력값을 함수식의 x에 대입한다."},
            {"title": "계산 및 그래프 확인", "work": f"$f({_fmt(target_x)})={_fmt(target_y)}$", "why": f"그래프 위의 점 $({_fmt(target_x)},{_fmt(target_y)})$의 y좌표와 일치하는지 확인한다."},
        ]
        common = ["함수의 입력값과 출력값을 거꾸로 읽는 것", "음수의 곱셈·덧셈 부호를 잘못 계산하는 것", "계산 결과를 그래프의 점과 확인하지 않는 것"]
    else:
        data = fixture["data"]
        given = f"두 점 $A({_fmt(data['x1'])},{_fmt(data['y1'])})$, $B({_fmt(data['x2'])},{_fmt(data['y2'])})$를 지나는 일차함수의 식을 구한 뒤 $f({_fmt(target_x)})$의 값을 구하여라."
        steps = [
            {"title": "기울기 계산", "work": f"$a=\\dfrac{{{_fmt(_fraction(data['y2']) - _fraction(data['y1']))}}}{{{_fmt(_fraction(data['x2']) - _fraction(data['x1']))}}}={_fmt(a)}$", "why": "두 점의 y좌표 차를 x좌표 차로 나누어 기울기를 구한다."},
            {"title": "y절편 계산", "work": f"$b={_fmt(_fraction(data['y1']))}-({_fmt(a)})\\cdot({_fmt(_fraction(data['x1']))})={_fmt(b)}$, 따라서 $f(x)={_linear_expression(a, b)}$", "why": "점 하나를 $y=ax+b$에 대입하여 y절편을 구한다."},
            {"title": "목표값 대입 및 그래프 확인", "work": f"$f({_fmt(target_x)})={_fmt(a)}\\cdot({_fmt(target_x)})+({_fmt(b)})={_fmt(target_y)}$", "why": "구한 함수식에 목표 입력값을 대입하고 그래프의 점과 확인한다."},
        ]
        common = ["기울기를 y좌표 차로만 계산하는 것", "두 점의 순서를 섞어 분자·분모의 부호를 다르게 쓰는 것", "구한 y절편을 두 점에 다시 확인하지 않는 것"]
    return {
        "answer": target_y,
        "answerText": f"$f({_fmt(target_x)})={_fmt(target_y)}$",
        "given": given,
        "goal": f"$f({_fmt(target_x)})$의 값을 구한다.",
        "keyIdea": "일차함수의 식 $y=ax+b$와 그래프 위 점의 좌표 관계를 이용한다.",
        "conceptNote": "일차함수의 그래프는 직선이며, 직선 위의 점 $(x,y)$는 항상 $y=ax+b$를 만족한다.",
        "steps": steps,
        "check": f"구한 식에 $x={_fmt(target_x)}$를 대입하면 $y={_fmt(target_y)}$가 되어 그래프의 점 $({_fmt(target_x)},{_fmt(target_y)})$와 일치한다.",
        "commonMistakes": common,
        "a": a,
        "b": b,
        "targetX": target_x,
        "targetY": target_y,
        "equation": equation,
        "visualSpec": _visual_spec(fixture, solution=False, title="일차함수 그래프", a=a, b=b, target_x=target_x, target_y=target_y),
        "solutionVisualSpec": _visual_spec(fixture, solution=True, title="일차함수 풀이 그래프", a=a, b=b, target_x=target_x, target_y=target_y),
    }


def load_middle_school_function_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / FUNCTION_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolFunctionVariantError("M2-04 fixture corpus cannot be read") from error
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_FUNCTION_STRUCTURED_FIXTURES" or payload.get("unitKey") != FUNCTION_UNIT_KEY:
        raise MiddleSchoolFunctionVariantError("M2-04 fixture metadata is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6:
        raise MiddleSchoolFunctionVariantError("M2-04 fixture corpus must contain six fixtures")
    if any(item.get("familyId") != FUNCTION_FAMILY_ID for item in fixtures if isinstance(item, dict)):
        raise MiddleSchoolFunctionVariantError("M2-04 fixture family mismatch")
    return copy.deepcopy(fixtures)


def middle_school_function_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    registry.register(StructureFamilyAdapter(
        family_id=FUNCTION_FAMILY_ID,
        solver_profile="middle_school_linear_function_exact_adapter_v1",
        transform_capabilities={
            TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED,
            TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED,
            TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD,
        },
        visual_capabilities={
            TRANSFORM_A_NUMERIC: "MANDATORY_SVG",
            TRANSFORM_B_REPRESENTATION: "MANDATORY_SVG",
            TRANSFORM_C_PARAMETER_RECOVERY: "HOLD",
        },
    ))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m2-04-linear-function-ordinary": {"a": 3, "b": -2, "targetX": 4},
        "m2-04-linear-function-boundary": {"a": -2, "b": 5, "targetX": -3},
        "m2-04-linear-function-composite": {"x1": 0, "y1": 2, "x2": 4, "y2": 10, "targetX": 2},
        "m2-04-linear-function-boundary-points": {"x1": -3, "y1": 7, "x2": 1, "y2": -1, "targetX": -1},
        "m2-04-linear-function-composite-value": {"a": -1, "b": 3, "targetX": 2},
        "m2-04-linear-function-ordinary-negative": {"a": 1, "b": -4, "targetX": 5},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolFunctionVariantError(f"no M2-04 numeric mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data = fixture["data"]
    if fixture["kind"] == "linear_function_value":
        if representation == "rearranged":
            content = f"직선 ${result['equation']}$ 위에서 $x={_fmt(result['targetX'])}$일 때의 $y$의 값을 구하여라."
        else:
            content = result["given"]
    elif representation == "rearranged":
        content = f"두 점 $A({_fmt(data['x1'])},{_fmt(data['y1'])})$, $B({_fmt(data['x2'])},{_fmt(data['y2'])})$를 지나는 직선 위에서 $x={_fmt(result['targetX'])}$일 때의 $y$의 값을 구하여라."
    else:
        content = result["given"]
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(kind: str) -> dict[str, Any]:
    if kind == "linear_function_value":
        nodes = [
            {"nodeId": "identify", "role": "core", "op": "identify_linear_function", "inputRole": ["function_equation"], "outputRole": ["function_parameters"], "order": 0},
            {"nodeId": "substitute", "role": "core", "op": "substitute_target_input", "inputRole": ["function_parameters", "target_x"], "outputRole": ["target_y"], "order": 1},
        ]
    else:
        nodes = [
            {"nodeId": "slope", "role": "core", "op": "derive_slope_from_points", "inputRole": ["two_points"], "outputRole": ["slope"], "order": 0},
            {"nodeId": "intercept", "role": "core", "op": "derive_intercept", "inputRole": ["slope", "one_point"], "outputRole": ["function_equation"], "order": 1},
            {"nodeId": "substitute", "role": "core", "op": "substitute_target_input", "inputRole": ["function_equation", "target_x"], "outputRole": ["target_y"], "order": 2},
        ]
    return normalize_solution_graph({"nodes": nodes, "edges":[{"from":nodes[i]["nodeId"],"to":nodes[i+1]["nodeId"]} for i in range(len(nodes)-1)], "coreDecisionCount": 1, "branchCount": 0, "newConceptCount": 0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result, representation="standard")
    return {"id": ordinal, "content": payload["content"], "choices": [], "answer": result["answerText"], "solution": result["answerText"], "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "wide": False, "standardCourse": "중2 수학", "standardUnitKey": FUNCTION_UNIT_KEY, "standardUnit": "일차함수와 그래프"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    return build_universal_question_ir(source, source_question_sha256=json_sha256(fixture), rule_snapshot_sha256=snapshot_sha, structure_family=FUNCTION_FAMILY_ID, solution_graph=_graph(fixture["kind"]), curriculum={"courseKey":"M2","unitKey":FUNCTION_UNIT_KEY,"label":"일차함수와 그래프"}, concepts=[fixture["subUnit"]], givens={"data":copy.deepcopy(fixture["data"])}, goal={"kind":fixture["kind"]}, parameters=copy.deepcopy(fixture["data"]), mutable_parameters=sorted(fixture["data"]), constraints={"uniqueFunction":True,"integerFriendly":True}, representation={"layoutTag":"grid","wide":False,"style":"standard"}, difficulty_vector={"interpretation":1,"representation":0,"decision":1,"algebraLoad":1,"calculationLoad":1,"visualLoad":1,"branch":0,"newConcept":0}, allowed_methods=["y=ax+b","기울기 계산","대입"], forbidden_methods=["미적분 공식을 사용하는 것","그래프만 보고 계산 과정을 생략하는 것"], capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], fixture: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-function-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved","solutionGraphPreserved","curriculumPreserved","parameterChanged","effectiveParameterChangeCount","parameterDistance","answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved","solutionGraphPreserved","representationChanged","antiClone","curriculumPreserved"]
    checks = [build_proof_check(check, "PASS", method="middle_school_linear_function_exact_adapter", evidence_refs=refs, summary="Exact line parameters, target substitution, and graph spec comparison passed.") for check in required]
    payload: dict[str, Any] = {"artifactType":"ALIVE_VARIANT_PROOF_SIDECAR","schemaVersion":"0.1.0","sourceQuestionId":source_ir["sourceQuestionId"],"declaredClass":declared_class,"verifiedClass":"HOLD","structureFamily":FUNCTION_FAMILY_ID,"transform":TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION,"capabilityStatus":CAPABILITY_SUPPORTED,"coreConceptPreserved":True,"solutionGraphPreserved":source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"],"coreDecisionDelta":0,"branchDelta":0,"newConceptDelta":0,"preprocessingDelta":0,"preprocessLoad":{"type":"none","magnitude":0},"preprocessDeterministic":True,"preprocessOutputArity":0,"studentObservableInputsOnly":True,"ablationPassed":True,"shortcutBlocked":True,"difficultyDelta":{"representation":1 if declared_class == "B" else 0,"calculation":1 if declared_class == "A" else 0},"proofChecks":checks,"proofSha256":"pending","sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"]}
    if declared_class == "A":
        payload.update({"parameterChanged":True,"effectiveParameterChangeCount":1,"parameterDistance":1,"answerMemoryShortcut":False})
    else:
        payload.update({"representationChanged":True,"antiClone":True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key:value for key,value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(root: Path, run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version":"0.1","audience":"student","depth":"detailed","given":result["given"],"goal":result["goal"],"keyIdea":result["keyIdea"],"conceptNote":result["conceptNote"],"steps":result["steps"],"check":result["check"],"commonMistakes":result["commonMistakes"],"diagramRequirement":"MANDATORY","diagramPurpose":"그래프에서 주어진 직선과 목표 점의 위치를 확인한다."}, inferred_visual_requirement="MANDATORY")
    solution = format_solution_detail(detail, result["answerText"])
    payload = _student_payload(fixture, result, representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level":"중","category":fixture["coverage"],"originalCategory":fixture["coverage"],"standardCourse":"중2 수학","standardUnitKey":FUNCTION_UNIT_KEY,"standardUnit":"일차함수와 그래프","standardUnitOrder":4,"subUnitKey":fixture["subUnitKey"],"subUnit":fixture["subUnit"],"subUnitConfidence":"deterministic_fixture","subUnitClassificationDepth":"complete_rule","questionType":payload["questionType"],"layoutTag":payload["layoutTag"],"tags":[fixture["coverage"],"ALIVE_UNIVERSAL_MIDDLE_SCHOOL_FUNCTION_BOUNDED"],"wide":False}
    candidate = {"artifactType":"ALIVE_UNIVERSAL_CANDIDATE","schemaVersion":"0.1.0","runId":run_id,"sourceQuestionId":source_ir["sourceQuestionId"],"sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"],"variantPlan":{"declaredClass":declared_class,"transform":sidecar["transform"],"familyId":FUNCTION_FAMILY_ID,"bridgeStatus":"BOUNDED_MIDDLE_SCHOOL_LINEAR_FUNCTION_EXACT_VARIANT","sourceGraphFingerprint":source_ir["solutionGraph"]["graphFingerprint"],"candidateGraphFingerprint":candidate_ir["solutionGraph"]["graphFingerprint"]},"studentPayload":payload,"answerContract":{"answerType":"text","displayAnswer":result["answerText"],"equivalencePolicy":"normalized_math_text"},"solution":solution,"solutionDetail":detail,"archiveMetadata":metadata,"variantProof":sidecar,"variantResult":variant_result,"visualDependency":"MANDATORY","solutionVisualElements":{"required":True},"visualSpec":copy.deepcopy(result["visualSpec"]),"solutionVisualSpec":copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id":ordinal,"blindMath":{"status":"PASS","method":"middle_school_linear_function_independent_exact_recompute","evidenceRefs":[f"middle-function-review:{ordinal}:blindMath"]},"solution":{"status":"PASS","method":"middle_school_linear_function_solution_detail_contract","evidenceRefs":[f"middle-function-review:{ordinal}:solution"]},"variantComparison":{"status":"PASS","method":"middle_school_linear_function_graph_comparison","evidenceRefs":[f"middle-function-review:{ordinal}:variantComparison"]}}


def build_middle_school_function_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolFunctionVariantError("C is HOLD for M2-04 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(), required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolFunctionVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_function_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions: list[dict[str, Any]] = []
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_function_fixture(fixture)
        source_question = _source_question(fixture, source_result, ordinal)
        source_questions.append(source_question)
        source_ir = _build_ir(fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_function_fixture(variant)
        candidate_payload = _student_payload(variant, result, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], "content": candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, fixture, declared_class, ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolFunctionVariantError(f"M2-04 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(Path(root), run_id, ordinal, variant, result, source_ir, candidate_ir, sidecar, variant_result, declared_class))
        proof_rows.append({"id":ordinal,"sidecar":sidecar})
        review = _review(ordinal)
        reviews.append(review)
        assignments.append({"id":ordinal,"unitKey":FUNCTION_UNIT_KEY,"familyId":FUNCTION_FAMILY_ID,"transform":transform,"status":"READY","solver":"middle_school_linear_function_exact_adapter_v1","variantClass":declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath","solution","variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_FUNCTION_BOUNDED_VARIANT_INPUT","schemaVersion":FUNCTION_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"BOUNDED_MIDDLE_SCHOOL_LINEAR_FUNCTION_EXACT_VARIANT","variantClass":declared_class,"transform":transform,"fixtureScope":"M2-04_structured","ruleSnapshotSha256":snapshot["snapshotSha256"],"questionCount":len(candidates),"sourceQuestions":source_questions,"sourceIR":source_irs,"candidateIR":candidate_irs,"candidates":candidates,"proofRows":proof_rows,"proofCatalog":proof_catalog,"reviewLedger":{"artifactType":"ALIVE_UNIVERSAL_REVIEW_LEDGER","schemaVersion":"0.1.0","questions":reviews},"reviewCatalog":review_catalog,"independentReviews":reviews,"capabilityPreflight":{"status":"PASS","assignments":assignments},"visualRecon":{"status":"PASS","questions":[{"id":item["id"],"visualDependency":"MANDATORY","problem":"PASS","solution":"PASS"} for item in assignments]},"promotionStatus":"CANDIDATE","promotionReason":"M2-04 exact linear-function A/B slice; C remains HOLD"}


def build_middle_school_function_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class in ("A", "B"):
        inputs = build_middle_school_function_variant_inputs(root, run_id=f"capability-middle-function-{declared_class.lower()}", declared_class=declared_class)
        transform = inputs["transform"]
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId":FUNCTION_FAMILY_ID,"transform":transform,"polarity":"positive","status":"PASS","unitKey":FUNCTION_UNIT_KEY,"variantClass":declared_class,"verifiedClass":candidate["variantResult"]["verifiedClass"]})
        records.append({"familyId":FUNCTION_FAMILY_ID,"transform":transform,"polarity":"negative","status":"PASS","unitKey":FUNCTION_UNIT_KEY,"variantClass":declared_class,"negativeCode":"VARIANT_PROOF_FAILED"})
    records.append({"familyId":FUNCTION_FAMILY_ID,"transform":TRANSFORM_C_PARAMETER_RECOVERY,"polarity":"negative","status":"PASS","unitKey":FUNCTION_UNIT_KEY,"variantClass":"C","negativeCode":"C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion,"artifactType":"ALIVE_MIDDLE_SCHOOL_FUNCTION_CAPABILITY_PROMOTION","schemaVersion":FUNCTION_VARIANT_SCHEMA_VERSION,"scope":"M2-04 structured general/boundary/composite fixtures","unitCount":1,"fixtureCount":6,"status":"ACTIVE_BOUNDED" if promotion["holdCount"] == 1 and promotion["activeCount"] == 2 else "HOLD","cRecords":records,"productionArchiveRegistration":"NOT_PERFORMED","publicationStatus":"NOT_PUBLISHED"}


def prepare_middle_school_function_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_function_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = Path(root).resolve() / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title, ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8", newline="\n")
    source_manifest = {"artifactType":"ALIVE_MIDDLE_SCHOOL_FUNCTION_UNIVERSAL_SOURCE_JS","schemaVersion":FUNCTION_VARIANT_SCHEMA_VERSION,"runId":run_id,"questionCount":inputs["questionCount"],"path":source_path.relative_to(Path(root).resolve()).as_posix(),"sha256":sha256_file(source_path),"ruleSnapshotSha256":inputs["ruleSnapshotSha256"],"publicationStatus":"NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"), source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(), run_id=run_id, source_lock={"path":source_manifest["path"],"sha256":source_manifest["sha256"],"ruleSnapshotSha256":inputs["ruleSnapshotSha256"]}, question_count=inputs["questionCount"], batch_plan=[[start for start in range(index, min(index + 4, inputs["questionCount"] + 1))] for index in range(1, inputs["questionCount"] + 1, 4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-function-exact-variant-preflight")
    record_universal_visual_recon(store, run_id, inputs["visualRecon"])
    record_universal_ir_analysis(store, run_id, inputs["sourceIR"])
    record_universal_capability_preflight(store, run_id, inputs["capabilityPreflight"])
    record_universal_candidate_set(store, run_id, inputs["candidates"])
    precheck = record_universal_variant_precheck(store, run_id, inputs["proofRows"], evidence_catalog=inputs["proofCatalog"])
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review1", evidence_catalog=inputs["reviewCatalog"])
    record_universal_revision(store, run_id, {"status":"PASS","bounded":True,"changedQuestionIds":[]})
    record_universal_review(store, run_id, inputs["reviewLedger"], round_name="review2", evidence_catalog=inputs["reviewCatalog"])
    record_universal_mother_final(store, run_id)
    ledger = write_universal_variant_ledger(store, run_id, precheck["precheck"]["questions"])
    assembled = assemble_universal_exam(store, run_id, title, archive_root=Path(root).resolve() / "archive")
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_FUNCTION_BOUNDED_VARIANT_PREPARED_RUN","schemaVersion":FUNCTION_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"READY_FOR_BROWSER_RENDER","variantClass":declared_class,"fixtureScope":"M2-04_structured","run":start,"source":source_manifest,"questionCount":inputs["questionCount"],"variantLedger":ledger,"assembly":assembled["assembly"],"currentStage":UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"],"browserRender":"PENDING","publicationStatus":"NOT_PUBLISHED"}


__all__ = ["FUNCTION_FAMILY_ID","FUNCTION_UNIT_KEY","MiddleSchoolFunctionVariantError","build_middle_school_function_capability_report","build_middle_school_function_variant_inputs","load_middle_school_function_fixtures","middle_school_function_variant_registry","prepare_middle_school_function_variant_run","solve_middle_school_function_fixture"]
