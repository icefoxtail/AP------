# APMS 진단평가 리포트 문구 인벤토리

## 1. 목적

- 기존 APMS 리포트/상담/평가 관련 문구를 진단평가 결과지에 재활용할 수 있는 후보로 추출하고 분류한다.
- 이번 문서는 문구 확정본이 아니라 검토용 인벤토리이다.
- 새 학부모용 최종 문장, 새 학생용 최종 문장, 새 상담용 최종 문장은 작성하지 않는다.

## 2. 확인한 파일

| 파일 | 확인 범위 | 확인한 함수/상수/섹션 | 비고 |
|---|---|---|---|
| `apmath/js/report.js` | 리포트 문구 생성, 리포트센터, PDF 출력, AI 요청 payload | `buildExamSummary`, `buildNextPoint`, `buildRiskSummaryText`, `buildMissingExamSummaryText`, `buildTargetProgressText`, `appendRiskSummaryToReportText`, `buildParentReportText`, `buildStudentReportText`, `buildCounselReportText`, `openStudentReportModal`, `copyReport`, `requestAiReport`, `reportCenterBuildBaseReportDraft`, `reportCenterBuildExamAiPayload`, `reportCenterBuildExamPreview`, `reportCenterBuildCounselPreview`, `reportCenterBuildCleanPdfDocument`, `reportCenterRequestPrintViewAiAnalysis` | 기존 파일 일부 한글 문자열은 저장 인코딩상 깨진 상태로 보임 |
| `apmath/js/student.js` | 학생 상세 상담기록, 보호자 연락, 상담 AI 요약, 간단 보고 문구 미리보기 | `openConsultationThreadSummaryModal`, `requestConsultationThreadSummary`, `openAddConsultationModal`, `requestConsultationSummary`, `openReportModal`, 보호자 연락/동의/연락 이력 UI | 상담 AI는 내부 참고/초안 성격 |
| `apmath/js/classroom.js` | 클래스룸 상담 진입/출결/숙제 표시 | `openClassroomConsultation`, 상담 상태 버튼, 출결/숙제 태그 | 직접 리포트 문구보다는 상담 진입 구조 확인 |
| `apmath/js/dashboard.js` | 관리자 최근 상담/신입생 상담 가이드/일지 | `renderAdminRecentConsultationPanel`, `openAdminConsultationCenter`, onboarding 상담 가이드, 일지 상담 섹션 | 진단평가 리포트 문구보다는 상담 운영 문구 후보 |
| `apmath/worker-backup/worker/routes/reports-ai.js` | AI 리포트 JSON schema, 프롬프트, fallback, 금지 표현, 정규화 | `REPORT_ANALYSIS_JSON_SCHEMA`, `AP_REPORT_ANALYSIS_SYSTEM_PROMPT`, `buildReportAnalysisUserPrompt`, `normalizeParentMessageOpening`, `normalizeReportAnalysisResult`, `buildFallbackReportAnalysis`, `isWeakAiReportResult`, `mergeReportAnalysisWithFallback`, consultation summary schemas | 진단평가 문구 검토에서 가장 중요한 문체/금지 규칙 근거 |
| `docs/domains/REPORT_AI_DOMAIN.md` | 리포트 AI 도메인 구조/위험/계획 | 현재 구현 구조, 데이터/API 흐름, 위험, 추가 계획 | 문서 자체도 mojibake 포함 |
| `docs/plans/REPORT_AI_NEXT_PLAN.md` | 리포트 AI 다음 계획 | payload/response 실사, 금지 표현 목록, fallback 정교화, archive/mixed/PDF 검토 | 구현 전 검토 단계 근거 |
| `docs/implemented/CURRENT_FRONTEND_MAP.md` | 프론트엔드 맵 | `report.js`, `student.js`, `classroom.js`, `dashboard.js` 역할 | 직접 문구 원문은 적음 |
| `docs/implemented/CURRENT_API_FLOW_MAP.md` | API 흐름 | `initial-data`, `report_exam_cohort_stats`, report state 공유 | 리포트 데이터 출처 확인 |
| `docs/guides/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` | 프로젝트 구조/주의/리포트센터 PDF 규칙 | report domain, parent-foundation, 상담 AI, PDF 보정 함수 목록 | 리포트센터 구조 변경 금지 근거 |
| `archive/assessment/assessment-analysis.html` | 진단평가 분석 입력/문항 comment 구조 | `question?.parentComment` | 문항별 학부모 설명 슬롯 후보 |
| `archive/assessment/assessment-mvp.html` | 진단평가 MVP UI | 평가 pack/questions 흐름 | 직접 문구 근거는 제한적 |

