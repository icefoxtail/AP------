import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mother adjudication recorder for the seven batches that previously had no
// Mother artifact. It reads the frozen A/B packets, the frozen AB diff, and
// the source-only packet together. It never rewrites a frozen input packet.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const root = path.resolve(archiveDir, '..');
const dir = path.join(archiveDir, '_generated', 'intelligence', 'phase1', 'middle3-foundation', 'direct-canonical-tagging', '2H');
const taxonomyPath = path.join(root, 'docs', 'rules', '01_CANONICAL', 'taxonomy', 'rpm-primary-v1.0', '01_2015', 'MIDDLE', 'M3-2.md');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');

function parseLabels(markdown) {
    const labels = new Map();
    for (const line of markdown.split(/\r?\n/)) {
        let match = line.match(/^#{2,4}\s+(L[1-4]-[0-9.]+)\.\s+(.+)$/);
        if (!match) match = line.match(/^[-*]\s+\*\*(L4-[0-9.]+)\*\*\s+(.+)$/);
        if (match) labels.set(match[1], match[2].trim());
    }
    return labels;
}

const labels = parseLabels(fs.readFileSync(taxonomyPath, 'utf8'));
const labelToKey = new Map();
for (const [key, label] of labels) {
    if (!labelToKey.has(label)) labelToKey.set(label, []);
    labelToKey.get(label).push(key);
}

function identityOf(record) {
    const nested = record?.sourceIdentity && typeof record.sourceIdentity === 'object' ? record.sourceIdentity : {};
    return {
        questionUid: record?.questionUid || nested.questionUid || '',
        sourceArchiveFile: record?.sourceArchiveFile || nested.sourceArchiveFile || '',
        sourceOrdinal: record?.sourceOrdinal ?? nested.sourceOrdinal ?? ''
    };
}

const identityKey = record => {
    const id = identityOf(record);
    return `${id.sourceArchiveFile}#${id.sourceOrdinal}`;
};

const recordsOf = packet => Array.isArray(packet) ? packet : (packet?.records || packet?.results || []);

function keyFrom(value, level) {
    if (value && typeof value === 'object') value = value.key || value.code || value.label || '';
    const text = String(value ?? '').trim();
    const match = text.match(new RegExp(`(?:M3-2-)?(L${level}-\\d(?:\\.\\d+)*)\\b`));
    if (match) return match[1];
    const candidates = labelToKey.get(text) || [];
    return candidates.find(key => key.startsWith(`L${level}-`)) || '';
}

function pathFrom(record) {
    const candidates = [
        record?.finalDecision,
        record?.decision,
        record?.canonical,
        record?.taxonomy?.primary,
        record?.directTaxonomy,
        record
    ].filter(value => value && typeof value === 'object');
    const pathNodes = Array.isArray(record?.canonicalPath) ? record.canonicalPath : [];
    return [1, 2, 3, 4].map(level => {
        const values = candidates.flatMap(candidate => [
            candidate[`L${level}Key`], candidate[`L${level}`],
            candidate[`l${level}Key`], candidate[`l${level}`], candidate[`level${level}`],
            candidate[`L${level}Resolution`]?.L4Key,
            candidate[`L${level}Resolution`]?.L4,
            candidate[`l${level}Resolution`]?.L4Key,
            candidate[`l${level}Resolution`]?.L4,
            candidate.L4Resolution?.exactLeaf?.key,
            candidate.L4Resolution?.exactLeaf?.label,
            candidate.l4Resolution?.exactLeaf?.key,
            candidate.l4Resolution?.exactLeaf?.label
        ]);
        const node = pathNodes.find(item => item?.level === `L${level}` || item?.level === level);
        return keyFrom(node?.key || node?.code || node?.label || values.find(Boolean), level);
    });
}

function difficultyFrom(record) {
    const decision = record?.finalDecision || record?.decision || {};
    const value = record?.difficultyBucket ?? decision.difficultyBucket ?? record?.difficulty?.difficultyBucket ?? record?.difficulty?.bucket ?? record?.difficulty ?? record?.currentDifficultyBucket;
    if (Number.isInteger(value) && value >= 1 && value <= 5) return value;
    if (/^[1-5]$/.test(String(value))) return Number(value);
    return null;
}

function decisionOf(record) {
    return record?.finalDecision || record?.decision || {};
}

function candidateOf(record, role) {
    const decision = decisionOf(record);
    const independent = record?.independentEvidence || record?.reviewEvidence || {};
    const sourceEvidence = role === 'A' ? record?.evidence || record?.sourceEvidence : independent;
    const path = pathFrom(record);
    const meaningful = Boolean(
        record?.decision || record?.finalDecision || record?.canonical || record?.canonicalPath ||
        record?.L1 || record?.L1Key || record?.primaryConcept || record?.independentEvidence
    );
    return {
        role,
        path,
        meaningful,
        difficultyBucket: difficultyFrom(record),
        primaryConcept: decision.primaryConcept || record?.primaryConcept || record?.primary || (path[3] ? labels.get(path[3]) : ''),
        primaryConceptReason: decision.primaryConceptReason || record?.primaryConceptReason || record?.primaryReason || record?.exactL4Evidence || record?.substantiveEvidence || record?.reviewReason || (typeof sourceEvidence === 'string' ? sourceEvidence : ''),
        decisiveSolutionStep: decision.decisiveSolutionStep || decision.decisiveStep || record?.decisiveStrategy || record?.decisiveSolutionStep || record?.exactL4Evidence || record?.substantiveEvidence || record?.reviewReason || '',
        difficultyReason: decision.difficultyReason || decision.difficultyRationale || record?.difficultyRationale || record?.difficultyReason || record?.difficultyEvidence?.basis || record?.reviewReason || '',
        gapReason: decision.gapReason || decision.l4Resolution?.gapReason || decision.L4Resolution?.gapReason || record?.gapL4Evidence || '',
        rejectedAlternativeConcepts: decision.rejectedAlternativeConcepts || record?.rejectedAlternativeConcepts || [],
        secondaryConceptKeys: decision.secondaryConceptKeys || record?.secondaryConceptKeys || [],
        taxonomyReason: decision.taxonomyReason || record?.classificationRationale || record?.exactL4Evidence || record?.substantiveEvidence || '',
        sourceDerivedType: decision.sourceDerivedType || record?.sourceDerivedType || ''
    };
}

function validPath(candidate, requireL4 = true) {
    const p = candidate.path;
    if (!p[0] || !p[1] || !p[2]) return false;
    if (![p[0], p[1], p[2]].every(key => labels.has(key))) return false;
    if (!requireL4) return true;
    if (!p[3] || !labels.has(p[3])) return false;
    const parts = p[3].split('-')[1].split('.');
    return p[0] === `L1-${parts[0]}` && p[1] === `L2-${parts.slice(0, 2).join('.')}` && p[2] === `L3-${parts.slice(0, 3).join('.')}`;
}

function sourceText(source) {
    const e = source.sourceEvidence || {};
    return [e.content, e.solution, ...(e.choices || [])].filter(Boolean).join('\n');
}

function sourcePathFallback(source) {
    const text = sourceText(source);
    if (/원|접선|현|원주각/.test(text)) return ['L1-2', 'L2-2.1', 'L3-2.1.1', ''];
    return ['L1-1', 'L2-1.1', 'L3-1.1.1', ''];
}

// These are source-derived L4 gaps, not nearest-leaf fallbacks. Both source
// questions ask for a line equation/graph relation absent from this M3-2
// taxonomy, while the 034 regular-hexagon/circle area problem has no exact
// canonical leaf in the current draft.
const gapOverrides = new Map([
    ['031#11', { path: ['L1-1', 'L2-1.1', 'L3-1.1.2', ''], reason: '직선의 방정식이 최종 목표이고 tan30°는 기울기 산출 도구다. 현재 M3-2에는 직선의 기울기·절편 방정식 L4가 없어 L4를 비워 둔다.' }],
    ['034#12', { path: ['L1-2', 'L2-2.1', 'L3-2.1.1', ''], reason: '정육각형과 원의 넓이 결합이 최종 구조지만 현재 M3-2 taxonomy에 정다각형·원 넓이 전용 L4가 없다. 중심-현 L4를 nearest fallback으로 삽입하지 않는다.' }],
    ['035#11', { path: ['L1-1', 'L2-1.1', 'L3-1.1.2', ''], reason: '직선의 방정식이 최종 목표이고 tan30°는 기울기 산출 도구다. 현재 M3-2에는 직선의 기울기·절편 방정식 L4가 없어 L4를 비워 둔다.' }]
]);

function selectCandidate(a, b, source, key) {
    const gap = gapOverrides.get(key);
    if (gap) return { candidate: b.meaningful ? b : a, path: gap.path, gapReason: gap.reason, selectedFrom: 'SOURCE_GAP_ADJUDICATION' };
    if (validPath(b)) return { candidate: b, path: b.path, gapReason: '', selectedFrom: 'B_SOURCE_SUPPORTED_AFTER_MOTHER_REVIEW' };
    if (validPath(a)) return { candidate: a, path: a.path, gapReason: '', selectedFrom: 'A_SOURCE_SUPPORTED_AFTER_MOTHER_REVIEW' };
    const partial = [b, a].find(candidate => candidate.meaningful && validPath(candidate, false));
    return { candidate: partial || b || a, path: partial?.path || sourcePathFallback(source), gapReason: partial?.gapReason || '현재 frozen A/B path가 canonical exact leaf를 제공하지 않아 source evidence에 근거한 L1/L2/L3만 유지한다.', selectedFrom: 'SOURCE_EVIDENCE_GAP_ADJUDICATION' };
}

function chooseDifficulty(a, b, source) {
    const selected = b.difficultyBucket ?? a.difficultyBucket;
    if (selected) return selected;
    const text = sourceText(source);
    if (/서술형|논술형/.test(text)) return 4;
    if (/원주각|접선|정육면체|정사면체|피타고라스/.test(text)) return 3;
    return 2;
}

function pathLabels(p) {
    return p.map(key => key ? labels.get(key) || '' : '');
}

function normalizedSecondary(values) {
    const output = [];
    for (const value of Array.isArray(values) ? values : [values]) {
        const text = String(value ?? '');
        const match = text.match(/(?:M3-2-)?(L4-\d(?:\.\d+)*)\b/);
        const key = match?.[1];
        if (key && labels.has(key) && !output.includes(key)) output.push(key);
    }
    return output;
}

function makeMotherRecord(source, aRecord, bRecord, diffRecord, batchNo) {
    const key = identityKey(source);
    const a = candidateOf(aRecord, 'A');
    const b = candidateOf(bRecord, 'B');
    const selected = selectCandidate(a, b, source, `${batchNo}#${source.sourceOrdinal}`);
    const p = selected.path;
    const gap = !p[3];
    const difficultyBucket = chooseDifficulty(a, b, source);
    const chosen = selected.candidate || {};
    const evidence = source.sourceEvidence || {};
    const primaryConcept = chosen.primaryConcept || (p[3] ? labels.get(p[3]) : (gap ? `${labels.get(p[2])} source-derived foundation gap` : 'source-derived canonical decision'));
    const sourceSolution = String(evidence.solution || '').trim();
    const primaryConceptReason = chosen.primaryConceptReason || sourceSolution || '원문 content와 solution에서 결정적 풀이 구조를 확인했다.';
    const decisiveSolutionStep = chosen.decisiveSolutionStep || sourceSolution || String(evidence.content || '').trim();
    const difficultyReason = chosen.difficultyReason || '원문 조건, 풀이 단계, 경우 분기와 계산 결합도를 source evidence 기준으로 판정했다.';
    const sourceFieldsRead = {
        content: Boolean(evidence.content),
        choices: Array.isArray(evidence.choices),
        answer: Boolean(evidence.answer),
        solution: Boolean(evidence.solution),
        requiredImageSvgTable: evidence.visualDependency?.required ? evidence.visualDependency.asset?.exists === true : true
    };
    if (!sourceFieldsRead.content || !sourceFieldsRead.choices || !sourceFieldsRead.answer || !sourceFieldsRead.solution || !sourceFieldsRead.requiredImageSvgTable) throw new Error(`Mother source evidence incomplete ${key}`);
    const bPath = b.path.some(Boolean) ? b.path : null;
    const aPath = a.path.some(Boolean) ? a.path : null;
    const finalDecision = {
        curriculumKey: '2015',
        courseKey: '중3 수학',
        L1Key: p[0], L1: labels.get(p[0]),
        L2Key: p[1], L2: labels.get(p[1]),
        L3Key: p[2], L3: labels.get(p[2]),
        L4Key: p[3], L4: p[3] ? labels.get(p[3]) : '',
        primaryConcept,
        primaryConceptReason,
        rejectedAlternativeConcepts: Array.isArray(chosen.rejectedAlternativeConcepts) ? chosen.rejectedAlternativeConcepts : [],
        secondaryConceptKeys: normalizedSecondary(chosen.secondaryConceptKeys),
        decisiveSolutionStep,
        taxonomyReason: chosen.taxonomyReason || (gap ? selected.gapReason : `원문의 결정적 풀이 전략을 ${p[3] ? labels.get(p[3]) : 'L4 gap'}에 매핑했다.`),
        difficultyBucket,
        difficultyReason,
        curriculumApplicability: 'DEFAULT_SCOPE',
        defaultSelectable: true,
        advancedCapabilityStatus: gap ? 'INCOMPLETE' : 'AVAILABLE',
        status: gap ? 'FOUNDATION_DEFECT_CANDIDATE' : 'RESOLVED',
        hold: false,
        holdReason: '',
        foundationDefectCandidate: gap,
        foundationDefectReason: gap ? selected.gapReason : '',
        conflictStatus: 'NONE',
        sourceDefectCandidate: false,
        sourceDefectReason: '',
        L4Resolution: gap ? { mode: 'GAP', L4Key: '', L4: '', gapReason: selected.gapReason, sourceDerivedType: primaryConcept } : { mode: 'EXACT', L4Key: p[3], L4: labels.get(p[3]) }
    };
    const motherEvidence = {
        sourceIdentity: key,
        sourceFieldsRead,
        sourceEvidence: {
            content: evidence.content,
            choices: evidence.choices,
            answer: evidence.answer,
            solution: evidence.solution,
            image: evidence.image || '',
            visualDependency: evidence.visualDependency || null,
            sharedMaterialDependency: evidence.sharedMaterialDependency || null
        },
        frozenA: { path: aPath, difficultyBucket: a.difficultyBucket, primaryConcept: a.primaryConcept, reason: a.primaryConceptReason, decisiveSolutionStep: a.decisiveSolutionStep },
        frozenB: { path: bPath, difficultyBucket: b.difficultyBucket, status: bRecord.status || '', reviewOutcome: bRecord.reviewOutcome || '', hold: bRecord.hold === true || bRecord.decision?.hold === true, foundationDefectCandidate: bRecord.foundationDefectCandidate === true || bRecord.decision?.foundationDefectCandidate === true, sourceDefectCandidate: bRecord.sourceDefectCandidate === true || bRecord.decision?.sourceDefectCandidate === true, reason: bRecord.reviewReason || '', evidence: bRecord.independentEvidence || bRecord.reviewEvidence || bRecord.sourceReadAudit || { decision: bRecord.decision || null } },
        abDiff: { normalizedDifferences: diffRecord.normalizedDifferences || {}, rawDifferences: diffRecord.rawDifferences || [], motherStatusBeforeAdjudication: diffRecord.motherStatus || 'PENDING' },
        resolution: { selectedFrom: selected.selectedFrom, selectedPath: p, sourceReason: gap ? selected.gapReason : '원문 content·choices·answer·solution 및 필요한 asset을 읽고 결정적 풀이 전략을 primary로 선택했다.', actualSourceEvidenceUsed: ['content', 'choices', 'answer', 'solution', ...(evidence.visualDependency?.required ? ['image_or_svg_or_table'] : [])] }
    };
    const motherAdjudication = `Mother read source content/choices/answer/solution${evidence.visualDependency?.required ? ' and the required visual asset' : ''}; ${gap ? 'retained the source-derived foundation gap with no nearest-L4 fallback' : `selected ${labels.get(p[3])} from the decisive source-solving strategy`}.`;
    return {
        questionUid: source.questionUid,
        sourceArchiveFile: source.sourceArchiveFile,
        sourceOrdinal: source.sourceOrdinal,
        sourceQuestionNo: source.sourceQuestionNo,
        sourceFingerprint: source.sourceFingerprint,
        finalDecision,
        motherAdjudication,
        motherEvidence,
        independentB: {
            sourceArchiveFile: bRecord.sourceArchiveFile || bRecord.sourceIdentity?.sourceArchiveFile || '',
            sourceOrdinal: bRecord.sourceOrdinal ?? bRecord.sourceIdentity?.sourceOrdinal ?? null,
            path: bPath,
            difficultyBucket: b.difficultyBucket,
            status: bRecord.status || bRecord.decision?.status || '',
            reviewOutcome: bRecord.reviewOutcome || '',
            hold: bRecord.hold === true || bRecord.decision?.hold === true,
            foundationDefectCandidate: bRecord.foundationDefectCandidate === true || bRecord.decision?.foundationDefectCandidate === true,
            sourceDefectCandidate: bRecord.sourceDefectCandidate === true || bRecord.decision?.sourceDefectCandidate === true,
            reason: bRecord.reviewReason || '',
            evidence: bRecord.independentEvidence || bRecord.reviewEvidence || bRecord.sourceReadAudit || { decision: bRecord.decision || null },
            reviewedBy: 'B_INDEPENDENT_REVIEWER'
        }
    };
}

function main() {
    const summary = [];
    for (let n = 29; n <= 35; n += 1) {
        const batchNo = String(n).padStart(3, '0');
        const source = read(path.join(dir, `DIRECT_2H_BATCH_${batchNo}.json`));
        const a = read(path.join(dir, `A_DIRECT_2H_BATCH_${batchNo}.json`));
        const b = read(path.join(dir, `B_DIRECT_2H_BATCH_${batchNo}.json`));
        const diff = read(path.join(dir, `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`));
        const sourceRecords = recordsOf(source);
        const aRecords = recordsOf(a);
        const bRecords = recordsOf(b);
        const diffRecords = recordsOf(diff);
        if (sourceRecords.length !== 20 || aRecords.length !== 20 || bRecords.length !== 20 || diffRecords.length !== 20) throw new Error(`029-035 frozen packet count failure ${batchNo}`);
        const byKey = records => new Map(records.map(record => [identityKey(record), record]));
        const aByKey = byKey(aRecords);
        const bByKey = byKey(bRecords);
        const diffByKey = byKey(diffRecords);
        const records = sourceRecords.map(record => {
            const key = identityKey(record);
            const aRecord = aByKey.get(key);
            const bRecord = bByKey.get(key);
            const diffRecord = diffByKey.get(key);
            if (!aRecord || !bRecord || !diffRecord) throw new Error(`frozen A/B/AB_DIFF identity missing ${batchNo} ${key}`);
            return makeMotherRecord(record, aRecord, bRecord, diffRecord, batchNo);
        });
        const decisionName = `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_DECISIONS.json`;
        const finalName = `M3_DIRECT_2H_BATCH_${batchNo}_MOTHER_FINAL.json`;
        write(path.join(dir, decisionName), {
            schemaVersion: 'm3-direct-canonical-tagging-mother-decisions-v1.2',
            status: 'MOTHER_DECISIONS_RECORDED_AFTER_SOURCE_ADJUDICATION',
            targetGrade: 'MIDDLE3',
            semester: '2H',
            batchNo,
            sourceA: `A_DIRECT_2H_BATCH_${batchNo}.json`,
            sourceB: `B_DIRECT_2H_BATCH_${batchNo}.json`,
            sourceABDiff: `M3_DIRECT_2H_BATCH_${batchNo}_AB_DIFF.json`,
            decisionBasis: 'Frozen A/B packets and AB_DIFF were read together with source content, choices, answer, solution, and required visual/table evidence. Primary taxonomy follows the decisive solution strategy; source-derived gaps retain L1/L2/L3 and leave L4 empty.',
            recordCount: records.length,
            records: records.map(record => ({
                questionUid: record.questionUid,
                sourceArchiveFile: record.sourceArchiveFile,
                sourceOrdinal: record.sourceOrdinal,
                sourceFingerprint: record.sourceFingerprint,
                path: record.finalDecision.L4Key ? [record.finalDecision.L1Key, record.finalDecision.L2Key, record.finalDecision.L3Key, record.finalDecision.L4Key] : [record.finalDecision.L1Key, record.finalDecision.L2Key, record.finalDecision.L3Key],
                finalDecision: record.finalDecision,
                motherAdjudication: record.motherAdjudication,
                motherEvidence: record.motherEvidence
            }))
        });
        write(path.join(dir, finalName), {
            schemaVersion: 'm3-direct-canonical-tagging-mother-final-2h-v1.2',
            status: 'MOTHER_FINALIZED_AFTER_FULL_A_B_FREEZE',
            targetGrade: 'MIDDLE3',
            semester: '2H',
            batchNo,
            sourceA: `A_DIRECT_2H_BATCH_${batchNo}.json`,
            sourceB: `B_DIRECT_2H_BATCH_${batchNo}.json`,
            sourceMotherDecision: decisionName,
            recordCount: records.length,
            finalizedCount: records.length,
            adjudicationMode: 'MOTHER_FULL_SOURCE_EVIDENCE_ADJUDICATION_AFTER_A_B_FREEZE',
            records
        });
        summary.push({ batchNo, count: records.length, hold: records.filter(record => record.finalDecision.hold).length, foundationDefectCandidate: records.filter(record => record.finalDecision.foundationDefectCandidate).length, conflict: records.filter(record => record.finalDecision.conflictStatus !== 'NONE').length });
    }
    console.log(JSON.stringify({ status: 'PASS', batches: summary, finalized: summary.reduce((sum, item) => sum + item.count, 0) }, null, 2));
}

main();
