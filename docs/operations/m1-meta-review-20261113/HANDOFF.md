# 중1 기존 시험지 메타 전수 검토 인계

## 현재 작업과 저장 기준

- 저장소: https://github.com/icefoxtail/AP------
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner: `GPT_ROOT_933015CD0A4F`.
- 담당 branch: `review/m1-existing-meta-20261113`.
- 큐는 `progress.json`의 **44장/1,047문항**이다. 연도 DESC → 학기 DESC → 기말 먼저 → 학교명 순서다.
- **운영 완료1장(신흥중24), 남은43장. 현재2번 왕운중23은 모두 읽고 의미 판정을 확정했지만 등록 전이다.** 읽은47문항과 운영 마감24문항을 구분한다. 왕운중을 마감하기 전에3번 팔마중을 시작하지 않는다.
- 현재 확인 main: `51cfb3f6fdaf3600ad06aa298d109093ad0b6b45`, tree `52bb30a7efe875985d8f3fa2214236332c062b66`. PR1966 과정명 정정의 실제 등록과 최종 Consumer1/1·runtime613 보존을 확인했다.
- 마지막 확인 원격 checkpoint: `e403ce4b0fff47857e0579335a633a7a7b28dd3a`, tree `c8128ec8cfe6d6254b4c736985a17a4cedd1c84d`. 이 문서의 새 게시 head/tree는 원격 branch와 다음 AWCR에서 확인한다.
- 최신 검증 AWCR **r17**: file `1FEec09seuwP5KXCw4xjqsxvJzo_Zd6SO`, raw SHA `2adf3ba85e76d2669d7d9f3f31529dd13856e60436bb0d47cda3b41a076f3173`. r17은 PR1966 병합 전 관측을 보존한 immutable 기록이다. 다음 r18에 실제 과정명 정정 마감과 병행 PR1967 순서를 기록한다.

## 완료 근거 재사용