## 3. 기존 리포트 구조 요약

- 오늘 리포트/학부모용 기본 문구는 `buildParentReportText(ctx)`에서 출결, 숙제, 최근 평가, 오답 번호, 다음 수업 포인트, 목표점수/위험/미응시 요약을 조합한다.
- 학생용 문구는 `buildStudentReportText(ctx)`에서 학생 이름, 최근 평가, 오답 수, 숙제 상태, 다음 확인 포인트를 짧게 구성한다.
- 상담용 문구는 `buildCounselReportText(ctx)`와 `reportCenterBuildCounselPreview(studentId)`가 내부 상담 메모 형식으로 학생/반/출결/숙제/최근 평가/최근 상담/다음 조치를 묶는다.
- 평가 리포트/PDF 흐름은 `reportCenterBuildExamPreview`, `reportCenterBuildBaseReportDraft`, `reportCenterBuildCleanPdfDocument`가 담당한다.
- 프리미엄 AI 분석은 `reportCenterBuildExamAiPayload`가 `student`, `exam`, `cohort`, `questionAnalysis`, `wrongAnalysis`, `baseReportDraft`, `archiveQuestionDetails`, `teacherMemo`를 payload로 묶고, Worker의 `ai/report-analysis`가 JSON 필드로 돌려준다.
- AI 결과 필드는 `summary`, `diagnosis`, `wrongAnalysis`, `nextPlan`, `parentMessage`, `kakaoSummary`, `teacherMemo`, `riskLevel`, `mainWeaknesses`, `nextActions`이다.

## 4. 문구 인벤토리

### 4-1. 학부모용 문구

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `안녕하세요 학부모님, AP수학입니다.` | `apmath/js/student.js` | `openReportModal` | 학생 상세 간단 보고 미리보기 시작문 | 후보 | 일부 수정 필요 | 예 | Worker 프롬프트의 현재 parentMessage 시작 규칙과 충돌 가능. 실제 진단평가 최종 문구로 확정하지 말고 시작문 검토 대상에 둔다. |
| 2 | `오늘 ${s.name}이는 ${progressText}${examText}${cnsText}` | `apmath/js/student.js` | `openReportModal` | 학생 상세 간단 보고 본문 조합 | 후보 | 아니오 | 예 | 오늘 수업/상담 보고용이라 진단평가 결과지에는 구조만 참고 가능. |
| 3 | `궁금하신 점은 언제든 편하게 문의주세요. 감사합니다!` | `apmath/js/student.js` | `openReportModal` | 학생 상세 간단 보고 마무리 | 후보 | 일부 수정 필요 | 예 | 진단평가 PDF 문체에는 다소 대화형이다. |
| 4 | `관리 관점에서는 최근 ${summary} 흐름이 보여, 다음 수업에서 해당 부분을 우선 확인하겠습니다.` | `apmath/js/report.js` | `buildRiskSummaryText` | 위험/관리 요약 삽입 | 후보 | 가능 | 예 | 진단평가의 다음 관리 방향 슬롯에 맞다. `${summary}` 근거가 필요하다. |
| 5 | `오늘 진행한 「${title}」은 아직 응시 기록이 없어, 다음 시간에 먼저 확인할 예정입니다.` | `apmath/js/report.js` | `buildMissingExamSummaryText` | 미응시 평가 안내 | 후보 | 가능 | 아니오 | 진단평가 미응시/보류 상태 문구로 그대로 검토 가능. |
| 6 | `목표점수는 ${targetScore}점으로 설정되어 있으며, 성적 기록이 쌓이면 달성률을 함께 확인하겠습니다.` | `apmath/js/report.js` | `buildTargetProgressText` | 목표점수 기록 부족 안내 | 후보 | 가능 | 아니오 | 진단평가 목표점수/추적 설명에 적합. |
| 7 | `목표점수는 ${targetScore}점이며, 최근 평균은 ${currentAverage}점으로 목표까지 ${remainScore}점 남았습니다. 목표 달성률은 ${achievementRate}%입니다.` | `apmath/js/report.js` | `buildTargetProgressText` | 목표점수 대비 현황 안내 | 후보 | 가능 | 예 | parentMessage에서는 수치 반복 최소화 규칙이 있어 결과지 표/요약 영역에 더 적합. |
| 8 | `문구를 생성한 뒤 내용을 확인하고 복사합니다.` | `apmath/js/report.js` | `openStudentReportModal`, `buildClassReportBatchHtml` | 문구 생성 UI 안내 | 부적합 | 아니오 | 아니오 | UI 안내문이지 진단평가 문구가 아니다. |
| 9 | `학부모용 문구`, `AI 학부모용 문구` | `apmath/js/report.js` | `openStudentReportModal` | 버튼 라벨 | 슬롯명 후보 | 가능 | 아니오 | 진단평가 섹션명보다는 내부 기능명. |
| 10 | `자세한 오답 의미와 보완 계획은 함께 전달드리는 PDF 리포트에서 확인하실 수 있습니다.` | `apmath/worker-backup/worker/routes/reports-ai.js` | `buildFallbackReportAnalysis` | fallback `kakaoSummary` 안내 | 후보 | 가능 | 예 | 카카오 발송용이라 PDF 내부 문구로는 중복 가능성 검토 필요. |

