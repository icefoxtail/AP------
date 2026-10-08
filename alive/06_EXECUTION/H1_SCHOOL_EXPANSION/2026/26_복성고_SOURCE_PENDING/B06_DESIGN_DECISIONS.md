# B06 — 설계 먼저 확정 / CREATE는 다음 지시

## 대상과 기준
- 2026 복성고 고1 1학기 기말 원본 q18·q19 (원본 SHA `8266fa47…`), 원본 PNG 둘 다 실제 확인.
- q18: 원기둥에 정육면체 관통 구멍 → **방정식의 활용** / RPM `H1-RPM-177`. 겉넓이 `2πa(a+b)+2b²`, 양의 유리수 조건, 원 내부 적합 제약.
- q19: 그림 인접변 `AB, AC, AD, BC, CD`, 비인접 `BD` → **합·곱의 법칙** / RPM `H1-RPM-187` (이전 같은 학년 scope 재사용). 6색 칠하기 480, 3색 사용 120, 4색 사용 360.

## 설계 분모
| 구분 | 탐색 | ACCEPT 설계 | 제외·보류 | 현재 생성 |
|---|---:|---:|---:|---:|
| q18 | 16 | 10 | 6 | 0 |
| q19 | 22 | 15 | 7 | 0 |
| 합계 | 38 | **25** | 13 | **0** |

## q18 ACCEPT
- `BSG26-B06-Q18-SURFACE_COEFFICIENT_INVERSION`: 같은 원기둥·정육면체 관통구멍의 겉넓이 Pπ+Q와 양의 유리수 조건에서 a,b를 구한 뒤 a−b를 묻는다.
- `BSG26-B06-Q18-SURFACE_DIFFERENCE`: 뚫기 전후 겉넓이 차이를 제시하고 제거된 두 정사각형 면과 새 내부 4벽면의 순증가로 b를 구한다.
- `BSG26-B06-Q18-VOLUME_AFTER_TUNNEL`: 겉넓이로 a,b를 구한 다음 원기둥 부피에서 정육면체 부피를 빼어 남은 부피를 묻는다.
- `BSG26-B06-Q18-CAVITY_WALL_VOLUME_COMBINED`: 내부 네 벽의 넓이와 남은 부피를 서로 독립 조건으로 제시해 a,b를 결정한다.
- `BSG26-B06-Q18-INDEPENDENT_PRISM_SIDE`: 원기둥 높이 h, 정사각형 관통 기둥 한 변 s를 분리하고 0<s<h 및 S로 s를 구한다.
- `BSG26-B06-Q18-BLIND_CUBIC_CAVITY`: 윗면에서 깊이 s만 파인 정육면체형 홈을 별도 그림으로 보여주고 바닥면-윗면 상쇄를 이용한다.
- `BSG26-B06-Q18-TWO_SEPARATE_TUNNELS`: 분리된 두 정사각기둥 관통 구멍을 새 그림으로 제시하고 첫 구멍 한 변·전체 S로 두 번째 변을 역산한다.
- `BSG26-B06-Q18-CIRCULAR_TUNNEL`: 정사각형이 아닌 원형 관통구멍을 도식화하여 안쪽 곡면과 원형 개구 면적을 구별한다.
- `BSG26-B06-Q18-ROOT_ADMISSIBILITY`: 겉넓이 유도 이차방정식의 후보 근을 양의 길이·구멍 적합 조건으로 걸러 유일해를 정한다.
- `BSG26-B06-Q18-COMPARE_TWO_HOLE_SIZES`: 동일 원기둥에 크기가 다른 두 구멍이 있는 별개 그림을 비교해 공통 겉넓이 항을 소거한다.

