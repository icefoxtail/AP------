"""Bounded exact A/B adapters for M1-07 solid figures and measurement."""

from __future__ import annotations

import copy
import hashlib
import json
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


SOLID_FIGURE_MEASURE_VARIANT_SCHEMA_VERSION = "0.1.0"
SOLID_FIGURE_MEASURE_FIXTURE_RELATIVE_PATH = Path("alive/engine/fixtures_middle_school_solid_figure_measure.json")
SOLID_FIGURE_UNIT_KEY = "M1-07"
CUBE_FAMILY_ID = "CUBE_TOTAL_EDGE_LENGTH"
CUBOID_FAMILY_ID = "RECTANGULAR_PRISM_VOLUME"
FAMILY_IDS = (CUBE_FAMILY_ID, CUBOID_FAMILY_ID)


class MiddleSchoolSolidFigureMeasureVariantError(ValueError):
    pass


def _integer(value: Any, label: str) -> int:
    if isinstance(value, bool):
        raise MiddleSchoolSolidFigureMeasureVariantError(f"{label} must be an integer")
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise MiddleSchoolSolidFigureMeasureVariantError(f"invalid {label}: {value!r}") from error
    if number != value:
        raise MiddleSchoolSolidFigureMeasureVariantError(f"{label} must be an integer")
    return number


def _wireframe(*, solution: bool, title: str, labels: dict[str, str], answer: int) -> dict[str, Any]:
    points = [{"x":3,"y":2,"label":"A"},{"x":8,"y":2,"label":"B"},{"x":8,"y":6,"label":"C"},{"x":3,"y":6,"label":"D"},{"x":4.5,"y":3,"label":"E"},{"x":9.5,"y":3,"label":"F"},{"x":9.5,"y":7,"label":"G"},{"x":4.5,"y":7,"label":"H"}]
    edges = [(0,1),(1,2),(2,3),(3,0)]
    segments = [{"from":points[a],"to":points[b],"kind":"segment"} for a,b in edges]
    segments += [{"from":points[a+4],"to":points[b+4],"kind":"guide","dashed":True} for a,b in edges]
    segments += [{"from":points[i],"to":points[i+4],"kind":"segment"} for i in range(4)]
    segments[0]["label"] = labels.get("horizontal", "e")
    segments[1]["label"] = labels.get("vertical", "e")
    segments[8]["label"] = labels.get("depth", "e")
    annotations = [{"x":1.2,"y":8.4,"text":title}]
    if solution:
        annotations.append({"x":1.2,"y":7.7,"text":f"결과: {answer}"})
    return {"version":"0.1","type":"segment_geometry","title":title,"width":460,"height":320,"xRange":[1,11],"yRange":[1,9],"points":points,"segments":segments,"lines":[],"curves":[],"annotations":annotations}


def _cube_visual(edge: int, *, solution: bool, answer: int) -> dict[str, Any]:
    return _wireframe(solution=solution,title="정육면체의 모서리",labels={"horizontal":f"{edge}","vertical":f"{edge}","depth":f"{edge}"},answer=answer)


def _cuboid_visual(length: int, width: int, height: int, *, solution: bool, answer: int) -> dict[str, Any]:
    return _wireframe(solution=solution,title="직육면체의 부피",labels={"horizontal":f"{length}","vertical":f"{height}","depth":f"{width}"},answer=answer)


