# AP MATH Loop Experiment 01

## APMath 메모·주간일정 → EIE 원장/선생님 대시보드 공통 이식

## 0. 실험 목적

이번 작업은 단순 구현 지시가 아니다.

목적은 Codex 작업을 한 번에 맡기는 것이 아니라,
조사 → 설계 검증 → 백엔드 이식 → 프론트 이식 → UI/UX 검수 → 회귀 검수까지
작은 루프로 쪼개서 실패 지점을 조기에 잡는 것이다.

이번 루프의 핵심은 다음 3가지를 검증하는 것이다.

```text
1. APMath의 기존 메모/주간일정 구조를 EIE에 새로 만들지 않고 이식할 수 있는가
2. EIE 원장 대시보드와 선생님 대시보드 양쪽에 같은 운영 카드 경험을 붙일 수 있는가
3. 메모는 개인, 주간일정은 공용이라는 scope를 코드와 UI에서 정확히 분리할 수 있는가
```

---

# 1. 절대 전제

## 1-1. 새 기능 개발 아님

이번 작업은 EIE에 새 메모 기능이나 새 일정 기능을 만드는 작업이 아니다.

APMath에 이미 있는 다음 기능을 EIE에 이식한다.

```text
- 메모 카드
- 메모 전체 모달
- 메모 추가/완료/수정/삭제
- 주간일정 카드
- 일정관리 모달
- 시험/휴무/기타 일정 출력
- D-Day / 기간 일정 표시
- 대시보드 카드 UI/UX
```

원본 파일:

```text
apmath/js/memo.js               # 메모 모달/추가/완료/수정/삭제 (대시보드 카드 렌더는 여기 없음)
apmath/js/schedule.js
apmath/js/dashboard.js          # 메모/일정 대시보드 카드 렌더는 dashboard.js / dashboard-admin.js 안에 있음
apmath/js/dashboard-admin.js    # 원장 대시보드 본체(약 156KB) — Loop 0 조사 필수
apmath/js/dashboard-teacher.js  # 약 5KB 래퍼
apmath/js/dashboard-assistant-memos.js  # 별도 메모 보조 파일
```

> 주의: 메모 "대시보드 카드" 렌더 함수는 `memo.js`에 없다. `memo.js`는 모달/CRUD만 담당한다.
> 카드 렌더 지점은 `dashboard.js` / `dashboard-admin.js`에서 찾아야 한다.

메모 백엔드 원본:

```text
apmath/worker-backup/worker/routes/operations.js   # operation-memos GET/POST/PATCH/DELETE
```

대상 파일 후보:

```text
eie/js/views/eie-dashboard.js
eie/js/eie-api.js
workers/wangji-eie-worker/routes/eie.js
workers/wangji-eie-worker/index.js
eie/index.html
EIE CSS 파일
EIE migration 파일
```

---

# 2. 가장 중요한 scope 규칙

## 2-1. 메모는 개인 메모

메모는 공용이 아니다.

```text
원장 로그인 → 원장 개인 메모만 출력
선생님 로그인 → 해당 선생님 개인 메모만 출력
```

예시:

```text
박준성 로그인 → 박준성 메모만
정겨운 로그인 → 정겨운 메모만
정의한 로그인 → 정의한 메모만
원장 로그인 → 원장 메모만
```

다른 사용자의 개인 메모가 보이면 실패다.

메모 저장 기준은 이름 문자열보다 로그인 사용자 id 기준을 우선한다.

권장 기준:

```text
owner_user_id = auth.id
```

보조 표시 필드:

```text
owner_name
owner_role
```

메모 API는 항상 현재 로그인 사용자 기준으로 필터링한다.

```sql
SELECT *
FROM eie_operation_memos
WHERE owner_user_id = ?
ORDER BY is_pinned DESC, memo_date ASC, created_at DESC;
```

