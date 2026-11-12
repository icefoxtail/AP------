# AP Math 중등 함수 실험실 운영 계약

이 문서는 중등 함수 실험실의 현재 구성, 교육과정 경계, 장면 작성 계약과 유지보수 검증 절차를 정한다. 실제 동작의 정본은 아래 실행 코드이며, 원클릭 해설은 [원클릭 해설 제작 가이드](APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md)를 함께 따른다. 작업 시작과 마감은 프로젝트의 Notion 라우터·작업 생명주기 및 [Git 증거 보관 규칙](../agents/git-evidence.md)을 따른다.

원본 기출 수집 원장, 문항별 판정, 캡처, 실행 로그, 배포 이력은 이 문서에 누적하지 않는다. 해당 자료의 보관 위치와 검증 상태는 작업 기록에서 관리한다. 이 문서의 구성 수치는 구현 목록이며 검수·배포 완료 선언이 아니다.

## 1. 학생에게 제공하는 구성

학생 실험실 허브 진입점은 `apmath/playground/next/index.html`이다. 네 실험실 모두 **개념 → 기본 → 심화** 그룹을 제공한다.

| 실험실 ID | 이름 | 개념 | 기본 | 심화 | 합계 |
| --- | --- | ---: | ---: | ---: | ---: |
| `g7-coordinate-graphs` | 좌표평면과 그래프 | 5 | 6 | 4 | 15 |
| `g7-proportion` | 정비례와 반비례 | 4 | 9 | 8 | 21 |
| `g8-linear-functions` | 일차함수와 그래프 | 6 | 13 | 24 | 43 |
| `g9-quadratic-functions` | 이차함수 탐구 | 7 | 7 | 9 | 23 |
| **전체** | **4개 실험실** | **22** | **35** | **45** | **102** |

102개 장면에 각각 native 원클릭 해설을 등록한다. 현재 출처 구분은 `archive-adapted` 100개, `supplement` 2개이다. 이 수는 상한이 아니다. 새로운 기출에서 다른 사고 과정이 확인되면 기존 장면의 조작 모드로 수용할지, 독립 장면이 필요한지 판단한다.

- **개념:** 점·그래프를 움직이며 변화 원리를 비교한다. 입력과 출력, 계수와 모양, 좌표와 위치를 연결한다.
- **기본:** 반복 출제된 조건을 읽고 실제 수치를 대입하여 식과 그래프를 연결한다.
- **심화:** 여러 조건을 결합하고, 교점·공통 높이·넓이·범위를 이용하는 이유를 보여 준다. 난도 상승을 고등 풀이 도입으로 대신하지 않는다.

처음 진입할 때 주요 그래프·도형은 보여야 한다. 최종 답은 해설 마지막 단계에서 공개하고, 이후 탐구 조작으로 같은 원리를 확인하게 한다. 원클릭 자동 재생이 주요 동선이며 기존 단계별 탐구, 확대·이동, 그림 맞춤, 처음 값으로 돌아가기를 유지한다.

## 2. 교육과정 범위

[교육부 고시 제2022-33호](https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458)의 적용 일정은 중1 2025-03-01, 중2 2026-03-01, 중3 2027-03-01이다. 따라서 2026학년도에는 중1·중2가 2022 개정, 중3이 2015 개정 적용 대상이다. 학년도 전환 시 장면 표기와 안내를 다시 확인한다.

| 내용 | 2022 개정 성취기준 | 2015 개정 성취기준 | 장면의 범위 |
| --- | --- | --- | --- |
| 좌표·상황 그래프 | 9수02-05, 06 | 9수03-01, 02 | 순서쌍, 좌표, 상황 그래프의 표현·해석 |
| 정비례·반비례 | 9수02-07 | 9수03-03 | 표·식·그래프, 비례상수, 실생활 관계 |
| 함수·일차함수 | 9수02-14~16 | 9수03-04~06 | 대응·함숫값, 기울기·절편·평행이동, 식 결정 |
| 방정식과 그래프 | 9수02-17, 18 | 9수03-07, 08 | 직선과 일차방정식, 교점과 연립방정식의 해 |
| 이차함수 | 9수02-21, 22 | 9수03-09, 10 | 계수·축·꼭짓점·평행이동, 조건으로 식 결정 |

