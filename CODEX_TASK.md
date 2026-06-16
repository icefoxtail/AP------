형님, 세부 계획서는 이렇게 잡는 게 좋습니다.
핵심은 **열품타식 감성은 가져오되, 우리 학원 플래너답게 “할 일 카드 중심”으로 통제하는 구조**입니다.

# AP Math Planner v2 업그레이드 계획서

## 0. 현재 상태 기준

현재 우리 플래너에는 이미 학생별 할 일, 완료 체크, 과목, 반복, 타이머 버튼이 들어가 있습니다. `renderPlanPanel()`과 `renderPlanItem()`에서 할 일 목록, 과목, 완료 체크, 타이머, 삭제 버튼을 렌더링합니다. 

선생님 쪽에도 반별 플래너 확인 화면이 있고, 요일별·주간별·월간별 모드가 이미 있습니다. 

다만 DB는 현재 `student_plans`, `planner_feedback` 중심입니다. `student_plans`에는 날짜, 제목, 과목, 완료 여부, 반복 규칙만 있고, `planner_feedback`에는 피드백 날짜, 코멘트, 배지, 완료율만 있습니다. 

즉 현재 구조는:

```text
할 일 플래너 O
완료율 O
피드백 O
간단 타이머 O
공부시간 저장 X
사진 인증 X
질문 카드 X
반 채팅방 X
깨우기 X
```

---

# 1. 최종 목표 화면

## 학생 플래너 카드

```text
RPM 중2-2 p.42~45

[공부중 38m] [사진 2] [질문 1] [답변 3]
[공부] [사진] [질문] [완료]
```

여기서 이모지는 직접 쓰지 않습니다.
전부 **고급 SVG 라인 아이콘 + pill badge**로 갑니다.

## 선생님 반 현황

```text
중2A 실시간 플래너

남지혁   공부중 38m   사진2   질문1   깨우기
박정원   휴식 12m     사진0   답변2   깨우기
김다희   완료 64m     사진1   질문0   확인
```

## 반 라운지

```text
중2A 라운지

상단:
공부중 6명 / 휴식 2명 / 미시작 4명

채팅:
남지혁: 12번 조건 이해 안 됨
사진 1장

박정원: 분모 확인해봐
사진 1장

선생님: 7시 30분까지 12번까지 풀기
```

---

# 2. 디자인 원칙

## 2-1. 이모지 직접 사용 금지

```text
❌ 🔥 📷 ❓ ✅ 그대로 사용 금지
✅ SVG 라인 아이콘 + 상태 배지 사용
```

## 2-2. 상태 배지 규격

```text
높이: 24~28px
아이콘: 16px SVG
폰트: 11~12px
border-radius: 999px
border: 1px solid
배경: 아주 연한 색
상태색은 점/배지에만 사용
```

## 2-3. 상태 종류

```text
focus      공부중
rest       휴식
done       완료
photo      사진
question   질문
reply      답변
wake       깨우기
seen       선생님 확인
locked     잠금
notice     공지
```

## 2-4. 색상 체계

```text
공부중: 초록 계열
휴식: amber 계열
질문: indigo / violet 계열
사진: slate / blue 계열
완료: blue 계열
깨우기: orange 계열
잠금/삭제: red 계열
기본: slate 계열
```

---

# 3. 개발 단계

## 1단계: 고급 아이콘 상태 UI

먼저 기능 추가 전에 **UI 컴포넌트부터 고정**합니다.

### 추가 컴포넌트

```text
PlannerStatusBadge
PlannerIconButton
PlannerMetricPill
PlannerLiveDot
```

### 예시

```html
<span class="planner-badge planner-badge--focus">
  <svg class="planner-icon">...</svg>
  <span>공부중 38m</span>
</span>
```

### 적용 위치

```text
학생 플래너 카드
선생님 반별 플래너 확인 화면
학생 상세 플래너 요약
반 라운지 상단 상태판
```

이 단계에서는 DB 변경 없이 목업 데이터 또는 기존 `is_done`, 사진 수 0, 질문 수 0으로 먼저 화면만 잡습니다.

---

## 2단계: 저장형 공부 타이머

현재 타이머는 카운트다운 후 토스트와 진동만 발생합니다. 타이머 종료 시 `plannerTimerSeconds`를 초기화하고 “집중 시간이 끝났습니다”만 띄웁니다. 

이걸 **저장형 타이머**로 바꿉니다.

### 추가 DB

```sql
CREATE TABLE IF NOT EXISTS planner_study_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  plan_id TEXT,
  class_id TEXT,
  subject TEXT,
  status TEXT DEFAULT 'active',
  started_at TEXT NOT NULL,
  paused_at TEXT,
  ended_at TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_planner_study_sessions_student_date
ON planner_study_sessions(student_id, started_at);

CREATE INDEX IF NOT EXISTS idx_planner_study_sessions_plan
ON planner_study_sessions(plan_id);
```

### 추가 API

