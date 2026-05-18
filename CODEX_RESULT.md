# CODEX_RESULT

## 1. 이번 작업에서 실제 수정한 파일

- `apmath/worker-backup/worker/routes/homework-photo.js`
- `apmath/homework/index.html`
- `apmath/js/classroom.js`
- `CODEX_RESULT.md`

## 2. 이번 작업에서 확인만 한 파일

- `CODEX_TASK.md`
- `apmath/worker-backup/worker/wrangler.jsonc`
- `schema.sql`

## 3. 이번 작업에서 수정하지 않은 파일

- `apmath/js/student.js`
- `apmath/planner/index.html`
- `apmath/worker-backup/worker/routes/reports-ai.js`
- `apmath/worker-backup/worker/routes/planner.js`
- `schema.sql`
- `migrations/*`

## 4. 구현 결과

### Worker 안정화

- `HOMEWORK_PHOTO_RETENTION_HOURS = 24 * 7` 상수를 추가하고 업로드 만료 시각을 7일 기준으로 통일했다.
- `getHomeworkPhotoBucket(env)`가 `HOMEWORK_PHOTO_BUCKET`, `apmath_homework_photo`, `HOMEWORK_PHOTOS_BUCKET` 순서로 binding을 찾도록 보강했다.
- `GET /api/homework-photo/files`가 만료 파일을 숨기지 않고 `expired` 플래그와 함께 반환하도록 바꿨다.
- `GET /api/homework-photo/file`는 삭제 파일 404, 만료 파일 410 텍스트 응답을 유지한다.
- `PATCH /api/homework-photo/submissions/:submission_id/reopen`를 추가했다.
- 재제출 요청 시 기존 `homework_photo_files`를 `deleted_at = CURRENT_TIMESTAMP`로 soft delete 처리하고, submission을 `is_submitted = 0`, `submitted_at = NULL`, `synced_homework_status = NULL`로 되돌린다.
- 재제출 요청은 마감된 숙제에서 막고, 삭제된 숙제에도 허용하지 않는다.
- assignment 삭제 시 관련 `homework_photo_files`도 soft delete 처리하도록 보강했다.
- 학생 업로드의 `r2_not_configured` 메시지를 `사진 저장 준비가 아직 완료되지 않았습니다. 선생님께 말씀해주세요.`로 바꿨다.

### 선생님 화면

- 제출 현황 API의 `expired_file_count`를 사용해 만료 사진 수를 표시한다.
- 제출 현황 모달에 `사진은 제출 후 7일간 확인할 수 있습니다.` 안내를 추가했다.
- 만료된 사진만 남은 학생은 `사진 만료` 버튼으로 보이게 했다.
- 사진 보기 모달에서 만료 파일은 미리보기 대신 `사진 보관 기간이 지났습니다.`로 표시한다.
- 제출 완료 학생에게만 `다시 제출 요청` 버튼을 추가했고, 클릭 시 reopen endpoint를 호출한 뒤 현황을 다시 불러온다.
- 선생님용 `r2_not_configured` 오류 문구를 `사진 저장소 설정이 필요합니다. R2 binding을 확인해주세요.`로 분리했다.

### 학생 화면

- 업로드 실패 코드별 문구를 학생용으로 정리했다.
- 제출 완료 후 안내 문구를 `선생님이 다시 제출 요청을 열어준 경우에만 다시 제출할 수 있어요.`로 바꿨다.
- 기존 학생 자가 재제출 버튼/삭제 버튼은 추가하지 않았다.

## 5. 검증 결과

실행한 명령:

- `node --check apmath/worker-backup/worker/routes/homework-photo.js`
- `node --check apmath/js/classroom.js`
- `awk '/<script>/{flag=1;next}/<\\/script>/{flag=0}flag' apmath/homework/index.html > /tmp/homework-inline.js`
- `node --check /tmp/homework-inline.js`
- `rg -n "HOMEWORK_PHOTO_RETENTION_HOURS|HOMEWORK_PHOTO_BUCKET|apmath_homework_photo|r2_not_configured|submissions/.*/reopen|expired_file_count|deleted_at = COALESCE|사진 보관 기간이 지났습니다|다시 제출 요청|7일간 확인" apmath/worker-backup/worker/routes/homework-photo.js apmath/js/classroom.js apmath/homework/index.html`
- `git diff --name-only -- apmath/worker-backup/worker/routes/homework-photo.js apmath/homework/index.html apmath/js/classroom.js CODEX_RESULT.md`
- `git status --short -- apmath/worker-backup/worker/routes/homework-photo.js apmath/homework/index.html apmath/js/classroom.js CODEX_RESULT.md apmath/planner/index.html`

검증 판정:

- `node --check apmath/worker-backup/worker/routes/homework-photo.js` PASS
- `node --check apmath/js/classroom.js` PASS
- `node --check /tmp/homework-inline.js` PASS
- 요구 키워드 검색 PASS

실행하지 않은 검증:

- 브라우저 실기 확인은 지시대로 사용자 직접 확인 항목으로 남겼다.

## 6. 작업 중 확인한 운영 메모

- `apmath/worker-backup/worker/wrangler.jsonc`는 현재 작업에서 수정하지 않았다.
- 현재 워크트리에는 이번 작업과 무관한 `apmath/planner/index.html` 수정이 이미 존재한다.
- 이번 작업 기준 관련 diff 파일은 `CODEX_RESULT.md`, `apmath/homework/index.html`, `apmath/js/classroom.js`, `apmath/worker-backup/worker/routes/homework-photo.js`다.

## 7. 사용자 직접 확인 필요 항목

- 선생님 반 화면에서 숙제 등록 후 학생별 링크 생성 확인
- 학생 링크 접속 후 PIN 인증 확인
- 학생 사진 1장 제출, 3장 제출, 4장 차단 확인
- 파일당 6MB 초과, 총 18MB 초과 문구 확인
- R2 미설정 환경에서 학생/선생님 오류 문구 확인
- 선생님 제출 현황에서 `사진`, `사진 만료`, `다시 제출 요청` 버튼 노출 확인
- `다시 제출 요청` 후 같은 링크/PIN으로 학생 제출 화면이 다시 열리는지 확인
- 마감된 숙제에서 `다시 제출 요청`이 차단되는지 확인
