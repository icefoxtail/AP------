/* Conflict-safe save transaction for the internal review editor. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.APReviewSaveTransaction = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function (root) {
  'use strict';

  function failure(code, message = code) {
    return Object.assign(new Error(message), { code });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  async function saveReviewSource(options = {}) {
    const fileHandle = options.fileHandle;
    const writer = options.writer || root?.APReviewSourceWriter;
    if (!fileHandle?.getFile || !fileHandle.createWritable) throw failure('REVIEW_FILE_HANDLE_UNAVAILABLE');
    if (!writer?.fingerprintText || !writer.replaceQuestionBankPreservingSource || !writer.validateRoundTrip) throw failure('REVIEW_SOURCE_WRITER_UNAVAILABLE');
    if (!Array.isArray(options.bank)) throw failure('REVIEW_BANK_MUST_BE_ARRAY');

    if (typeof options.waitForPreview === 'function') {
      const preview = await options.waitForPreview(options.revision);
      if (preview && preview.ok === false) throw failure(preview.code || 'REVIEW_PREVIEW_NOT_READY');
    }

    const beforeFile = await fileHandle.getFile();
    const beforeSource = await beforeFile.text();
    const currentDiskFingerprint = await writer.fingerprintText(beforeSource);
    if (options.loadedFingerprint && currentDiskFingerprint !== options.loadedFingerprint) {
      throw Object.assign(failure('EXTERNAL_SOURCE_MODIFIED', '파일을 연 이후 외부에서 파일이 변경되었습니다.'), { currentDiskFingerprint });
    }

    const newSource = writer.replaceQuestionBankPreservingSource(beforeSource, options.bank);
    writer.validateRoundTrip(newSource, options.bank, options.fileName || beforeFile.name || 'archive.js');

    const writable = await fileHandle.createWritable();
    try {
      await writable.write(newSource);
      await writable.close();
    } catch (error) {
      try { await writable.abort?.(); } catch (_) {}
      throw Object.assign(failure('REVIEW_WRITE_FAILED', String(error?.message || error)), { cause: error });
    }

    const verifiedFile = await fileHandle.getFile();
    const verifiedSource = await verifiedFile.text();
    const verifiedFingerprint = await writer.fingerprintText(verifiedSource);
    writer.validateRoundTrip(verifiedSource, options.bank, options.fileName || verifiedFile.name || 'archive.js');

    return {
      source: verifiedSource,
      fingerprint: verifiedFingerprint,
      currentDiskFingerprint,
      bank: clone(options.bank),
      revision: options.revision ?? null,
      postWriteVerified: true,
    };
  }

  return Object.freeze({ saveReviewSource });
}));
