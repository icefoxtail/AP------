# 19 금당고 고2 수학II 2학기 기말 Q04 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`). `item.json`은 원본 경로와 `ordinal: 4`로 원문 행을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
함수 $f(x)=x^2-1$에 대하여 닫힌구간 $[0,1]$에서 평균값 정리를 만족시키는 실수 $c$의 값은? [4.0점]
```

## 원문 선택지 (정확 문자열)

```text
$\dfrac{1}{4}$ / $\dfrac{1}{2}$ / $\dfrac{3}{4}$ / $1$ / $\dfrac{5}{4}$
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
평균값 정리에서 구하는 점 $c$는 구간의 평균변화율과 순간변화율을 같게 한다.
$\dfrac{f(1)-f(0)}{1-0}=\dfrac{0-(-1)}1=1$
$f'(x)=2x$이므로
$2c=1$
$c=\dfrac12$
따라서 정답은 ②이다.
```

## 시각 목적 및 계획

사용자 사유: 함수 그림은 풀이 이해에 도움이 되므로 해당 함수 관계를 정확히 보조한다. 기존 자동 프레임에서 관심 구간 [0,1]이 너무 작게 보였던 가독성 보완 이력을 유지한다. 이번 초안은 [0,1]만 정의역으로 하는 닫힌 구간 부분 그래프와 평행 할선·접선을 계획하지만, 이를 해결했다고 판정하지 않는다. 계획과 좌표 라벨: 닫힌구간 [0,1]에서 f(x)=x²−1의 그래프에 할선 y=x−1과 x=1/2에서의 접선 y=x−5/4를 함께 표시한다. 두 직선의 기울기는 모두 1이다. `coordinateLeader`는 실제로 그린 점에 연결한다. 시험지 triage 이력: PR #534의 Q14 발문·정답 수정, Q11·Q15·Q17·Q21 해설 검수 및 #1405 메타 이력을 보존한다. 이 초안은 원문, 메타데이터, 판정표, 원격 기록을 수정하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 정적 JSON 파싱·원문 문자열/ordinal/source-hash 대조 PASS. 이는 출처·형식 연결만 확인하며 학생용 수학·교육·시각 품질 PASS를 뜻하지 않는다. 현재 입력 checker NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 독립 수학 검토 NOT_RUN, 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content, choices, answer, solution 문자열을 위에 source-exact.js의 정확한 행으로 보존했다. 원본과 과거 이력, source/assets, Q09/Q10의 기존 SVG, ledger, queue, 다른 draft는 변경하지 않았으며 이 초안 세트의 로컬 입력 파일만 추가했다. 원격 쓰기 0회.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-11-15-018Z` / `original9-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/original9-corrected/node-results-2026-11-09T00-11-15-018Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
