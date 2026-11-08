# 22 복성고 고2 수학II Q16 로컬 입력 초안

원문 고정: main a28bec278aada73e6c39de89174738839205b902, blob 2f49f3a37342ca8116c9dd90a4665a1b51e0ca18. source-exact.js에서 questionNumber와 ordinal을 직접 대조했다.

원문 문항(정확한 문자열):

```text
16. 함수 $f(x)=x^3-3x+a$에서 $F(x)=\int_{0}^{x} f(t)dt$가 단 하나의 극값을 갖도록 하는 상수 $a$의 값이 될 수 없는 것은? [4.5점]
```

원문 정답(정확한 문자열):

```text
③
```

원문 해설(정확한 문자열):

```text
$F'(x)=f(x)=x^3-3x+a$이므로 $F$의 극값은 $f$가 0을 지나며 부호가 바뀌는 지점에서 생깁니다. $f'(x)=3(x-1)(x+1)$이고, $f(-1)=a+2$는 극댓값, $f(1)=a-2$는 극솟값입니다. $-2<a<2$이면 두 극값이 서로 다른 부호이므로 $f=0$은 서로 다른 실근 3개를 갖고, $F$도 극값이 3개입니다. $a>2$ 또는 $a<-2$이면 $f$는 한 번만 0을 지나므로 $F$는 극값이 하나입니다. 경계 $a=\pm2$에서도 $f$의 중근에서는 부호가 바뀌지 않고 다른 단근에서만 바뀌므로 극값은 하나입니다. 보기 중 $-2<a<2$에 해당하는 것은 $a=-1$뿐이므로 될 수 없는 값은 ③입니다.
```

도식은 매개변수 구간과 선택지의 관계를 보여 주는 수직선이다. 전체 매개변수 함수군을 하나의 대표 곡선으로 바꾸지 않았다. 별도 renderer/checker 입력 실행은 하지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제 테스트: NOT_RUN. 전체 수학 검수, 엔진 검증, 렌더/시각 검토, build, publication, handoff: NOT_RUN. 별도 독립 checker가 초안 동결 후 검사한다. 이 작업에서는 원문, engine, ledger, assets, 이전 packages, Q07/Q10, 원격 상태를 변경하지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## Minimal local input correction

Before-correction plan and STATUS were preserved at `preparation-22-bokseong-math2/corrections/before/q16/`. The numeric POINTS row had `order: [A,B,C,D,E]`, which is invalid for numeric-valued points: the current number-line order contract reserves `order` for rows containing symbolic value-free points and sorts numeric points from their numeric values. Removed only that `order` property. The five source choice values `-5,-3,-1,2,4`, the parameter SET boundaries at `-2` and `2`, all other plan math, and the source conditions remain unchanged. No author tests or checker runs were performed; verification remains NOT_RUN pending independent checker.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 expandNumberLineFigure: PASS. 이는 수직선 입력 함수의 통과이며 도식의 최종 시각 검수나 전체 수학 검토 통과가 아니다.
초기 실패는 failure-history.json 및 corrections/before/q16에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
