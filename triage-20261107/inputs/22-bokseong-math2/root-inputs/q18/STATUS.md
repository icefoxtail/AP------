# 22 복성고 고2 수학II Q18 로컬 입력 초안

원문 고정: main a28bec278aada73e6c39de89174738839205b902, blob 2f49f3a37342ca8116c9dd90a4665a1b51e0ca18. source-exact.js에서 questionNumber와 ordinal을 직접 대조했다.

원문 문항(정확한 문자열):

```text
18. 최고차항의 계수가 1인 삼차함수 $y=f(x)$와 기울기가 2인 직선이 $x=-1$인 점에서 접하고, $x=2$인 점에서 만난다. 함수 $y=f(x)$는 $x=p$에서 극대이고 $x=q$에서 극소이다. 두 점 $\mathrm{A}(p, f(p)), \mathrm{B}(q, f(q))$에 대하여 선분 $\mathrm{AB}$를 대각선으로 하는 직사각형의 넓이를 구하시오. [4.5점]
```

원문 정답(정확한 문자열):

```text

```

원문 해설(정확한 문자열):

```text
조건·목표: 접선 조건으로 극대점 A와 극소점 B를 구하고, AB를 대각선으로 하는 직사각형의 넓이가 결정되는지 확인한다.
풀이 ① 기울기가 2인 접선을 y=2x+b라고 하면, 최고차항 계수가 1이고 x=-1에서 접하며 x=2에서 만나는 조건에 따라 f(x)-(2x+b)=(x+1)²(x-2)=x³-3x-2이다. 따라서 f(x)=x³-x+b-2이다.
풀이 ② f'(x)=3x²-1이므로 극대점의 x좌표는 p=-1/√3, 극소점의 x좌표는 q=1/√3이다. 두 점의 가로·세로 좌표 차는 각각 |p-q|=2/√3, |f(p)-f(q)|=4/(3√3)이다.
풀이 ③ 직사각형의 두 변이 좌표축과 평행하다는 조건이 추가되면 넓이는 [2/√3]×[4/(3√3)]=8/9이다. 그러나 대각선 AB만 정해진 직사각형은 변의 방향을 바꾸어 여러 개 만들 수 있고, 그 넓이는 서로 다르다.
결론: 제시된 조건만으로는 직사각형의 넓이가 하나로 결정되지 않는다.
```

콘텐츠 상태: HOLD. 원문 정답 필드는 빈 문자열로 보존했다. source solution은 방향 조건 부재로 넓이가 결정되지 않음을 밝힌다. `plan.json`은 LOCAL_NON_EXECUTABLE_CONTENT_HOLD 기록이며 engine plan이 아니다. 엔진 검증은 NOT_APPLICABLE_CONTENT_HOLD. publish 상태: NO_PUBLISH / DO_NOT_PUBLISH. publish.json에는 일반 문구 초안만 남기고 게시 가능 표시를 만들지 않았다. 8/9는 축평행이라는 원문에 없는 추가 조건을 가정한 예일 뿐이다.

상태: LOCAL_ONLY / DRAFT_ONLY. 실제 테스트: NOT_RUN. 전체 수학 검수, 엔진 검증, 렌더/시각 검토, build, publication, handoff: NOT_RUN. 별도 독립 checker가 초안 동결 후 검사한다. 이 작업에서는 원문, engine, ledger, assets, 이전 packages, Q07/Q10, 원격 상태를 변경하지 않았다. 효천 reference 접근 거부는 재시도하거나 우회하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

이 문항은 비실행 LOCAL_NON_EXECUTABLE_CONTENT_HOLD 기록이다. 원본 answer는 빈 문자열 그대로이며 단일 답/도형을 만들지 않았다. 엔진 검사는 NOT_APPLICABLE_CONTENT_HOLD, 게시 금지 상태다. 이는 원문 조건 부족에 따른 보류이며 엔진 전체가 모든 관련 도식을 지원하지 못한다는 판정은 아니다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 보존 결과

Q18은 비실행 CONTENT_HOLD를 유지한다. 엔진 함수를 호출하지 않았고 빈 원문 정답을 바꾸지 않았다. 입력 구문·출처·동결 해시만 확인했으며 단일 정답 도형/게시 없음.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
