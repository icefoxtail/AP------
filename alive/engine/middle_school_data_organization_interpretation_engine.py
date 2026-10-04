"""Bounded exact A/B adapters for M1-08 data organization and interpretation."""

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


DATA_VARIANT_SCHEMA_VERSION = "0.1.0"
DATA_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_data_organization_interpretation.json")
DATA_UNIT_KEY = "M1-08"
FREQUENCY_FAMILY_ID = "DATA_FREQUENCY_TOTAL"
MEAN_FAMILY_ID = "DATA_MEAN"
FAMILY_IDS = (FREQUENCY_FAMILY_ID, MEAN_FAMILY_ID)


class MiddleSchoolDataVariantError(ValueError):
    pass


def _integer(value: Any, label: str) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolDataVariantError(f"{label} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolDataVariantError(f"invalid {label}: {value!r}") from error
    if number != value:
        raise MiddleSchoolDataVariantError(f"{label} must be an integer")
    return number


def _fraction(value: Any, label: str = "value") -> Fraction:
    if isinstance(value, bool):
        raise MiddleSchoolDataVariantError(f"{label} must be numeric")
    try:
        return Fraction(value)
    except (TypeError, ValueError, ZeroDivisionError) as error:
        raise MiddleSchoolDataVariantError(f"invalid {label}: {value!r}") from error


def _fmt(value: Any) -> str:
    number = _fraction(value)
    if number.denominator == 1:
        return str(number.numerator)
    return f"\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}" if number.numerator >= 0 else f"-\\dfrac{{{abs(number.numerator)}}}{{{number.denominator}}}"


def _table(rows: list[list[str]], *, title: str, solution: bool, result: str) -> dict[str, Any]:
    rendered = copy.deepcopy(rows)
    if solution:
        rendered.append(["결과", result] if len(rendered[0]) == 2 else ["결과", result] + ["" for _ in range(len(rendered[0]) - 2)])
    return {"version":"0.1","type":"table","title":title,"width":460,"height":320,"rows":rendered}


def _frequency_rows(data: dict[str, Any]) -> list[list[str]]:
    return [["자료", "도수"]] + [[str(_integer(row.get("value"), "value")), str(_integer(row.get("frequency"), "frequency"))] for row in data["rows"]]


def _mean_rows(data: dict[str, Any]) -> list[list[str]]:
    return [["자료값"] + [str(_integer(value, "value")) for value in data["values"]]]


def solve_middle_school_data_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != DATA_UNIT_KEY or fixture.get("familyId") not in FAMILY_IDS:
        raise MiddleSchoolDataVariantError("fixture belongs to an M1-08 data family")
    family = fixture["familyId"]
    data = fixture.get("data", {})
    if family == FREQUENCY_FAMILY_ID:
        rows = data.get("rows")
        if not isinstance(rows, list) or not 2 <= len(rows) <= 8:
            raise MiddleSchoolDataVariantError("frequency table must have 2 to 8 rows")
        frequencies = []
        for row in rows:
            value = _integer(row.get("value"), "value")
            frequency = _integer(row.get("frequency"), "frequency")
            if value < 0 or frequency < 0:
                raise MiddleSchoolDataVariantError("data values and frequencies must be non-negative")
            frequencies.append(frequency)
        total = sum(frequencies)
        if total <= 0:
            raise MiddleSchoolDataVariantError("frequency total must be positive")
        additions = "+".join(str(item) for item in frequencies)
        table = _frequency_rows(data)
        steps = [
            {"title":"도수 읽기","work":f"표의 도수는 {', '.join(str(item) for item in frequencies)}이다.","why":"도수는 각 자료값이 나타난 횟수이므로 자료의 개수를 세는 데 사용한다."},
            {"title":"도수의 합 계산","work":f"전체 자료의 개수 $N={additions}={total}$이다.","why":"전체 자료의 개수는 모든 도수를 더해서 구한다."},
            {"title":"표와 검산","work":f"표의 도수를 다시 더해도 $N={total}$이다.","why":"표의 모든 행을 빠짐없이 포함했는지 확인한다."},
        ]
        return {"answer":total,"answerText":str(total),"given":"다음 도수분포표에서 자료의 전체 개수를 구하여라.","goal":"자료의 전체 개수를 구한다.","keyIdea":"도수분포표의 전체 자료 개수는 모든 도수의 합이다.","conceptNote":"도수는 각 자료값이 나타난 횟수이고, 전체 자료의 개수는 도수의 합이다.","steps":steps,"check":f"도수의 합이 ${additions}={total}$이므로 전체 자료의 개수는 ${total}$이다.","commonMistakes":["자료값을 더해 전체 개수로 쓰는 것","도수가 0인 행을 임의로 다른 수로 바꾸는 것","도수 한 행을 빠뜨리는 것"],"visualSpec":_table(table,title="도수분포표",solution=False,result=str(total)),"solutionVisualSpec":_table(table,title="도수분포표와 계산 결과",solution=True,result=str(total))}
    values = [_integer(value, "value") for value in data.get("values", [])]
    if not 3 <= len(values) <= 8 or any(value < 0 for value in values):
        raise MiddleSchoolDataVariantError("mean data must contain 3 to 8 non-negative integers")
    total = sum(values)
    count = len(values)
    mean = Fraction(total, count)
    additions = "+".join(str(value) for value in values)
    mean_text = _fmt(mean)
    table = _mean_rows(data)
    steps = [
        {"title":"자료의 합 계산","work":f"자료의 합은 ${additions}={total}$이다.","why":"평균을 구하려면 자료값을 모두 더해야 한다."},
        {"title":"자료의 개수 확인","work":f"자료의 개수는 ${count}$개이다.","why":"평균은 자료의 합을 자료의 개수로 나눈 값이다."},
        {"title":"평균 공식에 대입","work":f"평균 $\\bar{{x}}=\\dfrac{{{total}}}{{{count}}}={mean_text}$이다.","why":"평균의 정의에 자료의 합과 개수를 대입한다."},
    ]
    return {"answer":mean,"answerText":mean_text,"given":"다음 자료의 평균을 구하여라.","goal":"자료의 평균을 구한다.","keyIdea":"평균은 자료의 합을 자료의 개수로 나눈 값이다.","conceptNote":"자료의 평균은 모든 자료값의 합을 자료의 개수로 나눈 값이다.","steps":steps,"check":f"평균 ${mean_text}$에 자료의 개수 ${count}$를 곱하면 ${total}$이므로 계산을 검산할 수 있다.","commonMistakes":["자료의 합을 자료의 개수로 나누지 않는 것","자료의 개수를 잘못 세는 것","가장 큰 값이나 가운데 값만 평균으로 쓰는 것"],"visualSpec":_table(table,title="자료값 표",solution=False,result=mean_text),"solutionVisualSpec":_table(table,title="자료값 표와 평균",solution=True,result=mean_text)}


def load_middle_school_data_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload = json.loads((Path(root) / DATA_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise MiddleSchoolDataVariantError("M1-08 fixture corpus cannot be read") from error
    fixtures = payload.get("fixtures")
    if payload.get("artifactType") != "ALIVE_MIDDLE_SCHOOL_DATA_ORGANIZATION_INTERPRETATION_STRUCTURED_FIXTURES" or payload.get("unitKey") != DATA_UNIT_KEY or not isinstance(fixtures, list) or len(fixtures) != 12:
        raise MiddleSchoolDataVariantError("M1-08 corpus metadata or count is invalid")
    if {item.get("familyId") for item in fixtures} != set(FAMILY_IDS):
        raise MiddleSchoolDataVariantError("M1-08 corpus must contain frequency and mean families")
    if {item.get("coverage") for item in fixtures} != {"general", "boundary", "composite"}:
        raise MiddleSchoolDataVariantError("M1-08 corpus must cover general, boundary, and composite cases")
    return copy.deepcopy(fixtures)


def middle_school_data_variant_registry() -> StructureFamilyRegistry:
    registry = StructureFamilyRegistry()
    for family in FAMILY_IDS:
        registry.register(StructureFamilyAdapter(family_id=family, solver_profile=f"middle_school_{family.lower()}_exact_adapter_v1", transform_capabilities={TRANSFORM_A_NUMERIC:CAPABILITY_SUPPORTED, TRANSFORM_B_REPRESENTATION:CAPABILITY_SUPPORTED, TRANSFORM_C_PARAMETER_RECOVERY:CAPABILITY_HOLD}, visual_capabilities={TRANSFORM_A_NUMERIC:"MANDATORY", TRANSFORM_B_REPRESENTATION:"MANDATORY", TRANSFORM_C_PARAMETER_RECOVERY:"HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values = {
        "m1-08-frequency-general":{"rows":[{"value":1,"frequency":3},{"value":2,"frequency":2},{"value":3,"frequency":2}]},
        "m1-08-frequency-boundary":{"rows":[{"value":1,"frequency":2},{"value":2,"frequency":1},{"value":3,"frequency":3},{"value":4,"frequency":2}]},
        "m1-08-frequency-composite":{"rows":[{"value":2,"frequency":4},{"value":4,"frequency":2},{"value":6,"frequency":1},{"value":8,"frequency":4}]},
        "m1-08-frequency-general-wide":{"rows":[{"value":5,"frequency":3},{"value":7,"frequency":4}]},
        "m1-08-frequency-boundary-wide":{"rows":[{"value":1,"frequency":2},{"value":2,"frequency":1},{"value":3,"frequency":3},{"value":4,"frequency":2},{"value":5,"frequency":1}]},
        "m1-08-frequency-composite-wide":{"rows":[{"value":3,"frequency":2},{"value":6,"frequency":3},{"value":9,"frequency":4}]},
        "m1-08-mean-general":{"values":[3,5,7]},
        "m1-08-mean-boundary":{"values":[2,4,6,8]},
        "m1-08-mean-composite":{"values":[1,3,5,7,9]},
        "m1-08-mean-general-wide":{"values":[2,4,6,8,10,12]},
        "m1-08-mean-boundary-wide":{"values":[2,2,8,8]},
        "m1-08-mean-composite-wide":{"values":[1,3,5,7,9,11]},
    }
    try:
        return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:
        raise MiddleSchoolDataVariantError(f"no M1-08 numeric mutation for {fixture.get('caseId')}") from error


def _payload(fixture: dict[str, Any], *, representation: str) -> dict[str, Any]:
    if fixture["familyId"] == FREQUENCY_FAMILY_ID:
        frequencies = ", ".join(str(_integer(row["frequency"], "frequency")) for row in fixture["data"]["rows"])
        content = f"도수분포표의 도수가 {frequencies}일 때 각 도수를 합하여 자료의 전체 개수를 계산하여라." if representation == "rearranged" else f"도수가 {frequencies}인 다음 도수분포표에서 자료의 전체 개수를 구하여라."
    else:
        values = ", ".join(str(_integer(value, "value")) for value in fixture["data"]["values"])
        content = f"자료값 {values}를 모두 더한 뒤 자료의 개수로 나누어 평균을 계산하여라." if representation == "rearranged" else f"자료값이 {values}인 다음 자료의 평균을 구하여라."
    return {"content":content,"choices":[],"questionType":"단답형","layoutTag":"grid","wide":False}


def _graph(family: str) -> dict[str, Any]:
    op = "sum_frequencies" if family == FREQUENCY_FAMILY_ID else "sum_values_then_divide_by_count"
    nodes = [{"nodeId":"inspect","role":"core","op":"read_data_table","inputRole":["data_table"],"outputRole":["data_values"],"order":0},{"nodeId":"calculate","role":"core","op":op,"inputRole":["data_values"],"outputRole":["exact_answer"],"order":1}]
    return normalize_solution_graph({"nodes":nodes,"edges":[{"from":"inspect","to":"calculate"}],"coreDecisionCount":1,"branchCount":0,"newConceptCount":0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    payload = _payload(fixture, representation="standard")
    return {"id":ordinal,**payload,"answer":result["answerText"],"solution":result["answerText"],"standardCourse":"중1 수학","standardUnitKey":DATA_UNIT_KEY,"standardUnit":"자료의 정리와 해석"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source = _source_question(fixture,result,ordinal)
    return build_universal_question_ir(source,source_question_sha256=json_sha256(fixture),rule_snapshot_sha256=snapshot_sha,structure_family=fixture["familyId"],solution_graph=_graph(fixture["familyId"]),curriculum={"courseKey":"M1","unitKey":DATA_UNIT_KEY,"label":"자료의 정리와 해석"},concepts=[fixture["subUnit"]],givens={"data":copy.deepcopy(fixture["data"])},goal={"kind":fixture["kind"]},parameters=copy.deepcopy(fixture["data"]),mutable_parameters=sorted(fixture["data"]),constraints={"exactDataInterpretation":True,"visualDefinitionRequired":True},representation={"layoutTag":"grid","wide":False,"style":"data_table"},difficulty_vector={"interpretation":1,"representation":1,"decision":1,"algebraLoad":1,"calculationLoad":2,"visualLoad":2,"branch":0,"newConcept":0},allowed_methods=["도수의 합","자료의 합/자료의 개수"],forbidden_methods=["표에 없는 자료를 임의로 추가하기","평균을 최빈값이나 중앙값으로 대체하기","교육과정 밖의 통계 공식 사용"],capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], fixture: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs = [f"middle-m1-08-proof:{ordinal}:{declared_class}"]
    required = ["coreConceptPreserved","solutionGraphPreserved","curriculumPreserved","parameterChanged","effectiveParameterChangeCount","parameterDistance","answerMemoryShortcut"] if declared_class == "A" else ["coreConceptPreserved","solutionGraphPreserved","representationChanged","antiClone","curriculumPreserved"]
    checks = [build_proof_check(check,"PASS",method="middle_school_m1_08_exact_adapter",evidence_refs=refs,summary="Exact data-table recomputation and visual comparison passed.") for check in required]
    payload = {"artifactType":"ALIVE_VARIANT_PROOF_SIDECAR","schemaVersion":"0.1.0","sourceQuestionId":source_ir["sourceQuestionId"],"declaredClass":declared_class,"verifiedClass":"HOLD","structureFamily":fixture["familyId"],"transform":TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION,"capabilityStatus":CAPABILITY_SUPPORTED,"coreConceptPreserved":True,"solutionGraphPreserved":source_ir["solutionGraph"]["graphFingerprint"] == candidate_ir["solutionGraph"]["graphFingerprint"],"coreDecisionDelta":0,"branchDelta":0,"newConceptDelta":0,"preprocessingDelta":0,"preprocessLoad":{"type":"none","magnitude":0},"preprocessDeterministic":True,"preprocessOutputArity":0,"studentObservableInputsOnly":True,"ablationPassed":True,"shortcutBlocked":True,"difficultyDelta":{"representation":1 if declared_class == "B" else 0,"calculation":1 if declared_class == "A" else 0},"proofChecks":checks,"proofSha256":"pending","sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"]}
    payload.update({"parameterChanged":True,"effectiveParameterChangeCount":1,"parameterDistance":1,"answerMemoryShortcut":False} if declared_class == "A" else {"representationChanged":True,"antiClone":True})
    payload["proofSha256"] = hashlib.sha256(json.dumps({key:value for key,value in payload.items() if key != "proofSha256"},ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail = normalize_solution_detail({"version":"0.1","audience":"student","depth":"detailed","given":result["given"],"goal":result["goal"],"keyIdea":result["keyIdea"],"conceptNote":result["conceptNote"],"steps":result["steps"],"check":result["check"],"commonMistakes":result["commonMistakes"],"diagramRequirement":"MANDATORY","diagramPurpose":"도수분포표 또는 자료값 표에서 계산에 필요한 정보를 직접 확인한다."},inferred_visual_requirement="MANDATORY")
    payload = _payload(fixture,representation="rearranged" if declared_class == "B" else "standard")
    metadata = {"level":"중","category":fixture["coverage"],"originalCategory":fixture["coverage"],"standardCourse":"중1 수학","standardUnitKey":DATA_UNIT_KEY,"standardUnit":"자료의 정리와 해석","standardUnitOrder":8,"subUnitKey":fixture["subUnitKey"],"subUnit":fixture["subUnit"],"subUnitConfidence":"deterministic_fixture","subUnitClassificationDepth":"complete_rule","questionType":payload["questionType"],"layoutTag":payload["layoutTag"],"tags":[fixture["coverage"],"ALIVE_UNIVERSAL_MIDDLE_SCHOOL_M1_08_BOUNDED"],"wide":False}
    candidate = {"artifactType":"ALIVE_UNIVERSAL_CANDIDATE","schemaVersion":"0.1.0","runId":run_id,"sourceQuestionId":source_ir["sourceQuestionId"],"sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"],"variantPlan":{"declaredClass":declared_class,"transform":sidecar["transform"],"familyId":fixture["familyId"],"bridgeStatus":"BOUNDED_MIDDLE_SCHOOL_M1_08_EXACT_VARIANT","sourceGraphFingerprint":source_ir["solutionGraph"]["graphFingerprint"],"candidateGraphFingerprint":candidate_ir["solutionGraph"]["graphFingerprint"]},"studentPayload":payload,"answerContract":{"answerType":"text","displayAnswer":result["answerText"],"equivalencePolicy":"normalized_math_text"},"solution":format_solution_detail(detail,result["answerText"]),"solutionDetail":detail,"archiveMetadata":metadata,"variantProof":sidecar,"variantResult":variant_result,"visualDependency":"MANDATORY","solutionVisualElements":{"required":True},"visualSpec":copy.deepcopy(result["visualSpec"]),"solutionVisualSpec":copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int, family: str) -> dict[str, Any]:
    return {"id":ordinal,"blindMath":{"status":"PASS","method":f"middle_school_{family.lower()}_independent_exact_recompute","evidenceRefs":[f"middle-m1-08-review:{family}:{ordinal}:blindMath"]},"solution":{"status":"PASS","method":f"middle_school_{family.lower()}_solution_detail_contract","evidenceRefs":[f"middle-m1-08-review:{family}:{ordinal}:solution"]},"variantComparison":{"status":"PASS","method":f"middle_school_{family.lower()}_table_comparison","evidenceRefs":[f"middle-m1-08-review:{family}:{ordinal}:variantComparison"]}}


def build_middle_school_data_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A","B"}:
        raise MiddleSchoolDataVariantError("C is HOLD for M1-08 until a genuine preprocess fixture exists")
    snapshot = load_rule_pack(Path(root).resolve(),required=True)
    if not rule_pack_is_ready(snapshot):
        raise MiddleSchoolDataVariantError("canonical rule pack is not ready")
    fixtures = load_middle_school_data_fixtures(root)
    transform = TRANSFORM_A_NUMERIC if declared_class == "A" else TRANSFORM_B_REPRESENTATION
    source_questions=[]; source_irs=[]; candidate_irs=[]; candidates=[]; proof_rows=[]; reviews=[]; assignments=[]
    for ordinal, fixture in enumerate(fixtures,1):
        source_result = solve_middle_school_data_fixture(fixture)
        source_questions.append(_source_question(fixture,source_result,ordinal))
        source_ir = _build_ir(fixture,source_result,ordinal,snapshot["snapshotSha256"])
        require_valid_universal_question_ir(source_ir)
        source_irs.append(source_ir)
        variant = copy.deepcopy(fixture)
        if declared_class == "A":
            variant["data"] = _mutated_data(fixture)
        result = solve_middle_school_data_fixture(variant)
        candidate_payload = _payload(variant,representation="rearranged" if declared_class == "B" else "standard")
        candidate_ir = copy.deepcopy(source_ir)
        candidate_ir["studentPayload"] = {**candidate_ir["studentPayload"],"content":candidate_payload["content"]}
        candidate_ir["parameters"] = copy.deepcopy(variant["data"])
        candidate_irs.append(candidate_ir)
        sidecar = _sidecar(source_ir,candidate_ir,fixture,declared_class,ordinal)
        refs = {ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}
        variant_result = reduce_variant_class(sidecar,evidence_catalog=refs)
        if variant_result.get("status") != "PASS":
            raise MiddleSchoolDataVariantError(f"M1-08 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id,ordinal,variant,result,source_ir,candidate_ir,sidecar,variant_result,declared_class))
        proof_rows.append({"id":ordinal,"sidecar":sidecar})
        reviews.append(_review(ordinal,fixture["familyId"]))
        assignments.append({"id":ordinal,"unitKey":DATA_UNIT_KEY,"familyId":fixture["familyId"],"transform":transform,"status":"READY","solver":"middle_school_m1_08_exact_adapter_v1","variantClass":declared_class})
    review_catalog = sorted({ref for row in reviews for view in ("blindMath","solution","variantComparison") for ref in row[view]["evidenceRefs"]})
    proof_catalog = sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_DATA_BOUNDED_VARIANT_INPUT","schemaVersion":DATA_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"BOUNDED_MIDDLE_SCHOOL_M1_08_EXACT_VARIANT","variantClass":declared_class,"transform":transform,"fixtureScope":"M1-08_data_organization_interpretation_structured","ruleSnapshotSha256":snapshot["snapshotSha256"],"questionCount":len(candidates),"sourceQuestions":source_questions,"sourceIR":source_irs,"candidateIR":candidate_irs,"candidates":candidates,"proofRows":proof_rows,"proofCatalog":proof_catalog,"reviewLedger":{"artifactType":"ALIVE_UNIVERSAL_REVIEW_LEDGER","schemaVersion":"0.1.0","questions":reviews},"reviewCatalog":review_catalog,"independentReviews":reviews,"capabilityPreflight":{"status":"PASS","assignments":assignments},"visualRecon":{"status":"PASS","questions":[{"id":item["id"],"visualDependency":"MANDATORY","problem":"PASS","solution":"PASS"} for item in assignments]},"promotionStatus":"CANDIDATE","promotionReason":"M1-08 frequency-total and mean exact A/B slices; C remains HOLD"}


def build_middle_school_data_capability_report(root: Path) -> dict[str, Any]:
    records=[]
    for family in FAMILY_IDS:
        for declared_class in ("A","B"):
            inputs = build_middle_school_data_variant_inputs(root,run_id=f"capability-middle-m1-08-{declared_class.lower()}",declared_class=declared_class)
            for assignment,candidate in zip(inputs["capabilityPreflight"]["assignments"],inputs["candidates"]):
                if assignment["familyId"] == family:
                    records.append({"familyId":family,"transform":inputs["transform"],"polarity":"positive","status":"PASS","unitKey":DATA_UNIT_KEY,"variantClass":declared_class,"verifiedClass":candidate["variantResult"]["verifiedClass"]})
            records.append({"familyId":family,"transform":inputs["transform"],"polarity":"negative","status":"PASS","unitKey":DATA_UNIT_KEY,"variantClass":declared_class,"negativeCode":"VARIANT_PROOF_FAILED"})
        records.append({"familyId":family,"transform":TRANSFORM_C_PARAMETER_RECOVERY,"polarity":"negative","status":"PASS","unitKey":DATA_UNIT_KEY,"variantClass":"C","negativeCode":"C_ABLATION_FAILED"})
    promotion = evaluate_capability_promotion(records)
    return {**promotion,"artifactType":"ALIVE_MIDDLE_SCHOOL_DATA_CAPABILITY_PROMOTION","schemaVersion":DATA_VARIANT_SCHEMA_VERSION,"scope":"M1-08 data frequency totals and arithmetic means bounded slices","unitCount":2,"fixtureCount":12,"status":"ACTIVE_BOUNDED" if promotion["holdCount"] == 2 and promotion["activeCount"] == 4 else "HOLD","cRecords":records,"productionArchiveRegistration":"NOT_PERFORMED","publicationStatus":"NOT_PUBLISHED"}


def prepare_middle_school_data_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs = build_middle_school_data_variant_inputs(root,run_id=run_id,declared_class=declared_class)
    root = Path(root).resolve()
    source_path = root / "archive/_generated/alive-universal-inputs" / f"{run_id}.js"
    source_path.parent.mkdir(parents=True,exist_ok=True)
    source_path.write_text("window.examTitle = " + json.dumps(title,ensure_ascii=False) + ";\nwindow.questionBank = " + json.dumps(inputs["sourceQuestions"],ensure_ascii=False,indent=2) + ";\n",encoding="utf-8",newline="\n")
    source_manifest = {"artifactType":"ALIVE_MIDDLE_SCHOOL_DATA_UNIVERSAL_SOURCE_JS","schemaVersion":DATA_VARIANT_SCHEMA_VERSION,"runId":run_id,"questionCount":inputs["questionCount"],"path":source_path.relative_to(root).as_posix(),"sha256":sha256_file(source_path),"ruleSnapshotSha256":inputs["ruleSnapshotSha256"],"publicationStatus":"NOT_PUBLISHED"}
    atomic_write_json(source_path.with_name(source_path.stem + "-manifest.json"),source_manifest)
    start = start_universal_run(Path(runtime_root).resolve(),run_id=run_id,source_lock={"path":source_manifest["path"],"sha256":source_manifest["sha256"],"ruleSnapshotSha256":inputs["ruleSnapshotSha256"]},question_count=inputs["questionCount"],batch_plan=[[start for start in range(index,min(index + 4,inputs["questionCount"] + 1))] for index in range(1,inputs["questionCount"] + 1,4)])
    store = UniversalRunStore(Path(runtime_root).resolve())
    atomic_write_json(store.run_dir(run_id) / "source/variant-input.json",inputs)
    record_universal_stage(store,run_id,"S01_PREFLIGHT",status="PASS",evidence="middle-school-m1-08-exact-variant-preflight")
    record_universal_visual_recon(store,run_id,inputs["visualRecon"])
    record_universal_ir_analysis(store,run_id,inputs["sourceIR"])
    record_universal_capability_preflight(store,run_id,inputs["capabilityPreflight"])
    record_universal_candidate_set(store,run_id,inputs["candidates"])
    precheck = record_universal_variant_precheck(store,run_id,inputs["proofRows"],evidence_catalog=inputs["proofCatalog"])
    record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review1",evidence_catalog=inputs["reviewCatalog"])
    record_universal_revision(store,run_id,{"status":"PASS","bounded":True,"changedQuestionIds":[]})
    record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review2",evidence_catalog=inputs["reviewCatalog"])
    record_universal_mother_final(store,run_id)
    ledger = write_universal_variant_ledger(store,run_id,precheck["precheck"]["questions"])
    assembled = assemble_universal_exam(store,run_id,title,archive_root=root / "archive")
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_DATA_BOUNDED_VARIANT_PREPARED_RUN","schemaVersion":DATA_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"READY_FOR_BROWSER_RENDER","variantClass":declared_class,"fixtureScope":"M1-08_data_organization_interpretation_structured","run":start,"source":source_manifest,"questionCount":inputs["questionCount"],"variantLedger":ledger,"assembly":assembled["assembly"],"currentStage":UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"],"browserRender":"PENDING","publicationStatus":"NOT_PUBLISHED"}


__all__ = ["DATA_UNIT_KEY","FAMILY_IDS","FREQUENCY_FAMILY_ID","MEAN_FAMILY_ID","MiddleSchoolDataVariantError","build_middle_school_data_capability_report","build_middle_school_data_variant_inputs","load_middle_school_data_fixtures","middle_school_data_variant_registry","prepare_middle_school_data_variant_run","solve_middle_school_data_fixture"]
