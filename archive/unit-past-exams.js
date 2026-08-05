(function () {
  'use strict';

  const core = window.High1UnitPastExamsCore;
  const state = { catalog: null, selectedUnitKey: '', fileCache: new Map(), busyKey: '' };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null'); } catch (e) { return null; }
  }

  function compact(value) { return String(value || '').replace(/\s+/g, '').toLowerCase(); }

  function isTeacherSession() {
    const session = getSession();
    if (!session) return false;
    const role = compact(session.role || session.user?.role || session.auth?.role);
    const id = compact(session.id || session.user?.id || session.auth?.id);
    const loginId = compact(session.login_id || session.loginId || session.user?.login_id || session.user?.loginId);
    return ['teacher', 'admin', 'owner'].includes(role) || id === 't_admin' || loginId === 'admin';
  }

  function setStatus(message, isError = false) {
    const el = document.getElementById('unit-status');
    if (!el) return;
    el.textContent = message || '';
    el.style.color = isError ? '#a33b49' : '';
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => { script.remove(); resolve(); };
      script.onerror = () => { script.remove(); reject(new Error(`불러오기 실패: ${src}`)); };
      document.body.appendChild(script);
    });
  }

  function loadQuestionFile(sourceFile) {
    if (state.fileCache.has(sourceFile)) return state.fileCache.get(sourceFile);
    const promise = (async () => {
      delete window.questions;
      delete window.questionBank;
      await loadScript(`exams/${sourceFile}?v=20260805`);
      const data = window.questions || window.questionBank;
      if (!Array.isArray(data)) throw new Error(`${sourceFile}에서 문항 배열을 찾지 못했습니다.`);
      return data.map(question => ({ ...question }));
    })().catch(error => {
      state.fileCache.delete(sourceFile);
      throw error;
    });
    state.fileCache.set(sourceFile, promise);
    return promise;
  }

  async function restorePaperQuestions(paper) {
    const grouped = new Map();
    paper.records.forEach(record => {
      if (!grouped.has(record.sourceFile)) grouped.set(record.sourceFile, []);
      grouped.get(record.sourceFile).push(record);
    });

    const restoredByIdentity = new Map();
    for (const [sourceFile, records] of grouped.entries()) {
      const questions = await loadQuestionFile(sourceFile);
      for (const record of records) {
        const original = questions.find(question => Number(question?.id) === Number(record.sourceQuestionNo));
        if (!original) throw new Error(`${sourceFile}의 ${record.sourceQuestionNo}번 문항을 찾지 못했습니다.`);
        restoredByIdentity.set(`${sourceFile}#${record.sourceQuestionNo}`, {
          ...original,
          _sourceFile: sourceFile,
          _sourceQuestionNo: record.sourceQuestionNo,
          _qKey: `${sourceFile}_${record.sourceQuestionNo}`,
          standardUnitKey: record.mappedUnitKey,
          standardUnit: record.mappedUnit,
          standardCourse: record.mappedCourse
        });
      }
    }

    return paper.records.map(record => restoredByIdentity.get(`${record.sourceFile}#${record.sourceQuestionNo}`));
  }

  function getQpp() { return document.getElementById('unit-qpp')?.value || '2'; }

  function getUnit(unitKey) { return state.catalog?.units.find(unit => unit.key === unitKey); }

  function getPaper(unitKey, paperIndex) { return getUnit(unitKey)?.papers.find(paper => paper.index === Number(paperIndex)); }

  function storeMixedPayload(unit, paper, questions) {
    const title = paper.title;
    const meta = {
      title,
      customTitle: title,
      identityTitle: title,
      count: questions.length,
      generatedAt: new Date().toISOString(),
      category: '단원별 기출',
      grade: '고1',
      gradeLabel: '고1',
      scopeLabel: '2학기 중간까지',
      unitKey: unit.key,
      unitName: unit.name,
      sourceType: 'mixed',
      printHeaderOptions: {
        title,
        metaRight: '고1 단원별 기출',
        subtitle: '2학기 중간까지',
        showNameLine: true,
        showScoreLine: true,
        applyToSolution: true,
        applyToAnswer: true
      }
    };
    localStorage.setItem(`mixedQuestions_${paper.snapshotKey}`, JSON.stringify(questions));
    localStorage.setItem(`mixedMeta_${paper.snapshotKey}`, JSON.stringify(meta));
    return meta;
  }

  function appendSessionHash(url) {
    const session = getSession();
    if (!session) return url;
    const payload = {
      login_id: session.login_id || session.loginId || '',
      id: session.id || session.user?.id || '',
      name: session.name || session.user?.name || '',
      role: session.role || session.user?.role || '',
      session_token: session.session_token || '',
      expires_at: session.expires_at || ''
    };
    if (!payload.session_token && !payload.login_id) return url;
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    return `${url}#apmsess=${encoded}`;
  }

  function buildMixedUrl(paper, options = {}) {
    const url = new URL('mixed_engine.html', window.location.href);
    url.searchParams.set('key', paper.snapshotKey);
    url.searchParams.set('qpp', getQpp());
    url.searchParams.set('mode', 'exam');
    url.searchParams.set('q', String(paper.count));
    if (options.submitQr) url.searchParams.set('submitQr', '1');
    if (options.classId) url.searchParams.set('class', options.classId);
    if (options.teacherName) url.searchParams.set('teacher', options.teacherName);
    if (options.className) url.searchParams.set('className', options.className);
    return url.toString();
  }

  async function preparePaper(unitKey, paperIndex, button) {
    const unit = getUnit(unitKey);
    const paper = getPaper(unitKey, paperIndex);
    if (!unit || !paper) throw new Error('문제지를 찾지 못했습니다.');
    const busyKey = `${unitKey}:${paperIndex}`;
    if (state.busyKey) throw new Error('다른 문제지를 준비하고 있습니다.');
    state.busyKey = busyKey;
    const oldText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = '준비 중…'; }
    setStatus(`${paper.title} 문항을 불러오는 중입니다.`);
    try {
      const questions = await restorePaperQuestions(paper);
      storeMixedPayload(unit, paper, questions);
      setStatus(`${paper.title} · ${questions.length}문항 준비 완료`);
      return { unit, paper, questions };
    } finally {
      state.busyKey = '';
      if (button) { button.disabled = false; button.textContent = oldText; }
    }
  }

  async function printPaper(unitKey, paperIndex, button) {
    try {
      const { paper } = await preparePaper(unitKey, paperIndex, button);
      window.open(appendSessionHash(buildMixedUrl(paper)), '_blank');
    } catch (error) {
      console.error(error);
      setStatus(error.message || '문제지 준비에 실패했습니다.', true);
      alert(error.message || '문제지 준비에 실패했습니다.');
    }
  }

  async function assignPaper(unitKey, paperIndex, button) {
    try {
      const { unit, paper } = await preparePaper(unitKey, paperIndex, button);
      const pending = {
        unitPast: true,
        unitPastSnapshotKey: paper.snapshotKey,
        identityTitle: paper.title,
        title: paper.title,
        topic: paper.title,
        subject: unit.course,
        grade: '고1',
        qCount: paper.count,
        count: paper.count,
        source_type: 'mixed'
      };
      localStorage.setItem(`APMATH_UNIT_PAST_ASSIGN_${paper.snapshotKey}`, JSON.stringify(pending));
      const url = new URL('index.html', window.location.href);
      url.searchParams.set('unitPastAssign', paper.snapshotKey);
      url.searchParams.set('qpp', getQpp());
      window.location.href = appendSessionHash(url.toString());
    } catch (error) {
      console.error(error);
      setStatus(error.message || '출제 준비에 실패했습니다.', true);
      alert(error.message || '출제 준비에 실패했습니다.');
    }
  }

  function renderDetail(unitKey) {
    state.selectedUnitKey = unitKey;
    document.querySelectorAll('.unit-card').forEach(card => card.classList.toggle('is-active', card.dataset.unitKey === unitKey));
    const unit = getUnit(unitKey);
    const root = document.getElementById('unit-detail-root');
    if (!unit || !unit.count) { root.innerHTML = ''; return; }
    root.innerHTML = `
      <section class="unit-detail">
        <div class="unit-detail-head">
          <div><h2>${escapeHtml(unit.name)}</h2><p>${escapeHtml(unit.course)} · 총 ${unit.count}문항 · ${unit.papers.length}개 문제지</p></div>
        </div>
        <div class="unit-paper-list">
          ${unit.papers.map(paper => `
            <article class="unit-paper">
              <div><div class="unit-paper-title">${escapeHtml(paper.title)}</div><div class="unit-paper-meta">${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</div></div>
              <div class="unit-paper-actions">
                <button class="unit-btn" onclick="High1UnitPastExams.printPaper('${unit.key}', ${paper.index}, this)">일반 출력</button>
                <button class="unit-btn primary" onclick="High1UnitPastExams.assignPaper('${unit.key}', ${paper.index}, this)">반·학생에게 출제</button>
              </div>
            </article>`).join('')}
        </div>
      </section>`;
    root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderCatalog() {
    const root = document.getElementById('unit-content');
    const courses = ['공통수학1', '공통수학2'];
    root.innerHTML = courses.map(course => {
      const units = state.catalog.units.filter(unit => unit.course === course);
      const count = units.reduce((sum, unit) => sum + unit.count, 0);
      return `<section class="unit-course">
        <div class="unit-course-head"><h2>${course}</h2><span>${count}문항</span></div>
        <div class="unit-grid">${units.map(unit => `
          <button class="unit-card ${unit.count ? '' : 'is-empty'}" data-unit-key="${unit.key}" ${unit.count ? `onclick="High1UnitPastExams.renderDetail('${unit.key}')"` : 'disabled'}>
            <div class="unit-card-no">${String(unit.order).padStart(2, '0')}</div>
            <h3>${escapeHtml(unit.name)}</h3>
            <div class="unit-card-meta"><span>${unit.count}문항</span><span>${unit.papers.length ? `${unit.papers.length}개 문제지` : '자료 없음'}</span></div>
          </button>`).join('')}</div>
      </section>`;
    }).join('') + '<div id="unit-detail-root"></div>' + renderReview();
  }

  function renderReview() {
    const rows = [...state.catalog.review, ...state.catalog.invalid];
    if (!rows.length) return '';
    return `<section class="unit-review"><h2>검토 필요 · ${rows.length}문항</h2><p>단원 문제지에는 포함하지 않았습니다. 원본 데이터를 교정하면 다음 인덱스 갱신 때 자동 반영됩니다.</p><ul>${rows.map(row => `<li>${escapeHtml(row.sourceFile || '원본 없음')} #${escapeHtml(core.getQuestionNo(row) || '-')} · ${escapeHtml(row.classificationReason || '')}</li>`).join('')}</ul></section>`;
  }

  async function init() {
    const app = document.getElementById('unit-content');
    if (!core) { app.innerHTML = '<div class="unit-error">단원 집계 모듈을 불러오지 못했습니다.</div>'; return; }
    if (!isTeacherSession()) { app.innerHTML = '<div class="unit-error">단원별 기출은 AP Math OS 선생님 로그인 후 사용할 수 있습니다.<br><a href="index.html">아카이브로 돌아가기</a></div>'; return; }
    if (!Array.isArray(window.questionIndex)) { app.innerHTML = '<div class="unit-error">question-index.js를 불러오지 못했습니다.</div>'; return; }
    state.catalog = core.buildCatalog(window.questionIndex);
    document.getElementById('unit-summary').innerHTML = `<span>분류 ${state.catalog.classifiedCount.toLocaleString()}문항</span><span>18개 표시 단원</span><span>문제지당 최대 80문항</span><span>2학기 중간까지</span>`;
    setStatus(`유효 후보 ${state.catalog.candidateCount.toLocaleString()}문항을 집계했습니다.`);
    renderCatalog();
  }

  window.High1UnitPastExams = { init, renderDetail, printPaper, assignPaper };
})();
