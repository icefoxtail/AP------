# 22 복성고 고2 수학II Q17 로컬 입력 초안

원문 고정: main a28bec278aada73e6c39de89174738839205b902, blob 2f49f3a37342ca8116c9dd90a4665a1b51e0ca18. source-exact.js에서 questionNumber와 ordinal을 직접 대조했다.

원문 문항(정확한 문자열):

```text
17. 함수 $f(x)=2x^3-3(n+2)x^2+12nx+16n$에 대하여, $x \ge 0$에서 부등식 $f(x) \ge 0$이 항상 성립하도록 하는 자연수 $n$의 개수를 구하시오. [4.5점]
```

원문 정답(정확한 문자열):

```text
③
```

원문 해설(정확한 문자열):

```text
$x\ge0$에서 항상 $f(x)\ge0$인지 확인하려면 구간의 최솟값을 조사합니다. $$f'(x)=6x^2-6(n+2)x+12n=6(x-2)(x-n).$$ $n=1$이면 $x=2$에서 국소최소이고 $f(2)=4(7n-2)=20>0$입니다. $n=2$이면 도함수가 $6(x-2)^2\ge0$이므로 $f$는 증가하고 $f(0)=32>0$입니다. $n>2$이면 $x=2$에서 국소최대, $x=n$에서 국소최소이며 $f(0)=16n>0$입니다. $$f(n)=-n(n-8)(n+2).$$ $n$은 자연수이므로 $f(n)\ge0$은 $n\le8$과 동치입니다. 따라서 조건을 만족하는 $n$은 $1,2,\ldots,8$의 **8개**로 정답은 ③입니다. ①·②·④·⑤는 경계 $n=8$ 또는 $n=1,2$의 별도 판단을 잘못한 경우입니다.
```

표시는 전체 자연수 매개변수 집합이다. 경계 사례 f_8(x)=2*(x-8)^2*(x+1)은 캡션에 정확히 보존했으며, 원문 함수군의 개별 대표곡선으로 오인할 수 있는 x 전구간 도식은 만들지 않았다. 별도 renderer/checker 입력 실행은 하지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제 테스트: NOT_RUN. 전체 수학 검수, 엔진 검증, 렌더/시각 검토, build, publication, handoff: NOT_RUN. 별도 독립 checker가 초안 동결 후 검사한다. 이 작업에서는 원문, engine, ledger, assets, 이전 packages, Q07/Q10, 원격 상태를 변경하지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 expandNumberLineFigure: PASS. 이는 수직선 입력 함수의 통과이며 도식의 최종 시각 검수나 전체 수학 검토 통과가 아니다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
