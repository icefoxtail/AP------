# 중1 기존 시험지 메타 전수 검토 인계

## 현재 위치

- 저장소: https://github.com/icefoxtail/AP------
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`; owner: `GPT_ROOT_933015CD0A4F`.
- 담당 branch: `review/m1-existing-meta-20261113`.
- 큐: [progress.json](progress.json)의 중1 **44장/1,047문항**. 연도 DESC → 학기 DESC → 기말 먼저 → 학교명 순서.
- **운영 완료2장, 남은42장. 읽기 및 운영 마감47문항. 다음3번 팔마중24는 아직 시작하지 않았다.**
- 최신 실제 등록 main: `738af248bd62813a572ac81725892b3f12ee2beb`, tree `40d92cfea35ea1108d4709aa7d7b87338e54aa17`.
- 마감 문서 작성 직전 원격 branch 체크포인트: `55a92fd7da1df7f53d18e15d3f28d5d9d2a4bc94`, tree `4bba9251bbdd8600846d708d614be008b38aece6`. 현재 마감 게시 SHA는 원격 branch와 후속 AWCR에서 확인한다.
- 마지막 실제 raw 검증 AWCR **r21**: file `149rSt5WWAArxdHVfvMv8KVlV7DPWnbEb`, SHA `21d365a950a7dcb9e844e862f235bc1a371506f09d855d166ad8b30add04c356`. 다음 r22는 실제 왕운 마감·게시 체크포인트·팔마 nextAction을 기록한다. 기존 revision을 덮어쓰지 않는다.

## 왕운중23 — 운영 완료

[PR1968](https://github.com/icefoxtail/AP------/pull/1968), 검증 head `e03094dff7abe80ac6a66223b1f20ffea19a52fe`, merge `6df44f7141f5b7b2aa91004a22d0b620a2f2b1d2`. 정확 head의 CI4개 workflow·6jobs가 모두 통과했다. main writer43474884078/job132056020809는 실제 `738af248bd62813a572ac81725892b3f12ee2beb`에 PUSHED attempts1로 반영했다.

[운영 마감](02-wangun-operational-closeout.json): source·native·identity·runtime23, 정본 변경16, 최종 post-AutoMeta Consumer changed/checked/passed23/23/23, 실패·미관측·assignmentPending0. request 적용1/거절0/대기0. 실제 등록 영수증과 ZIP의 final/persisted 결과를 root도 직접 읽었다. 전역 optional semantic backlog의 REGISTRATION_PARTIAL을 왕운 미완료나 전체 프로젝트 PASS로 해석하지 않는다.

| 항목 | 실제 SHA256 |
|---|---|
| 최종 source | `c79551504949aee9ee09f5a8e2bf74898f7b7204d54a035a3e4b2acc7d808129` |
| 의미 정본 rev3 | `51ddd9c4af3dbbdca744eb883627fbeff615239946d715a1b14a3171b574d090` |
| 공식 요청 raw | `feb528273a4167b654a50dcd6d825c7db9173b0bf2fee1c47904b20b4bb505c1` |
| 공식 요청 canonical | `3f6e0823c735fba24f769c4b2043001c1e1e8e9c2ad03246fb12638e6c4b3648` |
| 실제 등록 영수증 | `0f673be4ab627f7d8d89ee66f2f1983ef3a212b9826f1064bf5e207894e92b88` |
| 실제 분류·직접 영향 확인 | `facf6db626219f8fb5eaf24aa2529da0ff043d809cdbdb40444f897acc9ee5af` |

Source는 `archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js`, blob `21c4a9cee8baca27a43d20c64c0e69bd5bfe5670`. 요청 ID `m1-wangun-2026-mid-meta-review-20261113`, 영수증은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/`의 같은 이름 JSON이다. inbox는 정상 소비됐다. 원래 요청은 PR head의 Git snapshot에 보존돼 있다.

발문·선지·제공 풀이23개와 외부 그림33개를 전부 읽었다. 분류·부모 연결20문항, 메타 근거23문항을 정리했다. 정상 문제·정답·해설·그림·UID·배점·난이도·source reviewStatus는 보존했다. **UID는 반드시 명시적인 sourceOrdinal로 결속한 semantic rev3를 사용한다.** 원래 임시 원장의 배열 순서 오류는 적용 전에 정정됐으며 [정정 기록](02-wangun-uid-association-correction.json)을 보존한다. 추출 배열 순서를 UID 순서로 가정하지 않는다.

