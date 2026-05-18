cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업 제목

AP Math OS 숙제 사진 1.5 운영 안정화

이번 작업의 목표:
- 숙제 사진 1차 업로드 기능을 운영에서 덜 터지게 안정화한다.
- 사진 만료/보관/삭제 정책을 코드와 문구에 반영한다.
- 선생님이 필요한 경우 학생에게 다시 제출할 수 있게 하는 최소 흐름을 판단하고 적용한다.
- 4장 초과, 용량 초과, R2 오류, 이미 제출, 마감 등 실패 케이스 문구를 정리한다.
- 이 작업까지만 하고 숙제 사진 기능 확장은 멈춘다.
- AI 자동 판독, 자동 채점, 학부모 공개, 알림 자동 발송은 하지 않는다.
- 이 작업 후 다음 큰 흐름은 4순위 구조 정리로 넘어갈 수 있게 닫는다.

## 1. 최상위 원칙

1. 이번 작업은 “숙제 사진 1.5 안정화”까지만 한다.
2. 새 기능을 크게 확장하지 않는다.
3. 학습 포트폴리오를 만들지 않는다.
4. 댓글 기능을 만들지 않는다.
5. 학부모 공개 기능을 만들지 않는다.
6. AI 자동 판독을 만들지 않는다.
7. AI 자동 채점을 만들지 않는다.
8. 리포트 자동 반영을 만들지 않는다.
9. 알림/카카오/문자 자동 발송을 만들지 않는다.
10. 기존 OMR/시험지 흐름은 절대 건드리지 않는다.
11. 학생 포털에서 시험지 직접 열기 흐름을 추가하지 않는다.
12. 기존 문구·버튼명·화면명은 요청 범위 밖에서 임의 변경하지 않는다.
13. route/schema/migration 변경은 필요한 경우만 최소화한다.
14. schema 변경 없이 가능한 안정화는 schema 변경 없이 처리한다.
15. git add, git commit, git push는 하지 않는다.
16. 브라우저 실기 확인은 사용자 직접 확인 항목으로 남긴다.

## 2. 작업 대상 파일

우선 확인 파일:

1. `apmath/worker-backup/worker/routes/homework-photo.js`
2. `apmath/homework/index.html`
3. `apmath/js/classroom.js`
4. `apmath/worker-backup/worker/wrangler.jsonc`
5. `schema.sql`
6. `CODEX_RESULT.md`

수정 예상 파일:

1. `apmath/worker-backup/worker/routes/homework-photo.js`
2. `apmath/homework/index.html`
3. `apmath/js/classroom.js`
4. `CODEX_RESULT.md`

원칙적으로 수정하지 않을 파일:

1. `apmath/js/student.js`
2. `apmath/planner/index.html`
3. `apmath/worker-backup/worker/routes/reports-ai.js`
4. `apmath/worker-backup/worker/routes/planner.js`
5. `schema.sql`
6. `migrations/*`
7. 시험지/OMR/archive 관련 파일
8. 상담 AI 관련 파일
9. 수납/출납 관련 파일
10. 학부모 연락 foundation 관련 파일

## 3. 안정화 범위 확정

이번 작업에서 처리할 항목은 아래 5개다.

1. 사진 만료 정책 정리
2. 제출 완료 후 선생님 “다시 제출 요청” 가능 여부 판단 및 최소 구현
3. 제출 사진 삭제/보관 정책 정리
4. 실패 케이스 문구 정리
5. 4장 초과, 용량 초과, R2 오류 대응 확인/보강

이 5개 외에는 하지 않는다.

## 4. 사진 만료/보관 정책

### 4.1 정책 결정

1차의 24시간 만료는 운영상 선생님 확인 시간이 부족할 수 있다.
1.5부터는 아래 정책으로 정리한다.

1. 제출 사진 보관 기간 기본값: 7일
2. 시간 기준: 업로드 시점 기준 168시간
3. DB metadata는 남긴다.
4. 실제 이미지 파일은 만료 후 열리지 않게 한다.
5. R2 실제 삭제 자동화는 이번 작업에서 만들지 않는다.
6. 만료된 사진은 선생님 화면에서 “만료됨” 또는 “사진 보관 기간이 지났습니다.” 수준으로 표시한다.
7. 학생 화면에는 보관 정책을 길게 설명하지 않는다.
8. 선생님 화면에서만 간단히 “사진은 제출 후 7일간 확인할 수 있습니다.” 정도로 안내한다.

### 4.2 코드 기준

`homework-photo.js`에 상수 또는 helper를 둔다.

