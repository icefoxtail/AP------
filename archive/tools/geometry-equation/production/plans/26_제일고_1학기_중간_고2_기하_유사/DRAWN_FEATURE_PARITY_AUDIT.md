# 26_제일고_1학기_중간_고2_기하_유사 — DRAWN_FEATURE_PARITY 구조 검수 (2026-11-27)

- 대상: `archive/exams/similar/high/h2/1mid/26_제일고_1학기_중간_고2_기하_유사.js`의 23문항 × 문제/해설 2축 = **46축**. 원본 발문·해설과 `archive/assets/images/26_제일고_1학기_중간_고2_기하/`의 사용 가능한 원본 그림을 대조했다.
- 이 경로에는 **실행 가능한 production plan만** 둔다. 아래 `EXEMPT`는 이전 시험지 plan의 판단을 확인한 것이며 새 EXEMPT/UNSUPPORTED JSON을 생산 계획 수로 세지 않는다.
- **shallow 및 full plan-lint PASS는 Chrome 렌더·PNG·학생 화면·A4 검수 완료를 뜻하지 않는다.** Chromium 바이너리가 실행되지 않아 전 축 `RENDER_NOT_RUN`이다. 본 표의 `FIELD_1:1_PASS`는 발문-렌더 필드 간 정적 대조에 한정한다.
- 기본 배경·면 채움은 **없음**. 기하 q12의 `LIGHT`만 원본의 넓이 영역을 나타내는 의도적 채움이다. 기존 SVG/PNG 파일을 고치거나 손 SVG를 작성하지 않았다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint (shallow/full) | DRAWN_FEATURE_PARITY |
|:--|:--|:--|:--|:--|:--|:--|
| 기하/q01 | 문제 | EXEMPT 검토 — 발문이 식과 문장만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q01 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q01-solution.plan.json](./q01-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q02 | 문제 | 준선에 내린 수선 M·N, 직각 표식, AM=9·AB=15 보존 | `ellipse-figure-v1` | [q02-problem.plan.json](./q02-problem.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q02 | 해설 | 초점-준선 보조선·수선·AM=9·BN=6 보존 | `ellipse-figure-v1` | [q02-solution.plan.json](./q02-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q03 | 문제 | EXEMPT 검토 — 발문이 식과 문장만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q03 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q03-solution.plan.json](./q03-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q04 | 문제 | EXEMPT 검토 — 발문이 식과 점의 좌표만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q04 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q04-solution.plan.json](./q04-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q05 | 문제 | EXEMPT 검토 — 발문이 식과 보기 문장만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q05 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q05-solution.plan.json](./q05-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q06 | 문제 | EXEMPT 검토 — 발문이 평면의 결정조건을 말로 묻는 문항이라 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q06 | 해설 | EXEMPT 검토 — 각 보기를 평면의 결정조건 네 가지에 대조하는 판정이 핵심이고 그림이 보태는 관계가 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q07 | 문제 | EXEMPT 검토 — 발문이 식과 조건만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q07 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q07-solution.plan.json](./q07-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q08 | 문제 | EXEMPT 검토 — 발문이 초점의 좌표와 장축의 길이만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q08 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q08-solution.plan.json](./q08-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q09 | 문제 | EXEMPT 검토 — 발문이 두 곡선의 식만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q09 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q09-solution.plan.json](./q09-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q10 | 문제 | 원본과 다른 정사면체 꼭짓점 위치·불필요한 검은 표제 → BCDA 재배치·표제 삭제 | `solid-figure-v1` | [q10-problem.plan.json](./q10-problem.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q10 | 해설 | CD 중점 M과 AM·BM 수직 표식, 꼭짓점 배치·표제 수정 | `solid-figure-v1` | [q10-solution.plan.json](./q10-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q11 | 문제 | EXEMPT 검토 — 발문이 식을 유도하는 과정의 빈칸을 묻는 문항이라 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q11 | 해설 | EXEMPT 검토 — 해설이 거리 정의에서 제곱을 거쳐 식을 정리하는 대수 계산이고 그림이 보태는 관계가 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q12 | 문제 | 원본 면적 도형 음영 유지; ∠F′PF 직각 표식 엔진 미지원 | `ellipse-figure-v1` | [q12-problem.plan.json](./q12-problem.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic의 세 점(F′,P,F) 사이 right-angle 호/사각형 표시; RENDER_NOT_RUN |
| 기하/q12 | 해설 | 면적 120인 삼각형만 채움 유지; ∠F′PF=90° 표식 누락 | `ellipse-figure-v1` | [q12-solution.plan.json](./q12-solution.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic의 세 점(F′,P,F) 사이 90° 직각 정사각형 표시; RENDER_NOT_RUN |
| 기하/q13 | 문제 | EXEMPT 검토 — 발문이 두 곡선의 식만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q13 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q13-solution.plan.json](./q13-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q14 | 문제 | EXEMPT 검토 — 발문이 타원과 직선의 식만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q14 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q14-solution.plan.json](./q14-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q15 | 문제 | 접선 l과 수선의 발 H·Q·직각 표식 일치 | `ellipse-figure-v1` | [q15-problem.plan.json](./q15-problem.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q15 | 해설 | 접선 l·수선 H·Q와 직각 표식 일치 | `ellipse-figure-v1` | [q15-solution.plan.json](./q15-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q16 | 문제 | EXEMPT 검토 — 발문이 식과 길이 조건만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q16 | 해설 | 수선의 발 H가 단순 POINT였음 → FOOT + rightAngle로 보정 | `ellipse-figure-v1` | [q16-solution.plan.json](./q16-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q17 | 문제 | 접점 P·Q, 접선 2개, 초점 F·삼각형 연결 관계 확인 | `ellipse-figure-v1` | [q17-problem.plan.json](./q17-problem.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q17 | 해설 | 접점·초점과 PQ=8·QF=9/5·PF=41/5 길이 라벨 확인 | `ellipse-figure-v1` | [q17-solution.plan.json](./q17-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q18 | 문제 | EXEMPT 검토 — 발문이 초점의 좌표와 거리 조건만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q18 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q18-solution.plan.json](./q18-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q19 | 문제 | AF⊥FF′의 직각 표식 엔진 미지원; AF=7·AF′=25 유지 | `ellipse-figure-v1` | [q19-problem.plan.json](./q19-problem.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic의 점 F에서 AF와 FF′ 사이 직각 정사각형; RENDER_NOT_RUN |
| 기하/q19 | 해설 | 불필요한 삼각형 면 채움 LIGHT→NONE; ∠AFF′ 직각 표식 미지원 | `ellipse-figure-v1` | [q19-solution.plan.json](./q19-solution.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic의 점 F에서 AF와 FF′ 사이 직각 정사각형; RENDER_NOT_RUN |
| 기하/q20 | 문제 | EXEMPT 검토 — 발문이 식과 점의 좌표만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q20 | 해설 | 기존 구식 메타 제거·원문 수학관계와 도형 렌더 필드 정적 대조 | `ellipse-figure-v1` | [q20-solution.plan.json](./q20-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |
| 기하/q21 | 문제 | EXEMPT 검토 — 발문이 식과 각, 넓이 조건만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q21 | 해설 | 정삼각형 APQ의 ∠APQ=60° 호·숫자 표식 미지원 | `ellipse-figure-v1` | [q21-solution.plan.json](./q21-solution.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic의 점 P에서 AP와 PQ 사이 60° 각도 호 및 숫자 라벨; RENDER_NOT_RUN |
| 기하/q22 | 문제 | 쌍곡선 P에서 접선 l과 법선의 90° 표식 미지원 | `ellipse-figure-v1` | [q22-problem.plan.json](./q22-problem.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic에서 접선과 법선이 교차하는 P의 90° 정사각형; RENDER_NOT_RUN |
| 기하/q22 | 해설 | 접선·법선 Q/R 및 OQ·OR 확인; 직각 표식 미지원 | `ellipse-figure-v1` | [q22-solution.plan.json](./q22-solution.plan.json) | PASS / PASS | **ENGINE_CAPABILITY_PENDING** — conic에서 접선과 법선이 교차하는 P의 90° 정사각형; RENDER_NOT_RUN |
| 기하/q23 | 문제 | EXEMPT 검토 — 발문이 두 곡선의 식과 장축의 길이만으로 완결되어 학생이 풀 때 필요한 그림이 없다. | 해당 없음 | — (새 JSON 없음) | N/A | EXEMPT / RENDER_NOT_RUN |
| 기하/q23 | 해설 | 계산에 불필요한 삼각형 LIGHT 면 채움 → NONE; 거리 7·13·10 라벨 유지 | `ellipse-figure-v1` | [q23-solution.plan.json](./q23-solution.plan.json) | PASS / PASS | FIELD_1:1_PASS (정적) / RENDER_NOT_RUN |

**합계:** 46축 중 실행 가능 plan **28**, 정적 필드 parity **21**, ENGINE_CAPABILITY_PENDING **7**, EXEMPT **18**. 렌더 검증 **0**, RENDER_NOT_RUN **46**.

### 실행/엔진 인계

1. 파일명을 명시적으로 전달하여 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <개별 plan...>` 및 옵션 없는 full lint를 각각 실행했다. 폴더 경로만 주면 qNN 파일명 패턴이 수집되지 않으므로 개별 파일 인자 사용 필수.
2. Chromium 실행파일 부재로 화면 렌더·PNG·학생 기기·A4 검수는 `RENDER_NOT_RUN`. 렌더 담당자는 위 정적 검수와 별개로 실제 SVG/PNG를 재생성한 후 지시선·보조선·점선·직각/각도·길이·라벨·배경·불필요한 면 채움을 1:1로 확인해야 한다.
3. `ENGINE_CAPABILITY_PENDING`은 `ellipse-figure-v1`에서 임의 세 점의 두 선분 사이 각도 호·직각 사각형과 수치 라벨을 지정·검증할 필드가 없다는 뜻이다. `FOOT.rightAngle`로 표현 가능한 q02·q15·q16은 이미 구현했다. 미지원 건은 렌더 전 엔진 확장이 필요하다.
4. 원본/유사 원문의 값과 그래프가 다르면 유사 원문을 우선한다. 특히 대수 q17과 기하 q22의 원본 에셋을 그대로 재활용하지 않았다. 마지막 publish/JS 이미지 연결은 후속 렌더 단계다.
