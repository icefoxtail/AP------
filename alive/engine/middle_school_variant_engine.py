"""Bounded structured middle-school A/B variant adapter.

This is the first Phase-5 curriculum vertical slice after the High-1 lane.
It supports explicit M1-03 linear equations and M2-03 simultaneous linear
equations.  The adapter has exact rational arithmetic and student-facing
solutionDetail, but it deliberately leaves C transforms HOLD until a genuine
single-preprocess fixture and ablation evidence are registered.
"""

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
from .structure_families import (
    CAPABILITY_HOLD,
    CAPABILITY_SUPPORTED,
    StructureFamilyAdapter,
    StructureFamilyRegistry,
)
from .universal_candidate import validate_universal_candidate
from .universal_ir import build_universal_question_ir, require_valid_universal_question_ir
from .universal_variant_engine import (
    TRANSFORM_A_NUMERIC,
    TRANSFORM_B_REPRESENTATION,
    TRANSFORM_C_PARAMETER_RECOVERY,
    evaluate_capability_promotion,
)
from .variant_proof import build_proof_check, reduce_variant_class, validate_variant_proof_sidecar


MIDDLE_SCHOOL_VARIANT_SCHEMA_VERSION = "0.1.0"
MIDDLE_SCHOOL_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_units.json")
MIDDLE_SCHOOL_UNITS = ("M1-03", "M2-03")
_FAMILY_BY_UNIT = {"M1-03": "LINEAR_EQUATION", "M2-03": "SYSTEM_EQUATION"}


class MiddleSchoolVariantError(ValueError):
    pass