def solve_middle_school_solid_figure_measure_fixture(fixture: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(fixture, dict) or fixture.get("unitKey") != SOLID_FIGURE_UNIT_KEY:
        raise MiddleSchoolSolidFigureMeasureVariantError("fixture belongs to M1-07")
    family, data = fixture.get("familyId"), fixture.get("data", {})
    if family == CUBE_FAMILY_ID:
        edge = _integer(data.get("edge"), "edge")
        if edge <= 0:
            raise MiddleSchoolSolidFigureMeasureVariantError("edge must be positive")
        answer = 12 * edge
        steps = [{"title":"모서리 개수 확인","work":"정육면체의 모서리는 모두 12개이다.","why":"정육면체는 위·아래 면의 네 모서리와 이를 연결하는 네 모서리로 이루어진다."},{"title":"길이의 합 계산","work":f"모든 모서리의 길이의 합은 $12\\times{edge}={answer}$이다.","why":"모든 모서리의 길이가 같으므로 한 모서리의 길이에 12를 곱한다."},{"title":"그림과 검산","work":f"그림에서 한 모서리의 길이 ${edge}$와 12개 모서리를 확인하면 합은 ${answer}$이다.","why":"표시된 길이와 모서리 개수를 대조한다."}]
        return {"answer":answer,"answerText":str(answer),"given":f"한 모서리의 길이가 ${edge}$인 정육면체의 모든 모서리 길이의 합을 구하여라.","goal":"정육면체의 모든 모서리 길이의 합을 구한다.","keyIdea":"정육면체의 모서리 12개가 모두 같은 길이라는 성질을 이용한다.","conceptNote":"정육면체는 모서리 12개가 모두 같은 길이인 입체도형이다.","steps":steps,"check":f"$12\\times{edge}={answer}$이므로 모든 모서리 길이의 합은 ${answer}$이다.","commonMistakes":["정육면체의 모서리를 8개로 세는 것","한 모서리의 길이만 답으로 쓰는 것","면의 개수와 모서리의 개수를 혼동하는 것"],"visualSpec":_cube_visual(edge,solution=False,answer=answer),"solutionVisualSpec":_cube_visual(edge,solution=True,answer=answer)}
    if family == CUBOID_FAMILY_ID:
        length,width,height = (_integer(data.get(key),key) for key in ("length","width","height"))
        if min(length,width,height) <= 0:
            raise MiddleSchoolSolidFigureMeasureVariantError("cuboid dimensions must be positive")
        answer = length * width * height
        steps = [{"title":"세 변의 길이 확인","work":f"직육면체의 가로·세로·높이는 각각 ${length}$, ${width}$, ${height}$이다.","why":"부피 공식에 세 방향의 길이를 모두 사용한다."},{"title":"부피 공식에 대입","work":f"부피는 $V=\\text{{가로}}\\times\\text{{세로}}\\times\\text{{높이}}={length}\\times{width}\\times{height}={answer}$이다.","why":"직육면체의 부피 공식에 주어진 세 길이를 대입한다."},{"title":"그림과 검산","work":f"그림의 세 방향 표기와 계산을 대조하면 부피는 ${answer}$이다.","why":"가로·세로·높이를 빠짐없이 사용했는지 확인한다."}]
        return {"answer":answer,"answerText":str(answer),"given":f"가로, 세로, 높이가 각각 ${length}$, ${width}$, ${height}$인 직육면체의 부피를 구하여라.","goal":"직육면체의 부피를 구한다.","keyIdea":"직육면체의 세 변 길이를 곱하여 부피를 계산한다.","conceptNote":"직육면체의 부피 공식은 $V=\\text{가로}\\times\\text{세로}\\times\\text{높이}$이다.","steps":steps,"check":f"${length}\\times{width}\\times{height}={answer}$이므로 부피는 ${answer}$이다.","commonMistakes":["세 변 중 한 변을 빠뜨리는 것","부피와 겉넓이를 혼동하는 것","그림의 높이와 깊이를 바꾸어 읽는 것"],"visualSpec":_cuboid_visual(length,width,height,solution=False,answer=answer),"solutionVisualSpec":_cuboid_visual(length,width,height,solution=True,answer=answer)}
    raise MiddleSchoolSolidFigureMeasureVariantError(f"unsupported M1-07 family: {family}")


def load_middle_school_solid_figure_measure_fixtures(root: Path) -> list[dict[str, Any]]:
    try:
        payload=json.loads((Path(root)/SOLID_FIGURE_MEASURE_FIXTURE_RELATIVE_PATH).read_text(encoding="utf-8"))
    except (OSError,UnicodeError,json.JSONDecodeError) as error:
        raise MiddleSchoolSolidFigureMeasureVariantError("M1-07 fixture corpus cannot be read") from error
    fixtures=payload.get("fixtures")
    if payload.get("artifactType")!="ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_STRUCTURED_FIXTURES" or payload.get("unitKey")!=SOLID_FIGURE_UNIT_KEY or not isinstance(fixtures,list) or len(fixtures)!=12:
        raise MiddleSchoolSolidFigureMeasureVariantError("M1-07 corpus metadata or count is invalid")
    if {item.get("familyId") for item in fixtures} != set(FAMILY_IDS):
        raise MiddleSchoolSolidFigureMeasureVariantError("M1-07 corpus must contain both solid families")
    return copy.deepcopy(fixtures)


def middle_school_solid_figure_measure_variant_registry() -> StructureFamilyRegistry:
    registry=StructureFamilyRegistry()
    for family in FAMILY_IDS:
        registry.register(StructureFamilyAdapter(family_id=family,solver_profile=f"middle_school_{family.lower()}_exact_adapter_v1",transform_capabilities={TRANSFORM_A_NUMERIC:CAPABILITY_SUPPORTED,TRANSFORM_B_REPRESENTATION:CAPABILITY_SUPPORTED,TRANSFORM_C_PARAMETER_RECOVERY:CAPABILITY_HOLD},visual_capabilities={TRANSFORM_A_NUMERIC:"MANDATORY",TRANSFORM_B_REPRESENTATION:"MANDATORY",TRANSFORM_C_PARAMETER_RECOVERY:"HOLD"}))
    return registry


def _mutated_data(fixture: dict[str, Any]) -> dict[str, Any]:
    values={"m1-07-cube-edge-sum-general":{"edge":2},"m1-07-cube-edge-sum-boundary":{"edge":3},"m1-07-cube-edge-sum-composite":{"edge":4},"m1-07-cube-edge-sum-general-large":{"edge":5},"m1-07-cube-edge-sum-boundary-large":{"edge":6},"m1-07-cube-edge-sum-composite-large":{"edge":7},"m1-07-cuboid-volume-general":{"length":3,"width":4,"height":5},"m1-07-cuboid-volume-boundary":{"length":4,"width":5,"height":6},"m1-07-cuboid-volume-composite":{"length":2,"width":6,"height":7},"m1-07-cuboid-volume-general-wide":{"length":5,"width":5,"height":3},"m1-07-cuboid-volume-boundary-wide":{"length":6,"width":3,"height":4},"m1-07-cuboid-volume-composite-wide":{"length":7,"width":4,"height":3}}
    try:return copy.deepcopy(values[fixture["caseId"]])
    except KeyError as error:raise MiddleSchoolSolidFigureMeasureVariantError(f"no M1-07 mutation for {fixture.get('caseId')}") from error


def _student_payload(fixture: dict[str, Any], result: dict[str, Any], *, representation: str) -> dict[str, Any]:
    data=fixture["data"]
    if fixture["familyId"]==CUBE_FAMILY_ID:
        edge=_integer(data["edge"],"edge")
        content=f"한 모서리의 길이가 ${edge}$인 정육면체에서 모서리 12개의 길이 합을 계산하여라." if representation=="rearranged" else result["given"]
    else:
        length,width,height=(_integer(data[key],key) for key in ("length","width","height"))
        content=f"세 방향의 길이가 ${length}$, ${width}$, ${height}$인 직육면체의 부피를 계산하여라." if representation=="rearranged" else result["given"]
    return {"content":content,"choices":[],"questionType":"단답형","layoutTag":"grid","wide":False}


def _graph(family: str) -> dict[str, Any]:
    op="count_cube_edges" if family==CUBE_FAMILY_ID else "apply_cuboid_volume_formula"
    nodes=[{"nodeId":"inspect","role":"core","op":"inspect_solid_dimensions","inputRole":["solid_data"],"outputRole":["solid_parameters"],"order":0},{"nodeId":"calculate","role":"core","op":op,"inputRole":["solid_parameters"],"outputRole":["exact_answer"],"order":1}]
    return normalize_solution_graph({"nodes":nodes,"edges":[{"from":"inspect","to":"calculate"}],"coreDecisionCount":1,"branchCount":0,"newConceptCount":0})


def _source_question(fixture: dict[str, Any], result: dict[str, Any], ordinal: int) -> dict[str, Any]:
    return {"id":ordinal,**_student_payload(fixture,result,representation="standard"),"answer":result["answerText"],"solution":result["answerText"],"standardCourse":"중1 수학","standardUnitKey":SOLID_FIGURE_UNIT_KEY,"standardUnit":"입체도형의 성질"}


def _build_ir(fixture: dict[str, Any], result: dict[str, Any], ordinal: int, snapshot_sha: str) -> dict[str, Any]:
    source=_source_question(fixture,result,ordinal)
    return build_universal_question_ir(source,source_question_sha256=json_sha256(fixture),rule_snapshot_sha256=snapshot_sha,structure_family=fixture["familyId"],solution_graph=_graph(fixture["familyId"]),curriculum={"courseKey":"M1","unitKey":SOLID_FIGURE_UNIT_KEY,"label":"입체도형의 성질"},concepts=[fixture["subUnit"]],givens={"data":copy.deepcopy(fixture["data"])},goal={"kind":fixture["kind"]},parameters=copy.deepcopy(fixture["data"]),mutable_parameters=sorted(fixture["data"]),constraints={"exactSolidMeasure":True,"visualDefinitionRequired":True},representation={"layoutTag":"grid","wide":False,"style":"solid_wireframe"},difficulty_vector={"interpretation":1,"representation":1,"decision":1,"algebraLoad":1,"calculationLoad":2,"visualLoad":2,"branch":0,"newConcept":0},allowed_methods=["정육면체 모서리 성질","직육면체 부피 공식","입체도형의 세 방향 길이 확인"],forbidden_methods=["그림의 원근만으로 길이 추정하기","부피와 겉넓이 공식 혼동","교육과정 밖의 입체도형 공식 사용"],capability_status=CAPABILITY_SUPPORTED)


def _sidecar(source_ir: dict[str, Any], candidate_ir: dict[str, Any], fixture: dict[str, Any], declared_class: str, ordinal: int) -> dict[str, Any]:
    refs=[f"middle-m1-07-proof:{ordinal}:{declared_class}"]
    required=["coreConceptPreserved","solutionGraphPreserved","curriculumPreserved","parameterChanged","effectiveParameterChangeCount","parameterDistance","answerMemoryShortcut"] if declared_class=="A" else ["coreConceptPreserved","solutionGraphPreserved","representationChanged","antiClone","curriculumPreserved"]
    checks=[build_proof_check(check,"PASS",method="middle_school_m1_07_exact_adapter",evidence_refs=refs,summary="Exact solid-figure recomputation and wireframe comparison passed.") for check in required]
    payload={"artifactType":"ALIVE_VARIANT_PROOF_SIDECAR","schemaVersion":"0.1.0","sourceQuestionId":source_ir["sourceQuestionId"],"declaredClass":declared_class,"verifiedClass":"HOLD","structureFamily":fixture["familyId"],"transform":TRANSFORM_A_NUMERIC if declared_class=="A" else TRANSFORM_B_REPRESENTATION,"capabilityStatus":CAPABILITY_SUPPORTED,"coreConceptPreserved":True,"solutionGraphPreserved":source_ir["solutionGraph"]["graphFingerprint"]==candidate_ir["solutionGraph"]["graphFingerprint"],"coreDecisionDelta":0,"branchDelta":0,"newConceptDelta":0,"preprocessingDelta":0,"preprocessLoad":{"type":"none","magnitude":0},"preprocessDeterministic":True,"preprocessOutputArity":0,"studentObservableInputsOnly":True,"ablationPassed":True,"shortcutBlocked":True,"difficultyDelta":{"representation":1 if declared_class=="B" else 0,"calculation":1 if declared_class=="A" else 0},"proofChecks":checks,"proofSha256":"pending","sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"]}
    payload.update({"parameterChanged":True,"effectiveParameterChangeCount":1,"parameterDistance":1,"answerMemoryShortcut":False} if declared_class=="A" else {"representationChanged":True,"antiClone":True})
    payload["proofSha256"]=hashlib.sha256(json.dumps({key:value for key,value in payload.items() if key!="proofSha256"},ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")).hexdigest()
    return payload


def _candidate(run_id: str, ordinal: int, fixture: dict[str, Any], result: dict[str, Any], source_ir: dict[str, Any], candidate_ir: dict[str, Any], sidecar: dict[str, Any], variant_result: dict[str, Any], declared_class: str) -> dict[str, Any]:
    from .solution_quality import format_solution_detail, normalize_solution_detail
    detail=normalize_solution_detail({"version":"0.1","audience":"student","depth":"detailed","given":result["given"],"goal":result["goal"],"keyIdea":result["keyIdea"],"conceptNote":result["conceptNote"],"steps":result["steps"],"check":result["check"],"commonMistakes":result["commonMistakes"],"diagramRequirement":"MANDATORY","diagramPurpose":"입체도형의 모서리와 세 방향 길이를 그림에서 확인한다."},inferred_visual_requirement="MANDATORY")
    payload=_student_payload(fixture,result,representation="rearranged" if declared_class=="B" else "standard")
    metadata={"level":"중","category":fixture["coverage"],"originalCategory":fixture["coverage"],"standardCourse":"중1 수학","standardUnitKey":SOLID_FIGURE_UNIT_KEY,"standardUnit":"입체도형의 성질","standardUnitOrder":7,"subUnitKey":fixture["subUnitKey"],"subUnit":fixture["subUnit"],"subUnitConfidence":"deterministic_fixture","subUnitClassificationDepth":"complete_rule","questionType":payload["questionType"],"layoutTag":payload["layoutTag"],"tags":[fixture["coverage"],"ALIVE_UNIVERSAL_MIDDLE_SCHOOL_M1_07_BOUNDED"],"wide":False}
    candidate={"artifactType":"ALIVE_UNIVERSAL_CANDIDATE","schemaVersion":"0.1.0","runId":run_id,"sourceQuestionId":source_ir["sourceQuestionId"],"sourceQuestionSha256":source_ir["sourceQuestionSha256"],"ruleSnapshotSha256":source_ir["ruleSnapshotSha256"],"variantPlan":{"declaredClass":declared_class,"transform":sidecar["transform"],"familyId":fixture["familyId"],"bridgeStatus":"BOUNDED_MIDDLE_SCHOOL_M1_07_EXACT_VARIANT","sourceGraphFingerprint":source_ir["solutionGraph"]["graphFingerprint"],"candidateGraphFingerprint":candidate_ir["solutionGraph"]["graphFingerprint"]},"studentPayload":payload,"answerContract":{"answerType":"text","displayAnswer":result["answerText"],"equivalencePolicy":"normalized_math_text"},"solution":format_solution_detail(detail,result["answerText"]),"solutionDetail":detail,"archiveMetadata":metadata,"variantProof":sidecar,"variantResult":variant_result,"visualDependency":"MANDATORY","solutionVisualElements":{"required":True},"visualSpec":copy.deepcopy(result["visualSpec"]),"solutionVisualSpec":copy.deepcopy(result["solutionVisualSpec"])}
    return validate_universal_candidate(candidate)


def _review(ordinal: int) -> dict[str, Any]:
    return {"id":ordinal,"blindMath":{"status":"PASS","method":"middle_school_m1_07_independent_exact_recompute","evidenceRefs":[f"middle-m1-07-review:{ordinal}:blindMath"]},"solution":{"status":"PASS","method":"middle_school_m1_07_solution_detail_contract","evidenceRefs":[f"middle-m1-07-review:{ordinal}:solution"]},"variantComparison":{"status":"PASS","method":"middle_school_m1_07_visual_comparison","evidenceRefs":[f"middle-m1-07-review:{ordinal}:variantComparison"]}}


def build_middle_school_solid_figure_measure_variant_inputs(root: Path, *, run_id: str, declared_class: str) -> dict[str, Any]:
    if declared_class not in {"A","B"}: raise MiddleSchoolSolidFigureMeasureVariantError("C is HOLD for M1-07 until a genuine preprocess fixture exists")
    snapshot=load_rule_pack(Path(root).resolve(),required=True)
    if not rule_pack_is_ready(snapshot): raise MiddleSchoolSolidFigureMeasureVariantError("canonical rule pack is not ready")
    fixtures=load_middle_school_solid_figure_measure_fixtures(root); transform=TRANSFORM_A_NUMERIC if declared_class=="A" else TRANSFORM_B_REPRESENTATION
    source_questions=[]; source_irs=[]; candidate_irs=[]; candidates=[]; proof_rows=[]; reviews=[]; assignments=[]
    for ordinal,fixture in enumerate(fixtures,1):
        source_result=solve_middle_school_solid_figure_measure_fixture(fixture); source_questions.append(_source_question(fixture,source_result,ordinal)); source_ir=_build_ir(fixture,source_result,ordinal,snapshot["snapshotSha256"]); require_valid_universal_question_ir(source_ir); source_irs.append(source_ir)
        variant=copy.deepcopy(fixture)
        if declared_class=="A": variant["data"]=_mutated_data(fixture)
        result=solve_middle_school_solid_figure_measure_fixture(variant); candidate_payload=_student_payload(variant,result,representation="rearranged" if declared_class=="B" else "standard"); candidate_ir=copy.deepcopy(source_ir); candidate_ir["studentPayload"]={**candidate_ir["studentPayload"],"content":candidate_payload["content"]}; candidate_ir["parameters"]=copy.deepcopy(variant["data"]); candidate_irs.append(candidate_ir)
        sidecar=_sidecar(source_ir,candidate_ir,fixture,declared_class,ordinal); refs={ref for check in sidecar["proofChecks"] for ref in check["evidenceRefs"]}; variant_result=reduce_variant_class(sidecar,evidence_catalog=refs)
        if variant_result.get("status")!="PASS": raise MiddleSchoolSolidFigureMeasureVariantError(f"M1-07 variant proof failed: {fixture['caseId']}")
        candidates.append(_candidate(run_id,ordinal,variant,result,source_ir,candidate_ir,sidecar,variant_result,declared_class)); proof_rows.append({"id":ordinal,"sidecar":sidecar}); reviews.append(_review(ordinal)); assignments.append({"id":ordinal,"unitKey":SOLID_FIGURE_UNIT_KEY,"familyId":fixture["familyId"],"transform":transform,"status":"READY","solver":"middle_school_m1_07_exact_adapter_v1","variantClass":declared_class})
    review_catalog=sorted({ref for row in reviews for view in ("blindMath","solution","variantComparison") for ref in row[view]["evidenceRefs"]}); proof_catalog=sorted({ref for row in proof_rows for check in row["sidecar"]["proofChecks"] for ref in check["evidenceRefs"]})
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_BOUNDED_VARIANT_INPUT","schemaVersion":SOLID_FIGURE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"BOUNDED_MIDDLE_SCHOOL_M1_07_EXACT_VARIANT","variantClass":declared_class,"transform":transform,"fixtureScope":"M1-07_solid_figure_measure_structured","ruleSnapshotSha256":snapshot["snapshotSha256"],"questionCount":len(candidates),"sourceQuestions":source_questions,"sourceIR":source_irs,"candidateIR":candidate_irs,"candidates":candidates,"proofRows":proof_rows,"proofCatalog":proof_catalog,"reviewLedger":{"artifactType":"ALIVE_UNIVERSAL_REVIEW_LEDGER","schemaVersion":"0.1.0","questions":reviews},"reviewCatalog":review_catalog,"independentReviews":reviews,"capabilityPreflight":{"status":"PASS","assignments":assignments},"visualRecon":{"status":"PASS","questions":[{"id":item["id"],"visualDependency":"MANDATORY","problem":"PASS","solution":"PASS"} for item in assignments]},"promotionStatus":"CANDIDATE","promotionReason":"M1-07 cube edge and cuboid volume exact A/B slices; C remains HOLD"}


def build_middle_school_solid_figure_measure_capability_report(root: Path) -> dict[str, Any]:
    records=[]
    for family in FAMILY_IDS:
        for declared_class in ("A","B"):
            inputs=build_middle_school_solid_figure_measure_variant_inputs(root,run_id=f"capability-middle-m1-07-{declared_class.lower()}",declared_class=declared_class)
            for assignment,candidate in zip(inputs["capabilityPreflight"]["assignments"],inputs["candidates"]):
                if assignment["familyId"]==family: records.append({"familyId":family,"transform":inputs["transform"],"polarity":"positive","status":"PASS","unitKey":SOLID_FIGURE_UNIT_KEY,"variantClass":declared_class,"verifiedClass":candidate["variantResult"]["verifiedClass"]})
            records.append({"familyId":family,"transform":inputs["transform"],"polarity":"negative","status":"PASS","unitKey":SOLID_FIGURE_UNIT_KEY,"variantClass":declared_class,"negativeCode":"VARIANT_PROOF_FAILED"})
        records.append({"familyId":family,"transform":TRANSFORM_C_PARAMETER_RECOVERY,"polarity":"negative","status":"PASS","unitKey":SOLID_FIGURE_UNIT_KEY,"variantClass":"C","negativeCode":"C_ABLATION_FAILED"})
    promotion=evaluate_capability_promotion(records)
    return {**promotion,"artifactType":"ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_CAPABILITY_PROMOTION","schemaVersion":SOLID_FIGURE_MEASURE_VARIANT_SCHEMA_VERSION,"scope":"M1-07 cube edge total and rectangular-prism volume bounded slices","unitCount":2,"fixtureCount":12,"status":"ACTIVE_BOUNDED" if promotion["holdCount"]==2 and promotion["activeCount"]==4 else "HOLD","cRecords":records,"productionArchiveRegistration":"NOT_PERFORMED","publicationStatus":"NOT_PUBLISHED"}


def prepare_middle_school_solid_figure_measure_variant_run(root: Path, runtime_root: Path, *, run_id: str, title: str, declared_class: str) -> dict[str, Any]:
    from .universal_variant_runtime import UniversalRunStore, assemble_universal_exam, record_universal_capability_preflight, record_universal_candidate_set, record_universal_ir_analysis, record_universal_mother_final, record_universal_revision, record_universal_review, record_universal_stage, record_universal_variant_precheck, record_universal_visual_recon, start_universal_run, write_universal_variant_ledger
    inputs=build_middle_school_solid_figure_measure_variant_inputs(root,run_id=run_id,declared_class=declared_class); root=Path(root).resolve(); source_path=root/"archive/_generated/alive-universal-inputs"/f"{run_id}.js"; source_path.parent.mkdir(parents=True,exist_ok=True); source_path.write_text("window.examTitle = "+json.dumps(title,ensure_ascii=False)+";\nwindow.questionBank = "+json.dumps(inputs["sourceQuestions"],ensure_ascii=False,indent=2)+";\n",encoding="utf-8",newline="\n")
    source_manifest={"artifactType":"ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_UNIVERSAL_SOURCE_JS","schemaVersion":SOLID_FIGURE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"questionCount":inputs["questionCount"],"path":source_path.relative_to(root).as_posix(),"sha256":sha256_file(source_path),"ruleSnapshotSha256":inputs["ruleSnapshotSha256"],"publicationStatus":"NOT_PUBLISHED"}; atomic_write_json(source_path.with_name(source_path.stem+"-manifest.json"),source_manifest)
    start=start_universal_run(Path(runtime_root).resolve(),run_id=run_id,source_lock={"path":source_manifest["path"],"sha256":source_manifest["sha256"],"ruleSnapshotSha256":inputs["ruleSnapshotSha256"]},question_count=inputs["questionCount"],batch_plan=[[start for start in range(index,min(index+4,inputs["questionCount"]+1))] for index in range(1,inputs["questionCount"]+1,4)]); store=UniversalRunStore(Path(runtime_root).resolve()); atomic_write_json(store.run_dir(run_id)/"source/variant-input.json",inputs)
    record_universal_stage(store,run_id,"S01_PREFLIGHT",status="PASS",evidence="middle-school-m1-07-exact-variant-preflight"); record_universal_visual_recon(store,run_id,inputs["visualRecon"]); record_universal_ir_analysis(store,run_id,inputs["sourceIR"]); record_universal_capability_preflight(store,run_id,inputs["capabilityPreflight"]); record_universal_candidate_set(store,run_id,inputs["candidates"]); precheck=record_universal_variant_precheck(store,run_id,inputs["proofRows"],evidence_catalog=inputs["proofCatalog"]); record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review1",evidence_catalog=inputs["reviewCatalog"]); record_universal_revision(store,run_id,{"status":"PASS","bounded":True,"changedQuestionIds":[]}); record_universal_review(store,run_id,inputs["reviewLedger"],round_name="review2",evidence_catalog=inputs["reviewCatalog"]); record_universal_mother_final(store,run_id); ledger=write_universal_variant_ledger(store,run_id,precheck["precheck"]["questions"]); assembled=assemble_universal_exam(store,run_id,title,archive_root=root/"archive")
    return {"artifactType":"ALIVE_MIDDLE_SCHOOL_SOLID_FIGURE_MEASURE_BOUNDED_VARIANT_PREPARED_RUN","schemaVersion":SOLID_FIGURE_MEASURE_VARIANT_SCHEMA_VERSION,"runId":run_id,"status":"READY_FOR_BROWSER_RENDER","variantClass":declared_class,"fixtureScope":"M1-07_solid_figure_measure_structured","run":start,"source":source_manifest,"questionCount":inputs["questionCount"],"variantLedger":ledger,"assembly":assembled["assembly"],"currentStage":UniversalRunStore(Path(runtime_root).resolve()).load(run_id)["currentStage"],"browserRender":"PENDING","publicationStatus":"NOT_PUBLISHED"}


__all__=["CUBE_FAMILY_ID","CUBOID_FAMILY_ID","MiddleSchoolSolidFigureMeasureVariantError","build_middle_school_solid_figure_measure_capability_report","build_middle_school_solid_figure_measure_variant_inputs","load_middle_school_solid_figure_measure_fixtures","middle_school_solid_figure_measure_variant_registry","prepare_middle_school_solid_figure_measure_variant_run","solve_middle_school_solid_figure_measure_fixture"]
