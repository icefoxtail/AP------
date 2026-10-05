# Visual Negative Regression Fixtures — 2026-09-29

이번 세트는 `e8a815d4...` 이후 새로 들어온 solution SVG 53개를 전수 CODE-FIRST 감사한 결과 발견한 **false PASS 5건의 수리 전 bytes**를 고정한다.

- 감사 결과: 48 PASS / REPAIR_REQUIRED 5
- 수리 production commit: `0efb9a41c445ac31dd4444b7daaca250e0eacca7`
- 현재 production 대응 SVG는 모두 수리본이다.
- 아래 frozen SVG는 **학습용 실패 샘플**이며 production으로 복원하지 않는다.

| fixture | 원 production 경로 | frozen bad blob | repaired production blob | 실패축 | 실제 문제 |
|---|---|---|---|---|---|
| `01_25_왕운중_2학기_중간_중2_수학_q7_MISSING_OWNER_RAY_FAIL.svg` | `archive/assets/images/25_왕운중_2학기_중간_중2_수학/q7-solution.svg` | `b8a488b8dd9373b7d0866450bcba6c79391ba9e4` | `91e1949f09503c0a8b3fcdd4f0e16eb6394d6232` | MISSING_OWNER_RAY | △BDC와 B/C의 30°를 설명하면서 BC 선분이 artifact에 없음 |
| `02_25_왕운중_2학기_중간_중2_수학_q21_ANGLE_LABEL_OWNER_BINDING_FAIL.svg` | `archive/assets/images/25_왕운중_2학기_중간_중2_수학/q21-solution.svg` | `88fd27642b3319c213cfa3f5a3c2502f69792bec` | `08ec24d04e8a4e1fd6d74434d81bb05a17d852d3` | ANGLE_LABEL_OWNER_BINDING | x°와 58°가 실제 owner wedge 밖/반대쪽에 배치 |
| `03_25_왕운중_2학기_중간_중2_수학_q24_COORDINATE_SEMANTIC_FAIL.svg` | `archive/assets/images/25_왕운중_2학기_중간_중2_수학/q24-solution.svg` | `24394d140f627ff52c5d9ad0154df958040c7e50` | `dead4541c67ee70b006000d5e8788bb4f5238c1f` | COORDINATE_SEMANTIC_PARITY | D/E가 AB/AC 위 수선의 발이 아니고 MD/ME 수직 조건도 불성립 |
| `04_24_향림중_2학기_기말_중2_기출_q8_COORDINATE_SEMANTIC_FAIL.svg` | `archive/assets/images/24_향림중_2학기_기말_중2_기출/q8-solution.svg` | `d6b49292b924e3f2a57c9f775b0030a59f919407` | `613086a8c39cb65879fa3cbfa5b35f618c9682f4` | COORDINATE_SEMANTIC_PARITY | AD/BE 각 이등분선 + DE∥AB 조건 중 BE 이등분선이 실제 좌표에서 불성립 |
| `05_24_향림중_2학기_기말_중2_기출_q12_LABEL_OWNER_BINDING_FAIL.svg` | `archive/assets/images/24_향림중_2학기_기말_중2_기출/q12-solution.svg` | `eb167f54b698bdb66f926f740432db0e36d26019` | `f784c0866bb1a5441cd4b243e9f0d352e1df024d` | LABEL_OWNER_BINDING | CG=10 라벨이 실제 CG가 아닌 다른 중선 부근에 붙음 |

## 이 세트에서 고정할 검수 질문

- **Owner ray가 실제로 존재하는가?** 각도값이 맞아도 두 ray 중 하나가 없으면 FAIL.
- **각도 라벨이 실제 wedge 안에 있는가?** vertex와 두 ray를 기준으로 귀속을 확인한다.
- **길이 라벨이 실제 ownerSegment에 붙어 있는가?** 다른 선분에 더 가까우면 FAIL.
- **수선의 발/중점/중심이 실제 좌표 조건을 만족하는가?** 텍스트 설명만 맞으면 부족하다.
- **여러 조건이 동시에 성립하는가?** 각 이등분선 + 평행, 중점 + 수선처럼 복합 조건은 전부 좌표 검증한다.

검수자가 수리본을 확인할 때는 같은 production 경로의 current blob과 이 frozen bad fixture를 비교한다.
