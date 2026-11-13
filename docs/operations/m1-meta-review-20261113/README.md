# 중1 기존 문항 메타 전수 검토

## 현재 진행

**운영 완료 3/44장 · 남은 41장 · 읽기 95/1,047문항 · 운영 마감 71문항.** 현재 **2025 동산중 중1 2학기 기말24문항**의 발문·선지·제공 풀이와 실제 그림15개 읽기를 마쳤다. [의미 원장](04-dongsan-semantic-review.json)에 기존 PT 유지, TPL1 보완, 군집키24·결합방식23 정정, exact RPM23 및 Q17 debt를 기록했다. 아직 후보 적용·공식 등록·PR/main 마감은 수행하지 않았다. 공유 binding154가 동산4문항과 풍덕1문항에 걸려 있어, 기존 승인·데이터를 보존하는 한 필드 교정의 선행 절차를 먼저 처리한다.

팔마중24는 [PR1969](https://github.com/icefoxtail/AP------/pull/1969), 실제 등록 main `bf35b7e13417b033ee167117d567a9f0262712d6`에서 운영 마감했다. [마감 근거](03-palma-operational-closeout.json), [실제 writer](03-palma-pr1969-main-writer-final.json), [실제 부모 연결의 동일 입력 확인](03-palma-main-bf35-rpm-parent-reuse.json), [보존 비교](03-palma-main-bf35-minimal-protection.json)를 재사용한다. 등록24·identity24·runtime24·정본7, 최종 post-AutoMeta Consumer24/24/24 PASS 및 실패·미관측·대기0을 확인했다.

팔마는 메타24문항 중 native 분류14문항을 수정했다. RPM exact leaf19, 정본 leaf가 없는 Q6·Q8·Q12·Q13·Q14는 근거 누락을 명시했다. Q6/Q8의 하위 부모 모호성도 숨기지 않았다. 정상 데이터·그림37·UID·배점·난이도·source reviewStatus, 대상 밖 메타 및 이미 완료한47문항을 보존했다. 격리 검증과 실제 main의 핵심23파일 및 canonical input141개·관련 모듈9개가 동일하여 같은 검토·검사를 반복하지 않았다.

## 완료 결과

| 시험지 | 총 문항 | 수정 문항 | 주요 오류 | PR | 실제 등록 main | 남은 시험지 |
|---|---:|---:|---|---|---|---:|
| 신흥중·2026·중1 2학기 중간 | 24 | 메타24, 그중 분류·연결18 | 작도·합동·위치·다각형 혼동, RPM debt2 유지 | [1964](https://github.com/icefoxtail/AP------/pull/1964) | `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4` | 43 |
| 왕운중·2026·중1 2학기 중간 | 23 | 메타23, 그중 분류·연결20 | 작도·합동·위치·비례·통계 정정, RPM debt4 유지 | [1968](https://github.com/icefoxtail/AP------/pull/1968) | `738af248bd62813a572ac81725892b3f12ee2beb` | 42 |
| 팔마중·2026·중1 2학기 중간 | 24 | 메타24, 그중 native 분류14 | 위치·작도/합동·다각형 혼동, RPM debt5 유지 | [1969](https://github.com/icefoxtail/AP------/pull/1969) | `bf35b7e13417b033ee167117d567a9f0262712d6` | 41 |

신흥중의 첫 [운영 마감](01-shinheung-operational-closeout.json)은 역사적 결과로 보존한다. 다른 owner의 후속 [PR1967](https://github.com/icefoxtail/AP------/pull/1967)은 main `440f412bd221e3d62df16130984a2626a3ee6441`에서 새 영수증·최종Consumer24로 마감됐으며, 현재 source는 raw `2f1ab79eba940498b5c575ad1509a038b3f2dabd390823177635d83937fe4b56`이다. 왕운 등록 후에도 현재 신흥24의 관련 데이터는 바뀌지 않았다. 이미 완료한 전수 읽기를 다시 시작하지 않는다.

선행 RPM6권 L1/L2 정리는 [PR1958](https://github.com/icefoxtail/AP------/pull/1958)로 완료했다. 대단원24·중단원54, 기존326leaf 보존 및 부모9개 수정. 별도 branch `fix/rpm-middle-l1-l2-20261113`의 head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`에 인계와 검증이 있다. 과정명 한 필드 교정 [PR1966](https://github.com/icefoxtail/AP------/pull/1966)도 실제 main51cf·Consumer1/1·기존runtime613 보존으로 마감했다.

## 재개와 기록

진행 원장은 [progress.json](progress.json), 다음 담당 절차와 복사 프롬프트는 [HANDOFF.md](HANDOFF.md)다. 한 시험지의 의미 검토→최소 수정→정확 후보 검증→PR/main→실제 등록 영수증/최종 Consumer→원격 SHA를 끝낸 뒤 다음으로 이동한다. 기존 R1/R2/R3와 같은 입력의 검증은 반복하지 않는다. 수학 FINAL QA나 solution 기반 RPM FINAL을 수행했다고 기록하지 않는다.

검증된 직전 원격 branch head는 `7a00f23bf95c64f43993c57ce13d7f74c709b288`, AWCR revision26이다. 동산 의미 체크포인트의 실제 게시 head/tree는 원격 branch와 다음 immutable AWCR revision27에서 확인한다. 자신의 commit SHA를 미리 기록하지 않는다.

## 시험지별 완료 체크리스트

완료는 실제 main 등록·전체 Consumer·원격 SHA 확인까지 끝낸 경우다. 나머지41장은 미완료이며 기존 메타의 유무와 무관하게 의미 검토 대상이다.

- [x] 01. 26 신흥중 2학기 중간 중1 기출 / 24문항 — 운영 완료 · RPM debt Q8/Q10 기록
- [x] 02. 26 왕운중 2학기 중간 중1 기출 / 23문항 — 운영 완료 · 실제 등록23/최종Consumer23 · RPM debt Q2/Q3/Q4/Q16 기록
- [x] 03. 26 팔마중 2학기 중간 중1 기출 / 24문항 — 운영 완료 · 실제 등록24/최종Consumer24 · RPM debt Q6/Q8/Q12/Q13/Q14 기록
- [ ] 04. 25 동산중 2학기 기말 중1 기출 / 24문항 — 전체 의미 읽기24·그림15 완료 / 후보·등록·운영 마감 대기
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

## 팔마24 현재 체크포인트

[의미 원장](03-palma-semantic-review.json)의24문항·37그림 검토와 [격리 preflight](03-palma-isolated-preflight.json)의 공식 Consumer24가 완료됐습니다. [현재 인계](HANDOFF.md)와 [완료표](progress.json)를 기준으로 PR/main 실제 등록까지 마감합니다. 운영 완료는 아직2/44장입니다. source정상payload는 보존하며 RPM exact19/debt5를 구분했습니다.
