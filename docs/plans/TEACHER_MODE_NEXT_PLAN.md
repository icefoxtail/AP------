# TEACHER_MODE_NEXT_PLAN

## 0. Onboarding Round 1 Boundary

신입생 적응 확인은 Round 1에서 DB/API foundation까지만 구현한다. 선생님 화면에 신입생 적응 카드, 슬라이드 패널, CSS, D+14/지연 경고, 문자 발송 UI를 붙이는 작업은 후속 Round에서 별도 승인 후 진행한다.

## 1. 현재 상태

선생님 화면의 중심은 dashboard와 classroom이다. 담당반 scope는 `teacher_classes`와 initial-data 분기로 처리된다.

## 2. 최종 목표

오늘 수업, 내 반, 출석, 숙제, 진도, 플래너, 상담 기록 중심의 빠른 현장 화면을 유지한다.

## 3. 절대 금지/보류

- 선생님 기본 화면에 복잡한 관리/수납/감사/권한 기능 노출 금지
- 기존 classroom 문구/버튼명 변경 금지

## 4. Phase 구조

1. 현재 classroom 흐름 실사
2. 고위험 회귀 테스트 정의
3. 오늘 수업 중심 정리
4. 상담/플래너 연결 안정화

## 5. 작업 후 업데이트 문서

`CLASSROOM_DOMAIN.md`, `STUDENTS_CLASSES_DOMAIN.md`, `CURRENT_FRONTEND_MAP.md`, `CURRENT_AUTH_PERMISSION_MAP.md`

