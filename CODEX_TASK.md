형님, 실제 코드 기준으로 보면 이건 **“오답 클리닉 저장형 packet 시스템”**을 기존 APMS 흐름에 붙이는 작업이 맞습니다.
특히 핵심은 **오답 출처 반(source)** 과 **받는 학생/반(recipient)** 을 완전히 분리하는 겁니다.

현재 코드상 중요한 지점은 이렇습니다.

`clinic-print.js`는 지금 오답 payload를 만든 뒤 `sessionStorage/localStorage`에 넣고 `wrong_print_engine.html`을 새 창으로 엽니다. 즉 서버 저장 없이 브라우저 임시 payload로만 출력됩니다.
학생 상세는 `student.js` 안에서 모달 셸을 만들고, 탭은 현재 `기본 / 상담 / 성적` 3개뿐입니다.
학생 포털은 이미 학생 PIN/token 기반으로 로그인하고, `student-portal/home`, `student-portal/exams` 같은 API로 과제/시험 자료를 받아오는 구조입니다.
또 학생 포털에는 이미 시험지/정답/해설 보기 버튼을 만들어 `archive/engine.html` 또는 `mixed_engine.html`을 여는 흐름이 있습니다.

그래서 오답 클리닉도 이 흐름에 맞춰야 합니다.

---

# 1. 핵심 설계 원칙

## 절대 하면 안 되는 구조

```text
wrong_clinic.class_id = 중3B
→ 중3B 학생만 조회 가능
```

이렇게 하면 형님이 말한 상황에서 바로 꼬입니다.

예:

```text
출처: 중3B 공통오답
수신자: 중3A 학생 김민준
```

김민준은 중3A 소속이지만, 중3B 오답을 받았습니다.
따라서 학생 페이지 조회 기준은 `source_class_id`가 아니라 **recipient_student_id** 여야 합니다.

---

# 2. DB 구조

## 2-1. wrong_clinic_sets

오답 콘텐츠의 “출처”입니다.

```sql
CREATE TABLE IF NOT EXISTS wrong_clinic_sets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  mode TEXT NOT NULL,                 -- student, class, grade, type
  source_scope_type TEXT NOT NULL,    -- class, grade, custom
  source_class_id TEXT,
  source_class_name TEXT,
  source_grade TEXT,
  source_exam_title TEXT,
  source_exam_keys_json TEXT,
  print_title TEXT,
  created_by TEXT,
  created_by_name TEXT,
  created_at TEXT DEFAULT (datetime('now', '+9 hours')),
  memo TEXT,
  public_set_key TEXT UNIQUE,
  status TEXT DEFAULT 'active'
);
```

예:

```text
title: 중3B 공통오답
source_class_id: m3b
source_class_name: 중3B
source_grade: 중3
mode: class
```

이 테이블은 “이 오답이 어디서 만들어졌는가”만 나타냅니다.

---

## 2-2. wrong_clinic_set_items

오답 세트의 공통 문항 목록입니다.

```sql
CREATE TABLE IF NOT EXISTS wrong_clinic_set_items (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL,
  order_no INTEGER NOT NULL,
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  source_question_id TEXT,
  original_id TEXT,
  exam_title TEXT,
  exam_date TEXT,
  correct_rate REAL,
  wrong_count INTEGER,
  total_count INTEGER,
  standard_unit_key TEXT,
  standard_unit TEXT,
  created_at TEXT DEFAULT (datetime('now', '+9 hours')),
  FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id)
);
```

반별/학년별/유형별 공통오답은 여기에 들어갑니다.

---

## 2-3. wrong_clinic_distributions

오답 세트를 누구에게 배포했는지입니다.

```sql
CREATE TABLE IF NOT EXISTS wrong_clinic_distributions (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL,
  target_type TEXT NOT NULL,          -- class, student, custom_group
  target_class_id TEXT,
  target_class_name TEXT,
  target_student_id TEXT,
  target_student_name TEXT,
  target_label TEXT,
  distributed_by TEXT,
  distributed_by_name TEXT,
  distributed_at TEXT DEFAULT (datetime('now', '+9 hours')),
  due_date TEXT,
  memo TEXT,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id)
);
```

예:

```text
set_id: 중3B 공통오답
target_type: class
target_class_id: 중3A
target_label: 중3A 전체
```

또는:

```text
set_id: 중3B 공통오답
target_type: student
target_student_id: 김민준
target_label: 중3A 김민준
```

---

## 2-4. wrong_clinic_packets

학생별 실제 접근 단위입니다.

