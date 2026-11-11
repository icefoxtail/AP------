# AP Math 실험실 「원클릭 해설(lesson)」 인계 계획서 CURRENT

> **기준일:** 2026-11-11 (KST) · **긴급 운영 정책 변경:** 구현·운영 병합 우선, 전수 검수 후행 · **범위:** 중1 → 중2·중3 → 고등
> **저장소:** https://github.com/icefoxtail/AP------ · **학생 화면:** https://icefoxtail.github.io/AP------/apmath/playground/next/
> 이 문서는 진행 상태를 담는다. 실험실 하나를 끝낼 때마다 §3 표와 §9 기록을 같은 PR에서 갱신한다. 형식과 대본 규칙의 원문은 `docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md` §7이다.

## 0. 최신 사용자 결정 — 2026-11-11 시험 대비 구현·운영 우선 (최상위)

> **이 절은 2026-11-11 사용자의 직접 지시이며, 이 문서 아래에 남은 이전 「CI 전부 녹색 → PR → 390×844 전수 화면 검수 → main 병합」 선행 조건보다 우선한다.** 검수를 없애는 것이 아니라 **운영 뒤로 옮기는 것**이다. 시험 대비 중1 원클릭 해설을 학생이 바로 쓸 수 있게 하는 것이 첫 목표다.

