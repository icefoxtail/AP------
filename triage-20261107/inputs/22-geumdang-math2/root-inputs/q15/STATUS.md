# 22 금당고 고2 수학II Q15 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 item/plan/publish 초안과 상태 기록만 저장했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 15, questionNumber 15; 기준 main `a28bec278aada73e6c39de89174738839205b902`; 정확 원문은 `preparation-22-geumdang-math2/source-exact.js` (55589 bytes, SHA-256 `7976919115b09bf20645122426e8f81c0f34bac2ace9a91a6b272ed9adeaa620`, Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`). 원본 이미지가 있는 Q11은 원문 Q11 PNG를 그대로 보존했다.

시각화 사유: 사용자는 풀이에서 함수 관계가 이해에 도움이 되면 시각 자료로 보조하고, 함수 좌표 라벨은 정확한 실제 점을 기준으로 배치하기를 원했다. 이 초안은 지원되는 도식으로 그 사유를 반영하되, 계약에서 지원하지 않는 도메인·점·함수 모양을 추정하지 않는다.

원문 문항 (source-exact.js의 content 정확 인용):

```text
15. 다음 조건을 만족시키는 모든 삼차함수 $f(x)$에 대하여 $\frac{f'(0)}{f(0)}$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $Mm$의 값은? [4.8점]

(가) 함수 $|f(x)|$는 $x=-1$에서만 미분가능하지 않다.
(나) 방정식 $f(x)=0$은 닫힌구간 $[3, 5]$에서 적어도 하나의 실근을 갖는다.
```

원문 정답 필드 (정확 인용): `5`

선택지 정답 (정확 인용): `$\frac{1}{5}$`

원문 해설 (정확 인용):

```text
핵심은 $|f(x)|$가 어느 점에서 뾰족해지는지와 삼차함수의 근의 중복도를 연결하는 것입니다.
다항함수 $f$가 $x=r$에서 $f(r)=0$이고 $f'(r)\ne0$이면 그 근을 지나며 부호가 바뀝니다. 이때 $|f|$의 좌우 기울기는 서로 반대가 되어 미분가능하지 않습니다. 반면 이중근에서는 $f$가 부호를 바꾸지 않아 $|f|$가 그 점에서도 미분가능합니다.
조건 (가)에 따라 $x=-1$은 반드시 단순근입니다. 조건 (나)로 $3\le r\le5$인 또 다른 실근이 존재합니다. 이 근이 단순근이면 $|f|$가 $r$에서도 미분가능하지 않으므로 모순입니다. 따라서 $r$은 이중근이어야 합니다. 삼차함수의 세 근의 중복도를 모두 사용하므로 $f(x)=A(x+1)(x-r)^2$ ($A\ne0$, $3\le r\le5$)입니다.
이제 $f(0)=Ar^2$이고, 곱의 미분법으로 $f'(x)=A\{(x-r)^2+2(x+1)(x-r)\}$이므로 $f'(0)=A(r^2-2r)$입니다. 따라서 $\frac{f'(0)}{f(0)}=\frac{r^2-2r}{r^2}=1-\frac2r$입니다. 상수 $A$는 분자·분모에서 약분되므로 결과에 영향을 주지 않습니다.
$3\le r\le5$에서 $r$이 커지면 $\frac2r$은 작아지므로 $1-\frac2r$은 증가합니다. 양 끝값은 $m=1-\frac23=\frac13$, $M=1-\frac25=\frac35$입니다. 따라서 $Mm=\frac13\cdot\frac35=\frac15$이며 정답은 ⑤입니다.
```

시각 계획 요약: 비율 q=f′(0)/f(0)의 범위 [1/3,3/5]를 별도 q축에 나타낸다. r∈[3,5]의 대응과 정확한 함수족은 캡션에 두며 임의의 함수 그래프는 만들지 않는다.

검사 기록: 원문 questionBank 항목 15를 직접 읽고 ordinal/questionNumber를 대조했다. 문항, 정답 필드, 선택지 정답, 해설을 원문 그대로 보존했다. 

미실행: author tests, 입력 계약/graph framing, semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 source/engine/assets/ledger 변경은 하지 않았다. Q05/Q09/Q18과 모든 기존 로컬 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 해시

이 세 JSON 파일을 작성 직후 동결했다. 이후 변경하지 않는다.

- item.json SHA-256: `9959856c343ab3073284ee53ff8342f11959f72ace3ed8e46e6286f5fe4f3b3e`
- plan.json SHA-256: `ae012d3649399eccb874b453c2f51a09a90e5c6b6c4b274093d89fe59c278617`
- publish.json SHA-256: `7b65565dcb5e7a95e19afc57bffb0c53ffa07b549d089478429c13c8740c73a8`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 expandNumberLineFigure: PASS. 수직선 입력 함수만 통과했으며 최종 시각·수학 검수를 통과했다는 뜻은 아니다.
정해지지 않은 r 또는 A를 임의 숫자로 고정하지 않았고 비의 구간을 별도q축에 표시한다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
