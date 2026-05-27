# APMS Global UI Foundation Table Exception Plan

## 예외 원칙

시간표, 출석부, 리포트는 마지막 적용 대상으로 둔다. 색상, 열 너비, 인쇄, PDF 출력 영향이 크기 때문이다.

## 금지

- 전역 table CSS 금지.
- `td`, `tr`, `input`, `textarea`, `select` 전역 selector 수정 금지.
- `timetable.js`, `report.js`, `cumulative.js`는 이번 작업에서 수정 금지.

## 후속 적용

각 화면은 별도 설계와 캡처 검수 후 전용 class로만 적용한다.

