# WANGJI_OS_ROADMAP.md

# 왕지교육 OS 개발 로드맵 v1.0

> 작성일: 2026-05-15  
> 목적: 왕지교육 OS 상위 구조를 기준으로 향후 개발 순서를 단계별로 정리  
> 핵심 방향: 기존 AP Math OS는 유지하고, 왕지교육 전체 운영층을 순차적으로 추가한다.  
> 개발 원칙: foundation 먼저, UI 노출은 나중, Worker 배포/실행은 직접 확인 후 진행

---

## 0. 전체 진행 원칙

왕지교육 OS 개발은 한 번에 전면 개편하지 않는다.

기존 AP Math OS는 현재 운영 가능한 핵심 자산이므로 유지한다.

새로운 왕지교육 구조는 다음 순서로 진행한다.

```text
1. 구조 문서화
2. 현재 foundation 안정화
3. 수납·출납 foundation
4. 학부모 연락 foundation
5. 홈페이지 구조
6. UI 노출
```

각 단계의 원칙:

```text
- 기존 AP Math 기능을 깨지 않는다.
- DB/API foundation을 먼저 만든다.
- 대시보드와 메뉴 노출은 별도 단계에서 한다.
- Gemini/Codex는 로컬 반영과 검증 담당.
- Worker 배포와 실제 API 실행은 직접 확인 후 진행.
```

---

## Phase 1. 구조 문서화

### 목표

왕지교육 전체 운영과 학원별 운영을 명확히 분리한다.

### 산출물

```text
- WANGJI_OS_STRUCTURE.md
- WANGJI_OS_ROADMAP.md
```

### 정리 내용

```text
1. 학원 전체 운영
2. 학원별 운영
3. 공통 foundation
4. 학원별 특화 기능
5. 공통 DB
6. 학원별 DB
7. 전체 메뉴 구조
8. 수납/출납 구조
9. 시간표 구조
10. 개발 우선순위
```

### 완료 기준

```text
- 왕지교육 OS가 AP Math OS의 단순 확장이 아니라 상위 운영층이라는 기준이 정리됨
- AP Math 유지 범위가 명확해짐
- 씨매쓰 초등/EIE 영어학원 추가 방향이 정리됨
- 공통 foundation과 학원별 특화 기능이 분리됨
```

### 현재 상태

```text
진행 중 또는 작성 대상
```

---

## Phase 2. 현재 foundation 안정화

### 목표

이미 추가한 왕지교육 공통 foundation을 안정화한다.

### 완료된 항목

```text
- student_enrollments 추가
- class_time_slots 추가
- timetable_conflict_logs 추가
- timetable_conflict_overrides 추가
- 기존 class_students → student_enrollments 동기화 완료
- 기존 classes → class_time_slots 동기화 완료
- /api/timetable-conflicts/scan 작동 확인
- teacher 충돌 예외 처리 완료
```

### 현재 확인된 결과

```text
수강 등록:
- insertable = 0
- skipped = 138
- 이미 동기화 완료

시간표 슬롯:
- insertable = 0
- skipped = 76
- 이미 동기화 완료

충돌 스캔:
- count = 0
- ignored_teacher_count = 13
- student 충돌 없음
- room 충돌 없음
```

### 현재 충돌 기준

```text
student 충돌 = 위험
teacher 충돌 = 운영 기준에 따라 예외 가능
room 충돌 = 교실 입력 후 판단
```

AP Math teacher 충돌 예외:

```text
중등 금요일 teacher 충돌
→ 합반 / 클리닉 / 격주 / 특수 운영 예외

고등 teacher 충돌
→ 합반 운영 예외
```

### 남은 작업

```text
- 변경분 커밋/푸시
- foundation 작업 결과 문서화
- room_name/교실 배정은 별도 phase로 분리
```

### 완료 기준

```text
- 위험 충돌 count = 0 유지
- student 충돌 없음 확인
- teacher 충돌은 ignored_teacher_conflicts로 분리
- 기존 AP Math 화면 변화 없음
```

---

## Phase 3. 수납·출납 foundation

### 목표

왕지교육 전체 수납·출납·회계 구조를 만든다.

수납은 AP Math만 기준으로 만들면 안 된다.

왕지교육 전체 기준으로 설계한다.

```text
홍길동 5월 청구서
├─ AP Math 수강료
├─ EIE 영어학원 수강료
├─ 교재비
├─ 복수 수강 할인
├─ 지역상품권 납부
├─ 카드 일부 결제
└─ 최종 미납 0원
```

### 현재 있는 foundation

```text
billing_templates
billing_runs
payments
payment_items
billing_adjustments
```

### 추가할 foundation

```text
payment_methods
payment_transactions
cashbook_entries
refund_records
carryover_records
accounting_daily_summaries
accounting_monthly_summaries
```

### 핵심 설계 원칙

