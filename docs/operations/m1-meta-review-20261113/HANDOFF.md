# 중1 기존 시험지 메타 전수 검토 인계

## 현재 작업과 완료 범위

- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`
- owner: `GPT_ROOT_933015CD0A4F`
- 작업 브랜치: `review/m1-existing-meta-20261113`
- 중1 전체 대상: **44장 / 1,047문항**. main 병합까지 완료한 시험지는 **0장**이다.
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
- **등록·원격 main 병합은 아직 완료되지 않았다. 24문항/17개 정본 변경의 공식 native v2 dry-run은 PASS다.** 원장에는 메타 의미 검토와 수학·해설 FINAL QA를 구분하여 기록했다.

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
2. 이 브랜치의 최신 원격 체크포인트와 `progress.json`을 읽는다. 과거 후보 파일은 근거 이력이며 최종 판단은 `01-shinheung-semantic-review.json`이다.
3. native 정본 추가는 v2 `registryChanges`의 add-only 요청으로 준비한다. 새 작도·합동 native key는 `M1-05-CONSTRUCTION_CONGRUENCE`이다.
4. crosswalk는 기존 행을 보존하고 정확한 DIRECT 행을 추가한다. Q1/3은 동일 PT/TPL binding gap 승격, Q7/21·Q17은 RPM_ONLY 승격, Q19/22는 명시적인 활성 행 선택이 필요하다.
5. crosswalk를 추가하면 `rpm-middle-2022-parents.json`의 `leafMappings[].crosswalkRecordIds`와 `legacySubUnitMappings`를 재계산하고 기존 helper generator를 실행한다. 기존 부모 배치와 326개 leaf는 바꾸지 않는다.
6. source의 메타만 최소 수정한다. 지문·보기·정답·해설·그림·UID·배점·난이도는 보존한다. `primaryMethod`와 `decisiveStep`은 의미 검토 요약으로 추가한다.
7. 24 UID 전체의 공식 v2 dry-run을 수행한다. 기존 metadata/identity fingerprint 24개가 현 source 계산과 달라, `01-shinheung-fingerprint-preflight.json`의 정확한 before/after 및 `identityBefore`를 결속한다. 이 수선으로 학생용 내용을 바꾸지 않는다.
8. 22개 exact RPM 경로는 정본 경로·crosswalk의 실제 listed PT/TPL·ACTIVE binding·pack 범위 대조를 완료했다. 현재 독립 풀이 VERIFIED_FINAL 근거가 없으므로 실제 RPM resolver를 실행하거나 그 플래그를 만들지 않는다. 2개 RPM debt는 구별하고, 등록 후 native/Consumer 값을 확인한다.
9. 첫 시험지 PR → main 병합 → 원격 SHA·등록 영수증 확인 → progress와 인계 갱신. 그 다음에만 2026 왕운중 2학기 중간 23문항으로 이동한다.

## 보존 및 검증 경계

- 기존 읽기 증거: `01-shinheung-semantic-read-checkpoint.json`.
- 기존 후보: `01-shinheung-first-half-candidate.json`, `01-shinheung-candidate-comparison.json`.
- fingerprint 진단: `01-shinheung-fingerprint-preflight.json` — 24/24 불일치와 공식 검증 함수의 명시적 repair 수용을 기록했다. 등록 완료 증거는 아니다.
- 공용 metadata/identity/runtime/compiled 대형 파일을 직접 편집하지 않는다. 서버 writer가 소형 v2 요청을 적용한다.
- 전체 시험지의 과거 수학 검수 완료를 추정하거나 새 R1/R2/R3 PASS를 만들지 않는다.
- 로그인 셸 지연은 exec의 login:false로 해소했다. 변경된 resolver 검사는 29개가 통과했다. 부모 helper 검사의 기존 단일 crosswalk ID 기대값을 추가된 두 정확 행에 맞춰 갱신한 뒤 11개 모두 통과했다. 실제 CI 및 운영 반영 확인은 남아 있다.
- scratch 도구·초안은 보조물이다. 이 문서와 Git 원장만으로 확정 의미 판단을 재구성할 수 있어야 한다.

## 복사용 재개 프롬프트

> `icefoxtail/AP------`의 `review/m1-existing-meta-20261113` 최신 원격 브랜치에서 중1 기존 시험지 메타 검토를 이어가 주세요. 먼저 Notion 필독 라우터와 최신 main, 이 브랜치의 `docs/operations/m1-meta-review-20261113/HANDOFF.md` 및 `progress.json`을 읽으세요. RPM L1/L2 선행 작업 PR1958은 main `8c1b6694c35e76399a6ad36a4b6683e2cb6726b7`로 병합했습니다. 첫 신흥중2026 2학기 중간24문항의 읽기와 의미 판단은 저장되어 있고, 등록/main 병합은 이 체크포인트에서 아직 미완료입니다. 기존 읽기를 반복하지 말고 확정 원장의 15개 의미/연결 수정과 2개 binding 보완을 적용하세요. Q8/Q10의 RPM-only EVIDENCE_DEBT는 숨기지 마세요. 한 시험지씩 PR→main→원격SHA 확인 후 다음 시험지로 이동하고, 전체 R1/R2/R3는 다시 실행하지 마세요. taskId는 `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner는 `GPT_ROOT_933015CD0A4F`입니다.

## 이번 준비본의 추가 증거

- 공식 v2 dry-run: `01-shinheung-registration-dry-run.json` — write:false, 24문항, 정본 변경17, fingerprint 보정24, Consumer/Search NOT_RUN.
- 학생용 데이터 보존: `01-shinheung-source-metadata-delta.json` — 24/24 전체 비메타 값 동일.
- 실제 분류 대조: `01-shinheung-classification-check.json` — exact22/RPM debt2. 수학 검수·실제 풀이 resolver PASS 주장이 아니다.
- 검증 경계: `01-shinheung-verification-boundary.json`.
- 새 정본 추가17: `01-shinheung-registry-additions.json`. MIDDLE_GEOMETRY의 기존 원·부채꼴 binding을 위한 scope append1건과 그 직접 영향4 binding/UID참조9개는 `01-shinheung-pack-scope-impact.json`에 있다.
- 제출할 immutable 요청: `.archive-meta-register/inbox/m1-shinheung-2026-mid-meta-review-20261113-rev1.json`, SHA256 `24ba8de0d00e494b91268a00771d6b7d30cc2a17ac57c76bb7f1bc30a7a10ede`.
- 현재 source 준비본: blob `930d4e3ef44e60757180aae6fc15fcc5b7228958`, raw SHA256 `bc4dcf03680da654dec43928f7b1a57942a6f616de9f03ca9ba3976203bd9a18`.
- 정상 학생 데이터는 같은 원본에서 그대로 보존했다. 정본 추가는 요청으로만 준비했으며 공용 metadata/identity/native runtime을 직접 쓰지 않았다.

## 다음 시험지의 요청 생성 도구

`checkpoint-tools/build-reviewed-exam-v2-request.mjs`와 같은 폴더의 `extract-reviewed-exam-projections.py`를 함께 사용한다. `--repo-root`를 실제 작업트리로 지정하고 입력·출력은 `.tmp/m1-meta-review/` 아래로 지정한다. source title·경로·문항 수·전 UID·owner 확인·최신 source/evidence SHA는 다음 시험지에 맞게 새로 결속한다. 이전 시험지의 요청 ID나 승인값을 복사하여 재사용하지 않는다. 공식 v2 등록기의 dry-run과 main writer 영수증이 최종 권위다.
