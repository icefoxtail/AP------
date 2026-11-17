# TASK-15 진행 보고 — 중2 수와 식 PILOT

## 현재 상태

**TASK-15 전체는 미완료다. A의 중2 수와 식 PILOT만 제출했고 관제 확인을 기다린다. B(기존 PT 아래 TPL 묶음), C(고1 빈 문항 추가 판정), D(형식 정리·표본 재검토)는 진행 중이며, 이 보고는 그 완료를 증명하지 않는다.**

관제 확인 전에는 A의 다른 단원으로 확대하지 않는다. TASK-15 뒤에는 기존 TASK-14 plan 범위까지만 마무리하고 멈추라는 최신 사용자 지시를 따른다. PR 생성과 main 병합은 하지 않는다.

## A. 제출한 PILOT

- 브랜치: `data/type-bundles-20261117`
- 커밋: `25d8ea3940bac24eec620cbc78e33b67d42c701a`
- 파일: `docs/plans/archive-one-route-upgrade/type-bundles/PILOT-m2-number-expr.md`
- 원격 파일 blob: `443808e1a4a9197e359d3468a641acc99c8a9ac2`
- 결과: 원격 브랜치 head 확인 및 파일 전체 readback 일치.
- 기존 결과표·정본·시험지 JS·레지스트리 변경: 0. 등록 요청·PR·main 병합: 0.

### 시범 묶음

| 개념 | 문항 수 |
|---|---:|
| 유리수와 소수 | 212 |
| 순환소수 | 206 |
| 거듭제곱 | 89 |
| 단항식 | 68 |
| 다항식 | 113 |
| 합계 | 688 |

출처는 C(기출·유사) 474줄과 T(유형 문제지) 214줄이다. D에는 이번 중2 시범 해당 줄이 없다.

중2 수와 식 후보 689줄의 기존 결정 단계(step)를 직접 읽었다. 제안 이름만으로 섞이는 12줄은 실제 step에 맞게 이동하고, 숫자 배율만을 쓰는 원기둥 부피비 1줄은 도형 경계 목록으로 분리했다. 689 = 시범 688 + 경계 1이며, 원장 행의 삭제·재판정은 아니다.

대표 15문항은 현재 main의 발문·보기·해설을 직접 대조했다. 그림을 가리키는 금당중 2020 1학기 기말 7번은 q07.png를 직접 보아 반지름 3ab²를 확인했다. 나머지 673문항의 원문·그림 전수 재판정은 NOT_RUN이다. 이번 결과는 인수된 원장에 근거한 묶음 시범이지 전체 문항의 독립 재검수 승인이 아니다.

### 검사

- 입력 JSONL 파싱: PASS.
- 시범 uid 688개, 중복 0, 원장에 없는 uid 0.
- 묶음별 합계와 이동 전후 uid 보존: PASS.
- 시범 문서 한 파일만 커밋; LF 및 diff 공백 검사: PASS.
- 시범 uid 정렬 목록 SHA-256은 PILOT 문서에 기록했다.
- A 전체 대응표 coverage: NOT_RUN.
- 최종 신규 묶음 수·absorbInto 확정 수·단건 묶음 수: NOT_RUN.

## 관제 확인이 필요한 경계

1. 위 다섯 개념의 굵기를 확인한다. **신규 PT 5개 확정이 아니다.** PT/TPL 이름은 짧게 하고 조건·결합 개념은 별도 꼬리표로 뺀다.
2. `PT_M2_MONOMIAL_MULTIPLICATION_DIVISION`의 현재 ACTIVE 정의는 여러 계산식의 옳고 그름 판별이다. 직접 계산·미지 지수·높이 역산을 전부 일괄 흡수하지 않는다.
3. `PT_H22A_01_EXPONENT_LAWS`, `PT_H1_POLY_OPERATION_EXPANSION`, `PT_H1_POLY_DIVISION`은 기존 ACTIVE 흡수 후보이다. 중등의 단순 연산에 재사용할 의미 경계와 바인딩을 분리하여 확인한다. 키가 ACTIVE라는 이유만으로 모든 줄을 흡수하지 않는다.
4. 거듭제곱 일의 자리 주기를 같은 개념의 TPL로 둘지 별도 개념으로 둘지 확인한다.
5. 잘못 더한 식의 복원, 삼각형 넓이로 높이 구하기처럼 기존 정의가 좁은 키에는 곱셈·나눗셈 오산이나 원뿔·원기둥을 무조건 넣지 않는다.

