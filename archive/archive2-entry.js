(function () {
  const params = new URLSearchParams(location.search);
  const requested = params.get("archive2Issue");
  const embedded =
    (requested || params.get("unitPastAssign")) && params.get("archive2Embedded") === "1" && parent !== window;
  const O = window.Archive2Output;
  let originalSettings = null,
    originalQuestions = null,
    originalIdentityTitle = "";
  const registeredBodies = new Map();
  const preferenceKey = () =>
    "APMATH_ARCHIVE2_ORIGINAL_CLASSES:" +
    String(
      JSON.parse(localStorage.getItem("APMATH_SESSION") || "{}").id || "local",
    );
  window.isArchive2OriginalBusy = () =>
    Boolean(
      AssignTarget?.progress &&
      Object.values(AssignTarget.progress).some((p) => p.status === "pending"),
    );
  window.setArchive2OriginalSettings = function (value) {
    if (window.isArchive2OriginalBusy() || registeredBodies.size) return;
    originalSettings = O.settings(value);
    if (AssignTarget) AssignTarget.qpp = originalSettings.qpp;
  };
  window.prepareArchive2OriginalAssignment = async function (
    classRow,
    item,
    options,
  ) {
    if (registeredBodies.has(classRow.id))
      return registeredBodies.get(classRow.id);
    const s =
      originalSettings ||
      O.settings({
        header: { title: O.displayTitle(item), subtitle: item.subject },
      });
    if (!originalQuestions) {
      const response = await fetch("data/archive2-catalog.json");
      if (!response.ok)
        throw new Error("원본 문항 목록을 불러오지 못했습니다.");
      const catalog = Archive2Core.decodeCatalog(await response.json());
      originalQuestions = await Archive2Source.load(
        item.file,
        new Map(catalog.sourceHashes).get(item.file),
      );
      originalIdentityTitle =
        catalog.exams.find((e) => e.file === item.file)?.identityTitle ||
        item.file.split("/").pop().replace(/\.js$/, "");
    }
    const body = {
      contract_version: "archive2-v1",
      student_ids: options.studentIds,
      exam_title: s.header.title,
      pdf_qpp: s.qpp,
      original_payload_json: {
        questions: originalQuestions,
        meta: {
          identityTitle: originalIdentityTitle,
          printHeaderOptions: s.header,
          includeQr: s.includeQr,
        },
      },
    };
    registeredBodies.set(classRow.id, body);
    return body;
  };
  window.archive2OriginalReceipt = function (data) {
    if (data?.saved && data.assignment) {
      const key = "original-" + data.assignment.id;
      const payload = JSON.parse(data.assignment.mixed_payload_json);
      localStorage.setItem("archive2Original_" + key, JSON.stringify(payload));
      if (embedded)
        parent.postMessage(
          { type: "archive2-original-saved", assignment: data.assignment, key },
          location.origin,
        );
    }
  };
  if (embedded) {
    document.documentElement.classList.add("archive2-original-host");
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "archive2-original.css";
    document.head.appendChild(css);
    const previousClose = window.closeModal;
    window.closeModal = function () {
      if (window.isArchive2OriginalBusy()) return;
      previousClose();
      parent.postMessage({ type: "archive2-original-close" }, location.origin);
    };
    window.assignTargetMaybeFinish = function () {
      if (!AssignTarget) return;
      renderAssignTargetProgressView();
    };
  }
  window.setArchive2OriginalQpp = function (value) {
    const qpp = Number(value);
    if (
      ![4, 6].includes(qpp) ||
      !AssignTarget ||
      AssignTarget.view === "progress"
    )
      return;
    AssignTarget.qpp = qpp;
    _pendingQpp = qpp;
    localStorage.setItem("APMATH_ARCHIVE2_ORIGINAL_QPP", String(qpp));
    if (AssignTarget.previewOpen) {
      resetAssignTargetPreviewPane();
      AssignTarget.previewOpen = true;
      syncAssignTargetPreviewPane();
    }
  };
  window.openArchive2OriginalIssue = async function () {
    if (!requested) return false;
    const file = String(requested)
      .normalize("NFC")
      .replace(/\\/g, "/")
      .replace(/^(?:archive\/)?exams\//, "");
    const item = normalizedExams().find(
      (ex) => ex.file.normalize("NFC") === file,
    );
    if (!item) {
      document.body.textContent =
        "선택한 기출을 찾을 수 없습니다. 목록을 새로고침해 주세요.";
      return true;
    }
    _pendingFile = item.file;
    _pendingAction = "exam";
    _pendingQpp = [4, 6].includes(Number(params.get("qpp")))
      ? Number(params.get("qpp"))
      : 4;
    originalSettings = O.settings({
      header: { title: O.displayTitle(item), subtitle: item.subject },
      qpp: _pendingQpp,
    });
    await openAssignTargetPanel(item, _pendingQpp);
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey()) || "null");
      if (saved?.grade === AssignTarget?.grade) {
        const ids = (saved.classIds || []).filter(
          (id) => AssignTarget.classState[id],
        );
        ids.forEach((id) => {
          AssignTarget.classState[id].checked = true;
        });
        await Promise.all(ids.map(ensureAssignClassRoster));
        if (ids.length) renderAssignTargetSelectView();
      }
    } catch {
      /* Preferences never replace the actual current roster. */
    }
    if (embedded)
      parent.postMessage({ type: "archive2-original-ready" }, location.origin);
    return true;
  };
  window.rememberArchive2OriginalTargets = function () {
    if (!requested || !AssignTarget) return;
    try {
      localStorage.setItem(
        preferenceKey(),
        JSON.stringify({
          grade: AssignTarget.grade,
          classIds: Object.keys(AssignTarget.classState).filter(
            (id) => AssignTarget.classState[id].checked,
          ),
        }),
      );
    } catch {}
  };
  // Explicit pilot entry. Flag OFF leaves the existing Archive route unchanged.
  if (embedded || (params.get("legacy") !== "1" && params.get("archive2") !== "1")) return;
  const link = document.createElement("a");
  link.href = "workspace.html";
  link.textContent = "Archive 2.0으로 돌아가기";
  link.style.cssText =
    "display:block;padding:12px 20px;background:#203551;color:white;text-align:center;font-weight:700;text-decoration:none";
  document.body.prepend(link);
})();
