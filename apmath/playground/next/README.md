# AP Math 실험실 2.0 — 무대 중심 디자인 + 공용 셸 (미리보기)

기존 실험실(`../labs/`)과 이전 허브(`../teacher-hub.html`)는 **그대로 쓸 수 있게 두고**(비교 중 발견된 오류는 기존 파일에서도 고쳤습니다), 같은 저장소 안에서 새 구조를 나란히 띄워 비교할 수 있게 만든 미리보기입니다. 처음 화면 AP Math Universe(`../index.html`)의 「실험실 입장」은 이제 이 새 허브(`next/index.html`)로 들어옵니다.

**현재 상태:** `kit/apl-catalog.js`의 실험실 43개 전부에 2.0 페이지(`next/labs/*.html`)가 있고, 허브는 **2.0을 기본으로** 엽니다. 기존 화면은 카드의 ‘기존 버전’ 링크로 그대로 열 수 있습니다(기존 파일은 지우지 않았습니다).

| 화면 | 경로 |
|---|---|
| 새 허브 (목록 · 개념 노선도 · 검색 · 내 수업 목록). Universe → 「실험실 입장」의 도착점 | `next/index.html` |
| 기존 ↔ 2.0 나란히 비교 (PC·태블릿·모바일 크기, 대표 사례 4건) | `next/compare.html` |
| 2.0 실험실 43개 (카탈로그의 `next` 경로) | `next/labs/` |
| 예: 미적분Ⅰ 접선과 미분계수 (직접 이식) | `next/labs/calc1-tangent.html` |
| 예: 중3 삼각비 (호환층 이식, 38장면) | `next/labs/g9-trig-ratio.html` |
| 예: 기하 공간도형 3D (3D 호환 이식, 4장면) | `next/labs/geom-space-3d.html` |

GitHub Pages 배포 후 주소: `https://icefoxtail.github.io/AP------/apmath/playground/next/`

---

## 1. 설계 원칙 (왜 이렇게 바꿨나)

1. **그림이 주인공** — 무대(그래프·도형)가 화면의 약 70%. 안내·수식·도구는 가장자리에 작게 두고, 그 자리는 도형 배치에서 비워 둡니다(`board.setInsets`). 자동 맞춤은 점뿐 아니라 **라벨 글자 상자까지 재서**(`board.measure` → `board.fitBox`) 휴대폰에서도 라벨이 잘리지 않고, 가장자리에 닿은 점 라벨은 반대쪽으로 넘어갑니다.
2. **질문 → 조작 → 관찰 → 정리 → 적용** — 모든 실험실이 같은 3개 탭(탐구 · 정리 · 문제)을 씁니다. 풀이 단계를 누를 때마다 그림에 보조선이 드러나고, 정답은 단계를 다 본 뒤 열립니다(기존 ‘단계 공개’ 유지).
3. **색과 모양의 약속** — *후광이 있는 점*은 끌 수 있습니다. *같은 대상은 같은 색*입니다(슬라이더 손잡이·실시간 값·그림의 선). 실시간 값에 마우스를 올리면 그림의 해당 부분이 강조됩니다.
4. **수학적으로 정확한 그림** — 무대는 **기본이 가로·세로 1:1 축척**입니다(기존 접선 실험실 등은 y축 0.82배라 수직이 수직으로 보이지 않았고, 기존 파일도 1:1로 고쳤습니다). 위치-시간·속도-시간처럼 가로(시간)와 세로의 단위가 다른 그래프만 `aspect:'free'`를 직접 골라 쓰고, 그때는 화면에 축척 안내가 붙습니다(§3.1).
5. **수업 모드** — `T` 한 번으로 큰 글씨·굵은 선·발표 막대. 리모컨(←/→, PageUp/Down)으로 단계·장면 이동, `D` 판서(그래프에 붙어서 확대·이동해도 함께 움직임), QR로 “지금 이 장면 그대로” 학생 휴대폰에 공유.
6. **PC·모바일 하나의 셸** — 데스크톱은 무대+패널 2단, 모바일은 무대를 위에 고정하고 패널이 그 아래로 스크롤. 모바일에서는 상태 배지와 도구가 무대 아래 한 줄로 모이고(터치 화면은 확대 버튼 대신 손가락 확대), 손잡이 터치 반경 30px.
7. **확장은 데이터로** — 실험실 추가 = `kit/apl-catalog.js`에 한 항목 + 실험실 파일 하나. 개수·필터·검색·노선도는 자동.

