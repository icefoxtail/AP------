# 미래엔 대수 지수함수와 로그함수 대단원마무리 — 2축 시각 판정

- source JS: `archive/exams/textbooks/미래엔_대수/미래엔_대수_지수함수와로그함수_대단원마무리_고2/미래엔_대수_지수함수와로그함수_대단원마무리_고2.js`
- source Git blob: `532268935b9a7b40cb14434289a74004e685fe06`
- coverage: q01–q19 (19문항·38축 전수 판정)
- 판정은 현재 JS의 발문·보기·해설 및 q09.png·q12.png 원본 그림을 직접 대조한 결과이다.
- 모든 제작 plan: 공식 `plan-lint.cjs --shallow` 및 full **PASS**. SVG 렌더·PNG·학생화면·A4 확인 **NOT_RUN**.
- 경로가 적힌 JSON만 실제 제작 가능한 plan이다. EXEMPT는 제작용 JSON으로 만들지 않았다.

| qid | 문제축 판정 및 사유 | 해설축 판정 및 사유 |
| --- | --- | --- |
| q01 | EXEMPT — 근호·거듭제곱식의 참/거짓 판정, 공간·그래프 조건 없음 | EXEMPT — 5개 보기를 지수법칙으로 계산, 그려야 할 관계 없음 |
| q02 | EXEMPT — 2의 지수와 정수 약수 조건뿐 | EXEMPT — 음의 약수 네 개의 산술 판정, 그래프 불필요 |
| q03 | EXEMPT — t+t⁻¹ 대수식 계산 | EXEMPT — 대칭식 인수분해만 사용 |
| q04 | EXEMPT — 로그 밑·진수의 양수 조건 명시 | EXEMPT — 완전제곱식과 예외값 판단으로 완결 |
| q05 | EXEMPT — 밑 관계에서 로그 값 계산 | EXEMPT — k의 거듭제곱과 밑변환 계산으로 완결 |
| q06 | EXEMPT — 로그 덧셈 공식 문제 | EXEMPT — 24의 소인수분해와 밑변환만 필요 |
| q07 | EXEMPT — 근과 계수의 관계 및 로그 계산 | EXEMPT — 합·곱 대입, 시각적 교점 해석 없음 |
| q08 | EXEMPT — 미지 밑 a의 일차 관계식 | EXEMPT — 이차방정식과 대칭식 계산으로 완결 |
| q09 | REQUIRED — 원본 그래프에서 x절편 −1, 점근선 y=−1을 읽어야 함: `q09-problem.plan.json` | BENEFICIAL — 해설의 식·x절편·y절편 검산: `q09-solution.plan.json` |
| q10 | EXEMPT — 닫힌 정의역과 함수식이 글로 완결 | BENEFICIAL — 단조증가·양 끝 함수값 비교: `q10-solution.plan.json` |
| q11 | EXEMPT — 로그 차의 항등식 | EXEMPT — 로그법칙과 지수 역연산으로 완결 |
| q12 | REQUIRED — 원본 그래프의 a,b,c와 점선 순서를 읽어야 함: `q12-problem.plan.json` | REQUIRED — log₂ 관계를 1→2→4로 따라감: `q12-solution.plan.json` |
| q13 | EXEMPT — 네 후보 함수식이 문자로 완결 | BENEFICIAL — ㄱ·ㄷ·ㄹ의 변환 및 ㄴ의 두 가지를 비교: `q13-solution.plan.json` |
| q14 | EXEMPT — 금융 맥락이나 문항 조건은 순수 지수방정식 | EXEMPT — 수치 대입·거듭제곱 정리만 사용 |
| q15 | EXEMPT — 세 로그값의 공통 등식 | EXEMPT — p=logₐb 치환과 일차식 계산으로 완결 |
| q16 | EXEMPT — 45ˣ=27, 5ʸ=3의 로그 변환 | EXEMPT — 밑변환과 덧셈 정리만 사용 |
| q17 | EXEMPT — 연 2% 상승 시점을 수식으로 제시 | EXEMPT — 제공된 상용로그 근삿값으로 산술 계산 |
| q18 | EXEMPT — 두 함수·이동·대칭 조건이 문자로 완결; 미지 m 그래프는 답을 암시 | BENEFICIAL — 역함수 쌍과 y=x 대칭: `q18-solution.plan.json` |
| q19 | EXEMPT — 연립부등식 두 조건이 수식으로 완결 | BENEFICIAL — 0<x<2와 1<x<3의 열린 구간 교집합: `q19-solution.plan.json` |

## DRAWN_FEATURE_PARITY — 계획 필드에 실제 그려지는 필수 정보가 있는지

| qid/축 | 원문·해설의 필수 가시 정보 → 실제 그리기 필드 | sourceVsPlan | featureParity |
| --- | --- | --- | --- |
| 09/문제 | 증가하는 지수곡선 → `curves[f]`; 원본 식의 문자 a,b → `curves[f].label`; −1 x절편·−1 수평점근선 → `axisTickValues.x/y`, 곡선의 C=−1 | REVIEWED | PASS |
| 09/해설 | y=3^(x+1)−1 → `curves[f]`; (−1,0), (0,2) → `overlays.points[P,Q].coordinates`; y=−1 → C=−1 | REVIEWED | PASS |
| 10/해설 | −1≤x≤3 → `curves[f].domain`; 구간 끝값 (−1,−35/4), (3,−5) → `overlays.points[L,R].coordinates`; 증가곡선 → 지수 k=1 | REVIEWED | PASS |
| 12/문제 | y=log₂x, y=x → `curves[log,diag]`; a,b,c → `overlays.points[a,b,c]` 이름(좌표 비표시); 세 수직·두 수평 점선 → `segments[au,bw,cz,pv,qz]`, `dashed:true` | REVIEWED | PASS |
| 12/해설 | 문제의 모든 선·라벨 유지 + a,b,c의 1,2,4 → `axisTickValues.x=[1,2,4]`; log₂1=0, log₂2=1, log₂4=2 → `curves[log]` 및 점선 교점 | REVIEWED | PASS |
| 13/해설 | 기준 로그·ㄱ·ㄷ·ㄹ → 첫 패널 곡선 f,g,h,j; ㄴ의 x>0 및 x<0 가지 → 둘째 패널 n1,n2; 선의 구별 → 곡선 이름·색 | REVIEWED | PASS |
| 18/해설 | 로그를 오른쪽 2 이동 → f의 진수 x−2; 역함수 y=2^(x−3)+2 → g의 shiftX=3/C=2; 대칭축 → d 직선 y=x 점선 | REVIEWED | PASS |
| 19/해설 | 첫 구간 (0,2) 양 끝 OPEN, 둘째 (1,3) 양 끝 OPEN → `numberLine.rows[0,1]`; 공통 (1,2) → 엔진 `RESULT` | REVIEWED | PASS |

위 PASS는 **플랜 필드 대조** 결과이며, 아직 렌더된 픽셀·문자 겹침·실제 SVG 시각 품질의 통과를 뜻하지 않는다. 엔진이 미지원이라 캡션으로만 대신한 필수 각·길이·직각 표식은 이번 8개 계획에 없다.
