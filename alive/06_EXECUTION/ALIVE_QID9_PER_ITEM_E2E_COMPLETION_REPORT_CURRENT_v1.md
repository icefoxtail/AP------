# ALIVE QID9 — 원본 qid별 9문항 End-to-End 완료보고서 강제계약 v1.0

> **2026-10-17 원장 직접 지시 / CURRENT HARD / 수동 QID9 제작 라인 적용**
>
> **핵심 명령: 「1번 진행해」 = 원본 q01의 A1~C3 9문항을 각각 실제 생성하고, 정확한 메타·난이도·해설·시각자료를 완성한 뒤, 별도 독립 품질검수와 실제 브라우저 검사를 통과하고, 9개의 문항별 수행 보고서와 qid 종합 영수증을 제출하라는 뜻이다.** 이것이 안 되면 q01은 **실패(QID_INCOMPLETE)** 이며 q02로 넘어갈 수 없다. q02도 동일하다.

문서를 작성했거나 ZIP을 묶었다는 사실 자체는 문항 완료 증거가 아니다. 이 문서는 기존 정본을 **대체하지 않고**, 현재 수동 QID9 작업에서 **원본 qid별 보고·완료 선언·다음 qid 진입**에 대해 더 엄격한 종료 조건을 명시한다. 기존 `CREATE` 후보 저장과 최종 `QID_E2E_COMPLETE`를 혼동하지 않는다. `QID_E2E_COMPLETE`/`QID_INCOMPLETE`는 **보고서 판정용 표기**이며 기존 런타임 enum에 임의 추가하지 않는다.

## 0. 범위·우선순위와 예외 경계

- 적용: ALIVE/Generated **수동 QID9 한 원본 qid → A1,A2,A3,B1,B2,B3,C1,C2,C3** 신규 9문항. 사용자의 `1번`, `2번`, `3번 진행해`는 별도 단계 지시가 없으면 **qid 하나를 E2E 완료하는 요청**이다.
- 미적용: 별도 `SOURCE_ONLY_INTAKE14_20261016` 등 **예약형 Library CREATE→R1→R2→R3→MASTER 라우팅**. 예약 단계별 자료 인계는 그 캠페인 고유 계약을 따른다. 예약의 ROUTED는 품질 PASS가 아니다. 이 보고서를 예약자 임의 HOLD·인계 차단 규정으로 전용하지 않는다.
- 근거: Notion 「GPT 작업 전 필독 라우터」, 「Archive 전체 작업 생명주기」, 「GPT 유사·변형 문항 생성 5단계」, 「GPT QID9 유사문항 제작 표준계약 CURRENT」와 Git `AGENTS.md`, `alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md`, `alive/06_EXECUTION/GPT_QID9_CREATE_HANDOFF_TEMPLATE_CURRENT.md`, `docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md`, `docs/architecture/Problem_Bank_Unified_Meta_Assessment_Contract_CURRENT_v1.md`, 관련 Golden/Visual/해설/교육과정/Meta·검수/학생 Consumer 정본. 대상 문서와 **실제 최신 내용·SHA·적용 조항**을 작업 시작 때 기록한다.
- 형님이 수동 제작의 **마감 범위**를 정하는 최신 지시가 우선한다. 형님이 별도로 `검수하고 main 반영`을 명시하여 기존 `USER_DIRECTED_QUALITY_APPROVED`를 적용하는 경우에도 독립검수를 수행했다고 속일 수 없다. **단순 `n번 진행해`는 독립검수 면제나 품질 승인 지시가 아니다.** 독립검수 생략은 해당 UID에 대한 원장의 명시적 별도 지시가 있을 때만 실제 승인 근거와 `NOT_RUN/USER_WAIVER`를 구분해 기록하며, 무증거 자동 완료로 바꾸지 않는다.
- Git main 병합·공개 배포는 사용자가 요청한 시점에 별도 수행할 수 있다. 다만 **분리된 격리/스테이징 환경에서도 최종 학생용 실물의 문항·해설·정답·이미지·출력 브라우저 E2E를 완료하지 못하면 qid 완료 선언 금지**. 정식 배포까지 지시받았다면 실제 main·배포·원격 readback·학생 화면 재검사까지 마감한다.
- 이미 승인된 다른 qid·원본·기존 유사문제는 보호한다. 실패 시 현재 실패 UID와 필수 직접 의존만 고치고, 유효한 기존 PASS 근거는 같은 SHA라면 재사용한다.