### 4-2. 학생용 문구

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `목표까지 ${remainScore}점 남았으니, 다음 평가는 오답 줄이는 데 집중하자.` | `apmath/js/report.js` | `buildStudentReportText` | 학생용 목표점수 안내 | 후보 | 일부 가능 | 예 | 학생 직접 피드백 문체라 학부모용 진단평가에는 그대로 쓰지 않는다. |
| 2 | `학생용 문구`, `AI 학생용 문구` | `apmath/js/report.js` | `openStudentReportModal` | 버튼 라벨 | 슬롯명 후보 | 가능 | 아니오 | 진단평가 학생 안내 영역이 생길 때 기능명 참고. |
| 3 | 오답 수를 다시 확인하자는 패턴 | `apmath/js/report.js` | `buildStudentReportText` | 학생용 짧은 격려/과제 | 후보 | 아니오 | 예 | 기존 파일 원문 일부가 mojibake라 최종 문구 확정 전 재검토 필요. |

### 4-3. 상담용 문구

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `[학생 상담 메모]`, `[오늘 상태]`, `[성적 및 오답]`, `[최근 상담 기록]`, `[다음 조치]` | `apmath/js/report.js` | `buildCounselReportText` | 내부 상담 메모 구조 | 후보 | 구조만 가능 | 예 | 진단평가 상담 메모 섹션 구조 후보. 학부모용 본문에는 부적합. |
| 2 | `[상담 리포트 초안]`, `[최근 성적 흐름]`, `[현재 확인 사인]`, `[상담 방향]` | `apmath/js/report.js` | `reportCenterBuildCounselPreview` | 상담 리포트 초안 | 후보 | 구조만 가능 | 예 | 진단평가 교사용 상담 참고 페이지에 적합. |
| 3 | `상담 흐름 요약`, `최근 상담 흐름`, `다음 상담 확인 포인트` | `apmath/js/student.js` | `openConsultationThreadSummaryModal` | 상담 AI 내부 참고 UI | 후보 | 가능 | 아니오 | 진단평가 후속 상담 체크리스트 슬롯명으로 검토 가능. |
| 4 | `상담 내용을 입력한 뒤 AI 요약을 눌러 내부 기록용 요약과 다음 조치 초안을 확인할 수 있습니다.` | `apmath/js/student.js` | 상담 추가/AI 요약 UI | 내부 안내 | 부적합 | 아니오 | 아니오 | 사용자 안내문이며 결과지 문구가 아니다. |
| 5 | `실제 상담 기록은 학생 상담 탭에서 남깁니다. 숨김은 주간일정에서만 사라지며 상담 기록을 만들지 않습니다.` | `apmath/js/dashboard.js` | onboarding 상담 modal | 운영 안내 | 부적합 | 아니오 | 아니오 | 운영 UI 문구. |

