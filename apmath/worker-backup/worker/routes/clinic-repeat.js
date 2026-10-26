// Teacher-only route for teacher-confirmed repeat operations.
//
// Wiring (performed by ROOT/A, not by this module):
//   import { handleClinicRepeat } from './routes/clinic-repeat.js';
//   ...
//   if (path[1] === 'clinic-repeat') {
//     const teacher = await verifyAuth(request, env);
//     const routed = await handleClinicRepeat(request, env, teacher, path, url);
//     if (routed) return routed;
//   }
//
// This handler never creates an exam assignment and never calls the archive2
// issue path. It only reserves and reconciles a round that the teacher then
// issues through the existing confirmed recommendation flow.

import { readJsonBody, jsonResponse } from '../helpers/response.js';
import {
  CLINIC_REPEAT_CONTRACT,
  CLOSE_REASONS,
  UNRESOLVED_REASONS,
  aggregateRoundEvidence,
  authorizeClinicRepeatScope,
  clinicRepeatError,
  evaluateClinicRepeatPolicy,
  evaluateClinicRepeatPoliciesForStatus,
  findAssignmentsForOperation,
  findPolicyForSource,
  isClinicRepeatError,
  listPoliciesLight,
  loadAssignmentEvidence,
  loadAssignmentEvidenceBatch,
  loadClinicRepeatAvailability,
  loadOperationAssignmentCandidates,
  loadStatusPoliciesForStudent,
  loadPolicyById,
  loadRoundById,
  loadRoundByOperationId,
  nowIso,
  settingsEqual,
  sourceIdentityFor,
  validateClinicRepeatCandidate,
  validateClinicRepeatSettings,
  validateEvidenceSignature,
  validateExpectedRevision,
  validateOperationId,
  verifyIssuedRoundAssignments,
  MAX_STATUS_POLICIES,
} from '../helpers/clinic-repeat.js';

const ROUTE = 'clinic-repeat';

function text(value) {
  return String(value == null ? '' : value).trim();
}

function ok(data = {}) {
  return jsonResponse({ success: true, feature: ROUTE, contractVersion: CLINIC_REPEAT_CONTRACT, ...data });
}

function fail(message, status = 400, code = 'INVALID_INPUT', extra = {}) {
  return jsonResponse({
    success: false,
    feature: ROUTE,
    available: true,
    contractVersion: CLINIC_REPEAT_CONTRACT,
    code,
    message,
    ...extra,
  }, status);
}

function errorResponse(error) {
  if (isClinicRepeatError(error)) {
    return fail(error.message, error.status || 400, error.code || 'INVALID_INPUT', error.extra || {});
  }
  console.warn('[clinic-repeat] unexpected error:', error);
  return fail('반복 운영 처리에 실패했습니다.', 500, 'INTERNAL_ERROR');
}

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function readScope(body, url) {
  const classId = text(body?.classId ?? body?.class_id ?? url.searchParams.get('classId') ?? url.searchParams.get('class_id'));
  const studentId = text(body?.studentId ?? body?.student_id ?? url.searchParams.get('studentId') ?? url.searchParams.get('student_id'));
  return { classId, studentId };
}

function requireScope(scope) {
  if (!scope.classId) throw clinicRepeatError('CLASS_REQUIRED', '반을 선택하세요.', 400);
  if (!scope.studentId) throw clinicRepeatError('STUDENT_REQUIRED', '학생을 선택하세요.', 400);
}

async function requireAuthorizedScope(env, teacher, scope) {
  const authorization = await authorizeClinicRepeatScope(env, teacher, scope.classId, scope.studentId);
  if (authorization.error) {
    throw clinicRepeatError(authorization.error.code, authorization.error.message, authorization.error.status);
  }
}

