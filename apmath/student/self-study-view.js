/* Student portal: self-study question cards.
   Input is only a set: { title, questions: [{ no, sourceLabel?, content, choices, image, answer, solution, ... }] }.
   Each question becomes one card (stem, choices, figure) with "정답 보기" / "해설 보기" that open for THAT question only,
   whenever the student wants. Nothing is locked, ordered, recorded or sent anywhere.

   Step 1 ("오답 다시 풀기") builds the set with buildWrongSet(): the exam's questions filtered by the wrong numbers.
   Step 2 (similar problems) only has to build another set and call show() - the card screen does not know where the questions came from.

   Rendering reuses the archive pieces instead of a new typesetter: APRenderText (text -> HTML), ApTableEngine (tables),
   APArchiveAssetBase (figure URLs), ArchiveStudentSvgRefresh (the same refreshed figures the engine shows students) and the
   vendored MathJax. All of them are loaded the first time this screen opens, never at portal start. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudentSelfStudyView = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  // Same file versions as archive/engine.html, so the browser keeps one copy of each.
  const ARCHIVE_SCRIPTS = {
    assetBase: 'archive-asset-base.js?v=20261110-teacher-copy-1',
    tableEngine: 'js/ap-table-engine.js?v=20261109-ap-table-1',
    renderText: 'render-text.js?v=20261121-question-spacing',
    svgRefresh: 'student-svg-refresh.js?v=1',
    atomicInline: 'mathjax-atomic-inline.js?v=20261117-atomic-inline-1'
  };
  const MATHJAX_LOCAL = 'vendor/mathjax-tex-font/tex-mml-chtml-mathjax-tex.js';
  const MATHJAX_CDN = 'https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-chtml.js';
  const PLACEHOLDER_SOLUTION = /^\s*\[JS 기준 풀이\]/;
  const FAIL_CARD_TEXT = '이 문항을 불러오지 못했습니다.';

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* ---------- pure helpers (unit-tested in node) ---------- */

  /** Wrong numbers are positions 1..N in the issued question list, whatever the question's own id looks like (7, "Q07", ...). */
  function normalizeNumbers(values) {
    return Array.from(new Set((Array.isArray(values) ? values : [])
      .map(value => parseInt(value, 10))
      .filter(value => Number.isFinite(value) && value > 0)))
      .sort((a, b) => a - b);
  }

  function questionList(bank) {
    if (Array.isArray(bank)) return bank;
    return Array.isArray(bank?.questions) ? bank.questions : Array.isArray(bank?.problems) ? bank.problems : [];
  }

  /** Step 1: the exam's questions at the wrong positions, as a card-screen input set. A position without a question stays as a failed card. */
  function buildWrongSet({ title = '', questions = [], wrongIds = [] } = {}) {
    const list = questionList(questions);
    return {
      title: String(title || ''),
      questions: normalizeNumbers(wrongIds).map(no => {
        const question = list[no - 1];
        return question && typeof question === 'object' ? { ...question, no, sourceLabel: '' } : { no, missing: true };
      })
    };
  }

  /** "[JS 기준 풀이] ..." is a stock sentence, not an explanation: such a question shows only its answer. */
  function hasRealSolution(entry) {
    const text = String(entry?.solution ?? '').trim();
    return Boolean(text) && !PLACEHOLDER_SOLUTION.test(text);
  }

  function hasAnswer(entry) {
    return entry?.answer !== undefined && entry?.answer !== null && String(entry.answer).trim() !== '';
  }

  /** "11/20 왕지중 1회 · 오답 다시 풀기 5문항" - the exam part comes from the portal's own title helper. */
  function buildTitle({ date = '', examTitle = '', purpose = '', count = 0 } = {}) {
    const day = /^\d{4}-(\d{2})-(\d{2})/.exec(String(date || ''));
    const head = [day ? `${Number(day[1])}/${Number(day[2])}` : '', String(examTitle || '').trim()].filter(Boolean).join(' ');
    return `${head ? `${head} · ` : ''}${purpose}${count ? ` ${count}문항` : ''}`;
  }

  function stripInlineImages(content, hasImageField) {
    const text = String(content ?? '');
    if (!hasImageField) return text;
    return text.replace(/(?:<br\s*\/?>\s*)*<img[^>]*>(?:\s*<br\s*\/?>)*/gi, '<br>')
      .replace(/^(?:<br\s*\/?>\s*)+/i, '').replace(/(?:<br\s*\/?>\s*)+$/i, '');
  }

  function decorateSolutionSections(html) {
    const lead = value => (value ? '<br>' : '');
    return String(html || '')
      .replace(/(^|(?:<br\s*\/?>\s*)+)\s*\[키포인트\]\s*(?:(?:<br\s*\/?>\s*)+)?/g, (_, l) => `${lead(l)}<span class="sol-sec-label">[키포인트]</span> `)
      .replace(/(^|(?:<br\s*\/?>\s*)+)\s*(조건 정리|풀이 방향|풀이 과정|정석 풀이|결론)\s*:?\s*(?:(?:<br\s*\/?>\s*)+)?/g,
        (_, l, label) => `${lead(l)}<span class="sol-sec-label">${label}:</span> `);
  }

  function formatSolution(text, T) {
    const raw = String(text ?? '');
    const sections = /(^|\\n|\r?\n|<br\s*\/?>)\s*(?:\[키포인트\]|조건 정리|풀이 방향|풀이 과정|정석 풀이|결론)(?=\s|:|$)/.test(raw);
    return sections ? decorateSolutionSections(T.wrapLatex(T.normalizeSolutionLineBreaks(raw))) : T.wrapLatex(raw);
  }

  /** deps: { text: APRenderText, imageUrl(src) -> url, crossOrigin(url) -> ' crossorigin=..', resolveHtml(html) -> html }. */
  function figureHtml(src, alt, className, deps) {
    if (!src) return '';
    const url = deps.imageUrl(String(src));
    return `<figure class="${className}"><img src="${escapeHtml(url)}"${deps.crossOrigin(url)} alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></figure>`;
  }

  function failedCardHtml(no, reason) {
    return `<article class="ss-card is-failed" id="ss-q-${escapeHtml(no)}" data-no="${escapeHtml(no)}">
      <header class="ss-card-head"><span class="ss-no">${escapeHtml(no)}번</span></header>
      <p class="ss-fail" role="status">${FAIL_CARD_TEXT}${reason ? ` <small>${escapeHtml(reason)}</small>` : ''}</p>
    </article>`;
  }

  /** One question card. A question that cannot be rendered becomes a failed card; it never throws into the screen. */
  function renderCard(entry, deps) {
    const no = entry?.no;
    try {
      if (!entry || entry.missing) return failedCardHtml(no, '');
      const T = deps.text;
      const raw = stripInlineImages(entry.content ?? entry.question ?? '', Boolean(entry.image));
      let body = T.wrapLatex(raw);
      body = T.stripLeadingQuestionNumber(body, entry);
      body = T.normalizeQuestionContentBreaks(body, { subjective: /서(?:술|논술)형/.test(entry.questionType || '') });
      body = T.normalizeViewBlocks(body)
        .replace(/<div class="question-table-wrap">\s*<table/gi, '<div class="question-table-wrap"><table class="question-table"')
        .replace(/<table(?![^>]*class=)/gi, '<table class="question-table"');
      body = deps.resolveHtml(body);
      let choices = T.renderChoicesHTML(entry);
      if (/^<div class="answer-box"><\/div>$/.test(choices)) choices = '';
      // A long choice (a wide formula or a sentence) gets a full-width row; short ones keep the archive's compact/grid columns.
      if (choices && (Array.isArray(entry.choices) ? entry.choices : []).some(choice => String(T.extractChoice(choice)).length > 30)) {
        choices = choices.replace(/class="choices choices-\w+"(?: style="[^"]*")?/, 'class="choices choices-block"');
      }
      choices = deps.resolveHtml(choices);

      const answer = hasAnswer(entry);
      const solution = hasRealSolution(entry);
      const answerHtml = answer ? `<div class="ss-reveal ss-answer" id="ss-a-${escapeHtml(no)}" hidden><strong>정답</strong> <span class="ss-reveal-body">${T.wrapLatex(String(entry.answer))}</span></div>` : '';
      const solutionHtml = solution
        ? `<div class="ss-reveal ss-solution" id="ss-s-${escapeHtml(no)}" hidden><strong>해설</strong>
            <div class="ss-reveal-body">${deps.resolveHtml(formatSolution(entry.solution, T))}</div>
            ${figureHtml(entry.solutionImage, entry.solutionImageAlt || '해설 그림', 'ss-figure ss-solution-figure', deps)}</div>`
        : '';
      const buttons = [
        answer ? `<button type="button" class="btn ss-toggle" data-ss-toggle="answer" data-ss-no="${escapeHtml(no)}" aria-expanded="false" aria-controls="ss-a-${escapeHtml(no)}" data-open-label="정답 숨기기">정답 보기</button>` : '',
        solution ? `<button type="button" class="btn ss-toggle" data-ss-toggle="solution" data-ss-no="${escapeHtml(no)}" aria-expanded="false" aria-controls="ss-s-${escapeHtml(no)}" data-open-label="해설 숨기기">해설 보기</button>` : ''
      ].join('');
      return `<article class="ss-card" id="ss-q-${escapeHtml(no)}" data-no="${escapeHtml(no)}">
        <header class="ss-card-head"><span class="ss-no">${escapeHtml(no)}번</span>${entry.sourceLabel ? `<span class="ss-source">${escapeHtml(entry.sourceLabel)}</span>` : ''}</header>
        <div class="ss-q">
          <div class="ss-stem">${body}</div>
          ${figureHtml(entry.image, entry.imageAlt || '문제 그림', 'ss-figure', deps)}
          ${choices}
        </div>
        ${buttons ? `<div class="ss-actions">${buttons}</div>` : ''}
        ${answerHtml}${solutionHtml}
      </article>`;
    } catch (error) {
      return failedCardHtml(no, '');
    }
  }

  /* ---------- exam loading ---------- */

  function parseExamSource(text) {
    const sandbox = {};
    new Function('window', 'self', `${text}\n`)(sandbox, sandbox);
    const list = questionList(sandbox.questionBank || sandbox.examData);
    if (!list.length) throw new Error('EXAM_QUESTIONS_MISSING');
    return list;
  }

  /** Same rule as archive/engine.html normalizeArchiveExamScriptPath: only "exams/<name>.js" in a plain relative form, else ''. */
  function safeExamPath(raw) {
    const value = String(raw || '').trim();
    if (!value || value.length > 512 || /\\|%5c/i.test(value)) return '';
    let decoded;
    try { decoded = decodeURIComponent(value); } catch (error) { return ''; }
    if (/\\/.test(decoded)) return '';
    decoded = decoded.trim().replace(/^\.\/+/, '').replace(/^archive\/exams\//, 'exams/');
    if (!decoded || decoded.length > 512 || /[?#]/.test(decoded)) return '';
    if (/^(https?:)?\/\//i.test(decoded) || /^(javascript|data|blob):/i.test(decoded)) return '';
    if (decoded.includes('../') || decoded.includes('/./') || decoded.includes('//') || /%2e|%2f|%5c/i.test(decoded)) return '';
    return /^exams\/[a-zA-Z0-9가-힣_\-./]+\.js$/.test(decoded) ? decoded : '';
  }

  /** One exam JS file (path relative to archive/, e.g. "exams/similar/..js") -> its question list. Nothing else is ever downloaded and run. */
  async function fetchQuestionList(relativePath, { fetchImpl, baseUrl } = {}) {
    const fetcher = fetchImpl || (typeof fetch === 'function' ? fetch.bind(root) : null);
    const safe = safeExamPath(relativePath);
    if (!safe) throw new Error('EXAM_PATH_REJECTED');
    const here = new URL(baseUrl || root.location.href);
    const archive = new URL('../../archive/', here);
    const url = new URL(safe, archive);
    if (url.origin !== here.origin || !url.pathname.startsWith(`${archive.pathname}exams/`) || !url.pathname.endsWith('.js')) throw new Error('EXAM_PATH_REJECTED');
    const response = await fetcher(url.href);
    if (!response || !response.ok) throw new Error('EXAM_FETCH_FAILED');
    return parseExamSource(await response.text());
  }

  /** The exam's own file questions (never the frozen snapshot); only for an exam that is one plain past-exam file. */
  function loadExamFile(exam, options) {
    const archiveFile = String(exam?.archive_file || '').trim();
    if (!archiveFile || archiveFile.startsWith('MIXED:')) return Promise.reject(new Error('EXAM_SOURCE_UNAVAILABLE'));
    return fetchQuestionList(archiveFile, options);
  }

  /** The issued questions of an assignment: the frozen snapshot when the server sent one, otherwise the exam's own file. */
  async function loadExamQuestions(exam, { fetchImpl, baseUrl } = {}) {
    const archiveFile = String(exam?.archive_file || '').trim();
    let frozen = null;
    try { frozen = JSON.parse(String(exam?.mixed_payload_json || 'null')); } catch (error) { frozen = null; }
    let questions = Array.isArray(frozen?.questions) && frozen.questions.length ? frozen.questions : null;
    if (!questions) {
      questions = await loadExamFile(exam, { fetchImpl, baseUrl });
    }
    const refresher = root.ArchiveStudentSvgRefresh;
    if (refresher?.refresh && exam?.assignment_id) {
      // Same projection the engine applies to student review pages; it returns the input unchanged on any problem.
      try {
        questions = await refresher.refresh(questions, {
          sourceKind: 'assignment', assignmentId: String(exam.assignment_id), sourceId: archiveFile,
          meta: frozen?.meta && typeof frozen.meta === 'object' ? frozen.meta : {}
        }, { baseUrl: new URL('../../archive/', baseUrl || root.location.href).href });
      } catch (error) { /* keep the original figures */ }
    }
    return questions;
  }

  /* ---------- browser side ---------- */

  const scriptLoads = new Map();
  function loadScript(src, doc) {
    if (!scriptLoads.has(src)) {
      scriptLoads.set(src, new Promise(resolve => {
        const script = doc.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve(true);
        script.onerror = () => { scriptLoads.delete(src); script.remove(); resolve(false); };
        doc.head.appendChild(script);
      }));
    }
    return scriptLoads.get(src);
  }

  function configureMathJax(vendorBase) {
    if (root.MathJax) return;
    root.MathJax = {
      loader: { paths: { mathjax: `${vendorBase}mathjax`, 'mathjax-tex': `${vendorBase}mathjax-tex-font` }, load: ['[tex]/boldsymbol'] },
      tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']], packages: { '[+]': ['ams', 'boldsymbol'] }, macros: { wideparen: ['\\overset{\\frown}{#1}', 1] } },
      output: { font: 'mathjax-tex', displayOverflow: 'linebreak', linebreaks: { inline: true, width: '100%', lineleading: 0.2 } },
      options: { enableMenu: false },
      startup: {
        typeset: false,
        pageReady() {
          // Same as the archive pages: no per-formula semantic/speech workers (they made each formula cost ~10 ms).
          const startup = root.MathJax.startup;
          for (const key of ['enableEnrichment', 'enableSpeech', 'enableBraille', 'enableExplorer', 'enableComplexity']) {
            if (startup.document?.options && key in startup.document.options) startup.document.options[key] = false;
          }
          return startup.defaultPageReady();
        }
      }
    };
  }

  let assetsPromise = null;
  /** Loads the archive renderers once. Resolves { text, mathReady }; rejects only when the text renderer itself is missing. */
  function ensureAssets(doc, baseUrl) {
    if (assetsPromise) return assetsPromise;
    const archive = new URL('../../archive/', baseUrl || root.location.href).href;
    assetsPromise = (async () => {
      configureMathJax(`${archive}vendor/`);
      const [assetBase, tables, , svg] = await Promise.all([
        loadScript(archive + ARCHIVE_SCRIPTS.assetBase, doc),
        loadScript(archive + ARCHIVE_SCRIPTS.tableEngine, doc),
        loadScript(archive + ARCHIVE_SCRIPTS.atomicInline, doc),
        loadScript(archive + ARCHIVE_SCRIPTS.svgRefresh, doc)
      ]);
      void assetBase; void tables; void svg;
      const text = await loadScript(archive + ARCHIVE_SCRIPTS.renderText, doc);
      if (!text || !root.APRenderText) throw new Error('RENDER_TEXT_UNAVAILABLE');
      let mathReady = await loadScript(archive + MATHJAX_LOCAL, doc);
      if (!mathReady) mathReady = await loadScript(MATHJAX_CDN, doc);
      if (mathReady) {
        try { await root.MathJax?.startup?.promise; } catch (error) { mathReady = false; }
      }
      return { text: root.APRenderText, mathReady: Boolean(mathReady && root.MathJax?.typesetPromise), archive };
    })().catch(error => { assetsPromise = null; throw error; });
    return assetsPromise;
  }

  function makeDeps(assets) {
    const base = root.APArchiveAssetBase;
    const archive = assets.archive;
    const imageUrl = src => {
      let url = base?.resolveExamImageUrl ? base.resolveExamImageUrl(src) : src;
      // Anything the image base did not move to the external host is relative to the archive folder, not to the portal.
      if (!/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) url = new URL(url.replace(/^\.?\//, ''), archive).href;
      return url;
    };
    return {
      text: assets.text,
      imageUrl,
      crossOrigin: url => (base?.crossOriginAttr ? base.crossOriginAttr(url) : ''),
      resolveHtml: html => {
        const resolved = base?.resolveHtml ? base.resolveHtml(html) : html;
        return String(resolved).replace(/(<img\b[^>]*?\bsrc\s*=\s*)(["'])((?!(?:[a-z][a-z0-9+.-]*:|\/\/))[^"']*)\2/gi,
          (match, pre, quote, src) => `${pre}${quote}${new URL(src.replace(/^\.?\//, ''), archive).href}${quote}`);
      }
    };
  }

  async function typeset(element, assets) {
    if (!assets.mathReady) return;
    await root.MathJax.typesetPromise([element]);
  }

  function markFailed(card, no) {
    const holder = card.ownerDocument.createElement('div');
    holder.innerHTML = failedCardHtml(no, '');
    card.replaceWith(holder.firstElementChild);
  }

  /**
   * Draws the card screen into options.container.
   * options: { container, onBack(), headerHtml?, document?, baseUrl? }. set: { title, questions }.
   * Returns once the cards are on screen; formulas are typeset card by card afterwards (first card first).
   */
  async function show(set, options = {}) {
    const container = options.container;
    const doc = options.document || container.ownerDocument;
    const questions = Array.isArray(set?.questions) ? set.questions : [];
    const token = Symbol('self-study');
    container.__selfStudyToken = token;
    const isCurrent = () => container.isConnected && container.__selfStudyToken === token && Boolean(container.querySelector('.self-study'));
    const shell = body => `<div class="student-shell self-study">${options.headerHtml || ''}
      <button type="button" class="btn back-btn" data-ss-back>← 돌아가기</button>
      <section class="ss-head"><h1 class="card-title ss-title">${escapeHtml(set?.title || '')}</h1>
        <p class="card-desc">풀어 보다가 모르겠으면 문항마다 정답·해설을 바로 열어 보세요. 기록되지 않아요.</p></section>${body}</div>`;
    container.innerHTML = shell('<div class="empty" role="status">문항을 불러오는 중입니다.</div>');
    const bind = () => container.querySelector('[data-ss-back]')?.addEventListener('click', () => options.onBack?.());
    bind();
    let assets;
    try {
      assets = await ensureAssets(doc, options.baseUrl);
    } catch (error) {
      if (!isCurrent()) return;
      container.innerHTML = shell('<div class="empty" role="alert"><strong>문항 화면을 준비하지 못했어요.</strong><p>연결을 확인한 뒤 다시 시도해 주세요.</p></div>');
      bind();
      return;
    }
    if (!isCurrent()) return;
    const deps = makeDeps(assets);
    const cards = questions.map(entry => renderCard(entry, deps)).join('');
    container.innerHTML = shell(`
      ${assets.mathReady ? '' : '<p class="notice ss-math-notice" role="status">수식 표시를 불러오지 못해 일부 수식이 기호 그대로 보일 수 있어요.</p>'}
      ${cards ? `<div class="ss-list">${cards}</div>` : `<div class="empty">${escapeHtml(set?.emptyText || '표시할 문항이 없습니다.')}</div>`}
      ${cards && options.bottomAction ? `<button type="button" class="btn btn-primary ss-next" data-ss-next>${escapeHtml(options.bottomAction.label)}</button>` : ''}
      <button type="button" class="btn back-btn ss-back-bottom" data-ss-back>← 돌아가기</button>`);
    container.querySelector('[data-ss-next]')?.addEventListener('click', () => options.bottomAction?.onClick?.());
    container.querySelectorAll('[data-ss-back]').forEach(button => button.addEventListener('click', () => options.onBack?.()));

    // Listeners live on this screen's own root (rebuilt on every open), not on the shared container.
    const screen = container.querySelector('.self-study');
    // A figure that cannot load only marks its own card.
    screen.addEventListener('error', event => {
      const image = event.target;
      if (!image || image.tagName !== 'IMG') return;
      const figure = image.closest('.ss-figure');
      if (!figure || figure.dataset.failed) return;
      figure.dataset.failed = '1';
      figure.innerHTML = '<span class="ss-img-fail">이 문항의 그림을 불러오지 못했습니다. 연결을 확인한 뒤 다시 열어 주세요.</span>';
      figure.closest('.ss-card')?.classList.add('has-issue');
    }, true);

    // Per-question reveal, typeset on first open (a hidden element has no width to break lines against).
    screen.addEventListener('click', async event => {
      const button = event.target.closest?.('[data-ss-toggle]');
      if (!button || !screen.contains(button)) return;
      const panel = screen.querySelector(`#${button.getAttribute('aria-controls')}`);
      if (!panel) return;
      const open = panel.hidden;
      panel.hidden = !open;
      if (!button.dataset.closedLabel) button.dataset.closedLabel = button.textContent;
      button.textContent = open ? button.dataset.openLabel : button.dataset.closedLabel;
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && !panel.dataset.typeset) {
        panel.dataset.typeset = '1';
        try { await typeset(panel, assets); } catch (error) {
          panel.querySelector('.ss-reveal-body')?.insertAdjacentHTML('beforeend', '<p class="ss-img-fail">수식을 표시하지 못했습니다.</p>');
        }
      }
    });

    for (const card of Array.from(screen.querySelectorAll('.ss-card'))) {
      if (!isCurrent() || !card.isConnected) break;
      if (!card.classList.contains('is-failed')) {
        try { await typeset(card.querySelector('.ss-q'), assets); } catch (error) {
          markFailed(card, card.dataset.no);
          continue;
        }
      }
      card.classList.add('is-ready');
    }
    screen.querySelectorAll('.ss-card:not(.is-ready)').forEach(card => card.classList.add('is-ready'));
  }

  return {
    normalizeNumbers, buildWrongSet, buildTitle, hasRealSolution, hasAnswer, renderCard, failedCardHtml,
    parseExamSource, safeExamPath, fetchQuestionList, loadExamFile, loadExamQuestions, ensureAssets, show, FAIL_CARD_TEXT
  };
});
