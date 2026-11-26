# 2021 순천고 1학기 중간 수학 I 유사 — SVG plan 재검수

- 원본: `archive/exams/similar/high/h2/1mid/21_순천고_1학기_중간_고2_수학I_유사.js`
- 검수 기준: `main` `4f959dfcf6f9aedcb2625b2c7f0a4006e1a48f2e`의 21문항, 문제·해설 **42축**. 실제 JS의 발문·보기·해설과 기존 `*_plans/VISUAL_AUDIT_Q01_Q21.md`를 대조했다.
- 기존 `_plans/`에 있던 실행형 9개를 원문·그려지는 필드·정답 노출 기준으로 재검수한 뒤 이 폴더에 **내용 동일하게** 배치했다. 기존 JS, SVG, PNG 및 기존 `_plans/`는 수정하지 않았다. 새로 만든 손 SVG 없음.
- 공식 `plan-lint.cjs`를 9개 개별 파일 경로에 실행: **shallow 9/9 OK, full 9/9 OK**, FAIL·SKIP 0. 정본 NotoSansKR.ttf SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 확인.
- 실제 `sourceQuote`와 현행 JS 일치 **9/9**, `sourceConditions[].mappedTo` 25건에서 없는 필드 **0**. 면 채움(`fill`, `regions`) 0건. 렌더·PNG·학생 화면·A4·JS 신규 연결 **NOT_RUN**이며 plan-lint를 실물 검수로 간주하지 않는다.

| qid | problem 판정·사유 | solution 판정·사유 | 실행형 plan (이 폴더 기준) | DRAWN_FEATURE_PARITY(정적 필드) |
| --- | --- | --- | --- | --- |
| q01 | EXEMPT: 근호 참·거짓 | EXEMPT: 근호 부호 계산 | — | 해당 없음 |
| q02 | EXEMPT: 근호 등식 비교 | EXEMPT: 거듭제곱 값 비교 | — | 해당 없음 |
| q03 | EXEMPT: 로그 성질 선택지 | EXEMPT: 식 전개 | — | 해당 없음 |
| q04 | EXEMPT: 참인 명제의 그래프는 답 암시 | BENEFICIAL: log(x⁴)와 4log x의 정의역 차이 | `q04-solution.plan.json` | PASS: 양·음 두 로그 가지 및 구간 |
| q05 | EXEMPT: 로그 항등식 | EXEMPT: 로그 법칙 계산 | — | 해당 없음 |
| q06 | EXEMPT: pH 농도 비율 | EXEMPT: 로그 차 계산 | — | 해당 없음 |
| q07 | EXEMPT: 동경 위치 선택지 | BENEFICIAL: 60°·300° 동경 비교 | `q07-solution.plan.json` | PASS: 원·동경 두 선분·60°/300° 각 호 |
| q08 | EXEMPT: 삼각함수 수치·사분면 | EXEMPT: 부호·항등식 | — | 해당 없음 |
| q09 | EXEMPT: 각 변환 식 | EXEMPT: 삼각함수 항등식 | — | 해당 없음 |
| q10 | EXEMPT: 미지 교점이 답을 암시 | BENEFICIAL: cos 2x와 y=2/5 교점 | `q10-solution.plan.json` | PASS: 두 주기·수평선·4교점 |
| q11 | EXEMPT: 근호 지수 조건 | EXEMPT: 정의 조건 추론 | — | 해당 없음 |
| q12 | EXEMPT: 로그방정식 실근 수 | EXEMPT: 대수근·진수 조건 | — | 해당 없음 |
| q13 | EXEMPT: 지수 계산 | EXEMPT: 소인수 지수 비교 | — | 해당 없음 |
| q14 | BENEFICIAL: 지수곡선과 x=4 경계 | BENEFICIAL: 정수 열의 높이 계산 | `q14-problem.plan.json`, `q14-solution.plan.json` | PASS: 문제축 y=2^x−5·x=4 점선·x축, 해설축 x=3,4와 y=3,11 및 보조선 |
| q15 | EXEMPT: 치환 이차방정식 | EXEMPT: 판별식·근 부호 | — | 해당 없음 |
| q16 | EXEMPT: 부채꼴 둘레·넓이 식 | BENEFICIAL: 넓이 S(r) 최대 | `q16-solution.plan.json` | PASS: 포물선·정의역·꼭짓점 |
| q17 | EXEMPT: 주기·극값 답 노출 위험 | BENEFICIAL: 진폭·중심선·8π 주기 | `q17-solution.plan.json` | PASS: COS 계수·극점·필수 눈금 |
| q18 | EXEMPT: θ 사분면 자체가 미지 | BENEFICIAL: 제4사분면 3:4:5 삼각형 | `q18-solution.plan.json` | PASS: 반지름 5인 원·변 3/4/5·직각·A 좌표 |
| q19 | EXEMPT: 함수 대칭·주기 명제 | EXEMPT: 식으로 짝함수·주기 확인 | — | 해당 없음 |
| q20 | EXEMPT: 개형 자체가 풀이 대상 | BENEFICIAL: 한 주기 COS 개형 | `q20-solution.plan.json` | PASS: x=π,4π,7π·y=1,−2,−5 |
| q21 | EXEMPT: 로그 성질 증명 | EXEMPT: 기호적 증명 | — | 해당 없음 |

**집계:** 문제 21축(필요 1, EXEMPT 20), 해설 21축(유익 8, EXEMPT 13). 실행형 plan **9**, 정적 DRAWN_FEATURE_PARITY **9 PASS**, ENGINE_CAPABILITY_PENDING **0**. 도형·그래프의 최종 실물 렌더는 후속 담당이 별도로 검수해야 한다.