예:
- `HOMEWORK_PHOTO_RETENTION_HOURS = 24 * 7`
- `getHomeworkPhotoExpiresAt()`

기존 코드에 24시간 하드코딩이 있으면 7일 기준으로 교체한다.

### 4.3 만료 처리

`GET /api/homework-photo/file?file_id=...`

1. deleted_at이 있으면 404
2. expires_at이 현재보다 과거면 410
3. 410 응답 body는 JSON이 아니라 이미지 요청에서도 깨지지 않게 단순 text 응답 가능
4. 파일 목록 API에서는 만료 파일을 아예 제외하지 말고, 가능하면 expired flag를 내려준다.
5. 선생님 화면에서 expired file은 이미지 미리보기 대신 “사진 보관 기간이 지났습니다.” 표시한다.

## 5. R2 binding 안정화

현재 실제 binding 이름이 환경에 따라 달라질 수 있다.

반드시 `getHomeworkPhotoBucket(env)`를 확인하고 아래 binding 이름을 모두 지원하게 보강한다.

우선순위:

1. `env.HOMEWORK_PHOTO_BUCKET`
2. `env.apmath_homework_photo`
3. 필요 시 현재 코드에 이미 사용된 기존 binding 이름

주의:
- wrangler.jsonc를 임의로 대폭 변경하지 않는다.
- 현재 binding이 `apmath_homework_photo`로 들어갔다면 코드가 그것도 인식해야 한다.
- 현재 binding이 `HOMEWORK_PHOTO_BUCKET`이면 그대로 동작해야 한다.
- R2 binding이 없을 때는 기존처럼 `r2_not_configured` 500 응답을 반환한다.
- 오류 메시지는 학생/선생님 화면에서 자연스럽게 보이도록 정리한다.

권장 에러 문구:
- 학생 화면: `사진 저장 준비가 아직 완료되지 않았습니다. 선생님께 말씀해주세요.`
- 선생님 화면: `사진 저장소 설정이 필요합니다. R2 binding을 확인해주세요.`

## 6. 다시 제출 요청 정책

### 6.1 정책 결정

1차에서는 학생 재제출을 막았다.
운영에서는 학생이 잘못된 사진을 올렸거나 흐린 사진을 올릴 수 있으므로, 선생님만 “다시 제출 요청”을 할 수 있게 한다.

단, 알림 발송은 하지 않는다.

정책:

1. 학생은 스스로 재제출할 수 없다.
2. 선생님만 제출 현황에서 다시 제출 요청 가능하다.
3. 다시 제출 요청 시 기존 제출 사진은 soft delete 처리한다.
4. 기존 submission은 유지하고 `is_submitted = 0`, `submitted_at = NULL`로 되돌린다.
5. 같은 학생 링크로 다시 제출할 수 있게 한다.
6. 기존 homework 완료 sync는 되돌리지 않는다.
7. 마감 처리 전이면 학생은 다시 제출 가능하다.
8. 마감된 숙제는 다시 제출 요청을 막는다.
9. 자동 알림/문자/카카오 발송은 하지 않는다.
10. 화면 문구는 “다시 제출 요청”으로 한다.

### 6.2 Worker endpoint 추가

추가 endpoint:

- `PATCH /api/homework-photo/submissions/:submission_id/reopen`

또는 기존 router 구조에 맞춰 아래 중 하나로 구현한다.

- `PATCH /api/homework-photo/reopen`
- body: `{ submission_id }`

기존 route 패턴에 가장 안전한 방식으로 구현한다.

권한:

1. 선생님 인증 필요
2. admin은 가능
3. 담당 선생님은 해당 assignment.class_id 접근 권한이 있을 때만 가능
4. 기존 `canAccessClass()` helper 또는 동일 권한 검증 재사용

처리:

1. submission_id 확인
2. submission + assignment + student 조회
3. assignment status가 closed/deleted면 차단
4. 권한 확인
5. 기존 homework_photo_files 중 해당 submission_id 파일은 deleted_at = CURRENT_TIMESTAMP 처리
6. submission은 is_submitted = 0, submitted_at = NULL, updated_at = CURRENT_TIMESTAMP
7. synced_homework_status는 null 또는 기존 정책에 맞게 비움
8. R2 object 실제 삭제는 하지 않는다.
9. 성공 응답 반환

응답 예시:

성공:
- success: true
- reopened: true

마감:
- success: false
- error: `assignment_closed`
- message: `마감된 숙제는 다시 제출 요청을 할 수 없습니다.`

