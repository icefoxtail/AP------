# M3 curriculum crosswalk evidence

## Denominator and pairing

The M3 semantic denominator is 181 RPM L4 rows: 2015 M3-1 54, 2015 M3-2 38, 2022 M3-1 50, and 2022 M3-2 39. The audit pairs the 2015 and 2022 curriculum paths by mathematical operation and learning objective, not by matching labels. It records 173 `BOTH_PRESENT`, 7 `LEGIT_CURRICULUM_DIFFERENCE`, and 1 `NEEDS_EVIDENCE` rows. No curriculum-backed RPM omission was confirmed in M3.

The semantic aliases for quadratic functions account for the 2015/2022 L3 reorganization: the 2015 definition/value/basic-graph leaves pair with the 2022 `y=ax²` graph leaf; graph reading/reconstruction and vertex/axis leaves pair with the corresponding 2022 graph, vertex, and equation-condition leaves. For statistics, deviation, variance, standard deviation, comparing distributions, scatter plots, and correlation are paired by their mathematical objective across changed L3/L4 splits.

## Confirmed curriculum placement differences

- **Quadratic maximum/minimum:** the 2015 curriculum overview says this topic moved from middle grade 3 to high school. The 2022 course standards again include quadratic-function maximum/minimum in middle-school achievement standard `[9수02-22]`. Therefore the 2015 RPM row is retained as `RPM_EXTENDED_CANDIDATE` with `defaultSelectable=false`; the 2022 path remains in scope. The existing extrema templates were not used because their active internal skeletons cover bounded-interval endpoint comparison or contextual modelling, not the ordinary all-real-domain vertex case.
- **Representative values:** 2015 M3 includes mean/median/mode and representative-value comparison. The 2022 M3 RPM path places those concepts in M1-2, outside the M3 denominator. M3 rows therefore record a curriculum placement difference, not an M3 taxonomy omission.
- **Boxplots:** the 2022 curriculum includes boxplots in middle school (`[9수04-08]`); the 2015 middle-school statistics scope does not contain boxplots. The three 2022 boxplot rows are preserved as a legitimate curriculum difference.
- **Outlier interpretation:** the 2022 RPM row is already marked `RPM_EXTENDED_CANDIDATE` and not default-selectable. The reviewed official standards establish boxplot use but did not establish a separate middle-school outlier-interpretation L4. This one row remains `NEEDS_EVIDENCE` and `RPM_ONLY`.

## Primary sources

- [2015 개정 교육과정 총론 및 각론 확정·발표 — 교육부](https://www.moe.go.kr/boardCnts/view.do?boardID=294&boardSeq=60753&lev=0&m=0204). This page hosts the official 2015 mathematics curriculum documents.
- [기획 2015 개정 교육과정으로 미래를 꿈꾸다 — 교육부](https://www.moe.go.kr/upload/brochureBoard/1/2016/12/1482218322461_335199041259440.pdf). The mathematics change summary identifies quadratic maximum/minimum as moved from middle 3 to high 1.
- [2022 개정 교육과정 수학과 각론 — 교육부](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0). The audited achievement standards include `[9수02-22]`, `[9수04-01]`, and `[9수04-08]`.
- [2022 개정 교육과정 확정·발표 — 교육부](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=93459&lev=0&m=0204). The announcement describes the revised middle-school data domain, including boxplots.
- `docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/02_2022/MIDDLE/M1-2.md` places mean, median, mode, representative-value selection, and representative-value comparison in 2022 M1-2.

The per-row curriculum relation, exact RPM tuple, original/final crosswalk mapping, GLOBAL ACTIVE PT/TPL definitions and internal skeletons, supporting question UIDs/counts, exact binding state, and row-specific evidence are recorded in `semantic-audit-ledger.json`. The complete GLOBAL ACTIVE baseline is recorded in `global-active-registry-snapshot.json`. Every row's compiled resolver result and active-row runtime projection parity are recorded in `resolver-runtime-validation.json`.
