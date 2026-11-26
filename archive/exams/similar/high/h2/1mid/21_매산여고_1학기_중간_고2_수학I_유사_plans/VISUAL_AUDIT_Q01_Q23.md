# 2021 매산여고 고2 수학I 1학기 중간 유사 — SVG Plan 문제·해설 2축 감사

## 범위 및 판정 기준

- 소스: `archive/exams/similar/high/h2/1mid/21_매산여고_1학기_중간_고2_수학I_유사.js`.
- 실제 `questionBank` q01~q23 **전 문항 23개, 문제·해설 46축**. 기존 `_plans`/동일 qid 감사 기록 없음. JS `image`·`questionImage`·`solutionImage` 없음.
- 판정: REQUIRED 1축(q23 해설 — 그래프 직접 설명·그리기 요구), BENEFICIAL 3축(q08·q15·q20 해설), EXEMPT 42축. 신규 실행형 후보 plan 4개.
- 문제축에서 해설로 얻는 극점·교점·부등식 정답을 미리 보여 주지 않고, 기존 미완료 plan을 임의로 PASS 처리하지 않는다.

| qid | 축 | 판정 | 개별 근거 / plan | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|
| q01 | 문제 | EXEMPT | P(−4,3)과 동경이 좌표로 지정돼 삼각함수 정의만 적용. | N/A | EXEMPT |
| q01 | 해설 | EXEMPT | OP=5, 사인·코사인 부호 계산으로 충분. | N/A | EXEMPT |
| q02 | 문제 | EXEMPT | 거듭제곱근으로 된 양수의 크기 비교. | N/A | EXEMPT |
| q02 | 해설 | EXEMPT | 공통 6제곱으로 각 항 비교. | N/A | EXEMPT |
| q03 | 문제 | EXEMPT | 로그와 음수 유리수 지수의 곱 계산. | N/A | EXEMPT |
| q03 | 해설 | EXEMPT | a=4, b=27 식 계산. | N/A | EXEMPT |
| q04 | 문제 | EXEMPT | 3^(x+k)의 값으로 k 결정. | N/A | EXEMPT |
| q04 | 해설 | EXEMPT | f(4)=9로 k=−2 구하고 f(0) 계산. | N/A | EXEMPT |
| q05 | 문제 | EXEMPT | y=log₃(3x), y=x, 점 (2,2)의 수평선 관계가 식으로 모두 명시됨. | N/A | EXEMPT |
| q05 | 해설 | EXEMPT | 수평선 y=2와 로그곡선 교점 x를 직접 대입해 구한다; 추가 그래프는 중복. | N/A | EXEMPT |
| q06 | 문제 | EXEMPT | 삼각함수 항등식 전개·정리. | N/A | EXEMPT |
| q06 | 해설 | EXEMPT | sin²+cos², tan의 정의를 써 대수적으로 상쇄. | N/A | EXEMPT |
| q07 | 문제 | EXEMPT | 제3사분면 범위와 절댓값 근호식. | N/A | EXEMPT |
| q07 | 해설 | EXEMPT | sin<0, cos<0 부호 조건으로 절댓값 해제. | N/A | EXEMPT |
| q08 | 문제 | EXEMPT | cos(2x)=−1/4와 정의역이 식으로 명시돼 그림 없이 읽을 수 있음. | N/A | EXEMPT |
| q08 | 해설 | BENEFICIAL | `q08-solution.plan.json`: cos2x·기준선 y=−1/4 교점 두 개와 x=π/2 대칭. | ENV_BLOCKED | NOT_VERIFIED |
| q09 | 문제 | EXEMPT | 두 지수곡선·밑변 BC·높이 AH의 관계가 모두 지정; 임의 B,C 위치를 정한 그림을 만들지 않음. | N/A | EXEMPT |
| q09 | 해설 | EXEMPT | BC=5, AH=10에서 교점 y=10을 얻고 두 지수식에 대입. | N/A | EXEMPT |
| q10 | 문제 | EXEMPT | 로그함수 동치성의 정의역 차이에 관한 ㄱ~ㄹ 판단. | N/A | EXEMPT |
| q10 | 해설 | EXEMPT | 로그 법칙 및 정의역 비교로 각 그래프 동치 여부 판단. | N/A | EXEMPT |
| q11 | 문제 | EXEMPT | 이차방정식 근이 sinθ, cosθ라는 대수 조건. | N/A | EXEMPT |
| q11 | 해설 | EXEMPT | 근과 계수 관계 및 sin²+cos²=1 식 전개. | N/A | EXEMPT |
| q12 | 문제 | EXEMPT | 제3사분면 sin값과 표준각 삼각함수식. | N/A | EXEMPT |
| q12 | 해설 | EXEMPT | cosθ=−4/5, 각 변환 공식 적용. | N/A | EXEMPT |
| q13 | 문제 | EXEMPT | 지수 두 개의 일치와 a+b=3ab 관계. | N/A | EXEMPT |
| q13 | 해설 | EXEMPT | 공통값 t와 1/a+1/b=3 치환. | N/A | EXEMPT |
| q14 | 문제 | EXEMPT | x^(log₂x)=x⁴/8 방정식의 근 계산. | N/A | EXEMPT |
| q14 | 해설 | EXEMPT | t=log₂x 치환 후 이차방정식 인수분해. | N/A | EXEMPT |
| q15 | 문제 | EXEMPT | 삼각함수의 주기·최댓값·특정점 함수값이 모두 문자로 주어져 문제 그림은 계수 단서를 노출. | N/A | EXEMPT |
| q15 | 해설 | BENEFICIAL | `q15-solution.plan.json`: 해설 확정 a=5/2, b=4, c=1의 사인 그래프, 극값·주기·평행이동. | ENV_BLOCKED | NOT_VERIFIED |
| q16 | 문제 | EXEMPT | 두 직선에 대한 동경 대칭의 각조건이 식으로 해석됨. | N/A | EXEMPT |
| q16 | 해설 | EXEMPT | θ+7θ 및 θ+3θ의 각 동치식으로 선택지 확인. | N/A | EXEMPT |
| q17 | 문제 | EXEMPT | 거듭제곱근의 자연수성과 상한 100 조건. | N/A | EXEMPT |
| q17 | 해설 | EXEMPT | 36의 약수 중 지수의 범위 계산. | N/A | EXEMPT |
| q18 | 문제 | EXEMPT | 밑 1/4의 지수 연쇄부등식. | N/A | EXEMPT |
| q18 | 해설 | EXEMPT | 밑이 1보다 작아 지수 부등호가 반대로 됨. | N/A | EXEMPT |
| q19 | 문제 | EXEMPT | 미세먼지 연 6% 증가 모델과 로그 수치 제공. | N/A | EXEMPT |
| q19 | 해설 | EXEMPT | (1.06)^n≥4를 상용로그로 정리. | N/A | EXEMPT |
| q20 | 문제 | EXEMPT | 삼각함수 부등식과 x∈[0,2π) 조건으로 충분; 임계각을 그리면 답 선공개. | N/A | EXEMPT |
| q20 | 해설 | BENEFICIAL | `q20-solution.plan.json`: sinx≤1/2, 기준선과 교점 π/6·5π/6, 끝점 개폐를 나타낸다. | ENV_BLOCKED | NOT_VERIFIED |
| q21 | 문제 | EXEMPT | 로그의 밑·진수 정의역과 이차부등식 관계. | N/A | EXEMPT |
| q21 | 해설 | EXEMPT | x∈(2,3)을 인수분해해 a,b를 구한 뒤 지수 조건 계산. | N/A | EXEMPT |
| q22 | 문제 | EXEMPT | 정의역 [−2,2]의 지수·로그 함수 극값 두 계산. | N/A | EXEMPT |
| q22 | 해설 | EXEMPT | 증가성·진수 곱의 최소값으로 각각 극값 확정. | N/A | EXEMPT |
| q23 | 문제 | EXEMPT | (1)이 그래프 자체와 극값을 묻고 (3)이 임계구간을 묻는다. 문제 그림을 미리 붙이면 정답 노출. | N/A | EXEMPT |
| q23 | 해설 | REQUIRED | `q23-solution.plan.json`: \|3cos(2πx)\|의 두 주기, 영점·극점·축과의 교점 및 y=3/2 엄격 부등식 경계 4개. | ENV_BLOCKED | NOT_VERIFIED |

