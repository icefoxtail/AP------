// Archive2 workspace, compose part: scope tree, quick assessment, compose screen, selection, replace.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const AssessmentRecipes = window.ProblemBankAssessmentRecipes;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const Source = window.Archive2Source;
  const Unified = window.Archive2UnifiedUnits;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, META_FACET_FILTERS, Quick, QuickTree, activeAssessmentRecipe, activeAssessmentRecipeUids,
    advancedOptions, api, deriveNoteMarkup, assessmentSelectionOptions, button, composeMetaMatches, composeSubjectLabel,
    composeUnitLabel, context, displayTemplate, drafts, ensureDerivedBaseQuestions, ensureMetaIndex, esc,
    filterMarkup, frozenPaperCache, hasMetaFacetFilter, isAssessmentRecipeMode, isQuickAssessmentView,
    isSourceRoutedGeneralRange, lockedIndex, metaFacetLabel, omitUnifiedFilters, options, ownHistoryContext,
    quickPreset, quickProduct, quickState, rebuildUnissued, reconcileFinderSchool, reconcileUnifiedFilters,
    refreshComposeBar, render, renderMobileActions, renderOutputSettings, renderPaper, renderResultFinish,
    renderSaveRecovery, renderSavedContinuity, renderUidRoute, save, scheduleSave, scopeCourseKey,
    scopeParentKey, scopeText, showDialog, state, status, taxonomyRowsForFilters, unifiedIndex, unique,
    withDefaultComposeSubject, withoutMetaFacets, workspaceEligibility, workspaceMatchOptions,
    workspaceMatches, workspaceScopeParent, workspaceUseMode;
  WS.links.push(() => {
    ({
      $, META_FACET_FILTERS, Quick, QuickTree, activeAssessmentRecipe, activeAssessmentRecipeUids,
      advancedOptions, api, deriveNoteMarkup, assessmentSelectionOptions, button, composeMetaMatches, composeSubjectLabel,
      composeUnitLabel, context, displayTemplate, drafts, ensureDerivedBaseQuestions, ensureMetaIndex, esc,
      filterMarkup, frozenPaperCache, hasMetaFacetFilter, isAssessmentRecipeMode, isQuickAssessmentView,
      isSourceRoutedGeneralRange, lockedIndex, metaFacetLabel, omitUnifiedFilters, options,
      ownHistoryContext, quickPreset, quickProduct, quickState, rebuildUnissued, reconcileFinderSchool,
      reconcileUnifiedFilters, refreshComposeBar, render, renderMobileActions, renderOutputSettings,
      renderPaper, renderResultFinish, renderSaveRecovery, renderSavedContinuity, renderUidRoute, save,
      scheduleSave, scopeCourseKey, scopeParentKey, scopeText, showDialog, state, status,
      taxonomyRowsForFilters, unifiedIndex, unique, withDefaultComposeSubject, withoutMetaFacets,
      workspaceEligibility, workspaceMatchOptions, workspaceMatches, workspaceScopeParent, workspaceUseMode
    } = WS.api);
  });
  let replacementIndex = -1;
  V.candidateRecords = [];
  // ---- 조건을 바꿔 지워진 문제지를 한 단계 되살리는 길 (메모리에만 둔다: 초안·서버 형식·localStorage에 쓰지 않는다) ----
  // 이유: 50문항을 뽑고 교체·고정까지 손본 뒤 실수로 조건 하나를 건드리면 결과가 통째로 사라져 돌아갈 길이 없었다.
  // 조건은 invalidate()가 불릴 때 이미 바뀌어 있으므로, 이벤트가 시작될 때(main의 click/change/input) 바뀌기 전 조건을
  // 따로 적어 둔다(rememberComposeConditions). 이력은 쌓지 않고 마지막 하나만 둔다.
  const COMPOSE_CONDITION_KEYS = [
    "filters", "scopes", "distribution", "count", "buckets", "custom", "sources", "includeExtended", "difficultyFilterVersion",
  ];
  let conditionsBeforeEvent = null;
  let lastCleared = null;
  function rememberComposeConditions() {
    conditionsBeforeEvent =
      state.view === "compose" && state.selected.length && !state.uidRoute && !state.derivationSource && !state.receipts.length
        ? structuredClone(Object.fromEntries(COMPOSE_CONDITION_KEYS.map((key) => [key, state[key]])))
        : null;
  }
  // 되살릴 수 있는 것만 돌려준다. 새로 만들었거나(선정 결과가 있음), 다른 초안·새 작업이거나, 출제가 시작됐거나,
  // 카탈로그가 바뀌었으면 버린다.
  function clearedResult() {
    const last = lastCleared;
    if (!last) return null;
    if (
      state.selected.length || state.receipts.length || state.sealed || state.derivationSource || state.uidRoute ||
      last.draftId !== state.draftId || last.catalogVersion !== state.catalog?.indexVersion
    ) {
      lastCleared = null;
      return null;
    }
    return last;
  }
  // 다른 길(찾기의 "문제지 만들기" 등)로 새 조건을 들고 만들기에 왔을 때는 지워진 결과를 버린다.
  function discardClearedResult() {
    lastCleared = null;
    conditionsBeforeEvent = null;
  }
  function restoreClearedResult() {
    const last = clearedResult();
    if (!last) return;
    lastCleared = null;
    Object.assign(state, last.conditions, {
      selected: last.selected,
      rows: last.rows,
      pins: last.pins,
      undo: last.undo,
      // 지우기 직전에 준비해 둔 문제지를 그대로 돌려놓는다: 같은 서명이므로 다시 복원하지 않는다(#2529의 재사용과 같은 길).
      prepared: last.prepared,
      composeShortage: last.composeShortage,
      indexVersion: last.indexVersion,
      previewIndex: last.previewIndex,
      seed: last.seed,
      composeStale: false,
      composeStalePins: 0,
      composeNotice: "",
      // 과목을 좁혀 "범위 밖이라 해제했습니다" 안내가 떠 있었다면, 단원이 되돌아왔으므로 그 안내도 지운다.
      scopeNotice: "",
      ackWarnings: false,
    });
    scheduleSave();
    render();
    status("조건을 바꾸기 전의 문제지로 되돌렸습니다.");
  }
  function invalidate() {
    if (state.receipts.length)
      throw new Error(
        "이미 출제한 문제지는 보존됩니다. 아직 출제하지 않은 문제지에서 문항을 교체하거나 다시 만들어 주세요.",
      );
    // 지우기 직전의 조건과 선정 결과(문항·순서·고정·교체 이력)를 마지막 하나만 적어 둔다. 비어 있는 상태에서 또 부르면 그대로 둔다.
    if (state.selected.length) {
      lastCleared = conditionsBeforeEvent
        ? {
            draftId: state.draftId,
            catalogVersion: state.catalog?.indexVersion,
            conditions: conditionsBeforeEvent,
            selected: state.selected,
            rows: state.rows,
            pins: state.pins,
            undo: state.undo,
            prepared: state.prepared,
            composeShortage: state.composeShortage,
            indexVersion: state.indexVersion,
            previewIndex: state.previewIndex,
            seed: state.seed,
          }
        : null;
    }
    conditionsBeforeEvent = null;
    // 결과가 있었는데 조건이 바뀌면 오른쪽이 빈 화면이 되지 않게 "조건이 바뀌었습니다" 안내를 띄운다.
    if (state.selected.length) {
      state.composeStale = true;
      state.composeStalePins = state.pins.length;
    }
    state.composeNotice = "";
    state.composeShortage = [];
    state.selected = [];
    state.pins = [];
    state.prepared = [];
    state.undo = [];
    state.rows = [];
    state.ackWarnings = false;
    state.indexVersion = state.catalog.indexVersion;
    scheduleSave();
  }
  V.scopeRenderCache = null;
  V.displayedScopes = null;
  V.renderingScopes = false;
  V.renderPoolCache = null;
  function scopeOptions() {
    // S9: a UID route is one fixed scope over exactly the requested questions (no per-click scan).
    if (state.uidRoute) {
      const result = state.uidRoute.scopes;
      if (V.renderingScopes) {
        V.scopeRenderCache = result;
        V.displayedScopes = result;
      }
      return result;
    }
    const index = unifiedIndex();
    return index ? unifiedScopeOptions(index) : canonicalScopeOptions();
  }
  // PRIMARY scope source (user decision 2026-10-29): one 2022-based unit list per grade built by
  // Archive2UnifiedUnits. 2015 and 2022 items share a unit; a UID is counted once; items without
  // unit evidence stay selectable in a per-subject "단원 미분류" scope instead of disappearing.
  // 문제지 만들기 단원 목록의 둘째 층(2026-11-16, 계획 작업 3b): 대단원 아래 중단원(고등은 소단원 묶음).
  // 이름·순서·소속은 빠른 평가와 단원별 기출 표가 쓰는 공용 모듈(Archive2UnitTree)과 같은 규칙이다
  // (한 문항은 자기 대단원의 자식 한 줄에만 들어가고, 정할 수 없는 문항은 "중단원 미지정"/"기타" 줄이다).
  // 자식 구조는 조건(학교·연도·난이도)에 따라 바뀌지 않게 학년 전체 문항으로 한 번 만들고, 조건은 숫자에만 반영한다.
  // 자식 키는 `${대단원 키}~${자식 키}`이고 자식 키는 다시 계산해도 같은 안정 키다(m<8자리 해시> / 묶음 키 / __none__).
  let composeTreeCache = null;
  let composeGroupsRequested = false;
  function composeLoadGroups() {
    if (composeGroupsRequested || !QuickTree?.loadGroups) return;
    composeGroupsRequested = true;
    QuickTree.loadGroups().then(() => {
      composeTreeCache = null;
      if (state.catalog && state.view === "compose") render();
    });
  }
  function composeTree(index, grade) {
    if (!Quick?.wrapRecord || !QuickTree?.createTree || !index || !Unified.GRADE_PROFILE[grade]) return null;
    const middle = /^중[123]$/.test(grade);
    if (!middle) composeLoadGroups();
    const groupsReady = middle || Boolean(QuickTree.groupsLoaded?.());
    const metaIndex = ensureMetaIndex();
    const hit = composeTreeCache;
    if (hit && hit.index === index && hit.meta === metaIndex && hit.grade === grade && hit.groupsReady === groupsReady) return hit;
    const metaByUid = new Map((metaIndex || []).map(row => [row.questionUid || row.uid, row]));
    const seen = new Set(), placed = [], byUnit = new Map();
    for (const entry of index.views[grade] || []) {
      if (entry.unclassified || !entry.unitKey || !entry.uid || seen.has(entry.uid)) continue;
      seen.add(entry.uid);
      const wrapped = Quick.wrapRecord(entry.record, middle, index, metaByUid);
      placed.push([entry, wrapped]);
      if (!byUnit.has(entry.unitKey)) byUnit.set(entry.unitKey, []);
      byUnit.get(entry.unitKey).push(wrapped);
    }
    let tree = null;
    try {
      tree = QuickTree.createTree(Unified.GRADE_PROFILE[grade], Unified.unitsForGrade(grade).map(unit =>
        ({ key: unit.key, name: unit.name, course: unit.course, selectableRecords: byUnit.get(unit.key) || [] })));
    } catch (error) { tree = null; }
    const childOf = new Map();
    if (tree) for (const [entry, wrapped] of placed) childOf.set(entry.uid, tree.childKeyOf(entry.unitKey, wrapped));
    composeTreeCache = { index, meta: metaIndex, grade, groupsReady, tree, childOf };
    return composeTreeCache;
  }
  // 대단원 범위(draft)의 문항 묶음으로 자식 범위를 만든다. 자식은 대단원 목록(scopeOptions)에는 넣지 않고 `children`에만 둔다.
  function composeChildScopes(parent, draft, built) {
    if (!built?.tree || !built.tree.hasChildren(draft.entry.unitKey)) return [];
    return built.tree.childrenOf(draft.entry.unitKey).map(child => {
      const kid = draft.kids?.get(child.key);
      const uids = kid ? kid.uids : [];
      return {
        key: `${parent.key}~${child.key}`,
        parentKey: parent.key,
        childKey: child.key,
        childKind: child.kind,
        L1: parent.L1,
        L2: parent.L2,
        label: child.name,
        fullLabel: `${parent.fullLabel} › ${child.name}`,
        basicScope: false,
        unified: true,
        child: true,
        unclassified: false,
        paths: kid ? [...kid.paths] : [],
        scopeQuestionUids: uids,
        facetQuestionUids: kid?.facet || uids,
        count: uids.length,
        eligibleCount: uids.length,
        supplemental: false,
      };
    });
  }
  function unifiedScopeOptions(index) {
    if (V.renderingScopes && V.scopeRenderCache) return V.scopeRenderCache;
    const grade = state.filters.grade || "";
    const structure = grade ? Unified.structure(grade) : [];
    const built = grade ? composeTree(index, grade) : null;
    const excluded = C.composeExclusions(context()).union;
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      difficultyBuckets: state.buckets,
    };
    delete selectionFilters.scopeQuestionUids;
    // Facet filters decide scopeQuestionUids and the unit counts; the facet OPTION pool ignores
    // them (faceted search), so it is kept separately as facetQuestionUids.
    const metaActive = hasMetaFacetFilter(selectionFilters);
    const preMetaFilters = withoutMetaFacets(selectionFilters);
    const recipeUids = activeAssessmentRecipeUids();
    const seenUids = new Set();
    const drafts = new Map();
    if (grade) {
      for (const entry of Unified.candidates(index, {
        grade,
        semanticSubject: state.filters.semanticSubject,
        originalCurriculum: state.filters.originalCurriculum,
      })) {
        const record = entry.record;
        const uid = record.questionUid;
        if (!uid || seenUids.has(uid)) continue;
        if (recipeUids && !recipeUids.has(uid)) continue;
        if (!composeMetaMatches(record) || !workspaceMatches(record, preMetaFilters) ||
            !workspaceEligibility(record).ok || excluded.has(uid)) continue;
        seenUids.add(uid);
        const key = Unified.scopeKey(grade, entry.subject, entry.unitKey);
        let draft = drafts.get(key);
        if (!draft) {
          const subjectIndex = structure.findIndex((group) => group.subject === entry.subject);
          draft = {
            key, entry, subjectIndex: subjectIndex < 0 ? structure.length : subjectIndex,
            uids: [], facetUids: metaActive ? [] : null, paths: new Set(),
          };
          drafts.set(key, draft);
        }
        const childKey = built?.tree && !entry.unclassified ? built.childOf.get(uid) : "";
        let kid = null;
        if (childKey) {
          if (!draft.kids) draft.kids = new Map();
          kid = draft.kids.get(childKey);
          if (!kid) draft.kids.set(childKey, kid = { uids: [], facet: metaActive ? [] : null, paths: new Set() });
        }
        if (draft.facetUids) draft.facetUids.push(uid);
        if (kid?.facet) kid.facet.push(uid);
        if (metaActive && !C.metaFacetMatches(record, selectionFilters)) continue;
        draft.uids.push(uid);
        const pathKey = C.generalPathKey(record);
        draft.paths.add(pathKey);
        if (kid) { kid.uids.push(uid); kid.paths.add(pathKey); }
      }
    }
    const singleSubject = structure.length === 1;
    const result = [...drafts.values()]
      .sort((a, b) => a.subjectIndex - b.subjectIndex ||
        Number(a.entry.unclassified) - Number(b.entry.unclassified) ||
        a.entry.unitOrder - b.entry.unitOrder)
      .map((draft) => {
        const scope = {
          key: draft.key,
          L1: draft.entry.subjectLabel,
          L2: draft.entry.unitLabel,
          label: draft.entry.unitLabel,
          fullLabel: singleSubject ? draft.entry.unitLabel : `${draft.entry.subjectLabel} · ${draft.entry.unitLabel}`,
          basicScope: true,
          unified: true,
          unclassified: draft.entry.unclassified,
          paths: [...draft.paths],
          scopeQuestionUids: draft.uids,
          facetQuestionUids: draft.facetUids || draft.uids,
          count: draft.uids.length,
          eligibleCount: draft.uids.length,
          supplemental: false,
        };
        const children = composeChildScopes(scope, draft, built);
        if (children.length) scope.children = children;
        return scope;
      });
    if (V.renderingScopes) {
      V.scopeRenderCache = result;
      V.displayedScopes = result;
    }
    return result;
  }
  function canonicalScopeOptions() {
    if (V.renderingScopes && V.scopeRenderCache) return V.scopeRenderCache;
    const canonicalRows = taxonomyRowsForFilters(state.filters);
    const units = new Map();
    for (const row of canonicalRows) {
      const key = scopeParentKey(row);
      if (!units.has(key)) units.set(key, { ...row, records: new Map(), facetRecords: new Map() });
    }
    const excluded = C.composeExclusions(context()).union;
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      difficultyBuckets: state.buckets,
    };
    const metaActive = hasMetaFacetFilter(selectionFilters);
    const preMetaFilters = withoutMetaFacets(selectionFilters);
    const seenUids = new Set();
      const recipeUids = activeAssessmentRecipeUids();
    for (const record of state.catalog.records || []) {
      if (!record.questionUid || seenUids.has(record.questionUid)) continue;
      if (recipeUids && !recipeUids.has(record.questionUid)) continue;
      if (!composeMetaMatches(record) || !workspaceMatches(record, preMetaFilters) || !workspaceEligibility(record).ok) continue;
      // workspaceMatches already applies the selected difficulty buckets.
      if (excluded.has(record.questionUid)) continue;
      const parent = workspaceScopeParent(record);
      if (!parent) continue;
      const key = scopeParentKey({ ...record, ...parent });
      let unit = units.get(key);
      if (!unit && isSourceRoutedGeneralRange() && parent.supplemental) {
        const candidates = [...units.values()].filter((candidate) =>
          String(candidate.curriculumKey || "") === String(parent.curriculumKey || "") &&
          scopeText(candidate.L1) === scopeText(parent.L1) &&
          scopeText(candidate.L2) === scopeText(parent.L2),
        );
        if (candidates.length === 1) unit = candidates[0];
      }
      if (!unit) continue;
      unit.facetRecords.set(record.questionUid, record);
      if (!metaActive || C.metaFacetMatches(record, selectionFilters))
        unit.records.set(record.questionUid, record);
      unit.supplemental = unit.supplemental || parent.supplemental === true;
      seenUids.add(record.questionUid);
    }
    for (const [key, unit] of units)
      if (!unit.records.size && !(metaActive && unit.facetRecords.size)) units.delete(key);

    const semanticGroups = new Map();
    const displayGroups = state.catalog.basicScopeGroups || [];
    const displayGroupFor = unit => !state.filters.curriculumKey && displayGroups.findIndex(group =>
      group.members.some(member => (!unit.curriculumKey || member.curriculumKey === unit.curriculumKey) &&
        scopeCourseKey(member) === unit.courseKey && scopeText(member.L1) === scopeText(unit.L1) && scopeText(member.L2) === scopeText(unit.L2)));
    for (const unit of units.values()) {
      const displayGroup = displayGroupFor(unit);
      const key = displayGroup !== false && displayGroup >= 0
        ? `display-group-${displayGroup}`
        : [unit.curriculumKey, unit.courseKey, scopeText(unit.L1), scopeText(unit.L2)].join("|");
      if (!semanticGroups.has(key)) semanticGroups.set(key, []);
      semanticGroups.get(key).push(unit);
    }
    const groups = [];
    for (const candidates of semanticGroups.values()) {
      if (!state.filters.curriculumKey && candidates.length > 1) {
        const displayGroup = displayGroupFor(candidates[0]);
        const preferred = displayGroup >= 0 ? displayGroups[displayGroup].preferredCurriculum : "";
        const first = candidates.find(unit => unit.curriculumKey === preferred) || candidates[0];
        groups.push({
          curriculumKey: "all",
          courseKey: "all",
          L1: first.L1,
          L2: first.L2,
          units: candidates,
        });
      } else {
        groups.push(...candidates.map((unit) => ({ ...unit, units: [unit] })));
      }
    }
    const displayKeys = new Map();
    for (const group of groups) {
      const key = scopeText(group.L1) + "|" + scopeText(group.L2);
      displayKeys.set(key, (displayKeys.get(key) || 0) + 1);
    }
    const result = groups.map((group, index) => {
      const sources = unique(group.units.flatMap((unit) => [...unit.records.values()]));
      const supplemental = sources.some((record) => workspaceScopeParent(record)?.supplemental === true);
      const paths = supplemental ? [] : unique(sources.map((record) => C.pathKey(record, 4)));
      const displayKey = scopeText(group.L1) + "|" + scopeText(group.L2);
      const suffix =
        displayKeys.get(displayKey) > 1
          ? ` · ${group.curriculumKey === "all" ? "통합" : group.curriculumKey}`
          : !state.filters.curriculumKey && !sources.length && ["2015", "2022"].includes(group.curriculumKey)
            ? ` · ${group.curriculumKey}`
          : "";
      return {
        key: `scope-${index}-${scopeText(group.L1)}-${scopeText(group.L2)}-${group.curriculumKey}`,
        L1: group.L1,
        L2: group.L2,
        label: `${group.L2}${suffix}`,
        basicScope: true,
        paths,
        scopeQuestionUids: unique(sources.map(r => r.questionUid)),
        facetQuestionUids: unique(group.units.flatMap((unit) => [...unit.facetRecords.keys()])),
        count: sources.length,
        eligibleCount: sources.length,
        supplemental,
      };
    });
    if (V.renderingScopes) {
      V.scopeRenderCache = result;
      V.displayedScopes = result;
    }
    return result;
  }
  function scopeIsSelected(scope) {
    return (
      state.scopes.includes(scope.key) ||
      (!scope.unified && scope.paths.some((path) => state.scopes.includes(path)))
    );
  }
  // 고른 범위: 대단원을 고르면 그 단원 전체(자식 키가 함께 있어도 대단원이 우선), 아니면 고른 중단원(소단원 묶음)들.
  function pickedScopeNodes(scopes = scopeOptions()) {
    const picked = [];
    for (const scope of scopes) {
      if (scopeIsSelected(scope)) picked.push(scope);
      else for (const child of scope.children || []) if (state.scopes.includes(child.key)) picked.push(child);
    }
    return picked;
  }
  function selectedScopeOptions() {
    return pickedScopeNodes().filter((scope) => scope.count > 0);
  }
  // 대단원 키 목록에서 같은 대단원의 자식 키를 뺀다(대단원이 자식을 포함한다).
  function withoutShadowedChildren(keys, scopes) {
    const parents = new Set(keys);
    const shadowed = new Set(scopes.filter(scope => parents.has(scope.key)).flatMap(scope => (scope.children || []).map(child => child.key)));
    return keys.filter(key => !shadowed.has(key));
  }
  function selectedScopePaths() {
    const scopes = selectedScopeOptions();
    return scopes.some((scope) => scope.supplemental)
      ? []
      : unique(scopes.flatMap((scope) => scope.paths));
  }
  function selectedScopeQuestionUids() {
    return unique(selectedScopeOptions().flatMap(scope => scope.scopeQuestionUids));
  }
  function planRows() {
    const scopes = selectedScopeOptions();
    if (state.distribution === "pool")
      return scopes.length
        ? [
            {
              id: "pool",
              count: Number(state.count),
              difficultyBuckets: state.buckets,
              paths: selectedScopePaths(),
              scopeQuestionUids: selectedScopeQuestionUids(),
            },
          ]
        : [];
    return scopes
      .map((s) => ({
        id: s.key,
        paths: s.paths,
        scopeQuestionUids: s.scopeQuestionUids,
        depth: 4,
        label: s.fullLabel || s.label,
        count:
          state.distribution === "all"
            ? s.eligibleCount
            : Number(
                state.distribution === "custom"
                  ? (state.custom[s.key]?.count ?? state.count)
                  : state.count,
              ),
        difficultyBuckets:
          state.distribution === "custom"
            ? state.custom[s.key]?.buckets || state.buckets
            : state.buckets,
      }))
      .filter((r) => r.count > 0 || state.distribution !== "all");
  }
  function pool() {
    if (V.renderingScopes && V.renderPoolCache) return V.renderPoolCache;
    // A failed UID route never falls back to the whole catalog.
    if (state.uidRoute && !state.uidRoute.scopes.length) return [];
    const scopes = selectedScopeOptions();
    const recipeUids = activeAssessmentRecipeUids();
    const uids = scopes.length ? new Set(scopes.flatMap(scope => scope.scopeQuestionUids)) : null;
    const result = !scopes.length
      ? state.catalog.records.filter(record =>
        (!recipeUids || recipeUids.has(record.questionUid)) && composeMetaMatches(record))
      : state.catalog.records.filter(
        (r) => uids.has(r.questionUid) && (!recipeUids || recipeUids.has(r.questionUid)) && composeMetaMatches(r),
      );
    if (V.renderingScopes) V.renderPoolCache = result;
    return result;
  }
  function request(useFrozen = false) {
    const rows = useFrozen ? state.rows : planRows();
    const paths = useFrozen ? unique(rows.flatMap(row => row.paths || (row.path ? [row.path] : []))) : selectedScopePaths();
    const scopeQuestionUids = useFrozen
      ? unique(rows.flatMap(row => row.scopeQuestionUids || state.catalog.records.filter(r => C.rowMatches(r, row, workspaceMatchOptions())).map(r => r.questionUid)))
      : selectedScopeQuestionUids();
    const routedFilters = unifiedIndex()
      ? omitUnifiedFilters(state.filters)
      : isSourceRoutedGeneralRange()
        ? { ...state.filters, courseKey: "" }
        : state.filters;
    const filters = {
      ...withoutMetaFacets(routedFilters),
      sourceFiles: state.sources,
      primaryPaths: paths,
      scopeQuestionUids,
    };
    // The grade/subject buttons leave the unified-only 교육과정 filter as "" in state.filters; the saved-paper server rejects any key it does not know (409).
    if (!filters.originalCurriculum) delete filters.originalCurriculum;
    return {
      filters,
      rows,
      pins: state.selected
        .filter((r) => state.pins.includes(r.questionUid))
        .map((r) => ({ questionUid: r.questionUid, rowId: r.rowId })),
      canonicalAuthority: state.catalog?.canonicalAuthority,
      projectionPolicy: state.catalog?.projectionPolicy,
      useMode: workspaceUseMode(),
      seed: state.seed,
    };
  }
  function saveWorkSignature() {
    const req = request(state.selected.length > 0);
    return JSON.stringify({
      indexVersion: state.indexVersion || state.catalog?.indexVersion || "",
      selectionFilters: req.filters,
      selected: state.selected.map((record) => [record.questionUid, record.sourceFingerprint]),
      rows: state.rows,
      scopes: state.scopes,
      sources: state.sources,
      distribution: state.distribution,
      count: state.count,
      buckets: state.buckets,
      custom: state.custom,
      round: state.round,
      rounds: state.rounds,
      title: state.title,
      header: state.header,
      qpp: state.qpp,
      includeQr: state.includeQr,
      derivationSource: state.derivationSource,
    });
  }
  function review() {
    const ctx = ownHistoryContext(),
      req = request(true);
    if (state.receipts.length && state.sealed) {
      req.historyReady = true;
    }
    const result = C.review(state.selected, req, ctx);
    if (state.indexVersion !== state.catalog.indexVersion) {
      result.status = "HARD_BLOCK";
      result.hardFailures.push(
        "문항 목록이 갱신되었습니다. 다시 만들어 주세요.",
      );
    }
    return result;
  }
  async function refreshHistory() {
    const token = ++state.targetVersion;
    state.historyReady = false;
    state.history = null;
    state.historyError = "";
    if (!state.studentIds.length || state.historyMode === "off") {
      state.historyReady = true;
      render();
      return;
    }
    const candidateQuestionUids = unique(
      state.selected.map((record) => record.questionUid),
    );
    status("현재 시험지와 이전 출제 이력을 확인하고 있습니다.");
    try {
      const result = await api("/class-exam-assignments/question-history", {
        student_ids: state.studentIds,
        candidate_question_uids: candidateQuestionUids,
        history_mode: state.historyMode,
        recent_days: state.recentDays,
      });
      if (token !== state.targetVersion) return;
      state.history = result;
      state.historyReady = true;
      state.historyError = "";
      render();
      status(
        `현재 시험지 중 이전 출제와 겹치는 문항 ${result.union_question_uids.length}개를 확인했습니다.`,
      );
    } catch (e) {
      if (token !== state.targetVersion) return;
      state.historyError = e.message || "이전 출제 이력을 확인하지 못했습니다.";
      state.historyReady = false;
      render();
      status("이전 출제 이력을 확인하지 못했습니다. 시험지는 그대로 출제할 수 있습니다.");
    }
  }

  V.quickPoolCache = { index: null, meta: null, metaByUid: null, pools: null };
  // Pools are built once per catalog load (and recorded-meta load) from the unified index; a
  // click or a preset change only reads them.
  function quickPools() {
    const index = unifiedIndex();
    if (!Quick || !index) return null;
    // Quick pools use the recorded-meta index; it is built here (not at boot) so it can never be missing.
    const metaIndex = ensureMetaIndex();
    if (V.quickPoolCache.index !== index || V.quickPoolCache.meta !== metaIndex) {
      const metaByUid = new Map((metaIndex || []).map(row => [row.questionUid || row.uid, row]));
      V.quickPoolCache = { index, meta: metaIndex, metaByUid, pools: Quick.buildPools(index, { metaByUid }) };
      quickScopeCache = null;
    }
    if (state.view !== "diagnostic") return V.quickPoolCache.pools;
    // 진단평가: its own pools (original exams only, 5단계 folded into the 4~5단계 slot) of the chosen semester, cached with the shared ones.
    if (quickDiagCache.token !== V.quickPoolCache) quickDiagCache = { token: V.quickPoolCache, bySemester: new Map() };
    syncDiagnosticSemester();
    const semester = quickState.semester;
    if (!quickDiagCache.bySemester.has(semester))
      quickDiagCache.bySemester.set(semester, Quick.buildPools(index, { metaByUid: V.quickPoolCache.metaByUid, product: Quick.PRODUCTS.diagnostic, semester }));
    return quickDiagCache.bySemester.get(semester);
  }
  let quickDiagCache = { token: null, bySemester: new Map() };
  // 고1: 1학기 = 공통수학1, 2학기 = 공통수학2 (학기 단추는 그 학기의 과목 범위, 시험지 학기가 아니다). The two buttons never disagree:
  // the subject button wins (a link or a click on it sets the semester); "1·2학기" leaves the subject as it is. Returns true when it changed the semester.
  function syncDiagnosticSemester() {
    if (state.view !== "diagnostic" || quickState.grade !== "고1" || !["1", "2"].includes(quickState.semester)) return false;
    const expected = quickState.subject === "COMMON_MATH_2" ? "2" : quickState.subject === "COMMON_MATH_1" ? "1" : "";
    if (!expected || expected === quickState.semester) return false;
    quickState.semester = expected;
    return true;
  }
  const QUICK_SEMESTER = Object.freeze({ "1": "1학기", "2": "2학기", "": "1·2학기" });
  // The paper / bar name: 고2·고3 pools are the whole subject (the semester does not cut them), so no semester is claimed there.
  const quickDiagnosticName = (subjectLabel) => /^고[23]$/.test(quickState.grade) ? subjectLabel : `${subjectLabel} ${QUICK_SEMESTER[quickState.semester]}`;
  // 중단원 / 소단원 scopes of the chosen grade and subject (shared unit tree). Built once per pool / selection /
  // 소단원 묶음표 load and read by every render and click. The 묶음표 (high school 소단원, a small JSON) is requested
  // at boot; until it is there a high school list shows its 단원 only and says so.
  let quickScopeCache = null;
  let quickGroupsRequested = false;
  function quickLoadGroups() {
    if (quickGroupsRequested || !QuickTree?.loadGroups) return;
    quickGroupsRequested = true;
    QuickTree.loadGroups().then((doc) => {
      quickState.groupsFailed = !doc;
      quickScopeCache = null;
      if (state.catalog && isQuickAssessmentView()) render();
    });
  }
  function quickScopes(pools) {
    if (!pools || !quickState.grade || !quickState.subject) return null;
    const middle = /^중[123]$/.test(quickState.grade);
    if (!middle) quickLoadGroups();
    const groupsReady = middle || Boolean(QuickTree?.groupsLoaded?.());
    const key = `${quickState.grade}|${quickState.subject}|${groupsReady}`;
    if (quickScopeCache?.pools !== pools || quickScopeCache.key !== key)
      quickScopeCache = { pools, key, scopes: Quick.buildScopes(pools, quickState.grade, quickState.subject,
        { index: V.quickPoolCache.index, metaByUid: V.quickPoolCache.metaByUid }) };
    return quickScopeCache.scopes;
  }
  // The grade / subject choice is shared by the four products; the difficulty preset is per product.
  function quickEnsureSelection(pools) {
    if (!Unified.GRADES.includes(quickState.grade)) { quickState.grade = ""; quickState.subject = ""; return []; }
    const subjects = Quick.subjectsFor(pools, quickState.grade);
    if (!subjects.some(subject => subject.value === quickState.subject))
      quickState.subject = (subjects.find(subject => subject.items > 0) || subjects[0] || {}).value || "";
    return subjects;
  }
  const quickGradeClass = (grade) => `grade-${({ 중1: "m1", 중2: "m2", 중3: "m3", 고1: "h1", 고2: "h2", 고3: "h3" })[grade] || "none"}`;
  const QUICK_INTRO = {
    "five-minute": (grade) => `대단원 전체나 ${/^중/.test(grade) ? "중단원" : "소단원"} 하나에서 4문항, 수업 앞뒤 5분 확인용입니다.`,
    "subunit-test": (grade) => `${/^중/.test(grade) ? "중단원" : "소단원"} 하나에서 12문항을 냅니다.`,
    "unit-test": (grade) => `${/^중/.test(grade) ? "중단원" : "단원"} 하나에서 20문항을 냅니다.`,
    "monthly-test": () => "여러 단원을 묶어 24문항을 냅니다. 고르지 않으면 과목 전체에서 냅니다.",
    diagnostic: (grade) => `첫 상담용 24문항입니다. 실제 학교 기출을 쓰고(모자란 단계만 유형·유사 문항으로 채움), 쉬운 단계부터 차례로 나옵니다. ${/^고[23]$/.test(grade)
      ? "과목을 고르고, 단원을 고르지 않으면 과목 전체에서 냅니다." : "학기를 고르고, 단원을 고르지 않으면 학기 전체에서 냅니다."}`,
  };
  // One pickable row of the unit list: a button (one unit) or a check box (종합평가). `root` rows are the whole 대단원.
  function quickRowMarkup(item, product, picked, busy) {
    const { node, role } = item;
    const name = role === "root" && node.kind !== "unclassified" ? `${node.label} 전체` : node.label;
    const counts = quickCountsText(node, product);
    const body = `<span class="qk-row-name">${esc(name)}</span><small>${counts}</small>`;
    if (product.combine) {
      const implied = role === "child" && picked.has(node.root.key);
      return `<label class="qk-row qk-check${role === "root" ? " is-root" : ""}${implied ? " is-implied" : ""}"><input type="checkbox" data-quick-bundle="${esc(node.key)}"
        ${picked.has(node.key) || implied ? "checked" : ""}${implied ? " disabled" : ""}><span>${body}</span></label>`;
    }
    return `<button type="button" class="qk-row${role === "root" ? " is-root" : ""}" data-action="quick-pick" data-unit-key="${esc(node.key)}"
      aria-pressed="${picked.has(node.key)}" ${busy ? "disabled" : ""}>${body}</button>`;
  }
  function renderQuick() {
    const product = quickProduct();
    const tabs = `<div class="qk-seg" role="group" aria-label="평가 종류">${Quick?.VIEWS.map(view =>
      `<button type="button" class="qk-seg-btn" data-view="${view}" aria-pressed="${view === state.view}">${esc(Quick.PRODUCTS[view].title)}</button>`).join("") || ""}</div>`;
    let pools = quickPools();
    if (!pools) return `<div class="qk">${tabs}<section class="panel"><h1>${esc(product?.title || "빠른 평가")}</h1><p class="muted">단원 목록을 준비하지 못했습니다. 페이지를 새로 고쳐 주세요.</p></section></div>`;
    const subjects = quickEnsureSelection(pools);
    if (syncDiagnosticSemester()) pools = quickPools();
    const preset = quickPreset();
    const busy = quickState.busy;
    const mix = Quick.presetMix(product, preset);
    const grade = quickState.grade;
    const scopes = quickScopes(pools);
    const subjectLabel = subjects.find(subject => subject.value === quickState.subject)?.label || "";
    const diagnostic = state.view === "diagnostic";
    const wholeName = diagnostic ? quickDiagnosticName(subjectLabel) : subjectLabel;
    const semesterChips = diagnostic ? `<div class="quick-chips" role="group" aria-label="학기">${["1", "2", ""].map(value =>
      `<button type="button" class="quick-chip" data-action="quick-semester" data-semester="${value}" aria-pressed="${value === quickState.semester}">${QUICK_SEMESTER[value]}</button>`).join("")}</div>` : "";
    const noun = Quick.unitNoun(state.view, grade);
    const gradeButtons = Unified.GRADES.map(label =>
      `<button type="button" class="find-grade ${quickGradeClass(label)}" data-action="quick-grade" data-grade="${label}" aria-pressed="${label === grade}">${label}</button>`).join("");
    const subjectChips = subjects.length > 1 ? `<div class="quick-chips" role="group" aria-label="과목">${subjects.map(subject =>
      `<button type="button" class="quick-chip" data-action="quick-subject" data-subject="${esc(subject.value)}" aria-pressed="${subject.value === quickState.subject}"${subject.items || subject.value === quickState.subject ? "" : " disabled"}>${esc(subject.label)} <small>${subject.items}</small></button>`).join("")}</div>`
      : (subjects.length ? `<p class="qk-subject-note">${esc(subjectLabel)}</p>` : "");
    // ---- unit list (left) and what it will make (right)
    let list = "", result = "", bar = "";
    const openAll = (label, ok) => button("quick-open-all", label, `type="button" class="primary" ${ok && !busy ? "" : "disabled"}`);
    if (!grade) {
      list = '<p class="muted">학년을 선택하세요.</p>';
      result = `<p class="muted">학년과 ${esc(noun)}을 고르면 만들 시험지가 여기에 보입니다.</p>`;
    } else if (!scopes?.roots.length) {
      list = `<p class="muted">이 과목에는 ${esc(product.title)}에 쓸 수 있는 ${esc(noun)}가 아직 없습니다.</p>`;
      result = `<p class="muted">고를 수 있는 ${esc(noun)}가 없습니다. 다른 학년이나 과목을 선택해 보세요.</p>`;
    } else {
      const groups = Quick.pickableGroups(scopes, state.view);
      const items = groups.flatMap(group => group.items.map(item => ({ ...item, section: group.section, unclassified: group.unclassified })));
      const known = new Set(items.map(item => item.node.key));
      // A choice made on another product stays only where this product can pick it.
      if (!known.has(quickState.pick)) quickState.pick = "";
      for (const key of [...quickState.bundle]) if (!known.has(key)) quickState.bundle.delete(key);
      const picked = new Set(product.combine ? quickState.bundle : (quickState.pick ? [quickState.pick] : []));
      // Which rows can make this product at this difficulty. 종합평가 unions units, so a row is only "empty" or not.
      const verdicts = new Map(items.map(item => [item.node.key, product.combine
        ? { ok: item.node.total > 0, shortages: [] } : Quick.evaluate([item.node], product, preset)]));
      const readyCount = items.filter(item => verdicts.get(item.node.key).ok).length;
      const groupMarkup = (group, ready) => {
        const rows = group.items.filter(item => verdicts.get(item.node.key).ok === ready);
        if (!rows.length) return "";
        const head = `<h3 class="qk-group-title">${esc(group.section.label)}<small>${group.section.unit.total}문항</small></h3>`;
        if (ready) return `<div class="qk-group">${head}<div class="qk-rows">${rows.map(item => quickRowMarkup(item, product, picked, busy)).join("")}</div></div>`;
        return `<div class="qk-group">${head}<div class="qk-rows">${rows.map(item => {
          const { node, role } = item, verdict = verdicts.get(node.key);
          const name = role === "root" && node.kind !== "unclassified" ? `${node.label} 전체` : node.label;
          return `<div class="qk-row is-short" aria-disabled="true"><span class="qk-row-name">${esc(name)}</span><em class="qk-reason">${esc(product.combine ? "문항 없음" : Quick.shortReason(verdict.shortages))}</em></div>`;
        }).join("")}</div></div>`;
      };
      const readyMarkup = groups.map(group => groupMarkup(group, true)).join("");
      const shortRows = items.length - readyCount;
      const shortNoun = product.combine ? "문항이 없는" : "문항이 모자란";
      const shortMarkup = shortRows ? `<div class="qk-short"><button type="button" class="qk-short-toggle" data-action="quick-short-toggle" aria-expanded="${quickState.shortOpen}">${shortNoun} ${esc(noun)} ${shortRows}개</button>
        ${quickState.shortOpen ? `<div class="qk-short-body">${groups.map(group => groupMarkup(group, false)).join("")}</div>` : ""}</div>` : "";
      const groupNote = !scopes.middle && scopes.groupsMissing && state.view !== "unit-test"
        ? `<p class="callout qk-note">${quickState.groupsFailed ? "소단원 목록을 불러오지 못해 단원 단위로 보입니다." : "소단원 목록을 불러오는 중입니다. 단원 단위로 먼저 보입니다."}</p>` : "";
      const hint = product.combine
        ? "범위를 고르세요. 대단원을 고르면 그 안의 중단원이 모두 들어갑니다. 고르지 않으면 과목 전체에서 냅니다."
        : `${esc(noun)} 하나를 고르세요. 숫자는 단계별 기출 문항 수입니다.`;
      list = `${groupNote}<p class="muted qk-hint" id="quick-ready-summary">이 난이도로 만들 수 있는 ${esc(noun)} ${readyCount}개 · 전체 ${items.length}개</p>
        <p class="muted qk-hint">${hint}</p>
        ${readyCount ? `<div class="qk-groups">${readyMarkup}</div>` : '<p class="callout">이 난이도로 만들 수 있는 단원이 없습니다. 난이도를 바꾸거나 다른 과목을 선택해 보세요.</p>'}${shortMarkup}`;
      // ---- result
      const info = (heading, count, lines, actions) => `<h2 class="qk-r-title">${esc(heading)}</h2>${lines}<p class="qk-r-count"><span class="qk-big">${count}</span>문항</p>
        <p class="muted qk-r-mix">${esc(Quick.PRESET_LABELS[preset])} · ${mix}</p><div class="qk-actions">${actions}</div>
        <p class="muted qk-r-after">열리는 창에서 시험지·해설·정답을 출력할 수 있습니다. 보관함에 저장하거나 반에 출제하려면 문제지 만들기를 이용하세요.</p>`;
      if (product.combine) {
        const selectedUnits = Quick.selectNodes(scopes, [...quickState.bundle]);
        const verdictAll = Quick.evaluate(scopes.roots, product, preset);
        const verdictSel = Quick.evaluate(selectedUnits, product, preset);
        const names = selectedUnits.slice(0, 3).map(unit => unit.label).join(" · ") + (selectedUnits.length > 3 ? ` 외 ${selectedUnits.length - 3}개` : "");
        // Short originals are filled with 유형·유사 questions of the same units (the pool decides, no choice for the teacher).
        const reason = (verdict) => verdict.ok ? (diagnostic && verdict.fills.length
          ? `<p class="qk-r-fill">${esc(Quick.fillText(verdict.fills))}</p>` : "")
          : `<p class="qk-r-reason">${esc(Quick.shortageText(verdict.shortages))}</p>`;
        const formsBox = diagnostic ? `<label class="qk-forms"><input type="checkbox" id="quick-two-forms" data-quick-two-forms
          ${quickState.twoForms ? "checked" : ""} ${busy ? "disabled" : ""}><span>A·B형 두 벌</span></label>
          ${quickState.twoForms ? '<p class="muted qk-forms-note">같은 범위·난이도로 B형을 한 벌 더 만듭니다. 단원·단계별 문항 수는 같고 A형 문항은 쓰지 않습니다.</p>' : ""}
          ${quickState.formB ? button("quick-open-b", "B형 열기", 'type="button"') : ""}` : "";
        const actions = `${button("quick-open-selected", `선택한 ${esc(noun)} ${selectedUnits.length}개로 시험지 열기`,
          `type="button" class="primary" ${selectedUnits.length && verdictSel.ok && !busy ? "" : "disabled"}`)}
          ${openAll(`${esc(wholeName)} 전체로 시험지 열기`, verdictAll.ok)}${formsBox}`;
        const lines = `<p class="qk-r-scope">${selectedUnits.length ? `<strong>${esc(names)}</strong>` : `<strong>${esc(wholeName)} 전체</strong> <span class="muted">(고른 ${esc(noun)} 없음)</span>`}</p>
          ${selectedUnits.length ? reason(verdictSel) : reason(verdictAll)}`;
        result = info(product.title, product.count, lines, actions) + quickReportMarkup();
        bar = { text: selectedUnits.length ? `${product.count}문항 · ${selectedUnits.length}개 ${noun}` : `${product.count}문항 · ${diagnostic ? `${wholeName} 전체` : "과목 전체"}`,
          action: selectedUnits.length ? "quick-open-selected" : "quick-open-all",
          disabled: busy || (selectedUnits.length ? !verdictSel.ok : !verdictAll.ok) };
      } else {
        const node = quickState.pick ? scopes.byKey.get(quickState.pick) : null;
        if (!node) {
          result = `<h2 class="qk-r-title">${esc(product.title)}</h2><p class="muted">왼쪽에서 ${esc(noun)}을 고르면 만들 시험지가 여기에 보입니다.</p>`;
          bar = { text: `${noun}을 고르세요`, action: "quick-open-pick", disabled: true };
        } else {
          const verdict = Quick.evaluate([node], product, preset);
          const path = node.root ? `${node.root.label} › ${node.label}` : node.label;
          const lines = `<p class="qk-r-scope"><strong>${esc(path)}</strong></p>${verdict.ok ? "" : `<p class="qk-r-reason">${esc(Quick.shortageText(verdict.shortages))}</p>`}`;
          result = info(product.title, product.count, lines, button("quick-open-pick", "시험지 열기", `type="button" class="primary" ${verdict.ok && !busy ? "" : "disabled"}`));
          bar = { text: `${product.count}문항 · ${node.label}`, action: "quick-open-pick", disabled: busy || !verdict.ok };
        }
      }
    }
    // 진단평가 only: the A·B check box also sits in the bottom bar, the only open button below 1100px.
    const barForms = bar && diagnostic ? `<label class="qk-bar-forms"><input type="checkbox" id="quick-two-forms-bar" data-quick-two-forms
      ${quickState.twoForms ? "checked" : ""} ${busy ? "disabled" : ""}><span>A·B형 두 벌</span></label>${quickState.formB
        ? button("quick-open-b", "B형 열기", 'type="button" class="qk-bar-b"') : ""}` : "";
    const barMarkup = bar ? `<div class="qk-bar" role="region" aria-label="시험지 열기">${barForms}<div class="qk-bar-text"><strong class="qk-bar-count">${esc(bar.text)}</strong></div>
      ${button(bar.action, "시험지 열기", `type="button" class="qk-bar-main" ${bar.disabled ? "disabled" : ""}`)}</div>` : "";
    const levelOpen = quickState.levelOpen ? " is-open" : "";
    return `<div class="qk">${tabs}<div class="qk-intro"><h1>${esc(product.title)}</h1><p class="muted">${esc(QUICK_INTRO[state.view]?.(grade) || "")}</p>${state.view === "subunit-test"
      ? '<a class="qk-pack-link" href="assessment/assessment-mvp.html?scope=subunit">기존 소단원 평가팩 45개 보기</a>' : ""}</div>
      <div class="qk-grid">
        <div class="qk-cond">
          <section class="qk-block"><h2 class="qk-h">${diagnostic ? "학년 · 과목 · 학기" : "학년 · 과목"}</h2>
            <div class="qk-grades" role="group" aria-label="학년">${gradeButtons}</div>${subjectChips}${semesterChips}</section>
          <section class="qk-block qk-level${levelOpen}"><div class="qk-level-head"><h2 class="qk-h">난이도 · <span id="five-minute-level-current">${Quick.PRESET_LABELS[preset]}</span></h2>
            <button type="button" class="qk-fold" data-action="quick-level-toggle" aria-expanded="${quickState.levelOpen}">바꾸기</button></div>
            <p class="muted" id="quick-assessment-mix">${mix}</p>
            <div class="qk-level-body"><div class="five-minute-slider"><div class="five-minute-slider-labels">${product.order.map(key => `<span>${Quick.PRESET_LABELS[key]}</span>`).join("")}</div>
              <div class="five-minute-slider-rail">${product.order.map(() => "<span></span>").join("")}
                <input id="five-minute-level" type="range" min="0" max="${product.order.length - 1}" step="1"
                  value="${product.order.indexOf(preset)}" aria-label="${esc(product.title)} 난이도" aria-valuetext="${Quick.PRESET_LABELS[preset]}">
              </div></div>
              <p class="muted qk-note">문항은 최신 연도(2026년, 2025년 순)부터 고릅니다. 같은 연도에서는 무작위로 섞습니다. 난이도는 기록된 1~5단계만 쓰며 하·중·상 표시로 추정하지 않습니다.</p></div></section>
          <section class="qk-block qk-scope"><h2 class="qk-h">${esc(noun)}</h2>${list}</section>
        </div>
        <aside class="qk-result" aria-label="만들어질 평가">${result}</aside>
      </div>${window.Archive2QuickPacks?.markup?.() || ""}${barMarkup}</div>`;
  }
  // 진단평가 결과표: the result sheet (assessment/diagnostic-report.html) of the paper just made. Its only input is the
  // question UIDs in paper order, so the link is a plain new-tab anchor (no output envelope, nothing stored).
  function quickReportHref(uids) {
    return `assessment/diagnostic-report.html?uids=${uids.map(encodeURIComponent).join(",")}`;
  }
  function quickReportMarkup() {
    const report = quickState.report;
    if (state.view !== "diagnostic" || !report?.a?.length) return "";
    const link = (uids, text) => `<a class="qk-report-link" href="${esc(quickReportHref(uids))}" target="_blank" rel="noopener" data-quick-report>${esc(text)}</a>`;
    return `<div class="qk-report"><p class="muted qk-report-note">${esc(report.title)} · 학생이 푼 뒤 문항별 O/X를 눌러 결과표를 만듭니다.</p>${report.b
      ? link(report.a, "A형 결과표 열기") + link(report.b, "B형 결과표 열기") : link(report.a, "결과표 열기")}</div>`;
  }
  function fiveMinuteShuffle(rows) {
    const result = rows.slice();
    const value = new Uint32Array(1);
    for (let i = result.length - 1; i > 0; i--) {
      const range = i + 1, limit = Math.floor(4294967296 / range) * range;
      do { crypto.getRandomValues(value); } while (value[0] >= limit);
      const j = value[0] % range;
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  // Recency policy (C.RECENCY_POLICY, user decision 2026-11-10): newest year first, unknown years
  // last; random within the same year.
  function recencyShuffle(rows) {
    return fiveMinuteShuffle(rows).sort(C.compareRecency);
  }
  // Coarse recency tier for the balanced score: 0..8 for known years (newest year 0, capped at 8),
  // 9 for unknown. Always below one "type already used" step (100) of the score.
  function quickRecencyTier(record) {
    const rank = C.recencyRank(C.sourceYear(record));
    return rank >= 1000000 ? 9 : Math.max(0, Math.min(rank, 8));
  }
  function quickCountsText(unit, product) {
    return Quick.BUCKETS.filter(bucket => bucket < 4 || product.count >= 20)
      .map(bucket => `${product.stepLabels?.[bucket] || bucket}단계 ${unit.counts[bucket]}`).join(" · ");
  }
  // Selection inputs come from the cached pool records of the chosen units only (no catalog scan).
  function balancedQuickSelection(units, preset) {
    const pools = { 1: [], 2: [], 3: [], 4: [] }, scopeByUid = new Map(), gradeByUid = new Map();
    for (const unit of units) for (const bucket of Quick.BUCKETS)
      for (const record of unit.buckets[bucket]) {
        pools[bucket].push(record);
        scopeByUid.set(record.questionUid, unit.key);
        gradeByUid.set(record.questionUid, unit.grade);
      }
    const typeByUid = new Map(), subunitByUid = new Map();
    const metaByUid = V.quickPoolCache.metaByUid;
    for (const uid of scopeByUid.keys()) {
      const row = metaByUid?.get(uid);
      const group = AssessmentRecipes?.representativeGroup?.(row);
      if (group?.concept || group?.type) typeByUid.set(uid, group.concept || group.type);
      const grade = gradeByUid.get(uid);
      if (/^중[123]$/.test(grade)) {
        const entry = V.quickPoolCache.index?.byUid?.get(uid);
        const parent = entry?.rpmParentStatus === "EXACT" && entry.rpmParent?.grade === grade
          ? entry.rpmParent : null;
        const legacy = entry?.rpmParentStatus === "OUT_OF_SCOPE" && entry.originalCurriculum === "2015";
        // The empty key is the unresolved group, not a guessed legacy L2. Keep its records
        // available in the unit pool while balancing exact current subunits independently.
        subunitByUid.set(uid, String(parent?.L2 || "").trim() ? String(parent.parentKey || "").trim()
          : legacy && row?.subUnitKey ? `legacy:2015:${row.subUnitKey}` : "");
      } else if (row?.subUnitKey) subunitByUid.set(uid, row.subUnitKey);
    }
    const scopeUse = new Map(), subunitUse = new Map(), typeUse = new Map(),
      sourceUse = new Map(), selected = [];
    for (const [bucket, count] of preset) {
      const candidates = recencyShuffle([...new Map(pools[bucket]
        .map(record => [record.questionUid, record])).values()]);
      for (let i = 0; i < count; i++) {
        let best = 0, bestScore = Infinity;
        for (let j = 0; j < candidates.length; j++) {
          const record = candidates[j], type = typeByUid.get(record.questionUid);
          const scope = scopeByUid.get(record.questionUid);
          const subunit = subunitByUid.get(record.questionUid) ?? record.L2;
          const score = (scopeUse.get(scope) || 0) * 1000000 +
            (subunitUse.get(subunit) || 0) * 10000 +
            (type ? (typeUse.get(type) || 0) : 0) * 100 +
            quickRecencyTier(record) * 10 +
            Math.min(sourceUse.get(record.sourceFile) || 0, 9);
          if (score < bestScore) { best = j; bestScore = score; }
        }
        const [record] = candidates.splice(best, 1);
        selected.push(record);
        const scope = scopeByUid.get(record.questionUid);
        scopeUse.set(scope, (scopeUse.get(scope) || 0) + 1);
        const subunit = subunitByUid.get(record.questionUid) ?? record.L2;
        subunitUse.set(subunit, (subunitUse.get(subunit) || 0) + 1);
        const type = typeByUid.get(record.questionUid);
        if (type) typeUse.set(type, (typeUse.get(type) || 0) + 1);
        sourceUse.set(record.sourceFile, (sourceUse.get(record.sourceFile) || 0) + 1);
      }
    }
    return selected;
  }
  // 진단평가 selection (Quick.PRODUCTS.diagnostic): fills each step of the preset from the chosen units. Every unit gets at least
  // min(floor(count / units), 3) questions, the rest of the seats follow the pool sizes; inside a step the units take turns (the
  // unit that is furthest below its share first) so the unit x step cells are filled as widely as possible. A repeated problem type
  // only costs a penalty (a question without a type is never penalised and stays in the pool). Returns the picks and, per cell
  // (unit x step), the questions that were not picked, in the order they would be picked next (used to replace an empty one).
  // 부족 단계 보충 (2026-11-20): original questions come first. Only a step whose originals are fewer than the preset asks gets
  // the missing number from the unit's 유형/유사 reserve (unit.fillBuckets), picked after the originals; a reserve question whose
  // original/similar family (options.familyOf) is already on the paper is skipped unless nothing else is left.
  // options.reserved: uids that must not be picked (the other form of an A·B pair).
  const SELECTION_TYPE = record => C.metaFacetsOf(record)?.pt || "";
  function diagnosticSelection(units, steps, count, options = {}) {
    const familyOf = options.familyOf || (() => "");
    const reserved = options.reserved || new Set();
    const wanted = steps.filter(([, need]) => need > 0).sort((a, b) => a[0] - b[0]);
    const n = units.length, cells = new Map(), fillCells = new Map(), cellOf = new Map(), avail = units.map(() => 0);
    const keyOf = (u, step) => `${u}|${step}`;
    const shuffled = list => recencyShuffle([...new Map((list || []).filter(record => !reserved.has(record.questionUid))
      .map(record => [record.questionUid, record])).values()]);
    units.forEach((unit, u) => {
      for (const [step] of wanted) {
        const rows = shuffled(unit.buckets[step]);
        cells.set(keyOf(u, step), rows);
        rows.forEach(record => cellOf.set(record.questionUid, { u, step, fill: false }));
        avail[u] += rows.length;
        const extra = shuffled(unit.fillBuckets?.[step]);
        fillCells.set(keyOf(u, step), extra);
        extra.forEach(record => cellOf.set(record.questionUid, { u, step, fill: true }));
      }
    });
    // A step takes as many originals as it has (up to the preset); only the missing rest comes from the reserve.
    const stepList = [], fillNeed = new Map();
    for (const [step, need] of wanted) {
      const have = units.reduce((sum, _, u) => sum + cells.get(keyOf(u, step)).length, 0);
      const own = Math.min(need, have);
      stepList.push([step, own]);
      if (need > own) fillNeed.set(step, need - own);
    }
    const ownCount = stepList.reduce((sum, [, own]) => sum + own, 0);
    // Units with no usable question (a table-of-contents unit nobody asked about) do not take a share.
    const live = avail.filter(have => have > 0).length || 1;
    const minimum = Math.min(Math.floor(ownCount / live), 3);
    const target = avail.map(have => Math.min(minimum, have));
    const room = avail.map((have, u) => have - target[u]);
    let rest = ownCount - target.reduce((sum, value) => sum + value, 0);
    while (rest > 0) {
      const open = room.map((value, u) => (value > 0 ? u : -1)).filter(u => u >= 0);
      if (!open.length) break;
      const weight = open.reduce((sum, u) => sum + avail[u], 0);
      const shares = open.map(u => ({ u, exact: rest * avail[u] / weight }));
      let given = 0;
      for (const share of shares) {
        const whole = Math.min(Math.floor(share.exact), room[share.u]);
        target[share.u] += whole; room[share.u] -= whole; given += whole; share.frac = share.exact - Math.floor(share.exact);
      }
      rest -= given;
      shares.sort((a, b) => b.frac - a.frac || a.u - b.u);
      for (const share of shares) if (rest > 0 && room[share.u] > 0) { target[share.u]++; room[share.u]--; rest--; }
    }
    const lexLess = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
    const typeOf = SELECTION_TYPE;
    const assigned = units.map(() => 0), picked = new Map(), picks = [], typeUse = new Map(), sourceUse = new Map();
    const bestRow = (rows, allowed = () => true) => {
      let best = -1, bestScore = Infinity;
      rows.forEach((record, i) => {
        if (!allowed(record)) return;
        const type = typeOf(record);
        const score = (type ? (typeUse.get(type) || 0) : 0) * 100 + quickRecencyTier(record) * 10 + Math.min(sourceUse.get(record.sourceFile) || 0, 9);
        if (score < bestScore) { best = i; bestScore = score; }
      });
      return best;
    };
    const note = record => {
      const type = typeOf(record);
      if (type) typeUse.set(type, (typeUse.get(type) || 0) + 1);
      sourceUse.set(record.sourceFile, (sourceUse.get(record.sourceFile) || 0) + 1);
    };
    const take = (u, step) => {
      const rows = cells.get(keyOf(u, step));
      const [record] = rows.splice(bestRow(rows), 1);
      note(record);
      assigned[u]++; picks.push(record);
      const list = picked.get(keyOf(u, step)) || picked.set(keyOf(u, step), []).get(keyOf(u, step));
      list.push(record);
    };
    // options.pair (an A·B pair is made): a cell first gives at most half of its questions, so B finds other ones in the same cell;
    // a step that needs more than that still takes them (the overlap is then counted when B is made).
    const startLength = new Map([...cells].map(([key, rows]) => [key, rows.length]));
    for (const [step, need] of stepList) {
      const inStep = units.map(() => 0);
      for (let k = 0; k < need; k++) {
        let bestUnit = -1, bestKey = null;
        for (const roomy of options.pair ? [true, false] : [false]) {
          for (let u = 0; u < n; u++) {
            if (!cells.get(keyOf(u, step)).length) continue;
            if (roomy && inStep[u] >= Math.floor(startLength.get(keyOf(u, step)) / 2)) continue;
            const key = [assigned[u] - target[u], inStep[u], assigned[u], u];
            if (!bestKey || lexLess(key, bestKey)) { bestKey = key; bestUnit = u; }
          }
          if (bestUnit >= 0) break;
        }
        if (bestUnit < 0) break;
        take(bestUnit, step); inStep[bestUnit]++;
      }
    }
    // A unit below its minimum takes one seat of a unit above its own minimum in a step both can serve.
    const floorOf = u => Math.min(minimum, avail[u]);
    for (let guard = 0; guard < ownCount * n; guard++) {
      const needy = units.findIndex((_, u) => assigned[u] < floorOf(u));
      if (needy < 0) break;
      let fixed = false;
      for (const [step] of stepList) {
        if (!cells.get(keyOf(needy, step)).length) continue;
        let donor = -1;
        for (let v = 0; v < n; v++) if (v !== needy && assigned[v] > floorOf(v) && (picked.get(keyOf(v, step)) || []).length &&
          (donor < 0 || assigned[v] > assigned[donor])) donor = v;
        if (donor < 0) continue;
        const list = picked.get(keyOf(donor, step)), back = list.pop();
        picks.splice(picks.indexOf(back), 1); assigned[donor]--;
        cells.get(keyOf(donor, step)).push(back);
        take(needy, step); fixed = true; break;
      }
      if (!fixed) break;
    }
    // The missing rest of a short step: 유형/유사 questions of the same units, the unit with the fewest questions first.
    const families = new Set(picks.map(familyOf).filter(Boolean));
    const fillStart = new Map([...fillCells].map(([key, rows]) => [key, rows.length]));
    for (const [step, need] of fillNeed) {
      const inStep = units.map(() => 0);
      for (let k = 0; k < need; k++) {
        let done = false;
        for (const strict of [true, false]) {
          const allowed = record => !strict || !familyOf(record) || !families.has(familyOf(record));
          let bestUnit = -1, bestKey = null;
          // pair: B takes as many questions of the cell as A; with this fill the cell (originals + fills) must still fit B's fills
          for (const roomy of options.pair ? [true, false] : [false]) {
            for (let u = 0; u < n; u++) {
              if (bestRow(fillCells.get(keyOf(u, step)), allowed) < 0) continue;
              const mine = (picked.get(keyOf(u, step)) || []).length;
              if (roomy && mine + 2 * (inStep[u] + 1) > fillStart.get(keyOf(u, step))) continue;
              const key = [inStep[u], assigned[u], u];
              if (!bestKey || lexLess(key, bestKey)) { bestKey = key; bestUnit = u; }
            }
            if (bestUnit >= 0) break;
          }
          if (bestUnit < 0) continue;
          const rows = fillCells.get(keyOf(bestUnit, step));
          const [record] = rows.splice(bestRow(rows, allowed), 1);
          note(record);
          assigned[bestUnit]++; inStep[bestUnit]++; picks.push(record);
          if (familyOf(record)) families.add(familyOf(record));
          done = true; break;
        }
        if (!done) break;
      }
    }
    // The questions that were not picked of the same step (own unit first, originals before the reserve) replace an empty question.
    const sparesFor = record => {
      const at = cellOf.get(record.questionUid);
      if (!at) return [];
      const order = [at.u, ...units.map((_, u) => u).filter(u => u !== at.u)];
      return [...order.flatMap(u => cells.get(keyOf(u, at.step))), ...order.flatMap(u => fillCells.get(keyOf(u, at.step)))]
        .filter(candidate => !reserved.has(candidate.questionUid));
    };
    // unit x step cells of the picks (originals and reserve apart), for the second form of an A·B pair.
    const cellPicks = (list = picks) => {
      const map = new Map();
      for (const record of list) {
        const at = cellOf.get(record.questionUid);
        if (!at) continue;
        const key = keyOf(at.u, at.step), cell = map.get(key) || map.set(key, { u: at.u, step: at.step, orig: [], fill: [] }).get(key);
        (at.fill ? cell.fill : cell.orig).push(record);
      }
      return map;
    };
    return { selected: picks, sparesFor, unitMinimum: minimum, targets: target, cellPicks,
      fills: [...fillNeed].map(([step, missing]) => ({ bucket: step, count: missing })) };
  }
  // The second form (B) of an A·B pair: the same unit x step cells with the same number of questions as A, none of A's questions.
  // A cell takes unused originals first; a cell that has none left (a short step: A took them all) takes unused 유형/유사 questions
  // of the same cell instead; only a cell with neither takes A's own question again, and that is counted as overlap.
  // options.finalA: the records A really holds (an empty question of the plan may have been replaced); options.knownBlank: uids found empty
  // (no answer or no solution) while A was made - they are never candidates for B.
  function diagnosticMirror(units, plan, options = {}) {
    const familyOf = options.familyOf || (() => "");
    const typeOf = SELECTION_TYPE;
    const blank = options.knownBlank || new Set();
    const finalA = options.finalA || plan.selected;
    const first = new Set(finalA.map(record => record.questionUid));
    const cellsA = [...plan.cellPicks(finalA).values()].sort((a, b) => a.step - b.step || a.u - b.u);
    const chosen = new Set(), picks = [], typeUse = new Map(), sourceUse = new Map();
    const unique = list => recencyShuffle([...new Map((list || []).map(record => [record.questionUid, record])).values()]);
    const choose = (rows, count, allowed = () => true) => {
      const pool = rows.filter(record => !chosen.has(record.questionUid) && allowed(record)), got = [];
      while (got.length < count && pool.length) {
        let best = 0, bestScore = Infinity;
        pool.forEach((record, i) => {
          const type = typeOf(record);
          const score = (type ? (typeUse.get(type) || 0) : 0) * 100 + quickRecencyTier(record) * 10 + Math.min(sourceUse.get(record.sourceFile) || 0, 9);
          if (score < bestScore) { best = i; bestScore = score; }
        });
        const [record] = pool.splice(best, 1);
        chosen.add(record.questionUid); got.push(record);
        const type = typeOf(record);
        if (type) typeUse.set(type, (typeUse.get(type) || 0) + 1);
        sourceUse.set(record.sourceFile, (sourceUse.get(record.sourceFile) || 0) + 1);
      }
      return got;
    };
    const unused = rows => unique(rows).filter(record => !first.has(record.questionUid) && !blank.has(record.questionUid));
    const lack = new Map();
    const keyOf = cell => `${cell.u}|${cell.step}`;
    for (const cell of cellsA) {
      const need = cell.orig.length + cell.fill.length, got = choose(unused(units[cell.u].buckets[cell.step]), need);
      picks.push(...got);
      lack.set(keyOf(cell), need - got.length);
    }
    const families = new Set(picks.map(familyOf).filter(Boolean));
    const strictly = record => !familyOf(record) || !families.has(familyOf(record));
    for (const cell of cellsA) {
      const missing = lack.get(keyOf(cell));
      if (!missing) continue;
      const rows = unused(units[cell.u].fillBuckets?.[cell.step]);
      let got = choose(rows, missing, strictly);
      if (got.length < missing) got = got.concat(choose(rows, missing - got.length));
      for (const record of got) if (familyOf(record)) families.add(familyOf(record));
      picks.push(...got);
      lack.set(keyOf(cell), missing - got.length);
    }
    for (const cell of cellsA) {
      const missing = lack.get(keyOf(cell));
      if (missing) picks.push(...choose([...cell.orig, ...cell.fill], missing));
    }
    const sparesFor = record => {
      const step = record.difficultyBucket >= 4 ? 4 : record.difficultyBucket;
      const spare = rows => unused(rows).filter(candidate => !chosen.has(candidate.questionUid));
      return [...spare(units.flatMap(unit => unit.buckets[step] || [])), ...spare(units.flatMap(unit => unit.fillBuckets?.[step] || []))];
    };
    const overlap = picks.filter(record => first.has(record.questionUid)).length;
    return { selected: picks, sparesFor, overlap, exclude: first };
  }
  // A restored question without an answer or without a solution (text or image) cannot go on a 진단평가 paper.
  const isBlankQuestion = question => !question || !String(question.answer ?? "").trim() ||
    !(String(question.solution ?? "").trim() || String(question.solutionImage ?? "").trim());
  // Replaces each empty restored question by the next not-picked question of the same step (its own unit first), restoring one
  // candidate at a time. The set of steps never changes. Returns the final order (by step, then unit) and how many were replaced.
  // Each restore is a source request, so the tries are capped: a few per empty question and a small total for the whole paper.
  // Past a cap the paper is "not enough questions" (same message), instead of the student waiting for hundreds of requests.
  const BLANK_TRIES_PER_QUESTION = 8, BLANK_TRIES_TOTAL = 40;
  // options.knownBlank: a Set shared by the papers of one A·B pair - every question found empty is added, and is never tried again.
  // options.lastResort(record, taken): already restored { record, question } pairs of the same step (the other form's questions) that
  // may stand in when no other candidate is left; the B form uses A's, so a short pool costs an overlap, not the whole paper.
  async function replaceBlankQuestions(units, selected, questions, plan, options = {}) {
    const records = selected.slice(), restored = questions.slice();
    const blank = options.knownBlank || new Set();
    const taken = new Set(records.map(record => record.questionUid)), rejected = new Set();
    let replaced = 0, totalTries = 0;
    for (let i = 0; i < records.length; i++) {
      if (!isBlankQuestion(restored[i])) continue;
      blank.add(records[i].questionUid);
      const spares = plan.sparesFor(records[i]);
      let done = false, tries = 0;
      for (const candidate of spares) {
        if (taken.has(candidate.questionUid) || rejected.has(candidate.questionUid) || blank.has(candidate.questionUid)) continue;
        if (tries >= BLANK_TRIES_PER_QUESTION || totalTries >= BLANK_TRIES_TOTAL) break;
        tries++; totalTries++;
        let question;
        try { [question] = await Source.restore([candidate], state.catalog); } catch (error) { rejected.add(candidate.questionUid); continue; }
        if (isBlankQuestion(question)) { rejected.add(candidate.questionUid); blank.add(candidate.questionUid); continue; }
        taken.add(candidate.questionUid);
        records[i] = candidate; restored[i] = question; replaced++; done = true;
        break;
      }
      if (!done && options.lastResort) {
        const pair = options.lastResort(records[i], taken).find((item) => !taken.has(item.record.questionUid) && !isBlankQuestion(item.question));
        if (pair) { taken.add(pair.record.questionUid); records[i] = pair.record; restored[i] = pair.question; replaced++; done = true; }
      }
      if (!done) {
        const error = new Error("정답·해설이 있는 문항이 모자라 시험지를 만들 수 없습니다. 학기를 1·2학기로 바꾸거나 난이도를 바꿔 보세요.");
        error.code = "BLANK_SHORT";
        throw error;
      }
    }
    const byUid = new Map(records.map((record, i) => [record.questionUid, restored[i]]));
    const ordered = Quick.orderByStep(units, records);
    return { selected: ordered, questions: ordered.map(record => byUid.get(record.questionUid)), replaced };
  }
  function quickUnitsLabel(units, subjectLabel, all) {
    if (all) return `${subjectLabel} 전체`;
    const names = units.map(unit => unit.label);
    return names.length > 3 ? `${names.slice(0, 3).join(" · ")} 외 ${names.length - 3}개` : names.join(" · ");
  }
  // unitKeys: an array of unit keys, or "all" (every unit of the chosen subject, 종합평가).
  async function openQuickAssessment(unitKeys) {
    const product = quickProduct();
    if (!product || quickState.busy) return;
    const pools = quickPools();
    if (!pools || !quickState.grade || !quickState.subject) return;
    const preset = quickPreset();
    const scopes = quickScopes(pools);
    if (!scopes) return;
    const everything = unitKeys === "all";
    const units = everything ? scopes.roots : Quick.selectNodes(scopes, unitKeys);
    const subjectLabel = Unified.subjectByValue(quickState.grade, quickState.subject)?.label || "";
    const diagnostic = state.view === "diagnostic";
    const label = quickUnitsLabel(units, diagnostic ? quickDiagnosticName(subjectLabel) : subjectLabel, everything);
    if (!units.length || (!product.combine && units.length !== 1)) return;
    const verdict = Quick.evaluate(units, product, preset);
    if (!verdict.ok) {
      status(`${label}: ${Quick.shortageText(verdict.shortages)}`, true);
      return;
    }
    const presetPairs = product.presets[preset];
    const twoForms = diagnostic && quickState.twoForms;
    const familyOf = diagnostic ? C.familyResolver(state.catalog.records) : () => "";
    // Every question found empty (no answer / no solution) while A or B is made; shared, so B never tries what A already found empty.
    const knownBlank = new Set();
    let plan = null;
    const pick = () => diagnostic ? (plan = diagnosticSelection(units, presetPairs, product.count, { familyOf, pair: twoForms })).selected
      : product.combine || state.view === "unit-test"
      ? balancedQuickSelection(units, presetPairs)
      : presetPairs.flatMap(([bucket, count]) => recencyShuffle([...new Map(
        units.flatMap(unit => unit.buckets[bucket]).map(record => [record.questionUid, record])).values()])
        .slice(0, count));
    // Every quick product prints from the lowest difficulty step up (unit order inside a step); the chosen set does not change.
    let selected = Quick.orderByStep(units, pick());
    const complete = list => new Set(list.map(record => record.questionUid)).size === product.count;
    if (selected.length < product.count) {
      status(`${label}: 문항이 모자라 시험지를 열 수 없습니다. 학기를 1·2학기로 바꾸거나 난이도를 바꿔 보세요.`, true);
      return;
    }
    if (!complete(selected)) {
      status("같은 문항이 중복되어 시험지를 열 수 없습니다.", true);
      return;
    }
    // The pools are cached per catalog load; every chosen question is checked against the
    // current usage and difficulty conditions before it is printed.
    if (selected.some(record => !Quick.stillUsable(record, product))) {
      V.quickPoolCache = { index: null, meta: null, metaByUid: null, pools: null };
      status("문항 상태가 바뀌어 목록을 다시 확인합니다. 다시 선택하세요.", true);
      render();
      return;
    }
    // Every window is opened here, before the first await, while the click is still a user gesture.
    const popup = window.open("about:blank", "_blank");
    if (!popup) { status("새 창을 열 수 없습니다. 팝업 설정을 확인하세요.", true); return; }
    popup.document.body.textContent = "시험지를 준비하고 있습니다.";
    const popupB = twoForms ? window.open("about:blank", "_blank") : null;
    if (popupB) popupB.document.body.textContent = "시험지를 준비하고 있습니다.";
    quickState.busy = true;
    quickState.formB = null;
    quickState.report = null;
    status("선택한 문항의 원본을 확인하고 있습니다.");
    render();
    const makeForm = async (list, formPlan, suffix, blankOptions = {}) => {
      let questions = await Source.restore(list, state.catalog), replaced = 0, chosen = list;
      if (diagnostic) ({ selected: chosen, questions, replaced } = await replaceBlankQuestions(units, list, questions, formPlan, { knownBlank, ...blankOptions }));
      const questionUids = chosen.map(record => record.questionUid);
      const title = `${product.title} · ${label}${suffix ? ` · ${suffix}` : ""}`;
      const meta = {
        title, customTitle: title, identityTitle: title, count: product.count,
        grade: quickState.grade, subject: subjectLabel, questionUids,
        scopeKeys: units.map(unit => unit.key),
        printHeaderOptions: { title, subtitle: "", metaRight: "AP수학",
          showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
        includeQr: false, qpp: 4, sourceType: "mixed", indexVersion: state.catalog.indexVersion,
      };
      // 진단평가: 단원별 기출과 같은 단계 구역 제목('1단계' … )을 단계순 문항 위에 단다(core 함수 그대로, 문항의 실제 단계).
      if (diagnostic && window.UnitPastExamsCore?.buildStepSections) meta.sections = window.UnitPastExamsCore.buildStepSections(chosen);
      const envelope = await O.publishOutputEnvelope({
        sourceKind: "archive2-compose", sourceId: crypto.randomUUID(), mode: "exam",
        questionCount: product.count, questionUids, meta, questions,
      });
      return { url: O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, { studio: true }), chosen, questions, replaced };
    };
    // "4~5단계 2문항은 유형 1문항 · 유사 1문항으로 채웠습니다": what the reserve questions of the paper really are.
    // Each paper tells its own numbers ("A형은 ... B형은 ...").
    const fillSummary = (chosen, who = "") => {
      const kinds = { types: 0, similar: 0 };
      for (const record of chosen) { const kind = String(record.sourceFile || "").split("/")[0]; if (kind in kinds) kinds[kind]++; }
      const parts = [kinds.types ? `유형 ${kinds.types}문항` : "", kinds.similar ? `유사 ${kinds.similar}문항` : ""].filter(Boolean);
      return parts.length ? ` ${who}원본 기출이 모자란 단계는 ${parts.join(" · ")}으로 채웠습니다.` : "";
    };
    // B: the same unit x step cells as A (A's final paper) and none of A's questions; empty questions are never candidates. A cell with
    // no other question takes one of A's again (counted). A failure here leaves A's window open and says so.
    const makeFormB = async (formA) => {
      const planB = diagnosticMirror(units, plan, { familyOf, finalA: formA.chosen, knownBlank });
      const listB = Quick.orderByStep(units, planB.selected);
      if (listB.length < product.count || !complete(listB)) {
        const error = new Error("문항이 모자랍니다.");
        error.code = "B_SHORT";
        throw error;
      }
      if (listB.some(record => !Quick.stillUsable(record, product))) {
        const error = new Error("문항 상태가 바뀌었습니다.");
        error.code = "B_CHANGED";
        throw error;
      }
      const stepOf = record => Math.min(record.difficultyBucket, 4);
      const pairs = formA.chosen.map((record, i) => ({ record, question: formA.questions[i] }));
      const formB = await makeForm(listB, planB, "B형", { lastResort: record => pairs.filter(pair => stepOf(pair.record) === stepOf(record)) });
      return { ...formB, shared: formB.chosen.filter(record => planB.exclude.has(record.questionUid) || formA.chosen.some(own => own.questionUid === record.questionUid)).length };
    };
    try {
      const formA = await makeForm(selected, plan, twoForms ? "A형" : "");
      popup.location.replace(formA.url.href);
      if (diagnostic) quickState.report = { title: label, a: formA.chosen.map(record => record.questionUid), b: null };
      let message = `${label} · ${formA.chosen.length}문항 시험지${twoForms ? " A형" : ""}를 열었습니다.${fillSummary(formA.chosen)}`;
      const replacedBlank = formA.replaced;
      let replacedAll = replacedBlank;
      let failedB = "";
      if (twoForms) {
        try {
          const formB = await makeFormB(formA);
          replacedAll += formB.replaced;
          quickState.report.b = formB.chosen.map(record => record.questionUid);
          if (popupB) popupB.location.replace(formB.url.href);
          else quickState.formB = { url: formB.url.href, title: `${label} B형` };
          message = `${label} · A·B형 두 벌(각 ${formA.chosen.length}문항)을 ${popupB ? "열었습니다" : "만들었습니다. B형은 아래 \"B형 열기\" 단추로 여세요"}.`
            + `${fillSummary(formA.chosen, "A형은 ")}${fillSummary(formB.chosen, "B형은 ")}`
            + (formB.shared ? ` A·B형이 같은 문항 ${formB.shared}개를 함께 씁니다(해당 단원·단계에 다른 문항이 모자람).` : " A·B형에 겹치는 문항은 없습니다.");
        } catch (error) {
          // B alone failed: A stays open. Only the B window is closed.
          popupB?.close();
          quickState.formB = null;
          const reason = error.code === "BLANK_SHORT" || error.code === "B_SHORT" ? "정답·해설이 있는 문항이 모자랍니다" : error.code === "B_CHANGED" ? "문항 상태가 바뀌었습니다" : "원본 문항을 불러오지 못했습니다";
          failedB = `B형은 만들지 못했습니다(${reason}). A형은 그대로 열려 있습니다. A·B형 선택을 끄면 한 벌로 다시 만들 수 있습니다.`;
          message = `${label} · ${formA.chosen.length}문항 시험지 A형을 열었습니다.${fillSummary(formA.chosen)}`;
          console.warn("[archive2] B paper failed:", error);
        }
      }
      status(`${message}${replacedAll ? ` (정답·해설이 없는 ${replacedAll}문항은 같은 단계의 다른 문항으로 바꿨습니다.)` : ""}${failedB ? " " + failedB : ""}`, Boolean(failedB));
    } catch (error) {
      popup.close();
      popupB?.close();
      status(error.message || "시험지를 준비하지 못했습니다.", true, error);
    } finally {
      quickState.busy = false;
      if (isQuickAssessmentView()) render();
    }
  }

  // 대단원 한 줄(체크 + 문항 수 + 중단원 펼침 단추)과, 펼쳤을 때 그 아래 중단원(소단원 묶음) 줄들.
  // 대단원을 체크하면 중단원 줄은 "포함됨"이고, 중단원은 체크 해제한 대단원 아래에서만 따로 고른다.
  // 0문항 중단원은 흐리게 보이고 고를 수 없다. "중단원 미지정"/"기타" 줄은 문항이 있을 때만 나온다.
  function scopeOpenState(scope) {
    const kids = scope.children || [];
    if (!kids.length) return false;
    const explicit = state.scopeUnitOpen[scope.key];
    return explicit !== undefined ? explicit : kids.some(child => state.scopes.includes(child.key));
  }
  function scopeUnitMarkup(s) {
    const kids = s.children || [];
    const parentOn = scopeIsSelected(s);
    const pickedKids = kids.filter(child => state.scopes.includes(child.key));
    const open = scopeOpenState(s);
    const disabled = state.sealed ? "disabled" : "";
    const noun = /^중[123]$/.test(state.filters.grade || "") ? "중단원" : "소단원";
    const hint = s.unclassified ? ' <span class="scope-hint">단원 정보가 아직 없는 문항 · 선택하면 함께 출제</span>'
      : kids.length ? ` <span class="scope-hint" data-scope-sub-hint>${parentOn ? `${noun} ${kids.length}개 모두 포함`
        : pickedKids.length ? `${noun} ${pickedKids.length}개 선택` : `${noun} ${kids.length}개`}</span>` : "";
    const partial = !parentOn && pickedKids.length ? " data-scope-partial" : "";
    const toggle = kids.length
      ? button("scope-expand", "", `class="scope-expand" data-scope-key="${esc(s.key)}" aria-expanded="${open}" aria-label="${esc(s.label)} ${noun} ${open ? "접기" : "펼치기"}" title="${noun} ${open ? "접기" : "펼치기"}"`)
      : "";
    const head = `<div class="scope-item${kids.length ? " has-subs" : ""}"><label class="check"><input type="checkbox" data-scope="${esc(s.key)}"${partial} ${parentOn ? "checked" : ""} ${disabled}><span class="scope-name">${esc(s.label)}${hint}</span></label><small>${s.count}문항</small>${toggle}</div>`;
    if (!open) return kids.length ? `<div class="scope-unit">${head}</div>` : head;
    const rows = kids.filter(child => child.count > 0 || state.scopes.includes(child.key) ||
      !["none", "other"].includes(child.childKind)).map(child => {
      const on = parentOn || state.scopes.includes(child.key);
      const zero = child.count === 0 && !state.scopes.includes(child.key);
      const cls = `scope-item scope-sub${parentOn ? " is-implied" : ""}${zero ? " is-zero" : ""}`;
      // 대단원이 체크된 채로도 중단원 하나를 풀 수 있다(나머지 중단원이 그대로 남는다).
      const off = state.sealed || zero ? "disabled" : "";
      return `<div class="${cls}" data-scope-sub="${esc(child.key)}"><label class="check"><input type="checkbox" data-scope="${esc(child.key)}" ${on ? "checked" : ""} ${off}><span class="scope-name">${esc(child.label)}${parentOn ? ' <span class="scope-hint">대단원에 포함됨</span>' : ""}</span></label><small>${child.count}문항</small></div>`;
    }).join("");
    return `<div class="scope-unit is-open">${head}<div class="scope-subs" data-scope-subs="${esc(s.key)}">${rows}</div></div>`;
  }
  function renderScopes() {
    if (state.uidRoute) return renderUidRoute();
    if (
      !unifiedIndex() &&
      C.isHighSemanticSubjectGrade?.(state.filters.grade) &&
      !state.filters.semanticSubject
    )
      return `<div class="resultbar"><h2>단원</h2></div><p class="muted">과목을 먼저 선택해 주세요. 선택한 과목의 단원이 여기에 나타납니다.</p>`;
    const scopes = scopeOptions(),
      groups = unique(scopes.map((s) => s.L1)),
      basic = scopes;
    // Range start/end only list real units: "단원 미분류" is selectable by checkbox but is never
    // the default end of a range.
    const rangeOptions = scopes.flatMap((s, i) => s.basicScope && !s.unclassified
      ? [{ value: i, label: s.fullLabel || `${s.L1} · ${s.label}` }] : []);
    // 과목 묶음은 접을 수 있다. 직접 접고 펼친 것을 먼저 따르고, 아니면 넓은 화면(PC)은 모두 펼치며 좁은 화면은
    // 고른 단원이 있는 묶음·현재 과목 묶음·첫 묶음만 펼친다(휴대폰에서 목록이 끝없이 길어지지 않게).
    const wideScreen = Boolean(window.matchMedia?.("(min-width: 1100px)")?.matches);
    const groupMarkup = (rows, detail) => {
      const names = unique(rows.map(s => s.L1)), currentSubject = composeSubjectLabel();
      return `<div class="scope-list">${names.map(g => {
        const members = rows.filter(s => s.L1 === g);
        const explicit = state.scopeGroupOpen[g];
        const open = explicit !== undefined ? explicit
          : wideScreen || names.length === 1 || g === names[0] || g === currentSubject || members.some(scopeIsSelected);
        return `<details class="scope-group" data-scope-group="${esc(g)}"${open ? " open" : ""}><summary class="group-head"><h3>${esc(g)}</h3>${button("scope-group", "모두", `data-group-index="${groups.indexOf(g)}" data-scope-kind="${detail ? "detail" : "basic"}" class="small"`)}</summary>${members.map(scopeUnitMarkup).join("")}</details>`;
      }).join("")}</div>`;
    };
    const unifiedNotice = unifiedIndex()
      ? `<p class="muted">단원을 고르세요. 숫자는 지금 낼 수 있는 문항 수입니다.${scopes.some(scope => scope.children?.length) ? " 줄 끝의 화살표를 누르면 중단원을 따로 고를 수 있습니다." : ""}</p>${state.scopeNotice ? `<div class="callout" role="status">${esc(state.scopeNotice)}</div>` : ""}${!scopes.length ? '<p class="muted">현재 조건에 맞는 단원이 없습니다. 세부 조건(학교·시험 시기·연도·난이도)을 넓혀 보세요.</p>' : ""}`
      : "";
    return `<div class="resultbar"><h2>단원</h2><div class="actions">${button("scope-all", "전체 선택", 'class="small"')}${button("scope-clear", "초기화", 'class="small"')}</div></div>
      ${unifiedNotice || '<p class="muted">학년의 1·2학기 전체 단원입니다. 숫자는 지금 출제할 수 있는 문항 수이며, 같은 문항은 한 번만 셉니다. 난이도를 고르지 않으면 난이도가 정해지지 않은 문항까지 포함해 전체에서 고릅니다.</p>'}
      ${groupMarkup(basic, false)}
      ${rangeOptions.length ? `<details class="range-more"><summary>연속 범위로 고르기</summary><div class="range-controls"><label>범위 시작<select id="scope-start">${options(
        rangeOptions,
        rangeOptions[0]?.value ?? 0,
        null,
      )}</select></label><label>범위 끝<select id="scope-end">${options(
        rangeOptions,
        rangeOptions.at(-1)?.value ?? 0,
        null,
      )}</select></label>${button("scope-range", "연속 범위 선택")}</div></details>` : ""}`;
  }
  function bucketButtons(current, row = "") {
    return `<div class="bucket-set" role="group" aria-label="난이도 선택">${button("bucket-all", "전체", `data-row="${esc(row)}" aria-pressed="${!current.length}" ${state.sealed ? "disabled" : ""}`)}${[1, 2, 3, 4, 5].map((n) => button("bucket", n, `data-bucket="${n}" data-row="${esc(row)}" aria-pressed="${current.includes(n)}" ${state.sealed ? "disabled" : ""}`)).join("")}</div>`;
  }
  function composeAdvancedChoices(selectionFilters) {
    const baseFilters = { ...selectionFilters, L3: "", L4: "" };
    const excluded = C.composeExclusions(context()).union;
    const eligible = pool().filter(r =>
      workspaceMatches(r, baseFilters) && composeMetaMatches(r) && workspaceEligibility(r).ok && !excluded.has(r.questionUid));
    const labels = window.ARCHIVE_META_FOUNDATION_LABELS || { problemTypes: {}, templates: {} };
    const concepts = new Map(), types = new Map();
    for (const record of eligible) {
      if (!C.advancedEligible(record, state)) continue;
      const authority = C.advancedAuthority(record);
      const l3 = C.advancedFilterValue(record, 3), l4 = C.advancedFilterValue(record, 4);
      const l3Label = authority === "mf" ? labels.problemTypes[record.problemTypeKey] : record.L3;
      const template = authority === "mf" ? labels.templates[record.templateKey] : null;
      const l4Label = authority === "mf" && template?.parentProblemTypeKey === record.problemTypeKey
        ? template.label : authority === "rpm" ? record.L4 : "";
      if (l3 && l3Label) concepts.set(l3, { value: l3, label: l3Label, authority });
      if (l4 && l4Label && (!state.filters.L3 || l3 === state.filters.L3))
        types.set(l4, { value: l4, label: l4Label, authority });
    }
    const sort = rows => [...rows.values()].sort((a, b) => a.label.localeCompare(b.label, "ko"));
    return { concepts: sort(concepts), types: sort(types) };
  }
  // Recorded concept/type/template facets (S14) over the questions of the selected units, or of
  // every listed unit while none is selected, with per-option status mixes (승인 / 검토 대기).
  // Faceted: each list ignores its own selection and honours the other selections.
  function composeMetaFacets() {
    const scopes = scopeOptions();
    const picked = pickedScopeNodes(scopes);
    const uids = new Set((picked.length ? picked : scopes).flatMap((scope) => scope.facetQuestionUids || scope.scopeQuestionUids || []));
    const index = unifiedIndex();
    const records = index
      ? [...uids].map((uid) => index.byUid.get(uid)?.record).filter(Boolean)
      : (state.catalog.records || []).filter((record) => uids.has(record.questionUid));
    const options = C.metaFacetOptions(records, state.filters, metaFacetLabel);
    // A stored selection that no longer exists in the current units is dropped (never silently
    // kept as an invisible zero-result filter).
    let cleared = false;
    for (const [key, list] of [["metaL3", options.l3], ["metaPT", options.pt], ["metaTPL", options.tpl]])
      if (state.filters[key] && !list.some((option) => option.value === state.filters[key])) {
        state.filters[key] = "";
        cleared = true;
      }
    return { ...options, poolSize: records.length, cleared };
  }
  const facetOptionMarkup = (list, current, emptyLabel) =>
    `<option value="">${esc(emptyLabel)}</option>${list.map((option) =>
      `<option value="${esc(option.value)}"${current === option.value ? " selected" : ""}>${esc(option.label)} · ${esc(C.metaFacetStatusText(option))}</option>`).join("")}`;
  function renderDerivedComposition() {
    const sourceTitle = state.derivationSource?.parentDisplayName || "저장한 시험지";
    return `<section class="compose-composition cz-derived"><h2 class="cz-derived-title">원본 저장 시험지의 고정된 범위</h2><p class="muted">원본 ${esc(sourceTitle)}의 범위와 ${state.selected.length}문항으로 새 문제지를 만들었습니다. 문항 교체와 출력 설정을 바꿔 새 시험지로 저장할 수 있습니다.</p><p class="muted">바꾸지 않은 문항은 저장 당시 내용 그대로 사용합니다. 원래 저장한 시험지는 바뀌지 않습니다.</p></section>`;
  }
  function composeStepLabel(row) {
    const label = row.label || "선택한 전체 범위";
    const buckets = row.difficultyBuckets || [];
    return buckets.length ? `${label} · ${buckets.join("·")}단계` : label;
  }
  V.composeLiveInfo = null;
  function composeLiveMarkup(info) {
    const { rows, perRow, shortages } = info;
    const requested = rows.reduce((n, row) => n + row.count, 0);
    const possible = perRow.reduce((n, item) => n + Math.min(item.row.count, item.available), 0);
    const countValid = state.distribution === "all" ||
      (Number.isInteger(state.count) && state.count >= 1 && state.count <= 400);
    const regenerate = state.selected.length > 0;
    const overLimit = countValid && requested > 400;
    let line;
    if (!rows.length)
      line = '<p class="cz-feasible muted" data-cz-feasible="empty">단원을 고르면 뽑을 수 있는 문항 수가 여기에 보입니다.</p>';
    else if (!countValid)
      line = '<p class="cz-feasible muted" data-cz-feasible="count">문항 수는 1~400 사이로 입력해 주세요.</p>';
    else if (overLimit)
      line = `<p class="cz-feasible danger-text" data-cz-feasible="limit">한 번에 최대 400문항입니다(지금 요청 ${requested}문항). 단원이나 문항 수를 줄여 주세요.</p>`;
    else if (!possible)
      line = '<p class="cz-feasible danger-text" data-cz-feasible="none">고른 조건에 맞는 문항이 없습니다. 단원이나 난이도 단계 조건을 넓혀 보세요.</p>';
    else {
      const unitsNote = rows.length > 1 && state.distribution !== "pool" ? ` (단원 ${rows.length}개)` : "";
      line = `<p class="cz-feasible" data-cz-feasible="ok"><span class="cz-feasible-n">${possible}문항</span> 가능 <span aria-hidden="true">·</span> 요청 ${requested}문항${unitsNote}</p>`;
      if (shortages.length)
        line += `<p class="cz-feasible-note" data-cz-feasible-short>모자라도 막지 않고 있는 만큼만 넣습니다. ${shortages.slice(0, 3).map((item) =>
          `${esc(composeStepLabel(item.row))}: 요청 ${item.row.count} · 가능 ${item.available}`).join(" / ")}${shortages.length > 3 ? ` 외 ${shortages.length - 3}곳` : ""}</p>`;
    }
    // while shards of other exams are being fetched for this screen, the button says so instead of looking ready
    const disabled = !rows.length || state.sealed || state.busy || state.shardBusy || !countValid || !possible || overLimit;
    V.composeLiveInfo = { requested, possible, disabled, hasRows: rows.length > 0, overLimit };
    if (state.shardBusy) line += `<p class="cz-feasible-note" data-cz-shard-busy role="status">문항 목록을 불러오는 중입니다.</p>`;
    return `<div class="cz-live" data-cz-live>${line}${button(
      "generate",
      regenerate ? "같은 조건으로 다시 뽑기" : "문제지 만들기",
      `class="${regenerate ? "cz-generate" : "primary cz-generate"}" ${disabled ? "disabled" : ""}`,
    )}</div>`;
  }
  function composeFilesMarkup() {
    return `<div class="cz-files" role="group" aria-label="작업 파일">${button("backup", "작업 백업 다운로드", 'class="small"')}${button("import", "백업 불러오기", 'class="small"')}</div>`;
  }
  // 조건 순서: 학년 → 과목 → 난이도 단계 → 문항 수 → 단원(긴 목록) → 더 자세한 조건 → 요약 + 문제지 만들기.
  // 짧은 조작을 위에 두고 긴 단원 목록을 마지막에 두어, 목록이 길어도 단계·문항 수가 화면 아래로 밀리지 않는다.
  function renderComposition() {
    const parts = composeParts();
    return parts.amount + parts.tail;
  }
  function composeParts() {
    if (state.derivationSource) return { amount: renderDerivedComposition(), tail: "" };
    const fixedAssessment = isAssessmentRecipeMode();
    if (fixedAssessment) {
      state.distribution = "pool";
      state.count = activeAssessmentRecipe()?.defaultCount || 4;
    }
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      primaryPaths: selectedScopePaths(),
    };
    const rows = planRows();
    const excluded = C.composeExclusions(context()).union;
    const candidates = pool().filter(
      (r) =>
        workspaceMatches(r, selectionFilters) &&
        composeMetaMatches(r) &&
        workspaceEligibility(r).ok &&
        !excluded.has(r.questionUid),
    );
    const perRow = rows.map((row) => ({
      row,
      available: candidates.filter((r) => C.rowMatches(r, row, workspaceMatchOptions())).length,
    }));
    const shortages = perRow.filter((item) => item.available < item.row.count);
    // Older drafts may still carry the strict concept/type pair; it is only shown while set.
    const legacyAdvanced = state.filters.L3 || state.filters.L4 ? composeAdvancedChoices(selectionFilters) : null;
    const facets = composeMetaFacets();
    if (facets.cleared) queueMicrotask(render);
    const detailFilters = state.filters;
    const detailCount = [
      detailFilters.originalCurriculum, detailFilters.school, detailFilters.axis,
      detailFilters.yearFrom || detailFilters.yearTo, detailFilters.L3, detailFilters.L4,
      detailFilters.metaL3, detailFilters.metaPT, detailFilters.metaTPL, detailFilters.metaApprovedOnly,
    ].filter(Boolean).length;
    const facetDisabled = state.sealed ? "disabled" : "";
    const facetNote = !facets.poolSize
      ? "선택할 수 있는 단원이 없습니다."
      : facets.l3.length || facets.pt.length || facets.tpl.length
        ? `이 범위 ${facets.poolSize}문항 중 기록된 분류가 있는 문항에서 고를 수 있습니다. ‘검토 대기’는 아직 승인되지 않은 분류이며, 승인된 분류와 같은 방식으로 사용할 수 있습니다.`
        : "이 범위의 문항에는 기록된 개념·유형·풀이 분류가 아직 없습니다.";
    const amountNote = state.distribution === "pool"
      ? `전체 ${esc(state.count)}문항`
      : state.distribution === "all"
        ? "조건에 맞는 문항 전부"
        : `단원마다 ${esc(state.count)}문항씩`;
    const countDisabled = state.distribution === "all" || state.sealed ? "disabled" : "";
    const stepper = `<span class="cz-stepper" role="group" aria-labelledby="compose-count-label">${button("count-step", "", `type="button" class="cz-step-btn is-minus" data-step="-1" aria-label="문항 한 개 줄이기" ${countDisabled}`)}<input id="count" type="number" inputmode="numeric" min="1" max="400" value="${esc(state.count)}" aria-labelledby="compose-count-label" ${countDisabled}>${button("count-step", "", `type="button" class="cz-step-btn is-plus" data-step="1" aria-label="문항 한 개 늘리기" ${countDisabled}`)}</span>`;
    const detail = `<details class="compose-detail cz-detail" ${state.composeDetailOpen ? "open" : ""}><summary>더 자세한 조건${detailCount ? ` <span class="badge" aria-label="적용 중인 세부 조건 ${detailCount}개">${detailCount}개 적용 중</span>` : ""}</summary><div class="cz-detail-body">
      <div class="inline"><label>배분 방식<select id="distribution" ${state.sealed ? "disabled" : ""}>${options(
        [
          { value: "equal", label: "단원별 균등" },
          { value: "pool", label: "전체에서 선택" },
          { value: "custom", label: "직접 배분" },
          { value: "all", label: "조건 일치 전부" },
        ],
        state.distribution,
        null,
      )}</select></label></div>
      ${state.uidRoute ? "" : `${filterMarkup(state.filters, "compose", "detail")}<div class="compose-taxonomy" data-meta-facets><strong>개념·유형·풀이로 더 좁히기</strong><div class="compose-detail-fields"><label>개념<select data-filter="metaL3" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.l3, state.filters.metaL3, "전체 개념")}</select></label><label>유형<select data-filter="metaPT" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.pt, state.filters.metaPT, "전체 유형")}</select></label><label>풀이<select data-filter="metaTPL" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.tpl, state.filters.metaTPL, "전체 풀이")}</select></label><label class="check"><input type="checkbox" data-filter="metaApprovedOnly" data-group="compose" ${state.filters.metaApprovedOnly ? "checked" : ""} ${facetDisabled}>승인된 분류만</label></div><p class="muted">${esc(facetNote)}</p>${legacyAdvanced ? `<div class="compose-detail-fields"><label>기존 개념 조건<select data-filter="L3" data-group="compose" ${facetDisabled}>${advancedOptions(legacyAdvanced.concepts, state.filters.L3, "전체 개념")}</select></label><label>기존 유형 조건<select data-filter="L4" data-group="compose" ${facetDisabled}>${advancedOptions(legacyAdvanced.types, state.filters.L4, "전체 유형")}</select></label></div>` : ""}</div>`}
      ${rows.length ? `<table class="composition"><thead><tr><th>범위</th><th>난이도</th><th>요청</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${esc(row.label || "선택한 전체 범위")}</td><td>${state.distribution === "custom" ? bucketButtons(row.difficultyBuckets, row.id) : esc(row.difficultyBuckets.join(" · ")) || "전체"}</td><td>${state.distribution === "custom" ? `<input type="number" min="1" max="400" data-row-count="${esc(row.id)}" value="${esc(row.count)}" aria-label="${esc(row.label)} 문항 수" ${state.sealed ? "disabled" : ""}>` : esc(row.count)}</td></tr>`).join("")}</tbody></table>` : '<p class="muted">위에서 출제할 범위를 선택하세요.</p>'}
      <p class="muted">조건에 맞는 문항을 최신 연도부터(2026년, 2025년, 2024년 순) 선택하고, 연도를 알 수 없는 자료는 마지막에 선택합니다. 같은 연도 안에서는 문항을 섞습니다. 50문항 기준으로 분할하며, 단원·난이도·출처 조건을 그대로 지킵니다.</p>
      ${composeFilesMarkup()}</div></details>`;
    const amount = `<div class="cz-block cz-amount"><div class="compose-difficulty cz-levels"><div class="cz-levels-head"><strong id="compose-difficulty-label">난이도 단계</strong><span class="muted">고르지 않으면 모든 단계에서 뽑습니다.</span></div>${bucketButtons(state.buckets)}</div>
      <div class="cz-amount-row"><span class="cz-label" id="compose-count-label">문항 수</span>${stepper}<span class="cz-amount-note">${amountNote}</span></div></div>`;
    return { amount, tail: `${detail}${composeLiveMarkup({ rows, perRow, shortages })}` };
  }
  // Year spread of the generated paper, in the recency order the selection used.
  function yearDistribution(records) {
    const counts = new Map();
    for (const record of records) {
      const year = C.sourceYear(record);
      counts.set(year, (counts.get(year) || 0) + 1);
    }
    return C.sortYearsByRecency(counts.keys())
      .map((year) => ({ year, label: year ? `${year}년` : "연도 미상", count: counts.get(year) }));
  }
  // Problem-type spread of the generated paper (only questions with a recorded type count).
  function typeCoverageLine() {
    if (!state.selected.length || !C.typeCoverage) return "";
    const coverage = C.typeCoverage(state.selected);
    if (!coverage.typedCount) return "";
    const repeated = coverage.repeatedCount ? ` (같은 유형 중복 ${coverage.repeatedCount}문항)` : "";
    return `<div class="summary-line" data-type-coverage><span>기록된 유형</span><strong>${coverage.typedCount}문항 · 서로 다른 유형 ${coverage.distinctTypes}가지${repeated}</strong></div>`;
  }
  // 요약: 문항 수·권 수·단원/단계 구성, 모자랐던 곳, 검증 결과. 저장 확인 탭이 하던 일을 오른쪽 위로 옮겼다.
  function renderResultSummary(r = state.selected.length ? review() : null) {
    const parts = Math.max(1, Math.ceil(state.selected.length / 50));
    const tally = (keyOf) => {
      const counts = new Map();
      for (const record of state.selected) counts.set(keyOf(record), (counts.get(keyOf(record)) || 0) + 1);
      return counts;
    };
    const units = [...tally((record) => composeUnitLabel(record) || "단원 미분류")];
    const unitText = units.length > 4
      ? `${units.slice(0, 4).map(([name, n]) => `${esc(name)} ${n}`).join(" · ")} 외 ${units.length - 4}개 단원`
      : units.map(([name, n]) => `${esc(name)} ${n}`).join(" · ");
    const steps = [...tally((record) => Number(record.difficultyBucket) || 0)]
      .sort((a, b) => (a[0] || 99) - (b[0] || 99));
    const stepText = steps.map(([step, n]) => `${step ? `${step}단계` : "단계 미지정"} ${n}`).join(" · ");
    const shortage = state.composeShortage.length
      ? `<div class="callout cz-shortage" role="status" data-compose-shortage><strong>모자라서 있는 만큼만 넣었습니다.</strong><ul>${state.composeShortage.map((item) =>
        `<li>${esc(composeStepLabel(item))}: ${item.requested - item.got}문항 모자람 (요청 ${item.requested}, 넣은 문항 ${item.got})</li>`).join("")}</ul></div>`
      : "";
    return `<div class="cz-summary" data-cz-summary><h2 class="cz-result-title" data-cz-result-title>만들어진 문제지</h2>
      <div class="cz-count"><span class="cz-big">${state.selected.length}문항</span><span class="cz-parts">${parts}권</span></div>
      <p class="cz-mix">${unitText}</p><p class="cz-mix">${stepText}</p>
      ${shortage}
      ${deriveNoteMarkup()}
      <div class="cz-facts"><div class="summary-line"><span>회차</span><strong>${esc(state.round)}차</strong></div><div class="summary-line"><span>선택 범위</span><strong>${state.derivationSource ? "원본 유지" : `${selectedScopeOptions().length}개`}</strong></div><div class="summary-line"><span>고정 문항</span><strong>${state.pins.length}개</strong></div><div class="summary-line"><span>이전 회차 사용</span><strong>${unique(state.rounds.flatMap((round) => round.questionUids)).length}문항</strong></div>
      ${typeCoverageLine()}
      ${state.selected.length ? `<div class="summary-line" data-year-distribution><span>출제 연도</span><strong>${yearDistribution(state.selected).map((item) => `${esc(item.label)} ${item.count}문항`).join(" · ")}</strong></div>` : ""}</div>
      ${r ? `<div class="callout ${r.status === "HARD_BLOCK" ? "danger" : r.status === "PASS" ? "good" : ""}"><strong>${r.status === "PASS" ? "검증 통과" : r.status === "WARN" ? "확인할 내용이 있습니다" : "출력·출제 차단"}</strong>${[...r.hardFailures, ...r.warnings].map((m) => `<div>${esc(m)}</div>`).join("")}<div>중복 없이 ${r.metrics.uniqueUidCount}문항 · 원본 ${r.metrics.sourceCount}개 시험</div></div>` : ""}
      ${r?.warnings.length ? `<label class="check"><input type="checkbox" id="ack-warnings" ${state.ackWarnings ? "checked" : ""}>안내를 확인했습니다.</label>` : ""}</div>`;
  }
  // 예전 오른쪽 패널(요약 + 마무리). 화면은 요약과 마무리를 따로 놓지만 함수명은 유지한다.
  function renderInspector() {
    return renderResultSummary() + renderOutputSettings() + renderResultFinish();
  }
  function composeSourceNote() {
    if (state.uidRoute && !state.uidRoute.error)
      return `<p class="cz-entry" data-cz-entry="uid">${state.derive ? "시험지를 다시 만들어 고른" : "검색에서 고른"} ${state.uidRoute.records.length}문항으로 범위가 고정되어 있습니다.</p>`;
    if (state.sources.length)
      return `<p class="cz-entry" data-cz-entry="sources">학교별 기출에서 고른 시험 ${state.sources.length}개 안에서 문항을 뽑습니다.</p>`;
    return "";
  }
  function renderResultEmpty() {
    const earlier = drafts().filter((item) => item.draftId !== state.draftId && item.selected?.length).length;
    const last = clearedResult();
    const restore = last
      ? `<div class="callout cz-restore" role="status" data-compose-restore><p>조건을 바꾸기 전에 만든 문제지(${last.selected.length}문항)가 있습니다. 고정·교체한 내용까지 그대로 돌아옵니다.</p>${button("restore-cleared", "방금 문제지 되돌리기", 'class="small"')}</div>`
      : "";
    return `${state.composeStale
      ? `<div class="callout cz-stale" role="status" data-compose-stale><strong>조건이 바뀌었습니다.</strong> <strong>문제지 만들기</strong>를 누르면 새로 뽑습니다.${state.composeStalePins ? ` 고정해 둔 ${state.composeStalePins}문항도 함께 지워졌습니다.` : ""}</div>`
      : ""}${restore}<div class="cz-empty"><h2>만들어진 문제지가 여기에 나옵니다</h2><p data-cz-empty-guide><span class="cz-dir-wide">왼쪽</span><span class="cz-dir-narrow">위</span>에서 조건을 고르고 <strong>문제지 만들기</strong>를 누르면 여기에 문제지가 나옵니다.</p>${composeSourceNote()}${earlier ? `<p class="cz-entry" data-cz-entry="drafts">이어서 할 수 있는 이전 작업이 ${earlier}개 있습니다. ${`<button type="button" class="cz-link" data-view="recent">출제 내역에서 이어하기</button>`}</p>` : ""}</div>`;
  }
  function renderResult(r = state.selected.length ? review() : null) {
    clearedResult(); // 결과가 다시 생겼거나 다른 작업으로 넘어갔으면 되살릴 것을 버린다
    const unknown = state.saveResultState === "RESULT_UNKNOWN";
    const notice = state.composeNotice
      ? `<div class="callout cz-notice" role="status" data-compose-notice>${esc(state.composeNotice)}</div>`
      : "";
    const top = `<div id="compose-save-continuity">${renderSaveRecovery()}${renderSavedContinuity()}</div>${notice}`;
    if (!r) return `${top}${renderResultEmpty()}`;
    return `${top}<div class="cz-result-body" ${unknown ? "inert" : ""}>${renderResultSummary(r)}${renderPaper()}${renderOutputSettings()}${renderResultFinish(r)}</div>`;
  }
  function renderConditions() {
    if (state.derivationSource) return `<div class="cz-block">${renderDerivedComposition()}</div>`;
    const receiptNote = state.receipts.length
      ? '<p class="callout" role="status">이미 출제한 문제지가 있어 조건은 바꿀 수 없습니다. 남은 문제지의 문항을 교체하거나 새 작업을 시작하세요.</p>'
      : "";
    const sources = state.sources.length
      ? `<div class="callout">선택한 시험 ${state.sources.length}개 안에서 선택합니다. ${button("sources-clear", "전체 아카이브로 변경", 'class="small"')}</div>`
      : "";
    const parts = composeParts();
    return `${receiptNote}${state.uidRoute ? "" : filterMarkup(state.filters, "compose", "primary")}${sources}${parts.amount}<div class="cz-block compose-range cz-scope">${renderScopes()}</div>${parts.tail}`;
  }
  function renderCompose() {
    const unknown = state.saveResultState === "RESULT_UNKNOWN";
    const r = state.selected.length ? review() : null;
    return `<p class="visually-hidden" role="status" aria-live="polite" data-cz-announce>${esc(state.composeAnnounce)}</p><div class="intro cz-intro"><div><h1>${esc(state.title)} <span class="badge">${esc(state.round)}차</span></h1><p class="muted">${state.derivationSource ? "저장한 시험지에서 만든 새 문제지입니다. 원래 시험지는 그대로 보존됩니다." : ""}</p></div><div class="actions"><button type="button" class="phone-quick-link" data-view="five-minute">빠른 평가</button>${button("new-draft", "새 작업")}</div></div>
    <div class="cz${state.selected.length ? " has-result" : ""}"><section class="cz-conditions" aria-label="문제지 조건" data-cz-conditions ${unknown ? "inert" : ""}>${renderConditions()}</section><section class="cz-result" aria-label="만들어진 문제지" data-cz-result>${renderResult(r)}</section></div>${renderMobileActions(r)}`;
  }
  // 준비(prepare)가 만드는 문제지가 달라지는 입력 전부: 문항 순서(UID), 머리글, 문항 수/쪽, 회차, QR, 파생 원본.
  // 미리보기 서명(preview part)도 이 값에서 출발한다.
  function prepareSignature() {
    return JSON.stringify([
      state.selected.map((r) => r.questionUid),
      state.header,
      state.qpp,
      state.round,
      state.includeQr,
      state.derivationSource,
    ]);
  }
  // 진행 중인 준비 하나: 같은 서명으로 겹쳐 부르면 이 Promise를 같이 기다린다(복원은 한 번만 돈다).
  // 서명이 바뀌면 새 준비가 이 자리를 차지하고, 늦게 끝난 옛 준비는 결과를 버린다(buildPrepared 끝의 서명 대조).
  let prepareFlight = null;
  async function prepare() {
    const signature = prepareSignature();
    if (state.prepared.signature === signature) return state.prepared;
    if (prepareFlight?.signature === signature) return prepareFlight.promise;
    const flight = { signature, promise: null };
    flight.promise = buildPrepared(signature).finally(() => {
      if (prepareFlight === flight) prepareFlight = null;
    });
    prepareFlight = flight;
    return flight.promise;
  }
  // 문항 하나를 바꿔도 나머지 49문항은 다시 복원하지 않는다. 다만 재사용 전에 복원이 확인하던 것(원본 파일 SHA,
  // 문항 지문·정답·해설·그림 해시, UID)을 같은 기준으로 다시 확인하고, 하나라도 어긋나면 그 문항은 Source.restore가
  // 처음부터 복원·검증한다(재사용은 검증을 건너뛰는 길이 아니다).
  async function stillRestorable(prior, record) {
    try {
      const file = record.sourceFile,
        ordinal = record.sourceOrdinal;
      if (
        prior.questionUid !== record.questionUid ||
        prior._sourceFile !== file ||
        prior.sourceOrdinal !== ordinal ||
        prior.sourceFingerprint !== record.sourceFingerprint
      ) return false;
      const sourceHash = String(new Map(state.catalog.sourceHashes).get(file) || "").trim();
      const original = (await Source.load(file, sourceHash))[ordinal - 1];
      if (!original) return false;
      if ((await Source.fingerprint(original)) !== record.sourceFingerprint) return false;
      if ((await Source.fingerprint(prior)) !== record.sourceFingerprint) return false;
      return await Source.uidMatchesSource(record, state.catalog);
    } catch {
      return false;
    }
  }
  async function restoreChanged(partRecords, reusable) {
    if (!reusable.size) return Source.restore(partRecords, state.catalog);
    const kept = await Promise.all(partRecords.map(async (record) => {
      const prior = reusable.get(record.questionUid);
      return prior && (await stillRestorable(prior, record)) ? prior : null;
    }));
    const missing = partRecords.filter((_, i) => !kept[i]);
    const restored = missing.length ? await Source.restore(missing, state.catalog) : [];
    let next = 0;
    return partRecords.map((_, i) => kept[i] || restored[next++]);
  }
  async function buildPrepared(signature) {
    const records = state.selected;
    // 직전에 준비한 문제지의 복원 결과(같은 카탈로그 판, 학생에게 출제 전 문제지만)를 UID로 재사용 후보에 올린다.
    const reusable = new Map();
    if (state.prepared.indexVersion && state.prepared.indexVersion === state.catalog?.indexVersion)
      for (const paper of state.prepared)
        if (!paper.assignmentId)
          for (const question of paper.questions || [])
            if (question?.questionUid) reusable.set(question.questionUid, question);
    const prepared = [];
    const derivedBaseQuestions = await ensureDerivedBaseQuestions();
    const derivedBaseByUid = new Map((derivedBaseQuestions || []).map(question => [question.questionUid, question]));
    for (let i = 0; i < records.length; i += 50) {
      const index = i / 50,
        saved = Parts.receipt(state.receipts, index);
      if (saved) {
        if (!frozenPaperCache.has(saved.key)) {
          const data = await api(
            "/class-exam-assignments/" +
              encodeURIComponent(saved.id) +
              "/status",
          );
          const payload = JSON.parse(data.assignment.mixed_payload_json);
          if (
            JSON.stringify(payload.meta.questionUids) !==
            JSON.stringify(records.slice(i, i + 50).map((r) => r.questionUid))
          )
            throw new Error(
              "이미 출제한 문제지의 문항이 바뀌었습니다. 출제 내역에서 원본을 확인해 주세요.",
            );
          frozenPaperCache.set(saved.key, {
            key: saved.key,
            index,
            questions: payload.questions,
            meta: payload.meta,
          });
        }
        const frozen = frozenPaperCache.get(saved.key);
        prepared.push({ ...frozen, assignmentId: saved.id });
        continue;
      }
      const partRecords = records.slice(i, i + 50);
      const part = derivedBaseQuestions
        ? await (window.Archive2ErrorDetail?.allOrReport || ((promises) => Promise.all(promises)))(partRecords.map(async record => {
          try {
            const frozen = derivedBaseByUid.get(record.questionUid);
            if (frozen) {
              const sourceFile = String(frozen.sourceArchiveFile || frozen.sourceFile || frozen._sourceFile || "");
              if (!frozen.sourceFingerprint || String(frozen.sourceFingerprint) !== String(record.sourceFingerprint) ||
                  sourceFile !== String(record.sourceFile || "") || Number(frozen.sourceOrdinal) !== Number(record.sourceOrdinal))
                throw new Error("원본 문항이 바뀌어, 저장 당시 문항을 현재 문항으로 바꾸지 않았습니다. 저장한 시험지는 그대로 출력할 수 있습니다.");
              return structuredClone(frozen);
            }
            return (await Source.restore([record], state.catalog))[0];
          } catch (error) {
            // Say which exam / question was behind it (Source.restore already did for its own errors).
            throw window.Archive2ErrorDetail ? window.Archive2ErrorDetail.annotate(error, {
              file: record.sourceFile, questionNo: record.sourceQuestionNo, ordinal: record.sourceOrdinal, uid: record.questionUid,
              code: "QUESTION_CONTENT_CHANGED",
            }) : error;
          }
        }))
        : await restoreChanged(partRecords, reusable);
      const partSignature = JSON.stringify([
          part.map((q) => q.questionUid),
          state.header,
          state.qpp,
          state.includeQr,
        ]),
        key = `archive2-${state.draftId}-${state.round}-${index}-${(await Source.digest(partSignature)).slice(0, 12)}`;
      const meta = {
        title:
          records.length > 50
            ? `${state.header.title} · ${index + 1}권`
            : state.header.title,
        customTitle: state.header.title,
        identityTitle: state.header.title,
        count: part.length,
        grade: state.filters.grade,
        subject: C.subjectProjectionLabel(state.filters) || composeSubjectLabel(),
        questionUids: part.map((q) => q.questionUid),
        printHeaderOptions: {
          ...state.header,
          title:
            records.length > 50
              ? `${state.header.title} · ${index + 1}권`
              : state.header.title,
        },
        includeQr: state.includeQr === true,
        qpp: state.qpp,
        sourceType: "mixed",
        seriesId: state.draftId,
        roundNo: state.round,
        outputContractVersion: C.VERSION,
        indexVersion: state.catalog.indexVersion,
      };
      prepared.push({ key, index, questions: part, meta });
    }
    if (signature !== prepareSignature())
      throw new Error("편집 내용이 변경되었습니다. 다시 시도하세요.");
    prepared.signature = signature;
    prepared.indexVersion = state.catalog?.indexVersion;
    state.prepared = prepared;
    return prepared;
  }
  function generate(rebuild = false) {
    if (state.sealed) return;
    if (state.receipts.length || (rebuild && state.selected.length > 50)) {
      rebuildUnissued();
      return;
    }
    state.composeNotice = "";
    state.seed = crypto.randomUUID();
    const req = request();
    if (!rebuild) req.pins = [];
    const ctx = context();
    if (rebuild)
      ctx.current = state.selected
        .filter((r) => !state.pins.includes(r.questionUid))
        .map((r) => r.questionUid);
    const result = C.selectBlueprint(pool(), req, ctx, assessmentSelectionOptions());
    // 선택 엔진이 거절한 것(학년 없음·고정 문항 충돌 등)은 그대로 알린다. 문항이 모자란 것은 거절이 아니다.
    if (result.errors.length) {
      showDialog(
        "문제지를 만들 수 없습니다",
        `<p>${result.errors.map(esc).join("<br>")}</p><p>범위·난이도·고정 문항을 확인한 뒤 다시 만들어 주세요.</p>`,
      );
      return;
    }
    // 고정 외 다시 만들기는 지금 문항을 후보에서 빼고 뽑으므로 새 문항이 모자라면 문제지가 조용히 줄어든다. 줄어들면 적용하지 않고
    // 지금 문제지를 그대로 둔다("모자라도 막지 않음"은 새로 만들 때만 적용한다).
    if (rebuild && result.selected.length < state.selected.length) {
      state.composeNotice = "바꿔 넣을 문항이 모자라 지금 문제지를 그대로 둡니다. 문항을 하나씩 교체하거나 조건을 넓혀 주세요.";
      render();
      return;
    }
    // 모자라도 막지 않는다(단원별 기출과 같은 원칙): 있는 만큼만 넣고, 어디가 얼마나 모자랐는지 결과 위에 알린다.
    // 뽑힌 만큼으로 줄인 행(0인 행은 뺀다)으로 검증해야 C.review가 "요청한 문항 수가 충족되지 않았습니다"로 막지 않는다.
    const picked = new Map(result.rowResults.map((item) => [item.id, item.selected]));
    const usedRows = req.rows
      .filter((row) => (picked.get(row.id) || 0) > 0)
      .map((row) => (picked.get(row.id) === row.count ? row : { ...row, count: picked.get(row.id) }));
    if (!result.selected.length || !usedRows.length) {
      state.composeStale = false;
      status("고른 조건에 맞는 문항이 없습니다. 단원이나 난이도 단계 조건을 넓혀 주세요.", true);
      render();
      return;
    }
    state.composeShortage = req.rows
      .filter((row) => (picked.get(row.id) || 0) < row.count)
      .map((row) => ({
        label: row.label || "",
        difficultyBuckets: row.difficultyBuckets || [],
        requested: row.count,
        got: picked.get(row.id) || 0,
      }));
    state.composeStale = false;
    state.questionListOpen = true;
    lastCleared = null;
    state.selected = result.selected;
    state.rows = usedRows;
    state.indexVersion = state.catalog.indexVersion;
    state.prepared = [];
    state.undo = [];
    state.previewIndex = 0;
    state.ackWarnings = false;
    if (!rebuild) state.pins = [];
    save();
    render();
    if (!rebuild) focusComposeResult();
    // 화면 상태 줄에는 내지 않는다(오른쪽 결과 요약과 겹치고, 처리 시간은 교사에게 필요 없다). 화면 읽기 프로그램용
    // 숨은 안내(composeAnnounce)에만 두고, 처리 시간은 콘솔과 ?perf=1에서만 보인다.
    state.composeAnnounce = `${result.selected.length}문항을 선택했습니다.`;
    status("");
    if (new URLSearchParams(location.search).get("perf") === "1") status(`${result.selected.length}문항 선택 · 중복 없음 · ${result.diagnostics.elapsedMs}ms`);
    else console.debug("[archive2] generate", result.selected.length, "questions", result.diagnostics.elapsedMs + "ms");
  }
  // 좁은 화면(조건이 위, 결과가 아래)에서는 뽑은 결과가 화면 밖 아래에 생기므로 결과 머리로 옮기고 포커스를 둔다. 두 칸(PC)은
  // 결과가 바로 옆에 보여 스크롤하지 않는다. 움직임 줄이기 설정이면 부드러운 스크롤 없이 바로 이동한다.
  function focusComposeResult() {
    try {
      if (window.matchMedia?.("(min-width: 1100px)")?.matches) return;
      const target = document.querySelector("[data-cz-result-title]");
      if (!target) return;
      target.setAttribute("tabindex", "-1");
      const reduce = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
      target.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });
      target.focus?.({ preventScroll: true });
    } catch {}
  }
  function replace(index) {
    if (lockedIndex(index))
      throw new Error("이미 학생에게 출제한 문제지는 변경할 수 없습니다.");
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      primaryPaths: selectedScopePaths(),
    };
    replacementIndex = index;
    const current = state.selected[index],
      row = state.rows.find((r) => r.id === current.rowId),
      used = new Set(state.selected.map((r) => r.questionUid)),
      excluded = C.composeExclusions(context()).union;
    V.candidateRecords = pool().filter(
      (r) =>
      workspaceEligibility(r).ok &&
      workspaceMatches(r, selectionFilters) &&
      C.rowMatches(r, row, workspaceMatchOptions()) &&
        !used.has(r.questionUid) &&
        !excluded.has(r.questionUid),
    ).sort(C.compareRecency);
    showDialog(
      `${Math.floor(index / 50) + 1}권 ${(index % 50) + 1}번 교체 · ${current.L2}`,
      `<p class="muted">현재 출제 조건·출처·학생 이력을 유지합니다. 후보 ${V.candidateRecords.length}문항</p>${
        V.candidateRecords
          .slice(0, 30)
          .map(
            (r, i) =>
              `<div class="candidate"><div><strong>${esc(r.year)} ${esc(r.school)} · 원본 ${esc(r.sourceQuestionNo)}번</strong><p class="muted">${esc(displayTemplate(r))} · 난이도 ${r.difficultyBucket}</p></div><div>${button("candidate-preview", "원본 확인", `data-candidate="${i}" class="small"`)}${button("candidate-use", "교체", `data-candidate="${i}" class="small"`)}</div></div>`,
          )
          .join("") ||
        '<div class="empty">같은 조건으로 교체할 새 문항이 없습니다.</div>'
      }`,
    );
  }
  function replaceWith(candidate) {
    if (lockedIndex(replacementIndex))
      throw new Error("이미 출제한 문항입니다.");
    const before = state.selected[replacementIndex],
      after = { ...candidate, rowId: before.rowId };
    const next = state.selected.slice();
    next[replacementIndex] = after;
    const check = C.review(next, request(true), ownHistoryContext());
    if (!V.candidateRecords.some((r) => r.questionUid === candidate.questionUid))
      throw new Error("현재 교체 후보가 아닙니다.");
    state.undo.push({
      index: replacementIndex,
      before,
      after,
      wasPinned: state.pins.includes(before.questionUid),
    });
    state.composeNotice = "";
    state.selected = next;
    state.pins = state.pins.map((uid) =>
      uid === before.questionUid ? after.questionUid : uid,
    );
    // state.prepared를 비우지 않는다: 다음 prepare()가 바뀐 문항만 복원하고 나머지는 확인 뒤 재사용한다.
    state.ackWarnings = false;
    save();
    $("modal").close();
    render();
    status("문항을 교체했습니다. 필요하면 되돌릴 수 있습니다.");
  }
  function seal() {
    state.sealed = Parts.status(state.selected.length, state.receipts).complete;
    save();
  }
  // 문항 수가 바뀔 때(입력·− / +): 전체를 다시 그리지 않고(입력 중인 칸과 포커스를 지키려고) 지금 조건의 요약·버튼과
  // 오른쪽 안내, 하단 띠만 새로 그린다. 이미 뽑은 결과는 지금 동작대로 비우고 "조건이 바뀌었습니다"를 보인다.
  function composeCountChanged() {
    invalidate();
    patchComposeLive();
  }
  function patchComposeLive() {
    const live = document.querySelector("[data-cz-live]");
    const fresh = document.createElement("template");
    fresh.innerHTML = renderComposition();
    const nextLive = fresh.content.querySelector("[data-cz-live]");
    if (live && nextLive) live.replaceWith(nextLive);
    const note = document.querySelector(".cz-amount-note"), nextNote = fresh.content.querySelector(".cz-amount-note");
    if (note && nextNote) note.replaceWith(nextNote);
    const result = document.querySelector("[data-cz-result]");
    if (result) result.innerHTML = renderResult();
    document.querySelector(".cz")?.classList.toggle("has-result", state.selected.length > 0);
    refreshComposeBar();
  }
  function stepComposeCount(delta) {
    if (state.sealed || state.receipts.length || state.distribution === "all") return;
    const current = Number.isInteger(Number(state.count)) ? Number(state.count) : 0;
    state.count = Math.min(400, Math.max(1, current + delta));
    const input = document.getElementById("count");
    if (input) input.value = String(state.count);
    composeCountChanged();
  }
  // 문제지 만들기 조건(학년·과목·교육과정·세부 조건) 변경. 선택 상자의 change와 학년·과목 버튼이 같이 쓴다.
  function changeComposeFilter(key, value) {
    // 수정본(저장본에서 연 문제지)의 범위는 원본에 고정이다(조건 칸은 그려지지도 않는다). 조건이 바뀌면 손본 문항·고정·교체 이력이 비워지므로 건드리지 않는다.
    if (state.sealed || state.derivationSource) {
      render();
      return;
    }
    state.filters[key] = value;
    if (key === "L3") delete state.filters.L4;
    // PT -> TPL: a template belongs to one problem type, so a new type resets the template.
    if (key === "metaPT") state.filters.metaTPL = "";
    if (["grade", "curriculumKey", "courseKey", "semanticSubject", "originalCurriculum"].includes(key)) {
      // 과목이 둘뿐인 학년(고1)의 과목 단추: 새 범위 안에 있는 단원 선택은 남기고 범위 밖이 된 것만 뺀다(뺀 것이 있으면 알린다).
      // 단원 키는 u:<학년>:<과목>:<단원>[~중단원]이라 과목 칸으로 소속을 안다. 그 밖의 전환(학년·고2·고3·중등)은 지금처럼 전부 비운다.
      const previousScopes = state.scopes.slice();
      const keepScopes = key === "semanticSubject" && unifiedIndex() && Unified.subjectsForGrade(state.filters.grade).length === 2;
      state.scopes = [];
      state.scopeNotice = "";
      delete state.filters.L3;
      delete state.filters.L4;
      for (const facet of META_FACET_FILTERS) state.filters[facet] = "";
      if (key === "grade") {
        state.sources = [];
        state.buckets = [];
        state.custom = {};
        state.filters.curriculumKey = "";
        state.filters.courseKey = "";
        state.filters.semanticSubject = "";
        state.filters.originalCurriculum = "";
        state.filters.family = "";
        state.filters.school = "";
      }
      if (unifiedIndex()) {
        // The unified unit list owns subject and curriculum; the finder reconcile
        // rules (2015/2022 course keys) do not apply to it.
        state.filters = reconcileUnifiedFilters(state.filters);
        if (key === "grade") state.filters = withDefaultComposeSubject(state.filters);
      } else {
        if (key === "curriculumKey" && !C.hasSubjectProjection?.(state.filters.grade))
          state.filters.courseKey = "";
        if (key === "semanticSubject") {
          state.filters.courseKey = "";
          state.filters.family = "";
        }
        state.filters = C.reconcileFinderFilters(state.filters, state.catalog.taxonomy);
      }
      reconcileFinderSchool(state.filters);
      if (keepScopes && previousScopes.length) {
        const subject = state.filters.semanticSubject;
        const subjectOf = (scopeKey) => String(scopeKey).split(":")[2];
        state.scopes = previousScopes.filter((scopeKey) => !subject || subjectOf(scopeKey) === subject);
        const dropped = previousScopes.filter((scopeKey) => !state.scopes.includes(scopeKey));
        if (dropped.length) {
          const labels = [...new Set(dropped.map((scopeKey) => Unified.subjectByValue(state.filters.grade, subjectOf(scopeKey))?.label || "선택한"))];
          state.scopeNotice = `${labels.join("·")} 단원 ${dropped.length}개는 선택한 과목 범위 밖이라 해제했습니다.`;
        }
      }
    }
    invalidate();
    render();
  }
  Object.assign(WS.api, {
    invalidate,
    scopeOptions,
    composeLoadGroups,
    composeTree,
    composeChildScopes,
    unifiedScopeOptions,
    canonicalScopeOptions,
    scopeIsSelected,
    pickedScopeNodes,
    selectedScopeOptions,
    withoutShadowedChildren,
    selectedScopePaths,
    selectedScopeQuestionUids,
    planRows,
    pool,
    request,
    saveWorkSignature,
    review,
    refreshHistory,
    quickPools,
    quickLoadGroups,
    quickScopes,
    quickEnsureSelection,
    quickGradeClass,
    QUICK_INTRO,
    quickRowMarkup,
    renderQuick,
    fiveMinuteShuffle,
    recencyShuffle,
    quickRecencyTier,
    quickCountsText,
    balancedQuickSelection, diagnosticSelection, diagnosticMirror,
    quickUnitsLabel,
    openQuickAssessment,
    scopeOpenState,
    scopeUnitMarkup,
    renderScopes,
    bucketButtons,
    composeAdvancedChoices,
    composeMetaFacets,
    facetOptionMarkup,
    renderDerivedComposition,
    composeStepLabel,
    composeLiveMarkup,
    composeFilesMarkup,
    renderComposition,
    composeParts,
    yearDistribution,
    typeCoverageLine,
    renderResultSummary,
    renderInspector,
    composeSourceNote,
    renderResultEmpty,
    renderResult,
    renderConditions,
    renderCompose,
    prepare,
    prepareSignature,
    rememberComposeConditions,
    discardClearedResult,
    restoreClearedResult,
    clearedResult,
    generate,
    focusComposeResult,
    replace,
    replaceWith,
    seal,
    composeCountChanged,
    patchComposeLive,
    stepComposeCount,
    changeComposeFilter,
  });
})();
