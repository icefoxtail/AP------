# 기하 072–077 시각 충실도 재검토·수리 인계 (2026-11-25)

## 정정된 완료 상태

- 원작업: PR #3009, main 병합 `c9f271568b6dd8c40a14e92e756b7ab0731b30af`, 그림 문항 16개의 공식 `ellipse-figure-v1` 문제 plan.
- 원문 `[그림:]`에 필요한 기호·각도 표식을 plan 실제 필드와 대조하니 당시 `featureParity PASS=11`, `ENGINE_CAPABILITY_PENDING=5`였다. plan-lint의 16 OK를 시각정보 완성으로 간주하지 않는다.
- **이번 재검토에서 076 q02는 엔진 확장 없이 `FOOT.rightAngle`로 수리**. `sourceVsPlan=REVIEWED`, `featureParity=PASS`, `planLintShallow=PASS`, `planLintFull=PASS`. 결과 집계: **PASS 12 / ENGINE_CAPABILITY_PENDING 4**.
- 원본 JS, 출제 식·정답·해설, SVG, PNG, JS image 참조를 수정하지 않았다. 학생 화면·A4 실물 검수는 이번에도 **NOT_RUN**.

## 실제로 고친 plan: 076 q02

대상: `기하_076_쌍곡선의접선의방정식-접점의좌표가주어진_고2_유형은행1/q02-problem.plan.json`.

1. 기존 원문 A=(2,1), B=(0,-1/3), C=(0,4), 접선 t의 기울기 2/3, 법선 n의 기울기 -3/2, 칠한 삼각형 ABC를 그대로 보존한다.
2. 수학 접점의 이름을 쓰지 않는 보조점 `T:ON_CONIC(x=2, sign=POS, label=false)`로 나누고, 접선 `t`는 T에서 계산한다.
3. 접선과 y축의 교점 `B:LINE_LINE`은 그대로이고, **`A:FOOT(from=B,onto=n,rightAngle=true,coordinates=true)`**로 A를 구성한다. B에서 n으로 내린 수선의 발을 독립 계산하면 `(2,1)`이므로 원문 A와 일치한다.
4. `B→A` 방향(접선)과 `A→C` 방향(법선)이 직각이라 엔진이 A에 **실제 작은 90° 사각 표식**을 그린다. `segments AB·AC·BC`, `polygons ABC(fill=LIGHT)`는 그대로.
5. 별도 SymPy 정사영 및 내적 확인: `projection_n(B)=(2,1)`, `(B-A)·(C-A)=0`. 공식 `plan-lint.cjs --shallow` 및 full 둘 다 PASS.

이 점은 엔진의 `conic.points[].rightAngle` 기능을 임의로 가정한 것이 아니라, 기존 **`kind:FOOT`** 노드가 원래 지원하는 `rightAngle`을 사용한 실제 수리다.

## 계속 미완료인 네 문항 — 엔진 기능별 정밀 요구

| qid | 원문이 그림에 요구하는 정보 | 지금까지 실제 구현된 필드 | 정확히 빠진 **가시 정보** | 상태 |
|---|---|---|---|---|
| 072 q08 | `∠QPA=60°` | 타원, A(0,−3√3), P 제3사분면, 실제 접점 Q, PA·PQ. 독립 기울기 검산에서 60° | **꼭짓점 P에 속한 60° 각도 호 + 60° 라벨** | ENGINE_CAPABILITY_PENDING |
| 074 q04 | `P(k,3)`와 수평선 y=3의 두 접선 | P가 실제 외부점, 수평선 `y=3`, 두 `TANGENT_FROM`·접선. P의 내부 x좌표는 수학적 대표값 | 점 P에 붙은 **문자 좌표 `P(k,3)`** | ENGINE_CAPABILITY_PENDING |
| 077 q03 | `P(4,k)`, 초점 F′F의 3:1 내분점 | 실제 쌍곡선, P, 접선, F′T:TF=3:1의 선분·비례 라벨 | 점 P에 붙은 **문자 좌표 `P(4,k)`** | ENGINE_CAPABILITY_PENDING |
| 077 q04 | `P(5,k)`, 절편 Q,R, 수선 발 S, 두 삼각형 | 실제 쌍곡선, P, Q/R 교점, S FOOT·직각, 두 음영 삼각형·주어진 넓이 비 검산 | 점 P에 붙은 **문자 좌표 `P(5,k)`** | ENGINE_CAPABILITY_PENDING |