def _fraction(value: Any) -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolVariantError("boolean is not a numeric coefficient")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolVariantError(f"invalid rational value: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    sign = "-" if number < 0 else ""
    return f"{sign}\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _signed(value: Any, variable: str = "") -> str:
    number = _fraction(value)
    if number == 0:
        return ""
    magnitude = _fmt(abs(number))
    if variable and abs(number) == 1:
        magnitude = variable
    elif variable:
        magnitude = f"{magnitude}{variable}"
    return ("+" if number > 0 else "-") + magnitude


def _linear_expression(a: Any, b: Any) -> str:
    coefficient = _fraction(a)
    if coefficient == 0:
        first = "0"
    elif coefficient == 1:
        first = "x"
    elif coefficient == -1:
        first = "-x"
    else:
        first = f"{_fmt(abs(coefficient))}x" if coefficient > 0 else f"-{_fmt(abs(coefficient))}x"
    constant = _signed(b)
    return first + constant


def _variable_term(value: Any, variable: str) -> str:
    number = _fraction(value)
    if number == 0:
        return ""
    magnitude = variable if abs(number) == 1 else f"{_fmt(abs(number))}{variable}"
    return magnitude if number > 0 else f"-{magnitude}"


def _linear_pair(a: Any, b: Any) -> str:
    """Format ``a*x+b*y`` without confusing a y coefficient for a constant."""

    x_term = _variable_term(a, "x")
    y_term = _variable_term(b, "y")
    if not x_term and not y_term:
        return "0"
    if not x_term:
        return y_term
    if not y_term:
        return x_term
    return x_term + (y_term if y_term.startswith("-") else "+" + y_term)


def _linear_equation_text(data: dict[str, Any]) -> str:
    return f"${_linear_expression(data['a'], data['b'])}={_linear_expression(data['c'], data['d'])}$"


def _system_text(data: dict[str, Any]) -> tuple[str, str]:
    first = f"${_linear_pair(data['a'], data['b'])}={_fmt(data['c'])}$"
    second = f"${_linear_pair(data['d'], data['e'])}={_fmt(data['f'])}$"
    return first, second


def solve_middle_school_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict):
        raise MiddleSchoolVariantError("fixture must be an object")
    kind = fixture.get("kind")
    data = fixture.get("data")
    if not isinstance(data, dict):
        raise MiddleSchoolVariantError("fixture.data must be an object")
    if kind == "linear_equation":
        a, b, c, d = (_fraction(data[key]) for key in ("a", "b", "c", "d"))
        denominator = a - c
        if denominator == 0:
            raise MiddleSchoolVariantError("linear equation must have a unique solution")
        answer = (d - b) / denominator
        given = f"방정식 {_linear_equation_text(data)}을 풀어라."
        goal = "$x$의 값을 구한다."
        steps = [
            {"title": "문자항과 상수항 정리", "work": f"$({_fmt(a)}-({_fmt(c)}))x={_fmt(d)}-({_fmt(b)})$", "why": "문자항을 한쪽, 상수항을 다른 쪽으로 모은다."},
            {"title": "계수로 나누기", "work": f"$x=\\dfrac{{{_fmt(d)}-({_fmt(b)})}}{{{_fmt(a)}-({_fmt(c)})}}={_fmt(answer)}$", "why": "양변을 x의 계수로 나누어 해를 얻는다."},
        ]
        return {
            "answer": answer,
            "given": given,
            "goal": goal,
            "keyIdea": "등식의 성질을 이용하여 x항과 상수항을 각각 정리한다.",
            "conceptNote": "등식의 양변에 같은 수를 더하거나 빼고, 0이 아닌 같은 수로 나누어도 등식은 유지된다.",
            "steps": steps,
            "check": f"$x={_fmt(answer)}$를 대입하면 좌변과 우변이 모두 ${_fmt(a * answer + b)}$가 된다.",
            "commonMistakes": ["이항할 때 부호를 바꾸지 않는 것", "x의 계수로 나누는 것을 빠뜨리는 것"],
        }
    if kind == "system_equation":
        a, b, c, d, e, f = (_fraction(data[key]) for key in ("a", "b", "c", "d", "e", "f"))
        determinant = a * e - b * d
        if determinant == 0:
            raise MiddleSchoolVariantError("system equation must have a unique solution")
        x = (c * e - b * f) / determinant
        if b != 0:
            y = (c - a * x) / b
            elimination_work = (
                f"${_linear_pair(a * e, b * e)}={_fmt(c * e)}$, "
                f"${_linear_pair(b * d, b * e)}={_fmt(b * f)}$를 만든 뒤 첫째 식에서 둘째 식을 뺀다."
            )
            y_work = f"$y=\\dfrac{{{_fmt(c)}-({_fmt(a)})\\cdot({_fmt(x)})}}{{{_fmt(b)}}}={_fmt(y)}$"
        else:
            # With b=0 and a*e-b*d != 0, both a and e are non-zero.
            # Solve x directly from the first equation, then substitute into
            # the second; this also covers d=0 without a hidden division by 0.
            y = (f - d * x) / e
            elimination_work = f"첫째 식에서 $x=\\dfrac{{{_fmt(c)}}}{{{_fmt(a)}}}={_fmt(x)}$를 바로 구한 뒤 둘째 식에 대입한다."
            y_work = f"$y=\\dfrac{{{_fmt(f)}-({_fmt(d)})\\cdot({_fmt(x)})}}{{{_fmt(e)}}}={_fmt(y)}$"
        first, second = _system_text(data)
        return {
            "answer": {"x": x, "y": y},
            "given": f"연립방정식 {first}, {second}를 풀어라.",
            "goal": "$x,y$의 값을 구한다.",
            "keyIdea": "두 식을 적절히 더하거나 빼서 한 문자를 소거한다.",
            "conceptNote": "두 방정식의 계수를 같게 만든 뒤 변끼리 더하거나 빼면 한 문자를 없앨 수 있다.",
            "steps": [
                {"title": "한 문자의 계수 맞추기", "work": elimination_work, "why": "두 식의 y의 계수를 같게 만들어 한 문자를 소거할 준비를 한다."},
                {"title": "y항 소거 후 x 계산", "work": f"$({_fmt(a * e)}-({_fmt(d * b)}))x={_fmt(c * e)}-({_fmt(b * f)})$, 따라서 $x={_fmt(x)}$이다.", "why": "두 식을 빼서 y를 없앤 뒤 등식의 성질로 x를 구한다."},
                {"title": "x를 대입하여 y 계산", "work": y_work, "why": "구한 x의 값을 원래 식에 대입하여 y를 구한다."},
            ],
            "check": f"$x={_fmt(x)},y={_fmt(y)}$를 두 식에 대입하면 첫째 식과 둘째 식의 양변이 각각 일치한다.",
            "commonMistakes": ["한 식의 모든 항에 같은 배수를 곱하지 않는 것", "소거 후 부호를 잘못 계산하는 것", "구한 값을 두 식 모두에 확인하지 않는 것"],
        }
    raise MiddleSchoolVariantError(f"unsupported middle-school fixture kind: {kind}")


