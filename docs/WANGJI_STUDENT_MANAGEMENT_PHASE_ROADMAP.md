# 왕지교육 공통 학생관리 — 단계 로드맵 (PHASE_ROADMAP)

> 이 문서는 1차~6차 전체 단계의 **Codex 작업 단위 세부 계획**이다.
> 각 차수는 그대로 CODEX_TASK.md 지시서로 변환 가능한 수준으로 적는다.
>
> 전 단계 공통 불변 원칙:
> - 기존 AP/EIE DB는 **원본**. 폐기/이전/일괄 복사/재입력 금지.
> - 새 공통 저장소는 **overlay/link/index**. 원본 학생 DB가 아니다.
> - **자동 병합 금지.** 후보는 candidate까지만, active는 관리자 확정.
> - 원본 반영은 5차 이후 **AP/EIE 공식 API 또는 검증된 write-through adapter**로만. 직접 SQL write 영구 금지.
> - 기존 AP/EIE 화면/학생상세/시간표/상담/출결 교체 금지.
> - 각 차수는 별도 CODEX_TASK 지시서 + 종료 검수를 거친 뒤 다음 차수로 넘어간다.

## 전체 단계 한눈에

```text
1차: 독립 화면 + read-only adapter + schema draft        [완료]
2차: overlay 저장소/API 실제화                            [다음]
3차: AP/EIE 실데이터 연결 정밀화
4차: 입력 중심 이전 1단계
5차: write-through 검증 도입                              [위험 구간 — 별도 지시서·검수 필수]
6차: 기존 학생관리 보조화
```

| 차수 | 한 줄 정의 | 원본 DB 영향 | 세부계획서 | 상태 |
|---|---|---|---|---|
| 1차 | 독립 화면 + read-only adapter + schema draft | 없음 (read만) | `WANGJI_STUDENT_MANAGEMENT_V1_IMPLEMENTATION_SCOPE.md` | 완료 |
| 2차 | overlay 저장소(신규 D1+Worker) 실제화 | 없음 (overlay만 write) | `WANGJI_STUDENT_MANAGEMENT_PHASE2_PLAN.md` | 계획 |
| 3차 | AP/EIE 학생별 실데이터 정밀 연결 | 없음 (read 정밀화) | `WANGJI_STUDENT_MANAGEMENT_PHASE3_PLAN.md` | 계획 |
| 4차 | 입력 중심 이전 1단계 (공통 입력 + 검토 큐) | 없음 (큐 적재까지만) | `WANGJI_STUDENT_MANAGEMENT_PHASE4_PLAN.md` | 계획 |
| 5차 | write-through 검증 도입 | **있음 (공식 API 경유)** | `WANGJI_STUDENT_MANAGEMENT_PHASE5_PLAN.md` | 계획 — 별도 통제 |
| 6차 | 기존 학생관리 보조화 | 최소 (진입점 조정) | `WANGJI_STUDENT_MANAGEMENT_PHASE6_PLAN.md` | 계획 |

---

## 1차 — 독립 화면 + read-only adapter + schema draft [완료]

세부 계획: `docs/WANGJI_STUDENT_MANAGEMENT_V1_IMPLEMENTATION_SCOPE.md`

산출물(완료): `apmath/wangji-student-management.html`, `apmath/js/wangji-student-management.js`,
`apmath/css/wangji-student-management.css`, `docs/WANGJI_STUDENT_MANAGEMENT_V1_SCHEMA_DRAFT.sql`

이월 항목(후속 차수에서 처리):
- EIE 전체 timetable을 학생 schedule처럼 표시한 오표시 → **3차에서 완전 차단** (또는 v2 준비판에서 선보정)
- AP/EIE 상세 deeplink 미확정 → 3차
- adapter 인증 방식 미확정 → 2차(공통 Worker 프록시로 해소 가능)

---

## 2차 — overlay 저장소/API 실제화 [다음 단계]

### 목표
```text
왕지 공통 학생관리의 저장소를 실제로 만든다.
단, AP/EIE 원본 DB는 아직 수정하지 않는다.
```

### 구현 범위
1. **신규 D1 `wangji-common-os` 생성** + 신규 Worker `workers/wangji-common-worker/` (권장; 기존 두 워커 미수정)
2. schema draft를 정식 migration으로 승격 (`wangji_students`, `wangji_student_links`, `wangji_consultations`, `wangji_memos` 추가, audit log 테이블 후보)
3. overlay API (공통 Worker, `/api/wangji/*`):
   - `wangji_students` CRUD (공통 anchor 생성/수정/숨김 — 원본 복사 아님)
   - `wangji_student_links` CRUD + 상태 전이 (candidate/active/rejected/archived, active 전환은 confirmed_by 기록)
   - `wangji_consultations` CRUD (공통 상담 실제 저장)
   - 공통 메모 저장