## 실제 plan 필드와 source/solution 대조

| plan | 입력 필드 대조 | 독립 계산 | 공식 실제 그리기 상태 |
|---|---|---|---|
| q08 해설 | COS, 계수 [1,2,0], x∈[0,π), y=−1/4, 교점 2, π/2 눈금, 무채움 | cos(2x)+1/4의 서로 다른 근 2개; 대칭축 π/2 | 모델/spec/SVG NOT_VERIFIED |
| q15 해설 | SIN, a=5/2, b=4, C=1, phasePi=1/6, x∈[0,π/2], y값 −3/2, 1, 7/2 | f(π/12)=7/2, f(π/3)=−3/2, 주기 π/2 | 모델/spec/SVG NOT_VERIFIED |
| q20 해설 | SIN, x∈[0,2π), y=1/2 기준선, 교점 2, 등호 포함, π/6·5π/6 눈금, 무채움 | sin x=1/2은 구간 내 두 근; 나머지 구간에서 sin x≤1/2 | 모델/spec/SVG NOT_VERIFIED |
| q23 해설 | COS, ratePi=2, 진폭 3, absolute true, x∈[0,1], 주기 1/2, 수평선 y=3/2, 엄격 교점 4개 열린 원, 영점 x=1/4·3/4 | x=0·1/2·1에서 f=3; x=1/4·3/4에서 f=0; f=3/2 교점 네 개 | 모델/spec/SVG NOT_VERIFIED |

## 검사·판정의 한계

- JSON.parse 및 `sourceQuote`가 해당 발문에 실제 존재하는지 검사 4/4 PASS.
- 독립 Node 수학 검산: q08 교점 2, q15 최대·최소 일치, q20 교점 2, q23 엄격 교점 4 및 영점·극값 일치.
- 공식 `plan-lint.cjs --shallow` 4건 각각 실제 실행 → 전부 `ModuleNotFoundError: No module named 'visual_engine'`, 종료 1. **ENV_BLOCKED 4/4, PASS 0**.
- 공식 `plan-lint.cjs` full 4건 각각 실제 실행 → 동일 오류. **ENV_BLOCKED 4/4, PASS 0**.
- 이 실행기의 공식 Python `visual_engine` 의존성 누락 때문에 frame_graph·model·spec·SVG 검증은 불가능했다. **DRAWN_FEATURE_PARITY NOT_VERIFIED 4축**, PASS로 바꾸지 않는다.
- Chrome·PNG 육안·학생 화면·A4 렌더 NOT_RUN. 공식 의존성 있는 실행기에서 shallow/full lint와 실제 렌더 필드 검수를 완료해야 한다.
- 이번 회차 신규 ENGINE_CAPABILITY_PENDING 0축, EVIDENCE_DEBT 0축. 환경 장애와 엔진 기능 미지원을 혼동하지 않는다.
- 원본 JS, 수기 SVG, types/textbooks/original, 공용 엔진은 수정하지 않았다.
