/* Shared Archive 2.0 output contract used by browsers and the Worker renderer. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2OutputContract = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CONTRACT_VERSION = "archive2-output-envelope-v1";
  const DEFAULT_TTL_MS = 30 * 60 * 1000;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const HEX_256 = /^[0-9a-f]{64}$/i;

  function fail(message) {
    throw new Error(`Archive Output Envelope: ${message}`);
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  // RFC 8785 JSON Canonicalization Scheme for the JSON data used in this contract.
  // JavaScript's number serialization follows the required IEEE-754 formatting;
  // sorting uses UTF-16 code units and array order remains semantically significant.
  function canonicalizeOutputValue(value, ancestors = new Set()) {
    if (value === null || typeof value === "boolean" || typeof value === "string")
      return JSON.stringify(value);
    if (typeof value === "number") {
      if (!Number.isFinite(value)) fail("non-finite numbers are not canonical JSON");
      return JSON.stringify(value);
    }
    if (typeof value !== "object") fail("value is not JSON serializable");
    if (ancestors.has(value)) fail("cyclic values are not canonical JSON");
    ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        return `[${value
          .map((item) => {
            if (item === undefined) fail("undefined array item is not canonical JSON");
            return canonicalizeOutputValue(item, ancestors);
          })
          .join(",")}]`;
      }
      if (!isPlainObject(value)) fail("only plain objects are canonical JSON");
      const keys = Object.keys(value).sort();
      return `{${keys
        .map((key) => {
          if (value[key] === undefined) fail("undefined object property is not canonical JSON");
          return `${JSON.stringify(key)}:${canonicalizeOutputValue(value[key], ancestors)}`;
        })
        .join(",")}}`;
    } finally {
      ancestors.delete(value);
    }
  }

  function envelopeWithoutHash(envelope) {
    const value = { ...envelope };
    delete value.payloadHash;
    return value;
  }

  async function sha256Hex(value, cryptoApi = globalThis.crypto) {
    if (!cryptoApi?.subtle?.digest) fail("Web Crypto SHA-256 is unavailable");
    const bytes = new TextEncoder().encode(canonicalizeOutputValue(value));
    const digest = await cryptoApi.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function measureOutputEnvelope(envelope) {
    const canonicalJson = canonicalizeOutputValue(envelope);
    let imageDataUrlBytes = 0;
    let estimatedPinnedImageBytes = 0;
    const visit = (value) => {
      if (typeof value === "string") {
        const match = /^data:image\/[^;,]+;base64,([a-z0-9+/]*={0,2})$/i.exec(value);
        if (match) {
          imageDataUrlBytes += new TextEncoder().encode(value).byteLength;
          estimatedPinnedImageBytes += Math.floor(match[1].length * 3 / 4) - (match[1].endsWith("==") ? 2 : match[1].endsWith("=") ? 1 : 0);
        }
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (value && typeof value === "object") Object.values(value).forEach(visit);
    };
    visit(envelope);
    return {
      canonicalJsonCodeUnits: canonicalJson.length,
      canonicalJsonBytes: new TextEncoder().encode(canonicalJson).byteLength,
      browserJsonBytes: new TextEncoder().encode(JSON.stringify(envelope)).byteLength,
      imageDataUrlBytes,
      estimatedPinnedImageBytes,
    };
  }

  function questionUid(question) {
    const uid = String(
      question?.questionUid ||
      question?.source_question_uid ||
      question?._sourceQuestionUid ||
      "",
    );
    return uid || null;
  }

  function validateShape(envelope) {
    if (!isPlainObject(envelope)) fail("envelope must be a plain object");
    if (envelope.contractVersion !== CONTRACT_VERSION)
      fail(`contractVersion mismatch (expected ${CONTRACT_VERSION})`);
    if (!UUID.test(String(envelope.outputRequestId || ""))) fail("outputRequestId is invalid");
    if (!UUID.test(String(envelope.ownerId || ""))) fail("ownerId is invalid");
    if (!String(envelope.sourceKind || "").trim()) fail("sourceKind is required");
    if (
      !String(envelope.sourceId || "").trim() &&
      !String(envelope.paperId || "").trim() &&
      !String(envelope.assignmentId || "").trim()
    ) fail("source identity is required");
    if (!["exam", "sol", "ans"].includes(envelope.mode)) fail("mode is invalid");
    if (!Number.isSafeInteger(envelope.questionCount) || envelope.questionCount < 1)
      fail("questionCount is invalid");
    if (Array.isArray(envelope.questions) && envelope.questions.length !== envelope.questionCount)
      fail("questionCount does not match questions length");
    if (!Array.isArray(envelope.questionUids) || envelope.questionUids.length !== envelope.questionCount)
      fail("questionUids count mismatch");
    if (envelope.questionUids.some((uid) => uid !== null && (typeof uid !== "string" || !uid.trim())))
      fail("questionUids contains an invalid identity");
    if (!isPlainObject(envelope.meta)) fail("meta must be a plain object");

    const hasQuestions = Array.isArray(envelope.questions);
    const hasReference = isPlainObject(envelope.immutableReference);
    if (hasQuestions === hasReference)
      fail("exactly one of questions or immutableReference is required");
    if (hasQuestions) {
      const actualUids = envelope.questions.map(questionUid);
      if (actualUids.some((uid, index) => uid && uid !== envelope.questionUids[index]))
        fail("questionUids order mismatch");
    } else {
      const ref = envelope.immutableReference;
      if (!String(ref.kind || "").trim() || !String(ref.id || "").trim())
        fail("immutableReference identity is incomplete");
      if (ref.snapshotHash && !HEX_256.test(String(ref.snapshotHash)))
        fail("immutableReference snapshotHash is invalid");
    }

    if (!Number.isSafeInteger(envelope.createdAt) || envelope.createdAt < 0)
      fail("createdAt is invalid");
    if (!Number.isSafeInteger(envelope.expiresAt) || envelope.expiresAt <= envelope.createdAt)
      fail("expiresAt is invalid");
    if (envelope.expiresAt - envelope.createdAt > DEFAULT_TTL_MS)
      fail("TTL exceeds 30 minutes");
    if (!HEX_256.test(String(envelope.payloadHash || ""))) fail("payloadHash is invalid");
  }

  async function createOutputEnvelope(input, cryptoApi = globalThis.crypto) {
    if (!isPlainObject(input)) fail("producer input must be a plain object");
    const now = Date.now();
    const version = input.contractVersion ?? CONTRACT_VERSION;
    if (version !== CONTRACT_VERSION) fail("producer contractVersion mismatch");
    if (!cryptoApi?.randomUUID) fail("secure UUID generation is unavailable");
    const envelope = {
      ...input,
      contractVersion: CONTRACT_VERSION,
      outputRequestId: input.outputRequestId || cryptoApi.randomUUID(),
      ownerId: input.ownerId || cryptoApi.randomUUID(),
      createdAt: input.createdAt ?? now,
      expiresAt: input.expiresAt ?? now + DEFAULT_TTL_MS,
    };
    delete envelope.payloadHash;
    // Validate all unsigned fields before committing their digest.
    validateShape({ ...envelope, payloadHash: "0".repeat(64) });
    envelope.payloadHash = await sha256Hex(envelope, cryptoApi);
    return envelope;
  }

  async function validateOutputEnvelope(envelope, expected = {}, cryptoApi = globalThis.crypto) {
    validateShape(envelope);
    if (expected.outputRequestId && envelope.outputRequestId !== expected.outputRequestId)
      fail("outputRequestId mismatch");
    if (expected.ownerId && envelope.ownerId !== expected.ownerId) fail("ownerId mismatch");
    if (expected.mode && envelope.mode !== expected.mode) fail("mode mismatch");
    if (expected.sourceKind && envelope.sourceKind !== expected.sourceKind)
      fail("sourceKind mismatch");
    const now = expected.now ?? Date.now();
    if (!Number.isFinite(now) || envelope.expiresAt <= now) fail("output has expired");
    if (envelope.createdAt > now + 60_000) fail("createdAt is in the future");
    const actualHash = await sha256Hex(envelopeWithoutHash(envelope), cryptoApi);
    if (actualHash !== envelope.payloadHash) fail("payloadHash mismatch");
    return true;
  }

  return {
    CONTRACT_VERSION,
    DEFAULT_TTL_MS,
    canonicalizeOutputValue,
    sha256Hex,
    measureOutputEnvelope,
    createOutputEnvelope,
    validateOutputEnvelope,
  };
});