4. 프론트 연결: 1차 화면의 disabled 저장 버튼들을 overlay API에 연결. `overlayApi.status = connected`.
5. 인증: 공통 Worker 자체 관리자 세션(또는 기존 AP teacher 세션 검증 재사용 — 사용자 결정 필요).

### 금지
- AP/EIE 원본 학생 수정 / 반 배정 수정 / AP·EIE 상담 DB 저장 / write-through
- AP/EIE 원본 DB에 migration 적용 (migration은 **신규 D1에만**)
- 기존 AP/EIE Worker 파일 수정

### 완료 기준 (검수)
- 공통 anchor/링크/상담/메모가 신규 D1에 저장·조회됨
- `git diff`에 기존 AP/EIE worker/프론트 핵심 파일 변경 0
- 링크 상태 전이가 관리자 확정 없이는 active가 되지 않음
- AP/EIE API에 POST/PATCH/DELETE 호출 0 (코드 grep)

### 사전 결정 필요
- overlay DB 위치 확정 (신규 D1 권장) / 신규 Worker 이름·도메인 / 관리자 인증 방식

---

## 3차 — AP/EIE 실데이터 연결 정밀화

### 목표
```text
AP/EIE 기존 데이터를 정확히 읽어서 학생별로 통합 상세에 붙인다.
```

### 구현 범위
1. **AP 학생별 반/수업시간 정확 조회**: `class_students` → `classes` → `class_time_slots` 경로를 학생 id 기준으로 정확히 묶어 표시 (기존 `/api/students/:id/detail-data` 응답 구조 확정 후 사용)
2. **EIE 학생별 수업시간 endpoint 확정**: `eie_student_schedule_assignments` → `eie_timetable_cells` 기준 학생별 조회. 기존 EIE Worker에 read-only GET endpoint 추가가 필요하면 **최소 추가만** (예: `GET /api/eie/students/:id/schedules`) — POST/PATCH/DELETE 추가 금지
3. **EIE 전체 timetable 오표시 완전 차단**: 학생별 endpoint 연결 전에는 schedules를 비우고 "학생별 시간표 연결 필요" 안내
4. AP/EIE 기존 상담 read-only 정밀 조회 (학생 id 기준 필터 확정)
5. **AP/EIE 상세 deeplink 확정**: AP는 `apmath/js/student.js`의 상세 진입 함수/해시 조사, EIE는 `#students` 라우트 + 학생 선택 방식 조사 → "상세 열기" 버튼 활성화
6. **연결 후보 생성 로직**: 이름+학교/학년+보호자번호 일치 기준으로 candidate 자동 생성(`confidence_reason` 기록), 보호자번호 없으면 자동 후보 생성 안 함
7. 관리자 확인 후 active link 전환 운영 개시 (2차 API 사용)

### 금지
- 자동 병합 / 원본 DB 수정 / 기존 학생상세 교체
- EIE Worker에 read 외 endpoint 추가

### 완료 기준 (검수)
- 임의 학생 5명 표본: AP 반/시간, EIE 셀/시간이 원본 화면과 일치
- 전체 timetable이 학생 schedule로 표시되는 경로 0
- deeplink 버튼이 기존 상세를 정확히 연다 (기존 화면 동작 회귀 없음)
- candidate가 자동으로 active 되는 경로 0

---

## 4차 — 입력 중심 이전 1단계

### 목표
```text
왕지 공통 학생관리를 실제 입력 중심 화면으로 바꾸기 시작한다.
하지만 AP/EIE 원본 write-through는 아직 제한적으로만 설계한다.
```

### 구현 범위
1. 왕지 공통 학생 신규 등록 (anchor 생성 → AP/EIE 연결 선택 흐름 완성)
2. 공통 학생 기본정보 수정 (snapshot 갱신 — 원본 우선권 원칙 유지)
3. 공통 상담 작성/수정 (운영 수준 완성)
4. 공통 메모 작성/수정
5. AP/EIE 연결 관리 화면 완성 (후보 검토/확정/거절/보관)
6. **수강 연결 요청 UI**: "이 학생을 AP 반 X에 배정 요청" 같은 요청을 만들되 원본에 반영하지 않음
7. **write-through 대기 큐(검토 큐) 설계+구현**: 요청을 overlay DB의 큐 테이블(`wangji_writethrough_queue` 후보)에 적재. 상태: requested / reviewed / approved / rejected / applied(5차에서만). 원본 반영은 하지 않고 큐 적재까지만.

