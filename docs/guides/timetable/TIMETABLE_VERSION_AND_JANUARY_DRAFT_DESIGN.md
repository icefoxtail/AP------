# TIMETABLE_VERSION_AND_JANUARY_DRAFT_DESIGN

## 1. 목적

AP Math OS에 `시간표 버전 / 다음 연도 초안 시간표` 개념을 도입하기 위한 설계 초안이다.

핵심 목적은 12월부터 다음 해 1월 시간표를 현재 운영 시간표와 분리해 미리 설계하고, 원장 최종 확인 또는 적용 예약을 통해 운영 시간표로 반영할 수 있는 구조를 정의하는 것이다.

이 문서는 구현 문서가 아니라 설계 문서다. 따라서 코드, DB schema, migration, API, UI는 변경하지 않는다.

## 2. 현재 구조와 문제점

현재 중등부 전체시간표는 `class_time_slots`를 우선 기준으로 렌더링하고, 데이터가 없을 때 `classes.schedule_days`, `classes.day_group`, `classes.time_label`을 fallback으로 사용한다.

이미 가능한 기능은 다음과 같다.

- 중등부 원장모드 반 카드 드래그 이동
- 중등부 빈 셀 `+ 반 추가`
- 반 이동 시 `class_time_slots` 저장
- 반 이동 시 `classes.schedule_days/day_group/time_label` 호환 동기화
- 반 이동 또는 반 추가 후 `timetable-conflicts/scan`
- 원장모드 학생 드래그 전반
- 전반 저장 API

현재 문제는 `class_time_slots`가 곧 현재 운영 시간표라는 점이다. 2026년 12월에 2027년 1월 시간표를 미리 만들려면 운영 중인 시간표를 건드릴 위험이 있다. 특히 반 승급, 중3에서 고1 전환, 새 중1반 추가, 학생 전반 후보 확인 같은 1월 개편 작업은 실제 운영 데이터와 초안 데이터가 섞이기 쉽다.

## 3. 목표 구조

목표 구조는 시간표를 세 종류로 나누는 것이다.

```text
현재 운영 시간표
- 지금 실제 수업에 쓰는 active 시간표

다음 연도 초안 시간표
- 12월부터 미리 만드는 draft/scheduled 시간표
- 현재 운영 시간표에 영향 없음

보관 시간표
- 이전 연도 시간표 archived
```

예시는 다음과 같다.

```text
2026 운영 시간표
- status: active
- effective_from: 2026-01-01
- effective_to: 2026-12-31

2027 1월 개편 초안
- status: draft 또는 scheduled
- effective_from: 2027-01-01
- source: 2026 운영 시간표 복사본
```

## 4. 시간표 버전 개념

시간표 버전은 특정 학년도 또는 특정 적용 기간에 쓰일 시간표 묶음이다. 하나의 버전은 머리 정보와 슬롯 목록으로 구성된다.

- 머리 정보: 학년도, 제목, 상태, 적용일, 원본 버전, 생성자, 메모
- 슬롯 정보: 반별 요일, 시작 시간, 종료 시간, 교실, 메모

운영 원칙은 다음과 같다.

- active 버전은 실제 운영 시간표다.
- draft 버전은 현재 운영 시간표에 영향을 주지 않는 편집용 초안이다.
- scheduled 버전은 적용 예정일이 저장된 초안이다.
- archived 버전은 과거 운영 시간표 보관본이다.
- cancelled 버전은 만들었지만 폐기한 초안이다.

## 5. DB 설계 후보

### timetable_versions

역할:

- 시간표 버전의 머리 정보
- 연도별 active/draft/scheduled/archived 관리
- 다음 연도 초안과 이전 연도 보관본의 기준점

후보 필드:

```text
id
school_year
title
status
source_version_id
effective_from
effective_to
created_by
created_at
updated_at
activated_at
archived_at
memo
```

status 후보:

```text
draft
scheduled
active
archived
cancelled
```

권장 제약:

- 같은 기간에 active 버전은 하나만 존재해야 한다.
- `source_version_id`는 복사 원본 추적용이며 nullable이다.
- `effective_from`은 scheduled 또는 active 전환 판단 기준이다.
- `archived_at`은 active에서 archived로 전환될 때 기록한다.

### timetable_version_slots

역할:

- 특정 시간표 버전에 속한 반 시간 slot 목록
- 현재 `class_time_slots`의 버전별 저장소
- draft/scheduled/archived 시간표를 운영 시간표와 분리해 저장

후보 필드:

```text
id
version_id
class_id
day_of_week
start_time
end_time
room_name
memo
created_at
updated_at
```

권장 제약:

