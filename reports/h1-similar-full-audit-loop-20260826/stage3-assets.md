# Stage 3 asset / provenance audit — 고1 8개 유사 시험지

- 검수일: 2026-08-26
- 범위: 현재 파일 기준 8개 유사 JS, 178문항, 21개 유사 에셋
- 수정: JS/에셋 파일 수정 없음
- ZIP: 범위 제외
- 종합 판정: **BLOCKED** — 에셋 파일·엔진 렌더는 통과했지만, 2025년 원본 PDF/페이지 근거를 찾지 못해 21개 provenance를 증명하지 못함

## 읽은 규칙과 적용 근거

다음 문서를 전체 읽고 이번 Stage 3에 적용했다.

| 문서 | 파일 정보 | 이번 검수에 적용한 핵심 규칙 |
|---|---:|---|
| `apmath-archive-exams/SKILL.md` | 48 lines / SHA-256 `c0bd236863b6a8244c2c831554c050ac3a95be4eaa4155a62bb7fd326e65f614` | 원본→JS/에셋 연결, 실제 파일 확인, 렌더·자산 QA를 증거로 남김 |
| `apmath-archive-exams/references/archive-layout.md` | 49 lines / SHA-256 `09701a7415ba8da3c2a0c5e45f19680b9bfbf000ef9a7009e40337d12b2da6ed` | `archive/exams`·`archive/assets/images` 경로 및 시험지명별 자산 구조 확인 |
| `docs/rules/무결성검수.md` | 667 lines / SHA-256 `82e75eb543f9b3c2561e2077ac6d32ef6bc61aab985350801e7fd29dc5e61289` | 실제 파일/이미지 확인, 후반 문항 포함 전수, SVG viewBox·PNG 존재·경로·배치·렌더를 PASS/WARN/FAIL로 판정 |
| `docs/rules/JS아카이브_3차검수_프로토콜.md` | 287 lines / SHA-256 `db7bf0b2863558e9e2b255442b9d75af6d0e6a4ab0fb08f3de0ac5d1f24b0cef` | 전 문항 대상, 시각자료 태그/구조 및 근거 없는 PASS 금지 원칙 확인 |

## 원본·provenance 범위 분리

`C:\Users\USER\Desktop\AP------` 및 `C:\Users\USER`에서 2025년 대상 시험지명의 PDF/페이지 파일을 다시 찾았다. 대상 8개에 해당하는 **2025 원본 PDF 또는 원본 페이지 파일은 0건**이었다. 동일 학교의 2022년 PDF는 있었지만 대상 연도·시험지가 달라 source로 사용하지 않았다.

대신 다음 25년 아카이브 크롭 PNG는 21개 모두 존재했다.

`archive/assets/images/25_*_고1_기출/q*.png` ↔ 현재 `archive/assets/images/25_*_고1_유사/q*.svg|png`

따라서 아래의 `ORIGINAL_CROP_ONLY`는 “아카이브 기출 크롭 PNG와 현재 유사 에셋의 시각/크롭 비교”를 뜻하며, 원본 PDF 페이지·크롭 좌표까지 연결했다는 뜻이 아니다. 원본 PDF를 증명할 수 없으므로 21개 모두 `provenance_status: BLOCKED`로 고정했다.

## 파일·구조·크롭 결과

정확한 경로, SHA-256, 바이트, 형식, 픽셀/`viewBox`는 [asset-manifest.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/asset-manifest.json)에 기록했다.

| 항목 | 결과 |
|---|---:|
| JS image refs | 21 |
| 실제 유사 에셋 파일 | 21/21 |
| 누락/고아 에셋 | 0/0 |
| SVG | 19/19 XML parse PASS, 외부 참조 0 |
| PNG | 2/2 decode PASS (`1100×620`, `1100×700`) |
| 현재 JS image path | 21/21 PASS |
| `_기출`, `full_page_reference`, 임시 파일명 패턴 | 0건 |
| 원본 기출 크롭 counterpart | 21/21 |

### 문항별 크롭/시각 상태

현재 유사 에셋과 대응하는 기출 크롭 PNG를 문항별로 대조했다. `PASS`는 도형/라벨/선/해칭이 잘리고 겹친 증거가 없는 상태이고, `WARN`은 실제 잘림은 확인되지 않았지만 하단 수식·라벨이 SVG viewBox 경계에 가까워 시험지 사용 전 여백 재확인이 필요한 상태다.

