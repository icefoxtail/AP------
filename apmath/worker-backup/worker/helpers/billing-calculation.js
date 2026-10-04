// 순수 청구 계산기 (LOOP 1).
// DB 접근 없음 — 같은 입력이면 항상 같은 결과(결정론)를 보장한다.
// 운영 결정 근거: docs/plans/APMATH_BILLING_DECISIONS.md
//   D-01 청구 기준일 = 학생 등원 시작일(start_date)의 '일'에서 자동 도출, 없는 날짜는 그 달 말일로 당김
//   D-02 납부기한 = 청구일 + 1개월(말일 당김)
//   D-03 일할 자동 계산 비활성(수동 조정 행으로만)
//   D-04 자동 할인 비활성(원장 재량 수동 조정 행으로만)
import { computeBilledAmount, toSettlementAmount } from './billing-settlement.js';

export const BILLING_RULE_VERSION = 'apmath-billing-calc-2026-07-14.1';
export const TUITION_ITEM_TYPE = 'tuition';

export const PREVIEW_EXCLUSION_REASONS = {
  ENROLLMENT_NOT_ACTIVE: 'enrollment_not_active',
  NO_START_DATE: 'no_start_date',
  STARTS_AFTER_MONTH: 'starts_after_month',
  ENDED_BEFORE_BILLING_DATE: 'ended_before_billing_date',
  NO_TUITION_RULE: 'no_tuition_rule'
};

const EXCLUSION_LABELS = {
  enrollment_not_active: '수강 상태가 활성이 아님',
  no_start_date: '등원 시작일이 없어 청구 기준일을 정할 수 없음 (D-01)',
  starts_after_month: '해당 월 이후에 등원 시작 (중도등록 예정)',
  ended_before_billing_date: '청구 기준일 이전에 수강 종료 (휴원/퇴원)',
  no_tuition_rule: '수강료 금액을 정할 규칙이 없음 (수강 금액·반 템플릿·지점 정책 모두 없음)'
};

function parseIsoDate(value) {
  const raw = String(value || '').trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatIsoDate(year, month, day) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// D-01: 해당 (year, month)의 청구 기준일. 등원 시작 전 달이면 null.
export function deriveMonthlyBillingDate(startDate, year, month) {
  const start = parseIsoDate(startDate);
  if (!start) return null;
  if (year * 100 + month < start.year * 100 + start.month) return null;
  const day = Math.min(start.day, daysInMonth(year, month));
  return formatIsoDate(year, month, day);
}

// D-02: 청구일 + 1개월. 다음 달에 같은 날짜가 없으면 다음 달 말일.
export function computeDueDate(billingDate) {
  const base = parseIsoDate(billingDate);
  if (!base) return null;
  let year = base.year;
  let month = base.month + 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  const day = Math.min(base.day, daysInMonth(year, month));
  return formatIsoDate(year, month, day);
}

function normalizeBranchKey(value) {
  return String(value || 'apmath').trim().toLowerCase() || 'apmath';
}

function templateAppliesToBranch(template, branch) {
  const templateBranch = normalizeBranchKey(template.branch || 'apmath');
  return templateBranch === 'all' || templateBranch === branch;
}

function isActiveFlag(value) {
  return Number(value === undefined || value === null ? 1 : value) === 1;
}

// 수강료 금액 결정 우선순위(결정론):
//   1) 수강 등록의 tuition_amount (학생별 지정 금액)
//   2) 해당 반(class_id)에 연결된 활성 tuition 템플릿
//   3) 반 지정이 없는 지점 공통 활성 tuition 템플릿
//   4) 지점(없으면 all) 활성 tuition 정책 규칙
// 같은 단계에 후보가 여러 개면 id 사전순 첫 번째(결정론 유지)를 쓰고 후보 수를 근거에 남긴다.
export function resolveTuitionForEnrollment(enrollment, templates, policyRules) {
  const branch = normalizeBranchKey(enrollment.branch);
  const explicit = enrollment.tuition_amount;
  if (explicit !== null && explicit !== undefined && String(explicit).trim() !== '' && Number.isFinite(Number(explicit))) {
    return {
      amount: toSettlementAmount(explicit),
      basis: `enrollment:${enrollment.enrollment_id || enrollment.id || ''}`,
      basis_type: 'enrollment_tuition_amount'
    };
  }

  const activeTuitionTemplates = (templates || [])
    .filter((t) => isActiveFlag(t.is_active) && String(t.item_type || '').trim().toLowerCase() === TUITION_ITEM_TYPE)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));

  const classTemplates = activeTuitionTemplates.filter(
    (t) => String(t.class_id || '').trim() && String(t.class_id).trim() === String(enrollment.class_id || '').trim() && templateAppliesToBranch(t, branch)
  );
  if (classTemplates.length) {
    return {
      amount: toSettlementAmount(classTemplates[0].default_amount),
      basis: `template:${classTemplates[0].id}${classTemplates.length > 1 ? ` (+${classTemplates.length - 1} candidates)` : ''}`,
      basis_type: 'class_template'
    };
  }

  const branchTemplates = activeTuitionTemplates.filter(
    (t) => !String(t.class_id || '').trim() && templateAppliesToBranch(t, branch)
  );
  if (branchTemplates.length) {
    return {
      amount: toSettlementAmount(branchTemplates[0].default_amount),
      basis: `template:${branchTemplates[0].id}${branchTemplates.length > 1 ? ` (+${branchTemplates.length - 1} candidates)` : ''}`,
      basis_type: 'branch_template'
    };
  }

  const activeTuitionRules = (policyRules || [])
    .filter((r) => isActiveFlag(r.is_active) && String(r.rule_type || '').trim().toLowerCase() === TUITION_ITEM_TYPE)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const branchRules = activeTuitionRules.filter((r) => normalizeBranchKey(r.branch || 'all') === branch);
  const fallbackRules = activeTuitionRules.filter((r) => normalizeBranchKey(r.branch || 'all') === 'all');
  const rule = branchRules[0] || fallbackRules[0] || null;
  if (rule) {
    let amount = 0;
    try {
      const value = JSON.parse(String(rule.value_json || '{}'));
      const raw = Number(value?.amount ?? value?.default_amount ?? value?.tuition_amount ?? 0);
      amount = Number.isFinite(raw) ? Math.max(0, Math.round(raw)) : 0;
    } catch (e) {
      amount = 0;
    }
    return { amount, basis: `policy:${rule.rule_key}`, basis_type: 'policy_rule' };
  }

  return null;
}

