# AP Math OS 확장 기능 세부 기획서 v2.0 보강안

> 목적: 기존 `AP Math OS 확장 기능 세부 기획서 v2.0`에 누락된 항목을 보강한다.  
> 기준: 홈페이지 이전은 마지막 단계로 두고, 그 전에 학원 운영에 필요한 공통 기능과 AP Math 특화 기능을 먼저 완성한다.  
> 방향: AP Math 단독 시스템이 아니라, 왕지교육 아래의 AP Math · 씨매쓰 초등 · EIE 영어학원까지 확장 가능한 운영 플랫폼으로 설계한다.

---

## 0. 보강 결론

현재 v2.0 문서는 방향이 좋지만, 아래 항목이 추가되어야 한다.

1. 왕지교육 전체 브랜드 구조 반영
2. AP Math / 씨매쓰 초등 / EIE 영어학원 외부 노출 비중 3:3:3 반영
3. 내부 운영 시스템은 공통 기능 + AP Math 심화 기능으로 분리
4. 기존 D1 스키마와 충돌하지 않는 migration 방식 명시
5. 수납·소통·보강·진도·상담·공지 외에 운영 증거가 남는 기능 추가
6. 개인정보·발송동의·권한·감사로그·백업 같은 운영 안정성 항목 추가
7. 홈페이지 이전 전 완료해야 할 선행 구현 기준 명확화

---

# 1. 브랜드 구조 보강

기존 문서의 1장은 AP Math 중심으로 되어 있다. 왕지교육 전체 계획에서는 아래처럼 수정해야 한다.

```text
왕지교육
├─ AP Math
│  └─ 중·고등 수학 전문
├─ 씨매쓰 초등
│  └─ 초등 수학·사고력 전문
└─ EIE 영어학원
   └─ 초·중·고 영어 전문
```

## 1-1. 외부 홈페이지 노출 원칙

왕지교육 메인에서는 세 브랜드를 같은 비중으로 보여준다.

```text
AP Math : 씨매쓰 초등 : EIE 영어학원 = 3 : 3 : 3
```

즉, 홈페이지 첫 화면에서 AP Math만 커 보이면 안 된다.

외부 학부모가 볼 때는 다음 인상을 줘야 한다.

```text
왕지교육은
중고등 수학 AP Math,
초등 수학·사고력 씨매쓰 초등,
초중고 영어 EIE 영어학원을 함께 운영하는 교육기관이다.
```

## 1-2. 내부 시스템 구현 원칙

외부 노출은 3:3:3이지만, 내부 시스템의 깊이는 다를 수 있다.

```text
공통 운영 기능:
세 브랜드가 함께 사용

AP Math 심화 기능:
현재 가장 많이 구현된 영역

씨매쓰 초등 / EIE 영어학원:
초기에는 소개와 기본 관리 중심
필요 시 별도 모듈로 확장
```

---

# 2. 서비스 정의 보강

기존 문서의 `AP Math OS` 표현은 유지하되, 상위 개념은 `왕지교육 통합 OS`로 확장해야 한다.

```text
왕지교육 통합 OS
├─ 공통 운영
│  ├─ 학생 관리
│  ├─ 반 관리
│  ├─ 출결
│  ├─ 과제
│  ├─ 상담
│  ├─ 공지
│  ├─ 학부모 연락
│  ├─ 수납
│  ├─ 진도
│  ├─ 보강
│  ├─ 업무일지
│  └─ 원장 대시보드
│
├─ AP Math 전용
│  ├─ 문제은행
│  ├─ 믹서 출제센터
│  ├─ QR / OMR
│  ├─ 오답 클리닉
│  ├─ AI 취약 단원 진단
│  └─ 수학 리포트
│
├─ 씨매쓰 초등 확장 예정
│  ├─ 초등 학습 기록
│  ├─ 사고력 활동 기록
│  ├─ 학습 습관 기록
│  └─ 성장 리포트
│
└─ EIE 영어학원 확장 예정
   ├─ 단어 테스트
   ├─ 리딩 / 리스닝 과제
   ├─ 문법 테스트
   └─ 영어 리포트
```

---

# 3. 기존 DB와 충돌하는 부분 수정 필요

