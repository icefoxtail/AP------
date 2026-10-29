# AP Math 실험실 2.0 — 무대 중심 디자인 + 공용 셸 (미리보기)

기존 실험실(`../labs/`, `../teacher-hub.html`)은 **그대로 두고**, 같은 저장소 안에서 새 구조를 나란히 띄워 비교할 수 있게 만든 미리보기입니다.

| 화면 | 경로 |
|---|---|
| 새 허브 (목록 · 개념 노선도 · 검색 · 내 수업 목록) | `next/index.html` |
| 기존 ↔ 2.0 나란히 비교 (PC·태블릿·모바일 크기) | `next/compare.html` |
| 미적분Ⅰ 접선과 미분계수 (직접 이식) | `next/labs/calc1-tangent.html` |
| 중3 삼각비 (호환층 이식, 38장면) | `next/labs/g9-trig-ratio.html` |

GitHub Pages 배포 후 주소: `https://icefoxtail.github.io/AP------/apmath/playground/next/`

---

## 1. 설계 원칙 (왜 이렇게 바꿨나)

1. **그림이 주인공** — 무대(그래프·도형)가 화면의 약 70%. 안내·수식·도구는 가장자리에 작게, 그림을 가리면 그 자리를 비워 둡니다(`board.setInsets`).
2. **질문 → 조작 → 관찰 → 정리 → 적용** — 모든 실험실이 같은 3개 탭(탐구 · 정리 · 문제)을 씁니다. 풀이 단계를 누를 때마다 그림에 보조선이 드러나고, 정답은 단계를 다 본 뒤 열립니다(기존 ‘단계 공개’ 유지).
3. **색과 모양의 약속** — *후광이 있는 점*은 끌 수 있습니다. *같은 대상은 같은 색*입니다(슬라이더 손잡이·실시간 값·그림의 선). 실시간 값에 마우스를 올리면 그림의 해당 부분이 강조됩니다.
4. **수학적으로 정확한 그림** — 무대는 항상 가로·세로 1:1 축척입니다(기존 일부 실험실은 y축 0.82배 → 수직이 수직으로 보이지 않음).
5. **수업 모드** — `T` 한 번으로 큰 글씨·굵은 선·발표 막대. 리모컨(←/→, PageUp/Down)으로 단계·장면 이동, `D` 판서(그래프에 붙어서 확대·이동해도 함께 움직임), QR로 “지금 이 장면 그대로” 학생 휴대폰에 공유.
6. **PC·모바일 하나의 셸** — 데스크톱은 무대+패널 2단, 모바일은 무대를 위에 고정하고 패널이 그 아래로 스크롤. 손가락 확대·두 손가락 이동, 손잡이 터치 반경 30px.
7. **확장은 데이터로** — 실험실 추가 = `kit/catalog.js`에 한 항목 + 실험실 파일 하나. 개수·필터·검색·노선도는 자동.

## 2. 구조

```
next/
  index.html            허브 (catalog.js를 읽어 자동 생성)
  compare.html          기존 ↔ 2.0 비교
  kit/
    apl.css             디자인 토큰(칠판/종이 테마, 수학 의미색) + 모든 셸 컴포넌트
    apl-core.js         네임스페이스·아이콘·KaTeX 렌더($…$ 자동 변환)·저장소·테마·대화상자
    apl-board.js        무대 엔진: 좌표계(cartesian/figure)·격자·축·곡선·도형·라벨·핸들·핀치·자동 맞춤
    apl-shell.js        실험실 셸: 장면/묶음, 탐구·정리·문제 패널, 단계 플레이어, 수업 모드, 판서, 공유, 단축키, URL 상태
    apl-compat.js       기존 ‘마스터 실험실’ 계열 그리기 함수(pline·ppoly·pdot…) 호환층
    apl-hub.css/js      허브 전용
    catalog.js          전체 실험실 목록(단일 출처): 과정·단원·노선·장면·기존/2.0 경로
    vendor/katex/       KaTeX 0.16.9 (woff2만, 오프라인 동작)
    vendor/qrcode.js    QR 생성기 (MIT, Kazuhiko Arase)
  labs/                 2.0 셸 위의 실험실
  tools/
    catalog.test.mjs    카탈로그·키트 정합성 검사 (node --test, 브라우저 불필요)
    scene-smoke.mjs     모든 장면 자동 렌더 검사 (Playwright)
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
- 끝으로 `kit/catalog.js`의 해당 항목에 `"next": "next/labs/파일.html"`을 적으면 허브에 2.0 배지와 장면 바로가기가 생깁니다.

## 4. 기존 실험실 옮기기 (계열별 경로)

| 계열 | 수 | 공통 구조 | 옮기는 법 |
|---|---|---|---|
| 마스터 실험실 (중등 도형 등) | 16 | `getSpec()` + `SUB_MENUS` + `pline/ppoly/pdot…` | **호환층 이식**: getSpec·renderModeN을 글자 그대로 복사, `apl-compat.js`가 그리기 연결. 삼각비가 예시(원본 코드 그대로 재사용, 수정은 5곳: 빠진 함수 정의 2, 변수 이름 1, 호 그리기 2). |
| 킬러 랩 (고등 함수·기하) | 14 | `examData` + `drawChalkLine/drawChalkPoint` | **데이터 이식 + 그리기 이식**: examData는 그대로, 그리기는 `b.plot/b.line/b.handle`로 옮기며 1:1 축척 적용. 접선과 미분계수가 예시. |
| 개별 설계 (원과 부채꼴, 단위원, 대수 Part) | 13 | 실험실마다 다름 | 우선 기존 경로로 허브에 연결 → 수업 빈도 순으로 하나씩 이식. |

이식할 때 지키는 것: 해설·문제 문자열과 수학 함수는 바꾸지 않습니다(검수 이력 보존). 화면 표시만 정리합니다(이모지·`[오답 1위]` 꼬리표는 셸이 배지로 바꿔 보여 줌).

## 5. 검사

```bash
node --test apmath/playground/next/tools/catalog.test.mjs     # 카탈로그·경로·키트 문법 (CI 등록 권장)
python3 -m http.server 8765 &                                   # 저장소 루트에서
node apmath/playground/next/tools/scene-smoke.mjs               # 모든 장면 × 두 테마 렌더 검사
```

같은 방식으로 기존 실험실 45개를 순회한 결과, 기존 파일에서 실행 오류 장면 5개를 찾았습니다(삼각비 4: 탭 8의 기본 장면 포함, 피타고라스 1). 2.0 삼각비에서는 고쳤고, 기존 파일은 이번 작업 범위 밖이라 수정하지 않았습니다.

## 6. 키보드

`←/→` 단계(끝나면 다음 장면) · `[ ]` 장면 · `1–9` 장면 바로가기 · `T` 수업 모드 · `D` 판서(`E` 지우개, `X` 모두 지우기) · `H` 패널 접기 · `F` 전체 화면 · `G` 격자 · `0` 화면 맞춤 · `S` 문제 조건으로 맞추기 · `A` 정답 공개 · `Space` 애니메이션 · `?` 도움말. 무대를 누른 뒤 `N`으로 점 고르기, 화살표로 점 움직이기.
