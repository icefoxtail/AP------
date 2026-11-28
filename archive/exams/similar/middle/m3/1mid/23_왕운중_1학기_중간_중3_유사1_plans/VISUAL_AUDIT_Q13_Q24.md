# 왕운중 2023 중3 1학기 중간 유사1 — q13~q24 문제·해설 SVG 계획 감사

- 작업 기준: 2026-11-26 `main` `f190f9ecb0d53b566c8c8c7a085c701d60d8d11a`. 현행 `23_왕운중_1학기_중간_중3_유사1.js`의 발문·보기·해설과 **본문 인라인 SVG**까지 직접 확인했다.
- 범위: q13~q24 12문항, **24축**. 기존 q01~q12의 `VISUAL_AUDIT.md` 및 모든 파일을 보존한다. JS/기존 SVG/해설/메타/자산 연결은 변경하지 않는다.
- 정의: `REQUIRED`는 문제 이해에 그림이 필요한 축, `BENEFICIAL`은 수학적 관계를 이해시키는 해설 보조 축, `EXEMPT`는 근거 있는 시각자료 면제. 판정과 엔진 검증·게시 상태는 별개다.

| qid | 문제축 판정 및 구체 사유 | 해설축 판정 및 구체 사유 |
| --- | --- | --- |
| q13 | **EXEMPT** — ㄱ·ㄴ·ㄷ의 정의/참거짓은 이미 본문 HTML 박스의 문자로 완결된다. | **EXEMPT** — 제곱근과 순환소수 정의의 반례는 수식·말로 설명 가능하며 집합도가 내용 반복이다. |
| q14 | **EXEMPT** — 분모 유리화 두 식과 보기만으로 답이 결정된다. | **EXEMPT** — `3±2√2`의 상쇄는 순수 수식 연산으로 공간 관계가 없다. |
| q15 | **EXEMPT** — 태풍의 반지름과 시간 관계식을 그대로 제시한다. 태풍/구름 그림은 장식에 불과하다. | **EXEMPT** — `R=8` 대입 및 `√(512/32)=4`를 식으로 완료한다. |
| q16 | **EXEMPT** — 연속 근호 분수의 곱을 식으로 제시한다. | **EXEMPT** — 연쇄 약분 과정은 수식 줄에서 즉시 추적되며 도형은 중복이다. |
| q17 | **EXEMPT** — `2√(a+5)=8`, `√(15+b)/√2=3√3` 두 식만이 조건이다. | **EXEMPT** — 제곱과 일차방정식 풀이로 `a,b`를 구하며 축·도형 관계가 없다. |
| q18 | **EXEMPT** — 인수 `ab=-8`과 정수 제한을 텍스트로 제시한다. | **EXEMPT** — 정수 인수쌍과 합 `k`의 목록이 이미 풀이를 완결한다. |
| q19 | **REQUIRED** — 발문이 `<그림1>`의 Ⓐ 조각 이동과 `<그림2>`의 빈 부분을 직접 참조한다. 현행 인라인 SVG를 참고해 공식 엔진 재제작 계획 `q19-problem.plan.json` 작성. | **BENEFICIAL** — Ⓐ 영역의 넓이 보존과 `2×2=4` 빈 정사각형의 관계를 `q19-solution.plan.json`에 명확히 표시. |
| q20 | **EXEMPT** — 소수 `p<q<30`와 인수분해 조건은 대수·수론 조건이다. | **EXEMPT** — `p=2,q=29` 도출은 짝홀·소수 성질과 곱의 계산만 필요하다. |
| q21 | **EXEMPT** — 문제에 수직선을 그리면 `√15`의 정수 부분 3을 먼저 시각적으로 밝히므로 답 힌트가 된다. | **BENEFICIAL** — `3<√15<4`의 정확한 점 배치를 `q21-solution.plan.json`의 수직선으로 시각화하여 정수·소수 부분을 이해시킨다. |
| q22 | **EXEMPT** — 두 학생이 잘못 읽은 계수/상수항을 인수식으로 명시했다. | **EXEMPT** — 각각의 전개에서 올바른 계수만 선택하는 식 비교로 완결된다. |
| q23 | **REQUIRED** — A/B/C 정사각형과 D 직사각형의 위아래·좌우 접합 관계가 필수이며, 원문 인라인 SVG로 위치를 확인한다. `q23-problem.plan.json`에 네 구획의 실제 경계를 재현한다. | **BENEFICIAL** — 넓이 36과 3에서 유도한 `6`, `√3`, `6−2√3`의 소유 변을 `q23-solution.plan.json`에 표시하여 D의 넓이 계산을 지원한다. |
| q24 | **EXEMPT** — 근호 급수의 합과 부등식이 식으로 모두 주어졌다. | **EXEMPT** — 유리화·연쇄 소거 및 `24<n<80`에서 자연수 55개 계수만 필요하다. |

## 원문 ↔ 실제 엔진 모델 및 계획의 그려지는 필드 대조