기획서 v2.0의 신규 스키마 예시는 그대로 실행하면 안 된다. 현재 DB는 이미 `TEXT id` 중심 구조를 사용하고 있고, 일부 테이블은 이미 존재한다.

## 3-1. 주의해야 할 충돌

### consultations 테이블

기존 DB에 이미 `consultations` 테이블이 있다.  
따라서 상담 예약용으로 같은 이름의 테이블을 새로 만들면 충돌한다.

권장:

```sql
consultation_requests
consultation_slots
```

또는 기존 `consultations`는 상담 기록용으로 유지하고, 예약은 별도 테이블로 둔다.

### exam_schedules 테이블

기존 DB에는 이미 `exam_schedules`가 있다.  
기획서에는 `exams_schedule`이 새로 제안되어 있는데 이름이 다르다.

권장:

```text
기존 exam_schedules 유지
필요 컬럼만 migration으로 추가
```

### progress 테이블

현재 DB에는 이미 다음 구조가 존재한다.

```text
class_textbooks
class_daily_records
class_daily_progress
```

따라서 `progress` 테이블을 새로 만들기보다 기존 구조를 확장하는 편이 안전하다.

### students 테이블

기존 `students.id`는 `TEXT PRIMARY KEY`다.  
기획서의 신규 테이블 예시는 `student_id INTEGER REFERENCES students(id)` 형태가 많다.

이 부분은 반드시 아래처럼 맞춰야 한다.

```sql
student_id TEXT NOT NULL
teacher_id TEXT NOT NULL
class_id TEXT NOT NULL
```

## 3-2. DB 원칙

```text
기존 테이블 삭제 금지
기존 id 타입 변경 금지
ALTER TABLE 또는 신규 테이블 추가만 허용
중복 테이블 생성 금지
운영 중인 데이터 유지
migration 파일로 단계별 적용
```

---

# 4. MODULE 0 — 왕지교육 공통 기반 보강

현재 v2.0에는 AP Math 기능 중심 모듈이 많다.  
그 전에 공통 운영 기반 모듈을 추가해야 한다.

## 4-1. 브랜드 / 교육관 구분 필드

학생, 반, 수납, 공지, 리포트는 모두 소속 교육관을 가져야 한다.

```text
branch = apmath | cmath | eie
```

표시명:

```text
apmath = AP Math
cmath = 씨매쓰 초등
eie = EIE 영어학원
```

권장 추가 대상:

```sql
ALTER TABLE students ADD COLUMN branch TEXT DEFAULT 'apmath';
ALTER TABLE classes ADD COLUMN branch TEXT DEFAULT 'apmath';
```

단, 학생이 여러 브랜드를 동시에 수강할 수 있으므로 장기적으로는 별도 등록 테이블이 더 안전하다.

