# SVG/도형 65문항 최종 재검수 보고서

- 검수일: 2026-09-04 (Asia/Seoul)
- 승인 범위: 사용자가 지정한 65문항
- 최종 상태: **REPAIR COMPLETE — SVG 전용 게이트 PASS / 전역 baseline 및 규칙팩 drift WARN 기록**
- 목표 사용: 이 작업은 goal `01a06b24-1184-7e82-b756-8baa2fe4ec5a`로 추적했다.

## 1. 결론

지정된 65문항의 `qNN-solution.svg`만 좌표관계가 다시 계산된 Python 독립 생성기로 재출력했다. 정상 SVG를 전수 재생성하지 않도록 target 목록을 코드에 고정했고, 수정 대상 외 SVG·JS 문항 내용·선택지·정답·해설·DB·question-index를 쓰지 않았다.

최종 산출물 기준으로 다음 게이트가 통과했다.

| 게이트 | 결과 | 근거 |
|---|---:|---|
| 승인 target 수 | **65/65** | `python_geometry_verification.json`, `corrections.csv` |
| target SVG 실제 파일·fact hash | **65/65 PASS** | `svg_static_check.json` |
| XML/viewBox/동일축척/유한좌표/금지문법 | **65/65 PASS** | `svg_static_check.json` |
| 원본 JS syntax check | **25/25 PASS** | `node_check.txt` |
| 원본 JS VM load·ID·보호필드 | **25/25 PASS** | `node_vm_check.txt` |
| DB ↔ question-index ↔ JS qCount | **25/25 PASS** | `db_index_parity.json` |
| 현재 production SVG 브라우저 표시 | **65/65 표시, broken 0** | `visual-review.html`, `browser_render_check.md` |
| archive engine 25×exam/sol/ans | **72/75 harness PASS** | 실패 3건은 아래 baseline WARN으로 분리 |

## 2. 범위 잠금

- 출력 대상은 모두 `archive/assets/images/<시험명>/qNN-solution.svg`이다.
- `qNN-exam.svg`, 정상 SVG, JS 원문, `content`, `choices`, `answer`, `solution`, DB, question-index는 수정하지 않았다.
- `solutionImage` 경로는 원본 문항과 현재 asset path가 대응하며, 대상 원본 25개 파일의 보호 필드는 VM에서 존재·보존 확인했다.
- Python 생성기 실행 결과는 `rewrittenTargetAssets=65`이다.
- `source_to_final_diff.csv`의 raw byte SHA 비교는 HEAD와 실제 내용이 달라진 행이 5개, 현재 canonical 출력과 byte-identical한 idempotent 행이 60개로 기록된다. 65개 모두 target-locked 출력·렌더·hash 대상에 포함되며, 이는 정상 SVG를 범위 밖에서 건드리지 않았다는 증거와 함께 해석해야 한다.

## 3. 시험별 수정 확정 목록

