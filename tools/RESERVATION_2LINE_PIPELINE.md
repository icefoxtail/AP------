# 중등 유사문항 2-라인 분리 자동화 운영 정본 (v1.1)

> **최우선 준수 정본**: 본 파이프라인의 모든 생성 및 검수 작업자는 **[`archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)**(발문·해설 그림 SVG 엔진 작성 지침 및 plan 계약 전문)와 **[`docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`](https://github.com/icefoxtail/AP------/blob/main/docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md)**을 필독하고 100% 준수해야 한다.

---

## 1. 개요 및 설계 원칙

본 정본은 중등 유사문항 자동 생산의 품질 무결성과 독립성을 보장하기 위해 **생성 라인**과 **검수·수리·출고 라인**을 물리적으로 완전히 분리된 2개의 예약 라인으로 운영하는 규칙을 정의한다.

- **원칙 1 (물리적 분리)**: 생성 모델과 검수 모델은 서로 다른 창/세션/예약으로 실행된다.
- **원칙 2 (공식 SVG 엔진 및 플랜 계약 의무화)**: 시각 자료(도형, 그래프, 수직선 등)는 AI가 임의로 픽셀 좌표를 상상해서 그리는 것을 엄격히 금지하며, 반드시 `AUTHOR_GUIDE.md`의 실행 가능한 plan을 작성하고 공식 엔진(`archive/tools/geometry-equation/production/render-plan.mjs`)으로 실제 렌더한 결과·상태·SVG 바이트를 검증해야 한다. 스타일만 흉내 낸 임의 SVG는 출고 근거가 아니다.
- **원칙 3 (생성자 자가 영수증 금지)**: 생성 라인은 `review-receipt.json`을 작성하거나 `main` 병합을 시도할 수 없다. 생성 라인의 산출물은 오직 `READY_FOR_INDEPENDENT_REVIEW` 상태로 대기한다.
- **원칙 4 (검수자의 직접 수리 및 출고)**: 검수 라인은 지문과 시각 에셋만으로 전 문항 독립 블라인드 풀이(R1)를 수행하고, 결함 발견 시 직접 문항을 수리(Own & Repair)한 후 진짜 영수증을 발행하여 `main`에 최종 운영병합(Route 13)한다.

---

## 2. 2-라인 시간표 배정 (Schedule Specification)

| 구분 | 예약 라인 명칭 | Cron 스케줄 | 실행 주기 | 주요 역할 |
| :--- | :--- | :--- | :--- | :--- |
| **라인 1** | **`MIDDLE_SIMILAR_GENERATOR`** | `0 0,5,10,15,20 * * *` | 하루 5회(00·05·10·15·20시, 마지막 간격 4시간) | 순차 큐에서 다음 시험지 인수 $\to$ 유사문항 생성 $\to$ `AUTHOR_GUIDE.md` 기반 plan 작성 & SVG 렌더 $\to$ `READY_FOR_INDEPENDENT_REVIEW` 패킷 보존 |
| **라인 2** | **`MIDDLE_SIMILAR_REVIEWER_MERGER`** | `0 1,6,11,16,21 * * *` | 라인 1 실행 1시간 뒤 | `READY_FOR_INDEPENDENT_REVIEW` 인수 $\to$ R1 블라인드 풀이 $\to$ 결함 수리 $\to$ `AUTHOR_GUIDE.md` 규격 검수 $\to$ 영수증 발급 $\to$ 하네스 최종 게이트 통과 $\to$ 13번 루트 main 병합 |

---

## 3. 라인별 상세 워크플로

### [라인 1] 생성 라인 (Generator)
1. **필독 정본 숙독**:
   - `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`
   - `docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`
2. **시험지 인수 및 문항 초안 생성**:
   - `tools/route_queue.py`를 조회하여 진도 단계(Step 01 ~ Step 12)의 다음 원본 시험지를 확인한다.
   - 원본 기출 문제를 대조하여 100% KaTeX, 5지 선지, 배점 합 100.0 유사문항 후보 JS를 작성한다.
3. **SVG 및 플랜 저작 (`AUTHOR_GUIDE.md` 준수)**:
   - 모든 문항에 대해 발문 플랜(`qXX-problem.plan.json`)과 해설 플랜(`qXX-solution.plan.json`)을 `[stem]_plans/` 디렉터리에 작성한다 ($2 \times N$ 플랜).
   - **그림 불필요 시 (`EXEMPT`)**: `{"status": "EXEMPT", "reason": "한 문장 사유"}` 명시 (§2).
   - **엔진 미지원 시 (`UNSUPPORTED`)**: `{"status": "UNSUPPORTED", "reason": "필요한 것"}` 명시 (§2).
   - **그림 필요 시**:
     - AUTHOR_GUIDE의 실제 지원 capability 선택.
     - `sourceQuote` (지문/해설의 12~40자 정확한 인용), `caption` (학생용 한국어 한 문장 설명) 작성.
     - 공식 렌더러 `node archive/tools/geometry-equation/production/render-plan.mjs --item <item.json> --plan <plan.json> --out <outDir>`를 실제 실행하고 성공 결과·최종 SVG 바이트를 결속한다. 임의 수작업 SVG는 출고 금지.
     - SVG 내에 raw LaTeX(`\frac`, `\sqrt` 등) 잔존 금지, 폰트 크기 11px 이상 유지, `<title>` 및 `<desc>` 교육용 설명 태그, `role="img"` 필수 적용.
4. **소형 메타 작성**:
   - `[stem].meta-*.json`을 `approval.reviewStatus = "review_required"`로 작성.
5. **인계 완료**:
   - 커밋하지 않고 작업 브랜치/대기열에 `READY_FOR_INDEPENDENT_REVIEW`로 보존.

---

### [라인 2] 검수·수리·출고 라인 (Reviewer & Merger)
1. **시험지 인수**:
   - 대기열에서 `READY_FOR_INDEPENDENT_REVIEW` 상태의 시험지를 인수한다.
2. **R1 독립 블라인드 풀이**:
   - `candidateAnswer`나 해설을 보지 않고, 오직 지문과 SVG 그림만으로 독립 답안을 도출한다.
   - 후보 정답과 대조하여 불일치 시 결함을 확정한다.
3. **직접 수리 (Own & Repair)**:
   - 정답 불일치, 수식 오류, 지문 모호성, 선지 오류 발견 시 검수자가 직접 JS 문항, 해설, 선지를 수정한다.
4. **`AUTHOR_GUIDE.md` 및 SVG 엔진 준수 검수**:
   - 모든 플랜 파일이 `AUTHOR_GUIDE.md` 규격(유효한 capability, sourceQuote, caption, EXEMPT 사유)을 충족하는지 검수한다.
   - SVG가 지문의 점/꼭짓점, 음영 영역, 좌표축을 정확히 표현하고 있는지 검수한다.
5. **R2 교사 판서 & R3 정본 메타 검증**:
   - 2015 교육과정 정석 풀이인지 확인하고 비약이 없도록 판서 해설을 보강한다.
   - 신규 2015 바인딩 정본 확장(`registryChanges`) 결속.
6. **영수증 발급 및 최종 게이트**:
   - R1 동결, Own & Repair, R2/R3 검수 종료 후 최종 JS blob에 `review-receipt.json` 발급.
   - `node tools/harness/verify_similar_exam.mjs [stem]`으로 정식 릴리스(strict 저작+영수증) 검증. 실패 시 병합 중단.
7. **13번 루트 운영병합**:
   - 현행 `tools/main_merge_master.py` 계약으로 staged allowlist를 구성한다. `--no-verify` 우회 없이 안전한 commit/push 후 원격 HEAD/blob readback.

**실제 신규 시험지 승인 순서:** R1 독립 답안 동결 → 결함 수리 및 수학·해설·SVG 재검 → `review-receipt.json` 발급(최종 JS blob 결속) → `node tools/harness/verify_similar_exam.mjs [stem]` 정식 릴리스 게이트(exit 0) → 13번 경로 병합. 영수증이 없는 작성 중에는 `--phase=draft`만 사용하며 이 통과를 출고 PASS로 표현하지 않는다. `--legacy-baseline`은 구형 fixture 정적 회귀 확인 전용이며 출고 승인 근거가 아니다.

**시각자료 엔진/증거 경계:** 활성 plan은 `capability` 이름뿐 아니라 실제 입력(`mathPlan`, `graphPlan`, `numberLine` 등), 대상 문항의 정확한 12~40자 `sourceQuote`, 학습용 한국어 `caption`, 연결된 `assetPath`를 포함한다. `render-plan.mjs`의 생성 결과에서 `ARCHIVE_BOUND` `*-result.json`·`*-state.json`·`*-solution.svg`를 남기고, plan의 `engineEvidence: {"resultPath":"상대경로", "statePath":"상대경로", "svgPath":"상대경로"}`와 최종 붙인 자산 바이트를 결속한다. 임의 SVG를 규격만 비슷하게 그리는 우회는 금지한다. 공식 렌더러가 해당 발문/해설 시각화를 지원하지 않으면 `UNSUPPORTED`로 남기고 해당 필요 시각자료를 제작 완료로 선언하지 않는다. **엔진 산출물 바이트 일치도 독립 수학 검수·발문 그림의 정답 누설 검수·실렌더를 대체하지 않는다.**

