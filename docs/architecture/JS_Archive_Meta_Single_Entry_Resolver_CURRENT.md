# JS Archive 메타 단일 진입·Resolver 연결 계약 — CURRENT v1.0

업데이트: 2026-10-30. 적용: 원본 학교 기출 CREATE/R1/R2/R3 및 해당 단계의 GPT·Claude·Gemini·Codex·Work. 특정 모델별 메타 규칙을 새로 만들지 않는다. 기존 캠페인 작업·예약 ON/OFF·Git 쓰기 권한은 변경하지 않는다.

## 0. 한 줄 권위

신규 기출·유사·ALIVE/Generated·교과서·문제집·교재/평가 문항의 전체 제출 요건은 [확장 메타·4칸·기록 메타 공통 계약](JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)을 따른다. 이 문서의 Resolver 결과는 그중 기존 PT/TPL 투영을 담당하며 4칸 판정·검토 기록을 자동 생성하거나 대체하지 않는다. 4칸은 최종 문항·해설에서 독립 판정하고 동반 파일로 인계한다. 이유: Resolver PASS만으로 확장 메타 전체를 작성·검토했다고 오인하지 않기 위해서다.

**유형(PT/TPL) 출처 제한 해제 (2026-11-16 사용자 결정).** "PT/TPL은 공식 Resolver 결과만"이라는 제한을 없앤다. 이 문서와 다른 문서(봉인된 `docs/rules/01_CANONICAL/JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1.md` 포함)에 남은 같은 뜻의 문구보다 이 항이 우선한다. 이유: 유형은 문항이 늘수록 계속 늘어나는 분류라 한 판정기에 묶을 수 없고, 잠금 때문에 유형 칸이 대부분 비어 있었다.

- **값을 내는 길은 셋이고 모두 정식이다.** ① Resolver 조회(RPM 경로 → 크로스워크 → ACTIVE 키) ② 문항·해설의 결정 단계를 근거로 작업자(사람·모델)가 ACTIVE 키 가운데서 직접 판정 ③ 맞는 키가 없으면 `registryChanges`로 새 키 신설([확장 원칙](../agents/metadata.md)).
- **유지하는 조건은 근거다.** 근거 없이 채우지 않는다. 직접 판정은 결정 단계(`decisiveStep`)와 그 근거가 된 원문 구절을 원장에 남긴다. 가장 가까운 키에 억지로 붙이지 않는다. 승인은 서로 보지 않은 두 판정의 일치 또는 검수로 한다.
- **기계 검증은 그대로다.** 키가 ACTIVE인지, TPL의 부모 PT가 맞는지, 교육과정 바인딩이 있는지를 등록기가 검사한다. 바인딩·크로스워크 행이 없으면 값을 버리지 말고 add-only로 행을 추가한다.
- **Resolver와 직접 판정이 다르면** 오류로 막지 않는다. 직접 판정의 근거를 확인해 맞으면 크로스워크 행을 추가하고, Resolver 쪽이 맞으면 직접 판정을 고친다.
- **아직 코드에 남은 것(후속 PR):** 기출 생산 게이트의 Resolver 일치 강제(`completion-evidence.mjs`의 projection parity), `typeHold`로 등록된 문항에 나중에 유형을 채우는 경로, 요청 생성기의 바인딩 자동 추가. 그때까지 이 세 곳은 기존대로 동작한다.

실제 원문 + 해당 학년 2022/2015 교육과정 내 학생 재현 가능 최종 풀이 → 표준단원/세부단원 → RPM Primary L1→L4 → CrossConcept/Condition/Integration → ACTIVE PT/TPL과 정확한 과정 바인딩(Resolver 조회 또는 근거 있는 직접 판정). **CrossConcept으로 Primary를 갈아끼우지 않는다.**

권위 우선순위: 사용자 현재 지시 > 적용 역할/캠페인 정본 > `docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md`(의미/증거) 및 RPM LOCKED/마스터 > 본 연결 계약(진입/프로젝션) > Git 과거 사례·crosswalk의 예전 GAP. 본 문서는 새 메타 레지스트리를 생성하지 않는다.

2022 중학의 현재 L1/L2와 기존 LOCKED base 경로의 호환은 [RPM 2022 중학 부모 정본·호환 계약](../rules/01_CANONICAL/taxonomy/rpm-middle-2022/RPM_MIDDLE_2022_PARENTS.md)을 참조한다.

