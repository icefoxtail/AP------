# B04·B05 R2 핀포인트 수정·검증 — 2026-10-08

## 상태
- source exam: `26_복성고_1학기_기말_고1_기출`
- source Git blob: `8266fa476906e9134b94f23e803bd3b2fb26ece4` (불변)
- working branch: `repair/alive-lite-bokseong-b04-b05-r2-quality-20261008`
- input baseline: `pilot/alive-lite-bokseong-b04-b05-blueprint-r2-20261008` @ `4fb36fd2699c0994158dc0f72b994e6fd906a55c`
- after-repair CANDIDATE: B04R2 26, B05R2 19, current B01~B05 cumulative 166
- **independent REVIEW = NOT_TESTED / q22 semantic = META_REVIEW_REQUIRED / consumer registered = 0 / student lookup = NOT_TESTED / main release = NO**

## 실행 수정
- **발문 표면 4건:** q23 S03·S04·S07·S08에서 원시 Markdown `**` 제거.
- **원문 의미 명확화 3건:** q21 S07·S08·S09에 `서로 다른`을 명시해 중복 선택 해석 차단.
- **L2 메타 9건:** R2 Blueprint `classify.21.L2=H22-C-08-COMBINATION` 및 `H1-RPM-194=조합의 활용`에 맞춰 q21 생성물 9 UID를 `COUNTING_PRINCIPLE`에서 `COMBINATION`으로 실제 이동. old shard+metadata 삭제 및 양쪽 L2 manifest/두 batch index/166 누적 index 정합 완료.
- **난이도 재판정:** `difficultyBucket` 16 UID 변경, `level` 7 UID 변경. 45 UID에 `difficultyConfidence`, `difficultyBoundaryFlag`, `legacyLevelCompatibility`를 문항별 근거로 기록하고 matching L2 metadata·index에 결속.
- **역사적 Blueprint 계획과 결과 분리:** 객관식 기존 자리 계획과 실제가 달랐던 21/23 및 주관식 잘못된 자리 계획 22/22 수정. 45개 original plan은 `historicalChoicePositionPlan`, `initialDifficultyTarget`으로 보존. 최신 `choicePositionPlan`/`difficultyTarget`은 실제 학생용 값과 일치하나, **생산 전 계획이 정확했다는 소급 증거는 아님**.
- **보호 데이터 유지:** original 기출 소스, 기존 45 UID, 문항 순서, 보기 5개, 정답 및 학생용 `solution`은 변경 0. q21 내용의 선택 집합 표기만 명확히 했고 수학값은 불변.
- **미해결 분리:** B05 q22 신규 RPM L3/L4 후보 10 UID의 독립 의미 심사 미완. `H1-RPM-179`(연립일차부등식) 또는 AMGM 분류에 끼워 넣지 않음.

## 실제 원격 파일 blob 근거
- JS `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_OPERATION/shards/batch-BSG26-B04R2-q17-operation.js` → `417a788477f2008df6f4f9365d8e81bd8bb9108e`; metadata `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_OPERATION/metadata/batch-BSG26-B04R2-q17-operation.json` → `2517615e212677e2b18ad1eac4687954ed680fe5`
- JS `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/shards/batch-BSG26-B04R2-q17-properties.js` → `785a68d43c30ab9eec9580b29f09935be25209c3`; metadata `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/metadata/batch-BSG26-B04R2-q17-properties.json` → `37213b3d47470cec1b65c4789f871e227279bbdb`
- JS `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/shards/batch-BSG26-B04R2-q20.js` → `33b448dc011dc425a4121afe1acdc4178f9f90f2`; metadata `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/metadata/batch-BSG26-B04R2-q20.json` → `5f3350042ec5d79139eed518c6eef8ed18856a39`
- JS `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/shards/batch-BSG26-B04R2-q23.js` → `29d4a5ec32a6564f53b3ff49299f7fda62d66d57`; metadata `archive/generated/lite/v1/2022/H1/H22-C-09-MATRIX_APPLICATION/metadata/batch-BSG26-B04R2-q23.json` → `ee688c57d8fd36cbab4b970d4c3906ac836b58c2`
- JS `archive/generated/lite/v1/2022/H1/H22-C-08-COMBINATION/shards/batch-BSG26-B05R2-q21.js` → `14151129154011a5fda9788c771d63f4bd028ae9`; metadata `archive/generated/lite/v1/2022/H1/H22-C-08-COMBINATION/metadata/batch-BSG26-B05R2-q21.json` → `29614f77b99e1f597a46640e7451d1e752a20a5f`
- JS `archive/generated/lite/v1/2022/H1/H22-C-06-SYSTEM/shards/batch-BSG26-B05R2-q22.js` → `c66a812f6dbc4c1e1b6de0b338f1f33014b338ec`; metadata `archive/generated/lite/v1/2022/H1/H22-C-06-SYSTEM/metadata/batch-BSG26-B05R2-q22.json` → `6760635a09a03d279755b3c1b2032af81d323e2c`
- cumulative create index: `archive/data/generated-lite/bokseong-2026-1final-create-index-v5.json` blob `8100cddfaa40e30eeee9cbd18be69dcf1f7ff4fc`
- reconciled blueprint design blob `5fc62d29e03de519dceafd1a98cc3208db63474c`; first design blob `2fb7c8118b141d52d4a7592a05fa8d30bb5d9443`

## 한정 재검 결과
- 실제 Git blob 읽기: JS 6개 + metadata 6개, 45/45 UID 고유·전원 JS 객체 구조/필수 4개 난이도 필드.
- 객관식 23/23 5지, 중복 보기 문자열 0, 정답 기호·solution 결론 대응 23/23. 주관식 22/22 answer/solution 결론 구조 확인.
- 이전 분모와 비교: student `answer/choices/solution/questionType/layoutTag/wide` 45/45 동일. `content` 변경 7, subUnit 변경 9, difficultyBucket 16, level 7.
- 학생 정답 위치 ①4·②5·③8·④4·⑤2, 최대 8/23(34.8%)로 40% 경보 미만. 위치 분포에 맞추기 위한 선지 변경 0.
- 누적 index 166 UID / B04 26 / B05 19 유지. 이동 전 q21 shard·metadata는 원격 브랜치에서 실제 404(부재) 확인.
- Blueprint effective 45/45 difficulty match, 23/23 객관식 실제 정답 위치 match, 22/22 주관식 choice position N/A.
- 정적 검사는 공식 fresh blind 독립 REVIEW나 Node VM·실제 Archive Chrome 렌더·학생 Consumer 조회를 대체하지 않음.

## 다음 정상 검수 owner
R2 수리 브랜치의 학생용 shard·problem dependencies로 별도 독립 REVIEW에서 학생 답 선동결 → 5지/해설/Meta semantic/교육과정 재검. q22 신규 L3/L4는 canonical 승격 전에 실제 근거를 독립 판정. 승인 UID만 Consumer DB 등록·Chrome 학생 조회를 검증한 뒤 main publication. 이 문서는 CREATE 대상 복구 보고이며 REVIEW 승인·MAIN_DONE을 발행하지 않는다.