## q19 ACCEPT
- `BSG26-B06-Q19-INVERSE_K`: 원본과 같은 5개 인접선 그림 및 k종 구별된 색으로 칠하는 수를 제시해 k를 역산한다.
- `BSG26-B06-Q19-EXACT_THREE`: 원본 인접그래프에서 정확히 서로 다른 3색을 사용하도록 하고 B=D 조건을 독립적으로 확인한다.
- `BSG26-B06-Q19-EXACT_FOUR`: 원본 인접그래프에서 정확히 4색 사용은 비인접 BD까지 서로 다르게 칠하는 경우임을 묻는다.
- `BSG26-B06-Q19-FIXED_A`: A를 지정된 색으로 고정한 원본 인접그래프의 색칠 수를 묻는다.
- `BSG26-B06-Q19-AC_SUBPALETTE`: A,C만 서로 같은 허용 팔레트 T(크기 t)에서 고르게 하고 B,D는 전체 k색에서 고르게 한다.
- `BSG26-B06-Q19-B_FORBID_COLOR`: B에서만 빨강을 금지하되 A,C에 빨강이 사용됐는지에 따라 경우를 나눈다.
- `BSG26-B06-Q19-BD_FORBID_COLOR`: B,D 모두 빨강 사용 불가 조건에서 A,C가 빨강을 사용한 경우와 안 한 경우를 나눠 센다.
- `BSG26-B06-Q19-EXACT_ONE_BD_RED`: B,D 중 정확히 하나만 빨강, A,C는 빨강이 아님을 이용한다.
- `BSG26-B06-Q19-BD_SAME_FIXED_RED`: B,D가 모두 빨강을 공유하지만 이웃하지 않으므로 허용되고 A,C는 서로 다른 나머지 색을 쓴다.
- `BSG26-B06-Q19-RED_EXACT_ONCE`: 전체 네 영역 중 지정된 빨강의 등장횟수가 정확히 한 번인 경우를 A/C 또는 B/D 위치별로 분할한다.
- `BSG26-B06-Q19-RED_AT_LEAST_ONCE`: 전체 칠하기에서 빨강을 전혀 쓰지 않는 칠하기를 빼어 적어도 한 번을 센다.
- `BSG26-B06-Q19-OVERLAP_PALETTES`: A의 허용집합 T와 C의 허용집합 U가 겹치므로 두 영역이 같은 색인 순서쌍을 제거한다.
- `BSG26-B06-Q19-ADD_BD_EDGE`: 새 그림에 BD 공유 경계선을 분명히 추가하고 기존 그림과 비교하여 6색 색칠 수를 센다.
- `BSG26-B06-Q19-REMOVE_AC_EDGE`: AC 공유 경계를 제거한 새 그림을 쓰고 A=C, A≠C를 나누어 센다.
- `BSG26-B06-Q19-MINIMUM_K_THRESHOLD`: 원본 인접그래프 P(k)의 단조 증가와 P(k−1),P(k) 대조로 정해진 색칠 수 이상이 되는 최소 k를 찾는다.

## 제외·보류와 확장 승인 경계
- **DUPLICATE**: 같은 풀이 목표 표현·숫자만 변경하는 안.
- **L3_DRIFT**: 구멍 원 적합성 부등식만 묻는 것 등 원래 방정식 활용의 주개념을 벗어난 안.
- **NO_VALID_MATH_STRUCTURE**: 원본 그림에서 A=C 허용 또는 B-D가 인접한다고 가정하는 안.
- **HOLD**: 비스듬한 절단면, 삼각기둥 굴착, 색 이름 치환 동치류처럼 원본 범위·이미지 제작을 새로 검증해야 하는 안.
- **CURRICULUM_VIOLATION**: 고1 범위에서 미분 최적화 사용.
- 신규 L4 후보 14개는 디자인 후보 등록만 완료. RPM canonical 변경·새 L3 확정·생성 문항 PASS가 아님.

## C 시작 전 필요 조건
1. 새 도형을 요구한 q18 5종·q19 2종은 실제 새 문제용 그림과 원본 사실 모델을 먼저 제작하여 도형·정확한 인접변을 검산할 것.
2. 각 Blueprint의 `stemPattern`, `distractorStrategies`, 정답 위치 계획에서 실제 5지 보기 네 개가 **수학적 오개념**이 되도록 설계하고 Reverse Stem Check 수행.
3. 신규 UID·shard/metadata/manifest/index/receipt를 같은 CREATE 전용 브랜치에 저장한 뒤 remote readback. 기존 166 후보, 학생용 등록, original 원본 무변경.
4. 최종 독립 REVIEW는 별도 채팅이 완료. 실제 엔진 visual render 및 Consumer DB 등록을 CREATE 설계 PASS로 위장 금지.
