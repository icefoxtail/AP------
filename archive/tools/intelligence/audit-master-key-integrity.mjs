import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Phase 1A documented-master audit.
 * Reads the maintained Markdown master as the authority for this review. It
 * reports gaps; it does not edit source question metadata or approve new keys.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'master-audit');
const masterDocPath = path.join(repoRoot, 'docs', 'rules', 'JS아카이브_표준단원키_마스터테이블.md');
const conceptMapPath = path.join(archiveDir, 'concept_map.js');
const metadataInventoryPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'metadata-inventory-latest.json');
const productionMasterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function cells(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
}

function isSeparator(row) {
    return row.every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')));
}

function parseTables(markdown) {
    const lines = markdown.split(/\r?\n/);
    const tables = [];
    for (let index = 0; index < lines.length - 1; index += 1) {
        if (!lines[index].trim().startsWith('|') || !lines[index + 1].trim().startsWith('|')) continue;
        const header = cells(lines[index]);
        if (!isSeparator(cells(lines[index + 1]))) continue;
        const rows = [];
        let rowIndex = index + 2;
        while (rowIndex < lines.length && lines[rowIndex].trim().startsWith('|')) {
            const row = cells(lines[rowIndex]);
            if (row.length === header.length) rows.push(row);
            rowIndex += 1;
        }
        tables.push({ header, rows, line: index + 1 });
        index = rowIndex - 1;
    }
    return tables;
}

function parseDocumentedStandardUnits(markdown) {
    const records = [];
    for (const table of parseTables(markdown)) {
        const keyIndex = table.header.findIndex(value => /^key$/i.test(value));
        const labelIndex = table.header.findIndex(value => value === '단원명');
        const orderIndex = table.header.findIndex(value => /^order$/i.test(value));
        if (keyIndex < 0 || labelIndex < 0 || orderIndex < 0) continue;
        for (const row of table.rows) {
            const key = row[keyIndex];
            if (!/^(?:M[123]-\d{2}|H(?:22|15)-[A-Z0-9]+-\d{2})$/.test(key)) continue;
            records.push({ key, labelKo: row[labelIndex], order: Number(row[orderIndex]), sourceLine: table.line });
        }
    }
    return records.sort((a, b) => a.key.localeCompare(b.key, 'en'));
}

function readConceptMap() {
    const context = { window: {} };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(conceptMapPath, 'utf8'), context, { filename: conceptMapPath });
    return context.window.CONCEPT_MAP || {};
}

function increment(map, key) {
    map[key] = (map[key] || 0) + 1;
}

function stable(value) {
    return JSON.stringify(value);
}

function writeJson(name, value) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function summaryMarkdown(report) {
    const issueRows = report.findings.slice(0, 80)
        .map(item => `| ${item.severity} | ${item.code} | ${item.count ?? ''} | ${item.note} |`)
        .join('\n');
    return `# Phase 1A Master-Key Integrity Review\n\n- Source master: docs/rules/JS아카이브_표준단원키_마스터테이블.md\n- Documented standard keys: ${report.totals.documentedStandardKeys}\n- Official keys used by archive: ${report.totals.usedOfficialKeys}\n- Official archive records: ${report.totals.officialQuestionRecords}\n- Production JSON master present: ${report.totals.productionMasterPresent ? 'yes' : 'no'}\n- Gate ready: ${report.gateReady ? 'yes' : 'no'}\n\n## Findings\n\n| Severity | Code | Count | Note |\n|---|---|---:|---|\n${issueRows || '| info | no_findings | 0 | No findings. |'}\n\n## Decision\n\nThe Markdown master is suitable as the review authority. The production JSON master and complete concept-map compatibility output are still required before automatic metadata approval. Pilot candidates may be generated only as review-only records.\n`;
}