### 4-4. 평가 리포트 요약 문구

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `summary`, `diagnosis`, `wrongAnalysis`, `nextPlan`, `parentMessage`, `kakaoSummary`, `teacherMemo`, `riskLevel`, `mainWeaknesses`, `nextActions` | `apmath/worker-backup/worker/routes/reports-ai.js` | `REPORT_ANALYSIS_JSON_SCHEMA` | AI 평가 분석 JSON 필드 | 후보 | 구조 가능 | 아니오 | 진단평가 결과지 섹션 슬롯으로 가장 직접적이다. |
| 2 | `stable`, `watch`, `focus` | `apmath/worker-backup/worker/routes/reports-ai.js` | `riskLevel` enum | 위험도/관리 수준 | 후보 | 가능 | 예 | 학부모 노출 문구로는 그대로 쓰지 말고 내부 상태값으로만 검토. |
| 3 | `purpose: AI must improve this existing base report, not replace it from scratch.` | `apmath/js/report.js` | `reportCenterBuildBaseReportDraft` | AI 개선 모드 지시 | 후보 | 구조만 가능 | 아니오 | 진단평가에서도 기존 근거 기반 개선 원칙으로 활용 가능. |
| 4 | `achievementSummary`, `evaluationMeaning`, `diagnosis`, `nextPlanItems`, `parentMessage`, `kakaoSummary`, `teacherMemo`, `constraints`, `metrics` | `apmath/js/report.js` | `reportCenterBuildBaseReportDraft` | 기본 평가 리포트 초안 구조 | 후보 | 구조 가능 | 아니오 | 문구보다 데이터 구조 후보. |
| 5 | `student`, `exam`, `cohort`, `questionAnalysis`, `wrongAnalysis`, `baseReportDraft`, `archiveQuestionDetails`, `teacherMemo` | `apmath/js/report.js` | `reportCenterBuildExamAiPayload` | AI 분석 payload | 후보 | 구조 가능 | 아니오 | 진단평가 payload 구조 후보. |

### 4-5. 성취/강점 표현

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `성취를 먼저 말하고...` 계열 지시 | `apmath/worker-backup/worker/routes/reports-ai.js` | `AP_REPORT_ANALYSIS_SYSTEM_PROMPT`, `buildReportAnalysisUserPrompt` | AI 문체 규칙 | 후보 | 원칙 가능 | 아니오 | 새 문구가 아니라 작성 원칙. |
| 2 | `positiveAnchor`, `growthPotential`, `teacherCareMessage`, `parentReassurance`, `lifeBasedNextStep`, `neutralLifeAnchor` | `apmath/worker-backup/worker/routes/reports-ai.js` | learning-life seed | 문장 다양화/안심 seed | 후보 | 구조 가능 | 예 | 기존 seed 값을 그대로 쓰기 전 실제 생성 근거 확인 필요. |
| 3 | 만점/고득점/오답 0개는 정확도 유지, 심화 적용, 다음 단원 확장으로 연결 | `apmath/worker-backup/worker/routes/reports-ai.js`, `apmath/js/report.js` | prompt, `buildFallbackReportAnalysis`, `reportCenterBuildExamPreview` | 고성취 해석 원칙 | 후보 | 원칙 가능 | 아니오 | 진단평가 상위권 결과 해석 구조로 적합. |

### 4-6. 보완/오답 표현

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `확인할 문항`, `다시 살펴볼 문항`, `차근차근 다시 풀어볼 문항` | `apmath/worker-backup/worker/routes/reports-ai.js` | `buildReportAnalysisUserPrompt` | parentMessage 문항 표현 대체어 | 후보 | 가능 | 아니오 | 진단평가 오답 문항 표현 후보. |
| 2 | `조건 표시`, `계산 검산 습관`, `풀이 순서` | `apmath/worker-backup/worker/routes/reports-ai.js` | prompt/fallback | 보완 행동 표현 | 후보 | 가능 | 아니오 | 수학 진단평가 행동 처방 슬롯에 적합. |
| 3 | `오답은 "틀림"이 아니라 다음 수업에서 확인할 사인으로 표현`하는 지시 | `apmath/worker-backup/worker/routes/reports-ai.js` | prompt | 문체 원칙 | 후보 | 원칙 가능 | 아니오 | 진단평가 문항별 근거표 작성 원칙으로 적합. |
| 4 | `우선 보완 문항`, `우선 보완 단원`, `같은 실수가 반복되지 않도록` 계열 | `apmath/js/report.js`, `reports-ai.js` | `reportCenterBuildBaseReportDraft`, fallback | 다음 수업 계획 | 후보 | 일부 가능 | 예 | 학부모용에서는 부담감을 줄이는 방향으로 검토 필요. |