최종 `new-pt-bundles.json` 및 `new-pt-assign.jsonl`은 관제의 굵기 확인 후 작성한다. 이 단계에서는 나머지 A 단원으로 확대하지 않았다.

## 지시서 수치와 입력 스냅샷 차이

PILOT 입력 시점 원격 결과표를 실제 받아 읽은 NEW_KEY 수:

| 결과표 | 지시서 | 실측 |
|---|---:|---:|
| C | 2,322 | 2,322 |
| D | 78 | 78 |
| T | 796 | 702 |
| 합계 | 3,196 | 3,102 |

차이는 T의 94줄이다. 감소 원인을 이 PILOT에서 확정하지 않았다. 지시서의 숫자에 맞추려고 결과를 복원·삭제·변경하지 않았으며, 아래 고정 스냅샷의 실측으로 보고한다. B/C/D의 후속 수정 이후 수치와 혼동하지 않는다.

- C: `52d2699b5ce8463fa9446e87a811863a275a3ab8`
- D: `97124a2298f7aed7a7e385e17c33ade4c5d6b9a6`
- T: `f0bf67dcca017e4a7490b7ff540f1c97682aab47`
- 대표 원문·레지스트리 main: `22f79c4ffd5ad5f811c2840a532422e0ecabd3e1`

## 남은 작업

- A: 관제 확인 → 승인된 굵기로 전체 NEW_KEY 대응표 작성 및 coverage 검사.
- B: 진행 중. 대상 줄 전수 대응표 및 TPL 흡수 결과는 후속 커밋으로 보고.
- C: 진행 중. 고1 빈 키 미판정 0 조건은 아직 검증하지 않았다.
- D: 진행 중. step·README·의문 2건의 반영 완료는 아직 보고하지 않는다.
- TASK-15 전체 완료 후 기존 TASK-14 plan 범위까지만 마무리하고 중단.


---

# 2026-11-17 추가 보고: 94줄 집계 정정 및 C 완료

이하는 위 PILOT 당시 보고를 보존한 후속 정정이다. 위의 T702/전체3102 및 C 진행 중 표시는 이 절로 갱신한다. FEEDBACK-15-pilot에서 묶음 굵기가 승인되어 A·B는 후속 작업 대상으로 남고, C만 아래와 같이 완료했다. TASK-15 전체 완료를 뜻하지 않는다.

# NEW_KEY 94줄 차이 감사

## 결론
같은 PILOT 입력 커밋에서 C 2322 + D 78 + T 796 = 3196이다. PILOT의 3102는 실제 줄 감소가 아니라 한글 파일 경로 누락 집계이다. 원격 수정 없이 재계수했다.

## 고정 입력
- C: `52d2699b5ce8463fa9446e87a811863a275a3ab8`, NEW_KEY 2322, 동일 lane UID중복 0
- D: `97124a2298f7aed7a7e385e17c33ade4c5d6b9a6`, NEW_KEY 78, 동일 lane UID중복 0
- T: `f0bf67dcca017e4a7490b7ff540f1c97682aab47`, NEW_KEY 796, 동일 lane UID중복 0

## 누락 분해
- 동아출판_공통수학1.jsonl: 2
- 미래엔_대수.jsonl: 7
- 백발백중_공통수학2.jsonl: 8
- 비상교육_공통수학2.jsonl: 1
- 비상교육_기하.jsonl: 65
- 비상교육_대수.jsonl: 9
- 비상교육_확률과통계.jsonl: 2

합계94. PILOT 실제 입력 new.json의 T UID702와 같은 커밋 전체796의 차집합94를 missing94.json에 보존했다.

## 재현
`git ls-tree -r --name-only <sha> <type-results-t>`는 core.quotePath 기본값에서 한글 경로를 따옴표와 octal escape로 출력한다. 이 출력을 splitlines() 후 endswith(".jsonl")로 거르면 한글 파일은 끝의 따옴표 때문에 제외되고 영문 types-m1/m2/m3만 남는다:475+216+11=702. `--name-only -z`와 NUL 분리로 같은 커밋을 읽으면 796이다. 이 재현의 누락 UID 집합이 PILOT 누락94와 정확히 일치한다. 기존 수집 코드 본체는 확보하지 않았으므로 어떤 소스 라인에서 오류났는지는 단정하지 않는다.

