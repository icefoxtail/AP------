# 23 제일고 고2 확률과통계 Q09

상태: DRAFT_ONLY / NOT_READY. 담당자 UNKNOWN. 지정한 로컬 초안 입력만 작성했다. 기존 원문·기존 자산·보호된 문항과 운영물은 수정하지 않았다.

## 근거 및 초안 범위
- 지정된 source snapshot `preparation-23-jeil-stat/source-exact.js`는 43,396 bytes, SHA-256 `058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3`이며 전달된 digest와 일치한다. `item.json`은 시험지 상대경로와 문항 번호만 참조한다.
- 아래 원문 필드는 source snapshot의 runtime bank 값 그대로 옮겼다.
- 수학 초안 계산: 각 k에 대해 C(4,k)(2/3)^k(1/3)^(4-k)를 적용해 1/81, 8/81, 24/81, 32/81, 16/81을 얻고, k≥2의 합 72/81=8/9이다. 네 개 잠재 결과를 모두 실제 경기로 치른다고 주장하지 않는다.
- 문항 원문에 문제 이미지 참조가 없다.
- 이 계획은 현행 stat-chart TREE 입력 계약(라벨 최대 6자, 깊이 최대 3, 노드당 가지 1~5, 확률 가지는 합 1)을 기준으로 설계했으나, 공식 입력 검사기는 아직 실행하지 않았다.

## 상태 및 검사
- JSON 문법 확인: item/plan/publish JSON 세 파일을 Python json.loads로 파싱: OK.
- 공식 input-only checker: NOT_RUN (전용 checker 담당).
- 독립 수학 검수: NOT_RUN.
- 이 worker의 문제/이미지 대조, 시각 검수, 렌더: NOT_RUN.
- CI, handoff, publish/remote write, 엔진 변경: NOT_RUN. 원격 소유자 UNKNOWN.

### 원문 content
```
5번의 경기 중에서 3번을 먼저 이기는 사람이 최종 우승하는 체스 대회의 결승에 A와 B 두 사람이 진출하였다. A가 첫 번째 경기를 이겼을 때, A가 최종 우승할 확률을 구하면? (단, A가 B를 이길 확률은 $\dfrac{2}{3}$이고, 비기는 경우는 없다.) (4점)
```
### 원문 answer
```
②
```
### 원문 solution
```
[키포인트] A가 이미 1승을 했으므로, 남은 최대 4경기에서 A가 2번 이상 이기면 최종 우승한다.\n조건 정리: 한 경기에서 A가 이길 확률은 $\dfrac{2}{3}$, B가 이길 확률은 $\dfrac{1}{3}$이다.\n정석 풀이: 남은 4경기에서 A가 2승 이상 하는 확률을 구하면 된다. 따라서 확률은 ${}_{4}C_{2}\left(\dfrac{2}{3}\right)^2\left(\dfrac{1}{3}\right)^2+{}_{4}C_{3}\left(\dfrac{2}{3}\right)^3\left(\dfrac{1}{3}\right)+\left(\dfrac{2}{3}\right)^4=\dfrac{24}{81}+\dfrac{32}{81}+\dfrac{16}{81}=\dfrac{72}{81}=\dfrac{8}{9}$이다.\n따라서 정답은 ②이다.
```
