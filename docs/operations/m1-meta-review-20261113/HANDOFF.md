# 중1 기존 시험지 메타 전수 검토 인계

## 현재 작업과 완료 범위

- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`
- owner: `GPT_ROOT_933015CD0A4F`
- 작업 브랜치: `review/m1-existing-meta-20261113`
- 중1 전체 대상: **44장 / 1,047문항**. 첫 시험지의 최초·보완 PR **1960·1961은 병합**, 읽기·의미 검토는 **24문항**, 실제 등록·Consumer 확인까지 끝낸 **운영 마감은 0장**이다.
- 순서: 연도 내림차순, 같은 연도는 2학기 → 1학기, 기말 → 중간, 학교 이름 순서. 실제 목록은 `progress.json`을 따른다.
- 사용자 선행 요청인 RPM 6권 L1/L2 정리는 PR [1958](https://github.com/icefoxtail/AP------/pull/1958)로 main에 병합했다. 확인한 main SHA는 `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`이다.
- 해당 목차 결과: 대단원 24개, 중단원 54개, 기존 326개 세부 경로의 부모 대조 및 9개 수정. L3/L4와 locked master는 보존했다.
- RPM 작업의 병합 후 영수증·상세 인계는 `fix/rpm-middle-l1-l2-20261113` 브랜치의 `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`에 보존되어 있다.

## 첫 시험지 상태

**2026 신흥중 중1 2학기 중간 / 24문항**

- 원본: `archive/exams/original/middle/m1/2mid/26_신흥중_2학기_중간_중1_기출.js`
- 검토 기준 source blob: `c36139a90e9bcd378577ece8f891423bee6b0a19`
- 검토 기준 raw SHA256: `1bac8b9ef1d47f88ac66c69cf6c3299e708321d10cf84f073fca0c1a20bc4564`
- 24문항의 발문·그림·풀이를 모두 읽은 동결 기록이 있다. 같은 bytes를 다시 전수 읽거나 R1/R2/R3를 재실행하지 않는다.
- 의미 확정 원장: `01-shinheung-semantic-review.json`
- 원장 SHA256: `8b2c99318e81f7452fb2dde608eacbdc0fa95de5b7493656944ee269a49829b0`
- 의미/빈 유형 연결 수정 15문항, 의미를 유지한 binding 보완 2문항. 의미 유지 9문항에는 binding 보완 2문항이 포함된다.
- rev2까지의 실제 source 메타 변경 문항은 **24문항**이다. 분류·연결 보완 17문항(의미/연결15 + binding2)과 별개로, 메타 검토 완료 annotation은 24문항 모두 정렬했다. 이 수치는 수학 검증이나 해설 수정 건수를 뜻하지 않는다.
- 현재 상태는 **`REV2_MERGED_WAITING_MAIN_REGISTRATION`**이다. 최신 확인 main은 `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`, tree는 `c5801f45830f1d2193b3222adc6fe5d92c412816`이다.
- rev2 repair PR [1961](https://github.com/icefoxtail/AP------/pull/1961)은 head `64650d1c2e34b49a0779769d8df502eb853ff693`의 **CI 3개 workflow / 5개 job 모두 SUCCESS** 후 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`, tree `25dcd5f8086207e5e630aa3ec51ba8ab6b95f69c`로 병합했다. [rev2 CI 근거](01-shinheung-rev2-ci.json)와 [rev2 병합 근거](01-shinheung-rev2-main-merge.json)를 재사용한다.
- 그 뒤 PR1962의 별도 L3 부모 검색/helper 변경이 최신 main에 병합됐다. 원본 시험지와 정본은 바뀌지 않았고 rev2 source blob·SHA도 동일하다. 최신 main으로 fast-forward한 상태를 유지하며 별도 작업을 덮어쓰지 않는다.
- 최초 PR [1960](https://github.com/icefoxtail/AP------/pull/1960)은 head `f0a89b11f7c085b08ab406831f0d2bc0681fefed`의 **CI 5개 workflow / 7개 job 모두 SUCCESS** 후 main `81fb1c3a7c861ede3690157234bf0415c2585e45`에 병합했다. 당시 확인한 main tree는 `1f0eeecb4e7fafed89050c300b36aae949873437`이다. [main 병합 근거](01-shinheung-main-merge-checkpoint.json)와 [수정 head CI 근거](01-shinheung-ci-fixed-head.json)는 이 최초 PR의 이력으로 보존한다.
- [main writer 실행](https://github.com/icefoxtail/AP------/actions/runs/43421975843)과 [register job](https://github.com/icefoxtail/AP------/actions/runs/43421975843/job/131873926621)은 SUCCESS로 끝났지만, **rev1 요청은 `projection-verify`에서 REJECTED**였다. Q1의 source tag annotation과 등록기의 자동 메타 상태가 충돌했으며 정본 변경 17건은 적용되지 않았다. workflow SUCCESS를 요청 등록 PASS로 해석하지 않는다.
- source의 두 tag annotation을 24문항에 맞춘 rev2는 병합됐다. **rev2 공식 dry-run은 exit 0 / 5.801초 / write:false / 24문항 / 정본 변경17 / fingerprint 보정24 PASS**다. exact merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`의 [rev2 main writer run 43429595931](https://github.com/icefoxtail/AP------/actions/runs/43429595931), [job 131899473141](https://github.com/icefoxtail/AP------/actions/runs/43429595931/job/131899473141)은 **IN_PROGRESS / step 6 preparation / persist pending**으로 관측했다. 실제 요청별 영수증과 24문항 Consumer/Search는 미확인이므로 운영 마감은 **0/44**다.
- 원장에는 메타 의미 검토와 수학·해설 FINAL QA를 구분하여 기록했다. 실제 풀이 RPM resolver는 `NOT_RUN_UNVERIFIED_SOLUTION`이며 등록 대기나 CI 성공을 독립 수학 검증으로 해석하지 않는다.

### rev1 등록 거부와 rev2의 최소 수정

- rev1은 `qid_v1_d6bbf87bf0397aa29c28dd495d9c84c4bc2b33eac4873c56a7c5aa247eafdc31`(Q1)의 Consumer metadata conflict로 거부됐다. 읽기 전용 대조 결과 Q1–Q24 모두 `tagConfidence`, `tagStatus`만 source와 공식 FINAL_QA 등록값이 달랐다.
- 24문항의 source `tagConfidence: candidate_manual`을 `approved_final_qa`, `tagStatus: candidate_manual`을 `reviewed_pass`로 맞췄다. 이미 완료한 **메타 의미 검토 상태**를 반영한 변경이다. 그 외 모든 문항 값과 source/content fingerprint는 동일하다.
- source `reviewStatus`를 추가하지 않았고 R1·수학 검증·독립 검증·RPM FINAL 플래그도 바꾸지 않았다. Consumer 충돌 검사나 광범위한 면제도 변경하지 않았다. 분류 의미와 정본 변경 17건은 rev1과 같다.
- 현재 rev2 병합 source blob: `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA256: `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`. 최신 main `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`에서도 동일함을 확인했다.
- 현재 요청: `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev2.json`, SHA256: `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30`.
- [rev1 거부 기록](01-shinheung-registration-rev1-rejected.json), SHA256 `d33758236925429be7f323a4bcab4f011d446ca15b36b267a4323251a2b330df`.
- [tag annotation 수정·보존 근거](01-shinheung-tag-annotation-repair.json), SHA256 `2cab1eb2d69efbc6f0fcbb80f3dc41d2d40fbc5bc1e6a199f7c5e703095a33a0`.
- [rev2 공식 dry-run](01-shinheung-registration-rev2-dry-run.json), SHA256 `b4859e4a01ba624774ab2dd5faa3c98bad9c57c56f71b0f10a1c4dcceb686740`.
- [rev2 CI](01-shinheung-rev2-ci.json), SHA256 `6774dbcee746791603c16b4d98ff4c7c55d95099681064faec96a8ccae3b0a71`.
- [rev2 병합 및 최신 main 확인](01-shinheung-rev2-main-merge.json), SHA256 `8f9c0772bd4dccf301cb70494f501a7a2c7119a64514904e636a41e4a5f8f4db`.

### 확정한 주요 판단

- 4번: 평행선 판정이 아니라 컴퍼스로 각을 옮기는 작도. RPM185 및 기존 각 복사 TPL.
- 12·18·24번: 합동 조건 선택이 아니라 정삼각형에서 보조 SAS 합동을 얻고 대응 관계를 적용하는 기존 TPL.
- 13번: 정다각형 찾기(RPM200)에서 주어진 정다각형 각 계산(RPM196)으로 교정.
- 19번: 교차 도형을 삼각형·다각형으로 나누어 보조각을 소거하는 유형.
- 22번: 삼각형·맞꼭지각이 아닌 평각의 인접각 분할과 비.
- 7·21번: 기존 중점·선분비 TPL 재사용. 수치나 예시 배치 차이만으로 새 유형을 만들지 않는다.
- 새 정의는 PT 2개, TPL 4개만 준비한다. 기존 ACTIVE 정의와 supporting UID는 변경하지 않는다.

### 정본 공백을 숨기지 않을 두 문항

- 8번: 공간 두 직선의 위치 관계 exact RPM leaf가 없다. 직선–평면 관계 leaf로 대신 넣지 않는다. 정확한 native PT/TPL을 등록하고 RPM 경로는 null + `EVIDENCE_DEBT`로 보존한다.
- 10번: 여러 삼각형 작도 조건을 종합 판정하므로 한 가지 ASA 작도 leaf를 강제하지 않는다. 정확한 기존 native PT/TPL은 유지하고 RPM 경로만 null + `EVIDENCE_DEBT`로 남긴다.
- RPM resolver의 FINAL/PASS를 이 두 문항에 주장하지 않는다. 8번은 기존 native POSITION key의 RPM 부모 분기가 모호하므로 RPM 필터의 debt/제외 상태와 native 유형 승인 상태를 분리하여 확인한다.

## 재개 순서

1. 연결된 Notion 필독 라우터·Archive 시작·작업 생명주기를 확인하고 최신 원격 main 및 진행 중 PR을 대조한다. 빈 메타 채우기 작업과 같은 시험지를 동시에 수정하지 않는다.
2. 최신 원격 체크포인트와 `progress.json`, rev1 거부·rev2 수정·dry-run·CI·병합 근거를 읽는다. 첫 시험지의 읽기·분류 판단·정본 추가17 준비·rev2 annotation 정정·dry-run·PR1961 CI와 병합은 완료했다. 동결 근거를 재사용하며 이미 병합한 PR1960·1961을 재생성하지 않는다. 최종 의미 판단은 `01-shinheung-semantic-review.json`이다.
3. **exact rev2 main writer의 요청별 영수증부터 확인**한다. run `43429595931` / job `131899473141`의 head는 `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`이다. 요청 `m1-shinheung-2026-mid-meta-review-20261113-rev2`, SHA `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30`의 24 UID·정본17 적용 결과와 persist 결과를 대조한다. CI 또는 workflow SUCCESS만으로 등록 PASS를 판단하지 않는다. 실패·보류가 있으면 원인과 직접 영향만 처리한다.
4. 등록 후 **24문항 모두** native 분류·PT/TPL·승인 상태와 Consumer/Search 반영을 확인한다. 22개 exact RPM 경로와 Q8/Q10의 null + `EVIDENCE_DEBT`를 구분한다. Q8의 RPM 부모 모호성과 native 유형 승인 상태도 따로 확인한다. 첫 시험지에는 독립 풀이 `VERIFIED_FINAL` 근거가 없으므로 실제 풀이 resolver를 실행하거나 그 PASS를 주장하지 않는다. 기존 R1/R2/R3를 다시 실행하지 않는다. 이후 시험지에 검증된 기존 근거가 있으면 해당 근거를 재사용한다.
5. 실제 등록 영수증·24문항 Consumer 결과를 최신 원격 main SHA에 결속한다. PR1962의 별도 L3 부모 검색/helper 변경도 함께 보존한다. 세 가지가 확인된 뒤에만 첫 시험지를 운영 마감하고 `completedExams`를 1로 바꾼다. 시험지별 보고와 체크포인트를 저장한 다음 2026 왕운중 2학기 중간 23문항으로 이동한다. 그전에는 `currentOrder: 1`, 운영 마감 0/44를 유지한다.
6. 향후 순번 **17·20·24·38·39·40**은 PR1751과 같은 시험지 범위다. 각 시험지 착수 전에 해당 PR의 최신 head·상태·등록 영수증과 실제 적용 메타를 재확인한다. 아래 병행 작업 근거를 따른다.

## 보존 및 검증 경계

- 기존 읽기 증거: `01-shinheung-semantic-read-checkpoint.json`.
- 기존 후보: `01-shinheung-first-half-candidate.json`, `01-shinheung-candidate-comparison.json`.
- fingerprint 진단: `01-shinheung-fingerprint-preflight.json` — 24/24 불일치와 공식 검증 함수의 명시적 repair 수용을 기록했다. 등록 완료 증거는 아니다.
- 공용 metadata/identity/runtime/compiled 대형 파일을 직접 편집하지 않는다. 서버 writer가 소형 v2 요청을 적용한다.
- 전체 시험지의 과거 수학 검수 완료를 추정하거나 새 R1/R2/R3 PASS를 만들지 않는다.
- 로그인 셸 지연은 exec의 login:false로 해소했다. 변경된 resolver 검사는 29개가 통과했다. 부모 helper 검사의 기존 단일 crosswalk ID 기대값을 추가된 두 정확 행에 맞춰 갱신한 뒤 11개 모두 통과했다. 이 기술 회귀와 PR1960의 CI 성공은 보존한다. rev1 실제 등록은 거부됐다. rev2 PR1961은 CI 3 workflow/5 job SUCCESS와 병합까지 완료했고, 요청별 실제 등록·persist·Consumer 확인이 남아 있다.
- scratch 도구·초안은 보조물이다. 이 문서와 Git 원장만으로 확정 의미 판단을 재구성할 수 있어야 한다.

## 복사용 재개 프롬프트

> `icefoxtail/AP------`의 `review/m1-existing-meta-20261113` 최신 원격 체크포인트에서 중1 기존 시험지 메타 검토를 이어가 주세요. 먼저 Notion 필독 라우터와 최신 main, `docs/operations/m1-meta-review-20261113/HANDOFF.md` 및 `progress.json`을 읽으세요. 첫 신흥중2026 2학기 중간24문항의 읽기·의미 검토는 완료했습니다. 최초 PR1960은 병합됐지만 rev1 등록은 source tag annotation 충돌로 거부됐고 정본17은 적용되지 않았습니다. 이를 두 tag 필드만24문항에 정렬한 rev2 repair PR1961은 head `64650d1c2e34b49a0779769d8df502eb853ff693`의 CI 3 workflow/5 job 전체 SUCCESS 후 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`로 병합했습니다. 최신 main은 별도 PR1962 L3 부모 검색/helper 변경까지 포함한 `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`이며 source·정본은 이 별도 PR에서 바뀌지 않았습니다. 현재 상태는 `REV2_MERGED_WAITING_MAIN_REGISTRATION`, 운영 마감0/44·읽기24입니다. rev2 source blob `a8de75bc9cc2b6a4479866d75b8ebec637404a04`와 요청 `m1-shinheung-2026-mid-meta-review-20261113-rev2` SHA256 `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30`은 그대로입니다. 이미 끝낸 읽기·분류·수정·dry-run·PR생성·병합을 반복하지 말고, exacthead f2e의 writer run `43429595931` / job `131899473141`의 rev2 요청별 영수증과 persist 결과→24문항 Consumer→원격SHA 확인부터 진행하세요. Q8/Q10의 RPM EVIDENCE_DEBT와 수학 미검증 경계를 유지하고, 모두 확인한 뒤에만1장 마감 및2026 왕운중2학기 중간23문항으로 이동하세요. PR1962 변경도 함께 보존하고 미래 순번17·20·24·38·39·40은 PR1751 최신 범위를 확인하세요. R1/R2/R3를 새로 실행하거나 첫 시험지의 실제 풀이 resolver PASS를 만들지 마세요. taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner `GPT_ROOT_933015CD0A4F`를 유지하세요.

## 첫 시험지 기존 의미 검토와 rev1 이력

- 공식 v2 dry-run: `01-shinheung-registration-dry-run.json` — write:false, 24문항, 정본 변경17, fingerprint 보정24, Consumer/Search NOT_RUN.
- 학생용 데이터 보존: `01-shinheung-source-metadata-delta.json` — 24/24 전체 비메타 값 동일.
- 실제 분류 대조: `01-shinheung-classification-check.json` — exact22/RPM debt2. 수학 검수·실제 풀이 resolver PASS 주장이 아니다.
- 검증 경계: `01-shinheung-verification-boundary.json`.
- 새 정본 추가17: `01-shinheung-registry-additions.json`. MIDDLE_GEOMETRY의 기존 원·부채꼴 binding을 위한 scope append1건과 그 직접 영향4 binding/UID참조9개는 `01-shinheung-pack-scope-impact.json`에 있다.
- 최초 제출 당시 immutable 요청 경로: `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev1.json`, SHA256 `24ba8de0d00e494b91268a00771d6b7d30cc2a17ac57c76bb7f1bc30a7a10ede`. rev1 거부 이력을 보존하며 현재 처리 대상은 rev2다.
- rev1 병합 source: blob `930d4e3ef44e60757180aae6fc15fcc5b7228958`, raw SHA256 `bc4dcf03680da654dec43928f7b1a57942a6f616de9f03ca9ba3976203bd9a18`. 이는 두 annotation을 정정하기 전의 이력이며 현재 rev2 병합본의 hash는 위 rev2 절을 따른다.
- 정상 학생 데이터와 확정 분류는 보존했다. rev1의 정본17은 등록 거부로 적용되지 않았다. 같은 정본 변경을 담은 rev2의 실제 metadata/identity/native runtime 반영은 새 main writer 영수증으로 확인한다.

## PR과 캐시 참조 보완

- 첫 시험지 PR은 [1960](https://github.com/icefoxtail/AP------/pull/1960)이다. 최초 제출 head는 `8bab8a18877415b0d63ea79f01bf46d9a434be33`이다.
- 최초 CI의 336개 검사 중 335개가 통과했으며, 유일 실패는 공통 `rpm-middle-toc.js`의 HTML별 캐시 버전 불일치였다. 나머지 4개 HTML의 버전값을 `20261113-rpm-middle-shinheung-1`로 맞춰 총 6개 참조를 통일했다.
- 직접 영향 검사 `node tests/archive-cache-version-consistency.test.js`는 PASS다. source·요청·hash 결속 증거 및 helper 파일 내용은 이 보완에서 바뀌지 않았다.
- 수정 head `f0a89b11f7c085b08ab406831f0d2bc0681fefed`의 **5개 workflow / 7개 job 전체 SUCCESS**를 확인한 뒤 PR1960을 main `81fb1c3a7c861ede3690157234bf0415c2585e45`에 병합했다. [최초 CI 기록](01-shinheung-ci-initial.json), [수정 head CI 기록](01-shinheung-ci-fixed-head.json), [main 병합 체크포인트](01-shinheung-main-merge-checkpoint.json)를 참고한다. 실제 등록·Consumer 확인 전에는 운영 완료로 세지 않는다.

## 병행 작업과 향후 중복 범위

- 근거: [01-shinheung-concurrent-work-check.json](01-shinheung-concurrent-work-check.json), SHA256 `e06a73f3224e7c2eb44aa898a7c14e2ee1c2b21b52340c913b7e7bf1fc2e8891`.
- PR1751 head `ac702c3b21bb3ce67851f0d8831a3ad559fd7fd0`의 61개 요청 source header를 확인했다. 첫 신흥중2026 중1 2mid와 바로 다음 왕운중2026 중1 2mid는 각각 0건이다. PR1952는 REVIEW2 지원 코드 변경이며 두 시험지 source/request 변경은 없다.
- 아래 6개 미래 시험지는 PR1751과 source가 같다. 6개 요청 모두 `registryChanges: []`이므로 이번 17개 정본 추가·scope 변경과 정본 변경 키 충돌은 없었다. 문항별 적용 메타가 이미 정확하거나 완료됐다는 뜻은 아니며, **모두 PENDING을 유지한다.**

| 순번 | 시험지 | PR1751 요청 번호 |
|---:|---|---:|
| 17 | 2024 연향중 중1 2학기 기말 | 105 |
| 20 | 2024 향림중 중1 2학기 기말 | 106 |
| 24 | 2024 향림중 중1 2학기 중간 | 071 |
| 38 | 2019 연향중 중1 1학기 중간 | 101 |
| 39 | 2019 왕운중 중1 1학기 중간 | 087 |
| 40 | 2019 팔마중 중1 1학기 중간 | 098 |

- 각 순번 착수 전 PR1751 최신 head·상태·등록 영수증·현재 적용 상태를 다시 확인하여 중복 수정과 오래된 source 결속을 피한다. 정확한 source 경로와 요청 blob은 JSON 근거에 있다.
- PR1571은 공용 `rpm-active-resolver.mjs`, 오래된 draft PR711은 검색·단원별 기출·workspace HTML 3경로를 함께 변경한다. 이 보고서는 경로 중첩을 기록했으며 해당 브랜치의 충돌 해결을 주장하지 않는다.

## 다음 시험지 요청 생성

`checkpoint-tools/build-reviewed-exam-v2-request.mjs`와 같은 폴더의 `extract-reviewed-exam-projections.py`를 함께 사용한다. `--repo-root`를 실제 작업트리로 지정하고 입력·출력은 `.tmp/m1-meta-review/` 아래로 지정한다. source title·경로·문항 수·전 UID·owner 확인·최신 source/evidence SHA는 다음 시험지에 맞게 새로 결속한다. 이전 시험지의 요청 ID나 승인값을 복사하여 재사용하지 않는다. 공식 v2 등록기의 dry-run과 main writer 영수증이 최종 권위다.

향후 FINAL_QA 요청에서는 **실제 메타 의미 검토가 완료된 뒤** source의 `tagStatus`·`tagConfidence`와 공식 등록기가 부여할 메타 상태가 일치하는지 결속 전에 확인한다. 완료 근거가 있을 때만 필요한 두 annotation을 정렬하고 새 source blob으로 요청을 만든다. 기존 `reviewStatus`, 학생용 데이터, 문제 fingerprint, 해설·독립 수학 검증 플래그 및 RPM FINAL 상태는 이 이유로 바꾸지 않는다. source annotation의 정렬을 Consumer 충돌 검사에 대한 blanket waiver로 대체하지 않는다.
