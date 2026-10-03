/* Archive 2.0 consumes the existing engines' printHeaderOptions contract. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Output = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  const databaseName = "apmath-archive2-output-v1";
  const objectStoreName = "outputs";
  const storeOwnerKey = "Archive2OutputOwnerId";
  const ownerUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const supportedQpp = [1, 2, 4, 6, 8];
  let memoryOwnerId = "";

  function contractApi() {
    if (root.Archive2OutputContract) return root.Archive2OutputContract;
    if (typeof require === "function") return require("./archive2-output-contract.js");
    throw new Error("Archive Output Envelope contract is unavailable.");
  }

  function makeRequestError(request, action) {
    const error = request?.error;
    const name = error?.name || "IndexedDBError";
    const message = error?.message || "브라우저 임시 출력 저장소 작업에 실패했습니다.";
    return new Error(`${action}: ${message} (${name})`);
  }

  function openOutputDatabase(indexedDBApi) {
    if (!indexedDBApi?.open) {
      return Promise.reject(new Error("이 브라우저에서 임시 출력 저장소를 사용할 수 없습니다. 다시 열어 주세요."));
    }
    return new Promise((resolve, reject) => {
      let request;
      try {
        request = indexedDBApi.open(databaseName, 1);
      } catch (error) {
        reject(error);
        return;
      }
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(objectStoreName))
          database.createObjectStore(objectStoreName, { keyPath: "outputRequestId" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(makeRequestError(request, "출력 저장소 열기 실패"));
      request.onblocked = () => reject(new Error("출력 저장소 갱신이 다른 탭에서 막혔습니다. 다른 출력 탭을 닫고 다시 열어 주세요."));
    });
  }

  function transact(database, mode, run) {
    return new Promise((resolve, reject) => {
      let transaction;
      let result;
      let request;
      try {
        transaction = database.transaction([objectStoreName], mode);
        const store = transaction.objectStore(objectStoreName);
        request = run(store, (value) => { result = value; });
      } catch (error) {
        reject(error);
        return;
      }
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(makeRequestError(transaction, "출력 저장소 transaction 실패"));
      transaction.onabort = () => reject(makeRequestError(transaction, "출력 저장소 transaction 중단"));
      if (request) {
        if (!request.onsuccess) request.onsuccess = () => { result = request.result; };
        if (!request.onerror) request.onerror = () => reject(makeRequestError(request, "출력 저장소 요청 실패"));
      }
    });
  }

  async function withOutputStore(indexedDBApi, mode, run) {
    const database = await openOutputDatabase(indexedDBApi);
    try {
      return await transact(database, mode, run);
    } finally {
      database.close?.();
    }
  }

  function createOutputStore(indexedDBApi = root.indexedDB, options = {}) {
    const contract = contractApi();
    const cryptoApi = options.crypto || root.crypto;
    return {
      async write(envelope) {
        await contract.validateOutputEnvelope(envelope, {}, cryptoApi);
        const metrics = measureOutputEnvelope(envelope);
        const record = {
          outputRequestId: envelope.outputRequestId,
          ownerId: envelope.ownerId,
          contractVersion: envelope.contractVersion,
          expiresAt: envelope.expiresAt,
          bytes: metrics.canonicalJsonBytes,
          imageDataUrlBytes: metrics.imageDataUrlBytes,
          estimatedPinnedImageBytes: metrics.estimatedPinnedImageBytes,
          envelope,
        };
        try {
          await withOutputStore(indexedDBApi, "readwrite", (store) => store.put(record));
        } catch (error) {
          const name = error?.name || "";
          const detail = name === "QuotaExceededError" || name === "DataCloneError"
            ? `출력 envelope를 통째로 저장하지 못했습니다 (${name}). 저장 공간을 비우고 다시 열어 주세요.`
            : `출력 envelope를 저장하지 못했습니다. 다시 열어 주세요. ${error?.message || ""}`.trim();
          const failure = new Error(detail);
          failure.name = name || "OutputEnvelopeStorageError";
          throw failure;
        }
        return { outputRequestId: envelope.outputRequestId, ownerId: envelope.ownerId, ...metrics };
      },
      async read(outputRequestId, ownerId, mode, readOptions = {}) {
        const record = await withOutputStore(indexedDBApi, "readonly", (store) => store.get(outputRequestId));
        if (!record) throw new Error("출력 envelope를 찾을 수 없습니다. 원본에서 다시 열어 주세요.");
        if (record.outputRequestId !== outputRequestId || record.ownerId !== ownerId)
          throw new Error("출력 요청 identity가 일치하지 않습니다. 원본에서 다시 열어 주세요.");
        if (record.contractVersion !== contract.CONTRACT_VERSION)
          throw new Error("출력 contractVersion이 일치하지 않습니다. 원본에서 다시 열어 주세요.");
        if (record.expiresAt <= (readOptions.now ?? Date.now())) {
          await this.cleanup(ownerId, outputRequestId);
          throw new Error("출력 envelope가 만료되었습니다. 원본에서 다시 열어 주세요.");
        }
        await contract.validateOutputEnvelope(
          record.envelope,
          { outputRequestId, ownerId, mode, now: readOptions.now },
          cryptoApi,
        );
        return record.envelope;
      },
      async cleanup(ownerId, outputRequestId) {
        return withOutputStore(indexedDBApi, "readwrite", (store, setResult) => {
          const request = store.get(outputRequestId);
          request.onsuccess = () => {
            const record = request.result;
            if (record?.ownerId === ownerId && record.outputRequestId === outputRequestId) {
              store.delete(outputRequestId);
              setResult(true);
            } else {
              setResult(false);
            }
          };
          return request;
        });
      },
      async sweepExpired(ownerId, now = Date.now()) {
        if (ownerId && !ownerUuid.test(String(ownerId))) throw new Error("ownerId is invalid for output cleanup.");
        return withOutputStore(indexedDBApi, "readwrite", (store, setResult) => {
          const request = store.getAll();
          request.onsuccess = () => {
            let removed = 0;
            for (const record of request.result || []) {
              if ((!ownerId || record.ownerId === ownerId) && record.expiresAt <= now) {
                store.delete(record.outputRequestId);
                removed += 1;
              }
            }
            setResult(removed);
          };
          return request;
        });
      },
    };
  }

  function measureOutputEnvelope(envelope) {
    return contractApi().measureOutputEnvelope(envelope);
  }

  function outputOwnerId() {
    if (memoryOwnerId) return memoryOwnerId;
    const cryptoApi = root.crypto;
    if (!cryptoApi?.randomUUID) throw new Error("secure UUID generation is unavailable");
    try {
      const storage = root.sessionStorage;
      const saved = storage?.getItem(storeOwnerKey);
      if (saved && ownerUuid.test(saved)) {
        memoryOwnerId = saved;
        return memoryOwnerId;
      }
      memoryOwnerId = cryptoApi.randomUUID();
      storage?.setItem(storeOwnerKey, memoryOwnerId);
    } catch {
      memoryOwnerId = cryptoApi.randomUUID();
    }
    return memoryOwnerId;
  }

  async function publishOutputEnvelope(input, options = {}) {
    const contract = contractApi();
    const cryptoApi = options.crypto || root.crypto;
    const envelope = await contract.createOutputEnvelope(
      { ...input, ownerId: input.ownerId || outputOwnerId() },
      cryptoApi,
    );
    const store = createOutputStore(options.indexedDB || root.indexedDB, { crypto: cryptoApi });
    await store.sweepExpired();
    await store.write(envelope);
    return envelope;
  }

  async function publishOutputEnvelopeMode(envelope, mode, options = {}) {
    if (mode === envelope?.mode) return envelope;
    if (!Array.isArray(envelope?.questions) || !envelope.questions.length)
      throw new Error("현재 출력 Envelope에 같은 source의 문항이 없습니다.");
    return publishOutputEnvelope({
      sourceKind: envelope.sourceKind,
      sourceId: envelope.sourceId,
      ...(envelope.paperId ? { paperId: envelope.paperId } : {}),
      ...(envelope.assignmentId ? { assignmentId: envelope.assignmentId } : {}),
      ownerId: envelope.ownerId,
      mode,
      questionCount: envelope.questionCount,
      questionUids: envelope.questionUids,
      meta: envelope.meta,
      questions: envelope.questions,
    }, options);
  }

  async function readOutputEnvelope(outputRequestId, ownerId, mode, options = {}) {
    const store = createOutputStore(options.indexedDB || root.indexedDB, { crypto: options.crypto || root.crypto });
    return store.read(outputRequestId, ownerId, mode, options);
  }

  async function storeOutputEnvelope(envelope, options = {}) {
    const store = createOutputStore(options.indexedDB || root.indexedDB, { crypto: options.crypto || root.crypto });
    await store.sweepExpired();
    await store.write(envelope);
    return envelope;
  }

  const text = (v, n) =>
    String(v ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n);
  function displayTitle(exam = {}) {
    const kind = materialKind(exam);
    if (kind === "textbook") {
      return text(exam.topic || exam.subject || "교과서", 80);
    }
    const variant = /유사\s*(\d+)/.exec(exam.file || "");
    if (kind === "unit") {
      return [exam.grade, exam.semester ? exam.semester + "학기" : "", exam.topic || exam.subject, "단원평가", variant ? "유사 " + variant[1] : ""].filter(Boolean).join(" ");
    }
    const year = String(exam.year || "").replace(/^(\d{2})$/, "20$1");
    const period =
      exam.examType === "mid"
        ? "중간고사"
        : exam.examType === "final"
          ? "기말고사"
          : "";
    return (
      [
        year,
        exam.school,
        exam.grade,
        exam.semester ? exam.semester + "학기" : "",
        period,
        kind === "similar" ? "유사문제" + (variant ? " " + variant[1] : "") : "",
      ]
        .filter(Boolean)
        .join(" ") || text(exam.topic || exam.subject || "수학 시험지", 80)
    );
  }
  // Browse labels only: source contentType and canonical metadata are unchanged.
  function materialKind(exam = {}) {
    if (exam.contentType === "교과서" || (exam.file || "").startsWith("textbooks/")) return "textbook";
    if (exam.contentType === "단원평가") return "unit";
    if ((exam.file || "").startsWith("similar/") || ["유형", "기출유사", "기출심화"].includes(exam.contentType)) return "similar";
    return exam.contentType === "기출" ? "exam" : "other";
  }
  function matchesMaterial(exam, filter) {
    if (!filter) return true;
    return filter === "nonexam" ? materialKind(exam) !== "exam" : materialKind(exam) === filter;
  }
  function normalize(raw = {}, fallback = "수학 시험지") {
    return {
      title: text(raw.title || fallback, 80),
      subtitle: text(raw.subtitle, 120),
      metaRight: text(raw.metaRight, 60),
      showNameLine: raw.showNameLine !== false,
      showScoreLine: raw.showScoreLine !== false,
      applyToSolution: raw.applyToSolution !== false,
      applyToAnswer: raw.applyToAnswer !== false,
    };
  }
  function settings(raw = {}) {
    return {
      header: normalize(raw.header),
      qpp: supportedQpp.includes(Number(raw.qpp)) ? Number(raw.qpp) : 4,
      includeQr: raw.includeQr === true,
    };
  }
  function markup(value = {}, prefix = "print", disabled = false) {
    const s = settings(value),
      esc = (v) =>
        String(v ?? "").replace(
          /[&<>"']/g,
          (c) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            })[c],
        ),
      off = disabled ? "disabled" : "";
    return `<div class="header-fields" data-output-settings="${prefix}">${[
      ["title", "시험지 제목"],
      ["subtitle", "부제"],
      ["metaRight", "오른쪽 표시"],
    ]
      .map(
        ([key, label]) =>
          `<label>${label}<input data-output-field="${key}" value="${esc(s.header[key])}" maxlength="${key === "subtitle" ? 120 : key === "title" ? 80 : 60}" ${off}></label>`,
      )
      .join(
        "",
      )}<label>한 쪽 문항 수<select data-output-field="qpp" ${off}>${supportedQpp.map((n) => `<option value="${n}" ${s.qpp === n ? "selected" : ""}>${n}문항</option>`).join("")}</select></label>${[
      ["showNameLine", "이름란"],
      ["showScoreLine", "점수란"],
      ["includeQr", "QR 포함"],
    ]
      .map(
        ([key, label]) =>
          `<label class="check"><input type="checkbox" data-output-field="${key}" ${(key === "includeQr" ? s.includeQr : s.header[key]) ? "checked" : ""} ${off}>${label}</label>`,
      )
      .join(
        "",
      )}<p class="muted">학생은 학생 포털의 ‘내 시험지’에서 확인합니다. QR은 필요할 때만 포함하세요.</p></div>`;
  }
  function read(element, current) {
    const next = settings(current),
      key = element.dataset.outputField,
      value = element.type === "checkbox" ? element.checked : element.value;
    if (key === "qpp") next.qpp = Number(value);
    else if (key === "includeQr") next.includeQr = value === true;
    else next.header[key] = value;
    return next;
  }
  function applyUrl(url, value) {
    const s = settings(value);
    url.searchParams.set("qpp", String(s.qpp));
    url.searchParams.set("submitQr", "0");
    url.searchParams.set("solQr", s.includeQr ? "1" : "0");
    url.searchParams.set("portalQr", "1");
    url.searchParams.set("preRegistered", "1");
    url.searchParams.set("assignmentRegistered", "1");
    return url;
  }
  function engineUrl(path, base) {
    const url = new URL(path, base);
    url.searchParams.set("archive2Context", "archive2");
    url.searchParams.set("archive2OutputContract", contractApi().CONTRACT_VERSION);
    // Static hosts may retain an older inline engine at the unversioned URL.
    url.searchParams.set("v", "20261003-student-mode-layout-2");
    return url;
  }
  function outputEnvelopeUrl(path, base, envelope, options = {}) {
    const url = engineUrl(path, base);
    url.searchParams.set("outputRequestId", envelope.outputRequestId);
    url.searchParams.set("outputOwnerId", envelope.ownerId);
    url.searchParams.set("mode", envelope.mode);
    url.searchParams.set("q", String(envelope.questionCount));
    if (envelope.meta?.qpp) url.searchParams.set("qpp", String(envelope.meta.qpp));
    applyUrl(url, {
      header: envelope.meta?.printHeaderOptions,
      qpp: envelope.meta?.qpp,
      includeQr: envelope.meta?.includeQr,
    });
    const qpp = Number(envelope.meta?.qpp);
    if (supportedQpp.includes(qpp)) url.searchParams.set("qpp", String(qpp));
    if (options.studio) url.searchParams.set("studio", "1");
    if (options.preview) {
      url.searchParams.set("archive2Review", "1");
      url.searchParams.set("preview", "1");
    }
    if (options.assignmentId) url.searchParams.set("assignmentId", options.assignmentId);
    return url;
  }
  return {
    displayTitle,
    materialKind,
    matchesMaterial,
    normalize,
    settings,
    markup,
    read,
    applyUrl,
    engineUrl,
    outputEnvelopeUrl,
    outputOwnerId,
    createOutputStore,
    measureOutputEnvelope,
    publishOutputEnvelope,
    publishOutputEnvelopeMode,
    readOutputEnvelope,
    storeOutputEnvelope,
  };
});
