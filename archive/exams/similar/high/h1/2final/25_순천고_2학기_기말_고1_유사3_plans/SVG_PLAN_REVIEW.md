# 순천고 고1 2학기 기말 유사3 — 문제·해설 2축 플랜 정밀검수

- 대상: `archive/exams/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사3.js`, Q01–Q23 (23문항, 46축)
- 역할: 공식 엔진용 JSON 플랜 작성·lint·원문→그려지는 필드 검수만 담당. SVG 렌더·학생 화면·A4 게시 작업은 별도.
- 새 계획 경로 `N/`: 이 파일과 같은 `25_순천고_2학기_기말_고1_유사3_plans/` 폴더.
- 기작성 운영 자산의 원계획 경로 `L/`: `docs/plans/archive-one-route-upgrade/svg-plans-expanded/similar/high/h1/2final/25_순천고_2학기_기말_고1_유사3/`. 기존 자산을 중복 제작하지 않음.
- `S/F`는 공식 `plan-lint.cjs --shallow` / 기본 full 검사. `—`는 실제 제작용 plan이 불필요한 EXEMPT이며 lint/PARITY의 분모에 넣지 않음.
- `DRAWN_FEATURE_PARITY`는 SVG 화소·렌더 검수가 아닌 현행 문제/해설과 공식 plan의 **실제로 그려지는 필드** 비교이다. `EXEMPT`는 수학·교육적 사유를 기록한다.

