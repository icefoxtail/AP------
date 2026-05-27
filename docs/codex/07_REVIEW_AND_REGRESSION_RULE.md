# 07_REVIEW_AND_REGRESSION_RULE

## 1. 검수 원칙

- 실제 파일을 열어 확인한 근거 없이는 PASS라고 쓰지 않는다.
- 미확인 파일은 미검수로 표시한다.
- 문서 검수도 기존 정책 약화, 숨김 foundation 노출, 현재/계획 혼선 여부를 확인한다.

## 2. 코드 변경 시 필수 점검

- import/export 누락
- `node --check` 가능 파일의 문법
- React/build가 있는 경우 build 실패 가능성
- undefined/null 접근
- SQL placeholder와 bind 개수
- API 응답 구조 불일치
- 권한, session, academy_id 또는 branch scope

## 3. 운영 회귀 체크

- 로그인/session/logout
- initial-data 응답 구조
- teacher/admin 권한
- 학생/반/담당반 scope
- classroom 화면
- planner SSO와 PC/모바일 보기
- student portal PIN
- OMR 제출 완료 수정 금지
- archive `MIXED:{key}` 처리
- report AI 학부모 문구 품질
- billing 금액 무결성
- timetable 운영/staging 분리
- 기존 UI 문구 변경 여부
- 숨겨진 foundation UI 노출 여부

