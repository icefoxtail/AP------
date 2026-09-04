# 도형의 방정식 해설 품질 + SVG 제작/독립검수 통합 운영규정 v1.1

> 작업 순서 정정(2026-08-28): 이미 production JS가 있는 단원별 해설 업그레이드에서는
> 대상 문항을 확정하기 전에 시험지 전체를 렌더하지 않는다. 규정 확인과 JS 기반 대상 선별,
> 문항별 해설 품질 분석·수정·SVG 제작을 먼저 끝내고, 그 완료본을 전체 렌더로 검수한다.

## 0. 목적

고등학교 좌표·직선·원·도형의 이동·이차방정식·이차함수·이차부등식 영역의 해설 품질을 학생이 실제로 따라갈 수 있는 수준으로 끌어올리고, 식과 그래프의 관계를 보여 주는 해설 전용 SVG를 안정적으로 제공한다.

이 문서는 단원별 해설·독립검수의 보조 운영규정이다. 그래프 SVG root, canvas, stroke,
typography, sampling, label 배치, axis scale, preset 및 인쇄 출판 gate의 세부 기준은
최신 `도형추출.md` v3.0을 canonical source로 참조하며, 이 문서에서 별도 수치로 재정의하지 않는다.

도형·기하·입체도형 SVG도 같은 VISUAL v3.0의 공통 인쇄 원칙을 상속한다. 즉 safe area와
margin, physical print target 운영 원칙, normal stroke scaling, SVG root contract,
typography·math italic·U+2212, grayscale invariant, style metadata, style lint와 golden-set
운영 구조를 공유한다. z-order는 geometry layer에 맞게 재배치할 수 있지만 공통 원칙을
override하지 않는다.

geometry-specific stroke·label·indicator·hatching·circle·auxiliary line·scale honesty·
3D·hybrid 규칙과 `GEOMETRY_STYLE_LINT_PASS`, `GEOMETRY_PRINT_PUBLICATION_GATE`의 상세
contract는 최신 `도형추출.md` v3.0에만 둔다.

이 규정의 최우선 목표는 다음 두 가지다.

1. 해설의 중간 논리 생략을 제거한다.
2. 제작자 자기검수만으로 PASS를 선언하지 못하게 하고, 시험지 단위 독립검수 게이트를 강제한다.

---

## 1. 적용 범위

우선 적용 단원:
- 점과 좌표
- 직선의 방정식
- 원의 방정식
- 직선과 원의 위치관계
- 도형의 이동
- 대칭이동
- 자취·위치관계 종합
- 이차방정식과 이차함수의 관계
- 이차함수
- 이차방정식
- 이차부등식

작업 시작 순서는 `원의 방정식`부터지만, 이는 우선순위일 뿐 적용 범위를 좁히는 뜻이 아니다.
위 목록의 각 단원에 해당하는 문항에는 같은 시각화 기본 필수 원칙을 적용한다.

---

## 2. 핵심 원칙

### 2-1. 대상 문항 분석·해설이 먼저, SVG는 나중

SVG를 기존 solution 문장만 보고 바로 생성하지 않는다. 기존 production JS를 대상으로 하는
단원별 해설 업그레이드에서 브라우저 렌더는 원인 탐색의 첫 단계가 아니라 수정 완료본의
검수 단계다.

기본 작업 순서:
1. 적용 규정과 필수 선행 파일을 읽고, 시험 ID·기준 JS·허용 필드를 고정한다.
2. 기준 JS의 standardUnitKey, standardUnit, category와 문항 실제 내용을 읽어 대상 단원 문항과 보호 문항을 확정한다.
3. 대상 문항의 content·choices·answer·기존 solution·기존 image/solutionImage만 직접 읽고, 해설의 누락·교육성·교육과정 적합성·시각화 필요성을 문항별로 판정한다.
4. 대상 문항을 독립적으로 풀어 정답·핵심 식·좌표·경우 나누기·교육과정 안의 풀이 방법을 확정한다.
5. 해설 품질을 올릴 실제 필요가 있는 대상 문항만 solution을 재작성한다. 정상 문항과 보호 문항은 수정하지 않는다.
6. 재작성된 solution과 독립 풀이에서 확정한 수학 사실을 바탕으로 solutionImage SVG를 제작한다.
7. 문제·정답·재작성 solution·SVG를 문항별로 교차검수하고, 수정 범위를 필드 단위로 감사한다.
8. 모든 대상 수정이 끝난 뒤에만 production engine에서 전체 sol을 렌더하여 학생 화면을 직접 읽고 검수한다.
9. 같은 완료본에서 전체 exam·ans를 보조 렌더하여 보호 문항 훼손, 답표, 이미지, 수식, overflow를 확인한다.

사용자가 특정 문항의 깨짐·중복·미출력 같은 렌더 사고를 구체적으로 신고한 경우에만,
수정 전에는 그 신고 문항과 해당 모드를 한정하여 원인을 재현할 수 있다. 이 예외도
시험지 전체의 선렌더나 정상 문항의 일괄 점검·수정 권한을 주지 않는다.

solution이 수학적으로 검증되기 전에는 SVG를 최종 확정하지 않는다.

### 2-2. SVG는 해설 문장이 아니라 검증된 수학 사실을 시각화
SVG 생성 근거는 다음의 교집합이어야 한다.
- 문제 원문
- 독립 검산 결과
- 재작성된 solution
- 구조화된 도형 정보

### 2-2-1. 교육용 시각화 기본 필수 원칙

이 작업에서 SVG는 장식이나 선택적 과잉 요소가 아니라 식의 의미를 학생에게 보여 주는
해설 구성요소다. 다음 단원의 문항은 원칙적으로 모두 해설용 시각화를 만든다.

- `원의 방정식`: 실수 범위에서 $r^2>0$인 실제 원이면 좌표평면에 원을 표시한다.
- `직선의 방정식`: 직선과 문제에 필요한 점·절편·교점·접점을 표시한다.
- `이차함수`: 포물선, 축, 꼭짓점, 절편, 교점, 문제에서 비교하는 영역을 표시한다.
- `이차방정식`: 대응하는 $y=f(x)$와 $x$축을 그리고, 실근을 x축과의 교점으로 표시한다.
- `이차부등식`: 포물선과 $x$축, 부호가 결정되는 영역, 최종 해집합을 표시한다.

“도형이 필요해 보이는 문항만 선택”으로 축소 해석하지 않는다. 적용 여부는 표준단원명이나
세부단원키의 명칭만이 아니라 문항의 실제 수학 내용을 기준으로 판정한다. 위 단원에 해당하고
실수 범위에서 의미 있는 그래프·도형을 정의할 수 있으면 시각화 누락은
`SOLUTION_VISUAL_MISSING`으로 판정한다. 같은 단원이라는 이유만으로 임의의 그림을
그리는 것은 금지하며, 독립 계산으로 확정한 좌표·식·교점·반지름만 그린다.

원의 방정식에서 $r^2=0$이면 원이 아니라 한 점인 퇴화 경우이고, $r^2<0$이면 실수
범위의 점이 없다. 이 경우 원을 억지로 그리지 않고, 필요한 경우 한 점 또는
“실수 범위에서 그래프 없음”을 설명하는 최소 시각자료를 사용하며 예외 사유를 기록한다.

해설용 시각자료는 `solutionImage` 외부 SVG 또는 solution 내부의 검증된 inline SVG로
제공할 수 있다. 어느 방식을 쓰든 문제용 `image`와 혼동하지 않으며, 해설 본문·독립
검산·SVG를 서로 대조하고 실제 `sol` 화면에서 학생이 읽을 수 있는지 확인한다.

### 2-2-2. 전체 렌더 게이트와 범위 밖 발견 처리

전체 렌더 자체는 반드시 수행한다. 다만 전체 렌더의 시점과, 렌더 중 발견한 문제를 수정할 권한은 분리한다.

1. **수정 전에는 대상 분석을 우선한다.** 기준 JS·관련 자산·DB·인덱스·필수 엔진 경로를 정적으로 확인하고 targetQuestionIds와 allowedFields를 확정한다. 수정 전 시험지 전체 `exam`·`sol`·`ans` 선렌더는 하지 않는다. 사용자가 특정 문항의 깨짐·중복·미출력을 구체적으로 신고한 경우에만 해당 문항과 해당 모드의 원인 재현을 예외로 허용한다.
2. **대상 수정이 끝난 뒤 전체 `sol` 렌더를 필수로 수행한다.** production engine에서 시험지 전체 해설을 안정 렌더하고 모든 문항의 실제 학생 화면을 직접 읽어 가독성·완결성·교육성·정합성·교육과정 적합성을 판정한다. 수정한 문항만 렌더해서는 완료할 수 없다.
3. **`exam`·`ans`는 같은 완료본에서 보조 렌더한다.** 목적은 문제 본문·정답표·이미지·수식·페이지 분할과 보호 문항의 비회귀를 확인하는 것이며, 학생용 해설의 주 판정은 `sol` 렌더를 기준으로 한다.
4. **범위 밖 문제는 발견 즉시 수정하지 않는다.** 전체 `sol`·`exam`·`ans` 렌더에서 targetQuestionIds 밖의 깨짐·잘림·겹침·overflow·교육성 문제를 발견하면 문항 번호, 모드, 재현 위치, 원인 추정, 화면 증거를 별도 이슈로 기록하고 해당 작업은 계속하되 보호 문항 데이터·자산·메타데이터는 읽기 전용으로 유지한다.
5. **범위 확장은 사용자의 명시적 승인 뒤에만 가능하다.** 사용자가 별도 문항의 수리를 승인하면 수정 전에 targetQuestionIds와 allowedFields를 갱신하고, 범위 확장 사유와 보호 목록을 기록한다. 승인된 문항도 원인에 필요한 필드만 핀포인트로 수정하며 전역 엔진 수정이나 일괄 포맷 변경으로 확대하지 않는다.
6. **범위 확장 후에는 다시 전체 `sol`을 렌더한다.** 추가 수리 문항의 실제 화면을 먼저 확인하고, 이어서 시험지 전체 `sol`을 다시 렌더한다. 필요한 경우 `exam`·`ans`도 다시 확인하며, 모든 변경과 재검수가 끝나기 전에는 최종 SEAL을 하지 않는다.

이 원칙은 “전체 렌더는 필수”와 “발견된 모든 문제를 즉시 수정”을 동일한 뜻으로 취급하지 않도록 하는 운영 게이트다. 관련 세부 절차는 §20.3, §24, §25.1, §29를 따른다.

### 2-3. 제작 에이전트는 자기 시험지의 최종 PASS 권한이 없다
BUILDER의 SELF_CHECK는 독립검수 전달 준비 상태일 뿐, 최종 PASS가 아니다.

```text
SELF_CHECK PASS != EXAM PASS
```

---

## 3. 해설 품질 규칙

### 3-1. 핵심 중간단계 생략 금지
다음 표현으로 실제 추론을 건너뛰지 않는다.
- 계산하면
- 정리하면
- 공식에 대입하면
- 따라서

해당 표현 앞뒤 사이에 학생이 재현해야 할 식 전개·좌표 계산·경우 나누기·판단 근거가 있으면 반드시 적는다.

### 3-2. 새 점·선·보조도형은 먼저 정의
예:
- 중점 M
- 수선의 발 H
- 원의 중심 C
- 교점 P, Q

정의 없이 기호를 갑자기 사용하지 않는다.

### 3-3. 표준형과의 비교 근거를 적는다
예를 들어
```text
(x-a)^2 + (y-b)^2 = r^2
```
와 비교하여 중심과 반지름을 읽는 과정을 생략하지 않는다.

