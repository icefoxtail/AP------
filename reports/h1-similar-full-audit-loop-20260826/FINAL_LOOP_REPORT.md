# 고1 2학기 유사문항 8개 전수 검수 — 단계 게이트 최종 보고

검수일: 2026-08-26  
대상: 고1 2학기 중간·기말 유사 JS 8개 / 총 178문항  
원칙: 한 단계가 PASS가 아니면 다음 단계의 PASS로 승격하지 않음.  
수정: **JS·에셋·DB·question-index 모두 수정하지 않음.**

## 최종 판정

**FAIL + BLOCKED — 외부 배포·업로드 불가.**

수학 성립 불가 1문항, 데이터 규칙 위반 3문항, 원본 문항별 대조 BLOCKED 178문항, 독립 난이도 재판정 BLOCKED, DB/index 미등록이 남아 있다. 따라서 렌더가 된다는 이유로 완료/PASS로 보고하지 않는다.

## 읽고 적용한 지시서

- `docs/rules/JS아카이브_1차검수_프로토콜.md`
- `docs/rules/JS아카이브_2차검수_프로토콜.md`
- `docs/rules/JS아카이브_3차검수_프로토콜.md`
- `docs/rules/수학_문항오류_검증_프로토콜_v2.1.md`
- `docs/rules/무결성검수.md`
- `docs/rules/해설프로토콜.md`
- `apmath-archive-exams/SKILL.md` 및 `references/archive-layout.md`
- 유사문항 생성 규칙·생성문항 수정 계획표

## 단계별 루프 결과

### 0단계 — 범위·계획·원본 자료 확정

- 계획표 문항 수: 8개 합계 **178행**, 실제 JS 문항 수와 일치: **PASS**
- 대상 JS/원본 JS/에셋 경로 확인: **PASS**
- 2025 원본 PDF: **5개 발견·27페이지 렌더**, 3개 미확보
  - 발견: 순천고 2중간(5p), 금당고 2기말(3p), 순천고 2기말(6p), 제일고 2기말(8p), 효천고 2기말(5p)
  - 미확보: 금당고 2중간, 매산고 2중간, 팔마고 2기말
- 발견된 PDF도 텍스트 레이어가 전부 0자여서 OCR/추정으로 field PASS를 만들지 않음.

근거: [source-pdf-inventory.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/source-pdf-inventory.json), [stage2-source-compare.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage2-source-compare.json)

### 1차 — 구조·무결성 게이트

- JS 실행/스키마/ID/문항 수/선지·정답/이미지 경로 검사: **148 PASS / 27 WARN / 3 FAIL**
- FAIL 3건은 모두 raw 부등호가 choice 문자열에 남은 데이터 문제이며 아래 DATA-FAIL과 동일하다.
- `reviewStatus`·`solutionStatus`가 178문항 모두 `generated_pending`: **정식 검수상태 게이트 FAIL**

근거: [stage1-static-audit.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage1-static-audit.json)

### 2차 — 원본·문항별 대조 게이트

- source page 렌더: **PASS** (27페이지)
- 원본 page mapping: **113/178** 문항 연결
- content/choices/배점/조건의 원본 field-level 대조: **BLOCKED 178/178** (PDF 텍스트 레이어 없음)
- 유사문항 계획표 대조: **PASS 178/178**
- 시각자료 원본 page/crop provenance: **BLOCKED** (3개 시험지 원본 부재 + page/crop 좌표 증명 미완료)

근거: [stage2-source-compare.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage2-source-compare.json), 렌더 PNG는 `C:/Users/USER/Desktop/AP------/tmp/pdfs/h1-loop-20260826/`에 보관.

### 3차 — 독립 수학·해설·메타·에셋 게이트

#### 수학·정답·유일성

- **177 PASS / 1 수학 FAIL / 3 DATA-FAIL**
- FAIL: `25_제일고_2학기_기말_고1_유사.js` q8
  - A 당첨 시 거짓 3명, B/C/D 당첨 시 각각 거짓 2명
  - “정확히 한 명만 거짓”을 만족하는 당첨자가 없어 현재 answer/solution을 도출할 수 없음
- DATA-FAIL:
  1. 순천고 기말 q1 choice 5: `$3^5<5^3$`
  2. 순천고 기말 q5 choice 2: `어떤 실수 $x$에 대하여 $x^2-4>0$이다.`
  3. 효천고 기말 q1 choice 3: `$x>3$`
  - 규칙상 raw `<`, `>` 대신 `\\lt`, `\\gt`가 필요함.

근거: [stage3-independent-math.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-independent-math.md)

#### 해설 품질

