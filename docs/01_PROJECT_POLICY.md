# 01_PROJECT_POLICY

이 문서는 AP Math OS / 왕지교육 OS의 최상위 정책이다. 기존 `docs/guides/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`의 금지 원칙을 약화하지 않고, 문서 구조 재정비 기준으로 강화한다.

## 1. 요청 범위 보존

- 요청받은 범위만 수행한다.
- 기능 구현 요청이 아닌 문서 작업에서는 코드, UI, DB, migration, Worker route, API 동작을 수정하지 않는다.
- 작업 범위를 넓혀야 하면 먼저 사용자 확인을 받는다.
- 기존 dirty 파일은 사용자의 작업물로 간주하고 임의로 되돌리거나 정리하지 않는다.

## 2. UI 문구와 화면 보존

- 기존 UI 문구, 버튼명, 화면명, 메뉴명, 탭명, 라벨명, 운영 용어를 임의로 바꾸지 않는다.
- 사용자가 요청하지 않은 UI 텍스트 변경은 실패로 본다.
- 새 문구가 필요하면 기존 운영 용어와 충돌하지 않게 작성하고, 민감한 영역은 사용자 확인을 받는다.
- `숙제`를 `과제`로 바꾸는 것, `OMR 입력`을 다른 표현으로 바꾸는 것, 원장/관리자 화면명을 임의 확정하는 것은 금지한다.

## 3. UI 노출 승인 원칙

- DB/API/foundation이 이미 있어도 운영 화면에 새로 노출하려면 사용자 승인이 필요하다.
- 원장/admin 화면 카드, 통합 요약, 고급 설정, 로그, 개인정보, 수납/출납, 실제 발송/결제/청구 진입점은 기본 노출 금지다.
- 숨김 foundation은 `docs/implemented/CURRENT_HIDDEN_FOUNDATION_MAP.md`에 보류 사유를 남긴다.

## 4. 학생 포털 / OMR 정책

- 학생은 시험지를 직접 열 수 없다.
- 학생 포털은 배정 확인과 OMR 연결까지만 허용한다.
- 일반 시험 OMR은 제출 완료 후 수정, 재입력, 재제출 기능을 만들지 않는다.
- `material-omr` 계열 수업자료/교재 오답 수정 가능 정책은 일반 시험 OMR 금지 원칙을 바꾸지 않는다.
- 아카이브 원본 파일 경로를 학생에게 노출하지 않는다.

## 5. AP Math 보호와 왕지교육 OS 원칙

- AP Math 바닐라 JS 운영 화면은 독립 실행 가능한 핵심 모듈로 유지한다.
- 왕지교육 OS는 AP Math를 대체하지 않고 상위 운영층을 추가한다.
- 씨매쓰 초등, EIE 영어학원은 공통 foundation 위에 학원별 특화 모듈로 합류한다.
- 공통 foundation과 학원별 특화 기능은 문서와 route/UI 노출 기준에서 분리한다.

## 6. 선생님 화면과 원장/admin 화면 분리

- 선생님 현장 화면은 오늘 수업, 내 반, 출석, 숙제, 진도, 플래너, 상담 기록을 빠르게 쓰는 구조를 우선한다.
- 원장/admin 기능은 사용자 승인 없이 선생님 화면에 섞지 않는다.
- 선생님 화면에 수납/출납, 감사 로그, 고급 설정을 기본 노출하지 않는다.

## 7. DB/API/route 정책

- DB schema, migration, Worker route를 변경하면 관련 문서를 함께 업데이트한다.
- route 본문을 `apmath/worker-backup/worker/index.js`에 직접 늘리지 않는다. 새 기능은 route 파일로 분리하고 index는 위임만 담당하게 한다.
- SQL placeholder와 bind 개수, academy/branch/student/class scope, 권한 helper 사용 여부를 검수한다.
- 실제 결제, 실제 문자/알림톡 발송, 자동 청구 실행은 별도 승인 전 금지다.

## 8. Git / 배포 정책

- `git add`, `git commit`, `git push`는 사용자 명시 지시 없이는 금지한다.
- `wrangler deploy`, remote D1 apply, 운영 API smoke는 사용자 명시 지시 없이는 금지한다.
- 완료 보고에는 실제 생성/수정 파일, 실행한 명령, 확인하지 못한 파일, 다음 조치를 남긴다.

## 9. 기능별 고위험 영역

| 영역 | 위험 |
|---|---|
| 로그인/session/logout | 전체 운영 접근 불가, 권한 누락 |
| initial-data | 화면 전체 데이터 로딩 실패, teacher/admin scope 회귀 |
| classroom | 선생님 현장 사용성, 출결/숙제/플래너/일지 회귀 |
| timetable | 운영 데이터와 새학기 staging 혼선, class row 훼손 |
| billing/accounting | 금액 무결성, internal memo/외부 meta 누출 |
| student portal/OMR | 시험지 직접 열기, 제출 완료 후 수정 노출 |
| report AI | 학부모 문장 품질, 내부 시스템 표현 노출 |
| hidden foundation | 승인 없는 UI 노출 |

