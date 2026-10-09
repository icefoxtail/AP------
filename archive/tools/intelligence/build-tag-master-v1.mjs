import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Compiles the documented archive tag contract into a machine-readable master.
 * It deliberately does not invent deep keys: a question may stop at its
 * standardUnitKey when the document does not define a compatible child key.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoDir = path.resolve(archiveDir, '..');
const sourceRelativePath = 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md';
const sourcePath = path.join(repoDir, ...sourceRelativePath.split('/'));
const outputDir = path.join(archiveDir, 'data', 'master_tables');
const outputPath = path.join(outputDir, 'js_archive_tag_master.json');
const reportDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'master');
const SUBUNIT_RECOVERY = Object.freeze({
    rootAuthorityPath: 'archive/analysis/h2-intake-batch01-20261009/ROOT.desktop-pdf-and-subunit-recovery-authority.v1.json',
    rootAuthoritySha256: 'b49326fede735ddb81a2789f45d7f6334ef724cc441caad2c6234cb76855829b',
    graphAuthorityPath: 'archive/analysis/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/R1.meta-subunit-authority.r1_10.20261009.rev2.json',
    graphAuthoritySha256: '49e2b3e3f28ced970c0b19e244c3b7ce75b8fd1d58ecf7e47354ea62ddb13a7c',
    applicationAuthorityPath: 'archive/analysis/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/R1.meta-subunit-authority.application-children.rev1.json',
    applicationAuthoritySha256: 'a96fa514519c5dd48ae25de1e7f55bf89baf93ad7411db94726f7ddab4713e21',
    originalGraphAuthorityPath: 'archive/analysis/h2-intake-batch01-20261009/24_강남여고_1학기_중간_고2_대수/R1.meta-subunit-authority.r1_10.20261009.json',
    originalGraphAuthoritySha256: 'b74b679c58e411f891932874e17e18bf9c9e1f196959cbcdc36cd009e008117c',
    sourceDocumentBaselineSha256: '89f195e5eb6e959837bd90b482583225cc7d77e33b64eef5414b18f13ee8af4e',
    compiledMasterBaselineSha256: '68459ea08b79b0935271afdb079e72fc7e28aa3faff6a200e0e565dff850fd8a',
    sourceDocumentBaselineSnapshot: 'archive/analysis/h2-intake-batch01-20261009/technical-subunit-authority-recovery/baseline/master-table.before.md',
    compiledMasterBaselineSnapshot: 'archive/analysis/h2-intake-batch01-20261009/technical-subunit-authority-recovery/baseline/tag-master.before.json'
});
const APPROVED_H15_M1_CHILDREN = Object.freeze([
    { standardUnitKey: 'H15-M1-03', standardUnit: '지수함수', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit: '지수함수의 그래프', conceptClusterKey: 'EXPONENTIAL_FUNCTION_GRAPH' },
    { standardUnitKey: 'H15-M1-03', standardUnit: '지수함수', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', subUnit: '지수함수의 활용', conceptClusterKey: 'EXPONENTIAL_FUNCTION_APPLICATION' },
    { standardUnitKey: 'H15-M1-04', standardUnit: '로그함수', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH', subUnit: '로그함수의 그래프', conceptClusterKey: 'LOGARITHMIC_FUNCTION_GRAPH' },
    { standardUnitKey: 'H15-M1-04', standardUnit: '로그함수', subUnitKey: 'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION', subUnit: '로그함수의 활용', conceptClusterKey: 'LOGARITHMIC_FUNCTION_APPLICATION' }
]);

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function pipeCells(line) {
    return line.trim().split('|').slice(1, -1).map(cell => cell.trim());
}

function isSeparator(cells) {
    return cells.every(cell => /^:?-{2,}:?$/.test(cell));
}

function parseDocument(text) {
    const standardUnits = new Map();
    const subUnits = new Map();
    const problemRows = [];
    for (const rawLine of text.split(/\r?\n/)) {
        if (!rawLine.trim().startsWith('|')) continue;
        const cells = pipeCells(rawLine);
        if (!cells.length || isSeparator(cells)) continue;
        // Standard-unit catalog rows: key | Korean name | integer order
        if (cells.length === 3 && /^[A-Z0-9-]+$/.test(cells[0]) && /^\d+$/.test(cells[2])) {
            standardUnits.set(cells[0], { key: cells[0], labelKo: cells[1], order: Number(cells[2]) });
            continue;
        }
        // Documented sub-unit rows: standard key | sub key | Korean label | concept key
        if (cells.length === 4 && /^[A-Z0-9_-]+$/.test(cells[0]) && /^[A-Z0-9_-]+(?:[_-][A-Z0-9]+)+$/.test(cells[1]) && /^[A-Z0-9_-]+$/.test(cells[3])) {
            subUnits.set(cells[1], { standardUnitKey: cells[0], subUnitKey: cells[1], subUnit: cells[2], conceptClusterKey: cells[3] });
            continue;
        }
        // Problem/template examples: concept key | type key | template key | description
        if (cells.length === 4 && /^[A-Z0-9_-]+$/.test(cells[0]) && /^[A-Z0-9_-]+$/.test(cells[1]) && /^[A-Z0-9_-]+$/.test(cells[2])) {
            problemRows.push({ conceptClusterKey: cells[0], problemTypeKey: cells[1], templateKey: cells[2], description: cells[3] });
        }
    }
    return { standardUnits: [...standardUnits.values()].sort((a, b) => a.key.localeCompare(b.key, 'en')), subUnits: [...subUnits.values()].sort((a, b) => a.subUnitKey.localeCompare(b.subUnitKey, 'en')), problemRows };
}

function uniqueByKey(records) {
    return [...new Map(records.map(record => [record.key, record])).values()].sort((a, b) => a.key.localeCompare(b.key, 'en'));
}

function compileMaster(parsed, priorMaster = []) {
    const priorByIdentity = new Map(priorMaster.map(row => [`${row.keyType}:${row.key}`, row]));
    // Preserve historical source references for existing compiled rows. New
    // keys use the current canonical document path so legacy-path removal does
    // not rewrite unrelated master records.
    const sourceRef = (keyType, key) => priorByIdentity.get(`${keyType}:${key}`)?.sourceUrlOrPath || sourceRelativePath;
    const standardRecords = parsed.standardUnits.map(unit => ({
        key: unit.key,
        keyType: 'standardUnitKey',
        labelKo: unit.labelKo,
        description: `문서 기준 표준단원 (${unit.order})`,
        evidencePolicy: 'content_required',
        autoApplyAllowed: true,
        reviewRequiredWhen: [],
        sourceKind: 'document',
        sourceTitle: 'JS아카이브 표준단원키 마스터 테이블',
        sourceUrlOrPath: sourceRef('standardUnitKey', unit.key),
        status: 'active'
    }));
    const subUnitRecords = parsed.subUnits.map(item => ({
        key: item.subUnitKey,
        keyType: 'subUnitKey',
        labelKo: item.subUnit,
        parentKey: item.standardUnitKey,
        standardUnitKey: item.standardUnitKey,
        subUnitKey: item.subUnitKey,
        subUnit: item.subUnit,
        conceptClusterKey: item.conceptClusterKey,
        evidencePolicy: 'content_or_solution_required',
        autoApplyAllowed: false,
        reviewRequiredWhen: ['source_solution_disagreement', 'visual_only_evidence'],
        sourceKind: 'document',
        sourceTitle: 'JS아카이브 표준단원키 마스터 테이블',
        sourceUrlOrPath: sourceRef('subUnitKey', item.subUnitKey),
        status: 'active'
    }));
    const conceptParents = new Map();
    for (const subUnit of parsed.subUnits) {
        const parents = conceptParents.get(subUnit.conceptClusterKey) || [];
        parents.push(subUnit);
        conceptParents.set(subUnit.conceptClusterKey, parents);
    }
    // Some documented high-school examples define a concept/type/template
    // chain without a separate sub-unit row. Keep those concepts active with
    // no artificial sub-unit parent so the hierarchy remains complete.
    for (const row of parsed.problemRows) {
        if (!conceptParents.has(row.conceptClusterKey)) conceptParents.set(row.conceptClusterKey, []);
    }
    const conceptRecords = uniqueByKey([...conceptParents.entries()].map(([key, parents]) => {
        const parent = parents.length === 1 ? parents[0] : null;
        return {
            key,
            keyType: 'conceptClusterKey',
            labelKo: parent?.subUnit || key,
            parentKey: parent?.subUnitKey || '',
            standardUnitKey: parent?.standardUnitKey || '',
            subUnitKey: parent?.subUnitKey || '',
            conceptClusterKey: key,
            evidencePolicy: 'content_or_solution_required',
            autoApplyAllowed: false,
            reviewRequiredWhen: ['source_solution_disagreement', 'multiple_subunits_possible'],
            sourceKind: 'document',
            sourceTitle: 'JS아카이브 표준단원키 마스터 테이블',
            sourceUrlOrPath: sourceRef('conceptClusterKey', key),
            status: 'active'
        };
    }));
    const problemRecords = uniqueByKey(parsed.problemRows.map(row => ({
        key: row.problemTypeKey,
        keyType: 'problemTypeKey',
        labelKo: row.description,
        parentKey: row.conceptClusterKey,
        conceptClusterKey: row.conceptClusterKey,
        problemTypeKey: row.problemTypeKey,
        description: row.description,
        evidencePolicy: 'solution_required',
        autoApplyAllowed: false,
        reviewRequiredWhen: ['source_solution_disagreement', 'multiple_templates_possible'],
        sourceKind: 'document',
        sourceTitle: 'JS아카이브 표준단원키 마스터 테이블',
        sourceUrlOrPath: sourceRef('problemTypeKey', row.problemTypeKey),
        status: 'active'
    })));
    const templateRecords = uniqueByKey(parsed.problemRows.map(row => ({
        key: row.templateKey,
        keyType: 'templateKey',
        labelKo: row.description,
        parentKey: row.problemTypeKey,
        conceptClusterKey: row.conceptClusterKey,
        problemTypeKey: row.problemTypeKey,
        templateKey: row.templateKey,
        description: row.description,
        evidencePolicy: 'solution_required',
        autoApplyAllowed: false,
        reviewRequiredWhen: ['source_solution_disagreement'],
        sourceKind: 'document',
        sourceTitle: 'JS아카이브 표준단원키 마스터 테이블',
        sourceUrlOrPath: sourceRef('templateKey', row.templateKey),
        status: 'active'
    })));
    return [...standardRecords, ...subUnitRecords, ...conceptRecords, ...problemRecords, ...templateRecords].sort((a, b) => `${a.keyType}:${a.key}`.localeCompare(`${b.keyType}:${b.key}`, 'en'));
}

function buildReport(master, parsed) {
    const coveredStandardUnits = new Set(parsed.subUnits.map(item => item.standardUnitKey));
    const standardWithoutSubUnits = parsed.standardUnits.filter(unit => !coveredStandardUnits.has(unit.key)).map(unit => unit.key);
    const counts = Object.groupBy(master, item => item.keyType);
    const stable = { schemaVersion: 'js-archive-tag-master-v1', master, sourceDocument: path.relative(repoDir, sourcePath).replaceAll('\\', '/') };
    return {
        generatedAt: new Date().toISOString(),
        digest: sha256(JSON.stringify(stable)),
        schemaVersion: stable.schemaVersion,
        sourceDocument: stable.sourceDocument,
        totals: Object.fromEntries(Object.entries(counts).map(([key, values]) => [key, values.length]).sort(([a], [b]) => a.localeCompare(b, 'en'))),
        standardUnitsWithoutDocumentedSubUnit: standardWithoutSubUnits,
        master
    };
}

function summaryMarkdown(report) {
    const rows = Object.entries(report.totals).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    return `# Tag Master v1 Compile Report\n\n- Source: ${report.sourceDocument}\n- Digest: ${report.digest}\n- Standard units without a documented sub-unit: ${report.standardUnitsWithoutDocumentedSubUnit.length}\n\n| Key type | Count |\n|---|---:|\n${rows}\n\n## Classification rule\n\nThe classifier may stop at a standard-unit tag when this master has no compatible child. Only documented keys are active; no ad-hoc deep key is emitted by the compiler.\n`;
}

export function buildTagMasterV1() {
    const text = fs.readFileSync(sourcePath, 'utf8');
    const parsed = parseDocument(text);
    const priorMaster = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : [];
    const master = compileMaster(parsed, priorMaster);
    return buildReport(master, parsed);
}

function normalizeApprovedDefinition(row) {
    return {
        standardUnitKey: row?.standardUnitKey,
        standardUnit: row?.standardUnit,
        subUnitKey: row?.subUnitKey,
        subUnit: row?.subUnit,
        conceptClusterKey: row?.conceptClusterKey
    };
}

function sameJson(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
}

function readBoundJson(relativePath, expectedSha256, label) {
    const file = path.join(repoDir, ...relativePath.split('/'));
    const bytes = fs.readFileSync(file);
    const actualSha256 = sha256(bytes);
    if (actualSha256 !== expectedSha256) throw new Error(`${label}_SHA256_MISMATCH:${relativePath}:${actualSha256}`);
    return { value: JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')), bytes };
}

function loadApprovedH15M1Definitions() {
    const rootRef = readBoundJson(SUBUNIT_RECOVERY.rootAuthorityPath, SUBUNIT_RECOVERY.rootAuthoritySha256, 'ROOT_SUBUNIT_AUTHORITY');
    const rootAuthority = rootRef.value;
    if (rootAuthority.schemaVersion !== 'JS_ARCHIVE_ROOT_USER_RECOVERY_AUTHORITY_V1'
        || rootAuthority.executionLine !== 'CODEX'
        || !rootAuthority.allowedActions?.some(action => String(action).includes('registered child keys'))
        || rootAuthority.rows?.length !== 6) throw new Error('ROOT_H15_M1_SUBUNIT_RECOVERY_AUTHORITY_INVALID');
    for (const row of rootAuthority.rows) {
        const sourceBytes = fs.readFileSync(row.workingJsAbsolute);
        if (sha256(sourceBytes) !== row.currentJsRawSha256) throw new Error(`ROOT_H15_M1_SOURCE_SHA_MISMATCH:${row.examUid}`);
    }
    const graphRef = readBoundJson(SUBUNIT_RECOVERY.graphAuthorityPath, SUBUNIT_RECOVERY.graphAuthoritySha256, 'R1_GRAPH_AUTHORITY');
    const graph = graphRef.value;
    const originalGraph = readBoundJson(SUBUNIT_RECOVERY.originalGraphAuthorityPath, SUBUNIT_RECOVERY.originalGraphAuthoritySha256, 'R1_ORIGINAL_GRAPH_AUTHORITY').value;
    const applicationRef = readBoundJson(SUBUNIT_RECOVERY.applicationAuthorityPath, SUBUNIT_RECOVERY.applicationAuthoritySha256, 'R1_APPLICATION_AUTHORITY');
    const application = applicationRef.value;
    if (graph.schemaVersion !== 'JS_ARCHIVE_R1_BOUNDED_L2_SEMANTIC_AUTHORITY_V1'
        || graph.executionLine !== 'CODEX' || graph.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
        || graph.status !== 'SEMANTIC_RECORDS_APPROVED_FOR_CANONICAL_REGISTRATION'
        || graph.examUid !== '24_강남여고_1학기_중간_고2_대수'
        || graph.scope?.sourceRawSha256 !== rootAuthority.rows.find(row => row.examUid === graph.examUid)?.currentJsRawSha256
        || graph.registeredRecordsRequested?.length !== 2) throw new Error('R1_GRAPH_AUTHORITY_SCOPE_INVALID');
    if (originalGraph.schemaVersion !== graph.schemaVersion
        || !sameJson(originalGraph.registeredRecordsRequested?.map(normalizeApprovedDefinition), graph.registeredRecordsRequested.map(normalizeApprovedDefinition))) {
        throw new Error('R1_ORIGINAL_GRAPH_AUTHORITY_DRIFT');
    }
    if (application.schemaVersion !== 'JS_ARCHIVE_R1_BOUNDED_L2_SEMANTIC_AUTHORITY_ADDENDUM_V1'
        || application.executionLine !== 'CODEX' || application.qualityContractVersion !== 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'
        || application.status !== 'SEMANTIC_DEFINITIONS_APPROVED_FOR_CANONICAL_REGISTRATION'
        || application.scope?.sourceExams !== 6
        || application.scope?.crossExamQidClassification !== 'OWN_R1_REQUIRED'
        || JSON.stringify(application.scope?.standardUnitKeys) !== JSON.stringify(['H15-M1-03', 'H15-M1-04'])
        || application.definitions?.length !== 2
        || application.definitions.some(row => row.semanticStatus !== 'APPROVED')) throw new Error('R1_APPLICATION_AUTHORITY_SCOPE_INVALID');
    const definitions = [
        ...graph.registeredRecordsRequested.map(normalizeApprovedDefinition),
        ...application.definitions.map(normalizeApprovedDefinition)
    ];
    const expected = APPROVED_H15_M1_CHILDREN.map(normalizeApprovedDefinition);
    const sort = rows => [...rows].sort((a, b) => a.subUnitKey.localeCompare(b.subUnitKey, 'en'));
    if (!sameJson(sort(definitions), sort(expected))) throw new Error('R1_APPROVED_H15_M1_CHILD_DEFINITIONS_MISMATCH');
    return { rootAuthority, graph, application, definitions: sort(definitions), references: [
        { path: SUBUNIT_RECOVERY.rootAuthorityPath, sha256: SUBUNIT_RECOVERY.rootAuthoritySha256 },
        { path: SUBUNIT_RECOVERY.originalGraphAuthorityPath, sha256: SUBUNIT_RECOVERY.originalGraphAuthoritySha256 },
        { path: SUBUNIT_RECOVERY.graphAuthorityPath, sha256: SUBUNIT_RECOVERY.graphAuthoritySha256 },
        { path: SUBUNIT_RECOVERY.applicationAuthorityPath, sha256: SUBUNIT_RECOVERY.applicationAuthoritySha256 }
    ] };
}

export function mergeApprovedSubunitRows(priorMaster, generatedMaster, approvedDefinitions) {
    const identity = row => `${row.keyType}:${row.key}`;
    const prior = new Map();
    for (const row of priorMaster) {
        const key = identity(row);
        if (prior.has(key)) throw new Error(`TAG_MASTER_PRIOR_DUPLICATE:${key}`);
        prior.set(key, row);
    }
    const generated = new Map();
    for (const row of generatedMaster) {
        const key = identity(row);
        if (generated.has(key)) throw new Error(`TAG_MASTER_GENERATED_DUPLICATE:${key}`);
        generated.set(key, row);
    }
    const approvedIdentitySet = new Set();
    for (const definition of approvedDefinitions) {
        const parent = prior.get(`standardUnitKey:${definition.standardUnitKey}`);
        if (!parent || parent.status !== 'active' || parent.labelKo !== definition.standardUnit) throw new Error(`APPROVED_SUBUNIT_PARENT_INVALID:${definition.standardUnitKey}`);
        if (priorMaster.some(row => row.key === definition.subUnitKey || row.key === definition.conceptClusterKey)) throw new Error(`APPROVED_SUBUNIT_CROSS_TYPE_KEY_COLLISION:${definition.subUnitKey}`);
        const subIdentity = `subUnitKey:${definition.subUnitKey}`;
        const conceptIdentity = `conceptClusterKey:${definition.conceptClusterKey}`;
        if (prior.has(subIdentity) || prior.has(conceptIdentity)) throw new Error(`APPROVED_SUBUNIT_KEY_COLLISION:${definition.subUnitKey}`);
        approvedIdentitySet.add(subIdentity);
        approvedIdentitySet.add(conceptIdentity);
        const sub = generated.get(subIdentity);
        const concept = generated.get(conceptIdentity);
        if (!sub || !concept) throw new Error(`APPROVED_SUBUNIT_GENERATED_ROW_MISSING:${definition.subUnitKey}`);
        if (sub.status !== 'active' || sub.key !== definition.subUnitKey || sub.keyType !== 'subUnitKey'
            || sub.parentKey !== definition.standardUnitKey || sub.standardUnitKey !== definition.standardUnitKey
            || sub.subUnitKey !== definition.subUnitKey || sub.labelKo !== definition.subUnit || sub.subUnit !== definition.subUnit
            || sub.conceptClusterKey !== definition.conceptClusterKey || sub.sourceUrlOrPath !== sourceRelativePath) {
            throw new Error(`APPROVED_SUBUNIT_GENERATED_ROW_MISMATCH:${definition.subUnitKey}`);
        }
        if (concept.status !== 'active' || concept.key !== definition.conceptClusterKey || concept.keyType !== 'conceptClusterKey'
            || concept.parentKey !== definition.subUnitKey || concept.standardUnitKey !== definition.standardUnitKey
            || concept.subUnitKey !== definition.subUnitKey || concept.labelKo !== definition.subUnit
            || concept.conceptClusterKey !== definition.conceptClusterKey || concept.sourceUrlOrPath !== sourceRelativePath) {
            throw new Error(`APPROVED_CONCEPT_GENERATED_ROW_MISMATCH:${definition.conceptClusterKey}`);
        }
    }
    const newRows = generatedMaster.filter(row => !prior.has(identity(row)));
    const actualNewIdentities = newRows.map(identity).sort();
    const expectedNewIdentities = [...approvedIdentitySet].sort();
    if (!sameJson(actualNewIdentities, expectedNewIdentities)) throw new Error(`TAG_MASTER_UNAPPROVED_INSERTION:${JSON.stringify({ actualNewIdentities, expectedNewIdentities })}`);
    const sortedNewRows = newRows.sort((a, b) => identity(a).localeCompare(identity(b), 'en'));
    return [...priorMaster, ...sortedNewRows];
}

export function renderApprovedSourceAppendix(definitions) {
    const refs = [
        `R1 graph authority: ${SUBUNIT_RECOVERY.graphAuthorityPath} SHA-256 ${SUBUNIT_RECOVERY.graphAuthoritySha256}`,
        `R1 application authority: ${SUBUNIT_RECOVERY.applicationAuthorityPath} SHA-256 ${SUBUNIT_RECOVERY.applicationAuthoritySha256}`
    ];
    const lines = [
        '',
        '',
        '## ROOT/R1-approved 2015 수학I 세부단원 등록 (2026-10-09)',
        '',
        '아래 네 개 자식 키는 승인된 개념 정의만 등록한다. 이 표는 다른 시험지의 문항별 L1/L2 판정을 승인하지 않는다.',
        ...refs.map(ref => `- ${ref}`),
        '',
        '| standardUnitKey | subUnitKey | subUnit | conceptClusterKey |',
        '|---|---|---|---|',
        ...definitions.map(row => `| ${row.standardUnitKey} | ${row.subUnitKey} | ${row.subUnit} | ${row.conceptClusterKey} |`),
        ''
    ];
    return lines.join('\n');
}

export function buildApprovedSubunitAppendV1() {
    const authority = loadApprovedH15M1Definitions();
    const sourceBytes = fs.readFileSync(sourcePath);
    const baselineDocPath = path.join(repoDir, ...SUBUNIT_RECOVERY.sourceDocumentBaselineSnapshot.split('/'));
    const baselineDocBytes = fs.readFileSync(baselineDocPath);
    if (sha256(baselineDocBytes) !== SUBUNIT_RECOVERY.sourceDocumentBaselineSha256) throw new Error('SUBUNIT_SOURCE_BASELINE_SNAPSHOT_SHA256_MISMATCH');
    const baselineDocText = baselineDocBytes.toString('utf8');
    const eol = baselineDocText.includes('\r\n') ? '\r\n' : '\n';
    const appendixBytes = Buffer.from(renderApprovedSourceAppendix(authority.definitions).replaceAll('\n', eol), 'utf8');
    const expectedSourceBytes = Buffer.concat([baselineDocBytes, appendixBytes]);
    if (!sourceBytes.equals(expectedSourceBytes)) throw new Error('SUBUNIT_CANONICAL_SOURCE_NOT_EXACT_APPROVED_APPENDIX');

    const baselineMasterPath = path.join(repoDir, ...SUBUNIT_RECOVERY.compiledMasterBaselineSnapshot.split('/'));
    const baselineMasterBytes = fs.readFileSync(baselineMasterPath);
    if (sha256(baselineMasterBytes) !== SUBUNIT_RECOVERY.compiledMasterBaselineSha256) throw new Error('SUBUNIT_MASTER_BASELINE_SNAPSHOT_SHA256_MISMATCH');
    const baselineMaster = JSON.parse(baselineMasterBytes.toString('utf8'));
    const currentMasterBytes = fs.readFileSync(outputPath);
    const currentMaster = JSON.parse(currentMasterBytes.toString('utf8'));
    const parsed = parseDocument(sourceBytes.toString('utf8'));
    for (const definition of authority.definitions) {
        const sourceParent = parsed.standardUnits.find(row => row.key === definition.standardUnitKey);
        if (!sourceParent || sourceParent.labelKo !== definition.standardUnit) throw new Error(`APPROVED_SUBUNIT_SOURCE_PARENT_INVALID:${definition.standardUnitKey}`);
    }
    const generatedFullMaster = compileMaster(parsed, baselineMaster);
    const finalMaster = mergeApprovedSubunitRows(baselineMaster, generatedFullMaster, authority.definitions);
    const idempotent = sha256(currentMasterBytes) !== SUBUNIT_RECOVERY.compiledMasterBaselineSha256;
    if (idempotent && !sameJson(currentMaster, finalMaster)) throw new Error('SUBUNIT_MASTER_CURRENT_STATE_NOT_BASELINE_OR_APPROVED_APPEND');
    if (!idempotent && !sameJson(currentMaster, baselineMaster)) throw new Error('SUBUNIT_MASTER_BASELINE_RECORDS_DRIFT');
    const report = buildReport(finalMaster, parsed);
    report.appendOnlyRegistration = {
        schemaVersion: 'ROOT_R1_APPROVED_SUBUNIT_APPEND_ONLY_REGISTRATION_V1',
        status: idempotent ? 'ALREADY_COMPILED_EXACT_APPROVED_ROWS' : 'APPENDED_EXACT_APPROVED_ROWS',
        authorityReferences: authority.references,
        sourceDocument: sourceRelativePath,
        sourceDocumentRawSha256: sha256(sourceBytes),
        sourceDocumentBaselineSha256: SUBUNIT_RECOVERY.sourceDocumentBaselineSha256,
        compiledMasterBaselineSha256: SUBUNIT_RECOVERY.compiledMasterBaselineSha256,
        preservedExistingMasterRowCount: baselineMaster.length,
        appendedSubUnitKeys: authority.definitions.map(row => row.subUnitKey),
        appendedConceptClusterKeys: authority.definitions.map(row => row.conceptClusterKey),
        appendedCompiledRecordCount: finalMaster.length - baselineMaster.length,
        nonTargetRowsAndOrderPreserved: sameJson(finalMaster.slice(0, baselineMaster.length), baselineMaster),
        perExamQidClassificationChanged: false
    };
    report.master = finalMaster;
    return report;
}

function main() {
    const appendApprovedSubunits = process.argv.includes('--append-approved-subunits');
    const report = appendApprovedSubunits ? buildApprovedSubunitAppendV1() : buildTagMasterV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(report.master, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(reportDir, 'tag-master-v1-report.json'), `${JSON.stringify({ ...report, master: undefined }, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(reportDir, 'tag-master-v1-report.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/data/master_tables/js_archive_tag_master.json', digest: report.digest, totals: report.totals, standardUnitsWithoutDocumentedSubUnit: report.standardUnitsWithoutDocumentedSubUnit.length, ...(report.appendOnlyRegistration ? { appendOnlyRegistration: report.appendOnlyRegistration } : {}) }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
