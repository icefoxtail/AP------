import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Promote the draft sub-unit design in curriculum order. Promotion is a
 * taxonomy-state change in a separate ledger only; it does not change the
 * production master or any source JS.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const masterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const classificationPath = path.join(archiveDir, '_generated', 'intelligence', 'phase2', 'archive-classification', 'archive-hierarchical-classification-v1.json');
const outputDir = path.join(archiveDir, '_generated', 'intelligence', 'phase3', 'subunit-promotion');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const highPilot = [
    { curriculumVersion: 'high-2022', standardUnitKey: 'H22-C-05', standardUnit: '이차방정식과 이차함수', candidates: ['QUADRATIC_EQUATION', 'QUADRATIC_FUNCTION_GRAPH', 'QUADRATIC_FUNCTION_APPLICATION'] },
    { curriculumVersion: 'high-2022', standardUnitKey: 'H22-C-06', standardUnit: '여러 가지 방정식과 부등식', candidates: ['HIGHER_EQUATION', 'HIGHER_INEQUALITY', 'SYSTEM_OF_EQUATIONS'] },
    { curriculumVersion: 'high-2022', standardUnitKey: 'H22-C-08', standardUnit: '순열과 조합', candidates: ['PERMUTATION', 'COMBINATION', 'COUNTING_PRINCIPLE'] },
    { curriculumVersion: 'high-2022', standardUnitKey: 'H22-C-09', standardUnit: '행렬과 그 연산', candidates: ['MATRIX_BASIC', 'MATRIX_OPERATION', 'MATRIX_APPLICATION'] },
    { curriculumVersion: 'high-2022', standardUnitKey: 'H22-A-01~04', standardUnit: '지수·로그·삼각함수', candidates: ['EXPONENT_LOG', 'EXPONENTIAL_FUNCTION', 'LOGARITHMIC_FUNCTION', 'TRIGONOMETRIC_FUNCTION'] },
    { curriculumVersion: 'high-2015', standardUnitKey: 'H15-SB-03', standardUnit: '함수', candidates: ['FUNCTION_RELATION', 'COMPOSITE_FUNCTION', 'INVERSE_FUNCTION'] },
    { curriculumVersion: 'high-2015', standardUnitKey: 'H15-PS-03~06', standardUnit: '확률·통계', candidates: ['CONDITIONAL_PROBABILITY', 'RANDOM_VARIABLE', 'PROBABILITY_DISTRIBUTION', 'STATISTICAL_ESTIMATION'] },
    { curriculumVersion: 'high-2015', standardUnitKey: 'H15-M2-01~09', standardUnit: '미적분', candidates: ['LIMIT', 'CONTINUITY', 'DERIVATIVE', 'INTEGRAL', 'APPLICATION_OF_CALCULUS'] }
];

function countBy(records, key) {
    const counts = {};
    for (const record of records) counts[record[key]] = (counts[record[key]] || 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function buildStage(stageId, label, curriculumVersion, prefix, subUnits, classifications) {
    const standards = [...new Set(subUnits.map(item => item.standardUnitKey))].sort();
    const sampled = classifications.filter(item => standards.includes(item.standardUnitKey));
    const sampleByStandard = countBy(sampled, 'standardUnitKey');
    const allHaveEvidence = sampled.length > 0 && standards.every(key => sampleByStandard[key]);
    return {
        stageId,
        label,
        curriculumVersion,
        status: allHaveEvidence ? 'PILOT' : 'DRAFT',
        promotionRule: '문서화된 세부 키가 존재하고 해당 표준단원에 아카이브 표본이 있을 때 PILOT으로 승격',
        standardUnitKeys: standards,
        sampleQuestionCount: sampled.length,
        sampleByStandard,
        entries: subUnits.map(item => ({
            standardUnitKey: item.standardUnitKey,
            subUnitKey: item.subUnitKey,
            subUnit: item.subUnit,
            conceptClusterKey: item.conceptClusterKey,
            status: allHaveEvidence ? 'PILOT' : 'DRAFT',
            evidencePolicy: 'content_or_solution_required',
            reviewRequiredWhen: ['source_solution_disagreement', 'multiple_subunits_possible']
        }))
    };
}

export function promoteSubunitStagesV1() {
    const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
    const subUnits = master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active');
    const classifications = classification.records;
    const stages = [
        buildStage('middle-m1', '중1 세부 단원', 'middle-2022', 'M1-', subUnits.filter(item => item.standardUnitKey.startsWith('M1-')), classifications),
        buildStage('middle-m2', '중2 세부 단원', 'middle-2022', 'M2-', subUnits.filter(item => item.standardUnitKey.startsWith('M2-')), classifications),
        buildStage('middle-m3', '중3 세부 단원', 'middle-2022', 'M3-', subUnits.filter(item => item.standardUnitKey.startsWith('M3-')), classifications),
        {
            stageId: 'high-first-wave',
            label: '고등학교 1차 개념군 설계',
            curriculumVersion: 'high-2015-and-2022-separated',
            status: 'PILOT',
            promotionRule: '교육과정 근거를 확보한 후보군만 PILOT. 표준키·세부키는 교재 목차와 문항 샘플 검증 후 승인',
            sourceValidationPending: ['textbook_toc_two_sources', '50_to_100_question_sample_per_domain', 'Luna_review'],
            entries: highPilot.map(item => ({ ...item, status: 'PILOT', subUnitKeyStatus: 'PROPOSED', productionUsable: false }))
        }
    ];
    const stableReport = {
        schemaVersion: 'archive-subunit-promotion-v1',
        productionWriteAllowed: false,
        masterDigest: sha256(JSON.stringify(master)),
        classificationDigest: classification.digest,
        promotionOrder: stages.map(stage => stage.stageId),
        totals: {
            stages: stages.length,
            pilotStages: stages.filter(stage => stage.status === 'PILOT').length,
            draftStages: stages.filter(stage => stage.status === 'DRAFT').length,
            pilotEntries: stages.reduce((sum, stage) => sum + stage.entries.filter(entry => entry.status === 'PILOT').length, 0),
            proposedHighEntries: highPilot.length
        },
        stages
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stableReport)), ...stableReport };
}

function summaryMarkdown(report) {
    const rows = report.stages.map(stage => `| ${stage.stageId} | ${stage.status} | ${stage.entries.length} | ${stage.sampleQuestionCount ?? 'n/a'} |`).join('\n');
    return `# Archive Sub-unit Promotion v1\n\n- Production write: none\n- Pilot stages: ${report.totals.pilotStages}\n- Draft stages: ${report.totals.draftStages}\n- Pilot entries: ${report.totals.pilotEntries}\n\n| Stage | Status | Entries | Archive sample |\n|---|---|---:|---:|\n${rows}\n\nHigh-school entries are proposed taxonomy candidates only. They remain non-production until textbook and question-sample validation is complete.\n`;
}

function main() {
    const report = promoteSubunitStagesV1();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-promotion-v1.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'archive-subunit-promotion-v1.summary.md'), summaryMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: 'archive/_generated/intelligence/phase3/subunit-promotion/archive-subunit-promotion-v1.json', digest: report.digest, totals: report.totals }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