- 178/178 빈 해설·결론 번호 불일치·금지 운영문구·구조 누락: **PASS**
- 7문항에서 `식에 값을 대입하여`가 중복되는 문장 템플릿 신호 8회: **WARN**
- 이는 수학 FAIL은 아니지만 학생용 문장 품질 보강 대상으로 남김.

근거: [stage3-solution.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-solution.md), [stage3-solution.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-solution.json)

#### 메타데이터

- 표준과정·standardUnitKey·subUnit parent/label·questionType·tags 구조: **178/178 PASS**
- 난이도(level) 독립 재판정: **BLOCKED** (동일 흐름의 기계검사로 승격하지 않음)

근거: [stage3-metadata.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-metadata.json)

#### 에셋·크롭·실제 엔진 렌더

- 유사 에셋 21/21 존재·경로·decode: **PASS**
- SVG 19/19 XML parse, PNG 2/2 decode: **PASS**
- 시각 직접 품질: **13 PASS / 8 WARN / 0 definite clipping FAIL**
- WARN: 순천고 2중간 q18, 금당고 2기말 q16, 제일고 2기말 q12/q17, 팔마고 2기말 q5/q19, 효천고 2기말 q13 (경계 여백 재확인 필요)
- 원본 PDF/page/crop provenance: **BLOCKED**

근거: [stage3-assets.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-assets.md), [asset-manifest.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/asset-manifest.json)

### 4단계 — 최종 렌더 게이트

리뷰 엔진 `engine.html?mode=exam|sol|ans&qpp=4`를 새 탭에서 재실행했다.

- 8개 시험지 × 3모드 = **24/24 PASS**
- 시험지·해설지·정답표 문항 수 일치
- 이미지 decode 정상, page errors 0, horizontal overflow 0

근거: [stage3-browser.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-browser.json)

### 최종 카탈로그 게이트

- DB 현재 454건, question-index 10,690건
- 대상 8개 유사 JS의 DB record: **0/8**, index 등록: **0/8**
- audit-only 범위라 DB/index를 임의 수정하지 않음.

근거: [catalog-gate.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/catalog-gate.json)

## 시험지별 최종 상태

| 시험지 | 문항 | 독립 수학 | 데이터 FAIL | 시각 에셋 | 원본 대조 | 최종 |
|---|---:|---:|---|---|---|---|
| 금당고 2중간 | 22 | 22/22 | 없음 | q14 PASS | PDF 미확보 | BLOCKED |
| 매산고 2중간 | 20 | 20/20 | 없음 | q10 PASS | PDF 미확보 | BLOCKED |
| 순천고 2중간 | 23 | 23/23 | 없음 | q11 PASS, q18 WARN | 5p 렌더·field BLOCKED | BLOCKED |
| 금당고 2기말 | 22 | 22/22 | 없음 | q6 PASS, q16 WARN | 3p 렌더·field BLOCKED | BLOCKED |
| 순천고 2기말 | 23 | 23/23 | q1/q5 | q4/q10/q13/q16 PASS | 6p 렌더·field BLOCKED | FAIL/BLOCKED |
| 제일고 2기말 | 22 | 21/22 (q8 FAIL) | 없음 | q10 PASS, q12/q17 WARN | 8p 렌더·field BLOCKED | FAIL/BLOCKED |
| 팔마고 2기말 | 23 | 23/23 | 없음 | q1/q2/q3/q18 PASS, q5/q19 WARN | PDF 미확보 | BLOCKED |
| 효천고 2기말 | 23 | 23/23 | q1 | q13 WARN, q17 PASS | 5p 렌더·field BLOCKED | FAIL/BLOCKED |

## 해시·변경 여부

8개 JS의 재검산 시점 SHA-256은 [stage3-independent-math.md](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage3-independent-math.md)와 [stage1-hashes.json](C:/Users/USER/Desktop/AP------/reports/h1-similar-full-audit-loop-20260826/stage1-hashes.json)에 기록되어 있으며 재확인 값과 일치한다. 이번 루프에서 JS/에셋/DB/index는 수정하지 않았다.

## 재작업을 열 수 있는 조건

1. 제일고 기말 q8을 문항 성립 조건부터 수정하고 재검산
2. 3개 raw 부등호를 규칙에 맞게 수정
3. 누락된 3개 원본 PDF/page 확보 및 178문항 원본 대조표 작성
4. PDF가 이미지형인 5개도 OCR 추정이 아닌 사람이 page 이미지와 content/choices/조건/배점을 문항별 대조
5. 21개 에셋의 원본 page/crop 좌표 provenance와 8개 WARN 여백 재확인
6. level 독립 재판정 및 해설 WARN 문장 보강
7. 배포를 결정한 뒤에만 DB/question-index 등록과 등록 후 재렌더

현재 조건에서는 **최종 PASS로 보고할 수 없다.**