## 1. 서로 다른 두 층

- **수학적 의미(사람/AI 판정 + 정본 검증):** 현재 과정/표준단원과 세부단원, RPM Primary L1/L2/L3/L4, 실제 결정 단계 `primaryMethod`/`decisiveStep`, Primary 바깥에서 정답에 기여한 `crossConceptKeys[]`, 실제 조건 `conditionKeys[]`, 복합 사고 `integrationPattern`. 수학 교육과정 밖 공식·미분법으로 풀이를 정당화하지 않는다.
- **호환성/기계 키(Resolver 조회 또는 근거 있는 직접 판정, §0):** `problemTypeKey`(PT), `templateKey`(TPL), GLOBAL ACTIVE parent와 정확한 교육과정 `curriculum+standardCourse+standardUnitKey+subUnitKey+PT` 바인딩. PT/TPL은 RPM L3/L4의 또 다른 권위가 아니라 메타 소비자를 위한 *projection*이다.
- **운영 등록(별도):** Git source UID, 소형 승인 메타, Consumer/DB/index, Pages. 메타 의미 확정과 PR/main·학생 배포는 서로 증명하지 않는다.

`PT=RPM L3` 또는 `TPL=RPM L4`라는 단순 일대일 규칙을 만들지 않는다. PT/TPL을 교육과정에 가두어 새 키를 만들지도 않는다. (맞는 ACTIVE 키가 없을 때의 정식 신설 절차는 [확장 원칙](../agents/metadata.md): 추정 금지이지 신설 금지가 아니다.) 기존 2015 ACTIVE 의미 키를 2022 단원에 정확 바인딩하여 재사용한다.

## 2. 모든 작업자가 쓰는 같은 실행 경로

1. 실제 원문과 교육과정 내 최종 풀이에서 핵심 사고 및 결정적인 식/조건을 문항별 먼저 작성. R1은 저장 정답/해설 비노출 독립 풀이 및 freeze를 기존 역할 정본대로 선행.
2. 해당 학년의 마스터 표준단원·세부단원과 RPM Primary L1~L4를 조회; 범위 밖 해법을 억지로 끌어오지 않는다.
3. 별도로 CrossConcept·Condition·Integration을 실제 해설의 역할로 판정하고 ACTIVE 개념 레지스트리에서 키 조회. Primary와 동일 의미를 중복 CrossConcept로 등록하지 않는다. 단순 계산기술이 Primary의 결정 단계를 대체해서는 안 된다.
4. `archive/tools/meta-foundation/rpm-active-resolver.mjs`로 crosswalk → GLOBAL ACTIVE taxonomy/templates → 정확한 curriculum binding 및 TPL parent를 조회한다. Resolver가 값을 내지 못하거나 결정 단계와 맞지 않는 값을 내면 §0대로 근거를 남기고 직접 판정하거나 새 키를 만든다. 근거 없이 바꾸지 않는다.
5. 기존 확정된 학생 해설과 기계 키가 맞지 않으면 해당 QID의 결정 단계/후보만 재검. 본문·다른 QID·대형 메타를 덮어쓰지 않는다.
6. 해당 stage의 기존 Evidence와 SHA에 결속. R1/R2/R3의 수학·시각·Golden·원본 확인은 기존 역할 품질 게이트로 별도 검증.

공식 명령(동일 명령, stage 값만 변경):

```bash
node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage CREATE --input archive/_generated/<run>/meta/decision.json --out archive/_generated/<run>/meta/create-resolver.json
node archive/tools/meta-foundation/stage-meta-bridge.mjs --stage R1 --input archive/_generated/<run>/meta/decision.json --candidate archive/_generated/<run>/meta/candidate.json --relational archive/_generated/<run>/meta/relational.json --difficulty archive/_generated/<run>/meta/difficulty.json --out archive/_generated/<run>/meta/r1-gate.json
```

R2/R3는 `--stage R2`/`--stage R3`와 동일한 현재 판본의 입력으로 실행한다. `--validator-receipt`은 그 판본의 유효 영수증이 있는 경우 지정한다. 입력 경로는 실물 stage-local 소형 JSON이며 `<run>`은 실제 작업 폴더명으로 바꾼다. `stage-meta-bridge.mjs`는 evidence 파일만 `archive/_generated/` 아래 저장한다. SOURCE_ONLY가 없는 R1은 기존 독립성 계약대로 먼저 물리 동결한다.

