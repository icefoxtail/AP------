# 비상_확률과통계_확률의뜻과활용_중단원학습점검_고2 — 문항·해설 2축 SVG 플랜 정적 감사

- 기준 JS: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_확률의뜻과활용_중단원학습점검_고2/비상_확률과통계_확률의뜻과활용_중단원학습점검_고2.js` — 원문 Git blob `9f81daef59ca61ef73f52ae5244bca9db1096330`.
- **17문항 × 2축 = 34축 전수판정**. 실행형 plan 11축, 별도 그림 불필요 EXEMPT 23축; plan이 부분 기능 미지원인 축 6개(중복 집계).
- 원본 PNG: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_확률의뜻과활용_중단원학습점검_고2/q14.png`; SHA-256 `2f27d7f0724c660ba4e36c08e0a0380d794f64caa03450027b43fdee461d8254`. 직접 육안 대조.
- 신규 11개 plan은 공식 `plan-lint.cjs --shallow` **OK 11 / FAIL 0 / SKIP 0**, full **OK 11 / FAIL 0 / SKIP 0**. 엔진 렌더 자체와 별개의 기술 검사다.
- 실물 렌더: 공식 `render-plan.mjs`를 q14 문제 plan에 시도했으나 `ARCHIVE_PREFLIGHT_FAIL`; 시스템의 `/usr/bin/chromium` 실행 스크립트가 실 브라우저 `/usr/lib/chromium/chromium`을 찾지 못한다. 그러므로 신규 도형 전체 **RENDER_NOT_RUN**이며 PC·휴대폰·A4/픽셀 육안 검수와 실제 최종 시각 `DRAWN_FEATURE_PARITY=NOT_RUN`. 아래 정적 `STATIC_MAPPED`는 이 사실을 대체하지 않는다.
- 플랜은 전부 공식 엔진 schema의 JSON이며 **손 SVG·흰색 배경 패치·무의미한 면 채움 없음**. 확률의 집합 겹침처럼 뜻을 가진 영역만 음영, 경우의 수 데이터 막대는 엔진 기본 채움.
- 표의 plan 파일명은 `archive/tools/geometry-equation/production/plans/비상_확률과통계_확률의뜻과활용_중단원학습점검_고2/` 기준.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 확률뜻점검/q01 | 문항 | EXEMPT — 1~5 카드·홀수 사건은 수식으로 완결 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q01 | 해설 | PLAN_READY — 표본공간 5원소를 홀수 A/짝수로 분리; 전체집합 S를 엔진이 U로만 표기 | `set-diagram-figure-v1 + SET_UNIVERSE_NAME_S` | `q01-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 영역·원소는 정적 일치, S 이름은 U로만 출력; RENDER_NOT_RUN |
| 확률뜻점검/q02 | 문항 | EXEMPT — 100명 중 30명 비율은 문장으로 충분 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q02 | 해설 | EXEMPT — 30/100을 약분하는 단순 산술이며 SVG는 풀이 정보를 추가하지 못함 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q03 | 문항 | EXEMPT — 사건 A,B의 세 확률이 발문 수식에 명확 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q03 | 해설 | PLAN_READY — 50%,40%의 합집합과 겹친 20% 영역을 분리 | `set-diagram-figure-v1 + SET_REGION_COUNT_LABEL` | `q03-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 교집합 20% 직접 내부표기 미지원; RENDER_NOT_RUN |
| 확률뜻점검/q04 | 문항 | EXEMPT — 3인 가위바위보의 경우 수를 말로 규정 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q04 | 해설 | EXEMPT — 무승부 3+6=9, 전체27의 여사건 계산이 글로 충분; 27잎 수형도 장식 불필요 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q05 | 문항 | EXEMPT — 세 학생이 네 우유 중 한 개씩 선택하는 조건 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q05 | 해설 | EXEMPT — 4³과 4×3×2의 비교가 수식으로 완결 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q06 | 문항 | EXEMPT — 아홉 꽃 중 네 개 동시 선택·지정 두 꽃 조건 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q06 | 해설 | EXEMPT — 9C4와 7C2의 조합 계산에 독립 그림 불필요 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q07 | 문항 | EXEMPT — 회원 20대·여자·합집합 확률이 수식에 모두 주어짐 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q07 | 해설 | PLAN_READY — 35단위 비율 모형에 A21/B20/합집합30을 대응, 교집합11 표시 기능 미지원 | `set-diagram-figure-v1 + SET_REGION_COUNT_LABEL` | `q07-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 교집합 11단위 내부표기 미지원; RENDER_NOT_RUN |
| 확률뜻점검/q08 | 문항 | EXEMPT — 두 자리 자연수 생성 규칙은 문장으로 충분 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q08 | 해설 | PLAN_READY — 36개 표본 중 3의 배수12/11의 배수6과 33·66 중복을 벤 영역으로 표시 | `set-diagram-figure-v1 + SET_REGION_COUNT_LABEL` | `q08-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 중복 2개 내부표기 미지원; RENDER_NOT_RUN |
| 확률뜻점검/q09 | 문항 | EXEMPT — 붉은·초록 리본 네 개 선택 조건은 말로 완결 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q09 | 해설 | PLAN_READY — 빨간 리본 개수별 1,16,36,16,1 분포 중 3·4개 두 막대 강조 | `stat-chart-figure-v1` | `q09-solution.plan.json` | PASS / PASS | STATIC_MAPPED (다섯 막대·선택 두 막대·17); RENDER_NOT_RUN |
| 확률뜻점검/q10 | 문항 | EXEMPT — 두 사건의 확률과 여사건 수식만 필요 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q10 | 해설 | PLAN_READY — A합B 영역과 (A교B)의 여집합 영역을 두 벤다이어그램에서 비교 | `composite-panels-v1` | `q10-solution.plan.json` | PASS / PASS | STATIC_MAPPED (두 벤다이어그램 영역); RENDER_NOT_RUN |
| 확률뜻점검/q11 | 문항 | EXEMPT — WONDERFUL의 U,N 이웃하지 않음 조건은 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q11 | 해설 | EXEMPT — U,N을 묶은 여사건 8!×2! 계산이 문자열·수식으로 충분, 별도 장식 도식 불필요 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q12 | 문항 | EXEMPT — 세 분야 문제 4,3,2와 세 개 동시 선택이 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q12 | 해설 | EXEMPT — 한 분야만 고를 수 있는 4+1의 여사건 계산으로 완결 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q13 | 문항 | EXEMPT — 101~200 자연수·12와 서로소 조건은 수식 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q13 | 해설 | PLAN_READY — 2배수50·3배수33·6배수17의 집합 합집합 여집합을 100개 표본에 대응 | `set-diagram-figure-v1 + SET_REGION_COUNT_LABEL` | `q13-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 6배수17 내부표기 미지원; RENDER_NOT_RUN |
| 확률뜻점검/q14 | 문항 | PLAN_READY — 원본 q14.png의 7칸/9개 공유 변을 문제에 꼭 보여야 함 | `construction-spike-v1` | `q14-problem.plan.json` | PASS / PASS | STATIC_MAPPED (7칸·모서리 절개·이웃9쌍; 외곽 장식색 생략); RENDER_NOT_RUN |
| 확률뜻점검/q14 | 해설 | PLAN_READY — 원본 7칸을 유지하며 A~G 이름·아홉 공유 변 강조; 9×2!×5! 근거 | `construction-spike-v1` | `q14-solution.plan.json` | PASS / PASS | STATIC_MAPPED (7칸·라벨7·강조 공유 변9); RENDER_NOT_RUN |
| 확률뜻점검/q15 | 문항 | EXEMPT — 집합 X,Y와 f(b) 배수·순서 조건이 발문에 완전 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q15 | 해설 | EXEMPT — f(b)=3,6,12로 경우를 나눈 12+10+6 표식은 풀이 식·AP 표 엔진으로 충분 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q16 | 문항 | EXEMPT — 이차방정식의 계수와 n≤30가 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q16 | 해설 | PLAN_READY — (3x−n)(4x−n)의 3배수10·4배수7·12배수2 합집합 | `set-diagram-figure-v1 + SET_REGION_COUNT_LABEL` | `q16-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING — 12배수2 내부표기 미지원; RENDER_NOT_RUN |
| 확률뜻점검/q17 | 문항 | EXEMPT — 4회 파란 카드와 3회 노란 카드의 두 면 조건 명료 | — | — | N/A | EXEMPT (근거 확인) |
| 확률뜻점검/q17 | 해설 | PLAN_READY — 합 13~20의 이항계수 분포와 14 이하 여사건8 막대 강조 | `stat-chart-figure-v1` | `q17-solution.plan.json` | PASS / PASS | STATIC_MAPPED (합13~20·조합수·여사건8); RENDER_NOT_RUN |
## q14.png 원본 특징 1:1 정적 대응

