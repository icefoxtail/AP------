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
const sourcePath = path.join(repoDir, 'docs', 'rules', 'JS아카이브_표준단원키_마스터테이블.md');
const outputDir = path.join(archiveDir, 'data', 'master_tables');
const outputPath = path.join(outputDir, 'js_archive_tag_master.json');
const reportDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'master');

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

function compileMaster(parsed) {
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
        sourceUrlOrPath: 'docs/rules/JS아카이브_표준단원키_마스터테이블.md',
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
        sourceUrlOrPath: 'docs/rules/JS아카이브_표준단원키_마스터테이블.md',
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
            sourceUrlOrPath: 'docs/rules/JS아카이브_표준단원키_마스터테이블.md',
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
        sourceUrlOrPath: 'docs/rules/JS아카이브_표준단원키_마스터테이블.md',
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
        sourceUrlOrPath: 'docs/rules/JS아카이브_표준단원키_마스터테이블.md',
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
    const master = compileMaster(parsed);
    return buildReport(master, parsed);
}

function main() {
    const report = buildTagMasterV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(report.master, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(reportDir, 'tag-master-v1-report.json'), `${JSON.stringify({ ...report, master: undefined }, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(reportDir, 'tag-master-v1-report.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/data/master_tables/js_archive_tag_master.json', digest: report.digest, totals: report.totals, standardUnitsWithoutDocumentedSubUnit: report.standardUnitsWithoutDocumentedSubUnit.length }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
