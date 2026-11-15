# M1-S1-META-FULL — SOURCE_ONLY 근거 추적 및 원문 판정 보완

- taskId: `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`
- 담당: `/root/source_method_debt`
- 원검토 근거: `b2572826f5d86102193b5d6a84635e192301795b`
- 운영 입력 검증 기준: `854215b755536cc73b1ce412aed239dc396fd53d`
- 로컬 수정 브랜치: `fix/m1-s1-source-transcriptions-20261115`
- 상태: **로컬 검증 완료, ROOT 원격 보존·병합 대기**
- 기존 286문항 전수 검토, 독립표본 36개, solved 93문항 판본 계보 확인은 반복하지 않았다.

## 결론

**SOURCE_ONLY 193문항에 적용할 현재 판본의 승인된 method 근거는 이번에 확인한 자료에서 발견되지 않았다.** 따라서 `method=[]`를 유지한다. 기존 후보를 다시 읽거나 유사문항의 해설을 찾았다는 사실을 원본 해설 승인으로 바꾸지 않았다.

그와 별개로 실제 해결한 항목은 두 가지다.

1. **2019 금당중 1학기 기말 Q20의 원문 전사 오류를 수정했다.** 서로 독립된 문제·정답 PDF의 인쇄 조건은 모두 `8/x`이며 현행 JS만 `6/x`였다. 소스의 해당 계수 한 자리만 6에서 8로 바꾸고, 24문항의 분모·순서와 그 밖의 모든 필드를 보존했다.
2. **2017 매산중 1학기 중간 Q19의 잘못된 ‘점 삭제’ 제안을 채택하지 않도록 판정을 보완했다.** 같은 PDF 실바이트의 새 확대 화면에는 오른쪽 0과 x 사이에 진한 점 모양의 인쇄 흔적이 보인다. worker와 ROOT가 독립적으로 확인했으므로, 과거 ‘점이 없다’는 단정을 근거로 보기를 고치지 않는다. 원본 source는 그대로다.

## 1. SOURCE_ONLY 193문항의 현재 입력 확인

수정 전 운영 JS 8개의 SHA-256을 기존 검토의 source binding과 기계적으로 대조했다. **8개 모두 일치**, 총 193문항에서 **answer와 solution은 전부 공란**이었다. 이는 재풀이가 아니라 판본·빈 필드 확인이다.

| 시험지 | 문항 수 | 기존 검토 SHA 일치 | answer/solution 비공란 |
| --- | ---: | --- | ---: |
| 2019 금당중 1기말 | 24 | 일치 | 0 / 0 |
| 2019 동산중 1기말 | 25 | 일치 | 0 / 0 |
| 2019 연향중 1기말 | 23 | 일치 | 0 / 0 |
| 2019 왕운중 1기말 | 24 | 일치 | 0 / 0 |
| 2017 금당중 1중간 | 25 | 일치 | 0 / 0 |
| 2017 매산중 1중간 | 24 | 일치 | 0 / 0 |
| 2017 삼산중 1중간 | 24 | 일치 | 0 / 0 |
| 2016 연향중 1중간 | 24 | 일치 | 0 / 0 |
| **합계** | **193** | **8 / 8** | **0 / 0** |

현재 `question_metadata.json`의 동일 193 UID는 모두 `registration_pending_semantic_review`이다. PT와 TPL의 비공란 행은 각각 0개다. current 4slot 481파일과 meta-foundation/evidence 1,578파일은 Git tree 대비 누락 없이 로컬에 있었고, 해당 영역에서 정확한 193 UID 참조를 검색한 결과는 0건이었다.

근거: `source-readback-summary.json`, `current-193-metadata-lookup.json`, `search-scope-hydration.json`.

## 2. 발견한 옛 4slot 97문항을 승격하지 않은 이유

`work/4slot-annotate-v1`의 고정 HEAD `5d2180d1e0d4c74453c06570f4adf65dd07957bb`에서 SOURCE_ONLY 중 2016·2017년 네 시험지의 후보 97문항을 발견했다.

| 시험지 | 문항 수 | method 항목 수 | stem 근거 | choices 근거 | solution 근거 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2016 연향중 1중간 | 24 | 50 | 35 | 15 | 0 |
| 2017 금당중 1중간 | 25 | 52 | 29 | 23 | 0 |
| 2017 매산중 1중간 | 24 | 51 | 37 | 14 | 0 |
| 2017 삼산중 1중간 | 24 | 51 | 41 | 10 | 0 |
| **합계** | **97** | **204** | **142** | **62** | **0** |

