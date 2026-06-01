# APMS 시험지 분석 저장 구조 Round 1

## 1. 목적
- APMS 시험지 보관함, 평가팩, QR/OMR, 오답, 리포트 흐름에서 시험지 분석표, 프리미엄 분석, 평가 리포트를 1회 생성 후 DB에 저장하고 이후 재사용할 수 있는 저장 구조를 설계한다.
- 이번 Round 1은 설계 문서와 검토용 migration 초안까지만 다룬다. 실제 schema 적용, Worker/API 구현, 프론트 구현, 평가팩 데이터 수정은 범위 밖이다.
- 목표 저장 단위는 문항별 전체 결과, 내부 분석표 snapshot, 프리미엄/학부모 리포트 snapshot이다.

## 2. 현재 구조 요약
- `class_exam_assignments`
  - `schema.sql`과 `phase3h_assignment_migration.sql`에 존재한다.
  - 현재 컬럼은 `id`, `class_id`, `exam_title`, `exam_date`, `question_count`, `archive_file`, `source_type`, `created_at`, `updated_at`이다.
  - `routes/exams.js`의 `POST /api/class-exam-assignments`는 `(class_id, exam_title, exam_date, archive_file)` 기준으로 upsert한다.
  - `archive/mixed_engine.html`은 출제 등록 시 `archive_file = MIXED:<key>`, `source_type = mixed`를 보낸다.
- `exam_sessions`
  - `schema.sql`에 `id TEXT PRIMARY KEY`, `student_id`, `exam_title`, `score`, `exam_date`, `question_count`, `class_id`, `archive_file`, `created_at`, `updated_at` 구조로 존재한다.
  - `routes/exams.js`의 수동 저장 `PATCH /api/exam-sessions/new`와 일괄 OMR 저장 `POST /api/exam-sessions/bulk-omr`가 같은 테이블에 저장한다.
  - 현재 `assignment_id`, `pack_id`, `source_hash`, `analysis_status`는 없다.
- `wrong_answers`
  - `schema.sql`에 `id`, `session_id`, `question_id`, `student_id`만 있다.
  - 수동 OMR과 일괄 OMR 모두 저장 시 기존 `wrong_answers`를 삭제한 뒤 `wrong_ids`만 다시 insert한다.
  - 따라서 현재 구조는 오답 번호만 저장하며, 학생 답안, 정답, 부분점수, 문항별 O/X/partial 전체 row는 저장하지 않는다.
- `exam_blueprints`
  - `schema.sql`과 `stage6b_exam_blueprints_no_alter.sql`에 존재한다.
  - `(archive_file, question_no)`가 primary key이고 `source_archive_file`, `source_question_no`, `standard_unit_key`, `standard_unit`, `standard_course`, `concept_cluster_key`를 저장한다.
  - `routes/exams.js`의 `POST /api/exam-blueprints`는 mixed 시험지 문항 번호와 원본 문항 정보를 upsert한다.
  - `core.js`의 `ensureBlueprintsForSessions`, `findBlueprintForWrong`, `computeStudentWeakUnits`, `computeClassWeakUnits`는 `exam_sessions.archive_file`과 `wrong_answers.question_id`로 blueprint를 찾아 취약 단원을 계산한다.
- `report localStorage cache`
  - `apmath/js/report.js`는 `window.AP_REPORT_AI_ANALYSIS_CACHE`와 `localStorage` 키 `AP_REPORT_AI_ANALYSIS_CACHE_<sessionId>`에 프리미엄 분석 결과를 캐시한다.
  - `reportCenterRequestExamAiAnalysis`, `reportCenterRequestPrintViewAiAnalysis`는 `api.post('ai/report-analysis', payload)` 호출 후 premium source일 때만 localStorage에 저장한다.
- `ai/report-analysis` DB 저장 부재
  - `routes/reports-ai.js`의 `POST /api/ai/report-analysis`는 AI/proxy 결과 또는 fallback 결과를 즉시 반환한다.
  - 해당 route 안에서 분석 결과를 DB에 insert/update하는 snapshot 저장 로직은 확인되지 않았다.

## 3. 유지해야 할 기존 구조
- `MIXED:<key>`
  - `archive/mixed_engine.html`이 `archive_file = MIXED:<key>`로 `class_exam_assignments`와 `exam_blueprints`를 연결한다.
  - `apmath/js/qr-omr.js`의 `normalizeQrArchiveFile`은 `MIXED:` 값을 그대로 허용한다.
  - `docs/domains/ARCHIVE_OMR_DOMAIN.md`도 `MIXED:{key}` 처리와 archive 원문/assets 태그 흐름 보존을 명시한다.