## 시점 및 중복 배제 검증
- 최신 T와 PILOT T의 NEW_KEY UID 집합은 796건 완전 동일하다.
- 중간 네 커밋은 미적분 step2줄, 확률과통계 TPL1줄, README만 바꾸며 NEW_KEY를 바꾸지 않았다.
- 비상_미적분1 및 비상교육_미적분1은 각각194행 PICK192/HOLD2/NEW_KEY0. 어느 한쪽을 제외해도 NEW_KEY 차이는0이다.
- 따라서94는 비상 중복 제외나 결과 커밋 시차가 아니다.



# TASK15 C 고1 원본 유형 공란 판정 완료

- 대상: 최신 main 22f79c4ffd5ad5f811c2840a532422e0ecabd3e1 기준 고1 원본 `problemTypeKey` 공란, 기존 D 결과 UID 제외.
- 최신 main과 비교 identical 확인. 기존 정본 유형은 공란 식별에만 이용, 실제 판정은 문제·해설·참조 그림과 ACTIVE 정의로 독립 수행.
- 77시험지 1197문항 모두 PICK. UID 누락0/중복0.
- 1mid 7시험지22, 1final17시험지238, 2mid30시험지641, 2final23시험지296.
- check: PASS1089, PT_ONLY15, OUT_OF_CANDIDATES50, TOOL_ERROR43. 그림141문항 직접확인.
- TOOL_ERROR43: 25 매산여고 2mid23, 25 순천여고 2mid20. `CANONICAL_IDENTITY_CONFLICT:1`로 검사 진입 실패. 판정은 유지하고 ACTIVE키/상위관계 직접 확인. 도구 문제를 HOLD 사유로 사용하지 않음.
- PT_ONLY는 정확한 PT로 PICK하고 tpl null 및 TPL 이름·정의 제안. 별첨 제안은 같은 뜻으로 묶었고 문항 3개 미만이면 실제 있는 대표만 기록.
- 저장: data/type-judgment-d-20261116의 type-results-d/h1-{1mid,1final,2mid,2final}.jsonl만 갱신. main/정본/JS/PR 미변경.
- 최종 커밋: 87ebdf34a3743d53139ab94aae2312e0e6c71274. 원격4파일 재읽기 및 범위/UID/exam/no/figure 원본메타 대조 전부 통과.

## 검수 중 바로잡은 사항
- 2final24~32의90행 figure가 NOT_NEEDED 문자열을 bool로 바꾸면서 true가 되었던 부분을 실제 source.image 대조로 false 정정. PT/TPL/step 불변. 최종 해당파일 true40/false256.
- exam 경로를 archive/exams/ 접두어로 통일. 최종1197행 원문경로 모두 일치.
- LaTex 중간에서 잘린 cue 2건은 완전한 구절로 재검사 PASS로 개선.
- 강남여고22 2mid q13은 고정점을 지나는 직선의 거리최대에 정확히 맞는 ACTIVE PT_LINE_DISTANCE_EXTREMUM/TPL_DISTANCE_EXTREMUM_SINGLE_POINT 발견 후 PT_ONLY에서 PASS로 정밀화.
- 팔마고22 2mid q15 원문 반례에 일시적으로 붙인 의심note는 재계산으로 원문 정상임을 확인하여 삭제. 판정 불변.
- D note-only 요청 복성고19 2mid q20은 e3d77b180a6a26e63c894dd63483f40d81902271에 기존 PT/TPL 유지하고 근거만 보존 추가.

## 수행 범위 및 종료
TASK15 C 배정 전량 완료. 이후 작업은 부모가 최신 QUEUE 및 사용자의 ‘플랜 하던 것까지만 하고 멈춤’ 지시에 맞춰 조정한다.

# TASK15 C 신규 TPL 제안 묶음

PT-only 15문항, 뜻별 14개 묶음. 대표 문항이 3개 미만인 묶음은 실제 있는 문항만 기재.

## 인수 조건과 몫의 값
- 상위 PT: `PT_H1_FACTOR_THEOREM`
- 이름·정의: 인수 조건과 몫의 값; 정의: 인수정리로 계수를 정하고 나머지 인수의 함숫값을 구한다.
- 문항 수: 2
- 대표 문항:
  - archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js #5 (`qid_v1_8af06999d1a0b438d90a0643d1c241e20c11317b78164ec7e057c5e1720a6960`)
  - archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js #24 (`qid_v1_2c107f88430fa3af5dcb5f20770e2abbe1f86f721dbddacfe0d90982a1caf970`)

