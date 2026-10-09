# ALIVE 다음 학교 시험지 — CREATE 중 해설 SVG 함께 제작 (CURRENT v1.0)

- 작성: 2026-10-10 / 사용자 직접 지시
- 상태: **DOCUMENTED_WORKFLOW_REQUIRED**. 문서 저장 자체가 엔진 작업·실제 SVG 생성·학생 화면 렌더의 완료 증거는 아니다.
- 적용 시점: **2025 팔마고 고1 2학기 중간 QID9를 제외하고, 이후 새롭게 착수하는 모든 학교 시험지의 ALIVE/Generated 신규 문항 생산**. QID9 9슬롯 또는 LITE 의미확장 등 출력 수량과 무관하게 적용한다.
- 제외/인계: **기존 팔마고 신규 생성분의 누락 SVG는 별도 SVG 엔진 보강 작업에서 처리한다.** 이 문서는 팔마고 q01~q20을 재작성·재제작하거나 기 승인 UID를 무효화하는 소급 지시가 아니다. 이후 팔마고 누락분을 별도 보강할 때도 기존 도형/SVG 정본 규칙은 따른다.
- 기본 authority: 사용자 최신 명시 지시 → `AGENTS.md`/QID9 CURRENT 및 문제은행 Visual CURRENT → `.codex/skills/apmath-visual-upgrade/SKILL.md` + GPT 전용 Visual Contract → `도형추출.md` + 도형의방정식 해설 SVG 규정 → 지원 확인된 기존 엔진·실제 자산.

## 1. 학교 작업 시작 전 필수 선독 (한 시험지 최초 진입 때 1회, 다음 qid에서는 version 변화분만)
1. `.codex/skills/apmath-visual-upgrade/SKILL.md` — 문제용/해설용 surface 구별, visual triage, backend 선택, Golden/Negative 및 출판 스타일.
2. `docs/rules/04_VISUAL/JS_Archive_GPT_Visual_Production_Contract_v1.md` — **GPT 담당자의 실제 제작·검수 권한/능력**을 기준으로 실행. GPT가 Codex skill·로컬 renderer를 실제 수행했다고 허위 표기 금지.
3. `docs/rules/04_VISUAL/도형추출.md` — Python 수학/좌표 검산, SVG 시각·인쇄 규칙, 원호·그래프·라벨·스타일/결정적 도형 사실 검증.
4. `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` — **H22-C2-01~H22-C2-04** 도형의 방정식 해설 SVG 기본 필수, 단원별 반드시 표현할 점·선·원·수선·대칭·교점·접점, 좁은 수학적 예외.
5. `docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md` 및 `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md` — 문제/해설 두 surface와 UID·Source→Consumer/화면·출시.
6. 사용할 **실제 backend 지원 규약**: `alive/engine/visual_renderer.py`의 `SUPPORTED_TYPES`·`render_visual_spec`, `alive/engine/visual_lane.py`; 필요한 경우 `archive/tools/geometry-equation/visual_engine/visual_spec.schema.json`·`engine.py`/관련 테스트. 원호·반원·복합 패널·함수형 그래프는 **해당 spec의 실제 support를 확인하기 전** 사용 가능으로 단정 금지.
7. 실제 새 SVG 작업 전에는 기존 Golden/Negative calibration 등 위 전문 규칙에 이미 정해진 preflight를 실시. 독립 렌더 증거는 코드를 읽는 것으로 대체할 수 없다.

**새 학교 첫 작업자가 필독 근거(읽은 문서 version/Git SHA·엔진 선택)를 시험지 작업 ledger에 남긴다.** 자료를 매 문항 중복 재조회해 소모할 필요는 없으나, 미확인 지원 범위를 관성적으로 사용하지 않는다.

## 2. 하나의 문항 CREATE에서 문항과 SVG를 함께 제작

`원본 기출 qid 확인 → L3/교육과정/해설 핵심 수학 사실 확정 → 생성 candidate 발문·정답·보기·solution 자체 검산 → 문제용/해설용 시각화 **별도 판단** → 필요한 visualSpec 설계 → 지원되는 기존 엔진으로 실제 SVG 생성 → 수학/primitive parity·자산 SHA·가독성 점검 → 후보 파일·에셋·메타/receipt를 같은 qid 배치에 저장 → 후속 승인/Consumer/출시`