권한 없음:
- 403
- success: false
- error: `forbidden`

### 6.3 선생님 화면 연결

`apmath/js/classroom.js`의 숙제 사진 제출 현황 모달에 최소 버튼을 추가한다.

조건:

1. 제출 완료 학생
2. assignment status가 closed가 아님
3. submission_id가 있음

버튼:

- `다시 제출 요청`

클릭 시:

1. confirm 표시
2. Worker reopen endpoint 호출
3. 성공 시 toast
4. 제출 현황 모달 재조회
5. 기존 큰 UI 추가 없음
6. 버튼은 사진/링크 버튼 옆에 작게 둔다.

confirm 문구 예시:

- `기존 제출 사진을 숨기고 학생이 다시 제출할 수 있게 할까요?`

toast 문구 예시:

- 성공: `다시 제출할 수 있게 열어두었습니다.`
- 실패: `다시 제출 요청에 실패했습니다.`

학생 화면:

1. 다시 제출 요청 상태가 되면 기존 링크/PIN으로 들어왔을 때 제출 화면이 다시 보여야 한다.
2. 이미 제출 완료 상태면 계속 완료 화면을 보여야 한다.
3. 학생 화면에 “다시 제출 요청” 버튼은 절대 만들지 않는다.

## 7. 제출 사진 삭제/보관 정책 정리

### 7.1 삭제 정책

1. 학생은 삭제할 수 없다.
2. 선생님이 “다시 제출 요청”할 때만 기존 사진을 soft delete 처리한다.
3. assignment 삭제 시 관련 사진 파일 row도 deleted_at 처리할 수 있으면 처리한다.
4. R2 실제 object 삭제는 이번 작업에서 강제 구현하지 않는다.
5. R2 object 삭제 helper가 이미 있으면 실패해도 DB soft delete는 유지한다.
6. 물리 삭제 실패는 사용자 화면에 과하게 노출하지 않고 console/error 기록만 남긴다.

### 7.2 선생님 표시 정책

1. 제출 완료 + 사진 있음: `사진` 버튼 표시
2. 제출 완료 + 사진 만료: `사진 만료` 또는 `보관 기간 만료` 표시
3. 제출 완료 + 파일 없음: 기존 상태 유지
4. 다시 제출 요청 상태: 미제출로 표시
5. 삭제된 파일은 목록에 표시하지 않는다.
6. 선생님이 사진 보기 모달을 열었을 때 만료 파일이 있으면 안내 문구 표시

문구 예시:

- `사진 보관 기간이 지났습니다.`
- `다시 제출 요청 후 새 사진을 받을 수 있습니다.`
- `사진은 제출 후 7일간 확인할 수 있습니다.`

## 8. 실패 케이스 문구 정리

### 8.1 학생 화면 문구

`apmath/homework/index.html`에서 아래 실패 케이스 문구를 자연스럽게 정리한다.

1. 링크 오류
   - `숙제 링크를 확인해주세요.`

2. PIN 오류
   - `PIN 번호를 확인해주세요.`

3. 이미 제출
   - `이미 제출이 완료되었습니다.`

4. 마감됨
   - `마감된 숙제입니다.`

5. 사진 없음
   - `제출할 사진을 선택해주세요.`

6. 4장 이상
   - `사진은 최대 3장까지 올릴 수 있어요.`

7. 이미지 아님
   - `사진 파일만 올릴 수 있어요.`

8. 파일당 용량 초과
   - `사진 1장당 6MB 이하로 올려주세요.`

9. 전체 용량 초과
   - `사진 전체 용량이 너무 큽니다. 사진 수를 줄이거나 다시 찍어주세요.`

10. R2 저장소 미설정
   - `사진 저장 준비가 아직 완료되지 않았습니다. 선생님께 말씀해주세요.`

11. 네트워크 오류
   - `인터넷 연결을 확인한 뒤 다시 시도해주세요.`

12. 알 수 없는 오류
   - `제출 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.`

### 8.2 선생님 화면 문구

`classroom.js`에서 아래 문구를 정리한다.

1. 사진 조회 실패
   - `숙제 사진을 불러오지 못했습니다.`

2. 사진 만료
   - `사진 보관 기간이 지났습니다.`

3. R2 설정 필요
   - `사진 저장소 설정이 필요합니다. R2 binding을 확인해주세요.`

4. 다시 제출 요청 성공
   - `다시 제출할 수 있게 열어두었습니다.`

5. 다시 제출 요청 실패
   - `다시 제출 요청에 실패했습니다.`

