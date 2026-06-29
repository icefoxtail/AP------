# Codex Task - AP Math 오답 클리닉 2차 + 학생 홈 재배치

## 목표

1차에서 오답 클리닉 제출, 정답/해설 공개, 자가채점 저장, 선생님 완전 삭제는 붙였다.

2차 목표는 두 가지다.

- 저장된 `오답의 오답`을 다음 오답 클리닉 재출제 후보로 연결한다.
- 학생 포털 홈을 실제 사용 빈도 기준으로 재배치한다.

자동 채점은 하지 않는다. 학생 자가채점 방식 유지.

## 현재 구조 요약

- 학생 포털 홈: `apmath/student/index.html`
  - `renderHome()`
  - 현재 큰 카드: 과제 / 플래너 / OMR 입력
  - 현재 보조 섹션: 배정 자료 / 오답 클리닉 / 수업자료 오답
- 오답 클리닉 학생 화면: `apmath/student/index.html`
  - `renderWrongClinicPackets()`
  - `submitWrongClinicPacket()`
  - `renderWrongClinicReview()`
  - `saveWrongClinicReviewWrongs()`
- 선생님 학생 상세 오답 탭: `apmath/js/student.js`
  - `renderStudentWrongClinicTab(sid)`
  - `deleteStudentWrongClinicPacket(sid, packetKey)`
- 오답 클리닉 API: `apmath/worker-backup/worker/routes/wrong-clinics.js`
  - `wrong_clinic_packets.review_wrong_ids_json`
  - `wrong_clinic_packet_items.order_no`

## 구현 계획

### Loop 1 - 오답의 오답 후보 API

- 저장된 `review_wrong_ids_json`은 오답 클리닉 출력 순번이다.
- 순번을 `wrong_clinic_packet_items.order_no`와 매칭해 원본 문항으로 복원한다.
- 선생님용 조회 API를 추가한다.
  - 예: `GET wrong-clinics/review-wrongs?student_id=...`
  - 반환 필드:
    - `packet_key`
    - `packet_title`
    - `order_no`
    - `archive_file`
    - `question_no`
    - `exam_title`
    - `created_at`
- 완전 삭제된 packet은 조회되지 않아야 한다.

### Loop 2 - 재출제 연결

- 선생님 학생 상세 오답 탭에서 저장된 오답 번호가 있는 카드에 `재출제` 액션을 추가한다.
- `재출제`는 해당 packet의 `review_wrong_ids_json`만 후보로 담는다.
- 후보 데이터는 기존 오답 클리닉 생성 흐름이 받는 item shape에 맞춘다.
- 중복 정책:
  - 삭제된 packet은 재출제 가능
  - 살아 있는 packet의 같은 학생/같은 원본 문항은 중복 후보에서 제외

### Loop 3 - 학생 홈 재배치

학생 포털 홈은 사용 빈도 기준으로 아래 순서로 재배치한다.

1. `OMR 입력`
   - 최상단에 둔다.
   - 미제출 OMR이 있으면 2~3개 바로 노출한다.
   - 없으면 작은 `OMR 입력` 버튼만 둔다.

2. `오답 클리닉`
   - OMR 바로 아래에 둔다.
   - 미제출, 제출 후 오답 체크 필요한 항목을 우선 노출한다.
   - 제출 전: `문제 풀기 / 제출하기`
   - 제출 후: `정답 / 해설 / 오답 체크`

3. `과제 · 플래너 열기`
   - 기존 큰 카드 2~3개 구조는 줄인다.
   - 작은 버튼 2개만 둔다.
     - `과제 보기`
     - `플래너 열기`

4. `배정 자료 · 수업자료 오답`
   - 거의 쓰지 않으므로 하단으로 내린다.
   - 기본은 작게 표시한다.
   - 목록은 최대 2개만 보이고 나머지는 `전체 보기`로 처리한다.

### Loop 4 - 홈 UI 정리 원칙

- `.portal-grid`의 큰 3카드가 홈을 많이 차지하지 않게 축소한다.
- 홈은 “기능 입구 모음”이 아니라 “학생이 지금 해야 하는 일” 중심으로 구성한다.
- 완료된 항목은 기본적으로 크게 노출하지 않는다.
- 모바일에서 OMR → 오답 클리닉 → 과제/플래너 → 기타 자료 순서가 유지되어야 한다.

## 검수

- 홈 최상단에 OMR 입력이 온다.
- 오답 클리닉이 OMR 바로 아래에 온다.
- 과제/플래너는 큰 카드가 아니라 작은 버튼으로 보인다.
- 배정 자료와 수업자료 오답은 하단 보조 섹션으로 내려간다.
- 저장된 오답의 오답을 선생님이 재출제 후보로 불러올 수 있다.
- 삭제된 packet은 재출제 중복 판단에 남지 않는다.

## 테스트

- `node --check apmath/student/index.html`
- `node --check apmath/js/student.js`
- `node --check apmath/worker-backup/worker/routes/wrong-clinics.js`
- `node --check apmath/worker-backup/worker/routes/student-portal.js`
- 관련 테스트 갱신/추가
  - `tests/student-portal-wrong-clinic-hotfix.test.js`
  - 학생 홈 우선순위 렌더 테스트
  - 오답의 오답 후보 API 테스트
