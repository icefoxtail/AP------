# 고1 2학기 유사문항 수정 프로토콜 — 시험지별 루프 결과

수정일: 2026-08-26  
범위: 8개 시험지 / 178문항  
적용: `docs/rules/수정프로토콜.md`, `docs/rules/수정후보고프로토콜.md`, 수학 오류·1·2·3차 검수 규칙  
원칙: 보고된 결함만 최소 수정. 문항 재출제·원문 미화·메타 확장·DB/index 변경은 하지 않음.

## 시험지별 루프

| 시험지 | 수정 | 수정 후 자체 검수 | 렌더 | 남은 상태 |
|---|---|---|---|---|
| 금당고 2중간 | 없음. q14 시각 WARN은 원본 crop 근거 부족으로 보류 | 22문항 구조 PASS | PASS | 원본 대조/시각 provenance BLOCKED |
| 매산고 2중간 | q2/q6/q9 해설 중복 문장 3건 최소 보정 | 20문항 PASS, 빈 해설·결론 불일치 0 | PASS | 원본 PDF 미확보 BLOCKED |
| 순천고 2중간 | 없음. q18 시각 WARN 보류 | 23문항 구조 PASS | PASS | 원본 field 대조/provenance BLOCKED |
| 금당고 2기말 | q9 해설의 `식에 값을 대입하여` 중복 보정 | 22문항 PASS | PASS | 원본 field 대조 BLOCKED, q16 시각 WARN |
| 순천고 2기말 | q1 choice 5 `<`→`\\lt`, q5 choice 2 `>`→`\\gt`; q8/q21 해설 중복 보정 | 23문항 PASS, raw choice 부등호 0 | PASS | 원본 field 대조 BLOCKED |
| 제일고 2기말 | q3 해설 중복 보정. q8은 재계산 결과 수정하지 않음 | 22문항 PASS | PASS | 원본 field 대조 BLOCKED, q12/q17 시각 WARN |
| 팔마고 2기말 | q11 해설 최상위 `\\frac` 2곳→`\\dfrac` | 23문항 PASS, 수식 경고 0 | PASS | 원본 PDF 미확보 BLOCKED, q5/q19 시각 WARN |
| 효천고 2기말 | q1 choice 3 `>`→`\\gt` | 23문항 PASS, raw choice 부등호 0 | PASS | 원본 field 대조 BLOCKED, q13 시각 WARN |

## 제일고 q8 판정 정정

이전 독립 보고서의 q8 FAIL은 잘못된 계산이었다. 현재 발문을 직접 대입하면 다음과 같다.

| 당첨자 | 거짓말 수 |
|---|---:|
| A | 3 |
| B | 2 |
| C | 2 |
| D | 1 |

D가 당첨자일 때 A만 거짓이므로 현재 answer `①`과 해설 결론이 유일하게 성립한다. q8은 수정하지 않았다. 근거: [stage3-independent-math-correction.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-independent-math-correction.md)

## 수정 후 전수 자체 재검

- 8개 JS `node --check`: **8/8 PASS**
- 문항 수: **178/178 유지**
- ID 연속·중복: **PASS**
- 빈 content/answer/solution: **0건**
- 객관식 answer–해설 결론 불일치: **0건**
- choices raw `<`/`>`: **0건**
- 해설 수식·반복 템플릿 경고: **0건**
- 표준과정/단원/subUnit 구조: **178/178 PASS**
- 수정 후 리뷰 엔진 exam/sol/ans: **24/24 PASS**
  - 문항 수 일치, 이미지 broken 0, 오류 텍스트 0, horizontal overflow 0

렌더 증거: [repair-render-qa.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/repair-render-qa.json)  
해설 재검 증거: [stage3-solution.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-solution.json)  
메타 재검 증거: [stage3-metadata.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-metadata.json)

## 아직 PASS로 승격하지 않은 게이트

- 원본 PDF 3개 미확보, 발견된 5개도 이미지형이라 문항별 content/choices/조건/배점 대조 **178건 BLOCKED**
- 21개 에셋의 원본 page/crop 좌표 provenance **BLOCKED**
- 시각자료 8건은 경계 여백 WARN
- 난이도(level) 독립 재판정 **BLOCKED**
- DB/question-index 대상 8개 등록 **0/8**, audit-only라 수정하지 않음

## 최종 판정

수정된 결함은 자체 재검에서 해소됐다. 그러나 위의 원본 대조·provenance·독립 난이도·카탈로그 게이트가 남아 있으므로 전체 아카이브 완료 판정은 **BLOCKED**이며 외부 배포용 PASS로 보고하지 않는다.

이번 수정에서 변경한 JS는 매산고 2중간, 금당고 2기말, 순천고 2기말, 제일고 2기말, 팔마고 2기말, 효천고 2기말의 승인된 최소 필드뿐이다. 금당고 2중간·순천고 2중간은 수정하지 않았다.