function sameIdSet(left, right) {
  const normalize = value => Array.from(new Set((Array.isArray(value) ? value : []).map(text).filter(Boolean))).sort();
  const a = normalize(left);
  const b = normalize(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function publicPolicyResult(result) {
  const { settingsJson, ...policy } = result.policy;
  return {
    contractVersion: CLINIC_REPEAT_CONTRACT,
    policy,
    rounds: result.rounds,
    evaluation: result.evaluation,
  };
}

function publicLightPolicy(policy) {
  const { settingsJson, ...rest } = policy;
  return rest;
}

// Ordering hint only. The status union query already guarantees that open-round
// policies are evaluated even when this write fails, so a failure here must not
// fail the authoritative round transition.
async function touchPolicy(env, policyId, timestamp) {
  if (!policyId) return;
  try {
    await env.DB.prepare(
      'UPDATE clinic_repeat_policies SET updated_at = ? WHERE id = ?',
    ).bind(timestamp, policyId).run();
  } catch { /* visibility falls back to the open-round union query */ }
}

// ---------------------------------------------------------------------------
// GET /api/clinic-repeat/policies?classId=&studentId=
// ---------------------------------------------------------------------------

async function listPolicies(env, teacher, url) {
  const scope = readScope({}, url);
  requireScope(scope);
  await requireAuthorizedScope(env, teacher, scope);
  const policies = await listPoliciesLight(env, scope.classId, scope.studentId);
  return ok({
    available: true,
    classId: scope.classId,
    studentId: scope.studentId,
    policies: policies.map(publicLightPolicy),
  });
}

// ---------------------------------------------------------------------------
// GET /api/clinic-repeat/status?classId=&studentId=
// ---------------------------------------------------------------------------

async function getStatus(env, teacher, url) {
  const scope = readScope({}, url);
  requireScope(scope);
  await requireAuthorizedScope(env, teacher, scope);
  const statusSet = await loadStatusPoliciesForStudent(env, scope.classId, scope.studentId);
  // Every listed policy is evaluated, but evidence is read with a fixed number
  // of set-based queries instead of one round-trip chain per policy, so a cold
  // status request stays inside the Free-plan 50-queries-per-invocation limit.
  const evaluatedResults = await evaluateClinicRepeatPoliciesForStatus(env, statusSet.policies, {
    classId: scope.classId,
    studentId: scope.studentId,
  });
  const evaluated = evaluatedResults.map(publicPolicyResult);
  return ok({
    available: true,
    classId: scope.classId,
    studentId: scope.studentId,
    generatedAt: nowIso(),
    evaluatedLimit: MAX_STATUS_POLICIES,
    evaluatedCount: evaluated.length,
    truncated: statusSet.truncated === true,
    openRoundPolicyIds: statusSet.openRoundPolicyIds,
    policies: evaluated,
  });
}

// ---------------------------------------------------------------------------
// POST /api/clinic-repeat/policies
// ---------------------------------------------------------------------------

async function createPolicy(request, env, teacher) {
  const body = await readJsonBody(request);
  const scope = readScope(body, new URL(request.url));
  requireScope(scope);
  const sourceAssignmentId = text(body.sourceAssignmentId ?? body.source_assignment_id);
  if (!sourceAssignmentId) {
    throw clinicRepeatError('SOURCE_ASSIGNMENT_REQUIRED', '기준 시험 배정을 선택하세요.', 400);
  }
  const requestedSessionId = text(body.sourceSessionId ?? body.source_session_id);
  if (requestedSessionId.length > 200) {
    throw clinicRepeatError('INVALID_SOURCE_SESSION', '기준 응시 번호가 올바르지 않습니다.', 400);
  }
  const settings = validateClinicRepeatSettings(body.settings);
  await requireAuthorizedScope(env, teacher, scope);

  const source = await loadAssignmentEvidence(env, {
    classId: scope.classId,
    studentId: scope.studentId,
    assignmentId: sourceAssignmentId,
    strict: true,
  });
  if (!['NOT_SUBMITTED', 'PARTIAL', 'LEGACY_NO_RESULT_ITEMS', 'COMPLETE'].includes(source.status)) {
    throw clinicRepeatError('SOURCE_NOT_AUTHORIZED', '기준 시험 배정을 확인할 수 없습니다.', 409, {
      sourceStatus: source.status,
      sourceReason: source.reason,
    });
  }
  if (requestedSessionId && source.sessionId && requestedSessionId !== source.sessionId) {
    throw clinicRepeatError('SOURCE_SESSION_MISMATCH', '기준 응시 기록이 요청과 일치하지 않습니다.', 409, {
      sourceSessionId: source.sessionId,
    });
  }
  const resolvedSessionId = source.sessionId || requestedSessionId || null;

  const existing = await findPolicyForSource(env, scope.classId, scope.studentId, sourceAssignmentId);
  if (existing) {
    const evaluated = await evaluateClinicRepeatPolicy(env, existing, { strict: false });
    if (evaluated.policy.settings && settingsEqual(evaluated.policy.settings, settings)) {
      return ok({
        available: true,
        created: false,
        existing: true,
        ...publicPolicyResult(evaluated),
      });
    }
    return fail('이미 이 기준 시험의 반복 정책이 있습니다. 기존 설정을 수정하세요.', 409, 'POLICY_EXISTS', {
      policyId: existing.policyId,
      revision: existing.revision,
    });
  }

  const policyId = newId();
  const timestamp = nowIso();
  const insert = await env.DB.prepare(
    `INSERT INTO clinic_repeat_policies
      (id, class_id, student_id, source_assignment_id, source_session_id, status, revision,
       settings_json, created_by_teacher_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'ACTIVE', 1, ?, ?, ?, ?)
     ON CONFLICT DO NOTHING`,
  ).bind(
    policyId,
    scope.classId,
    scope.studentId,
    sourceAssignmentId,
    resolvedSessionId,
    JSON.stringify(settings),
    teacher.id,
    timestamp,
    timestamp,
  ).run();
  if (Number(insert?.meta?.changes || 0) === 0) {
    const raced = await findPolicyForSource(env, scope.classId, scope.studentId, sourceAssignmentId);
    if (!raced) throw clinicRepeatError('POLICY_CREATE_CONFLICT', '반복 정책을 저장하지 못했습니다.', 409);
    return fail('이미 이 기준 시험의 반복 정책이 있습니다.', 409, 'POLICY_EXISTS', {
      policyId: raced.policyId,
      revision: raced.revision,
    });
  }

  const policy = await loadPolicyById(env, policyId);
  const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
  return ok({
    available: true,
    created: true,
    existing: false,
    ...publicPolicyResult(evaluated),
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/clinic-repeat/policies/:policyId
// ---------------------------------------------------------------------------

async function loadAuthorizedPolicy(env, teacher, policyId) {
  const policy = await loadPolicyById(env, policyId);
  if (!policy) throw clinicRepeatError('POLICY_NOT_FOUND', '반복 정책을 찾을 수 없습니다.', 404);
  await requireAuthorizedScope(env, teacher, { classId: policy.classId, studentId: policy.studentId });
  return policy;
}

async function updatePolicy(request, env, teacher, policyId) {
  const body = await readJsonBody(request);
  const expectedRevision = validateExpectedRevision(body.expectedRevision ?? body.expected_revision);
  const settings = validateClinicRepeatSettings(body.settings);
  const policy = await loadAuthorizedPolicy(env, teacher, policyId);
  if (policy.status === 'CLOSED') {
    throw clinicRepeatError('POLICY_CLOSED', '종료된 반복 정책은 수정할 수 없습니다. 다시 시작하려면 재개하세요.', 409, {
      policyId,
      revision: policy.revision,
    });
  }
  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_policies
     SET settings_json = ?, revision = revision + 1, updated_at = ?
     WHERE id = ? AND revision = ? AND status = 'ACTIVE'`,
  ).bind(JSON.stringify(settings), timestamp, policyId, expectedRevision).run();
  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadAuthorizedPolicy(env, teacher, policyId);
    throw clinicRepeatError('REVISION_CONFLICT', '다른 화면에서 설정이 먼저 변경되었습니다. 다시 확인하세요.', 409, {
      policyId,
      revision: current.revision,
      status: current.status,
    });
  }
  const updated = await loadPolicyById(env, policyId);
  const evaluated = await evaluateClinicRepeatPolicy(env, updated, { strict: false });
  return ok({ available: true, updated: true, ...publicPolicyResult(evaluated) });
}

// ---------------------------------------------------------------------------
// POST /api/clinic-repeat/policies/:policyId/close | /reopen
// ---------------------------------------------------------------------------

async function closePolicy(request, env, teacher, policyId) {
  const body = await readJsonBody(request);
  const expectedRevision = validateExpectedRevision(body.expectedRevision ?? body.expected_revision);
  const reason = text(body.reason).toUpperCase();
  if (!CLOSE_REASONS.includes(reason)) {
    throw clinicRepeatError('INVALID_CLOSE_REASON', '종료 사유를 선택하세요.', 400);
  }
  const policy = await loadAuthorizedPolicy(env, teacher, policyId);
  if (policy.status === 'CLOSED' && policy.closedReason === reason) {
    const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
    return ok({ available: true, closed: true, existing: true, ...publicPolicyResult(evaluated) });
  }
  if (policy.status !== 'ACTIVE') {
    throw clinicRepeatError('POLICY_CLOSED', '이미 종료된 반복 정책입니다.', 409, { policyId, revision: policy.revision });
  }
  // Never close a policy while a round still needs confirmation/recovery.
  const openRound = await env.DB.prepare(
    `SELECT id, status FROM clinic_repeat_rounds
     WHERE policy_id = ? AND status IN ('RESERVED', 'UNRESOLVED') LIMIT 1`,
  ).bind(policyId).first();
  if (openRound) {
    throw clinicRepeatError('OPEN_ROUND_EXISTS',
      '확인 대기 중인 회차가 있어 종료할 수 없습니다. 회차를 확정하거나 해제한 뒤 다시 시도하세요.', 409, {
        policyId,
        roundId: text(openRound.id),
        roundStatus: text(openRound.status),
      });
  }
  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_policies
     SET status = 'CLOSED', closed_at = ?, closed_reason = ?, closed_by_teacher_id = ?,
         revision = revision + 1, updated_at = ?
     WHERE id = ? AND revision = ? AND status = 'ACTIVE'`,
  ).bind(timestamp, reason, teacher.id, timestamp, policyId, expectedRevision).run();
  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadAuthorizedPolicy(env, teacher, policyId);
    throw clinicRepeatError('REVISION_CONFLICT', '다른 화면에서 정책이 먼저 변경되었습니다. 다시 확인하세요.', 409, {
      policyId,
      revision: current.revision,
      status: current.status,
    });
  }
  const closed = await loadPolicyById(env, policyId);
  const evaluated = await evaluateClinicRepeatPolicy(env, closed, { strict: false });
  return ok({ available: true, closed: true, existing: false, ...publicPolicyResult(evaluated) });
}

async function reopenPolicy(request, env, teacher, policyId) {
  const body = await readJsonBody(request);
  const expectedRevision = validateExpectedRevision(body.expectedRevision ?? body.expected_revision);
  const policy = await loadAuthorizedPolicy(env, teacher, policyId);
  if (policy.status === 'ACTIVE') {
    const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
    return ok({ available: true, reopened: true, existing: true, ...publicPolicyResult(evaluated) });
  }
  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_policies
     SET status = 'ACTIVE', closed_at = NULL, closed_reason = NULL, closed_by_teacher_id = NULL,
         revision = revision + 1, updated_at = ?
     WHERE id = ? AND revision = ? AND status = 'CLOSED'`,
  ).bind(timestamp, policyId, expectedRevision).run();
  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadAuthorizedPolicy(env, teacher, policyId);
    throw clinicRepeatError('REVISION_CONFLICT', '다른 화면에서 정책이 먼저 변경되었습니다. 다시 확인하세요.', 409, {
      policyId,
      revision: current.revision,
      status: current.status,
    });
  }
  const reopened = await loadPolicyById(env, policyId);
  const evaluated = await evaluateClinicRepeatPolicy(env, reopened, { strict: false });
  return ok({ available: true, reopened: true, existing: false, ...publicPolicyResult(evaluated) });
}

// ---------------------------------------------------------------------------
// POST /api/clinic-repeat/policies/:policyId/rounds
// ---------------------------------------------------------------------------

async function reserveRound(request, env, teacher, policyId) {
  const body = await readJsonBody(request);
  if (body.confirmed !== true) {
    throw clinicRepeatError('CONFIRMATION_REQUIRED', '선생님 확인 후에만 다음 회차를 준비할 수 있습니다.', 400);
  }
  const expectedRevision = validateExpectedRevision(body.expectedRevision ?? body.expected_revision);
  const expectedEvidenceSignature = validateEvidenceSignature(body.expectedEvidenceSignature ?? body.expected_evidence_signature);
  const operationId = validateOperationId(body.operationId ?? body.operation_id);
  const candidate = validateClinicRepeatCandidate(body.candidate);

  const policy = await loadAuthorizedPolicy(env, teacher, policyId);

  const existingOperation = await loadRoundByOperationId(env, operationId);
  if (existingOperation) {
    if (existingOperation.policyId !== policyId) {
      throw clinicRepeatError('FOREIGN_OPERATION', '다른 정책의 회차 작업 번호입니다.', 409, {
        operationId,
        policyId: existingOperation.policyId,
      });
    }
    if (existingOperation.status === 'ISSUED' || existingOperation.status === 'RELEASED') {
      // A terminal round must never be returned as a new reservation: that made
      // a policy single-round per page session and hid post-release rounds.
      throw clinicRepeatError('OPERATION_FINALIZED',
        '이미 종료된 회차 작업 번호입니다. 새 회차를 준비하세요.', 409, {
          operationId,
          roundId: existingOperation.roundId,
          status: existingOperation.status,
        });
    }
    const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
    // Idempotent retry: report any assignments already spent under this
    // operation so the UI reconciles instead of issuing a second group.
    const found = await findAssignmentsForOperation(env, policy.classId, operationId);
    return ok({
      available: true,
      reserved: false,
      idempotent: true,
      round: existingOperation,
      assignmentDiscoverySupported: found.supported === true,
      existingAssignmentIds: found.supported ? found.assignmentIds : null,
      ...publicPolicyResult(evaluated),
    });
  }

  if (policy.status === 'CLOSED') {
    throw clinicRepeatError('POLICY_CLOSED', '종료된 반복 정책에서는 회차를 준비할 수 없습니다.', 409, { policyId });
  }
  if (policy.revision !== expectedRevision) {
    throw clinicRepeatError('REVISION_CONFLICT', '정책 설정이 변경되었습니다. 다시 확인하세요.', 409, {
      policyId,
      revision: policy.revision,
    });
  }

  const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: true });
  if (!evaluated.evaluation.canReserve) {
    throw clinicRepeatError(evaluated.evaluation.reasonCode || 'ROUND_NOT_AVAILABLE',
      evaluated.evaluation.label || '지금은 다음 회차를 준비할 수 없습니다.', 409, {
        evaluation: evaluated.evaluation,
      });
  }
  if (evaluated.evaluation.evidenceSignature !== expectedEvidenceSignature) {
    throw clinicRepeatError('EVIDENCE_CHANGED', '결과 근거가 바뀌었습니다. 화면을 새로고침한 뒤 다시 확인하세요.', 409, {
      evaluation: evaluated.evaluation,
    });
  }

  const observedSessionId = text(evaluated.evaluation.source?.sessionId) || null;
  if (policy.sourceSessionId && observedSessionId && policy.sourceSessionId !== observedSessionId) {
    throw clinicRepeatError('SOURCE_SESSION_CHANGED', '기준 응시 기록이 바뀌었습니다. 정책을 다시 확인하세요.', 409, {
      policySourceSessionId: policy.sourceSessionId,
      observedSourceSessionId: observedSessionId,
    });
  }

  const nextRound = await env.DB.prepare(
    'SELECT COALESCE(MAX(round_no), 0) + 1 AS next_round FROM clinic_repeat_rounds WHERE policy_id = ?',
  ).bind(policyId).first();
  const roundNo = Number(nextRound?.next_round || 1);
  if (!Number.isInteger(roundNo) || roundNo < 1) {
    throw clinicRepeatError('ROUND_NUMBER_UNAVAILABLE', '회차 번호를 확인할 수 없습니다.', 409);
  }

  const roundId = newId();
  const timestamp = nowIso();
  const sourceEvidence = {
    schema: CLINIC_REPEAT_CONTRACT,
    sourceAssignmentId: policy.sourceAssignmentId,
    sourceSessionId: observedSessionId,
    sourceIdentity: sourceIdentityFor(policy.sourceAssignmentId, observedSessionId),
    evidence: evaluated.evaluation.source,
    capturedAt: timestamp,
  };
  const insert = await env.DB.prepare(
    `INSERT INTO clinic_repeat_rounds
      (id, policy_id, class_id, student_id, round_no, policy_revision, operation_id, status,
       settings_snapshot_json, source_evidence_json, evidence_signature, candidate_summary_json,
       assignment_ids_json, saved_paper_ids_json, attempt_evidence_json,
       confirmed_by_teacher_id, confirmed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'RESERVED', ?, ?, ?, ?, '[]', '[]', '[]', ?, ?, ?, ?)
     ON CONFLICT DO NOTHING`,
  ).bind(
    roundId,
    policyId,
    policy.classId,
    policy.studentId,
    roundNo,
    policy.revision,
    operationId,
    JSON.stringify(evaluated.policy.settings),
    JSON.stringify(sourceEvidence),
    expectedEvidenceSignature,
    JSON.stringify(candidate),
    teacher.id,
    timestamp,
    timestamp,
    timestamp,
  ).run();

  if (Number(insert?.meta?.changes || 0) === 0) {
    const raced = await loadRoundByOperationId(env, operationId);
    if (raced && raced.policyId === policyId) {
      if (raced.status === 'ISSUED' || raced.status === 'RELEASED') {
        throw clinicRepeatError('OPERATION_FINALIZED',
          '이미 종료된 회차 작업 번호입니다. 새 회차를 준비하세요.', 409, {
            operationId,
            roundId: raced.roundId,
            status: raced.status,
          });
      }
      const racedEvaluation = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
      const found = await findAssignmentsForOperation(env, policy.classId, operationId);
      return ok({
        available: true,
        reserved: false,
        idempotent: true,
        round: raced,
        assignmentDiscoverySupported: found.supported === true,
        existingAssignmentIds: found.supported ? found.assignmentIds : null,
        ...publicPolicyResult(racedEvaluation),
      });
    }
    const open = await env.DB.prepare(
      `SELECT id FROM clinic_repeat_rounds
       WHERE policy_id = ? AND status IN ('RESERVED', 'UNRESOLVED') LIMIT 1`,
    ).bind(policyId).first();
    if (open) {
      throw clinicRepeatError('OPEN_ROUND_EXISTS', '이미 확인 대기 중인 회차가 있습니다.', 409, { roundId: text(open.id) });
    }
    throw clinicRepeatError('ROUND_ALREADY_RESERVED', '같은 회차가 이미 준비되었습니다. 화면을 새로고침하세요.', 409, { roundNo });
  }

  if (!policy.sourceSessionId && observedSessionId) {
    await env.DB.prepare(
      `UPDATE clinic_repeat_policies SET source_session_id = ?
       WHERE id = ? AND source_session_id IS NULL`,
    ).bind(observedSessionId, policyId).run();
  }
  await touchPolicy(env, policyId, timestamp);

  const reserved = await loadRoundById(env, roundId);
  const refreshedPolicy = await loadPolicyById(env, policyId);
  const refreshedEvaluation = await evaluateClinicRepeatPolicy(env, refreshedPolicy, { strict: false });
  return ok({
    available: true,
    reserved: true,
    idempotent: false,
    round: reserved,
    nextAction: 'ISSUE_VIA_EXISTING_CONFIRMED_FLOW',
    ...publicPolicyResult(refreshedEvaluation),
  });
}

// ---------------------------------------------------------------------------
// POST /api/clinic-repeat/rounds/:roundId/confirm | /unresolved | /release
// ---------------------------------------------------------------------------

async function loadAuthorizedRound(env, teacher, roundId) {
  const round = await loadRoundById(env, roundId);
  if (!round) throw clinicRepeatError('ROUND_NOT_FOUND', '반복 회차를 찾을 수 없습니다.', 404);
  const policy = await loadAuthorizedPolicy(env, teacher, round.policyId);
  return { round, policy };
}

function requireRoundOperation(round, body) {
  const operationId = validateOperationId(body.operationId ?? body.operation_id);
  if (round.operationId !== operationId) {
    throw clinicRepeatError('FOREIGN_OPERATION', '이 회차의 작업 번호가 아닙니다.', 409, {
      roundId: round.roundId,
    });
  }
  return operationId;
}

async function confirmRound(request, env, teacher, roundId) {
  const body = await readJsonBody(request);
  const { round, policy } = await loadAuthorizedRound(env, teacher, roundId);
  const operationId = requireRoundOperation(round, body);
  const rawAssignmentIds = Array.isArray(body.assignmentIds)
    ? body.assignmentIds
    : Array.isArray(body.assignment_ids) ? body.assignment_ids : [];
  const assignmentIds = Array.from(new Set(rawAssignmentIds.map(text).filter(Boolean)));

  if (round.status === 'ISSUED') {
    if (sameIdSet(round.assignmentIds, assignmentIds)) {
      const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
      return ok({ available: true, confirmed: true, idempotent: true, round, ...publicPolicyResult(evaluated) });
    }
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '이미 다른 배정으로 확정된 회차입니다.', 409, {
      roundId,
      assignmentIds: round.assignmentIds,
    });
  }
  if (round.status === 'RELEASED') {
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '해제된 회차는 확정할 수 없습니다.', 409, { roundId });
  }

  const verified = await verifyIssuedRoundAssignments(env, {
    teacher,
    policy,
    round,
    assignmentIds,
  });

  let attempt;
  try {
    const rows = await loadAssignmentEvidenceBatch(env, {
      classId: policy.classId,
      studentId: policy.studentId,
      assignmentIds: verified.assignmentIds,
      strict: false,
    });
    attempt = aggregateRoundEvidence(rows);
  } catch {
    attempt = null;
  }

  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_rounds
     SET status = 'ISSUED',
         assignment_ids_json = ?,
         saved_paper_ids_json = ?,
         attempt_evidence_json = ?,
         reconciled_at = ?,
         status_reason = NULL,
         updated_at = ?
     WHERE id = ? AND policy_id = ? AND operation_id = ? AND status IN ('RESERVED', 'UNRESOLVED')`,
  ).bind(
    JSON.stringify(verified.assignmentIds),
    JSON.stringify(verified.savedPaperIds),
    JSON.stringify(attempt ? [{
      status: attempt.status,
      complete: attempt.complete,
      questionCount: attempt.questionCount,
      resultItemCount: attempt.resultItemCount,
      wrongCount: attempt.wrongCount,
      observedWrongCount: attempt.observedWrongCount,
      sessionIds: attempt.sessionIds,
      rows: attempt.rows,
    }] : []),
    timestamp,
    timestamp,
    roundId,
    round.policyId,
    operationId,
  ).run();

  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadRoundById(env, roundId);
    if (current?.status === 'ISSUED' && sameIdSet(current.assignmentIds, verified.assignmentIds)) {
      const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
      return ok({ available: true, confirmed: true, idempotent: true, round: current, ...publicPolicyResult(evaluated) });
    }
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '회차 상태가 변경되어 확정하지 못했습니다. 다시 확인하세요.', 409, {
      roundId,
      status: current?.status || null,
    });
  }

  const confirmed = await loadRoundById(env, roundId);
  await touchPolicy(env, round.policyId, timestamp);
  // Surface any other assignment group already spent under this operation so a
  // duplicate issue is visible instead of silently hidden by the linkage.
  const spent = await findAssignmentsForOperation(env, policy.classId, operationId);
  const linked = new Set(verified.assignmentIds);
  const additionalAssignmentIds = spent.supported
    ? spent.assignmentIds.filter(id => !linked.has(id)) : [];
  const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
  return ok({
    available: true,
    confirmed: true,
    idempotent: false,
    round: confirmed,
    verifiedAssignments: verified.assignments,
    policyQuestionCount: verified.policyQuestionCount,
    policyQuestionCountMismatch: verified.policyQuestionCountMismatch === true,
    assignmentDiscoverySupported: spent.supported === true,
    additionalAssignmentIds,
    ...publicPolicyResult(evaluated),
  });
}

