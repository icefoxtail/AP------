# APMath 원클릭 Visual Production Engine 설계 초안 v0.1

**DRAFT / PRO·ASTRA REVIEW READY — 운영 정본·구현 지시로 아직 승격하지 않음**  
작성일: 2026-10-05 · 초안 작성: ChatGPT · Pro 검토: 미실시 · Astra 검토: 미실시

[Notion 설계 원문](https://app.notion.com/p/3f00e68bd69f81cd8753ed06e8ddf105?pvs=204) · 이 Markdown은 v0.1 공유용 사본입니다.

## 0. 이 설계가 해결하려는 것

> 최근 SVG 품질 개선을 위해 작업한 글꼴·수학 조판·라벨 배치·선과 색·충돌 검사·viewBox·좌표 증거·실제 Archive 렌더 기능을 엔진의 정식 내부 단계로 묶는다. 작업자는 한 번 요청하고, 생성 뒤 별도의 글꼴 변경이나 수동 후처리를 지시하지 않는다.

이번 목표는 예전 생성기를 다시 모으거나 TikZ·PGFPlots 등 backend 종류를 늘리는 것이 아니다. **최근 품질 개선 프로그램들을 같은 기준, 같은 입력, 같은 최종 파일을 대상으로 끝까지 실행하게 만드는 것**이다. 내부 모듈은 분리해도 된다. 외부 실행·설정·결과 책임만 하나로 만든다.

여기서 원클릭은 작업자·Codex·상위 파이프라인의 단일 요청을 뜻한다. 교사용 신규 UI, 시험지 자동 출제, 공용 평가 공장, 예약 레인 개편을 뜻하지 않는다.

**원클릭 생산 완료 ≠ 모든 문항의 수학 자동 증명 ≠ 독립 검수 생략 ≠ production 자동 배포.** 생성기 자체의 PASS로 최종 봉인을 대신하지 않는다.

## 1. 기준선과 범위

| 항목 | 이번 초안의 기준 |
|---|---|
| 저장소 | `icefoxtail/AP------` |
| 조사 시 main | `4572a0873e052a2554b269dccebf84643886e620` |
| 직전 반영 | constructed-coordinate evidence hardening, PR #273 |
| 반영된 source commit | `cfd9eee7cfb724f79636986840a4fffc994749ba` |
| 관련 현행 문서 | GPT Visual Production Contract / apmath-visual-upgrade skill |
| 이번 산출물 | 설계 초안과 독립 검토 질문 |
| 이번 작업에서 하지 않는 것 | 제품 코드 수정, 추가 Git commit/merge, 시험지 SVG 제작, 10시험지 캠페인 실행 |

기존 qualification의 Python 118/118, Node 48/48 및 synthetic desktop 5/5 PASS는 **이미 반영된 기능의 제한된 검증 이력**이다. 이 초안이나 원클릭 통합 전체가 검증됐다는 뜻은 아니다. [G0]

이하 **현재 확인**은 위 SHA의 코드·문서에서 확인한 내용이고, **제안**은 앞으로 구현·검토할 구조다. 제안한 함수명·필드명·실행 옵션은 아직 존재한다고 가정하지 않는다.

## 2. 현재 확인: 부품은 있으나 실행이 끝까지 연결되지 않았다

| 영역 | 현재 확인된 구현·참조 | 통합에서 해야 할 일 |
|---|---|---|
| 스타일·글꼴 설정 | `style_tokens.json` / `style_tokens.py` | 실행 시작 때 한 번 확정하고 측정·배치·출력·검사가 같은 설정을 사용하도록 연결 |
| 수학 표현 | `math_expression.py`의 AST·정확값·SVG 직렬화 | 수학적 의미와 실제 글자 크기·기준선·조판 표현을 분리하고 결속 |
| 생성 본체 | `engine.py`의 `build(spec, measurements=None)` | 순수 생성 함수는 보존하고 외부에 실행 조정층 추가 |
| 라벨 배치 | `label_layout.py` | 기존 실측값 입력을 자동 공급하고, 실패한 배치를 실제로 재생성 |
| 도형 표기 | `publication.py` | 점·각·길이·영역 owner 관계와 가독성 규칙을 내부 표준 단계로 사용 |
| 좌표 증거 | `coordinate_evidence.py` / `audit_publication.py` | source/constructed 구분과 독립 재계산 보존; 입력 출처·조건 완전성과 혼동하지 않음 |
| SVG 출력 | `svg_composer.py` | 최종 프로필·라벨 조판 결과를 소비; 출력 뒤 문자열 수정 금지 |
| 브라우저 측정 | `verify-rendered-layout.mjs` | 측정치를 생성 단계로 되먹이고 최종 collision/font 검사를 자동 실행 |
| Archive 실제 화면 | `record-visual-browser-evidence.mjs` | 실제 로드된 asset SHA·화면 크기·미리보기와 최종 결과를 결속 |
| 기존 호출 경로 | `build-visual-candidate.mjs` → `past_exam_adapter.py` | 기존 호환 경로를 유지하면서 publication 통합 실행을 제공 |
| skill에 적힌 별도 프로그램 | 아래 2.1 참조 | 실제 소스 확보와 호출 연결 여부를 먼저 구분 |

근거: [G1]–[G9]. 현재 `build()`는 SVG/TikZ draft와 build-side witness를 반환하며 실제 browser/Archive 검사 전체를 호출하지 않는다. `label_layout`은 측정값이 없으면 문자별 폭을 근사하고, 일반 라벨 기준선도 box 높이 비율로 배치한다. 실측 지원이 있다는 것과 실측이 자동 적용된다는 것은 다르다. [G2][G3]

### 2.1 문서에만 연결된 것으로 보이는 경로

현재 skill은 `assess_visual_need.py`, `preflight_svg_style.py`, `geometry_publication_profile.py`, `degrade_simulation.py`, `visual_qa_report.py`를 `.codex/skills/apmath-visual-upgrade/scripts/` 아래 명령으로 안내한다. 그러나 조사한 main의 해당 skill 디렉터리에는 `SKILL.md`와 `agents`만 있고 `scripts`가 없다. `preflight_svg_style.py` 직접 조회도 404다. [G1][G10]

따라서 이 다섯 프로그램을 **이미 저장소에 들어 있고 원클릭으로 사용할 수 있다**고 전제하지 않는다. 로컬·별도 branch·다른 정본 위치의 존재 여부는 아직 확인하지 않았다.

첫 구현 단계에서 프로그램마다 `기능 / 실제 소스 경로·SHA / 입력·출력 / 의존 도구 / 현재 엔진 호출 여부`를 한 번만 정리한다. 존재하면 복구·연결하고, 동일 기능이 이미 엔진에 있으면 중복 구현 대신 한 구현을 선택한다. 어느 위치에도 확보되지 않은 기능은 신규 작업량으로 표시한다. **목록에 이름을 등록하는 것만으로 완료하지 않는다.**

### 2.2 조판·검수 경계의 실제 공백

현재 글꼴 설정은 일반 글자 `Malgun Gothic, Noto Sans KR, sans-serif`, 수학 글자 `Cambria Math, STIX Two Math, serif`라는 family stack이다. 이것만으로 실행 환경에서 실제 사용된 글꼴·glyph가 동일하다는 보장은 확인되지 않는다. 이번 초안은 새 글꼴 family를 임의 선정하지 않는다. [G4]

현재 수학 직렬화의 분수는 SVG에서 괄호와 slash를 이용하고, 제곱은 superscript tspan으로 표현한다. AST의 정확값 보존과 전문적인 분수선·근호·지수 배치 품질은 별개의 항목이다. [G5]

현재 Archive 측정은 실제 로드된 SVG bytes를 확인하면서, 라벨 수치는 실제 이미지 크기로 만든 **격리 SVG replay**에서 측정한다. 이는 유용한 기존 검증이지만 최종 이미지의 글꼴 환경까지 같다는 추가 확인을 자동으로 대체하지는 않는다. [G8][G9]

또한 `engine.py` witness에는 `ARCHIVE_MODE_SOL_390` 이름이 남아 있다. 현행 desktop publication 기준과 맞도록 의미를 확인해 호환 이름을 정리할 필요가 있다. 이름만 고쳐 검증을 새로 통과했다고 처리하지 않는다. [G2]

## 3. 목표 사용 경험

작업자는 “이 문항의 해설 SVG를 현재 publication 기준으로 만들어라/업그레이드하라” 한 번만 요청한다. 대상 문항·프로필·기존 검증된 풀이를 상위 작업에서 넘기면 엔진이 필요한 내부 입력을 준비한다.

정상 입력에서는 글꼴 교정, 수식 조판, collision 확인, 화면 미리보기 생성을 따로 부탁하지 않는다. 결과는 **검수용 최종 SVG, 실제 화면 미리보기, 필요한 검사 결과, 남은 문제**로 한 번에 받는다.

기존 SVG의 글꼴 문자열만 바꿔 놓고 완료하는 방식은 사용하지 않는다. 글꼴이나 수식 표현이 바뀌어 실제 크기가 달라지면 배치와 화면 검증까지 같은 요청 안에서 다시 끝낸다.

입력 문제·수학 조건 충돌·지원하지 않는 표현처럼 확정할 수 없는 경우에는 해당 문항의 구체적인 이유를 반환한다. 원클릭이라는 이유로 임의 좌표·폰트 대체·라벨 삭제로 성공을 만들어 내지 않는다.

## 4. 권장 구조: 얇은 실행 조정층 + 기존 순수 엔진 + 독립 감사기

```text
한 번의 VisualRequest
  → 대상·source·verified solution 확인
  → frozen facts / visual plan 확보
  → ProductionProfile + FontPlan 확정
  → numeric geometry / constructed-coordinate 증거 검증
  → 실제 글꼴·수식 측정
  → owner-aware 배치·프레이밍
  → SVG 생성
  → 독립 수학·primitive·owner 검사
  → 실제 Archive desktop publication 검사
  → 필요 시 제한된 자동 수정·재생성
  → 최종 bytes 고정 + 결과 묶음 반환
```

**내부 모듈 분리는 유지한다.** Python 수학·배치 코드를 Node로 다시 쓰거나, 독립 감사기를 생성기 안에 합치는 작업은 필요하지 않다. Node 실행 조정층이 기존 Python 생성 함수와 browser 도구를 연결하는 안을 기본 제안으로 한다.

기존 `build-visual-candidate.mjs`는 호환 진입점으로 유지한다. 통합 실행은 내부 `produceVisual(request)` 같은 단일 서비스에 위임한다. `--request` 또는 publication mode 확장은 제안일 뿐 아직 구현된 옵션이 아니다. 기존 `--facts --run-id` 호출의 동작을 몰래 바꾸지 않는다.

개별 프로그램의 CLI는 개발·디버그용으로 남겨도 된다. 다만 production 품질을 주장하는 공식 경로는 단일 서비스가 끝까지 실행한 결과만 사용한다. “생성기는 PASS, 글꼴 스크립트는 사용자가 따로 실행”하는 책임 공백을 없앤다.

## 5. 내부 계약은 다섯 묶음으로 제한한다

| 계약 — 제안명 | 내용 | 책임 |
|---|---|---|
| `VisualRequest` | sourceArchiveFile, questionUid, surface, action, profileId | 요청 대상을 식별. 문항번호만으로 결속하지 않음 |
| `FrozenVisualPlan` | source/solution 참조와 SHA, decisive relation, expected facts, 좌표 증거, label 의미·owner, viewport intent | 그림이 표현할 수학·교육적 의미를 고정 |
| `ResolvedProductionProfile` | 버전·hash, 글꼴 역할·실제 사용계획, 조판·stroke·spacing 규칙, reference viewport | 실행 중 바뀌지 않는 단일 품질 설정 |
| `MeasuredLayout` | label별 ink bounds, advance, ascent/descent, baseline, owner-safe 영역, 좌표변환 | 실제 크기에 근거한 배치. 추정치와 실측치 명시 |
| `VisualResult` | 최종 SVG 경로·SHA, 화면 증거, 축별 판정, 수정 이력, 남은 결함, 독립검수 상태 | 성공·부분완료·실패를 한 곳에서 보고 |

실행 때 사용자가 이 JSON들을 각각 작성하게 하지 않는다. 입력 해석과 변환은 resolver/adapter가 맡는다. 이미 frozen facts가 있으면 재사용하고, 없으면 현행 source+검증된 solution에서 visual plan을 작성하는 상위 planning 단계와 연결한다.

**현재 엔진이 문항 텍스트만으로 완전한 source 해석·독립 풀이를 수행한다고 주장하지 않는다.** 검증된 facts 입력을 받는 통합 실행은 첫 구현 단계이며, 문항 ID만 받는 원클릭 완료에는 resolver/planning 연결도 포함된다.

## 6. 글꼴·수학 조판을 생성 이전으로 옮긴다

### 6.1 단일 프로필

현재 `style_tokens`와 GEOMETRY_STANDARD/GRAPH_STANDARD의 실제 적용값을 조사해 하나의 resolved profile로 읽는다. 새 설정 파일을 하나 더 만들고 기존 세 군데 값을 각각 유지하는 식으로 권위를 늘리지 않는다.

같은 도형의 점 이름·각·길이·짧은 수학값은 동일한 기본 크기를 사용한다. 일반 한국어와 수학 글꼴 역할은 구분한다. 프로필은 실측에 들어가기 전에 결정하고, 출력기가 다른 설정을 다시 읽어 덮어쓰지 못하게 한다. 검수기도 승인된 같은 프로필 데이터를 받되 생성기의 관측 결과를 정답으로 재사용하지 않는다.

desktop reference는 현행 **1440×1000, Archive `mode=sol`, screen-fit/page-fit 없음**을 따른다. 학생용 label은 실제 reference에서 **11 CSS px 미만 FAIL, 12px 이상 목표**를 유지한다. 모바일 page-fit의 축소된 절대 px를 새 FAIL 기준으로 부활시키지 않는다. [N1]

### 6.2 FontPlan

family 문자열을 기록하는 데 그치지 않고 승인된 글꼴 자산·버전과 실제 역할 매핑, 필요한 glyph, 실행환경을 확인한다. 필요한 폰트가 없을 때 임의 시스템 폰트로 성공하지 않는다. 허용된 대체가 있다면 미리 프로필에 명시하고 그 대체 글꼴로 측정부터 다시 진행한다.

한글, A/B/P 등의 점 이름, 그리스 문자, minus, prime, 분수·근호·지수·아래첨자 등 실제 label inventory를 대상으로 확인한다. 부모 페이지의 font-ready만으로 최종 SVG의 모든 글꼴을 확인했다고 하지 않는다.

**최종 배포 글꼴 방식은 독립검토에서 결정해야 하는 설계 쟁점이다.** 승인된 폰트의 고정 로드·내장·부분 outline 중 무엇이 현재 출력과 맞는지 실험한다. 외부 PC의 우연한 폰트 설치 상태에 기대는 방식은 완료안으로 삼지 않는다. 글꼴 사용·내장 권한 확인 없이 파일을 수집하거나 배포하지 않는다.

### 6.3 의미와 모양 분리

수식은 기존 AST/정확값을 의미 정본으로 유지한다. 조판기는 그 의미를 바꾸지 않고 필요한 표현과 실제 크기를 만든다. 예를 들어 `40/3`을 근삿값으로 바꾸지 않고도, inline fraction 또는 분수선 조판 중 승인된 형태를 선택할 수 있어야 한다.

새 수식 조판 결과에는 label별 의미, owner, 실제 geometry bounds와 baseline이 있어야 한다. `문자 수 × 글꼴 크기` 또는 `box 높이 × 0.8`만으로 최종 정렬을 승인하지 않는다.

일반 SVG text로 충분한 label은 그대로 사용한다. 복잡한 수식 때문에 전문 조판기가 필요해도 **별도 후처리 명령이 아니라 같은 내부 단계**로 들어가야 한다. 모든 도형을 TeX 계열로 갈아엎는 것은 이번 최소안이 아니다.

## 7. 실제 측정 → 배치 → 검사의 자동 되먹임

먼저 글꼴과 수식 표현을 확정하고 label 묶음을 한 번에 실측한다. 그 결과를 기존 `layout(..., measurements)` 경로로 전달하되 단순 width/height뿐 아니라 실제 ink offset과 baseline 계약까지 보강한다. 초기에 근사치를 써 후보를 찾는 것은 허용하나 최종 확인은 실측을 사용한다.

측정용 label 전체 inventory에는 **아직 배치에 실패해 SVG에 출력되지 않은 label도 포함**한다. 현재 실패한 label은 생성 결과에서 빠질 수 있으므로, 만들어진 SVG의 text만 재측정하면 누락을 발견하지 못하는 경로를 막는다. [G3]

같은 글꼴·동일 조판 결과로 owner-aware layout을 수행하고, 실제 stroke 두께·점 반지름·각 표기·다른 label을 장애물로 고려한다. numeric model을 찌그러뜨려 공간을 확보하지 않는다.

최종 Archive 화면 검사에서 충돌이나 글씨 크기 문제가 확인되면 runner가 해당 layout/spec을 조정해 재생성한다. 최종 SVG 문자열을 직접 수정한 뒤 과거 검수 결과를 붙이는 방식은 금지한다.

## 8. 자동 수정은 좁게, 끝은 명확하게

기본 수정 순서는 현행 규칙을 재사용한다: label 이동 → arc/dimension/owner cue 조정 → geometry/viewBox 재프레이밍 → 필요 시 short leader/dimension → 지원되는 경우 composition 분리.

숫자·정답·점 이름·owner·수학 관계·frozen free variable을 바꾸는 것은 layout repair가 아니다. font 축소, 필수 label 숨김, 수식 소수화로 통과시키지 않는다. 프로필 변경이 필요하면 새 attempt에서 프로필·측정부터 다시 시작한다.

**제안:** 최초 후보 뒤 자동 repair는 최대 3회로 시작하고 대표 사례 결과로 조정한다. 같은 후보 hash 반복 또는 개선 없음이면 종료한다. 이것은 품질 기준 완화가 아니라 무한 루프 방지 예산이다.

남은 실패는 해당 문항의 `POLISH_REQUIRED`, 입력 보완, 도구·지원범위 문제로 구분하고 마지막 candidate와 정확한 이유를 보존한다. 정상 문항까지 다시 생성하거나 전체 시험지를 기다리게 하지 않는다.

## 9. 독립 감사와 최종 화면을 묶되 독립성은 지킨다

`audit_publication.py`의 source/solution bytes 검증과 실제 primitive 관측은 유지한다. runner가 호출해도 builder 내부 함수·witness를 그대로 읽고 PASS하는 감사기로 바꾸지 않는다.

좌표 재프레이밍은 numeric facts 변경과 구분한다. 새 viewport intent를 attempt 입력으로 고정하고 expected projection을 계산한다. 현재 생성 SVG나 builder witness에서 역으로 기대 좌표계를 만들어서는 안 된다.

현재 publication auditor는 제한된 SVG 형태를 대상으로 한다. 글꼴 outline, 새로운 math path/defs/use, 색상·스타일 표현을 추가하면 기존 observer가 그 표현을 실제로 검증할 수 있는지 먼저 확인한다. **font 프로그램을 연결했다는 이유로 검수 allowlist를 전부 풀거나 텍스트 metadata만 비교하는 것은 금지**한다. [G7]

최종 Archive에서 로드된 asset hash를 확인하고, 같은 bytes의 화면 증거를 저장한다. 격리 replay는 측정 보조로 명시한다. 새로운 FontPlan의 실제 이미지 결과와 replay의 동등성을 확인하지 못하면 해당 글꼴 축을 미검증으로 남긴다. source 화면·최종 SVG·측정환경을 혼동하지 않는다. [G8][G9]

축소·흑백·저화질 simulation은 robustness 보조 항목으로 runner에 연결한다. 기존 프로그램 확보 후 기능과 판정 기준을 확인하며, 누락된 프로그램을 실행했다고 기록하지 않는다. simulation 하나 때문에 모바일 절대 font floor를 다시 만들지 않는다.

## 10. 반환 상태와 저장

기존 build 상태는 유지하고, runner가 별도의 결과 요약을 제공한다. 아래 이름은 제안이며 CREATE/R1/R2/R3 단계명 변경이 아니다.

| 결과 | 의미 |
|---|---|
| `READY_FOR_INDEPENDENT_REVIEW` | 적용되는 자동 품질 단계가 끝남. 실제 final SVG와 화면 증거가 있음 |
| `POLISH_REQUIRED` | 제한된 자동 조정으로 끝내지 못한 시각 결함이 남음 |
| `NEEDS_INPUT` | source/solution/facts에 필요한 정보가 없거나 서로 충돌함 |
| `TOOLCHAIN_UNAVAILABLE` | 필요한 글꼴·실행도구를 확보하지 못함 |
| `UNSUPPORTED_CAPABILITY` | 현재 renderer/observer가 요구 표현을 함께 지원하지 못함 |

각 품질 축은 `PASS / FAIL / NOT_RUN / NOT_APPLICABLE`로 구분한다. 적용되는 필수 검사를 실행하지 못한 경우에는 ready가 아니다. source 의미의 타당성·해설 적합성·자연스러움에 대한 독립 검토는 실제 수행 주체와 상태를 별도로 기록한다.

산출물은 기존 격리 경로 `archive/_generated/geometry-visual-engine/<run-id>/` 아래에 둔다. `final.svg`, `result.json`, 해당 actual Archive preview/evidence를 최종 결과 묶음으로 제공한다. 파일명은 구현에서 기존 output과 호환되게 확정한다.

source·solution·facts·coordinateEvidence·profile·FontPlan·engine revision·browser/reference·최종 SVG를 manifest에서 결속한다. preview와 evidence는 `finalSvgSha256`을 참조한다. preview 파일의 hash와 SVG hash가 같아야 한다는 뜻은 아니다.

사용자 승인이나 기존 release 권한 없이 시험지 JS/SVG production 파일과 main을 자동 변경하지 않는다. 이번 엔진 반환만으로 기존 시험지를 FINAL로 승격하지 않는다.

## 11. 속도·반복 실행·부분 수정

같은 글꼴·같은 수식·같은 프로필의 실측값은 캐시하고, 한 run의 browser context를 재사용한다. 입력 검증·수학 검사에서 실패한 후보는 비용 큰 Archive 렌더로 보내지 않는다. 중간 후보는 label/isolated layout 검사로 줄이고, 유효한 최종 후보만 실제 Archive에서 확인한다.

캐시 key에는 관련 facts, profile/FontPlan, 조판·엔진 버전, 측정환경을 넣는다. 파일이 있다는 이유만으로 재사용하지 않는다. 글꼴 변경은 measurement→layout→final render를 무효화하지만 변하지 않은 수학 풀이 전체를 다시 검수할 이유가 되지는 않는다.

동일 frozen 입력과 동일 프로필·도구 버전의 재실행은 동일 SVG를 목표로 한다. 모델이 매번 visual plan을 새로 만들어 결과가 바뀌는 경우와 deterministic renderer 재실행을 구분한다.

모든 실행을 하나의 giant test나 반복 문서 읽기로 만들지 않는다. 필요한 module과 직접 의존 범위만 검사한다. 실행 시간은 단계별로 측정해 병목을 찾되, 아직 측정하지 않은 속도나 전체 자동 성공률을 약속하지 않는다.

## 12. 통합 대상과 이번 최소 지원범위

**프로그램 통합 범위**에는 글꼴·수식·스타일·실측·배치·publication audit·실제 Archive 출력·보조 simulation·최종 report가 모두 들어간다. 코드가 실제로 확보되지 않은 항목은 복구/신규 구현 대상으로 표시한다.

**첫 end-to-end 자격 확인 범위**는 현재 publication profile이 지원하는 축 없는 해설 기하를 기본으로 한다. 함수 그래프와 좌표축, 복합 패널은 기존 경로를 보존하고 별도의 지원 상태를 표시한다. 이 차이는 프로그램을 따로 실행하라는 뜻이 아니라 같은 runner 안에서 지원 조합을 명시하라는 뜻이다.

TikZ/PGFPlots 전면 adapter 신설, 모든 legacy 재제작, source OCR/풀이 엔진 신규 개발, production 전수 migration은 이번 최소 완료조건에 넣지 않는다. 다만 선택한 글꼴·수식 품질을 실현하는 데 꼭 필요한 조판 경로와 독립 검증 지원은 최소 범위에서 빼지 않는다.

## 13. 구현 순서 제안

| 단계 | 실제 작업 | 이 단계의 완료조건 |
|---|---|---|
| A. 최근 프로그램 inventory·확보 | 실제 경로·SHA·입출력과 문서 참조를 대조. 누락 scripts를 복구하거나 동일 기능에 매핑 | 연결할 실제 소스 목록과 미확보 항목이 명확함 |
| B. 설정·글꼴·조판 계약 | 단일 resolved profile과 FontPlan, label 의미/metrics 형식을 확정. 최종 글꼴 전달 방식 작은 실험 | 생성과 측정과 최종 이미지가 같은 표현을 사용함 |
| C. 통합 runner | 기존 생성기·독립 감사·Archive 측정을 연결. 실측값 자동 반영과 bounded repair | 준비된 frozen plan 하나로 별도 후처리 없이 결과 묶음 생성 |
| D. 문항 요청 연결 | source/solution/facts resolver, planning 인계, 단일 request와 기존 CLI 호환 | 작업자가 문항을 지정하면 내부 파일을 따로 준비하지 않고 실행 |
| E. 대표 품질·운영 확인 | 기존 fixture와 실제 대표 문항을 frozen 입력으로 실행, 독립 review와 changed-only repair | 아래 acceptance 통과 후 해당 지원범위에만 배포 |

A에서 다른 곳에 정상 구현된 프로그램을 찾으면 재작성하지 않는다. B의 글꼴 전달 방식과 auditor 지원 조합은 C의 핵심 의존성이다. C만 끝내고 “문항 원클릭 완성”이라고 보고하지 않는다.

이 계획은 v0.1 검토용이다. Pro/Astra 검토로 단계·파일 수를 줄일 수 있으면 줄이고, 확인된 공백만 실제 수정 계획에 남긴다.

## 14. 완료 판정은 프로그램 개수가 아니라 실제 출력으로 한다

| 대표 확인 | 요구되는 결과 |
|---|---|
| 운영자 단일 요청 | 별도 font/style/preflight/render 명령 없이 지원 문항 결과 묶음 완성 |
| 필요한 글꼴 누락 | 조용한 fallback이나 false PASS 없이 정확한 결함 반환 |
| 한글·수학 글꼴·수식 | baseline·glyph·분수·근호·지수 표현과 원래 의미가 함께 보존됨 |
| 실측과 배치 연결 | 긴 수식·점 T와 길이값 같은 밀집 사례에서 실측 기반 이동이 실제 일어남 |
| 누락 label | 배치 실패로 출력되지 않은 필수 label도 inventory 대비 발견 |
| geometry·owner 보존 | 좌표·각·길이·source identity를 바꾸지 않고 레이아웃만 보정 |
| 폰트·viewBox 변경 재실행 | 옛 measurement·evidence를 재사용하지 않고 영향 범위만 재검 |
| 최종 화면 | actual Archive desktop에서 최종 SVG bytes가 로드되고 가독성·collision 조건 충족 |
| 미지원 출력 primitive | audit 우회가 아니라 명시적 unsupported 또는 지원 추가 후 검증 |
| 반복·실패 | 같은 입력 재현, loop 상한, 실패 candidate·원인 보존, production 변경 없음 |

기존 5개 synthetic publication fixture는 회귀 기준으로 재사용한다. 추가로 최근 파일럿에서 드러난 실제 label/owner/분수 표기 사례와 한글·근호·지수·글꼴 누락 사례를 선정한다. 기존 synthetic fixture의 PASS를 실제 문항 독립 검토 대신 쓰지 않는다.

최초 대표 묶음의 정확한 분모는 A 단계의 실제 자산 확인 후 정한다. 이미 PASS한 전체 시험지를 이 엔진 연결 작업 때문에 다시 재검하지 않는다.

## 15. Pro·Astra에게 확인받을 쟁점

두 검토자는 먼저 사용자의 요구를 자기 말로 짧게 재해석한 뒤 이 초안을 평가한다. “프로그램을 많이 연결한다”나 “다른 renderer를 만든다”가 아니라 **생성 후 별도 글꼴·스타일 수정이 필요 없는 단일 품질 생산 경로**인지 확인한다.

| 검토자 | 강조 관점 | 요청 산출물 |
|---|---|---|
| Pro | 사용자 요구 누락, 실제 조판 품질, source 의미·독립 검수 경계, 과도한 범위 | 요구 재해석 / 누락·오해 / 실제 실패 예 / 더 작은 대안 |
| Astra | current-main 호출 구조, font-metrics-layout 연결, 독립 auditor, final asset binding, 구현 의존성 | 실제 재사용 파일 / 충돌 지점 / 최소 코드 변경 / 필수 테스트 |
| 초안 작성자 | 두 독립 의견과 근거를 대조 | 수용·비수용과 사유, 변경된 v0.2, 남은 의사결정 |

공통 핵심 질문은 다섯 가지다. 글꼴을 최종 SVG에 어떻게 안정적으로 전달할 것인가? 기존 조판기가 최근 품질 목표를 충족하는가? 실제 이미지와 replay의 글꼴·크기 동등성을 어떻게 확인할 것인가? 모든 조건을 썼다는 completeness와 선언된 조건의 잔차 검증을 어떻게 구분할 것인가? 준비된 facts 입력에서 문항 단일 요청까지의 빠진 연결은 무엇인가?

**공통 검토 요청문**

```text
이 문서는 APMath 원클릭 Visual Production Engine v0.1 초안이다.
목표는 최근 작업한 글꼴·수학조판·라벨·스타일·검수 프로그램을 엔진 내부로 통합해,
생성 뒤 별도 글꼴 수정 없이 한 요청으로 검수 가능한 최종 SVG를 얻는 것이다.
옛 생성기 수집이나 다중 backend 확장으로 요구를 바꾸지 말아 달라.
먼저 사용자 요구를 독립적으로 재해석하고, 최신 main과 이 초안의 기준 SHA를 대조하라.
현재 코드에 있는 기능, 문서에만 참조된 기능, 신규 제안을 분리하라.
실제 소스가 없는 프로그램을 구현 완료로 전제하지 말라.
글꼴 전달·실측 배치·수식 의미·최종 이미지·독립 감사가 끊기는 구체적 예를 찾아라.
필요한 최소 수정과 최소 테스트를 제안하되 충분한 부분은 그대로 두어라.
제품 코드는 수정하지 말고 요구 해석 / 결함 / 근거 / 권장 변경을 보고하라.
```

검토를 실제 수행하기 전에는 Pro/Astra PASS나 3자 합의로 표기하지 않는다. 현재 상태는 **초안 작성 완료 / 두 독립 검토 대기**다.

## 16. 기준 자료

아래 Git 링크는 모두 조사 기준 main SHA에 고정했다. 이는 원클릭 통합의 구현 완료 근거가 아니라 위의 현재 상태 분석 근거다.

- [G0 — 반영 PR #273](https://github.com/icefoxtail/AP------/pull/273), [기준 main](https://github.com/icefoxtail/AP------/commit/4572a0873e052a2554b269dccebf84643886e620), [직전 qualification run](https://github.com/icefoxtail/AP------/actions/runs/37259967925)
- [G1 — Visual Production skill](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/.codex/skills/apmath-visual-upgrade/SKILL.md)
- [G2 — engine.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/engine.py)
- [G3 — label_layout.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/label_layout.py)
- [G4 — style_tokens.json](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/style_tokens.json)
- [G5 — math_expression.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/math_expression.py)
- [G6 — svg_composer.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/svg_composer.py)
- [G7 — audit_publication.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/audit_publication.py)
- [G8 — verify-rendered-layout.mjs](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/verify-rendered-layout.mjs)
- [G9 — record-visual-browser-evidence.mjs](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/record-visual-browser-evidence.mjs)
- [G10 — skill 실제 디렉터리](https://github.com/icefoxtail/AP------/tree/4572a0873e052a2554b269dccebf84643886e620/.codex/skills/apmath-visual-upgrade)
- [G11 — publication.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/publication.py), [coordinate_evidence.py](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/geometry-equation/visual_engine/coordinate_evidence.py)
- [G12 — 현재 candidate CLI](https://github.com/icefoxtail/AP------/blob/4572a0873e052a2554b269dccebf84643886e620/archive/tools/past-exam-pipeline/build-visual-candidate.mjs)
- [N1 — GPT Visual Production Contract CURRENT](https://app.notion.com/p/3ef0e68bd69f81d28ceff1ec7a44e95b)
- [N2 — Archive 시작 페이지](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398), [작업 생명주기](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e)

**한 문장 결론:** 최근 품질 개선 기능을 별도 후처리 목록으로 남기지 않고, 한 프로필·한 요청·한 최종 asset에 결속된 측정 기반 생산 파이프라인으로 통합한다.