## 내분·외분 판별
- 상위 PT: `PT_COORD_SECTION`
- 이름·정의: 내분·외분 판별; 정의: 점의 순서와 거리비를 비교하여 내분·외분에 관한 진술의 참거짓을 가린다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js #12 (`qid_v1_18a996954ca22f78af74ae5aaae0945ca3d4317b1e2cd5ac4e8d3c30ebe84d6c`)

## 두 근으로 방정식 구성
- 상위 PT: `PT_H1_ROOT_COEFFICIENT_RELATION`
- 이름·정의: 두 근으로 방정식 구성; 정의: 주어진 두 근의 합과 곱으로 최고차항 계수가 1인 이차방정식을 구성한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js #20 (`qid_v1_9edc012da8f457d4df4f39c4c5a2acf465b94de002963ab9c892721ca7cac670`)

## 이동과 넓이 보존
- 상위 PT: `PT_MOVE_COMPOSITE`
- 이름·정의: 이동과 넓이 보존; 정의: 곡선의 식 없이 대칭·평행이동에 따른 넓이 보존과 일정한 간격으로 영역 넓이를 구한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js #12 (`qid_v1_7a2c037ec05170de7878bd4247877d2461dd1b98c9dade8f6948d626044216a1`)

## 원의 조건 판별
- 상위 PT: `PT_CIRCLE_EQUATION`
- 이름·정의: 원의 조건 판별; 정의: 원 성립·축 접촉 조건을 읽고 반례로 보편 진술을 판별한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js #20 (`qid_v1_5d50ba4d0dcf01793ddc67dcd565b907d73c489bdfd16dd87cbd93a2c0d57e6b`)

## 좌표를 이용한 중선 정리 증명. 한 변의 중점을 원점으로 정하여 두 거리 제곱의 합을 정리하는 유형.
- 상위 PT: `PT_COORD_FIGURE_PROPERTIES`
- 이름·정의: 좌표를 이용한 중선 정리 증명. 한 변의 중점을 원점으로 정하여 두 거리 제곱의 합을 정리하는 유형.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js #7 (`qid_v1_79fb1dd04f41a18af0e3c1d33e8b5985449da22b8d2e5e45295f66d850532864`)

## 중심과 한 점
- 상위 PT: `PT_CIRCLE_EQUATION`
- 이름·정의: 중심과 한 점; 정의: 중심과 원 위의 한 점 사이 거리로 반지름을 구하여 원의 방정식을 세운다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js #1 (`qid_v1_988103868c813feeb0e500ee575b3a7ade21442782a2b0abf3a4a998b451da55`)

## 원소 수의 홀짝
- 상위 PT: `PT_SUBSET_COUNT`
- 이름·정의: 원소 수의 홀짝; 정의: 부분집합의 크기 홀짝을 고정한 뒤 합 조건으로 가능한 선택을 걸러 개수를 센다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js #16 (`qid_v1_201789779b767a9f7defeddebfde7003e3f9044d531c2debf571a884cfceea82`)

## 치역 원소 수
- 상위 PT: `PT_DOMAIN_RANGE_SURJECTIVITY`
- 이름·정의: 치역 원소 수; 정의: 유한 정의역에서 같은 함숫값을 주는 입력끼리 묶어 치역 원소 수와 그 극값 조건을 구한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js #17 (`qid_v1_3be1a2621ad257a10cf4f8eb2549bf72d80d34196140a307d5bc93a41f6259cc`)

## 정수 높이별 교점 개수
- 상위 PT: `PT_FUNCTION_GRAPH_GEOMETRY`
- 이름·정의: 정수 높이별 교점 개수. 정의: 대칭 그래프의 수평 정수선별 교점 수를 누적하여 꼭짓점 높이와 계수를 결정한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/22_순천여고_2학기_중간_고1_기출.js #20 (`qid_v1_9908b504105d14ee3429f21379e77449fc17e7aa59e86ce13870eebc2e13ff64`)

