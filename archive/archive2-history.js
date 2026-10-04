(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Archive2History = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const text = (value) => String(value ?? "").trim();
  const searchKey = (value) => text(value).normalize("NFC").toLowerCase().replace(/\s+/g, "");
  const grades = Object.freeze(["중1", "중2", "중3", "고1", "고2", "고3"]);
  const gradeOf = (value) => grades.includes(text(value)) ? text(value) : "";
  function dateKey(value) {
    const match = text(value).match(/^(\d{4}-\d{2}-\d{2})(?:$|[T ])/);
    if (!match) return "";
    const date = new Date(match[1] + "T00:00:00Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === match[1]
      ? match[1] : "";
  }
  function payloadOf(value) {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch { return {}; }
  }
  function countOf(value) {
    if (value == null || text(value) === "" || typeof value === "boolean") return null;
    const count = Number(value);
    return Number.isInteger(count) && count >= 0 ? count : null;
  }
  // The list API supplies assignment snapshots. Never fetch per-card status or
  // infer recipient/submission counts from today's class roster.
  function normalizeAssignments(assignments, classes, exams, core) {
    const classById = new Map((classes || []).map((row) => [text(row.id), row]));
    const examByFile = new Map((exams || []).map((row) => [core.normalizeFile(row.file), row]));
    return (assignments || []).map((assignment) => {
      const payload = payloadOf(assignment.mixed_payload_json), meta = payload.meta || {};
      const cls = classById.get(text(assignment.class_id));
      const exam = examByFile.get(core.normalizeFile(assignment.archive_file));
      // History grade means the students' target class grade. The paper's
      // own grade/subject stays separate so cross-grade assignments remain legible.
      const targetGrade = gradeOf(assignment.class_grade) || gradeOf(cls?.grade);
      const contentGrade = gradeOf(assignment.grade_label) || gradeOf(meta.grade) ||
        gradeOf(exam?.sourceGrade || exam?.grade);
      const rawSubject = text(assignment.subject) || text(meta.subject);
      const subjectOptions = core.subjectProjectionOptions(contentGrade);
      const direct = subjectOptions.find((option) =>
        core.normalizeCourseIdentity(option.label) === core.normalizeCourseIdentity(rawSubject));
      const keys = new Set();
      if (direct) keys.add(direct.value);
      else if (core.isHighSemanticSubjectGrade(contentGrade)) {
        const key = core.highSemanticSubjectForCourseKey(rawSubject);
        if (key) keys.add(key);
      } else if (contentGrade === "고1") {
        // Old 수학(상)/(하) is NOT a whole-course alias. A historical mixed paper
        // can belong to both buckets only when its saved question units prove it.
        for (const question of Array.isArray(payload.questions) ? payload.questions : []) {
          const key = core.subjectProjectionForRecord(question, contentGrade);
          if (key) keys.add(key);
        }
      }
      if (!keys.size && rawSubject) keys.add("raw:" + rawSubject);
      const rank = new Map(subjectOptions.map((option, index) => [option.value, index]));
      const subjectKeys = [...keys].sort((a, b) =>
        (rank.get(a) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b) ?? Number.MAX_SAFE_INTEGER) || a.localeCompare(b));
      const projectedLabels = subjectKeys.map((key) =>
        core.subjectProjectionLabel({ grade: contentGrade, semanticSubject: key })).filter(Boolean);
      const subjectLabel = projectedLabels.join(" · ") || rawSubject;
      return {
        id: text(assignment.id), title: text(assignment.exam_title),
        date: dateKey(assignment.exam_date), rawDate: text(assignment.exam_date),
        targetGrade, grade: targetGrade, contentGrade, subjectKeys, subjectLabel,
        classId: text(assignment.class_id), className: text(assignment.class_name) || text(cls?.name),
        questionCount: countOf(assignment.question_count), pdfReady: assignment.pdf_status === "ready",
        // Optional additive list fields: absence is unknown, never zero.
        recipientCount: countOf(assignment.recipient_count),
        submittedCount: countOf(assignment.submitted_count),
      };
    });
  }
  function subjectOptions(rows, grade, core) {
    const relevant = (rows || []).filter((row) => !grade || row.targetGrade === grade);
    const result = new Map();
    for (const row of relevant) for (const key of row.subjectKeys) {
      const label = key.startsWith("raw:") ? key.slice(4) :
        core.subjectProjectionLabel({ grade: row.contentGrade, semanticSubject: key });
      if (label && !result.has(key)) result.set(key, { value: key, label });
    }
    return [...result.values()];
  }
  function filterAssignments(rows, filters = {}) {
    const from = dateKey(filters.from), to = dateKey(filters.to), query = searchKey(filters.query);
    return (rows || []).filter((row) =>
      (!filters.grade || row.targetGrade === filters.grade) &&
      (!filters.classId || row.classId === text(filters.classId)) &&
      (!filters.subject || row.subjectKeys.includes(filters.subject)) &&
      (!from || (row.date && row.date >= from)) &&
      (!to || (row.date && row.date <= to)) &&
      (!query || searchKey(row.title).includes(query)));
  }
  function groupByDate(rows) {
    const groups = new Map();
    // ISO date-only keys retain the assignment day without client-timezone drift.
    for (const row of [...(rows || [])].sort((a, b) => b.date.localeCompare(a.date))) {
      if (!groups.has(row.date)) groups.set(row.date, { date: row.date, rows: [] });
      groups.get(row.date).rows.push(row);
    }
    return [...groups.values()];
  }
  return { grades, dateKey, normalizeAssignments, subjectOptions, filterAssignments, groupByDate };
});