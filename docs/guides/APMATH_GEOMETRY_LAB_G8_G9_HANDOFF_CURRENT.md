# AP Math 수학 실험실 — 중2·중3 도형 실험실 개편 핸드오프 (CURRENT)

> **기준일:** 2026-11-01
> **대상:** 수학 실험실 Lab 2.0(`apmath/playground/next/`)의 중2·중3 도형 실험실 6개. 중2는 `g8-triangles`·`g8-quadrilaterals`·`g8-similarity`·`g8-pythagoras`, 중3은 `g9-trig-ratio`·`g9-circle`이다.
> **상태:** 설계안 완료, 사용자 결정 확정, **제작 미착수**. 중1 도형 실험실 개편은 같은 방식으로 끝냈다(아래 §1).
> **설계안 정본:** [APMATH_GEOMETRY_LAB_G8_G9_DESIGN_CURRENT.md](APMATH_GEOMETRY_LAB_G8_G9_DESIGN_CURRENT.md). 단원별로 대응 실험실 현재 상태, 새 탭 구성, 유형별 장면 설계, 버릴 것, 캡처, 결정 사항을 담았다.
> **허브:** https://icefoxtail.github.io/AP------/apmath/playground/next/

---

## 1. 중1에서 끝낸 것 (같은 방식의 본보기)

| 실험실 | 탭·장면 | PR |
|---|---|---|
| `g7-circle-sector` 원과 부채꼴 | 12탭 92장면 | #1139 이전 |
| `g7-points-lines` 기본 도형 | 6탭 24장면 | #1142 |
| `g7-polygons` 다각형 | 4탭 18장면 | #1143 |
| `g7-parallel` 평행선의 성질 (신규) | 4탭 12장면 | #1144 |
| `g7-spatial` 위치 관계·반례 | 5탭 27장면 | #1149 |
| `g7-construction` 작도와 합동 (신규) | 6탭 23장면 | #1150 |
| `g7-polyhedra`·`g7-solids`(회전체)·`g7-surface-volume`, `g7-nets` 폐지 | 설계 Part 2 | 중1 마감 PR |

새로 만들 때는 이 실험실들의 코드를 먼저 읽는다. 구조와 화면 형식을 그대로 따라야 한다. 특히 `g7-polygons/`와 `g7-construction/`이 모듈 구조와 문제 생성의 본보기다.

## 2. 사용자 규칙 (교사 지시, 모두 유지)

- **완료 기준은 "학생이 쓰기에 적당한가"이다.** 오류, 깨진 그림, 가려지는 내용, 동작하지 않는 버튼에 집중한다. 미미한 것은 넘어간다. 핫픽스는 학생 사용에 실제로 문제가 되는 것만 한다.
- **도형은 항상 조절 가능해야 한다.** 슬라이더나 끌기 핸들로 조절하고, 라벨·식·정리·정답·보기가 모두 즉시 다시 계산된다. 숫자만 고정된 장면은 만들지 않는다.
- **이동은 항상 가로로 한다. 세로 이동은 금지다.** 제자리 회전(접기, 회전체, 3D 시점)은 허용한다. 3D에서 직선이나 평면을 위아래로 옮기는 슬라이더도 세로 이동이므로, 도형 방향을 바꿔 가로나 앞뒤로 밀게 한다.
- **가독성이 먼저다.** 그림은 크게, 길이와 각은 그림 안에 크게 쓴다. 색은 적게 쓰고 역할을 분명히 한다. 한 장면에는 한 가지 생각만 담는다.
- **용어는 2022 개정 교육과정 용어를 쓴다.** 학생이 읽고 정확히 무슨 뜻인지 알아야 한다.
- **함정·킬러·N초 컷 표현은 유지한다.**
- **입체도형은 기본을 3D 보기로 한다.**
- **캡처나 기출 그림은 도형 모양을 정하는 기준이다. 숫자까지 똑같이 맞출 필요는 없다.**
- **보고는 한국어로 한다.**
- **검수를 통과하면 바로 main에 PR로 머지한다.**

## 3. 확정된 결정 (2026-11-01, 사용자: "교육과정에 맞춰서")

- 기준은 **2022 개정 교육과정**이다.
- **중2는 제곱근(√)을 배우기 전이다.** √ 표기를 쓰지 않는다. 피타고라스는 정수 세 쌍(3-4-5, 5-12-13, 8-15-17)과 `x²=값` 꼴로만 다룬다. 현재 `g8-pythagoras`에서 √가 새는 곳(`hinge`·`obtuseRange`·`acuteRange`·`trap34x`)을 고친다.
- **중점연결정리**는 평행선과 선분의 길이의 비의 일부이므로 본 탭에 넣는다.
- **삼각형의 무게중심**은 2022 개정 중2에 포함되는지 확정할 근거가 부족하다. 실제 기출이 79문항 있으므로 지우지 않고 「심화」 탭으로 분리한다.
- 다음은 「심화」로 표시한다.
  - 원뿔 자르기 1:7:19
  - 직각삼각형 수선 관계 AB²=BH·BC (공식 이름 없이 닮음으로만 설명)
  - 직육면체·원기둥 최단거리 (√ 없는 수)
  - 중3 경계 유형: tan15°, 둔각 삼각비, 할선 길이 관계