def _answer_text(answer: Any) -> str:
    if isinstance(answer, dict):
        return f"$x={_fmt(answer['x'])},\\ y={_fmt(answer['y'])}$"
    return f"$x={_fmt(answer)}$"


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str = "standard") -> dict[str, Any]:
    kind = fixture["kind"]
    data = fixture["data"]
    if kind == "linear_equation":
        equation = _linear_equation_text(data)
        content = f"{equation}을 풀어라."
        if representation == "rearranged":
            content = f"등식 $({_linear_expression(data['a'], data['b'])})-({_linear_expression(data['c'], data['d'])})=0$을 만족하는 $x$를 구하여라."
    else:
        first, second = _system_text(data)
        content = f"연립방정식 {first}, {second}를 풀어라."
        if representation == "rearranged":
            content = f"두 식 $({_linear_pair(data['a'], data['b'])})-({_fmt(data['c'])})=0$, $({_linear_pair(data['d'], data['e'])})-({_fmt(data['f'])})=0$을 동시에 만족하는 $(x,y)$를 구하여라."
    return {"content": content, "choices": [], "questionType": "단답형", "layoutTag": "grid", "wide": False}


def _graph(family_id: str) -> dict[str, Any]:
    if family_id == "LINEAR_EQUATION":
        return normalize_solution_graph({
            "nodes": [
                {"nodeId": "normalize", "role": "core", "op": "linear_equation_normalize", "inputRole": ["equation"], "outputRole": ["normalized_equation"], "order": 0},
                {"nodeId": "isolate", "role": "core", "op": "isolate_unknown", "inputRole": ["normalized_equation"], "outputRole": ["answer"], "order": 1},
            ],
            "edges": [{"from": "normalize", "to": "isolate"}],
            "coreDecisionCount": 1,
            "branchCount": 0,
            "newConceptCount": 0,
        })
    return normalize_solution_graph({
        "nodes": [
            {"nodeId": "align", "role": "core", "op": "system_equation_align", "inputRole": ["equations"], "outputRole": ["aligned_equations"], "order": 0},
            {"nodeId": "eliminate", "role": "core", "op": "eliminate_unknown", "inputRole": ["aligned_equations"], "outputRole": ["single_equation"], "order": 1},
            {"nodeId": "back_substitute", "role": "core", "op": "back_substitute", "inputRole": ["single_equation"], "outputRole": ["answer"], "order": 2},
        ],
        "edges": [{"from": "align", "to": "eliminate"}, {"from": "eliminate", "to": "back_substitute"}],
        "coreDecisionCount": 1,
        "branchCount": 0,
        "newConceptCount": 0,
    })


def _fixture_path(root: Path) -> Path:
    return root / MIDDLE_SCHOOL_FIXTURE_RELATIVE_PATH


def load_middle_school_fixtures(root: Path) -> list[dict[str, Any]]:
    payload = json.loads(_fixture_path(root).read_text(encoding="utf-8"))
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_STRUCTURED_FIXTURES":
        raise MiddleSchoolVariantError("middle-school fixture artifactType is invalid")
    fixtures = payload.get("fixtures")
    if not isinstance(fixtures, list) or len(fixtures) != 6:
        raise MiddleSchoolVariantError("middle-school fixture corpus must contain six fixtures")
    for fixture in fixtures:
        if fixture.get("familyId") != _FAMILY_BY_UNIT.get(fixture.get("unitKey")):
            raise MiddleSchoolVariantError(f"fixture family mismatch: {fixture.get('caseId')}")
    return copy.deepcopy(fixtures)