- `version_id`는 `timetable_versions.id`를 참조한다.
- `class_id`는 기존 `classes.id`를 참조하되, draft class snapshot을 도입할 경우 연결 기준을 재검토한다.
- 동일 버전 안에서 같은 반의 슬롯 중복 저장을 막는 최소 검증이 필요하다.

## 6. class_time_slots와 버전 슬롯의 관계

### A안. class_time_slots는 active 운영 시간표로 유지

```text
class_time_slots
- 현재 active 시간표만 저장

timetable_version_slots
- draft/scheduled/archived 저장
```

장점:

- 기존 화면/API 영향이 적다.
- 현재 구현과 호환이 좋다.
- 전체시간표, 드래그 이동, `+ 반 추가`, 충돌 스캔의 현재 동작을 유지하기 쉽다.
- active 시간표는 기존 `class_time_slots` 기준으로 계속 동작한다.

단점:

- draft 적용 시 `class_time_slots`를 새 active version slots로 교체해야 한다.
- 최종 적용 로직이 별도로 필요하다.
- active version과 `class_time_slots`의 동기화 상태를 관리해야 한다.

### B안. class_time_slots에도 version_id 추가

장점:

- 구조적으로는 모든 시간표 슬롯이 하나의 테이블에 모여 깔끔하다.
- active/draft/scheduled/archived를 같은 조회 모델로 다룰 수 있다.

단점:

- 기존 API, 렌더링, 충돌 스캔, 저장 로직 수정 범위가 크다.
- migration 영향이 크다.
- 현재 `class_time_slots = 운영 시간표`라는 구현 전제를 깨뜨린다.
- 1월 개편 설계의 1차 구현 범위로는 위험하다.

### 추천

현실적 추천은 A안이다.

이유는 현재 운영 안정성이 가장 중요하기 때문이다. `class_time_slots`는 active 운영 시간표로 유지하고, `timetable_version_slots`는 draft/scheduled/archived의 분리 저장소로 둔다. 최종 적용 시에만 version slots를 `class_time_slots`로 반영한다.

## 7. 12월 사전 설계 흐름

12월에는 현재 운영 시간표를 유지하면서 다음 해 1월 시간표 초안을 만든다.

기본 흐름:

```text
1. 원장모드에서 다음 연도 초안 생성
2. 현재 active 시간표를 복사해 draft version 생성
3. draft version slots를 별도 저장
4. 초안 화면에서 중등부 반 드래그, + 반 추가, 충돌 확인
5. 반 승급 미리보기와 학생 전반 후보 확인
6. 변경 요약 확인
7. 적용일 저장 또는 원장 최종 확인 대기
```

중요 원칙:

```text
초안 편집은 timetable_version_slots를 수정한다.
현재 class_time_slots는 수정하지 않는다.
```

## 8. 1월 적용 흐름

1월에는 원장 확인을 거쳐 초안을 운영 시간표로 반영한다.

최종 적용 처리:

```text
1. 현재 active version archived 처리
2. scheduled/draft version active 처리
3. class_time_slots를 새 active version slots로 교체
4. classes.schedule_days/day_group/time_label 호환 필드 동기화
5. timetable-conflicts/scan 실행
6. 적용 로그 기록
```

적용은 트랜잭션 단위로 처리되어야 한다. 중간 실패 시 기존 운영 시간표가 유지되어야 하며, 적용 대상 version의 상태도 잘못 바뀌면 안 된다.

## 9. active / draft / scheduled / archived 상태 정의

```text
draft
- 초안 작성 중
- 현재 운영 시간표에 영향 없음
- 수정 가능

scheduled
- 적용 예정일이 저장된 초안
- 현재 운영 시간표에 영향 없음
- 원장 확인 전까지 수정 또는 예약 취소 가능

active
- 현재 운영 시간표
- 전체시간표 기본 화면과 실제 수업 운영 기준
- 원칙적으로 하나만 존재

archived
- 과거 운영 시간표 보관본
- 수정 불가 또는 제한적 메모 수정만 허용

cancelled
- 폐기된 초안
- 운영 반영 대상 아님
- 감사/추적 목적 보관 가능
```

## 10. 초안 생성 흐름

원장모드에서만 가능하게 설계한다.

버튼 후보:

```text
다음 연도 시간표 초안 만들기
2027년 1월 개편 초안 만들기
```

동작:

```text
1. 현재 active timetable_version 확인
2. active version의 slots 또는 현재 class_time_slots 확인
3. 새 timetable_versions row 생성
4. timetable_version_slots에 복사본 생성
5. status = draft
6. effective_from = 다음 해 1월 1일
7. source_version_id = 현재 active version id
```

