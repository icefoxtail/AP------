# 마지막 5종 — 공식 SVG 엔진 구현·검수·출고 인계

## 대상 브랜치와 입력

- Git 브랜치: `work/solution-upgrade-h1-similar-1mid-20261122`.
- 기준 JS HEAD: `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`, 총 116문항(강남여고2 24, 팔마고1·2 각23, 효천고1·2 각23).
- 6개 엔진용 **문제 그림 P** 초안: `H1_1FINAL_20261122_LAST5_PLAN_JSON_DRAFTS/manifest.json`. 각 패킷에는 `item.json` (`sourcePath`, `ordinal`), `plan.json` (공식 capability 모양 초안), `publish.json` (alt/caption/size) 있음.
- **53개 해설 그림 S는 내용 교정 전 차단 상태**. 116개 해설 문장이 전부 문제별 풀이를 포함하지 않은 `[JS 기준 풀이]` 임시 문구. 116개 `level` 비정수, 명시 출처/문항 대응 키도 없음.
- 기존 연결 3개 SVG 현물 육안 대조와 기출 문제 이미지 5종/역할6건 완료. 새 엔진 렌더는 **NOT_RUN**.

## 공식 엔진 정본과 명령

1. `AGENTS.md`, `docs/agents/visual-svg.md`, `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md` 및 동일 capability의 `archive/tools/geometry-equation/ops/golden/*/plan.json`을 먼저 읽는다.
2. 모든 패킷을 복사한 작업폴더에서 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json...>`로 정적 검사한다. 불통과 건은 원본 수학과 스키마에 맞게 초안만 수정.
3. 정식 런타임을 `bash archive/tools/geometry-equation/ops/claude-batch/restore.sh` 등 공식 인계 문서 방식으로 준비한 뒤, 문항마다 `node .tmp/work/render.mjs --item item.json --plan plan.json --out <dir>`을 실행해 ARCHIVE_BOUND를 확인한다.
4. `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`으로 PNG를 만들어 **실제 눈검수**. source math/정답/좌표·분수·그래프 방향/라벨/크기/폰 화면/A4에서 확인. fail이면 SVG 손수정 없이 plan 수정 후 렌더 반복.
5. 렌더·독립 수학·시각 QA가 실제 통과한 결과만 공식 게시 흐름으로 연결. 장부·문항별 상태·증빙을 후속 커밋에 남긴다.

## 콘텐츠 선행 게이트 — 116문항

- [ ] 모든 `solution`의 일반 문구를 제거하고 문항별로 계산·정리·반례·조건 분기·서술을 완성한다.
- [ ] `H1_1FINAL_SIMILAR_LAST5_CONTENT_REPAIR_BLUEPRINT_20261122.md`의 116개 검산 초안과 실제 발문·정답·보기 일치 검사. 독립 R2/수학 감사 통과.
- [ ] 정수 난이도 1~5 등 메타 필드, provenance/sourceQid는 실제 근거로만 보강한다. 원문 계보를 추정해서 기록하지 않는다.
- [ ] 기출 대비 53개 S 역할의 도식 관계를 수정된 풀이에 맞추어 새 official plan 작성. 같은 역할 그림은 원본 plan의 형식을 바탕으로 숫자만 변경하되 수학·좌표를 1:1 재검증한다.

## 문제 그림 6개별 구현 우선순위

| ID | 학교·문항 | 초안 | 본격 렌더 전 해결할 조건 |
|---|---|---|---|
| NK-01 | 강남여2 q11 P | construction-spike | A-B 3·A-C 2·B-D 3·C-D 4·B-C x의 숫자 소유와 다중도로 의미 검증 |
| NK-02 | 강남여2 q18 P | multi-curve | f=x²−6x와 일반 직선의 구조. **예시 해답의 계수·좌표 노출 금지** |
| NK-03 | 강남여2 q20 P | multi-curve | 원점·교점·수직선 t의 구조. **최대 거리·최대 넓이 해답을 암시하지 말 것** |
| NK-04 | 효천1 q16 P | multi-curve | 원본 아래로 열린 f를 그대로 복사하지 않고 위로 열린 f/직선 g로 갱신 |
| NK-05 | 효천2 q7 P | construction-spike | 높이 h/직사각형 높이 a 미지수 라벨의 엔진 지원·실물 표현 확인 |
| NK-06 | 효천2 q16 P | multi-curve | 위로 열린 f와 직선 g, 계수 양수 및 교점 −4·0; 계수2·해답 노출 금지 |

## 차단 기준 및 다음 커밋

- 신규 P 플랜은 **형식 초안**이지 렌더가 가능한 확정본이 아니다. `ENGINE_SUPPORT_CHECK`에서 막히면 실패 코드와 원문 조건을 따라 수정하고, 지원 불가면 `UNSUPPORTED`를 기록한다. 손 SVG 제작 금지.
- 임시 해설에 근거해 S를 만들어도 내용 불일치를 유발하므로 **53건은 후속 콘텐츠 수정의 직접 의존 작업**. 전체 작업 종료를 '시각검수 완료'로 표기하지 않는다.
- 변경분만 별도 후속 커밋/PR로 올리고, 실제 렌더 결과와 링크/QA/게시를 개별 기록한다. 원본 기출 SVG나 소스는 무단 교체·삭제하지 않는다.
