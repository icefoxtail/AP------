# 고1 1학기 기말 유사 첫 5종 — SVG 엔진 실행 및 검수 인계

> 2026-11-22 KST. 자료 브랜치: `work/solution-upgrade-h1-similar-1mid-20261122` / 원시 HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`.

## 작업 목표

광양제철고 유사1·2, 금당고, 매산고, 복성고 2026 고1 1학기 기말 유사 102문항의 연결 그림 검수에 따른 **30개 SVG 엔진 plan 초안을 실제로 렌더/수정/검수/게시 가능 상태로 마무리**한다. 새 SVG를 손조립하지 않는다.

## 작업 계약과 순서

1. `docs/agents/visual-svg.md`, `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`, `ops/svg-m1/briefs/plan-current.md`, `production/AUTHOR_GUIDE.md`를 읽는다.
2. [manifest.json](./H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS/manifest.json)의 30개 `packetDir`마다 `item.json`과 원시 유사 JS qid의 발문·보기·정답·해설을 먼저 대조한다. 원본 이미지는 참고만 하고 변형한 수치로 다시 계산한다.
3. 먼저 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <packetDir>/plan.json`를 실행한다. 오류는 원인에 따라 정확한 `capability`·수치·레이아웃 필드만 고친다. 다른 회차나 엔진 코드를 고치지 않는다.
4. `node archive/tools/geometry-equation/production/render-plan.mjs --item <packetDir>/item.json --plan <packetDir>/plan.json --out .tmp/svg-m1/runs/JF-XX/out`로 **한 건씩** 렌더한다. 상태 `ARCHIVE_BOUND`와 출력 PNG/SVG를 확인한다.
5. 모든 새로운 `figure.png`를 실제 화면으로 보고 375px 모바일/A4 인쇄에서 축·눈금·한글/수식·영역/교차·라벨 가독성을 확인한다. 18개 기존 이미지와 필요한 원본 그림은 A/B 참고한다.
6. `publish.json.size`를 `figure-result.json.sizeClass`에 맞춘다. `publish.json.caption`과 SVG `<title>`/`<desc>`가 실제 보이는 수치와 일치하는지 검증한다. 해설 그림은 정답과 풀이 과정이 읽혀야 한다.
7. 독립 reviewer가 `ops/svg-m1/briefs/review1.md`에 따라 PASS하고, `pubflow.py` 공식 게시 절차를 실행한다. 기존 연결 그림 2곳 교체는 `replace:true`; EXEMPT 28역할은 그림 효용을 재판정해 채택된 건만 반영한다.
8. 최종 수정 JS/SVG/PlanRef와 검수 기록은 별도 PR로 review/main 승인 절차를 따른다. 이 문서 브랜치는 초안 전용으로 소스 파일을 건드리지 않는다.

## 특히 확인해야 할 실패 조건

- **매산 q13 S (JF-29)**: 절댓값 3조각 연결점 `(-4,6)`, `(2,6)`이 정확하고 y=10에서 x=−6,4와 만나는지 확인. 기존 `2a=8` 설명 대신 `a=5/2a=10`이어야 11정수를 정확히 보여준다.
- **복성 q22 S (JF-30)**: 수직선 두 행에서 `k=1`이면 x=−1,0,1,2,3 (합5), `k=7`이면 x=5만 (합5) 표시. 두 번째 행 x=4는 열린 경계(×)로 표현.
- **금당 q12 P (JF-13)**: 수량 주석을 가진 도로망의 각 연결 쌍이 실제 복수 도로 2·2·3·1·2를 의미하는지 학생이 이해할 수 있어야 한다. 설명 불가면 원본형 재구성 필요.
- **매산 q18 P/S (JF-20,21)**: 2×4 자리 배치가 3×3 원본 도식으로 되돌아가지 않아야 한다. E/O 칸 배치는 같은 짝수/홀수 인접 금지 논리와 맞는지 확인.
- **복성 q18 P (JF-26)**: 2D 단면 모식도는 3D 원기둥 위아래를 관통한 정사각형 구멍을 표현하는 완전한 대안이 아니다. 엔진 `solid-figure-v1`/`composite-panels-v1` 적합성을 판정하고, 불가하면 `UNSUPPORTED` 보고.
- **복성 q19 P (JF-27)**: 현재 초안은 인접 그래프이므로 실제 색칠 영역도와 동일하지 않다. 영역 A/B/C/D의 도형과 인접관계를 학생이 문제에서 읽게 하는 플랜으로 개선할 수 있는지 검증한다.
- **복성 q23 S (JF-28)**: 출발/도착 1,2별 방향 있는 전이 수가 굵기/화살표에 드러나는지 확인; 단순 선분 하나로 방향성을 설명할 수 없다면 재설계.
- **수직선·다항 그래프**: 근호 경계, 여러 열린 점(매산 q17), 도형 치수 라벨의 과밀/겹침을 엔진 관측기 오류에 따라 수리.

## 금지 및 완료 보고

- 손·스크립트 생성 SVG 금지, QA 미수행 PASS 금지, 기존 204개 EXEMPT 원본 플랜 덮어쓰기 금지, 수학적으로 틀린 설명을 그림만 고쳐 덮기 금지.
- 완료표는 매 항목 `LINT`, `ARCHIVE_BOUND`, `PNG_MATH`, `PNG_VISUAL`, `INDEPENDENT_QA`, `PUBLISHED`를 실제 결과로 적는다. 현재 전부 신규 엔진 `NOT_RUN`이다.
- 그림 렌더 불가 시 해당 slot의 정확한 오류코드와 도구 지원 공백, 선택지(EXEMPT/UNSUPPORTED/ENGINE_GAP)를 명시한다.
