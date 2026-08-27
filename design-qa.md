# 단원별 기출 UI 디자인 QA

## 비교 대상

- source visual truth path: `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\final-target.png`
- implementation screenshot path: `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\implementation-confirmation-1536x1024-pass2.png`
- full-view comparison: `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\design-qa-comparison-pass2.png`
- focused summary comparison: `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\design-qa-focused-summary-pass2.png`
- responsive evidence:
  - `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\implementation-mobile-320-pass3.png`
  - `C:\Users\USER\Desktop\AP------\reports\unit-past-exams-ui-redesign-20260827\implementation-tablet-768.png`

## 캡처 조건

- state: 고1 · 공통수학1 · 다항식의 연산 · 전체 아카이브 · 시험 대비 · 12문항 · 확인 단계
- source pixels: 1487 × 1058
- implementation pixels: 1521 × 1014
- implementation CSS viewport: 1536 × 1024, device density 1
- normalization: 원본 비율은 유지한 채 두 이미지를 각각 760px 너비로 축소해 한 캔버스에 좌우 배치했다. 생성 설계안과 브라우저 캡처의 원본 종횡비가 달라 강제 크롭이나 비율 왜곡은 하지 않았다.
- mobile CSS viewport: 320 × 844, 가로 overflow 없음
- tablet CSS viewport: 768 × 844, 가로 overflow 없음

## 최종 Findings

- actionable P0/P1/P2 없음.
- [P3] 설계안은 하단 페이지 이동·배율 조절을 보여주지만 구현은 실제 문제지 iframe 내부 스크롤을 사용한다. 실제 아카이브 렌더러를 그대로 재사용하기 위한 의도적인 차이이며, 인쇄 결과와 화면 결과의 일치성이 더 중요하므로 현재 수용 가능하다. 추후 필요하면 읽기 전용 배율 조절을 추가할 수 있다.
- [P3] 구현 상단에는 기존 제품의 `JS 아카이브` 복귀 버튼, 교육과정 표기, 자료 집계가 남아 있다. 생성 설계안에는 없는 요소지만 기존 제품 문맥과 복귀 경로를 보존하기 위한 의도적인 차이다.

## 필수 fidelity surface 검토

- fonts and typography: Pretendard/시스템 산세리프 계열, 굵기 단계, 작은 보조문구와 제목 위계가 설계 의도와 일치한다. 문제지 본문은 실제 수식 렌더러를 사용해 생성 목업보다 실사용 충실도가 높다. 잘림이나 부자연스러운 줄바꿈 없음.
- spacing and layout rhythm: 4단계 스테퍼, 컨텍스트 행, 대형 미리보기와 우측 요약의 구성이 유지된다. 비오류 상태 스트립을 시각적으로 접어 중복 여백을 제거했고 320/768/1536 폭에서 가로 넘침이 없다.
- colors and visual tokens: 딥 네이비, 코랄 강조, 흰 카드, 옅은 회색 구분선이 설계안과 일관된다. primary/disabled/focus/error 상태의 대비가 유지된다. 그라데이션 없음.
- image quality and asset fidelity: 미리보기는 가짜 도형이나 플레이스홀더가 아니라 실제 아카이브 문제지 렌더 결과다. 아이콘은 Font Awesome 한 계열로 통일했고 커스텀 SVG·CSS 그림·이모지를 쓰지 않았다.
- copy and content: `단원 → 출처 → 구성 → 확인`, `전체 아카이브 / 학교·연도 지정`, `일반 출력 / 학생에게 출제`가 독립적으로 이해된다. 학교별 결과에서는 요청 문항 수 대신 현재 문제지의 실제 문항 수를 보여준다.
- accessibility and interactions: 네이티브 button/input/select, 44px 최소 타깃, `focus-visible`, aria-live 오류 상태, 키보드 접근, 활성 단계와 선택 상태를 확인했다.

## 비교 이력

### Pass 1

- [P2] 확인 화면에서 `구성 수정`이 미리보기 헤더와 요약 패널에 중복 노출됐다.
  - fix: 요약 패널의 단일 버튼만 유지했다.
- [P2] 학교별 문제지가 실제 4문항인데 상단 컨텍스트가 요청값 12문항을 계속 표시해 결과 해석이 어긋났다.
  - fix: 확인 단계 컨텍스트를 활성 문제지의 학교명·실제 문항 수로 계산하도록 변경했다.
- [P2] 일반 성공 상태 스트립이 컨텍스트와 같은 정보를 반복하며 설계안보다 상단을 과도하게 밀어냈다.
  - fix: 로딩·오류만 시각적으로 노출하고 정상 상태는 접근성 트리에 남긴 채 시각적으로 접었다. 앱바 높이도 88px에서 74px로 줄였다.
  - post-fix evidence: `design-qa-comparison-pass2.png`

### Responsive follow-up

- [P1] 320px에서 데스크톱으로 먼저 로드된 iframe이 리사이즈 후 `screen-fit-mode`를 얻지 못해 문제지 페이지가 빈 회색 영역처럼 보였다.
  - fix: 확인 iframe에 항상 화면 맞춤 모드를 적용하고, 640px 이하에서는 변환 기준점을 좌측 상단으로 고정했다.
  - post-fix evidence: `implementation-mobile-320-pass3.png` — 실제 3페이지 문제지가 축소 표시되고 외부 가로 overflow가 없다.

## 기능 검증

- 단원 선택 후 기본 전체 아카이브 구성으로 바로 진입
- 출처 단계에서 학교·연도 지정 전환, 학교 검색·전체 선택·해제
- 소단원·난이도·문항 수가 출처와 관계없이 공통 구성 화면에 한 번만 존재
- 실제 문제지 iframe 렌더, 일반 출력, 학생 출제 연결
- 320px, 768px, 1536px 레이아웃 및 브라우저 console error/warn 0건
- 전체 자동 테스트: PASS 138 / FAIL 0 / KNOWN-FAIL 0

## Follow-up Polish

- 필요 시 실제 문제지 iframe에 읽기 전용 확대/축소 컨트롤을 추가한다.

final result: passed
