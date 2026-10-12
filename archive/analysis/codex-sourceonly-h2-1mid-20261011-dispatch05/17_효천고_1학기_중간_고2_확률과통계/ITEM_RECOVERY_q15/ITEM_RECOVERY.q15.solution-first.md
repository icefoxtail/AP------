# ITEM_RECOVERY q15 — solution-first candidate (PRE-SOURCE-EDIT)

- examUid: `17_효천고_1학기_중간_고2_확률과통계`
- qid: 15
- source SHA-256 at authoring: `72E6D6946020860F19692A6EBCDDCA60FB710C146B494FD87D11EF8E3117FCD4`
- replacement role: 고2 확률과 통계, 이항정리에서 이항계수 전체합·교대합·홀수/짝수 항 합을 판정하는 4-진술 객관식
- source disposition: TRUE_HOLD_SOURCE_TRUTH_BLOCKED; 원 q15의 ㄱ은 실제로 `C(n,0)`에서 끝나 거짓이고 나머지 ㄴ·ㄷ·ㄹ은 참이며, 원 보기에는 참인 집합 `{ㄴ, ㄷ, ㄹ}`이 없다. 근거는 upstream HOLD ledger를 계승한 판단이며 이 후보는 원문 복원/수정이 아니라 direct replacement다.

## Candidate student stem

다음 등식에서 옳은 것을 모두 고른 것은? (단, $n$은 1 이상의 자연수이다.)

ㄱ. $\displaystyle \sum_{k=0}^{n} {}_n\mathrm{C}_k=2^n$

ㄴ. $\displaystyle \sum_{k=0}^{n}(-1)^k{}_n\mathrm{C}_k=2^n$

ㄷ. $\displaystyle \log_2\left({}_8\mathrm{C}_1+{}_8\mathrm{C}_3+{}_8\mathrm{C}_5+{}_8\mathrm{C}_7\right)=7$

ㄹ. $\displaystyle {}_8\mathrm{C}_0+{}_8\mathrm{C}_2+{}_8\mathrm{C}_4+{}_8\mathrm{C}_6+{}_8\mathrm{C}_8=2^7$

## Solution-first proof and canonical answer

ㄱ. 이항정리에서 $(1+1)^n=\sum_{k=0}^{n}{}_n\mathrm{C}_k$이므로 합은 $2^n$이다. 참.

ㄴ. $(1-1)^n=\sum_{k=0}^{n}(-1)^k{}_n\mathrm{C}_k=0$이고 $n\ge1$이므로 제시된 $2^n$과 다르다. 거짓.

ㄷ. 홀수 번째 이항계수의 합을 $S_o$, 짝수 번째 이항계수의 합을 $S_e$라 하면
$S_o+S_e=2^8=256$,
$S_e-S_o=(1-1)^8=0$이다.
따라서 $S_o=128=2^7$이고 로그값은 $7$이다. 참.

ㄹ. 위에서 $S_e=128=2^7$이므로 등식은 참이다.

따라서 옳은 것은 ㄱ, ㄷ, ㄹ이고 canonical answer는 `④`이다.

## Candidate choices and error paths

1. `ㄱ, ㄷ` — 홀수 계수 합의 로그는 맞게 판정하지만 ㄹ의 짝수 계수 합을 놓침.
2. `ㄱ, ㄴ, ㄷ` — 교대합을 $2^n$으로 오인하고 ㄹ도 누락.
3. `ㄱ, ㄴ, ㄷ, ㄹ` — ㄴ에서 $(1-1)^n=0$ 대신 전체 계수 합처럼 계산.
4. `ㄱ, ㄷ, ㄹ` — 정답.
5. `ㄴ, ㄷ, ㄹ` — ㄴ을 참으로 오인하고 ㄱ을 누락.

Choices are five, distinct; only one equals the proven true set. No arithmetic-neighbor filler is used. Answer position ④ is not the default ③.

## Intended student solution

ㄱ. 이항정리에서 $(1+1)^n=\sum_{k=0}^{n}{}_n\mathrm{C}_k$이므로 합은 $2^n$이다. 참이다.

ㄴ. $(1-1)^n=\sum_{k=0}^{n}(-1)^k{}_n\mathrm{C}_k=0$이다. 따라서 제시된 $2^n$과 같지 않으므로 거짓이다.

ㄷ. 홀수 번째 이항계수의 합을 $S_o$, 짝수 번째 이항계수의 합을 $S_e$라 하자.

$(1+1)^8=S_e+S_o=256$,
$(1-1)^8=S_e-S_o=0$이므로
$S_o=128=2^7$이다.

따라서 $\log_2(S_o)=7$이므로 참이다.

ㄹ. $S_e+S_o=256$, $S_e-S_o=0$에서 $S_e=128=2^7$이다. 따라서 참이다.

그러므로 옳은 것은 ㄱ, ㄷ, ㄹ이고 정답은 ④이다.

## Visual decision

Problem visual: EXEMPT — all required values and relationships are stated symbolically; no spatial/table/graph relation is used.
Solution visual: EXEMPT — the two substitutions $(1+1)^8$ and $(1-1)^8$ directly show the parity-sum derivation; a diagram would duplicate the symbolic proof.

## Source modification status

NONE at this checkpoint. This file freezes candidate reasoning before any source JS edit.