| 시험 | 문항 | 고친 핵심 관계 |
|---|---|---|
| 21 복성고 2중간 | q1, q16 | q1 원·점 축척; q16 `y=2` 접선과 `y=−2` 교점/현 관계 |
| 21 순천고 2중간 | q9, q20 | q9 두 원 공통현 교점; q20 `C(−2,5)` 부호·위치 |
| 21 제일고 2중간 | q18 | `C(−3,1)` 좌표 부호 방향 |
| 22 금당고 1기말 | q11 | 실제 원-직선 현과 일치하는 단일 직선 |
| 22 매산고 1기말 | q10 | `O(3,5)` 중심 위치 |
| 22 복성고 1기말 | q3 | 접선 `3x+y−10=0`이 `T(3,1)` 통과 |
| 22 순천여고 1기말 | q12, q23 | `y=x+1`과 표시점·현의 실제 좌표관계 |
| 22 팔마고 1기말 | q6, q19 | `C(1,−4)` 중심 위치; 수선과 직선의 직교관계 |
| 22 효천고 1기말 | q14 | `6x+8y−9=0`의 실제 기울기 `−3/4` |
| 22 제일고 1기말 | q13, q14, q17 | 중심·반지름·점/원 관계; 큰 원 clipping 방지; 실제 접선점 |
| 23 매산고 1기말 | q14 | 삼각형 내심·내접원 중심 |
| 23 복성고 1기말 | q19, q20 | P 위치; `C₂=(6,−8)`와 반지름 축척 |
| 23 순천여고 1기말 | q9, q15, q16 | 반사 직선 기울기; 가짜 접선 제거; 수직 직선 부호 |
| 23 제일고 1기말 | q14, q18, q22 | 중심좌표; 곡선-교점; 두 중심 좌표 |
| 23 팔마고 1기말 | q14 | 중심을 통과하지 않는 실제 접촉현 |
| 24 금당고 1기말 | q7, q9, q16, q20 | 중심·접점·축접선·수직관계 — 4/4 |
| 24 매산고 1기말 | q7, q9, q15, q17 | 좌표·접점·직선·축접선 — 4/4 |
| 24 제일고 1기말 | q10, q12, q13, q15, q17, q21, q22 | 좌표·공통현·접선·중심 — 7/7 |
| 25 금당고 2기말 | q18 | `2x−y=k` 방향과 접선 경계 |
| 25 제일고 2기말 | q3, q7 | 접선이 접점을 통과; P·C 좌표 |
| 25 금당고 2중간 | q3, q4, q8, q11, q12, q16, q18, q19, q21 | 반지름·현·공통점·접촉현·원 위 점 — 9/9 |
| 25 매산고 2중간 | q7, q10, q14, q18, q20 | 접선 방향·좌표·축접선 — 5/5 |
| 25 순천고 2중간 | q7, q9, q10 | 수선/거리·`P(2,−1)`·현/직선/원 관계 |
| 25 순천여고 2중간 | q14, q17, q21 | 수선·공통현·접점 — 3/3 |
| 25 제일고 2중간 | q13 | 평행 접선 기울기 |

연도별 합계는 2021년 5, 2022년 11, 2023년 10, 2024년 15, 2025년 24로 총 **65문항**이다. 따라서 기존 2024 배치의 “검수 완료” 기록과 달리, 이번 강화 좌표 검수 대상은 2024년 **15/15 의미 오류**로 처리했다.

## 4. 좌표 생성·정적 검수

모든 좌표·교점·접점·반지름·직선 계수는 `repair-65-svg-assets-20260904.py` 안에서 Python 부동소수 계산 후 SVG로 직렬화했다. 각 SVG에는 다음 추적 정보가 들어 있다.

- `data-geometry-mode="COORDINATE_GEOMETRY_HYBRID"`
- `data-axis-scale-mode="EQUAL_UNIT"`
- `data-geometry-fact-hash`
- `data-visual-provenance="deterministic-python-independent-facts"`
- `viewBox`, `preserveAspectRatio="xMidYMid meet"`

독립 정적 검수는 SVG를 XML로 다시 읽은 뒤 root attribute, fact hash, 좌표 속성의 유한성, 금지된 LaTeX/`<br>` 포함 여부를 확인했고 **65/65 PASS**였다. Python 생성기의 Windows 개행 변환으로 hash가 달라지지 않도록 LF 원문 기록도 고정했다.

## 5. 직접 브라우저 렌더 독립검수

### SVG 전체

`visual-review.html`을 localhost의 현재 production asset으로 열어 65개 SVG를 실제 `<img>`로 표시했다. Accessibility tree에 65개 target row와 65개 image가 모두 있었고 broken image는 0이었다. q1 원 위 점, 공통현, 접선점, 축접선, 대형 원 clipping 위험이 있는 항목을 포함해 화면을 직접 확인했다.

### archive engine

동일 브라우저에서 QPP=4로 시험지·해설지·답지를 직접 열어 MathJax와 layout 완료 뒤 재확인했다.

