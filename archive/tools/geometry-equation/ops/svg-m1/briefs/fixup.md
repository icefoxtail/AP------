# 해설 그림 plan 보정 (엔진 확장·팁 반영 후 재렌더)

이미 ARCHIVE_BOUND된(또는 GAP으로 일부만 그린) 문항 plan을 최신 엔진·팁으로 보정해 다시 그린다. 엔진 코드는 고치지 않는다.

## 입력
- 팁(먼저 전부 읽는다): `/home/user/AP------/.tmp/svg-m1/guide/guide-tips.md` — 이름 없는 점(E1), 전개도 강조(E2), 입체 세기 번호(E3), 길이 단위 `scalarLabels` 등.
- 필요할 때만: `/home/user/AP------/.tmp/svg-m1/guide/guide-plane.md`·`guide-solid.md`의 해당 절, 계약은 grep으로.
- 문항 묶음 `{PACKET}`(questionImage PNG로 원문 확인), 대상 `{ITEMS}`(폴더와 고칠 점).

## 문항마다
1. `plan.json`을 `plan.before-fix.json`으로 복사하고, 출력도 `out.before-fix/`로 복사해 둔다.
2. 고칠 점만 최소로 고친다: 원문에 없는 점 이름은 숨김(`hiddenPointNames`, 원문처럼 점 표식이 없으면 `hiddenPointStyle:"NONE"`), 길이 단위는 `scalarLabels` 등 팁의 방법, 그 밖에 notes의 GAP 중 팁의 기존 기능으로 해결되는 것. 해결 안 되는 GAP은 그대로 두고 기록한다.
3. 저장소 루트에서 렌더(하나씩): `cd /home/user/AP------ && timeout 900 node archive/tools/geometry-equation/production/render-plan.mjs --item <dir>/item.json --plan <dir>/plan.json --out <dir>/out > <dir>/render.log 2>&1; tail -c 400 <dir>/render.log`. 문항당 최대 4번(부하성 ARCHIVE_PREFLIGHT_FAIL/readiness/WORKER_TIMEOUT/POLICY_PROVENANCE_MISMATCH는 한 번 재시도, 횟수 제외).
4. ARCHIVE_BOUND면 `node /home/user/AP------/.tmp/svg-m1/svg2png.cjs <dir>/out/figure-solution.svg <dir>/figure.png 520`로 보고 원문·풀이와 대조. publish.json의 alt·caption에 없어진 이름이 있으면 고친다.
5. 4번 안에 실패하면 `plan.before-fix.json`·`out.before-fix/`를 되돌리고(이전 SVG가 그대로 있어야 함) 이유를 적는다.

## 출력
`{OUT}` = `[{"dir":"...","ord":N,"status":"FIXED|UNCHANGED|REVERTED","renders":n,"remainingGap":"남은 GAP 한 줄 또는 빈 문자열"}]`

## 금지
대상 폴더와 `{OUT}` 밖에 쓰지 않는다. git·테스트·엔진 수정·다른 에이전트 호출 금지. 최종 답장 8줄 이내.
- **관계는 색으로 묶는다(사용자 지시 2026-11-01, 적극 권장).** 같은 크기의 각, 같은 길이의 선분, 평행선, 닮음·합동의 대응변, 넓이가 같은 영역, 합동인 도형은 C1 색 묶음으로 같은 색을 준다: 영역 `fill`(BLUE·WARM·GREEN·ROSE·VIOLET)과 `equalAreas`, 각 `equalAngles[].color`·`angles[].color`, 선분 `segmentColors`·`equalLengths[].color`·`parallels[].color`(가이드 3-9-색 절). 묶음은 핵심 2~3개, 주로 BLUE·WARM. 기준은 화면(폰·패드·모니터)에서 또렷하게 보이는 것이다(학생은 폰에서 확대해 본다; 인쇄는 부차). 이유: 해설 그림의 핵심은 "어느 것과 어느 것이 같은가"이고, 색으로 묶으면 한눈에 보인다(26 신흥중 q8 나비 날개).
- **라벨·치수선 배치가 실패하거나 오독될 때는 그 선분·각을 끌어내 따로 크게 보이는 방법을 먼저 쓴다(적극 권장).** LAYOUT_INVENTORY_INCOMPLETE, DIMENSION_CROSSES_STROKE, 좁은 꼭짓점(20° 안팎)·짧은 선분·몰린 각 때문에 라벨이 다른 조각에 붙어 읽히는 경우: 합성 2패널로 왼쪽은 원래 도형(관계 표식만), 오른쪽은 문제의 선분(예: C–G–D)이나 각만 같은 점 이름으로 펴서 크게 다시 그리고 거기에 치수선 단(offset AUTO)·각 라벨을 둔다. 예: /home/user/AP------/.tmp/svg-m1/examples/q6-segment-pullout-plan.json. 엔진에 planeMarks.callouts(E37)가 들어오면 그 필드를 쓴다. 라벨을 지우거나 캡션으로 빼는 것보다 이것이 먼저다.