```sql
CREATE TABLE IF NOT EXISTS wrong_clinic_packets (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL,
  distribution_id TEXT,
  recipient_student_id TEXT NOT NULL,
  recipient_student_name TEXT,
  recipient_class_id TEXT,
  recipient_class_name TEXT,
  source_class_id TEXT,
  source_class_name TEXT,
  source_grade TEXT,
  packet_key TEXT UNIQUE NOT NULL,
  item_count INTEGER DEFAULT 0,
  viewed_at TEXT,
  last_opened_at TEXT,
  created_at TEXT DEFAULT (datetime('now', '+9 hours')),
  status TEXT DEFAULT 'active',
  FOREIGN KEY (set_id) REFERENCES wrong_clinic_sets(id),
  FOREIGN KEY (distribution_id) REFERENCES wrong_clinic_distributions(id)
);
```

학생 페이지는 이 테이블을 기준으로 조회합니다.

```sql
WHERE recipient_student_id = ?
```

---

## 2-5. wrong_clinic_packet_items

실제로 학생이 받는 문항 목록입니다.

이게 중요합니다.
`set_items`만 있으면 학생별 오답처럼 학생마다 문항이 다른 경우를 처리하기 어렵습니다.

```sql
CREATE TABLE IF NOT EXISTS wrong_clinic_packet_items (
  id TEXT PRIMARY KEY,
  packet_id TEXT NOT NULL,
  set_item_id TEXT,
  order_no INTEGER NOT NULL,
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  source_question_id TEXT,
  original_id TEXT,
  exam_title TEXT,
  exam_date TEXT,
  correct_rate REAL,
  wrong_count INTEGER,
  total_count INTEGER,
  wrong_note TEXT,
  created_at TEXT DEFAULT (datetime('now', '+9 hours')),
  FOREIGN KEY (packet_id) REFERENCES wrong_clinic_packets(id),
  FOREIGN KEY (set_item_id) REFERENCES wrong_clinic_set_items(id)
);
```

이렇게 해야 합니다.

```text
반별/학년별 공통오답:
set_items = 공통 문항
packet_items = set_items를 각 학생 packet에 복사 또는 참조

학생별 오답:
set_items = 선택적으로 비워도 됨
packet_items = 학생별 실제 오답 문항
```

---

# 3. API 설계

현재 Worker는 route 파일로 위임하는 구조가 맞고, 새 API는 `index.js`에 직접 본문을 넣지 말고 `routes/*.js`로 빼야 한다고 문서화되어 있습니다.

따라서 새 파일:

```text
apmath/worker-backup/worker/routes/wrong-clinics.js
```

그리고 `index.js`에는 import와 위임만 추가합니다.

---

## 3-1. 선생님용 생성 API

```text
POST /api/wrong-clinics
```

요청:

```json
{
  "title": "중3B 공통오답",
  "mode": "class",
  "source": {
    "scope_type": "class",
    "class_id": "m3b",
    "class_name": "중3B",
    "grade": "중3"
  },
  "targets": [
    {
      "type": "class",
      "class_id": "m3a",
      "class_name": "중3A"
    },
    {
      "type": "student",
      "student_id": "stu_123",
      "student_name": "김민준",
      "class_id": "m3a",
      "class_name": "중3A"
    }
  ],
  "payload": {
    "mode": "class",
    "classWrongItems": [],
    "gradeWrongItems": [],
    "students": []
  }
}
```

응답:

```json
{
  "success": true,
  "set_id": "wcs_...",
  "public_set_key": "SET_A8K2P9Q4",
  "packet_count": 18,
  "packets": [
    {
      "student_id": "stu_123",
      "student_name": "김민준",
      "packet_key": "PKT_Q9M2A7K8",
      "item_count": 12
    }
  ],
  "print": {
    "engine_url": "apmath/wrong_print_engine.html?set=SET_A8K2P9Q4"
  }
}
```

---

## 3-2. 선생님용 학생별 목록 API

```text
GET /api/wrong-clinics/packets?student_id=...
```

교사용 학생상세에서 씁니다.

응답:

```json
{
  "success": true,
  "packets": [
    {
      "packet_id": "wcp_001",
      "packet_key": "PKT_Q9M2A7K8",
      "title": "중3B 공통오답",
      "source_class_name": "중3B",
      "recipient_class_name": "중3A",
      "item_count": 12,
      "created_at": "2026-06-27 12:30",
      "mode": "class"
    }
  ]
}
```

---

## 3-3. QR/엔진용 packet 조회

