# 22 순천고 고2 수학II Q13 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 입력 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal 13, questionNumber 13; exact source `preparation-22-suncheon-math2/source-exact.js` (49980 bytes), Git blob SHA-1 `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`; 기준 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 원문 images: [].

시각화 사유: 사용자 지시: 이해에 도움이 되는 함수 도식은 그래프로 보조한다. 실제 곡선의 관련 핵심 좌표는 해당 점에 연결되는 coordinateLeader로 표시한다. Q13은 functionName을 생략하고 지원되는 축 제목 “접점 t”, “K(t)”를 사용해 높이 매개변수 k와 함수 표기를 구별한다.

수학·범위 요약: 접점 매개변수 t에서 점 (−1,k)를 지나는 접선의 높이는 K(t)=3−3t²−2t³이다. 이 그래프의 가로 좌표 x는 접점 매개변수 t를 뜻한다. K의 극솟점 (−1,2)와 극댓점 (0,3) 사이에서 2<k<3일 때 서로 다른 세 접점이 생기므로 세 접선을 그을 수 있다.

원문 인용(정확, 문항; questionBank[12].content):

```text
13. 점 $(-1, k)$에서 곡선 $y=x^3-3x$에 서로 다른 세 개의 접선을 그을 수 있을 때, 다음 중 실수 $k$의 값의 범위가 $\alpha < k < \beta$일 때, $\alpha+\beta$의 값은? [4.6점]
```

원문 인용(정확, 정답):

```text
⑤
```

원문 인용(정확, 해설):

```text
[접선 조건] 접점을 $x=t$라 두면 $y=x^3-3x$의 접선은 $y=(3t^2-3)(x-t)+t^3-3t$이다.
이 직선이 $(-1,k)$를 지나야 하므로 $k=(3t^2-3)(-1-t)+t^3-3t=3-3t^2-2t^3$.
점에서 서로 다른 세 접선을 그을 조건은 방정식 $3-3t^2-2t^3=k$가 서로 다른 세 실근을 갖는 것이다.
$K(t)=3-3t^2-2t^3$의 도함수는 $K'(t)=-6t(t+1)$이고 극값은 $K(-1)=2$, $K(0)=3$이다. 따라서 $2<k<3$일 때 접점이 세 개다.
$\alpha=2$, $\beta=3$이므로 합은 5.
[보기 판단] ① 1, ② 2, ③ 3, ④ 4는 양 경계값의 합 5와 다르다. ⑤ 5가 정답. 경계 $k=2,3$에서는 중근 때문에 세 접선이 아니다.
```

검사 기록: exact-source questionBank에서 문항·정답·해설을 추출하고 sourcePath/ordinal/questionNumber를 대조했다. 수식의 주요 계수와 표시 좌표는 원문 풀이를 따라 정적으로 확인했다. 세 JSON 파일의 구문 검사는 PASS; 전용 checker 입력 검사는 아직 수행 전이다.

미실행: checker check_suncheon_input_contracts, production input functions, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 원격 쓰기, 원본·기존 자산·ledger 변경은 하지 않았다. 이 초안은 READY가 아니다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 1개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
