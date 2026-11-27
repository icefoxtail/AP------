# 비상_확률과통계_확률_익힘책_고2 — 문제·해설 2축 SVG 플랜 정적 감사

- 현행 소스: `archive/exams/textbooks/비상교육_확률과통계/비상_확률과통계_확률_익힘책_고2/비상_확률과통계_확률_익힘책_고2.js`
- 범위: **27문항 × 2축 = 54축**. 대상 시험지 이외의 JS·PNG·SVG·엔진 파일은 변경하지 않음.
- 원본 PNG: `q23.png`, `q26.png`, `q27.png` 직접 육안 확인.
- plan-lint: 신규 실행형 플랜 **shallow/full PASS**(합계 26개 기준, 실패 0). 실제 학생 화면·A4 렌더와 구별.
- 공식 `render-plan.mjs` 실제 시도 결과: `ARCHIVE_PREFLIGHT_FAIL` — Chrome `/opt/google/chrome/chrome` 부재. 따라서 모든 신규 그림의 **RENDER_NOT_RUN**, 실물 PNG·학생 화면·A4 및 최종 시각 `DRAWN_FEATURE_PARITY=NOT_RUN`.
- 정적 DRAWN_FEATURE_PARITY: 원문·수식·원본 PNG와 실제 그려지는 plan 필드의 특징 1:1 매핑 `STATIC_MAPPED`; 렌더 전 `PASS`로 오인하지 않음. 원본에 없는 면색·흰색 다각형 배경을 추가하지 않았으며, 확률 영역의 의미 있는 음영·통계 막대 채움만 허용.
- production plan 경로: `archive/tools/geometry-equation/production/plans/비상_확률과통계_확률_익힘책_고2/`. 표의 파일명은 이 디렉터리 기준.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 확률익힘/q01 | 문항 | EXEMPT — 홀수 10개와 세 사건 A·B·C의 배반관계; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q01 | 해설 | PLAN_READY — 10개 원소를 A·B·C의 실제 소속 영역에 배치 | `set-diagram-figure-v1` | `q01-solution.plan.json` | PASS / PASS | STATIC_MAPPED (원소 전체/교집합 필드 대응); RENDER_NOT_RUN |
| 확률익힘/q02 | 문항 | EXEMPT — 시청자 130/200 비율; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q02 | 해설 | EXEMPT — 시청자 130/200 비율; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q03 | 문항 | EXEMPT — 14일의 짝숫날·일요일 합집합; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q03 | 해설 | PLAN_READY — A=7일, B=2일, U=14일의 합집합 구간 · **ENGINE_CAPABILITY_PENDING** A∩B=1일 직접 표기 미지원 | `set-diagram-figure-v1` + `SET_REGION_COUNT_LABEL` | `q03-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING + RENDER_NOT_RUN |
| 확률익힘/q04 | 문항 | EXEMPT — 세 자릿수에 0이 포함될 여사건; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q04 | 해설 | EXEMPT — 세 자릿수에 0이 포함될 여사건; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q05 | 문항 | EXEMPT — 형·동생 카드 3×3 비교; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q05 | 해설 | PLAN_READY — 형 3×동생 3의 아홉 카드 결과와 승리 5경로 | `stat-chart-figure-v1` | `q05-solution.plan.json` | PASS / PASS | STATIC_MAPPED (9개 잎/승리5 경로 정적 매핑); RENDER_NOT_RUN |
| 확률익힘/q06 | 문항 | EXEMPT — 중복 면 주사위 두 개의 같은 눈; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q06 | 해설 | PLAN_READY — 중복 면 가중치를 보존한 4×(같음/다름) 수형도 | `stat-chart-figure-v1` | `q06-solution.plan.json` | PASS / PASS | STATIC_MAPPED (가지 확률/같음4 경로 정적 매핑); RENDER_NOT_RUN |
| 확률익힘/q07 | 문항 | EXEMPT — 14장 중 둘째로 작은 수가 3인 조합; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q07 | 해설 | EXEMPT — 14장 중 둘째로 작은 수가 3인 조합; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q08 | 문항 | EXEMPT — 배반사건 A,B의 확률 연립; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q08 | 해설 | PLAN_READY — 배반인 A,B의 겹치지 않는 두 원과 합집합 | `set-diagram-figure-v1` | `q08-solution.plan.json` | PASS / PASS | STATIC_MAPPED (disjoint·shade 실제 필드); RENDER_NOT_RUN |
| 확률익힘/q09 | 문항 | EXEMPT — 붉은 팔찌가 한 개 이상일 여사건; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q09 | 해설 | EXEMPT — 붉은 팔찌가 한 개 이상일 여사건; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q10 | 문항 | EXEMPT — 작은 귤 2개 이상인 조합; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q10 | 해설 | EXEMPT — 작은 귤 2개 이상인 조합; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q11 | 문항 | EXEMPT — 학생 셋의 0,1,2 합 조건; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q11 | 해설 | EXEMPT — 학생 셋의 0,1,2 합 조건; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q12 | 문항 | EXEMPT — 7장 양면 카드 3장 뒤집기; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q12 | 해설 | EXEMPT — 7장 양면 카드 3장 뒤집기; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q13 | 문항 | EXEMPT — 3권을 5일간 빌리는 제한 순서; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q13 | 해설 | ENGINE_CAPABILITY_PENDING — 다섯 날 도서 대출 조건을 끝까지 이어 5단계 수형도로 보일 엔진 기능 필요 | `STAT_TREE_DEPTH_5` | — | N/A | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN |
| 확률익힘/q14 | 문항 | EXEMPT — 두 반 대표 3명씩 맞지목; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q14 | 해설 | EXEMPT — 두 반 대표 3명씩 맞지목; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q15 | 문항 | EXEMPT — 체험 학습 유형 2×2 분할표; 원문 표는 AP Table Engine 대상이어서 별도 SVG 중복 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q15 | 해설 | EXEMPT — 체험 학습 유형 2×2 분할표; 원문 표는 AP Table Engine 대상이어서 별도 SVG 중복 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q16 | 문항 | EXEMPT — 팥·크림 호두과자 비복원 2회; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q16 | 해설 | PLAN_READY — 팥·크림의 비복원 두 단계 4경로 | `stat-chart-figure-v1` | `q16-solution.plan.json` | PASS / PASS | STATIC_MAPPED (둘째 분모 9/성공 경로 정적 매핑); RENDER_NOT_RUN |
| 확률익힘/q17 | 문항 | EXEMPT — 독립사건의 합집합; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q17 | 해설 | EXEMPT — 독립사건의 합집합; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q18 | 문항 | EXEMPT — 5회 사격 중 4회 명중; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q18 | 해설 | EXEMPT — 5회 사격 중 4회 명중; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q19 | 문항 | EXEMPT — 판매 유형 A,B와 교집합; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q19 | 해설 | PLAN_READY — U100%, A20%, B45%의 교집합 강조 · **ENGINE_CAPABILITY_PENDING** A∩B=10% 직접 표기 미지원 | `set-diagram-figure-v1` + `SET_REGION_COUNT_LABEL` | `q19-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING + RENDER_NOT_RUN |
| 확률익힘/q20 | 문항 | EXEMPT — 당첨 제비가 처음 나오는 회차; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q20 | 해설 | ENGINE_CAPABILITY_PENDING — 제비를 최장 5번째까지 비복원 연속 추첨하는 경로 표현 필요 | `STAT_TREE_DEPTH_5` | — | N/A | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN |
| 확률익힘/q21 | 문항 | EXEMPT — A/B 두 봉지에서 아몬드 확률; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q21 | 해설 | PLAN_READY — 봉지 A/B 후 아몬드/나머지 4경로 | `stat-chart-figure-v1` | `q21-solution.plan.json` | PASS / PASS | STATIC_MAPPED (전확률 두 경로 하이라이트); RENDER_NOT_RUN |
| 확률익힘/q22 | 문항 | EXEMPT — 독립사건과 B의 여사건; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q22 | 해설 | EXEMPT — 독립사건과 B의 여사건; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q23 | 문항 | PLAN_READY — 원본 6×6 도로·P(0,0)·Q(4,2)를 보존 | `lattice-path-figure-v1` | `q23-problem.plan.json` | PASS / PASS | STATIC_MAPPED (격자 84선분·점2개 정적 1:1); RENDER_NOT_RUN |
| 확률익힘/q23 | 해설 | PLAN_READY — 최단경로 15개·예시 4R2U 경로 · **ENGINE_CAPABILITY_PENDING** 오른쪽 1/3·위 2/3 표시 미지원 | `lattice-path-figure-v1` + `LATTICE_EDGE_PROBABILITY_LABEL` | `q23-solution.plan.json` | PASS / PASS | ENGINE_CAPABILITY_PENDING + RENDER_NOT_RUN |
| 확률익힘/q24 | 문항 | EXEMPT — 5회 구매 중 다음 날 배송 2회 이상; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q24 | 해설 | EXEMPT — 5회 구매 중 다음 날 배송 2회 이상; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q25 | 문항 | EXEMPT — AI/사람 글 분류기의 조건부확률; 문장·수식에서 주어진 조건으로 발문 이해 가능하며 추가 독립 도형 불필요 | — | — | N/A | EXEMPT (근거 기반) |
| 확률익힘/q25 | 해설 | PLAN_READY — AI/사람 출처와 AI/사람 판정 4경로 | `stat-chart-figure-v1` | `q25-solution.plan.json` | PASS / PASS | STATIC_MAPPED (AI판정2 경로·사전확률 정적 매핑); RENDER_NOT_RUN |
| 확률익힘/q26 | 문항 | ENGINE_CAPABILITY_PENDING — 원본 q26.png의 8개 선수 원·4→2→1 승자선이 있는 정식 대진표 필요 | `TOURNAMENT_BRACKET_8` | — | N/A | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN |
| 확률익힘/q26 | 해설 | ENGINE_CAPABILITY_PENDING — 같은 대진표 위에서 1회전·준결승·결승까지 A/B 만남 경우를 강조할 기능 필요 | `TOURNAMENT_BRACKET_8` | — | N/A | ENGINE_CAPABILITY_PENDING / RENDER_NOT_RUN |
| 확률익힘/q27 | 문항 | PLAN_READY — 원본 2×2 표·A/B/C/D·행열 4라벨 복원 | `construction-spike-v1` | `q27-problem.plan.json` | PASS / PASS | STATIC_MAPPED (가로3·세로3 경계선, 라벨8개 정적 1:1); RENDER_NOT_RUN |
| 확률익힘/q27 | 해설 | EXEMPT — 2×2 사각형 A·B·C·D 위치 교환; 풀이의 조합·확률 계산 또는 정리된 값만 반복하는 그림은 새 정보가 없어 불필요 | — | — | N/A | EXEMPT (근거 기반) |

