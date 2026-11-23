/* Student portal: self-study record ("풀고 나서 해설", 자동 저장·이어 풀기).
   Pure rules + one small recorder; no DOM. self-study-view.js draws the cards, index.html owns the network adapter.

   One record = one self-study set (an assignment x kind 'wrong' | 'similar'). Each question is one item:
     { k: stable question key, u: questionUid | null, src: past-exam number, r: 'c' | 'w' | 'u' | null,
       why: 'calc'|'misread'|'concept'|'method'|'guess'|null, n: attempts, t: ISO time }
   r: c = right, w = wrong, u = "모르겠어요" (counts as wrong), null = not answered (yet / again).
   Saved in localStorage first (the student never loses work) and sent to the server as one debounced set POST.
   The server may be off (FEATURE_UNAVAILABLE / 404): then the screen keeps working on the local record only. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentSelfStudyRecord = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const WHY_CODES = ['calc', 'misread', 'concept', 'method', 'guess'];
  const WHY_LABELS = { calc: '계산 실수', misread: '문제를 잘못 읽음', concept: '개념을 모름', method: '풀이 방법이 안 떠오름', guess: '찍음' };
  const RESULTS = ['c', 'w', 'u'];
  const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩';
  const STORAGE_PREFIX = 'APMATH_SELFSTUDY_';
  const DEBOUNCE_MS = 1500;
  const PLACEHOLDER_TIME = '1970-01-01T00:00:00.000Z';
  const MAX_ITEMS = 200; // the server takes at most 200 items per request

  /* ---------- answer judging ---------- */

  const choiceText = c => {
    if (c === null || c === undefined) return '';
    if (typeof c === 'object') return String(c.text || c.content || c.value || c.answer || Object.values(c)[0] || '');
    return String(c);
  };

  /** Same rule as the archive's choice renderer: no choices / "주관식" / all-blank choices = not a pick-one question. */
  function hasChoices(entry) {
    const choices = entry?.choices;
    if (!Array.isArray(choices) || choices.length === 0 || choices[0] === '주관식') return false;
    return !choices.every(c => choiceText(c).trim() === '');
  }

  /** "②", "2", "2번", "(2)" -> 2. Anything else (a number to type, "2, 4", a sentence) -> NaN. */
  function answerIndex(answer, choiceCount = 10) {
    const text = String(answer ?? '').trim();
    let value = NaN;
    const circled = CIRCLED.indexOf(text);
    if (text.length === 1 && circled >= 0) value = circled + 1;
    else {
      const match = /^\(?\s*(\d{1,2})\s*\)?\s*번?$/.exec(text);
      if (match) value = Number(match[1]);
    }
    return Number.isFinite(value) && value >= 1 && value <= Math.max(2, choiceCount) ? value : NaN;
  }

  /** 'mc' = pick a choice and grade it; 'sub' = open the answer and judge yourself (typed answers, unreadable answers, no answer). */
  function questionMode(entry) {
    const embedded = entry?.choicesEmbeddedInImage === true || entry?.sourcePayload?.choicesEmbeddedInImage === true;
    if (embedded) return Number.isFinite(answerIndex(entry?.answer, 5)) && answerIndex(entry.answer, 5) <= 5 ? 'mc' : 'sub';
    if (!hasChoices(entry)) return 'sub';
    return Number.isFinite(answerIndex(entry.answer, entry.choices.length)) ? 'mc' : 'sub';
  }

  /** The choice count the picker offers: the question's own choices, or ①..⑤ when the choices are inside the figure. */
  function choiceCountOf(entry) {
    return hasChoices(entry) ? entry.choices.length : 5;
  }

  /** 'c' / 'w' for a picked choice number; null when the question cannot be graded by a pick. */
  function judge(entry, picked) {
    if (questionMode(entry) !== 'mc') return null;
    const pick = Number(picked);
    if (!Number.isInteger(pick) || pick < 1) return null;
    return pick === answerIndex(entry.answer, choiceCountOf(entry)) ? 'c' : 'w';
  }

  /* ---------- question keys ---------- */

  const uidOf = question => {
    const value = question?.questionUid || question?.source_question_uid || question?._sourceQuestionUid || null;
    return value ? String(value) : null;
  };

  /** Wrong set: the question's UID, else "w:<past-exam number>". */
  function wrongKey(no, question) {
    return uidOf(question) || `w:${no}`;
  }

  /** Similar set: the question's UID, else "s:<source number>:<similar file>:<question id>". */
  function similarKey(sourceNo, file, question) {
    return uidOf(question) || `s:${sourceNo}:${String(file || '').replace(/^.*\//, '')}:${question?.id ?? ''}`;
  }

  /** Keeps keys unique inside one set (two cards must never share a record). */
  function uniqueKeys(keys) {
    const seen = new Map();
    return keys.map(key => {
      const count = (seen.get(key) || 0) + 1;
      seen.set(key, count);
      return count === 1 ? key : `${key}#${count}`;
    });
  }

  /* ---------- items ---------- */

  const timeOf = item => {
    const value = Date.parse(item?.t);
    return Number.isFinite(value) ? value : -Infinity;
  };

  /** One stored/received item cleaned to the contract shape, or null when it has no key. Extra local field p (picked choice) survives only locally. */
  function cleanItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const k = String(raw.k ?? '').trim();
    if (!k) return null;
    const item = {
      k,
      u: raw.u ? String(raw.u) : null,
      src: Number.isFinite(Number(raw.src)) && raw.src !== null && raw.src !== '' ? Number(raw.src) : null,
      r: RESULTS.includes(raw.r) ? raw.r : null,
      why: WHY_CODES.includes(raw.why) ? raw.why : null,
      n: Math.max(0, Math.floor(Number(raw.n)) || 0),
      t: typeof raw.t === 'string' ? raw.t : ''
    };
    if (Number.isInteger(raw.p) && raw.p > 0) item.p = raw.p;
    return item;
  }

  /** Contract fields only (what the server receives). */
  function wireItem(item) {
    return { k: item.k, u: item.u ?? null, src: item.src ?? null, r: item.r ?? null, why: item.why ?? null, n: item.n || 0, t: item.t || '' };
  }

  /** Per question the later t wins (tie: more attempts, then local). Returns the merged list and which side supplied what changed. */
  function mergeItems(localList, remoteList) {
    const local = new Map((localList || []).map(cleanItem).filter(Boolean).map(item => [item.k, item]));
    const remote = new Map((remoteList || []).map(cleanItem).filter(Boolean).map(item => [item.k, item]));
    const items = [];
    const localWon = [];
    const remoteWon = [];
    for (const key of new Set([...local.keys(), ...remote.keys()])) {
      const a = local.get(key);
      const b = remote.get(key);
      if (a && !b) { items.push(a); localWon.push(key); continue; }
      if (!a && b) { items.push(b); remoteWon.push(key); continue; }
      const same = a.t === b.t && a.r === b.r && a.why === b.why && a.n === b.n;
      if (same) { items.push(a); continue; }
      const remoteLater = timeOf(b) > timeOf(a) || (timeOf(b) === timeOf(a) && b.n > a.n);
      if (remoteLater) {
        // The pick is only known on this device; keep it when the remote result is the same answer.
        items.push(a.p && a.r === b.r ? { ...b, p: a.p } : b);
        remoteWon.push(key);
      } else {
        items.push(a);
        localWon.push(key);
      }
    }
    return { items, localWon, remoteWon };
  }

  /* ---------- counts and sentences ---------- */

  /** total = cards in the set; wrong counts r 'w', unknown counts r 'u'; remaining = everything not yet right. */
  function summarize(items, total) {
    const list = Array.isArray(items) ? items : [];
    const count = result => list.filter(item => item.r === result).length;
    const sum = Math.max(0, Number(total) || 0);
    const correct = count('c');
    const wrong = count('w');
    const unknown = count('u');
    return { total: sum, correct, wrong, unknown, answered: correct + wrong + unknown, remaining: Math.max(0, sum - correct), retryable: wrong + unknown };
  }

  /** Top of the self-study screen: "5문항 중 3개 맞음 · 2개 남음". */
  function progressSentence(summary) {
    if (!summary.total) return '';
    if (summary.correct >= summary.total) return `${summary.total}문항 모두 맞혔어요`;
    return `${summary.total}문항 중 ${summary.correct}개 맞음 · ${summary.remaining}개 남음`;
  }

  /** Exam-card button note; '' when nothing was answered yet (the card keeps its existing text). */
  function progressText(kind, summary) {
    if (!summary || !summary.total || !summary.answered) return '';
    return kind === 'similar'
      ? `유사 ${summary.total}문항 중 ${summary.correct}개 맞음`
      : `오답 ${summary.total}개 중 ${summary.correct}개 해결`;
  }

  /* ---------- local storage ---------- */

  const safeId = value => String(value ?? '').replace(/[^A-Za-z0-9_\-가-힣]/g, '_');
  const localKey = (studentId, assignmentId, kind) => `${STORAGE_PREFIX}${safeId(studentId)}_${safeId(assignmentId)}_${kind === 'similar' ? 'similar' : 'wrong'}`;

  /** { total, items, updatedAt } from storage, or null. Never throws. */
  function readLocal(storage, studentId, assignmentId, kind) {
    try {
      const raw = storage?.getItem(localKey(studentId, assignmentId, kind));
      if (!raw) return null;
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || !Array.isArray(value.items)) return null;
      return {
        total: Math.max(0, Number(value.total) || 0),
        items: value.items.map(cleanItem).filter(Boolean),
        updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : ''
      };
    } catch (error) {
      return null;
    }
  }

  function writeLocal(storage, studentId, assignmentId, kind, record) {
    try {
      storage?.setItem(localKey(studentId, assignmentId, kind), JSON.stringify({ v: 1, total: record.total, updatedAt: record.updatedAt, items: record.items }));
      return Boolean(storage);
    } catch (error) {
      return false;
    }
  }

  /** Summary for an exam-card note straight from storage: { ...summary, updatedAt } or null. */
  function readLocalSummary(storage, studentId, assignmentId, kind) {
    const local = readLocal(storage, studentId, assignmentId, kind);
    if (!local || !local.total) return null;
    return { ...summarize(local.items, local.total), updatedAt: local.updatedAt };
  }

  /* ---------- server answers ---------- */

  const timeText = value => (typeof value === 'string' ? value : '');

  /** Server set row -> { assignmentId, kind, ...summary, updatedAt, items }, tolerant of both list and single-set shapes. */
  function normalizeSet(row) {
    if (!row || typeof row !== 'object') return null;
    const items = (Array.isArray(row.items) ? row.items : []).map(cleanItem).filter(Boolean);
    const total = Math.max(0, Number(row.total) || 0);
    const correct = Number.isFinite(Number(row.correct)) ? Number(row.correct) : items.filter(item => item.r === 'c').length;
    const wrong = Number.isFinite(Number(row.wrong)) ? Number(row.wrong) : items.filter(item => item.r === 'w' || item.r === 'u').length;
    return {
      assignmentId: String(row.assignment_id ?? row.assignmentId ?? ''),
      kind: row.kind === 'similar' ? 'similar' : row.kind === 'wrong' ? 'wrong' : '',
      total, correct, wrong, answered: Math.max(correct + wrong, items.filter(item => item.r).length),
      updatedAt: timeText(row.updated_at ?? row.updatedAt), items
    };
  }

  /** Every set a GET answer carries: { sets: [...] }, { set }, { items: [...sets] } or a bare array. */
  function extractSets(data) {
    const body = data && typeof data === 'object' ? data : {};
    const candidates = [body.sets, body.data?.sets, body.set ? [body.set] : null, body.data?.set ? [body.data.set] : null,
      Array.isArray(body.items) && body.items.some(row => row && (row.kind || row.assignment_id)) ? body.items : null,
      Array.isArray(body) ? body : null];
    const list = candidates.find(Array.isArray) || [];
    return list.map(normalizeSet).filter(Boolean);
  }

  /** Map "assignment|kind" -> summary, from a GET without assignment_id. */
  function parseAggregate(data) {
    const map = new Map();
    for (const set of extractSets(data)) {
      if (set.assignmentId && set.kind) map.set(`${set.assignmentId}|${set.kind}`, set);
    }
    return map;
  }

  /** Server note vs local note: whichever was updated later (a missing time loses). */
  function pickProgress(server, local) {
    if (!server) return local || null;
    if (!local) return server;
    const a = Date.parse(server.updatedAt);
    const b = Date.parse(local.updatedAt);
    return (Number.isFinite(b) ? b : -Infinity) > (Number.isFinite(a) ? a : -Infinity) ? local : server;
  }

  /* ---------- recorder ---------- */

  /**
   * One screen's record.
   * opts: { studentId, assignmentId, kind, entries: [{ key, uid, src }], storage, remote, now, setTimer, clearTimer, debounceMs }
   * remote (or null): { enabled(), post({ assignment_id, kind, items }) -> { ok } | { unavailable } | { error },
   *                     get(assignmentId, kind) -> { ok, items } | { unavailable } | { error } } - never throws.
   */
  function createRecorder(opts = {}) {
    const entries = new Map((opts.entries || []).map(entry => [entry.key, entry]));
    const total = entries.size;
    const storage = opts.storage || null;
    const remote = opts.remote || null;
    const now = opts.now || (() => new Date().toISOString());
    const setTimer = opts.setTimer || ((fn, ms) => setTimeout(fn, ms));
    const clearTimer = opts.clearTimer || (handle => clearTimeout(handle));
    const debounceMs = Number.isFinite(opts.debounceMs) ? opts.debounceMs : DEBOUNCE_MS;
    const items = new Map();
    const touched = new Set(); // keys the student changed on this screen: a late server answer never overwrites them
    let timer = null;
    let inflight = false;
    let again = false;
    let pending = false;
    let stopped = false;
    let remoteDead = false; // the server said "not available": this screen sends nothing more
    let detach = null;
    let lastLocal = '';

    const known = key => entries.has(key);
    // The whole set goes every time, unanswered questions included (r null, a time that loses to any real answer): the server then knows the set's size
    // and a lost earlier write is repaired by the next one.
    const sendable = () => [...entries.values()].map(meta => wireItem(items.get(meta.key)
      || { k: meta.key, u: meta.uid || null, src: meta.src ?? null, r: null, why: null, n: 0, t: PLACEHOLDER_TIME })).slice(0, MAX_ITEMS);

    function persist() {
      if (!storage) return;
      lastLocal = now();
      writeLocal(storage, opts.studentId, opts.assignmentId, opts.kind, { total, updatedAt: lastLocal, items: [...items.values()] });
    }

    for (const item of readLocal(storage, opts.studentId, opts.assignmentId, opts.kind)?.items || []) {
      if (known(item.k)) items.set(item.k, item);
    }

    function schedule() {
      if (stopped || remoteDead || !remote || !remote.enabled()) return;
      if (timer !== null) clearTimer(timer);
      timer = setTimer(() => { timer = null; flush(); }, debounceMs);
    }

    async function flush() {
      if (timer !== null) { clearTimer(timer); timer = null; }
      if (!pending || remoteDead || !remote || !remote.enabled()) return false;
      if (inflight) { again = true; return false; }
      inflight = true;
      pending = false;
      let result;
      try { result = await remote.post({ assignment_id: opts.assignmentId, kind: opts.kind, items: sendable() }); } catch (error) { result = { error: true }; }
      inflight = false;
      if (!result || !result.ok) {
        // Server off: nothing more to send this session. Any other failure: send again with the next change or on leaving.
        if (result?.unavailable) remoteDead = true; else pending = true;
      }
      if (again) { again = false; if (pending) schedule(); }
      return Boolean(result?.ok);
    }

    return {
      total,
      entry: key => entries.get(key) || null,
      get: key => items.get(key) || null,
      items: () => [...items.values()],
      summary: () => summarize([...items.values()], total),
      touched: key => touched.has(key),

      /** The student changed a question: patch = { r, why, n, p }. Saves locally now, sends to the server after a short pause. */
      record(key, patch = {}) {
        if (!known(key)) return null;
        const meta = entries.get(key);
        const base = items.get(key) || { k: key, u: meta.uid || null, src: meta.src ?? null, r: null, why: null, n: 0, t: '' };
        const next = cleanItem({ ...base, ...patch, k: key, t: now() });
        if (patch.p === null || patch.r === null) delete next.p;
        items.set(key, next);
        touched.add(key);
        pending = true;
        persist();
        schedule();
        return next;
      },

      /** Merge the server's items of this set into the local record. Resolves { changed: keys the screen should redraw, remote: boolean }. */
      async load() {
        if (remoteDead || !remote || !remote.enabled()) return { changed: [], remote: false };
        let answer;
        try { answer = await remote.get(opts.assignmentId, opts.kind); } catch (error) { answer = { error: true }; }
        if (!answer || !answer.ok || stopped) return { changed: [], remote: false };
        const incoming = (answer.items || []).filter(item => known(item?.k));
        const merged = mergeItems([...items.values()], incoming);
        items.clear();
        for (const item of merged.items) items.set(item.k, item);
        if (merged.remoteWon.some(key => !touched.has(key))) persist();
        if (merged.localWon.length) { pending = true; schedule(); }
        return { changed: merged.remoteWon.filter(key => !touched.has(key)), remote: true };
      },

      flush,

      /** Sends what is waiting when the page is hidden or closed; stop() removes the listeners. */
      start(doc, win) {
        if (detach || !doc) return;
        const onHide = () => { if (doc.visibilityState === 'hidden') flush(); };
        const onLeave = () => { flush(); };
        doc.addEventListener('visibilitychange', onHide);
        win?.addEventListener?.('pagehide', onLeave);
        detach = () => { doc.removeEventListener('visibilitychange', onHide); win?.removeEventListener?.('pagehide', onLeave); };
      },
      stop() {
        const last = flush();
        stopped = true;
        if (timer !== null) { clearTimer(timer); timer = null; }
        if (detach) { detach(); detach = null; }
        return last;
      }
    };
  }

  return {
    WHY_CODES, WHY_LABELS, DEBOUNCE_MS,
    hasChoices, answerIndex, questionMode, choiceCountOf, judge,
    uidOf, wrongKey, similarKey, uniqueKeys,
    cleanItem, wireItem, mergeItems, summarize, progressSentence, progressText,
    localKey, readLocal, writeLocal, readLocalSummary,
    normalizeSet, extractSets, parseAggregate, pickProgress, createRecorder
  };
});
