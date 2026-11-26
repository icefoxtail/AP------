# 2024 연향중 중3 1학기 중간 유사 — SVG plan 문제/해설 2축 감사 q01~q23

## 대상·main·중복 경계

- 원본: `archive/exams/similar/middle/m3/1mid/24_연향중_1학기_중간_중3_유사.js` — q01~q23 정확히 23문항, 문제/해설 각각 23축, 총 46축.
- 작업 직전 `origin/main`: `8cc6ed4e843e9036ed7d7e820378b6663e39dc1b`. 사용자 지정 네 문서와 `AGENTS.md`의 추가 필독을 동일 판본 기준으로 확인했다.
- 열린 PR 68건 중 67건의 변경 파일 목록을 재조회하여 대상 stem과 충돌 없음을 확인. 오래된 CI 전용 PR #956은 GitHub 파일 목록 422(diff too large)로 직접 조회 불가였으므로 미검증 1건으로 구별한다. PR #3143은 2023 왕운중 유사1·2 q13~q24의 Draft/Open으로 이번 대상과 다름.
- 기존 문제용 plan JSON 23개: `q07-problem.plan.json`의 `number-line-figure-v1`, `q23-problem.plan.json`의 `construction-spike-v1`만 실행형 2개. 나머지 21개는 `{"status":"EXEMPT"}` 판정 파일이며 실행형이 아니다. 기존 JSON·JS·SVG·PNG는 수정하지 않았다.
- 신규 실행형 해설 plan은 q07, q17, q22, q23의 4개. 이 감사 기록과 합계 5파일만 변경한다.

## 문항별 문제·해설 독립 판정

| qid | 문제축 판정 및 개별 근거 | 해설축 판정 및 개별 근거 |
| --- | --- | --- |
| q01 | EXEMPT — 제곱근 기호·정의의 참거짓 선택만 요구, 도형 없음 | EXEMPT — 다섯 보기의 실수 제곱근 정의 및 반례가 식·문장으로 충분 |
| q02 | EXEMPT — 17의 양·음 제곱근 곱 계산 | EXEMPT — √17·(−√17)=−17 한 곱셈을 그림으로 반복할 필요 없음 |
| q03 | EXEMPT — a>0에서 절댓값/근호 등식 판정 | EXEMPT — 각 부호와 절댓값 등식을 문자로 명시해 시각관계 없음 |
| q04 | EXEMPT — 실수의 대소를 제곱·음양으로 비교하는 선택형 | EXEMPT — 각 선지를 비교한 대수식으로 충분, 별도 수직선은 중복 |
| q05 | EXEMPT — 유리수/무리수 및 소수 분류 선택형 | EXEMPT — √12만 무리수라는 계산·분류로 완결 |
| q06 | EXEMPT — √3과 √5 사이 무리수의 대수적 선지 비교, 문제 수직선에 평균 정답을 찍으면 노출 | EXEMPT — 평균의 사이값 성질과 무리수 증명이 식으로 완결; 서로 다른 근호의 평균을 임의 근삿값으로 시각화하지 않음 |
| q07 | **REQUIRED** — 정사각형 ABCD의 대각선을 수직선에 옮기는 위치 그림이 발문의 기하 조건; 기존 실행형·SVG 유지 | **BENEFICIAL** — B=2에서 호 반지름 √2를 오른쪽으로 옮겨 P=2+√2를 풀이값으로 표시; 신규 `q07-solution.plan.json` |
| q08 | EXEMPT — 다섯 근호 대소 비교가 문자만으로 완비 | EXEMPT — 공통항 제거 후 제곱 비교로 충분 |
| q09 | EXEMPT — √75−3√3의 단순 정리 | EXEMPT — 5√3−3√3=2√3의 식 한 줄로 완결 |
| q10 | EXEMPT — 세 근호의 곱과 계수 a 계산 | EXEMPT — 소인수 분해 2×70²의 식이 핵심, 그림 중복 |
| q11 | EXEMPT — 유리화 뒤 계수 a,b 결정 | EXEMPT — −2+√3으로 직접 정리한 뒤 a+b 계산 |
| q12 | EXEMPT — 근호·분수 전개 후 동류항 수치 계산 | EXEMPT — √2·√6 두 동류항 계수 분리가 풀이에 명시됨 |
| q13 | EXEMPT — x±y의 근호 합차를 계산하는 대수 문제 | EXEMPT — x+y=√7, x−y=√3을 곱한 식으로 충분 |
| q14 | EXEMPT — 다항식 계수와 상수항 차이가 8인 조건 | EXEMPT — 12−2a와 −4a를 대조한 일차방정식으로 완결 |
| q15 | EXEMPT — 전개식 다섯 개의 x 계수 절댓값 비교 | EXEMPT — 각 계수를 순서대로 열거해 비교하는 표면 계산 |
| q16 | EXEMPT — 완전제곱식 계수 조건 | EXEMPT — ±14 계수 두 경우 계산이 핵심, 면적 그림은 중복 |
| q17 | EXEMPT — −2<a<5 조건 자체가 문제에 완전 제시, 열린 구간 그림은 풀이 전 힌트가 됨 | **BENEFICIAL** — 수직선의 열린 구간 (−2,5)로 a−5<0·a+2>0의 부호 판정을 보여줌; 신규 `q17-solution.plan.json` |
| q18 | EXEMPT — 인수분해 진위 다섯 식 비교 | EXEMPT — 곱을 전개한 계수 직접 대조로 완결 |
| q19 | EXEMPT — t=x+2y 치환하여 인수분해하는 문자식 | EXEMPT — (3t−5)(t+1)에서 다시 x,y로 돌아오는 식이 충분 |
| q20 | EXEMPT — 합차 공식 반복에 의한 거듭제곱 계산 | EXEMPT — 1−a²→1−a⁴→…→1−a⁶⁴가 풀이에 보임 |
| q21 | EXEMPT — 유리수 조건에서 무리수 계수 0 결정 | EXEMPT — (−18−4a)+(3+a)√3의 계수 조건으로 완결 |
| q22 | EXEMPT — 두 상자의 밑면 30·50, 높이 10, 중앙 배치, 십자 묶기 조건을 문장이 설명; 문제 그림은 필요한 비스듬한 풀이 경로를 미리 부각할 수 있음 | **BENEFICIAL** — 큰 상자 위에 작은 상자를 둔 한 방향 단면과 끈 경로, 가로·세로 10인 직각삼각형의 사선 10√2를 시각화; 신규 `q22-solution.plan.json` |
| q23 | **BENEFICIAL** — 변이 x,y인 두 정사각형의 대상 구별이 유익; 기존 실행형 plan 및 현재 SVG 유지 | **BENEFICIAL** — (x+y)²=x²+xy+xy+y² 분할로 x²+y²=125 및 2xy=100의 관계 확인; 신규 `q23-solution.plan.json` |

