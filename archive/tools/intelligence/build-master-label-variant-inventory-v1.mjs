import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/* Observation-only inventory. It never rewrites exam JS or promotes metadata. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const phase1Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const auditDir = path.join(phase1Dir, 'master-audit');
const outputDir = path.join(auditDir, 'label-variants');
const SAFE_ALIASES = {
    'H15-M2-09': { '정적분의 활용': '적분의 활용' },
    'H22-A-05': { '삼각함수의 활용': '사인법칙과 코사인법칙' },
    'M1-04': { '좌표와 그래프': '좌표평면과 그래프' },
    'M2-03': { '연립방정식': '연립일차방정식' }
};
const DECISION_OVERRIDES = {
    'H15-M1-02|삼각함수': 'cross_unit_misclassification_review',
    'H15-SA-03|복소수': 'cross_unit_misclassification_review',
    'H15-SA-04|이차방정식': 'cross_unit_misclassification_review',
    'H15-SA-02|방정식과 부등식': 'cross_unit_misclassification_review',
    'H15-SA-05|이차방정식과 이차함수': 'cross_unit_misclassification_review',
    'H15-SA-05|이차함수': 'cross_unit_misclassification_review',
    'H15-SA-06|여러 가지 방정식과 부등식': 'cross_unit_misclassification_review',
    'H15-SB-02|함수': 'cross_unit_misclassification_review',
    'H22-A-01|지수함수와 로그함수': 'cross_unit_misclassification_review',
    'H22-A-02|삼각함수': 'cross_unit_misclassification_review',
    'H22-A-05|방정식': 'cross_unit_misclassification_review',
    'H22-C-01|지수의 뜻과 성질': 'cross_unit_misclassification_review',
    'H22-C-02|나머지 정리': 'same_key_subunit_label_leak',
    'H22-C-02|지수법칙': 'cross_unit_misclassification_review',
    'H22-C-03|지수함수': 'cross_unit_misclassification_review',
    'H22-C-04|로그의 뜻': 'cross_unit_misclassification_review',
    'H22-C-04|복소수': 'same_key_subunit_label_leak',
    'H22-C-05|로그의 성질': 'cross_unit_misclassification_review',
    'H22-C-05|이차방정식': 'same_key_subunit_label_leak',
    'H22-C-06|로그함수': 'cross_unit_misclassification_review',
    'H22-C-06|이차방정식과 이차함수': 'cross_unit_misclassification_review',
    'H22-C-06|이차함수': 'cross_unit_misclassification_review',
    'H22-C-07|여러 가지 방정식': 'cross_unit_misclassification_review',
    'H22-C-07|지수·로그 방정식': 'cross_unit_misclassification_review',
    'H22-C-08|여러 가지 부등식': 'cross_unit_misclassification_review',
    'H22-C-08|지수·로그 부등식': 'cross_unit_misclassification_review',
    'H22-C-09|경우의 수': 'cross_unit_misclassification_review',
    'H22-C-09|삼각함수의 뜻과 값': 'cross_unit_misclassification_review',
    'M1-02|최대공약수와 최소공배수': 'cross_unit_misclassification_review',
    'M1-03|정수와 유리수': 'cross_unit_misclassification_review',
    'M1-03|좌표평면과 그래프': 'cross_unit_misclassification_review',
    'M1-04|기본 도형': 'cross_unit_misclassification_review',
    'M1-04|정수와 유리수의 계산': 'cross_unit_misclassification_review',
    'M1-05|평면도형': 'cross_unit_misclassification_review',
    'M1-06|입체도형': 'cross_unit_misclassification_review',
    'M1-07|통계': 'cross_unit_misclassification_review',
    'M2-01|유리수와 순환소수': 'same_key_subunit_label_leak',
    'M2-02|식의 계산': 'cross_unit_misclassification_review',
    'M2-03|일차부등식': 'cross_unit_misclassification_review',
    'M2-03|일차함수': 'cross_unit_misclassification_review',
    'M2-06|삼각형과 사각형의 성질': 'cross_unit_misclassification_review',
    'M3-01|제곱근과 실수': 'same_key_subunit_label_leak',
    'M3-02|다항식의 곱셈': 'same_key_subunit_label_leak',
    'M3-03|인수분해': 'cross_unit_misclassification_review',
    'M3-04|이차방정식': 'cross_unit_misclassification_review'
};

function digest(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function shortText(value, limit = 520) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length <= limit ? text : text.slice(0, limit - 1) + '…';
}
function questionLoader() {
    const contexts = new Map();
    return function load(sourceFile) {
        if (contexts.has(sourceFile)) return contexts.get(sourceFile);
        const fullPath = path.join(archiveDir, 'exams', sourceFile);
        const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
        context.globalThis = context;
        vm.createContext(context);
        try {
            vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 2000 });
            const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
            const result = Array.isArray(questions) ? { ok: true, questions } : { ok: false, error: 'questions array not found' };
            contexts.set(sourceFile, result);
            return result;
        } catch (error) {
            const result = { ok: false, error: String(error?.message || error) };
            contexts.set(sourceFile, result);
            return result;
        }
    };
}
function classify(key, label, documentedLabel, subunitLabels, otherKeyByLabel) {
    if (SAFE_ALIASES[key]?.[label]) return {
        decision: 'confirmed_alias_candidate', targetLabel: SAFE_ALIASES[key][label],
        rationale: '문항 내용과 키가 일치하는 축약·동의 라벨이다. 검색·필터에서만 연결한다.'
    };
    const override = DECISION_OVERRIDES[key + '|' + label];
    if (override) return {
        decision: override,
        targetLabel: override === 'same_key_subunit_label_leak' ? documentedLabel : '',
        rationale: override === 'same_key_subunit_label_leak'
            ? '문항 내용이 현재 standardUnitKey의 공식 범위와 일치하는 subUnit·축약 라벨이다.'
            : '샘플 문항이 다른 교육과정 단원에 해당하거나 혼합되어 있어 자동 수정하지 않고 문항별 검토로 보류한다.'
    };
    if (subunitLabels.has(label)) return {
        decision: 'same_key_subunit_label_leak', targetLabel: documentedLabel,
        rationale: '현재 키의 공식 subUnit 표시명이 standardUnit 필드에 들어온 사례다. source 값은 자동 치환하지 않는다.'
    };
    if (otherKeyByLabel.has(label)) return {
        decision: 'cross_unit_misclassification_review', targetLabel: '',
        rationale: '다른 standardUnitKey의 subUnit 표시명과 일치한다. 문항별 근거 없이 자동 수정하지 않는다.'
    };
    return {
        decision: 'manual_review_required', targetLabel: '',
        rationale: '단순 별칭인지 오분류인지 문항·출처 근거를 추가 확인해야 한다.'
    };
}
export function buildInventory() {
    const conflicts = JSON.parse(fs.readFileSync(path.join(auditDir, 'master_key_conflict_report.json'), 'utf8'));
    const inventory = JSON.parse(fs.readFileSync(path.join(phase1Dir, 'metadata-inventory-latest.json'), 'utf8'));
    const tagMaster = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json'), 'utf8'));
    const subunitsByKey = new Map();
    const otherKeyByLabel = new Map();
    for (const item of tagMaster.filter(row => row.keyType === 'subUnitKey')) {
        const label = String(item.labelKo || '').replace(/ 핵심 개념$/, '').trim();
        if (!label) continue;
        if (!subunitsByKey.has(item.standardUnitKey)) subunitsByKey.set(item.standardUnitKey, new Set());
        subunitsByKey.get(item.standardUnitKey).add(label);
        if (!otherKeyByLabel.has(label)) otherKeyByLabel.set(label, item.standardUnitKey);
    }
    const load = questionLoader();
    const entries = [];
    for (const conflict of conflicts) {
        const rows = inventory.records.filter(record => record.metadata.standardUnitKey === conflict.key && record.metadata.standardUnit && record.metadata.standardUnit !== conflict.documentedLabel);
        const byLabel = new Map();
        for (const row of rows) {
            if (!byLabel.has(row.metadata.standardUnit)) byLabel.set(row.metadata.standardUnit, []);
            byLabel.get(row.metadata.standardUnit).push(row);
        }
        for (const [label, labelRows] of byLabel) {
            const decision = classify(conflict.key, label, conflict.documentedLabel, subunitsByKey.get(conflict.key) || new Set(), otherKeyByLabel);
            const questionRefs = labelRows.map(row => {
                const loaded = load(row.sourceArchiveFile);
                const question = loaded.ok ? loaded.questions[row.sourceOrdinal - 1] : null;
                return {
                    questionUid: row.questionUid, sourceArchiveFile: row.sourceArchiveFile,
                    sourceOrdinal: row.sourceOrdinal, questionId: question?.id ?? null,
                    subUnitKey: row.metadata.subUnitKey, subUnit: row.metadata.subUnit,
                    content: shortText(question?.content, 360), loadError: loaded.ok ? '' : loaded.error
                };
            });
            const samples = questionRefs.slice(0, 3);
            entries.push({ standardUnitKey: conflict.key, documentedLabel: conflict.documentedLabel,
                observedLabel: label, affectedQuestionCount: labelRows.length, ...decision, samples, questionRefs });
        }
    }
    entries.sort((a, b) => a.standardUnitKey.localeCompare(b.standardUnitKey, 'en') || a.observedLabel.localeCompare(b.observedLabel, 'ko'));
    const counts = {};
    for (const item of entries) counts[item.decision] = (counts[item.decision] || 0) + item.affectedQuestionCount;
    const payload = { schemaVersion: 'phase1-master-label-variant-inventory-v1', sourceCommit: inventory.sourceCommit,
        metadataInventoryDigest: inventory.digest, safeAliases: SAFE_ALIASES,
        totals: { variantRows: entries.length, affectedQuestions: entries.reduce((sum, item) => sum + item.affectedQuestionCount, 0) }, counts, entries };
    return { generatedAt: new Date().toISOString(), digest: digest(JSON.stringify(payload)), ...payload };
}
function renderMarkdown(report) {
    const out = ['# 표준단원 라벨 변형 문항별 inventory', '', '- 생성 시각: ' + report.generatedAt,
        '- 메타데이터 inventory digest: ' + report.metadataInventoryDigest,
        '- 변형 행: ' + report.totals.variantRows, '- 영향 문항: ' + report.totals.affectedQuestions,
        '- 자동 수정: 0건 (source standardUnit 보존)', '', '## 판정 집계', ''];
    for (const [key, value] of Object.entries(report.counts)) out.push('- ' + key + ': ' + value + '문항');
    out.push('', '## 변형 목록', '', '| Key | 마스터 단원 | 관측 라벨 | 문항 수 | 판정 | 검색 연결 대상 |', '|---|---|---|---:|---|---|');
    for (const item of report.entries) out.push('| ' + item.standardUnitKey + ' | ' + item.documentedLabel + ' | ' + item.observedLabel + ' | ' + item.affectedQuestionCount + ' | ' + item.decision + ' | ' + (item.targetLabel || '') + ' |');
    out.push('', '## 결정 원칙', '', '- confirmed_alias_candidate는 검색·필터용 alias 후보로만 등록하며 원본 JS의 standardUnit/subUnitKey를 자동 치환하지 않는다.', '- same_key_subunit_label_leak는 현재 키의 공식 subUnit 표시명이 standardUnit 필드에 들어온 사례다.', '- cross_unit_misclassification_review와 manual_review_required는 문항별 근거 확인 전 보류한다.', '', '## 문항 샘플');
    for (const item of report.entries.filter(entry => entry.decision !== 'same_key_subunit_label_leak')) {
        out.push('', '### ' + item.standardUnitKey + ' · ' + item.observedLabel, '', '- 판정: ' + item.decision, '- 근거: ' + item.rationale);
        for (const sample of item.samples) out.push('  - ' + sample.sourceArchiveFile + '#' + sample.sourceOrdinal + ': ' + sample.content);
    }
    return out.join('\n') + '\n';
}
function main() {
    const report = buildInventory();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'master-label-variant-inventory-v1.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(outputDir, 'master-label-variant-inventory-v1.md'), renderMarkdown(report), 'utf8');
    console.log(JSON.stringify({ output: path.relative(repoRoot, outputDir).replace(/\\/g, '/'), digest: report.digest, totals: report.totals, counts: report.counts }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