### 엔진 불가 근거 (실행 확인)

- 현행 `production/ellipse-figure-v1.mjs`의 `CONIC_TOP_KEYS`에는 `angles`가 없다. 072 q08 JSON에 `angles:[{id:'p60',refs:['Q','P','A'],value:60,label:'60'}]`를 메모리상 추가하여 `validateConicPlan`을 돌리면 **`ELLIPSE_PLAN_INVALID`**로 거절한다.
- 현행 `CONIC_POINT_KEYS`에는 문자 좌표 글을 별도로 다는 `displayName`이 없다. 074 q04 점 P에 `displayName:'P(k,3)'`을 메모리상 추가하면 **`ELLIPSE_POINT_INVALID`**로 거절한다. 이는 새 필드를 가정해 plan JSON만 고쳐서 해결할 수 없는 상태다.
- 현재 `coordinates:true`는 **계산된 실제 숫자**를 `P(√10,3)`처럼 표시하므로, 구하는 미지수의 값이 알려지는 **정답 유출**을 일으킨다. 숫자로 치환하거나 `segments[].label`을 각도 라벨처럼 오용하여 겉보기만 통과시키면 안 된다.

### 안티그래비티/엔진 담당의 다음 구현 게이트

1. **Conic 각도 호**: 예시 q072 q08의 `refs:[Q,P,A]`처럼 같은 그림에 실제 존재하는 세 점을 받아 60°를 기하적으로 재계산(0.5° 정확도), 꼭짓점에 작은 호와 `60°`를 렌더하는 공식 capability 계약을 추가한다. 점 이름·선분·호 라벨의 소유 관계를 관측기에서 재검사하고 AUTHOR_GUIDE·골든 예제로 고정한다. *현재 예시 필드 `angles`는 구현되지 않았으며 그대로 plan에 써서는 안 됨*.
2. **Conic 문자 좌표 라벨**: 실제 `P` 위치를 엔진 좌표로 정확히 계산하되 점 근처에 주어진 원문의 `P(k,3)`, `P(4,k)`, `P(5,k)`를 숫자로 바꾸지 않고 조판하는 검증된 공식 필드(가칭 `displayName`)를 구현한다. 라벨 지시선과 위치·소유 검수, 문자식 문법 및 정답 누출 게이트를 갖춰야 한다. *가칭 `displayName`은 현재 지원되지 않음*.
3. 엔진 기능 PR의 골든 게이트 및 conic 독립 관측기를 통과한 뒤 네 문제 plan을 새 공식 필드로 **실제로 수정**, shallow/full 재검사 및 **main 운영병합**한다.
4. 후속 담당은 관련 16문항을 공식 엔진으로 SVG/PNG 렌더하고 학생 화면·A4 실물에서 `angle=60°`와 세 문자 좌표 라벨이 각각 해당 점·각에 붙었는지 확인한다. 그 전에는 네 문항 `featureParity`를 PASS로 바꿀 수 없고, 16문항 모두 `render/PNG/student/A4=NOT_RUN`이다.

## 운영 집계

| 게이트 | 결과 |
|---|---|
| 수정 전 plan 원문 대조/정답 노출 | 16/16 REVIEWED, 16/16 answerLeak PASS |
| 수정 후 shallow/full 재검사 | 수정 문항 076 q02 모두 PASS, 기존 나머지 15개 full PASS 유지 |
| JSON 필드 시각 충실도 | **12 PASS / 4 ENGINE_CAPABILITY_PENDING** |
| SVG·PNG·학생화면·A4 | **0 VERIFIED / 16 NOT_RUN** |
| 보류 대상 다음 단계 | 엔진 기능 확장 2종 → 4개 plan 수정 → 실물 검증 |
