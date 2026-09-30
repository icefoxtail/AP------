(function () {
  "use strict";
  const RUNTIME_URLS = [
    "data/meta-foundation/runtime/geometry-equations-v1.json",
    "data/meta-foundation/runtime/sets-propositions-v1.json",
    "data/meta-foundation/runtime/functions-graphs-v1.json",
    "data/meta-foundation/runtime/limit-continuity-v1.json",
    "data/meta-foundation/runtime/integral-calculus-v1.json",
    "data/meta-foundation/runtime/derivative-v1.json",
    "data/meta-foundation/runtime/probability-statistics-v1.json",
    "data/meta-foundation/runtime/middle-geometry-v1.json",
    "data/meta-foundation/runtime/middle1-v1.json",
    "data/meta-foundation/runtime/h1-foundation-v1.json"
  ];
  // TODO: publish runtime file paths in the ACTIVE registry before replacing this list.
  const TAXONOMY_URL = "data/meta-foundation/compiled/taxonomy_registry.json";
  const FOUNDATION_OVERRIDE_FIELDS = [
    "curriculumKey","courseKey","L1","L2","L3","L4",
    "standardCourse","standardUnitKey","standardUnit","standardUnitOrder",
    "subUnitKey","problemTypeKey","templateKey",
    "crossConceptKeys","secondaryConceptKeys","conditionKeys","integrationPattern",
    "curriculumApplicability","defaultSelectable",
    "difficultyConfidence","difficultyBoundaryFlag","legacyLevelCompatibility",
    "reviewStatus","metadataStatus","metadataRevision",
    "metaFoundationStatus","metaFoundationPackId","metaFoundationPackVersion",
    "metaFoundationCurriculumApplicability"
  ];
  const H1_FOUNDATION_OVERRIDE_FIELDS = [
    "l3Disposition","l4Disposition","semanticDisposition","foundationTaxonomyStatus",
    "metaFoundationHoldReason"
  ];
  const text = value => String(value == null ? "" : value).trim();
  const normalizeFile = value => {
    let file = text(value).split("\\").join("/");
    if (file.startsWith("./")) file = file.slice(2);
    while (file.startsWith("/")) file = file.slice(1);
    if (file.startsWith("archive/exams/")) file = file.slice("archive/exams/".length);
    if (file.startsWith("exams/")) file = file.slice("exams/".length);
    const marker = file.search(/[?#]/);
    return marker >= 0 ? file.slice(0, marker) : file;
  };
  const meaningful = value => value !== undefined && value !== null && (Array.isArray(value) || text(value) !== "");
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  let runtime = null;
  let inputBundle = null;
  let finalCatalog = null;
  let finalByUid = new Map();
  let overlayByUid = new Map();
  let overlayBySource = new Map();

  function overlayLookup(ref) {
    const value = ref || {};
    const uid = text(value.questionUid || value.sourceQuestionUid || value.source_question_uid);
    if (uid && overlayByUid.has(uid)) return overlayByUid.get(uid);
    const file = normalizeFile(value.sourceArchiveFile || value.sourceFile || value._sourceFile);
    const ordinal = Number(value.sourceOrdinal || value.sourceQuestionOrdinal || value._sourceQuestionOrdinal);
    if (file && Number.isInteger(ordinal) && ordinal > 0) return overlayBySource.get(file + "#" + ordinal) || null;
    return null;
  }

  function legacyCompatibleMetadata(base, overlay) {
    if (!overlay) return base;
    const resolved = finalByUid.get(text(overlay.questionUid));
    if (!resolved || !window.Archive2Canonical.validateBasicAssignment(resolved, finalCatalog?.canonicalAuthority).ok)
      return base;
    const merged = { ...(base || {}), ...resolved };
    const legacyDifficulty = base && base.difficultyBucket;
    merged.metaFoundationDifficultyBucket = resolved.difficultyBucket;
    if (meaningful(legacyDifficulty)) merged.difficultyBucket = legacyDifficulty;
    if (window.getArchiveSubUnitLabel && resolved.subUnitKey) {
      merged.subUnit = window.getArchiveSubUnitLabel(resolved.subUnitKey, base && base.subUnit);
    }
    return merged;
  }

  function installMetadataBridge(baseData, baseGet, baseMerge) {
    const baseRecords = Array.isArray(baseData && baseData.records) ? baseData.records : [];
    const baseByUid = new Map(baseRecords.map(record => [record.questionUid, record]));
    const mergedRecords = baseRecords.map(record => legacyCompatibleMetadata(record, overlayByUid.get(record.questionUid)));
    for (const overlay of runtime.records || []) {
      if (!baseByUid.has(overlay.questionUid)) mergedRecords.push(legacyCompatibleMetadata(null, overlay));
    }
    const mergedByUid = new Map(mergedRecords.map(record => [record.questionUid, record]));
    const mergedBySource = new Map(mergedRecords.map(record => [normalizeFile(record.sourceArchiveFile) + "#" + Number(record.sourceOrdinal), record]));

    window.ARCHIVE_QUESTION_METADATA = {
      ...(baseData || {}),
      records: mergedRecords,
      metaFoundationRuntime: {
        runtimeVersion: runtime.runtimeVersion,
        packId: runtime.packId,
        packVersion: runtime.packVersion,
        counts: runtime.counts,
        packs: runtime.packs || []
      }
    };
    window.getArchiveQuestionMetadata = function (ref) {
      const value = ref || {};
      const uid = text(value.questionUid || value.sourceQuestionUid || value.source_question_uid);
      if (uid && mergedByUid.has(uid)) return mergedByUid.get(uid);
      const file = normalizeFile(value.sourceArchiveFile || value.sourceFile || value._sourceFile);
      const ordinal = Number(value.sourceOrdinal || value.sourceQuestionOrdinal || value._sourceQuestionOrdinal);
      if (file && Number.isInteger(ordinal) && ordinal > 0) return mergedBySource.get(file + "#" + ordinal) || null;
      return typeof baseGet === "function" ? baseGet(ref) : null;
    };
    window.mergeArchiveQuestionMetadata = function (question, ref) {
      const original = question || {};
      const merged = typeof baseMerge === "function" ? baseMerge(original, ref) : { ...original };
      const overlay = overlayLookup({
        ...(ref || {}),
        questionUid: (ref && (ref.questionUid || ref.sourceQuestionUid)) || original.questionUid || original.source_question_uid,
        sourceArchiveFile: (ref && (ref.sourceArchiveFile || ref.sourceFile)) || original._sourceFile || original.sourceFile,
        sourceOrdinal: (ref && (ref.sourceOrdinal || ref.sourceQuestionOrdinal)) || original._sourceQuestionOrdinal || original.sourceOrdinal
      });
      if (!overlay) return merged;
      const conflicts = { ...(merged._archiveMetadataConflicts || {}) };
      const resolved = finalByUid.get(text(overlay.questionUid));
      if (!resolved || !window.Archive2Canonical.validateBasicAssignment(resolved, finalCatalog?.canonicalAuthority).ok)
        return merged;
      const overrideFields = resolved.metaFoundationPackId === "H1_FOUNDATION"
        ? FOUNDATION_OVERRIDE_FIELDS.concat(H1_FOUNDATION_OVERRIDE_FIELDS)
        : FOUNDATION_OVERRIDE_FIELDS;
      for (const field of overrideFields) {
        const value = resolved[field];
        if (!meaningful(value) && value !== false && value !== 0) continue;
        if (meaningful(merged[field]) && !same(merged[field], value)) conflicts[field] = { source: merged[field], metadata: value };
        merged[field] = value;
      }
      merged.metaFoundationDifficultyBucket = resolved.difficultyBucket;
      if (window.getArchiveSubUnitLabel && resolved.subUnitKey) merged.subUnit = window.getArchiveSubUnitLabel(resolved.subUnitKey, merged.subUnit);
      merged._archiveMetadata = legacyCompatibleMetadata(window.getArchiveQuestionMetadata(ref), overlay);
      merged._metaFoundation = resolved;
      if (Object.keys(conflicts).length) {
        merged._archiveMetadataConflicts = conflicts;
        merged._archiveMetadataMergeStatus = "FOUNDATION_RUNTIME_OVERRIDE";
      }
      return merged;
    };
    return window.ARCHIVE_QUESTION_METADATA;
  }

  function applyCatalogOverlay(catalog) {
    if (!inputBundle || !finalCatalog) throw new Error("Archive 2.0 canonical projection unavailable");
    const bundledCatalog = inputBundle.resources["data/archive2-catalog.json"];
    if (catalog && (
      catalog.indexVersion !== bundledCatalog.indexVersion ||
      catalog.identityDigest !== bundledCatalog.identityDigest
    ))
      throw new Error("CANONICAL_PROJECTION_REFRESH_REQUIRED: catalog/version bundle mismatch");
    return finalCatalog;
  }

  const baseReady = window.__ARCHIVE_METADATA_READY__;
  const baseGet = window.getArchiveQuestionMetadata;
  const baseMerge = window.mergeArchiveQuestionMetadata;
  const runtimeReady = window.Archive2Canonical.loadInputBundle(
    (url) => fetch(url, { cache: "no-cache" }),
    document.baseURI,
  ).then((bundle) => {
    inputBundle = bundle;
    const resources = bundle.resources;
    const packs = RUNTIME_URLS.map((runtimeUrl) => {
      const data = resources[runtimeUrl];
      if (!data || data.status !== "ACTIVE" || !Array.isArray(data.records))
        throw new Error("Meta Foundation runtime invalid: " + runtimeUrl);
      return data;
    });
    const taxonomy = resources[TAXONOMY_URL];
    if (taxonomy?.status !== "DERIVED_READ_ONLY" || !Array.isArray(taxonomy.problemTypes) || !Array.isArray(taxonomy.templates))
      throw new Error("Meta Foundation taxonomy invalid");
    const basicScopeLinks = resources["data/basic-scope-parent-links.json"];
    if (basicScopeLinks?.schemaVersion !== "archive2-basic-scope-parent-links-v1" ||
        basicScopeLinks.status !== "DERIVED_READ_ONLY" || !Array.isArray(basicScopeLinks.records))
      throw new Error("Basic scope parent links invalid");
    const basicScopeData = {
      records: (basicScopeLinks.records || []).concat(basicScopeLinks.sourceParents || []),
      groups: basicScopeLinks.groups || [],
    };
    const uniqueRows = (rows, fields) => {
      const seen = new Set();
      return rows.filter(row => {
        const key = fields.map(field => String(row[field] ?? "")).join("|");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    const records = packs.flatMap(pack => pack.records || []);
    const taxonomyRows = uniqueRows(
      packs.flatMap(pack => pack.taxonomyRows || []),
      ["curriculumKey","courseKey","L1","L2","problemTypeKey","templateKey"]
    );
    const ownedScopes = uniqueRows(
      packs.flatMap(pack => pack.ownedScopes || []),
      ["curriculumKey","courseKey","L1","L2"]
    );
    const byUid = new Map(records.map(record => [record.questionUid, record]));
    const bySource = new Map(records.map(record => [
      normalizeFile(record.sourceArchiveFile) + "#" + Number(record.sourceOrdinal),
      record
    ]));
    if (byUid.size !== records.length || bySource.size !== records.length) {
      throw new Error("Meta Foundation multi-pack duplicate join key");
    }
    runtime = {
      schemaVersion: "meta-foundation-runtime-overlay-bundle-v1",
      status: "ACTIVE",
      runtimeVersion: "META_FOUNDATION_MULTI/runtime-bridge-v5:" + packs.map(pack => pack.runtimeVersion).join("+"),
      packId: "MULTI_PACK",
      packVersion: packs.map(pack => pack.packId + "@" + pack.packVersion).join("+"),
      packs: packs.map(pack => ({
        packId: pack.packId,
        packVersion: pack.packVersion,
        runtimeVersion: pack.runtimeVersion,
        counts: pack.counts
      })),
      records,
      basicScopeLinks: basicScopeData.records,
      basicScopeGroups: basicScopeData.groups,
      taxonomyRows,
      ownedScopes,
      counts: {
        records: records.length,
        taxonomyRows: taxonomyRows.length,
        defaultSelectable: packs.reduce((sum, pack) => sum + Number(pack.counts?.defaultSelectable ?? pack.records.filter(row => row.defaultSelectable === true).length), 0),
        supplementary: packs.reduce((sum, pack) => sum + Number(pack.counts?.supplementary || 0), 0),
        automaticEligibleExpected: packs.reduce((sum, pack) => sum + Number(pack.counts?.automaticEligibleExpected ?? pack.counts?.runtimeSelectable ?? 0), 0),
        sourceHold: packs.reduce((sum, pack) => sum + Number(pack.counts?.sourceHold || 0), 0)
      }
    };
    overlayByUid = byUid;
    overlayBySource = bySource;
    window.ARCHIVE_META_FOUNDATION_LABELS = {
      problemTypes: Object.fromEntries(taxonomy.problemTypes.filter(row => row.status === "ACTIVE").map(row => [row.problemTypeKey, row.canonicalLabelKo])),
      templates: Object.fromEntries(taxonomy.templates.filter(row => row.status === "ACTIVE").map(row => [row.templateKey, { label: row.canonicalLabelKo, parentProblemTypeKey: row.parentProblemTypeKey }]))
    };
    window.ARCHIVE_META_FOUNDATION_RUNTIMES = packs;
    window.ARCHIVE_META_FOUNDATION_RUNTIME = runtime;
    finalCatalog = window.Archive2Canonical.resolveCatalog({ versionBundle: bundle });
    finalCatalog.health = {
      ...(finalCatalog.health || {}),
      automatic: finalCatalog.records.filter((record) =>
        window.Archive2Core.basicEligibility(record, { canonicalAuthority: finalCatalog.canonicalAuthority }).ok,
      ).length,
    };
    finalByUid = new Map(finalCatalog.records.filter((record) => record.questionUid)
      .map((record) => [record.questionUid, record]));
    window.ARCHIVE2_FINAL_CATALOG = finalCatalog;
    return runtime;
  });
  window.__META_FOUNDATION_RUNTIME_READY__ = runtimeReady;

  if (baseReady && typeof baseReady.then === "function") {
    window.__ARCHIVE_METADATA_READY__ = Promise.all([baseReady, runtimeReady])
      .then(([baseData]) => installMetadataBridge(baseData, baseGet, baseMerge))
      .catch(error => {
        console.error("[meta-foundation] runtime bridge failed:", error);
        throw error;
      });
  }

  window.applyArchiveMetaFoundationCatalog = async function (catalog) {
    await runtimeReady;
    return applyCatalogOverlay(catalog);
  };
})();