- 기존 장면 가운데 「충분」 판정을 받은 것은 새 보드 형식(탭 모듈)으로 옮겨 실험실 모양을 통일한다.
- 삼각비표는 0°~90° 전체를 쓴다.
- 원의 현 장면은 교재 모양을 유지하고 d를 슬라이더로 바꾼다.
- **2026-11-01, 사용자: "중1은 추천대로"** — 설계안 §6의 위험·결정 질문은 추천안대로 처리한다. 중2·중3에도 같은 원칙을 쓴다. 범위는 도형만이다(확률·함수·방정식 제외).

## 4. 작업 방식 (CLAUDE.md "Claude 작업 방식"과 같음)

1. 메인은 오케스트레이터만 맡는다. 실험실 하나마다 Sonnet 작업자 1명을 쓴다(`isolation: worktree`, 저장소 디렉터리에서 실행). 작업자와 검수자는 `effort: "high"`로 부른다. 지시서는 §6을 쓴다.
2. 작업자가 끝나면 메인이 **스크린샷 PNG 몇 장을 직접 보고** 정답을 손으로 풀어 본다. 이 단계에서 그림과 문제가 어긋난 것을 여러 번 잡았다.
3. 다른 Sonnet이 검수한다(§7). FAIL이면 같은 작업자에게 SendMessage로 돌려보내 고치게 한다. 재검수는 바뀐 부분만 본다.
4. PASS하면 메인이 지정 브랜치에 병합한다. 그다음 `gen-manifest`, `catalog.test`, push, PR 생성, 머지 순서로 진행한다. `apl-catalog.js`가 충돌하면 양쪽 항목을 모두 살려 병합으로 푼다.
5. 실험실은 서로 독립이므로 2~3개씩 병렬로 돌린다. 사용량 한도로 작업이 끊기면 남은 worktree를 확인하고 같은 작업자에게 이어서 맡긴다.

**권장 순서:**
- 웨이브 A: `g8-triangles`·`g8-quadrilaterals`
- 웨이브 B: `g8-similarity`·`g8-pythagoras`
- 웨이브 C: `g9-trig-ratio`·`g9-circle`

중2 실험실 4개는 모두 문제 탭이 없다. 그래서 문제 탭(5지선다와 숫자 바꾸기)을 전부 새로 만들어야 한다.

## 5. 구조 (모듈 실험실)

- 페이지는 `apmath/playground/next/labs/<lab>.html` 하나다. `APLab.createLab(def)`를 호출하고 `labs/<lab>/<name>.js` 모듈을 불러온다.
- 각 모듈은 실험실 전용 전역 배열에 `{order, id, title, params?, scenes}`를 넣는다. 예: `window.APL_TR_GROUPS`. 페이지는 order 순으로 정렬하고 params를 합친다. 없는 모듈 파일이 있어도 로더가 견딘다.
- 키트는 `next/kit/`에 있다.
  - `apl-shell.js`: 장면별 `aspect:'free'`, `boardKind:'cartesian'`
  - `apl-board.js`
  - `apl-space.js`: 3D
  - `apl-catalog.js`: 허브 노선도의 단일 원천. 실험실의 title, 탭 이름, `sceneTotal`을 여기에 적는다.
- 장면 하나는 탐구(조작과 움직임), 정리(교재 풀이 순서대로 단계마다 그림 강조), 문제(5지선다와 숫자 바꾸기, 정답은 정확히 하나)로 이루어진다.

## 6. 작업 지시서 템플릿 (작업자에게 그대로 전달)

```
Implementer subagent in an isolated git worktree of repo AP------. First: git fetch -q origin main && git reset --hard origin/main.
DESIGN (approved): docs/guides/APMATH_GEOMETRY_LAB_G8_G9_DESIGN_CURRENT.md — read your unit's section completely + "## 결정" at the end. Build exactly that tab/scene plan.
HANDOFF rules: docs/guides/APMATH_GEOMETRY_LAB_G8_G9_HANDOFF_CURRENT.md §2, §3, §5, §8 (non-negotiable).
MODEL: study apmath/playground/next/labs/g7-polygons.html + g7-polygons/*.js and g7-construction/*.js first; copy the architecture and look.
Every scene: adjustable (sliders/handles), all labels/steps/answers recompute live; lengths and angles INSIDE the figure (≥12px phone); equal angles same mark, right angle square, equal segments ticks, parallel arrows; translation horizontal only; 탐구→정리→문제(5지선다+숫자 바꾸기, exactly one correct, verify numerically); PC 1440×900 and phone 390×844, light/dark, 0 console errors, nothing clipped.
Checks: serve the worktree on your own port (verify it's yours; stop at end); node apmath/playground/next/tools/scene-smoke.mjs filtered to your lab (temp copy) — all PASS; numeric answer sweep; screenshots of every scene PC+phone → <scratchpad>/shots/<lab>/.
Catalog: update only YOUR entry in apmath/playground/next/kit/apl-catalog.js (title, tab names, sceneTotal), then node apmath/playground/next/tools/gen-manifest.mjs and node --test apmath/playground/next/tools/catalog.test.mjs.
Commit only your files; don't push. Report ≤80 words: worktree, branch, SHA, tabs with scene counts, screenshot dir, anything not done.
```