## 원본에셋과 필요 엔진 기능 인계

- q23.png: 6×6 전체 도로망의 **84개 한 칸 선분** 및 P(0,0)→Q(4,2) 위치는 원본과 1:1 정적 매핑. 문제에는 경로 수·정답 미노출. 해설에는 15개 경로 수와 한 예시 경로를 그렸으나 각 오른쪽/위쪽 방향에 1/3·2/3을 각도·변 라벨로 표시하는 기능은 미지원으로 보고.
- q26.png: 원본은 8개 원형 선수 자리와 1회전 4→준결승 2→결승 1의 **역방향 토너먼트 브래킷**이다. 일반 `TREE`는 3단계 수형도일 뿐 원본 브래킷의 원·수평연결·대진 구조를 직접 재현하지 못함. 원본과 다른 대충 그린 대체 그림은 만들지 않고 `TOURNAMENT_BRACKET_8` 보강을 인계.
- q27.png: 2×2 표의 6개 경계선, A·B·C·D 문자 및 1행·2행·1열·2열의 네 위치 표기를 `PLANE_FIGURE_v1`의 선분·자유 텍스트로 표현. 불필요한 면 채움 없음.
- q13·q20: 최장 5일·5번째 추첨의 전체 갈래는 `stat-chart-figure-v1`의 3단계 상한을 초과. `STAT_TREE_DEPTH_5` 공통 기능 필요.
- q03·q19: 합집합·교집합의 영역은 그려지지만 교집합의 **1일·10%** 수치를 영역 안에 정확히 표시하는 전용 `SET_REGION_COUNT_LABEL` 필드는 없음. 캡션 숫자를 그림 속 숫자로 둔갑시키지 않음.

## QA 결론

- **54축 전수판정**: 실행형 plan 12, 근거 기반 EXEMPT 38, 엔진 미지원 표식 7축(일부는 plan 작성축과 중복).
- 신규 plan은 형식 검사를 통과했지만 실물 렌더에 의존하는 겹침·글리프 누락·보이는 점선 모양·A4·모바일은 미검사이며 PASS로 기록하지 않음.
- 사용자 승인 렌더 예외: `RENDER_NOT_RUN` 기록 후 구조·스펙 정적 검토와 lint만으로 plan PR 병합 가능. 엔진 확장·실물 렌더·JS 연결·학생 게시 완료와는 별개.
