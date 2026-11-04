# 중1 기말 대응표·영상 시제품 인계 CURRENT — 분수 마감 미완료

> 기준일: 2026-11-04. 현행 작업 브랜치는 `codex/g7-exam-video`다. 교재 대응표와 12초 영상 시제품 2개의 지정 검증, 전체 학년 compact 목록 개선은 마쳤다. **분수 전면 마감은 미완료**다. 2차 검사에서 54랩·3,801상태를 확인했으며 스캐너 FAIL 표시 21건·검토 후보 252건이 남았다. 미적분Ⅰ 설명 원시함수 P0도 독립 확인했다. 현재 코드를 freeze하고 보고 후 사용자 결정을 기다린다. [Codex·Claude 공통 실행계획](../plans/APMATH_G7_EXAM_LAB_EXECUTION_PLAN_CURRENT.md)은 **계획 완료·실행 대기**이며 잔여 분류·수리와 확장 모두 다음 지시 전에는 시작하지 않는다. 운영 코드의 Git 반영·학생 배포는 NOT_RUN이다.

**문서 전용 PR의 범위:** 계획·인계·교재 대응표·모션 설계만 반영한다. 이 문서에 기록된 시제품·허브·분수 수정 코드, 새 검사 도구, 에이전트 TOML 설정은 `codex/g7-exam-video` 로컬 작업본에 남아 있으며 이번 문서 PR에 포함하지 않는다. 동작·검증 결과도 해당 로컬 수정본에 대한 기록이다. 원격 main의 코드가 이 기록과 같다고 가정하지 말고, 실행 승인 뒤 아래 지정 작업본과 실제 변경 사항부터 확인한다. 문서 반영은 W0 수리나 후속 확장의 실행 지시가 아니다.

## 1. 범위와 산출물

사용자가 지정한 중1 기말 범위는 다각형, 원과 부채꼴, 입체도형, 겉넓이와 부피의 4단원이다. 입체도형은 다면체와 회전체 실험실로 나뉘므로 대응 대상은 5개 실험실이다.

| 단원 | 기존 실험실 | 대응행 |
|---|---|---:|
| 다각형 | [g7-polygons](../../apmath/playground/next/labs/g7-polygons.html) | 106 |
| 원과 부채꼴 | [g7-circle-sector](../../apmath/playground/next/labs/g7-circle-sector.html) | 74 |
| 입체도형 | [g7-polyhedra](../../apmath/playground/next/labs/g7-polyhedra.html), [g7-solids](../../apmath/playground/next/labs/g7-solids.html) | 75 |
| 겉넓이와 부피 | [g7-surface-volume](../../apmath/playground/next/labs/g7-surface-volume.html) | 67 |

[교재 대응표](g7-exam-coverage/README.md)는 **322개 대응행·고유 교재문항 320개**의 검토 후보를 담는다. 신규 320문항을 구현한 결과가 아니다. `final` PDF 178쪽 12번과 179쪽 13번을 두 단원이 공유하므로 대응행과 고유문항 수가 다르다. [운영 인덱스](g7-exam-coverage/index.json)는 원본 Drive ID, PDF 페이지 수, 단원 파일과 공유 관계를 관리한다.

대응표는 실제로 읽은 문항을 선택 수록했다. 두 PDF 전수 완독이나 전수 대응 완료를 뜻하지 않는다. `covered`는 정적 개념·풀이 대응이며 수치의 완전 재현·브라우저 PASS가 아니다. 다른 상태도 보강 검토 방향과 근거 수준이며 수리 확정·완료 표시가 아니다. 단원별 검토/미검토 페이지와 난도 근거는 대응표에 보존했다. 독립 원문 대조는 **15행·12쪽 표본**이며 전체 322행의 독립 검수로 확대하지 않는다.

[고난도 모션 설계](APMATH_G7_ADVANCED_MOTION_PLAN_CURRENT.json)는 **8개 설계, `PLANNED`** 상태다. 학생의 막힘, 조작, 관찰, 풀이 연결과 수용 기준을 기록했으며, 아래 두 영상 시제품과 구분한다. 설계의 정적 수학 검토를 구현·화면 검증으로 읽지 않는다.

