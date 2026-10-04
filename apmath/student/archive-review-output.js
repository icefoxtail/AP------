/* Student review transports the authorized, issued snapshot to the shared engine. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentArchiveReviewOutput = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function studentReturnTarget(baseUrl) {
    try {
      const source = new URL(baseUrl);
      if (!source.pathname.startsWith('/apmath/student/')) return '';
      const params = new URLSearchParams();
      for (const key of ['teacher_preview', 'student_id', 'omr', 'assignment_id', 'wrong_clinic']) {
        const value = source.searchParams.get(key);
        if (value) params.set(key, value);
      }
      return source.pathname + (params.size ? `?${params.toString()}` : '') + source.hash;
    } catch {
      return '';
    }
  }
  async function prepare(exam, mode, output, baseUrl) {
    if (!['exam', 'sol', 'ans'].includes(mode)) throw new Error('지원하지 않는 보기 방식입니다.');
    const raw = String(exam?.mixed_payload_json || '').trim();
    // Originals issued before snapshots existed retain their existing source route.
    if (!raw || raw === 'null') {
      if (String(exam?.archive_file || '').startsWith('MIXED:'))
        throw new Error('저장된 출제 문항을 확인할 수 없습니다.');
      return null;
    }
    const payload = JSON.parse(raw);
    const assignmentId = String(exam?.assignment_id || '').trim();
    if (!assignmentId || !Array.isArray(payload?.questions) || !payload.questions.length ||
        !payload.meta || typeof payload.meta !== 'object' || Array.isArray(payload.meta))
      throw new Error('저장된 출제 문항을 확인할 수 없습니다.');
    if (exam.question_count != null && Number(exam.question_count) !== payload.questions.length)
      throw new Error('저장된 출제 문항 수가 일치하지 않습니다.');
    const mixed = String(exam.archive_file || '').startsWith('MIXED:');
    const meta = { ...payload.meta, qpp: Number(payload.meta.qpp || exam.pdf_qpp || (mixed ? 2 : 4)) };
    if (![1, 2, 4, 6, 8].includes(meta.qpp)) throw new Error('저장된 출력 설정을 확인할 수 없습니다.');
    const envelope = await output.publishOutputEnvelope({
      sourceKind: 'assignment', sourceId: String(exam.archive_file), assignmentId,
      ...(exam.saved_paper_id ? { paperId: String(exam.saved_paper_id) } : {}),
      mode, questionCount: payload.questions.length,
      questionUids: meta.questionUids || payload.questions.map(question =>
        question.questionUid || question.source_question_uid || question._sourceQuestionUid || null),
      meta, questions: payload.questions,
    });
    const url = output.outputEnvelopeUrl(
      mixed ? '../../archive/mixed_engine.html' : '../../archive/engine.html',
      baseUrl, envelope, { studio: true, assignmentId },
    );
    url.searchParams.set('studentReview', '1');
    url.searchParams.set('fit', 'screen');
    url.searchParams.set('submitQr', '0');
    url.searchParams.set('solQr', '0');
    const returnTarget = studentReturnTarget(baseUrl);
    if (returnTarget) url.searchParams.set('studentReturnTo', returnTarget);
    return url.href;
  }
  return { prepare };
});
