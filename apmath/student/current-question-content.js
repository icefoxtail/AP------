/* 학생 화면: 출제본(mixed_payload_json 사본)을 열 때, 그사이 고쳐진 문항은 "지금 원본" 내용으로 덮어 그린다.
 * 원장 결정(2026-11-24): "고쳐진 내용으로 항상" — 학생이 보는 화면도 문항이 고쳐지면 고쳐진 내용이 보여야 한다.
 *
 * 무엇을: 사본의 각 문항이 가리키는 원본 시험지 파일(sourceArchiveFile 또는 _sourceFile)의 문항을 받아 발문·보기·정답·해설·그림 칸만 덮는다.
 *   구성·순서·번호·배점·제목·메타는 사본 그대로다(문항 배열의 길이와 순서는 절대 바꾸지 않는다).
 * 안전: 어느 문항이든 파일을 못 받았거나(네트워크·시간 초과·파싱 실패), 원본에서 같은 문항을 못 찾았거나(파일·순번·번호 불일치), 확신이 없으면
 *   그 문항은 사본 그대로 둔다. 어떤 경우에도 예외를 던지지 않고 시간 예산(기본 3초)을 넘으면 있는 대로 돌려준다.
 * 맞춤 모의고사 팩(_assessmentPackId) 문항은 팩 조립기가 발문에서 배점·서술형 머리말을 지운 사본이라, 발문(content/question)은 덮지 않고
 *   나머지 칸(보기·정답·해설·그림)만 덮는다(발문 교정은 팩을 다시 만들 때 반영된다).
 * 제출한 답안·채점 행은 이 파일이 건드리지 않는다(화면에 그릴 문항만 바꾼다). */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentCurrentContent = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  // 학생이 보는 칸. 번호·배점(id·number·displayNo·score·points)·메타·출처 칸은 여기에 없다 = 사본 그대로.
  const STEM_FIELDS = ['content', 'question'];
  const BODY_FIELDS = [
    'choices', 'answer', 'solution', 'wide', 'layoutTag',
    'image', 'imageAlt', 'imageSize', 'imageScale', 'images',
    'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'solutionImageLayout',
    'problemImage', 'problemImageAlt', 'problemImageSize',
  ];
  const STABLE_FIELDS = ['questionType', 'standardUnitKey'];
  const DEFAULT_BUDGET_MS = 3000;
  const DEFAULT_CONCURRENCY = 6;
  const CACHE_MS = 60000;
  const loads = new WeakMap(); // 받는 함수별로 파일 -> 받은 시험지(실패는 남기지 않는다)

  const text = (value) => String(value ?? '').trim();
  const sameJson = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

  /** 사본 문항 -> 원본 위치. 못 알아보면 null. file은 exams/ 아래 상대 경로. */
  function locate(question) {
    if (!question || typeof question !== 'object' || Array.isArray(question)) return null;
    if (question.sourceKind === 'generated' || question.generatedUid || question.sourceShard) return null; // 생성 문항은 시험지 파일에 없다
    let file = text(question.sourceArchiveFile || question._sourceFile || question.source_archive_file || question.sourceFile);
    file = file.replace(/\\/g, '/').replace(/^(?:\.\/)?(?:archive\/)?(?:exams\/)?/, '');
    if (!file || !/\.js$/.test(file)) return null;
    const ordinal = Number(question.sourceOrdinal ?? question._sourceQuestionOrdinal ?? question.source_question_ordinal);
    const no = question._sourceQuestionNo ?? question.sourceQuestionNo ?? question.source_question_no;
    return {
      file,
      ordinal: Number.isInteger(ordinal) && ordinal > 0 ? ordinal : null,
      no: no == null || text(no) === '' ? null : text(no),
      pack: Boolean(question._assessmentPackId),
    };
  }

  function pick(bank, where, question) {
    if (!Array.isArray(bank)) return null;
    let current = null;
    if (where.ordinal) {
      current = bank[where.ordinal - 1] || null;
    } else if (where.no !== null) {
      const hits = bank.filter((item) => item && text(item.id) === where.no);
      current = hits.length === 1 ? hits[0] : null;
    }
    if (!current || typeof current !== 'object') return null;
    // 같은 자리의 같은 문항인지 번호로 한 번 더 본다(시험지 안 문항 순서가 바뀌었으면 엉뚱한 문항을 덮지 않는다).
    if (question.id != null && current.id != null && text(question.id) !== text(current.id)) return null;
    if (typeof current.content !== 'string' && typeof current.question !== 'string') return null;
    // 한 겹 더: 시험지에서 중간 문항을 지우고 번호를 다시 매기면 같은 자리·같은 번호에 다른 문항이 와 있을 수 있다. 오타·해설 수정으로는
    // 바뀌지 않는 값(문항 유형·단원 키·객관식 여부)이 사본과 다르면 다른 문항으로 보고 사본을 그대로 둔다(둘 다 값이 있을 때만 비교).
    for (const field of STABLE_FIELDS)
      if (question[field] != null && current[field] != null && text(question[field]) !== text(current[field])) return null;
    const hasChoices = (item) => Array.isArray(item.choices) && item.choices.length > 0;
    if (Array.isArray(question.choices) && Array.isArray(current.choices) && hasChoices(question) !== hasChoices(current)) return null;
    return current;
  }

  function overlayOne(question, current, pack) {
    const out = { ...question };
    const fields = pack ? BODY_FIELDS : [...STEM_FIELDS, ...BODY_FIELDS];
    let changed = false;
    for (const field of fields) {
      const has = Object.prototype.hasOwnProperty.call(current, field);
      if (has) {
        if (!sameJson(out[field], current[field])) { out[field] = clone(current[field]); changed = true; }
      } else if (Object.prototype.hasOwnProperty.call(out, field)) {
        // 지금 원본에 없는 칸(예: 지워진 해설 그림)은 사본에서도 뺀다. 발문은 둘 중 하나가 남아야 하므로 위 검사에서 이미 확인했다.
        delete out[field];
        changed = true;
      }
    }
    return changed ? out : question;
  }

  // 받을 때마다 서버에 새로 확인한다(고친 직후에도 바로 반영). 바뀌지 않았으면 304라 전송은 거의 없다.
  const defaultLoad = (path, baseUrl) => root.StudentSelfStudyView.fetchQuestionList(path, {
    fetchImpl: (url) => root.fetch(url, { cache: 'no-cache' }), baseUrl,
  });
  function defaultFetchQuestionList() {
    const view = root.StudentSelfStudyView;
    return view && typeof view.fetchQuestionList === 'function' && typeof root.fetch === 'function' ? defaultLoad : null;
  }

  // 받은 시험지는 1분만 기억한다(같은 화면에서 시험지·정답·해설을 연이어 열 때 다시 받지 않되, 고친 뒤 오래 낡은 값을 쥐지 않는다).
  function loadBank(file, load, baseUrl) {
    let perLoader = loads.get(load);
    if (!perLoader) { perLoader = new Map(); loads.set(load, perLoader); }
    const key = file + '|' + (baseUrl || '');
    const hit = perLoader.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.promise;
    const promise = Promise.resolve().then(() => load('exams/' + file, baseUrl)).catch((error) => {
      if (perLoader.get(key)?.promise === promise) perLoader.delete(key);
      throw error;
    });
    perLoader.set(key, { at: Date.now(), promise });
    return promise;
  }

  /**
   * questions: 사본 문항 배열. 돌려주는 값: { questions(같은 길이·같은 순서), replaced(덮은 문항 수), tried(원본을 찾아본 문항 수) }.
   * options: { fetchQuestionList(path, baseUrl) -> Promise<문항 배열>, baseUrl, budgetMs, concurrency }
   */
  async function overlay(questions, options = {}) {
    const untouched = { questions, replaced: 0, tried: 0 };
    try {
      if (!Array.isArray(questions) || !questions.length) return untouched;
      const load = options.fetchQuestionList || defaultFetchQuestionList();
      if (typeof load !== 'function') return untouched;
      const budget = Number.isFinite(options.budgetMs) && options.budgetMs > 0 ? options.budgetMs : DEFAULT_BUDGET_MS;
      const concurrency = Math.max(1, Math.min(12, Math.floor(Number(options.concurrency)) || DEFAULT_CONCURRENCY));
      const places = questions.map(locate);
      const files = [...new Set(places.filter(Boolean).map((where) => where.file))];
      if (!files.length) return untouched;

      const banks = new Map();
      let deadlineHit = false;
      let timer = null;
      const deadline = new Promise((resolve) => { timer = setTimeout(() => { deadlineHit = true; resolve(); }, budget); });
      let next = 0;
      const worker = async () => {
        while (!deadlineHit && next < files.length) {
          const file = files[next++];
          try { banks.set(file, await loadBank(file, load, options.baseUrl)); } catch (error) { /* 이 파일의 문항은 사본 그대로 */ }
        }
      };
      await Promise.race([Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, worker)), deadline]);
      clearTimeout(timer);

      let replaced = 0;
      let tried = 0;
      const result = questions.map((question, index) => {
        const where = places[index];
        const bank = where && banks.get(where.file);
        if (!bank) return question;
        tried += 1;
        try {
          const current = pick(bank, where, question);
          if (!current) return question;
          const next = overlayOne(question, current, where.pack);
          if (next !== question) replaced += 1;
          return next;
        } catch (error) {
          return question;
        }
      });
      return { questions: replaced ? result : questions, replaced, tried };
    } catch (error) {
      return untouched;
    }
  }

  return { overlay, locate, pick, overlayOne, STEM_FIELDS, BODY_FIELDS, DEFAULT_BUDGET_MS };
});
