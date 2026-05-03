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