## 2. 구조

```
next/
  index.html            허브 (apl-catalog.js를 읽어 자동 생성)
  compare.html          기존 ↔ 2.0 비교
  kit/
    apl.css             디자인 토큰(칠판/종이 테마, 수학 의미색) + 모든 셸 컴포넌트
    apl-core.js         네임스페이스·아이콘·KaTeX 렌더($…$ 자동 변환)·저장소·테마·대화상자
    apl-board.js        무대 엔진: 좌표계(cartesian/figure)·1:1 기본 축척(선택: aspect:'free')·격자·축·곡선·도형·라벨·핸들·핀치·자동 맞춤
    apl-shell.js        실험실 셸: 장면/묶음, 탐구·정리·문제 패널, 단계 플레이어, 수업 모드, 판서, 공유, 단축키, URL 상태
    apl-compat.js       기존 ‘마스터 실험실’ 계열 그리기 함수(pline·ppoly·pdot…) 호환층
    apl-space.js        3D 무대 도우미: 카메라(yaw·pitch) 투영, 공간각 호·직각 표시·바닥 격자, 라벨까지 맞추는 fitDrawing
    apl-hub.css/js      허브 전용
    apl-catalog.js      전체 실험실 목록(단일 출처): 과정·단원·노선·장면·기존/2.0 경로
                        (이름을 catalog.js로 하면 저장소 루트 .gitignore 규칙에 걸려 커밋에서 빠집니다 — 검사가 막아 줌)
    vendor/katex/       KaTeX 0.16.9 (woff2만, 오프라인 동작)
    vendor/qrcode.js    QR 생성기 (MIT, Kazuhiko Arase)
  labs/                 2.0 셸 위의 실험실 (카탈로그 43개 전부)
  tools/
    catalog.test.mjs    카탈로그·키트·manifest·HTML 로컬 참조(404) 정합성 검사 (node --test, 브라우저 불필요)
    gen-manifest.mjs    카탈로그에서 ../manifest.json 생성 (실험실을 더하거나 고친 뒤 실행)
    scene-smoke.mjs     모든 장면 자동 렌더 검사 (Playwright) — 자세한 항목은 §5
```

빌드 도구 없이 `<script defer>` 만 씁니다. 외부 의존은 Pretendard 글꼴(CDN, 실패 시 시스템 글꼴) 하나뿐입니다.

## 3. 새 실험실 만들기 (최소 예)

```html
<link rel="stylesheet" href="../kit/vendor/katex/katex.min.css">
<link rel="stylesheet" href="../kit/apl.css">
<script defer src="../kit/vendor/katex/katex.min.js"></script>
<script defer src="../kit/vendor/qrcode.js"></script>
<script defer src="../kit/apl-core.js"></script>
<script defer src="../kit/apl-board.js"></script>
<script defer src="../kit/apl-shell.js"></script>
<script>
window.addEventListener('DOMContentLoaded', () => APLab.createLab({
  id: 'demo-parabola', title: '포물선과 접선', courseName: '공통수학', unit: '이차함수',
  board: { kind: 'cartesian', focus: { x: [-4, 4], y: [-1, 8] } },
  params: { a: { value: 1, min: -3, max: 3, step: 0.05, color: 'amber', label: '접점 x = a' } },
  scenes: [{
    id: 'tangent', title: '접선 긋기',
    question: '접점이 움직이면 접선의 기울기는 어떻게 바뀔까?',
    guide: '금색 점을 끌어 보세요.',
    controls: ['a'],
    steps: ['접점을 정합니다.', '접선을 긋습니다.'],
    view: (s) => ({ readouts: [{ label: '기울기 2a', value: APLab.fmt(2 * s.a), color: 'rose', ref: 'tan' }] }),
    draw: (b, s) => {
      b.grid(); b.axes();
      b.plot((x) => x * x, { color: 'ink', glow: true });
      if (s.step >= 2) b.line([s.a, s.a * s.a], 2 * s.a, { color: 'rose', dash: true, ref: 'tan' });
      b.handle('A', [s.a, s.a * s.a], { color: 'amber', label: 'A', drag: (w) => { s.a = APLab.clamp(w.x, -3, 3); } });
    }
  }]
}));
</script>
```

