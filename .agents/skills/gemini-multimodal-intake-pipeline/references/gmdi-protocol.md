# Gemini Multimodal Direct Intake (GMDI) Protocol

## 1. 개요 및 설계 철학
기존의 기계적 OCR(Tesseract, Windows WinRT, Cloud OCR) 및 문자열 슬라이싱 방식은 한국 고교 수학 기출시험지에서 다음과 같은 고질적 문제를 야기합니다:
- **수식 환각 및 왜곡**: 분수, 거듭제곱근($\sqrt[3]{\sqrt{64}}$), 삼각함수, 집합 기호, 지수 표기 등에서 오인식 발생
- **칼럼 경계 텍스트 손실**: 2단 시험지 물리적 슬라이스 시 단 중앙 여백에서 발문 머리글자(예: "아래", "부채꼴") 잘림 발생
- **도형과 발문 혼선**: 다이어그램 레이블과 발문 텍스트가 뒤섞여 수동 교정에 막대한 시간 소모
- **정답지 오인식**: 파일명만으로는 구분하기 어려운 손글씨 풀이지/수기 정답지를 문제지로 오인하여 불필요한 작업 착수
- **에셋 배경 노이즈 방치**: 스캔된 종이의 회색 음영, 얼룩, 풀이 낙서가 에셋 이미지에 그대로 남아 뷰어 조판 품질 저하

**GMDI(Gemini Multimodal Direct Intake)**는 Antigravity Gemini의 **네이티브 시각 지능(Direct Full-Page Multimodal Vision)**을 활용하여 이 문제를 근본적으로 해결합니다:
1. 300 DPI 고해상도 전체 페이지를 있는 그대로 직접 시각 조망 (`view_file`)
2. 2단 배치를 사람처럼 자연스럽게 문맥 단위로 인식 (단 분할에 따른 테두리 잘림 0%)
3. 수식, 단서 조항 `(단, ...)`, 배점 `[4.2점]`, 5지선다 보기를 표준 KaTeX 문법으로 100% 무손실 전사
4. **배경 스캔 노이즈 및 회색 음영의 순백색(#FFFFFF) 완전 제거 및 외부 필기/낙서 보정**
5. 정답(`answer: ""`) 및 해설(`solution: ""`은 엄격히 공란으로 유지하고 Node.js VM 검증 통과

---

## 2. 에셋 품질 규격 (Image Quality Contract)

> **"크롭된 도형/그래프 PNG 이미지는 배경의 스캔 노이즈와 회색 음영을 순백색(#FFFFFF)으로 제거하고, 문제 원본과 무관한 외부 필기/낙서가 있다면 깨끗이 보정하여 저장할 것."**

1. **순백색(#FFFFFF) 배경 필수화**:
   - 스캔 원본의 종이 질감, 회색 배경, 그림자, 스캐너 센서 노이즈는 배경 임계화(Brightness Threshold $\ge 220$)를 통해 완전한 순백색(`RGB (255, 255, 255)`)으로 변환합니다.
   - 단, 그래프 선이나 기호 글자의 경계면(Anti-Aliasing)이 거칠어지지 않도록 대비 신장(Contrast Stretching)을 적용하여 선화의 선명도를 극대화합니다.
2. **외부 필기 및 불필요한 잔류물 소거 (`clean_masks`)**:
   - 학생 또는 채점자의 연필/볼펜 풀이 흔적, 낙서, 시험지 단 구분선, 옆 문항 발문 글자가 크롭 영역에 침범한 경우 `clean_masks`에 상대 좌표 `[x1, y1, x2, y2]`를 지정하여 순백색으로 깨끗이 소거합니다.
3. **무결성 시각 재검수**:
   - 크롭 후 반드시 `view_file`을 통해 이미지를 직접 열람하고, 주요 그래프 요소나 좌표축 화살표가 훼손되지 않았는지 최종 확인합니다.

---

## 3. 세부 실행 프로토콜 (5-Step Pipeline)

### Step 1: 300 DPI 고해상도 래스터화
- 원본 PDF를 PyMuPDF(`fitz`)로 300 DPI(약 2481x3508 A4 픽셀) PNG로 변환
- 실행 스크립트: `python scripts/render_pages_300dpi.py <pdf-path> --out-dir <temp-dir>`

### Step 2: 네이티브 전체 페이지 시각 실사
- `view_file` 도구로 각 페이지(`page_01.png`, `page_02.png`, ...)를 전체 열람
- **실사 체크리스트**:
  1. **원문 시험지 여부 확인**: 수기 손글씨 풀이/정답지인 경우 즉시 감지하여 인테이크 제외
  2. **문항 분모 파악**: 시험지 상단 "출제 문항 안내" 확인 (예: 총 21문항 = 선택형 18문항 + 서답형 3문항)
  3. **에셋 대상 문항 식별**: 그래프, 부채꼴, 원, 삼각함수 파형 등 다이어그램이 있는 문항 번호 기록

### Step 3: 무손실 발문 & 보기 전사
- 문항별 원문 100% 일치(Parity) 전사:
  - 인라인 수식: `$수식$`
  - 블록 수식: `$$수식$$`
  - 표준 KaTeX 문법: `\dfrac{a}{b}`, `\sqrt[n]{x}`, `\log_{a}b`, `\sin\theta`, `\mathrm{P, Q}` 등
  - 객관식 보기: 5개 문자열 배열 `choices: ["...", "...", "...", "...", "..."]`
  - 서술형 문항: `choices: []`
  - **불변 원칙**: `answer: ""` 및 `solution: ""`는 반드시 빈 문자열

### Step 4: 정밀 다이어그램 크롭 & 순백색 보정 & 시각 검수
- Gemini가 시각적으로 파악한 픽셀 바운딩 박스 및 소거 영역(`clean_masks`)을 스펙 파일로 전달
- 실행 스크립트: `python scripts/crop_diagrams.py --spec <spec.json> --dest-dir archive/assets/images/<slug>`
- 배경의 스캔 노이즈/회색 음영이 순백색(#FFFFFF)으로 소거되고 외부 낙서가 제거되었는지 `view_file`로 검수

### Step 5: 3원 아티팩트 조립 및 VM 자동 검증
- 실행 스크립트: `python scripts/build_source_artifacts.py`
  1. 프로덕션 원본: `archive/exams/original/high/<grade>/<term>/<slug>.js`
  2. 생성물 미러: `archive/_generated/source-only/<batch>/<slug>.js`
  3. 증거 JSON: `archive/analysis/source-only-<batch>/<slug>.evidence.json`
- 실행 스크립트: `node scripts/validate_intake.mjs <target.js>`
  - 구문 적재, 5선택지 길이, 공란 계약, 순백색 에셋 파일 존재 전수 검증 (`PASS`)
