/* AP Math OS [js/similar-exam.js]
   유사 시험지(archive/exams/similar/**)로 출제된 응시인지 가르는 판정 한 곳.
   저장하지 않고 출제·응시 행의 archive_file 경로로 매번 계산한다(출제 때 archive_file = "exams/<카탈로그 파일>").
   교사 화면(apmath/index.html)과 학생 포털(apmath/student/index.html)이 같은 파일을 불러 쓴다.
   용도: 유사 응시는 학교 시험 성적 평균·추이와 미제출 독촉에서 빼고 "유사 · 자습용"으로만 표시한다.
   이 파일은 아무것도 저장·전송하지 않는다. 입력(OMR 제출)은 기출과 같은 길로 그대로 된다. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ApSimilarExam = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /** "exams/similar/high/x.js" · "archive/exams/..." · "similar/..." -> "similar/high/x.js"; MIXED:·빈 값은 ''. */
  function normalizeFile(archiveFile) {
    const text = String(archiveFile == null ? '' : archiveFile).trim().replace(/\\/g, '/');
    if (!text || /^MIXED:/i.test(text)) return '';
    return text.replace(/[?#].*$/, '').replace(/^\.?\//, '').replace(/^(?:archive\/)?exams\//, '');
  }

  /** 시험 파일 경로가 유사 시험지인가. */
  function isSimilarExamFile(archiveFile) {
    return normalizeFile(archiveFile).startsWith('similar/');
  }

  /** 출제(class_exam_assignments)·응시(exam_sessions)·포털 시험 행이 유사 시험지인가. */
  function isSimilarExamRow(row) {
    if (!row || typeof row !== 'object') return false;
    return isSimilarExamFile(row.archive_file != null ? row.archive_file : row.archiveFile);
  }

  /** 학교 시험 성적으로 세는 행만(유사 제외). 배열이 아니면 빈 배열. */
  function schoolExamRows(rows) {
    return (Array.isArray(rows) ? rows : []).filter((row) => !isSimilarExamRow(row));
  }

  return { normalizeFile, isSimilarExamFile, isSimilarExamRow, schoolExamRows };
});
