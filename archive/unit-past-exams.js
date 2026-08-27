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
  const WORKFLOW_STEPS = ['단원', '출처', '구성', '확인'];
  const state = {
    catalog: null, index: [], profileId: 'h1', selectedUnitKey: '', fileCache: new Map(), busyKey: '',
    metadataLoaded: false, metadataError: false, filterState: null, collectionState: null, generatedPapers: [],
    workflowStep: 1, sourceMode: 'archive', previewPaperPosition: 0, previewLoadToken: 0, qpp: '4'
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
    el.classList.toggle('is-loading', false);
    el.classList.toggle('is-error', isError);
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
      const candidates = core.getSourceFileCandidates(sourceFile);
      const failures = [];
      for (const candidate of candidates) {
        delete window.questions;
        delete window.questionBank;
        try {
          await loadScript(`exams/${candidate}?v=20260827b`);
        } catch (error) {
          failures.push(`${candidate}: ${error.message || error}`);
          continue;
        }
        const data = Array.isArray(window.questions) ? window.questions : window.questionBank;
        if (Array.isArray(data)) return data.map(question => ({ ...question }));
        failures.push(`${candidate}: questionBank 배열 없음`);
      }
      const attempted = failures.length > 1 ? ` 시도 경로: ${candidates.join(', ')}` : '';
      throw new Error(`${sourceFile}에서 문항 배열을 찾지 못했습니다.${attempted}`);
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
  function getQpp() {
    const value = String(document.getElementById('unit-qpp')?.value || state.qpp || '4');
    return ['4', '6', '8'].includes(value) ? value : '4';
  }
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
    const sourceSummary = getPaperSources(paper).map(source => source.label).filter(Boolean).join(' / ');
    const meta = {
      title: paper.title, customTitle: paper.title, identityTitle: paper.title, count: questions.length,
      generatedAt: new Date().toISOString(), category: '단원별 기출', grade: profile.grade, gradeLabel: profile.gradeLabel,
      scopeLabel: collection?.scopeLabel || '2학기 기말까지', unitKey: unit.key, unitName: unit.name, subject: collection?.course || unit.course, sourceType: 'mixed',
      subUnitKeys: selectedSubUnits.map(item => item.key), subUnits: selectedSubUnits,
      difficultyBuckets: [...new Set(paper.records.map(record => core.getDifficultyBucket(record)))],
      difficultyPlan: selection.difficultyPlan || [], selectionMode: selection.mode || 'legacy', selectionSeed: selection.seed || '',
      collection,
      school: paper.school || '', schoolKey: paper.schoolKey || '',
      sourceSummary: sourceSummary ? `출처: ${sourceSummary}` : '',
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
    state.previewPaperPosition = 0;
    state.previewLoadToken += 1;
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
      semester: core.normalizeCollectionSemester(params.get('collectionSemester')),
      examType: core.normalizeCollectionExamType(params.get('collectionExamType')),
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
    if (collection.semester) url.searchParams.set('collectionSemester', collection.semester); else url.searchParams.delete('collectionSemester');
    if (collection.examType) url.searchParams.set('collectionExamType', collection.examType); else url.searchParams.delete('collectionExamType');
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
    const semester = document.getElementById('unit-collection-semester');
    if (semester) collection.semester = core.normalizeCollectionSemester(semester.value);
    const examType = document.getElementById('unit-collection-exam-type');
    if (examType) collection.examType = core.normalizeCollectionExamType(examType.value);
    const schoolSelect = document.getElementById('unit-collection-schools');
    const schoolChecks = document.querySelectorAll('input[name="unit-school"]');
    if (schoolSelect?.selectedOptions) collection.schoolKeys = selectedValues('unit-collection-schools');
    else if (schoolChecks.length) collection.schoolKeys = checkedValues('unit-school');
    collection.outputMode = document.querySelector('input[name="unit-collection-output"]:checked')?.value || collection.outputMode || 'school';
    collection.countMode = document.querySelector('input[name="unit-collection-count-mode"]:checked')?.value || collection.countMode || 'all';
    const count = document.getElementById('unit-collection-count');
    if (count) collection.count = Math.min(500, Math.max(1, Number(count.value || 20)));
    collection.subUnitKeys = document.getElementById('unit-collection-subunits')
      ? selectedValues('unit-collection-subunits')
      : [...(state.filterState?.subUnitKeys || [])];
    collection.difficultyBuckets = document.querySelectorAll('input[name="unit-collection-difficulty"]').length
      ? checkedValues('unit-collection-difficulty')
      : [...(state.filterState?.difficultyBuckets || [])];
    const collectionUnclassified = document.getElementById('unit-collection-include-unclassified');
    if (collectionUnclassified) collection.includeUnclassified = Boolean(collectionUnclassified.checked);
    else if (state.filterState) collection.includeUnclassified = Boolean(state.filterState.includeUnclassified);
  }

  function updateCollectionFilter() {
    readCollectionFilterFromDom();
    clearSelectionPreview();
    syncCollectionUrl('push');
    if (state.workflowStep === 2) renderWorkflow();
  }

  function filterCollectionSchools() {
    const input = document.getElementById('unit-collection-school-search');
    const select = document.getElementById('unit-collection-schools');
    const list = document.getElementById('unit-school-list');
    if (!input || (!select && !list)) return;
    const query = compact(input.value);
    if (select) [...select.options].forEach(option => { option.hidden = Boolean(query && !compact(option.textContent).includes(query)); });
    if (list) [...list.querySelectorAll('.unit-school-choice')].forEach(option => { option.hidden = Boolean(query && !compact(option.textContent).includes(query)); });
  }

  function selectAllCollectionSchools() {
    const select = document.getElementById('unit-collection-schools');
    if (select) [...select.options].forEach(option => { option.selected = true; });
    document.querySelectorAll('input[name="unit-school"]').forEach(input => { input.checked = true; });
    if (select || document.querySelector('input[name="unit-school"]')) updateCollectionFilter();
  }

  function clearCollectionSchools() {
    const select = document.getElementById('unit-collection-schools');
    if (select) [...select.options].forEach(option => { option.selected = false; });
    document.querySelectorAll('input[name="unit-school"]').forEach(input => { input.checked = false; });
    if (select || document.querySelector('input[name="unit-school"]')) updateCollectionFilter();
  }

  function renderStepper() {
    const root = document.getElementById('unit-stepper');
    if (!root) return;
    const hasUnit = Boolean(state.selectedUnitKey && getUnit(state.selectedUnitKey));
    const hasPreview = Boolean(state.generatedPapers.length);
    root.innerHTML = WORKFLOW_STEPS.map((label, index) => {
      const step = index + 1;
      const active = state.workflowStep === step;
      const complete = hasUnit && step < state.workflowStep;
      const disabled = step > 1 && !hasUnit || step === 4 && !hasPreview;
      const icon = complete ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : String(step);
      return `<button type="button" class="unit-step${active ? ' is-active' : ''}${complete ? ' is-complete' : ''}" ${disabled ? 'disabled' : ''} aria-current="${active ? 'step' : 'false'}" onclick="UnitPastExams.goToStep(${step})"><span class="unit-step-index">${icon}</span><span class="unit-step-label">${escapeHtml(label)}</span></button>`;
    }).join('');
  }

  function syncWorkflowUrl(historyMode = 'replace') {
    const url = new URL(window.location.href);
    url.searchParams.set('grade', state.profileId);
    if (state.selectedUnitKey) url.searchParams.set('unit', state.selectedUnitKey); else url.searchParams.delete('unit');
    if (state.workflowStep === 2) url.searchParams.set('step', 'source');
    else if (state.workflowStep === 4) url.searchParams.set('step', 'confirm');
    else url.searchParams.delete('step');
    if (state.sourceMode === 'school') url.searchParams.set('collection', '1');
    else {
      [
        'collection', 'collectionScope', 'collectionStart', 'collectionEnd', 'collectionYearMode', 'collectionYear',
        'collectionYearCount', 'collectionYearFrom', 'collectionYearTo', 'collectionSemester', 'collectionExamType',
        'collectionSchools', 'collectionOutput', 'collectionCountMode', 'collectionCount', 'collectionSubUnit',
        'collectionDifficulty', 'collectionIncludeUnclassified'
      ].forEach(key => url.searchParams.delete(key));
    }
    const updateHistory = historyMode === 'push' ? history.pushState.bind(history) : history.replaceState.bind(history);
    updateHistory(null, '', url.toString());
  }

  function goToStep(step) {
    const next = Math.min(4, Math.max(1, Number(step || 1)));
    if (next > 1 && !getUnit(state.selectedUnitKey)) return;
    if (next === 4 && !state.generatedPapers.length) return;
    state.workflowStep = next;
    syncWorkflowUrl('push');
    if (next === 1) renderCatalog(); else renderWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectSourceMode(mode) {
    if (!['archive', 'school'].includes(mode) || state.sourceMode === mode) return;
    state.sourceMode = mode;
    clearSelectionPreview();
    const unit = getUnit(state.selectedUnitKey);
    if (mode === 'school' && unit && (!state.collectionState || state.collectionState.unitKey !== unit.key)) state.collectionState = getCollectionDefaultState(unit);
    syncWorkflowUrl('push');
    renderWorkflow();
  }

  function continueSource() {
    if (state.sourceMode === 'school') readCollectionFilterFromDom();
    if (state.sourceMode === 'school') syncCollectionUrl(); else syncWorkflowUrl();
    state.workflowStep = 3;
    syncWorkflowUrl('push');
    renderWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderContextStrip(unit, options = {}) {
    const profile = getProfile();
    const source = state.sourceMode === 'school' ? '학교·연도 지정' : '전체 아카이브';
    const preset = options.preset || QUICK_PRESETS[state.filterState?.preset]?.label || '시험 대비';
    const count = options.count ?? state.filterState?.count ?? 12;
    return `<div class="unit-context-strip"><strong>${escapeHtml(profile.gradeLabel)}</strong><span class="unit-context-dot">·</span><strong>${escapeHtml(unit.course)}</strong><span class="unit-context-dot">·</span><strong>${escapeHtml(unit.name)}</strong><span class="unit-context-dot">|</span><span>${escapeHtml(source)}</span><span class="unit-context-dot">·</span><span>${escapeHtml(preset)}</span><span class="unit-context-dot">·</span><span>${count}문항</span></div>`;
  }

  function renderCollectionSourceFields(unit) {
    if (!state.collectionState || state.collectionState.unitKey !== unit.key) state.collectionState = getCollectionDefaultState(unit);
    const collection = state.collectionState;
    const profile = getProfile();
    const allRecords = getCollectionRecords();
    const schoolOptions = core.getCollectionSchoolOptions(allRecords, profile, { ...collection, schoolKeys: [], subUnitKeys: [], difficultyBuckets: [] });
    const yearOptions = core.getCollectionYearOptions(allRecords, profile, { ...collection, schoolKeys: [], subUnitKeys: [], difficultyBuckets: [] });
    const validSchools = new Set(schoolOptions.map(item => item.key));
    collection.schoolKeys = collection.schoolKeys.filter(key => validSchools.has(key));
    const scopeUnits = profile.units.filter(item => item.course === unit.course);
    const yearMode = collection.yearMode === 'recentAvailable' ? `recent${collection.yearCount}` : collection.yearMode;
    const exactYearOptions = [...new Set([collection.year, ...yearOptions].filter(Boolean))].sort((a, b) => b - a);
    const scopeOptions = [
      ['current', `현재 단원 · ${unit.name}`],
      ['cumulative', `누적 범위 · ${unit.course} 1단원부터`],
      ['range', '단원 범위 지정'],
      ['course', `${unit.course} 전체`]
    ].map(([value, label]) => `<option value="${value}"${collection.scopeMode === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');
    const unitOptions = selectedKey => scopeUnits.map(item => `<option value="${item.key}"${selectedKey === item.key ? ' selected' : ''}>${String(item.order).padStart(2, '0')} · ${escapeHtml(item.name)}</option>`).join('');
    const schools = schoolOptions.map(item => `<label class="unit-school-choice"><input type="checkbox" name="unit-school" value="${escapeHtml(item.key)}"${collection.schoolKeys.includes(item.key) ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>${escapeHtml(item.label)} · ${escapeHtml(item.years.join('/') || '연도 미상')} <strong>${item.count}</strong></span></label>`).join('');
    return `<div class="unit-source-fields">
      <div class="unit-form-row"><label for="unit-collection-scope">단원 범위</label><select id="unit-collection-scope" aria-label="모아뽑기 단원 범위" onchange="UnitPastExams.updateCollectionFilter()">${scopeOptions}</select><div class="unit-inline-fields${collection.scopeMode === 'range' ? '' : ' is-hidden'}" style="margin-top:10px"><select id="unit-collection-start" aria-label="시작 단원" onchange="UnitPastExams.updateCollectionFilter()">${unitOptions(collection.startUnitKey)}</select><select id="unit-collection-end" aria-label="끝 단원" onchange="UnitPastExams.updateCollectionFilter()">${unitOptions(collection.endUnitKey)}</select></div><small>현재 단원, 누적 범위, 직접 범위, 과목 전체 중에서 선택합니다.</small></div>
      <div class="unit-form-row"><label for="unit-collection-year-mode">연도</label><div class="unit-inline-fields"><select id="unit-collection-year-mode" onchange="UnitPastExams.updateCollectionFilter()"><option value="exact"${yearMode === 'exact' ? ' selected' : ''}>특정 연도</option><option value="recent3"${yearMode === 'recent3' ? ' selected' : ''}>최근 3개년</option><option value="recent5"${yearMode === 'recent5' ? ' selected' : ''}>최근 5개년</option><option value="range"${yearMode === 'range' ? ' selected' : ''}>연도 범위</option></select><select id="unit-collection-year" class="${yearMode === 'exact' ? '' : 'is-hidden'}" onchange="UnitPastExams.updateCollectionFilter()">${exactYearOptions.map(year => `<option value="${year}"${collection.year === year ? ' selected' : ''}>${year}년</option>`).join('')}</select><select id="unit-collection-year-count" class="${yearMode === 'recent3' || yearMode === 'recent5' ? '' : 'is-hidden'}" onchange="UnitPastExams.updateCollectionFilter()"><option value="3"${collection.yearCount === 3 ? ' selected' : ''}>최근 3개년</option><option value="5"${collection.yearCount === 5 ? ' selected' : ''}>최근 5개년</option></select></div><div class="unit-inline-fields${yearMode === 'range' ? '' : ' is-hidden'}" style="margin-top:10px"><input id="unit-collection-year-from" type="number" min="2000" max="2200" value="${collection.yearFrom || ''}" aria-label="시작 연도" onchange="UnitPastExams.updateCollectionFilter()"><input id="unit-collection-year-to" type="number" min="2000" max="2200" value="${collection.yearTo || ''}" aria-label="끝 연도" onchange="UnitPastExams.updateCollectionFilter()"></div><small>최근 연도는 학교별로 실제 자료가 있는 연도만 계산합니다.</small></div>
      <div class="unit-form-row"><span class="unit-form-label">시험 시기</span><div class="unit-inline-fields"><select id="unit-collection-semester" aria-label="시험 학기" onchange="UnitPastExams.updateCollectionFilter()"><option value=""${!collection.semester ? ' selected' : ''}>전체 학기</option><option value="1"${collection.semester === '1' ? ' selected' : ''}>1학기</option><option value="2"${collection.semester === '2' ? ' selected' : ''}>2학기</option></select><select id="unit-collection-exam-type" aria-label="시험 종류" onchange="UnitPastExams.updateCollectionFilter()"><option value=""${!collection.examType ? ' selected' : ''}>중간·기말 전체</option><option value="mid"${collection.examType === 'mid' ? ' selected' : ''}>중간고사</option><option value="final"${collection.examType === 'final' ? ' selected' : ''}>기말고사</option></select></div></div>
      <div class="unit-form-row"><span class="unit-form-label">문제지 구분</span><div class="unit-mode-toggle"><label><input type="radio" name="unit-collection-output" value="school"${collection.outputMode === 'school' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>학교별 문제지</span></label><label><input type="radio" name="unit-collection-output" value="combined"${collection.outputMode === 'combined' ? ' checked' : ''} onchange="UnitPastExams.updateCollectionFilter()"><span>학교 통합 문제지</span></label></div></div>
      <div class="unit-form-row is-wide"><div class="unit-school-tools"><label class="unit-school-search" for="unit-collection-school-search">학교 선택<input id="unit-collection-school-search" type="search" placeholder="학교명 검색" oninput="UnitPastExams.filterCollectionSchools()"></label><div class="unit-school-actions"><button type="button" class="unit-btn" onclick="UnitPastExams.selectAllCollectionSchools()">전체 선택</button><button type="button" class="unit-btn" onclick="UnitPastExams.clearCollectionSchools()">선택 해제</button></div></div><div class="unit-school-list" id="unit-school-list">${schools || '<div class="unit-empty-result">조건에 맞는 학교 자료가 없습니다.</div>'}</div><div id="unit-collection-schools" class="unit-visually-hidden" aria-hidden="true"></div><small>학교를 선택하지 않으면 현재 조건에 자료가 있는 학교를 모두 사용합니다.</small></div>
    </div>`;
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
        yearFrom: collection.yearFrom, yearTo: collection.yearTo, semester: collection.semester, examType: collection.examType,
        selectedYearsBySchool: result.yearSelection.bySchool,
        schoolKeys: [...collection.schoolKeys], outputMode: collection.outputMode, countMode: collection.countMode, count: collection.count
      }
    };
    return { result, selection };
  }

  function buildCollectionPaperTitle(unit, paper, selection) {
    const collection = selection.collection || {};
    const school = paper.schoolKey ? paper.school : '학교 통합';
    const period = [collection.semester ? `${collection.semester}학기` : '', collection.examType ? (collection.examType === 'mid' ? '중간' : '기말') : ''].filter(Boolean).join(' ');
    const base = `${getCollectionYearLabel(collection)}${period ? ` · ${period}` : ''} · ${school} · ${collection.scopeLabel || unit.name}`;
    return base;
  }

  function renderCollectionReport(unit, plan, isReady) {
    const root = document.getElementById('unit-collection-report'); if (!root) return;
    const result = plan.result;
    const schoolRows = result.schools.filter(school => school.candidateCount).map(school => `<div class="unit-plan-row"><span>${escapeHtml(school.label)} · ${escapeHtml(school.years.join(', '))}${school.coverageLabel ? ` · ${escapeHtml(school.coverageLabel)}` : ''}</span><strong>${school.selectedCount}/${school.candidateCount}</strong></div>`).join('');
    const papers = isReady ? state.generatedPapers.filter(paper => paper.unitKey === unit.key && paper.generated) : [];
    const paperActions = papers.map(paper => `<article class="unit-generated-paper"><div><strong>${escapeHtml(paper.title)}</strong><span>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</span></div><div class="unit-paper-actions"><button class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)">일반 출력</button><button class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)">반 학생에게 출제</button></div></article>`).join('');
    const issue = !result.candidateCount
      ? '<div class="unit-empty-result">조건에 맞는 자료가 없습니다. 학교·연도·단원 범위를 조정해 주세요.</div>'
      : result.shortage
        ? `<div class="unit-limit-message">요청한 문항 수보다 ${result.shortage}개 부족합니다. 가능한 ${result.selectedCount}개 문항으로 문제지를 만들었습니다. 학교별 자료 현황을 확인해 주세요.</div>`
        : '';
    root.innerHTML = `<div class="unit-selection-head"><div><h3>${isReady ? '모아뽑기 미리보기' : '자료 현황 확인 필요'}</h3><p>${result.candidateCount.toLocaleString()}개 후보 · ${result.selectedCount.toLocaleString()}개 선택 · ${result.papers.length}개 문제지 · ${escapeHtml(getCollectionYearLabel(plan.selection.collection))}</p></div></div>${issue}<div class="unit-plan-list">${schoolRows || '<div class="unit-empty-result">학교 자료가 없습니다.</div>'}</div>${isReady && papers.length ? `<div class="unit-generated-list">${paperActions}</div><div class="unit-generated-meta">${result.selectedCount}문항 · ${papers.length}개 문제지</div>` : ''}`;
  }

  function generateCollectionPapers() {
    readCollectionFilterFromDom();
    syncCollectionUrl();
    const unit = getUnit(state.selectedUnitKey); if (!unit || !state.collectionState) return false;
    const plan = buildCollectionSelection(unit); const result = plan.result;
    if (!result.candidateCount || !result.ok || !result.papers.length) {
      state.generatedPapers = [];
      renderCollectionReport(unit, plan, false);
      setStatus(!result.candidateCount ? '조건에 맞는 기출 자료가 없습니다.' : `조건에 맞는 문항이 ${result.shortage}개 부족합니다.`, true);
      return false;
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
    renderCollectionReport(unit, plan, true); setStatus(result.shortage
      ? `${firstPaper.title} · ${firstPaper.count}문항을 준비했습니다. 부족 문항 ${result.shortage}개를 확인해 주세요.`
      : `${firstPaper.title} · ${firstPaper.count}문항을 출제할 수 있습니다.`);
    return true;
  }

  function resetCollectionFilter() {
    const unit = getUnit(state.selectedUnitKey); if (!unit) return;
    state.collectionState = getCollectionDefaultState(unit);
    clearSelectionPreview(); syncCollectionUrl(); renderWorkflow(); setStatus('학교·연도 조건을 초기화했습니다.');
  }

  function selectedValues(id) {
    const element = document.getElementById(id);
    if (!element) return [];
    if (element.selectedOptions) return [...element.selectedOptions].map(option => option.value).filter(Boolean);
    return [...element.querySelectorAll('input:checked')].map(input => input.value).filter(Boolean);
  }
  function checkedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value).filter(Boolean);
  }
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
    state.filterState.difficultyBuckets = checkedValues('unit-difficulty');
    state.filterState.mode = document.querySelector('input[name="unit-mode"]:checked')?.value || state.filterState.mode || 'quick';
    const preset = document.getElementById('unit-quick-preset');
    const count = document.getElementById('unit-quick-count');
    if (preset) state.filterState.preset = preset.value || 'exam';
    if (count) state.filterState.count = Math.min(80, Math.max(1, Number(count.value || 12)));
    const includeUnclassified = document.getElementById('unit-include-unclassified');
    const allowAdjacent = document.getElementById('unit-allow-adjacent');
    state.filterState.includeUnclassified = Boolean(includeUnclassified?.checked) || state.filterState.difficultyBuckets.includes('미분류');
    state.filterState.allowAdjacentDifficulty = Boolean(allowAdjacent?.checked);
    const qpp = document.getElementById('unit-qpp-control');
    if (qpp) {
      state.qpp = ['4', '6', '8'].includes(qpp.value) ? qpp.value : '4';
      const hiddenQpp = document.getElementById('unit-qpp');
      if (hiddenQpp) hiddenQpp.value = state.qpp;
    }
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
    const filtered = core.filterUnitRecords(getSharedRecords(unit), state.filterState); const levels = core.getDifficultySummary(filtered);
    const levelText = LEVELS.filter(level => levels[level]).map(level => `${level} ${levels[level]}`).join(' · ') || '선택 문항 없음';
    el.textContent = `현재 조건에서 ${filtered.length.toLocaleString()}문항 · ${levelText}`;
    const count = document.getElementById('unit-action-count');
    if (count) count.textContent = `${state.filterState.count}문항`;
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
    (input.matches?.('select, input, button') ? input : input.querySelector('input, button'))?.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function generatePaper() {
    readDetailFilterFromDom();
    syncFilterUrl();
    const unit = getUnit(state.selectedUnitKey); if (!unit || !state.filterState) return false;
    const plan = buildSelection(unit); const result = plan.result; const report = document.getElementById('unit-selection-report');
    if (!result.requestedCount) { if (report) report.innerHTML = '<div class="unit-empty-result">출제할 문항 수를 입력하거나 고급 조합 행을 추가해 주세요.</div>'; setStatus('출제 조건을 확인해 주세요.', true); return false; }
    if (!result.ok) { state.generatedPapers = []; renderSelectionReport(unit, plan, false); setStatus(result.limitExceeded ? `한 문제지는 최대 ${result.limit}문항까지 만들 수 있습니다.` : `조건에 맞는 문항이 ${result.shortage}개 부족합니다. 아래 완화 방법을 선택해 주세요.`, true); return false; }
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
    return true;
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

  function getSharedRecords(unit) {
    if (state.sourceMode !== 'school' || !state.collectionState) return unit.records;
    const scopeRecords = core.getCollectionScopeRecords(getCollectionRecords(), getProfile(), state.collectionState);
    return core.filterCollectionRecords(scopeRecords, {
      ...state.collectionState,
      schoolKeys: [...state.collectionState.schoolKeys],
      subUnitKeys: [], difficultyBuckets: [], includeUnclassified: false,
      countMode: 'all'
    });
  }

  function renderExistingPaperCompact(paper, unit) {
    return `<div class="unit-paper-option"><div><strong>${escapeHtml(paper.title)}</strong><small>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</small></div><div class="unit-action-buttons"><button type="button" class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', ${paper.index}, this)"><i class="fa-solid fa-print" aria-hidden="true"></i>일반 출력</button><button type="button" class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', ${paper.index}, this)">학생 출제</button></div></div>`;
  }

  function renderSourceStep(unit) {
    const root = document.getElementById('unit-content');
    const archiveSelected = state.sourceMode === 'archive';
    root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit)}<div class="unit-step-panel"><div class="unit-step-heading"><div><h2>어디에서 문항을 가져올까요?</h2><p>출처만 고르면 이후 소단원·난이도·문항 수는 같은 화면에서 설정합니다.</p></div><button type="button" class="unit-btn ghost" onclick="UnitPastExams.goToStep(1)">단원 변경</button></div><div class="unit-source-switch" role="radiogroup" aria-label="문항 출처"><label><input type="radio" name="unit-source-mode" value="archive"${archiveSelected ? ' checked' : ''} onchange="UnitPastExams.selectSourceMode('archive')"><span>전체 아카이브</span></label><label><input type="radio" name="unit-source-mode" value="school"${archiveSelected ? '' : ' checked'} onchange="UnitPastExams.selectSourceMode('school')"><span>학교·연도 지정</span></label></div><p class="unit-source-note">${archiveSelected ? '현재 단원의 모든 기출에서 조건에 맞는 문제를 고릅니다. 가장 빠른 기본 방식입니다.' : '특정 연도와 학교를 먼저 좁힌 뒤, 같은 구성 화면에서 문제지를 만듭니다.'}</p>${archiveSelected ? '' : renderCollectionSourceFields(unit)}<div class="unit-actionbar"><div class="unit-action-summary"><strong>${archiveSelected ? unit.count.toLocaleString() : getSharedRecords(unit).length.toLocaleString()}문항</strong>에서 구성</div><div class="unit-action-buttons"><button type="button" class="unit-btn" onclick="UnitPastExams.goToStep(1)">이전</button><button type="button" class="unit-btn primary unit-btn-large" onclick="UnitPastExams.continueSource()">구성으로 이동 <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div></div></div></section>`;
  }

  function renderConfigStep(unit) {
    const root = document.getElementById('unit-content');
    const filter = state.filterState;
    const sharedRecords = getSharedRecords(unit);
    const subUnitOptions = core.getSubUnitOptions(sharedRecords);
    const validSubUnits = new Set(subUnitOptions.map(item => item.key));
    filter.subUnitKeys = filter.subUnitKeys.filter(key => validSubUnits.has(key));
    if (state.sourceMode === 'school') filter.mode = 'quick';
    const selectedDifficulty = new Set(filter.difficultyBuckets);
    const subUnitChips = subUnitOptions.map(item => `<label class="unit-chip"><input type="checkbox" name="unit-subunit" value="${escapeHtml(item.key)}"${filter.subUnitKeys.includes(item.key) ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>${escapeHtml(item.label)} <span class="unit-chip-count">${item.count}</span></span></label>`).join('');
    const difficultyChips = LEVELS.map(level => `<label class="unit-choice"><input type="checkbox" name="unit-difficulty" value="${level}"${selectedDifficulty.has(level) ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>${level}</span></label>`).join('');
    const existingPapers = state.sourceMode === 'archive' && unit.papers.length ? `<section class="unit-existing-section"><h3>바로 쓰는 문제지</h3><div class="unit-existing-list">${unit.papers.map(paper => renderExistingPaperCompact(paper, unit)).join('')}</div></section>` : '';
    const modeControls = state.sourceMode === 'archive' ? `<section class="unit-advanced-section"><h3>구성 방식</h3><div class="unit-mode-toggle"><label><input type="radio" name="unit-mode" value="quick"${filter.mode === 'quick' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>빠른 구성</span></label><label><input type="radio" name="unit-mode" value="advanced"${filter.mode === 'advanced' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>세부 조합</span></label></div><div class="unit-advanced-fields${filter.mode === 'advanced' ? '' : ' is-hidden'}"><div class="unit-advanced-head"><strong>출제 조합</strong><button type="button" class="unit-btn" onclick="UnitPastExams.addBlueprintRow()"><i class="fa-solid fa-plus" aria-hidden="true"></i>조합 추가</button></div><div id="unit-advanced-rows"></div><p class="unit-help">각 행의 소단원·난이도·문항 수를 그대로 반영합니다.</p></div></section>` : '';
    root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit)}<div class="unit-step-panel"><div class="unit-step-heading"><div><h2>문제지 구성을 정하세요</h2><p>공통 조건은 한 번만 설정합니다. 선택하지 않은 항목은 전체로 적용됩니다.</p></div><button type="button" class="unit-btn ghost" onclick="UnitPastExams.goToStep(2)">출처 수정</button></div><div class="unit-config-list"><div class="unit-config-row"><div class="unit-config-label">소단원</div><div class="unit-config-control"><div class="unit-chip-list" id="unit-subunits" aria-label="소단원 선택">${subUnitChips || '<span class="unit-help">선택 가능한 소단원 정보가 없습니다.</span>'}</div><span class="unit-help">선택하지 않으면 현재 출처 범위의 모든 소단원을 사용합니다.</span></div></div><div class="unit-config-row"><div class="unit-config-label">난이도</div><div class="unit-config-control"><div class="unit-choice-list" id="unit-difficulty">${difficultyChips}</div><span class="unit-help">선택하지 않으면 전체 난이도를 사용합니다.</span></div></div><div class="unit-config-row"><div class="unit-config-label">구성</div><div class="unit-config-control"><div class="unit-quick-fields"><label>출제 프리셋<select id="unit-quick-preset" onchange="UnitPastExams.updateDetailFilter()">${Object.entries(QUICK_PRESETS).map(([key, preset]) => `<option value="${key}"${filter.preset === key ? ' selected' : ''}>${preset.label}</option>`).join('')}</select></label><label>문항 수<input id="unit-quick-count" type="number" min="1" max="80" value="${filter.count}" onchange="UnitPastExams.updateDetailFilter()"></label></div><div class="unit-filter-summary unit-help" id="unit-filter-summary" aria-live="polite"></div></div></div></div>${existingPapers}<details class="unit-advanced-panel"${filter.mode === 'advanced' ? ' open' : ''}><summary>고급 설정</summary><div class="unit-advanced-body">${modeControls}<section class="unit-advanced-section"><h3>문항 부족 시 완화</h3><div class="unit-choice-list"><label class="unit-relax-choice"><input id="unit-include-unclassified" type="checkbox"${filter.includeUnclassified ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>미분류 문항 포함</span></label><label class="unit-relax-choice"><input id="unit-allow-adjacent" type="checkbox"${filter.allowAdjacentDifficulty ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>인접 난이도 허용</span></label></div></section><section class="unit-advanced-section"><h3>인쇄 배치</h3><label>페이지당 문항 수<select class="unit-qpp-control" id="unit-qpp-control" onchange="UnitPastExams.updateDetailFilter()"><option value="4"${getQpp() === '4' ? ' selected' : ''}>4문항</option><option value="6"${getQpp() === '6' ? ' selected' : ''}>6문항</option><option value="8"${getQpp() === '8' ? ' selected' : ''}>8문항</option></select></label></section></div></details><div id="unit-selection-report" class="unit-inline-report" aria-live="polite"></div><div id="unit-collection-report" class="unit-inline-report" aria-live="polite"></div><div class="unit-actionbar"><div class="unit-action-summary"><strong id="unit-action-count">${filter.count}문항</strong> · ${state.sourceMode === 'school' ? '학교·연도 지정' : '전체 아카이브'}</div><div class="unit-action-buttons"><button type="button" class="unit-btn" onclick="UnitPastExams.resetDetailFilter()">조건 초기화</button><button type="button" class="unit-btn primary unit-btn-large" onclick="UnitPastExams.generateUnifiedPreview(this)">미리보기로 이동 <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div></div></div></section>`;
    renderAdvancedRows(unit);
    renderFilterSummary(unit);
  }

  function renderWorkflow() {
    const unit = getUnit(state.selectedUnitKey);
    if (!unit) { state.workflowStep = 1; renderCatalog(); return; }
    renderStepper();
    if (state.workflowStep === 2) renderSourceStep(unit);
    else if (state.workflowStep === 4) renderConfirmation(unit);
    else { state.workflowStep = 3; renderConfigStep(unit); }
  }

  function syncSharedConfigToCollection() {
    if (!state.collectionState || !state.filterState) return;
    state.collectionState.subUnitKeys = [...state.filterState.subUnitKeys];
    state.collectionState.difficultyBuckets = state.filterState.difficultyBuckets.length
      ? [...state.filterState.difficultyBuckets]
      : [...(QUICK_PRESETS[state.filterState.preset]?.buckets || ['하', '중', '상'])];
    state.collectionState.includeUnclassified = state.filterState.includeUnclassified;
    state.collectionState.countMode = 'fixed';
    state.collectionState.count = state.filterState.count;
  }

  function generateUnifiedPreview(button) {
    readDetailFilterFromDom();
    const ready = state.sourceMode === 'school'
      ? (syncSharedConfigToCollection(), generateCollectionPapers())
      : generatePaper();
    if (!ready) return;
    state.workflowStep = 4;
    state.previewPaperPosition = 0;
    syncWorkflowUrl('push');
    renderWorkflow();
    button?.blur?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getActivePreviewPaper() {
    if (!state.generatedPapers.length) return null;
    state.previewPaperPosition = Math.min(state.generatedPapers.length - 1, Math.max(0, state.previewPaperPosition));
    return state.generatedPapers[state.previewPaperPosition];
  }

  function getSummarySubUnits(paper) {
    return [...new Set(paper.records.map(record => core.getSubUnitLabel(record)).filter(Boolean))];
  }

  function renderConfirmation(unit) {
    const root = document.getElementById('unit-content');
    const paper = getActivePreviewPaper();
    if (!paper) { state.workflowStep = 3; renderConfigStep(unit); return; }
    const profile = getProfile();
    const subUnits = getSummarySubUnits(paper);
    const levels = core.getDifficultySummary(paper.records);
    const total = Math.max(1, paper.count);
    const sourceLabel = state.sourceMode === 'school' && state.collectionState
      ? `${getCollectionYearLabel(state.collectionState)} · ${state.collectionState.outputMode === 'combined' ? '학교 통합' : paper.school || '학교별'}`
      : '전체 아카이브';
    const available = state.sourceMode === 'school' ? getSharedRecords(unit).length : core.filterUnitRecords(unit.records, state.filterState).length;
    const difficultyText = LEVELS.filter(level => levels[level]).map(level => `${level} ${levels[level]}문항`).join(' · ') || '난이도 정보 없음';
    const bars = LEVELS.map(level => `<span style="width:${(Number(levels[level] || 0) / total * 100).toFixed(2)}%"></span>`).join('');
    const pager = state.generatedPapers.length > 1 ? `<div class="unit-preview-pager"><button class="unit-btn" type="button" aria-label="이전 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition - 1})"${state.previewPaperPosition <= 0 ? ' disabled' : ''}><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><span>${state.previewPaperPosition + 1} / ${state.generatedPapers.length}</span><button class="unit-btn" type="button" aria-label="다음 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition + 1})"${state.previewPaperPosition >= state.generatedPapers.length - 1 ? ' disabled' : ''}><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div>` : '';
    root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit, { preset: state.sourceMode === 'school' ? paper.school || '학교별 문제지' : QUICK_PRESETS[state.filterState?.preset]?.label, count: paper.count })}<div class="unit-confirmation"><div class="unit-preview-pane"><div class="unit-preview-toolbar"><div class="unit-preview-title"><strong>${escapeHtml(paper.title)}</strong><span>${paper.count}문항 · 원본 ${paper.sourceCount}개 시험지</span></div></div><div class="unit-preview-frame" id="unit-preview-frame"><div class="unit-preview-loading"><span><i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> 실제 문제지를 준비하는 중입니다.</span></div></div>${pager}</div><aside class="unit-confirm-pane"><h2>출제 요약</h2><dl class="unit-summary-list"><div class="unit-summary-row"><dt>단원</dt><dd>${escapeHtml(profile.gradeLabel)} · ${escapeHtml(unit.course)} · ${escapeHtml(unit.name)}</dd></div><div class="unit-summary-row"><dt>출처</dt><dd>${escapeHtml(sourceLabel)}</dd></div><div class="unit-summary-row"><dt>선택 소단원</dt><dd>${escapeHtml(subUnits.slice(0, 6).join(' · ') || '전체 소단원')}</dd></div><div class="unit-summary-row"><dt>난이도</dt><dd>${escapeHtml(difficultyText)}<div class="unit-difficulty-bar" aria-hidden="true">${bars}</div></dd></div><div class="unit-summary-row"><dt>문항 수</dt><dd>${paper.count}문항</dd></div><div class="unit-summary-row"><dt>원본 시험지</dt><dd>원본 ${paper.sourceCount}개 시험지</dd></div></dl><div class="unit-summary-emphasis">조건에 맞는 문항<strong>${available.toLocaleString()}문항</strong></div><div class="unit-confirm-actions"><button type="button" class="unit-btn" onclick="UnitPastExams.goToStep(3)">구성 수정</button><button type="button" class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)"><i class="fa-solid fa-print" aria-hidden="true"></i>일반 출력</button><button type="button" class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>학생에게 출제</button></div></aside></div></section>`;
    loadPreviewPaper(state.previewPaperPosition);
  }

  async function loadPreviewPaper(position) {
    const paper = state.generatedPapers[position];
    const unit = getUnit(state.selectedUnitKey);
    const frameRoot = document.getElementById('unit-preview-frame');
    if (!paper || !unit || !frameRoot) return;
    const token = ++state.previewLoadToken;
    try {
      await preparePaper(unit.key, paper.index, null);
      if (token !== state.previewLoadToken || state.workflowStep !== 4) return;
      const url = new URL(buildMixedUrl(paper));
      url.searchParams.set('preview', '1');
      frameRoot.innerHTML = `<iframe id="unit-preview-iframe" title="${escapeHtml(paper.title)} 실제 문제지 미리보기" src="${escapeHtml(url.toString())}" onload="UnitPastExams.tunePreviewFrame()"></iframe>`;
    } catch (error) {
      if (token !== state.previewLoadToken) return;
      frameRoot.innerHTML = `<div class="unit-error">${escapeHtml(error.message || '문제지 미리보기를 불러오지 못했습니다.')}</div>`;
    }
  }

  function tunePreviewFrame() {
    const frame = document.getElementById('unit-preview-iframe');
    const doc = frame?.contentDocument;
    if (!doc || doc.getElementById('unit-preview-style')) return;
    const style = doc.createElement('style');
    style.id = 'unit-preview-style';
    style.textContent = '#mode-ctrl,#fast-print-dialog{display:none!important}body{padding-top:0!important;background:#eef1f5!important}#print-area{padding:18px 0!important;gap:14px!important}.page{box-shadow:0 4px 18px rgba(15,23,42,.12)!important}@media(max-width:640px){body.screen-fit-mode #print-area{margin-left:0!important;margin-right:0!important;transform-origin:top left!important}}';
    doc.head.appendChild(style);
    doc.body.classList.add('screen-fit-mode');
    frame.contentWindow?.updateScreenFitScale?.();
  }

  function selectPreviewPaper(position) {
    const next = Math.min(state.generatedPapers.length - 1, Math.max(0, Number(position || 0)));
    if (next === state.previewPaperPosition) return;
    state.previewPaperPosition = next;
    renderWorkflow();
  }

  function renderDetail(unitKey, options = {}) {
    const unit = getUnit(unitKey);
    if (!unit || !unit.count) return;
    state.selectedUnitKey = unitKey;
    const params = new URLSearchParams(window.location.search);
    if (options.restore || !state.filterState || state.filterState.unitKey !== unitKey) {
      state.filterState = { ...getDefaultFilterState(unit), unitKey };
      state.collectionState = getCollectionDefaultState(unit);
      state.sourceMode = params.get('collection') === '1' ? 'school' : 'archive';
      clearSelectionPreview();
    }
    const requestedStep = params.get('step');
    if (requestedStep === 'source') state.workflowStep = 2;
    else if (requestedStep === 'confirm' && state.generatedPapers.length) state.workflowStep = 4;
    else state.workflowStep = 3;
    if (!options.restore) {
      syncFilterUrl(options.historyMode || 'push');
      if (state.sourceMode === 'school') syncCollectionUrl();
      syncWorkflowUrl();
    }
    renderWorkflow();
    if (!options.noScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetDetailFilter() {
    const unit = getUnit(state.selectedUnitKey); if (!unit) return;
    state.filterState = { ...getDefaultFilterState(unit), unitKey: unit.key, subUnitKeys: [], difficultyBuckets: [], mode: 'quick', preset: 'exam', count: 12, includeUnclassified: false, allowAdjacentDifficulty: false };
    clearSelectionPreview(); syncFilterUrl(); renderDetail(unit.key, { noScroll: true, restore: true }); setStatus('출제 조건을 초기화했습니다.');
  }
  function renderCatalog() {
    const root = document.getElementById('unit-content');
    const profile = getProfile();
    state.workflowStep = 1;
    renderStepper();
    const grades = ['h1', 'h2', 'm3', 'm2', 'm1'].map(profileId => {
      const item = core.getProfile(profileId);
      return `<button type="button" class="unit-grade-tab${state.profileId === profileId ? ' is-active' : ''}" data-profile="${profileId}" role="tab" aria-selected="${state.profileId === profileId ? 'true' : 'false'}" onclick="UnitPastExams.selectProfile('${profileId}')">${escapeHtml(item.gradeLabel)}</button>`;
    }).join('');
    const courses = profile.courses.map(course => {
      const units = state.catalog.units.filter(unit => unit.course === course);
      const count = units.reduce((sum, item) => sum + item.count, 0);
      const rows = units.map(unit => `<button class="unit-card${unit.count ? '' : ' is-empty'}${state.selectedUnitKey === unit.key ? ' is-active' : ''}" data-unit-key="${unit.key}" aria-pressed="${state.selectedUnitKey === unit.key ? 'true' : 'false'}" ${unit.count ? `onclick="UnitPastExams.renderDetail('${unit.key}')"` : 'disabled'}><span class="unit-card-no">${String(unit.order).padStart(2, '0')}</span><h3>${escapeHtml(unit.name)}</h3><span class="unit-card-meta"><span>${unit.count.toLocaleString()}문항</span><span>${unit.papers.length ? `${unit.papers.length}개 문제지` : '자료 없음'}</span></span></button>`).join('');
      return `<section class="unit-course"><div class="unit-course-head"><h3>${escapeHtml(course)}</h3><span>${count.toLocaleString()}문항</span></div><div class="unit-grid">${rows}</div></section>`;
    }).join('');
    root.innerHTML = `<section class="unit-catalog"><div class="unit-catalog-head"><div><h2>단원을 선택하세요</h2><p>학년과 과목을 고른 뒤 만들 문제지의 단원을 선택합니다.</p></div><div class="unit-grade-tabs" role="tablist" aria-label="학년 선택">${grades}</div></div>${courses}</section>`;
    const requestedUnit = new URLSearchParams(window.location.search).get('unit');
    if (!state.selectedUnitKey && requestedUnit && state.catalog.units.some(unit => unit.key === requestedUnit)) renderDetail(requestedUnit, { noScroll: true, restore: true });
  }

  function updateProfileChrome() {
    const profile = getProfile(); document.title = `${profile.title} · JS 아카이브`; document.getElementById('unit-kicker').textContent = `${profile.gradeLabel} · 2022 개정 교육과정`; document.getElementById('unit-title').textContent = '단원별 기출';
    document.querySelectorAll('.unit-grade-tab').forEach(button => { button.classList.toggle('is-active', button.dataset.profile === state.profileId); button.setAttribute('aria-selected', button.dataset.profile === state.profileId ? 'true' : 'false'); });
  }
  function renderSummary() {
    const catalog = state.catalog;
    const summary = document.getElementById('unit-summary');
    if (summary) summary.textContent = `${catalog.classifiedCount.toLocaleString()}문항 · ${catalog.units.length}개 단원`;
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
    state.workflowStep = 1; state.sourceMode = 'archive'; state.previewPaperPosition = 0; state.previewLoadToken += 1;
    const url = new URL(window.location.href); url.searchParams.set('grade', profileId);
    if (profileChangedAfterInitialLoad) ['unit', 'step', 'subUnit', 'difficulty', 'mode', 'preset', 'count', 'seed', 'includeUnclassified', 'adjacentDifficulty', 'blueprint', 'collection', 'collectionScope', 'collectionStart', 'collectionEnd', 'collectionYearMode', 'collectionYear', 'collectionYearCount', 'collectionYearFrom', 'collectionYearTo', 'collectionSemester', 'collectionExamType', 'collectionSchools', 'collectionOutput', 'collectionCountMode', 'collectionCount', 'collectionSubUnit', 'collectionDifficulty', 'collectionIncludeUnclassified'].forEach(key => url.searchParams.delete(key));
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
    else if (state.catalog) { state.selectedUnitKey = ''; state.filterState = null; state.collectionState = null; state.sourceMode = 'archive'; state.workflowStep = 1; clearSelectionPreview(); renderCatalog(); }
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
  window.UnitPastExams = { init, selectProfile, renderDetail, goToStep, selectSourceMode, continueSource, updateDetailFilter, generateUnifiedPreview, generatePaper, generateCollectionPapers, updateCollectionFilter, resetCollectionFilter, filterCollectionSchools, selectAllCollectionSchools, clearCollectionSchools, addBlueprintRow, removeBlueprintRow, updateBlueprintRow, resetDetailFilter, reduceRequestedCount, enableAdjacentDifficulty, enableUnclassified, focusSubUnitFilter, selectPreviewPaper, tunePreviewFrame, printPaper, assignPaper, restoreFromUrl, renderSafeFallback };
  window.High1UnitPastExams = window.UnitPastExams;
})();
