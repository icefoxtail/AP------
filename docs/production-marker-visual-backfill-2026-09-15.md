# JS아카이브 production 마커 문항 한정 보강 결과 보고서

작성일: 2026-09-15 (Asia/Seoul)
브랜치: codex/marker-visual-backfill
최신 baseline: 027357a703066b1301e50327e766d230ffce8b62

## 분모와 최종 판정

초기 분모는 archive/exams/original production JS 발문 content에 실제
[도형필요] 또는 [그래프필요]가 있던 6문항으로 고정했다.

- 초기 [도형필요]: 5
- 초기 [그래프필요]: 1
- 초기 총합: 6
- PASS_APPLY: 6
- HOLD: 0
- 잔여 marker: 0개

21_연향중 q11/q14의 기존 PASS_APPLY 결과와 자산은 보존했다. similar,
types, marker 없는 문항 및 unrelated 파일은 수정하지 않았다.

## 문항별 결과

| 파일 | q | marker | 조치 | 근거 및 결과 | 최종 |
|---|---:|---|---|---|---|
| archive/exams/original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js | 11 | [도형필요] | ADD_PNG, q11.png 연결, marker 제거 | 2021 연향중 PDF p.2의 세 정사각형 원본 크롭. desktop/mobile exam에서 표시·decode·가독성 PASS. 같은 시험지 solution/answer도 24문항/24답 PASS. | PASS_APPLY |
| archive/exams/original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js | 14 | [도형필요] | ADD_PNG, q14.png 연결, marker 제거 | 같은 PDF p.2의 직육면체 원본 크롭. desktop/mobile exam에서 표시·decode·가독성 PASS. 같은 시험지 solution/answer도 24문항/24답 PASS. | PASS_APPLY |
| archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js | 4 | [도형필요] | ADD_SVG, q4.svg 연결, marker 제거 | 전체 24문항 파일은 baseline과 candidate가 모두 MATH_TYPESET_INCOMPLETE. q4-only baseline과 candidate는 같은 engine에서 q-box 1개 PASS. candidate SVG는 960×440 decode, 실제 화면에서 잘림 없음. 전체 오류는 q4 변경과 무관한 선행 결함. | PASS_APPLY with PRE_EXISTING_FULL_EXAM_RENDER_FAILURE |
| archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js | 11 | [그래프필요] | ADD_SVG, q11.svg 연결, marker 제거 | 기존 solutionImage의 수학 fact를 사용해 문제용 graph를 별도 생성. visible text는 축·눈금·최대/최소 좌표만 남겼고 완성 함수식, midline, a/b/c/d, 풀이 annotation 및 metadata leak를 제거. 기존 solutionImage는 유지. desktop/mobile exam·solution·answer 모두 21문항/21답 PASS. | PASS_APPLY |
| archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js | 18 | [도형필요] | ADD_SVG, q18.svg 연결, marker 제거 | 기존 solutionImage의 공통 중심 O, 공통 두 반직선, sector-annulus fact를 사용해 문제용 geometry를 별도 생성. visible text는 O/A/B/C/D만 남겼고 π/3 또는 θ=π/3은 표시하지 않았다. q18 발문 길움을 → 길이로 최소 교정. 기존 solutionImage는 유지. desktop/mobile exam·solution·answer 모두 21문항/21답 PASS. | PASS_APPLY |
| archive/exams/original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js | 11 | [도형필요] | REMOVE_FROM_PRINT_BANK, q11 객체 삭제 | 원본 도식이 없어 문제용 SVG는 만들지 않았지만, 명시 지시에 따라 q11을 production questionBank에서 제거했다. origin/main baseline과 삭제본의 exam/solution은 모두 MATH_TYPESET_ERROR였고, 삭제본 answer는 desktop/mobile 24답으로 동작했다. q11 content는 삭제본에 존재하지 않는다. q10 및 q12 이후 객체는 보존했다. | 예 | answer desktop/mobile 24. exam/solution은 baseline과 동일한 선행 MATH_TYPESET_ERROR | q10 및 q12 이후 객체의 내용·id·순서 보존 | PASS_APPLY_PRINT_BANNED |

