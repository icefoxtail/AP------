# B01 candidate 0005

- **draftCandidateId:** ALITE-B01-2025PALMA-0005
- **sourceQid:** 19
- **source identity:** archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js; Git blob SHA-1 4cfce909c023e5c4df4a759945c8cc3e0a63ec76; file SHA-256 1C7C2C331464AA214331D844E32F9378C86654B1B8E495C8C3CDF759B26BEAEF
- **source figure readback:** directly opened q19.png at original resolution; source asset SHA-256 716D7AA89291167E880C6C109B792056D3A5739CB0A4CF25DFB75DA3BFB5B479
- **CREATE disposition:** ACCEPT; draft only; extension taxonomy candidate remains unreviewed

## Student prompt

좌표평면에서 곡선
\[
C_0:x^2+y^2=16,\qquad
C_1:(x+2)^2+y^2=4\ (y\le0),\qquad
C_2:(x-2)^2+y^2=4\ (y\ge0)
\]
의 합집합과 직선 \(l_m:y=mx\)가 서로 다른 다섯 점에서 만나도록 하는 실수 \(m\)의 범위는?

## Choices

① \(m<0\)  
② \(m\ge0\)  
③ \(m>0\)  
④ \(m\ne0\)  
⑤ 모든 실수 \(m\)

## Exact answer

③ — \(m>0\)

## Detailed student solution

\(C_0\)와 \(y=mx\)의 교점은 \(x^2(1+m^2)=16\)을 만족하므로 항상 서로 다른 두 점이다.

\(C_1\)에 대입하면
\[
(x+2)^2+m^2x^2=4
\Longleftrightarrow x\bigl((1+m^2)x+4\bigr)=0.
\]
교점 후보는 \(O=(0,0)\)와 \(\left(-4/(1+m^2),-4m/(1+m^2)\right)\)이다. 두 번째 점은 \(m\ge0\)일 때 \(C_1\)의 아래쪽 반원에 속한다.

\(C_2\)에 대입하면
\[
(x-2)^2+m^2x^2=4
\Longleftrightarrow x\bigl((1+m^2)x-4\bigr)=0.
\]
교점 후보는 \(O\)와 \(\left(4/(1+m^2),4m/(1+m^2)\right)\)이다. 두 번째 점은 \(m\ge0\)일 때 \(C_2\)의 위쪽 반원에 속한다.

\(m>0\)이면 두 반원에서 원점이 아닌 교점이 하나씩 더 생긴다. 이 두 점은 \(C_0\) 위의 교점과 다르다. 실제로 각각 원점으로부터의 거리는 \(4/\sqrt{1+m^2}<4\)이고, \(C_0\) 위의 점은 원점에서 거리가 \(4\)이기 때문이다. 두 반원의 공통 교점 \(O\)는 한 번만 세므로 서로 다른 교점은 \(2+1+1+1=5\)개다. \(m<0\)이면 각 반원에서 원점이 아닌 후보가 지정된 반원에 속하지 않아 \(O\)만 남으므로 전체는 세 점이다. \(m=0\)에서는 반원의 끝점 \((-4,0),(4,0)\)가 각각 \(C_0\)의 교점과 겹치고 두 반원의 공통점은 \(O\)이므로 역시 세 점이다. 따라서 다섯 점이 되는 범위는 \(m>0\)이다. 정답은 ③이다.

## Primary curriculum and RPM lookup

- **Primary L1/L2:** 도형의 방정식 → 원의 방정식; target scope 2022 공통수학2, H1.
- **Exact comparator path:** locked RPM Primary v1.0, 공통수학2: L1-1 → L2-1.3 → L3-1.3.2 원과 직선 → L4-1.3.2.1 교점 개수.
- **L4 disposition:** the exact L4 covers circle-line intersection counts but does not separately encode a union of a full circle and two half-plane-restricted arcs with shared endpoints and distinct-point deduplication. Use **EXT_L4_CANDIDATE**, proposed ID EXT-H1-2022-C2-CIRCLE-LINE-MULTI-ARC-DISTINCT-COUNT-001; not canonical.
- **Status:** parent L3 and comparator L4 are CANONICAL_DRAFT; extension DISCOVERED_UNREVIEWED; canonicalPromoted=false; consumerSelectable=false.
- **CrossConcept:** none. **Condition:** COND_RANGE; half-plane restrictions are explicit. **IntegrationPattern:** CASE_BRANCH.

## Blueprint and duplicate disposition

- **Blueprint / decisive step:** count a line's distinct intersections with a full circle and two half-circle arcs sharing an endpoint, by checking arc membership and deduplicating shared points.
- **Use of source visual:** source q19 PNG was opened before deriving the intended circle/arc topology; this draft restates all loci algebraically and does not estimate coordinates from pixels.
- **Difference from source q19:** source line passes through the left arc's center and needs a strict upper slope bound from tangency. Here the line passes through the arcs' shared endpoint; sign membership and endpoint overlap determine the result, with no tangency threshold.
- **Duplicate notes:** scaling the source, changing only the requested count, or changing only slope symbols is DUPLICATE. The shared-endpoint pivot and two-arc branch/deduplication graph is the accepted extension candidate.

## Misconception-based distractors

- ① reverses which half-plane branch belongs to each semicircle.
- ② includes \(m=0\), where outer-circle and arc endpoints overlap and the distinct count is only three.
- ④ assumes both nonzero slope signs keep the extra point on both arcs.
- ⑤ ignores the half-plane restrictions and treats the two full supporting circles as included.
- ③ is the only range producing five distinct points.

## Difficulty and answer position

- **Target:** level 상, bucket 4. **Author-estimated actual:** level 상, bucket 4; confidence medium, boundary NONE.
- **Rationale:** three loci, branch membership, endpoint overlap, and distinct-point counting must be coordinated.
- **Intended answer position:** ③. No order lock; position selected after the mathematics was fixed as part of the batch spread.

## Visual and review status

Visual necessary: no; equations and half-plane restrictions fully specify every locus. Optional spec: sketch the radius-4 outer circle, lower semicircle centered at \((-2,0)\), upper semicircle centered at \((2,0)\), shared endpoint \(O\), and a line through \(O\). Candidate asset path/SHA: none/not applicable; source image is provenance only and not reused. Render: NOT_RENDERED. Author self-check only; independent math, Meta, render, and extension taxonomy review: NOT_TESTED.