```text
POST   /api/planner/sessions/start
PATCH  /api/planner/sessions/:id/pause
PATCH  /api/planner/sessions/:id/resume
PATCH  /api/planner/sessions/:id/finish
GET    /api/planner/sessions/current?student_id=
GET    /api/planner/stats?student_id=&from=&to=
GET    /api/planner/live-overview?class_id=
```

### 학생 카드 동작

```text
[공부] 클릭
→ session start
→ 카드 상태: 공부중
→ 타이머 running
→ 선생님 화면에도 공부중 반영

[휴식]
→ pause
→ 상태: 휴식

[다시 시작]
→ resume

[완료]
→ finish
→ duration 저장
→ 할 일 완료 여부와 별도 저장
```

---

## 3단계: 사진 인증

현재 `core.js`에는 `homework-photo` 관련 API 함수들이 이미 있습니다. 과제 생성, 현황 조회, 학생 링크 조회, 마감, 삭제 함수가 존재합니다. 

그래서 새로 완전 별도 업로드 시스템을 만들기보다, 기존 `homework-photo` 계열과 연결 가능한 구조로 확장합니다.

### 추가 DB

```sql
CREATE TABLE IF NOT EXISTS planner_attachments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  plan_id TEXT,
  question_id TEXT,
  class_id TEXT,
  type TEXT NOT NULL, -- homework, question, solution, chat
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_planner_attachments_plan
ON planner_attachments(plan_id);

CREATE INDEX IF NOT EXISTS idx_planner_attachments_question
ON planner_attachments(question_id);
```

### 학생 기능

```text
할 일 카드 → [사진]
→ 카메라/앨범 선택
→ 이미지 압축
→ 업로드
→ 카드에 사진 수 표시
```

### 선생님 기능

```text
반 플래너 확인
→ 학생별 사진 수 표시
→ 클릭 시 사진 모아보기
```

---

## 4단계: 질문 카드

반 채팅방보다 먼저 **질문 카드**를 붙이는 게 안전합니다.
이유는 질문이 채팅에 묻히면 관리가 어려워지기 때문입니다.

### 추가 DB

```sql
CREATE TABLE IF NOT EXISTS planner_questions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  plan_id TEXT,
  question_text TEXT,
  visibility TEXT DEFAULT 'class', -- class, teacher_only
  status TEXT DEFAULT 'open', -- open, resolved, locked
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS planner_question_replies (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  student_id TEXT,
  teacher_id TEXT,
  body TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_planner_questions_class
ON planner_questions(class_id, created_at);

CREATE INDEX IF NOT EXISTS idx_planner_question_replies_question
ON planner_question_replies(question_id);
```

### 학생 화면

```text
[질문] 클릭

문제 사진 첨부
질문 내용 입력

공개 범위:
- 선생님에게만
- 우리 반에도 공개

[질문 올리기]
```

### 카드 상태

```text
질문 1
답변 3
해결됨
선생님 확인
잠금
```

---

## 5단계: 반 내부 라운지

형님이 말한 카카오 오픈채팅 느낌은 가능하지만, 이름과 구조는 **반 라운지**가 좋습니다.

### 원칙

```text
1:1 DM 금지
같은 반만 입장
선생님 항상 입장
원장 전체 열람 가능
공지 고정 가능
삭제/잠금 가능
사진 가능
질문 카드 전환 가능
```

### 추가 DB

```sql
CREATE TABLE IF NOT EXISTS planner_class_messages (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  sender_type TEXT NOT NULL, -- student, teacher, admin
  sender_id TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  linked_plan_id TEXT,
  linked_question_id TEXT,
  message_type TEXT DEFAULT 'chat', -- chat, question, notice, wake, system
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_planner_class_messages_class
ON planner_class_messages(class_id, created_at);
```

### 라운지 기능

```text
일반 메시지
사진 메시지
질문으로 올리기
선생님 공지
깨우기 기록
시스템 메시지
```

### 입력창

```text
[사진] [질문으로] [메시지 입력] [보내기]
```

---

## 6단계: 깨우기 기능

깨우기는 넣을 만합니다.
다만 무제한이면 장난이 될 수 있으니 제한이 필요합니다.

### 추가 DB

```sql
CREATE TABLE IF NOT EXISTS planner_wake_events (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  from_type TEXT NOT NULL, -- student, teacher, admin
  from_id TEXT NOT NULL,
  to_student_id TEXT NOT NULL,
  message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_planner_wake_events_target
ON planner_wake_events(to_student_id, created_at);
```

### 제한

```text
학생 → 학생:
같은 반만 가능
10분에 1회
하루 최대 3회

선생님 → 학생:
제한 완화
반 전체 깨우기 가능

야간:
알림 제한
```

### 화면

```text
박정원 휴식 12m

[깨우기]
```

받는 학생:

```text
남지혁님이 집중 알림을 보냈어요.
다시 시작해볼까요?

[공부 시작] [나중에]
```

---

# 4. 선생님 관리 화면

## 반 플래너 메인

