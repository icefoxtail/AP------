# 아카이브 엔진 업그레이드 계획서

작성일: 2026-08-31  
상태: 실행 계획 초안  
범위: `archive`의 단원별 출제·믹서·문제지 출력·학생 출제 흐름

## 0. 결정 요약

아카이브는 범용 학습지 편집기가 아니라 **아카이브 기반 문제지 오케스트레이터**로 발전시킨다.

교사가 단원·출처·소단원·난이도·문항 수를 지정하면 엔진이 검증된 문항을 deterministic하게 조합하고, 하나의 확정 결과를 미리보기·인쇄·정답/해설·학생 출제로 연결한다.

매스홀릭에서 가져올 것은 문항 선택 방식이 아니라 출력 계층이다.

- 문항 선택: 아카이브의 UID·메타데이터·난이도·출처 로직
- 결과 고정: 문제지 매니페스트
- 출력 설정: 제목·QR·답안·해설·페이지·디자인 프로필
- 실행: 기존 `mixed_engine.html`의 렌더·인쇄·학생 출제

이번 업그레이드의 1차 성공 기준은 “더 예쁜 생성기”가 아니라 **어느 진입점에서 출제해도 같은 조건이면 같은 결과와 근거가 나오는 것**이다.

## 1. 현재 상태와 핵심 문제

### 1.1 이미 확보한 기반

- canonical question UID와 원본 시험지 추적
- 소단원 키와 정규화 난이도 버킷
- 단원별 문항 집계와 가용 문항 수
- 부족 문항·인접 난이도·미분류 완화 처리
- deterministic seed 기반 선택 일부
- 시험지·정답표·해설지·QPP·QR 렌더링
- 일반 출력과 학생 출제 연결

### 1.2 업그레이드가 필요한 구조

| 영역 | 현재 상태 | 문제 |
|---|---|---|
| 단원 출제 | `unit-past-exams-core.js`의 `selectByBlueprint()` | 행 단위 선택 로직이 믹서 selector와 다름 |
| 믹서 | `mixer.html`의 자체 난이도/블루프린트 조합 | 같은 문제지 개념이 다른 경로로 구현됨 |
| 결과 저장 | `mixedQuestions_*` + `mixedMeta_*` | 문항 배열과 메타가 분리된 임시 payload |
| 식별자 | 단원 흐름은 해시 snapshot, 믹서는 `Date.now()` | 재현·재출제·이력 연결 기준이 일관되지 않음 |
| 출력 | `mixed_engine.html`에 기능 집중 | 출력 프로필이 출제 흐름과 분리되어 있지 않음 |
| 배치 | `splitIntoPapers()` 존재 | 여러 회차 전체의 중복·분포를 보장하는 manifest가 없음 |

근거 코드:

- 단원 선택: [`unit-past-exams.js`](<C:/Users/USER/Desktop/AP------/archive/unit-past-exams.js:750>)
- 단원 blueprint 선택: [`unit-past-exams-core.js`](<C:/Users/USER/Desktop/AP------/archive/unit-past-exams-core.js:905>)
- 믹서 선택: [`mixer.html`](<C:/Users/USER/Desktop/AP------/archive/mixer.html:1690>)
- 믹서 임시 payload 생성: [`mixer.html`](<C:/Users/USER/Desktop/AP------/archive/mixer.html:2342>)
- 출력 엔진 로드: [`mixed_engine.html`](<C:/Users/USER/Desktop/AP------/archive/mixed_engine.html:2573>)

## 2. 목표 아키텍처

```text
question-index / metadata
          ↓
Candidate Index
          ↓
Selection Engine
  hard constraint + scoring + shortage policy
          ↓
Selection Snapshot / Paper Manifest
  UID·근거·분포·seed·버전·paper 목록
          ↓
Output Profile
  문제지·답안·해설·QR·페이지·디자인
          ↓
mixed_engine
          ↓
미리보기 / 인쇄 / 학생 출제 / 이력
```

### 2.1 `PaperSpec`: 교사의 의도