RPM exact leaf19, debt Q2·Q3·Q4·Q16이다. Q2/Q3는 작도와 합동 PARENT 정확 연결만 있으며 leaf가 없다. Q4/Q16은 LEGACY_PARENT_AMBIGUOUS와 상위 기본 도형을 유지한다. 가짜 leaf·잘못된 대체 유형을 넣지 않는다. Q6/7/8/10/14/22는 내용에 맞게 M1-1 비례 단원에 연결하되 시험지2학기 정보는 그대로다.

새 PT4·TPL5·binding5·M1-1 pack 과정 추가2 = 정본16이 실제 반영됐다. MIDDLE1은1.0.7, FUNCTIONS_GRAPHS는1.0.12이며, 다음 요청에서는 최신 값을 다시 읽는다. crosswalk는 기존245행을 보존하고 exact15행을 추가해260행이다. 부모 정본은24L1/54L2/326leaf와11개 leaf의 연결 ID 배열 보완을 유지한다. 기존 보호17·현재 신흥24의 metadata/identity/runtime/catalog 입력·원본·승인 참조 변경은0이다. 같은 입력의 의미·선택 상태 검증을 재사용했다.

[최종 실물 대조](02-wangun-main738-closeout-minimal-audit.json)가 정본이다. 함께 보존된 초기 minimal-protection/actual-rpm-parent 보고서의 FAIL은 임시 비교기가 writer 파생 count 갱신과 curriculum 문맥을 잘못 비교한 이력이다. 실제 count는 배열 길이와 일치하며, 실제19 base/effective 경로는 기존 검증 결과와 일치한다. 이 이력을 숨기거나 실제 오류로 혼동하지 않는다. production 수정이나 검사 완화는 필요하지 않았다.

## 이미 끝난 선행 작업 — 반복 금지

