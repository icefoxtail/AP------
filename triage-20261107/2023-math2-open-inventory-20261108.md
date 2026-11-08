# 2023년 고2 수학 II OPEN 전수 누적 검토

작성일: 2026-11-08  
대상 브랜치: codex/svg-triage-20261107  
기준 HEAD(작성 전 확인): 9ec4ba3ac6a48ddb767d92bbd57f40c5d4c48717  
범위: 23년 2학기 기말 고2 수학 II 판정표 7개, OPEN 90문항. 이 파일은 기존 판정표·문항 입력·SVG를 수정하지 않는 누적 보고다. Q07 판정표/STATUS 갱신은 별도 담당 작업이므로 본 파일의 변경 범위가 아니다.

## 요약

- 7개 판정표 합계 158문항: OPEN 90, FIGURE 62, EXEMPT 4, KEEP_HISTORY 2.
- 90 OPEN 중 완전한 3종 입력(item/plan/publish)이 있는 것은 순천여고 Q07·Q18 두 건이다. 다른 88건에는 현재 입력 세트가 없다.
- 순천여고는 18개 입력 디렉터리(판정표 FIGURE 16건과 OPEN Q07·Q18)를 확인했다. 추가 6개교는 FIGURE 46건에만 완전한 입력 세트가 있고 OPEN 83건에는 세트가 없다.
- 확인된 실제 그림 수학 오류는 매산여고 Q21 하나다. OPEN으로 기록된 엔진 계약 오류 2건(제일고 Q21, 팔마고 Q17)은 이번 조사에서 재현하지 않았다.
- 사용자 지시대로 가독성만의 우려는 HOLD 이유로 쓰지 않는다. 지시선, 라벨 배치, 눈금·프레이밍 수정 대상으로 분류한다. 재현된 엔진 기능 부족은 HOLD 대신 업그레이드 후보로 기록한다.
- 이전의 “FEATURE_BAND 미지원” 결론은 정정한다. production graph_framing.py에 이미 지원이 있고 PR #944에서 병합됐다. 다만 Q15의 f 그래프에 대한 개별 파이프라인 점검과 Q15 전체 문항의 계획 완성·공식 렌더 검증은 서로 다른 상태다.
- OPEN이라고 READY, 소유권 확정, 공식 검증 완료를 뜻하지 않는다.

## 원문 시험 JS 경로

각 문항의 원문 JS는 다음 경로다. 이미지 자산 디렉터리는 archive/assets/images/ 뒤에 같은 시험 식별자를 사용한다.

| 시험지 | 원문 JS |
|---|---|
| 순천여고 | archive/exams/original/high/h2/2final/23_순천여고_2학기_기말_고2_수학II.js |
| 복성고 | archive/exams/original/high/h2/2final/23_복성고_2학기_기말_고2_수학II.js |
| 강남여고 | archive/exams/original/high/h2/2final/23_강남여고_2학기_기말_고2_수학II.js |
| 제일고 | archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_수학II.js |
| 매산고 | archive/exams/original/high/h2/2final/23_매산고_2학기_기말_고2_수학II.js |
| 매산여고 | archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_수학II.js |
| 팔마고 | archive/exams/original/high/h2/2final/23_팔마고_2학기_기말_고2_수학II.js |

## 판정표별 전체 OPEN QID

판정표 경로는 대상 브랜치 triage-20261107/ 아래다.

| 시험지 | 판정표 | OPEN QID |
|---|---|---|
| 순천여고 | 23-suncheongirls-math2.md | Q07, Q11, Q12, Q15, Q18, Q19, Q20 |
| 복성고 | 23-bokseong-math2.md | Q02, Q03, Q08, Q10, Q11, Q12, Q13, Q14, Q15, Q17, Q18, Q19, Q22 |
| 강남여고 | 23-gangnam-girls-math2.md | Q04, Q06, Q07, Q09, Q10, Q12, Q13, Q14, Q17, Q18, Q20, Q21, Q23, Q24, Q25 |
| 제일고 | 23-jeil-math2.md | Q04, Q05, Q06, Q07, Q08, Q10, Q11, Q13, Q14, Q15, Q16, Q18, Q19, Q20, Q21, Q22, Q23 |
| 매산고 | 23-maesan-math2.md | Q02, Q04, Q09, Q10, Q12, Q13, Q14, Q17, Q18, Q19, Q20 |
| 매산여고 | 23-maesangirls-math2.md | Q02, Q03, Q05, Q06, Q07, Q08, Q09, Q11, Q12, Q13, Q14, Q15, Q17, Q18, Q19, Q21, Q23 |
| 팔마고 | 23-palma-math2.md | Q04, Q05, Q08, Q10, Q12, Q14, Q15, Q17, Q19, Q22 |