6. 마감된 숙제 reopen 차단
   - `마감된 숙제는 다시 제출 요청을 할 수 없습니다.`

## 9. 업로드 제한 재확인/보강

Worker와 학생 화면에서 둘 다 확인한다.

### 9.1 Worker 제한

1. 파일 최소 1장
2. 파일 최대 3장
3. 파일당 6MB 이하
4. 전체 18MB 이하
5. image MIME만 허용
6. 확장자만 믿지 말고 type 우선 확인
7. type이 비어 있는 일부 모바일 파일은 확장자 fallback 허용 가능
8. R2 업로드 실패 시 DB 제출 완료 처리 금지
9. 일부 파일 업로드 후 실패하면 가능한 범위에서 R2 object cleanup
10. 이미 제출된 상태면 409
11. 다시 제출 요청 상태에서는 재업로드 가능

### 9.2 학생 화면 제한

1. 파일 input accept는 image 계열
2. 선택 즉시 3장 초과 차단
3. 6MB 초과 안내
4. 전체 18MB 초과 안내
5. 제출 버튼 중복 클릭 방지
6. 업로드 중 문구 표시
7. 실패 후 다시 시도 가능
8. 성공 후 제출 완료 화면 표시

## 10. 기존 흐름 보존

다음은 절대 깨뜨리지 않는다.

1. 기존 숙제 등록
2. 기존 숙제 목록
3. 기존 학생별 링크/QR
4. 기존 제출 현황
5. 기존 사진 보기 모달
6. 기존 마감 처리
7. 기존 숙제 O/X 토글
8. 기존 QR/OMR
9. 기존 시험성적
10. 기존 플래너
11. 기존 상담 AI
12. 기존 리포트 AI
13. 기존 학생 포털
14. 기존 시험지 직접 열기 금지

## 11. 검증

### 11.1 정적 문법 검증

반드시 실행한다.

1. `node --check apmath/worker-backup/worker/routes/homework-photo.js`
2. `node --check apmath/js/classroom.js` if modified
3. `apmath/homework/index.html` inline script 정확히 추출 후 `node --check`

HTML script 추출 시 주의:

1. `<script>` 개수 확인
2. `</script>` 개수 확인
3. 전체 script 블록만 정확히 추출
4. 일부만 잘라서 `Unexpected end of input` 만들지 말 것
5. 임시 파일은 프로젝트에 남기지 말 것

### 11.2 검색 검증

아래 검색을 수행하고 CODEX_RESULT에 요약한다.

1. `HOMEWORK_PHOTO_BUCKET`
2. `apmath_homework_photo`
3. `r2_not_configured`
4. `HOMEWORK_PHOTO_RETENTION`
5. `homework-photo/upload`
6. `homework-photo/files`
7. `homework-photo/file`
8. `reopen`
9. `다시 제출 요청`
10. `homework_photo_files`
11. `deleted_at`
12. `expires_at`
13. `OMR`
14. `archive`
15. `exam_sessions`
16. `student-portal`
17. `PLANNER_COACH_MESSAGES`
18. `consultation-thread-summary`

확인 기준:

1. 숙제 사진 관련 검색어는 의도한 파일에만 있어야 한다.
2. OMR/archive/student-portal/planner/consultation 관련 파일이 이번 작업에서 수정되면 실패다.
3. `PLANNER_COACH_MESSAGES`는 변경 없어야 한다.
4. `consultation-thread-summary`는 변경 없어야 한다.

### 11.3 Git diff 검증

아래를 확인한다.

1. `git diff --name-only -- apmath/worker-backup/worker/routes/homework-photo.js apmath/homework/index.html apmath/js/classroom.js CODEX_RESULT.md`
2. 실제 수정 파일이 예상 범위 안인지 확인
3. `schema.sql`이나 `migrations/*`가 수정되면 이유를 CODEX_RESULT에 명확히 기록
4. 불필요한 파일이 수정되면 되돌린다.

### 11.4 브라우저 실기 확인은 하지 않는다

사용자 직접 확인 항목으로 남긴다.

사용자 직접 확인 항목:

1. 학생 링크 접속
2. PIN 입력
3. 사진 1장 제출
4. 사진 3장 제출
5. 4장 제출 차단
6. 6MB 초과 차단
7. 제출 완료 후 재제출 버튼이 없는지 확인
8. 선생님 제출 현황에서 사진 보기
9. 선생님 다시 제출 요청 버튼 확인
10. 다시 제출 요청 후 학생 링크에서 다시 제출 가능 여부 확인
11. 마감된 숙제에서 다시 제출 요청이 막히는지 확인
12. 사진 만료 문구 확인은 실제 7일 대기 대신 코드/임시 데이터 기준으로 사용자 확인 필요로 남김
13. 기존 숙제 O/X 유지
14. 기존 QR/OMR 유지
15. 기존 시험성적 유지
16. 기존 플래너 유지

