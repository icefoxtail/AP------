(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Archive2Source = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const cache = new Map();
  function evaluate(source, file) {
    // Source files are repository-owned executable assets, each with its own lexical scope.
    const scope = {};
    new Function('window', 'document', source + '\n//# sourceURL=' + encodeURI(file))(scope, { baseURI: typeof document === 'object' ? document.baseURI : '' });
    const bank = scope.questions || scope.questionBank;
    if (!Array.isArray(bank)) throw new Error('문항 배열을 찾을 수 없습니다: ' + file);
    return bank;
  }
  async function digest(value) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  }
  function fingerprint(question) {
    return digest(JSON.stringify({ content: question.content ?? null, choices: Array.isArray(question.choices) ? question.choices : null,
      answer: question.answer ?? null, solution: question.solution ?? null, image: question.image ?? null }));
  }
  async function load(file, sourceHash = '') {
    if (!file || file.includes('..') || /^(?:[a-z]+:|\/)/i.test(file)) throw new Error('잘못된 source 경로');
    const key = file + ':' + sourceHash;
    if (!cache.has(key)) cache.set(key, (async () => {
      const url = new URL('exams/' + file.split('/').map(encodeURIComponent).join('/'), document.baseURI);
      if (sourceHash) url.searchParams.set('v', sourceHash);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`원본 로드 실패 (${response.status}): ${file}`);
      const source = await response.text();
      if (sourceHash && await digest(source) !== sourceHash) throw new Error('원본 파일이 변경되었습니다. catalog를 새로고침하세요: ' + file);
      return evaluate(source, file);
    })().catch(error => { cache.delete(key); throw error; }));
    return cache.get(key);
  }
  async function restore(records, catalog) {
    const hashes = new Map(catalog.sourceHashes);
    const files = [...new Set(records.map(r => r.sourceFile))];
    const banks = new Map();
    for (const file of files) banks.set(file, await load(file, hashes.get(file)));
    return Promise.all(records.map(async record => {
      const question = banks.get(record.sourceFile)[record.sourceOrdinal - 1];
      if (!question || await fingerprint(question) !== record.sourceFingerprint) throw new Error('문항의 source fingerprint가 일치하지 않습니다.');
      if ('qid_v1_' + await digest(record.sourceFile + '#' + record.sourceOrdinal) !== record.questionUid) throw new Error('문항 UID/source가 일치하지 않습니다.');
      // Content, answer, solution and all visual/layout fields stay byte-value equivalent.
      const result = { ...question, questionUid: record.questionUid, sourceArchiveFile: record.sourceFile, sourceOrdinal: record.sourceOrdinal,
        _sourceFile: record.sourceFile, _sourceQuestionOrdinal: record.sourceOrdinal, _sourceQuestionNo: record.sourceQuestionNo,
        sourceQuestionNo: record.sourceQuestionNo, sourceFingerprint: record.sourceFingerprint, _qKey: record.questionUid,
        _sourceTitle: [record.year, record.school].filter(Boolean).join(' · ') };
      for (const field of ['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable',
        'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'reviewStatus', 'metadataRevision']) {
        if (question[field] !== undefined && question[field] !== null && String(question[field]).trim() !== ''
          && JSON.stringify(question[field]) !== JSON.stringify(record[field])) throw new Error('source metadata 충돌: ' + field);
        if (record[field] !== undefined) result[field] = record[field];
      }
      return result;
    }));
  }
  return { evaluate, digest, fingerprint, load, restore };
});
