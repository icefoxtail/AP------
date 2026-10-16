---
name: apmath-source-intake-batch
description: Execute 7-exam batch Source-Only intake from D: drive past exam PDFs (D:\기출). Strictly follows student order (Grade 3 1mid->1final->2mid->2final, then Grade 2 1mid->1final->2mid->2final). Enforces 3-step double-check pipeline (KaTeX transcription parity, choices validation, and 16px white asset margin audit), blank answers and solutions.
---

# APMath Source-Only Batch Intake Pipeline (7-Exam Unit)

이 스킬은 `D:\기출` 내 중등 수학 기출 시험지 PDF를 **7개 학교 단위(1개 배치)**로 분할하여, 3단계 더블 체크 품질 보증 체계로 신속하고 무손실하게 인테이크를 완수하도록 설계된 공식 파이프라인입니다.

---

## 🎯 3단계 더블 체크 핵심 품질 계약 (3-Step Double-Check Contract)

1. **Step 1: 발문 2차 원문대조 전사 (Zero-Hallucination KaTeX Transcription)**:
   - 원본 시험지의 발문, 조건식, 수식, 지문, 박스(`<보기>`)를 KaTeX $\LaTeX$ 수식으로 100% 무손실 정밀 전사합니다.
   - 학생 풀이, 낙서, 샤프 자국, 오답 체크는 100% 배제하고 활자 인쇄 원문만 조판합니다.
   - `answer: ""` 및 `solution: ""`은 반드시 **빈 문자열**을 유지합니다 (정답지는 인테이크 단계에서 조판하지 않습니다).
   - 점수제/배점 합산 제약은 배제하며, 오직 발문·보기·에셋 품질에 집중합니다.

2. **Step 2: 선지 및 유형 정합성 검증 (Choices & Schema Integrity)**:
   - **객관식**: 정확히 5개의 유효한 선지 배열(`choices: ["...", "...", "...", "...", "..."]`), 각 선지의 수식 달러($) 짝 일치 및 공백 선지 0건 보장.
   - **주관식/서술형/단답형**: 빈 배열(`choices: []`), 원문 배점 표기 유지.

3. **Step 3: 에셋 정밀 정규화 및 여백 무결성 게이트 (16px White Margin & Pure #FFFFFF Asset)**:
   - 문항 내 모든 도형, 그래프, 좌표평면 모눈, 삽화는 원본 PDF에서 정밀 크롭합니다.
   - 스캔 회색 음영, 스캐너 노이즈를 제거하여 순수 흰색(`#FFFFFF`, 255, 255, 255) 배경으로 정규화합니다.
   - 인접 문항의 텍스트 잘림 조각, 문제 번호, 칼럼 구분선 및 손글씨/채점 적색 낙서는 `clean_masks` 및 색상 필터링으로 완벽 소거합니다.
   - 에셋 외곽에 **16px 순백색 여백(`--padding 16`)**을 의무 적용하여 `audit_asset.py` 검증(외곽 3px 순백색 마진 게이트)을 100% 통과해야 합니다.

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

### Step 1: 배치 대상 확인
`.agents/skills/apmath-source-intake-batch/roster.json`에서 해당 `batch_id`의 7개 시험지 정보를 로드합니다.

### Step 2: 7개 시험지 순차 처리
1. **PDF 렌더링 (300 DPI 권장)**:
   ```powershell
   python .agents/skills/apmath-source-intake-batch/scripts/render_pdf.py --pdf "<pdf_abs_path>" --out ".tmp/<batch_id>/<target_id>/pages_300" --dpi 300
   ```
2. **도형 에셋 크롭 및 정규화**:
   ```powershell
   python .agents/skills/apmath-source-intake-batch/scripts/clean_asset.py --src "<raw_crop.png>" --dst "스캔_인테이크_산출물/<target_id>/assets/<name>.png" --padding 16 --thresh 215
   python .agents/skills/apmath-source-intake-batch/scripts/audit_asset.py "스캔_인테이크_산출물/<target_id>/assets/<name>.png"
   ```
3. **JS 파일 작성**:
   - `스캔_인테이크_산출물/<target_id>/<target_id>.js` 생성.
   - `C:\Users\USER\Downloads\스캔_인테이크_산출물`과 작업 공간 양방향 동기화.

### Step 3: 배치 종합 전수 검증 (Node VM & Asset Margin Gate)
```powershell
node .agents/skills/apmath-source-intake-batch/scripts/validate_batch.cjs "스캔_인테이크_산출물/<target_id>/<target_id>.js"
```

### Step 4: 원장, 로스터 갱신 및 구글 드라이브 동기화
- `.agents/skills/apmath-source-intake-batch/roster.json`의 해당 배치 `items`에 `done: true` 반영.
- `middle_exams_unworked_ledger.md`에 완료 표기 및 완료 현황 섹션 추가.
- `G:\내 드라이브\중등수학_스캔인테이크_작업물/<target_id>` 경로로 해당 시험지 폴더를 복사하여 구글 드라이브 동기화 완결.

### Step 5: 문항별 상세 보고
- 7개 시험지의 전 문항에 대해 발문 KaTeX, 객관식 5선지/주관식, 에셋 여백 PASS 상태를 문항별(Q01~QXX)로 상세 보고합니다.
