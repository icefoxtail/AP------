# 2021 향림중 2학기 중간 중3 — 문제/해설 도식 1:1 검수

- 원천: `archive/exams/original/middle/m3/2mid/21_향림중_2학기_중간_중3_수학.js` q01~q25, 원본 `archive/assets/images/21_향림중_2학기_중간_중3_수학/` PNG와 기존 SVG.
- 범위: **25문항 × 2축 = 50축**. 상대 plan 경로는 이 문서 폴더 안의 실제 JSON이다.
- 신규 plan 37개 모두 `plan-lint.cjs --shallow`와 full 검사 **OK**. `sourceVsPlan=REVIEWED`는 원문/선지/해설·소스 PNG·기존 SVG와 실제로 그려지는 `nodes/segments/planeMarks/graphPlan` 필드를 대조한 정적 판정이다.
- **DRAWN_FEATURE_PARITY=FIELD_PASS는 렌더 전 정적 조건 대응 합격**. 모든 신규 plan의 **render/PNG/학생화면/A4=NOT_RUN**이고 게시된 SVG가 아니다. 수학적으로 주어지지 않은 수치는 대표 배치·보기용으로만 사용하고 문제 축에 답 수치를 노출하지 않았다.
- **ENGINE_CAPABILITY_PENDING**은 plan 자체의 모델 검사가 OK더라도 원본 1:1 구성의 일부가 현 엔진 한 종류로 재현되지 못한 경우이며, 원본 보기는 그대로 두고 후속 엔진 개발을 요구한다.
- 기본은 흰 바탕/면 채움 없음. 기하학적 음영을 요구하지 않은 q07·q16·q17·q25의 기존 해설 SVG 무분별한 회색·청색·주황 채움은 새 계획에서 모두 제거한다.