## 1. 단일 qid 강제 작업 순서 — 모든 단계의 결과를 문항별로 증명

### G0. 작업 전 읽기·원본 Source Lock

1. Notion 라우터/생명주기/생성 5단계 및 Git `AGENTS`·QID9·Meta·Visual·해설·Golden·교육과정·검사/Consumer 계약을 **실제 본문**에서 읽는다. 보고서에 경로, 정본 버전/SHA, 적용한 핵심 규칙, 충돌·우선순위를 기입한다.
2. 최신 main, 대상 시험지 원본 JS와 원본 qid의 `content/choices/answer/solution` 및 문제/해설 그림, sourceUid·ordinal/id 매핑, Git Blob SHA와 **원본 raw SHA-256**, 기존 QID9 및 격리 인벤토리·중복 UID를 확인한다. 원본을 제작자가 직접 풀고 정답을 확인한다.
3. Source Lock이 `PASS`가 아니면 qid 신규 생성 완료를 선언할 수 없다. `PARTIAL`/`NOT_VERIFIED`를 허용한 채 다음 번호를 만드는 것은 실패다.

### G1. 9문항 생성·5축 설계·학생용 실물

각 UID마다 별도 설계와 최종 증거를 남긴다.

1. **원본 개념**: 고정 Primary RPM L3·결정적 사고·경계조건·학년 교육과정, 원본 충실형인지 L3 확장형인지, A/B/C 추가 사고·Blueprint 다양성·반복 여부.
2. **최종 학생 입력**: 자연스러운 발문, 조건 충분성/불필요조건 여부, 객관식 보기 5개(중복·다중 정답 없음), 정답 1개 및 **정답 유일성의 직접 풀이**.
3. **오답 4개**: 보기 번호별로 실제 잘못된 출발 → 오류 단계 → 산출 결과 → 최종 해당 보기의 일대일 재현 증거. `4/4`가 아니면 실패. 전체 qid 45개 보기·36개 오답 전수.
4. **학생 해설**: 필수 중간식·논리 연결·조건을 쓰는 이유·분기/경계·결론이 정답 번호와 일치. 학생이 해설만으로 재현할 수 있는지 확인. 작은 칠판에 스스로 설명할 수 없는 점프는 보완.
5. **수학 난이도 독립판정**: `level=하/중/상`과 `difficultyBucket=1~5`를 각각 최종 발문·사고 단계·함정·조건 수·계산 부담에 근거하여 판정. **A/B/C 순서→난이도 자동 매핑, 하→1·중→3 같은 환산 금지**. 서로 다른 선정 이유·반례를 문항별 기록.
6. **문항별 5축 Meta·근거**: 정확한 RPM **L1/L2/L3/L4(Primary L3/L4, 정본 parent·namespace·권위)**, PT/TPL (`problemTypeKey/templateKey`), CrossConcept, Condition, IntegrationPattern, 원본 sourceQid/UID·provenance, 교육과정, SVG 문제/해설 두 축. 실제 최종 풀이의 어느 단계에서 쓰이는지 적는다. 미적용은 **검증된 비적용 이유와 함께** `[]`/`NONE`; 미확정은 구체적 `EVIDENCE_DEBT`이며 확정으로 가장하지 않는다. 기존 키 우선·정당한 Generated-only 확장 등록·RPM LOCKED 보호.
7. **시각자료 2축 독립 판정**: 문제 SVG와 해설 SVG를 각각 `ADD/REUSE/EXEMPT` 등 적용 정본의 판정으로 기록. 필수이면 실제 SVG 파일·좌표/원시 도형·레이블·열림/닫힘·SHA·학생 렌더 검증 필수. 필요 없는 경우 구체적 수학·교육 근거. 문제 TEXT_ONLY라고 해설 SVG를 자동 면제하지 않는다.
8. **Reverse Stem Check**: 마지막 학생 입력만 읽고 문제 의도·원본 L3 필수성·우회 풀이·모호한 해석·출제 자연성을 복원. `KEEP/REVISED`와 전후 영향 검사 결과 기록. 결함이면 수정 후 새 최종 SHA로 다시 검수한다.