### ⚠️ 중요: 이것은 "그대로 이식"이 아니라 "의도적 동작 변경"이다

APMath 원본 메모(`operations.js` operation-memos GET)는 EIE가 원하는 개인 메모 동작과 다르다.

```text
APMath 원본 동작:
- admin(원장)  → 필터 없음. 모든 선생님 메모를 본다.
- teacher      → teacher_name = ? OR teacher_name = '' OR teacher_name IS NULL
                 (본인 메모 + 빈 이름 공용 메모)
- 식별자       → owner_user_id 가 아니라 teacher_name (이름 문자열)
```

EIE는 위 동작을 그대로 복사하면 안 된다. EIE에서는 다음을 새로 정의한다.

```text
EIE 메모 동작 (의도적 변경):
- 원장도 예외 없이 owner_user_id = auth.id 로 필터링한다.
  → 원장 화면에서 다른 선생님 메모가 보이면 FAIL.
- 식별자는 teacher_name 이 아니라 owner_user_id(=auth.id) 를 1차 기준으로 한다.
- "빈 이름 = 공용 메모" 분기는 제거한다. EIE 메모는 100% 개인이다.
- PATCH / DELETE 의 소유권 체크도 teacher_name 비교가 아니라
  owner_user_id = auth.id 비교로 한다. (타인 메모 수정/삭제 → 403)
```

즉 "새 메모 기능 개발 금지" 전제는 UI/CRUD 흐름에 적용되는 것이고,
메모 scope 규칙만은 EIE에서 새로 정의하는 것이 정상이다.

## 2-2. 주간일정은 공용 일정

주간일정은 개인 일정이 아니다.

```text
원장 대시보드 → 공용 주간일정 출력
선생님 대시보드 → 같은 공용 주간일정 출력
```

주간일정에 포함되는 것:

```text
- 시험 일정
- 휴무 일정
- 학원 공지
- 설명회
- 기타 학원 운영 일정
```

주간일정 API에는 선생님별 개인 필터를 걸지 않는다.

```text
exam_schedules = 공용
academy_schedules = 공용
```

---

# 3. 최종 화면 목표

## 3-1. 원장 대시보드

원장 대시보드에는 다음이 출력되어야 한다.

```text
메모 카드:
- 원장 개인 메모만 출력
- 고정/완료/추가/수정/삭제 가능

주간일정 카드:
- 공용 시험/휴무/기타 일정 출력
- 모든 선생님 화면과 동일한 일정
```

## 3-2. 선생님 대시보드

선생님 대시보드에도 반드시 출력되어야 한다.

```text
메모 카드:
- 로그인한 선생님 개인 메모만 출력
- 다른 선생님 메모 노출 금지

주간일정 카드:
- 원장과 동일한 공용 주간일정 출력
```

원장 대시보드에만 붙고 선생님 대시보드에 없으면 실패다.

---

# 4. UI/UX 목표

## 4-1. 메모 카드

제목:

```text
메모
```

출력 예시:

```text
┌────────────────────────────┐
│ 메모                 6/26  │
├────────────────────────────┤
│ □ 고정 안내문        고정  │
│ □ 상담 전화                │
│   6/27(토) · D-1           │
│ □ 교재 주문                │
│   6/30(화) · D-4           │
├────────────────────────────┤
│                 + 메모 추가 │
└────────────────────────────┘
```

메모 없음:

```text
┌────────────────────────────┐
│ 메모                 6/26  │
├────────────────────────────┤
│ 표시할 메모가 없습니다.    │
│                 + 메모 추가 │
└────────────────────────────┘
```

UX 기준:

```text
- 고정 메모는 상단
- 일반 메모는 오늘~7일 이내 표시
- 완료 체크 시 즉시 사라짐
- + 메모 추가는 카드 안에서 자연스럽게 펼침
- Enter 저장 가능
- 카드 본문 클릭 시 전체 메모 모달
- 전체 모달에서 수정/삭제/완료 가능
- 새로고침 후 유지
```