**GPT/Claude/Gemini가 Node 실행 환경이 없을 때:** 공식 입력 JSON의 `primaryMethod`/`decisiveStep`/RPM 경로와 source SHA를 stage-local ledger로 기록하고, 공식 Resolver를 실행할 수 있는 실제 Git executor에게 같은 파일을 넘긴다. 이때도 §0의 직접 판정(결정 단계와 원문 구절 근거)은 원장에 적을 수 있다. 근거 없는 PT/TPL이나 자체 제작 유사 Resolver로 PASS하지 않는다. 기술 미실행은 `NOT_RUN` 또는 `OWNER_INCOMPLETE`로 구분한다.

## 3. 판정 상태·금지 행동

- `SEMANTIC FINAL`: 현재 과정 RPM L1~L4 + 학생 풀이와 결정 단계가 맞음. PT/TPL 조회 누락과 혼동 금지.
- `PROJECTION_REUSE`: 기존 ACTIVE PT/TPL, TPL parent, 현재 교육과정 exact binding 모두 일치. `META_FINALIZATION_PASS`에는 별도의 relational/난이도 증거도 필요.
- `PROJECTION_PENDING`: 의미는 유효하나 과정 ACTIVE 바인딩 누락 또는 호환 키 미해결. **수학 의미를 인수분해 등으로 재분류하지 않는다.** 담당 Git writer의 add-only 바인딩 수리 대상으로 기록.
- `EVIDENCE_INCOMPLETE`/`INVALID`: 학생용 풀이, 의미 근거, CrossConcept 적용 이유, 또는 검증 증거가 없거나 충돌. 미실행을 PASS라고 표시하지 않는다.
- `META_FINALIZATION_PASS`는 메타 단독 판정. R1~R3 전체 PASS, 메인 병합, Consumer/index, 실제 학생 렌더 PASS와 같지 않다.

금지: 풀이에 인수분해가 사용됐다는 이유만으로 미적분 문항을 인수분해 Primary로 변경; 함수 극한 문제에서 교육과정 밖 유리함수 미분으로 TPL 선택; 미분계수 정의와 함수 극한값 계산을 이름만 보고 오분류; 기존 ACTIVE PT/TPL이 있지만 H22 바인딩이 없는 것을 TRUE SEMANTIC HOLD로 선언; 같은 문항에서 Primary를 CrossConcept에 중복 입력; 후보 키를 기존 정본이라 주장.

## 4. 실제 코드 연결과 테스트

- 공식 Resolver: `archive/tools/meta-foundation/rpm-active-resolver.mjs` 및 기존 `build-rpm-active-resolution.mjs`.
- 모든 stage용 실행/판정/영수증: `archive/tools/meta-foundation/stage-meta-bridge.mjs`.
- Codex 실제 기출 생산 게이트: `archive/tools/past-exam-pipeline/lib/completion-evidence.mjs`가 동일 Resolver에 더해 PT/TPL projection parity를 강제.
- 회귀: `node --test archive/tools/meta-foundation/stage-meta-bridge.test.mjs archive/tools/meta-foundation/rpm-active-resolver.test.mjs`.
- 예시: 순천여고 미적분Ⅰ q06은 Primary 판단과 별개로 `CC_POLYNOMIAL_FACTORIZATION`를 보조 개념으로 사용; q23은 학생용 극한 계산이 Primary, `CC_TRIANGLE_AREA`/`CC_PIECEWISE_FUNCTION` 등이 CrossConcept. 예시는 개별 문항 최신 source/해설을 대체하는 절대 규칙이 아니다.

## 5. AI별 발견 지점(정본 복제 금지)

- OpenAI GPT/Work/Codex: 루트 `AGENTS.md`, `docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md`, Codex Fast Lane.
- Anthropic Claude: 루트 `CLAUDE.md` → 이 Git 정본. 기존 Claude 메인/서브에이전트 권한은 유지.
- Google Gemini: 루트 `GEMINI.md` → 이 Git 정본. 기존 Gemini 예약/6단계 캠페인의 설정·원본에는 적용·변경하지 않는다.
- Notion: 00 작업별 라우터 및 02-06 메타 라우트에는 **링크만** 추가한다. 단일 정책 본문/코드는 Git 이 파일이 소유한다.

정본 편집은 Git PR/main에 집중. 다른 곳의 복제된 텍스트가 달라져도 이 파일과 현재 source/registry/role 정본을 재조회한다.
