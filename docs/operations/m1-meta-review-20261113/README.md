# 중1 기존 문항 메타 전수 검토

## 현재 진행

**운영 완료 1/44장 · 남은 43장 · 전체 읽기 47/1,047문항.** 현재는 **2026 왕운중 중1 2학기 중간23문항**이다. 발문·선지·제공 풀이23개와 외부 그림33개를 전부 읽었다. 현재 확정 원장은 [semantic revision3](02-wangun-semantic-review-rev3.json)이며, 실제 운영 등록 전이므로 완료로 체크하지 않는다.

- 의미·부모 수정 후보20문항, 정확한 RPM leaf19, debt Q2·Q3·Q4·Q16. 정상 문제·정답·해설·그림·난이도·source 검수상태는 보존한다.
- Q7은 기존 FUNCTIONS_GRAPHS의 그래프 성질 유형을 재사용한다. Q11은 기존 합동 대응 PT 아래 중점 사각형 성질 판정 template를 보완한다. Q20은 기존 줄기·잎→계급별 도수 유형에 연결한다. 새 PT4·TPL5, exact binding5, M1-1 과정 alias2, RPM exact 연결15개가 후보이다.
- [native 계획](02-wangun-native-registration-plan-rev2.json), [crosswalk 계획](02-wangun-crosswalk-plan-rev2.json), [원본 보존 독립 확인](02-wangun-source-candidate-independent-review-rev3.json). 후보의 분류9필드만 추가 조정한 근거와 정상 데이터23/외부 그림33 해시를 결속했다.
- [PR1965](https://github.com/icefoxtail/AP------/pull/1965) 코드가 main에 병합됐다. 기존 binding 과정명 오타 정정 요청은 별도 [PR1966](https://github.com/icefoxtail/AP------/pull/1966)이다. 격리 공식 검증에서 기존 runtime613문항과 보호파일104개를 보존했다. [실제 운영 마감](02-binding-course-operational-closeout.json)에서 main `51cfb3f6fdaf3600ad06aa298d109093ad0b6b45`, 최종 Consumer1/1·runtime613 보존까지 확인했다. 왕운중은 격리 공식 등록23/정본16 PASS, 실제 Consumer 확인 중이다.
- 명시적 sourceOrdinal로23개 UID를 결속했다. [UID 정정 기록](02-wangun-uid-association-correction.json)을 보존하며 이전 원장·추출 배열 순서를 등록 UID로 사용하지 않는다. rev3는 rev2의 UID23개를 그대로 유지한다.
- 병행 owner의 immutable r12에서 왕운중/과정명 정정 발행 보류를 확인했다. 해당 작업에 합류하거나 그 tree를 수정하지 않는다. 공개 main·현재 원본·요청을 다시 확인하고 단일 요청만 적용한다.

병행 신흥 보완 PR1967이 현재 crosswalk 전체 해시에 결속돼 있어 **해당 실제 main writer 마감 후 왕운중 crosswalk를 게시**한다. [영향 코드 추적](02-crosswalk-append-existing-approval-impact.json)에 기존 승인 재사용과 신규 요청 검증을 구분해 기록했다. 다른 owner의 tree·요청은 수정하지 않는다.

## 완료 결과

| 시험지 | 총 문항 | 수정 문항 | 주요 오류 | PR | 실제 등록 main | 남은 시험지 |
|---|---:|---:|---|---|---|---:|
| 신흥중·2026·중1 2학기 중간 | 24 | 메타24, 그중 분류·연결18 | 작도·합동·위치·다각형 혼동, RPM debt2 유지 | [1960](https://github.com/icefoxtail/AP------/pull/1960)·[1961](https://github.com/icefoxtail/AP------/pull/1961)·[1964](https://github.com/icefoxtail/AP------/pull/1964) | `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4` | 43 |

신흥중의 [운영 마감 근거](01-shinheung-operational-closeout.json)와 정본17/등록24/최종Consumer24 PASS를 재사용한다. RPM exact leaf22, debt Q8·Q10 및 Q8 부모 모호성은 보존된다. 후속 main `33f26c795e7a86fc3b63737996c6885cff4c7bba`는 writer 상태2파일만 달라 [입력 동일성 근거](01-shinheung-main-cursor-only-advance.json)로 기존 검증을 재사용했다. 신흥중을 다시 시작하지 않는다.

선행 RPM 6권 L1/L2 정리는 [PR1958](https://github.com/icefoxtail/AP------/pull/1958)로 완료했다. 대단원24·중단원54, 기존326 세부 경로 보존 및 부모9개 수정. 해당 별도 브랜치 `fix/rpm-middle-l1-l2-20261113`의 `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`에 인계와 검증이 있다.

## 재개와 기록

진행 원장은 [progress.json](progress.json), 다음 담당용 절차와 복사 프롬프트는 [HANDOFF.md](HANDOFF.md)다. 시험지 한 장의 의미 검토→최소 수정→exact candidate 전체 Consumer→PR/main→실제 등록 영수증/최종 Consumer→원격 SHA를 마감한 뒤 다음으로 이동한다. 기존 R1/R2/R3는 반복하지 않는다. 수학 FINAL QA나 새 해설 검증을 수행했다고 기록하지 않는다.

마지막 확인 원격 체크포인트는 `e403ce4b0fff47857e0579335a633a7a7b28dd3a`, AWCR revision17이다. 현재 rev3 기록의 실제 게시 SHA는 원격 브랜치와 다음 immutable AWCR에서 확인한다.

## 시험지별 완료 체크리스트

완료는 실제 main 등록·전체 Consumer·원격 SHA 확인까지 끝낸 경우다. 나머지43장은 미완료이며 기존 메타의 유무와 무관하게 의미 검토 대상이다.

- [x] 01. 26 신흥중 2학기 중간 중1 기출 / 24문항 — 운영 완료 · RPM debt Q8/Q10 기록
- [ ] 02. 26 왕운중 2학기 중간 중1 기출 / 23문항 — 의미 검토23 확정 · 등록 준비 중
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
