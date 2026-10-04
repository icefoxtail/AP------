# Visual Negative Regression Fixtures — 2026-09-28

이 폴더는 post-main SVG 감사에서 실제 false PASS로 확인된 **불량 SVG의 frozen snapshot**이다.
학생용 시험지 JS는 이 경로를 참조하면 안 된다. production `archive/assets/images/...` 파일은 수리된 정상본을 유지하고,
Golden/Negative Sample calibration과 verifier regression에서만 이 폴더를 사용한다.

| fixture | 원 production 경로 | frozen blob | 실패축 |
|---|---|---|---|
| `01_24_신흥중_2학기_중간_중2_수학_q5_ANGLE_LABEL_OWNER_BINDING_FAIL.svg` | `archive/assets/images/24_신흥중_2학기_중간_중2_수학/q5-solution.svg` | `cd61fa5a419fb15d7558bbf0c202906995ad11d4` | 20°/40° angle owner binding |
| `02_25_삼산중_2학기_기말_중2_기출_q12_LABEL_COLLISION_FAIL.svg` | `archive/assets/images/25_삼산중_2학기_기말_중2_기출/q12-solution.svg` | `f342721bbc68260acf2d9d791cef4ae8d154c8e1` | E/F point label ↔ side-length label collision |
| `03_25_삼산중_2학기_중간_중2_수학_q13_ANGLE_LABEL_OWNER_BINDING_FAIL.svg` | `archive/assets/images/25_삼산중_2학기_중간_중2_수학/q13-solution.svg` | `9fe608369744ee90b21fd5702a0e56e1971f2a7e` | D의 35°/10° owner binding |
| `04_25_삼산중_2학기_중간_중2_수학_q24_COORDINATE_SEMANTIC_FAIL.svg` | `archive/assets/images/25_삼산중_2학기_중간_중2_수학/q24-solution.svg` | `1cc25a0229fe0e57205e81f10ddfd93a9bc93d5e` | circumcenter/perpendicular-bisector coordinate semantic parity |

## 사용 규칙

- Negative Sample authority는 **이 frozen fixture**다.
- 현재 production SVG를 실패 샘플로 간주하거나 다시 깨진 상태로 되돌리지 않는다.
- fixture는 의도적으로 결함을 보존하므로 production asset copier/promotion 대상에서 제외한다.
- 동형 결함을 검수할 때는 fixture와 현재 정상 production을 함께 비교해 **FAIL → repaired PASS** 차이를 확인한다.