```sql
CREATE TABLE student_enrollments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  branch TEXT NOT NULL,
  class_id TEXT,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 4-2. 학생 상태 이력

현재 학생의 상태가 `재원`, `휴원`, `퇴원`으로만 남으면 과거 이력이 약하다.

필요:

```sql
CREATE TABLE student_status_history (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_by TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

용도:

```text
입학일 확인
휴원 기간 확인
퇴원 사유 확인
재등록 이력 확인
브랜드 이동 이력 확인
```

## 4-3. 반 이동 이력

왕지교육 전체에서는 반 이동이 중요하다.

예:

```text
씨매쓰 초등 → AP Math
AP Math 중등반 → 고등반
EIE 초등반 → 중등 내신반
```

필요:

```sql
CREATE TABLE class_transfer_history (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  from_class_id TEXT,
  to_class_id TEXT,
  reason TEXT,
  changed_by TEXT,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 4-4. 권한 체계 확장

현재 원장/선생님 중심 권한에 브랜드별 권한을 추가해야 한다.

```text
admin
teacher
assistant
reception
viewer
```

브랜드 권한:

```text
all
apmath
cmath
eie
```

필요 테이블:

```sql
CREATE TABLE staff_permissions (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  branch TEXT DEFAULT 'all',
  permission_key TEXT NOT NULL,
  allowed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

예:

```text
수학 선생님: AP Math 반만 접근
영어 선생님: EIE 반만 접근
초등 선생님: 씨매쓰 반만 접근
원장: 전체 접근
```

---

# 5. MODULE 1 보강 — 출결 관리

현재 기획서의 출결 알림톡은 좋다.  
다만 아래 항목을 추가해야 한다.

## 5-1. 출결 유형 표준화

```text
present      출석
late         지각
absent       결석
early_leave  조퇴
makeup       보강
excused      공결
holiday      휴원/휴강
```

## 5-2. 등원 / 하원 분리

기존 출결은 하루 상태 중심이다.  
알림톡까지 하려면 등원과 하원 이벤트를 분리하는 것이 좋다.

```sql
CREATE TABLE attendance_events (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  event_type TEXT NOT NULL,
  -- checkin / checkout / absent / late / makeup
  event_time TEXT NOT NULL,
  memo TEXT,
  notify_status TEXT DEFAULT 'pending',
  notified_at TEXT,
  notify_error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

기존 `attendance`는 일일 요약으로 유지하고, `attendance_events`는 알림 발송 근거로 둔다.

## 5-3. 알림 발송 제외 설정

모든 학부모가 모든 알림을 원하지 않을 수 있다.

필요:

```text
등원 알림 수신
하원 알림 수신
결석 알림 수신
수납 알림 수신
리포트 수신
공지 수신
```

이 설정은 학부모 연락처/동의 관리 모듈과 연결한다.

---

# 6. MODULE 2 보강 — 수납·청구 관리

기획서의 payments, payment_items 방향은 좋지만, 실제 학원 운영에는 아래 기능이 더 필요하다.

## 6-1. 수납 항목 템플릿

매달 같은 항목을 직접 입력하면 운영이 힘들어진다.

필요:

```sql
CREATE TABLE billing_templates (
  id TEXT PRIMARY KEY,
  branch TEXT DEFAULT 'apmath',
  class_id TEXT,
  name TEXT NOT NULL,
  default_amount INTEGER NOT NULL,
  item_type TEXT,
  -- tuition / textbook / special / makeup / discount
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

예:

```text
AP Math 고등 내신반 월수강료
AP Math 중등반 월수강료
씨매쓰 초등 월수강료
EIE 영어학원 월수강료
교재비
특강비
형제 할인
복수 수강 할인
```

## 6-2. 할인 / 감면 관리

필요한 경우:

```text
형제 할인
복수 수강 할인
장기 재원 할인
원장 재량 할인
교재비 면제
특강비 면제
```

권장 테이블:

```sql
CREATE TABLE billing_adjustments (
  id TEXT PRIMARY KEY,
  payment_id TEXT NOT NULL,
  adjustment_type TEXT NOT NULL,
  -- discount / waiver / extra
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 6-3. 청구 회차 관리

월별 청구를 한 번 실행했는지 기록해야 중복 청구를 막을 수 있다.

```sql
CREATE TABLE billing_runs (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  branch TEXT DEFAULT 'all',
  status TEXT DEFAULT 'draft',
  -- draft / issued / cancelled
  total_amount INTEGER DEFAULT 0,
  issued_count INTEGER DEFAULT 0,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  issued_at TEXT
);
```

## 6-4. 납부 방법 확장

```text
cash        현금
transfer    계좌이체
card        카드
kakaopay    카카오페이
zeropay     제로페이
other       기타
```

## 6-5. 수납 화면 우선순위

1차 구현은 카카오페이보다 아래가 먼저다.

```text
미납 현황
월별 청구 생성
학생별 청구/납부 내역
납부 처리
영수증/안내 발송 기록
엑셀 다운로드
```

---

# 7. MODULE 3 보강 — 진도·보강 관리

## 7-1. 기존 진도 구조 활용

새 `progress` 테이블보다 기존 구조를 활용한다.

```text
class_textbooks
class_daily_records
class_daily_progress
```

현재 구조를 기준으로 추가할 수 있는 항목:

```text
수업 목표
수업 내용
과제 내용
다음 수업 계획
학부모 공유 여부
공유 발송 시각
```

필요 migration 예:

```sql
ALTER TABLE class_daily_records ADD COLUMN parent_share_status TEXT DEFAULT 'none';
ALTER TABLE class_daily_records ADD COLUMN parent_shared_at TEXT;
ALTER TABLE class_daily_records ADD COLUMN next_plan TEXT;
```

## 7-2. 보강 신청 흐름 추가

보강은 선생님이 등록하는 것뿐 아니라 요청 흐름이 필요하다.

```text
학부모 요청
→ 학원 확인
→ 보강 일정 확정
→ 알림 발송
→ 보강 완료 처리
```

권장 테이블:

```sql
CREATE TABLE makeup_requests (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  requested_by TEXT DEFAULT 'parent',
  original_date TEXT,
  preferred_dates TEXT,
  reason TEXT,
  status TEXT DEFAULT 'requested',
  -- requested / confirmed / rejected / completed / cancelled
  confirmed_date TEXT,
  confirmed_time TEXT,
  handled_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

# 8. MODULE 4 보강 — 소통 기능

## 8-1. 학부모 연락처 / 수신 동의 관리

알림톡·문자·리포트 발송 전에 필수다.

```sql
CREATE TABLE parent_contacts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  name TEXT,
  relation TEXT,
  phone TEXT NOT NULL,
  is_primary INTEGER DEFAULT 1,
  receive_attendance INTEGER DEFAULT 1,
  receive_payment INTEGER DEFAULT 1,
  receive_notice INTEGER DEFAULT 1,
  receive_report INTEGER DEFAULT 1,
  receive_marketing INTEGER DEFAULT 0,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 8-2. 모든 발송 기록 통합

알림톡, 문자, 리포트, 공지는 모두 발송 기록이 남아야 한다.

```sql
CREATE TABLE message_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  parent_contact_id TEXT,
  branch TEXT,
  message_type TEXT NOT NULL,
  -- attendance / payment / notice / report / makeup / exam
  channel TEXT NOT NULL,
  -- alimtalk / sms / app / link
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending',
  -- pending / sent / failed / skipped
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

이 테이블이 있으면 다음이 가능하다.

```text
누구에게 보냈는지
무엇을 보냈는지
발송 성공/실패 여부
학부모에게 안내했는지
같은 내용을 중복 발송했는지
```

## 8-3. 공지 읽음 확인 보강

`notice_reads`는 학생 기준보다 학부모 연락처 기준이 더 좋을 수 있다.

```sql
CREATE TABLE notice_read_logs (
  id TEXT PRIMARY KEY,
  notice_id TEXT NOT NULL,
  student_id TEXT,
  parent_contact_id TEXT,
  read_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

# 9. MODULE 5 보강 — 업무 관리

## 9-1. 업무일지와 진도 기록 중복 주의

현재 DB에 `daily_journals`, `class_daily_records`, `class_daily_progress`가 이미 있다.

따라서 `work_logs`를 새로 만들 때는 역할을 분리해야 한다.

```text
class_daily_records:
수업별 진도 기록

daily_journals:
선생님/운영 업무일지

work_logs:
출퇴근·업무 제출·원장 확인까지 포함하는 확장 업무 기록
```

중복이 부담되면 `daily_journals`를 확장하는 방식이 더 안전하다.

## 9-2. 업무 체크리스트

원장 입장에서는 자유 서술보다 체크리스트가 유용하다.

```sql
CREATE TABLE staff_tasks (
  id TEXT PRIMARY KEY,
  teacher_id TEXT,
  title TEXT NOT NULL,
  task_date TEXT,
  status TEXT DEFAULT 'todo',
  -- todo / doing / done / cancelled
  priority TEXT DEFAULT 'normal',
  created_by TEXT,
  completed_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

예:

```text
결석자 보강 잡기
미납자 연락
학부모 상담 전화
시험지 출력
클리닉 자료 준비
```

---

# 10. MODULE 6 보강 — AP Math 수학 특화 기능

기존 MODULE 6은 좋다. 아래를 추가하면 더 완성도가 높다.

## 10-1. 문제은행 자료 등급 구분

```text
원본기출       teacher only
기출유사       public or student
기출심화       public or student
후속훈련       student
자체제작       teacher/student
PDF 해설       public/teacher 구분
```

## 10-2. 원본기출 보호는 단순 코드보다 Worker/R2 장기 전환

기획서의 `ARCHIVE_TEACHER_CODE` 방식은 1차 임시 보호로는 가능하다.

장기적으로는 다음 구조가 안전하다.

```text
원본기출 메타데이터:
D1

원본기출 파일:
R2 private bucket

접근:
Worker에서 선생님 인증 확인 후 서명 URL 또는 프록시 응답
```

## 10-3. 시험지 배정 → OMR → 클리닉 흐름 명확화

AP Math의 핵심 경쟁력은 다음 흐름이다.

```text
문제은행 / 믹서
→ 반에 시험지 배정
→ 학생 OMR 제출
→ 오답 자동 저장
→ 오답 클리닉 출력
→ 학부모 리포트
→ 후속훈련 추천
```

이 흐름을 홈페이지 이전 전까지 안정화해야 한다.

## 10-4. 학생이 시험지를 직접 여는 기능 금지

학생 포털에서 시험지를 직접 열게 만들면 안 된다.

학생은 다음 방식으로만 접근한다.

```text
선생님 제공 시험지
선생님 제공 QR
OMR 입력
오답 제출
```

학생 포털은 배정 확인과 OMR 입력 연결까지만 허용한다.

## 10-5. OMR 제출 후 수정 금지

한 번 제출한 OMR은 학생이 다시 수정할 수 없어야 한다.

```text
미제출: OMR 입력 가능
제출 완료: 제출 완료 상태만 표시
수정하기 버튼 없음
재입력 불가
```

---

# 11. MODULE 7 수정 — 홈페이지·대문 구축

현재 문서의 홈페이지 파트는 AP Math 중심이다.  
왕지교육 전체 기준으로 수정해야 한다.

## 11-1. 왕지교육 메인

```text
왕지교육

초등부터 고등까지,
수학과 영어의 학습 과정을 체계적으로 관리합니다.

[AP Math]        중·고등 수학
[씨매쓰 초등]    초등 수학·사고력
[EIE 영어학원]   초·중·고 영어
```

세 브랜드 카드의 크기, 소개 분량, 버튼 수, 이미지 비중은 동일하게 한다.

## 11-2. 홈페이지 이전은 마지막 단계

홈페이지 이전은 아래가 끝난 뒤 진행한다.

```text
수납
학부모 연락/공지/발송 기록
보강
진도
상담
원장 통합 현황
브랜드 구분
AP Math 시험지/OMR/클리닉 안정화
```

## 11-3. 이전 전 홈페이지는 임시 대문으로도 충분

정식 이전 전에는 내부 시스템 구현이 우선이다.

```text
현재 GitHub Pages 유지
내부 기능 보강
운영 테스트
데이터 안정화
그 다음 Cloudflare Pages + 도메인 이전
```

---

# 12. 보안·운영 안정성 모듈 추가

기존 v2.0에는 보안/감사/백업이 약하다. 운영 플랫폼에서는 반드시 필요하다.

## 12-1. 감사 로그

누가 학생 정보, 수납, 상담, 리포트를 수정했는지 남겨야 한다.

```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  before_json TEXT,
  after_json TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

대상:

```text
학생 정보 수정
반 이동
상태 변경
수납 처리
상담 기록 수정
리포트 발송
공지 발송
원본기출 접근
```

## 12-2. 개인정보 접근 기록

학부모 연락처, 상담 내용, 수납 정보는 민감 정보다.

```sql
CREATE TABLE privacy_access_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  student_id TEXT,
  access_type TEXT,
  -- view_parent_phone / view_payment / view_consultation / export
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 12-3. 백업 / 내보내기

홈페이지 이전 전 반드시 필요하다.

```text
학생 명단 CSV
반 명단 CSV
출결 CSV
수납 CSV
상담 CSV
시험 기록 CSV
오답 기록 CSV
전체 D1 백업
```

## 12-4. 삭제 대신 비활성화

학생, 반, 수납, 상담 기록은 삭제보다 숨김/비활성화가 안전하다.

```text
is_deleted
deleted_at
deleted_by
```

---

# 13. 원장 통합 대시보드 보강

원장 대시보드는 AP Math만 보면 안 된다.  
왕지교육 전체를 보되, 브랜드별로 나뉘어야 한다.

## 13-1. 핵심 카드

```text
전체 재원생
AP Math 학생 수
씨매쓰 초등 학생 수
EIE 영어학원 학생 수

오늘 출석
오늘 결석
오늘 보강
과제 미제출
미납 금액
상담 필요
공지 미확인
리포트 발송 대기
```

## 13-2. 브랜드별 요약

```text
AP Math
- 시험 응시
- 오답 누적
- 클리닉 필요
- 학부모 리포트

씨매쓰 초등
- 출석
- 과제
- 수업 태도
- 상담 메모

EIE 영어학원
- 출석
- 과제
- 단어/문법 테스트
- 상담 메모
```

## 13-3. 오늘 할 일

```text
미납자 연락
결석자 보강 잡기
상담 예정 확인
공지 미확인자 재발송
리포트 발송
시험 D-day 대상 확인
```

---

# 14. 학생 / 학부모 포털 보강

## 14-1. 학생 통합 포털

학생은 브랜드별로 다른 주소를 외우면 안 된다.

```text
왕지교육 학생 입장
→ 이름 + PIN
→ 내 수업 자동 표시
```

예:

```text
AP Math 수강생:
OMR, 오답, 플래너, 과제

씨매쓰 초등 수강생:
오늘 과제, 선생님 코멘트

EIE 영어학원 수강생:
단어 과제, 영어 숙제
```

## 14-2. 학부모 포털은 장기

홈페이지 이전 전에는 완전한 학부모 포털보다 발송 링크 기반이 우선이다.

1차:

```text
학부모 리포트 링크
공지 링크
수납 안내 링크
상담 예약 링크
```

장기:

```text
학부모 로그인
자녀별 리포트
수납 확인
공지 확인
상담 신청
```

---

# 15. 전체 개발 로드맵 수정안

기존 Phase 5의 홈페이지·대문은 마지막으로 유지하되, 브랜드/공통 기반을 앞에 둔다.

## Phase 0 — 기준 정리

```text
왕지교육 브랜드 구조 확정
AP Math / 씨매쓰 초등 / EIE 영어학원 명칭 확정
기존 DB와 충돌되는 신규 스키마 정리
기존 테이블 유지 원칙 확정
```

## Phase 1 — 공통 운영 기반

```text
branch / enrollment 구조
학생 상태 이력
반 이동 이력
권한 구조
학부모 연락처/수신 동의
발송 기록 통합
```

## Phase 2 — 수납 / 출결 / 보강

```text
수납 템플릿
월별 청구 생성
미납 현황
납부 처리
출결 유형
등하원 이벤트
보강 신청/확정/완료
```

## Phase 3 — 소통 / 공지 / 상담

```text
공지 발송
공지 읽음 확인
상담 예약
상담 기록
학부모 리포트 링크
발송 이력
```

## Phase 4 — 진도 / 업무 / 원장 대시보드

```text
진도 공유
업무일지
직원 출근부
업무 체크리스트
원장 통합 현황
브랜드별 요약
```

## Phase 5 — AP Math 특화 안정화

```text
문제은행 원본기출 보호
시험지 배정
OMR 제출 후 수정 금지
오답 클리닉 연결
AI 취약 단원 진단
성취도 시각화
```

## Phase 6 — 내부 운영 테스트

```text
실제 학생/반 기준 테스트
수납 테스트
알림 발송 테스트
보강 테스트
리포트 테스트
데이터 백업
권한 검수
```

## Phase 7 — 홈페이지 이전

```text
Cloudflare Pages 이전
도메인 연결
왕지교육 메인
AP Math / 씨매쓰 초등 / EIE 영어학원 3:3:3 노출
기존 OS 연결
R2 자산 이전
최종 검수
```

---

# 16. 최종 추가 결론

기존 기획서의 방향은 좋다.  
다만 그대로 진행하면 AP Math 단독 확장 계획으로 보일 수 있다.

최종 방향은 아래처럼 정리해야 한다.

```text
왕지교육 외부 홈페이지:
AP Math / 씨매쓰 초등 / EIE 영어학원 3:3:3

내부 운영 시스템:
공통 운영 기능 + AP Math 심화 기능

홈페이지 이전:
마지막 단계

이전 전 선행 구현:
수납, 출결, 보강, 학부모 연락, 공지, 상담, 진도, 업무, 권한, 발송 기록, 백업, 원장 대시보드
```

가장 중요한 문장:

```text
홈페이지를 먼저 옮기는 것이 아니라,
학원 운영에 필요한 공통 기능을 먼저 채운 뒤,
왕지교육 홈페이지를 정식으로 이전한다.
```
