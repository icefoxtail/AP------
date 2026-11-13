# 중1 기존 시험지 메타 전수 검토 인계

## 현재 위치

- 저장소: https://github.com/icefoxtail/AP------
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`; owner: `GPT_ROOT_933015CD0A4F`.
- 담당 branch: `review/m1-existing-meta-20261113`.
- 마지막 확인 원격 review head: `e03094dff7abe80ac6a66223b1f20ffea19a52fe`; tree: `a318df4d68b9206d3f76eae1b3584ac3ba70ee3e`. 해당 head의 4 workflow·6 jobs가 모두 통과했고 PR1968은 실제 main `6df44f7141f5b7b2aa91004a22d0b620a2f2b1d2`에 병합됐다.
- 큐: `progress.json`의 **중1 44장/1,047문항**, 연도 DESC → 학기 DESC → 기말 먼저 → 학교명 순서.
- **운영 완료1장, 남은43장. 전체 읽기47문항, 운영 마감24문항.** 현재2번 왕운중23을 마감하기 전에3번 팔마중24를 시작하지 않는다.
- 현재 [PR1968](https://github.com/icefoxtail/AP------/pull/1968)은 MERGED. source와 inbox는 main에 있으며 실제 native 등록 영수증·최종 Consumer23은 대기 중이다.
- 최신 검증 AWCR **r21**: file `149rSt5WWAArxdHVfvMv8KVlV7DPWnbEb`, raw SHA `21d365a950a7dcb9e844e862f235bc1a371506f09d855d166ad8b30add04c356`. 작성 이후 병합·운영 상태는 다음 immutable revision으로 기록한다.

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

## 현재 병합·등록 단계

신흥중 후속 PR1967은 실제 등록 main `440f412bd221e3d62df16130984a2626a3ee6441`, receipt SHA `bd627b6fe34082ed8ca2a90e49955e75ffb7ee2cfc6e3e4411ae4041d4d2d555`, 최종 Consumer24로 마감됐다. [검증 근거](02-wangun-main440f-refresh.json)를 재사용하며 다른 owner의 tree·요청은 수정하지 않는다. 기존 승인과 crosswalk 추가의 영향 경계는 [코드 추적](02-crosswalk-append-existing-approval-impact.json)에 있다.

왕운중의 정확한 head `e03094dff7abe80ac6a66223b1f20ffea19a52fe`에서 CI4개·6jobs가 모두 통과했다. [CI 증거](02-wangun-pr1968-fresh-ci.json)와 [브라우저 범위](02-wangun-pr1968-fresh-browser-evidence.json)를 구분한다. CI artifact에는 왕운 개별 receipt가 수출되지 않았으므로 이를 실제 읽었다고 주장하지 않는다. 브라우저 24L1/54L2/326leaf 및34개 실데이터 UID 검사는 통과했고 M2/M3 실데이터 공백15개는 유지했다.

Root가 REST에서 mergeable=true/clean을 확인한 뒤 expected head로 병합했다. [실제 병합 기록](02-wangun-main-merge.json): main `6df44f7141f5b7b2aa91004a22d0b620a2f2b1d2`, tree `f4eae4a3fced8d6525922e1b67daddfaa434a885`. 병합 전 main440f→3328은 자동 작업 상태 파일2개만 바뀌었으며 source·요청·정본·metadata·runtime·증거는 동일하다.

현재 actual main writer는 run43474884078/job132056020809다. **등록 영수증23·최종 post-AutoMeta Consumer23·실제 등록 원격 main SHA 확인 전에는 완료2/44로 체크하지 않는다.** 다음 팔마중도 시작하지 않는다.

## 다음 실행

1. 위 writer의 실제 request `m1-wangun-2026-mid-meta-review-20261113` 결과를 읽는다. receipt REGISTERED23/runtime23/정본16, source c795… 및 canonical request SHA를 결속한다. 전역 workflow success나 optional semantic backlog를 이 시험지 완료·실패로 대신하지 않는다.
2. 실제 artifact의 최종 post-AutoMeta Consumer changed/checked/passed23, failures/unobserved/assignmentPending0과 PUSHED·persisted inputSha를 확인한다. 원격 main의 source/receipt/native/metadata/runtime와 최소 직접 영향을 대조한다. 기존에 같은 해시로 검증한 그림·풀이·R1/R2/R3는 반복하지 않는다.
3. 성공하면 완료2/44·남은42·운영47문항으로 체크하고 마감 근거·완료표·인계·AWCR 다음 revision을 저장한다. 각 원격 SHA와 AWCR raw SHA/revision을 실제 재읽는다.
4. 이후3번 2026 팔마중2학기중간24문항을 최신 main에서 시작한다. 현재 concurrent task 범위를 확인하고, 한 시험지를 끝까지 운영 마감한 뒤 다음으로 이동한다.
5. 향후17·20·24·38·39·40번은 PR1751 현재 요청/등록과 대조한다. 24번 향림2024 그림은 PR1959 최신 source/assets부터 확인한다. 다른 담당 파일을 덮어쓰지 않는다. 다음 학년/학기도 같은 큐·해시·완료표·정확 nextAction 구조로 이어간다.

## 실행 환경과 저장

- root: `/workspace/scratch/933015cd0a4f/m1-review`; 모든 shell `login:false`.
- 격리 `/workspace/scratch/933015cd0a4f/m1-wangun-register`: HEAD51cf 위에 왕운 공식 등록을 로컬 적용한 dirty proof tree다. 운영 main이 아니다. 필요시 증거를 보존하고 이 소유 tree만 갱신한다.
- Git push 인증 대신 GitHub tree/commit/ref API. `checkpoint-tools/prepare-staged-checkpoint-packet.py`로 staged bytes를 캡처하고 server tree 일치·expected_sha lease·원격 raw/blob readback을 확인한다. merge 상태에서는 `git merge --quit` 후 `git reset --soft`로 API commit을 반영한다.
- request helper는 `checkpoint-tools/build-reviewed-exam-v2-request.mjs`; sourceOrdinal 명시 결속과 exact before를 강제한다. 추출 배열은 정렬돼 있지 않다.
- `checkpoint-tools/observe-wangun-pack-scope-consumers.mjs`로 고정17 UID 비교, `audit-actual-rpm-parents.mjs`로 실제 분류 부모만 대조할 수 있다. 전체 시험/수학 QA 도구가 아니다.
- AWCR에는 safe metadata·상태·SHA·참조만 기록한다. 문제/정답/해설·credentials·원문 로그·upstream raw 출력은 포함하지 않는다.

## 새 대화 복사용 프롬프트

> icefoxtail/AP------ 중1 기존 시험지 메타 전수 재검토를 이어 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. Notion 필독 라우터·시작·생명주기, 이 task 최신 AWCR, Git main/branch 및 docs/operations/m1-meta-review-20261113/HANDOFF.md·progress.json을 확인하세요. RPM6권 L1/L2 선행 정비와 신흥24 운영 마감은 완료했습니다. 왕운23 semanticrev3·격리Consumer23·RPM19/debt4·기존17보존과 정확 head e03094dff7abe80ac6a66223b1f20ffea19a52fe의 CI4/6은 완료했으며 PR1968은 main6df44f7141f5b7b2aa91004a22d0b620a2f2b1d2에 병합됐습니다. 실제 main writer43474884078/job132056020809의 REGISTERED23·최종postAutoMetaConsumer23·원격등록SHA부터 확인하고 마감하세요. source·증거 해시가 같은 의미읽기·그림·R1/R2/R3는 반복하지 마세요. 누락 RPM leaf는 임의 대체하지 않고 정상 데이터와 다른owner 범위를 보존하세요. 왕운을 마감한 뒤3번 팔마중24로 넘어가44장 완료까지 추가 승인 없이 진행하며 완료표·인계·immutable AWCR를 갱신하세요.