초기 도입 시 active version이 아직 없다면 현재 `class_time_slots`를 기준으로 active version을 먼저 백업한 뒤 초안을 생성한다.

## 11. 초안 편집 흐름

초안 편집 화면에서는 현재 운영 데이터에 영향 없이 아래 작업이 가능해야 한다.

- 중등부 반 카드 드래그
- 빈 셀 `+ 반 추가`
- 반 승급 미리보기
- 중3에서 고1 전환 미리보기
- 학생 전반 후보 확인
- 충돌 스캔 preview
- 변경 요약 확인

초안 편집 저장 대상:

```text
timetable_version_slots
```

운영 시간표 저장 대상이 아닌 것:

```text
class_time_slots
classes.schedule_days
classes.day_group
classes.time_label
```

단, 최종 적용 시에는 호환 필드 동기화가 필요하다.

## 12. 반 승급과의 연결

기본 승급 규칙:

```text
중1 -> 중2
중2 -> 중3
중3 -> 고1
고1 -> 고2
고2 -> 고3
```

반 이름 예시:

```text
중1A -> 중2A
중2A -> 중3A
중3A -> 고1A
고1A -> 고2A
고2A -> 고3A
```

핵심 설계 질문:

```text
시간표 버전만 draft로 둘 것인가?
반 이름/학년 승급도 draft로 둘 것인가?
```

### 방식 1. 시간표만 draft, 반 승급은 최종 적용 때 실제 classes 수정

장점:

- 구현 규모가 작다.
- 기존 `classes` 구조를 거의 건드리지 않는다.
- 1차 구현에 적합하다.

단점:

- 초안 화면에서 `중1A`를 `중2A`처럼 보여주려면 임시 표시 로직이 필요하다.
- 12월 미리보기와 실제 데이터 사이에 차이가 생길 수 있다.
- 새 중1반, 중3에서 고1 전환, 고3 처리까지 들어가면 임시 표시 로직이 복잡해진다.

### 방식 2. draft class snapshot도 만든다

후보 테이블:

```text
timetable_version_classes
- version_id
- class_id
- draft_name
- draft_grade
- draft_teacher_name
- draft_subject
- is_new_class
- source_class_id
```

장점:

- 12월에 2027년 시간표를 실제처럼 미리 볼 수 있다.
- 반 승급, 새 반 생성, 중3에서 고1 전환을 초안에 안전하게 담을 수 있다.
- 최종 적용 전 변경 요약을 정확히 만들 수 있다.

단점:

- 구현 규모가 커진다.
- 최종 적용 로직이 복잡해진다.
- `class_id`와 draft class의 식별자 체계를 명확히 해야 한다.

### 추천

운영 안정성 기준으로는 방식 2가 더 안전하다. 다만 1차 구현 범위에서는 방식 1로 시작하고, 2차에서 `timetable_version_classes`를 도입하는 단계적 접근을 추천한다.

1차에서는 초안 slot 분리를 먼저 완성한다. 반 승급은 preview 결과와 표시명 override 수준으로 제한한다. 새 반 생성과 중3에서 고1 전환을 실제처럼 다뤄야 하는 시점에는 draft class snapshot이 필요하다.

## 13. 새 중1반 생성과의 연결

초안 편집 모드에서 빈 중등 셀 `+ 반 추가`를 사용할 수 있게 설계한다.

후보:

```text
A. 실제 classes row를 바로 생성하지 않고 draft class로만 생성
B. 실제 classes row를 inactive/draft 상태로 생성
C. 실제 classes row를 생성하되 active 적용은 나중에 함
```

### A안. draft class로만 생성

장점:

- 현재 운영 데이터에 영향이 없다.
- 초안 삭제 또는 취소가 쉽다.
- 12월 사전 설계 목적에 가장 잘 맞는다.

단점:

- draft class를 저장할 별도 구조가 필요하다.
- 초안 슬롯이 실제 `classes.id`가 아닌 draft class 식별자를 참조할 수 있어야 한다.

### B안. 실제 classes row를 inactive/draft 상태로 생성

장점:

- 기존 class 기반 기능을 재사용하기 쉽다.
- `class_id` 참조 구조가 단순하다.

단점:

- inactive/draft class가 다른 화면이나 API에 노출되지 않도록 모든 조회에서 주의해야 한다.
- 운영 데이터와 초안 데이터가 같은 테이블에 섞인다.

### 추천

운영 안전성 기준으로는 A안이 가장 안전하다. 다만 구현 난도가 높으므로 1차 구현에서는 새 중1반 생성을 보류하거나, 제한된 내부 preview로만 다루는 것을 추천한다. 정식 초안 생성/편집 기능이 안정화된 뒤 draft class snapshot과 함께 A안을 도입하는 것이 좋다.