```text
중2A 플래너

상단 상태:
공부중 6
휴식 2
미시작 4
완료 8
질문 3
사진 12

학생 리스트:
남지혁  공부중 38m  사진2  질문1  깨우기
박정원  휴식 12m    사진0  답변2  깨우기
김다희  완료 64m    사진1  질문0  확인
```

## 질문 관리

```text
열린 질문
해결된 질문
잠긴 질문

질문 카드:
학생명
사진
질문 내용
답변 수
[답변] [해결 처리] [잠금] [삭제]
```

## 라운지 관리

```text
공지 고정
메시지 삭제
방 잠금
사진 보기
질문 카드로 전환
```

---

# 5. 학생 UX 흐름

## 학생이 공부할 때

```text
1. 플래너 접속
2. 오늘 할 일 확인
3. 공부 버튼 클릭
4. 상태가 공부중으로 변경
5. 필요하면 사진 인증
6. 모르면 질문
7. 친구 답변 확인
8. 완료 버튼
```

## 학생이 질문할 때

```text
1. 할 일 카드에서 질문 클릭
2. 문제 사진 촬영
3. 질문 입력
4. 우리 반 공개 or 선생님에게만 선택
5. 답변 도착 시 배지 표시
6. 해결됨 처리
```

## 학생이 라운지를 쓸 때

```text
1. 반 라운지 입장
2. 친구 공부 상태 확인
3. 질문/답변/사진 공유
4. 휴식 중 친구에게 깨우기
5. 선생님 공지 확인
```

---

# 6. 구현 우선순위

## 1차 MVP

```text
고급 SVG 상태 배지
공부/사진/질문/완료 4버튼 UI
저장형 공부 타이머
선생님 실시간 상태판
```

## 2차 MVP

```text
사진 인증
사진 모아보기
질문 카드
질문 답변
해결됨 처리
```

## 3차 MVP

```text
반 라운지
깨우기
공지 고정
메시지 삭제/잠금
```

## 4차 확장

```text
월간 공부 히트맵
과목별 누적 시간
반별 집중 랭킹
알림 설정
학생별 프로필 배지
```

---

# 7. Codex 작업 지시 핵심

```text
목표:
AP Math Planner를 열품타식 학습 허브로 확장한다.
단, 이모지 직접 사용 금지. SVG 라인 아이콘 + 상태 배지 컴포넌트로 구현한다.

현재 구조 유지:
- apmath/planner/index.html 기존 플래너 유지
- apmath/js/classroom-planner.js 기존 반별 플래너 확인 유지
- worker routes/planner.js 기존 student_plans / planner_feedback API 유지
- 기존 완료율/피드백 기능 삭제 금지

1단계 작업:
- PlannerStatusBadge 컴포넌트 CSS/HTML 유틸 추가
- 상태 종류: focus/rest/done/photo/question/reply/wake/seen/locked
- 학생 할 일 카드에 상태 배지 영역 추가
- 선생님 반 플래너 리스트에도 같은 배지 스타일 재사용
- 이모지 문자 직접 삽입 금지
- 모든 아이콘은 inline SVG 또는 symbol sprite로 통일

2단계 작업:
- planner_study_sessions 테이블 설계 추가
- 공부 시작/휴식/재시작/완료 API 추가
- 기존 카운트다운 타이머를 저장형 세션 타이머로 확장
- 타이머 종료/완료 시 duration_seconds 저장
- 선생님 반 화면에서 공부중/휴식/완료 상태 표시

3단계 작업:
- planner_attachments 테이블 설계 추가
- 할 일 카드별 사진 업로드 UI 추가
- 이미지 업로드는 기존 homework-photo 계열 구조 재사용 가능 여부 먼저 확인
- 사진 수 배지 표시

4단계 작업:
- planner_questions / planner_question_replies 추가
- 할 일 카드별 질문 생성
- 사진 첨부 질문 가능
- 같은 반 공개 / 선생님에게만 공개 옵션
- 선생님 답변/잠금/삭제 권한

5단계 작업:
- planner_class_messages 추가
- 반 라운지 구현
- 같은 반 학생만 접근
- 선생님/원장 관리 권한
- 질문 카드 연동
- 1:1 DM 금지

6단계 작업:
- planner_wake_events 추가
- 깨우기 기능 구현
- 학생 간 깨우기 제한: 같은 반, 10분 1회, 하루 3회
- 선생님은 반 전체 깨우기 가능
- 야간 알림 제한
```

---

# 8. 최종 판단

형님, 이건 충분히 가능합니다.
다만 한 번에 채팅방까지 바로 만들면 위험하니까 순서는 이렇게 가야 합니다.

```text
1. 고급 아이콘 상태 UI
2. 저장형 공부 타이머
3. 사진 인증
4. 질문 카드
5. 반 라운지
6. 깨우기
```

가장 먼저 만들 화면은 이것입니다.

```text
할 일 카드

[공부중 38m] [사진 2] [질문 1] [답변 3]

[공부] [사진] [질문] [완료]
```

이 카드 하나만 제대로 잡으면, 이후 선생님 화면·라운지·깨우기까지 전부 자연스럽게 확장됩니다.
