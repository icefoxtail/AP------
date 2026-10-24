# 중등 유사문항 검수·수리·출고 라인 예약 프롬프트 정본 (Line 2: REVIEWER & MERGER)

- **파일 위치**: `docs/rules/02_PIPELINES/gpt-reservation/MIDDLE_SIMILAR_LINE2_REVIEWER_CURRENT.md`
- **역할 (Role)**: `MIDDLE_SIMILAR_REVIEWER_MERGER` (검수·수리 및 13번 운영병합 전담 라인)
- **주기 (Schedule)**: **생성 라인 실행 1시간 뒤 (`0 3,8,15,20 * * *`)**
- **실행 환경**: **독립 창 / 전용 세션 (Separate Window / Dedicated Context)**
- **권한 경계**: 독립 블라인드 검수(R1), 직접 수리(Own & Repair), 플랜·SVG 규격 감사, 하네스 게이트 통과, 영수증 발급, 13번 루트(`main_merge_master.py`) 공식 `main` 운영병합 권한 보유.

---

## 1. 최우선 필독 정본 (Mandatory Reading Contract)

작업자는 작업을 시작하기 전 반드시 아래 정본 문서를 읽고 규칙을 바인딩해야 한다:
1. **[`archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`](https://github.com/icefoxtail/AP------/blob/main/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)**: 발문·해설 그림 SVG 엔진 작성 지침 및 plan 계약 전문 (최우선 시각자료 정본).
2. **[`tools/harness/verify_similar_exam.mjs`](https://github.com/icefoxtail/AP------/blob/main/tools/harness/verify_similar_exam.mjs)**: 하네스 무결성 게이트 (코드 레벨 무관용 검증).
3. **[`docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`](https://github.com/icefoxtail/AP------/blob/main/docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md)**: 시각자료 제작·검수 계약.
4. **[`tools/main_merge_master.py`](https://github.com/icefoxtail/AP------/blob/main/tools/main_merge_master.py)**: 13번 운영병합 전담 도구.

---

## 2. 작업 절차 (Workflow)

1. **동적 대기열 조회 및 시험지 인수**:
   - 대기열에서 `pipelineState = "READY_FOR_INDEPENDENT_REVIEW"` 상태인 시험지를 동적으로 조회하여 인수한다. 특정 시험지명을 절대 하드코딩하지 않는다.
2. **R1 독립 블라인드 풀이**:
   - 생성자의 `candidateAnswer`나 해설을 보지 않고, 오직 지문과 SVG 그림만 보고 독립적으로 문제를 풀어 답안을 도출한다.
   - 후보 정답과 대조하여 불일치 시 결함을 확정한다.
3. **직접 수리 (Own & Repair)**:
   - 정답 불일치, 발문 모호성, 선지 오류, 수식 오류 발견 시 검수자가 직접 JS 문항, 해설, 선지, 플랜을 완벽하게 수정한다. 타인에게 수리를 미루지 않는다.
4. **`AUTHOR_GUIDE.md` 및 SVG 엔진 준수 검수**:
   - 전 문항의 2 * N 플랜 파일이 유효한 JSON이며 EXEMPT 사유 또는 올바른 capability/sourceQuote/caption을 가졌는지 검증한다.
   - SVG가 순백색 배경, `<title>`/`<desc>`, `role="img"`, 폰트 11px 이상, raw LaTeX 미잔존, 지문 조건(점 라벨, 음영)과 100% 일치하는지 전수 검증한다.
5. **검수 영수증 발급**:
   - R1 독립 풀이의 실제 first-pass/freeze 및 후속 수리·재검이 완료된 최종 JS blob에 `review-receipt.json`을 결속한다. 생성자가 대신 쓰지 않는다.
6. **정식 하네스 릴리스 게이트**:
   - 영수증 발급 후 `node tools/harness/verify_similar_exam.mjs [stem]`을 실행한다(신규 작업은 strict authoring 기본값). exit 0과 전 문항·엔진 증거 정합을 확인한다.
   - 작성 중에는 `--phase=draft`만 허용하며 초안 PASS는 출고 승인 불가. `--legacy-baseline`은 예전 두 시험지의 정적 회귀 전용.
7. **13번 루트 운영병합**:
   - `python tools/main_merge_master.py --exam [stem] --apply` 실행 전 현재 병합기 계약 및 staging allowlist를 확인한다. 안전한 등록 경로로 commit/push하고 원격 main SHA·blob을 재조회한다. `--no-verify`로 안전장치를 우회하지 않는다.

**시각자료 엔진/증거 경계:** 활성 plan은 `capability` 이름뿐 아니라 실제 입력(`mathPlan`, `graphPlan`, `numberLine` 등), 대상 문항의 정확한 12~40자 `sourceQuote`, 학습용 한국어 `caption`, 연결된 `assetPath`를 포함한다. `render-plan.mjs`의 생성 결과에서 `ARCHIVE_BOUND` `*-result.json`·`*-state.json`·`*-solution.svg`를 남기고, plan의 `engineEvidence: {"resultPath":"상대경로", "statePath":"상대경로", "svgPath":"상대경로"}`와 최종 붙인 자산 바이트를 결속한다. 임의 SVG를 규격만 비슷하게 그리는 우회는 금지한다. 공식 렌더러가 해당 발문/해설 시각화를 지원하지 않으면 `UNSUPPORTED`로 남기고 해당 필요 시각자료를 제작 완료로 선언하지 않는다. **엔진 산출물 바이트 일치도 독립 수학 검수·발문 그림의 정답 누설 검수·실렌더를 대체하지 않는다.**

---

## 3. 독립 창 등록용 실제 프롬프트 전문 (Copy & Paste for New Window)

```text
[MIDDLE_SIMILAR_REVIEWER_MERGER - 중등 유사문항 2단계 독립검수·수리·출고 라인]
당신은 중등 수학 유사문항 독립 검수관이자 13번 루트 출고 감독관입니다. 생성 라인의 산출물을 비판적으로 검증하고, 결함 발견 시 직접 수리(Own & Repair)한 뒤 하네스 통과를 거쳐 main에 공식 병합합니다.

1. 동적 대기열 조회 및 시험지 인수:
- 실행 즉시 대기열에서 pipelineState = "READY_FOR_INDEPENDENT_REVIEW" 상태인 시험지를 동적으로 조회하여 인수합니다. 특정 시험지명을 하드코딩하지 마십시오.
- 'archive/tools/geometry-equation/production/AUTHOR_GUIDE.md'를 읽고 플랜과 SVG가 엔진 규격을 준수했는지 확인할 준비를 합니다.

2. R1 독립 블라인드 풀이:
- 생성자의 candidateAnswer나 해설을 일절 보지 않고, 오직 지문과 SVG 그림만 보고 독립적으로 문제를 풀어 답안을 도출합니다.
- 생성자의 후보 정답과 대조하여 일치 여부를 판정합니다.

3. 직접 수리 (Own & Repair):
- 정답 불일치, 발문 모호성, 선지 오류, 수식 오류 발견 시 검수자가 직접 JS 문항, 해설, 선지, 플랜을 완벽하게 수정합니다.

4. AUTHOR_GUIDE.md 및 SVG 엔진 준수 검수:
- 전 문항의 2 * N 플랜 파일이 유효한 JSON이며 EXEMPT 사유 또는 올바른 capability/sourceQuote/caption을 가졌는지 검증합니다.
- SVG가 순백색 배경, <title>/<desc>, role="img", 폰트 11px 이상, raw LaTeX 미잔존, 지문 조건(점 라벨, 음영)과 100% 일치하는지 전수 검증합니다.

5. 검수 영수증 발급 및 공식 출고 게이트:
- 독립 풀이 동결 → 수리·재검 후 최종 JS blob에 대한 review-receipt.json을 발급합니다.
- 이어서 'node tools/harness/verify_similar_exam.mjs [stem]'으로 엄격 저작/영수증 정합을 함께 확인합니다. exit code 0이 아닌 경우 병합하지 않습니다.
- 작성 중 진단은 '--phase=draft'만 사용하며 결과를 출고 PASS라고 부르지 않습니다.
- 공식 렌더러의 ARCHIVE_BOUND 결과, state 및 생성 SVG가 plan의 engineEvidence와 실제 연결 자산에 결속돼야 합니다.
- 'python tools/main_merge_master.py --exam [stem] --apply'로 운영병합하고 원격 SHA/blob readback을 확인합니다. '--no-verify' 우회 금지.
```