### 3-4. 계산값의 도형적 의미를 연결
예:
- 기울기가 같으므로 평행
- 기울기의 곱이 -1이므로 수직
- 중심에서 직선까지의 거리와 반지름 비교
- 평행이동 벡터만큼 중심도 이동

### 3-5. 마지막 결론은 문제에서 구한 값을 명확히 선언
객관식:
`따라서 정답은 ④이다.`

단답/서술:
`따라서 구하는 값은 ... 이다.`

### 3-6. 학생용 해설 작성 명세

해설은 정답을 보관하는 메모가 아니라, 학생이 문제를 다시 풀 때 따라갈 수 있는 재현 가능한 풀이여야 한다. 문항의 난도와 길이에 맞게 압축할 수는 있지만, 핵심 사고 과정은 압축하지 않는다.

권장 구성은 다음 순서다.

1. 목표 확인: 문제에서 구하는 값·조건·증명 대상을 한 문장으로 확인한다.
2. 핵심 아이디어: 왜 이 공식·정리·방법을 선택하는지 설명한다.
3. 조건 정리: 주어진 값, 범위, 부호, 자연수·정수 조건, 서로 다름·접함 등의 조건을 빠뜨리지 않는다.
4. 기호 정의: 새 점·선·변수·함수·교점은 처음 등장할 때 의미를 정의한다.
5. 식 세우기: 어떤 사실에서 어떤 식을 세웠는지 문장과 수식으로 연결한다.
6. 계산 전개: 학생이 검산할 수 있도록 핵심 대수 변형과 대입을 한 단계씩 보여 준다.
7. 조건 적용: 해 중에서 문제 조건에 맞는 것만 고르는 이유를 설명한다.
8. 의미 해석: 계산 결과가 그래프·도형·경우의 수·확률·범위에서 무엇을 뜻하는지 연결한다.
9. 결론 확인: 구한 값과 객관식 번호를 명확하게 선언하고 answer와 일치시키며 끝낸다.

모든 문항이 9개 소제목을 기계적으로 가져야 하는 것은 아니다. 다만 위 단계 중 해당 문항에 필요한 단계가 빠져서는 안 된다. 단순 계산 문항은 짧게 쓰되, 방법 선택·조건 적용·최종 결론은 생략하지 않는다.

다음 세부 기준을 반드시 적용한다.

- 식 변형은 등호 양변이 어떻게 바뀌었는지 학생이 확인할 수 있게 쓴다.
- 공식을 사용할 때 공식만 적지 말고 문제의 값을 대입한 식을 보여 준다.
- 판별식, 거리, 기울기, 중점, 조합·순열 등 핵심 개념은 이 문제에서 어떤 역할을 하는지 연결한다.
- 자연수·정수·양수·실수, 범위, 끝점 포함 여부, 서로 다른 해, 중근, 접함 등 조건은 마지막에 확인하지 말고 해당 단계에서 적용한다.
- 여러 경우가 생기면 경우를 분리하고, 각 경우가 가능한지 또는 왜 제외되는지 적는다.
- 음수·부호·제곱근·분모·정의역처럼 실수하기 쉬운 부분은 결과의 타당성을 짧게 점검한다.
- 그림을 사용하는 경우 본문에서 그림의 어떤 점·선·영역을 보고 있는지 말한다. 그림이 없어도 가능한 계산인지, 그림이 필수인지 구분한다.
- 줄글이 길어지면 의미 단위로 줄바꿈하고, 핵심 식은 별도 줄에 둔다. 수식을 한 문단에 과도하게 붙이지 않는다.

다음 표현은 그 자체가 금지어는 아니지만, 뒤에 핵심 근거가 없으면 FAIL이다.

- 계산하면
- 정리하면
- 공식에 대입하면
- 자명하다
- 쉽게 알 수 있다
- 당연히
- 그림에서 보이듯이
- 경우를 나누면

학생이 “왜 그렇게 되는지”를 한 문장 또는 한 식으로 확인할 수 있어야 한다. 해설에 제작자 메모, 채점 메모, 내부 상태값, 미완성 표시, 다른 문항을 위한 문구를 넣지 않는다.

### 3-7. 교육과정 적합성

학생용 해설은 정답에 도달하는 모든 수학적 방법을 허용하는 것이 아니라, 해당 시험의 학년·과목·단원에서 학생이 배운 방법으로 설명해야 한다. 수학적으로 맞는 풀이도 교육과정 밖의 개념에 의존하면 CURRICULUM_FAIL이다.

해설을 작성하기 전에 문항별로 다음 교육과정 프로필을 확인한다.

- 학년·과정: 예를 들어 고1 공통수학1인지, 고2 선택과목인지 확인한다.
- 과목·단원: questionBank의 standardCourse, standardUnitKey, standardUnit, category를 확인한다.
- 문항의 선행 개념: 이 문항을 풀기 위해 실제로 필요한 공식·정리·기능을 적는다.
- 사용 방법: 해설에 실제로 사용한 개념과 계산법을 적는다.
- 범위 판정: 사용 방법이 해당 과정·단원에서 허용되는지 PASS/FAIL로 판정한다.

예를 들어 standardCourse가 공통수학1이고 standardUnit이 원의 방정식인 문항은, 해당 과정에서 다룬 좌표·거리·중점·기울기·직선과 원의 방정식·대수적 변형 등으로 풀이를 구성한다. 벡터·내적·매개변수 벡터식·미적분·행렬·복소수 등 다른 과목의 개념을 정답 풀이의 핵심 도구로 사용하지 않는다. 단, 실제 문항의 standardCourse와 standardUnit이 그 개념을 포함하는 경우에는 해당 프로필에 따라 판정한다.

기준 프로필의 기본 판정 예시는 다음과 같다. 이는 키워드 차단표가 아니라, 실제 풀이에서 핵심 도구로 사용했는지를 판정하는 표다.

| 기준 프로필 | 학생용 해설에서 우선 사용하는 방법 | 핵심 풀이에서 피해야 할 방법 |
|---|---|---|
| 공통수학1 · 원의 방정식 | 좌표, 두 점 사이의 거리, 중점, 기울기, 직선·원의 방정식, 완전제곱식, 연립방정식·판별식 등 해당 단원에서 배운 방법 | 벡터·내적, 매개변수 벡터식, 미적분, 행렬, 복소수를 핵심 도구로 사용 |
| 공통수학1 · 직선의 방정식 | 좌표, 기울기, 두 점을 지나는 직선, 평행·수직 조건, 직선 사이의 거리 등 해당 단원 방법 | 벡터·내적 또는 미적분을 핵심 도구로 사용 |
| 다른 학년·선택과목·단원 | 해당 문항의 standardCourse·standardUnit에서 허용하는 공식과 정리 | 다른 과정의 개념을 설명 없이 끌어오는 방법 |

표에 없는 방법은 자동 PASS하지 않는다. 먼저 문항의 교육과정 프로필을 확인하고, 학생이 그 방법을 이미 배웠다는 전제 없이도 풀이를 따라갈 수 있는지 판정한다. 같은 개념이 여러 과정에서 다른 깊이로 다뤄질 수 있으므로 과목명만 보지 않고 단원과 실제 풀이 의존성을 함께 본다.

교육과정 판정은 단어의 등장 여부만으로 하지 않는다. “벡터를 사용하지 않는다”처럼 금지 방법을 설명하는 문구가 있는 것과, 벡터·내적을 실제 계산의 핵심 도구로 사용하는 것은 구분한다. 실제 풀이의 전개와 결론이 해당 개념에 의존하는지를 판정한다.

다음은 교육과정 FAIL로 본다.

- 원의 방정식을 벡터·내적·미적분으로 풀어 학생이 공통수학의 좌표·거리·방정식만으로는 따라갈 수 없는 경우
- 아직 배우지 않은 정리나 공식을 이름만 제시하고 설명 없이 사용하는 경우
- 고등 과정의 개념을 중학교 또는 다른 선택과목 문항에 무단으로 적용하는 경우
- 풀이 중간에 교육과정 밖의 개념으로 바꾸어 계산하거나, 그 개념을 모르면 결론을 재현할 수 없는 경우
- 교육과정에 맞는 방법이 있는데도 불필요하게 상위 개념을 사용해 설명을 어렵게 만드는 경우

기준 JS의 문제 자체가 상위 개념을 요구하는 경우에는 문제 문구를 임의로 바꾸지 않는다. 대신 문항의 교육과정 메타데이터와 출제 범위를 확인하고, 해설에서 어떤 수준까지 설명할지 별도로 기록한다. 해설이 어느 과정에 속하는지 불명확하면 CURRICULUM_REVIEW에서 보류한다.

---

## 4. 해설 전용 SVG 필드 규격

문제용 `image`와 해설용 시각자료를 분리한다.

권장 구조:

```js
solutionImage: "assets/images/<exam-title>/qNN-solution.svg",
solutionImageAlt: "해설 도형의 핵심 내용을 설명하는 문장",
solutionImageCaption: "학생이 그림에서 확인해야 할 핵심 관계",
solutionImageSize: "medium"
```

허용 크기:
- small
- medium
- large
- full

1차 운영에서는 해설 본문 아래(bottom)에 고정한다.
`solutionImagePlacement` 같은 추가 위치 필드는 당장 도입하지 않는다.

---

## 5. SVG 제작 표준

### 5-1. 파일명
```text
assets/images/<exam-title>/q01-solution.svg
assets/images/<exam-title>/q02-solution.svg
...
```

### 5-2. 기본 시각 규칙
- 좌표축: 단순하고 명확하게
- 점 라벨: 겹치지 않게
- 기본 도형: 선명한 실선
- 보조선: 점선 또는 얇은 선
- 핵심 관계만 표시
- 불필요한 장식 금지
- 흑백 인쇄에서도 판독 가능
- 안전여백 확보
- viewBox 명확히 지정

위 항목은 이 단원 규정의 요약 원칙이다. geometry-specific stroke hierarchy, label 배치,
indicator, auxiliary line, hatching·shading, circle·arc, scale honesty, 3D 및 hybrid의
세부 token과 수치는 `도형추출.md` v3.0만 따른다.

### 5-3. 금지 요소
- 외부 폰트 의존
- 외부 이미지 참조
- script
- foreignObject
- 렌더 환경에 따라 깨질 수 있는 복잡한 필터/효과

---

## 6. 원의 방정식 SVG 템플릿

### C1. 중심과 반지름
표시:
- 좌표축
- 원
- 중심 C
- 반지름 선분
- 원 위 점

### C2. 점과 원의 위치관계
표시:
- 중심 C
- 원
- 점 P
- 거리 CP
- 내부/원 위/외부 관계

### C3. 원과 직선
표시:
- 원
- 직선
- 교점
- 중심에서 직선까지 내린 수선
- 필요 시 거리 d와 반지름 r 비교

### C4. 접선
표시:
- 원
- 접점 T
- 반지름 CT
- 접선
- CT와 접선의 수직 관계

### C5. 현과 수직이등분선
표시:
- 현 AB
- 중점 M
- 중심 C
- CM
- 수직이등분선

---

## 7. 구조화 도형정보 블루프린트

SVG를 solution 문장에서 직접 생성하지 말고 필요 시 먼저 구조 정보를 확정한다.

예:

```js
diagramBlueprint: {
  coordinatePlane: true,
  objects: [
    { type: "point", name: "A", x: -1, y: -9 },
    { type: "point", name: "B", x: 5, y: 3 },
    { type: "point", name: "M", x: 2, y: -3 },
    { type: "line", role: "perpendicularBisector" },
    { type: "circle", center: "C1", radius: "3*sqrt(10)" }
  ]
}
```

