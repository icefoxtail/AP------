/*
 * 단원 트리: "대단원 -> 중단원(중등) / 소단원 묶음(고등)" 목록을 만드는 한 곳이다.
 * 단원별 기출 표의 행 펼침이 쓰고, 문제지 만들기·빠른 평가의 단원 목록도 같은 모듈로 모은다(계획 작업 3).
 * 이름·순서·소속 판정이 화면마다 달라지지 않게 하려는 것이 이유다. 표시와 선택에만 쓰며 문항의 값·정본 메타는 바꾸지 않는다.
 *
 * 중등: 정본 목차 rpm-middle-toc.js(ArchiveRpmMiddleToc, 생성물)의 대단원(L1)·중단원(L2)을 목차 순서 그대로 쓴다.
 *   문항의 중단원 = 문항의 RPM 판정(record.rpmParentResolution, 없으면 core.resolveRpmParent)이 EXACT이고 같은 대단원인 parent의 L2.
 *   정본 판정이 못 정한 문항 중 문항을 읽고 중단원을 정해 둔 것(resolution.reviewedParent, 출처: 문항별 중단원 지정표)은 그 중단원이다.
 *   옛 2015 키 문항(판정이 OUT_OF_SCOPE)은 정본의 legacySubUnitMappings(옛 소단원 키 -> 현재 중단원)가 같은 대단원의 중단원 하나로
 *   정할 때만 그 중단원으로 접는다. 정할 수 없으면 그 대단원 아래 "중단원 미지정" 한 줄이다(추정 매핑 없음).
 * 고등: core 단원(현재 표 행) 아래에 소단원 묶음표 archive/data/archive2-subunit-groups.json의 묶음을 쓴다. 이름은 묶음표 그대로이고
 *   (같은 이름이 겹치면 구별 문구를 붙인다), 영문·"핵심 개념"처럼 화면에 보이면 안 되는 이름과 "기타"·제외 묶음은 "기타" 한 줄로 모은다.
 *   이동(moved) 묶음은 원래 단원에 둔다(묶음표 CURRENT 규칙, 결정 대기 중). 묶음표는 비동기로 읽는다(loadGroups).
 *   못 읽으면 고등은 지금처럼 대단원만 보이고 콘솔에 경고를 남긴다.
 */
