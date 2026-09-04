# Browser render evidence — 고1 「도형의 이동」 local production

- 검수일: 2026-09-04
- solution SVG review page: 81 figure rows / 81 images / broken 0 / horizontal overflow false
- 직접 spot check: H15 21 효천고 q19, H15 23 매산여고 q13, H22 25 금당고 q5/q13, H22 25 효천고 q23

## Archive engine representative matrix

| 시험지 | mode | production question count | answer entries / max | images | broken | MathJax | error | overflow |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 21 효천고 2중간 | exam | 22 | 0 / 0 | 6 | 0 | 280 | false | false |
| 21 효천고 2중간 | sol | 22 | 0 / 0 | 10 | 0 | 528 | false | false |
| 21 효천고 2중간 | ans | 22 | 22 / 22 | 0 | 0 | 2 | false | false |
| 23 매산여고 2중간 | exam | 23 | 0 / 0 | 6 | 0 | 470 | false | false |
| 23 매산여고 2중간 | sol | 23 | 0 / 0 | 7 | 0 | 415 | false | false |
| 23 매산여고 2중간 | ans | 23 | 23 / 23 | 0 | 0 | 6 | false | false |
| 25 효천고 2중간 | exam | 23 | 0 / 0 | 8 | 0 | 538 | false | false |
| 25 효천고 2중간 | sol | 23 | 0 / 0 | 18 | 0 | 529 | false | false |
| 25 효천고 2중간 | ans | 23 | 23 / 23 | 0 | 0 | 16 | false | false |

H22 25 효천고 solution은 q23와 long-solution continuation까지 실제 AX tree에 표시되었다. H15 21 효천고 solution은 q19의 `[정답불가]` 및 고유 교점 없음 해설을 포함한다.

정상 보존 확인: `25_순천여고_2학기_중간_고1_공통수학2` q7/q15 solution SVG는 `git diff`가 없다.
