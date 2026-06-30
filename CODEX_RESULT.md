# CODEX_RESULT

## 1. 생성/수정 파일
- `apmath/js/report-text.js`
- `apmath/js/report-center.js`
- `apmath/js/report-print.js`
- `tests/apmath-report-easy-language.test.js`
- `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료
- AP Math 리포트 Studio 블록에 `remediation`, `wrongCare` 2개 블록을 추가하고 기본 포함 옵션을 ON으로 설정했다.
- `plan` 블록 라벨을 `다음 수업 복습 계획`으로 변경했다.
- 새 블록 문구는 `REPORT_COPY_BANK` 고정 문구와 `{labels}` 슬롯 채우기만 사용하도록 구성했다.
- PDF 출력에서 `이번 시험 보완 방향`, `AP수학 오답관리`, `다음 수업 복습 계획` 순서로 표시되도록 배치했다.
- Studio 편집 dirty 상태는 기존 블록 처리 방식과 동일하게 보존되도록 연결했다.

## 3. 실행 결과
- `node --check apmath/js/report-text.js`: 통과
- `node --check apmath/js/report-center.js`: 통과
- `node --check apmath/js/report-print.js`: 통과
- `node tests/apmath-report-easy-language.test.js`: 통과 (`19 groups`)
- `node tests/report-exam-trend.test.mjs`: 미통과
  - 기존 humanize 기대값 불일치에서 중단됨.
  - actual: `이번 평가는 점수 자체보다 오답이 나온 문항의 성격을 함께 보는 것이 중요합니다.`
  - expected: `이번 시험은 점수 자체보다 틀린 문제가 나온 문제의 성격을 함께 보는 것이 중요합니다.`

## 4. 결과 요약
- 새 리포트 보완/오답관리 블록의 데이터 배선, Studio 노출, PDF 출력, 테스트 export를 완료했다.
- 새 composer 결과가 비어 있지 않고 `숫자+번` 문항 번호를 직접 노출하지 않는지 테스트에 추가했다.

## 5. 다음 조치
- `tests/report-exam-trend.test.mjs`의 humanize 기대값은 이번 변경 범위 밖의 기존 정화기 정책 차이로 보이며, 별도 작업에서 기대값 또는 정화기 정책을 정리해야 한다.

## 6. 실제로 읽은 기준 문서
- `CODEX_TASK.md`
- `docs/codex/00_CODEX_READ_ORDER.md`
- `docs/codex/06_CODEX_EXECUTION_RULE.md`
- `docs/codex/CODEX_FORBIDDEN_CHANGES.md`
- `docs/codex/CODEX_ALLOWED_CHANGE_SCOPE.md`
- `docs/codex/CODEX_RESULT_RULE.md`

## 7. 실제로 확인한 코드/스키마 범위
- `apmath/js/report-text.js`
- `apmath/js/report-center.js`
- `apmath/js/report-print.js`
- `tests/apmath-report-easy-language.test.js`
- `tests/report-exam-trend.test.mjs`

## 8. 확인하지 못한 파일 또는 미검증 파일
- 실제 브라우저/PDF 렌더 하네스는 별도 실행하지 못했다.
- `tests/report-exam-trend.test.mjs`는 위 humanize assertion에서 중단되어 이후 assertion은 실행되지 않았다.

## 9. 추후 보강 필요 문서
- 없음. 이번 작업은 리포트 출력 블록의 국소 기능 확장이며 별도 가이드 문서 신설은 하지 않았다.

## 10. 3대 기준 문서 업데이트 판정
- `docs/MASTER_RULEBOOK.md`: 업데이트하지 않음.
- `docs/MASTER_CURRENT_PROGRESS.md`: 업데이트하지 않음.
- `docs/MASTER_NEXT_WORK.md`: 업데이트하지 않음.

## 11. 업데이트한 기준 문서
- 없음.

## 12. 업데이트하지 않은 기준 문서와 사유
- `docs/MASTER_RULEBOOK.md`: 새 운영 규칙이나 전역 정책 변경이 아니라 기존 리포트 블록 구성 확장이므로 미수정.
- `docs/MASTER_CURRENT_PROGRESS.md`: 구현 결과는 `CODEX_RESULT.md`에 기록했고, master 진행 문서에 반영할 정도의 프로젝트 단계 변경은 아니므로 미수정.
- `docs/MASTER_NEXT_WORK.md`: 후속 작업은 기존 humanize 테스트 정리 1건으로, 현재 task 범위 밖이라 master next work에 직접 추가하지 않음.

## 13. 자체 검증 결과
- 문법 검사 3건 통과.
- AP Math report easy-language 테스트 통과.
- 추가 회귀 테스트 1건은 기존 humanize 기대값 불일치로 미통과 기록.
- `git add`, `git commit`, `git push`, deploy는 수행하지 않음.

## 14. 리뷰 요청 경로
- 없음.