RPM6권 L1/L2 선행 작업은 [PR1958](https://github.com/icefoxtail/AP------/pull/1958)로 완료했다. 24L1/54L2, 기존326leaf 보존. branch `fix/rpm-middle-l1-l2-20261113`, head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`에 인계/검증이 있다. 2015 시험지를 일괄2022로 재표기하지 않는다.

신흥중24는 [01-shinheung-operational-closeout.json](01-shinheung-operational-closeout.json) 기준으로 운영 마감했다. PR1964 rev3가 실제 main `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4`에 등록됐다. 등록24/runtime24/정본17, 최종 Consumer24/24 PASS, RPM exact22/debt2다. Q8 부모 모호성과 Q10 leaf 공백은 보존했다. 원본 blob `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`이다. 첫 읽기·등록·R1/R2/R3를 반복하지 않는다. 이후 다른 owner가 같은 시험지의 추가 변경을 제출하면 현재 hash/범위만 확인하고 기존 마감 이력은 보존한다.

## 왕운중23의 확정 근거

- Source: `archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js`.
- 읽은 blob `76377173ecb0ba989188561bbefac2afb3232479`, raw SHA `165bed044a8d530ce79a03ceee5b29d8ea21e068295ae1fd75419a5ae2fbef37`.
- 현재 의미 정본: [02-wangun-semantic-review-rev3.json](02-wangun-semantic-review-rev3.json), SHA `51ddd9c4af3dbbdca744eb883627fbeff615239946d715a1b14a3171b574d090`.
- [전체 읽기](02-wangun-semantic-read-checkpoint.json), [33개 외부 그림](02-wangun-figure-read-evidence.json), Q1–8/Q9–16/Q17–23 담당별 읽기 근거를 재사용한다. root도23개 발문·선지·풀이를 읽었다. JS hash만으로 외부 그림의 불변을 추정하지 않는다.
- 최종 원장의23 UID는 metadata/identity의 **명시적인 sourceOrdinal**로 일대일 결속했다. 추출 배열 순서는 정렬돼 있지 않다. [정정 근거](02-wangun-uid-association-correction.json)를 읽고 original semantic 원장의 UID를 사용하지 않는다. rev3는 rev2의23 UID를 그대로 보존했다.
- 의미·부모 수정20문항. 정확한 RPM leaf19, debt Q2·Q3·Q4·Q16. 정본에 없는 도구 역할·단순 합동 대응·공간 두 직선·혼합 기본 명제 leaf를 잘못된 대체로 채우지 않는다.
- Q7은 기존 FUNCTIONS_GRAPHS `PT_FUNCTION_GRAPH_PROPERTIES` / `TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT`를 재사용한다. Q11은 기존 합동 대응 PT 아래 `TPL_M1_CONGRUENCE_DATA_TRANSFER_PARALLELOGRAM_MIDPOINT_AUDIT`를 추가한다. Q20은 기존 `TPL_M1_FREQUENCY_DISTRIBUTION_STEM_LEAF_TO_FREQUENCY_TABLE`를 재사용한다. Q19 중앙값 조건 복원/RPM223, Q20 계급 도수/RPM227을 도표 외형과 구분한다.
- [native 계획 rev2](02-wangun-native-registration-plan-rev2.json): PT4/TPL5/binding5/pack M1-1 alias2 =16 registry changes. 공식 main 과정명 정정 후 **두 pack의 exact before를 다시 읽는다.** 지원 UID/기존 정의는 수정하지 않는다.
- [crosswalk 계획 rev2](02-wangun-crosswalk-plan-rev2.json): 기존245행 그대로 +15 exact supplement. locked base 경로는 유지하고11개 leaf의 crosswalkRecordIds만 보완한다. official parent helper를 재생성해 effective L2 연결을 확인한다.
- [후보 원본 보존 rev3](02-wangun-source-candidate-independent-review-rev3.json): 후보 SHA `c79551504949aee9ee09f5a8e2bf74898f7b7204d54a035a3e4b2acc7d808129`. 이전 후보와의 차이는 Q7/Q11/Q20의 정확9개 metadata 값이며 나머지 bytes가 같다. 정상 payload·난이도·source reviewStatus23개, 외부 그림33개가 보존된다. 아직 실제 source/canonical/request에 적용하지 않았다.

## 과정명 정정 PR1966 운영 마감

[PR1966](https://github.com/icefoxtail/AP------/pull/1966) head `48732a97f0291d6f125a3f3f3358a0201941954b` → merge `57bd2b9c4a1d028c531a1dee86446fedd895e62d` → 실제 등록 main `51cfb3f6fdaf3600ad06aa298d109093ad0b6b45`.

[운영 마감 근거](02-binding-course-operational-closeout.json), SHA `8feaea616bc5e346ba90336aae0c819e6ac01112e0ec4be49a8370b676856a90`. 기존 MIDDLE1 `PT_M1_PROPORTION_PARAMETER_EVALUATION`의2022 GRAPH_RELATION binding 한 행에서 `中1 수학`→`중1 수학`만 정정했다. 동산중2025 2기말Q21 기존 승인1 UID, runtime613, 정상 source와 metadata/identity를 보존했다.

실제 receipt raw SHA `6533efaaeb1684991b992e10153d7db9eb09790f762b906093df72f3bb37beb6`, 출력7/7 실제 main Git bytes 일치. Writer43461439913의 최종 post-AutoMeta Consumer changed/checked/passed1/1/1·runtime613 보존, 새 승인 생성0이다. 실제 writer persisted 전역 상태는 `REGISTRATION_PARTIAL`, `safeToPersist:false`, optional semantic lane `required:false`다. 이 요청의 성공을 전체 저장소 등록 완료로 확대하지 않는다.

## 왕운중 격리 사전 검증

`m1-wangun-register`를 실제 main51cf로 갱신한 뒤 후보 source/crosswalk/parent/helper4파일만 격리에 복사했다. 이전 과정명 정정 로컬 proof는 `.tmp/m1-meta-review/course-preflight-preserved-before-main-reset.patch`로 보존했다.

현재 로컬 요청 `.tmp/m1-meta-review/02-wangun-main51cf.request.json`, raw SHA `feb528273a4167b654a50dcd6d825c7db9173b0bf2fee1c47904b20b4bb505c1`. 공식 dry-run 및 isolated write는23문항/정본16/runtime23 PASS다. **실제 Consumer는 build 후 확인 중이며 운영 등록은 아니다.** [현재 main 계획 갱신](02-wangun-main51cf-plan-refresh.json)에서 MIDDLE1 pack1.0.6을 읽고 M1-1 alias만 추가했다. 기존 직접 영향17 UID의 [고정 baseline](02-wangun-pack-scope-consumer-baseline.json)을 재사용한다.

PR1967 actual writer가 끝나기 전에는 왕운중의 mutable crosswalk를 게시하지 않는다. 그 후 최신 main 입력이 바뀌면 새 immutable 요청을 만들고 필요한 직접 검사만 다시 수행한다.

## 병행 범위

다른 task `241f49f8-fccb-4880-944e-9814a117b88e`, owner `GPT_ROOT_BF50408FB63B`의 immutable AWCR r12에서 왕운중23과 standalone 과정명 정정의 발행 보류를 확인했다. 그 task는 신흥중24로 범위를 좁혔다. file `13N3Bgph_uBnALJ76MuZGrUUWntipCmY_`, raw SHA `2e96a4426d684f2aadba5a60eecd9111762b9eea9f884a4908e39d7032f707c2`다. 해당 task에 합류하거나 worktree/index를 수정하지 않았다. [후보 대조](02-wangun-concurrent-candidate-conflicts.json)는 같은 수학 구조의 중복 새 키를 막기 위한 참고이며 실제 root 판정은 semantic rev3다.

신흥중의 다른 owner 보완 [PR1967](https://github.com/icefoxtail/AP------/pull/1967), 관측 head `a52b2d5d440a9f03eb6a22f8a11cb84df045a6f2`는 OPEN이며 CI1개가 실패했다. source의 정상 payload 변경0, auxiliary metadata56필드와 AutoMeta binding-owner 보완이며 정본 row 변경0이다. 그 요청24 items가 현재 crosswalk raw SHA f43…를 참조한다. [영향 코드 추적](02-crosswalk-append-existing-approval-impact.json)에 따라 **그 요청 실제 main writer 마감 → 왕운중 crosswalk 게시** 순서를 지킨다. 기존24 완료 이력을 지우거나 다시 전수 읽지 않는다. 기존 승인 재사용/Consumer는 item 근거 전체 해시를 재검사하지 않으며 immutable approval refs를 사용한다. 후속 실제 검증 결과를 미리 PASS로 기록하지 않는다.

PR1751의61요청 중 큐 중복은17·20·24·38·39·40이다. 그 차례마다 최신 source/request/receipt를 다시 확인한다. PR1959는24번 향림중2024 문제 그림과 image 연결을 변경 중이며 그 시험지는 새 source/그림 hash로 읽는다. PR1952 REVIEW2 완화는 이 작업에 채택하지 않았다.

## 다음 실행

1. Notion 필독 라우터·시작·생명주기, 이 task의 최신 AWCR와 Git main/담당 branch를 확인한다. 완료 근거가 같은 작업은 반복하지 않는다.
2. PR1966은 실제 main51cf/receipt/최종Consumer까지 마감됐다. 해시가 같은 근거를 재실행하지 않는다. 병행 PR1967 exact head·실제 writer 마감 여부를 확인한다.
3. 현재 왕운중 격리 Consumer23·RPM 부모19/debt4·기존 직접 영향17 Consumer 보존을 마감한다. PR1967 actual writer 이후 최신 main을 담당 branch/격리 tree에 반영하고 요청의 source/정본 before/증거 해시를 갱신한다. 정상 source와33그림 hash가 같으면 의미 읽기는 반복하지 않는다.
4. 왕운중 확정 후보 source와15 crosswalk·부모 참조를 적용한다. locked master, 정상 데이터와 난이도·source 검수상태는 보존한다. 최종 메타 검토에만 tagStatus/tagConfidence를 맞추고 수학 FINAL 플래그는 새로 만들지 않는다.
5. 공식 v2 요청은 helper에서 명시 ordinal/UID를 결속하고 source metadata의 difficultyConfidence 등도 보존한다. `preserveCurrentSourceMetadata:true`와 필요한 courseKey/L1/L2/RPM 값을 사용한다. Q6/7/8/10/14/22는 실제 책 범위 M1-1이다.
6. 격리 공식 등록 → catalog → 전체23 Consumer·RPM 부모 연결·직접 영향 subset을 확인한다. dry-run/PR CI가 실제 운영 등록을 대신하지 않는다. 기존 R1/R2/R3는 다시 실행하지 않는다.
7. 시험지 PR → main → 실제 REGISTERED 영수증 → 최종23 Consumer → 원격 SHA를 확인한 뒤 완료 체크하고 다음3번 팔마중으로 이동한다. 기록·인계·AWCR를 다음 immutable revision으로 저장하고 raw readback을 확인한다.

## 실행 환경

- root worktree: `/workspace/scratch/933015cd0a4f/m1-review`. Shell은 `login:false`.
- 격리 tree `/workspace/scratch/933015cd0a4f/m1-wangun-register`는 main51cf 기반 왕운중 후보/공식 등록이 **로컬에서 적용된 dirty tree**다. 운영 main으로 간주하지 않는다. scratch 요청·검증을 보존하고 병행 PR1967 마감 후 fresh main에 필요한 입력만 갱신한다.
- 옛 `m1-registration-repro`는 첫 시험지 격리 proof 보존용이다. 다른 owner의 tree는 수정하지 않는다.
- Git push 인증 대신 GitHub tree/commit/ref API를 사용한다. local staged tree와 server tree를 대조하고 expected_sha lease를 쓴다. 게시 후 원격 head/tree 및 파일 raw SHA를 읽어 검증한다.
- `checkpoint-tools/extract-reviewed-exam-projections.py`는 대상 정본 행만 추출한다. 출력 배열 위치를 ordinal로 간주하지 않는다.
- `checkpoint-tools/build-reviewed-exam-v2-request.mjs`는 source 보존·정본 exact before·증거를 결속하는 보조 builder다. 공식 registrar가 최종 권위다. MIDDLE1/FUNCTIONS_GRAPHS의 M1-1만 append하는 제한과 공식 parent-only 공백 동치 비교를 포함한다.
- Git에 근거를 보존한다. AWCR에는 안전한 metadata·상태·SHA·참조만 저장하며 원문·정답·해설·credentials·raw 로그는 넣지 않는다.

## 새 대화 복사용 프롬프트

> icefoxtail/AP------의 중1 기존 시험지 전체 메타 검토를 이어서 진행해 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. Notion 라우터와 이 task 최신 AWCR, 원격 main/branch를 확인하고 docs/operations/m1-meta-review-20261113/HANDOFF.md·progress.json을 읽으세요. 신흥중24는 운영 마감 완료, 현재 왕운중23은 전부 읽고 semantic revision3로 확정했습니다. 과정명 정정 PR1966은 실제 main51cf/최종 Consumer·runtime613 보존까지 마감됐습니다. 병행 PR1967 신흥 보완의 actual writer 완료 후 왕운중 crosswalk를 게시하세요. 왕운중 격리 v2 등록23/정본16은 PASS이며 남은23 Consumer·직접 영향17 보존·PR/main·remote SHA를 끝내세요. 후보 UID는 명시 ordinal로 결속된 rev3만 사용하고 정상 source/33그림 hash가 같으면 읽기를 반복하지 마세요. 별도 작업의 왕운중/정정 발행 보류를 확인한 기록이 있습니다. 한 시험지씩 끝내며44장 완료까지 추가 승인 없이 최신년도 내림차순으로 계속하세요. 기존 R1/R2/R3 재실행 금지, 정상 데이터 보존, missing RPM leaf는 debt 유지, 완료 체크·인계·AWCR를 남기세요.
