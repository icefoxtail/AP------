# 비상 공통수학2 집합과 명제 — 대단원 학습평가 (17문항)

검수 기준: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_집합과명제_대단원학습평가_고1.js`의 `questionBank` 전 문항과 연결된 문제 PNG 2개·해설 SVG 5개를 원본으로 삼았다. **문항(P), 해설(S)을 별개 축**으로 판정했다. 범위는 plan JSON과 정적 구조·원문 비교이며 기존 JS·이미지·SVG·렌더러는 수정하지 않았다.

기호: `READY` = 실행 가능한 plan, `EXEMPT` = 그 축의 수식·논증에 별도 그림 필수가 아님, `ENGINE_CAPABILITY_PENDING` = 원본의 필수 시각 구조를 현 엔진으로 1:1 구현할 수 없음. `D1` = 원문·원본 이미지 대비 도형 원소/집합·색칠·라벨을 plan 필드에 1:1 대응함(**렌더링 후 픽셀 관측 PASS를 뜻하지 않음**). `E` = 필수 시각요소 없음. `P` = 실제 원본 대비 미구현 기능. 모든 `READY` 파일은 같은 디렉터리에 위치하며 `plan-lint --shallow`/full에 통과해야 한다. `NOT_RUN`은 실제 웹/SVG 렌더·학생 화면과 A4 관측이 별개라 이 단계에서 시행하지 않음을 뜻한다.

| 파일/qid | 축 | 판정 | capability / 필수 기능 | plan 경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| q01/b5ac58df | P | EXEMPT | 집합 원소 표기만 | — | 해당없음 | E |
| q01/b5ac58df | S | EXEMPT | 유한집합 비교, 대수식으로 완결 | — | 해당없음 | E |
| q02/8822d65f | P | EXEMPT | 집합 표기 | — | 해당없음 | E |
| q02/8822d65f | S | EXEMPT | 집합의 곱/원소 관계 | — | 해당없음 | E |
| q03/31915792 | P | EXEMPT | 포함관계 수식 | — | 해당없음 | E |
| q03/31915792 | S | EXEMPT | 부분집합 경우 네 개 계산, 추가 그림 불필요 | — | 해당없음 | E |
| q04/d1adb99b | P | READY | `set-diagram-figure-v1`: U의 0~6 원소와 `(A-B)^c`만 음영; 답을 노출하는 캡션 배제 | `q04-problem.plan.json` | shallow/full OK | D1: 원소 7, 소속영역 4종, 색칠 집합식; 불필요한 흰 면 없음 |
| q04/d1adb99b | S | READY | `set-diagram-figure-v1`: 0·2를 뺀 1·3·4·5·6 | `q04-solution.plan.json` | shallow/full OK | D1: 5개 원소와 영역 판정 |
| q05/2b8c59e1 | P | EXEMPT | 집합 포함관계 수식 | — | 해당없음 | E |
| q05/2b8c59e1 | S | READY | `composite-panels-v1`: A=B(동일 원), A⊊B(내접 원); `B-A`만 음영 | `q05-solution.plan.json` | shallow/full OK | D1: 원본의 두 경우/집합명/진부분집합 차 영역; 원본의 무의미한 파란 채움·불필요한 패널 면 제거 |
| q06/5a3b7c1b | P | EXEMPT | 집합 인원수 텍스트 | — | 해당없음 | E |
| q06/5a3b7c1b | S | EXEMPT | 합집합 인원 계산을 원문 해설식으로 완결 | — | 해당없음 | E |
| q07/d7629215 | P | EXEMPT | 이차식의 항상 양수 조건 | — | 해당없음 | E |
| q07/d7629215 | S | EXEMPT | 판별식 부등식 풀이 | — | 해당없음 | E |
| q08/d8b658db | P | EXEMPT | 역·대우 논리 서술 | — | 해당없음 | E |
| q08/d8b658db | S | EXEMPT | 3·4·5 반례가 글로 명시됨; 원본에 삼각형 그림 없음 | — | 해당없음 | E |
| q09/c14a1b3d | P | EXEMPT | 구간 포함 논리 발문 | — | 해당없음 | E |
| q09/c14a1b3d | S | ENGINE_CAPABILITY_PENDING (실행형 부분안) | `number-line-figure-v1`: P=(k−1,k+2], Q=(2,7), k=4 정확한 사례. **부족한 기능:** 서로 다른 SET행의 같은 x값을 잇는 세로 점선 가이드와 원본과 같은 다중 경계 정렬 | `q09-solution.plan.json` | shallow/full OK(부분안) | P: 열린/닫힌 점·두 집합/매개변수 일치; 원본의 세로 점선 미지원 |
| q10/987d6664 | P | ENGINE_CAPABILITY_PENDING | 합류 노드를 공유하는 3단계 3갈래 방향 DAG; 매 단계 `3→5→7` 노드, 세 색 화살표/화살촉, 단계 점선, 종점 ㄱ~ㅅ 및 시작 A | — (허위 TREE plan 금지) | 해당없음 | P: 원본 q10_source.png의 노드 합류 구조 구현 불가 |
| q10/987d6664 | S | ENGINE_CAPABILITY_PENDING | 상기 동일 DAG에 오른쪽→오른쪽→왼쪽 경로 강조와 종점 `ㅁ`; 3단계 논리별 방향 표시 | — | 해당없음 | P: 경로 강조/라벨/화살촉 구현 불가 |
| q11/54190784 | P | EXEMPT | 필요·충분조건 논리 | — | 해당없음 | E |
| q11/54190784 | S | EXEMPT | 필요충분 관계를 등식으로 판단 | — | 해당없음 | E |
| q12/e1ac8d96 | P | EXEMPT | 배수 집합 기호 | — | 해당없음 | E |
| q12/e1ac8d96 | S | EXEMPT | 약수 정수 계산 | — | 해당없음 | E |
| q13/a4a340f0 | P | EXEMPT | 유한집합 개수와 식 | — | 해당없음 | E |
| q13/a4a340f0 | S | EXEMPT | 원소수 대수계산, 별도 영역 라벨 원본 없음 | — | 해당없음 | E |
| q14/920286ad | P | EXEMPT | A-B·A∩B 등 집합식 | — | 해당없음 | E |
| q14/920286ad | S | READY | `set-diagram-figure-v1`: A-only 1·2, 양쪽 3, B-only 4·5, 밖 6·7; 바깥 여집합만 음영 | `q14-solution.plan.json` | shallow/full OK | D1: 원본 4영역·일곱 원소; U의 노란 기본 면 채움 제거 |
| q15/aab91e24 | P | EXEMPT | P=[3,5], Q·R 부등식 | — | 해당없음 | E |
| q15/aab91e24 | S | ENGINE_CAPABILITY_PENDING | 한 그림의 두 소문항에서 **독립 변수 a,b**를 각각 가변 끝점 `a−4`, `b+2`로 표시하고 닫힌 [3,5]와 비교, 참/거짓의 차이를 두 행에 구분; 세로 점선·끝점 라벨 충돌 회피 | — (한 parameter로 두 독립 변수를 속이지 않음) | 해당없음 | P: 원본 q15_condition-intervals.svg의 이중 매개변수 비교 부족 |
| q16/221e90dc | P | EXEMPT | 대우와 정수의 짝·홀성 | — | 해당없음 | E |
| q16/221e90dc | S | EXEMPT | 모순/대우 증명 | — | 해당없음 | E |
| q17/3f1c8033 | P | EXEMPT | 산술기하 부등식 식 | — | 해당없음 | E |
| q17/3f1c8033 | S | ENGINE_CAPABILITY_PENDING | `u=4x/y`, `v=9y/x`, `uv=36`, AM–GM 하한과 **u=v=6 ⇔ 2x=3y**의 단계별 수식·등호조건 연결 블록. 기존 사각형 흰/푸른 면 채움 대신 의미 중심 수식 flow 필요 | — (수식-흐름형 시각 엔진 미지원) | 해당없음 | P: q17_amgm-equality.svg 대비 등식 단계도 구현 불가 |

원본 그림별 비교: `q04_source.png`(문항) → 원소·집합·음영식 보존; `q10_source.png`(문항) → 합류형 방향도 **pending**; `q05_subset-cases.svg`(해설) → 두 경우의 논리와 집합 포함 순서 보존; `q09_implication-interval.svg`(해설) → 열린/닫힌 끝점 보존, 점선 가이드는 **pending**; `q14_complement-venn.svg`(해설) → 원소·차집합·여집합 보존; `q15_condition-intervals.svg`(해설) → 독립 가변 끝점 **pending**; `q17_amgm-equality.svg`(해설) → 식 흐름 **pending**.

**운영 검수 결론:** 필수 원본 도형을 손 SVG로 바꾸거나 없는 원소·인원수를 창작하지 않았다. 제출 plan 5개 모두 실행형이고 shallow/full 검사 통과. `DRAWN_FEATURE_PARITY`의 정적 1:1 대응은 q04(P/S), q05(S), q14(S)에 한정된다. q09(S)는 실제 같은 점선 표현이 불가능하여 부분안이며, q10(P/S), q15(S), q17(S)는 명시적인 기능 대기다. 실제 SVG 화면·A4·원문 픽셀 관측은 `NOT_RUN`으로 보류한다.