### G2. 세로 정답 누적 배분 — 사용자 최신 지시

- **A1~C3 각 슬롯별로 앞선 qid의 ①~⑤ 사용 이력을 따로 누적**한다. 예컨대 q02 A1은 q01 A1과 비교하지 q02 안의 A2·B1과 비교하지 않는다.
- 정답 분포는 **세로 9개 슬롯의 장기 균형을 우선**한다. 가능한 답 위치 가운데 세로 빈도 편차를 최소화하고, 동률 후보는 무작위로 선택하되 실행 seed/후보·결과를 기록한다. 이전 qid와 같은 패턴 강제 회피나 가로 `2/2/2/2/1` 강제 분포를 이 작업의 새 사용자 지시에 반하여 적용하지 않는다.
- 정답 숫자를 만들기 위해 수학 값·발문을 변조할 수 없고, 수학적으로 검증된 선택지의 **순서만** 재배열한다. 고정 보기 순서와 불가능한 제약은 실제 근거를 기록한다.
- 선지 재배열 후 45개 선지, 9개 정답, 36개 오답 번호·해설 결론·Meta/Receipt 및 q01~현재 세로 누적표를 **최종 파일에서 새로** 검증. 배분 최적화만으로 문항 품질 PASS라고 주장하지 않는다.
- 구 Notion/Git QID9 정본의 가로 HARD와 상충하는 지점은 **원장 2026-10-16~17 최신 직접 지시에 따른 본 수동 작업 범위의 우선 적용/상충 기록**으로 남긴다. 다른 실행기의 기존 검사기를 몰래 개조하거나 실패를 PASS로 조작하지 않는다. 구 검사기는 현재 규칙과 충돌 시 `CONTRACT_CONFLICT` 및 영향 범위를 보고하고 적법한 정본 개정/검사기 업데이트를 별도 처리한다.

### G3. 영구 Meta 저장·UID parity

- 9개 UID 모두 **설계표 작성만으로 완료 금지**. 최종 지원 스키마의 Source JS/metadata 또는 sidecar/Meta Foundation·Generated registry에 UID별 저장하고 **Consumer/DB 및 index/통합 검색 projection까지** 동일 의미의 Meta가 유지되는지 실제 파일/값으로 대조한다.
- 검증 대상: `UID, examId, sourceQid, variant/slot, original provenance, source hash`, `RPM L1~L4/Primary L3/L4/parent`, `PT/TPL`, `CrossConcept/Condition/Integration`, `level`, `difficultyBucket`, standardUnit/subUnit, answer, assets, approval 상태.
- **학생 조회 제품의 L2 storage bucket과 의미상 RPM L2를 혼동 금지.** Consumer/index가 아직 없는 격리본은 대체 가능한 실제 스테이징 projection을 구축·검사하거나 `NOT_RUN`으로 기록한다. 별도 Blueprint에만 있고 학생용 UID와 연결되지 않은 메타는 `META_PERSISTENCE_FAIL`.
- 구조 검사는 실제 도구/명령·입력 SHA·stdout/result와 검증한 현재 파일 범위까지 기록한다. 실행하지 않은 Node/Golden/Negative·메타 검사기 `PASS` 금지.

