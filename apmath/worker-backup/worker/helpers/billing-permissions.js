// 수납·회계 capability 권한 helper (LOOP 5).
// 메뉴 숨김이 아니라 모든 금액 API에서 서버가 검사한다.
// admin은 전체 capability 보유. teacher는 staff_permissions(permission_key)로 부여한다.
import { isAdminUser, safeAll } from './foundation-db.js';

export const BILLING_CAPABILITIES = [
  'billing.read',            // 조회
  'billing.collect',         // 수납 입력·수납 취소
  'billing.adjust',          // 조정(할인/추가)·이월·장부 수기 입력
  'billing.refund.request',  // 환불 요청 (승인 분리 도입 전 예약)
  'billing.refund.approve',  // 환불 등록(=승인)·환불 취소
  'billing.close',           // 일/월 마감, 월 청구 확정
  'billing.reopen',          // 마감 재오픈
  'billing.audit.read'       // 감사 로그 조회
];

// sub+method(+action) → 필요한 capability.
// 설정성 리소스(결제수단·정책·템플릿)의 쓰기는 admin 전용으로 유지한다(null 반환 = admin only).
export function requiredBillingCapability(sub, method, action = '') {
  const isRead = method === 'GET';
  if (sub === 'audit-logs') return 'billing.audit.read';
  if (isRead) return 'billing.read';
  if (sub === 'transactions') return 'billing.collect';
  if (sub === 'billing-adjustments') return 'billing.adjust';
  if (sub === 'carryovers') return 'billing.adjust';
  if (sub === 'cashbook') return 'billing.adjust';
  if (sub === 'refunds') return 'billing.refund.approve';
  if (sub === 'documents') return 'billing.collect'; // 내부 납부확인서 발급·재발급·취소 = 데스크 업무
  if (sub === 'billing-runs') return 'billing.close';
  if (sub === 'closings') return action === 'reopen' ? 'billing.reopen' : 'billing.close';
  // 집계 재계산·대사 실행은 마감 담당의 월 업무
  if (sub === 'daily-summaries' || sub === 'monthly-summaries' || sub === 'reconciliations') return 'billing.close';
  // payment-methods / policy-rules / billing-templates 등 설정 변경
  return null;
}

export async function getBillingCapabilities(env, teacher) {
  if (isAdminUser(teacher)) return new Set(BILLING_CAPABILITIES);
  const teacherId = String(teacher?.id || '').trim();
  if (!teacherId) return new Set();
  const rows = await safeAll(
    env,
    "SELECT permission_key FROM staff_permissions WHERE teacher_id = ? AND allowed = 1 AND permission_key LIKE 'billing.%'",
    [teacherId]
  );
  return new Set(rows.map((r) => String(r.permission_key || '').trim()).filter(Boolean));
}
