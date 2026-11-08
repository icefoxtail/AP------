# 22 복성고 고2 수학II Q19 로컬 입력 초안

원문 고정: main a28bec278aada73e6c39de89174738839205b902, blob 2f49f3a37342ca8116c9dd90a4665a1b51e0ca18. source-exact.js에서 questionNumber와 ordinal을 직접 대조했다.

원문 문항(정확한 문자열):

```text
19. 최고차항의 계수가 양수인 사차함수 $f(x)=ax^4+bx^2+c$ ($a, b, c$는 상수)가 다음 조건을 만족시킨다. $|f(x)|=k$의 서로 다른 실근의 개수가 4개일 때의 $k$값을 구하시오. [4.5점]

가. 방정식 $f(x)=0$의 모든 실근이 $\alpha, \beta, \gamma$이다. (단, $\alpha < \beta < \gamma$)
나. $f(1)=-\frac{3}{4}, f'(-1)=1$
```

원문 정답(정확한 문자열):

```text
①
```

원문 해설(정확한 문자열):

```text
$f$는 짝함수이므로 0이 아닌 실근은 $\pm r$로 짝지어집니다. 서로 다른 실근이 정확히 3개라면 가운데 근은 0이므로 $c=0$입니다. 조건에서 $$f(1)=a+b=-\frac34,\quad f'(-1)=-4a-2b=1.$$ 두 식을 풀면 $a=1/4$, $b=-1$이어서 $$f(x)=\frac14x^4-x^2.$$ $f'(x)=x(x^2-2)$이므로 $x=0$에서 극대 0, $x=\pm\sqrt2$에서 극소 -1입니다. $|f(x)|=k$에서 $k>0$이면 $f(x)=k$는 2개 실근을 갖습니다. $f(x)=-k$는 $0<k<1$에서 4개, $k=1$에서 접점 2개, $k>1$에서 0개입니다. 따라서 전체 실근이 정확히 4개인 값은 $$\boxed{k=1}$$로 ①입니다. ②~⑤는 $f(x)=-k$의 실근이 없어서 전체가 2개뿐입니다.
```

계수와 exactCoordinates는 원문 해설의 정확한 대수식에 결속했다. 표시 좌표의 내부 수치 위치는 곡선 표본용이며, 학생에게 공개하는 root labels는 nested radical 표현으로 정확히 기록했다. 사용자 요청에 따라 좌표 지시선 순서를 고정했지만 실제 렌더 가독성은 미검수다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제 테스트: NOT_RUN. 전체 수학 검수, 엔진 검증, 렌더/시각 검토, build, publication, handoff: NOT_RUN. 별도 독립 checker가 초안 동결 후 검사한다. 이 작업에서는 원문, engine, ledger, assets, 이전 packages, Q07/Q10, 원격 상태를 변경하지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 linear_text 모듈 누락은 검사 환경 오류였다. 공식 helper의 로컬 경로를 보완한 뒤 같은 후보 입력으로 통과했으며 엔진 원본이나 plan을 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