async function markRoundUnresolved(request, env, teacher, roundId) {
  const body = await readJsonBody(request);
  const { round, policy } = await loadAuthorizedRound(env, teacher, roundId);
  const operationId = requireRoundOperation(round, body);
  const reason = text(body.reason).toUpperCase() || 'ISSUE_OUTCOME_UNKNOWN';
  if (!UNRESOLVED_REASONS.includes(reason)) {
    throw clinicRepeatError('INVALID_UNRESOLVED_REASON', '미확정 사유를 확인하세요.', 400);
  }
  if (round.status === 'UNRESOLVED') {
    const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
    return ok({ available: true, unresolved: true, idempotent: true, round, ...publicPolicyResult(evaluated) });
  }
  if (round.status !== 'RESERVED') {
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '확인 대기 중인 회차만 미확정으로 표시할 수 있습니다.', 409, {
      roundId,
      status: round.status,
    });
  }
  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_rounds
     SET status = 'UNRESOLVED', status_reason = ?, updated_at = ?
     WHERE id = ? AND operation_id = ? AND status = 'RESERVED'`,
  ).bind(reason, timestamp, roundId, operationId).run();
  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadRoundById(env, roundId);
    if (current?.status === 'UNRESOLVED') {
      const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
      return ok({ available: true, unresolved: true, idempotent: true, round: current, ...publicPolicyResult(evaluated) });
    }
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '회차 상태가 변경되어 미확정으로 표시하지 못했습니다.', 409, {
      roundId,
      status: current?.status || null,
    });
  }
  const current = await loadRoundById(env, roundId);
  await touchPolicy(env, round.policyId, timestamp);
  const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
  return ok({ available: true, unresolved: true, idempotent: false, round: current, ...publicPolicyResult(evaluated) });
}

async function releaseRound(request, env, teacher, roundId) {
  const body = await readJsonBody(request);
  const { round, policy } = await loadAuthorizedRound(env, teacher, roundId);
  const operationId = requireRoundOperation(round, body);
  if (round.status === 'RELEASED') {
    const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
    return ok({ available: true, released: true, idempotent: true, round, ...publicPolicyResult(evaluated) });
  }
  if (round.status !== 'RESERVED') {
    throw clinicRepeatError('RELEASE_BLOCKED_UNKNOWN_OR_ISSUED',
      '발행 여부가 확정되지 않았거나 이미 발행된 회차는 해제할 수 없습니다. 먼저 배정을 확인하세요.', 409, {
        roundId,
        status: round.status,
      });
  }
  const found = await findAssignmentsForOperation(env, round.classId, round.operationId);
  if (!found.supported) {
    throw clinicRepeatError('RELEASE_UNVERIFIED',
      '배정 발행 여부를 확인할 수 없어 회차를 해제하지 않았습니다. 배정 목록을 직접 확인하세요.', 409, {
        roundId,
      });
  }
  if (found.assignmentIds.length) {
    throw clinicRepeatError('RELEASE_BLOCKED_ISSUED',
      '이미 이 회차의 배정이 발행되어 해제할 수 없습니다. 배정을 회차로 확정하세요.', 409, {
        roundId,
        assignmentIds: found.assignmentIds,
      });
  }
  const timestamp = nowIso();
  const update = await env.DB.prepare(
    `UPDATE clinic_repeat_rounds
     SET status = 'RELEASED', released_at = ?, status_reason = 'RELEASED_UNUSED', updated_at = ?
     WHERE id = ? AND operation_id = ? AND status = 'RESERVED'`,
  ).bind(timestamp, timestamp, roundId, operationId).run();
  if (Number(update?.meta?.changes || 0) === 0) {
    const current = await loadRoundById(env, roundId);
    if (current?.status === 'RELEASED') {
      const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
      return ok({ available: true, released: true, idempotent: true, round: current, ...publicPolicyResult(evaluated) });
    }
    throw clinicRepeatError('ROUND_STATE_CONFLICT', '회차 상태가 변경되어 해제하지 못했습니다.', 409, {
      roundId,
      status: current?.status || null,
    });
  }
  const current = await loadRoundById(env, roundId);
  await touchPolicy(env, round.policyId, timestamp);
  const evaluated = await evaluateClinicRepeatPolicy(env, policy, { strict: false });
  return ok({ available: true, released: true, idempotent: false, round: current, ...publicPolicyResult(evaluated) });
}

// ---------------------------------------------------------------------------
// GET /api/clinic-repeat/rounds/:roundId/candidates
// ---------------------------------------------------------------------------

async function getRoundCandidates(env, teacher, roundId) {
  const { round, policy } = await loadAuthorizedRound(env, teacher, roundId);
  const discovery = await loadOperationAssignmentCandidates(env, {
    classId: policy.classId,
    studentId: policy.studentId,
    operationId: round.operationId,
  });
  if (!discovery.supported) {
    throw clinicRepeatError('CANDIDATES_UNAVAILABLE',
      '배정 목록을 확인할 수 없는 환경입니다. 기존 배정 절차에서 직접 확인하세요.', 503, { roundId });
  }
  const suggested = round.assignmentIds.length
    ? round.assignmentIds
    : discovery.suggestedAssignmentIds;
  return ok({
    available: true,
    roundId: round.roundId,
    policyId: round.policyId,
    operationId: round.operationId,
    status: round.status,
    storedAssignmentIds: round.assignmentIds,
    suggestedAssignmentIds: suggested,
    candidates: discovery.candidates,
    groups: discovery.groups,
    discovery: suggested.length ? 'FOUND' : 'NONE',
  });
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export async function handleClinicRepeat(request, env, teacher, path, url) {
  if (path[1] !== ROUTE) return null;

  const availability = await loadClinicRepeatAvailability(env);
  if (!availability.available) {
    return jsonResponse({
      success: false,
      feature: ROUTE,
      available: false,
      contractVersion: CLINIC_REPEAT_CONTRACT,
      code: 'FEATURE_UNAVAILABLE',
      message: '추천클리닉 반복 운영 기능이 아직 준비되지 않았습니다. 기존 수동 배정·클리닉은 그대로 사용할 수 있습니다.',
      missing: availability.missing,
    }, 200);
  }

  const method = request.method;
  const resource = path[2];
  const id = text(path[3]);
  const action = text(path[4]);

  try {
    if (method === 'GET' && resource === 'policies' && !id) return await listPolicies(env, teacher, url);
    if (method === 'GET' && resource === 'status' && !id) return await getStatus(env, teacher, url);
    if (method === 'POST' && resource === 'policies' && !id) return await createPolicy(request, env, teacher);
    if (resource === 'policies' && id) {
      if (method === 'PATCH' && !action) return await updatePolicy(request, env, teacher, id);
      if (method === 'POST' && action === 'close') return await closePolicy(request, env, teacher, id);
      if (method === 'POST' && action === 'reopen') return await reopenPolicy(request, env, teacher, id);
      if (method === 'POST' && action === 'rounds') return await reserveRound(request, env, teacher, id);
    }
    if (resource === 'rounds' && id && method === 'GET' && action === 'candidates') {
      return await getRoundCandidates(env, teacher, id);
    }
    if (resource === 'rounds' && id && method === 'POST') {
      if (action === 'confirm') return await confirmRound(request, env, teacher, id);
      if (action === 'unresolved') return await markRoundUnresolved(request, env, teacher, id);
      if (action === 'release') return await releaseRound(request, env, teacher, id);
    }
    return null;
  } catch (error) {
    return errorResponse(error);
  }
}

export const CLINIC_REPEAT_ROUTE = ROUTE;