```text
GET /api/wrong-clinics/packet/:packetKey
```

응답은 `wrong_print_engine.html`이 바로 렌더링할 수 있는 payload 형태여야 합니다.

```json
{
  "success": true,
  "payload": {
    "version": "2.0",
    "mode": "student",
    "printTitle": "중3B 공통오답",
    "className": "중3A",
    "sourceClassName": "중3B",
    "createdDate": "2026-06-27",
    "students": [
      {
        "studentId": "stu_123",
        "studentName": "김민준",
        "wrongItems": []
      }
    ]
  }
}
```

---

## 3-4. QR/엔진용 set 조회

공통오답 한 장을 여러 명에게 나눠주는 경우에는 같은 QR을 써야 할 수도 있습니다.

```text
GET /api/wrong-clinics/set/:setKey
```

이건 개인 추적 없이 “공통 콘텐츠”를 여는 용도입니다.

```text
wrong_print_engine.html?set=SET_A8K2P9Q4&mode=review
```

반면 학생 개별 페이지에서는 반드시 packet 기준으로 엽니다.

```text
wrong_print_engine.html?packet=PKT_Q9M2A7K8&mode=review
```

---

## 3-5. 학생 포털용 목록 API

현재 학생 포털은 학생 token으로 `student-portal/home`과 `student-portal/exams`를 불러옵니다.

여기에 둘 중 하나로 붙입니다.

### 방법 A: home 응답에 포함

```json
{
  "wrong_clinic_packets": []
}
```

### 방법 B: 별도 endpoint

```text
GET /api/student-portal/wrong-clinics?student_id=...
```

초기에는 **방법 B가 안전합니다.**
`student-portal/home`은 이미 과제, OMR, 배정자료가 얽혀 있어서 너무 커지면 회귀 위험이 있습니다.

---

# 4. 실제 프론트 이동 흐름

## 4-1. 선생님 화면: clinic-print.js

현재 최종 제출은 `clinicPrintSubmit()`에서 payload를 만들고 바로 `clinicPrintOpenEngine(payload)`를 호출합니다.

이걸 이렇게 바꿉니다.

```text
현재:
clinicPrintSubmit()
→ clinicPrintBuildPayload()
→ clinicPrintOpenEngine(payload)
→ sessionStorage/localStorage 저장
→ wrong_print_engine.html open

변경:
clinicPrintSubmit()
→ clinicPrintBuildPayload()
→ 배포 대상 resolve
→ POST /api/wrong-clinics
→ 서버가 set/packet 저장
→ wrong_print_engine.html?set=... 또는 packet=... open
→ 저장 실패 시 기존 wp/sessionStorage 방식 fallback
```

중요한 점:

```text
기존 즉시 출력 흐름은 깨지면 안 됨.
서버 저장 실패 시 “저장형 QR 생성 실패, 임시 출력으로 진행” 안내 후 기존 방식 fallback.
```

---

## 4-2. 배포 대상 선택 UI

현재 오답 출력은 기본적으로 현재 반 학생 목록에서 체크합니다.

여기에 “배포 대상”을 따로 둬야 합니다.

```text
[오답 출처]
중3B 공통오답

[배포 대상]
☑ 출처 반 전체: 중3B
+ 다른 반 추가
+ 학생 직접 추가
+ 임시 그룹 만들기
```

출처와 배포 대상은 별도입니다.

```text
source_class_id = 중3B
recipient_class_id = 중3A
recipient_student_id = 김민준
```

---

## 4-3. 학생상세: student.js

현재 학생 상세 탭은 3개입니다.

```js
const AP_STUDENT_DETAIL_TABS = ['basic', 'cns', 'grade'];
```

그리고 탭 라벨도 기본/상담/성적만 있습니다.

여기에 `wrong` 탭을 추가합니다.

```js
const AP_STUDENT_DETAIL_TABS = ['basic', 'cns', 'grade', 'wrong'];
```

탭:

```js
{ key: 'wrong', label: '오답' }
```

`renderStudentViewBody()` 분기 추가:

```js
if (activeTab === 'wrong') {
  body = renderStudentWrongClinicTab(sid);
}
```

`renderStudentWrongClinicTab(sid)`는 처음에는 카드 껍데기만 그리고 lazy load합니다.

```text
학생상세 → 오답 탭
→ api.get('wrong-clinics/packets?student_id=...')
→ 받은 오답 packet 목록 표시
```

표시 예:

```text
2026-06-27  중3B 공통오답 12문항
출처: 중3B · 받은 반: 중3A
[문제] [정답] [해설]
```

