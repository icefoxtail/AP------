# 2023 금당중 2학기 중간 중2 — 원본 대비 문항·해설 SVG 전수검수

- JS: `archive/exams/original/middle/m2/2mid/23_금당중_2학기_중간_중2_수학.js`; 25문항, 문제·해설 **각각 25축**.
- 검수 근거: 현재 JS의 실제 발문·답·해설, 같은 stem의 `archive/assets/images/` 원본 `qNN.png`, 현재 JS에 연결된 `qNN-*-visual-v2.svg`의 PNG 이미지 대조. q10의 원문 중국어 자료는 HTML `question-note-box`로 이미 제공되어 별도 기하 SVG 대상이 아님.
- 원본 연결: 문제 SVG 12축, 해설 SVG 11축. 기존 색칠 중 q21은 원본이 요구한 색칠한 초승달이어서 유지; q18은 넓이 추론에 필요한 △G′BD 구분이어서 유지.
- 재작성: **해설 8개** `q12,q13,q14,q15,q16,q17,q19,q25`의 엔진 실행형 JSON. 다른 학년·시험지·원본 JS·자산은 변경하지 않음.
- `plan-lint --shallow`: 8/8 OK. Full lint: Python `visual_engine` 부재로 8/8 `ModuleNotFoundError`, **ENV_BLOCKED / FULL_NOT_PASS**. 새로운 SVG 렌더·PNG 실물·학생 화면·A4 출력은 **NOT_RUN**.
- 아래 `DRAWN_FEATURE_PARITY`는 source → plan의 **실제 그리기 필드** 정적 매핑이며, 엔진 관측기로 렌더된 최종 SVG 픽셀 PASS가 아님.

| QID | 문제 축(P) 판단 | 해설 축(S) 판단 | Source-vs-plan / 필드 parity |
| --- | --- | --- | --- |
| q01 | EXEMPT: 식 표현 분류, 그림 불요 | EXEMPT: 식 분류 설명 | — |
| q02 | EXEMPT: 자연수 연립식 해의 개수 | EXEMPT: 대입 계산 | — |
| q03 | EXEMPT: 순서쌍 방정식 | EXEMPT: 대수 대입 | — |
| q04 | EXEMPT: 연립방정식 | EXEMPT: 연립식 정리 | — |
| q05 | EXEMPT: 연립방정식 | EXEMPT: 식 정리 | — |
| q06 | EXEMPT: 연립방정식 | EXEMPT: 해 대입 | — |
| q07 | EXEMPT: 연립방정식 | EXEMPT: 식의 소거 | — |
| q08 | EXEMPT: 연립방정식 | EXEMPT: 계수 계산 | — |
| q09 | EXEMPT: 해가 무수히 많은 조건 | EXEMPT: 계수비 비교 | — |
| q10 | **RETAIN**: 원문 중국어+번역이 HTML로 제공됨 | EXEMPT: 역사 자료 조건의 연립식 풀이 | 스캔 텍스트를 SVG로 재인쇄하지 않음 |
| q11 | EXEMPT: 일차함수 값 계산 | EXEMPT: 식에 수 대입 | — |
| q12 | RETAIN: 각·AD2/DC6/EC4 그림 | **REPLAN**: 필요 없는 색칠 제거, BC12·BE8 부착 | `angles`2·`dimensions`5; STATIC_PASS |
| q13 | RETAIN: 직각·높이·3·4 표식 | **REPLAN**: 높이·빗변 길이 연동 | `rightAngles`2·`dimensions`4; STATIC_PASS |
| q14 | RETAIN: DE∥BC·12/6/3 | **REPLAN**: 삼각형 채움 제거, AD8 길이 직접 표시 | `parallels`1·`dimensions`4; STATIC_PASS |
| q15 | RETAIN: 중점 삼각형·8/12/10 | **REPLAN**: 넓이 아닌 둘레 문제에서 면 채움 제거 | `equalLengths`3그룹·`dimensions`6; STATIC_PASS |
| q16 | RETAIN: AM 중점, CD∥ME, EM4 | **REPLAN**: 과도한 면 구분 정리, CN6 연결 | `equalLengths`2그룹·`parallels`1·`dimensions`2; STATIC_PASS |
| q17 | RETAIN: 교차선·평행 3선·21/28 | **REPLAN**: 어색한 비율 텍스트 제거, EF12 결속 | `parallels`3선 1그룹·`dimensions`3; STATIC_PASS |
| q18 | RETAIN: 무게중심 G·G′ 구조 | RETAIN: 높이 1/9와 **넓이** 비교 음영은 의미 있음 | 기존 그림 유지, 새 렌더 안 함 |
| q19 | RETAIN: 두 무게중심·GG′4 | **REPLAN**: 불필요한 채움·떠 있는 비율 텍스트 정리 | `pointNames:G′`·`dimensions`5·중점 눈금; STATIC_PASS |
| q20 | EXEMPT: 직각삼각형 판별 선택지 | EXEMPT: 피타고라스 계산 | — |
| q21 | RETAIN: 원본 **색칠된** 두 초승달 영역 | RETAIN: 색칠 영역 넓이의 대응 설명 | 의도된 면 채움 유지, 새 렌더 안 함 |
| q22 | RETAIN: 직사각형 쌓기 2개와 15/16 | EXEMPT: 두 방정식·넓이 산술 풀이, 기존 문제 그림으로 충분 | 문제 그림 그대로 유지 |
| q23 | EXEMPT: 속력 연립방정식 문장제 | EXEMPT: 거리·시간 식 정리 | — |
| q24 | RETAIN: DE∥BC, DF∥BE, AF8/FE6 | RETAIN: 닮음비를 실제 선분에 연결한 기존 해설 | 기존 그림 유지 |
| q25 | RETAIN: 중점·중선·무게중심 도형 | **REPLAN**: 넓이 3:1:4의 정확한 세 영역만 구분 | `equalLengths`3그룹·`dimensions`3·`regions`3; STATIC_PASS |

