# 22 금당고 고2 수학II Q11 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 item/plan/publish 초안과 상태 기록만 저장했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 11, questionNumber 11; 기준 main `a28bec278aada73e6c39de89174738839205b902`; 정확 원문은 `preparation-22-geumdang-math2/source-exact.js` (55589 bytes, SHA-256 `7976919115b09bf20645122426e8f81c0f34bac2ace9a91a6b272ed9adeaa620`, Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`). 원본 이미지가 있는 Q11은 원문 Q11 PNG를 그대로 보존했다.

시각화 사유: 사용자는 풀이에서 함수 관계가 이해에 도움이 되면 시각 자료로 보조하고, 함수 좌표 라벨은 정확한 실제 점을 기준으로 배치하기를 원했다. 이 초안은 지원되는 도식으로 그 사유를 반영하되, 계약에서 지원하지 않는 도메인·점·함수 모양을 추정하지 않는다.

원문 문항 (source-exact.js의 content 정확 인용):

```text
11. 그림과 같이 한 변의 길이가 $9\mathrm{cm}$인 정사각형의 한 꼭짓점 $\mathrm{A}$를 출발하여 그림의 화살표 방향으로 진행하는 두 점 $\mathrm{P}$, $\mathrm{Q}$가 있다. 점 $\mathrm{A}$를 출발하여 $t$초 후의 두 점 $\mathrm{P}$, $\mathrm{Q}$의 속력이 각각 $7t+5(\mathrm{cm}/\text{초})$, $3t+2(\mathrm{cm}/\text{초})$일 때, 두 점 $\mathrm{P}$, $\mathrm{Q}$가 동시에 출발한 후 9초 동안 두 점이 만난 횟수는 $n$이다. 이때, $n$의 값은? [4.8점]

<img src="assets/images/22_금당고_2학기_기말_고2_수학II/q11.png" style="max-width:300px; display:block; margin:10px auto;" />
```

원문 정답 필드 (정확 인용): `4`

선택지 정답 (정확 인용): `$13$`

원문 해설 (정확 인용):

```text
두 점은 같은 꼭짓점 $A$에서 출발하지만 그림의 화살표처럼 정사각형 둘레를 서로 반대 방향으로 움직입니다. 한 변이 $9\mathrm{cm}$이므로 둘레는 $4\cdot9=36\mathrm{cm}$입니다.
속력은 매초 달라지므로 단순히 속력에 시간을 곱하지 않고, $0$초부터 $t$초까지 속력을 적분하여 이동거리를 구합니다.
$P$의 이동거리는 $s_P(t)=\int_0^t(7u+5)\,du=\frac72t^2+5t$이고, $Q$의 이동거리는 $s_Q(t)=\int_0^t(3u+2)\,du=\frac32t^2+2t$입니다.
서로 반대 방향으로 출발했으므로, 두 점이 다시 같은 위치에 오려면 두 점이 이동한 거리의 합이 둘레의 정수배여야 합니다. 따라서 만나는 시각은 $s_P(t)+s_Q(t)=5t^2+7t=36k$ ($k=1,2,3,\ldots$)를 만족합니다.
$t\ge0$에서 $5t^2+7t$는 계속 증가하므로 각 양의 정수 $k$에 대응하는 시각은 많아야 한 번입니다. $t=9$에서 $5\cdot9^2+7\cdot9=405+63=468=36\cdot13$입니다. 따라서 $0<t\le9$에서 $k=1,2,\ldots,13$이 각각 정확히 한 번 성립합니다.
출발 순간 $t=0$은 '출발한 후'의 만남 횟수에서 제외하고, $t=9$는 9초 동안에 포함합니다. 그러므로 $n=13$이고 정답은 ④입니다.
```

시각 계획 요약: 수직선에는 만남 시각을 임의로 나열하지 않고 가능한 정수 배수 k=1,…,13만 integerPoints로 표시한다. 반대방향 조건과 출발 순간 t=0 제외, 9초 끝점 포함은 캡션에 썼다.

검사 기록: 원문 questionBank 항목 11를 직접 읽고 ordinal/questionNumber를 대조했다. 문항, 정답 필드, 선택지 정답, 해설을 원문 그대로 보존했다. 원문 Q11 PNG는 수정하지 않았다.

미실행: author tests, 입력 계약/graph framing, semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 source/engine/assets/ledger 변경은 하지 않았다. Q05/Q09/Q18과 모든 기존 로컬 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 해시

이 세 JSON 파일을 작성 직후 동결했다. 이후 변경하지 않는다.

- item.json SHA-256: `8b58487a3cfcb469e3f0ad6274cf6cddb6481263a4d5d75728ad662cfd293464`
- plan.json SHA-256: `a4068c8e9be2b0270e66ee60ed971dc3d52f69c98249c9080bf638fd250ba41b`
- publish.json SHA-256: `7218d3b41867f0289756ad01a27c547e05fa613af8a6e1c1288868a0ca01956b`


## 2026-11-09 로컬 Q11 입력 정정 기록

첫 독립 입력 검사 결과: **FAIL** — 정확 오류 코드 `NUMBER_LINE_ROW_LABEL_INVALID`. 실패 위치는 `numberLine.rows[0].label`이다. 계약 함수 `rowLabelOf`는 금지문자 없는 한 줄의 일반 텍스트에 대해 `ROW_LABEL_MAX_CHARS=6`을 적용한다. 기존 `만남 배수 k`는 7자로 제한을 넘었다.

정정: 보존 사본을 `preparation-22-geumdang-math2/corrections/before/q11/plan.json` 및 `STATUS.md`에 저장한 뒤, `numberLine.rows[0].label`만 `만남 배수 k`에서 `만남 배수`로 바꿨다 (5자). 수학, 수치, 행 종류, 캡션은 바꾸지 않았다. `item.json`과 `publish.json`은 변경하지 않았다.

정정 후 동결 SHA-256:
- item.json: `8b58487a3cfcb469e3f0ad6274cf6cddb6481263a4d5d75728ad662cfd293464`
- plan.json: `de4f6691cf453d252ae08d97f306faf5978978f39acf6736ddad2e0eeb682fa2`
- publish.json: `7218d3b41867f0289756ad01a27c547e05fa613af8a6e1c1288868a0ca01956b`

정정 후 재검사는 수행하지 않았다. 입력 계약 재검사, 렌더, 시각검토, 전체 수학검토, 게시 및 인계는 **NOT_RUN**, checker 재검사를 기다린다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T20-03-57-102Z.json` 및 같은 시각의 Python 결과.

실제 expandNumberLineFigure: PASS. 수직선 입력 함수만 통과했으며 최종 시각·수학 검수를 통과했다는 뜻은 아니다.
행 이름 길이 오류만 줄여 정정했고 실제 원본 정사각형·방향·미지 만남 시간은 임의로 재구성하지 않았다. 양의 정수 배수만 표현한 부분도다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
