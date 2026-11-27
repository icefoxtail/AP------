# DRAWN_FEATURE_PARITY 감사 — 비상 기하 「공간도형과 공간좌표」 대단원학습평가 고2

- 원문: `archive/exams/textbooks/비상교육_기하/비상_기하_공간도형과공간좌표_대단원학습평가_고2/비상_기하_공간도형과공간좌표_대단원학습평가_고2.js`
- 범위: 전 15문항 / 문제·해설 **30축**, 원본 `q01,q02,q03,q04,q05,q06,q09,q11,q12,q15.png` 총 10개를 직접 열람.
- 기하적 판독: 문제의 그림에 있는 모든 꼭짓점·중점·가려진 모서리·보조선·치수·직각표식을 목록화하고 해설에 필요한 추가 경계·정사영 선을 별도 계획. 원본의 배경 백색과 미학적 면 채움은 의도된 수학 정보로 세지 않으며 plan의 `highlights`/`baseFill`/색 면 명령은 사용하지 않음.
- 2026-11-27 검사: `plan-lint.cjs --shallow` **20/20 OK**, full **20/20 OK** (`UNSUPPORTED` 선언 6개 포함). 실행형 14개는 `composeSolidFigurePanel`의 독립 Python 정적 SVG 관측기까지 **14/14 PASS**, 생성된 SVG를 librsvg로 래스터화하여 원본 그림과 직접 비교. 원문에 그림 없는 5문항은 문제·해설 각각 `EXEMPT_TEXT_ONLY`.
- **잔여 1: 엔진 배경**: 실행형 14개 모두 authored plan에는 백색 채움이 없으나 `solid-figure-v1.mjs`가 최종 SVG에 `<rect fill="#fff"/>`를 강제함. 이 영역 외 엔진 코드는 이 라인의 권한 밖. 모든 실행형 축에 `ENGINE_CAPABILITY_PENDING: transparent-background-export`가 잔존하며 이것을 투명 배경 PASS로 사칭하지 않음.
- **잔여 2: 브라우저 실배치**: 이 실행 환경에 작동하는 Chromium 바이너리가 없어 Chrome 최종 text collision/layout 및 Archive capture를 실행하지 못함. 정적 SVG 요소·수학 관계는 관측기 통과; 브라우저 시각 최종승인은 `BROWSER_LAYOUT_PENDING`.

## qid별 원본-실제 작도 특징 비교

| qid | 원본 PNG/발문에 필요한 특징 | 해설축 추가 작도 | 검수 결정 |
|---|---|---|---|
| 01 | 정육면체 A~H, 숨은 면 모서리 점선, CE 붉은 공간대각선 | AC·EG / BE·CH로 평면 ACGE·BCHE 추적 | 기하적 1:1, BG pending |
| 02 | 정사각뿔 A-BCDE, CD·DE 중점 M/N, MN 보조 점선 | CE∥MN; 비교선 AC·AE·BE | 기하적 1:1, BG pending |
| 03 | 사면체 OABC, AB=6, OH⊥평면 ABC, H의 직각 | M은 AB의 중점, OM=8·OH=4, MH/OM과 이면각 30° | 기하적 1:1, BG pending |
| 04 | 정삼각기둥 ABC-DEF, BE=6·EF=4, AE·DF 점선 | DF∥AC, 삼각형 ACE의 추가 변 AC·CE | 기하적 1:1, BG pending |
| 05 | 원기둥, **기울기 45° 절단 평면**과 타원 장축 8, 점선 교선 | 타원 장·단축 정사영과 밑원 지름 대응 | `ENGINE_CAPABILITY_PENDING: oblique-cylinder-section` |
| 06 | 구 형태 공, **30° 평행 햇빛 광선**과 지면 타원 그림자 | 수직 대원·사영 면적 관계 | `ENGINE_CAPABILITY_PENDING: sphere-sunlight-ground-projection`; 잔디·하늘 삽화 재생성 제외 |
| 07 | 원문 그림 없음: 공간좌표 정삼각형의 대수 계산 | 해설에 별도 SVG 없음 | 텍스트축 면제 |
| 08 | 원문 그림 없음: 세 좌표평면 정사영 길이 계산 | 해설에 별도 SVG 없음 | 텍스트축 면제 |
| 09 | 정육면체 한 변 4, AB·FG·HD 3:1 내분점 P/Q/R, 삼각형 PQR 점선 | 무게중심 K, EK 공간선 | 기하적 1:1, BG pending |
| 10 | 원문 그림 없음: 구 지름과 yz평면 접점 조건 계산 | 해설에 별도 SVG 없음 | 텍스트축 면제 |
| 11 | 직육면체 AB=AD=2·BF=4, 공간 대각선 AG 점선 | 세 평면 ABCD/ABFE/BFGC의 대응 정사영 AC/AF/BG | 기하적 1:1, BG pending |
| 12 | 정육면체, BF·DH 중점 M/N, 경사 사각형 AMGN 네 점선 | 벡터·법선 확인 보조선 NM | 기하적 1:1, BG pending |
| 13 | 원문 그림 없음: 삼각형의 내각 이등분선 내분점 대수 계산 | 해설에 별도 SVG 없음 | 텍스트축 면제 |
| 14 | 원문 그림 없음: 구가 xy평면과 무게중심에서 접함 | 해설에 별도 SVG 없음 | 텍스트축 면제 |
| 15 | 입체 E(0,3,0), F(4,0,0), **x/y/z 좌표축과 정육면체 내접구** | 입체 중심 (7/2,7/2,5/2), 반지름 5/2 및 접면 | `ENGINE_CAPABILITY_PENDING: sphere-inside-rect-prism + space-xyz-axes` |

