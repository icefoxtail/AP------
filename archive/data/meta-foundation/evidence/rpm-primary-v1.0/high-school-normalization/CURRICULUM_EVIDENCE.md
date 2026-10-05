# High-school RPM curriculum evidence

## Authority and extracted source files

- 2015 official mathematics curriculum: MOE, *교육부 고시 제2015-74호 초중등학교 교육과정 총론 및 교과 교육과정 고시*, mathematics supplement (별책 8), official announcement and attachments: https://www.moe.go.kr/boardCnts/view.do?boardID=141&boardSeq=60747&lev=0&m=0404
- 2022 official mathematics curriculum: MOE, *교육부 고시 제2022-33호 초중등학교 교육과정 총론 및 각론 고시*, mathematics supplement (별책 8), official announcement and attachments: https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0
- Local extraction inputs used for row-level inspection: `apmath-moe-2015-math.pdf` (1,267,287 bytes) and `apmath-moe-2022-math.hwp` (2,094,592 bytes) under the machine's temporary directory. These are the MOE-hosted source attachments, not repository authority.

## Confirmed taxonomy omissions in the 2015 high-school views

### Probability and statistics

The 2015 mathematics supplement's statistics achievement standards explicitly include both (a) estimating a population proportion from the relation between sample and population proportions and (b) understanding hypothesis testing. In the RPM master and 2015 `확률과통계.md`, the statistical-estimation branch ended at population-mean estimation: neither population-proportion estimation nor hypothesis testing had an L3/L4 path. The 2022 supplement also explicitly includes population-proportion estimation in `[12확통03-06]` and `[12확통03-07]`; the 2022 RPM already has `모비율 추정 → 표본비율 / 신뢰구간`.

Disposition: restore 2015 `모비율 추정 → 표본비율 / 신뢰구간` as BOTH_PRESENT, and restore 2015 `가설검정 → 가설검정의 뜻` as a 2015 RPM omission. The 2022 general `확률과통계` standards have no hypothesis-testing standard; the 2022 supplement places it in the separate `실용 통계` elective (`[12실통03-04]`), so the course-pair relation for that row is a legitimate curriculum difference. No GLOBAL ACTIVE template specifically covers population-proportion estimation or hypothesis testing; those restored rows remain RPM_ONLY.

The 2015 and 2022 supplements both list `큰 수의 법칙` among statistics terms. Neither course's current RPM taxonomy has a matching L3/L4 path. Because the term-list evidence does not establish a distinct achievement standard or repeated RPM question pattern, it is recorded as NEEDS_EVIDENCE rather than used to create a speculative L3/L4.

### Geometry

The 2015 mathematics supplement's plane-vector achievement standards explicitly state that vectors are used to obtain equations of lines and circles in the coordinate plane. The 2015 RPM `평면벡터의 성분과 내적 → 도형에의 활용` branch contained only `수직·평행` and `거리·넓이`, so it omitted the line- and circle-equation paths. Restore L4 leaves `직선의 방정식` and `원의 방정식` there. The 2015 line-equation leaf has a semantic counterpart in the 2022 vector-based line leaves; the circle-equation leaf is specific to the 2015 `기하` course scope, since 2022 places the ordinary circle equation in `공통수학2` and its `기하` vector standards focus on lines, planes, and spheres.

The 2015 supplement explicitly covers general line/conic relative position as well as tangency. The 2022 `기하` supplement limits conic-line relations to tangency and specifies tangent equations via the quadratic discriminant (`[12기하01-04]`). Therefore, 2015-only non-tangent intersection-count and relative-position leaves are legitimate curriculum differences, not 2022 RPM omissions. 2015/2022 tangent content is semantically paired despite the 2022 taxonomy splitting it by conic type and tangent data.

The 2022 supplement adds vector equations for lines in the coordinate plane and space (`[12기하03-04]`) and vector equations for planes and spheres in space (`[12기하03-05]`). These 2022 paths are legitimate additions to the 2015 course; the 2015 course's shared plane-line-equation path is restored separately.

## Other paired-curriculum evidence

- 2022 Common Mathematics 1 standard `[10공수1-04-02]` explicitly adds matrix addition, subtraction, scalar multiplication, and multiplication for matrices with at most two rows and columns. The six 2022 H1 matrix leaves are legitimate curriculum differences; the 2015 general high-school curriculum has no corresponding core-course matrix unit.
- 2015 calculus standards include Rolle's theorem and the mean value theorem. The 2022 Calculus I curriculum retains both, while its RPM separates theorem conditions, applications, and function properties. These are semantic counterparts, not curriculum omissions.
- 2015 definite-integral calculation/property leaves and 2022 Calculus I placement are recorded as a course reorganization where the 2022 Calculus II scope no longer carries those leaves.

## Remaining source-review item

- `큰 수의 법칙` appears in the official statistics terminology lists for both curricula but has no distinct RPM path in either year. Before repairing, inspect the relevant RPM source pages or question evidence to determine whether it is a standalone teachable/testable L3/L4 or is represented within the existing probability-distribution leaves.
