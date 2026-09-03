# CODEX_RESULT

## 최종 판정

**FINAL FAIL / HIGH1 FIRST SEMESTER NOT SEALED**

이번 라운드에서 production의 메타데이터·LaTeX·해설 포맷·question schema·index parity를 정리했지만, 원본 증거 없이 채울 수 없는 placeholder 2건과 전체 `sol/ans` 브라우저 매트릭스 미완료가 남아 최종 봉인 조건을 만족하지 못했다. 따라서 `FINAL PASS / HIGH1 FIRST SEMESTER SEALED`를 선언하지 않는다.

## 1. 기준과 범위

- 사용자 지정 기준 SHA: `d809f9f0f4da752fb421fc7d4bf74c2430a7c05`
- 작업 시작 시 공유 workspace HEAD: `894736d0c960ccdcc031bd44c08d8635d8e27a89`
- 현재 main HEAD: `11653efc07de31491ef2686b491d0cbc4e785349`
- 대상 디렉터리: `archive/exams/original/high/h1/1mid/`, `archive/exams/original/high/h1/1final/`
- 시험지: 56개 (`1mid` 22개, `1final` 34개)
- 문항: 1,230개 (`1mid` 483개, `1final` 747개)

현재 main이 사용자 지정 기준 SHA의 후손인 상태에서 공유 workspace의 다른 진행 커밋과 fast-forward 되었으므로, 기존 변경을 되돌리지 않고 최종 HEAD를 재감사했다.

## 2. 수정 파일 목록

### Production JS

- `archive/exams/original/high/h1/1mid/*.js` — 22개
- `archive/exams/original/high/h1/1final/*.js` — 34개

위 56개 파일에서 canonical label/course, questionType/choices 표현, 깨진 LaTeX 및 지정 문항 해설을 핀포인트 정리했다. 정상인 `content`, `choices`, `answer`, `image`는 원본 근거 없이 재작성하지 않았다.

### Index·도구·보고서

- `archive/question-index.js`
- `archive/question-index-report.md`
- `archive/question-index-audit.md`
- `archive/data/question_metadata.json`
- `archive/tools/finalize-h1-first-semester-quality.mjs`
- `CODEX_RESULT.md`

2026 기말의 ignored candidate 8개는 audit에서 production과의 stale hash가 검출되어 현재 production과 동기화했다. ignored 산출물이므로 커밋 대상에는 포함하지 않는다.

## 3. 수정 문항 목록

- `23_부영여고` 중간 q11: `H15-SA-03-FACTORIZATION / 인수분해`로 재분류
- `23_충무고` 중간 q9: `H15-SA-03-FACTORIZATION / 인수분해`로 재분류
- `24_여수고` 중간 q16: `H15-SA-03-FACTORIZATION / 인수분해`로 재분류
- `23_여천고` 중간 q13, q14, q15, q16, q17, q20, q22, q23: H15 수학(상) 이차함수 chain으로 재분류
- `23_충무고` 중간 q19: 주관식 schema를 `questionType: 서술형`, `choices: []`, `answer: 4`로 정규화
- `24_제일고` 중간 q20: 벡터·행렬식 없는 좌표평면/삼각형 넓이 풀이로 교체하고 정답 `$2\\sqrt{21}$` 유지
- `22_팔마고` 기말 q5: 법선벡터 없는 기울기·계수비 풀이로 교체
- `23_매산고` 중간 전체 해설: 20개 legacy `[Logical Anchor]` 문구와 기계적 메모체를 학생용 표현으로 정리
- `23_부영여고` 중간 전체 해설: 22개 legacy `[Logical Anchor]` 문구와 기계적 메모체를 학생용 표현으로 정리
- `23_한영고` 중간 q13, `25_제일고` 기말 q8, `25_효천고` 기말 q19, `26_광양제철고` 기말 q4: 불필요한 수열/등차수열 전면 용어를 자연스러운 고1 표현으로 교체
- 위 대상 외 56개 전체: master label/course와 questionType/choices schema를 문항별 현재 값 기준으로 정규화

최신 커밋 기준으로 `23_충무고` q17의 내접원 접선 길이·피타고라스·닮음 풀이, 정답 ②/69, 고1 과정 제한은 재수정하지 않았다.

## 4. 정규화 수치

- canonical `subUnit` label field update: 247건
  - label-only normalization: 236건
  - 실제 key 재분류 및 여천고 H15 chain 반영: 11건
- `standardCourse` update: 186건
  - 전체 H15 parent course normalization: 178건
  - 여천고 지정 8문항: 8건
- 지정 분류 문항의 `standardUnitKey/subUnitKey/subUnit/confidence/depth` update: 11건
- questionType update: 390건
- 공백 선택지 배열 `[' ', ...] → []`: 16건
- 객관식 answer index 표기 `1..5 → ①..⑤`: 여천고 18건
- 충무고 q19 schema answer `④ → 4`: 1건
- 깨진 LaTeX source repair: 현재 source scan hit 0건
- `[Logical Anchor]` 제거: 38건 (매산고 19건, 부영여고 19건)
- 지정 수열 용어 제거/교체: 4문항

## 5. q19 source evidence

별도 PDF/PNG/HWP 원본은 다음 경로들에서 발견하지 못했다.

