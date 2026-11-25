# 고2 유형은행 미적분Ⅱ 202/q07–241/q06: 20문항 원문·필드 패리티 인계

- 기준: 2026-11-26. 기하 유형군 완료 뒤 미적분Ⅱ로 이어 온 기존 운영 PR #3110의 다음 문항 **202/q07**에서 시작. 본 PR은 유형은행 그림 plan만 작업하며 시험지·교과서·원본 JS·엔진·손 SVG는 수정하지 않는다.
- 범위: 원본 `archive/exams/types/high/h2/`의 여섯 파일, 원문에 실제 `[그림: …]`이 있는 문제 축 **20문항**. `202/q07–q13` 7개, `203/q02·03·04·05·07·08·12` 7개, `204/q01` 1개, `221/q05` 1개, `239/q01–q03` 3개, `241/q06` 1개. 중간 번호의 파일·문항은 그림 표기가 없어 건너뜀.
- 결과: `plan-lint.cjs --shallow` **OK 20/20**, `plan-lint.cjs --jobs 2`(full) **OK 20/20**. 원본 `sourceQuote`의 일치, 68개 실존 필드 참조와 29개 pending 참조를 독립 확인(동일 조건에 복수 필드가 있을 수 있음). 수치·교점·정의역·면적도 원문과 별도 대조.
- **DRAWN_FEATURE_PARITY (원문 ↔ 실제 그릴 수 있는 필드)**: **PASS 5 / ENGINE_CAPABILITY_PENDING 14 / SOURCE_CONFLICT·EVIDENCE_DEBT 1**. 작도 가능한 `capability` plan은 13개(그중 **PARTIAL 7개**), 상태만 기록한 `UNSUPPORTED`는 **7개**. **full lint OK는 도형 완전성을 증명하지 않으며, status-only 7개는 렌더 가능한 plan이 아니다.**
- **SVG 생성·픽셀 관측·PNG·학생 화면·A4·원본 JS 연결 검수는 모두 NOT_RUN**. `DRAWN_FEATURE_PARITY`는 선언된 필드의 기하학·표현력 대조이지 실제 렌더 이미지 합격을 뜻하지 않는다. 학생에게 보이는 출력이라고 주장하지 않는다.

## 문항별 1:1 결과