## 잉여류별 일대일대응 정의역 선택
- 상위 PT: `PT_FUNCTION_COUNTING`
- 이름·정의: 잉여류별 일대일대응 정의역 선택. 정의: 고정된 함수가 일대일대응이 되도록 각 함수값의 원상집합에서 원소 하나씩 골라 정의역의 개수를 센다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/22_제일고_2학기_중간_고1_기출.js #16 (`qid_v1_dfd3fd6b5ff1e71492e419ce7f02cbe01dd14715372a2465c787b80d01d25a3f`)

## 무리수의 정수 인수곱 귀류법
- 상위 PT: `PT_CONTRADICTION_PROOF`
- 이름·정의: 무리수의 정수 인수곱 귀류법. 정의: 유리수 가정을 정수 제곱 등식으로 환원하고 차의 제곱 인수곱이1인 경우를 따져 모순을 만든다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/23_강남여고_2학기_중간_고1_기출.js #17 (`qid_v1_eeaae8329366ce661ae678ca266009f5e7b4c5b334127a25ecbbf37a53a8af69`)

## 합의 성질
- 상위 PT: `PT_SET_AGGREGATE`
- 이름·정의: 합의 성질 — 집합 원소합의 서로소 가법성과 같은 합에 대한 반례를 이용해 명제를 판정한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js #9 (`qid_v1_3b54370fba1c07d916ebc69a75d11a85446bbf24d9fb0784a86231566de644ad`)

## 직각삼각형
- 상위 PT: `PT_COORD_FIGURE_PROPERTIES`
- 이름·정의: 직각삼각형 — 좌표에서 직각 꼭짓점을 경우분류하고 수직 조건 또는 지름 원으로 가능한 꼭짓점을 결정한다.
- 문항 수: 1
- 대표 문항:
  - archive/exams/original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js #19 (`qid_v1_363c98e4a9f3f7e9b1be969f929664a90d2f735c4af32f61cf388db7cd07290b`)


## 원문 의심 기록 (수정하지 않고 판정 note에 보존)
- archive/exams/original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js #9 (`qid_v1_4df64f48a5f3916e3f23cc5ade33aabd33a1435b1a1c5d3985ad40767d5fd3db`): 원문 의심: ax+by+c=0의 계수 정규화 조건이 없어 a+b+c는 상수배에 따라 달라진다. 접점현 판정은 가능하며 해설의 정규화(4,3,-5)를 기준으로 읽었다.
- archive/exams/original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js #5 (`qid_v1_5c79b8458053ea01b3b28526aa9236280d1253c6fc500f05707b883061f44f0b`): 원문 의심: ②와 ⑤가 모두 항상 참인데 정답·해설은 ⑤만 제시한다; 정본은 수정하지 않음.
- archive/exams/original/high/h1/2mid/21_순천고_2학기_중간_고1_기출.js #14 (`qid_v1_522f92817eb2fae0cc5aa1e7ddc561f449ee4d74713acc1bc7742e6f7af8a10e`): 원문 의심: 해설 말미 요약의 P 두 번째 구간 시작이 3으로 잘못 적혀 있으나 발문과 본풀이의 3/2를 기준으로 판정.
- archive/exams/original/high/h1/2mid/21_팔마고_2학기_중간_고1_기출.js #19 (`qid_v1_75b89af555186eac464e9a971f83024fea3739322c2d71fda2b31187c4872749`): 원문 의심: 발문 ⑤⑥의 번호 위치가 대응 변환과 한 줄 어긋나 보이나 해설은 결합·교환 단계로 설명한다.
- archive/exams/original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js #19 (`qid_v1_3abe4b37e32e15bd8ccd81382b327c1e6cabdfa8f91e9fcf757479900b167d08`): 원문 의심: 형식적 후보 a=1은 두 직선 일치로 고유 교점 조건을 만족하지 않음; 판정 가능하므로 HOLD로 낮추지 않고 정본 미수정.
- archive/exams/original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js #20 (`qid_v1_ef433fe269262748bd7b1c1d93a5d40de548ac8661ce4972f480f4c582222c7d`): 원문 의심: 해설 말미 보강의 여집합80 표기는 틀리고 본풀이상 미신청은60명이다.
- archive/exams/original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js #12 (`qid_v1_80efa454afa2c15cf9dc8a2a09525921fe210e706fd683ab567999df71012b14`): 원문 의심: 그림 표기는 4/(x-1)처럼 보이지만 본문·해설은 4/(x+1)이다; 본문 기준 판정.
- archive/exams/original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js #27 (`qid_v1_0e658236809fd00236d0398a2422e2c5bbf6f1ed85e45b54b2489d2b00d0e421`): 원문 의심: 그림의 원점 통과 여부는 해설과 명확히 일치하지 않음; 핵심 유형은 계수 공유 사분면 판정.
- archive/exams/original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js #7 (`qid_v1_1c80d62daea384c3a078cf48f453d52ce837eb3b11aadee506c6e7b2e9dce4fb`): 원문 의심: 그림의 함수 라벨과 해설 f(b)=c,g(b)=a 대응이 맞지 않아 답 점검 필요; 판정 골격은 명확함.
- archive/exams/original/high/h1/2final/24_강남여고_2학기_기말_고1_기출.js #16 (`qid_v1_be1a3a88a92ef1f91294fa6783881109478ef52140a1c9b7f198523e79a1dceb`): 원문 의심: 그림의 왼쪽 곡선 라벨은 √(x-5)처럼 보이나 위치·본문·해설은 √(x+5)와 일치함; 본문 기준 판정.


