# Stage 3 — 고1 2학기 유사 JS 독립 수학 검산

- 검산일: 2026-08-26
- 대상: 현재 작업본 유사 JS 8개, 178문항 전체
- 수정: 없음. JS·SVG·PNG를 수정하지 않음
- 검산 기준: answer와 solution을 먼저 신뢰하지 않고 발문·조건에서 실제 정답을 계산한 뒤 choices·answer·solution 결론과 대조

## 읽은 규칙과 적용 근거

다음 문서를 이번 Stage 3 시작 전에 완독했다.

1. `C:\Users\USER\Desktop\AP------\docs\rules\JS아카이브_2차검수_프로토콜.md`
   - 처음부터 마지막 문항까지 직접 풀이
   - 실제 정답을 먼저 산출한 뒤 answer·choices·solution과 대조
   - 객관식 5개 보기 전수 판정 및 정답 유일성 확인
   - 조건 부족·성립 불가·복수정답·정답 없음·도형 판단 불가를 FAIL
2. `C:\Users\USER\Desktop\AP------\docs\rules\수학_문항오류_검증_프로토콜_v2.1.md`
   - 모든 문항 독립 계산
   - answer만 보고 맞다고 판단하지 않음
   - 객관식 보기 5개 전수 검토
   - 수학 FAIL과 별도로 수식·solution·SVG·table·구조 DATA-FAIL 분리
3. `C:\Users\USER\Desktop\AP------\docs\rules\무결성검수.md`
   - 원문 무결성·수리 정합성·렌더링·구조·메타데이터를 분리 판정
   - 원문을 추정하지 않고, 실제 파일·이미지·PNG·SVG를 확인한 범위만 보고
   - 정오답 PASS라도 구조/데이터 FAIL이면 전체 사용 불가
4. `C:\Users\USER\.codex\skills\apmath-archive-exams\SKILL.md`
   - 모든 문항 독립 풀이, source page inventory, 시각자료 확인, source fidelity 없이는 완료 보고 금지
5. `C:\Users\USER\.codex\skills\apmath-archive-exams\references\archive-layout.md`
   - content는 원문 전사이며 조건·보기·도형 의존 사실을 보존해야 함
   - archive-relative image path와 source-page/asset 대조를 별도 게이트로 처리

## 검수 대상 파일 및 해시 증거

해시는 2026-08-26 재검산 직전에 `Get-FileHash -Algorithm SHA256`로 산출했다.

