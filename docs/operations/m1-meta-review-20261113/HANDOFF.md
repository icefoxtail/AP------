# 중1 기존 시험지 메타 전수 검토 인계

## 현재 위치

- 저장소: https://github.com/icefoxtail/AP------
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`; owner: `GPT_ROOT_933015CD0A4F`.
- 담당 branch: `review/m1-existing-meta-20261113`.
- 마지막 확인 원격 head: `29707a569189aacd886cf84776ae31ec0640f2b1`; tree: `2352887a61876a2b65badb2dbd538cda2295996f`. 마지막 commit24개 파일의 raw SHA/Git blob을 원격에서 재확인했다. 전체 PR은65경로(archive11 + request1 + docs53)다.
- 큐: `progress.json`의 **중1 44장/1,047문항**, 연도 DESC → 학기 DESC → 기말 먼저 → 학교명 순서.
- **운영 완료1장, 남은43장. 전체 읽기47문항, 운영 마감24문항.** 현재2번 왕운중23을 마감하기 전에3번 팔마중24를 시작하지 않는다.
- 현재 [PR1968](https://github.com/icefoxtail/AP------/pull/1968)은 OPEN/non-draft. 후보·공식 요청·사전 검증이 원격 브랜치에 있으며 실제 main 적용 전이다.
- 최신 검증 AWCR **r19**: file `1Thmo7BeqfbQ9jNN_xo_fC02Jp2pC0HNS`, raw SHA `a002d90381ce0305adafa9ff974bc78c65de3bd612bdbdba6ee4206a89ca2561`. 현재 PR과 검증을 기록한 immutable snapshot이며 작성 이후 상태는 새 revision으로 기록한다.

## 완료 근거 — 반복하지 않을 일

RPM6권 L1/L2 선행 정리는 [PR1958](https://github.com/icefoxtail/AP------/pull/1958)로 완료했다. 24L1/54L2, 기존326leaf를 보존했다. 별도 branch `fix/rpm-middle-l1-l2-20261113`, head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`의 인계·검증을 재사용한다. 2015 시험지를 일괄2022로 재표기하지 않는다.

첫 시험지 신흥중24는 [01-shinheung-operational-closeout.json](01-shinheung-operational-closeout.json)의 actual main `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4`에서 등록24/runtime24/최종Consumer24 PASS로 역사적 마감을 했다. RPM exact22/debt Q8·Q10, Q8 부모 모호성을 기록했다. 아래 다른 owner의 후속 보완은 별도로 관찰하며 이전 전수 읽기나 R1/R2/R3를 반복하지 않는다.