### G4. 저자 자기검수와 **별도 독립 품질검수**

- **저자 self-check**: 최종 9 UID 전원 발문·정답 유일성·전체 선택지·학생 풀이·오답4·메타·난이도·교육과정·SVG·역발문을 직접 확인. 자기검수 결과는 **독립 검수 PASS가 아니다**.
- **독립 품질검수**: 제작자와 다른 독립 검수자/세션이 **동결된 최종 학생 입력과 실제 저장된 정답·해설·메타·필요한 SVG**를 열고 전 9문항을 확인. 학생에게 보이는 한국어 발문을 우선 점검하고 직접 계산·논리/조건·유일성·해설·선지·난이도/정본 Meta·시각 정합을 대조한다. 의심·고위험은 독립 재풀이/경계값 점검. Generated의 공개답 검수 방식을 유지하며 원본 R1 blind 강제와 혼동하지 않는다.
- 독립성 증거: 검수자/모델·세션 ID, 검수 시작/종료, 입력 파일 ID·**SHA-256**, 이전 작성 정보 접근 여부, 독립 판정의 개별 UID 결과. 저자와 같은 주체의 재독해를 ‘독립’이라고 기재하지 않는다.
- 독립 검수 FAIL UID는 수정 담당이 고치고 **수정된 최종 SHA에 대하여 영향받은 검수부터 재실행**한다. 다른 8개 정상 UID의 유효 증거까지 무조건 지우지는 않는다.

### G5. 실제 브라우저 — 문항별 학생 체험과 전체 qid 화면

- **최종 소스·Consumer·메타·에셋과 실제 동일한 아티팩트**를 지원 런타임/브라우저(Chrome 등)에서 열고, 신규 9개 각각을 학생처럼 확인한다. HTML 스냅샷 문자열 확인, JS 파싱, DOM 로드만으로 PASS 불가.
- 9 UID 각각에 대해: **문제/보기·수학식·정답/정답표·상세 해설·문제 이미지·해설 SVG·폰트/MathJax·모바일/데스크톱 레이아웃·잘림/겹침·인쇄 미리보기/출력**의 적용 여부, 실제 확인 결과와 URL/파일·viewport·캡처/리포트 SHA를 적는다. 해당 없는 화면/그림은 실제 근거로 `NOT_APPLICABLE` 판정.
- 전체 qid의 **exam/solution/answer** 화면, 끝 문항 및 마지막 페이지, 전체 문항 수/정답표/페이지 분할/이미지 로딩과 **선택→보기→인쇄** 경로를 확인. 필요한 경우 별도 캡처 수집자와 검수자의 독립성을 공통 계약에 맞춰 보존.
- 브라우저를 열지 않았거나 렌더 증거가 없으면 `BROWSER_NOT_RUN`이며 해당 UID와 **전체 qid 모두 미완료**. 수정·에셋 교체·Meta projection 변경 뒤 이전 화면 증거가 stale이면 현재 입력으로 다시 확인한다.
- 격리/스테이징 렌더 검사는 qid 제작 마감의 조건. 사용자 요청에 따라 후속 main 병합·배포를 진행할 경우 **배포된 학생 화면의 원격 readback/실제 Chrome 재검사**는 별도 `RELEASE` 게이트로 끝까지 책임진다. 격리 PASS를 배포 PASS로 둔갑 금지.

### G6. 독립 보고서 작성·합산·다음 qid 제어