- **7칸 위상:** 위 3칸(A,B,C), 가운데 2칸(D,E), 아래 2칸(F,G). 원본의 칸은 단순 2×3 균등격자가 아니며, 실제 분할과 모서리 절개를 `PLANE_FIGURE_v1`로 각 칸 8개 선분에 대응했다. 같은 좌표로 합쳐진 **40개 점과 56개 경계선분**이 있으나 7칸 각각의 8개 변이므로 일부 이웃 선분은 겹쳐 그려진다. 면 색 없음. 사진의 크기 조절은 변의 인접 관계를 바꾸지 않는다.
- **공유 변 정확히 9쌍:** AB, BC, AD, BD, CE, DE, DF, EG, FG. 별도 대각선 접촉이나 꼭짓점만 닿는 경우는 인접으로 세지 않는다. 해설 플랜은 `sA2,sB2,sA0,sB0,sC0,sD2,sD0,sE0,sF2` 9개 경계선만 ACCENT로 강조한다. 원본의 은은한 주황 외곽 장식은 수학적 조건이 아니므로 기본 무색 처리. 문제용 그림에는 답 4/7·강조 경계를 미노출하며 엔진 글자표시 요건상 '사진 배치 7칸' 제목만 추가.
- **독립 수학 검산:** 일곱 칸에 서로 다른 풍경 사진 2장을 두는 순서 있는 칸쌍은 7×6=42, 인접 칸쌍 9개에 두 사진의 순서 2배를 고려한 불리한 배치는 18, 비인접 24/42=4/7. 다섯 인물 사진의 5!는 분자·분모에서 상쇄된다.
- **정적 회귀 확인:** 문제·해설 모두 40개 숨긴 무표식 점, 56개 0 아닌 선분. 해설 라벨 A~G 7개 및 강조 경계 9개; 문제는 숫자 정답 노출 없음. 7칸 위상·9쌍은 원본과 `STATIC_MAPPED`이며 **실제 렌더 시각 PASS 아님**.

