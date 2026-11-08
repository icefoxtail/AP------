상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 문항 폴더에만 `item.json`, `plan.json`, `publish.json`, `STATUS.md`를 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_금당고_2학기_기말_고2_수학II.js`, ordinal/questionNumber 각 문항 번호. exact source `preparation-22-geumdang-math2/source-exact.js` (55,589 bytes; Git blob `cadfff9c2ce5823d100aaae10eb72c624b63b110`); 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 images 배열은 `[]`. 별도 기존 SVG/history는 이 작성에서 수정하거나 삭제하지 않았다.; 원문 questionNumber 20.

시각화/부분 기능: 정확한 예시 함수, 극댓점·극솟점·단순근 및 설명용 수평선 y=±2를 입력했다. 개별 비폐쇄형 교점은 만들지 않았다. f(15)=320은 캡션에 계산값으로 두고 (15,320)은 먼 점 때문에 진단 영역이 압축될 가능성을 고려해 required point로 추가하지 않았다. 렌더 전의 입력상 선택이며 실제 가독성 결론은 아니다.

원문 인용 (plan.sourceQuote와 동일, verbatim):

```text
[서술형2] 최고차항의 계수가 1인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.

(가) $f(10)=0$, $f'(10)>0$
(나) 함수 $f(x)$는 음수인 극솟값을 갖는다.
(다) $x$에 대한 방정식 $|f(x)|=t$의 서로 다른 실근의 개수가 4인 $t$값의 범위는 $0 < t < 4$이다.

$f(15)$의 값을 구하는 과정을 서술하시오. [10.0점]
```

원문 정답 필드 (verbatim):

```text
320
```

원문 해설 (verbatim):

```text
$|f(x)|=t$ ($t>0$)의 해는 수평선 $y=t$와 $y=-t$가 $y=f(x)$와 만나는 점들을 합친 것입니다. 두 수평선의 높이가 서로 다르므로 교점이 중복 계산되지는 않습니다.
삼차함수의 극댓값을 $U$, 음수인 극솟값을 $L$ ($L<0$)이라 합시다. 극댓값도 $0$보다 크다면 충분히 작은 $t>0$에서 $y=t$, $y=-t$가 모두 극솟값과 극댓값 사이에 있어 각각 3개씩, 총 6개의 해가 생깁니다. 극댓값이 $0$보다 작다면 충분히 작은 $t>0$에서 두 수평선이 모두 극댓값 위에 있어 각각 1개씩, 총 2개의 해가 생깁니다. 그런데 문제는 모든 $0<t<4$에서 정확히 4개라고 했으므로 $U=0$이어야 합니다.
$U=0$이면 $0<t<-L$에서 $y=t$는 1번, $y=-t$는 3번 만나 총 4개입니다. 경계 $t=-L$에서는 $y=-t$가 극솟점에 접해 교점이 2개로 줄어들므로 4개가 아닙니다. 따라서 정확한 범위 $0<t<4$에서 $L=-4$임을 알 수 있습니다.
극댓점의 $x$좌표를 $r$라 하면 $f(r)=f'(r)=0$이므로 $r$은 중근입니다. 또한 $f(10)=0$이고 $f'(10)>0$이므로 $10$은 오른쪽에서 그래프가 위로 통과하는 단순근입니다. 최고차항 계수가 1이므로 $f(x)=(x-r)^2(x-10)$이고 $r<10$입니다.
$d=10-r>0$이라 놓으면 $f'(x)=(x-r)(3x-r-20)$이고 극솟점은 $s=\frac{r+20}{3}=10-\frac d3$입니다. 따라서 $s-r=\frac{2d}{3}$, $s-10=-\frac d3$이므로 극솟값은 $f(s)=(\frac{2d}{3})^2(-\frac d3)=-\frac{4d^3}{27}$입니다.
이를 $-4$와 같게 놓으면 $d^3=27$, $d=3$, $r=10-3=7$입니다. 그러므로 $f(x)=(x-7)^2(x-10)$이고 $f(15)=8^2\cdot5=320$입니다. 그래프의 두 수평선 교점 개수와 경계값을 함께 확인하면 이 함수가 조건을 만족함을 알 수 있습니다.
```

기록: 원문 questionBank 항목, sourcePath, ordinal, 정확한 문항 인용·정답·해설을 대조하고 보존했다. 기존 SVG/history는 덮어쓰지 않았다. 이 작성은 새로운 입력 초안만 대상으로 한다.

미실행: JSON/계약 검사, 함수 입력 검사, render/prepare/build, SVG/PNG 출력, browser/visual review, 독립 전체 수학검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 효천 ref 거절은 blocked 상태 그대로이며 재시도·우회하지 않았다. 원격 쓰기, engine/source/assets/ledger 또는 다른 문항 변경, 테스트는 하지 않았다.


## 최종 입력 검사와 로컬 보존

2026-11-08 UTC. 현재 item/plan/publish의 SHA256이 실제 실행 스냅샷과 일치한다. 근거: `preparation-22-geumdang-math2/checker/reports/node-results-2026-11-08T19-57-38-203Z.json` 및 같은 시각의 Python 결과.

실제 fit_overview → specFor → semantic_model.validate, 원본 엔진 critical/viewport 구성 및 눈금 경계 대조: PASS. 일반 COORDINATE_LABEL 검사 대상은 0개다. 대상0개이면 NOT_APPLICABLE로 구분하며 지시선 EQUATION_LABEL을 좌표 라벨 검사에 포함했다고 주장하지 않는다.
먼 점(15,320)은 그래프 필수점으로 포함하지 않고 설명에만 둔다. 원곡선과±2 예시 수평선 관계의 부분도다.

렌더, engine.prepare/build, 독립 전체 수학 검토, 시각 검수, CI, 게시 및 인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 원문·PNG·기존SVG·Q05/Q09/Q18·engine·ledger와 이전 로컬 패키지는 변경하지 않았다. 원격 쓰기·효천ref 거절 재시도·우회 없음.
