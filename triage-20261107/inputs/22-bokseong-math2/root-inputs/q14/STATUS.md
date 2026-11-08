# 22 복성고 고2 수학II Q14

출처 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, 기준 main `a28bec278aada73e6c39de89174738839205b902`, source blob `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`. 원문 questionBank ordinal 14; source-exact.js의 questionBank에서 원문 item, 정답, 해설을 확인해 plan.sourceQuote에 해설 문자열을 그대로 복사했다. 기존 시험지 원본·그림과 다른 문항 package는 변경하지 않았다.

원문 해설 인용 (verbatim):

두 곡선은 $x=0,1$에서 만나고 이 구간에서 위쪽은 $y=-x^4+x$, 아래쪽은 $y=x^4-x^3$입니다. 전체 넓이는 $$S=\int_0^1[(-x^4+x)-(x^4-x^3)]dx=\int_0^1(-2x^4+x^3+x)dx=\frac7{20}.$$ 가운데 곡선 $y=ax(1-x)$ 아래쪽과 아래 곡선 사이 넓이는 $$S_1=\int_0^1[ax(1-x)-(x^4-x^3)]dx=\frac a6+\frac1{20}.$$ 넓이를 이등분하므로 $S_1=S/2=7/40$이고 $$\frac a6+\frac1{20}=\frac7{40}\Rightarrow a=\frac34.$$ 따라서 $$f(1/2)=\frac34\cdot\frac12\cdot\frac12=\boxed{\frac3{16}}.$$ ②~⑤는 전체 넓이와 반쪽 넓이를 동일하게 만든 $a$를 대입한 값이 아닙니다.

계획 범위: [0,1]에서 원문 세 곡선 y=x⁴−x³, y=−x⁴+x, y=3x(1−x)/4와 두 영역 각각 7/40. Q14 정확근 검수는 미실행이다.

사유: 사용자가 풀이 이해에 도움이 되는 함수 도식을 원함.

코드 검사상 알려진 기술적 한계: 이 입력의 상측 사차 referenceCurve y=−x⁴+x의 도함수 1−4x³은 rational/허용 2차 근 형식으로 인수분해되지 않는 기약 3차식이다. 현재 계약 설명은 사차곡선의 정확한 근·극점을 요구하며 이를 표현할 exact root syntax가 정의되지 않는다. 이는 소스/엔진 코드 읽기에서 확인한 제한이며, 실제 checker를 실행한 실패는 아니다. 세 곡선과 두 영역은 그대로 보존했다.

상태: LOCAL_ONLY / DRAFT_ONLY. plan.json, publish.json, item.json을 preparation package용 입력 초안으로만 작성했다. 의도대로 모든 입력이 기록된 뒤 checker가 검수하도록 하며, 작성자가 독립 checker·수학검수·렌더를 실행하지 않았다.

실제 입력 fit, semantic validation, engine preparation, renderer/build, SVG/PNG, browser/visual review, 전체 수학·문구 검토, CI, publication, handoff/READY 판정: NOT_RUN.
Q14 코드-검사 제한은 위에 적은 inspection-only finding이며 실제 checker failure가 아니다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.
상측 사차곡선의 정확한 세제곱근 극점에 대한 코드 검토상의 제한을 보존한다. 실제 실행 실패로 변환하지 않고 NOT_RUN으로 유지한다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## 입력 오류 보정 이력

상위 작업자가 확인한 실제 첫 checker 오류: `PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH:lower:1/8`. 원인은 아래 referenceCurve의 계수가 `[0,0,-1,1,0]`로 잘못 전사되어 `x³−x²`를 뜻한 점이다. 원문·수식 `x⁴−x³`는 그대로 두고 계수만 `[0,0,0,-1,1]`로 고쳤다. 이는 정확히 `x⁴−x³`의 상수항부터 오름차순 계수다.

이 보정 뒤 checker 재실행은 하지 않았다. 상측 사차곡선의 미분 `1−4x³`에 대한 정확근 처리 제한은 아직 checker에서 확인되지 않은 미검증 가능성으로 유지한다. 실제 render·visual review도 NOT_RUN이다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

수식·계수 오기를 최소 정정한 현재본의 실제 fit_overview 결과: **FAIL — PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM**. 상측 사차곡선의 세제곱근 극점에 현행 정확근 표현 제한이 확인됐다. 정확한 세 곡선·두 영역 계획을 그대로 보존하며 TECHNICAL_HOLD로 둔다. 후속 spec/semantic/좌표·viewport/렌더는 NOT_RUN이다. 근사 곡선이나 가짜 수치로 대체하지 않았다. 첫 수식 불일치 실패와 수정 전 파일도 보존했다.
초기 실패는 failure-history.json 및 corrections/before/q14에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
