# Product

<!-- impeccable:product-schema 1 -->

> 범위: **AP Math 제품군**만 다룬다. JS아카이브(`archive/`), AP Math OS·APMS(`apmath/`), 학생 포털(`apmath/student/`), 도형실험실(`apmath/playground/`), 홈(`apmath-home/`).
> 이 저장소에는 왕지교육 허브(`index.html`), 시매쓰(`cmath-home/`), EIE 영어(`eie-home/`, `eie/`)도 있지만 이 문서의 범위 밖이다. 필요하면 해당 폴더에 따로 PRODUCT.md를 둔다.
> 시각 체계(DESIGN.md)는 화면 폴더별로 둔다. 현재 `apmath/playground/DESIGN.md`만 있다.

## Platform

web

(모바일 웹 포함. 학생 포털 `apmath/student/`는 `manifest.json`과 `sw.js`가 있는 PWA, APMS `apmath/`도 `manifest.json`과 `service-worker.js`가 있다. 네이티브 앱은 없다. 모두 정적 파일로 배포하고 빌드 도구 없이 `<script>`로 쓰는 화면이 많다.)

## Users

**학생 — 휴대폰으로 혼자.** 수업 밖에서 혼자 기출 풀이를 보고, 해설과 정답을 확인하고, 숙제·플래너·OMR 제출·오답 클리닉을 하고, 도형실험실로 개념을 복습한다. 곁에서 설명해 줄 사람이 없다. 화면만 보고 이해하고 눌러야 한다.

**교사 — 관리 업무.** APMS로 출결·성적·숙제·클리닉을 관리하고, 시험지를 출력한다.

사용자가 주 사용자로 고르지 않은 대상: 교사의 수업 중 시연, 학부모. 도형실험실의 수업 모드(`T` 키) 같은 기능은 아래 Capabilities에 사실로만 적고, 설계 기준은 위 두 사용자에 둔다.

## Product Purpose

중·고등 수학 학원(AP Math)의 학습·운영을 한 묶음으로 돕는다. 학생에게는 기출 풀이·해설·숙제·오답 복습을 혼자 해낼 수 있는 화면을, 교사에게는 출결·성적·숙제·클리닉 관리와 시험지 출력 업무를 준다. 성공은 학생이 화면 앞에서 막히지 않고 이해하고 끝내는 것, 교사가 관리 업무를 빠르고 틀림없이 끝내는 것이다.

## Positioning

(저장소에서 확인한 사실만 적는다. 마케팅 문구가 아니다.)
- 학교별 기출 원본을 한 곳에서 시험지·풀이·정답 모드로 직접 열 수 있다(`archive/engine.html?data=exams/<file>&mode=exam|sol|ans`).
- 도형실험실은 도형을 직접 움직여 보며 개념을 확인하고, 풀이 단계를 누를 때마다 그림에 보조선이 드러난다(`apmath/playground/next/README.md`).
- 학생 포털은 AP Math OS의 학생용 입구다(`apmath/student/manifest.json` 설명: 과제, 플래너, OMR).

## Operating Context

- 학생: 휴대폰, 혼자. 학생 포털 매니페스트는 세로 화면(`portrait-primary`)을 지정한다.
- 교사: APMS 관리 화면과 시험지 출력.
- 배포: GitHub Pages(`https://icefoxtail.github.io/AP------/...`) 정적 호스팅. 도메인 이전 계획 문서가 `docs/operations/WangjiEdu_Domain_Migration_Plan_v1.md`에 있다.
- 작업 규칙은 `AGENTS.md`와 영역별 `docs/agents/*.md`가 정한다.

## Capabilities and Constraints

기능(현재 있는 것):
- JS아카이브: 학교별 기출 시험지·풀이·정답 보기, 문제 검색, 시험지 구성·출력(`archive/`).
- AP Math OS·APMS: 출결·성적·숙제·클리닉 관리(`apmath/`).
- 학생 포털: 과제, 플래너, OMR, 오답 클리닉(`apmath/student/`).
- 도형실험실 2.0: 실험실 43개, 탐구·정리·문제 3개 탭, 풀이 단계 공개, 수업 모드와 판서, QR로 지금 장면 공유(`apmath/playground/next/`). 기존 화면은 `apmath/playground/labs/`에 비교·호환용으로 남아 있다.

지켜야 할 규칙(출처는 현행 저장소 규칙이다. 이번 인터뷰의 새 답이 아니다):
- 원본 기출은 `archive/engine.html?data=exams/<file>&mode=exam|sol|ans`로 바로 열리게 유지한다. (`AGENTS.md`)
- Archive 2.0 화면·검색·출력·저장 코드를 바꾸면 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 따르고, 병합 전에 `node tools/check-archive2-runtime.cjs`를 통과시킨다. (`AGENTS.md`, `archive/AGENTS.md`)
- 문항의 수학 값·정답·해설은 디자인 작업으로 바꾸지 않는다. (`.claude/skills/README.md`의 impeccable 적용 규칙, 실험실 이식 원칙 `apmath/playground/next/README.md` §4)
- 화면 개선은 학생이 실제 화면(PC·휴대폰)에서 보고 이해할 수 있는가로 판정한다. (`CLAUDE.md`)

미정(사용자 결정 필요): 학생 포털·APMS의 확대 막기 설정(`user-scalable=no`)을 유지할지. 현재 학생 포털과 `apmath/index.html`이 쓰고 있다.

## Evidence on Hand

- 실제 문항 시험지·해설·그림: `archive/`, `apmath/playground/next/labs/`.
- 후기·고객 수치·가격·성과 통계는 이 저장소에 없다. 만들어 쓰지 않는다. `apmath-home/`의 소개 문구는 기존 카피이며 새 주장의 근거로 쓰지 않는다.

## Product Principles

1. **화면에서 학생들이 사용하는 게 최우선.** 학생이 휴대폰에서 혼자 보고 이해하고 누를 수 있는지가 모든 판단의 첫 기준이다. 관리 화면의 편의나 수치상의 완벽보다 앞선다. (사용자 원문)
2. **학생에게 필요한 값은 화면에 있어야 한다.** 그림·표·해설에서 숫자, 라벨, 단위가 가려지거나 빠지면 그 화면은 완성이 아니다.
3. **깨지거나 안 눌리는 것이 먼저다.** 오류, 깨진 그림, 가려지는 내용, 동작하지 않는 버튼을 장식 개선보다 먼저 고친다.
4. **수학 내용은 디자인이 바꾸지 않는다.** 문항의 값·정답·해설은 그대로 두고 표시 방식만 다룬다.
5. **교사 도구는 정확하고 빠르게.** 관리 화면은 반복 업무를 줄이고 틀리기 어렵게 한다.

## Accessibility & Inclusion

확정된 기준(WCAG 등급 등)은 없다. 미정(사용자 결정 필요). 사실: 사용자는 한국어 사용 학생이며 휴대폰 터치 사용이 기본이다.
