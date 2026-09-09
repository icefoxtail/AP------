# GOLD #3 visual asset triage

| qid | asset | status | observation |
|---:|---|---|---|
| 12 | `staging/extraction-v3/assets/images/20_매산고_2학기_기말_고1_기출/q012_visual.png` | FAIL | crop is a successful PNG decode but clips the right side of the printed adjacency diagram; source page remains the authority |
| 19 | `staging/extraction-v3/assets/images/20_매산고_2학기_기말_고1_기출/q019_visual.png` | FAIL | crop is a successful PNG decode but clips the lower part of the hand-drawn graph; source page remains the authority |
| 12 solution | `q12-solution.svg` | DIAGNOSTIC_ONLY | fresh Python-generated explanatory reduction; independent V2/artifact review unavailable |
| 14 solution | `q14-solution.svg` | DIAGNOSTIC_ONLY | fresh Python-generated sampled curves; independent V2/artifact review unavailable |
| 17 solution | `q17-solution.svg` | DIAGNOSTIC_ONLY | fresh Python-generated sampled hyperbola; independent V2/artifact review unavailable |
| 19 solution | `q19-solution.svg` | DIAGNOSTIC_ONLY | fresh Python-generated representative graph; independent V2/artifact review unavailable |

The crop failures are preserved in the final closure and are not promoted or reused as evidence of a clean visual asset.
