# 고2 확통 기출 시각자료 보완 — 검증 진행 영수증 (2026-11-22)

**상태: 부분 수행 / RELEASE_NOT_READY.** 계획의 존재, lint OK, 기존 SVG PNG 열람은 엔진 렌더·학생 웹 출고 PASS와 다르다. `main` 병합 금지.

## 기준 및 실제 원본 수

- 기준 계획 브랜치: `work/probstat-upgrade-hold-svg-plans-20261122` (`7fae2acc63aff9ce9726d74ff9f94beea3c08520`). 별도 실행 브랜치: `work/probstat-visual-md-svg-final-20261122`.
- `archive/exams/original/high/h2/{1mid,1final,2mid,2final}` 실제 JS 파일 중 확률과통계 기출 **104개**의 `window.questionBank`를 모두 파싱했다. 실제 배열의 합은 **2,323개**이다. 기존 전달 수치 2,324개에서 **1문항 차이**가 있다.

| 실제 논리 분류 | 시험지 수 | JS 문항 수 | 이미지 참조(해설 SVG/문제 PNG 등) | SVG | PNG |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1학기 중간 (`1mid`) | 41 | **926** | 223 | 120 | 103 |
| 1학기 기말 (`1final` 18개 + `2mid`에 잘못 저장된 매산여고 1개) | 19 | 427 | 109 | 84 | 25 |
| 2학기 중간 (`2mid`, 오분류 매산여고 제외) | 21 | 463 | 106 | 50 | 56 |
| 2학기 기말 (`2final`) | 23 | 507 | 326 | 274 | 52 |
| **합계** | **104** | **2,323** | **764** | **528** | **236** |

> 이미지 참조 수는 시험지 문항의 `image`, `solutionImage`, HTML `img src`에서 수집한 **문항별 중복 제거된 참조 개수**이며, 고유 이미지 파일 수나 전부 시각 PASS 수가 아니다. SVG 528개 참조는 작업으로 대체하지 않고 현 상태로 유지했다. 단, 전체 528개의 수학·가독성 정상 판정은 `NOT_RUN`.

### 학기별 QA 범위

- **1학기: 60개 시험지 / 1,353문항 / 참조 332개(SVG 204, PNG 128).** 모든 60개 시험지의 문항 배열·문자열 이미지 참조를 읽었지만, 전수 PNG 육안·학생 화면 검증을 완료한 시험지는 **0개**. 2020 매산여고 기말만 별도 23문항 수학 검산과 실물 SVG 4개·원본 PNG 1개 육안 점검을 수행했다.
- **2학기: 44개 시험지 / 970문항 / 참조 432개(SVG 324, PNG 108).** 기존 lane40 시각 QA 보고서가 있으나 이 브랜치에서 새로 전수 이미지 열람한 것은 아니다. 기존 SVG 3개를 PNG로 만들어 우려 지점을 재확인했다.
- 기존 UPGRADE 117·HOLD 10의 계획은 유지했다. `EXEMPT`를 해설 수정 완료로 변경하지 않았다. 수학 HOLD(Q12 2025 순천고 도로망 87/89 등)는 해제하지 않았다.

## 해설 MD → 현행 JS 반영

- 2023 복성고 2학기 중간 Q19·Q20은 감사 MD의 학생용 개선 논지를 현재 JS `solution`에 반영했다. Q19의 `0.8664`는 표준정규표를 쓰는 근삿값이며, 정확 이항구간 확률은 독립 계산 **0.8875113898…**임을 구별했다. Q20 (1) z=2 상위 약 2%, (2) 상위 20% 대응 z≈0.84를 설명한다.
- `git show HEAD:<JS>`와 현재 JS를 문항별 필드 대조: **Q19·Q20의 `solution`만 변경**. `content`, `choices`, `answer`, 이미지 참조와 문항 수는 동일. `node --check`와 `git diff --check`는 완료.
- 이 두 문항의 최종 웹 해설 LaTeX·Golden/Negative는 `NOT_RUN`. 다른 UPGRADE·HOLD의 MD→JS 반영도 계속 필요하다.

## SVG 엔진 우선 6개

| 계획 | `plan-lint` | 공식 엔진 렌더 | PNG·학생 화면 | 처리 |
| --- | --- | --- | --- | --- |
| 2023 복성고 2중 Q19 | **OK** | **FAIL** `ARCHIVE_PREFLIGHT_FAIL` | NOT_RUN | VISUAL_HOLD |
| 2023 복성고 2중 Q20 (1) | **OK** | NOT_RUN | NOT_RUN | VISUAL_HOLD |
| 2023 복성고 2중 Q20 (2) | **OK** | NOT_RUN | NOT_RUN | VISUAL_HOLD |
| 2021 효천고 2기 Q03 | **OK** | NOT_RUN | 기존 SVG PNG만 열람 | VISUAL_HOLD |
| 2022 순천고 2기 Q09 | **OK** | NOT_RUN | 기존 SVG PNG만 열람 | VISUAL_HOLD |
| 2023 복성고 2중 Q16 | **OK** | NOT_RUN | 기존 SVG PNG만 열람 | VISUAL_HOLD |

