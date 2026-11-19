(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Canonical = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const RESOLVER_VERSION = "1.1.0";
  const GRADES = new Set(["중1", "중2", "중3", "고1", "고2", "고3"]);
  const APPROVAL_STATES = new Set(["APPROVED", "approved"]);
  const REVIEW_STATES = new Set([
    "PASS",
    "reviewed_pass",
    "PASS_SEMANTIC_REVALIDATION",
  ]);
  const SHA256 = /^[a-f0-9]{64}$/i;
  const text = (value) => String(value ?? "").normalize("NFC").trim();
  const normalizeFile = (value) =>
    text(value)
      .replace(/\\/g, "/")
      .replace(/[?#].*$/, "")
      .replace(/^\/?(?:archive\/)?exams\//, "")
      .replace(/^\/+/, "");
  const gradeRank = (grade) =>
    ({ 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6 })[grade] || 0;
  // Reviewed textbook folder -> grade evidence (and the unit-key vocabulary of its questions).
  // Textbook paths (textbooks/<folder>/...) carry no high/hN segment, so the grade comes from this
  // table. It mirrors the reviewed manifest archive/data/textbook-source-manifest-v1.json
  // (tests/archive2-textbook-manifest.test.js keeps the two identical); the Worker bundles this
  // module, so the table lives here rather than in a fetch.
  const TEXTBOOK_SOURCES = Object.freeze({
    "동아출판_공통수학1": { grade: "고1", unitKeys: "chapter" },
    "미래엔_공통수학1": { grade: "고1", unitKeys: "chapter" },
    "미래엔_공통수학2": { grade: "고1", unitKeys: "chapter" },
    "미래엔_대수": { grade: "고2", unitKeys: "chapter" },
    "백발백중_공통수학2": { grade: "고1", unitKeys: "profile" },
    "비상교육_공통수학1": { grade: "고1", unitKeys: "chapter" },
    "비상교육_공통수학2": { grade: "고1", unitKeys: "profile" },
    "비상교육_대수": { grade: "고2", unitKeys: "chapter" },
    "비상교육_미적분1": { grade: "고2", unitKeys: "chapter" },
    "비상교육_기하": { grade: "고2", unitKeys: "chapter" },
    "비상교육_확률과통계": { grade: "고2", unitKeys: "chapter" },
  });
  const textbookSource = (file) => {
    const normalized = normalizeFile(file);
    if (!normalized.startsWith("textbooks/")) return null;
    const folder = normalized.split("/")[1] || "";
    return Object.prototype.hasOwnProperty.call(TEXTBOOK_SOURCES, folder) ? TEXTBOOK_SOURCES[folder] : null;
  };
  const pathGrade = (file) => {
    const textbook = textbookSource(file);
    if (textbook) return textbook.grade;
    if (normalizeFile(file).startsWith("textbooks/")) return "";
    const match = normalizeFile(file).match(
      /(?:^|\/)(?:original\/)?(high\/h([123])|middle\/m([123]))\//,
    );
    if (!match) return "";
    return match[2] ? `고${match[2]}` : `중${match[3]}`;
  };
  const pathKey = (row, fields) => fields.map((field) => text(row?.[field])).join("\u0000");
  const BASIC_PARENT_FIELDS = [
    "grade",
    "curriculumKey",
    "courseKey",
    "L1",
    "L2",
  ];
  const BASIC_ASSIGNMENT_FIELDS = [
    "questionUid",
    "sourceFile",
    "sourceOrdinal",
    "grade",
    "curriculumKey",
    "courseKey",
    "L1",
    "L2",
  ];
  const CANONICAL_MASTER_PATH = "../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
  // The manifest commits to this index; the index commits to each source shard.
  // Shards omit the final projection version to avoid a digest cycle.
  const SOURCE_VERIFICATION_INDEX_PATH = "data/archive2-source-verification-index.json";
  const SOURCE_VERIFICATION_SHARD_PREFIX = "data/archive2-source-verification/v1/";
  // Original-source verification reads a sharded file list instead of SOURCE_VERIFICATION_INDEX_PATH: the manifest
  // commits to the small top index, the top index commits to SOURCE_VERIFICATION_INDEX_BUCKET_COUNT hash-prefix
  // buckets of { sourceFile, sha256, qCount } rows, and a bucket row commits to the source shard. One check reads the
  // manifest, the top index, one bucket and one shard, so the bytes no longer grow with the number of registered
  // exams. SOURCE_VERIFICATION_INDEX_PATH (one flat file) is still built, only for Workers deployed before this
  // layout and for the mixed lookup, which has not moved yet (see docs/agents/archive2-code.md).
  const SOURCE_VERIFICATION_TOP_INDEX_PATH = "data/archive2-source-verification-index-v2.json";
  const SOURCE_VERIFICATION_INDEX_BUCKET_PREFIX = "data/archive2-source-verification/index-v2/";
  const SOURCE_VERIFICATION_INDEX_BUCKET_COUNT = 16;
  const SOURCE_VERIFICATION_TOP_INDEX_SCHEMA = "archive2-source-verification-top-index-v2";
  const SOURCE_VERIFICATION_INDEX_BUCKET_SCHEMA = "archive2-source-verification-index-bucket-v2";
  const MIXED_VERIFICATION_CONTEXT_PATH = "data/archive2-source-verification/mixed-v1/context.json";
  const MIXED_SOURCE_SHARD_PREFIX = "data/archive2-source-verification/mixed-v1/sources/";
  const MIXED_UID_BUCKET_PREFIX = "data/archive2-source-verification/mixed-v1/uid-buckets/";
  // Index schema -> resource schema version suffix. v2 is the compact layout (see decodeMixedRows); v1 stays readable
  // so a Worker deployed with this loader keeps working against a site that was built before the v2 layout.
  const MIXED_INDEX_SCHEMAS = new Map([
    ["archive2-mixed-source-verification-index-v1", "v1"],
    ["archive2-mixed-source-verification-index-v2", "v2"],
  ]);
  function canonicalPathsFromMaster(master = {}) {
    const parents = new Map();
    const advanced = [];
    const courseAliases = { 수학_상: "수학(상)", 수학_하: "수학(하)" };
    for (const scope of master.records || []) {
      const parent = {
        curriculumKey: text(scope.curriculum),
        courseKey: courseAliases[scope.scope] || text(scope.scope),
        L1: text(scope.majorUnit),
        L2: text(scope.midUnit),
        curriculumApplicability: scope.curriculumApplicability || "",
        defaultSelectable: scope.defaultSelectable,
      };
      if (!parent.curriculumKey || !parent.courseKey || !parent.L1 || !parent.L2) continue;
      const parentKey = pathKey(parent, BASIC_PARENT_FIELDS.slice(1));
      if (!parents.has(parentKey)) parents.set(parentKey, parent);
      for (const concept of scope.concepts || []) {
        const L3 = text(concept.concept);
        for (const type of concept.problemTypes || []) {
          const row = {
            ...parent,
            L3,
            L4: text(type.problemType),
            curriculumApplicability:
              type.curriculumApplicability || concept.curriculumApplicability || parent.curriculumApplicability,
            defaultSelectable:
              type.defaultSelectable ?? concept.defaultSelectable ?? parent.defaultSelectable,
          };
          if (L3 && row.L4) advanced.push(row);
        }
      }
    }
    return { parents: [...parents.values()], advanced };
  }

  const RUNTIME_INPUT_PATHS = [
    "data/meta-foundation/runtime/geometry-equations-v1.json",
    "data/meta-foundation/runtime/sets-propositions-v1.json",
    "data/meta-foundation/runtime/functions-graphs-v1.json",
    "data/meta-foundation/runtime/limit-continuity-v1.json",
    "data/meta-foundation/runtime/integral-calculus-v1.json",
    "data/meta-foundation/runtime/derivative-v1.json",
    "data/meta-foundation/runtime/probability-statistics-v1.json",
    "data/meta-foundation/runtime/middle-geometry-v1.json",
    "data/meta-foundation/runtime/middle1-v1.json",
    "data/meta-foundation/runtime/h1-foundation-v1.json",
    "data/meta-foundation/runtime/h1-original-source-v1.json",
  ];
  const MANIFEST_REQUIRED_PATHS = Object.freeze([
    "data/archive2-catalog.json",
    CANONICAL_MASTER_PATH,
    "data/archive2-canonical-projection-policy.json",
    "data/archive2-item-review-overrides.json",
    "data/basic-scope-parent-links.json",
    "data/basic-scope-source-links.json",
    "data/basic-scope-parent-groups.json",
    "data/meta-foundation/compiled/taxonomy_registry.json",
    "data/meta-foundation/compiled/concept_registry.json",
    "data/meta-foundation/compiled/condition_registry.json",
    "data/meta-foundation/compiled/curriculum_bindings.json",
    ...RUNTIME_INPUT_PATHS,
  ]);
  const REQUIRED_INPUT_PATHS = Object.freeze([
    "data/archive2-catalog.json",
    CANONICAL_MASTER_PATH,
    "data/archive2-canonical-projection-policy.json",
    "data/archive2-item-review-overrides.json",
    "data/basic-scope-parent-links.json",
    "data/meta-foundation/compiled/taxonomy_registry.json",
    "data/meta-foundation/compiled/curriculum_bindings.json",
    ...RUNTIME_INPUT_PATHS,
  ]);

  function runtimeInputPathsFromManifest(files = []) {
    const paths = new Set(RUNTIME_INPUT_PATHS);
    for (const row of files) {
      const path = text(row.path);
      if (!path.startsWith("data/meta-foundation/runtime/")) continue;
      if (!/^data\/meta-foundation\/runtime\/[a-z0-9-]+-v[0-9]+\.json$/.test(path))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "invalid runtime manifest path");
      paths.add(path);
    }
    return [...paths];
  }

  function reviewedRegistrationProofPaths(runtimePacks = []) {
    const paths = [...new Set(runtimePacks.flatMap(pack => Object.entries(pack?.generatedFrom || {})
      .filter(([key]) => key.startsWith("reviewedExam_")).map(([, value]) => text(value).replace(/^archive\//, ""))))];
    for (const path of paths) if (!/^data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_-]+\.json$/.test(path))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "invalid reviewed registration proof path");
    return paths;
  }

  function manifestInputPathsFromRuntimePacks(runtimePacks = [], includeOptionalPath = () => false, runtimePaths = RUNTIME_INPUT_PATHS) {
    const paths = new Set([...MANIFEST_REQUIRED_PATHS, ...runtimePaths]);
    for (const pack of runtimePacks) {
      for (const sourceRef of Object.values(pack?.generatedFrom || {})) {
        if (typeof sourceRef !== "string" || !sourceRef.startsWith("archive/") || !sourceRef.endsWith(".json")) continue;
        const webPath = sourceRef.slice("archive/".length);
        if (!webPath || webPath.split("/").some((part) => part === ".." || part === "."))
          throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical generatedFrom path is invalid");
        paths.add(webPath);
        if (webPath.includes("/evidence/") && /item_metadata_assignments.*\.json$/.test(webPath)) {
          const receiptPath = webPath.replace(/[^/]+$/, "promotion_receipt.json");
          if (includeOptionalPath(receiptPath)) paths.add(receiptPath);
        }
      }
    }
    return [...paths].sort();
  }

  function resolveSourceGrade({ registeredGrade, sourceFile, identitySourceFile } = {}) {
    const registered = text(registeredGrade);
    const sourcePath = normalizeFile(sourceFile);
    const identityPath = normalizeFile(identitySourceFile);
    const sourceGrade = pathGrade(sourcePath);
    const identityGrade = pathGrade(identityPath);
    if (
      !GRADES.has(registered) ||
      !sourcePath ||
      !identityPath ||
      !sourceGrade ||
      !identityGrade
    )
      return { grade: "", status: "SOURCE_GRADE_UNRESOLVED", reason: "grade_evidence_missing" };
    if (
      sourcePath !== identityPath ||
      registered !== sourceGrade ||
      registered !== identityGrade
    )
      return { grade: "", status: "SOURCE_GRADE_CONFLICT", reason: "grade_evidence_conflict" };
    return { grade: registered, status: "VALID", reason: "" };
  }

  function resolveSnapshotSourceGrade({ preservedGrade, sourceFile, identitySourceFile } = {}) {
    const preserved = text(preservedGrade);
    const sourcePath = normalizeFile(sourceFile);
    const identityPath = normalizeFile(identitySourceFile);
    if (!sourcePath || !identityPath)
      return { grade: "", status: "SOURCE_GRADE_UNRESOLVED", reason: "snapshot_identity_missing" };
    if (sourcePath !== identityPath)
      return { grade: "", status: "SOURCE_GRADE_CONFLICT", reason: "snapshot_identity_conflict" };
    const sourcePathGrade = pathGrade(sourcePath);
    const identityPathGrade = pathGrade(identityPath);
    if (sourcePathGrade && identityPathGrade !== sourcePathGrade)
      return { grade: "", status: "SOURCE_GRADE_CONFLICT", reason: "snapshot_path_grade_conflict" };
    if (preserved && !GRADES.has(preserved))
      return { grade: "", status: "SOURCE_GRADE_UNRESOLVED", reason: "snapshot_grade_invalid" };
    if (preserved && sourcePathGrade && preserved !== sourcePathGrade)
      return { grade: "", status: "SOURCE_GRADE_CONFLICT", reason: "snapshot_grade_conflict" };
    const grade = preserved || sourcePathGrade || identityPathGrade;
    if (!GRADES.has(grade))
      return { grade: "", status: "SOURCE_GRADE_UNRESOLVED", reason: "snapshot_grade_missing" };
    return { grade, status: "VALID", reason: "" };
  }

  async function assignmentFingerprint(question = {}) {
    if (!globalThis.crypto?.subtle || typeof TextEncoder !== "function")
      throw new Error("Archive2 assignment fingerprint requires Web Crypto");
    const payload = JSON.stringify({
      content: question.content ?? null,
      choices: Array.isArray(question.choices) ? question.choices : null,
      image: question.image ?? null,
    });
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(payload),
    );
    return Array.from(new Uint8Array(digest), (value) =>
      value.toString(16).padStart(2, "0"),
    ).join("");
  }

  function getByUid(table, uid) {
    if (table instanceof Map) return table.get(uid);
    return table && typeof table === "object" ? table[uid] : undefined;
  }

  function evidencePasses(evidence) {
    return Boolean(
      evidence &&
        REVIEW_STATES.has(text(evidence.status)) &&
        text(evidence.reference) &&
        SHA256.test(text(evidence.sha256)),
    );
  }
  const approvedFieldStatus = (value) => /^approved(?:_|$)/i.test(String(value || ""));

  function assignmentEvidencePasses(assignment) {
    if (!evidencePasses(assignment?.reviewEvidence)) return false;
    if (assignment.store === "approved_item_override")
      return Boolean(
        text(assignment.reviewEvidence.runtimeEvidenceReference) &&
        SHA256.test(text(assignment.reviewEvidence.runtimeEvidenceSha)),
      );
    return true;
  }

  // validateBasicAssignment runs for every catalog record on each compose
  // render, so the two authority row lists are indexed once per array instead of
  // being scanned (with Unicode normalization per row) for every record. The
  // index is rebuilt when the array object or its length changes; membership
  // results are identical to the former Array.some scans.
  const authorityKeyIndexes = new WeakMap();
  function authorityKeySet(rows, kind, keyOf) {
    if (!Array.isArray(rows)) return new Set();
    let entry = authorityKeyIndexes.get(rows);
    if (!entry || entry.kind !== kind || entry.length !== rows.length) {
      entry = { kind, length: rows.length, keys: new Set(rows.map(keyOf)) };
      authorityKeyIndexes.set(rows, entry);
    }
    return entry.keys;
  }
  const gradeCourseKeys = (rows) =>
    authorityKeySet(rows, "gradeCourse", (row) =>
      JSON.stringify([text(row.grade), text(row.curriculumKey), text(row.courseKey)]));
  const canonicalParentKeys = (rows) =>
    authorityKeySet(rows, "canonicalParent", (row) => pathKey(row, BASIC_PARENT_FIELDS));

  function validateBasicAssignment(record = {}, authority = null) {
    const reasons = [];
    if (!authority || typeof authority !== "object")
      return { ok: false, parent: null, reasons: ["canonical_authority_missing"] };

    const uid = text(record.questionUid);
    const sourceFile = normalizeFile(record.sourceFile);
    const sourceOrdinal = Number(record.sourceOrdinal);
    if (!/^qid_v1_[a-f0-9]{64}$/.test(uid) || record.identityStatus !== "VERIFIED")
      reasons.push("source_identity_unverified");

    const identity = getByUid(authority.identityByUid, uid);
    const registeredGrade = getByUid(authority.examGradeByFile, sourceFile);
    if (
      !identity ||
      identity.status !== "VERIFIED" ||
      normalizeFile(identity.sourceArchiveFile) !== sourceFile ||
      Number(identity.sourceOrdinal) !== sourceOrdinal
    )
      reasons.push("source_identity_conflict");

    const gradeEvidence = resolveSourceGrade({
      registeredGrade,
      sourceFile,
      identitySourceFile: identity?.sourceArchiveFile,
    });
    if (gradeEvidence.status !== "VALID") reasons.push(gradeEvidence.status);
    const grade = gradeEvidence.grade;
    if (grade && text(record.sourceGrade) && text(record.sourceGrade) !== grade)
      reasons.push("SOURCE_GRADE_CONFLICT");

    const curriculumKey = text(record.curriculumKey);
    const courseKey = text(record.courseKey);
    const courseAllowed = gradeCourseKeys(authority.gradeCourses).has(
      JSON.stringify([grade, curriculumKey, courseKey]),
    );
    if (!courseAllowed) reasons.push("course_namespace_invalid");

    const assignmentList = getByUid(authority.assignmentsByUid, uid);
    if (!Array.isArray(assignmentList) || assignmentList.length !== 1) {
      reasons.push(
        Array.isArray(assignmentList) && assignmentList.length > 1
          ? "assignment_conflict"
          : "assignment_missing",
      );
    }
    const assignment = Array.isArray(assignmentList) && assignmentList.length === 1
      ? assignmentList[0]
      : null;
    if (assignment) {
      if (
        text(assignment.questionUid) !== uid ||
        normalizeFile(assignment.sourceFile) !== sourceFile ||
        Number(assignment.sourceOrdinal) !== sourceOrdinal
      )
        reasons.push("assignment_identity_mismatch");
      if (
        !text(record.assignmentFingerprint) ||
        text(assignment.sourceFingerprint) !== text(record.assignmentFingerprint) ||
        !text(record.assignmentFingerprint) ||
        text(assignment.assignmentFingerprint) !== text(record.assignmentFingerprint)
      )
        reasons.push("assignment_fingerprint_mismatch");
      if (text(assignment.approvalStatus) !== "APPROVED")
        reasons.push("assignment_not_approved");
      if (!assignmentEvidencePasses(assignment))
        reasons.push("assignment_review_evidence_missing");
      if (
        !text(authority.taxonomyVersion) ||
        text(assignment.taxonomyVersion) !== text(authority.taxonomyVersion)
      )
        reasons.push("assignment_taxonomy_version_mismatch");
      for (const field of ["grade", "curriculumKey", "courseKey", "L1", "L2"])
        if (text(assignment[field]) !== (field === "grade" ? grade : text(record[field])))
          reasons.push("assignment_target_mismatch");
    }

    const parent = assignment
      ? {
          grade,
          curriculumKey: text(assignment.curriculumKey),
          courseKey: text(assignment.courseKey),
          L1: text(assignment.L1),
          L2: text(assignment.L2),
        }
      : null;
    const parentKey = parent && pathKey(parent, BASIC_PARENT_FIELDS);
    const canonicalParentExists = parent &&
      canonicalParentKeys(authority.canonicalParents).has(parentKey);
    if (!canonicalParentExists) reasons.push("canonical_parent_missing");

    return {
      ok: reasons.length === 0,
      parent: reasons.length === 0 ? parent : null,
      reasons: [...new Set(reasons)],
    };
  }

  function validateAdvancedAssignment(record = {}, authority = null) {
    const basic = validateBasicAssignment(record, authority);
    if (!basic.ok) return { ok: false, reasons: basic.reasons };
    const uid = text(record.questionUid);
    const hasFoundationKeys = Boolean(text(record.problemTypeKey) || text(record.templateKey));
    if (hasFoundationKeys) {
      const rows = getByUid(authority.advancedAssignmentsByUid, uid);
      const list = Array.isArray(rows) ? rows : [];
      const matches = list.filter((row) =>
        text(row.questionUid) === uid &&
        BASIC_PARENT_FIELDS.every((field) => text(row[field]) === text(basic.parent[field])) &&
        text(row.problemTypeKey) === text(record.problemTypeKey) &&
        text(row.templateKey) === text(record.templateKey) &&
        text(row.taxonomyVersion) === text(authority.taxonomyVersion) &&
        text(row.approvalStatus) === "APPROVED" &&
        assignmentEvidencePasses(row),
      );
      if (matches.length !== 1)
        return { ok: false, reasons: [matches.length ? "advanced_assignment_conflict" : "advanced_parent_invalid"] };
      const assignment = matches[0];
      if (!authority.problemTypeKeys?.has(text(assignment.problemTypeKey)))
        return { ok: false, reasons: ["advanced_problem_type_invalid"] };
      const template = authority.templatesByKey?.[text(assignment.templateKey)];
      if (assignment.templateKey) {
        if (!template || template.status !== "ACTIVE" || text(template.parentProblemTypeKey) !== text(assignment.problemTypeKey))
          return { ok: false, reasons: ["advanced_template_parent_invalid"] };
      } else if (!new Set(["NO_SEPARATE_L4", "HOLD"]).has(text(assignment.l4Disposition))) {
        return { ok: false, reasons: ["advanced_template_unresolved"] };
      }
      const bindingKey = [assignment.curriculumKey, assignment.standardUnitKey, assignment.subUnitKey, assignment.problemTypeKey].map(text).join("\u0000");
      if (!authority.bindingKeys?.has(bindingKey))
        return { ok: false, reasons: ["advanced_curriculum_binding_invalid"] };
      return { ok: true, reasons: [] };
    }
    const L3 = text(record.L3),
      L4 = text(record.L4);
    if (!L3 && !L4) return { ok: false, reasons: ["advanced_unavailable"] };
    const rows = authority.canonicalAdvancedPaths || [];
    const valid = rows.some((row) =>
      BASIC_PARENT_FIELDS.every((field) => text(row[field]) === text(basic.parent[field])) &&
      text(row.L3) === L3 &&
      (!L4 || text(row.L4) === L4),
    );
    return valid ? { ok: true, reasons: [] } : { ok: false, reasons: ["advanced_parent_invalid"] };
  }

  function makeError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  async function sha256(value) {
    if (!globalThis.crypto?.subtle || typeof TextEncoder !== "function")
      throw new Error("Archive2 canonical projection requires Web Crypto");
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(String(value)),
    );
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  function projectionManifestPayload(files = [], resolverVersion = RESOLVER_VERSION) {
    if (!Array.isArray(files) || !files.length)
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is empty");
    const normalized = files
      .map((row) => ({ path: text(row.path), sha256: text(row.sha256).toLowerCase() }))
      .sort((a, b) => a.path.localeCompare(b.path));
    const seen = new Set();
    for (const row of normalized) {
      if (!row.path || !SHA256.test(row.sha256) || seen.has(row.path))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is invalid");
      seen.add(row.path);
    }
    return JSON.stringify({
      resolverVersion: text(resolverVersion),
      files: normalized,
    });
  }

  async function computeProjectionVersion(files = [], resolverVersion = RESOLVER_VERSION) {
    return "archive2-canonical-v1:" + await sha256(projectionManifestPayload(files, resolverVersion));
  }


  const COMPACT_INPUT_MANIFEST_PATH = "data/archive2-canonical-input-manifest.compact.json";
  const COMPACT_INPUT_MANIFEST_SCHEMA = "archive2-canonical-input-manifest-compact-v1";
  const INPUT_MANIFEST_SCHEMA = "archive2-canonical-input-manifest-v1";
  const INPUT_MANIFEST_KEYS = [
    "schemaVersion", "resolverVersion", "generatedFromCatalogIndexVersion", "projectionVersion", "files",
  ];
  const COMPACT_INPUT_MANIFEST_KEYS = [
    "schemaVersion", "manifestSchemaVersion", "resolverVersion", "generatedFromCatalogIndexVersion",
    "projectionVersion", "directories", "files",
  ];
  function compactManifestInvalid(why) {
    return makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical compact input manifest is invalid: " + why);
  }
  function exactManifestKeys(value, keys) {
    return value !== null && typeof value === "object" && !Array.isArray(value) &&
      Object.keys(value).length === keys.length &&
      keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
  }
  function compactManifestHeaders(value, compact) {
    const keys = compact ? COMPACT_INPUT_MANIFEST_KEYS : INPUT_MANIFEST_KEYS;
    if (!exactManifestKeys(value, keys))
      throw compactManifestInvalid("header shape");
    if (
      value.schemaVersion !== (compact ? COMPACT_INPUT_MANIFEST_SCHEMA : INPUT_MANIFEST_SCHEMA) ||
      (compact && value.manifestSchemaVersion !== INPUT_MANIFEST_SCHEMA) ||
      value.resolverVersion !== RESOLVER_VERSION
    )
      throw makeError("CANONICAL_RESOLVER_VERSION_MISMATCH", "canonical compact input manifest version mismatch");
    if (
      typeof value.generatedFromCatalogIndexVersion !== "string" ||
      !/^[a-f0-9]{64}$/.test(value.generatedFromCatalogIndexVersion) ||
      typeof value.projectionVersion !== "string" ||
      !/^archive2-canonical-v1:[a-f0-9]{64}$/.test(value.projectionVersion) ||
      !Array.isArray(value.files) || !value.files.length
    )
      throw compactManifestInvalid("header value");
  }
  function compactManifestPathParts(value) {
    if (
      typeof value !== "string" || !value || value !== value.trim() ||
      value !== value.normalize("NFC") || value.startsWith("/") ||
      /[\\\x00-\x1f\x7f?#%:]/.test(value)
    )
      throw compactManifestInvalid("path");
    const parts = value.split("/");
    // Existing authority manifests legitimately reference ../docs/. Preserve that
    // exact namespace; no other parent traversal or URL interpretation is accepted.
    const checked = parts[0] === ".." && parts[1] === "docs" ? parts.slice(1) : parts;
    if (checked.some((part) => !part || part === "." || part === ".." || part !== part.trim()))
      throw compactManifestInvalid("path segment");
    if (value === COMPACT_INPUT_MANIFEST_PATH)
      throw compactManifestInvalid("companion cannot be an input to itself");
    const slash = value.lastIndexOf("/");
    return { directory: slash < 0 ? "" : value.slice(0, slash + 1), basename: value.slice(slash + 1) };
  }
  function compactManifestHash(value) {
    if (typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value))
      throw compactManifestInvalid("file hash");
    return value;
  }

  // This companion is a transport view of the original manifest, not a new
  // authority/projection format. File order, headers and every path/hash survive
  // exactly; all existing manifest/index/shard checks run on the decoded object.
  function encodeCompactInputManifest(manifest) {
    compactManifestHeaders(manifest, false);
    const directories = [], directoryIndices = new Map(), seenPaths = new Set();
    const files = manifest.files.map((row) => {
      if (!exactManifestKeys(row, ["path", "sha256"]))
        throw compactManifestInvalid("original file shape");
      const { directory, basename } = compactManifestPathParts(row.path);
      if (seenPaths.has(row.path)) throw compactManifestInvalid("duplicate path");
      seenPaths.add(row.path);
      if (!directoryIndices.has(directory)) {
        directoryIndices.set(directory, directories.length);
        directories.push(directory);
      }
      return [directoryIndices.get(directory), basename, compactManifestHash(row.sha256)];
    });
    return {
      schemaVersion: COMPACT_INPUT_MANIFEST_SCHEMA,
      manifestSchemaVersion: manifest.schemaVersion,
      resolverVersion: manifest.resolverVersion,
      generatedFromCatalogIndexVersion: manifest.generatedFromCatalogIndexVersion,
      projectionVersion: manifest.projectionVersion,
      directories,
      files,
    };
  }
  function decodeCompactInputManifest(compact) {
    compactManifestHeaders(compact, true);
    if (!Array.isArray(compact.directories) || !compact.directories.length ||
        compact.directories.length > compact.files.length)
      throw compactManifestInvalid("directory table");
    const seenDirectories = new Set();
    for (const directory of compact.directories) {
      if (typeof directory !== "string" || (directory && !directory.endsWith("/")) ||
          seenDirectories.has(directory))
        throw compactManifestInvalid("directory entry");
      // Validate the prefix with a fixed safe basename without normalizing it.
      if (compactManifestPathParts(directory + "__manifest_prefix_check__.json").directory !== directory)
        throw compactManifestInvalid("directory prefix");
      seenDirectories.add(directory);
    }
    const seenPaths = new Set(), usedDirectories = new Set();
    const files = compact.files.map((tuple) => {
      if (!Array.isArray(tuple) || tuple.length !== 3 ||
          !Number.isInteger(tuple[0]) || Object.is(tuple[0], -0) ||
          tuple[0] < 0 || tuple[0] >= compact.directories.length ||
          typeof tuple[1] !== "string" || !tuple[1] || /[\/\\]/.test(tuple[1]))
        throw compactManifestInvalid("file tuple");
      if (!usedDirectories.has(tuple[0])) {
        if (tuple[0] !== usedDirectories.size)
          throw compactManifestInvalid("directory order");
        usedDirectories.add(tuple[0]);
      }
      const directory = compact.directories[tuple[0]], path = directory + tuple[1];
      const decoded = compactManifestPathParts(path);
      if (decoded.directory !== directory || decoded.basename !== tuple[1] || seenPaths.has(path))
        throw compactManifestInvalid("reconstructed path");
      seenPaths.add(path);
      return { path, sha256: compactManifestHash(tuple[2]) };
    });
    if (usedDirectories.size !== compact.directories.length)
      throw compactManifestInvalid("unused directory");
    return {
      schemaVersion: compact.manifestSchemaVersion,
      resolverVersion: compact.resolverVersion,
      generatedFromCatalogIndexVersion: compact.generatedFromCatalogIndexVersion,
      projectionVersion: compact.projectionVersion,
      files,
    };
  }

  async function loadInputBundle(fetcher, baseUrl, expectedVersion = "") {
    if (typeof fetcher !== "function")
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input loader is unavailable");
    const base = new URL(String(baseUrl));
    const read = async (relativePath) => {
      let url;
      try { url = new URL(relativePath, base); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input URL is invalid"); }
      if (url.origin !== base.origin)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input escaped the archive origin");
      let response;
      try { response = await fetcher(url.toString()); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input request failed: " + relativePath); }
      if (!response || !response.ok)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical authority unavailable: " + relativePath);
      return response.text();
    };

    let manifest;
    try {
      manifest = JSON.parse(await read("data/archive2-canonical-input-manifest.json"));
    } catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is invalid");
    }
    if (
      manifest?.schemaVersion !== "archive2-canonical-input-manifest-v1" ||
      manifest.resolverVersion !== RESOLVER_VERSION ||
      !Array.isArray(manifest.files)
    )
      throw makeError("CANONICAL_RESOLVER_VERSION_MISMATCH", "browser/Worker canonical resolver version mismatch");
    const listed = new Set(manifest.files.map((row) => text(row.path)));
    if (MANIFEST_REQUIRED_PATHS.some((path) => !listed.has(path)))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete");
    const projectionVersion = await computeProjectionVersion(manifest.files);
    if (projectionVersion !== manifest.projectionVersion)
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical input manifest digest mismatch");
    if (expectedVersion && expectedVersion !== projectionVersion)
      throw makeError("CANONICAL_PROJECTION_REFRESH_REQUIRED", "분류 기준이 갱신되었습니다. 문항 목록을 새로고침하세요.");

    const resources = {};
    const files = Object.fromEntries(manifest.files.map((entry) => [
      text(entry.path),
      { sha256: text(entry.sha256).toLowerCase() },
    ]));
    const runtimePaths = runtimeInputPathsFromManifest(manifest.files);
    const loadVerifiedInput = async (inputPath) => {
      const entry = manifest.files.find((row) => text(row.path) === inputPath);
      if (!entry)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete: " + inputPath);
      let body;
      try { body = (await read(inputPath)).replace(/\r\n/g, "\n"); }
      catch (error) {
        if (error.code) throw error;
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical authority unavailable: " + inputPath);
      }
      if (await sha256(body) !== text(entry.sha256).toLowerCase())
        throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical input digest mismatch: " + inputPath);
      try { resources[inputPath] = JSON.parse(body); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input JSON is invalid: " + inputPath); }
    };
    await Promise.all([...new Set([...REQUIRED_INPUT_PATHS, ...runtimePaths])].map(loadVerifiedInput));
    const registrationProofs = reviewedRegistrationProofPaths(runtimePaths.map(p => resources[p]));
    await Promise.all(registrationProofs.map(loadVerifiedInput));
    const requiredManifestPaths = manifestInputPathsFromRuntimePacks(
      runtimePaths.map((path) => resources[path]),
      (path) => listed.has(path),
      runtimePaths,
    );
    if (requiredManifestPaths.some((path) => !listed.has(path)))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete");
    return { manifest, projectionVersion, files, resources, runtimeInputPaths: runtimePaths };
  }

  // The shard path of an index row is fully determined by its source file
  // (SOURCE_VERIFICATION_SHARD_PREFIX + sha256(sourceFile) + ".json"), so current indexes omit it to
  // stay small as the bank grows; a row that still carries one must stay inside the shard prefix and
  // is compared with the derived path at lookup time.
  const validOptionalShardPath = (row) =>
    row?.path === undefined ||
    (String(row.path).startsWith(SOURCE_VERIFICATION_SHARD_PREFIX) && String(row.path).endsWith(".json"));

  async function loadSourceVerificationShard(
    fetcher,
    baseUrl,
    expectedVersion = "",
    sourceFile = "",
  ) {
    if (typeof fetcher !== "function")
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source loader is unavailable");
    const normalizedSource = normalizeFile(sourceFile);
    if (!normalizedSource || normalizedSource.split("/").some((part) => part === ".." || part === "."))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source path is invalid");
    const base = new URL(String(baseUrl));
    const read = async (relativePath, allow404 = false) => {
      let url;
      try { url = new URL(relativePath, base); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source URL is invalid"); }
      if (url.origin !== base.origin)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source escaped the archive origin");
      let response;
      try { response = await fetcher(url.toString()); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source request failed: " + relativePath); }
      if (allow404 && response?.status === 404) return null;
      if (!response || !response.ok)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source unavailable: " + relativePath);
      return response.text();
    };

    let manifest;
    try {
      const compactBody = await read(COMPACT_INPUT_MANIFEST_PATH, true);
      manifest = compactBody === null
        ? JSON.parse(await read("data/archive2-canonical-input-manifest.json"))
        : decodeCompactInputManifest(JSON.parse(compactBody));
    } catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is invalid");
    }
    if (
      manifest?.schemaVersion !== "archive2-canonical-input-manifest-v1" ||
      manifest.resolverVersion !== RESOLVER_VERSION ||
      !Array.isArray(manifest.files)
    )
      throw makeError("CANONICAL_RESOLVER_VERSION_MISMATCH", "browser/Worker canonical resolver version mismatch");
    const listed = new Set(manifest.files.map((row) => text(row.path)));
    if (MANIFEST_REQUIRED_PATHS.some((path) => !listed.has(path)))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete");
    const projectionVersion = await computeProjectionVersion(manifest.files);
    if (projectionVersion !== manifest.projectionVersion)
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical input manifest digest mismatch");
    if (expectedVersion && expectedVersion !== projectionVersion)
      throw makeError("CANONICAL_PROJECTION_REFRESH_REQUIRED", "분류 기준이 갱신되었습니다. 문항 목록을 새로고침하세요.");
    // A manifest without the top index predates the sharded file list and keeps the full resolver path.
    if (!listed.has(SOURCE_VERIFICATION_TOP_INDEX_PATH))
      return { projectionVersion, sourceIndex: null, shard: null, legacyManifest: true };

    const topEntry = manifest.files.find((entry) => text(entry.path) === SOURCE_VERIFICATION_TOP_INDEX_PATH);
    // The top index cannot commit to a version that already contains its own digest, nor to the flat index that
    // is built alongside it, so its base version leaves both out.
    const topBaseProjectionVersion = await computeProjectionVersion(
      manifest.files.filter((entry) => {
        const entryPath = text(entry.path);
        return entryPath !== SOURCE_VERIFICATION_INDEX_PATH && entryPath !== SOURCE_VERIFICATION_TOP_INDEX_PATH;
      }),
      RESOLVER_VERSION,
    );
    let topBody;
    try { topBody = (await read(SOURCE_VERIFICATION_TOP_INDEX_PATH)).replace(/\r\n/g, "\n"); }
    catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index unavailable");
    }
    if (await sha256(topBody) !== text(topEntry.sha256).toLowerCase())
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index digest mismatch");
    let topIndex;
    try { topIndex = JSON.parse(topBody); }
    catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index is invalid"); }
    if (
      topIndex?.schemaVersion !== SOURCE_VERIFICATION_TOP_INDEX_SCHEMA ||
      topIndex.resolverVersion !== RESOLVER_VERSION ||
      topIndex.baseProjectionVersion !== topBaseProjectionVersion ||
      topIndex.generatedFromCatalogIndexVersion !== manifest.generatedFromCatalogIndexVersion ||
      !Number.isInteger(Number(topIndex.fileCount)) || Number(topIndex.fileCount) < 1 ||
      !Array.isArray(topIndex.buckets) || topIndex.buckets.length !== SOURCE_VERIFICATION_INDEX_BUCKET_COUNT
    )
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index does not match the current projection");
    const bucketRows = new Map();
    let bucketFileCount = 0;
    for (const row of topIndex.buckets) {
      const prefix = text(row?.prefix);
      if (
        !/^[0-9a-f]$/.test(prefix) || bucketRows.has(prefix) ||
        !SHA256.test(text(row?.sha256)) ||
        !Number.isInteger(Number(row?.byteLength)) || Number(row.byteLength) < 1 ||
        !Number.isInteger(Number(row?.fileCount)) || Number(row.fileCount) < 0
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index bucket row is invalid");
      bucketRows.set(prefix, row);
      bucketFileCount += Number(row.fileCount);
    }
    if (bucketRows.size !== SOURCE_VERIFICATION_INDEX_BUCKET_COUNT || bucketFileCount !== Number(topIndex.fileCount))
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index bucket coverage is incomplete");

    const shardHash = await sha256(normalizedSource);
    const bucketRow = bucketRows.get(shardHash.slice(0, 1));
    let bucketBody;
    try { bucketBody = (await read(SOURCE_VERIFICATION_INDEX_BUCKET_PREFIX + bucketRow.prefix + ".json")).replace(/\r\n/g, "\n"); }
    catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index bucket unavailable");
    }
    if (
      new TextEncoder().encode(bucketBody).byteLength !== Number(bucketRow.byteLength) ||
      await sha256(bucketBody) !== text(bucketRow.sha256).toLowerCase()
    )
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index bucket digest mismatch");
    let bucket;
    try { bucket = JSON.parse(bucketBody); }
    catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index bucket is invalid"); }
    if (
      bucket?.schemaVersion !== SOURCE_VERIFICATION_INDEX_BUCKET_SCHEMA ||
      bucket.prefix !== bucketRow.prefix ||
      !Array.isArray(bucket.files) || bucket.files.length !== Number(bucketRow.fileCount)
    )
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index bucket does not match the top index");
    const seenFiles = new Set();
    for (const row of bucket.files) {
      const file = normalizeFile(row?.sourceFile);
      if (
        !file || seenFiles.has(file) || file !== text(row?.sourceFile) ||
        !SHA256.test(text(row?.sha256)) ||
        !Number.isInteger(Number(row?.qCount)) || Number(row.qCount) < 1 ||
        (await sha256(file)).slice(0, 1) !== bucketRow.prefix
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index row is invalid");
      seenFiles.add(file);
    }
    const sourceEntry = bucket.files.find((row) => normalizeFile(row.sourceFile) === normalizedSource);
    if (!sourceEntry)
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source is not indexed");
    const expectedShardPath = SOURCE_VERIFICATION_SHARD_PREFIX + shardHash + ".json";
    let shardBody;
    try { shardBody = (await read(expectedShardPath)).replace(/\r\n/g, "\n"); }
    catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source shard unavailable");
    }
    if (await sha256(shardBody) !== text(sourceEntry.sha256).toLowerCase())
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source shard digest mismatch");
    let shard;
    try { shard = JSON.parse(shardBody); }
    catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source shard is invalid"); }
    if (
      shard?.schemaVersion !== "archive2-source-verification-v1" ||
      normalizeFile(shard.sourceFile) !== normalizedSource ||
      shard.sourceFile !== normalizedSource ||
      !shard.exam || normalizeFile(shard.exam.file) !== normalizedSource ||
      Number(shard.exam.qCount) !== Number(sourceEntry.qCount) ||
      !Array.isArray(shard.records) || shard.records.length !== Number(sourceEntry.qCount)
    )
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source shard does not match the index");
    return { projectionVersion, sourceIndex: topIndex, shard };
  }

  // Mixed verification resources come in two layouts that carry the same rows. Schema v1 stores every row as a
  // self-contained object. Schema v2 stores a per-resource string dictionary, the record key lists ("shapes") and
  // positional rows, and decodes back to exactly the v1 row objects, so every check below still runs on identical
  // data. Strings are stored as "~<base36 dictionary index>"; a literal string that starts with "~" carries one
  // extra "~". Source shards omit the file; UID buckets store an index into the source index. A row that does not
  // follow the standard identity shape carries an explicit trailing object, so nothing is ever guessed. With
  // options.only (a Set of UIDs) other rows are returned as { questionUid } stubs, which is all the loader needs
  // from rows nobody requested.
  function decodeMixedRows(resource, options = {}) {
    const bad = (why) => makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed compact rows are invalid: " + why);
    const { dict, shapes, rows } = resource || {};
    if (!Array.isArray(dict) || !Array.isArray(shapes) || !Array.isArray(rows)) throw bad("tables");
    if (dict.some((entry) => typeof entry !== "string")) throw bad("dictionary");
    if (shapes.some((keys) => !Array.isArray(keys) || keys.some((key) => typeof key !== "string"))) throw bad("shapes");
    const bucket = options.kind === "bucket", files = options.files;
    if (bucket && !Array.isArray(files)) throw bad("file table");
    const unstr = (value) => {
      if (typeof value === "string") {
        if (value.charCodeAt(0) !== 126) return value;
        if (value.charCodeAt(1) === 126) return value.slice(1);
        const ref = value.slice(1), index = parseInt(ref, 36);
        if (!/^[0-9a-z]+$/.test(ref) || index.toString(36) !== ref || index >= dict.length) throw bad("reference");
        return dict[index];
      }
      if (Array.isArray(value)) return value.map(unstr);
      if (value && typeof value === "object")
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, unstr(entry)]));
      return value;
    };
    const width = bucket ? 8 : 7;
    return rows.map((row) => {
      if (!Array.isArray(row) || (row.length !== width && row.length !== width + 1)) throw bad("row");
      let at = 0;
      const questionUid = row[at++];
      // Rows the caller did not ask for only need their UID for the coverage checks; skip decoding them.
      if (options.only && typeof questionUid === "string" && !options.only.has(questionUid)) return { questionUid };
      const sourceFile = bucket ? files[row[at++]] : options.sourceFile;
      const sourceOrdinal = row[at++];
      const registeredGrade = unstr(row[at++]);
      const shape = shapes[row[at++]], values = row[at++];
      const assignments = unstr(row[at++]), advancedAssignments = unstr(row[at++]);
      const extra = row.length > width ? row[width] : null;
      if (
        typeof questionUid !== "string" || typeof sourceFile !== "string" ||
        !Number.isInteger(sourceOrdinal) || typeof registeredGrade !== "string" ||
        !shape || !Array.isArray(values) || values.length !== shape.length ||
        (extra !== null && (!extra || typeof extra !== "object" || Array.isArray(extra)))
      )
        throw bad("row fields");
      const identity = extra && Object.hasOwn(extra, "identity") ? extra.identity : {
        questionUid, sourceArchiveFile: sourceFile, sourceOrdinal, status: "VERIFIED",
      };
      const recordIds = extra && Object.hasOwn(extra, "recordIds") ? extra.recordIds : {
        sourceFile, sourceOrdinal, questionUid,
      };
      const record = {
        ...recordIds,
        ...Object.fromEntries(shape.map((key, index) => [key, unstr(values[index])])),
      };
      return { questionUid, sourceFile, sourceOrdinal, registeredGrade, identity, assignments, advancedAssignments, record };
    });
  }

  async function loadMixedVerificationRecords(
    fetcher,
    baseUrl,
    expectedVersion = "",
    requestedRows = [],
  ) {
    if (typeof fetcher !== "function")
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed loader is unavailable");
    const base = new URL(String(baseUrl));
    const read = async (relativePath) => {
      let url;
      try { url = new URL(relativePath, base); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed URL is invalid"); }
      if (url.origin !== base.origin)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed lookup escaped the archive origin");
      let response;
      try { response = await fetcher(url.toString()); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed request failed: " + relativePath); }
      if (!response || !response.ok)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed resource unavailable: " + relativePath);
      return response.text();
    };

    let manifest;
    try { manifest = JSON.parse(await read("data/archive2-canonical-input-manifest.json")); }
    catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is invalid");
    }
    if (
      manifest?.schemaVersion !== "archive2-canonical-input-manifest-v1" ||
      manifest.resolverVersion !== RESOLVER_VERSION ||
      !Array.isArray(manifest.files)
    )
      throw makeError("CANONICAL_RESOLVER_VERSION_MISMATCH", "browser/Worker canonical resolver version mismatch");
    const listed = new Set(manifest.files.map((row) => text(row.path)));
    if (MANIFEST_REQUIRED_PATHS.some((path) => !listed.has(path)))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete");
    const projectionVersion = await computeProjectionVersion(manifest.files);
    if (projectionVersion !== manifest.projectionVersion)
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical input manifest digest mismatch");
    if (expectedVersion && expectedVersion !== projectionVersion)
      throw makeError("CANONICAL_PROJECTION_REFRESH_REQUIRED", "분류 기준이 갱신되었습니다. 문항 목록을 새로고침하세요.");

    const indexEntry = manifest.files.find((row) => text(row.path) === SOURCE_VERIFICATION_INDEX_PATH);
    if (!indexEntry)
      return { projectionVersion, sourceIndex: null, lookup: null, records: [], legacyManifest: true };
    let indexBody;
    try { indexBody = (await read(SOURCE_VERIFICATION_INDEX_PATH)).replace(/\r\n/g, "\n"); }
    catch (error) {
      if (error.code) throw error;
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index unavailable");
    }
    if (await sha256(indexBody) !== text(indexEntry.sha256).toLowerCase())
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index digest mismatch");
    let sourceIndex;
    try { sourceIndex = JSON.parse(indexBody); }
    catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index is invalid"); }
    const baseProjectionVersion = await computeProjectionVersion(
      manifest.files.filter((entry) => text(entry.path) !== SOURCE_VERIFICATION_INDEX_PATH),
      RESOLVER_VERSION,
    );
    if (
      sourceIndex?.schemaVersion !== "archive2-source-verification-index-v1" ||
      sourceIndex.resolverVersion !== RESOLVER_VERSION ||
      sourceIndex.baseProjectionVersion !== baseProjectionVersion ||
      sourceIndex.generatedFromCatalogIndexVersion !== manifest.generatedFromCatalogIndexVersion ||
      !Array.isArray(sourceIndex.files)
    )
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical source index does not match the current projection");

    const sourceFiles = new Map();
    for (const row of sourceIndex.files) {
      const file = normalizeFile(row?.sourceFile);
      if (
        !file || sourceFiles.has(file) || file !== text(row?.sourceFile) ||
        !validOptionalShardPath(row) ||
        !SHA256.test(text(row?.sha256)) ||
        !Number.isInteger(Number(row?.qCount)) || Number(row.qCount) < 1
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical source index row is invalid");
      sourceFiles.set(file, row);
    }
    const mixedLookup = sourceIndex.mixedLookup;
    if (!mixedLookup)
      return { projectionVersion, sourceIndex, lookup: null, records: [], legacyManifest: true };
    if (
      !MIXED_INDEX_SCHEMAS.has(mixedLookup.schemaVersion) ||
      mixedLookup.resolverVersion !== RESOLVER_VERSION ||
      mixedLookup.baseProjectionVersion !== baseProjectionVersion ||
      !Array.isArray(mixedLookup.files) ||
      !Array.isArray(mixedLookup.uidBuckets) ||
      mixedLookup.files.length !== sourceFiles.size ||
      mixedLookup.uidBuckets.length !== 16 ||
      mixedLookup.context?.path !== MIXED_VERIFICATION_CONTEXT_PATH ||
      !SHA256.test(text(mixedLookup.context?.sha256)) ||
      !Number.isInteger(Number(mixedLookup.context?.byteLength)) || Number(mixedLookup.context.byteLength) < 1
    )
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed source index is invalid");

    const mixedFiles = new Map();
    for (let i = 0; i < mixedLookup.files.length; i++) {
      const row = mixedLookup.files[i],
        sourceRow = sourceIndex.files[i],
        file = normalizeFile(sourceRow?.sourceFile),
        sourceEntry = sourceFiles.get(file);
      if (
        row?.sourceIndex !== i || !file || file !== text(sourceRow?.sourceFile) ||
        mixedFiles.has(file) || !sourceEntry ||
        !SHA256.test(text(row?.sha256)) ||
        !Number.isInteger(Number(row?.byteLength)) || Number(row.byteLength) < 1 ||
        !Number.isInteger(Number(row?.recordCount)) || Number(row.recordCount) < 0 ||
        Number(row.recordCount) > Number(sourceEntry.qCount)
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed source index row is invalid");
      mixedFiles.set(file, { ...row, sourceFile: file, sourceIndex: i });
    }
    const uidBuckets = new Map();
    for (const row of mixedLookup.uidBuckets) {
      const prefix = text(row?.prefix);
      if (
        !/^[0-9a-f]$/.test(prefix) || uidBuckets.has(prefix) ||
        row?.path !== MIXED_UID_BUCKET_PREFIX + prefix + ".json" ||
        (prefix === "f" ? row?.includesContext !== true : Object.hasOwn(row || {}, "includesContext")) ||
        !SHA256.test(text(row?.sha256)) ||
        !Number.isInteger(Number(row?.byteLength)) || Number(row.byteLength) < 1 ||
        !Number.isInteger(Number(row?.recordCount)) || Number(row.recordCount) < 0
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed UID bucket index row is invalid");
      uidBuckets.set(prefix, row);
    }
    if ([...Array(16)].some((_, i) => !uidBuckets.has(i.toString(16))))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed UID bucket index is incomplete");
    const expectedMixedRecordCount = [...mixedFiles.values()].reduce((sum, row) => sum + Number(row.recordCount), 0),
      indexedBucketRecordCount = [...uidBuckets.values()].reduce((sum, row) => sum + Number(row.recordCount), 0);
    if (expectedMixedRecordCount !== indexedBucketRecordCount)
      throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed lookup coverage does not match the source index");

    const requests = (Array.isArray(requestedRows) ? requestedRows : []).map((row) => ({
      questionUid: text(row?.questionUid),
      sourceFile: normalizeFile(row?.sourceFile),
      sourceOrdinal: Number(row?.sourceOrdinal),
    }));
    const validRequests = requests.filter((row) => /^qid_v1_[a-f0-9]{64}$/.test(row.questionUid));
    if (!validRequests.length)
      return { projectionVersion, sourceIndex, lookup: mixedLookup, records: [], legacyManifest: false };
    const requestedFiles = [...new Set(validRequests.map((row) => row.sourceFile).filter(Boolean))],
      requestedPrefixes = [...new Set(validRequests.map((row) => row.questionUid.slice(7, 8)))],
      sourcePlan = requestedFiles.map((file) => mixedFiles.get(file)),
      bucketPlan = requestedPrefixes.map((prefix) => uidBuckets.get(prefix));
    const sourcePlanValid = sourcePlan.length === requestedFiles.length &&
      sourcePlan.every((row) => row && Number.isInteger(Number(row.byteLength)) && Number(row.byteLength) > 0);
    const sourceBytes = sourcePlanValid
      ? sourcePlan.reduce((sum, row) => sum + Number(row.byteLength), 0)
      : Number.POSITIVE_INFINITY;
    const bucketBytes = bucketPlan.reduce((sum, row) => sum + Number(row.byteLength), 0);
    const contextBytes = Number(mixedLookup.context.byteLength),
      bucketIncludesContext = requestedPrefixes.includes("f"),
      sourcePlanBytes = sourceBytes + contextBytes,
      bucketPlanBytes = bucketBytes + (bucketIncludesContext ? 0 : contextBytes);
    // Keep the source plan small enough to stay comfortably under Free's
    // subrequest ceiling; otherwise coalesce by the fixed UID prefix buckets.
    const useSourceShards = sourcePlanValid && sourcePlan.length <= 15 && sourcePlanBytes <= bucketPlanBytes;
    const resources = [];
    if (useSourceShards) {
      for (const row of sourcePlan) {
        resources.push({
          ...row,
          // Source paths are schema-derived from the indexed canonical source;
          // the sourceIndex field binds that source to this row without
          // repeating its file and path strings in the shared index.
          path: MIXED_SOURCE_SHARD_PREFIX + await sha256(row.sourceFile) + ".json",
          kind: "source",
        });
      }
    }
    else resources.push(...bucketPlan.map((row) => ({ ...row, kind: "bucket" })));

    const readVerifiedJson = async (entry) => {
      let body;
      try { body = (await read(entry.path)).replace(/\r\n/g, "\n"); }
      catch (error) {
        if (error.code) throw error;
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed resource unavailable");
      }
      if (new TextEncoder().encode(body).byteLength !== Number(entry.byteLength) ||
          await sha256(body) !== text(entry.sha256).toLowerCase())
        throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed resource digest mismatch");
      try { return JSON.parse(body); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed resource is invalid"); }
    };
    const inlineContextBucket = !useSourceShards && bucketIncludesContext;
    let context = inlineContextBucket ? null : await readVerifiedJson({
      path: mixedLookup.context.path,
      sha256: mixedLookup.context.sha256,
      byteLength: contextBytes,
    });
    const validateContext = (value) => {
      const authority = value?.authority;
      if (
        value?.schemaVersion !== "archive2-mixed-source-verification-context-v1" ||
        value.resolverVersion !== RESOLVER_VERSION ||
        value.baseProjectionVersion !== baseProjectionVersion ||
        !authority || typeof authority !== "object" ||
        !text(authority.taxonomyVersion) ||
        !Array.isArray(authority.gradeCourses) ||
        !Array.isArray(authority.canonicalParents) ||
        !Array.isArray(authority.canonicalAdvancedPaths) ||
        !authority.projectionPolicy || typeof authority.projectionPolicy !== "object" ||
        !Array.isArray(authority.problemTypeKeys) ||
        !authority.templatesByKey || typeof authority.templatesByKey !== "object" ||
        !Array.isArray(authority.bindingKeys)
      )
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed authority context is invalid");
      return authority;
    };
    const readInlineContext = async (value) => {
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed inline context is invalid");
      const body = JSON.stringify(value) + "\n";
      if (new TextEncoder().encode(body).byteLength !== contextBytes ||
          await sha256(body) !== text(mixedLookup.context.sha256).toLowerCase())
        throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed inline context digest mismatch");
      return value;
    };
    if (context) validateContext(context);

    const resourceVersion = MIXED_INDEX_SCHEMAS.get(mixedLookup.schemaVersion),
      sourceFileList = sourceIndex.files.map((row) => normalizeFile(row?.sourceFile)),
      indexedSourceFiles = new Set(mixedFiles.keys()),
      requestedUidSet = new Set(validRequests.map((row) => row.questionUid)),
      resolvedByUid = new Map();
    const processResource = async (entry, resource) => {
      let rows;
      if (entry.kind === "source") {
        const file = normalizeFile(entry.sourceFile);
        const stored = resourceVersion === "v2" ? resource?.rows : resource?.records;
        if (
          resource?.schemaVersion !== "archive2-mixed-source-verification-" + resourceVersion ||
          normalizeFile(resource.sourceFile) !== file || resource.sourceFile !== file ||
          !Array.isArray(stored) || stored.length !== Number(entry.recordCount)
        )
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed source shard does not match the index");
        rows = resourceVersion === "v2" ? decodeMixedRows(resource, { kind: "source", sourceFile: file, only: requestedUidSet }) : stored;
      } else {
        const prefix = text(entry.prefix),
          stored = resourceVersion === "v2" ? resource?.rows : resource?.records;
        if (
          resource?.schemaVersion !== "archive2-mixed-source-verification-uid-bucket-" + resourceVersion ||
          resource.prefix !== prefix || !Array.isArray(stored) ||
          stored.length !== Number(entry.recordCount) ||
          (prefix === "f" ? !Object.hasOwn(resource, "context") : Object.hasOwn(resource, "context"))
        )
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed UID bucket does not match the index");
        if (prefix === "f" && inlineContextBucket) {
          context = await readInlineContext(resource.context);
          validateContext(context);
        }
        rows = resourceVersion === "v2"
          ? decodeMixedRows(resource, { kind: "bucket", files: sourceFileList, only: requestedUidSet })
          : stored;
      }
      const seenInResource = new Set();
      for (const row of rows) {
        const uid = text(row?.questionUid);
        if (
          !/^qid_v1_[a-f0-9]{64}$/.test(uid) ||
          (entry.kind === "bucket" && uid.slice(7, 8) !== entry.prefix) ||
          seenInResource.has(uid)
        )
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed UID record is invalid");
        seenInResource.add(uid);
        if (!requestedUidSet.has(uid)) continue;
        if (resolvedByUid.has(uid))
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed lookup contains duplicate requested UIDs");
        const file = normalizeFile(row?.sourceFile), ordinal = Number(row?.sourceOrdinal),
          record = row?.record, identity = row?.identity;
        if (
          !indexedSourceFiles.has(file) || !Number.isInteger(ordinal) || ordinal < 1 ||
          !record || typeof record !== "object" ||
          text(record.questionUid) !== uid || normalizeFile(record.sourceFile) !== file ||
          Number(record.sourceOrdinal) !== ordinal ||
          !Array.isArray(row.assignments) || !Array.isArray(row.advancedAssignments)
        )
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed requested record identity is invalid");
        if (entry.kind === "source" && file !== normalizeFile(entry.sourceFile))
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed source shard contains another requested source");
        if (record.identityStatus === "VERIFIED" && (
          !identity || text(identity.questionUid) !== uid ||
          normalizeFile(identity.sourceArchiveFile) !== file ||
          Number(identity.sourceOrdinal) !== ordinal || text(identity.status) !== "VERIFIED"
        ))
          throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical mixed verified identity does not match its record");
        resolvedByUid.set(uid, row);
      }
    };
    for (let i = 0; i < resources.length; i += 2) {
      const entries = resources.slice(i, i + 2), values = await Promise.all(entries.map(readVerifiedJson));
      for (let j = 0; j < entries.length; j++) await processResource(entries[j], values[j]);
    }
    if (!context)
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical mixed authority context is missing");
    const authority = validateContext(context);
    return {
      projectionVersion,
      sourceIndex,
      lookup: mixedLookup,
      authority,
      records: [...resolvedByUid.values()],
      legacyManifest: false,
    };
  }

  function decodeCatalog(data) {
    if (!data || data.encoding !== "column-dictionary-v1") return data;
    const decode = (value) =>
      Array.isArray(value) && value.length === 1 && Number.isInteger(value[0])
        ? data.strings[value[0]]
        : value;
    return {
      ...data,
      records: (data.records || []).map((row) => Object.fromEntries(
        (data.columns || [])
          .map((column, index) => [column, decode(row[index])])
          .filter(([, value]) => value !== null),
      )),
    };
  }

  function policyHasEvidence(row, policy) {
    return Boolean(
      row &&
      text(row.approvalStatus) === "APPROVED" &&
      text(row.taxonomyVersion) === text(policy?.canonicalMasterSha256) &&
      text(row.evidenceReference) &&
      SHA256.test(text(row.evidenceSha256)),
    );
  }

  function resolveSubjectProjection(record = {}, policy = null) {
    if (!policy || !text(policy.canonicalMasterSha256)) return "";
    const grade = text(record.sourceGrade);
    const curriculumKey = text(record.curriculumKey);
    const courseKey = text(record.courseKey);
    const allowedCourse = (targetGrade, targetCurriculum, targetCourse) =>
      (policy.gradeCourseAllowlist || policy.allowedGradeCourses || []).some((row) =>
        text(row.grade) === text(targetGrade) &&
        text(row.curriculumKey) === text(targetCurriculum) &&
        text(row.courseKey) === text(targetCourse),
      );
    if (grade === "고1") {
      if (curriculumKey === "2022" && courseKey === "공통수학1" && allowedCourse(grade, curriculumKey, courseKey)) return "COMMON_MATH_1";
      if (curriculumKey === "2022" && courseKey === "공통수학2" && allowedCourse(grade, curriculumKey, courseKey)) return "COMMON_MATH_2";
      const unitKey = text(record.standardUnitKey || record.legacyStandardUnitKey);
      const allowed = (policy.high1CompatibilityProjections || []).find((row) =>
        policyHasEvidence(row, policy) &&
        text(row.sourceGrade) === grade &&
        text(row.sourceCurriculumKey) === curriculumKey &&
        text(row.sourceCourseKey) === courseKey &&
        text(row.sourceUnitKey) === unitKey &&
        allowedCourse(grade, row.sourceCurriculumKey, row.sourceCourseKey) &&
        allowedCourse(grade, row.targetCurriculumKey, row.targetCourseKey),
      );
      if (allowed) return text(allowed.projectionKey);
      if (curriculumKey === "2015" && courseKey === "수학(상)" && allowedCourse(grade, curriculumKey, courseKey)) return "H1_2015_MATH_UP";
      if (curriculumKey === "2015" && courseKey === "수학(하)" && allowedCourse(grade, curriculumKey, courseKey)) return "H1_2015_MATH_DOWN";
      return "";
    }
    if (grade === "고2" || grade === "고3") {
      const allowed = (policy.high23SharedSubjects || []).find((row) =>
        policyHasEvidence(row, policy) &&
        allowedCourse(grade, row.curriculumKey, row.courseKey) &&
        text(row.grade) === grade &&
        text(row.curriculumKey) === curriculumKey &&
        text(row.courseKey) === courseKey,
      );
      return text(allowed?.projectionKey);
    }
    return "";
  }


  // This is a display repair scope, not an approval source. The parent was issued
  // in m2s2-centroid2-current-v2-26fc-20261115-E023 after the existing parent-labels
  // evidence was checked. Every use still requires a current, verified receipt.
  const ISSUED_PARENT_DISPLAY_SCOPE = Object.freeze({
    qid_v1_1042e4bc1d8ffa66ef5d65438e878ade2ec52b168772bfaa3f514f6b94078ea3: Object.freeze({
      sourceFile: "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js",
      sourceOrdinal: 21,
      grade: "중2", curriculumKey: "2015", courseKey: "M2-2",
      standardUnitKey: "M2-05", subUnitKey: "M2-05-TRIANGLE_PROPERTIES",
      L1: "삼각형의 성질", L2: "삼각형의 외심과 내심",
    }),
  });

  function issuedParentDisplayProjection({ source, record, assignment, issued, scopeParents, canonicalParents }) {
    const uid = text(record.questionUid), scope = ISSUED_PARENT_DISPLAY_SCOPE[uid];
    const meta = source.metadataAssignmentEvidence;
    if (!scope || !issued || issued.assignment !== assignment || issued.approvalType !== "FINAL_QA" ||
        source.metaProjectionStatus !== "DISPLAY_PROJECTION_UNAVAILABLE" ||
        source.metaProjectionFailureReason !== "DISPLAY_PROJECTION_PARENT_AMBIGUOUS" || source.metaProjection != null ||
        source.sourceIssueHold === true || source.semanticDisposition === "HOLD" ||
        Object.values(source.metaFieldEvidence || {}).some(evidence =>
          ["EVIDENCE_DEBT", "STALE", "INVALID", "HOLD", "PENDING", "UNKNOWN"].includes(evidence?.status)) ||
        source.sourceStatus !== "VERIFIED" || source.sourceIntegrityStatus !== "VERIFIED" || source.identityStatus !== "VERIFIED" ||
        normalizeFile(source.sourceFile) !== scope.sourceFile || Number(source.sourceOrdinal) !== scope.sourceOrdinal ||
        text(record.sourceGrade) !== scope.grade || text(meta?.questionUid) !== uid ||
        normalizeFile(meta?.sourceFile) !== scope.sourceFile || Number(meta?.sourceOrdinal) !== scope.sourceOrdinal ||
        text(assignment.questionUid) !== uid || normalizeFile(assignment.sourceFile) !== scope.sourceFile ||
        Number(assignment.sourceOrdinal) !== scope.sourceOrdinal || assignment.metadataApprovalType !== "FINAL_QA" ||
        assignment.metadataStatus !== "approved_semantic_review" || meta?.metadataStatus !== assignment.metadataStatus ||
        !SHA256.test(text(source.sourceFingerprint)) || meta?.sourceFingerprint !== source.sourceFingerprint ||
        assignment.reviewEvidence?.reviewedSourceFingerprint !== source.sourceFingerprint ||
        !SHA256.test(text(source.assignmentFingerprint)) || meta?.assignmentFingerprint !== source.assignmentFingerprint ||
        assignment.assignmentFingerprint !== source.assignmentFingerprint ||
        text(source.metadataRevision) !== text(meta?.metadataRevision) || text(assignment.metadataRevision) !== text(meta?.metadataRevision) ||
        !["standardUnit", "subUnit"].every(field => meta?.fieldStatus?.[field] === "approved_final_qa" &&
          assignment.fieldStatus?.[field] === "approved_final_qa") ||
        Object.values(meta?.fieldStatus || {}).includes("manual_review_pending") ||
        !Array.isArray(meta?.evidenceRefs) || !meta.evidenceRefs.includes("archive/" + issued.reference) ||
        !SHA256.test(issued.sha256) || !SHA256.test(issued.sourceRawSha256) ||
        ["curriculumKey", "courseKey", "standardUnitKey", "subUnitKey", "L1", "L2"].some(field =>
          text(assignment[field]) !== scope[field] || text(record[field]) !== scope[field])) return null;

    // Preserve the ordinary exact-subunit-first/fallback candidate set. Only
    // the already-issued tuple may disambiguate it; no default is removed.
    const units = scopeParents.filter(row => text(row.grade) === scope.grade &&
      text(row.curriculumKey) === scope.curriculumKey && text(row.courseKey) === scope.courseKey &&
      text(row.standardUnitKey) === scope.standardUnitKey);
    const exact = units.filter(row => text(row.subUnitKey) === scope.subUnitKey);
    const candidates = exact.length ? exact : units.filter(row => !text(row.subUnitKey));
    const parents = candidates.filter(row => text(row.L1) === scope.L1 && text(row.L2) === scope.L2);
    const masterParents = canonicalParents.filter(row => ["grade", "curriculumKey", "courseKey", "L1", "L2"]
      .every(field => text(row[field]) === scope[field]));
    if (candidates.length < 2 || parents.length !== 1 || masterParents.length !== 1 ||
        ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"].some(field => !text(assignment[field]))) return null;

    return {
      projectionStatus: "DISPLAY_ONLY_SOURCE_BOUND", displayOnly: true,
      ...Object.fromEntries(["curriculumKey", "courseKey", "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "L1", "L2"]
        .map(field => [field, assignment[field]])),
      evidenceByField: { ...(source.metaFieldEvidence || {}),
        ...Object.fromEntries(["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"]
          .map(field => [field, { status: assignment.fieldStatus[field.startsWith("subUnit") ? "subUnit" : "standardUnit"] }])) },
      sourceBinding: {
        questionUid: uid, sourceFile: scope.sourceFile, sourceOrdinal: scope.sourceOrdinal,
        sourceFingerprint: source.sourceFingerprint, assignmentFingerprint: source.assignmentFingerprint,
        bindingMode: "EXACT", metadataRevision: meta.metadataRevision, evidenceRefs: [...meta.evidenceRefs],
        sourceJsSha256: record.currentSourceJsSha256, sourceRawSha256: issued.sourceRawSha256,
      },
      parentBinding: {
        standardUnitKey: scope.standardUnitKey, matchedSubUnitKey: exact.length ? scope.subUnitKey : "",
        resolution: "ISSUED_FINAL_QA_EXACT_PARENT", L1: scope.L1, L2: scope.L2,
        reference: issued.reference, sha256: issued.sha256,
      },
    };
  }

  function resolveCatalog({
    assignmentEvidence = {},
    versionBundle,
  } = {}) {
    const resources = versionBundle?.resources || {};
    for (const path of REQUIRED_INPUT_PATHS)
      if (!Object.hasOwn(resources, path))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input bundle is incomplete: " + path);
    const catalog = decodeCatalog(resources["data/archive2-catalog.json"]);
    const sourceJsShaByFile = new Map((catalog?.sourceHashes || []).map(([file, sha]) =>
      [normalizeFile(file), text(sha).toLowerCase()],
    ));
    // sourceHashes remain normalized text hashes for browser loading. The
    // additive raw-byte entries cover BOM/CRLF files; unlisted sources use the
    // same hash in both contracts. Legacy catalogs retain their old behavior.
    const sourceRawShaByFile = new Map(sourceJsShaByFile);
    if (Object.hasOwn(catalog || {}, "sourceRawHashes")) {
      if (!Array.isArray(catalog.sourceRawHashes))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "catalog raw source hashes are invalid");
      const seenRawSources = new Set();
      for (const entry of catalog.sourceRawHashes) {
        if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" ||
            !sourceJsShaByFile.has(normalizeFile(entry[0])) || seenRawSources.has(normalizeFile(entry[0])) ||
            !SHA256.test(text(entry[1])))
          throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "catalog raw source hash entry is invalid");
        const file = normalizeFile(entry[0]);
        seenRawSources.add(file);
        sourceRawShaByFile.set(file, text(entry[1]).toLowerCase());
      }
    }
    const master = resources[CANONICAL_MASTER_PATH];
    const projectionPolicy = resources["data/archive2-canonical-projection-policy.json"];
    const links = resources["data/basic-scope-parent-links.json"];
    const foundationTaxonomy = resources["data/meta-foundation/compiled/taxonomy_registry.json"];
    const bindings = resources["data/meta-foundation/compiled/curriculum_bindings.json"];
    const overlayPacks = runtimeInputPathsFromManifest(Object.keys(resources).map(path => ({ path }))).map((path) => resources[path]);
    if (!catalog || !Array.isArray(catalog.records) || !Array.isArray(catalog.exams))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "Archive 2.0 catalog unavailable");
    if (!versionBundle?.projectionVersion || !versionBundle.files)
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input version is missing");
    const masterSha = text(versionBundle.files[CANONICAL_MASTER_PATH]?.sha256);
    if (
      !projectionPolicy ||
      projectionPolicy.schemaVersion !== "archive2-canonical-projection-policy-v1" ||
      !masterSha ||
      text(projectionPolicy.canonicalMasterSha256) !== masterSha ||
      links?.schemaVersion !== "archive2-basic-scope-parent-links-v1" ||
      links?.status !== "DERIVED_READ_ONLY" ||
      text(links.authority?.sha256) !== masterSha ||
      !Array.isArray(master?.records) ||
      !master.records.length ||
      projectionPolicy.status !== "ACTIVE" ||
      !Array.isArray(projectionPolicy.gradeCourseAllowlist) ||
      !projectionPolicy.gradeCourseAllowlist.length ||
      foundationTaxonomy?.status !== "DERIVED_READ_ONLY" ||
      !Array.isArray(foundationTaxonomy.problemTypes) ||
      !Array.isArray(foundationTaxonomy.templates) ||
      !Array.isArray(bindings?.bindings) ||
      overlayPacks.some((pack) => pack?.status !== "ACTIVE" || !Array.isArray(pack.records))
    )
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical policy/master version mismatch");

    const masterPaths = canonicalPathsFromMaster(master);

    const examsByFile = new Map(
      catalog.exams.map((exam) => [normalizeFile(exam.file), exam]),
    );
    const sourceRecords = new Map();
    const identityByUid = {};
    for (const row of catalog.records) {
      const uid = text(row.questionUid);
      if (!uid) continue;
      if (sourceRecords.has(uid))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "duplicate catalog UID: " + uid);
      sourceRecords.set(uid, row);
      identityByUid[uid] = {
        questionUid: uid,
        sourceArchiveFile: normalizeFile(row.sourceFile),
        sourceOrdinal: Number(row.sourceOrdinal),
        status: row.identityStatus,
      };
    }
    const gradeCourses = Array.isArray(projectionPolicy.gradeCourseAllowlist)
      ? projectionPolicy.gradeCourseAllowlist
      : Array.isArray(projectionPolicy.allowedGradeCourses)
        ? projectionPolicy.allowedGradeCourses
      : [];
    const parentRows = [];
    const advancedRows = [];
    for (const row of masterPaths.parents)
      for (const allowed of gradeCourses)
        if (
          text(allowed.curriculumKey) === text(row.curriculumKey) &&
          text(allowed.courseKey) === text(row.courseKey)
        ) parentRows.push({ ...row, grade: text(allowed.grade) });
    for (const row of masterPaths.advanced)
      for (const allowed of gradeCourses)
        if (
          text(allowed.curriculumKey) === text(row.curriculumKey) &&
          text(allowed.courseKey) === text(row.courseKey)
        ) advancedRows.push({ ...row, grade: text(allowed.grade) });
    const uniqueRows = (rows, fields) => {
      const seen = new Set();
      return rows.filter((row) => {
        const key = pathKey(row, fields);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    const uniqueParents = uniqueRows(parentRows, BASIC_PARENT_FIELDS);
    const canonicalAdvancedPaths = uniqueRows(advancedRows, [...BASIC_PARENT_FIELDS, "L3", "L4"]);
    const embeddedAssignments = Object.fromEntries(
      catalog.records
        .filter((row) => row.questionUid && row.assignmentEvidence)
        .map((row) => [row.questionUid, [row.assignmentEvidence]]),
    );
    const canonicalAuthority = {
      ...assignmentEvidence,
      taxonomyVersion: masterSha,
      examGradeByFile: Object.fromEntries(
        [...examsByFile.entries()].map(([file, exam]) => [file, text(exam.grade || exam.sourceGrade)]),
      ),
      identityByUid,
      gradeCourses,
      canonicalParents: uniqueParents,
      canonicalAdvancedPaths,
      projectionPolicy,
      assignmentsByUid: {
        ...embeddedAssignments,
        ...(assignmentEvidence.assignmentsByUid || {}),
      },
      advancedAssignmentsByUid: {
        ...(assignmentEvidence.advancedAssignmentsByUid || {}),
      },
      problemTypeKeys: new Set((foundationTaxonomy.problemTypes || [])
        .filter((row) => row.status === "ACTIVE")
        .map((row) => text(row.problemTypeKey))),
      templatesByKey: Object.fromEntries((foundationTaxonomy.templates || []).map((row) => [text(row.templateKey), row])),
      bindingKeys: new Set((bindings.bindings || []).map((row) =>
        [row.curriculum, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].map(text).join("\u0000"),
      )),
    };
    const overlaysByUid = new Map();
    for (const pack of overlayPacks) {
      for (const row of pack.records || []) {
        const uid = text(row.questionUid);
        if (!uid) continue;
        if (!overlaysByUid.has(uid)) overlaysByUid.set(uid, []);
        overlaysByUid.get(uid).push({ ...row, _runtimePackId: pack.packId, _runtimePackVersion: pack.packVersion });
      }
    }

    const overrideIndex = resources["data/archive2-item-review-overrides.json"];
    if (overrideIndex?.schemaVersion !== "archive2-item-review-override-index-v1" || !Array.isArray(overrideIndex.records))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "reviewed item override index is invalid");
    const overrideByUid = new Map();
    for (const value of overrideIndex.records) {
      const path = text(value.evidenceReference);
      if (!path.startsWith("data/meta-foundation/evidence/review-overrides/v1/") || !path.endsWith(".json")) continue;
      const uid = text(value?.questionUid);
      if (!uid) continue;
      if (!overrideByUid.has(uid)) overrideByUid.set(uid, []);
      overrideByUid.get(uid).push({ path, value });
    }
    const packVersions = new Map((foundationTaxonomy.sourcePacks || []).map((row) =>
      [text(row.packId), text(row.version)],
    ));
    // FINAL_QA, REVIEW2, and META_PIPELINE_AUDIT registrations retain their own approval provenance.
    // A byte-bound v2 receipt supplies assignments only for its exact current
    // source, approved metadata, and ACTIVE runtime record; no R2 override is fabricated.
    const issuedDisplayParentsByUid = new Map();
    const registrationPaths = reviewedRegistrationProofPaths(overlayPacks);
    for (const path of registrationPaths) {
      const receipt = resources[path], receiptSha = text(versionBundle.files[path]?.sha256);
      if (receipt?.schemaVersion !== "archive-reviewed-exam-meta-registration-v2" || receipt.metadataRegistrationStatus !== "REGISTERED" ||
          !["FINAL_QA", "REVIEW2", "META_PIPELINE_AUDIT"].includes(receipt.approval?.type) || receipt.approval.metadataReviewed !== true || !SHA256.test(receiptSha) ||
          !text(receipt.approval.approvedBy) || receipt.approval.type === "REVIEW2" && receipt.approval.reviewPassCount !== 2 ||
          !Array.isArray(receipt.appliedRecords) || receipt.totalQuestions !== receipt.appliedRecords.length ||
          new Set(receipt.appliedRecords.map(r => r.questionUid)).size !== receipt.totalQuestions ||
          !SHA256.test(text(receipt.sourceRawSha256))) continue;
      // The receipt used to be tied to the WHOLE exam file (sourceRawSha256 == current file hash), so editing one choice, one explanation or one figure
      // dropped the registered metadata of every question in the file. The binding is per row now: a row keeps its registration while the stem and choices
      // it was registered for are still the current ones (see the row check below); a stem/choices edit needs a reviewed rebind (text-binding-rebinds ledger).
      for (const accepted of receipt.appliedRecords) {
        const uid = text(accepted.questionUid), source = sourceRecords.get(uid), meta = source?.metadataAssignmentEvidence;
        const overlays = (overlaysByUid.get(uid) || []).filter(row => normalizeFile(row.sourceArchiveFile) === normalizeFile(receipt.sourceArchiveFile) && Number(row.sourceOrdinal) === Number(accepted.sourceOrdinal));
        const sourceCrossRef = receipt.approval?.metaPipelineAudit?.sourceCrossConceptCorrectionRef;
        const sourceAndAuditCross = accepted.fieldStatus?.crossConcept === "approved_source_and_meta_pipeline_audit" &&
          sourceCrossRef && SHA256.test(text(sourceCrossRef.sha256)) && text(sourceCrossRef.path).startsWith("archive/") &&
          (accepted.approvalEvidence || []).includes(sourceCrossRef.path) && (meta?.evidenceRefs || []).includes(sourceCrossRef.path);
        // A metadata audit approves the bound classification, not the original
        // exam's separate review. Keep that source status intact and accept only
        // a complete, specifically approved metadata record with this receipt.
        const auditedMetadataOnly = receipt.approval.type === "META_PIPELINE_AUDIT" &&
          receipt.examFinalQaStatus === "NOT_EVALUATED_BY_REGISTRAR" &&
          accepted.metadataApprovalType === "META_PIPELINE_AUDIT" &&
          accepted.metadataStatus === "approved_semantic_review" &&
          meta?.metadataStatus === accepted.metadataStatus &&
          accepted.reviewStatus === "review_required" &&
          ["standardUnit", "subUnit", "concept", "problemType", "template"].every(
            field => accepted.fieldStatus?.[field] === "approved_meta_pipeline_audit" &&
              meta?.fieldStatus?.[field] === "approved_meta_pipeline_audit"
          ) && (accepted.fieldStatus?.crossConcept === "approved_meta_pipeline_audit" || sourceAndAuditCross) &&
          meta?.fieldStatus?.crossConcept === accepted.fieldStatus?.crossConcept &&
          !Object.values(meta?.fieldStatus || {}).includes("manual_review_pending");
        if (!source || overlays.length !== 1 || normalizeFile(source.sourceFile) !== normalizeFile(receipt.sourceArchiveFile) ||
            Number(source.sourceOrdinal) !== Number(accepted.sourceOrdinal) || meta?.metadataRevision !== accepted.metadataRevision ||
            meta?.sourceFingerprint !== accepted.sourceFingerprint ||
            // Row binding: the current content fingerprint is the registered one, or the catalog builder confirmed (classifyMetaBinding "row": same
            // stem+choices by content fingerprint or by a reviewed rebind) that the metadata row registered under this receipt still describes the
            // current question (sourceStatus VERIFIED). Without either, the row is not accepted.
            (source.assignmentFingerprint !== accepted.contentFingerprint &&
              !(source.sourceStatus === "VERIFIED" && meta?.assignmentFingerprint === accepted.contentFingerprint)) ||
            (accepted.reviewStatus !== "reviewed_pass" && !auditedMetadataOnly) || !text(meta?.metadataStatus).startsWith("approved_") ||
            !approvedFieldStatus(meta?.fieldStatus?.standardUnit) || !approvedFieldStatus(meta?.fieldStatus?.subUnit) ||
            !(meta?.evidenceRefs || []).includes("archive/" + path)) continue;
        const overlay = overlays[0], packId = overlay._runtimePackId, packVersion = overlay._runtimePackVersion;
        if (packVersions.get(packId) !== packVersion || overlay.reviewStatus !== accepted.reviewStatus ||
            (auditedMetadataOnly && (overlay.metadataApprovalType !== "META_PIPELINE_AUDIT" || overlay.metadataStatus !== accepted.metadataStatus ||
              ["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept"].some(
                field => overlay.fieldStatus?.[field] !== accepted.fieldStatus?.[field]
              ))) ||
            ["sourceFingerprint", "contentFingerprint", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey", "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit",
              "crossConceptKeys", "secondaryConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket", "curriculumApplicability", "defaultSelectable"].some(key => JSON.stringify(accepted[key]) !== JSON.stringify(overlay[key]))) continue;
        const gradeEvidence = resolveSourceGrade({ registeredGrade: examsByFile.get(normalizeFile(source.sourceFile))?.grade,
          sourceFile: source.sourceFile, identitySourceFile: identityByUid[uid]?.sourceArchiveFile });
        if (gradeEvidence.status !== "VALID") continue;
        const assignment = { ...accepted, store: "meta_foundation_runtime", sourceFile: normalizeFile(source.sourceFile), sourceOrdinal: Number(source.sourceOrdinal),
          grade: gradeEvidence.grade, sourceFingerprint: source.assignmentFingerprint, assignmentFingerprint: source.assignmentFingerprint,
          approvalStatus: "APPROVED", taxonomyVersion: masterSha, packId, packVersion,
          reviewEvidence: { status: "PASS", reference: path, sha256: receiptSha, approvalType: receipt.approval.type, reviewedSourceFingerprint: accepted.sourceFingerprint } };
        canonicalAuthority.assignmentsByUid[uid] = [assignment];
        canonicalAuthority.advancedAssignmentsByUid[uid] = [assignment];
        // The issued parent-display scope stays bound to the exact whole-file bytes (a newly issued preservation receipt is needed after any file edit).
        if (ISSUED_PARENT_DISPLAY_SCOPE[uid] && receipt.approval.type === "FINAL_QA" &&
            text(receipt.sourceRawSha256) === sourceRawShaByFile.get(normalizeFile(receipt.sourceArchiveFile)) &&
            overlay.metadataRevision === accepted.metadataRevision && overlay.metadataApprovalType === "FINAL_QA" &&
            overlay.metadataApprovalType === accepted.metadataApprovalType && overlay.metadataStatus === accepted.metadataStatus &&
            Array.isArray(accepted.approvalEvidence) && accepted.approvalEvidence.length > 0 &&
            JSON.stringify(overlay.approvalEvidence) === JSON.stringify(accepted.approvalEvidence) &&
            JSON.stringify(meta.evidenceRefs) === JSON.stringify(accepted.approvalEvidence) &&
            JSON.stringify(overlay.fieldStatus) === JSON.stringify(accepted.fieldStatus)) {
          const verified = issuedDisplayParentsByUid.get(uid) || [];
          verified.push({ assignment, approvalType: receipt.approval.type, reference: path,
            sha256: receiptSha, sourceRawSha256: receipt.sourceRawSha256 });
          issuedDisplayParentsByUid.set(uid, verified);
        }
      }
    }
    for (const source of catalog.records) {
      const uid = text(source.questionUid);
      const overrides = overrideByUid.get(uid) || [];
      if (overrides.length !== 1) continue;
      const { path: overridePath, value: override } = overrides[0];
      const decision = override.latestAcceptedReview2 || {};
      const sourceFile = normalizeFile(source.sourceFile);
      const sourceOrdinal = Number(source.sourceOrdinal);
      const metaEvidence = source.metadataAssignmentEvidence || {};
      const identity = identityByUid[uid];
      const exam = examsByFile.get(sourceFile);
      const gradeEvidence = resolveSourceGrade({
        registeredGrade: exam?.grade || exam?.sourceGrade,
        sourceFile,
        identitySourceFile: identity?.sourceArchiveFile,
      });
      const matchingRows = (overlaysByUid.get(uid) || []).filter((row) =>
        normalizeFile(row.sourceArchiveFile || row.sourceFile) === sourceFile &&
        Number(row.sourceOrdinal) === sourceOrdinal &&
        text(row._runtimePackId || row.metaFoundationPackId) === text(decision.runtimePackId),
      );
      if (matchingRows.length !== 1) continue;
      const runtimeRow = matchingRows[0];
      const packId = text(runtimeRow._runtimePackId || runtimeRow.metaFoundationPackId);
      const packVersion = text(runtimeRow._runtimePackVersion || runtimeRow.metaFoundationPackVersion);
      const overrideSha = text(override.evidenceSha256);
      const reviewedFullFingerprint = text(override.sourceFingerprint);
      const runtimeEvidenceSha = text(runtimeRow.resolverEvidenceSha || runtimeRow.inputBundleSha).replace(/^sha256:/i, "");
      const fields = metaEvidence.fieldStatus || {};
      const fieldStatusAllowed =
        approvedFieldStatus(fields.standardUnit) &&
        (approvedFieldStatus(fields.subUnit) || fields.subUnit === "r2e_curriculum_binding");
      const overrideIsReviewed =
        override.schemaVersion === "archive-review2-runtime-override/v1" &&
        text(override.questionUid) === uid &&
        normalizeFile(override.sourceArchiveFile) === sourceFile &&
        Number(override.sourceOrdinal) === sourceOrdinal &&
        ["PASS", "REPAIR"].includes(text(decision.status)) &&
        text(decision.runtimePackId) === packId &&
        text(decision.decisionId) &&
        text(decision.decisionReason) &&
        text(decision.evidencePath) &&
        text(decision.decisionAt) &&
        identity?.status === "VERIFIED" &&
        gradeEvidence.status === "VALID" &&
        text(metaEvidence.questionUid) === uid &&
        normalizeFile(metaEvidence.sourceFile) === sourceFile &&
        Number(metaEvidence.sourceOrdinal) === sourceOrdinal &&
        reviewedFullFingerprint &&
        text(metaEvidence.sourceFingerprint) === reviewedFullFingerprint &&
        text(runtimeRow.sourceFingerprint || runtimeRow.approvedSourceFingerprint) === reviewedFullFingerprint &&
        text(metaEvidence.assignmentFingerprint) === text(source.assignmentFingerprint) &&
        text(metaEvidence.metadataStatus).startsWith("approved_") &&
        fieldStatusAllowed &&
        Array.isArray(metaEvidence.evidenceRefs) && metaEvidence.evidenceRefs.some((ref) => text(ref)) &&
        SHA256.test(text(metaEvidence.evidenceDigest)) &&
        packVersions.get(packId) === packVersion &&
        text(runtimeRow.reviewStatus) === "reviewed_pass" &&
        SHA256.test(runtimeEvidenceSha) &&
        SHA256.test(overrideSha);
      if (!overrideIsReviewed) continue;

      const target = {
        grade: gradeEvidence.grade,
        curriculumKey: text(runtimeRow.curriculumKey),
        courseKey: text(runtimeRow.courseKey),
        L1: text(runtimeRow.L1),
        L2: text(runtimeRow.L2),
      };
      const validParent =
        gradeCourses.some((row) =>
          text(row.grade) === target.grade &&
          text(row.curriculumKey) === target.curriculumKey &&
          text(row.courseKey) === target.courseKey,
        ) &&
        uniqueParents.some((row) => BASIC_PARENT_FIELDS.every((field) => text(row[field]) === text(target[field])));
      const problemType = (foundationTaxonomy.problemTypes || []).find((row) =>
        row.status === "ACTIVE" && text(row.problemTypeKey) === text(runtimeRow.problemTypeKey),
      );
      const template = (foundationTaxonomy.templates || []).find((row) =>
        row.status === "ACTIVE" && text(row.templateKey) === text(runtimeRow.templateKey),
      );
      const binding = (bindings.bindings || []).some((row) =>
        text(row.curriculum) === target.curriculumKey &&
        text(row.standardUnitKey) === text(runtimeRow.standardUnitKey) &&
        text(row.subUnitKey) === text(runtimeRow.subUnitKey) &&
        text(row.problemTypeKey) === text(runtimeRow.problemTypeKey),
      );
      if (!validParent || !problemType || !template || text(template.parentProblemTypeKey) !== text(runtimeRow.problemTypeKey) || !binding)
        continue;

      const evidence = {
        status: "PASS",
        reference: overridePath,
        sha256: overrideSha,
        runtimeEvidenceReference: `data/meta-foundation/runtime/${packId.toLowerCase().replace(/_/g, "-")}-v1.json#${uid}`,
        runtimeEvidenceSha,
        reviewedSourceFingerprint: reviewedFullFingerprint,
        decisionId: text(decision.decisionId),
      };
      const basicAssignment = {
        store: "approved_item_override",
        questionUid: uid,
        sourceFile,
        sourceOrdinal,
        ...target,
        sourceFingerprint: text(source.assignmentFingerprint),
        assignmentFingerprint: text(source.assignmentFingerprint),
        approvalStatus: "APPROVED",
        taxonomyVersion: masterSha,
        packId,
        packVersion,
        reviewEvidence: evidence,
      };
      const advancedAssignment = {
        ...basicAssignment,
        problemTypeKey: text(runtimeRow.problemTypeKey),
        templateKey: text(runtimeRow.templateKey),
        standardUnitKey: text(runtimeRow.standardUnitKey),
        subUnitKey: text(runtimeRow.subUnitKey),
      };
      canonicalAuthority.assignmentsByUid[uid] = [basicAssignment];
      canonicalAuthority.advancedAssignmentsByUid[uid] = [advancedAssignment];
    }

    const finalRecords = [];
    for (const source of catalog.records) {
      const uid = text(source.questionUid);
      const sourceFile = normalizeFile(source.sourceFile);
      const exam = examsByFile.get(sourceFile);
      const identity = identityByUid[uid];
      const gradeEvidence = resolveSourceGrade({
        registeredGrade: exam?.grade || exam?.sourceGrade,
        sourceFile,
        identitySourceFile: identity?.sourceArchiveFile,
      });
      const record = {
        ...source,
        sourceFile,
        currentSourceJsSha256: sourceJsShaByFile.get(sourceFile) || "",
        sourceGrade: gradeEvidence.grade,
        sourceGradeStatus: gradeEvidence.status,
        sourceGradeReason: gradeEvidence.reason,
        effectiveBrowseGrade: gradeEvidence.grade,
        canonicalProjectionVersion: versionBundle.projectionVersion,
        rawTaxonomy: {
          curriculumKey: text(source.curriculumKey),
          courseKey: text(source.courseKey),
          L1: text(source.L1),
          L2: text(source.L2),
          L3: text(source.L3),
          L4: text(source.L4),
        },
      };
      const overlayRows = overlaysByUid.get(uid) || [];
      const exactOverlays = overlayRows.filter((row) =>
        normalizeFile(row.sourceArchiveFile || row.sourceFile) === sourceFile &&
        Number(row.sourceOrdinal) === Number(source.sourceOrdinal),
      );
      const assignments = getByUid(canonicalAuthority.assignmentsByUid, uid);
      const assignmentRows = Array.isArray(assignments) ? assignments : [];
      const candidates = [];
      for (const assignment of assignmentRows) {
        const overlay = exactOverlays.find((row) =>
          text(assignment.packId || "") === text(row._runtimePackId || row.metaFoundationPackId || "") &&
          (!["meta_foundation_runtime", "approved_item_override"].includes(assignment.store) ||
            text(assignment.packVersion) === text(row._runtimePackVersion || row.metaFoundationPackVersion || "")),
        );
        if (["meta_foundation_runtime", "approved_item_override"].includes(assignment.store) && !overlay) continue;
        candidates.push({
          ...record,
          ...(["meta_foundation_runtime", "approved_item_override"].includes(assignment.store) && overlay ? overlay : {}),
          sourceFile,
          sourceOrdinal: Number(source.sourceOrdinal),
          questionUid: uid,
          sourceGrade: gradeEvidence.grade,
          effectiveBrowseGrade: gradeEvidence.grade,
          identityStatus: source.identityStatus,
          sourceIntegrityStatus: source.sourceIntegrityStatus,
          sourceFingerprint: source.sourceFingerprint,
          assignmentFingerprint: source.assignmentFingerprint,
          assignmentEvidence: assignment,
          ...Object.fromEntries([
            "curriculumKey", "courseKey", "L1", "L2",
            "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit",
          ].map((field) => [field, assignment[field]])),
        });
      }
      const candidate = candidates.length === 1 ? candidates[0] : null;
      const assignmentResult = candidate
        ? validateBasicAssignment(candidate, canonicalAuthority)
        : { ok: false, reasons: candidates.length > 1 ? ["assignment_conflict"] : ["assignment_missing"] };
      if (gradeEvidence.status !== "VALID") {
        record.canonicalAssignmentReasons = [gradeEvidence.status];
        record.curriculumKey = record.courseKey = record.L1 = record.L2 = "";
        record.L3 = record.L4 = record.problemTypeKey = record.templateKey = "";
        record.standardCourse = record.standardUnitKey = record.standardUnit = record.subUnitKey = record.subUnit = "";
      } else if (assignmentResult.ok && candidate) {
        Object.assign(record, {
          curriculumKey: candidate.curriculumKey,
          courseKey: candidate.courseKey,
          L1: candidate.L1,
          L2: candidate.L2,
          standardCourse: candidate.standardCourse || "",
          standardUnitKey: candidate.standardUnitKey || "",
          standardUnit: candidate.standardUnit || "",
          subUnitKey: candidate.subUnitKey || "",
          subUnit: candidate.subUnit || "",
          assignmentFingerprint: candidate.assignmentFingerprint,
          assignmentEvidence: candidate.assignmentEvidence || assignmentRows[0] || null,
          canonicalAssignmentReasons: [],
        });
        if (["FINAL_QA", "REVIEW2"].includes(candidate.assignmentEvidence?.reviewEvidence?.approvalType) && source.sourceReviewStatus) {
          // Keep the source's historical review state separately from this
          // receipt's metadata approval. No other source conflict is waived.
          record.sourceReviewStatus = source.sourceReviewStatus;
          record.metadataConflicts = (record.metadataConflicts || []).filter(field => field !== "reviewStatus");
        }
        const matchingOverlay = exactOverlays.find((row) =>
          text(row._runtimePackId) === text(candidate._runtimePackId) ||
          text(row._runtimePackId) === text(candidate.metaFoundationPackId),
        );
        if (matchingOverlay && candidate._runtimePackId &&
            validateAdvancedAssignment(candidate, canonicalAuthority).ok) {
          for (const field of [
            "L3", "L4", "problemTypeKey", "templateKey", "crossConceptKeys",
            "secondaryConceptKeys", "conditionKeys", "integrationPattern",
            "metaFoundationPackId", "metaFoundationPackVersion", "foundationTaxonomyStatus",
            "taxonomyStatus", "difficultyBucket", "difficultyConfidence",
            "difficultyBoundaryFlag", "legacyLevelCompatibility", "reviewStatus",
          ]) {
            // The receipt's value wins when it has one. A receipt that records the field as empty/UNKNOWN (e.g. difficultyBucket: null) must not
            // erase a value the question already shows; the existing value stays.
            const fromReceipt = matchingOverlay[field];
            if (fromReceipt === undefined) continue;
            const blank = (value) => value === null || value === "" || value === "UNKNOWN" || (Array.isArray(value) && !value.length);
            if (blank(fromReceipt) && !blank(record[field])) continue;
            record[field] = fromReceipt;
          }
          const registrationApprovalType = candidate.assignmentEvidence?.reviewEvidence?.approvalType;
          if (["FINAL_QA", "REVIEW2", "META_PIPELINE_AUDIT"].includes(registrationApprovalType)) {
            record.level = matchingOverlay.level || matchingOverlay.legacyLevel;
            record.reviewedExamRegistration = { schemaVersion: "archive-reviewed-exam-registration-projection-v2",
              metadataRevision: matchingOverlay.metadataRevision, sourceJsSha256: record.currentSourceJsSha256,
              reference: candidate.assignmentEvidence.reviewEvidence.reference, sha256: candidate.assignmentEvidence.reviewEvidence.sha256,
              approvalType: registrationApprovalType };
          }
          if (["FINAL_QA", "REVIEW2"].includes(candidate.assignmentEvidence?.reviewEvidence?.approvalType)) {
            record.taxonomyStatus = "CONFIRMED";
            record.nativeCurriculum = record.curriculumKey;
            for (const key of ["L1", "L2", "L3", "L4"]) record["native" + key] = record[key];
            record.nativeTaxonomyPath = [record.nativeCurriculum, record.standardCourse, record.L1, record.L2, record.L3, record.L4].join(" > ");
            record.nativeMetaStatus = "APPROVED";
            const rpmMetadata = Object.fromEntries(["rpmL1", "rpmL2", "rpmL3", "rpmL4", "rpmCurriculum", "rpmSemanticStatus", "rpmSemanticReason", "rpmEvidenceDebtFields"]
              .filter(key => Object.prototype.hasOwnProperty.call(matchingOverlay, key)).map(key => [key, matchingOverlay[key]]));
            // Registered rows record the RPM path as `rpmPrimaryPath {L1..L4}` instead of flat rpmL1..4.
            // Read the registered values as-is (never invented) so the card shows the RPM path.
            const primaryPath = matchingOverlay.rpmPrimaryPath;
            if (primaryPath && typeof primaryPath === "object") {
              for (const level of ["L1", "L2", "L3", "L4"]) {
                const flat = "rpm" + level;
                if (!Object.prototype.hasOwnProperty.call(rpmMetadata, flat) && text(primaryPath[level])) rpmMetadata[flat] = text(primaryPath[level]);
              }
            }
            if (Object.keys(rpmMetadata).length) record.metadataAssignmentEvidence = { ...record.metadataAssignmentEvidence, rpmMetadata };
          }
          record.assignmentEvidence = candidate.assignmentEvidence || assignmentRows[0] || null;
          const issuedParents = issuedDisplayParentsByUid.get(uid) || [];
          const displayProjection = issuedParentDisplayProjection({ source, record,
            assignment: candidate.assignmentEvidence, issued: issuedParents.length === 1 ? issuedParents[0] : null,
            scopeParents: links.records || [], canonicalParents: uniqueParents });
          if (displayProjection) {
            record.metaProjection = displayProjection;
            record.metaProjectionStatus = displayProjection.projectionStatus;
            record.metaProjectionFailureReason = "";
          }
        }
      } else {
        record.canonicalAssignmentReasons = assignmentResult.reasons;
        record.curriculumKey = record.courseKey = record.L1 = record.L2 = "";
        record.L3 = record.L4 = record.problemTypeKey = record.templateKey = "";
        record.standardCourse = record.standardUnitKey = record.standardUnit = record.subUnitKey = record.subUnit = "";
      }
      finalRecords.push(record);
    }

    const basicTaxonomy = uniqueParents;
    const basicScopeLinks = [...(links.records || []), ...(links.sourceParents || [])];
    const basicScopeGroups = (links.groups || []).filter((group) =>
      Array.isArray(group.members) && group.members.length > 0 && group.members.every((member) =>
        uniqueParents.some((parent) =>
          text(parent.curriculumKey) === text(member.curriculumKey) &&
          text(parent.courseKey) === text(member.courseKey) &&
          text(parent.L1) === text(member.L1) &&
          text(parent.L2) === text(member.L2)),
      ),
    );
    const runtimeTaxonomyRows = overlayPacks.flatMap((pack) => pack?.taxonomyRows || []).filter((row) =>
      uniqueParents.some((parent) =>
        text(parent.curriculumKey) === text(row.curriculumKey) &&
        text(parent.courseKey) === text(row.courseKey) &&
        text(parent.L1) === text(row.L1) &&
        text(parent.L2) === text(row.L2)),
    );
    return {
      ...catalog,
      records: finalRecords,
      taxonomy: canonicalAdvancedPaths.concat(runtimeTaxonomyRows),
      basicTaxonomy,
      basicScopeLinks,
      basicScopeGroups,
      canonicalAuthority,
      projectionPolicy,
      canonicalProjectionVersion: versionBundle.projectionVersion,
      indexVersion: versionBundle.projectionVersion,
      metaFoundationRuntimeVersion: text(versionBundle.projectionVersion),
      metaFoundationRuntime: {
        packs: overlayPacks.map((pack) => ({ packId: pack.packId, packVersion: pack.packVersion, runtimeVersion: pack.runtimeVersion })),
        problemTypeCount: foundationTaxonomy.problemTypes?.length || 0,
        bindingCount: Array.isArray(bindings) ? bindings.length : (bindings.bindings || []).length,
      },
      health: { ...(catalog.health || {}), automatic: 0 },
    };
  }

  return {
    CANONICAL_MASTER_PATH,
    SOURCE_VERIFICATION_INDEX_PATH,
    SOURCE_VERIFICATION_SHARD_PREFIX,
    SOURCE_VERIFICATION_TOP_INDEX_PATH,
    SOURCE_VERIFICATION_INDEX_BUCKET_PREFIX,
    SOURCE_VERIFICATION_INDEX_BUCKET_COUNT,
    SOURCE_VERIFICATION_TOP_INDEX_SCHEMA,
    SOURCE_VERIFICATION_INDEX_BUCKET_SCHEMA,
    RESOLVER_VERSION,
    MANIFEST_REQUIRED_PATHS,
    REQUIRED_INPUT_PATHS,
    RUNTIME_INPUT_PATHS,
    runtimeInputPathsFromManifest,
    reviewedRegistrationProofPaths,
    projectionManifestPayload,
    manifestInputPathsFromRuntimePacks,
    normalizeFile,
    pathGrade,
    TEXTBOOK_SOURCES,
    textbookSource,
    resolveSourceGrade,
    resolveSnapshotSourceGrade,
    assignmentFingerprint,
    validateBasicAssignment,
    validateAdvancedAssignment,
    computeProjectionVersion,
    COMPACT_INPUT_MANIFEST_PATH,
    encodeCompactInputManifest,
    decodeCompactInputManifest,
    loadInputBundle,
    loadSourceVerificationShard,
    loadMixedVerificationRecords,
    decodeMixedRows,
    decodeCatalog,
    resolveSubjectProjection,
    resolveCatalog,
  };
});
