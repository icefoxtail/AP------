# 왕지교육 공통 학생관리 v1 — 구현 범위 확정 (IMPLEMENTATION_SCOPE)

> 설계 보정 문서. **이번 라운드는 구현 금지.** 이 문서는 "1차 구현 시 무엇을 아주 작게 할지"를 미리 확정하는 설계 산출물이다.
> 대원칙: **원본 DB 유지 · 재입력/일괄 복사 금지 · 1차 read-only overlay · 장기 write-through 입력 이전.**

---

## 1. 1차 구현 목표 (아주 작게)

왕지 공통 학생관리 1차는 **"관리자가 AP/EIE 학생을 한 화면에서 읽고, 연결하고, 공통 상담을 남길 수 있다"** 까지만 한다.
원본 데이터 입력/수정은 1차 범위가 아니다.

## 2. 1차 구현 범위 (포함)

| # | 항목 | 설명 | 경계 |
|---|---|---|---|
| 1 | overlay/link/index DB schema 초안 | `wangji_students`(anchor+snapshot), `wangji_student_links`, `wangji_consultations` | 별도 D1 권장. 적용은 승인 후 |
| 2 | AP/EIE read adapter interface 설계 | `apStudentAdapter` / `eieStudentAdapter` (HTTP read) 인터페이스·반환 모델 | **read-only**. write 메서드 없음 |
| 3 | 관리자 전용 독립 페이지 설계 | 목록/검색/필터 + 통합 상세 레이아웃 | 기존 메뉴 정식 노출 X (숨김/직접 URL) |
| 4 | 통합 학생상세 표시 모델 설계 | 공통 요약 + AP 섹션 + EIE 섹션 + 상담 섹션 + 이력/메모 | adapter 결과 합성, section error 격리 |
| 5 | 공통 상담 저장 위치 설계 | `wangji_consultations`에 신규 공통 상담만 저장 | 기존 상담은 read-only |
| 6 | 연결 후보(candidate) 모델 | 동명이인/번호 일치를 `confidence_reason` 후보로 표시 | active 전환은 관리자 확정 |

## 3. 1차에서 명확히 제외 (구현 금지)

- 기존 AP/EIE DB migration
- 기존 학생/반/시간표/상담/출결/성적 전체 복사·재입력
- 기존 학생상세 화면 교체
- **write-through adapter 구현** (학생정보/수강/반/시간표 write)
- 수강 배정 write 구현
- 기존 AP/EIE 시간표 로직 수정
- 메뉴 정식 노출 (보류)
- 기존 AP/EIE 상세 "열기" 버튼 — deeplink 형식(`apmath/js/student.js`) 조사 후 **후순위**
- 배포 / git commit / push

## 4. read → write-through 경계 (장기 확장성만 확보)

1차 설계는 반드시 **나중에 write-through control panel로 확장 가능**해야 한다. 단, 1차에서는 구현하지 않는다.

```
[1차 구현]   왕지 화면 → (read-only adapter) → AP/EIE 원본 DB
[장기 확장]  왕지 화면(주 입력) → (write-through adapter / 공식 API) → AP/EIE 원본 DB 반영
             공통 링크/메모/상담 → wangji overlay DB
```

write-through 도입 전제(5단계, 별도 라운드):
- 기존 공식 route/API 재사용 우선 (원본 DB 직접 SQL 금지)
- 입력 검증·트랜잭션·부분 실패 롤백 정책 사전 정의
- 별도 검수 및 회귀 테스트 통과

## 5. adapter 인터페이스 초안 (read-only)

```text
apStudentAdapter (ap-math-os, /api/*, teacher 세션)
  search(query) → [{source_app:'AP', source_student_id, display_name, school_name, grade, phone, status}]
  getDetail(id) → {기본정보, enrollments[], schedules[], consultations[](read), detail_url}
  (write 메서드 없음 — 1차)

eieStudentAdapter (wangji-eie-os, /api/eie/*, Bearer)
  search(query) → [{source_app:'EIE', source_student_id, display_name, school_name, grade, phone, status}]
  getDetail(id) → {기본정보, enrollments[](셀), schedules[], consultations[](read), detail_url}
  (write 메서드 없음 — 1차)

공통 반환 필드: source_app, source_student_id, display_name, school_name, grade,
               phone, status, enrollments[], schedules[], consultations[], detail_url, section_errors[]
```

## 6. 1차 완료 정의 (Definition of Done, 설계 기준)
- overlay 3개 테이블 스키마 초안 문서화 (적용 X)
- 두 read adapter 인터페이스·반환 모델 확정 (구현 X)
- 관리자 전용 독립 페이지 레이아웃·필터·상세 섹션 확정
- 공통 상담 저장 위치/scope 확정
- 자동 병합 금지·candidate 모델 확정
- 기존 원본 DB·화면·시간표 미변경 확인

## 7. 구현 전 확인 필요 (사용자 결정)
- overlay DB 위치 (신규 D1 권장 vs 기존 DB prefix)
- 신규 worker vs 기존 worker 확장
- adapter 인증 방식 (teacher 세션 / Bearer 토큰 서버-사이드 공유)
- AP/EIE deeplink 형식
- 관리자 전용 진입 방식
- write-through 도입 단계/검수 기준