- 색 이름: `ink · sky · rose · amber · green · violet · red · orange · muted` (테마에 따라 자동으로 바뀜)
- 장면 데이터: `question · guide · controls · presets · actions · steps · problem{tag,time,text,answer,snap} · solution{standard,quick} · view(s) · draw(b,s,v)`
- 변하는 내용은 `view(s)`가 돌려줍니다: `chips · status · alert · readouts · parts · summary · rule · formula · notes · card · tape`
- 끝으로 `kit/apl-catalog.js`의 해당 항목에 `"next": "next/labs/파일.html"`을 적으면 허브에 2.0 배지와 장면 바로가기가 생깁니다.

### 3.1 무대 축척: 기본 1:1, 필요할 때만 `aspect:'free'`

- 아무것도 적지 않으면 1:1입니다. 직각·45°·길이가 그림에서도 그대로 보이므로 도형·함수 실험실은 이 기본을 씁니다.
- 가로가 시간이고 세로가 위치·속도인 그래프처럼 **두 축의 단위가 다른 경우만** 보드(또는 장면)에 `aspect: 'free'`를 줍니다. 가로 배율은 `focus.x`, 세로 배율은 창(pane)마다 `focusY`(없으면 `focus.y`)로 따로 정해 창을 가득 채웁니다.
- free에서는 격자·눈금 간격도 가로 `step`/`tickStep`, 세로 `stepY`/`tickStepY`로 따로 줍니다. 자동 맞춤(`measure`/`fitBox`)과 원·호는 지원하지 않습니다(원·호 반지름은 가로 배율).
- 장면 정의에서 `aspect:'free'`를 줄 수 있고, 이때 `aspectNote`에 쓴 문장이 셸의 축척 안내가 됩니다(생략하면 기본 문장: 단위가 달라 축척을 따로 두므로 기울기의 각도는 실제와 다르게 보인다는 안내). 쓰는 실험실: `calc1-motion`, `calc1-derivative-shape`.
- 눈금 숫자는 간격이 요구하는 만큼만 소수 자리를 써서 **분수 간격(0.25, 2.5 등)에서도 정확한 값**을 보여 줍니다(`fmtTick`이 간격에서 자릿수를 계산).

## 4. 기존 실험실 옮기기 (계열별 경로) — 43개 전부 이식됨

원본의 해설·문제 문자열과 수학 함수는 그대로 두고 그리는 층만 새 무대로 잇는 것이 원칙입니다. 계열(원본 구조)에 따라 연결 방식이 다릅니다.

