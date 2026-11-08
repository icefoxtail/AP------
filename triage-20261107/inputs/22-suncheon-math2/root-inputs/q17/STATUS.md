# 22 순천고 고2 수학II Q17

기준 원문: `preparation-22-suncheon-math2/source-exact.js` (49,980 bytes), Git blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`, main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`. 이 입력의 sourcePath는 `archive/exams/original/high/h2/2final/22_순천고_2학기_기말_고2_수학II.js`, ordinal은 17이다.

## 원문 인용 (정확한 content / answer / solution)

content:
```
17. 최고차항의 계수가 양수인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.

방정식 $f(x)+xf'(x)=0$이 $\alpha < \beta < 0 < \gamma$인 세 실근 $\alpha, \beta, \gamma$를 갖고, $f(\alpha)f(\beta)f(\gamma)=0$이다.

옳은 것만을 <보기>에서 있는 대로 고른 것은? [5.2점]

<보기>
ㄱ. 함수 $f(x)$는 $x=\alpha$에서 극댓값을 갖는다.
ㄴ. $f(\beta)f(\gamma)>0$
ㄷ. 방정식 $f(x)=0$은 실수인 근은 두 개다.
```

answer: `⑤`

solution:
```
[핵심 구조] $H(x)=f(x)+xf'(x)=(xf(x))'$라고 놓자. $H$의 세 근은 $\alpha<\beta<0<\gamma$이다. $f(\alpha)f(\beta)f(\gamma)=0$이므로 그중 어떤 $r\ne0$에서 $f(r)=0$. 동시에 $H(r)=0$이므로 $rf'(r)=0$, 따라서 $f'(r)=0$이다. 즉 $r$은 $f$의 중근.
최고차항 계수를 $c>0$이라 하면 $f(x)=c(x-r)^2(x-s)$, $H(x)=c(x-r)(4x^2-(2r+3s)x+rs)$이다.
$H$의 세 근의 곱은 양수($\alpha\beta\gamma>0$)이고 비에타로 $r^2s/4>0$이므로 $s>0$. 두 음의 근이 있으려면 $r<0$. $r$과 다른 음의 근을 비교하면 $Q(r)=2r(r-s)>0$이고 $Q(0)=rs<0$이므로 $r$은 가장 왼쪽 근 $\alpha$이다.
ㄱ. $f(x)=c(x-\alpha)^2(x-s)$에서 $\alpha<s$이므로 $x=\alpha$ 부근 $f(x)\le0=f(\alpha)$, 극댓값. 참.
ㄴ. 다른 음의 근 $\beta$는 $\alpha<\beta<0<s$이므로 $f(\beta)<0$. 양의 근 $\gamma$도 $0<\gamma<s$($Q(s)=s(s-r)>0$)이므로 $f(\gamma)<0$. 곱은 양수. 참.
ㄷ. $f(x)=0$의 서로 다른 실근은 $\alpha$와 $s$ 두 개(중근 하나, 단근 하나). 참.
[보기 판단] ① ㄱ, ② ㄴ, ③ ㄱ·ㄴ, ④ ㄴ·ㄷ은 참인 진술을 빠뜨렸다. ⑤ ㄱ·ㄴ·ㄷ이 정답.
```

## 표현 판단

입력은 실수근의 순서와 근의 중복도를 보여 주는 상징 number line이다. u,v,w,z는 caption에서 각각 α,β,γ,s로 정의했다. 원문은 계수 C>0만 주므로 실제 숫자 좌표나 그래프를 만들지 않았다.

## 표현 한계 / 보류

number-line-v1은 점의 순서와 exact point 값을 나타내며 함수 부호 영역을 그래프로 직접 그리지 않는다. 부호 사실은 caption/newVisualInformation에만 적었다. numberLineCaption.math에는 허용이 확인되지 않은 Greek 수식을 두지 않고, 순서는 실제 POINTS row에 표현했다.