이 파일들은 `judgedBy: antigravity-5h-batch`와 selfCheck를 제공한다. **204개 전부 문제·선지 기반 후보이며 승인된 해설을 인용하는 항목은 없다.** 독립 승인 기록도 그 파일들에서 확인되지 않았다. 2017 금당중은 후보의 source blob이 현재 source blob과도 다르다. 따라서 존재하는 용어를 가져와 빈 method를 채울 수 없다.

알려진 같은 브랜치의 `out/original/middle/m1/1final` 디렉터리는 찾지 못했다. 이는 그 경로의 조회 결과이며 모든 저장소·모든 Drive 파일에 자료가 없다는 주장이 아니다.

근거: `source-only-evidence-trace.json`의 `knownCandidateBranch`.

## 3. 추가로 찾은 Drive 정답 파일

다음 두 파일을 원시 PDF로 받아 해시를 계산하고 전체 7쪽을 실제 렌더해 읽었다. 기존 286문항을 다시 풀이한 것이 아니라, **승인된 풀이 과정이 들어 있는지**만 확인했다.

| 파일 | Drive ID | SHA-256 | 확인한 내용 |
| --- | --- | --- | --- |
| 2019 연향중1 1기말 주관식 정답 | `1roqBi7fvgKQyVY4Vl2f_Jld_cqdiNrgG` | `9ea32aa1cc81e3a93152d2f80c527f9dfda9dc10f6b175a0e74fc60aeb1fc108` | 3쪽. 인쇄 문제 위 필기 최종답과 정정 표시. 완결된 풀이·현재 판본 승인 기록 없음. |
| 2019 왕운중1 1기말 주관식 정답 | `1cTRyVR0GgPyhxFInByrD47Ff8d2shDTW` | `3462e7eac0033b17afdd6aa8500650f5180ee546457b0e1d050f4190fc2c9af9` | 4쪽. 인쇄 문제 위 필기 최종답과 취소 표시. 완결된 풀이·현재 판본 승인 기록 없음. |

이 문서들은 현재 source-only의 method 승인 근거가 아니다. 정답만 있는 문서와 실제 풀이 방법을 검토·승인한 증거를 구분했다.

## 4. 금당 Q20의 정확한 수정과 직접 영향

대상:
`archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js`

UID:
`qid_v1_2e57de2c53204013dd96317d274069537db1672516e0797707dc13f55167161f`

원본 두 PDF를 다시 받아 SHA가 기존 근거와 일치함을 확인했다. 두 문서 모두 p3 Q20에 계수 8이 인쇄되어 있었다.

| 문서 | Drive ID | SHA-256 |
| --- | --- | --- |
| 문제 PDF | `1U1Ns8dm9CHgaAw7mszaNM501qt-GlJZ1` | `be0f190d7caf4dc5a2204dc92600fa4429ea32920ea24ac6dc1a8673b5f009ef` |
| 정답 PDF | `1lYd_uECxzmTcewD0fGs_5OughLFRl614` | `6b43897bc98ae6eff72ce32cbb0632ad24e60c6add94b3964c521e88f3610271` |

변경 후 source Git blob은 **`a370abb83cfa7bb65a8de980422c5b4869c3490f`**, raw SHA-256은 **`d6930f0aab817111af7c25fce3cfdbf7a4b5002269523719e004734e6c3c245d`**이다.

실제 검증 결과:

- 변경은 Q20의 `question` 필드 한 곳, 계수 6→8 한 자리다.
- 24문항 분모와 UID 순서, metadata, choices, answer, solution 및 모든 다른 문항·필드는 그대로다.
- source-only 공란 answer/solution 24개가 유지된다.
- `node --check` 성공.
- 기존 CRLF를 보존했다. 기본 `git diff --check`는 추가된 CRLF 줄을 trailing whitespace로 표시한다. `git -c core.whitespace=cr-at-eol diff --check`는 성공했다. 줄바꿈을 대량 변경해 숨기지 않았다.

### 기존 유사문항에 대한 영향

동일 학교·시험 이름의 유사시험지가 실제로 있었으므로 Q20 직접 의존성을 추가 확인했다.

`archive/exams/similar/middle/m1/1final/19_금당중_1학기_기말_중1_유사.js`의 Q20은 계수 12인 별도 문항이다. 현행 Q20 전체 객체는 기존 review receipt가 가리킨 candidate blob `359b294ff5bf3d5f7da5ffcd652820a7a3406f1b`의 Q20과 완전히 같다. 해당 유사 Q20의 결과는 직접 계산과 기존 receipt가 일치했다. 원본 Q20의 source path·UID·old blob을 고정한 참조는 이 JS/meta/receipt와 Q20 시각 plan에 없다.