- 22 효천고 1기말 해설지: q=22, image=6, broken=0, overflow=0, error=false. q14의 `6x+8y−9=0` 도형이 실제 image 목록에 있었다.
- 22 효천고 1기말 답지: 직접 재오픈 후 answer entry=22, broken=0, 완전한 답안표 화면 확인.
- 25 매산고 2중간 해설지: q=20, image=9, broken=0, overflow=0, error=false. q7/q10/q14/q18/q20 도형이 실제 image 목록에 있었다.
- 22 금당고 1기말 시험지·해설지·답지: 각각 실제 화면과 캡처 확인.

25개 원본 × 3모드 하네스는 75개를 완료했고 72 PASS였다. 하네스의 3개 실패는 다음처럼 직접 재검으로 분리했다.

1. 22 효천고 시험지의 기존 page overflow 측정 1건.
2. 22 효천고 답지의 초기 selector 샘플 타이밍 문제. 직접 재오픈에서는 22개 답안이 표시됐다.
3. 25 매산고 해설지의 transient sample 문제. 직접 재오픈에서는 q=20, image=9, broken=0, overflow=0이었다.

따라서 **SVG-specific browser gate는 65/65 PASS**이고, archive engine 전체 gate는 SVG 외 기존 페이지 문제를 포함하므로 WARN으로 남겼다.

## 6. DB/index·원본 보호 검수

- 대상 원본 JS: 25개, 총 문항 수 541개.
- 25개 모두 Node syntax check PASS.
- 25개 모두 VM load, 순차 ID, target 보호 필드(`content`, `choices`, `answer`, `solution`) PASS.
- 25개 모두 JS qCount = DB qCount = question-index row count.
- 대상 65개 문항의 `solutionImage` 경로는 `assets/images/<시험명>/qNN-solution.svg` 형식으로 존재한다.
- 이 작업에서는 DB/question-index rebuild를 실행하지 않았다. solution-only asset 변경으로 index 구조 변경이 필요하지 않으며, 현재 parity를 read-only로 확인했다.

## 7. 전역 baseline과 규칙팩 drift

이번 SVG-only 변경의 오류로 귀속하지 않은 기존 상태는 별도 기록한다.

- `audit-latex-escapes.mjs --repo .`: 471 files / 11,083 questions 중 1건 기존 문제 — `archive/exams/_generated/alive-high1-operation-inputs/h22-c2-09.js` q3 answer의 `runtime-bare-sqrt`; affected solution은 0.
- `view-label-lint.mjs --json`: 1건 기존 문제 — `archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js` q5 content.
- 규칙 문서의 현재 hash/바이트와 repository working state 사이에 기존 `SOURCE_PACK_DRIFT`가 기록되어 있다. 규칙 문서·MANIFEST는 수정하지 않았고, 이번 산출물의 상태를 숨기지 않고 WARN으로 남겼다.

## 8. 재현 명령

```powershell
python archive/tools/geometry-equation/repair-65-svg-assets-20260904.py
python archive/tools/geometry-equation/build-65-review-report-20260904.py
node archive/tools/audit-latex-escapes.mjs --repo .
node archive/tools/view-label-lint.mjs --json
python -m http.server 8765
```

브라우저 증거 페이지:

- `reports/geometry-equation-65-20260904/visual-review.html`
- `reports/geometry-equation-65-20260904/engine-browser-harness.html`

## 9. 증거 파일

- `python_geometry_verification.json`
- `svg_static_check.json`
- `corrections.csv`
- `asset_manifest.csv`
- `source_to_final_diff.csv`
- `source_fidelity_matrix.csv`
- `solution_curriculum_check.csv`
- `node_check.txt`, `node_vm_check.txt`
- `db_index_parity.json`
- `sha256_manifest.txt`
- `browser_render_check.md`

이 보고서는 변경 사항을 commit/stage/push하지 않은 현재 working tree의 검수 결과다.