```js
{
  schemaVersion: 'paper-spec-v1',
  source: {
    profileId,
    courseKey,
    unitKeys,
    subUnitKeys,
    scope,
    schoolKeys,
    yearMode,
    years,
    semester,
    examTypes
  },
  selection: {
    mode: 'quick|blueprint|collection|manual',
    blueprintRows,
    count,
    batchCount,
    seed,
    shortagePolicy: 'strict'
  },
  outputProfileId: 'default-exam',
  titleTokens: {}
}
```

### 2.2 `SelectionSnapshot`: 엔진이 확정한 결과

```js
{
  schemaVersion: 'selection-snapshot-v1',
  snapshotKey,
  spec,
  papers: [
    {
      paperKey,
      index,
      questionUids,
      count,
      sourceSummary,
      difficultySummary,
      subUnitSummary
    }
  ],
  diagnostics: {
    requestedCount,
    selectedCount,
    availableCount,
    shortage,
    relaxedItems,
    duplicateUids,
    distribution,
    qualityWarnings
  },
  provenance: {
    selectionSeed,
    selectorVersion,
    indexRevision,
    metadataRevision,
    generatedAt
  },
  status: 'draft|validated|previewed|printed|assigned'
}
```

### 2.3 `OutputProfile`: 매스홀릭에서 차용할 계층

문항을 다시 선택하지 않고 동일 snapshot을 여러 형태로 출력하기 위한 설정이다.

```js
{
  profileId,
  title,
  subtitle,
  date,
  round,
  outputs: { exam, answer, quickAnswer, solution },
  qr: { submit, solution },
  sourceLabels: { difficulty, textbook, exam },
  layout: { qpp, columns, order, margin, binding },
  theme: { templateKey, color, grid },
  header: { showNameLine, showScoreLine }
}
```

## 3. 단계별 실행 계획

### Phase 0 — 계약과 회귀선 확정

목표: 구현 전에 현재 동작을 고정하고 공통 데이터 계약을 확정한다.

작업:

- `PaperSpec`, `SelectionSnapshot`, `OutputProfile` schema 작성
- UID·source metadata·difficulty·subunit 필드의 canonical 이름 확정
- 기존 `mixedQuestions_*`, `mixedMeta_*`, `APMATH_UNIT_PAST_ASSIGN_*` 필드 매핑표 작성
- 현재 단원 출제·믹서·학교/연도 출제의 입력/출력 fixture 저장
- 문제지 수, 문항 수, UID 중복, source summary의 baseline 기록

완료 기준:

- 세 출제 경로를 같은 fixture로 비교할 수 있다.
- 기존 출력 결과를 깨지 않는 compatibility mapping이 정의된다.

### Phase 1 — 선택 엔진 통합

목표: 모든 출제 경로가 하나의 선택 계약을 사용하게 한다.

작업:

- `archive/selection-engine.js` 또는 `unit-past-exams-core.js`에 `selectPaper(spec, candidates)` 추가
- `ArchiveMixerSelector`의 hard constraint·score·검증 로직을 공통 API로 이동 또는 adapter화
- 기존 `selectByBlueprint()`는 compatibility wrapper로 유지
- 믹서의 `pickQuestionsByDifficulty()`와 `pickQuestionsByBlueprint()`를 공통 API 호출로 변경
- 단원 출제의 quick preset도 blueprint로 정규화한 뒤 동일 API 호출
- 결과에 `diagnostics`를 강제하고, 부족 상태에서 성공으로 위장하지 않도록 한다.

완료 기준:

- 단원·믹서가 동일한 selector version과 diagnostics 형식을 반환한다.
- 동일 후보·동일 spec·동일 seed에서 UID 순서가 동일하다.
- exact count, canonical UID 중복 없음, blueprint row 수량이 모두 검증된다.

### Phase 2 — 매니페스트와 재현성

목표: “이번에 만든 문제지”를 일회성 localStorage 배열이 아닌 복원 가능한 결과물로 만든다.