`diagramBlueprint`는 내부 제작·검수용 데이터일 수 있으며, 실제 문항 스키마에 영구 저장할지는 별도 결정한다.

---

## 8. 독립검수 강제 구조

### 8-1. 역할 분리

#### BUILDER
담당:
- 문항 검산
- solution 재작성
- SVG 제작
- JS/에셋 완성
- SELF_CHECK
- 수정

금지:
- 자기 작업물 최종 PASS 선언

#### INDEPENDENT VERIFIER
담당:
- 기준 JS의 문제를 바탕으로 독립 검산
- 해설 품질 판정
- SVG 수학 정합성 판정
- 엔진/파일/렌더 판정
- PASS / FAIL 선언

원칙:
- 수정하지 않는다.
- FAIL 사유와 핀포인트 수정지시만 반환한다.

---

## 9. 시험지 단위 폐쇄 루프

```text
시험지 N 로드
  ↓
BUILDER 제작
  ↓
SELF_CHECK
  ↓
산출물 FREEZE
  ↓
SHA 기록
  ↓
새 컨텍스트 / 하위 에이전트 VERIFIER
  ↓
독립검수
  ├─ FAIL → BUILDER 수정 → 새 SHA → 새 독립검수
  └─ PASS → FINAL SEAL
                ↓
          다음 시험지 N+1 허용
```

시험지 N이 최종 PASS가 아니면 시험지 N+1로 넘어가지 않는다.

---

## 10. 독립검수 3영역

### V1. 수학·해설 검수
기준 JS의 문제·보기·조건을 바탕으로 직접 다시 푼다.

검사:
- 문항 성립
- 정답 독립 검산
- solution 논리
- 중간과정 누락
- 교육과정 준수
- answer와 결론 일치
- 학생이 해설만 보고 풀이를 재현 가능한지

### V2. SVG 수학 검수
SVG를 기존 solution과만 비교하지 않는다.

반드시 다음 세 방향을 모두 확인한다.

```text
문제 ↔ 해설
문제 ↔ SVG
해설 ↔ SVG
```

독립 계산 대상 예:
- 중심
- 반지름
- 점 좌표
- 기울기
- 직선 방정식
- 교점
- 접점
- 이동벡터
- 대칭 관계

문제와 해설이 동시에 잘못된 경우에도 `문제 ↔ SVG` 직접 검수에서 잡히도록 한다.

### V2-1. Geometry / hybrid / 3D SVG 검수

도형 SVG는 graph 규칙만으로 검수하지 않는다. geometry 사실과 시각 문법을 독립적으로
확인하고, 최신 `도형추출.md` v3.0의 geometry style lint 및 publication gate 결과를
기록한다.

- 평면도형: main/secondary/auxiliary/indicator 의미, vertex·edge·angle·region label을 확인한다.
- 지시기호: 직각·각·합동·평행 표기가 문제의 조건과 일치하고 서로 혼동되지 않는지 확인한다.
- 음영·빗금: 흑백 렌더에서 영역 구분을 보존하고 핵심 선·라벨을 가리지 않는지 확인한다.
- 3D: visible/hidden line, clipping·occlusion 및 label 겹침을 확인한다.
- hybrid: 좌표축·tick·축척은 graph 규칙, 선·원·점·라벨·indicator는 geometry 규칙을
  적용하며 두 규칙의 composite 결과를 기록한다.

### V3. 엔진·파일·렌더 검수
검사:
- node --check
- solutionImage 파일 존재
- SVG XML parse
- 외부 href/image 참조 없음
- viewBox
- 라벨 겹침
- clipping
- 안전여백
- 실제 해설 모드 렌더
- mixed engine 렌더
- 오답 출력/해설 사용 엔진 렌더
- 이미지 decode
- console error
- overflow
- 실제 인쇄 크기 가독성

---

## 11. PASS / FAIL 규칙

```text
V1 PASS
AND
V2 PASS
AND
V3 PASS
AND
geometry가 있으면
GEOMETRY_MATH_PASS
AND GEOMETRY_SEMANTIC_PASS
AND GEOMETRY_STYLE_LINT_PASS
AND GEOMETRY_PRINT_PUBLICATION_PASS
AND GEOMETRY_RENDER_PASS
= EXAM PASS
```

하나라도 FAIL이면:

```text
EXAM FAIL
NEXT_EXAM_LOCKED
```

수학·해설·SVG 정합성 관련 WARN은 원칙적으로 다음 시험지 진입 전에 해소한다.

---

## 12. FAIL 분류

### FAIL_SOLUTION_LOGIC
- 핵심 추론 생략
- 정의 없는 객체 등장
- 잘못된 식 전개
- 학생 재현 불가

### FAIL_ANSWER
- 독립 검산 결과와 answer 불일치

### FAIL_SVG_MATH
- 중심·반지름·교점·직선·이동관계 등 수학적 불일치

### FAIL_SVG_LABEL
- 라벨 누락·오표기·겹침

### FAIL_RENDER
- SVG 미표시
- clipping
- overflow
- decode 실패
- console error
- 인쇄 가독성 실패

### FAIL_ENGINE_PARITY
- archive / mixed / 오답 출력 엔진 중 해설 시각자료 렌더 불일치

---

## 13. 수정 루프 규칙

VERIFIER는 수정하지 않는다.

FAIL 보고 예:

```text
q07
FAIL_SOLUTION_LOGIC
2번째 식에서 3번째 식으로 넘어가는 근거가 누락됨.

q12
FAIL_SVG_MATH
SVG 중심 C=(3,-1)
독립 계산 결과 C=(3,1)

q18
FAIL_RENDER
solutionImage 하단 라벨 clipping
```

BUILDER가 핀포인트 수정 후 새 SHA를 생성한다.

재검은 가능하면 새 검수 컨텍스트/새 하위 에이전트가 수행하고, 수정 문항만이 아니라 시험지 전체를 다시 확인한다.

---

## 14. 상태 잠금

시험지 상태 예:

```text
BUILDING
BUILT
VERIFYING
VERIFY_FAIL
REPAIRING
REVERIFYING
VERIFY_PASS
SEALED
```

다음 시험지 진입 조건:

```text
status === "SEALED"
AND
verified_sha256 === current_artifact_sha256
```

검수 PASS 후 파일이 변경되면 기존 PASS는 자동 무효다.

---

## 15. 최종 봉인 기록

시험지별 최소 기록:

```text
exam:
builder:
artifact_sha256:

math_solution_verifier:
math_solution_result:

svg_verifier:
svg_result:

engine_render_verifier:
engine_render_result:

verified_sha256:
final_result: PASS / FAIL
next_exam_unlocked: true / false
```

`artifact_sha256 != verified_sha256` 이면 최종 PASS 금지.

---

## 16. 기존 5문항 SELF_CHECK와의 관계

기존 5문항 배치 SELF_CHECK는 유지한다.

단, 의미를 다음처럼 변경한다.

```text
5문항 SELF_CHECK
= 제작 중 품질관리

시험지 종료 후 독립검수
= 최종 합격 게이트
```

따라서 SELF_CHECK를 모두 통과했더라도 독립검수 이전에는 시험지를 완료 처리하지 않는다.

---

## 17. 절대 규칙

> 제작 에이전트는 자신이 제작·수정한 시험지의 최종 PASS를 선언할 권한이 없다. 모든 시험지는 제작 완료 후 별도 컨텍스트의 독립 검수 에이전트가 기준 JS를 기준으로 전수 검수해야 하며, 독립검수 PASS와 검증 SHA가 일치할 때만 봉인하고 다음 시험지 작업을 시작할 수 있다. FAIL 후 수정본은 다시 독립검수를 처음부터 통과해야 한다.

---

## 18. 1차 실행 범위

첫 적용:
- 고1 도형의 방정식
- 그중 원의 방정식 시험지부터 시작

각 시험지마다:
1. solution 전수 재검/보강
2. 필요한 solutionImage SVG 제작
3. 문제-해설-SVG 3중 교차검수
4. 학생용 해설지(`sol`) 렌더 전수 확인
5. 시험지(`exam`)·정답표(`ans`)는 보호 문항 훼손 여부 확인용으로 보조 렌더
6. 독립검수 PASS
7. SHA 봉인
8. 다음 시험지 진행



---

## 19. v1.1 운영 적용 범위와 변경 이유

이 부록은 v1.0의 수학·해설·SVG 품질 원칙을 유지하면서, 현재 APMath 저장소에서 실제 시험지를 한 개씩 검수·수정·봉인하기 위한 실행 규정이다.

v1.1에서 추가로 고정하는 원칙은 다음과 같다.

1. 2025년 원본 기출 시험지를 우선 대상으로 하며, 한 번에 정확히 한 시험지만 처리한다.
2. 현재 production JS를 이 작업의 기준 원본으로 삼고, JS·자산·렌더 결과를 서로 대조한다. PDF·스캔은 있으면 사용하는 선택적 보조 자료다.
3. 렌더 증상만 보고 전체 문항을 일괄 치환하지 않는다. 기준 JS 대조에서 실제 오류가 확인된 문항과 필드만 수정한다.
4. 화면에 정상 출력되는 문항은 수정 대상에서 제외한다.
5. PDF·스캔이 없어도 JS가 정상 해석되고 문항·정답·해설을 검토할 수 있으면 작업을 진행한다. JS 자체를 해석할 수 없거나 특정 오류를 JS·자산·렌더만으로 판정할 수 있을 때만 해당 문항 또는 시험지를 보류한다.
6. 수정 후에는 코드 검사만으로 종료하지 않고 시험지·해설·정답 화면을 다시 렌더하여 눈으로 확인한다.
7. 독립검수와 최종 SHA 기록이 끝나기 전에는 다음 시험지로 넘어가지 않는다.
8. 기존 JS의 solution은 업그레이드할 해설 초안으로 본다. 기본 수정 대상은 solution·solutionImage이며, content·choices·answer는 별도 오류가 확인된 경우에만 수정한다.

v1.1은 v1.0을 대체하는 별도 운영본이다. v1.0 원문은 변경하지 않고 보존한다. 기존 production JS를 업그레이드하는 이번 작업에서는 v1.1의 JS 기준 원본 정의와 PDF·스캔 선택 규칙이 v1.0의 일반적인 “원본” 표현보다 우선한다.

## 20. 2025년 1개 시험지 처리 큐

### 20.1 대상

기본 대상은 다음 조건을 모두 만족하는 파일이다.

- 경로가 archive/exams/original 아래에 있다.
- 파일명이 25_로 시작한다.
- 실제 학교 시험 원본인 기출 파일이다.
- 유사문제, 변형문제, 자동 생성 후보, 임시 파일이 아니다.

따라서 archive/exams/similar, archive/exams/types, archive/_generated 아래의 파일은 2025년 기출 큐에 자동으로 포함하지 않는다. 별도 요청이 있을 때 별도 큐로 처리한다.

현재 확인된 2025 production JS는 고1·고2의 h1/h2, 1mid/1final/2mid/2final 경로에 여러 파일이 존재한다. 첫 대상의 실제 순서는 다음 안정적인 정렬을 사용한다.

연도 → 학년·과정 경로 → 학기·시험 유형 경로 → 파일명

단, 파일을 선택하기 전에 해당 JS가 존재하고 정상적으로 읽히며 examTitle·questionBank·문항 번호를 확인할 수 있는지 검사한다. PDF·전체 페이지 이미지의 존재 여부는 별도 보조 정보로 기록하되, 없다는 이유만으로 SOURCE_BLOCKED로 두지 않는다.

### 20.2 시험지의 원자적 범위

여기서 “시험지 1개”는 JS 파일 하나만을 뜻하지 않는다. 다음 묶음 전체를 하나의 검수 단위로 본다.