버튼은 `wrong_print_engine.html?packet=...`을 엽니다.

---

## 4-4. 학생 포털: apmath/student/index.html

학생 포털은 이미 `renderStudentPortalAssignments()`로 배정 자료 섹션을 그리고, OMR/해설 보기 URL도 만듭니다.

여기에 새 섹션을 추가합니다.

```text
오답 클리닉

2026-06-27 중3B 공통오답
12문항 · 해설 가능
[문제 보기] [정답 보기] [해설 보기]
```

새 함수:

```js
async function loadWrongClinicPackets(force = false)
function getWrongClinicPackets()
function renderWrongClinicPackets()
function openWrongClinicPacket(packetKey, mode)
```

URL:

```js
../../apmath/wrong_print_engine.html?packet=PKT_Q9M2A7K8&mode=review
```

학생 포털에서는 반드시 현재 로그인 학생의 packet만 보여야 합니다.
백엔드는 `student_token` 검증 후 `recipient_student_id = verified.student.id`인 packet만 반환해야 합니다.

---

## 4-5. wrong_print_engine.html

현재는 `wp=` 또는 sessionStorage payload 중심입니다.
여기에 서버 조회 모드를 추가합니다.

우선순위:

```text
1. packet=... 있으면 서버에서 packet payload 조회
2. set=... 있으면 서버에서 set payload 조회
3. wp=... 있으면 기존 QR payload 복원
4. sessionStorage/localStorage 있으면 기존 출력 payload 사용
```

즉 기존 기능은 유지하고, 새 저장형만 추가합니다.

```js
async function loadPayloadFromUrlOrStorage() {
  const p = new URLSearchParams(location.search);

  if (p.get('packet')) {
    return await loadWrongClinicPacketPayload(p.get('packet'));
  }

  if (p.get('set')) {
    return await loadWrongClinicSetPayload(p.get('set'));
  }

  if (p.get('wp')) {
    return decodeWrongQrPayload(p.get('wp'));
  }

  return loadClinicPrintPayloadFromStorage();
}
```

---

# 5. 중3B 오답을 다른 반에 배포하는 실제 흐름

## 케이스 A: 중3B 공통오답을 중3A 전체에게 배포

```text
1. 선생님이 중3B 오답 클리닉 생성
2. source_class_id = 중3B
3. 배포 대상에서 중3A 전체 선택
4. wrong_clinic_sets 1개 생성
5. wrong_clinic_set_items 12개 생성
6. wrong_clinic_distributions 1개 생성
   - target_type = class
   - target_class_id = 중3A
7. 중3A 재원생 수만큼 wrong_clinic_packets 생성
8. 각 packet에 packet_items 12개 생성
9. 중3A 학생 페이지에 “중3B 공통오답” 표시
```

학생 상세에는 이렇게 보여야 합니다.

```text
김민준 / 현재 반: 중3A

오답 클리닉
- 중3B 공통오답 12문항
  출처: 중3B
  받은 대상: 중3A 전체
  [문제] [정답] [해설]
```

---

## 케이스 B: 중3B 공통오답을 중3A 김민준 한 명에게만 배포

```text
set.source_class_id = 중3B
distribution.target_type = student
packet.recipient_student_id = 김민준
packet.recipient_class_id = 중3A
```

학생 페이지에는 김민준에게만 보입니다.

---

## 케이스 C: 중3B 오답을 임시 그룹에 배포

예: “기말대비 보강반”

```text
distribution.target_type = custom_group
distribution.target_label = 기말대비 보강반
packets = 선택 학생별로 생성
```

학생 상세에는:

```text
출처: 중3B
배포: 기말대비 보강반
```

---

# 6. 권한 설계

## 선생님/원장

현재 Worker에는 `canAccessStudent`, `canAccessClass` 같은 권한 헬퍼가 있습니다. `canAccessStudent`는 교사가 담당하는 반의 학생인지 확인합니다.

오답 클리닉 생성 권한은 이렇게 가야 합니다.

```text
원장(admin): 모든 source/recipient 가능
선생님(teacher):
  - source_class_id는 본인 담당반만 가능
  - recipient_student_id도 본인 담당 학생만 가능
  - 다른 선생님 반 학생에게 배포하려면 admin 권한 필요
```

형님이 원장 계정으로 전체 배포하는 건 가능해야 합니다.

---

## 학생 포털

학생은 자기 packet만 봅니다.

```sql
WHERE recipient_student_id = verified.student.id
```

