# APMS Global UI Foundation Form and Modal Plan

## Modal

Modal은 하나의 작업 단계만 담는다. modal 안 card 안 card 구조를 만들지 않는다.

## Form

Input, textarea, select는 전역 selector로 바꾸지 않는다. 후속 적용 시 `.apms-form-*` 같은 명시 class를 붙여 좁게 적용한다.

## Cancel flow

APMS의 취소 버튼은 단순 닫기가 아니라 직전 단계 복귀일 수 있다. 기존 cancel/close/suppress 흐름을 보존한다.

## 이번 작업

이번 작업에서는 form/modal을 참고 계획으로만 남기고 실제 코드는 수정하지 않는다.