- 해당 시험의 production JS 파일
- 해당 JS가 참조하는 문항별 시각 자산
- 해당 시험의 DB 메타데이터
- archive/question-index.js의 해당 문항 인덱스
- 기준 production JS의 content·choices·answer·solution과 선택적 PDF·스캔 대조 자료
- baseline과 수정 후의 exam/sol/ans 렌더 결과
- 독립검수·최종 봉인 보고서

한 시험지가 SEALED가 되기 전에는 다음 시험지의 내용을 수정하지 않는다.

### 20.3 단원 범위 잠금과 보호 문항

이번 운영의 실제 수정 단위는 “시험지 전체”가 아니라 “시험지 안의 지정된 한 단원”이다. 예를 들어 대상이 원의 방정식이면 해당 단원의 문항만 수정하고, 같은 시험지의 다항식·행렬·복소수·다른 도형 단원 문항은 절대 수정하거나 훼손하지 않는다.

작업 시작 전에 다음을 확정한다.

- targetUnitKey: 문항의 standardUnitKey 값
- targetUnit: 문항의 standardUnit 값
- targetQuestionIds: targetUnitKey에 해당하는 문항 ID 목록
- protectedQuestionIds: 같은 시험지에서 targetQuestionIds를 제외한 모든 문항 ID 목록
- allowedFields: 기본적으로 targetQuestionIds의 solution·solutionImage·관련 해설 자산만 허용

문항 범위는 우선 standardUnitKey로 잠근다. key가 없는 경우에만 standardUnit의 정확한 일치와 수동 확인을 함께 사용하며, category 문자열 일부 일치만으로 대상 문항을 정하지 않는다. targetQuestionIds가 확정되지 않으면 작업을 시작하지 않는다.

보호 문항에는 다음 변경을 모두 금지한다.

- content·choices·answer·solution·image·solutionImage 변경
- 문항 유형·단원·태그·wide 등 메타데이터 변경
- 보호 문항의 PNG/SVG 삭제·교체·덮어쓰기
- 보호 문항을 대상으로 한 전역 정규식·일괄 escape·일괄 포맷 변경

시험 전체 렌더는 보호 문항이 훼손되지 않았는지 확인하기 위해 수행하지만, 렌더 과정에서 페이지가 재배치되는 것과 보호 문항의 데이터·표시가 바뀌는 것은 구분한다. 보호 문항의 변경 전후 정규화 해시가 다르거나 렌더에서 깨짐·누락·겹침이 발생하면 SCOPE_VIOLATION으로 기록하고 봉인하지 않는다.

## 21. 실제 저장소 파일 맵

### 21.1 반드시 먼저 읽는 기준 파일

| 목적 | 실제 경로 | 역할 |
|---|---|---|
| 운영 규정 | docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md | 현재 작업의 판정 기준 |
| 선택적 외부 대조자료 | PDF·스캔·전체 페이지 PNG가 있을 때만 사용 | 인쇄 상태·도형·페이지 순서를 추가 확인하는 보조 근거 |
| 현재 문항 데이터 | archive/exams/original/.../25_...js | 수정 대상 production JS |
| 문항 자산 | archive/assets/images/<시험ID>/ | 문제·해설에 실제 사용되는 PNG/SVG |
| 시험 DB | archive/db.js | 시험 메타데이터·문항 수·경로·분류 |
| 문항 인덱스 | archive/question-index.js | 검색·문항 연결 인덱스 |
| 문제 렌더러 | archive/engine.html | production exam/sol/ans 출력 |
| 혼합 렌더러 | archive/mixed_engine.html | 혼합형 출력 경로가 사용될 때의 검증 대상 |

내부 검토 화면을 실제 작업에 사용한 경우에만 다음 파일도 읽고 검증한다.

- archive/internal-review-engine.html
- archive/internal-review-engine.js
- archive/internal-review-live.html
- archive/internal-review-live.js

내부 검토 화면의 PASS는 production engine.html의 PASS를 대신할 수 없다.

### 21.2 생성·검수 산출물

파이프라인을 사용하는 경우 시험별 생성 루트는 archive/_generated/past-exams 아래에 둔다. 시험별 루트에는 다음을 남긴다.

- pages/: 원본 전체 페이지 렌더 또는 페이지 이미지
- assets/: 전체 페이지에서 분리한 시각 자산
- candidate/: 후보 JS
- reports/: 단계별 보고서와 수정 전후 검수 결과
- manifest 또는 시험 식별 정보

최소 보고서 이름은 다음을 권장한다.

- source-inventory.json
- baseline-render.json
- question-review.json
- corrections.json
- independent-verification.json
- render-qa.json
- seal.json

보고서 경로와 파일명은 기존 생성물과 충돌하지 않는 범위에서 시험별로 고정한다. 학생에게 노출되는 solution 문자열 안에 검수 메모를 섞지 않는다.

### 21.3 실제 파이프라인과 보조 도구

아래 파일 중 PDF·스캔에서 새 candidate를 만드는 작업에 해당하는 파일은 그 조건이
성립할 때만 읽고 실행한다. 이미 production JS가 존재하는 이번 해설 업그레이드에서는
후보 생성 파이프라인을 다시 돌리지 않으며, 관련 파일을 읽지 않았다는 이유만으로
SOURCE_BLOCKED로 처리하지 않는다.

- archive/tools/past-exam-pipeline/run-batch.mjs
- archive/tools/past-exam-pipeline/run-one-exam.mjs
- archive/tools/past-exam-pipeline/promote-reviewed-exam.mjs
- archive/tools/past-exam-pipeline/lib/config.mjs
- archive/tools/past-exam-pipeline/helpers/scanned_exam_pipeline.py
- archive/tools/past-exam-pipeline/helpers/crop_visual_assets_from_full_pages.py
- archive/tools/past-exam-pipeline/helpers/audit_generated_visual_asset_links.py
- archive/tools/past-exam-pipeline/helpers/validate_final_candidates.py
- archive/tools/past-exam-pipeline/helpers/build_display_page_maps_from_verified_counts.py
- archive/tools/past-exam-pipeline/helpers/aggregate_preflight_verifications.py
- archive/tools/past-exam-pipeline/helpers/build_candidates_from_verified_maps.py
- archive/tools/past-exam-pipeline/docs/PAST_EXAM_PIPELINE_V2_POLICY.md
- archive/tools/build-question-index.mjs
- archive/tools/audit-latex-escapes.mjs

현재 promote-reviewed-exam.mjs는 후보 JS와 자산을 복사하는 도구일 뿐, db.js 갱신·question-index 재생성·브라우저 렌더 검수·최종 SHA 봉인을 모두 끝내는 도구가 아니다. 이 도구의 성공을 최종 PASS로 오인하지 않는다.

### 21.4 작업 전 선행 읽기 게이트 (PRE-FLIGHT READ LOCK)

문서 작업이든 시험지 작업이든, 이 규정에 따른 실제 판단·수정·PASS 판정은 선행 읽기
게이트를 통과한 뒤에만 시작한다. 파일을 목록에 적어 둔 것, 파일 존재를 확인한 것,
이전 작업에서 읽었다고 기억하는 것만으로는 읽기 완료로 인정하지 않는다.

#### 21.4.1 모든 시험지 작업에서 항상 읽는 파일

아래 파일은 대상 시험지를 고르거나 첫 문항을 읽기 전에 현재 작업본 전체를 읽는다.

