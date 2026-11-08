# 22 순천고 고2 수학II Q19

기준 원문: `preparation-22-suncheon-math2/source-exact.js` (49,980 bytes), Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 이 입력의 sourcePath는 `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal은 19이다.

## 원문 인용 (정확한 content / answer / solution)

content:
```
19. 삼차함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=\frac{1}{3}x^3-ax^2+(a^2-b)x+\int_{-1}^{1} f(t)dt$를 만족시킨다. $x>1$에서 함수 $f(x)$가 극댓값을 갖도록 하는 7보다 작은 두 정수 $a, b$에 대하여 순서쌍 $(a, b)$의 개수는 $m$이고 $a=k$일 때, $f(0)$은 최소이다. $m+k$의 값은? (단, $k$는 상수이다.) [5.2점]
```

answer: `①`

solution:
```
[적분상수 먼저] $I=\int_{-1}^1f(t)dt$라 놓으면 $f(x)=\frac13x^3-ax^2+(a^2-b)x+I$. 양 끝이 대칭이므로 홀수차 항의 적분은 0이고 $I=-\frac{2a}{3}+2I$. 따라서 $I=\frac{2a}{3}$, 즉 $f(0)=\frac{2a}{3}$.
[극댓값 조건] $f'(x)=x^2-2ax+a^2-b=(x-a)^2-b$. 극댓값이 존재하려면 $b>0$, 극대점은 $x=a-\sqrt b$이다. 이것이 1보다 커야 하므로 $a>1+\sqrt b$.
정수 $a,b<7$에서 $b=1,2,3$이면 가능한 $a=3,4,5,6$ 각 4개; $b=4,5,6$이면 $a=4,5,6$ 각 3개이다. $m=3\cdot4+3\cdot3=21$.
$f(0)=2a/3$이 최소인 경우는 허용되는 가장 작은 $a=3$이므로 $k=3$. 따라서 $m+k=24$.
[보기 판단] ① 24가 정확하다. ② 26, ③ 28, ④ 30, ⑤ 32는 $a>1+\sqrt b$의 엄격한 부등식이나 $b=4$의 경계 $a=3$ 제외를 놓치면 생기는 과다 계수다. 정답 ①.
```

## 표현 판단

점도표는 가능한 (a,b) 중 각 b값마다 가능한 정수 a 개수를 실제로 모아 표시한다: 4,4,4,3,3,3. 값 b=1,…,6은 서로 떨어진 범주형 정수이며 그 사이를 연속 해집합으로 읽지 않는다. m=21, 최소 허용 a=3이므로 k=3.

## 표현 한계 / 보류

차트는 빈도 요약만 보여 준다. 각 점이 개별 a값을 모두 열거하지는 않으며, count는 조건에서 정확히 센 정수쌍의 수다.

상태: LOCAL_ONLY / DRAFT_ONLY. 세 JSON 파일 저장 완료. 검사 전 단계는 NOT_RUN이며 검사 결과를 미리 주장하지 않는다. engine/renderer/prepare/build/실제 SVG·PNG 렌더/browser·visual review/공식 게시 검증/독립 전체 수학 검증/구현자 인계는 NOT_RUN. READY가 아니다. 원문/engine/assets/ledger/다른 문항 입력/원격 refs·PR은 수정하지 않았다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
실제 검사 경로: `checkStatChartPlan`. DOT_PLOT은 이산 정수 조합의 경우 수를 나타내며, 렌더·stat observer는 실행하지 않았다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
