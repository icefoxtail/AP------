/* Student portal: "유사문제 풀어보기" entry on a past-exam card.
   Self-study only. Nothing is recorded, nothing is submitted, no teacher action is involved: the entry is a
   plain link that opens the similar-problem exam in the shared archive engine with the same
   engine.html?data=exams/<file>&mode=exam|sol|ans contract the teacher screens use.
   The past-exam -> similar-files map is the small file the Pages build writes
   (tools/lib/build-similar-links.mjs); the portal never downloads the 75 MB catalog. If the map is missing
   or broken the entry is simply absent and every card stays exactly as it was. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentSimilarLink = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const Net = root.StudentFetch || (typeof require === 'function' ? require('./student-fetch.js') : null);
  const MAP_PATH = '../../archive/data/similar-links-v1.json';
  const ENGINE_PATH = '../../archive/engine.html';
  const MODES = ['exam', 'ans', 'sol'];

  /** Assignment archive_file ("exams/<file>") -> map key ("<file>"); '' for anything that is not an original exam file. */
  function originalFileOf(archiveFile) {
    const text = String(archiveFile || '').trim().replace(/\\/g, '/');
    if (!text || text.startsWith('MIXED:')) return '';
    return text.replace(/^\.?\//, '').replace(/^archive\//, '').replace(/^exams\//, '');
  }

  /** Cleans a loaded JSON value into { "<original>": [{ file, count }] }; anything malformed is dropped. */
  function normalizeMap(value) {
    const out = Object.create(null);
    const source = value && value.version === 1 && value.map && typeof value.map === 'object' ? value.map : {};
    for (const key of Object.keys(source)) {
      const sets = (Array.isArray(source[key]) ? source[key] : [])
        .map((row) => ({ file: String(Array.isArray(row) ? row[0] : '').trim(), count: Number(Array.isArray(row) ? row[1] : 0) || 0 }))
        .filter((row) => row.file.startsWith('similar/') && row.file.endsWith('.js') && !row.file.includes('..'));
      if (sets.length) out[key] = sets;
    }
    return out;
  }

  function setsFor(map, exam) {
    const key = originalFileOf(exam?.archive_file);
    return key && map && Object.hasOwn(map, key) ? map[key] : [];
  }

  /** engine.html?data=exams/<file>&mode=... ; studentReview keeps the student image base and the way back to the portal. */
  function buildUrl(file, mode, baseUrl, returnTarget) {
    const url = new URL(ENGINE_PATH, baseUrl);
    url.searchParams.set('data', `exams/${file}`);
    url.searchParams.set('mode', MODES.includes(mode) ? mode : 'exam');
    url.searchParams.set('fit', 'screen');
    url.searchParams.set('studentReview', '1');
    url.searchParams.set('submitQr', '0');
    if (returnTarget) url.searchParams.set('studentReturnTo', returnTarget);
    return url.href;
  }

  /** Card markup, or '' when this exam has no linked similar set. Condition for 정답·해설 equals the card's own review buttons. */
  function renderEntry(exam, map, { baseUrl, returnTarget = '', escapeHtml = (v) => String(v) } = {}) {
    const sets = setsFor(map, exam);
    if (!sets.length) return '';
    const rows = sets.map((set, index) => {
      const name = sets.length > 1 ? `유사 ${index + 1}` : '유사문제';
      const chip = (mode, label, spoken, extraClass = '') =>
        `<a class="similar-chip${extraClass}" href="${escapeHtml(buildUrl(set.file, mode, baseUrl, returnTarget))}" target="_blank" rel="noopener" aria-label="${escapeHtml(`${name} ${spoken}`)}">${label}</a>`;
      return `<div class="similar-set">${sets.length > 1 ? `<span class="similar-set-name">${escapeHtml(name)}</span>` : ''}${chip('exam', '풀어보기', '풀어보기', ' similar-open')}${chip('ans', '정답', '정답 보기')}${chip('sol', '해설', '해설 보기')}</div>`;
    }).join('');
    return `<section class="similar-entry${sets.length === 1 ? ' is-single' : ''}" aria-label="유사문제">
      <div class="similar-entry-head"><strong>유사문제</strong><span class="similar-entry-note">자습용 · 기록 안 됨</span></div>
      ${rows}
    </section>`;
  }

  /** Never throws: a failed, slow (time limit in student-fetch.js) or malformed download means "no similar entries". */
  async function load(fetchImpl, baseUrl) {
    try {
      return normalizeMap(await Net.request(fetchImpl, new URL(MAP_PATH, baseUrl).href, { read: 'json' }));
    } catch {
      return Object.create(null);
    }
  }

  return { originalFileOf, normalizeMap, setsFor, buildUrl, renderEntry, load, MAP_PATH };
});
