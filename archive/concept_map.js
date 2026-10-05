/**
 * concept_map.js v0.1 (정정본)
 * standardUnitKey → conceptClusterKey 매핑 테이블
 *
 * 기준: JS아카이브 표준단원키 마스터 테이블 완전 대조
 * 커버: db.js 실제 등장 키 41개 전체
 * 미매핑 키: "__UNMAPPED__" 반환으로 검출 가능
 */

window.CONCEPT_MAP = {

  // 중1
  "M1-01": "NUM-FACTORIZATION",   // 소인수분해
  "M1-02": "NUM-RATIONAL",        // 정수와 유리수
  "M1-03": "ALG-EXPR",            // 문자와 식
  "M1-04": "GEO-COORD",           // 좌표평면과 그래프

  // 중2
  "M2-01": "ALG-EXPR",            // 수와 식
  "M2-02": "ALG-INEQ",            // 일차부등식
  "M2-03": "ALG-EQ-LINEAR",       // 연립일차방정식
  "M2-06": "GEO-SIMILAR",         // 도형의 닮음

  // 중3
  "M3-01": "NUM-REAL",            // 실수와 그 계산
  "M3-02": "ALG-FACTOR",          // 다항식의 곱셈과 인수분해
  "M3-03": "ALG-QUADRATIC-EQ",    // 이차방정식
  "M3-04": "FUNC-QUADRATIC",      // 이차함수와 그래프

  // 수학(상) H15-SA
  "H15-SA-01": "ALG-POLY",        // 다항식의 연산
  "H15-SA-02": "ALG-IDENTITY",    // 항등식과 나머지정리
  "H15-SA-03": "ALG-FACTOR",      // 인수분해
  "H15-SA-05": "ALG-QUADRATIC-EQ",// 이차방정식
  "H15-SA-06": "ALG-QUADRATIC-EQ",// 이차방정식의 근과 계수
  "H15-SA-07": "ALG-EQ-HIGHER",   // 여러 가지 방정식
  "H15-SA-08": "ALG-INEQ-HIGHER", // 여러 가지 부등식

  // 수학(하) H15-SB
  "H15-SB-02": "SET-LOGIC",       // 명제

  // 수학I H15-M1
  "H15-M1-01": "EXP-LOG",         // 지수의 뜻과 성질
  "H15-M1-02": "EXP-LOG",         // 로그의 뜻과 성질

  // 확률과통계 H15-PS
  "H15-PS-01": "PROB-COMBI",      // 순열과 조합
  "H15-PS-02": "PROB-COMBI",      // 이항정리
  "H15-PS-03": "PROB-BASIC",      // 확률의 뜻과 활용

  // 공통수학1 H22-C
  "H22-C-01": "ALG-POLY",         // 다항식의 연산
  "H22-C-02": "ALG-IDENTITY",     // 항등식과 나머지 정리
  "H22-C-03": "ALG-FACTOR",       // 인수분해
  "H22-C-04": "ALG-COMPLEX",      // 복소수와 이차방정식
  "H22-C-05": "ALG-QUADRATIC-EQ", // 이차방정식과 이차함수
  "H22-C-06": "ALG-EQ-HIGHER",    // 여러 가지 방정식과 부등식
  "H22-C-07": "PROB-COMBI",       // 합의 법칙과 곱의 법칙
  "H22-C-08": "PROB-COMBI",       // 순열과 조합
  "H22-C-09": "ALG-MATRIX",       // 행렬과 그 연산

  // 공통수학2 H22-C2
  "H22-C2-01": "GEO-COORD",       // 평면좌표
  "H22-C2-05": "SET-LOGIC",       // 집합

  // 대수 H22-A
  "H22-A-01": "EXP-LOG",          // 지수와 로그
  "H22-A-02": "EXP-LOG-FUNC",     // 지수함수
  "H22-A-03": "EXP-LOG-FUNC",     // 로그함수
  "H22-A-04": "TRIG-FUNC",        // 삼각함수
  "H22-A-05": "TRIG-LAW",         // 사인법칙과 코사인법칙

  // 확률과통계 H22-PS
  "H22-PS-01": "PROB-COMBI",      // 순열과 조합
  "H22-PS-03": "PROB-BASIC",      // 확률의 뜻과 활용

  // 2026-08 compatibility completion: every currently used official key is
  // assigned a broad review cluster. This map does not rewrite source labels
  // or promote subunit metadata; it only prevents an official key from being
  // treated as unmapped by consumers.
  "H15-CALC-01": "SEQUENCE",
  "H15-CALC-02": "SEQUENCE",
  "H15-CALC-03": "CALCULUS_DIFFERENTIATION",
  "H15-CALC-04": "CALCULUS_DIFFERENTIATION",
  "H15-CALC-05": "CALCULUS_DIFFERENTIATION",
  "H15-M1-05": "TRIG-FUNC",
  "H15-M1-06": "TRIG-FUNC",
  "H15-M1-07": "TRIG-FUNC",
  "H15-M1-08": "SEQUENCE",
  "H15-M1-09": "SEQUENCE",
  "H15-M1-10": "SEQUENCE",
  "H15-M1-11": "SEQUENCE",
  "H15-M2-01": "CALCULUS",
  "H15-M2-02": "CALCULUS",
  "H15-M2-03": "CALCULUS",
  "H15-M2-04": "CALCULUS",
  "H15-M2-05": "CALCULUS",
  "H15-M2-06": "CALCULUS",
  "H15-M2-07": "CALCULUS",
  "H15-M2-08": "CALCULUS",
  "H15-M2-09": "CALCULUS",
  "H15-PS-04": "PROB-BASIC",
  "H15-PS-05": "PROB-BASIC",
  "H15-PS-06": "STAT-BASIC",
  "H15-SA-04": "ALG-COMPLEX",
  "H15-SA-09": "GEO-COORD",
  "H15-SA-10": "GEOMETRY_LINE",
  "H15-SA-11": "GEOMETRY_CIRCLE",
  "H15-SA-12": "GEOMETRY_TRANSFORM",
  "H15-SB-01": "SET-LOGIC",
  "H15-SB-03": "FUNCTION_BASIC",
  "H15-SB-04": "FUNCTION_RATIONAL",
  "H15-SB-05": "FUNCTION_IRRATIONAL",
  "H15-SB-06": "PROB-COMBI",
  "H15-SB-07": "PROB-COMBI",
  "H15-SB-08": "PROB-COMBI",
  "H22-A-06": "SEQUENCE",
  "H22-A-07": "SEQUENCE",
  "H22-A-08": "SEQUENCE",
  "H22-C2-02": "GEOMETRY_LINE",
  "H22-C2-03": "GEOMETRY_CIRCLE",
  "H22-C2-04": "GEOMETRY_TRANSFORM",
  "H22-C2-06": "SET-LOGIC",
  "H22-C2-07": "FUNCTION_BASIC",
  "H22-C2-08": "FUNCTION_RATIONAL",
  "H22-C2-09": "FUNCTION_IRRATIONAL",
  "H22-GE-01": "GEOMETRY_CONIC",
  "H22-GE-02": "GEOMETRY_CONIC",
  "H22-GE-05": "GEOMETRY_VECTOR",
  "H22-GE-06": "GEOMETRY_VECTOR",
  "H22-GE-07": "GEOMETRY_VECTOR",
  "H22-PS-02": "PROB-COMBI",
  "M1-05": "GEOMETRY_BASIC",
  "M1-06": "GEOMETRY_BASIC",
  "M1-07": "GEOMETRY_SOLID",
  "M1-08": "STAT-BASIC",
  "M2-04": "FUNCTION_LINEAR",
  "M2-05": "GEOMETRY_POLYGON",
  "M2-07": "GEOMETRY_PYTHAGOREAN",
  "M2-08": "PROB-BASIC",
  "M3-05": "TRIG-FUNC",
  "M3-06": "GEOMETRY_CIRCLE",
  "M3-07": "STAT-BASIC",
};