- `archive/` 전체 재귀 검색: 충무고 별도 source asset 0건
- `C:\Users\USER\Desktop\시험지들` 재귀 검색: 충무고 원본 scan 0건

대신 다음 historical production transcription을 source evidence로 사용했다.

- Git object: `ab9d9d2901a399fefa57a8fb54653ece8a354a5a`
- 경로: `archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js`
- evidence: q19 content가 `서술형 1.`로 시작하고 `choices: []`이며, 현재 해설이 복소수 실수부·허수부 비교로 `x+y=4`를 독립 계산한다.

따라서 객관식 선택지로 임의 복원하지 않고, historical transcription이 명시하는 서술형 schema와 계산값 `4`만 반영했다. 별도 원본 scan 부재는 미해결 source limitation으로 남긴다.

## 6. 정적 Gate 결과

- 56개 production JS `node --check`: **PASS**
- load: 56/56, 1,230/1,230: **PASS**
- solution 공란: 0: **PASS**
- canonical subUnit key/label/parent audit: 0 issue: **PASS**
- standardCourse chain audit: 0 issue: **PASS**
- questionType/choices/answer structural audit: 0 issue: **PASS**
- duplicate qKey: 0: **PASS**
- undefined/non-object skip: 0: **PASS**
- source malformed `\\n eq`, `\\n e`, `\\ tf`: 0: **PASS**
- runtime malformed LaTeX / dollar-pair audit: 0: **PASS**
- `[Logical Anchor]`: 0: **PASS**
- 고1 금지 풀이 표현(벡터/행렬식/법선벡터): 0: **PASS**
- 수열 용어 지정 문항: 0: **PASS**
- `git diff --check`: **PASS**
- placeholder scan: **FAIL**, 아래 2건

남은 placeholder:

1. `archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js` q11 content의 `[그래프필요]` — 발문이 실제 그림의 절편 정보를 참조하고 별도 원본 image가 없어 추정 복원하지 않았다.
2. `archive/exams/original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js` q12 choice 1의 `[판독불가]` — 원본 evidence 없이 선택지 값을 발명하지 않았다.

## 7. Index parity 결과

공식 도구 `node archive/tools/build-question-index.mjs` 실행 결과:

- DB exam records in scope: 56
- DB qCount sum: 1,230
- index records in scope: 1,230
- source JS qCount sum: 1,230
- per-exam DB/JS/index qCount mismatch: 0
- final index duplicate qKey: 0
- undefined/non-object skip: 0
- index builder load failures: 0

공식 archive audit `audit_archive_batch.mjs` 56개 실행 결과는 `ok: true`, 56개 모두 `errors: []`다. 전체 저장소 index report의 비공식 key 152건은 이번 H1 first-semester 범위 밖의 기존 records이며, H1 범위 canonical audit는 0 issue다.

## 8. 실제 render 결과

로컬 `python -m http.server 4173`에서 `archive/engine.html`을 실제 로드했다.

- exam mode: 56/56 시험지, 1,230문항
  - q-box count match: PASS
  - MathJax generated: PASS
  - broken image: 0
  - horizontal overflow: 0
  - load-error text: 0
  - console error: 0
- solution mode 직접 확인:
  - `23_매산고` 전체 20/20: PASS
  - `23_부영여고` 전체 22/22: PASS
  - `24_한영고` 전체 21/21: PASS
  - `24_제일고` q20 hard fix: PASS
  - `22_팔마고` q5 hard fix: PASS
  - 위 화면에서 `neq`, `dfrac`, `sqrt`, solution image, overflow, literal command 노출 없음 확인
- answer mode: 전체 56개 페이지 매트릭스는 브라우저 자동화 제한 시간으로 완료하지 못함: **INCOMPLETE**

따라서 actual render gate는 exam/주요 solution PASS이지만 전체 `sol/ans` matrix 기준으로는 **FAIL**이다.

## 9. 커밋/배포 상태

공유 workspace에서 다음 기존 커밋이 자동으로 main에 반영되었다.

- `a93cd5c2` — `fix(archive): reopen and reseal high1 geometry review`
- `185a440f` — `chore(archive): persist H1 quality tooling and temp safeguards`
- `11653efc` — `docs(archive): refresh geometry evidence after main merge`

현재 `main`과 `origin/main`은 `11653efc`에서 일치하고 working tree도 clean이다. 이번 결과는 위 상태를 재감사해 기록한 것이며, placeholder 및 전체 answer-mode 미완료 상태에서 별도의 `fix(archive): seal high1 first-semester quality gates` 커밋을 새로 만들거나 `FINAL PASS`로 push하지 않았다.

## 10. 미해결 항목 및 다음 조치

- 충무고 q19 별도 원본 PDF/이미지 확보 후 historical transcription과 대조
- 24 한영고 q11 원본 그래프 image 확보 후 content/image evidence 확정
- 25 효천고 중간 q12 choice 1 원본 scan 확보 후 선택지 복원 여부 판정
- 위 source-dependent 항목 해결 후 56개 exam/sol/ans 전체 브라우저 matrix를 다시 실행
- 모든 Gate가 PASS일 때에만 단일 seal commit과 최종 `FINAL PASS / HIGH1 FIRST SEMESTER SEALED` 판정을 수행
