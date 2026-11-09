# 23 제일고 고2 확률과통계 Q19 — local draft only

Scope: this four-file draft set only; owner UNKNOWN. Source archive, protected Q05/12/13/14/16/20 figures, earlier packages, and the paused 20 매산여고 H1 task remain untouched. No remote write, renderer, handoff, or engine change.

Source pin: main 7563515ad7ea796f7c9f26881afe7f8f267f1ddf; archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js; blob 7ed637a7cb8f81e06b1fddd59e348be822e5e924; source-exact.js SHA-256 058e334eeffebe2f96b1ce581084881fc1df245201039b86c312d6b8148d69c3.

Figure rationale: a qualitative width-axis view separates the two one-factor effects without inventing numeric intervals. It shows only that higher confidence at fixed n increases width, and smaller n at fixed confidence increases width. For the combined opposing changes in ㄷ, magnitudes are absent, so the direction cannot be determined.

Status: DRAFT_ONLY / NOT_READY. JSON syntax check pending. Input-only checker: NOT_RUN (dedicated checker owns integrated tests). Independent math review: NOT_RUN. Visual review: NOT_RUN. Render: NOT_RUN. CI: NOT_RUN. Publication: NOT_RUN. Handoff: NOT_RUN.

## item.json sourceQuote (verbatim)
조건 정리: 신뢰구간의 길이 $b-a$는 $2z\dfrac{\sigma}{\sqrt{n}}$ 꼴이다.

## Source content (verbatim)
표준편차가 $\sigma$인 정규분포를 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 구한 모평균 $m$에 대한 신뢰도 $\alpha\%$의 신뢰구간은 $a\le m\le b$이다. 보기에서 옳은 것만을 있는 대로 고른 것은? (4.3점)\n<div class="question-table-wrap"><table class="question-table"><tbody><tr><td>ㄱ. $n$의 값이 일정하고 $\alpha$의 값이 커지면, $b-a$의 값은 커진다.</td></tr><tr><td>ㄴ. $n$의 값이 작아지고 $\alpha$의 값이 커지면, $b-a$의 값은 작아진다.</td></tr><tr><td>ㄷ. $n$의 값이 작아지고 $\alpha$의 값이 작아지면, $b-a$의 값은 작아진다.</td></tr></tbody></table></div>

## Source answer (verbatim)
①

## Source solution (verbatim)
[키포인트] 신뢰구간의 길이는 신뢰수준에 해당하는 $z$값에 비례하고, 표본 크기의 제곱근에 반비례한다.\n조건 정리: 신뢰구간의 길이 $b-a$는 $2z\dfrac{\sigma}{\sqrt{n}}$ 꼴이다.\n정석 풀이: ㄱ은 $n$이 일정할 때 신뢰도 $\alpha$가 커지면 $z$값이 커져 신뢰구간의 길이도 커지므로 참이다. ㄴ은 $n$이 작아지면 길이가 커지고 $\alpha$가 커져도 길이가 커지므로 작아진다는 말은 거짓이다. ㄷ은 $n$이 작아지면 길이는 커지지만 $\alpha$가 작아지면 길이는 작아지므로 두 변화가 동시에 있을 때 반드시 작아진다고 할 수 없어 거짓이다.\n따라서 정답은 ①이다.


Correction record (2026-11-09): The actual expandNumberLineFigure check failed with NUMBER_LINE_POINTS_INVALID. Static contract inspection of number-line-v1.mjs lines 470-472 identified invalid uppercase symbolic IDs and forbidden name fields: value-free symbol IDs must match /^-?[a-z]$/ and symbol points cannot include name, hideName, showValue, or valueSide. The original four files are preserved byte-for-byte in preparation-23-jeil-stat/history/q19-symbol-ids-initial/. This correction changes only the symbolic IDs and their order/span references to p, q, r, s; removes the forbidden name fields; and adds the p/q/r/s legend to plan and publish text. No numeric values were invented. Tests and recheck: NOT_RUN. No PASS claim; DRAFT_ONLY / NOT_READY.
