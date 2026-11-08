# 22 순천고 고2 수학II Q03

기준 원문: `preparation-22-suncheon-math2/source-exact.js` (49,980 bytes), Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 이 입력의 sourcePath는 `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal은 3이다.

## 원문 인용 (정확한 content / answer / solution)

content:
```
3. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서의 속도를 $v(t)$라고 하자. $y=v(t)$의 그래프가 다음 그림과 같을 때, 점 $\mathrm{P}$는 운동 방향을 바꾸는 횟수는? (단, $0 \le t \le 20$) [3.0점]
```

answer: `③`

solution:
```
[그림 해석] 운동 방향은 속도 $v(t)$의 부호가 바뀔 때만 바뀐다. $v(t)=0$인 순간이 있어도 그래프가 축에 닿았다가 같은 쪽으로 돌아오면 방향 변화가 아니다.
원본 그래프에서 처음 양수로 출발하여 첫 번째 접촉점에서는 계속 양수이고, 그다음 교차에서 $+\to-$, 다음 교차에서 $-\to+$, 마지막 교차에서 $+\to-$이다. $t=20$ 부근 축에 접하는 점은 $-\to-$로 부호 변화가 없다.
따라서 방향 변화는 세 번이다.
[보기 판단] ①·②는 실제 축 교차 세 곳 중 일부를 빠뜨린 횟수이고, ④·⑤는 부호 변화 없는 접촉까지 세었거나 출발점 $t=0$을 잘못 포함한 횟수이다. 정답 ③.
```

## 표현 판단

원본 속도 그래프에서 확인되는 사건 순서만 상징 수직선으로 나타낸다. 접촉·교차의 내부 시각은 주어지지 않아 0·20 사이에 위치 점이나 수치를 배치하지 않았다. 원본 `q3.png`는 교체·수정하지 않는다.

## 표현 한계 / 보류

다섯 사건 a~e는 순서 기호이며 실제 시각·시간 간격이 아니다. number-line-v1은 함수 곡선·부호 구간을 직접 그리지 않으므로 부호 변화는 caption에서만 설명한다.

상태: LOCAL_ONLY / DRAFT_ONLY. 세 JSON 파일 저장 완료. 검사 전 단계는 NOT_RUN이며 검사 결과를 미리 주장하지 않는다. engine/renderer/prepare/build/실제 SVG·PNG 렌더/browser·visual review/공식 게시 검증/독립 전체 수학 검증/구현자 인계는 NOT_RUN. READY가 아니다. 원문/engine/assets/ledger/다른 문항 입력/원격 refs·PR은 수정하지 않았다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
실제 검사 경로: `expandNumberLineFigure`. 그래프 fit/spec/semantic 검사를 적용했다고 주장하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

표현 범위: 다섯 기호 사건의 순서만 표시한다. 실제 시각·간격·속도 곡선은 추정하지 않았고 마지막 접촉을 정확히20으로 단정하지 않는다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
