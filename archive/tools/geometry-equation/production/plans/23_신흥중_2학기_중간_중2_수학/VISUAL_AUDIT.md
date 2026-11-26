# 2023 신흥중 2학기 중간 중2 — 원본 대비 문제·해설 SVG 전수검수

- JS: `archive/exams/original/middle/m2/2mid/23_신흥중_2학기_중간_중2_수학.js`; 24문항, 문제·해설 **각각 24축**.
- 원본 PNG와 현재 연결 SVG의 실제 그림을 비교하고, 모든 문항의 본문·정답·해설을 별도로 읽어 S축 필요성을 재판정했다. 현재 P SVG 21축, S SVG 4축.
- 재작성: 해설 **15개** `q05,q07,q08,q09,q10,q11,q12,q13,q14,q15,q18,q19,q21,q22,q23`. 미비한 기하·합동 풀이를 실행형 plan에 보강, S q19·q21의 큰 면 채움을 없앰.
- `plan-lint --shallow`: 15/15 OK. Full lint: Python `visual_engine` 부재로 `ModuleNotFoundError` 15건, **ENV_BLOCKED / FULL_NOT_PASS**. 신규 SVG 렌더·PNG 실물·학생 화면·A4는 **NOT_RUN**. 정적 plan 필드 검증과 픽셀 검증을 혼동하지 않는다.
- 대상 두 시험지만 수정; 기존 원본 JS·원본 PNG·기존 SVG에는 손대지 않음.

| QID | 문제축(P) 판단 | 해설축(S) 판단 | DRAWN_FEATURE_PARITY (static) |
| --- | --- | --- | --- |
| q01 | RETAIN: y=−2·좌표축·눈금 | EXEMPT: 단일 수평선과 절편 계산 | 기존 P 대조 |
| q02 | RETAIN: 두 방정식 교차 그래프·좌표 | EXEMPT: 기존 그래프의 계수 계산 | 기존 P 대조 |
| q03 | RETAIN: 1500m·10/20/30분 이동 그래프 | EXEMPT: 그래프에서 속력 읽기 | 기존 P 대조 |
| q04 | RETAIN: AB=BC·B40°·A의 x | EXEMPT: 이등변·외각 계산 | 기존 P 대조 |
| q05 | RETAIN: 20°·연쇄 같은 길이 눈금 | **REPLAN**: 연속 이등변삼각형 40°·100°·60°·80°를 실제 각 호에 | `equalLengths`1·`angles`5; STATIC_PASS |
| q06 | RETAIN: 두 직각삼각형, 직각 네모 | EXEMPT: 보기 조건의 합동 판정 | 기존 P 대조 |
| q07 | RETAIN: B/D 직각·BC=DC·A46° | **REPLAN**: EB=ED·SSS 합동·68°를 원배치+펼친 2도형으로 | 3패널·`rightAngles`·`equalLengths`; STATIC_PASS |
| q08 | RETAIN: 외심 O·세 수선 발 M/L/N | **REPLAN**: OA=OB=OC와 현의 중점·수직이등분선 | `rightAngles`3·`equalLengths`3그룹·점선; STATIC_PASS |
| q09 | RETAIN: 외심·B30°·C35°·x | **REPLAN**: 중심각 120°·110°·130° 호 연결 | `equalLengths`1·`angles`5; STATIC_PASS |
| q10 | RETAIN: 내심·36°·24°·x | **REPLAN**: 두 밑각 이등분 호와 A60° | `angles`5·이등분 그룹2; STATIC_PASS |
| q11 | RETAIN: 직각·빗변 중점·BC10 | **REPLAN**: AM=BM=CM=AC=5와 30° | `rightAngles`1·중점 눈금·`dimensions`4; STATIC_PASS |
| q12 | RETAIN: 내심 I, E80°·D70° | **REPLAN**: A/B 반각 표시·C40° 계산 연결 | `angles`7·이등분 그룹2; STATIC_PASS |
| q13 | RETAIN: 평행사변형·AC8 BD12 AB6 | **REPLAN**: O의 대각선 이등분과 AO4 BO6 | `equalLengths`2그룹·`dimensions`5; STATIC_PASS |
| q14 | RETAIN: 이등분선 AE/DF·AD10 AB8 | **REPLAN**: BE=8 CF=8 EF=6 길이 소유선 결속 | `angles`4·`dimensions`5; STATIC_PASS |
| q15 | RETAIN: 등변사다리꼴·AD9 AB6·120° | **REPLAN**: 두 수선 발과 BH/JC3, BC15 | `rightAngles`2·`dimensions`5·`angles`2; STATIC_PASS |
| q16 | EXEMPT: 보기 명칭만 있는 사각형 성질 | EXEMPT: 대각선 이등분 성질 선택 | — |
| q17 | EXEMPT: 사각형 포함관계의 글 보기 | EXEMPT: 포함관계 판단 | — |
| q18 | RETAIN: 정사각형·E∈AC·65° | **REPLAN**: 대각선의 45° 및 결과각 20°의 연결 | `rightAngles`2·`angles`5; STATIC_PASS |
| q19 | RETAIN: AB=AC 쌍 눈금 | **REPLAN**: 불필요한 삼각형 면 채움 삭제, SAS 대응 삼각형 분리 | 3패널·양 밑각·각 이등분; STATIC_PASS |
| q20 | RETAIN: 원의 일부 원호 | RETAIN: 현의 수직이등분선으로 중심 찾는 기존 보조선 | 기존 P/S 대조 |
| q21 | RETAIN: 3각 이등분선·내심 I | **REPLAN**: 삼각형 내부 과한 색칠 제거, 내접원·IH⊥BC | `displayCircles`·`rightAngles`·`dimensions`; STATIC_PASS |
| q22 | RETAIN: 평행사변형 대각선 AC | **REPLAN**: ASA 엇각 두 쌍과 대응 삼각형 두 개 펼치기 | 3패널·`angles`2그룹·`parallels`2; STATIC_PASS |
| q23 | RETAIN: 두 쌍 대각·연장점 E | **REPLAN**: 대각 동등·외각 EAD·대변 평행 직접 표시 | `angles`5·`parallels`2; STATIC_PASS |
| q24 | EXEMPT: 문장·선분 등식으로 정의 | RETAIN: OA=OB=2, OC=OD=3 반례 도형 | 기존 S 대조 |