## OPEN 입력 세트와 원본·PR 중복

- 순천여고 Q07·Q18은 item/plan/publish 세트와 STATUS가 있지만 둘 다 OPEN · NOT_RENDERED다. Q18에는 기본 plan.json 외에 새 plan-2panel.json도 추가됐다. Q11·Q12·Q15·Q19·Q20은 해당 root-input 디렉터리가 없다. Q16은 현재 FIGURE이며 OPEN이 아니다. Q16의 과거 가독성 단독 HOLD는 해제된 상태다.
- 복성·강남여·제일·매산·매산여·팔마의 OPEN 83건에는 완전한 3종 입력 세트가 없다. 각 판정표의 FIGURE 46건에는 입력 3종과 STATUS가 있으나 STATUS의 OPEN · NOT_RENDERED는 판정표 OPEN 분류와 별도 상태 축이므로 OPEN 총수에 중복 합산하지 않는다.
- 강남여고 Q07·Q12·Q14·Q18·Q24는 현 JS가 images:[qN.png]를 참조하지만 해당 canonical PNG가 이미지 디렉터리에 없다. 같은 5개 문항의 PNG 복원과 images→image 연결을 다루는 open draft PR #1225가 있다. 자산·JS 변경은 해당 PR 및 현재 소유 상태와 조정해야 한다. PR이 열려 있다는 사실만으로 작업자가 현재 점유 중이라고 단정하지 않는다.
- 매산고 Q20은 open draft PR #980의 같은 시험 JS 메타데이터 변경과 겹친다. PR의 Q16/Q20 메타 변경이 Q20 그림 구현 소유를 증명하지는 않는다.
- OPEN 문항에 연결된 기존 해설 SVG 12개를 확인했다: 복성고 Q10·Q11, 제일고 Q21, 매산고 Q14·Q17·Q20, 매산여고 Q21, 팔마고 Q04·Q10·Q15·Q19·Q22. 원본이나 해설 SVG가 이미 있으면 보존하며, 새 작업이 이를 승인 취소하거나 덮어쓰지 않는다. 이 SVG들의 geometry-visual-v1 마커 부재만으로 과거 검수·승인을 무효로 판단하지 않는다.
- 순천여고 원본에는 Q11·Q12·Q19·Q20 해설 SVG가 있으며 Q12 문제 이미지도 있다. 기존 SVG/이미지를 재사용할 때 원문 표현을 보존하고 새 함수식을 임의로 추정하지 않는다. Q11은 x=0이 그래프의 제외된 경계점인 동시에 기하학적 삼각형의 꼭짓점 O인 차이를 분명히 해야 한다.

## 판정 근거 유형 (추가 6개교의 OPEN 83건)

이 분류는 상호 배타적인 1차 분류이며, 소유/시도 미확인은 별도 공통 착수 게이트다.

| 유형 | 건수 | QID |
|---|---:|---|
| 가독성·프레이밍 중심 | 12 | 복성 Q03·Q12·Q14; 강남여 Q04·Q06·Q10; 제일 Q06·Q07·Q11·Q13·Q16; 팔마 Q14 |
| 판정표에 엔진 계약 오류 기록, 이번엔 미재현 | 2 | 제일 Q21; 팔마 Q17 |
| 확인된 그림 수학 용어/라벨 오류 | 1 | 매산여 Q21 |
| 원본 자산 누락 및 기존 PR과 중복 | 5 | 강남여 Q07·Q12·Q14·Q18·Q24 |
| 표현 계획·계약 증거 부족 | 63 | 위 유형 외 나머지 OPEN |

가독성 12건은 라벨·지시선·눈금·배치 조정으로 접근할 후보이며, 실제 이미지 확인과 최종 렌더링 전 가독성 보장을 뜻하지 않는다. 다른 63건은 “엔진 미지원 확정”이 아니라 정확한 수학 표현·계약이 아직 입증되지 않았다는 뜻이다. 예를 들어 복성고 Q10은 주어진 f′ 그래프의 부호표, Q11은 속도 그래프의 부호 있는 넓이가 핵심이므로 임의 함수식을 만들지 않는다. 매산고 Q02의 x=3 약분 구멍과 x=−3 점근선, 제한 정의역, 시간·적분 부호, 여러 영역은 각각 원문 조건을 보존해야 한다. 팔마고 Q10 보기와 Q15·Q19 조건은 이미지에 포함돼 있으므로 JS 텍스트만으로 재구성하지 않는다.