| 시험지 | 문항 | 에셋 | 시각/크롭 | 비고 |
|---|---:|---|---|---|
| 금당고 2중간 | 14 | q14.svg | PASS | 현재 SVG 760×500 |
| 매산고 2중간 | 10 | q10.svg | PASS | 현재 SVG 760×500 |
| 순천고 2중간 | 11 | q11.svg | PASS | Venn/해칭 포함, 구조 정상 |
| 순천고 2중간 | 18 | q18.svg | WARN | 하단 수식/라벨 경계 근접 |
| 금당고 2기말 | 6 | q06.svg | PASS | 현재 SVG 760×500 |
| 금당고 2기말 | 16 | q16.svg | WARN | 하단 수식/라벨 경계 근접 |
| 순천고 2기말 | 4 | q04.svg | PASS | 원본 counterpart는 q4.png |
| 순천고 2기말 | 10 | q10.svg | PASS | 현재 SVG 760×500 |
| 순천고 2기말 | 13 | q13.svg | PASS | 현재 SVG 760×500 |
| 순천고 2기말 | 16 | q16.png | PASS | PNG decode PASS, 1100×620 |
| 제일고 2기말 | 10 | q10.svg | PASS | 현재 SVG 760×500 |
| 제일고 2기말 | 12 | q12.svg | WARN | 하단 수식/라벨 경계 근접 |
| 제일고 2기말 | 17 | q17.svg | WARN | 하단 수식/라벨 경계 근접 |
| 팔마고 2기말 | 1 | q01.svg | PASS | SVG 760×430 |
| 팔마고 2기말 | 2 | q02.svg | PASS | 현재 SVG 760×500 |
| 팔마고 2기말 | 3 | q03.svg | PASS | 현재 SVG 760×500 |
| 팔마고 2기말 | 5 | q05.svg | WARN | 하단 수식/라벨 경계 근접 |
| 팔마고 2기말 | 18 | q18.png | PASS | PNG decode PASS, 1100×700 |
| 팔마고 2기말 | 19 | q19.svg | WARN | 하단 수식/라벨 경계 근접 |
| 효천고 2기말 | 13 | q13.svg | WARN | 하단 수식/라벨 경계 근접 |
| 효천고 2기말 | 17 | q17.svg | PASS | 현재 SVG 760×500 |

집계: visual PASS 14, visual WARN 7, visual FAIL 0. WARN 대상은 순천고 2중간 q18, 금당고 2기말 q16, 제일고 2기말 q12/q17, 팔마고 2기말 q05/q19, 효천고 2기말 q13이다.

## 실제 엔진 렌더 재확인

리뷰 엔진 `engine.html?mode=exam|sol|ans&qpp=4`를 현재 JS로 다시 열었다. 시험지 모드는 `.q-box`, 해설지는 `.q-box`, 정답표는 `.ans-n`을 세었다. 이미지의 `complete`, `naturalWidth`, `naturalHeight`도 DOM에서 직접 확인했다. 상세 원자료는 [stage3-browser.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-browser.json)에 기록했다.

| 시험지 | 문항 | 에셋 | 시험지 q-box | 해설지 q-box | 정답표 ans-n | 이미지 decode | overflow/DOM 오류 |
|---|---:|---:|---:|---:|---:|---|---|
| 금당고 2중간 | 22 | 1 | 22 | 22 | 22 | 1/1 | 0 / 0 |
| 매산고 2중간 | 20 | 1 | 20 | 20 | 20 | 1/1 | 0 / 0 |
| 순천고 2중간 | 23 | 2 | 23 | 23 | 23 | 2/2 | 0 / 0 |
| 금당고 2기말 | 22 | 2 | 22 | 22 | 22 | 2/2 | 0 / 0 |
| 순천고 2기말 | 23 | 4 | 23 | 23 | 23 | 4/4 | 0 / 0 |
| 제일고 2기말 | 22 | 3 | 22 | 22 | 22 | 3/3 | 0 / 0 |
| 팔마고 2기말 | 23 | 6 | 23 | 23 | 23 | 6/6 | 0 / 0 |
| 효천고 2기말 | 23 | 2 | 23 | 23 | 23 | 2/2 | 0 / 0 |

엔진의 qpp=4 실제 CSS 렌더 크기는 일반 SVG가 약 `294.86×190px`, 팔마고 q01은 `294.86×166.83px`, 순천고 기말 q16 PNG는 `294.86×166.19px`, 팔마고 기말 q18 PNG는 `294.86×187.63px`이었다. 21개 모두 `complete=true`, 양수 `naturalWidth/naturalHeight`였다. 효천고 3모드는 새 탭으로 격리 재실행해 콘솔 오류 0건을 확인했다. 재사용 탭에서 한 번 보인 Chrome 확장 listener 경고는 격리 재실행에서 재현되지 않은 페이지/에셋 오류가 아니므로 판정에서 제외했다.

## 게이트 결론

| 게이트 | 판정 | 근거 |
|---|---|---|
| 파일 존재·형식·실제 decode | PASS | 21/21 존재, SVG 19/19 parse, PNG 2/2 decode |
| JS 경로·엔진 이미지 decode | PASS | 21/21 path 및 `naturalWidth` 정상 |
| 시험지/해설지/정답표 구조 렌더 | PASS | 8개 모두 문항 수 일치, overflow/DOM 오류 0 |
| 크롭/시각 품질 | WARN | 14 PASS, 7 경계 근접 WARN, definite clipping FAIL 0 |
| 원본 PDF/page provenance | **BLOCKED** | 대상 2025 source PDF/page 파일 0건 |
| Stage 3 종합 | **BLOCKED** | provenance가 입증되지 않아 PASS 보고 금지 |

원본 PDF 또는 페이지 스캔이 제공되면 21개 `source_visual_mapping`을 PDF 페이지/크롭 좌표까지 다시 연결해야 최종 PASS로 올릴 수 있다. 현재는 파일·렌더 게이트만 PASS이며, 7개 시각 WARN과 21개 provenance BLOCKED를 해소하지 않았다.