export function auditMasterKeyIntegrity() {
    const sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD']).toString('utf8').trim();
    const documented = parseDocumentedStandardUnits(fs.readFileSync(masterDocPath, 'utf8'));
    const conceptMap = readConceptMap();
    const inventory = JSON.parse(fs.readFileSync(metadataInventoryPath, 'utf8'));
    const documentedByKey = new Map();
    const duplicateDocumentedKeys = [];
    for (const record of documented) {
        if (documentedByKey.has(record.key)) duplicateDocumentedKeys.push(record.key);
        documentedByKey.set(record.key, record);
    }
    const officialRecords = inventory.records.filter(record => record.standardKeyClass === 'official');
    const usage = {};
    const labelVariants = {};
    for (const record of officialRecords) {
        const key = record.metadata.standardUnitKey;
        increment(usage, key);
        if (!labelVariants[key]) labelVariants[key] = {};
        increment(labelVariants[key], record.metadata.standardUnit);
    }
    const usedOfficialKeys = Object.keys(usage).sort((a, b) => a.localeCompare(b, 'en'));
    const unknownUsedOfficialKeys = usedOfficialKeys.filter(key => !documentedByKey.has(key));
    const conceptMapMissingForUsed = usedOfficialKeys.filter(key => !conceptMap[key]);
    const documentedButUnmapped = documented.filter(record => !conceptMap[record.key]).map(record => record.key);
    const labelConflicts = [];
    for (const key of usedOfficialKeys) {
        const master = documentedByKey.get(key);
        const labels = Object.entries(labelVariants[key]).filter(([label]) => label).sort(([a], [b]) => a.localeCompare(b, 'ko'));
        const nonMasterLabels = labels.filter(([label]) => master && label !== master.labelKo);
        if (nonMasterLabels.length) labelConflicts.push({
            key,
            documentedLabel: master?.labelKo || '',
            observedLabels: Object.fromEntries(labels),
            affectedQuestionCount: nonMasterLabels.reduce((sum, [, count]) => sum + count, 0)
        });
    }
    const productionMasterPresent = fs.existsSync(productionMasterPath);
    const productionMaster = productionMasterPresent ? JSON.parse(fs.readFileSync(productionMasterPath, 'utf8')) : [];
    const productionKeys = new Set((Array.isArray(productionMaster) ? productionMaster : []).map(record => record.key));
    const productionMissingStandardKeys = documented.filter(record => !productionKeys.has(record.key)).map(record => record.key);
    const findings = [];
    if (!productionMasterPresent) findings.push({ severity: 'blocker', code: 'production_master_missing', count: 1, note: 'The recommended production JSON master has not yet been created.' });
    if (duplicateDocumentedKeys.length) findings.push({ severity: 'error', code: 'duplicate_documented_standard_key', count: duplicateDocumentedKeys.length, note: duplicateDocumentedKeys.join(', ') });
    if (unknownUsedOfficialKeys.length) findings.push({ severity: 'error', code: 'used_key_missing_from_documented_master', count: unknownUsedOfficialKeys.length, note: unknownUsedOfficialKeys.join(', ') });
    if (conceptMapMissingForUsed.length) findings.push({ severity: 'warning', code: 'concept_map_missing_for_used_official_key', count: conceptMapMissingForUsed.length, note: 'Compatibility map does not cover every official key currently used by archive records.' });
    if (labelConflicts.length) findings.push({ severity: 'warning', code: 'standard_unit_label_variant', count: labelConflicts.length, note: 'Observed source labels differ from documented labels; preserve source and review aliases before normalization.' });
    if (productionMasterPresent && productionMissingStandardKeys.length) findings.push({ severity: 'error', code: 'production_master_missing_documented_standard_key', count: productionMissingStandardKeys.length, note: 'Production master omits documented standard keys.' });
    if (!findings.length) findings.push({ severity: 'info', code: 'master_integrity_pass', count: 0, note: 'No detected documented-master integrity issues.' });

    const stableReport = {
        schemaVersion: 'phase1-master-key-audit-v1',
        sourceCommit,
        metadataInventoryDigest: inventory.digest,
        authority: path.relative(repoRoot, masterDocPath).replace(/\\/g, '/'),
        totals: {
            documentedStandardKeys: documented.length,
            usedOfficialKeys: usedOfficialKeys.length,
            officialQuestionRecords: officialRecords.length,
            productionMasterPresent,
            productionMasterRecords: Array.isArray(productionMaster) ? productionMaster.length : 0,
            conceptMapKeys: Object.keys(conceptMap).length,
            conceptMapMissingForUsed: conceptMapMissingForUsed.length,
            labelConflictKeys: labelConflicts.length
        },
        findings,
        documentedStandardUnits: documented,
        unknownUsedOfficialKeys,
        conceptMapMissingForUsed,
        documentedButUnmapped,
        labelConflicts,
        gateReady: productionMasterPresent && !duplicateDocumentedKeys.length && !unknownUsedOfficialKeys.length && !conceptMapMissingForUsed.length && !productionMissingStandardKeys.length
    };
    const digest = sha256(stable(stableReport));
    return { generatedAt: new Date().toISOString(), digest, ...stableReport };
}

function main() {
    const report = auditMasterKeyIntegrity();
    writeJson('master-key-integrity-report.json', report);
    writeJson('new_master_key_candidates.json', []);
    writeJson('master_key_conflict_report.json', report.labelConflicts);
    writeJson('deprecated_key_usage_report.json', []);
    writeJson('unknown_parent_key_report.json', report.productionMasterPresent ? [] : [{ severity: 'pending', reason: 'production master does not exist yet' }]);
    fs.writeFileSync(path.join(outputDir, 'master-key-integrity.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({
        output: 'archive/_generated/intelligence/phase1/master-audit/master-key-integrity-report.json',
        digest: report.digest,
        documentedStandardKeys: report.totals.documentedStandardKeys,
        usedOfficialKeys: report.totals.usedOfficialKeys,
        gateReady: report.gateReady,
        findings: report.findings.map(item => ({ code: item.code, count: item.count }))
    }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