| 계열 | 수 | 원본 구조 | 이식 방식 (대표 예) |
|---|---|---|---|
| 마스터 실험실 (중등 도형 등) | 16 | `getSpec()` + `SUB_MENUS` + `pline/ppoly/pdot…` | **5개는 `apl-compat.js`의 `p*` 도우미, 나머지는 실험실 내부 어댑터**: getSpec·renderModeN을 글자 그대로 복사하고 그리기를 새 무대에 연결. `g9-trig-ratio`(호환층)가 예시(수정은 5곳: 빠진 함수 정의 2, 변수 이름 1, 호 그리기 2). |
| 킬러 랩 2D (미적분·이차곡선·벡터) | 14 | `examData` + `drawChalkLine/drawChalkPoint` | **데이터 이식 + 그리기 이식**: examData는 그대로, 그리기는 `b.plot/b.line/b.handle`로 옮기며 1:1 축척 적용. `calc1-tangent`가 예시. 원본이 캔버스 `ctx`를 직접 쓰는 경우(raw-ctx, 예: `geom-vector-dot`)는 실험실 안에 **작은 캔버스 퍼사드**(보드의 `ctx`를 감싸 색을 테마 의미색으로 바꿔 주는 래퍼)를 두어 원본 그리기 코드를 `APLab.Board` 위에서 그대로 돌립니다. |
| 킬러 랩 3D (공간도형·정사영·공간좌표) | 3 | `examData` + `rotatePoint` + `draw3D…` | **`apl-space.js`**: `draw3DLine/Point/Polygon…` 이름만 연결하고 투영·시점 버튼·자동 회전을 공용 도우미가 맡음. `geom-space-3d`가 예시. 중1 입체도형(`g7-solids`·`g7-surface-volume`·`g7-spatial`)은 같은 `rotatePoint` 구조라 **실험실 안에 둔 투영 코드**를 쓰되, 빈 곳 끌기 회전은 보드 정의의 `orbit(s, dx, dy)` 훅에 연결합니다(공용 3D 실험실도 같은 훅 사용). |
| 개별 설계 (원과 부채꼴, 단위원, 대수 Part 등) | 10 | 실험실마다 다름 | 위 세 방식 중 가까운 것으로 옮김. 예외 하나: `g7-circle-sector`는 원본 엔진(SVG 그리기)을 **화면 밖에서 그대로 돌려** 나온 SVG를 2.0 무대에 칠합니다. |

이식할 때 지키는 것: 해설·문제 문자열과 수학 함수는 바꾸지 않습니다(검수 이력 보존). 화면 표시만 정리합니다(이모지·`[오답 1위]` 꼬리표는 셸이 배지로 바꿔 보여 줌).

**원본의 그림·글이 어긋난 곳:** 옮기다 원본에서 그림과 글이 어긋난 곳(라벨 위치, 수치 오기 등)을 찾으면 2.0에서 고치고, 그 자리에 `[2.0 수정]` 주석으로 무엇을 왜 바꿨는지 남깁니다(`grep -rn "2.0 수정" next/labs`로 모아 볼 수 있음). 원본 파일은 건드리지 않습니다.

## 5. 검사

```bash
node --test apmath/playground/next/tools/catalog.test.mjs     # 카탈로그·경로·키트 문법·.gitignore 누락·manifest·HTML 로컬 참조 (CI 등록됨)
node apmath/playground/next/tools/gen-manifest.mjs              # 카탈로그를 바꿨다면 manifest.json 다시 만들기
python3 -m http.server 8765 &                                   # 저장소 루트에서
node apmath/playground/next/tools/scene-smoke.mjs               # 모든 장면 × (PC 칠판·PC 종이·휴대폰) 렌더 검사
```

### 5.1 scene-smoke가 보는 것

`labs/*.html`의 모든 실험실을 열어 **모든 장면 × (PC 칠판 · PC 종이 · 휴대폰 390px)** 에서 다음을 봅니다. 하나라도 걸리면 FAIL(종료 코드 1)입니다.

1. 실행 오류(`pageerror`·콘솔 error)
2. 빈 무대(그려진 점이 거의 없음)
3. 안내(guide) 문구 없음
4. 무대 밖으로 잘린 라벨(가장자리 뒤집기·밀어 넣기가 끝난 최종 위치 기준)
5. 조작부 누락 — 막대·칩·버튼 개수가 장면 정의와 다름(같은 조작부 장면이 이어질 때 조작부가 사라지던 오류). 조작부 캐시 키는 **조작부 상자 자체**에 붙어 있어서, 상자가 새로 만들어지는 어떤 경로든 조작부를 다시 짓습니다.

