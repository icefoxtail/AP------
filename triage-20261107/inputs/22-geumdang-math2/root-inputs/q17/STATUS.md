상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 문항 폴더에만 `item.json`, `plan.json`, `publish.json`, `STATUS.md`를 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 각 문항 번호. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes; Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`); 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images 배열은 `[]`. 별도 기존 SVG/history는 이 작성에서 수정하거나 삭제하지 않았다.; 원문 questionNumber 17.

시각화/부분 기능: 해 a=2를 대입한 함수 예시, 정확한 극값 및 수평선 y=1,2,3을 입력했다. y=2의 교점 x=−1,2는 정확하지만 y=1,3의 비폐쇄형 교점 좌표는 추측하지 않았다. 원문 문제의 계수 a 전체가 아닌 풀이된 예시 그래프임을 밝힌다.

원문 인용 (plan.sourceQuote와 동일, verbatim):

```text
[단답형1] 삼차함수 $f(x)=2x^3-3ax^2+2a^2+a$와 실수 $t$에 대하여 곡선 $y=f(x)$와 직선 $y=t$가 만나는 점의 개수를 $g(t)$라 하자. $g(1) < g(2) < g(3)$이 성립하도록 하는 양수 $a$의 값을 구하시오. [5.0점]
```

원문 정답 필드 (verbatim):

```text
2
```

원문 해설 (verbatim):

```text
수평선 $y=t$와 삼차함수의 교점 개수는 극댓값과 극솟값을 경계로 달라집니다. 극솟값보다 작거나 극댓값보다 크면 1개, 두 극값 중 하나와 같으면 2개, 그 사이에 있으면 3개입니다.
$f'(x)=6x^2-6ax=6x(x-a)$이고 $a>0$이므로 $x=0$에서 극대, $x=a$에서 극소입니다. 극댓값을 $U=f(0)=2a^2+a$, 극솟값을 $L=f(a)=-a^3+2a^2+a$라 두면 $L<U$입니다.
$g(1)<g(2)<g(3)$이고 교점 개수는 $1,2,3$ 중 하나이므로 반드시 $g(1)=1$, $g(2)=2$, $g(3)=3$입니다. 특히 $g(3)=3$이려면 $L<3<U$입니다.
$g(2)=2$인 경우는 $2=L$ 또는 $2=U$입니다. 만약 $2=U$이면 $3>U$이므로 $g(3)=1$이 되어 모순입니다. 따라서 $L=2$여야 하고, 이때 $1<L=2<3<U$가 성립해야 합니다.
$-a^3+2a^2+a=2$를 정리하면 $a^3-2a^2-a+2=(a-1)(a-2)(a+1)=0$입니다. $a>0$이므로 후보는 $a=1$ 또는 $a=2$입니다.
$a=1$이면 $U=2+1=3$이어서 $g(3)=2$이므로 탈락합니다. $a=2$이면 $L=2$, $U=2\cdot4+2=10$으로 $1<2<3<10$이며 실제 $g(1)=1$, $g(2)=2$, $g(3)=3$이 됩니다. 따라서 구하는 값은 $a=2$입니다.
```

기록: 원문 questionBank 항목, sourcePath, ordinal, 정확한 문항 인용·정답·해설을 대조하고 보존했다. 기존 SVG/history는 덮어쓰지 않았다. 이 작성은 새로운 입력 초안만 대상으로 한다.

미실행: JSON/계약 검사, 함수 입력 검사, render/prepare/build, SVG/PNG 출력, browser/visual review, 독립 전체 수학검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 효천 ref 거절은 blocked 상태 그대로이며 재시도·우회하지 않았다. 원격 쓰기, engine/source/assets/ledger 또는 다른 문항 변경, 테스트는 하지 않았다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