- 공식 `plan-lint.cjs`에서 Q09, Q16의 `axisTickValues.x`에 들어간 **금지된 눈금 문자열 `"0"`** 오류를 확인했다. **오직 두 `plan.json`만 고쳐** 공식 lint를 재실행했고 6개 모두 `OK`가 나왔다. 손 SVG는 생성하지 않았다.
- 공식 의존성 설치(`setup-spikes.mjs`) 완료. 공식 `render.mjs`로 Q19 렌더를 시도했으나 Playwright Chromium 시작 때 `FATAL ... socket() failed: Operation not permitted (1)`가 발생했다. 엔진 결과는 `FAILED / ARCHIVE_PREFLIGHT_FAIL`. 우회 시도나 허위 PASS 없이 중단했다. 나머지 5개는 렌더 **미실행**이다.
- 원본 JS의 확률·면적은 별도 검산했다: Q19 정규근사 중앙 0.8664/정확 이항 0.887511…, Q20 우측 꼬리 0.02/0.20, Q09 중앙 음영 전체 3/8과 계수 1/2 구분, Q16 원 삼각형 면적 `(3/2)a²=1` 필요, Q03 원문이 `g(b)`·`f(a)`의 x축 순서를 고정하지 않음.
- 기존 2021 효천 Q03, 2022 순천 Q09, 2023 복성 Q16 SVG는 **600px PNG에서 우려가 실제로 보임**. 엔진 대체본이 통과하기 전까지 기존 SVG를 교체하지 않는다.

## 참조 경로 정적 감사(104개 시험지)

- 전체 이미지 참조 **764개** 중 `archive/assets/...` Git 추적 경로가 있는 것 **758개**, 없는 것 **6개**. 후자 중 **5개**는 저장소 루트 `assets/...`에 존재하므로 단순 누락 확정 금지. **1개**는 두 경로에 모두 없다.
- 1학기 중간 `21_매산여고` Q13 `assets/solutions/.../q13_paths.svg`: 루트 `assets`에만 있음.
- 1학기 중간 `22_효천고` Q13 `assets/solutions/.../q13-solution.svg`: 루트 및 `archive/assets`에 없음. 같은 시험지의 `archive/assets/images/.../q13.png`는 존재하지만 **해설 SVG 대체 증거는 아님**.
- 1학기 기말 `20_제일고` Q18 `assets/q18_solution.svg`: 루트 `assets`에만 있음.
- 2학기 중간 `20_매산고` Q12·Q14의 `assets/solutions/...`와 `20_제일고` Q17의 `assets/q17-solution.svg`: 모두 루트 `assets`에만 있음.
- 학생 앱의 실제 URL 해석, R2/배포 자산, 404 및 모바일 표시를 실행하지 않았으므로 이 **6개 모두 ROUTE_NOT_VERIFIED**. 두 경로 모두 없는 2022 효천 Q13은 특히 `ASSET_UNRESOLVED`로 추가 확인 필요.
- 접근성 설명 문자열의 **정적 보완 후보 222개**를 확인했다(1중 100, 1기 본래 폴더 18, 2중 54, 2기 50). `image`/`solutionImage`의 명시 `imageAlt`/`solutionImageAlt` 누락 또는 HTML 직접 삽입 `<img>`의 `alt` 누락을 센 것이다. 런타임의 자동 대체텍스트가 처리하는 경우가 있을 수 있으므로 **실제 접근성 FAIL 222건으로 확정하지 않는다**. 이 중 1학기 후보는 118건이며 학생 렌더에서 각자 확인해야 한다.

## 작업량·미해결·출고 현황

| 지표 | 현재 검증된 결과 |
| --- | --- |
| 전체 시험지 인벤토리 | 104/104 파싱 |
| 전체 문항 인벤토리 | 2,323/2,323 파싱 (기존 제시 2,324와 1개 차이) |
| 1학기 전수 시각·모바일 최종 PASS | **0/60**, NOT_RUN |
| 기존 SVG | 528개 문항 참조를 수정 없이 유지; 그중 2020 매산여고 4개는 600px PNG/수학 의미 대조 |
| 신규·수정 SVG / 원본 PNG 복구 | **0 / 0 / 0** |
| 이번 6개 공식 plan lint | **6 OK / 0 FAIL** |
| 이번 6개 공식 엔진 렌더 | **0 PASS / 1 FAIL / 5 NOT_RUN** |
| 승인·게시·JS 그림 연결 | 0; NOT_RUN |
| 수학 HOLD | 기존 10건 미해제 (그중 2025 순천고 도로망 해결 전 제작 금지) |
| 시각자료 HOLD | 우선 6개 엔진 미검증 + 정적 자산경로 의심 6건 (중복/문항별 별도 추적) |
| 학생 PC/320~360px/Golden·Negative | NOT_RUN |
| 인쇄본 대조 | PDF 미확보 항목 SOURCE_NOT_VERIFIED |

다음 실행환경에서 Chromium 사용 권한이 확보되면 기존 6개 `item.json`·`plan.json`으로 공식 엔진 렌더 → 600px PNG 눈검수 → 승인된 SVG만 게시 → 학생 모드/모바일/Golden·Negative 순으로 재개한다. 엔진 미지원은 임의 SVG 제작 없이 이유와 plan을 남긴다. 전체 1학기 이미지 실제 시각 열람은 별도 대형 묶음으로 이어야 한다.
