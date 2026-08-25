import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Build a review-only queue from the label-variant inventory. */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const phase1Dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1');
const sourcePath = path.join(phase1Dir, 'master-audit', 'label-variants', 'master-label-variant-inventory-v1.json');
const tagMasterPath = path.join(archiveDir, 'data', 'master_tables', 'js_archive_tag_master.json');
const outputDir = path.join(phase1Dir, 'master-audit', 'cross-unit-adjudication');

function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

export function buildQueue() {
    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const master = JSON.parse(fs.readFileSync(tagMasterPath, 'utf8'));
    const standardLabels = new Map();
    for (const item of master.filter(row => row.keyType === 'standardUnitKey')) {
        if (!item.labelKo) continue;
        const label = String(item.labelKo).trim();
        if (!standardLabels.has(label)) standardLabels.set(label, []);
        standardLabels.get(label).push(item.key);
    }
    const groups = source.entries.filter(entry => entry.decision === 'cross_unit_misclassification_review').map(entry => {
        const family = entry.standardUnitKey.startsWith('H15-') ? 'H15-' : entry.standardUnitKey.startsWith('H22-') ? 'H22-' : entry.standardUnitKey.slice(0, 3);
        const exactMasterKey = (standardLabels.get(entry.observedLabel) || []).find(key => key.startsWith(family) && key !== entry.standardUnitKey) || '';
        const reviewClass = exactMasterKey && exactMasterKey !== entry.standardUnitKey
            ? 'exact_master_label_match'
            : 'content_and_source_review_required';
        return {
            standardUnitKey: entry.standardUnitKey,
            documentedLabel: entry.documentedLabel,
            observedLabel: entry.observedLabel,
            affectedQuestionCount: entry.affectedQuestionCount,
            reviewClass,
            recommendedStandardUnitKey: exactMasterKey,
            recommendedStandardUnitLabel: exactMasterKey ? entry.observedLabel : '',
            rationale: exactMasterKey
                ? '관측 라벨이 다른 공식 standardUnit의 표준 라벨과 정확히 일치한다. 문항 내용 확인 후에만 승격한다.'
                : '관측 라벨이 공식 standardUnit 라벨과 직접 일치하지 않거나 혼합 단원일 수 있어 문항 내용·해설·출처 확인이 필요하다.',
            questionRefs: entry.questionRefs
        };
    });
    const counts = {};
    const keyCounts = {};
    const fileCounts = {};
    for (const group of groups) {
        counts[group.reviewClass] = (counts[group.reviewClass] || 0) + group.affectedQuestionCount;
        keyCounts[group.standardUnitKey] = (keyCounts[group.standardUnitKey] || 0) + group.affectedQuestionCount;
        for (const row of group.questionRefs) fileCounts[row.sourceArchiveFile] = (fileCounts[row.sourceArchiveFile] || 0) + 1;
    }
    const payload = {
        schemaVersion: 'phase1-cross-unit-adjudication-queue-v1',
        sourceDigest: source.digest,
        totals: { groups: groups.length, questions: groups.reduce((sum, row) => sum + row.affectedQuestionCount, 0) },
        counts,
        keyCounts: Object.fromEntries(Object.entries(keyCounts).sort(([, a], [, b]) => b - a)),
        fileCounts: Object.fromEntries(Object.entries(fileCounts).sort(([, a], [, b]) => b - a)),
        groups
    };
    return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(payload)), ...payload };
}

function renderMarkdown(queue) {
    const lines = ['# 교차 단원 오분류 adjudication queue', '', '- 자동 수정: 0건', '- 대상 그룹: ' + queue.totals.groups, '- 대상 문항: ' + queue.totals.questions, '', '## 판정 집계', ''];
    for (const [key, value] of Object.entries(queue.counts)) lines.push('- ' + key + ': ' + value + '문항');
    lines.push('', '## 그룹 목록', '', '| 현재 key | 관측 라벨 | 문항 수 | 분류 | 추천 key |', '|---|---|---:|---|---|');
    for (const group of queue.groups) lines.push('| ' + group.standardUnitKey + ' | ' + group.observedLabel + ' | ' + group.affectedQuestionCount + ' | ' + group.reviewClass + ' | ' + (group.recommendedStandardUnitKey || '') + ' |');
    lines.push('', '## 적용 원칙', '', '- exact_master_label_match도 문항 내용·해설 확인 전에는 production JS를 수정하지 않는다.', '- content_and_source_review_required는 출처와 교육과정 맥락을 확인한 뒤에만 수정 후보로 승격한다.', '- 모든 questionRefs는 JSON에서 확인할 수 있으며, source standardUnit 원문은 보존한다.', '');
    return lines.join('\n');
}

function main() {
    const queue = buildQueue();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'cross-unit-adjudication-queue-v1.json'), JSON.stringify(queue, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(outputDir, 'cross-unit-adjudication-queue-v1.md'), renderMarkdown(queue), 'utf8');
    console.log(JSON.stringify({ output: path.relative(repoRoot, outputDir).replace(/\\/g, '/'), digest: queue.digest, totals: queue.totals, counts: queue.counts }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
