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

  function recoveryFileName(fileName) {
    const baseName = String(fileName || 'archive.js').split(/[\\/]/).pop() || 'archive.js';
    const base = baseName.replace(/\.js$/i, '').replace(/[^A-Za-z0-9._-]+/g, '_') || 'archive';
    return `${base}.before-review-recovery.js`;
  }

  function createEmergencyRecoveryArtifact(beforeSource, fileName) {
    if (typeof beforeSource !== 'string') throw failure('REVIEW_RECOVERY_SOURCE_UNAVAILABLE');
    return Object.freeze({
      source: beforeSource,
      fileName: recoveryFileName(fileName),
      reason: 'POST_WRITE_VERIFICATION_FAILED',
    });
  }

  function postWriteVerificationFailure(error, beforeSource, afterSource, fileName, afterDiskFingerprint) {
    const recovery = createEmergencyRecoveryArtifact(beforeSource, fileName);
    return Object.assign(failure('POST_WRITE_VERIFICATION_FAILED', '저장 후 disk 재검증에 실패했습니다.'), {
      cause: error,
      beforeSource,
      afterSource: typeof afterSource === 'string' ? afterSource : null,
      afterDiskFingerprint: afterDiskFingerprint || null,
      recoverySource: recovery.source,
      recoveryFileName: recovery.fileName,
      recovery,
      writeCompleted: true,
      rollbackAttempted: false,
    });
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

    let writable;
    try {
      writable = await fileHandle.createWritable();
      await writable.write(newSource);
      await writable.close();
    } catch (error) {
      try { await writable?.abort?.(); } catch (_) {}
      const recovery = createEmergencyRecoveryArtifact(beforeSource, options.fileName || beforeFile.name || 'archive.js');
      throw Object.assign(failure('REVIEW_WRITE_FAILED', String(error?.message || error)), {
        cause: error,
        beforeSource,
        recoverySource: recovery.source,
        recoveryFileName: recovery.fileName,
        recovery,
        writeCompleted: false,
        rollbackAttempted: false,
      });
    }

    let verifiedSource = null;
    let verifiedFingerprint = null;
    try {
      const verifiedFile = await fileHandle.getFile();
      verifiedSource = await verifiedFile.text();
      verifiedFingerprint = await writer.fingerprintText(verifiedSource);
      writer.validateRoundTrip(verifiedSource, options.bank, options.fileName || verifiedFile.name || 'archive.js');
    } catch (error) {
      // The write has already closed. Do not overwrite a possible external
      // change with an automatic rollback; expose the exact beforeSource as a
      // user-downloadable recovery artifact instead.
      throw postWriteVerificationFailure(
        error,
        beforeSource,
        verifiedSource,
        options.fileName || beforeFile.name || 'archive.js',
        verifiedFingerprint
      );
    }

    return {
      source: verifiedSource,
      fingerprint: verifiedFingerprint,
      currentDiskFingerprint,
      bank: clone(options.bank),
      revision: options.revision ?? null,
      postWriteVerified: true,
    };
  }

  return Object.freeze({ createEmergencyRecoveryArtifact, saveReviewSource });
}));