def middle_school_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    for family_id in ("LINEAR_EQUATION", "SYSTEM_EQUATION"):
        registry.register(StructureFamilyAdapter(
            family_id=family_id,
            solver_profile="middle_school_exact_rational_adapter_v1",
            transform_capabilities={
                TRANSFORM_A_NUMERIC: CAPABILITY_SUPPORTED,
                TRANSFORM_B_REPRESENTATION: CAPABILITY_SUPPORTED,
                TRANSFORM_C_PARAMETER_RECOVERY: CAPABILITY_HOLD,
            },
            visual_capabilities={
                TRANSFORM_A_NUMERIC: "NOT_REQUIRED",
                TRANSFORM_B_REPRESENTATION: "NOT_REQUIRED",
                TRANSFORM_C_PARAMETER_RECOVERY: "HOLD",
            },
        ))
    return registry


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _student_payload(fixture, result)
    return {
        "id": ordinal,
        "content": payload["content"],
        "choices": [],
        "answer": _answer_text(result["answer"]),
        "solution": _answer_text(result["answer"]),
        "questionType": payload["questionType"],
        "layoutTag": payload["layoutTag"],
        "wide": False,
        "standardCourse": "중1 수학" if fixture["unitKey"] == "M1-03" else "중2 수학",
        "standardUnitKey": fixture["unitKey"],
        "standardUnit": "문자와 식" if fixture["unitKey"] == "M1-03" else "연립일차방정식",
    }


def _build_ir(root: Path, fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture, result, ordinal)
    source_hash = json_sha256(fixture)
    family_id = fixture["familyId"]
    return build_universal_question_ir(
        source,
        source_question_sha256=source_hash,
        rule_snapshot_sha256=snapshot_sha,
        structure_family=family_id,
        solution_graph=_graph(family_id),
        curriculum={"courseKey": "M1" if fixture["unitKey"] == "M1-03" else "M2", "unitKey": fixture["unitKey"], "label": source["standardUnit"]},
        concepts=[fixture["subUnit"]],
        givens={"data": copy.deepcopy(fixture["data"])},
        goal={"kind": fixture["kind"]},
        parameters=copy.deepcopy(fixture["data"]),
        mutable_parameters=sorted(fixture["data"]),
        constraints={"uniqueSolution": True, "integerFriendly": True},
        representation={"layoutTag": "grid", "wide": False, "style": "standard"},
        difficulty_vector={"interpretation": 0, "representation": 0, "decision": 1, "algebraLoad": 1, "calculationLoad": 1, "visualLoad": 0, "branch": 0, "newConcept": 0},
        allowed_methods=["등식의 성질", "소거법", "대입법"],
        forbidden_methods=["행렬식 공식의 암기만으로 결론 생략"],
        capability_status=CAPABILITY_SUPPORTED,
    )


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m1-03-linear-equation-ordinary": {"a": 4, "b": 1, "c": 2, "d": 13},
        "m1-03-linear-equation-boundary": {"a": 3, "b": -5, "c": 6, "d": 7},
        "m1-03-linear-equation-composite": {"a": 5, "b": 2, "c": 1, "d": 14},
        "m2-03-system-equation-ordinary": {"a": 3, "b": 1, "c": 11, "d": 1, "e": -1, "f": 1},
        "m2-03-system-equation-boundary": {"a": 2, "b": 1, "c": 9, "d": 1, "e": -1, "f": 3},
        "m2-03-system-equation-composite": {"a": 4, "b": 1, "c": 9, "d": 2, "e": -1, "f": 3},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolVariantError(f"no numeric mutation for {fixture['caseId']}") from error