## 14. 학생 전반과의 연결

현재 원장모드 학생 드래그 전반과 전반 저장 API가 존재한다. 시간표 초안 시스템에서는 학생 전반도 운영 데이터와 분리되어야 한다.

1차 설계 원칙:

- 현재 학생 소속 변경은 active 운영 데이터 기준으로 유지한다.
- 초안 화면에서는 학생 전반 후보 또는 미리보기만 제공한다.
- 실제 학생 반 이동은 최종 적용 단계 또는 별도 원장 확인 단계에서 실행한다.

향후 후보 테이블:

```text
timetable_version_student_moves
- version_id
- student_id
- from_class_id
- to_class_id
- reason
- status
- created_at
- updated_at
```

학생 전반은 반 승급, 새 반 생성, 중3에서 고1 전환과 강하게 연결된다. 따라서 draft class snapshot 없이 완전한 학생 전반 초안을 구현하면 데이터 의미가 불명확해질 수 있다.

## 15. 충돌 스캔 preview 설계

현재 `timetable-conflicts/scan`은 active `class_time_slots` 기준이다. 초안 시간표 충돌을 확인하려면 운영 시간표를 바꾸지 않는 preview 스캔이 필요하다.

### A안. draft slots를 임시로 scan하는 API

후보:

```text
POST /api/timetable-versions/:id/scan-preview
```

입력:

```text
version_id
```

동작:

```text
timetable_version_slots 기준으로 student/teacher/room 충돌 계산
운영 timetable_conflict_logs에는 저장하지 않고 preview 반환
```

장점:

- 운영 시간표를 변경하지 않는다.
- 초안 상태에서 안전하게 충돌을 확인할 수 있다.
- 최종 적용 전 검증 단계로 사용하기 좋다.

### B안. draft를 class_time_slots에 적용한 뒤 기존 scan 사용

위험:

```text
현재 운영 시간표가 바뀌므로 부적합
```

### 추천

`scan-preview` 별도 설계를 추천한다. 운영 로그에는 저장하지 않고 preview 결과만 반환해야 한다. 최종 적용 이후에는 기존 `timetable-conflicts/scan`을 실행해 운영 기준 로그를 남긴다.

## 16. 자동 적용 vs 원장 확인 적용

선택지:

```text
A. 완전 자동 적용
- effective_from이 지나면 scheduled가 active로 자동 전환

B. 로그인 시 원장에게 적용 안내
- "2027년 시간표 초안이 적용일을 지났습니다. 운영 시간표로 적용할까요?"

C. 수동 적용만
- 원장이 직접 누르기 전까지 draft 유지
```

추천은 B안이다.

이유:

- 1월 1일이 휴일일 수 있다.
- 학원 개강일이 다를 수 있다.
- 마지막 수정이 필요할 수 있다.
- 자동 적용 사고를 막을 수 있다.
- 적용일이 지난 초안을 놓치지 않게 안내할 수 있다.

운영 안정성 기준으로는 다음 흐름이 좋다.

```text
1. scheduled version의 effective_from이 지남
2. 원장 로그인 또는 initial-data 로드 시 안내 표시
3. 원장이 최종 확인
4. activate 실행
```

완전 자동 적용은 보류한다.

## 17. 필요한 API 후보

구현 후보 API는 다음과 같다. 이번 문서에서는 후보만 정리하며 실제 API는 추가하지 않는다.

```text
GET /api/timetable-versions
POST /api/timetable-versions
GET /api/timetable-versions/:id
PATCH /api/timetable-versions/:id
DELETE /api/timetable-versions/:id

POST /api/timetable-versions/:id/clone-active
POST /api/timetable-versions/:id/schedule
POST /api/timetable-versions/:id/activate
POST /api/timetable-versions/:id/cancel

GET /api/timetable-versions/:id/slots
POST /api/timetable-versions/:id/slots/replace-class-slots

POST /api/timetable-versions/:id/scan-preview
POST /api/timetable-versions/:id/rollover-preview
POST /api/timetable-versions/:id/rollover-apply-preview
```

추가로 최종 적용 로그가 필요하다면 다음 후보를 검토한다.

```text
GET /api/timetable-versions/:id/apply-log
```

## 18. 필요한 화면 후보

전체시간표 상단 후보:

```text
현재 운영 시간표: 2026
[2027년 1월 개편 초안]
```

초안 화면 상단 후보:

```text
2027년 1월 개편 초안
상태: 초안
적용 예정일: 2027-01-01
[승급 미리보기]
[충돌 확인]
[적용 예약]
[운영 시간표로 적용]
[초안 삭제]
```

