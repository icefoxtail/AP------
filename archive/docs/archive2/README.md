# JS아카이브 2.0 정본 문서 인덱스

이 디렉터리는 JS아카이브 2.0의 방향, 계약, 분류, Studio 설계, 실제 코드
baseline을 한 묶음으로 관리하는 정본 저장소다. 이 문서 묶음은 Archive 2.0
기능을 이미 구현했다는 선언이 아니라, 기존 APMS/Archive 시스템을 어디까지
재사용하고 무엇을 새로 만들지 고정하는 문서다.

## 정확한 읽기 순서

README는 이 순서를 안내하는 인덱스이며, 본문 정본은 아래 순서로 읽는다.

1. `archive/docs/archive2/MASTERPLAN.md`
2. `archive/docs/archive2/CONTRACTS.md`
3. `archive/docs/archive2/TAXONOMY.md`
4. `archive/docs/archive2/STUDIO_PLAN.md`
5. `archive/docs/archive2/BASELINE.md`
6. `archive/docs/archive2/IMPLEMENTATION_STATUS.md`

`MASTERPLAN`은 제품 범위와 Phase 순서를 먼저 고정한다. `CONTRACTS`는 필드,
identity, selection, exclusion, history, snapshot의 공통 계약이다. `TAXONOMY`는
학년·교육과정·과목·단원 분류 규칙이다. `STUDIO_PLAN`은 교사용 제작 경험과
출력 handoff를 다룬다. 마지막으로 `BASELINE`에서 위 계획과 실제 저장소·remote
D1·배포 Worker·브라우저 동작의 차이를 확인하고, `IMPLEMENTATION_STATUS`에서
현재 Phase와 남은 진입 조건을 확인한다.

## Authority mapping

| 판단 대상 | Authority | 역할 |
|---|---|---|
| 제품 목표, Release 범위, Phase 의존성 | `MASTERPLAN.md` | 상위 제품 방향과 우선순위 |
| Identity / Selection / Assignment / History / Review 계약 | `CONTRACTS.md` | 필드명·UID·API·parity를 포함하는 공통 계약 |
| grade, curriculum, course family, unit crosswalk, 검색 분류 | `TAXONOMY.md` | 분류·탐색의 정본 |
| Studio 상태, 선택·교체·출력 UX, 시리즈 흐름 | `STUDIO_PLAN.md` | 교사용 제작 경험의 정본 |
| 실제 존재·부분 연결·부재·배포/데이터 증거 | `BASELINE.md` | 감사 시점의 사실 기록. 계획 문구를 실제 구현으로 승격하지 않음 |
| Phase 0 결과와 다음 진입 조건 | `IMPLEMENTATION_STATUS.md` | 상태 기록. 계약 자체를 재정의하지 않음 |

코드와 데이터의 세부 Authority는 다음처럼 연결한다.

| 영역 | 기존 Authority |
|---|---|
| archive exam/source catalog | `archive/db.js`, `archive/question-index.js`, 원본 `archive/exams/**/*.js` |
| canonical question identity | `archive/question-identity.js`, Worker `routes/exams.js`의 qid 계산식, `archive/data/question_identity_map.json` |
| approved question metadata | `archive/data/question_metadata.json` 및 `archive/question-meta.js` |
| 기존 단원별 기출 selection | `archive/unit-past-exams-core.js`와 `archive/unit-past-exams.js` |
| 고급 mixed selection | `archive/mixer-selector.js`, `archive/mixer.html` |
| 문제지/해설/정답 출력 | `archive/engine.html`, `archive/mixed_engine.html` 및 기존 render/print/solution/answer 모듈 |
| assignment, roster snapshot, exclusion, OMR | `class_exam_assignments`, `class_exam_assignment_recipients`, `class_exam_assignment_exclusions`, `exam_sessions`, `wrong_answers` 및 기존 Worker routes |
| 권한 | Worker의 `canAccessClass`, `canAccessStudent`, teacher/admin/session 검증 |

## 기존 시스템 중복 생성 금지 원칙

Archive 2.0은 기존 기능의 이름만 바꾼 별도 assignment·student·render 제품을
만들지 않는다.

- canonical assignment identity는 새 키가 아니라 기존 `class_exam_assignments.id`를 사용한다.
- 출제 대상은 새 recipient/exposure ledger가 아니라 기존 `class_exam_assignment_recipients - exclusions`를 사용한다.
- OMR 결과와 오답은 기존 `exam_sessions`·`wrong_answers`·Student Portal 흐름을 재사용한다.
- MIXED 시험의 content snapshot은 기존 `mixed_payload_json`과 `mixedMeta_*`를 재사용한다.
- PDF는 기존 assignment PDF artifact/R2 pipeline을 재사용한다.
- qid는 파일별 임의 ID, 문제 번호 기반 추정 ID, 브라우저 localStorage ID를 새로 만들지 않는다. canonical `qid_v1` 계약과 source file/ordinal 근거를 사용한다.
- 출력 렌더러, 권한 체계, Wrong Clinic, 기존 Mixer selector를 복제하지 않는다.
- 새 핵심 데이터는 학생×문항 ledger가 아니라 assignment와 canonical questionUid를 연결하는 additive bridge다.
- bridge나 legacy backfill에서 근거가 부족한 문제를 조용히 문제 번호로 추정하지 않는다. 결과는 `VERIFIED`, `LEGACY_INFERRED`, `UNRESOLVED`로 구분한다.

이 README의 Authority mapping은 문서 간 중복을 줄이기 위한 진입점이다.
실제 코드나 배포 데이터가 정본 문구와 다르면, 먼저 `BASELINE.md`에 증거를
기록하고, normative 문서 변경은 실제 충돌이 확인된 문장에 한해 최소화한다.
