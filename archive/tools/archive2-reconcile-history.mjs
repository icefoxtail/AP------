import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuestionSnapshot } from "../../apmath/worker-backup/worker/helpers/archive2-questions.js";
import core from "../archive2-core.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const arg = (name) =>
  process.argv
    .find((a) => a.startsWith("--" + name + "="))
    ?.slice(name.length + 3);
if (!arg("input") || !arg("output"))
  throw new Error(
    "Usage: node archive/tools/archive2-reconcile-history.mjs --input=readonly-export.json --output=local-report.json",
  );
const raw = JSON.parse(
  fs.readFileSync(path.resolve(arg("input")), "utf8").replace(/^\uFEFF/, ""),
);
if (
  !Array.isArray(raw) ||
  raw.some(
    (batch) => !batch.success || Number(batch.meta?.rows_written || 0) !== 0,
  )
)
  throw new Error("read-only Wrangler export required");
const [assignments, blueprints, recipientGroups] = raw.map(
  (batch) => batch.results || [],
);
const identity = JSON.parse(
  fs.readFileSync(
    path.join(root, "archive/data/question_identity_map.json"),
    "utf8",
  ),
);
const byUid = new Map(identity.records.map((r) => [r.questionUid, r]));
const bySource = new Map(
  identity.records.map((r) => [
    core.normalizeFile(r.sourceArchiveFile) + "#" + r.sourceOrdinal,
    r,
  ]),
);
const output = {
  mode: "READ_ONLY_CANDIDATE",
  productionWriteAllowed: false,
  assignmentCount: assignments.length,
  expectedQuestions: 0,
  verifiedQuestions: 0,
  unresolvedQuestions: 0,
  aliasOrUnregistered: 0,
  recipients: { verified: 0, legacy_inferred: 0, unresolved: 0 },
  assignments: [],
};
function resolve(q) {
  const file = core.normalizeFile(
    q.sourceArchiveFile || q._sourceFile || q.source_archive_file || "",
  );
  const ordinal = Number(
    q.sourceOrdinal ?? q._sourceQuestionOrdinal ?? q.source_question_ordinal,
  );
  const uid = q.questionUid || q.source_question_uid || "";
  const known = uid ? byUid.get(uid) : bySource.get(file + "#" + ordinal);
  if (
    !known ||
    (file && core.normalizeFile(known.sourceArchiveFile) !== file) ||
    (Number.isInteger(ordinal) &&
      ordinal > 0 &&
      known.sourceOrdinal !== ordinal)
  ) {
    if (uid || file) output.aliasOrUnregistered++;
    return {};
  }
  return {
    ...q,
    questionUid: known.questionUid,
    sourceArchiveFile: known.sourceArchiveFile,
    sourceOrdinal: known.sourceOrdinal,
  };
}
for (const a of assignments) {
  const count = Number(a.question_count);
  if (!Number.isInteger(count) || count < 1 || count > 400)
    throw new Error("invalid question count: " + a.id);
  let questions = Array.from({ length: count }, () => ({})),
    source = "UNRESOLVED";
  if (String(a.archive_file).startsWith("MIXED:")) {
    let payload;
    try {
      payload = JSON.parse(a.mixed_payload_json);
    } catch {
      /* explicit unresolved */
    }
    if (
      Array.isArray(payload?.questions) &&
      payload.questions.length === count
    ) {
      questions = payload.questions.map(resolve);
      source = "PERSISTED_MIXED";
    }
  } else {
    const file = core.normalizeFile(a.archive_file),
      rows = blueprints.filter(
        (b) => core.normalizeFile(b.archive_file) === file,
      );
    // The source array ordinal is evidence. question_no is never guessed as ordinal.
    const positions = new Set();
    for (const row of rows) {
      const ordinal = Number(row.source_question_ordinal);
      if (
        !Number.isInteger(ordinal) ||
        ordinal < 1 ||
        ordinal > count ||
        positions.has(ordinal)
      )
        continue;
      positions.add(ordinal);
      questions[ordinal - 1] = resolve({
        ...row,
        sourceArchiveFile: row.source_archive_file || a.archive_file,
      });
    }
    if (rows.length) source = "NORMAL_BLUEPRINT";
  }
  const rows = await buildQuestionSnapshot(a, questions, {}, { legacy: true });
  const verified = rows.filter(
    (r) => r.resolution_status === "VERIFIED",
  ).length;
  output.expectedQuestions += count;
  output.verifiedQuestions += verified;
  output.unresolvedQuestions += count - verified;
  output.assignments.push({
    assignmentId: a.id,
    source,
    expected: count,
    verified,
    unresolved: count - verified,
    rows,
  });
  for (const group of recipientGroups.filter((r) => r.assignment_id === a.id)) {
    const date = String(a.created_at).slice(0, 10),
      recipientDate = String(group.created_at).slice(0, 10);
    const status =
      date < "2026-08-19"
        ? "legacy_inferred"
        : date === recipientDate
          ? "verified"
          : "unresolved";
    output.recipients[status] += Number(group.count);
  }
}
fs.writeFileSync(
  path.resolve(arg("output")),
  JSON.stringify(output, null, 2) + "\n",
);
if (arg("sql-output")) {
  const columns = [
    "order_no",
    "question_uid",
    "source_archive_file",
    "source_question_no",
    "source_question_ordinal",
    "source_fingerprint",
    "standard_unit_key",
    "difficulty_at_assignment",
    "metadata_revision",
    "metadata_json",
    "resolution_status",
  ];
  const sqlValue = (value) =>
    value === undefined || value === null
      ? "NULL"
      : typeof value === "number"
        ? String(value)
        : "'" + String(value).replace(/'/g, "''") + "'";
  const sql = [
    "-- REVIEWABLE CANDIDATE ONLY. This tool never executes SQL.",
    "-- Existing snapshots are never overwritten. Missing identity remains UNRESOLVED.",
  ];
  for (const assignment of output.assignments)
    for (const row of assignment.rows)
      sql.push(
        `INSERT OR IGNORE INTO class_exam_assignment_questions (assignment_id,${columns.join(",")}) SELECT ${[assignment.assignmentId, ...columns.map((c) => row[c])].map(sqlValue).join(",")} WHERE EXISTS (SELECT 1 FROM class_exam_assignments WHERE id=${sqlValue(assignment.assignmentId)});`,
      );
  fs.writeFileSync(path.resolve(arg("sql-output")), sql.join("\n") + "\n");
}
const { assignments: details, ...summary } = output;
console.log(JSON.stringify(summary, null, 2));
