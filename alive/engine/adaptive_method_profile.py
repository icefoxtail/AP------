"""Deterministic curriculum-method profiles for the adaptive ALIVE lane.

The baseline staged controller validates the shape of ``solutionDetail`` but
does not compile a per-unit method contract.  This module keeps that contract
small, serialisable, and independent from model wording.  A reviewer still
judges semantic use of a method; the deterministic gate catches unmapped units,
unambiguous forbidden core methods, and missing unit-route evidence before an
artifact is accepted.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from typing import Any


METHOD_PROFILE_SCHEMA_VERSION = "0.1.0"


def _profile(
    profile_id: str,
    course_key: str,
    unit_key: str,
    unit_name: str,
    allowed_methods: list[str],
    route_groups: list[list[str]],
    forbidden_core_methods: list[dict[str, Any]] | None = None,
    justification_rules: list[dict[str, Any]] | None = None,
    method_policy: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "profileId": profile_id,
        "version": METHOD_PROFILE_SCHEMA_VERSION,
        "courseKey": course_key,
        "unitKey": unit_key,
        "unitName": unit_name,
        "allowedCoreMethods": allowed_methods,
        "requiredRouteGroups": route_groups,
        "forbiddenCoreMethods": forbidden_core_methods or [],
        "justificationRules": justification_rules or [],
        "methodPolicy": copy.deepcopy(method_policy or {}),
    }


_VECTOR_FORBIDDEN = [
    {
        "code": "VECTOR_DETERMINANT_CORE",
        "label": "벡터의 행렬식",
        "patterns": [
            r"벡터\s*의\s*행렬식",
            r"행렬식.{0,24}(?:넓이|면적)",
            r"\\overrightarrow",
        ],
        "reason": "고1 좌표·직선·원 단원의 핵심 풀이에 벡터 행렬식을 사용하지 않는다.",
    },
    {
        "code": "VECTOR_INNER_PRODUCT_CORE",
        "label": "벡터의 내적",
        "patterns": [r"벡터\s*의\s*내적", r"내적(?:을|으로|에)"],
        "reason": "고1 공통수학의 해당 단원에서 벡터 내적을 핵심 도구로 사용하지 않는다.",
    },
]

_CALCULUS_FORBIDDEN = {
    "code": "CALCULUS_CORE",
    "label": "미적분",
    "patterns": [r"미적분", r"미분", r"적분", r"도함수", r"미분계수"],
    "reason": "고1 공통수학의 해당 단원에서 미적분을 핵심 도구로 사용하지 않는다.",
}

_MATRIX_FORBIDDEN = {
    "code": "MATRIX_CORE",
    "label": "행렬",
    "patterns": [r"행렬\s+(?:의|을|로|식)"],
    "reason": "행렬 단원이 아닌 해설의 핵심 풀이에 행렬을 사용하지 않는다.",
}

_PROJECTION_JUSTIFICATION = [
    {
        "code": "PROJECTION_THEOREM_JUSTIFICATION",
        "triggerPatterns": [
            r"투영\s*정리",
            r"CM\s*=\s*CA\s*(?:\^?\s*2|²)\s*/\s*PC",
            r"CM\s*=\s*\\frac\{\s*CA\s*(?:\^?\s*2|²)\s*\}\{\s*PC\s*\}",
        ],
        "requiredAnyPatterns": [r"닮음", r"닮은", r"증명", r"유도", r"피타고라스"],
        "reason": "투영 관계를 사용하면 닮음 또는 식의 유도로 학생이 재현할 근거를 제시한다.",
    }
]


def _common_forbidden(*, include_matrix: bool = True) -> list[dict[str, Any]]:
    items = copy.deepcopy(_VECTOR_FORBIDDEN)
    items.append(copy.deepcopy(_CALCULUS_FORBIDDEN))
    if include_matrix:
        items.append(copy.deepcopy(_MATRIX_FORBIDDEN))
    return items


def _geometry_profile(
    profile_id: str,
    unit_key: str,
    unit_name: str,
    allowed_methods: list[str],
    route_groups: list[list[str]],
    *,
    forbidden: list[dict[str, Any]] | None = None,
    justifications: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    return _profile(
        profile_id,
        "H22-C2",
        unit_key,
        unit_name,
        allowed_methods,
        route_groups,
        forbidden_core_methods=forbidden if forbidden is not None else _common_forbidden(),
        justification_rules=justifications,
    )


def _math2_profile(
    profile_id: str,
    unit_key: str,
    unit_name: str,
    allowed_methods: list[str],
    route_groups: list[list[str]],
) -> dict[str, Any]:
    """Build a 2015 개정 수학Ⅱ method contract.

    Unlike the coordinate-geometry profiles above, calculus vocabulary is
    curricular here and must not be treated as a forbidden method.  Matrix
    and vector-core checks still protect the lane from importing methods from
    unrelated courses.
    """

    return _profile(
        profile_id,
        "H15-M2",
        unit_key,
        unit_name,
        allowed_methods,
        route_groups,
        forbidden_core_methods=[*_VECTOR_FORBIDDEN, copy.deepcopy(_MATRIX_FORBIDDEN)],
    )


def _middle_profile(
    profile_id: str,
    unit_key: str,
    unit_name: str,
    allowed_methods: list[str],
    route_groups: list[list[str]],
) -> dict[str, Any]:
    """Build a middle-school method contract for the adaptive whole-exam lane."""

    return _profile(
        profile_id,
        "M1",
        unit_key,
        unit_name,
        allowed_methods,
        route_groups,
        forbidden_core_methods=_common_forbidden(),
    )


METHOD_PROFILES: dict[str, dict[str, Any]] = {
    # 중1 2학기 whole-exam route.  These profiles are intentionally broad:
    # the exact sub-type remains in the canonical source metadata, while the
    # adaptive gate only blocks methods outside the middle-school curriculum.
    "M1-04": _middle_profile(
        "M1-04-COORDINATE_PLANE_AND_GRAPHS",
        "M1-04",
        "좌표평면과 그래프",
        ["순서쌍과 좌표", "사분면", "정비례", "반비례", "그래프 해석"],
        [[r"좌표|순서쌍|사분면|정비례|반비례|그래프|비례"]],
    ),
    "M1-05": _middle_profile(
        "M1-05-BASIC_GEOMETRY",
        "M1-05",
        "기본도형",
        ["점·선·면과 각", "위치 관계", "작도", "합동", "평행선", "다각형과 입체도형"],
        [[r"점|선분|직선|반직선|각|평행|엇각|동위각|맞꼭지각|작도|합동|삼각형|다각형|기둥|면|모서리|수직|꼬인"]],
    ),
    # 2015 개정 확률과 통계
    # 확률분포 단원은 이산·연속 확률변수, 기댓값·분산, 이항분포,
    # 정규분포가 함께 출제될 수 있으므로 특정 세부 공식을 하나로
    # 고정하지 않고, 확률분포의 핵심 언어와 과정만 공통 게이트로 둔다.
    "H15-PS-05": _profile(
        "H15-PS-05-PROBABILITY_DISTRIBUTION",
        "H15-PS",
        "H15-PS-05",
        "확률분포",
        [
            "확률변수와 확률분포",
            "확률질량함수·확률밀도함수",
            "기댓값·분산·표준편차",
            "이항분포",
            "정규분포와 표준화",
            "확률의 합과 구간 확률",
        ],
        [[
            r"확률|확률변수|확률분포|확률질량함수|확률밀도함수|기댓값|분산|표준편차|이항분포|정규분포|표준화"
        ]],
        forbidden_core_methods=[*_VECTOR_FORBIDDEN, copy.deepcopy(_MATRIX_FORBIDDEN)],
        method_policy={
            "binomialNormalApproximation": {
                "continuityCorrection": "REQUIRED",
                "evidencePatterns": [
                    r"연속성\s*(?:수정|보정)",
                    r"(?:경계|구간).{0,20}0\.5",
                    r"0\.5.{0,20}(?:경계|수정|보정|더|빼)",
                ],
            }
        },
    ),
    # 2015 개정 수학Ⅱ — 함수의 극한과 연속, 미분, 적분
    "H15-M2-01": _math2_profile(
        "H15-M2-01-LIMIT",
        "H15-M2-01",
        "함수의 극한",
        ["극한의 기본 성질", "좌극한·우극한", "무한대에서의 극한", "유리화", "인수분해", "조임 정리"],
        [[r"극한|수렴|좌극한|우극한|유리화|인수분해|조임"]],
    ),
    "H15-M2-02": _math2_profile(
        "H15-M2-02-CONTINUITY",
        "H15-M2-02",
        "함수의 연속",
        ["연속의 정의", "좌극한·우극한과 함숫값", "연속함수의 성질", "중간값 정리"],
        [[r"연속|좌극한|우극한|함숫값|중간값"]],
    ),
    "H15-M2-03": _math2_profile(
        "H15-M2-03-DERIVATIVE-DEFINITION",
        "H15-M2-03",
        "미분계수",
        ["평균변화율", "미분계수의 정의", "미분 가능성과 연속", "접선의 기울기"],
        [[r"미분계수|미분 가능|평균변화율|접선|기울기|미분"]],
    ),
    "H15-M2-04": _math2_profile(
        "H15-M2-04-DERIVATIVE",
        "H15-M2-04",
        "도함수",
        ["도함수의 정의", "다항함수의 미분법", "곱·몫·합성함수의 미분법", "함수의 미분"],
        [[r"도함수|미분|미분법|미분한|미분하면"]],
    ),
    "H15-M2-05": _math2_profile(
        "H15-M2-05-TANGENT",
        "H15-M2-05",
        "접선의 방정식",
        ["접선의 기울기", "접선의 방정식", "접점 조건", "법선"],
        [[r"접선|접점|법선|기울기|도함수|미분계수"]],
    ),
    "H15-M2-06": _math2_profile(
        "H15-M2-06-DERIVATIVE-APPLICATIONS",
        "H15-M2-06",
        "도함수의 활용",
        ["증가·감소", "극대·극소", "최댓값·최솟값", "방정식과 부등식", "속도와 가속도"],
        [[r"증가|감소|극대|극소|최댓값|최솟값|방정식|부등식|속도|가속도|도함수"]],
    ),
    "H15-M2-07": _math2_profile(
        "H15-M2-07-INDEFINITE-INTEGRAL",
        "H15-M2-07",
        "부정적분",
        ["부정적분의 정의", "다항함수의 적분법", "미분과 적분의 관계", "적분상수"],
        [[r"부정적분|적분상수|적분|원시함수|미분과 적분"]],
    ),
    "H15-M2-08": _math2_profile(
        "H15-M2-08-DEFINITE-INTEGRAL",
        "H15-M2-08",
        "정적분",
        ["정적분의 정의", "정적분의 성질", "구간 분할", "미적분의 기본정리"],
        [[r"정적분|적분|구간|미적분의 기본정리"]],
    ),
    "H15-M2-09": _math2_profile(
        "H15-M2-09-INTEGRAL-APPLICATIONS",
        "H15-M2-09",
        "정적분의 활용",
        ["곡선과 축 사이의 넓이", "두 곡선 사이의 넓이", "속도와 거리", "정적분의 활용"],
        [[r"넓이|거리|속도|정적분|적분|곡선"]],
    ),
    # 공통수학1
    "H22-C-01": _profile(
        "H22-C-01-POLYNOMIAL_OPERATIONS",
        "H22-C",
        "H22-C-01",
        "다항식의 연산",
        ["다항식의 덧셈·뺄셈·곱셈", "전개와 동류항 정리", "곱셈공식"],
        [[r"다항식|전개|동류항|곱셈공식|계수"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-02": _profile(
        "H22-C-02-IDENTITY_REMAINDER",
        "H22-C",
        "H22-C-02",
        "항등식과 나머지 정리",
        ["항등식의 계수 비교", "나머지 정리", "인수정리", "대입"],
        [[r"항등식|나머지|인수정리|계수\s*비교|대입"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-03": _profile(
        "H22-C-03-FACTORIZATION",
        "H22-C",
        "H22-C-03",
        "인수분해",
        ["곱셈공식", "공통인수", "인수분해 공식", "치환"],
        [[r"인수분해|곱셈공식|공통인수|치환|완전제곱"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-04": _profile(
        "H22-C-04-COMPLEX_QUADRATIC",
        "H22-C",
        "H22-C-04",
        "복소수와 이차방정식",
        ["복소수의 계산", "허수 단위", "이차방정식의 근", "근과 계수"],
        [[r"복소수|허수|이차방정식|근과\s*계수|판별식"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-05": _profile(
        "H22-C-05-QUADRATIC_FUNCTION",
        "H22-C",
        "H22-C-05",
        "이차방정식과 이차함수",
        ["이차방정식", "판별식", "이차함수의 그래프", "꼭짓점과 축"],
        [[r"이차방정식|이차함수|판별식|꼭짓점|축|그래프"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-06": _profile(
        "H22-C-06-EQUATIONS_INEQUALITIES",
        "H22-C",
        "H22-C-06",
        "여러 가지 방정식과 부등식",
        ["인수분해", "치환", "연립방정식", "부등식의 해석", "경우 나누기"],
        [[r"방정식|부등식|인수분해|연립|치환|경우"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-07": _profile(
        "H22-C-07-COUNTING_RULES",
        "H22-C",
        "H22-C-07",
        "합의 법칙과 곱의 법칙",
        ["합의 법칙", "곱의 법칙", "경우의 수", "분류와 중복 점검"],
        [[r"합의\s*법칙|곱의\s*법칙|경우의\s*수|분류|경우"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-08": _profile(
        "H22-C-08-PERMUTATIONS_COMBINATIONS",
        "H22-C",
        "H22-C-08",
        "순열과 조합",
        ["순열", "조합", "팩토리얼", "경우의 수", "중복 여부 판단"],
        [[r"순열|조합|팩토리얼|경우의\s*수"]],
        forbidden_core_methods=_common_forbidden(),
    ),
    "H22-C-09": _profile(
        "H22-C-09-MATRIX_OPERATIONS",
        "H22-C",
        "H22-C-09",
        "행렬과 그 연산",
        ["행렬의 성분", "행렬의 덧셈·뺄셈", "행렬의 곱셈", "행렬식"],
        [[r"행렬|성분|행렬식"]],
        forbidden_core_methods=[*_VECTOR_FORBIDDEN, copy.deepcopy(_CALCULUS_FORBIDDEN)],
    ),
    # 공통수학2 — 도형·함수 영역
    "H22-C2-01": _geometry_profile(
        "H22-C2-01-COORDINATE_METRIC",
        "H22-C2-01",
        "평면좌표",
        ["좌표", "내분점·중점", "두 점 사이의 거리", "기울기", "자취의 좌표화"],
        [[r"좌표|점"], [r"내분|중점|거리|기울기|무게중심|자취|넓이"]],
    ),
    "H22-C2-02": _geometry_profile(
        "H22-C2-02-LINE_EQUATION",
        "H22-C2-02",
        "직선의 방정식",
        ["기울기·절편", "두 점을 지나는 직선", "평행·수직", "교점", "점과 직선 사이의 거리", "밑변과 높이"],
        [[r"기울기|직선(?:의\s*방정식)?|수선"], [r"수직|평행|교점|거리|밑변|높이|넓이|좌표"]],
    ),
    "H22-C2-03": _geometry_profile(
        "H22-C2-03-CIRCLE_EQUATION",
        "H22-C2-03",
        "원의 방정식",
        ["완전제곱식", "중심·반지름", "두 점 사이의 거리", "직선·원의 방정식", "피타고라스 정리", "닮음", "판별식"],
        [[r"원|중심|반지름"], [r"거리|접선|접점|현|직각|완전제곱|좌표"]],
        justifications=_PROJECTION_JUSTIFICATION,
    ),
    "H22-C2-04": _geometry_profile(
        "H22-C2-04-SHAPE_TRANSFORMATION",
        "H22-C2-04",
        "도형의 이동",
        ["평행이동", "대칭이동", "대응점", "이동 벡터", "방정식의 좌표 변환"],
        [[r"평행이동|대칭이동|이동|대칭"], [r"좌표|방정식|중심|대응|벡터"]],
        forbidden=[
            item for item in _common_forbidden()
            if item["code"] != "VECTOR_DETERMINANT_CORE"
        ],
    ),
    "H22-C2-05": _geometry_profile(
        "H22-C2-05-SET",
        "H22-C2-05",
        "집합",
        ["원소와 부분집합", "합집합·교집합·여집합", "벤다이어그램", "집합의 연산"],
        [[r"집합|원소|부분집합|합집합|교집합|여집합|벤다이어그램"]],
    ),
    "H22-C2-06": _geometry_profile(
        "H22-C2-06-PROPOSITION",
        "H22-C2-06",
        "명제",
        ["조건과 명제", "필요·충분조건", "대우", "반례", "명제의 참·거짓"],
        [[r"명제|조건|필요|충분|대우|반례|참|거짓"]],
    ),
    "H22-C2-07": _geometry_profile(
        "H22-C2-07-FUNCTION",
        "H22-C2-07",
        "함수",
        ["함수의 대응", "정의역·치역", "함숫값", "그래프", "합성"],
        [[r"함수|정의역|치역|대응|함숫값|그래프"]],
    ),
    "H22-C2-08": _geometry_profile(
        "H22-C2-08-RATIONAL_FUNCTION",
        "H22-C2-08",
        "유리함수",
        ["정의역", "유리식의 변형", "점근선", "그래프의 평행이동", "함숫값"],
        [[r"유리함수|정의역|점근선|그래프|분모"]],
    ),
    "H22-C2-09": _geometry_profile(
        "H22-C2-09-RADICAL_FUNCTION",
        "H22-C2-09",
        "무리함수",
        ["정의역 부등식", "근호식의 변형", "유리화", "그래프", "평행이동"],
        [[r"무리함수|정의역|근호|그래프|유리화|부등식"]],
    ),
}


def method_profile_for_unit(unit_key: Any) -> dict[str, Any] | None:
    """Return a defensive copy of the profile for a canonical unit key."""

    key = str(unit_key or "").strip()
    profile = METHOD_PROFILES.get(key)
    return copy.deepcopy(profile) if profile is not None else None


def method_profile_for_question(
    student_payload: dict[str, Any] | None = None,
    preflight_item: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    student_payload = student_payload if isinstance(student_payload, dict) else {}
    preflight_item = preflight_item if isinstance(preflight_item, dict) else {}
    return method_profile_for_unit(
        student_payload.get("standardUnitKey")
        or preflight_item.get("standardUnitKey")
    )


def build_method_snapshot(
    preflight_questions: list[dict[str, Any]],
    *,
    rule_authority: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Compile per-ordinal method profiles into a deterministic Run artifact."""

    profiles: dict[str, dict[str, Any]] = {}
    unmapped: list[dict[str, Any]] = []
    for item in preflight_questions:
        ordinal = int(item.get("ordinal", 0))
        profile = method_profile_for_question(preflight_item=item)
        if profile is None:
            unmapped.append(
                {
                    "ordinal": ordinal,
                    "standardUnitKey": item.get("standardUnitKey"),
                    "standardUnit": item.get("standardUnit"),
                }
            )
        else:
            profiles[str(ordinal)] = profile
    snapshot: dict[str, Any] = {
        "schemaVersion": METHOD_PROFILE_SCHEMA_VERSION,
        "artifactType": "ALIVE_ADAPTIVE_METHOD_PROFILE_SNAPSHOT",
        "status": "READY" if not unmapped else "HOLD",
        "gate": "QUESTION_METHOD_PROFILE_HARD_LOCK",
        "profiles": profiles,
        "unmappedOrdinals": unmapped,
        "ruleAuthority": copy.deepcopy(rule_authority or {}),
    }
    canonical = json.dumps(snapshot, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    snapshot["snapshotSha256"] = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return snapshot


def _core_solution_text(solution: str, solution_detail: dict[str, Any] | None) -> str:
    """Limit method checks to the explanatory route, not mistake metadata."""

    parts: list[str] = []
    if isinstance(solution_detail, dict):
        for key in ("keyIdea", "conceptNote"):
            value = solution_detail.get(key)
            if value:
                parts.append(str(value))
        steps = solution_detail.get("steps")
        if isinstance(steps, list):
            for step in steps:
                if isinstance(step, dict):
                    parts.extend(str(step.get(key) or "") for key in ("title", "work", "why"))
    rendered = str(solution or "")
    if "[풀이 과정]" in rendered:
        rendered = rendered.split("[풀이 과정]", 1)[1]
    if "[검산]" in rendered:
        rendered = rendered.split("[검산]", 1)[0]
    if rendered:
        parts.append(rendered)
    return "\n".join(parts)


_METHOD_NEGATION_RE = re.compile(
    r"(?:사용하지\s*않|쓰지\s*않|이용하지\s*않|적용하지\s*않|배제|피하|제외|금지|아니(?:다|며|고))"
)


def _is_negated_method_mention(text: str, start: int, end: int) -> bool:
    """Return whether a forbidden-method hit is explicitly rejected.

    Method profiles are intended to catch a method actually used in the
    student route.  A solution may still mention a prohibited method while
    explaining that it is *not* being used; treating that warning as use would
    create a false hold.  Keep the window short so a negation in an unrelated
    sentence cannot mask a real method invocation.
    """

    before = text[max(0, start - 36) : start]
    after = text[end : min(len(text), end + 36)]
    return bool(_METHOD_NEGATION_RE.search(before) or _METHOD_NEGATION_RE.search(after))


def lint_solution_method(
    profile: dict[str, Any] | None,
    solution: str,
    solution_detail: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Check one student solution against its compiled method profile."""

    if not isinstance(profile, dict):
        return {
            "verdict": "FAIL",
            "code": "METHOD_PROFILE_UNMAPPED",
            "forbiddenHits": [],
            "routeEvidence": [],
            "justificationChecks": [],
            "issues": ["문항별 교육과정 Method Profile이 없습니다."],
        }

    core_text = _core_solution_text(solution, solution_detail)
    forbidden_hits: list[dict[str, str]] = []
    for rule in profile.get("forbiddenCoreMethods", []):
        if not isinstance(rule, dict):
            continue
        for pattern in rule.get("patterns", []):
            match = re.search(str(pattern), core_text, re.IGNORECASE)
            if match and not _is_negated_method_mention(core_text, match.start(), match.end()):
                forbidden_hits.append(
                    {
                        "code": str(rule.get("code") or "METHOD_FORBIDDEN"),
                        "label": str(rule.get("label") or "금지된 핵심 방법"),
                        "pattern": str(pattern),
                    }
                )
                break

    route_evidence: list[dict[str, Any]] = []
    route_missing = False
    for index, group in enumerate(profile.get("requiredRouteGroups", []), 1):
        matched = [str(pattern) for pattern in group if re.search(str(pattern), core_text, re.IGNORECASE)]
        route_evidence.append({"group": index, "matched": matched, "verdict": "PASS" if matched else "FAIL"})
        if not matched:
            route_missing = True

    justification_checks: list[dict[str, Any]] = []
    issues: list[str] = []
    justification_missing = False
    for rule in profile.get("justificationRules", []):
        if not isinstance(rule, dict):
            continue
        triggered = any(re.search(str(pattern), core_text, re.IGNORECASE) for pattern in rule.get("triggerPatterns", []))
        if not triggered:
            justification_checks.append({"code": rule.get("code"), "verdict": "NOT_TRIGGERED"})
            continue
        matched = [str(pattern) for pattern in rule.get("requiredAnyPatterns", []) if re.search(str(pattern), core_text, re.IGNORECASE)]
        verdict = "PASS" if matched else "FAIL"
        justification_checks.append({"code": rule.get("code"), "matched": matched, "verdict": verdict})
        if verdict != "PASS":
            justification_missing = True

    method_policy = profile.get("methodPolicy")
    normal_approximation_policy = (
        method_policy.get("binomialNormalApproximation")
        if isinstance(method_policy, dict)
        else None
    )
    if isinstance(normal_approximation_policy, dict):
        normal_approximation = bool(
            re.search(r"이항분포", core_text)
            and re.search(r"정규분포|정규분포로\s*근사|정규근사", core_text)
        )
        if normal_approximation:
            evidence_patterns = normal_approximation_policy.get("evidencePatterns", [])
            has_correction = any(
                re.search(str(pattern), core_text, re.IGNORECASE)
                for pattern in evidence_patterns
            )
            correction_verdict = "PASS" if has_correction else "FAIL"
            justification_checks.append(
                {
                    "code": "CONTINUITY_CORRECTION_POLICY",
                    "verdict": correction_verdict,
                    "required": normal_approximation_policy.get("continuityCorrection"),
                }
            )
            if not has_correction:
                issues.append(
                    "이항분포를 정규분포로 근사할 때 연속성 수정을 명시해야 합니다."
                )

    issues.extend(
        f"{item['label']}을(를) 핵심 풀이에서 사용했습니다."
        for item in forbidden_hits
    )
    if route_missing:
        issues.append("해당 canonical 단원의 허용 풀이 경로 근거가 부족합니다.")
    if justification_missing:
        issues.append("사용한 정리·관계의 학생용 근거 설명이 부족합니다.")
    return {
        "profileId": profile.get("profileId"),
        "profileVersion": profile.get("version"),
        "verdict": "PASS" if not issues else "FAIL",
        "forbiddenHits": forbidden_hits,
        "routeEvidence": route_evidence,
        "justificationChecks": justification_checks,
        "methodPolicy": copy.deepcopy(profile.get("methodPolicy", {})),
        "issues": issues,
    }


def lint_candidate_methods(
    manifest: dict[str, Any],
    candidate: dict[str, Any],
) -> list[dict[str, Any]]:
    """Return deterministic method findings for every question in a candidate."""

    findings: list[dict[str, Any]] = []
    by_ordinal = {
        int(item.get("ordinal", 0)): item
        for item in candidate.get("questions", [])
        if isinstance(item, dict)
    }
    for ordinal, item in sorted(by_ordinal.items()):
        preflight = manifest.get("preflight", {}).get("questions", [])
        preflight_item = preflight[ordinal - 1] if 0 < ordinal <= len(preflight) else {}
        snapshot_profiles = manifest.get("methodProfiles", {}).get("profiles", {})
        profile = snapshot_profiles.get(str(ordinal)) if isinstance(snapshot_profiles, dict) else None
        profile = profile or method_profile_for_question(item.get("studentPayload"), preflight_item)
        report = lint_solution_method(profile, str(item.get("solution") or ""), item.get("solutionDetail"))
        if report.get("verdict") != "PASS":
            findings.append({"ordinal": ordinal, "report": report})
    return findings
