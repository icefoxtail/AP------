# 2025 순천매산여고 고1 2학기 기말 유사1·2·3 — Codex SVG 전담 인계

## 작업 분리 (고정)

- **문항 제작 담당(ChatGPT):** 유사1·유사2·유사3의 총 **69개 발문·정답·해설·보기**, 공식 최소 메타, 4칸, 난도·변형 레저 제작.
- **Codex 담당:** 위 완성 JS를 입력으로 **공식 SVG 엔진**의 실행형 plan JSON, 실제 SVG 렌더, 시각 대조, 문제·해설 그림 연결만 한다. 새 문제를 다시 쓰거나 번호·정답·풀이를 바꾸지 않는다. 수학 오류를 발견하면 qid·원인을 명시하여 작성 라인에 보고하고, 승인된 교정 후 새 JS 기준으로 SVG를 맞춘다.
- 이 인계가 문항과 해설의 독립 블라인드 R1 검수를 의미하지는 않는다. 세트별 정답 번호 공식 검사와 고위험 문항 수치·조합 교차검사는 별도 기록에 있다. 실제로 실행하지 않은 UI/A4·엔진 렌더는 `NOT_RUN`이다.

## 입력 파일 (이 브랜치)

1. `archive/exams/similar/high/h1/2final/25_매산여고_2학기_기말_고1_유사.js`
2. `archive/exams/similar/high/h1/2final/25_매산여고_2학기_기말_고1_유사2.js`
3. `archive/exams/similar/high/h1/2final/25_매산여고_2학기_기말_고1_유사3.js`

동반 문서:

- 각 JS에 대응하는 `archive/data/item-4slot/similar/high/h1/2final/<stem>.4slot.json` 3개.
- `archive/exams/similar/high/h1/2final/25_매산여고_2학기_기말_고1_SOURCE_BALANCED.ledger.json` 69개 변형 경험 레저.
- 원본: `archive/exams/original/high/h1/2final/25_매산여고_2학기_기말_고1_기출.js` (변경 금지).

## SVG 전수 판정: 3세트 × (23문항 × 문제·해설) = 138축

각 JS의 `visualDisposition.problemVisual/solutionVisual`을 **변형된 실제 발문·해설**과 대조한다. q03·q15는 대응이 발문에 텍스트로 모두 주어지므로 문제 SVG는 필수가 아닌 유익한 자료다. 초기 판정은 세트당:

| 판정 | 최종 전체 축 | qid·용도 |
|---|---:|---|
| `REQUIRED` | 3 | 각 세트 q18 해설: 평행이동에 따른 넓이 |
| `BENEFICIAL` | 49 | 기존 48축 + 유사3 q14 문제: 조각함수의 두 교점 |
| `EXEMPT` | 86 | 문항·해설의 수식과 글만으로 완결되는 축 |

**교정 후 재판정:** 전체 138축: REQUIRED 3, BENEFICIAL 49, EXEMPT 86. 후속 공식 plan 52개를 제작할 예정이다. 아직 이 52개 계획 JSON 및 SVG 실물이 만들어졌다는 뜻이 아니다.

| 집중 문항 | SVG 담당 초점 |
|---|---|
| 03·15 문제 BENEFICIAL | 원소별 화살표 대응. 유사2 15번은 f(X) 3종, g(1)≠g(2), 합성 치역 정확히 2종, 미사용 입력 3 |
| 18 해설 REQUIRED | 세 세트 모두 곡선의 (−d,+d) 평행이동에 따라 넓이 = 수평 폭 d × 평행 직선 절편 차 |
| 유사3 14 문제·해설 BENEFICIAL | 첫 조각 [−9,−4], 둘째 (−4,−1]의 교점 0/1/2개 및 끝점 k=1 포함 |
| 유사3 16 해설 BENEFICIAL | x=1은 오른쪽 조각, y=5는 오른쪽에서 닫히고 왼쪽에서 열림 |
| 유사3 19 해설 BENEFICIAL | t=0,3/2,3의 원상 중 x=2를 두 번 세지 않음 |
| 유사3 23 해설 BENEFICIAL | x=2 극점과 x=5 제거 가능한 구멍, 형식적 +4 해 x=5 제외 |

## 실행 지시