(function (root, factory) {
  const isNode = typeof module === 'object' && module.exports;
  const api = factory(isNode ? require('./unit-past-exams-core.js') : root.UnitPastExamsCore,
    isNode ? require('./rpm-middle-toc.js') : root.ArchiveRpmMiddleToc);
  if (isNode) module.exports = api;
  else root.Archive2UnitTree = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Core, Toc) {
  'use strict';

  if (!Core || typeof Core.getProfile !== 'function') throw new Error('Archive2UnitTree requires UnitPastExamsCore.');

  const GROUPS_SCHEMA = 'archive2-subunit-groups-v1';
  const GROUPS_URL = 'data/archive2-subunit-groups.json';
  const GROUPS_VERSION = '20261116-unit-tree-1';
  // 고등: 묶음에 못 넣은 문항, 중등: 중단원을 정할 수 없는 문항이 가는 한 줄.
  const NONE_KEY = '__none__';
  const MIDDLE_NONE_NAME = '중단원 미지정';
  const HIGH_OTHER_NAME = '기타';
  const MOVED_SUFFIX = ' (다른 단원 분류)';

  // ---- 묶음표(고등) 읽기 ----
  let groupsDoc = null;
  let groupsIndex = null; // unitKey -> { sections, groups }
  let groupsPromise = null;
  let groupsWarned = false;

  function setGroups(doc) {
    if (!doc || doc.schemaVersion !== GROUPS_SCHEMA || !Array.isArray(doc.scopes)) throw new Error('소단원 묶음표 형식이 맞지 않습니다.');
    const index = new Map();
    for (const scope of doc.scopes) {
      if (!scope || !scope.unitKey || scope.unitKey === 'UNCLASSIFIED' || !Array.isArray(scope.groups)) continue;
      if (!index.has(scope.unitKey)) index.set(scope.unitKey, { sections: Array.isArray(scope.sections) ? scope.sections : [], groups: scope.groups });
    }
    groupsDoc = doc;
    groupsIndex = index;
    return doc;
  }
  function groupsLoaded() { return Boolean(groupsDoc); }
  function resetGroups() { groupsDoc = null; groupsIndex = null; groupsPromise = null; groupsWarned = false; }
  function groupsUrl() {
    const base = typeof document !== 'undefined' && document.baseURI ? document.baseURI : undefined;
    try { return new URL(`${GROUPS_URL}?v=${GROUPS_VERSION}`, base).href; } catch (error) { return `${GROUPS_URL}?v=${GROUPS_VERSION}`; }
  }
  function warnGroups(reason) {
    if (groupsWarned) return;
    groupsWarned = true;
    if (typeof console !== 'undefined' && console.warn) console.warn(`[unit-tree] 소단원 묶음표를 읽지 못했습니다. 고등 단원은 대단원만 보입니다. (${reason})`);
  }
  // 비동기로 한 번만 읽는다. 실패해도 예외 없이 null을 돌려주고(콘솔 경고) 다음 호출 때 다시 시도한다.
  function loadGroups(options = {}) {
    if (groupsDoc) return Promise.resolve(groupsDoc);
    if (groupsPromise) return groupsPromise;
    const fetchFn = options.fetch || (typeof fetch === 'function' ? fetch : null);
    if (!fetchFn) { warnGroups('fetch 없음'); return Promise.resolve(null); }
    groupsPromise = Promise.resolve()
      .then(() => fetchFn(options.url || groupsUrl()))
      .then(response => {
        if (!response || response.ok === false) throw new Error(`HTTP ${response && response.status}`);
        return response.json();
      })
      .then(doc => setGroups(doc))
      .catch(error => { warnGroups(error && error.message || String(error)); groupsPromise = null; return null; });
    return groupsPromise;
  }

  // ---- 이름 점검: 화면에 보이면 안 되는 이름은 쓰지 않는다 ----
  function isDisplayableName(name) {
    const text = String(name || '').trim();
    if (!text || !/[가-힣]/.test(text)) return false;
    if (/[A-Za-z]{2,}/.test(text)) return false; // 영문 이름
    if (/핵심\s*개념/.test(text)) return false;
    return true;
  }

  const scopeKey = (unitKey, childKey) => (childKey ? `${unitKey}~${childKey}` : String(unitKey));
  // 'U|3' / 'U~C|3' -> { unitKey, childKey, step }
  function parseCellKey(key) {
    const [scope, step] = String(key || '').split('|');
    const at = scope.indexOf('~');
    return { unitKey: at < 0 ? scope : scope.slice(0, at), childKey: at < 0 ? '' : scope.slice(at + 1), step: step === undefined ? '' : step };
  }

  // ---- 중등: 정본 목차 ----
  let legacyIndex = null;
  function legacySubUnitIndex() {
    if (legacyIndex) return legacyIndex;
    legacyIndex = new Map();
    for (const row of (Toc && Toc.authority && Toc.authority.legacySubUnitMappings) || []) {
      const key = String(row.subUnitKey || '').trim();
      if (key && !legacyIndex.has(key)) legacyIndex.set(key, row.parentKeys || []);
    }
    return legacyIndex;
  }

  // 중단원 칸 키: 정본 parentKey(학년·교재·대단원·중단원 이름)에서 만든 짧은 고정 키. 목차 서수(p1, p2)는 목차 순서가 바뀌면 옛 주소의 뜻이 바뀐다.
  function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 0x01000193); }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
  const middleChildKey = parentKey => `m${fnv1a(String(parentKey || ''))}`;

  function middleUnit(profile, unit) {
    const parents = Toc.parents(profile.grade).filter(parent => parent.unitKey === unit.key)
      .sort((a, b) => (a.orderInUnit || 0) - (b.orderInUnit || 0));
    const children = parents.map((parent, index) => ({
      key: middleChildKey(parent.parentKey), name: parent.L2, kind: 'chapter', section: '', parentKey: parent.parentKey, rank: index
    }));
    const byParent = new Map(children.map(child => [child.parentKey, child]));
    const assign = record => {
      const resolution = record && (record.rpmParentResolution || Core.resolveRpmParent(record, profile));
      if (resolution && resolution.status === 'EXACT' && resolution.parent && resolution.parent.unitKey === unit.key) {
        const child = byParent.get(resolution.parent.parentKey);
        if (child) return child.key;
      }
      // 정본 판정이 못 정한 문항 중 문항을 읽고 중단원을 정해 둔 것(지정표 -> 카탈로그 reviewedMiddleParentKey)은 그 중단원으로 간다.
      // 지문이 판정 당시와 다른 문항은 카탈로그 빌더가 지정을 싣지 않으므로 여기 오지 않는다. 대단원이 다르면 쓰지 않고 예전 규칙으로 떨어진다.
      if (resolution && resolution.status !== 'EXACT' && resolution.reviewedParent && resolution.reviewedParent.unitKey === unit.key) {
        const child = byParent.get(resolution.reviewedParent.parentKey);
        if (child) return child.key;
      }
      if (!resolution || resolution.status === 'OUT_OF_SCOPE' || resolution.status === 'NOT_FOUND') {
        const subUnitKey = Core.getSubUnitKey(record) || String(record && record.legacySubUnitKey || '').trim();
        const candidates = (legacySubUnitIndex().get(subUnitKey) || []).filter(parentKey => byParent.has(parentKey));
        if (candidates.length === 1) return byParent.get(candidates[0]).key;
      }
      return NONE_KEY;
    };
    return { children, assign, noneChild: { key: NONE_KEY, name: MIDDLE_NONE_NAME, kind: 'none', section: '', parentKey: '', rank: children.length }, keepEmpty: true };
  }

  // ---- 고등: 소단원 묶음표 ----
  function highUnit(unit) {
    const scope = groupsIndex && groupsIndex.get(unit.key);
    if (!scope) return null;
    const sectionIndex = name => { const at = scope.sections.indexOf(name); return at < 0 ? 999 : at; };
    const prefix = new RegExp(`^SG:[^:]+:${unit.key.replace(/[^\w]/g, '\\$&')}:`);
    const byKey = new Map();
    const shown = [];
    let hasOther = false;
    for (const group of scope.groups) {
      const keys = (group.keys || []).map(item => item.subUnitKey).filter(Boolean);
      const childKey = String(group.groupKey || '').replace(prefix, '');
      const showable = (group.kind === 'subunit' || group.kind === 'moved' || group.kind === 'unit_general') && isDisplayableName(group.label) && /^[\w:.\-]+$/.test(childKey);
      if (showable) {
        shown.push({ group, childKey, keys });
        keys.forEach(key => byKey.set(key, childKey));
      } else hasOther = true; // 기타·제외·이름을 못 쓰는 묶음은 "기타" 한 줄로 모은다
    }
    const kindRank = { subunit: 0, moved: 1, unit_general: 2 };
    shown.sort((a, b) => kindRank[a.group.kind] - kindRank[b.group.kind] ||
      sectionIndex(a.group.section) - sectionIndex(b.group.section) ||
      String(a.group.label).localeCompare(String(b.group.label), 'ko') || (a.childKey < b.childKey ? -1 : 1));
    // 이름이 겹치면(이동 묶음이 원래 단원 묶음과 같은 이름일 때 등) 구별 문구를 붙인다. 같은 이름은 한 단원에 두 번 나오지 않는다.
    // 원래 단원의 묶음이 먼저 이름을 가지고, 이동 묶음이 뒤에 구별 문구를 받는다.
    const names = new Set([HIGH_OTHER_NAME]);
    const nameOf = new Map();
    const claim = (item, suffix) => {
      const label = String(item.group.label).trim();
      let name = names.has(label) && suffix ? label + suffix : label;
      for (let n = 2; names.has(name); n += 1) name = `${label}${suffix || ''} (${n})`;
      names.add(name);
      nameOf.set(item, name);
    };
    shown.filter(item => item.group.kind !== 'moved').forEach(item => claim(item, ''));
    shown.filter(item => item.group.kind === 'moved').forEach(item => claim(item, MOVED_SUFFIX));
    const children = shown.map((item, index) => ({
      key: item.childKey, name: nameOf.get(item), section: item.group.section || '', parentKey: item.group.groupKey, rank: index,
      kind: item.group.kind === 'unit_general' ? 'general' : item.group.kind === 'moved' ? 'moved' : 'subunit'
    }));
    const assign = record => byKey.get(Core.getSubUnitKey(record)) || NONE_KEY;
    return { children, assign, noneChild: { key: NONE_KEY, name: HIGH_OTHER_NAME, kind: 'other', section: '', parentKey: '', rank: children.length }, keepEmpty: false, hasOther };
  }

  // ---- 트리 만들기 ----
  // units: 단원 목록 [{ key, name, course, selectableRecords? }] (보통 core.buildCatalog(...).units).
  // 반환: 단원마다 children(목차 순서) + 문항의 중단원/소단원 키를 정하는 childKeyOf.
  // 문항이 하나도 없는 고등 묶음과 문항이 없는 "미지정/기타" 줄은 목록에서 뺀다. 중등 중단원은 문항이 0이어도 모두 보인다(목차이므로).
  function createTree(profileId, units, options = {}) {
    if (options.groups) setGroups(options.groups);
    const profile = Core.getProfile(profileId);
    const middle = String(profile.id).startsWith('m');
    const entries = new Map();
    const list = [];
    for (const unit of Array.isArray(units) ? units : []) {
      const built = middle ? (Toc ? middleUnit(profile, unit) : null) : highUnit(unit);
      const cache = new WeakMap();
      const records = Array.isArray(unit.selectableRecords) ? unit.selectableRecords : (Array.isArray(unit.records) ? unit.records : null);
      let children = [];
      const entry = { unit, built, cache, children, byKey: new Map() };
      if (built) {
        const keyOf = record => {
          if (!record || typeof record !== 'object') return built.assign(record);
          let key = cache.get(record);
          if (key === undefined) { key = built.assign(record); cache.set(record, key); }
          return key;
        };
        entry.keyOf = keyOf;
        const counts = new Map();
        if (records) for (const record of records) counts.set(keyOf(record), (counts.get(keyOf(record)) || 0) + 1);
        children = built.children.filter(child => built.keepEmpty || !records || counts.get(child.key) > 0);
        if (!records || counts.get(NONE_KEY) > 0) children.push(built.noneChild);
        children = children.map((child, index) => ({ ...child, rank: index, count: counts.get(child.key) || 0 }));
      }
      entry.children = children;
      entry.byKey = new Map(children.map(child => [child.key, child]));
      entries.set(unit.key, entry);
      list.push({ key: unit.key, name: unit.name, children });
    }
    const entryOf = unitKey => entries.get(unitKey);
    return {
      profileId: profile.id,
      source: middle ? 'rpm-toc' : (groupsLoaded() ? 'subunit-groups' : 'none'),
      groupsMissing: !middle && !groupsLoaded(),
      units: list,
      hasChildren: unitKey => Boolean(entryOf(unitKey) && entryOf(unitKey).children.length),
      childrenOf: unitKey => (entryOf(unitKey) ? entryOf(unitKey).children : []),
      childKeyOf(unitKey, record) {
        const entry = entryOf(unitKey);
        return entry && entry.keyOf ? entry.keyOf(record) : '';
      },
      childName(unitKey, childKey) {
        const entry = entryOf(unitKey);
        const child = entry && entry.byKey.get(childKey);
        return child ? child.name : '';
      },
      childRank(unitKey, childKey) {
        const entry = entryOf(unitKey);
        const child = entry && entry.byKey.get(childKey);
        return child ? child.rank : 9999;
      },
      // 화면·권 제목에 쓰는 "평면도형 › 원과 부채꼴"
      pathLabel(unitKey, childKey) {
        const entry = entryOf(unitKey);
        const name = entry ? entry.unit.name : '';
        const child = this.childName(unitKey, childKey);
        return child ? `${name} › ${child}` : name;
      }
    };
  }

  return {
    NONE_KEY, MIDDLE_NONE_NAME, HIGH_OTHER_NAME, GROUPS_URL,
    setGroups, loadGroups, groupsLoaded, resetGroups, isDisplayableName,
    scopeKey, parseCellKey, createTree
  };
});
