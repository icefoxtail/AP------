/* Student portal: "유사 문항 풀어보기" supply (step 2 of the self-study screens).
   For every wrong question of a past exam it offers the SAME-NUMBER question of the exam's similar papers, and
   shows the result through StudentSelfStudyView.show() - this file only decides WHICH questions.

   Rules (decided by the academy director):
   - Source: the past exam's similar paper(s) from the small build-time map (similar-link.js). Only those 1-2 exam
     JS files are downloaded, never a catalog.
   - A similar paper is used only when its question count equals the past exam's; otherwise it is not used at all.
   - Number N of the past exam <-> number N of the similar paper. A similar question that names its source
     (sourceQuestionNo = the past exam's number, sourceQid = the past exam's question id) is matched by that name instead,
     so a past exam whose ids skip a number (…20, 22, 23) still pairs correctly.
   - A similar question without an answer is never offered. Nothing is invented: a wrong question without a match
     simply has no similar card. At most 2 similar questions per wrong question (유사1 first).
   - Exams that are not one plain past-exam file (frozen MIXED / made-to-order papers) are out of scope. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentSelfStudySimilar = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const MAX_PER_QUESTION = 2;
  const digitsOf = value => {
    const match = /\d+/.exec(String(value ?? ''));
    return match ? Number(match[0]) : NaN;
  };
  const hasAnswer = question => question?.answer !== undefined && question?.answer !== null && String(question.answer).trim() !== '';
  const sameText = (a, b) => String(a ?? '').replace(/\s+/g, ' ').trim() === String(b ?? '').replace(/\s+/g, ' ').trim();

  /** What a similar question says about its source: { kind: 'no' | 'qid', n } or null. */
  function sourceMark(question) {
    if (question?.sourceQuestionNo !== undefined && question.sourceQuestionNo !== null) return { kind: 'no', n: digitsOf(question.sourceQuestionNo) };
    if (question?.sourceQid !== undefined && question.sourceQid !== null) return { kind: 'qid', n: digitsOf(question.sourceQid) };
    return null;
  }

  /** The similar question for past-exam number n (1-based position), or null. Counts must already be equal. */
  function matchQuestion(originalQuestions, similarQuestions, n) {
    const original = originalQuestions[n - 1];
    if (!original) return null;
    const originalId = digitsOf(original.id);
    const named = similarQuestions.find(question => {
      const mark = sourceMark(question);
      return mark && (mark.kind === 'no' ? mark.n === n : mark.n === (Number.isNaN(originalId) ? n : originalId));
    });
    if (named) return named;
    const positional = similarQuestions[n - 1];
    return positional && !sourceMark(positional) ? positional : null;
  }

  /** Cheap check on the card (no download): the map lists a similar paper with the exam's question count. */
  function canOffer(exam, map, link) {
    const count = Number(exam?.question_count) || 0;
    if (!count || !map || !link?.setsFor) return false;
    return link.setsFor(map, exam).some(set => Number(set.count) === count);
  }

  /** The similar papers to download: right count, 유사1 before 유사2, at most 2. */
  function usableSets(exam, map, link) {
    const count = Number(exam?.question_count) || 0;
    return (link?.setsFor?.(map, exam) || [])
      .filter(set => Number(set.count) === count)
      .sort((a, b) => String(a.file).localeCompare(String(b.file), 'ko', { numeric: true }))
      .slice(0, MAX_PER_QUESTION);
  }

  /**
   * Card-screen input for "유사 문항".
   * originalQuestions: the past exam's own file; issuedQuestions: what the student actually got (frozen snapshot) or null;
   * similarSets: [{ file, questions }] already downloaded. Numbered 1..K in the order shown; sourceLabel names the origin.
   */
  function buildSimilarSet({ title = '', originalQuestions = [], issuedQuestions = null, wrongIds = [], similarSets = [], emptyText = '' } = {}) {
    const sets = similarSets.filter(set => Array.isArray(set?.questions) && set.questions.length === originalQuestions.length);
    const numbers = Array.from(new Set((Array.isArray(wrongIds) ? wrongIds : []).map(value => parseInt(value, 10)).filter(value => value > 0))).sort((a, b) => a - b);
    const questions = [];
    for (const n of numbers) {
      const original = originalQuestions[n - 1];
      // The snapshot the student was graded on must be the same question as the file's, or the pairing is not trusted.
      if (!original || (Array.isArray(issuedQuestions) && issuedQuestions[n - 1] && !sameText(issuedQuestions[n - 1].content ?? issuedQuestions[n - 1].question, original.content ?? original.question))) continue;
      const found = sets.map(set => matchQuestion(originalQuestions, set.questions, n)).filter(question => question && hasAnswer(question));
      found.slice(0, MAX_PER_QUESTION).forEach((question, index, list) => questions.push({
        ...question,
        no: questions.length + 1,
        sourceLabel: `원본 ${n}번의 유사${list.length > 1 ? ` ${index + 1}` : ''}`
      }));
    }
    return { title: String(title || ''), questions, emptyText: emptyText || '이 시험의 유사 문항을 찾지 못했어요.' };
  }

  /** Downloads the past exam file and its (at most 2) similar papers; a similar paper that fails or has another count is dropped. */
  async function loadSimilarSets(exam, map, { view, link, fetchImpl, baseUrl } = {}) {
    const study = view || root.StudentSelfStudyView;
    const sets = usableSets(exam, map, link || root.StudentSimilarLink);
    if (!sets.length) return { originalQuestions: [], issuedQuestions: null, similarSets: [] };
    const options = { fetchImpl, baseUrl };
    const originalQuestions = await study.loadExamFile(exam, options);
    let issuedQuestions = null;
    try {
      const frozen = JSON.parse(String(exam?.mixed_payload_json || 'null'));
      if (Array.isArray(frozen?.questions) && frozen.questions.length) issuedQuestions = frozen.questions;
    } catch (error) { issuedQuestions = null; }
    const loaded = await Promise.all(sets.map(set => study.fetchQuestionList(`exams/${set.file}`, options)
      .then(questions => ({ file: set.file, questions }), () => null)));
    return { originalQuestions, issuedQuestions, similarSets: loaded.filter(set => set && set.questions.length === originalQuestions.length) };
  }

  return { digitsOf, sourceMark, matchQuestion, canOffer, usableSets, buildSimilarSet, loadSimilarSets, MAX_PER_QUESTION };
});