| 파일/qid | 축 | 기존 결함 / 판정 | capability | plan 경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 향림/q01 | problem | 문자식만 있어 그림이 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q01 | solution | 꼭짓점 (0,3) 성질을 도식화하는 보충 그림 | polynomial-spike-v1 | `q01-solution.plan.json` | OK/OK | FIELD_PASS: y=2x²+3·위쪽 개형·V(0,3) |
| 향림/q02 | problem | 이동 서술형·원본 그림 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q02 | solution | y=-x²의 오른쪽 3 이동 축/꼭짓점 추가 | polynomial-spike-v1 | `q02-solution.plan.json` | OK/OK | FIELD_PASS: 아래 개형·x=3·V(3,0) |
| 향림/q03 | problem | 저화질 두 포물선·세로선 AB·함수명 불명료 | multi-curve-figure-v1 | `q03-problem.plan.json` | OK/OK | FIELD_PASS: 두 식·축·A/B 수직 관계·간격 답 비노출 |
| 향림/q03 | solution | 아래 평행이동량 3을 시각 보충 | multi-curve-figure-v1 | `q03-solution.plan.json` | OK/OK | FIELD_PASS: x좌표 동일·세로 간격 AB=3 |
| 향림/q04 | problem | 기준 포물선과 **보기 ①~⑤ 별도 저해상도 그래프** | polynomial-spike-v1 + 5보기 엔진 보강 필요 | `q04-problem.plan.json` | OK/OK | **ENGINE_CAPABILITY_PENDING**: 기준 그래프는 FIELD_PASS, 5개 보기 그래프를 원본 순서/레이블로 한 장에 정밀 조립하는 `FIVE_GRAPH_CHOICE_COMPOSITE` 필요(기존 보기 PNG 보존) |
| 향림/q04 | solution | 이동 후의 꼭짓점 (-2,3) 확인 | polynomial-spike-v1 | `q04-solution.plan.json` | OK/OK | FIELD_PASS: y=(x+2)²/2+3·축·(-2,3) |
| 향림/q05 | problem | 변13/5/직각 복원이 필요. **AC=12 답 유출 금지** | construction-spike-v1 | `q05-problem.plan.json` | OK/OK | FIELD_PASS: AB13·BC5·C 직각·AC 라벨 없음 |
| 향림/q05 | solution | 5-12-13 대응 추가 | construction-spike-v1 | `q05-solution.plan.json` | OK/OK | FIELD_PASS: 5·12·13·직각 |
| 향림/q06 | problem | 그림 없는 삼각비 식 계산 | EXEMPT | — | N/A | EXEMPT |
| 향림/q06 | solution | 도식 없는 값 비교 | EXEMPT | — | N/A | EXEMPT |
| 향림/q07 | problem | 흐린 둔각 135°·2√2/6 표기 | construction-spike-v1 | `q07-problem.plan.json` | OK/OK | FIELD_PASS: BC2√2·AC6·∠C135° |
| 향림/q07 | solution | **기존 회색 삼각형 채움 제거**, 수선 AH 점선 | construction-spike-v1 | `q07-solution.plan.json` | OK/OK | FIELD_PASS: 135°·AH=3√2·H 직각·무채움 |
| 향림/q08 | problem | 원본 잘린 개형; 축 왼쪽·위쪽 꼭짓점, 음의 계수 재구성 | polynomial-spike-v1 | `q08-problem.plan.json` | OK/OK | FIELD_PASS: 아래 개형·제2사분면 꼭짓점(대표 좌표) |
| 향림/q08 | solution | 기존 P·축·아래로 열린 두 팔 명료 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q8-solution.svg |
| 향림/q09 | problem | 원본 포물선의 꼭짓점(-2,4)·y절편2 판독 난해 | polynomial-spike-v1 | `q09-problem.plan.json` | OK/OK | FIELD_PASS: 아래 개형·(-2,4)·(0,2) |
| 향림/q09 | solution | y=−(x+2)²/2+4와 절편의 대응 | polynomial-spike-v1 | `q09-solution.plan.json` | OK/OK | FIELD_PASS: 이차항−1/2·두 점 |
| 향림/q10 | problem | 본문 수식만, 별도 원본 도식 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q10 | solution | 기존 두 포물선의 x축 대칭·점선 축 완비 | KEEP_VERIFIED_SVG | — | N/A | EXISTING_REVIEWED: q10-solution.svg |
| 향림/q11 | problem | 원본 B/C 직각·D/E 수선 및 x가 작은 그림에서 혼잡 | construction-spike-v1 | `q11-problem.plan.json` | OK/OK | FIELD_PASS: BC2√2·AC1·직각 C/E·DE·x |
| 향림/q11 | solution | cos x=1/3의 여각 관계와 빗변3 추가 | construction-spike-v1 | `q11-solution.plan.json` | OK/OK | FIELD_PASS: AB3·BC2√2·AC1·두 직각 |
| 향림/q12 | problem | 원본 x/y, 높이 발 H, 60°/45° 저화질 | construction-spike-v1 | `q12-problem.plan.json` | OK/OK | FIELD_PASS: BH3·H 직각·두 밑각·x/y |
| 향림/q12 | solution | BH3→AH3√3→AB6/AC3√6 | construction-spike-v1 | `q12-solution.plan.json` | OK/OK | FIELD_PASS: 네 실길이·두 각 |
| 향림/q13 | problem | 내각의 비 계산, 도식 없는 발문 | EXEMPT | — | N/A | EXEMPT |
| 향림/q13 | solution | 식 계산만 있음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q14 | problem | 저화질 좌표축·사분호·48°·0.67/0.75/1.11·직각 | construction-spike-v1/SOURCE_COORDINATE_AXES_v1 | `q14-problem.plan.json` | OK/OK | FIELD_PASS: 사분원·x/y축·수선·48°·표시된 소수(원문 근삿값) |
| 향림/q14 | solution | tan48과 sin42의 대상 길이·각을 대응 | construction-spike-v1/SOURCE_COORDINATE_AXES_v1 | `q14-solution.plan.json` | OK/OK | FIELD_PASS: CD/OD=1.11·OB/OA=0.67·42° |
| 향림/q15 | problem | **삼각형 + 삼각비 표** 하나의 PNG에 함께 있음; 표 조립 미구현 | construction-spike-v1 + 표 조합 보강 필요 | `q15-problem.plan.json` | OK/OK | **ENGINE_CAPABILITY_PENDING**: 삼각형/직각/AC10은 FIELD_PASS. `TRIG_RATIO_TABLE_PANEL` 필요(열 sin/cos/tan, 0.3746·0.9272·0.4040·2.4751 및 원본 행·열 정렬/지시선). 기존 원본 표 유지 |
| 향림/q15 | solution | 삼각비 표의 tan=2.4751을 BC24.751로 대응 | construction-spike-v1 | `q15-solution.plan.json` | OK/OK | FIELD_PASS: C 직각·AC10·BC24.751 |
| 향림/q16 | problem | 원본 BC8, 75°/45°·정점 표기 흐림 | construction-spike-v1 | `q16-problem.plan.json` | OK/OK | FIELD_PASS: BC8·∠B75°·∠C45° |
| 향림/q16 | solution | **기존 회색 면 채움 제거**, 수선 BH 길이4√2 | construction-spike-v1 | `q16-solution.plan.json` | OK/OK | FIELD_PASS: BH⊥AC·4√2·세 꼭짓점·무채움 |
| 향림/q17 | problem | 정삼각형 DEF의 세 꼭짓점·2/4/4 구간 저화질 | construction-spike-v1 | `q17-problem.plan.json` | OK/OK | FIELD_PASS: ABC=6·DEF 내접 정삼각형·AD2/AF4/EC4 |
| 향림/q17 | solution | **기존 주황/파랑 전체 면 채움 제거**, 경계선만 | construction-spike-v1 | `q17-solution.plan.json` | OK/OK | FIELD_PASS: 세 바깥 삼각형·DEF·무채움 |
| 향림/q18 | problem | 원본 P/Q·A가 작고 잘림; **문제 축 정답좌표 노출 금지** | polynomial-spike-v1 | `q18-problem.plan.json` | OK/OK | FIELD_PASS: 아래 포물선·P/Q x절편·A 꼭짓점(이름만) |
| 향림/q18 | solution | x절편 -2/4·A(1,9), 밑변6·높이9 | polynomial-spike-v1 | `q18-solution.plan.json` | OK/OK | FIELD_PASS: y=-x²+2x+8·세 점 |
| 향림/q19 | problem | 저화질 내림 직선·식 y=ax+b, **보기 ①~⑤ 별도 PNG** | construction-spike-v1/SOURCE_COORDINATE_AXES_v1 + 5보기 엔진 보강 필요 | `q19-problem.plan.json` | OK/OK | **ENGINE_CAPABILITY_PENDING**: 음의 기울기/y절편 직선은 FIELD_PASS, `FIVE_GRAPH_CHOICE_COMPOSITE`로 5개 후보 포물선을 라벨/순서대로 한 화면에 배치 필요(원본 보기 유지) |
| 향림/q19 | solution | a<0,b<0의 꼭짓점 제3사분면 대표 개형 | polynomial-spike-v1 | `q19-solution.plan.json` | OK/OK | FIELD_PASS: 위로 열린 포물선·V(a,b)의 음/음 |
| 향림/q20 | problem | 수식만 주어진 근 거리 계산, 그림 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q20 | solution | x축 두 근 -3/5 및 축 x1을 보여 주는 풀이 개형 | polynomial-spike-v1 | `q20-solution.plan.json` | OK/OK | FIELD_PASS: y=x²−2x−15·근 -3/5·V(1,-16) |
| 향림/q21 | problem | 두 함수의 교점 조건을 식으로 줌, 원본 그림 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q21 | solution | 직선과 포물선·꼭짓점(1,8)·공통 x절편5 | multi-curve-figure-v1 | `q21-solution.plan.json` | OK/OK | FIELD_PASS: 두 함수식·V(1,8)·X(5,0) |
| 향림/q22 | problem | 꼭짓점 식 계산, 원본 그림 없음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q22 | solution | 꼭짓점 (0,-16) 결정, 식 풀이만 있음 | EXEMPT | — | N/A | EXEMPT |
| 향림/q23 | problem | 저화질 x=3, y=-2 점선·y절편1 | polynomial-spike-v1 | `q23-problem.plan.json` | OK/OK | FIELD_PASS: V(3,-2)·(0,1)·축·눈금 |
| 향림/q23 | solution | 이차함수 계수·추가 x=1 눈금 | polynomial-spike-v1 | `q23-solution.plan.json` | OK/OK | FIELD_PASS: y=x²/3−2x+1·두 핵심 점 |
| 향림/q24 | problem | 저화질 직각삼각형·빗변6·사인2/3 | construction-spike-v1 | `q24-problem.plan.json` | OK/OK | FIELD_PASS: AB6·C 직각·BC/AC 미지 |
| 향림/q24 | solution | 4·2√5·6 삼변 대응 | construction-spike-v1 | `q24-solution.plan.json` | OK/OK | FIELD_PASS: 4·2√5·6·직각 |
| 향림/q25 | problem | 원본 인물·타워 픽토그램과 43°/20m/1.8m 혼합 | construction-spike-v1 + 장면 아이콘 보강 필요 | `q25-problem.plan.json` | OK/OK | **ENGINE_CAPABILITY_PENDING**: 수학적 1:1(수평거리20·눈높이1.8·43°·직각)은 FIELD_PASS, 원본 사람·점프대 구조 윤곽 보전에는 `CONTEXT_SILHOUETTE_GLYPH` 필요. 원본 PNG 유지 |
| 향림/q25 | solution | **기존 회색 삼각형 채움 제거**, 높이 차18.6+눈높이1.8 | construction-spike-v1 | `q25-solution.plan.json` | OK/OK | FIELD_PASS: AB20·BC18.6·1.8·43°·무채움 |

## 엔진 인계 및 결산

- 신규 plan **37/37 shallow PASS·37/37 full PASS**. 도식 없는 **11축 EXEMPT**, 기존 양호한 SVG **2축 유지**.
- 순수 수학 도식의 필드 대응은 신규 37축에서 확인했으나, 원본 에셋 수준의 **전체 1:1 완결 판정은 4축(q04-problem, q15-problem, q19-problem, q25-problem) ENGINE_CAPABILITY_PENDING**. 계획된 모든 기하·함수 선/점/수치는 지원되는 필드에 있으며, 미지원 원본 보기는 삭제·교체하지 않는다.
- 후속 엔진 확장: **5개 개별 포물선 보기 격자(2건)**, **삼각형과 삼각비 수치 표를 하나의 컴포지트로 결합(1건)**, **기하 관계를 가리지 않는 사람·시설물 맥락 실루엣(1건)**. 지원 전에는 선택지/표/실루엣의 원본 PNG를 보존한다. 렌더·출판·학생/A4 검수 후에야 최종 운영 자산으로 연결한다.
- 원본 JS·이미지와 기존 SVG는 변경하지 않았고 수제 SVG는 작성하지 않았다.
