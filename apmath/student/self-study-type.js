/* Student portal: "유사 문항 풀어보기" by TYPE - for exams that have no similar paper (a made-up mock exam, a paper whose similar sheets do not line up).
   For every wrong question it offers other questions of the SAME TYPE (세부 유형 TPL first, then 유형 PT), the way the teacher's
   오답 클리닉 "틀린 유형 기준" does, and shows them through StudentSelfStudyView.show(). This file only decides WHICH questions.

   Where the questions come from (no catalog, no new server call):
   - archive/data/archive2-catalog-shards-v1/student-type/ is written by the release build (tools/lib/build-archive2-student-type-part.mjs):
     index.json (exam file -> shard) and one small shard per grade + subject (type keys and exam positions, no question text).
   - The picked questions' own exam JS files are then read, exactly like 오답 다시 풀기 reads its exam file. A picked question without an answer or
     a real explanation, or whose number no longer matches, is replaced by the next candidate.

   Rules (director's request 2026-11-24):
   - A wrong question's type is found from where it came from: the issued copy's questionUid / sourceArchiveFile + sourceOrdinal, or, for a plain
     past-exam file, the exam file + its number. No type -> no card (nothing is invented).
   - Same grade + subject as the wrong question (the shard), never the wrong question itself, never a question of the exam being studied, and never a
     question of an exam the student has been given but not yet submitted (the portal's exam list says which; a made-up exam is excluded by question,
     a plain past exam by its whole paper family).
   - At most 2 per wrong question per round. Each press of "다른 유사 문항 더 풀기" gives a new round without anything shown before.
   - Rounds are remembered on this device (like the self-study record), so reopening continues the last round; without storage a round is
     re-picked from the same seed, which gives the same questions. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentSelfStudyType = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const Rec = root.StudentSelfStudyRecord || (typeof require === 'function' ? require('./self-study-record.js') : null);
  const INDEX_PATH = '../../archive/data/archive2-catalog-shards-v1/student-type/index.json';
  const SCHEMA = 'archive2-student-type-v1';
  const PER_WRONG = 2;
  const MAX_PASSES = 3;
  const STORE_PREFIX = 'ap_student_ss_type_v1_';
  const FLAG_TPL_FORMAL = 1;
  const FLAG_PT_FORMAL = 2;
  const FLAG_OFFER = 4;
  const UID_PREFIX = 'qid_v1_';

  const text = value => String(value ?? '').trim();
  const digitsOf = value => { const m = /\d+/.exec(String(value ?? '')); return m ? Number(m[0]) : NaN; };
  const uidKey = value => text(value).replace(/^qid_v1_/, '');
  const fullUid = value => (uidKey(value) ? `${UID_PREFIX}${uidKey(value)}` : '');
  const normalizeFile = value => text(value).replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^archive\//, '').replace(/^exams\//, '');
  // Same "family" rule as archive2-derive.js stemOf: an original paper and its 유사 papers share a stem.
  const stemOf = file => text(file).replace(/\\/g, '/').replace(/^\/?(?:archive\/)?(?:exams\/)?[^/]+\//, '').replace(/\.js$/i, '').replace(/_유사\d*$/, '');
  const posKey = (file, ordinal) => `${normalizeFile(file)}#${ordinal}`;
  const hash32 = input => {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) { h ^= input.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  };

  /* ---------- index + shards ---------- */

  /** index.json -> { shards: [{ ck, path }], files: Map<file, number[]> } or null when it is not this format. */
  function parseIndex(doc) {
    if (!doc || doc.schemaVersion !== SCHEMA || !Array.isArray(doc.shards) || !doc.files || typeof doc.files !== 'object') return null;
    const shards = doc.shards.map(row => ({ ck: text(row?.ck), path: text(row?.path) }));
    if (shards.some(row => !row.ck || !/^[a-z0-9][a-z0-9_-]*\.json$/.test(row.path))) return null;
    const files = new Map();
    for (const [file, value] of Object.entries(doc.files)) {
      const list = (Array.isArray(value) ? value : [value]).filter(n => Number.isInteger(n) && n >= 0 && n < shards.length);
      if (list.length) files.set(file, list);
    }
    return { shards, files, indexVersion: text(doc.indexVersion) };
  }

  /** shard file -> rows + lookups. Rows: { file, ordinal, no, tpl, pt, flags, bucket, uid, offer, tplFormal, ptFormal }. */
  function decodeShard(doc) {
    if (!doc || doc.schemaVersion !== SCHEMA || !Array.isArray(doc.items) || !Array.isArray(doc.files) || !Array.isArray(doc.keys)) return null;
    const rows = [];
    for (const item of doc.items) {
      if (!Array.isArray(item) || item.length < 8) continue;
      const [fileIndex, ordinal, no, tplIndex, ptIndex, flags, bucket, uid] = item;
      const file = doc.files[fileIndex];
      if (!file || !Number.isInteger(ordinal) || ordinal < 1 || !/^[a-f0-9]{64}$/.test(String(uid))) continue;
      rows.push({
        file, ordinal, no: text(no), tpl: tplIndex >= 0 ? text(doc.keys[tplIndex]) : '', pt: ptIndex >= 0 ? text(doc.keys[ptIndex]) : '',
        flags, bucket: Number(bucket) || 0, uid: String(uid),
        offer: (flags & FLAG_OFFER) !== 0, tplFormal: (flags & FLAG_TPL_FORMAL) !== 0, ptFormal: (flags & FLAG_PT_FORMAL) !== 0
      });
    }
    const byUid = new Map(); const byPos = new Map(); const byTpl = new Map(); const byPt = new Map();
    const put = (map, key, row) => { if (!key) return; if (map.has(key)) map.get(key).push(row); else map.set(key, [row]); };
    for (const row of rows) {
      byUid.set(row.uid, row); byPos.set(posKey(row.file, row.ordinal), row);
      put(byTpl, row.tpl, row); put(byPt, row.pt, row);
    }
    return { ck: text(doc.ck), rows, byUid, byPos, byTpl, byPt };
  }

  /* ---------- where a wrong question came from ---------- */

  function parsePayload(exam) {
    try {
      const payload = JSON.parse(String(exam?.mixed_payload_json || 'null'));
      return Array.isArray(payload?.questions) && payload.questions.length ? payload.questions : null;
    } catch (error) { return null; }
  }
  function refOfQuestion(question) {
    if (!question || typeof question !== 'object') return { uid: '', file: '', ordinal: NaN };
    const uid = uidKey(question.questionUid || question.source_question_uid || question._sourceQuestionUid);
    const file = normalizeFile(question.sourceArchiveFile || question._sourceFile || question.source_archive_file || question.sourceFile);
    const ordinal = Number(question.sourceOrdinal ?? question._sourceQuestionOrdinal ?? question.source_question_ordinal);
    return { uid: /^[a-f0-9]{64}$/.test(uid) ? uid : '', file: /\.js$/.test(file) ? file : '', ordinal: Number.isInteger(ordinal) && ordinal > 0 ? ordinal : NaN };
  }

  /** [{ n, uid, file, ordinal }] for the wrong numbers of an exam (n = position in the issued list). A number whose origin is unknown is left out. */
  function wrongRefs(exam, wrongNumbers) {
    const numbers = Array.from(new Set((wrongNumbers || []).map(v => parseInt(v, 10)).filter(v => v > 0))).sort((a, b) => a - b);
    const issued = parsePayload(exam);
    const archiveFile = text(exam?.archive_file);
    const plainFile = archiveFile && !archiveFile.startsWith('MIXED:') ? normalizeFile(archiveFile) : '';
    const out = [];
    for (const n of numbers) {
      let ref = issued ? refOfQuestion(issued[n - 1]) : { uid: '', file: '', ordinal: NaN };
      if (!issued && plainFile) ref = { uid: '', file: plainFile, ordinal: n };
      if (ref.uid || (ref.file && Number.isInteger(ref.ordinal))) out.push({ n, ...ref });
    }
    return out;
  }

  /** The shard numbers a wrong question may live in (by its file). */
  function shardNumbersFor(index, ref) {
    return (ref.file && index?.files.get(ref.file)) || [];
  }
  /** Cheap check for the card (index only): at least one wrong question belongs to a file the lookup knows. */
  function canOffer(index, exam, wrongNumbers) {
    if (!index) return false;
    return wrongRefs(exam, wrongNumbers).some(ref => shardNumbersFor(index, ref).length > 0);
  }

  function findBase(ref, shards) {
    for (const shard of shards) {
      const row = (ref.uid && shard.byUid.get(ref.uid)) || (ref.file && Number.isInteger(ref.ordinal) && shard.byPos.get(posKey(ref.file, ref.ordinal)));
      if (row) return { row, shard };
    }
    return null;
  }

  /* ---------- what must not be offered ---------- */

  const isSubmitted = exam => exam?.is_submitted === 1 || exam?.is_submitted === '1' || exam?.is_submitted === true;
  /** Given to the student and not yet handed in (an unknown state counts as not handed in). Cancelled, replaced, excluded and review-only rows do not. */
  function isOpenExam(exam) {
    return !isSubmitted(exam) && !exam?.is_cancelled && !exam?.is_replaced && !exam?.is_excluded && !exam?.is_review_only;
  }

  /**
   * exams: the portal's exam list. studied: the exam whose wrong questions are being practised.
   * Returns { uids, positions, files, stems }: questions never to offer (by uid / by file#ordinal / whole files / whole paper families).
   */
  function collectExclusions(exams, studied, refs = []) {
    const uids = new Set(refs.map(ref => ref.uid).filter(Boolean));
    const positions = new Set(); const files = new Set(); const stems = new Set();
    const addExam = (exam, wholeFamily) => {
      const issued = parsePayload(exam);
      if (issued) {
        for (const question of issued) {
          const ref = refOfQuestion(question);
          if (ref.uid) uids.add(ref.uid);
          if (ref.file && Number.isInteger(ref.ordinal)) positions.add(posKey(ref.file, ref.ordinal));
        }
        return;
      }
      const archiveFile = text(exam?.archive_file);
      if (!archiveFile || archiveFile.startsWith('MIXED:')) return;
      const file = normalizeFile(archiveFile);
      files.add(file);
      if (wholeFamily) stems.add(stemOf(file));
    };
    if (studied) addExam(studied, false);
    for (const exam of Array.isArray(exams) ? exams : []) {
      if (!exam || (studied && String(exam.assignment_id) === String(studied.assignment_id))) continue;
      if (isOpenExam(exam)) addExam(exam, true);
    }
    return { uids, positions, files, stems };
  }

  /* ---------- picking ---------- */

  /**
   * One round. wrongs: [{ n, base: row, shard }] (shard from decodeShard). exclusions: collectExclusions(); shown: Set of uids already shown;
   * bad: Set of uids that could not be used. Returns [{ n, row, rung: 'tpl' | 'pt' }], at most perWrong per wrong question.
   * Order inside a rung: approved type match first, then the closest difficulty step, then a seeded shuffle (same seed -> same round).
   */
  function pickRound({ wrongs, exclusions, shown, bad, seed, perWrong = PER_WRONG }) {
    const taken = new Set();
    const pairs = new Set();
    const picks = [];
    const blocked = row => (
      !row.offer || taken.has(row.uid) || (shown && shown.has(row.uid)) || (bad && bad.has(row.uid))
      || exclusions.uids.has(row.uid) || exclusions.positions.has(posKey(row.file, row.ordinal))
      || exclusions.files.has(row.file) || exclusions.stems.has(stemOf(row.file))
      || pairs.has(`${stemOf(row.file)}#${row.ordinal}`)
    );
    for (const { n, base, shard } of wrongs) {
      let got = 0;
      for (const rung of ['tpl', 'pt']) {
        if (got >= perWrong) break;
        const key = base[rung];
        if (!key) continue;
        const formal = rung === 'tpl' ? 'tplFormal' : 'ptFormal';
        const pool = (rung === 'tpl' ? shard.byTpl : shard.byPt).get(key) || [];
        const order = pool.filter(row => row !== base && row.uid !== base.uid && !blocked(row))
          .map(row => ({
            row,
            hintOnly: row[formal] && base[formal] ? 0 : 1,
            gap: base.bucket && row.bucket ? Math.abs(row.bucket - base.bucket) : 9,
            rank: hash32(`${seed}|${row.uid}`)
          }))
          .sort((a, b) => a.hintOnly - b.hintOnly || a.gap - b.gap || a.rank - b.rank);
        for (const item of order) {
          if (got >= perWrong) break;
          if (blocked(item.row)) continue; // a pick of this very loop may have taken its pair
          taken.add(item.row.uid); pairs.add(`${stemOf(item.row.file)}#${item.row.ordinal}`);
          picks.push({ n, row: item.row, rung });
          got += 1;
        }
      }
    }
    return picks;
  }

  /* ---------- rounds kept on this device ---------- */

  const memoryStore = new Map();
  const safeId = value => String(value ?? '').replace(/[^A-Za-z0-9_\-가-힣]/g, '_');
  const storeKey = (studentId, assignmentId) => `${STORE_PREFIX}${safeId(studentId)}_${safeId(assignmentId)}`;
  /** { rounds: [{ withLinked, picks: [{ n, file, ordinal, uid }] }] }. Never throws. */
  function readRounds(storage, studentId, assignmentId) {
    const key = storeKey(studentId, assignmentId);
    let value = null;
    let stored = false;
    if (storage) {
      try { value = JSON.parse(storage.getItem(key) || 'null'); stored = true; } catch (error) { value = null; }
    }
    // The in-page copy is only for a page without usable storage (teacher preview, private window).
    if (!stored && memoryStore.has(key)) value = memoryStore.get(key);
    const rounds = Array.isArray(value?.rounds) ? value.rounds.map(round => ({
      withLinked: Boolean(round?.withLinked),
      picks: (Array.isArray(round?.picks) ? round.picks : []).filter(pick => pick && Number.isInteger(pick.n) && pick.file && Number.isInteger(pick.ordinal) && /^[a-f0-9]{64}$/.test(String(pick.uid)))
        .map(pick => ({ n: pick.n, file: String(pick.file), ordinal: pick.ordinal, uid: String(pick.uid) }))
    })) : [];
    return { rounds };
  }
  function writeRounds(storage, studentId, assignmentId, state) {
    const key = storeKey(studentId, assignmentId);
    try {
      if (!storage) throw new Error('no storage');
      storage.setItem(key, JSON.stringify({ v: 1, rounds: state.rounds }));
      memoryStore.delete(key);
    } catch (error) { memoryStore.set(key, state); }
  }

  /* ---------- reading the picked questions ---------- */

  /** A fetched question may be offered: answer present, a real explanation (text or figure), and the same number as the shard says. */
  function usable(question, row, view) {
    if (!question || typeof question !== 'object') return false;
    if (!view.hasAnswer(question)) return false;
    if (!view.hasRealSolution(question) && !text(question.solutionImage)) return false;
    const a = digitsOf(question.id); const b = digitsOf(row.no);
    return !(Number.isFinite(a) && Number.isFinite(b) && a !== b);
  }

  /** pick: { n, file, ordinal, uid } -> the card question, or null. lists: Map<file, Promise<question[] | null>> shared by one call. */
  async function readPick(pick, { view, lists, fetchImpl, baseUrl, row }) {
    if (!lists.has(pick.file)) lists.set(pick.file, view.fetchQuestionList(`exams/${pick.file}`, { fetchImpl, baseUrl }).catch(() => null));
    const list = await lists.get(pick.file);
    const question = list && list[pick.ordinal - 1];
    if (!usable(question, row || { no: '' }, view)) return null;
    return {
      ...question,
      questionUid: fullUid(pick.uid), sourceArchiveFile: pick.file, sourceOrdinal: pick.ordinal,
      sourceLabel: `${pick.n}번과 같은 유형`,
      ssKey: fullUid(pick.uid), ssUid: fullUid(pick.uid), ssSrc: pick.n
    };
  }

  /**
   * One screen's worth of same-type questions.
   * ctx: { exam, wrongNumbers, exams, index, studentId, storage, view, mode: 'current' | 'next', skipNumbers (wrong numbers that already have a
   *        same-number similar question, first round only), withLinked (the first round is shown together with those similar questions),
   *        extraShown (uids already on screen from elsewhere), fetchImpl, baseUrl, refresher }.
   * Resolves { questions, exhausted, withLinked, failed }. Never throws: failed = the lookup files could not be read.
   */
  async function loadRound(ctx) {
    const view = ctx.view || root.StudentSelfStudyView;
    const fetchImpl = ctx.fetchImpl || (typeof fetch === 'function' ? fetch.bind(root) : null);
    const result = { questions: [], exhausted: false, withLinked: false, failed: false };
    try {
      const refs = wrongRefs(ctx.exam, ctx.wrongNumbers);
      const assignmentId = String(ctx.exam?.assignment_id || '');
      const state = readRounds(ctx.storage, ctx.studentId, assignmentId);
      const shardCache = ctx.shardCache || new Map();
      const loadShard = async number => {
        if (!shardCache.has(number)) {
          const row = ctx.index.shards[number];
          const url = new URL(`${INDEX_PATH.replace(/index\.json$/, '')}${row.path}`, ctx.baseUrl || root.location.href).href;
          shardCache.set(number, fetchImpl(url).then(response => { if (!response?.ok) throw new Error('STUDENT_TYPE_SHARD_FAILED'); return response.json(); })
            .then(doc => { const shard = decodeShard(doc); if (!shard) throw new Error('STUDENT_TYPE_SHARD_INVALID'); return shard; })
            .catch(error => { shardCache.delete(number); throw error; }));
        }
        return shardCache.get(number);
      };
      const wanted = new Set(refs.flatMap(ref => shardNumbersFor(ctx.index, ref)));
      const loaded = new Map();
      await Promise.all([...wanted].map(async number => loaded.set(number, await loadShard(number))));
      const wrongs = refs.map(ref => {
        const found = findBase(ref, shardNumbersFor(ctx.index, ref).map(number => loaded.get(number)).filter(Boolean));
        return found ? { n: ref.n, base: found.row, shard: found.shard } : null;
      }).filter(Boolean);
      const lists = new Map();
      const rowOf = pick => { for (const shard of loaded.values()) { const row = shard.byUid.get(pick.uid); if (row) return row; } return null; };
      const read = picks => Promise.all(picks.map(pick => readPick(pick, { view, lists, fetchImpl, baseUrl: ctx.baseUrl, row: rowOf(pick) }).then(question => ({ pick, question }))));
      const finish = async rows => {
      // The same figures the engine shows students (a no-op unless a refreshed figure exists).
        let questions = rows.map(row => row.question);
        const refresher = ctx.refresher === undefined ? root.ArchiveStudentSvgRefresh : ctx.refresher;
        if (refresher?.refresh && questions.length) {
          try {
            const archive = new URL('../../archive/', ctx.baseUrl || root.location.href).href;
            const refreshed = await refresher.refresh(questions, { sourceKind: 'assignment', assignmentId, sourceId: '', meta: {} }, { baseUrl: archive });
            if (Array.isArray(refreshed) && refreshed.length === questions.length) questions = refreshed;
          } catch (error) { /* keep the original figures */ }
        }
        return questions;
      };

      const seedFor = number => `${ctx.studentId}|${assignmentId}|${number}`;
      const exclusions = collectExclusions(ctx.exams, ctx.exam, refs);

      if (ctx.mode !== 'next' && state.rounds.length) {
        const last = state.rounds[state.rounds.length - 1];
        const rows = (await read(last.picks)).filter(row => row.question);
        result.questions = await finish(rows);
        result.withLinked = state.rounds.length === 1 && last.withLinked;
        return result;
      }

      const shown = new Set([...state.rounds.flatMap(round => round.picks.map(pick => pick.uid)), ...(ctx.extraShown || []).map(uidKey)]);
      const first = ctx.mode !== 'next' && state.rounds.length === 0;
      const skip = new Set(first ? (ctx.skipNumbers || []) : []);
      const usedWrongs = wrongs.filter(item => !skip.has(item.n));
      const bad = new Set();
      let rows = [];
      for (let pass = 0; pass < MAX_PASSES; pass += 1) {
        const picks = pickRound({ wrongs: usedWrongs, exclusions, shown, bad, seed: seedFor(state.rounds.length + 1) })
          .map(({ n, row }) => ({ n, file: row.file, ordinal: row.ordinal, uid: row.uid }));
        rows = await read(picks);
        const failed = rows.filter(row => !row.question);
        failed.forEach(row => bad.add(row.pick.uid));
        if (!failed.length) break;
      }
      rows = rows.filter(row => row.question);
      if (!rows.length) { result.exhausted = !first; return result; }
      writeRounds(ctx.storage, ctx.studentId, assignmentId, {
        rounds: [...state.rounds, { withLinked: first && Boolean(ctx.withLinked), picks: rows.map(row => row.pick) }]
      });
      result.withLinked = first && Boolean(ctx.withLinked);
      result.questions = await finish(rows);
      return result;
    } catch (error) {
      result.failed = true;
      return result;
    }
  }

  /** index.json (small) for the portal: never throws, null when absent or malformed. */
  async function loadIndex(fetchImpl, baseUrl) {
    try {
      const response = await fetchImpl(new URL(INDEX_PATH, baseUrl).href);
      if (!response || !response.ok) return null;
      return parseIndex(await response.json());
    } catch (error) { return null; }
  }

  return {
    INDEX_PATH, PER_WRONG, parseIndex, decodeShard, wrongRefs, canOffer, shardNumbersFor, findBase, isOpenExam, collectExclusions,
    pickRound, readRounds, writeRounds, loadRound, loadIndex, stemOf, normalizeFile, uidKey, fullUid
  };
});
