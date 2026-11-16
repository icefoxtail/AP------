# TASK-07 보고 — 빈 곳 지도 읽기 전용 초벌

## 결과
- 코드 브랜치: `feat/coverage-map-20261116`
- 시작 main: `92dd3614585fefadef3ce0ad6cf68aed5cef97da` (시작 뒤 고정)
- 코드 커밋: `474a2d007750752c1bc0b1bce6225788019f1980`
- 검증한 코드 tree: `d9b6402804f9ae39270295d60474d6f899bff0ae`
- main 병합·PR 생성·운영 데이터·봉인 문서·사전·영수증 변경 없음. 출력은 저장소 밖에만 기록.

## 구현
- `archive/tools/coverage/build-map.mjs`: `--scope middle/m3` 또는 `--course 공통수학1`, `--out`, `--format json|tsv`. 두 선택자는 배타적. JSON 지도와 TSV의 주석부에 단원/과목별 불확실 분모를 기록한다.
- `find-gaps.mjs`: `--map <지도 JSON> --out <파일> --max-unknown 0.1`. 교재에만 있는 유형, 내부 난이도 단계 공백, 단일 방법 묶음을 구분. 수학적으로 칸이 성립하는지는 판단하지 않는다는 주의문을 출력한다.
- 단원·소단원 × PT/TPL × 정렬·중복 제거한 method 용어 번호 집합 × 난이도 1~5. 완전한 셀과 별도로 유형·출처·난이도·방법의 관측 사실을 보존한다. 다른 축이 비어 있다고 이미 있는 기출/난이도를 없는 것으로 세지 않는다.
- values는 값이 있는 문항, approved는 승인 필드의 분석 집계다. 사용 가능 문항을 차단하는 별도 엄격 모드가 아니다. 실제 문항 분모는 두 뷰에서 동일하다.
- UID는 identity의 source path + 배열 위치로, compact ordinal은 원래 표시 번호로 결속. ACTIVE PT/TPL·부모, ACTIVE 단원/소단원 관계, compact schema와 해당 사전의 용어 존재/상태를 검사한다. 무효값은 불확실 분모에 남긴다.
- catalog의 `approvedFieldStatus`를 원형대로 옮겼다. catalog CLI를 import하면 쓰기가 실행되므로 직접 import하지 않았다. exact source tuple/content fingerprint, canonical 실제 선택값 조건을 더해 인라인 fallback이 승인으로 승격되지 않는다.
- 4칸 approved는 기존 runtime index REGISTERED 벡터이며 독립 의미검수 승인을 뜻하지 않는다. compact SHA·현재 source blob·UID/위치/번호·벡터가 일치한 경우만 그 상태를 인정한다. 일반 values에는 아직 미등록인 유효 벡터도 유지한다.
- 생성문항은 별도 production consumer index를 UID별 1회 읽고 기존 `problem-bank-meta.projectGenerated`를 재사용한다. 승인 신호는 기존 `verifiedEligible`이고 후보/증거 원장은 분모에 섞지 않는다. 생성문항 4칸 저장소 연결은 없어 method 미상으로 명시한다.
- 과목은 실제 기록값을 사용한다. 교육과정 빈값은 기존 `active-registry.curriculumForQuestion`으로만 해석한다. 과목 alias 통합을 새로 만들지 않는다.
- 이름이 비슷한 TPL은 같은 PT 내 편집거리 ≤2 및 길이 대비 ≤25%일 때 묶음 후보로만 출력한다. 현재 레지스트리에서 121쌍이며 자동 병합하지 않는다.

## 실측
두 명령은 시작 main의 현행 JS/메타/compact/index로 실행했다. sparse 누락을 운영 0개로 세지 않으며, 색인에 있는 compact가 로컬에 없으면 오류로 중단한다. 두 실행의 입력 오류는 0건. 분모의 결손 항목은 중복될 수 있어 합산하지 않는다.

