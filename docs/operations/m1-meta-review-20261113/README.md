# 중1 기존 시험지 메타 전수 검토

**2026년부터 내림차순 / 44장·1,047문항 / 첫 시험지 PR1960·1961 병합 / 읽기 24문항 / 운영 마감 0장**

RPM 6권 L1/L2 선행 정리는 PR1958, main `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`로 완료했다. 첫 대상인 2026 신흥중 2학기 중간24문항은 모두 읽고 의미 판단을 확정했다. 15문항의 분류·빈 유형 연결과 2문항의 binding을 보완하며, Q8/Q10의 RPM-only EVIDENCE_DEBT는 남긴다.

rev2까지 **source 메타 변경은 24문항**이다. 분류·연결 보완은 17문항(15+2)이며, 검토 완료 tag annotation은 24문항 모두 정렬했다. 문항·정답·해설을 고친 수치나 수학 QA 승인 수치가 아니다.

현재 상태는 **`REV2_REJECTED_PARENT_LINK_REPAIR_IN_PROGRESS`**다. rev2 repair PR [1961](https://github.com/icefoxtail/AP------/pull/1961)은 head `64650d1c2e34b49a0779769d8df502eb853ff693`의 **CI 3 workflow / 5 job 전체 SUCCESS** 후 merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`, tree `25dcd5f8086207e5e630aa3ec51ba8ab6b95f69c`로 병합했지만 실제 요청 등록은 거부됐다. [rev2 CI](01-shinheung-rev2-ci.json)와 [rev2 병합 근거](01-shinheung-rev2-main-merge.json)는 이력으로 보존한다.

최신 확인 main은 `2dd58ebe1abb9123206782979f4ac23e3b891c49`이며 작업 브랜치에 정상 병합했다. 앞선 PR1962의 L3 부모 검색/helper 변경(main `3cc9e93b28d9f97f202c4bfd96a116d9fa42d7fb`, tree `c5801f45830f1d2193b3222adc6fe5d92c412816`)도 보존한다. 원본 시험지의 rev2 source blob·SHA는 동일하다.

최초 PR [1960](https://github.com/icefoxtail/AP------/pull/1960)은 head `f0a89b11f7c085b08ab406831f0d2bc0681fefed`의 **CI 5 workflow / 7 job SUCCESS** 후 main `81fb1c3a7c861ede3690157234bf0415c2585e45`에 병합했다. 최초 캐시 참조 오류 수정과 [CI 근거](01-shinheung-ci-fixed-head.json), [병합 근거](01-shinheung-main-merge-checkpoint.json)는 이력으로 보존한다.

[main writer run 43421975843](https://github.com/icefoxtail/AP------/actions/runs/43421975843)은 SUCCESS로 종료됐지만 **rev1 요청은 `projection-verify`에서 REJECTED**였다. source의 `tagConfidence`·`tagStatus`가 등록기 자동 값과 달라 Q1에서 거부됐으며 **정본 변경17은 적용되지 않았다**. [요청별 거부 근거](01-shinheung-registration-rev1-rejected.json)를 workflow 결론과 구분한다.

rev2는 24문항의 source 두 tag 필드만 완료한 메타 검토 상태에 맞췄다. 그 외 모든 문항 값·fingerprint, 확정 분류와 정본 변경17은 동일하다. source `reviewStatus`, 수학 검증·R1·RPM FINAL 플래그 및 충돌 guard는 바꾸지 않았다. [annotation 수정 근거](01-shinheung-tag-annotation-repair.json)와 [rev2 공식 dry-run](01-shinheung-registration-rev2-dry-run.json)을 보존한다. dry-run은 **exit0 / 5.801초 / write:false / 24문항 / 정본17 / fingerprint24 PASS**다.

현재 rev2 병합 source blob은 `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA256은 `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`다. 거부된 마지막 요청 `m1-shinheung-2026-mid-meta-review-20261113-rev2`의 SHA256은 `267ab2f0a9abcb465030af0d198cd0b676b0ff465f730bdb625e50a8f5782f30`이다. rev1 SHA `24ba8de0d00e494b91268a00771d6b7d30cc2a17ac57c76bb7f1bc30a7a10ede`도 이력으로 유지한다. rev3 요청 파일과 새 PR은 아직 없다.

exact merge `f2e98717e9c3dc242683d5614376ecfd1e3c2ee6`의 [rev2 main writer run 43429595931](https://github.com/icefoxtail/AP------/actions/runs/43429595931), [job 131899473141](https://github.com/icefoxtail/AP------/actions/runs/43429595931/job/131899473141)은 workflow/register/persist가 SUCCESS로 끝났지만 **rev2 요청은 `projection-verify`에서 Q5 `curriculumKey` 불일치로 REJECTED**였다. 실제 문항 등록 **0/24**, 정본17 적용 **0건**, 운영 마감 **0/44**다. [rev2 거부 근거](01-shinheung-registration-rev2-rejected.json)의 SHA256은 `fa22b9789db1da1b6293bf5e04e4c8fc61e7515e248e13a2bc2dad498cba7382`다.

정적 원인은 Q5의 native 부모 **평면도형의 성질 / 다각형과 원**과 공식 부모 **평면도형 / 다각형**의 불일치다. Q5에는 `targetParentRef`가 없으며, Consumer가 부모를 인정하지 않아 canonical 값이 비워지는 경로가 확인됐다. 실패 시점 실제 catalog 값은 아직 미관측이다. Q8도 유사 후보로 실제 재현을 준비·진행 중이며, Q10은 binding에 공식 부모가 명시돼 있다.

root는 `/workspace/scratch/933015cd0a4f/m1-registration-repro`의 격리 작업트리에서 공식 rev2 등록기의 로컬 재현을 시작했다. **운영 등록·게시 또는 실제 24 Consumer PASS를 뜻하지 않는다.** 새 PR 전에 원인을 재현하고, Q5 exact crosswalk add-only + `targetParentRef`, Q8 parent-only 참조와 RPM debt 유지 방향을 확인한다. source·확정 의미·기존 PT/TPL·원래 정본17 변경안은 보존한다.

진행 목록은 [progress.json](progress.json), 다음 작업자는 [HANDOFF.md](HANDOFF.md), 확정 문항별 판단은 [01-shinheung-semantic-review.json](01-shinheung-semantic-review.json)을 읽는다. 과거 candidate 파일은 변경 이력이며 확정 원장을 대신하지 않는다.

재개할 작업은 **격리 환경의 실제24 Consumer 재현 → 부모 연결 보완·rev3 요청 → 격리 실제24 검증 → 새 PR/CI/main writer → 요청별 실제 영수증·24 Consumer → 원격 main SHA → 첫 시험지 마감 → 왕운중**이다. 현재 rev3·새 PR·격리24 PASS는 미완료다. root의 격리 실행을 중복 시작하지 않으며 완료한 읽기·의미 판단·annotation 정정·PR1960/1961을 반복하지 않는다. R1/R2/R3를 새로 수행하거나 독립 풀이 검증 완료를 주장하지 않는다. 이후 FINAL_QA 요청도 실제 메타 검토 완료 근거로 source tag annotation을 정렬하고, Consumer 충돌 검사를 일괄 면제하지 않는다.

향후 순번 **17·20·24·38·39·40**은 PR1751과 같은 시험지 범위다. 모두 PENDING을 유지하고 착수 전 최신 PR 범위·등록 적용 상태를 확인한다. [병행 작업 보고서](01-shinheung-concurrent-work-check.json)에 정확한 source·요청·head 및 정본 변경 키 충돌 확인 범위를 기록했다.