### 아직 금지
- AP/EIE 원본 DB 직접 수정 / AP·EIE API POST·PATCH·DELETE 본격 연결
- 수강 반 자동 배정 / 기존 AP/EIE 학생관리 대체

### 완료 기준 (검수)
- 공통 등록→연결→상담→메모 전체 입력 흐름이 overlay DB에서 동작
- 수강 연결 요청이 큐에 쌓이되 원본 DB diff 0
- 큐 항목에 요청자/대상/원본 식별자/요청 내용이 감사 가능 형태로 기록

---

## 5차 — write-through 검증 도입 ⚠️ 위험 구간

> **반드시 별도 지시서와 별도 검수 후에만 진행한다.** 이 로드맵만으로 착수 금지.

### 목표
```text
왕지 공통 학생관리에서 입력 → AP/EIE 공식 API로 원본 DB 반영
```

### 구현 범위 (최소 시작)
1. 4차 검토 큐의 **approved 항목만** 반영. 화면에서 원본 직접 저장 금지(반드시 큐 경유)
2. 반영 경로는 **AP/EIE 기존 공식 route/API만** (예: AP `PATCH /api/students`, enrollments 등 기존 route 재사용). 원본 DB 직접 SQL 영구 금지
3. 시작 범위 최소화: 1~2개 필드(예: 학생 연락처/메모)부터. 수강/반 배정 write는 별도 차수로 분리 검토
4. 반영 전 dry-run/preview → 관리자 최종 승인 → 반영 → 반영 결과(applied/failed) 큐에 기록
5. audit log: 누가/언제/무엇을/원본 응답 코드까지 기록
6. 실패 시 자동 재시도 금지(수동 재검토), 부분 실패 롤백 정책 사전 정의

### 금지
- 큐를 거치지 않는 원본 write / 직접 SQL / 자동 일괄 반영 / 자동 병합과 결합된 write

### 완료 기준 (검수)
- staging 또는 표본 학생 1~2명으로 반영→원본 화면 확인→롤백 절차 리허설 통과
- 기존 AP/EIE 회귀 테스트(기존 tests/ + 수동 핵심 플로우) 통과
- audit log로 모든 반영 추적 가능

### 사전 결정 필요
- write 허용 필드 목록 / 승인 권한자 / 실패·롤백 정책 / staging 환경 여부

---

## 6차 — 기존 학생관리 보조화

### 목표
```text
왕지 공통 학생관리가 주 입력 화면이 되고,
기존 AP/EIE 학생관리는 보조/레거시 입력 화면으로 전환한다.
```

### 구현 범위
1. 원장 메뉴에 "통합 학생관리" 정식 노출 (이때 처음으로 기존 메뉴에 항목 추가)
2. 기존 AP/EIE 학생상세에 "통합 학생관리에서 보기" 버튼 추가 (버튼 추가만, 기존 버튼/로직 제거 없음)
3. 교사 권한 모델 확정 후 교사 노출 범위 적용
4. 운영 가이드: 신규 입력은 왕지 화면 우선, 기존 화면은 보조
5. write-through 범위 점진 확대 (각 확대마다 5차 수준 검수 반복)

### 금지 (영구)
- 기존 AP/EIE 학생관리 화면 삭제/대체 강행 / 원본 DB 폐기 / 단일 DB 강제 통합(별도 라운드의 마이그레이션 설계로만)

### 완료 기준 (검수)
- 기존 사용자 흐름이 깨지지 않음 (기존 메뉴/버튼 전부 동작)
- 두 화면 병존 상태에서 데이터 정합성 모니터링 절차 운영

---

## 차수 전환 공통 게이트

각 차수 종료 시 아래를 통과해야 다음 차수 지시서를 작성한다.

1. `git status` 기준 작업 범위 외 파일 변경 0 (기존 변경 파일 분리 보고)
2. 원본 DB diff 0 (5차 이전) / 승인된 write만 (5차 이후)
3. 자동 병합 경로 0
4. 기존 AP/EIE 핵심 화면 수동 회귀 통과
5. CODEX_RESULT 보고서 저장 + 사용자 결정 필요 항목 명시
