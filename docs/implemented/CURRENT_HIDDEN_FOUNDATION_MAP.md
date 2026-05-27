# CURRENT_HIDDEN_FOUNDATION_MAP

## 0. Onboarding Tasks Round 1

| foundation | DB/API | hidden reason |
|---|---|---|
| 신입생 적응 확인 | `onboarding_tasks`, `/api/onboarding/tasks*` | Round 1은 DB/API foundation만 추가한다. 선생님 화면 카드, 슬라이드 패널, CSS, D+14/지연 경고, 원장 화면 노출은 만들지 않는다. |

숨겨진 foundation은 DB/API가 있어도 기본 UI에 꺼내지 않는다.

| foundation | DB/API | 숨김/보류 사유 |
|---|---|---|
| 수납·출납 고급 기능 | `billing-accounting-foundation`, `payment_transactions`, `cashbook_entries`, `refund_records`, `carryover_records` | 금액 무결성, 실제 결제/발송 혼선 |
| 청구 정책/자동 청구 | `billing_policy_rules`, `billing_runs` | 자동 실행 금지, preview와 실제 실행 분리 필요 |
| 학부모 message preview/send | `parent-foundation/messages`, `message_logs` | 실제 문자/알림톡 발송 금지, 동의 필요 |
| 수신동의 전체 설정 | `parent_contact_consents` | 개인정보/설정성 정보 기본 노출 금지 |
| staff permissions | `staff_permissions` | 권한 모델 확정 전 UI 노출 금지 |
| audit/privacy logs | `audit_logs`, `privacy_access_logs` | 원장 전용, 개인정보 접근 로그 |
| foundation sync | `foundation-sync`, `foundation_sync_logs` | 운영 데이터 변형 위험 |
| 새학기 시간표 staging | `timetable_version_*` | 운영 classes와 분리 필요 |
| 씨매쓰/EIE 확장 | branch foundation | 학원별 UX/정책 미확정 |
| 홈페이지 관리 | 확인 필요 | 운영 시스템과 외부 홈페이지 분리 필요 |

