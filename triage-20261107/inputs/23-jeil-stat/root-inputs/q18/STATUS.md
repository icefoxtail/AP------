# 23 제일고 고2 확률과통계 Q18

k의 다섯 가능한 값에 대한 이항분포 TREE이며 k=0,2,4만 강조한다. 3·6은 반시계(p=1/3), 그 밖은 시계(p=2/3). 본도형 기준 꼭짓점은 A 좌하, B 우하, C 우상, D 좌상이고 반시계 순서는 A→B→C→D→A, 시계 순서는 A→D→C→B→A이다. 원래 정사각형 경로 그림은 이 계획에서 다시 그리지 않는다. 이 작업자는 원본 픽셀을 검토하지 않았으며, 원래 Q18 이미지는 변경하지 않았다.

Source snapshot: main `7563515ad7ea796f7c9f26881afe7f8f267f1ddf`, path `archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js`, Git blob `7ed637a7cb8f81e06b1fddd59e348be822e5e924`, size 43,396 bytes, SHA-256 `058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3`.
Source fields below are copied from `preparation-23-jeil-stat/source-exact.js` as JSON strings; JSON escaping preserves the source field values, including literal `\n` sequences.

```json
{
  "content": "다음 그림과 같이 한 변의 길이가 1인 정사각형 ABCD의 꼭짓점 A에서 출발하여 변을 따라 움직이는 점 P가 있다. 주사위를 한 번 던질 때마다 다음과 같은 규칙에 따라 움직인다.\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td>(가) 나오는 눈의 수가 3의 배수이면 시곗바늘이 도는 방향과 반대인 방향으로 1만큼 움직인다.</td></tr><tr><td>(나) 나오는 눈의 수가 3의 배수가 아니면 시곗바늘이 도는 방향으로 1만큼 움직인다.</td></tr></tbody></table></div>\\n주사위를 4번 던질 때, 점 A를 출발한 점 P가 다시 점 A로 되돌아올 확률을 구하면? (4.3점)",
  "answer": "⑤",
  "solution": "[키포인트] 정사각형의 둘레를 따라 4번 움직인 뒤 출발점으로 돌아오려면 반시계 방향 이동 횟수가 짝수여야 한다.\\n조건 정리: 3의 배수는 3, 6이므로 반시계 방향으로 움직일 확률은 $\\dfrac{2}{6}=\\dfrac{1}{3}$이고, 시계 방향으로 움직일 확률은 $\\dfrac{4}{6}=\\dfrac{2}{3}$이다.\\n정석 풀이: 반시계 방향 이동 횟수를 $k$라 하면, 시계 방향 이동 횟수는 $4-k$이다. 정사각형에서 4번 이동 후 다시 A로 돌아오려면 $k=0,2,4$인 경우이다. 따라서 확률은 $\\left(\\dfrac{2}{3}\\right)^4+{}_{4}C_{2}\\left(\\dfrac{1}{3}\\right)^2\\left(\\dfrac{2}{3}\\right)^2+\\left(\\dfrac{1}{3}\\right)^4=\\dfrac{16}{81}+\\dfrac{24}{81}+\\dfrac{1}{81}=\\dfrac{41}{81}$이다.\\n따라서 정답은 ⑤이다."
}
```

상태: DRAFT_ONLY / LOCAL_ONLY / NOT_READY. Owner: UNKNOWN. 이 작업은 지정된 세 drafts 폴더의 item/plan/publish/STATUS만 작성했다. source-exact.js, source-runtime-bank.json, 원본 시험지·기존 자산·다른 패키지에는 쓰지 않았다. Q05/Q12/Q13/Q14/Q16/Q20 기존 그림/PNG, 이전 패키지, paused H1 작업은 범위 밖이며 보존한다.

계약 후보: stat-chart-figure-v1 / TREE (k의 정확한 분포, 정사각형 경로는 생략). Plan/publish는 초안이며 production input functions, integrated checks, math review, official render/SVG/PNG, visual review, CI/publication, handoff, remote reads/writes, commit/push/PR: NOT_RUN. 렌더 크기를 측정하지 않아 publish.size는 기록하지 않았다. DRAFT_ONLY/NOT_READY를 READY 또는 검수 PASS로 확대하지 않는다.
