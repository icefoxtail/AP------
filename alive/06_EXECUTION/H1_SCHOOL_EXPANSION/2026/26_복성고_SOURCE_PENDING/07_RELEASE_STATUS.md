# 복성고 release

## CURRENT — B05 q22 10문항 최종 학생용 출시 완료 (2026-10-09)
- RPM 분류는 이전 완료분 재사용: **RPM185×8, RPM184×1, RPM181×1**; 생성 source·원본 시험지 문제/보기/정답/해설 SHA 불변. 정수해 직접 열거·계산 **10/10 MATCH**, 선답 노출 이력 때문에 formal clean blind는 **NOT_CERTIFIED** 그대로 보존하고 형님 직접 지시 운영승인으로 기록.
- [PR #349](https://github.com/icefoxtail/AP------/pull/349) main `cb8b2fad226f555e8b4d1eb14cf17a14de279312` 운영병합, q22 서술형 **10 UID 학생용 DB 등록·실제 Chrome 조회 완료**. Generated Bank **283** = 복성고 **191** + 효천고 **92**. q22 HOLD 10 해제; 효천고 HOLD 2만 유지.
- [main Chrome run 37821875975](https://github.com/icefoxtail/AP------/actions/runs/37821875975) PASS / [main Runtime Guard 37821875941](https://github.com/icefoxtail/AP------/actions/runs/37821875941) PASS. PR 정적 18/18 PASS 및 Chrome/Guard PASS. 학생 실로그인 계정 검증은 NOT_TESTED.
- 최종 영수증 `B05_Q22_REVIEW_CONSUMER_CLOSEOUT_20261009.json`, 10 UID SHA와 Main Consumer index 원격 readback. 이 아래의 'B05 q22 HOLD 10'은 이전 출시 전 역사 기록으로 이번 CURRENT가 대체한다.

## CURRENT — B02 q11 9문항 출시 완료 (2026-10-09)
- **PR #348** main 운영병합 `a909d370cef7b12228108f974d90e41fd63ecc88`; 학생 발문·보기·정답·해설 보존, 기존 수학 독립검수 A1/A2 **9/9 MATCH**.
- RPM **기존 유형 3문항**(A03·A06 → H1-RPM-184, A09 → H1-RPM-185)과 **Generated 전용 확장 유형 6문항**(EXT-H1-BSG26-ABS-PIECEWISE-L3)을 독립 구분·승인. RPM LOCKED 정본/원본 JS Git blob 변경 없음.
- **신규 학생용 등록 9/9**, B02 총 38/38, 복성고 181, 효천고 92, Generated Bank 273문항. 기존 HOLD 12문항만 계속 제외. 중복 UID 없음.
- [main Generated Consumer 실제 Chrome](https://github.com/icefoxtail/AP------/actions/runs/37818846039) PASS; [main Archive2 Runtime Guard](https://github.com/icefoxtail/AP------/actions/runs/37818846095) PASS; PR 단계 16/16 회귀검사 PASS. 실제 로그인 학생계정 배포 검증 별도 NOT_TESTED.
- 완료 근거 `B02_Q11_REVIEW_CONSUMER_CLOSEOUT_20261009.json`. 이전 q11 HOLD 및 REVIEW 문구는 모두 역사 스냅샷이며 현행 등록 분모에 적용하지 않는다.

## CURRENT — 2026-10-09 B01·B02 83/83 독립 수학 REVIEW → 74 UID Consumer main 운영 완료
- 원본 2026 복성고 고1 1학기 기말 23문항, original Git blob `8266fa476906e9134b94f23e803bd3b2fb26ece4` 불변.
- B01 45 + B02 38 = 83 UID 학생용 발문·보기만 읽고 독립 풀이 A1을 각각 물리 동결(커밋 `8c0fcc32` / `035d9d07`)한 후 A2 저장 answer/solution 비교 83/83 일치, MATH mismatch 0.
- **운영 출시/실제 학생 Chrome 조회 74/83**: B01 **45**, B02 **29**. [PR #347](https://github.com/icefoxtail/AP------/pull/347) main squash `54d8a27864fd44d27d61aa48a21e283ad1fef199`. Consumer index 264 승인 UID(복성고 172/효천고 92), 기존 190 승인 보호, 중복 0. 실제 main Chrome [run 37815407309](https://github.com/icefoxtail/AP------/actions/runs/37815407309) PASS, Archive2 Runtime Guard [run 37815407399](https://github.com/icefoxtail/AP------/actions/runs/37815407399) PASS, 23/26 원본과 동일한 출력 문항 수 보호.
- **별도 q11 분류 보류 9 UID**: B02 `ALITE-BSG26-B02-Q11-A01..A09`의 절댓값 포함 부등식은 기존 RPM L3/L4에 정확 일치하는 ACTIVE 의미 경로 미확정. 수학 A1/A2 9/9 일치하지만 허위로 AM-GM/코시형 '절대부등식'을 매핑하지 않고 HOLD/학생용 0으로 유지. 기존 HOLD 12 + 신규 9 = Consumer excluded 21.
- 신규 closeout: `B01_B02_REVIEW_CONSUMER_CLOSEOUT_20261009.json`; q11 분류 미해결 원장 `B02_Q11_TAXONOMY_HOLD_20261009.json`. B01/B02 **검수 대상 83은 완료, 출시 74, 분류 미출시 9**로 구분. 배포 후 실제 로그인 학생 계정 smoke는 NOT_TESTED.
- B01 원본 q15는 이번 B01 45 생성 후보에 포함되지 않은 별개 source Blueprint continuation이다. 이 원장으로 q15 생성 완료를 소급 주장하지 않는다.

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

## B06 25 UID — REVIEW → Consumer → MAIN_DONE (2026-10-08)
- PR #334 squash main: `6c208f5e53ad4db864ce5ab7262a05a637a4e4e8`; Git 원격 190/190 Consumer UID(복성고 98/효천고 92) readback, B06 25개 신규 승인(원본 q18 10·q19 15), 기존 165 보존, 12 HOLD 유지.
- 학생용 실제 Chrome PR 검증: https://github.com/icefoxtail/AP------/actions/runs/37788106562 PASS; Archive2 Runtime Guard https://github.com/icefoxtail/AP------/actions/runs/37788106580 PASS; 원본 엔진 실렌더 https://github.com/icefoxtail/AP------/actions/runs/37780560087 PASS.
- 독립 A1 freeze → A2 비교 25/25, 23/23 객관식 유일답. 발문 Markdown 10건, q19 S01/S15의 원본 동일문형 문제 수리 2건, S03 RPM 주개념 재결속 1건. 정답 위치 ①1·②9·③7·④3·⑤3. SVG 7개/원본 PNG 픽셀 보존 SVG 2개 검증.
- 기존 원본 복성고 JS blob `8266fa476906e9134b94f23e803bd3b2fb26ece4` 보존, RPM canonical 수정 없음. 남은 별개 q22 HOLD 10 및 과거 q15 분류 관련 부채는 B06 승인에 포함하지 않음.
- 상태: **B06 25 REVIEW_PASS / Consumer 등록 25 / Chrome 조회 25 / MAIN_DONE**. 배포 로그인 학생계정 별도 NOT_TESTED.


## 2026-10-08 — B05 q22 10 UID RPM/H1 ACTIVE 의미 분류 재판정 (CURRENT META CORRECTION)
- 전 대상: `ALITE-BSG26-B05R2-Q22-S01`~`S10`, 원본 2026 복성고 고1 1학기 기말 q22, 기존 original blob `8266fa476906e9134b94f23e803bd3b2fb26ece4` 보존.
- 기존 사유 `EXACT_COMBINED_ABS_QUAD_RPM_MISSING`은 과잉 HOLD로 재판정했다. 기존 RPM L3/L4를 실제 주된 풀이에 따라 **8문항 H1-RPM-185 부등식의 활용/계수 조건, 1문항 S06 H1-RPM-184 부등식의 활용/최대·최소, 1문항 S07 H1-RPM-181 이차부등식/근의 위치와 해**로 수리했다.
- 10문항 target L2 `H22-C-06-SYSTEM` 유지. 이전/다른 L2 RPM semantic을 같은 학년 선수 범위에서 재사용하고 `rpmSemanticSourceScope`에 명시. 절댓값 부등식, 이차부등식, 정수해 교집합은 CrossConcept/Condition 증거로 보존. `연립일차부등식`이나 AM-GM 의미상 허위 대응 없음.
- Foundation target `H22-C-06-SYSTEM` 정확 ACTIVE PT binding 검증: S01~05,S06,S08~10 `PT_H1_INEQUALITY_APPLICATION`; S07 `PT_H1_QUADRATIC_INEQUALITY`. template 없음인 9문항은 `templateNullReason`과 비차단 projection 상태 보존. RPM LOCKED·ACTIVE canonical 직접 수정 0.
- 수학 정수해 조합 직접 열거·계산값 비교 10/10 MATCH (기존 정답이 이미 보였으므로 formal clean blind PASS는 **주장하지 않음**). 본 수정은 10 UID metadata + manifest, source candidate shard 원형 보존, 증거 `B05_Q22_EXISTING_RPM_SEMANTIC_REBIND_20261008.json`에 결속.
- **META CLASSIFICATION HOLD: RESOLVED 10/10**. 그러나 학생 Consumer 기존 excludedHold 10 UID는 독립 REVIEW·학생용 등록·실제 조회가 끝나기 전까지 안전하게 유지한다. 운영 MAIN_DONE 또는 10 UID 학생 공급 완료라는 뜻이 아니다.