// 부가 항목(교재비·특강비 등): 해당 반에 명시적으로 연결된 활성 비-tuition 템플릿만 적용.
// 반 미지정(지점 공통) 비-tuition 템플릿은 자동 적용하지 않는다(D-05 미결정 → 기본 비활성).
export function resolveExtraItemsForEnrollment(enrollment, templates) {
  const branch = normalizeBranchKey(enrollment.branch);
  return (templates || [])
    .filter((t) =>
      isActiveFlag(t.is_active) &&
      String(t.item_type || '').trim().toLowerCase() !== TUITION_ITEM_TYPE &&
      String(t.class_id || '').trim() &&
      String(t.class_id).trim() === String(enrollment.class_id || '').trim() &&
      templateAppliesToBranch(t, branch)
    )
    .sort((a, b) => String(a.id).localeCompare(String(b.id)))
    .map((t) => ({
      name: String(t.name || ''),
      item_type: String(t.item_type || 'other').trim().toLowerCase(),
      amount: toSettlementAmount(t.default_amount),
      basis: `template:${t.id}`,
      basis_type: 'extra_template'
    }));
}

// 수강 단위 결정론적 청구 미리보기 (D-11: 복수 수강은 수강별로 청구서를 따로 발행).
// 입력: 조회 시점의 활성 수강(enrollments), 청구 템플릿(templates), 정책 규칙(policyRules).
// 출력은 입력에만 의존하며 어떤 테이블도 변경하지 않는다.
export function calculateBillingPreview({ year, month, enrollments, templates, policyRules }) {
  const invoices = [];
  const excluded = [];

  const sortedEnrollments = [...(enrollments || [])].sort((a, b) =>
    String(a.student_id).localeCompare(String(b.student_id)) ||
    String(a.class_id || '').localeCompare(String(b.class_id || '')) ||
    String(a.enrollment_id || a.id || '').localeCompare(String(b.enrollment_id || b.id || ''))
  );

  const exclude = (enrollment, reasonCode) => {
    excluded.push({
      enrollment_id: enrollment.enrollment_id || enrollment.id || '',
      student_id: enrollment.student_id || '',
      student_name: enrollment.student_name || '',
      class_id: enrollment.class_id || '',
      class_name: enrollment.class_name || '',
      reason_code: reasonCode,
      reason: EXCLUSION_LABELS[reasonCode] || reasonCode
    });
  };

  for (const enrollment of sortedEnrollments) {
    const enrollmentStatus = String(enrollment.status || 'active').trim().toLowerCase();
    if (!['active', 'ended'].includes(enrollmentStatus)) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.ENROLLMENT_NOT_ACTIVE);
      continue;
    }
    if (enrollmentStatus === 'ended' && !parseIsoDate(enrollment.end_date)) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.ENROLLMENT_NOT_ACTIVE);
      continue;
    }
    if (!parseIsoDate(enrollment.start_date)) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.NO_START_DATE);
      continue;
    }
    const billingDate = deriveMonthlyBillingDate(enrollment.start_date, year, month);
    if (!billingDate) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.STARTS_AFTER_MONTH);
      continue;
    }
    const endDate = parseIsoDate(enrollment.end_date) ? String(enrollment.end_date).trim() : '';
    if (endDate && endDate <= billingDate) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.ENDED_BEFORE_BILLING_DATE);
      continue;
    }
    const tuition = resolveTuitionForEnrollment(enrollment, templates, policyRules);
    if (!tuition) {
      exclude(enrollment, PREVIEW_EXCLUSION_REASONS.NO_TUITION_RULE);
      continue;
    }

    const branch = normalizeBranchKey(enrollment.branch);
    const enrollmentId = enrollment.enrollment_id || enrollment.id || '';
    const className = String(enrollment.class_name || '').trim();
    const items = [{
      enrollment_id: enrollmentId,
      class_id: enrollment.class_id || '',
      class_name: enrollment.class_name || '',
      branch,
      name: className ? `${className} 수강료` : '수강료',
      item_type: TUITION_ITEM_TYPE,
      amount: tuition.amount,
      basis: tuition.basis,
      basis_type: tuition.basis_type,
      billing_date: billingDate
    }];
    for (const extra of resolveExtraItemsForEnrollment(enrollment, templates)) {
      items.push({
        enrollment_id: enrollmentId,
        class_id: enrollment.class_id || '',
        class_name: enrollment.class_name || '',
        branch,
        ...extra,
        billing_date: billingDate
      });
    }
    const itemTotal = items.reduce((sum, item) => sum + toSettlementAmount(item.amount), 0);
    // D-03/D-04: 자동 일할·자동 할인 비활성 — 미리보기 단계 조정은 항상 0.
    const adjustmentTotal = 0;
    const billedAmount = computeBilledAmount({ item_total: itemTotal, active_adjustment_total: adjustmentTotal });
    // D-11: 수강 1건 = 청구서 1건. 학생 단위로 합치지 않는다.
    invoices.push({
      enrollment_id: enrollmentId,
      student_id: enrollment.student_id,
      student_name: enrollment.student_name || '',
      branch,
      class_id: enrollment.class_id || '',
      class_name: enrollment.class_name || '',
      billing_date: billingDate,
      due_date: computeDueDate(billingDate),
      items,
      planned_adjustments: [],
      item_total: itemTotal,
      adjustment_total: adjustmentTotal,
      billed_amount: billedAmount,
      zero_billed: billedAmount === 0
    });
  }

  const appliedTemplateIds = [...new Set(
    invoices.flatMap((inv) => inv.items)
      .filter((item) => item.basis.startsWith('template:'))
      .map((item) => item.basis.slice('template:'.length).split(' ')[0])
  )].sort();
  const appliedPolicyRuleKeys = [...new Set(
    invoices.flatMap((inv) => inv.items)
      .filter((item) => item.basis.startsWith('policy:'))
      .map((item) => item.basis.slice('policy:'.length))
  )].sort();

  return {
    rule_version: BILLING_RULE_VERSION,
    year,
    month,
    snapshot: {
      source_counts: {
        enrollments: (enrollments || []).length,
        templates: (templates || []).length,
        policy_rules: (policyRules || []).length
      },
      applied_template_ids: appliedTemplateIds,
      applied_policy_rule_keys: appliedPolicyRuleKeys,
      decisions: {
        anchor: 'D-01 학생 등원 시작일 기준(없는 날짜는 말일 당김)',
        due: 'D-02 청구일 + 1개월',
        pro_rata: 'D-03 자동 일할 비활성(수동 조정만)',
        auto_discount: 'D-04 자동 할인 비활성(수동 조정만)',
        invoice_unit: 'D-11 수강별 별도 청구(학생 단위 통합 없음)'
      }
    },
    invoices,
    excluded,
    totals: {
      invoices_count: invoices.length,
      students_count: new Set(invoices.map((inv) => inv.student_id)).size,
      items_count: invoices.reduce((sum, inv) => sum + inv.items.length, 0),
      excluded_count: excluded.length,
      item_total: invoices.reduce((sum, inv) => sum + inv.item_total, 0),
      adjustment_total: 0,
      billed_total: invoices.reduce((sum, inv) => sum + inv.billed_amount, 0),
      zero_billed_count: invoices.filter((inv) => inv.zero_billed).length
    }
  };
}
