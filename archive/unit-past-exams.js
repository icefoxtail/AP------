(function () {
  'use strict';

  const core = window.UnitPastExamsCore || window.High1UnitPastExamsCore;
  const PRINT_HEADER_TEXT_LIMITS = { title: 80, metaRight: 60, subtitle: 120 };
  const REPLACEMENT_PAGE_SIZE = 10;
  const state = {
    catalog: null, index: [], profileId: '', semanticSubject: '', selectedUnitKey: '', fileCache: new Map(), busyKey: '',
    metadataLoaded: false, metadataError: false, ready: false, generatedPapers: [],
    previewPaperPosition: 0, previewLoadToken: 0, qpp: '4', pendingProfileId: '',
    questionEditMode: false, selectedQuestionIndex: -1, replacementCandidates: [], replacementCandidatePage: 0,
    replacementFilter: null
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function parseQuestionNo(value) {
    if (core && typeof core.parseQuestionNo === 'function') return core.parseQuestionNo(value);
    if (typeof value === 'number') {
      return Number.isInteger(value) && value > 0 ? value : null;
    }
    if (typeof value === 'string') {
      const match = value.match(/\d+/);
      if (match) {
        const n = Number(match[0]);
        return Number.isInteger(n) && n > 0 ? n : null;
      }
    }
    return null;
  }

  function matchQuestionNo(questionId, targetNo) {
    if (core && typeof core.matchQuestionNo === 'function') return core.matchQuestionNo(questionId, targetNo);
    const a = parseQuestionNo(questionId);
    const b = parseQuestionNo(targetNo);
    return a !== null && b !== null && a === b;
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
  // The teacher rule is shared with the left menu (archive2-session.js) so both always agree.
  function isTeacherSession() {
    return Boolean(window.Archive2Session?.isTeacher(getSession()));
  }
  // 실패 안내는 맨 위 줄에만 두면 표 아래쪽에서 누른 교사가 못 본다. 화면에 고정된 닫을 수 있는 알림으로도 띄운다
  // (문제지 만들기 화면의 오류 알림과 같은 모양, 코드·영어 문구는 그대로 보이지 않게 한다).
  let errorToastEl = null;
  function hideErrorToast() {
    if (errorToastEl && errorToastEl.parentNode) errorToastEl.parentNode.removeChild(errorToastEl);
  }
  function showErrorToast(message) {
    try {
      if (!errorToastEl) {
        const box = document.createElement('div');
        box.className = 'error-toast';
        box.setAttribute('role', 'alert');
        const text = document.createElement('p');
        text.className = 'error-toast-text';
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'error-toast-close';
        close.setAttribute('aria-label', '오류 알림 닫기');
        close.textContent = '닫기';
        close.addEventListener('click', hideErrorToast);
        box.append(text, close);
        errorToastEl = box;
      }
      errorToastEl.firstChild.textContent = message;
      hideErrorToast();
      (document.querySelector('dialog[open]') || document.body).appendChild(errorToastEl);
    } catch (e) { console.warn('[unit-past] error alert unavailable:', e); }
  }
  function setStatus(message, isError = false) {
    const el = document.getElementById('unit-status');
    if (isError) {
      const raw = String(message ?? '');
      const stripped = raw.replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, '');
      message = /[가-힣]/.test(stripped) ? stripped : '작업을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.';
      if (message !== raw) console.warn('[unit-past] error text replaced for display:', raw);
    }
    if (isError && message) showErrorToast(message); else hideErrorToast();
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
      if (meta.sourceQuestionNo !== undefined) {
        const qNo = parseQuestionNo(meta.sourceQuestionNo);
        if (qNo !== null) bySource.set(`${file}#id:${qNo}`, meta);
        bySource.set(`${file}#id:${meta.sourceQuestionNo}`, meta);
      }
    }
    return (Array.isArray(records) ? records : []).map(record => {
      const file = String(record.sourceFile || record._sourceFile || '').replace(/\\/g, '/');
      const recordQNo = parseQuestionNo(record.id ?? record.sourceQuestionNo);
      const meta = bySource.get(`${file}#${record.sourceOrdinal}`) ||
        (recordQNo !== null ? bySource.get(`${file}#id:${recordQNo}`) : undefined) ||
        bySource.get(`${file}#id:${record.id || record.sourceQuestionNo}`);
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
  // 문항 배열 찾기 규칙(questions → questionBank → examData)은 exam-source-reader.js 한 곳에 있다.
  function requireSourceReader() {
    if (!window.ExamSourceReader) throw new Error('exam-source-reader.js를 불러오지 못했습니다. 새로고침해 다시 시도해 주세요.');
    return window.ExamSourceReader;
  }
  // 어느 시험지 몇 번 문항에서 막혔는지 오류에 실어 출제 패널이 그대로 말하게 한다(archive2-error-detail.js, 없어도 동작).
  const markError = (error, detail) => (window.Archive2ErrorDetail ? window.Archive2ErrorDetail.annotate(error, detail) : error);
  function loadQuestionFile(sourceFile) {
    if (state.fileCache.has(sourceFile)) return state.fileCache.get(sourceFile);
    const promise = (async () => {
      const reader = requireSourceReader();
      const candidates = core.getSourceFileCandidates(sourceFile);
      const failures = [];
      for (const candidate of candidates) {
        for (const name of reader.SOURCE_GLOBALS) delete window[name];
        try {
          await loadScript(`exams/${candidate}?v=20260827b`);
        } catch (error) {
          failures.push(`${candidate}: ${error.message || error}`);
          continue;
        }
        const data = reader.readQuestionArray(window);
        if (Array.isArray(data)) return data.map(question => ({ ...question }));
        failures.push(`${candidate}: 문항 배열(questions/questionBank/examData) 없음`);
      }
      const attempted = failures.length > 1 ? ` 시도 경로: ${candidates.join(', ')}` : '';
      throw markError(new Error(`${sourceFile}에서 문항 배열을 찾지 못했습니다.${attempted}`), { file: sourceFile, code: 'SOURCE_BANK_MISSING' });
    })().catch(error => { state.fileCache.delete(sourceFile); throw error; });
    state.fileCache.set(sourceFile, promise);
    return promise;
  }
  // 원본 문항의 번호 칸은 시험지마다 다르다: id(숫자·"Q01"·"s01"), 일부 중등 시험지는 number. 색인 id도 같은 규칙(id ?? number)이다.
  const sourceQuestionKey = question => (question && question.id !== undefined && question.id !== null && question.id !== '' ? question.id : question?.number);
  // 한 문항 찾기: ① 색인 id와 글자 그대로 같은 문항 → ② 번호(숫자)가 같은 문항이 하나뿐이면 그것, 여럿이면 색인 자리(sourceOrdinal)에 있는 것.
  // 번호만 보면 서술형 "s01"이 객관식 1번으로 잡히므로 ①이 먼저다. 둘 다 안 되면 다른 문항을 추측하지 않고 못 찾은 것으로 둔다.
  function findSourceQuestion(questions, record) {
    const rawId = record.id !== undefined && record.id !== null ? String(record.id) : '';
    if (rawId) {
      const exact = questions.find(question => { const key = sourceQuestionKey(question); return key !== undefined && key !== null && String(key) === rawId; });
      if (exact) return exact;
    }
    const sameNo = questions.filter(question => matchQuestionNo(sourceQuestionKey(question), record.sourceQuestionNo));
    if (sameNo.length === 1) return sameNo[0];
    if (sameNo.length > 1) {
      const atSlot = questions[Number(record.sourceOrdinal) - 1];
      if (atSlot && sameNo.includes(atSlot)) return atSlot;
    }
    return null;
  }
  // 문항 하나를 못 찾아도 나머지는 복원한다(한 문항 때문에 문제지 전체가 막히지 않게). 못 찾은 문항은 missing에 담아
  // 부른 쪽이 어느 시험지 몇 번인지 알린다. 복원된 문항이 하나도 없을 때만 예전처럼 오류를 던진다.
  // records는 복원된 문항의 기록이고 questions와 같은 순서다.
  async function restorePaperQuestions(paper) {
    const grouped = new Map();
    paper.records.forEach(record => {
      if (!grouped.has(record.sourceFile)) grouped.set(record.sourceFile, []);
      grouped.get(record.sourceFile).push(record);
    });
    // 서술형 "s01"과 객관식 1번은 sourceQuestionNo가 같으므로 색인 자리(sourceOrdinal)까지 넣어 구분한다.
    const identityKey = record => `${record.sourceFile}#${record.sourceOrdinal ?? ''}#${record.sourceQuestionNo}`;
    const restoredByIdentity = new Map();
    const missing = [];
    for (const [sourceFile, records] of grouped.entries()) {
      const questions = await loadQuestionFile(sourceFile);
      for (const record of records) {
        const original = findSourceQuestion(questions, record);
        if (!original) {
          missing.push({ file: sourceFile, questionNo: record.sourceQuestionNo, ordinal: record.sourceOrdinal, uid: core.getQuestionUid(record), code: 'QUESTION_NOT_FOUND' });
          continue;
        }
        restoredByIdentity.set(identityKey(record), {
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
    const keptRecords = paper.records.filter(record => restoredByIdentity.has(identityKey(record)));
    if (!keptRecords.length && missing.length) {
      const first = missing[0];
      throw markError(new Error(`${first.file}의 ${first.questionNo}번 문항을 찾지 못했습니다.`), first);
    }
    return { questions: keptRecords.map(record => restoredByIdentity.get(identityKey(record))), records: keptRecords, missing };
  }
  // 원본에서 못 찾은 문항이 있어도 나머지로 출력·출제를 잇는다. 쪽 머리(meta.sections)는 문항 자리(at)를 쓰므로
  // 못 찾은 문항을 뺀 기록으로 만든다(원래 문제지 기록은 그대로 둔다).
  async function restoreUsablePaper(paper) {
    const restored = await restorePaperQuestions(paper);
    const usablePaper = restored.missing.length ? Object.assign(Object.create(paper), { records: restored.records }) : paper;
    return { questions: restored.questions, usablePaper, missing: restored.missing };
  }
  // 어느 시험지 몇 번 문항을 뺐는지 한국어로 알린다(화면의 알림 자리: setStatus의 오류 알림).
  function describeMissingQuestions(missing) {
    const named = missing.slice(0, 5).map(item => `${(typeof getSourceExamLabel === 'function' && getSourceExamLabel(item.file)) || String(item.file).split('/').pop()} ${item.questionNo}번`);
    const more = missing.length > named.length ? ` 외 ${missing.length - named.length}문항` : '';
    return `원본 시험지에서 찾지 못한 ${missing.length}문항은 빼고 만들었습니다: ${named.join(', ')}${more}.`;
  }
  function getQpp() {
    const value = String(document.getElementById('unit-qpp')?.value || state.qpp || '4');
    return ['4', '6', '8'].includes(value) ? value : '4';
  }
  function getProfile() { return core.getProfile(state.profileId); }
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
    return undefined;
  }

  function resetQuestionReplacementState(options = {}) {
    state.selectedQuestionIndex = -1;
    state.replacementCandidates = [];
    state.replacementCandidatePage = 0;
    state.replacementFilter = null;
    if (options.disableEditMode) state.questionEditMode = false;
  }
  // 교체 후보는 그 권을 만든 조건 안에서만 찾는다: 그 권의 단계(1~5단계 그대로, 단계 미지정 열을 골랐을 때만 단계 미지정 문항 포함)와
  // 뺀 유형을 따른다. 기본으로 바꿀 문항과 같은 중단원(고등은 소단원 묶음)·같은 단계에서 고르고, 교사가 범위를 넓힐 수 있다.
  function isReplacementRecordAllowed(record, paper) {
    if (!core.isAutomaticSelectable(record)) return false;
    const steps = paper && Array.isArray(paper.difficultySteps) ? paper.difficultySteps : [];
    if (steps.length && !steps.includes(core.getStepToken(record))) return false;
    const keep = paper && Array.isArray(paper.excludedTypeKeys) && paper.excludedTypeKeys.length ? core.createTypeFilter(paper.excludedTypeKeys) : null;
    if (keep && !keep(record)) return false;
    // 조건 줄(학교·연도·시험·학기)로 만든 권은 그 조건 안에서만 바꾼다. 학교별 권이면 그 학교 문항만이다.
    if (paper && paper.sourceFilter && paper.sourceFilter.keep && !paper.sourceFilter.keep(record)) return false;
    if (paper && paper.onlySchoolKey && (core.getSchoolKey(record) || '__unknown__') !== paper.onlySchoolKey) return false;
    return true;
  }
  function getReplacementSourcePool(unit, paper) {
    let records = unit.records;
    // 단원 x 단계 표에서 만든 권: 바꿀 문항이 속한 단원의 문항 중에서 찾는다(여러 단원이 섞인 권도 같은 규칙).
    if (paper.selectionGrouped) {
      const current = paper.records[state.selectedQuestionIndex];
      const owner = current && (state.catalog?.units || []).find(item => item.key === current.mappedUnitKey);
      records = owner ? owner.records : unit.records;
    }
    return records.filter(record => isReplacementRecordAllowed(record, paper));
  }
  function getUsedGeneratedQuestionIdentities() {
    return new Set(state.generatedPapers.flatMap(paper => paper.records || []).map(record => core.getRecordIdentity(record)));
  }
  function replacementChildKey(record) { return G.tree ? G.tree.childKeyOf(record.mappedUnitKey, record) : ''; }
  function getReplacementFilterForRecord(record) {
    return { childKey: replacementChildKey(record), step: core.getStepToken(record) };
  }
  // 중단원(고등은 소단원 묶음) 선택지: 표의 펼침과 같은 이름·순서(Archive2UnitTree).
  function getReplacementSubUnitOptions(records) {
    if (!G.tree) return [];
    const options = new Map();
    for (const record of records) {
      const key = replacementChildKey(record);
      if (key && !options.has(key)) options.set(key, { key, label: G.tree.childName(record.mappedUnitKey, key) || key, rank: G.tree.childRank(record.mappedUnitKey, key) });
    }
    return [...options.values()].sort((a, b) => a.rank - b.rank);
  }
  function compareReplacementRecords(a, b) {
    return core.compareRecords(a, b) || String(core.getRecordIdentity(a)).localeCompare(String(core.getRecordIdentity(b)));
  }
  function getReplacementCandidates(unit, paper, index, filter = state.replacementFilter) {
    const currentIdentity = core.getRecordIdentity(paper.records[index]);
    const used = getUsedGeneratedQuestionIdentities();
    const childKey = filter?.childKey || '';
    const step = filter?.step || '';
    return getReplacementSourcePool(unit, paper)
      .filter(record => {
        if (childKey && replacementChildKey(record) !== childKey) return false;
        if (step && core.getStepToken(record) !== step) return false;
        const identity = core.getRecordIdentity(record);
        return identity !== currentIdentity && !used.has(identity);
      })
      .sort(compareReplacementRecords);
  }
  function rebuildPaperAfterReplacement(unit, paper) {
    paper.count = paper.records.length;
    paper.sourceCount = new Set(paper.records.map(record => record.sourceFile)).size;
    paper.snapshotKey = core.buildSnapshotKey(unit.key, paper.records, state.catalog.scope, paper.selectionGrouped
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
  // 출력·출제에 넘기는 meta(제목·머리글·출처·단원/단계 제목)를 만든다. 문항을 옛 브라우저 저장소 키에 복사하지
  // 않는다: 출력은 출력 포장(Archive2Output), 출제 패널은 문항을 본문에 싣는다.
  function buildMixedMeta(unit, paper, questions) {
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
    return meta;
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
      const { questions, usablePaper, missing } = await restoreUsablePaper(paper);
      const meta = buildMixedMeta(unit, usablePaper, questions);
      const outputEnvelope = await prepareOutputEnvelope(paper, questions, meta);
      if (missing.length) setStatus(`${paper.title} · ${questions.length}문항 준비 완료. ${describeMissingQuestions(missing)}`, true);
      else setStatus(`${paper.title} · ${questions.length}문항 준비 완료`);
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
  // ---- 문제지 만들기에서 열기 (2026-11-22) ----
  // 이 권의 문항을 보관함에 저장하려면 문제지 만들기를 거쳐야 한다. 새 전달 형식 없이 문제지 만들기가 이미 읽는
  // "고른 문항 UID 목록"(workspace.html?view=compose&uid=…, applyUidRoute)으로 넘긴다. 학년이 섞였거나 쓸 수 없는 문항이 있으면
  // 문제지 만들기가 한국어 안내를 보이고, 여기서는 그 앞의 한도(문항 수·주소 길이)만 막는다.
  const COMPOSE_UID_MAX = 400; // archive2-workspace.js UID_ROUTE_MAX와 같은 값
  const COMPOSE_URL_MAX = 7000; // 서버·브라우저 요청 줄 한도(약 8KB)보다 낮게
  function composeEntryUrl(paper) {
    const uids = [...new Set((paper?.records || []).map(record => core.getQuestionUid(record)).filter(Boolean))];
    if (!uids.length) return { error: '이 권의 문항을 알아볼 수 없어 문제지 만들기로 넘길 수 없습니다.' };
    if (uids.length > COMPOSE_UID_MAX) return { error: `문제지 만들기는 한 번에 ${COMPOSE_UID_MAX}문항까지만 받을 수 있습니다. (이 권 ${uids.length}문항)` };
    const url = new URL('workspace.html', window.location.href);
    url.searchParams.set('view', 'compose');
    uids.forEach(uid => url.searchParams.append('uid', uid));
    if (url.href.length > COMPOSE_URL_MAX) return { error: `문항이 많아 문제지 만들기로 한 번에 넘길 수 없습니다. (이 권 ${uids.length}문항) 문항 수를 줄여 다시 만들어 주세요.` };
    return { url: url.href, count: uids.length };
  }
  function openPaperInCompose(unitKey, paperIndex) {
    const paper = getPaper(unitKey, paperIndex);
    if (!paper) { setStatus('문제지를 찾지 못했습니다.', true); return; }
    const entry = composeEntryUrl(paper);
    if (entry.error) { setStatus(entry.error, true); return; }
    // 눌렀을 때 바로 새 창을 연다(팝업 차단을 피하고, 이 권 목록은 그대로 둔다). 로그인 세션은 출력 창과 같은 방식으로 넘긴다.
    const popup = window.open(appendSessionHash(entry.url), '_blank');
    if (!popup) { setStatus('새 창을 열 수 없습니다. 팝업 설정을 확인하세요.', true); return; }
    setStatus(`${paper.title} ${entry.count}문항을 문제지 만들기에서 열었습니다. 열린 창에서 문제지 만들기를 누르면 이 문항 그대로 담기고, 거기서 보관함에 저장합니다.`);
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
    return null; // 토큰이 없으면 헤더가 없다(비밀번호로 대신하지 않는다): 호출한 쪽이 로그인 안내를 낸다.
  }
  // 패널에 꽂는 request(route, {method, headers, body, timeoutMs}). archive2-workspace.js api()와 같은 방식이다:
  // 같은 서버 주소, 같은 세션 인증, 로그인이 없으면 요청 없이 status=401, 제한 시간이 지나면 timeout=true,
  // 오류 응답은 error.status/error.data를 달아 던진다. 읽기 30초·쓰기 150초는 패널이 timeoutMs로 정한다.
  function assignRequest(route, opt = {}) {
    const rule = window.Archive2Session;
    const loggedIn = !rule || !rule.state || rule.state(getSession()).loggedIn;
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
    const { questions, usablePaper, missing } = await restoreUsablePaper(paper);
    const meta = buildMixedMeta(unit, usablePaper, questions);
    if (missing.length) setStatus(describeMissingQuestions(missing), true);
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
    if (papers.length < 2 || !assignPanelAvailable()) return;
    openAssignPanel(papers.map(paper => ({ unitKey: GRID_UNIT_KEY, paperIndex: paper.gridId })), button);
  }
  async function assignPaper(unitKey, paperIndex, button) {
    if (assignPanelAvailable()) { openAssignPanel([{ unitKey, paperIndex }], button); return; }
    // 되돌림 길(주소에 assign=legacy이거나 패널 스크립트가 없을 때): 1.0 출제 화면을 이 페이지 안 iframe으로 연다.
    try {
      const { paper, outputEnvelope } = await preparePaper(unitKey, paperIndex, button);
      const url = new URL('index.html', window.location.href);
      url.searchParams.set('unitPastAssign', paper.snapshotKey); url.searchParams.set('qpp', getQpp());
      url.searchParams.set('archive2Embedded', '1');
      url.searchParams.set('outputRequestId', outputEnvelope.outputRequestId);
      url.searchParams.set('outputOwnerId', outputEnvelope.ownerId);
      openReadyAssignment(url, paper);
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
  // 권 고치기 화면 맨 위 한 줄: 학년 · 과목 · 단원(중단원) · 단계 · 문항 수. 표에서 고른 조건을 그대로 말한다.
  function renderContextStrip(unit, count) {
    const profile = getProfile();
    const stepLabel = G.result?.stepLabel || '';
    const lead = [profile.gradeLabel, unit.course, G.result?.unitLabel || unit.name].filter(Boolean).map(text => `<strong>${escapeHtml(text)}</strong>`);
    const rest = [stepLabel, `${count}문항`].filter(Boolean).map(text => `<span>${escapeHtml(text)}</span>`);
    return `<div class="unit-context-strip">${[...lead, ...rest].join('<span class="unit-context-dot">·</span>')}</div>`;
  }
  function describeStepComposition(summary) {
    if (!summary) return '';
    const parts = core.STEP_TOKENS.filter(token => summary.steps[token]).map(token => `${core.stepTokenLabel(token)} ${summary.steps[token]}`);
    return parts.join(' · ');
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
    if (!state.replacementFilter || !['childKey', 'step'].includes(field)) return;
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
  function replacementRecordText(record) {
    const childName = G.tree ? G.tree.childName(record.mappedUnitKey, replacementChildKey(record)) : '';
    return `${childName || `${gridUnitKindName()} 미지정`} · ${core.stepTokenLabel(core.getStepToken(record))}`;
  }
  function renderQuestionReplacementPanel(unit, paper) {
    if (!state.questionEditMode) return '';
    const panelId = 'unit-question-replacement-panel';
    const index = state.selectedQuestionIndex;
    if (index < 0 || index >= paper.records.length) {
      return `<section id="${panelId}" class="unit-question-replacement-panel"><h3>문항 바꾸기</h3><p class="unit-replacement-empty">왼쪽 미리보기에서 바꿀 문항을 누르세요.</p></section>`;
    }
    const record = paper.records[index];
    const sourcePool = getReplacementSourcePool(unit, paper);
    const filter = state.replacementFilter || getReplacementFilterForRecord(record);
    const kind = gridUnitKindName();
    const childOptions = [{ key: '', label: `전체 ${kind}` }, ...getReplacementSubUnitOptions(sourcePool)]
      .map(option => `<option value="${escapeHtml(option.key)}"${filter.childKey === option.key ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
    // 단계는 1~5단계 그대로: 이 권을 만들 때 고른 단계만 보인다.
    const paperSteps = core.STEP_TOKENS.filter(token => (paper.difficultySteps || []).includes(token));
    const stepOptions = [{ key: '', label: '전체 단계' }, ...paperSteps.map(token => ({ key: token, label: core.stepTokenLabel(token) }))]
      .map(option => `<option value="${escapeHtml(option.key)}"${filter.step === option.key ? ' selected' : ''}>${escapeHtml(option.label)}</option>`).join('');
    const pageCount = Math.max(1, Math.ceil(state.replacementCandidates.length / REPLACEMENT_PAGE_SIZE));
    const page = Math.min(state.replacementCandidatePage, pageCount - 1);
    const pageItems = state.replacementCandidates.slice(page * REPLACEMENT_PAGE_SIZE, (page + 1) * REPLACEMENT_PAGE_SIZE);
    const candidates = pageItems.map(candidate => {
      const candidateIndex = state.replacementCandidates.indexOf(candidate);
      const label = getSourceExamLabel(candidate.sourceFile, candidate) || '출처 확인 필요';
      return `<article class="unit-replacement-candidate"><div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(replacementRecordText(candidate))} · 원본 ${escapeHtml(candidate.sourceQuestionNo || candidate.id || '')}번</span></div><button type="button" class="unit-btn" onclick="UnitPastExams.replaceSelectedQuestion(${candidateIndex})">이 문제로 교체</button></article>`;
    }).join('');
    return `<section id="${panelId}" class="unit-question-replacement-panel"><h3>문항 바꾸기</h3><div class="unit-replacement-selected"><strong>${index + 1}번</strong><span>${escapeHtml(replacementRecordText(record))}</span><small>${escapeHtml(getSourceExamLabel(record.sourceFile, record) || '출처 확인 필요')} · 원본 ${escapeHtml(record.sourceQuestionNo || record.id || '')}번</small></div><div class="unit-replacement-filters"><label>${kind}<select id="unit-replacement-subunit" onchange="UnitPastExams.setReplacementFilter('childKey', this.value)">${childOptions}</select></label><label>단계<select id="unit-replacement-difficulty" onchange="UnitPastExams.setReplacementFilter('step', this.value)">${stepOptions}</select></label></div><div class="unit-replacement-tools"><button type="button" class="unit-btn primary" onclick="UnitPastExams.quickReplaceSelectedQuestion()">같은 조건으로 교체</button><button type="button" class="unit-btn" onclick="UnitPastExams.undoLastQuestionReplacement()"${paper.replacementHistory?.length ? '' : ' disabled'}>교체 되돌리기</button></div><div class="unit-replacement-count">후보 ${state.replacementCandidates.length}문항</div>${candidates || `<p class="unit-replacement-empty">조건에 맞는 다른 문항이 없습니다. 위에서 ${kind}와 단계를 ‘전체’로 바꿔 보세요.</p>`}${pageCount > 1 ? `<div class="unit-replacement-pagination"><button type="button" class="unit-btn" onclick="UnitPastExams.setReplacementCandidatePage(${page - 1})"${page <= 0 ? ' disabled' : ''}>이전</button><span>${page + 1} / ${pageCount}</span><button type="button" class="unit-btn" onclick="UnitPastExams.setReplacementCandidatePage(${page + 1})"${page >= pageCount - 1 ? ' disabled' : ''}>다음</button></div>` : ''}</section>`;
  }

  function typeFilterText(paper) {
    const count = (paper.excludedTypeKeys || []).length;
    return count ? `유형 ${count}종을 뺐습니다` : '';
  }
  // 권 고치기(표의 권 줄 "고치기")가 여는 화면: 실제 시험지 미리보기 + 시험지 머리글 + 문항 바꾸기.
  function renderWorkflow() {
    const unit = getUnit(state.selectedUnitKey);
    if (!unit) { renderGrid(); return; }
    renderConfirmation(unit);
  }
  function renderConfirmation(unit) {
    const root = document.getElementById('unit-content');
    const paper = getActivePreviewPaper();
    if (!paper) { renderGrid(); return; }
    const printHeaderOptions = ensurePaperPrintHeaderOptions(unit, paper);
    const profile = getProfile();
    const scopeText = (paper.scopeNames && paper.scopeNames.length ? paper.scopeNames : paper.unitNames || []);
    const scopeShown = scopeText.length > 6 ? `${scopeText.slice(0, 6).join(' · ')} 외 ${scopeText.length - 6}곳` : scopeText.join(' · ');
    const stepText = describeStepComposition(core.summarizeSteps(paper.records)) || '단계 정보 없음';
    const filterText = typeFilterText(paper);
    const rows = [
      ['범위', `${profile.gradeLabel} · ${unit.course} · ${scopeShown || unit.name}`],
      ['단계별 문항', stepText],
      ...(filterText ? [['유형', filterText]] : []),
      ['문항 수', `${paper.count}문항`],
      ['원본 시험지', `${paper.sourceCount}개`]
    ].map(([label, value]) => `<div class="unit-summary-row"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    const pager = state.generatedPapers.length > 1 ? `<div class="unit-preview-pager"><button class="unit-btn" type="button" aria-label="이전 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition - 1})"${state.previewPaperPosition <= 0 ? ' disabled' : ''}>이전</button><span>${state.previewPaperPosition + 1} / ${state.generatedPapers.length}</span><button class="unit-btn" type="button" aria-label="다음 문제지" onclick="UnitPastExams.selectPreviewPaper(${state.previewPaperPosition + 1})"${state.previewPaperPosition >= state.generatedPapers.length - 1 ? ' disabled' : ''}>다음</button></div>` : '';
    root.innerHTML = `<section class="unit-workflow"><div class="unit-edit-head"><button type="button" class="ug-btn" onclick="UnitPastExams.gridLeaveEdit()">권 목록으로</button><div class="unit-edit-title"><h2>${escapeHtml(paper.title)}</h2>${renderContextStrip(unit, paper.count)}</div></div><div class="unit-confirmation"><div class="unit-preview-pane"><div class="unit-preview-toolbar"><div class="unit-preview-title"><strong>미리보기</strong><span>${paper.count}문항 · 원본 시험지 ${paper.sourceCount}개</span></div></div><div class="unit-preview-frame" id="unit-preview-frame"><div class="unit-preview-loading"><span>실제 문제지를 준비하는 중입니다.</span></div></div>${pager}</div><aside class="unit-confirm-pane"><h2>이 권의 조건</h2><dl class="unit-summary-list">${rows}</dl><section class="unit-print-header-editor" aria-labelledby="unit-print-header-title"><h3 id="unit-print-header-title">시험지 헤더</h3><div class="unit-print-header-fields"><label>제목<input id="unit-print-header-title-input" type="text" maxlength="80" value="${escapeHtml(printHeaderOptions.title)}" oninput="UnitPastExams.updatePrintHeaderOption('title', this.value)"></label><label>우측 문구<input type="text" maxlength="60" value="${escapeHtml(printHeaderOptions.metaRight)}" oninput="UnitPastExams.updatePrintHeaderOption('metaRight', this.value)"></label><label>보조 문구<input type="text" maxlength="120" value="${escapeHtml(printHeaderOptions.subtitle)}" oninput="UnitPastExams.updatePrintHeaderOption('subtitle', this.value)"></label></div><div class="unit-print-header-checks"><label><input type="checkbox"${printHeaderOptions.showNameLine ? ' checked' : ''} onchange="UnitPastExams.updatePrintHeaderOption('showNameLine', this.checked)"> 이름칸</label><label><input type="checkbox"${printHeaderOptions.showScoreLine ? ' checked' : ''} onchange="UnitPastExams.updatePrintHeaderOption('showScoreLine', this.checked)"> 점수칸</label></div></section><div class="unit-confirm-actions"><button type="button" class="unit-btn" onclick="UnitPastExams.printPaper('${unit.key}', '${paper.index}', this)">일반 출력</button><button type="button" class="unit-btn primary" onclick="UnitPastExams.assignPaper('${unit.key}', '${paper.index}', this)">학생에게 출제</button></div></aside></div></section>`;
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
      if (token !== state.previewLoadToken || G.view !== 'edit') return;
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
    app.innerHTML = `<div class="unit-error unit-fallback"><strong>단원별 출제 도구를 불러오지 못했습니다.</strong><br>${escapeHtml(message || '일시적인 로딩 오류입니다.')}<div class="unit-fallback-actions"><button type="button" class="unit-btn primary" onclick="location.reload()">다시 시도</button></div></div>`;
  }
  // 표가 이 페이지의 유일한 화면이다. 처음 보이는 순간부터 새 틀(메뉴·머리글)이고, 큰 자료(question-index.js, 메타·카탈로그)는
  // 학년 버튼·탭 뼈대를 그려 화면에 올린 뒤에 해석한다(archive2-boot.js의 firstPaint 문). 이유: 해석이 끝나기 전에 옛 화면이 비쳤다.
  const QUESTION_INDEX_SRC = 'question-index.js?v=20261110a';
  function ensureQuestionIndex() {
    if (Array.isArray(window.questionIndex)) return Promise.resolve();
    return loadScript(QUESTION_INDEX_SRC);
  }
  async function init() {
    const app = document.getElementById('unit-content');
    const Boot = window.Archive2Boot;
    if (!core) { renderSafeFallback('단원 집계 모듈을 불러오지 못했습니다.'); return; }
    if (!isTeacherSession()) { renderLoginRequired(app); Boot?.firstPaint?.(); return; }
    Boot?.mountProgress?.(document.getElementById('boot-progress'));
    renderGridLoading(app);
    await Boot?.firstPaint?.();
    // 고등 소단원 묶음표(작은 JSON)는 큰 자료와 함께 비동기로 읽는다. 못 읽으면 loadGroups가 콘솔 경고를 남기고 고등은 대단원만 보인다.
    const groupsReady = treeApi()?.loadGroups ? treeApi().loadGroups() : Promise.resolve(null);
    try {
      try { await ensureQuestionIndex(); } catch (error) { console.error(error); }
      if (!Array.isArray(window.questionIndex)) { Boot?.finish?.(true); renderSafeFallback('question-index.js를 불러오지 못했습니다.'); return; }
      try { await loadMetadata(); } catch (error) { state.metadataError = true; console.warn(error); }
      Boot?.setStage?.('index');
      state.index = joinApprovedMetadata(window.questionIndex);
      try { await groupsReady; } catch (error) { console.warn(error); }
      gridInit();
      state.ready = true;
      Boot?.finish?.(false);
    } catch (error) {
      // 렌더 중 예외가 나도 "집계하는 중"에서 멈추지 않게 원인과 다음 행동을 보여 준다.
      console.error(error);
      Boot?.finish?.(true);
      renderSafeFallback(`화면을 만드는 중 오류가 발생했습니다. 새로고침(F5)해 다시 시도해 주세요. (${error?.message || '알 수 없는 오류'})`);
    }
  }
  function renderLoginRequired(app) {
    // 안내는 이 상자 한 번만 보인다(상태 줄은 비운다). 로그인은 같은 출처의 AP Math OS(../apmath/)에서 하고,
    // 로그인 정보는 localStorage(APMATH_SESSION)로 공유되므로 돌아와 "로그인 후 다시 확인"을 누르면 된다.
    setStatus('');
    app.innerHTML = '<section class="unit-login-required" aria-labelledby="unit-login-title"><h2 id="unit-login-title">선생님 로그인이 필요합니다</h2><p>단원별 기출은 AP Math OS 선생님 계정으로 로그인한 뒤 사용할 수 있습니다. 로그인 창에서 로그인한 다음 이 화면으로 돌아와 &lsquo;로그인 후 다시 확인&rsquo;을 눌러 주세요.</p><div class="unit-login-actions"><a class="unit-btn primary" href="../apmath/" target="_blank" rel="noopener">선생님 로그인</a><button type="button" class="unit-btn" onclick="location.reload()">로그인 후 다시 확인</button></div></section>';
  }
  // ---- 단원 x 단계 표 (unit-past-exams.html) ------------------------------------------------
  // 사용자 결정 2026-11-10: 학년을 고르면 단원(행) x 난이도 1~5단계(열) 표가 한 화면에 나오고, 칸을 눌러 여러
  // 단원·여러 단계를 한꺼번에 골라 바로 문제지(권)를 만든다. 기본은 고른 칸의 문항 전부이고 "칸마다 N문항"은
  // 선택 사항이다. 문항이 모자란 칸은 막지 않고 있는 만큼만 넣는다(core.buildSelectionPapers).
  const GRID_STORAGE_KEY = 'archive2.unitGrid.v1';
  const GRID_UNIT_KEY = '__grid__';
  const GRID_GRADE_IDS = ['m1', 'm2', 'm3', 'h1', 'h2', 'h3'];
  const GRID_STEPS = ['1', '2', '3', '4', '5'];
  const GRID_ORDERS = [['recent', '최신 연도부터'], ['unit', '단원별로'], ['step', '쉬운 단계부터']];
  const GRID_PER_CELL_MAX = 50;
  // cells의 칸 키: 단원 전체는 `단원|단계`, 중단원(고등은 소단원 묶음) 하나는 `단원~중단원|단계`. checked는 체크한 단원.
  // open은 펼친 단원, typeOff는 유형 거르기에서 뺀 유형(비어 있으면 전부, NO_TYPE_KEY = 유형 미지정).
  // src는 조건 줄(계획 1c)의 값이다. mode: 'all' 전체 기출 | 'school' 학교 지정(schools = 학교 키 목록), year: 'all' | 'r3' | 'r5' | 'range'(from~to),
  // exam: '' | 'mid' | 'final', semester: '' | '1' | '2', group: 'mixed' 한 권으로 섞기 | 'school' 학교별로 한 권씩(학교 2곳 이상일 때만 뜻이 있다).
  // 학년을 바꿔도 조건은 그대로 이어진다(저장도 학년과 따로).
  const GRID_MODES = [['all', '전체 기출'], ['school', '학교 지정']];
  const GRID_YEARS = [['all', '전체'], ['r3', '최근 3년'], ['r5', '최근 5년'], ['range', '직접']];
  const GRID_EXAMS = [['', '전체'], ['mid', '중간'], ['final', '기말']];
  const GRID_SEMESTERS = [['', '전체'], ['1', '1학기'], ['2', '2학기']];
  const GRID_GROUPS = [['mixed', '한 권으로 섞기'], ['school', '학교별로 한 권씩']];
  const SRC_URL_PARAMS = ['sch', 'yr', 'ex', 'sm', 'grp'];
  const gridDefaultSrc = () => ({ mode: 'all', schools: [], year: 'all', from: 0, to: 0, exam: '', semester: '', group: 'mixed' });
  const G = {
    profileId: '', course: '', cells: new Set(), checked: new Set(), open: new Set(), typeOff: new Set(), tree: null, entry: null, typeRows: [],
    amount: 'all', perCell: 10, order: 'recent',
    src: gridDefaultSrc(), sourceFilter: null, schoolQuery: '', schoolEdit: false, schoolRows: [], schoolLabels: new Map(), condOpen: false,
    view: 'grid', counts: {}, showNone: false, result: null, catalogs: new Map(), saved: new Map(), papersPushed: false, editing: '', editPushed: false
  };

  const treeApi = () => window.Archive2UnitTree || null;
  function gridKey(unitKey, token, childKey) { return `${childKey ? `${unitKey}~${childKey}` : unitKey}|${token}`; }
  // 'U|3' / 'U~C|3' -> { unitKey, childKey, step }
  function gridParseKey(key) {
    const [scope, step] = String(key || '').split('|');
    const at = scope.indexOf('~');
    return { unitKey: at < 0 ? scope : scope.slice(0, at), childKey: at < 0 ? '' : scope.slice(at + 1), step: step === undefined ? '' : step };
  }
  function gridReadStore() {
    try {
      const value = JSON.parse(localStorage.getItem(GRID_STORAGE_KEY) || 'null');
      return value && typeof value === 'object' ? value : null;
    } catch (error) { return null; }
  }
  function gridWriteStore() {
    try {
      localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({
        v: 3, profileId: G.profileId, course: G.course, cells: [...G.cells], checked: [...G.checked], open: [...G.open], typeOff: [...G.typeOff],
        amount: G.amount, perCell: G.perCell, order: G.order, src: G.src
      }));
    } catch (error) { /* 기억하지 못해도 화면은 정상 동작한다 */ }
  }
  // ---- 조건 줄(학교·연도·시험·학기) ----
  // 저장·주소에서 읽은 값을 안전한 모양으로 바로잡는다(모르는 값은 기본으로).
  function gridNormalizeSrc(input) {
    const src = gridDefaultSrc();
    if (!input || typeof input !== 'object') return src;
    src.schools = [...new Set((Array.isArray(input.schools) ? input.schools : []).map(value => String(value || '').trim()).filter(Boolean))];
    src.mode = input.mode === 'school' || src.schools.length ? 'school' : 'all';
    if (src.mode === 'all') src.schools = [];
    if (['r3', 'r5', 'range'].includes(input.year)) src.year = input.year;
    const validYear = value => { const year = Math.floor(Number(value)); return Number.isFinite(year) && year >= 1900 && year <= 2200 ? year : 0; };
    if (src.year === 'range') {
      src.from = validYear(input.from); src.to = validYear(input.to);
      if (!src.from && !src.to) src.year = 'all';
      else { if (!src.from) src.from = src.to; if (!src.to) src.to = src.from; if (src.from > src.to) [src.from, src.to] = [src.to, src.from]; }
    }
    src.exam = input.exam === 'mid' || input.exam === 'final' ? input.exam : '';
    src.semester = input.semester === '1' || input.semester === '2' ? input.semester : '';
    src.group = input.group === 'school' && src.schools.length >= 2 ? 'school' : 'mixed';
    return src;
  }
  function gridSourceOptions() {
    const src = G.src;
    return {
      schoolKeys: src.mode === 'school' ? src.schools : [], yearMode: src.year === 'all' ? 'all' : src.year === 'range' ? 'range' : 'recent',
      yearCount: src.year === 'r5' ? 5 : 3, yearFrom: src.from, yearTo: src.to, examType: src.exam, semester: src.semester, group: src.group
    };
  }
  function gridSrcCount() {
    const src = G.src;
    return (src.mode === 'school' && src.schools.length ? 1 : 0) + (src.year !== 'all' ? 1 : 0) + (src.exam ? 1 : 0) + (src.semester ? 1 : 0);
  }
  function gridSchoolLabel(key) { return G.schoolLabels.get(key) || key; }
  // "순천고 · 최근 3년 · 1학기 중간고사". 학교가 많으면 앞의 셋만 쓴다.
  function gridSrcText() {
    const options = core.normalizeSourceOptions(gridSourceOptions());
    const labels = options.schoolKeys.map(gridSchoolLabel);
    const school = labels.length > 3 ? `${labels.slice(0, 3).join('·')} 외 ${labels.length - 3}교` : labels.join('·');
    return [school, core.sourceYearText(options), core.sourcePeriodText(options)].filter(Boolean).join(' · ');
  }
  function gridSrcToParams() {
    const src = G.src;
    return {
      sch: src.mode === 'school' ? src.schools.join(',') : '',
      yr: src.year === 'r3' || src.year === 'r5' ? src.year : src.year === 'range' ? `${src.from}-${src.to}` : '',
      ex: src.exam, sm: src.semester, grp: src.group === 'school' && src.schools.length >= 2 ? 'school' : ''
    };
  }
  function gridReadUrlSource(params) {
    if (!SRC_URL_PARAMS.some(name => params.has(name))) return null;
    const schools = String(params.get('sch') || '').split(',').map(value => value.trim()).filter(Boolean);
    const yr = String(params.get('yr') || '');
    const range = /^(\d{4})-(\d{4})$/.exec(yr);
    return {
      mode: schools.length ? 'school' : 'all', schools, year: yr === 'r3' || yr === 'r5' ? yr : range ? 'range' : 'all',
      from: range ? Number(range[1]) : 0, to: range ? Number(range[2]) : 0, exam: params.get('ex') || '', semester: params.get('sm') || '', group: params.get('grp') || ''
    };
  }
  function gridApplyStoredOptions(stored) {
    if (!stored) return;
    if (stored.amount === 'all' || stored.amount === 'each') G.amount = stored.amount;
    const per = Math.floor(Number(stored.perCell));
    if (Number.isFinite(per) && per >= 1) G.perCell = Math.min(GRID_PER_CELL_MAX, per);
    if (GRID_ORDERS.some(([id]) => id === stored.order)) G.order = stored.order;
  }
  // 저장·주소에서 읽은 칸: 없어졌거나 문항이 0인 칸·중단원은 버린다. 단원 전체 칸이 있는 단계의 중단원 칸은 이미 들어 있으므로 뺀다.
  function gridApplyStoredSelection(stored) {
    const known = new Set((state.catalog?.units || []).map(unit => unit.key));
    const profileId = state.profileId || G.profileId || 'h1';
    for (const key of Array.isArray(stored.cells) ? stored.cells : []) {
      const parsed = gridParseKey(key);
      const unitKey = core.resolveUnitKeyAlias(profileId, parsed.unitKey);
      if (!known.has(unitKey) || (gridCountsOf(unitKey, parsed.childKey)?.[parsed.step] || 0) <= 0) continue;
      G.cells.add(gridKey(unitKey, parsed.step, parsed.childKey));
    }
    for (const key of [...G.cells]) {
      const parsed = gridParseKey(key);
      if (parsed.childKey && G.cells.has(gridKey(parsed.unitKey, parsed.step))) G.cells.delete(key);
    }
    for (const storedUnitKey of Array.isArray(stored.checked) ? stored.checked : []) {
      const unitKey = core.resolveUnitKeyAlias(profileId, storedUnitKey);
      if (known.has(unitKey)) G.checked.add(unitKey);
    }
    for (const unitKey of Array.isArray(stored.open) ? stored.open : []) {
      if (known.has(unitKey) && G.tree?.hasChildren(unitKey)) G.open.add(unitKey);
    }
  }
  function gridApplyStoredTypes(stored) {
    G.typeOff = new Set(core.normalizeExcludedTypeKeys(stored && stored.typeOff));
  }
  function gridBuildTree(profileId, catalog) {
    const api = treeApi();
    if (!api) return null;
    try { return api.createTree(profileId, catalog.units); } catch (error) { console.warn('[unit-past] 중단원 목록을 만들지 못해 대단원만 보입니다.', error); return null; }
  }
  function gridCatalogFor(profileId) {
    let entry = G.catalogs.get(profileId);
    if (!entry) {
      const catalog = core.buildCatalog(state.index.length ? state.index : window.questionIndex, { profileId });
      const tree = gridBuildTree(profileId, catalog);
      // universe: 학교·연도 조건의 기준이 되는 그 학년 문항 전부. 조건·유형이 같으면 숫자를 한 번만 센다(countCache).
      entry = {
        catalog, tree, all: core.countGrid(catalog.units, gridCountOptions(tree)), countCache: new Map(), sourceFilters: new Map(), schoolOptions: new Map(),
        universe: catalog.units.flatMap(unit => unit.selectableRecords || []), years: null
      };
      G.catalogs.set(profileId, entry);
    }
    return entry;
  }
  function gridChildOf(tree) { return tree ? (record, unit) => tree.childKeyOf(unit.key, record) : undefined; }
  function gridCountOptions(tree, excluded, sourceFilter) {
    const options = {};
    if (tree) options.childOf = gridChildOf(tree);
    if (excluded && excluded.length) options.excludedTypeKeys = excluded;
    if (sourceFilter && sourceFilter.active) options.sourceFilter = sourceFilter;
    return options;
  }
  // 그 학년 시험 연도(최신 먼저): "직접" 연도 고르기 목록.
  function gridYears() {
    const entry = G.entry;
    if (!entry) return [];
    if (!entry.years) entry.years = [...new Set(entry.universe.map(core.getExamYear).filter(year => Number.isInteger(year) && year >= 1900 && year <= 2200))].sort((a, b) => b - a);
    return entry.years;
  }
  function gridMakeSourceFilter() {
    const entry = G.entry;
    if (!entry) return null;
    const options = core.normalizeSourceOptions(gridSourceOptions());
    const key = JSON.stringify(options);
    let filter = entry.sourceFilters.get(key);
    if (!filter) {
      filter = core.createSourceFilter(entry.universe, options);
      if (entry.sourceFilters.size > 16) entry.sourceFilters.clear();
      entry.sourceFilters.set(key, filter);
    }
    return filter;
  }
  // 칸 숫자: 학교·연도·시험·학기 조건과 유형 거르기가 켜져 있으면 그 조건으로 다시 센다(같은 조건이면 한 번만 센다).
  function gridApplyCounts() {
    const entry = G.entry;
    if (!entry) { G.counts = {}; G.sourceFilter = null; return; }
    G.sourceFilter = gridMakeSourceFilter();
    const excluded = core.normalizeExcludedTypeKeys(G.typeOff);
    const sourceKey = G.sourceFilter && G.sourceFilter.active ? G.sourceFilter.key : '';
    if (!excluded.length && !sourceKey) { G.counts = entry.all; return; }
    const key = `${sourceKey}#${excluded.join('|')}`;
    let counts = entry.countCache.get(key);
    if (!counts) {
      counts = core.countGrid(entry.catalog.units, gridCountOptions(entry.tree, excluded, G.sourceFilter));
      if (entry.countCache.size > 12) entry.countCache.clear();
      entry.countCache.set(key, counts);
    }
    G.counts = counts;
  }
  // 한 줄의 단계별 문항 수: childKey가 없으면 단원 전체.
  function gridCountsOf(unitKey, childKey) {
    const row = G.counts[unitKey];
    if (!row) return null;
    return childKey ? (row.children && row.children[childKey]) || null : row;
  }
  function gridChildren(unitKey) { return G.tree ? G.tree.childrenOf(unitKey) : []; }
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
  function gridSelectionOptions() {
    const options = { units: state.catalog ? state.catalog.units : [], perCell: G.amount === 'each' ? G.perCell : null, order: G.order };
    if (G.tree) {
      options.childOf = gridChildOf(G.tree);
      options.childName = (unitKey, childKey) => G.tree.childName(unitKey, childKey);
      options.childRank = (unitKey, childKey) => G.tree.childRank(unitKey, childKey);
    }
    if (G.typeOff.size) options.excludedTypeKeys = [...G.typeOff];
    if (G.sourceFilter && G.sourceFilter.active) options.sourceFilter = G.sourceFilter;
    return options;
  }
  function gridRecompute() {
    try {
      G.result = core.buildSelectionPapers([...G.cells].map(gridParseKey), gridSelectionOptions());
    } catch (error) { console.error(error); G.result = null; }
    if (!gridHasPapers()) G.view = 'grid';
    gridWriteStore();
  }
  // 옛 3단계 화면이 쓰던 주소 값. 옛 즐겨찾기로 열려도 표 화면이 이 값을 주소에서 지운다(grade·course·unit만 이어받는다).
  const LEGACY_URL_PARAMS = [
    'unit', 'step', 'steps', 'semanticSubject', 'subUnit', 'difficulty', 'mode', 'preset', 'count', 'seed', 'blueprint',
    'includeUnclassified', 'adjacentDifficulty', 'metaApproved', 'collection', 'collectionScope', 'collectionStart', 'collectionEnd',
    'collectionYearMode', 'collectionYear', 'collectionYearCount', 'collectionYearFrom', 'collectionYearTo', 'collectionSemester',
    'collectionExamType', 'collectionSchools', 'collectionOutput', 'collectionCountMode', 'collectionCount', 'collectionSubUnit',
    'collectionDifficulty', 'collectionIncludeUnclassified'
  ];
  function gridSyncUrl(mode) {
    const url = new URL(window.location.href);
    LEGACY_URL_PARAMS.forEach(key => url.searchParams.delete(key));
    if (G.profileId) url.searchParams.set('grade', G.profileId); else url.searchParams.delete('grade');
    if (G.profileId && gridCourses().length > 1 && G.course) url.searchParams.set('course', G.course); else url.searchParams.delete('course');
    if (G.view === 'papers' || G.view === 'edit') url.searchParams.set('view', G.view); else url.searchParams.delete('view');
    if (G.view === 'edit' && G.editing) url.searchParams.set('paper', G.editing.replace(/^grid-/, '')); else url.searchParams.delete('paper');
    // 고른 칸·체크한 단원·뺀 유형도 주소에 둔다: 주소를 다시 열면(새로고침·공유) 같은 선택이 된다. 없으면 파라미터를 지운다.
    for (const [param, values] of [[URL_SELECTION_PARAMS.cells, G.profileId ? [...G.cells] : []], [URL_SELECTION_PARAMS.checked, G.profileId ? [...G.checked] : []], [URL_SELECTION_PARAMS.typeOff, G.profileId ? [...G.typeOff] : []]]) {
      if (values.length) url.searchParams.set(param, values.join(',')); else url.searchParams.delete(param);
    }
    // 조건 줄(학교·연도·시험·학기·묶기)도 주소에 둔다. 기본값이면 파라미터를 지운다.
    const srcParams = gridSrcToParams();
    for (const name of SRC_URL_PARAMS) {
      if (G.profileId && srcParams[name]) url.searchParams.set(name, srcParams[name]); else url.searchParams.delete(name);
    }
    try {
      if (mode === 'push') history.pushState(null, '', url.toString());
      else if (mode === 'replace') history.replaceState(null, '', url.toString());
    } catch (error) { /* 주소를 바꾸지 못해도 화면은 정상 동작한다 */ }
  }
  const URL_SELECTION_PARAMS = { cells: 'sel', checked: 'chk', typeOff: 'notype' };
  function gridReadUrlSelection(params) {
    const list = name => String(params.get(name) || '').split(',').map(value => value.trim()).filter(Boolean);
    const cells = list(URL_SELECTION_PARAMS.cells), checked = list(URL_SELECTION_PARAMS.checked), typeOff = list(URL_SELECTION_PARAMS.typeOff);
    return cells.length || checked.length || typeOff.length ? { cells, checked, typeOff } : null;
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

  // 옛 주소의 semanticSubject(고2·고3 과목 묶음)는 같은 과목의 첫 과목 버튼으로 이어 준다.
  function gridCourseForSubject(profileId, subject) {
    if (!subject || typeof core.highSemanticSubjectForCourseKey !== 'function') return '';
    return (core.getProfile(profileId).courses || []).find(course => core.highSemanticSubjectForCourseKey(course) === subject) || '';
  }
  function gridInitialGrade(stored) {
    const requested = new URLSearchParams(window.location.search).get('grade');
    if (state.pendingProfileId && core.PROFILES[state.pendingProfileId]) return state.pendingProfileId;
    if (core.PROFILES[requested]) return requested;
    return stored && core.PROFILES[stored.profileId] ? stored.profileId : '';
  }
  function gridInit() {
    const stored = gridReadStore();
    gridApplyStoredOptions(stored);
    const params = new URLSearchParams(window.location.search);
    const profileId = gridInitialGrade(stored);
    if (!profileId) { gridClearGrade({ fromPopstate: true }); return; }
    // 표가 열리기를 기다리며 다른 학년을 먼저 눌렀다면 주소의 단원·과목은 그 학년 것이 아니므로 쓰지 않는다.
    const sameAsUrl = !state.pendingProfileId || state.pendingProfileId === params.get('grade');
    // 주소에 고른 칸·체크·뺀 유형·조건 줄이 있으면 그 선택이 저장된 선택보다 먼저다(주소를 다시 열면 같은 선택).
    const urlSelection = sameAsUrl && params.get('grade') === profileId ? gridReadUrlSelection(params) : null;
    const urlSource = sameAsUrl && params.get('grade') === profileId ? gridReadUrlSource(params) : null;
    gridSelectGrade(profileId, {
      stored: urlSelection || urlSource ? { ...(stored || {}), ...(urlSelection || {}), ...(urlSource ? { src: urlSource } : {}), profileId } : stored, initial: true,
      course: (sameAsUrl && (params.get('course') || gridCourseForSubject(profileId, params.get('semanticSubject')))) || stored?.course || '',
      view: sameAsUrl ? params.get('view') : '',
      unitKey: sameAsUrl ? core.resolveUnitKeyAlias(profileId, params.get('unit')) : ''
    });
  }
  function gridClearGrade(options = {}) {
    G.profileId = ''; G.course = ''; G.cells = new Set(); G.checked = new Set(); G.open = new Set(); G.typeOff = new Set(); G.tree = null; G.entry = null; G.counts = {};
    G.result = null; G.view = 'grid';
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
    if (changed && G.profileId) G.saved.set(G.profileId, { cells: G.cells, checked: G.checked, open: G.open, typeOff: G.typeOff });
    G.profileId = state.profileId = profileId;
    state.semanticSubject = '';
    state.catalog = entry.catalog;
    G.entry = entry;
    G.tree = entry.tree;
    G.showNone = entry.catalog.units.some(unit => entry.all[unit.key].none > 0);
    if (changed) {
      const kept = G.saved.get(profileId);
      G.cells = kept ? kept.cells : new Set();
      G.checked = kept ? kept.checked : new Set();
      G.open = kept ? kept.open : new Set();
      G.typeOff = kept ? kept.typeOff : new Set();
      G.result = null; G.view = 'grid';
    }
    const storedHere = options.stored && options.stored.profileId === profileId ? options.stored : null;
    if (storedHere) gridApplyStoredTypes(storedHere);
    // 조건 줄은 학년과 따로 이어진다: 처음 열 때만 저장·주소에서 읽고, 그 뒤 학년을 바꿔도 그대로다.
    if (options.initial && options.stored) G.src = gridNormalizeSrc(options.stored.src);
    gridApplyCounts();
    if (storedHere) gridApplyStoredSelection(storedHere);
    if (options.unitKey && G.counts[options.unitKey]) G.checked.add(options.unitKey);
    G.course = gridPickCourse(options.course, options.unitKey);
    gridRecompute();
    G.view = options.view === 'papers' && gridHasPapers() ? 'papers' : 'grid';
    gridChrome();
    if (!options.fromPopstate) gridSyncUrl(changed && !options.initial ? 'push' : 'replace');
    renderGrid();
    if (changed && !options.initial && !options.fromPopstate) window.scrollTo({ top: 0, behavior: 'smooth' });
    // 옛 주소로 열렸으면 그 단원 행으로 스크롤하고 잠깐 강조한다(휴대폰에서 행이 화면 아래에 있어 안 보였다).
    if (options.unitKey && options.initial && G.view === 'grid') gridFlashUnit(options.unitKey);
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
  // ---- 표 그리기 ----
  function gridApplyTargets() {
    const checked = (state.catalog?.units || []).filter(unit => G.checked.has(unit.key));
    return checked.length ? checked : gridCourseUnits();
  }
  function gridStepPressed(token, targets) {
    const open = targets.filter(unit => (G.counts[unit.key]?.[token] || 0) > 0);
    return open.length > 0 && open.every(unit => G.cells.has(gridKey(unit.key, token)));
  }
  // 한 칸. child가 있으면 그 단원의 중단원(고등은 소단원 묶음) 칸이다. 단원 전체 칸이 켜져 있으면 그 단계의 중단원 칸은
  // "이미 들어 있음"(is-covered)이고, 중단원 칸만 켜져 있으면 단원 칸은 "일부만"(is-part, aria-pressed=mixed)으로 보인다.
  function gridCellHtml(unit, token, reports, child, partial) {
    const childKey = child ? child.key : '';
    const total = gridCountsOf(unit.key, childKey)?.[token] || 0;
    const caption = token === 'none' ? '미지정' : `${token}단계`;
    const stepName = core.stepTokenLabel(token);
    const name = child ? `${unit.name} › ${child.name}` : unit.name;
    if (!total) return `<span class="ug-cell is-zero"><span class="ug-n">0</span><span class="ug-cap">${caption}</span><span class="unit-visually-hidden">${escapeHtml(name)} ${stepName} 문항 없음</span></span>`;
    const key = gridKey(unit.key, token, childKey);
    const own = G.cells.has(key);
    const covered = Boolean(child) && G.cells.has(gridKey(unit.key, token));
    const on = own || covered;
    const part = !child && !own && Boolean(partial) && partial.has(gridKey(unit.key, token));
    const report = own ? reports.get(key) : null;
    const each = own && G.amount === 'each' && report;
    const take = each ? report.got : total;
    const short = Boolean(each && report.got < (report.wanted || G.perCell));
    const shown = each ? `<span class="ug-n">${take}</span><span class="ug-of">/${total}</span>` : `<span class="ug-n">${total}</span>`;
    let label = `${name} ${stepName} ${total}문항`;
    if (on) label += each ? `, ${take}문항 뽑음${short ? ', 모자라서 있는 만큼만' : ''}` : covered ? ', 단원 전체에 들어 있어 선택됨' : ', 선택됨';
    else if (part) label += ', 일부 중단원만 선택됨';
    const click = child ? `UnitPastExams.gridToggleCell('${unit.key}','${token}','${childKey}')` : `UnitPastExams.gridToggleCell('${unit.key}','${token}')`;
    const pressed = on ? 'true' : part ? 'mixed' : 'false';
    return `<button type="button" class="ug-cell${on ? ' is-on' : ''}${covered ? ' is-covered' : ''}${part ? ' is-part' : ''}${short ? ' is-short' : ''}" data-focus="c:${key}" aria-pressed="${pressed}" aria-label="${escapeHtml(label)}" onclick="${click}">${shown}<span class="ug-cap">${caption}</span></button>`;
  }
  function gridUnitKindName() { return String(G.profileId).startsWith('m') ? '중단원' : '소단원'; }
  function gridUnitRowHtml(unit, tokens, reports, partial) {
    const checked = G.checked.has(unit.key);
    const children = gridChildren(unit.key);
    const open = children.length > 0 && G.open.has(unit.key);
    const toggle = children.length
      ? `<button type="button" class="ug-expand" data-focus="x:${unit.key}" aria-expanded="${open ? 'true' : 'false'}" aria-label="${escapeHtml(unit.name)} ${gridUnitKindName()} ${open ? '접기' : '펼치기'}" title="${gridUnitKindName()} ${children.length}개" onclick="UnitPastExams.gridToggleOpen('${unit.key}')"></button>`
      : '<span class="ug-expand-gap" aria-hidden="true"></span>';
    const head = `<tr class="ug-row${checked ? ' is-checked' : ''}" data-unit="${unit.key}"><th scope="row" class="ug-unit"><div class="ug-unit-line">${toggle}<label class="ug-check"><input type="checkbox" data-focus="k:${unit.key}"${checked ? ' checked' : ''} onchange="UnitPastExams.gridToggleUnit('${unit.key}')"><span>${escapeHtml(unit.name)}</span></label></div></th>${tokens.map(token => `<td class="ug-td">${gridCellHtml(unit, token, reports, null, partial)}</td>`).join('')}</tr>`;
    if (!open) return head;
    return head + children.map(child => {
      const empty = !(gridCountsOf(unit.key, child.key)?.total);
      return `<tr class="ug-subrow${empty ? ' is-empty' : ''}" data-unit="${unit.key}" data-child="${escapeHtml(child.key)}"><th scope="row" class="ug-unit ug-sub"><span class="ug-sub-name">${escapeHtml(child.name)}</span></th>${tokens.map(token => `<td class="ug-td">${gridCellHtml(unit, token, reports, child, partial)}</td>`).join('')}</tr>`;
    }).join('');
  }
  function gridTableHtml() {
    const units = gridCourseUnits();
    const reports = new Map((G.result?.cells || []).map(cell => [gridKey(cell.unitKey, cell.step, cell.childKey), cell]));
    const tokens = G.showNone ? [...GRID_STEPS, 'none'] : GRID_STEPS;
    const targets = gridApplyTargets();
    // 중단원 칸만 켠 단원·단계(단원 칸에 "일부" 표시)
    const partial = new Set();
    for (const key of G.cells) { const parsed = gridParseKey(key); if (parsed.childKey) partial.add(gridKey(parsed.unitKey, parsed.step)); }
    const checkedCount = (state.catalog?.units || []).filter(unit => G.checked.has(unit.key)).length;
    const scopeText = checkedCount ? `체크한 단원 ${checkedCount}개 전체에` : '체크가 없으면 보이는 모든 단원에';
    const stepButton = (token, prefix = 'a') => `<button type="button" class="ug-allstep" data-focus="${prefix}:${token}" aria-pressed="${gridStepPressed(token, targets) ? 'true' : 'false'}" aria-label="${token}단계를 ${checkedCount ? '체크한 단원 전체에' : '보이는 모든 단원에'}" onclick="UnitPastExams.gridApplyStep('${token}')">${token}단계</button>`;
    const head = `<tr class="ug-head-row"><th scope="col" class="ug-unit-head"><span class="ug-head-title">단원</span><span class="ug-head-hint">${scopeText}</span></th>${GRID_STEPS.map(token => `<th scope="col" class="ug-step-head">${stepButton(token)}</th>`).join('')}${G.showNone ? '<th scope="col" class="ug-step-head ug-none-head">미지정</th>' : ''}</tr>`;
    const rows = units.map(unit => gridUnitRowHtml(unit, tokens, reports, partial)).join('');
    const allbar = `<div class="ug-allbar" role="group" aria-label="체크한 단원 전체에 단계 적용"><span class="ug-allbar-label">${checkedCount ? `체크한 ${checkedCount}개 단원 전체에` : '보이는 모든 단원에'}</span>${GRID_STEPS.map(token => stepButton(token, 'b')).join('')}</div>`;
    return `${allbar}<table class="ug-table" style="--ug-cols:${tokens.length}"><thead>${head}</thead><tbody>${rows || '<tr><td class="ug-empty-row">이 과목에는 단원 정보가 없습니다.</td></tr>'}</tbody></table>`;
  }
  // 표의 한 줄(단원 하나 또는 단원의 중단원 하나)의 이름: "평면도형" 또는 "평면도형 › 원과 부채꼴".
  function gridScopeLabel(unitKey, childKey) {
    const unit = (state.catalog?.units || []).find(item => item.key === unitKey);
    const name = unit ? unit.name : unitKey;
    const child = childKey && G.tree ? G.tree.childName(unitKey, childKey) : '';
    return child ? `${name} › ${child}` : name;
  }
  function gridShortText(shortages, limit = 4) {
    const parts = shortages.slice(0, limit).map(item => `${gridScopeLabel(item.unitKey, item.childKey)} ${core.stepTokenLabel(item.step)} ${item.got}문항`);
    return parts.join(', ') + (shortages.length > limit ? ` 외 ${shortages.length - limit}곳` : '');
  }
  function gridMiniTableHtml(result) {
    const used = result.cells.filter(cell => cell.got > 0);
    const tokens = [...new Set(used.map(cell => cell.step))].sort((a, b) => core.STEP_TOKENS.indexOf(a) - core.STEP_TOKENS.indexOf(b));
    const names = new Map((state.catalog?.units || []).map(unit => [unit.key, unit.name]));
    const scopes = result.scopes && result.scopes.length ? result.scopes : result.unitKeys.map(unitKey => ({ scopeKey: unitKey, label: names.get(unitKey) || unitKey }));
    const rows = scopes.map(scope => {
      const counts = tokens.map(token => used.find(cell => (cell.scopeKey || cell.unitKey) === scope.scopeKey && cell.step === token)?.got || 0);
      return `<tr><th scope="row">${escapeHtml(scope.label)}</th>${counts.map(count => `<td>${count || '-'}</td>`).join('')}<td class="ug-mini-sum">${counts.reduce((sum, count) => sum + count, 0)}</td></tr>`;
    }).join('');
    return `<table class="ug-mini"><thead><tr><th scope="col">범위</th>${tokens.map(token => `<th scope="col">${token === 'none' ? '미지정' : `${token}단계`}</th>`).join('')}<th scope="col">합계</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function gridSummaryHtml() {
    const result = G.result;
    if (!gridHasPapers()) return '<h2 class="ug-sum-title">고른 칸이 없습니다</h2><p class="ug-sum-empty">표에서 단원과 단계가 만나는 칸을 누르세요. 단원을 여러 개 체크한 뒤 단계 버튼을 누르면 한 번에 고를 수 있습니다.</p>';
    const note = result.shortages.length ? `<p class="ug-note">모자란 칸 ${result.shortages.length}곳은 있는 만큼만 넣었습니다. ${escapeHtml(gridShortText(result.shortages))}.</p>` : '';
    return `<div class="ug-sum-block"><h2 class="ug-sum-title">${escapeHtml(gridResultTitle(result))}</h2><div class="ug-sum-count"><span class="ug-big">${result.total.toLocaleString()}문항</span><strong>문제지 ${result.papers.length}권</strong></div>${gridSumSchoolsHtml(result)}${note}${gridMiniTableHtml(result)}</div>`;
  }
  function gridBarHtml() {
    const result = G.result;
    if (!gridHasPapers()) return '<div class="ug-bar-text"><strong class="ug-bar-count">고른 칸이 없습니다</strong><span class="ug-bar-note">단원 칸을 눌러 고르세요</span></div><button type="button" class="ug-primary" disabled>문제지 보기</button>';
    const note = result.shortages.length ? `모자란 칸 ${result.shortages.length}곳은 있는 만큼만` : gridResultTitle(result);
    return `<div class="ug-bar-text"><strong class="ug-bar-count">${result.total.toLocaleString()}문항 · ${result.papers.length}권</strong><span class="ug-bar-note">${escapeHtml(note)}</span></div><button type="button" class="ug-primary" onclick="UnitPastExams.gridShowPapers()">문제지 보기</button>`;
  }
  function gridOrdersHtml() {
    return GRID_ORDERS.map(([id, label]) => `<button type="button" class="ug-seg${G.order === id ? ' is-on' : ''}" data-focus="o:${id}" aria-pressed="${G.order === id ? 'true' : 'false'}" onclick="UnitPastExams.gridSetOrder('${id}')">${label}</button>`).join('');
  }
  function gridOptionsNow() {
    const group = G.src.mode === 'school' && G.src.schools.length >= 2 ? ` · ${(GRID_GROUPS.find(([id]) => id === G.src.group) || GRID_GROUPS[0])[1]}` : '';
    return `${G.amount === 'each' ? `칸마다 ${G.perCell}문항씩` : '있는 만큼 전부'} · ${(GRID_ORDERS.find(([id]) => id === G.order) || GRID_ORDERS[0])[1]}${group}`;
  }
  // 위 머리·요약·권 목록 머리가 같은 말을 쓴다: 학교·연도·시험 조건 · 단원 · 단계.
  function gridResultTitle(result) { return [result.sourceLabel, result.unitLabel, result.stepLabel].filter(Boolean).join(' · '); }
  // 학교를 2곳 이상 뽑았으면 학교마다 문항 수를 한 줄로 보인다("이 학교는 이 단원을 이렇게 낸다"를 비교하기 쉽게).
  function gridSumSchoolsHtml(result) {
    const schools = result.schools || [];
    if (schools.length < 2) return '';
    return `<p class="ug-sum-schools">${escapeHtml(schools.map(school => `${school.label} ${school.count.toLocaleString()}`).join(' · '))}</p>`;
  }
  function gridSelectedTotal() {
    let sum = 0;
    for (const key of G.cells) { const parsed = gridParseKey(key); sum += gridCountsOf(parsed.unitKey, parsed.childKey)?.[parsed.step] || 0; }
    return sum;
  }

  // ---- 유형 거르기 ("유형" 접이식) ----
  // 고른 단원(체크했거나 칸을 고른 단원, 중단원 칸만 골랐으면 그 중단원)에 있는 유형만 보이고, 기본은 전부 켜져 있다.
  // 끄면 그 유형 문항을 빼고 표 숫자와 문제지를 다시 센다. 중학교는 유형이 채워진 문항이 7~16%뿐이라 "유형 미지정"을 맨 위에 둔다.
  function gridTypePool() {
    const scopes = new Map();
    for (const unitKey of G.checked) scopes.set(unitKey, null);
    for (const key of G.cells) {
      const { unitKey, childKey } = gridParseKey(key);
      if (scopes.has(unitKey) && scopes.get(unitKey) === null) continue;
      if (!childKey) { scopes.set(unitKey, null); continue; }
      const only = scopes.get(unitKey) || new Set();
      only.add(childKey);
      scopes.set(unitKey, only);
    }
    const records = [];
    for (const unit of state.catalog?.units || []) {
      if (!scopes.has(unit.key)) continue;
      const only = scopes.get(unit.key);
      for (const record of unit.selectableRecords || []) if (!only || (G.tree && only.has(G.tree.childKeyOf(unit.key, record)))) records.push(record);
    }
    return records;
  }
  function gridTypesNowText() { return G.typeOff.size ? `${G.typeOff.size}종 뺌` : '전체 유형'; }
  function gridTypesBodyHtml() {
    const reset = G.typeOff.size ? '<button type="button" class="ug-link-btn" data-focus="t:reset" onclick="UnitPastExams.gridResetTypes()">전체 켜기</button>' : '';
    const pool = gridTypePool();
    if (!pool.length) {
      G.typeRows = [];
      return `<p class="ug-types-help">단원을 체크하거나 칸을 고르면 그 단원에 있는 유형이 나옵니다. 기본은 모든 유형을 씁니다.</p>${G.typeOff.size ? `<p class="ug-types-help">지금 유형 ${G.typeOff.size}종을 뺀 채로 숫자를 세고 있습니다.</p>${reset}` : ''}`;
    }
    const info = core.getTypeFilterOptions(pool);
    const rows = [{ key: core.NO_TYPE_KEY, label: '유형 미지정', count: info.noneCount }, ...info.options];
    G.typeRows = rows.map(row => row.key);
    const items = rows.map((row, index) => `<li><label class="ug-type${row.count ? '' : ' is-quiet'}"><input type="checkbox" data-focus="t:${index}"${G.typeOff.has(row.key) ? '' : ' checked'} onchange="UnitPastExams.gridToggleType(${index})"><span class="ug-type-name">${escapeHtml(row.label)}</span><span class="ug-type-n">${row.count.toLocaleString()}</span></label></li>`).join('');
    const hidden = [...G.typeOff].filter(key => !G.typeRows.includes(key)).length;
    const hiddenNote = hidden ? `<p class="ug-types-help">고른 단원에 없는 유형 ${hidden}종도 빼고 있습니다.</p>` : '';
    // 유형이 많을 때 하나만 남기기 쉽게: 전체를 끄고 필요한 것만 켠다.
    const allOff = G.typeRows.every(key => G.typeOff.has(key));
    const bulk = `<div class="ug-type-bulk"><button type="button" class="ug-link-btn" data-focus="t:on" onclick="UnitPastExams.gridResetTypes()"${G.typeOff.size ? '' : ' disabled'}>전체 켜기</button><span class="ug-type-bulk-sep" aria-hidden="true"></span><button type="button" class="ug-link-btn" data-focus="t:off" onclick="UnitPastExams.gridTypesOffAll()"${allOff ? ' disabled' : ''}>전체 끄기</button></div>`;
    return `<p class="ug-types-help">고른 단원에 있는 유형입니다. 체크를 끄면 그 유형 문항을 빼고 다시 셉니다.</p>${bulk}<ul class="ug-type-list">${items}</ul>${hiddenNote}`;
  }
  function gridFilterNoteHtml() {
    const parts = [];
    if (G.sourceFilter && G.sourceFilter.active) parts.push(`${gridSrcText()} 조건의 문항 수입니다.`);
    if (G.typeOff.size) parts.push(`유형 ${G.typeOff.size}종을 뺀 문항 수입니다.`);
    return parts.join(' ');
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
    gridPatch('ug-types-body', gridTypesBodyHtml());
    gridPatch('ug-group', gridGroupHtml(false));
    const now = document.getElementById('ug-opt-now');
    if (now) now.textContent = gridOptionsNow();
    const typesNow = document.getElementById('ug-types-now');
    if (typesNow) typesNow.textContent = gridTypesNowText();
    const filterNote = document.getElementById('ug-filter-note');
    if (filterNote) filterNote.textContent = gridFilterNoteHtml();
    const all = document.getElementById('ug-all-count');
    if (all) all.textContent = gridSelectedTotal() ? `(${gridSelectedTotal().toLocaleString()}문항)` : '';
    const go = document.getElementById('ug-go');
    if (go) go.disabled = !gridHasPapers();
    const clear = document.getElementById('ug-clear');
    if (clear) clear.disabled = !G.cells.size && !G.checked.size;
    gridSyncUrl('replace');
  }
  // ---- 조건 줄: 출처(전체 기출 | 학교 지정) · 연도 · 시험 · 학기 (계획 1c, archive/DESIGN.md "조건 줄") ----
  // 기본값은 전부 "전체"라 조건을 안 건드리면 화면·숫자·결과가 그대로다. 바꾼 조건은 주홍으로 티 난다.
  // PC는 표 위 한 줄(필요하면 줄바꿈), 휴대폰(700px 이하)은 `조건 2개 · 바꾸기` 한 줄 버튼이고 누르면 아래에서 올라오는 시트로 연다.
  const gridIsPhone = () => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 700px)').matches;
  const gridNormQuery = value => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '');
  function gridSegGroupHtml(kind, label, options, current, changed) {
    const buttons = options.map(([id, text]) => `<button type="button" class="ug-seg${current === id ? ' is-on' : ''}" data-focus="${kind}:${id || 'all'}" aria-pressed="${current === id ? 'true' : 'false'}" onclick="UnitPastExams.gridSetSrc('${kind}','${id}')">${text}</button>`).join('');
    return `<div class="ug-cond-grp${changed ? ' is-changed' : ''}" role="group" aria-label="${label}"><span class="ug-cond-label">${label}</span><div class="ug-cond-segs">${buttons}</div></div>`;
  }
  // 학교 고르기 목록(그 학년에 기출이 있는 학교, 학교를 뺀 나머지 조건으로 센 문항 수). 같은 조건이면 한 번만 만든다.
  function gridSchoolOptions() {
    const entry = G.entry;
    if (!entry) return [];
    const options = { ...gridSourceOptions(), schoolKeys: [] };
    const key = core.sourceOptionsKey(options) || 'all';
    let rows = entry.schoolOptions.get(key);
    if (!rows) {
      rows = core.getSourceSchoolOptions(entry.universe, options);
      entry.schoolOptions.set(key, rows);
    }
    rows.forEach(row => G.schoolLabels.set(row.key, row.label));
    return rows;
  }
  function gridSchoolResultsHtml() {
    const query = gridNormQuery(G.schoolQuery);
    const chosen = new Set(G.src.schools);
    let rows = gridSchoolOptions().filter(row => !chosen.has(row.key));
    const all = rows.length;
    if (query) {
      rows = rows.filter(row => gridNormQuery(row.label).includes(query))
        .sort((a, b) => Number(gridNormQuery(b.label).startsWith(query)) - Number(gridNormQuery(a.label).startsWith(query)) || b.count - a.count);
    }
    const shown = rows.slice(0, 8);
    G.schoolRows = shown.map(row => row.key);
    const items = shown.map((row, index) => `<li><button type="button" class="ug-school-item${row.count ? '' : ' is-quiet'}" data-focus="sc:${index}" aria-label="${escapeHtml(row.label)} ${row.count.toLocaleString()}문항 추가" onclick="UnitPastExams.gridAddSchool(${index})"><span class="ug-school-name">${escapeHtml(row.label)}</span><span class="ug-school-n">${row.count.toLocaleString()}문항</span></button></li>`).join('');
    let hint = '';
    if (!all) hint = '이 학년에 기출이 있는 학교를 모두 골랐습니다.';
    else if (query && !rows.length) hint = '찾는 학교가 없습니다. 이 학년에 기출이 있는 학교만 나옵니다.';
    else if (!query) hint = `문항이 많은 학교 순입니다. 이름을 입력하면 찾습니다(이 학년 ${all}곳).`;
    else if (rows.length > shown.length) hint = `${rows.length - shown.length}곳이 더 있습니다. 이름을 더 입력해 주세요.`;
    return `${items}${hint ? `<li class="ug-school-hint">${escapeHtml(hint)}</li>` : ''}`;
  }
  // 학교를 고른 뒤에는 PC에서 "학교 3곳 · 바꾸기" 한 줄로 접는다(검색 칸과 목록이 표를 밀어내지 않게).
  // 고르는 중(G.schoolEdit)이거나 아직 고른 학교가 없을 때만 펼쳐 둔다. 휴대폰 시트 안에서는 늘 펼쳐 둔다.
  function gridSchoolFoldedHtml() {
    const names = G.src.schools.map(gridSchoolLabel);
    const shown = names.slice(0, 3).map(escapeHtml).join(', ');
    const more = names.length > 3 ? ` 외 ${names.length - 3}곳` : '';
    return `<div class="ug-cond-schools is-folded"><p class="ug-fold-text"><strong>학교 ${names.length}곳</strong><span class="ug-fold-names">${shown}${more}</span></p><button type="button" class="ug-fold-btn" data-focus="sf" aria-expanded="false" onclick="UnitPastExams.gridSchoolEdit(true)">바꾸기</button></div>`;
  }
  function gridSchoolPanelHtml() {
    if (G.src.schools.length && !G.schoolEdit && !gridIsPhone()) return gridSchoolFoldedHtml();
    const counts = new Map(gridSchoolOptions().map(row => [row.key, row.count]));
    const chips = G.src.schools.map((key, index) => {
      const label = gridSchoolLabel(key);
      const n = counts.get(key);
      const note = n === undefined ? '이 학년에는 이 학교 기출이 없습니다' : `조건에 맞는 문항 ${n.toLocaleString()}개`;
      return `<button type="button" class="ug-chip${n ? '' : ' is-quiet'}" data-focus="ch:${index}" title="${escapeHtml(note)}" aria-label="${escapeHtml(label)} 빼기 (${escapeHtml(note)})" onclick="UnitPastExams.gridRemoveSchool(${index})"><span>${escapeHtml(label)}</span><span class="ug-chip-x" aria-hidden="true"></span></button>`;
    }).join('');
    return `<div class="ug-cond-schools"><div class="ug-chips" id="ug-chips">${chips || '<span class="ug-chips-empty">학교를 고르면 그 학교 문항만 셉니다. 고르지 않으면 모든 학교입니다.</span>'}</div><label class="ug-school-search"><span class="ug-cond-label">학교 찾기</span><input type="search" id="ug-school-q" class="ug-school-q" data-focus="q" autocomplete="off" placeholder="학교 이름 (예: 순천)" value="${escapeHtml(G.schoolQuery)}" oninput="UnitPastExams.gridSchoolQuery(this.value)" onkeydown="UnitPastExams.gridSchoolKey(event)"></label><ul class="ug-school-results" id="ug-school-results" aria-label="학교 목록">${gridSchoolResultsHtml()}</ul>${G.src.schools.length ? '<button type="button" class="ug-fold-btn ug-only-pc" data-focus="sd" onclick="UnitPastExams.gridSchoolEdit(false)">학교 고르기 마침</button>' : ''}</div>`;
  }
  function gridRangeHtml() {
    const years = gridYears();
    const options = current => years.map(year => `<option value="${year}"${year === current ? ' selected' : ''}>${year}년</option>`).join('');
    return `<div class="ug-cond-range" role="group" aria-label="연도 직접 고르기"><label><span class="ug-cond-label">시작</span><select class="ug-select" data-focus="yf" onchange="UnitPastExams.gridSetRange('from', this.value)">${options(G.src.from)}</select></label><span class="ug-range-sep" aria-hidden="true"></span><label><span class="ug-cond-label">끝</span><select class="ug-select" data-focus="yt" onchange="UnitPastExams.gridSetRange('to', this.value)">${options(G.src.to)}</select></label><span class="ug-range-note">학교마다 그 연도 범위의 시험만 씁니다.</span></div>`;
  }
  // 결과 묶기: 학교를 2곳 이상 골랐을 때만. 오른쪽 패널("문항 수 · 정리 순서")과 휴대폰 시트 안에 같은 단추가 있다.
  function gridGroupHtml(inSheet) {
    if (G.src.mode !== 'school' || G.src.schools.length < 2) return '';
    const tag = inSheet ? 'gs' : 'g';
    const buttons = GRID_GROUPS.map(([id, text]) => `<button type="button" class="ug-seg${G.src.group === id ? ' is-on' : ''}" data-focus="${tag}:${id}" aria-pressed="${G.src.group === id ? 'true' : 'false'}" onclick="UnitPastExams.gridSetSrc('group','${id}')">${text}</button>`).join('');
    return `<div class="ug-order${inSheet ? ' ug-only-sheet' : ''}"><span class="ug-order-title" id="ug-group-title-${tag}">결과 묶기</span><div class="ug-orders" role="group" aria-labelledby="ug-group-title-${tag}">${buttons}</div></div>`;
  }
  function gridCondHtml() {
    const src = G.src;
    const count = gridSrcCount();
    const open = G.condOpen;
    const trigger = `<button type="button" class="ug-cond-open${count ? ' is-changed' : ''}" data-focus="co" aria-expanded="${open ? 'true' : 'false'}" aria-controls="ug-cond-body" onclick="UnitPastExams.gridCondOpen()">${count ? `조건 ${count}개` : '조건 없음'} · 바꾸기</button>`;
    const groups = [
      gridSegGroupHtml('mode', '출처', GRID_MODES, src.mode, src.mode === 'school'),
      gridSegGroupHtml('year', '연도', GRID_YEARS, src.year, src.year !== 'all'),
      gridSegGroupHtml('exam', '시험', GRID_EXAMS, src.exam, Boolean(src.exam)),
      gridSegGroupHtml('semester', '학기', GRID_SEMESTERS, src.semester, Boolean(src.semester))
    ].join('');
    const more = `${src.mode === 'school' ? gridSchoolPanelHtml() : ''}${src.year === 'range' ? gridRangeHtml() : ''}`;
    const head = '<div class="ug-cond-sheet-head"><strong id="ug-cond-title">출제 조건 바꾸기</strong><button type="button" class="ug-link-btn" data-focus="cc" onclick="UnitPastExams.gridCondClose()">닫기</button></div>';
    // 지우기는 조건이 있을 때만 나온다(PC는 조건 줄 끝에, 휴대폰은 시트 아래에).
    const hasReset = count > 0 || src.mode === 'school';
    const resetButton = tag => (hasReset ? `<button type="button" class="ug-link-btn ${tag}" data-focus="${tag === 'ug-only-pc' ? 'cr' : 'cr2'}" onclick="UnitPastExams.gridCondReset()">조건 모두 지우기</button>` : '');
    const foot = `<div class="ug-cond-foot">${resetButton('ug-only-sheet')}<button type="button" class="ug-primary ug-cond-done" data-focus="cd" onclick="UnitPastExams.gridCondClose()">이 조건으로 보기 · ${gridCourseTotal(G.course).toLocaleString()}문항</button></div>`;
    const role = open && gridIsPhone() ? ' role="dialog" aria-modal="true" aria-labelledby="ug-cond-title"' : ' role="group" aria-label="기출 조건"';
    return `${trigger}<div class="ug-cond-scrim${open ? ' is-open' : ''}" onclick="UnitPastExams.gridCondClose()"></div><div class="ug-cond-body${open ? ' is-open' : ''}" id="ug-cond-body"${role}>${head}<div class="ug-cond-line">${groups}${resetButton('ug-only-pc')}</div>${more}${gridGroupHtml(true)}${foot}</div>`;
  }
  // 조건이 바뀌면: 숫자를 다시 세고(표·요약·띠·유형), 조건 줄도 다시 그린다.
  function gridSrcChanged() {
    G.src = gridNormalizeSrc(G.src);
    gridApplyCounts();
    gridRefresh();
    gridPatch('ug-cond', gridCondHtml());
  }
  function gridFocusSearch() {
    const input = typeof document.getElementById === 'function' ? document.getElementById('ug-school-q') : null;
    if (input && typeof input.focus === 'function') input.focus({ preventScroll: true });
  }
  function gridSetSrc(kind, value) {
    const src = G.src;
    const next = String(value === undefined || value === null ? '' : value);
    if (kind === 'mode') {
      if (!GRID_MODES.some(([id]) => id === next) || src.mode === next) return;
      src.mode = next;
      if (next === 'all') { src.schools = []; src.group = 'mixed'; G.schoolQuery = ''; G.schoolEdit = false; }
    } else if (kind === 'year') {
      if (!GRID_YEARS.some(([id]) => id === next) || src.year === next) return;
      src.year = next;
      // "직접"을 처음 누르면 가장 최근 3개 연도를 기본으로 보여 준다.
      if (next === 'range' && !(src.from && src.to)) { const years = gridYears(); src.to = years[0] || 0; src.from = years[Math.min(2, years.length - 1)] || src.to; }
    } else if (kind === 'exam') {
      if (!GRID_EXAMS.some(([id]) => id === next) || src.exam === next) return;
      src.exam = next;
    } else if (kind === 'semester') {
      if (!GRID_SEMESTERS.some(([id]) => id === next) || src.semester === next) return;
      src.semester = next;
    } else if (kind === 'group') {
      if (!GRID_GROUPS.some(([id]) => id === next) || src.group === next) return;
      src.group = next;
    } else return;
    gridSrcChanged();
  }
  function gridSetRange(which, value) {
    const year = Math.floor(Number(value));
    if (!Number.isFinite(year) || (which !== 'from' && which !== 'to')) return;
    if (which === 'from') G.src.from = year; else G.src.to = year;
    gridSrcChanged();
  }
  function gridSchoolQuery(value) {
    G.schoolQuery = String(value || '');
    gridPatch('ug-school-results', gridSchoolResultsHtml());
  }
  function gridSchoolKey(event) {
    if (!event || event.key !== 'Enter') return;
    if (typeof event.preventDefault === 'function') event.preventDefault();
    if (G.schoolRows.length) gridAddSchool(0);
  }
  function gridAddSchool(index) {
    const key = G.schoolRows[Number(index)];
    if (!key || G.src.schools.includes(key)) return;
    G.src.schools.push(key);
    G.src.mode = 'school';
    G.schoolEdit = true;
    G.schoolQuery = '';
    // 두 번째 학교부터 "결과 묶기"가 생기므로, 접혀 있던 "문항 수 · 정리 순서"를 펼쳐 알린다.
    if (G.src.schools.length === 2) { const details = document.getElementById('ug-opts'); if (details) details.open = true; }
    gridSrcChanged();
    gridFocusSearch();
  }
  function gridRemoveSchool(index) {
    const key = G.src.schools[Number(index)];
    if (!key) return;
    G.src.schools.splice(Number(index), 1);
    if (G.src.schools.length < 2) G.src.group = 'mixed';
    gridSrcChanged();
    gridFocusSearch();
  }
  function gridSchoolEdit(on) {
    G.schoolEdit = Boolean(on);
    gridPatch('ug-cond', gridCondHtml());
    const target = typeof document.querySelector === 'function'
      ? document.querySelector(on ? '#ug-school-q' : '#ug-cond [data-focus="sf"]') : null;
    if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
  }
  function gridCondReset() {
    G.src = gridDefaultSrc();
    G.schoolEdit = false;
    G.schoolQuery = '';
    gridSrcChanged();
  }
  function gridCondOpen() {
    G.condOpen = true;
    gridPatch('ug-cond', gridCondHtml());
    const close = typeof document.querySelector === 'function' ? document.querySelector('#ug-cond [data-focus="cc"]') : null;
    if (close && typeof close.focus === 'function') close.focus({ preventScroll: true });
  }
  function gridCondClose() {
    if (!G.condOpen) return;
    G.condOpen = false;
    gridPatch('ug-cond', gridCondHtml());
    const trigger = typeof document.querySelector === 'function' ? document.querySelector('#ug-cond [data-focus="co"]') : null;
    if (trigger && typeof trigger.focus === 'function') trigger.focus({ preventScroll: true });
  }
  if (typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', event => { if (event && event.key === 'Escape' && G.condOpen) gridCondClose(); });
  }

  function gridGradeButtons(activeId = G.profileId, handler = 'gridSelectGrade') {
    return `<div class="ug-grades" role="group" aria-label="학년">${GRID_GRADE_IDS.map(id => `<button type="button" class="ug-grade" data-profile="${id}" data-focus="g:${id}" aria-pressed="${activeId === id ? 'true' : 'false'}" onclick="UnitPastExams.${handler}('${id}')">${escapeHtml(core.getProfile(id).gradeLabel)}</button>`).join('')}</div>`;
  }
  function gridCourseButtons() {
    const courses = gridCourses();
    if (courses.length < 2) return '';
    return `<div class="ug-courses" role="group" aria-label="과목">${courses.map((course, index) => `<button type="button" class="ug-seg${course === G.course ? ' is-on' : ''}${gridCourseTotal(course) ? '' : ' is-quiet'}" data-focus="s:${index}" aria-pressed="${course === G.course ? 'true' : 'false'}" onclick="UnitPastExams.gridSetCourse(${index})">${escapeHtml(course)}</button>`).join('')}</div>`;
  }
  function gridTabsHtml() {
    return '<div class="ug-tabs" role="tablist" aria-label="자료 종류"><button type="button" role="tab" class="ug-tab is-on" aria-selected="true">기출</button><button type="button" role="tab" class="ug-tab is-soon" aria-selected="false" aria-disabled="true" aria-describedby="ug-soon-note" tabindex="-1">유사문제</button><button type="button" role="tab" class="ug-tab is-soon" aria-selected="false" aria-disabled="true" aria-describedby="ug-soon-note" tabindex="-1">유사문제 먼저, 기출 다음</button><span class="ug-soon-note" id="ug-soon-note">유사문제 단계 작업이 끝나면 열립니다</span></div>';
  }
  // 자료를 해석하는 동안 보이는 표 뼈대: 학년 버튼·탭은 바로 쓸 수 있고, 칸 숫자는 자료가 준비된 뒤에만 채운다(가짜 숫자 없음).
  function renderGridLoading(root) {
    const stored = gridReadStore();
    const active = gridInitialGrade(stored);
    const rows = Array.from({ length: 7 }, () => '<div class="ug-skel-row"><span class="ug-skel-name"></span><span class="ug-skel-cell"></span><span class="ug-skel-cell"></span><span class="ug-skel-cell"></span><span class="ug-skel-cell"></span><span class="ug-skel-cell"></span></div>').join('');
    root.innerHTML = `<section class="ug ug-loading" aria-busy="true">${gridTabsHtml()}<div class="ug-pick">${gridGradeButtons(active, 'gridPickGradeEarly')}</div><div class="ug-main"><section class="ug-table-wrap" aria-label="단원과 난이도 단계"><div class="ug-skeleton" aria-hidden="true">${rows}</div><div class="ug-loading-note"><p class="boot-progress-text"><span data-boot-label>화면을 준비하고 있습니다.</span> <span data-boot-count aria-hidden="true"></span></p><div class="boot-progress-track" aria-hidden="true"><span class="boot-progress-bar" data-boot-bar></span></div></div></section><aside class="ug-panel ug-skel-panel" aria-hidden="true"><span class="ug-skel-name"></span><span class="ug-skel-name"></span><span class="ug-skel-cell"></span></aside></div></section>`;
    setStatus('');
  }
  // 표가 열리기 전에 학년 버튼을 누르면 그 학년을 기억해 두었다가 표를 그릴 때 쓴다.
  function gridPickGradeEarly(profileId) {
    if (!core.PROFILES[profileId] || state.ready) return;
    state.pendingProfileId = profileId;
    document.querySelectorAll('.ug-loading .ug-grade').forEach(button => button.setAttribute('aria-pressed', button.dataset.profile === profileId ? 'true' : 'false'));
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
    const options = `<details class="ug-options" id="ug-opts"${wide || (G.src.mode === 'school' && G.src.schools.length >= 2) ? ' open' : ''}><summary><span class="ug-options-title">문항 수 · 정리 순서</span><span class="ug-options-now" id="ug-opt-now">${escapeHtml(gridOptionsNow())}</span></summary>${amount}<div class="ug-order"><span class="ug-order-title" id="ug-order-title">정리 순서</span><div class="ug-orders" id="ug-orders" role="group" aria-labelledby="ug-order-title">${gridOrdersHtml()}</div></div><div id="ug-group">${gridGroupHtml(false)}</div></details>`;
    const hasChildren = (state.catalog?.units || []).some(unit => gridChildren(unit.key).length);
    const childHelp = hasChildren ? ` 단원 이름 옆 화살표를 누르면 ${gridUnitKindName()}이 펼쳐져 ${gridUnitKindName()}만 골라 만들 수도 있습니다.` : '';
    const types = `<details class="ug-options ug-types" id="ug-types"><summary><span class="ug-options-title">유형</span><span class="ug-options-now" id="ug-types-now">${escapeHtml(gridTypesNowText())}</span></summary><div class="ug-types-body" id="ug-types-body">${gridTypesBodyHtml()}</div></details>`;
    root.innerHTML = `<section class="ug">${gridTabsHtml()}${picker}<section class="ug-cond" id="ug-cond" aria-label="기출 조건">${gridCondHtml()}</section><p class="ug-help">단원 이름 앞 칸을 체크하고 단계 버튼을 누르면 체크한 단원 전체에 한 번에 적용됩니다. 칸을 따로 눌러 단원마다 다르게 고를 수도 있습니다.${childHelp} 칸의 숫자는 기출 문항 수입니다.</p><div class="ug-main"><section class="ug-table-wrap" aria-label="단원과 난이도 단계"><div class="ug-tools"><span class="ug-filter-note" id="ug-filter-note">${escapeHtml(gridFilterNoteHtml())}</span><button type="button" class="ug-link-btn" id="ug-clear" onclick="UnitPastExams.gridClear()"${G.cells.size || G.checked.size ? '' : ' disabled'}>선택 지우기</button></div><div id="ug-table" class="ug-table-box">${gridTableHtml()}</div><p class="ug-legend">검은 칸이 고른 칸입니다. 칸마다 문항 수를 정하면 ‘뽑는 수/있는 수’로 보이고, 주홍 테두리는 문항이 모자라 있는 만큼만 넣은 칸입니다. 점선 칸은 펼친 줄 일부만 고른 단원입니다.</p></section><aside class="ug-panel" aria-label="만들어진 문제지"><div class="ug-sum" id="ug-sum">${gridSummaryHtml()}</div>${options}${types}<div class="ug-go"><button type="button" class="ug-primary" id="ug-go" onclick="UnitPastExams.gridShowPapers()"${gridHasPapers() ? '' : ' disabled'}>문제지 보기</button></div></aside></div></section><div class="ug-bar" id="ug-bar" role="region" aria-label="만들어진 문제지 요약" aria-live="polite">${gridBarHtml()}</div>`;
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
      const label = gridPaperLabel(paper, result.order, result);
      const facts = [`${paper.count}문항`, `원본 시험지 ${paper.sourceCount}개${gridPaperSourceText(paper, result)}`];
      if (result.order !== 'recent') facts.push(gridYearText(paper));
      const paperScopes = paper.scopeNames && paper.scopeNames.length ? paper.scopeNames : paper.unitNames;
      const units = ((result.scopes || []).length > 1 || result.unitKeys.length > 1) && result.order !== 'unit' ? `<p class="ug-paper-units">${escapeHtml(paperScopes.join(' · '))}</p>` : '';
      const edited = paper.edited ? '<p class="ug-paper-edited">문항을 바꾼 권입니다. 출력·출제에 바꾼 문항이 쓰입니다. 표로 돌아가 선택을 바꾸면 바꾼 내용은 사라집니다.</p>' : '';
      const args = `'${GRID_UNIT_KEY}', '${paper.gridId}', this`;
      return `<li class="ug-paper" data-profile="${G.profileId}"><div class="ug-paper-no"><span class="ug-big">${paper.index}</span><small>권</small></div><div class="ug-paper-info"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(facts.join(' · '))}</p>${composition ? `<p class="ug-paper-steps">${escapeHtml(composition)}</p>` : ''}${units}${edited}</div><div class="ug-paper-actions"><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'exam')" aria-label="${escapeHtml(paper.title)} 시험지">시험지</button><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'sol')" aria-label="${escapeHtml(paper.title)} 해설">해설</button><button type="button" class="ug-btn" onclick="UnitPastExams.printPaper(${args}, 'ans')" aria-label="${escapeHtml(paper.title)} 정답">정답</button><button type="button" class="ug-btn ug-fix" title="미리 보고, 시험지 헤더와 문항을 고칩니다" onclick="UnitPastExams.gridOpenEdit('${paper.gridId}')" aria-label="${escapeHtml(paper.title)} 미리 보고 고치기">고치기</button><button type="button" class="ug-btn ug-compose" title="이 권의 문항 그대로 문제지 만들기를 열어, 보관함에 저장할 수 있게 합니다" onclick="UnitPastExams.openPaperInCompose(${args})" aria-label="${escapeHtml(paper.title)} 문제지 만들기에서 열기">문제지 만들기에서 열기</button><button type="button" class="ug-primary ug-assign" onclick="UnitPastExams.assignPaper(${args})" aria-label="${escapeHtml(paper.title)} 출제">출제</button></div></li>`;
    }).join('');
    // 2권 이상이면 한 번에 모두 출제하는 버튼을 더한다(화면 안 출제 패널일 때만: 옛 iframe 방식은 한 번에 한 권뿐이다).
    const assignAll = result.papers.length > 1 && assignPanelAvailable()
      ? `<button type="button" class="ug-primary ug-assign-all" onclick="UnitPastExams.assignAllPapers(this)">전체 출제 (${result.papers.length}권)</button>` : '';
    root.innerHTML = `<section class="ug ug-papers"><div class="ug-papers-head"><button type="button" class="ug-btn" onclick="UnitPastExams.gridBack()">표로 돌아가기</button><div><h2>${escapeHtml(gridResultTitle(result))}</h2><p class="ug-papers-count"><span class="ug-big">${result.total.toLocaleString()}문항</span><strong>문제지 ${result.papers.length}권</strong><span class="ug-papers-order">${escapeHtml(result.groupBy === 'school' ? `학교별로 한 권씩 · ${orderLabel}` : orderLabel)}</span></p></div>${assignAll}</div>${note}<p class="ug-help">한 권은 약 50문항(최대 80문항)으로 나눕니다. 출력이 오래 걸리지 않게 하고, 같은 시험의 문항은 되도록 한 권에 모았습니다.</p><ol class="ug-paper-list" aria-label="문제지 목록">${cards}</ol></section>`;
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
  // 단원 전체 칸은 그 단계의 중단원 칸을 모두 품으므로, 단원 전체 칸을 켤 때 같은 단계의 중단원 칸은 지운다.
  function gridDropChildCells(unitKey, token) {
    for (const key of [...G.cells]) {
      const parsed = gridParseKey(key);
      if (parsed.childKey && parsed.unitKey === unitKey && parsed.step === token) G.cells.delete(key);
    }
  }
  function gridToggleCell(unitKey, token, childKey = '') {
    if (!(gridCountsOf(unitKey, childKey)?.[token] > 0)) return;
    const unitCell = gridKey(unitKey, token);
    if (!childKey) {
      if (G.cells.has(unitCell)) G.cells.delete(unitCell);
      else { gridDropChildCells(unitKey, token); G.cells.add(unitCell); }
    } else if (G.cells.has(unitCell)) {
      // 단원 전체에 들어 있던 중단원 하나를 끄면: 단원 전체 칸을 풀고 나머지 중단원 칸을 켠다(문항이 있는 것만).
      G.cells.delete(unitCell);
      for (const child of gridChildren(unitKey)) {
        if (child.key !== childKey && (G.counts[unitKey]?.children?.[child.key]?.[token] || 0) > 0) G.cells.add(gridKey(unitKey, token, child.key));
      }
    } else {
      const key = gridKey(unitKey, token, childKey);
      if (G.cells.has(key)) G.cells.delete(key); else G.cells.add(key);
    }
    gridRefresh();
  }
  function gridToggleOpen(unitKey) {
    if (!gridChildren(unitKey).length) return;
    if (G.open.has(unitKey)) G.open.delete(unitKey); else G.open.add(unitKey);
    gridWriteStore();
    gridPatch('ug-table', gridTableHtml());
  }
  function gridToggleType(index) {
    const key = G.typeRows[Number(index)];
    if (!key) return;
    if (G.typeOff.has(key)) G.typeOff.delete(key); else G.typeOff.add(key);
    gridApplyCounts();
    gridRefresh();
  }
  // 보이는 유형("유형 미지정" 포함)을 모두 끈다: 유형이 많을 때 필요한 것 하나만 켜서 남기기 쉽게.
  function gridTypesOffAll() {
    if (!G.typeRows.length) return;
    G.typeRows.forEach(key => G.typeOff.add(key));
    gridApplyCounts();
    gridRefresh();
  }
  function gridResetTypes() {
    if (!G.typeOff.size) return;
    G.typeOff.clear();
    gridApplyCounts();
    gridRefresh();
  }
  // 옛 주소로 열렸을 때: 체크된 단원 행으로 스크롤하고 잠깐 강조한다(휴대폰에서는 행이 화면 아래에 있어 안 보였다).
  function gridFlashUnit(unitKey) {
    if (typeof document.querySelector !== 'function' || typeof window.setTimeout !== 'function') return;
    window.setTimeout(() => {
      const row = document.querySelector(`.ug-row[data-unit="${unitKey}"]`);
      if (!row) return;
      const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      if (row.classList) {
        row.classList.add('is-flash');
        window.setTimeout(() => row.classList.remove('is-flash'), 2600);
      }
    }, 120);
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
      if (everyOn) G.cells.delete(key);
      else { gridDropChildCells(unit.key, token); G.cells.add(key); }
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
  function gridPaperLabel(paper, order, result) {
    let base;
    if (order === 'unit') base = (paper.scopeNames && paper.scopeNames.length ? paper.scopeNames : paper.unitNames).join(' · ') || paper.title;
    else if (order === 'step') base = core.selectionStepLabel([...new Set(paper.records.map(record => core.getStepToken(record)))]) || paper.title;
    else base = result && result.groupBy === 'school' ? gridYearRange(paper) : gridYearText(paper);
    // 학교별로 한 권씩이면 그 권이 어느 학교 것인지가 가장 먼저 보여야 한다.
    return result && result.groupBy === 'school' && paper.school ? `${paper.school} · ${base}` : base;
  }
  // 조건 줄을 쓴 권만: 이 권이 어느 학교·어느 연도 시험에서 왔는지 한 줄로("이 학교는 이 단원을 이렇게 낸다"). 조건이 없으면 옛 줄 그대로.
  function gridYearRange(paper) {
    if (!paper.yearMax) return '연도 미상';
    return paper.yearMax === paper.yearMin ? `${paper.yearMax}년` : `${paper.yearMin}~${paper.yearMax}년`;
  }
  function gridPaperSourceText(paper, result) {
    // 학교별로 한 권씩이면 줄 제목에 이미 학교·연도가 있으므로 되풀이하지 않는다.
    if (!result || !result.sourceKey || result.groupBy === 'school') return '';
    const names = (paper.schools || []).map(school => school.label);
    const who = names.length > 3 ? `${names.slice(0, 3).join('·')} 외 ${names.length - 3}교` : names.join('·');
    const text = [who, gridYearRange(paper)].filter(Boolean).join(' ');
    return text ? ` · ${text}` : '';
  }

  // ---- 권 고치기: 미리보기·시험지 헤더 편집·문항 교체 화면(renderConfirmation)으로 그 권을 연다. 모양은 다음 묶음(1b)에서 바꾼다 ----
  function gridOpenEdit(gridId, options = {}) {
    const paper = (G.result?.papers || []).find(item => item.gridId === gridId);
    if (!paper) return;
    G.editing = gridId;
    G.view = 'edit';
    state.selectedUnitKey = G.result.snapshotUnitKey;
    resetQuestionReplacementState({ disableEditMode: true });
    // 고치는 동안은 복사본을 쓰고, 권 목록으로 돌아갈 때 바뀐 내용을 그 권에 되돌려 쓴다.
    state.generatedPapers = [{
      ...paper, unitKey: state.selectedUnitKey, index: `generated-${gridId}`, baseSnapshotKey: paper.baseSnapshotKey || paper.snapshotKey,
      excludedTypeKeys: [...(G.result?.excludedTypeKeys || [])],
      sourceFilter: G.sourceFilter && G.sourceFilter.active ? G.sourceFilter : null,
      onlySchoolKey: G.result?.groupBy === 'school' ? paper.schoolKey : '',
      records: paper.records.map(record => ({ ...record })), outputEnvelopeCache: undefined,
      printHeaderOptions: paper.printHeaderOptions ? { ...paper.printHeaderOptions } : undefined
    }];
    state.previewPaperPosition = 0;
    state.previewLoadToken += 1;
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
      scopeNames: (G.result?.scopes || []).length
        ? G.result.scopes.filter(scope => records.some(record => record.mappedUnitKey === scope.unitKey && (!scope.childKey || G.tree?.childKeyOf(scope.unitKey, record) === scope.childKey))).map(scope => scope.label)
        : target.scopeNames,
      sections: core.buildSelectionSections(records, target.sectionOptions),
      printHeaderOptions: edited.printHeaderOptions, outputEnvelopeCache: undefined, snapshotGeneratedAt: undefined
    });
  }
  function gridCloseEdit() {
    gridCommitEdit();
    G.editing = '';
    state.generatedPapers = [];
    state.selectedUnitKey = '';
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
    if (state.ready) gridRestoreFromUrl();
  });
  window.UnitPastExams = { init, renderSafeFallback, renderGrid, gridRestoreFromUrl, gridPickGradeEarly, gridOpenEdit, gridLeaveEdit, gridSelectGrade, gridClearGrade, gridSetCourse, gridSetSrc, gridSetRange, gridSchoolQuery, gridSchoolKey, gridAddSchool, gridRemoveSchool, gridSchoolEdit, gridCondOpen, gridCondClose, gridCondReset, gridTypesOffAll, gridToggleCell, gridToggleOpen, gridToggleType, gridResetTypes, gridToggleUnit, gridApplyStep, gridClear, gridSetAmount, gridSetPer, gridStepPer, gridSetOrder, gridShowPapers, gridBack, selectPreviewPaper, tunePreviewFrame, updatePrintHeaderOption, toggleQuestionEditMode, selectPreviewQuestion, setReplacementFilter, setReplacementCandidatePage, quickReplaceSelectedQuestion, replaceSelectedQuestion, undoLastQuestionReplacement, printPaper, assignPaper, assignAllPapers, openPaperInCompose, composeEntryUrl };
  window.High1UnitPastExams = window.UnitPastExams;
})();
