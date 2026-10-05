# 5차 세부계획서 — write-through 검증 도입 (PHASE5_PLAN) ⚠️ 위험 구간

> 이 문서는 5차 CODEX_TASK 지시서의 원본이다. **이 차수는 별도 지시서 + 사용자 사전 결정 + 별도 검수 없이 착수 금지.**
> 상위 문서: `WANGJI_STUDENT_MANAGEMENT_PHASE_ROADMAP.md` / 선행: 2~4차 완료

## 0. 목표

```text
왕지 공통 학생관리에서 입력
→ 검토 큐 approved 항목만
→ AP/EIE 공식 API로 원본 DB 반영
```

원본 DB에 write가 발생하는 첫 차수다. 범위를 최소로 시작한다.

## 1. 사전 결정 (전부 확정 전 착수 금지)

| 항목 | 후보 | 결정 |
|---|---|---|
| 1차 write 허용 필드 | 권장: AP `students`의 연락처(student_phone/parent_phone)·메모 **만** | ☐ |
| 반영 경로 | AP: 기존 `PATCH /api/students` 계열 공식 route / EIE: 기존 students PATCH | ☐ |
| 승인 권한자 | 원장(admin)만 | ☐ |
| 적용 주체 | 공통 Worker 서버사이드(권장: 서비스 토큰) vs 관리자 브라우저 세션 | ☐ |
| 실패 정책 | 자동 재시도 금지, failed → 수동 재검토 | ☐ |
| 리허설 환경 | 표본 학생 1~2명(실DB) vs staging DB 사본 | ☐ |
| 롤백 절차 | 반영 전 원본값 snapshot 저장 → 수동 복원 절차 문서화 | ☐ |

## 2. 작업 항목

### 2.1 적용 파이프라인 (큐 → 원본)
```text
approved 큐 항목 선택
→ dry-run preview: 현재 원본값(read) vs 반영 후 값 비교 표시
→ 관리자 최종 승인 클릭 (2단계 확인)
→ 공통 Worker가 AP/EIE 공식 API 호출 (해당 필드만, 최소 payload)
→ 응답 검증 → status=applied / failed + apply_result_summary 기록
→ wangji_audit_logs에 actor/대상/요청·응답 요약 기록
→ 반영 직전 원본값을 큐 항목에 snapshot 저장 (수동 롤백용)
```

### 2.2 안전장치 (필수 구현)
- 화면에서 원본 직접 저장 경로 0 — **반드시 큐 경유**.
- 허용 필드 화이트리스트를 서버(공통 Worker)에서 강제. 화이트리스트 외 필드 포함 시 거부.
- target_type 화이트리스트: 1차는 `student_info`만. enrollment/schedule write는 **이번 차수 금지** (별도 차수로 분리).
- 일괄 반영 금지: 한 번에 1건씩만 적용.
- 원본 DB 직접 SQL 금지 — 공식 route/API만.
- 자동 병합과 결합된 write 금지.

### 2.3 인증
- 공통 Worker → AP/EIE API 호출용 자격(서비스 계정/토큰) 확정. 비밀값은 wrangler secret으로만 (코드/repo에 평문 금지).

## 3. 수정 허용 파일

```text
workers/wangji-common-worker/*  (적용 파이프라인 + 화이트리스트)
apmath/wangji-student-management.{html,js,css}  (preview/승인 UI)
```

AP/EIE Worker 코드 수정 금지 (기존 공식 route를 호출만 한다).

## 4. 금지

- 큐를 거치지 않는 원본 write / 원본 DB 직접 SQL
- 화이트리스트 외 필드 write / enrollment·schedule write
- 자동 일괄 반영 / 자동 재시도 / 자동 병합 연동
- 기존 AP/EIE route 수정

## 5. 검증 / 완료 기준 (리허설 필수)

```text
1) dry-run: preview 값과 원본 read 값 일치 확인
2) 표본 학생 1명 연락처 반영 → AP 기존 화면에서 변경 확인
3) 롤백 리허설: snapshot으로 원래 값 복원 → 원본 화면 재확인
4) failed 시나리오: 잘못된 payload → failed 기록 + 원본 무변경 확인
5) 기존 회귀: tests/eie-*.test.js + AP 학생상세/목록 수동 점검
6) audit log로 1~4 전 과정 추적 가능 확인
7) grep: 공통 Worker 외 어디에도 AP/EIE write 호출 없음
```

전 항목 통과 + 사용자 승인 후에만 운영 사용 개시.

## 6. 산출물

적용 파이프라인 + 안전장치 + 리허설 기록 + `CODEX_RESULT.md`
(다음 확대 후보 필드/타입 목록과 각각의 위험 평가 포함)