### 4-7. 다음 수업 계획 표현

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `다음 수업에서 해당 부분을 우선 확인하겠습니다.` | `apmath/js/report.js` | `buildRiskSummaryText` | 관리 요약 | 후보 | 가능 | 아니오 | 진단평가 후속 관리 방향에 적합. |
| 2 | `다음 시간에 먼저 확인할 예정입니다.` | `apmath/js/report.js` | `buildMissingExamSummaryText` | 미응시 평가 안내 | 후보 | 가능 | 아니오 | 미응시/누락 상태 안내에 적합. |
| 3 | `nextActions` 배열 | `reports-ai.js`, `report.js` | schema/fallback/base draft | 다음 조치 목록 | 후보 | 구조 가능 | 아니오 | 진단평가 결과지의 후속 수업 체크리스트 슬롯 후보. |
| 4 | `다음 상담 확인 포인트` | `apmath/js/student.js` | consultation thread summary | 상담 후속 포인트 | 후보 | 가능 | 아니오 | 진단평가 후 상담 섹션명 후보. |

### 4-8. 금지/주의 표현

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `확인 불가`, `자료 없음`, `데이터 부족`, `아카이브`, `시스템`, `함수`, `코드` | `apmath/worker-backup/worker/routes/reports-ai.js` | prompt 금지 표현 | 학부모용 결과물 금지어 | 금지 | 아니오 | 아니오 | 내부/기술 표현 노출 금지. |
| 2 | `못했다`, `낮은 수치`, `아쉽게 느껴지실 수 있으나`, `다소 아쉽게`, `아쉬운 결과`, `부족합니다`, `오답 처리`, `틀린 문항`, `틀린 문제` | `apmath/worker-backup/worker/routes/reports-ai.js` | prompt/isWeakAiReportResult | parentMessage 금지 표현 | 금지 | 아니오 | 아니오 | 진단평가 학부모용 문구에서도 금지 후보. |
| 3 | `기본 개념을 잘 이해하고 있습니다` 계열 | `apmath/worker-backup/worker/routes/reports-ai.js` | prompt/isWeakAiReportResult | 근거 없는 칭찬 방지 | 금지 또는 검토 필요 | 아니오 | 아니오 | 진단평가 데이터/teacherMemo 근거 없이 사용 금지. |
| 4 | `stable`, `watch`, `focus` | `reports-ai.js` | `riskLevel` | 내부 상태값 | 학부모 노출 주의 | 아니오 | 예 | 결과지 내부 데이터값으로만 사용하고 문장 노출은 검토 필요. |

### 4-9. 출력/PDF 리포트 관련 표현

| 번호 | 문구 원문 또는 문구 패턴 | 출처 파일 | 함수/상수/섹션 | 현재 용도 | 진단평가 활용 후보 여부 | 그대로 재사용 가능 여부 | 수정 필요 여부 | 검토 메모 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `프리미엄 분석` | `apmath/js/report.js` | `reportCenterBuildPrintViewHtml`, `reportCenterRequestPrintViewAiAnalysis` | PDF 보기 AI 버튼 | 부적합 | 아니오 | 아니오 | 기능 라벨. 진단평가 결과지 본문 아님. |
| 2 | `PDF 리포트` | `apmath/js/report.js`, `reports-ai.js` | `reportCenterBuildExamPreview`, fallback kakao | 출력물 안내 | 후보 | 일부 가능 | 예 | 결과지 내부에서 반복되면 어색함. 발송 안내 문구로만 검토. |
| 3 | `aprc-pdf-document`, `aprc-pdf-student-band`, `aprc-exam-meta` 등 | `docs/guides/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md` | PDF 보정 규칙 | PDF 구조/CSS | 구조 후보 | 아니오 | 아니오 | 문구가 아니라 출력 구조. |

## 5. 진단평가용 문구 슬롯 초안

문구를 확정하지 않고 필요한 자리만 정의한다.

- `[진단평가 제목]`: 평가명, 일자, 학년, 응시 상태.
- `[학생 기본 정보]`: 학생명, 학교/학년, 반, 목표점수 또는 목표 흐름.
- `[전체 결과 요약]`: 점수/정답률/전체 또는 반 평균 비교. parentMessage에는 수치 반복 최소화.
- `[단원별 결과 요약]`: 단원명, 정답/오답/우선 확인 여부.
- `[유형별 결과 요약]`: 계산/조건해석/응용/서술 등 유형 분류가 있을 때만.
- `[사인별 결과 요약]`: 쉬운 문항 실수, 고난도 문항, 조건 표시, 검산 습관 등 확인 사인.
- `[주요 보완 사인]`: `확인할 문항`, `다시 살펴볼 문항` 중심.
- `[첫달 관리 방향]`: 다음 수업/다음 상담/가정 확인 1개.
- `[문항별 근거표]`: 문항 번호, 단원, 정답률 또는 난도, 확인 포인트.
- `[상담 메모]`: 내부 교사용 상담 초안.
- `[학부모 안내/지원 설명]`: 사용자가 최종 확인해야 하는 영역.

