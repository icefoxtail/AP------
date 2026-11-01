# 현재 규칙 (2026-11-01, plan.md·fixup.md의 옛 문구보다 우선)

1. **해설 그림은 학생이 풀이를 따라가며 확인하는 자료다.** 그림 안에는 풀이 핵심 단계의 중간값만(TARGETS의 "그림:" 목록; 너무 많으면 캡션으로), 정답(구하는 값·보기 번호)은 그림이 아니라 publish.json caption(과 alt)에. 해설이 값을 구한 문자 미지수는 실제 값으로 그린다.
2. **문제 그림과 해설 풀이 방식을 먼저 본다.** questionImage를 Read로 보고 점 이름·배치를 맞춘다. solution이 쓰는 방법(넓이 옮기기·나비 날개, 합동, 닮음, 보조선, 이등분)이 그림에서 보이게 그린다 — 렌더가 통과해도 풀이 방식이 안 보이면 실패다.
3. **관계는 색으로 묶는다(C1).** 같은 크기의 각(`equalAngles[].color`·`angles[].color`), 같은 길이(`equalLengths[].color`), 평행(`parallels[].color`), 대응변(`segmentColors`), 같은 넓이·합동 영역(`regions[].fill` BLUE·WARM… + `equalAreas`). 묶음은 핵심 2~3개, 주로 BLUE·WARM. 관계가 없으면 억지로 칠하지 않는다. 사용법은 `/home/user/AP------/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`에서 grep(`equalAreas`, `segmentColors`, `equalAngles`). 기준은 화면에서 또렷함.
4. **라벨 자리가 없거나 다른 선분·각에 붙어 읽히면** 지시선으로 끌어내기·E37 `planeMarks.callouts`(SEGMENT/ANGLE, 좁은 각은 `"arcScale":"PROPORTIONAL"`, `angleDimension`)를 먼저 쓴다. 필수 라벨을 지워 통과시키지 않는다. 패널 제목은 학생에게 뜻 있는 말(작업 메모 금지).
5. 렌더는 하나씩, 1분 부하 7 이상이면 기다린다. 문항당 렌더 5번 안. 끝나면 figure.png를 직접 보고 1~4를 확인한 뒤 보고.
6. 못 그리면 UNSUPPORTED로 빠진 엔진 기능을 정확히 적는다(엔진 확장 후보).
7. **그래프 문항(고교)**: 식이 없는 문제 그림을 근사할 때 근사로 만든 좌표값은 그림에 쓰지 않는다(학생이 주어진 값으로 오해). 그래프가 해설의 어떤 함수(f, g, F, f′…)인지 곡선 이름표나 축 제목으로 반드시 보인다. 직선 라벨은 선 끝(`labelAt END`). 예시 값으로 그린 그림(k=−4, t=1 등)은 캡션에 "예:"로 밝힌다. 이유: 26 순천여고 q9·q20·q21 검수 지적.
8. **헷갈리는 점·빠진 라벨은 지시선부터(사용자 지시 2026-11-01).** 점이 다른 점과 붙어 헷갈리거나(극점과 접점), 값·이름(f(a), 극대, (2,k))을 붙일 자리가 없으면, 점을 지우거나 캡션으로 미루거나 엔진 대기로 넘기기 전에 **그 점에서 지시선을 빼 라벨을 단다**(그래프: overlays.points label·leader, pathLabels; 평면: E37 callouts). 이유: 웬만한 경우는 지시선으로 해결된다(사용자). 지시선으로도 안 될 때만 UNSUPPORTED와 오류 코드를 적는다.
