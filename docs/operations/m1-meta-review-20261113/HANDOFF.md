# 중1 기존 시험지 메타 전수 검토 인계

## 현재 작업과 완료 범위

- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`
- owner: `GPT_ROOT_933015CD0A4F`
- 작업 브랜치: `review/m1-existing-meta-20261113`
- 중1 전체 대상: **44장 / 1,047문항**. 첫 시험지의 최초·보완 PR **1960·1961·1964는 병합**, 읽기·의미 검토는 **24문항**, 실제 등록·Consumer 확인까지 끝낸 **운영 마감은 0장**이다.
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
- source 메타 변경 문항은 **24문항**이다. 기존 원장의 의미/연결15 + binding2는 유지한다. rev3의 추가 부모 참조 보완은 **Q5·Q8**이며, Q8은 기존17에 포함되므로 분류·연결·부모 보완의 중복 없는 문항 수는 **18문항(기존17 + Q5)**이다. 메타 검토 완료 annotation24와 수학 검증·해설 수정 건수를 구분한다.
- 현재 상태는 **`REV3_MERGED_WAITING_MAIN_REGISTRATION`**다. PR [1964](https://github.com/icefoxtail/AP------/pull/1964)는 head `7dfc3fdea598c56c2d07f8db5c74bc9b71e2386d`의 **CI 4개 workflow / 6개 job 모두 SUCCESS** 후 2026-11-13 14:28:35 UTC에 병합됐다. 최신 확인 main은 `c9b908a0025c6d32b1add22b47543035e14b8784`, tree는 `e8a233eb8d12b9dd514bf4d977fc33e9d209737e`이며 root가 원격 source·request bytes를 확인했다. rev3의 공식 격리 Consumer 검증은 **24/24 PASS**, 실제 운영 등록은 아직 미확인으로 확인 건수 **0/24·정본17 적용 확인0건**, 운영 마감은 **0/44**다. rev3 거부를 관측한 상태가 아니다.
- 이 문서는 기존 **PR 생성 직전 안내를 대체하는 병합 후 체크포인트**다. 로컬 작업 브랜치는 main `c9b908a…`로 FF됐고, 관측된 원격 작업 브랜치는 아직 `7dfc3fd…`다. 이 세 문서의 새 원격 체크포인트 게시는 대기 중이며 미래 SHA를 추정하지 않는다. AWCR은 **revision13 검증 완료**, revision14는 원격 문서 체크포인트 게시 후 이어진다. 재개 시 최신 AWCR·원격 main·writer를 확인하며 **이미 병합한 PR1964를 새로 만들지 않는다.**
- exact main `c9b908a0025c6d32b1add22b47543035e14b8784`의 [rev3 main writer run 43443059116](https://github.com/icefoxtail/AP------/actions/runs/43443059116), [job 131945363207](https://github.com/icefoxtail/AP------/actions/runs/43443059116/job/131945363207)은 14:28:38 UTC에 시작했다. **14:29:24 UTC 관측은 checkout 진행 중**, 정확한 rev3 등록 영수증·persist·최종 원격24 Consumer는 아직 확인하지 않았다. 이 관측 이후 진행 상태는 최신 실행에서 다시 확인한다.
- rev2 repair PR [1961](https://github.com/icefoxtail/AP------/pull/1961)은 head `64650d1c2e34b49a0779769d8df502eb853ff693`의 **CI 3개 workflow / 5개 job 모두 SUCCESS** 후 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`, tree `25dcd5f8086207e5e630aa3ec51ba8ab6b95f69c`로 병합했다. [rev2 CI 근거](01-shinheung-rev2-ci.json)와 [rev2 병합 근거](01-shinheung-rev2-main-merge.json)를 재사용한다.
- 그 뒤 PR1962의 별도 L3 부모 검색/helper 변경이 main `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`에 병합됐다. 당시 tree는 `c5801f45830f1d2193b3222adc6fe5d92c412816`이다. 이 PR에서 원본 시험지와 정본은 바뀌지 않았고 rev2 source blob·SHA도 동일하다. 현재 작업 브랜치의 최신 main 병합 상태와 별도 작업을 보존한다.
- 최초 PR [1960](https://github.com/icefoxtail/AP------/pull/1960)은 head `f0a89b11f7c085b08ab406831f0d2bc0681fefed`의 **CI 5개 workflow / 7개 job 모두 SUCCESS** 후 main `81fb1c3a7c861ede3690157234bf0415c2585e45`에 병합했다. 당시 확인한 main tree는 `1f0eeecb4e7fafed89050c300b36aae949873437`이다. [main 병합 근거](01-shinheung-main-merge-checkpoint.json)와 [수정 head CI 근거](01-shinheung-ci-fixed-head.json)는 이 최초 PR의 이력으로 보존한다.
- [main writer 실행](https://github.com/icefoxtail/AP------/actions/runs/43421975843)과 [register job](https://github.com/icefoxtail/AP------/actions/runs/43421975843/job/131873926621)은 SUCCESS로 끝났지만, **rev1 요청은 `projection-verify`에서 REJECTED**였다. Q1의 source tag annotation과 등록기의 자동 메타 상태가 충돌했으며 정본 변경 17건은 적용되지 않았다. workflow SUCCESS를 요청 등록 PASS로 해석하지 않는다.
- source의 두 tag annotation을 24문항에 맞춘 rev2는 병합됐다. **rev2 공식 dry-run은 exit 0 / 5.801초 / write:false / 24문항 / 정본 변경17 / fingerprint 보정24 PASS**였으나, 실제 등록은 별도 결과다. exact merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`의 [rev2 main writer run 43429595931](https://github.com/icefoxtail/AP------/actions/runs/43429595931), [job 131899473141](https://github.com/icefoxtail/AP------/actions/runs/43429595931/job/131899473141)은 workflow/register/persist가 SUCCESS로 끝났지만 **rev2 요청은 `projection-verify`에서 Q5 `curriculumKey` 불일치로 REJECTED**였다. 실제 문항 등록은 0건이고 정본 변경17도 적용되지 않았다. [rev2 거부 기록](01-shinheung-registration-rev2-rejected.json)을 기준으로 운영 마감 **0/44**를 유지한다.
- 원장에는 메타 의미 검토와 수학·해설 FINAL QA를 구분하여 기록했다. 실제 풀이 RPM resolver는 `NOT_RUN_UNVERIFIED_SOLUTION`이며 dry-run·CI·workflow 성공을 독립 수학 검증이나 실제 등록 성공으로 해석하지 않는다.

### rev1 등록 거부와 rev2의 최소 수정

- rev1은 `qid_v1_d6bbf87bf0397aa29c28dd495d9c84c4bc2b33eac4873c56a7c5aa247eafdc31`(Q1)의 Consumer metadata conflict로 거부됐다. 읽기 전용 대조 결과 Q1–Q24 모두 `tagConfidence`, `tagStatus`만 source와 공식 FINAL_QA 등록값이 달랐다.
- 24문항의 source `tagConfidence: candidate_manual`을 `approved_final_qa`, `tagStatus: candidate_manual`을 `reviewed_pass`로 맞췄다. 이미 완료한 **메타 의미 검토 상태**를 반영한 변경이다. 그 외 모든 문항 값과 source/content fingerprint는 동일하다.
- source `reviewStatus`를 추가하지 않았고 R1·수학 검증·독립 검증·RPM FINAL 플래그도 바꾸지 않았다. Consumer 충돌 검사나 광범위한 면제도 변경하지 않았다. 분류 의미와 정본 변경 17건은 rev1과 같다.
- 현재 rev2 병합 source blob: `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA256: `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`. rev2 거부 후 main `2dd58ebe1abb9123206782979f4ac23e3b891c49`에서도 source는 동일하다.
- 거부된 rev2의 최초 inbox 경로는 `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev2.json`, SHA256은 `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30`이다. 제출본은 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`에서 확인할 수 있다. 현재 준비 요청은 **rev3**이며 아래 절의 SHA를 사용한다.
- [rev1 거부 기록](01-shinheung-registration-rev1-rejected.json), SHA256 `d33758236925429be7f323a4bcab4f011d446ca15b36b267a4323251a2b330df`.
- [tag annotation 수정·보존 근거](01-shinheung-tag-annotation-repair.json), SHA256 `2cab1eb2d69efbc6f0fcbb80f3dc41d2d40fbc5bc1e6a199f7c5e703095a33a0`.
- [rev2 공식 dry-run](01-shinheung-registration-rev2-dry-run.json), SHA256 `b4859e4a01ba624774ab2dd5faa3c98bad9c57c56f71b0f10a1c4dcceb686740`.
- [rev2 CI](01-shinheung-rev2-ci.json), SHA256 `6774dbcee746791603c16b4d98ff4c7c55d95099681064faec96a8ccae3b0a71`.
- [rev2 병합 및 최신 main 확인](01-shinheung-rev2-main-merge.json), SHA256 `8f9c0772bd4dccf301cb70494f501a7a2c7119a64514904e636a41e4a5f8f4db`.
- [rev2 실제 등록 거부](01-shinheung-registration-rev2-rejected.json), SHA256 `fa22b9789db1da1b6293bf5e04e4c8fc61e7515e248e13a2bc2dad498cba7382`.

### rev3 부모 연결 보완과 격리24 검증 완료

- root가 `/workspace/scratch/933015cd0a4f/m1-registration-repro`에서 공식 등록기를 사용해 rev2를 재현했다. 전체24 중22는 통과하고 **Q5·Q8만 `canonical_parent_missing`으로 실패**했다. 서버 실패 시점 catalog는 artifact에 없지만 같은 요청의 로컬 격리 재현으로 원인을 확인했다.
- Q5의 native 부모 **평면도형의 성질 / 다각형과 원**과 공식 부모 **평면도형 / 다각형**을 연결했다. 기존 PT/TPL·수학적 의미·RPM 경로·source의 FAMILY ID `M1-RPM-198`은 유지하고, exact 행 **`M1-RPM-198-DIAGONAL-FORMULA-20261113` 한 개만 add-only 추가**하여 `targetParentRef`로 참조했다. 기존 crosswalk244행은 불변이다.
- Q8은 공식 **기본 도형 / 위치 관계**의 parent-only 참조를 추가했다. RPM leaf를 만들지 않았으며 RPM 경로 null/HOLD와 EVIDENCE_DEBT를 보존했다. Q10은 기존 명시 binding 부모 **기본 도형 / 작도와 합동**을 유지했다.
- 현재 병합 요청: `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev3.json`, **파일 raw SHA256 `bd2b3223b3e45a920f2f57707fd9ea37621b13a550f6125edc66edfd3057826f`**, **영수증의 canonical request SHA256 `bd2014fead23196d068ad24de8529364cd81be83b4cd00dab898a2664798df50`**. 두 해시는 직렬화 기준이 다르므로 서로 직접 비교하지 않는다. source bytes/blob, 24문항의 요청 before/after와 UID/identityBefore, native 정본17 정의는 rev2와 동일하다. 바뀐 구조적 부모 참조는 Q5·Q8이며 evidence hash는 현재 crosswalk에 다시 결속했다.
- 공식 rev3 dry-run은 **PASS / write:false / 24문항 / 정본17 / fingerprint 보정24**다. 이와 별도로 격리 작업트리에서 공식 등록기·projection 검증과 실제 changed-UID Consumer 검증을 수행했다. **projection total24/canonical24/usable0, Consumer changed24/checked24/passed24/fail0/unobserved0**을 확인했다. 운영 main 등록·게시 결과는 아니다.
- 실제 격리 Consumer를 읽은 RPM 부모 감사는 **exact leaf22, debt Q8·Q10**으로 PASS다. Q8의 RPM coarse parent는 **`LEGACY_PARENT_AMBIGUOUS`**를 그대로 유지한다. Q8을 포함한 **native canonical 승인24 및 native query24 통과**와 RPM 부모 미해결1은 서로 다른 지표다. Q10은 leaf 없이 부모만 알려진 상태다. RPM 부모별 집계는 기본4 / 위치4 / 작도·합동6 / 다각형4 / 원·부채꼴5 / 미해결1이다.
- helper 검사18/18과 캐시 참조 검사는 PASS다. helper의 생성 블록 밖 코드는 PR1962 상태를 보존했고, 6개 HTML은 helper 버전 참조만 정렬했다. 문제·정답·해설·이미지·UID·난도 및 수학 검증 상태는 바꾸지 않았다. 실제 풀이 resolver는 계속 `NOT_RUN_UNVERIFIED_SOLUTION`이다.
- [격리 공식24 검증](01-shinheung-rev3-isolated-verification.json), SHA256 `f9da902fa20493e3780a02657ab8504edddf9c11eb224e1d11eecacafb70b0c0`.
- [격리 실제 RPM 부모 감사](01-shinheung-rev3-isolated-rpm-parents.json), SHA256 `9926d56aacd13a3c4769e27d5ce869757d73bf5f7bd694c5050eabbd1f568f6c`.
- [부모 연결 보완 근거](01-shinheung-canonical-parent-repair.json), SHA256 `025b76456d75f84c5f4f1c2aa73041eba1c96954232e7e6a2bffacf68877f8cb`. 이 문서는 검증 전 작성된 동결 repair 근거이며, 이후 PASS 상태는 위 격리 검증 보고서를 따른다. [rev3 요청 비교](01-shinheung-registration-rev3-compare.json)와 [공식 dry-run](01-shinheung-registration-rev3-dry-run.json)도 재사용한다.

### rev3 병합·CI 범위와 AutoMeta 직접 영향

- [rev3 CI 근거](01-shinheung-rev3-ci.json), SHA256 `7efc6460fc988f7bc002c70eed21022f0b3dcf6045c334ac9b12ab7d2a12ae31`: 4개 workflow / 6개 job 모두 SUCCESS다. PR CI의 준비는 materialize/build 및 선언된 데이터·브라우저·테스트 검사이며 **formal reviewed 요청 적용이나 이후 AutoMeta 실행을 수행하지 않았다.** 이를 해당24의 main 등록 또는 최종 승인 보존 증거로 쓰지 않는다.
- [rev3 병합·writer 관측 근거](01-shinheung-rev3-main-merge.json), SHA256 `40ba78ea21225431fb4f95d62c0b5a3f7bd1f3e9b12384f55a43af839d9a7bca`: PR1964 병합, 원격 main/source/request 결속과 위 writer 시작 관측을 보존한다.
- [AutoMeta 24문항 읽기 전용 계획 비교](01-shinheung-rev3-autometa-plan.json), SHA256 `acfb7b89f7f72aabb31bffd38e34e379385920c6a520025ccfd95b88900ecf47`: 격리 적용 rev3의 실제 metadata·identity·runtime·영수증과 실제 cursor `afefac26892e29f8930a1deff0c3a655d7e803a9`의 이전 source를 사용했다. 기존 main 코드와 PR1963 head `bf87023732ce9c2df135ed51d374fb8803fa24e7` 모두 **SUPPLEMENT_PENDING24 / APPLY0 / final0 / nativeReceipt 재사용0**, 사유가 같았고 승인·부모 변경 계획0이었다. current/runtime24는 native 영수증과 같고 메모리·입력파일은 불변이다.
- 보고서의 **`REVIEW_REQUIRED`는 기대한 native 영수증 재사용 경로에 도달하지 않았다는 표시**다. 선행 guard에서 이미 차단되며 Consumer 실패나 native 승인 손실 판정이 아니다. 이 결과는 **`ISOLATED_READONLY_PLAN`** 범위이고 전체 writer 또는 운영 main 증거가 아니다. PR1963은 이 exact input 보호의 선행조건이 아니며 **이 작업에서 병합하지 않았다.** guard를 만족시키려고 source·난도·번호·학생 데이터를 추가 수정하지 않는다.

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

1. 연결된 Notion 필독 라우터·Archive 시작·작업 생명주기와 **최신 AWCR safe checkpoint**를 확인한다. 최신 원격 main과 작업 브랜치 및 writer 상태를 조회한다. **PR1964는 이미 병합됐다.** 새 PR 생성이나 동일 요청 재등록부터 시작하지 않는다. AWCR revision13은 검증됐고 revision14는 이 원격 문서 체크포인트 게시 후 기록한다. 빈 메타 채우기 작업과 같은 시험지를 동시에 수정하지 않는다.
2. `progress.json`, rev1·rev2 거부 이력과 **rev3 격리 공식24 PASS 근거**를 읽는다. 읽기·분류 판단·annotation 정정·부모 보완·rev3 작성·격리 검증은 완료했다. source와 요청 hash를 대조하여 기존 증거를 재사용하고, 같은 candidate에 대한 읽기·원인 재현·검증을 다시 시작하지 않는다.
3. 단일 main writer run **43443059116 / job131945363207**, exact head `c9b908a0025c6d32b1add22b47543035e14b8784`의 진행을 확인한다. PR1960·1961·1964 이력과 source·확정 의미·PT/TPL·원래 정본17을 유지한다. PR1963을 의존성으로 병합하거나 AutoMeta guard를 맞추는 추가 변경을 하지 않는다.
4. writer의 **rev3 정확한 requestId 및 canonical request SHA에 대한 영수증**과 persist 결과를 확인한다. 원본 request의 raw SHA와 source blob/raw SHA도 따로 결속한다. CI·workflow·persist SUCCESS만으로 요청 등록 PASS를 판단하지 않는다. 현재 rev3 결과는 미관측이며, 이후 실제 거부가 있으면 실패 원인과 직접 영향만 처리한다.
5. 원격 main에서 **24문항 모두** native 분류·PT/TPL·승인 상태와 Consumer/native query 반영을 확인한다. RPM exact leaf22, Q8/Q10의 null + `EVIDENCE_DEBT`, Q8의 `LEGACY_PARENT_AMBIGUOUS`를 구분한다. 격리 PASS를 원격 main 검증으로 대체하지 않는다. 독립 풀이 `VERIFIED_FINAL` 근거가 없으므로 실제 풀이 resolver PASS나 새 R1/R2/R3 PASS를 만들지 않는다.
6. 실제 등록 영수증·24문항 Consumer와 RPM 부모 감사 결과를 최신 원격 main SHA에 결속한다. PR1962 변경과 최신 병행 작업을 보존한다. 모두 확인된 뒤에만 첫 시험지를 운영 마감하고 `completedExams`를 1로 바꾼다. 마감 문서·원격 체크포인트·AWCR을 저장하고 다시 확인한 다음 2026 왕운중 2학기 중간 23문항으로 이동한다. 그전에는 `currentOrder: 1`, 운영 마감 0/44를 유지한다.
7. 향후 순번 **17·20·24·38·39·40**은 PR1751과 같은 시험지 범위다. 각 시험지 착수 전에 해당 PR의 최신 head·상태·등록 영수증과 실제 적용 메타를 재확인한다. 아래 병행 작업 근거를 따른다.

## 보존 및 검증 경계

- 기존 읽기 증거: `01-shinheung-semantic-read-checkpoint.json`.
- 기존 후보: `01-shinheung-first-half-candidate.json`, `01-shinheung-candidate-comparison.json`.
- fingerprint 진단: `01-shinheung-fingerprint-preflight.json` — 24/24 불일치와 공식 검증 함수의 명시적 repair 수용을 기록했다. 등록 완료 증거는 아니다.
- 공용 metadata/identity/runtime/compiled 대형 파일을 직접 편집하지 않는다. 서버 writer가 소형 v2 요청을 적용한다.
- 전체 시험지의 과거 수학 검수 완료를 추정하거나 새 R1/R2/R3 PASS를 만들지 않는다.
- 로그인 셸 지연은 exec의 login:false로 해소했다. 기존 resolver29 및 helper11 회귀와 PR1960·1961의 CI·병합 이력은 보존한다. **rev1·rev2 실제 요청 등록은 모두 거부됐다.** 이후 rev3 helper18/18·캐시 검사와 격리 공식 Consumer24/24는 PASS이고 PR1964도 CI4/6 성공 후 병합됐다. **rev3 원격 main의 실제 등록 영수증·최종24 확인은 아직 남아 있다.**
- scratch 도구·초안은 보조물이다. 이 문서와 Git 원장만으로 확정 의미 판단을 재구성할 수 있어야 한다.

## 복사용 재개 프롬프트

> `icefoxtail/AP------`의 `review/m1-existing-meta-20261113`에서 중1 기존 시험지 검토를 이어가 주세요. Notion 필독 라우터·최신 AWCR safe checkpoint·최신 원격 main·writer와 `docs/operations/m1-meta-review-20261113/HANDOFF.md`, `progress.json`을 먼저 확인하세요. 첫 신흥중 2026 중1 2학기 중간24문항은 읽기·의미 검토를 완료했습니다. PR1960·1961의 rev1·rev2 실제 등록은 거부됐지만, 보완 rev3 PR1964는 head `7dfc3fdea598c56c2d07f8db5c74bc9b71e2386d`에서 CI4 workflow/6 job 성공 후 main `c9b908a0025c6d32b1add22b47543035e14b8784`로 이미 병합됐습니다. 현재 상태는 `REV3_MERGED_WAITING_MAIN_REGISTRATION`, 운영 마감0/44·읽기24이며 rev3 실제 등록 영수증은 미관측입니다. writer run43443059116/job131945363207 exact c9b head의 마지막 관측은 2026-11-13 14:29:24 UTC checkout 진행 중입니다. PR을 재생성하거나 같은 source 읽기·의미 판단·수정·격리검증·R1/R2/R3를 반복하지 마세요. source blob `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`는 불변입니다. 요청 `m1-shinheung-2026-mid-meta-review-20261113-rev3`의 raw SHA는 `bd2b3223b3e45a920f2f57707fd9ea37621b13a550f6125edc66edfd3057826f`, 영수증 canonical SHA는 `bd2014fead23196d068ad24de8529364cd81be83b4cd00dab898a2664798df50`이며 둘을 혼동하지 마세요. 격리 공식 projection canonical24/usable0, 실제 candidate Consumer24/24 PASS 근거는 `01-shinheung-rev3-isolated-verification.json` SHA `f9da902fa20493e3780a02657ab8504edddf9c11eb224e1d11eecacafb70b0c0`입니다. CI는 formal reviewed/AutoMeta를 실제 실행하지 않았습니다. 읽기 전용 AutoMeta 비교는 두 버전 모두 SUPPLEMENT_PENDING24/APPLY0이므로 PR1963은 선행조건이 아니며 이 작업에서 병합하지 않았습니다. 해당 보고서 REVIEW_REQUIRED를 Consumer 실패로 해석하거나 guard를 맞추려고 source·난도를 바꾸지 마세요. 기존 의미15+binding2에 Q5 부모 보완을 더한 실질수정 unique18, source annotation변경24·native정본17을 유지하세요. RPM exact leaf22/debt8·10, Q8 coarse parent LEGACY_PARENT_AMBIGUOUS를 native canonical 승인과 구분하며 실제 풀이 resolver는 NOT_RUN_UNVERIFIED_SOLUTION입니다. 이제 단일 writer의 exact rev3 영수증→최종 원격24 native Consumer와 RPM 부모 감사→원격 SHA→마감 문서/원격 체크포인트/AWCR→첫 시험지 마감 순서로 이어가고, 그 뒤 왕운중23문항을 시작하세요. AWCR revision13은 검증됐고 revision14는 원격 문서 체크포인트 게시 후 기록할 예정입니다. 이후 시험지도 전체 N문항 exact candidate Consumer preflight를 재사용하세요. PR1962와 병행 작업을 보존하며 미래 순번17·20·24·38·39·40은 PR1751 최신 범위를 확인하세요. taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner `GPT_ROOT_933015CD0A4F`를 유지하세요.

## 첫 시험지 기존 의미 검토와 rev1 이력

- 공식 v2 dry-run: `01-shinheung-registration-dry-run.json` — write:false, 24문항, 정본 변경17, fingerprint 보정24, Consumer/Search NOT_RUN.
- 학생용 데이터 보존: `01-shinheung-source-metadata-delta.json` — 24/24 전체 비메타 값 동일.
- 실제 분류 대조: `01-shinheung-classification-check.json` — exact22/RPM debt2. 수학 검수·실제 풀이 resolver PASS 주장이 아니다.
- 검증 경계: `01-shinheung-verification-boundary.json`.
- 새 정본 추가17: `01-shinheung-registry-additions.json`. MIDDLE_GEOMETRY의 기존 원·부채꼴 binding을 위한 scope append1건과 그 직접 영향4 binding/UID참조9개는 `01-shinheung-pack-scope-impact.json`에 있다.
- 최초 제출 당시 immutable 요청 경로: `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev1.json`, SHA256 `24ba8de0d00e494b91268a00771d6b7d30cc2a17ac57c76bb7f1bc30a7a10ede`. rev1·rev2는 모두 거부 이력이며 현재 rev3는 격리 검증·PR1964 병합을 마치고 정확한 main 등록 영수증을 기다린다.
- rev1 병합 source: blob `930d4e3ef44e60757180aae6fc15fcc5b7228958`, raw SHA256 `bc4dcf03680da654dec43928f7b1a57942a6f616de9f03ca9ba3976203bd9a18`. 이는 두 annotation을 정정하기 전의 이력이며 현재 rev2 병합본의 hash는 위 rev2 절을 따른다.
- 정상 학생 데이터와 확정 분류는 보존했다. rev1·rev2의 정본17은 등록 거부로 적용되지 않았다. 보완 요청의 실제 metadata/identity/native runtime 반영은 향후 요청별 main writer 영수증으로 확인한다.

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

이번 실패에서 확인한 등록 전 필수 경계: **키가 유효하거나 dry-run이 PASS여도 실제 Consumer 부모 투영은 실패할 수 있다.** 향후 매 시험지는 해당 source·request에 결속한 **전체 N문항 exact candidate Consumer preflight**를 공식 등록기와 격리 작업트리에서 재사용한다. 이번 24문항처럼 changed/checked/passed가 모두 N이고 failures/unobserved가0인지 확인하고, native canonical 승인과 RPM leaf/debt·부모 모호성을 따로 기록한다. 유효한 기존 증거를 재사용하고 R1/R2/R3를 반복하지 않는다. 병합 후에는 운영 main의 실제 요청별 영수증·전체 Consumer를 다시 확인한다.

향후 FINAL_QA 요청에서는 **실제 메타 의미 검토가 완료된 뒤** source의 `tagStatus`·`tagConfidence`와 공식 등록기가 부여할 메타 상태가 일치하는지 결속 전에 확인한다. 완료 근거가 있을 때만 필요한 두 annotation을 정렬하고 새 source blob으로 요청을 만든다. 기존 `reviewStatus`, 학생용 데이터, 문제 fingerprint, 해설·독립 수학 검증 플래그 및 RPM FINAL 상태는 이 이유로 바꾸지 않는다. source annotation의 정렬을 Consumer 충돌 검사에 대한 blanket waiver로 대체하지 않는다.