- `QID_E2E_REPORT.md` 또는 동등한 1개 보고서에 **A1~C3 9개 개별 문항 보고**를 빠짐없이 넣는다. 아래 §3 템플릿은 9개 슬롯에 **각각 실제 내용**을 채운다. `A1~C3 모두 PASS`처럼 한 문장/표 하나로 대체 불가.
- 각 UID에는 **무엇을 제작했고 어떤 정본/코드/검사로 어떻게 확인했으며, 어떤 결함을 어떻게 고쳤고, 독립 검수자·브라우저에서 무엇을 실제 확인했는지** 기재한다. 증거는 final SHA/실제 파일 경로·Drive Evidence Vault ID·URL 등으로 검증 가능해야 한다. 비프로덕션 캡처/로그/중간 보고서는 Git production 루트에 무차별 커밋하지 않고 현행 Evidence Vault/격리 인벤토리에 보관한다.
- 최종 qid 요약, 9/9 완전성, 에러/미실행 0 여부, 원본/기존 QID 보호, 세로 분포 전후, 다음 qid 진입 판정을 명시한다. 실패 상태로 q03 생성 등 다음 qid 진입 금지.

## 2. 성공/실패 자동 판정 원칙 — 한 문항이라도 빠지면 qid 전체 실패

### 문항 UID 하나의 완료 조건

`ITEM_E2E_PASS`는 아래가 **동일 최종 artifact/SHA**에 결속된 경우에만 성립한다.

1. `SOURCE_LOCK` 원본 qid와 생성 UID의 일대일 출처 및 보호 확인.
2. `CONTENT_MATH` 발문 자연성·조건·정답 유일성·보기 5개·학생 해설·오답 4/4의 수학 품질 확인.
3. `5_AXIS_META` 두 난이도 축·RPM L1~L4/Primary·PT/TPL·Cross/Condition/Integration·교육과정·원본 관계·양쪽 SVG의 실제 근거 확인.
4. `META_PERSISTENCE` 최종 지원 source/sidecar/registry→실제 Consumer/DB→index UID별 parity 확인.
5. `AUTHOR_RECHECK` 최종 Reverse Stem + 수정 영향 재검 PASS.
6. `INDEPENDENT_QUALITY` 실제 별도 검수 결과 PASS (혹은 원장이 해당 UID의 별도 면제를 **명시**한 경우에만 면제 사실을 구분 기록; `INDEPENDENT_PASS`로 위장 금지).
7. `BROWSER` 실제 학생용 문제·해설·정답·그림/수식·화면/출력 확인 PASS 또는 검증된 항목별 비적용.
8. `EVIDENCE_REPORT` **해당 UID의 아래 개별 보고서** 완전 작성, 최종 SHA·실제 검증 경로 제공.

### 원본 qid 하나의 완료 조건

```
QID_E2E_COMPLETE  ⇔
  sourceLock == PASS
  AND 9 distinct slots/UID == A1..C3
  AND count(ITEM_E2E_PASS) == 9
  AND qid vertical ledger checked == PASS
  AND whole-qid real browser exam/solution/answer/print == PASS
  AND final source/meta/consumer/index/asset SHA parity == PASS
  AND per-UID reports == 9/9
  AND unresolved ERROR/DEBT/FAIL/NOT_RUN/STALE == 0
  AND existing protected qids/source unchanged == PASS
```

- 위 중 **하나라도 빠지면 결과는 `QID_INCOMPLETE / FAIL`**. 작업자에게는 구체적 오류·수정 담당·재시도 시작점이 기록된다. `AUTHOR_DONE`, `9 CREATED`, `ZIP READY`, `SELF_CHECKED`, `META PLANNED`, `BROWSER PLAN`은 모두 `QID_E2E_COMPLETE`가 아니다.
- **실패를 성공으로 축약 보고 금지**: `NOT_RUN`을 `PASS`로, `EVIDENCE_DEBT`를 `NONE`으로, 제작자 확인을 `INDEPENDENT`로, 정적 화면 점검을 `BROWSER`로 표현 금지.
- **다음 qid 절대 진입 차단**: `q01 QID_INCOMPLETE`이면 `q02 START` 금지. 이미 잘못 생성된 후속 초안이 있어도 기존 초안을 폐기하지 않고 `UNVERIFIED_CANDIDATE / BLOCKED_FOR_CLOSURE`로 보호, 앞선 qid 9/9 E2E 마감 후 재개한다. 실패 시 원래 qid의 오류 UID만 **직접 수정 → 영향 검사 재수행 → 9/9 마감**한다. 별도 요청 없이 '다음부터 주의'로 넘어가지 않는다.
- 사용자가 그 자리에서 전부 마감하기 어려운 실행 환경을 제공한 경우에도 **수행한 범위와 기술적 장애를 정확히 기록하고 실패/미완료로 보고**한다. 불가능한 독립 검사나 브라우저를 가상으로 진행했다고 꾸미지 않는다.