상태: LOCAL_ONLY / DRAFT_ONLY. 세 JSON 파일 저장 완료. 검사 전 단계는 NOT_RUN이며 검사 결과를 미리 주장하지 않는다. engine/renderer/prepare/build/실제 SVG·PNG 렌더/browser·visual review/공식 게시 검증/독립 전체 수학 검증/구현자 인계는 NOT_RUN. READY가 아니다. 원문/engine/assets/ledger/다른 문항 입력/원격 refs·PR은 수정하지 않았다.

## 표시 계획 보완

행 제목을 `근순서`에서 `위치순서`로 바꿨다. 0, β, γ는 표시되는 위치 비교점이며 f의 근은 α와 s뿐이라는 구분을 분명히 했다. 수학 입력은 바꾸지 않았다. 이 작은 표시 변경 후 실제 입력 검사는 아직 수행하지 않았다.

## 2026-11-08 최종 로컬 패키지 상태

기존 초안·실패·NOT_RUN 기록은 당시 이력으로 보존했다. 아래는 패키징 시점의 최신 상태다.

원문은 main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, blob `98e6dabf7e7b7807e04cef0d7e3c2400271de04e`에 고정했다. exact source는49,980 bytes이다. 현재 세 JSON은 파싱 가능하며 item의 sourcePath·ordinal·numeric sourceQid가 이 원문과 결속된다. 현재 plan sourceQuote와 STATUS의 fenced 원문 인용은 존재하는 항목마다 정확한 원문 부분 문자열이다.

현재 item/plan/publish 세 파일의 SHA256은 아래 actual 검사 스냅샷과 모두 일치한다. 적용되는 실제 순수 입력 단계: PASS.
실제 검사 경로: `expandNumberLineFigure`. 그래프 fit/spec/semantic 검사를 적용했다고 주장하지 않는다.
일반 증거: `preparation-22-suncheon-math2/checker/node-results-2026-11-08T18-57-41-242Z.json`, `preparation-22-suncheon-math2/checker/python-results-2026-11-08T18-57-41-242Z.json`. 스냅샷의 fail-closed 외부 함수 호출은0이다.

실제 초기 실패 이력: CHAIN_CAPTION_INVALID. 실패 raw 파일과 당시 입력 해시는 failure-history.json에 보존했다.

표현 범위: α<β<0<γ<s의 위치 순서도다. f의 근은 α,s이고 β,γ의 함수값은 음수다. 미지 좌표·비율은 부여하지 않는다.

사용자 사유: 이해에 도움이 되는 함수 도식을 계획한다. 실제 좌표의 지시선과 기호 순서를 사용하되 원문에 없는 수치·간격은 만들지 않는다. 지시선 충돌·학생 가독성은 렌더 전이라 미검수다.

공통 NOT_RUN: engine.prepare 전체, build, 공식 render/SVG/PNG, composite 전체 layout, browser·visual review, 독립 전체 수학 검토, CI, 게시, 인계. LOCAL_ONLY / DRAFT_ONLY이며 READY 또는 시험지 그림 완료가 아니다.

기존 Q02/Q10 입력, root assets/images의 Q11/Q16/Q22 SVG 및 Q03/Q21 PNG, #1225 archive 복사/연결 작업, 원문·engine·ledger는 변경하지 않았다. 기존 ownership/attempt UNKNOWN을 owner 부재로 바꾸지 않았다. ROOT의 최신 그림 직접 확인은 예전 triage 미확인 이력을 지우지 않는 추가 근거다.

원격 쓰기 없음. triage HEAD 0f7684bbed2aa58ccd588bc5d233c74032ab1e75 그대로, 새 commit 없음. 효천 ref 거절 재시도·우회 없음. latest main f07631717352e5c68c50290a6a3e75ab28af50e1의 추가3커밋/216변경파일에는 이 시험지나 geometry engine 변경이 없다.
