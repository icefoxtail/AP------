# 중1 기존 시험지 메타 전수 검토

**2026년부터 내림차순 / 44장·1,047문항 / 첫 시험지 PR1960·1961·1964 병합 / 읽기 24문항 / 운영 마감 0장**

RPM 6권 L1/L2 선행 정리는 PR1958, main `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`로 완료했다. 첫 대상인 2026 신흥중 2학기 중간24문항은 모두 읽고 의미 판단을 확정했다. 15문항의 분류·빈 유형 연결과 2문항의 binding을 보완하며, Q8/Q10의 RPM-only EVIDENCE_DEBT는 남긴다.

**source 메타 변경은 24문항**이다. 기존 원장의 의미/연결15 + binding2는 유지한다. rev3 부모 참조 보완은 Q5·Q8이며 Q8은 기존17에 포함되므로 **분류·연결·부모 보완의 중복 없는 문항 수는18(기존17+Q5)**이다. 검토 완료 tag annotation24와 문항·정답·해설 수정 또는 수학 QA 승인을 구분한다.

현재 상태는 **`REV3_MERGED_WAITING_MAIN_REGISTRATION`**다. rev3 PR [1964](https://github.com/icefoxtail/AP------/pull/1964)는 head `7dfc3fdea598c56c2d07f8db5c74bc9b71e2386d`의 **CI 4 workflow / 6 job 전체 SUCCESS** 후 2026-11-13 14:28:35 UTC에 main `c9b908a0025c6d32b1add22b47543035e14b8784`, tree `e8a233eb8d12b9dd514bf4d977fc33e9d209737e`로 병합됐다. root가 원격 source·request bytes를 확인했다. 공식 격리 Consumer24/24는 PASS지만 **실제 rev3 영수증·최종 원격24는 아직 미확인**이며, 등록 확인 건수0/24·정본17 적용 확인0건·**운영 마감0/44**를 유지한다. rev3가 거부됐다는 뜻은 아니다.

이 문서는 이전 PR 생성 직전 안내를 대체한다. **이미 병합한 PR1964를 다시 만들지 않는다.** 로컬 작업 브랜치는 main `c9b908a…`로 FF됐고 관측된 원격 작업 브랜치는 `7dfc3fd…`다. 현재 세 문서의 원격 체크포인트 게시는 대기 중이다. AWCR revision13은 검증됐으며 revision14는 원격 문서 체크포인트 게시 후 기록한다. 미래 체크포인트 SHA나 AWCR 저장 완료를 추정하지 않는다.

exact main `c9b908a0025c6d32b1add22b47543035e14b8784`의 [rev3 main writer run 43443059116](https://github.com/icefoxtail/AP------/actions/runs/43443059116), [job 131945363207](https://github.com/icefoxtail/AP------/actions/runs/43443059116/job/131945363207)은 14:28:38 UTC에 시작했다. **14:29:24 UTC 마지막 관측은 checkout 진행 중**이며 정확한 rev3 영수증·persist·최종 Consumer는 미관측이다. [병합·writer 근거](01-shinheung-rev3-main-merge.json) SHA256은 `40ba78ea21225431fb4f95d62c0b5a3f7bd1f3e9b12384f55a43af839d9a7bca`다.

rev2 repair PR [1961](https://github.com/icefoxtail/AP------/pull/1961)은 head `64650d1c2e34b49a0779769d8df502eb853ff693`의 **CI 3 workflow / 5 job 전체 SUCCESS** 후 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`, tree `25dcd5f8086207e5e630aa3ec51ba8ab6b95f69c`로 병합했지만 실제 요청 등록은 거부됐다. [rev2 CI](01-shinheung-rev2-ci.json)와 [rev2 병합 근거](01-shinheung-rev2-main-merge.json)는 이력으로 보존한다.

rev3 작업 기준 main은 `2dd58ebe1abb9123206782979f4ac23e3b891c49`였으며 최신 병합 main은 위 `c9b908a…`다. 앞선 PR1962의 L3 부모 검색/helper 변경(main `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`, tree `c5801f45830f1d2193b3222adc6fe5d92c412816`)도 보존한다. 원본 시험지의 rev2 source blob·SHA는 동일하다.

최초 PR [1960](https://github.com/icefoxtail/AP------/pull/1960)은 head `f0a89b11f7c085b08ab406831f0d2bc0681fefed`의 **CI 5 workflow / 7 job SUCCESS** 후 main `81fb1c3a7c861ede3690157234bf0415c2585e45`에 병합했다. 최초 캐시 참조 오류 수정과 [CI 근거](01-shinheung-ci-fixed-head.json), [병합 근거](01-shinheung-main-merge-checkpoint.json)는 이력으로 보존한다.

[main writer run 43421975843](https://github.com/icefoxtail/AP------/actions/runs/43421975843)은 SUCCESS로 종료됐지만 **rev1 요청은 `projection-verify`에서 REJECTED**였다. source의 `tagConfidence`·`tagStatus`가 등록기 자동 값과 달라 Q1에서 거부됐으며 **정본 변경17은 적용되지 않았다**. [요청별 거부 근거](01-shinheung-registration-rev1-rejected.json)를 workflow 결론과 구분한다.

rev2는 24문항의 source 두 tag 필드만 완료한 메타 검토 상태에 맞췄다. 그 외 모든 문항 값·fingerprint, 확정 분류와 정본 변경17은 동일하다. source `reviewStatus`, 수학 검증·R1·RPM FINAL 플래그 및 충돌 guard는 바꾸지 않았다. [annotation 수정 근거](01-shinheung-tag-annotation-repair.json)와 [rev2 공식 dry-run](01-shinheung-registration-rev2-dry-run.json)을 보존한다. dry-run은 **exit0 / 5.801초 / write:false / 24문항 / 정본17 / fingerprint24 PASS**다.

현재 source blob은 `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA256은 `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`로 rev2와 완전히 동일하다. 병합된 요청 **`m1-shinheung-2026-mid-meta-review-20261113-rev3`**의 **파일 raw SHA256은 `bd2b3223b3e45a920f2f57707fd9ea37621b13a550f6125edc66edfd3057826f`**, **영수증 canonical request SHA256은 `bd2014fead23196d068ad24de8529364cd81be83b4cd00dab898a2664798df50`**다. 직렬화 기준이 다른 두 해시를 혼동하지 않는다. rev2 SHA `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30` 및 rev1 SHA `24ba8de0d00e494b91268a00771d6b7d30cc2a17ac57c76bb7f1bc30a7a10ede`는 거부 이력으로 유지한다.

exact merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`의 [rev2 main writer run 43429595931](https://github.com/icefoxtail/AP------/actions/runs/43429595931), [job 131899473141](https://github.com/icefoxtail/AP------/actions/runs/43429595931/job/131899473141)은 workflow/register/persist가 SUCCESS로 끝났지만 **rev2 요청은 `projection-verify`에서 Q5 `curriculumKey` 불일치로 REJECTED**였다. 실제 문항 등록 **0/24**, 정본17 적용 **0건**, 운영 마감 **0/44**다. [rev2 거부 근거](01-shinheung-registration-rev2-rejected.json)의 SHA256은 `fa22b9789db1da1b6293bf5e04e4c8fc61e7515e248e13a2bc2dad498cba7382`다.

공식 등록기의 격리 재현에서 rev2는22/24 통과했고 **Q5·Q8만 `canonical_parent_missing`으로 실패**했다. rev3는 Q5의 기존 source FAMILY198·PT/TPL·RPM 경로를 유지하며 exact crosswalk 한 개를 add-only 추가하고 `targetParentRef`로 연결했다. Q8은 공식 부모만 참조하고 RPM null/HOLD·EVIDENCE_DEBT를 유지했다. Q10은 기존의 명시된 부모를 보존했다. source24문항, 요청 before/after·identity24, 원래 native 정본17 정의는 동일하다.

rev3 공식 dry-run은24/17 PASS다. 별도 격리 검증에서 **projection total24/canonical24/usable0, 실제 candidate Consumer changed24/checked24/passed24/fail0/unobserved0**을 확인했다. helper18/18·캐시 참조 검사도 PASS이고 6개 HTML은 helper 버전 참조만 정렬했다. **운영 main 등록·게시 결과와 구분하며 운영 완료0/44를 유지한다.** [격리 공식24 검증](01-shinheung-rev3-isolated-verification.json)의 SHA256은 `f9da902fa20493e3780a02657ab8504edddf9c11eb224e1d11eecacafb70b0c0`다.

[실제 RPM 부모 감사](01-shinheung-rev3-isolated-rpm-parents.json)는 exact leaf22/debt Q8·Q10으로 PASS다. 부모 집계는 기본4 / 위치4 / 작도·합동6 / 다각형4 / 원·부채꼴5 / 미해결1이다. Q8의 RPM coarse parent **`LEGACY_PARENT_AMBIGUOUS`**와 Q10의 parent-only 상태를 유지한다. Q8을 포함한 **native canonical 승인24·native query24 통과**는 이 RPM 지표와 별개다. 부모 감사 SHA는 `9926d56aacd13a3c4769e27d5ce869757d73bf5f7bd694c5050eabbd1f568f6c`, [부모 보완 근거](01-shinheung-canonical-parent-repair.json) SHA는 `025b76456d75f84c5f4f1c2aa73041eba1c96954232e7e6a2bffacf68877f8cb`다. 실제 풀이 resolver는 계속 `NOT_RUN_UNVERIFIED_SOLUTION`이다.

[rev3 CI](01-shinheung-rev3-ci.json)의 SHA256은 `7efc6460fc988f7bc002c70eed21022f0b3dcf6045c334ac9b12ab7d2a12ae31`다. **이 PR CI는 formal reviewed 요청 적용과 이후 AutoMeta를 실제 실행하지 않았다.** CI 4/6 SUCCESS는 선언된 검사 범위의 성공이며 최종 main 등록 증거를 대신하지 않는다.

[AutoMeta 직접 영향 계획](01-shinheung-rev3-autometa-plan.json), SHA256 `acfb7b89f7f72aabb31bffd38e34e379385920c6a520025ccfd95b88900ecf47`은 격리 적용 rev3의 실제24와 실제 이전 cursor를 사용한 **ISOLATED_READONLY_PLAN**이다. 기존 main과 PR1963 head `bf87023732ce9c2df135ed51d374fb8803fa24e7` 모두 선행 guard에서 **SUPPLEMENT_PENDING24 / APPLY0 / final0 / nativeReceipt 재사용0**이며 사유가 같고 승인·부모 변경 계획0이다. current/runtime24는 영수증과 같고 입력은 불변이다. 보고서의 **REVIEW_REQUIRED는 기대한 native 재사용 경로에 도달하지 않았다는 의미이며 Consumer 실패가 아니다.** PR1963은 이 입력 보호의 선행조건이 아니고 이 작업에서 병합하지 않았다. source·난도·번호·학생 데이터를 guard에 맞추려고 바꾸지 않는다.

진행 목록은 [progress.json](progress.json), 다음 작업자는 [HANDOFF.md](HANDOFF.md), 확정 문항별 판단은 [01-shinheung-semantic-review.json](01-shinheung-semantic-review.json)을 읽는다. 과거 candidate 파일은 변경 이력이며 확정 원장을 대신하지 않는다.

재개할 작업은 **최신 AWCR·단일 main writer 확인 → exact rev3 영수증 → 최종 원격24 native Consumer 및 RPM 부모 감사 → 원격 main SHA 결속 → 마감 문서·원격 체크포인트·AWCR 확인 → 첫 시험지 마감 → 왕운중23문항**이다. PR1964 생성·병합은 완료했다. 완료한 읽기·의미 판단·원인 재현·격리24 검증을 반복하지 않는다. 이후 매 시험지도 전체 N문항의 exact candidate Consumer preflight를 재사용하여 changed/checked/passed=N, failures/unobserved=0인지 확인한다. **키 유효성이나 dry-run PASS만으로 운영 반영을 판단하지 않는다.** R1/R2/R3를 새로 수행하거나 독립 풀이 검증 완료를 주장하지 않으며 Consumer 충돌 검사를 일괄 면제하지 않는다.

향후 순번 **17·20·24·38·39·40**은 PR1751과 같은 시험지 범위다. 모두 PENDING을 유지하고 착수 전 최신 PR 범위·등록 적용 상태를 확인한다. [병행 작업 보고서](01-shinheung-concurrent-work-check.json)에 정확한 source·요청·head 및 정본 변경 키 충돌 확인 범위를 기록했다.