### 중3 전체
- 실행 시간: 3.057초 (지도 생성, gap CLI 별도).
- 출처 분모: `{"original": 4708, "similar": 311, "textbookWorkbook": 47}`.
| 집계 | 칸 | 분모 | 확정 문항 | 유형 미상 | 4칸 미상/미승인 | 난이도 미상/미승인 | 단원 미상/무효/미승인 | 교육과정·과목 미상 | 불확실 합집합 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| values | 1258 | 5066 | 1613 | 3293 | 435 | 25 | 1077 | 625 | 3453 |
| approved | 280 | 5066 | 341 | 4301 | 3332 | 2789 | 1861 | 625 | 4725 |

| 집계 | 교재에만 존재 | 내부 난이도 공백 | 방법 1개 | CONFIRMED | UNKNOWN |
| --- | ---: | ---: | ---: | ---: | ---: |
| values | 0 | 18 | 125 | 0 | 143 |
| approved | 0 | 4 | 49 | 0 | 53 |

확정 후보는 0개이므로 확정 예시 5개를 만들어 쓰지 않는다. 대신 values의 UNKNOWN 예시 5개:
- `SINGLE_METHOD_GROUP` / `M3-04-QUADRATIC_FUNCTION_GRAPH` / `TPL_M3_SELECT_QUADRATIC_FUNCTION_WORD_PROBLEM`: 불확실 907/919 (98.7%), 근거 `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js #1`.
- `SINGLE_METHOD_GROUP` / `M3-04-QUADRATIC_FUNCTION_GRAPH` / `TPL_M3_EVALUATE_PARABOLA_PROPERTIES_STATEMENTS`: 불확실 907/919 (98.7%), 근거 `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js #2`.
- `SINGLE_METHOD_GROUP` / `M3-04-QUADRATIC_FUNCTION_GRAPH` / `TPL_M3_DETERMINE_EQUATION_FROM_GRAPH_POINT`: 불확실 907/919 (98.7%), 근거 `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js #3`.
- `SINGLE_METHOD_GROUP` / `M3-04-QUADRATIC_FUNCTION_GRAPH` / `TPL_M3_IDENTIFY_FALSE_PROPERTY_OF_TRANSLATED_PARABOLA`: 불확실 907/919 (98.7%), 근거 `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js #4`.
- `SINGLE_METHOD_GROUP` / `M3-04-QUADRATIC_FUNCTION_GRAPH` / `TPL_M3_CALCULATE_SUM_OF_TRANSLATION_PARAMETERS`: 불확실 907/919 (98.7%), 근거 `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js #5`.

### 공통수학1 (고1 과정)
- 실행 시간: 4.942초 (지도 생성, gap CLI 별도).
- 출처 분모: `{"original": 921, "similar": 515, "textbookWorkbook": 727, "generated": 285}`.
| 집계 | 칸 | 분모 | 확정 문항 | 유형 미상 | 4칸 미상/미승인 | 난이도 미상/미승인 | 단원 미상/무효/미승인 | 교육과정·과목 미상 | 불확실 합집합 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| values | 879 | 2448 | 940 | 1122 | 1062 | 109 | 571 | 0 | 1508 |
| approved | 25 | 2448 | 25 | 1872 | 1257 | 2185 | 1034 | 0 | 2423 |

| 집계 | 교재에만 존재 | 내부 난이도 공백 | 방법 1개 | CONFIRMED | UNKNOWN |
| --- | ---: | ---: | ---: | ---: | ---: |
| values | 0 | 14 | 52 | 0 | 66 |
| approved | 0 | 2 | 51 | 0 | 53 |