1. `docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`
2. `docs/rules/MANIFEST.md`
3. `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`
4. `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md`
5. `docs/rules/02_PIPELINES/해설프로토콜.md`
6. `docs/rules/02_PIPELINES/문제해설추출.md`
7. `docs/rules/03_REVIEW/무결성검수.md`
8. `docs/rules/02_PIPELINES/수정프로토콜.md`
9. `docs/rules/02_PIPELINES/수정후보고프로토콜.md`
10. `docs/rules/00_RULES_INDEX.md#6-무결성관리`
11. `docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md`
12. `docs/rules/02_PIPELINES/작업방식_5문항배치루프_필수.md`
13. `docs/rules/01_CANONICAL/프로젝트_컨텍스트.md`
14. `docs/rules/03_REVIEW/JS아카이브_1차검수_프로토콜.md`
15. `docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md`
16. `docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md`
17. `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
18. `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
19. `docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
20. `archive/tools/README.md`

이 목록은 “모든 파일을 무조건 실행한다”는 뜻이 아니다. 규정·프로토콜은 전체를 읽고,
대용량 데이터·코드 파일은 아래 21.4.2의 범위대로 읽는다. 현재 사용자 요청처럼
기존 production JS의 특정 단원 해설을 업그레이드하는 경우에도 1~20번을 생략하지
않는다.

#### 21.4.2 모든 대상 시험지에서 읽는 실제 기준 파일

상시 읽기 규정 파일을 읽은 뒤, 아래 실제 파일을 대상 시험지 기준으로 확인한다.

| 파일/경로 | 읽기 범위와 목적 |
|---|---|
| `archive/exams/original/.../<시험지>.js` | 파일 전체. `examTitle`, 전체 `questionBank`, 모든 문항의 content·choices·answer·solution·image·solutionImage·메타데이터를 확인한다. |
| `archive/assets/images/<시험ID>/` | 대상 시험지에서 실제 참조하는 PNG/SVG를 전부 확인하고, 보호 문항의 자산도 존재·경로·렌더 상태를 기록한다. 폴더가 없거나 비어 있으면 사실 그대로 기록한다. |
| `archive/db.js` | 파일 전체를 출력하지 않고 대상 시험 ID/파일명에 대응하는 카드와 문항 수·경로·학년·학기·시험 유형·과목 레코드를 조회한다. |
| `archive/question-index.js` | 파일 전체를 출력하지 않고 대상 시험 ID 또는 qKey에 대응하는 인덱스 레코드를 조회한다. 대상 문항의 content·표준단원·경로와 인덱스 연결을 확인한다. |
| `archive/engine.html` | 파일 전체를 읽거나 관련 렌더 경로를 확인한다. 최소한 데이터 로딩, `wrapLatex`, `renderExam`, `renderSol`, `renderAns`, 이미지/solutionImage 처리와 overflow·페이지 분할 경로를 확인한다. |
| `archive/tools/exam-lint.mjs` | production JS를 수정하거나 기준 검수를 시작할 때 읽고 실행한다. 존재 여부만 확인하지 않고 실제 대상 JS를 검사한다. |
| `archive/tools/audit-latex-escapes.mjs` | solution/content/choices/answer 또는 SVG/LaTeX 문자열을 변경·판정할 때 읽고 실행한다. |

`db.js`와 `question-index.js`를 전체 문자열로 읽지 않는 것은 검수를 생략하는 것이
아니다. 대상 시험 ID·문항 ID에 대한 정확한 조회 결과와 조회 방법을 보고서에 남겨야
하며, 조회 실패는 `SOURCE_BLOCKED` 또는 `INDEX_UNRESOLVED`로 기록한다.

#### 21.4.3 선행 읽기 기록과 차단 조건

시험별 `reports/preflight-read.json` 또는 동등한 보고서에 다음을 남긴다.

- 작업 ID, 시험 ID, targetUnitKey, targetQuestionIds, protectedQuestionIds
- 파일별 저장소 상대경로, 존재 여부, 읽은 범위, 읽은 시각, SHA-256
- 파일을 읽은 이유와 적용한 조건
- 규정 간 충돌 여부와 적용한 우선순위
- DB·question-index·자산 조회 결과
- 누락·해시 불일치·읽기 실패·렌더 경로 미확인 목록
- `PREFLIGHT_READ: PASS / INCOMPLETE / BLOCKED`

다음 중 하나라도 있으면 문항 수정, 자산 덮어쓰기, DB/index 재생성, PASS·SEAL을
시작하지 않는다.

- 상시 선행 읽기 파일을 읽지 않았거나 읽기 범위를 입증할 수 없음
- 대상 JS를 전체 확인하지 않았거나 `examTitle`·questionBank를 안정적으로 읽지 못함
- targetQuestionIds와 protectedQuestionIds가 확정되지 않음
- 현재 기준 마스터와 compiled master의 키·부모·라벨이 일치하는지 확인하지 않음
- `MANIFEST.md`에 기재된 활성 규정의 파일 누락 또는 해시 불일치를 발견했으나, 현재
  작업본을 기준으로 삼을지와 불일치 사유를 기록하지 않음
- 실제 production 렌더 경로를 확인하지 않음

조건부 파일이 필요한 작업인데 그 파일이 없으면 작업을 억지로 진행하지 않는다.
그 파일이 작업에 불필요한 조건이라면 `NOT_APPLICABLE`로 기록한다.

#### 21.4.4 규정 충돌과 기준 우선순위

같은 주제를 다루는 문서가 충돌할 때는 다음 순서를 적용한다.

1. 현재 사용자의 명시적 범위·금지·승인
2. 이 v1.1의 단원 범위 잠금·JS 기준 원본·실제 렌더·학생용 해설 품질 규칙
3. 현재 공식 `JS아카이브_표준단원키_마스터테이블.md`와 compiled master JSON
4. 현재 룰북·1/2/3차 검수·해설·수정·무결성 프로토콜
5. 과거 문서·legacy snapshot·이전 작업 예시

`JS_문항품질_업그레이드.md`와 해설 전용 프로토콜의 “기존 운영 JS 일괄 수정 금지”는
무단 일괄 리모델링을 막는 규칙으로 유지한다. 다만 이번처럼 사용자가 특정 시험지의
특정 단원 해설 업그레이드를 명시적으로 승인한 경우에는, v1.1의 `targetQuestionIds`
와 `allowedFields` 안에서만 production JS의 해당 solution을 수정할 수 있다. 이 예외는
정상 문항과 단원 밖 문항을 손대거나 전역 치환을 허용하지 않는다.

### 21.5 작업 유형별 조건부 선행 파일

아래 표의 조건이 발생하면 해당 파일을 **쓰기 전에 먼저 읽고**, 작업 후 그 파일이
정한 검사를 실행한다.

| 작업 조건 | 먼저 읽는 파일 | 추가 조건·금지 |
|---|---|---|
| 기존 production JS의 solution 재작성 | `docs/rules/02_PIPELINES/해설프로토콜.md`, `docs/rules/02_PIPELINES/문제해설추출.md`, `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md`, `docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md` | 기존 solution은 참고 초안일 뿐이다. 직접 다시 풀고, 학생용 화면에서 읽은 뒤에만 수정한다. |
| content·choices·answer 또는 발문/보기의 원문 복원 | `docs/rules/02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md`, `docs/rules/03_REVIEW/JS아카이브_1차검수_프로토콜.md`, `docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md`, 선택적 PDF·스캔·원본 이미지 | JS 기준 작업에서도 원문 필드 변경은 별도 승인·근거·allowlist가 없으면 금지한다. |
| standardCourse·standardUnitKey·subUnit 또는 tags/level 수정 | `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`, `archive/data/master_tables/js_archive_tag_master.json`, `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`, `docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md` | H15/H22를 임의 전환하지 않는다. 마스터에 없는 키는 최종 JS에 쓰지 않는다. |
| 도형·그래프·표·문제용 PNG/SVG를 추가·수정 | `docs/rules/04_VISUAL/도형추출.md`, 통합 운영 프로토콜 12장, 대상 자산 파일 | 생성형 그림으로 원문을 대체하지 않는다. 저장 직후 실제 파일을 다시 열고 수학적 구조·라벨·크롭을 검수한다. |
| 해설용 `solutionImage` 또는 inline SVG를 추가·수정 | `docs/rules/04_VISUAL/도형추출.md`, 통합 운영 프로토콜 14장, `archive/engine.html`의 solutionImage 경로 | 엔진 지원 확인과 이번 시험지의 실제 브라우저 렌더 확인을 분리한다. SVG 안에 LaTeX를 넣지 않는다. |
| production renderer가 영향을 받거나 혼합 출력까지 확인 | `archive/engine.html`, `archive/mixed_engine.html` | `exam/sol/ans`를 모두 확인한다. renderer 성역 함수는 승인 없이 수정하지 않는다. |
| 내부 검토 UI를 사용하는 경우 | `archive/internal-review-engine.html`, `archive/internal-review-engine.js`, `archive/internal-review-engine.css`, 존재 시 `archive/internal-review-live.html`, `archive/internal-review-live.js` | 내부 UI PASS는 production `engine.html` PASS를 대신하지 않는다. |
| inline 보기 라벨·발문 구조를 변경하거나 의심하는 경우 | 통합 운영 프로토콜 1-2장, `archive/tools/view-label-lint.mjs` | `보기에서`와 독립 `<보기>` 제목을 구분하고 lint 결과를 기록한다. |
| DB 또는 question-index가 실제로 갱신되어야 하는 경우 | `archive/db.js`, `archive/question-index.js`, `archive/tools/build-question-index.mjs`, `archive/question-index-audit.md`, `archive/question-index-report.md` | 해설만 바뀐 경우 DB/index를 건드리지 않는다. 재생성으로 보호 문항이 변하면 `SCOPE_VIOLATION`이다. |
| 태그·세부단원 후보를 생성하거나 bank-wide 분류를 수행 | `archive/tools/tag-enrichment/README.md`, `archive/tools/intelligence/`의 해당 도구, 세부단원 관련 설계/충돌 문서 | 후보 생성과 production 반영을 분리한다. 이번 단원 해설 작업의 자동 분류를 이유로 전 문항을 갱신하지 않는다. |
| bank-wide 구조/자산 inventory 또는 cleanup을 수행 | `archive/tools/js-bank-cleanup/README.md`, 해당 스크립트 | dry-run inventory만으로 source JS·DB·자산을 자동 수정하지 않는다. |
| PDF·페이지 이미지에서 새 candidate를 만들거나 promote | `archive/tools/past-exam-pipeline/README.md`, `archive/tools/past-exam-pipeline/docs/PAST_EXAM_PIPELINE_V2_POLICY.md`, 해당 run/helper/promote 스크립트 | 기존 production JS 해설 업그레이드에는 적용하지 않는다. candidate 성공은 최종 PASS가 아니다. |
| 최종 보고·봉인·다음 시험지 unlock | `docs/rules/02_PIPELINES/수정후보고프로토콜.md`, `docs/rules/00_RULES_INDEX.md#6-무결성관리`, 통합 운영 프로토콜 15~19장 | 전체 재렌더·독립검수·SHA·scope 결과 없이 봉인하지 않는다. |
| 과거 승인본·ZIP·이전 작업 상태가 존재 | 통합 운영 프로토콜 1-1장, 해당 시험의 기존 reports/manifest/seal | 최신 승인 baseline을 재확정하고 stale standalone을 사용하지 않는다. 과거 보고서는 현재 렌더를 대신하지 않는다. |

다음 파일은 현재 existing-JS 단원별 해설 업그레이드의 필수 선행 파일로 보지 않는다.
단, 해당 조건이 생기면 위 표에 따라 읽는다.

- `docs/rules/90_ARCHIVE/# JS아카이브 표준단원키 마스터 테이블.md`: legacy snapshot 이해용일 뿐, 새 키의 기준으로 사용하지 않는다.
- `docs/rules/90_ARCHIVE/JS아카이브_세부단원체계_설계_v1.md`, `docs/rules/90_ARCHIVE/JS아카이브_세부단원_충돌재설계_v1.md`, `docs/rules/90_ARCHIVE/JS아카이브_분류기_세부단원_fallback_통합계획_v1.md`: 새 세부단원 설계·fallback adjudication이 범위일 때만 읽는다.
- `docs/rules/02_PIPELINES/JS_변환_프롬프트.md`: 신규 변환 또는 해당 작업 모드를 명시적으로 사용할 때만 읽는다.
- `archive/textbook/**` 문서·파이프라인: 교재 아카이브 작업일 때만 읽는다. 시험지 JS 작업의 근거로 섞지 않는다.

`_rules/...`로 적힌 과거 문서 경로는 현재 저장소의 대응 `docs/rules/...` 경로로
해석한다. `# `로 시작하는 마스터 파일은 위에 적은 legacy 예외를 따른다.

## 22. 기준 원본(JS)과 선택적 외부 대조 자료

### 22.1 작업 기준 원본의 정의

이 운영의 기준 원본은 이미 작업되어 있는 production JS 파일이다. 즉 archive/exams/original/.../<시험지>.js의 window.examTitle과 window.questionBank, 각 문항의 content·choices·answer·solution·image 필드를 기준 데이터로 삼는다. 이 작업의 목적은 이 JS를 바탕으로 해설을 업그레이드하고 실제 출력 오류를 고치는 것이다.

PDF·스캔·전체 페이지 이미지는 인쇄 원문과 시각 요소를 추가로 확인할 수 있는 선택적 보조 자료다. 있으면 대조 정확도를 높이지만, 없다는 이유만으로 작업을 시작하지 못하거나 PASS를 할 수 없다고 판정하지 않는다. 현재 pipeline.config.example.json의 기본 sourceRoot인 C:\Users\USER\Desktop\기출정리 파일이 존재하지 않는 것도 이 JS 기준 작업의 차단 사유가 아니다.

### 22.2 JS 기준 대조 기록

시험별 source-inventory 또는 baseline 기록에는 최소한 다음을 기록한다.

- production JS의 저장소 상대 경로와 안정적인 시험 ID
- JS 파일 크기와 SHA-256
- window.examTitle 값
- questionBank 문항 수, unique id, displayNo 연속성
- 문항별 content·choices·answer·solution의 존재 상태
- image·solutionImage·legacy image의 경로와 파일 상태
- DB와 question-index의 대응 상태
- PDF·스캔이 있으면 선택적 외부 자료의 경로, 페이지 수, SHA-256

JS questionBank 문항 수와 exam/sol/ans 렌더 문항 수를 대조한다. “문항 수가 맞아 보인다”는 추정으로 PASS하지 않는다. PDF가 있는 경우에만 인쇄 페이지·문항 번호 대조 결과를 추가한다.

### 22.3 SOURCE_BLOCKED 조건과 금지 사항

다음 경우에만 시험지 또는 해당 문항을 SOURCE_BLOCKED로 기록한다.

- JS 파일이 없거나 문법·실행 오류로 questionBank를 읽을 수 없는 경우
- examTitle·문항 ID·문항 순서가 불명확하여 대상 시험지를 특정할 수 없는 경우
- 특정 문항의 오류가 JS·자산·렌더 결과만으로 판정되지 않고, 추가 자료 없이는 안전한 수정을 할 수 없는 경우

PDF·스캔이 없을 때에도 다음은 금지한다.

- 깨진 것처럼 보이는 문자열을 전체 파일에서 일괄 치환하는 것
- 유사 시험지나 다른 학교 파일을 근거 없이 대체하는 것
- JS에 없는 문제·보기·조건을 추측하여 추가하는 것
- 정상 출력 문항의 content·choices·answer·solution을 근거 없이 다시 쓰는 것

PDF·스캔이 나중에 확보되면 이미 기록한 JS 기준 판정에 선택적 외부 대조 결과를 추가한다. PDF 부재로 인한 보류 상태를 자동으로 만들거나, PDF 확보를 이유로 정상 문항을 다시 일괄 수정하지 않는다.