## 순천여고 OPEN 7건의 개별 이슈

- Q07: 그림은 f 자체가 아니라 g=f′다. g(x)=−6x²+12x+18의 근 −1·3 주변과 원점 표식이 가까운 것은 우선 배치·눈금·지시선 문제다. 이 가독성 문제만으로 HOLD하지 않는다. 입력은 있지만 NOT_RENDERED다.
- Q11: 원문 정의역은 −2<x<0이다. O=(0,0)은 기하학적 삼각형의 꼭짓점이면서 곡선의 제외된 끝점 좌표이므로 두 의미를 시각적으로 구분해야 한다. 기존 q11-solution.svg는 보존한다.
- Q12: 문제 도형은 도함수 그래프와 선택지를 포함한다. 원본 q12.png와 해설 SVG가 있으므로 임의의 다항식으로 복원하지 않는다. 입력·검증 계획은 확인되지 않았다.
- Q15: f(x)=x⁴+x²−6x+1의 단일 다항식 overview는 현재 production FEATURE_BAND 경로로 개별 재현됐다. 그러나 문항 핵심은 서로 다른 x1·x2에서 f의 최솟값과 g의 최댓값을 비교하는 것이다. f 하나의 그래프 PASS만으로 전체 계획이 끝난 것이 아니다. 두 곡선·두 패널 및 비교의 정확한 수학 표현을 계획해야 한다.
- Q18: 적분 ∫₀⁵|f(x)|dx=23은 주기 3의 한 주기 [0,3]과 남은 [3,5]를 모두 표현해야 한다. 한 축의 연속 piecewise 경로는 5조각이 필요해 현재 연속 경로의 4조각 상한을 넘는다. referenceCurves 우회도 validator가 요구점·corner 규칙으로 거절한 것이 재현됐다. 두 패널 [0,3] 3조각 + [3,5] 2조각 구조의 새 plan-2panel.json이 있다. 이 대안은 compositePanels 입력 계약 PASS 및 파생된 두 패널의 framing/model/독립 audit PASS로 확인됐다. official composite render·PNG·가독성 검증은 NOT_RUN이다. 2026-11-08 STATUS 후속은 기존 HOLD가 과거 plan.json의 누락에만 해당한다고 설명하고, 새 plan-2panel이 전체 구간을 포함한다고 기록한다. item/publish는 기존 파일이며 새 대안 계획과 정식으로 결속된 인계본은 아니다. 소유·누적 시도 UNKNOWN이고, 중복 확인 전 구현자 인계는 하지 않는다. 단일축 표현 지원 부족은 HOLD 사유가 아니라 엔진 업그레이드 후보이며, 2패널은 현행 지원 경로의 재계획 후보다.
- Q19: 좌우 다른 삼차식의 접합점과 극값을 보존해야 한다. 기존 SVG를 보존한다. 정확한 계획과 공식 검증은 미실행이다.
- Q20: 근 개수의 계단형 변화와 별도 삼차식의 영점을 혼동하지 않아야 한다. 두 패널 구성은 후보지만 계획·공식 검증은 미실행이다. 기존 SVG를 보존한다.

순천여고 Q18 입력의 a=1은 시각 예시용으로만 쓸 수 있고 정답값처럼 표시하면 안 된다. 실제 전체 적분 조건에서 a를 결정할 때 한 주기와 남은 구간을 모두 포함해야 한다.

## FEATURE_BAND와 엔진 검증 상태의 정정

이전 기록의 “FEATURE_BAND 미지원”은 틀렸다. 현재 production archive/tools/geometry-equation/production/graph_framing.py의 L92-L93은 overviewWindowPolicy 허용값을 검증하고 L108-L115가 FEATURE_BAND 창을 계산하며 L136에 fit 결과를 기록한다. PR #944가 2026-10-28에 병합됐다. 코드 링크: https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/graph_framing.py#L92-L136 ; 병합 PR: https://github.com/icefoxtail/AP------/pull/944

Q15 단일 quartic f에 대해 fit_overview → graph_spike.produce → independent graph_observer.audit 경로는 PASS로 재현됐다. 이는 해당 단일 그래프 경로의 부분 증거일 뿐, Q15의 f 최솟값과 g 최댓값 비교를 담은 composite 전체 검증은 아니다. 정식 render-plan/compose/PNG는 NOT_RUN이다.

