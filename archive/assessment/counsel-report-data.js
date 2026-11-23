(function (root, factory) {
  const deps = typeof module === "object" && module.exports
    ? { Data: require("./diagnostic-report-data.js"), View: require("./diagnostic-report-view.js") }
    : { Data: root.DiagnosticReportData, View: root.DiagnosticReportView };
  const api = factory(deps);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CounselReportData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (deps) {
  "use strict";

  // 상담지(학부모 상담용 한 장)의 자료 층. 교사 읽기 라우트 `GET exam-sessions/by-class?class=…&assignment=…`의 응답에서
  // 한 학생의 한 출제 결과를 골라 진단평가 결과표의 계산(`computeDiagnosticReport`)에 먹이고, 상담지 화면이 쓸 모델을 만든다.
  //
  //  * 새 계산을 만들지 않는다. 집계·묶음은 DiagnosticReportData, 유형·단원·단계 행 만들기는 DiagnosticReportView.buildViewModel을 쓴다.
  //  * 순수 함수다. 화면·저장소·네트워크를 읽지 않는다.
  //  * 값이 없는 메타(단원·유형·난이도)는 추정하지 않는다. 2026-10-15 이전 응시 행은 의도적으로 NULL이다(백필 안 함).
  //  * 다른 학생과의 비교(반 정답률·석차)는 만들지도 싣지도 않는다. 이 모듈은 요청한 한 학생의 행만 읽는다.

  const { Data, View } = deps;
  const text = (value) => (value == null ? "" : String(value)).trim();
  const orderOf = (row) => Number(row && row.order_no);

  // 난이도는 정수 1~5만 쓴다("UNKNOWN"·빈 값·그 밖의 값은 단계 정보 없음).
  function parseLevel(value) {
    const raw = text(value);
    return /^[1-5]$/.test(raw) ? Number(raw) : null;
  }

  // 응답에서 한 학생·한 출제의 행을 고른다. 결과 항목(result_items)이 없는 옛 응시는 틀린 번호(wrong_answers)와
  // 문항 수(question_count)로 번호별 정오만 만든다(OMR에는 틀린 번호만 저장되므로 나머지는 맞힌 문항이다).
  function pickResult(response, ids) {
    const res = response && typeof response === "object" ? response : {};
    const studentId = text(ids && ids.studentId);
    const assignmentId = text(ids && ids.assignmentId);
    const list = (name) => (Array.isArray(res[name]) ? res[name] : []);
    const assignment = list("assignments").find((a) => text(a.id) === assignmentId) || null;
    const student = list("students").find((s) => text(s.id) === studentId) || null;
    const session = list("sessions").find((s) => text(s.student_id) === studentId && (!assignmentId || !text(s.assignment_id) || text(s.assignment_id) === assignmentId)) || null;
    if (!session) return { status: "no-session", student, assignment };
    const items = list("result_items")
      .filter((row) => text(row.session_id) === text(session.id) && Number.isInteger(orderOf(row)))
      .sort((a, b) => orderOf(a) - orderOf(b));
    if (items.length) return { status: "ok", source: "result_items", student, assignment, session, items };
    const count = Number.parseInt(session.question_count, 10);
    if (!(count > 0)) return { status: "no-items", student, assignment, session };
    const wrong = new Set(list("wrong_answers")
      .filter((row) => text(row.session_id) === text(session.id))
      .map((row) => Number(String(row.question_id).replace(/\D/g, "")))
      .filter((n) => Number.isInteger(n) && n > 0));
    const bare = Array.from({ length: count }, (_, i) => ({ order_no: i + 1, result_status: wrong.has(i + 1) ? "wrong" : "correct" }));
    return { status: "ok", source: "wrong_answers", student, assignment, session, items: bare };
  }

  function toDiagnosticInput(items) {
    return {
      questions: items.map((row) => ({
        no: orderOf(row),
        questionUid: text(row.source_question_uid),
        unit: text(row.standard_unit),
        difficulty: parseLevel(row.difficulty),
        problemTypeKey: text(row.type_key),
      })),
      responses: items.map((row) => ({ no: orderOf(row), result: row.result_status })),
    };
  }

  // 화면 모델. 실패하면 { ok:false, reason, message }(학부모용 문장이 아니라 교사 화면 안내문이다).
  function buildModel(response, ids, labelOf) {
    const picked = pickResult(response, ids);
    if (picked.status === "no-session") return { ok: false, reason: picked.status, message: "이 출제에서 해당 학생의 제출 결과를 찾지 못했습니다. 아직 제출하지 않았거나 이 출제의 대상이 아닐 수 있습니다." };
    if (picked.status !== "ok") return { ok: false, reason: picked.status, message: "이 시험의 문항별 결과가 저장되어 있지 않습니다." };
    const input = toDiagnosticInput(picked.items);
    const report = Data.computeDiagnosticReport({ questions: input.questions, responses: input.responses, labelOf: labelOf || undefined });
    if (!report.consistency.ok) return { ok: false, reason: "inconsistent", message: "집계가 맞지 않아 상담지를 만들지 않았습니다. 새로고침해 다시 시도해 주세요." };
    const vm = View.buildViewModel(report);
    const s = picked.student;
    const a = picked.assignment;
    return {
      ok: true,
      source: picked.source,
      report,
      vm,
      student: { name: s ? text(s.name) : "", grade: s ? text(s.grade) : "", school: s ? text(s.school_name) : "" },
      exam: {
        title: text(a && a.exam_title) || text(picked.session.exam_title),
        date: text(a && a.exam_date) || text(picked.session.exam_date),
      },
    };
  }

  return Object.freeze({ parseLevel, pickResult, toDiagnosticInput, buildModel });
});