선생님모드:

- 현재 운영 시간표만 보기
- 초안 편집 불가
- 초안 노출 여부는 보류

원장모드:

- 초안 생성
- 초안 열기
- 초안 편집
- 충돌 확인
- 적용 예약
- 최종 적용
- 초안 삭제/취소

## 19. 1차 구현 추천 범위

1차 구현은 운영 시간표를 건드리지 않는 foundation에 집중하는 것을 추천한다.

추천 범위:

```text
1. timetable_versions / timetable_version_slots foundation 추가
2. 현재 active 시간표를 version으로 백업
3. 다음 연도 초안 생성 API
4. 초안 slot 조회/수정 API
5. scan-preview API
6. UI는 최소: 초안 목록/생성/열기
```

1차에서 포함하지 않는 것이 좋은 것:

- 실제 반 승급 적용
- 새 중1반 정식 생성
- 학생 일괄 승급 실제 적용
- 최종 적용 자동화
- 고등부 드래그

1차의 성공 기준은 `12월에 운영 시간표를 건드리지 않고 다음 연도 초안 슬롯을 만들고 수정하고 충돌 preview를 볼 수 있음`이다.

## 20. 2차 구현 추천 범위

2차 구현에서는 1월 개편 기능을 확장한다.

추천 범위:

```text
1. draft class snapshot 설계 및 구현
2. 반 승급 preview 고도화
3. 새 중1반 draft 생성
4. 중3 -> 고1 전환 preview
5. 학생 전반 후보 저장
6. 변경 요약 화면
7. 원장 최종 확인 apply flow
8. class_time_slots 교체 및 호환 필드 동기화
9. 적용 로그 기록
```

2차의 성공 기준은 `초안이 실제 다음 해 시간표처럼 보이고, 원장 확인 후 운영 시간표로 안전하게 적용됨`이다.

## 21. 보류할 것

이번 설계 기준으로 보류하거나 후순위로 둔다.

- 고등부 드래그
- 완전 자동 적용
- draft class snapshot의 즉시 구현
- 학생 일괄 승급 실제 적용
- 고3 졸업/비활성 처리
- 수납/청구 연동
- 교재 자동 변경
- 학부모 공지 자동 발송
- 선생님모드 초안 노출

## 22. 위험 요소

주요 위험 요소는 다음과 같다.

- active version과 `class_time_slots`가 서로 불일치할 수 있다.
- 최종 적용 중 실패하면 운영 시간표가 부분 변경될 수 있다.
- draft class snapshot 없이 반 승급을 많이 다루면 표시명과 실제 데이터가 어긋날 수 있다.
- 새 중1반을 실제 `classes`에 미리 만들면 다른 화면에 노출될 수 있다.
- scheduled를 완전 자동 적용하면 휴일, 개강일 차이, 마지막 수정 누락으로 사고가 날 수 있다.
- `scan-preview` 없이 기존 충돌 스캔을 재사용하려 하면 운영 시간표 변경 위험이 있다.
- 중3에서 고1 전환은 중등부/고등부 시간표 구조 차이 때문에 단순 학년명 변경으로 끝나지 않을 수 있다.

대응 원칙:

- 1차에서는 slot version 분리만 안정화한다.
- 최종 적용은 원장 확인을 필수로 둔다.
- 적용 로직은 트랜잭션과 사전 검증을 전제로 한다.
- draft class snapshot은 2차의 핵심 설계 항목으로 별도 검토한다.

## 23. 구현 전 확인 질문

구현 전에 확인해야 할 질문은 다음과 같다.

1. 현재 `class_time_slots`를 active 운영 시간표의 유일한 기준으로 계속 둘 것인가?
2. 최초 도입 시 기존 `class_time_slots`를 어떤 기준의 active version으로 백업할 것인가?
3. active version은 학년도별 하나인지, 기간별 하나인지?
4. 초안 생성 시 제목 기본값은 `2027년 1월 개편 초안`으로 둘 것인가?
5. draft class snapshot을 1차에서 보류해도 12월 운영 요구를 만족하는가?
6. 새 중1반은 draft class snapshot 도입 전까지 보류할 것인가?
7. 중3에서 고1 전환은 초안 preview만 먼저 제공할 것인가?
8. scheduled의 effective_from이 지나면 원장에게 어디에서 안내할 것인가?
9. `scan-preview` 결과를 운영 충돌 로그에 남기지 않는 것이 맞는가?
10. 최종 적용 실패 시 원복 기준은 기존 `class_time_slots` 백업인지 archived version인지?

