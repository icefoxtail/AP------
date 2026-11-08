# 22 순천고 고2 수학II Q18

기준 원문: `preparation-22-suncheon-math2/source-exact.js` (49,980 bytes), Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 이 입력의 sourcePath는 `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal은 18이다.

## 원문 인용 (정확한 content / answer / solution)

content:
```
18. 최고차항의 계수가 1인 삼차함수 $f(x)$와 실수 $t$에 대하여 $x$에 대한 방정식 $\int_{t}^{x} f(s)ds = 0$의 서로 다른 실근의 개수를 $g(t)$라 할 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. $f(x)=x^2(x-2)$일 때, $g(1)=1$이다.
ㄴ. 방정식 $f(x)=0$의 서로 다른 실근의 개수가 3이면 $g(a)=3$인 실수 $a$가 존재한다.
ㄷ. $\lim_{t \to b} g(t) + g(b) = 6$을 만족시키는 실수 $b$의 값이 0과 1뿐이면 $f(2)=3$이다.
```

answer: `④`

solution:
```
[정적분을 함수값 등식으로] $F'(x)=f(x)$인 사차함수 $F$를 두면 $\int_t^x f(s)ds=F(x)-F(t)$이다. 따라서 $g(t)$는 수평선 $y=F(t)$와 사차함수 그래프의 서로 다른 교점 개수이다.
ㄱ. $f=x^2(x-2)$이면 $F=\frac14x^4-\frac23x^3+C$. $F$는 $x<2$에서 감소하고 $x>2$에서 증가한다($x=0$에서는 부호가 바뀌지 않는다). $t=1$의 높이는 최솟값보다 높으므로 수평선은 양쪽에서 한 번씩 만나 $g(1)=2$. ㄱ 거짓.
ㄴ. $f$가 서로 다른 세 실근을 가지면 $F$는 두 극솟값과 그 사이 극댓값을 가진다. 두 극솟값이 서로 다르면 더 높은 극솟값 높이에서 접점 하나와 다른 두 교점, 같으면 가운데 극댓값 높이에서 접점 하나와 바깥 두 교점이 생긴다. 따라서 $g(a)=3$인 $a$가 존재한다. ㄴ 참.
ㄷ. $\lim_{t\to b}g(t)+g(b)=6$이 되는 점은 두 극솟값의 높이가 같은 경우의 두 극솟점이다. 그때 해당 높이에서는 두 접점만 있으므로 $g(b)=2$, 근처에서는 네 교점이므로 극한이 4이다. 두 점이 $b=0,1$이라면 $F(x)=\frac14x^2(x-1)^2+C$ (최고차항 $\frac14$). 미분하여 $f(x)=x(x-1)(x-\frac12)$, 따라서 $f(2)=2\cdot1\cdot\frac32=3$. ㄷ 참.
[보기 판단] ① ㄱ은 거짓, ② ㄱ·ㄴ과 ③ ㄱ·ㄷ은 거짓인 ㄱ 포함, ④ ㄴ·ㄷ만 정확, ⑤ 전체도 ㄱ을 포함해 오답. 정답 ④.
```

## 표현 판단

두 패널 모두 F에서 수직이동 상수 C=0을 선택한 대표다. 첫 패널 u는 ㄱ의 F₁⁰=x⁴/4−2x³/3이며 일반 원시함수는 F₁=F₁⁰+C다. t=1 높이는 C−5/12, 최소 높이는 C−4/3, 두 높이 차는 11/12다. 둘째 패널 v는 등최솟값 조건의 F₂=x²(x−1)²/4+C에서 C=0을 선택한 정규화 예다.

## 표현 한계 / 보류

첫 패널의 수평선 y=−5/12와 다른 교점의 정확 좌표는 polynomial-spike degree-4 입력 계약에서 지원되지 않아 그리지 않았다. 해설의 교점 수 2만 명시하고 다른 교점의 수치·근삿값은 제시하지 않는다. 둘째 패널의 최소높이 0은 정규화 선택이며 일반 사실로 확대하지 않는다.

상태: LOCAL_ONLY / DRAFT_ONLY. 세 JSON 파일 저장 완료. 검사 전 단계는 NOT_RUN이며 검사 결과를 미리 주장하지 않는다. engine/renderer/prepare/build/실제 SVG·PNG 렌더/browser·visual review/공식 게시 검증/독립 전체 수학 검증/구현자 인계는 NOT_RUN. READY가 아니다. 원문/engine/assets/ledger/다른 문항 입력/원격 refs·PR은 수정하지 않았다.

## 표시 계획 보완

2026-11-08 검사 결과로 compositePanels와 두 패널의 fit/spec/semantic/viewport 검사가 PASS했다고 전달받았다. 표시 계획만 보완해 첫 패널은 P, M에, 둘째 패널은 A, H, B에 coordinateLeader를 지정했다. 함수·좌표·수학 내용은 바꾸지 않았다. 이번 leader 변경 후 실제 입력 검사는 아직 수행되지 않았으며, 렌더·prepare/build·시각 검수는 NOT_RUN이다. 현재 입력을 동결한다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
실제 별도 경로: exact `compositePanels` PASS, 두 panel의 `fit_overview`→`phase2.specFor` 및 semantic/critical/viewport/tick 검사 PASS. `preparation-22-suncheon-math2/checker/composite-node-results-2026-11-08T18-56-03-365Z.json`와 `preparation-22-suncheon-math2/checker/composite-python-results-2026-11-08T18-56-03-365Z.json`의 해시는 현재 세 파일과 일치한다. 일반 roster의 UNVALIDATED_PATH는 기존 harness의 composite dispatch 미지원 표시일 뿐, 이 별도 실제 검사를 대체하거나 감추지 않았다.
원본 compositor blob `3fe6d66054e07f383b4093dfa55fc17e6c5572d7`. 두 패널에 실제 COORDINATE_LABEL 대상은0개이며 지시선은 ringLeader EQUATION_LABEL로 나온다. 전체 composite 조판·시각검수 성공으로 확대하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 두 quartic 모두 C=0 정규화 대표다. 첫 수평선과 미지 추가교점 좌표는 미표현이며 일반 높이차11/12를 보존했다. composite 전체 조판·layout·렌더 검사는 NOT_RUN이다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