작업:

- `buildSnapshotKey()`를 공통 manifest ID 생성기로 승격
- 믹서의 `mix_${Date.now()}`를 content/spec/provenance 기반 키로 교체
- `SelectionSnapshot` 저장/로드 adapter 작성
- 기존 `mixedQuestions_*`, `mixedMeta_*`는 구버전 출력용으로 계속 생성
- `mixed_engine.html`은 manifest 우선, legacy payload 차선으로 읽도록 변경
- seed뿐 아니라 selector/index/metadata revision 저장
- URL에는 snapshot key와 output profile ID만 전달하도록 정리

완료 기준:

- 페이지 새로고침 후 같은 snapshot을 복원할 수 있다.
- “왜 이 문항이 선택됐는가”를 UID·조건·seed·버전으로 추적할 수 있다.
- 같은 snapshot에서 시험지·정답·해설을 생성해도 문항이 달라지지 않는다.

### Phase 3 — 출력 프로필과 미리보기 사이드바

목표: 매스홀릭의 강점을 아카이브의 확정 snapshot 위에 얹는다.

작업:

- 확인 단계의 `출제 요약`을 출력 설정 inspector로 확장
- 출력물: 문제지·정답표·빠른 정답·해설지
- 표시: 난이도·교재 출처·시험지 출처·QR
- 페이지: QPP·2단/3단·정렬·여백·양면/제본
- 표지: 제목·부제·날짜·회차
- 디자인: 소수의 template preset과 color/theme
- `기본`, `시험 대비`, `교사용 해설` 저장 preset
- 설정 변경 시 selection engine을 호출하지 않고 snapshot만 재렌더

완료 기준:

- 출력 설정 변경이 문항 UID를 바꾸지 않는다.
- 한 화면에서 선택 조건과 출력 결과를 구분해 확인할 수 있다.
- 미리보기와 실제 출력이 같은 output profile을 사용한다.

### Phase 4 — 회차·배치·이력

목표: 여러 장의 문제지를 운영 가능한 출제 단위로 만든다.

작업:

- `batchCount`, 회차별 seed, paper별 title/round 추가
- batch 내 UID 중복 방지
- 난이도·소단원·학교·연도 분포의 batch-level 검증
- 최근 출제 snapshot 기반 재출제 제외
- 학생 출제 시 manifest ID와 question UID를 이력에 연결
- 출력/배포 상태를 `validated → previewed → printed/assigned`로 기록

완료 기준:

- “3회분, 회차 간 중복 없음”을 엔진이 검증한다.
- 학생 출제 이력에서 사용된 snapshot과 문항을 복원할 수 있다.
- 일부 회차 부족 시 어떤 정책으로 보정했는지 표시된다.

### Phase 5 — 품질 게이트와 운영 안정화

목표: 데이터와 출력이 모두 신뢰 가능한 상태에서 릴리즈한다.

작업:

- 메타데이터 미분류·검토 필요·해설/이미지 누락 사전 경고
- manifest validation과 render validation 분리
- 실제 브라우저에서 단원·믹서·학교/연도 세 경로 회귀
- PDF/인쇄 레이아웃 golden fixture 추가
- legacy payload 제거 전 사용량과 오류 로그 확인

완료 기준:

- selector contract, manifest replay, render, assignment 회귀 테스트가 모두 통과한다.
- 브라우저 console error와 빈 preview가 없다.
- 출력 전 품질 경고가 숨겨지지 않는다.

## 4. 파일별 변경 범위

### P0 핵심

- `archive/unit-past-exams-core.js`: 공통 선택·진단·snapshot 생성
- `archive/mixer-selector.js`: 공통 selector contract와 adapter 정리
- `archive/unit-past-exams.js`: UI 상태를 `PaperSpec`으로 변환하고 manifest 호출
- `archive/mixer.html`: 자체 pick 로직을 공통 API 호출로 교체
- 신규 권장: `archive/paper-manifest.js` 또는 `archive/selection-engine.js`

### P1 출력