| 원문/qid | 그림 축·검산 핵심 | 판정 | plan JSON | shallow / full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| 202/q07 | `ln(2x)` 곡선과 기호 직사각형 | PARTIAL · `logarithmic-affine-spike-v1` | [q07](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q07-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202/q08 | 반원·가변 윗변의 사다리꼴 | UNSUPPORTED · 상태 전용 | [q08](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q08-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202/q09 | 밑변·옆변 2m, 대칭 둔각 사다리꼴 | SUPPORTED · `construction-spike-v1` | [q09](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q09-problem.plan.json) | OK / OK | PASS |
| 202/q10 | 원 반지름 2와 내접 삼각형 | PARTIAL · `construction-spike-v1` | [q10](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q10-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202/q11 | 인쇄영역 4×8, 외곽 8×10, 사방 2·1cm 여백 | SUPPORTED · `construction-spike-v1` | [q11](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q11-problem.plan.json) | OK / OK | PASS |
| 202/q12 | 사분원·정사각형·겹침 영역 | UNSUPPORTED · 상태 전용 | [q12](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q12-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 202/q13 | 6×3 접힌 직사각형과 접는 선 | SOURCE_CONFLICT · `construction-spike-v1` | [q13](../../production/plans/미적분II_202_최대최소의활용넓이_고2_유형은행1/q13-problem.plan.json) | OK / OK | SOURCE_CONFLICT / EVIDENCE_DEBT |
| 203/q02 | 윗면 없는 직육면체·가변 밑변 | UNSUPPORTED · 상태 전용 | [q02](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q02-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 203/q03 | 반지름 6 부채꼴과 원뿔 | PARTIAL · `solid-figure-v1` | [q03](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q03-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 203/q04 | 원뿔 축단면·내접원 반지름 2 | SUPPORTED · `construction-spike-v1` | [q04](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q04-problem.plan.json) | OK / OK | PASS |
| 203/q05 | 세 점의 로그 좌표와 직각삼각형 | PARTIAL · `construction-spike-v1` | [q05](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q05-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 203/q07 | 지수곡선·직선·수선 | PARTIAL · `exponential-affine-spike-v1` | [q07](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q07-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 203/q08 | 지수/로그 2곡선·원점 접선 | UNSUPPORTED · 상태 전용 | [q08](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q08-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 203/q12 | 역함수 지수/로그의 공통 접점 | UNSUPPORTED · 상태 전용 | [q12](../../production/plans/미적분II_203_최대최소의활용부피_고2_유형은행1/q12-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 204/q01 | `f'(x)` 정성 그래프·점근 | UNSUPPORTED · 상태 전용 | [q01](../../production/plans/미적분II_204_유리무리방정식의실근의개수_고2_유형은행1/q01-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 221/q05 | 사인 곡선·양쪽 반직선·열린 점 | UNSUPPORTED · 상태 전용 | [q05](../../production/plans/미적분II_221_도함수가주어진연속함수의부정적분_고2_유형은행1/q05-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 239/q01 | 다섯 좌표를 잇는 네 선분 | SUPPORTED · `piecewise-polynomial-spike-v1` | [q01](../../production/plans/미적분II_239_그래프로주어진정적분의치환적분법_고2_유형은행1/q01-problem.plan.json) | OK / OK | PASS |
| 239/q02 | 세 영점과 위·아래 넓이 11·2 | PARTIAL · `piecewise-polynomial-spike-v1` | [q02](../../production/plans/미적분II_239_그래프로주어진정적분의치환적분법_고2_유형은행1/q02-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |
| 239/q03 | (0,1)→(1,1)→(3,3)→(4,0) | SUPPORTED · `piecewise-polynomial-spike-v1` | [q03](../../production/plans/미적분II_239_그래프로주어진정적분의치환적분법_고2_유형은행1/q03-problem.plan.json) | OK / OK | PASS |
| 241/q06 | `y=2x²+1`의 접선·각도 | PARTIAL · `polynomial-spike-v1` | [q06](../../production/plans/미적분II_241_지수함수로그함수의정적분의치환적분법_고2_유형은행1/q06-problem.plan.json) | OK / OK | ENGINE_CAPABILITY_PENDING |

## 원문 대조와 수학적 검증

- 20개 plan 모두 `sourceQuote`가 담당 원본 JS의 **해당 문제 `content` 안에 있는 정확한 `[그림: …]` 문자열**과 일치한다. 20개 `sourceConditions`의 모든 `mappedTo`는 실제 필드 경로로 따라가거나 명시적인 `ENGINE_CAPABILITY_PENDING`으로 끝난다. 필드가 있다는 사실과 해당 그래픽을 충분히 그린다는 사실을 구별해 심사했다.
- **202/q09**: 둔각 대표 `cosθ=-3/5,sinθ=4/5`에서 윗점 `(-6/5,8/5)`, `(16/5,8/5)`; 밑변과 양 옆변이 각각 2이고 위아래 변이 평행. 최댓값이 되는 θ를 미리 그리지 않았다.
- **202/q10**: `t=6/5` 대표의 밑점은 `(±8/5,6/5)`, 정점은 `(0,2)`; 반지름 2 조건 충족. 원문의 `t` 기호 좌표를 점 옆에 직접 표기할 수 없는 기능은 pending.
- **202/q11**: 인쇄 사각형은 `(2,1)`~`(6,9)`로 넓이 32, 외곽은 `(0,0)`~`(8,10)`; `x,32/x,x+4,32/x+2`와 좌우 2·상하 1 라벨을 실존 `displaySegments`/`expressionLabels`로 매핑. 이는 대표 `x=4`의 스케치이지 최적 답 도형이 아니다.
- **202/q13 SOURCE_CONFLICT**: 원문 문장에는 `“오른쪽 변 CD”`라고 되어 있으나 같은 원문의 고정 좌표 `C(0,0),D(0,3),A(6,3),B(6,0)`에서는 **CD는 왼쪽 변**이다. 본 plan은 바꿀 수 없는 좌표와 `F∈CD, G∈BC`를 따르고, 접는 선 `4x+6y=13`으로 중점 `(1,3/2)`, 수직기울기를 검산했다. 원문 수정을 독단적으로 하지 않았고 해당 모순을 **EVIDENCE_DEBT**로 남긴다. 원문 충돌 해소 전에는 `DRAWN_FEATURE_PARITY=PASS`로 올리지 않는다.
- **203/q03–04**: 부채꼴 반지름/원뿔 모선 6의 대응은 유지하되 부채꼴과 원뿔을 한 화면에 그리는 필드는 pending. q04의 대표 단면 `r=3,h=36/5`는 빗변 `39/5`, 넓이 `108/5`, 반둘레 `54/5`로 내접원 반지름 **2**가 정확하다. 최적 `h=8`을 그림으로 유출하지 않는다.
- **203/q05**: 대표 `t=2`에서 `QR=t ln t`, `PR=2 ln t`를 직각 변으로 검산하며 라벨 문법은 엔진 수식식 `t*ln(t)`처럼 적용. 정확한 원본의 `ln t` 좌표·축 문구는 pending.
- **203/q07**: `y=e^{3x}+2`를 정확 곡선으로 선언. 상대 직선 `y=3ex-1` 및 `x=1/3` 수선이 같은 drawable 필드에 없음.
- **239/q01**: 네 선분의 기울기 `1,0,-3,-1`; x축 눈금 `2,4,5,6`, y축 `1,2,4` 검산. **239/q03**: 구간별 `1,x,12-3x`이 연속하여 네 꼭짓점을 지난다.
- **239/q02**: 원문은 세 영점, 각 구간의 부호와 면적만 고정하므로 대표 곡선으로 `(22/9)(x+1)(2-x)` 및 `(4/9)(x-2)(x-5)`를 사용한다. 구간 적분이 각각 `11,-2`; 꼭짓점 `(1/2,11/2)`, `(7/2,-1)` 확인. 그러나 내부 **영역 A=11, B=2 라벨은 여전히 pending**이고 임의 곡선이 유일한 원본 모양이라고 주장하지 않는다.
- **241/q06**: `P(1/2,3/2)`에서 접선 `y=2x+1/2`을 정확히 검산. 접선·x축 사이 각도 호 표기 미지원.

### 각 문항의 ENGINE_CAPABILITY_PENDING 세부 내역

| 원문/qid | 실제 drawable 필드로 표현되지 않는 원문 정보 |
|---|---|
| 202/q07 | `P(t,ln(2t))`, `(t,0)`, `(0,ln(2t))`를 잇는 기호 직사각형과 좌표 라벨 |
| 202/q08 | `x²+y²=16` 위쪽 반원, `(-t,√(16-t²))`의 이동 윗변, 사다리꼴 오버레이 |
| 202/q10 | `t`와 `±√(4-t²)`라는 미지 좌표를 꼭짓점의 라벨로 유지 |
| 202/q12 | 사분원 호, A/B의 삼각함수 이동점, 오른쪽 정사각형의 겹침 구역 |
| 203/q02 | 윗면이 **없는** 직육면체의 세 모서리 `x,x,h` 라벨 |
| 203/q03 | 원뿔과 함께 반지름 6 부채꼴 및 중심각 `θ`를 한 장에 구성 |
| 203/q05 | `t-t ln t`, `t`, `2 ln t`의 원래 가변 좌표 및 로그 표현 |
| 203/q07 | `y=3ex-1` 직선, `x=1/3` 점에서 내린 수선과 정확 교점 |
| 203/q08 | `2e^x`와 `2 ln x`의 혼합 곡선 두 개, 각 접선·원점·각 |
| 203/q12 | 매개변수 k의 역지수/로그 곡선과 `y=x` 대칭, 공통 접점 |
| 204/q01 | 도함수의 비다항 정성적 아래쪽 0 점근 및 하강·상승 개형 |
| 221/q05 | 좌우 반직선·중간 사인곡선·경계 네 개의 열린 끝점 |
| 239/q02 | 축과 곡선 사이 두 영역에 `A=11`, `B=2`를 내부 라벨로 배치 |
| 241/q06 | 접선·x축이 만드는 각 `θ`의 호와 각도 표기 |

### 원본 JS SHA-256 (무수정 근거)

| 원본 파일(`archive/exams/types/high/h2/`) | SHA-256 |
|---|---|
| `미적분II_202_최대최소의활용넓이_고2_유형은행1.js` | `5c57339f622eaef14d15f6e0a20ad3498b1feb80b4617b415a2f2cf2785d3593` |
| `미적분II_203_최대최소의활용부피_고2_유형은행1.js` | `840297a16e14c04b3064b939b42ba9e5f62b9032e15698000970b441bd9cb62a` |
| `미적분II_204_유리무리방정식의실근의개수_고2_유형은행1.js` | `43dc734ab232bdae39b58a3f4af30b4125fa5ac57f003dd30036b5c0d25481f8` |
| `미적분II_221_도함수가주어진연속함수의부정적분_고2_유형은행1.js` | `bef8e0b40e376c5a742adb03dcf7027c2016eaad1d7c38de8c5ac7dfa0e52e1c` |
| `미적분II_239_그래프로주어진정적분의치환적분법_고2_유형은행1.js` | `0326b3a8be687d3b39317f491fca17cd6d3cc3d2c2e6f3f72c43d956764a732f` |
| `미적분II_241_지수함수로그함수의정적분의치환적분법_고2_유형은행1.js` | `4b597a337f5833d8172ab79376c10513a433b37ec1eb93343cadcbc9870dfe28` |

## 후속 운영 인계

1. 다음 시작점은 `미적분II_244`의 첫 `[그림: …]` 문항(현재 242–243에는 해당 그림 항목 없음). 다음 작업도 한 번에 **20–30문항**만 선정한다.
2. 엔진 담당에게 표의 **14개 ENGINE_CAPABILITY_PENDING**을 capability 누락 목록으로 전달한다. 7개 `status: UNSUPPORTED`는 실제 렌더 플랜인 척 사용하지 않는다. 특히 239/q02 영역 표시와 221/q05 경계 OPEN·반직선, 원·부채꼴/중첩 도형을 지원해야 한다.
3. 원문 202/q13의 `CD` 방향 충돌은 문항 담당 검토를 받아야 한다. 여기서는 문제·정답·해설을 건드리지 않았다. 원문 충돌 해결 및 엔진 지원 뒤에만 field parity를 갱신하고 실제 `SVG → PNG → 학생화면 → A4` 단계로 넘어간다.
