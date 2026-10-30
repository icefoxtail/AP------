(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2KeyResolver = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // S14b (user direction 2026-10-29): canonical keys (PT/TPL, concept, condition, RPM L1-L4) and the
  // Generated-only EXTENSION keys (EXT-L3 / EXT-L4 / EXT-COND / EXT-CROSS / EXT-CC / EXT-TPL) are
  // presented to filters, selection and the inspector as ONE read-only tree with a small
  // 정식 / 확장 badge. Physical consolidation (promotion, alias, rename) is a later decision.
  //
  // Contract
  //  * READ ONLY. The resolver never writes: it builds frozen views over data that the caller hands
  //    in. Canonical registries and RPM LOCKED values are inputs, never outputs.
  //  * An extension key is only ever described on a GENERATED item. An extension key that shows up on
  //    an original exam item is reported as a violation and is not resolved (never attached).
  //  * A curriculum is never converted: a label match honours the definition's own curriculum.
  //  * No review/quality gate: every defined or carried extension key is shown; its status is a
  //    label (`tier`), not an exclusion.
  //  * Lazy: nothing here runs on the first-click path. `load()` is called after first paint.
  const VERSION = "ARCHIVE2_KEY_RESOLVER_V1_20261030";
  const EXTENSION_INDEX_URL = "data/archive2-extension-keys.json";
  const EXTENSION_INDEX_SCHEMA = "archive2-extension-keys-v1";
  const CANONICAL_URLS = Object.freeze({
    taxonomy: "data/meta-foundation/compiled/taxonomy_registry.json",
    concepts: "data/meta-foundation/compiled/concept_registry.json",
    conditions: "data/meta-foundation/compiled/condition_registry.json",
  });
  const CROSSWALK_DIR = "data/meta-foundation/crosswalks/rpm-primary-v1.0/";
  const CROSSWALK_FILE_BY_PREFIX = Object.freeze({
    H1: "high1.json", "H2-CALC": "high2-calculus-calculus2.json", "H2-GEO": "high2-geometry.json",
    "H2-M1": "high2-math1-algebra.json", "H2-M2": "high2-math2-calculus1.json",
    "H2-PS": "high2-probability-statistics.json", M1: "middle1.json", M2: "middle2.json", M3: "middle3.json",
  });
  const BADGE = Object.freeze({ canonical: "정식", extension: "확장" });
  const KIND_LABEL = Object.freeze({
    pt: "문항 유형", tpl: "풀이 유형", cross: "연결 개념", cond: "조건", l3: "개념(L3)", l4: "세부 유형(L4)",
  });
  // item field -> key kind
  const KEY_FIELDS = Object.freeze({
    problemTypeKey: "pt", templateKey: "tpl", crossConceptKeys: "cross", conditionKeys: "cond",
    secondaryConceptKeys: "cross", rpmL4: "l4", L4: "l4", rpmL3: "l3",
  });
  const EXTENSION_ONLY_FIELDS = Object.freeze({ generatedExtL4Id: "l4", extensionL4Id: "l4", extensionL3Id: "l3", generatedL4: "l4" });

  const text = (value) => (value == null ? "" : String(value)).trim();
  const array = (value) => (Array.isArray(value) ? value : value == null ? [] : [value]);
  const isExtensionKey = (value) => typeof value === "string" && /^EXT-/.test(value.trim());
  // Generated variant labels often start with the slot id ("B3 근호 정의역 조건 확장").
  const SLOT_PREFIX = /^\s*[A-C]\d\s+/;

  function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      for (const item of Object.values(value)) deepFreeze(item);
    }
    return value;
  }

  // "L3-1.3.3|원의 접선" / "EXT-H1-...|접촉현 거리 역조건": generated rows store key and label together.
  function splitKeyLabel(value) {
    const raw = text(value);
    const pipe = raw.indexOf("|");
    if (pipe <= 0) return { key: raw, label: "" };
    return { key: raw.slice(0, pipe).trim(), label: raw.slice(pipe + 1).trim() };
  }

  function tierOf(status, canonicalPromoted) {
    const value = text(status).toUpperCase();
    if (/SUPERSEDED/.test(value)) return "superseded";
    if (/CANDIDATE|DISCOVERED|DRAFT|NOT_REVIEWED|BRANCH_ONLY|REVIEW_REQUIRED|NOT_APPROVED|BLOCKED|RECLASSIFIED/.test(value)) return "candidate";
    return canonicalPromoted ? "promoted" : "active";
  }

  function normalizedLabel(value) {
    return text(value).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  }
  function bigrams(value) {
    const out = new Map();
    for (let i = 0; i < value.length - 1; i += 1) {
      const gram = value.slice(i, i + 2);
      out.set(gram, (out.get(gram) || 0) + 1);
    }
    return out;
  }
  function dice(a, b) {
    if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
    const left = bigrams(a);
    const right = bigrams(b);
    let overlap = 0;
    for (const [gram, count] of left) overlap += Math.min(count, right.get(gram) || 0);
    return (2 * overlap) / (a.length - 1 + (b.length - 1));
  }

  function create(sources = {}) {
    const warnings = [];
    const nodes = new Map(); // key -> node (canonical and extension)
    const childLists = new Map(); // parent key -> [child key]
    const l3Nodes = new Map(); // l3 node key -> node
    const l3ByLabel = new Map(); // normalized label -> [l3 node]
    const recordToL3 = new Map(); // RPM record id -> l3 node key
    const recordInfo = new Map(); // RPM record id -> record summary
    const aliasIndex = new Map(); // normalized label/alias -> [canonical node key]

    const addChild = (parentKey, childKey) => {
      if (!parentKey || !childKey) return;
      const list = childLists.get(parentKey) || [];
      if (!list.includes(childKey)) list.push(childKey);
      childLists.set(parentKey, list);
    };
    const indexAlias = (nodeKey, kind, labels) => {
      for (const label of labels) {
        const norm = normalizedLabel(label);
        if (!norm) continue;
        const bucket = `${kind}:${norm}`;
        const list = aliasIndex.get(bucket) || [];
        if (!list.includes(nodeKey)) list.push(nodeKey);
        aliasIndex.set(bucket, list);
      }
    };

    // ---- canonical keys (read from the compiled, DERIVED_READ_ONLY registries) ----
    const addCanonical = (kind, key, label, extra = {}) => {
      if (!key || nodes.has(key)) return;
      const aliases = array(extra.aliases).map(text).filter(Boolean);
      nodes.set(key, {
        key, kind, origin: "canonical", badge: BADGE.canonical, label: text(label) || key,
        aliases, status: text(extra.status) || "ACTIVE", tier: "active", defined: true,
        parentKey: extra.parentKey || null,
      });
      indexAlias(key, kind, [label, ...aliases]);
      if (extra.parentKey) addChild(extra.parentKey, key);
    };
    for (const row of array(sources.taxonomy?.problemTypes))
      addCanonical("pt", row.problemTypeKey, row.canonicalLabelKo, row);
    for (const row of array(sources.taxonomy?.templates))
      addCanonical("tpl", row.templateKey, row.canonicalLabelKo, { ...row, parentKey: row.parentProblemTypeKey });
    for (const row of array(sources.concepts?.concepts))
      addCanonical("cross", row.conceptKey, row.canonicalLabelKo, row);
    for (const row of array(sources.conditions?.conditions))
      addCanonical("cond", row.conditionKey, row.canonicalLabelKo, row);
    const canonicalCount = nodes.size;

    // ---- RPM L1-L4 (active crosswalk records; LOCKED values are only read) ----
    for (const crosswalk of array(sources.rpmCrosswalks)) {
      for (const record of array(crosswalk?.records)) {
        const id = text(record.id);
        const path = record.rpmPath || {};
        const l3 = text(path.l3);
        if (!id || !l3) continue;
        const key = `l3:${text(record.curriculum)}|${text(record.standardCourse)}|${text(path.majorUnit)}|${text(path.midUnit)}|${l3}`;
        let node = l3Nodes.get(key);
        if (!node) {
          node = {
            key, kind: "l3", origin: "canonical", badge: BADGE.canonical, label: l3, defined: true, tier: "active",
            curriculum: text(record.curriculum), standardCourse: text(record.standardCourse),
            majorUnit: text(path.majorUnit), midUnit: text(path.midUnit), standardUnitKey: text(record.standardUnitKey),
            recordIds: [], l4Labels: [], ptKeys: [], tplKeys: [],
          };
          l3Nodes.set(key, node);
          nodes.set(key, node);
          const norm = normalizedLabel(l3);
          const bucket = l3ByLabel.get(norm) || [];
          bucket.push(node);
          l3ByLabel.set(norm, bucket);
        }
        node.recordIds.push(id);
        if (text(path.l4) && !node.l4Labels.includes(text(path.l4))) node.l4Labels.push(text(path.l4));
        if (record.problemTypeKey && !node.ptKeys.includes(record.problemTypeKey)) node.ptKeys.push(record.problemTypeKey);
        if (record.templateKey && !node.tplKeys.includes(record.templateKey)) node.tplKeys.push(record.templateKey);
        recordToL3.set(id, key);
        recordInfo.set(id, {
          id, l3, l4: text(path.l4), curriculum: text(record.curriculum), problemTypeKey: text(record.problemTypeKey),
          templateKey: text(record.templateKey), mappingStatus: text(record.mappingStatus),
        });
      }
    }
    const l3Count = l3Nodes.size;

    // ---- extension keys ----
    const definitions = array(sources.extensions?.definitions);
    const extensionKeys = [];
    for (const definition of definitions) {
      const key = text(definition.key);
      if (!isExtensionKey(key) || nodes.has(key)) {
        if (nodes.has(key)) warnings.push(`EXTENSION_KEY_COLLIDES_WITH_EXISTING_NODE:${key}`);
        continue;
      }
      const refs = definition.parentRefs || {};
      const node = {
        key, kind: definition.kind, origin: "extension", badge: BADGE.extension,
        label: text(definition.label) || key, definition: text(definition.definition) || undefined,
        status: text(definition.status) || undefined, tier: tierOf(definition.status, definition.canonicalPromoted),
        canonicalPromoted: definition.canonicalPromoted === true, defined: true,
        curriculum: text(definition.curriculum) || undefined,
        uidCount: definition.uidCount || 0, file: definition.file, files: definition.files,
        kindBasis: definition.kindBasis, parentRefs: refs,
        labelConflicts: definition.labelConflicts, kindConflicts: definition.kindConflicts,
        parentKey: null, anchorKey: null, parentStatus: "NONE", canonicalPtKey: null, canonicalTplKey: null,
      };
      nodes.set(key, node);
      extensionKeys.push(key);
    }

    const resolveLabel = (label, curriculum) => {
      const matches = l3ByLabel.get(normalizedLabel(label)) || [];
      const scoped = curriculum ? matches.filter((node) => node.curriculum === curriculum) : matches;
      return scoped;
    };

    // Parents are resolved in a second pass: an L4 may name an extension L3 defined later.
    const resolveParent = (node, depth = 0) => {
      const refs = node.parentRefs || {};
      let anchor = null;
      let status = "NONE";
      const records = array(refs.recordIds);
      for (const id of records) {
        const l3 = recordToL3.get(id);
        if (l3) { anchor = nodes.get(l3); status = "RECORD"; node.anchorRecordId = id; break; }
      }
      if (!anchor && records.length) status = "RECORD_UNKNOWN";
      let extParent = null;
      for (const key of array(refs.extParents)) {
        const parent = nodes.get(key);
        if (parent && parent !== node && parent.origin === "extension") { extParent = parent; break; }
      }
      if (!anchor && extParent && depth < 5) {
        if (!extParent.anchorResolved) resolveParent(extParent, depth + 1);
        anchor = extParent.anchorKey ? nodes.get(extParent.anchorKey) : null;
        status = anchor ? "EXT_PARENT" : "EXT_PARENT_NO_ANCHOR";
      }
      if (!anchor && !extParent) {
        for (const label of array(refs.l3Labels)) {
          const matches = resolveLabel(label, node.curriculum);
          if (matches.length === 1) { anchor = matches[0]; status = "LABEL"; break; }
          if (matches.length > 1) {
            // Same L3 label under several units: the definition's own standard unit decides, never a guess.
            const units = new Set(array(refs.unitKeys).map((unit) => unit.split("-").slice(0, 3).join("-")));
            const byUnit = matches.filter((item) => units.has(item.standardUnitKey));
            if (byUnit.length === 1) { anchor = byUnit[0]; status = "LABEL_UNIT"; break; }
            status = "LABEL_AMBIGUOUS";
            node.ambiguousAnchors = matches.map((item) => item.key);
          } else if (status === "NONE") status = "LABEL_UNRESOLVED";
        }
      }
      if (!anchor && !extParent && status === "NONE" && array(refs.l3Codes).length) status = "CODE_ONLY";
      node.parentStatus = status;
      node.anchorKey = anchor ? anchor.key : null;
      node.anchorResolved = true;
      // Canonical PT / TPL context: explicit key first, then what the RPM crosswalk binds.
      const pick = (explicit, fromAnchor) => {
        for (const key of array(explicit)) { const canonical = nodes.get(key); if (canonical?.origin === "canonical") return key; }
        for (const key of array(fromAnchor)) { const canonical = nodes.get(key); if (canonical?.origin === "canonical") return key; }
        return null;
      };
      const recordPt = node.anchorRecordId ? [recordInfo.get(node.anchorRecordId)?.problemTypeKey] : [];
      const recordTpl = node.anchorRecordId ? [recordInfo.get(node.anchorRecordId)?.templateKey] : [];
      node.canonicalPtKey = pick(refs.ptKeys, recordPt);
      node.canonicalTplKey = pick(refs.tplKeys, recordTpl);
      node.unresolvedCanonicalRefs = [...array(refs.ptKeys), ...array(refs.tplKeys)].filter((key) => !nodes.has(key));
      // The single parent used for the tree: ext L3 > canonical PT (for a template) > RPM L3 anchor.
      if (extParent) node.parentKey = extParent.key;
      else if (node.kind === "tpl" && node.canonicalPtKey) node.parentKey = node.canonicalPtKey;
      else if (anchor) node.parentKey = anchor.key;
      else node.parentKey = null;
    };
    for (const key of extensionKeys) resolveParent(nodes.get(key));
    for (const key of extensionKeys) {
      const node = nodes.get(key);
      if (node.parentKey) addChild(node.parentKey, key);
      const anchor = node.anchorKey ? nodes.get(node.anchorKey) : null;
      const underPt = anchor && node.parentKey && array(anchor.ptKeys).includes(node.parentKey);
      if (anchor && anchor.key !== node.parentKey && !underPt) addChild(anchor.key, key);
    }
    for (const node of l3Nodes.values()) {
      for (const key of node.ptKeys) addChild(node.key, key);
    }

    // ---- views ----
    const view = (node) => {
      if (!node) return null;
      const parent = node.parentKey ? nodes.get(node.parentKey) : null;
      const anchor = node.anchorKey ? nodes.get(node.anchorKey) : null;
      return {
        key: node.key, kind: node.kind, origin: node.origin, badge: node.badge, label: node.label,
        definition: node.definition, status: node.status, tier: node.tier, defined: node.defined !== false,
        curriculum: node.curriculum,
        parent: parent ? { key: parent.key, kind: parent.kind, origin: parent.origin, label: parent.label } : null,
        anchor: anchor ? { key: anchor.key, label: anchor.label, curriculum: anchor.curriculum, recordIds: anchor.recordIds } : null,
        parentStatus: node.parentStatus, canonicalPtKey: node.canonicalPtKey || undefined, canonicalTplKey: node.canonicalTplKey || undefined,
        uidCount: node.uidCount,
      };
    };

    const lookup = (key) => {
      const value = text(key);
      return view(nodes.get(value) || null);
    };
    const originOf = (key) => nodes.get(text(key))?.origin || (isExtensionKey(key) ? "extension" : "unknown");
    const badgeOf = (key) => nodes.get(text(key))?.badge || (isExtensionKey(key) ? BADGE.extension : "");
    const labelOf = (key) => nodes.get(text(key))?.label || "";
    const parentOf = (key) => {
      const node = nodes.get(text(key));
      return node?.parentKey ? view(nodes.get(node.parentKey)) : null;
    };
    const ancestorsOf = (key) => {
      const chain = [];
      const seen = new Set();
      let node = nodes.get(text(key));
      while (node?.parentKey && !seen.has(node.parentKey)) {
        seen.add(node.parentKey);
        node = nodes.get(node.parentKey);
        if (!node) break;
        chain.push(view(node));
      }
      return chain;
    };
    const childrenOf = (key) => array(childLists.get(text(key))).map((child) => view(nodes.get(child))).filter(Boolean);

    // One tree over canonical + extension keys: RPM L3 -> (PT -> TPL, ext L4/COND/CROSS/TPL).
    function tree(options = {}) {
      const result = [];
      const byLabel = (a, b) => a.label.localeCompare(b.label, "ko") || a.key.localeCompare(b.key);
      const branch = (key, seen) => {
        if (seen.has(key)) return null;
        const node = nodes.get(key);
        if (!node) return null;
        const next = new Set(seen).add(key);
        const children = array(childLists.get(key)).map((child) => branch(child, next)).filter(Boolean).sort(byLabel);
        return { ...view(node), children };
      };
      for (const node of [...l3Nodes.values()].sort((a, b) => a.label.localeCompare(b.label, "ko") || a.key.localeCompare(b.key))) {
        if (options.curriculum && node.curriculum !== options.curriculum) continue;
        const children = array(childLists.get(node.key));
        const hasExtension = children.some((child) => nodes.get(child)?.origin === "extension") ||
          children.some((child) => array(childLists.get(child)).some((grand) => nodes.get(grand)?.origin === "extension"));
        if (options.extensionOnly && !hasExtension) continue;
        result.push(branch(node.key, new Set()));
      }
      return deepFreeze(result);
    }

    // Filter/option helper: { value, count } entries (the caller counts over its own rows) become
    // labelled, badged, parent-grouped options. Unknown values pass through unlabelled.
    function optionsFor(kind, entries) {
      const rows = array(entries).map((entry) => (typeof entry === "string" ? { value: entry, count: undefined } : entry))
        .filter((entry) => text(entry?.value));
      const options = rows.map(({ value, count }) => {
        const { key, label: composed } = splitKeyLabel(value);
        const node = nodes.get(key);
        const extension = node?.origin === "extension" || (!node && isExtensionKey(key));
        const parent = node?.parentKey ? nodes.get(node.parentKey) : null;
        const anchor = node?.anchorKey ? nodes.get(node.anchorKey) : null;
        const group = extension ? (anchor || parent) : null;
        return {
          value, key, count, kind: node?.kind || kind,
          label: node?.label && node.label !== key ? node.label : composed || node?.label || key,
          // An RPM L4 value without an EXT key is a LOCKED RPM label (정식); other unregistered values stay unbadged.
          origin: node?.origin || (extension ? "extension" : kind === "l4" ? "canonical" : "unknown"),
          badge: node?.badge || (extension ? BADGE.extension : kind === "l4" ? BADGE.canonical : ""),
          tier: node?.tier, defined: Boolean(node),
          groupKey: group ? group.key : "", groupLabel: group ? group.label : "",
        };
      });
      options.sort((a, b) => (a.origin === b.origin ? 0 : a.origin === "extension" ? 1 : -1) ||
        a.groupLabel.localeCompare(b.groupLabel, "ko") || a.label.localeCompare(b.label, "ko") || a.value.localeCompare(b.value));
      return deepFreeze(options);
    }

    // Describe the keys carried by one item row. Extension keys are only resolved for generated rows.
    function describe(record) {
      const row = record || {};
      const uid = text(row.uid || row.questionUid || row.generatedUid);
      const generated = row.sourceKind === "generated" || /^ALITE-/.test(uid) || Boolean(row.generatedUid);
      const items = [];
      const violations = [];
      const seen = new Set();
      const push = (field, kind, raw) => {
        const { key, label: composedLabel } = splitKeyLabel(raw);
        if (!key) return;
        const marker = `${kind}|${key}`;
        if (seen.has(marker)) return;
        seen.add(marker);
        const extension = isExtensionKey(key);
        if (extension && !generated) {
          violations.push({ code: "EXTENSION_KEY_ON_ORIGINAL_ITEM", field, key });
          items.push({ field, kind, key, label: composedLabel || key, origin: "blocked", badge: "", defined: false, blocked: true });
          return;
        }
        const node = nodes.get(key);
        const parent = node?.parentKey ? nodes.get(node.parentKey) : null;
        let anchor = node?.anchorKey ? nodes.get(node.anchorKey) : null;
        // A carried key that no extension registry defines is still shown (확장); its parent is then
        // only what the item itself records (its RPM record), marked as inferred.
        let inferredFromItem = false;
        if (!node && extension && !anchor) {
          for (const id of [row.rpmPrimaryRecordId, row.rpmRecordId, row.metaProjection?.rpmPrimaryRecordId]) {
            const l3 = recordToL3.get(text(id));
            if (l3) { anchor = nodes.get(l3); inferredFromItem = true; break; }
          }
        }
        items.push({
          field, kind: node?.kind || kind, key,
          label: node?.label && node.label !== key ? node.label : composedLabel || node?.label || key,
          origin: node ? node.origin : extension ? "extension" : "unknown",
          badge: node ? node.badge : extension ? BADGE.extension : "",
          tier: node?.tier, defined: Boolean(node),
          parentLabel: (anchor || parent)?.label || "", parentKey: (anchor || parent)?.key || "",
          parentInferredFromItem: inferredFromItem || undefined,
        });
      };
      for (const [field, kind] of Object.entries(KEY_FIELDS)) {
        for (const raw of array(row[field])) {
          if (field === "rpmL3" && !isExtensionKey(splitKeyLabel(raw).key)) continue;
          if (field === "rpmL4" || field === "L4") {
            const { key } = splitKeyLabel(raw);
            if (!isExtensionKey(key)) {
              // A canonical RPM L4 is a label, not a registry key: show it as a canonical (정식) value.
              const label = splitKeyLabel(raw).label || text(raw);
              if (label && !seen.has(`l4|${label}`)) {
                seen.add(`l4|${label}`);
                items.push({ field, kind: "l4", key: label, label, origin: "canonical", badge: BADGE.canonical, defined: true, rpmLabel: true });
              }
              continue;
            }
          }
          push(field, kind, raw);
        }
      }
      for (const [field, kind] of Object.entries(EXTENSION_ONLY_FIELDS)) {
        for (const raw of array(row[field])) if (isExtensionKey(splitKeyLabel(raw).key)) push(field, kind, raw);
      }
      const extensionItems = items.filter((item) => item.origin === "extension");
      return deepFreeze({
        uid, generated, items, hasExtension: extensionItems.length > 0, extensionCount: extensionItems.length,
        violations,
      });
    }

    // Consolidation candidates for a later promotion / alias decision. Nothing is merged or renamed.
    function consolidation() {
      const orphans = [];
      const ambiguous = [];
      const duplicatesCanonical = [];
      const duplicatesExtension = [];
      const near = [];
      const sameAfterSlot = [];
      const superseded = [];
      const unresolvedCanonicalRefs = [];
      const byKind = new Map();
      for (const key of extensionKeys) {
        const node = nodes.get(key);
        if (["NONE", "LABEL_UNRESOLVED", "RECORD_UNKNOWN", "CODE_ONLY", "EXT_PARENT_NO_ANCHOR"].includes(node.parentStatus))
          orphans.push({ key, kind: node.kind, label: node.label, status: node.parentStatus, file: node.file, parentRefs: node.parentRefs });
        else if (node.parentStatus === "LABEL_AMBIGUOUS")
          ambiguous.push({ key, kind: node.kind, label: node.label, candidates: node.ambiguousAnchors.map((item) => { const c = nodes.get(item); return `${c.standardCourse} › ${c.majorUnit} › ${c.midUnit} › ${c.label}`; }), file: node.file });
        if (node.unresolvedCanonicalRefs?.length) unresolvedCanonicalRefs.push({ key, refs: node.unresolvedCanonicalRefs, file: node.file });
        if (node.tier === "superseded") superseded.push({ key, kind: node.kind, status: node.status, label: node.label, file: node.file });
        const norm = normalizedLabel(node.label);
        if (norm) {
          const canonicalHits = aliasIndex.get(`${node.kind}:${norm}`) || [];
          for (const hit of canonicalHits)
            duplicatesCanonical.push({ key, kind: node.kind, label: node.label, canonicalKey: hit, canonicalLabel: nodes.get(hit)?.label, file: node.file });
        }
        const list = byKind.get(node.kind) || [];
        list.push({ node, norm });
        byKind.set(node.kind, list);
      }
      for (const list of byKind.values()) {
        const exact = new Map();
        for (const item of list) {
          if (!item.norm) continue;
          const bucket = exact.get(item.norm) || [];
          bucket.push(item.node);
          exact.set(item.norm, bucket);
        }
        const slotless = new Map();
        for (const item of list) {
          const stripped = normalizedLabel(text(item.node.label).replace(SLOT_PREFIX, ""));
          if (!stripped || stripped === item.norm) continue;
          const bucket = slotless.get(stripped) || [];
          bucket.push(item.node);
          slotless.set(stripped, bucket);
        }
        for (const group of slotless.values())
          if (group.length > 1) sameAfterSlot.push({ kind: group[0].kind, label: text(group[0].label).replace(SLOT_PREFIX, ""), keys: group.map((node) => node.key).sort(), files: [...new Set(group.map((node) => node.file))].sort() });
        for (const [norm, group] of exact)
          if (group.length > 1) duplicatesExtension.push({ label: group[0].label, kind: group[0].kind, keys: group.map((node) => node.key).sort(), files: [...new Set(group.map((node) => node.file))].sort(), norm });
        for (let i = 0; i < list.length; i += 1) {
          for (let j = i + 1; j < list.length; j += 1) {
            const a = list[i];
            const b = list[j];
            if (!a.norm || !b.norm || a.norm === b.norm) continue;
            if (a.node.anchorKey !== b.node.anchorKey || !a.node.anchorKey) continue;
            if (normalizedLabel(text(a.node.label).replace(SLOT_PREFIX, "")) === normalizedLabel(text(b.node.label).replace(SLOT_PREFIX, ""))) continue;
            const score = dice(a.norm, b.norm);
            if (score >= 0.8) near.push({ kind: a.node.kind, keys: [a.node.key, b.node.key].sort(), labels: [a.node.label, b.node.label], score: Math.round(score * 100) / 100, anchor: nodes.get(a.node.anchorKey)?.label });
          }
        }
      }
      const byText = (a, b) => (a.key || a.keys?.[0] || "").localeCompare(b.key || b.keys?.[0] || "");
      return deepFreeze({
        orphans: orphans.sort(byText), ambiguous: ambiguous.sort(byText), duplicatesCanonical: duplicatesCanonical.sort(byText),
        duplicatesExtension: duplicatesExtension.sort(byText), sameAfterSlot: sameAfterSlot.sort(byText), near: near.sort(byText), superseded: superseded.sort(byText),
        unresolvedCanonicalRefs: unresolvedCanonicalRefs.sort(byText),
      });
    }

    const stats = deepFreeze({
      version: VERSION, canonicalKeys: canonicalCount, rpmL3Nodes: l3Count, extensionKeys: extensionKeys.length,
      parentLinked: extensionKeys.filter((key) => ["RECORD", "EXT_PARENT", "LABEL", "LABEL_UNIT"].includes(nodes.get(key).parentStatus)).length,
      warnings: [...warnings],
    });
    const extensionKeyList = () => extensionKeys.map((key) => view(nodes.get(key)));
    return Object.freeze({
      VERSION, stats, lookup, originOf, badgeOf, labelOf, parentOf, ancestorsOf, childrenOf, tree, optionsFor, describe,
      consolidation, extensionKeyList, isExtensionKey, warnings: Object.freeze([...warnings]),
    });
  }

  let loading = null;
  // Lazy loader: fetches the canonical registries (already cached by the compose screen), the active
  // RPM crosswalk(s) the extension parents point at, and the derived extension index. It is meant to
  // be called after first paint; every failure degrades to "no badges", never to a broken page.
  function load({ fetchJson, base = "", force = false } = {}) {
    if (loading && !force) return loading;
    const getJson = fetchJson || (async (url) => {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error(`KEY_RESOLVER_FETCH_FAILED:${response.status}:${url}`);
      return response.json();
    });
    const at = (relative) => `${base}${relative}`;
    const optional = (relative) => getJson(at(relative)).catch((error) => ({ __failed: String(error?.message || error) }));
    loading = (async () => {
      const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
      const extensions = await getJson(at(EXTENSION_INDEX_URL));
      if (extensions?.schemaVersion !== EXTENSION_INDEX_SCHEMA) throw new Error("KEY_RESOLVER_EXTENSION_INDEX_SCHEMA");
      const prefixes = new Set();
      for (const definition of array(extensions.definitions))
        for (const id of array(definition.parentRefs?.recordIds)) {
          const match = /^(.*)-RPM-\d+$/.exec(id);
          if (match) prefixes.add(match[1]);
        }
      const crosswalkFiles = [...prefixes].map((prefix) => CROSSWALK_FILE_BY_PREFIX[prefix]).filter(Boolean);
      const [taxonomy, concepts, conditions, ...crosswalks] = await Promise.all([
        optional(CANONICAL_URLS.taxonomy), optional(CANONICAL_URLS.concepts), optional(CANONICAL_URLS.conditions),
        ...crosswalkFiles.map((file) => optional(CROSSWALK_DIR + file)),
      ]);
      const failed = [taxonomy, concepts, conditions, ...crosswalks].filter((item) => item?.__failed).map((item) => item.__failed);
      const usable = (item) => (item?.__failed ? null : item);
      const resolver = create({
        taxonomy: usable(taxonomy), concepts: usable(concepts), conditions: usable(conditions),
        rpmCrosswalks: crosswalks.map(usable).filter(Boolean), extensions,
      });
      const finishedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
      return { resolver, failedSources: failed, elapsedMs: Math.round(finishedAt - startedAt) };
    })();
    loading.catch(() => { loading = null; });
    return loading;
  }

  return Object.freeze({
    VERSION, BADGE, KIND_LABEL, EXTENSION_INDEX_URL, EXTENSION_INDEX_SCHEMA, CANONICAL_URLS,
    create, load, isExtensionKey, splitKeyLabel, normalizedLabel, tierOf,
  });
});