## 3. 제출 필수 템플릿 — 9개 문항별 상세 보고서

> 아래 1~22번을 **A1,A2,A3,B1,B2,B3,C1,C2,C3 각각 별도 구획**에 실제 증거로 기입한다. 단순 `PASS`만 적지 말고, 판정 이유 및 증거 위치를 함께 적는다. 누락/공란/`추후 입력`이 하나라도 필수 항목이면 해당 문항 실패. 실제 해당 없음은 적용 판단의 이유가 있는 경우에만 인정한다.

### [시험지 / 원본 qid] QID E2E 진행·최종 보고

- 시험지/연도/학기/학년/원본 `sourceQid`: `...`
- 요청 원문 및 완료 범위: `...` (예: **1번 진행해 = q01 A1~C3 9문항 E2E**)
- 작업 구분: `수동 QID9` / 예약 Library 비적용 확인: `...`
- 최신 main SHA / 격리 인벤토리 및 source path: `...`
- Source Lock: `sourceUid`, ordinal/id, original Git blob, raw SHA256, 원문 정답 직접 풀이, 관련 그림 SHA, 보호/중복 확인: `...`
- 적용 정본·SHA·읽은 범위 / 상충 규칙과 최신 지시 적용: `...`
- QID 파일·최종 SHA / Meta·Consumer·index 경로·SHA / 에셋·브라우저 evidence: `...`
- qid 세로 누적 비교(각 슬롯 q01~직전 및 이번, ①~⑤ 빈도·목적함수·랜덤 seed): `...`
- **9개 UID 판정표:**

| 슬롯 | UID | 최종 SHA | 수학·오답4 | 난도·5축 Meta | Meta 영구저장 | 독립 품질검수 | 실제 브라우저 | 개별 보고 | ITEM_E2E_PASS |
|---|---|---|---|---|---|---|---|---|---|
| A1 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| A2 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| A3 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| B1 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| B2 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| B3 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| C1 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| C2 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| C3 | ... | ... | ... | ... | ... | ... | ... | ... | ... |

#### [슬롯·UID] — 문항별 개별 실행·검수 상세(필수 9회 반복)