| 파일/qid | 축 | 판정·개별 사유 | capability | plan 경로 | S/F | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 유사3/Q01 | 문제 | EXEMPT — 명제 판별은 문장·식의 참거짓만 묻는다 | — | — | — | — |
| 유사3/Q01 | 해설 | EXEMPT — 각 선지의 참거짓 설명이 완결되어 그림은 반복이다 | — | — | — | — |
| 유사3/Q02 | 문제 | EXEMPT — 두 진리집합의 정의와 수치가 발문에 충분하다 | — | — | — | — |
| 유사3/Q02 | 해설 | BENEFICIAL — 근 -1·6과 중심 2 사이의 최대 거리 4 | number-line-figure-v1 | N/q02-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q03 | 문제 | EXEMPT — 두 무리식의 실수 조건을 직접 계산한다 | — | — | — | — |
| 유사3/Q03 | 해설 | BENEFICIAL — -5/2≤x<4의 교집합과 정수 여섯 개 | number-line-figure-v1 | L/q03-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q04 | 문제 | REQUIRED — 발문이 가리키는 대응도 자체가 함수값 자료 | set-diagram-figure-v1 | L/q04-problem.plan.json | PASS/PASS | PASS |
| 유사3/Q04 | 해설 | BENEFICIAL — g의 역방향 및 f→g 합성 경로 | set-diagram-figure-v1 | L/q04-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q05 | 문제 | EXEMPT — 양화사·논리연결사 부정의 문장 판별 | — | — | — | — |
| 유사3/Q05 | 해설 | EXEMPT — 드모르간 변환 문장·부등식만으로 완결 | — | — | — | — |
| 유사3/Q06 | 문제 | EXEMPT — Pᶜ⊆Q의 해석은 발문과 보기 식으로 결정 | — | — | — | — |
| 유사3/Q06 | 해설 | BENEFICIAL — 기존 P∪Q 음영은 U의 바깥 공백을 남겨 오독 소지, Pᶜ⊆Q 중첩 포함도로 교체 설계 | set-diagram-figure-v1 | N/q06-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q07 | 문제 | EXEMPT — 정의역·주어진 점으로 매개변수를 결정, 그래프는 정답 정보 선공개 우려 | — | — | — | — |
| 유사3/Q07 | 해설 | BENEFICIAL — 시작점 (-3,3)·통과점 (5,-1)·치역 | sqrt-affine-spike-v1 | L/q07-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q08 | 문제 | EXEMPT — 주어진 구간과 일차함수 조건이 유일하다 | — | — | — | — |
| 유사3/Q08 | 해설 | BENEFICIAL — 감소 직선의 두 끝점 (-1,7)·(3,-1) | piecewise-polynomial-spike-v1 | L/q08-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q09 | 문제 | EXEMPT — 실수 전체의 역함수 조건을 식으로 명시 | — | — | — | — |
| 유사3/Q09 | 해설 | BENEFICIAL — 구간 경계와 b=1 예시에서의 일대일성 | piecewise-polynomial-spike-v1 | L/q09-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q10 | 문제 | REQUIRED — f의 반복 대응은 주어진 그래프를 읽어야 알 수 있음 | piecewise-polynomial-spike-v1 | L/q10-problem.plan.json | PASS/PASS | PASS |
| 유사3/Q10 | 해설 | BENEFICIAL — c→b→a로 역방향을 두 번 추적 | piecewise-polynomial-spike-v1 | L/q10-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q11 | 문제 | EXEMPT — 집합 조건과 ㄱㄴㄷ이 모두 식으로 제시됨 | — | — | — | — |
| 유사3/Q11 | 해설 | BENEFICIAL — R⊆Pᶜ⊆Q의 포함 사슬 | set-diagram-figure-v1 | L/q11-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q12 | 문제 | EXEMPT — 역함수 반복 대입의 단순 대수 계산 | — | — | — | — |
| 유사3/Q12 | 해설 | EXEMPT — f(7)=1, f(19)=7을 해설 식에서 바로 확인 | — | — | — | — |
| 유사3/Q13 | 문제 | REQUIRED — 점근선과 (0,1)이 발문의 '그림'에 포함된 자료 | rational-spike-v1 | L/q13-problem.plan.json | PASS/PASS | PASS |
| 유사3/Q13 | 해설 | BENEFICIAL — 구한 함수와 f(-6)=4의 좌표 결속 | rational-spike-v1 | L/q13-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q14 | 문제 | EXEMPT — 미지 k의 경계 그래프를 주면 답의 단서를 선공개 | — | — | — | — |
| 유사3/Q14 | 해설 | BENEFICIAL — k=6에서 (0,0)에 닿는 분기 | rational-spike-v1 | L/q14-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q15 | 문제 | EXEMPT — f의 식·정의역과 교점 수로 결정 | — | — | — | — |
| 유사3/Q15 | 해설 | BENEFICIAL — a=6 예시의 f·역함수와 y=x 두 교점 | multi-curve-figure-v1 | L/q15-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q16 | 문제 | EXEMPT — 귀류법 증명 상자의 빈칸은 식·짝홀성 판정 | — | — | — | — |
| 유사3/Q16 | 해설 | EXEMPT — 4r²와 2r²의 식 변화만으로 모순이 충분 | — | — | — | — |
| 유사3/Q17 | 문제 | EXEMPT — 원함수·직선의 식으로 교점 최댓값을 추론 | — | — | — | — |
| 유사3/Q17 | 해설 | BENEFICIAL — 임계 기울기 1/2와 비교직선의 교점 수 | multi-curve-figure-v1 | L/q17-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q18 | 문제 | EXEMPT — 곡선·원의 식을 모두 제시하며 교점 사각형을 미리 보이는 것은 풀이 구조 선공개 | — | — | — | — |
| 유사3/Q18 | 해설 | BENEFICIAL — 원·유리곡선·A(2,5), B(3,4), C(0,1), D(-1,2) 및 직사각형 | rational-spike-v1 | L/q18-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q19 | 문제 | EXEMPT — 분수 최댓값의 대수적 변환 | — | — | — | — |
| 유사3/Q19 | 해설 | EXEMPT — 산술기하평균 등호 조건이 식으로 완결 | — | — | — | — |
| 유사3/Q20 | 문제 | EXEMPT — 4장의 카드 조건은 문장으로 정확히 주어짐, 카드 그림은 장식 | — | — | — | — |
| 유사3/Q20 | 해설 | EXEMPT — 가능한 뒤집기 네 경우와 합을 텍스트로 이미 나열 | — | — | — | — |
| 유사3/Q21 | 문제 | EXEMPT — 미지의 f·g 대응도를 보여 주면 (1)~(3) 풀이값을 노출 | — | — | — | — |
| 유사3/Q21 | 해설 | BENEFICIAL — 유일한 순열 f=(1,3,2), g=(2,1,3)의 6화살표 | composite-panels-v1 / set-diagram-figure-v1 | N/q21-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q22 | 문제 | EXEMPT — 구간별 함수식이 모두 제공됨 | — | — | — | — |
| 유사3/Q22 | 해설 | BENEFICIAL — f∘f의 세 일차 구간·경계 0,1 | piecewise-polynomial-spike-v1 | L/q22-solution.plan.json | PASS/PASS | PASS |
| 유사3/Q23 | 문제 | EXEMPT — (1)이 바로 그래프 작도 과제이므로 문제 그림으로 정답을 줄 수 없음 | — | — | — | — |
| 유사3/Q23 | 해설 | REQUIRED — 두 무리함수 가지, 각각의 끝점과 k=3/4·5/4 접선 경계 | composite-panels-v1 / multi-curve-figure-v1 | N/q23-solution.plan.json | PASS/PASS | PASS |

