# CODEX_RESULT - AP Math 오답 클리닉 구현 결과

## 1차 구현 결과

AP Math 오답 클리닉에 학생 자가채점 기반 흐름을 1차로 연결했다.

### 구현 범위

- 학생은 오답 클리닉 packet을 제출하기 전에는 정답/해설을 바로 볼 수 없다.
- 학생이 `제출하기`를 누르면 정답/해설 버튼이 열린다.
- 제출 후 `오답 체크` 화면에서 다시 틀린 번호를 직접 선택해 저장할 수 있다.
- 선생님 학생 상세 오답 탭에서 제출 여부와 학생이 저장한 오답 번호를 확인할 수 있다.
- 선생님 학생 상세 오답 탭에서 오답 클리닉 packet을 완전 삭제할 수 있다.
- 자동채점은 구현하지 않고, 학생 자가채점 방식으로 유지했다.

### 1차 변경 파일

- `apmath/worker-backup/worker/routes/wrong-clinics.js`
  - `wrong_clinic_packets` 진행 상태 컬럼 보강
  - packet 목록 응답에 제출/자가채점 상태 추가
  - 학생 제출 처리 함수 추가
  - 학생 자가채점 오답 저장 함수 추가
  - 선생님 packet 완전 삭제 API 추가

- `apmath/worker-backup/worker/routes/student-portal.js`
  - 학생 토큰 기반 오답 클리닉 제출 API 연결
  - 학생 토큰 기반 오답 클리닉 자가채점 저장 API 연결

- `apmath/worker-backup/worker/migrations/20260629_wrong_clinic_student_review.sql`
  - `is_submitted`
  - `submitted_at`
  - `review_wrong_ids_json`
  - `review_saved_at`

- `apmath/student/index.html`
  - 오답 클리닉 카드 상태 분기
  - 미제출 상태: `문제 보기`, `제출하기`
  - 제출 후 상태: `문제`, `정답`, `해설`, `오답 체크`
  - 오답 체크 번호 버튼 UI 추가
  - 오답 저장 API 호출 추가

- `apmath/js/student.js`
  - 선생님 학생 상세 오답 카드에서 정답/해설 버튼 제거
  - 제출 여부와 저장 오답 번호 표시
  - packet 완전 삭제 버튼 추가

- `tests/student-portal-wrong-clinic-hotfix.test.js`
  - 오답 클리닉 제출/자가채점/삭제 경로 guard 추가

## 2차 구현 결과

AP Math 오답 클리닉 2차 작업으로 `오답의 오답` 재출제 연결과 학생 포털 홈 우선순위 재배치를 완료했다.

### 구현 범위

1. 오답의 오답 재출제 후보 API
   - `GET wrong-clinics/review-wrongs?student_id=...&packet_key=...`를 추가했다.
   - 학생이 저장한 `wrong_clinic_packets.review_wrong_ids_json` 값을 출력 문항 번호로 보고, `wrong_clinic_packet_items.order_no`와 매칭해 원문항을 복원한다.
   - 반환 데이터에는 `packet_key`, `packet_title`, `order_no`, `archive_file`, `question_no`, `exam_title`, `created_at` 및 재출제 payload에 쓸 `item` 정보를 포함한다.
   - 삭제된 packet은 실제 row가 삭제되므로 후보 조회와 중복 판단에서 자연스럽게 제외된다.
   - 같은 학생의 다른 active packet에 이미 같은 `archive_file + question_no` 원문항이 있으면 재출제 후보에서 제외한다.

2. 선생님 학생 상세 오답 탭 재출제 액션
   - 저장된 오답 번호(`review_wrong_ids`)가 있는 오답 클리닉 카드에만 `재출제` 버튼을 표시한다.
   - 버튼 클릭 시 후보 API를 호출하고, 후보 문항을 기존 오답 클리닉 생성 payload shape에 맞춰 새 packet으로 생성한다.
   - 자동채점은 추가하지 않았고, 기존 학생 자가채점 방식 그대로 유지했다.

3. 학생 포털 홈 재배치
   - 홈 노출 순서를 `OMR 입력 → 오답 클리닉 → 과제·플래너 → 배정 자료·수업자료 오답`으로 변경했다.
   - OMR 입력 섹션을 최상단 업무 카드로 올리고, 미제출 OMR을 최대 3개 바로 노출한다.
   - 과제와 플래너는 큰 3카드 구조 대신 `과제 보기`, `플래너 열기` 2개 버튼 중심의 간단한 섹션으로 축소했다.
   - 배정 자료와 수업자료 오답은 하단 보조 섹션(`portal-support-grid`)으로 내리고, 각 목록은 최대 2개만 보이도록 줄였다.

### 2차 변경 파일

- `apmath/worker-backup/worker/routes/wrong-clinics.js`
  - 선생님용 오답의 오답 후보 API 추가
  - 후보 복원 및 active packet 기준 중복 제외 로직 추가
  - packet summary에 학생/반 id 보강

- `apmath/js/student.js`
  - `buildStudentWrongClinicReissuePayload`
  - `reissueStudentWrongClinicPacket`
  - 학생 상세 오답 탭의 저장 오답 카드에 `재출제` 액션 연결

- `apmath/student/index.html`
  - `renderOmrHomeSection`
  - `openHomeOmrInput`
  - `renderStudentQuickActions`
  - 홈 섹션 순서 및 보조 섹션 축소

- `tests/student-portal-wrong-clinic-hotfix.test.js`
  - 재출제 후보 API, 선생님 재출제 버튼 연결, 학생 홈 우선순위 재배치 guard 추가

## 검증 결과

통과:

- `node --check apmath/js/student.js`
- `node --check apmath/worker-backup/worker/routes/wrong-clinics.js`
- `node --check apmath/worker-backup/worker/routes/student-portal.js`
- `node tests/student-portal-wrong-clinic-hotfix.test.js`
- `apmath/student/index.html` inline script 추출 문법 검사

참고:

- `node --check apmath/student/index.html`은 Node 22에서 `.html` 확장자를 직접 syntax check 대상으로 받지 않아 `ERR_UNKNOWN_FILE_EXTENSION`으로 실패한다. 대신 HTML 내부 inline script를 추출해 `new Function(...)`으로 문법 검사를 수행했고 통과했다.
- `node tests/student-portal-omr-review-ui.test.js`는 이번 변경과 무관한 AP 로고 assertion에서 실패 중인 기존 이슈로 별도 참고가 필요하다.
- 리뷰봇 검토는 사용자 요청에 따라 생략했다.

## 주의 사항

- 자동채점은 하지 않는다.
- 학생 자가채점 방식과 저장된 `review_wrong_ids_json` 기반 후속 재출제 흐름을 유지한다.
- 삭제된 packet은 후보/중복 판단에 포함하지 않는다.
- 작업트리에 섞여 있던 사용자/이전 변경은 되돌리지 않았다.
