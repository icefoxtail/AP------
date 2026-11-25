# 문제·해설 그림 (Visual·SVG)

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## 정본 — 새 SVG는 무조건 엔진으로 만든다 (2026-11-19 사용자 지시)

- 문제 그림이든 해설 그림이든, 기출·유사·교재·유형·생성 문항 어느 것이든 **새로 만들거나 다시 만드는 SVG는 전부 저장소의 SVG 엔진(`archive/tools/geometry-equation/`, 작성 규칙 정본 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`)으로 만든다.** 손으로 쓴 SVG, 스크립트로 직접 조립한 SVG, 다른 도구가 낸 SVG는 넣지 않는다. 문항 수리·원문 복원·메타 작업처럼 그림이 본업이 아닌 작업에서 그림이 필요해져도 같다.
- **엔진이 못 그리면 바로 엔진을 고친다 (2026-11-24 원장님: "엔진이 못 그리면 빠르게 엔진 업글해").** 아래 줄의 "엔진 미지원 보고·그림 보류"는 엔진 기능이 들어갈 때까지의 임시 상태다. 번호 보고로 끝내지 않고 결함 종류 단위의 공통 기능(예제 plan·테스트·AUTHOR_GUIDE, 골든 게이트)을 별도 PR로 넣은 뒤 그 문항을 그린다(예: 11-24 관통 구멍 `bore`, 비스듬한 callout 지시선). 그동안 문항은 그림 없이 운영에 둔다. 모든 AI 공통 흐름은 아래 "현행 흐름 (2026-11-24)" 절.
- 엔진이 그 그림을 지원하지 못하면 손으로 그려 메우지 않는다. 지시선·라벨 등 기존 옵션으로 시도한 증거와 함께 "엔진 미지원"으로 보고하고, 그 문항은 그림 보류로 남긴다(엔진 확장은 엔진 라인의 일).
- **제작 방식(현행, 2026-11-19 사용자 지시):** 규모에 따라 둘로 나눈다. ① **대규모 그림 캠페인**(시험지 여러 개의 해설·문제 그림을 한꺼번에 만드는 SVG 라인)은 효율을 위해 딥시크가 엔진으로 초안을 만들고 Sonnet이 검수·마감 한 번 하고 메인이 PNG 표본을 본다(① 전용 지시문: `archive/tools/geometry-equation/ops/claude-batch/prompts/ds-exam-draft.md`, `archive/tools/geometry-equation/ops/claude-batch/prompts/sonnet-exam-impl.md`). ② **그 밖의 작업에서 생기는 그림**(문항 수리, 원문 복원, 유사문제 반입의 최종 검수 등 몇 장~수십 장)은 Sonnet이 엔진으로 직접 만들고, 메인이 PNG를 눈으로 검수해 마감한다. 어느 쪽이든 엔진으로만 만든다. SVG 담당은 Claude SVG 라인 하나다(2026-11-17). 아래의 루나 구현·루나 검수 절차는 과거 이력이다. 이유: 초안을 싼 모델에 나누는 것은 양이 많을 때만 이득이고, 적은 양은 단계를 줄이는 편이 빠르고 정확하다.
- **대량 그림(수백 장 이상)은 DeepSeek 일괄 파이프라인으로 한다 (2026-11-23 사용자: "앞으로는 딥시크한테 시키고").** 도구: 집 PC `D:/AP-svg-factory/labor/ds/`(README.md에 파일별 역할; 저장소 밖). 방식: 그림 종류별로 묶어 한 DeepSeek 호출에 8~20키(`write-plans.mjs`, 변형 `#low`), 동시 호출은 워크스페이스 공용 한도라 라인 합계 8 안팎, 렌더는 모델 없이 `render.mjs`가 엔진 `render-plan.mjs`를 일괄 호출(슬롯 1~2), 실패분만 DeepSeek 되돌림, 반입 전 Sonnet 검수·수리 1회(문제 그림 정답 노출·발문과 다른 값이 약 30% 나왔다). 안티그래비티·루나 같은 모델이 키마다 plan·렌더를 손으로 도는 방식은 쓰지 않는다. 위 ①의 시험지별 `ds-launch-exam.sh` 흐름도 대량에는 쓰지 않는다. 이유: 같은 날 키 단위 수작업은 몇 시간에 30~40키, 일괄 파이프라인은 시간당 300~400키가 통과했다.
- **면 채움은 기본 없음(흰 바탕) (2026-11-23 사용자 재지적).** 도형 안을 색으로 칠하는 것은 발문·해설이 묻는 넓이나 "색칠한/어두운/빗금 친 부분", 겹친 영역·두 도형(원래·이동 등) 구분처럼 꼭 필요할 때만 한다. 여러 선·곡선을 선 색으로 구분하는 것은 그대로 한다(선 색과 면 채움은 별개). 원문은 아래 "품질이 낮은 기존 그림의 SVG 교체" 절의 바탕 흰색 항목이다. 이유: "선·영역은 색으로 구분" 지시가 면 채움으로 과하게 퍼져 중2·중3 기출에 원·삼각형 안을 연한 색으로 칠한 그림이 1,300여 개 생겼다. 예외(원장님 2026-11-23): plan 없는 기존 중2·중3 기출 그림의 면 채움 제거는 이번 한정으로 엔진 재렌더 대신 fill 속성만 none으로 바꾸는 스크립트를 허용한다(좌표·선·글자 불변, 색칠·넓이·겹침·이동 문항은 제외).
- 작업 지시서에는 "그림은 엔진으로만 만든다"를 적고, 검수와 메인은 받은 그림이 엔진 산출물인지(plan·렌더 기록) 확인한 뒤에 보여 주거나 병합한다.
- 스캔에서 깨끗하게 잘라 넣는 원본 그림(PNG)은 이 규칙의 대상이 아니다. 아래 19행의 "엔진 표식의 부재만으로 교체 필요를 판정하지 않는다"는 이미 있는 그림에 대한 규칙이고, 새로 만드는 그림에는 이 절이 적용된다.
- 이유: 원문 수리 작업에서 작업자가 그림 9장을 스크립트로 직접 조립해, 도수분포다각형에 점이 없고 선·글자 품질이 엔진 그림과 달랐다. 엔진 출력만 관측기가 식·라벨·눈금을 다시 대조하고, 학생이 보는 그림의 모양이 한결같아진다.
- **엔진 PR의 골든 게이트는 "깨졌는가"만 막는다 (2026-11-24 원장님: 변화를 막는 고정은 깬다).** `archive/tools/geometry-equation/ops/golden-gate/golden-gate.mjs`는 학생 화면이 깨질 때(그림 밖 잘림·휴대폰 390px·그리던 그림을 못 그림·측정 실패)만 실패 종료한다. 바이트가 달라진 그림은 막지 않고 base와 PR을 나란히 놓은 PNG 시트(10쌍)로 사람이 훑는다. 기본은 바뀐 모듈과 관련된 표본만 돌리고 `--all`이 209 전체다. 상세는 그 폴더 README. 이유: "예전과 같은가"로 막으면 엔진이 좋아질 때마다 사람이 차이를 다시 봐야 했고 PR 한 건에 1시간 넘게 걸렸으며, 휴대폰 화면 회귀는 게이트가 아니라 CI가 잡았다.

## CURRENT — GPT 발전형 유사시험지의 문제·해설 2축 판정과 제작 플랜 (2026-11-25 사용자 지시)

- 신규 GPT `EXAM_FOLLOWUP/SOURCE_BALANCED`의 **최종 완성 문항**을 보고 문제용·해설용을 **문항마다 따로** `REQUIRED / BENEFICIAL / EXEMPT`로 판정한다. 원본에 그림이 있다는 이유만으로 복사하지 않고, 원본에 없거나 발문 텍스트로도 답이 유일하다는 이유만으로 두 축을 일괄 면제하지 않는다. 문제 조건의 상대적 위치·그래프 형태·영역 이해와 해설의 접점·교점·부호·증감·보조선 이해는 서로 다른 판단이다.
- **판정 기록은 전 문항 2축 모두 필수**다. 문항 번호별로 `문제 판정·개별 사유·필요 시 제작 plan 경로` 및 `해설 판정·개별 사유·필요 시 제작 plan 경로`를 Experience Ledger/시각 검토 장부에 남긴다. 마지막에 두 축 판정 수가 각각 전체 문항 수와 일치하는지, 필요한 계획이 누락되거나 축이 뒤바뀌지 않았는지 확인한다. `EXEMPT`는 근거 있는 불필요일 뿐 `NOT_RUN`이나 그림 제작 실패의 대체 상태가 아니다.
- **그림이 정말 불필요:** 해당 축에만 `EXEMPT`와 구체적인 수학·교육적 사유를 남긴다. 장식/단순 계산 중복 그림은 만들지 않는다. 신규 빈 SVG·불필요한 `json:plan`·가짜 이미지 참조는 만들지 않는다. 기존 시스템이 EXEMPT를 `qNN-*.plan.json`으로 보존해도 이는 **판정 파일**이지 렌더 가능한 **제작용 plan**으로 집계하지 않는다.
- **어느 축이든 필요/유익:** 해당 축의 `AUTHOR_GUIDE.md` 정본 capability와 계약 전문에 맞는 **실제 제작 가능한 plan JSON**을 작성한다. 문제용은 발문에서 주어진 것만, 해설용은 결정적 풀이 관계를 담는다. 현재 JS 조건·계산·라벨·점·방향·범위를 plan과 대조하고, 원본/기존 유사 plan을 수치 치환해 재사용하지 않는다. 기존 관례대로 별도 `*.followup.plan.json`을 두면 원판정과 후속 장부에 제작용 plan 경로를 정확히 연결한다. `{"status":"EXEMPT"}`만 쓴 파일을 제작 plan이라고 보고하지 않는다.
- **검증 및 출고:** 계획별 공식 `plan-lint`의 shallow/full 결과를 구분하고, 엔진 렌더·PNG 실물·학생 화면·`image`/`solutionImage` 연결 여부를 따로 기록한다. 미실행은 `NOT_RUN`, 엔진 미지원은 `ENGINE_CAPABILITY_PENDING` 등으로 남기고 손그림·수작업 SVG를 만들지 않는다. **문제에 필수인 그림이 미제작이면 정상 출고 금지**. 텍스트만으로 풀이/해설이 완결된 해설 보조·비필수 그림은 `SVG_PENDING.md`에 문항·축·실제 제작 계획·`SVG_TO_CREATE / NOT_RUN`을 기록하고 JS 선반영과 SVG 시각 완료를 분리한다. 아직 없는 자산 경로는 JS에 쓰지 않는다.
- 이 분기는 수학·메타·필수 자산의 실물 검증·엔진 규칙을 면제하지 않는다. 이유: 고1/고2 유사 세트 사이에 문제용 판정 기록과 실제 제작 plan 누락 방식이 달라 다음 엔진 작업자가 필요 그림을 놓쳤다. → [GPT 실행 프롬프트](gpt-similar-exam-execution-prompt.md) §5, [GPT 유사 난도 믹서](gpt-similar-difficulty-mixer.md)
## CURRENT HARD — 문제은행 전체 문제·해설 SVG 필요성 2축 전수판정 (2026-10-10 원장 지시)
- **문제은행의 모든 기출·ALIVE Generated·교재/유형/유사문항**에서 *문제용*과 *해설용* 시각자료의 필요성을 UID마다 **독립 판단**한다. 문자·수식만으로 문제를 풀 수 있어도 해설의 접선/교점/대칭/보조선/그래프/영역 관계를 학생에게 명확히 전달하는 SVG가 필요하면 반드시 제작한다. `VISUAL_OPTIONAL`도 실질 교육 효과가 있으면 ADD하며, 진짜 중복·장식은 근거 있는 EXEMPT.
- 기존 Visual 생성 스킬과 엔진을 재사용하고, source PNG 불변·교육과정·실제 primitive/렌더 검증을 유지한다. 기존 승인 문항의 품질 상태를 일괄 취소하지 말고 누락 UID의 시각 결함만 보강한다. 실측 누락률은 고유 UID × 문제/해설 전수조사 후 확정한다.
- 실행 정본: `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`. 문서 작성은 전수조사/SVG 생성/Chrome 완료가 아니다.
- **기존 1:1 숫자변형·AI Studio 반입 경로만** 원본·기존 유사의 같은 번호 그림과 `[그림: …]`을 기본 제작 목록으로 삼는다. 이 경우에도 새 값·발문·해설과 수학적으로 모순되는 plan은 그대로 재사용하지 않으며 엔진 렌더·검수는 필수다. **GPT 발전형 `EXAM_FOLLOWUP/SOURCE_BALANCED`는 아래 별도 판정이 우선**한다.
- 이유: 2026-11-20의 1:1 그림 목록 재사용은 숫자변형 생산의 시간을 줄이는 예외다. 조건·질문이 달라지는 발전형 세트까지 같은 그림을 강제하면 불필요하거나 틀린 그림이 생긴다.

## CURRENT HARD — 문제은행 전 문항 문제·해설 SVG 필요시 의무 생성 (2026-10-10 형님 지시)
- **팔마고 한정 아님**. 기출·ALIVE Generated 후보/승인·교재/평가문항 등 실제 문제은행 모든 UID에 대해 **문제 그림과 해설 그림을 각각** 전수 triage한다. 텍스트만으로 풀이 가능하다는 이유로 해설 SVG를 자동 생략하지 않는다.
- 실제 결정적 교육 가치가 있는 REQUIRED/BENEFICIAL 해설 SVG 및 필수 문제 시각자료는 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, `도형추출.md`, 현존 `alive/engine/visual_renderer.py` 등 적절한 backend로 **생성/보강→actual geometry parity→학생용 참조→실제 렌더 증거**까지 완료한다. 충분한 원본 PNG/기존 검증 SVG를 무의미하게 중복 제작하지 않는다.
- SVG 필요인데 자산 없음/학생 UI 미연결/렌더 미검증이면 신규 RELEASE DONE 금지. 기존 승인본은 일괄 무효화하지 않고 UID별로 보강한다. 신규 엔진 중복 제작·미지원 renderer 지원 허위 주장 금지.
- **실행 정본:** [문제은행 전 문항 문제·해설 Visual/SVG 게이트 CURRENT](../../docs/rules/04_VISUAL/Problem_Bank_All_Items_Problem_And_Solution_Visual_Gate_CURRENT_v1.md). 이번 문서 반영은 POLICY_ONLY이며 전수조사·SVG 신규 제작/렌더 완료를 의미하지 않는다.

## 품질이 낮은 기존 그림의 SVG 교체

- 수학적으로 정확하고 실제 학생 화면·인쇄에서 현행 엔진 수준으로 읽히는 기존 SVG는 유지한다. 생성 plan·영수증·파일 이력·렌더러 서명은 제작 경로를 확인하는 근거다. 엔진 표식의 부재만으로 수동 제작이나 교체 필요를 판정하지 않는다.
- 최종 PC·모바일·인쇄에서 눈금과 좌표가 어느 축·점에 속하는지, 함수 이름·점·치수의 위치와 정렬이 자연스러운지 확인한다. 그래프가 y축 오른쪽에 집중되면 눈금 숫자는 공간이 허용되는 한 왼쪽에 맞춘다. 한 그림에 함수가 함께 있는 경우, 같은 축에서 읽어야 할 관계와 비교 구조를 보존한다.
- 현행 JS에 연결된 문제·해설 그림이 흐리거나 잘려 필수 길이·각·눈금·라벨을 읽기 어렵거나, 학생 화면에서 선·영역을 구별하기 어려우면 기존 엔진으로 SVG를 새로 만들어 교체한다. 현행 JS 문제·보기·정답·해설과 연결 자산에서 확인한 정보만 사용하고, 확인할 수 없는 값은 짐작해서 채우지 않는다.
- 문제 그림은 문제 자리, 해설 그림은 해설 자리에 유지한다. 해당 슬롯의 표시 크기·레이아웃 규격을 따르고 종횡비, 수학적 관계, 라벨의 의미를 확인한다. 문제 그림에 풀이 보조선·답을 새로 노출하지 않는다. 교체 자산은 새 경로에 두고 대상 JS 참조만 바꿔 다른 참조와 기존 자산을 보존한다.
- 그림 표시 크기 기본은 large와 full 사이다(2026-11-17 사용자 지시). 문제 그림은 폭 90%·높이 240px(`tall`만 280px), 해설 그림은 칸 폭 90%·높이 340px(휴대폰 92%·340px) 이내로 가운데 정렬하고, 저장된 `large`·`full`·`tall` 값도 이 상한이다. 크게 보여야 하는 그림만 데이터에 `imageSizeOverride: "full"|"tall"`(문제), `solutionImageSizeOverride: "full"`(해설)을 적는다. 이유: `tall`·해설 `full`이 단 폭을 꽉 채우고 높이 제한이 없어 그림이 너무 컸다. 그림 엔진은 실제 표시 크기로 라벨 글자를 정하므로 새 상한에서 라벨이 작게 읽히는 그림은 재생성하거나 override를 준다(표시된 글자가 11 CSS px 아래여도 거절되지 않는다: 바로 아래 2026-11-23 결정).
- **표시된 글자 크기 하한은 해제했다 (2026-11-23 사용자 결정: "그림 속 글자가 11픽셀보다 작아지면 해제해버리자. 애들이 알아서 크기 확대해서 보겠지." 같은 취지의 2026-11-18 결정: 만들 때는 글자 제약을 두고, 엔진이 렌더될 때는 풀어 버린다).** 제작 때 글자 제약은 그대로다: 그림 원본(SVG 단위) 글자 `fontPx >= 11`(타입세터·`DISPLAY_ENVELOPE_LABEL_INVENTORY_INVALID`·정책 최소 기본 글자 20)과 렌더 레이아웃 검사의 저자 글자 검사(`PUBLICATION_FONT_BELOW_11_CSS_PX`는 원본 글자가 11 미만이거나, 그림 안의 외곽선이 줄어 실제 그려진 글자[효과 글자 ÷ 루트 표시 배율]가 11 미만일 때만. 그림 전체가 쪽에서 축소되어 작게 보이는 것은 해당 없음). 풀린 것은 "그림이 칸에 축소되어 놓였을 때 화면에 보이는 글자가 11(11.25) CSS px 아래면 불합격" 하나다: `display-envelope.mjs`(정책 `REQUESTED_PROFILE_FONT_SCALE` 거절, 크기 등급 자동 상향, `FONT_FLOOR_FAIL`, `ACTUAL_FONT_BELOW_ENVELOPE_FLOOR`), `construction-candidate-svg-v1.mjs`의 `FONT_BELOW_FLOOR`, `verify-rendered-layout.mjs`의 표시 글자 검사, 게시 검사(`ops/svg-m1/verify-publication-fonts.mjs`, `pubflow.py`), `audit-slice.mjs` `FONT_GATE`, 합성 그림 크기 lint(`plan-lint.cjs`의 폭 828·높이 820 규칙). 단 **자동 확대(`solutionImageScale` 탐색)는 유지**한다: 기본 표시에서 글자가 하한 아래로 보이면(정책에 `displayTextBelow11px`) 후보 배율을 작은 것부터 재 측정해 글자가 11.25 이상이 되는 첫 배율을 고르고, 어느 것도 안 되면 가장 큰 배율(단 폭이 허용하는 최대 정수 %까지)을 쓴다(`construction-archive-capture-v1.mjs`의 `selectSolutionImageScale`). 없어진 것은 "안 되면 거절"뿐이다(원장님 뜻은 "불합격시키지 말자"이지 "더 작게"가 아니다). 하한 아래로 보이는 그림은 실패가 아니라 정보 `displayTextBelow11px: true`(증거 JSON·정책·레이아웃 결과에 그 경우에만 키가 붙는다)로 기록된다. 글자 크기 측정값 자체가 없거나 유한하지 않으면 여전히 실패한다. 이유: 학생이 패드·휴대폰에서 그림을 확대해 볼 수 있고, 해설 그림 표시 비율을 단 폭의 80%로 정한 뒤 이 하한이 넓은 그림을 일괄 거절했다. 아래 2026-11-19 항목과 AUTHOR_GUIDE의 "글자 11px·`REQUESTED_PROFILE_FONT_SCALE` 거절" 서술은 이 결정 이전의 경위이며, 크기 등급은 이제 글자 하한 때문에 올라가지 않는다(요청 등급이 그대로 계획 등급이다).
- **A4 해설 그림 측정 기준 (2026-11-19, 글자 하한 부분은 위 2026-11-23 결정으로 해제).** A4(PC 쪽 보기·인쇄·PDF)는 해설 그림을 단 폭의 60%(약 190px)로 보인다(`archive/figure-size.css`, 2026-11-18 사용자 결정). 이 크기로는 가로 약 540 SVG 단위를 넘는 그림이 라벨 11.25 CSS px를 지키려면 기본 글자가 상한 32를 넘어, 측정이 `UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE`로 거절했다(지금은 거절하지 않고 기본 글자를 상한 32에 둔 채 `displayTextBelow11px`로 기록하며, 아래 `solutionImageScale` 탐색은 그 표시를 계기로 계속 돈다). 엔진(`construction-archive-capture-v1.mjs`의 `measureArchiveTypographyPolicy`)이 이 거절을 만나면 문항 필드 `solutionImageScale`(단 폭 대비 %, 5 단위, 보통 85~90)을 정해 같은 Archive에서 다시 측정하고, 캡처도 그 값을 넣은 시험지로 한다. `render-plan`의 `*-result.json`에 `solutionImageScale`이 있으면 게시 도구(`ops/svg-m1/publish-exam.py` → `publish.mjs`, `ops/tools/publish-figures.mjs`)가 `solutionImageSize` 옆에 시험지 JS 문항 필드로 적는다. 값이 있는 그림은 반드시 그 값과 함께 게시한다. 이 값이 필요한 그림도 단 폭 전체(약 298px)까지 키워 기본 글자 32 이하로 맞출 수 있는 가로(약 790 SVG 단위, 합성은 패널 384 두 개)까지만 통과하고, 그보다 넓으면 캔버스를 줄인다. 휴대폰은 이 값을 읽지 않고(옛 자연 폭 규칙, 단 폭의 약 90%) 글자 기본 크기를 "휴대폰 375px에서 라벨 10px 이상"이 되도록(`phoneMinimumBaseFontPx`) 정책 최소값으로 올려 맞춘다. 이유: 표시 크기는 사용자 결정이라 런타임을 되돌리지 않고, 넓은 그림 렌더가 일괄 거절되던 것을 그림 하나 단위 크기 덮어쓰기로 푼다. 글자 배율 상한(32)을 올리면 그림은 커지지 않고 글자만 비대해진다.
- 그림과 보기의 바탕은 흰색을 기본으로 한다. 원문이 지정한 색칠 영역이나 풀이에서 영역을 비교하는 데 필요한 부분에만 면색을 쓴다. 도형 윤곽과 단독 그래프의 선은 검정을 기본으로 한다. 여러 함수·선분을 구분하거나 같은 길이·각을 대응시킬 때 필요한 만큼 색을 쓰고, 눈금·호·선 모양도 함께 적용한다. 이유는 대비를 유지해 학생이 핵심 선과 표시를 한눈에 읽을 수 있게 하기 위해서다.
- 색은 관계를 구분하는 데만 쓴다. 중요한 선은 실선·점선·굵기나 직접 라벨로, 영역(채움이 필요한 경우에 한해)은 경계선·면 채움·무늬로도 구분해 색을 구별하기 어려워도 읽을 수 있게 한다. 휴대폰과 태블릿의 실제 학생 화면에서 확대 없이 수치·라벨·경계가 읽히고 겹치거나 잘리지 않는지 확인한 뒤 독립 검수를 거쳐 출고한다.
- 이유: 흐린 그림을 확대해야 하는 부담을 줄이고, 화면 크기나 색 구분에 관계없이 학생이 풀이에 필요한 정보를 읽을 수 있도록 한다.

## SVG 해설 그림 엔진 라인 (2026-10-30)

해설 그림 SVG 엔진(`archive/tools/geometry-equation/`)과 기출 해설 그림 캠페인의 기존 현황·공통 품질 기준은 `archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md`를 읽는다. 그림 작성 규칙 정본은 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`다.

- 엔진 결함 수리는 사례가 아니라 결함 종류 단위로, 공통 층에 기능 추가로 넣고 다른 종류 1개로 확장을 확인한다(이유: 2026-11-22 사용자, 같은 결함이 그림 종류마다 되풀이됨).

### 게시 관문은 점수로 (원장님 2026-11-23, 1단계 기준표)

- 원장님 결정 원문: "겹침 같은 걸 다 실패로 처리하지 말고, 학생이 봤을 때 최소한 읽히면 통과. 100점짜리가 아니라 90점짜리 SVG."
- **관측은 그대로, 게시 관문만 점수로 판단한다.** 관측기(검사)는 지금처럼 모든 결함을 찾아 기록하고 약화·삭제하지 않는다. 점수는 "찾은 결함이 게시를 막는가"만 정한다.
- 기준표는 한 곳이다: `archive/tools/geometry-equation/ops/score/score-table.json`(코드 → 막음/감점/엔진 대기/판정 불능, 정도→감점 함수)과 `score.mjs`(채점)·`rescore.mjs`(저장된 결과를 다시 렌더 없이 채점). 합격선은 90점이고 같은 코드가 여러 번이면 상한 없이 누적한다.
- 코드는 네 갈래다. 감점(품질 판정: 겹침·근접·멂·촘촘함), 엔진 대기(자리를 못 찾아 그림이 없는 `*_NO_ROOM`·`*_NO_PLACE`·`*LABEL_TOO_LARGE`·`LAYOUT_INVENTORY_INCOMPLETE`: 엔진이 차선 자리에 놓아야 풀림), 판정 불능(`WORKER_TIMEOUT`·`*PREFLIGHT_FAIL`·`*DISPLAY_ENVELOPE*`: 점수로 덮지 않는다), 막음.
- **막음(0점, 총점과 무관):** 틀린 값, 문제 그림에 정답 노출, 필수 값 누락, 깨짐·빈 그림, 라벨이 엉뚱한 대상을 가리킴(소속 오류), viewBox 밖 잘림, 라벨이 다른 라벨·도형에 절반 이상 가림, 값 숫자를 못 읽을 만큼 겹침. 표에 없는 코드는 막음으로 본다.
- **기준표 v2 (원장님 2026-11-23: "최대한 많이 통과시키고 추후 다시 작업하든지 써 보든지"):** 정도 숫자가 없는 감점 코드의 고정 감점을 6에서 3으로 낮췄다(가벼운 흠 3건까지 90점 통과). 합격선·막음 규칙은 그대로다. 영수증의 `tableVersion`으로 어느 기준표로 채점했는지 알 수 있어, 나중에 낮은 점수(v1 점수·경계)부터 다시 렌더·재채점할 수 있다.
- 기준표는 `version`(영수증에 `tableVersion`으로 적는다)을 갖고, 필드·코드는 추가만 한다. 기준을 낮추려면 버전을 올리고 이유를 적는다.
- **2단계(2026-11-23):** 렌더 뒤 관측기가 그림을 실패시켜도 후보 SVG와 위반 목록 전체를 남긴다. 실패 결과 옆에 `<name>-candidate.svg`, 결과 JSON에 `violations`(코드·라벨 id·정도)와 `scoreGate`(`status` SCORED_PASS|FAIL_SCORE|BLOCK…, `score`, `deductions`, `tableVersion`)가 붙는다. 통과하는 그림의 SVG·결과는 그대로다(성공 결과에는 새 필드가 없다). `status`는 FAILED로 둔다: SCORED_PASS는 게시 관문이 받아 주는 후보라는 표시이고, 후보를 아카이브 캡처에 묶어 게시하는 단계는 다음 일이다. 정도 숫자는 관측기가 이미 계산하던 값을 위반 항목에 싣기만 한다(검사 로직 불변). 배치 단계에서 멈추는 코드(`STAT_*` 배치, `*_NO_ROOM` 등)는 후보가 없다(생성기가 차선 자리에 놓아야 풀린다).
- **기준표 v3·3단계(2026-11-23):** `LABEL_GEOMETRY_COLLISION`에 가림 비율을 싣는다(실패일 때만; 관측기 판정·문턱·오류 문구는 그대로). `degree.d`는 그 도형이 라벨 상자를 가린 비율, `degree.labelHidden`은 그 라벨에서 부딪친 모든 도형이 함께 가린 비율이고, 둘 중 하나가 0.5 이상이면 막음이다(`overlap` blockAt). 선·점·원둘레는 획 두께만큼, 노크아웃·조건 상자는 넓이로 센다. 이유: 라벨이 도형에 절반 넘게 가려져도 고정 3점으로 통과하던 구멍.
- **점수 통과분 게시 연결:** `render-plan.mjs --accept-scored 1`(또는 `APMS_ACCEPT_SCORED=1`)이면 후보가 SCORED_PASS인 실패를 한 번 더 렌더해, 점수 90 이상인 겹침·근접은 통과시키고 아카이브 캡처까지 묶는다. 결과는 보통 PASS와 같은 `ARCHIVE_BOUND`(+ `figure-solution.svg`)이고 `scoreGate`(status SCORED_PASS, score, passScore, tableVersion, stage, stages, deductions)와 `violations`가 붙는다. 기본은 꺼짐(켜지 않으면 모든 결과가 그대로). 막음·점수 미달·다른 검사 실패면 처음 실패 결과가 그대로 남는다. 게시는 기존 도구가 받는다: `ops/svg-m1/publish-exam.py`가 `scoreGate`를 검증(SCORED_PASS·점수≥합격선·tableVersion)해 게시 행에 영수증으로 싣고, `ops/tools/publish-figures.mjs` 보고에도 점수가 남는다. 게시 가능 목록은 `ops/score/publishable.mjs <렌더 폴더...>`로 뽑는다(`receipt`: SCORED_PASS, score, deductions, tableVersion). 점수 통과분도 눈 검수(PNG)는 그대로 거친다.
- 표본 PNG는 아카이브 실제 표시 크기로 본다: A4 쪽 단 폭 316px(`archive/figure-size.css`의 `--ap-col-w`)에서 문제 그림 75%(`--ap-fig-q`)·해설 그림 80%(`--ap-fig-sol`), 휴대폰은 390px 폭. 값은 이 파일에서 직접 읽는다.
- 이유: 모든 겹침·근접을 실패로 두면 학생이 읽는 데 지장이 없는 그림까지 게시가 막혀 그림이 쌓인다(실패 213건 중 SVG가 남은 것은 0건).

### 해설 그림 장부 (2026-11-17)

- 장부는 시험지 하나에 파일 하나다: `archive/tools/geometry-equation/production/exam-figure-ledger/<archive/exams/original 아래 경로>.json`(머리는 `_meta.json`). 옛 한 파일 `exam-figure-ledger.json`은 없앴다. 읽기·쓰기는 `ops/svg-m1/figure_ledger.py`·`figure-ledger.cjs`와 그것을 쓰는 도구(`ledger-upsert.py` 등)로만 하고 손으로 고치지 않는다.
- 쓰기는 문항 단위다. 이미 PUBLISHED인 문항은 spec의 `published`·`exempt_override`·`demote`로 그 번호를 직접 넘길 때만 바뀐다. 일부 문항만 다시 게시해도 나머지 PUBLISHED는 그대로다. CLOSED는 모든 문항이 PUBLISHED/EXEMPT일 때만 저장된다.
- 서로 다른 시험지의 그림 PR은 장부에서 충돌하지 않으므로 순서를 기다리지 않고 각자 검수를 통과하면 병합한다(CI 녹색은 병합 조건이 아니다: common.md). 같은 시험지 파일이 충돌하면 main 판을 받고 그 시험지에 `ledger-upsert.py`를 다시 돌린다. 옛 한 파일을 고친 열린 PR은 `python archive/tools/geometry-equation/ops/svg-m1/figure_ledger.py port-ledger-change --base <갈라진 main 커밋> --head <브랜치>`로 옮긴다(PUBLISHED를 내리는 변경은 충돌로 멈춘다).
- 전체 요약 `production/exam-figure-queue.md`는 게시 때 고치지 않고, 필요할 때 `figure_ledger.py queue`로 다시 만든다.
- 이유: 한 파일 장부를 모든 그림 PR이 고쳐 서로 다른 시험지 PR도 하나씩만 병합됐고, 부분 게시가 기존 PUBLISHED를 OPEN으로 덮은 사고(22개 시험지 402문항, PR #1778로 복구)가 있었다.

### 현행 흐름 (2026-11-24) — SVG 공장 운영, 모든 AI 공통 (아래 11-19 흐름보다 우선)

Claude(어느 계정이든)·GPT(Codex)·Gemini(Antigravity)·DeepSeek 어느 엔진이든, SVG 그림 작업은 이 문서대로 이어 간다. 엔진 규칙은 이 문서 다른 절과 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`가 정본이다. 이 문서는 "일을 어떻게 흘리는가"를 적는다.

원칙(원장님): **쉽게·넓게·빠르게·변화하게.** 그림이 통과하면 모아 두지 않고 바로 운영 병합한다. 문항은 그림이 없어도 먼저 들어간다. 이유: 학생이 바로 해설·기출을 참고해야 한다.

#### 1. 내 역할 찾기
| 내가 맡은 일 | 할 것 | 하지 않을 것 |
| --- | --- | --- |
| **plan 작성**(DeepSeek·Gemini·GPT 같은 외부 모델) | 문항 발문·정답·해설과 AUTHOR_GUIDE를 읽고 plan JSON만 쓴다. 문제 그림에는 발문 값만, 정답은 넣지 않는다. 해설 그림은 과정 정보를 최대로 넣는다. | SVG를 직접 쓰지 않는다. 파일을 만들거나 명령을 실행하지 않는다(답만 출력). |
| **렌더·게시**(Claude 작업자) | 저장소 엔진으로만 렌더하고 PNG를 직접 본다. 통과분은 바로 PR. | Claude(Sonnet)는 plan을 쓰지 않는다. 손·스크립트로 SVG를 조립하지 않는다. |
| **엔진 개선**(Claude 작업자) | 엔진이 못 그리는 꼴이 나오면 번호 보고로 끝내지 않고 결함 종류 단위의 공통 기능을 바로 넣는다(예제 plan·테스트·AUTHOR_GUIDE). 기능은 켰을 때·실패했을 때만 동작해 기존 그림 바이트가 같게. 골든 게이트 REGRESSED·CLIPPED·NOT_RUN 0. | 검사 기준(하한·허용치·지시선 규칙)을 낮추거나 단언을 지워 통과시키지 않는다. |
| **병합 창구**(SVG 라인 메인) | PR마다 PNG 표본 1~3장을 발문·정답과 대조하고 `--match-head-commit`으로 즉시 병합. 엔진 PR은 다른 인스턴스의 검수(바뀐 부분·관련 테스트만) 뒤 병합. | 그림을 모아 두지 않는다. 보고만 믿지 않는다. |

#### 2. plan 모델 순서와 한도
1. DeepSeek `opencode-go/deepseek-v4.1-flash`(opencode, `-f`로 지시·그림 첨부).
2. Gemini 3.8 Flash — Antigravity CLI: `agy -p "<프롬프트>" --model gemini-3.8-flash --effort high`. 첨부·긴 지시는 프롬프트에 **절대경로**로 적어 agy가 직접 열게 한다(명령줄 길이 한도). 호출당 약 4분. `empty conversation id` → 5분 뒤, `RESOURCE_EXHAUSTED 429 Individual quota` → 15분 간격 재시도(무료·AI Plus 계정은 주간 기본 한도).
3. Codex(GPT) `codex exec`.
- 셋 다 한도면 원장님께 묻는다. **결제·업그레이드·계정 교체는 원장님 몫**이고 AI가 대신하지 않는다.

#### 3. 흐름 (대량)
1. **대기열:** 그림이 필요한데 main에 그림이 없는 키만 넣는다(이미 있는 키는 뺀다: 같은 일을 두 번 한 일이 있었다). 키 형식 `<시험지 stem>-q<번호>-problem|solution`. 작업 순서는 최신 연도부터.
2. **plan 쓰기:** 묶음(5문항 안팎)으로 외부 모델에 보낸다. 렌더 전 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json…>`로 형식 오류를 먼저 거른다.
3. **렌더:** 같은 형태(원·삼각형·그래프…)끼리 40개쯤 묶어 엔진(`archive/tools/geometry-equation/production/render-plan.mjs --manifest <pk> --out <out>`)에 한 번에 넣는다. 동시 4개 기본. **plan을 다 쓸 때까지 기다리지 않고** 나온 plan부터 주기적으로(20분쯤) 렌더한다. 이미 렌더한 키는 건너뛴다.
4. **자동 검사:** 언어 계약 `archive/tools/svg-language-contract.cjs`, 시험지 JS 파싱, TeX, 관련 테스트. 정답이 보이는 **문제** 그림만 빼고(HOLD) 시험지는 넣는다. 해설 그림은 정보 우선(정답 보여도 됨). 엔진이 못 그린 문항은 그림 없이 두고 나중에 빈자리를 채운다.
5. **게시:** 통과분을 시험지 30~50개 단위 PR로 바로 올린다. 새 유사 시험지는 그림이 하나라도 있으면 반입, 운영 시험지는 빈 그림 자리를 채운다.
6. **병합:** 병합 창구가 즉시 병합. 등록기(main 자동 메타)는 연속 병합에도 멈추지 않는다. 학생 사이트 반영은 등록·릴리스 뒤.
7. **수리:** 빠진 그림(정답 노출·렌더 실패)은 상시 수리 라인이 plan을 고쳐 다시 렌더·게시한다. "그림 모양이 곧 정답"인 문항은 그림 없이 둔다.

#### 4. 소량(문항 몇 개)
visual-svg.md "② 문항 몇 개만 그릴 때" 절차를 쓰되 plan은 위 외부 모델에 맡긴다. 기존 해설 plan의 "문제 그림" 패널을 덜어 쓰는 것은 새 plan 작성이 아니므로 작업자가 해도 된다.

#### 5. 운영 위생
- 멈춘 렌더: 40분 넘게 돌았는데 30분 동안 출력이 없는 렌더 묶음은 끄고 그 키만 `--rerender`로 다시(11-24에 15시간 멈춘 일이 있었다).
- 남의 라인 프로세스·폴더는 읽기만. 무거운 작업 전 CPU 확인.
- 워크트리는 병합되면 바로 지운다. 지우기 전 junction을 깊이 제한 없이 찾아 `cmd /c rmdir`로 끊고, 삭제는 `git worktree remove`로만. `Remove-Item -Recurse`·`.tmp` robocopy /MOVE 금지.
- node 아카이브 테스트는 워크트리 루트에서 돌린다(하위 폴더면 TEMPORARY_WORKSPACE_REQUIRED). 새 워크트리 python 의존은 루트 `.tmp/apmath-visual-engine/dependencies` junction, playwright는 `GEOMETRY_NODE_MODULES`.
- 정직한 기록: 안 돌린 검사는 NOT_RUN. "깨진다"는 화면으로 본 것만.

#### 6. 집 PC 공장 (도구 위치)
집 PC에는 위 흐름을 자동으로 돌리는 저장소 밖 도구가 있다: `D:/AP-svg-factory/README-PIPELINE.md`(명령·폴더·장부), `D:/AP-svg-factory/factory/merge/`(즉시 병합·30분 자동 게시 루프 사본), `labor/ds`(DeepSeek)·`labor/ds-gem`(Gemini) 파이프라인, `factory/pub-orig`·`pub-sim`(자동 게시), `factory/repair-gem`(수리), `labor/render-watchdog.ps1`(멈춘 렌더 감시). 다른 PC에서는 이 도구 없이 3절 흐름을 저장소 엔진 명령으로 따른다.

### 이전 흐름 (2026-11-19) — ① 대규모 캠페인(SVG 라인)
1. **DeepSeek 초안**(`opencode-go/deepseek-v4.1-flash`, effort 설정 없음). 시험지 단위로 `ops/claude-batch/ds-launch-exam.sh <key> <시험지 JS>`를 띄운다(지시문 `prompts/ds-exam-draft.md`). 전 문항의 그림 필요 여부를 판정하고 item/plan/publish JSON을 쓰고 `node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <dir>`로 ARCHIVE_BOUND까지 렌더한 뒤, `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`으로 만든 PNG를 **직접 보고** 1차로 고친다. DeepSeek은 그림을 본다(2026-11-16 `opencode run -f <png>`로 정육각형 라벨 순서·대각선까지 읽음 확인). 실행 안에서 PNG를 못 열면 메모에 남기고 시각 판단은 Sonnet에 넘긴다.
2. **Sonnet 검수·마감은 한 번**(effort high, 지시문 `prompts/sonnet-exam-impl.md`). 원문·정답·해설과 PNG를 대조하고 plan을 고쳐 다시 렌더한다(손 SVG 금지). 최종 판정표와 기계 점검(ARCHIVE_BOUND, publish size = sizeClass, alt·caption 비어 있지 않음)을 낸다. 두 번째 Sonnet 검수는 두지 않는다. 메인이 PNG 표본에서 결함을 찾으면 메인이 직접 plan·publish를 고쳐 `render.mjs`로 다시 렌더한다(손 SVG 금지; 이유: 결함 하나에 지시서를 쓰고 Sonnet을 다시 돌리는 것보다 빠르다). 같은 묶음에 결함이 여럿이거나 같은 종류가 반복되면 지적 목록을 붙여 그 묶음을 Sonnet 검수·마감 단계로 돌려보낸다. `sonnet-final.md`는 과거(Sonnet B) 지시서다.
3. **메인이 PNG 표본을 확인한 뒤 게시하고 PR을 올린다.** 게시 도구는 `ops/svg-m1/publish-exam.py`·`pubflow.py`이고 사용법은 HANDOFF 문서 §3-2·§4다. 시험지 5개쯤을 PR 하나로 묶는다.
4. **엔진 미지원(손으로 메우지 않는다)은 백 개 중 한두 개가 정상이다.** 더 많으면 plan부터 의심한다. 손으로 그리지 않고, 지시선·패널·옵션으로 시도한 증거와 오류 코드를 붙여 UNSUPPORTED로 두고 그림은 보류한 뒤 `ops/claude-batch/ENGINE_GAPS*.md`에 남겨 엔진 라인으로 넘긴다. 큰 묶음(플랜이 많이 쌓인 경우)은 같은 단계를 묶어 돈다: 일괄 렌더 → 자동 관문 → Sonnet 모음 시트 눈 검수 → 실패분 처리(SPEC은 플랜 수리, ENGINE은 엔진 라인) → 게시.
5. **plan 사전검사:** plan을 쓴 뒤 렌더 전에 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs <plan.json…>`로 검사하고 OK가 될 때까지 고친다(문항당 1초 안팎). 렌더 결과에 좌우되는 오류(라벨 배치, 표시 크기 일부)는 lint로 못 잡는다. 이유: 2026-11-20 렌더 실패 1,008개 중 863개가 렌더 없이 잡히는 plan 형식 오류였다.
6. **공장 동시 렌더:** 재사용 엔진(#2590 병합)부터 동시 4개가 기본이고 6개까지 새 실패가 0이었다(8코어 16스레드 PC). 다른 렌더가 함께 돌면 4로 둔다. 이유: 예전 상한 2는 4코어 PC와 매번 python·Chrome을 띄우던 엔진 기준이었다.
**② 문항 몇 개만 그릴 때(문항 수리·유사문제 반입 등, DeepSeek 없이 Sonnet 작업자가 직접)** 저장소 루트, 새 작업 트리 기준: `mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/` → `bash archive/tools/geometry-equation/ops/claude-batch/restore.sh`(`.tmp/work/`로 펼침) → 렌더 의존성(playwright가 든 node_modules)이 없으면 `GEOMETRY_NODE_MODULES` 지정 → 먼저 `AUTHOR_GUIDE.md`와 `.tmp/svg-m1/guide/`의 해당 형태 가이드를 읽고, 문항 폴더마다 `item.json`({"sourcePath": 시험지 JS 경로, "ordinal": 문항 id})·`plan.json`(`ops/golden/<item>/plan.json`이나 같은 형태의 통과 사례 `.tmp/work/runs/*/exam-rev/qNN/plan.json`을 본떠 값만 바꾼다)·`publish.json`(alt·caption·size=sizeClass) 작성 → `node .tmp/work/render.mjs --item item.json --plan plan.json --out <dir>`로 ARCHIVE_BOUND 확인 → `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`으로 PNG를 만들어 원문·정답·해설과 직접 대조 → PNG를 메인에게 제출(메인이 눈으로 검수·마감) → 통과분을 `make-dec-exam.cjs`·`build-pub.py`(BAD 없음)·`pubflow.py --batch`로 게시. 손 SVG 금지, 결함은 plan을 고쳐 재렌더.
**현행으로 살아 있는 품질 규칙:** y=x·기울기 ±1 직선·원이 있는 단일 유리·무리함수 그래프는 `equalUnits:true`를 쓰고 PNG를 정답·해설과 대조한다(눈금 비 차이로 45°보다 가파르게 그려진 그림이 검수를 통과해 사용자가 지적했다). 정해진 DeepSeek·Sonnet 단계 밖의 다른 모델·하위 에이전트에 구현·검수를 넘기지 않고, PNG는 직접 보고 판단한다. 이 흐름에서는 대기열 상태 줄·잠금 같은 라인 간 조율 문서를 쓰지 않는다. 옛 루나 구현·검수 절차(2026-11-04~08)는 git 이력에 있다.


## 확률과 통계 해설 그림 필요 판정 (2026-11-19, 사용자 지시)

확률과 통계도 "학생 풀이에 조금이라도 도움이 되면 만든다"는 기준을 따른다. 다만 해설 식을 그림으로 한 번 더 옮긴 것은 도움으로 보지 않는다.
- **만든다:**
  - 경우를 나열해 보여 줘야 하는 수형도(`stat-chart-figure-v1` TREE)
  - 정규분포·연속확률분포 곡선과 구간 넓이(NORMAL_CURVE)
  - 넓이로 푸는 확률밀도 그래프
  - 이산확률분포 막대
  - 칸 묶음을 강조하는 주사위 6×6 표
  - 사건 관계가 풀이의 핵심인 벤다이어그램
  - 원순열 배치, 최단경로 격자
- **EXEMPT:**
  - 곱의 법칙·순열·조합·이항계수의 단순 계산(4×3, 5×4, ₅P₂ 같은 것)
  - 식만으로 끝나는 확률 계산
  - 해설에 이미 같은 나열이 있는 문항

  사유에는 "무엇을 계산하는 문제라 그림이 보탤 정보가 없다"를 적는다.
- **확률분포표·분할표 같은 표**는 SVG로 그리지 않고, 해설 글 안에 AP Table Engine(HTML 표, [table-engine.md](table-engine.md))으로 넣는다.
- 이미 게시한 확통 그림은 이 절 때문에 되돌리거나 지우지 않는다. 새로 판정하고 만드는 문항에만 적용한다.
- 이유: 단순 계산 문항에도 해설 식과 같은 내용의 그림을 억지로 넣은 경우가 있었다. 다른 과목은 그래프·단위원·도형이 실제로 필요해서 이 문제가 확통에만 있다.

## 설명 문구 품질 미달은 등록·게시를 막지 않는다 (2026-11-24, 사용자 결정: "수정프로토콜에 걸림 있는 건 다 없애버리는 게 맞다")

등록기 studentIndexes 레인(`build-svg-accessibility-index.cjs --base`)에서 `--base` 이후 바뀐·새로 연결된 SVG가 `SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE`(설명이 구체적이지 않음)·`KOREAN_MEANING_REQUIRED`·`ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW`·`MATH_MARKUP_ACCESSIBILITY_REQUIRES_REVIEW`에 걸려도 색인은 만들어지고, 빌더가 `SVG_ACCESSIBILITY_QUALITY_ADVISORY svgs=N findings=M` 줄과 그림 목록(앞 50개)을 출력한다. 이 목록이 수리 목록이다. 루트 없음·title/desc 없음·id 중복·aria 참조 깨짐·내부 문구 같은 실제 결함은 전과 같이 막는다(`svg-language-contract.cjs`의 `QUALITY_ONLY_CODES`, 호출 쪽이 `advisory` 배열을 줄 때만 적용). 그림을 만드는 작업(엔진·`assertSvgStudentLanguage` 직접 호출)과 `--expected-source-index` 감사 모드는 그대로 엄격하다. 전체 목록(저장소 모든 SVG, 시험지·문항 번호·현재 title/desc 포함, ENGLISH·MATH 코드 먼저)은 `node archive/tools/build-svg-accessibility-index.cjs --quality-report <out.tsv|out.json>`로 뽑는다(색인은 쓰지 않고 차단하지 않음, `svg-quality-report.cjs`). 이유: 저장소에 같은 판정에 걸리는 옛 그림이 2,600개 넘게 있어, 그 그림이 든 시험지를 고치거나 새 유사 세트를 올리는 것만으로 필수 레인이 멈춰 학생 사이트 게시가 막혔다(run 45170490117·45171814773).

## 해설 그림 정보 우선 (2026-11-17, 사용자 결정)

해설 SVG는 학생이 그래프를 보고 이해해 마지막에 정답을 유추하게 돕는 것이라 풀이 과정 정보를 최대한 넣고, 정답이 그림에 있다는 이유로 반려하지 않는다(정답이 꼭 있을 필요도 없다). 문제 그림은 종전대로 정답·새 풀이 보조선을 노출하지 않는다. 이 절이 이전의 해설 그림 정답 숨김·정답 노출 FAIL 조항(공통 프롬프트, 고1 2학기 기말 경로, AUTHOR_GUIDE, ops 지시서·인계 문서)보다 우선한다. 이유: 학생 화면(`archive/engine.html`)은 [정답]을 맨 위에 보여 준 뒤 해설 그림을 붙이므로 정답을 숨겨도 막는 것이 없고 그림만 빈약해지며, 정답 관련 좌표·눈금·식을 모두 숨긴 사양 8개가 축 이름만 남아 렌더 관문에서 실패했다.

## 다른 AI 라인용 SVG 도형 엔진 작업 프롬프트 (2026-11-03, 사용자 지시)

Claude·GPT·Codex 어느 라인이든 기출·생성문항의 문제·해설 그림을 이 엔진으로 만들 때는 아래 블록을 그대로 작업 지시로 쓴다. 이유: 라인마다 그림 기준과 절차가 달라 엔진 밖 손그림·정답 노출·떠 있는 라벨이 반복됐고, 2026-11-02~03에 25·24 고1·고2 기말 303장을 이 절차로 만들어 기준이 굳었다.

```text
[SVG 도형 엔진으로 문제·해설 그림 만들기 — Claude·GPT·Codex 공통]

목표: 학생이 PC·휴대폰에서 보고 풀이를 따라갈 수 있는 해설(또는 문제) 그림을 저장소의 SVG 엔진으로 만든다. 손으로 SVG를 쓰지 않는다. 엔진 출력만 관측기가 식·라벨·눈금을 다시 대조해 주기 때문이다.

0. 먼저 읽기
   - archive/tools/geometry-equation/HANDOFF_SVG_ENGINE.md: §00(최신 현황), §1(사용자 지시), §2.2(파이프라인), §3(도구 복원)
   - archive/tools/geometry-equation/ops/svg-m1/briefs/plan.md와 plan-current.md(그림 규칙, plan-current가 우선)
   - 작성 지침은 ops/svg-m1/guide/guide-tips.md, guide-core.md, 그리고 형태별 발췌 하나(guide-plane / solid / stat / graph). plan 계약 전문은 production/AUTHOR_GUIDE.md다.
   - 비슷한 정답지 예시: ops/golden/<item>/plan.json(목록은 ops/golden.manifest.json)

1. 준비(새 환경에서 한 번, 저장소 루트에서)
   mkdir -p .tmp/svg-m1/runs .tmp/svg-m1/packets && cp -r archive/tools/geometry-equation/ops/svg-m1/. .tmp/svg-m1/
   export PYTHONPATH=$PWD/.tmp/apmath-visual-engine/dependencies/python
   export GEOMETRY_BROWSER_EXECUTABLE=<Chromium 경로>

2. 문항 하나 처리
   a. packet을 만든다(.tmp/svg-m1에서): node make-packet.mjs <시험지 JS 저장소 상대경로> packets/<시험지>.json --with-existing
   b. 문제 그림, 문제, 정답, 해설을 직접 읽는다. 해설이 쓰는 방법(보조선, 닮음, 넓이 옮기기, 대칭, 경계 사례)과 그림에 넣을 중간값 목록을 먼저 정한다.
   c. AUTHOR_GUIDE 계약대로 item.json과 plan.json을 쓴다. 같은 형태의 정답지 plan 구조를 재사용한다.
   d. 렌더(저장소 루트): node archive/tools/geometry-equation/production/render-plan.mjs --item item.json --plan plan.json --out <out폴더>
      결과가 ARCHIVE_BOUND여야 한다. 렌더 횟수에는 제한을 두지 않는다(사용자 지시 2026-11-07: 필요하면 충분히 여러 번 렌더한다. 횟수 한도는 품질을 막을 뿐 의미가 없다). 렌더는 한 번에 하나씩 한다. 부하가 높으면 기다린다.
   e. figure.png를 직접 보고 3번 기준으로 확인한다.
   f. publish.json을 쓴다: {"alt": 그림 설명, "caption": 풀이 요약 + 끝에 정답, "size": 렌더 결과 figure-result.json의 sizeClass와 같은 값}
   g. out/figure-solution.svg 루트에 role="img"와 깨지지 않은 <title>이 있는지 본다. plan의 한글 문자열은 UTF-8로 쓴다(깨진 글자가 그대로 SVG 제목이 된다). 합성 패널(composite-panels)·수직선·입체 출력도 엔진이 루트 role="img"·<title>·<desc>를 직접 쓴다(plan `caption`·선택 `accessibilityDescription`, 단일 그림과 같은 출처). 별도 보완 스크립트(a11y.sh·upgrade-svg-accessibility.mjs)는 이 엔진 이전에 만든 SVG에만 쓰며, 이미 들어 있으면 `METADATA_ALREADY_PRESENT`로 거절된다.

3. 판정 기준(학생 기준, 모두 지킨다)
   - 해설 그림: 풀이 과정의 정보(해설이 쓰는 교점·극점 좌표, 눈금, 곡선 식, 보조선, 중간값, 경계 곡선·직선)를 최대한 넣는다. 정답(구하는 값, 보기 번호, 서술형 소문항 답)은 그림에 있어도 없어도 된다. 정답이 보인다는 이유로 반려하지 않으며, 반려 사유는 과정이 빠졌거나 틀린 것이다. caption은 풀이 요약 + 끝에 정답이다("해설 그림 정보 우선" 절, 2026-11-17).
   - 문제 그림: 정답과 새 풀이 보조선을 노출하지 않는다(기존 규칙 유지).
   - 자리가 없을 때 hideLabels·좌표 띠 등으로 정리하는 것은 레이아웃 도구이지 정답 숨김용이 아니다.
   - 라벨은 이름 붙인 대상 곁에 둔다. 떠 있으면 지시선(callout, leader)을 먼저 쓰고, 필수 라벨을 지워서 통과시키지 않는다.
   - 점 이름은 선 안쪽, 길이 치수선은 바깥(짧은 것 안, 긴 것 밖)에 둔다.
   - 같은 각·길이, 평행, 대응변, 같은 넓이는 같은 색으로 묶는다(핵심 2~3개, 주로 BLUE·WARM).
   - y=x 대칭, 정사각형, 기울기가 중요하면 가로·세로 눈금을 같게 한다(equalUnits, multi-curve는 기본이 같은 눈금).
   - 해설이 쓰는 교점은 그림 창 안에 있어야 한다. 곡선이 해설의 어느 함수(f, g, f⁻¹…)인지 그림에서 보여야 한다.
   - 입력용 표기(^, sqrt, *, ^c, f^-1)를 쓰지 않는다. 수식 필드로 위첨자·근호를 쓰고, 글자만 받는 곳은 같은 뜻의 식으로 바꾼다.
   - 문제 그림의 점 이름과 배치를 따른다. 작은 패널 여러 개보다 큰 그림 하나를 쓴다(합동·닮음은 아래 예외).
   - 합동·닮음 해설 그림은 항상 두 그림을 함께 보인다: ① 문제 배치 그대로의 그림, ② 대응하는 두 도형을 떼어 같은 방향으로 나란히 펼친 그림(대응 꼭짓점 이름 유지). composite-panels-v1(평면도형 패널)로 한 장에 담고, 두 패널에서 같은 색·같은 눈금/호 표식 = 같은 대응이다. 휴대폰 폭에서 작으면 세로로 쌓는다. 문제 그림에서 이미 두 도형이 떨어져 같은 방향이면 ①로 충분하다. 엔진이 못 그리면 ②를 빼고 통과시키지 말고 UNSUPPORTED로 둔다. 이유(사용자 2026-11-10): 중등 학생은 겹치거나 꼭짓점을 공유한 도형을 펼쳐 보지 않으면 대응을 이해하지 못한다.
   - 예시 값으로 그린 그림은 caption에 "예:"라고 밝힌다. 근사로 만든 좌표값은 그림에 쓰지 않는다.
   - 유리함수·무리함수 단일 그래프(rational, sqrt-affine 등)는 기본 눈금 비가 달라 y=x가 45°보다 가파르게 그려진다. y=x·기울기 ±1 직선·원이 있으면 반드시 graphPlan.equalUnits:true를 쓰고 PNG에서 45°인지 본다.
   - 곡선이 여럿이면 각 곡선의 라벨을 실제 그 곡선 곁에 지시선으로 붙인다. 라벨 자리가 없다고 숨기거나 엔진 공백으로 넘기지 않는다.
   - 해설에 없는 보조 경로·예시 선을 함수 그래프와 같은 실선으로 그리지 않는다. 반복(합성) 경로는 세로·가로 선분을 끊김 없이 잇고, caption이 값으로 설명하는 점은 그림에서 그 값을 읽을 수 있게 한다(점 라벨·축 눈금 라벨).
   - caption·alt는 그림에 실제 보이는 이름·요소만 가리킨다("그림의 C"라고 쓰려면 그림에 C가 있어야 한다).
   - 그림은 고1 교육과정 안의 대상과 해설이 실제로 쓰는 방법만 그린다. 엔진이 못 그린다고 교육과정 밖 그래프(분모가 2차·3차인 유리함수 등)나 해설에 없는 치환 그래프로 우회하지 않는다. 문제 자체의 함수·조건을 그리는 쪽을 먼저 검토한다. 치환 변수를 쓰면 문제 변수와 다른 이름을 쓴다.
   - 이유(2026-11-08 사용자·최종 검수 지적): y=x 반복 경로 그림이 눈금 비 차이로 가파르게 그려져 두 단계 검수를 통과했고, 라벨을 숨긴 곡선 4개·끊긴 반복 경로·교육과정 밖 4/t³ 그래프가 게시 직전까지 갔다.

4. 막히면
   - 지시선 → plan 구조 바꾸기 순서로 시도한다. 그래도 안 되면 UNSUPPORTED로 두고, 빠진 엔진 기능을 정확히 적는다(ops/svg-m1/gaps.md 후보).
   - 엔진 공백은 문항마다 고치지 않고 모아 두었다가 한 번에 설계한다(사용자 결정 2026-11-08, 설계는 Sonnet). 그동안 해당 문항은 OPEN으로 두거나 교육과정 안의 다른 그림으로 대신한다. 라벨 배치 문제는 공백이 아니라 지시선으로 먼저 푼다. 이유: 라벨 자리 문제 대부분이 지시선으로 해결됐고, 공백을 하나씩 고치면 엔진 변경이 잦아진다.
   - 엔진 코드 수정은 이 프롬프트 범위 밖이다. 별도 지시서(ops/svg-m1/briefs/engine-*.md 형식), 별도 작업 공간, 다른 검수자, 정답지 표본 비교를 거친다.
   - 문제 그림과 해설·정답이 서로 맞지 않으면(CONTENT) 그리지 않는다. 문제 기준으로 다시 계산한 정답과 근거를 보고한다.

5. 검수와 게시
   - 다른 AI 인스턴스가 ops/svg-m1/briefs/review1.md로 그림과 publish.json을 검수해 PASS한 것만 게시한다.
   - 게시는 .tmp/svg-m1/pubflow.py로 한다(HANDOFF §00 "시험지 하나 처리 절차"). 이미 그림이 있는 문항을 교체할 때는 rows에 "replace": true를 넣는다.
   - 게시 뒤 더 쓰이지 않는 옛 그림은 정리한다. 커밋에는 운영물만 넣고, 증거와 렌더 출력은 넣지 않는다.
   - 원본 시험지·공유 데이터 고정값 규칙(docs/agents/common.md)을 지킨다. 병합 뒤 main CI에서 내 변경이 만든 실패를 고친다(CI 녹색은 병합 조건이 아니다: common.md).

6. 브라우저 렌더를 돌릴 수 없는 라인
   - item.json, plan.json, publish.json 초안까지만 만들고, 렌더·검수·게시는 실행 가능한 라인에 넘긴다.
   - 렌더하지 않은 그림을 PASS로 적지 않는다(NOT_RUN).

보고: 시험지·문항별 상태(ARCHIVE_BOUND / FAILED / UNSUPPORTED)와 렌더 수, 확인한 PNG 경로, CONTENT, 엔진 공백, 사용자 결정이 필요한 것.
```

## 옛 그림의 접근성 표기 누락도 등록·게시를 막지 않는다 (2026-11-24, 사용자 결정)

등록기 studentIndexes 레인에서 엔진 그림이든 옛 그림이든 `TITLE_DESC_REQUIRED`·`ROLE_IMG_REQUIRED`·`ARIA_REFERENCE_INVALID`·`TITLE_DESC_ID_INVALID`는 막지 않고 목록(advisory, `--quality-report`의 `legacy-a11y`)으로만 남긴다. title/desc가 없는 그림의 색인 행에는 시험지·문항·역할로만 만든 기계 대체 문구(예: "<시험지 이름> 3번 해설 그림")를 넣고 행에 `textSource: "MACHINE_SUBSTITUTE"`를 둔다(내용을 추측하지 않는다). 화면 쪽 `svg-accessibility.js`는 이 행을 그림 이름으로 쓰지 않아 시험지의 기존 이름과 호출한 쪽 기본값이 그대로 쓰인다. 엔진 그림이 이 표기를 빠뜨리면 엔진 회귀이지만 등록기는 막지 않고 같은 목록으로만 알린다(엔진 회귀를 잡는 일은 그림을 만드는 쪽, SVG 라인의 게시 단계 몫; 2026-11-24 방침 변경, 이유: 등록 실행 45334205571이 `24_매산여고_1학기_중간_고2_확률과통계_유사/q07-problem.svg` 한 장의 title/desc 누락 때문에 필수 등록 미완으로 끝나 학생 사이트 릴리스가 막혔다). 엔진 표지(루트 태그)는 이제 `SCALE_GUIDANCE_FORBIDDEN` 같은 보이는 글의 차단 범위를 가를 때만 쓰이고, 두 종류다. ① 확정 표지(있으면 언제나 엔진 그림): `data-engine-version`, `data-stat-chart`, `data-set-diagram`, `data-number-line`, `data-text-free`, `data-publication-profile="geometry-publication-v1"` — 저장소 SVG 16,548개 가운데 이 표지가 있는 7,579개 전부에 role·title·desc·aria가 있어(오판 0) 기존 그림이 새로 막히지 않는다. ② 신규 경로 표지(`--base`에 없던 새 파일일 때만 엔진 그림): `data-composite`(1,734개 중 382개 누락), `data-conic`, `data-ellipse-figure`, `data-lattice-path`, `data-solid-figure`, `data-container-fill`, `data-publication-profile`(그 밖의 값) — 옛 엔진이 표기 없이 낸 그림이 이미 있어 표지만으로는 막지 않는다. 새 엔진 생성기를 만들면 접근성 블록을 항상 쓰고, 오판이 0인 표지를 ①에 추가한다(`svg-language-contract.cjs`의 `CONFIRMED_ENGINE_MARKERS`). 계속 막는 것: `INTERNAL_STUDENT_TEXT_FORBIDDEN`(학생 눈에 보이는 글; `SCALE_GUIDANCE_FORBIDDEN`은 옛 그림만 목록, 엔진 그림은 막는다), 루트 없음, 모양이 가리키는 id의 `DUPLICATE_ID`(아래 절), 파일 없음, 해시 불일치, `--expected-source-index` 감사 모드 전체. 이유: 옛 그림 2,600여 개가 표기가 없어, 그 그림 바이트를 바꾸거나 시험지에 새로 연결하는 수정이 필수 레인을 멈추게 했다. 표기를 채우는 일은 `--quality-report`의 `legacy-a11y` 목록으로 따로 한다.

## 아무도 가리키지 않는 id의 중복도 등록·게시를 막지 않는다 (2026-11-24, 사용자 결정)

등록기 studentIndexes 레인(`advisory` 배열을 주는 호출)에서 `SVG_ACCESSIBILITY_DUPLICATE_ID`는, 겹친 id를 `url(#id)`·`href="#id"`·CSS `#id`·SMIL `begin/end="id.…"`로 가리키는 곳이 없으면 막지 않고 목록(`SVG_ACCESSIBILITY_DUPLICATE_ID_UNREFERENCED`)으로만 남긴다(엔진 그림 포함). 가리키는 id가 겹치면(그라데이션·clipPath·marker·use) `<img>`로 넣어도 첫 번째만 잡아 그림이 달라질 수 있어 계속 막는다. title/desc·aria가 가리키는 id의 중복은 `TITLE_DESC_ID_INVALID`·`ARIA_REFERENCE_INVALID`가 따로 잡지만 이것도 이제 목록으로만 남는다. 그림을 만드는 쪽(엔진·`assertSvgStudentLanguage` 직접 호출)과 `--expected-source-index` 감사 모드는 그대로 엄격하다. 기준은 `svg-language-contract.cjs`의 `isAdvisoryError` 한 곳이고 `--quality-report`도 같은 함수를 쓴다. 이유: 옛 그림 31개가 점·선 이름표 id(`point-A` 등)를 두 번 써서, 그 그림을 건드리면 필수 레인이 멈췄다. 실제 화면(engine.html 학생 주소, `<img>`)에서 31개 모두 열렸고, 겹친 id를 서로 다르게 바꾼 사본과 화소 단위로 같았다(차이 0). 이름표 id는 어디서도 가리키지 않기 때문이다.

같은 날 `SVG_SCALE_GUIDANCE_FORBIDDEN`(그림 안의 "축척" 안내 문구)도 옛 그림(엔진 표지 없음, `legacyAllowed`와 같은 판정)은 목록으로만 남기고 엔진 표지가 있는 새 그림은 계속 막는다. 시험지가 참조하는 69개가 모두 옛 그림이고 학생 화면에서 읽히는 부가 문구라 피해가 없었다. 영어 문구("Coordinates drawn to scale…")는 이 코드와 별개로 `ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW` 목록에 그대로 남는다.

## 접근성 색인의 관리 행이 낡아도, 그림 문구가 걸려도 등록·배포는 계속한다 (2026-11-24, 사용자 결정: "쉽게 넓게 빠르게 변화하게. 고정이 없다. 바이트 고정해 놓은 것 자체가 잘못이다")

원칙: **그림 한 장의 문구 문제는 그 그림만 대체 문구로 내리고 등록·배포는 계속한다. 전체를 세우는 것은 학생 화면에 실제로 보이는 결함뿐이다.**

- **관리 행 해시 고정 해제.** `archive/data/svg-accessibility-manifest.v1.json`의 관리 행(사람이 확인해 박은 706개)의 `svgSha256`·`gitBlobSha`·`titleKo`·`descriptionKo`가 현재 SVG와 다르면 `build-svg-accessibility-index.cjs`가 더는 `SVG_ACCESSIBILITY_HASH_MISMATCH`·`METADATA_MISMATCH`로 던지지 않는다. 그 행을 현재 SVG에서 다시 만든 행(관리 행이 아닌 그림과 같은 경로, `recordFromCurrentSvg`)으로 쓰고 advisory 목록에 `SVG_ACCESSIBILITY_MANAGED_ROW_STALE` 한 줄을 남긴다. 매니페스트 파일은 고치지 않는다(이력). 물려받는 것은 그림 바이트와 무관한 값(역할, 시험지·문항 연결, ASSET_ONLY 여부)뿐이고, 그림 내용에 대한 판정(`answerHintFree`, `semanticClearanceOrigin`)은 다시 만든 행의 기본값으로 돌아간다(해설 `false`, 문제는 시험지의 그림 연결 `PRODUCTION_SOURCE_IMAGE_BINDING`). 시험지 연결이 사라진 문제 행은 쓸 곳이 없어 색인에서 뺀다. 파일 없음·깨진 SVG·엔진 그림의 실제 결함은 전처럼 막는다. `--expected-source-index` 감사 모드와 advisory 없는 직접 호출은 그대로 엄격하다.
- **화면에 보이지 않는 곳의 내부 용어.** `SVG_INTERNAL_STUDENT_TEXT_FORBIDDEN`이 `@title`·`@desc`·`@aria-label`(보이지 않는 글)에서 걸리면 등록기는 막지 않고 목록에 남기고, 그 그림의 색인 행은 기계 대체 문구(`textSource: "MACHINE_SUBSTITUTE"`)로 쓴다. 옛 그림·새 엔진 그림 구분 없다(화면 피해가 없으므로). 보이는 `<text>`(`@text`, `@text#id`)와 title 속성의 내부 글자는 학생 눈에 닿으므로 계속 막는다. 판정은 `svg-language-contract.cjs`의 `isHiddenInternalTextError`·`hasHiddenInternalText`.
- 이유: 그림은 계속 고쳐지는데 색인의 기대 해시를 PR이 손으로 맞춰야 해서, 그림 한 장(예: 21_금당중 q02_ALIVE_PROBLEM.svg의 desc에 든 `source`)이 studentIndexes 레인과 사이트 배포를 세웠다. 색인은 런타임에서 대체 글(alt)에만 쓰인다.