composite-candidate-svg-v1.mjs L165는 2패널 piecewise-polynomial capability를 허용한다. L168-L174의 quadratic 제한은 3패널 구성 관련이며 2패널의 조각 수 제한으로 잘못 확대하지 않는다. 따라서 Q18 3+2조각 2패널 표현은 정적 계약 후보가 맞다. 다만 현재 초안의 바깥 caption은 PANEL_CAPTION_0 오류로 거절됐다. 최종 composite, 공식 renderer, observer, PNG 또는 학생 화면은 PASS 처리하지 않는다. 코드 링크: https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/composite-candidate-svg-v1.mjs#L165-L188

제일고 Q21과 팔마고 Q17의 무리수 영역 경계 오류는 판정표에 적혀 있으나, 이번 재현·실패 plan·코드·누적 attempt 확인은 NOT_RUN이다. 다른 OPEN도 표현 계획이 없다는 이유만으로 engine upgrade 필수라고 추정하지 않는다. 재현된 기능 공백은 업그레이드 후보로 남기되 가독성 HOLD로 되돌리지 않는다.

## 확인된 실제 수학 라벨 오류: 매산여고 Q21

원문 JS: archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_수학II.js  
기존 그림: archive/assets/images/23_매산여고_2학기_기말_고2_수학II/q21-solution.svg, blob 95f3253dc6fc968a23b9170c211d327fb82b9044

문항은 f(x)=2x³−9x²+12x−1, [0,3]에서 극댓값·극솟값과 최댓값을 묻는다. f′=6(x−1)(x−2), f(0)=−1, f(1)=4, f(2)=3, f(3)=8이다. SVG는 (1,4)를 “최댓값”, (2,3)를 “최솟값”으로 잘못 표기한다. 이들은 각각 극댓값·극솟값이고 전역 최댓값은 8, 전역 최솟값은 −1이다. 원문 JS 해설은 바르게 구별한다. 기존 SVG와 provenance를 보존했으며 여기서 수정하지 않았다.

현재 Q18 2패널 후보: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/inputs/23-suncheongirls-math2/root-inputs/q18/plan-2panel.json
Q18 상태 및 후속 검증기록: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/inputs/23-suncheongirls-math2/root-inputs/q18/STATUS.md

## 이전 작업·승인 이력과 공통 미확인 범위

- PR #534는 병합됐으며 다섯 학교의 시험 JS/검수 이력을 포함한다. 본문에서 student renderer와 official validator를 NOT_RUN으로 기재했으므로 현재 OPEN 그림 전체의 렌더 PASS로 확장하지 않는다.
- 강남여고 Q08은 OPEN이 아니라 KEEP_HISTORY다. 병합 PR #774와 시험 원장의 단일 PUBLISHED 항목이 있으므로 새 OPEN 수에 넣지 않고 이력을 보존한다.
- 강남여고 #1225와 매산고 #980은 open draft다. PR 상태만으로 현재 작업자 점유를 증명하지 않는다.
- 대상 6개교는 QUEUE.md에 인수 행이 없다. READY로 추정하지 않는다.
- 모든 OPEN의 현재 소유자와 로컬 잠금 여부, 누적 attempt 원장은 원격 문서만으로 확인하지 못했다(UNKNOWN). 진행 중인 PR도 동일 문항의 현재 소유자를 확정하지 않는다.
- 모든 대상 OPEN의 공식 student renderer·official validator·최종 PNG는 NOT_RUN 또는 미확인이다. 기존 SVG의 실제 시각 검토·실제 화면 검수도 전수완료로 주장하지 않는다. 제일 Q21·팔마 Q17의 기록된 계약 실패는 재현하지 않았다.
- 이 누적 파일은 새 문서 하나만 추가한다. 판정표·STATUS·JS·PNG·SVG·기존 승인·시도 이력은 수정하지 않는다.

## 참고 링크

- 순천여고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-suncheongirls-math2.md
- 복성고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-bokseong-math2.md
- 강남여고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-gangnam-girls-math2.md
- 제일고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-jeil-math2.md
- 매산고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-maesan-math2.md
- 매산여고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-maesangirls-math2.md
- 팔마고: https://github.com/icefoxtail/AP------/blob/codex/svg-triage-20261107/triage-20261107/23-palma-math2.md
