const OPERATIONS = new Set([
  "ADD_RECIPIENTS",
  "EXCLUDE",
  "RESTORE",
  "CANCEL",
  "REPLACEMENT_ASSIGNMENT",
]);

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

export async function hasAssignmentLifecycleEvents(env) {
  return Boolean(await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='class_exam_assignment_lifecycle_events'",
  ).first().catch(() => null));
}

export function assignmentLifecycleError(message, status = 409) {
  return Object.assign(new Error(message), { status });
}

export function assignmentOperationIdentity(operation, ...parts) {
  if (!OPERATIONS.has(operation)) throw assignmentLifecycleError("invalid assignment lifecycle operation", 400);
  return [operation, ...parts.map(value => String(value ?? "").trim())].join(":");
}

export async function existingAssignmentLifecycleEvent(env, event) {
  if (!(await hasAssignmentLifecycleEvents(env)))
    throw assignmentLifecycleError("Assignment lifecycle migration is required", 503);
  if (!OPERATIONS.has(event.operation))
    throw assignmentLifecycleError("invalid assignment lifecycle operation", 400);
  const operationIdentity = String(event.operation_identity || "").trim();
  if (!operationIdentity || operationIdentity.length > 300)
    throw assignmentLifecycleError("operation_identity is required", 400);
  const existing = await env.DB.prepare(
    "SELECT * FROM class_exam_assignment_lifecycle_events WHERE operation_identity=? LIMIT 1",
  ).bind(operationIdentity).first();
  if (!existing) return null;
  const same = existing.assignment_id === event.assignment_id &&
    (existing.related_assignment_id || null) === (event.related_assignment_id || null) &&
    (existing.saved_paper_id || null) === (event.saved_paper_id || null) &&
    (existing.student_id || null) === (event.student_id || null) &&
    existing.actor_teacher_id === event.actor_teacher_id &&
    existing.operation === event.operation &&
    stableJson(JSON.parse(existing.metadata_json || "{}")) === stableJson(event.metadata || {});
  if (!same) throw assignmentLifecycleError("operation_identity was already used for a different Assignment operation", 409);
  return existing;
}

export function assignmentLifecycleEventStatement(env, event) {
  if (!OPERATIONS.has(event.operation))
    throw assignmentLifecycleError("invalid assignment lifecycle operation", 400);
  const operationIdentity = String(event.operation_identity || "").trim();
  if (!operationIdentity || operationIdentity.length > 300)
    throw assignmentLifecycleError("operation_identity is required", 400);
  return env.DB.prepare(`
    INSERT OR IGNORE INTO class_exam_assignment_lifecycle_events
      (event_id,assignment_id,related_assignment_id,saved_paper_id,student_id,actor_teacher_id,operation,operation_identity,metadata_json)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).bind(
    crypto.randomUUID(),
    event.assignment_id,
    event.related_assignment_id || null,
    event.saved_paper_id || null,
    event.student_id || null,
    event.actor_teacher_id,
    event.operation,
    operationIdentity,
    stableJson(event.metadata || {}),
  );
}