## Asset provenance와 수치 검증

- 21_연향중 q11.png: 2021 PDF p.2, 300 dpi crop (410,1050)-(970,1340), 560×290, SHA-256 7B656356DCBB1D263DF19A61DE19A1273A79D0A93C8C9C482D68619BF778AC06
- 21_연향중 q14.png: 같은 PDF p.2, 300 dpi crop (1460,280)-(1930,610), 470×330, SHA-256 08E41D9899D45DEAB5A84B81947FA0A5BEB38A192D225B615D42668EA647CE81
- 22_왕운중 q4.svg: Python fact model로 x×x square, 두 x×2a rectangle, 재배열 후 (x+2a)²−(2a)²를 계산. 최종 SHA-256 e8267b13a25d25a30874f7139d4c189778c64a2f87a06c3c1df4c51fea51cd09
- 25_매산고 q11.svg: Python 401-point sampling, originX=70, originY=259.3333, sx=103.4507, sy=57.3333. 문제용 visible text는 축·눈금·최대/최소 좌표만 남겼다. fact hash a65a9e0095715500d917cd75c38f1d5dc14f06011e3286a557a32cbf80a23fce. SHA-256 044245c8b28e223e138fce8bab67c314c18f01a90d8fcd9f86ee66153f391f30
- 25_매산고 q18.svg: Python geometry O=(360,220), outer radius=150, inner radius=47, signed angle -2π/3. 문제용 visible text는 O/A/B/C/D만 남겼고 π/3 또는 θ=π/3을 표시하지 않았다. fact hash 1fdca4803f7b127319da942b297010c020cbb32a5ab3e5191fdae40e1ced065d. SHA-256 d281dc368d2241fc672fc83cb1135e1a06b0bd9cec538e8fd3c6a0db9fb71552

기존 solutionImage 두 파일은 삭제·교체하지 않았다.

- archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-solution.svg
- archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-solution.svg

## Render evidence

| 대상 | exam desktop/mobile | solution desktop/mobile | answer desktop/mobile |
|---|---|---|---|
| 21_연향중 q11/q14 | PASS, q-box 24, 두 PNG decode | PASS, q-box 24 | PASS, answer 24 |
| 22_왕운중 q4-only | baseline/candidate 모두 q-box 1 PASS; candidate q4.svg decode 960×440 | targeted problem-asset decision에 사용하지 않음 | targeted problem-asset decision에 사용하지 않음 |
| 22_왕운중 full production | baseline/candidate 모두 MATH_TYPESET_INCOMPLETE | baseline/candidate 선행 오류 | full-exam gate는 선행 오류 |
| 25_매산고 q11/q18 | PASS, q-box 21, problem SVG decode | PASS, q-box 21, existing solution SVG decode | PASS, answer 21 |
| 24_수피아여고 q11 removed | baseline/removed exam 모두 MATH_TYPESET_ERROR; q11 absent | baseline/removed solution 모두 MATH_TYPESET_ERROR | PASS, answer 24 desktop/mobile |

## Git 결과

- branch: codex/marker-visual-backfill
- current HEAD: 027357a703066b1301e50327e766d230ffce8b62
- origin/main: 027357a703066b1301e50327e766d230ffce8b62
- latest baseline rebase: 완료. verify-skills PASS.
- implementation commit SHA: 25770fe35
- report finalization commit: this follow-up commit; final branch tip is reported in the final response
- push: pending final verification and branch push
- main merge: 하지 않음

최종 worktree에는 기존 21_연향중 변경, 신규 q4/q11/q18 SVG, 기존 q11/q14 PNG,
대상 JS 수정 및 이 보고서만 남겨야 하며 debug payload와 q4 PNG 후보는 worktree 밖으로
이동했다.

## 종료 게이트

6개 marker 문항의 문제용 marker는 0개가 되었다. 수피아여고 q11은 원본 도식 부재로
problem visual을 만들지 않고 print bank에서 제거했다. 이제 최종 diff와 render 증거를
확인한 뒤 commit/push할 수 있는 상태다.