## 6. 활용 가능 후보

### 그대로 재사용 가능 후보

- `관리 관점에서는 최근 ${summary} 흐름이 보여, 다음 수업에서 해당 부분을 우선 확인하겠습니다.`
- `오늘 진행한 「${title}」은 아직 응시 기록이 없어, 다음 시간에 먼저 확인할 예정입니다.`
- `목표점수는 ${targetScore}점으로 설정되어 있으며, 성적 기록이 쌓이면 달성률을 함께 확인하겠습니다.`
- `다음 상담 확인 포인트`
- `확인할 문항`, `다시 살펴볼 문항`, `차근차근 다시 풀어볼 문항`

### 일부 수정 후 재사용 후보

- `안녕하세요 학부모님, AP수학입니다.`
- 학생 상세 간단 보고 템플릿의 `오늘 ${s.name}이는...` 구조
- `목표점수는 ${targetScore}점이며, 최근 평균은 ${currentAverage}점으로 목표까지 ${remainScore}점 남았습니다...`
- `PDF 리포트에서 확인하실 수 있습니다.` 계열 발송 안내
- `reportCenterBuildExamPreview`의 평가 결과 안내 구조

### 진단평가에는 부적합한 문구

- `확인 불가`, `자료 없음`, `데이터 부족`, `아카이브`, `시스템`, `함수`, `코드`
- `못했다`, `낮은 수치`, `아쉽게`, `아쉬운 결과`, `부족합니다`, `오답 처리`, `틀린 문항`, `틀린 문제`
- `riskLevel` 원시값인 `stable`, `watch`, `focus`의 학부모 직접 노출
- UI 안내문: `문구를 생성한 뒤 내용을 확인하고 복사합니다.`, `상담 내용을 입력한 뒤 AI 요약을...`

## 7. 검토 필요 표현

- 너무 AI스럽거나 문어체인 표현: 길이 기준을 맞추기 위해 반복되는 `summary`, `diagnosis`, `nextPlan` 구조.
- 학부모에게 부담스러운 표현: 점수/정답률/평균 비교를 parentMessage에서 과도하게 반복하는 문장.
- 진단평가에서 과한 판단처럼 보일 수 있는 표현: 데이터 근거 없이 `기본 개념 이해`, `성실`, `노력`, `참여`를 단정하는 문장.
- 내부 시스템 표현: `baseReportDraft`, `archiveQuestionDetails`, `fallback`, `proxy`, `cohortScope`.
- 마케팅처럼 보일 수 있는 표현: `프리미엄 분석`, `PDF 리포트` 반복 강조.
- 실제 원장/선생님 상담 말투와 어긋날 수 있는 표현: 다문장 장문 parentMessage와 카카오 요약의 중복.

## 8. 다음 구현에 반영할 구조 제안

- `assessment-analysis.html` 입력/원자료 영역에서 문항별 `parentComment` 또는 문항별 확인 포인트를 분리해 둔다.
- `report.js` 또는 별도 diagnostic report builder에서 기존 `REPORT_ANALYSIS_JSON_SCHEMA`와 유사한 슬롯을 사용하되, `parentMessage`는 사용자가 직접 확정하도록 둔다.
- 1페이지에는 전체 요약, 주요 보완 사인, 첫달 관리 방향만 배치한다.
- 2페이지 이후에는 문항별 근거표, 단원별/유형별 분석, 상담 메모를 배치한다.
- premium AI는 새 문구 확정보다 기존 기본 리포트 개선/검토 역할로 제한한다.
- snapshot 저장은 다음 라운드에서 별도 확인한다.

## 9. 미확정 및 주의사항

- `apmath/js/report.js`, `reports-ai.js`, 일부 docs 파일은 한글 문자열이 mojibake로 저장된 부분이 많아 원문 확정 전 인코딩/표시 검토가 필요하다.
- 이번 문서는 기존 문구 후보와 구조를 추출한 것이며, 최종 학부모용 문구를 확정하지 않았다.
- 진단평가 결과지에 들어갈 최종 문장은 사용자/외부 리뷰어가 실제 상담 말투 기준으로 검토한 뒤 별도 라운드에서 확정해야 한다.
- 코드, UI, Worker, DB, generated JS는 수정하지 않았다.