1. **문제용** `PROBLEM_VISUAL`: 원문의 PNG/이미지·표·그래프·그림이 학생 질문의 조건이면 보존 또는 수학적으로 동등한 신규 자산 준비. **원본 기출의 문제용 PNG를 임의 SVG로 교체하지 않는다**. 새 변형의 학생 입력에 필요한 조건이 모두 있는지 판정.
2. **해설용** `SOLUTION_VISUAL`: 발문이 TEXT_ONLY여도 핵심 해설을 학생에게 보여주는 독립 SVG 필요 여부를 판단. 접점, 수선의 발, 반원/원 교점 변화, 보조선, 대응점/대칭축, 위치관계, 벤 영역, 그래프의 분기 등은 결론 계산뿐 아니라 **결정적 이해 단계가 실제 그림에 보이는지**를 기준으로 제작. `studentVisual=NOT_REQUIRED`를 해설 SVG 면제 이유로 사용 금지.
3. **도형의 방정식 HARD 우선**: 2022 공통수학2 `H22-C2-01`~`04`의 실제 도형 개념이 핵심이면 해설 시각화를 **기본 필수**로 생성한다. “유용하면 선택”으로 규칙을 약화하지 않는다. 실수 도형이 성립하지 않거나 퇴화해 통상의 그림이 거짓이 되는 등 **수학적으로 좁은 예외만 UID별 증빙**하며 필요하면 최소 사실도 표현한다.
4. 기타 단원에서도 해설이 학생에게 **의미 있는 추가 관계**를 제공하면 필요한 SVG를 생성. 장식·복제만 되는 경우에는 근거 있는 EXEMPT. 기존 적합한 해설 SVG는 UID별 geometry·asset 적합성을 확인해 REUSE 가능.
5. **FACT FIRST**: 식·좌표·점 순서·반지름·기울기·교점 개수·각·거리·정답·경계·필수 보조선 정보를 해설 확정 사실로 동결한 후 visualSpec에 제공. 수학 내용을 SVG로 거꾸로 추측하거나 원본 그림에 없는 조건을 발명하지 않는다.
6. **ENGINE FIRST**: `apmath-visual-upgrade`의 기존 backend router를 따라 실제 지원되는 `STANDARD_SVG / COMPOSITE_PANEL / FUNCTION_GRAPH / ...` 등 적절한 경로 선택. 가능하면 현행 deterministic Python/semantic renderer + 등록된 spec/template 사용. 무작정 직접 SVG 문자열을 제작하거나 미지원 템플릿/스키마·출판 상태를 만들어내지 않는다. 어떤 backend도 못 쓰면 기존 SPECIAL/독립 SVG 제작기 등 **이미 정본에서 허용되는 경로**를 확인하고 동일 수학·렌더 gate 적용.
7. **제작 중 closure**: SVG bytes를 실제 만들고 `UID↔asset path↔sha256/Git blob↔설명할 핵심 사실`을 함께 저장. 자가 QA에서 SVG 실제 primitive로 observedFacts를 재계산하여 expectedFacts와 비교하고 XML 안전·좌표 비율·라벨 겹침/가독성/잘림 점검. 실제 브라우저 렌더는 해당 실행 환경에서 가능한 현행 release stage에 따라 시행하고 증거 결속. **필드명은 실제 Consumer/Archive schema에서 확인**; 임의 `solutionImage`를 패키지에 써 두는 것만으로 화면 연결 완료라 선언 금지.
8. 생성 자가점검은 다른 GPT의 독립 검수 PASS가 아니다. 후속 사용자 직접 품질승인/공개답 검수와 기술 출시 인증을 현재 계약대로 따르고 실제 하지 않은 Chrome·Student lookup을 PASS라 하지 않는다.

## 3. stage 및 인계 상태 — SVG 제작 뒤로 미루는 운영 방지

- `CREATE_SVG_READY` (이 문서의 **ledger 표기용**, 엔진 기존 enum으로 간주 금지): 문제용/해설용 각각 완료 또는 근거 있는 예외/재사용, 필수 신규 SVG 물리 파일 및 수학·자산 QA 완료. 해설 본문의 목표 설명과 SHA 결속.
- `CREATE_SVG_HOLD` (ledger 표기용): SVG 필수인데 아직 제작 불가·지원 template/도형 수학 사실 확인·필수 asset 결손. 후보/문제/해설 작업물은 보존할 수 있지만 **시각 결손인 문항을 자가검수 완결·RELEASE_READY·MAIN_DONE으로 승격 금지**. 남은 단계는 기존 SVG executor에게 **같은 원본 qid 작업의 continuation**으로 넘겨 처리한다. 한 원본 qid 전체를 무기한 차단하지 말고 가능한 다른 UID는 단계별로 처리한다.
- `SOLUTION_EXEMPT`는 문항별 수학/학습 근거와 해당 도형 HARD 적용 여부가 기록된 경우만 인정하며 단순 `TEXT_ONLY`는 허용하지 않는다.
- 별도 SVG executor/엔진 사용은 작업 역할 배분일 수 있지만, **다음 학교부터는 생성 원패스 단계에서 specification·SVG 실파일·proof까지 최대한 같은 qid 폐쇄 단위에 포함**한다. 문항 9개만 만든 뒤 사후 SVG 전수조사를 정상 production 계획으로 삼지 않는다.
- 학교 작업의 공유 작업 브랜치 및 원본 qid별 커밋 규칙 준수. 실제 검사 불가·별도 Executor 인계는 시각 제작 현황과 정확한 미완료 UID를 남기고 다른 완료분을 허위 HOLD/PASS로 묶지 않는다.

## 4. 새 학교마다 반드시 남길 짧은 증거

`sourceExam/branch/head; readVisualDocs[{path,sha}]; rendererCapability[{backend,actualSupportedType,probeEvidence}]; UID; problemVisualVerdict; solutionVisualVerdict; mathematicalFacts; svgAssetPath; assetSha256; actualObservedFacts; parityStatus; displayLinkStatus; realRenderStatus; BLOCKER`.

보고는 **문항 수 / SVG 기본필수 수 / 실제 SVG 생성 수 / VERIFIED·EXEMPT·HOLD / Student Consumer 연결 수 / 렌더 검수 완료 수**를 분리한다.

## 5. 팔마고 경계 및 후속 학교 최초 진입

- 2025 팔마고 고1 2학기 중간 QID9 q01~q20 및 그간 만든 후보는 **기존 파일 유지**, 누락 SVG는 형님이 별도 SVG 엔진에 맡기는 보강 라인으로 처리. 원장의 180 UID 정적 조사 문서는 기존 역사와 후속 보강 근거로 사용한다.
- **다음 학교부터** CREATE가 시작되기 전 §1 선독을 수행하고, 첫 원본 qid부터 §2를 적용한다. 새로운 공통 규칙을 맞춘다는 이유로 팔마고 전체 180 UID의 승인·문항·메타를 다시 작성하지 않는다.
- 후속 운영/검수 단계는 기존 full release 계약과 Chrome 학생 해설 render gate를 준수. 이 문서를 추가 GPT 승인 절차로 삼거나 무의미한 중복 재검수를 강제하지 않는다.
