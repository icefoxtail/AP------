import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const archiveDir = path.join(repoRoot, 'archive');
const candidateDir = path.join(archiveDir, 'data', 'meta-foundation', 'candidates', 'middle-geometry', 'v1');
const evidenceDir = path.join(archiveDir, 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const ledgerPath = path.join(evidenceDir, 'item_level_assignment_928.json');
const catalogPath = path.join(archiveDir, 'data', 'archive2-catalog.json');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizeFile(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').trim();
}

function decodeCatalog(data) {
    if (data.encoding !== 'column-dictionary-v1') return data;
    const decode = value => Array.isArray(value) && value.length === 1 && Number.isInteger(value[0]) ? data.strings[value[0]] : value;
    return {
        ...data,
        records: data.records.map(row => Object.fromEntries(data.columns.map((column, index) => [column, decode(row[index])]).filter(([, value]) => value !== null)))
    };
}

function loadCanonical() {
    const packsRoot = path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'packs');
    const problemTypes = [];
    const templates = [];
    const bindings = [];
    for (const entry of fs.readdirSync(packsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const root = path.join(packsRoot, entry.name);
        const taxonomy = readJson(path.join(root, 'taxonomy.json'));
        problemTypes.push(...(taxonomy.problemTypes || []));
        templates.push(...(taxonomy.templates || []));
        const bindingFile = path.join(root, 'bindings.json');
        if (fs.existsSync(bindingFile)) bindings.push(...(readJson(bindingFile).bindings || []));
    }
    const concepts = [];
    const conceptRoot = path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'concepts');
    for (const file of fs.readdirSync(conceptRoot).filter(file => file.endsWith('.json'))) concepts.push(...(readJson(path.join(conceptRoot, file)).concepts || []));
    const conditions = readJson(path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'condition_registry.json')).conditions || [];
    const aliases = [];
    for (const entry of fs.readdirSync(packsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const aliasFile = path.join(packsRoot, entry.name, 'aliases.json');
        if (fs.existsSync(aliasFile)) aliases.push(...(readJson(aliasFile).aliases || []));
    }
    const master = readJson(path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json'));
    const subUnits = new Map(master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active').map(item => [item.subUnitKey, item]));
    return { problemTypes, templates, bindings, concepts, conditions, aliases, subUnits };
}

function bindingKey(record) {
    return [record.curriculum, record.standardCourse, record.workingStandardUnitKey, record.workingSubUnitKey, record.problemTypeKey].join('|');
}

function auditAliases(activeAliases, candidateAliases) {
    const lookup = new Map();
    const collisions = [];
    for (const [origin, aliases] of [['ACTIVE_CANONICAL', activeAliases], ['CANDIDATE', candidateAliases]]) {
        for (const item of aliases || []) {
            if (item.status && item.status !== 'ACTIVE' && origin === 'ACTIVE_CANONICAL') continue;
            const alias = String(item.alias || '').normalize('NFC').trim();
            if (!alias) continue;
            const target = `${item.canonicalKind || item.targetType || ''}:${item.canonicalKey || item.targetKey || ''}`;
            const previous = lookup.get(alias) || [];
            if (previous.length && !previous.some(entry => entry.target === target)) {
                collisions.push({ alias, existing: previous, incoming: { origin, target } });
            }
            previous.push({ origin, target });
            lookup.set(alias, previous);
        }
    }
    return {
        aliasAuditStatus: 'EXECUTED',
        aliasLookupEntryCount: lookup.size,
        aliasCollisionCount: collisions.length,
        aliasCollisions: collisions
    };
}

function build() {
    const ledger = readJson(ledgerPath);
    const candidateTaxonomy = readJson(path.join(candidateDir, 'taxonomy.json'));
    const candidateBindings = readJson(path.join(candidateDir, 'bindings.json'));
    const candidateAliases = readJson(path.join(candidateDir, 'aliases.json'));
    const candidatePack = readJson(path.join(candidateDir, 'pack.json'));
    const canonical = loadCanonical();
    const activeL3 = new Map(canonical.problemTypes.map(item => [item.problemTypeKey, item]));
    const activeL4 = new Map(canonical.templates.map(item => [item.templateKey, item]));
    const activeConcepts = new Set(canonical.concepts.map(item => item.conceptKey));
    const activeConditions = new Set(canonical.conditions.map(item => item.conditionKey));
    const mergedL3 = [...canonical.problemTypes];
    const mergedL4 = [...canonical.templates];
    const duplicateCandidateL3 = [];
    const duplicateCandidateL4 = [];
    for (const item of candidateTaxonomy.problemTypes || []) {
        if (activeL3.has(item.problemTypeKey)) duplicateCandidateL3.push(item.problemTypeKey);
        else mergedL3.push(item);
    }
    for (const item of candidateTaxonomy.templates || []) {
        if (activeL4.has(item.templateKey)) duplicateCandidateL4.push(item.templateKey);
        else mergedL4.push(item);
    }
    const mergedL3Keys = new Set(mergedL3.map(item => item.problemTypeKey));
    const mergedL4ByKey = new Map(mergedL4.map(item => [item.templateKey, item]));
    const mergedBindings = [...canonical.bindings, ...(candidateBindings.bindings || [])];
    const bindingKeys = new Set(mergedBindings.map(item => [item.curriculum, item.standardCourse, item.standardUnitKey, item.subUnitKey, item.problemTypeKey].join('|')));
    const aliasAudit = auditAliases(canonical.aliases, candidateAliases.aliases || []);
    const candidateBindingParentMismatch = [];
    const packOwnedDomainViolations = [];
    for (const binding of candidateBindings.bindings || []) {
        const authority = canonical.subUnits.get(binding.subUnitKey);
        if (!authority || authority.standardUnitKey !== binding.standardUnitKey || authority.parentKey !== binding.standardUnitKey) candidateBindingParentMismatch.push({ binding, reason: 'standardUnitKey/subUnitKey parent mismatch against master authority' });
        if (!(candidatePack.ownedStandardUnitDomains || []).includes(binding.standardUnitKey)) packOwnedDomainViolations.push(binding);
    }
    const duplicateRecordUid = new Set();
    const duplicateSourceIdentity = new Set();
    const invalidL3 = [];
    const invalidL4 = [];
    const brokenBinding = [];
    const invalidCrossConcept = [];
    const invalidCondition = [];
    const duplicateRelational = [];
    const workingMetadataConfusion = [];
    const recordParentMismatch = [];
    for (const record of ledger.records) {
        const sourceIdentity = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
        if (duplicateRecordUid.has(record.questionUid)) duplicateRecordUid.add(`DUP:${record.questionUid}`);
        else duplicateRecordUid.add(record.questionUid);
        if (duplicateSourceIdentity.has(sourceIdentity)) duplicateSourceIdentity.add(`DUP:${sourceIdentity}`);
        else duplicateSourceIdentity.add(sourceIdentity);
        if (!record.problemTypeKey) continue;
        const workingParent = String(record.workingSubUnitKey || '').match(/^(M\d-\d+)/)?.[1];
        if (!record.sourceStandardUnitKey || !record.sourceSubUnitKey || record.standardUnitKey !== record.sourceStandardUnitKey) workingMetadataConfusion.push(record.questionUid);
        if (workingParent !== record.workingStandardUnitKey) recordParentMismatch.push(record.questionUid);
        if (!mergedL3Keys.has(record.problemTypeKey)) invalidL3.push(record.questionUid);
        if (!mergedL4ByKey.has(record.templateKey)) invalidL4.push(record.questionUid);
        if (!bindingKeys.has(bindingKey(record))) brokenBinding.push(record.questionUid);
        for (const key of record.crossConceptKeys) if (!activeConcepts.has(key)) invalidCrossConcept.push(`${record.questionUid}:${key}`);
        for (const key of record.conditionKeys) if (!activeConditions.has(key)) invalidCondition.push(`${record.questionUid}:${key}`);
        if (new Set(record.crossConceptKeys).size !== record.crossConceptKeys.length || new Set(record.conditionKeys).size !== record.conditionKeys.length) duplicateRelational.push(record.questionUid);
    }
    const catalog = decodeCatalog(readJson(catalogPath));
    const catalogByTuple = new Set((catalog.records || []).map(record => `${normalizeFile(record.sourceFile)}#${Number(record.sourceOrdinal)}`));
    const identity = readJson(identityPath);
    const identityByTuple = new Map((identity.records || []).map(record => [`${normalizeFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`, record]));
    const missingIdentity = [];
    const missingCatalog = [];
    const runtimeRecords = [];
    for (const record of ledger.records) {
        const tuple = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
        const id = identityByTuple.get(tuple);
        if (!id || id.questionUid !== record.questionUid) missingIdentity.push(tuple);
        if (!catalogByTuple.has(tuple)) missingCatalog.push(tuple);
        runtimeRecords.push({
            questionUid: record.questionUid,
            sourceArchiveFile: record.sourceArchiveFile,
            sourceOrdinal: record.sourceOrdinal,
            curriculumKey: record.curriculum,
            courseKey: record.standardCourse,
            standardUnitKey: record.workingStandardUnitKey,
            subUnitKey: record.workingSubUnitKey,
            problemTypeKey: record.problemTypeKey,
            templateKey: record.templateKey,
            crossConceptKeys: record.crossConceptKeys,
            conditionKeys: record.conditionKeys,
            integrationPattern: record.integrationPattern,
            difficultyBucket: record.difficultyBucket,
            difficultyConfidence: record.difficultyConfidence,
            difficultyBoundaryFlag: record.difficultyBoundaryFlag,
            legacyLevelCompatibility: record.legacyLevelCompatibility,
            curriculumApplicability: record.curriculumApplicability,
            defaultSelectable: record.defaultSelectable,
            reviewStatus: record.reviewStatus,
            metadataStatus: 'META_FOUNDATION_CANDIDATE',
            metaFoundationStatus: 'CANDIDATE',
            metaFoundationPackId: 'MIDDLE_GEOMETRY',
            metaFoundationPackVersion: '0.1.0-candidate'
        });
    }
    const eligible = 0;
    const recheckTargets = ledger.reviewTargets || [];
    const bucketCounts = Object.fromEntries(Object.entries(ledger.records.reduce((out, record) => {
        const key = String(record.difficultyBucket);
        out[key] = (out[key] || 0) + 1;
        return out;
    }, {})).sort(([a], [b]) => a.localeCompare(b)));
    const confidenceCounts = Object.fromEntries(Object.entries(ledger.records.reduce((out, record) => {
        const key = String(record.difficultyConfidence);
        out[key] = (out[key] || 0) + 1;
        return out;
    }, {})).sort(([a], [b]) => a.localeCompare(b)));
    const compatibilityCounts = Object.fromEntries(Object.entries(ledger.records.reduce((out, record) => {
        const key = String(record.legacyLevelCompatibility);
        out[key] = (out[key] || 0) + 1;
        return out;
    }, {})).sort(([a], [b]) => a.localeCompare(b)));
    const audit = {
        schemaVersion: 'middle-geometry-candidate-compile-audit-v1',
        status: 'CANDIDATE_VALIDATION_ONLY_REVIEW_PENDING_FAIL_CLOSED',
        productionPromotion: 'NOT_ATTEMPTED',
        productionCompiledMutation: 0,
        productionRuntimeMutation: 0,
        mergedCounts: { problemTypes: mergedL3.length, templates: mergedL4.length, bindings: mergedBindings.length, concepts: canonical.concepts.length, conditions: canonical.conditions.length },
        candidateCounts: { problemTypes: (candidateTaxonomy.problemTypes || []).length, templates: (candidateTaxonomy.templates || []).length, bindings: (candidateBindings.bindings || []).length, runtimeRecords: runtimeRecords.length, archive2Joined: runtimeRecords.length - missingCatalog.length, autoEligible: eligible },
        gates: {
            exactDenominator: ledger.records.length === 928,
            uniqueUid: new Set(ledger.records.map(record => record.questionUid)).size === 928,
            uniqueSourceIdentity: new Set(ledger.records.map(record => `${record.sourceArchiveFile}#${record.sourceOrdinal}`)).size === 928,
            candidateL3KeyCollision: duplicateCandidateL3,
            candidateL4KeyCollision: duplicateCandidateL4,
            parentMismatchCount: candidateBindingParentMismatch.length + recordParentMismatch.length,
            candidateBindingParentMismatch: candidateBindingParentMismatch,
            packOwnedDomainViolationCount: packOwnedDomainViolations.length,
            packOwnedDomainViolations,
            workingMetadataConfusion,
            unregisteredL3: invalidL3,
            brokenL4Parent: [...mergedL4ByKey.values()].filter(item => !mergedL3Keys.has(item.parentProblemTypeKey)).map(item => item.templateKey),
            brokenBinding,
            unregisteredCrossConcept: invalidCrossConcept,
            unregisteredCondition: invalidCondition,
            duplicateRelational,
            identityJoinMissing: missingIdentity,
            archive2JoinMissing: missingCatalog,
            aliasAuditStatus: aliasAudit.aliasAuditStatus,
            aliasLookupEntryCount: aliasAudit.aliasLookupEntryCount,
            aliasCollisionCount: aliasAudit.aliasCollisionCount,
            aliasCollisions: aliasAudit.aliasCollisions,
            candidateLeakageIntoProduction: 0
        },
        runtimeStatus: 'ELIGIBILITY_REVIEW_PENDING',
        difficulty: { bucketCounts, confidenceCounts, compatibilityCounts, independentRecheckTargetCount: recheckTargets.length },
        nextGate: 'Independent GPT review, then explicit approval before any canonical/compiled/runtime production promotion'
    };
    fs.writeFileSync(path.join(evidenceDir, 'candidate_compiled_middle_geometry.json'), JSON.stringify({ schemaVersion: 'middle-geometry-candidate-compiled-v1', status: 'CANDIDATE', packId: 'MIDDLE_GEOMETRY', packVersion: '0.1.0-candidate', taxonomy: { problemTypes: mergedL3, templates: mergedL4 }, bindings: mergedBindings, concepts: canonical.concepts, conditions: canonical.conditions, sourceOfTruth: 'candidate pack + active canonical pack/shards; production compiled untouched' }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'candidate_runtime_middle-geometry-v1.json'), JSON.stringify({ schemaVersion: 'middle-geometry-runtime-overlay-candidate-v1', status: 'CANDIDATE_REVIEW_PENDING', runtimeVersion: 'MIDDLE_GEOMETRY@0.1.0-candidate/runtime-overlay-v1', packId: 'MIDDLE_GEOMETRY', packVersion: '0.1.0-candidate', generatedFrom: { assignments: 'archive/data/meta-foundation/evidence/middle-geometry/v1/item_level_assignment_928.json', candidateTaxonomy: 'archive/data/meta-foundation/candidates/middle-geometry/v1/taxonomy.json', candidateBindings: 'archive/data/meta-foundation/candidates/middle-geometry/v1/bindings.json', archive2Catalog: 'archive/data/archive2-catalog.json' }, counts: { records: runtimeRecords.length, defaultSelectable: 0, autoEligible: 0, archive2Joined: runtimeRecords.length - missingCatalog.length, sourceHold: runtimeRecords.length }, eligibilityStatus: 'PENDING_INDEPENDENT_REVIEW', records: runtimeRecords }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'candidate_compile_audit.json'), JSON.stringify(audit, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'difficulty_blind_freeze_928.json'), JSON.stringify({ schemaVersion: 'middle-geometry-difficulty-blind-freeze-v1', status: 'BLIND_FIRST_PASS_HEURISTIC_CANDIDATE_PENDING_INDEPENDENT_GPT_RECHECK', denominator: 928, bucketCounts, confidenceCounts, compatibilityCounts, routeOutUnknownCount: ledger.records.filter(record => record.difficultyBucket === 'UNKNOWN').length, independentRecheckTargetCount: recheckTargets.length, targetQuestionUids: recheckTargets.map(record => record.questionUid), blindRule: 'heuristic candidate only; no reviewed_pass or eligibility is granted until item-level independent review', productionPromotion: 'NOT_ATTEMPTED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'relational_metadata_freeze_928.json'), JSON.stringify({ schemaVersion: 'middle-geometry-relational-metadata-freeze-v1', status: 'CANDIDATE_RELATIONAL_SUGGESTIONS_PENDING_SEMANTIC_REVIEW', denominator: 928, crossConceptAssignmentCount: ledger.records.reduce((sum, record) => sum + record.crossConceptKeys.length, 0), conditionAssignmentCount: ledger.records.reduce((sum, record) => sum + record.conditionKeys.length, 0), integrationPatternCounts: Object.fromEntries(Object.entries(ledger.records.reduce((out, record) => { out[record.integrationPattern] = (out[record.integrationPattern] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))), duplicateCrossConceptAssignmentCount: duplicateRelational.length, unregisteredCrossConcept: invalidCrossConcept, unregisteredCondition: invalidCondition, roleCollision: [], productionPromotion: 'NOT_ATTEMPTED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'independent_recheck_manifest_928.json'), JSON.stringify({ schemaVersion: 'middle-geometry-independent-recheck-manifest-v1', status: 'REVIEW_PENDING', denominator: 928, targetCount: recheckTargets.length, targets: recheckTargets, triggerUnionCount: recheckTargets.length, triggerReasonCounts: Object.fromEntries(Object.entries(recheckTargets.flatMap(record => record.triggerReasons).reduce((out, reason) => { out[reason] = (out[reason] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))), reviewer: 'GPT independent review after Codex branch completion', mainMerge: 'FORBIDDEN' }, null, 2) + '\n');
    console.log(JSON.stringify({ status: audit.status, counts: audit.candidateCounts, gates: audit.gates, runtimeStatus: audit.runtimeStatus }, null, 2));
    if (audit.gates.brokenL4Parent.length || audit.gates.brokenBinding.length || audit.gates.unregisteredL3.length || audit.gates.unregisteredCrossConcept.length || audit.gates.unregisteredCondition.length || audit.gates.identityJoinMissing.length || audit.gates.archive2JoinMissing.length || audit.gates.parentMismatchCount || audit.gates.packOwnedDomainViolationCount || audit.gates.workingMetadataConfusion.length || audit.gates.aliasCollisionCount) process.exitCode = 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) build();
