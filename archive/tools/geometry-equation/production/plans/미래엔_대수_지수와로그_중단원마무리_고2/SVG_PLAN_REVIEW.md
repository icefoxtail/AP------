# 지수와 로그 중단원 마무리 — 문제/해설 2축 원문·plan 검수

- JS: `archive/exams/textbooks/미래엔_대수/미래엔_대수_지수와로그_중단원마무리_고2/미래엔_대수_지수와로그_중단원마무리_고2.js`
- 원문 SHA-256: `09dadf29a290b7294974ce184028217447939c980238e3fea36db1fef37586ba`
- 이번 검토: q01–q18, 18문항 / 36축. 본 단원의 18문항 전부 포함.
- 판정 규칙: 문제·해설 축을 각각 독립 검토했다. EXEMPT는 실제 도형·표가 필요 없는 식 계산과 논리의 구체적 사유이며 plan 파일이 아니다. 렌더/학생 화면/A4 확인은 `NOT_RUN`.

| qid | 축 | 판정 및 개별 사유 | capability / plan | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- |
| q01 | 문제 | EXEMPT: −27의 세제곱근과 1의 네제곱근 중 실근을 구하는 방정식 | — | N/A | EXEMPT |
| q01 | 해설 | EXEMPT: x³=−27, x⁴=1 인수분해로 실근 −3,±1 직접 판정 | — | N/A | EXEMPT |
| q02 | 문제 | EXEMPT: 거듭제곱근 사칙연산 네 식 | — | N/A | EXEMPT |
| q02 | 해설 | EXEMPT: 동일 지수의 근호 곱·몫 및 6제곱근의 지수 계산 | — | N/A | EXEMPT |
| q03 | 문제 | EXEMPT: 유리·무리 지수 연산 네 식 | — | N/A | EXEMPT |
| q03 | 해설 | EXEMPT: 지수법칙의 합·차·곱 계산으로 종결 | — | N/A | EXEMPT |
| q04 | 문제 | EXEMPT: 로그 사칙연산 네 식 | — | N/A | EXEMPT |
| q04 | 해설 | EXEMPT: 로그의 곱·몫·거듭제곱 성질로 값 구함 | — | N/A | EXEMPT |
| q05 | 문제 | EXEMPT: 상용로그표를 사용한 236,0.236의 소수 계산 | — | N/A | EXEMPT |
| q05 | 해설 | EXEMPT: 로그 표 값 0.3729에 10의 지수를 더하거나 빼는 수치 조정 | — | N/A | EXEMPT |
| q06 | 문제 | EXEMPT: 세제곱근의 합·차를 간단히 하는 두 식 | — | N/A | EXEMPT |
| q06 | 해설 | EXEMPT: 189=27×7, 48=8×6 등의 근호 분해·소거만 사용 | — | N/A | EXEMPT |
| q07 | 문제 | EXEMPT: 2^k를 만족시키는 실수 지수 결정 | — | N/A | EXEMPT |
| q07 | 해설 | EXEMPT: 같은 밑 2의 지수 1/2+1/3−3/2를 합산 | — | N/A | EXEMPT |
| q08 | 문제 | EXEMPT: x^(1/2)+x^(−1/2)=3으로 x²+x^(−2) 계산 | — | N/A | EXEMPT |
| q08 | 해설 | EXEMPT: 합의 제곱을 두 차례 써서 x+x^(−1)=7, 구한 값47 | — | N/A | EXEMPT |
| q09 | 문제 | EXEMPT: (2^a−2^(−a))/(2^a+2^(−a))=1/2의 식 | — | N/A | EXEMPT |
| q09 | 해설 | EXEMPT: 2^(2a)=3으로 변환하여 4^a+4^(−a)=10/3 직접 계산 | — | N/A | EXEMPT |
| q10 | 문제 | EXEMPT: 밑 조건과 진수 조건을 동시에 만족하는 정수 x를 묻는 문제로 발문에 그림 없음 | — | N/A | EXEMPT |
| q10 | 해설 | BENEFICIAL: 밑 x>1,x≠2와 진수 1<x<5의 교집합 및 정수점 3·4를 같은 수직선에 세 줄로 표시 | number-line-figure-v1 / `q10-solution.plan.json` | OK/OK | PASS |
| q11 | 문제 | EXEMPT: 두 양수 a,b에 대한 로그식 연립조건 | — | N/A | EXEMPT |
| q11 | 해설 | EXEMPT: ab=2,a+b=13을 계산해 a²+b²=165에 도달, 기하 도형 관계 없음 | — | N/A | EXEMPT |
| q12 | 문제 | EXEMPT: 로그식 두 묶음을 전개·곱셈하는 계산 | — | N/A | EXEMPT |
| q12 | 해설 | EXEMPT: 로그의 거듭제곱·밑 변환으로 0과 60을 얻는 단순 기호 합산 | — | N/A | EXEMPT |
| q13 | 문제 | EXEMPT: log_5 2=a, log_5 3=b일 때 두 로그를 문자로 표현 | — | N/A | EXEMPT |
| q13 | 해설 | EXEMPT: 36=2²3²,90=2·3²·5의 인수분해와 밑 변환 대수식 | — | N/A | EXEMPT |
| q14 | 문제 | EXEMPT: 두 음료의 수소이온 농도에서 pH 비율 계산 | — | N/A | EXEMPT |
| q14 | 해설 | EXEMPT: pH=−log[H⁺]을 대입해 3.5/5=0.7 단순 비율 산술 | — | N/A | EXEMPT |
| q15 | 문제 | EXEMPT: 세제곱근·네제곱근 실근 개수와 정수쌍 개수 | — | N/A | EXEMPT |
| q15 | 해설 | EXEMPT: f(a)=1, g(b)=2⇔b>0, a 11개×b 5개 =55 계산; 정수 격자 그림 불필요 | — | N/A | EXEMPT |
| q16 | 문제 | EXEMPT: ab=bc+ca 및 5^a=7^b=k^c의 지수 관계 | — | N/A | EXEMPT |
| q16 | 해설 | EXEMPT: 양변 로그와 1/c=1/a+1/b 대입으로 log k=log35 단순 변형 | — | N/A | EXEMPT |
| q17 | 문제 | REQUIRED_EXISTING: 원문 q17.png가 빈 T자 5칸 도형을 선명하게 제공하므로 문제 그림 교체 불필요·기존 이미지 유지 | 기존 q17.png (신규 plan 없음) | N/A | ASSET_PARITY_PASS |
| q17 | 해설 | BENEFICIAL: 공유 칸을 2t로 잡고 가로 t,2t,7t·세로 2t,3t,5t를 실제 각 칸에 표시하여 두 합이 15임을 대조 | construction-spike-v1 / `q17-solution.plan.json` | OK/OK | PASS |
| q18 | 문제 | EXEMPT: a,b>1이고 log_{sqrt2}a=log_4(ab)인 로그 방정식 | — | N/A | EXEMPT |
| q18 | 해설 | EXEMPT: 밑 변환 후 log_2 b=3log_2 a로 나누어 log_a b=3을 얻는 기호 풀이 | — | N/A | EXEMPT |

