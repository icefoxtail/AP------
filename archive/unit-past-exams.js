(function () {
  'use strict';

  const core = window.UnitPastExamsCore || window.High1UnitPastExamsCore;
  const LEVELS = ['하', '중', '상', '미분류'];
  const QUICK_PRESETS = {
    basic: { label: '기초 다지기', buckets: ['하'], weights: [1] },
    concept: { label: '개념 확인', buckets: ['하', '중'], weights: [0.6, 0.4] },
    exam: { label: '시험 대비', buckets: ['하', '중', '상'], weights: [0.2, 0.6, 0.2] },
    challenge: { label: '도전 문제', buckets: ['중', '상'], weights: [0.3, 0.7] }
  };
  const state = {
    catalog: null, index: [], profileId: 'h1', selectedUnitKey: '', fileCache: new Map(), busyKey: '',
    metadataLoaded: false, metadataError: false, filterState: null, collectionState: null, generatedPapers: []
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }
  function getSession() {
    try {
      const stored = JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null');
      if (stored) return stored;
    } catch (e) { /* fall through to the archive hand-off hash */ }
    try {
      const encoded = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('apmsess');
      if (!encoded) return null;
      return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(encoded)))));
    } catch (e) { return null; }
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
  async function loadMetadata() {
    if (!window.__ARCHIVE_METADATA_READY__) return null;
    const data = await window.__ARCHIVE_METADATA_READY__;
    state.metadataLoaded = Boolean(data);
    state.metadataError = !data;
    return data;
  }
  function joinApprovedMetadata(records) {
    const sidecar = window.ARCHIVE_QUESTION_METADATA;
    const bySource = new Map();
    for (const meta of sidecar?.records || []) {
      const file = String(meta.sourceArchiveFile || '').replace(/\\/g, '/');
      bySource.set(`${file}#${meta.sourceOrdinal}`, meta);
      if (meta.sourceQuestionNo !== undefined) bySource.set(`${file}#id:${meta.sourceQuestionNo}`, meta);
    }
    return (Array.isArray(records) ? records : []).map(record => {
      const file = String(record.sourceFile || record._sourceFile || '').replace(/\\/g, '/');
      const meta = bySource.get(`${file}#${record.sourceOrdinal}`) || bySource.get(`${file}#id:${record.id || record.sourceQuestionNo}`);
      if (!meta) return record;
      const metadataSubUnitKey = String(meta.subUnitKey || meta.sub_unit_key || '').trim();
      const metadataParentKey = String(meta.standardUnitKey || meta.standard_unit_key || '').trim();
      const validSubUnit = Boolean(metadataSubUnitKey && metadataParentKey && core.isSubUnitInParentScope(metadataSubUnitKey, metadataParentKey));
      const mergedSubUnit = validSubUnit
        ? core.getSubUnitLabel({ subUnitKey: metadataSubUnitKey, subUnit: meta.subUnit || meta.sub_unit || '' })
        : core.getSubUnitLabel(record);
      // The existing core remains the authority for the legacy standard-unit
      // mapping. The approved sidecar only enriches the new selection fields.
      return {
        ...record,
        questionUid: core.getQuestionUid(meta) || core.getQuestionUid(record),
        subUnitParentKey: validSubUnit ? metadataParentKey : core.getSubUnitParentKey(record),
        subUnitKey: validSubUnit ? metadataSubUnitKey : core.getSubUnitKey(record),
        subUnit: mergedSubUnit,
        difficultyBucket: meta.difficultyBucket || record.difficultyBucket || '',
        metadataRevision: meta.metadataRevision || record.metadataRevision || '',
        metadataStatus: meta.metadataStatus || record.metadataStatus || ''
      };
    });
  }
  function loadQuestionFile(sourceFile) {
    if (state.fileCache.has(sourceFile)) return state.fileCache.get(sourceFile);
    const promise = (async () => {
      delete window.questions;
      delete window.questionBank;
      await loadScript(`exams/${sourceFile}?v=20260826a`);
      const data = window.questions || window.questionBank;
      if (!Array.isArray(data)) throw new Error(`${sourceFile}에서 문항 배열을 찾지 못했습니다.`);
      return data.map(question => ({ ...question }));
    })().catch(error => { state.fileCache.delete(sourceFile); throw error; });
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
          ...original, _sourceFile: sourceFile, _sourceQuestionNo: record.sourceQuestionNo,
          _qKey: `${sourceFile}_${record.sourceQuestionNo}`, questionUid: core.getQuestionUid(record),
          sourceOrdinal: record.sourceOrdinal, subUnitKey: record.subUnitKey || '', subUnit: core.getSubUnitLabel(record),
          subUnitParentKey: core.getSubUnitParentKey(record),
          difficultyBucket: core.getDifficultyBucket(record), level: record.level || '',
          metadataRevision: record.metadataRevision || '', standardUnitKey: record.mappedUnitKey,
          standardUnit: record.mappedUnit, standardCourse: record.mappedCourse,
          school: core.getSchool(record), schoolKey: core.getSchoolKey(record), examYear: core.getExamYear(record),
          semester: core.getSemester(record), examType: core.getExamType(record), sourceExamKey: core.getSourceExamKey(record)
        });
      }
    }
    return paper.records.map(record => restoredByIdentity.get(`${record.sourceFile}#${record.sourceQuestionNo}`));
  }
  function getQpp() { return document.getElementById('unit-qpp')?.value || '4'; }
  function getProfile() { return core.getProfile(state.profileId); }
  function getUnit(unitKey) { return state.catalog?.units.find(unit => unit.key === unitKey); }
  function getPaper(unitKey, paperIndex) {
    if (String(paperIndex).startsWith('generated')) {
      return state.generatedPapers.find(paper => paper.unitKey === unitKey && String(paper.index) === String(paperIndex))
        || state.generatedPapers.find(paper => paper.unitKey === unitKey && paper.generated)
        || state.generatedPapers.find(paper => paper.unitKey === unitKey);
    }
    return getUnit(unitKey)?.papers.find(paper => paper.index === Number(paperIndex));
  }
  function getSourceExamLabel(sourceFile, record = {}) {
    const filename = String(sourceFile || '').split('/').pop().replace(/\.js$/i, '');
    const parts = filename.split('_');
    const fallbackYear = parts[0] || '';
    const fallbackSchool = parts[1] || filename;
    const year = core.getExamYear(record) < 2200 ? String(core.getExamYear(record)) : fallbackYear;
    const school = core.getSchool(record) || fallbackSchool;
    const period = core.getPeriod(sourceFile);
    const semester = core.getSemester(record);
    const examType = core.getExamType(record);
    const periodLabel = semester && examType
      ? `${semester}학기 ${examType === 'mid' ? '중간' : '기말'}`
      : ({ '1mid': '1학기 중간', '1final': '1학기 기말', '2mid': '2학기 중간', '2final': '2학기 기말' }[period] || period);
    return [year, school, periodLabel].filter(Boolean).join(' · ');
  }
  function getPaperSources(paper) {
    const sources = new Map();
    paper.records.forEach(record => {
      const current = sources.get(record.sourceFile) || { sourceFile: record.sourceFile, record, count: 0 };
      current.count += 1;
      sources.set(record.sourceFile, current);
    });
    return [...sources.values()].map(source => ({ ...source, label: getSourceExamLabel(source.sourceFile, source.record) }));
  }
  function buildSelectionLabel(selection) {
    const parts = [];
    if (selection.mode === 'advanced') parts.push('고급 조합');
    else parts.push(QUICK_PRESETS[selection.preset]?.label || '빠른 출제');
    if (selection.subUnitKeys?.length) parts.push(`${selection.subUnitKeys.length}개 소단원`);
    if (selection.difficultyBuckets?.length) parts.push(selection.difficultyBuckets.join('·'));
    return parts.join(' · ') || '전체 단원 출제';
  }
  function storeMixedPayload(unit, paper, questions) {
    const profile = getProfile();
    const selection = paper.selection || {};
    const collection = selection.collection || null;
    const selectedSubUnits = [...new Map(paper.records.map(record => [record.subUnitKey || '__unclassified__', core.getSubUnitLabel(record) || '미분류 소단원'])).entries()].map(([key, label]) => ({ key, label }));
    const meta = {
      title: paper.title, customTitle: paper.title, identityTitle: paper.title, count: questions.length,
      generatedAt: new Date().toISOString(), category: '단원별 기출', grade: profile.grade, gradeLabel: profile.gradeLabel,
      scopeLabel: collection?.scopeLabel || '2학기 기말까지', unitKey: unit.key, unitName: unit.name, subject: collection?.course || unit.course, sourceType: 'mixed',
      subUnitKeys: selectedSubUnits.map(item => item.key), subUnits: selectedSubUnits,
      difficultyBuckets: [...new Set(paper.records.map(record => core.getDifficultyBucket(record)))],
      difficultyPlan: selection.difficultyPlan || [], selectionMode: selection.mode || 'legacy', selectionSeed: selection.seed || '',
      collection,
      school: paper.school || '', schoolKey: paper.schoolKey || '',
      questionUids: questions.map(question => core.getQuestionUid(question)).filter(Boolean),
      metadataRevision: [...new Set(paper.records.map(record => record.metadataRevision).filter(Boolean))].join(',') || '',
      printHeaderOptions: {
        title: paper.title, metaRight: `${profile.gradeLabel} ${unit.course} 단원별 기출`, subtitle: '', showNameLine: true,
        showScoreLine: true, applyToSolution: true, applyToAnswer: true
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
      login_id: session.login_id || session.loginId || '', id: session.id || session.user?.id || '',
      name: session.name || session.user?.name || '', role: session.role || session.user?.role || '',
      session_token: session.session_token || '', expires_at: session.expires_at || ''
    };
    if (!payload.session_token && !payload.login_id) return url;
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    return `${url}#apmsess=${encoded}`;
  }
  function buildMixedUrl(paper, options = {}) {
    const url = new URL('mixed_engine.html', window.location.href);
    url.searchParams.set('key', paper.snapshotKey); url.searchParams.set('qpp', getQpp());
    url.searchParams.set('mode', 'exam'); url.searchParams.set('q', String(paper.count));
    if (options.submitQr) url.searchParams.set('submitQr', '1');
    if (options.classId) url.searchParams.set('class', options.classId);
    if (options.teacherName) url.searchParams.set('teacher', options.teacherName);
    if (options.className) url.searchParams.set('className', options.className);
    return url.toString();
  }
  async function preparePaper(unitKey, paperIndex, button) {
    const unit = getUnit(unitKey); const paper = getPaper(unitKey, paperIndex);
    if (!unit || !paper) throw new Error('문제지를 찾지 못했습니다.');
    const busyKey = `${state.profileId}:${unitKey}:${paperIndex}`;
    if (state.busyKey) throw new Error('다른 문제지를 준비하고 있습니다.');
    state.busyKey = busyKey;
    const oldText = button?.textContent;
    if (button) { button.disabled = true; button.textContent = '준비 중…'; }
    setStatus(`${paper.title} 문항과 이미지 에셋을 불러오는 중입니다.`);
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
    try { const { paper } = await preparePaper(unitKey, paperIndex, button); window.open(appendSessionHash(buildMixedUrl(paper)), '_blank'); }
    catch (error) { console.error(error); setStatus(error.message || '문제지 준비에 실패했습니다.', true); alert(error.message || '문제지 준비에 실패했습니다.'); }
  }
  async function assignPaper(unitKey, paperIndex, button) {
    try {
      const { unit, paper } = await preparePaper(unitKey, paperIndex, button); const profile = getProfile();
      const pending = {
        unitPast: true, unitPastSnapshotKey: paper.snapshotKey, identityTitle: paper.title, title: paper.title,
        topic: paper.title, subject: unit.course, grade: profile.grade, qCount: paper.count, count: paper.count,
        source_type: 'mixed', selectionMode: paper.selection?.mode || 'legacy',
        subUnitKeys: paper.selection?.subUnitKeys || [], difficultyBuckets: paper.selection?.difficultyBuckets || [],
        difficultyPlan: paper.selection?.difficultyPlan || [],
        collection: paper.selection?.collection || null, school: paper.school || '', schoolKey: paper.schoolKey || '',
        questionUids: paper.records.map(record => core.getQuestionUid(record)).filter(Boolean)
      };
      localStorage.setItem(`APMATH_UNIT_PAST_ASSIGN_${paper.snapshotKey}`, JSON.stringify(pending));
      const url = new URL('index.html', window.location.href);
      url.searchParams.set('unitPastAssign', paper.snapshotKey); url.searchParams.set('qpp', getQpp());
      window.location.href = appendSessionHash(url.toString());
    } catch (error) { console.error(error); setStatus(error.message || '출제 준비에 실패했습니다.', true); alert(error.message || '출제 준비에 실패했습니다.'); }
  }
  function getDefaultFilterState(unit) {
    const params = new URLSearchParams(window.location.search);
    const requestedSubUnits = (params.get('subUnit') || '').split(',').filter(Boolean);
    const requestedLevels = (params.get('difficulty') || '').split(',').map(value => value.trim()).filter(Boolean).map(core.normalizeDifficulty);
    const subUnitOptions = core.getSubUnitOptions(unit.records);
    let advancedRows = [{ subUnitKey: '', difficultyBucket: '', count: 4 }];
    try {
      const parsedRows = JSON.parse(params.get('blueprint') || 'null');
      if (Array.isArray(parsedRows) && parsedRows.length) {
        advancedRows = parsedRows.map(row => ({
          subUnitKey: (() => { const key = String(row?.subUnitKey || '').trim(); return subUnitOptions.some(item => item.key === key) ? key : ''; })(),
          difficultyBucket: row?.difficultyBucket ? core.normalizeDifficulty(row.difficultyBucket) : '',
          count: Math.min(80, Math.max(1, Number(row?.count || 1)))
        }));
      }
    } catch (error) { /* malformed URL state falls back to one safe row */ }
    return {
      mode: params.get('mode') === 'advanced' ? 'advanced' : 'quick', preset: QUICK_PRESETS[params.get('preset')] ? params.get('preset') : 'exam',
      count: Math.min(80, Math.max(1, Number(params.get('count') || 12))),
      subUnitKeys: requestedSubUnits.filter(key => subUnitOptions.some(item => item.key === key)),
      difficultyBuckets: requestedLevels.filter(level => LEVELS.includes(level)),
      includeUnclassified: params.get('includeUnclassified') === '1' || requestedLevels.includes('미분류'),
      allowAdjacentDifficulty: params.get('adjacentDifficulty') === '1',
      seed: params.get('seed') || 'unitpast-v1', advancedRows
    };
  }
  function syncFilterUrl(historyMode = 'replace') {
    const filter = state.filterState; const url = new URL(window.location.href);
    if (!filter) return;
    url.searchParams.set('grade', state.profileId); url.searchParams.set('unit', state.selectedUnitKey);
    if (filter.mode === 'advanced') url.searchParams.set('mode', 'advanced'); else url.searchParams.delete('mode');
    if (filter.preset !== 'exam') url.searchParams.set('preset', filter.preset); else url.searchParams.delete('preset');
    if (filter.count !== 12) url.searchParams.set('count', String(filter.count)); else url.searchParams.delete('count');
    if (filter.subUnitKeys.length) url.searchParams.set('subUnit', filter.subUnitKeys.join(',')); else url.searchParams.delete('subUnit');
    if (filter.difficultyBuckets.length) url.searchParams.set('difficulty', filter.difficultyBuckets.join(',')); else url.searchParams.delete('difficulty');
    if (filter.includeUnclassified) url.searchParams.set('includeUnclassified', '1'); else url.searchParams.delete('includeUnclassified');
    if (filter.allowAdjacentDifficulty) url.searchParams.set('adjacentDifficulty', '1'); else url.searchParams.delete('adjacentDifficulty');
    if (filter.mode === 'advanced') url.searchParams.set('blueprint', JSON.stringify(filter.advancedRows)); else url.searchParams.delete('blueprint');
    const updateHistory = historyMode === 'push' ? history.pushState.bind(history) : history.replaceState.bind(history);
    updateHistory(null, '', url.toString());
  }
  function clearSelectionPreview() {
    state.generatedPapers = [];
    const report = document.getElementById('unit-selection-report');
    if (report) report.innerHTML = '';
    const collectionReport = document.getElementById('unit-collection-report');
    if (collectionReport) collectionReport.innerHTML = '';
  }

  function getCollectionRecords() {
    return state.catalog?.units.flatMap(unit => unit.records) || [];
  }

  function parseCollectionKeys(value) {
    return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
  }

  function getCollectionDefaultState(unit) {
    const params = new URLSearchParams(window.location.search);
    const profile = getProfile();
    const base = {
      unitKey: unit.key, scopeMode: ['current', 'range', 'cumulative', 'course'].includes(params.get('collectionScope')) ? params.get('collectionScope') : 'current',
      courseKey: unit.course, startUnitKey: params.get('collectionStart') || unit.key, endUnitKey: params.get('collectionEnd') || unit.key,
      yearMode: ['exact', 'recentAvailable', 'range'].includes(params.get('collectionYearMode')) ? params.get('collectionYearMode') : 'exact',
      year: Number(params.get('collectionYear') || 0), yearCount: Number(params.get('collectionYearCount') || 3),
      yearFrom: Number(params.get('collectionYearFrom') || 0), yearTo: Number(params.get('collectionYearTo') || 0),
      schoolKeys: parseCollectionKeys(params.get('collectionSchools')),
      outputMode: params.get('collectionOutput') === 'combined' ? 'combined' : 'school',
      countMode: params.get('collectionCountMode') === 'fixed' ? 'fixed' : 'all',
      count: Math.min(500, Math.max(1, Number(params.get('collectionCount') || 20))),
      subUnitKeys: parseCollectionKeys(params.get('collectionSubUnit')),
      difficultyBuckets: parseCollectionKeys(params.get('collectionDifficulty')).map(core.normalizeDifficulty),
      includeUnclassified: params.get('collectionIncludeUnclassified') === '1'
    };
    if (params.get('collectionYearMode') === 'recent3') { base.yearMode = 'recentAvailable'; base.yearCount = 3; }
    if (params.get('collectionYearMode') === 'recent5') { base.yearMode = 'recentAvailable'; base.yearCount = 5; }
    if (![3, 5].includes(base.yearCount)) base.yearCount = 3;
    const yearOptions = core.getCollectionYearOptions(getCollectionRecords(), profile, base);
    if (!yearOptions.includes(base.year)) base.year = yearOptions[0] || new Date().getFullYear();
    return base;
  }

  function getCollectionScopeLabel(unit, collection) {
    const profile = getProfile();
    const units = core.getCollectionScopeUnits(profile, collection);
    if (collection.scopeMode === 'course') return `${unit.course} 전체`;
    if (collection.scopeMode === 'cumulative') return `${unit.course} 1단원~${unit.name}`;
    if (collection.scopeMode === 'range' && units.length) {
      return units.length === 1 ? units[0].name : `${units[0].name}~${units[units.length - 1].name}`;
    }
    return unit.name;
  }

  function getCollectionYearLabel(collection) {
    if (collection.yearMode === 'recentAvailable') return `최근 ${collection.yearCount}개년(학교별 자료 기준)`;
    if (collection.yearMode === 'range') return `${collection.yearFrom || '?'}~${collection.yearTo || '?'}년`;
    return `${collection.year}년`;
  }

  function syncCollectionUrl(historyMode = 'replace') {
    const collection = state.collectionState;
    if (!collection) return;
    const url = new URL(window.location.href);
    url.searchParams.set('grade', state.profileId); url.searchParams.set('unit', state.selectedUnitKey); url.searchParams.set('collection', '1');
    if (collection.scopeMode !== 'current') url.searchParams.set('collectionScope', collection.scopeMode); else url.searchParams.delete('collectionScope');
    if (collection.scopeMode === 'range') {
      url.searchParams.set('collectionStart', collection.startUnitKey || state.selectedUnitKey);
      url.searchParams.set('collectionEnd', collection.endUnitKey || state.selectedUnitKey);
    } else { url.searchParams.delete('collectionStart'); url.searchParams.delete('collectionEnd'); }
    const yearModeParam = collection.yearMode === 'recentAvailable' ? `recent${collection.yearCount}` : collection.yearMode;
    if (collection.yearMode !== 'exact' || collection.year !== Number(new Date().getFullYear())) url.searchParams.set('collectionYearMode', yearModeParam); else url.searchParams.delete('collectionYearMode');
    if (collection.yearMode === 'exact') url.searchParams.set('collectionYear', String(collection.year)); else url.searchParams.delete('collectionYear');
    if (collection.yearMode === 'recentAvailable') url.searchParams.set('collectionYearCount', String(collection.yearCount)); else url.searchParams.delete('collectionYearCount');
    if (collection.yearMode === 'range') { url.searchParams.set('collectionYearFrom', String(collection.yearFrom || '')); url.searchParams.set('collectionYearTo', String(collection.yearTo || '')); }
    else { url.searchParams.delete('collectionYearFrom'); url.searchParams.delete('collectionYearTo'); }
    if (collection.schoolKeys.length) url.searchParams.set('collectionSchools', collection.schoolKeys.join(',')); else url.searchParams.delete('collectionSchools');
    if (collection.outputMode === 'combined') url.searchParams.set('collectionOutput', 'combined'); else url.searchParams.delete('collectionOutput');
    if (collection.countMode === 'fixed') { url.searchParams.set('collectionCountMode', 'fixed'); url.searchParams.set('collectionCount', String(collection.count)); }
    else { url.searchParams.delete('collectionCountMode'); url.searchParams.delete('collectionCount'); }
    if (collection.subUnitKeys.length) url.searchParams.set('collectionSubUnit', collection.subUnitKeys.join(',')); else url.searchParams.delete('collectionSubUnit');
    if (collection.difficultyBuckets.length) url.searchParams.set('collectionDifficulty', collection.difficultyBuckets.join(',')); else url.searchParams.delete('collectionDifficulty');
    if (collection.includeUnclassified) url.searchParams.set('collectionIncludeUnclassified', '1'); else url.searchParams.delete('collectionIncludeUnclassified');
    const updateHistory = historyMode === 'push' ? history.pushState.bind(history) : history.replaceState.bind(history);
    updateHistory(null, '', url.toString());
  }

  function readCollectionFilterFromDom() {
    const collection = state.collectionState;
    if (!collection) return;
    const scope = document.getElementById('unit-collection-scope');
    if (scope) collection.scopeMode = scope.value || 'current';
    const start = document.getElementById('unit-collection-start');
    const end = document.getElementById('unit-collection-end');
    if (start) collection.startUnitKey = start.value || collection.unitKey;
    if (end) collection.endUnitKey = end.value || collection.unitKey;
    const yearMode = document.getElementById('unit-collection-year-mode');
    if (yearMode) {
      collection.yearMode = yearMode.value === 'recent3' || yearMode.value === 'recent5' ? 'recentAvailable' : yearMode.value || 'exact';
      if (yearMode.value === 'recent3') collection.yearCount = 3;
      if (yearMode.value === 'recent5') collection.yearCount = 5;
    }
    const exactYear = document.getElementById('unit-collection-year');
    if (exactYear) collection.year = Number(exactYear.value || collection.year || 0);
    const recentCount = document.getElementById('unit-collection-year-count');
    if (recentCount) collection.yearCount = Number(recentCount.value || 3);
    const yearFrom = document.getElementById('unit-collection-year-from');
    const yearTo = document.getElementById('unit-collection-year-to');
    if (yearFrom) collection.yearFrom = Number(yearFrom.value || 0);
    if (yearTo) collection.yearTo = Number(yearTo.value || 0);
    collection.schoolKeys = selectedValues('unit-collection-schools');
    collection.outputMode = document.querySelector('input[name="unit-collection-output"]:checked')?.value || collection.outputMode || 'school';
    collection.countMode = document.querySelector('input[name="unit-collection-count-mode"]:checked')?.value || collection.countMode || 'all';
    const count = document.getElementById('unit-collection-count');
    if (count) collection.count = Math.min(500, Math.max(1, Number(count.value || 20)));
    collection.subUnitKeys = selectedValues('unit-collection-subunits');
    collection.difficultyBuckets = [...document.querySelectorAll('input[name="unit-collection-difficulty"]:checked')].map(input => input.value);
    collection.includeUnclassified = Boolean(document.getElementById('unit-collection-include-unclassified')?.checked);
  }

  function updateCollectionFilter() {
    readCollectionFilterFromDom();
    clearSelectionPreview();
    syncCollectionUrl('push');
    renderCollectionPanel(getUnit(state.selectedUnitKey));
  }

  function renderCollectionPanel(unit) {
    const root = document.getElementById('unit-collection-panel');
    if (!root || !unit || !state.catalog) return;
    if (!state.collectionState || state.collectionState.unitKey !== unit.key) state.collectionState = getCollectionDefaultState(unit);
    const collection = state.collectionState;
    const profile = getProfile();
    const allRecords = getCollectionRecords();
    const scopeRecords = core.getCollectionScopeRecords(allRecords, profile, collection);
    const schoolOptions = core.getCollectionSchoolOptions(allRecords, profile, { ...collection, schoolKeys: [] });
    const yearOptions = core.getCollectionYearOptions(allRecords, profile, { ...collection, schoolKeys: [] });
    const subUnitOptions = core.getSubUnitOptions(scopeRecords);
    const validSchools = new Set(schoolOptions.map(item => item.key));
    const validSubUnits = new Set(subUnitOptions.map(item => item.key));
    collection.schoolKeys = collection.schoolKeys.filter(key => validSchools.has(key));
    collection.subUnitKeys = collection.subUnitKeys.filter(key => validSubUnits.has(key));
    const scopeUnits = profile.units.filter(item => item.course === unit.course);
    const selectedDifficulty = new Set(collection.difficultyBuckets);
    const yearMode = collection.yearMode === 'recentAvailable' ? `recent${collection.yearCount}` : collection.yearMode;
    const exactYearOptions = [...new Set([collection.year, ...yearOptions].filter(Boolean))].sort((a, b) => b - a);
    const yearSelection = core.resolveCollectionYearsBySchool(scopeRecords, collection);
    const yearSummary = yearSelection.selectedYears.length ? yearSelection.selectedYears.join(', ') : '선택 연도 자료 없음';
    const scopeOptions = [
      ['current', `현재 단원 · ${unit.name}`],
      ['cumulative', `누적 범위 · ${unit.course} 1단원부터`],
      ['range', '단원 범위 지정'],
      ['course', `${unit.course} 전체`]
    ].map(([value, label]) => `<option value="${value}"${collection.scopeMode === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');
    const unitSelectOptions = scopeUnits.map(item => `<option value="${item.key}"${collection.startUnitKey === item.key ? ' selected' : ''}>${String(item.order).padStart(2, '0')} · ${escapeHtml(item.name)}</option>`).join('');
    const unitEndOptions = scopeUnits.map(item => `<option value="${item.key}"${collection.endUnitKey === item.key ? ' selected' : ''}>${String(item.order).padStart(2, '0')} · ${escapeHtml(item.name)}</option>`).join('');
    const schoolSelectOptions = schoolOptions.map(item => `<option value="${escapeHtml(item.key)}"${collection.schoolKeys.includes(item.key) ? ' selected' : ''}>${escapeHtml(item.label)} · ${item.years.join('/') || '연도 미상'} (${item.count})</option>`).join('');
    const subUnitSelectOptions = subUnitOptions.map(item => `<option value="${escapeHtml(item.key)}"${collection.subUnitKeys.includes(item.key) ? ' selected' : ''}>${escapeHtml(item.label)} (${item.count})</option>`).join('');
    root.innerHTML = `<section class="unit-collection"><div class="unit-collection-head"><div><div class="unit-eyebrow">학교·연도 묶음 출제</div><h3>기출 모아뽑기</h3><p>“2025 기출”처럼 특정 연도를 지정하거나, 학교별로 자료가 실제 존재하는 최근 3·5개년을 모읍니다.</p></div><div class="unit-collection-summary" id="unit-collection-summary">${escapeHtml(getCollectionScopeLabel(unit, collection))} · ${escapeHtml(yearSummary)} · 범위 ${scopeRecords.length.toLocaleString()}문항</div></div><div class="unit-collection-grid"><fieldset class="unit-filter-field"><legend>단원 범위</legend><select id="unit-collection-scope" onchange="UnitPastExams.updateCollectionFilter()">${scopeOptions}</select><div class="unit-collection-range${collection.scopeMode === 'range' ? '' : ' is-hidden'}"><label>시작 단원<select id="unit-collection-start" onchange="UnitPastExams.updateCollectionFilter()">${unitSelectOptions}</select></label><label>끝 단원<select id="unit-collection-end" onchange="UnitPastExams.updateCollectionFilter()">${unitEndOptions}</select></label></div><small>현재 단원·누적·단원 범위·과목 전체를 지원합니다.</small></fieldset><fieldset class="unit-filter-field"><legend>연도</legend><select id="unit-collection-year-mode" onchange="UnitPastExams.updateCollectionFilter()"><option value="exact"${yearMode === 'exact' ? ' selected' : ''}>특정 연도</option><option value="recent3"${yearMode === 'recent3' ? ' selected' : ''}>최근 3개년 · 학교별 자료 기준</option><option value="recent5"${yearMode === 'recent5' ? ' selected' : ''}>최근 5개년 · 학교별 자료 기준</option><option value="range"${yearMode === 'range' ? ' selected' : ''}>연도 범위</option></select><select id="unit-collection-year" class="${yearMode === 'exact' ? '' : 'is-hidden'}" onchange="UnitPastExams.updateCollectionFilter()">${exactYearOptions.map(year => `<option value="${year}"${collection.year === year ? ' selected' : ''}>${year}년</option>`).join('')}</select><select id="unit-collection-year-count" class="${yearMode === 'recent3' || yearMode === 'recent5' ? '' : 'is-hidden'}" onchange="UnitPastExams.updateCollectionFilter()"><option value="3"${collection.yearCount === 3 ? ' selected' : ''}>최근 3개년</option><option value="5"${collection.yearCount === 5 ? ' selected' : ''}>최근 5개년</option></select><div class="unit-collection-year-range${yearMode === 'range' ? '' : ' is-hidden'}"><label>시작 연도<input id="unit-collection-year-from" type="number" min="2000" max="2200" value="${collection.yearFrom || ''}" onchange="UnitPastExams.updateCollectionFilter()"></label><label>끝 연도<input id="unit-collection-year-to" type="number" min="2000" max="2200" value="${collection.yearTo || ''}" onchange="UnitPastExams.updateCollectionFilter()"></label></div><small>최근 3·5개년은 빈 연도를 억지로 만들지 않고 학교별 보유 연도만 사용합니다.</small></fieldset><fieldset class="unit-filter-field unit-collection-school-field"><legend>학교 선택</legend><select id="unit-collection-schools" multiple size="6" aria-label="학교 다중 선택" onchange="UnitPastExams.updateCollectionFilter()">${schoolSelectOptions}</select><small>선택하지 않으면 자료가 있는 모든 학교 · 여러 학교를 함께 선택할 수 있습니다.</small></fieldset><fieldset class="unit-filter-field"><legend>소단원·난이도 선택</legend><select id="unit-collection-subunits" multiple size="4" aria-label="모아뽑기 소단원 다중 선택" onchange="UnitPastExams.updateCollectionFilter()">${subUnitSelectOptions}</select><div class="unit-choice-list">${LEVELS.map(level => `<label class="unit-choice"><input type="checkbox" name="unit-collection-difficulty" value="${level}"${selectedDifficulty.has(level) ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>${level}</span></label>`).join('')}</div><label class="unit-relax-choice"><input id="unit-collection-include-unclassified" type="checkbox"${collection.includeUnclassified ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>미분류 포함</span></label><small>선택하지 않으면 해당 범위의 모든 소단원·난이도를 사용합니다.</small></fieldset></div><fieldset class="unit-mode-field"><legend>출력 방식</legend><div class="unit-mode-toggle"><label><input type="radio" name="unit-collection-output" value="school"${collection.outputMode === 'school' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>학교별 문제지</span></label><label><input type="radio" name="unit-collection-output" value="combined"${collection.outputMode === 'combined' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>학교 통합 문제지</span></label></div></fieldset><fieldset class="unit-mode-field"><legend>문항 수</legend><div class="unit-mode-toggle"><label><input type="radio" name="unit-collection-count-mode" value="all"${collection.countMode === 'all' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>조건에 맞는 전체</span></label><label><input type="radio" name="unit-collection-count-mode" value="fixed"${collection.countMode === 'fixed' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>문항 수 제한</span></label></div><label class="unit-collection-count-input">제한 수<input id="unit-collection-count" type="number" min="1" max="500" value="${collection.count}" onchange="UnitPastExams.updateCollectionFilter()"></label><small>문항 수 제한은 학교별 출력에서는 학교마다, 통합 출력에서는 전체에 적용됩니다.</small></fieldset><div class="unit-filter-actions"><button type="button" class="unit-btn primary" onclick="UnitPastExams.generateCollectionPapers()">모아뽑기 미리보기</button><button type="button" class="unit-btn" onclick="UnitPastExams.resetCollectionFilter()">모아뽑기 초기화</button></div><div id="unit-collection-report" class="unit-selection-report" aria-live="polite"></div></section>`;
  }

  function buildCollectionSelection(unit) {
    const collection = state.collectionState;
    const result = core.buildCollectionPapers(getCollectionRecords(), getProfile(), {
      ...collection, profileId: state.profileId, unitKey: unit.key,
      target: state.catalog.scope.targetQuestionsPerPaper, max: state.catalog.scope.hardMaxQuestionsPerPaper
    });
    const selection = {
      mode: 'collection', preset: '', subUnitKeys: [...collection.subUnitKeys], difficultyBuckets: [...collection.difficultyBuckets],
      difficultyPlan: [], seed: '', collection: {
        scopeMode: collection.scopeMode, scopeUnitKeys: result.scopeUnits.map(item => item.key), scopeLabel: getCollectionScopeLabel(unit, collection),
        course: unit.course, yearMode: collection.yearMode, year: collection.year, yearCount: collection.yearCount,
        yearFrom: collection.yearFrom, yearTo: collection.yearTo, selectedYearsBySchool: result.yearSelection.bySchool,
        schoolKeys: [...collection.schoolKeys], outputMode: collection.outputMode, countMode: collection.countMode, count: collection.count
      }
    };
    return { result, selection };
  }

  function buildCollectionPaperTitle(unit, paper, selection) {
    const collection = selection.collection || {};
    const school = paper.schoolKey ? paper.school : '학교 통합';
    const base = `${getCollectionYearLabel(collection)} · ${school} · ${collection.scopeLabel || unit.name}`;
    return base;
  }

  function renderCollectionReport(unit, plan, isReady) {
    const root = document.getElementById('unit-collection-report'); if (!root) return;
    const result = plan.result;
    const schoolRows = result.schools.map(school => `<div class="unit-plan-row ${school.candidateCount ? '' : 'is-short'}"><span>${escapeHtml(school.label)} · ${school.years.length ? escapeHtml(school.years.join(', ')) : '자료 없음'}</span><strong>${school.selectedCount}/${school.candidateCount}</strong></div>`).join('');
    const papers = isReady ? state.generatedPapers.filter(paper => paper.unitKey === unit.key && paper.generated) : [];
    const paperActions = papers.map(paper => `<article class="unit-generated-paper"><div><strong>${escapeHtml(paper.title)}</strong><span>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</span></div><div class="unit-paper-actions"><button class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)">일반 출력</button><button class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)">반 학생에게 출제</button></div></article>`).join('');
    const issue = !result.candidateCount ? '<div class="unit-empty-result">조건에 맞는 자료가 없습니다. 학교·연도·단원 범위를 조정해 주세요.</div>' : (!isReady ? `<div class="unit-limit-message">요청한 문항 수보다 ${result.shortage}개 부족합니다. 학교별 자료 현황을 확인해 주세요.</div>` : '');
    root.innerHTML = `<div class="unit-selection-head"><div><h3>${isReady ? '모아뽑기 미리보기' : '자료 현황 확인 필요'}</h3><p>${result.candidateCount.toLocaleString()}개 후보 · ${result.selectedCount.toLocaleString()}개 선택 · ${result.papers.length}개 문제지 · ${escapeHtml(getCollectionYearLabel(plan.selection.collection))}</p></div></div>${issue}<div class="unit-plan-list">${schoolRows || '<div class="unit-empty-result">학교 자료가 없습니다.</div>'}</div>${isReady && papers.length ? `<div class="unit-generated-list">${paperActions}</div><div class="unit-generated-meta">${result.selectedCount}문항 · ${papers.length}개 문제지</div>` : ''}`;
  }

  function generateCollectionPapers() {
    readCollectionFilterFromDom();
    syncCollectionUrl();
    const unit = getUnit(state.selectedUnitKey); if (!unit || !state.collectionState) return;
    const plan = buildCollectionSelection(unit); const result = plan.result;
    if (!result.candidateCount || !result.ok) {
      state.generatedPapers = [];
      renderCollectionReport(unit, plan, false);
      setStatus(!result.candidateCount ? '조건에 맞는 기출 자료가 없습니다.' : `조건에 맞는 문항이 ${result.shortage}개 부족합니다.`, true);
      return;
    }
    state.generatedPapers = result.papers.map((paper, index) => {
      const selection = { ...plan.selection, paperKey: `${paper.schoolKey || 'combined'}-${index + 1}` };
      const records = paper.records;
      return {
        index: `generated-collection-${index + 1}`, generated: true, unitKey: unit.key, schoolKey: paper.schoolKey, school: paper.school,
        title: `${buildCollectionPaperTitle(unit, paper, selection)}${result.papers.length > 1 ? ` · 문제지 ${index + 1}` : ''}`,
        count: records.length, sourceCount: new Set(records.map(record => record.sourceFile)).size,
        records, selection, snapshotKey: core.buildSnapshotKey(`collection-${paper.schoolKey || 'combined'}`, records, state.catalog.scope, selection)
      };
    });
    const firstPaper = state.generatedPapers[0];
    renderCollectionReport(unit, plan, true); setStatus(`${firstPaper.title} · ${firstPaper.count}문항을 출제할 수 있습니다.`);
  }

  function resetCollectionFilter() {
    const unit = getUnit(state.selectedUnitKey); if (!unit) return;
    state.collectionState = getCollectionDefaultState(unit);
    clearSelectionPreview(); syncCollectionUrl(); renderCollectionPanel(unit); setStatus('모아뽑기 조건을 초기화했습니다.');
  }

  function selectedValues(id) { return [...(document.getElementById(id)?.selectedOptions || [])].map(option => option.value).filter(Boolean); }
  function readAdvancedRowsFromDom() {
    if (!state.filterState || state.filterState.mode !== 'advanced') return;
    const domRows = [...document.querySelectorAll('.unit-blueprint-row')];
    if (!domRows.length) return;
    state.filterState.advancedRows = domRows.map(row => {
      const selects = row.querySelectorAll('select');
      return {
        subUnitKey: selects[0]?.value || '',
        difficultyBucket: selects[1]?.value || '',
        count: Number(row.querySelector('input[type="number"]')?.value || 0)
      };
    });
  }
  function readDetailFilterFromDom() {
    if (!state.filterState) return;
    const subUnitSelect = document.getElementById('unit-subunits');
    if (subUnitSelect) state.filterState.subUnitKeys = selectedValues('unit-subunits');
    state.filterState.difficultyBuckets = [...document.querySelectorAll('input[name="unit-difficulty"]:checked')].map(input => input.value);
    state.filterState.mode = document.querySelector('input[name="unit-mode"]:checked')?.value || state.filterState.mode || 'quick';
    const preset = document.getElementById('unit-quick-preset');
    const count = document.getElementById('unit-quick-count');
    if (preset) state.filterState.preset = preset.value || 'exam';
    if (count) state.filterState.count = Math.min(80, Math.max(1, Number(count.value || 12)));
    const includeUnclassified = document.getElementById('unit-include-unclassified');
    const allowAdjacent = document.getElementById('unit-allow-adjacent');
    state.filterState.includeUnclassified = Boolean(includeUnclassified?.checked) || state.filterState.difficultyBuckets.includes('미분류');
    state.filterState.allowAdjacentDifficulty = Boolean(allowAdjacent?.checked);
    readAdvancedRowsFromDom();
  }
  function updateDetailFilter() {
    readDetailFilterFromDom();
    clearSelectionPreview();
    syncFilterUrl('push'); renderFilterSummary(getUnit(state.selectedUnitKey));
    document.querySelector('.unit-advanced-fields')?.classList.toggle('is-hidden', state.filterState.mode !== 'advanced');
    document.querySelector('.unit-quick-fields')?.classList.toggle('is-hidden', state.filterState.mode !== 'quick');
  }
  function renderFilterSummary(unit) {
    const el = document.getElementById('unit-filter-summary'); if (!el || !unit || !state.filterState) return;
    const filtered = core.filterUnitRecords(unit.records, state.filterState); const levels = core.getDifficultySummary(filtered);
    const levelText = LEVELS.filter(level => levels[level]).map(level => `${level} ${levels[level]}`).join(' · ') || '선택 문항 없음';
    el.textContent = `현재 조건에서 ${filtered.length.toLocaleString()}문항 · ${levelText}`;
  }
  function allocateWeightedCount(total, buckets, weights) {
    if (!buckets.length) return [];
    const raw = buckets.map((bucket, index) => ({ bucket, value: total * (weights[index] || 0) }));
    const counts = raw.map(item => Math.floor(item.value)); let remainder = total - counts.reduce((sum, value) => sum + value, 0);
    raw.map((item, index) => ({ index, remainder: item.value - counts[index] })).sort((a, b) => b.remainder - a.remainder).forEach(item => { if (remainder > 0) { counts[item.index] += 1; remainder -= 1; } });
    return buckets.map((bucket, index) => ({ difficultyBucket: bucket, count: counts[index] })).filter(row => row.count > 0);
  }
  function buildQuickRows(unit) {
    const filter = state.filterState; const preset = QUICK_PRESETS[filter.preset] || QUICK_PRESETS.exam;
    const scoped = core.filterUnitRecords(unit.records, { subUnitKeys: filter.subUnitKeys, includeUnclassified: filter.includeUnclassified }); const available = core.getDifficultySummary(scoped);
    const allowed = filter.difficultyBuckets.length ? filter.difficultyBuckets : LEVELS.slice(0, 3);
    const buckets = preset.buckets.filter(bucket => allowed.includes(bucket) && available[bucket] > 0);
    const usableBuckets = buckets.length ? buckets : allowed.filter(bucket => available[bucket] > 0);
    if (usableBuckets.length === 1) return [{ difficultyBucket: usableBuckets[0], count: filter.count }];
    const weights = usableBuckets.map(bucket => { const index = preset.buckets.indexOf(bucket); return index >= 0 ? preset.weights[index] : 1; });
    const totalWeight = weights.reduce((sum, value) => sum + value, 0) || 1;
    return allocateWeightedCount(filter.count, usableBuckets, weights.map(value => value / totalWeight));
  }
  function getAdvancedRows() {
    return (state.filterState?.advancedRows || []).map(row => ({ subUnitKey: row.subUnitKey || '', difficultyBucket: row.difficultyBucket || '', count: Math.min(80, Math.max(0, Number(row.count || 0))) })).filter(row => row.count > 0);
  }
  function buildSelection(unit) {
    const filter = state.filterState; const globalFilters = { subUnitKeys: filter.subUnitKeys, difficultyBuckets: filter.difficultyBuckets, seed: filter.seed };
    globalFilters.includeUnclassified = filter.includeUnclassified;
    globalFilters.allowAdjacentDifficulty = filter.allowAdjacentDifficulty;
    globalFilters.maxCount = 80;
    const rows = filter.mode === 'advanced' ? getAdvancedRows() : buildQuickRows(unit);
    const result = core.selectByBlueprint(unit.records, rows, globalFilters);
    const selection = {
      mode: filter.mode, preset: filter.mode === 'quick' ? filter.preset : '', subUnitKeys: [...filter.subUnitKeys],
      difficultyBuckets: [...filter.difficultyBuckets], difficultyPlan: rows.map(row => ({ subUnitKey: row.subUnitKey || '', difficultyBucket: row.difficultyBucket || '', count: row.count })), seed: filter.seed
    };
    return { result, rows, selection };
  }
  function getSubUnitDisplay(unit, key) {
    if (!key) return '';
    return core.getSubUnitOptions(unit.records).find(item => item.key === key)?.label || key;
  }
  function reduceRequestedCount() {
    const filter = state.filterState;
    if (!filter) return;
    if (filter.mode === 'quick') filter.count = Math.max(1, filter.count - 1);
    else if (filter.advancedRows.length) {
      const last = filter.advancedRows[filter.advancedRows.length - 1];
      last.count = Math.max(1, Number(last.count || 1) - 1);
    }
    clearSelectionPreview(); syncFilterUrl(); renderDetail(state.selectedUnitKey, { noScroll: true, restore: true });
    setStatus('요청 문항 수를 1개 줄였습니다.');
  }
  function enableAdjacentDifficulty() {
    if (!state.filterState) return;
    state.filterState.allowAdjacentDifficulty = true;
    const input = document.getElementById('unit-allow-adjacent'); if (input) input.checked = true;
    clearSelectionPreview(); syncFilterUrl(); generatePaper();
  }
  function enableUnclassified() {
    if (!state.filterState) return;
    state.filterState.includeUnclassified = true;
    const input = document.getElementById('unit-include-unclassified'); if (input) input.checked = true;
    clearSelectionPreview(); syncFilterUrl(); generatePaper();
  }
  function focusSubUnitFilter() {
    const input = document.getElementById('unit-subunits');
    if (!input) return;
    input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function generatePaper() {
    readDetailFilterFromDom();
    syncFilterUrl();
    const unit = getUnit(state.selectedUnitKey); if (!unit || !state.filterState) return;
    const plan = buildSelection(unit); const result = plan.result; const report = document.getElementById('unit-selection-report');
    if (!result.requestedCount) { if (report) report.innerHTML = '<div class="unit-empty-result">출제할 문항 수를 입력하거나 고급 조합 행을 추가해 주세요.</div>'; setStatus('출제 조건을 확인해 주세요.', true); return; }
    if (!result.ok) { state.generatedPapers = []; renderSelectionReport(unit, plan, false); setStatus(result.limitExceeded ? `한 문제지는 최대 ${result.limit}문항까지 만들 수 있습니다.` : `조건에 맞는 문항이 ${result.shortage}개 부족합니다. 아래 완화 방법을 선택해 주세요.`, true); return; }
    const paperTitle = `${unit.name} · ${buildSelectionLabel(plan.selection)}`;
    const paperRecords = core.splitIntoPapers(result.selected, {
      target: state.catalog.scope.targetQuestionsPerPaper,
      max: state.catalog.scope.hardMaxQuestionsPerPaper
    });
    state.generatedPapers = paperRecords.map((records, index) => ({
      index: `generated-${index + 1}`, unitKey: unit.key,
      title: paperRecords.length === 1 ? paperTitle : `${paperTitle} · 문제지 ${index + 1}`,
      count: records.length, sourceCount: new Set(records.map(record => record.sourceFile)).size,
      records, selection: plan.selection,
      snapshotKey: core.buildSnapshotKey(unit.key, records, state.catalog.scope, plan.selection)
    }));
    const firstPaper = state.generatedPapers[0];
    renderSelectionReport(unit, plan, true); setStatus(`${firstPaper.title} · ${firstPaper.count}문항을 출제할 수 있습니다.`);
  }
  function renderSelectionReport(unit, plan, isReady) {
    const root = document.getElementById('unit-selection-report'); if (!root) return;
    const result = plan.result;
    const rows = result.rows.map(row => `<div class="unit-plan-row ${row.ok ? '' : 'is-short'}"><span>${escapeHtml(row.difficultyBucket || '전체 난이도')} ${row.subUnitKey ? `· ${escapeHtml(getSubUnitDisplay(unit, row.subUnitKey))}` : ''}</span><strong>${row.selectedCount}/${row.requestedCount}</strong></div>`).join('');
    const papers = isReady ? state.generatedPapers.filter(paper => paper.unitKey === unit.key) : [];
    const paperActions = papers.map(paper => `<article class="unit-generated-paper"><div><strong>${escapeHtml(paper.title)}</strong><span>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</span></div><div class="unit-paper-actions"><button class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)">일반 출력</button><button class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)">반 학생에게 출제</button></div></article>`).join('');
    const shortageActions = !isReady ? `<div class="unit-relax-actions"><span>완화 방법</span><button type="button" class="unit-btn" onclick="UnitPastExams.reduceRequestedCount()">문항 수 낮추기</button>${result.limitExceeded ? '' : '<button type="button" class="unit-btn" onclick="UnitPastExams.enableAdjacentDifficulty()">인접 난이도 허용</button><button type="button" class="unit-btn" onclick="UnitPastExams.enableUnclassified()">미분류 포함</button><button type="button" class="unit-btn" onclick="UnitPastExams.focusSubUnitFilter()">소단원 추가</button>'}</div>` : '';
    const limitMessage = result.limitExceeded ? `<div class="unit-limit-message">한 문제지는 최대 ${result.limit}문항입니다. 조합 행의 합계를 ${result.limit}문항 이하로 낮춰 주세요.</div>` : '';
    const relaxedText = result.rows.reduce((sum, row) => sum + (row.relaxedCount || 0), 0);
    const generatedCount = papers.reduce((sum, paper) => sum + paper.count, 0);
    root.innerHTML = `<div class="unit-selection-head"><div><h3>${isReady ? '출제 미리보기' : '조건 확인 필요'}</h3><p>${result.selectedCount}개 선택 · ${result.shortage ? `부족 ${result.shortage}개` : relaxedText ? `인접 난이도 ${relaxedText}개 허용` : '중복 없이 구성됨'}</p></div></div>${limitMessage}<div class="unit-plan-list">${rows || '<div class="unit-empty-result">선택 조건을 입력해 주세요.</div>'}</div>${isReady && papers.length ? `<div class="unit-generated-list">${paperActions}</div><div class="unit-generated-meta">${generatedCount}문항 · ${papers.length}개 문제지</div>` : ''}${shortageActions}`;
  }
  function renderAdvancedRows(unit) {
    const target = document.getElementById('unit-advanced-rows'); if (!target || !unit || !state.filterState) return;
    const options = core.getSubUnitOptions(unit.records); const subUnitOptions = `<option value="">전체 소단원</option>${options.map(item => `<option value="${escapeHtml(item.key)}">${escapeHtml(item.label)} (${item.count})</option>`).join('')}`;
    target.innerHTML = state.filterState.advancedRows.map((row, index) => `<div class="unit-blueprint-row"><label>소단원<select onchange="UnitPastExams.updateBlueprintRow(${index}, 'subUnitKey', this.value)">${subUnitOptions.replace(`value="${escapeHtml(row.subUnitKey)}"`, `value="${escapeHtml(row.subUnitKey)}" selected`)}</select></label><label>난이도<select onchange="UnitPastExams.updateBlueprintRow(${index}, 'difficultyBucket', this.value)"><option value=""${!row.difficultyBucket ? ' selected' : ''}>전체</option>${LEVELS.map(level => `<option value="${level}"${row.difficultyBucket === level ? ' selected' : ''}>${level}</option>`).join('')}</select></label><label>문항 수<input type="number" min="1" max="80" value="${Number(row.count || 1)}" onchange="UnitPastExams.updateBlueprintRow(${index}, 'count', this.value)"></label><button type="button" class="unit-icon-btn" aria-label="조합 행 삭제" onclick="UnitPastExams.removeBlueprintRow(${index})">×</button></div>`).join('');
  }
  function addBlueprintRow() {
    if (!state.filterState) return;
    state.filterState.advancedRows.push({ subUnitKey: '', difficultyBucket: '', count: 4 });
    clearSelectionPreview(); syncFilterUrl('push'); renderAdvancedRows(getUnit(state.selectedUnitKey));
  }
  function removeBlueprintRow(index) {
    if (!state.filterState || state.filterState.advancedRows.length <= 1) return;
    state.filterState.advancedRows.splice(index, 1);
    clearSelectionPreview(); syncFilterUrl('push'); renderAdvancedRows(getUnit(state.selectedUnitKey));
  }
  function updateBlueprintRow(index, field, value) {
    const row = state.filterState?.advancedRows[index];
    if (!row) return;
    row[field] = field === 'count' ? Math.min(80, Math.max(1, Number(value || 1))) : value;
    clearSelectionPreview(); syncFilterUrl('push');
  }
  function renderExistingPaper(paper, unit) {
    return `<article class="unit-paper"><div class="unit-paper-main"><div class="unit-paper-title">${escapeHtml(paper.title)}</div><div class="unit-paper-meta">${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</div></div><div class="unit-paper-actions"><button class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', ${paper.index}, this)">일반 출력</button><button class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', ${paper.index}, this)">반 학생에게 출제</button></div><details class="unit-paper-sources"><summary>포함 시험지 보기 <span>${paper.sourceCount}개</span></summary><div class="unit-source-list">${getPaperSources(paper).map(source => `<div class="unit-source-row"><span>${escapeHtml(source.label)}</span><strong>${source.count}문항</strong></div>`).join('')}</div></details></article>`;
  }
  function renderDetail(unitKey, options = {}) {
    state.selectedUnitKey = unitKey; const unit = getUnit(unitKey); const root = document.getElementById('unit-detail-root');
    document.querySelectorAll('.unit-card').forEach(card => {
      const isActive = card.dataset.unitKey === unitKey;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (!unit || !unit.count) { state.collectionState = null; root.innerHTML = ''; return; }
    if (options.restore || !state.filterState || state.filterState.unitKey !== unitKey) { state.filterState = { ...getDefaultFilterState(unit), unitKey }; state.collectionState = null; clearSelectionPreview(); }
    const filter = state.filterState; const subUnitOptions = core.getSubUnitOptions(unit.records); const selectedDifficulty = new Set(filter.difficultyBuckets);
    root.innerHTML = `<section class="unit-detail" aria-labelledby="unit-detail-title"><div class="unit-detail-head"><div><div class="unit-eyebrow">교사 출제 도구</div><h2 id="unit-detail-title">${escapeHtml(unit.name)}</h2><p>${escapeHtml(unit.course)} · 총 ${unit.count.toLocaleString()}문항 · 기존 문제지 ${unit.papers.length}개</p></div><span class="unit-filter-badge">소단원 ${subUnitOptions.length}개</span></div><div class="unit-filter-panel"><div class="unit-filter-panel-head"><div><h3>필터로 문제지 구성</h3><p>먼저 소단원과 난이도를 고르고, 빠른 출제 또는 세부 조합을 선택하세요.</p></div><div class="unit-filter-summary" id="unit-filter-summary" aria-live="polite"></div></div><div class="unit-filter-grid"><fieldset class="unit-filter-field unit-subunit-field"><legend>소단원 선택</legend><select id="unit-subunits" multiple size="6" aria-label="소단원 다중 선택" onchange="UnitPastExams.updateDetailFilter()">${subUnitOptions.map(item => `<option value="${escapeHtml(item.key)}"${filter.subUnitKeys.includes(item.key) ? ' selected' : ''}>${escapeHtml(item.label)} (${item.count})</option>`).join('')}</select><small>여러 개는 Ctrl/⌘을 누른 채 선택 · 선택하지 않으면 전체</small></fieldset><fieldset class="unit-filter-field"><legend>난이도</legend><div class="unit-choice-list">${LEVELS.map(level => `<label class="unit-choice"><input type="checkbox" name="unit-difficulty" value="${level}"${selectedDifficulty.has(level) ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>${level}</span></label>`).join('')}</div><small>선택하지 않으면 전체 난이도</small></fieldset></div><fieldset class="unit-relaxation-field"><legend>문항 부족 시 완화</legend><div class="unit-relaxation-list"><label class="unit-relax-choice"><input id="unit-include-unclassified" type="checkbox"${filter.includeUnclassified ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>미분류 문항 포함</span></label><label class="unit-relax-choice"><input id="unit-allow-adjacent" type="checkbox"${filter.allowAdjacentDifficulty ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>인접 난이도 허용</span></label></div><small>기본값은 엄격한 소단원·난이도 조건입니다. 부족할 때만 완화하세요.</small></fieldset><fieldset class="unit-mode-field"><legend>출제 방식</legend><div class="unit-mode-toggle"><label><input type="radio" name="unit-mode" value="quick"${filter.mode === 'quick' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>빠른 출제</span></label><label><input type="radio" name="unit-mode" value="advanced"${filter.mode === 'advanced' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>고급 조합</span></label></div></fieldset><div class="unit-quick-fields${filter.mode === 'quick' ? '' : ' is-hidden'}"><label>출제 프리셋<select id="unit-quick-preset" onchange="UnitPastExams.updateDetailFilter()">${Object.entries(QUICK_PRESETS).map(([key, preset]) => `<option value="${key}"${filter.preset === key ? ' selected' : ''}>${preset.label}</option>`).join('')}</select></label><label>문항 수<input id="unit-quick-count" type="number" min="1" max="80" value="${filter.count}" onchange="UnitPastExams.updateDetailFilter()"></label></div><div class="unit-advanced-fields${filter.mode === 'advanced' ? '' : ' is-hidden'}"><div class="unit-advanced-head"><strong>출제 조합</strong><button type="button" class="unit-btn" onclick="UnitPastExams.addBlueprintRow()">+ 조합 추가</button></div><div id="unit-advanced-rows"></div><p class="unit-help">각 행의 소단원·난이도·문항 수를 그대로 반영합니다. 부족한 조합은 출제 전에 표시됩니다.</p></div><div class="unit-filter-actions"><button type="button" class="unit-btn primary" onclick="UnitPastExams.generatePaper()">조건으로 문제지 만들기</button><button type="button" class="unit-btn" onclick="UnitPastExams.resetDetailFilter()">조건 초기화</button></div></div><div id="unit-selection-report" class="unit-selection-report" aria-live="polite"></div><div class="unit-existing-wrap"><div class="unit-section-title"><h3>기존 단원 전체 문제지</h3><span>필터 없이 원본 묶음 기준</span></div><div class="unit-paper-list">${unit.papers.map(paper => renderExistingPaper(paper, unit)).join('')}</div></div></section>`;
    root.innerHTML += '<div id="unit-collection-panel"></div>';
    if (!options.restore) syncFilterUrl(options.historyMode || 'push');
    renderAdvancedRows(unit); renderFilterSummary(unit); renderCollectionPanel(unit); if (!options.noScroll) root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function resetDetailFilter() {
    const unit = getUnit(state.selectedUnitKey); if (!unit) return;
    state.filterState = { ...getDefaultFilterState(unit), unitKey: unit.key, subUnitKeys: [], difficultyBuckets: [], mode: 'quick', preset: 'exam', count: 12, includeUnclassified: false, allowAdjacentDifficulty: false };
    clearSelectionPreview(); syncFilterUrl(); renderDetail(unit.key, { noScroll: true, restore: true }); setStatus('출제 조건을 초기화했습니다.');
  }
  function renderCatalog() {
    const root = document.getElementById('unit-content'); const profile = getProfile();
    root.innerHTML = profile.courses.map(course => { const units = state.catalog.units.filter(unit => unit.course === course); const count = units.reduce((sum, unit) => sum + unit.count, 0); return `<section class="unit-course"><div class="unit-course-head"><h2>${escapeHtml(course)}</h2><span>${count.toLocaleString()}문항</span></div><div class="unit-grid">${units.map(unit => `<button class="unit-card ${unit.count ? '' : 'is-empty'}" data-unit-key="${unit.key}" aria-pressed="${state.selectedUnitKey === unit.key ? 'true' : 'false'}" ${unit.count ? `onclick="UnitPastExams.renderDetail('${unit.key}')"` : 'disabled'}><div class="unit-card-no">${String(unit.order).padStart(2, '0')}</div><h3>${escapeHtml(unit.name)}</h3><div class="unit-card-meta"><span>${unit.count.toLocaleString()}문항</span><span>${unit.papers.length ? `${unit.papers.length}개 문제지` : '자료 없음'}</span></div></button>`).join('')}</div></section>`; }).join('') + '<div id="unit-detail-root"></div>';
    document.querySelectorAll('.unit-card:not(:disabled)').forEach(card => card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault(); card.click();
    }));
    const requestedUnit = new URLSearchParams(window.location.search).get('unit'); if (requestedUnit && state.catalog.units.some(unit => unit.key === requestedUnit)) renderDetail(requestedUnit, { noScroll: true, restore: true });
  }
  function updateProfileChrome() {
    const profile = getProfile(); document.title = `${profile.title} · JS 아카이브`; document.getElementById('unit-kicker').textContent = `2022 개정 교육과정 · ${profile.gradeLabel}`; document.getElementById('unit-title').textContent = profile.title;
    document.querySelectorAll('.unit-grade-tab').forEach(button => { button.classList.toggle('is-active', button.dataset.profile === state.profileId); button.setAttribute('aria-selected', button.dataset.profile === state.profileId ? 'true' : 'false'); });
  }
  function renderSummary() {
    const catalog = state.catalog; document.getElementById('unit-summary').innerHTML = [`분류 ${catalog.classifiedCount.toLocaleString()}문항`, `${catalog.units.length}개 표시 단원`, '문제지당 최대 80문항', '2학기 기말까지'].map(text => `<span>${text}</span>`).join('');
    const reviewText = catalog.review.length ? ` · 검토 필요 ${catalog.review.length}문항` : ''; const metadataText = state.metadataError ? ' · 세부 메타데이터 연결 실패(기존 단원 집계로 계속)' : '';
    setStatus(`원본 ${catalog.scannedCount.toLocaleString()}문항 중 요청 과목 ${catalog.classifiedCount.toLocaleString()}문항을 집계했습니다${reviewText}${metadataText}.`);
  }
  function renderSafeFallback(message) {
    const app = document.getElementById('unit-content');
    if (!app) return;
    app.innerHTML = `<div class="unit-error unit-fallback"><strong>단원별 출제 도구를 불러오지 못했습니다.</strong><br>${escapeHtml(message || '일시적인 로딩 오류입니다.')}<div class="unit-fallback-actions"><a class="unit-btn" href="index.html">기존 아카이브 전체 문제지로 이동</a><a class="unit-btn" href="mixer.html">기존 믹서 출제로 이동</a></div></div>`;
  }
  function selectProfile(profileId, options = {}) {
    if (!core.PROFILES[profileId] || state.busyKey) return;
    const profileChangedAfterInitialLoad = Boolean(state.catalog) && state.profileId !== profileId;
    state.profileId = profileId; state.selectedUnitKey = ''; state.filterState = null; state.collectionState = null; state.generatedPapers = [];
    const url = new URL(window.location.href); url.searchParams.set('grade', profileId);
    if (profileChangedAfterInitialLoad) ['unit', 'subUnit', 'difficulty', 'mode', 'preset', 'count', 'seed', 'includeUnclassified', 'adjacentDifficulty', 'blueprint', 'collection', 'collectionScope', 'collectionStart', 'collectionEnd', 'collectionYearMode', 'collectionYear', 'collectionYearCount', 'collectionYearFrom', 'collectionYearTo', 'collectionSchools', 'collectionOutput', 'collectionCountMode', 'collectionCount', 'collectionSubUnit', 'collectionDifficulty', 'collectionIncludeUnclassified'].forEach(key => url.searchParams.delete(key));
    if (!options.fromPopstate) {
      const updateHistory = profileChangedAfterInitialLoad ? history.pushState.bind(history) : history.replaceState.bind(history);
      updateHistory(null, '', url.toString());
    }
    try {
      state.catalog = core.buildCatalog(state.index.length ? state.index : window.questionIndex, { profileId });
      updateProfileChrome(); renderSummary(); renderCatalog(); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error); renderSafeFallback(error.message || '단원 목록 집계에 실패했습니다.');
    }
  }
  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const requestedGrade = params.get('grade');
    if (core.PROFILES[requestedGrade] && requestedGrade !== state.profileId) {
      selectProfile(requestedGrade, { fromPopstate: true });
      return;
    }
    const requestedUnit = params.get('unit');
    if (requestedUnit && state.catalog?.units.some(unit => unit.key === requestedUnit)) renderDetail(requestedUnit, { noScroll: true, restore: true });
    else if (state.catalog) { state.selectedUnitKey = ''; state.filterState = null; clearSelectionPreview(); renderCatalog(); }
  }
  async function init() {
    const app = document.getElementById('unit-content');
    if (!core) { renderSafeFallback('단원 집계 모듈을 불러오지 못했습니다.'); return; }
    if (!isTeacherSession()) { app.innerHTML = '<div class="unit-error">단원별 기출은 AP Math OS 선생님 로그인 후 사용할 수 있습니다.<br><a href="index.html">아카이브로 돌아가기</a></div>'; return; }
    if (!Array.isArray(window.questionIndex)) { renderSafeFallback('question-index.js를 불러오지 못했습니다.'); return; }
    try { await loadMetadata(); } catch (error) { state.metadataError = true; console.warn(error); }
    state.index = joinApprovedMetadata(window.questionIndex); const requested = new URLSearchParams(window.location.search).get('grade'); selectProfile(core.PROFILES[requested] ? requested : 'h1');
  }
  window.addEventListener('popstate', restoreFromUrl);
  window.UnitPastExams = { init, selectProfile, renderDetail, updateDetailFilter, generatePaper, generateCollectionPapers, updateCollectionFilter, resetCollectionFilter, addBlueprintRow, removeBlueprintRow, updateBlueprintRow, resetDetailFilter, reduceRequestedCount, enableAdjacentDifficulty, enableUnclassified, focusSubUnitFilter, printPaper, assignPaper, restoreFromUrl, renderSafeFallback };
  window.High1UnitPastExams = window.UnitPastExams;
})();