window.CONCEPT_CLUSTER_LABEL = {
  "NUM-FACTORIZATION": "소인수분해",
  "NUM-RATIONAL":      "유리수·정수",
  "NUM-REAL":          "실수·제곱근",
  "ALG-EXPR":          "문자와 식",
  "ALG-POLY":          "다항식",
  "ALG-IDENTITY":      "항등식·나머지정리",
  "ALG-FACTOR":        "인수분해",
  "ALG-COMPLEX":       "복소수",
  "ALG-QUADRATIC-EQ":  "이차방정식·이차함수",
  "ALG-EQ-LINEAR":     "연립방정식",
  "ALG-EQ-HIGHER":     "고차방정식·부등식",
  "ALG-INEQ":          "부등식",
  "ALG-INEQ-HIGHER":   "고차부등식",
  "ALG-MATRIX":        "행렬",
  "FUNC-QUADRATIC":    "이차함수",
  "EXP-LOG":           "지수·로그",
  "EXP-LOG-FUNC":      "지수·로그 함수",
  "TRIG-FUNC":         "삼각함수",
  "TRIG-LAW":          "사인·코사인 법칙",
  "GEO-COORD":         "좌표기하",
  "GEO-SIMILAR":       "도형의 닮음",
  "SET-LOGIC":         "집합·명제",
  "PROB-COMBI":        "경우의 수·순열·조합",
  "PROB-BASIC":        "확률",
  "STAT-BASIC":        "통계",
  "SEQUENCE":          "수열",
  "CALCULUS":          "미적분",
  "CALCULUS_DIFFERENTIATION": "미분",
  "GEOMETRY_LINE":     "직선과 좌표",
  "GEOMETRY_CIRCLE":   "원과 원의 방정식",
  "GEOMETRY_TRANSFORM": "도형의 이동",
  "FUNCTION_BASIC":    "함수",
  "FUNCTION_RATIONAL": "유리함수",
  "FUNCTION_IRRATIONAL": "무리함수",
  "GEOMETRY_CONIC":    "이차곡선",
  "GEOMETRY_VECTOR":   "벡터",
  "GEOMETRY_BASIC":    "기본도형과 평면도형",
  "GEOMETRY_SOLID":    "입체도형",
  "FUNCTION_LINEAR":   "일차함수",
  "GEOMETRY_POLYGON":  "다각형과 사각형",
  "GEOMETRY_PYTHAGOREAN": "피타고라스 정리",
};

