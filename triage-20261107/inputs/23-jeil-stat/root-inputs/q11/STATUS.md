# 23 제일고 고2 확률과통계 Q11

추상 Venn은 ㄴ의 A∩Bᶜ 집합 위치만 보여 준다. 겹침 모양이나 넓이를 확률값·독립성 증거로 해석하면 안 된다. CONTENT 주의: 원문은 A,B 비공집합만 명시하며 P(A)>0, P(B)>0을 보장하지 않는다. 따라서 일반 확률공간에서 P(A|B), P(B|A) 등 조건부확률은 영확률의 비공집합 사건에 대해 정의되지 않을 수 있다. ㄷ·ㄹ의 진릿값/답 선택은 이 다이어그램으로 해결하지 않았으며 원문은 변경하지 않았다.

Source snapshot: main `7563515ad7ea796f7c9f26881afe7f8f267f1ddf`, path `archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js`, Git blob `7ed637a7cb8f81e06b1fddd59e348be822e5e924`, size 43,396 bytes, SHA-256 `058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3`.
Source fields below are copied from `preparation-23-jeil-stat/source-exact.js` as JSON strings; JSON escaping preserves the source field values, including literal `\n` sequences.

```json
{
  "content": "두 사건 $A$, $B$가 서로 독립일 때, 다음 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $A\\ne\\varnothing$, $B\\ne\\varnothing$) (4.1점)\\n<div class=\"question-table-wrap\"><table class=\"question-table\"><tbody><tr><td>ㄱ. $P(A\\cup B)=P(A)+P(B)$</td></tr><tr><td>ㄴ. $P(A\\cap B^c)=P(A)P(B^c)$</td></tr><tr><td>ㄷ. $P(A^c\\mid B)=1-P(A)$</td></tr><tr><td>ㄹ. $P(A\\mid B)=P(B\\mid A)$</td></tr></tbody></table></div>",
  "answer": "④",
  "solution": "[키포인트] 독립인 두 사건에서는 여사건과의 독립도 함께 성립한다.\\n조건 정리: $A$와 $B$가 독립이면 $P(A\\cap B)=P(A)P(B)$이고, $A$와 $B^c$도 독립이다.\\n정석 풀이: ㄱ은 일반적으로 $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$이므로 항상 참이 아니다. ㄴ은 $A$와 $B^c$가 독립이므로 $P(A\\cap B^c)=P(A)P(B^c)$가 되어 참이다. ㄷ은 독립성에 의해 $P(A^c\\mid B)=P(A^c)=1-P(A)$이므로 참이다. ㄹ은 $P(A\\mid B)=P(A)$, $P(B\\mid A)=P(B)$인데 두 값이 항상 같지는 않으므로 거짓이다.\\n따라서 정답은 ④이다."
}
```

상태: DRAFT_ONLY / LOCAL_ONLY / NOT_READY. Owner: UNKNOWN. 이 작업은 지정된 세 drafts 폴더의 item/plan/publish/STATUS만 작성했다. source-exact.js, source-runtime-bank.json, 원본 시험지·기존 자산·다른 패키지에는 쓰지 않았다. Q05/Q12/Q13/Q14/Q16/Q20 기존 그림/PNG, 이전 패키지, paused H1 작업은 범위 밖이며 보존한다.

계약 후보: set-diagram-figure-v1 (확률 면적이 아닌 추상 Venn). Plan/publish는 초안이며 production input functions, integrated checks, math review, official render/SVG/PNG, visual review, CI/publication, handoff, remote reads/writes, commit/push/PR: NOT_RUN. 렌더 크기를 측정하지 않아 publish.size는 기록하지 않았다. DRAFT_ONLY/NOT_READY를 READY 또는 검수 PASS로 확대하지 않는다.
