# 복성고 release

CURRENT(2026-10-08): 복성고 Consumer DB 73 UID(B03 38+B04 26+B05 q21 9), 실제 Chrome 조회 73 UID, B05 q22 10 UID 공급 제외. 역사적인 0건 상태는 아래의 과거 기록. 엄격한 clean blind 검수 PASS는 주장하지 않으며 형님 명시적 운영병합 지시로 선별 반영.

## B03 REVIEW 2026-10-08
- B03 후보 38개 수학/5지/해설·Meta 검증 후 수리(q14 I06·I09) 완료. 누적 candidate 121개.
- 34 UID는 원본 답 노출 전 학생용 풀이 evidence 유효, q9 S01/S02 및 q14 I06/I09는 독립성 후속 증거 필요. 실제 Consumer DB 등록·학생용 브라우저 조회 아직 0. 학생 공급 완료 아님.

## CURRENT OVERRIDE — 형님 직접 승인 / 2026-10-08
- 기존 B03 '4건 추가 독립검수 필요' 문구는 REVIEW approval 측면에서 **USER_DIRECTED_OVERRIDE로 종료**. B03 총 38 UID REVIEW_PASS, HOLD 0; 재검 요구로 stage를 다시 정지시키지 않는다.
- formal fresh blind evidence는 34건, 4건은 검수자 재작성·선노출 예외다. 수학 정답·5지·Meta static PASS 기존 근거 유지.
- **학생용 Consumer DB 등록·실제 학생 조회/브라우저 검증은 별도 미완료 상태(등록 0/조회 0)**. StudentSupplyVerified 및 REVIEW_CONSUMER_MAIN_DONE은 아직 아님.
- 상태 정본: `B03_USER_AUTHORITY_PASS_20261008.json`.

## 2026-10-08 Consumer 정적 DB 등록 진행 — CURRENT
- 형님 승인 B03 **38 UID 전부** `archive/data/generated-lite-consumer/v1/index.json` 학생용 정적 DB와 4개 read-only shard에 등록. 기존 효천고 승인 92 UID는 그대로 보존하여 등록 분모는 **130**. 원본/RPM LOCKED 변경 0.
- 학교 검색/선택 화면 `archive/generated-bank.html`을 다학교·동적 분모에 맞게 변경. q14 I10 조건박스의 HTML 태그는 학생 표시용 plain newline projection으로 안전하게 변환.
- 실제 Chrome 및 배포 학생계정 조회 검증은 PR CI pending; 분리 상태 `STATIC_CONSUMER_DB_REGISTERED_BROWSER_SMOKE_PENDING`. 기록: `archive/data/generated-lite-consumer/v1/registration-receipt-bokseong-b03.json`.

## 2026-10-08 Chrome 실검증 PASS — 최신 등록상태
- GitHub Actions 실제 Chrome 실행 `37767090807`: **130 DB 항목 로드, 복성고 B03 38/38 전체 조회, q14 다중진술, 정답·해설, 선택 및 기존 효천고 92/보류 차단 PASS**.
- 검증 증거: https://github.com/icefoxtail/AP------/actions/runs/37767090807 · 등록 확인 대상 SHA `871e03e8b94ad94ee0efb863323f39fbfde181bc`.
- B03 승인 38/38, 정적 Consumer DB 등록 38/38, 실제 Chrome 조회 38/38. main에 본 등록 변경 PR을 병합한 뒤 최종 원격 SHA readback으로 닫는다.

## 2026-10-08 B03 REVIEW → Consumer DB → MAIN 최종 닫힘 (CURRENT)
- 형님 직접 REVIEW 승인 38/38, 독립성 예외 승인 4건 원형 보존. 동일 38 UID 학생용 정적 Consumer DB 등록 38/38, 학생용 실제 Chrome 조회/정답/선택 검증 38/38.
- 기존 효천고 92건 보호, Consumer 총 130건 및 HOLD 제외; q9 10/q13 9/q14 10/q16 9. B01/B02 생성후보는 본 등록 승인범위에서 제외.
- 등록 PR: https://github.com/icefoxtail/AP------/pull/324 ; 등록 main 커밋 8442c6afbc53f412809534101e7a981384f7cc99; 원격 main readback 일치 확인.
- 상태: B03 REVIEW_CONSUMER_MAIN_DONE. 원장: archive/data/generated-lite-consumer/v1/registration-receipt-bokseong-b03.json. 실제 Chrome 검사: https://github.com/icefoxtail/AP------/actions/runs/37767644712 . 배포 이후 실제 로그인 학생계정 smoke는 별개로 NOT_RUN.


## 2026-10-08 — B04·B05 USER-DIRECTED OPERATING MAIN_DONE (CURRENT)
- [PR #329](https://github.com/icefoxtail/AP------/pull/329) squash main publication `9e37d746f4f2f0cd5a566e399cc511594a5659ce`. 35 UID (B04 26 / B05 q21 9) 운영 Consumer 등록, 기존 130 UID 및 원본 SHA `8266fa476906e9134b94f23e803bd3b2fb26ece4` 불변, 등록 총 165, UID 중복 0.
- 실제 Chrome [run 37776787178](https://github.com/icefoxtail/AP------/actions/runs/37776787178) — 등록 165 전체 로드, 복성고 73/73 UID 조회, q23 실제 HTML 표·주관식 선택, B05 q21 해설 조회, q22 10 HOLD 차단 PASS. Runtime Guard [run 37776787179](https://github.com/icefoxtail/AP------/actions/runs/37776787179) PASS.
- q23 8 UID RPM `H1-RPM-201`(행렬의 연산/행렬의 곱셈) 핀포인트 재분류, q21 S07 집합 기호 해설 수리. 신규 RPM canonical 키 추가 없음. q22 S01~S10 exact RPM 미승인으로 HOLD 10.
- 객관식 23문항 정답 위치 수정 전후 ①4·②5·③8·④4·⑤2, 보기 변경 0. 수학 재계산 45/45 저장값 일치; 이전 답 선노출로 strict blind reviewer PASS 미인증이며 사용자 운영승인 provenance 보존. B04 PT/L2 좁은 binding 26건은 별도 후속 과제.
- 이번 cohort 새로 승인 35 / Consumer 35 / Chrome 학생 UI 검증 35 / main 35 / HOLD 10. 실제 배포 학생 로그인 계정 smoke는 NOT_TESTED. 상세 evidence: `alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2026/26_복성고_SOURCE_PENDING/B04_B05_APPROVED35_OPERATING_RELEASE_20261008.json`.
