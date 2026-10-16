(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const ui = {
    canvas: $('space'), status: $('catalogStatus'), count: $('sceneCount'), search: $('search'),
    grade: $('gradeFilter'), school: $('schoolFilter'), year: $('yearFilter'), term: $('termFilter'), subject: $('subjectFilter'), unit: $('unitFilter'),
    filterPanel: $('filterPanel'), filterToggle: $('filterToggle'), focusedChip: $('focusedChip'),
    drawer: $('examDrawer'), frame: $('examFrame'), previewLoadState: $('previewLoadState'), previewLoadMessage: $('previewLoadMessage'),
    title: $('examTitle'), meta: $('examMeta'), source: $('examSource'), previewHeading: $('previewHeading'), advancedQuestions: $('advancedQuestions'),
    openOriginal: $('openOriginal'), openFullSolution: $('openFullSolution'), composeExam: $('composeExam'), printOriginal: $('printOriginal'), previewHeadingTitle: $('previewHeadingTitle'), previewHeadingDescription: $('previewHeadingDescription'), labels: $('planetLabels'), facetSpaceLabels: $('facetSpaceLabels'), satelliteLabels: $('satelliteLabels'),
    focusName: $('focusedSchoolName'), focusMeta: $('focusedSchoolMeta'), mobileExamList: $('mobileExamList'),
    mobileFocusHeader: $('mobileFocusHeader'), mobileFocusBreadcrumb: $('mobileFocusBreadcrumb'), toast: $('toast'),
    listPanel: $('listPanel'), listGroups: $('listGroups'),
    questionOrbit: $('questionOrbit'), questionStatus: $('questionStatus'),
    readerToolbar: $('questionToolbar'), readerTitle: $('readerQuestionTitle'), readerSelect: $('questionSelect'),
    instantTravel: $('instantTravel'),
    atlasExamCount: $('atlasExamCount'), atlasGroupCount: $('atlasGroupCount'), atlasDetailCount: $('atlasDetailCount'),
    atlasExplore: $('atlasExplore'), atlasOverview: $('atlasOverview'), atlasPanel: $('atlasPanel'), atlasCollapse: $('atlasCollapse'),
    scaleRail: $('scaleRail'), scaleLabel: $('scaleLabel'), scaleCaption: $('scaleCaption'),
    galaxyNav: $('galaxyNav'), galaxyNavGroups: $('galaxyNavGroups'),
    facetNav: $('facetNav'), facetSummary: $('facetSummary'), clearFacetSelections: $('clearFacetSelections'),
    facetGrade: $('facetGrade'), facetTerm: $('facetTerm'), facetYear: $('facetYear'), facetSchool: $('facetSchool'), facetSubject: $('facetSubject'), selectCurrentRange: $('selectCurrentRange'),
  };
  const state = {
    exams: [], catalogExamCount: 0, records: [], filtered: [], visibleGroups: [], visibleExams: [], selectedExam: null,
    focusedGroupId: '', groupMode: 'curriculum', list: false,
    world: null, tagsByFile: new Map(), filesByTag: new Map(), groupsById: new Map(),
    groupLabels: new Map(), satelliteButtons: new Map(), toastTimer: 0, searchTimer: 0,
    pointer: null, hoveredGroupId: '', hoveredLabelGroupId: '',
    questionRows: [], selectedQuestion: null, readerMode: 'exam', readerGeneration: 0, questionLoadGeneration: 0, examReturnScrollY: 0,
    examGeneration: 0, frameGeneration: 0, entrySnapshot: null, pendingExamFocus: '', instant: false,
    examsByFile: new Map(), scaleMode: 'macro', atlasCollapsed: false, solutionFallback: false,
    galaxyNavigationSections: [], galaxyNavResizeObserver: null,
  };
  const galaxyNavigation = window.APGalaxyNavigationModel;
  const clean = (value) => String(value ?? '').normalize('NFC').trim();
  const examTitle = (exam) => {
    const type = exam.examType === 'final' ? '기말고사' : '중간고사';
    const semester = exam.semester ? exam.semester + '학기 ' : '';
    return [exam.year ? exam.year + '년' : '', semester + type, exam.school, exam.grade, exam.subject].filter(Boolean).join(' · ');
  };
  const satelliteLabelLines = (exam) => {
    const year = clean(exam.year);
    const semester = clean(exam.semester);
    const examType = clean(exam.examType);
    const semesterLabel = semester === '1' || semester === '2' ? semester + '학기' : semester;
    const examTypeLabel = examType === 'mid' ? '중간' : examType === 'final' ? '기말' : examType;
    const period = [year, [semesterLabel, examTypeLabel].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
    const school = clean(exam.school);
    const grade = clean(exam.grade);
    const subject = clean(exam.subject);
    const subjectLabel = grade && subject.startsWith(grade) ? subject.slice(grade.length).trim() : subject;
    const identity = [school, grade, subjectLabel].filter(Boolean).join(' · ');
    return { period, identity };
  };
  const examTags = (exam) => [...(state.tagsByFile.get(exam.file) || [])];
  const normalizedField = (value) => clean(value).toLocaleLowerCase('ko');
  const showToast = (message) => {
    ui.toast.textContent = message;
    ui.toast.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 2500);
  };
  function updateScaleUI(mode = state.scaleMode) {
    state.scaleMode = mode;
    const labels = { macro: 'COSMIC WEB', planet: 'GALAXY', micro: 'QUESTION CONCEPT' };
    const captions = {
      macro: '',
      planet: '은하를 살펴보고 시험지 위성을 선택하세요.',
      micro: '문항 속 개념을 살펴보는 설명용 시각화입니다.',
    };
    if (ui.scaleLabel) ui.scaleLabel.textContent = labels[mode] || labels.macro;
    if (ui.scaleCaption) {
      ui.scaleCaption.textContent = captions[mode] || '';
      ui.scaleCaption.hidden = !captions[mode];
    }
    ui.scaleRail?.querySelectorAll('[data-scale-mode]').forEach((button) => {
      const active = button.dataset.scaleMode === mode;
      button.setAttribute('aria-pressed', String(active));
      if (button.dataset.scaleMode === 'planet' || button.dataset.scaleMode === 'micro') {
        button.disabled = Boolean(state.selectedExam) || !state.focusedGroupId;
      } else if (button.dataset.scaleMode === 'macro') {
        button.disabled = Boolean(state.selectedExam);
      }
    });
  }
  function setAtlasCollapsed(collapsed) {
    state.atlasCollapsed = Boolean(collapsed);
    ui.atlasPanel?.classList.toggle('collapsed', state.atlasCollapsed);
    if (ui.atlasCollapse) {
      ui.atlasCollapse.setAttribute('aria-expanded', String(!state.atlasCollapsed));
      ui.atlasCollapse.textContent = state.atlasCollapsed ? '+' : '−';
      ui.atlasCollapse.setAttribute('aria-label', state.atlasCollapsed ? 'catalog 요약 열기' : 'catalog 요약 닫기');
    }
  }
  const optionValues = (select, values, label, format = (value) => value) => {
    const selected = select.value;
    select.replaceChildren(new Option('전체 ' + label, ''));
    for (const value of values) select.add(new Option(format(value), value));
    if (values.includes(selected)) select.value = selected;
  };
  const subjectFacetValue = (exam) => {
    const sourceCourse = exam.primaryStandardCourse || exam.courseRanges?.[0]?.standardCourse || exam.subject;
    return galaxyNavigation.displayCourseName(sourceCourse);
  };
  const currentFilters = () => ({
    grade: ui.grade.value,
    school: ui.school.value,
    year: ui.year.value,
    term: ui.term?.value || '',
    subject: ui.subject?.value || '',
    unit: ui.unit.value,
    query: normalizedField(ui.search.value),
  });
  const matchesFilters = (exam, filters) => {
    if (filters.grade && exam.grade !== filters.grade) return false;
    if (filters.school && exam.school !== filters.school) return false;
    if (filters.year && String(exam.year) !== filters.year) return false;
    if (filters.term) {
      const [semester, examType] = filters.term.split(':');
      if (semester && String(exam.semester) !== semester) return false;
      if (examType && exam.examType !== examType) return false;
    }
    if (filters.subject && subjectFacetValue(exam) !== filters.subject) return false;
    const tags = state.tagsByFile.get(exam.file);
    if (filters.unit && !tags?.has(filters.unit)) return false;
    if (!filters.query) return true;
    return [exam.school, exam.grade, subjectFacetValue(exam), exam.subject, exam.topic, exam.year, exam.file, ...(tags || [])]
      .some((part) => normalizedField(part).includes(filters.query));
  };
  const filterExams = () => {
    const filters = currentFilters();
    return state.exams.filter((exam) => matchesFilters(exam, filters))
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0) || clean(a.school).localeCompare(clean(b.school), 'ko'));
  };
  const termKey = (exam) => [clean(exam.semester), clean(exam.examType)].filter(Boolean).join(':');
  const termLabel = (key) => {
    const [semester, examType] = String(key || '').split(':');
    const semesterLabel = semester === '1' || semester === '2' ? semester + '학기' : semester;
    const typeLabel = examType === 'mid' ? '중간' : examType === 'final' ? '기말' : examType;
    return [semesterLabel, typeLabel].filter(Boolean).join(' ');
  };
  const facetValues = {
    grade: (exam) => clean(exam.grade),
    term: (exam) => termKey(exam),
    year: (exam) => clean(exam.year),
    school: (exam) => clean(exam.school),
    subject: subjectFacetValue,
  };
  const facetLabel = (kind, value) => kind === 'term' ? termLabel(value) : value;
  function renderFacets() {
    if (!ui.facetNav) return [];
    const current = currentFilters();
    const kinds = ['grade', 'term', 'year', 'school', 'subject'];
    const controls = { grade: ui.facetGrade, term: ui.facetTerm, year: ui.facetYear, school: ui.facetSchool, subject: ui.facetSubject };
    const facetNodes = [];
    for (const kind of kinds) {
      const base = { ...current, query: current.query };
      if (kind === 'grade') base.grade = '';
      if (kind === 'term') base.term = '';
      if (kind === 'year') base.year = '';
      if (kind === 'school') base.school = '';
      if (kind === 'subject') base.subject = '';
      const values = [...new Set(state.exams.map(facetValues[kind]).filter(Boolean))];
      values.sort((a, b) => kind === 'year' ? Number(b) - Number(a) : facetLabel(kind, a).localeCompare(facetLabel(kind, b), 'ko'));
      const container = controls[kind];
      if (!container) continue;
      container.replaceChildren();
      for (const value of values) {
        const countFilters = { ...base, [kind]: value };
        const count = new Set(state.exams.filter((exam) => matchesFilters(exam, countFilters)).map((exam) => exam.file)).size;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'facet-node';
        button.dataset.facetKind = kind;
        button.dataset.facetValue = value;
        button.setAttribute('aria-pressed', String(current[kind] === value));
        button.disabled = count === 0 && current[kind] !== value;
        button.setAttribute('aria-label', facetLabel(kind, value) + ' · ' + count + '개 시험지');
        button.innerHTML = '<span>' + facetLabel(kind, value) + '</span>';
        container.append(button);
        facetNodes.push({
          id: kind + ':' + value,
          kind,
          value,
          label: facetLabel(kind, value),
          count,
          selected: current[kind] === value,
          disabled: count === 0 && current[kind] !== value,
          priority: (kind === 'grade' && /^중[123]$/.test(value)) || (kind === 'subject' && /^(공통수학1|공통수학2|대수|미적분I|미적분II|확률과 통계|기하)$/.test(value) && state.exams.some((exam) => subjectFacetValue(exam) === value && /^고/.test(clean(exam.grade)))),
          worldVisible: count > 0 &&
            (kind !== 'grade' || /^\uC911[123]$/.test(value)) &&
            (kind !== 'subject' || state.exams.some((exam) => subjectFacetValue(exam) === value && /^\uACE0/.test(clean(exam.grade)))) &&
            (kind !== 'term' || Boolean(current.grade)) &&
            (kind !== 'year' || Boolean(current.grade && current.term)) &&
            (kind !== 'school' || Boolean(current.grade && current.term && current.year)),
        });
      }
      if (!values.length) {
        const empty = document.createElement('span');
        empty.className = 'facet-empty';
        empty.textContent = '자료 없음';
        container.append(empty);
      }
    }
    for (const node of facetNodes) {
      node.priority = node.priority ||
        (node.kind === 'term' && Boolean(current.grade)) ||
        (node.kind === 'year' && Boolean(current.grade && current.term)) ||
        (node.kind === 'school' && Boolean(current.grade && current.term && current.year));
    }
    const active = [current.grade, current.subject, current.term && termLabel(current.term), current.year, current.school].filter(Boolean);
    ui.facetSummary.textContent = active.length ? active.join(' · ') : '학년·과목·시험·연도·학교 기준을 고르세요.';
    return facetNodes;
  }
  function applyFacet(kind, value) {
    const select = kind === 'grade' ? ui.grade : kind === 'term' ? ui.term : kind === 'year' ? ui.year : kind === 'school' ? ui.school : ui.subject;
    if (!select) return;
    select.value = select.value === value ? '' : value;
    ui.search.value = '';
    renderScene();
  }
  function openCurrentRangeComposer() {
    if (!state.filtered.length) {
      showToast('현재 범위에 자료가 없습니다.');
      return;
    }
    const files = [...new Set(state.filtered.map((exam) => exam.file).filter(Boolean))];
    const url = new URL('../../workspace.html', location.href);
    url.searchParams.set('view', 'compose');
    url.searchParams.set('range', 'all');
    for (const file of files) url.searchParams.append('source', file);
    window.location.href = url.href;
  }
  function renderFacetSpaceLabels(nodes) {
    if (!ui.facetSpaceLabels) return;
    ui.facetSpaceLabels.replaceChildren();
    for (const node of nodes) {
      const label = document.createElement('div');
      label.className = 'facet-space-label facet-space-value';
      label.dataset.facetId = node.id;
      label.dataset.facetKind = node.kind;
      label.dataset.priority = String(Boolean(node.priority));
      label.dataset.selected = String(node.selected);
      label.innerHTML = '<b>' + node.label + '</b><span class="facet-space-count">' + node.count + '</span>';
      ui.facetSpaceLabels.append(label);
    }
  }
  const curriculumGroupKeyForExam = (exam) => galaxyNavigation.curriculumGroupForExam(exam);
  const groupKeyForExam = (exam) => {
    if (state.groupMode === 'school') {
      const school = clean(exam.school) || '학교 미상';
      return { id: 'school:' + school, name: school, order: 0 };
    }
    return curriculumGroupKeyForExam(exam);
  };
  const groupExams = (exams) => {
    const groups = new Map();
    for (const exam of exams) {
      const key = groupKeyForExam(exam);
      if (!groups.has(key.id)) groups.set(key.id, { ...key, mode: state.groupMode, exams: [] });
      groups.get(key.id).exams.push(exam);
    }
    return [...groups.values()].sort((a, b) => (a.order - b.order) || a.name.localeCompare(b.name, 'ko'));
  };
  function syncGalaxyNavigation() {
    ui.galaxyNavGroups?.querySelectorAll('[data-galaxy-id]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.galaxyId === state.focusedGroupId));
    });
  }
  function renderGalaxyNavigation() {
    if (!ui.galaxyNavGroups || !galaxyNavigation) return;
    state.galaxyNavigationSections = galaxyNavigation.buildNavigationSections(state.exams);
    ui.galaxyNavGroups.replaceChildren();
    for (const section of state.galaxyNavigationSections) {
      const sectionElement = document.createElement('section');
      sectionElement.className = 'galaxy-nav-group';
      sectionElement.dataset.navGroup = section.id;
      const heading = document.createElement('h2');
      heading.textContent = section.label;
      const items = document.createElement('div');
      items.className = 'galaxy-nav-items';
      for (const item of section.items) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'galaxy-nav-link';
        button.dataset.galaxyId = item.id;
        button.textContent = item.name;
        button.disabled = item.count === 0;
        button.setAttribute('aria-pressed', String(item.id === state.focusedGroupId));
        const scopeLabel = section.id === 'high2' ? '고2 자료 ' : '';
        button.setAttribute('aria-label', item.name + ' 은하 · ' + scopeLabel + item.count.toLocaleString() + '개 시험지 · 눌러서 이동');
        items.append(button);
      }
      sectionElement.append(heading, items);
      ui.galaxyNavGroups.append(sectionElement);
    }
    updateGalaxyNavigationOffset();
  }
  function updateGalaxyNavigationOffset() {
    const universe = $('universe');
    if (!universe || !ui.galaxyNav) return;
    const navBottom = ui.galaxyNav.getBoundingClientRect().bottom - universe.getBoundingClientRect().top;
    if (Number.isFinite(navBottom)) universe.style.setProperty('--galaxy-nav-offset', `${Math.ceil(navBottom + 12)}px`);
  }
  function syncGroupModeButtons() {
    $('groupModes').querySelectorAll('[data-group-mode]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.groupMode === state.groupMode));
    });
  }
  function navigateToGalaxy(id) {
    const target = state.galaxyNavigationSections.flatMap((section) => section.items).find((item) => item.id === id);
    if (!target || target.count === 0) return;
    const snapshot = state.entrySnapshot || captureNavigation();
    if (state.selectedExam) closeExam({ restore: false });
    state.entrySnapshot = snapshot;
    if (state.list) toggleList(false);
    state.groupMode = 'curriculum';
    syncGroupModeButtons();
    ui.grade.value = '';
    ui.school.value = '';
    ui.year.value = '';
    if (ui.term) ui.term.value = '';
    if (ui.subject) ui.subject.value = '';
    ui.unit.value = '';
    ui.search.value = '';
    state.focusedGroupId = '';
    state.world?.clearFocus();
    renderScene();
    focusGroup(id);
    syncGalaxyNavigation();
  }
  const selectVisibleData = (allGroups) => {
    const groups = allGroups;
    const visibleExams = [];
    const cursors = new Map(groups.map((group) => [group.id, 0]));
    const maxNodes = window.innerWidth < 760 ? 54 : 96;
    while (visibleExams.length < maxNodes) {
      let advanced = false;
      for (const group of groups) {
        const cursor = cursors.get(group.id);
        if (cursor >= group.exams.length) continue;
        visibleExams.push(group.exams[cursor]);
        cursors.set(group.id, cursor + 1);
        advanced = true;
        if (visibleExams.length >= maxNodes) break;
      }
      if (!advanced) break;
    }
    // A selection from the full list or point LOD must occupy an existing
    // detailed-star slot, without raising the desktop/mobile 96/54 budget.
    const featuredFile = state.selectedExam?.file;
    if (featuredFile && !visibleExams.some((exam) => exam.file === featuredFile)) {
      const featuredGroup = groups.find((group) => group.exams.some((exam) => exam.file === featuredFile));
      const featuredExam = featuredGroup?.exams.find((exam) => exam.file === featuredFile);
      if (featuredExam) {
        const replaceIndex = visibleExams.findLastIndex((exam) => groupKeyForExam(exam).id === featuredGroup.id);
        if (visibleExams.length < maxNodes) visibleExams.push(featuredExam);
        else if (replaceIndex >= 0) visibleExams[replaceIndex] = featuredExam;
        else visibleExams[visibleExams.length - 1] = featuredExam;
      }
    }
    const drawnByGroup = new Map();
    for (const exam of visibleExams) {
      const key = groupKeyForExam(exam);
      if (!drawnByGroup.has(key.id)) drawnByGroup.set(key.id, []);
      drawnByGroup.get(key.id).push(exam);
    }
    for (const group of groups) {
      const items = drawnByGroup.get(group.id) || [];
      // The existing 12-label limit remains; keep the active detailed node
      // among the visible labels when its group is focused.
      const selectedIndex = items.findIndex((exam) => exam.file === featuredFile);
      if (selectedIndex > 0) items.unshift(...items.splice(selectedIndex, 1));
      group.items = items;
    }
    return { groups, visibleExams };
  };

  function sourceUrl(exam, { preview = true, loadGeneration = 0, mode = 'exam' } = {}) {
    const url = new URL('../../engine.html', location.href);
    const params = new URLSearchParams();
    params.set('data', 'exams/' + exam.file);
    params.set('mode', mode);
    if (preview) {
      params.set('preview', '1');
      params.set('ap_galaxy_load', String(loadGeneration));
      params.set('renderer', 'legacy');
    }
    params.set('title', examTitle(exam));
    params.set('subject', exam.subject || '');
    if (exam.qCount) params.set('q', String(exam.qCount));
    url.search = params.toString();
    return url.href;
  }
  function captureNavigation() {
    return {
      camera: state.world?.snapshotNavigation() || null,
      mode: state.groupMode, groupId: state.focusedGroupId,
      search: ui.search.value, grade: ui.grade.value, school: ui.school.value,
      unit: ui.unit.value, year: ui.year.value, term: ui.term?.value || '', subject: ui.subject?.value || '',
    };
  }
  function restoreNavigation(snapshot) {
    if (!snapshot) return;
    state.groupMode = snapshot.mode;
    state.focusedGroupId = snapshot.groupId;
    ui.search.value = snapshot.search;
    for (const field of ['grade', 'school', 'unit', 'year', 'term', 'subject']) if (ui[field]) ui[field].value = snapshot[field] || '';
    $('groupModes').querySelectorAll('[data-group-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.groupMode === state.groupMode));
    });
    renderScene();
    if (!state.world?.restoreNavigation(snapshot.camera)) state.world?.resetCamera();
    renderSatelliteLabels();
    syncGalaxyNavigation();
  }
  function renderQuestionOrbit(rows) {
    ui.questionOrbit.replaceChildren();
    ui.readerSelect.replaceChildren();
    for (const row of rows) {
      const option = document.createElement('option');
      option.value = row.id;
      option.textContent = 'Q' + row.ordinal;
      ui.readerSelect.append(option);
    }
    for (const row of rows) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'question-orbit-node';
      button.dataset.questionId = row.id;
      button.classList.toggle('selected', state.selectedQuestion?.id === row.id);
      button.textContent = String(row.ordinal);
      button.title = '원본 문항 ID ' + row.id + ' · ' + row.ordinal + '번째 문항 열기';
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => selectQuestion(row));
      ui.questionOrbit.appendChild(button);
    }
    // Advanced picker stays in the paper panel. No default 3D question satellites.
  }
  function clearQuestionOrbit() {
    ui.questionOrbit.replaceChildren();
    ui.readerSelect.replaceChildren();
    state.questionRows = [];
    state.selectedQuestion = null;
    state.world?.clearQuestionOrbit();
    ui.readerToolbar.hidden = true;
    ui.questionStatus.hidden = true;
    window.APOrbitQuestionReader?.clearFocus(ui.frame);
  }
  function setQuestionStatus(message) {
    ui.questionStatus.hidden = !message;
    ui.questionStatus.textContent = message;
  }
  function setInlinePreviewState(kind = 'idle') {
    const loading = kind === 'loading';
    const failed = kind === 'failed';
    ui.previewLoadState.hidden = !loading && !failed;
    ui.previewLoadState.dataset.state = kind;
    ui.previewLoadState.setAttribute('role', failed ? 'alert' : 'status');
    ui.previewLoadMessage.textContent = failed
      ? '미리보기를 불러오지 못했습니다. 위의 “출력”에서 시험지를 열어 주세요.'
      : '원본 시험지의 문항을 불러오는 중…';
    ui.previewLoadState.parentElement.setAttribute('aria-busy', String(loading));
  }
  async function waitForInlinePreview(exam, examToken, frameToken, frame = ui.frame) {
    const deadline = performance.now() + 60000;
    while (performance.now() < deadline) {
      if (state.examGeneration !== examToken || state.frameGeneration !== frameToken ||
          state.selectedExam?.file !== exam.file || ui.frame !== frame) return false;
      try {
        const win = frame.contentWindow;
        const doc = frame.contentDocument;
        if (win && doc && win.location.origin === location.origin) {
          const url = new URL(win.location.href);
          const expectedLoad = url.pathname.endsWith('/archive/engine.html') &&
            url.searchParams.get('data') === 'exams/' + exam.file &&
            url.searchParams.get('preview') === '1' &&
            url.searchParams.get('ap_galaxy_load') === String(frameToken);
          if (expectedLoad && doc.documentElement?.dataset?.apRenderError) {
            setInlinePreviewState('failed');
            return false;
          }
          if (expectedLoad && doc.readyState === 'complete') {
            const questions = Array.from(doc.querySelectorAll('#print-area .q-box[data-source-ref]'));
            const expectedCount = Number(state.questionRows.length || exam.qCount || 0);
            const hasRenderedQuestions = expectedCount > 0 && questions.length >= expectedCount &&
              questions.slice(0, expectedCount).every(question => question.textContent.trim().length > 0);
            if (hasRenderedQuestions) {
              setInlinePreviewState('idle');
              return true;
            }
          }
        }
      } catch (_) { /* The embedded document can be mid-navigation. */ }
      await new Promise(resolve => window.setTimeout(resolve, 120));
    }
    if (state.examGeneration === examToken && state.frameGeneration === frameToken &&
        state.selectedExam?.file === exam.file && ui.frame === frame) {
      setInlinePreviewState('failed');
    }
    return false;
  }
  function modeName(mode) {
    return mode === 'ans' ? '정답' : mode === 'sol' ? '해설' : '문제';
  }
  function resetPreviewHeading(exam) {
    ui.previewHeading.hidden = true;
    ui.previewHeadingTitle.textContent = '';
    ui.previewHeadingDescription.textContent = '';
    ui.openOriginal.href = sourceUrl(exam, { preview: false });
    ui.openOriginal.textContent = '새 창 ↗';
    ui.frame.title = '선택한 원본 시험지 미리보기';
    state.solutionFallback = false;
  }
  async function openWholeSolution(row, examToken) {
    const exam = state.selectedExam;
    if (!exam || state.examGeneration !== examToken || !row) return false;
    state.solutionFallback = true;
    const readerToken = ++state.readerGeneration;
    const frameToken = ++state.frameGeneration;
    const solutionUrl = sourceUrl(exam, { mode: 'sol', loadGeneration: frameToken });
    const examUrl = sourceUrl(exam, { mode: 'exam', loadGeneration: frameToken });
    ui.readerTitle.textContent = '문항 ' + row.id + ' · 전체 해설 새 창';
    ui.previewHeading.hidden = false;
    ui.previewHeadingTitle.textContent = '해설 새 창';
    ui.previewHeadingDescription.textContent = '문항별 해설 전환을 멈추고 정상 원본 경로를 제공합니다.';
    ui.openOriginal.href = solutionUrl;
    ui.openOriginal.textContent = '전체 해설 새 창 ↗';
    ui.frame.title = '선택한 원본 시험지 미리보기';
    // The embedded legacy renderer does not settle its solution DOM when its
    // mode is changed in-place. Restore the known-good exam preview immediately;
    // the adjacent link opens the same source's normal full-solution route.
    const examFrame = ui.frame.cloneNode(false);
    examFrame.removeAttribute('src');
    examFrame.title = '선택한 원본 시험지 미리보기';
    ui.frame.replaceWith(examFrame);
    ui.frame = examFrame;
    setInlinePreviewState('loading');
    ui.frame.src = examUrl;
    waitForInlinePreview(exam, examToken, frameToken, ui.frame);
    if (state.readerGeneration === readerToken && state.examGeneration === examToken) {
      setQuestionStatus('문항별 해설을 미리보기에서 열지 못해 전체 시험지로 돌아왔습니다. 위의 “전체 해설 새 창”에서 공개 원본 해설을 여세요. 선택 문항은 ' + row.ordinal + '번입니다.');
    }
    return true;
  }
  async function setReaderMode(mode) {
    const row = state.selectedQuestion;
    if (!row || !state.selectedExam) return;
    const token = ++state.readerGeneration;
    const examToken = state.examGeneration;
    const frameToken = state.frameGeneration;
    const file = state.selectedExam.file;
    state.readerMode = mode;
    ui.readerTitle.textContent = '문항 ' + row.id + ' · ' + modeName(mode);
    ui.readerToolbar.querySelectorAll('[data-reader-mode]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.readerMode === mode)));
    if (mode === 'sol' && state.solutionFallback) {
      setQuestionStatus('위의 “전체 해설 새 창”에서 공개 원본 해설을 여세요. 선택 문항은 ' + row.ordinal + '번입니다.');
      return;
    }
    if (mode !== 'sol') resetPreviewHeading(state.selectedExam);
    if (mode !== 'exam') setInlinePreviewState('loading');
    setQuestionStatus('문항 ' + row.id + ' ' + modeName(mode) + '를 여는 중…');
    try {
      const result = await window.APOrbitQuestionReader.focus(ui.frame, row, mode,
        { file, loadGeneration: frameToken },
        () => state.readerGeneration === token && state.examGeneration === examToken &&
          state.frameGeneration === frameToken && state.selectedExam?.file === file &&
          state.selectedQuestion === row,
        mode === 'sol' ? 8500 : 20000);
      if (state.readerGeneration !== token) return;
      if (mode !== 'exam') setInlinePreviewState('idle');
      setQuestionStatus('문항 ' + row.id + ' · ' + modeName(mode));
      return result;
    } catch (error) {
      if (state.readerGeneration !== token || error.message === 'STALE_QUESTION_SELECTION') return;
      if (mode === 'sol' && error.message === 'ENGINE_OR_QUESTION_LOAD_TIMEOUT') {
        await openWholeSolution(row, examToken);
        return;
      }
      if (mode !== 'exam') setInlinePreviewState('failed');
      setQuestionStatus('문항을 표시하지 못했습니다. 전체 시험지는 아래에서 계속 볼 수 있습니다.');
      console.warn('[ap-galaxy] selected question render failed:', error.message);
    }
  }
  function selectQuestion(row) {
    if (!state.selectedExam || !state.questionRows.includes(row)) return;
    resetPreviewHeading(state.selectedExam);
    if (!state.selectedQuestion) {
      try { state.examReturnScrollY = ui.frame.contentWindow?.scrollY || 0; }
      catch (_) { state.examReturnScrollY = 0; }
    }
    state.selectedQuestion = row;
    ui.drawer.classList.add('reading-focus');
    ui.readerToolbar.hidden = false;
    ui.readerSelect.value = row.id;
    ui.questionOrbit.querySelectorAll('.question-orbit-node').forEach(button =>
      button.classList.toggle('selected', button.dataset.questionId === row.id));
    setReaderMode('exam');
  }
  function showWholeExam() {
    state.readerGeneration++;
    if (state.selectedExam) resetPreviewHeading(state.selectedExam);
    state.selectedQuestion = null;
    ui.drawer.classList.remove('reading-focus');
    ui.readerToolbar.hidden = true;
    ui.readerSelect.value = '';
    ui.questionOrbit.querySelectorAll('.question-orbit-node').forEach(button => button.classList.remove('selected'));
    window.APOrbitQuestionReader?.clearFocus(ui.frame);
    // The existing Archive engine owns pagination and print. Do not re-render it.
    try {
      const tab = ui.frame.contentDocument?.getElementById('btn-exam');
      if (tab && !tab.classList.contains('active')) {
        const exam = state.selectedExam;
        const examToken = state.examGeneration;
        const frameToken = state.frameGeneration;
        setInlinePreviewState('loading');
        tab.click();
        if (exam) waitForInlinePreview(exam, examToken, frameToken);
      }
      const returnY = state.examReturnScrollY;
      const examToken = state.examGeneration;
      requestAnimationFrame(() => {
        if (examToken !== state.examGeneration || state.selectedQuestion) return;
        try { ui.frame.contentWindow?.scrollTo(0, returnY); }
        catch (_) { /* An in-flight iframe remains on the original source URL. */ }
      });
    } catch (_) { /* An in-flight iframe remains on the original source URL. */ }
    setQuestionStatus('');
  }
  function arriveAtExam(file) {
    if (!file || state.selectedExam?.file !== file) return;
    requestAnimationFrame(() => {
      if (state.selectedExam?.file !== file) return;
      if (!state.world?.focusExam(file)) requestAnimationFrame(() => {
        if (state.selectedExam?.file === file) state.world?.focusExam(file);
      });
    });
  }
  function openExam(exam) {
    if (!exam) return;
    if (!state.entrySnapshot) state.entrySnapshot = captureNavigation();
    const token = ++state.examGeneration;
    state.readerGeneration++;
    window.APOrbitQuestionReader?.abort();
    ++state.questionLoadGeneration;
    ui.advancedQuestions.open = false;
    clearQuestionOrbit();
    state.examReturnScrollY = 0;
    const wasDetailed = state.visibleExams.some(item => item.file === exam.file);
    state.selectedExam = exam;
    state.world?.setSelectedExam(exam.file);
    const frameToken = ++state.frameGeneration;
    const url = sourceUrl(exam, { loadGeneration: frameToken });
    const printableUrl = sourceUrl(exam, { preview: false });
    resetPreviewHeading(exam);
    ui.title.textContent = examTitle(exam);
    ui.meta.replaceChildren();
    for (const value of [
      exam.grade || '학년 미상',
      exam.subject || '과목 미상',
      exam.qCount ? exam.qCount + '문항 (catalog)' : '문항 수 확인 중',
      exam.contentType || '원본 자료',
    ]) {
      const tag = document.createElement('span');
      tag.textContent = value;
      ui.meta.append(tag);
    }
    ui.source.textContent = 'catalog source · ' + exam.file;
    ui.source.title = exam.file;
    ui.openOriginal.href = printableUrl;
    ui.openFullSolution.href = sourceUrl(exam, { preview: false, mode: 'sol' });
    ui.printOriginal.href = printableUrl;
    const composeUrl = new URL('../../workspace.html', location.href);
    composeUrl.searchParams.set('view', 'compose');
    composeUrl.searchParams.set('range', 'all');
    composeUrl.searchParams.append('source', exam.file);
    ui.composeExam.href = composeUrl.href;
    ui.drawer.classList.add('open');
    setInlinePreviewState('loading');
    // The drawer begins at `visibility:hidden`. In Chromium's desktop path the
    // discrete visibility transition could leave its descendants hidden even
    // after the .open class moved the panel into place. Keep the slide, but
    // make the visibility flip immediate for this opening state.
    ui.drawer.style.transition = 'transform .35s cubic-bezier(.2,.75,.2,1), visibility 0s linear 0s';
    ui.drawer.style.visibility = 'visible';
    ui.drawer.setAttribute('aria-hidden', 'false');
    // Let the paper drawer reach its visible layout before the existing engine
    // measures its page grid inside the iframe.
    window.setTimeout(() => {
      if (token === state.examGeneration && state.selectedExam?.file === exam.file) {
        ui.frame.src = url;
        waitForInlinePreview(exam, token, frameToken);
      }
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
    $('drawerBack').focus({ preventScroll: true });
    if (!wasDetailed) renderScene();
    state.focusedGroupId = groupKeyForExam(exam).id;
    renderSatelliteLabels();
    state.pendingExamFocus = exam.file;
    state.world?.focusGroup(state.focusedGroupId);
  }
  function toggleAdvancedQuestions() {
    const loadToken = ++state.questionLoadGeneration;
    if (!ui.advancedQuestions.open) {
      if (state.selectedQuestion) showWholeExam();
      window.APOrbitQuestionReader?.abort();
      clearQuestionOrbit();
      return;
    }
    const exam = state.selectedExam;
    if (!exam) return;
    const examToken = state.examGeneration;
    setQuestionStatus('문항 번호를 불러오는 중…');
    window.APOrbitQuestionReader.load(exam.file).then((rows) => {
      if (loadToken !== state.questionLoadGeneration || examToken !== state.examGeneration ||
          state.selectedExam?.file !== exam.file || !ui.advancedQuestions.open) return;
      state.questionRows = rows;
      renderQuestionOrbit(rows);
      setQuestionStatus(rows.length ? '' : '선택할 문항이 없습니다.');
    }).catch(() => {
      if (loadToken !== state.questionLoadGeneration || examToken !== state.examGeneration ||
          !ui.advancedQuestions.open) return;
      setQuestionStatus('문항 탐색을 열 수 없습니다.');
      ui.readerToolbar.hidden = true;
    });
  }
  function closeExam({ restore = true } = {}) {
    const openedExam = state.selectedExam;
    ++state.examGeneration;
    ++state.frameGeneration;
    ++state.readerGeneration;
    window.APOrbitQuestionReader?.abort();
    ++state.questionLoadGeneration;
    ui.advancedQuestions.open = false;
    clearQuestionOrbit();
    state.pendingExamFocus = '';
    ui.drawer.style.removeProperty('visibility');
    ui.drawer.style.removeProperty('transition');
    ui.drawer.classList.remove('open');
    ui.drawer.classList.remove('reading-focus');
    ui.drawer.setAttribute('aria-hidden', 'true');
    setInlinePreviewState('idle');
    ui.frame.src = 'about:blank';
    state.selectedExam = null;
    state.world?.setSelectedExam(null);
    if (restore) restoreNavigation(state.entrySnapshot);
    state.entrySnapshot = null;
    const focusedButton = openedExam && state.satelliteButtons.get(openedExam.file);
    if (focusedButton) focusedButton.focus({ preventScroll: true });
  }

  function makeGroupLabel(group) {
    const groupName = clean(group.name);
    if (!groupName || /^(학교 미상|학교명 미상|미상|unknown)$/i.test(groupName)) return;
    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'planet-label';
    const spatialNoun = group.mode === 'school' ? '학교 은하' : '과정 은하';
    label.setAttribute('aria-label', groupName + ' ' + spatialNoun + ' · ' + group.exams.length.toLocaleString() + '개 시험지 · 선택');
    label.textContent = groupName + ' · ' + group.exams.length.toLocaleString();
    label.addEventListener('click', () => focusGroup(group.id));
    label.addEventListener('pointerenter', () => { state.hoveredLabelGroupId = group.id; });
    label.addEventListener('pointerleave', () => {
      if (state.hoveredLabelGroupId === group.id) state.hoveredLabelGroupId = '';
    });
    label.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        focusGroup(group.id);
      }
    });
    ui.labels.append(label);
    state.groupLabels.set(group.id, label);
  }
  function renderSatelliteLabels() {
    ui.satelliteLabels.replaceChildren();
    state.satelliteButtons.clear();
    $('universe').classList.toggle('focused', Boolean(state.focusedGroupId));
    const group = state.groupsById.get(state.focusedGroupId);
    ui.focusedChip.hidden = !group;
    ui.mobileFocusHeader.hidden = !group;
    ui.mobileFocusBreadcrumb.textContent = group ? group.name + ' · 시험지' : '';
    ui.mobileExamList.replaceChildren();
    if (group && matchMedia('(max-width:760px)').matches) $('secondaryMenu').open = false;
    if (!group) return;
    ui.focusName.textContent = group.name;
    ui.focusMeta.textContent = group.mode === 'school'
      ? '학교 분포 · 공개 원본 시험지'
      : group.id.startsWith('curriculum:middle:')
        ? '중학교 학년 catalog · 공개 원본 시험지'
        : '고등 실제 과목 catalog · 공개 원본 시험지';
    const mobile = matchMedia('(max-width:760px)').matches;
    const satelliteLimit = mobile ? 4 : 12;
    for (const exam of group.items.slice(0, satelliteLimit)) {
      const lines = satelliteLabelLines(exam);
      if (mobile) {
        const card = document.createElement('button');
        card.className = 'mobile-exam-card';
        card.type = 'button';
        card.dataset.examFile = exam.file;
        card.setAttribute('aria-label', [lines.period, lines.identity, '원본 시험지 열기'].filter(Boolean).join(' · '));
        const identity = document.createElement('span');
        const period = document.createElement('small');
        period.textContent = lines.period;
        const name = document.createElement('b');
        name.textContent = lines.identity;
        identity.append(period, name);
        const quantity = document.createElement('small');
        quantity.textContent = exam.qCount ? exam.qCount + '문항' : '시험지';
        card.append(identity, quantity);
        card.addEventListener('click', () => openExam(exam));
        ui.mobileExamList.append(card);
        continue;
      }
      const button = document.createElement('button');
      button.className = 'satellite-hit';
      button.type = 'button';
      button.dataset.examFile = exam.file;
      button.title = 'catalog source: ' + exam.file;
      button.setAttribute('aria-label', [lines.period, lines.identity, '원본 자료 노드 열기'].filter(Boolean).join(' · '));
      const period = document.createElement('span');
      period.className = 'satellite-period';
      period.textContent = lines.period;
      const identity = document.createElement('b');
      identity.textContent = lines.identity;
      button.append(period, identity);
      button.addEventListener('click', () => openExam(exam));
      ui.satelliteLabels.append(button);
      state.satelliteButtons.set(exam.file, button);
    }
  }

  function createAccessibleList() {
    ui.listGroups.replaceChildren();
    const allGroups = groupExams(state.filtered);
    $('listSummary').textContent = state.filtered.length.toLocaleString() + '개 시험지 · ' + allGroups.length.toLocaleString() + '개 ' +
      (state.groupMode === 'school' ? '학교 은하' : '학년·과목 은하');
    if (!allGroups.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-list';
      empty.textContent = '검색 조건에 맞는 시험지가 없습니다. 필터를 풀어 보세요.';
      ui.listGroups.append(empty);
      return;
    }
    let index = 0;
    for (const group of allGroups) {
      const details = document.createElement('details');
      details.className = 'school-group';
      if (group.id === state.focusedGroupId || (!state.focusedGroupId && index === 0)) details.open = true;
      const summary = document.createElement('summary');
      const groupName = document.createElement('b');
      groupName.textContent = group.name;
      const total = document.createElement('small');
      total.textContent = group.exams.length.toLocaleString() + '개 시험지';
      summary.append(groupName, total);
      const examRows = document.createElement('div');
      examRows.className = 'exam-links';
      for (const exam of group.exams) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'exam-link';
        button.setAttribute('aria-label', examTitle(exam) + ' 미리보기 열기');
        const label = document.createElement('span');
        label.textContent = examTitle(exam);
        const quantity = document.createElement('small');
        quantity.textContent = exam.qCount ? exam.qCount + '문항' : '문항 수 확인';
        button.append(label, quantity);
        button.addEventListener('click', () => {
          openExam(exam);
          toggleList(false);
        });
        examRows.append(button);
      }
      details.append(summary, examRows);
      ui.listGroups.append(details);
      index += 1;
    }
  }

  function renderScene() {
    state.filtered = filterExams();
    const allGroups = groupExams(state.filtered);
    const selection = selectVisibleData(allGroups);
    state.visibleGroups = selection.groups;
    state.visibleExams = selection.visibleExams;
    state.groupsById = new Map(state.visibleGroups.map((group) => [group.id, group]));
    syncGalaxyNavigation();
    ui.labels.replaceChildren();
    state.groupLabels.clear();
    for (const group of state.visibleGroups) makeGroupLabel(group);

    if (state.focusedGroupId && !state.groupsById.has(state.focusedGroupId)) {
      state.focusedGroupId = '';
      state.world?.clearFocus();
      renderSatelliteLabels();
    }
    if (state.selectedExam && !state.filtered.some((exam) => exam.file === state.selectedExam.file)) closeExam({ restore: false });
    state.world?.setData({
      mode: state.groupMode,
      searching: Boolean(ui.search.value.trim()),
      groups: state.visibleGroups.map((group) => ({ id: group.id, name: group.name, mode: group.mode, count: group.exams.length, files: group.exams.map((exam) => exam.file), items: group.items })),
      exams: state.filtered,
      details: state.visibleExams,
    });
    renderSatelliteLabels();
    syncGalaxyNavigation();
    setFilterSummary();
    createAccessibleList();
    const facetNodes = renderFacets();
    // Keep filters in the labeled HTML controls. The world map stays focused on
    // the decorative cosmic web and selectable curriculum galaxies.
    ui.facetSpaceLabels.replaceChildren();
    state.world?.setFacetData(facetNodes);
    const schoolCount = new Set(state.filtered.map((exam) => exam.school)).size;
    ui.atlasExamCount.textContent = state.filtered.length.toLocaleString();
    ui.atlasGroupCount.textContent = state.visibleGroups.length.toLocaleString();
    ui.atlasDetailCount.textContent = state.visibleExams.length.toLocaleString();
    $('atlasGroupLabel').textContent = state.groupMode === 'school' ? '학교 은하' : '학년·과목 은하';
    if (ui.selectCurrentRange) {
      ui.selectCurrentRange.disabled = state.filtered.length === 0;
      ui.selectCurrentRange.setAttribute('aria-label', state.filtered.length
        ? '현재 범위 자료를 기존 Archive 출제 도구로 선택'
        : '현재 범위에 자료가 없음');
    }
    const groupNoun = state.groupMode === 'school' ? '학교 은하' : '학년·과목 은하';
    $('sceneCount').textContent = '시험지 ' + state.filtered.length.toLocaleString() + ' · ' +
      state.visibleGroups.length + '개 ' + groupNoun + ' · 상세 ' + state.visibleExams.length.toLocaleString();
    $('sceneInstruction').textContent = state.visibleGroups.length
      ? state.groupMode === 'school'
        ? '학교 은하 분포를 살펴보거나, 학교·연도·시험 조건을 자유롭게 조합하세요.'
        : '중1·중2·중3과 공개 catalog의 고등 과목 은하를 함께 표시합니다. 학교·연도·시험 조건은 순서 없이 조합할 수 있습니다.'
      : '조건에 맞는 자료가 없습니다. 필터를 풀거나 검색어를 바꿔 보세요.';
  }
  function setFilterSummary() {
    const values = [ui.grade.value, ui.subject?.value, ui.term?.value ? termLabel(ui.term.value) : '', ui.year.value, ui.school.value, ui.unit.value, ui.search.value.trim()].filter(Boolean);
    $('filterSummary').textContent = values.length
      ? values.join(' · ')
      : '조건을 자유롭게 고르세요. 남은 기준은 같은 우주에서 계속 선택할 수 있습니다.';
  }
  function focusGroup(id) {
    const group = state.groupsById.get(id);
    if (!group) return;
    if (!state.entrySnapshot) state.entrySnapshot = captureNavigation();
    state.focusedGroupId = id;
    state.world?.focusGroup(id);
    renderSatelliteLabels();
    syncGalaxyNavigation();
  }

  function setupFilterOptions() {
    optionValues(ui.school, [...new Set(state.exams.map((exam) => exam.school).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')), '학교');
    optionValues(ui.grade, [...new Set(state.exams.map((exam) => exam.grade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')), '학년');
    optionValues(ui.year, [...new Set(state.exams.map((exam) => String(exam.year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a)), '연도');
    if (ui.term) optionValues(ui.term, [...new Set(state.exams.map(termKey).filter(Boolean))].sort((a, b) => termLabel(a).localeCompare(termLabel(b), 'ko')), '시험 구분', termLabel);
    if (ui.subject) optionValues(ui.subject, [...new Set(state.exams.map(subjectFacetValue).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')), '\uACFC\uBAA9');
    optionValues(ui.unit, [...state.filesByTag.keys()].sort((a, b) => a.localeCompare(b, 'ko')), '공개 L2 단원');
  }
  async function loadCatalog() {
    const response = await fetch('../../data/archive2-catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('공개 Archive catalog 요청 실패 (' + response.status + ')');
    const raw = await response.json();
    const catalog = window.Archive2Core?.decodeCatalog(raw);
    if (!catalog?.exams || !catalog?.records) throw new Error('공개 Archive catalog 구조를 읽을 수 없습니다.');
    state.catalogExamCount = catalog.exams.filter((exam) => exam.file).length;
    state.exams = catalog.exams.filter((exam) => exam.file && exam.contentType === '기출');
    state.examsByFile = new Map(state.exams.map(exam => [exam.file, exam]));
    renderGalaxyNavigation();
    state.records = catalog.records;
    state.tagsByFile.clear();
    state.filesByTag.clear();
    for (const record of state.records) {
      const tag = clean(record.L2);
      if (!record.sourceFile || !tag) continue;
      if (!state.tagsByFile.has(record.sourceFile)) state.tagsByFile.set(record.sourceFile, new Set());
      state.tagsByFile.get(record.sourceFile).add(tag);
      if (!state.filesByTag.has(tag)) state.filesByTag.set(tag, new Set());
      state.filesByTag.get(tag).add(record.sourceFile);
    }
    setupFilterOptions();
    const schoolCount = new Set(state.exams.map((exam) => exam.school)).size;
    ui.status.textContent = '공개 catalog · 자료 ' + state.catalogExamCount.toLocaleString() + ' · 기출 ' + state.exams.length.toLocaleString() + ' · 학교 ' + schoolCount;
    renderScene();
  }
  async function startUniverse() {
    const module = await import('./assets/orbital-world.js?v=20261016-all-galaxy-visuals-5a');
    state.world = module.createOrbitWorld({
      canvas: ui.canvas,
      onGroup: (id) => focusGroup(id),
      onFacet: (kind, value) => {
        if (value) applyFacet(kind, value);
        else showToast((kind === 'grade' ? '\uD559\uB144' : kind === 'term' ? '\uC2DC\uD5D8' : kind === 'year' ? '\uC5F0\uB3C4' : kind === 'school' ? '\uD559\uAD50' : '\uACFC\uBAA9') + ' \uAE30\uC900\uC740 HTML \uD0D0\uC0C9\u5F8C\uB85C \uACE0\uB97C\uC138\uC694.');
      },
      onExam: (file) => {
        const exam = state.examsByFile.get(file);
        if (exam) openExam(exam);
      },
      onTravel: (type) => {
        $('universe').classList.toggle('travel-warp', type === 'warp');
        $('universe').classList.toggle('travel-flight', type === 'flight');
        if (!type && state.pendingExamFocus) {
          const file = state.pendingExamFocus;
          state.pendingExamFocus = '';
          arriveAtExam(file);
        }
      },
      onScale: (mode) => updateScaleUI(mode),
      onBlackhole: () => window.open('../../generated-bank.html', '_blank', 'noopener'),
      onFrame: (positions) => {
        const reservedRects = [...document.querySelectorAll('.topbar,.galaxy-nav,.scene-heading,.scene-hud,.scene-footer,.entry-chip,.scale-rail,.scale-caption:not([hidden]),.filter-panel:not([hidden]),.list-panel.open,.drawer.open')]
          .filter((element) => element.getClientRects().length)
          .map((element) => element.getBoundingClientRect());
        const overlapsChrome = (point, halfWidth, halfHeight) => reservedRects.some((rect) =>
          point.x + halfWidth > rect.left && point.x - halfWidth < rect.right &&
          point.y + halfHeight > rect.top && point.y - halfHeight < rect.bottom,
        );
        for (const label of state.groupLabels.values()) label.style.display = 'none';
        for (const label of ui.facetSpaceLabels?.children || []) label.style.display = 'none';
        let pointerHover = '';
        if (state.pointer && !state.selectedExam) {
          let closest = window.innerWidth < 760 ? 30 : 40;
          for (const [id, point] of positions.groups || []) {
            if (!point?.visible) continue;
            const distance = Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y);
            if (distance < closest) { closest = distance; pointerHover = id; }
          }
        }
        state.hoveredGroupId = state.hoveredLabelGroupId || pointerHover;
        for (const button of ui.questionOrbit.children) {
          const point = positions.questions?.get(button.dataset.questionId);
          button.style.display = point?.visible && !overlapsChrome(point, 16, 16) ? 'grid' : 'none';
          if (point?.visible) {
            button.style.left = point.x + 'px';
            button.style.top = point.y + 'px';
          }
        }
        const primaryGroupIds = new Set([...state.groupsById.values()]
          .filter((group) => clean(group.name) && group.mode === state.groupMode)
          .sort((a, b) => b.exams.length - a.exams.length)
          .slice(0, 3)
          .map((group) => group.id));
        const labelCandidates = (state.selectedExam ? [] : [...state.groupLabels]).map(([id, label]) => ({ id, label, point: positions.groups.get(id) }))
          .filter(({ label, point }) => point?.visible && clean(label.textContent))
          .sort((a, b) => Number(b.id === state.focusedGroupId) - Number(a.id === state.focusedGroupId) ||
            Number(b.id === state.hoveredGroupId) - Number(a.id === state.hoveredGroupId) ||
            Number(primaryGroupIds.has(b.id)) - Number(primaryGroupIds.has(a.id)) ||
            Number(b.id.startsWith('curriculum:middle:')) - Number(a.id.startsWith('curriculum:middle:')) ||
            a.point.depth - b.point.depth);
        const occupiedGroupLabels = [];
        let shownGroupLabels = 0;
        for (const { id, label, point } of labelCandidates) {
          const selected = id === state.focusedGroupId;
          const hovered = id === state.hoveredGroupId;
          const primary = primaryGroupIds.has(id);
          if (!selected && !hovered && !primary) continue;
          label.style.display = 'block';
          label.style.opacity = '0';
          label.style.visibility = '';
          const halfWidth = Math.max(44, label.getBoundingClientRect().width / 2 + 8);
          const halfHeight = Math.max(13, label.getBoundingClientRect().height / 2 + 5);
          const labelY = point.y - 22;
          const crowded = occupiedGroupLabels.some((used) =>
            Math.abs(used.x - point.x) < used.halfWidth + halfWidth + 7 &&
            Math.abs(used.y - labelY) < used.halfHeight + halfHeight + 5);
            label.setAttribute('aria-pressed', String(selected));
          const labelLimit = window.innerWidth < 760 ? 3 : 4;
          const labelDepthLimit = window.innerWidth < 760 ? 124 : 164;
          if ((!selected && (point.depth > labelDepthLimit || crowded || shownGroupLabels >= labelLimit)) || overlapsChrome({ ...point, y: labelY }, halfWidth, halfHeight)) {
            label.style.display = 'none';
            label.style.opacity = '';
            continue;
          }
          label.style.display = 'block';
          label.style.opacity = '';
          label.dataset.role = selected ? 'selected' : hovered ? 'hovered' : 'primary';
          occupiedGroupLabels.push({ x: point.x, y: labelY, halfWidth, halfHeight });
          shownGroupLabels += 1;
          label.style.left = point.x + 'px';
          label.style.top = labelY + 'px';
        }
        const facetCategoryPositions = positions.facetCategories || new Map();
        const facetPositions = positions.facets || new Map();
        const facetCandidates = [...(ui.facetSpaceLabels?.children || [])].map((label) => ({
          label,
          point: label.dataset.facetCategory
            ? facetCategoryPositions.get(label.dataset.facetCategory)
            : facetPositions.get(label.dataset.facetId),
          category: Boolean(label.dataset.facetCategory),
        })).filter(({ point }) => point?.visible).sort((a, b) => a.point.depth - b.point.depth);
        const occupiedFacets = [];
        let shownFacets = 0;
        for (const { label, point, category } of facetCandidates) {
          const selected = label.dataset.selected === 'true';
          const priority = label.dataset.priority === 'true';
          const crowded = occupiedFacets.some((used) => Math.abs(used.x - point.x) < (category ? 96 : 64) && Math.abs(used.y - point.y) < 24);
          if (category) {
            label.style.display = 'block';
            label.style.left = point.x + 'px';
            label.style.top = (point.y - 18) + 'px';
            occupiedFacets.push(point);
            shownFacets += 1;
            continue;
          }
          if (priority && !selected) {
            label.style.display = 'block';
            label.style.left = point.x + 'px';
            label.style.top = (point.y - 12) + 'px';
            occupiedFacets.push(point);
            shownFacets += 1;
            continue;
          }
          if ((!selected && crowded) || shownFacets >= 22 || overlapsChrome(point, 36, 16)) continue;
          label.style.display = selected || point.depth < 118 ? 'block' : 'none';
          if (label.style.display === 'none') continue;
          occupiedFacets.push(point);
          shownFacets += 1;
          label.style.left = point.x + 'px';
          label.style.top = (point.y - (category ? 18 : 12)) + 'px';
        }
        for (const button of state.satelliteButtons.values()) button.style.display = 'none';
        const satelliteCandidates = (state.selectedExam ? [] : [...state.satelliteButtons]).map(([file, button]) => ({ file, button, point: positions.exams.get(file) }))
          .filter(({ point }) => point?.visible && point.depth < 38)
          .sort((a, b) => a.point.depth - b.point.depth);
        const occupiedSatellites = [];
        let shownSatellites = 0;
        for (const { button, point } of satelliteCandidates) {
          const crowded = occupiedSatellites.some((used) => Math.abs(used.x - point.x) < 112 && Math.abs(used.y - point.y) < 42);
          if (crowded || shownSatellites >= 5 || overlapsChrome(point, 92, 18)) { button.style.display = 'none'; continue; }
          occupiedSatellites.push(point);
          shownSatellites += 1;
          button.style.display = 'flex';
          button.style.left = point.x + 'px';
          button.style.top = point.y + 'px';
        }
      },
    });
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.world.setMotion(!reducedMotion);
    state.world.setInstantTravel(state.instant || reducedMotion);
    updateScaleUI('macro');
    setAtlasCollapsed(true);
    $('motionToggle').setAttribute('aria-pressed', String(reducedMotion));
    $('motionLabel').textContent = reducedMotion ? '공전 시작' : '공전 일시정지';
    if (reducedMotion) showToast('기기의 동작 줄이기 설정에 맞춰 공전을 멈췄습니다.');
    state.world.resize();
    renderScene();
  }
  function toggleFilters(force) {
    const show = typeof force === 'boolean' ? force : ui.filterPanel.hidden;
    ui.filterPanel.hidden = !show;
    ui.filterToggle.setAttribute('aria-expanded', String(show));
    if (show) ui.grade.focus({ preventScroll: true });
  }
  function toggleList(force) {
    const show = typeof force === 'boolean' ? force : !state.list;
    state.list = show;
    ui.listPanel.classList.toggle('open', show);
    ui.listPanel.setAttribute('aria-hidden', String(!show));
    $('viewToggle').setAttribute('aria-pressed', String(show));
    $('viewToggle').innerHTML = show ? '<span aria-hidden="true">◉</span> 우주' : '<span aria-hidden="true">☷</span> 목록';
    if (show) ui.listGroups.querySelector('summary')?.focus({ preventScroll: true });
  }
  function clearAllFilters() {
    ui.grade.value = '';
    ui.school.value = '';
    ui.year.value = '';
    if (ui.term) ui.term.value = '';
    if (ui.subject) ui.subject.value = '';
    ui.unit.value = '';
    ui.search.value = '';
    renderScene();
  }
  function setGroupMode(mode) {
    if (!['school', 'curriculum'].includes(mode) || state.groupMode === mode) return;
    state.groupMode = mode;
    state.focusedGroupId = '';
    $('universe').classList.remove('focused');
    ui.focusedChip.hidden = true;
    $('groupModes').querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.groupMode === mode));
    });
    renderSatelliteLabels();
    renderScene();
    showToast(mode === 'school'
      ? '학교 분포를 살펴봅니다. 학년·연도·시험·단원 조건은 계속 조합할 수 있습니다.'
      : '중등 학년과 고등 실제 과정을 함께 살펴봅니다.');
  }

  async function init() {
    updateGalaxyNavigationOffset();
    window.addEventListener('resize', updateGalaxyNavigationOffset, { passive: true });
    if (typeof ResizeObserver === 'function' && ui.galaxyNav) {
      state.galaxyNavResizeObserver = new ResizeObserver(updateGalaxyNavigationOffset);
      state.galaxyNavResizeObserver.observe(ui.galaxyNav);
    }
    const updateSearchPlaceholder = () => {
      ui.search.placeholder = matchMedia('(max-width:760px)').matches
        ? '학교·학년·과정'
        : '학교 · 학년 · 과정 · 연도 검색';
    };
    updateSearchPlaceholder();
    window.addEventListener('resize', updateSearchPlaceholder, { passive: true });
    if (!ui.term) {
      ui.term = document.createElement('select');
      ui.term.id = 'termFilter';
      ui.term.hidden = true;
      document.body.append(ui.term);
    }
    if (!ui.subject) {
      ui.subject = document.createElement('select');
      ui.subject.id = 'subjectFilter';
      ui.subject.hidden = true;
      document.body.append(ui.subject);
    }
    for (const field of [ui.grade, ui.school, ui.year, ui.term, ui.subject, ui.unit].filter(Boolean)) field.addEventListener('change', renderScene);
    $('clearFilters').addEventListener('click', clearAllFilters);
    ui.filterToggle.addEventListener('click', () => toggleFilters());
    $('closeFilters').addEventListener('click', () => toggleFilters(false));
    $('viewToggle').addEventListener('click', () => toggleList());
    ui.galaxyNavGroups?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-galaxy-id]');
      if (button && !button.disabled) navigateToGalaxy(button.dataset.galaxyId);
    });
    ui.facetNav?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-facet-kind]');
      if (button) applyFacet(button.dataset.facetKind, button.dataset.facetValue);
    });
    ui.clearFacetSelections?.addEventListener('click', clearAllFilters);
    ui.selectCurrentRange?.addEventListener('click', openCurrentRangeComposer);
    $('groupModes').addEventListener('click', (event) => {
      const button = event.target.closest('[data-group-mode]');
      if (button) setGroupMode(button.dataset.groupMode);
    });
    $('motionToggle').addEventListener('click', () => {
      if (!state.world) return;
      const running = state.world.toggleMotion();
      $('motionToggle').setAttribute('aria-pressed', String(!running));
      $('motionLabel').textContent = running ? '공전 일시정지' : '공전 시작';
    });
    $('returnToGalaxy').addEventListener('click', () => {
      if (state.selectedExam) closeExam();
      else {
        restoreNavigation(state.entrySnapshot);
        state.entrySnapshot = null;
      }
    });
    $('mobileFocusBack').addEventListener('click', () => $('returnToGalaxy').click());
    $('drawerBack').addEventListener('click', () => {
      if (state.selectedQuestion) showWholeExam();
      else closeExam();
    });
    $('closeDrawer').addEventListener('click', () => closeExam());
    ui.advancedQuestions.addEventListener('toggle', toggleAdvancedQuestions);
    ui.atlasExplore.addEventListener('click', () => {
      toggleList(true);
      ui.search.focus({ preventScroll: true });
      ui.search.select();
    });
    ui.atlasOverview.addEventListener('click', () => {
      if (state.selectedExam) closeExam();
      else if (state.focusedGroupId && state.entrySnapshot) {
        restoreNavigation(state.entrySnapshot);
        state.entrySnapshot = null;
      } else state.world?.resetCamera();
    });
    ui.atlasCollapse?.addEventListener('click', () => setAtlasCollapsed(!state.atlasCollapsed));
    $('questionToolbar').addEventListener('click', (event) => {
      const button = event.target.closest('[data-reader-mode]');
      if (button) setReaderMode(button.dataset.readerMode);
    });
    ui.readerSelect.addEventListener('change', () => {
      const row = state.questionRows.find((item) => item.id === ui.readerSelect.value);
      if (row) selectQuestion(row);
    });
    ui.scaleRail?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-scale-mode]');
      if (!button || button.disabled || !state.world) return;
      const mode = button.dataset.scaleMode;
      if (mode === 'macro') {
        if (state.selectedExam) closeExam();
        else if (state.focusedGroupId && state.entrySnapshot) {
          state.world.cancelTravel();
          restoreNavigation(state.entrySnapshot);
          state.entrySnapshot = null;
        } else {
          state.focusedGroupId = '';
          state.world.resetCamera();
          renderSatelliteLabels();
        }
      } else state.world.setScale(mode);
    });
    ui.instantTravel.addEventListener('click', () => {
      state.instant = !state.instant;
      ui.instantTravel.setAttribute('aria-pressed', String(state.instant));
      state.world?.setInstantTravel(state.instant || matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (state.instant) state.world?.finishTravel();
    });
    $('closeList').addEventListener('click', () => toggleList(false));
    $('overviewButton')?.addEventListener('click', () => ui.atlasOverview.click());
    $('retryWorld')?.addEventListener('click', () => window.location.reload());
    ui.search.addEventListener('input', () => {
      clearTimeout(state.searchTimer);
      state.searchTimer = setTimeout(renderScene, 90);
    });
    ui.canvas.addEventListener('pointermove', (event) => {
      state.pointer = event.pointerType === 'mouse' ? { x: event.clientX, y: event.clientY } : null;
    }, { passive: true });
    ui.canvas.addEventListener('pointerleave', () => { state.pointer = null; }, { passive: true });
    ui.search.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); toggleList(true); }
    });
    document.addEventListener('keydown', (event) => {
      const typingTarget = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (!typingTarget && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const key = event.key.toLowerCase();
        if (key === 'g') { event.preventDefault(); $('overviewButton')?.click(); }
        const modeByKey = { '1': 'curriculum', '2': 'school' };
        if (modeByKey[key] && !ui.drawer.classList.contains('open')) {
          event.preventDefault();
          setGroupMode(modeByKey[key]);
        }
        if (key === '3' && !ui.drawer.classList.contains('open')) {
          event.preventDefault();
          toggleFilters(true);
          ui.unit.focus({ preventScroll: true });
        }
      }
      if (event.key === 'Escape') {
        // A focused search input would otherwise clear itself *after* we restore
        // the saved query, violating navigation return state.
        if (ui.drawer.classList.contains('open') || state.focusedGroupId || state.list ||
            !ui.filterPanel.hidden || $('universe').classList.contains('travel-warp') ||
            $('universe').classList.contains('travel-flight')) event.preventDefault();
        if (ui.drawer.classList.contains('open')) {
          if (state.selectedQuestion) showWholeExam();
          else closeExam();
        } else if (state.focusedGroupId || $('universe').classList.contains('travel-warp') ||
            $('universe').classList.contains('travel-flight')) {
          // Escape is a reliable back action both during the journey and
          // after arrival; never require the animation to still be running.
          state.world?.cancelTravel();
          restoreNavigation(state.entrySnapshot);
          state.entrySnapshot = null;
        }
        else if (state.list) toggleList(false);
        else if (!ui.filterPanel.hidden) toggleFilters(false);
      }
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        ui.search.focus();
      }
    });
    document.addEventListener('visibilitychange', () => state.world?.setPageVisible(!document.hidden));
    try {
      await loadCatalog();
      await startUniverse();
    } catch (error) {
      ui.status.textContent = '우주를 열지 못했습니다.';
      $('worldFallback').hidden = false;
      $('worldFallback').querySelector('strong').textContent = '3D 장면을 시작할 수 없습니다.';
      $('worldFallback').querySelector('span').textContent = '검색, 목록, 문항 미리보기는 계속 이용할 수 있습니다.';
      console.error(error);
      createAccessibleList();
      toggleList(true);
    }
  }
  init();
})();