## 4-2. 주간일정 카드

제목:

```text
주간일정
```

출력 예시:

```text
┌────────────────────────────┐
│ 주간일정                   │
├────────────────────────────┤
│ [시험] 순천고 고1 기말     │
│       6/28(일)~6/30(화) D-2│
│ [휴무] 학원방학            │
│       7/1(수) D-5          │
│ [기타] 설명회              │
│       7/2(목) D-6          │
└────────────────────────────┘
```

UX 기준:

```text
- 오늘부터 7일 안의 공용 일정 출력
- 시험 / 휴무 / 기타 라벨 표시
- 시험 일정 우선
- 날짜 빠른 순
- 기간 일정은 날짜 범위로 표시
- 오늘이면 D-Day
- 기간 중이면 진행중
- 미래면 D-n
- 행 클릭 시 일정관리 모달
```

---

# 5. 디자인 기준

EIE 화면에서 APMath 파란색이 튀면 안 된다.

```text
- EIE 기존 card/surface 톤 사용
- 슬레이트/블루 계열의 차분한 색감
- 버튼은 EIE 버튼 톤
- 행 높이 48~52px
- 카드 안쪽 여백 12~14px
- hover 시 아주 약한 배경 변화
- active/focus 시 카드 반응 있음
```

금지:

```text
- APMath 파란 버튼 그대로 복붙
- 하단 버튼이 허접하게 붙는 것
- 일정관리로 이동 버튼 하나만 있는 placeholder
- 카드 안에 텍스트만 덩그러니 있는 것
- 모바일에서 체크박스/라벨/날짜가 겹치는 것
```

---

# 6. 루프 설계

## Loop 0. 조사 전용

목표:

```text
코드 수정 금지.
현재 구조만 조사한다.
```

Codex 작업:

```text
1. EIE 원장 대시보드 렌더 함수 확인 (renderTodayMemoPanel / renderWeeklySchedulePlaceholder 위치)
2. EIE 선생님 대시보드 렌더 함수 확인 (eie-teacher.js render)
3. 원장/선생님이 같은 파일을 쓰는지 role 분기인지 확인
4. EIE 선생님 대시보드가 "로그인 사용자" 기준인지 "보고 있는 _teacherName" 기준인지 확인 (★ scope 핵심)
   - openTeacher(name) 으로 임의 선생님 화면을 열 수 있는지 확인
5. EIE 프론트에서 로그인 사용자 식별 방법 확인 (WANGJI_EIE_ROLE / WANGJI_EIE_LOGIN_ID / Bearer 토큰)
6. EIE index.html script 순서 확인
7. EIE CSS 파일 위치 확인
8. EIE worker route 구조 + 토큰→teacher(id/name/role) 해석 지점 확인
9. EIE migration 위치/파일명 컨벤션 확인 (YYYYMMDD_eie_*.sql)
10. APMath memo.js에서 이식할 함수 목록 작성 (모달/CRUD만)
11. APMath operations.js operation-memos 백엔드 동작 확인 (admin 필터 유무, teacher_name 기준)
12. APMath schedule.js에서 이식할 함수 목록 작성
13. APMath dashboard.js / dashboard-admin.js에서 메모·일정 "대시보드 카드" 렌더 지점 확인
```

산출물:

```text
INVESTIGATION_EIE_MEMO_SCHEDULE_LOOP0.md
```

보고서 필수 포함:

```text
- 현재 EIE 원장 대시보드 구조
- 현재 EIE 선생님 대시보드 구조
- 메모 localStorage 사용 지점
- 주간일정 placeholder 사용 지점
- 이식 대상 함수 매핑표
- 수정 예상 파일
- 회귀 위험
- 다음 루프 제안
```

PASS:

```text
- 코드 변경 없음
- 원장/선생님 대시보드 위치 확인
- 메모/주간일정 원본 함수 매핑 완료
```

