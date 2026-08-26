import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/**
 * Build the approved Phase 1B metadata sidecar.
 *
 * This builder deliberately promotes only evidence already accepted by the
 * archive classification output or a semantic-review ledger with
 * `reviewed_pass`. Candidate-only tags remain explicit review holds.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'complete-subunit-classification', 'archive-complete-subunit-classification-v1.json');
const reviewDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'review');
const outputJsonPath = path.join(archiveDir, 'data', 'question_metadata.json');
const outputRuntimePath = path.join(archiveDir, 'question-meta.js');
const tagMasterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const revision = 'archive-metadata-v1-phase1b-20260825';

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function makeSourceFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function makeContentFingerprint(question) {
    return sha256(JSON.stringify({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        image: question?.image ?? null
    }));
}

function normalizeFile(value) {
    return String(value || '')
        .normalize('NFC')
        .replace(/\\/g, '/')
        .replace(/^\.?\/?archive\/exams\//, '')
        .replace(/^\.?\/?exams\//, '')
        .replace(/^\/+/, '')
        .replace(/[?#].*$/, '')
        .trim();
}

function readArchiveQuestions(fullPath) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 1500 });
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error(`questions array not found: ${fullPath}`);
    return questions;
}

function readSourceQuestionMap(identity) {
    const byUid = new Map();
    const files = new Map();
    for (const record of identity.records) {
        const sourceFile = normalizeFile(record.sourceArchiveFile);
        if (!files.has(sourceFile)) files.set(sourceFile, []);
        files.get(sourceFile).push(record);
    }
    for (const [sourceFile, records] of files) {
        const questions = readArchiveQuestions(path.join(archiveDir, 'exams', sourceFile));
        for (const record of records) {
            const question = questions[Number(record.sourceOrdinal) - 1];
            if (!question) throw new Error(`source join failed: ${sourceFile}#${record.sourceOrdinal}`);
            byUid.set(record.questionUid, question);
        }
    }
    return byUid;
}

function readReviewedPassOverrides() {
    const overrides = new Map();
    for (const file of fs.readdirSync(reviewDir).filter(name => name.endsWith('.json'))) {
        const report = JSON.parse(fs.readFileSync(path.join(reviewDir, file), 'utf8'));
        for (const item of report.reviews || []) {
            if (item.review?.disposition !== 'reviewed_pass') continue;
            if (overrides.has(item.questionUid)) throw new Error(`duplicate reviewed_pass UID: ${item.questionUid}`);
            const candidate = item.candidate || {};
            overrides.set(item.questionUid, {
                subUnitKey: String(candidate.subUnitKeyCandidate || '').trim(),
                subUnit: String(candidate.subUnitCandidate || '').trim(),
                conceptClusterKey: String(candidate.conceptClusterKeyCandidate || '').trim(),
                problemTypeKey: String(candidate.problemTypeKeyCandidate || '').trim(),
                templateKey: String(candidate.templateKeyCandidate || '').trim(),
                difficultyBucket: String(candidate.difficultyBucketCandidate || '').trim(),
                reviewSource: `archive/_generated/intelligence/phase1/pilot/review/${file}`
            });
        }
    }
    return overrides;
}

function nonEmpty(value) {
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function pick(...values) {
    return values.find(nonEmpty) ?? '';
}

function readCanonicalSubUnitLabels() {
    const master = JSON.parse(fs.readFileSync(tagMasterPath, 'utf8'));
    const labels = {};
    for (const row of Array.isArray(master) ? master : []) {
        const key = String(row?.subUnitKey || row?.key || '').trim();
        const label = String(row?.subUnit || row?.labelKo || '').trim();
        if (row?.keyType !== 'subUnitKey' || !key || !label) continue;
        labels[key] = label;
    }
    if (!Object.keys(labels).length) throw new Error('canonical subunit label map is empty');
    return labels;
}

function buildMetadata() {
    const identityRaw = fs.readFileSync(identityPath, 'utf8');
    const classificationRaw = fs.readFileSync(classificationPath, 'utf8');
    const identity = JSON.parse(identityRaw);
    const classification = JSON.parse(classificationRaw);
    if (!Array.isArray(identity.records) || !Array.isArray(classification.records)) throw new Error('identity/classification records missing');
    const sourceQuestions = readSourceQuestionMap(identity);
    const canonicalSubUnitLabels = readCanonicalSubUnitLabels();
    const classificationByUid = new Map(classification.records.map(record => [record.questionUid, record]));
    const reviewedPass = readReviewedPassOverrides();
    const records = [];
    const sourceByKey = new Map();
    const sourceFingerprintFailures = [];
    const sourceClassificationConflicts = [];
    const staleReviewedConflicts = [];

    for (const identityRecord of identity.records) {
        const uid = identityRecord.questionUid;
        const classified = classificationByUid.get(uid);
        const question = sourceQuestions.get(uid);
        if (!classified || !question) throw new Error(`metadata join failed: ${uid}`);
        const classificationData = classified.classification || {};
        const reviewed = reviewedPass.get(uid);
        const sourceFingerprint = makeSourceFingerprint(question);
        if (identityRecord.sourceFingerprint && identityRecord.sourceFingerprint !== sourceFingerprint) {
            sourceFingerprintFailures.push({
                questionUid: uid,
                sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
                sourceOrdinal: Number(identityRecord.sourceOrdinal),
                identityFingerprint: identityRecord.sourceFingerprint,
                currentFingerprint: sourceFingerprint
            });
        }
        const standardUnitKey = pick(question.standardUnitKey, classified.standardUnitKey);
        const standardUnit = pick(question.standardUnit, classified.standardUnit);
        const standardCourse = pick(question.standardCourse, question.course, classified.standardCourse);
        const sourceSubUnitKey = pick(question.subUnitKey, question.sub_unit_key);
        const sourceSubUnit = pick(question.subUnit, question.sub_unit);
        const classifiedSubUnitKey = pick(classificationData.subUnitKey);
        const classifiedSubUnit = pick(classificationData.subUnit);
        const reviewedSubUnitKey = pick(reviewed?.subUnitKey);
        const reviewedSubUnit = pick(reviewed?.subUnit);
        if (sourceSubUnitKey && classifiedSubUnitKey && sourceSubUnitKey !== classifiedSubUnitKey) {
            sourceClassificationConflicts.push({ questionUid: uid, field: 'subUnitKey', source: sourceSubUnitKey, classification: classifiedSubUnitKey });
        }
        if (sourceSubUnit && classifiedSubUnit && sourceSubUnit !== classifiedSubUnit) {
            sourceClassificationConflicts.push({ questionUid: uid, field: 'subUnit', source: sourceSubUnit, classification: classifiedSubUnit });
        }
        if (sourceSubUnitKey && reviewedSubUnitKey && sourceSubUnitKey !== reviewedSubUnitKey) {
            staleReviewedConflicts.push({ questionUid: uid, field: 'subUnitKey', source: sourceSubUnitKey, reviewed: reviewedSubUnitKey });
        }
        if (sourceSubUnit && reviewedSubUnit && sourceSubUnit !== reviewedSubUnit) {
            staleReviewedConflicts.push({ questionUid: uid, field: 'subUnit', source: sourceSubUnit, reviewed: reviewedSubUnit });
        }
        // Production values are authoritative.  Classification/review values
        // may fill a blank, but may never overwrite production.
        const subUnitKey = pick(sourceSubUnitKey, reviewedSubUnitKey, classifiedSubUnitKey);
        const subUnit = pick(sourceSubUnit, reviewedSubUnit, classifiedSubUnit);
        const conceptClusterKey = pick(question.conceptClusterKey, reviewed?.conceptClusterKey, classificationData.conceptClusterKey);
        const problemTypeKey = pick(reviewed?.problemTypeKey, question.problemTypeKey, question.typeKey);
        const templateKey = pick(reviewed?.templateKey, question.templateKey);
        const difficultyBucket = pick(question.difficultyBucket, question.difficulty, question.level, reviewed?.difficultyBucket);
        const semanticallyReviewed = Boolean(reviewed && (reviewed.problemTypeKey || reviewed.templateKey || reviewed.conceptClusterKey));
        const fieldStatus = {
            standardUnit: 'approved_source',
            subUnit: sourceSubUnitKey || sourceSubUnit ? 'approved_source' : (reviewedSubUnitKey || reviewedSubUnit ? 'approved_semantic_review' : 'approved_classification'),
            concept: semanticallyReviewed ? 'approved_semantic_review' : 'approved_classification',
            problemType: problemTypeKey ? (semanticallyReviewed ? 'approved_semantic_review' : 'approved_source') : 'manual_review_pending',
            template: templateKey ? (semanticallyReviewed ? 'approved_semantic_review' : 'approved_source') : 'manual_review_pending',
            difficulty: difficultyBucket ? 'approved_source' : 'manual_review_pending'
        };
        const record = {
            questionUid: uid,
            sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
            sourceOrdinal: Number(identityRecord.sourceOrdinal),
            sourceQuestionNo: identityRecord.sourceQuestionNo ?? null,
            sourceFingerprint,
            contentFingerprint: makeContentFingerprint(question),
            standardCourse,
            standardUnitKey,
            standardUnit,
            subUnitKey,
            subUnit,
            conceptClusterKey,
            problemTypeKey,
            templateKey,
            difficultyBucket,
            tagConfidence: semanticallyReviewed ? 'high' : String(classificationData.confidence || 'rule_inferred'),
            tagStatus: semanticallyReviewed ? 'approved_semantic_review' : 'approved_subunit_concept_partial',
            metadataStatus: semanticallyReviewed ? 'approved_semantic_review' : 'approved_partial_with_explicit_holds',
            fieldStatus,
            metadataRevision: revision,
            approvalEvidence: semanticallyReviewed ? [reviewed.reviewSource] : ['archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json']
        };
        records.push(record);
        const sourceKey = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
        if (sourceByKey.has(sourceKey)) throw new Error(`duplicate source metadata key: ${sourceKey}`);
        sourceByKey.set(sourceKey, record);
    }

    records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, 'en'));
    const counts = {
        records: records.length,
        uidUnique: new Set(records.map(record => record.questionUid)).size === records.length,
        sourceJoinUnique: sourceByKey.size === records.length,
        semanticallyReviewed: records.filter(record => record.metadataStatus === 'approved_semantic_review').length,
        explicitProblemTypeHolds: records.filter(record => record.fieldStatus.problemType === 'manual_review_pending').length,
        explicitTemplateHolds: records.filter(record => record.fieldStatus.template === 'manual_review_pending').length,
        explicitDifficultyHolds: records.filter(record => record.fieldStatus.difficulty === 'manual_review_pending').length
    };
    if (counts.records !== identity.records.length || !counts.uidUnique || !counts.sourceJoinUnique) throw new Error('metadata cardinality gate failed');
    if (sourceFingerprintFailures.length || sourceClassificationConflicts.length) {
        throw new Error(`metadata approval blocked: ${JSON.stringify({ sourceFingerprintFailures: sourceFingerprintFailures.length, sourceClassificationConflicts: sourceClassificationConflicts.length, conflictSample: sourceClassificationConflicts.slice(0, 5) })}`);
    }
    const stable = {
        schemaVersion: 'archive-question-metadata-v1',
        metadataRevision: revision,
        generatedAt: new Date().toISOString(),
        approvalStatus: 'APPROVED_PARTIAL_WITH_EXPLICIT_HOLDS',
        promotionPolicy: {
            candidateOnlyTagsPromoted: false,
            reviewedPassOnlyForSemanticTags: true,
            unknownFieldsRemainExplicit: true,
            sourceJsWrites: false,
            databaseWrites: false
        },
        sourceDigests: {
            identityMap: sha256(identityRaw),
            completeClassification: sha256(classificationRaw),
            tagMaster: sha256(fs.readFileSync(tagMasterPath, 'utf8'))
        },
        canonicalSubUnitLabels,
        consistency: {
            sourceFingerprintFailures: sourceFingerprintFailures.length,
            sourceClassificationConflicts: sourceClassificationConflicts.length,
            staleReviewedConflicts: staleReviewedConflicts.length,
            productionValuesWinOnMerge: true
        },
        reviewedPassCount: reviewedPass.size,
        counts,
        records
    };
    return { ...stable, digest: sha256(JSON.stringify(stable)) };
}

function runtimeSourceLegacy(report) {
    return `// Generated by archive/tools/intelligence/build-approved-question-metadata-v1.mjs\n(function(){\n  const state = { data: null, byUid: new Map(), bySource: new Map() };\n  function sourceFile(value) { return String(value || '').replace(/\\\\/g, '/').replace(/^\\.?\\/?archive\\/exams\\//, '').replace(/^\\.?\\/?exams\\//, '').replace(/^\\/+/, '').replace(/[?#].*$/, '').trim(); }\n  function get(questionUidInput, sourceFileInput, ordinal) {\n    const questionUid = String(questionUidInput || '').trim();\n    if (questionUid && state.byUid.has(questionUid)) return state.byUid.get(questionUid);\n    const file = sourceFile(sourceFileInput);\n    const n = Number(ordinal);\n    if (file && Number.isInteger(n) && n > 0) return state.bySource.get(file + '#' + n) || null;\n    return null;\n  }\n  window.getArchiveQuestionMetadata = function(ref) {\n    const value = ref || {};\n    return get(value.questionUid || value.sourceQuestionUid, value.sourceArchiveFile || value.sourceFile, value.sourceOrdinal || value.sourceQuestionOrdinal);\n  };\n  window.mergeArchiveQuestionMetadata = function(question, ref) {\n    const q = question || {};\n    const meta = window.getArchiveQuestionMetadata(ref);\n    if (!meta) return q;\n    const merged = { ...q };\n    for (const field of ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','conceptClusterKey','problemTypeKey','templateKey','difficultyBucket','tagConfidence','tagStatus','metadataStatus','metadataRevision']) {\n      if (meta[field] !== undefined && meta[field] !== null && String(meta[field]).trim() !== '') merged[field] = meta[field];\n    }\n    merged._archiveMetadata = meta;\n    return merged;\n  };\n  window.__ARCHIVE_METADATA_READY__ = fetch(new URL('data/question_metadata.json', document.baseURI))\n    .then(response => { if (!response.ok) throw new Error('metadata sidecar HTTP ' + response.status); return response.json(); })\n    .then(data => {\n      state.data = data;\n      for (const record of data.records || []) {\n        state.byUid.set(record.questionUid, record);\n        state.bySource.set(record.sourceArchiveFile + '#' + record.sourceOrdinal, record);\n      }\n      window.ARCHIVE_QUESTION_METADATA = data;\n      return data;\n    })\n    .catch(error => { console.warn('[metadata] approved sidecar load failed:', error); return null; });\n})();\n`;
}

function runtimeSource(report) {
    return `// Generated by archive/tools/intelligence/build-approved-question-metadata-v1.mjs
(function(){
  const state = { data: null, byUid: new Map(), bySource: new Map() };
  const canonicalSubUnitLabels = Object.freeze(${JSON.stringify(report.canonicalSubUnitLabels)});
  window.ARCHIVE_SUBUNIT_LABELS = canonicalSubUnitLabels;
  window.getArchiveSubUnitLabel = function(key, fallback) {
    const normalizedKey = String(key || '').trim();
    return String(canonicalSubUnitLabels[normalizedKey] || fallback || '').trim();
  };
  function sourceFile(value) { return String(value || '').replace(/\\\\/g, '/').replace(/^\\.?\\/?archive\\/exams\\//, '').replace(/^\\.?\\/?exams\\//, '').replace(/^\\/+/, '').replace(/[?#].*$/, '').trim(); }
  function get(questionUidInput, sourceFileInput, ordinal) {
    const questionUid = String(questionUidInput || '').trim();
    if (questionUid && state.byUid.has(questionUid)) return state.byUid.get(questionUid);
    const file = sourceFile(sourceFileInput);
    const n = Number(ordinal);
    if (file && Number.isInteger(n) && n > 0) return state.bySource.get(file + '#' + n) || null;
    return null;
  }
  window.getArchiveQuestionMetadata = function(ref) {
    const value = ref || {};
    return get(value.questionUid || value.sourceQuestionUid, value.sourceArchiveFile || value.sourceFile, value.sourceOrdinal || value.sourceQuestionOrdinal);
  };
  window.mergeArchiveQuestionMetadata = function(question, ref) {
    const q = question || {};
    const meta = window.getArchiveQuestionMetadata(ref);
    if (!meta) return q;
    const merged = { ...q };
    const conflicts = {};
    for (const field of ['standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','conceptClusterKey','problemTypeKey','templateKey','difficultyBucket','tagConfidence','tagStatus','metadataStatus','metadataRevision']) {
      const sourceValue = merged[field];
      const metadataValue = meta[field];
      const sourceText = sourceValue === undefined || sourceValue === null ? '' : String(sourceValue).trim();
      const metadataText = metadataValue === undefined || metadataValue === null ? '' : String(metadataValue).trim();
      if (!sourceText && metadataText) merged[field] = metadataValue;
      else if (sourceText && metadataText && sourceText !== metadataText) conflicts[field] = { source: sourceValue, metadata: metadataValue };
    }
    merged._archiveMetadata = meta;
    if (Object.keys(conflicts).length) {
      merged._archiveMetadataConflicts = conflicts;
      merged._archiveMetadataMergeStatus = 'SOURCE_CONFLICT_HOLD';
    }
    return merged;
  };
  window.__ARCHIVE_METADATA_READY__ = fetch(new URL('data/question_metadata.json', document.baseURI))
    .then(response => { if (!response.ok) throw new Error('metadata sidecar HTTP ' + response.status); return response.json(); })
    .then(data => {
      state.data = data;
      for (const record of data.records || []) {
        state.byUid.set(record.questionUid, record);
        state.bySource.set(record.sourceArchiveFile + '#' + record.sourceOrdinal, record);
      }
      window.ARCHIVE_QUESTION_METADATA = data;
      return data;
    })
    .catch(error => { console.warn('[metadata] approved sidecar load failed:', error); return null; });
})();
`;
}

const report = buildMetadata();
fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
fs.writeFileSync(outputJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(outputRuntimePath, runtimeSource(report), 'utf8');
console.log(JSON.stringify({
    json: path.relative(repoRoot, outputJsonPath).replaceAll('\\', '/'),
    runtime: path.relative(repoRoot, outputRuntimePath).replaceAll('\\', '/'),
    digest: report.digest,
    counts: report.counts,
    reviewedPassCount: report.reviewedPassCount,
    approvalStatus: report.approvalStatus
}, null, 2));
