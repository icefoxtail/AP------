# 왕지교육 공통 학생관리 v1 — 통합 도입 계획 (INTEGRATION_PLAN)

> 설계 보정 문서. 기존 앱 침범을 단계마다 최소화하는 점진 도입.
> 대원칙: **원본 DB 유지 · 재입력/일괄 복사 금지 · 1차 read-only overlay · 장기 write-through 입력 이전.**

## 단계 개요

```
1단계 독립 조회/연결 화면      → 기존 앱 영향 0 (read-only adapter, overlay DB)
2단계 공통 상담 입력           → 공통 상담만 신규 저장, 기존 상담은 read
3단계 신규 학생 anchor 생성     → 공통 anchor + 링크 (원본 미변경)
4단계 AP/EIE 연결 확정 운영     → candidate→active 관리자 확정
5단계 AP/EIE write-through 일부 → 왕지 입력을 공식 API로 원본 반영 (별도 검수)
6단계 기존 학생관리 보조화      → 왕지 화면이 주 입력, 기존은 레거시/보조
```

핵심: **앞단은 안전하게 읽고 연결, 뒷단은 왕지에서 입력하되 원본 DB는 공식 API/write-through로 반영.** 한 번에 전환하지 않는다.

---

## 1단계 — 독립 조회/연결 화면 (read-only)
- 새 독립 페이지(예: `wangji-common/`) 생성. 공통 데이터는 **별도 D1(`wangji-common-os`) 또는 별도 워커**.
- `wangji_students`(anchor) / `wangji_student_links` / `wangji_consultations` 생성. **기존 두 원본 DB 스키마 미변경.**
- apStudentAdapter / eieStudentAdapter는 **읽기 전용 HTTP fetch**.
- 노출: 관리자/원장 전용 숨김 메뉴 또는 직접 URL. 기존 메뉴 정식 노출 안 함.
- **산출**: 통합 학생상세(읽기) + 연결 후보 표시. 기존 앱 코드 0줄.

## 2단계 — 공통 상담 입력
- `wangji_consultations`에 신규 공통 상담 저장 (`source_scope` 구분).
- 기존 AP/EIE 상담은 계속 read-only 표시. **일괄 복사·이관 금지.**

## 3단계 — 신규 학생 anchor 생성
- 왕지 화면에서 신규 공통 학생 anchor + 링크 생성.
- 원본 AP/EIE 학생 데이터는 변경하지 않음(연결만).

## 4단계 — AP/EIE 연결 확정 운영
- candidate → active 전환은 **관리자 확정**만. 자동 병합 금지.
- 동명이인/번호 일치는 `confidence_reason` 후보로만.

## 5단계 — AP/EIE write-through 일부 도입 (별도 검수 필수)
- 왕지 화면에서 입력한 AP 학생정보/수강/반, EIE 학생정보/시간표 배정을
  **AP/EIE 공식 route/API 또는 검증된 write-through adapter**로 원본 DB에 반영.
- **원본 DB 직접 SQL 금지 — 기존 공식 API 재사용 우선.**
- 도입 전 반드시 별도 라운드의 검수·테스트. 1차에서는 구현 금지(설계 확장성만 확보).

## 6단계 — 기존 학생관리 보조화
- 왕지 공통 학생관리가 등록·수정·상담·수강 연결의 **주 입력 화면**.
- 기존 AP/EIE 학생관리는 **보조/레거시 입력 화면**으로 점진 전환. 화면 교체·삭제 아님.

---

## 구현 순서 (1단계 내부)
1. overlay/link/index DB 스키마 초안 (적용은 승인 후)
2. 공통 워커 read API: 학생/링크/상담
3. apStudentAdapter (AP HTTP read) — 학생/반/시간/상담
4. eieStudentAdapter (EIE HTTP read) — 학생/셀/시간/상담
5. 프론트 독립 페이지: 목록+필터+상세 섹션(공통/AP/EIE/상담/이력)
6. 연결 후보(candidate) 생성 로직 — 자동 병합 금지
7. 섹션 단위 에러 처리(adapter 실패 격리)

## 검수 순서 (각 단계 종료 시)
1. 기존 AP/EIE 화면/로그인/시간표/상세/출결 회귀 없음 (수동 + 기존 테스트)
2. 기존 두 원본 D1 스키마 변경 0 (`schema.sql`, EIE migrations diff 0)
3. 라우팅 충돌 없음 (AP 커스텀 / EIE 해시 / 공통 페이지 경로 분리)
4. adapter는 read-only — 쓰기 호출 없음 (코드 grep)
5. 자동 병합 미발생 — 링크는 candidate로만
6. 데이터 재입력/일괄 복사 없음
7. 권한: 1~4단계 admin 한정. 교사 노출은 권한 모델 확정 후
8. 회귀 테스트: `tests/eie-*.test.js`, AP 핵심 플로우 수동

## 구현 전 확인 필요 (사용자 결정)
- overlay DB 위치: **신규 D1(권장)** vs 기존 DB prefix 테이블
- 공통 모듈 호스팅: 신규 워커 vs 기존 워커 확장
- adapter 인증: 두 워커(teacher 세션 / Bearer)에 대한 서버-사이드 토큰 공유 방식
- AP 학생상세 deeplink 파라미터 형식(student.js 추가 확인)
- 관리자 전용 진입 방식
- write-through 도입 단계/검수 기준
- 교사 권한 범위