```text
청구와 실제 돈의 흐름을 분리한다.

payments/payment_items
→ 청구서

payment_transactions
→ 실제 납부 거래

cashbook_entries
→ 회계 출납 장부
```

### 포함할 결제수단

```text
- 카드
- 현금
- 계좌이체
- 카카오페이
- 지역상품권
- 기타
- 복합결제
```

### 포함할 수납 상태

```text
- 미납
- 전액 납부
- 부분 납부
- 과납
- 환불
- 이월
- 면제
- 할인
- 감면
```

### 포함할 출납/회계 항목

```text
- 일별 입금
- 일별 출금
- 카드 매출
- 현금 매출
- 계좌 입금
- 카카오페이 입금
- 지역상품권 수납
- 환불 출금
- 운영비 지출
- 교재비 지출
- 강사료 지출
- 일별 정산
- 월별 정산
- 브랜드별 매출
- 결제수단별 매출
```

### 0단계 작업 범위

```text
- DB 테이블 추가
- Worker API foundation 추가
- 청구 후보 preview API 추가
- 수납 summary API 추가
- 실제 청구 생성은 금지
- 실제 결제 연동 금지
- 알림톡 발송 금지
- 대시보드 UI 노출 금지
```

### 금지 사항

```text
- 실제 카드사 연동 금지
- 카카오페이 실결제 금지
- 알림톡 발송 금지
- 대시보드 UI 노출 금지
- 자동 청구 실행 금지
- 실제 payments 대량 생성 금지
```

### 완료 기준

```text
- 수납·출납·회계 foundation 테이블 생성
- 기존 AP Math 화면 변화 없음
- 청구 후보 preview 가능
- 실제 청구/결제/발송은 실행되지 않음
```

---

## Phase 4. 학부모 연락 foundation

### 목표

학부모 연락과 발송 기록을 왕지교육 전체 기준으로 통합한다.

### 현재 foundation

```text
parent_contacts
message_logs
```

### 추가 또는 보강할 항목

```text
- 학부모 연락처 정리
- 수신 동의 기준 정리
- 출결 알림 수신 여부
- 수납 알림 수신 여부
- 공지 수신 여부
- 리포트 수신 여부
- 상담 알림 수신 여부
- 발송 후보 preview API
- 발송 실패 기록
- 재발송 기록
```

### 발송 종류

```text
- 출결 알림
- 수납 알림
- 미납 알림
- 공지사항
- 시험 안내
- 상담 안내
- 리포트 발송
- 과제 안내
```

### 발송 채널

```text
- 카카오 알림톡
- 문자
- 앱 알림
- 이메일
```

### 0단계 작업 범위

```text
- 발송 후보 preview
- message_logs 확장
- 수신 동의 기준 정리
- 실제 발송 금지
```

### 금지 사항

```text
- 실제 카카오 알림톡 발송 금지
- 실제 문자 발송 금지
- 대시보드 UI 노출 금지
- 자동 발송 금지
```

### 완료 기준

```text
- 연락처/수신동의/발송로그 구조 정리
- 발송 후보 preview 가능
- 실제 발송은 실행되지 않음
```

---

## Phase 5. 홈페이지 구조

### 목표

왕지교육 외부 홈페이지를 만든다.

외부 노출은 AP Math, 씨매쓰 초등, EIE 영어학원이 균형 있게 보여야 한다.

단, 내부 운영에서는 AP Math 기능이 가장 깊어도 된다.

### 홈페이지 구조

```text
왕지교육 홈페이지
├─ 메인
├─ AP Math 소개
├─ 씨매쓰 초등 소개
├─ EIE 영어학원 소개
├─ 입학 안내
├─ 상담 예약
├─ 공지사항
└─ 로그인
```

### 메인 페이지 원칙

```text
AP Math
씨매쓰 초등
EIE 영어학원
```

세 브랜드가 외부에서는 비슷한 비중으로 보여야 한다.

### 포함할 내용

```text
- 왕지교육 브랜드 소개
- AP Math 소개
- 씨매쓰 초등 소개
- EIE 영어학원 소개
- 학원 위치
- 입학 문의
- 상담 예약
- 공지사항
- 로그인 진입
```

### 내부 연결

```text
왕지교육 홈페이지
→ AP Math OS
→ 학생 포털
→ 학부모/학생 포털
→ 상담 예약
→ 공지사항
```

### 완료 기준

```text
- 왕지교육 메인 구조 확정
- 3개 브랜드 균형 노출
- 내부 운영 시스템과 연결 방향 확정
```

---

## Phase 6. UI 노출

### 목표

이미 준비된 foundation을 실제 화면에 순차적으로 노출한다.

### 원칙

```text
DB/API foundation이 먼저다.
화면 노출은 나중이다.
기존 AP Math 대시보드를 바로 갈아엎지 않는다.
```

### 노출 순서 후보

