# 작업 14 덧붙임 2 — 사양을 올리기 전에 일괄 렌더로 한 번 거른다 (2026-11-17, 관제)

## 왜
사양을 받아 그대로 렌더해 본 결과(22_복성고 2학기 기말 고2 수학II, 사양 18개) 통과는 7개(39%)였다. 실패 11개는 세 유형뿐이고, 렌더 도구가 고칠 힌트를 같이 낸다. 사양을 올리기 전에 한 번만 일괄 렌더해 이 세 유형을 고치면 뒤 공정(수리·검수)이 크게 줄어든다.

| 코드 | 뜻 | 이번 측정 |
| --- | --- | --- |
| `PUBLICATION_TEXT_NOT_READY` | 라벨이 서로 또는 선과 겹침 | 7 |
| `LAYOUT_INVENTORY_INCOMPLETE` | 영역 라벨을 둘 자리가 없음 | 2 |
| `OVERLAY_CURVE_UNSUPPORTED` | 엔진이 지원하지 않는 overlay 필드를 씀 | 2 |

## 할 일
1. 시험지 하나의 사양을 다 쓰면, 올리기 전에 아래 "일괄 렌더"를 한 번 돌린다.
2. `FAILED`인 사양은 결과의 `code`와 `hint`를 읽고 사양을 고쳐 다시 돌린다. 사양당 두세 번 고쳐도 안 되면 붙잡지 말고 그대로 두고 넘어간다.
3. 사양 폴더마다 마지막 렌더 결과를 적는다: `render-status.json`에 `{"status":"ARCHIVE_BOUND"|"FAILED","code":"...","hint":"...","attempts":N}`. 지금까지 `render NOT_RUN`이라고 적던 자리를 이것으로 바꾼다. 일괄 렌더를 돌리지 못한 사양은 정직하게 `NOT_RUN`으로 둔다.
4. 렌더 산출물(SVG·PNG)은 올리지 않는다. 사양과 `render-status.json`만 올린다. 게시·검수·장부 갱신은 여전히 하지 않는다.
5. 통과(`ARCHIVE_BOUND`)는 "엔진이 그렸다"는 뜻일 뿐이다. 곡선이 너무 가팔라 읽기 어렵거나 라벨이 떠 보이는 것은 뒤 공정에서 눈으로 본다. 다만 사양을 쓸 때 같은 배율 우선·라벨은 가리키는 대상 가까이 원칙은 그대로 지킨다.

## 일괄 렌더 (저장소 루트에서)
1. 도구 펼치기(한 번):
   `mkdir -p .tmp/svg-m1 && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/ && bash archive/tools/geometry-equation/ops/claude-batch/restore.sh`
2. 엔진 의존성: `.tmp/apmath-visual-engine/dependencies/` 아래에 `node_modules`(playwright 포함), python 패키지 폴더 `python/`, 글꼴 `NotoSansKR.ttf`가 있어야 한다. 지난번 "렌더 못 함"은 이것이 없어서였을 가능성이 크다. 이미 갖춘 PC에서 폴더째 복사하거나, 다른 곳에 있으면 환경변수 `GEOMETRY_NODE_MODULES=<그 node_modules 경로>`로 지정한다. 렌더용 Chrome이 필요하고, Windows 기본 Chrome 경로가 있으면 자동으로 쓴다. `node .tmp/work/render.mjs`가 usage를 출력하면 준비된 것이다.
3. 입력: 시험지 하나마다 폴더 `<pk>/`, 그 안에 사양마다 `<pk>/<qN-solution[-k]>/plan.json`. 그리고 `<pk>.manifest.json`:
   `{"items":[{"dir":"q1-solution","sourcePath":"archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js","ordinal":1}, ...]}`
4. 실행: `node .tmp/work/render.mjs --manifest <pk> --out <out>`
   결과는 `<out>/run-summary.json`에 문항마다 `status`, `code`, `hint`로 나온다.

의존성을 갖출 수 없으면 무리해서 만들지 말고, 무엇이 없는지 한 줄 적어 보고한다. 그 경우 사양은 지금처럼 올리고 `render-status.json`은 `NOT_RUN`으로 둔다.

## 그 밖에 바뀐 사실
- 오늘 원문 오류 수정이 main에 들어가 일부 시험지의 본문·정답·해설이 바뀌었다(고등 #2371·#2373, 중등·교재 #2372·#2374). 사양을 쓰기 전에 **최신 main**의 시험지 JS를 다시 읽는다. 이미 쓴 사양 가운데 해당 문항이 있으면 값이 그대로 맞는지 확인하고, 달라졌으면 고친다.
- 해설 그림을 뗀 문항(정답 수정으로 옛 그림이 틀리게 된 것)이 있다: 19_신흥중 2학기 기말 중2 1번, 20_왕의중 2학기 기말 중2 11번, 21_연향중 2학기 중간 중3 8번, 22_팔마중 1학기 중간 중3 13번. 장부에서 OPEN_CONTENT로 내려가 있으니 대상 1(게시도 면제도 아닌 문항)에 들어간다. 사유 칸에 무엇이 어긋났는지 적혀 있다.
