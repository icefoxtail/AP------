# 22 순천고 고2 수학II Q15

기준 원문: `preparation-22-suncheon-math2/source-exact.js` (49,980 bytes), Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 이 입력의 sourcePath는 `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal은 15이다.

## 원문 인용 (정확한 content / answer / solution)

content:
```
15. 최고차항의 계수가 양수인 삼차함수 $f(x)$와 서로 다른 두 실수 $a, b$에 대하여 $f'(a)=f'(b)=0$이다. <보기>에서 옳은 것만을 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. 방정식 $f(x)-\frac{f(a)+f(b)}{2}=0$은 서로 다른 세 실근을 갖는다.
ㄴ. 방정식 $|f(x)-f(a)|-|f(a)-f(b)|=0$은 서로 다른 세 실근을 갖는다.
ㄷ. 함수 $f(|x|)$가 실수 전체의 집합에서 미분가능하면 방정식 $f(|x|)-\frac{f(a)+f(b)}{2}=0$은 서로 다른 네 실근을 갖는다.
```

answer: `②`

solution:
```
[극대·극소 구조] 최고차항이 양수이고 서로 다른 두 극점이 있으므로 한 극댓값 $M$과 한 극솟값 $m$이 있으며 $M>m$이다.
ㄱ. $(f(a)+f(b))/2=(M+m)/2$는 극댓값과 극솟값 사이의 높이이다. 삼차함수의 세 단조 구간을 각각 한 번씩 지나므로 서로 다른 세 실근을 갖는다. 참.
ㄴ. $|f(x)-f(a)|=|f(a)-f(b)|$는 $f(x)=f(b)$ 또는 $f(x)=2f(a)-f(b)$이다. 첫 높이는 극댓값 또는 극솟값이므로 서로 다른 두 교점(접점 하나와 다른 교점 하나), 두 번째 높이는 두 극값 범위 밖이므로 교점 하나. 두 높이는 서로 다르므로 합하여 세 실근. 참.
ㄷ. $f(|x|)$가 0에서 미분가능하려면 $f'(0)=0$이다. 하지만 다른 극점이 음수일 수 있다. 예를 들어 $f(x)=x^2(x+3)$은 극점 $-2,0$, $f(|x|)=x^2(|x|+3)$은 미분가능하다. 극댓값 $4$, 극솟값 $0$, 중간 높이 $2$에 대하여 $f(|x|)=2$는 양의 $|x|$ 해가 하나이므로 실근 두 개뿐이다. 네 개라는 주장은 거짓.
[보기 판단] ① ㄱ만은 ㄴ을 누락, ② ㄱ·ㄴ이 정확, ③ ㄱ·ㄷ과 ④ ㄴ·ㄷ과 ⑤ 전부는 거짓인 ㄷ을 포함한다. 정답 ②.
```

## 표현 판단

ㄷ은 정확한 piecewise cubic 그래프로 나타낸다. x<0에서 h=−x³+3x², x≥0에서 h=x³+3x²이며, 두 조각은 (0,0)에서 이어진다. y=2와의 두 교점 A=(1−√3,2), B=(√3−1,2), 접합점 K=(0,0)은 정확 좌표 지시선으로 표시한다. 일반 ㄱ/ㄴ에서는 M>m과 중간 높이, 접하는 극값 높이·바깥 반사 높이의 교점 논리를 prose에만 남긴다.

## 표현 한계 / 보류

그래프에는 ㄷ의 실제 반례만 수치화했다. M,m을 일반 조건보다 더 구체적으로 지정하거나 ㄱ/ㄴ을 대표 수치 cubic으로 바꾸지 않았다.

상태: LOCAL_ONLY / DRAFT_ONLY. 세 JSON 파일 저장 완료. 검사 전 단계는 NOT_RUN이며 검사 결과를 미리 주장하지 않는다. engine/renderer/prepare/build/실제 SVG·PNG 렌더/browser·visual review/공식 게시 검증/독립 전체 수학 검증/구현자 인계는 NOT_RUN. READY가 아니다. 원문/engine/assets/ledger/다른 문항 입력/원격 refs·PR은 수정하지 않았다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
검사 스냅샷에서 수행한 경로: `fit_overview`→`phase2.specFor`, `semantic_model.validate`, 실제 engine critical 점 구성, `viewport.for_spec`, 축 눈금 guard 및 fitted/spec 눈금 대조.
실제 COORDINATE_LABEL 0개에 한해 exact_coordinate를 검사했다.0개이면 좌표 문구 전체 검사라는 뜻이 아니다. named leader의 EQUATION_LABEL 및 전체 수학·문구의 독립 검토는 이 검사에 포함하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 정확한 ㄷ 반례 h=f(|x|)와 높이2의 교점을 표시한다. 일반 M/m 곡선은 그리지 않고 ㄱ·ㄴ의 일반 논리를 visible caption에 보존했다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