FAIL:

```text
- 조사 없이 코드 수정
- 선생님 대시보드 위치 미확인
- 선생님 대시보드가 _teacherName 기준인지 로그인 사용자 기준인지 미확인
- APMath operations.js 메모 백엔드 실제 동작(admin 무필터) 미확인
- localStorage 메모 제거 계획 누락
- 주간일정 placeholder 제거 계획 누락
```

---

## Loop 1. Backend / DB 이식

목표:

```text
EIE에서 개인 메모 API와 공용 일정 API가 작동하도록 만든다.
```

추가 API:

```text
GET    /api/eie/operation-memos
POST   /api/eie/operation-memos
PATCH  /api/eie/operation-memos/:id
DELETE /api/eie/operation-memos/:id

GET    /api/eie/exam-schedules
POST   /api/eie/exam-schedules
POST   /api/eie/exam-schedules/group
PATCH  /api/eie/exam-schedules/group
POST   /api/eie/exam-schedules/group-delete
PATCH  /api/eie/exam-schedules/:id
DELETE /api/eie/exam-schedules/:id

GET    /api/eie/academy-schedules
POST   /api/eie/academy-schedules
POST   /api/eie/academy-schedules/batch
PATCH  /api/eie/academy-schedules/:id
PATCH  /api/eie/academy-schedules/series/:seriesId
DELETE /api/eie/academy-schedules/:id
DELETE /api/eie/academy-schedules/series/:seriesId
```

DB 권장:

```text
eie_operation_memos
eie_exam_schedules
eie_academy_schedules
```

마이그레이션 파일명은 EIE 컨벤션을 따른다.

```text
workers/wangji-eie-worker/migrations/YYYYMMDD_eie_*.sql
예: 20260626_eie_operation_memos.sql
```

> 주의: 기존 eie_exam_records(학생별 성적 기록)와 eie_exam_schedules(공용 시험 일정)는
> 완전히 다른 개념이다. 이름이 비슷하니 혼동·재사용 금지.

중요:

```text
operation_memos는 owner_user_id(=auth.id) 기준 개인 필터
  - 원장(admin)도 예외 없이 owner_user_id 로 필터링한다 (APMath 원본의 admin 무필터를 따라가지 말 것)
  - PATCH/DELETE 소유권 체크도 owner_user_id = auth.id 로 한다 (타인 메모 → 403)
  - "빈 이름 공용 메모" 분기는 만들지 않는다
exam_schedules / academy_schedules는 공용 (필터 없음)
```

산출물:

```text
CODEX_RESULT_LOOP1_BACKEND.md
```

PASS:

```text
- 로그인 사용자별 개인 메모 API 동작
- 원장/선생님 메모 분리 (원장도 본인 메모만, admin 무필터 아님)
- 타인 메모 PATCH/DELETE 시 403
- 공용 주간일정 API 동작
- 기존 EIE 학생/출석/상담 API 영향 없음
```

FAIL:

```text
- 메모를 공용으로 처리
- 주간일정을 선생님별로 필터링
- owner_user_id 없이 teacher_name만 의존
- 기존 EIE API 깨짐
```

---

## Loop 2. Front API Adapter 이식

목표:

```text
EIE 프론트에서 APMath와 비슷한 방식으로 메모/일정 API를 호출할 수 있게 한다.
```

대상:

```text
eie/js/eie-api.js
```

추가 메서드:

```text
getOperationMemos()
createOperationMemo()
updateOperationMemo()
deleteOperationMemo()

getExamSchedules()
createExamSchedule()
updateExamSchedule()
deleteExamSchedule()

getAcademySchedules()
createAcademySchedule()
updateAcademySchedule()
deleteAcademySchedule()
```

중요:

```text
메모 API는 개인 데이터라고 가정
일정 API는 공용 데이터라고 가정
모든 호출은 기존 eie-api.js 흐름(Bearer 토큰)을 그대로 탄다.
  - EIE는 레거시 Basic 인증을 제거했으므로 Basic/btoa 직접 작성 금지
  - 메모 API에 teacher_name / teacherName 파라미터를 절대 넘기지 않는다
    (개인 식별은 서버가 토큰→auth.id 로만 한다)
```

산출물:

```text
CODEX_RESULT_LOOP2_API_ADAPTER.md
```

PASS:

```text
- 대시보드 loadData 계층에서 operationMemos/examSchedules/academySchedules를 받을 수 있음
- non-GET 후 캐시 갱신 또는 대시보드 리렌더 가능
```

FAIL:

```text
- 프론트에서 APMath api/state를 직접 참조
- EIE API base를 우회
- 원장/선생님 분리 로직을 프론트에만 의존
```

---

## Loop 3. 공통 UI 컴포넌트 이식

목표:

```text
원장/선생님이 같이 쓰는 EIE 운영 카드 컴포넌트를 만든다.
```

권장 파일:

```text
eie/js/views/eie-operation-memos.js
eie/js/views/eie-operation-schedule.js
```

공통 함수:

```text
renderEieMemoDashboardCard(data, options)
renderEieWeeklyScheduleDashboardCard(data, options)

openEieTodoMemoModal()
addEieTodoMemo()
toggleEieMemoDone()
deleteEieMemo()
openEditEieTodoMemoModal()
handleEditEieTodoMemo()

openEieScheduleModal()
addEieUnifiedSchedule()
openEditEieUnifiedScheduleModal()
handleEditEieUnifiedSchedule()
deleteEieUnifiedSchedule()
```

options:

```js
{
  mode: 'owner' | 'teacher'
}
```

주의:

```text
메모 필터는 서버가 1차 책임.
프론트는 받은 개인 메모를 출력만 한다.
주간일정은 원장/선생님 모두 같은 공용 데이터를 출력한다.
```

산출물:

```text
CODEX_RESULT_LOOP3_COMMON_UI.md
```

PASS:

```text
- 메모 카드 UI 출력
- 주간일정 카드 UI 출력
- 모달 열림
- 완료/추가/수정/삭제 가능
- EIE 톤 유지
```

FAIL:

```text
- 원장/선생님용 코드를 각각 중복 복붙
- APMath 전역 함수명 그대로 사용
- localStorage 메모 함수 계속 사용
- placeholder 유지
```

---

## Loop 4. 원장 대시보드 연결

목표:

```text
EIE 원장 대시보드에 개인 메모 + 공용 주간일정을 연결한다.
```

변경:

```text
renderTodayMemoPanel(today)
→ renderEieMemoDashboardCard(data, { mode: 'owner' })

renderWeeklySchedulePlaceholder()
→ renderEieWeeklyScheduleDashboardCard(data, { mode: 'owner' })
```

산출물:

```text
CODEX_RESULT_LOOP4_OWNER_DASHBOARD.md
```

PASS:

```text
- 원장 개인 메모만 출력
- 공용 주간일정 출력
- localStorage 메모 미사용
- placeholder 제거
- 기존 선생님 현황/최근상담/최근등록학생 레이아웃 유지
```

FAIL:

```text
- 원장 화면에 선생님 개인 메모 노출
- 주간일정 placeholder 유지
- 대시보드 레이아웃 흔들림
```

---

## Loop 5. 선생님 대시보드 연결

목표:

```text
EIE 선생님 대시보드에도 개인 메모 + 공용 주간일정을 연결한다.
```

Codex는 Loop 0에서 확인한 선생님 대시보드 위치에 붙인다.

출력:

```text
메모 = 로그인한 선생님 개인 메모
주간일정 = 공용 일정
```

### ⚠️ 중요: 메모는 "화면에 표시된 _teacherName"이 아니라 "로그인 사용자"다

