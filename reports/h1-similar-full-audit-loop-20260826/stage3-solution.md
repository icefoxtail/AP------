# Stage 3 solution audit — 고1 8개 유사 시험지

- 범위: 8개 유사 JS / 178문항
- 적용 문서: `docs/rules/해설프로토콜.md`, `docs/rules/수학_문항오류_검증_프로토콜_v2.1.md`, `docs/rules/JS아카이브_3차검수_프로토콜.md`
- JS/에셋 수정: 없음

## 검사 항목

각 JS를 VM으로 실행하여 모든 `solution`을 읽고 다음을 확인했다.

- 빈 해설, 문항 누락
- 객관식 마지막 결론(단일·복수 번호)과 `answer` 일치
- `정석 풀이`, 결론 구조 및 상 난이도 필수 섹션
- 금지 운영 문구, 미짝 수식 구분자
- 해설의 반복적인 문장 템플릿 신호

## 결과

| 시험지 | 문항 | 구조/결론 | 반복문구 WARN |
|---|---:|---|---:|
| 금당고 2중간 | 22 | PASS | 0 |
| 매산고 2중간 | 20 | PASS | 3 |
| 순천고 2중간 | 23 | PASS | 0 |
| 금당고 2기말 | 22 | PASS | 1 |
| 순천고 2기말 | 23 | PASS | 2 |
| 제일고 2기말 | 22 | PASS | 1 |
| 팔마고 2기말 | 23 | PASS | 1 |
| 효천고 2기말 | 23 | PASS | 0 |

- 빈 해설/결론 불일치/금지 문구/수식 구문 FAIL: **0문항**
- 반복문구 신호: **7문항, 8회** (`식에 값을 대입하여`가 일부 풀이에서 중복 사용)
- 해설 구조 게이트: **PASS(178/178)**
- 반복문구는 계산 오류 판정이 아니지만 학생용 문장 품질 보강 대상으로 남겼다.

수학적 정답·유일성·조건 충분성은 별도 독립 보고서 [stage3-independent-math.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-independent-math.md)에서 178문항 전수 재검산했다. 그 독립 검수의 수학 FAIL 1건과 DATA-FAIL 3건은 최종 게이트에서 별도로 반영한다.

원자료: [stage3-solution.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-solution.json)