**집계:** REQUIRED 1 / BENEFICIAL 5 / EXEMPT 40 = 46축. 실행형 총 6개(기존 유지 2 + 신규 4), 기존 교정 0. 21개 EXEMPT 자리표시자는 실행형에 포함하지 않는다.

## 원문 ↔ 수학 모델 ↔ 실제 spec 필드 대조

| 축 | capability | 독립 수학 점검 | 공식 엔진 정적 그리기 사양(`spec`) 확인 | 최종 패리티 |
| --- | --- | --- | --- | --- |
| q07 문제 | `number-line-figure-v1` | B=2, BD=√(1²+1²)=√2, P=2+√2, P는 B 오른쪽 | `r1-src-c1` 1×1 모눈, 대각선, 오른쪽 호 1개, B/P 점. P 값 `valueHidden:true`이므로 문제 정답 비노출 | NOT_VERIFIED (기존 SVG 유지, 이번 재렌더·학생 화면 미실시) |
| q07 해설 | `number-line-figure-v1` | 같은 길이·위치, 정답값 2+√2는 해설에서 허용 | 같은 grid/arc 및 P의 `r1-pt-P-value` 라벨이 새로 등장, B/P 값 동시 노출 | NOT_VERIFIED |
| q17 해설 | `number-line-figure-v1` | −2<a<5이므로 a−5<0, a+2>0, 정리 결과 −2a+3 | `r1-band-1` −2→5, `r1-end-1-lo/hi` OPEN 2개, −2·5 값 라벨, a축 | NOT_VERIFIED |
| q22 해설 | `construction-spike-v1` | 수평 중심 여백 (50−30)/2=10, 높이 차 10, 사선 √200=10√2; 한 방향 100+20√2, 두 방향+매듭 230+40√2 | SOURCE_POINT 8개, 그려지는 SEGMENT 11개, `DIMENSION_LINE` 5개(50,30,10,10,10√2), `ANGLE_MARK` raF 1개, BLUE 끈 경로 6선분 | NOT_VERIFIED / 실제 렌더 ENV_BLOCKED |
| q23 문제 | `construction-spike-v1` | x+y=15, x²+y²=125; 본문에서 x,y의 순서는 미지, 기존 6:4는 수치 조건이 아닌 그림용 표본 배치 | 두 정사각형의 SEGMENT 8개와 x,y 치수선 2개, 정답 숫자 없음. 기존 SVG의 선·치수 id는 확인했으나 교과 원문 이미지와 실물 화면 대조는 미실시 | NOT_VERIFIED |
| q23 해설 | `construction-spike-v1` | xy=((x+y)²−(x²+y²))/2=(225−125)/2=50; 16xy=800, x,y는 10·5 또는 5·10 | SOURCE_POINT 9개, SEGMENT 12개, DIMENSION_LINE 4개(x,y,x,y), FILL_REGION 4개(x²,xy,xy,y²). 좌표 10:5는 실제 유도된 두 순서 중 한 대표 배치 | NOT_VERIFIED |

