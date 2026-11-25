# 미래엔 공통수학Ⅱ 원의 방정식 — 문제·해설 2축 판정 (q01–q08)

- 원문 JS: `archive/exams/textbooks/미래엔_공통수학2/미래엔_공통수학2_원의방정식_중단원마무리_고1/미래엔_공통수학2_원의방정식_중단원마무리_고1.js`.
- 이번 배치 **8문항/16축**. 잔여 q09–q11은 후속 묶음. 기존 문제 PNG q11은 범위 밖이라 변경하지 않음.
- 신규 해설 plan 5개, 문제 그림 답 미노출, 면 채움 기본 없음. 손 SVG·원문 JS 변경 없음.

| qid | 문제축/개별 근거 | 해설축/개별 근거 | capability | 계획 경로 | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| q01 | EXEMPT — 두 원의 조건이 좌표와 반지름으로 완결 | BENEFICIAL — ⑵ 지름 양 끝과 중점을 원 위에 나타냄(⑴은 표준형 대입만) | construction-spike-v1 | `q01-solution.plan.json` | PASS/PASS | PASS: A(−1,3),B(5,1),C(2,2),r²=10,AB 지름 |
| q02 | EXEMPT — 원의 일반형 주어짐 | EXEMPT — 완전제곱으로 중심(−3,4), r=4 판정 | — | — | N/A | N/A |
| q03 | EXEMPT — 원과 k 포함 직선식 완결 | BENEFICIAL — d와 r 비교의 세 경우를 하나의 k 수직선에 표시 | number-line-figure-v1 | `q03-solution.plan.json` | PASS/PASS | PASS: 경계 ±5√2, 내부 OPEN·경계 POINTS·외부 OPEN |
| q04 | EXEMPT — 두 원과 접선 조건만 제시 | EXEMPT — ⑴ y=√3x±12·⑵ −4x+y=17로 접선 공식 완결, 별도 개형 중복 | — | — | N/A | N/A |
| q05 | EXEMPT — 원의 일반형과 반지름 하한 제시 | EXEMPT — 5−k≥2에서 자연수 k=1,2,3을 세는 식 | — | — | N/A | N/A |
| q06 | EXEMPT — 두 축 접함·점 (2,1) 조건 완결 | BENEFICIAL — 서로 다른 반지름 1·5인 두 실제 원의 위치 확인 | construction-spike-v1 | `q06-solution.plan.json` | PASS/PASS | PASS: (1,1),r=1와 (5,5),r=5 모두 P(2,1)·두 축 접함 |
| q07 | EXEMPT — 원·직선 방정식의 관계가 완결 | BENEFICIAL — 중심·수선의 발·원 위 최원점/최근점을 한 방향에 표시 | construction-spike-v1 | `q07-solution.plan.json` | PASS/PASS | PASS: C(2,5),H(22/5,9/5),N(16/5,17/5),F(4/5,33/5), d=4,r=2,직각 |
| q08 | EXEMPT — 원·접점·미지 k가 식으로 주어짐 | BENEFICIAL — 두 원에 각각 접하는 공통 직선과 두 수선의 직각 표시 | construction-spike-v1 | `q08-solution.plan.json` | PASS/PASS | PASS: O(0,0),P(1,3),C(8,4),H(7,1),r²=10, 공통 접선 x+3y−10=0 |

- 공식 `plan-lint.cjs --shallow`: 5/5 PASS, full: 5/5 PASS.
- 독립 재계산: 좌표·중점·선분/선형 관계·원 위 점·두 축 접함·직각표식·원의 반지름·임계값 5√2를 렌더 필드와 대조해 **DRAWN_FEATURE_PARITY 5/5 PASS**.
- 실제 SVG 파일 렌더·PNG/학생화면/A4 육안검수·JS 링크/게시: **NOT_RUN**. 후속 엔진 렌더 단계.
