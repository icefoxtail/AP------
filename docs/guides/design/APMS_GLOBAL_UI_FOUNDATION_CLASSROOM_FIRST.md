# APMS Global UI Foundation Classroom First

## 적용 범위

이번 실제 적용은 `classroom.js`의 1차 안전 영역으로 제한한다.

- 반 화면 상단 요약
- 운영 날짜와 주요 버튼 toolbar
- 학생 목록 board
- 학생 row
- 출결/숙제/지각/보강/상담 상태 표시
- empty state

## 보류 영역

- modal 구조 전체 개편
- 모든 inline style 제거
- 저장 로직 변경
- 출결/숙제/상담/플래너 API 호출 변경
- 데이터 구조 변경
- 새 기능 추가

## 적용 원칙

기존 `cls-v4-*` class와 함께 `apms-*`, `ap-classroom-*` class를 병행 적용한다. 새 class는 CSS foundation 연결점으로만 쓰며 기존 함수명, onclick, 버튼명, toast, modal 제목은 보존한다.

## 금지

이모지, 이미지, 장식 아이콘을 추가하지 않는다. 상태 색상은 과하게 키우지 않는다. 새 font-weight 700 이상을 만들지 않는다.