## 원문 → DRAWN_FEATURE_PARITY 독립 대조

| 신규 qid·축 | 원문·해설의 실수/관계 | 실제 렌더 가능한 필드 | 독립 계산·제약 |
| --- | --- | --- | --- |
| Q02 해설 | q의 두 근 -1,6; `|x-2|≤a`; 최소 정수 a=4 | `numberLine.rows[0].pieces[0]`은 [-2,6] 양끝 닫힘, `rows[1].points[A,B,C]`는 -1,2,6 | (-1-2)의 절댓값=3, (6-2)의 절댓값=4. 숫자·방향 모두 실제 눈금/점 필드 |
| Q06 해설 | `P^c⊆Q` | `diagram.sets`의 `P^{c}`·`Q`, `diagram.subset:["A","Q"]` | 작은 Pᶜ 원 전체가 큰 Q 원 안. 불필요한 면 채움 없음. 예전 `shade:P∪Q`만으로 P∪Q=U를 정확히 나타낼 수 없는 결함 수정 |
| Q21 해설 | f(2)=3; g(f(1))=2; f(g(2))=1; f,g 모두 1:1 | 첫 패널 f의 `arrows`: 1→1, 2→3, 3→2; 둘째 패널 g의 `arrows`: 1→2, 2→1, 3→3 | 3!×3! = 36쌍을 독립 열거해 단 한 쌍만 원 조건을 만족함 확인. 조건 충족, 합성·역함수 수치와 일치 |
| Q23 해설 | f의 두 정의역 x≤0, x≥1; 주요 점 6개; k=3/4와 5/4의 접점 | 2패널 각각 `curves[left,right]` 실제 `SQRT` 라디칸드·부호·영역; `overlays.points[L0,L1,L4,R1,R2,R5]`; `curves[tangentLeft/Right]`의 기울기 1, 절편 3/4·5/4; `points[TL/TR]` 및 좌표 `callouts` | 좌측 접점 (-1/4,1/2), 우측 (5/4,5/2)를 직접 대입·미분으로 검산. k=1의 4교점은 캡션·해설에서 제외 이유로 명시하며 그림에 그렸다고 주장하지 않음 |

## 검증·후속

- 신규 렌더 가능 플랜 4개: 공식 `plan-lint --shallow` 4/4 PASS, 공식 full 4/4 PASS. 엔진/폰트 의존성은 공식 `production/setup-spikes.mjs`를 이용해 잠금버전 설치 후 실행했다.
- 기존 SVG와 함께 이미 들어온 원계획 17개는 재작성하지 않았다. 그중 Q06 기존 계획은 의미 표현을 교체하므로 **유효 원계획 16개**. 이 16개도 같은 실행환경에서 shallow/full 모두 PASS했다(전체 구계획 18개 모두 lint PASS였으나, Q06은 내용 표현이 부적절하고 Q23은 신규 계획으로 승계).
- 기존 16개에 대해 현행 JS의 각 그래프/좌표/화살표/집합 포함/선분을 원계획의 그려지는 필드에 비교했다. 이 품질판정은 `plan-lint` 통과만을 근거로 하지 않는다.
- 총 23문항/46축: REQUIRED 4축(Q04 문제, Q10 문제, Q13 문제, Q23 해설), BENEFICIAL 16축, EXEMPT 26축. 유효 제작 플랜 20축(신규4 + 기존16); shallow/full 20/20; 필드 PARITY 20/20; ENGINE_CAPABILITY_PENDING 0축.
- 질문 그림에서 미지 정답·풀이 완성 좌표 선노출 0건(기존 문제 그림 3개는 Q04, Q10, Q13의 **발문 제공 정보**); 신규 플랜의 무근거 면색 0건.
- **그림 제작/재제작 필요:** Q02 해설 신규, Q06 해설 기존 학생 SVG 교체, Q21 해설 신규, Q23 해설 신규. 원본 JS 자산 참조는 후속 공식 엔진 렌더·PNG 눈검수 전까지 그대로 둔다.
- **렌더/PNG/학생 화면/A4:** 신규 4개 모두 `NOT_RUN`. 여기서 최종 학생 그림 품질 또는 게시 완료를 선언하지 않는다. 기존 이미지도 이번 배치에서는 화면/인쇄를 재검수하지 않았다.