## 23. 한 시험지의 상태 머신

정상 흐름은 다음과 같다.

QUEUED
→ PREFLIGHT_READ
→ TARGET_SCOPE_LOCK
→ SOURCE_CHECK
→ BASELINE_STATIC_CHECK
→ QUESTION_BY_QUESTION_REVIEW
→ ANSWER_SOLUTION_REVIEW
→ SOLUTION_DELTA_EVIDENCE
→ CURRICULUM_REVIEW
→ SVG_REVIEW_IF_NEEDED
→ APPLY_TARGET_CHANGES
→ SOLUTION_RENDER_QUALITY_REVIEW
→ BUILDER_CHECK
→ INDEPENDENT_VERIFY
→ REPAIR_IF_FAILED
→ REVERIFY
→ SEAL

각 상태의 통과 조건은 다음과 같다.

- QUEUED: 2025 원본 기출 큐에 포함되고 식별자가 확정됨.
- PREFLIGHT_READ: 적용 규정·아카이브 구조·표준단원키·엔진/도구의 필수 읽기를 기록하고, 작업 유형에 맞는 기준을 확정함.
- TARGET_SCOPE_LOCK: targetUnitKey와 targetQuestionIds를 확정하고, 나머지 문항과 자산을 보호 목록으로 잠금.
- SOURCE_CHECK: production JS가 정상 해석되고 시험 ID·questionBank·문항 순서가 확인됨. PDF·스캔은 선택 사항이다.
- BASELINE_STATIC_CHECK: 현재 JS·관련 자산·DB·인덱스의 해시, 문법, 문항 수, 경로, 기존 solution/solutionImage 현황을 브라우저 전체 렌더 없이 기록함.
- QUESTION_BY_QUESTION_REVIEW: targetQuestionIds의 기준 JS content·choices·answer·solution·자산을 문항별로 읽어 해설 품질과 시각화 필요성을 판정함. PDF·스캔이 있으면 보조 대조함.
- ANSWER_SOLUTION_REVIEW: 정답과 해설을 독립적으로 풀어 검증함.
- SOLUTION_DELTA_EVIDENCE: 기존 solution에서 유지할 핵심, 학생 이해를 위해 보강할 근거, 수정 후 추가 내용, 변경 형태, 전후 해시·정량 근거, 불변 필드 대조를 문항별 표로 기록하고 독립검수 전달본에 포함함.
- CURRICULUM_REVIEW: 문항별 standardCourse·standardUnit·category와 실제 풀이 방법을 대조하고, 학생이 해당 과정에서 배운 개념만으로 따라갈 수 있는지 판정함.
- SVG_REVIEW_IF_NEEDED: 위의 교육용 시각화 기본 필수 단원에서는 기본적으로 수행함. 실수 범위에 의미 있는 그래프가 없는 퇴화·불성립 경우에만 시각화 예외를 허용하고 사유를 기록함.
- APPLY_TARGET_CHANGES: 독립 풀이와 문항별 품질 판정으로 정당화된 targetQuestionIds의 허용 필드만 수정하고, SVG·인덱스 등 필요한 파생 항목을 제한적으로 반영함.
- SOLUTION_RENDER_QUALITY_REVIEW: APPLY_TARGET_CHANGES 뒤 production 해설지(`sol`) 전체를 렌더하고 모든 문항의 실제 해설을 읽어, 학생이 따라가며 이해할 수 있는 수준인지 판정함. 이것이 학생용 해설의 주 렌더 검수이며, solution 문자열이 존재한다는 것만으로 통과하지 않음.
- BUILDER_CHECK: 수정자가 변경 이유와 범위를 기록하고 1차 검사를 통과함.
- INDEPENDENT_VERIFY: 수정하지 않은 검수자가 기준 JS·데이터·렌더를 독립 확인함. PDF·스캔이 있으면 보조 자료로 사용함.
- REPAIR_IF_FAILED: FAIL된 문항·필드만 수정함.
- REVERIFY: 수정 후 해당 시험 전체를 다시 정적·시각 검수함.
- SEAL: 검수 결과, 변경 파일, SHA-256, 검수자, 렌더 결과가 봉인됨.

어느 단계에서든 기준 JS를 읽거나 특정 문항을 안전하게 판정할 수 없으면 SOURCE_BLOCKED, 대상 단원 밖의 문항·필드·자산이 바뀌면 SCOPE_VIOLATION, 독립검수자가 없으면 INDEPENDENCE_UNSATISFIED, 교육과정 밖의 개념이 핵심 풀이에 사용되면 CURRICULUM_FAIL, 렌더 오류가 남으면 RENDER_FAIL, 실제 해설이 학생에게 읽히거나 이해되지 않으면 SOLUTION_QUALITY_FAIL로 기록한다. PDF 부재만으로 SOURCE_BLOCKED를 기록하지 않는다.

## 24. 수정 전 정적 baseline

수정자는 먼저 다음을 저장한다.

1. production JS, 관련 자산, db.js, question-index.js의 수정 전 SHA-256 또는 Git 기준 상태
2. JS 문법 검사 결과
3. JS questionBank 문항 수와 displayNo 연속성
4. 이미지·SVG 경로의 존재 여부, SVG XML 해석 가능 여부, 상대 경로의 정적 타당성
5. answer·solution·solutionImage·legacy image 필드의 현황
6. DB의 시험 ID·경로·문항 수와 JS의 대응 관계
7. targetUnitKey·targetQuestionIds·protectedQuestionIds·allowedFields
8. 보호 문항과 보호 자산의 변경 전 정규화 해시
9. 사용자 신고가 있는 경우에만 해당 문항·해당 모드의 수정 전 렌더 증거

수정 전 정적 baseline 단계에서 시험지 전체의 exam/sol/ans를 브라우저로 렌더하지 않는다.
전체 렌더, 문항 수, broken image, 자연 크기, 화면 캡처, 수식·줄바꿈·SVG 가독성 판정은
대상 수정과 SVG 제작이 끝난 뒤 §29의 완료본 재검수에서 수행한다. 사용자 신고가 있는
사고 문항만 예외적으로 수정 전 해당 모드를 한정해 재현하며, 로딩 중 0개·중복 개수·임시 DOM을
최종 증거로 기록하지 않는다.

## 25. 문항별 대조와 최소 수정 원칙

각 문항마다 다음 필드를 따로 판정한다.

- displayNo와 기준 JS 문항 번호
- content와 보기
- answer
- solution
- image, visualAsset, solutionImage, solutionImageStatus
- 문항 유형·단원·태그·wide 등 메타데이터
- 수정 완료 후의 렌더 결과와 줄바꿈·겹침·잘림·깨짐 여부. 수정 전에는 사용자 신고가 있는 사고 문항만 해당 모드를 한정해 기록

각 필드는 PASS, WARN, FAIL, SOURCE_BLOCKED 중 하나로 기록한다. WARN은 수정하지 않아도 되는 관찰 사항이며, FAIL만 수정 후보가 된다.

다음 원칙을 지킨다.

- 정상 렌더 문항은 수정하지 않는다.
- raw HTML의 < 또는 >가 있다는 이유만으로 수정하지 않는다.
- 실제 안정 렌더에서 문장이 사라지거나 순서가 바뀌거나 태그로 오인되고, 기준 JS 대조에서도 오류가 확인된 경우에만 해당 문항의 해당 필드를 수정한다.
- 문제 본문 오류와 해설 오류를 하나의 “문자열 문제”로 합치지 않고 각각 기록한다.
- 기존 문제용 시각 자산은 기준 JS의 `image`와 선택적 외부 자료를 대조해 보존한다. 다만 교육용 시각화 기본 필수 단원에서는 현재 `image`가 없다는 이유로 해설용 시각 자산 추가를 생략하지 않는다. 독립 풀이와 solution에서 확정한 수학적 구조가 있으면 별도의 `solutionImage` 또는 inline SVG를 추가할 수 있다.
- 문제용 image와 해설용 solutionImage를 혼동하지 않는다.
- 전체 파일·전체 학교·전체 연도에 적용하는 정규식 치환은 사용하지 않는다.
- 수정 범위는 시험 ID·문항 번호·필드 단위로 제한한다.
- 확정된 targetQuestionIds 밖의 문항 데이터·메타데이터·자산은 읽기 전용으로 취급한다.
- 대상 단원 밖의 문항에 수정 필요성이 발견되어도 이번 작업에서 함께 고치지 않고 별도 작업 목록으로 분리한다.

#### 기존 해설 보존·증분 보강과 `SOLUTION_DELTA_EVIDENCE`

기존 JS의 `solution`이 이전 검수에서 PASS한 해설이라면, 이를 무조건 새로 쓰는 백지 초안으로 취급하지 않는다. 정답·핵심 논리·교육과정이 이미 맞는 경우에는 기존 해설을 보존하면서 학생 이해에 부족한 정의, 중간 식, 논리 연결, 조건 해석, 오개념 방지 설명을 우선 추가·보강한다.

전면 재작성은 다음 중 하나가 확인될 때만 허용한다.

- 수학적 오류·정답 불일치·원문 불일치가 있어 기존 문장을 보존하면 오개념이 남는 경우
- 논리 점프가 커서 필요한 설명을 부분 추가만으로 자연스럽게 연결할 수 없는 경우
- 기존 구조가 실제 `sol` 렌더에서 누락·겹침·잘림·raw LaTeX 노출을 일으켜 최소 수정으로 복구되지 않는 경우
- 기존 풀이가 해당 문항의 standardCourse·standardUnit에 맞지 않아 풀이 구조를 다시 설계해야 하는 경우

`solution`을 기존 문자열과 거의 전부 교체하는 경우에는 내용상 기존 핵심을 보존했더라도 구현상 “전면 교체에 가까운 구조적 보강”으로 분류하고, `APPLY_TARGET_CHANGES` 전에 `SOLUTION_DELTA_EVIDENCE`를 작성한다. 이 근거는 독립검수자에게도 함께 전달하며, 시험별 검수 보고서에 최소한 다음 전후 비교표를 포함한다.

| 필수 비교 항목 | 기록 내용 |
| --- | --- |
| 기존 해설 보존 | 기존 해설에서 이미 맞고 유지한 정의·식·결론·정답 |
| 보강 필요 근거 | 학생이 막힐 수 있는 생략·논리 점프·조건 해석·교육과정 설명 |
| 수정 후 추가 | 새로 삽입하거나 확장한 식·문장·경우 나누기·해석·시각자료 연결 |
| 변경 형태 | `APPEND_ONLY`, `MINIMAL_EDIT`, `REWRITE_WITH_PRESERVED_CORE`, `FULL_REWRITE` 중 하나 |
| 정량·재현 근거 | 수정 전후 solution 해시 또는 기준 버전, 글자 수·문단 수, 변경 필드와 SVG 경로 |
| 불변 항목 | content·choices·answer·메타데이터·문제용 image 등 보존 대상의 대조 결과 |

전후 비교표가 없으면 기존 해설을 전면 교체한 작업을 학생 이해를 위한 정당한 증분 보강으로 간주하지 않으며, 독립검수 전달 및 최종 SEAL을 보류한다. `solutionImage`를 새로 추가한 경우에도 본문 보강과 별도로 SVG가 어떤 이해 공백을 메우는지 표에 기록한다.

### 25.1 해설 렌더·학생 이해도 필수 게이트