// 검색·필터 전용 라벨 alias. source standardUnit/subUnitKey를 변경하지 않는다.
// 근거가 확인된 축약·동의 라벨만 등록하며, 오분류 후보는 여기에 넣지 않는다.
window.STANDARD_UNIT_LABEL_ALIASES = {
  "H15-M2-09": { "정적분의 활용": "적분의 활용" },
  "H22-A-05": { "삼각함수의 활용": "사인법칙과 코사인법칙" },
  "M1-04": { "좌표와 그래프": "좌표평면과 그래프" },
  "M2-03": { "연립방정식": "연립일차방정식" },
};

window.normalizeStandardUnitLabelForSearch = function(unitKey, label) {
  const aliases = window.STANDARD_UNIT_LABEL_ALIASES[unitKey] || {};
  return aliases[label] || label;
};

window.getConceptClusterKey = function(unitKey) {
  return window.CONCEPT_MAP[unitKey] || "__UNMAPPED__";
};

window.getConceptClusterLabel = function(unitKey) {
  const key = window.getConceptClusterKey(unitKey);
  return window.CONCEPT_CLUSTER_LABEL[key] || key;
};

window.getConceptCluster = function(unitKey) {
  const clusterKey = window.getConceptClusterKey(unitKey);
  return {
    unitKey,
    conceptClusterKey: clusterKey,
    label: window.CONCEPT_CLUSTER_LABEL[clusterKey] || clusterKey,
    mapped: clusterKey !== "__UNMAPPED__"
  };
};
