# Archive 2.0 RC1 — 구현 및 자체 검증

검증일: 2026-09-16 · 기준 main: `994ac4fd60c117e571ec79334e0d90b4f49bfa89`

## 판정 범위

**로컬 Release Candidate.** 교사용 작업공간과 새 assignment 경계의 자체 runtime
검증을 완료했다. production 배포, remote migration/backfill, main merge는 수행하지
않았다. 전체 legacy workflow 전수회귀는 사용자 지시대로 별도 Luna Max 감사 범위다.

## 구현

- 기본 행동은 기출 제목/`바로 출제` → 기존 반·학생 패널 → 원본 그대로 출제다. 기존 전체 기능 진입점을 유지한다(ADR 004).
- `archive/workspace.html`: 자료 찾기, 문제지 구성, 최근 작업, 데이터 상태를 공유 state로 연결.
- RPM canonical 전체 경로와 numeric difficulty 4-field 소비. legacy level 자동 변환 없음.
- 교육과정·과목·학교·연도·시험 시기·과목 계열 및 canonical 개념/유형 검색.
- 단원별 균등/직접 배분/전체 pool/조건 일치 전부, 50문항 기준 분할, 생성 전 shortage 표시.
- 고정·재구성, 실제 preview 문항 클릭 교체, undo, sealed 회차와 다음 회차 UID 제외.
- APMS 반/학생 조회, 여러 학생 history UNION, 이력 실패 시 차단, 최종 등록 직전 재검증.
- autosave/recovery/JSON export-import, URL Finder 복원, source fingerprint 변경 시 복원 차단.
- 기존 MIXED renderer로 문제·해설·정답 출력. embedded preview의 독립 편집/인쇄 우회 UI 제거.
- 기존 assignment UUID, recipients/exclusions, exam_blueprints, OMR/wrong_answers, PDF/R2 재사용.
- additive question bridge, atomic snapshot write, 동시 이력 충돌 rollback, immutable retry.
- 원본 시험의 blueprint count/UID/ordinal/source hash 검증 및 80문항 assignment 상한.
- 읽기 전용 legacy reconciliation 및 검토용 SQL 생성. 자동 적용 기능 없음.
- 명시적 pilot entry `archive/index.html?archive2=1`. flag 없이 기존 Archive 진입점 유지.

## 자체 runtime 증거

| 경계 | 확인 결과 |
|---|---|
| 실제 원본 파일 격리 | 20개 서로 다른 source → 20문항 복원, fingerprint/UID PASS |
| 다중 단원 | 2015 수학(하), 5개 L2 × difficulty 2·3 각 10 = 50, UID unique 50 |
| Pin/rebuild | 43개 유지, 신규 7개, 이전 비고정 문항 재사용 0 |
| 출력 parity | 선택 목록과 실제 문제지 DOM의 ordered UID 50/50 일치 |
| 해설/정답 | 해설 unique source refs 50, 정답 cells 50, 모든 선택 UID 포함 |
| Header | 입력 제목과 실제 출력 header 일치 |
| 교체/undo | 50개 중 1개 교체, undo 후 전체 ordered UID 원상 복원 |
| JSON | 실제 다운로드 파일 50개 UID/fingerprint 일치, 해당 파일 재import PASS |
| Review HARD | 같은 과목이지만 선택 L2 밖인 문항을 넣은 pool draft의 출력 차단 |
| 이력 UI | 합성 학생에게 10문항 저장 → 서버 이력 10 → 다음 회차 신규 9, 교집합 0 |
| 부족 UI | 다음 회차 요청 10/신규 가능 9에서 생성 차단, 수량 9로 명시 조정 후 생성 |
| API 권한 | 미인증 401, 권한 밖 학생 403, 기존 canAccessClass/StudentsBatch 사용 |
| 원본 출제 UI/API | 19문항 원본 → 기존 반 선택 → 1명 포함/1명 제외 → 실제 기존 API 저장. PDF 실패 후에도 제외 저장, 재시도 UUID 동일 |
| DB persistence | actual workerd + D1에서 normal/MIXED, retry, recipient/exclusion, UID parity PASS |
| 동시 등록 | 같은 학생/문항의 동시 배부에서 한 건만 commit |
| Legacy coverage | 빈 candidate 교집합에서도 inferred 1 + unresolved 2 보존 |
| OMR | 기존 Student Portal route로 제출. 50번 오답이 bridge의 50번째 canonical UID와 일치 |
| 모바일 | 390px viewport에서 document width/scrollWidth 모두 375px, 하단 행동 버튼 접근 가능 |

