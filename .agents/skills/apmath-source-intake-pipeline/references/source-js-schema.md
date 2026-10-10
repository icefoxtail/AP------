# Source-Only JS Structure & Evidence Contract

## 1. Exam JS Structure (`window.questionBank` / `window.examTitle`)
The repository's native exam engine loads exams via `window.examTitle` and `window.questionBank`:

```javascript
window.examTitle = "24_강남여고_1학기_중간_고1_기출";

window.questionBank = [
  {
    "id": 1,
    "questionType": "객관식",
    "content": "두 다항식 $A=2x^2+3xy-5y^2$, $B=3x^2-xy+4y^2$에 대하여 $2A+B$를 간단히 하면? [2.7점]",
    "choices": [
      "$5x^2+2xy-y^2$",
      "$x^2-4xy+9y^2$",
      "$8x^2+xy+3y^2$",
      "$7x^2+5xy-6y^2$",
      "$7x^2+3xy-3y^2$"
    ],
    "tags": [
      "객관식",
      "다항식의 연산"
    ],
    "answer": "",    // 반드시 빈 문자열 (Source-Only 단계에서는 풀이/정답 비움)
    "solution": ""   // 반드시 빈 문자열 (다운스트림 R1/R2/솔루션 단계에 위임)
  },
  {
    "id": 11,
    "questionType": "객관식",
    "content": "두 이차함수 $y=f(x)$와 $y=g(x)$의 그래프가 다음 그림과 같을 때...",
    "choices": [
      "① $f(x) < 0$",
      "② $g(x) > 0$",
      "③ $f(x)g(x) > 0$",
      "④ $f(x)+g(x) < 0$",
      "⑤ $f(x)-g(x) > 0$"
    ],
    "tags": [
      "객관식",
      "이차함수",
      "그래프"
    ],
    "image": "assets/images/24_강남여고_1학기_중간_고1_기출/q11.png",
    "answer": "",
    "solution": ""
  },
  {
    "id": 21,
    "questionType": "서술형",
    "content": "[서·논술형1] 다항식 $f(x)$에 대하여 등식\n$(x-1)(x^2-2)f(x)=2x^8+ax^4+b$가 $x$의 값에 관계없이 항상 성립하도록 상수 $a, b$의 값을 정할 때, $\\sqrt{(-20)ab}$의 값을 구하시오. (단, 풀이 과정을 자세히 쓰시오.) [4점]",
    "choices": [],
    "tags": [
      "서술형",
      "항등식과 나머지정리"
    ],
    "answer": "",
    "solution": ""
  }
];
```

---

## 2. Source-Only Core Rules
1. **Answer & Solution Blanking**:
   - `answer: ""` and `solution: ""` MUST be empty strings.
   - The Source-Only stage focuses strictly on lossless transcriptions and visual fidelity. Solution solving and answer proofing belong to downstream R1 DEEP and R2 Blind stages.
2. **Lossless Question Parity**:
   - Transcribe all text verbatim from the PDF source.
   - Mathematical expressions must use standard KaTeX / MathJax inline `$...$` or display `$$...$$`.
   - Never omit question numbers, condition brackets `[단, ...]`, or sub-questions.
3. **Multiple-Choice Formatting**:
   - Standard objective questions must have an array of 5 choices (`choices.length === 5`).
   - For subjective questions (`서술형` / `주관식`), `choices` is `[]`.
4. **Image Assets**:
   - Must be cropped at 300 DPI from PDF render.
   - Clean margins, high contrast, transparent or white background.
   - Path contract: `assets/images/{examBasenameSlug}/q{id}.png`.
   - Referenced in question object via `"image": "assets/images/{slug}/q{id}.png"` or within `"content"` HTML `<img>`.

---

## 3. Evidence File Contract (`.evidence.json`)
The intake artifact must be accompanied by an evidence JSON file stored under:
`archive/analysis/source-only-{batchTag}/{examSlug}.evidence.json`

### Required Schema Fields:
```json
{
  "contractVersion": "source-only-intake-v1",
  "generatedAt": "2026-10-08T23:30:00+09:00",
  "source": {
    "pdfPath": "C:\\Users\\USER\\Desktop\\기출정리 파일\\(1)1중간\\수학(상)\\2024_강남고1_1중간.pdf",
    "pdfSha256": "...",
    "pageCount": 4,
    "dpi": 300
  },
  "exam": {
    "title": "24_강남여고_1학기_중간_고1_기출",
    "grade": "고1",
    "subject": "수학",
    "targetJs": "archive/exams/original/high/h1/1mid/24_강남여고_1학기_중간_고1_기출.js"
  },
  "inventory": {
    "totalQuestions": 24,
    "choiceCount": 20,
    "essayCount": 4,
    "imageCount": 2
  },
  "images": [
    {
      "qid": 11,
      "path": "archive/assets/images/24_강남여고_1학기_중간_고1_기출/q11.png",
      "sha256": "...",
      "dimensions": { "width": 816, "height": 612 }
    }
  ],
  "validation": {
    "vmExecution": "PASS",
    "choiceLengthCheck": "PASS",
    "answerBlankCheck": "PASS",
    "solutionBlankCheck": "PASS",
    "assetExistenceCheck": "PASS"
  }
}
```
