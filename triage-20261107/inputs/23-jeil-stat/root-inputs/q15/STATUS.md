# 23 제일고 고2 확률과통계 Q15 — local draft only

Scope: this four-file draft set only; owner UNKNOWN. Source archive, protected Q05/12/13/14/16/20 figures, earlier packages, and the paused 20 매산여고 H1 task remain untouched. No remote write, renderer, handoff, or engine change.

Source pin: main 7563515ad7ea796f7c9f26881afe7f8f267f1ddf; archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js; blob 7ed637a7cb8f81e06b1fddd59e348be822e5e924; source-exact.js SHA-256 058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3.

Figure rationale: a width-scale comparison makes the inverse-square-root relation easier to understand. The axis is width w only. The original does not give the unknown population-mean interval center; the figure neither places m at 0 nor claims the two samples share an observed mean. Values 10 and 6 are original lengths; n=225 is derived by 6/10=9/√n.

Status: DRAFT_ONLY / NOT_READY. JSON syntax check pending. Input-only checker: NOT_RUN (dedicated checker owns integrated tests). Independent math review: NOT_RUN. Visual review: NOT_RUN. Render: NOT_RUN. CI: NOT_RUN. Publication: NOT_RUN. Handoff: NOT_RUN.

## item.json sourceQuote (verbatim)
같은 신뢰도와 같은 모집단 표준편차에서는 $L\propto\dfrac{1}{\sqrt{n}}$이다.

## Source content (verbatim)
정규분포를 따르는 모집단에서 크기가 81인 표본을 임의추출하여 모평균을 추정하였더니 신뢰구간의 길이가 10이었다. 같은 신뢰도로 모평균을 추정할 때, 신뢰구간의 길이가 6이 되게 하려면 표본의 크기가 얼마여야 하는지 구하면? (4.1점)

## Source answer (verbatim)
⑤

## Source solution (verbatim)
[키포인트] 같은 신뢰도에서는 신뢰구간의 길이가 $\dfrac{1}{\sqrt{n}}$에 비례한다.\n조건 정리: 처음 표본 크기는 81이고, 신뢰구간의 길이는 10이다. 새 신뢰구간의 길이는 6이어야 한다.\n정석 풀이: 같은 신뢰도와 같은 모집단 표준편차에서는 $L\propto\dfrac{1}{\sqrt{n}}$이다. 따라서 $\dfrac{6}{10}=\dfrac{\sqrt{81}}{\sqrt{n}}=\dfrac{9}{\sqrt{n}}$이다. 양변을 정리하면 $\sqrt{n}=15$, $n=225$이다.\n따라서 정답은 ⑤이다.


Correction record (2026-11-09): The first actual expandNumberLineFigure input check failed with NUMBER_LINE_ROW_LABEL_INVALID because both row labels exceeded the number-line contract limit of six characters. The original four files are preserved byte-for-byte in preparation-23-jeil-stat/history/q15-row-label-initial/. Only plan.json row labels changed to n=81 and n=225; interval values, caption, and mathematical content are unchanged. Rerun: NOT_RUN per instruction. Draft remains DRAFT_ONLY / NOT_READY.