1. **Identity**: 슬롯/UID, 시험지, 원본 sourceUid/sourceQid, 생성 variant/family, final JS 경로·파일/항목 SHA, 제작자·날짜.
2. **원본 L3·교과과정**: 원본 핵심 평가 사고·정답 확인·Primary RPM L3 LOCK·학년 허용 풀이; 원본 유지와 변형의 차이.
3. **출제 설계/5단계**: invariants/자유도, 선택한 Blueprint, 실제 추가 판단, 설계에서 버린 가짜 변형·부자연스러운 조건, 최종 질문.
4. **발문 품질**: 최종 발문 핵심 인용/경로, 조건 충분성/모호성·불필요조건·표면 우회 해법·학교식 자연성 검토; KEEP/REVISED 및 근거.
5. **정답/보기 전수**: 객관식 5선지 실제 값·정답 번호·직접 풀이 중간식·유일성/경계·정답-해설 최종 일치 근거.
6. **오답 ①~⑤ 네 개**: 오답 각 번호 → 출발 오개념 → 구체적 잘못 계산·판단 → 실제 해당 보기 도출; 번호 4/4 유일 매핑 및 누락/중복 없음.
7. **학생 해설**: 풀이의 단계별 중간식·분기/경계/조건 사용 이유·최종 답; 작은 칠판 학생 재현 가능성 판정, 변경 전후 개선.
8. **학습 난이도**: 하/중/상 **자체 이유**; 학생 선수개념·판단/조건·함정.
9. **평가 난이도**: 1~5 **별도 이유**; 사고 깊이, 정보 통합, 함정, 계산 부담의 기여와 레벨과 분리된 근거.
10. **RPM L1→L4**: Primary L3·L4의 **실제 정본 key/parent/namespace**와 최종 풀이에서 사용된 정확한 단계; 비적용/확장에 대한 근거.
11. **PT/TPL·Cross·Condition·Integration**: 각 실제 key/ACTIVE·Generated registry ref, 쓰임/비적용 이유, 등록·readback 결과.
12. **교육과정·표기**: 교육과정 버전, 허용 공식/증명·용어·LaTeX·변수/단위 검토, 확인한 실제 근거.
13. **문제 시각자료**: 필요성, 실제 파일 경로/SHA, 수학 조건·좌표·레이블, 육안/브라우저 검수 결과 또는 구체적 면제 사유.
14. **해설 시각자료**: 별도 필요성 판단, 실제 SVG 경로/SHA·숫자/기하 사실·라벨, 독립 정합·렌더 결과 또는 구체적 면제 사유.
15. **세로 정답 기록**: 이전 슬롯 ①~⑤ 누적, 이번 선정 가능한 후보, 균형 목적·랜덤 seed/선택 및 선지 재배열 후 전체 보기·해설 재검.
16. **저자 자체검수**: Reverse Stem Check의 실제 재독해 내용, 발견 결함, 최종 수정 전후, 영향 필드·STALE 처리, 현재 SHA 재검과 결과.
17. **Source/Meta→Consumer→index**: 필수 Meta의 실제 영구 위치와 개별 필드값 parity, UID/원본·생성 결속, 검증된 파일·도구·결과 SHA.
18. **독립 품질검수**: 다른 검수자/세션, 실제 입력 hash, 수행 시각, 학교식 발문·답·해설·오답4·L3/L4·난도·SVG 평가, 수정 요구 및 재검, 최종 판정과 독립 evidence 경로.
19. **실제 브라우저**: 브라우저/환경/viewport, 실행 URL·최종 runtime/source SHA, 문제·정답·해설·이미지·MathJax·인쇄 확인, 스크린샷/로그 SHA, 누락·겹침/잘림·변경 후 재검 결과.
20. **검사기/Golden·Negative/회귀**: 실제 실행 명령·버전·대상 SHA·검사 결과, 수동 확인 범위, 미실행 정확한 표기(아무 검사나 대체 PASS 금지).
21. **결함·수리 이력**: 발견일/단계, 결함, 소유자, 변경된 content/choices/answer/solution/Meta/asset, 무엇이 stale 되었고 어느 검사로 fresh 폐쇄했는지.
22. **개별 종료**: 모든 G0~G5·보고 필수 증거 동일 SHA 여부, `ITEM_E2E_PASS` 또는 정확한 `ITEM_FAIL`, 남은 blockers 0개 여부, 최종 검수 책임자·증거 링크.

<!-- A1~C3마다 위 1~22를 실제로 복제·작성한다. 한 항목의 '동일' 생략은 동일 SHA·증거 참조와 확인 근거를 남긴 경우에만 허용. -->

### [원본 qid 전체 최종 결론] — 번호 진행 제어

