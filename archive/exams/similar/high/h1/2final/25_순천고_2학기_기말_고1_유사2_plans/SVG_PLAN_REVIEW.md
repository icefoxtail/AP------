# 2025 순천고 고1 2학기 기말 유사2 — 문제·해설 2축 실행 plan 검수

- 대상: `archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사2.js`, Q01~Q23 (23문항/46축).
- 원문 JS Git blob 직접 대조: `4d16de185d28a73b28624059b6f040241eed5fad`.
- 최초 원격 main SHA: `1f90e0022dc3ca7008b7d7aceab748871288ba07`. 제일고 1학기 중간 22문항은 별도 열린 PR #3056이 담당하고 있어 제외. 순천고 유사2의 새 `_plans` 폴더와 겹치는 열린 PR 없음.
- 변경 범위: 신규 실행 plan JSON 3개와 이 2축 판정 장부뿐. 기존 연결 SVG, 시험지 JS, 엔진, 타 시험지, 유형은행, 교과서 모두 미수정. 기존 SVG는 중복 제작하지 않고 기존 자산 재렌더/실물 품질 `NOT_RUN`으로 정확히 구분.

| qid | 문제 축 판정·개별 사유 | 해설 축 판정·개별 사유 | 신규 plan 또는 기존 자산 | 신규 PARITY |
| --- | --- | --- | --- | --- |
| Q01 | EXEMPT — 조건의 개념을 문장·수식으로 구별하는 문제 | EXEMPT — 보기의 명제·조건을 사례로 직접 분류하며 중복 도식 불필요 | — | N/A |
| Q02 | EXEMPT — 두 진리집합을 구간·방정식으로 완전하게 제시 | EXEMPT — q의 근 −2,3을 p 구간에 포함하는 정수 a 세 개를 부등식으로 직접 셈 | — | N/A |
| Q03 | EXEMPT — 분자·분모의 근호 실수 조건이 식으로 완결 | BENEFICIAL — −2≤x<6의 정수 후보와 열린 끝점; 기존 해설 SVG | 기존 `q03-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q04 | REQUIRED — 발문이 f, g의 실제 대응도 그림을 조건으로 사용 | BENEFICIAL — g(5)=9에서 f(a)=5, a=3으로 거꾸로 따라가는 경로; 기존 SVG | 기존 `q04-problem.svg`, `q04-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q05 | EXEMPT — 부정 대상 구간 −1<x≤4를 식으로 명시 | BENEFICIAL — 원래 구간과 여집합 x≤−1 또는 x>4의 두 구간·끝점 변환 | `q05-solution.plan.json` | PASS |
| Q06 | EXEMPT — p가 ¬q의 필요조건이라는 논리 조건이 완결 | BENEFICIAL — Qᶜ⊆P에서 P∪Q=U인 영역 관계; 기존 SVG | 기존 `q06-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q07 | EXEMPT — 정의역·치역 경계가 식으로 주어짐 | BENEFICIAL — 왼쪽으로 열린 무리함수의 시작점(3,−5)과 방향; 기존 SVG | 기존 `q07-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q08 | EXEMPT — 미지 a의 그래프를 특정하면 결과 노출 | BENEFICIAL — x≥2 정의역의 감소 직선과 y≤1 치역·끝점; 기존 SVG | 기존 `q08-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q09 | EXEMPT — 계수 a,b 미정인 구간별 그래프를 선확정할 수 없음 | BENEFICIAL — x=1 양쪽 치역을 겹치지 않게 이은 역함수 가능성; 기존 SVG | 기존 `q09-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q10 | REQUIRED — 원래 그래프와 y=x가 합성 조건의 그림 자체 | BENEFICIAL — 거꾸로 e←d←c←b의 3단 합성 추적; 기존 SVG | 기존 `q10-problem.svg`, `q10-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q11 | EXEMPT — P,Q,R에 대한 집합식이 조건으로 주어짐 | BENEFICIAL — 포함 사슬 P⊆Q⊆R과 대우 판정; 기존 SVG | 기존 `q11-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q12 | EXEMPT — 역함수 관계를 하나의 식으로 제시 | EXEMPT — f⁻¹(7)=5의 직접 대수 대입이 해설을 완결 | — | N/A |
| Q13 | REQUIRED — 유리함수 그래프에서 점근선과 통과점을 읽어야 함; 기존 SVG | BENEFICIAL — x=1, y=−2, (0,3)으로 함수식 도출; 기존 SVG | 기존 `q13-problem.svg`, `q13-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q14 | EXEMPT — 미지 a의 곡선을 그리면 묻는 경계값을 미리 알림 | BENEFICIAL — 제3사분면 회피와 x<0에서 y의 하한; 기존 SVG | 기존 `q14-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q15 | EXEMPT — a 미정인 교점 두 개를 위치 고정하면 정답 노출 | BENEFICIAL — 역함수의 y=x 위 교점, PQ=2√2; 기존 SVG | 기존 `q15-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q16 | EXEMPT — 홀수 제곱 및 모순 증명이 문자식으로 완전 제시됨 | EXEMPT — 차 12a=4×3a와 짝수/홀수 모순을 그림으로 다시 쓰면 중복 | — | N/A |
| Q17 | EXEMPT — k 미정인 두 교점 그래프를 그리면 조건 해석 선공개 | BENEFICIAL — 절댓값 무리함수의 두 가지와 직선의 교점 수·접점; 기존 SVG | 기존 `q17-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q18 | EXEMPT — r 미정의 원과 유리함수를 교점에 맞추면 결과 유출 | BENEFICIAL — x−2=u, y−3=1/u와 중심원, 2점 거리 관계; 기존 SVG | 기존 `q18-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q19 | EXEMPT — 최솟값 점을 문제에서 미리 그리면 답 노출 | BENEFICIAL — 원래 유리식 그래프의 최저점 M(5,8)과 x=2 정의역 경계·비스듬한 기준선 | `q19-solution.plan.json` | PASS |
| Q20 | EXEMPT — 카드 네 장의 논리 조건은 문장으로 완결 | EXEMPT — 가능한 뒤집은 집합 네 경우와 합 15,17,18,22가 해설에 이미 정확히 열거되어 별도 SVG는 중복 | — | N/A |
| Q21 | EXEMPT — f,g 미정의 1:1 대응을 주어진 조건 외에 그리면 답 선공개 | BENEFICIAL — 두 일대일대응 및 (f∘g)(1)의 3열 합성 경로 | `q21-solution.plan.json` | PASS |
| Q22 | EXEMPT — 구간별 함수가 식으로 주어지고 그래프를 묻지 않음 | BENEFICIAL — 두 번 합성할 때 안쪽 값의 부호별 분기와 경계; 기존 SVG | 기존 `q22-solution.svg` | EXISTING_ASSET/NOT_RUN |
| Q23 | EXEMPT — 발문 (1)이 직접 그래프를 그리라는 문제라 미리 제시하지 않음 | BENEFICIAL — 두 무리함수 가지와 y=−x+k가 네 점에서 만나는 조건; 기존 SVG | 기존 `q23-solution.svg` | EXISTING_ASSET/NOT_RUN |

**판정 분모**: 문제 REQUIRED 3(모두 기존 문제 SVG 연결), EXEMPT 20 = 23. 해설 BENEFICIAL 18(기존 해설 SVG 15 + 신규 실행 plan 3), EXEMPT 5 = 23. 기존 연결 SVG 총 18축. 판정 누락 0.

## DRAWN_FEATURE_PARITY — 독립 계산과 실제 엔진 표시 필드 1:1

| 신규 실행 plan | 원문 조건으로부터 독립 재계산 | 실제 그려지는 필드 | 판정 |
| --- | --- | --- | --- |
| `q05-solution` | 원래 −1<x≤4의 여집합은 x≤−1 또는 x>4. x=−1은 부정에 포함하고 x=4는 제외 | `numberLine.rows[0].pieces=(-1,4]`, `rows[1].pieces=(-∞,-1]∪(4,∞)`, 정확히 뒤집힌 OPEN/CLOSED 네 끝점 및 두 SET 줄 | PASS |
| `q19-solution` | (x²−2x+9)/(x−2)=x+9/(x−2). x>2에서 원래 함수−8=(x−5)²/(x−2)≥0이며 유일한 최솟점 (5,8) | `graphPlan.curves[objective]` 실제 2차분자 `[9,-2,1]`·일차분모 `[-2,1]`, x=2 OPEN, `curves[oblique]` 점선 y=x, `overlays.points[M]=(5,8)`, x=5/y=8 눈금 | PASS |
| `q21-solution` | X={1,2,3}의 6×6 순열쌍을 모두 검사해 조건의 유일한 해 f=(1,3,2),g=(2,1,3). f∘g: 1→2→3, g⁻¹(3)=3, g(f(3))=1 | `diagram.kind=MAPPING`, X→X→X 세 열의 원소 1·2·3, 실제 `arrows` 6개가 g·f 일대일대응 각각 3개, `arrowGroups`와 `highlightPaths[1,2,3]` | PASS |

- 독립 검사 스크립트는 커밋하지 않은 임시 파일로 실행했다. Q05 구간 여집합의 표본점, Q19의 항등식과 양수 구간 최소, Q21의 **두 순열 전수 열거**를 원문에서 재계산한 뒤 plan의 실제 `pieces`, `curves`, `points`, `arrows` 필드와 대조함. 세 plan 모두 `DRAWN_FEATURE_PARITY PASS`.
- 문제 그림에 미지 답·새 풀이 도형을 그리지 않음. 3개 신규 plan 모두 불필요한 `shade`·`regions`·채운 다각형 없음(곡선/구간/화살표 선 색은 면 채움이 아님). 요구된 좌표·선·점·라벨·표시 구간을 1:1 확인. 이 세 문제의 별도 각·직각표식·변 길이·비율 표시는 N/A.
- `ENGINE_CAPABILITY_PENDING`: 0. 실제 SVG 렌더·PNG·학생 화면·A4·JS 연결 여부는 **NOT_RUN**. PARITY는 그래픽 출력 가능 필드의 수학적 일치이지 학생 화면 실물을 확인했다는 뜻이 아니다.

## 공식 plan-lint

- shallow: `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사2_plans/*.plan.json` ⇒ **3 OK / 0 FAIL / 0 SKIP**.
- full: 동일 명령에서 `--shallow` 제거 ⇒ **3 OK / 0 FAIL / 0 SKIP**.
- 고정 버전 npm runtime은 `runtime-package-lock.json`으로 `npm ci`, 공식 NotoSansKR.ttf SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` 실측 일치. `.tmp` 의존성·검산 스크립트는 Git에 포함하지 않음.
- 원본 JS/기존 SVG/엔진/유형은행·교과서 미변경, 새 SVG·PNG·가짜 EXEMPT JSON 0건.