확정 후보는 0개이므로 확정 예시 5개를 만들어 쓰지 않는다. 대신 values의 UNKNOWN 예시 5개:
- `SINGLE_METHOD_GROUP` / `H22-C-06-EQUATION_APPLICATION` / `TPL_H1_QUADRATIC_INEQUALITY_SIGN_INTERVAL`: 불확실 584/585 (99.8%), 근거 `original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js #2`.
- `SINGLE_METHOD_GROUP` / `H22-C-06-INEQUALITY` / `TPL_H1_QUADRATIC_GRAPH_RELATION_GEOMETRY`: 불확실 612/639 (95.8%), 근거 `original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js #8`.
- `INTERIOR_DIFFICULTY_GAP` / `H22-C-08-COMBINATION` / `TPL_H1_COUNTING_DIRECT_CASE`: 불확실 632/671 (94.2%), 근거 `original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js #23; original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js #20; original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js #9`.
- `INTERIOR_DIFFICULTY_GAP` / `H22-C-05-QUADRATIC_EQUATION` / `TPL_H1_VIETA_SYMMETRIC_VALUE`: 불확실 591/665 (88.9%), 근거 `original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js #11; similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사.js #18`.
- `SINGLE_METHOD_GROUP` / `H22-C-08-PERMUTATION` / `TPL_COMBINATION_SELECTION`: 불확실 602/620 (97.1%), 근거 `original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js #21`.

## 임의로 정한 것·한계
- 단원 미상 문항은 과목 분모에 두며 같은 과목의 모든 단원 후보에 잠재 불확실성으로 부과한다. 교육과정/과목 자체가 미상인 문항은 보수적으로 모든 후보의 분모에 더한다. 실제 소속 단원을 추정하지 않는다. 이 때문에 후보를 확정하는 데 보수적이다.
- 현행 단원·소단원 키 그대로 집계한다. 과목 표기 및 동의 유형을 자동 병합하지 않는다. source 종류 `types`는 교재/문제집과 함께 분류했다.
- 전체 generated 생산/후보 이력 전수가 아니라 현재 production consumer index를 분모로 한다. 생성문항의 method는 미연결 상태로 남긴다. REGISTERED 4칸과 독립 의미검수 완료는 다르다.
- 원시 시험지 로드 실패 등 문항 수를 알 수 없는 입력이 생기면 `unquantifiedInput`을 남기고 모든 후보를 UNKNOWN으로 분류한다. 입력 실패를 0문항으로 덮지 않는다.
- source blob이 달라진 4칸의 기존 등록 상태를 자동 재승인하지 않는다. 값은 유지하고 approved 분석에서 미승인으로 센다.
- 시작 main에 TASK01 completion 도구가 없어 catalog field 판정을 출처 명시해 사용했다. TASK01 병합 뒤 공식 완료/승인 함수 연결 지점은 `loadRecords`의 approved 필드다. TASK09 scope alias 병합 뒤 과목 표기 통합을 연결할 수 있으나 이 브랜치에 미병합 코드를 복사하지 않았다.

## 검증
- `node --test tests/archive-coverage-map.test.mjs`: 최종 13/13 PASS. 작은 fixture 포함; 전체 run-tests 목록에 등록.
- 독립 읽기전용 검토에서 4개 주요 반례 발견: 불완전 문항을 실제 부재로 오판, 인라인 값 승인 승격, 생성문항 분모 누락, 4칸 사전 미검증. 모두 수정. 검토자의 별도 기출·난이도 반례 재현 2건도 해소 확인.
- 방법 묶음 표본이 실제 method 보유 문항만 가리키도록 추가 수정. ACTIVE 단원/소단원 관계와 무효 단원의 불확실 분모 테스트 추가.
- 최종 표적 13/13 및 `git diff --check` PASS. 원격 코드 tree가 검증한 로컬 tree와 동일함을 확인.
- NOT_RUN: 전체 테스트 묶음, 브라우저, 원격 CI, main 병합, 배포. 이 작업은 학생 런타임 변경 없이 읽기 전용 도구 추가다.

## 재현 명령
```sh
node archive/tools/coverage/build-map.mjs --scope middle/m3 --out /tmp/coverage-m3.json
node archive/tools/coverage/find-gaps.mjs --map /tmp/coverage-m3.json --out /tmp/gaps-m3.json
node archive/tools/coverage/build-map.mjs --course 공통수학1 --out /tmp/coverage-h1.json
node archive/tools/coverage/find-gaps.mjs --map /tmp/coverage-h1.json --out /tmp/gaps-h1.json
```