## 12. 배포/운영 기록

이번 작업은 Worker route가 바뀔 가능성이 높다.

CODEX_RESULT에 반드시 기록한다.

1. Worker deploy 필요 여부
2. R2 binding 이름 확인 결과
3. `HOMEWORK_PHOTO_BUCKET` 지원 여부
4. `apmath_homework_photo` 지원 여부
5. D1 migration 필요 여부
6. 새 migration 생성 여부
7. wrangler deploy는 실행하지 않았는지 여부
8. remote D1 apply는 실행하지 않았는지 여부

주의:
- 사용자가 명시하지 않았으므로 `wrangler deploy`는 하지 않는다.
- 사용자가 명시하지 않았으므로 D1 remote migration apply도 하지 않는다.
- 기존 pending migration 전체 apply를 지시하지 않는다.

## 13. CODEX_RESULT.md 작성 형식

작업 완료 후 루트의 `CODEX_RESULT.md`에 아래 형식으로 짧고 정확하게 작성한다.

# CODEX_RESULT

## 1. 생성/수정 파일

- 수정/생성 파일 목록

## 2. 구현 완료 또는 확인 완료

### 숙제 사진 1.5 안정화

- 사진 보관 기간 7일 정책 반영 여부
- 만료 파일 처리 보강 여부
- 삭제/보관 정책 정리 여부
- 다시 제출 요청 정책 반영 여부
- 다시 제출 요청 endpoint 구현 여부
- 선생님 화면 다시 제출 요청 버튼 연결 여부
- 학생 재제출 직접 노출 없음 확인
- 실패 케이스 문구 정리 여부

### R2 / Worker

- `HOMEWORK_PHOTO_BUCKET` binding 지원 여부
- `apmath_homework_photo` binding 지원 여부
- R2 미설정 시 `r2_not_configured` 처리 여부
- 업로드 실패 시 DB 제출 완료 방지 여부
- 일부 업로드 실패 시 가능한 R2 cleanup 여부

### 업로드 제한

- 1장 미만 차단 여부
- 3장 초과 차단 여부
- 파일당 6MB 초과 차단 여부
- 전체 18MB 초과 차단 여부
- 이미지 파일 제한 여부
- 이미 제출 상태 409 차단 여부
- 다시 제출 요청 상태 재업로드 가능 여부
- 마감 상태 업로드 차단 여부

### 보존 확인

- OMR/시험지 흐름 미수정
- 학생 포털 시험지 직접 열기 금지 유지
- 플래너 미수정
- 상담 AI 미수정
- 리포트 AI 미수정
- route/schema/migration 변경 범위 확인
- 기존 문구·버튼명·화면명 임의 변경 없음

## 3. 실행 결과

- 실행한 검증 명령
- PASS/FAIL
- 실패한 검증이 있으면 원인
- 실행하지 못한 검증이 있으면 이유

## 4. 결과 요약

- 3~6줄 요약

## 5. 잘못한 점 / 위험했던 점 / 보존한 점

- 잘못한 점: 없으면 없음
- 위험했던 점: R2 binding명 불일치, 제출 상태 sync, 파일 만료, 다시 제출 요청, 기존 숙제 O/X 덮어쓰기 위험 기록
- 보존한 점: 기존 OMR/시험지/학생포털/플래너/상담AI/리포트AI/문구 보존 기록

## 6. 배포/운영 필요 사항

- Worker deploy 필요 여부
- R2 binding 설정 필요 여부
- D1 migration 필요 여부
- 사용자가 직접 확인해야 할 브라우저 항목
- 이 작업 후 다음 큰 흐름은 4순위 구조 정리로 넘어가면 되는지 기록

## 14. 다음 단계 메모

이 작업이 끝나면 숙제 사진 기능은 1.5 안정화로 닫는다.

다음 큰 흐름:
- AI 자동 판독/자동 채점으로 가지 않는다.
- 숙제 사진 추가 확장으로 가지 않는다.
- 4순위 구조 정리로 넘어간다.
- 후보: AP Math OS 전체 구조 정리, initial-data 분리 사전 분석, 홈페이지/왕지교육 통합 준비 중 사용자 지시에 따라 진행한다.

## 15. 마지막 지시

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF