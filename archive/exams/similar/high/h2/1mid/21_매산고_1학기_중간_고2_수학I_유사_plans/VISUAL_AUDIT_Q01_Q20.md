# 2021 매산고 고2 수학I 1학기 중간 유사 — SVG Plan 문제·해설 2축 감사

## 범위 및 판정 기준

- 소스: `archive/exams/similar/high/h2/1mid/21_매산고_1학기_중간_고2_수학I_유사.js`.
- 실제 `questionBank` q01~q20 **전 문항 20개, 문제·해설 40축**. 기존 `_plans`/동일 qid 감사 기록 없음. JS `image`·`questionImage`·`solutionImage` 없음.
- 판정: REQUIRED 0, BENEFICIAL 1축(q19 해설), EXEMPT 39축. 실행형 후보 JSON 신규 1개 `q19-solution.plan.json`.
- 원본 그림이 없으므로 수식·해설의 위치·극점·비율만을 근거로 판정하고, 문제 그림이 정답이나 미지수를 선공개하는 도식을 만들지 않음.

| qid | 축 | 판정 | 개별 근거 / plan | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| q01 | 문제 | EXEMPT | 3의 거듭제곱 방정식 한 개. | N/A | EXEMPT |
| q01 | 해설 | EXEMPT | 같은 밑으로 환원해 지수 x를 계산. | N/A | EXEMPT |
| q02 | 문제 | EXEMPT | 상용 로그와 정수 밑 로그값의 단순 연산. | N/A | EXEMPT |
| q02 | 해설 | EXEMPT | 16=2⁴, 27=3³ 대입. | N/A | EXEMPT |
| q03 | 문제 | EXEMPT | 호도법·각도 변환 선지 판단. | N/A | EXEMPT |
| q03 | 해설 | EXEMPT | π라디안=180° 환산으로 선지 비교. | N/A | EXEMPT |
| q04 | 문제 | EXEMPT | 반지름 6과 중심각 π/6의 부채꼴 공식 계산. | N/A | EXEMPT |
| q04 | 해설 | EXEMPT | 호길이 rθ, 넓이 r²θ/2 대입; 부채꼴 도식은 장식. | N/A | EXEMPT |
| q05 | 문제 | EXEMPT | 복소수 거듭제곱근 참거짓 선지. | N/A | EXEMPT |
| q05 | 해설 | EXEMPT | 실근·허근 개수 및 짝수 제곱근 비교. | N/A | EXEMPT |
| q06 | 문제 | EXEMPT | 삼각함수 항등식 결합. | N/A | EXEMPT |
| q06 | 해설 | EXEMPT | sin²+cos²=1 및 tan 정의를 대수 정리. | N/A | EXEMPT |
| q07 | 문제 | EXEMPT | P(−3,4)가 동경의 사분면·비율을 수치로 지정. | N/A | EXEMPT |
| q07 | 해설 | EXEMPT | OP=5와 사인·코사인·탄젠트 부호로 절댓값 계산. | N/A | EXEMPT |
| q08 | 문제 | EXEMPT | 양수 a,b의 근호·로그 비교 선택지. | N/A | EXEMPT |
| q08 | 해설 | EXEMPT | 유리수 지수 및 로그 밑 조건의 부등식. | N/A | EXEMPT |
| q09 | 문제 | EXEMPT | 정의역과 로그함수 치환 후 최대·최솟값. | N/A | EXEMPT |
| q09 | 해설 | EXEMPT | t=log₃x∈[−3,3], 완전제곱으로 범위 판단. | N/A | EXEMPT |
| q10 | 문제 | EXEMPT | 두 로그부등식의 공통 정수해 수를 계산. | N/A | EXEMPT |
| q10 | 해설 | EXEMPT | 진수 조건·밑의 증감에 따라 x 범위 교집합. | N/A | EXEMPT |
| q11 | 문제 | EXEMPT | 2의 지수 합·역수 합의 대수 관계. | N/A | EXEMPT |
| q11 | 해설 | EXEMPT | x=2ᵃ 등 치환과 대칭식 전개. | N/A | EXEMPT |
| q12 | 문제 | EXEMPT | 생장률·시간과 상용로그표가 표로 완전히 제공됨. | N/A | EXEMPT |
| q12 | 해설 | EXEMPT | 3^(3/4)와 로그표를 이용한 비율 계산; 그래프 중복. | N/A | EXEMPT |
| q13 | 문제 | EXEMPT | 로그 항등식의 정의역 차이를 묻는 선지. | N/A | EXEMPT |
| q13 | 해설 | EXEMPT | 각 로그식의 진수 조건과 해집합 비교. | N/A | EXEMPT |
| q14 | 문제 | EXEMPT | 4·5제곱근이 자연수인 소인수 지수 조건. | N/A | EXEMPT |
| q14 | 해설 | EXEMPT | 소인수 지수의 합동식·최소공배수 계산. | N/A | EXEMPT |
| q15 | 문제 | EXEMPT | 지수 두 함수의 교점·OB 길이·삼각형 넓이가 수식으로 제공됨. | N/A | EXEMPT |
| q15 | 해설 | EXEMPT | 밑변 4와 높이 15를 식에서 구해 교점에 대입; 그림은 보조적 중복. | N/A | EXEMPT |
| q16 | 문제 | EXEMPT | 거듭제곱근의 지수 지수법칙. | N/A | EXEMPT |
| q16 | 해설 | EXEMPT | 8=2³으로 환원해 지수 2/5 계산. | N/A | EXEMPT |
| q17 | 문제 | EXEMPT | 로그에 근호가 들어간 값의 대수 계산. | N/A | EXEMPT |
| q17 | 해설 | EXEMPT | 공액과 유리화로 4ˣ+4⁻ˣ 계산. | N/A | EXEMPT |
| q18 | 문제 | EXEMPT | 로그함수의 이동·역함수 값과 지수식 방정식. | N/A | EXEMPT |
| q18 | 해설 | EXEMPT | g⁻¹(5)=8을 먼저 구해 t=log₂x 치환. | N/A | EXEMPT |
| q19 | 문제 | EXEMPT | f의 이차 기본 조각·주기 2와 로그함수 식이 명시됨; n의 답을 드러내는 그림은 피함. | N/A | EXEMPT |
| q19 | 해설 | BENEFICIAL | `q19-solution.plan.json`: q=4일 때 y=(x−2k)² 조각 4개와 log₈(x−1), 구간 [1,9]의 교점 수를 보여 주는 풀이 예시. | ENV_BLOCKED | NOT_VERIFIED |
| q20 | 문제 | EXEMPT | A의 절댓값 구간·B의 로그상·최댓값 조건을 문자로 정확히 지정. | N/A | EXEMPT |
| q20 | 해설 | EXEMPT | a<2, a=2, a>2 구간 나누기와 로그 단조성만으로 충분. | N/A | EXEMPT |

## 실제 plan 필드와 source/solution 대조

| plan | 입력 필드 대조 | 독립 수학 확인 | 공식 실제 그리기 상태 |
|---|---|---|---|
| q19 해설 | `multi-curve-figure-v1`: 중심 x=2,4,6,8의 4개 이차 조각, 구간 [1,3],[3,5],[5,7],[7,9], 각 짝수 x에서 0·홀수 x에서 1, 로그 밑 8의 `log₈(x−1)` 곡선, y=1 눈금, 무채움 | 해설의 n=4인 경우를 명시적으로 대입. x=2와 x=9가 교점, 내부 단위 구간의 교차로 전체 8개. 원문의 x² 주기 연장을 정확히 보존. | 공식 model/spec/SVG **NOT_VERIFIED** |

## 검사·판정의 한계

- JSON.parse 및 `sourceQuote`의 실제 문제 발문 포함 여부 검사 PASS.
- 공식 `plan-lint.cjs --shallow` 1건 실제 실행 → `ModuleNotFoundError: No module named 'visual_engine'`, 명령 종료 1. **ENV_BLOCKED, PASS 0/1**.
- 공식 `plan-lint.cjs` full 1건 실제 실행 → 동일 오류. **ENV_BLOCKED, PASS 0/1**.
- 이 실행기의 공식 Python `visual_engine` 패키지가 없어 frame_graph 모델·spec 및 실제 렌더 대상 필드를 확보하지 못했다. **DRAWN_FEATURE_PARITY NOT_VERIFIED 1축**이며 계산 대조를 실제 엔진 PASS로 오인하지 않는다.
- Chrome·PNG 육안·학생 화면·A4 렌더 NOT_RUN. 공식 의존성을 제공하는 실행기에서 두 lint와 SVG 모델/필드 대조를 재실행해야 한다.
- 이번 회차 신규 ENGINE_CAPABILITY_PENDING 0축, EVIDENCE_DEBT 0축. 환경 장애를 엔진 기능 미지원으로 바꾸지 않는다.
- 원본 JS, 수기 SVG, types/textbooks/original, 공용 엔진은 수정하지 않았다.