```text
1. 전체 시간표 확인 화면
2. 전체 수납 preview 화면
3. 전체 학생 통합 화면
4. 학부모 연락 화면
5. 원장 통합 대시보드
```

### 원장 모드 최종 구조

```text
왕지교육 원장 모드
├─ 전체 대시보드
├─ 전체 학생
├─ 전체 시간표
├─ 전체 출결
├─ 전체 수납
├─ 전체 출납
├─ 전체 상담
├─ 전체 공지
├─ 직원/권한
├─ AP Math
├─ 씨매쓰 초등
├─ EIE 영어학원
└─ 홈페이지 관리
```

### 선생님 모드 최종 구조

```text
선생님 모드
├─ 내 대시보드
├─ 내 반
├─ 내 시간표
├─ 내 출석부
├─ 내 과제/진도
├─ 내 상담 기록
└─ 학원별 기능
   ├─ AP Math 수학 기능
   ├─ 씨매쓰 초등 기능
   └─ EIE 영어 기능
```

### 학생/학부모 포털 최종 구조

```text
학생/학부모 포털
├─ 내 수강 학원
├─ 오늘 수업
├─ 출결
├─ 과제
├─ 리포트
├─ 청구/납부
├─ 공지
└─ 상담 신청
```

### 완료 기준

```text
- 기존 AP Math 화면 회귀 없음
- 원장/선생님/학생 권한별 노출 가능
- 공통 foundation 데이터가 화면에서 조회 가능
```

---

## Phase 7. 씨매쓰 초등 운영 확장

### 목표

씨매쓰 초등을 왕지교육 내부의 정식 학원 모듈로 추가한다.

### 1차 범위

```text
- 씨매쓰 초등 소개
- 초등 반 관리
- 초등 학생 관리
- 초등 시간표
- 출결
- 진도
- 교재
- 상담
- 수납 연결
- 학부모 안내
```

### 장기 확장

```text
- 사고력 수학 진도
- 교재별 커리큘럼
- 초등 리포트
- AP Math 진학 추천
- 초등 성취도 기록
```

### 완료 기준

```text
- 씨매쓰 초등이 왕지교육 구조 안에서 학원별 운영 가능
- 수납/출결/상담은 공통 foundation과 연결
- 초등 특화 기능은 별도 확장 가능
```

---

## Phase 8. EIE 영어학원 운영 확장

### 목표

EIE 영어학원을 왕지교육 내부의 정식 학원 모듈로 추가한다.

### 1차 범위

```text
- EIE 영어학원 소개
- 영어 반 관리
- 영어 레벨 관리
- 영어 시간표
- 출결
- 과제
- 상담
- 수납 연결
- 학부모 안내
```

### 장기 확장

```text
- 단어 테스트
- 문법 과제
- 리딩 과제
- 리스닝 과제
- 레벨 이동 이력
- 영어 리포트
- 영어 성취도 기록
```

### 완료 기준

```text
- EIE 영어학원이 왕지교육 구조 안에서 학원별 운영 가능
- 수납/출결/상담은 공통 foundation과 연결
- 영어 특화 기능은 AP Math와 분리해서 확장 가능
```

---

## 전체 우선순위 요약

```text
1. 구조 문서화
2. 시간표 foundation 안정화
3. 수납·출납 foundation
4. 학부모 연락 foundation
5. 홈페이지 구조
6. UI 노출
7. 씨매쓰 초등 확장
8. EIE 영어학원 확장
```

---

## 다음 즉시 작업

현재 다음 작업은 아래 순서가 적절하다.

```text
1. WANGJI_OS_STRUCTURE.md 저장
2. WANGJI_OS_ROADMAP.md 저장
3. 현재 시간표 foundation 변경분 커밋/푸시
4. 수납·출납 foundation 0단계 지시서 작성
5. Gemini/Codex는 로컬 반영과 검증 담당
6. Worker 배포와 실제 API 실행은 직접 확인 후 진행
```

---

## 최종 정리

왕지교육 OS는 AP Math OS를 대체하지 않는다.

왕지교육 OS는 AP Math OS 위에 올라가는 상위 운영층이다.

```text
왕지교육 OS
├─ 공통 운영
│  ├─ 학생
│  ├─ 학부모
│  ├─ 수강
│  ├─ 시간표
│  ├─ 출결
│  ├─ 수납
│  ├─ 출납
│  ├─ 회계
│  ├─ 상담
│  ├─ 공지
│  ├─ 직원
│  └─ 권한
│
└─ 학원별 운영
   ├─ AP Math
   ├─ 씨매쓰 초등
   └─ EIE 영어학원
```

앞으로 모든 작업은 다음 기준으로 판단한다.

```text
왕지교육 전체가 함께 써야 하는가?
→ 공통 foundation

특정 학원만의 교육 기능인가?
→ 학원별 특화 기능
```