1. `AGENTS.md`, `archive/AGENTS.md`, `docs/agents/visual-svg.md`, `docs/agents/typebank-figure-plan-execution.md`, `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`를 현재 브랜치 기준으로 읽는다.
2. 작업 전용 worktree를 사용한다. `main`·원본 기출·다른 학교/연도 시험지·문항 텍스트 변경 금지.
3. 각 변형의 **문제·해설 독립 46축**에 대해 기존 판정과 현재 JS의 수식/좌표/도형/라벨/정의역/경계를 1:1 대조한다. q03·q15의 `sourceDiagramModel`은 엔진 도식 데이터로 활용하되 새 변형의 실제 값과 반드시 일치시킨다.
4. 필요한 그림은 오직 `archive/tools/geometry-equation/production/plans/<stem>/qNN-problem.plan.json` / `qNN-solution.plan.json`으로 만든다. 총 **52개** 신규 plan을 만들며, 이 라인에서는 생성하지 않았다. 기존 원본용 plan은 포맷 예시일 뿐 무검증 복사 금지. 손 SVG·PDF PNG 잘라넣기·수동 SVG 조립 금지.
5. 공식 `plan-lint` **shallow/full**, 엔진의 **실제 SVG render**, 정적 `DRAWN_FEATURE_PARITY`, 이미지 문항 판독, 학생화면·A4 인쇄를 분리 기록한다. SVG 산출물이 실제로 없으면 JS의 `image`/`solutionImage`/plan 참조를 채우지 않는다. 새 SVG 파일은 배경 흰색 덮개·불필요한 면 채움·라벨 누락이 없어야 한다.
6. 수학을 변경하지 않은 범위에서 시각 연결 필드 및 필요한 `imageSize` 등만 수정한다. **그림·해설·레이아웃만 바뀐 경우 4칸의 `sourceGitBlobSha`는 최초 작성 시점의 결속 기록으로 유지한다**(현재 `docs/agents/common.md`의 문항별 발문·보기 text-v1 결속 규칙). 발문·보기가 변경되어야 할 수학 오류를 발견하면 작성 라인으로 돌려 교정·결속 판단을 요청한다. 해설 그림은 그 문항의 **풀이 순서**와 정확히 일치해야 한다. q18은 두 곡선이 `(-d,+d)`만큼 이동하므로 넓이가 `d×(직선 절편 차)`가 되는 근거를 명확히 그린다.
7. 3개 세트 각각의 plan 수·lint 수·실제 render 수·필수 시각 결함·미실행 항목·수정 파일·커밋을 보고한다. 사용자 명시 승인 없이 `main` 병합·학생 배포 금지.

## 수학 작성 단계에서 실제 확인한 내용

- 69문항, 객관식 60·서술형 9, 매 세트 100점.
- 객관식 선택지의 수치 크기순 및 정답 번호 분포: 저장소 공식 검사 **3/3 파일 PASS**, 결함 0.
- 각 세트 q03 합성/역함수, q10 포함구간 정수 개수, q15 함수 전수 256개 계수(유사2는 g(1)≠g(2) 선행조건 + 치역 정확히 2종), q17 고정점/정의역, q18 넓이, q19 원상, q20 반례 경계, q23 절댓값 실근: 수정된 조건으로 **3/3 별도 계산 확인**.
- 메타는 활성 PT/TPL·2022 공통수학2 직접 단원 바인딩 **작성자 정적 검사 69/69**. 직접 RPM 크로스워크와의 완전 일치는 별도이며, 공식 resolver는 아직 NOT_RUN.
- 4칸은 term-dict-v1.6 용어 ID로 세트별 조건·목표·방법을 개별 재작성했다. 특히 15번 함수 수 조건, 18번 넓이 계산, 23번 정의역 제외를 반영했다.
- Experience Ledger 69행은 원본 발문·해설 스냅샷과 새 4축을 담지만 이는 작성자 자체 비교다. **독립 의미 중복 검수·독립 R1/R2/R3, 실제 SVG 렌더, 학생 화면/A4 인쇄는 NOT_RUN**.

**SVG 작업 종료 전에는 ‘문항·그림 전체 검수 PASS’라 하지 말 것.** 그 외 문항 수학·해설의 수정 권한은 작성 라인에 남는다.
