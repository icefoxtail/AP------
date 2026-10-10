---
name: apmath-source-intake-pipeline
description: Audit original exam sources against the APMath Archive repository, match identities, and execute source-only intake (lossless question/choices transcription, 300 DPI diagram asset cropping, skeleton tags, and blank answers/solutions) with evidence and VM validation.
---

# APMath Source Intake Pipeline

이 스킬은 외부 원본 기출(PDF) 컬렉션과 APMath 저장소의 기출 아카이브를 전수 대사하여 부재 시험지를 식별하고,
선정된 원본 시험지를 **Source-Only**(발문/보기 전사, 300 DPI 이미지 에셋 크롭, 스켈레톤 태그, 정답/해설 비움) 규격으로 안전하게 인테이크하는 표준 파이프라인입니다.

---

## 1. Pipeline Overview & Core Principles

```text
[PDF 원본 폴더]
       │
       ▼
Phase 1: 원장 전수 대사 (Inventory & Identity Audit)
       │  - 학교명/연도/학기 정규화, 제외 학교 필터링, 부재 시험지 확정
       ▼
Phase 2: 300 DPI 렌더링 & 단 분할 (High-Res Render & Column Segmentation)
       │  - PyMuPDF 기반 고해상도 페이지 변환 및 2단 분할
       ▼
Phase 3: 무손실 발문/보기 전사 (Lossless Transcription)
       │  - 원문 100% 일치, LaTeX 수식, 5지선다 배열
       │  - [핵심 규칙] answer: "", solution: "" 엄격 준수 (다운스트림 이관)
       ▼
Phase 4: 정밀 다이어그램 크롭 & 결속 (Precision Asset Cropping)
       │  - 문제 내 그래프/도형 300 DPI 크롭 -> archive/assets/images/<slug>/qXX.png
       ▼
Phase 5: JS 스켈레톤 & 증거 생성 (Artifact & Evidence Packaging)
       │  - window.examTitle, window.questionBank 조립
       │  - .evidence.json 메타데이터 및 SHA-256 기록
       ▼
Phase 6: Node.js VM 자동 검증 (Automated Fail-Closed Validation)
       │  - node validate_source_intake.mjs 검증 (syntax, 5선택지, 공란 답안, 에셋 실재)
       ▼
[완료 보고 및 다음 단계(R1 DEEP / R2 BLIND) 인계]
```

### 핵심 불변 조건 (Invariants)
1. **Source-Only 경계**: `answer: ""`와 `solution: ""`는 반드시 빈 문자열로 둡니다. 수학적 풀이 및 정답 검증은 다운스트림 단계(R1 DEEP / R2 BLIND)의 책무입니다.
2. **무손실 원문 일치 (100% Parity)**: 오탈자 자의적 수정, 임의 생략, 문장 재구성을 금지하며 원문 표기를 그대로 전사합니다.
3. **에셋 실재성 (Asset Parity)**: 문제에 포함된 모든 그래프, 도형, 표는 누락 없이 300 DPI로 크롭하여 정해진 경로에 저장하고 링크합니다.

---

## 2. Phase 1: 원장 전수 대사 (Inventory & Identity Audit)

### 2.1 시험지 식별자 튜플
모든 기출 시험지는 다음 4개 속성 튜플로 단일 식별됩니다:
`Identity = (Year, NormalizedSchool, Grade, Term/Exam)`

- 학교명 별칭 정규화: [school-normalization.md](references/school-normalization.md) 참조
- 제외 학교: **청암고**, **공고/공업고**, **효산고** (전수 제외)
- 파일 필터링: `.pdf` 파일만 대상으로 하며, `.hwp`, `.hwpx` 및 `정답`, `해설`, `주관식`, `답안` 파일은 제외

### 2.2 자동 대사 스크립트 실행
```powershell
python .agents/skills/apmath-source-intake-pipeline/scripts/audit_exams.py `
  --source-dir "C:\Users\USER\Desktop\기출정리 파일\(1)1중간\수학(상)" `
  --archive-dir "archive/exams/original/high/h1/1mid"
```
JSON 형식으로 결과를 받으려면 `--json` 및 `--output <path>` 옵션을 사용합니다.

---

## 3. Phase 2: 고해상도 렌더링 & 단 분할

원본 PDF를 300 DPI로 래스터화하여 텍스트 및 그래프의 미세 디테일을 온전히 보존합니다.

```powershell
python .agents/skills/apmath-source-intake-pipeline/scripts/render_and_crop.py `
  "<path-to-source.pdf>" `
  --out-dir ".tmp/rendered_pages" `
  --dpi 300 `
  --split-cols
```