- RPM6권 L1/L2: [PR1958](https://github.com/icefoxtail/AP------/pull/1958), 24L1/54L2/326leaf 보존. 별도 branch `fix/rpm-middle-l1-l2-20261113`, head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`. 기존2015 시험지를 일괄2022로 재표기하지 않는다.
- 첫 신흥중24: [PR1964](https://github.com/icefoxtail/AP------/pull/1964), [역사적 마감](01-shinheung-operational-closeout.json), actual main `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4`, 등록24·최종Consumer24 PASS, RPM exact22/debt Q8·Q10.
- 신흥중 후속 다른 owner의 [PR1967](https://github.com/icefoxtail/AP------/pull/1967): actual main `440f412bd221e3d62df16130984a2626a3ee6441`, 새 `m1-shinheung-meta-closeout-20261113-bf-r1` 영수증 SHA `bd627b6fe34082ed8ca2a90e49955e75ffb7ee2cfc6e3e4411ae4041d4d2d555`, 현재 source raw `2f1ab79eba940498b5c575ad1509a038b3f2dabd390823177635d83937fe4b56`. 이후 보존 점검은 이 최신 영수증24를 쓴다. 옛 rev3 참조는 승인 이력이다.
- 과정명 정정 [PR1966](https://github.com/icefoxtail/AP------/pull/1966): actual main `51cfb3f6fdaf3600ad06aa298d109093ad0b6b45`, M1 비례식 binding의 `中1 수학`→`중1 수학` 한 필드, 최종Consumer1/1·기존runtime613 보존. [마감](02-binding-course-operational-closeout.json)을 재사용한다.

## 다음 실행

1. 현재 마감 문서의 원격 게시 및 AWCR r22 raw SHA/revision을 확인한다. 완료표는2/44, 다음은3번 팔마중24다.
2. Notion 라우터·시작·생명주기와 최신 main 및 병행 작업을 확인한다. 다른 owner task `241f49f8-fccb-4880-944e-9814a117b88e`/`GPT_ROOT_BF50408FB63B`에는 임의 합류하거나 파일을 덮어쓰지 않는다. 마지막 확인 r13은 신흥 담당·왕운 및 과정명 발행 보류였으므로, 다음 시험지의 현재 범위를 새로 확인한다.
3. `archive/exams/original/middle/m1/2mid/26_팔마중_2학기_중간_중1_기출.js`의 최신 source·metadata·identity·그림을 결속하고24문항을 모두 의미 검토한다. 기존 메타·PASS·REVIEW2를 정답으로 가정하지 않는다.
4. 명백한 오분류만 최소 수정한다. Archive2 native PT/TPL과 실제 RPM leaf/effective parent까지 대조한다. 정본에 정확한 leaf/연결이 없으면 근거와 debt를 남기고 임의 대체하지 않는다.
5. 소스 정상 데이터와 다른 담당 범위를 보존한다. 공식 v2 요청·필요한 정확 before 정본 변경만 준비하며, native pack/compiled/metadata/runtime은 공식 writer가 반영한다. 기존 검증과 같은 입력은 재사용한다. 전체 R1/R2/R3는 재실행하지 않는다.
6. 한 시험지의 PR→main→실제 등록 영수증→최종 post-AutoMeta Consumer→원격 SHA를 마감하고 체크포인트·AWCR를 저장한 뒤 다음으로 간다. 추가 승인은 요청하지 않는다.
7. 향후17·20·24·38·39·40번은 PR1751의 최신 요청/등록과 대조한다. 24번 향림2024 그림은 PR1959 최신 source/assets부터 확인한다. 다음 학년·학기도 별도 큐·완료표·해시·정확 nextAction 구조로 이어간다.

## 실행 환경과 체크포인트

Root는 `/workspace/scratch/933015cd0a4f/m1-review`, 모든 shell은 `login:false`. 격리 `/workspace/scratch/933015cd0a4f/m1-wangun-register`는 main51cf에 공식 로컬 사전 등록을 적용한 증거 tree이며 운영 main이 아니다. 완료 증거가 같으면 다시 실행하지 않는다.

Git push 인증 대신 GitHub tree/commit/ref API를 쓴다. `checkpoint-tools/prepare-staged-checkpoint-packet.py`로 frozen index를 캡처하고, server tree 일치·expected_sha lease·원격 raw SHA/blob readback을 확인한다. 현재 main imports는 origin/main의 정확 blob만 재사용한다. API commit 반영 전에 local MERGE_HEAD가 있으면 `git merge --quit` 후 `git reset --soft`로 해당 원격 checkpoint에 맞춘다.

공식 요청 helper는 `checkpoint-tools/build-reviewed-exam-v2-request.mjs`, 추출은 `extract-reviewed-exam-projections.py`다. 배열 위치 대신 explicit sourceOrdinal을 사용한다. 부모 대조는 `audit-actual-rpm-parents.mjs`다. 전체 수학 QA나 source solution 기반 RPM FINAL을 수행했다고 주장하지 않는다.

AWCR에는 safe metadata·상태·SHA·참조만 쓴다. 원문 문제/정답/해설·credentials·upstream raw 로그는 넣지 않는다. 기록 실패 시 미완료를 명시하고 완료를 추정하지 않는다.

## 새 대화 복사용 프롬프트

> icefoxtail/AP------ 중1 기존 시험지 메타 전수 검토를 이어 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. Notion 필독 라우터·시작·생명주기, 이 task 최신 AWCR, Git main/branch와 docs/operations/m1-meta-review-20261113/HANDOFF.md·progress.json을 확인하세요. RPM6권 L1/L2·신흥24·왕운23이 운영 마감되어2/44장,47/1,047문항 완료입니다. 왕운 PR1968은 실제 등록 main738af248bd62813a572ac81725892b3f12ee2beb, receipt23/정본16/최종Consumer23 PASS이며 RPM exact19/debt Q2·Q3·Q4·Q16을 기록했습니다. 같은 입력의 완료 검토·R1/R2/R3는 반복하지 마세요. 최신 마감 branch checkpoint와 AWCR r22 이후 기록을 확인한 뒤3번2026팔마중2학기중간24문항을 최신main·병행범위 확인부터 시작하세요. 기존 메타가 있어도 전 문항을 읽고, 정상 데이터와 다른owner 범위를 보존하며 정확한 세부 유형이 없으면 debt를 남기세요. 한 시험지씩 PR/main/실제 등록/최종Consumer/원격SHA를 마감하고 완료표·인계·immutable AWCR를 갱신하며44장 끝까지 추가 승인 없이 진행하세요.