- `exam_blueprints`
  - 평가팩 문항이 mixed engine으로 전달되면 `registerBlueprintToOS()`가 `_sourceFile`, `_sourceQuestionNo`, `standardUnitKey`, `standardUnit`을 이용해 원본 문항 매핑을 등록한다.
  - 분석 저장 구조는 이 매핑을 대체하지 않고, 문항별 결과와 snapshot 생성 시 참조해야 한다.
- `wrong_answers`
  - 기존 학생/반 취약 단원 계산과 UI는 `wrong_answers`를 사용한다.
  - Round 1 설계는 기존 `wrong_answers`를 제거하지 않고, 더 상세한 `assessment_result_items`를 추가하는 방향이다.
- 기존 QR/OMR 흐름
  - `check-omr.js`는 QR 초기화에서 `archive_file`을 전달한다.
  - `qr-omr.js`는 수동 OMR 저장 시 `PATCH exam-sessions/new`, 일괄 OMR 저장 시 `POST exam-sessions/bulk-omr`를 사용한다.
  - 이 흐름은 유지하고, 추후 라운드에서 같은 저장 시점에 문항별 상세 결과를 보강한다.
- `mixed_engine` 출제 흐름
  - 평가팩 MVP는 `assessment-mvp.html`에서 `mixedQuestions_<key>`, `mixedMeta_<key>`를 localStorage에 저장하고 `mixed_engine.html?key=assessment_<packId>_<timestamp>`로 이동한다.
  - `mixed_engine.html`은 이 key로 `MIXED:<key>` archive_file을 만들고 출제/blueprint를 등록한다.

## 4. 부족한 부분
- 문항별 전체 결과 저장 부재
  - `wrong_answers`는 틀린 번호만 저장하므로 맞은 문항, 부분점수, 미채점, 학생 답안, 정답, 배점, 난이도, 유형을 보존할 수 없다.
- 분석 snapshot 부재
  - 문항별 분석표, 단원별/유형별/난이도별 집계, 보완 필요 목록을 서버 DB에 저장하는 테이블이 없다.
- 리포트 snapshot 부재
  - 프리미엄 분석과 학부모용 평가 리포트는 현재 프론트 localStorage 캐시 중심이며, 서버 DB 재사용 단위가 없다.
- `source_hash` / stale 부재
  - 시험 결과가 수정되었을 때 기존 분석표/리포트가 최신 결과와 일치하는지 판정하는 공통 기준이 없다.
- `pack_id` / `assignment_id` 연결 약함
  - 평가팩 MVP의 `assessmentPackId`는 mixed meta에 들어가지만, 현재 `class_exam_assignments`와 `exam_sessions`에는 별도 `pack_id`가 없다.
  - 현재 `class_exam_assignments.id`는 TEXT UUID 구조이므로, 추후 `exam_sessions.assignment_id`도 TEXT로 맞추는 편이 기존 스키마와 맞다.

## 5. 권장 DB 설계
- `class_exam_assignments` 보강
  - `pack_id TEXT`: 평가팩 원본 pack id를 저장한다.
  - `grade_label TEXT`: 학년 전체/학년별 조회와 snapshot 범위를 돕는다.
  - `source_hash TEXT`: 출제 묶음의 원본 fingerprint 보조값이다.
  - `assignment_batch_id TEXT`: 화면상 학년 전체 출제를 반별 assignment 여러 개로 저장할 때 묶는 id다.
  - `target_scope TEXT`: `class`, `grade` 등 출제 화면 범위를 기록한다.
  - `created_by TEXT`: 생성 주체를 기록한다.
- `exam_sessions` 보강
  - `assignment_id TEXT`: 현재 `class_exam_assignments.id`가 TEXT이므로 TEXT 권장.
  - `pack_id TEXT`: 평가팩 기반 시험의 pack id를 session에도 복사해 조회 비용을 줄인다.
  - `source_hash TEXT`: 해당 학생 결과 기준 hash를 저장한다.
  - `analysis_status TEXT`: `none`, `basic_ready`, `premium_ready`, `stale` 중 하나를 저장한다.
- `assessment_result_items`
  - 목적은 `wrong_answers`만으로 부족한 문항별 전체 O/X/partial/unchecked, 학생답, 정답, 점수, 원본 문항, 단원, 유형, 난이도를 저장하는 것이다.
  - 주요 컬럼은 `session_id`, `assignment_id`, `pack_id`, `student_id`, `class_id`, `order_no`, `question_no`, `result_status`, `is_correct`, `student_answer`, `correct_answer`, `score`, `max_score`, `source_archive_file`, `source_question_no`, `standard_unit_key`, `standard_unit`, `concept_cluster_key`, `type_key`, `difficulty`, `analysis_note`, timestamps다.
  - `result_status` 후보는 `correct`, `wrong`, `partial`, `unchecked`다.
