# ADR 001 — Metadata를 소비하는 교사용 작업공간

상태: ACCEPTED FOR IMPLEMENTATION · 2026-09-16

## 기준

시작 HEAD는 `afeed1c9c74413f58dfc596c756c20af11b64945`다. 원격을 fetch한
`origin/main=994ac4fd60c117e571ec79334e0d90b4f49bfa89`와 기존 `c95108dc`는
이미 장기 브랜치의 ancestor다. root metadata 작업 트리는 수정하지 않는다.

RPM Primary v1.0, difficulty v1.3, Metadata Contract v2가 문항 의미의
HARD authority다. 기존 index/legacy unit과 level로 canonical 값을 추정하지 않는다.

## 실제 시스템에서 확인한 문제

- 현재 catalog는 462개 시험을 제공하지만 Foundation의 승인은 부분 적용이다.
- legacy Unit Past는 source JS를 전역 script로 읽으며 문항 복원은 번호 검색이다.
  다중 source의 선언 충돌과 번호/ordinal 혼동을 새 제품으로 이어가면 안 된다.
- MIXED payload, assignment UUID, recipients/exclusions, PDF, OMR은 기존 authority다.
- assignment question bridge는 없으며 기존 create 경로는 assignment → recipients
  → blueprint → PDF 순서다. bridge만 후처리로 넣으면 부분 성공이 생길 수 있다.
- 기존 학생 출제 caller는 반환된 assignment UUID를 후속 제외 요청에서 잃는다.

## 결정

1. Archive 2.0은 한 작업공간 안에 자료 탐색과 문제지 구성을 제공한다. 학생은
   별도 제품이 아니라 구성의 대상이다. 범위·대상·현재 문항·검증 상태를 유지한다.
2. canonical 경로를 직접 탐색한다. legacy bridge는 출처 설명과 호환용으로 보존한다.
   전체 자료 탐색 가능 여부와 검수된 자동출제 가능 여부를 구분한다.
3. catalog projection은 source/identity/approved metadata를 읽기만 한다. UID 미등록,
   fingerprint 불일치, HOLD, invalid path를 진단하며 metadata 재승인이나 global
   builder 재생성을 수행하지 않는다. 원본 시험 재현은 기존 engine으로 연결한다.
4. 기존 Mixer selector의 결정적 선택을 재사용하고 canonical eligibility, 구성 행,
   pin, series, 학생 이력을 공통 경계에서 검증한다. 부족을 조용히 완화하지 않는다.
5. source 복원은 격리된 파일 scope와 canonical source ordinal을 사용한다. 실제
   payload 생성 시 source fingerprint와 UID/source tuple을 다시 확인한다.
6. 기존 assignment에만 문항 bridge를 추가한다. 신규 strict 경로의 assignment,
   recipients, exclusions, question snapshot은 원자적으로 저장한다. PDF 실패는
   저장 상태와 분리해 재시도 가능하게 하고 실패를 성공으로 표시하지 않는다.
7. history는 recipients − exclusions JOIN assignment questions다. metadata/unit은
   history predicate가 아니다. 미복원/추정 coverage와 API 실패를 숨기지 않는다.
8. 기존 출력 엔진을 preview/print authority로 사용한다. 별도 renderer나 학생
   exposure ledger, 새 assignment identity를 만들지 않는다.

## 검증·출시

사용자 지시에 따라 구현 직후 critical boundary만 runtime 검증한다. 전체 legacy
전수회귀는 RC 후 별도 Luna Max 감사 범위다. 로컬 RC와 production rollout을 구분한다.
production 데이터 수정/배포 및 main merge 없이 장기 브랜치에 의미 단위로 commit한다.
feature flag OFF에서 기존 진입점을 유지한다. 이후 중요한 변경은 추가 ADR로 남긴다.

## 첫 소비 검증 결과

2026-09-16 main sidecar를 실제 source catalog와 연결한 결과, `reviewed_pass +
BORDERLINE_REVIEW`가 968문항 남아 있었다. `994ac4fd6`의 수정 대상은 candidate와
검수 evidence이며 production sidecar 변경은 포함하지 않는다. Archive 2.0은 이를
`BORDERLINE_ACCEPTABLE`로 추정하지 않고 자동출제에서 제외한다. 별도 Foundation
작업의 sidecar parity 해결 대상이다. source JS 또는 canonical metadata는 변경하지 않았다.

첫 projection: 462 exams / 11,226 source questions, registered identity missing 200,
metadata/source fingerprint gate HOLD 529, strict automatic 1,475. 이유별 수치는 중복될 수 있다.
과목 scope `수학_상/수학_하`와 metadata `수학(상)/수학(하)`는 명시적 표기 별칭으로
대조한다. legacy unit key를 canonical path로 매핑하는 규칙은 추가하지 않았다.

Node boundary 5/5 PASS. 로컬 실제 Chrome 계열 브라우저에서 source 20개 → 20문항
복원, canonical UID parity, SHA-256 source parity, 다음 회차 교집합 0을 확인했다.
UI 제품/assignment runtime 검증의 완료 선언은 아니다.
