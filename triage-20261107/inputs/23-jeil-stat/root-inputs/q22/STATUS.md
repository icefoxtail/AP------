# 23 제일고 고2 확률과통계 Q22 — local draft only

Scope: this four-file draft set only; owner UNKNOWN. Source archive, protected Q05/12/13/14/16/20 figures, earlier packages, and the paused 20 매산여고 H1 task remain untouched. No remote write, renderer, handoff, or engine change.

Source pin: main 7563515ad7ea796f7c9f26881afe7f8f267f1ddf; archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js; blob 7ed637a7cb8f81e06b1fddd59e348be822e5e924; source-exact.js SHA-256 058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3.

Figure rationale and provenance: both intervals are actual intervals on the same unknown-mean m axis and share the actual sample-mean center 30 derived from the given 95% interval. The exact conversions are 22.16=554/25, 37.84=946/25, 19.68=492/25, 40.32=1008/25; no rounding. This actual center is distinct from Q15's width-only schematic comparison.

Status: DRAFT_ONLY / NOT_READY. JSON syntax: PASS (JSON.parse of item.json, plan.json, publish.json). Input-only checker: NOT_RUN (dedicated checker owns integrated tests). Independent math review: NOT_RUN. Visual review: NOT_RUN. Render: NOT_RUN. CI: NOT_RUN. Publication: NOT_RUN. Handoff: NOT_RUN.

## item.json sourceQuote (verbatim)
조건 정리: 95% 신뢰구간의 중심은 $\dfrac{22.16+37.84}{2}=30$이고 반길이는 $37.84-30=7.84$이다.

## Source content (verbatim)
[서술형 2] 표준편차가 $\sigma$인 정규분포를 따르는 모집단에서 크기가 $n$인 표본을 임의 추출하여 추정한 모평균 $m$에 대한 신뢰도 95%의 신뢰구간이 $22.16\le m\le37.84$이다. 같은 표본을 이용하여 추정한 모평균 $m$의 신뢰도 99%의 신뢰구간을 구하는 과정을 서술하시오. (단, $P(|Z|\le1.96)=0.95$, $P(|Z|\le2.58)=0.99$) (7점, 부분 점수 있음.)

## Source answer (verbatim)
$19.68\le m\le40.32$

## Source solution (verbatim)
[키포인트] 같은 표본에서는 표준오차가 같으므로, 95% 신뢰구간의 반길이로 표준오차를 구한 뒤 99% 반길이를 계산한다.\n조건 정리: 95% 신뢰구간의 중심은 $\dfrac{22.16+37.84}{2}=30$이고 반길이는 $37.84-30=7.84$이다.\n정석 풀이: 95% 신뢰구간에서 $1.96\times\text{표준오차}=7.84$이므로 표준오차는 $\dfrac{7.84}{1.96}=4$이다. 신뢰도 99%에서는 $z=2.58$이므로 반길이는 $2.58\times4=10.32$이다. 따라서 99% 신뢰구간은 $30-10.32\le m\le30+10.32$, 즉 $19.68\le m\le40.32$이다.\n따라서 구하는 신뢰구간은 $19.68\le m\le40.32$이다.