## 모든 문제·해설 축의 기계 검사 원장

`PARITY_GEO_PASS/BG_PENDING`은 원본 지시선·보조선·점선·표식·길이·라벨 중 해당되는 도형 요소를 SVG에서 1:1 확인했으나 엔진 흰 배경 및 브라우저 실배치가 아직 미완료라는 뜻. `UNSUPPORTED_DECLARED`는 실행 엔진이 의도적으로 그림을 만들지 않는 신호로서 기하적 1:1 PASS가 아님.

| 파일/qid | 축 | 판정 | capability | plan 경로(본 폴더 기준) | shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 평가/01 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q01-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/01 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q01-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/02 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q02-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/02 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q02-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/03 | 문항 | 정적 작도 통과 | solid-figure-v1(space) | `q03-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/03 | 해설 | 정적 작도 통과 | solid-figure-v1(space) | `q03-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/04 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q04-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/04 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q04-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/05 | 문항 | 엔진 대기 | oblique-cylinder-section | `q05-problem.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 평가/05 | 해설 | 엔진 대기 | oblique-cylinder-projection | `q05-solution.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 평가/06 | 문항 | 엔진 대기 | sphere-sunlight-ground-projection | `q06-problem.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 평가/06 | 해설 | 엔진 대기 | sphere-shadow-area-mapping | `q06-solution.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 평가/07 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/07 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/08 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/08 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/09 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q09-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/09 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q09-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/10 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/10 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/11 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q11-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/11 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q11-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/12 | 문항 | 정적 작도 통과 | solid-figure-v1 | `q12-problem.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/12 | 해설 | 정적 작도 통과 | solid-figure-v1 | `q12-solution.plan.json` | OK/OK | GEO_PASS/BG_PENDING |
| 평가/13 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/13 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/14 | 문항 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/14 | 해설 | 그림 없음 | EXEMPT_TEXT_ONLY | — | 해당 없음 | SOURCE_NO_FIGURE |
| 평가/15 | 문항 | 엔진 대기 | sphere-inside-rect-prism / 3d-axes | `q15-problem.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |
| 평가/15 | 해설 | 엔진 대기 | sphere-and-tangent-axes | `q15-solution.plan.json` | OK/OK 선언 | ENGINE_CAPABILITY_PENDING |

요약: 30축 = 실행·독립 정적 SVG 검증 **14축**, 엔진 미지원 명시 **6축**, 원문 그림 부재 면제 **10축**. 이미지 10개 전수 열람. **브라우저/투명배경은 최종 완료로 보고하지 않음.**