- `assessment_analysis_snapshots`
  - 목적은 내부용 날것 분석표 snapshot 저장이다.
  - `analysis_json`에는 문항별 분석표, 단원별 집계, 유형별 집계, 난이도별 집계, 보완 필요 목록을 저장한다.
  - `analysis_scope` 후보는 `student`, `class`, `grade`다.
  - `analysis_type` 후보는 `raw_item_analysis`, `unit_summary`, `class_summary`, `grade_summary`다.
  - `source_hash`, `invalidated_at`, `is_stale`로 재사용/무효화 상태를 관리한다.
- `assessment_report_snapshots`
  - 목적은 프리미엄 분석과 학부모용 평가 리포트 snapshot 저장이다.
  - `report_json`에는 구조화된 분석/리포트 결과를 저장하고, 필요하면 `rendered_html`에 렌더링 결과를 저장한다.
  - `report_type` 후보는 `premium_analysis`, `parent_report`, `printable_report`다.
  - `analysis_snapshot_id`로 원본 분석 snapshot과 연결한다.
  - `ai_source`, `ai_model`로 AI 생성 출처를 기록한다.

## 6. source_hash / stale 정책
- hash 입력값 후보
  - `pack_id`
  - `assignment_id`
  - `session_id`
  - `student_id` 또는 `class_id`
  - `exam_title`
  - `exam_date`
  - `question_count`
  - `score`
  - 문항별 `result_status`
  - `student_answer`
  - `correct_answer`
  - `source_archive_file`
  - `source_question_no`
  - `standard_unit_key`
  - `concept_cluster_key`
  - `difficulty`
  - `type_key`
  - `updated_at`
- 재사용 조건
  - 같은 `source_hash`이고 `is_stale = 0`, `invalidated_at IS NULL`인 최신 snapshot은 재사용한다.
  - 기본 표시는 같은 scope/type/report_type 중 최신 non-stale snapshot이다.
- 재분석 조건
  - OMR 재저장, 오답 초기화, 시험 점수/문항 수/날짜 변경, blueprint 변경, 문항별 상세 결과 변경으로 `source_hash`가 달라지면 기존 snapshot을 stale 처리한다.
  - 저장된 프리미엄 분석이 있어도 현재 결과 hash와 다르면 `stale`이 우선이다.
- history 보존 정책
  - 재분석 시 기존 snapshot을 덮어쓰지 않고 새 row를 생성한다.
  - 기존 row는 `is_stale = 1`, `invalidated_at = CURRENT_TIMESTAMP`로 history에 남긴다.
  - 운영 UI는 기본적으로 최신 non-stale만 보여주고, 별도 이력 화면에서 stale snapshot을 조회할 수 있게 한다.

## 7. 프론트 상태 표시 정책
- 상태값
  - `none`: 분석 전
  - `basic_ready`: 기본 분석 완료
  - `premium_ready`: 프리미엄 분석 완료
  - `stale`: 재분석 필요
- 표시 문구
  - `none`: 분석 전
  - `basic_ready`: 기본 분석 완료
  - `premium_ready`: 프리미엄 분석 완료
  - `stale`: 재분석 필요
- 색상/하이라이트 구분 원칙
  - 분석 전: 회색
  - 기본 분석 완료: 파란색 계열
  - 프리미엄 분석 완료: 금색 또는 보라색 계열
  - 재분석 필요: 주황/빨강 계열
- 우선순위
  - 프리미엄 분석 완료와 재분석 필요가 헷갈리면 안 된다.
  - 저장된 프리미엄 분석이 있어도 결과가 바뀌면 `stale`을 우선 표시한다.
  - `premium_ready`는 현재 `source_hash`와 premium report snapshot의 `source_hash`가 일치할 때만 표시한다.

## 8. 학년 전체 출제 저장 정책
- 화면에서는 학년 전체 출제로 보일 수 있다.
- DB 저장은 반별 `class_exam_assignments` 여러 개로 풀어 저장한다.
- 여러 반별 assignment는 `assignment_batch_id`로 묶는다.
- OMR, 시험성적, 학생별 리포트는 반별 `assignment_id` 기준으로 처리한다.
- 학년 단위 분석 snapshot은 반별 assignment/result를 모아 `analysis_scope = grade`, `grade_label`, `assignment_batch_id` 기준으로 생성한다.

