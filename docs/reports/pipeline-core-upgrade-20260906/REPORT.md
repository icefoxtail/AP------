# APMath 공통 파이프라인 업그레이드 완료 보고

- 상태: **IMPLEMENTATION_COMPLETE_SOFTWARE_TESTS_PASS**
- 적용: 로컬 작업 트리. 커밋·배포·기존 문항 재생성은 수행하지 않았다.
- 범위: 집합·명제에 국한하지 않고 11개 파이프라인 프로필과 주요 실행 경계를 연결했다.
- 결과 JSON: [upgrade-result.json](upgrade-result.json)

## 구현 내용

`archive/tools/pipeline-core/`에 공통 schema·canonical hash·numeric generator·
독립 evidence 검증·UID/revision·분모·중복·실렌더 witness·최종 집계를 추가했다.
원본 bytes SHA와 의미 SHA를 구분하며, 누락/FAIL/BLOCKED/stale evidence를 최종 PASS로
올리지 않는다. V1/V2 세션·입력 가림·first-pass hash와 V3의 freeze 이후 시작을 검사한다.
수학 검산과 시각 의미, 실제 렌더는 서로 다른 gate로 유지한다.

새 typed fact는 `APMATH_VISUAL_FACT_v2`다. 영역 bit mask와 상징적 집합 순서,
포함관계, 원소 수 극값, 구간 endpoint, 경우표, 좌표 그래프, geometry 관계,
증명 흐름과 양화 명제의 부정을 명시적인 규격으로 처리한다. 자연어 이유와 내부
storage id를 수학적 의미와 혼동하지 않으며, 증명/전수성의 내용은 별도 검수한다.

Python 공통 생성기는 9개 표현 유형에서 좌표·지원 관계를 계산한다. 포함관계와
교집합 극값을 수치로 확인하고, proof edge를 실제 premise 방향으로 연결하며,
숫자/함수식/좌표 라벨을 보이게 한다. 좌표 그래프 검사는 임의 코드를 실행하지 않는
arithmetic parser와 보수적인 interval 검사로 잘못된 점과 불연속을 가로지르는
branch를 차단한다. 미지원 표현은 전문 adapter가 필요하며 자동으로 통과시키지 않는다.

## 연결한 경로

| 경로 | 변경 |
|---|---|
| Logic Visual | v2 typed parity, 빈 입력/UID 누락 차단, manifest/registry 검사, 공통 finalizer |
| 도형의 방정식 | S15 호환 명령을 현재 scope가 결박된 quality receipt로 변경 |
| 함수군 | 기존 수치 생성기는 보존하고 candidate-only 출력·공통 closure 연결 |
| 고1 전수 SVG | line final의 수기 PASS/기존 CSV 덮어쓰기 제거; 다른 단원은 공통 audit 사용 |
| 집합 visual pilot | SVG와 JS 연결을 candidate 복사본에 작성 |
| 기출 추출·승격 | reviewed_pass 문자열만으로 승격 금지; 실제 candidate/asset bytes 검증 |
| 교재 | 추출 executionStatus와 qualityClosure 분리, 빈 실행의 PASS 차단 |
| ALIVE | Python final closure가 같은 Node verifier 사용; 새 sidecar/CLI 옵션 |
| Tag enrichment | 중복/빈 candidate identity 차단, metadata-only quality 범위 명시 |
| JS bank cleanup | 현재 canonical master 경로 사용, identity 검증 연결 |
| Intelligence | 두 주요 metadata 승격기에서 검수된 candidate와 적용 예정 bytes 비교 |

과거 문항별·배치별 스크립트 전체를 한 파일에 합치지 않았다. 기존 알고리즘과
역사 evidence는 보존하며, 새 판정은 공통 실행 계약을 통해 진행한다. 특정 단원의
과거 상태나 작은 다른 run의 PASS를 큰 native scope의 근거로 재사용할 수 없다.