- `archive/mixed_engine.html`: manifest/output profile 우선 로드
- `archive/unit-past-exams.html`, `unit-past-exams.css`: 확인 단계 inspector와 preset UI
- `archive/native_print.js`, `print_image_optimizer.js`: 프로필 옵션을 받는 최소 adapter

### P2 운영

- 학생 출제/출제 이력 연결부
- 최근 snapshot·재출제 제외 저장소
- `tests/archive-paper-manifest.test.js`
- `tests/archive-selection-engine-contract.test.js`
- `tests/archive-output-profile.test.js`
- `tests/archive-paper-batch.test.js`
- 기존 브라우저 QA fixture 확장

## 5. 테스트 계획

### 선택 엔진

- 동일 입력·seed 재현성
- 서로 다른 seed 결과 차이
- exact count
- canonical UID 중복 방지
- blueprint row별 수량 보장
- 난이도·소단원·학교·연도 분포 검증
- 부족 문항 사유와 완화 결과 검증
- 미분류 문항 기본 제외

### 매니페스트

- serialize/deserialize 왕복
- snapshot key 안정성
- selector/index/metadata revision 불일치 경고
- 여러 paper의 UID 중복 방지
- legacy payload compatibility

### 출력

- 동일 snapshot의 exam/answer/solution UID 일치
- output profile 변경 시 UID 불변
- QPP·2단/3단·QR·헤더 적용
- 이미지·수식·서술형 레이아웃 회귀
- preview 모드에서 외부 등록/이력 write가 발생하지 않음

### 브라우저

- 단원 출제 → 미리보기 → 출력
- 믹서 자동출제 → 미리보기 → 학생 출제
- 학교·연도 지정 → 학교별/통합 출력
- 새로고침·뒤로가기·새 탭 복원
- 320px/768px/데스크톱 레이아웃

현재 관련 핵심 테스트 16개는 통과 상태이며, 이 계획은 그 회귀선을 유지하면서 공통 계약 테스트를 추가하는 방향이다.

## 6. 마이그레이션 원칙

1. 새 선택 엔진을 먼저 adapter로 도입한다.
2. 기존 UI와 `mixed_engine.html`을 바로 폐기하지 않는다.
3. manifest에서 legacy `mixedQuestions_*`와 `mixedMeta_*`를 생성해 출력 호환성을 유지한다.
4. 단원 출제 경로를 먼저 공통 API로 전환한다.
5. 믹서 전환 후 두 경로의 fixture 결과를 비교한다.
6. 출력 프로필을 붙인 뒤에만 기존 임시 payload 의존을 줄인다.
7. 충분한 회귀 확인 후 legacy localStorage 포맷을 제거한다.

## 7. 하지 않을 것

- 템플릿 수를 먼저 늘리지 않는다.
- 선택 엔진 통합 전 필터와 옵션을 더 추가하지 않는다.
- 새 문제지 렌더러를 만들지 않는다.
- 디자인 설정이 문항 선택 결과를 바꾸게 하지 않는다.
- 메타데이터·snapshot 계약이 안정되기 전에 AI 개인화 출제를 우선하지 않는다.

## 8. 최종 릴리즈 판단 기준

다음 다섯 문장에 모두 “예”라고 답할 수 있을 때 1차 업그레이드를 완료한다.

1. 단원별 출제와 믹서가 같은 선택 엔진을 사용하는가?
2. 같은 `PaperSpec`과 seed로 같은 UID 결과를 재현할 수 있는가?
3. 선택 결과가 하나의 manifest로 미리보기·출력·학생 출제에 공유되는가?
4. 출력 설정을 바꿔도 문항 선택 결과가 변하지 않는가?
5. 부족·중복·미분류·출처 문제를 출력 전에 설명할 수 있는가?

이 다섯 가지가 충족되면 매스홀릭식 출력 사이드바와 저장 템플릿은 안전하게 확장할 수 있다. 그 전에는 UI 확장보다 엔진 계약 통합이 우선이다.