기존 JS의 solution은 이전 검수를 통과한 해설일 수 있으므로 무조건 백지화할 초안으로 취급하지 않는다. 정답과 핵심 논리가 맞더라도 학생이 이해하기 어려운 부분이 있으면 기존 해설을 우선 보존·추가 보강하고, 전면 재작성은 위의 허용 사유와 `SOLUTION_DELTA_EVIDENCE`를 남긴 경우에만 수행한다.

이 학생 화면 게이트는 대상 문항의 해설 재작성과 SVG 제작·정적 교차검수가 끝난 뒤에 시작한다.
기존 JS를 읽고 대상과 품질 개선점을 판정하기 전에 시험지 전체 `sol` 화면을 먼저 열어
문항을 찾는 절차로 사용하지 않는다.

해설 검수는 JS의 solution 필드를 읽는 것으로 끝내지 않는다. production engine.html의 sol 모드에서 실제 학생에게 표시되는 해설을 문항별로 끝까지 읽고 판정한다. 수학적으로 맞더라도 학생이 따라갈 수 없거나 핵심 근거가 생략되어 있으면 PASS가 아니라 SOLUTION_QUALITY_FAIL이다.

각 문항은 다음 다섯 항목을 모두 PASS해야 한다.

- 가독성: 글자·수식·줄바꿈·기호·이미지가 잘리지 않고 겹치지 않으며, LaTeX가 깨진 문자열로 노출되지 않는다. 특히 \neq·\leq·\geq·\frac·\sqrt 같은 수식 명령이 의도한 기호와 의미로 표시되는지 확인한다.
- 완결성: 새 기호와 점·선·조건을 정의하고, 정답에 필요한 핵심 계산·경우 나누기·판단 근거를 생략하지 않는다.
- 교육성: 학생이 앞 단계에서 다음 단계로 이동하는 이유를 이해할 수 있다. “계산하면”, “정리하면”, “따라서”만으로 핵심 추론을 건너뛰지 않는다.
- 정합성: 해설의 식·결론·정답·문제 조건·image·solutionImage가 서로 일치한다.
- 교육과정 적합성: 해당 문항의 standardCourse·standardUnit 범위에서 배운 개념과 방법만으로 풀이를 따라갈 수 있다. 벡터·내적·미적분 등 상위 개념이 핵심 풀이에 끼어들지 않는다.

다음 중 하나라도 있으면 해당 문항은 FAIL이다.

- solution은 존재하지만 화면에서 비어 있거나 일부만 보임
- 수식이 깨지거나 raw LaTeX·HTML 태그가 그대로 노출됨
- 풀이에 필요한 정의·조건·중간 식이 생략됨
- 정답이 맞아도 풀이의 논리 연결이 없어 학생이 재현할 수 없음
- 해설의 결론 또는 정답 표기가 문제의 answer와 다름
- 해설용 그림의 라벨·선·축이 잘리거나 본문 설명과 다름
- 내부 검수 메모·임시 문구·제작 지시가 학생 화면에 노출됨
- 해당 과정에서 배우지 않은 개념이 핵심 풀이에 사용됨

FAIL 문항은 부족한 부분을 우선 증분 보강하고, 필요한 경우에만 solution을 재작성하거나 solutionImage를 수정한 뒤 해당 문항뿐 아니라 시험지 전체의 sol 화면을 다시 렌더한다. 교육과정 FAIL이면 먼저 해당 과정의 허용 방법으로 풀이를 다시 설계한다. 재작업 후 실제 화면에서 다섯 항목을 다시 PASS할 때까지 시험지를 봉인하지 않는다.

### 25.2 학생 화면 판정 절차

sol 화면 검수는 다음 순서로 수행한다.

1. 렌더가 완료되고 문항 수가 안정될 때까지 기다린다. 로딩 중인 빈 화면이나 임시 DOM을 판정에 사용하지 않는다.
2. JS의 각 questionBank 문항과 화면의 q-num을 순서대로 대응시킨다.
3. 각 문항에서 해설의 시작부터 결론까지 실제로 읽는다. 접혀 있거나 화면 밖에 있는 내용은 표시된 것으로 인정하지 않는다.
4. 수식이 단순히 보이는지만 보지 않고, 부등호·분수·근호·지수·괄호·음수 등 수학적 의미가 올바르게 표시되는지 확인한다.
5. 문장과 수식의 줄바꿈, 문단 간격, 글자 크기, 해설 상자 높이, 페이지 분할을 학생이 읽을 수 있는 상태인지 확인한다.
6. 풀이에 사용된 값·기호·조건을 앞의 문제와 대조하고, 해설 마지막 결론을 answer와 대조한다.
7. 풀이에 사용된 공식·정리·방법이 해당 문항의 standardCourse·standardUnit 범위인지 확인한다. 다른 과정의 개념을 핵심 도구로 쓰면 CURRICULUM_FAIL이다.
8. solutionImage가 있으면 본문이 지시하는 그림인지, 라벨이 읽히는지, 본문과 그림의 관계가 맞는지 확인한다.
9. 문항별 판정과 화면 캡처 또는 재현 가능한 렌더 위치를 기록한다.

정적 검사에서 solution이 비어 있지 않고, DOM에 글자 수가 존재하고, q-num 개수가 맞더라도 학생 화면 판정에서 FAIL이면 최종 FAIL이다. “출력된다”와 “학생이 이해할 수 있다”와 “교육과정 안에서 설명된다”는 별도 조건이다.

## 26. 시각 자산과 SVG 판정

시각 자산은 다음 순서로 확인한다.

1. 기준 JS의 `image`·`solutionImage` 또는 선택적 외부 자료에 기존 도형·표·그림이 있는가. 기존 자산이 없어도 교육용 시각화 기본 필수 단원인지 별도로 판정한다.
2. 현재 JS가 올바른 문항에 올바른 asset 경로를 가리키는가.
3. 파일이 존재하고 PNG/SVG로 정상 해석되는가.
4. crop이 문항의 도형을 잘라먹거나 다른 문항을 포함하지 않는가.
5. exam과 sol에서 자산이 의도한 위치에 출력되는가.
6. SVG의 viewBox, 텍스트, 선, 축, 라벨이 겹치거나 잘리지 않는가.
7. 해설 전용 SVG라면 solutionImage와 해설 논리가 일치하는가.

위의 교육용 시각화 기본 필수 단원에서는 기준 JS의 단원명과 실제 풀이 구조를 근거로
해설용 SVG를 기본 생성한다. 단, 실수 범위에서 의미 있는 그래프가 존재하지 않거나 그림이
학생의 판단을 오히려 왜곡하는 퇴화·불성립 경우에는 해당 그래프를 억지로 추가하지 않고
예외 사유를 기록한다. 특히 원의 방정식은 $r^2=0$이면 한 점, $r^2<0$이면 실수 원이
없으므로 원을 만들지 않는다. 기존 정상 문제용 자산은 건드리지 않으며, 새 해설용 자산은 별도
`qNN-solution.svg`로 관리한다. 자산 교체가 필요하면 이전 자산의 문제와 새 자산의
근거를 corrections에 기록한다.

## 27. 독립검수의 실제 조건

독립검수자는 제작자의 수정 과정을 그대로 따라가며 확인하는 사람이 아니라, 기준 JS와 수정 결과를 별도 검토하는 역할이다.

독립검수 보고서에는 다음을 포함한다.

- 시험 ID와 기준 JS 식별자
- 검수자 식별자
- 검수 시각
- 검수에 사용한 production URL과 mode
- 문항별 content/choices/answer/solution/asset 판정
- 문항별 solution 화면의 가독성·완결성·교육성·정합성·교육과정 적합성 판정
- 학생이 실제로 풀이를 따라갈 수 있는지에 대한 PASS/FAIL과 재작업 사유
- 발견한 FAIL과 수정 요구
- exam/sol/ans 문항 수
- broken image, overflow, console error 여부
- 최종 PASS 또는 FAIL

같은 작업 문맥에서 수정자가 자기 결과를 다시 읽은 것만으로는 독립검수를 충족하지 않는다. 독립검수 산출물이 없으면 INDEPENDENCE_UNSATISFIED로 두고 SEAL하지 않는다.

## 28. 실제 검증 명령과 브라우저 확인

명령은 저장소 루트 C:\Users\USER\Desktop\AP------에서 실행한다.

- 파이프라인 도구 자체 문법 확인:
  npm --prefix archive/tools/past-exam-pipeline run check
- 개별 production JS 문법 확인:
  node --check archive/exams/original/.../25_시험지.js
- LaTeX escape와 제어문자 전체 검사:
  node archive/tools/audit-latex-escapes.mjs --repo .
- 문항 인덱스 재생성:
  node archive/tools/build-question-index.mjs
- 생성 자산 링크 검사:
  python archive/tools/past-exam-pipeline/helpers/audit_generated_visual_asset_links.py --root . --out reports/visual_asset_link_audit.json
- 후보 구조 검사:
  python archive/tools/past-exam-pipeline/helpers/validate_final_candidates.py --summary <summary.json> --out <validation.json>

생성 파이프라인은 PDF·전체 페이지 이미지가 있는 신규 추출 작업에서 선택적으로 사용한다. 이미 production JS가 있는 해설 업그레이드 작업은 파이프라인을 거치지 않고 JS·자산·렌더 baseline부터 직접 시작할 수 있다.

- 단일 시험지 후보 생성은 run-one-exam.mjs의 시험 manifest를 사용한다.
- 여러 시험지용 run-batch.mjs는 inventory, create-selected, run-selected 단계를 제공하지만, 1개 시험지 규정에서는 selected manifest의 jobCount가 1인지 확인한다.
- promote-reviewed-exam.mjs는 reviewed_pass 후보를 복사하는 단계로만 사용하고, DB·인덱스·렌더·봉인을 별도로 수행한다.

Production 브라우저 확인 URL 형식은 다음과 같다.

- archive/engine.html?qpp=4&data=exams/<상대 JS 경로>&mode=exam
- archive/engine.html?qpp=4&data=exams/<상대 JS 경로>&mode=sol
- archive/engine.html?qpp=4&data=exams/<상대 JS 경로>&mode=ans

실제 브라우저 확인은 APPLY_TARGET_CHANGES 뒤에 시작한다. 수정 전에는 사용자가 구체적으로 신고한
깨짐·중복·미출력 문항만 해당 모드로 재현할 수 있으며, 단원 대상 선별이나 해설 품질 분석을 위해
시험지 전체를 선렌더하지 않는다. 완료본에서는 URL의 exams 기준 경로가 engine.html의 데이터
로딩 규칙과 일치하는지 먼저 확인한다. 학생용 해설지 `sol`을 주 검수 대상으로 삼아 렌더 완료 후
각 해설을 직접 읽는다. `exam`·`ans`는 수정으로 인한 보호 문항 훼손을 확인하는 보조 렌더로
확인한다. exam/sol은 q-num, ans는 ans-n을 기준으로 JS questionBank 문항 수와 비교한다.
가로 스크롤, 화면 밖으로 밀린 상자, 잘린 수식, 빈 해설, broken image, 콘솔 오류를 기록한다.

sol 모드에서는 각 문항의 실제 해설 영역을 확대해 읽는다. solution 필드가 비어 있지 않다는 정적 검사만으로 PASS하지 않는다. 모든 문항에 대해 가독성·완결성·교육성·정합성·교육과정 적합성을 기록하고, 하나라도 FAIL이면 SOLUTION_QUALITY_FAIL 또는 CURRICULUM_FAIL로 되돌려 해설을 재작업한다.

## 29. 수정 후 전체 재검수

한 문항을 고쳤더라도 그 시험지 전체를 다시 확인한다.

이 단계의 전체 렌더가 기존 production JS 해설 업그레이드에서 최초의 의무 전체 렌더다.
수정 전 선렌더로 이를 대체하거나, 수정한 문항만 렌더해 끝내지 않는다.