라벨 뒤집기를 끄면 공통접선 장면이 실패하는 것으로 검사 자체도 확인했습니다. 장면 수는 늘 바뀌므로 숫자 대신 이 검사가 PASS인지를 기준으로 삼습니다.

### 5.2 새 실험실 / 수정 시 체크리스트

새 실험실을 더하거나 기존 2.0 실험실·키트를 고친 뒤에는 이 순서로 확인합니다.

1. **`kit/apl-catalog.js`** — 항목 추가·수정(`next` 경로 포함). 파일 이름은 `catalog.js`가 아니라 `apl-catalog.js`(`.gitignore` 규칙 회피).
2. **`node apmath/playground/next/tools/gen-manifest.mjs`** — 카탈로그를 바꿨다면 `../manifest.json`을 다시 만든 뒤 함께 커밋.
3. **`node --test apmath/playground/next/tools/catalog.test.mjs`** — 카탈로그·경로·키트 문법·manifest·HTML 로컬 참조(404) 정합성. CI에도 등록되어 있음.
4. **`node apmath/playground/next/tools/scene-smoke.mjs`** — 정적 서버를 띄운 뒤 모든 장면을 3개 환경에서 검사. 새 실험실뿐 아니라 키트(`apl-board.js`·`apl-shell.js`·`apl.css`)를 고쳤을 때도 전체를 한 번 돌립니다.
5. 실제 화면 확인 — PC와 휴대폰 폭에서 그림이 가려지지 않고, 버튼이 동작하는지 한 번 열어 봅니다. 원본과 그림·글이 어긋난 곳은 `[2.0 수정]` 주석으로 남깁니다.

### 5.3 기존 실험실 검사에서 찾은 문제

같은 방식으로 기존 실험실 45개를 순회해 찾은 문제는 모두 기존 파일에서 **고쳤습니다**.

- 실행 오류 장면 5개(삼각비 4: 탭 8의 기본 장면 포함, 피타고라스 1) — 모두 복구, 삼각비 38장면은 오류 0건.
- 삼각비·피타고라스의 ‘관찰 렌즈’ 버튼이 그림에 영향을 주지 않던 문제, 삼각비 안내문의 `$…$` 수식 원문 노출.
- 기하 실험실 5개가 공용 스크립트(`board-relations.js`·`geometry-relations.js`·`student-guide.js`)를 잘못된 경로로 불러 나던 404 15건 — 공간도형 3D에만 관계 탐구 모듈(`geometry-relations.js`)을 올바른 경로로 켜고, 나머지는 쓰이지 않는 모듈 참조를 지웠습니다. 이후 `catalog.test.mjs`가 모든 HTML의 로컬 `<script src>`·`<link href>`가 실제 파일을 가리키는지 검사해 같은 일이 되풀이되지 않게 합니다.
- 이전 허브(`teacher-hub.html`): 휴대폰에서 가로로 넘치던 문제(390px 화면에서 459px), 손으로 적은 개수(이제 카드에서 자동으로 셈), 낡은 `manifest.json`(이제 카탈로그에서 생성).

지금 남은 기존 화면과의 차이는 오류가 아니라 **설계 차이**입니다 — 휴대폰에서 그림을 가리는 떠 있는 안내 상자, 작은 글씨, 외부 CDN 의존, 일부 실험실의 확대 금지(`user-scalable=no`) 등. 비교 화면(`compare.html`)의 설명은 이 차이를 다룹니다.

## 6. 키보드

`←/→` 단계(끝나면 다음 장면) · `[ ]` 장면 · `1–9` 장면 바로가기 · `T` 수업 모드 · `D` 판서(`E` 지우개, `X` 모두 지우기) · `H` 패널 접기 · `F` 전체 화면 · `G` 격자 · `0` 화면 맞춤 · `S` 문제 조건으로 맞추기 · `A` 정답 공개 · `Space` 애니메이션 · `?` 도움말. 무대를 누른 뒤 `N`으로 점 고르기, 화살표로 점 움직이기.
