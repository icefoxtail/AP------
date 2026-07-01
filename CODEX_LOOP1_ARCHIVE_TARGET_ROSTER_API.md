# CODEX LOOP 1 — 출제 대상 선택: 반 roster / 벌크 제외 API

> 범위: `docs/plans/ARCHIVE_EXAM_TARGET_SELECTION_NEXT_PLAN.md` Phase 1(서버 — 조회 API 확장).
> 원칙: 기존 `exclude-student` 단건 로직 무수정 동작 유지(공용 헬퍼로 추출만), 스키마 변경 없음.
> 작성일: 2026-07-01
> 대상 파일: [apmath/worker-backup/worker/routes/exams.js](apmath/worker-backup/worker/routes/exams.js)

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| `GET class-exam-assignments/roster` (반 학생 + 결석/응시 플래그) | ✅ 추가 |
| `POST class-exam-assignments/exclude-students` (벌크 제외) | ✅ 추가 |
| 기존 `POST class-exam-assignments/exclude-student` (단건) 동작 | ✅ 무수정 유지(공용 헬퍼 추출, 응답/상태코드 동일) |
| DB 스키마 변경 | ✅ 없음(기존 `attendance`, `exam_sessions`, `class_exam_assignment_exclusions` 재사용) |
| `node --check` | ✅ PASS |
| `wrangler deploy --dry-run` 번들 빌드 | ✅ PASS |
| 실제 D1 대상 런타임 호출 검증 | ⚠️ 미수행(아래 4절) |

---

## 2. 변경 내용

### 2.1 공용 헬퍼 `performExcludeStudent()` 추출

기존 `POST .../exclude-student` 핸들러 본문(인가 체크 → assignment 확보 → 반 소속 확인 → exam_sessions/wrong_answers 정리 → exclusion upsert)을 그대로 함수로 옮기고, 에러마다 `status` 코드를 함께 반환하도록만 바꿨다. 로직/쿼리/순서는 원본과 동일하다.

- 실패: `{ success:false, student_id, error, status }`
- 성공: `{ success:true, student_id, assignment_id, deleted_session, assignment_deleted }`

기존 단건 엔드포인트는 이 헬퍼를 호출한 뒤 `status`만 떼어내 응답 코드로 쓰도록 교체했다 — **응답 바디/상태 코드는 이전과 100% 동일**하다.

### 2.2 신규 `POST class-exam-assignments/exclude-students` (벌크)

- 입력: `{ class_id, student_ids: [...], exam_title, exam_date, archive_file }`
- `student_ids` 중복 제거, 최대 200명 제한(무제한 배치 방지, 계획서 §4 금지사항 반영)
- **순차** 루프로 `performExcludeStudent()` 호출(병렬 fire-and-forget 금지 — 계획서 §4 명시 사항 반영)
- 응답: `{ success: (전원 성공 여부), results: [{student_id, success, error?, assignment_id?, ...}, ...] }` — 프론트가 반별 성공/실패 패널을 그릴 수 있도록 학생 단위 결과를 그대로 노출

### 2.3 신규 `GET class-exam-assignments/roster?class_id=&exam_title=&exam_date=`

- 인가: `requireTeacher` + `canAccessClass` (기존 다른 class-exam-assignments 엔드포인트와 동일 패턴)
- 반환: 재원 학생 목록(`id, name, school_name`) + 학생별 플래그 2종
  - `recently_absent`: `attendance.status = '결석'`이 `exam_date`(없으면 오늘) 기준 최근 7일 내 존재하는지
  - `already_submitted`: 같은 `exam_title` + `exam_date`로 이미 `exam_sessions`가 있는지
- 쿼리는 `check-omr.js`의 기존 `check-init` roster 조회 패턴(재원 학생, `class_students` 서브쿼리)을 그대로 따름 — 신규 쿼리 스타일 도입 없음

---

## 3. 기존 로직 무수정 확인

- `ensureClassExamAssignmentForExclusion`, `hasClassExamAssignmentExclusions`, `cleanupAssignmentIfNoTargets`, `canAccessClass`, `canAccessStudent` — **호출 방식 동일, 내부 수정 없음**
- 단건 `exclude-student`의 SQL(제외 upsert, `wrong_answers`/`exam_sessions` 삭제 순서) — **원본 그대로 헬퍼로 이동만 함**
- `class-exam-assignments` 리소스의 기존 `board`/POST(신규 배정 등록) 분기 — **미접근**

---

## 4. 검증

- `node --check apmath/worker-backup/worker/routes/exams.js` → **PASS**
- `npx wrangler deploy --dry-run` → 번들 빌드 성공(911.40 KiB / gzip 160.28 KiB), import/모듈 해석 오류 없음
- **미수행**: 로컬 `wrangler dev --local`로 실제 D1 바인딩에 대고 호출 검증 — Windows 환경에서 `wrangler dev --local` 자체가 바인딩 로드 직후 `[ERROR] write EOF`로 즉시 종료되는 현상이 있었고(이 기능 변경과 무관, 로컬 D1 에뮬레이션 환경 이슈로 보임), 재현/우회에 추가 시간이 필요해 이번 루프에서는 보류
- **미배포**: 실제 배포(`wrangler deploy`, 계정 라이브 반영)는 이번 루프에서 수행하지 않음 — [[git-push-workflow]]/[[apmath-deploy-topology]] 메모대로 배포는 별도 승인 필요 사항으로 남겨둠. 살아있는 API로 curl 검증하려면 사용자 승인 후 배포가 필요.

---

## 5. 다음 단계 (Loop 2)

`archive/index.html`의 출제 대상 화면을 계획서 §3 와이어프레임대로 재구성:
- `targetModalOverlay`/`classModalOverlay`/`gradeModalOverlay` 3개를 신규 통합 패널로 교체
- 학년 탭 + 반 체크리스트(좌) + 학생 아코디언 없이 항상 펼친 패널(우) 마스터-디테일 레이아웃
- 이번 루프에서 만든 `roster`/`exclude-students` API를 호출하는 상태 모델과 렌더 함수 작성
