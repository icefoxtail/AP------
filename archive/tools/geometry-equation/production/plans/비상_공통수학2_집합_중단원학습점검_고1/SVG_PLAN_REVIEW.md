# SVG 플랜 원문 2축 전수 재점검 — 비상_공통수학2_집합_중단원학습점검_고1

- 소스 시험지: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_집합_중단원학습점검_고1.js` (11문항, 22축)
- 대상 변경: **본 폴더의 JSON 플랜과 검수 장부만**. 시험지 JS·기존 이미지 SVG/PNG·엔진 코드 미수정.
- 기준: 원본 발문·해설·기존 이미지 에셋을 기점으로 **선·점선·좌표/라벨·교차 관계·면 채움**을 1:1 수작업 대조. 흰색 배경/원판 fill은 플랜에서 의도하지 않음. 집합 증명의 교차영역 색칠만 필수이므로 보존.
- 검사: `plan-lint.cjs --shallow --jobs 4 <각 *.plan.json>` **7/7 OK**; `plan-lint.cjs --jobs 4 <각 *.plan.json>` **7/7 OK**. 2026-11-27, 지정 경로 명시적 열거(린터 폴더 자동탐색은 `*.plan.json` 이름을 제외하므로 파일 인자로 입력).
- **중요:** 본 담당은 plan-only 레인. SVG 렌더·PNG 육안검수·학생화면·A4·JS 자산 결속은 **NOT_RUN**. 따라서 아래의 “소스→필드 1:1”은 원문과 플랜의 정적 대응만 뜻하며, **실제 SVG DRAWN_FEATURE_PARITY 완료를 의미하지 않음**. 미지원 기능은 별도 **ENGINE_CAPABILITY_PENDING**으로 보류.
- 결과: 6축 정적 1:1, 1축 엔진 기능 대기, 15축 그림 불필요. 플랜 7개.

## 기존 자산 대조

- `q07_set-venn.svg`(해설): **실제 SVG와 렌더된 이미지 대조**. 전체 `<rect fill="#ffffff">`, 흰 원판 `<circle fill="#fff">`가 남아 있음. 신규 플랜은 양쪽 영역 `shade`만 선언.
- `q11_overlap-bounds.svg`(해설): 흰 `<rect fill="#fff">`, 두 원의 불필요한 연한 면 채움, 기존 `14−x,x,19−x,x−3` 영역 라벨 확인. 신규 플랜은 개수 헤더만 재현 가능; 영역 수식은 엔진 기능 대기.

## 문항별 2축 판정

| 파일/qid | 축 | 판정 | capability | plan경로 (본 폴더 기준) | plan-lint | DRAWN_FEATURE_PARITY / 면제 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| q01 / `qid_v1_fd8542788572bf0135031cdb6e9901fa0b1844503bf11dd2c04cb17d394fdd26` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 유리식 계산·인수분해만 수행 |
| q01 / `qid_v1_fd8542788572bf0135031cdb6e9901fa0b1844503bf11dd2c04cb17d394fdd26` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 집합의 객관적 판별 여부만 보기로 고르는 언어 논리 |
| q02 / `qid_v1_dc0cfc702eef3575a326370834e6609ccc31f291ada3ddb6d46a45af6249c6a5` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문이 직접 두 그래프를 그리라는 과제여서 문제축에 선행 그래프 제공 시 정답 노출 |
| q02 / `qid_v1_dc0cfc702eef3575a326370834e6609ccc31f291ada3ddb6d46a45af6249c6a5` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 보기 ㄱ~ㄹ의 원소 포함 판정·기호 연산; 그림 없이 문장·원소로 완결 |
| q03 / `qid_v1_060abd8580a6243ff106820d8789ac0e745a35ec1bdf00ec7982d53b6bac858d` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 근호식의 곱셈·통분 계산 |
| q03 / `qid_v1_060abd8580a6243ff106820d8789ac0e745a35ec1bdf00ec7982d53b6bac858d` | 해설 | PLAN_READY_STATIC | `set-diagram-figure-v1` | `q03-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q04 / `qid_v1_4e05a4d976b1a8ed3d7b0b5e13b3ab0d36d61b66d7cb15da9d8d4d9899d51b3a` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문이 직접 무리함수 그래프를 그리라는 과제 |
| q04 / `qid_v1_4e05a4d976b1a8ed3d7b0b5e13b3ab0d36d61b66d7cb15da9d8d4d9899d51b3a` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 두 유한집합의 동일성으로 a,b를 식으로 계산 |
| q05 / `qid_v1_2d74a3ac5a7c5c99fdb005420d9f1a9f2c1c1779eed49cb56cd8fce847974689` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 두 점근선 비교로 이동량을 계산하는 대수 문제(원본 그림 없음) |
| q05 / `qid_v1_2d74a3ac5a7c5c99fdb005420d9f1a9f2c1c1779eed49cb56cd8fce847974689` | 해설 | PLAN_READY_STATIC | `set-diagram-figure-v1` | `q05-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q06 / `qid_v1_6c120be5b4a5ceb8bed486fb3f4bd5b50c1186b2d97e4bed8b9e6b448c8fb887` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 원점 통과 조건과 점근선 계수 비교의 대수 문제(원본 그림 없음) |
| q06 / `qid_v1_6c120be5b4a5ceb8bed486fb3f4bd5b50c1186b2d97e4bed8b9e6b448c8fb887` | 해설 | PLAN_READY_STATIC | `set-diagram-figure-v1` | `q06-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q07 / `qid_v1_1a92c0bc2b3d3cc702ea4a08e4903df006b06833cb8c6c364ec40cb1ed3c50ae` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 양의 홀수 약수 세 개를 열거하는 정수 계산 |
| q07 / `qid_v1_1a92c0bc2b3d3cc702ea4a08e4903df006b06833cb8c6c364ec40cb1ed3c50ae` | 해설 | PLAN_READY_STATIC | `composite-panels-v1` | `q07-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q08 / `qid_v1_8817bd451ba4b71825f758f2adde5b80aa25c14a1547650968bd7cb8b8d49033` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 문제축 제공 곡선을 풀이에서 대입하여 계수를 산출; 별도 새 그림은 동일 정보 반복 |
| q08 / `qid_v1_8817bd451ba4b71825f758f2adde5b80aa25c14a1547650968bd7cb8b8d49033` | 해설 | EXEMPT | 그림 불필요 | — | N/A | 포함배제 공식 n(A∩B)=83+70−113의 산술로 완결 |
| q09 / `qid_v1_23aea70aaede0e9a7b8cec6567888a296fe4d4675f5273206ddfde79db2ddcd5` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 정의역 닫힌 구간에서 단조성을 쓰는 대수 계산 |
| q09 / `qid_v1_23aea70aaede0e9a7b8cec6567888a296fe4d4675f5273206ddfde79db2ddcd5` | 해설 | PLAN_READY_STATIC | `set-diagram-figure-v1` | `q09-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q10 / `qid_v1_04efeb701a7c913220926a49ba60ac7e49968fb0619b6dfb42a269ab9458731e` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 역함수 대응 f(1)=3을 식으로 치환하여 연립 |
| q10 / `qid_v1_04efeb701a7c913220926a49ba60ac7e49968fb0619b6dfb42a269ab9458731e` | 해설 | PLAN_READY_STATIC | `set-diagram-figure-v1` | `q10-solution.plan.json` | shallow **OK**, full **OK** | 소스→필드 1:1 / SVG NOT_RUN |
| q11 / `qid_v1_4e7e9dff0e37f3b56d3041d4583aad5c8e2b737ddcd407afdcf8f6c3e4e05d58` | 문항 | EXEMPT | 그림 불필요 | — | N/A | 발문은 점 P와 수선의 발을 정의하지만 도형이 주어지지 않은 최솟값 계산 |
| q11 / `qid_v1_4e7e9dff0e37f3b56d3041d4583aad5c8e2b737ddcd407afdcf8f6c3e4e05d58` | 해설 | ENGINE_CAPABILITY_PENDING | `SET_ATOMIC_REGION_SYMBOLIC_COUNT_LABEL` | `q11-solution.plan.json` | shallow **OK**, full **OK** | 부분일치 / SVG NOT_RUN |

## 결정적 소스 조건 → 실제 플랜 필드 매핑

- q03 해설: U=1…9 모든 9원소: A∩B=1,2,3; A−B=6; B−A=5,7; 양쪽 밖=4,8,9 — **정적 1:1**
- q05 해설: A만 5,7,8,10; 교집합 6,9; B만 3; A∪B/A∩B 원소 전부 — **정적 1:1**
- q06 해설: −2,−1,0,1,2,3의 A,B,C 소속 6행×3열: (C∩Aᶜ)∪B={−2,−1,1,2,3} — **정적 1:1**
- q07 해설: 좌변 C−(A∩B), 우변 (C−A)∪(C−B) 2패널; 각 A∩B∩C만 제외한 C 부분 동일하게 색칠; 흰 원판/바탕 미사용 — **정적 1:1**
- q09 해설: A∩B=A ⇒ A⊆B; 여집합 역포함과 합집합 B의 원 포함 — **정적 1:1**
- q10 해설: A={1,5}⊆B={1,2,4,5,10,20}: 1,5 고정, 2,4,10,20 네 선택지의 원소 소속 — **정적 1:1**
- q11 해설: U=30명·A=14명·B=19명 집합 이름/개수는 계획됨. A만 14−x, 교집합 x, B만 19−x, 바깥 x−3의 기호식 영역 인원은 엔진 미지원 — **ENGINE_CAPABILITY_PENDING: `SET_ATOMIC_REGION_SYMBOLIC_COUNT_LABEL`**

## 검수 범위와 승인 경계

1. 각 plan에는 `sourceConditions`의 수식·교점·영역 조건과 `mappedTo` 실제 필드, `newVisualInformation`, `caption`, `accessibilityDescription`가 있다. 수치·포함관계를 새로 추측해 넣지 않았고, 문제 그림에서는 답을 주는 계수값을 수식 라벨에 공개하지 않는다.
2. 기존 파일의 흰 사각형·흰 원판은 계획하지 않았고 불필요한 면 채움도 제거했다. **필요한 영역 색칠**은 집합 q07 증명에만 `diagram.shade`로 남겼다. 그 외의 얼굴/면은 기본 `NONE`.
3. 플랜 린트 통과만으로 실제 선/수식 조판·가림·지시선 접속·폰트/표시 크기를 합격으로 판정하지 않는다. 새 SVG 렌더 후 PNG와 원본을 비교해야 **DRAWN_FEATURE_PARITY 1:1**로 최종 승격할 수 있다. `ENGINE_CAPABILITY_PENDING` 항목은 기능 구현 없이는 승격 금지.
4. 필요 기능: set VENN 원자 영역별 **기호식 인원 라벨**(`x`, `14−x`, `19−x`, `x−3`), 해당 영역을 선으로 가리키는 지시선과 충돌 회피.