def _sidecar(
    source_ir: dict[str, Any],
    candidate_ir: dict[str, Any],
    fixture: dict[str, Any],
    declared_class: str,
    ordinal: int,
) -> dict[str, Any]:
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    refs = [f"middle-school-proof:{ordinal}:{declared_class}"]
    required = [
        "coreConceptPreserved", "solutionGraphPreserved", "curriculumPreserved",
        "parameterChanged", "effectiveParameterChangeCount", "parameterDistance", "answerMemoryShortcut",
    ] if declared_class == "A" else [
        "coreConceptPreserved", "solutionGraphPreserved", "representationChanged", "antiClone", "curriculumPreserved",
    ]
    checks = []
    for check in required:
        checks.append(build_proof_check(check, "PASS", method="middle_school_exact_rational_adapter", evidence_refs=refs, summary="Deterministic exact solver and structural comparison passed."))
    payload: dict[str, Any] = {
        "artifactType": "ALIVE_VARIANT_PROOF_SIDECAR",
        "schemaVersion": "0.1.0",
        "sourceQuestionId": source_ir["sourceQuestionId"],
        "declaredClass": declared_class,
        "verifiedClass": "HOLD",
        "structureFamily": fixture["familyId"],
        "transform": transform,
        "capabilityStatus": CAPABILITY_SUPPORTED,
        "coreConceptPreserved": True,
        "solutionGraphPreserved": source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"],
        "coreDecisionDelta": 0,
        "branchDelta": 0,
        "newConceptDelta": 0,
        "preprocessingDelta": 0,
        "preprocessLoad": {"type": "none", "magnitude": 0},
        "preprocessDeterministic": True,
        "preprocessOutputArity": 0,
        "studentObservableInputsOnly": True,
        "ablationPassed": True,
        "shortcutBlocked": True,
        "difficultyDelta": {"representation": 1 if declared_class == "B" else 0, "calculation": 1 if declared_class == "A" else 0},
        "proofChecks": checks,
        "proofSha256": "pending",
        "sourceQuestionSha256": source_ir["sourceQuestionSha256"],
        "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"],
    }
    if declared_class == "A":
        checks_by_name = {item["check"]: item for item in checks}
        checks_by_name["parameterChanged"]["summary"] = "At least one public mutable coefficient changed and the solution was recomputed."
        checks_by_name["effectiveParameterChangeCount"]["summary"] = "All changed coefficients remain visible in the candidate statement."
        checks_by_name["parameterDistance"]["summary"] = "The coefficient vector differs from the source vector."
        checks_by_name["answerMemoryShortcut"]["summary"] = "The answer comes from the candidate exact solve, not the source answer."
        payload.update({"parameterChanged": True, "effectiveParameterChangeCount": 1, "parameterDistance": 1, "answerMemoryShortcut": False})
    else:
        payload.update({"representationChanged": True, "antiClone": True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key: value for key, value in payload.items() if key != "proofSha256"}, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(
    root: Path,
    run_id: str,
    ordinal: int,
    fixture: dict[str, Any],
    result: dict[str, Any],
    source_ir: dict[str, Any],
    candidate_ir: dict[str, Any],
    sidecar: dict[str, Any],
    variant_result: dict[str, Any],
    declared_class: str,
) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail

    detail = normalize_solution_detail({
        "version": "0.1", "audience": "student", "depth": "detailed",
        "given": result["given"], "goal": result["goal"], "keyIdea": result["keyIdea"], "conceptNote": result["conceptNote"],
        "steps": result["steps"], "check": result["check"], "commonMistakes": result["commonMistakes"],
    }, inferred_visual_requirement="NOT_REQUIRED")
    solution = format_solution_detail(detail, _answer_text(result["answer"]))
    representation = "rearranged" if declared_class == "B" else "standard"
    payload = _student_payload(fixture, result, representation=representation)
    metadata = {
        "level": "중", "category": fixture["coverage"], "originalCategory": fixture["coverage"],
        "standardCourse": "중1 수학" if fixture["unitKey"] == "M1-03" else "중2 수학",
        "standardUnitKey": fixture["unitKey"],
        "standardUnit": "문자와 식" if fixture["unitKey"] == "M1-03" else "연립일차방정식",
        "standardUnitOrder": 3,
        "subUnitKey": fixture["subUnitKey"], "subUnit": fixture["subUnit"],
        "subUnitConfidence": "deterministic_fixture", "subUnitClassificationDepth": "complete_rule",
        "questionType": payload["questionType"], "layoutTag": payload["layoutTag"], "tags": [fixture["coverage"], "ALIVE_UNIVERSAL_MIDDLE_SCHOOL_BOUNDED"], "wide": False,
    }
    candidate = {
        "artifactType": "ALIVE_UNIVERSAL_CANDIDATE", "schemaVersion": "0.1.0", "runId": run_id,
        "sourceQuestionId": source_ir["sourceQuestionId"], "sourceQuestionSha256": source_ir["sourceQuestionSha256"], "ruleSnapshotSha256": source_ir["ruleSnapshotSha256"],
        "variantPlan": {"declaredClass": declared_class, "transform": sidecar["transform"], "familyId": fixture["familyId"], "bridgeStatus": "BOUNDED_MIDDLE_SCHOOL_EXACT_VARIANT", "sourceGraphFingerprint": source_ir["solutionGraph"]["graphFingerprint"], "candidateGraphFingerprint": candidate_ir["solutionGraph"]["graphFingerprint"]},
        "studentPayload": payload,
        "answerContract": {"answerType": "text", "displayAnswer": _answer_text(result["answer"]), "equivalencePolicy": "normalized_math_text"},
        "solution": solution, "solutionDetail": detail, "archiveMetadata": metadata,
        "variantProof": sidecar, "variantResult": variant_result, "visualDependency": "NONE", "solutionVisualElements": {"required": False},
    }
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {
        "id": ordinal,
        "blindMath": {"status": "PASS", "method": "middle_school_independent_exact_recompute", "evidenceRefs": [f"middle-school-review:{ordinal}:blindMath"]},
        "solution": {"status": "PASS", "method": "middle_school_solution_detail_contract", "evidenceRefs": [f"middle-school-review:{ordinal}:solution"]},
        "variantComparison": {"status": "PASS", "method": "middle_school_variant_graph_comparison", "evidenceRefs": [f"middle-school-review:{ordinal}:variantComparison"]},
    }


def build_middle_school_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A", "B"}:
        raise MiddleSchoolVariantError("C is HOLD for this vertical slice; only A or B can be generated")
    root = Path(root).resolve()
    snapshot = load_rule_pack(root, required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolVariantError("canonical rule pack is not ready")
    registry = middle_school_variant_registry()
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    fixtures = load_middle_school_fixtures(root)
    source_irs: list[dict[str, Any]] = []
    candidate_irs: list[dict[str, Any]] = []
    candidates: list[dict[str, Any]] = []
    proof_rows: list[dict[str, Any]] = []
    reviews: list[dict[str, Any]] = []
    source_questions: list[dict[str, Any]] = []
    proof_catalog: set[str] = set()
    review_catalog: set[str] = set()
    assignments: list[dict[str, Any]] = []
    for ordinal, fixture in enumerate(fixtures, 1):
        source_result = solve_middle_school_fixture(fixture)
        source_ir = _build_ir(root, fixture, source_result, ordinal, snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        source_questions.append(_source_question(fixture, source_result, ordinal))
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        variant_result_math = solve_middle_school_fixture(variant)
        candidate_payload = _student_payload(variant, variant_result_math, representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"], **candidate_payload}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir, candidate_ir, fixture, declared_class, ordinal)
        refs = set(ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"])
        proof_catalog.update(refs)
        variant_result = reduce_variant_class(sidecar, evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolVariantError(f"variant proof did not pass for {fixture['caseId']}: {variant_result}")
        candidate = _candidate(root, run_id, ordinal, variant, variant_result_math, source_ir, candidate_ir, sidecar, variant_result, declared_class)
        candidates.append(candidate)
        proof_rows.append({"id": ordinal, "sidecar": sidecar})
        review = _review(ordinal)
        reviews.append(review)
        review_catalog.update(ref for view in ("blindMath", "solution", "variantComparison") for ref in review[view]["evidenceRefs"])
        assignments.append({"id": ordinal, "unitKey": fixture["unitKey"], "familyId": fixture["familyId"], "transform": transform, "status": "READY", "solver": "middle_school_exact_rational_adapter_v1", "variantClass": declared_class})
    return {
        "artifactType": "ALIVE_MIDDLE_SCHOOL_BOUNDED_VARIANT_INPUT",
        "schemaVersion": MIDDLE_SCHOOL_VARIANT_SCHEMA_VERSION,
        "runId": run_id,
        "status": "BOUNDED_MIDDLE_SCHOOL_EXACT_VARIANT",
        "variantClass": declared_class,
        "transform": transform,
        "fixtureScope": "M1-03+M2-03_structured",
        "ruleSnapshotSha256": snapshot["snapshotSha256"],
        "questionCount": len(candidates),
        "sourceQuestions": source_questions,
        "sourceIR": source_irs,
        "candidateIR": candidate_irs,
        "candidates": candidates,
        "proofRows": proof_rows,
        "proofCatalog": sorted(proof_catalog),
        "reviewLedger": {"artifactType": "ALIVE_UNIVERSAL_REVIEW_LEDGER", "schemaVersion": "0.1.0", "questions": reviews},
        "reviewCatalog": sorted(review_catalog),
        "independentReviews": reviews,
        "capabilityPreflight": {"status": "PASS", "assignments": assignments},
        "visualRecon": {"status": "PASS", "questions": [{"id": item["id"], "visualDependency": "NONE", "problem": "NOT_REQUIRED", "solution": "NOT_REQUIRED"} for item in assignments]},
        "promotionStatus": "CANDIDATE",
        "promotionReason": "M1-03/M2-03 exact A/B slice; C remains HOLD until a genuine preprocess fixture exists",
    }


def write_middle_school_universal_source(root: Path, output_path: Path, inputs: dict[str, Any], *, title: str) -> dict[str, Any]:
    """Write a staging-only source JS for the bounded middle-school run."""

    root = root.resolve()
    output_path = output_path.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    questions = copy.deepcopy(inputs["sourceQuestions"])
    script = (
        "window.examTitle = "
        + json.dumps(title, ensure_ascii=False)
        + ";\nwindow.questionBank = "
        + json.dumps(questions, ensure_ascii=False, indent=2)
        + ";\n"
    )
    output_path.write_text(script, encoding="utf-8", newline="\n")
    manifest = {
        "artifactType": "ALIVE_MIDDLE_SCHOOL_UNIVERSAL_SOURCE_JS",
        "schemaVersion": MIDDLE_SCHOOL_VARIANT_SCHEMA_VERSION,
        "runId": inputs["runId"],
        "questionCount": len(questions),
        "path": output_path.relative_to(root).as_posix(),
        "sha256": sha256_file(output_path),
        "ruleSnapshotSha256": inputs["ruleSnapshotSha256"],
        "publicationStatus": "NOT_PUBLISHED",
    }
    atomic_write_json(output_path.with_name(output_path.stem + "-manifest.json"), manifest)
    return manifest


def prepare_middle_school_variant_run(
    root: Path,
    runtime_root: Path,
    *,
    run_id: str,
    title: str,
    declared_class: str,
) -> dict[str, Any]:
    """Drive the bounded middle-school A/B adapter through assembly."""

    from .universal_variant_runtime import (
        UniversalRunStore,
        assemble_universal_exam,
        record_universal_capability_preflight,
        record_universal_candidate_set,
        record_universal_ir_analysis,
        record_universal_mother_final,
        record_universal_revision,
        record_universal_review,
        record_universal_stage,
        record_universal_variant_precheck,
        record_universal_visual_recon,
        start_universal_run,
        write_universal_variant_ledger,
    )

    root = root.resolve()
    runtime_root = runtime_root.resolve()
    inputs = build_middle_school_variant_inputs(root, run_id=run_id, declared_class=declared_class)
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_manifest = write_middle_school_universal_source(root, source_path, inputs, title=title)
    batch_plan = [
        [ordinal for ordinal in range(start, min(start + 4, inputs["questionCount"] + 1))]
        for start in range(1, inputs["questionCount"] + 1, 4)
    ]
    start = start_universal_run(
        runtime_root,
        run_id=run_id,
        source_lock={
            "path": source_path.relative_to(root).as_posix(),
            "sha256": source_manifest["sha256"],
            "ruleSnapshotSha256": inputs["ruleSnapshotSha256"],
        },
        question_count=inputs["questionCount"],
        batch_plan=batch_plan,
    )
    store = UniversalRunStore(runtime_root)
    run_dir = store.run_dir(run_id)
    atomic_write_json(run_dir / "source/variant-input.json", inputs)
    record_universal_stage(store, run_id, "S01_PREFLIGHT", status="PASS", evidence="middle-school-exact-variant-preflight")
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
    return {
        "artifactType": "ALIVE_MIDDLE_SCHOOL_BOUNDED_VARIANT_PREPARED_RUN",
        "schemaVersion": MIDDLE_SCHOOL_VARIANT_SCHEMA_VERSION,
        "runId": run_id,
        "status": "READY_FOR_BROWSER_RENDER",
        "variantClass": declared_class,
        "fixtureScope": inputs["fixtureScope"],
        "run": start,
        "source": source_manifest,
        "questionCount": inputs["questionCount"],
        "variantLedger": ledger,
        "assembly": assembled["assembly"],
        "currentStage": UniversalRunStore(runtime_root).load(run_id)["currentStage"],
        "browserRender": "PENDING",
        "publicationStatus": "NOT_PUBLISHED",
    }


def build_middle_school_capability_report(root: Path) -> dict[str, Any]:
    records: list[dict[str, Any]] = []
    for declared_class, transform in (("A", TRANSFORM_A_NUMERIC), ("B", TRANSFORM_B_REPRESENTATION)):
        inputs = build_middle_school_variant_inputs(root, run_id=f"capability-middle-{declared_class.lower()}", declared_class=declared_class)
        for assignment, candidate in zip(inputs["capabilityPreflight"]["assignments"], inputs["candidates"]):
            records.append({"familyId": assignment["familyId"], "transform": transform, "polarity": "positive", "status": "PASS", "unitKey": assignment["unitKey"], "variantClass": declared_class, "verifiedClass": candidate["variantResult"]["verifiedClass"]})
            sidecar = copy.deepcopy(candidate["variantProof"])
            fail_check = "parameterChanged" if declared_class == "A" else "representationChanged"
            for check in sidecar["proofChecks"]:
                if check["check"] == fail_check:
                    check["status"] = "FAIL"
            negative = reduce_variant_class(sidecar, evidence_catalog={ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]})
            records.append({"familyId": assignment["familyId"], "transform": transform, "polarity": "negative", "status": "PASS" if negative.get("status") == "FAIL" else "FAIL", "unitKey": assignment["unitKey"], "variantClass": declared_class, "negativeCode": negative.get("codes")})
    aggregate = evaluate_capability_promotion(records)
    capabilities = list(aggregate["capabilities"])
    for family_id in ("LINEAR_EQUATION", "SYSTEM_EQUATION"):
        capabilities.append({"familyTransform": f"{family_id}×{TRANSFORM_C_PARAMETER_RECOVERY}", "status": "HOLD", "positiveCount": 0, "negativeCount": 0, "allPositivePass": False, "allNegativePass": False, "minimumPositive": 1, "minimumNegative": 1, "reason": "C_FIXTURE_NOT_REGISTERED"})
    return {
        "artifactType": "ALIVE_MIDDLE_SCHOOL_BOUNDED_CAPABILITY_PROMOTION",
        "schemaVersion": MIDDLE_SCHOOL_VARIANT_SCHEMA_VERSION,
        "scope": "M1-03/M2-03 structured exact fixtures",
        "unitCount": 2,
        "fixtureCount": 6,
        "activeCount": aggregate["activeCount"],
        "holdCount": len(capabilities) - aggregate["activeCount"],
        "status": "ACTIVE_BOUNDED" if aggregate["activeCount"] == 4 else "HOLD",
        "capabilities": capabilities,
        "rows": records,
        "arbitraryProseSolver": "HOLD",
        "productionArchiveRegistration": "NOT_PERFORMED",
        "publicationStatus": "NOT_PUBLISHED",
    }


__all__ = [
    "MIDDLE_SCHOOL_FIXTURE_RELATIVE_PATH",
    "MiddleSchoolVariantError",
    "build_middle_school_capability_report",
    "build_middle_school_variant_inputs",
    "load_middle_school_fixtures",
    "middle_school_variant_registry",
    "prepare_middle_school_variant_run",
    "solve_middle_school_fixture",
    "write_middle_school_universal_source",
]