## 제작 plan / sourceConditions → 실제 그리기 필드

| JSON | 1:1로 묶은 필수 시각 정보 | shallow / full / render |
| --- | --- | --- |
| `q05-solution.plan.json` | AB=BC=CD=DE, CAB20°, CBD40°, BCD100°, CDE60°, EDF80° | OK / ENV_BLOCKED / NOT_RUN |
| `q07-solution.plan.json` | 직각 B/D, BC=DC, EB=ED, 공통 EC, BEC/DEC 동일, DEC68° | OK / ENV_BLOCKED / NOT_RUN |
| `q08-solution.plan.json` | OA=OB=OC, M/L/N 중점, OM⊥AB·OL⊥AC·ON⊥BC | OK / ENV_BLOCKED / NOT_RUN |
| `q09-solution.plan.json` | 30°,35°,120°,110°,130°와 세 같은 반지름 | OK / ENV_BLOCKED / NOT_RUN |
| `q10-solution.plan.json` | B36°·C24° 각각 2개로 분할, A60° | OK / ENV_BLOCKED / NOT_RUN |
| `q11-solution.plan.json` | A90°·B30°·BC10·AM/BM/CM5·AC5 | OK / ENV_BLOCKED / NOT_RUN |
| `q12-solution.plan.json` | B의 40°쌍, A의 30°쌍, E80° D70° C40° | OK / ENV_BLOCKED / NOT_RUN |
| `q13-solution.plan.json` | AB6 AC8 BD12·AO4 BO6와 대각선 이등분 | OK / ENV_BLOCKED / NOT_RUN |
| `q14-solution.plan.json` | 각 이등분 2쌍, BC10 AB8 BE8 CF8 EF6 | OK / ENV_BLOCKED / NOT_RUN |
| `q15-solution.plan.json` | 등변사다리꼴 AD9 AB6 BC15 BH=JC3, A120°, B60° | OK / ENV_BLOCKED / NOT_RUN |
| `q18-solution.plan.json` | BEC65°, BCE45°, EBC70°, ABE20°, EDA20° | OK / ENV_BLOCKED / NOT_RUN |
| `q19-solution.plan.json` | AB=AC·AD 공통·A 이등분·ABD≅ACD의 두 펼친 도형 | OK / ENV_BLOCKED / NOT_RUN |
| `q21-solution.plan.json` | 내심 I, BC 수선 발 H, IH⊥BC, 반지름 r인 접원 | OK / ENV_BLOCKED / NOT_RUN |
| `q22-solution.plan.json` | AB∥CD, BC∥AD, BAC=DCA, BCA=DAC, AC 공통 | OK / ENV_BLOCKED / NOT_RUN |
| `q23-solution.plan.json` | A=C, B=D, E-A-B 공선, B=EAD, AD∥BC, AB∥CD | OK / ENV_BLOCKED / NOT_RUN |
