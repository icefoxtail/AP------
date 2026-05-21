# APMS Global UI Foundation Index

## 목적

Academy OS의 디자인 언어를 APMS vanilla JS 화면에 맞게 번역해, 이후 화면들이 같은 UI 언어를 공유하도록 하는 상위 인덱스다. 이번 실제 적용은 `classroom.js`의 1차 안전 영역으로 제한한다.

## 관계

- Academy OS는 token, sidebar row, card, button, badge/chip, spacing, typography의 참고 기준이다.
- APMS는 기존 문구, 버튼명, 화면명, 함수명, API 호출, 저장 로직을 보존한다.
- Academy OS 파일은 참고만 하며 수정하지 않는다.

## 읽는 순서

1. `APMS_GLOBAL_UI_FOUNDATION_TOKENS.md`
2. `APMS_GLOBAL_UI_FOUNDATION_CARD_ROW.md`
3. `APMS_GLOBAL_UI_FOUNDATION_BUTTON_CHIP.md`
4. `APMS_GLOBAL_UI_FOUNDATION_CLASSROOM_FIRST.md`
5. 각 bridge/rollout/SOP 문서

## 문서 역할

- Tokens: 색상, radius, spacing, typography, shadow, hover/active 번역.
- Card/Row: outer card와 line row의 경계.
- Button/Chip: quiet/primary/danger button과 chip 규칙.
- Sidebar/Dashboard Bridge: 기존 완료 영역과 전역 foundation의 연결 방식.
- Classroom First: 이번 1차 적용 범위.
- Student/Form/Table Plans: 후속 화면 적용 기준.
- Rollout Map: 적용 순서.
- Review SOP: 검수 방식.

## 이번 작업 범위

공통 foundation CSS와 classroom 전용 CSS를 만들고, `apmath/index.html`에 중복 없이 연결한다. `classroom.js`는 상단 요약, toolbar, 학생 목록 board/row, empty state에 class를 병행 적용한다.