## 검증 결과

- **119개 회귀검사 PASS**: 공통 core 84, ALIVE Python 10, 기존 기출/교재 25.
- 마지막 PASS 시험의 core SHA와 현재 구현 SHA가 일치한다.
- 규칙 MANIFEST preflight PASS. 기존 규칙 충돌을 정리하고 새 실행 계약을 등록했다.
- 공통 생성기 **9종 × desktop/mobile = 18개** 실제 Chrome 컴포넌트 캡처.
  라벨 canvas clipping 0건이며 변경된 표기/포함관계/축·좌표를 실제 화면에서 확인했다.
- 실제 production `engine.html`을 그대로 사용한 **3 mode × 2 viewport = 6 case**
  수집 테스트 성공. runtime/MathJax/font/decode/asset association/count/last-question
  측정은 성공했다. 수집기가 readability/clipping/overflow를 임의로 PASS하지 않고
  NOT_TESTED로 남기는 것도 확인했다.

두 번째 검사에서 수학 오류가 기존 Python 생성 단계보다 앞선 공통 validator에서
차단되면서 테스트의 예상 오류 코드가 달라졌다. 거부 조건은 유지하고 예상 코드를
보완한 뒤 세 번째 전체 검사가 통과했다. 실패 기록도 보존했다.

증거:

- [tests-03.json](tests-03.json)
- [generator-render-smoke-v2.json](generator-render-smoke-v2.json)
- [engine-render-smoke.json](engine-render-smoke.json)

## 운영상 달라지는 점

새 작업은 `cli.mjs prepare`로 blind bundle 초안을 만들고, 실제 독립 검수 결과를
동결한 뒤 `cli.mjs audit --manifest <run.json>`으로 종료한다. 상세 schema와 명령은
[공통 실행 안내](../../../archive/tools/pipeline-core/README.md)에 있다.

guarded finalizer/promotion에는 `--closure-manifest`가 필요하다. ALIVE는 명시적 옵션
또는 `<input>.closure.json`을 읽는다. 증거가 없는 기존 run은 BLOCKED가 정상이다.
닫힌 run이나 v1 first-pass를 수정해서 새 PASS를 만들지 않는다.

기존 function/set 생성기는 production asset 대신 candidate tree에 쓴다. 변경된
candidate를 재생성할 때는 새 output directory를 사용해야 한다. metadata-only PASS는
문항 수학이나 시각자료의 품질 PASS를 뜻하지 않는다.

## Production 및 작업 공간 경계

이 업그레이드의 실행/patch에서는 production JS/SVG를 직접 수정하지 않았다.
시작 시 저장한 1,126개 보호 파일을 마지막에 비교한 결과, **공유 작업 공간에서
source JS 7개와 question-index.js 1개가 기준 시점 이후 달라진 사실**을 확인했다.
이 변경의 출처를 추정해 단정하지 않았으며 원복하거나 덮어쓰지 않았다. 따라서
저장소 전체가 시작 상태와 동일하다는 PASS는 선언하지 않는다.

대상 경로는 [production-integrity.json](production-integrity.json)에 기록했다.
해당 데이터를 사용하는 기존 review/denominator는 현재 hash로 다시 확인해야 한다.
이번에 만든 engine smoke 임시 디렉터리는 모두 정리했다.

## 완료 범위와 남는 검수

완료 범위는 **코드·회귀검사·실제 렌더 수집 기능 업그레이드**다. 소프트웨어 fixture는
실제 독립 수학 검산이나 unseen holdout을 대신하지 않는다. 기존 calibration의 P1 및
source defect, production engine의 실제 모바일 가독성 문제를 자동으로 고쳤다고
보고하지 않는다. 새 실제 문항 run은 fresh V1/V2/V3·수학·required render·FROZEN
분모를 충족한 뒤에만 PASS할 수 있다. 현재 결과는 production publication 권한이 아니다.