`generated-lite-consumer/v1/index.json`의 실제 1,536 records에서도 원본 시험지명·Q20 UID·source blob 참조는 각각 0건이다. tests 836파일과 archive/tools 3,166파일의 hydrated 범위에서도 원본 시험지명·기존 blob·raw SHA 고정값을 찾지 못했다.

따라서 유사문항과 승인 영수증의 내용·해시를 바꾸지 않았다. 다른 UID의 유사 해설을 원본 method 승인으로 재사용하지도 않았다.

### 기존 fingerprint 도구의 한계

이 source는 `examData.questions[].question` 형식이다. 현재 identity/meta의 legacy QBODY/QFULL 산식은 `content`만 읽어 `content:null`로 계산한다. 따라서 이번 `question` 변경에도 legacy fingerprint는 숫자상 같으며, 이것을 문제 내용 불변의 증거로 쓰면 안 된다.

공유 산식이나 기존 hash 필드를 손으로 바꾸지 않았다. 변경은 **실제 원시 파일 SHA와 Q20 question 문자열 SHA**에 결속했다. 새 question SHA는 `d9a63b5ba1d70ecdda13d39c8876052e040626e0916609eb3ef4c3aa66ee8c4a`이다.

근거: `source-transcription-verification.json`.

## 5. 매산 Q19 판정 보정

같은 원본 PDF(`1GlAmJX-5gdsK8QpaKb7n6RA5_zcYuY92`, SHA `28f9eb0c1c3400613bc918b241945c6e7693def92e783392eebe690b37250b51`) p3의 보기④를 새로 확대했다.

`maesan-q19-choice4-crop.png`에는 오른쪽 0 뒤 x 앞에 진한 점 형태가 보인다. 따라서 기존 residual 기록의 ‘인쇄본에는 점이 없다’는 단정과 그에 따른 점 삭제 제안은 채택할 수 없다. ROOT도 같은 crop을 독립적으로 보고 source 유지에 동의했다.

- 현재 source raw SHA `b2d2ad1d75315f06d7496d244bb563728f2e03223c007450088b1d17eeb9c343`를 그대로 유지했다.
- 보기의 거짓 등식을 참인 식으로 바꾸지 않았다.
- 과거 증거를 덮어쓰지 않고 새 판정 기록으로 보완했다.
- crop SHA: `ba208c7eb403fbfa9bd97705fe3d1629f2189798f3d9587502ebec6b8c897101`.

근거: `maesan-q19-adjudication-correction.json`.

## 6. 유지해야 할 나머지 판정

매산 22~24번은 이미 원본에서 확인된 **선택 묶음**이다. 기존 소문항별 판단을 재사용하고 원본 UID를 유지한다. 전체 UID 난도 bucket 미정 3개, 단일 PT/TPL 투영 보류 2개를 가장 어려운 선택지로 자동 확정하지 않는다.

2019 금당 Q15 판본 간 차이, 2017 매산 Q4·삼산 Q15의 원문 조건 부족, 인쇄본 자체의 중복 보기, 2016 연향 Q11 규칙의 불확실성은 기존 분류대로 남는다. 새 승인·정오표·풀이 근거 없이 원본 조건을 만들어 넣지 않았다.

SOURCE_ONLY method를 닫으려면 문항 UID와 실제 판본에 묶인 풀이, 그 풀이의 독립 검토 또는 명시적 승인, 그리고 결정적 단계별 method 근거가 필요하다. 현재 사전의 키가 존재한다는 사실만으로는 이 요건을 대신할 수 없다.

## 인계와 저장

원격 쓰기·stage·commit은 수행하지 않았다. ROOT가 운영 source와 필요한 현행 결속만 반영하고, 원시 검증 자료는 프로젝트의 증거 보존 정책에 맞게 저장한다. 원본 PDF들은 이미 명시한 Drive ID로 보존되어 있으므로 Git에 재복제할 필요가 없다.

`SUMMARY.json`이 이 문서의 기계 판독 요약이다. `FINAL_ARTIFACT_MANIFEST.json`에 전달 파일명·크기·SHA-256과 저장 역할을 고정한다. AWCR에는 이 자료의 안전한 상태·참조 메타데이터만 기록하며 답·해설 원문을 싣지 않는다.

