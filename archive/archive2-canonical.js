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
  const pathGrade = (file) => {
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

  function manifestInputPathsFromRuntimePacks(runtimePacks = [], includeOptionalPath = () => false) {
    const paths = new Set(MANIFEST_REQUIRED_PATHS);
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
    const courseAllowed = (authority.gradeCourses || []).some(
      (row) =>
        text(row.grade) === grade &&
        text(row.curriculumKey) === curriculumKey &&
        text(row.courseKey) === courseKey,
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
    const canonicalParentExists = parent && (authority.canonicalParents || []).some(
      (candidate) => pathKey(candidate, BASIC_PARENT_FIELDS) === pathKey(parent, BASIC_PARENT_FIELDS),
    );
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

  async function computeProjectionVersion(files = [], resolverVersion = RESOLVER_VERSION) {
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
    return "archive2-canonical-v1:" + await sha256(JSON.stringify({
      resolverVersion: text(resolverVersion),
      files: normalized,
    }));
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
    await Promise.all(REQUIRED_INPUT_PATHS.map(async (inputPath) => {
      const entry = manifest.files.find((row) => text(row.path) === inputPath);
      if (!entry)
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete: " + inputPath);
      let body;
      try { body = await read(inputPath); }
      catch (error) {
        if (error.code) throw error;
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical authority unavailable: " + inputPath);
      }
      if (await sha256(body) !== text(entry.sha256).toLowerCase())
        throw makeError("CANONICAL_INPUT_DIGEST_MISMATCH", "canonical input digest mismatch: " + inputPath);
      try { resources[inputPath] = JSON.parse(body); }
      catch { throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input JSON is invalid: " + inputPath); }
    }));
    const requiredManifestPaths = manifestInputPathsFromRuntimePacks(
      RUNTIME_INPUT_PATHS.map((path) => resources[path]),
      (path) => listed.has(path),
    );
    if (requiredManifestPaths.some((path) => !listed.has(path)))
      throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input manifest is incomplete");
    return { manifest, projectionVersion, files, resources };
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

  function resolveCatalog({
    assignmentEvidence = {},
    versionBundle,
  } = {}) {
    const resources = versionBundle?.resources || {};
    for (const path of REQUIRED_INPUT_PATHS)
      if (!Object.hasOwn(resources, path))
        throw makeError("CANONICAL_AUTHORITY_UNAVAILABLE", "canonical input bundle is incomplete: " + path);
    const catalog = decodeCatalog(resources["data/archive2-catalog.json"]);
    const master = resources[CANONICAL_MASTER_PATH];
    const projectionPolicy = resources["data/archive2-canonical-projection-policy.json"];
    const links = resources["data/basic-scope-parent-links.json"];
    const foundationTaxonomy = resources["data/meta-foundation/compiled/taxonomy_registry.json"];
    const bindings = resources["data/meta-foundation/compiled/curriculum_bindings.json"];
    const overlayPacks = RUNTIME_INPUT_PATHS.map((path) => resources[path]);
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
          ]) if (matchingOverlay[field] !== undefined) record[field] = matchingOverlay[field];
          record.assignmentEvidence = candidate.assignmentEvidence || assignmentRows[0] || null;
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
    RESOLVER_VERSION,
    MANIFEST_REQUIRED_PATHS,
    REQUIRED_INPUT_PATHS,
    RUNTIME_INPUT_PATHS,
    manifestInputPathsFromRuntimePacks,
    normalizeFile,
    pathGrade,
    resolveSourceGrade,
    assignmentFingerprint,
    validateBasicAssignment,
    validateAdvancedAssignment,
    computeProjectionVersion,
    loadInputBundle,
    decodeCatalog,
    resolveSubjectProjection,
    resolveCatalog,
  };
});
