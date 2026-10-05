# ADR 004 — 원본 기출 출제를 기본 행동으로 유지

상태: 채택 · 2026-09-16

## 결정

Archive 2.0은 기존 아카이브 전체 기능 위에 추가한다. 교사의 기본 흐름은
기출 선택 → 반·학생 선택 및 제외 → 원본 그대로 출제다. 맞춤 구성은 별도 보조 행동이다.

Finder의 시험 제목과 `바로 출제`는 기존 index의 `openAssignTargetPanel`을 연다.
동일 출처 iframe과 작은 entry adapter로 기존 로그인, 반/학생 조회, 대상 최종 확인,
assignment API, exclusion API, QR/원본 출력 엔진을 재사용한다. 패널 코드를 복제하지 않는다.
`전체 기능`은 기존 index 전체 화면으로 연결한다.

원본 출제에는 자동 문항 구성의 taxonomy/difficulty eligibility를 적용하지 않는다.
원본 전체 문항 수·순서와 기존 출제 Authority를 유지한다. strict `/studio` 원본 검증은
별도 계약 경로이며 기존 원본 출제를 강제 대체하지 않는다.

같은 사용자가 최근 선택한 반만 편의상 복원하며 실제 현재 반·학생 목록을 다시 조회한다.
학생 제외 목록은 자동 복원하지 않는다. 최종 대상 확인 단계는 유지한다.

## 실패 경계

기존 API는 assignment 저장 후 PDF 실패에 502와 저장된 assignment를 반환한다.
클라이언트는 이 경우 저장된 ID로 학생 제외를 적용한 뒤 PDF 재시도 필요를 알린다.
실패를 성공으로 표시하지 않으며 기존 API의 재시도 식별 규칙을 유지한다.

기존 원본 API의 과거 이력은 기존 blueprint/recipient/exclusion Authority를 따른다.
새 immutable bridge로 변환되지 않은 이력은 reconciliation의 unresolved coverage에
남기며, 자동 구성에서 미출제로 간주하지 않는다.

## 검증

로컬 actual workerd/D1과 브라우저에서 19문항 기출 → 고1 검증반 A → 학생 가 포함,
학생 나 제외 → 출제 요청을 수행했다. 저장된 archive_file과 문항 수가 원본과 일치했고,
PDF 실패에도 학생 나 exclusion이 저장됐다. 재시도 후 같은 assignment UUID와 제외가
유지됐다. 합성 데이터만 사용했다. 실제 PDF 생성 성공 및 전체 legacy 전수회귀는
이 검증에 포함하지 않는다.