| 축 | 원문에서 확인한 관계 | 엔진 모델·시각 필드에서 확인한 내용 | 정적 대조 | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- |
| q19 문제 | 처음 정사각형, 가로 `a+2`·세로 `a−2`, 우측 폭 2의 Ⓐ 조각, 이동 화살표, 최종 한 변 `a`의 정사각형과 `2×2` 빈 부분 | `mathPlan.points` W14~W17, W0~W5, W6~W13; `displaySegments.arrowFirst/arrowSecond`; `expressionLabels`의 `a,2,a−2`; `regions.movedBefore/movedAfter`; 빈 부분 s78/s89 점선. 대표 크기는 `a=6`, 실제 a값 고정 아님 | **REVIEWED**: 엔진 `construction.execute()`의 초기 6×6, 중간 8×4, Ⓐ 이동 전후 8, 빈 부분 4 및 보존 넓이 32=32 검산 | **NOT_VERIFIED** — full lint/실제 표시 필드 검증 메모리 제한 |
| q19 해설 | 이동 전후 면적 같음, 정사각형 넓이에서 작은 정사각형 넓이 4 제외 | 위와 같은 점·선·라벨, `planeMarks.textLabels.gapArea=4`는 해설 축에만 존재 | **REVIEWED**: 문제축에는 4를 쓰지 않고 해설축에만 넓이 4를 표시 | **NOT_VERIFIED** — full lint/표시 필드 미완료 |
| q21 해설 | `3<√15<4`, 정수 부분 3, 소수 부분 `√15−3` | `numberLine.rows[0]` POINTS L=3, R=`sqrt(15)`, U=4; R 값 라벨은 ABOVE, 세 점은 이름 숨김, `axisVariable:false` | **REVIEWED**: `expandNumberLineFigure`에서 점과 값 유지; 수치 `3<3.872983…<4` | **NOT_VERIFIED** — full lint/표시 필드 미완료 |
| q23 문제 | A/B/C는 정사각형, A 넓이 36, C 넓이 3, D는 하단 오른쪽 직사각형; A/B/C/D 구획 이름과 접합 | `mathPlan.nodes` P0~P9, `displaySegments` 13개로 원문 인라인 SVG의 네 경계 재현; `planeMarks.textLabels` A/B/C/D; 면 채움·D의 면적/정답 값 없음 | **REVIEWED**: SymPy 모델에서 A=36, C=3, B의 가로=세로=4.267949…, D 가로=2.535898…, 세로=1.732050… | **NOT_VERIFIED** — full lint/표시 필드 미완료 |
| q23 해설 | D의 가로 `(6−√3)−√3=6−2√3`, 세로 `√3`, 넓이 `6√3−6` | `expressionLabels.lenA@ s90=6m`, `lenC@s12=√3m`, `widthD@s23=6−2√3m`, `heightD@s34=√3m`, `regions.focusD` | **REVIEWED**: SymPy 모델 D 면적 4.3923048454 = `6√3−6`; 렌더 영역 D만 연하게 표시하도록 지정 | **NOT_VERIFIED** — full lint/표시 필드 미완료 |

### 정확성·미지원·불명확성

- q19의 원본 인라인 SVG에 초기 정사각형·화살표·`Ⓐ` 라벨과 3단계 관계가 있으므로 모두 모델/렌더 필드에 대응했다. 색칠은 Ⓐ만 구별하고 원본의 장식적 회색 바탕은 옮기지 않았다. 해설의 4를 문제에 노출하지 않았다.
- q23의 원본 인라인 SVG가 A 왼쪽, B 오른쪽 위, C 오른쪽 아래 왼쪽, D 오른쪽 아래 오른쪽을 지정하므로 **이번 대상의 SOURCE_LAYOUT_UNDERDETERMINED는 아니다**. 직전 유사3 q23의 별도 `EVIDENCE_DEBT`와 혼동하지 않는다.
- 필요 기능이 엔진에 없다는 확인은 아직 없다(`ENGINE_CAPABILITY_PENDING=0` 확정 아닌 잠정). q19 라벨·화살표·면구분과 q23 길이 라벨의 실제 배치·관측기 검사는 full lint 차단으로 미완료이며, 기능 미지원으로 둔갑시키지 않는다.
- `q19`/`q23`의 JS에는 기존 인라인 SVG가 있으나 이번 범위에서 새 SVG·PNG 렌더/JS 자산 연결은 **NOT_RUN**이다.

### 검증 결과·인계

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <계획>`: **5/5 PASS**, 한 파일씩 실제 실행.
- 공식 `plan-lint.cjs <계획>`(full): **5개 모두 실행 시도, PASS 0/5**, 프로세스가 `SIGKILL`(종료 137)로 종료. 고정 폰트 SHA256 `194018e6…`와 파이썬·모델 의존성을 복구했으며, 검사 기준을 바꾸지 않고 `NODE_OPTIONS=--max-old-space-size=256`로 재시도했으나 동일. **ENV_BLOCKED / FULL_NOT_VERIFIED**, FAIL도 PASS도 아니다.
- **DRAWN_FEATURE_PARITY PASS 0/5(미확정 5)**. 본문 필드·SymPy 모델 정적 대조 `REVIEWED`는 최종 렌더 필드 관측 PASS와 다르다.
- 집계: **12문항 / 24축** = 문제 REQUIRED 2, 해설 BENEFICIAL 3, EXEMPT 19. 실제 제작용 JSON **5**. `ENGINE_CAPABILITY_PENDING` 신규 확정 0, `EVIDENCE_DEBT` 신규 확정 0, `ENV_BLOCKED` 5.
- 실제 SVG/PNG 렌더·학생 화면·A4·JS 연결 **NOT_RUN**. PR은 full lint와 최종 필드검증 전에는 운영병합 완료라고 표시하지 않는다.
