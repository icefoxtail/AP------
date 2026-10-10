(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const ui = {
    canvas: $('space'), status: $('catalogStatus'), count: $('sceneCount'), search: $('search'),
    grade: $('gradeFilter'), school: $('schoolFilter'), year: $('yearFilter'), unit: $('unitFilter'),
    filterPanel: $('filterPanel'), filterToggle: $('filterToggle'), focusedChip: $('focusedChip'),
    drawer: $('examDrawer'), frame: $('examFrame'), title: $('examTitle'), meta: $('examMeta'), source: $('examSource'),
    openOriginal: $('openOriginal'), labels: $('planetLabels'), satelliteLabels: $('satelliteLabels'),
    focusName: $('focusedSchoolName'), focusMeta: $('focusedSchoolMeta'), toast: $('toast'),
    listPanel: $('listPanel'), listGroups: $('listGroups'),
  };
  const state = {
    exams: [], records: [], filtered: [], visibleGroups: [], visibleExams: [], selectedExam: null,
    focusedGroupId: '', groupMode: 'school', activeTag: '', constellation: false, list: false,
    world: null, tagsByFile: new Map(), filesByTag: new Map(), groupsById: new Map(),
    groupLabels: new Map(), satelliteButtons: new Map(), toastTimer: 0, searchTimer: 0,
  };
  const clean = (value) => String(value ?? '').normalize('NFC').trim();
  const examTitle = (exam) => {
    const type = exam.examType === 'final' ? '기말고사' : '중간고사';
    const semester = exam.semester ? exam.semester + '학기 ' : '';
    return [exam.year ? exam.year + '년' : '', semester + type, exam.school, exam.grade, exam.subject].filter(Boolean).join(' · ');
  };
  const examTags = (exam) => [...(state.tagsByFile.get(exam.file) || [])];
  const normalizedField = (value) => clean(value).toLocaleLowerCase('ko');
  const showToast = (message) => {
    ui.toast.textContent = message;
    ui.toast.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 2500);
  };
  const optionValues = (select, values, label) => {
    const selected = select.value;
    select.replaceChildren(new Option('전체 ' + label, ''));
    for (const value of values) select.add(new Option(value, value));
    if (values.includes(selected)) select.value = selected;
  };
  const currentFilters = () => ({
    grade: ui.grade.value,
    school: ui.school.value,
    year: ui.year.value,
    unit: ui.unit.value,
    query: normalizedField(ui.search.value),
  });
  const matchesFilters = (exam, filters) => {
    if (filters.grade && exam.grade !== filters.grade) return false;
    if (filters.school && exam.school !== filters.school) return false;
    if (filters.year && String(exam.year) !== filters.year) return false;
    const tags = state.tagsByFile.get(exam.file);
    if (filters.unit && !tags?.has(filters.unit)) return false;
    if (!filters.query) return true;
    return [exam.school, exam.grade, exam.subject, exam.topic, exam.year, exam.file, ...(tags || [])]
      .some((part) => normalizedField(part).includes(filters.query));
  };
  const filterExams = () => {
    const filters = currentFilters();
    return state.exams.filter((exam) => matchesFilters(exam, filters))
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0) || clean(a.school).localeCompare(clean(b.school), 'ko'));
  };
  const primaryUnitForExam = (exam) => {
    const tags = examTags(exam).sort((a, b) => a.localeCompare(b, 'ko'));
    if (ui.unit.value && tags.includes(ui.unit.value)) return ui.unit.value;
    return tags[0] || 'L2 공개 태그 없음';
  };
  const groupKeyForExam = (exam) => {
    if (state.groupMode === 'grade') return { id: 'grade:' + (exam.grade || '학년 미상'), name: exam.grade || '학년 미상' };
    if (state.groupMode === 'unit') {
      const tag = primaryUnitForExam(exam);
      return { id: 'unit:' + tag, name: tag };
    }
    return { id: 'school:' + (exam.school || '학교 미상'), name: exam.school || '학교 미상' };
  };
  const groupExams = (exams) => {
    const groups = new Map();
    for (const exam of exams) {
      const key = groupKeyForExam(exam);
      if (!groups.has(key.id)) groups.set(key.id, { ...key, mode: state.groupMode, exams: [] });
      groups.get(key.id).exams.push(exam);
    }
    return [...groups.values()].sort((a, b) => (b.exams.length - a.exams.length) || a.name.localeCompare(b.name, 'ko'));
  };
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
    const drawnByGroup = new Map();
    for (const exam of visibleExams) {
      const key = groupKeyForExam(exam);
      if (!drawnByGroup.has(key.id)) drawnByGroup.set(key.id, []);
      drawnByGroup.get(key.id).push(exam);
    }
    for (const group of groups) group.items = drawnByGroup.get(group.id) || [];
    return { groups, visibleExams };
  };

  function sourceUrl(exam) {
    const url = new URL('../../engine.html', location.href);
    const params = new URLSearchParams();
    params.set('data', 'exams/' + exam.file);
    params.set('mode', 'exam');
    params.set('preview', '1');
    params.set('title', examTitle(exam));
    params.set('subject', exam.subject || '');
    if (exam.qCount) params.set('q', String(exam.qCount));
    url.search = params.toString();
    return url.href;
  }
  function openExam(exam) {
    if (!exam) return;
    state.selectedExam = exam;
    const url = sourceUrl(exam);
    ui.title.textContent = examTitle(exam);
    ui.meta.replaceChildren();
    for (const value of [
      exam.grade || '학년 미상',
      exam.subject || '과목 미상',
      exam.qCount ? exam.qCount + '문항' : '문항 수 확인 필요',
      exam.contentType || '원본 자료',
    ]) {
      const tag = document.createElement('span');
      tag.textContent = value;
      ui.meta.append(tag);
    }
    ui.source.textContent = 'catalog source · ' + exam.file;
    ui.source.title = exam.file;
    ui.frame.src = url;
    ui.openOriginal.href = url;
    ui.drawer.classList.add('open');
    ui.drawer.setAttribute('aria-hidden', 'false');
    $('drawerBack').focus({ preventScroll: true });
  }
  function closeExam() {
    const openedExam = state.selectedExam;
    ui.drawer.classList.remove('open');
    ui.drawer.setAttribute('aria-hidden', 'true');
    ui.frame.src = 'about:blank';
    state.selectedExam = null;
    const focusedButton = openedExam && state.satelliteButtons.get(openedExam.file);
    if (focusedButton) focusedButton.focus({ preventScroll: true });
  }

  function makeGroupLabel(group) {
    const label = document.createElement('div');
    label.className = 'planet-label';
    const dot = document.createElement('span');
    dot.className = 'planet-dot';
    const title = document.createElement('b');
    title.textContent = group.name;
    const meta = document.createElement('small');
    meta.textContent = group.exams.length.toLocaleString() + '개 자료 노드';
    label.append(dot, title, meta);
    ui.labels.append(label);
    state.groupLabels.set(group.id, label);
  }
  function renderSatelliteLabels() {
    ui.satelliteLabels.replaceChildren();
    state.satelliteButtons.clear();
    $('universe').classList.toggle('focused', Boolean(state.focusedGroupId));
    const group = state.groupsById.get(state.focusedGroupId);
    ui.focusedChip.hidden = !group;
    if (!group) return;
    ui.focusName.textContent = group.name;
    ui.focusMeta.textContent = group.mode === 'unit'
      ? '공개 L2 tag · 이 그룹 안의 자료 노드를 펼쳐보세요'
      : group.mode === 'grade'
        ? '학년 성단 · 서로 다른 학교의 자료 노드'
        : '학교 은하 · 연결된 원본 시험지 노드';
    for (const exam of group.items.slice(0, 12)) {
      const button = document.createElement('button');
      button.className = 'satellite-hit';
      button.type = 'button';
      button.dataset.examFile = exam.file;
      button.title = 'catalog source: ' + exam.file;
      button.setAttribute('aria-label', examTitle(exam) + ' 원본 자료 노드 열기');
      const icon = document.createElement('span');
      icon.className = 'mini-paper';
      icon.setAttribute('aria-hidden', 'true');
      const title = document.createElement('b');
      title.textContent = String(exam.year || '') + ' · ' + (exam.school || '') + ' · ' + (exam.subject || '시험지');
      button.append(icon, title);
      button.addEventListener('click', () => openExam(exam));
      ui.satelliteLabels.append(button);
      state.satelliteButtons.set(exam.file, button);
    }
  }

  function createAccessibleList() {
    ui.listGroups.replaceChildren();
    const allGroups = groupExams(state.filtered);
    $('listSummary').textContent = state.filtered.length.toLocaleString() + '개 시험지 · ' + allGroups.length.toLocaleString() + '개 ' +
      (state.groupMode === 'grade' ? '학년 성단' : state.groupMode === 'unit' ? '공개 L2 단원 성단' : '학교 은하');
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

  function bestCrossSchoolTag(exams) {
    const schoolCount = new Map();
    const examCount = new Map();
    for (const exam of exams) {
      const tags = state.tagsByFile.get(exam.file);
      if (!tags) continue;
      for (const tag of tags) {
        if (!schoolCount.has(tag)) schoolCount.set(tag, new Set());
        schoolCount.get(tag).add(exam.school);
        examCount.set(tag, (examCount.get(tag) || 0) + 1);
      }
    }
    return [...schoolCount.keys()].sort((a, b) =>
      (schoolCount.get(b).size - schoolCount.get(a).size) ||
      ((examCount.get(b) || 0) - (examCount.get(a) || 0)) ||
      a.localeCompare(b, 'ko'),
    ).find((tag) => schoolCount.get(tag).size > 1) || '';
  }
  function constellationConfig() {
    const preferredTags = state.selectedExam ? examTags(state.selectedExam) : [];
    const tagCandidates = [...new Set([
      ui.unit.value, preferredTags[0], state.activeTag,
      bestCrossSchoolTag(state.visibleExams), bestCrossSchoolTag(state.filtered),
    ].filter(Boolean))];
    const tag = tagCandidates.find((candidate) => {
      const schools = new Set(state.visibleExams.filter((exam) => state.tagsByFile.get(exam.file)?.has(candidate)).map((exam) => exam.school));
      return schools.size > 1;
    }) || tagCandidates[0] || '';
    if (!tag) return { tag: '', anchor: '', related: [] };
    const matching = state.visibleExams.filter((exam) => state.tagsByFile.get(exam.file)?.has(tag));
    const anchorExam = matching.find((exam) => exam.file === state.selectedExam?.file) ||
      matching.find((exam) => exam.school && matching.some((other) => other.school !== exam.school)) || matching[0];
    if (!anchorExam) return { tag, anchor: '', related: [] };
    const related = matching.filter((exam) => exam.file !== anchorExam.file && exam.school !== anchorExam.school)
      .slice(0, 10).map((exam) => exam.file);
    return { tag, anchor: anchorExam.file, related };
  }
  function updateConstellations() {
    if (!state.world || !state.constellation) {
      state.world?.setConstellations('', [], '');
      $('constellationLabel').textContent = 'L2 별자리';
      return;
    }
    const config = constellationConfig();
    if (!config.anchor || !config.related.length) {
      state.world.setConstellations('', [], '');
      $('constellationLabel').textContent = config.tag ? '연결 노드 없음' : '공개 L2 없음';
      return;
    }
    state.activeTag = config.tag;
    state.world.setConstellations(config.anchor, config.related, '#b8a0ff');
    $('constellationLabel').textContent = config.tag + ' · ' + (config.related.length + 1) + '개 L2 노드';
  }
  function renderScene() {
    state.filtered = filterExams();
    const allGroups = groupExams(state.filtered);
    const selection = selectVisibleData(allGroups);
    state.visibleGroups = selection.groups;
    state.visibleExams = selection.visibleExams;
    state.groupsById = new Map(state.visibleGroups.map((group) => [group.id, group]));
    ui.labels.replaceChildren();
    state.groupLabels.clear();
    for (const group of state.visibleGroups) makeGroupLabel(group);

    if (state.focusedGroupId && !state.groupsById.has(state.focusedGroupId)) {
      state.focusedGroupId = '';
      state.world?.clearFocus();
      renderSatelliteLabels();
    }
    if (state.selectedExam && !state.filtered.some((exam) => exam.file === state.selectedExam.file)) closeExam();
    state.world?.setData({
      mode: state.groupMode,
      searching: Boolean(ui.search.value.trim()),
      groups: state.visibleGroups.map((group) => ({ id: group.id, name: group.name, mode: group.mode, count: group.exams.length, files: group.exams.map((exam) => exam.file), items: group.items })),
      exams: state.filtered,
      details: state.visibleExams,
    });
    renderSatelliteLabels();
    setFilterSummary();
    createAccessibleList();
    updateConstellations();
    const schoolCount = new Set(state.filtered.map((exam) => exam.school)).size;
    $('sceneCount').textContent = '별 자료 노드 ' + state.filtered.length.toLocaleString() + ' / ' +
      state.filtered.length.toLocaleString() + ' · 종이 상세 ' + state.visibleExams.length.toLocaleString() + ' · ' + state.visibleGroups.length + '개 작은 은하';
    $('sceneInstruction').textContent = state.visibleGroups.length
      ? '시험지마다 고유 자료 노드 하나가 있습니다. 학교·학년·단원 은하를 바꿔 같은 원본의 다른 공간 배치를 둘러보세요.'
      : '조건에 맞는 은하가 없습니다. 필터를 풀거나 검색어를 바꿔 보세요.';
  }
  function setFilterSummary() {
    const active = [ui.grade.value, ui.school.value, ui.year.value, ui.unit.value, ui.search.value.trim()].filter(Boolean).length;
    const modeName = state.groupMode === 'grade' ? '학년 성단' : state.groupMode === 'unit' ? '단원 성단' : '학교 은하';
    $('filterSummary').textContent = active
      ? active + '개 조건 · ' + state.filtered.length.toLocaleString() + '개 시험지 · ' + modeName
      : '필터를 자유롭게 조합하세요. ' + modeName + ' 안에서 각 시험지는 한 번만 표시됩니다.';
  }
  function focusGroup(id) {
    const group = state.groupsById.get(id);
    if (!group) return;
    state.focusedGroupId = id;
    state.world?.focusGroup(id);
    renderSatelliteLabels();
    updateConstellations();
  }

  function setupFilterOptions() {
    optionValues(ui.school, [...new Set(state.exams.map((exam) => exam.school).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')), '학교');
    optionValues(ui.grade, [...new Set(state.exams.map((exam) => exam.grade).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')), '학년');
    optionValues(ui.year, [...new Set(state.exams.map((exam) => String(exam.year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a)), '연도');
    optionValues(ui.unit, [...state.filesByTag.keys()].sort((a, b) => a.localeCompare(b, 'ko')), '공개 L2 단원');
  }
  async function loadCatalog() {
    const response = await fetch('../../data/archive2-catalog.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('공개 Archive catalog 요청 실패 (' + response.status + ')');
    const raw = await response.json();
    const catalog = window.Archive2Core?.decodeCatalog(raw);
    if (!catalog?.exams || !catalog?.records) throw new Error('공개 Archive catalog 구조를 읽을 수 없습니다.');
    state.exams = catalog.exams.filter((exam) => exam.file && exam.contentType === '기출');
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
    const l2Count = state.records.filter((record) => clean(record.L2)).length;
    const l3Count = state.records.filter((record) => clean(record.L3)).length;
    ui.status.textContent = '공개 catalog · 시험지 ' + state.exams.length.toLocaleString() + ' · 학교 ' + schoolCount +
      ' · 공개 L2 record ' + l2Count.toLocaleString() + ' · 공개 L3 ' + l3Count;
    renderScene();
  }
  async function startUniverse() {
    const module = await import('./assets/orbital-world.js');
    state.world = module.createOrbitWorld({
      canvas: ui.canvas,
      onGroup: (id) => focusGroup(id),
      onExam: (file) => {
        const exam = state.exams.find((item) => item.file === file);
        if (exam) openExam(exam);
      },
      onBlackhole: () => window.open('../../generated-bank.html', '_blank', 'noopener'),
      onFrame: (positions) => {
        const reservedRects = [...document.querySelectorAll('.topbar,.scene-heading,.scene-hud,.scene-footer,.entry-chip,.filter-panel:not([hidden]),.list-panel.open,.drawer.open')]
          .filter((element) => element.getClientRects().length)
          .map((element) => element.getBoundingClientRect());
        const overlapsChrome = (point, halfWidth, halfHeight) => reservedRects.some((rect) =>
          point.x + halfWidth > rect.left && point.x - halfWidth < rect.right &&
          point.y + halfHeight > rect.top && point.y - halfHeight < rect.bottom,
        );
        for (const label of state.groupLabels.values()) label.style.display = 'none';
        const labelCandidates = [...state.groupLabels].map(([id, label]) => ({ id, label, point: positions.groups.get(id) }))
          .filter(({ point }) => point?.visible)
          .sort((a, b) => Number(b.id === state.focusedGroupId) - Number(a.id === state.focusedGroupId) || a.point.depth - b.point.depth);
        const occupiedGroupLabels = [];
        let shownGroupLabels = 0;
        for (const { id, label, point } of labelCandidates) {
          const selected = id === state.focusedGroupId;
          const crowded = occupiedGroupLabels.some((used) => Math.abs(used.x - point.x) < 122 && Math.abs(used.y - point.y) < 42);
          if ((!selected && (point.depth > 132 || crowded || shownGroupLabels >= 5)) || overlapsChrome(point, 74, 22)) { label.style.display = 'none'; continue; }
          label.style.display = 'block';
          occupiedGroupLabels.push(point);
          shownGroupLabels += 1;
          label.style.left = point.x + 'px';
          label.style.top = (point.y - 22) + 'px';
        }
        for (const button of state.satelliteButtons.values()) button.style.display = 'none';
        const satelliteCandidates = [...state.satelliteButtons].map(([file, button]) => ({ file, button, point: positions.exams.get(file) }))
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
    ui.unit.value = '';
    ui.search.value = '';
    state.activeTag = '';
    renderScene();
  }
  function setGroupMode(mode) {
    if (!['school', 'grade', 'unit'].includes(mode) || state.groupMode === mode) return;
    state.groupMode = mode;
    state.focusedGroupId = '';
    $('universe').classList.remove('focused');
    ui.focusedChip.hidden = true;
    $('groupModes').querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.groupMode === mode));
    });
    renderSatelliteLabels();
    renderScene();
    showToast(mode === 'unit'
      ? '단원 성단은 공개된 L2 태그를 기준으로 합니다. 시험지는 복제하지 않고 한 곳에만 둡니다.'
      : mode === 'grade'
        ? '같은 시험지 ID가 학년 성단의 공간 배치로 이동했습니다.'
        : '학교별 작은 은하로 다시 배치했습니다.');
  }

  async function init() {
    for (const field of [ui.grade, ui.school, ui.year, ui.unit]) field.addEventListener('change', renderScene);
    $('clearFilters').addEventListener('click', clearAllFilters);
    ui.filterToggle.addEventListener('click', () => toggleFilters());
    $('closeFilters').addEventListener('click', () => toggleFilters(false));
    $('viewToggle').addEventListener('click', () => toggleList());
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
    $('constellationToggle').addEventListener('click', (event) => {
      state.constellation = !state.constellation;
      event.currentTarget.setAttribute('aria-pressed', String(state.constellation));
      updateConstellations();
      if (state.constellation) showToast('실제 공개 L2 태그가 겹치는 시험지 노드를 우주 안의 빛으로 잇습니다.');
    });
    $('returnToGalaxy').addEventListener('click', () => {
      state.focusedGroupId = '';
      state.world?.resetCamera();
      ui.focusedChip.hidden = true;
      renderSatelliteLabels();
      updateConstellations();
    });
    $('drawerBack').addEventListener('click', closeExam);
    $('closeDrawer').addEventListener('click', closeExam);
    $('closeList').addEventListener('click', () => toggleList(false));
    ui.search.addEventListener('input', () => {
      clearTimeout(state.searchTimer);
      state.searchTimer = setTimeout(renderScene, 90);
    });
    ui.search.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); toggleList(true); }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (ui.drawer.classList.contains('open')) closeExam();
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
