# CODEX_RESULT_RULE

Use this structure for root `CODEX_RESULT.md`.

```text
# CODEX_RESULT

## 1. 생성/수정 파일
## 2. 구현 완료 또는 확인 완료
## 3. 실행 결과
## 4. 결과 요약
## 5. 다음 조치
## 6. 실제로 읽은 기준 문서
## 7. 실제로 확인한 코드/스키마 범위
## 8. 확인하지 못한 파일 또는 미검증 파일
## 9. 추후 보강 필요 문서
## 10. 3대 기준 문서 업데이트 판정
## 11. 업데이트한 기준 문서
## 12. 업데이트하지 않은 기준 문서와 사유
## 13. 자체 검수 결과
## 14. 리뷰팩 경로
```

Rules:

- List files actually created or modified.
- List reference documents actually read.
- Do not claim implementation completion from documentation alone.
- Put unchecked or uncertain files under unverified / needs-verification sections.
- Every code, document, or repository-change task must include the three master-document update decision.
- The decision must explicitly mention `docs/MASTER_RULEBOOK.md`, `docs/MASTER_CURRENT_PROGRESS.md`, and `docs/MASTER_NEXT_WORK.md`.
- If a master document was not updated, explain why.
- For documentation structure changes, include final `docs/` root file list, created folders, moved files, deleted-file count, and `_index` updates.
- Include the new review pack path after it is created and verified.