- **긴급 RELEASE 순서:** ① 이미 제작한 [g7-circle-sector PR #1736](https://github.com/icefoxtail/AP------/pull/1736)부터 main에 운영 병합 → Pages 배포 확인 → ② g7-surface-volume 잔여 구현·보완 → 별도 PR·main 병합·Pages 확인 → ③ §5-3의 중1 나머지 8개 실험실을 하나씩 **구현 → 최소 안전 확인 → PR → main 병합 → Pages 확인** → ④ 중2·중3 → ⑤ 고등.
- **브랜치 적체 금지:** 실험실 하나를 구현했다면 검수 대기 Draft 상태로 방치하지 말고 그 실험실의 운영 병합과 배포 확인을 먼저 마친 뒤 다음 실험실로 간다. 이전 브랜치·PR·코드를 재제작하지 않는다. 해당 운영 병합은 이번 사용자 지시로 승인됐다.
- **운영 전 최소 안전 확인(가벼운 출고 조건):** 실제 질문·답·사용 상태 결속 확인, 새 코드 구문 검사, 해설 데이터 유효성/최소 수학 검산, 재생 버튼/로드 경로의 명백한 오류 확인, 변경 파일과 Git diff 확인. 기존 테스트가 이미 같은 코드 SHA에서 통과했다면 재활용하고 매 실험실의 전체 장면마다 장시간 중복 검사하지 않는다.
- **즉시 막아야 할 P0:** 기동 불가, 핵심 도형 완전 누락, 재생 버튼 무반응, 수학적으로 틀린 정답, 화면 기능을 파괴하는 확정 오류. 확인된 P0는 최소 수정 후 병합한다. 불확실한 시각·자막 정밀 품질은 이 단계의 출고 차단 조건이 아니다.
- **후속 QUALITY 단계(사용 중 개선):** 390×844 모든 장면의 진입·각 장·마지막 정답·다시 보기·직접 해 보기·전후 캡처, 라벨/자막 동기화, 터치·잘림·회귀 비교, 독립 검수는 전체 신규 구현·중1 운영 반영 후 수행한다. 학생/교사 실사용 제보를 받아 이슈·별도 패치 PR로 수정한다. 검수 미실행은 `QA_PENDING / NOT_RUN`으로 명시하며 `QA_PASS`로 쓰지 않는다.
- **CI 및 Git 보호:** 실행된 CI를 끄거나 무효화하지 않는다. 무관한 기존 CI 실패는 로그로 분리하고 운영 반영을 진행하되, GitHub에서 실제 요구하는 병합 보호/검증 게이트는 강제로 우회하지 않는다. 신규 변경의 명백한 오류·P0 실패는 수정한다. CI는 병합 후에도 계속 관찰해 대응한다.
- **상태 명칭:** `IMPLEMENTED`(구현 및 최소 확인), `MAIN_MERGED`(Git main 반영 확인, Pages 별도), `RELEASED_QA_PENDING`(main·Pages 반영 확인, 전수검수 대기), `QA_VERIFIED`(실제 후속 검수 완료), `BLOCKED_P0`(운영 차단 오류)로 구분한다. `RELEASED_QA_PENDING`은 품질 PASS를 뜻하지 않는다.
- 공통 재생 키트의 구조 변경(K1~K4)은 실제 구현이 막힐 때만 별도 브랜치·PR로 진행한다. 사용자에게 반복 승인 질문 없이 순차 진행한다.

## 1. 목표

학생이 휴대폰에서 실험실 장면을 열면 **그림 + 질문 + ▶ 버튼**만 보이고, ▶ 한 번으로 풀이가 정답까지 자동 재생된다. 재생이 주 경험이고 슬라이더·드래그는 「직접 해 보기」 뒤의 부가 경험이다. 목표는 실험실의 단순화와 최소 탭이다.

판정 기준은 하나다: **학생이 실제 휴대폰 화면에서 보고 이해할 수 있는가.** 수치상 완벽이나 전수 측정이 아니라, 학생이 실제로 겪을 문제(틀린 수, 일찍 보이는 정답, 자막과 다른 그림, 잘리거나 겹친 글자, 눌러도 안 되는 버튼)를 없애는 것이다.

## 2. 사용자 결정 사항 (바꾸지 않는다)

| # | 결정 | 이유 |
| --- | --- | --- |
| 1 | 재생이 주 경험, 조작은 부가 경험. 해설이 있는 장면은 휴대폰에서 조작부를 접는다 | 실험실 단순화, 최소 탭 |
| 2 | **개념마다 ▶ 하나.** 장면이 둘을 물으면(둘레·넓이, 겉넓이·부피) 버튼도 둘, 누르면 바로 그 해설 | 모드 전환 없이 원하는 것 하나를 본다 |
| 3 | **개념뿐 아니라 기본·심화 유형도 대상.** 공식이 같아도 유형이 다르면 해설을 따로 만든다 | 유형을 눈으로 보고 이해해야 한다 |
| 4 | 쇼츠 규칙 유지: 한 장 8~15초, 자막 2~3줄, 한 줄 40자 이하. 긴 풀이는 장 2~4개(최대 6개)를 이어 재생 | 24초·22초 샘플이 늘어진다는 지적(11-03) |
| 5 | ▶ 버튼은 작게(보이는 높이 약 34px, 터치 영역 약 42px), 「직접 해 보기」와 한 줄 | 한 번 누르는 버튼이 클 필요가 없고 그림이 내용이다 |
| 6 | 상단 내비게이션은 유지(재생 중에만 숨김) | 학생이 다음 그림으로 넘어가야 한다 |
| 7 | 직관 설명을 증명처럼 쓰지 않는다(뿔의 ⅓, 구의 공식, 조각 재배열) | 과장된 증명 금지 |

## 3. 현재 상태

장치(키트)는 main에 있다: `kit/apl-video-core.js`(형식·검사·타임라인), `kit/apl-player.js`(재생기·진입 화면), `kit/apl-video.css`, `kit/apl-toc.js`, `tools/lesson-browser-audit.mjs`(수동 브라우저 감사, 현재 CI에서 실행하지 않음), `tools/video.test.mjs`. 알려진 보완은 §5-4를 따른다.

| 실험실 | 장면 | 해설 있는 장면 / 해설 수 | 상태 |
| --- | --- | --- | --- |
| `g7-surface-volume` 겉넓이·부피 | 30 | 30 / 54 | **RELEASED_QA_PENDING** · [PR #1746](https://github.com/icefoxtail/AP------/pull/1746), merge `4ab7f327068a09ecbe583f1141487e299965e28b`. 실제 기존 18/23 + 잔여 12/27 + 기존 장면 부피 4해설. 최소 검사 182/182. Pages run 42962929336 성공, 실제 HTML·18모듈 소스 일치 (§5-2) |
| `g7-circle-sector` 원과 부채꼴 | 86 | 86 / 98 | **RELEASED_QA_PENDING** · [PR #1736](https://github.com/icefoxtail/AP------/pull/1736), merge `480018bea30d86225b8e41c79eda5cd76ce03ebc`. [Pages run 42958902234](https://github.com/icefoxtail/AP------/actions/runs/42958902234) 성공, 실제 HTML 및 17개 모듈의 배포 소스 일치 확인. 전체 모바일 품질검수 NOT_RUN |
| `g7-polyhedra` 다면체 | 26 | 26 / 58 | **RELEASED_QA_PENDING** · [PR #1747](https://github.com/icefoxtail/AP------/pull/1747), merge `1e4fe2ce808fff9887e798b7ec7cf4e4f0461bbe`. 최소 검사 131/131, 누락 0. Pages run 42962929336 성공, 실제 HTML·10모듈 소스 일치 |
| `g7-solids` 회전체 | 22 | 22 / 48 | **RELEASED_QA_PENDING** · [PR #1750](https://github.com/icefoxtail/AP------/pull/1750), merge `459c71d08b159a7fe5fffc91ea5c3553e78005b9`. 최소 검사 108/108, 누락 0. Pages run 42966828800 성공, 실제 HTML·10모듈 11/11 소스 일치 |
| `g7-polygons` 다각형 | 18 | 18 / 31 | **RELEASED_QA_PENDING** · [PR #1754](https://github.com/icefoxtail/AP------/pull/1754), merge `0f82b309173e29d399945bccedd0a52c8196b586`. 최소 검사 145/145, 누락 0. Pages run 42966828800 성공, 실제 HTML·8모듈 9/9 소스 일치 |
| `g7-area` 다각형의 넓이 | 14 | 14 / 30 | **RELEASED_QA_PENDING** · [PR #1755](https://github.com/icefoxtail/AP------/pull/1755), merge `68060cca4e6f89edaa806b7b5cafaafe102290e3`. 최소 검사 102/102, 누락 0. Pages run 42966828800 성공, 실제 HTML·7모듈 8/8 소스 일치 |
| `g7-parallel` 평행선의 성질 | 12 | 12 / 29 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1757](https://github.com/icefoxtail/AP------/pull/1757), merge `22cad5a7005bc7ddedc0ab17fb760f4605b11dae`. 최소 검사 86/86, 누락 0. Pages 등록 작업 대기 |
| `g7-points-lines` 점과 직선 | 24 | 24 / 63 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1758](https://github.com/icefoxtail/AP------/pull/1758), merge `87861a8b40debf3eb8e69153426721298e519e6d`. 최소 검사 120/120, 누락 0. Pages 등록 작업 대기 |
| `g7-spatial` 공간 위치 관계 | 27 | 27 / 62 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1760](https://github.com/icefoxtail/AP------/pull/1760), merge `16460f7381b3ca9df8ee80934a2096e588fad380`. 최소 검사 102/102, 누락 0. 실제 학생 HTML은 이전 버전 |
| `g7-construction` 작도와 합동 | 23 | 23 / 70 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1764](https://github.com/icefoxtail/AP------/pull/1764), merge `87b09c58ac6cc061ba623c1e3e990ddcc18f6537`. 최소 검사 141/141, 누락 0. 실제 학생 HTML은 이전 버전 |
| `g8-pythagoras` 피타고라스 정리 | 37 | 37 / 87 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1766](https://github.com/icefoxtail/AP------/pull/1766), merge `8951ab5607b3e2d1b7fc54ae64738875a626fd87`. 최소 검사 151/151, 구문 17파일, 누락 0. 실제 학생 HTML은 이전 버전 |
| `g8-triangles` 삼각형의 성질 | 43 | 43 / 165 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1768](https://github.com/icefoxtail/AP------/pull/1768), merge `c554314dab47bb18adf8f71d8cf50f0e87e45b3e`. 최소 검사 171/171, 구문 16파일, 누락 0. 실제 학생 HTML은 이전 버전 (§6) |
| `g8-quadrilaterals` 사각형의 성질 | 32 | 32 / 133 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1775](https://github.com/icefoxtail/AP------/pull/1775), merge `1adb00ecf9d275d8b83df5e1089e27e9dfe77466`. 기존 23/106 보존 + 잔여 9/27 추가, 누락 0. 최소 검사 109/109·구문 17파일 통과. 공통 Pages 등록 대기 (§6) |
| `g8-similarity` 도형의 닮음 | 39 | 39 / 144 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1777](https://github.com/icefoxtail/AP------/pull/1777), merge `80e3ecc5119c200b722c6e7563835e8fd772b2ea`. 기본 닮음·넓이/부피·삼각형 17/65, 평행선 11/44, 직각삼각형·활용·무게중심 11/35. 누락 0. 최소 검사 108/108·구문 18파일 통과. 실제 학생 HTML은 이전 버전 (§6) |
| `g9-trig-ratio` 삼각비 | 51 | 51 / 245 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1779](https://github.com/icefoxtail/AP------/pull/1779), merge `3400e9240abae41b881648817390963adaf65c1c`. 뜻·특수각·표 19/111, 길이·높이 15/69, 넓이·입체 17/65. 개념 74, 원문 예제 171, 누락 0. 최소 검사 136/136·구문 22파일 통과. 실제 학생 HTML은 이전 버전 (§6) |
| `g9-circle` 원의 성질 | 45 | 45 / 215 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1780](https://github.com/icefoxtail/AP------/pull/1780), merge `41a2cc430ee7f2c297d771587dee61e065b72df4`. 현·접선 14/71, 내접원·원주각 14/67, 내접사각형·접현각·넓이 17/77. 개념 69, 원문 예제 146, 누락 0. 최소 검사 126/126·구문 22파일 및 HTML 인라인 2개 통과. 실제 학생 파일은 미반영 (§6) |
| `calc1-tangent` 접선과 미분계수 | 7 | 7 / 26 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1782](https://github.com/icefoxtail/AP------/pull/1782), merge `1e5c92ffd6beabd3225053f6ad35f8f25898522e`. 개념 17·첫 원문 소문항 9. 최소 검사 47/47·726 Board cue frames. 실제 운영 파일 0/2 일치 (§7) |
| `alg-sine-cosine-law` 사인·코사인법칙 | 18 | 18 / 45 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1784](https://github.com/icefoxtail/AP------/pull/1784), merge `f30aaecf76d61a0a2a5c5a6d827c9d488af7dda5`. 개념 18·첫 원문 소문항 27. 최소 검사 47/47·1,188 Board/raw canvas cue frames. 실제 운영 파일 0/4 일치 (§7) |
| `common-rational` 유리함수 | 4 | 4 / 19 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1786](https://github.com/icefoxtail/AP------/pull/1786), merge `b07a26bba6afde5dd00996dacb036ef6228668eb`. 개념 15·첫 원문 4. 최소 검사 47/47·546 Board/raw canvas cue frames. 실제 운영 파일 0/4 일치 (§7) |
| `common-poly-solid` 다항식과 입체 | 5 | 5 / 17 | **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING** · [PR #1790](https://github.com/icefoxtail/AP------/pull/1790), merge `7348e5114857ce2ef9664ba2f51f712b477d4eb4`. 개념 12·첫 원문 5. 최소 검사 47/47·466 Board cue frames(392 native Space). 실제 운영 파일 0/4 일치 (§7) |
| 고등 잔여 34개 | — | — | 과목 순서로 진행. 다음 `common-quadratic` 36장면 (§7) |

장면 수는 `kit/apl-catalog.js` 기준이다(중1: points-lines 24, parallel 12, spatial 27, construction 23, area 14, polygons 18, polyhedra 26, solids 22 / 중2: triangles 43, quadrilaterals 32, similarity 39, pythagoras 37 / 중3: trig-ratio 51, circle 45).

## 4. 작업 방식 — 긴급 RELEASE → 후속 QUALITY

1. **실험실 하나 = 브랜치 하나 = PR 하나 = 운영 main 병합 하나.** 기존 PR이 있으면 재사용하고, 신규는 `feat/lessons-<실험실 id>`를 최신 main에서 만든다.
2. **PR #1736의 main·Pages 반영은 완료했으며 재구현하지 않는다.** 후속 실험실도 이전 모바일 전수검수 미실행만을 이유로 멈추지 않는다.
3. 다음 실험실에서만 기존 수학 질문·상태·해설 코드를 확인해 잔여를 구현한다. 작은 단위 commit/push → 한 실험실 전체 구현 → **구문, 해설 validator, 핵심 계산, 파일/경로 확인** → PR → main 병합 → Pages 확인. 그다음 실험실로 이동한다.
4. **전수 모바일·독립 시각 검수는 후속 QUALITY로 이관한다.** 매 해설·매 장면 캡처, 0.5초 전체 추적, 브라우저 감사 수십 분, 세 탭 픽셀 비교, 모든 CI 완료 대기는 긴급 RELEASE의 선행 게이트가 아니다. 검사 미실행은 `NOT_RUN`으로 기록하고 완료/PASS로 주장하지 않는다.
5. 변경 파일과 Git SHA, 누락 장면 수, 최소 검사 결과, Pages 확인 상태를 실험실 단위로 기록한다. 테스트/CI는 끄거나 완화하지 않고, 실행 중·기존 결함·이번 수정으로 새로 발생한 실패를 구별한다. 저장소 보호 규칙이 병합을 막으면 정확한 차단 사유를 남기고 가능한 오류만 고친다.
6. **명백한 수학 오답·도형 미표시·전체 재생 실패 등 확인된 P0는 긴급 수정 후 출고.** 단순한 소형 라벨 겹침·사소한 타이밍·고급 미감 개선은 제보/후속 검수 대상으로 관리한다.
7. 기존 `question`, `steps`, `rule`과 화면 상태 키·범위는 실제 장면에서 읽는다. 수학적 추측으로 틀린 해설을 양산하지 않는다. 첫 장 시작값·정답 최종 공개 규칙은 유지한다.
8. **공통 키트 파일과 다른 실험실 수정은 PR에서 분리**한다. 탐구·문제 화면을 건드리는 변경은 가능한 한 제한한다. `manual=1` 기존 회귀 테스트는 수정 범위 내에서 빠르게 실행하되 정밀 화면 비교는 후속 QUALITY로 남긴다.

**실험실 내용 PR에서 허용하는 파일**

| 고친다 | 별도 PR 또는 후속 검수 |
| --- | --- |
| `labs/<id>/lesson*.js`, `labs/<id>.html`의 로딩·연결 | `kit/**` 공통 재생기 대규모 변경 |
| 장면별 해설 진입·재생에 필요한 최소 그림/라벨 분기 | 다른 실험실 기능 변경 |
| `tools/lessons.<id>.test.mjs` 및 필요한 좁은 범위 fixture 업데이트 | 검사 기준/분모 삭제, 전체 감사 도구의 무관한 수정 |
| 해당 실험실 진행 상태와 PR·main SHA·Pages 링크 | 전체 캡처·장면별 정밀 시각 감사(후속 QUALITY) |

## 5. 중1 잔여

### 5-1. 원과 부채꼴 — **신규 구현·운영 반영 완료, 후속 QA 대기**

- 기존 브랜치: `feat/lessons-g7-circle-sector`; PR: [#1736](https://github.com/icefoxtail/AP------/pull/1736). 기존 45장면/51해설 + 신규 41장면/47해설 = **86장면/98해설 구현**. 재작업할 41장면은 없다.
- 마지막 확인된 코드 HEAD: `32975b7c63a75bc322708d4e30a5b9f9aa499ae1`(그 뒤 문서/운영 커밋은 최신 원격 SHA 우선); 대상 main은 계속 변하므로 병합 직전 PR diff·HEAD·Git 요구 조건을 재확인한다.
- 기존 해설·신규 해설에 대한 Node 716/716 PASS, 3,024 표본 프레임 소스 검증 결과는 **해당 코드 버전에만** 결속한다. 지금은 전체 QA를 재실행하지 않는다.
- **실행된 운영 병합·배포:** 기존 PR #1736을 main에 병합했고 merge `480018bea30d86225b8e41c79eda5cd76ce03ebc`를 확인했다. 이후 [Pages run 42958902234](https://github.com/icefoxtail/AP------/actions/runs/42958902234) 성공 및 실제 학생 HTML·17개 모듈의 배포 소스 일치를 확인해 **RELEASED_QA_PENDING**으로 갱신했다.
- **후행 검수:** 실제 390×844의 98해설 전체 재생·자막/그림 동기화·정답 카드·다시 보기·직접 해 보기 및 수정 장면 manual 세 탭 검수. 기존 1607의 10° 탐구 라벨 겹침은 후속 개선 목록으로 유지하고 임의 확장하지 않는다. Pages 배포를 확인하기 전에는 `MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING`, 확인 뒤에만 `RELEASED_QA_PENDING`으로 표기한다.
- **다음 순서:** Pages 배포 상태를 확인하고 §5-2의 겉넓이·부피 잔여 제작에 착수한다. 시험 전 중1이 우선이며 중2·고등 검수 때문에 중1 운영을 멈추지 않는다.

### 5-2. 겉넓이·부피 잔여

**브랜치 사전확인(2026-11-11):** 기존 `feat/lessons-g7-surface-volume`는 이미 병합된 [PR #1713](https://github.com/icefoxtail/AP------/pull/1713)의 과거 브랜치로, 조회 시 main 대비 ahead 0 / behind 85다. **그 브랜치를 작업 중인 미병합 결과로 오인하거나 다시 병합하지 않는다.** 잔여 구현은 최신 main에서 새 브랜치 `feat/lessons-g7-surface-volume-remainder`를 만들고 별도의 PR을 연다. 장면 수(총 30/기존 19/잔여 목록 12)의 분모 표기 불일치는 실제 `apl-catalog.js`와 해설 등록 목록으로 짧게 재확인한 뒤 제작한다. 이 재고 확인을 전체 시각 검수로 확장하지 않는다.

- 해설 없는 12장면: sv1-3, sv2-6, sv2-7, sv3-3, sv3-5, sv3-6, sv3-7, sv4-2(전개도에 값이 전혀 없음, 그리기 확장 필요), sv5-2, sv5-4, sv5-5, sv6-1.
- 중간 값이 자막보다 먼저 보이는 해설 8개(sv1-5, sv1-2, sv2-4 겉넓이, sv4-4, sv2-2, sv2-3 겉넓이, sv4-1 겉넓이, sv5-6): 면별 넓이가 그 값을 말하는 장에서 나타나게 한다. sv1-5는 정리 탭 전개도가 펼침 값(`sT5`)을 무시하고 처음부터 전부 그린다.
- 주어진 길이를 자막으로 말하지 않는 해설(sv1-2 높이 7, sv1-5 치수, sv4-4의 3·4·5, sv2-4 반지름 6·3, sv2-5·sv2-4 부피의 높이와 닮음 단계)을 보완한다.

**2026-11-11 구현 결과:** 최신 main `8a7a68d95d71acbfc6313022f5428a857fe9364d`에서 새 remainder 브랜치를 만들었다. 실제 HTML 모듈·카탈로그·lesson 등록 대조 결과는 **총 30장면, 기존 18장면/23해설, 잔여 12장면**이다. 종전 19/24 표기는 정정한다. 잔여 12장면에 27해설을 추가하고 기존 sv1-5·sv4-3·sv4-4·sv5-6의 부피 해설 4개를 보완하여 **30장면/54해설, 미등록 장면 0**이다. 기존 해설 객체는 보존했다.

- 지정 8건의 중간값은 해당 자막 뒤에 보이며 sv1-5 전개는 `sT5`를 따른다. 주어진 치수·닮음에 의한 큰/작은 뿔 높이 설명, 진입 상태의 그림·답 가림, 다시 보기 초기화를 보완했다. sv4-4의 전개도 반구 라벨은 실제 곡면 `18π`로 바로잡았다.
- `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-surface-volume*.test.mjs apmath/playground/next/tools/g7-surface-volume-*.test.mjs` → **182/182 통과, 실패 0**. 무필터 validator, 실제 등록 경로, 독립 수학 검산, 생산 Board의 진입·첫 cue·결론 162개 상태 포함. 수정 JS/MJS 20파일 구문 검사와 diff 공백 검사 통과. 공통 키트·CI·검사 기준 변경 없음.
- 실제 390×844 화면·54해설 전체 자동 재생·글자 잘림·정밀 동기화·터치·수동 화면 전후 비교는 **NOT_RUN / QA_PENDING**이다. 소스/Board 검사를 화면 품질 PASS로 해석하지 않는다.

### 5-3. 중1 나머지 8개 실험실

권장 순서(그림 움직임이 이미 있는 것부터): `g7-polyhedra` → `g7-solids` → `g7-polygons` → `g7-area` → `g7-parallel` → `g7-points-lines` → `g7-spatial` → `g7-construction`.

- `g7-polyhedra` 26장면/58해설, `g7-solids` 22/48, `g7-polygons` 18/31, `g7-area` 14/30, `g7-parallel` 12/29, `g7-points-lines` 24/63, `g7-spatial` 27/62, `g7-construction` 23/70을 구현했다. 중1 전체 282장면/543해설의 실제 등록과 각 실험실의 최소 검사를 완료했다. 마지막 작도까지 main 운영 병합을 확인했다. Pages 반영은 §3처럼 별도로 추적하며 §6의 중2 피타고라스 시범을 시작한다.
- `g7-parallel` 원본은 단계(`step`) 구동이 중심이다. 해설에는 보조선·각 표시의 실제 진행을 추가하고 종이 접기는 기존 `pat` 값을 재사용했다. 수동 화면의 기존 단계 동작은 유지한다.
- 값이 바뀌면 단계를 0으로 되돌리는 `view()`가 있다(`g7-parallel/kit.js`, `g7-polygons/core.js`, `g7-construction/core.js`, `g7-points-lines/common.js`). 값 설정 → 단계 순으로 쓴다.

**다면체 구현 기록:** 실제 HTML 모듈·카탈로그 26장면과 58해설이 일치한다(t1 8장면/22해설, t2·t4 10/21, t3 8/15). 구성 요소·입체별 옆면·전개도의 관계·단면 질문은 각각의 버튼으로 나눴다. 해설의 접기·분리·옆면 꺼내기 값은 정리 탭의 고정값에 덮이지 않으며, 이전 무작위 문제와 해설의 고정 문제를 분리했다. 최종 이름·개수·점 이름·주사위 물음표는 마지막 장에서 공개한다. 공통 키트 변경은 없다.

- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-polyhedra*.test.mjs apmath/playground/next/tools/g7-polyhedra-geometry.test.mjs apmath/playground/next/tools/g7-polyhedra-initial-geometry.test.mjs apmath/playground/next/tools/g7-polyhedra-selected-faces-initial.test.mjs apmath/playground/next/tools/polyhedra-dual.test.mjs apmath/playground/next/tools/polyhedra-names.test.mjs` → **131/131 통과, 실패·skip 0**. 무필터 validator, 실제 좌표·면 법선·중복 없는 모서리·삼중곱·단면·주사위 검산, 생산 Board 174개 진입/첫 cue/결론 상태와 기존 수동 기하 회귀 포함. 변경 JS/MJS 13파일 구문 및 diff 검사 통과.
- 후속 품질: 390×844 화면 및 58해설 전체 재생·잘림·터치·동기화 **NOT_RUN / QA_PENDING**. 기존 p1-5는 첫 그림 뒤 화면 맞춤이 적용되는 구조여서 첫 paint와 다음 paint의 배율 변화 가능성을 후속 화면 검수에서 확인한다. 도형·라벨·계산 오류로 확인된 것은 아니다.

**회전체 구현 기록:** 실제 HTML 모듈·카탈로그 22장면과 48해설이 일치한다(t1 7장면/19해설, t2 6/12, t3·t4 9/17). 생성 입체·반지름·높이, 단면 모양·크기 변화·넓이, 전개도·역산, 최단 경로를 질문별로 분리했다. 해설 상태는 이전 연습문제와 수동 정리 보간에 덮이지 않고, 계산 결과는 해당 마지막 장에서 공개된다. 직접 해 보기의 기존 동작과 공통 키트를 유지했다.

- 원본문장 최소 수정: s1-6의 일반적인 두 원뿔 생성 단면을 무조건 직각삼각형이라고 하던 표현을 실제 기본 좌표에 맞게 삼각형으로 바로잡았다. 최단경로의 180° 사례는 꼭짓점 경유 허용 조건을 자막에 명시했다.
- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-solids*.test.mjs apmath/playground/next/tools/g7-solids-geometry.test.mjs apmath/playground/next/tools/g7-solids-status-badge-initial.test.mjs` → **108/108 통과, 실패·skip 0**. 무필터 validator, 원본 모델·별도 좌표 계산·단면 넓이·부채꼴/원뿔대 수학 검산, 생산 Board 144개 진입/첫 cue/결론 및 기존 수동 회귀 포함. 원뿔대 최단선이 잘린 부채꼴을 침범하지 않음은 허용 반지름 21쌍에서 확인했다. 변경 JS/MJS 13파일 구문 및 diff 검사 통과.
- 48해설의 실제 모바일 전체 재생·버튼/터치·정밀 동기화·잘림은 **NOT_RUN / QA_PENDING**이다. 소스·Board 결과를 화면 품질 PASS로 대체하지 않는다.

**다각형 구현 기록:** 실제 카탈로그·HTML 모듈 18장면과 31해설이 일치한다(t1·t2 8장면/14해설, t3 5/7, t4 5/10). 한 꼭짓점의 대각선·삼각형·두 개수의 합, 삼각형 외각·별·이등분선, 오목다각형, 정다각형의 존재 조건·결합각·팬 분할을 질문별 버튼으로 나눴다. 주어진 각과 길이는 처음부터 보이고 계산한 중간각·최종 답은 해당 설명 뒤에 공개한다. 해설에서 원본 보조선·회전·펼침 상태를 실제로 사용하며, 수동 정리 보간과 이전 문제 키가 해설을 덮지 않게 했다. 기존 직접 해 보기와 공통 kit는 유지했다.

- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-polygons*.test.mjs apmath/playground/next/tools/g7-polygons-*.test.mjs` → **145/145 통과, 실패·skip 0**. 무필터 validator, 독립 좌표·벡터 검산, 실제 Board의 진입·첫 cue·결론 93개 상태 및 필수 중간값 공개 검사를 포함한다. 변경 JS/MJS 13파일 구문 및 diff 검사 통과. 역산 장면의 진입은 정답 행을 숨긴 채 후보 6각형과 목표 대각선 27개를 보여 준다.
- 실제 390×844의 31해설 전체 재생·자막/그림 정밀 동기화·글자 잘림·터치는 **NOT_RUN / QA_PENDING**이다. 원본 모델과 Board 검사를 화면 품질 PASS로 해석하지 않는다.

**넓이 구현 기록:** 실제 카탈로그·HTML 모듈 14장면과 30해설이 일치한다(t1 6장면/12해설, t2 5/11, t3 3/7). 원본 도형 만들기와 수치 문제, 넓이·높이·둘레·비·부분 넓이 등 서로 다른 질문을 나눴다. 사다리꼴 응용은 원본 세 prob를 각각 밑변·전체 넓이·부분 삼각형 버튼에 결속하고 전체 넓이 해설 안에서 두 풀이 방법을 비교한다. 원본문제에 없는 높이 수치는 해당 수치 해설에서 감추고, 주어진 넓이와 비로 풀이한다. 직접 해 보기의 이전 문제 선택과 단계는 보존하되 해설 그림·단계에 끼어들지 않는다.

- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-area*.test.mjs apmath/playground/next/tools/g7-area-state.test.mjs` → **102/102 통과, 실패·skip 0**. 무필터 validator, 독립 좌표의 조각 합동·면적 보존·높이·넓이비·겹친 길 검산, 실제 Board 진입·첫 cue·결론 90개 상태와 중간값 공개 검사 포함. 기존 수동 상태 검사 20건을 유지했다. 변경 JS/MJS 12파일 구문 및 diff 검사 통과.
- 실제 390×844의 30해설 전체 재생·터치·글자 잘림·자막과 그림 정밀 동기화는 **NOT_RUN / QA_PENDING**이다. 390폭의 계산 문구 생성 확인은 소스 검사이며 실제 모바일 시각 품질 PASS가 아니다.

**평행선 구현 기록:** 실제 카탈로그·HTML 모듈 12장면과 29해설이 일치한다(t1·t2 6장면/16해설, t3 3/6, t4 3/7). 동위각·엇각 위치/조건/각 크기, 합 180° 오개념 및 원본 형식의 5보기 판별, 꺾임 1·2·3개, 정다각형 결합, 접은 각·삼각형 종류·수치 문제를 분리했다. 주어진 각은 고정하고 보조선·각 표시·기존 종이 접기를 실제로 움직인다. 이전 랜덤 보기와 수동 선택은 보존하되 해설에 들어오지 않는다.

- 원본문항 최소 수정: p4-1 기본 각에서도 종이 끝이 짧아 A가 접힌 종이 밖에 있던 불일치를 고쳤다. 오른쪽 종이 길이를 실제 AB에 맞춰 늘렸으며 각·접는 선·정답은 유지했다. 허용 각 40~70°와 대표 위치 3개의 **93상태**에서 ABC가 고정 종이와 접힌 종이 양쪽에 포함됨을 독립 반사·벡터 계산으로 검산했다.
- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-parallel*.test.mjs apmath/playground/next/tools/g7-parallel-geometry.test.mjs apmath/playground/next/tools/g7-parallel-zigzag-labels.test.mjs` → **86/86 통과, 실패·skip 0**. 무필터 validator, 원본 좌표 각도/정다각형/5보기/접기 검산, 실제 Board 진입·첫 cue·결론 87개 상태와 중간값 공개 검사 포함. 변경 JS/MJS 13파일 구문 및 diff 검사 통과.
- 실제 390×844의 29해설 전체 재생·터치·잘림·자막과 그림 정밀 동기화는 **NOT_RUN / QA_PENDING**이다. Board·좌표 검사로 전체 시각 품질 PASS를 주장하지 않는다.

**점과 직선 구현 기록:** 실제 카탈로그·HTML 모듈 24장면과 63해설이 일치한다(직선·반직선·선분 8장면/23해설, 시계·각·수선 8/19, 입체·중점 8/21). 선의 동일성·공통부분·개수, 시침/분침/사잇각, 맞꼭지각·방정식·수선의 발/최단선분/거리, 입체의 교점·교선, 중점의 정·역방향 질문을 나눴다. 해설 첫 상태의 실제 문제 seed와 주어진 값을 고정하며 첫 화면 질문도 해당 원본문항에 연결했다. 이전 드래그 좌표·수동 답안·접두사 상태가 해설 도형이나 단계를 바꾸지 않게 했다. 기존 공통 키트와 직접 해 보기는 유지했다.

- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-points-lines*.test.mjs apmath/playground/next/tools/g7-points-lines-*.test.mjs` → **120/120 통과, 실패·skip 0**. 무필터 validator, 직선/반직선 좌표 중복 제거·입체 topology·교선 방정식·시계 바늘 방향·중점/거리/비/방정식 검산, 실제 Board 진입·첫 cue·결론 189개 상태와 첫 움직임·중간값 공개 검사를 포함한다. 기존 시계·초기 도형·화면 맞춤의 소스 회귀도 유지했다. 변경 JS/MJS 13파일 구문 및 diff 검사 통과.
- 원본 b1-3의 고정 seed와 보기·그림이 일치함을 확인했다. 별도의 문항 수학 수정은 필요하지 않았다. 실제 390×844의 63해설 전체 재생·터치·잘림·자막/그림 정밀 동기화는 **NOT_RUN / QA_PENDING**이다. 소스·Board 검사를 화면 품질 PASS로 대체하지 않는다.

**공간 위치 관계 구현 기록:** 실제 카탈로그·HTML 모듈 27장면과 62해설이 일치한다(꼬인 위치 7장면/16해설, 공간 명제·수직과 평행 10/20, 평면 조건·전개도 10/26). 기준 모서리별 개수와 두 모서리 판별, 개념의 조건/반례와 실제 5보기 문제, 직선·평면 수직 조건과 입체 개수 문제, 평면의 조건과 정해지는 개수, 전개도의 모서리·면 질문을 구분했다. 실제 원본 문제 객체·보기 순서·도형·카메라를 첫 상태에 고정하고 이전 문제의 review 모드와 tick이 해설을 덮지 않게 했다. 직접 해 보기와 공통 kit는 유지했다.

- 원본 최소 수정: 사다리꼴기둥 s1-3의 ‘긴 밑변’ preset이 존재하지 않는 `AD` 키 때문에 AB로 대체되던 문제를 실제 키 `DA`로 수정했다. 새 해설의 수치와 연장 교점은 해당 기준 모서리의 실제 좌표로 검산했다.
- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-spatial*.test.mjs apmath/playground/next/tools/g7-spatial-geometry.test.mjs` → **102/102 통과, 실패·skip 0**. 무필터 validator, 별도 연립·벡터·공면 집합 계산으로 모서리 관계/명제/평면 개수 검산, 접힌 전개도의 변 길이·문자 결합·면 법선 검산, 실제 Board 진입·첫 cue·결론 186개 상태와 첫 움직임·중간값 공개 검사를 포함한다. 기존 기하·수동 전환 13검사를 유지했다. 변경 JS/MJS 15파일 구문 및 diff 검사 통과.
- 실제 390×844의 62해설 전체 재생·터치·잘림·자막/그림 정밀 동기화는 **NOT_RUN / QA_PENDING**이다. 390폭 VM draw와 좌표 검산은 실제 모바일 시각 품질 PASS가 아니다.

**작도와 합동 구현 기록:** 실제 카탈로그·HTML 모듈 23장면과 70해설이 일치한다(작도·삼각형 조건 8장면/23해설, 결정·합동 조건 8/23, 대응·숨은 합동 7/24). 작도 도구/순서, 삼각형 범위·정수 개수·최댓값·최솟값, SSS/SAS/ASA와 SSA 반례, 대응점·변·각, 정삼각형·정사각형의 길이·각도 질문을 구분했다. 첫 상태에서 실제 문제 객체와 개념/문제 모델을 선택하고, 원본 질문과 모든 보기를 유지했다. 기존 review 보간·문제 키 변경이 해설을 덮지 않으며 계산 결과는 마지막 장에만 공개한다.

- 네 개의 개념을 분리해야 하는 장면에는 별도 키트 PR #1762를 먼저 병합했다. 작도 내용 PR에서는 공통 kit를 다시 수정하지 않는다. 기존 탐구·직접 해 보기 기능을 유지했고, 답인 합동식이 들어 있던 일부 장면 제목은 중립적인 제목으로 바꿨다.
- 최소 실행: `node --test --test-reporter=tap apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-construction*.test.mjs apmath/playground/next/tools/g7-construction-*.test.mjs` → **141/141 통과, 실패·skip·cancelled 0**. 무필터 validator, 독립 거리·각도·회전·반사·헤론·정수 열거와 실제 보기 조건 검산, 실제 Board 진입·첫 cue·결론 210상태, 첫 움직임·단계별 계산 공개·이전 수동 상태 격리 검사 포함. 기존 기하·초기 화면 좌표·정리 자막 회귀도 유지했다. 변경 JS/MJS 15파일 구문 및 diff 검사 통과. TAP SHA-256 `97d6c43b271ced9f6b5e16317553a87c3a4b9cf7c882ff43a764d449d6cecd17`.
- 실제 390×844의 70해설 전체 재생·터치·잘림·자막/그림 정밀 동기화는 **NOT_RUN / QA_PENDING**이다. 추가한 한 장면 브라우저 시작 시도는 환경의 `socket() failed: Operation not permitted`로 Chromium 시작 전에 종료됐으며 PASS로 간주하지 않는다. 소스/Board/생성된 버튼 핸들러 검사는 실제 모바일 전수 검수를 대신하지 않는다.

### 5-4. 키트 보완 목록 (각각 별도 PR, 테스트 포함)

| # | 내용 | 이유 |
| --- | --- | --- |
| K1 | `lesson-browser-audit`의 진입 화면 검사가 **그림 속 글자**(canvas `fillText`, 측정용 그리기 제외)와 칩·상태 줄까지 읽어 정답 노출을 잡게 한다. 재생 중 조기 노출 검사와 같은 방식 | 원과 부채꼴에서 진입 화면에 정답이 그려진 4개 장면을 감사가 통과시켰다 |
| K2 | `tab:'review'` 해설의 진입 화면을 키트가 기본으로 정리 탭 0단계 그림으로 그리게 한다 | 지금은 장면마다 `lessonEntry` 처리를 따로 넣고 있다 |
| K3 | 정리 탭 해설이 `s.dragging`을 쥐면 장면 `tick`이 멈춘다. 값 끌림만 막고 `tick` 보간은 살리는 방법(별도 표시)으로 바꾼다 | `tick`으로 보간하는 장면(f02)이 재생 중 단계 변화를 따라가지 못해 장면마다 우회하고 있다 |
| K4 | **MAIN_MERGED · [PR #1781](https://github.com/icefoxtail/AP------/pull/1781)** — cue `pin: true`의 수식을 최근 3줄까지 유지. 이전 줄은 흐리게, 세로 태블릿 700~1024px은 수식·자막 두 열. 핀 없는 기존 해설은 같은 배치 유지 | §7 고등 수식 전개에 필요. core·Player·기존 두 실험실 VM 최소 검사 64/64, 실제 화면 QA는 NOT_RUN |
| K5 | 넓은 화면(860px 이상)에서 탐구 패널의 결론이 ▶ 전에 보이는 장면의 처리 | 사용자 결정 필요. 결정 전에는 손대지 않고 사례만 모은다 |
| K6 | 360px 폭에서 버튼 2개 + 「직접 해 보기」가 두 줄로 넘어감 | 가려지는 것은 없다. 낮은 우선순위 |

키트를 고칠 때의 조건: 단일 영상(쇼츠) 동작과 해설 없는 장면의 화면은 그대로여야 한다. `tools/video.test.mjs`에 음성 사례를 추가한다. 두 실험실 이상의 `scene-smoke`와 `lesson-audit`가 통과해야 한다.

## 6. 중2·중3

대상: `g8-triangles`, `g8-quadrilaterals`, `g8-similarity`, `g8-pythagoras`, `g9-trig-ratio`, `g9-circle`.

**중1과 다른 점 (2026-11-10 실측, 11-11 코드 재확인):** 풀이(정리) 탭이 탐구 화면과 **다른 숫자의 문제**를 그린다. 예: `g8-pythagoras`의 `py2-euclid`는 탐구에서 3-4-5 그림인데 정리 탭은 문제 조건 객체 `s.pyQ`의 문제(빗변 20 등)를 그린다(`g8-pythagoras/core.js`의 `qState`). 슬라이더 값을 바꿔도 고정 문제의 풀이 그림은 바뀌지 않아야 한다.

**방식:** 해설은 풀이 탭 그림을 쓰되 **문제를 t=0에 고정**한다. `g8-pythagoras`는 실제 문제 조건 객체 `pyQ`와 seed를 첫 장 `at:0`의 `set`에 둔다. `g8-triangles`는 별도 `pyQ`가 없고 `D.model(s)`와 `D.prob(M,s)`가 `tr*` 수치와 `trV`·`trQi`를 직접 읽으므로 해당 원본 조건을 첫 `start`/`set`에 고정한다. 움직일 값은 `start`/`to`로만 제어해 같은 키의 고정 `set`이 움직임을 덮지 않게 한다. 자막의 수는 그 문제의 수다. 진입 화면도 같은 문제의 0단계 그림이어야 한다(K2가 들어가기 전에는 장면에 `lessonEntry` 처리).

**선행 작업 (첫 PR 전에):**

1. `g8-pythagoras` 한 실험실로 시범을 만든다(개념 1 + 유형 2). 확인할 것: 문제 고정이 다시 보기·해설 전환에서 유지되는지, 「새 문제」 난수가 해설에 끼어들지 않는지, 원본 그림의 진행값이 재생 중에 실제로 움직이는지(K3 관련). 최신 피타고라스에는 `stepT`가 없으므로 없는 보간 기능을 검사했다고 주장하지 않는다. `stepT`가 있는 다음 실험실에서는 해당 보간을 별도로 연결·확인한다.
2. 풀이 흐름은 탐구 → 문제 → 풀이 탭이다. `g8-triangles` 등은 `SV.draw(..., stepIndex)`를 쓰지만, 최신 `g8-pythagoras`는 `D.draw`와 `C.answer`/`C.calculation`을 직접 사용하므로 실제 원본에 맞춰 연결한다. 문제 탭의 보기 선택(`[data-py-pick]` 등)은 해설이 건드리지 않는다.
3. 과거 `py5-sqarea`의 문제 97/해설 35 불일치 기록은 최신 main `87b09c58...`에서 재현되지 않았다. 탐구 기본값은 20+15=35이며, 원본 생성 범위의 `pyQ:{pyS1:49,pyS2:48,pyUnk:'c'}`를 고정하면 문제 모델·질문·정답 보기·풀이 단계는 모두 97로 일치한다. 원본 계산을 재수정하지 않고 신규 해설에서 같은 `pyQ` 결속을 검사한다.
4. 합동 장면: 두 삼각형이 겹쳐 있으면 대응 관계가 안 보인다. 두 삼각형을 떼어 놓고 대응변·대응각을 같은 색·같은 표시로 맞춘 그림이 해설의 핵심이다.

**2026-11-11 시범 최소 확인:** `py1-sq` 개념·`py1-leg` 문제·`py2-euclid` 문제 3개 해설을 먼저 작성하고 독립 계산 및 실제 HTML/production Board 검사 **4/4**를 통과했다. 첫 움직임, 계산 단계 공개, 고정 `pyQ`, 다시 보기·해설 전환·실제 숫자 바꾸기 click handler 후 원래 조건/그림 복원, legacy tick 비개입을 확인했다. 실제 브라우저 전수 품질 검수 결과가 아니며 모바일 QA는 NOT_RUN이다. 같은 방식으로 총 37장면 안의 남은 34장면과 추가 질문을 확장한다. 원본에 있는 정확한 유리수 답은 보존하고 새 제곱근 표기나 부정확한 반올림은 추가하지 않는다.

**2026-11-11 전체 구현 최소 확인:** 총 **37장면/87해설**(t1·t2 11/24, t3·t4·t5 15/34, t6·t7·t8 11/29)을 구현했다. 기존 video 검사와 피타고라스 원본/신규 검사를 합쳐 **151/151**, JS/MJS 구문 **17파일**, HTML·카탈로그·등록 누락 0, production Board 진입/첫 cue/결론 **261상태**를 확인했다. 원본 문제·5보기·고정 조건 객체와 해설을 결속하고 실제 새 문제 처리 뒤 다시 보기에도 이를 복원한다. 접기 해설에서 직접 해 보기로 돌아간 뒤 탐구 슬라이더가 고정 문제까지 바꾸던 회귀와, 첫 cue가 기존 보기 선택을 지우던 회귀를 수정했다. 정수·유리수·제곱합·넓이·최단거리의 원본 수학 및 답 공개 시점을 검사했다. 실제 모바일 전수/독립 시각/장면별 브라우저 정밀검수는 **NOT_RUN / QA_PENDING**이다.

피타고라스 운영 병합·Pages 확인 시도 후 `g8-triangles` → `g8-quadrilaterals` → `g8-similarity` → `g9-trig-ratio` → `g9-circle`을 실험실 단위로 진행한다.

**삼각형의 성질 연결:** 원본 `SV.draw`/`SVK`/`SVB.runner`와 장면 모델을 재사용한다. 해설 진입 및 0단계는 풀이 index −1로 그려 주어진 조건만 먼저 보이며, 해설의 `start`/`to`가 이동을 담당하고 legacy `tick`은 해설 동안 상태를 덮지 않는다. 원래 `stepT` 기반 수동 움직임은 해설 밖에서 유지한다. 실제 선택지는 질문에 보존하되 `t3-3`의 단일 빈 `t`와 `p` 답 데이터는 답 입력용 항목이므로 보기로 노출하지 않는다. `trPick`·`trShow`는 재생 cue가 지우거나 선택하지 않는다.

**삼각형 전체 최소 확인:** 43장면/165해설(t1~t3 17/59, t4~t5 13/49, t6~t7 13/57) 구현, 통합 Node 검사 **171/171**·JS/MJS 구문 **16파일**·등록 누락 0·production Board 진입/첫 cue/결론 **495상태** 확인. 합동 조건과 반례를 분리하고 원본 수치·보기와 고정 입력을 결속했다. 첫 set이 각도 이동을 덮는 충돌, 계산값과 자막 cue의 어긋남, 첫 제목의 직접 답 공개를 최소 보완했다. 원본 내심의 수선발이 이등변 조건에서 중점이 될 수 있는 예외도 수정하고 실제 원본 회귀를 확인했다. 전수 모바일·독립 시각·실제 브라우저 장면별 정밀검수는 NOT_RUN / QA_PENDING이다.

**사각형 복구·구현(2026-11-11):** 기존 원격 `2926398a88f24713eb8645aaddae4f5f6ad85df6`의 7개 커밋과 23장면/106해설을 보존하고 최신 main `aeef4eb029f9aadfa30aaa49080bff92efa3d7e5`를 충돌 없이 병합했다. 누락은 정확히 `q2-1`~`q2-9`였으며 별도 `lesson-d.js`에 27해설을 추가하여 **32장면/133해설**을 연결했다. 평행사변형의 다섯 조건·내접 평행사변형·대각 조건 증명·다섯 반례를 원본 질문과 고정 상태로 설명한다. 기존 미추적 B 검사 파일도 복구했다. 전체 등록/validator·진입/첫 cue/결론 399개 source Board 상태·숫자 바꾸기 뒤 원문 조건 복원을 통과했다. 최소 Node 검사 109/109·JS/MJS 구문 17파일이 통과했다. 기존 평행사변형 20해설도 원본 정답과 독립 길이/각/넓이 계산으로 확인했다. 실제 모바일·독립 시각검수는 NOT_RUN / QA_PENDING이다.

**닮음 구현·최소 확인(2026-11-11):** 실제 카탈로그와 HTML 로더의 **39장면/144해설**(개념 49, 원본 문제 예시 95)을 연결했다. t1~t3은 17/65, t4~t5는 11/44, t6~t8은 11/35이며 누락은 없다. 원본 `smPk`와 seed를 재생 시작에 고정하고 대응변·넓이/부피·SSA·접기·평행선·중점·내외각 이등분·직각삼각형·측량·무게중심을 별도 버튼으로 설명한다. 원문 보기와 수동 탐구를 유지하며 기존 `tick`은 해설 타임라인을 덮지 않는다. 전체 validator 오류/경고 0, 최소 Node 검사 **108/108**(실패·skip·cancelled 0), JS/MJS **18파일** 구문과 diff 확인을 통과했다. 실제 source Board의 처음 움직임·회전·고정 문제·최종 답과 좌표 기반 길이/넓이/부피를 검사했다. 실제 숫자 바꾸기 click handler 뒤 원문 복원 및 기존 선택 보존도 확인했다. SSA 교점 수의 조기 노출을 막고, 좁은 화면에서 항상 닮은 도형의 정답 표시가 원본 두 열 간격을 따르도록 한 줄 보완했다. TAP SHA-256 `fdc7e1219cc24ccb322961f010213c802b8ceb62503e9297e9433861d645f8f3`. 전수 모바일·독립 시각검수는 **NOT_RUN / QA_PENDING**이다.

**삼각비 구현·최소 확인(2026-11-11):** 카탈로그와 실제 HTML 로더에 **51장면/245해설**(개념 74, 원문 예제 171)을 연결했다. 뜻·특수각·사분원·삼각비표 19/111, 길이·높이·거리 15/69, 삼각형/사각형 넓이·입체·결합도형 17/65이며 누락은 없다. 원본 생성기의 고정 문제 객체와 보기 순서를 묶어 다시 재생해도 같은 도형과 조건이 유지된다. 근호·분수·π·표의 반올림 값과 각/변 대응을 독립 계산으로 대조했다. 실제 HTML 및 production Board의 첫 움직임·단계·접기·미지 길이/각의 결론 공개를 확인했으며 A 888, C 552 cue/end 상태와 B 69해설의 모든 cue를 검사했다. validator 오류/경고 0, 통합 최소 검사 **136/136**(실패·skip·cancelled 0), JS/MJS 구문 **22파일**, diff 확인이 통과했다. 해설 초기 step 잔존, 자막의 근호/삼각함수 TeX, 반올림으로 인한 첫 움직임 지연을 수정했다. 원본 탐구와 수동 풀이를 유지했고 공통 재생 키트는 수정하지 않았다. 동일 seed 후보 목록을 재사용해 중복 원본 생성을 1,277회에서 647회로 줄였으며, source VM 단회 측정은 약 8.0초에서 4.3초로 줄었다(브라우저 성능 수치 아님). 245개 고정 문항과 보기 순서의 변경 전후 SHA-256 `970c4ea29dd2685da0f23d8f5921fe0b5f7ead25ed177c98cf665337bed56578`가 일치한다. 후보 재사용의 첫 일치 문항 보존과 예외 뒤 난수 복원도 검사했다. 최신 main `b2bb563b0953daf8b02e73cc0183996e1cfd027a`의 별도 Archive 6파일은 범위가 겹치지 않아 충돌 없이 반영했다. 전수 모바일·장시간 브라우저·독립 시각검수는 **NOT_RUN / QA_PENDING**이다.

**공통 Pages 상태(2026-11-11 추가 확인):** 공개 `_archive-release.json`의 실제 소스는 `fb27d05ee921da9534d9fff332ac774d732b91cf`이며 마지막 실제 배포는 [42966828800](https://github.com/icefoxtail/AP------/actions/runs/42966828800)이다. 후속 [Pages 42970224073](https://github.com/icefoxtail/AP------/actions/runs/42970224073)은 workflow success라도 deploy가 skipped여서 신규 공개 증거가 아니다. 직전 [등록 writer 42974755265](https://github.com/icefoxtail/AP------/actions/runs/42974755265)는 `reviewedFinal / FINAL_CONSUMER / assignment_missing`으로 `publishable:false`였고 다음 writer들이 대기/실행 중이다. 사각형 코드의 확정 결함과 분리하며, 등록/보호 검사를 우회하지 않는다. 실제 HTML/영수증이 갱신되기 전까지 해당 실험실은 PAGES_NOT_VERIFIED다.

## 7. 고등

대상(카탈로그 `course`): 공통수학 10, 대수 8, 미적분Ⅰ 8, 기하 9, 확률과 통계 3.

**구조 (실측):** 실험실 하나가 28~312KB 단일 HTML이다. 전부 `stagedReveal: true`라 장면에 들어오면 0단계로 시작한다. 단계 표시는 `stepOf` 같은 도우미가 `lab.tab`으로 가른다(탐구 탭은 전부 표시, 풀이 탭은 `s.step`). `varier`의 「새 문제」는 난수이고 첫 문제가 원 기출이다. `examData`를 가진 실험실(미적분Ⅰ 8개 전부, 기하 다수)은 문항·단계·풀이를 문자열로 갖고 있다.

**장면 성격에 따라 방식이 다르다:**

| 성격 | 실험실 | 방식 |
| --- | --- | --- |
| 그래프 움직임 중심 | calc1-tangent·limits·integral·motion·derivative-shape, alg-unit-circle·explog, common-rational·transform·quadratic, 기하 이차곡선·벡터·공간 | 중1과 같다: 상태값 `to` + 자막. 할선→접선처럼 이미 `tick` 애니메이션이 있는 장면은 자막만 얹으면 된다 |
| 수식 전개 중심 | alg-sine-cosine-law·trig-geometry·sequence·exp-deep·log-deep, common-coord·counting, prob-counting·probability | **K4(고정 수식 줄)가 먼저 필요하다.** 논리 단계를 줄이려고 중간 식을 생략하지 않는다. 원 해설의 단계 수 ≤ 해설의 자막 수 |
| 제외 | prob-stats의 표본 누적 장면 등 난수 장면 | 재생마다 결과가 달라진다. 시드 고정 전에는 만들지 않는다 |

**고등 규칙:**

- 한 해설 4~6장, 60~90초. 6장을 넘으면 길게 만들지 않고 소문항 단위로 해설을 나눈다(버튼 라벨 (1)·(2) 또는 구하는 것 이름).
- 수식이 2개 이상인 자막은 4초 이상.
- 해설은 항상 첫 문제(원 기출)에 고정한다.
- 풀이 탭이 탐구와 다른 변형을 그리는 실험실이 있다(예: `common-rational` r1은 탐구 y=4/(x−2)+1, 풀이 y=−2x/(x−2)). §6과 같은 방식으로 문제를 고정한다.
- 모듈 변수가 `lab.s`를 가리키는 이식 구조(`alg-unit-circle`, `geom-vector-ops`)는 외부에서 상태를 바꿔도 그림이 따라오는지 먼저 확인한다.
- `high-lab-browser-audit`는 풀이 단계의 조기 공개(`early-staged-solution-disclosure`)를 검사한다. URL에는 이미 `manual=1`이 들어 있다.

**선행 작업:** 유형이 다른 3개로 시범을 만든다 — 그래프형 `calc1-tangent`, 수식 전개형 `alg-sine-cosine-law`(K4 필요성 판단), 격자점형 `common-rational`의 r4. 시범에서 형식이나 키트가 바뀌어야 하면 키트 PR을 먼저 올린다. 그 뒤 과목 순서: 공통수학 → 대수 → 미적분Ⅰ → 기하 → 확률과 통계.

**2026-11-11 고등 진입 재확인:** 최신 중등 완료 main `41a2cc430ee7f2c297d771587dee61e065b72df4`에서 세 시범의 실제 구조를 확인했다. `calc1-tangent`는 7장면, `alg-sine-cosine-law`는 18장면, `common-rational`은 4장면이다. K4는 별도 [PR #1781](https://github.com/icefoxtail/AP------/pull/1781)에서 main `680a4ba47ff54646a46dd0b56f3f2ca2e86cf4bc`로 병합했다. 키트 3개 운영 파일은 이전 내용이어서 PAGES_NOT_VERIFIED이며, 이 main에서 `feat/lessons-calc1-tangent`를 시작했다. 동일 해설 브랜치·PR은 없었고 기존 구조 개선 PR #1494는 이미 병합되어 재작성하지 않는다. 앞 두 실험실의 실제 문항 화면은 기존 `ouUpgrade` / `SPEC`을 읽으며, `varier` 클로저의 첫 패킷을 해설 전용으로 선택해 수동 새 문제를 보존한다. `common-rational/r4`의 첫 원문은 최솟값으로 계수를 구하는 문제이며 격자점 문제가 아니다. 첫 원문 해설을 유지하고, 격자점 시범은 원본 탐구의 고정 초기 상태를 별도 개념 버튼으로 만든다. 난수 격자점 변형을 첫 원문으로 표시하지 않는다.

**알려진 장면 오류(해설을 얹기 전에 처리):** `calc1-integral`의 `signed` 장면 해설 식(F = x²/3 − x로 적혀 있으나 x³/3 − x²이어야 함), 분수 조판 미완(alg-trig-geometry 12, geom-parabola 8, common-functions 1). 근거: `docs/guides/APMATH_G7_EXAM_VIDEO_HANDOFF_CURRENT.md`.

**이번 범위 밖:** Archive 기출 문항에 해설을 붙이는 연동. 별도 지시가 있을 때 한다. 원칙만 적는다: 실제 학교 기출만 쓰고, 원본 기출 JS에 필드를 추가하지 않으며(해시 고정값), 인쇄·쪽 나눔 레이아웃에 영향을 주지 않는다.

## 8. 해설 작성 기준 · 긴급 출고 최소 게이트 · 후속 품질검수

**수학·형식 규칙은 유지한다. 전수 시각 검수의 '시점'만 운영 이후로 옮긴다.**

- 구성: **조건 → 풀이 전략/과정 → 결론**. 원본 `question`·`steps`·`rule`·수학 공식·상태 계산을 근거로 한다. 개념·기본·심화에 맞게 무엇을 먼저 보고 왜 계산하는지 알려준다.
- 정답은 마지막 장에만 공개한다. 기호는 쓰기 전에 뜻을 알리고, 각 장 8~15초·자막 2~3줄·줄당 40자 이하, 해설 2~6장을 유지한다. 긴 해설은 자동으로 이어 재생한다.
- 첫 장의 `set`으로 변경하는 키는 `at:0`에 모두 초기화하고 `to` 키는 `start`에 초기값을 둔다. 첫 장은 실제 `to` 또는 `step`·`part` 변화가 있어야 하며 한 cue에 `to`+ `step`을 함께 두지 않는다.
- **긴급 RELEASE 최소 게이트:** 변경 코드 구문·실험실별 해설 validator·대표 수학 검산·장면 등록/로드 누락·확정 P0 확인. 이미 같은 코드 SHA에 연결된 PASS 로그는 중복 실행 없이 재사용 가능하다. 확인된 치명 오류가 있으면 수정 후 다시 검사한다.
- **후속 QUALITY(운영 뒤):** 모든 해설의 390×844 진입, 재생 전·장마다·끝 카드·다시 보기·직접 해 보기, 라벨·칩·자막 조기 공개, 모바일 터치/겹침/잘림, `manual=1` 탐구·정리·문제 전후 비교, 독립 수학·UX QA. 제보와 발견 결함을 별도 PR로 처리한다.
- **보고:** `IMPLEMENTED`, `MAIN_MERGED`, `RELEASED_QA_PENDING`, `QA_VERIFIED`, `BLOCKED_P0`를 구분한다. `NOT_RUN`은 이유를 적고 품질 PASS로 바꾸지 않는다.

## 9. 알려진 함정과 기록

- 2026-11-11 · 유리함수의 기존 source-only 초기화 계약 회귀를 수정했다. [CI 43018818401](https://github.com/icefoxtail/AP------/actions/runs/43018818401)의 `high-review-targets.test.mjs` fixture는 외부 해설 모듈 없이 HTML 본문만 실행한다. PR #1786의 무조건 `install` 호출 때문에 scope 단계가 실패한 것으로, Archive 오류나 무관한 기존 실패로 분류하지 않는다. 기존 tangent/사인·코사인법칙과 같은 optional guard 한 줄을 넣어 모듈 없는 환경에서도 수동 장면 초기화를 유지했다. 기존 검사 25개 + 유리함수 통합 6개 + video 41개 **72/72 PASS**, fail/skip/cancel 0, 실제 유리함수 Board/raw canvas 546 cue frames와 HTML 인라인 2개 구문 통과. 검사 대상 24파일의 전후 hash가 동일하며 검사 파일을 바꾸거나 완화하지 않았다. TAP SHA-256 `9b0e77359d15f6a24833451af4842d8b0420394c5708b8723ddd1c0277c32248`, manifest SHA-256 `2a5f19d600018516379167da438d9bcb87a33b4c59665a88b0f1eebbc4f61e65`. 별도 `fix/lessons-common-rational-bootstrap` PR에서 운영 반영하며 실제 브라우저·전체 CI PASS로 확대하지 않는다.

- 2026-11-11 · 다항식과 입체 [PR #1790](https://github.com/icefoxtail/AP------/pull/1790) **main 병합 완료**. 최종 head `85e08b60137cb1e864dc0f3325c247bf721ff84d`, merge/API·Git main `7348e5114857ce2ef9664ba2f51f712b477d4eb4`; ancestor 및 대상 7파일 차이 0 확인. 고등 누계 **4개 실험실·34장면/107해설**, 중등 포함 **20개·563장면/1,639해설**이다. 최소 검사 47/47·466 cue frames이며 병합 직전 CI 5개는 queued였다. 최신 main `5e380dd0018da20cc0cf774e026ece351bcc29a2`의 기존 Pages workflow dispatch용 파일 1개를 충돌 없이 반영했고 검사 manifest의 18파일은 최종 head와 동일하다. 실제 운영 비교는 0/4 일치: HTML 이전 파일, lesson-core/B 404, lesson-A는 503 후 한 번 재시도해도 503으로 미확인이다. 공개 source는 `fb27d05ee921da9534d9fff332ac774d732b91cf`, writer 43022184186 pending, 새 one-shot 43021443019 queued, fresh 조회한 최신 Pages 42970224073은 Deploy skipped다. **PAGES_NOT_VERIFIED / QA_PENDING**으로 유지하며 다음 이차함수 제작 전 위 유리함수 초기화 회귀를 좁게 보완한다.

- 2026-11-11 · `common-poly-solid` **5장면/17해설 구현 완료**(개념 12·첫 원문 5). 정사각형 합/차의 제곱·제곱합, 정육면체 여덟 조각/가운데 여섯 조각/세제곱합, 직육면체 모서리/겉넓이/공간대각선/세 면의 넓이 제곱합, 절단 입체의 두 차/단면/원문, 두 기둥의 합/차/내분점 길이를 독립 버튼으로 나누었다. 5~6장/60~72초, 첫 원문 고정·수동 새 문제 보존·마지막 장 정답 공개. 기존 `apl-space.js`와 실제 원본 입체를 그대로 사용하며 첫 회전·조각 분리·면 강조를 자막에 연결했다. 최소 검사 **47/47 통과**(신규 실제 HTML 통합 6+기존 video 41), validator 오류·경고 0, 원문 5종 독립 수학 검산, 실제 Board **466 cue frames** 중 **392 native Space frames**. 정육면체 8조각/24면, 절단 공통 단면 및 모서리/겉넓이 차, 삼각기둥 실제 부피·2D 네 조각을 검증했고 manual/new/replay/entry 및 AP 숫자 공개 게이트를 확인했다. JS/MJS 5파일·HTML 인라인 2개 구문과 diff 검사 통과. 로그 SHA-256 `9b0142c36ff6a3ae2fc2aee08f434c8f7848c00350516a725704d38d2ae48a41`, manifest SHA-256 `5f1719e7cb2b3318fc32ea708b8510481e369573c95019d4ce0fa3b28891cc98`. 최초 validator의 자막 길이 1건을 축약해 수정한 뒤 위 최종 검사를 수행했다. 첫 원격 보존 head `0252f28b85fb7055561e27cf6efbf101b12c8172`에는 전체 17해설이 있다. 그 뒤 해설 모듈을 읽지 않는 기존 source-only 초기화 계약을 위해 optional install guard를 추가하고 위 최종 47개 검사를 다시 수행했다. 별도 source-only probe는 해설 모듈 0개에서 5장면 초기화와 guard 제거 시 오류 재현을 확인했다. 최종 PR/main/Pages는 다음 체크포인트에 기록한다. 공통 키트 추가 변경 없음, 실제 브라우저·전수 모바일·독립 시각 검수는 **NOT_RUN / QA_PENDING**이다.

- 2026-11-11 · 유리함수 [PR #1786](https://github.com/icefoxtail/AP------/pull/1786) **main 병합 완료**. 최종 head `29f48a56d3ca84a40850498a92ed5c5763ccdea0`, merge/API·Git main `b07a26bba6afde5dd00996dacb036ef6228668eb`; ancestor 및 대상 7파일 차이 0 확인. 고등 누계 **3개 실험실·29장면/90해설**, 중등 포함 **19개·558장면/1,622해설**이다. 최소 검사 47/47·546 cue frames이며 병합 직전 CI 5개는 queued였다. 운영 HTML은 이전 파일, 신규 lesson-core/a/b는 404로 0/4 일치하여 **PAGES_NOT_VERIFIED / QA_PENDING**. 공개 배포 source는 `fb27d05ee921da9534d9fff332ac774d732b91cf`, writer 43018929846은 pending이다. [AWCR r36](https://drive.google.com/file/d/11HzkVbqkCexmDL7uFyb2Ci0HWVw5m7ok/view) raw SHA-256 `3b76f1f65651a61cd37fcb7d6748668ad12eb123cee797f8da40f7d588f62e48`·16,186 bytes를 다시 읽어 검증했다. 검사 manifest의 17파일을 최종 원격 tree와 대조해 동일함을 확인했다. 다음 `common-poly-solid`는 이 main에서 별도 브랜치를 시작했다. 기존 해설 브랜치/PR은 없고 열린 PR 45개의 2,729개 변경 경로에도 대상 충돌이 없었다.

- 2026-11-11 · `common-poly-solid` 5장면은 기존 정사각형 조각·정육면체 조각·직육면체·절단 입체·삼각기둥 렌더러와 원문의 첫 문제를 보존하면서 제작 중이다. 개념 12개·첫 원문 5개, 총 17해설을 목표로 한다. 합·차의 제곱, 입체 부피/모서리/겉넓이/대각선은 별도 버튼으로 구별하며 완료 묶음부터 `feat/lessons-common-poly-solid`에 보존한다. 실제 3D 렌더러 검사는 후속 통합 검사에 결속하고 전체 브라우저/모바일/독립 시각 검수는 **NOT_RUN**이다.

1. **진입 화면에 정답이 보인다.** 탐구 탭 그림이 결론을 처음부터 그리는 장면이 많다. `s.lessonEntry`일 때 답 없는 상태를 그린다(견본: `g7-circle-sector/basic.js`, `periScene`).
2. **다시 보기에서 정답이 먼저 보인다.** 결과 표시를 켜는 상태값이 앞선 재생에서 남는다. 시작값 규칙이 막지만 직접 확인한다.
3. **답이 중간 값과 같은 문제**도 그 수치를 마지막 장 전에 노출하지 않는다. `answer`를 식 전체로 적는 것만으로는 조기 노출을 막지 못한다. 예를 들어 반원의 넓이와 최종 답이 모두 `9π/2`인 경우 앞 장에서는 미계산 식을 쓰고, 수치 계산은 마지막 장으로 옮긴다. 정답 문자열뿐 아니라 독립 계산한 최종 수치도 검사한다.
4. **연속 이동 중 소수**(점이 경계를 따라감)는 `snap`을 쓸 수 없다. 재생 중에는 정확한 값이 되는 지점에서만 라벨을 그린다.
5. **값을 움직이면 단계가 되돌아간다.** 값 이동이 끝난 칸에서 단계를 다시 지정한다.
6. **자막과 화면의 다른 표시가 어긋난다**(자막은 작은 부채꼴, 칩은 큰 부채꼴). 장의 움직임 구간을 장면의 표시 구간에 맞춘다.
7. **재생 직후 0.45초 동안 ▶ 클릭은 무시된다**(이중 탭 방지). 자동 검사를 짤 때 그보다 빨리 누르면 시간 초과가 난다.
8. **해설 브라우저 감사는 해설 하나에 3~4분**이라 CI에서 뺐다. 손으로 돌릴 때는 `--only`로 새 장면만 돌린다.
9. 넓은 화면(860px 이상)은 해설이 끝나면 탐구 화면으로 돌아간다. 휴대폰에서는 마지막 그림이 끝 카드·정답 줄과 함께 남는다.
10. 기존 결함이며 범위 밖: `g7-circle-sector`의 sectorSpec 장면들(1209·1609·1610·1808·1210)의 좁은 화면 `initial-geometry-framing-changed`(약 1~2px).

**견본 (main)**

- 두 버튼·정리 탭 해설: `labs/g7-surface-volume/lesson.js`(`sv1-1` 겉넓이·부피).
- 유형 해설: `labs/g7-surface-volume/lesson-more.js`의 `sv4-1`(회전체: 어느 변이 축인지부터), `sv2-4`(원뿔대: 큰 부채꼴 − 작은 부채꼴), `sv2-5`(각뿔대: 결과 줄을 결론까지 숨김).
- 상태값 하나를 움직이는 개념 해설과 결론 라벨 숨김: `labs/g7-circle-sector/lesson.js`(`z3-sectorProof`), `labs/g7-circle-sector.html`의 `lessonOn`·`csShowS`.
- 정리 탭 그림에 단계별 라벨 추가: `labs/g7-surface-volume/t1.js`의 `volLabels`, `solid3d.js`·`dims.js`의 `lessonHide`.

**진행 기록** (2026-11-11 긴급 RELEASE 정책 전환 이후엔 구현·운영 병합·배포·후속 QA 상태를 구분해 기재)

- 2026-11-11 · 고등 세 번째 시범 `common-rational` **4장면/19해설 구현 완료**(개념 15·첫 원문 4). 평행이동·점근선/범위·분수꼴·부호, 대칭·최단거리, 회전/평행이동/수평·수직선, 구간 최대·최소/점근선/제외점/격자점을 나누었다. 각 해설은 5~6장/60~72초이며 첫 원문 객체와 원래 탐구 상태를 구별하고 수동 새 문제를 보존했다. 격자점은 원본 탐구 초기 조건을 고정해 설명한 열부터 점·개수를 표시하며, 맨 위 경계점도 포함하는 해설 전용 화면 범위를 적용했다. 종료·장면 전환 뒤 기존 focus/zoom/pan을 복구한다. 최소 검사 **47/47 통과**(신규 실제 HTML 통합 6+기존 video 41), validator 오류·경고 0, 원문 4종 독립 수학 검산, 실제 Board/raw canvas **546 cue frames**, 곡선 위 추적점·정답 공개·진입/다시 보기·수동 문제 복구·격자점 41개를 확인했다. JS/MJS 5파일·HTML 인라인 2개 구문과 diff 검사 통과. 최종 로그 SHA-256 `326bb22590ee0d0c31a689138795b35f385664c4c71ab042823f23e311b74850`, manifest SHA-256 `cffdb0682c9a9459f3674f6a044e4c634d5973a1fdf7f4435072f20a2f288da6`. 최초 검사의 summary 길이 2건은 문구를 줄여 수정했고 실패 기록도 보존했다. [AWCR r35](https://drive.google.com/file/d/1mQ9_xCXQq1AnpY3GVYu9whnnujLZh3AU/view) raw SHA-256 `04e40cfcdb1d58f5ff1d222984e80d9ce3da3c2dad7bb8696a84360d9c2bd13b`·13,237 bytes를 다시 읽어 검증했으며 이 revision은 중간 원격 head `060e675b15517c261dd6ff7a8c21b63899b0aa27`의 r1/r3 2장면/9해설에 한정한다. 이후 main `c274ae5fad15c6fd15826e351fa2bc6f12bede13`의 별도 Archive 상태 기록을 충돌 없이 반영했다. 최종 PR/main/Pages는 다음 체크포인트에 기록한다. 공통 키트 추가 변경 없음, 실제 브라우저·전수 모바일·독립 시각 검수는 **NOT_RUN / QA_PENDING**이다.

- 2026-11-11 · 사인·코사인법칙 [PR #1784](https://github.com/icefoxtail/AP------/pull/1784) **main 병합 완료**. 최종 head `e72020e37c5ffac9dce60a1cedcdec5524f4442c`, merge/API·Git main `f30aaecf76d61a0a2a5c5a6d827c9d488af7dda5`; ancestor 및 대상 7파일 차이 0 확인. 고등 누계 **2개 실험실·25장면/71해설**, 중등 포함 **18개·554장면/1,603해설**이다. 최소 검사 47/47·1,188 cue frames이며 병합 직전 CI 5개는 queued였다. 최신 main의 별도 Archive PR #1772 변경 8파일도 충돌 없이 정상 병합했고 해설 검사 manifest의 17파일은 최종 head와 동일했다. 운영 HTML은 이전 파일, 신규 lesson-core/a/b는 404로 0/4 일치하여 **PAGES_NOT_VERIFIED / QA_PENDING**. 공개 배포 source는 여전히 `fb27d05ee921da9534d9fff332ac774d732b91cf`, 최신 writer 43016333553은 pending이다. [AWCR r34](https://drive.google.com/file/d/1N4EerCb8wb7vaPQqWwUBrM2Lss7jM9QJ/view) raw SHA-256 `84b79455bd525a092568738701ad37bd96477443c0215d98def84ab8e4afc5b0`·13,892 bytes를 다시 읽어 검증했다. 다음 `common-rational`은 이 main에서 별도 브랜치를 시작했다. 기존 해설 브랜치/PR은 없고 열린 PR 44개의 2,727개 변경 경로에도 대상 충돌이 없었다.

- 2026-11-11 · 고등 수식형 시범 `alg-sine-cosine-law` **18장면/45해설 구현 완료**(개념 18·첫 원문 소문항 27). 기본 8장면/20해설, 심화·확장 10장면/25해설이며 각 해설은 5~6장/60~72초다. 원본 `mkVar`/`varierL`의 첫 패킷과 실제 탐구·문항 도형을 사용하고, 다른 답을 묻는 소문항은 별도 버튼으로 나눴다. K4 수식 줄을 재사용하며 원본 그림에서 일찍 보이던 선택 소문항의 답만 마지막 장까지 숨긴다. 원주각의 두 호 비교는 장 경계에서 별도 위치로 옮겨 퇴화점을 통과하지 않게 했다. 최소 검사 **47/47 통과**(신규 실제 HTML 통합 6+기존 video 41), validator 오류·경고 0, 첫 원문 18종 독립 수학 검산, 실제 Board/raw canvas **1,188 cue frames**, 원문 27개 답의 공개·재시작·수동 새 문제 복구와 실제 원본 변 위의 첫 움직임을 확인했다. JS/MJS 5파일·HTML 인라인 2개 구문과 diff 검사 통과. 최종 로그 SHA-256 `607c0c84b42ce4b5eca66fa6f40e8ad424bb2825148d41da4229998afd1b0a5f`; 파일별 검증 manifest SHA-256 `211d06b10b5b8f77eb85476da17cf8c7d99ff8dc66a21ef2fe7f8d08aa09e6b1`. 공통 키트 추가 변경 없음. [AWCR r33](https://drive.google.com/file/d/1NYC4oRs1JBwCyUpPvVDFzcY53Cslgn2X/view)의 raw SHA-256 `1dfb88446db294dc0ea7d583c97d502b85d9ab0f38d2b104359411d57ab0b5b0`·11,088 bytes를 다시 읽어 검증했으며, 이 revision은 중간 head `a915bded705c5a0078fbeb3c09540256f2d50d66`의 14장면/36해설에 한정한다. 이후 main `db0b51d64e3f63402150ecabca8ae12cff8e9c44`의 별도 Archive 상태 기록만 충돌 없이 병합했다. 최종 PR·main·Pages 결과는 다음 체크포인트에 기록한다. 실제 브라우저·전수 모바일·독립 시각 검수는 **NOT_RUN / QA_PENDING**이다.

- 2026-11-11 · 고등 접선과 미분계수 [PR #1782](https://github.com/icefoxtail/AP------/pull/1782) **main 병합 완료**. 최종 head `d538d278f7303ea264aa02d75647ddd5fe752de9`, merge/API·Git main `1e5c92ffd6beabd3225053f6ad35f8f25898522e`; ancestor 및 대상 5파일 차이 0 확인. 고등 누계 **1개 실험실·7장면/26해설**, 중등 포함 **17개·536장면/1,558해설**이다. 최소 검사 47/47·726 Board cue frames이며 병합 직전 CI 5개는 queued였다. 운영 HTML은 이전 파일, 신규 lesson.js는 404로 0/2 일치하여 **PAGES_NOT_VERIFIED / QA_PENDING**. 공통 배포는 별도 Archive 등록 요청의 assignment_missing 때문에 publishable=false로 중단되어 있으며 검사·보호를 우회하지 않는다. [AWCR r32](https://drive.google.com/file/d/1I9J-3TmmJup-Dlp-YpwxEbsqr6JLtTe_/view) raw SHA-256 `7c1070651deda0978030c0ce8a796394be2ce6fd46faad1fcda8f13180c33fd3`·11,537 bytes를 다시 읽어 검증했다. r32에는 이전 r31의 로컬 로그가 3장면 스냅샷이 아닌 5장면 스냅샷에 해당한다는 근거 범위 정정도 포함했다. 다음 수식형 시범은 `alg-sine-cosine-law` 18장면이며 이 main에서 별도 브랜치를 시작했다.

- 2026-11-11 · 고등 시범 `calc1-tangent` [PR #1782](https://github.com/icefoxtail/AP------/pull/1782) **7장면/26해설 구현 완료**(개념 17·첫 원문 소문항 9). 각 해설 5~6장/60~72초이며 K4 수식 줄을 사용한다. 실제 `ouUpgrade`/확장 장면의 첫 패킷을 함수·유리수 객체 그대로 보존하여 문항·풀이·그림에 함께 선택하고, 수동 새 문제와 탐구 조작은 유지한다. 평균변화율/극한, 접점/최단거리는 별도 버튼이다. 할선과 극한 보조점은 첫 자막에 맞춰 0.15초부터 드러나며, 불가능 조건의 하한 이동도 기존 슬라이더 범위 안에 둔다. 탐구와 원문의 함수가 다른 절편/기울기 범위는 조건·그림·해설을 구별했다. 최소 검사 **47/47 통과**(신규 통합 6+기존 video 41), validator 오류·경고 0, 원문 7종 독립 수학 검산, 실제 Board 726 cue frames의 유한 좌표·도형 존재·첫 움직임 및 원문 9개 해설의 정답 공개/재시작/수동 문제 복귀를 확인했다. JS/MJS 3파일·HTML 인라인 2개 구문과 diff 검사 통과. 로그 SHA-256 `577c16fd3a78ef9f503c6246607057ea9a80bdf1df9dfe5a68dcd111956f7f79`. 공통 키트의 추가 변경은 없고 실제 브라우저·전수 모바일·독립 시각 검수는 **NOT_RUN / QA_PENDING**. `feat/lessons-calc1-tangent`에서 의미 있는 단위마다 원격 보존하며 최종 PR/main/Pages 결과는 다음 체크포인트에 기록한다.

- 2026-11-11 · K4 [PR #1781](https://github.com/icefoxtail/AP------/pull/1781) **main 병합 완료**. head `19150a357a671f54ad617c3b54fcf5afd8ea47db`, merge/API·Git main `680a4ba47ff54646a46dd0b56f3f2ca2e86cf4bc`; ancestor 및 대상 7파일 차이 0 확인. 최소 검사 64/64이며 병합 직전 CI 23개는 queued로 전체 CI PASS를 주장하지 않는다. kit 3개 운영 파일은 모두 HTTP 200이지만 0개 일치하여 **PAGES_NOT_VERIFIED / QA_PENDING**. 공개 release는 `fb27d05ee921da9534d9fff332ac774d732b91cf`, 최신 Pages 실행은 workflow success/Deploy skipped이며 이전 writer는 required registration incomplete로 배포 dispatch를 건너뛰었다. 보호·검사 기준은 변경하지 않았다. [AWCR r30](https://drive.google.com/file/d/1V4KQYrJyoPYRcQ0M0_2c50uO83eISE6b/view) raw SHA-256 `d56ce2344295d4f31dfa8b154d8ee0e0d99cd479f1baac87cd282179c1fb6e5e`·7,931 bytes를 다시 읽어 검증했다. 다음 고등 첫 시범은 접선과 미분계수 7장면이다.

- 2026-11-11 · K4 고정 수식 줄 [PR #1781](https://github.com/icefoxtail/AP------/pull/1781) **구현 및 최소 안전 검사 완료**. `pin:true`가 붙은 자막의 수식만 추출하여 현재 시간까지의 최근 3줄을 표시하고, 되감기·다시 보기·해설 전환·끝 카드에서 미래 수식/이전 해설의 수식을 비운다. 기존 컴파일 결과와 `stateAt`은 핀이 없는 대본에서 동일하며 기본 1.5배 속도를 유지했다. 세로 태블릿 700~1024px에서 핀이 있는 동안 수식 왼쪽·현재 자막 오른쪽, 다른 화면은 위아래 배치다. 신규 core 8·Player 6, 기존 video 41·속도 2·닮음 VM 3·원 VM 4로 **64/64 통과**, fail/skip/cancel 0. JS/MJS 4파일 구문·diff 검사 통과. 실제 브라우저 픽셀·전수 모바일·독립 시각 검수는 **NOT_RUN / QA_PENDING**. [AWCR r29](https://drive.google.com/file/d/1c8yebVhVbcRvpCcQnarBM7Z_7GN4Ruiz/view) raw SHA-256 `1841d3dae0e2fc996194de2d5e6b1d4b6728695c6af3c9c88847824d761bc9f7`·7,212 bytes는 첫 구현 원격 head `a937d27a70cd45385e4a64785e61b1b8e019ad85`에 고정한 저장본이며 최종 UI·통합 검사 결과는 다음 revision에 기록한다.

- 2026-11-11 · 원의 성질 [PR #1780](https://github.com/icefoxtail/AP------/pull/1780) **main 병합 완료**. head `ebc21478efc5ba62bbaff4ff2378ef5d3db33cdd`, merge/API·Git main `41a2cc430ee7f2c297d771587dee61e065b72df4`; ancestor 및 대상 13파일 차이 0 확인. 중등 **16개 실험실·529장면/1,532해설**이 main에 등록됐다. 병합 시 CI 11개는 queued로 전체 CI PASS를 주장하지 않았다. 11:03 UTC 운영 파일 7개는 0개 일치(기존 HTML/core/t2/t7 4개 불일치, lesson-b/c 404, lesson-a 503 재시도 후 미확인)여서 **PAGES_NOT_VERIFIED / QA_PENDING**이다. [AWCR r28](https://drive.google.com/file/d/1xgTahPbjnmiPwF3V6I5_L3TnMQqt2hqk/view) raw SHA-256 `8993dd87ff6bd1554a39c1d598ce84774e4825398849b093ecd953db6704c699`·7,116 bytes를 다시 읽어 검증했다. 다음은 §7의 고등 시범과 필요한 K4 별도 키트 PR이다.

- 2026-11-11 · `g9-circle` **45장면/215해설 구현 완료**. 원문 생성기의 seeded `ciPk`와 선택지를 고정하고 개념 69개·문제 146개를 등록했다. 원문 생성 유형 전체와 외접한 두 원의 반지름 순서·같은 반지름, 내접 판정 사각형 여섯 종류를 포함한다. 기존 source 풀이와 Board에 연결하고, 원 접기의 실제 변형과 증명 보조선을 단계에 맞춰 표시한다. 최소 검사 **126/126**, validator 오류·경고 0, JS/MJS **22파일**·HTML 인라인 **2개** 구문, diff 검사 통과. 공통 키트 변경 없음. `t2.js`의 미지 둘레 표기 1줄과 `t7.js`의 수업 전용 접힘 모델/범위만 최소 수정했다. [AWCR r27](https://drive.google.com/file/d/1DYzR2Y4lZnkk5cEVjjdQKPKHsDutlcJm/view)은 중간 38장면/177해설을 raw SHA-256 `f608a6b7db2b1f8466aecc18094b8a9ac08d53904515d478079ce480c481f5dd`·7,358 bytes로 재검증한 저장본이다. 최종 PR·main·Pages 결과는 다음 revision에 기록한다. 전수 모바일·독립 시각 검수는 NOT_RUN이다.

- 2026-11-11 · 삼각비 [PR #1779](https://github.com/icefoxtail/AP------/pull/1779) **main 병합 완료**. head `8f829eb0609dfcb48610fbf4eb4bef5830e3205b`, merge/API·Git main `3400e9240abae41b881648817390963adaf65c1c`; ancestor 및 대상 파일 차이 0 확인. 중등 main 누계 **15개 실험실·484장면/1,317해설**. 실제 학생 HTML은 HTTP 200·4,781 bytes의 이전 파일이며 해설 연결이 없고, lesson-b/c.js는 HTTP 404이므로 **PAGES_NOT_VERIFIED / QA_PENDING**. 병합 시 CI 11개는 queued였으며 PASS로 간주하지 않았다. [AWCR r24](https://drive.google.com/file/d/17YWJMcOxyKXPYGi2DLjG3rVztbg-Z2sh/view) raw SHA-256 `1eeff9993ca363ab44898d9169718d365ebdd8663635a589ddfe5fb32db731c8`·6,854 bytes를 다시 읽어 검증했다. 다음 원의 성질은 같은 main에서 `feat/lessons-g9-circle`로 시작했다. 동일 해설 브랜치·PR은 없었고 기존 도형 개선 PR #1459는 이미 병합되어 재구현하지 않는다.

- 2026-11-11 · 닮음 [PR #1777](https://github.com/icefoxtail/AP------/pull/1777) **main 병합 완료**. head `e11cbd7735fea5aa804cd922fa91f0912e83d438`, merge/API·Git main `80e3ecc5119c200b722c6e7563835e8fd772b2ea`; ancestor 및 대상 파일 일치 확인. 중등 main 누계 14개 실험실·433장면/1,072해설. 실제 학생 HTML은 4,736 bytes의 이전 파일이고 lesson-a.js는 HTTP 404이므로 **PAGES_NOT_VERIFIED / QA_PENDING**. [AWCR r21](https://drive.google.com/file/d/130muBUMYspeiE5lc5jtrUsjCwMY751Mk/view) raw SHA-256 `cca70035bc07e816fca0316963d2807aec48a471eaf98deb96bfbdea1cd35869`·5,863 bytes를 다시 읽어 검증했다. 다음 삼각비 51장면은 최신 main에서 별도 브랜치로 시작했다. 동일 해설 브랜치/PR은 없었고, 기존 도형 개선 브랜치는 이미 병합된 PR #1461이므로 재작업하지 않는다.

- 2026-11-11 · `g8-similarity` 39장면/144해설을 신규 구현하고 최소 검사 108/108·구문 18파일·등록 누락 0을 확인했다. **IMPLEMENTED / QA_PENDING**, main·Pages 확인 예정. 최신 main `2e8325d8c7841467d82c3bc57193f3e65fd91abe`의 추가 17파일은 다른 Archive 작업이며 AP Math 실험실·공통 키트·필독 문서와 겹치지 않았다. [AWCR r20](https://drive.google.com/file/d/1Nh6j6jRpYg05gfJLHLjOmRdgAF4t1Z7e/view)에는 중간 22장면/79해설 원격 체크포인트를 저장하고 raw SHA-256 `74f25973050da197204b008db7585d1e29474e5a0bc4c300f8157145d356bff4`·5,059 bytes를 재검증했다. 다음 revision에는 최종 PR·main 결과를 기록한다.

- 2026-11-11 · 사각형의 성질 [PR #1775](https://github.com/icefoxtail/AP------/pull/1775) **main 병합 완료**. head `cc71d4cc1e5c6873a303d974e64c8024a1d6d739`, merge/API·Git main `1adb00ecf9d275d8b83df5e1089e27e9dfe77466`; merge ancestor 및 대상 파일 차이 0 확인. 32장면/133해설, 최소 검사 109/109·구문 17파일. 중등 main 누계 13개 실험실·394장면/928해설. 공개 배포 영수증은 여전히 `fb27d05ee921da9534d9fff332ac774d732b91cf`이므로 **PAGES_NOT_VERIFIED / QA_PENDING**이다. [AWCR r19](https://drive.google.com/file/d/1uFp7XQEljgsrMMdciRe_-Y8KblGcrqO_/view) raw SHA-256 `aa2df1a855589bd2c105b38e64d25d147501b30f7233da64e15f2f0e8328ea4e`·5,442 bytes를 다시 읽어 검증했다. 다음 실험실은 닮음 39장면이다.

- 2026-11-11 · 삼각형의 성질 [PR #1768](https://github.com/icefoxtail/AP------/pull/1768) **main 운영 병합 완료**. head `b971cbeb6b582cf603edbe8bae5bde6648d42990`, tree `a5c6b4648428139162a24a867f31903808868887`, merge/API·Git main `c554314dab47bb18adf8f71d8cf50f0e87e45b3e`; merge ancestor 및 대상 파일 차이 0 확인. 43장면/165해설, 최소 검사 171/171·구문 16파일. 최종 head CI 11개 queued로 전체 CI PASS를 주장하지 않았다. 07:35 UTC 실제 학생 HTML은 HTTP 200·이전 4749 bytes·SHA-256 `bc19600f10e5f800063f1ecfa90eb7f3f1fb7951e1ead8a9e10cb1961839396d`, player/lesson 연결 없음. 최신 등록 writer 42980514684는 pending이며 공개 배포 영수증 source는 `fb27d05ee921da9534d9fff332ac774d732b91cf`다. **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING**. main 누계 362장면/795해설, Pages 확인 196/319·대기 166/476. 다음 사각형 32장면을 시작했다.
- 2026-11-11 · [AWCR r17](https://drive.google.com/file/d/1Qb_QoodPr1qF8uJmHCm-sqQ4WsgBtG_y/view) immutable 저장·원격 raw 재조회 완료. SHA-256 `71ad6615f5f359ca3228b4133067fbcce081b1d69d1b303421f991a86b2a6fe8`, 53,332 bytes, parent r16 `5c6886c821b9caa2241ccda94a8ad5336fe1944f29c869373a56fe0e7b86f33a`와 task/owner/revision/schema/byte equality 검증, 전후 revision 충돌 0. 삼각형 PR·main·최소 검사와 Pages 구버전 상태를 보존했으며 다음 실행 위치는 `feat/lessons-g8-quadrilaterals`다. 다음 revision r18은 최신 원격 충돌을 다시 확인해 저장한다.

- 2026-11-11 · `g8-triangles` **43장면/165해설 신규 구현 및 최소 안전 검사 완료**. Node **171/171**(실패·skip·cancel 0), JS/MJS 구문 **16파일**, 실제 HTML/카탈로그 누락 0, production Board **495상태**. 실제 새 문제 click handler 이후 해설 조건·도형 복원, 기존 `trPick`/`trShow` 보존, legacy tick 비개입을 확인했다. 합동 비교의 대응 관계와 길이 보존, 각도·거리·넓이·외심/내심 조건을 독립 계산했다. 검사 기록 SHA-256 `c82c17bb11e4a23b0e1de3b19bf4f7e561854b596f02490061e8bc00e38b0ca7`. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 실제 모바일 전수/독립 시각/브라우저 정밀검수는 NOT_RUN이며 5~8버튼의 실제 모바일 배치와 각 장의 그림·자막 가독성은 후속 확인 대상이다.
- 2026-11-11 · [AWCR r16](https://drive.google.com/file/d/1gu5k8N5U5Q7_k33jb6o6qdFQBXtBlp8i/view) immutable 저장·원격 raw 재조회 완료. SHA-256 `5c6886c821b9caa2241ccda94a8ad5336fe1944f29c869373a56fe0e7b86f33a`, 49,357 bytes, parent r15 `f7dd56f2702bbd93d4e6b3f4545bcb57b635a0f1ea2a761656fa06930de636dd`와 task/owner/revision/schema/byte equality 검증. kit #1767 병합과 45/45 결과, 삼각형 checkpoint6 `3c5d224aa8798027f2ee12919e44c07c07144f77` / tree `78296594c3d0c667e4bdb28298aa2f5062bd6e4e`의 39장면/151해설 **WIP**를 보존했다. 이 revision 시점의 삼각형 통합 검사·PR·main은 미완료이며 다음 실행은 최신 원격 브랜치를 재조회해 이미 완료한 구현을 반복하지 않는다. 다음 revision r17.
- 2026-11-11 · 삼각형의 합동 조건 판별 등 원본의 구별되는 개념을 각각 선택하기 위해 공통 키트 [PR #1767](https://github.com/icefoxtail/AP------/pull/1767)을 별도 정상 main 병합했다. head `9652c6beaff83ea733bbd5a5f3bbfd3ff7eeab23`, merge `3e084dec0a750e5855b907a0f25b1dc6d5d327bc`. 장면당 최대 8해설을 지원하며 9개는 거부한다. 기존 라벨 길이·중복, 장/자막 길이, 답 공개, 형제 상태 초기화 검사를 유지했다. video 41/41 및 두 기존 실험실 실제 등록·Board 회귀 4/4, 합계 45/45·구문 2파일 통과. 실제 Player prototype의 8번째 버튼·번호/이름 주소·다음 해설·음성 사례를 확인했으며 실제 모바일 QA는 NOT_RUN이다. 최종 head CI 23개 queued로 전체 CI PASS가 아니며 Pages는 별도 대기 상태다. 삼각형 내용 브랜치의 첫 원격 checkpoint는 이 merge를 부모로 사용해 별도 키트 작업을 포함한다.
- 2026-11-11 · 중2 피타고라스 [PR #1766](https://github.com/icefoxtail/AP------/pull/1766) **main 운영 병합 완료**. head `e6f938722cbf2a3f8d198e316c3661f1cf0e46d9`, merge/API·Git main `8951ab5607b3e2d1b7fc54ae64738875a626fd87`; merge ancestor 및 대상 파일 차이 0 확인. 37장면/87해설, 최소 검사 151/151, 구문 17파일. 최종 head CI 11개 queued로 전체 CI PASS를 주장하지 않았다. 실제 학생 HTML은 HTTP 200·이전 4696 bytes·SHA-256 `5a0540c23a7222cbe1d5f99d854e97b598f792f4b7ff53c87789653b8983ed70`, player/lesson 연결 없음. 등록 writer 42977300462는 cancelled, 동일 source의 42977408585는 pending이다. **MAIN_MERGED / PAGES_NOT_VERIFIED / QA_PENDING**. 다음 실험실 삼각형의 성질 43장면을 시작한다.
- 2026-11-11 · [AWCR r15](https://drive.google.com/file/d/1wiikks2gZSnb_4JMQ0N8Q_viYu7_WDP1/view) immutable 저장·원격 raw 재조회 완료. raw SHA-256 `f7dd56f2702bbd93d4e6b3f4545bcb57b635a0f1ea2a761656fa06930de636dd`, 42,560 bytes, parent r14 `7dd3e7bcc67149d95dc7a0260f2dc3285a36b8f5ec8505161e8b6833b59aa2e3`와 task/owner/revision/schema/byte equality 결속 확인. main 누계 319장면/630해설, Pages 확인 196/319, 대기 123/311이며 품질 UNKNOWN·전수 QA NOT_RUN이다. 다음 revision r16.
- 2026-11-11 · `g8-pythagoras` **37장면/87해설 신규 구현 및 최소 검사 완료**. 실제 등록·카탈로그 누락 0, 검사 **151/151**(실패·skip 0), JS/MJS 구문 **17파일**, production Board **261상태**. 통합 검사에서 확인한 고정 접기 문제의 수동 복귀 회귀와 기존 보기 선택 초기화 회귀를 수정하고 동일 최소 검사를 다시 통과했다. 검사 기록 SHA-256 `a97dbe56cf3e6ef33a074af9fd656d229532b0467dde20c659f417c27bd460b3`. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 실제 브라우저 실행은 환경의 Chromium socket 권한 오류로 NOT_RUN_ENV_BLOCKED이며 Node 기반 생산 Player 검사를 브라우저 PASS로 해석하지 않는다.
- 2026-11-11 07:05 UTC · [등록 writer 42970514545](https://github.com/icefoxtail/AP------/actions/runs/42970514545)가 **failure**로 종료됐다. 일부 등록 결과를 main `b8618c10c89f5521583a7da9671db3c6d7871061`에 저장했으나 필수 등록 미완료로 Pages dispatch는 skipped이며 blocked lanes는 generated/reviewed/semantic/shared다. reviewedFinal `assignment_missing`은 여전히 로그에 존재해 해결됐다고 가정하지 않는다. [공개 배포 영수증](https://icefoxtail.github.io/AP------/_archive-release.json)의 등록 source는 이전 `fb27d05ee921da9534d9fff332ac774d732b91cf`, packageDigest `e5774bfc65cc96a9474df055fdb64d2aedfe5c74a6a5fdbca337f79217914392`였다. 평행선·점과 직선·공간 위치 관계·작도 HTML은 HTTP 200이지만 신규 player/lesson 연결이 없어 **main 완료 / Pages 신규 해설 미반영**이다. 작도 writer 42974755265는 queued였으며 CI·등록 기준을 변경하거나 배포를 우회하지 않았다.
- 2026-11-11 · 작도와 합동 [PR #1764](https://github.com/icefoxtail/AP------/pull/1764) **main 운영 병합 완료**. head `f59bd3eae154a2b60006352382ef78349d400f8f`, merge/main `87b09c58ac6cc061ba623c1e3e990ddcc18f6537`. API·Git main 일치, merge ancestor 및 대상 파일 차이 0 확인. 23장면/70해설, 최소 검사 141/141·구문 15파일. [등록 writer 42974755265](https://github.com/icefoxtail/AP------/actions/runs/42974755265) pending이며 학생 HTML은 HTTP 200·이전 4691 bytes(SHA-256 `59b40c1ca6e569c3b040287dfce7a95bccc0e3ea6b58860688f5d0309bb7e7fd`), player/lesson 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 최종 head CI 14개는 queued로 전체 CI PASS를 주장하지 않았다. **중1 main 10개 실험실·282/282장면·543해설 완료**. Pages는 6개 196장면/319해설 반영 확인, 나머지 4개 86장면/224해설 대기다.
- 2026-11-11 · [AWCR r14](https://drive.google.com/file/d/1dHE9ihz08YR5OxmWADYbjqEe-VRNOT9k/view) immutable 저장·원격 raw 재조회 완료. SHA-256 `7dd3e7bcc67149d95dc7a0260f2dc3285a36b8f5ec8505161e8b6833b59aa2e3`, parent r13 `7d7ebfb5831bac372e830ba2cd6bd9c86a59951e8d8df363a58dca28ccd6f6fd` 결속 확인. 중1 main 전체 완료와 Pages 별도 상태, 실제 검증하지 않은 품질 UNKNOWN/모바일 NOT_RUN을 기록했다. 다음 revision r15. 다음 실험실 `g8-pythagoras`는 총 37장면이며 시범 3장면 뒤 남은 34장면을 구현한다.
- 2026-11-11 · 중2 `g8-pythagoras`를 최신 main `87b09c58ac6cc061ba623c1e3e990ddcc18f6537`에서 새 브랜치로 시작했다. 실제 HTML은 37장면(t1 6, t2 5, t3 4, t4 5, t5 6, t6 3, t7 5, t8 3)이다. 시범은 `py1-sq` 개념·`py1-leg` 실제 문제·`py2-euclid` 실제 문제이며, `pyQ`는 번호가 아닌 문제 조건 객체다. 그림 진행값은 `pyQ`에 넣지 않고 별도 start/to로 움직인다. 첫 시범 세 장면에는 `stepT`가 없으므로 실제 모델 값 진행과 legacy tick 비개입을 검사하며, 접기 장면의 `anim`은 해당 장면에서 별도로 확인한다.

- 2026-11-11 · `g7-construction` **23장면/70해설 신규 구현 완료**, 누락 0. 원격 main에서 시작해 필요한 별도 키트 merge `0eb89d192b650112782a1eb80b1c44f158fde0ec`를 반영했고 정상 단위마다 원격 보존했다. 최소 검사 141/141, JS/MJS 15파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 구현 분모는 중1 전체 **282/282장면·543해설**이며, 운영 병합 분모는 해당 PR의 실제 merge 후 갱신한다. 다음은 §6 `g8-pythagoras`의 개념 1·유형 2 시범이다.


- 2026-11-11 · 작도에서 구별되는 네 질문을 각각 재생하기 위한 공통 키트 [PR #1762](https://github.com/icefoxtail/AP------/pull/1762) 정상 main 병합. head `7d855555fe4a4dbdddac9ec8710ebe1b1fc3f1ac`, merge `0eb89d192b650112782a1eb80b1c44f158fde0ec`. 네 번째 버튼·`play=4`·다음 해설을 지원한다. 라벨/정답 조기공개/형제 상태 초기화/장 길이 검사는 유지하며 다섯 해설은 거부한다. video 40/40, 겉넓이·부피/다면체 실제 등록·Board 4/4, JS/MJS 3파일 구문 통과. 전체 모바일 QA NOT_RUN. 실제 배포된 video-core는 아직 maxPerScene 3인 이전 버전(HTTP 200, SHA-256 `b28815eafa030a16e33041fb531c195c6156d79548981fbedfc70884d8368623`)이어서 Pages NOT_VERIFIED. 작도 내용 브랜치에 fast-forward 반영했다.
- 2026-11-11 · 공간 위치 관계 [PR #1760](https://github.com/icefoxtail/AP------/pull/1760) **main 운영 병합 완료**. head `c3029bdda2542c4c438ca845e43cff1a15e9c250`, merge `16460f7381b3ca9df8ee80934a2096e588fad380`. 이후 main `577c5739b3f67185c0483a2415e46ecd2d8a32ef`에 merge가 포함되고 대상 파일 차이가 없음을 확인했다. 27장면/62해설, 최소 검사 102/102, JS/MJS 15파일 구문 통과, 실제 Board 186상태. 실제 학생 HTML은 HTTP 200·기존 4862 bytes이며 lesson/player 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 전체 모바일 NOT_RUN. 중1 main 등록 **259/282장면·473해설**, 마지막 미구현 `g7-construction` 23장면 제작을 시작했다.
- 2026-11-11 · [AWCR r13](https://drive.google.com/file/d/1NPYuuVli991wDptL1BHNW8lcqKDgfSo-/view) 원격 저장·raw 재조회 완료. SHA-256 `7d7ebfb5831bac372e830ba2cd6bd9c86a59951e8d8df363a58dca28ccd6f6fd`, parent r12 `fe67a6bb29ececdb999aa98a27310889be1b4c872009ad4df9a759d883c80a91` 결속 확인. 공간 위치 관계까지 MAIN_MERGED, 원·겉넓이·다면체·회전체·다각형·넓이 6개 RELEASED_QA_PENDING. 다음 revision r14는 충돌 재확인 후 저장한다.
- 2026-11-11 · 배포 등록 작업 [42967549440/job130348176135](https://github.com/icefoxtail/AP------/actions/runs/42967549440/job/130348176135)은 **필수 등록 검증 실패로 게시 중단**. run head는 `22cad5a...`이나 실제 inputSha는 `87861a8b40debf3eb8e69153426721298e519e6d`였다. `verify-registered-consumer-approval.sh`의 `reviewedFinal`이 Archive 문항 `assignment_missing`으로 실패하여 `registrationReady=false`, `publishable=false`; test job은 skipped다. 이전 source 교체만으로 설명하지 않으며, AP Math 해설 변경으로 발생했다는 근거는 없어 원인 귀속은 미확정이다. 별도 step summary 크기 제한 초과도 있었으며 등록 실패와 구분한다. 새 writer 42970514545는 조회 시 queued였다. Pages 42970224073은 이후 completed/success지만 Deploy job 130363045417이 skipped였다. Build job 130356934531의 실제 등록 검사 결과는 `REGISTRATION_REQUIRED`, `registrationReady=false`, `publishable=false`여서 배포 성공으로 간주하지 않는다. 평행선·점과 직선·공간 위치 관계의 학생 HTML은 각각 기존 3922/4774/4862 bytes이며 player 연결이 없음을 다시 확인했다. CI·등록 기준은 변경하지 않았다.
- 2026-11-11 · 작도 제작 중 실행 환경이 끊기고 이전 로컬 스냅샷으로 돌아오는 장애가 있었다. 원격 main과 브랜치에서 복구했으며 이미 병합한 실험실은 재제작하지 않았다. 미커밋 작도 연결부를 실제 파일과 대조해 복원했고 검증된 단위부터 다시 원격 보존한다. 복구 시 main `65aa4dae846d4121f034005f1e20678545c80669`의 추가 변경은 Archive 자료이며 AP Math 및 필독 문서와 겹치지 않았다. AWCR r13 원격 SHA를 정본으로 유지한다.

- 2026-11-11 · `g7-spatial` **27장면/62해설 신규 구현 완료**, 누락 0. main `87861a8b40debf3eb8e69153426721298e519e6d`에서 신규 브랜치로 제작하고 정상 단위마다 원격 보존했다. 최소 검사 102/102, JS/MJS 15파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음은 중1의 마지막 미구현 실험실 `g7-construction` 23장면이다.

- 2026-11-11 15:14 KST · **회전체·다각형·넓이의 실제 Pages 반영 확인: RELEASED_QA_PENDING.** [Pages run 42966828800](https://github.com/icefoxtail/AP------/actions/runs/42966828800) success, source `fb27d05ee921da9534d9fff332ac774d732b91cf`에 세 merge가 포함됨을 확인했다. 실제 HTTP 200 및 raw bytes/SHA 일치: 회전체 HTML+10모듈 11/11, 다각형 HTML+8모듈 9/9, 넓이 HTML+7모듈 8/8. 공통 JS 8개와 평행선·점과 직선의 구버전 HTML 2개까지 고유 **38/38 일치**, 실패·불일치 0. 증거 JSON SHA-256 `57c4fb8eb545d3e3559342b707f03b0f131a076705ff7de517f040ac72f5c5f4`. 평행선·점과 직선 merge는 해당 source에 없어 Pages NOT_VERIFIED를 유지한다. 같은 source의 중복 run 42967223392는 cancelled이며 성공 run은 유지됐다. 배포 파일 검증이며 전체 모바일·시각검수는 NOT_RUN이다.

- 2026-11-11 · 이전 운영 PR의 후속 CI 읽기 확인: 회전체 [browser(0) 130335925606](https://github.com/icefoxtail/AP------/actions/runs/42963703913/job/130335925606)와 다각형 [browser(0) 130340257621](https://github.com/icefoxtail/AP------/actions/runs/42965062845/job/130340257621)은 `apl-shell-disclosure-browser.mjs:117`에서 숨겨진 summary 클릭 timeout이다. 해당 exact head의 스크립트가 기존 `g7-circle-sector/f1-star`를 `?theme=board`로 열고 `manual=1`을 지정하지 않는 진입 계약 불일치와 같은 서명이다. 넓이 [test 130346529192](https://github.com/icefoxtail/AP------/actions/runs/42966318406/job/130346529192)는 Archive `runtime-bridge-receipt.json` stale로 330 test files 통과/1 실패이며 세부 upstream 원인은 미확정이다. 평행선·점과 직선에서 조회 당시 완료 실패는 없었고, 진행/대기 CI는 PASS로 간주하지 않았다. CI 취소·기준 변경·추가 브라우저 실행 없이 기존 완료 로그를 구분했다.

- 2026-11-11 · 점과 직선 [PR #1758](https://github.com/icefoxtail/AP------/pull/1758) **main 운영 병합 완료**. head `8911c38fd1345d514424c88b8cd82757a88f2784`, merge `87861a8b40debf3eb8e69153426721298e519e6d`, 원격 main 및 대상 파일 일치 확인. 24장면/63해설, 최소 검사 120/120. [등록 writer 42969279316](https://github.com/icefoxtail/AP------/actions/runs/42969279316) pending. 실제 학생 HTML은 HTTP 200·이전 4774 bytes이고 lesson/player 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 최종 head의 CI 14개는 queued로 전체 CI PASS를 주장하지 않았다. 중1 main 등록 **232/282장면·411해설**. 다음 공간 위치 관계 27장면 제작을 시작했다.
- 2026-11-11 · [AWCR r12](https://drive.google.com/file/d/1hXOk6MH6C8qLNuHLXkfNUEKx4flk_0FQ/view) 원격 저장·raw 재조회 완료. SHA-256 `fe67a6bb29ececdb999aa98a27310889be1b4c872009ad4df9a759d883c80a91`, parent r11 `646c65c84933b689a7ea6c514b75fa2e6e8e5040b2e617ea061f978ba1aa8fb1`와 결속 확인. 점과 직선까지 MAIN_MERGED, 원·겉넓이·다면체 RELEASED_QA_PENDING이며 전체 모바일 NOT_RUN. 다음 revision r13은 충돌 재확인 후 저장한다.

- 2026-11-11 · `g7-points-lines` **24장면/63해설 신규 구현 완료**, 누락 0. main `22cad5a7005bc7ddedc0ab17fb760f4605b11dae`에서 신규 브랜치로 제작하고 정상 단위마다 원격 보존했다. 최소 검사 120/120, JS/MJS 13파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 제작 중 main `3b41a84e8dd93b4fe54cd4bba24702a4c3f6f4cb`로의 변경은 Archive SVG 작업이며 대상 실험실·공통 키트·필독 문서와 겹치는 변경은 없었다. 다음은 `g7-spatial` 27장면이다.

- 2026-11-11 · 평행선 [PR #1757](https://github.com/icefoxtail/AP------/pull/1757) **main 운영 병합 완료**. head `2a4a5fb4d2e7a7ec9fb842c39cefc228e4877c80`, merge `22cad5a7005bc7ddedc0ab17fb760f4605b11dae`, 원격 main 및 대상 파일 일치 확인. 12장면/29해설, 최소 검사 86/86. [등록 writer 42967549440](https://github.com/icefoxtail/AP------/actions/runs/42967549440) queued. 실제 학생 HTML은 HTTP 200·이전 3922 bytes로 lesson/player 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 대기 중 Pages 42966828800·42967223392의 source `fb27d05ee921da9534d9fff332ac774d732b91cf`에는 평행선 merge가 없다. 중1 main 등록 **208/282장면·348해설**. 다음 점과 직선 24장면 제작을 시작했다.
- 2026-11-11 · [AWCR r11](https://drive.google.com/file/d/1ezlQhyOQ--3kzrvk94dK3SQo3H5AhZD1/view) 원격 저장·raw 재조회 완료. SHA-256 `646c65c84933b689a7ea6c514b75fa2e6e8e5040b2e617ea061f978ba1aa8fb1`, parent r10 `7fb8497d9bb762f56133f8c28f6fd6bbe65f6a12d921ef8ca0033183f57256a8`와 결속 확인. 평행선까지 MAIN_MERGED, 원·겉넓이·다면체 RELEASED_QA_PENDING이며 전체 모바일 NOT_RUN. 다음 revision r12는 충돌 재확인 후 저장한다.

- 2026-11-11 · `g7-parallel` **12장면/29해설 신규 구현 완료**, 누락 0. main `68060cca4e6f89edaa806b7b5cafaafe102290e3`에서 신규 브랜치로 제작하고 정상 단위마다 원격 보존했다. 최소 검사 86/86, JS/MJS 13파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음은 `g7-points-lines` 24장면이다.
- 2026-11-11 05:39 UTC · 후속 CI 조회: 다면체의 [test job 130332626168](https://github.com/icefoxtail/AP------/actions/runs/42962457401/job/130332626168)도 Archive `runtime-bridge-receipt.json` stale로 328 test files 통과 / 1 실패이며 Surface와 같은 실패 서명이다. receipt 필드·환경 원인은 미확정이다. 회전체의 [test job 130337668035](https://github.com/icefoxtail/AP------/actions/runs/42963703911/job/130337668035)은 성공했다. 그 밖에 실행·대기 중 검사는 PASS로 간주하지 않았고 새 실험실 변경을 지목한 완료 실패는 해당 조회에서 관측되지 않았다. CI 취소·비활성화·기준 변경 없음.

- 2026-11-11 · 넓이 [PR #1755](https://github.com/icefoxtail/AP------/pull/1755) **main 운영 병합 완료**. head `e77560e43fc3594726d0b610abc66f3c22debad6`, merge `68060cca4e6f89edaa806b7b5cafaafe102290e3`, 원격 main 및 대상 파일 일치 확인. 14장면/30해설, 최소 검사 102/102. [등록 writer 42966336885](https://github.com/icefoxtail/AP------/actions/runs/42966336885) pending. 실제 학생 HTML은 이전 4079 bytes이며 lesson/player 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 중1 main 등록 196/282장면·319해설. 다음 평행선 12장면 제작을 시작했다.
- 2026-11-11 · [AWCR r10](https://drive.google.com/file/d/1qUpyTRWLdvzzWuJLKe27kPlCjWqgxZ8z/view) 원격 저장·raw 재조회 완료. SHA-256 `7fb8497d9bb762f56133f8c28f6fd6bbe65f6a12d921ef8ca0033183f57256a8`, parent r9와 결속 확인. Surface·다면체의 실제 Pages 반영을 기록했으며 회전체·다각형·넓이는 배포 대기다. 다음 revision r11은 충돌 재확인 후 저장한다.

- 2026-11-11 14:30 KST · **겉넓이·부피와 다면체의 실제 Pages 반영 확인: RELEASED_QA_PENDING.** [Pages run 42962929336](https://github.com/icefoxtail/AP------/actions/runs/42962929336) success, source `6c0c9030e2d6a5bf645e0c20fc567f1a885e291b`에 두 merge 포함 확인. 학생 HTTP 200 및 raw bytes/SHA 일치: Surface HTML+18모듈 19/19, 다면체 HTML+10모듈 11/11, 공통 JS 8개까지 중복 제거 38개. 회전체·다각형 구버전 HTML 2개까지 40/40 일치하며 이 두 merge는 해당 소스에 없으므로 계속 Pages NOT_VERIFIED다. 증거 JSON SHA-256 `bf82b1554600423f4d5abf71902c368ce073359f121308dab6c09b30c1e5c993`. 배포 파일 확인이며 전체 모바일·시각검수 NOT_RUN이다.

- 2026-11-11 · `g7-area` **14장면/30해설 신규 구현 완료**, 미등록 장면 0. main `0f82b309173e29d399945bccedd0a52c8196b586`에서 신규 브랜치로 제작하고 정상 단위마다 원격 보존했다. 최소 검사 102/102, JS/MJS 12파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음은 `g7-parallel` 12장면이다.

- 2026-11-11 · 다각형 [PR #1754](https://github.com/icefoxtail/AP------/pull/1754) **main 운영 병합 완료**. head `afe38dedceabe03e93c4ff366b13dd6ad70ebe40`, merge `0f82b309173e29d399945bccedd0a52c8196b586`, 원격 main 및 대상 파일 일치 확인. 18장면/31해설, 최소 검사 145/145. [등록 writer 42965086609](https://github.com/icefoxtail/AP------/actions/runs/42965086609) pending. 실제 학생 HTML은 기존 4608 bytes로 신규 모듈·player 연결이 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 중1 main 등록 182/282장면·289해설. 다음 넓이 14장면 제작을 시작했다.
- 2026-11-11 · [AWCR r9](https://drive.google.com/file/d/1L1rZmz06Ag0A_0MEmBThb33YMo1F1vxJ/view) 원격 저장·raw 재조회 완료. SHA-256 `df9d7ca274f3368f57f9e65600ff37ad9b557969255c6a28a2aa1a50d51d48cc`, parent r8와 결속 확인. 다각형까지 MAIN_MERGED, 신규 네 실험실 Pages NOT_VERIFIED, 전체 모바일 NOT_RUN. 다음 revision r10은 충돌 재확인 후 저장한다.

- 2026-11-11 · `g7-polygons` **18장면/31해설 신규 구현 완료**, 미등록 장면 0. 최신 main `459c71d08b159a7fe5fffc91ea5c3553e78005b9`에서 새 브랜치로 제작하고 정상 단위마다 원격 보존했다. 최소 검사 145/145, JS/MJS 13파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음은 `g7-area`다. 선행 Surface·다면체·회전체의 실제 HTML은 기존 버전이며, Pages run 42962929336은 Build success / Deploy queued여서 NOT_VERIFIED를 유지한다.

- 2026-11-11 · Surface head `af38f57a0a23354508d3a90555c14244ad6da39e`의 뒤늦게 종료된 CI 두 실패를 분류했다. [test job 130330811707](https://github.com/icefoxtail/AP------/actions/runs/42961568008/job/130330811707)은 `meta-foundation-derivative-runtime.test.js`에서 Archive `runtime-bridge-receipt.json` stale(328 test files 통과 / 1 실패), [browser (0) job 130329067067](https://github.com/icefoxtail/AP------/actions/runs/42961567988/job/130329067067)은 `apl-shell-disclosure-browser.mjs:117`의 기존 circle `f1-star` 수동 풀이 summary 비표시 click timeout이다. 해당 검사는 `manual=1` 없이 해설 진입 화면에 들어간다. 관련 Archive·공통 kit·circle·검사 파일은 CI base `1031c5f9ef42ad5838223f7224b51deb2a9d9a61`부터 Surface head까지 변경이 없다. Surface 신규 최소 검사 182/182와 구분하며, 전체 CI PASS로 보고하지 않는다. 기존 검사 비활성화·기준 완화 없음; 수동 진입 검사 호환 보완은 별도 작업으로 남긴다.

- 2026-11-11 · 회전체 [PR #1750](https://github.com/icefoxtail/AP------/pull/1750) **main 운영 병합 완료**. head `1256bac2c71b26eb75edb66cf4b2f210211c4082`, merge `459c71d08b159a7fe5fffc91ea5c3553e78005b9`, 원격 main 및 대상 파일 일치 확인. 22장면/48해설, 최소 검사 108/108. [등록 writer 42963737290](https://github.com/icefoxtail/AP------/actions/runs/42963737290) pending, 이전 snapshot의 [Pages 42962929336](https://github.com/icefoxtail/AP------/actions/runs/42962929336) 진행 중. 실제 학생 HTML에는 새 모듈 연결이 아직 없어 **Pages NOT_VERIFIED / QA_PENDING**이다. 원과 부채꼴 포함 중1 main 등록은 164/282장면·258해설이며 다음 다각형 제작을 시작했다.
- 2026-11-11 · [AWCR r8](https://drive.google.com/file/d/1icCrxQIu2Gy8GhcWYm5SdJzaT4Wz7pao/view) 원격 저장·raw 재조회 완료. SHA-256 `b338549b3b15afc84dc24269f4676e72f038ff7e9c96ed9f93d40449a9561d77`, parent r7와 결속 확인. Surface·다면체·회전체 Pages는 NOT_VERIFIED, 전체 시각검수 NOT_RUN. 다음 revision r9은 충돌 재확인 후 저장한다.

- 2026-11-11 · `g7-solids` **22장면/48해설 신규 구현 완료**, 미등록 장면 0. 최신 main `1e4fe2ce808fff9887e798b7ec7cf4e4f0461bbe`에서 새 브랜치를 시작했고 정상 구현 묶음마다 원격에 보존했다. 최소 검사 108/108, 수정 JS/MJS 13파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음 실험실은 `g7-polygons`다.

- 2026-11-11 · 다면체 [PR #1747](https://github.com/icefoxtail/AP------/pull/1747) **main 운영 병합 완료**. head `03dbe12eceae68153d43ba35c629b0d26247fddb`, merge `1e4fe2ce808fff9887e798b7ec7cf4e4f0461bbe`, 원격 main 및 대상 파일 일치 확인. 26장면/58해설, 최소 검사 131/131. 실제 학생 HTML은 이전 버전이고 신규 모듈은 배포 전 404여서 **Pages NOT_VERIFIED / QA_PENDING**. [최신 등록 writer 42962471997](https://github.com/icefoxtail/AP------/actions/runs/42962471997) pending. 이전 Surface pending writer 취소는 최신 main 작업으로 교체된 것이며 구현 실패가 아니다. 다음 회전체 제작에 착수했다.
- 2026-11-11 · [AWCR r7](https://drive.google.com/file/d/1xJbjGpJNNEdAHfDdSabGkfvVS3zfhWCZ/view) 원격 저장·raw 재조회 완료. SHA-256 `6807b5f8d5a6d12d71a9389ff3ad70884d80d15ecfd6303dace0177f773dc21c`, parent r6와 결속 확인. 다음 revision r8은 충돌 재확인 후 저장한다.

- 2026-11-11 · `g7-polyhedra` **26장면/58해설 신규 구현 완료**, 제작 누락 0. 최신 main `4ab7f327068a09ecbe583f1141487e299965e28b`에서 별도 브랜치로 시작했고 구현 단위마다 원격에 보존했다. 최소 검사 131/131, JS/MJS 13파일 구문 통과. **IMPLEMENTED / QA_PENDING**, PR·main·Pages 확인 예정. 다음 실험실은 `g7-solids`다.

- 2026-11-11 · 겉넓이·부피 [PR #1746](https://github.com/icefoxtail/AP------/pull/1746) **main 운영 병합 완료**. head `af38f57a0a23354508d3a90555c14244ad6da39e`, merge `4ab7f327068a09ecbe583f1141487e299965e28b`. 원격 main과 대상 파일 일치 재확인. 30장면/54해설, 최소 Node 182/182. [등록 run 42961588518](https://github.com/icefoxtail/AP------/actions/runs/42961588518) pending, 학생 HTML은 이전 버전이어서 **Pages NOT_VERIFIED / 배포 대기**다. 신규 파일의 배포 전 404는 기존 사이트의 확정 P0가 아니다. 전체 시각검수 NOT_RUN. 다음 다면체 구현에 착수했다.
- 2026-11-11 · AWCR task `df4ac906-152a-4010-ae2b-f5cf740a5179` [r6](https://drive.google.com/file/d/14Ij7YV3dY5utUjPQC-fES1ZOX5zKphA2/view) 원격 저장·raw 재조회 완료. SHA-256 `c91ee7bc580f9fd502769b7c70540d98fd1b10d37755c911a067ee7cd9cfa56c`, surface MAIN_MERGED·Pages NOT_VERIFIED, circle RELEASED_QA_PENDING, quality UNKNOWN. 다음 revision은 충돌 재확인 후 r7이다.

- 2026-11-11 · `g7-surface-volume` 잔여 구현 완료: 실제 30장면/54해설, 신규 31해설(잔여 12장면/27 + 기존 4장면/4), 미등록 장면 0. 위 최소 검사 182/182 및 구문 검사 통과. **IMPLEMENTED / QA_PENDING**, main·Pages는 병합 후 별도 확인. 다음 구현은 §5-3의 `g7-polyhedra`다.
- 2026-11-11 · 원과 부채꼴 Pages 확인 완료: [run 42958902234](https://github.com/icefoxtail/AP------/actions/runs/42958902234), source `3fd795aa10ab9bd5652262b443797bc562f6dd53`에 PR #1736 merge 포함. 학생 HTML HTTP 200 및 17/17 모듈이 배포 소스와 바이트 단위 일치. 실제 브라우저에서 중심·반지름 해설의 버튼·진입·재생 시작 확인. **RELEASED_QA_PENDING**이며 전체 98해설/모바일 품질검수는 NOT_RUN이다. 아래 과거 Pages NOT_VERIFIED 기록을 이 확인 결과로 갱신한다.

- 2026-11-11 · [PR #1736](https://github.com/icefoxtail/AP------/pull/1736) 실제 main 운영 병합 완료, merge SHA `480018bea30d86225b8e41c79eda5cd76ce03ebc`, main readback 확인. **98해설 QA_PENDING**, Pages 배포 **NOT_VERIFIED**(현재 실행 환경에서 실시간 사이트 확인 불가). 다음 §5-2.

- 2026-11-11 · **사용자 우선순위 변경:** 중1 시험 대비 신규 구현과 운영 병합을 최우선으로 전환. 원과 부채꼴 PR #1736을 첫 병합 대상으로 지정, 그다음 겉넓이·부피 → 중1 나머지 8개. 전수 모바일/독립 검수는 운영 뒤 QUALITY 단계로 유보. 기존 검수 미실행을 PASS로 추정하지 않음.

- 2026-11-10 · 키트 + 시범 3개 · PR #1644 · 병합
- 2026-11-11 · g7-surface-volume 22개 + 버튼 축소 + 첫 장 규칙 + 감사 분할 · PR #1713
- 2026-11-11 · g7-circle-sector 51개 · 브랜치 `feat/lessons-g7-circle-sector` · 미병합, 재검수 필요
- 2026-11-11 (실행 환경 UTC 기준) · GPT 인계 복구: main `15edf0c71b676e26515a4de4960d8678bc30d109`을 기존 브랜치에 충돌 없이 반영, 원격 병합 커밋 `4210b55cd0d7a975b84b2cf39fdd4b808fe6c362` 확인. main 병합·운영 배포는 수행하지 않음.
- 2026-11-11 · g7-circle-sector 1차 구현 보존: 기존 45장면/51해설의 공개 순서·기호 설명·공유 링크 초기값을 보강하고 신규 28장면/28해설(f05 8, f03 8, rolling 4, f04 2, swept 6)을 추가. 합계 73장면/79해설은 **구현 후보**이며 전체 품질 완료가 아님. 잔여 13장면: z0 개념 5개, f02 lune13/nc/ns, 1101/1207/1607/1210/x01.
  - 수학 오류 수정: f02 cc08 공통 원주 설명의 잘못된 ½ 제거. f4-circ2 반지름 5에서 오답①과 정답②가 모두 50이던 보기 데이터만 수정, 모든 허용 정수 반지름에서 선택지 유일성 검산.
  - 실행: `node --test apmath/playground/next/tools/video.test.mjs apmath/playground/next/tools/lessons.g7-circle-sector*.test.mjs apmath/playground/next/tools/g7-circle-*.test.mjs` → **662/662 PASS**, skipped 0. 무필터 validator, 독립 수학 계산, 실제 모듈 로드 및 Board 그리기 명령의 공개 순서 포함.
  - `tools/video.test.mjs`는 이 실험실의 기존 z3-sectorProof 대본을 직접 읽는 기대값과 새 공개 시점만 갱신했다. 공통 키트 구현·검사 기준·분모를 변경하지 않았으며 `kit/**` 변경 없음.
  - 수동 탐구·정리·문제의 소스/Board 명령 회귀 비교는 통과했으나 **실제 브라우저 390×844 검수, 자동 재생 종료·터치·잘림·다시 보기·직접 해 보기와 전후 화면 캡처는 NOT_RUN**. 로컬 Chromium은 socket 권한 제한으로 실행 불가, 추가 실행 권한은 자동 승인 검토에서 거절. 연결 브라우저는 originating context가 없고 cloud browser는 로컬 URL 접근 불가. 소스 검사 결과를 화면 PASS로 대체하지 않음.
  - 다음: 검증한 구현을 같은 브랜치와 Draft PR에 보존하고 잔여 13장면 제작. 일반 PR 전환과 실험실 완료 판정은 실제 모바일·필수 CI 게이트 통과 이후. K1~K4는 별도 키트 PR 대상이며 현재 구현하지 않음.
- 2026-11-11 · g7-circle-sector 2차 구현 보존 · [Draft PR #1736](https://github.com/icefoxtail/AP------/pull/1736): 잔여 13장면/19해설(z0 개념 5/7, f02 lune13·nc·ns 3/5, 기본 1101·1207·1607·1210·x01 5/7)을 추가. **전체 등록 86장면/98해설, 기존 45/51 + 신규 41/47, 제작 누락 0·건너뜀 0.** 해설의 실제 모바일 품질 게이트는 아직 통과하지 않았으며 일반 PR로 전환하지 않음.
  - 독립 수학·소스 검수에서 1207의 각도 이동 중 부동소수 라벨, lune13의 첫 프레임 치수 누락, nc·ns의 진입 질문과 고정 문제 불일치를 발견하여 수정했다. 원주율/지름, 호/넓이, 중심각 합/호 합/넓이 합은 각각 독립 버튼으로 분리했다. 1210은 기존 짧은 영상 대신 S=½rl 풀이 해설을 등록하되 이전 영상 파일과 그 수학 회귀 검사는 보존했다.
  - 원본 수학 문구 오류 추가 수정: ns의 정리 설명에서 작은 **반원의 둘레**의 합을 큰 반원의 호 길이와 같다고 썼던 부분을 **호의 길이**의 합으로 바로잡음. 반지름 6·3등분에서 작은 반원의 둘레 합은 6π+12, 호의 합은 6π이므로 둘을 구분하는 독립 검산을 추가했다.
  - 실행: 위 전체 명령 → **716/716 PASS**, failed 0, skipped 0. 실제 HTML의 MODULES를 로드하여 86/86 장면에 98개 lesson이 연결되고 이전 영상이 중복 등록되지 않음을 확인했다. 개념 405건·f02 324건의 수동 상태 Board 명령 비교와 기본 장면 회귀 비교는 소스 수준 결과다.
  - 독립 통합 소스 검수: 실제 HTML/Board의 98해설 3,024개 표본 프레임에서 draw 예외·도형 명령 없는 프레임·무대 밖 텍스트 기준점 0. 마지막 추가 19해설의 자막·라벨·칩 공개 시점 85/85 통과. 판정은 `PASS_SOURCE_COMMANDS`이며 실제 글자 폭·DOM 배치·터치·애니메이션 프레임의 화면 판정이 아니다. f02 조각 분리 때 라벨 fade의 실제 동시성은 모바일 후속 검수 항목이다.
  - `tools/video.test.mjs` 추가 변경은 이 실험실 1210의 등록이 영상에서 lesson으로 바뀐 사실과 기존 영상 fixture 보존을 확인하는 검사다. 공통 재생 키트 코드, 검사 분모·필터·skip을 변경하지 않았다.
  - 실제 브라우저 증거 일부: 이전 구현 HEAD `8a37b68adf76282601a6d442da0f430348519aa6`의 [G7 preflight run 42951662148](https://github.com/icefoxtail/AP------/actions/runs/42951662148)에서 `manual=1` 8장면의 캡처 103개를 독립 검수했다. 전후 190쌍의 그림 영역은 동일했다. 이는 **이전 HEAD의 수동 화면 일부 검수**이며 이번 최종 코드의 해설 화면 검수가 아니다. 기존 1607의 10° 상태에서는 두 각도 라벨 겹침을 확인했고, 전후 동일한 기존 탐구 그림이므로 임의로 변경하지 않았다. 1809 이외 7장면은 문제 탭 캡처가 없어 해당 항목 NOT_RUN.
  - 필수 CI: 이전 HEAD `8a37b68`의 [전체 CI run 42951662112](https://github.com/icefoxtail/AP------/actions/runs/42951662112)는 327개 파일 중 1개 실패. `tests/meta-foundation-derivative-runtime.test.js`에서 이 PR이 수정하지 않은 `archive/data/meta-foundation/runtime/runtime-bridge-receipt.json`의 stale 상태를 보고했다. Archive 정본을 임의 갱신하거나 검사 기준을 낮추지 않았다. 최종 HEAD의 CI는 PR에서 별도 확인해야 하며 앞선 통과 결과를 승계하지 않는다.
  - **미완료 게이트:** 98해설 각각의 실제 390×844 진입·각 장·끝 카드·다시 보기·직접 해 보기, 자동 재생 정상 종료·터치·자막/그림 잘림·동기화, 변경 장면의 manual=1 탐구/정리/문제 전체 화면 비교 및 최종 HEAD의 필수 CI. 브라우저 실행 제한과 자동 승인 검토 거절 사유는 1차 기록과 같다. 소스/Board 검사는 실제 모바일 PASS가 아니다.
  - 다음: 같은 브랜치와 PR에서 위 검수 및 결함 수정을 마친 뒤 일반 PR 전환 여부를 판단한다. 이후 §5-2 `g7-surface-volume`으로 진행한다. main 병합·운영 배포는 사용자 별도 지시 전까지 수행하지 않는다. K1~K4는 공통 키트의 별도 브랜치/PR 범위로 유지한다.
