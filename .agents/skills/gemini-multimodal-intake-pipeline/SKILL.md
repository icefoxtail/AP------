---
name: gemini-multimodal-intake-pipeline
description: Gemini-dedicated multimodal high-speed exam intake pipeline. Inspects 300 DPI PDF pages directly via Gemini multimodal vision, transcribes LaTeX questions and choices with 100% parity, extracts pure-white (#FFFFFF) diagram assets with scribble removal, and outputs validated Source-Only JS artifacts with blank answers and solutions.
---

# Gemini Multimodal Direct Exam Intake (GMDI)

이 스킬은 Antigravity Gemini의 **네이티브 멀티모달 시각 지능(Direct Multimodal Vision)**을 활용하여 원본 시험지(PDF)를 100% 무손실로 전사하고 에셋을 크롭하여 **Source-Only**(발문/보기 전사, 순백색 다이어그램 크롭, 스켈레톤 태그, 정답/해설 공란) 규격의 JS 및 증거 아티팩트를 초고속으로 제작하는 **Gemini 전용 파이프라인**입니다.

---

## 1. 핵심 품질 원칙 (Core Quality Principles)

1. **무손실 발문 & 보기 전사 (Zero-Hallucination Parity)**:
   - 원본 시험지의 발문, 지문, 박스(`<보기>`), 5개 선택지를 누락 없이 KaTeX $\LaTeX$ 수식으로 100% 정밀 전사합니다.
   - `answer: ""`와 `solution: ""`은 반드시 빈 문자열(공란)로 유지합니다.
2. **에셋 정제 및 순백색(#FFFFFF) 보정 원칙 (Strict Diagram Quality)**:
   > **"크롭된 도형/그래프 PNG 이미지는 배경의 스캔 노이즈와 회색 음영을 순백색(#FFFFFF)으로 제거하고, 문제 원본과 무관한 외부 필기/낙서가 있다면 깨끗이 보정하여 저장할 것."**
   - 스캔된 시험지 특유의 누런/회색 종이 배경, 스캐너 음영, 회색 노이즈는 배경 임계화 및 대비 신장을 통해 **완전한 순백색(`#FFFFFF`, RGB 255, 255, 255)**으로 자동 처리합니다.
   - 그래프 선, 축, 수식, 기호 등의 안티앨리어싱 선화는 선명한 흑색/진회색으로 보존합니다.
   - 문제 풀이 연필 자국, 손글씨 낙서, 칼럼 경계선 및 인접 발문 글자 잘림 조각은 `clean_masks`로 완벽히 소거하여 깨끗한 상태로 저장합니다.
3. **네이티브 시각 실사 우선 (Visual Verification First)**:
   - 기계적 OCR 분할 대신 300 DPI 전체 페이지를 직접 조망하여 문항 분모와 시험지 진위를 파악합니다.
   - 손글씨 정답지/해설지나 비정상 파일은 발문 착수 전 즉시 식별하여 격리·제외합니다.

---

## 2. GMDI vs 전통적 OCR 파이프라인 비교 우위

| 비교 항목 | 전통적 스크립트/OCR 파이프라인 | Gemini 전용 GMDI 파이프라인 |
| :--- | :--- | :--- |
| **칼럼 분할 방식** | 물리적 2단 슬라이스 (중앙 여백 글자 잘림 위험) | **전체 페이지 조망** (시각적 2단 자연 인지, 잘림 0%) |
| **수식 인식 정확도** | 거듭제곱근, 분수, 지수, 기호 오인식 빈번 | **100% 무손실 표준 KaTeX $\LaTeX$ 직접 전사** |
| **에셋 화질 & 배경** | 스캔 회색 음영/노이즈 그대로 저장됨 | **배경 스캔 노이즈 완전 제거 및 순백색(#FFFFFF) 보정** |
| **낙서/외부 필기** | 낙서나 칼럼 글자 조각이 이미지에 잔류 | **clean_masks로 외부 낙서/글자 잔류물 깨끗이 소거** |
| **비정상 파일 감지** | 파일명에만 의존하여 수기 정답지 오착수 발생 | **멀티모달 실사로 손글씨 풀이/정답지 즉각 식별 및 제외** |
| **시험지당 소요 시간** | 20~30분 이상 (오탈자/수식 수동 교정 포함) | **2~3분 내 전 문항 완결 및 검증 통과** |

---

## 3. 표준 5단계 작업 흐름 (5-Step Execution Workflow)

```text
[원본 PDF]
   │
   ▼ Step 1: 300 DPI 고속 래스터화 (render_pages_300dpi.py)
[page_01.png ~ page_04.png]
   │
   ▼ Step 2: 네이티브 전체 페이지 시각 실사 (view_file)
[실사 검증: 문제지 여부 확인, 문항 분모 파악, 에셋 대상 문항 식별]
   │
   ▼ Step 3: 무손실 발문 & 보기 전사 (Zero-Hallucination KaTeX)
[문항별 100% Parity 전사, 5선택지 배열화, answer/solution 공란 유지]
   │
   ▼ Step 4: 다이어그램 에셋 크롭 & 순백색 보정 (crop_diagrams.py)
[배경 음영 제거(#FFFFFF), 외부 낙서 소거, archive/assets/images/<slug>/qXX.png 저장]
   │
   ▼ Step 5: 3원 아티팩트 빌드 & VM 자동 검증 (build_source_artifacts.py & validate_intake.mjs)
[프로덕션 JS + 생성물 미러 JS + .evidence.json 빌드 및 PASS 검증]
```

---

## 4. 단계별 상세 실행 명령어

### Step 1: 300 DPI 렌더링
```powershell
python .agents/skills/gemini-multimodal-intake-pipeline/scripts/render_pages_300dpi.py `
  "<path-to-pdf>" `
  --out-dir ".tmp/<exam_tag>_rendered" `
  --dpi 300
```

### Step 2: 네이티브 시각 실사
- `view_file`을 사용하여 렌더링된 각 페이지 이미지(`.tmp/<exam_tag>_rendered/page_01.png` 등)를 순차적으로 열람합니다.
- **점검 사항**:
  - 수기 정답지/해설지 여부 확인 (발문이 없는 수기 풀이만 있는 경우 즉시 중단 및 제외)
  - 상단 "출제 문항 안내"에서 총 문항 수, 객관식 수, 서답형 수 분모 확정
  - 다이어그램/그래프가 포함된 문항 번호 목록 및 대략적 위치 기록

### Step 3: 무손실 발문 & 보기 전사
- 각 문항을 원문과 100% 동일하게 전사합니다.
- [규칙 참조: exam-js-contract.md](references/exam-js-contract.md)
- `content`: 인라인 수식 `$수식$`, 블록 수식 `$$수식$$`
- `choices`: 객관식은 5개 원소 배열 `["...", ...]`
- `answer`: 반드시 `""` (공란)
- `solution`: 반드시 `""` (공란)

### Step 4: 다이어그램 에셋 크롭 및 순백색(#FFFFFF) 보정
- 바운딩 박스 및 외부 낙서/글자 소거 영역(`clean_masks`)을 지정하는 JSON 스펙 작성:
  ```json
  [
    {
      "page": 1,
      "qid": 7,
      "box": [1610, 670, 2260, 1040]
    },
    {
      "page": 2,
      "qid": 13,
      "box": [1800, 1830, 2330, 2710],
      "clean_masks": [
        [0, 250, 45, 425],
        [0, 440, 50, 600]
      ]
    }
  ]
  ```
- 크롭 및 배경 순백색 정제 실행:
  ```powershell
  python .agents/skills/gemini-multimodal-intake-pipeline/scripts/crop_diagrams.py `
    --spec "<path-to-crop-spec.json>" `
    --pages-dir ".tmp/<exam_tag>_rendered" `
    --dest-dir "archive/assets/images/<slug>" `
    --bg-threshold 220 `
    --black-point 40
  ```
- 크롭된 `qXX.png` 파일들을 `view_file`로 열람하여:
  1. 배경이 완전한 순백색(#FFFFFF)인지
  2. 선화나 수식 글자가 끊김 없이 선명한지
  3. 문제 원본과 무관한 외부 필기/낙서/인접 글자가 깨끗이 제거되었는지 확인합니다.

### Step 5: 산출물 빌드 및 자동 검증
- 전사된 시험지 메타데이터 JSON을 작성한 뒤 빌드 스크립트 실행:
  ```powershell
  python .agents/skills/gemini-multimodal-intake-pipeline/scripts/build_source_artifacts.py `
    --data "<path-to-exam-data.json>" `
    --batch-tag "<batchTag>"
  ```
- 자동화 검증기 실행:
  ```powershell
  node .agents/skills/gemini-multimodal-intake-pipeline/scripts/validate_intake.mjs `
    "archive/exams/original/high/<grade>/<term>/<slug>.js" `
    --evidence "archive/analysis/source-only-<batchTag>/<slug>.evidence.json"
  ```
