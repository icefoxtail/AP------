# 유형은행 기하·미적분II 문제 그림 — SVG 엔진 실행 플랜 정본 (2026-11-25)

> 각 GPT 채팅창의 같은 기준. 최신 사용자 지시와 `AGENTS.md`, `docs/agents/visual-svg.md`, 공식 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` 및 plan 계약 전문이 우선한다.

## 결과·범위·담당

- 원본: `archive/exams/types/high/h2/`의 고2 유형은행. 기하 205종 **전체를 먼저** 작업하고 이후 미적분II 285종으로 넘어간다. 타 과목·중등·기출·유사 폴백 금지.
- GPT 플랜 라인: JS 원문 직접 확인 → 문항별 정확한 수학 그림 설계 → **실제 엔진 실행 가능한 plan JSON** → 검사·검수 → 유형군별 PR 및 `main` 운영병합.
- 안티그래비티: 병합된 plan을 공식 엔진으로 SVG/PNG 렌더, 실물·학생 화면·A4 시각검수, 필요 시 엔진 확장과 재렌더, 최종 JS 연결·게시.
- GPT 라인은 새 SVG·PNG를 손으로 만들거나 가짜 `image`/`solutionImage`를 JS에 쓰지 않는다. 원본 JS·이미 반영된 자산을 불필요하게 수정하지 않는다. 문제/해설 시각자료는 두 축이므로 그림 목록이 `kind:problem`뿐이라고 해설 완료·면제를 보고하지 않는다.

## 공통 유형군 큐

1. **실제 수학 발문 기준으로 유형군을 나누고 같은 유형군을 순차적으로 끝낸다.** 추천 큐: 포물선 방정식·정의 → 포물선 접선 → 타원 → 쌍곡선 → 평면벡터 → 공간도형·정사영 → 공간좌표·구. 같은 유형 안에서는 JS 번호 오름차순 → 그림 qid 오름차순.
2. 다른 GPT 창은 `담당 유형군 / 숫자 범위 / 작업 브랜치`를 서로 겹치지 않게 예약한다. 작업 시작 때 최신 `main`의 기존 plan·열린 PR을 확인하고 동일 JS 문항의 동시 수정·중복 작성을 금지한다.
3. **파일명·폴더·PT/TPL만으로 분류 금지.** 예: `기하_015_타원의방정식`의 실제 그림 요청에는 포물선이 등장한다. 본문 조건으로 포물선군에 편성하고 파일명/메타 불일치는 별도 기록한다.
4. 제공 `figures-todo-all.json`은 후보 장부다. 2026-11-25 첨부본은 `items` 606건/서로 다른 stem 145개(모두 `kind:problem`)로, 설명에 적힌 544건과 62건 차이가 있다. 생성 시각은 2026-11-24 UTC. 반드시 최신 JS의 실제 `[그림: ...]` 자리표시와 qid를 재대조해 분모를 확정한다. 목록에 없다는 이유로 EXEMPT 처리하지 않는다.

## 각 문항 필수 절차

1. 정확한 JS 파일 경로·원본 SHA·id/qid·발문·보기·정답·해설·`[그림: ...]`를 직접 읽는다. 수학적으로 모순되는 설명이나 유형명 불일치는 추정 수정하지 않고 발견사항으로 구분한다.
2. 발문이 **이미 제공한** 점·좌표·거리·비·각·축·곡선·공간 위치를 독립 계산하여 그림에 정확히 매핑한다. 문제 그림에는 미지 답·최종 풀이 좌표·값을 노출하지 않는다.
3. 공식 AUTHOR_GUIDE의 해당 capability **계약 전문과 통과 골든 예제**를 보고 `plan.json`을 쓴다. 정본의 계산 노드를 우선 활용한다. 원문이 위치·비례만 주면 동형 대표 좌표계임을 `sourceConditions`에 명시하며, 임의로 정답이나 존재하지 않는 조건을 만들지 않는다.
4. `caption`·`accessibilityDescription`·`sourceConditions`(조건별 `mappedTo`)·`newVisualInformation`을 실제 문항마다 작성한다. 면 채움은 문제의 영역 구분·넓이에 필요한 경우만 허용한다.
5. 기존 운영 저장 규칙 `archive/tools/geometry-equation/production/plans/<정확한 stem>/qNN-problem.plan.json`을 따른다. 렌더 담당자를 위한 대상 JS/qid 매핑·필요한 item/publish JSON은 공식 계약에 맞춰 관리한다.
6. `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan...>`를 실행한다. shallow와 full을 구분해 결과를 남긴다. 폰트·실행 의존성 부족은 `ENV_BLOCKED / FULL_NOT_RUN`이고 통과로 간주하지 않는다. 그림 없이 검수한 상태는 `SVG_TO_CREATE / NOT_RUN`이다.
7. 한 유형군 배치의 모든 계획을 발문·수학·정답 노출·중복·누락 기준으로 검수하고 PR을 만든다. 사용자 승인 범위 안에서 `main` 운영병합 후 원격 SHA/파일 실재를 재확인한다. 접근 권한·보호 규칙 차단은 우회하지 않는다.

### 품질 우선 — 문항별 시각 조건 일치 게이트 (2026-11-25)

**소요 시간이나 plan-lint PASS 건수보다 학생에게 실제로 보일 정보의 정확성이 우선**이다. 각 qid는 별도 창/담당자도 동일하게 아래 항목을 발문·`[그림: …]`과 대조한다.

1. `곡선 식·방향·꼭짓점·초점·준선 → 점의 사분면/순서/중복 → 이어진 선분·수선·평행·등분·음영 → 길이·좌표·각도·비의 시각 표시 → 미지 답 비노출`을 **한 항목씩** 확인한다. 임의 대표 좌표는 방정식과 모든 주어진 관계를 독립적으로 만족해야 한다. 그림에 있는 점 이름끼리 겹치거나 원래 이름이 빠지면 수정한다.
2. 특히 원문이 **그림에 표시하라고 한** `120°`, `9`, `6cm`, `1m`, `3m`, 직각 표식 등은 `caption`·`sourceConditions`에 적었다는 이유만으로 `DRAWN_FEATURE_PARITY=PASS`로 세지 않는다. 실제 `points.coordinates`, `segments.label`, `FOOT.rightAngle`, `polygons`, 지원되는 각 호·라벨 등에 해당하는 *그려지는 필드*가 있어야 한다. 발문에만 주어진 수치나 대표 도식의 생략점은 교육적 명확성을 판단해 처리하고, 생략 범위를 명시한다.
3. 현재 capability에 각도 호·변 같음 표식·짧은 길이 라벨을 넣을 수 없거나 full 검사에서 `*_LABEL_NO_ROOM`으로 거절하면, **기본 도형이 lint PASS여도** 문항별 `ENGINE_CAPABILITY_PENDING`을 남긴다. 필요한 엔진 기능·정확한 qid·실패 코드와 원하는 화면 효과를 안티그래비티에 인계한다. 표식 없이 캡션만 적은 것을 완성으로 보고하지 않는다. 임의 SVG 생성이나 이름 바꾸기로 실패를 감추지 않는다.
4. 검수 기록은 각 qid마다 `sourceVsPlan: REVIEWED|EVIDENCE_DEBT`, `featureParity: PASS|ENGINE_CAPABILITY_PENDING`, `planLintShallow/Full: PASS|FAIL|NOT_RUN`, `render/PNG/학생화면/A4: NOT_RUN`을 구분한다. **49개 중 49개 lint PASS**는 **49개 중 49개 시각정보 완성**과 다른 지표다. `ENGINE_CAPABILITY_PENDING`은 렌더 전 엔진 보강/재검수를 요구하는 실제 미완료다.
5. 같은 유형군 후속 창은 앞서 병합된 plan을 품질 완료의 증거로 삼지 않고, 원문-필드 대조·엔진 미지원 장부를 읽고 같은 누락을 반복하지 않는다. 미리 그린 SVG가 없으므로 GPT가 화면 검사 `PASS`를 주장할 수 없다.

## 완료 보고 계약

- `유형군 / 대상 번호·JS 종수 / 대상 qid 수 / plan 작성 수 / shallow/full 통과 수 / DRAWN_FEATURE_PARITY 통과 수 / ENV_BLOCKED·엔진 미지원 수와 qid / PR·병합 SHA / 잔여 범위`를 보고한다.
- 문서·EXEMPT·UNSUPPORTED 상태만 쓴 파일을 **실제 제작 가능 plan**으로 세지 않는다. 문제 SVG 미렌더는 정상 시각검수 완료가 아니며 최종 게시와 분리한다.

## 별도 GPT 창 시작 프롬프트

> GitHub `icefoxtail/AP------`의 `docs/agents/typebank-figure-plan-execution.md`, `docs/agents/visual-svg.md`, 공식 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`를 실제로 읽고 따라라. 담당 유형군은 `[유형군]`, 파일 번호 범위는 `[범위]`, 브랜치는 `[브랜치]`이다. 다른 유형군으로 넘어가지 말고 최신 main에서 중복 PR을 확인하라. 담당 유형의 JS를 번호순으로 열어 각 qid의 발문·해설·정답·그림 설명을 읽고 공식 엔진용 실사용 plan JSON을 정확히 작성하라. shallow/full 검사를 돌린 **뒤에도** 문항별로 모든 필수 점·선·치수·각·방향이 렌더 필드에 실제 존재하는지 대조하고 `DRAWN_FEATURE_PARITY`를 별도 판정하라. 캡션만으로 메꾼 엔진 미지원은 `ENGINE_CAPABILITY_PENDING`으로 qid별 인계하고 완료 건수에서 빼라. 문제 그림에 정답을 노출하지 말아라. PR을 main 운영병합하고 원격 결과를 증명해라. SVG 렌더·게시·시각검수는 안티그래비티 후속으로 남겨라.
