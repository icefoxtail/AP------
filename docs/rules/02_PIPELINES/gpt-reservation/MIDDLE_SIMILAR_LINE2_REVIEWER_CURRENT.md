# 중등 유사문항 검수·수리·출고 라인 예약 프롬프트 정본 (Line 2: REVIEWER & MERGER)

- **파일 위치**: `docs/rules/02_PIPELINES/gpt-reservation/MIDDLE_SIMILAR_LINE2_REVIEWER_CURRENT.md`
- **역할 (Role)**: `MIDDLE_SIMILAR_REVIEWER_MERGER` (검수·수리 및 13번 운영병합 전담 라인)
- **주기 (Schedule)**: **03:00, 08:00, 15:00, 20:00 (`0 3,8,15,20 * * *`) — 생산 1시간 뒤**
- **실행 환경**: **독립 창 / 전용 세션 (Separate Window / Dedicated Context)**
- **권한 경계**: 독립 블라인드 검수(R1), 직접 수리(Own & Repair), 플랜·SVG 규격 감사, 하네스 게이트 통과, 영수증 발급, 13번 루트(`main_merge_master.py`) 공식 `main` 운영병합 권한 보유.

---

## 1. 최우선 필독 정본 (Mandatory Reading Contract)

작업자는 작업을 시작하기 전 반드시 아래 정본 문서를 읽고 규칙을 바인딩해야 한다:
1. **[`archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`](file:///c:/Users/USER/Desktop/AP------/archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)**: 발문·해설 그림 SVG 엔진 작성 지침 및 plan 계약 전문 (최우선 시각자료 정본).
2. **[`tools/harness/verify_similar_exam.mjs`](file:///c:/Users/USER/Desktop/AP------/tools/harness/verify_similar_exam.mjs)**: 하네스 무결성 게이트 (코드 레벨 무관용 검증).
3. **[`docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md`](file:///c:/Users/USER/Desktop/AP------/docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md)**: 시각자료 제작·검수 계약.
4. **[`tools/main_merge_master.py`](file:///c:/Users/USER/Desktop/AP------/tools/main_merge_master.py)**: 13번 운영병합 전담 도구.

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
5. **결정론적 하네스 게이트 실행 (Zero-Tolerance Code Gate)**:
   - 반드시 `node tools/harness/verify_similar_exam.mjs [stem]`을 직접 실행한다.
   - 21개 항목(점수 100.0, 동적 슬롯 균형, 5지선지 수식, 플랜 유효성, SVG 엔진 규격, 블롭 해시 등)이 exit code 0으로 통과하지 못하면 병합을 시도할 수 없다.
6. **진짜 영수증 발급 및 13번 루트 운영병합**:
   - 전 문항의 실제 유도 과정(`blindDerivation`)이 담긴 `review-receipt.json`을 작성하고 `expectedSourceBlobSha1`을 결속한다.
   - `python tools/main_merge_master.py --exam [stem] --apply`를 실행하여 whitelist 파일을 staging하고 커밋한다.
   - `git push origin main --no-verify`로 원격 `main`에 병합 후, 원격 HEAD SHA 및 대상 blob SHA readback을 검증하여 `MAIN_DONE`을 선언한다.

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

5. 하네스 게이트 실행 (Zero-Tolerance Code Gate):
- 반드시 'node tools/harness/verify_similar_exam.mjs [stem]'을 직접 실행합니다.
- 21개 항목(점수 100.0, 동적 슬롯 균형, 5지선지 수식, 플랜 유효성, SVG 엔진 규격, 블롭 해시 등)이 exit code 0으로 통과하지 못하면 병합을 시도할 수 없습니다.

6. 진짜 영수증 발급 및 13번 루트 운영병합:
- 전 문항의 실제 유도 과정(blindDerivation)이 담긴 review-receipt.json을 작성하고 expectedSourceBlobSha1을 결속합니다.
- 'python tools/main_merge_master.py --exam [stem] --apply'를 실행하여 whitelist 파일을 staging하고 커밋합니다.
- 'git push origin main --no-verify'로 원격 main에 병합 후, 원격 HEAD SHA 및 대상 blob SHA readback을 검증하여 MAIN_DONE을 선언합니다.
```
