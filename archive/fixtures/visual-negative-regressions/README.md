# Visual Negative Regression Registry

이 디렉터리는 JS Archive SVG/solutionImage에서 실제로 발생한 **false PASS 실패본**을 날짜별 frozen fixture로 보존한다.

## 작업자 사용법

1. SVG/visual 생성·수정·검수 전에 `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md`를 읽는다.
2. 현재 작업과 같은 결함축의 최신 Negative Sample을 최소 1개 확인한다.
3. frozen 실패본과 현재 production 수리본을 **쌍으로 비교**한다.
4. 숫자·문구만 맞는지 보지 말고 실제 점·선·각·길이·수선·평행·중점·중심 좌표가 설명과 일치하는지 확인한다.
5. 이 디렉터리의 SVG는 의도적으로 깨진 회귀 fixture이므로 production asset으로 복사하거나 참조하지 않는다.

## 날짜별 세트

- `2026-09-28/`: angle-owner, label collision, circumcenter/perpendicular-bisector coordinate semantic false PASS 4건
- `2026-09-29/`: missing owner ray, angle/segment owner binding, multi-condition coordinate semantic false PASS 5건

새로운 일반화 가능한 false PASS를 발견하면 **불량 bytes를 먼저 frozen fixture로 보존한 뒤**, 날짜별 README와 Golden Sample Calibration의 Negative Sample registry를 갱신한다.
