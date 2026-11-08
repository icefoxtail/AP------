# 22 복성고 고2 수학II Q21 로컬 입력 초안

원문 고정: main a28bec278aada73e6c39de89174738839205b902, blob 2f49f3a37342ca8116c9dd90a4665a1b51e0ca18. source-exact.js에서 questionNumber와 ordinal을 직접 대조했다.

원문 문항(정확한 문자열):

```text
[서술형 1]
겉넓이가 $24\pi$로 일정하면서 부피가 최대인 원기둥을 만드는 활동을 하려고 한다. 아래의 물음에 답하시오. [총 10.0점]

(1) 원기둥의 부피($V$)를 밑면의 반지름의 길이($r$)를 이용한 식으로 나타내 보자. [4.0점]
(2) 원기둥의 부피가 최대일 때 부피를 구하시오. [6.0점]
```

원문 정답(정확한 문자열):

```text
(1) $V=\pi(12r-r^3)$; (2) $16\pi$
```

원문 해설(정확한 문자열):

```text
(1) 반지름 $r>0$, 높이 $h>0$인 닫힌 원기둥의 겉넓이는 두 밑면과 옆면의 합 $$2\pi r^2+2\pi rh=24\pi$$입니다. 따라서 $$h=\frac{12-r^2}{r},\quad 0<r<\sqrt{12}.$$ 부피는 $$V=\pi r^2h=\boxed{\pi(12r-r^3)}$$입니다.<br>(2) $$V'(r)=\pi(12-3r^2)=3\pi(4-r^2).$$ 정의역에서 $0<r<2$이면 증가, $2<r<\sqrt{12}$이면 감소하므로 $r=2$에서 최대입니다. 이때 $h=(12-4)/2=4$이고 $$V_{\max}=\pi\cdot2^2\cdot4=\boxed{16\pi}.$$ 최대값을 구할 때 $r$의 양수·높이 양수 조건도 확인했습니다.
```

표현 범위: 원문에서 겉넓이가 24*pi로 고정된 닫힌 원기둥의 최적 사례 하나다. 모든 원기둥이나 다른 겉넓이에서 r:h=1:2를 보편화하지 않았다. 별도 solid validator/engine 검사와 렌더는 수행하지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제 테스트: NOT_RUN. 전체 수학 검수, 엔진 검증, 렌더/시각 검토, build, publication, handoff: NOT_RUN. 별도 독립 checker가 초안 동결 후 검사한다. 이 작업에서는 원문, engine, ledger, assets, 이전 packages, Q07/Q10, 원격 상태를 변경하지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 solveSolidFigure / solidFigureSpec / expandSolidFigure: PASS. 이는 실형 입력 함수의 통과이며 렌더·시각 검수 통과가 아니다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