EIE 선생님 대시보드(eie-teacher.js)는 _teacherName(이름 문자열)으로 렌더되고,
openTeacher(name) 으로 임의 선생님 대시보드를 열 수 있다.

따라서 메모 카드를 _teacherName 기준으로 붙이면,
원장이 박준성 대시보드를 열었을 때 박준성 개인 메모가 노출된다 → FAIL.

```text
- 메모는 반드시 서버가 토큰(auth.id)으로 필터링한 결과만 출력한다.
- 메모 API 호출 시 _teacherName 을 파라미터로 넘기지 않는다.
- _teacherName 은 시간표/수업 표시용일 뿐, 메모 식별에 쓰지 않는다.
- 주간일정은 공용이므로 _teacherName 과 무관하다.
```

산출물:

```text
CODEX_RESULT_LOOP5_TEACHER_DASHBOARD.md
```

PASS:

```text
- 선생님 대시보드에 메모 카드 출력
- 선생님 대시보드에 주간일정 카드 출력
- 다른 선생님 메모 노출 없음
- 공용 주간일정은 원장과 동일
- 모바일에서 깨지지 않음
```

FAIL:

```text
- 원장 대시보드에만 붙음
- 선생님 화면에서 다른 선생님 메모가 보임
- 메모를 _teacherName 기준으로 조회함 (auth.id 기준이어야 함)
- 원장이 특정 선생님 대시보드를 열었을 때 그 선생님 메모가 노출됨
- 선생님 주간일정이 비어 있음
- 선생님 대시보드 레이아웃 깨짐
```

---

## Loop 6. UI/UX 검수 루프

목표:

```text
기능 완료가 아니라 실제 대시보드 출력 품질을 검수한다.
```

검수 상태:

```text
1. 원장 메모 없음
2. 원장 메모 있음
3. 원장 고정 메모 있음
4. 선생님 메모 없음
5. 선생님 메모 있음
6. 선생님 고정 메모 있음
7. 주간일정 없음
8. 시험 일정 있음
9. 휴무 일정 있음
10. 기타 일정 있음
11. 기간 일정 있음
12. 모바일 폭
```

산출물:

```text
CODEX_RESULT_LOOP6_UI_REVIEW.md
```

PASS:

```text
- 카드가 EIE 톤과 어울림
- 버튼이 허접하게 붙지 않음
- 긴 텍스트 말줄임
- 체크박스와 카드 클릭 충돌 없음
- hover/active/focus 반응 있음
- 모바일 카드 깨짐 없음
```

FAIL:

```text
- 하단 버튼이 대충 붙어 보임
- 텍스트만 덩그러니 출력
- APMath 파란 스타일 튐
- 모바일에서 라벨/날짜 겹침
```

---

## Loop 7. 회귀 검수 루프

목표:

```text
메모/주간일정 이식이 기존 EIE 핵심 기능을 깨지 않았는지 확인한다.
```

검수 항목:

```text
- 로그인
- 원장 대시보드 진입
- 선생님 대시보드 진입
- 시간표 이동
- 출석부 이동
- 성적표 이동
- 관리 이동
- 학생 상세
- 상담 목록
- 최근 등록 학생
- EIE timetable grid
- 학생 이름 렌더링
```

산출물:

```text
CODEX_RESULT_LOOP7_REGRESSION.md
```

PASS:

```text
- 기존 기능 영향 없음
- 콘솔 에러 없음
- 대시보드 재렌더 정상
```

FAIL:

```text
- 기존 EIE 시간표 깨짐
- 학생 상세 깨짐
- 로그인/role 분기 깨짐
- 콘솔 에러 발생
```

---

# 7. 최종 PASS 기준

최종 완료는 다음을 모두 만족해야 한다.