| 파일 | SHA-256 |
|---|---|
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2mid\25_금당고_2학기_중간_고1_유사.js` | `64c6b000eac5f17ab534b5e5539ecc66f9b484ed478c71b992d9db5e3330a5fb` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2mid\25_매산고_2학기_중간_고1_유사.js` | `c36ad0b965945d4dad523b18a0657bdd1ade84a3aec10a7f9c3eea386c77b236` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2mid\25_순천고_2학기_중간_고1_유사.js` | `7b2c19ecad62279320eefaedcb4b73f018879c491ec7381703f0c8cfd2591b26` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_금당고_2학기_기말_고1_유사.js` | `7e587dc321262c793aba58508a8a512eea48ae827a1f42178dc325129c4abafb` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_순천고_2학기_기말_고1_유사.js` | `f6d98a0cd2c72804da4b04b0dce49cf5669757953da05535f2d245c1b50e0f94` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_제일고_2학기_기말_고1_유사.js` | `c43977caab6ea60c562bf2436561743fbf346ce09181da24752d2f2b0758f241` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_팔마고_2학기_기말_고1_유사.js` | `1fa0da6d921ab933fdc8b2ede91389af1a49e4d0783d785c3c673f000bf73203` |
| `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_효천고_2학기_기말_고1_유사.js` | `075248716e6c97b3b82d17a8ca36fb99bc0430a6a50adf1617d21fc4b052d826` |

- 해시 원자료: `C:\Users\USER\Desktop\AP------\reports\h1-similar-full-audit-loop-20260826\stage1-hashes.json`
- 재실행: `Get-FileHash C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2mid\*.js`, `Get-FileHash C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\*.js`

## 원본 PDF inventory 상태

현재 Stage 2 inventory 증거는 다음 파일이다.

- `C:\Users\USER\Desktop\AP------\reports\h1-similar-full-audit-loop-20260826\source-pdf-inventory.json`
- `C:\Users\USER\Desktop\AP------\reports\h1-similar-full-audit-loop-20260826\stage2-source-compare.json`

| 상태 | 시험지 |
|---|---|
| PDF/렌더 페이지 available (5) | `D:\기출\(3)2중간\공통수학2\2025_순천고1_2중간.pdf` (5p), `D:\기출\(4)2기말\공통수학2\2025_금당고1_2기말.pdf` (3p), `D:\기출\(4)2기말\공통수학2\2025_순천고1_2기말.pdf` (6p), `D:\기출\(4)2기말\공통수학2\2025_제일고1_2기말.pdf` (8p), `D:\기출\(4)2기말\공통수학2\2025_효천고1_공통수학2_2기말.pdf` (5p) |
| PDF missing (3) | `25_금당고_2학기_중간_고1_유사.js`, `25_매산고_2학기_중간_고1_유사.js`, `25_팔마고_2학기_기말_고1_유사.js` |

Inventory 합계는 5 available / 3 missing / 렌더된 source page 27장이다. Stage 2 결과는 source page render PASS, 113/178 문항 page mapping, field-level comparison BLOCKED 178건이다. available PDF가 있어도 text layer가 없어 content·choices·배점·조건의 자동 field 비교 증거로 사용하지 않았다.

`archive/exams/original/**/*.js`는 PDF의 증거로 사용하지 않았다. original JS 존재는 별도 archive 파일 존재일 뿐, 원본 PDF 페이지 대조를 대체하지 않는다.

## Stage 3 결과 요약

| 시험지 | 총 문항 | 수학 PASS | 수학 FAIL | DATA-FAIL |
|---|---:|---:|---:|---:|
| 25_금당고 2학기 중간 고1 유사 | 22 | 22 | 0 | 0 |
| 25_매산고 2학기 중간 고1 유사 | 20 | 20 | 0 | 0 |
| 25_순천고 2학기 중간 고1 유사 | 23 | 23 | 0 | 0 |
| 25_금당고 2학기 기말 고1 유사 | 22 | 22 | 0 | 0 |
| 25_순천고 2학기 기말 고1 유사 | 23 | 23 | 0 | 2 |
| 25_제일고 2학기 기말 고1 유사 | 22 | 21 | 1 | 0 |
| 25_팔마고 2학기 기말 고1 유사 | 23 | 23 | 0 | 0 |
| 25_효천고 2학기 기말 고1 유사 | 23 | 23 | 0 | 1 |
| **합계** | **178** | **177** | **1** | **3** |

## FAIL 목록 — 수학·정오답

### `25_제일고_2학기_기말_고1_유사.js` q8

- 오류 유형: 발문 성립 불가 / 정답 없음
- 현재 answer: `①`
- 현재 solution 결론: `거짓말자는 A이다` 및 `①`
- 독립 계산:
  - 당첨자 A: 거짓 A·B·C = 3명
  - 당첨자 B: 거짓 B·D = 2명
  - 당첨자 C: 거짓 A·B = 2명
  - 당첨자 D: 거짓 A·D = 2명
- 어느 당첨자도 “정확히 한 명만 거짓”을 만족하지 않으므로 현재 answer와 solution을 도출할 수 없다.
- 판정: **FAIL**

파일: `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_제일고_2학기_기말_고1_유사.js`

## DATA-FAIL 목록 — 수식/문자열 규칙

수학 자체의 정답과 별개로, v2.1 데이터 규칙의 “choices 부등호는 raw `<`/`>`가 아닌 `\\lt`/`\\gt`” 위반을 178문항 전체에 대해 재검색했다.

1. `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_순천고_2학기_기말_고1_유사.js` q1 choice 5: `$3^5<5^3$`
2. `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_순천고_2학기_기말_고1_유사.js` q5 choice 2: `어떤 실수 $x$에 대하여 $x^2-4>0$이다.`
3. `C:\Users\USER\Desktop\AP------\archive\exams\similar\high\h1\2final\25_효천고_2학기_기말_고1_유사.js` q1 choice 3: `$x>3$`

그 외 재검색 항목(짝수 `$`, `\\text{}` 내부 한글, choices 번호 중복, SVG `<br>`/LaTeX, table 마커, id 순번)에서는 추가 DATA-FAIL을 찾지 못했다.

## 이전 결과의 stale-result 정정

이전 보고서 `C:\Users\USER\Desktop\AP------\reports\h1-similar-independent-math-audit-20260826.md`는 순천고 기말 q18을 FAIL로 기록했으나, 현재 파일의 발문을 다시 읽은 결과 해당 판정은 잘못되었다.

현재 q18 content에는 명시적으로 `$(x>2)$`가 있고 solution에도 `u>0`가 있다. 따라서 `u=x-2>0`, `v=1/u`, `u^2+v^2=11`에서 `u^2`의 양의 두 해 각각에 대해 양의 `u` 하나씩만 허용되어 교점은 정확히 2개다. 또한

`(u_1-u_2)^2=9` → 거리 `sqrt(2·9)=3sqrt(2)`

이므로 q18은 **PASS로 정정**한다. 이전 보고서의 “교점 4개”는 x>2 조건을 누락한 stale 결과다.

## 최종 게이트 판정

- 수학·정오답 Stage 3: **FAIL** — q8 1건
- 데이터 무결성 Stage 3: **DATA-FAIL** — 3건
- 원본 PDF inventory: **PARTIAL** — 5 available / 3 missing
- 원본 field-level 대조: **BLOCKED** — Stage 2 증거상 178건
- 전체 사용 가능: **불가**

이번 보고서는 FAIL/DATA-FAIL과 집계만 보고하며, 수정본 JS나 수정안을 포함하지 않는다.