위 표는 성취기준에 따른 운영 범위 요약이다. 기준 원문은 [NCIC 최종 고시본](https://ncic.re.kr/inv/org/download.do?orgType=ogi4&seq=10003559&year=2022)의 중학교 부분과 [부산교육청 2024-4 중학교 교육과정](https://www.pen.go.kr/upload/main/na/bbs_2448/ntt_1105533/doc_8000v0afc%3D28vd5%3D47v17%3Dbdvdd%3D2320v7428va20c_v7316.pdf)의 2015 기준에서 확인한다.

중3 핵심은 두 교육과정의 공통 범위를 사용한다. `extremum-2027`은 **2027 중3 적용 · 2022 개정 교육과정 보충**으로 별도 표시하고, `x`가 실수 전체인 이차함수의 최대·최소만 다룬다. 제한구간의 최대·최소와 상황의 최적화 문제를 이 장면에 자동 편입하지 않는다. 2015 개정에서 이차함수 최대·최소를 고등으로 이동한 경위는 [교육부 2015 개정 안내](https://www.moe.go.kr/upload/brochureBoard/1/2016/12/1482218322461_335199041259440.pdf)에 따른다.

좌표·넓이 심화는 대입, 좌표의 차, 밑변과 높이, 합동·닮음, 피타고라스 정리, 중학교 방정식으로 설명한다. 판별식에 의한 일반적인 직선·포물선 위치 분류, 근과 계수의 관계, 이차부등식, 미분, 벡터·내적, 일반 접선 공식, 점과 직선 사이 거리 공식, 신발끈 공식을 학생 풀이에 도입하지 않는다. 기존 원본 해설에 그런 방법이 있으면 원본을 보존하고 중등 풀이로 재구성 가능한지 별도로 판단한다.

## 3. 실행 파일과 재사용 관계

아래 경로는 저장소 루트 기준이다.

| 역할 | 정본 파일 |
| --- | --- |
| 네 실험실 진입 HTML | `apmath/playground/next/labs/g7-coordinate-graphs.html`, `g7-proportion.html`, `g8-linear-functions.html`, `g9-quadratic-functions.html` |
| 중등 함수 공통 어댑터 | `apmath/playground/next/labs/middle-functions/core.js` |
| 학년별 장면·모델·해설 | 같은 디렉터리의 `g7.js`, `g8.js`, `g9.js` |
| 공통 무대·셸 | `apmath/playground/next/kit/apl-board.js`, `apl-core.js`, `apl-shell.js` |
| 원클릭 엔진·재생 UI·목차 | 같은 `kit/`의 `apl-video-core.js`, `apl-player.js`, `apl-toc.js` |
| 카탈로그·공개 manifest | `apmath/playground/next/kit/apl-catalog.js`, `apmath/playground/manifest.json` |
| manifest 생성 | `apmath/playground/next/tools/gen-manifest.mjs` |
| 계약·수학·해설 검사 | `apmath/playground/next/tools/lessons.middle-functions.test.mjs` |
| 브라우저 최소 검사 | `apmath/playground/next/tools/middle-functions-browser.mjs`, `scene-smoke.mjs` |
| 브라우저 CI | `.github/workflows/middle-functions-browser.yml` |
| 원본 읽기 전용 수집기 | `apmath/playground/next/tools/collect-middle-functions.mjs` |

공통 어댑터는 기존 `APLab.Board`와 셸에 장면을 연결하고, 기존 native 원클릭 플레이어에 해설을 등록한다. 좌표축, 눈금, 테마, 패널, 터치 조작, 확대·이동, 재생 UI를 별도로 만들지 않는다. 고등 함수 실험실에서 쓰는 공통 기반은 재사용하되 고등 문제 장면이나 풀이를 복사하여 중등으로 등록하지 않는다.

카탈로그를 바꾸면 생성기로 manifest를 갱신한다. 실험실 ID, 장면 ID, `#s=<scene-id>&play=1` 링크를 안정적으로 유지하여 기존 수업 링크를 깨뜨리지 않는다.

## 4. 장면 작성 계약

### 출처와 조작 모델

`APL_MF.register`로 실험실을 등록한다. 각 장면은 `id`, `tier`, `title`, `source`, `model`, `focus`, `question`, `guide`, `steps`, `answer`, `draw`, `lesson`을 갖고, 필요한 `vars`, `state`, `presets`, `verify`를 정의한다.

| 출처 kind | 필수 내용 | 의미 |
| --- | --- | --- |
| `archive-adapted` | `types`, `refs`, 학생용 `label` | 실제 기출의 수학적 구조를 조작 가능한 조건으로 재구성한다. 원문을 그대로 재생하거나 원본 정답의 정확성을 인증한다는 뜻이 아니다. |
| `supplement` | `reason`, 학생용 `label` | 기출만으로 채워지지 않는 개념·연결·교육과정 보충이다. 기출인 것처럼 표시하지 않는다. |

출처 참조는 `원본경로.js#q원본식별자@문항순서`로 기록한다. 같은 시험지의 다른 변형본은 원본 권위를 구분하고 표본 수에 중복 가산하지 않는다. 원본의 빈 정답·해설과 발견한 오류를 수집 실패로 바꾸거나 조용히 고치지 않는다. 학생 장면에 쓰는 조건과 답은 별도로 검증한다.

`model(v)`가 현재 조건으로 좌표·식·넓이·답을 계산하고, 발문·그림·풀이·정답이 같은 모델을 사용한다. 슬라이더만 바뀌고 발문이나 정답이 고정되는 구현은 허용하지 않는다. 상태 키는 어댑터의 장면별 접두사로 격리한다. 탐구 값을 바꾸면 답 공개 상태를 초기화한다.

현재 보충 장면은 `g7-coordinate-graphs/point-move`와 `g9-quadratic-functions/extremum-2027`이다. 전자는 좌표 변화의 직접 조작을 위한 개념 보충이고, 후자는 적용 연도가 다른 교육과정 보충이다.

### 그래프와 수학 표현

- `focus(v,m)`에 원점, 주요 점·절편·교점·꼭짓점과 도형을 포함한다. 기본값뿐 아니라 슬라이더 경계, 프리셋, 해설 중간·끝 단계에서도 잘리지 않아야 한다.
- 좌표 도형은 가로·세로 단위 길이를 같게 유지한다. 서로 다른 양의 단위를 쓰는 실생활 그래프만 명시적인 축 이름·단위와 함께 `aspect: 'free'`를 사용한다.
- 반비례는 `x=0`을 제외한 두 가지를 분리한다. 정비례·일차함수·이차함수의 계수 0은 비교 목적이 있는 장면에서만 명시적으로 다룬다. 부호 전환과 크기 조작을 분리하면 무의미한 0 상태를 피할 수 있다.
- 정답 수식은 정확한 분수·근호를 유지한다. Canvas 일반 텍스트 라벨에 TeX 문자열을 그대로 전달하지 않는다. 좌표를 반올림하여 표시하면 근삿값임을 표시한다.
- 도형 넓이는 양수 길이로 계산한다. 끝점 포함, 정수·자연수 조건, 넓이 0인 퇴화 도형 제외 여부를 발문과 코드에서 일치시킨다.
- 초기 그림은 축·격자만 있는 상태가 아니어야 한다. 정답을 숨기는 것과 주요 그래프를 숨기는 것을 구분한다.

### 원클릭 해설

해설은 기존 native 엔진의 chapter/cue 계약을 따른다. 별도 타이머나 재생기를 구현하지 않는다. `finalStep`은 `steps(v,m).length`와 일치해야 하고, 최종 답 공개는 마지막 단계와 연결한다.

현재 어댑터는 기본 조건으로 해설을 컴파일하며 첫 chapter에서 수치·비수치 상태를 모두 복원한다. 따라서 탐구 뒤 원클릭을 시작해도 기본 조건, 자막, 그림, 마지막 `answerText`가 일치해야 한다. 재생 중 모델 값을 바꾸는 cue를 추가할 때에는 최종 모델의 답과 해설 답을 다시 대조한다.

개념은 변화 원리, 기본은 조건 대입과 식 결정, 심화는 조건 분석과 전략에 설명을 배분한다. 실제 값·수식·계산·결론을 `say`에 포함하고 “확인하세요” 같은 지시만 반복하지 않는다. chapter 수와 전체 길이는 내용에 맞추되, 길이·자막 밀도·첫 cue·마지막 답 공개는 원클릭 제작 가이드와 native validator로 확인한다. 탐구 단계와 chapter의 개수는 서로 같은 개념이 아니다.

## 5. 변경 시 검증

저장소 루트에서 수행한다. 아래 명령은 재현 절차이며 실행 결과를 대신하지 않는다.

```sh
node --check apmath/playground/next/labs/middle-functions/core.js
node --check apmath/playground/next/labs/middle-functions/g7.js
node --check apmath/playground/next/labs/middle-functions/g8.js
node --check apmath/playground/next/labs/middle-functions/g9.js
node --test apmath/playground/next/tools/lessons.middle-functions.test.mjs apmath/playground/next/tools/catalog.test.mjs
```

카탈로그 변경 시 다음 명령 후 카탈로그 검사를 다시 수행한다.

```sh
node apmath/playground/next/tools/gen-manifest.mjs
node --test apmath/playground/next/tools/catalog.test.mjs
```

Node 검사는 모델의 유한한 값, 수식 파싱, 조건 범위, 출처 계약, 초기 도형, 주요 좌표의 범위, 답 공개, native 해설 컴파일·복원을 검사한다. 실제 모바일 렌더링·재생과 독립적인 수학 풀이 검토는 별도다. 공통 코드를 바꾸면 영향을 받는 기존 중·고등 장면의 회귀 검사를 선택하여 실행한다.

Playwright와 Chromium이 있는 실행 환경에서 별도 터미널로 정적 서버를 연다.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

```sh
node apmath/playground/next/tools/scene-smoke.mjs \
  http://127.0.0.1:8765/apmath/playground/next/labs/ \
  --only g7-coordinate-graphs,g7-proportion,g8-linear-functions,g9-quadratic-functions \
  --report /tmp/apmath-middle-functions-scene-smoke.json

node apmath/playground/next/tools/middle-functions-browser.mjs \
  --base http://127.0.0.1:8765/apmath/playground/next/labs/ \
  --only g7-coordinate-graphs,g7-proportion,g8-linear-functions,g9-quadratic-functions \
  --out /tmp/apmath-middle-functions-browser
```

`scene-smoke`는 PC 두 테마, 휴대폰, 태블릿 세로·가로 환경을 검사한다. 중등 함수 브라우저 검사는 모바일에서 장면마다 실제 버튼 한 번으로 정상 속도의 재생 시작·진행·종료를 관찰하고, 초기 그림·발문·오버플로·답 공개·슬라이더·초기화·JavaScript 오류를 검사한다. 시킹이나 강제 종료 상태로 실제 재생을 대체하지 않는다.

자동 브라우저 통과는 라벨 겹침·가독성·교육적 설명을 모두 사람이 정밀 검수했다는 뜻이 아니다. 장시간 모바일 시각검수와 반복 일시정지·재생 검수는 수행 여부를 별도 기록한다. 미실행은 `NOT_RUN`, 실행 중은 `RUNNING`, 실패는 `FAIL`로 남긴다. 수학 오답·핵심 그래프 미표시·재생 불능·구문 오류가 확인되면 병합 전에 수정한다.

## 6. 수집과 유지보수 원칙

새 기출 조사는 제목만 검색하지 않고 전체 문제 객체, 선택지, 이미지, 정답·해설 필드를 읽는다. 이미지뿐인 문제와 분류 불명확 후보를 보류 원장에 보존하고, 정답·해설 공란은 수집 성공 여부와 분리한다. 수집기를 실행할 때에는 결과를 Git 밖에 둔다.

```sh
node apmath/playground/next/tools/collect-middle-functions.mjs \
  --ref HEAD --out /tmp/apmath-middle-functions-intake
```

자동 신호는 검토 대상을 넓게 찾는 수단이다. 의미 판정·이미지 확인·독립 검산을 완료했다는 증거로 사용하지 않는다. 원본 시험지와 Archive JS는 이 실험실 작업에서 수정하지 않는다.

새 유형은 **원본 참조 → 수학적 유형 → 장면·모드 또는 명시적 재사용·보류**로 연결한다. 수치만 다른 유사 문항은 한 모델로 묶고, 필요한 사고 과정이 다르면 독립 유형으로 유지한다. 다른 학년의 좌표·일차함수나 기존 도형·통계 장면으로 설명되는 연결 문항은 중3 포물선 장면으로 억지로 옮기지 않는다.

변경 완료 시 관련 계약 검사, 실제 브라우저 검사, PR/main 병합, Pages 배포, 학생 공개 화면 확인을 각각 구분하여 기록한다. 테스트한 소스와 최종 배포 소스가 달라지면 영향 범위에 맞게 다시 검증한다. 실행 로그·캡처·원시 기출·문항별 해설 검토는 외부 증거로 보관하고, 이 문서에는 다음 작업에 필요한 현재 계약만 갱신한다.