```text
1. 원장 대시보드에 원장 개인 메모만 출력된다. (원장이 선생님 메모를 보지 않는다)
2. 선생님 대시보드에 로그인한 본인 개인 메모만 출력된다. (auth.id 기준, _teacherName 기준 아님)
3. 다른 사용자의 메모가 노출되지 않는다. (조회/수정/삭제 모두)
4. 원장/선생님 대시보드에 같은 공용 주간일정이 출력된다.
5. 주간일정 placeholder가 완전히 사라진다.
6. EIE localStorage 메모가 최종 데이터 원천으로 쓰이지 않는다.
7. 메모 추가/완료/수정/삭제가 된다.
8. 일정 등록/수정/삭제가 된다.
9. UI가 EIE 대시보드 톤과 맞는다.
10. 모바일에서 깨지지 않는다.
11. 기존 EIE 핵심 기능이 깨지지 않는다.
```

---

# 8. 최종 FAIL 기준

아래 중 하나라도 있으면 실패다.

```text
- 메모를 공용으로 처리함
- 원장(admin)이 모든 선생님 메모를 봄 (APMath 원본 admin 무필터를 그대로 이식함)
- 메모를 owner_user_id 대신 teacher_name 으로만 식별함
- 주간일정을 개인 일정처럼 처리함
- 원장 대시보드에만 붙고 선생님 대시보드에 안 붙음
- 선생님 화면에서 다른 선생님 메모가 보임
- localStorage 메모가 계속 사용됨
- 주간일정이 placeholder로 남음
- API만 붙이고 대시보드 출력이 허접함
- 버튼이 하단에 대충 붙어 보임
- 모바일에서 카드가 깨짐
- 기존 EIE 시간표/학생/상담 기능이 깨짐
```

---

# 9. Codex 1차 지시문

```text
# 작업명
APMath 메모·주간일정 → EIE 원장/선생님 대시보드 공통 이식 Loop 0 조사

# 이번 라운드 목표
코드 수정 금지.
현재 구조 조사와 이식 매핑표 작성만 한다.

# 핵심 전제
메모는 개인 메모다.
원장은 원장 개인 메모만 보고, 선생님은 자기 개인 메모만 본다.

주간일정은 공용 일정이다.
원장과 모든 선생님은 같은 시험/휴무/기타 일정을 본다.

이번 작업은 새 기능 개발이 아니다.
APMath의 기존 메모/주간일정/일정관리/대시보드 카드 UI를 EIE에 이식하는 작업이다.

# 조사할 것
1. EIE 원장 대시보드 렌더 함수 위치
2. EIE 선생님 대시보드 렌더 함수 위치
3. 원장/선생님 dashboard role 분기 구조
4. EIE localStorage 메모 사용 함수
5. EIE 주간일정 placeholder 사용 함수
6. EIE index.html script 순서
7. EIE CSS 파일 위치
8. EIE worker route 구조
9. EIE migration 위치
10. APMath memo.js에서 이식할 함수 목록
11. APMath schedule.js에서 이식할 함수 목록
12. APMath dashboard.js/dashboard-teacher.js에서 대시보드 출력 함수 목록
13. Backend API 이식 필요 목록
14. DB 테이블 추가 필요 여부
15. 회귀 위험

# 산출물
INVESTIGATION_EIE_MEMO_SCHEDULE_LOOP0.md

# 산출물 필수 포함
- 현재 EIE 원장 대시보드 구조
- 현재 EIE 선생님 대시보드 구조
- APMath 원본 함수 → EIE 이식 함수 매핑표
- 메모 개인 scope 처리 계획
- 주간일정 공용 scope 처리 계획
- 수정 예상 파일 목록
- 구현 루프 제안
- 회귀 위험
- 다음 라운드에서 수정할 정확한 범위

# 금지
- 코드 수정 금지
- 새 기능 설계 금지
- localStorage 메모 유지 전제 금지
- 주간일정 placeholder 유지 전제 금지
- 메모를 공용으로 처리 금지
- 주간일정을 개인으로 처리 금지
```
