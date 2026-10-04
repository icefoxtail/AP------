# Archive 2.0 Implementation Status

## 현재 상태

**RC2 — 원본 출제·대상 snapshot·split recovery 및 학생 포털 연결 개선. Production rollout 전.**

최신 검증 범위와 실제 사용 결과는 `RC2_REPORT.md`, 설계 근거는
`ADR-005-RC2-DELIVERY-LIFECYCLE.md`에 기록한다. 아래 RC1 기준 설명은 함께 적용하되
원본 저장·출력·부분 성공 처리는 ADR 005를 따른다.

- 작업 브랜치: `codex/archive2-longterm-20260916`
- 기반 main: `994ac4fd60c117e571ec79334e0d90b4f49bfa89`
- 기존 장기 브랜치 commit `c95108dcb99e062ff7842d171c754fa4a88b21d3`와 main ancestry 보존.
- main merge / production deploy / remote schema·data write: 수행하지 않음.
- 최종 검증과 제한은 `RC1_REPORT.md`, 재현 및 운영 절차는 `OPERATIONS.md` 참조.

## 구현된 제품

`workspace.html`의 기본 행동은 기출 선택 → 기존 반·학생 패널 → 원본 그대로 출제다.
기존 전체 기능 진입점을 유지한다. 추가 기능으로 canonical 단원·개념·유형 구성, 5단계 난이도,
문항 고정/재구성/교체/undo, 시리즈, 학생 history, draft 복원, 기존 출력 엔진을 연결한다.
현재까지 확인한 최소 기능을 통합 작업공간으로 재설계했으며 중요한 결정은 ADR 001~004에 남겼다.

디자인은 컴팩트한 행 목록, 문서 중심 미리보기, 목적별 도구 묶음, 차분한 타이포그래피와
색을 사용한다. 모바일에서는 출력·출제 행동을 하단에 유지한다.

## 서버 경계

기존 assignment UUID / recipients − exclusions / exam_blueprints / PDF / OMR /
wrong_answers를 재사용한다. 새 핵심 테이블은 assignment와 UID를 연결하는
`class_exam_assignment_questions`다. 50문항 persistence, retry, 동시 등록 충돌,
학생 OMR의 마지막 문제 번호→UID 연결을 실제 workerd/D1에서 확인했다.

새 endpoint는 `ARCHIVE2_ENABLED=true`와 migration·catalog 배포를 요구한다.
정상 PDF 생성은 기존 Browser Rendering/R2 경로를 사용한다. 로컬 fixture는
Browser binding이 없어 PDF 실패 및 저장 상태 보존/재시도를 검증했으며,
production PDF 생성 성공을 주장하지 않는다.

## Metadata Foundation 소비

HARD Authority:

- RPM Primary Taxonomy v1.0
- difficultyBucket 운영규칙 v1.3
- Metadata Contract v2

원본 source/identity/approved metadata는 수정하지 않고 projection만 생성했다.
현재 462 exams / 11,226문항 중 strict automatic은 1,475문항이다. main sidecar에
남은 `reviewed_pass + BORDERLINE_REVIEW` 968건을 임의 승인하지 않는다.
기존 64개 direct mapping 역시 canonical reviewed EXACT로 자동 승격하지 않는다.
UNKNOWN, HOLD, source drift, applicability 제외는 별도 사유로 표시한다.

## 검증 분리

자체 검증: critical source/metadata/selection/output/assignment/history/OMR 경계,
실제 교사 흐름, JSON backup/recovery, 모바일 접근성, 관련 Node contract,
Worker build/dry-run.

후속 검증: 사용자가 계획한 Luna Max 전체 legacy workflow 감사와 production
migration·backfill·PDF/R2 pilot. Phase 0 당시의 기존 결함·배포 schema 차이와
전체 감사 근거는 `BASELINE.md`에 보존한다.