테스트 명령:

```text
node --test tests/archive2-core.test.cjs tests/archive-mixer-selector-contract.test.js tests/archive-question-identity-runtime.test.mjs tests/archive-question-metadata-consistency.test.mjs
node tests/archive2-worker-runtime.mjs
node archive/tools/build-archive2-catalog.mjs --check
node archive/tools/build-archive2-crosswalk-inventory.mjs --check
cd apmath/worker-backup/worker && npm run check
git diff --check
```

selected Node/legacy contract 검증 9/9 PASS. Worker의 actual workerd/D1 시나리오 PASS.
Wrangler deploy dry-run PASS. 테스트가 관찰한 동작을 production 전체 검증으로 확대하지 않는다.

## 검증 중 수정한 경계 결함

- 후보별로 전체 구성 계획을 다시 계산하던 반복 작업 제거. 실제 과목 변경 응답 회복.
- 고정/Inspector 변경 시 preview 재로드 제거.
- 오래된 비동기 preview 응답이 새 화면을 덮지 않도록 token 검증.
- Windows CRLF와 배포 LF 차이를 raw source hash에서 정규화.
- D1 compound SELECT 제한을 피하도록 bounded multi-row VALUES 사용.
- strict assignment와 기존 exam_blueprints를 같은 batch에 저장하고 legacy 재작성 차단.
- 등록/PDF 준비 중 editor를 inert로 잠가 대상·내용이 바뀌지 않도록 처리.

## 현재 데이터의 정직한 범위

catalog: 462 exams / 11,226 source questions / metadata records 11,034.
strict automatic 1,475. 이유별 수치는 중복될 수 있다.

- identity 미등록 200
- metadata/source 확인 필요 529
- canonical 경로 미분류 8,782
- difficulty gate 9,750 (미분류와 검수 상태를 포함)
- source metadata 충돌 25
- source/course grade 충돌 15

main의 검수 candidate 정정과 production sidecar는 완전히 같지 않다. 현재 source와
연결되는 `reviewed_pass + BORDERLINE_REVIEW`가 968건 남아 있다. RC는 이를
임의로 `BORDERLINE_ACCEPTABLE`로 바꾸지 않고 제외한다. Metadata Foundation의
sidecar parity 후속 작업이 필요하다. 기존 source JS와 canonical metadata는 변경하지 않았다.

기존 direct mapping은 64건이며 canonical reviewed EXACT는 0건이다. `ADR-003`에
따라 계열 탐색과 단일 교육과정 구성을 제공하며, 검수되지 않은 자동 혼합은 비활성이다.

## 운영 서버 재확인 — read only

- Worker version: `72e9b994-7e8e-4ddb-b9ab-25abb676e6ef`, 2026-09-14 배포 유지.
- 검사 당시 assignment 166 / recipient snapshot 992 / exclusions 93.
- 신규 question bridge table 없음.
- reconciliation: expected question occurrences 4,228 / canonical에 연결 3,311 / unresolved 917.
- raw recipient snapshot timing: verified 289 / legacy inferred 695 / unresolved 8.
- Wrangler 응답 `changes=0`, `rows_written=0`. 원시 export와 SQL candidate는 `.tmp/archive2/`에만 보관.

## 배포 전 남은 운영 조건

로컬 fixture에는 Cloudflare Browser Rendering binding이 없다. 따라서 PDF 생성은
예상 실패이며 `saved=true + assignment.id + PDF 실패` 반환과 동일 배부 재시도를
검증했다. **실제 Browser Rendering → R2 PDF 생성 성공은 이 로컬 검증의 PASS 항목이 아니다.**

기존 원본 blueprint의 Worker-side JS 평가 fallback은 workerd에서
`Code generation from strings disallowed`로 실패했다. assignment 저장/제외/재시도는
완료됐지만 이 legacy fallback의 blueprint 생성 성공은 주장하지 않는다. 기존 원본
engine의 blueprint 등록 및 실제 PDF 출력까지의 전수회귀는 Luna 감사에서 확인해야 한다.

운영 활성화에는 새 migration, 배포된 catalog/Worker, `ARCHIVE2_ENABLED=true`,
검토한 legacy backfill, 기존 PDF binding과 실제 PDF 생성 확인이 필요하다.
main merge와 이 운영 적용은 사용자 승인 및 예정된 Luna Max 감사 이후에 수행한다.

원본 시험 JS/SVG/content/choices/answer/solution 변경: 0.