## 실제로 그려지는 필드 1:1 교차 대조

1. **q10 해설**: 밑 조건은 `x>1`·`x≠2`로 `(1,2)∪(2,∞)`; 진수 `-x²+6x−5>0`는 `(1,5)`. 셋째 RESULT 줄의 엔진 교집합은 `(1,2)∪(2,5)`이며, 각 끝점은 OPEN. `integerPoints:true`가 공통 범위 내부의 정수 3·4만 표시한다. 단순 캡션이 아닌 `numberLine.rows[].pieces` 및 RESULT의 실제 그려지는 필드에 모두 존재.
2. **q17 해설**: 원문 q17.png(346×345)의 동일 정사각형 5칸 T자형 구조(가로 3칸·가운데 아래 2칸)를 `SOURCE_POINT` 정수좌표 12개와 `displaySegments`의 실제 선분 16개로 구현. 모든 점 이름·점 표식 숨김; 내부 면색 없음. `planeMarks.textLabels`가 실제 칸 중앙에 `t,2t,7t,3t,5t`를 그린다. 가로 합 `1+2+7=10`, 세로 합 `2+3+5=10`(각각 `15`)으로 `t=3/2`, 원문 결론 `a=2^(2/3)`와 일치. 새 해설 plan에는 정확한 풀이 배치만 추가.
3. **q17 문제 (기존 자산)**: 기존 이미지 `archive/exams/textbooks/미래엔_대수/미래엔_대수_지수와로그_중단원마무리_고2/q17.png` SHA-256 `37b3ad400a873a9f6a7b5cebfa04ee79f37a329770e7a8c501e0eef6b84bfde6`. 실제 이미지 확인: 모두 빈 칸이고 답 또는 수치 비노출, 중앙 공유칸 및 정사각형 5개 관계 동일. 기존 운영 이미지를 유지한다.

## engine/lint 별도 관찰

- 빈 5칸 문제용 PLANE_FIGURE 초안은 `shallow OK`지만 `full`에서 `PUBLICATION_TEXT_NOT_READY`로 거절됐다. 정본 AUTHOR_GUIDE E32는 글자 없는 `PLANE_FIGURE_v1`을 지원한다고 명시하며, `plan-lint.cjs`의 `deepSpec`는 그 예외 없이 학생용 라벨 하나를 요구한다. **정본·검사기 사이 규약 불일치**다. 의미 없는 가짜 라벨을 추가하지 않았고, 불합격 초안을 최종 PR에 싣지 않았다. 필수 원본 도형은 정상 PNG로 이미 충족하므로 학생용 기능 미지원으로 보지 않는다. 향후 원본 그림 재제작이 필요하면 `plan-lint deepSpec`의 E32 예외를 엔진 담당이 조정해야 한다.

- 신규 제작용 plan 2건: shallow 2/2 OK, full 2/2 OK, DRAWN_FEATURE_PARITY 2/2 PASS. `ENGINE_CAPABILITY_PENDING` 0건(기존 자산 충족 기준).

- 최종 이미지 렌더·PNG·학생 화면·A4/게시 연결: `NOT_RUN`; 이는 plan 필드의 PARITY 판정과 별도.
