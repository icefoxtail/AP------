#!/usr/bin/env node

/**
 * Execute a Phase 5 roundtrip with real archive source questions and the
 * frozen wrong_ids-only input contract.
 *
 * This is deliberately a local, non-operational run: no authenticated
 * student record is available in this workspace, so it uses a clearly named
 * fixture identity while all question identity and metadata come from the
 * current archive/question-index and approved metadata sidecar.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import joiner from '../weakness-metadata-join.js';
import aggregator from '../weakness-aggregator.js';
import supplementPreset from '../weakness-supplement-preset.js';
import selector from '../mixer-selector.js';
import closedLoop from '../weakness-closed-loop.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'phase5-roundtrip-20260825.json');
const SOURCE_FILE = 'original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js';
const SOURCE_ORDINALS = [1, 2, 3];
const WRONG_INPUT_QUESTION_NOS = [1, 3];
const SUPPLEMENT_WRONG_QUESTION_NOS = [2, 5];
const AS_OF = '2026-08-25T00:00:00.000Z';
const PRIOR_RESULT_AT = '2026-08-24T00:00:00.000Z';
const STUDENT_ID = 'fixture:phase5-real-source-20260825';
const PRIOR_SESSION_ID = 'phase5-real-source-input-20260825';
const SUPPLEMENT_SESSION_ID = 'phase5-supplement-20260825';

function loadQuestionIndex() {
    const source = fs.readFileSync(path.join(ARCHIVE_ROOT, 'question-index.js'), 'utf8');
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: path.join(ARCHIVE_ROOT, 'question-index.js'), timeout: 5000 });
    if (!Array.isArray(context.window.questionIndex)) throw new Error('question-index is missing');
    return context.window.questionIndex;
}

function loadJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(ARCHIVE_ROOT, relativePath), 'utf8'));
}

function sourceKey(row) {
    return `${row.sourceFile || row.sourceArchiveFile}#${Number(row.sourceOrdinal || row.sourceQuestionOrdinal)}`;
}

function asCandidate(row, identityBySource, metadataBySource) {
    const key = sourceKey(row);
    const identity = identityBySource.get(key);
    const metadata = metadataBySource.get(key) || {};
    return {
        ...row,
        questionUid: identity?.questionUid || '',
        sourceFile: row.sourceFile,
        sourceOrdinal: Number(row.sourceOrdinal),
        sourceQuestionNo: Number(row.id || row.sourceOrdinal),
        standardCourse: metadata.standardCourse || row.course,
        standardUnitKey: metadata.standardUnitKey || row.standardUnitKey,
        standardUnit: metadata.standardUnit || row.standardUnit,
        subUnitKey: metadata.subUnitKey || row.subUnitKey,
        subUnit: metadata.subUnit || row.subUnit,
        conceptClusterKey: metadata.conceptClusterKey || row.subUnitKey,
        problemTypeKey: metadata.problemTypeKey || '',
        templateKey: metadata.templateKey || '',
        difficultyBucket: metadata.difficultyBucket || row.level,
        metadataStatus: metadata.metadataStatus || '',
        metadataRevision: metadata.metadataRevision || '',
    };
}

function compactWeakness(report) {
    return Object.fromEntries(Object.entries(report.groups || {}).map(([dimension, rows]) => [
        dimension,
        rows.map(row => ({
            key: row.key,
            keySource: row.keySource,
            attemptCount: row.attemptCount,
            wrongCount: row.wrongCount,
            correctCount: row.correctCount,
            weaknessScore: row.weaknessScore,
            recoveryStatus: row.recoveryStatus,
        })),
    ]));
}

function compactQuestion(row) {
    return {
        questionUid: row.questionUid,
        sourceFile: row.sourceFile || row.source_archive_file,
        sourceOrdinal: Number(row.sourceOrdinal || row.source_question_ordinal),
        sourceQuestionNo: Number(row.sourceQuestionNo || row.source_question_no || row.id || row.question_no),
        standardUnitKey: row.standardUnitKey || row.standard_unit_key,
        subUnitKey: row.subUnitKey || row.sub_unit_key,
        conceptClusterKey: row.conceptClusterKey || row.concept_cluster_key,
        problemTypeKey: row.problemTypeKey || row.type_key || '',
        templateKey: row.templateKey || row.template_key || '',
        difficultyBucket: row.difficultyBucket || row.difficulty || '',
    };
}

function run() {
    const index = loadQuestionIndex();
    const identity = loadJson('data/question_identity_map.json');
    const metadata = loadJson('data/question_metadata.json');
    const identityBySource = new Map(identity.records.map(row => [`${row.sourceArchiveFile}#${Number(row.sourceOrdinal)}`, row]));
    const metadataBySource = new Map(metadata.records.map(row => [`${row.sourceArchiveFile}#${Number(row.sourceOrdinal)}`, row]));
    const originalIndex = index.filter(row => String(row.sourceFile || '').startsWith('original/'));
    const candidates = originalIndex.map(row => asCandidate(row, identityBySource, metadataBySource));
    const sourceQuestions = candidates.filter(row => row.sourceFile === SOURCE_FILE && SOURCE_ORDINALS.includes(Number(row.sourceOrdinal)));
    if (sourceQuestions.length !== SOURCE_ORDINALS.length) throw new Error('real source question selection failed');
    if (sourceQuestions.some(row => !closedLoop.CANONICAL_UID_RE.test(row.questionUid))) throw new Error('real source question UID is not canonical');

    // 1) Actual source-paper attempt represented by the frozen OMR contract:
    // only wrong numbers are submitted; all other numbers are derived correct.
    const priorMixed = closedLoop.buildMixedPayload(sourceQuestions, {
        mixedKey: 'phase5-real-source-input-20260825',
        title: '실문항 오답 입력 검증용 원본 3문항',
    });
    if (!priorMixed.ok) throw new Error(`prior MIXED build failed: ${priorMixed.errors.join(', ')}`);
    const priorBlueprintRows = closedLoop.buildBlueprintRows(priorMixed.payload);
    const priorResultItems = closedLoop.buildAssessmentResultItems({
        blueprintRows: priorBlueprintRows,
        sessionId: PRIOR_SESSION_ID,
        studentId: STUDENT_ID,
        wrongQuestionNos: WRONG_INPUT_QUESTION_NOS,
        resultAt: PRIOR_RESULT_AT,
    });
    const priorJoined = joiner.joinWrongItems({
        assessmentResultItems: priorResultItems,
        blueprintRows: priorBlueprintRows,
        identityRecords: identity.records,
        indexRecords: index,
    });
    const priorWeakness = aggregator.aggregateWeakness(priorJoined, {
        asOf: AS_OF,
        recoveryCapable: true,
        sourceMode: 'assessment_result_items',
    });

    // 2) Build the real-source student supplement preset and replay it through
    // the deterministic Mixer selector over the current original archive.
    const preset = supplementPreset.buildSupplementPreset({
        weaknessReport: priorWeakness,
        count: 6,
        minScore: 0.35,
        maxTargetsPerDimension: 3,
        recentQuestionUids: sourceQuestions.map(row => row.questionUid),
        maxTemplateCount: 1,
        selectionSeed: 'phase5-real-source-20260825',
    });
    const presetValidation = supplementPreset.validatePreset(preset);

    // 3) Run the actual closed-loop contract: deterministic selection, MIXED,
    // blueprint rows, OMR result rows, canonical UID rejoin, reaggregation.
    const result = closedLoop.runClosedLoop({
        preset,
        selector,
        candidates,
        wrongQuestionNos: SUPPLEMENT_WRONG_QUESTION_NOS,
        priorAssessmentResultItems: priorResultItems,
        priorBlueprintRows,
        identityRecords: identity.records,
        indexRecords: index,
        joiner,
        aggregator,
        sessionId: SUPPLEMENT_SESSION_ID,
        studentId: STUDENT_ID,
        resultAt: AS_OF,
        asOf: AS_OF,
    });

    const allCanonical = [
        ...sourceQuestions.map(row => row.questionUid),
        ...(result.replay?.selectedUids || []),
    ].filter(Boolean);
    const uniqueCanonical = new Set(allCanonical);
    const checks = {
        realSourceFilePresent: sourceQuestions.every(row => row.sourceFile === SOURCE_FILE),
        realSourceUidsCanonical: sourceQuestions.every(row => closedLoop.CANONICAL_UID_RE.test(row.questionUid)),
        inputModeWrongIdsOnly: WRONG_INPUT_QUESTION_NOS.length === 2 && priorResultItems.filter(row => row.result_status === 'wrong').length === 2,
        inputAnswerFieldsAbsent: priorResultItems.every(row => !('student_answer' in row) && !('student_answers' in row) && !('answer' in row)),
        priorCanonicalJoin: priorJoined.length === priorResultItems.length && priorJoined.every(row => Boolean(row.questionUid)),
        priorWeaknessRecorded: priorWeakness.itemCount === 3 && priorWeakness.wrongItemCount === WRONG_INPUT_QUESTION_NOS.length,
        presetValid: presetValidation.ok && preset.status === 'candidate_non_operational',
        mixerDeterministicReplay: result.replay.ok && result.replay.selectedCount === preset.count,
        mixedPayloadReady: result.mixed.ok && result.mixed.questionCount === preset.count,
        omrComplementRowsReady: result.result.count === preset.count && result.result.wrongCount === SUPPLEMENT_WRONG_QUESTION_NOS.length,
        resultCanonicalJoin: result.join.count === priorResultItems.length + preset.count && result.join.resolvedCount === result.join.count,
        reaggregated: result.weakness?.itemCount === result.join.count && result.weakness?.wrongItemCount === WRONG_INPUT_QUESTION_NOS.length + SUPPLEMENT_WRONG_QUESTION_NOS.length,
        canonicalUidTraceUnique: uniqueCanonical.size === allCanonical.length,
        noProductionWrites: result.writes === 0,
        noNetworkCalls: result.networkCalls === 0,
    };
    const passed = Object.values(checks).every(Boolean) && result.status === 'CLOSED_LOOP_PASS_NON_OPERATIONAL';

    const report = {
        schemaVersion: 'phase5-roundtrip-real-source.v1',
        generatedAt: new Date().toISOString(),
        status: passed ? 'PHASE5_ROUNDTRIP_PASS_LOCAL_REAL_SOURCE' : 'PHASE5_ROUNDTRIP_FAIL',
        operationalExposure: 'HOLD',
        executionMode: 'local_real_source_fixture',
        note: '인증된 운영 학생 레코드는 제공되지 않아 운영 학생을 가장하지 않고, 실제 아카이브 원본 문항·UID·승인 sidecar 메타데이터로 wrong_ids_only 계약을 실행했다.',
        source: {
            archiveFile: SOURCE_FILE,
            sourceQuestionCount: sourceQuestions.length,
            sourceQuestions: sourceQuestions.map(compactQuestion),
            originalIndexQuestionCount: originalIndex.length,
            metadataRevision: metadata.metadataRevision,
        },
        studentInput: {
            mode: 'wrong_ids_only',
            studentId: STUDENT_ID,
            sessionId: PRIOR_SESSION_ID,
            submittedPayload: { wrong_ids: WRONG_INPUT_QUESTION_NOS },
            submittedAnswerFields: false,
            wrongQuestionUids: sourceQuestions.filter(row => WRONG_INPUT_QUESTION_NOS.includes(Number(row.sourceQuestionNo))).map(row => row.questionUid),
            derivedResult: {
                itemCount: priorResultItems.length,
                wrongCount: priorResultItems.filter(row => row.result_status === 'wrong').length,
                correctCount: priorResultItems.filter(row => row.result_status === 'correct').length,
            },
        },
        priorWeakness: {
            itemCount: priorWeakness.itemCount,
            wrongItemCount: priorWeakness.wrongItemCount,
            groups: compactWeakness(priorWeakness),
        },
        supplement: {
            validation: presetValidation,
            status: preset.status,
            count: preset.count,
            selectionSeed: preset.selectionSeed,
            targets: preset.targets,
            selectorRequests: preset.selectorRequests,
        },
        mixer: {
            selectedCount: result.replay.selectedCount,
            selected: result.replay.selectedUids,
            selectedQuestions: result.mixed.payload.questions.map(compactQuestion),
            errors: result.replay.errors,
        },
        mixed: {
            archiveFile: result.mixed.archiveFile,
            questionCount: result.mixed.questionCount,
            blueprintCount: result.blueprints.count,
        },
        omr: {
            sessionId: SUPPLEMENT_SESSION_ID,
            inputMode: 'wrong_ids_only',
            wrongIds: SUPPLEMENT_WRONG_QUESTION_NOS,
            resultItemCount: result.result.count,
            wrongCount: result.result.wrongCount,
            writeMode: result.omr.writeMode,
        },
        resultRecalculate: {
            joinedCount: result.join.count,
            resolvedCount: result.join.resolvedCount,
            reaggregatedItemCount: result.weakness?.itemCount || 0,
            reaggregatedWrongItemCount: result.weakness?.wrongItemCount || 0,
            conceptGroups: compactWeakness(result.weakness || { groups: {} }).concept || [],
        },
        checks,
        errors: result.errors,
        writes: result.writes,
        networkCalls: result.networkCalls,
    };
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    return report;
}

const report = run();
console.log(JSON.stringify({
    status: report.status,
    sourceQuestionCount: report.source.sourceQuestionCount,
    priorWrongItemCount: report.priorWeakness.wrongItemCount,
    supplementCount: report.supplement.count,
    mixedQuestionCount: report.mixed.questionCount,
    joinedCount: report.resultRecalculate.joinedCount,
    reaggregatedWrongItemCount: report.resultRecalculate.reaggregatedWrongItemCount,
    failedChecks: Object.entries(report.checks).filter(([, value]) => !value).map(([key]) => key),
    writes: report.writes,
    networkCalls: report.networkCalls,
    output: path.relative(path.resolve(ARCHIVE_ROOT, '..'), OUTPUT_PATH).replaceAll('\\', '/'),
}, null, 2));