- 기존 원본 및 보호 대상 변화: `PASS/FAIL + 비교 SHA`
- 실제 신규 고유 UID: `9/9` / 보기 `45/45` / 독립적인 오답 검증 `36/36`
- 9개 개별 보고서: `9/9` / 각 보고·SHA 일치: `9/9`
- Source Lock `PASS` / 난이도 근거 `9/9` / RPM·PT/TPL·Cross·Condition·Integration `9/9` / SVG 두 축 판정 `9/9`
- Source↔Consumer↔index Meta parity `9/9` / 독립 품질검수 `9/9` / 실제 브라우저 각 문항 `9/9` / 전체 exam·solution·answer·print `PASS`
- 세로 누적 빈도표·배분 최적화·보기 재검: `PASS/FAIL + 증거`
- 장애·미실행·근거부채·STALE·결함: `0개` 또는 `구체적 목록 + 수정 책임자`
- **최종 판정: `QID_E2E_COMPLETE` 또는 `QID_INCOMPLETE/FAIL`**. 모든 게이트에 증거 없으면 반드시 후자.
- **다음 qid 진입:** `허용`(E2E complete 9/9만) 또는 `금지`(미완료 이유·현재 재시도 지점·후속 작업).
- 실제 Git/격리/배포 상태를 각각 표기: `ISOLATED`, `GIT_MAIN_NOT_RUN`, `RELEASE_NOT_RUN`, `STAGING_BROWSER_PASS` 또는 실제 상태. 사용자 명시적 Git/배포 요청까지 이행한 경우만 원격 SHA·출시 URL·Chrome readback 제출.

## 4. 보고 언어/강제 사례

**금지:** `q01 9개 만들었습니다. 답 분포도 좋습니다. 다음 q02 진행합니다.` — 필수 확인과 문항별 보고가 없다면 작업 실패.

**허용:** `q01: A1~C3 9개 각 UID 보고서 완비 / 개별 9/9 수학·5축 Meta·독립 품질·Chrome PASS / 전체 exam·solution·answer·print PASS / 현재 소스 SHA 결속 / 세로 배분/보호 PASS / q01 QID_E2E_COMPLETE / q02 진입 가능.` — **실제 검증 증거가 있는 경우에만**.

**실패 보고:** `q01: 9후보 생성, 독립검수 0/9, 브라우저 0/9, Meta Source→Consumer parity 0/9. QID_INCOMPLETE/FAIL. q02 진입 금지. 남은 항목을 직접 수리하고 동일 q01의 완결을 재시도한다.`

### 과거 효천고 q01~q03에 대한 적용

2026-10-17 이전 격리 초안 **27문항을 이 문서 작성만으로 소급 PASS 처리하지 않는다**. 각각의 실제 최신 파일·UID·메타 영구보존·독립 품질·브라우저 증거를 검사하고, 없으면 `NOT_RUN/EVIDENCE_DEBT/QID_INCOMPLETE`로 정확히 기록한다. q01부터 신규 마감 증거를 채워 9/9 완료한 후 q02→q03 순차 해제한다. 기존 초안을 삭제하거나 무조건 재제작하지 않고 **확인된 결함과 직접 의존성만** 수정한다.

## 5. 권위·보관·개정

- 이 문서는 **실제 사람이 확인 가능한 완결 보고서 계약**이다. 기존 Git/Notion 검사기·QID9 실행 문서의 실제 코드나 유효한 기존 QA 결과를 자동 수정하지 않는다.
- 독립 수행 확인·브라우저 스크린샷 등 큰 보고 원본은 현행 Drive Evidence Vault/격리 저장소에 보관한다. Git에는 이 **작은 운영 규정**과 필요 시 간결한 완료 영수증/production asset만 둔다.
- 후속 QID 작업자는 작업 시작 시 본 문서와 현재 QID9 정본을 둘 다 읽고, 상충하는 **가로 HARD vs 세로 우선**은 원장 최근 지시와 변경 이력에 근거해 처리한다. 불일치 검증기를 조용히 우회하거나 PASS라고 서명하지 않는다.
- **도구가 없다는 이유로 품질 게이트를 생략해 완료라고 선언하지 않는다.** 해당 qid를 실패로 정확히 기록하고 실행 가능한 독립검수/브라우저 검사 경로를 확보한 뒤 동일 번호의 마감을 재개한다.