- 페이지별 `page_01.png`, `page_02.png` 생성
- 한국 고교 시험지 표준 2단 레이아웃 기준 `page_01_col1.png`, `page_01_col2.png`로 중앙 여백 기준 분할

---

## 4. Phase 3: 무손실 발문 & 보기 전사 규칙

### 4.1 수식 표기
- 인라인 수식: `$x^2+ax+b=0$`
- 디스플레이 수식: `$$...$$` (단독 블록 필요 시)
- 거듭제곱, 분수, 근호: `\dfrac{a}{b}`, `\sqrt{a}`, `x^{n}` 등 표준 KaTeX/MathJax 문법 사용

### 4.2 문항 유형 및 보기
- **객관식 (`questionType: "객관식"`)**:
  - `choices`: 정확히 5개 원소를 갖는 배열 `["...", "...", "...", "...", "..."]`
  - 원본 번호 표기 원칙을 준수
- **서술형/주관식 (`questionType: "서술형"`)**:
  - `choices`: `[]` (빈 배열)
  - 배점 표기: 문항 끝 `[4점]`, `[5.0점]` 원문 유지
  - 단서 조항: `(단, ...)` 누락 금지

### 4.3 정답과 해설 공란 계약
```javascript
"answer": "",
"solution": ""
```
이 단계에서 답을 임의 추론하거나 해설을 작성하지 않습니다.

---

## 5. Phase 4: 정밀 다이어그램 크롭 & 에셋 결속

문항에 포함된 그래프, 도형, 삽화는 고해상도로 크롭합니다.

### 5.1 파일명 및 저장 경로 규격
- 에셋 디렉터리: `archive/assets/images/<exam_slug>/`
- 파일명 규칙: `q<id>.png` (예: `q11.png`, `q20.png`)
- 문항 내 결속 방식:
  ```json
  "image": "assets/images/<exam_slug>/q11.png"
  ```
  또는 `content` 내부:
  ```html
  <p><img src="assets/images/<exam_slug>/q11.png" class="question-img" alt="문제 11 그림"></p>
  ```

---

## 6. Phase 5: 산출물 및 증거 파일 구조

[source-js-schema.md](references/source-js-schema.md)를 준수하여 다음 3개 경로에 산출물을 배치합니다:

1. **프로덕션 원본 경로**:
   `archive/exams/original/high/<grade>/<term>/<slug>.js`
   - 예: `archive/exams/original/high/h1/1mid/24_강남여고_1학기_중간_고1_기출.js`
2. **생성물 격리 경로**:
   `archive/_generated/source-only/<batch_tag>/<slug>.js`
3. **증거 JSON 파일**:
   `archive/analysis/source-only-<batch_tag>/<slug>.evidence.json`
   - PDF 경로, SHA-256 해시, 문항 수, 객관식/서술형 수, 에셋 목록, 유효성 검증 결과를 기록

---

## 7. Phase 6: 자동화 검증 (Automated Gate Check)

인테이크 완료 후 반드시 `validate_source_intake.mjs` 검증을 통과해야 합니다.

```powershell
node .agents/skills/apmath-source-intake-pipeline/scripts/validate_source_intake.mjs `
  archive/exams/original/high/h1/1mid/<slug>.js
```

### 검증 항목
1. **VM 실행**: 문법 오류 및 구문 에러 없이 `window.examTitle`, `window.questionBank` 적재 여부
2. **문항 분모 일치**: PDF 원본의 총 문항 수와 일치
3. **객관식 선택지**: 모든 객관식 문항의 `choices` 길이가 정확히 5인지 검사
4. **공란 계약**: 전 문항 `answer === ""` 및 `solution === ""` 준수 여부
5. **에셋 무결성**: 문항에서 참조한 모든 `qXX.png` 파일이 디스크 상에 실제로 존재하는지 확인

---

## 8. 실행 요약 보고서 형식

작업 완료 시 사용자에게 다음 지표를 명확히 보고합니다:
- **JS 저장 경로**: `archive/exams/original/...`
- **총 문항 수**: `XX문항` (객관식 N, 서술형 M)
- **객관식 보기 수**: `N * 5 = 총 N*5개`
- **추출 이미지 수**: `K개` (`archive/assets/images/...`)
- **Source Parity 결과**: `PASS` (원문 대조 100% 일치)
- **검증 결과**: `validate_source_intake.mjs` 결과 `PASS`
- **작업 소요시간**: 소요 시간
