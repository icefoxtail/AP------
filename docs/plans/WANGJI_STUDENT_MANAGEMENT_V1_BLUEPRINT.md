# 왕지교육 공통 학생관리 v1 — 설계서 (BLUEPRINT)

> 상태: **설계 보정 문서**. 구현/마이그레이션/배포/커밋 없음.
> 근거: 실제 저장소 코드를 읽고 작성. 미확인 파일은 근거로 쓰지 않음.

---

## 1. 목적

기존 AP수학(APMS) / EIE영어 프로그램의 화면·로그인·대시보드·시간표·클래스룸·학생상세·Worker·D1을 **원본 그대로 유지**하면서,
왕지교육 내부에서 두 학원 학생을 한 화면에서 조망·연결·관리하는 **독립 공통 학생관리 모듈**을 설계한다.

### 1.1 핵심 방향 (2차 보정의 최상위 원칙)

```
기존 AP/EIE DB는 원본으로 유지한다. (폐기 대상 아님)
기존 데이터를 새로 재입력하거나 일괄 복사하지 않는다.

1차: 왕지 공통 학생관리는 overlay / link / index 역할로 시작한다. (read-only)
장기: 학생 등록·수정·상담·수강 연결의 "주 입력 화면"을 왕지 공통 학생관리로 이전한다.
      단, 재입력이 아니라 AP/EIE 공식 API 또는 검증된 write-through adapter로 원본 DB에 반영한다.
```

즉, **처음에는 안전하게 읽고 연결**하고, **나중에는 왕지 화면에서 입력하되 원본 DB에 반영**한다.

## 2. 범위

- 새 독립(관리자 전용) 학생 목록 / 검색 / 필터
- 통합 학생 상세 (공통 요약 + AP 섹션 + EIE 섹션 + 상담 섹션 + 이력/메모)
- 왕지 공통 overlay/link/index DB (`wangji_students` anchor, `wangji_student_links`, `wangji_consultations`)
- AP/EIE **read-only adapter** (1차)
- 후속 **write-through adapter/공식 API** 확장 가능성 (설계만, 구현 X)
- 단계별 도입 계획, 위험 분석

## 3. 금지사항 (절대 원칙)

1. 기존 AP/EIE 화면·로그인·대시보드·시간표·클래스룸·학생상세 변경 금지
2. **기존 AP/EIE 학생/반/시간표/상담/출결/성적 데이터를 새 DB에 일괄 복사·재입력 금지**
3. 기존 AP/EIE 학생을 새 공통 학생으로 강제 migration 금지
4. 기존 AP/EIE DB를 버리고 새 DB로 갈아타는 설계 금지
5. 동명이인·연락처 유사 학생 **자동 병합 금지** (candidate 후보만, active는 관리자 확정)
6. 기존 학생상세 교체 금지 / 기존 시간표 로직 수정 금지
7. 이번 라운드 구현 파일 수정·DB migration·배포·git commit/push 금지
8. 1차 write-through adapter 구현 금지 (설계상 확장 가능성만 반영)
9. 작업 시작 시 이미 변경돼 있던 파일(`eie/css/eie.css`, `eie/js/views/eie-attendance.js`) 미수정

## 4. 현재 구조 핵심 사실 (읽은 코드 기준)

- **AP와 EIE는 서로 다른 Cloudflare Worker + 서로 다른 D1**다.
  - AP: Worker `apmath/worker-backup/worker/`, D1 `ap-math-os` (binding `DB`), `/api/*`
  - EIE: Worker `workers/wangji-eie-worker/`, D1 `wangji-eie-os` (binding `DB`), `/api/eie/*`만
- 따라서 **D1 간 SQL JOIN 불가**. 공통 모듈은 두 워커 **HTTP API를 각각 호출**해 읽는다 → adapter = HTTP fetch 계층.
- AP 학생 PK(`students.id`)와 EIE 학생 PK(`eie_students.id`)는 **독립 TEXT 키**, ID 체계 상이. 동일 인물도 같은 ID 아님 → cross-DB FK 불가.
- 두 DB 모두 `consultations` 테이블이 있으나 **다른 DB**라 현재 충돌 없음(단일 DB 통합 시에만 충돌).

자세한 위치/필드는 [DATA_MAP](WANGJI_STUDENT_MANAGEMENT_DATA_MAP.md), 구현 1차 확정 범위는 [IMPLEMENTATION_SCOPE](WANGJI_STUDENT_MANAGEMENT_V1_IMPLEMENTATION_SCOPE.md) 참조.

## 5. overlay/link/index 모델 (1차 본질)

1차에서 왕지 공통 DB는 **원본 학생 DB가 아니다.** 다음 역할만 한다.

- 기존 AP 학생 id와 EIE 학생 id **연결**
- 연결 **후보(candidate) 표시** 및 관리자 **확정(active)**
- **공통 상담 / 공통 메모** 저장
- AP/EIE adapter 결과를 묶어 보여주는 **통합 학생상세 index**

