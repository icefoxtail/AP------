# CODEX_RESULT

## 1. 생성/수정 파일

- `apmath/js/report-center.js`
- `apmath/js/report-print.js`
- `tests/report-parent-question-card.test.mjs`
- `tests/report-parent-question-narrative.test.mjs`
- `tests/report-school-exam-detail-report.test.mjs`
- `tests/report-school-exam-detail-print.test.mjs`
- `tests/report-parent-message-rich.test.mjs`
- `CODEX_RESULT.md`

## 2. 구현 완료

- 출력 전용 상세 리포트에서 내부 학부모 리포트 헤더를 숨겨 상단 중복을 제거했다.
- 출력 헤더를 학생명 중심의 `상세 학부모 리포트`로 변경했다.
- 문항 카드의 `학부모 해석 / 이번 오답 의미 / 다음 수업 계획` 3분할 라벨을 제거하고, 하나의 자연스러운 문항 코멘트 문단으로 통합했다.
- 학부모 안내 문구를 점수, 평균 대비, 오답 문항 번호, 단원, 정답률, 다음 수업 계획을 반영하는 긴 문구로 보강했다.
- `풀이 시작점`, `안정적으로 잡겠습니다`, `오답 단원의 핵심 풀이` 계열 표현을 제거하고 회귀 가드를 추가했다.
- PDF 출력물에 서버/로컬/프리미엄 상태 배지가 나오지 않도록 테스트로 고정했다.

## 3. STEP 커밋

- `7b9a78c6` fix(report): remove duplicate parent detail print header
- `6224b2e7` feat(report): build parent question paragraph copy
- `5a13f0ca` refactor(report): collapse parent question card labels
- `dec8165e` fix(report): filter vague parent report phrasing
- `ab4d0de7` feat(report): enrich parent message with exam context
- `f93fc831` improve(report): rewrite next lesson plan copy
- `35a68119` test(report): guard final parent detail layout

## 4. 실행 결과

- `node --check apmath/js/report-center.js` PASS
- `node --check apmath/js/report-print.js` PASS
- `node tests/report-parent-question-card.test.mjs` PASS
- `node tests/report-parent-question-narrative.test.mjs` PASS
- `node tests/report-school-exam-detail-report.test.mjs` PASS
- `node tests/report-school-exam-detail-print.test.mjs` PASS
- `node tests/report-parent-message-rich.test.mjs` PASS
- `git diff --check -- ...` PASS

## 5. 기타

- 브랜치 생성, 푸시, 리뷰 에이전트, 배포는 수행하지 않았다.
- 작업 전부터 `CODEX_TASK.md`가 수정 상태였으며, 해당 파일은 스테이징/커밋하지 않았다.

## 6. 추가 문구 정리

- 학부모 리포트 문장 결합 시 깨지던 `...점로 확인됩니다`, `문항였던 문항`, `문항으로, ... 문제였습니다` 계열 표현을 정리했다.
- `책임지고`, `책임 있게 이어가겠습니다`, `확실히 넘어가도록` 같은 추상 표현을 실제 수업 행동 문장으로 교체했다.
- 간단 리포트/카톡/부모 카드 문구의 구어체 표현을 줄이고, 다시 풀 문항과 유사 문항을 명시하도록 정리했다.

## 7. AI 생성 리포트 톤 반영

- AI 리포트 생성부의 상위권/중위권/하위권/만점 보호자 메시지 톤을 프론트 기본 문구에서도 재사용하도록 밴드 판정 헬퍼를 추가했다.
- 상세 보호자 메시지, 쉬운 리포트 보호자 메시지, PDF 축약 보호자 메시지가 동일한 밴드 톤을 반영하도록 연결했다.
- 하위권은 점수보다 우선 정리할 부분과 가정의 부담 완화, 중위권은 다시 확인할 부분 축소, 상위권/만점은 심화 확장과 성취 칭찬 중심으로 문구를 분리했다.
- `현재 흐름`, `확인 포인트` 같은 기존 금지 표현은 사용하지 않도록 문구를 조정했다.

## 8. 추가 실행 결과

- `node --check apmath/js/report-center.js` PASS
- `node --check apmath/js/report-print.js` PASS
- `node --check apmath/js/report-text.js` PASS
- `node tests/report-parent-message-rich.test.mjs` PASS
- `node tests/report-parent-question-card.test.mjs` PASS
- `node tests/report-school-exam-detail-report.test.mjs` PASS
- `node tests/report-school-exam-detail-print.test.mjs` PASS
- `node tests/report-exam-trend.test.mjs` PASS
- `node tests/apmath-report-easy-language.test.js` PASS
- `node tests/report-pdf-dedup.test.mjs` PASS

## 9. AI 톤 문구 재검증

- 하위권 문구의 `문제를 많이 다시 풀리기보다`를 `문제를 많이 다시 풀게 하기보다`로 고쳐 조사와 사동 표현을 자연스럽게 정리했다.
- 중위권 문구의 `다시 확인할 부분`은 `실수로 이어지는 부분`으로 구체화했다.
- 상위권 문구의 `심화 확장`은 `심화 유형` 중심 표현으로 바꿔 과한 추상 표현을 줄였다.
- 만점 상세 보호자 메시지에서 오답이 없는데 `오답 문항은 많지 않지만`, `이번 오답은`, `오답 보완보다` 계열 표현이 나오지 않도록 분기와 테스트를 보강했다.
- PDF 축약 문구의 연결을 `...하며 수업 난도 조절과 풀이 점검을 함께 진행하겠습니다`로 정리했다.

## 10. 학년별 장기 관리 계획

- 상세 보호자 메시지 마지막에 학년별 장기 관리 계획 문단을 추가했다.
- 리포트 성격을 `학교 기출시험 결과`, `원내평가`, `단원평가`로 판정하는 헬퍼를 추가하고, 중1 원내평가에서는 `학교 시험이 없더라도` 중학교 수학 적응과 첫 내신 준비를 안내하도록 했다.
- 학년 판정 헬퍼를 추가해 학생 학년, 시험 학년, 반 이름의 `중3B` 같은 값을 읽어 `중1/중2/중3/고1/고2/고3/예비중` 단계로 분류하도록 했다.
- 중2는 다음 학기와 중3 과정까지 이어지는 반복 약점 관리, 중3은 고등 내신 연결과 1등급권 목표 관리 가능성을 조건부 표현으로 안내하도록 했다.
- 고등부는 등급 관리, 학교별 고난도 유형, 서술형 감점, 수능형 사고, 입시 전략과 연결되는 기본 장기 계획 문구를 추가했다.
- `예상됩니다`, `보장`, `무조건`, `반드시 1등급` 같은 단정 표현은 테스트로 금지했다.
- 평균값이 비어 있을 때 `소속 반 평균 대비 NaN점`이 나오지 않도록 점수 위치 문구를 숫자 검증 후 생성하도록 수정했다.