## 실제 제작 plan / 정적 DRAWN_FEATURE_PARITY

| JSON | 원문·해설에서 반드시 보여야 할 것 | shallow / full / render |
| --- | --- | --- |
| `q12-solution.plan.json` | 두 대응각·AD2 DC6 EC4 BC12 BE8 | OK / ENV_BLOCKED / NOT_RUN |
| `q13-solution.plan.json` | ∠A=90°, AH⊥BC, AB3 AC4 BC5 AH12/5 | OK / ENV_BLOCKED / NOT_RUN |
| `q14-solution.plan.json` | DE∥BC, AB12 AE6 EC3 AD8 | OK / ENV_BLOCKED / NOT_RUN |
| `q15-solution.plan.json` | D·E·F 중점 눈금 세 쌍, AB8 BC12 CA10, DE5 EF4 FD6 | OK / ENV_BLOCKED / NOT_RUN |
| `q16-solution.plan.json` | BM=CM AN=MN, CD∥ME, EM4 CN6 | OK / ENV_BLOCKED / NOT_RUN |
| `q17-solution.plan.json` | AB∥EF∥DC, 교점 E, AB21 DC28 EF12 | OK / ENV_BLOCKED / NOT_RUN |
| `q19-solution.plan.json` | G·G′를 통한 AD 분할, GG′4 G′D2 GD6 AG12 AD18 | OK / ENV_BLOCKED / NOT_RUN |
| `q25-solution.plan.json` | AH:HG:GD=3:1:2, AFE:FGE:GBC=3:1:4 대상 영역 | OK / ENV_BLOCKED / NOT_RUN |

원본 문제 이미지가 있는 문항을 새로 그리지 않은 것은 전수 판정의 결과이지 미검토가 아니다. 기존 P축은 원본 형상·길이·각·점의 주요 조건을 유지하며 이번 재설계는 S축의 부족한 설명·불필요한 면 채움에 집중했다.