1. 수정한 JS의 node --check
2. 수정한 문항의 기준 JS 대조
3. 시험 전체 exam/sol/ans 재렌더하되, 학생용 판정은 해설지 sol을 기준으로 수행
4. 전체 문항 수 재확인
5. 모든 이미지·SVG 재로드 확인
6. DB와 question-index의 시험 ID·문항 수 확인
7. LaTeX escape 및 생성 자산 링크 검사
8. 전체 문항의 실제 해설지 sol 화면에서 학생 이해도와 교육과정 적합성 재확인
9. targetQuestionIds 밖 보호 문항의 데이터·자산 해시 동일성 확인
10. 보호 문항의 exam/sol/ans 렌더 훼손 여부 확인
11. 독립검수자의 재확인
12. 변경 파일과 최종 SHA 기록

수정 전 정상 문항이 수정 후 깨지지 않았다는 것을 전체 렌더로 확인해야 한다. 수정된 문항만 다시 띄워 보는 것으로는 SEAL할 수 없다.

## 30. DB·question-index·봉인의 구체 규칙

시험 JS를 수정했다고 DB나 question-index를 무조건 수정하지 않는다. 다음 경우에만 갱신한다.

- 시험 ID·파일 경로·학년·학기·시험 유형·문항 수가 실제와 다름
- 새 문항 또는 문항 삭제가 기준 JS 대조로 확인됨
- 문항 인덱스가 수정된 content·태그·분류를 반영해야 함

단원별 해설만 수정한 경우에는 보호 문항의 DB·인덱스 기록을 건드리지 않는다. DB나 question-index를 갱신해야 한다면 대상 시험·대상 문항에 필요한 변경만 허용하며, 자동 재생성으로 보호 문항의 순서·내용·메타데이터가 바뀌면 SCOPE_VIOLATION으로 처리한다.

갱신 후 archive/tools/build-question-index.mjs를 실행하고 결과를 검증한다. DB·인덱스가 변경되지 않았다면 변경하지 않은 이유를 기록한다.

현재 저장소 도구에는 최종 seal.json과 SHA-256을 자동으로 봉인하는 단일 명령이 없다. 따라서 시험별 reports/seal.json에 다음을 직접 기록한다.

- examId
- archive JS 경로와 최종 SHA-256
- 선택적 PDF·스캔이 있으면 해당 외부 자료와 SHA-256
- production JS 및 관련 자산의 최종 SHA-256
- DB·question-index 변경 여부와 최종 SHA-256
- 수정된 문항·필드 목록
- 수정하지 않은 정상 문항을 포함한 전체 렌더 결과
- 독립검수자·검수 시각
- PASS 또는 FAIL
- nextExamUnlocked: true 또는 false

seal.json 기록 이후 위 산출물 중 하나라도 변경되면 기존 PASS와 SHA는 무효가 되며, BASELINE부터 재검수한다.

## 31. 시험별 검수 기록 최소 형식

question-review.json의 각 문항에는 최소한 다음을 기록한다.

- questionNo
- targetUnitKey
- targetQuestionIds
- protectedQuestionIds
- sourcePage (PDF·스캔이 있을 때만)
- jsEvidence 또는 선택적 외부 대조자료·crop 영역
- currentStatus
- contentStatus
- choicesStatus
- answerStatus
- solutionStatus
- visualAssetStatus
- renderStatus
- scopeStatus
- finding
- changed: true 또는 false
- changedFields
- reason
- afterRenderEvidence
- solutionRenderEvidence
- solutionReadability
- solutionCompleteness
- solutionTeachability
- solutionConsistency
- solutionCurriculumFit
- curriculumStatus
- curriculumMethodsUsed
- curriculumUnsupportedMethod
- curriculumReason
- solutionQualityStatus
- reworkRequired

corrections.json에는 실제 수정한 문항만 넣는다. 수정하지 않은 정상 문항을 억지로 변경 목록에 넣지 않는다. 기준 JS만으로 판정할 수 없는 문항은 corrections가 아니라 SOURCE_BLOCKED 목록에 둔다.

## 32. 현재 저장소에서 확인된 선행 보류 사항

2025 큐를 시작하기 전에 다음 환경 사실을 각 시험지의 source-inventory에 반영한다.

1. pipeline.config.example.json의 기본 sourceRoot인 C:\Users\USER\Desktop\기출정리 파일이 현재 존재하지 않지만, 이 작업의 기준 원본은 production JS이므로 자체 차단 사유가 아니다.
2. 2025 자산 폴더 중에는 비어 있거나 일부 문항만 있는 폴더가 있다.
3. 과거 감사 기록에는 DB 경로 접미사 불일치, 분류 메타데이터 누락, 일부 RAW 항목이 남아 있다.
4. 기존 JS와 자산이 있다고 해서 해설·정답·렌더 검수가 끝난 것은 아니지만, JS가 정상 해석되면 이를 기준으로 검수를 시작한다.
5. 2025 유사문제·변형문제에서 수학적 FAIL 사례가 있었으므로, original과 similar/types를 큐와 판정에서 혼합하지 않는다.
6. 과거 화면 캡처나 과거 QA 보고서는 현재 렌더의 보조 증거일 뿐, 현재 JS·자산·렌더 검수를 대신하지 않는다.
7. 현재 `docs/rules/MANIFEST.md`에 기록된 해시와 작업 트리의 실제 해시를 대조한 결과, `JS아카이브_세부단원_운영규칙_v1.md`와 `JS아카이브_표준단원키_마스터테이블.md`는 각각 manifest 기록과 현재 바이트·SHA-256이 다르다. 이 상태는 `SOURCE_PACK_DRIFT`로 기록하며, 어느 버전을 기준으로 삼을지 승인·기록하기 전에는 시험지 수정이나 최종 PASS를 진행하지 않는다.
8. 현재 v1.1 규정 파일은 기존 manifest에 아직 등록되지 않은 작업본이다. v1.1을 정식 운영본으로 승인할 때는 manifest의 대상·바이트·SHA-256을 갱신하고, 갱신 전까지는 v1.0과 v1.1을 혼용하지 않는다.

첫 시험지에서 PDF를 찾지 못해도 JS가 정상 해석되면 SOURCE_CHECK, 정적 baseline, 대상 문항
검토부터 진행한다. 수정 전 전체 baseline 렌더는 진행하지 않는다. JS 자체가 읽히지 않거나 특정
판정을 안전하게 할 수 없을 때만 SOURCE_BLOCKED로 기록한다. 사용자가 “1개씩” 지정한 운영
원칙상, 현재 시험지의 판정이 끝나기 전에 다음 파일을 임의로 수정하지 않는다.

## 33. 첫 2025 시험지 intake 양식

첫 대상은 정렬된 큐의 첫 번째 2025 original 파일로 잡되, source check를 통과해야 실제 검수에 들어간다. intake에는 다음을 채운다.

- examId
- archiveFile
- archiveSha256
- optionalPdfFile
- optionalPdfSha256
- optionalPdfPageCount
- jsQuestionCount
- assetDirectory
- dbRecord
- questionIndexRecord
- reportedRenderIncident (사용자 신고가 있을 때만)
- postChangeRender
- sourceStatus
- independentVerifier
- currentStage

archiveFile, archiveSha256, jsQuestionCount, examTitle 중 하나라도 확인되지 않으면 currentStage는 SOURCE_CHECK에 머문다. optionalPdfFile, optionalPdfSha256, optionalPdfPageCount는 PDF가 있을 때만 채운다. PDF가 없다는 이유로 JS의 content·choices·answer·solution 검토를 중단하지 않는다.

## 34. v1.1 변경 이력

- 기존 해설이 이전 검수를 통과한 경우를 보존 기준으로 삼고, 증분 보강을 기본값으로 변경했다. `SOLUTION_DELTA_EVIDENCE` 단계와 문항별 전후 비교표를 독립검수 전달 및 최종 SEAL의 필수 근거로 추가했다.

- 전체 렌더는 수정 후 `sol`을 필수로 수행하고 `exam`·`ans`는 보조로 확인하며, 범위 밖 발견은 기록만 하고 사용자의 명시적 승인 뒤에만 핀포인트 수리하도록 전체 렌더 게이트를 명확히 했다.

- v1.0 원칙을 유지하면서 2025 original 기출 우선·1개 시험지 단위 큐를 추가했다.
- 실제 저장소의 JS·자산·DB·question-index·production/mixed renderer·pipeline 도구를 파일 맵으로 고정했다.
- 기준 JS 분석 불가를 SOURCE_BLOCKED로 처리하는 게이트를 추가했다.
- 렌더 증상만으로 일괄 수정하지 않고, 기준 JS 대조 후 문항·필드 단위 최소 수정하도록 명문화했다.
- 안정 렌더 대기, q-num/ans-n 기준, 수정 후 전체 재렌더를 추가했다.
- 독립검수, seal.json, SHA-256, nextExamUnlocked를 구체화했다.
- 후보 승격 도구가 DB·인덱스·렌더·봉인을 자동 완료하지 않는 현재 저장소 상태를 반영했다.
- 작업 기준 원본을 PDF가 아닌 기존 production JS로 명확히 정정했으며, PDF·스캔은 선택적 보조 자료로 변경했다.
- 실제 sol 화면에 표시된 해설의 학생 이해도 검수를 필수 게이트로 추가했으며, 가독성·완결성·교육성·정합성 중 하나라도 부족하면 SOLUTION_QUALITY_FAIL 후 재작업하도록 했다.
- 기존 solution을 최종본이 아닌 업그레이드 대상 초안으로 규정하고, 학생용 해설의 작성 순서·조건 처리·식 전개·금지 표현·수식 의미 확인 기준을 세분화했다.
- 문항별 standardCourse·standardUnit에 맞는 풀이 방법만 사용하도록 교육과정 적합성 게이트와 CURRICULUM_FAIL 재작업 절차를 추가했다.
- 교육과정 판정을 단순 키워드 검출로 하지 않고, 해당 개념이 실제 풀이의 핵심 도구인지와 문항의 단원 프로필을 함께 보도록 했다.
- 작업 범위를 지정 단원 문항으로 잠그고, 그 밖의 보호 문항·자산·메타데이터는 변경 전후 해시와 렌더로 보존 검증하도록 했다.
- 아카이브 관련 규정·프로토콜·마스터·엔진·도구의 선행 읽기 게이트를 추가하고, 작업 유형별 조건부 읽기 파일과 `PREFLIGHT_READ` 차단 상태를 명문화했다.
- `MANIFEST.md`의 파일 누락·해시 불일치를 조용히 무시하지 않고 `SOURCE_PACK_DRIFT`로 기록하며, legacy 문서·파이프라인·내부 검토 UI의 적용 조건을 분리했다.
- 원의 방정식·직선의 방정식·이차함수·이차방정식·이차부등식에서는 교육용 SVG를 기본 필수로 적용하고, 실수 그래프가 없는 경우만 명시적 예외로 두도록 시각화 원칙을 확장했다.
- 렌더 검수의 주 대상을 학생용 해설지 `sol`로 명확히 하고, `exam`·`ans`는 보호 문항 훼손 확인용 보조 렌더로 구분했다.
- 기존 production JS 해설 업그레이드의 작업 순서를 정정했다. 규정·대상 단원·대상 문항·기존 해설을 먼저 정적으로 검토하고, 해설 재작성과 SVG 제작을 끝낸 완료본을 처음 전체 렌더하여 검수한다. 수정 전 전체 baseline 렌더는 구체적인 렌더 사고가 신고된 문항을 재현하는 예외로만 허용한다.