---

## 2026-11-17 원문 복수정답 독립 확인 (읽기 전용)

아래 두 문항은 현재 main의 발문·보기·저장 정답을 직접 읽고 계산한 결과이다. 유형 판정과 별개인 원문 품질 문제이며, 이번 확인에서는 시험지 JS·정본 메타·등록 요청·레지스트리를 수정하지 않았다. 이 보고서만 추가한다. 원문 전체에 대한 추가 재검수나 수정 완료를 뜻하지 않는다.

### 1. 21 금당고 고1 2학기 중간 5번: ②·⑤ 동시 정답

- 파일: `archive/exams/original/high/h1/2mid/21_금당고_2학기_중간_고1_기출.js`
- 확인한 main 파일 blob: `93b2835c3bea5d0d2139bae6f50438f0b54a5faf`
- 발문: “두 조건 p,q에 대하여 ~p→q의 역이 참일 때 항상 참인 명제는?”
- 보기: ① ~p→~q / ② p→~q / ③ ~p→q / ④ ~q→p / ⑤ q→~p.
- 역은 q→~p이므로 ⑤가 참이다. 그 대우 p→~q는 원래 명제와 동치이므로 ②도 반드시 참이다.
- 따라서 현재 발문과 보기대로면 **②·⑤ 복수정답**이다. 현재 answer는 ⑤이고, 해설은 역의 형태만 찾고 그 대우인 ②를 검토하지 않았다.
- 현재 상태: 이 문제의 JS·정답·해설은 미수정 상태다.

### 2. 24 금당고 고1 1학기 기말 9번: 계수 정규화 부재

- 파일: `archive/exams/original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js`
- 확인한 main 파일 blob: `26798744633d26db1747865e04bc200bcd4f0bdd`
- 발문: 점 (4,3)에서 원 x²+y²=5에 그은 두 접선의 접점을 P,Q라 하고, 직선 PQ를 ax+by+c=0으로 나타내어 a+b+c를 묻는다. 단서는 a,b,c가 상수라는 것뿐이다.
- 보기: ① 5 / ② 4 / ③ 3 / ④ 2 / ⑤ 0.
- 접점 (s,t)에서의 접선 sx+ty=5가 (4,3)을 지나므로 4s+3t=5이다. 따라서 접점현은 4x+3y−5=0이다.
- 그러나 같은 직선은 λ(4x+3y−5)=0 (λ≠0)으로도 표현된다. 따라서 (a,b,c)=λ(4,3,−5), a+b+c=2λ이다.
- λ=5/2, 2, 3/2, 1을 택하면 각각 보기 ①,②,③,④가 가능하다. ⑤의 0은 λ=0이어야 하므로 직선을 나타내지 못한다.
- 따라서 **합은 유일하게 정해지지 않으며 보기 ①~④ 모두 가능**하다. 현재 answer는 ④이고, 해설은 추가 근거 없이 λ=1인 계수를 채택한다.
- 현재 상태: 계수 정규화 조건은 발문에 없고 JS·정답·해설은 미수정 상태다.

두 문항 모두 발문에서 그림을 참조하지 않는다. 이 확인은 발문과 보기의 논리·계수 표현만으로 결론이 나므로 해설 SVG는 열지 않았다. 보고서 저장 직전 main 파일 blob을 다시 확인했으며 위 두 blob과 같았다.