## 9. API 제안
- 조회
  - `GET /api/assessment-analysis/snapshots?session_id=...&analysis_type=...`
  - `GET /api/assessment-reports/snapshots?session_id=...&report_type=...`
  - `GET /api/assessment-results/source-hash?session_id=...`
- 생성
  - `POST /api/assessment-analysis/snapshots`
  - `POST /api/assessment-reports/snapshots`
- 재분석
  - `POST /api/assessment-analysis/reanalyze`
- 이번 Round 1에서는 API를 구현하지 않는다. 실제 구현 전에는 인증/권한, class 접근권, student 접근권, stale 처리 트랜잭션, D1 batch 실패 정책을 별도 설계해야 한다.

## 10. 구현 라운드
- Round 1: 저장 구조 설계/초안
- Round 2: migration 적용
- Round 3: 평가팩 출제 `pack_id` / `assignment_id` 연결
- Round 4: `assessment_result_items` 저장
- Round 5: raw 분석표 snapshot
- Round 6: `premium_analysis` snapshot
- Round 7: `parent_report` snapshot
- Round 8: Academy OS 이식

## 11. 위험 요소
- `ASSESSMENT:<packId>`를 `archive_file`에 바로 넣는 위험
  - 현재 흐름은 `MIXED:<key>`로 mixed 시험지와 blueprint를 연결한다.
  - `ASSESSMENT:<packId>`를 `archive_file`에 직접 넣으면 `mixed_engine.html`이 만든 key, `exam_blueprints.archive_file`, OMR archive_file, 리포트 cohort 기준이 어긋날 수 있다.
  - 권장 방향은 `archive_file = MIXED:<key>`를 유지하고 `pack_id`는 별도 컬럼에 저장하는 것이다.
- 평가팩 key가 매번 `Date.now()`로 달라지는 위험
  - `assessment-mvp.html`은 `assessment_<pack.id>_<Date.now()>` key를 만든다.
  - 같은 pack이라도 매번 `MIXED:<key>`가 달라지므로 `pack_id`, `assignment_id`, `source_hash` 없이는 재사용 판정이 약하다.
- blueprint 등록 실패 위험
  - `mixed_engine.html`은 원본 파일이 없으면 해당 문항 blueprint 저장을 건너뛰고, API 실패 시 console warning만 남긴다.
  - blueprint가 없으면 wrong_answers 기반 단원 분석이 누락될 수 있다.
- `wrong_answers`만으로 분석표를 만들 때 정보 부족
  - 맞은 문항 row, 학생 답안, 정답, 부분점수, 미채점 상태가 없다.
  - 정확한 분석표는 `assessment_result_items` 저장 이후에 안정적으로 만들 수 있다.
- 매번 AI 분석 호출 비용/일관성 위험
  - 현재 `ai/report-analysis`는 서버 DB snapshot 없이 결과를 반환한다.
  - localStorage 캐시는 브라우저/기기별이며 운영 서버의 일관된 history가 아니다.
- stale 판정 부재 위험
  - 결과 수정 후 예전 프리미엄 분석이 그대로 보이면 학부모 리포트와 실제 점수가 불일치할 수 있다.

## 12. 결론
- 지금 바로 가능한 것
  - 실제 운영 schema를 수정하지 않고, `docs` 아래 migration draft로 저장 구조를 검토할 수 있다.
  - `MIXED:<key>` 유지, `pack_id` 별도 저장, 반별 assignment와 batch 묶음 정책을 확정할 수 있다.
- 추가 설계가 필요한 것
  - `source_hash` 생성 위치와 canonical JSON 정렬 규칙.
  - `assessment_result_items`를 OMR 저장 시점에 만들지, 분석 생성 시점에 보강 생성할지에 대한 구현 정책.
  - 프리미엄 분석과 학부모 리포트의 `report_json` 표준 스키마.
  - 기존 localStorage 캐시와 서버 snapshot의 전환/동기화 정책.
- 다음 구현에서 먼저 해야 할 것
  - 실제 migration 적용 전 `PRAGMA table_info` 기반 컬럼 존재 확인 로직을 준비한다.
  - `class_exam_assignments.id`가 TEXT인 현재 구조에 맞춰 `exam_sessions.assignment_id TEXT` 연결을 먼저 확정한다.
  - 평가팩 출제 시 `pack_id`, `assignment_id`, `assignment_batch_id`가 OMR 저장과 리포트 조회까지 이어지는지 end-to-end 흐름을 설계한다.