q22 도식의 사선은 해설 풀이가 제시한 한 방향 단면 경로를 그린 것이다. 3차원 입체 전체나 십자 끈의 두 방향을 재현했다고 주장하지 않는다. 해설용 도식은 원문에 없는 새로운 길이 조건을 추가하지 않으며, 면 채움은 q23의 네 넓이 구획에만 사용했다.

`spec`의 필드 존재와 수학값을 확인한 것과 **실제 SVG 파일에 그려진 시각적 패리티를 확인한 것은 다르다.** 최종 `DRAWN_FEATURE_PARITY PASS`를 0축으로 두고, 실행형 6축 모두 NOT_VERIFIED로 보존한다.

## 공식 lint와 렌더 실행

- 공식 검사기: `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs`. 27개 전체 `*.plan.json`을 명시 호출했다.
- shallow: JSON 전체 **27/27 OK**; 실제 실행형 **6/6 PASS**; EXEMPT 판정용 **21/21 OK**.
- full: 저장소 잠금 해시가 일치하는 공식 NotoSansKR 폰트(SHA256 `194018e6…`)·공식 노드 패키지로 재검사, 전체 **27/27 OK**, 실행형 **6/6 PASS**, 판정용 **21/21 OK**. 중간 환경 의존성 오류/`SKIP`을 복원 후 재실행했으며 최종 결과 FAIL 0/SKIP 0/lint ENV_BLOCKED 0.
- 실제 렌더 시도: 공식 `production/render-plan.mjs`로 q22 해설을 호출. `/usr/bin/chromium` 실행 시 Playwright `browserType.launch: Target page, context or browser has been closed`와 `ARCHIVE_PREFLIGHT_FAIL`이 발생. 시스템 `/usr/lib/chromium/chromium` 실체가 없음. q22 해설 렌더 **ENV_BLOCKED**, SVG/PNG 실물 미생성.
- 나머지 5축의 이번 회차 재렌더는 **NOT_RUN**. 6축의 SVG·PNG 그리기 대상 최종 실물 대조, 학생 화면과 A4 렌더: **NOT_VERIFIED**. 기출/유사의 기존 SVG를 새로 수정하지 않음.
- 신규 `ENGINE_CAPABILITY_PENDING`: **0축**. 신규 `EVIDENCE_DEBT`: **0축**. 브라우저 부재는 엔진 capability 부족과 구분한다.

## 직전 회차 및 기존 별도 미해결 (이번 분모 합산 금지)

- **직전 2024 신흥중 실행형 5축**(q06 문제·해설, q07 해설, q18 해설, q24 해설): 정적 spec 5/5, full lint 5/5, 최종 패리티 NOT_VERIFIED 5, q24 렌더 ENV_BLOCKED.
- 삼산중 q19 문제·q21 문제·q23 해설: 이전 환경에서 full lint ENV_BLOCKED 3, 패리티 NOT_VERIFIED 3. q21 교정 plan 기준 SVG 재생성 필요.
- 금당중 q05 문제: 원본 직각삼각형 그림 부족 EVIDENCE_DEBT 1; 금당중 q11 문제 full lint ENV_BLOCKED·패리티 NOT_VERIFIED.
- 향림중 q15·q19 문제: 이전 full lint ENV_BLOCKED·패리티 NOT_VERIFIED.
- 왕운중 유사3 q23 문제·해설: 실제 정사각형 좌우 배치 증거 EVIDENCE_DEBT 2.
- 풍덕중 유사1 q21 해설: 수직선 소문자 a,b,c 라벨 ENGINE_CAPABILITY_PENDING 1.
- PR #3143: 2023 왕운중 유사1·2 q13~q24 Draft/Open, 타 라인 소유로 중복 작업 금지.

## 다음 대상 후보 (새 회차 실행 시 재확인)

1. `archive/exams/similar/middle/m3/1mid/24_왕운중_1학기_중간_중3_유사.js`: 기존 `visual-two-axis-review-q01-q10.json`에 q01~q10 20축 검수 기록 있음. 남은 **q11~q23, 13문항**.
2. 20문항 하한을 위해 연결: `archive/exams/similar/middle/m3/1mid/24_이수중_1학기_중간_중3_유사.js`: **q01~q12, 12문항** (25문항 중 이 회차 처음 12문항).

예상 다음 묶음 25문항/50축. 시작 시 latest main/open PR/해당 심사 기록을 재조회하여 완료·점유 축을 제외하고, 정확한 다음 20~30문항으로 조정한다.
