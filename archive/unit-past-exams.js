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
  const PRINT_HEADER_TEXT_LIMITS = { title: 80, metaRight: 60, subtitle: 120 };
  const REPLACEMENT_PAGE_SIZE = 10;
  const state = {
    catalog: null, index: [], profileId: '', semanticSubject: '', selectedUnitKey: '', fileCache: new Map(), busyKey: '',
    metadataLoaded: false, metadataError: false, filterState: null, collectionState: null, generatedPapers: [],
    workflowStep: 1, sourceMode: 'archive', previewPaperPosition: 0, previewLoadToken: 0, qpp: '4',
    questionEditMode: false, selectedQuestionIndex: -1, replacementCandidates: [], replacementCandidatePage: 0,
    replacementFilter: null, shelfSteps: [], shelfPaperCache: new Map()
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
  // The teacher rule is shared with the left menu (archive2-session.js) so both always agree.
  function isTeacherSession() {
    return Boolean(window.Archive2Session?.isTeacher(getSession()));
  }
  function setStatus(message, isError = false) {
    const el = document.getElementById('unit-status');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('is-loading', false);
    el.classList.toggle('is-error', isError);
    el.style.color = isError ? 'var(--danger)' : '';
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
  function buildMetaFoundationSelectionAuthority() {
    return core.createMetaFoundationSelectionAuthority(window.ARCHIVE_META_FOUNDATION_RUNTIME || null);
  }

  // Usage gate shared with 문제지 만들기 (Archive2Core.generalUseEligibility on the final catalog
  // record): verified identity, intact source reference and fingerprint. Metadata approval, pending
  // review, source-issue annotations and the Meta Foundation taxonomy chain are NOT usage gates.
  // Without a final catalog nothing can be judged, so records stay unmarked (the core treats an
  // unmarked record as usable and the status line says the check could not run).
  function buildGeneralUseAuthority() {
    const catalog = window.ARCHIVE2_FINAL_CATALOG;
    const archive2 = window.Archive2Core;
    if (!catalog || !Array.isArray(catalog.records) || !archive2 || typeof archive2.generalUseEligibility !== 'function') return null;
    const byUid = new Map();
    const bySource = new Map();
    for (const record of catalog.records) {
      if (record.questionUid) byUid.set(record.questionUid, record);
      bySource.set(`${archive2.normalizeFile(record.sourceFile)}#${Number(record.sourceOrdinal)}`, record);
    }
    return {
      check(uid, sourceFile, sourceOrdinal) {
        const found = (uid && byUid.get(uid)) || bySource.get(`${archive2.normalizeFile(sourceFile)}#${Number(sourceOrdinal)}`);
        if (!found) return { ok: false, reasons: ['catalog_record_missing'] };
        // facets: the recorded concept/type/template of the question from the catalog's
        // content-bound usable-meta lane (null when the record has none or is not bound).
        const eligibility = archive2.generalUseEligibility(found);
        return { ...eligibility,
          rpmParentResolution: core.resolveRpmParent(found, state.profileId),
          facets: typeof archive2.metaFacetsOf === 'function' ? archive2.metaFacetsOf(found) : null };
      }
    };
  }

  function joinApprovedMetadata(records) {
    const sidecar = window.ARCHIVE_QUESTION_METADATA;
    const authority = buildMetaFoundationSelectionAuthority();
    const generalUse = buildGeneralUseAuthority();
    state.generalUseChecked = Boolean(generalUse);
    const bySource = new Map();
    for (const meta of sidecar?.records || []) {
      const file = String(meta.sourceArchiveFile || '').replace(/\\/g, '/');
      bySource.set(`${file}#${meta.sourceOrdinal}`, meta);
      if (meta.sourceQuestionNo !== undefined) bySource.set(`${file}#id:${meta.sourceQuestionNo}`, meta);
    }
    return (Array.isArray(records) ? records : []).map(record => {
      const file = String(record.sourceFile || record._sourceFile || '').replace(/\\/g, '/');
      const meta = bySource.get(`${file}#${record.sourceOrdinal}`) || bySource.get(`${file}#id:${record.id || record.sourceQuestionNo}`);
      const useGate = generalUse
        ? generalUse.check(core.getQuestionUid(meta || {}) || core.getQuestionUid(record), file, record.sourceOrdinal)
        : null;
      const useFields = useGate ? { generalUseEligible: useGate.ok, generalUseReasons: useGate.reasons,
        rpmParentResolution: useGate.rpmParentResolution } : {};
      // S14: with the final catalog, concept/type/template come ONLY from its content-bound
      // usable-meta lane (never from a sidecar row that may describe older question bytes), with
      // their own 승인 / 검토 대기 status. Without a catalog the sidecar join below is unchanged.
      const labels = window.ARCHIVE_META_FOUNDATION_LABELS || { problemTypes: {}, templates: {} };
      const facets = useGate ? useGate.facets : undefined;
      const facetFields = useGate ? {
        problemTypeKey: facets ? facets.pt : '',
        templateKey: facets ? facets.tpl : '',
        conceptLabel: facets ? facets.l3 : '',
        problemTypeLabel: facets && facets.pt ? String(labels.problemTypes?.[facets.pt] || '') : '',
        templateLabel: facets && facets.tpl ? String(labels.templates?.[facets.tpl]?.label || '') : '',
        metaFacetStatus: facets ? { l3: facets.l3Status, pt: facets.ptStatus, tpl: facets.tplStatus } : {},
        metaFacetBound: true,
        metaBinding: facets ? facets.binding : ''
      } : {};
      if (!meta) return { ...record, ...useFields, ...facetFields, metaFoundationRuntimeAvailable: authority.active };
      const metadataSubUnitKey = String(meta.subUnitKey || meta.sub_unit_key || '').trim();
      const metadataParentKey = String(meta.standardUnitKey || meta.standard_unit_key || '').trim();
      const validSubUnit = Boolean(metadataSubUnitKey && metadataParentKey && core.isSubUnitInParentScope(metadataSubUnitKey, metadataParentKey));
      const mergedSubUnit = validSubUnit
        ? core.getSubUnitLabel({ subUnitKey: metadataSubUnitKey, subUnit: meta.subUnit || meta.sub_unit || '' })
        : core.getSubUnitLabel(record);
      const taxonomyGate = core.validateMetaFoundationSelection(meta, authority);
      return {
        ...record,
        ...useFields,
        questionUid: core.getQuestionUid(meta) || core.getQuestionUid(record),
        subUnitParentKey: validSubUnit ? metadataParentKey : core.getSubUnitParentKey(record),
        subUnitKey: validSubUnit ? metadataSubUnitKey : core.getSubUnitKey(record),
        subUnit: mergedSubUnit,
        problemTypeKey: String(meta.problemTypeKey || meta.problem_type_key || record.problemTypeKey || '').trim(),
        templateKey: String(meta.templateKey || meta.template_key || record.templateKey || '').trim(),
        L3: String(meta.L3 || record.L3 || '').trim(),
        L4: String(meta.L4 || record.L4 || '').trim(),
        ...facetFields,
        difficultyBucket: meta.difficultyBucket || record.difficultyBucket || '',
        // User decision 2026-10-29: neither metadata approval (defaultSelectable) nor the source
        // hold annotations are usage gates; usage is decided by generalUseEligible above. The
        // approval value stays truthful and only orders the selection (approved metadata first).
        defaultSelectable: meta.defaultSelectable !== undefined ? meta.defaultSelectable : record.defaultSelectable,
        metaFoundationRuntimeAvailable: authority.active,
        metaFoundationOwnedScope: taxonomyGate.owned,
        metaFoundationTaxonomyValid: taxonomyGate.valid,
        metaFoundationTaxonomyReason: taxonomyGate.reason,
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
          problemTypeKey: core.getProblemTypeKey(record), templateKey: core.getTemplateKey(record),
          L3: core.getProblemTypeLabel(record), L4: core.getTemplateLabel(record),
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
  function readyShelf() { return new URLSearchParams(window.location.search).get('ready') === '1'; }
  function getUnit(unitKey) {
    if (unitKey === GRID_UNIT_KEY || (G.result && unitKey === G.result.snapshotUnitKey && String(unitKey).startsWith('multi-'))) return gridPseudoUnit();
    const resolved = core.resolveUnitKeyAlias(state.profileId || 'h1', unitKey);
    return state.catalog?.units.find(unit => unit.key === resolved);
  }
  function getPaper(unitKey, paperIndex) {
    if (unitKey === GRID_UNIT_KEY) return (G.result?.papers || []).find(paper => paper.gridId === String(paperIndex));
    if (String(paperIndex).startsWith('generated')) {
      return state.generatedPapers.find(paper => paper.unitKey === unitKey && String(paper.index) === String(paperIndex))
        || state.generatedPapers.find(paper => paper.unitKey === unitKey && paper.generated)
        || state.generatedPapers.find(paper => paper.unitKey === unitKey);
    }
    const unit = getUnit(unitKey);
    return unit ? getShelfPapers(unit).find(paper => paper.index === Number(paperIndex)) : undefined;
  }

  // 단원별 기출 papers for the chosen difficulty steps (default: every step -> the catalog papers, already
  // ordered step 1 -> 5 -> 단계 미지정). A subset is rebuilt once from the unit's selectable records and cached.
  function getShelfPapers(unit) {
    const tokens = core.normalizeStepSelection(state.shelfSteps);
    if (!tokens.length) return unit.papers;
    const cacheKey = `${state.profileId}|${unit.key}|${tokens.join(',')}`;
    let papers = state.shelfPaperCache.get(cacheKey);
    if (!papers) {
      papers = core.buildUnitPapers(unit, { difficultySteps: tokens });
      state.shelfPaperCache.set(cacheKey, papers);
    }
    return papers;
  }
  function readStepsFromUrl() {
    return core.normalizeStepSelection(new URLSearchParams(window.location.search).get('steps') || '');
  }
  function resetQuestionReplacementState(options = {}) {
    state.selectedQuestionIndex = -1;
    state.replacementCandidates = [];
    state.replacementCandidatePage = 0;
    state.replacementFilter = null;
    if (options.disableEditMode) state.questionEditMode = false;
  }
  function getReplacementIncludeUnclassified() {
    return state.sourceMode === 'school'
      ? state.collectionState?.includeUnclassified === true
      : state.filterState?.includeUnclassified === true;
  }
  function isReplacementRecordAllowed(record) {
    if (!core.isAutomaticSelectable(record)) return false;
    if (getReplacementIncludeUnclassified()) return true;
    return Boolean(core.getSelectionSubUnitKey(record)) && core.getDifficultyBucket(record) !== '미분류';
  }
  function getReplacementSourcePool(unit, paper) {
    let records = unit.records;
    // 단원 x 단계 표에서 만든 권: 바꿀 문항이 속한 단원의 문항 중에서 찾는다(여러 단원이 섞인 권도 같은 규칙).
    if (paper.selectionGrouped) {
      const current = paper.records[state.selectedQuestionIndex];
      const owner = current && (state.catalog?.units || []).find(item => item.key === current.mappedUnitKey);
      records = owner ? owner.records : unit.records;
    }
    if (state.sourceMode === 'school' && state.collectionState) {
      const collection = core.buildCollectionPapers(getCollectionRecords(), getProfile(), {
        ...state.collectionState,
        profileId: state.profileId,
        unitKey: unit.key,
        subUnitKeys: [],
        difficultyBuckets: [],
        countMode: 'all',
        target: state.catalog.scope.targetQuestionsPerPaper,
        max: state.catalog.scope.hardMaxQuestionsPerPaper
      });
      records = collection.records || [];
      const selectedYearsBySchool = paper.selection?.collection?.selectedYearsBySchool;
      if (selectedYearsBySchool && typeof selectedYearsBySchool === 'object') {
        records = records.filter(record => {
          const schoolKey = core.getSchoolKey(record) || '__unknown__';
          const years = Array.isArray(selectedYearsBySchool[schoolKey])
            ? selectedYearsBySchool[schoolKey]
            : [];
          return years.includes(core.getExamYear(record));
        });
      }
      if (paper.schoolKey) records = records.filter(record => core.getSchoolKey(record) === paper.schoolKey);
    }
    return records.filter(isReplacementRecordAllowed);
  }
  function getUsedGeneratedQuestionIdentities() {
    return new Set(state.generatedPapers.flatMap(paper => paper.records || []).map(record => core.getRecordIdentity(record)));
  }
  function getReplacementFilterForRecord(record) {
    return {
      subUnitKey: core.getSelectionSubUnitKey(record) || '',
      difficultyBucket: core.getDifficultyBucket(record)
    };
  }
  function getReplacementSubUnitOptions(records) {
    const options = new Map();
    records.forEach(record => {
      const key = core.getSelectionSubUnitKey(record) || '__unclassified__';
      if (!options.has(key)) options.set(key, core.getSelectionSubUnitLabel(record) || '미분류 소단원');
    });
    return [...options.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), 'ko'));
  }
  function compareReplacementRecords(a, b) {
    return core.compareRecords(a, b) || String(core.getRecordIdentity(a)).localeCompare(String(core.getRecordIdentity(b)));
  }
  function getReplacementCandidates(unit, paper, index, filter = state.replacementFilter) {
    const currentIdentity = core.getRecordIdentity(paper.records[index]);
    const used = getUsedGeneratedQuestionIdentities();
    const subUnitKey = filter?.subUnitKey || '';
    const difficultyBucket = filter?.difficultyBucket || '';
    return getReplacementSourcePool(unit, paper)
      .filter(record => {
        const recordSubUnitKey = core.getSelectionSubUnitKey(record) || '';
        const recordDifficulty = core.getDifficultyBucket(record);
        if (subUnitKey && recordSubUnitKey !== (subUnitKey === '__unclassified__' ? '' : subUnitKey)) return false;
        if (difficultyBucket && recordDifficulty !== difficultyBucket) return false;
        const identity = core.getRecordIdentity(record);
        return identity !== currentIdentity && !used.has(identity);
      })
      .sort(compareReplacementRecords);
  }
  function rebuildPaperAfterReplacement(unit, paper) {
    paper.count = paper.records.length;
    paper.sourceCount = new Set(paper.records.map(record => record.sourceFile)).size;
    const snapshotUnitKey = state.sourceMode === 'school'
      ? `collection-${paper.schoolKey || 'combined'}`
      : unit.key;
    paper.snapshotKey = core.buildSnapshotKey(snapshotUnitKey, paper.records, state.catalog.scope, paper.selectionGrouped
      ? { mode: 'grid', difficultySteps: paper.difficultySteps, paperKey: `${paper.gridId || paper.index}-edited` }
      : paper.selection);
  }
  function getDefaultPaperPrintHeaderOptions(unit, paper) {
    const profile = getProfile();
    return {
      title: paper.title,
      metaRight: `${profile.gradeLabel} ${unit.course} 단원별 기출`,
      subtitle: '',
      showNameLine: true,
      showScoreLine: true,
      applyToSolution: true,
      applyToAnswer: true
    };
  }
  function ensurePaperPrintHeaderOptions(unit, paper) {
    if (!paper.printHeaderOptions || typeof paper.printHeaderOptions !== 'object') {
      paper.printHeaderOptions = getDefaultPaperPrintHeaderOptions(unit, paper);
    }
    return paper.printHeaderOptions;
  }
  function normalizePrintHeaderText(value, maxLength) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
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
    if (selection.problemTypeKeys?.length) parts.push(`${selection.problemTypeKeys.length}개 유형`);
    if (selection.templateKeys?.length) parts.push(`${selection.templateKeys.length}개 템플릿`);
    if (selection.difficultyBuckets?.length) parts.push(selection.difficultyBuckets.join('·'));
    return parts.join(' · ') || '전체 단원 출제';
  }
  function storeMixedPayload(unit, paper, questions) {
    const profile = getProfile();
    const selection = paper.selection || {};
    const collection = selection.collection || null;
    const selectedSubUnits = [...new Map(paper.records.map(record => [core.getSelectionSubUnitKey(record) || '__unclassified__', core.getSelectionSubUnitLabel(record) || '미분류 소단원'])).entries()].map(([key, label]) => ({ key, label }));
    const sourceSummary = getPaperSources(paper).map(source => source.label).filter(Boolean).join(' / ');
    const printHeaderOptions = ensurePaperPrintHeaderOptions(unit, paper);
    const meta = {
      title: paper.title, customTitle: paper.title, identityTitle: paper.title, count: questions.length,
      generatedAt: paper.snapshotGeneratedAt ||= new Date().toISOString(), category: '단원별 기출', grade: profile.grade, gradeLabel: profile.gradeLabel,
      qpp: Number(getQpp()), includeQr: false,
      scopeLabel: collection?.scopeLabel || '2학기 기말까지', unitKey: unit.key, unitName: unit.name, subject: collection?.course || unit.course, sourceType: 'mixed',
      subUnitKeys: selectedSubUnits.map(item => item.key), subUnits: selectedSubUnits,
      difficultyBuckets: [...new Set(paper.records.map(record => core.getDifficultyBucket(record)))],
      problemTypeKeys: [...new Set(paper.records.map(record => core.getProblemTypeKey(record)).filter(Boolean))],
      templateKeys: [...new Set(paper.records.map(record => core.getTemplateKey(record)).filter(Boolean))],
      difficultyPlan: selection.difficultyPlan || [], taxonomyPlan: selection.taxonomyPlan || [],
      selectionMode: selection.mode || 'legacy', selectionSeed: selection.seed || '',
      collection,
      school: paper.school || '', schoolKey: paper.schoolKey || '',
      sourceSummary: sourceSummary ? `출처: ${sourceSummary}` : '',
      questionUids: questions.map(question => core.getQuestionUid(question)).filter(Boolean),
      metadataRevision: [...new Set(paper.records.map(record => record.metadataRevision).filter(Boolean))].join(',') || '',
      printHeaderOptions: { ...printHeaderOptions }
    };
    // Step-ordered papers carry optional section headings ('1단계' ... '단계 미지정' / '기존 분류: 하');
    // older output consumers ignore the unknown field. Recomputed from the current records so a
    // replaced question never leaves a stale heading.
    if (paper.selectionGrouped) {
      // 여러 단원 x 단계 표에서 만든 권: 단원·단계 제목(단원이 하나면 단계 제목만).
      meta.sections = core.buildSelectionSections(paper.records, paper.sectionOptions);
      const stepLabel = core.stepSelectionLabel(paper.difficultySteps);
      if (stepLabel) meta.difficultyStepLabel = stepLabel;
    } else if (paper.stepGrouped) {
      meta.sections = core.buildStepSections(paper.records);
      const stepLabel = core.stepSelectionLabel(paper.difficultySteps);
      if (stepLabel) meta.difficultyStepLabel = stepLabel;
    }
    paper.legacySnapshotStored = true;
    if (!readyShelf()) {
      const stored = storeMixedSnapshot(paper.snapshotKey, questions, meta);
      paper.legacySnapshotStored = stored.ok;
      if (!stored.ok) console.warn('[unit-past] 출제 연결용 자료 저장 실패', stored.error);
    }
    return meta;
  }
  // 옛 출력 전달 방식(mixedQuestions_/mixedMeta_) 보관 관리. mixer.html의 같은 이름 함수와 같은 규칙이다.
  // 읽는 쪽은 방금 만든 자료만 다시 읽으므로 최근 개수만 남기고 오래된 쌍을 지운다. 두 접두사 외의 키는 지우지 않는다.
  const MIXED_SNAPSHOT_INDEX_KEY = 'archiveMixedSnapshotIndex_v1';
  const MIXED_SNAPSHOT_KEEP = 10;
  const MIXED_SNAPSHOT_KEEP_ON_QUOTA = 3;
  function mixedSnapshotCandidates() {
    const times = new Map();
    try {
      const saved = JSON.parse(localStorage.getItem(MIXED_SNAPSHOT_INDEX_KEY) || '[]');
      if (Array.isArray(saved)) saved.forEach(entry => { if (entry && typeof entry.k === 'string' && Number.isFinite(entry.t)) times.set(entry.k, entry.t); });
    } catch (e) { /* 색인이 깨졌으면 키 이름에서 찾는다 */ }
    for (let i = 0; i < localStorage.length; i++) {
      const match = /^mixed(?:Questions|Meta)_(mix_(\d{10,}))$/.exec(localStorage.key(i) || '');
      if (match && !times.has(match[1])) times.set(match[1], Number(match[2]));
    }
    return [...times].map(([k, t]) => ({ k, t })).sort((a, b) => b.t - a.t);
  }
  function pruneMixedSnapshots(keepCount, protectKey) {
    try {
      const list = mixedSnapshotCandidates();
      const kept = new Set(list.slice(0, keepCount).map(entry => entry.k));
      if (protectKey) kept.add(protectKey);
      list.forEach(entry => {
        if (kept.has(entry.k)) return;
        try { localStorage.removeItem(`mixedQuestions_${entry.k}`); localStorage.removeItem(`mixedMeta_${entry.k}`); } catch (e) { /* 다음 정리에서 다시 */ }
      });
      localStorage.setItem(MIXED_SNAPSHOT_INDEX_KEY, JSON.stringify(list.filter(entry => kept.has(entry.k))));
    } catch (e) { /* 정리는 보조 동작이라 실패해도 쓰기를 막지 않는다 */ }
  }
  function storeMixedSnapshot(key, questions, meta) {
    let questionsJson, metaJson;
    try { questionsJson = JSON.stringify(questions); metaJson = JSON.stringify(meta); } catch (error) { return { ok: false, error }; }
    const write = () => {
      localStorage.setItem(`mixedQuestions_${key}`, questionsJson);
      try { localStorage.setItem(`mixedMeta_${key}`, metaJson); }
      catch (error) { try { localStorage.removeItem(`mixedQuestions_${key}`); } catch (e) { /* ignore */ } throw error; }
    };
    pruneMixedSnapshots(MIXED_SNAPSHOT_KEEP - 1, key);
    try { write(); }
    catch (first) {
      pruneMixedSnapshots(MIXED_SNAPSHOT_KEEP_ON_QUOTA, key);
      try { write(); } catch (second) { return { ok: false, error: second }; }
    }
    try {
      const list = mixedSnapshotCandidates().filter(entry => entry.k !== key);
      list.push({ k: key, t: Date.now() });
      localStorage.setItem(MIXED_SNAPSHOT_INDEX_KEY, JSON.stringify(list.sort((a, b) => b.t - a.t)));
    } catch (e) { /* 색인 저장 실패: 자료는 저장됨 */ }
    return { ok: true };
  }
  async function prepareOutputEnvelope(paper, questions, meta, mode = 'exam') {
    const output = window.Archive2Output;
    if (!output?.publishOutputEnvelope) throw new Error('시험지 출력 모듈을 불러오지 못했습니다. 화면을 새로고침해 주세요.');
    const signature = JSON.stringify([
      mode,
      meta,
      questions.map(question => [
        core.getQuestionUid(question),
        question.sourceFingerprint || question.source_fingerprint || ''
      ])
    ]);
    paper.outputEnvelopeCache ||= {};
    const cached = paper.outputEnvelopeCache[mode];
    if (cached?.signature === signature && cached.envelope.expiresAt > Date.now() + 30000) return cached.envelope;
    const envelope = await output.publishOutputEnvelope({
      sourceKind: 'unit-past',
      sourceId: paper.snapshotKey,
      mode,
      questionCount: questions.length,
      questionUids: questions.map(question => core.getQuestionUid(question)),
      meta,
      questions
    });
    paper.outputEnvelopeCache[mode] = { signature, envelope };
    return envelope;
  }
  function outputEnvelopeUrl(envelope, preview = false) {
    const url = window.Archive2Output.outputEnvelopeUrl(
      'mixed_engine.html', window.location.href, envelope,
      { studio: true, preview }
    );
    if (preview) url.searchParams.set('preview', '1');
    return url;
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
      const meta = storeMixedPayload(unit, paper, questions);
      const outputEnvelope = await prepareOutputEnvelope(paper, questions, meta);
      setStatus(`${paper.title} · ${questions.length}문항 준비 완료`);
      return { unit, paper, questions, meta, outputEnvelope };
    } finally {
      state.busyKey = '';
      if (button) { button.disabled = false; button.textContent = oldText; }
    }
  }
  // mode: 'exam'(시험지, 기본) | 'sol'(해설) | 'ans'(정답). 해설·정답은 같은 문항으로 모드만 바꾼 출력 포장을 쓴다.
  async function printPaper(unitKey, paperIndex, button, mode = 'exam') {
    const popup = window.open('about:blank', '_blank');
    if (!popup) { alert('새 창을 허용한 뒤 다시 출력해 주세요.'); return; }
    try {
      let { outputEnvelope } = await preparePaper(unitKey, paperIndex, button);
      if (mode === 'sol' || mode === 'ans') outputEnvelope = await window.Archive2Output.publishOutputEnvelopeMode(outputEnvelope, mode);
      popup.location.href = appendSessionHash(outputEnvelopeUrl(outputEnvelope).href);
    }
    catch (error) { popup.close(); console.error(error); setStatus(error.message || '문제지 준비에 실패했습니다.', true); alert(error.message || '문제지 준비에 실패했습니다.'); }
  }
  // ---- 화면 안 출제 패널(archive2-assign.js) ----
  // 단원별 기출의 `출제`는 보관함·학교 기출과 같은 패널로 낸다. 패널 스크립트가 없거나 주소에 assign=legacy가 있으면
  // 아래 assignPaper의 옛 경로(index.html iframe)로 간다. 요청 본문은 옛 모달과 같고(archive2-assign.js unitBodyFor) 서버는 그대로다.
  function assignPanelAvailable() {
    const panel = window.Archive2Assign;
    return Boolean(panel && typeof panel.open === 'function' && !(typeof panel.useLegacy === 'function' && panel.useLegacy(window.location.search)));
  }
  // 로그인 인증 머리글은 이 브라우저에 이미 있는 교사 세션에서만 읽는다(archive2-workspace.js headers()와 같은 규칙).
  function assignAuthHeader() {
    const session = getSession();
    if (session && session.session_token) return { Authorization: 'Bearer ' + session.session_token };
    const memory = window.__APMATH_AUTH_MEMORY || {};
    const login = memory.login_id || (session && (session.login_id || session.loginId));
    const secret = memory.raw_password || (session && session.raw_password);
    if (login && secret) return { Authorization: 'Basic ' + btoa(unescape(encodeURIComponent(login + ':' + secret))) };
    return null;
  }
  // 패널에 꽂는 request(route, {method, headers, body, timeoutMs}). archive2-workspace.js api()와 같은 방식이다:
  // 같은 서버 주소, 같은 세션 인증, 로그인이 없으면 요청 없이 status=401, 제한 시간이 지나면 timeout=true,
  // 오류 응답은 error.status/error.data를 달아 던진다. 읽기 30초·쓰기 150초는 패널이 timeoutMs로 정한다.
  function assignRequest(route, opt = {}) {
    const rule = window.Archive2Session;
    const memory = window.__APMATH_AUTH_MEMORY || {};
    const loggedIn = !rule || !rule.state || (memory.login_id && memory.raw_password) || rule.state(getSession()).loggedIn;
    const auth = loggedIn ? assignAuthHeader() : null;
    if (!auth) return Promise.reject(Object.assign(new Error('교사 로그인이 필요합니다.'), { status: 401 }));
    const method = opt.method || (opt.body ? 'POST' : 'GET');
    const base = (window.APMATH_API_BASE || 'https://ap-math-os-v2612.js-pdf.workers.dev/api').replace(/\/$/, '');
    const timeoutMs = Number.isFinite(opt.timeoutMs) && opt.timeoutMs > 0 ? opt.timeoutMs : (method === 'GET' ? 30000 : 0);
    const controller = timeoutMs && typeof AbortController === 'function' ? new AbortController() : null;
    const perform = async () => {
      const response = await fetch(base + route, {
        method,
        headers: { ...auth, ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) },
        ...(opt.body ? { body: JSON.stringify(opt.body) } : {}),
        ...(controller ? { signal: controller.signal } : {})
      });
      return { response, data: await response.json().catch(() => ({})) };
    };
    return (async () => {
      let result, timer;
      if (timeoutMs) {
        const pending = perform();
        pending.catch(() => {});
        try {
          result = await Promise.race([pending, new Promise((_, reject) => {
            timer = setTimeout(() => {
              if (controller) controller.abort();
              reject(Object.assign(new Error('응답이 늦습니다. 잠시 뒤 다시 시도해 주세요.'), { timeout: true }));
            }, timeoutMs);
          })]);
        } finally { clearTimeout(timer); }
      } else result = await perform();
      const { response, data } = result;
      if (!response.ok || data.success === false) {
        const error = new Error(data.error || `요청 실패 (${response.status})`);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    })();
  }
  // 패널 항목 하나(권). 서버가 응시 여부를 가르는 제목은 옛 경로와 같은 paper.title이다.
  function unitAssignItem(unitKey, paperIndex, position, total) {
    const unit = getUnit(unitKey);
    const paper = getPaper(unitKey, paperIndex);
    if (!unit || !paper) throw new Error('문제지를 찾지 못했습니다. 권 목록으로 돌아가 다시 시도해 주세요.');
    return {
      kind: 'unit', snapshotKey: paper.snapshotKey, title: paper.title, identityTitle: paper.title,
      grade: getProfile().grade, subject: (paper.selection && paper.selection.collection && paper.selection.collection.course) || unit.course,
      count: paper.count, partIndex: position, partCount: total, ref: { unitKey, paperIndex }
    };
  }
  // 문항 복원 + 옛 출력과 같은 meta. 출력 포장(Envelope)은 만들지 않는다: 패널은 본문에 문항을 직접 싣는다.
  async function loadUnitAssignPayload(item) {
    const unit = getUnit(item.ref.unitKey);
    const paper = getPaper(item.ref.unitKey, item.ref.paperIndex);
    if (!unit || !paper) throw new Error('문제지를 찾지 못했습니다.');
    const questions = await restorePaperQuestions(paper);
    const meta = storeMixedPayload(unit, paper, questions);
    return { questions, meta };
  }
  function openAssignPanel(refs, opener) {
    const panel = window.Archive2Assign;
    if (panel.isOpen && panel.isOpen()) return;
    try {
      const items = refs.map((ref, index) => unitAssignItem(ref.unitKey, ref.paperIndex, index, refs.length));
      panel.open({ items, unit: { load: loadUnitAssignPayload }, request: assignRequest, opener, outputLinks: false });
    } catch (error) { console.error(error); setStatus(error.message || '출제 준비에 실패했습니다.', true); alert(error.message || '출제 준비에 실패했습니다.'); }
  }
  function assignAllPapers(button) {
    const papers = (G.result && G.result.papers) || [];
    if (papers.length < 2 || !(readyShelf() && assignPanelAvailable())) return;
    openAssignPanel(papers.map(paper => ({ unitKey: GRID_UNIT_KEY, paperIndex: paper.gridId })), button);
  }
  async function assignPaper(unitKey, paperIndex, button) {
    if (readyShelf() && assignPanelAvailable()) { openAssignPanel([{ unitKey, paperIndex }], button); return; }
    try {
      const { unit, paper, outputEnvelope } = await preparePaper(unitKey, paperIndex, button); const profile = getProfile();
      const pending = {
        unitPast: true, unitPastSnapshotKey: paper.snapshotKey, identityTitle: paper.title, title: paper.title,
        outputRequestId: outputEnvelope.outputRequestId, outputOwnerId: outputEnvelope.ownerId,
        outputMeta: outputEnvelope.meta,
        topic: paper.title, subject: unit.course, grade: profile.grade, qCount: paper.count, count: paper.count,
        source_type: 'mixed', selectionMode: paper.selection?.mode || 'legacy',
        subUnitKeys: paper.selection?.subUnitKeys || [], difficultyBuckets: paper.selection?.difficultyBuckets || [],
        problemTypeKeys: paper.selection?.problemTypeKeys || [], templateKeys: paper.selection?.templateKeys || [],
        difficultyPlan: paper.selection?.difficultyPlan || [], taxonomyPlan: paper.selection?.taxonomyPlan || [],
        collection: paper.selection?.collection || null, school: paper.school || '', schoolKey: paper.schoolKey || '',
        questionUids: paper.records.map(record => core.getQuestionUid(record)).filter(Boolean)
      };
      const url = new URL('index.html', window.location.href);
      url.searchParams.set('unitPastAssign', paper.snapshotKey); url.searchParams.set('qpp', getQpp());
      if (readyShelf()) {
        url.searchParams.set('archive2Embedded', '1');
        url.searchParams.set('outputRequestId', outputEnvelope.outputRequestId);
        url.searchParams.set('outputOwnerId', outputEnvelope.ownerId);
        openReadyAssignment(url, paper);
      } else {
        // 이 경로의 출제 화면은 브라우저에 저장한 문항을 읽는다. 저장하지 못했으면 빈 출제 화면으로 넘기지 않는다.
        if (paper.legacySnapshotStored === false) throw new Error('출제할 문항을 브라우저에 저장하지 못했습니다(저장 공간 부족). 오래된 출력 자료는 이미 정리했습니다. 다른 탭을 닫고 새로고침한 뒤 다시 시도해 주세요.');
        localStorage.setItem(`APMATH_UNIT_PAST_ASSIGN_${paper.snapshotKey}`, JSON.stringify(pending));
        window.location.href = appendSessionHash(url.toString());
      }
    } catch (error) { console.error(error); setStatus(error.message || '출제 준비에 실패했습니다.', true); alert(error.message || '출제 준비에 실패했습니다.'); }
  }
  function openReadyAssignment(url, paper) {
    let dialog = document.getElementById('unit-ready-assignment');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'unit-ready-assignment';
      dialog.setAttribute('aria-labelledby', 'unit-ready-assignment-title');
      const busy = () => Boolean(dialog.querySelector('iframe')?.contentWindow?.isArchive2OriginalBusy?.());
      dialog.addEventListener('cancel', event => { if (busy()) event.preventDefault(); });
      dialog.addEventListener('click', event => { if (event.target.closest('[data-close-ready-assignment]') && !busy()) dialog.close(); });
      window.addEventListener('message', event => {
        if (event.origin !== location.origin || event.source !== dialog.querySelector('iframe')?.contentWindow) return;
        if (event.data?.type === 'archive2-original-close' && !busy()) dialog.close();
      });
      document.body.appendChild(dialog);
    }
    dialog.innerHTML = `<div class="unit-ready-assignment-heading"><div><h2 id="unit-ready-assignment-title">반·학생에게 출제</h2><p>${escapeHtml(paper.title)} · ${paper.count}문항</p></div><button type="button" class="unit-btn" data-close-ready-assignment>시험지로 돌아가기</button></div><iframe title="반·학생 출제 대상 선택" src="${escapeHtml(url.href)}"></iframe>`;
    dialog.showModal();
  }
  function getDefaultFilterState(unit) {
    const params = new URLSearchParams(window.location.search);
    const requestedSubUnits = parseCollectionKeys(params.get('subUnit'));
    const requestedLevels = (params.get('difficulty') || '').split(',').map(value => value.trim()).filter(Boolean).map(core.normalizeDifficulty);
    const subUnitOptions = core.getSubUnitOptions(unit.records);
    let advancedRows = [{ subUnitKey: '', conceptLabel: '', problemTypeKey: '', templateKey: '', difficultyBucket: '', count: 4 }];
    try {
      const parsedRows = JSON.parse(params.get('blueprint') || 'null');
      if (Array.isArray(parsedRows) && parsedRows.length) {
        advancedRows = parsedRows.map(row => {
          const requestedSubUnit = String(row && row.subUnitKey || '').trim();
          const subUnitKey = subUnitOptions.some(item => item.key === requestedSubUnit) ? requestedSubUnit : '';
          const conceptOptions = core.getConceptOptions(unit.records, { subUnitKeys: subUnitKey ? [subUnitKey] : [] });
          const requestedConcept = String(row && row.conceptLabel || '').trim();
          const conceptLabel = conceptOptions.some(item => item.key === requestedConcept) ? requestedConcept : '';
          const problemOptions = core.getProblemTypeOptions(unit.records, { subUnitKeys: subUnitKey ? [subUnitKey] : [] });
          const requestedProblem = String(row && row.problemTypeKey || '').trim();
          const problemTypeKey = problemOptions.some(item => item.key === requestedProblem) ? requestedProblem : '';
          const templateOptions = core.getTemplateOptions(unit.records, {
            subUnitKeys: subUnitKey ? [subUnitKey] : [],
            problemTypeKeys: problemTypeKey ? [problemTypeKey] : []
          });
          const requestedTemplate = String(row && row.templateKey || '').trim();
          const templateKey = templateOptions.some(item => item.key === requestedTemplate) ? requestedTemplate : '';
          return {
            subUnitKey,
            conceptLabel,
            problemTypeKey,
            templateKey,
            difficultyBucket: row && row.difficultyBucket ? core.normalizeDifficulty(row.difficultyBucket) : '',
            count: Math.min(80, Math.max(1, Number(row && row.count || 1)))
          };
        });
      }
    } catch (error) { /* malformed URL state falls back to one safe row */ }
    return {
      mode: params.get('mode') === 'advanced' ? 'advanced' : 'quick',
      preset: QUICK_PRESETS[params.get('preset')] ? params.get('preset') : 'exam',
      count: Math.min(80, Math.max(1, Number(params.get('count') || 12))),
      subUnitKeys: requestedSubUnits.filter(key => subUnitOptions.some(item => item.key === key)),
      difficultyBuckets: requestedLevels.filter(level => LEVELS.includes(level)),
      includeUnclassified: params.get('includeUnclassified') === '1' || requestedLevels.includes('미분류'),
      allowAdjacentDifficulty: params.get('adjacentDifficulty') === '1',
      approvedMetaOnly: params.get('metaApproved') === '1',
      seed: params.get('seed') || 'unitpast-v1',
      advancedRows
    };
  }

  function syncFilterUrl(historyMode = 'replace') {
    const filter = state.filterState; const url = new URL(window.location.href);
    if (!filter) return;
    url.searchParams.set('grade', state.profileId); url.searchParams.set('unit', state.selectedUnitKey);
    if (core.isHighSemanticProfile(state.profileId) && state.semanticSubject) url.searchParams.set('semanticSubject', state.semanticSubject);
    else url.searchParams.delete('semanticSubject');
    if (filter.mode === 'advanced') url.searchParams.set('mode', 'advanced'); else url.searchParams.delete('mode');
    if (filter.preset !== 'exam') url.searchParams.set('preset', filter.preset); else url.searchParams.delete('preset');
    if (filter.count !== 12) url.searchParams.set('count', String(filter.count)); else url.searchParams.delete('count');
    if (filter.subUnitKeys.length) url.searchParams.set('subUnit', JSON.stringify(filter.subUnitKeys)); else url.searchParams.delete('subUnit');
    if (filter.difficultyBuckets.length) url.searchParams.set('difficulty', filter.difficultyBuckets.join(',')); else url.searchParams.delete('difficulty');
    if (selectedStepTokens().length) url.searchParams.set('steps', selectedStepTokens().join(',')); else url.searchParams.delete('steps');
    if (filter.includeUnclassified) url.searchParams.set('includeUnclassified', '1'); else url.searchParams.delete('includeUnclassified');
    if (filter.allowAdjacentDifficulty) url.searchParams.set('adjacentDifficulty', '1'); else url.searchParams.delete('adjacentDifficulty');
    if (filter.approvedMetaOnly) url.searchParams.set('metaApproved', '1'); else url.searchParams.delete('metaApproved');
    if (filter.mode === 'advanced') url.searchParams.set('blueprint', JSON.stringify(filter.advancedRows)); else url.searchParams.delete('blueprint');
    const updateHistory = historyMode === 'push' ? history.pushState.bind(history) : history.replaceState.bind(history);
    updateHistory(null, '', url.toString());
  }
  function clearSelectionPreview() {
    state.generatedPapers = [];
    state.previewPaperPosition = 0;
    state.previewLoadToken += 1;
    resetQuestionReplacementState({ disableEditMode: true });
    const report = document.getElementById('unit-selection-report');
    if (report) report.innerHTML = '';
    const collectionReport = document.getElementById('unit-collection-report');
    if (collectionReport) collectionReport.innerHTML = '';
  }

  function getCollectionRecords() {
    return state.catalog?.units.flatMap(unit => unit.records) || [];
  }

  function parseCollectionKeys(value) {
    const text = String(value || '').trim();
    if (text.startsWith('[')) {
      try {
        const keys = JSON.parse(text);
        return Array.isArray(keys) ? keys.filter(key => typeof key === 'string' && key.trim()).map(key => key.trim()) : [];
      } catch (_) { return []; }
    }
    // Retain existing shared URLs whose legacy keys do not contain commas.
    return text.split(',').map(item => item.trim()).filter(Boolean);
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
    if (collection.subUnitKeys.length) url.searchParams.set('collectionSubUnit', JSON.stringify(collection.subUnitKeys)); else url.searchParams.delete('collectionSubUnit');
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
    const steps = readyShelf() ? [[1, '단원'], [3, '문제지'], [4, '시험지 확인']] : WORKFLOW_STEPS.map((label, index) => [index + 1, label]);
    root.innerHTML = steps.map(([step, label], index) => {
      const active = state.workflowStep === step;
      const complete = hasUnit && step < state.workflowStep;
      const disabled = step > 1 && !hasUnit || step === 4 && !hasPreview;
      const icon = complete ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : String(index + 1);
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
    if (readyShelf()) { gridLeaveEdit(); return; }
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
      resetQuestionReplacementState({ disableEditMode: true });
      state.generatedPapers = [];
      renderCollectionReport(unit, plan, false);
      setStatus(!result.candidateCount ? '조건에 맞는 기출 자료가 없습니다.' : `조건에 맞는 문항이 ${result.shortage}개 부족합니다.`, true);
      return false;
    }
    resetQuestionReplacementState({ disableEditMode: true });
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
    state.filterState.advancedRows = domRows.map(row => ({
      subUnitKey: row.querySelector('[data-field="subUnitKey"]')?.value || '',
      conceptLabel: row.querySelector('[data-field="conceptLabel"]')?.value || '',
      problemTypeKey: row.querySelector('[data-field="problemTypeKey"]')?.value || '',
      templateKey: row.querySelector('[data-field="templateKey"]')?.value || '',
      difficultyBucket: row.querySelector('[data-field="difficultyBucket"]')?.value || '',
      count: Number(row.querySelector('input[type="number"]')?.value || 0)
    }));
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
    const approvedMeta = document.getElementById('unit-approved-meta');
    if (approvedMeta) state.filterState.approvedMetaOnly = Boolean(approvedMeta.checked);
    const qpp = document.getElementById('unit-qpp-control');
    if (qpp) {
      state.qpp = ['4', '6', '8'].includes(qpp.value) ? qpp.value : '4';
      const hiddenQpp = document.getElementById('unit-qpp');
      if (hiddenQpp) hiddenQpp.value = state.qpp;
    }
    readAdvancedRowsFromDom();
  }
  function updateDetailFilter() {
    const previousApprovedOnly = state.filterState?.approvedMetaOnly === true;
    readDetailFilterFromDom();
    // The option lists of the 조합 rows depend on 승인된 분류만.
    if (state.filterState && (state.filterState.approvedMetaOnly === true) !== previousApprovedOnly)
      renderAdvancedRows(getUnit(state.selectedUnitKey));
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
    return (state.filterState?.advancedRows || []).map(row => ({
      subUnitKey: row.subUnitKey || '',
      conceptLabel: row.conceptLabel || '',
      problemTypeKey: row.problemTypeKey || '',
      templateKey: row.templateKey || '',
      difficultyBucket: row.difficultyBucket || '',
      count: Math.min(80, Math.max(0, Number(row.count || 0)))
    })).filter(row => row.count > 0);
  }

  function buildSelection(unit) {
    const filter = state.filterState;
    const globalFilters = {
      subUnitKeys: filter.subUnitKeys,
      difficultyBuckets: filter.difficultyBuckets,
      seed: filter.seed,
      includeUnclassified: filter.includeUnclassified,
      allowAdjacentDifficulty: filter.allowAdjacentDifficulty,
      approvedOnly: filter.approvedMetaOnly === true,
      maxCount: 80
    };
    const rows = filter.mode === 'advanced' ? getAdvancedRows() : buildQuickRows(unit);
    const result = core.selectByBlueprint(unit.records, rows, globalFilters);
    const selection = {
      mode: filter.mode,
      preset: filter.mode === 'quick' ? filter.preset : '',
      subUnitKeys: [...filter.subUnitKeys],
      conceptLabels: [...new Set(rows.map(row => row.conceptLabel).filter(Boolean))],
      problemTypeKeys: [...new Set(rows.map(row => row.problemTypeKey).filter(Boolean))],
      templateKeys: [...new Set(rows.map(row => row.templateKey).filter(Boolean))],
      difficultyBuckets: [...filter.difficultyBuckets],
      difficultyPlan: rows.map(row => ({
        subUnitKey: row.subUnitKey || '',
        difficultyBucket: row.difficultyBucket || '',
        count: row.count
      })),
      taxonomyPlan: rows.map(row => ({
        subUnitKey: row.subUnitKey || '',
        conceptLabel: row.conceptLabel || '',
        problemTypeKey: row.problemTypeKey || '',
        templateKey: row.templateKey || '',
        difficultyBucket: row.difficultyBucket || '',
        count: row.count
      })),
      seed: filter.seed
    };
    return { result, rows, selection };
  }

  function getSubUnitDisplay(unit, key) {
    if (!key) return '';
    return core.getSubUnitOptions(unit.records).find(item => item.key === key)?.label || key;
  }
  function getProblemTypeDisplay(unit, key, subUnitKey = '') {
    if (!key) return '';
    return core.getProblemTypeOptions(unit.records, { subUnitKeys: subUnitKey ? [subUnitKey] : [] }).find(item => item.key === key)?.label || key;
  }
  function getTemplateDisplay(unit, key, subUnitKey = '', problemTypeKey = '') {
    if (!key) return '';
    return core.getTemplateOptions(unit.records, {
      subUnitKeys: subUnitKey ? [subUnitKey] : [],
      problemTypeKeys: problemTypeKey ? [problemTypeKey] : []
    }).find(item => item.key === key)?.label || key;
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
    if (!result.ok) { resetQuestionReplacementState({ disableEditMode: true }); state.generatedPapers = []; renderSelectionReport(unit, plan, false); setStatus(result.limitExceeded ? `한 문제지는 최대 ${result.limit}문항까지 만들 수 있습니다.` : `조건에 맞는 문항이 ${result.shortage}개 부족합니다. 아래 완화 방법을 선택해 주세요.`, true); return false; }
    const paperTitle = `${unit.name} · ${buildSelectionLabel(plan.selection)}`;
    const paperRecords = core.splitIntoPapers(result.selected, {
      target: state.catalog.scope.targetQuestionsPerPaper,
      max: state.catalog.scope.hardMaxQuestionsPerPaper
    });
    resetQuestionReplacementState({ disableEditMode: true });
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
    const rows = result.rows.map(row => {
      const labels = [];
      if (row.subUnitKey) labels.push(getSubUnitDisplay(unit, row.subUnitKey));
      if (row.problemTypeKey) labels.push(getProblemTypeDisplay(unit, row.problemTypeKey, row.subUnitKey));
      if (row.templateKey) labels.push(getTemplateDisplay(unit, row.templateKey, row.subUnitKey, row.problemTypeKey));
      labels.push(row.difficultyBucket || '전체 난이도');
      const path = labels.filter(Boolean).map(escapeHtml).join(' · ');
      return '<div class="unit-plan-row ' + (row.ok ? '' : 'is-short') + '"><span>' + path + ' · 후보 ' + Number(row.availableCount || 0).toLocaleString() + '문항</span><strong>' + row.selectedCount + '/' + row.requestedCount + '</strong></div>';
    }).join('');
    const papers = isReady ? state.generatedPapers.filter(paper => paper.unitKey === unit.key) : [];
    const paperActions = papers.map(paper => '<article class="unit-generated-paper"><div><strong>' + escapeHtml(paper.title) + '</strong><span>' + paper.count + '문항 · 원본 시험지 ' + paper.sourceCount + '개</span></div><div class="unit-paper-actions"><button class="unit-btn" onclick="UnitPastExams.printPaper(\'' + unit.key + '\', \'' + paper.index + '\', this)">일반 출력</button><button class="unit-btn primary" onclick="UnitPastExams.assignPaper(\'' + unit.key + '\', \'' + paper.index + '\', this)">반 학생에게 출제</button></div></article>').join('');
    const shortageActions = !isReady ? '<div class="unit-relax-actions"><span>완화 방법</span><button type="button" class="unit-btn" onclick="UnitPastExams.reduceRequestedCount()">문항 수 낮추기</button>' + (result.limitExceeded ? '' : '<button type="button" class="unit-btn" onclick="UnitPastExams.enableAdjacentDifficulty()">인접 난이도 허용</button><button type="button" class="unit-btn" onclick="UnitPastExams.enableUnclassified()">미분류 포함</button><button type="button" class="unit-btn" onclick="UnitPastExams.focusSubUnitFilter()">소단원 추가</button>') + '</div>' : '';
    const limitMessage = result.limitExceeded ? '<div class="unit-limit-message">한 문제지는 최대 ' + result.limit + '문항입니다. 조합 행의 합계를 ' + result.limit + '문항 이하로 낮춰 주세요.</div>' : '';
    const relaxedText = result.rows.reduce((sum, row) => sum + (row.relaxedCount || 0), 0);
    const generatedCount = papers.reduce((sum, paper) => sum + paper.count, 0);
    root.innerHTML = '<div class="unit-selection-head"><div><h3>' + (isReady ? '출제 미리보기' : '조건 확인 필요') + '</h3><p>' + result.selectedCount + '개 선택 · ' + (result.shortage ? '부족 ' + result.shortage + '개' : relaxedText ? '인접 난이도 ' + relaxedText + '개 허용' : '중복 없이 구성됨') + '</p></div></div>' + limitMessage + '<div class="unit-plan-list">' + (rows || '<div class="unit-empty-result">선택 조건을 입력해 주세요.</div>') + '</div>' + (isReady && papers.length ? '<div class="unit-generated-list">' + paperActions + '</div><div class="unit-generated-meta">' + generatedCount + '문항 · ' + papers.length + '개 문제지</div>' : '') + shortageActions;
  }

  function renderAdvancedRows(unit) {
    const target = document.getElementById('unit-advanced-rows'); if (!target || !unit || !state.filterState) return;
    const subOptions = core.getSubUnitOptions(unit.records);
    // Recorded concept / type / template (S14): faceted lists with the 승인 / 검토 대기 mix of each
    // option; a selection that the other selections made impossible is cleared, never kept hidden.
    const facetOptionsMarkup = (items, selected, emptyLabel) =>
      '<option value="">' + emptyLabel + '</option>' + items.map(item => '<option value="' + escapeHtml(item.key) + '"' + (item.key === selected ? ' selected' : '') + '>' + escapeHtml(item.label) + ' · ' + escapeHtml(core.facetStatusText(item)) + '</option>').join('');
    const optionsMarkup = (items, selected, emptyLabel) =>
      '<option value="">' + emptyLabel + '</option>' + items.map(item => '<option value="' + escapeHtml(item.key) + '"' + (item.key === selected ? ' selected' : '') + '>' + escapeHtml(item.label) + ' (' + item.count + ')</option>').join('');
    const approvedOnly = state.filterState.approvedMetaOnly === true;
    target.innerHTML = state.filterState.advancedRows.map((row, index) => {
      const subUnitKeys = row.subUnitKey ? [row.subUnitKey] : [];
      let conceptOptions, problemOptions, templateOptions;
      for (let pass = 0; pass < 3; pass += 1) {
        conceptOptions = core.getConceptOptions(unit.records, { subUnitKeys, problemTypeKeys: row.problemTypeKey ? [row.problemTypeKey] : [], templateKeys: row.templateKey ? [row.templateKey] : [], approvedOnly });
        problemOptions = core.getProblemTypeOptions(unit.records, { subUnitKeys, conceptLabels: row.conceptLabel ? [row.conceptLabel] : [], templateKeys: row.templateKey ? [row.templateKey] : [], approvedOnly });
        templateOptions = core.getTemplateOptions(unit.records, { subUnitKeys, conceptLabels: row.conceptLabel ? [row.conceptLabel] : [], problemTypeKeys: row.problemTypeKey ? [row.problemTypeKey] : [], approvedOnly });
        let changed = false;
        if (row.conceptLabel && !conceptOptions.some(item => item.key === row.conceptLabel)) { row.conceptLabel = ''; changed = true; }
        if (row.problemTypeKey && !problemOptions.some(item => item.key === row.problemTypeKey)) { row.problemTypeKey = ''; changed = true; }
        if (row.templateKey && !templateOptions.some(item => item.key === row.templateKey)) { row.templateKey = ''; changed = true; }
        if (!changed) break;
      }
      const candidateCount = core.filterUnitRecords(unit.records, {
        subUnitKeys,
        conceptLabels: row.conceptLabel ? [row.conceptLabel] : [],
        problemTypeKeys: row.problemTypeKey ? [row.problemTypeKey] : [],
        templateKeys: row.templateKey ? [row.templateKey] : [],
        approvedOnly,
        difficultyBuckets: row.difficultyBucket ? [row.difficultyBucket] : [],
        includeUnclassified: state.filterState.includeUnclassified
      }).length;
      return '<div class="unit-blueprint-row">' +
        '<label>소단원<select data-field="subUnitKey" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'subUnitKey\', this.value)">' + optionsMarkup(subOptions, row.subUnitKey, '전체 소단원') + '</select></label>' +
        '<label>개념<select data-field="conceptLabel" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'conceptLabel\', this.value)">' + facetOptionsMarkup(conceptOptions, row.conceptLabel, '전체 개념') + '</select></label>' +
        '<label>유형<select data-field="problemTypeKey" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'problemTypeKey\', this.value)">' + facetOptionsMarkup(problemOptions, row.problemTypeKey, '전체 유형') + '</select></label>' +
        '<label>풀이<select data-field="templateKey" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'templateKey\', this.value)">' + facetOptionsMarkup(templateOptions, row.templateKey, '전체 풀이') + '</select></label>' +
        '<label>난이도<select data-field="difficultyBucket" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'difficultyBucket\', this.value)"><option value=""' + (!row.difficultyBucket ? ' selected' : '') + '>전체</option>' + LEVELS.map(level => '<option value="' + level + '"' + (row.difficultyBucket === level ? ' selected' : '') + '>' + level + '</option>').join('') + '</select></label>' +
        '<label>문항 수<input type="number" min="1" max="80" value="' + Number(row.count || 1) + '" onchange="UnitPastExams.updateBlueprintRow(' + index + ', \'count\', this.value)"></label>' +
        '<span class="unit-blueprint-candidate">후보 ' + candidateCount.toLocaleString() + '문항</span>' +
        '<button type="button" class="unit-icon-btn" aria-label="조합 행 삭제" onclick="UnitPastExams.removeBlueprintRow(' + index + ')">×</button></div>';
    }).join('');
  }

  function addBlueprintRow() {
    if (!state.filterState) return;
    state.filterState.advancedRows.push({ subUnitKey: '', conceptLabel: '', problemTypeKey: '', templateKey: '', difficultyBucket: '', count: 4 });
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
    if (field === 'subUnitKey') { row.conceptLabel = ''; row.problemTypeKey = ''; row.templateKey = ''; }
    if (field === 'problemTypeKey') row.templateKey = '';
    clearSelectionPreview(); syncFilterUrl('push'); renderAdvancedRows(getUnit(state.selectedUnitKey));
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

  // ---- 난이도 단계 선택 (바로 쓰는 문제지) -------------------------------------------------------
  function selectedStepTokens() { return core.normalizeStepSelection(state.shelfSteps); }
  function renderShelfPaperButtons(unit) {
    const papers = getShelfPapers(unit);
    if (!papers.length) return '<p class="unit-help">선택한 단계에 해당하는 문항이 없습니다. 다른 단계를 선택해 주세요.</p>';
    return papers.map(paper => `<button type="button" class="unit-ready-paper" onclick="UnitPastExams.previewExistingPaper('${unit.key}', ${paper.index})"><span class="unit-ready-number">${String(paper.index).padStart(2, '0')}</span><span class="unit-ready-info"><strong>${escapeHtml(paper.title)}</strong><small>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개 · ${escapeHtml(describeStepComposition(paper.stepSummary))}</small></span><span class="unit-ready-action">시험지 확인 <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span></button>`).join('');
  }
  function describeStepComposition(summary) {
    if (!summary) return '';
    const parts = core.STEP_TOKENS.filter(token => summary.steps[token]).map(token => `${core.stepTokenLabel(token)} ${summary.steps[token]}`);
    return parts.join(' · ');
  }
  function renderStepSummaryText(unit) {
    const tokens = selectedStepTokens();
    const papers = getShelfPapers(unit);
    const total = papers.reduce((sum, paper) => sum + paper.count, 0);
    const label = tokens.length ? core.stepSelectionLabel(tokens) : '전체 단계';
    return `${label} · ${total.toLocaleString()}문항 · 문제지 ${papers.length}개 (최신 연도부터, 문제지 안에서는 쉬운 단계부터)`;
  }
  function renderStepSelector(unit) {
    const summary = unit.stepSummary || core.summarizeSteps(unit.selectableRecords || []);
    const selected = new Set(selectedStepTokens());
    const chips = core.STEP_TOKENS.map(token => {
      const count = summary.steps[token] || 0;
      const checked = !selected.size || selected.has(token);
      return `<label class="unit-chip unit-step-chip${count ? '' : ' is-empty'}"><input type="checkbox" name="unit-step" value="${token}"${checked ? ' checked' : ''} onchange="UnitPastExams.updateStepSelection()"><span>${escapeHtml(core.stepTokenLabel(token))} <span class="unit-chip-count">${count.toLocaleString()}</span></span></label>`;
    }).join('');
    const none = summary.steps[core.STEP_TOKENS[5]] || 0;
    const legacy = ['하', '중', '상', '없음'].map(label => `${label} ${(summary.legacy[label] || 0).toLocaleString()}`).join(' · ');
    const legacyNote = none
      ? `<p class="unit-help unit-step-legacy">단계 미지정 ${none.toLocaleString()}문항은 기존 분류(참고용) ${legacy} 순으로 묶어 표시합니다. 숫자 단계로 바꾸지 않으며 제외하지 않습니다.</p>`
      : '';
    return `<section class="unit-step-selector" aria-labelledby="unit-step-selector-title"><div class="unit-step-selector-head"><h3 id="unit-step-selector-title">난이도 단계</h3><span class="unit-help">여러 단계를 함께 고를 수 있습니다. 문제지 1이 가장 최신 연도이고, 각 문제지 안에서는 1단계부터 쉬운 순서로 정리해 단계마다 제목을 붙입니다.</span></div><div class="unit-chip-list" id="unit-steps" role="group" aria-label="난이도 단계 선택">${chips}</div>${legacyNote}<div class="unit-step-summary unit-help" id="unit-step-summary" aria-live="polite">${escapeHtml(renderStepSummaryText(unit))}</div></section>`;
  }
  function updateStepSelection() {
    const unit = getUnit(state.selectedUnitKey);
    if (!unit) return;
    const checked = [...document.querySelectorAll('input[name="unit-step"]:checked')].map(input => input.value);
    // Nothing checked is treated as every step so the shelf never goes blank by accident.
    state.shelfSteps = core.normalizeStepSelection(checked);
    const url = new URL(window.location.href);
    if (state.shelfSteps.length) url.searchParams.set('steps', state.shelfSteps.join(',')); else url.searchParams.delete('steps');
    history.replaceState(null, '', url.toString());
    const list = document.getElementById('unit-shelf-papers');
    if (list) list.innerHTML = renderShelfPaperButtons(unit);
    const summary = document.getElementById('unit-step-summary');
    if (summary) summary.textContent = renderStepSummaryText(unit);
    if (!checked.length) document.querySelectorAll('input[name="unit-step"]').forEach(input => { input.checked = true; });
  }

  function renderConfigStep(unit) {
    const root = document.getElementById('unit-content');
    if (readyShelf()) {
      root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit, { preset: "바로 쓰는 문제지", count: unit.count })}<div class="unit-step-panel"><div class="unit-step-heading"><div><h2>바로 쓰는 문제지</h2><p>기존 단원별 기출 문제지입니다. 시험지를 확인한 뒤 출력하거나 반·학생에게 출제하세요.</p></div><div class="unit-filter-actions"><button type="button" class="unit-btn" onclick="UnitPastExams.openFineBuilder()">세분 출제</button><button class="unit-btn" onclick="UnitPastExams.goToStep(1)">단원 변경</button></div></div>${renderStepSelector(unit)}<div class="unit-existing-list" id="unit-shelf-papers">${renderShelfPaperButtons(unit)}</div></div></section>`;
      return;
    }
    const filter = state.filterState;
    const sharedRecords = getSharedRecords(unit);
    const subUnitOptions = core.getSubUnitOptions(sharedRecords);
    const validSubUnits = new Set(subUnitOptions.map(item => item.key));
    filter.subUnitKeys = filter.subUnitKeys.filter(key => validSubUnits.has(key));
    if (state.sourceMode === 'school') filter.mode = 'quick';
    const selectedDifficulty = new Set(filter.difficultyBuckets);
    const subUnitChips = subUnitOptions.map(item => `<label class="unit-chip"><input type="checkbox" name="unit-subunit" value="${escapeHtml(item.key)}"${filter.subUnitKeys.includes(item.key) ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>${escapeHtml(item.label)} <span class="unit-chip-count">${item.count}</span></span></label>`).join('');
    const difficultyChips = LEVELS.map(level => `<label class="unit-choice"><input type="checkbox" name="unit-difficulty" value="${level}"${selectedDifficulty.has(level) ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>${level}</span></label>`).join('');
    const existingPapers = state.sourceMode === 'archive' && getShelfPapers(unit).length ? `<section class="unit-existing-section"><h3>바로 쓰는 문제지</h3><div class="unit-existing-list">${getShelfPapers(unit).map(paper => renderExistingPaperCompact(paper, unit)).join('')}</div></section>` : '';
    const modeControls = state.sourceMode === 'archive' ? `<section class="unit-advanced-section"><h3>구성 방식</h3><div class="unit-mode-toggle"><label><input type="radio" name="unit-mode" value="quick"${filter.mode === 'quick' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>빠른 구성</span></label><label><input type="radio" name="unit-mode" value="advanced"${filter.mode === 'advanced' ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>세부 조합</span></label></div><div class="unit-advanced-fields${filter.mode === 'advanced' ? '' : ' is-hidden'}"><div class="unit-advanced-head"><strong>출제 조합</strong><button type="button" class="unit-btn" onclick="UnitPastExams.addBlueprintRow()"><i class="fa-solid fa-plus" aria-hidden="true"></i>조합 추가</button></div><div id="unit-advanced-rows"></div><label class="unit-help"><input type="checkbox" id="unit-approved-meta" onchange="UnitPastExams.updateDetailFilter()"${filter.approvedMetaOnly ? ' checked' : ''}> 승인된 분류만</label><p class="unit-help">각 행의 소단원·개념·유형·풀이·난이도·문항 수를 그대로 반영합니다. ‘검토 대기’는 기록은 있으나 아직 승인되지 않은 분류이며 승인된 분류와 같은 방식으로 쓸 수 있습니다.</p></div></section>` : '';
    root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit)}<div class="unit-step-panel"><div class="unit-step-heading"><div><h2>문제지 구성을 정하세요</h2><p>공통 조건은 한 번만 설정합니다. 선택하지 않은 항목은 전체로 적용됩니다.</p></div><button type="button" class="unit-btn ghost" onclick="UnitPastExams.goToStep(2)">출처 수정</button></div><div class="unit-config-list"><div class="unit-config-row"><div class="unit-config-label">소단원</div><div class="unit-config-control"><div class="unit-chip-list" id="unit-subunits" aria-label="소단원 선택">${subUnitChips || '<span class="unit-help">선택 가능한 소단원 정보가 없습니다.</span>'}</div><span class="unit-help">선택하지 않으면 현재 출처 범위의 모든 소단원을 사용합니다.</span></div></div><div class="unit-config-row"><div class="unit-config-label">난이도</div><div class="unit-config-control"><div class="unit-choice-list" id="unit-difficulty">${difficultyChips}</div><span class="unit-help">선택하지 않으면 전체 난이도를 사용합니다.</span></div></div><div class="unit-config-row"><div class="unit-config-label">구성</div><div class="unit-config-control"><div class="unit-quick-fields"><label>출제 프리셋<select id="unit-quick-preset" onchange="UnitPastExams.updateDetailFilter()">${Object.entries(QUICK_PRESETS).map(([key, preset]) => `<option value="${key}"${filter.preset === key ? ' selected' : ''}>${preset.label}</option>`).join('')}</select></label><label>문항 수<input id="unit-quick-count" type="number" min="1" max="80" value="${filter.count}" onchange="UnitPastExams.updateDetailFilter()"></label></div><div class="unit-filter-summary unit-help" id="unit-filter-summary" aria-live="polite"></div></div></div></div>${existingPapers}<details class="unit-advanced-panel"${filter.mode === 'advanced' ? ' open' : ''}><summary>고급 설정</summary><div class="unit-advanced-body">${modeControls}<section class="unit-advanced-section"><h3>문항 부족 시 완화</h3><div class="unit-choice-list"><label class="unit-relax-choice"><input id="unit-include-unclassified" type="checkbox"${filter.includeUnclassified ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>미분류 문항 포함</span></label><label class="unit-relax-choice"><input id="unit-allow-adjacent" type="checkbox"${filter.allowAdjacentDifficulty ? ' checked' : ''} onchange="UnitPastExams.updateDetailFilter()"><span>인접 난이도 허용</span></label></div></section><section class="unit-advanced-section"><h3>인쇄 배치</h3><label>페이지당 문항 수<select class="unit-qpp-control" id="unit-qpp-control" onchange="UnitPastExams.updateDetailFilter()"><option value="4"${getQpp() === '4' ? ' selected' : ''}>4문항</option><option value="6"${getQpp() === '6' ? ' selected' : ''}>6문항</option><option value="8"${getQpp() === '8' ? ' selected' : ''}>8문항</option></select></label></section></div></details><div id="unit-selection-report" class="unit-inline-report" aria-live="polite"></div><div id="unit-collection-report" class="unit-inline-report" aria-live="polite"></div><div class="unit-actionbar"><div class="unit-action-summary"><strong id="unit-action-count">${filter.count}문항</strong> · ${state.sourceMode === 'school' ? '학교·연도 지정' : '전체 아카이브'}</div><div class="unit-action-buttons"><button type="button" class="unit-btn" onclick="UnitPastExams.resetDetailFilter()">조건 초기화</button><button type="button" class="unit-btn primary unit-btn-large" onclick="UnitPastExams.generateUnifiedPreview(this)">미리보기로 이동 <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div></div></div></section>`;
    renderAdvancedRows(unit);
    renderFilterSummary(unit);
  }

  function openFineBuilder() {
    const unit = getUnit(state.selectedUnitKey);
    if (!unit) return;
    const url = new URL(window.location.href);
    url.searchParams.delete('ready');
    url.searchParams.delete('step');
    history.pushState(null, '', url.toString());
    state.sourceMode = 'archive';
    state.workflowStep = 2;
    state.filterState = { ...getDefaultFilterState(unit), unitKey: unit.key };
    clearSelectionPreview();
    syncFilterUrl();
    syncWorkflowUrl();
    renderWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  function previewExistingPaper(unitKey, paperIndex) {
    const unit = getUnit(unitKey);
    const source = unit ? getShelfPapers(unit).find(paper => paper.index === Number(paperIndex)) : null;
    if (!source) return;
    resetQuestionReplacementState({ disableEditMode: true });
    // Reuse the exact existing paper, including its order and snapshot key.
    // Editing the review copy must not mutate the reusable shelf template.
    state.generatedPapers = [{ ...source, unitKey, index: `generated-ready-${source.index}`, records: source.records.map(record => ({ ...record })) }];
    state.previewPaperPosition = 0;
    state.workflowStep = 4;
    syncWorkflowUrl('push');
    renderWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getActivePreviewPaper() {
    if (!state.generatedPapers.length) return null;
    state.previewPaperPosition = Math.min(state.generatedPapers.length - 1, Math.max(0, state.previewPaperPosition));
    return state.generatedPapers[state.previewPaperPosition];
  }

  function updatePrintHeaderOption(field, value) {
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    if (!paper || !unit) return;
    const printHeaderOptions = ensurePaperPrintHeaderOptions(unit, paper);
    let finalValue;
    let shouldRestoreDefaultTitle = false;
    if (Object.prototype.hasOwnProperty.call(PRINT_HEADER_TEXT_LIMITS, field)) {
      const normalizedValue = normalizePrintHeaderText(value, PRINT_HEADER_TEXT_LIMITS[field]);
      shouldRestoreDefaultTitle = field === 'title' && !normalizedValue;
      finalValue = shouldRestoreDefaultTitle
        ? getDefaultPaperPrintHeaderOptions(unit, paper).title
        : normalizedValue;
    } else if (field === 'showNameLine' || field === 'showScoreLine') {
      finalValue = Boolean(value);
    } else {
      return;
    }
    printHeaderOptions[field] = finalValue;
    if (shouldRestoreDefaultTitle) {
      const input = document.getElementById('unit-print-header-title-input');
      if (input && input.value !== finalValue) input.value = finalValue;
    }
    const frame = document.getElementById('unit-preview-iframe');
    frame?.contentWindow?.setPrintHeaderOptions?.({ [field]: finalValue });
  }

  function ensurePaperReplacementState(paper) {
    if (!Array.isArray(paper.replacementHistory)) paper.replacementHistory = [];
    if (!paper.replacementSeenBySlot || typeof paper.replacementSeenBySlot !== 'object') paper.replacementSeenBySlot = {};
  }
  function selectPreviewQuestion(questionIndex) {
    const paper = getActivePreviewPaper();
    if (!paper || !Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= paper.records.length) return;
    state.selectedQuestionIndex = questionIndex;
    state.replacementFilter = getReplacementFilterForRecord(paper.records[questionIndex]);
    state.replacementCandidatePage = 0;
    refreshReplacementCandidates();
    syncPreviewQuestionEditMode();
    updateQuestionReplacementPanel();
  }
  function resetReplacementFilterFromCurrentQuestion() {
    const paper = getActivePreviewPaper();
    const index = state.selectedQuestionIndex;
    if (!paper || index < 0 || index >= paper.records.length) return false;
    state.replacementFilter = getReplacementFilterForRecord(paper.records[index]);
    state.replacementCandidatePage = 0;
    return true;
  }
  function refreshReplacementCandidates() {
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    const index = state.selectedQuestionIndex;
    if (!paper || !unit || index < 0 || index >= paper.records.length) {
      state.replacementCandidates = [];
      state.replacementCandidatePage = 0;
      return;
    }
    if (!state.replacementFilter) state.replacementFilter = getReplacementFilterForRecord(paper.records[index]);
    state.replacementCandidates = getReplacementCandidates(unit, paper, index, state.replacementFilter);
    const pageCount = Math.max(1, Math.ceil(state.replacementCandidates.length / REPLACEMENT_PAGE_SIZE));
    state.replacementCandidatePage = Math.min(Math.max(0, state.replacementCandidatePage), pageCount - 1);
  }
  function updateQuestionReplacementPanel() {
    const panel = document.getElementById('unit-question-replacement-panel');
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    if (!panel || !paper || !unit || !state.questionEditMode) return;
    panel.outerHTML = renderQuestionReplacementPanel(unit, paper);
  }
  function setReplacementFilter(field, value) {
    if (!state.replacementFilter || !['subUnitKey', 'difficultyBucket'].includes(field)) return;
    state.replacementFilter[field] = String(value || '');
    state.replacementCandidatePage = 0;
    refreshReplacementCandidates();
    updateQuestionReplacementPanel();
  }
  function setReplacementCandidatePage(page) {
    const pageCount = Math.max(1, Math.ceil(state.replacementCandidates.length / REPLACEMENT_PAGE_SIZE));
    state.replacementCandidatePage = Math.min(pageCount - 1, Math.max(0, Number(page || 0)));
    updateQuestionReplacementPanel();
  }
  function getQuestionNumberFromBox(box) {
    const raw = box?.querySelector('.q-num')?.textContent || '';
    const match = String(raw).match(/\d+/);
    return match ? Number(match[0]) : NaN;
  }
  function syncPreviewQuestionEditMode() {
    const frame = document.getElementById('unit-preview-iframe');
    const doc = frame?.contentDocument;
    const printArea = doc?.getElementById('print-area');
    if (!doc || !printArea) return;
    printArea.classList.toggle('unit-question-edit-mode', state.questionEditMode);
    const selectedIndex = state.selectedQuestionIndex;
    doc.querySelectorAll('.q-box').forEach(box => {
      box.classList.remove('unit-question-edit-selected');
      const questionNo = getQuestionNumberFromBox(box);
      if (state.questionEditMode && Number.isInteger(questionNo) && questionNo - 1 === selectedIndex) {
        box.classList.add('unit-question-edit-selected');
      }
    });
  }
  function bindPreviewQuestionSelection(doc) {
    const printArea = doc?.getElementById('print-area');
    if (!printArea || printArea.dataset.unitQuestionEditBound === '1') return;
    printArea.addEventListener('click', event => {
      if (!state.questionEditMode) return;
      const box = event.target.closest('.q-box');
      if (!box || !printArea.contains(box)) return;
      const questionNo = getQuestionNumberFromBox(box);
      const index = questionNo - 1;
      const paper = getActivePreviewPaper();
      if (!Number.isInteger(questionNo) || !paper || index < 0 || index >= paper.records.length) return;
      event.preventDefault();
      selectPreviewQuestion(index);
    });
    printArea.dataset.unitQuestionEditBound = '1';
  }
  function schedulePreviewQuestionBinding(frame) {
    if (!frame || frame.dataset.unitQuestionBindingScheduled === '1') return;
    frame.dataset.unitQuestionBindingScheduled = '1';
    const observe = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) {
        window.setTimeout(observe, 50);
        return;
      }
      const observer = new doc.defaultView.MutationObserver(() => {
        bindPreviewQuestionSelection(doc);
        syncPreviewQuestionEditMode();
      });
      observer.observe(doc.body, { childList: true, subtree: true });
      bindPreviewQuestionSelection(doc);
      syncPreviewQuestionEditMode();
    };
    observe();
  }
  function toggleQuestionEditMode() {
    state.questionEditMode = !state.questionEditMode;
    if (!state.questionEditMode) resetQuestionReplacementState();
    renderWorkflow();
  }
  function quickReplaceSelectedQuestion() {
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    const index = state.selectedQuestionIndex;
    if (!paper || !unit || index < 0 || index >= paper.records.length) return;
    resetReplacementFilterFromCurrentQuestion();
    refreshReplacementCandidates();
    ensurePaperReplacementState(paper);
    const currentIdentity = core.getRecordIdentity(paper.records[index]);
    const seen = new Set(paper.replacementSeenBySlot[index] || [currentIdentity]);
    let candidate = state.replacementCandidates.find(record => !seen.has(core.getRecordIdentity(record)));
    if (!candidate && state.replacementCandidates.length) {
      seen.clear();
      seen.add(currentIdentity);
      candidate = state.replacementCandidates[0];
    }
    if (!candidate) {
      setStatus('같은 조건의 다른 문항이 없습니다. 후보 조건을 변경해 직접 선택해 주세요.', true);
      updateQuestionReplacementPanel();
      return;
    }
    replaceSelectedQuestion(state.replacementCandidates.indexOf(candidate));
  }
  function replaceSelectedQuestion(candidateIndex) {
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    const index = state.selectedQuestionIndex;
    const candidate = state.replacementCandidates[candidateIndex];
    if (!paper || !unit || !candidate || index < 0 || index >= paper.records.length) return;
    const current = paper.records[index];
    const candidateIdentity = core.getRecordIdentity(candidate);
    const currentIdentity = core.getRecordIdentity(current);
    const sourcePool = getReplacementSourcePool(unit, paper);
    const used = getUsedGeneratedQuestionIdentities();
    if (!sourcePool.some(record => core.getRecordIdentity(record) === candidateIdentity)
      || candidateIdentity === currentIdentity || used.has(candidateIdentity)) {
      setStatus('이미 사용 중이거나 현재 출처 범위를 벗어난 문항입니다.', true);
      refreshReplacementCandidates();
      updateQuestionReplacementPanel();
      return;
    }
    ensurePaperReplacementState(paper);
    paper.replacementHistory.push({ index, before: current, after: candidate });
    const seen = new Set(paper.replacementSeenBySlot[index] || [currentIdentity]);
    seen.add(currentIdentity);
    seen.add(candidateIdentity);
    paper.replacementSeenBySlot[index] = [...seen];
    paper.records[index] = candidate;
    rebuildPaperAfterReplacement(unit, paper);
    refreshReplacementCandidates();
    renderConfirmation(unit);
  }
  function undoLastQuestionReplacement() {
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    if (!paper || !unit || !paper.replacementHistory?.length) return;
    const entry = paper.replacementHistory.pop();
    if (!entry || entry.index < 0 || entry.index >= paper.records.length) return;
    const currentIdentity = core.getRecordIdentity(paper.records[entry.index]);
    const usedElsewhere = getUsedGeneratedQuestionIdentities();
    usedElsewhere.delete(currentIdentity);
    const beforeIdentity = core.getRecordIdentity(entry.before);
    if (usedElsewhere.has(beforeIdentity)) {
      paper.replacementHistory.push(entry);
      setStatus('되돌릴 문항이 다른 문제지에서 사용 중이라 복원할 수 없습니다.', true);
      return;
    }
    paper.records[entry.index] = entry.before;
    rebuildPaperAfterReplacement(unit, paper);
    refreshReplacementCandidates();
    renderConfirmation(unit);
  }
  function renderQuestionEditToggle() {
    return `<div class="unit-question-edit-actions"><button type="button" class="unit-btn${state.questionEditMode ? ' primary' : ''}" aria-pressed="${state.questionEditMode ? 'true' : 'false'}" onclick="UnitPastExams.toggleQuestionEditMode()">문항 수정</button></div>`;
  }
  function renderQuestionReplacementPanel(unit, paper) {
    if (!state.questionEditMode) return '';
    const panelId = 'unit-question-replacement-panel';
    const index = state.selectedQuestionIndex;
    if (index < 0 || index >= paper.records.length) {
      return `<section id="${panelId}" class="unit-question-replacement-panel"><h3>선택 문항</h3><p class="unit-replacement-empty">왼쪽 미리보기에서 교체할 문항을 클릭하세요.</p></section>`;
    }
    const record = paper.records[index];
    const sourcePool = getReplacementSourcePool(unit, paper);
    const filter = state.replacementFilter || getReplacementFilterForRecord(record);
    const subUnitOptions = [{ key: '', label: '전체 소단원' }, ...getReplacementSubUnitOptions(sourcePool)]
      .map(option => `<option value="${escapeHtml(option.key)}"${filter.subUnitKey === option.key ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
    const allowUnclassified = getReplacementIncludeUnclassified();
    const difficultyOptions = ['', ...LEVELS.filter(level => level !== '미분류' || allowUnclassified)]
      .map(level => `<option value="${escapeHtml(level)}"${filter.difficultyBucket === level ? ' selected' : ''}>${escapeHtml(level || '전체 난이도')}</option>`).join('');
    const pageCount = Math.max(1, Math.ceil(state.replacementCandidates.length / REPLACEMENT_PAGE_SIZE));
    const page = Math.min(state.replacementCandidatePage, pageCount - 1);
    const pageItems = state.replacementCandidates.slice(page * REPLACEMENT_PAGE_SIZE, (page + 1) * REPLACEMENT_PAGE_SIZE);
    const candidates = pageItems.map(candidate => {
      const candidateIndex = state.replacementCandidates.indexOf(candidate);
      const label = getSourceExamLabel(candidate.sourceFile, candidate) || '출처 확인 필요';
      return `<article class="unit-replacement-candidate"><div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(core.getSelectionSubUnitLabel(candidate) || '미분류 소단원')} · ${escapeHtml(core.getDifficultyBucket(candidate))} · 원본 ${escapeHtml(candidate.sourceQuestionNo || candidate.id || '')}번</span></div><button type="button" class="unit-btn" onclick="UnitPastExams.replaceSelectedQuestion(${candidateIndex})">이 문제로 교체</button></article>`;
    }).join('');
    return `<section id="${panelId}" class="unit-question-replacement-panel"><h3>선택 문항</h3><div class="unit-replacement-selected"><strong>${index + 1}번</strong><span>${escapeHtml(core.getSelectionSubUnitLabel(record) || '미분류 소단원')} · ${escapeHtml(core.getDifficultyBucket(record))}</span><small>${escapeHtml(getSourceExamLabel(record.sourceFile, record) || '출처 확인 필요')} · 원본 ${escapeHtml(record.sourceQuestionNo || record.id || '')}번</small></div><div class="unit-replacement-filters"><label>소단원<select id="unit-replacement-subunit" onchange="UnitPastExams.setReplacementFilter('subUnitKey', this.value)">${subUnitOptions}</select></label><label>난이도<select id="unit-replacement-difficulty" onchange="UnitPastExams.setReplacementFilter('difficultyBucket', this.value)">${difficultyOptions}</select></label></div><div class="unit-replacement-tools"><button type="button" class="unit-btn primary" onclick="UnitPastExams.quickReplaceSelectedQuestion()">같은 조건으로 교체</button><button type="button" class="unit-btn" onclick="UnitPastExams.undoLastQuestionReplacement()"${paper.replacementHistory?.length ? '' : ' disabled'}>교체 되돌리기</button></div><div class="unit-replacement-count">후보 ${state.replacementCandidates.length}문항</div>${candidates || '<p class="unit-replacement-empty">조건에 맞는 다른 문항이 없습니다.</p>'}${pageCount > 1 ? `<div class="unit-replacement-pagination"><button type="button" class="unit-btn" onclick="UnitPastExams.setReplacementCandidatePage(${page - 1})"${page <= 0 ? ' disabled' : ''}>이전</button><span>${page + 1} / ${pageCount}</span><button type="button" class="unit-btn" onclick="UnitPastExams.setReplacementCandidatePage(${page + 1})"${page >= pageCount - 1 ? ' disabled' : ''}>다음</button></div>` : ''}</section>`;
  }

  function getSummarySubUnits(paper) {
    return [...new Set(paper.records.map(record => core.getSelectionSubUnitLabel(record)).filter(Boolean))];
  }

  function renderConfirmation(unit) {
    const root = document.getElementById('unit-content');
    const paper = getActivePreviewPaper();
    if (!paper) { state.workflowStep = 3; renderConfigStep(unit); return; }
    const printHeaderOptions = ensurePaperPrintHeaderOptions(unit, paper);
    const profile = getProfile();
    const subUnits = getSummarySubUnits(paper);
    const levels = core.getDifficultySummary(paper.records);
    const total = Math.max(1, paper.count);
    const sourceLabel = state.sourceMode === 'school' && state.collectionState
      ? `${getCollectionYearLabel(state.collectionState)} · ${state.collectionState.outputMode === 'combined' ? '학교 통합' : paper.school || '학교별'}`
      : '전체 아카이브';
    const available = readyShelf() ? paper.count : state.sourceMode === 'school' ? getSharedRecords(unit).length : core.filterUnitRecords(unit.records, state.filterState).length;
    const difficultyText = readyShelf() ? describeStepComposition(core.summarizeSteps(paper.records)) || '난이도 정보 없음' : LEVELS.filter(level => levels[level]).map(level => `${level} ${levels[level]}문항`).join(' · ') || '난이도 정보 없음';
    const bars = readyShelf() ? '' : LEVELS.map(level => `<span style="width:${(Number(levels[level] || 0) / total * 100).toFixed(2)}%"></span>`).join('');
    const pager = state.generatedPapers.length > 1 ? `<div class="unit-preview-pager"><button class="unit-btn" type="button" aria-label="이전 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition - 1})"${state.previewPaperPosition <= 0 ? ' disabled' : ''}><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><span>${state.previewPaperPosition + 1} / ${state.generatedPapers.length}</span><button class="unit-btn" type="button" aria-label="다음 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition + 1})"${state.previewPaperPosition >= state.generatedPapers.length - 1 ? ' disabled' : ''}><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div>` : '';
    root.innerHTML = `<section class="unit-workflow">${renderContextStrip(unit, { preset: readyShelf() ? '바로 쓰는 문제지' : state.sourceMode === 'school' ? paper.school || '학교별 문제지' : QUICK_PRESETS[state.filterState?.preset]?.label, count: paper.count })}<div class="unit-confirmation"><div class="unit-preview-pane"><div class="unit-preview-toolbar"><div class="unit-preview-title"><strong>${escapeHtml(paper.title)}</strong><span>${paper.count}문항 · 원본 ${paper.sourceCount}개 시험지</span></div></div><div class="unit-preview-frame" id="unit-preview-frame"><div class="unit-preview-loading"><span><i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> 실제 문제지를 준비하는 중입니다.</span></div></div>${pager}</div><aside class="unit-confirm-pane"><h2>출제 요약</h2><dl class="unit-summary-list"><div class="unit-summary-row"><dt>단원</dt><dd>${escapeHtml(profile.gradeLabel)} · ${escapeHtml(unit.course)} · ${escapeHtml(unit.name)}</dd></div><div class="unit-summary-row"><dt>출처</dt><dd>${escapeHtml(sourceLabel)}</dd></div><div class="unit-summary-row"><dt>선택 소단원</dt><dd>${escapeHtml(subUnits.slice(0, 6).join(' · ') || '전체 소단원')}</dd></div><div class="unit-summary-row"><dt>난이도</dt><dd>${escapeHtml(difficultyText)}<div class="unit-difficulty-bar" aria-hidden="true">${bars}</div></dd></div><div class="unit-summary-row"><dt>문항 수</dt><dd>${paper.count}문항</dd></div><div class="unit-summary-row"><dt>원본 시험지</dt><dd>원본 ${paper.sourceCount}개 시험지</dd></div></dl><div class="unit-summary-emphasis">${readyShelf() ? "수록 문항" : "조건에 맞는 문항"}<strong>${available.toLocaleString()}문항</strong></div><section class="unit-print-header-editor" aria-labelledby="unit-print-header-title"><h3 id="unit-print-header-title">시험지 헤더</h3><div class="unit-print-header-fields"><label>제목<input id="unit-print-header-title-input" type="text" maxlength="80" value="${escapeHtml(printHeaderOptions.title)}" oninput="UnitPastExams.updatePrintHeaderOption('title', this.value)"></label><label>우측 문구<input type="text" maxlength="60" value="${escapeHtml(printHeaderOptions.metaRight)}" oninput="UnitPastExams.updatePrintHeaderOption('metaRight', this.value)"></label><label>보조 문구<input type="text" maxlength="120" value="${escapeHtml(printHeaderOptions.subtitle)}" oninput="UnitPastExams.updatePrintHeaderOption('subtitle', this.value)"></label></div><div class="unit-print-header-checks"><label><input type="checkbox"${printHeaderOptions.showNameLine ? ' checked' : ''} onchange="UnitPastExams.updatePrintHeaderOption('showNameLine', this.checked)"> 이름칸</label><label><input type="checkbox"${printHeaderOptions.showScoreLine ? ' checked' : ''} onchange="UnitPastExams.updatePrintHeaderOption('showScoreLine', this.checked)"> 점수칸</label></div></section><div class="unit-confirm-actions"><button type="button" class="unit-btn" onclick="UnitPastExams.goToStep(3)">${readyShelf() ? "권 목록으로" : "구성 수정"}</button><button type="button" class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)"><i class="fa-solid fa-print" aria-hidden="true"></i>일반 출력</button><button type="button" class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>학생에게 출제</button></div></aside></div></section>`;
    const headerEditor = root.querySelector('.unit-print-header-editor');
    headerEditor?.insertAdjacentHTML('afterend', `${renderQuestionEditToggle()}${renderQuestionReplacementPanel(unit, paper)}`);
    loadPreviewPaper(state.previewPaperPosition);
  }

  async function loadPreviewPaper(position) {
    const paper = state.generatedPapers[position];
    const unit = getUnit(state.selectedUnitKey);
    const frameRoot = document.getElementById('unit-preview-frame');
    if (!paper || !unit || !frameRoot) return;
    const token = ++state.previewLoadToken;
    try {
      const { outputEnvelope } = await preparePaper(unit.key, paper.index, null);
      if (token !== state.previewLoadToken || state.workflowStep !== 4) return;
      const url = outputEnvelopeUrl(outputEnvelope, true);
      frameRoot.innerHTML = `<iframe id="unit-preview-iframe" title="${escapeHtml(paper.title)} 실제 문제지 미리보기" src="${escapeHtml(url.toString())}" onload="UnitPastExams.tunePreviewFrame()"></iframe>`;
    } catch (error) {
      if (token !== state.previewLoadToken) return;
      frameRoot.innerHTML = `<div class="unit-error">${escapeHtml(error.message || '문제지 미리보기를 불러오지 못했습니다.')}</div>`;
    }
  }

  function tunePreviewFrame() {
    const frame = document.getElementById('unit-preview-iframe');
    const doc = frame?.contentDocument;
    if (!doc) return;
    if (!doc.getElementById('unit-preview-style')) {
      const style = doc.createElement('style');
      style.id = 'unit-preview-style';
      style.textContent = '#mode-ctrl,#fast-print-dialog{display:none!important}body{padding-top:0!important;background:#eef1f5!important}#print-area{padding:18px 0!important;gap:14px!important}.page{box-shadow:0 4px 18px rgba(15,23,42,.12)!important}@media(max-width:640px){body.screen-fit-mode #print-area{margin-left:0!important;margin-right:0!important;transform-origin:top left!important}}';
      doc.head.appendChild(style);
    }
    doc.body.classList.add('screen-fit-mode');
    if (!doc.getElementById('unit-question-edit-style')) {
      const style = doc.createElement('style');
      style.id = 'unit-question-edit-style';
      style.textContent = '#print-area.unit-question-edit-mode .q-box{cursor:pointer;outline:1px dashed transparent;outline-offset:2px}#print-area.unit-question-edit-mode .q-box:hover{outline:2px solid rgba(240,108,62,.6)}#print-area.unit-question-edit-mode .q-box.unit-question-edit-selected{outline:3px solid #f06c3e;outline-offset:2px;background:rgba(240,108,62,.06)}';
      doc.head.appendChild(style);
    }
    bindPreviewQuestionSelection(doc);
    schedulePreviewQuestionBinding(frame);
    frame.contentWindow?.updateScreenFitScale?.();
    const paper = getActivePreviewPaper();
    const unit = getUnit(state.selectedUnitKey);
    if (paper && unit) {
      const headerRequest = frame.contentWindow?.setPrintHeaderOptions?.({ ...ensurePaperPrintHeaderOptions(unit, paper) });
      headerRequest?.finally?.(() => syncPreviewQuestionEditMode());
    }
    syncPreviewQuestionEditMode();
  }

  function selectPreviewPaper(position) {
    const next = Math.min(state.generatedPapers.length - 1, Math.max(0, Number(position || 0)));
    if (next === state.previewPaperPosition) return;
    state.previewPaperPosition = next;
    resetQuestionReplacementState();
    renderWorkflow();
  }

  function renderDetail(unitKey, options = {}) {
    if (readyShelf()) { gridFocusUnit(unitKey); return; }
    const unit = getUnit(unitKey);
    if (!unit || !unit.selectableCount) {
      setStatus('현재 자동출제 가능한 문항이 없습니다.', true);
      return;
    }
    state.selectedUnitKey = unitKey;
    const params = new URLSearchParams(window.location.search);
    if (options.restore || !state.filterState || state.filterState.unitKey !== unitKey) {
      state.filterState = { ...getDefaultFilterState(unit), unitKey };
      state.shelfSteps = options.restore ? readStepsFromUrl() : [];
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
    if (readyShelf()) { renderGrid(); return; }
    const root = document.getElementById('unit-content');
    state.workflowStep = 1;
    renderStepper();
    const gradeIds = ['m1', 'm2', 'm3', 'h1', 'h2', 'h3'];
    if (!state.profileId) {
      const grades = gradeIds.map(profileId => {
        const item = core.getProfile(profileId);
        return '<button type="button" class="unit-grade-card" data-profile="' + profileId + '" onclick="UnitPastExams.selectProfile(\'' + profileId + '\')"><strong>' + escapeHtml(item.gradeLabel) + '</strong></button>';
      }).join('');
      root.innerHTML = '<section class="unit-catalog"><div class="unit-catalog-head"><div><h2>학년을 선택하세요</h2></div></div><div class="unit-grade-cards">' + grades + '</div></section>';
      setStatus('학년을 선택해 주세요.');
      return;
    }

    const profile = getProfile();
    const subjectLabel = state.semanticSubject ? (core.highSemanticSubjectOptions().find(item => item.value === state.semanticSubject)?.label || state.semanticSubject) : '';
    const current = '<div class="unit-current-choice"><button type="button" class="unit-context-choice" onclick="UnitPastExams.clearProfileSelection()">' + escapeHtml(profile.gradeLabel) + '</button>' +
      (subjectLabel ? '<button type="button" class="unit-context-choice" onclick="UnitPastExams.clearSemanticSubject()">' + escapeHtml(subjectLabel) + '</button>' : '') + '</div>';

    if (core.isHighSemanticProfile(profile) && !state.semanticSubject) {
      const subjects = core.highSemanticSubjectOptions().map(subject => {
        const units = state.catalog.units.filter(unit => core.highSemanticSubjectForCourseKey(unit.course) === subject.value);
        const count = units.reduce((sum, item) => sum + item.selectableCount, 0);
        const papers = units.reduce((sum, item) => sum + item.papers.length, 0);
        return '<button type="button" class="unit-subject-card' + (count ? '' : ' is-empty') + '"' + (count ? ' onclick="UnitPastExams.selectSemanticSubject(\'' + subject.value + '\')"' : ' disabled') + '><strong>' + escapeHtml(subject.label) + '</strong><span>' + count.toLocaleString() + '문항 · ' + papers.toLocaleString() + '개 문제지</span></button>';
      }).join('');
      root.innerHTML = '<section class="unit-catalog">' + current + '<div class="unit-catalog-head"><div><h2>과목을 선택하세요</h2></div></div><div class="unit-subject-grid">' + subjects + '</div></section>';
      return;
    }

    const visibleCourses = core.isHighSemanticProfile(profile)
      ? profile.courses.filter(course => core.highSemanticSubjectForCourseKey(course) === state.semanticSubject)
      : profile.courses;
    const courses = visibleCourses.map(course => {
      const units = state.catalog.units.filter(unit => unit.course === course);
      const count = units.reduce((sum, item) => sum + item.selectableCount, 0);
      const rows = units.map(unit => '<button class="unit-card' + (unit.selectableCount ? '' : ' is-empty') + (state.selectedUnitKey === unit.key ? ' is-active' : '') + '" data-unit-key="' + unit.key + '" aria-pressed="' + (state.selectedUnitKey === unit.key ? 'true' : 'false') + '" ' + (unit.selectableCount ? 'onclick="UnitPastExams.renderDetail(\'' + unit.key + '\')"' : 'disabled') + '><span class="unit-card-no">' + String(unit.order).padStart(2, '0') + '</span><h3>' + escapeHtml(unit.name) + '</h3><span class="unit-card-meta"><span>' + unit.selectableCount.toLocaleString() + '문항</span><span>' + (unit.papers.length ? unit.papers.length + '개 문제지' : '자료 없음') + '</span></span></button>').join('');
      return '<section class="unit-course"><div class="unit-course-head"><h3>' + escapeHtml(course) + '</h3><span>' + count.toLocaleString() + '문항</span></div><div class="unit-grid">' + rows + '</div></section>';
    }).join('');
    root.innerHTML = '<section class="unit-catalog">' + current + '<div class="unit-catalog-head"><div><h2>단원을 선택하세요</h2></div></div>' + courses + '</section>';

    const params = new URLSearchParams(window.location.search);
    const requestedUnit = core.resolveUnitKeyAlias(state.profileId, params.get('unit'));
    if (!state.selectedUnitKey && requestedUnit && state.catalog.units.some(unit => unit.key === requestedUnit && unit.selectableCount > 0)) renderDetail(requestedUnit, { noScroll: true, restore: true });
  }

  function updateProfileChrome() {
    const profile = getProfile(); document.title = `${profile.title} · JS 아카이브`; document.getElementById('unit-kicker').textContent = `${profile.gradeLabel} · 2022 개정 교육과정`; document.getElementById('unit-title').textContent = '단원별 기출';
    document.querySelectorAll('[data-profile]').forEach(button => { button.classList.toggle('is-active', button.dataset.profile === state.profileId); button.setAttribute('aria-selected', button.dataset.profile === state.profileId ? 'true' : 'false'); });
  }
  function renderSummary() {
    const catalog = state.catalog;
    const summary = document.getElementById('unit-summary');
    if (summary) summary.textContent = `${catalog.selectableCount.toLocaleString()}문항 · ${catalog.units.length}개 단원`;
    const reviewText = catalog.review.length ? ` · 단원 미확정 ${catalog.review.length}문항` : '';
    const excludedText = catalog.excludedFromAutomaticCount ? ` · 원본 확인 실패로 제외 ${catalog.excludedFromAutomaticCount}문항` : '';
    const approvedText = ` (승인 메타 ${catalog.approvedCount.toLocaleString()}문항)`;
    const metadataText = state.metadataError ? ' · Meta Foundation 연결 실패로 승인 메타 정보 없이 일반 출제합니다' : '';
    setStatus(
      `원본 ${catalog.scannedCount.toLocaleString()}문항 중 분류 ${catalog.classifiedCount.toLocaleString()}문항 · 출제 가능 ${catalog.selectableCount.toLocaleString()}문항${approvedText}${reviewText}${excludedText}${metadataText}. 최신 연도(2026년, 2025년 순)부터 선택하고 같은 연도에서는 승인 메타 문항을 먼저 씁니다.`,
      state.metadataError
    );
  }
  function renderSafeFallback(message) {
    const app = document.getElementById('unit-content');
    if (!app) return;
    setStatus('');
    app.innerHTML = `<div class="unit-error unit-fallback"><strong>단원별 출제 도구를 불러오지 못했습니다.</strong><br>${escapeHtml(message || '일시적인 로딩 오류입니다.')}<div class="unit-fallback-actions"><a class="unit-btn" href="index.html?legacy=1">기존 아카이브 전체 문제지로 이동</a><a class="unit-btn" href="mixer.html">기존 믹서 출제로 이동</a></div></div>`;
  }
  function clearProfileSelection(options = {}) {
    if (readyShelf()) { gridClearGrade(options); return; }
    if (state.busyKey) return;
    state.profileId = '';
    state.semanticSubject = '';
    state.catalog = null;
    state.selectedUnitKey = '';
    state.filterState = null;
    state.collectionState = null;
    state.generatedPapers = [];
    resetQuestionReplacementState({ disableEditMode: true });
    state.workflowStep = 1;
    const url = new URL(window.location.href);
    ['grade','semanticSubject','unit','step','steps','subUnit','difficulty','mode','preset','count','seed','includeUnclassified','adjacentDifficulty','blueprint'].forEach(key => url.searchParams.delete(key));
    if (!options.fromPopstate) history.pushState(null, '', url.toString());
    document.title = '단원별 기출 · JS 아카이브';
    const kicker = document.getElementById('unit-kicker'); if (kicker) kicker.textContent = '2022 개정 교육과정';
    const summary = document.getElementById('unit-summary'); if (summary) summary.textContent = '';
    renderCatalog();
  }

  function clearSemanticSubject(options = {}) {
    if (!core.isHighSemanticProfile(state.profileId) || state.busyKey) return;
    state.semanticSubject = '';
    state.selectedUnitKey = '';
    state.filterState = null;
    state.collectionState = null;
    state.generatedPapers = [];
    const url = new URL(window.location.href);
    ['semanticSubject','unit','step','steps','subUnit','difficulty','mode','preset','count','seed','includeUnclassified','adjacentDifficulty','blueprint'].forEach(key => url.searchParams.delete(key));
    if (!options.fromPopstate) history.pushState(null, '', url.toString());
    renderCatalog();
  }

  function selectSemanticSubject(subjectValue, options = {}) {
    if (!core.isHighSemanticProfile(state.profileId) || state.busyKey) return;
    if (!core.highSemanticSubjectOptions().some(item => item.value === subjectValue)) return;
    state.semanticSubject = subjectValue;
    state.selectedUnitKey = '';
    state.filterState = null;
    state.collectionState = null;
    state.generatedPapers = [];
    const url = new URL(window.location.href);
    url.searchParams.set('semanticSubject', subjectValue);
    ['unit','step','steps','subUnit','difficulty','mode','preset','count','seed','includeUnclassified','adjacentDifficulty','blueprint'].forEach(key => url.searchParams.delete(key));
    if (!options.fromPopstate) history.pushState(null, '', url.toString());
    renderCatalog();
  }

  function selectProfile(profileId, options = {}) {
    if (readyShelf()) { gridSelectGrade(profileId, options); return; }
    if (!core.PROFILES[profileId] || state.busyKey) return;
    const profileChangedAfterInitialLoad = Boolean(state.profileId) && state.profileId !== profileId;
    state.profileId = profileId;
    state.semanticSubject = '';
    state.selectedUnitKey = '';
    state.filterState = null;
    state.collectionState = null;
    state.generatedPapers = [];
    resetQuestionReplacementState({ disableEditMode: true });
    state.workflowStep = 1;
    state.sourceMode = 'archive';
    state.previewPaperPosition = 0;
    state.previewLoadToken += 1;
    const url = new URL(window.location.href);
    url.searchParams.set('grade', profileId);
    if (profileChangedAfterInitialLoad) ['semanticSubject','unit','step','steps','subUnit','difficulty','mode','preset','count','seed','includeUnclassified','adjacentDifficulty','blueprint','collection','collectionScope','collectionStart','collectionEnd','collectionYearMode','collectionYear','collectionYearCount','collectionYearFrom','collectionYearTo','collectionSemester','collectionExamType','collectionSchools','collectionOutput','collectionCountMode','collectionCount','collectionSubUnit','collectionDifficulty','collectionIncludeUnclassified'].forEach(key => url.searchParams.delete(key));
    if (!options.fromPopstate) {
      const updateHistory = profileChangedAfterInitialLoad ? history.pushState.bind(history) : history.replaceState.bind(history);
      updateHistory(null, '', url.toString());
    }
    try {
      state.catalog = core.buildCatalog(state.index.length ? state.index : window.questionIndex, { profileId });
      const params = new URLSearchParams(window.location.search);
      if (core.isHighSemanticProfile(profileId)) {
        const requestedSubject = params.get('semanticSubject') || '';
        if (core.highSemanticSubjectOptions().some(item => item.value === requestedSubject)) state.semanticSubject = requestedSubject;
        else {
          const requestedUnit = core.resolveUnitKeyAlias(profileId, params.get('unit'));
          const requested = state.catalog.units.find(item => item.key === requestedUnit);
          if (requested) state.semanticSubject = core.highSemanticSubjectForCourseKey(requested.course);
        }
      }
      updateProfileChrome();
      renderSummary();
      renderCatalog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      renderSafeFallback(error.message || '단원 목록 집계에 실패했습니다.');
    }
  }

  function restoreFromUrl() {
    if (readyShelf()) { gridRestoreFromUrl(); return; }
    const params = new URLSearchParams(window.location.search);
    const requestedGrade = params.get('grade');
    if (!requestedGrade) {
      clearProfileSelection({ fromPopstate: true });
      return;
    }
    if (core.PROFILES[requestedGrade] && requestedGrade !== state.profileId) {
      selectProfile(requestedGrade, { fromPopstate: true });
      return;
    }
    if (core.isHighSemanticProfile(state.profileId)) {
      const requestedSubject = params.get('semanticSubject') || '';
      if (requestedSubject !== state.semanticSubject && core.highSemanticSubjectOptions().some(item => item.value === requestedSubject)) {
        selectSemanticSubject(requestedSubject, { fromPopstate: true });
        return;
      }
      if (!requestedSubject && state.semanticSubject) {
        clearSemanticSubject({ fromPopstate: true });
        return;
      }
    }
    const requestedUnit = core.resolveUnitKeyAlias(state.profileId, params.get('unit'));
    if (requestedUnit && state.catalog?.units.some(unit => unit.key === requestedUnit)) renderDetail(requestedUnit, { noScroll: true, restore: true });
    else if (state.catalog) {
      state.selectedUnitKey = '';
      state.filterState = null;
      state.collectionState = null;
      state.sourceMode = 'archive';
      state.workflowStep = 1;
      clearSelectionPreview();
      renderCatalog();
    }
  }

  async function init() {
    const app = document.getElementById('unit-content');
    if (!core) { renderSafeFallback('단원 집계 모듈을 불러오지 못했습니다.'); return; }
    if (!isTeacherSession()) { renderLoginRequired(app); return; }
    if (!Array.isArray(window.questionIndex)) { renderSafeFallback('question-index.js를 불러오지 못했습니다.'); return; }
    try {
      try { await loadMetadata(); } catch (error) { state.metadataError = true; console.warn(error); }
      state.index = joinApprovedMetadata(window.questionIndex);
      if (readyShelf()) { gridInit(); return; }
      const requested = new URLSearchParams(window.location.search).get('grade');
      if (core.PROFILES[requested]) selectProfile(requested);
      else { state.profileId = ''; state.catalog = null; renderCatalog(); }
    } catch (error) {
      // 렌더 중 예외가 나도 "집계하는 중"에서 멈추지 않게 원인과 다음 행동을 보여 준다.
      console.error(error);
      renderSafeFallback(`화면을 만드는 중 오류가 발생했습니다. 새로고침(F5)해 다시 시도해 주세요. (${error?.message || '알 수 없는 오류'})`);
    }
  }
  function renderLoginRequired(app) {
    // 안내는 이 상자 한 번만 보인다(상태 줄은 비운다). 로그인은 같은 출처의 AP Math OS(`../apmath/`)에서 하고,
    // 로그인 정보는 localStorage(APMATH_SESSION)로 공유되므로 돌아와 "로그인 후 다시 확인"을 누르면 된다.
    setStatus('');
    app.innerHTML = '<section class="unit-login-required" aria-labelledby="unit-login-title"><h2 id="unit-login-title">선생님 로그인이 필요합니다</h2><p>단원별 기출은 AP Math OS 선생님 계정으로 로그인한 뒤 사용할 수 있습니다. 로그인 창에서 로그인한 다음 이 화면으로 돌아와 &lsquo;로그인 후 다시 확인&rsquo;을 눌러 주세요.</p><div class="unit-login-actions"><a class="unit-btn primary" href="../apmath/" target="_blank" rel="noopener">선생님 로그인</a><button type="button" class="unit-btn" onclick="location.reload()">로그인 후 다시 확인</button><a class="unit-btn ghost" href="index.html">아카이브로 돌아가기</a></div></section>';
  }
  // ---- 단원 x 단계 표 (unit-past-exams.html?ready=1) ------------------------------------------------
  // 사용자 결정 2026-11-10: 학년을 고르면 단원(행) x 난이도 1~5단계(열) 표가 한 화면에 나오고, 칸을 눌러 여러
  // 단원·여러 단계를 한꺼번에 골라 바로 문제지(권)를 만든다. 기본은 고른 칸의 문항 전부이고 "칸마다 N문항"은
  // 선택 사항이다. 문항이 모자란 칸은 막지 않고 있는 만큼만 넣는다(core.buildSelectionPapers).
  const GRID_STORAGE_KEY = 'archive2.unitGrid.v1';
  const GRID_UNIT_KEY = '__grid__';
  const GRID_GRADE_IDS = ['m1', 'm2', 'm3', 'h1', 'h2', 'h3'];
  const GRID_STEPS = ['1', '2', '3', '4', '5'];
  const GRID_ORDERS = [['recent', '최신 연도부터'], ['unit', '단원별로'], ['step', '쉬운 단계부터']];
  const GRID_PER_CELL_MAX = 50;
  const G = {
    profileId: '', course: '', cells: new Set(), checked: new Set(), amount: 'all', perCell: 10, order: 'recent',
    view: 'grid', counts: {}, showNone: false, result: null, catalogs: new Map(), saved: new Map(), papersPushed: false, editing: '', editPushed: false
  };

  function gridKey(unitKey, token) { return `${unitKey}|${token}`; }
  function gridReadStore() {
    try {
      const value = JSON.parse(localStorage.getItem(GRID_STORAGE_KEY) || 'null');
      return value && typeof value === 'object' ? value : null;
    } catch (error) { return null; }
  }
  function gridWriteStore() {
    try {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({
        v: 1, profileId: G.profileId, course: G.course, cells: [...G.cells], checked: [...G.checked],
        amount: G.amount, perCell: G.perCell, order: G.order
      }));
    } catch (error) { /* 기억하지 못해도 화면은 정상 동작한다 */ }
  }
  function gridApplyStoredOptions(stored) {
    if (!stored) return;
    if (stored.amount === 'all' || stored.amount === 'each') G.amount = stored.amount;
    const per = Math.floor(Number(stored.perCell));
    if (Number.isFinite(per) && per >= 1) G.perCell = Math.min(GRID_PER_CELL_MAX, per);
    if (GRID_ORDERS.some(([id]) => id === stored.order)) G.order = stored.order;
  }
  function gridApplyStoredSelection(stored) {
    const known = new Set((state.catalog?.units || []).map(unit => unit.key));
    const profileId = state.profileId || G.profileId || 'h1';
    for (const key of Array.isArray(stored.cells) ? stored.cells : []) {
      const [storedUnitKey, token] = String(key).split('|');
      const unitKey = core.resolveUnitKeyAlias(profileId, storedUnitKey);
      if (known.has(unitKey) && (G.counts[unitKey]?.[token] || 0) > 0) G.cells.add(gridKey(unitKey, token));
    }
    for (const storedUnitKey of Array.isArray(stored.checked) ? stored.checked : []) {
      const unitKey = core.resolveUnitKeyAlias(profileId, storedUnitKey);
      if (known.has(unitKey)) G.checked.add(unitKey);
    }
  }
  function gridCatalogFor(profileId) {
    let entry = G.catalogs.get(profileId);
    if (!entry) {
      const catalog = core.buildCatalog(state.index.length ? state.index : window.questionIndex, { profileId });
      entry = { catalog, counts: core.countGrid(catalog.units) };
      G.catalogs.set(profileId, entry);
    }
    return entry;
  }
  function gridCourseUnits() { return (state.catalog?.units || []).filter(unit => unit.course === G.course); }
  function gridCourseTotal(course) { return (state.catalog?.units || []).filter(unit => unit.course === course).reduce((sum, unit) => sum + (G.counts[unit.key]?.total || 0), 0); }
  function gridCourses() { return state.profileId ? getProfile().courses : []; }
  function gridPickCourse(requested, unitKey) {
    const courses = gridCourses();
    const unit = unitKey ? (state.catalog?.units || []).find(item => item.key === unitKey) : null;
    if (unit && courses.includes(unit.course)) return unit.course;
    if (requested && courses.includes(requested)) return requested;
    if (G.course && courses.includes(G.course)) return G.course;
    return courses.find(course => gridCourseTotal(course) > 0) || courses[0] || '';
  }
  function gridHasPapers() { return Boolean(G.result && G.result.papers.length); }
  function gridPseudoUnit() {
    const result = G.result;
    if (!result || !result.papers.length) return undefined;
    return { key: result.snapshotUnitKey, name: result.unitLabel, course: result.courses.join(' · '), selectableRecords: [], records: [] };
  }
  function gridRecompute() {
    try {
      G.result = core.buildSelectionPapers([...G.cells].map(key => { const [unitKey, step] = key.split('|'); return { unitKey, step }; }), {
        units: state.catalog ? state.catalog.units : [], perCell: G.amount === 'each' ? G.perCell : null, order: G.order
      });
    } catch (error) { console.error(error); G.result = null; }
    if (!gridHasPapers()) G.view = 'grid';
    gridWriteStore();
  }
  function gridSyncUrl(mode) {
    const url = new URL(window.location.href);
    ['unit', 'step', 'steps', 'semanticSubject'].forEach(key => url.searchParams.delete(key));
    if (G.profileId) url.searchParams.set('grade', G.profileId); else url.searchParams.delete('grade');
    if (G.profileId && gridCourses().length > 1 && G.course) url.searchParams.set('course', G.course); else url.searchParams.delete('course');
    if (G.view === 'papers' || G.view === 'edit') url.searchParams.set('view', G.view); else url.searchParams.delete('view');
    if (G.view === 'edit' && G.editing) url.searchParams.set('paper', G.editing.replace(/^grid-/, '')); else url.searchParams.delete('paper');
    if (mode === 'push') history.pushState(null, '', url.toString());
    else if (mode === 'replace') history.replaceState(null, '', url.toString());
  }
  function gridChrome() {
    const kicker = document.getElementById('unit-kicker');
    const summary = document.getElementById('unit-summary');
    if (!G.profileId || !state.catalog) {
      document.title = '단원별 기출 · JS 아카이브';
      if (kicker) kicker.textContent = '2022 개정 교육과정';
      if (summary) summary.textContent = '';
      return;
    }
    const profile = getProfile();
    document.title = `${profile.title} · JS 아카이브`;
    if (kicker) kicker.textContent = `${profile.gradeLabel} · 2022 개정 교육과정`;
    renderSummary();
  }

  function gridInit() {
    const stepper = document.getElementById('unit-stepper');
    if (stepper) { stepper.hidden = true; stepper.innerHTML = ''; }
    const stored = gridReadStore();
    gridApplyStoredOptions(stored);
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('grade');
    const profileId = core.PROFILES[requested] ? requested : (stored && core.PROFILES[stored.profileId] ? stored.profileId : '');
    if (!profileId) { gridClearGrade({ fromPopstate: true }); return; }
    gridSelectGrade(profileId, {
      stored, initial: true, course: params.get('course') || stored?.course || '', view: params.get('view'),
      unitKey: core.resolveUnitKeyAlias(profileId, params.get('unit'))
    });
  }
  function gridClearGrade(options = {}) {
    G.profileId = ''; G.course = ''; G.cells = new Set(); G.checked = new Set(); G.result = null; G.view = 'grid';
    state.profileId = ''; state.catalog = null; state.selectedUnitKey = ''; state.generatedPapers = [];
    gridChrome();
    if (!options.fromPopstate) gridSyncUrl('push');
    renderGrid();
  }
  function gridSelectGrade(profileId, options = {}) {
    if (!core.PROFILES[profileId] || state.busyKey) return;
    let entry;
    try { entry = gridCatalogFor(profileId); } catch (error) {
      console.error(error);
      renderSafeFallback(error.message || '단원 목록 집계에 실패했습니다.');
      return;
    }
    const changed = G.profileId !== profileId;
    // 학년을 바꿔도 이 화면을 떠나기 전에는 학년마다 고른 칸을 기억해 뒤로 가기로 돌아오면 그대로 보인다.
    if (changed && G.profileId) G.saved.set(G.profileId, { cells: G.cells, checked: G.checked });
    G.profileId = state.profileId = profileId;
    state.semanticSubject = '';
    state.catalog = entry.catalog;
    G.counts = entry.counts;
    G.showNone = entry.catalog.units.some(unit => G.counts[unit.key].none > 0);
    if (changed) {
      const kept = G.saved.get(profileId);
      G.cells = kept ? kept.cells : new Set();
      G.checked = kept ? kept.checked : new Set();
      G.result = null; G.view = 'grid';
    }
    if (options.stored && options.stored.profileId === profileId) gridApplyStoredSelection(options.stored);
    if (options.unitKey && G.counts[options.unitKey]) G.checked.add(options.unitKey);
    G.course = gridPickCourse(options.course, options.unitKey);
    gridRecompute();
    G.view = options.view === 'papers' && gridHasPapers() ? 'papers' : 'grid';
    gridChrome();
    if (!options.fromPopstate) gridSyncUrl(changed && !options.initial ? 'push' : 'replace');
    renderGrid();
    if (changed && !options.initial && !options.fromPopstate) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function gridRestoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const grade = params.get('grade');
    if (!core.PROFILES[grade]) { gridClearGrade({ fromPopstate: true }); return; }
    const requestedView = params.get('view');
    const view = requestedView === 'papers' || requestedView === 'edit' ? 'papers' : 'grid';
    if (G.editing && requestedView !== 'edit') gridCloseEdit();
    if (grade !== G.profileId) { gridSelectGrade(grade, { fromPopstate: true, course: params.get('course') || '', view }); return; }
    if (gridCourses().includes(params.get('course'))) G.course = params.get('course');
    G.view = view === 'papers' && gridHasPapers() ? 'papers' : 'grid';
    if (requestedView === 'edit' && gridHasPapers() && (G.result.papers.some(paper => paper.gridId === `grid-${params.get('paper')}`))) {
      gridOpenEdit(`grid-${params.get('paper')}`, { fromPopstate: true });
      return;
    }
    renderGrid();
  }
  // 예전 주소(?unit=...)나 단원 카드로 들어오면 그 단원을 체크한 표를 보여 준다.
  function gridFocusUnit(unitKey) {
    const resolved = core.resolveUnitKeyAlias(state.profileId || 'h1', unitKey);
    if (!G.counts[resolved]) return;
    G.checked.add(resolved);
    G.course = gridPickCourse('', resolved);
    G.view = 'grid';
    gridRecompute();
    renderGrid();
  }

  // ---- 표 그리기 ----
  function gridApplyTargets() {
    const checked = (state.catalog?.units || []).filter(unit => G.checked.has(unit.key));
    return checked.length ? checked : gridCourseUnits();
  }
  function gridStepPressed(token, targets) {
    const open = targets.filter(unit => (G.counts[unit.key]?.[token] || 0) > 0);
    return open.length > 0 && open.every(unit => G.cells.has(gridKey(unit.key, token)));
  }
  function gridCellHtml(unit, token, reports) {
    const total = G.counts[unit.key]?.[token] || 0;
    const caption = token === 'none' ? '미지정' : `${token}단계`;
    const stepName = core.stepTokenLabel(token);
    if (!total) return `<span class="ug-cell is-zero"><span class="ug-n">0</span><span class="ug-cap">${caption}</span><span class="unit-visually-hidden">${escapeHtml(unit.name)} ${stepName} 문항 없음</span></span>`;
    const key = gridKey(unit.key, token);
    const on = G.cells.has(key);
    const report = on ? reports.get(key) : null;
    const each = on && G.amount === 'each' && report;
    const take = each ? report.got : total;
    const short = Boolean(each && report.got < G.perCell);
    const shown = each ? `<span class="ug-n">${take}</span><span class="ug-of">/${total}</span>` : `<span class="ug-n">${total}</span>`;
    let label = `${unit.name} ${stepName} ${total}문항`;
    if (on) label += each ? `, ${take}문항 뽑음${short ? ', 모자라서 있는 만큼만' : ''}` : ', 선택됨';
    return `<button type="button" class="ug-cell${on ? ' is-on' : ''}${short ? ' is-short' : ''}" data-focus="c:${key}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${escapeHtml(label)}" onclick="UnitPastExams.gridToggleCell('${unit.key}','${token}')">${shown}<span class="ug-cap">${caption}</span></button>`;
  }
  function gridTableHtml() {
    const units = gridCourseUnits();
    const reports = new Map((G.result?.cells || []).map(cell => [gridKey(cell.unitKey, cell.step), cell]));
    const tokens = G.showNone ? [...GRID_STEPS, 'none'] : GRID_STEPS;
    const targets = gridApplyTargets();
    const checkedCount = (state.catalog?.units || []).filter(unit => G.checked.has(unit.key)).length;
    const scopeText = checkedCount ? `체크한 단원 ${checkedCount}개 전체에` : '체크가 없으면 보이는 모든 단원에';
    const stepButton = (token, prefix = 'a') => `<button type="button" class="ug-allstep" data-focus="${prefix}:${token}" aria-pressed="${gridStepPressed(token, targets) ? 'true' : 'false'}" aria-label="${token}단계를 ${checkedCount ? '체크한 단원 전체에' : '보이는 모든 단원에'}" onclick="UnitPastExams.gridApplyStep('${token}')">${token}단계</button>`;
    const head = `<tr class="ug-head-row"><th scope="col" class="ug-unit-head"><span class="ug-head-title">단원</span><span class="ug-head-hint">${scopeText}</span></th>${GRID_STEPS.map(token => `<th scope="col" class="ug-step-head">${stepButton(token)}</th>`).join('')}${G.showNone ? '<th scope="col" class="ug-step-head ug-none-head">미지정</th>' : ''}</tr>`;
    const rows = units.map(unit => {
      const checked = G.checked.has(unit.key);
      return `<tr class="ug-row${checked ? ' is-checked' : ''}"><th scope="row" class="ug-unit"><label class="ug-check"><input type="checkbox" data-focus="k:${unit.key}"${checked ? ' checked' : ''} onchange="UnitPastExams.gridToggleUnit('${unit.key}')"><span>${escapeHtml(unit.name)}</span></label></th>${tokens.map(token => `<td class="ug-td">${gridCellHtml(unit, token, reports)}</td>`).join('')}</tr>`;
    }).join('');
    const allbar = `<div class="ug-allbar" role="group" aria-label="체크한 단원 전체에 단계 적용"><span class="ug-allbar-label">${checkedCount ? `체크한 ${checkedCount}개 단원 전체에` : '보이는 모든 단원에'}</span>${GRID_STEPS.map(token => stepButton(token, 'b')).join('')}</div>`;
    return `${allbar}<table class="ug-table" style="--ug-cols:${tokens.length}"><thead>${head}</thead><tbody>${rows || '<tr><td class="ug-empty-row">이 과목에는 단원 정보가 없습니다.</td></tr>'}</tbody></table>`;
  }
  function gridShortText(shortages, limit = 4) {
    const names = new Map((state.catalog?.units || []).map(unit => [unit.key, unit.name]));
    const parts = shortages.slice(0, limit).map(item => `${names.get(item.unitKey) || item.unitKey} ${core.stepTokenLabel(item.step)} ${item.got}문항`);
    return parts.join(', ') + (shortages.length > limit ? ` 외 ${shortages.length - limit}곳` : '');
  }
  function gridMiniTableHtml(result) {
    const used = result.cells.filter(cell => cell.got > 0);
    const tokens = [...new Set(used.map(cell => cell.step))].sort((a, b) => core.STEP_TOKENS.indexOf(a) - core.STEP_TOKENS.indexOf(b));
    const names = new Map((state.catalog?.units || []).map(unit => [unit.key, unit.name]));
    const rows = result.unitKeys.map(unitKey => {
      const counts = tokens.map(token => used.find(cell => cell.unitKey === unitKey && cell.step === token)?.got || 0);
      return `<tr><th scope="row">${escapeHtml(names.get(unitKey) || unitKey)}</th>${counts.map(count => `<td>${count || '-'}</td>`).join('')}<td class="ug-mini-sum">${counts.reduce((sum, count) => sum + count, 0)}</td></tr>`;
    }).join('');
    return `<table class="ug-mini"><thead><tr><th scope="col">단원</th>${tokens.map(token => `<th scope="col">${token === 'none' ? '미지정' : `${token}단계`}</th>`).join('')}<th scope="col">합계</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function gridSummaryHtml() {
    const result = G.result;
    if (!gridHasPapers()) return '<h2 class="ug-sum-title">고른 칸이 없습니다</h2><p class="ug-sum-empty">표에서 단원과 단계가 만나는 칸을 누르세요. 단원을 여러 개 체크한 뒤 단계 버튼을 누르면 한 번에 고를 수 있습니다.</p>';
    const note = result.shortages.length ? `<p class="ug-note">모자란 칸 ${result.shortages.length}곳은 있는 만큼만 넣었습니다. ${escapeHtml(gridShortText(result.shortages))}.</p>` : '';
    return `<div class="ug-sum-block"><h2 class="ug-sum-title">${escapeHtml([result.unitLabel, result.stepLabel].filter(Boolean).join(' · '))}</h2><div class="ug-sum-count"><span class="ug-big">${result.total.toLocaleString()}문항</span><strong>문제지 ${result.papers.length}권</strong></div>${note}${gridMiniTableHtml(result)}</div>`;
  }
  function gridBarHtml() {
    const result = G.result;
    if (!gridHasPapers()) return '<div class="ug-bar-text"><strong class="ug-bar-count">고른 칸이 없습니다</strong><span class="ug-bar-note">단원 칸을 눌러 고르세요</span></div><button type="button" class="ug-primary" disabled>문제지 보기</button>';
    const note = result.shortages.length ? `모자란 칸 ${result.shortages.length}곳은 있는 만큼만` : `${[result.unitLabel, result.stepLabel].filter(Boolean).join(' · ')}`;
    return `<div class="ug-bar-text"><strong class="ug-bar-count">${result.total.toLocaleString()}문항 · ${result.papers.length}권</strong><span class="ug-bar-note">${escapeHtml(note)}</span></div><button type="button" class="ug-primary" onclick="UnitPastExams.gridShowPapers()">문제지 보기</button>`;
  }
  function gridOrdersHtml() {
    return GRID_ORDERS.map(([id, label]) => `<button type="button" class="ug-seg${G.order === id ? ' is-on' : ''}" data-focus="o:${id}" aria-pressed="${G.order === id ? 'true' : 'false'}" onclick="UnitPastExams.gridSetOrder('${id}')">${label}</button>`).join('');
  }
  function gridOptionsNow() {
    return `${G.amount === 'each' ? `칸마다 ${G.perCell}문항씩` : '있는 만큼 전부'} · ${(GRID_ORDERS.find(([id]) => id === G.order) || GRID_ORDERS[0])[1]}`;
  }
  function gridSelectedTotal() {
    let sum = 0;
    for (const key of G.cells) { const [unitKey, token] = key.split('|'); sum += G.counts[unitKey]?.[token] || 0; }
    return sum;
  }
  function gridPatch(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    const focusId = active && typeof active.getAttribute === 'function' && typeof el.contains === 'function' && el.contains(active) ? active.getAttribute('data-focus') : '';
    el.innerHTML = html;
    if (focusId && typeof el.querySelector === 'function') {
      const next = el.querySelector(`[data-focus="${focusId}"]`);
      if (next && typeof next.focus === 'function') next.focus({ preventScroll: true });
    }
  }
  function gridRefresh() {
    gridRecompute();
    gridPatch('ug-table', gridTableHtml());
    gridPatch('ug-sum', gridSummaryHtml());
    gridPatch('ug-bar', gridBarHtml());
    gridPatch('ug-orders', gridOrdersHtml());
    const now = document.getElementById('ug-opt-now');
    if (now) now.textContent = gridOptionsNow();
    const all = document.getElementById('ug-all-count');
    if (all) all.textContent = gridSelectedTotal() ? `(${gridSelectedTotal().toLocaleString()}문항)` : '';
    const go = document.getElementById('ug-go');
    if (go) go.disabled = !gridHasPapers();
    const clear = document.getElementById('ug-clear');
    if (clear) clear.disabled = !G.cells.size && !G.checked.size;
  }
  function gridFineHref() {
    const url = new URL('unit-past-exams.html', window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('grade', G.profileId);
    const first = [...G.cells].map(key => key.split('|')[0])[0] || [...G.checked][0] || gridCourseUnits().find(unit => (G.counts[unit.key]?.total || 0) > 0)?.key || '';
    if (first) url.searchParams.set('unit', first);
    return url.pathname.split('/').pop() + url.search;
  }
  function gridGradeButtons() {
    return `<div class="ug-grades" role="group" aria-label="학년">${GRID_GRADE_IDS.map(id => `<button type="button" class="ug-grade" data-profile="${id}" data-focus="g:${id}" aria-pressed="${G.profileId === id ? 'true' : 'false'}" onclick="UnitPastExams.selectProfile('${id}')">${escapeHtml(core.getProfile(id).gradeLabel)}</button>`).join('')}</div>`;
  }
  function gridCourseButtons() {
    const courses = gridCourses();
    if (courses.length < 2) return '';
    return `<div class="ug-courses" role="group" aria-label="과목">${courses.map((course, index) => `<button type="button" class="ug-seg${course === G.course ? ' is-on' : ''}${gridCourseTotal(course) ? '' : ' is-quiet'}" data-focus="s:${index}" aria-pressed="${course === G.course ? 'true' : 'false'}" onclick="UnitPastExams.gridSetCourse(${index})">${escapeHtml(course)}</button>`).join('')}</div>`;
  }
  function gridTabsHtml() {
    return '<div class="ug-tabs" role="tablist" aria-label="자료 종류"><button type="button" role="tab" class="ug-tab is-on" aria-selected="true">기출</button><button type="button" role="tab" class="ug-tab is-soon" aria-selected="false" aria-disabled="true" aria-describedby="ug-soon-note" tabindex="-1">유사문제</button><button type="button" role="tab" class="ug-tab is-soon" aria-selected="false" aria-disabled="true" aria-describedby="ug-soon-note" tabindex="-1">유사문제 먼저, 기출 다음</button><span class="ug-soon-note" id="ug-soon-note">유사문제 단계 작업이 끝나면 열립니다</span></div>';
  }
  function renderGrid() {
    const root = document.getElementById('unit-content');
    if (!root) return;
    if (G.view === 'edit') {
      if (G.editing && state.generatedPapers.length && getUnit(state.selectedUnitKey)) { renderWorkflow(); return; }
      G.editing = '';
      G.view = gridHasPapers() ? 'papers' : 'grid';
    }
    if (G.view === 'papers' && gridHasPapers()) { renderGridPapers(root); return; }
    const picker = `<div class="ug-pick">${gridGradeButtons()}${gridCourseButtons()}</div>`;
    if (!G.profileId) {
      root.innerHTML = `<section class="ug">${gridTabsHtml()}${picker}<p class="ug-prompt">학년을 고르면 단원과 난이도 단계가 한눈에 보이는 표가 나옵니다.</p></section>`;
      setStatus('학년을 선택해 주세요.');
      return;
    }
    const wide = typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 1360px)').matches;
    const amount = `<fieldset class="ug-amount"><legend>문항 수</legend><label class="ug-radio"><input type="radio" name="ug-amount" value="all"${G.amount === 'all' ? ' checked' : ''} onchange="UnitPastExams.gridSetAmount('all')"><span>있는 만큼 전부 <span class="ug-all-count" id="ug-all-count">${gridSelectedTotal() ? `(${gridSelectedTotal().toLocaleString()}문항)` : ''}</span></span></label><label class="ug-radio ug-radio-each"><input type="radio" name="ug-amount" value="each"${G.amount === 'each' ? ' checked' : ''} onchange="UnitPastExams.gridSetAmount('each')"><span>칸마다</span><span class="ug-stepper"><button type="button" class="ug-step-btn is-minus" aria-label="한 문항 줄이기" onclick="UnitPastExams.gridStepPer(-1)"></button><input id="ug-per" class="ug-per" type="number" inputmode="numeric" min="1" max="${GRID_PER_CELL_MAX}" value="${G.perCell}" aria-label="칸마다 뽑을 문항 수" oninput="UnitPastExams.gridSetPer(this.value)" onfocus="UnitPastExams.gridSetAmount('each', true)"><button type="button" class="ug-step-btn is-plus" aria-label="한 문항 늘리기" onclick="UnitPastExams.gridStepPer(1)"></button></span><span>문항씩</span></label><p class="ug-amount-help">모자란 칸은 막지 않고 있는 만큼만 넣습니다.</p></fieldset>`;
    const options = `<details class="ug-options"${wide ? ' open' : ''}><summary><span class="ug-options-title">문항 수 · 정리 순서</span><span class="ug-options-now" id="ug-opt-now">${escapeHtml(gridOptionsNow())}</span></summary>${amount}<div class="ug-order"><span class="ug-order-title" id="ug-order-title">정리 순서</span><div class="ug-orders" id="ug-orders" role="group" aria-labelledby="ug-order-title">${gridOrdersHtml()}</div></div></details>`;
    root.innerHTML = `<section class="ug">${gridTabsHtml()}${picker}<p class="ug-help">단원 이름 앞 칸을 체크하고 단계 버튼을 누르면 체크한 단원 전체에 한 번에 적용됩니다. 칸을 따로 눌러 단원마다 다르게 고를 수도 있습니다. 칸의 숫자는 기출 문항 수입니다.</p><div class="ug-main"><section class="ug-table-wrap" aria-label="단원과 난이도 단계"><div class="ug-tools"><button type="button" class="ug-link-btn" id="ug-clear" onclick="UnitPastExams.gridClear()"${G.cells.size || G.checked.size ? '' : ' disabled'}>선택 지우기</button></div><div id="ug-table" class="ug-table-box">${gridTableHtml()}</div><p class="ug-legend">검은 칸이 고른 칸입니다. 칸마다 문항 수를 정하면 ‘뽑는 수/있는 수’로 보이고, 주홍 테두리는 문항이 모자라 있는 만큼만 넣은 칸입니다.</p></section><aside class="ug-panel" aria-label="만들어진 문제지"><div class="ug-sum" id="ug-sum">${gridSummaryHtml()}</div>${options}<div class="ug-go"><button type="button" class="ug-primary" id="ug-go" onclick="UnitPastExams.gridShowPapers()"${gridHasPapers() ? '' : ' disabled'}>문제지 보기</button></div></aside></div><p class="ug-fine"><a href="${escapeHtml(gridFineHref())}">세분 출제</a> 소단원·유형·난이도를 직접 정해 한 단원씩 만들 때 쓰는 이전 화면입니다.</p></section><div class="ug-bar" id="ug-bar" role="region" aria-label="만들어진 문제지 요약" aria-live="polite">${gridBarHtml()}</div>`;
    setStatusKeepSummary();
  }
  // 학년을 고른 뒤에는 상태 줄에 집계 요약(renderSummary)이 남아 있어야 하므로 안내 문구만 지운다.
  function setStatusKeepSummary() { if (state.catalog && !state.busyKey) renderSummary(); }

  // ---- 권 목록 ----
  function gridYearText(paper) {
    if (!paper.yearMax) return '연도 미상';
    return paper.yearMax === paper.yearMin ? `${paper.yearMax}년` : `${paper.yearMax}~${paper.yearMin}년`;
  }
  function renderGridPapers(root) {
    const result = G.result;
    const note = result.shortages.length ? `<p class="ug-note">모자란 칸 ${result.shortages.length}곳은 있는 만큼만 넣었습니다. ${escapeHtml(gridShortText(result.shortages, 6))}.</p>` : '';
    const orderLabel = (GRID_ORDERS.find(([id]) => id === result.order) || GRID_ORDERS[0])[1];
    const cards = result.papers.map(paper => {
      const composition = describeStepComposition(paper.stepSummary);
      const label = gridPaperLabel(paper, result.order);
      const facts = [`${paper.count}문항`, `원본 시험지 ${paper.sourceCount}개`];
      if (result.order !== 'recent') facts.push(gridYearText(paper));
      const units = result.unitKeys.length > 1 && result.order !== 'unit' ? `<p class="ug-paper-units">${escapeHtml(paper.unitNames.join(' · '))}</p>` : '';
      const edited = paper.edited ? '<p class="ug-paper-edited">문항을 바꾼 권입니다. 출력·출제에 바꾼 문항이 쓰입니다. 표로 돌아가 선택을 바꾸면 바꾼 내용은 사라집니다.</p>' : '';
      const args = `'${GRID_UNIT_KEY}', '${paper.gridId}', this`;
      return `<li class="ug-paper" data-profile="${G.profileId}"><div class="ug-paper-no"><span class="ug-big">${paper.index}</span><small>권</small></div><div class="ug-paper-info"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(facts.join(' · '))}</p>${composition ? `<p class="ug-paper-steps">${escapeHtml(composition)}</p>` : ''}${units}${edited}</div><div class="ug-paper-actions"><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'exam')" aria-label="${escapeHtml(paper.title)} 시험지">시험지</button><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'sol')" aria-label="${escapeHtml(paper.title)} 해설">해설</button><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'ans')" aria-label="${escapeHtml(paper.title)} 정답">정답</button><button type="button" class="ug-btn ug-fix" title="미리 보고, 시험지 헤더와 문항을 고칩니다" onclick="UnitPastExams.gridOpenEdit('${paper.gridId}')" aria-label="${escapeHtml(paper.title)} 미리 보고 고치기">고치기</button><button type="button" class="ug-primary ug-assign" onclick="UnitPastExams.assignPaper(${args})" aria-label="${escapeHtml(paper.title)} 출제">출제</button></div></li>`;
    }).join('');
    // 2권 이상이면 한 번에 모두 출제하는 버튼을 더한다(화면 안 출제 패널일 때만: 옛 iframe 방식은 한 번에 한 권뿐이다).
    const assignAll = result.papers.length > 1 && assignPanelAvailable()
      ? `<button type="button" class="ug-primary ug-assign-all" onclick="UnitPastExams.assignAllPapers(this)">전체 출제 (${result.papers.length}권)</button>` : '';
    root.innerHTML = `<section class="ug ug-papers"><div class="ug-papers-head"><button type="button" class="ug-btn" onclick="UnitPastExams.gridBack()">표로 돌아가기</button><div><h2>${escapeHtml([result.unitLabel, result.stepLabel].filter(Boolean).join(' · '))}</h2><p class="ug-papers-count"><span class="ug-big">${result.total.toLocaleString()}문항</span><strong>문제지 ${result.papers.length}권</strong><span class="ug-papers-order">${escapeHtml(orderLabel)}</span></p></div>${assignAll}</div>${note}<p class="ug-help">한 권은 약 50문항(최대 80문항)으로 나눕니다. 출력이 오래 걸리지 않게 하고, 같은 시험의 문항은 되도록 한 권에 모았습니다.</p><ol class="ug-paper-list" aria-label="문제지 목록">${cards}</ol></section>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---- 동작 ----
  function gridSetCourse(index) {
    const course = gridCourses()[Number(index)];
    if (!course || course === G.course) return;
    G.course = course;
    gridWriteStore();
    gridSyncUrl('replace');
    renderGrid();
  }
  function gridToggleCell(unitKey, token) {
    if (!(G.counts[unitKey]?.[token] > 0)) return;
    const key = gridKey(unitKey, token);
    if (G.cells.has(key)) G.cells.delete(key); else G.cells.add(key);
    gridRefresh();
  }
  function gridToggleUnit(unitKey) {
    if (!G.counts[unitKey]) return;
    if (G.checked.has(unitKey)) G.checked.delete(unitKey); else G.checked.add(unitKey);
    gridRefresh();
  }
  function gridApplyStep(token) {
    if (!GRID_STEPS.includes(String(token))) return;
    const targets = gridApplyTargets().filter(unit => (G.counts[unit.key]?.[token] || 0) > 0);
    if (!targets.length) return;
    const everyOn = targets.every(unit => G.cells.has(gridKey(unit.key, token)));
    for (const unit of targets) {
      const key = gridKey(unit.key, token);
      if (everyOn) G.cells.delete(key); else G.cells.add(key);
    }
    gridRefresh();
  }
  function gridClear() {
    G.cells.clear();
    G.checked.clear();
    gridRefresh();
  }
  function gridSetAmount(mode, fromFocus) {
    const next = mode === 'each' ? 'each' : 'all';
    if (G.amount === next) return;
    G.amount = next;
    const radio = typeof document.querySelector === 'function' ? document.querySelector(`input[name="ug-amount"][value="${next}"]`) : null;
    if (radio) radio.checked = true;
    gridRefresh();
  }
  function gridSetPer(value) {
    const per = Math.floor(Number(value));
    if (!Number.isFinite(per) || per < 1) return;
    G.perCell = Math.min(GRID_PER_CELL_MAX, per);
    const input = document.getElementById('ug-per');
    if (input && per > GRID_PER_CELL_MAX) input.value = String(G.perCell);
    G.amount = 'each';
    const radio = typeof document.querySelector === 'function' ? document.querySelector('input[name="ug-amount"][value="each"]') : null;
    if (radio) radio.checked = true;
    gridRefresh();
  }
  function gridStepPer(delta) {
    const next = Math.min(GRID_PER_CELL_MAX, Math.max(1, G.perCell + Number(delta || 0)));
    const input = document.getElementById('ug-per');
    if (input) input.value = String(next);
    gridSetPer(next);
  }
  function gridSetOrder(order) {
    if (!GRID_ORDERS.some(([id]) => id === order) || G.order === order) return;
    G.order = order;
    gridRefresh();
  }
  function gridShowPapers() {
    if (!gridHasPapers()) return;
    G.view = 'papers';
    G.papersPushed = true;
    gridSyncUrl('push');
    renderGrid();
  }
  function gridBack() {
    if (G.papersPushed) { G.papersPushed = false; history.back(); return; }
    G.view = 'grid';
    gridSyncUrl('replace');
    renderGrid();
  }

  // 권 목록의 줄 제목: 위 머리줄과 같은 말을 되풀이하지 않고, 정리 순서에 맞춰 그 권을 구별해 주는 것을 쓴다.
  // (출력·출제에 넘기는 권 제목 paper.title은 바꾸지 않는다.)
  function gridPaperLabel(paper, order) {
    if (order === 'unit') return paper.unitNames.join(' · ') || paper.title;
    if (order === 'step') return core.selectionStepLabel([...new Set(paper.records.map(record => core.getStepToken(record)))]) || paper.title;
    return gridYearText(paper);
  }

  // ---- 권 고치기: 옛 "시험지 확인" 화면(미리보기·헤더 편집·문항 교체)으로 그 권을 연다 ----
  function gridOpenEdit(gridId, options = {}) {
    const paper = (G.result?.papers || []).find(item => item.gridId === gridId);
    if (!paper) return;
    G.editing = gridId;
    G.view = 'edit';
    state.selectedUnitKey = G.result.snapshotUnitKey;
    state.sourceMode = 'archive';
    resetQuestionReplacementState({ disableEditMode: true });
    // 고치는 동안은 복사본을 쓰고, 권 목록으로 돌아갈 때 바뀐 내용을 그 권에 되돌려 쓴다.
    state.generatedPapers = [{
      ...paper, unitKey: state.selectedUnitKey, index: `generated-${gridId}`, baseSnapshotKey: paper.baseSnapshotKey || paper.snapshotKey,
      records: paper.records.map(record => ({ ...record })), outputEnvelopeCache: undefined,
      printHeaderOptions: paper.printHeaderOptions ? { ...paper.printHeaderOptions } : undefined
    }];
    state.previewPaperPosition = 0;
    state.previewLoadToken += 1;
    state.workflowStep = 4;
    if (!options.fromPopstate) { G.editPushed = true; gridSyncUrl('push'); }
    renderWorkflow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function gridCommitEdit() {
    const edited = state.generatedPapers[0];
    const target = (G.result?.papers || []).find(paper => paper.gridId === G.editing);
    if (!edited || !target) return;
    const records = edited.records;
    const years = records.map(core.getExamYear).filter(year => Number.isInteger(year) && year >= 1900 && year <= 2200);
    Object.assign(target, {
      records, count: records.length, sourceCount: new Set(records.map(record => record.sourceFile)).size,
      snapshotKey: edited.snapshotKey, baseSnapshotKey: edited.baseSnapshotKey, edited: edited.snapshotKey !== edited.baseSnapshotKey,
      stepSummary: core.summarizeSteps(records), yearMin: years.length ? Math.min(...years) : 0, yearMax: years.length ? Math.max(...years) : 0,
      unitNames: (state.catalog?.units || []).filter(unit => records.some(record => record.mappedUnitKey === unit.key)).map(unit => unit.name),
      sections: core.buildSelectionSections(records, target.sectionOptions),
      printHeaderOptions: edited.printHeaderOptions, outputEnvelopeCache: undefined, snapshotGeneratedAt: undefined
    });
  }
  function gridCloseEdit() {
    gridCommitEdit();
    G.editing = '';
    state.generatedPapers = [];
    state.selectedUnitKey = '';
    state.workflowStep = 1;
    state.previewLoadToken += 1;
    resetQuestionReplacementState({ disableEditMode: true });
    G.view = gridHasPapers() ? 'papers' : 'grid';
  }
  function gridLeaveEdit() {
    if (!G.editing) return;
    gridCloseEdit();
    if (G.editPushed) { G.editPushed = false; history.back(); return; }
    gridSyncUrl('replace');
    renderGrid();
  }

  // 화면 안 출제 패널이 열려 있으면 뒤로 가기는 패널이 먼저 처리한다(진행 중이면 막고, 아니면 패널만 닫는다).
  window.addEventListener('popstate', () => {
    if (window.Archive2Assign && typeof window.Archive2Assign.handlePopState === 'function' && window.Archive2Assign.handlePopState()) return;
    restoreFromUrl();
  });
  window.UnitPastExams = { gridOpenEdit, gridLeaveEdit, gridSelectGrade, gridClearGrade, gridSetCourse, gridToggleCell, gridToggleUnit, gridApplyStep, gridClear, gridSetAmount, gridSetPer, gridStepPer, gridSetOrder, gridShowPapers, gridBack, renderGrid, init, selectProfile, clearProfileSelection, selectSemanticSubject, clearSemanticSubject, openFineBuilder, renderDetail, goToStep, selectSourceMode, continueSource, updateDetailFilter, updateStepSelection, generateUnifiedPreview, generatePaper, generateCollectionPapers, updateCollectionFilter, resetCollectionFilter, filterCollectionSchools, selectAllCollectionSchools, clearCollectionSchools, addBlueprintRow, removeBlueprintRow, updateBlueprintRow, resetDetailFilter, reduceRequestedCount, enableAdjacentDifficulty, enableUnclassified, focusSubUnitFilter, selectPreviewPaper, tunePreviewFrame, updatePrintHeaderOption, toggleQuestionEditMode, selectPreviewQuestion, setReplacementFilter, setReplacementCandidatePage, quickReplaceSelectedQuestion, replaceSelectedQuestion, undoLastQuestionReplacement, previewExistingPaper, printPaper, assignPaper, assignAllPapers, restoreFromUrl, renderSafeFallback };
  window.High1UnitPastExams = window.UnitPastExams;
})();
