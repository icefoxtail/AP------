# 2025 중3 SVG 파일럿 B — 강화 기준 재검

이 작업은 기존 파일럿 B의 SVG 결과와 verdict를 승계하지 않고, 규칙 기준 `e5189d7e459d2f12e281baee5f7d25eada26015c`에서 가져온 원문·풀이·문제 그림·최종 SVG 바이트로 다시 판정한 재검이다. 후보 자산과 기존 evidence는 `43e0b955d890e317e222f36d7f18e6a30925be04`에서 가져왔다. 결과 브랜치는 `codex/2025-m3-visual-upgrade-quality-repair`이며 main에 병합하지 않는다.

## 120문항 최종 triage

| 조치 | 문항 |
| --- | ---: |
| KEEP | 54 |
| POLISH | 0 |
| REBUILD | 1 |
| ADD | 16 |
| REMOVE | 4 |
| EXEMPT | 45 |
| **합계** | **120** |

전체 120행은 `triage.json`에 있다. 각 행은 기존/최종 solutionImage, source figure의 충분성, 시각 요구, 한 줄 근거, decisive relation을 기록한다. ADD에는 sourceFigurePresence/sourceFigureSufficiency, `newVisualInformation[]`, marginal benefit 근거를 기록했다. REMOVE에는 철회한 파일럿 B 자산과 원문 source figure가 이미 제공하는 정보를 기록했다.

### 기존 B의 ADD 20개: 16개 유지, 4개 철회

철회한 항목은 source figure가 decisive relation을 이미 보여줘 candidate가 그 그림을 되풀이하던 경우다.

- 왕운중 1번: 원문 그림에 A/B/C, 직각, AC=10, BC=6이 이미 있다.
- 풍덕중 1번: 원문 그림에 AB=1, BC=2와 직각이 이미 있다.
- 풍덕중 11번: 원문 좌표그래프에 직교 축, 원점 O, 30° 기울기, y절편 2와 같은 좌표계의 직선이 이미 있다. 원문 PNG raster에서 축 중심 교점, 직선 기울기·절편·x/y 단위 눈금을 다시 측정해 `visual_fact_contracts.json`과 triage 행에 기록했다.
- 풍덕중 23번: 원문 사각형 그림에 이름 붙은 꼭짓점, 대각선 AC, 각, 변의 길이가 이미 있다.

남은 16개는 source figure가 없거나, 풀이에서 새로 필요한 보조선·높이·반지름/현 관계·접점 owner·두 삼각형의 공통변·높이 분해를 보여줘 추가 정보가 생기는 경우다. 각 행의 `newVisualInformation[]`가 그 차이를 구체적으로 기록한다. 그림을 추가하는 것 자체만으로는 ADD하지 않았다.

## 최종 변경 SVG 17개

- 왕운중: q2, q6(REBUILD), q10, q11, q13, q21, q22
- 풍덕중: q2, q6, q7, q13, q14, q15, q17, q18, q20, q22

기존 20 ADD 후보에서 네 파일을 철회하고, 재검 기준에 맞춘 16 ADD와 Wangun q6 rebuild를 유지했다. 다섯 Archive 해설 페이지에는 기존 그림과 최종 변경 그림을 합쳐 71개 solution SVG가 연결되어 있으며, 최종 렌더에서 모두 로드됐다.

## 강화 기준 및 물리 evidence

`svg_physical_evidence.json`의 17개 항목은 최종 source exam/solution/SVG SHA와 staged Git blob, expected facts의 GIVEN/DERIVED_INTERMEDIATE/CONCLUSION role, 전체 source-condition coverage, 빈 uncovered 조건 목록, Python 입력·계산 결과, coordinate model, 직렬화된 SVG primitives, 관찰값과 오차, 원문 의미 identity와 실제 label owner, XML parse, Archive 브라우저 측정값을 결속한다.

- Archive 실제 `mode=sol` 화면: 390×844 viewport에서 5/5 exam pages, solution SVG 71/71 로드, 수평 overflow 0.
- 바뀐 SVG: 17/17 브라우저 render PASS, 17/17 별도 primitive/text bbox 재검 PASS.
- 최종 viewport 글자: 최솟값 12.083 CSS px, 11px 미만 0개; clipping 0, text overlap 0, 보이는 primitive 교차 0.
- 17/17의 visual-critical condition coverage PASS, uncoveredCriticalConditions 0.
- 점/접점/중심 이름은 원문 entity와 동일한 이름을 쓰고, 실제 최종 SVG owner binding에 결속했다. 풍덕중 q18은 O/P/Q/R을 유지했다.
- 풍덕중 q20은 증명 대상 PA=PB를 GIVEN_STYLE tick으로 선표시하지 않고, 전제인 반지름 OA=OB만 GIVEN_STYLE로 표시했다.
- 좌표그래프 false-pass 점검은 변경 SVG에만 적용한 것이 아니다. 철회한 풍덕중 q11 원문 PNG에서도 x/y축 방향, 직교, 원점 교차, 동일 프레임/축 척도를 확인해 기록했다.
- 수학 label은 math serif, text는 sans-serif, derived value는 teal, 결론은 blue로 구분했다.

실행한 validator는 `archive/tools/visual-physical-evidence-gate.mjs`이며, 실제 실행 결과는 `visual-physical-evidence-gate-run.json`에 저장했다. `validate_triage.mjs` 및 `verify_protected_fields.cjs`는 각각 120/120을 확인한다. 잠금 필드(content, choices, answer, solution, problem image, Meta, difficulty, layout)의 parity 오류는 0이다. 현재 base의 rule manifest와 참조 파일 byte/hash parity는 PASS다.

## 재현 명령

```powershell
node archive/evidence/visual-upgrade-2025-m3-independent-b/validate_triage.mjs
node archive/evidence/visual-upgrade-2025-m3-independent-b/verify_protected_fields.cjs
python archive/evidence/visual-upgrade-2025-m3-independent-b/build_visuals.py
python archive/evidence/visual-upgrade-2025-m3-independent-b/repair_candidate_svgs.py
python archive/evidence/visual-upgrade-2025-m3-independent-b/verify_geometry.py
node archive/evidence/visual-upgrade-2025-m3-independent-b/attach_visual_fact_contracts.mjs
python archive/evidence/visual-upgrade-2025-m3-independent-b/verify_browser_overlaps.py
node archive/tools/visual-physical-evidence-gate.mjs --evidence archive/evidence/visual-upgrade-2025-m3-independent-b/svg_physical_evidence.json --triage archive/evidence/visual-upgrade-2025-m3-independent-b/triage.json
```

`finalize_evidence.py`는 모든 승인된 JS/SVG 바이트를 staging한 뒤 실행해 `finalSvgSha256`, `finalSvgGitBlobSha`, 브라우저 evidence hash 및 현재 source-exam blob을 닫는다.
