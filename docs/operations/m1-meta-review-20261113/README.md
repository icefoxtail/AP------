# 중1 기존 시험지 메타 전수 검토

**2026년부터 내림차순 / 44장·1,047문항 / 운영 완료1장·남은43장 / 읽기24문항 / 다음 왕운중23문항 미착수**

## 첫 시험지 운영 마감

| 학교·연도·시험 종류 | 총 문항 | 수정 문항 | 주요 오류 | PR | 실제 Consumer 검증 main | 남은 시험지 |
|---|---:|---|---|---|---|---:|
| 신흥중·2026·중1 2학기 중간 | 24 | source 메타24 / 분류·연결·부모 보완18 | 작도·합동 조건과 합동 적용 혼동, 정다각형 각 유형, 교차 도형 각, 평각 분할, native 부모 연결 | [1960](https://github.com/icefoxtail/AP------/pull/1960)·[1961](https://github.com/icefoxtail/AP------/pull/1961)·[1964](https://github.com/icefoxtail/AP------/pull/1964) | `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4` | 43 |

첫 시험지는 **`OPERATIONALLY_CLOSED_WITH_DOCUMENTED_RPM_DEBT`**다. 최종 [운영 마감 근거](01-shinheung-operational-closeout.json)의 SHA256은 **`4e09f45f79d5dcfb8be9ecb89db2dcc6d2ae27e5b188f4e6cf4ab83ee392dfb0`**이며, 실제 검증한 main `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4`, tree `844c8b82fa19b4dcd7630313e67600e194a69ebd`에 결속된다.

**최신 관측 main은 `33f26c795e7a86fc3b63737996c6885cff4c7bba`, tree `44e7715767ee751eb7ef31b0ad9b548be082fea5`다.** 후속 writer43444692701도 SUCCESS로 끝났다. cb3 이후 바뀐 경로는 `.archive-meta-register/auto/state.json`과 `writer-state.json`뿐이며 archive/docs/tools/tests subtree가 동일하다. [cursor-only main 전진 근거](01-shinheung-main-cursor-only-advance.json), SHA256 **`2cff3e6bca78775fe4703e58708fef979f68284bef218fdd3b18dba839afe1b1`**에 따라 cb3에서 수행한 실제24 Consumer·RPM 부모 검증을 재사용한다. main33에서 검사를 다시 실행했다고 기록하지 않는다.

의미/빈 유형 연결15문항과 binding 보완2문항에 Q5 부모 연결을 추가하여 **실질 수정은 unique18문항**이다. Q8 부모 보완은 기존17에 포함된다. 검토 완료 tag annotation은24문항에 정렬했으므로 source 메타 변경은24다. 문제·정답·해설·이미지·UID·배점·난도는 보존했다.

### 실제 등록·Consumer 결과

- rev3 영수증 **REGISTERED24 / runtime24 / 정본17 / fingerprint 보정24**를 확인했다. 실제 receipt raw SHA256은 `aea5a3bb228638586c4a36c3eb4d1e8528d76d5a3787a0f52bcac8ab2f2c9054`다.
- writer의 **AutoMeta 이후 최종 Consumer**와 root의 **독립 clean-main Consumer**가 각각 changed24/checked24/passed24, failures0/unobserved0/assignmentPending0이다. 공식 projection은 canonical24/usable0이다.
- 실제 main RPM 부모 감사는 **exact leaf22 / debt Q8·Q10**으로 PASS다. Q8의 `LEGACY_PARENT_AMBIGUOUS`, Q10의 parent-only 상태를 유지한다. native24 승인·조회 성공과 RPM debt·부모 모호성은 분리하여 기록한다.
- 실제 풀이 resolver는 **`NOT_RUN_UNVERIFIED_SOLUTION`**이다. R1/R2/R3를 재실행하지 않았고 `examFinalQaStatus: NOT_EVALUATED_BY_REGISTRAR`를 유지한다. 이번 완료는 전체 문항의 메타 의미 검토·운영 반영이다.

| 실제 근거 | SHA256 |
|---|---|
| [등록·persist](01-shinheung-rev3-main-registration.json) | `f30499220c5f3e2fdf75807d1a4e3774ba8c25728000316dfc4a57e4715ecf0d` |
| [writer 최종 Consumer](01-shinheung-rev3-writer-final-consumer.json) | `cfe2f070dbb0f588d235f5bf50d989d4ed937723368f3a891ce0143aef6f376e` |
| [독립 main projection](01-shinheung-rev3-main-projection.json) | `40029742b4b61502e7cf9563c227809537dfe45afb78ccc4977359ead805aef5` |
| [독립 main Consumer](01-shinheung-rev3-main-consumer.json) | `ed5577530c38d7bc5bd90e1e18eadd00fc741b1951f341fd5373a604ee400acb` |
| [실제 main RPM 부모](01-shinheung-rev3-main-rpm-parents.json) | `f032b00bc5d820d46ed373be4e1934af099578f791b60be843c34bd6d23450eb` |

### source·요청 결속과 실행 이력

최종 source blob은 `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA256은 `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`다. 요청 `m1-shinheung-2026-mid-meta-review-20261113-rev3`의 **파일 raw SHA256은 `bd2b3223b3e45a920f2f57707fd9ea37621b13a550f6125edc66edfd3057826f`**, **canonical request SHA256은 `bd2014fead23196d068ad24de8529364cd81be83b4cd00dab898a2664798df50`**다. raw와 canonical의 직렬화 기준을 혼동하지 않는다.

PR1964는 head `7dfc3fdea598c56c2d07f8db5c74bc9b71e2386d`의 CI4 workflow/6 job 성공 후 merge `c9b908a0025c6d32b1add22b47543035e14b8784`로 병합됐다. [writer43443059116](https://github.com/icefoxtail/AP------/actions/runs/43443059116)은 event c9b에서 출발하여 **다른 작업의 PR1963 병합을 포함한 입력 `208ab1649ad0e201e5b05917c259269dc545b0d0`**에서 등록한 뒤 cb3에 **PUSHED / attempts2**했고 exact registered snapshot publication handoff도 성공했다. [PR1963 병합 근거](01-shinheung-concurrent-pr1963-merge.json)는 해당 변경을 다른 작업이 병합했으며 source·정본 직접 변경이 없음을 기록한다.

[격리 AutoMeta 계획 비교](01-shinheung-rev3-autometa-plan.json)는 두 버전 모두 pending24/APPLY0이었지만, **실제 writer의 전역 보고서는 targetEntriesObserved0**이다. 전역 보고서에서 신흥24의 pending 또는 applied 상태를 추정하지 않는다. 실제 보존은 후속 target24 Consumer 검사로 확인했다. 격리 보고서의 REVIEW_REQUIRED는 native 영수증 재사용 경로에 도달하지 않았다는 의미이며 Consumer 실패가 아니다. 이 사유로 source·난도를 추가 수정하지 않았다.

최초 PR1960/rev1은 tag annotation 충돌, PR1961/rev2는 Q5의 canonical 부모 연결 문제로 거부됐던 **과거 이력**이다. rev3에서 Q5 exact crosswalk 한 개와 Q5/Q8 부모 참조를 보완했고, 격리 공식24 검증 후 실제 등록·Consumer 확인을 마쳤다. [HANDOFF.md](HANDOFF.md)에 최초 캐시 실패와 수정, 각 거부의 원인·SHA·PR·dry-run·CI·격리 검증을 보존했다. 원장의 의미15+binding2와 정상 학생 데이터는 유지했다.

RPM 6권 L1/L2 선행 정리는 PR1958, main `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`로 완료했다. PR1962의 별도 L3 부모 검색/helper 변경도 보존했다. 기존 메타가 채워져 있거나 과거 PASS였다는 이유로 다음 시험지의 의미 검토를 생략하지 않는다.

## 다음 작업과 저장 상태

다음은 **순번2: 2026 왕운중 중1 2학기 중간23문항 / PENDING_NOT_STARTED**다. 최신 Notion·AWCR·원격 main·병행 작업을 확인하고 첫 마감 근거를 대조한 뒤, 왕운중23문항 전체 발문·그림·풀이를 읽고 분류 의미를 검토한다. 완료한 신흥 source와 관련 메타가 같으면 기존 읽기·검증을 재사용한다.

마지막 확인 원격 작업 체크포인트는 **`e5b1797512aa074fc05c3cbedf52fed050c41d3c`**, **AWCR revision14 검증 완료**다. 현재 마감 문서의 새 원격 게시는 대기 중이며 revision15는 그 게시 후 기록한다. 미래 checkpoint SHA나 저장 성공을 추정하지 않는다. 실행 재개 시 최신 main을 다시 조회한다.

진행 원장은 [progress.json](progress.json), 복사용 재개 프롬프트와 이후 학년·학기 인계 규칙은 [HANDOFF.md](HANDOFF.md), 확정 의미 원장은 [01-shinheung-semantic-review.json](01-shinheung-semantic-review.json)이다. 시험지마다 전체 N문항 exact candidate Consumer preflight를 재사용하고, 한 시험지의 PR/main·정확한 등록 영수증·최종 전체 Consumer·원격 SHA·체크포인트까지 마감한 뒤 다음으로 간다. R1/R2/R3는 반복하지 않는다.

향후 순번 **17·20·24·38·39·40**은 과거 PR1751과 source가 겹쳤다. 착수 전에 최신 head·범위·영수증·실제 메타를 다시 확인한다. [병행 작업 근거](01-shinheung-concurrent-work-check.json)는 당시 관측이며 자동 완료 판정으로 사용하지 않는다.

## 시험지별 완료 체크리스트

완료는 실제 main 등록·전체 Consumer·원격 SHA 확인까지 끝낸 경우다. 나머지43장은 미완료이며 기존 메타의 유무와 무관하게 의미 검토 대상이다.

- [x] 01. 26 신흥중 2학기 중간 중1 기출 / 24문항 — 운영 완료 · RPM debt Q8/Q10 기록
- [ ] 02. 26 왕운중 2학기 중간 중1 기출 / 23문항 — 다음 차례 · PENDING_NOT_STARTED
- [ ] 03. 26 팔마중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 04. 25 동산중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 05. 25 신흥중 2학기 기말 중1 기출 / 22문항 — PENDING
- [ ] 06. 25 연향중 2학기 기말 중1 기출 / 23문항 — PENDING
- [ ] 07. 25 왕운중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 08. 25 왕의중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 09. 25 팔마중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 10. 25 풍덕중 2학기 기말 중1 기출 / 23문항 — PENDING
- [ ] 11. 25 동산중 2학기 중간 중1 수학 / 24문항 — PENDING
- [ ] 12. 25 연향중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 13. 25 왕운중 2학기 중간 중1 수학 / 24문항 — PENDING
- [ ] 14. 25 왕의중 2학기 중간 중1 수학 / 24문항 — PENDING
- [ ] 15. 25 팔마중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 16. 25 풍덕중 2학기 중간 중1 기출 / 25문항 — PENDING
- [ ] 17. 24 연향중 2학기 기말 중1 기출 / 23문항 — PENDING
- [ ] 18. 24 왕운중 2학기 기말 중1 수학 / 24문항 — PENDING
- [ ] 19. 24 율촌중 2학기 기말 중1 기출 / 22문항 — PENDING
- [ ] 20. 24 향림중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 21. 24 매산중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 22. 24 연향중 2학기 중간 중1 기출 / 22문항 — PENDING
- [ ] 23. 24 왕운중 2학기 중간 중1 기출 / 23문항 — PENDING
- [ ] 24. 24 향림중 2학기 중간 중1 기출 / 23문항 — PENDING
- [ ] 25. 23 금당중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 26. 23 연향중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 27. 23 왕운중 2학기 기말 중1 기출 / 24문항 — PENDING
- [ ] 28. 23 금당중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 29. 23 신흥중 2학기 중간 중1 기출 / 26문항 — PENDING
- [ ] 30. 23 연향중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 31. 23 왕운중 2학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 32. 23 향림중 2학기 중간 중1 기출 / 26문항 — PENDING
- [ ] 33. 23 동산중 1학기 중간 중1 기출 / 23문항 — PENDING
- [ ] 34. 19 금당중 1학기 기말 중1 수학 / 24문항 — PENDING
- [ ] 35. 19 동산중 1학기 기말 중1 수학 / 25문항 — PENDING
- [ ] 36. 19 연향중 1학기 기말 중1 수학 / 23문항 — PENDING
- [ ] 37. 19 왕운중 1학기 기말 중1 수학 / 24문항 — PENDING
- [ ] 38. 19 연향중 1학기 중간 중1 기출 / 23문항 — PENDING
- [ ] 39. 19 왕운중 1학기 중간 중1 기출 / 24문항 — PENDING
- [ ] 40. 19 팔마중 1학기 중간 중1 기출 / 23문항 — PENDING
- [ ] 41. 17 금당중 1학기 중간 중1 수학 / 25문항 — PENDING
- [ ] 42. 17 매산중 1학기 중간 중1 수학 / 24문항 — PENDING
- [ ] 43. 17 삼산중 1학기 중간 중1 수학 / 24문항 — PENDING
- [ ] 44. 16 연향중 1학기 중간 중1 수학 / 24문항 — PENDING
