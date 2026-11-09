# 23 제일고 고2 확률과통계 Q01

회전 보조도: 수직선의 r=0..5가 0°, 60°, 120°, 180°, 240°, 300°의 여섯 회전을 뜻한다. 색칠 문제의 중심 칸 7가지 선택과 둘레 6색의 원순열 120가지로 840을 셈한다. 반사 대칭은 동치에 포함하지 않는다. 정육각형 본도형은 이 부분 그림에서 재현하지 않는다. 이 작업자는 원본 픽셀을 검토하지 않았으며, 원래 Q01 이미지는 변경하지 않았다.

Source snapshot: main `7563515ad7ea796f7c9f26881afe7f8f267f1ddf`, path `archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js`, Git blob `7ed637a7cb8f81e06b1fddd59e348be822e5e924`, size 43,396 bytes, SHA-256 `058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3`.
Source fields below are copied from `preparation-23-jeil-stat/source-exact.js` as JSON strings; JSON escaping preserves the source field values, including literal `\n` sequences.

```json
{
  "content": "오른쪽 그림과 같이 합동인 정육각형 7개를 붙여 만든 도형의 각 면에 다른 색이 오도록 7가지 색으로 구분하여 칠하는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.) (3.8점)",
  "answer": "⑤",
  "solution": "[키포인트] 서로 다른 7가지 색을 7개의 정육각형에 칠한 뒤, 회전하여 일치하는 경우를 같은 것으로 본다.\\n조건 정리: 도형은 한가운데 정육각형 1개와 둘레 정육각형 6개로 이루어져 있고, 회전 대칭은 6가지이다.\\n정석 풀이: 먼저 7개의 위치에 서로 다른 7가지 색을 칠하는 경우의 수는 $7!$이다. 이때 도형을 회전하여 일치하는 것은 같은 것으로 보므로, 같은 칠하기가 회전 6가지씩 중복 계산된다. 따라서 경우의 수는 $\\dfrac{7!}{6}=\\dfrac{5040}{6}=840$이다.\\n따라서 정답은 ⑤이다."
}
```

상태: DRAFT_ONLY / LOCAL_ONLY / NOT_READY. Owner: UNKNOWN. 이 작업은 지정된 세 drafts 폴더의 item/plan/publish/STATUS만 작성했다. source-exact.js, source-runtime-bank.json, 원본 시험지·기존 자산·다른 패키지에는 쓰지 않았다. Q05/Q12/Q13/Q14/Q16/Q20 기존 그림/PNG, 이전 패키지, paused H1 작업은 범위 밖이며 보존한다.

계약 후보: number-line-figure-v1 (회전 지수 부분 그림). Plan/publish는 초안이며 production input functions, integrated checks, math review, official render/SVG/PNG, visual review, CI/publication, handoff, remote reads/writes, commit/push/PR: NOT_RUN. 렌더 크기를 측정하지 않아 publish.size는 기록하지 않았다. DRAFT_ONLY/NOT_READY를 READY 또는 검수 PASS로 확대하지 않는다.