[PR1966](https://github.com/icefoxtail/AP------/pull/1966) 과정명 정정도 운영 마감했다. 실제 main `51cfb3f6fdaf3600ad06aa298d109093ad0b6b45`, receipt SHA `6533efaaeb1684991b992e10153d7db9eb09790f762b906093df72f3bb37beb6`, 최종 Consumer1/1·기존runtime613 보존. [마감 문서](02-binding-course-operational-closeout.json), SHA `8feaea616bc5e346ba90336aae0c819e6ac01112e0ec4be49a8370b676856a90`. M1 비례식 binding의 `中1 수학`→`중1 수학` 한 필드만 수정했고 새 승인은 생성하지 않았다. Writer 전역 상태는 optional semantic lane 때문에 REGISTRATION_PARTIAL이므로 저장소 전체 완료로 확대하지 않는다.

## 왕운중23 — 현재 검증된 후보

Source: `archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js`.

| 구분 | SHA256 |
|---|---|
| 읽은 원본 | `165bed044a8d530ce79a03ceee5b29d8ea21e068295ae1fd75419a5ae2fbef37` |
| PR 후보 source | `c79551504949aee9ee09f5a8e2bf74898f7b7204d54a035a3e4b2acc7d808129` |
| 의미 정본 revision3 | `51ddd9c4af3dbbdca744eb883627fbeff615239946d715a1b14a3171b574d090` |
| 공식 v2 요청 raw | `feb528273a4167b654a50dcd6d825c7db9173b0bf2fee1c47904b20b4bb505c1` |
| 격리 최종 사전 검증 | `ea5437e08ddd76b96adeecfba1b0c4872c2faf2293abbc5c5277da8a0683d535` |

요청 ID는 `m1-wangun-2026-mid-meta-review-20261113`, inbox는 `.archive-meta-register/inbox/`의 같은 이름 JSON이다. 정상 문제·정답·해설·그림·UID·배점·난이도·source reviewStatus를 보존했다. 발문/선지/제공 풀이23개와 외부 그림33개를 root 및 담당자가 실제 읽었으며 source/그림 해시가 같으면 반복하지 않는다.

**UID는 metadata/identity의 명시적인 sourceOrdinal로 결속한 semantic rev3만 사용한다.** 원래 semantic 원장은 잘못된 배열 위치 가정을 포함했으나 적용 전에 잡았다. `02-wangun-uid-association-correction.json`과 rev2/3가 이를 정정한다. PartC 옛 UID나 추출 배열 순서를 사용하지 않는다.

분류·연결20문항 수정, 메타 근거23문항 정리. PT4/TPL5/exact binding5/M1-1 pack alias2 = 공식 registryChanges16이다. 기존 crosswalk245행 보존 + exact15, 326leaf 유지 +11개 연결 ID 배열 보완이다. Native pack·metadata·runtime 파생물은 직접 커밋하지 않았으며 공식 main writer가 적용한다.

Q7은 기존 FUNCTIONS_GRAPHS 그래프 성질 유형을 재사용한다. Q11은 기존 합동 대응 PT 아래 중점 사각형 성질 판정 template만 신설한다. Q20은 기존 줄기·잎→계급별 도수 template다. Q17/18/19는 다른 후보의 광범위 제안 대신 실제 최빈값/중앙값 조건을 따른다. 세부 판정은 `02-wangun-semantic-review-rev3.json`, 계획은 native/crosswalk plan rev2에 있다.

[격리 최종 검증](02-wangun-main51cf-isolated-preflight.json): actual main51cf 기반 공식 dry-run/write23/registry16/runtime23 PASS, 최종 Consumer23/23/23·공식 projection23 PASS, 실제 native23·RPM exact19·debt4·기존 영향17 상태변경0. helper18/18 및 HTML6개 cache 일관성 PASS. 초기 projection 오류는 별도 raw search index 미갱신으로 확인돼 공식 `build-question-index.mjs` 실행 후 실패 검사만 다시 수행했다. helper 테스트는 승인된 신규177 ID 하나를 exact 기대 집합에 추가했으며 assertion을 완화하지 않았다.

Debt Q2·Q3·Q4·Q16은 잘못된 leaf로 대체하지 않는다. Q2/Q3는 작도와 합동 PARENT 수준 EXACT, Q4/Q16은 RPM 하위 부모 LEGACY_PARENT_AMBIGUOUS와 상위 기본 도형을 유지한다. Native 소단원은 위치 관계/기본 도형으로 정확히 등록된다. 수학 FINAL QA 및 solution 기반 실제 RPM resolver를 수행했다고 주장하지 않는다.

## 지금 main 병합을 제한하는 정확한 순서

다른 task `241f49f8-fccb-4880-944e-9814a117b88e`, owner `GPT_ROOT_BF50408FB63B`는 신흥중24 보완을 담당하며 왕운중/별도 과정명 교정 발행을 보류했다. 실제 raw 검증한 최신 발견 AWCR r13은 file `1On2Gpe0EmP9W7IffBCg2qZLr0z0ZV288`, SHA `105d05f2df229857c3ff90f28a28f5b3881b31abf72f7b1c82ab7f1b9e77691f`다. 해당 task에 합류하거나 tree·요청을 수정하지 않는다.

[PR1967](https://github.com/icefoxtail/AP------/pull/1967)은 head `bab8fc177dc8f841708ac88f1664bc36d60864bd`로 main `2391df9b009b1c1f47ab450ed501fe06dd78f918`에 병합됐다. **Writer43467456637/job132030268013의 실제 등록 main은 `440f412bd221e3d62df16130984a2626a3ee6441`**이다. 새 receipt SHA `bd627b6fe34082ed8ca2a90e49955e75ffb7ee2cfc6e3e4411ae4041d4d2d555`, 등록24/runtime24 및 최종 post-AutoMeta Consumer24/24/24를 root가 actual Git/ZIP에서 확인했다. [최신 main 반영 근거](02-wangun-main440f-refresh.json)를 따른다. 전역 optional semantic pending을 신흥24 미완료로 해석하지 않는다.

신흥 요청24 items가 현재 crosswalk SHA `f43c66b50f9b7bb188114f6105cc173ad1e5895f0aa403a902e27510738fb8da`에 결속돼 있으므로 **신흥 actual writer 마감 → 등록된 main 갱신 → 왕운 main 병합** 순서를 지킨다. 별도 왕운 branch/PR 게시에는 해당 제한이 없다. 기존 native 승인/Consumer는 immutable approval refs를 사용하여 crosswalk 행 추가만으로 무효화되지 않는다는 코드 근거는 `02-crosswalk-append-existing-approval-impact.json`에 있다.

PR1967의 새 CI native preview는 base/head 사이 추가·수정된 요청만 적용한다. 따라서 왕운 PR preview가 기존 신흥 pending 요청의 f43 해시를 직접 검사하지는 않는다. 다만 등록 전 main2391의 새 신흥 source/이전 receipt 때문에 기존 승인 테스트가 실패할 수 있다. **등록된 fresh main을 왕운 branch에 합친 정확 head에서 CI를 확정한다.**

## 다음 실행

1. 신흥 보완 실제 등록 main440f/receipt/finalConsumer24는 확인 완료다. 동일 증거를 다시 실행하지 않는다. root의 충돌 없는 local main merge와 새 원격 head 게시 상태부터 확인한다.
2. root가 최신 등록 main440f를 충돌 없이 반영했고 기존 왕운 요청 그대로 공식 dry-run23/정본16/runtime23을 통과했다. source 원본과 distinct evidence11개도 확인했다. 새 exact head를 게시하고 CI를 확인한다. 추가 main 변화가 있으면 왕운 source 원본·23개 before 메타·정본 exact before·증거가 그대로인지 확인한다. 영향 없는 기존 증거는 재사용한다. 요청 bytes가 그대로 유효하면 불필요한 재작성·전수 검증을 하지 않는다. 필요해진 변경이 있으면 새 immutable 요청 revision을 만들고 이전 요청을 명시적으로 대체한다.
3. PR1968의 새 exact-head CI를 확인한다. 필요한 공식 native preview/Consumer 결과를 읽는다. 기존 R1/R2/R3를 재실행하지 않는다.
4. expected head로 PR1968 병합 → 실제 REGISTERED23 receipt → 최종 post-AutoMeta Consumer23 → remote main SHA를 확인한다. 그때에만 완료2/44·남은42로 체크한다.
5. 완료·인계·AWCR 다음 immutable revision을 저장하고 원격 raw SHA/revision을 재읽는다. 이후3번 팔마중24로 진행한다.
6. 향후17·20·24·38·39·40번은 PR1751 현재 요청/등록과 대조한다. 24번 향림2024 그림은 PR1959 최신 source/assets부터 확인한다. 해당 차례가 오기 전에 시험지를 건너뛰거나 다른 담당 파일을 덮어쓰지 않는다. 다음 학년/학기도 같은 큐·해시·완료표·정확 nextAction 구조로 이어간다.

## 실행 환경과 저장

- root: `/workspace/scratch/933015cd0a4f/m1-review`; 모든 shell `login:false`.
- 격리 `/workspace/scratch/933015cd0a4f/m1-wangun-register`: HEAD51cf 위에 왕운 공식 등록을 로컬 적용한 dirty proof tree다. 운영 main이 아니다. 필요시 증거를 보존하고 이 소유 tree만 갱신한다.
- Git push 인증 대신 GitHub tree/commit/ref API. `checkpoint-tools/prepare-staged-checkpoint-packet.py`로 staged bytes를 캡처하고 server tree 일치·expected_sha lease·원격 raw/blob readback을 확인한다. merge 상태에서는 `git merge --quit` 후 `git reset --soft`로 API commit을 반영한다.
- request helper는 `checkpoint-tools/build-reviewed-exam-v2-request.mjs`; sourceOrdinal 명시 결속과 exact before를 강제한다. 추출 배열은 정렬돼 있지 않다.
- `checkpoint-tools/observe-wangun-pack-scope-consumers.mjs`로 고정17 UID 비교, `audit-actual-rpm-parents.mjs`로 실제 분류 부모만 대조할 수 있다. 전체 시험/수학 QA 도구가 아니다.
- AWCR에는 safe metadata·상태·SHA·참조만 기록한다. 문제/정답/해설·credentials·원문 로그·upstream raw 출력은 포함하지 않는다.

## 새 대화 복사용 프롬프트

> icefoxtail/AP------ 중1 기존 시험지 메타 전수 재검토를 이어 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. Notion 필독 라우터·시작·생명주기, 이 task 최신 AWCR, Git main/branch 및 docs/operations/m1-meta-review-20261113/HANDOFF.md·progress.json을 확인하세요. RPM6권 정비와 신흥24 첫 운영 마감은 완료했고 현재 왕운23 PR1968, head29707a569189aacd886cf84776ae31ec0640f2b1입니다. 왕운은 semanticrev3·공식 격리Consumer23·RPM19/debt4·기존17보존 모두 PASS, 실제 main 적용 전입니다. 다른owner PR1967는 실제 main440f412bd221e3d62df16130984a2626a3ee6441에 등록24/최종Consumer24 마감됐습니다. root가 이 main을 반영해 왕운 기존요청 freshdry-run23/16/23을 통과했습니다. 새 원격 head 게시 여부부터 확인하고 exact-head CI→PR1968merge→actualREGISTERED23/최종Consumer23/remoteSHA를 마감하세요. 해시가 같은 의미읽기·그림·R1/R2/R3는 반복하지 마세요. 누락 RPM leaf는 임의대체하지 않고, 정상 데이터·다른owner 범위를 보존하세요. 왕운을 끝낸 뒤3번 팔마중으로 넘어가44장 완료까지 추가 승인 없이 진행하며 완료표·인계·AWCR를 갱신하세요.
