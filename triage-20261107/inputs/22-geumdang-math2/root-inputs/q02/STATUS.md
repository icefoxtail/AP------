# 22 금당고 고2 수학II Q02 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 이 문항 폴더에 item/plan/publish 초안과 상태 기록만 저장했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal 2, questionNumber 2; 기준 main `a28bec278aada73e6c39de89174738839205b902`; 정확 원문은 `preparation-22-geumdang-math2/source-exact.js` (55589 bytes, SHA-256 `7976919115b09bf20645122426e8f81c0f34bac2ace9a91a6b272ed9adeaa620`, Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`). 원본 이미지가 있는 Q11은 원문 Q11 PNG를 그대로 보존했다.

시각화 사유: 사용자는 풀이에서 함수 관계가 이해에 도움이 되면 시각 자료로 보조하고, 함수 좌표 라벨은 정확한 실제 점을 기준으로 배치하기를 원했다. 이 초안은 지원되는 도식으로 그 사유를 반영하되, 계약에서 지원하지 않는 도메인·점·함수 모양을 추정하지 않는다.

원문 문항 (source-exact.js의 content 정확 인용):

```text
2. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$는

$$x = t^3 - 6t^2 + 9t$$

라고 하자. $t=2$일 때, 점 $\mathrm{P}$의 속도는? [4.0점]
```

원문 정답 필드 (정확 인용): `1`

선택지 정답 (정확 인용): `$-3$`

원문 해설 (정확 인용):

```text
속도는 위치를 시간에 대해 미분한 값입니다. 위치 $x(t)=t^3-6t^2+9t$이므로
$v(t)=x'(t)=3t^2-12t+9$입니다.
$t=2$를 대입하면 $v(2)=3\cdot4-12\cdot2+9=12-24+9=-3$입니다. 속도는 방향을 나타내는 부호를 가지므로 $3$이 아니라 $-3$입니다.
```

시각 계획 요약: 실제 시간 반직선 t≥0의 속도 이차식만 그린다. 위치식 x(t)=t³−6t²+9t는 속도식과 캡션에서 구분하고, 원문에 없는 단위를 추가하지 않는다.

검사 기록: 원문 questionBank 항목 2를 직접 읽고 ordinal/questionNumber를 대조했다. 문항, 정답 필드, 선택지 정답, 해설을 원문 그대로 보존했다. 

미실행: author tests, 입력 계약/graph framing, semantic/coordinate/viewport 검사, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 source/engine/assets/ledger 변경은 하지 않았다. Q05/Q09/Q18과 모든 기존 로컬 패키지는 보호했고 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.

## JSON 동결 해시

이 세 JSON 파일을 작성 직후 동결했다. 이후 변경하지 않는다.

- item.json SHA-256: `15328ccdc7700b3ea30c3ee94cd1292185a27175398b5f983169ae7c2729027d`
- plan.json SHA-256: `ba25c9f5438a7fecb57f1891699c3522f6a8569bba035ed651d40f5aa6e201bf`
- publish.json SHA-256: `2ee9abcb5ce3b1c2cb0901fd1889ffa72e1be259c83c611a675465a2ecb6a798`


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
t≥0의 속도 도식이며 원래 삼차 위치 곡선을 그렸다고 주장하지 않는다. 위치·속도 수식과 단위를 구분한다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