`wangji_students`는 전체 복사본이 아니라 **공통 학생 anchor + 검색용 최소 snapshot**이다. 원본 정보의 우선권은 항상 AP/EIE DB에 있다.

## 6. 화면 구조

독립 페이지. 후보 이름: **학생 종합관리 / 왕지 학생관리 / 통합 학생관리**.
1차는 기존 메뉴에 정식 노출하지 않고 **관리자/원장 전용 숨김 메뉴 또는 독립 링크**로만 둔다.

```
+-----------------------------+--------------------------------------+
|  좌측: 학생 목록             |  우측: 통합 학생 상세                |
|  - 검색 (이름/학교/번호)     |  [공통 요약] 이름/학교·학년/연락처   |
|  - 필터 칩                   |   AP·EIE 연결 상태/오늘 수업/미처리상담|
|    · 전체                    |  [AP 섹션] (apStudentAdapter, read)  |
|    · AP 연결                 |   AP 원본정보/반/과목/시간/상담요약  |
|    · EIE 연결                |   → "AP 상세 열기" deeplink          |
|    · AP+EIE 연결             |   (후속: AP 수정/write-through 후보) |
|    · 연결 후보               |  [EIE 섹션] (eieStudentAdapter, read)|
|    · 상담 후속 필요          |   EIE 원본정보/셀/과목/시간/상담요약 |
|    · 오늘 수업 있음          |   → "EIE 상세 열기" deeplink         |
|  - 학생 카드(AP/EIE 배지)    |   (후속: EIE 수정/write-through 후보)|
|                             |  [상담 섹션] 공통 상담 작성          |
|                             |   COMMON/AP/EIE scope, 다음조치/후속 |
|                             |  [이력/메모 섹션]                    |
+-----------------------------+--------------------------------------+
```

## 7. 기능 흐름

### 7.1 학생 등록 / anchor 생성
기존 AP/EIE DB를 직접 변경하지 않는다.
```
왕지 공통 학생 anchor 생성 (wangji_students)
→ AP 연결 여부 선택 / EIE 연결 여부 선택
→ 기존 AP/EIE 학생과 "연결(candidate)" 또는 "신규 연결 대기"
→ 관리자 확정 시 link_status = active
```
자동 병합 금지. 동명이인·보호자번호·학교/학년 일치는 `confidence_reason`으로만 제시.

### 7.2 학생 상세 표시
1. `wangji_students` anchor 로드 → 2. `wangji_student_links`의 active 링크 조회(AP id, EIE id)
→ 3. apStudentAdapter / eieStudentAdapter **병렬 read** → 4. 각 섹션 렌더(**adapter 실패는 section error로 격리**, 전체 화면 비파괴)
→ 5. 상담 섹션: 공통 상담(`wangji_consultations`) + read adapter로 가져온 기존 상담을 함께 표시.

### 7.3 상담
1차는 **신규 상담만 공통 테이블에 저장**, 기존 AP/EIE 상담은 read-only 표시. `source_scope(COMMON/AP/EIE)`로 맥락 구분. 기존 상담 일괄 복사 금지.

## 8. 단계별 구현 계획 (요약)

| 단계 | 내용 | 입력 위치 | 기존 앱 영향 |
|---|---|---|---|
| 1단계 | 독립 조회/연결 화면 + overlay DB + read adapter | AP/EIE(기존) | 없음 |
| 2단계 | 공통 상담 입력 | 공통 + AP/EIE 기존 | 없음 |
| 3단계 | 신규 학생 anchor 생성 | 공통 | 없음 |
| 4단계 | AP/EIE 연결 확정 운영 | 공통(링크만) | 없음 |
| 5단계 | AP/EIE **write-through 일부 도입** (공식 API 우선) | 왕지 화면 → 원본 DB 반영 | 별도 검수 필요 |
| 6단계 | 기존 학생관리 입력 기능을 보조/레거시화 | 왕지 화면 주 입력 | 점진 |

상세 순서는 [INTEGRATION_PLAN](WANGJI_STUDENT_MANAGEMENT_INTEGRATION_PLAN.md) 참조.

## 9. 검수 자가확인

- [x] 기존 AP/EIE DB를 원본으로 유지 (overlay는 별도 격리)
- [x] 새 DB를 overlay/link/index로 표현 (원본 DB 아님)
- [x] 기존 데이터 재입력·일괄 복사 금지 명시
- [x] 장기 입력 중심 이전 + read→write-through 구분 명시
- [x] 1차 read-only adapter 명시
- [x] 자동 병합 금지 / 기존 화면·시간표 미변경 명시
- [x] 1차 관리자 전용 독립 화면 명시
- [x] 기존 변경 파일 미수정 / 구현 없이 문서만
