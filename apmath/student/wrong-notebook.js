/* Scope labels for submitted exam mistakes. Use question provenance for mixed papers. */
(function (root) {
  'use strict';
  const UNKNOWN = 'unknown';

  function sourceInfo(value) {
    let text = String(value || '').trim();
    try { text = decodeURIComponent(text); } catch (_) { return {}; }
    const path = /(?:^|\/)(?:original|similar)\/(?:middle|high)\/([mh][1-3])\/([12])(mid|final)\//i.exec(text);
    if (path) return { grade: path[1].toLowerCase(), term: path[2], exam: path[3].toLowerCase() };
    const grade = /(?:^|[\s_.(])(중|고)\s*(?:학교\s*)?([1-3])(?=$|[\s_.)]|학년)/.exec(text);
    const period = /([12])\s*학기[\s_]*(중간|기말)/.exec(text);
    return {
      grade: grade ? (grade[1] === '중' ? 'm' : 'h') + grade[2] : '',
      term: period?.[1],
      exam: period ? (period[2] === '기말' ? 'final' : 'mid') : ''
    };
  }

  function scopeLabel(scope) {
    if (scope === UNKNOWN) return '범위 미분류';
    const [grade, term, exam] = scope.split(':');
    return (grade[0] === 'm' ? '중학교 ' : '고등학교 ') + grade[1] + '학년 ' + term + '학기 ' + (exam === 'final' ? '기말' : '중간');
  }

  function entries(exams, normalizeNumbers) {
    const rows = [];
    let unknownRecords = 0;
    for (const exam of exams) {
      if (![1, '1', true].includes(exam.is_submitted)) continue;
      if (!Array.isArray(exam.wrong_ids)) {
        unknownRecords += 1;
        continue;
      }
      const numbers = normalizeNumbers(exam.wrong_ids);
      if (!numbers.length) continue;
      let payload;
      if (!exam.wrong_sources && exam.mixed_payload_json) {
        try { payload = JSON.parse(exam.mixed_payload_json); } catch (_) { /* title fallback */ }
      }
      const fallback = sourceInfo([exam.grade_label, exam.exam_title].filter(Boolean).join(' '));
      const file = sourceInfo(exam.archive_file);
      for (const no of numbers) {
        const question = payload?.questions?.[no - 1];
        const source = sourceInfo(exam.wrong_sources?.[no] || question?.sourceArchiveFile || question?._sourceFile || payload?.meta?.sourceArchiveFile);
        const grade = source.grade || file.grade || fallback.grade;
        const term = source.term || file.term || fallback.term;
        const type = source.exam || file.exam || fallback.exam;
        rows.push({
          exam, no, scope: grade && term && type ? [grade, term, type].join(':') : UNKNOWN
        });
      }
    }
    return { rows, unknownRecords };
  }

  const api = { entries, scopeLabel };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentWrongNotebook = api;
})(globalThis);
