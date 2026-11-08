# 22 금당고 고2 수학II Q13 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 item/plan/publish 초안과 상태 기록만 저장했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 13, questionNumber 13; 기준 main `a28bec278aada73e6c39de89174738839205b902`; 정확 원문은 `preparation-22-geumdang-math2/source-exact.js` (55589 bytes, SHA-256 `7976919115b09bf20645122426e8f81c0f34bac2ace9a91a6b272ed9adeaa620`, Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`). 원본 이미지가 있는 Q11은 원문 Q11 PNG를 그대로 보존했다.

시각화 사유: 사용자는 풀이에서 함수 관계가 이해에 도움이 되면 시각 자료로 보조하고, 함수 좌표 라벨은 정확한 실제 점을 기준으로 배치하기를 원했다. 이 초안은 지원되는 도식으로 그 사유를 반영하되, 계약에서 지원하지 않는 도메인·점·함수 모양을 추정하지 않는다.

원문 문항 (source-exact.js의 content 정확 인용):

```text
13. 두 함수 $f(x)=x^3-2x^2+x$, $g(x)=x^2-2x-a$에 대하여 $x \ge -1$일 때, 함수 $y=f(x)$의 그래프가 함수 $y=g(x)$의 그래프보다 항상 위쪽에 있도록 하는 정수 $a$의 최솟값은? [4.8점]
```

원문 정답 필드 (정확 인용): `4`

선택지 정답 (정확 인용): `$8$`

원문 해설 (정확 인용):

```text
두 그래프 중 $f$가 $g$보다 항상 위에 있다는 것은 모든 $x\ge-1$에서 $f(x)-g(x)>0$이라는 뜻입니다.
$f(x)-g(x)=x^3-3x^2+3x+a=(x-1)^3+a+1$입니다.
$(x-1)^3$은 증가함수이므로 $x\ge-1$에서 최솟값은 $x=-1$일 때 $(-2)^3=-8$입니다.
따라서 $f-g\ge a+1-8=a-7$이고, 경계 $x=-1$에서도 엄격히 위에 있어야 하므로 $a-7>0$입니다.
정수 $a$의 최솟값은 $8$입니다. $a=7$이면 경계에서 두 그래프가 만나므로 허용되지 않습니다.
```

시각 계획 요약: 원래 반직선의 삼차함수 그래프를 ALL_REALS로 대체하지 않고, 엄격한 일반 조건 a>7과 정수 보기 분류를 수직선으로 나타낸다. a=8 예시의 경계값 h₈(−1)=1은 일반 실수 경계 a=7과 분리했다.

검사 기록: 원문 questionBank 항목 13를 직접 읽고 ordinal/questionNumber를 대조했다. 문항, 정답 필드, 선택지 정답, 해설을 원문 그대로 보존했다. 

미실행: author tests, 입력 계약/graph framing, semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 source/engine/assets/ledger 변경은 하지 않았다. Q05/Q09/Q18과 모든 기존 로컬 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 해시

이 세 JSON 파일을 작성 직후 동결했다. 이후 변경하지 않는다.

- item.json SHA-256: `8b3dfbe3c6dcaa3b7f7fc09cc5946133b48c626d5dd097d4921c49821880729f`
- plan.json SHA-256: `010601417f10962047e29e15acab1c2db80089f8c83ea830483c5d7f3d180699`
- publish.json SHA-256: `6962bd4cf4ef830e53eb91cc8ecf9c909bb7c15a321850213864796f85bc1acd`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 expandNumberLineFigure: PASS. 수직선 입력 함수만 통과했으며 최종 시각·수학 검수를 통과했다는 뜻은 아니다.
엄격한 실수 경계a>7과 최소 허용 정수a=8을 구분하는 부분도다. 반직선 위 삼차함수 전체 그림으로 간주하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
