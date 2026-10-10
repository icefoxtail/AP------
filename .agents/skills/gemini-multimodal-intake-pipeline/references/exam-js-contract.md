# Exam JS Contract & Evidence Schema

## 1. Exam JS Structure (`window.examTitle`, `window.questionBank`)
모든 APMath 아카이브 시험지는 UTF-8 인코딩의 단독 JS 파일로 적재되며 전역 객체에 등록됩니다:

```javascript
window.examTitle = "25_금당고_1학기_중간_고2_대수";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "다음 중 옳지 않은 것은? [4점]",
    "choices": [
      "$90^\\circ = \\dfrac{\\pi}{2}$",
      "$60^\\circ = \\dfrac{\\pi}{3}$",
      "$\\dfrac{\\pi}{4} = 45^\\circ$",
      "$-\\dfrac{\\pi}{6} = -30^\\circ$",
      "$\\dfrac{4}{3}\\pi = 180^\\circ$"
    ],
    "tags": ["객관식", "호도법", "삼각함수"],
    "answer": "",    // 반드시 빈 문자열 (Source-Only 규격)
    "solution": ""   // 반드시 빈 문자열 (R1/R2 단계 위임)
  },
  {
    "id": 7,
    "questionType": "객관식",
    "content": "아래 그림과 같이 반지름의 길이가 $3$, 중심각의 크기가 $30^\\circ$인 부채꼴의 넓이는? [4.2점]",
    "image": "assets/images/25_금당고_1학기_중간_고2_대수/q07.png",
    "choices": [
      "$\\dfrac{\\pi}{4}$",
      "$\\dfrac{\\pi}{2}$",
      "$\\dfrac{3}{4}\\pi$",
      "$\\pi$",
      "$2\\pi$"
    ],
    "tags": ["객관식", "부채꼴의 호의 길이와 넓이", "삼각함수"],
    "answer": "",
    "solution": ""
  },
  {
    "id": 19,
    "questionType": "서술형",
    "content": "<p>[서·논술형 1] 부등식 $\\log_3(x-1)-\\log_3\\left(\\dfrac{2}{3}x-1\\right)-1 > 0$의 해가 $\\alpha < x < \\beta$일 때, $\\alpha\\beta$의 값을 풀이과정과 함께 상세하게 서술하시오. [5점]</p>",
    "choices": [],
    "tags": ["서술형", "로그부등식", "지수와 로그"],
    "answer": "",
    "solution": ""
  }
];
```

---

## 2. 필수 검증 필드 규칙
1. `id`: 1부터 순차적으로 증가하는 자연수.
2. `questionType`: `"객관식"`, `"서술형"`, `"단답형"` 중 하나.
3. `content`: 발문 HTML/텍스트. KaTeX 인라인 수식은 `$수식$`, 블록 수식은 `$$수식$$`.
4. `choices`: 객관식은 반드시 5개 원소를 갖는 배열. 서술형/단답형은 빈 배열 `[]`.
5. `image`: 문항에 전용 그림이 있을 경우 상대 경로 `"assets/images/<slug>/qXX.png"`로 지정.
6. `answer`, `solution`: 반드시 `""` 빈 문자열.

---

## 3. 증거 JSON 파일 규격 (`.evidence.json`)
- 경로: `archive/analysis/source-only-<batchTag>/<slug>.evidence.json`
- 필수 필드:
  - `contractVersion`: `"source-only-intake-v1"`
  - `source`: PDF 원본 절대 경로, SHA-256 해시, 페이지 수, 300 DPI
  - `exam`: 시험지 제목, 대상 JS 경로
  - `inventory`: 총 문항 수, 객관식 수, 서술형 수, 이미지 에셋 수
  - `images`: 각 에셋의 qid, 상대 경로, 파일 SHA-256 해시
  - `validation`: `vmExecution`, `choiceLengthCheck`, `answerBlankCheck`, `solutionBlankCheck`, `assetExistenceCheck` (모두 `"PASS"`)
