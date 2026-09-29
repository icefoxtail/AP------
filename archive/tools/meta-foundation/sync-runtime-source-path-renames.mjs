#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '../../..');
const archiveDir = path.join(root, 'archive');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const runtimeDir = path.join(archiveDir, 'data', 'meta-foundation', 'runtime');
const receiptPath = path.join(runtimeDir, 'runtime-bridge-receipt.json');
const checkOnly = process.argv.includes('--check');

const normalizeFile = value => String(value || '')
  .normalize('NFC')
  .replace(/\\/g, '/')
  .replace(/^\.?\/?archive\/exams\//, '')
  .replace(/^\.?\/?exams\//, '')
  .replace(/^\/+/, '')
  .trim();
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const jsonText = value => JSON.stringify(value, null, 2) + '\n';

function main() {
  const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const renameRows = Array.isArray(identity.verifiedPathRenameHistory)
    ? identity.verifiedPathRenameHistory
    : Array.isArray(identity.incrementalSync?.renamedFiles)
      ? identity.incrementalSync.renamedFiles
    : [];
  const renameByOld = new Map();

  for (const row of renameRows) {
    const from = normalizeFile(row.from);
    const to = normalizeFile(row.to);
    if (!from || !to || from === to) throw new Error('invalid source rename evidence');
    if (renameByOld.has(from) && renameByOld.get(from) !== to) {
      throw new Error('conflicting source rename evidence: ' + from);
    }
    renameByOld.set(from, to);
  }

  const identityByUid = new Map((identity.records || []).map(row => [row.questionUid, row]));
  const metadataByUid = new Map((metadata.records || []).map(row => [row.questionUid, row]));
  const runtimeFiles = fs.readdirSync(runtimeDir)
    .filter(name => name.endsWith('.json') && name !== 'runtime-bridge-receipt.json')
    .sort();

  const changed = [];
  const updatedRows = [];
  const nextTextByPath = new Map();

  for (const name of runtimeFiles) {
    const file = path.join(runtimeDir, name);
    const runtime = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(runtime.records) || !runtime.packId) continue;

    let count = 0;
    for (const row of runtime.records) {
      const id = identityByUid.get(row.questionUid);
      if (!id) continue;

      const oldFile = normalizeFile(row.sourceArchiveFile);
      const newFile = normalizeFile(id.sourceArchiveFile);
      const oldOrdinal = Number(row.sourceOrdinal);
      const newOrdinal = Number(id.sourceOrdinal);
      if (oldFile === newFile && oldOrdinal === newOrdinal) continue;

      if (oldOrdinal !== newOrdinal || renameByOld.get(oldFile) !== newFile) {
        throw new Error(
          'runtime source mismatch without explicit path-only rename: ' +
          row.questionUid + ' ' + oldFile + '#' + oldOrdinal +
          ' -> ' + newFile + '#' + newOrdinal
        );
      }

      const meta = metadataByUid.get(row.questionUid);
      if (!meta ||
          normalizeFile(meta.sourceArchiveFile) !== newFile ||
          Number(meta.sourceOrdinal) !== newOrdinal) {
        throw new Error('metadata not relocated before runtime sync: ' + row.questionUid);
      }

      row.sourceArchiveFile = newFile;
      if (Object.hasOwn(row, 'sourceFile')) row.sourceFile = newFile;
      if (Object.hasOwn(row, 'sourceIdentity')) row.sourceIdentity = newFile + '#' + newOrdinal;
      if (Object.hasOwn(row, 'sourceFingerprint')) row.sourceFingerprint = id.sourceFingerprint;
      if (Object.hasOwn(row, 'approvedSourceFingerprint')) row.approvedSourceFingerprint = id.sourceFingerprint;

      if (row.catalogSeed && typeof row.catalogSeed === 'object') {
        if (normalizeFile(row.catalogSeed.sourceFile) === oldFile) row.catalogSeed.sourceFile = newFile;
        if (normalizeFile(row.catalogSeed.sourceArchiveFile) === oldFile) row.catalogSeed.sourceArchiveFile = newFile;
      }

      count += 1;
      updatedRows.push({
        questionUid: row.questionUid,
        packId: runtime.packId,
        from: oldFile,
        to: newFile,
        sourceOrdinal: newOrdinal
      });
    }

    if (count) {
      const text = jsonText(runtime);
      nextTextByPath.set(file, text);
      changed.push({ packId: runtime.packId, file: name, updatedRecords: count, sha256: sha256(text) });
    }
  }

  if (!changed.length) {
    console.log(JSON.stringify({
      status: 'NO_CHANGE',
      renameEvidenceCount: renameRows.length,
      updatedRecords: 0,
      updatedRuntimeFiles: []
    }, null, 2));
    return;
  }

  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  if (!receipt.reviewedApplyV1 || !Array.isArray(receipt.reviewedApplyV1.packCounts)) {
    throw new Error('runtime receipt packCounts unavailable');
  }
  const packCountById = new Map(receipt.reviewedApplyV1.packCounts.map(row => [row.packId, row]));
  for (const item of changed) {
    const pack = packCountById.get(item.packId);
    if (!pack || pack.runtimeFile !== item.file) {
      throw new Error('runtime receipt pack entry missing/mismatched: ' + item.packId);
    }
    pack.runtimeSha256 = item.sha256;
  }
  if (receipt.checked && Object.hasOwn(receipt.checked, 'questionMetadataDigest')) {
    receipt.checked.questionMetadataDigest = metadata.digest;
  }
  receipt.sourcePathRenameSync = {
    schemaVersion: 'meta-foundation-runtime-source-path-rename-sync-v1',
    identityDigest: identity.identityDigest || '',
    metadataDigest: metadata.digest || '',
    renameEvidence: renameRows.map(row => ({
      from: normalizeFile(row.from),
      to: normalizeFile(row.to),
      questionCount: Number(row.questionCount || 0)
    })),
    updatedRecordCount: updatedRows.length,
    updatedRuntimeFiles: changed,
    updatedRows
  };
  const receiptText = jsonText(receipt);
  nextTextByPath.set(receiptPath, receiptText);

  if (checkOnly) {
    throw new Error(
      'runtime source path rename outputs are stale: ' +
      changed.map(row => row.file + ':' + row.updatedRecords).join(', ')
    );
  }

  for (const [file, text] of nextTextByPath) fs.writeFileSync(file, text, 'utf8');

  console.log(JSON.stringify({
    status: 'UPDATED',
    renameEvidenceCount: renameRows.length,
    updatedRecords: updatedRows.length,
    updatedRuntimeFiles: changed,
    receiptSha256: sha256(receiptText)
  }, null, 2));
}

main();