## 엔진 보강 인계

- `SET_UNIVERSE_NAME_S` (q01 해설): 원문이 표본공간을 **S**라고 명명하지만 공식 VENN의 universe 문자는 U 전용이다. 현재 도형의 홀수/짝수 원소 배치는 맞으나 범용 U를 S로 바꿔 표시할 수 있어야 원문 라벨도 1:1 완료다.
- `SET_REGION_COUNT_LABEL` (q03, q07, q08, q13, q16 해설): 서로 겹친 **교집합 안**에 각각 20%, 11/35, 2개, 17개, 2개를 적어야 하는데 현재 엔진은 집합 전체 `count`만 원 곁에 표시한다. 별도 기능 전까지 caption 수치를 실제 도형 속 수치로 오인하지 않는다. q07의 `35단위`는 임의 회원 수가 아니라 원래 분수들의 공통분모로 정규화한 가상의 확률 단위다.

## QA 결론

- **34축 전수판정**: 실행형 JSON 11개, 근거 기반 EXEMPT 23축; 미지원 표식 6축(모두 일부 내용이 실행형 plan과 중복).
- q14 원본의 7칸·9공유변, 그 밖의 확률 분포·집합 설명의 수학적 수치 대조는 정적 완료. 실제 렌더·PNG·학생화면·A4 검수는 `RENDER_NOT_RUN`.
- 이번 사용자의 명시적 렌더 예외에 따라, shallow/full lint와 구조·스펙 검수 통과 후 plan PR의 `main` 병합은 허용된다. 엔진 기능 확장·SVG 렌더·실제 JS 학생 연결 및 배포 완료와 구별한다.
