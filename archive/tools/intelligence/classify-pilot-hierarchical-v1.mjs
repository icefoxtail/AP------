import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Conservative hierarchy-first classifier for the frozen 400-item pilot.
 * The source standard unit is retained. Deep tags are emitted only when a
 * documented rule is compatible with that unit and independently matches both
 * problem content and solution text.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const pilotPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const exclusionsPath = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const rulesPath = path.join(archiveDir, 'tools', 'tag-enrichment', 'data', 'pattern-rules.seed.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'pilot-classification');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function matchesRule(text, rule) {
    const anyHit = !rule.keywordsAny?.length || rule.keywordsAny.some(keyword => text.includes(keyword));
    const groupsHit = !rule.keywordsAllAny?.length || rule.keywordsAllAny.every(group => group.some(keyword => text.includes(keyword)));
    return anyHit && groupsHit;
}

function countBy(items, field) {
    const counts = {};
    for (const item of items) counts[item[field]] = (counts[item[field]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

export function indexes(master) {
    const standardKeys = new Set(master.filter(item => item.keyType === 'standardUnitKey' && item.status === 'active').map(item => item.key));
    const subUnits = master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active');
    const byStandard = Object.groupBy(subUnits, item => item.standardUnitKey);
    return { standardKeys, byStandard };
}

function compatibleRule(rule, standardUnitKey, byStandard) {
    return (byStandard[standardUnitKey] || []).some(subUnit => subUnit.conceptClusterKey === rule.conceptClusterKey);
}

function selectCompatibleRule(content, solution, standardUnitKey, byStandard, rules) {
    const contentMatches = rules.filter(rule => compatibleRule(rule, standardUnitKey, byStandard) && matchesRule(content, rule));
    const solutionMatches = rules.filter(rule => compatibleRule(rule, standardUnitKey, byStandard) && matchesRule(solution, rule));
    const solutionIds = new Set(solutionMatches.map(rule => rule.id));
    const agreed = contentMatches.filter(rule => solutionIds.has(rule.id));
    if (agreed.length !== 1) return { rule: null, contentMatches, solutionMatches, agreed };
    return { rule: agreed[0], contentMatches, solutionMatches, agreed };
}

export function classifyItem(item, index, rules) {
    const standardUnitKey = item.existingMetadata.standardUnitKey;
    const standardCandidates = index.byStandard[standardUnitKey] || [];
    const content = normalize(`${item.sourceContext.content} ${(item.sourceContext.choices || []).join(' ')}`);
    const solution = normalize(item.sourceContext.solution);
    const ruleResult = selectCompatibleRule(content, solution, standardUnitKey, index.byStandard, rules);
    const base = {
        standardUnitKey,
        standardUnit: item.existingMetadata.standardUnit,
        subUnitKey: '',
        subUnit: '',
        conceptClusterKey: '',
        problemTypeKey: '',
        templateKey: '',
        confidence: 'standard',
        classificationDepth: 'standard_unit_only',
        recommendationEligible: false,
        evidence: {
            contentRuleIds: ruleResult.contentMatches.map(rule => rule.id),
            solutionRuleIds: ruleResult.solutionMatches.map(rule => rule.id),
            agreedRuleIds: ruleResult.agreed.map(rule => rule.id)
        }
    };
    if (!index.standardKeys.has(standardUnitKey)) {
        return { ...base, confidence: 'unmapped', classificationDepth: 'unmapped_standard_unit', evidence: { ...base.evidence, reason: 'standardUnitKey is not an active key in master v1' } };
    }
    if (ruleResult.rule) {
        const rule = ruleResult.rule;
        const subUnit = standardCandidates.find(candidate => candidate.conceptClusterKey === rule.conceptClusterKey);
        return {
            ...base,
            subUnitKey: subUnit.subUnitKey,
            subUnit: subUnit.subUnit,
            conceptClusterKey: rule.conceptClusterKey,
            problemTypeKey: rule.problemTypeKey,
            templateKey: rule.templateKey,
            confidence: 'high',
            classificationDepth: 'documented_template',
            recommendationEligible: true,
            evidence: { ...base.evidence, ruleId: rule.id, rationale: 'content and solution independently matched the same documented rule within the source standard unit' }
        };
    }
    if (standardCandidates.length === 1) {
        const [subUnit] = standardCandidates;
        return {
            ...base,
            subUnitKey: subUnit.subUnitKey,
            subUnit: subUnit.subUnit,
            conceptClusterKey: subUnit.conceptClusterKey,
            confidence: 'medium',
            classificationDepth: 'single_documented_subunit',
            evidence: { ...base.evidence, rationale: 'exactly one documented sub-unit exists beneath the source standard unit; no deep template inferred' }
        };
    }
    return { ...base, evidence: { ...base.evidence, rationale: standardCandidates.length ? 'multiple documented sub-units; no mutually supported rule' : 'no documented sub-unit; stopped at source standard unit' } };
}

function summaryMarkdown(report) {
    const depthRows = Object.entries(report.totals.classificationDepth).map(([key, count]) => `| ${key} | ${count} |`).join('\n');
    return `# Hierarchical Pilot Classification v1\n\n- Pilot records classified: ${report.totals.classifiedRecords}\n- Excluded records: ${report.totals.excludedRecords}\n- Deep recommendation-eligible records: ${report.totals.recommendationEligible}\n- Production metadata write: none\n\n| Classification depth | Count |\n|---|---:|\n${depthRows}\n\n## Safety rule\n\nA template tag is emitted only if the content and solution independently match the same documented rule and the rule's concept exists below the question's existing standard unit. All other records remain at the broadest supported depth.\n`;
}

export function classifyPilotHierarchicalV1() {
    const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));
    const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8')).rules;
    if (pilot.digest !== exclusions.pilotDigest) throw new Error('pilot and source-exclusion digests differ');
    const excludedFiles = new Set(exclusions.excludedSourceArchiveFiles.map(item => item.sourceArchiveFile));
    const index = indexes(master);
    const eligible = pilot.items.filter(item => !excludedFiles.has(item.sourceArchiveFile));
    const classifications = eligible.map(item => ({
        questionUid: item.questionUid,
        sourceArchiveFile: item.sourceArchiveFile,
        sourceOrdinal: item.sourceOrdinal,
        existingMetadata: item.existingMetadata,
        classification: classifyItem(item, index, rules)
    }));
    const stableReport = {
        schemaVersion: 'hierarchical-pilot-classification-v1',
        pilotDigest: pilot.digest,
        masterDigest: sha256(JSON.stringify(master)),
        productionWriteAllowed: false,
        totals: {
            classifiedRecords: classifications.length,
            excludedRecords: pilot.items.length - classifications.length,
            recommendationEligible: classifications.filter(item => item.classification.recommendationEligible).length,
            classificationDepth: countBy(classifications.map(item => ({ classificationDepth: item.classification.classificationDepth })), 'classificationDepth'),
            confidence: countBy(classifications.map(item => ({ confidence: item.classification.confidence })), 'confidence')
        },
        classifications
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function main() {
    const report = classifyPilotHierarchicalV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'hierarchical-pilot-classification-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'hierarchical-pilot-classification-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase2/pilot-classification/hierarchical-pilot-classification-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