## 2. 제작·독립 검수와 역할 설정

초안은 **GPT-6.1 Terra High**, 독립 검수와 후속 수정은 **GPT-6 Astra High**로 진행했다. 제작자가 자신의 결과에 독립 검수 PASS를 부여하지 않도록 제작·수정과 최종 검수 책임을 분리했다. ROOT가 테스트, 실제 브라우저 실행, 증거 수납을 담당했다.

로컬 `.codex/config.toml`에는 중1 전용 역할 6개(`g7_polygons_worker`, `g7_circle_worker`, `g7_solids_worker`, `g7_surface_volume_worker`, `g7_video_worker`, `g7_independent_reviewer`)와 후속 분수·학생 검수 역할 2개(`lab_fraction_typesetter`, `student_design_learning_reviewer`)를 등록했다. 역할 파일은 로컬 `.codex/agents/`에 있으며 이번 문서 PR에는 포함하지 않는다. 기존 Archive 역할·기본 모델·8슬롯 설정은 보존했다. 이 기록은 원격 main의 역할 설정이나 기존 역할 전체의 모델 교체를 뜻하지 않는다.

## 3. 실제 구현한 시제품

| 시제품 | 장면 | 길이 | 학생의 흐름 |
|---|---|---:|---|
| 부채꼴의 호와 넓이 | [g7-circle-sector / 1209](../../apmath/playground/next/labs/g7-circle-sector.html#s=1209) | 12초 | 중심각에 따른 변화 관찰 → 원 전체에서 차지하는 비율 발견 → 식 → 직접 중심각 조작 |
| 원기둥의 겉넓이 | [g7-surface-volume / sv1-1](../../apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1) | 12초 | 입체와 전개도 관찰 → 옆면의 가로·세로 관계 발견 → 식 → 직접 전개 조작 |

기존 공용 키트와 실험실 그림을 재사용한다. 별도 녹화 영상이나 독립 그림 플레이어를 추가한 방식이 아니다. 목차에서 장면을 선택해 재생하고, 멈춤·느리게·키보드 이동·다시 보기와 자연 종료 뒤 직접 조작을 확인했다. 실제 pointer 조작에서 그림·값의 동기화와 장면/탭 전환 뒤 재생 타이머·상태 누수도 검사했다.

검수 과정에서 큰 제목을 캔버스와 분리하고 최소 무대 높이를 확보했다. 끝 카드는 `panelInner` 선두에 놓고, 접힌 패널도 영상이 끝나면 복구하도록 고쳤다. 재생 중 영상 dock을 숨겨 이전 상태의 슬라이더가 남는 것을 막았으며, 중복 할 일 문구를 제거했다.

ROOT 로컬 미리보기는 포트 `8817`이다. 서버가 실행 중일 때 [실험실 허브](http://127.0.0.1:8817/apmath/playground/next/index.html), [부채꼴 시제품](http://127.0.0.1:8817/apmath/playground/next/labs/g7-circle-sector.html#s=1209), [원기둥 시제품](http://127.0.0.1:8817/apmath/playground/next/labs/g7-surface-volume.html#s=sv1-1)을 확인할 수 있다. 이 로컬 주소는 Pages 배포 주소가 아니다.

## 4. 검증 결과와 한계

ROOT가 수납한 결과를 아래에 기록했다. 각 PASS는 해당 검사 범위에만 적용한다.

| 검사 | 결과 | 범위·근거 |
|---|---|---|
| 교재 대응표 구조·장면 참조 | **PASS** | 4단원, 322행, 고유문항 320, 장면 참조 367, 허용 공유 2, 오류 0. `--scene-index` 누락 시 FAIL도 확인. 원문 내용의 정답 검사는 아님. |
| 정적 catalog/video 검사 | **PASS** | 56개 PASS, skip 0. |
| 분수 수리 후 정적 검사 | **PASS** | 최종 `fraction/static-final.log`: tests 58, pass 58, fail 0, skip 0. 전면 분수 조판 PASS를 뜻하지 않음. |
| 시제품 기능 검사 | **PASS** | 2장면 × 5환경 = 10환경, pageerror 0. 실제 pointer, 키보드, 느리게, 자연 종료, 상태 누수 확인. 로컬 증거: `.codex/g7-video-qa/final/results.json`. |
| 실제 보이는 탭 버튼으로 영상 중 전환 | **NOT_RUN** | 영상 중 탭이 숨겨진다. 공개 API로 탭 전환 시 재생 취소·타이머 정리 검사는 PASS이며, 실제 UI 클릭 검사와 구분한다. |
| 최종 레이아웃 검사 | **PASS** | 2장면 × 5환경 = 10환경. 로컬 증거: `.codex/g7-video-qa/layout-final/results.json`. |
| Astra 최종 독립 시각 검수 | **PASS**, 경미한 WARN 유지 | 최종 제목·끝 화면 20장과 태블릿 가로 중간 화면 직접 검토. 휴대폰 끝 카드 y≈570–750, 가로 자막·버튼, 전개도 치수, 실제 pointer의 관찰 → 발견 → 식 흐름 확인. 기능 검사로 시각 PASS를 추정하지 않음. |
| 전체 54랩 scene-smoke | **269 PASS / 1 FAIL** | 54랩 × 5환경 = 270환경. FAIL은 alg-exp-deep PC·칠판 favicon 404이며 기준 버전에서도 동일 재현. 변경 실험실 두 개는 각 5환경 PASS, 해당 비교에서 새 회귀 미발견. 무대 없는 안내 페이지 SKIP 1은 기존 도구 기준 유지. 전체 PASS가 아님. |
| 후속 허브 compact 목록 | **수정·화면 확인 수납** | 전체 학년 단일 compact grid, 8과정 PC·폰에서 해당 단원 첫 화면 노출. 최신 캡처 16-desktop/17-phone 기준. 폰 제목 15px·별표 44px·제목/별표 hit 겹침 0. |
| 후속 분수 조판 수리 2차 검사 | **검사 완료·FAIL / 마감 미완료** | 54랩·3,801상태, 스캐너 FAIL 표시 21건·검토 후보 252건. 소수 근호·제목 raw TeX·칩 공용 수리와 축 단독 π 눈금은 반영·통과했으나 혼합 캔버스 설명 등의 분수가 남음. 표시·후보 전부를 확정 수학 결함으로 세지 않으며, 전면 세로 분수 완료가 아님. |
| 분수 수리 후 최종 전체 scene-smoke | **NOT_RUN** | 위 269 PASS / 1 FAIL은 분수 후속 수리 전 결과. 수리 후 회귀 PASS로 확대하지 않음. |

시제품의 5환경은 PC 칠판 1440×900, PC 종이 1440×900, 태블릿 세로 768×1024, 태블릿 가로 1024×768, 휴대폰 390×844다. 전체 smoke는 기존 도구의 PC 1280×820 등 설정을 유지했다.

smoke 실패 비교의 기준 커밋은 `7849e42e918334359bf940724ff72f2d02fd6ef2`다. ROOT가 원본 kit·해당 HTML·원본 smoke를 ignored baseline으로 추출하고 실패한 검사만 재실행해 동일 favicon 404와 exit 1을 확인했다. browser launch만 동일 시스템 Chrome에 연결한 환경 어댑터이며, assert·분모는 바꾸지 않았다. 로컬 근거는 `.codex/g7-video-qa/full-scene-smoke.log`, `baseline-failed-check.log`, `main-baseline/baseline.json`, `main-baseline/server-error.log`다.

남은 비차단 WARN은 기존 태블릿 세로 회전 권유 toast가 일부 칩을 가리는 점이다. 닫을 수 있고 핵심 값은 읽힌다는 최종 시각 검수 판단을 남긴다. 해당 WARN을 숨기거나 전체 레이아웃 무결점으로 바꾸지 않는다.

재실행 가능한 구조검사 명령은 저장소 루트 기준이다. 장면 목록은 실제 Chrome 수집 파일을 사용한다.

```powershell
node apmath/playground/next/tools/g7-coverage-check.mjs --scene-index .codex/g7-video-qa/scene-index.json
```

원시 PNG, 렌더 결과와 로그는 `.codex/g7-video-qa/` 등 ignored 로컬 캐시에 둔다. 이 문서는 현행 인계와 검증 요약만 보존하며 원시 증거를 Git에 넣지 않는다. 캐시 경로의 기록을 Drive 보관 완료로 해석하지 않는다.

## 5. Git·배포 및 다음 작업

| 항목 | 상태 |
|---|---|
| 로컬 작업 브랜치 | `codex/g7-exam-video` |
| 운영 코드 Git commit | **NOT_RUN** |
| 운영 코드 PR 생성 | **NOT_RUN** |
| 운영 코드 main 병합 | **NOT_RUN** |
| Pages·학생 배포 | **NOT_RUN** |

사용자의 후속 지시에 따라 문서만 별도 PR로 main 반영한다. 코드·검사 도구·역할 설정과 원시 검수 증거는 이 PR에 넣지 않으며, 위 표는 운영 코드의 상태다. 학생 배포와 W0 수리·학습 확장은 계속 실행 대기다.

분수 2차 검사는 종료됐지만 전면 조판 마감은 미완료다. ROOT가 읽기만으로 분류한 `.codex/g7-video-qa/fraction/outstanding-current.json`에 따르면 FAIL 표시 21건은 **3실험실·13개 서로 다른 표시 패턴**의 반복이다. `alg-trig-geometry` 12건/6패턴(혼합 문장 안 π/4·π/3 등), `common-functions` 1건/1패턴(부등호 뒤 −6/3), `geom-parabola` 8건/6패턴(1/a=1/8 등)이다. 252개 검토 후보는 수학 분수와 구분 문자의 추가 판정이 필요하다. 현재 코드를 freeze하고 추가 분류·수리를 다음 사용자 결정까지 시작하지 않는다. 범위 밖에서 발견한 내용은 기존 코드·원문으로 결함이 확정되기 전까지 보강 후보로 남기며, 자동 전수 재작업으로 확대하지 않는다.

독립 학생 검수자가 미적분Ⅰ `calc1-integral/signed`의 source 1470–1483·1734를 직접 대조해 **P0 설명 수학식 오류**를 확정하고 최초 판정을 정정했다. 기본 a=1,p=0,c=2에서 f=x²−2x인데 표시 원시함수는 F=x²/3−x이며, 올바른 식은 F=x³/3−x²다. `ouPoly`는 배열 길이로 차수를 정하는데 원시함수 배열 끝의 상수 0이 빠져 차수가 낮아진다. 최종 정적분 0·총넓이 8/3 계산은 맞지만 설명식은 틀리다. 다음 실행계획의 W0 긴급 정밀 수리로 기록하며 현재 생산 수정은 하지 않았다.

중2 `g8-pythagoras/py5-sqarea`는 문제 50+47=97과 정리 20+15=35가 달라 현재 문제의 답을 열기 위해 다른 예제 풀이를 요구하는 **확정 P1 학습 연결 문제**다. 별도 소량 repair 묶음 PLANNED이며, 현재 분수 수리의 회귀나 중2 전체 결함으로 확대하지 않는다.

후속 허브 검토에서 **실제 화면을 캡처한 Product Design 점검**과 학생 관점 검토를 수행했다. 사용자 승인으로 목록 카드 단순화를 전체 학년에 적용하고 최신 compact 화면을 확인했다. **「개념부터 / 문제부터」 두 입구의 전면 개편은 여전히 별도 계획·시안 선택 단계**다. 단순 목록 개선을 허브 전면 재설계나 전체 학년 영상 목차 완료로 기록하지 않는다.

최신 사용자 지시는 **보고를 받은 뒤 사용자가 다음 작업을 결정한다**는 것이다. [Codex·Claude 공통 실행계획](../plans/APMATH_G7_EXAM_LAB_EXECUTION_PLAN_CURRENT.md)의 W0는 전역 분수 잔여 분류·확정 결함 수리와 P0 정밀 수리, 그 이후가 소량 중1 학습 확장이다. 320개는 고유 교재 대조 pool이며 전부 새 문항으로 만들지 않는다. **계획과 인계만 마감하고, 새 수리·확장·검사·작업자 투입·운영 코드 Git 반영은 다음 사용자 실행 지시까지 대기한다.**