## 7. 검수 지시서 요점

검수자는 수정한 작업자와 다른 인스턴스여야 한다. 검수자가 하는 일은 다음과 같다.

- 자기 서버에서 scene-smoke와 catalog.test를 돌린다.
- Playwright로 PC와 휴대폰 화면에서 모든 탭과 장면을 열어 본다. 슬라이더와 핸들을 한 번씩 움직인다. 정리 탭을 마지막 단계까지 넘긴다. 문제 탭에서 숫자 바꾸기를 3번 눌러, 보기가 5개이고 정답이 하나인지 본다.
- **장면 8개 이상을 손으로 푼다.**
- 결과로 PASS/FAIL, 막는 문제(장면·화면·학생이 보는 것), 막지 않는 메모 5개 이하를 보고한다.

전수 측정은 하지 않는다.

## 8. 중1에서 실제로 걸린 실수 (지시서에 꼭 넣을 것)

- **문제 그림에는 문제에 주어진 것을 모두 그린다.** 예를 들어 "이등분선이 만나는 점 I"라면 이등분선과 같은 각 표시를 그린다. 숨기는 것은 풀이 중간값과 정답뿐이다.
- **x는 묻는 각이나 선분에 정확히 표시한다.** ∠APQ를 물으면 호를 P에 그린다.
- **같은 표시는 주어진 등식을 모두 나타낸다.** AB=AC이고 CA=CD이면 세 변에 같은 표시를 한다.
- **발문에는 그림에 그린 점 이름만 쓴다.** 보기를 "눌러 크게 보기"로 안내하지 않는다. 보기는 누르면 바로 제출된다.
- **KaTeX 오류를 없앤다.** `$…$` 안에서는 `\lt \gt \le \ge`를 쓰고, JS 문자열에서는 백슬래시를 이스케이프한다. 렌더된 페이지에서 `.katex-error`를 찾는다.
- **첫 문제(숫자 바꾸기 전)도 완전히 초기화한다.** "undefined", "NaN", 빈 보기가 나오면 안 된다. 정리 0단계 캡션에도 undefined가 나오지 않게 한다.
- **숫자 생성기에서 경계와 퇴화 경우를 뺀다.** 예: SSA에서 접하는 경우는 삼각형이 1개다. "한 직선 위"가 정답이면 점을 정확히 한 직선 위에 그린다.
- **설명은 모든 변형에서 참이어야 한다.** 예: "한 칸 건너뛴 면"은 십자형 전개도에서만 참이다.
- **조사는 도우미 함수로 붙인다.** 이/가, 을/를, 은/는, 과/와를 붙일 때 숫자 받침(0·1·3·6·7·8)도 처리한다.
- **함정·킬러 태그는 제목 앞의 `[함정]` 접두어와 문제 태그로 단다.**
- **멀리 떨어진 교점까지 휴대폰 화면 안에 읽을 수 있는 크기로 담는다.**

## 9. 자료 위치

- **기출 원본:** `archive/exams/original/middle/<m2|m3>/<2mid|2final|…>/*.js`
  - `window.examData.questions`에 들어 있고, 필드는 `standardUnit`, `originalCategory`, `level`, `hasVisual`이다.
- **기출 그림:** `archive/assets/images/<시험 파일 이름>/q<두 자리 번호>.png`
- **설계안 문항 표기:**
  - 예: `23신흥#12` = `m2/<2mid 또는 2final>/23_신흥중_*.js`의 12번
  - 시험 구분 표시가 없을 때: 삼각형·사각형은 중간고사, 닮음·피타고라스는 기말고사
  - 예외는 `(중)`·`(기)`를 붙인다.
- **도구:**
  - `apmath/playground/next/tools/scene-smoke.mjs`: 장면 전체를 PC 보드·PC 종이·휴대폰으로 열어 오류, 빈 그림, 잘린 라벨, 빠진 조작을 찾는다.
  - `catalog.test.mjs`
  - `gen-manifest.mjs`: `apmath/playground/manifest.json`을 갱신한다.
- **배포:** main에 push하면 GitHub Pages로 배포된다.
