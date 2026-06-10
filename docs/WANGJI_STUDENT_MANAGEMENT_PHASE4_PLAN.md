# 4차 세부계획서 — 입력 중심 이전 1단계 (PHASE4_PLAN)

> 이 문서는 4차 CODEX_TASK 지시서의 원본이다.
> 상위 문서: `WANGJI_STUDENT_MANAGEMENT_PHASE_ROADMAP.md` / 선행: 2차·3차 완료

## 0. 목표

```text
왕지 공통 학생관리를 실제 입력 중심 화면으로 바꾸기 시작한다.
하지만 AP/EIE 원본 write-through는 아직 제한적으로만 설계한다.
(이번 차수: 검토 큐 적재까지. 원본 반영 0.)
```

## 1. 작업 항목

### 1.1 왕지 공통 학생 신규 등록 완성
- 등록 폼: 이름(필수), 학교, 학년, 연락처, 상태, 메모.
- 등록 직후 흐름: anchor 생성 → "AP 연결할까요? / EIE 연결할까요?" → 검색 → candidate 생성 → 관리자 확정.
- 검색 결과에 기존 후보 매칭 힌트(3차 로직 재사용) 표시. 자동 확정 없음.

### 1.2 공통 학생 기본정보 수정
- anchor/snapshot 필드 수정 (`PATCH /api/wangji/students/:id`).
- 화면에 원칙 고지: "AP/EIE 원본 정보는 읽기 전용으로 표시됩니다. 원본 수정은 후속 단계에서 지원됩니다."
- snapshot 수정이 원본을 바꾸지 않음을 UI에서 혼동 없게 구분 (원본값 vs 공통값 나란히 표시).

### 1.3 공통 상담 작성/수정 — 운영 수준 완성
- 필드: 상담일/scope(COMMON·AP·EIE)/유형/내용/다음 조치/후속 상태/공개 범위/작성자.
- 목록·필터(후속 필요만 보기)·수정·soft delete.
- 학생 목록 카드의 "최근 상담/후속 필요" 배지를 실제 공통 상담 데이터로 구동.

### 1.4 공통 메모 작성/수정
- 제목/내용/중요도/태그. 목록·수정·soft delete.

### 1.5 AP/EIE 연결 관리 화면 완성
- 후보 목록(confidence_reason 표시) / 확정 / 거절 / 보관 / 수동 연결 검색.
- 상태별 필터 (candidate/active/rejected/archived).

### 1.6 수강 연결 요청 UI + write-through 검토 큐
- 신규 테이블 (공통 D1 migration 0002):

```text
wangji_writethrough_queue
  id, wangji_student_id,
  target_app: AP / EIE
  target_type: student_info / enrollment / schedule / consultation
  target_source_id,            -- 원본 학생/반/셀 id
  request_payload_json,        -- 반영하려는 내용
  request_reason,
  status: requested / reviewed / approved / rejected / applied / failed
  requested_by, reviewed_by, decided_at,
  applied_at, apply_result_summary,   -- 5차에서만 사용
  created_at, updated_at, is_deleted
```

- UI: "AP 반 배정 요청", "학생 정보 수정 요청" 등 요청 작성 → 큐 적재(`status=requested`).
- 검토 화면: requested → reviewed → approved/rejected (관리자만).
- **applied 전이는 이번 차수에서 구현하지 않는다** (버튼 자체를 만들지 않거나 disabled + "5차 write-through 단계에서 연결").
- 큐 적재/상태 변경 모두 audit log 기록.

## 2. 수정 허용 파일

```text
apmath/wangji-student-management.html / js / css
workers/wangji-common-worker/* (+migration 0002)
```

기존 AP/EIE 파일 수정 0.

## 3. 아직 금지

- AP/EIE 원본 DB 직접 수정
- AP/EIE API POST·PATCH·DELETE 본격 연결 (큐 적재는 공통 D1에만)
- 수강 반 자동 배정
- 기존 AP/EIE 학생관리 대체
- 큐 항목의 자동 승인/자동 반영

## 4. 검증 / 완료 기준

```text
node --check (수정 JS 전부) / git status -sb
공통 등록→연결→상담→메모 전체 입력 흐름이 overlay DB에서 왕복 동작
수강 연결 요청이 큐에 쌓이되 원본 DB diff 0 (AP/EIE API write 호출 grep 0)
큐 항목: 요청자/대상 app/원본 식별자/payload/사유가 감사 가능 형태로 기록
applied 전이 코드 경로 없음(또는 disabled) 확인
```

## 5. 산출물

입력 흐름 완성 + 검토 큐 + migration 0002 + `CODEX_RESULT.md`
(5차 착수를 위한 "write 허용 필드 후보 목록"을 보고서에 정리해 사용자 결정 요청)
