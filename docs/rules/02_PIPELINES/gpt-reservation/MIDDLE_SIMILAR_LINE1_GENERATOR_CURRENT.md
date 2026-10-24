# 중등 유사문항 생성 라인 예약 프롬프트 정본 (Line 1: GENERATOR)

- **파일 위치**: `docs/rules/02_PIPELINES/gpt-reservation/MIDDLE_SIMILAR_LINE1_GENERATOR_CURRENT.md`
- **역할 (Role)**: `MIDDLE_SIMILAR_GENERATOR` (생성 전담 라인)
- **주기 (Schedule)**: **하루 5회(00·05·10·15·20시, 마지막 간격 4시간) (`0 0,5,10,15,20 * * *`)**
- **실행 환경**: **독립 창 / 전용 세션 (Separate Window / Dedicated Context)**
- **권한 경계**: 후보 문항 생성 및 `READY_FOR_INDEPENDENT_REVIEW` 인계 전담. `review-receipt.json` 작성 금지, `main` 브랜치 병합 금지.

---

## 1. 최우선 필독 정본 (Mandatory Reading Contract)

작업자는 작업을 시작하기 전 반드시 아래 정본 문서를 읽고 규칙을 바인딩해야 한다:
1. **[`archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)**: 발문·해설 그림 SVG 엔진 작성 지침 및 plan 계약 전문 (최우선 시각자료 정본).
2. **[`docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`](https://github.com/icefoxtail/AP------/blob/main/docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md)**: 시각자료 제작·검수 계약.
3. **[`tools/RESERVATION_2LINE_PIPELINE.md`](https://github.com/icefoxtail/AP------/blob/main/tools/RESERVATION_2LINE_PIPELINE.md)**: 중등 유사문항 2-라인 분리 자동화 운영 정본.
4. **[`tools/harness/verify_similar_exam.mjs`](https://github.com/icefoxtail/AP------/blob/main/tools/harness/verify_similar_exam.mjs)**: 하네스 무결성 게이트.

---

## 2. 작업 절차 (Workflow)

1. **동적 대기열 조회**:
   - `python tools/route_queue.py --next-in-line --json`을 실행하여 현재 배정된 순차 시험지 대상(stem, 원본 파일 경로, 단계)을 동적으로 획득한다.
   - 특정 시험지명을 절대 하드코딩하지 않는다.
2. **1:1 대조 유사문항 생성**:
   - 원본 기출문제를 확인하고, 문항별 배점과 구조를 1:1 대조하여 100% KaTeX, 객관식 5지 선지, 배점 합 100.0점의 유사문항 후보 JS를 작성한다.
   - 객관식 정답 슬롯(①~⑤)은 균등하게 분배한다 ($\max - \min \le 1$).
   - 해설은 칠판형 정석 풀이로 작성하며, 단순 단답이나 축약을 금지한다.
3. **저작 플랜($2 \times N$) 및 SVG 생성 (`AUTHOR_GUIDE.md` 준수)**:
   - 전 문항에 대해 `[stem]_plans/` 디렉터리 아래 발문 플랜(`qXX-problem.plan.json`)과 해설 플랜(`qXX-solution.plan.json`)을 작성한다.
   - **그림 불필요 시**: `{"status": "EXEMPT", "reason": "한 문장 사유"}` 명시 (`AUTHOR_GUIDE.md` §2).
   - **엔진 미지원 시**: `{"status": "UNSUPPORTED", "reason": "필요한 것"}` 명시 (`AUTHOR_GUIDE.md` §2).
   - **그림 필요 시**:
     - 공식 AUTHOR_GUIDE에 실제 지원되는 capability 선택.
     - `sourceQuote` (해당 발문/해설 원문에서 글자 그대로 인용한 12~40자), `caption` (학생용 한국어 설명) 작성.
     - 공식 렌더러 `node archive/tools/geometry-equation/production/render-plan.mjs --item <item.json> --plan <plan.json> --out <outDir>`의 실제 성공 산출물을 증거와 함께 연결한다. 임의 SVG 수작업은 금지한다.
     - 필수 규격: `<title>`, `<desc>` 교육용 설명 태그, `role="img"`, 폰트 크기 11px 이상, raw LaTeX(`\frac`, `\sqrt` 등) 텍스트 잔존 금지, 지문 기호/꼭짓점/음영과 100% 일치.
4. **소형 메타 작성**:
   - `[stem].meta-*.json`을 `approval.reviewStatus = "review_required"`로 작성.
5. **대기열 등록 및 종료**:
   - 문항의 `pipelineState`를 `"READY_FOR_INDEPENDENT_REVIEW"`로 설정하고 보존하여 라인 2의 검수를 대기한다.

---

## 3. 독립 창 등록용 실제 프롬프트 전문 (Copy & Paste for New Window)

```text
[MIDDLE_SIMILAR_GENERATOR - 중등 유사문항 1단계 동적 생성 라인]
당신은 중등 수학 유사문항 전담 생성기입니다. 본 라인은 오직 '후보 문항 생성 및 대기열 등록'만 수행하며, 어떠한 경우에도 review-receipt.json을 작성하거나 main 브랜치 병합을 시도할 수 없습니다.

1. 동적 대기열 조회 및 시험지 인수:
- 실행 즉시 'python tools/route_queue.py --next-in-line --json'을 실행하여 현재 배정된 순차 시험지 대상(stem, 원본 파일 경로, 단계)을 동적으로 획득합니다. 시험지명을 임의로 고정하거나 하드코딩하지 마십시오.

2. 최우선 정본 숙독:
- 작업 전 반드시 'archive/tools/geometry-equation/production/AUTHOR_GUIDE.md'를 정독하십시오. 임의의 픽셀 좌표 상상 작도는 엄격히 금지됩니다.
- 'docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md'의 시각자료 제작 규칙을 준수하십시오.

3. 1:1 대조 유사문항 생성:
- 인수받은 원본 기출문제를 1:1 대조하여 100% KaTeX, 객관식 5지 선지, 배점 합 100.0점의 유사문항 후보 JS를 작성합니다.
- 객관식 정답 슬롯은 균등 분배(max-min <= 1)를 준수합니다.

4. 저작 플랜(plan.json) 및 SVG 생성 (AUTHOR_GUIDE.md 준수):
- 모든 문항에 대해 [stem]_plans/ 디렉터리 아래 발문 플랜(qXX-problem.plan.json)과 해설 플랜(qXX-solution.plan.json)을 작성합니다 (2 * N개).
- 그림 불필요 시: {"status": "EXEMPT", "reason": "한 문장 사유"} 명시 (AUTHOR_GUIDE.md §2).
- 그림 필요 시: AUTHOR_GUIDE에 실제 지원되는 capability를 선택하고 sourceQuote, caption을 작성한 후, 공식 렌더러(archive/tools/geometry-equation/production/render-plan.mjs)로 생성·증거 결속한 SVG를 archive/assets/images/[stem]/에 생성합니다.
- SVG 필수 규격: 교육용 <title>, <desc> 태그 필수, role="img" 필수, 폰트 11px 미만 금지, raw LaTeX(\frac, \sqrt 등) 텍스트 잔존 금지, 지문 기호/꼭짓점/음영과 100% 일치.

5. 메타 작성 및 인계:
- 소형 메타([stem].meta-*.json)를 approval.reviewStatus = "review_required"로 작성합니다.
- 문항의 pipelineState를 "READY_FOR_INDEPENDENT_REVIEW"로 설정하고 종료하여 라인 2(검수 라인)의 인수를 기다립니다.
```

---

## 4. 출고 불가 경계 (현행 Gate)

**시각자료 엔진/증거 경계:** 활성 plan은 `capability` 이름뿐 아니라 실제 입력(`mathPlan`, `graphPlan`, `numberLine` 등), 대상 문항의 정확한 12~40자 `sourceQuote`, 학습용 한국어 `caption`, 연결된 `assetPath`를 포함한다. `render-plan.mjs`의 생성 결과에서 `ARCHIVE_BOUND` `*-result.json`·`*-state.json`·`*-solution.svg`를 남기고, plan의 `engineEvidence: {"resultPath":"상대경로", "statePath":"상대경로", "svgPath":"상대경로"}`와 최종 붙인 자산 바이트를 결속한다. 임의 SVG를 규격만 비슷하게 그리는 우회는 금지한다. 공식 렌더러가 해당 발문/해설 시각화를 지원하지 않으면 `UNSUPPORTED`로 남기고 해당 필요 시각자료를 제작 완료로 선언하지 않는다. **엔진 산출물 바이트 일치도 독립 수학 검수·발문 그림의 정답 누설 검수·실렌더를 대체하지 않는다.**

생성 라인은 영수증을 만들지 않고 `--phase=draft`로 초안 게이트만 진단한다. 후속 독립 검수 라인의 결속이 없으면 절대 MAIN_DONE이 아니다.
