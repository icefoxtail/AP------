# 23 제일고 고2 확률과통계 Q23

상태: DRAFT_ONLY / NOT_READY. 담당자 UNKNOWN. 지정한 로컬 초안 입력만 작성했다. 기존 원문·기존 자산·보호된 문항과 운영물은 수정하지 않았다.

## 근거 및 초안 범위
- 지정된 source snapshot `preparation-23-jeil-stat/source-exact.js`는 43,396 bytes, SHA-256 `058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3`이며 전달된 digest와 일치한다. `item.json`은 시험지 상대경로와 문항 번호만 참조한다.
- 아래 원문 필드는 source snapshot의 runtime bank 값 그대로 옮겼다.
- 수학 초안 계산: 한 시행의 값별 결합확률은 1/4, 1/4, 1/6, 1/6, 1/6이다. 따라서 E(X)=11/4, E(X²)=115/12, V(X)=97/48이고, 독립 3회 표본평균은 평균 11/4, 분산 97/144이다.
- 원문은 assets/images/23_제일고_2학기_기말_고2_확률과통계/q23.png를 참조한다. ROOT가 실제 원본 그림을 별도로 확인했으며, 이 worker는 직접 열어 보지 않았다. 이 worker의 이미지/절차 대조는 NOT_RUN이다. 공을 뽑은 같은 상자에 되돌리고 각 반복에서 상자를 다시 고른다는 해석은 지시된 수학 조건을 따른다.
- 이 계획은 현행 stat-chart TREE 입력 계약(라벨 최대 6자, 깊이 최대 3, 노드당 가지 1~5, 확률 가지는 합 1)을 기준으로 설계했으나, 공식 입력 검사기는 아직 실행하지 않았다.

## 상태 및 검사
- JSON 문법 확인: item/plan/publish JSON 세 파일을 Python json.loads로 파싱: OK.
- 공식 input-only checker: NOT_RUN (전용 checker 담당).
- 독립 수학 검수: NOT_RUN.
- 이 worker의 문제/이미지 대조, 시각 검수, 렌더: NOT_RUN.
- CI, handoff, publish/remote write, 엔진 변경: NOT_RUN. 원격 소유자 UNKNOWN.

### 원문 content
```
[서술형 3] 상자 A에는 숫자 1, 2가 하나씩 적혀 있는 2개의 공이 들어 있고, 상자 B에는 숫자 3, 4, 5가 하나씩 적혀 있는 3개의 공이 들어 있다. 다음의 시행을 3번 반복하여 확인한 세 개의 수의 평균을 $\overline{X}$라 하자. 표본평균 $\overline{X}$의 평균과 분산을 구하는 과정을 서술하시오. (7점, 부분 점수 있음.)
```
### 원문 answer
```
$E(\overline{X})=\dfrac{11}{4}$, $V(\overline{X})=\dfrac{97}{144}$
```
### 원문 solution
```
[키포인트] 한 번의 시행에서 얻는 수의 평균과 분산을 먼저 구하고, 독립인 3번의 평균에 대한 성질을 이용한다.\n조건 정리: 상자 A를 고를 확률은 $\dfrac{1}{2}$이고 A에서 1, 2가 나올 확률은 각각 $\dfrac{1}{2}$이므로 전체 확률은 각각 $\dfrac{1}{4}$이다. 상자 B를 고를 확률은 $\dfrac{1}{2}$이고 B에서 3, 4, 5가 나올 확률은 각각 $\dfrac{1}{3}$이므로 전체 확률은 각각 $\dfrac{1}{6}$이다.\n정석 풀이: 한 번의 시행에서 얻는 값을 $X$라 하면 $E(X)=1\cdot\dfrac{1}{4}+2\cdot\dfrac{1}{4}+3\cdot\dfrac{1}{6}+4\cdot\dfrac{1}{6}+5\cdot\dfrac{1}{6}=\dfrac{11}{4}$이다. 또한 $E(X^2)=1^2\cdot\dfrac{1}{4}+2^2\cdot\dfrac{1}{4}+3^2\cdot\dfrac{1}{6}+4^2\cdot\dfrac{1}{6}+5^2\cdot\dfrac{1}{6}=\dfrac{115}{12}$이다. 따라서 $V(X)=E(X^2)-\{E(X)\}^2=\dfrac{115}{12}-\left(\dfrac{11}{4}\right)^2=\dfrac{97}{48}$이다. 세 번의 독립시행의 평균 $\overline{X}$에 대하여 $E(\overline{X})=E(X)=\dfrac{11}{4}$이고, $V(\overline{X})=\dfrac{V(X)}{3}=\dfrac{97}{144}$이다.\n따라서 구하는 값은 $E(\overline{X})=\dfrac{11}{4}$, $V(\overline{X})=\dfrac{97}{144}$이다.
```