절대 source_class_id로 조회하면 안 됩니다.

---

## QR

QR은 두 종류로 나눕니다.

```text
packet QR:
학생별 접근용
wrong_print_engine.html?packet=PKT_...

set QR:
공통오답 콘텐츠용
wrong_print_engine.html?set=SET_...
```

학생별 오답은 반드시 packet QR을 씁니다.
반별/학년별 공통 출력은 set QR을 기본으로 써도 됩니다. 대신 학생 포털에는 각 학생 packet이 따로 보입니다.

---

# 7. 이번 구현을 단계로 나누면

## 1차: DB/API 기반

작업:

```text
routes/wrong-clinics.js 추가
wrong_clinic_* 테이블 ensure 함수 추가
POST /wrong-clinics
GET /wrong-clinics/packet/:key
GET /wrong-clinics/set/:key
GET /wrong-clinics/packets?student_id=...
```

주의:

```text
initial-data에 넣지 말 것
학생상세는 lazy API로 불러올 것
```

현재 route map에서도 initial-data는 프론트 전체 회귀 위험이 크다고 되어 있습니다.

---

## 2차: clinic-print.js 저장형 연결

현재 `clinicPrintOpenEngine(payload)`는 session/localStorage 방식입니다.

변경:

```text
clinicPrintSubmit()
→ POST /wrong-clinics
→ 성공 시 wrong_print_engine.html?set=... 또는 packet=...
→ 실패 시 기존 clinicPrintOpenEngine(payload) fallback
```

---

## 3차: wrong_print_engine.html packet/set 모드

추가:

```text
?packet=...
?set=...
```

기존:

```text
?wp=...
sessionStorage/localStorage
```

유지.

---

## 4차: 학생상세 오답 탭

`AP_STUDENT_DETAIL_TABS`에 `wrong` 추가.
`renderStudentWrongClinicTab(sid)` 추가.

현재 학생상세 셸은 탭 변경 시 `renderStudentViewBody()`로 본문을 갈아끼우므로 이 구조에 맞추면 됩니다.

---

## 5차: 학생 포털 오답 클리닉 섹션

`apmath/student/index.html`에:

```text
loadWrongClinicPackets()
renderWrongClinicPackets()
openWrongClinicPacket()
```

추가.

홈에는 `renderMaterialWrongAssignments()` 아래나 위에 `renderWrongClinicPackets()`를 넣으면 됩니다. 현재 홈은 배정자료, 수업자료 오답, 과제/플래너/OMR 카드 순서로 구성됩니다.

추천 위치:

```text
배정 자료
오답 클리닉
수업자료 오답
과제 / 플래너 / OMR
```

---

# 8. Codex 지시 핵심 문장

```text
오답 클리닉 저장형 packet 시스템을 설계/구현한다.

핵심 원칙:
source_class_id와 recipient_class_id를 절대 같은 의미로 사용하지 않는다.

source_class_id/source_class_name은 오답 세트가 어디서 생성되었는지 나타내는 “출처”다.
recipient_student_id/recipient_class_id는 실제로 오답을 받은 “대상”이다.

학생상세와 학생포털의 오답 클리닉 목록은 source_class_id가 아니라 recipient_student_id 기준으로 조회한다.

예:
중3A 학생이 중3B 공통오답을 받으면,
학생상세/학생포털에는 “중3B 공통오답”이 표시되어야 한다.
단, 접근 권한과 목록 노출은 recipient_student_id 기준으로 판단한다.
```

---

# 9. 최종 검수 기준

```text
1. 중3B 오답을 중3B 전체에게 배포 → 중3B 학생 페이지에 표시
2. 중3B 오답을 중3A 전체에게 배포 → 중3A 학생 페이지에 “중3B 공통오답” 표시
3. 중3B 오답을 중3A 학생 1명에게만 배포 → 그 학생에게만 표시
4. 학생상세 오답 탭은 recipient_student_id 기준으로 조회
5. 학생포털 오답 클리닉 섹션도 recipient_student_id 기준으로 조회
6. source_class_name과 recipient_class_name이 둘 다 화면에 표시
7. wrong_print_engine.html?packet=... 으로 정답/해설 열림
8. wrong_print_engine.html?set=... 으로 공통오답 열림
9. 기존 wp/sessionStorage 출력 방식은 fallback으로 유지
10. QR은 긴 payload가 아니라 packet/set key만 포함
11. 다른 학생 packet이 섞이면 FAIL
12. source_class_id 기준으로 학생 목록을 필터링하면 FAIL
```

