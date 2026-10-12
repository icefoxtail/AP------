---
name: apmath-source-intake-batch
description: Execute 7-exam batch Source-Only intake from D: drive past exam PDFs (D:\기출). Strictly follows student order (Grade 3 1mid->1final->2mid->2final, then Grade 2 1mid->1final->2mid->2final). Enforces 100% KaTeX typesetting, choices, white-normalized diagram assets, total score 100.0, answer and solution empty strings.
---

# APMath Source-Only Batch Intake Pipeline (7-Exam Unit)

이 스킬은 `D:\기출` 내 중등 수학 기출 시험지 PDF를 **7개 학교 단위(1개 배치)**로 분할하여, 새 창(Fresh session)에서도 동일한 최고 품질로 신속하게 인테이크를 완수하도록 설계된 공식 파이프라인입니다.

---

## 🎯 핵심 계약 규정 (Source-Only Intake Contract)

1. **완전한 Source-Only 유지**:
   - 학생 풀이, 낙서, 샤프 자국, 오답 체크는 100% 배제하고 **활자 인쇄 원문**만 조판합니다.
   - `answer: ""` 및 `solution: ""`은 반드시 **빈 문자열**을 유지합니다 (정답지는 사용하지 않습니다).
2. **KaTeX 수식 조판 & 원문 일치**:
   - 거듭제곱근 지수, 부등호($\le, <$), 절댓값, 단서 조항, 구간별 정의 함수, 분수식을 원문 그대로 100% 완벽하게 조판합니다.
3. **선지 및 배점 형식**:
   - 객관식은 정확히 5개 선지(`choices: [...]`), 주관식/서술형/단답형은 `choices: []`로 작성합니다.
   - 모든 문항의 배점 합계는 **반드시 정확히 100.0점**이어야 합니다.
4. **도형 에셋 정밀 정규화**:
   - 발문 내 그래프/도형/지도는 문제 번호 및 선지를 제외하고 타이트하게 크롭합니다.
   - 스캔 음영 및 노이즈를 제거하여 순수 흰색(`#FFFFFF`, 255, 255, 255) 배경으로 정규화합니다.
   - 저장 위치: `C:\Users\USER\Downloads\스캔_인테이크_산출물\<시험지명>\assets\images\<시험지명>\qXX.png`
5. **산출물 형식**:
   - 파일 경로: `C:\Users\USER\Downloads\스캔_인테이크_산출물\<시험지명>\<시험지명>.js`
   - 표준 구조:
     ```javascript
     window.examData = {
       title: "<시험지명>",
       totalScore: 100.0,
       questions: [
         {
           "id": 1,
           "score": 3.5,
           "question": "발문...",
           "choices": ["선지1", "선지2", "선지3", "선지4", "선지5"],
           "answer": "",
           "solution": ""
         }, ...
       ]
     };
     ```
6. **검증 게이트**:
   - 생성 즉시 `node .agents/skills/apmath-source-intake-batch/scripts/validate_batch.cjs <산출물폴더>`를 실행하여 배점 합계 100.0점 및 문법 무오류(PASS)를 확인해야 완료로 인정됩니다.

---

## 📋 배치 편성표 (Roster Reference)

전체 배치 데이터는 `.agents/skills/apmath-source-intake-batch/roster.json`에 정의되어 있습니다.

### 진행 순서 (사용자 지정 엄수):
- **1단계: 중3 (총 11개 배치, Batch 01 ~ Batch 11)**
  - 1학기 중간 (`1중간`) → 1학기 기말 (`1기말`) → 2학기 중간 (`2중간`) → 2학기 기말 (`2기말`)
- **2단계: 중2 (총 12개 배치, Batch 12 ~ Batch 23)**
  - 1학기 중간 (`1중간`) → 1학기 기말 (`1기말`) → 2학기 중간 (`2중간`) → 2학기 기말 (`2기말`)

---

## ⚙️ 실행 절차 (Step-by-Step Execution)

사용자가 **`Batch XX 진행해 줘`**라고 지시하면 다음 절차를 즉시 수행합니다:

### Step 1: 배치 대상 확인
`.agents/skills/apmath-source-intake-batch/roster.json`에서 해당 `batch_id`의 7개 시험지 정보(연도, 학교명, 학년, 학기, `pdf_abs_path`, `target_id`)를 로드합니다.

### Step 2: 7개 시험지 순차 처리
각 시험지마다 다음을 실행합니다:
1. **PDF 페이지 렌더링**:
   ```powershell
   python .agents/skills/apmath-source-intake-batch/scripts/render_pdf.py --pdf "<pdf_abs_path>" --out ".tmp/<batch_id>/<target_id>/pages"
   ```
2. **페이지 OCR 및 문항 분할**:
   - `.codex/skills/apmath-archive-exams/scripts/windows-ocr.ps1`을 활용하여 텍스트 및 단어 좌표 추출.
3. **도형 에셋 크롭 및 정규화**:
   - 도형이 있는 문항은 크롭 후 정규화 스크립트 실행:
   ```powershell
   python .agents/skills/apmath-source-intake-batch/scripts/clean_asset.py --src "<crop_path>" --dst "C:\Users\USER\Downloads\스캔_인테이크_산출물\<target_id>\assets\images\<target_id>\qXX.png"
   ```
4. **JS 파일 작성**:
   - `C:\Users\USER\Downloads\스캔_인테이크_산출물\<target_id>\<target_id>.js` 생성.
   - 배점 합계가 정확히 100.0점인지 확인.

### Step 3: 배치 종합 검증 (Node VM)
7개 시험지 생성이 끝나면 일괄 검증을 수행합니다:
```powershell
node .agents/skills/apmath-source-intake-batch/scripts/validate_batch.cjs "C:\Users\USER\Downloads\스캔_인테이크_산출물\<target_id>"
```

### Step 4: 완료 보고
7개 시험지 각각의 문항 수, 배점 합계(100.0점), 추출 에셋 수, 검증 PASS 여부를 깔끔한 테이블 형태로 사용자에게 보고합니다.
