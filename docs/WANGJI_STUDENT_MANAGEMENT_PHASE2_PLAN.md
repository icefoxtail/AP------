# 2차 세부계획서 — overlay 저장소/API 실제화 (PHASE2_PLAN)

> 이 문서는 2차 CODEX_TASK 지시서의 원본이다. 그대로 작업 지시로 변환 가능해야 한다.
> 상위 문서: `WANGJI_STUDENT_MANAGEMENT_PHASE_ROADMAP.md`

## 0. 목표

```text
왕지 공통 학생관리의 저장소를 실제로 만든다.
단, AP/EIE 원본 DB는 아직 수정하지 않는다.
```

## 1. 사전 결정 (작업 시작 전 사용자 확정 필수)

| 항목 | 권장안 | 결정 |
|---|---|---|
| overlay DB | 신규 D1 `wangji-common-os` | ☐ |
| Worker | 신규 `workers/wangji-common-worker/` (기존 두 워커 미수정) | ☐ |
| API 접두 | `/api/wangji/*` | ☐ |
| 관리자 인증 | 1안: 공통 Worker 자체 admin 세션 / 2안: AP teacher 세션 검증 재사용 | ☐ |
| 배포 도메인 | `wangji-common-os.js-pdf.workers.dev` (관례 따름) | ☐ |

미결정 항목이 있으면 해당 부분 구현을 멈추고 CODEX_RESULT에 보고한다.

## 2. 신규 파일 (수정 아님 — 전부 신규)

```text
workers/wangji-common-worker/wrangler.jsonc
workers/wangji-common-worker/index.js              -- 라우팅/인증/CORS만, 본문 금지
workers/wangji-common-worker/routes/wangji.js      -- API 본문
workers/wangji-common-worker/helpers/response.js   -- jsonResponse 등 (EIE worker 패턴 복제)
workers/wangji-common-worker/migrations/0001_wangji_overlay_init.sql
```

기존 파일 수정 허용 범위: `apmath/js/wangji-student-management.js`(API 연결), 같은 폴더 html/css. **그 외 기존 파일 수정 금지.**

## 3. DB schema (migration 0001 — 신규 D1에만 적용)

`docs/WANGJI_STUDENT_MANAGEMENT_V1_SCHEMA_DRAFT.sql` 기준으로 승격 + 보강:

```text
wangji_students            -- draft 그대로 (anchor + snapshot)
wangji_student_links       -- draft 그대로 (UNIQUE(source_app, source_student_id))
wangji_consultations       -- draft 그대로
wangji_memos (신규)
  id, wangji_student_id, title, content, importance, tags,
  created_by, created_at, updated_at, is_deleted
wangji_audit_logs (신규)
  id, actor, action, target_table, target_id, payload_summary, created_at
```

원본 데이터 INSERT seed 금지. 테이블은 비어 있는 상태로 시작한다.

## 4. API 설계 (`/api/wangji/*`)

| Method | Path | 동작 | 비고 |
|---|---|---|---|
| GET | `/students` | anchor 목록 (검색 q, 필터) | |
| POST | `/students` | anchor 생성 | 원본 복사 아님 |
| PATCH | `/students/:id` | anchor/snapshot 수정 | |
| DELETE | `/students/:id` | soft delete (is_deleted=1) | |
| GET | `/students/:id/links` | 링크 목록 | |
| POST | `/links` | 링크 생성 (**link_status는 candidate로 강제**) | |
| PATCH | `/links/:id/status` | candidate→active/rejected/archived | active 전환 시 confirmed_by/confirmed_at 필수 |
| GET | `/students/:id/consultations` | 공통 상담 목록 | |
| POST | `/consultations` | 공통 상담 저장 | source_scope 필수 |
| PATCH/DELETE | `/consultations/:id` | 수정/soft delete | |
| GET/POST/PATCH/DELETE | `/memos...` | 공통 메모 | |

규칙:
- POST `/links`에서 `link_status: 'active'`가 와도 서버가 candidate로 강제한다 (자동 확정 차단을 서버에서 보장).
- 모든 write는 `wangji_audit_logs`에 1줄 기록.
- index.js는 위임만, 본문은 routes/wangji.js (기존 worker 컨벤션 준수).

## 5. 프론트 연결

- `overlayApi` 모듈 추가: `status: unavailable | planned | connected` + 위 endpoint wrapper.
- 1차/v2 화면의 disabled 저장 버튼(상담/메모/링크)을 overlay API에 연결, 연결 성공 시 활성화.
- overlay API 미배포 환경에서는 자동으로 `planned` 상태 + 버튼 disabled (기존 동작 유지).
- AP/EIE adapter는 read-only 그대로. **AP/EIE API에 POST/PATCH/DELETE 호출 0 유지.**

## 6. 금지

- AP/EIE 원본 학생/반/상담/출결 수정, write-through
- `ap-math-os` / `wangji-eie-os`에 migration 적용
- 기존 AP/EIE Worker·프론트 핵심 파일 수정
- 자동 병합 (서버 강제 candidate로 차단)
- git commit/push (배포는 사용자가 wrangler로 직접 — 작업자는 명령만 보고)

## 7. 검증 / 완료 기준

```text
node --check workers/wangji-common-worker/{index,routes/wangji}.js
node --check apmath/js/wangji-student-management.js
git status -sb (작업 범위 외 변경 0)
grep: AP/EIE API에 POST|PATCH|DELETE 호출 0
grep: link 생성 경로에서 candidate 강제 확인
(가능 시) wrangler dev + 로컬 D1로 CRUD 왕복 확인
```

- anchor/링크/상담/메모가 신규 D1에 저장·조회됨
- 관리자 확정 없이 active 되는 경로 0
- 원본 DB diff 0

## 8. 산출물

신규 worker 일식 + 프론트 연결 + `CODEX_RESULT.md` 보고 (기존 변경 파일 분리 보고 포함)
