import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const archiveDir = path.join(repoRoot, 'archive');
const sourceRoot = path.join(archiveDir, 'exams', 'original', 'middle');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');
const handoffPath = path.join(archiveDir, 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'm2_stage2_semantic_freeze_20260921.json');
const outputDir = path.join(archiveDir, 'data', 'meta-foundation', 'candidates', 'middle-geometry', 'v1');
const evidenceDir = path.join(archiveDir, 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const baseMainSha = '843d26d60780ae1502dd53d75c8f2b064b98174f';

const M2_TARGETS = new Set([
    'M2-05-TRIANGLE_PROPERTIES',
    'M2-05-QUADRILATERAL_PROPERTIES',
    'M2-06-SIMILAR_FIGURE',
    'M2-06-PARALLEL_LENGTH_RATIO'
]);
const M3_TARGETS = new Set([
    'M3-05-TRIG_RATIO',
    'M3-05-TRIG_RATIO_APPLICATION',
    'M3-06-CIRCLE_LINE',
    'M3-06-CIRCLE_INSCRIBED_ANGLE'
]);

const M2_ROUTE_OUT = new Map([
    ['original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js#15', { route: 'M2-07-PYTHAGOREAN_APPLICATION', reason: '세 변 제곱 비교로 예각삼각형 판정' }],
    ['original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js#16', { route: 'M2-07-PYTHAGOREAN_APPLICATION', reason: '세 변 제곱 비교로 둔각삼각형 판정; source solution numeric contradiction retained' }],
    ['original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js#20', { route: 'M1-06-PLANE_FIGURE_MEASURE', reason: '삼각형 성립조건/삼각부등식; current M2-05 L3 신규 생성 금지; content/solution mismatch' }],
    ['original/middle/m2/2mid/23_향림중_2학기_중간_중2_수학.js#20', { route: 'M1-06-PLANE_FIGURE_MEASURE', reason: '평행선 사이 같은 높이로 삼각형 넓이 동일' }],
    ['original/middle/m2/2mid/25_연향중_2학기_중간_중2_수학.js#17', { route: 'M1-06-PLANE_FIGURE_MEASURE', reason: '같은 높이 삼각형의 넓이비와 밑변비' }]
]);
const M2_CENTROID = new Set([
    'original/middle/m2/2mid/24_금당중_2학기_중간_중2_수학.js#7',
    'original/middle/m2/2mid/24_금당중_2학기_중간_중2_수학.js#8',
    'original/middle/m2/2mid/24_금당중_2학기_중간_중2_수학.js#9'
]);
const M2_QUADRILATERAL = new Set([
    'original/middle/m2/2mid/23_왕운중_2학기_중간_중2_수학.js#14',
    'original/middle/m2/2mid/23_신흥중_2학기_중간_중2_수학.js#22',
    'original/middle/m2/2mid/25_왕운중_2학기_중간_중2_수학.js#25'
]);
const M2_REVERSE_SIMILARITY = 'original/middle/m2/2final/23_신흥중_2학기_기말_중2_기출.js#5';

const NEW_L3 = {
    PT_ISOSCELES_TRIANGLE: ['이등변삼각형의 성질', '이등변삼각형의 변·각 관계를 핵심 전략으로 구하거나 판정하는 유형.'],
    PT_RIGHT_TRIANGLE_CONGRUENCE: ['직각삼각형의 합동', 'RHS·RHA 등 직각삼각형 합동 조건을 핵심 전략으로 이용하는 유형.'],
    PT_TRIANGLE_ANGLE_BISECTOR: ['삼각형의 각의 이등분선', '삼각형의 각의 이등분선 성질을 독립적인 결정적 전략으로 이용하는 유형.'],
    PT_TRIANGLE_CENTERS: ['삼각형의 외심·내심', '삼각형의 외심·내심 및 중심과 관련된 성질을 핵심 전략으로 이용하는 유형.'],
    PT_QUADRILATERAL_PROPERTIES: ['사각형의 성질과 판정', '평행사변형·직사각형·마름모·사다리꼴 등 사각형의 성질과 판정을 핵심 전략으로 이용하는 유형.'],
    PT_SIMILAR_FIGURES: ['닮은 도형', '닮음비·대응변·각·넓이비·축척 등의 닮은 도형 관계를 이용하는 유형.'],
    PT_TRIANGLE_SIMILARITY: ['삼각형의 닮음', 'AA·SAS·SSS 등 삼각형의 닮음 성립 또는 판정 자체가 decisive step인 유형.'],
    PT_PARALLEL_SEGMENT_RATIO: ['평행선과 선분의 길이의 비', '평행선에 의해 나뉘는 선분의 길이비와 비례 관계를 이용하는 유형.'],
    PT_TRIG_RATIO: ['삼각비의 값과 관계', '직각삼각형·특수각·삼각비표에서 삼각비의 값과 관계를 직접 구하거나 판정하는 유형.'],
    PT_TRIG_RATIO_APPLICATION: ['삼각비의 활용', '삼각비를 이용해 길이·높이·거리·넓이 등 다른 기하량을 구하는 유형.'],
    PT_CIRCLE_ANGLE_RELATIONS: ['원주각·중심각과 원의 각 관계', '원주각·중심각·호·내접사각형 및 접선-현의 각 관계를 핵심 전략으로 이용하는 유형.']
};

const ACTIVE_L3_OWNERS = {
    PT_COORD_CENTROID: 'GEOMETRY_EQUATIONS',
    PT_CIRCLE_LINE_RELATION: 'GEOMETRY_EQUATIONS',
    PT_CIRCLE_TANGENT: 'GEOMETRY_EQUATIONS',
    PT_TWO_CIRCLES: 'GEOMETRY_EQUATIONS'
};

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function stableJson(value) {
    return JSON.stringify(value);
}

function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
}

function normalizeFile(value) {
    return text(value).normalize('NFC').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').trim();
}

function sourceFingerprint(question) {
    return sha256(stableJson({
        content: question?.content ?? null,
        choices: Array.isArray(question?.choices) ? question.choices : null,
        answer: question?.answer ?? null,
        solution: question?.solution ?? null,
        image: question?.image ?? null
    }));
}

function runSource(fullPath) {
    const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 3000 });
    const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
    if (!Array.isArray(questions)) throw new Error(`question array not found: ${fullPath}`);
    return questions;
}

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
        .filter(file => file.endsWith('.js'));
}

function compact(value, length = 220) {
    const oneLine = text(value).replace(/\s+/g, ' ');
    return oneLine.length <= length ? oneLine : oneLine.slice(0, length - 1) + '…';
}

function sourceTuple(record) {
    return `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
}

function questionText(question) {
    return `${text(question.content)} ${text(question.solution)}`.replace(/\s+/g, ' ');
}

function getWorkingSubUnit(sourceArchiveFile, sourceOrdinal, current) {
    const tuple = `${sourceArchiveFile}#${sourceOrdinal}`;
    if (tuple === 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js#23') return 'M3-06-CIRCLE_LINE';
    if (tuple === 'original/middle/m3/2mid/25_연향중_2학기_중간_중3_수학.js#12') return 'M3-05-TRIG_RATIO_APPLICATION';
    if (tuple === M2_REVERSE_SIMILARITY) return 'M2-06-SIMILAR_FIGURE';
    return current;
}

function getWorkingStandardUnitKey(workingSubUnitKey, sourceStandardUnitKey) {
    const match = text(workingSubUnitKey).match(/^(M\d-\d+)/);
    return match ? match[1] : sourceStandardUnitKey;
}

function triangleL3(tuple, question, handoff) {
    if (M2_ROUTE_OUT.has(tuple)) return null;
    if (M2_CENTROID.has(tuple)) return 'PT_COORD_CENTROID';
    if (M2_QUADRILATERAL.has(tuple)) return 'PT_QUADRILATERAL_PROPERTIES';
    const combined = questionText(question);
    if (/외심|내심|내접원|외접원|보물/.test(combined)) return 'PT_TRIANGLE_CENTERS';
    if (/직각.*(합동|삼각형)|합동.*직각|RHS|RHA/.test(combined)) return 'PT_RIGHT_TRIANGLE_CONGRUENCE';
    if (/이등분선|이등분/.test(combined)) return 'PT_TRIANGLE_ANGLE_BISECTOR';
    if (/이등변|두 변.*같|밑각|꼭짓각|AB.*AC|AC.*AB|AB=BC|BC=CD|정삼각형/.test(combined)) return 'PT_ISOSCELES_TRIANGLE';
    if (tuple === 'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#6') return 'PT_TRIANGLE_CENTERS';
    throw new Error(`M2 triangle L3 unresolved: ${tuple}`);
}

function circleL3(question, workingSubUnit) {
    const content = text(question.content).replace(/\s+/g, ' ');
    const combined = questionText(question);
    const circleLine = workingSubUnit === 'M3-06-CIRCLE_LINE';
    const twoCircles = /(두\s+원(?:\s|이|의|은|을|과|에서|에)|두개의\s*원|작은 원|큰 원|동심원|원 P와 반원|원과 반원)/.test(content);
    const lineProduct = /현.*곱|선분곱|할선.*곱|곱.*현|곱.*할선/.test(combined);
    const angleCue = /원주각|중심각|호|내접.*사각형|맞은각|접선.*현|현.*접선|교차현.*각|할선.*각/.test(content);
    const tangentCue = /접선|접점|접하는/.test(content);
    const centerCue = /원의 중심|중심을 찾|중심에서.*현|현.*수직이등분|내심|외심|내접원.*(반지름|넓이|둘레)|외접원.*(반지름|넓이|둘레)|삼각형의 내접원/.test(content);
    if (twoCircles) return 'PT_TWO_CIRCLES';
    if (!circleLine && lineProduct) return 'PT_CIRCLE_LINE_RELATION';
    if (tangentCue && !angleCue) return 'PT_CIRCLE_TANGENT';
    if (centerCue) return 'PT_TRIANGLE_CENTERS';
    return circleLine ? 'PT_CIRCLE_LINE_RELATION' : 'PT_CIRCLE_ANGLE_RELATIONS';
}

function trigL3(question, workingSubUnit) {
    if (workingSubUnit === 'M3-05-TRIG_RATIO_APPLICATION') return 'PT_TRIG_RATIO_APPLICATION';
    const content = text(question.content).replace(/\s+/g, ' ');
    const combined = questionText(question);
    if (/높이|거리|넓이|면적|길이.*구|구하는.*길이|건물|나무|도형.*넓이|둘레/.test(combined) && !/삼각비표|삼각비의 값|sin|cos|tan/.test(content)) return 'PT_TRIG_RATIO_APPLICATION';
    return 'PT_TRIG_RATIO';
}

function l3Decision(question, sourceArchiveFile, sourceOrdinal, workingSubUnit, handoff) {
    const tuple = `${sourceArchiveFile}#${sourceOrdinal}`;
    if (M2_ROUTE_OUT.has(tuple)) {
        const route = M2_ROUTE_OUT.get(tuple);
        return { problemTypeKey: null, status: 'OUT_OF_SCOPE', action: 'ROUTE_OUT', route: route.route, reason: route.reason };
    }
    if (workingSubUnit === 'M2-05-TRIANGLE_PROPERTIES') {
        const key = triangleL3(tuple, question, handoff);
        return { problemTypeKey: key, status: ACTIVE_L3_OWNERS[key] ? 'REUSE_ACTIVE' : 'CANDIDATE', action: ACTIVE_L3_OWNERS[key] ? 'REUSE' : 'ASSIGN_NEW', reason: `M2 frozen semantic decision; fresh source cue: ${compact(question.content)}` };
    }
    if (workingSubUnit === 'M2-05-QUADRILATERAL_PROPERTIES') return { problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES', status: 'CANDIDATE', action: 'ASSIGN_NEW', reason: 'M2 frozen quadrilateral semantic reuse/correction' };
    if (workingSubUnit === 'M2-06-SIMILAR_FIGURE') {
        const similarityUid = handoff.m2.triangleSimilarityUids.some(uid => tuple === uid || tuple.endsWith('/' + uid));
        const key = similarityUid ? 'PT_TRIANGLE_SIMILARITY' : 'PT_SIMILAR_FIGURES';
        return { problemTypeKey: key, status: 'CANDIDATE', action: 'ASSIGN_NEW', reason: key === 'PT_TRIANGLE_SIMILARITY' ? 'Frozen 30-item triangle-similarity exact UID set' : 'Frozen complement of 97-item similarity scope' };
    }
    if (workingSubUnit === 'M2-06-PARALLEL_LENGTH_RATIO') return { problemTypeKey: 'PT_PARALLEL_SEGMENT_RATIO', status: 'CANDIDATE', action: 'ASSIGN_NEW', reason: 'M2 frozen parallel-segment ratio assignment' };
    if (workingSubUnit.startsWith('M3-05')) {
        const key = trigL3(question, workingSubUnit);
        return { problemTypeKey: key, status: 'CANDIDATE', action: 'ASSIGN_NEW', reason: workingSubUnit === 'M3-05-TRIG_RATIO_APPLICATION' ? 'Fresh trig-application assignment from working source L2 and decisive length/height/area structure' : 'Fresh direct trig-ratio assignment from content and solution structure' };
    }
    if (workingSubUnit.startsWith('M3-06')) {
        const key = circleL3(question, workingSubUnit);
        return { problemTypeKey: key, status: ACTIVE_L3_OWNERS[key] ? 'REUSE_ACTIVE' : 'CANDIDATE', action: ACTIVE_L3_OWNERS[key] ? 'REUSE' : 'ASSIGN_NEW', reason: `Fresh circle semantic assignment: ${key}` };
    }
    throw new Error(`L3 unresolved for ${sourceArchiveFile}#${sourceOrdinal}`);
}

function canonicalTemplateFor(question, l3) {
    const content = text(question.content).replace(/\s+/g, ' ');
    const combined = questionText(question);
    if (l3 === 'PT_COORD_CENTROID') {
        return /좌표/.test(content) ? 'TPL_CENTROID_DIRECT' : 'TPL_CENTROID_APPLICATION';
    }
    if (l3 === 'PT_CIRCLE_LINE_RELATION') {
        if (/중심.*찾|수직이등분/.test(content)) return 'TM_CIRCLE_CHORD_PERP_BISECTOR';
        if (/현.*길이|길이.*현/.test(content)) return 'TM_CIRCLE_CHORD_LENGTH';
        if (/교점|두 교점|교차/.test(content)) return 'TM_CIRCLE_INTERSECTION_RELATION';
        return 'TM_CIRCLE_LINE_POSITION';
    }
    if (l3 === 'PT_CIRCLE_TANGENT') {
        if (/접선.*길이|길이.*접선|접점.*길이/.test(content)) return 'TM_TANGENT_LENGTH';
        if (/접할 조건|접하는 조건/.test(content)) return 'TM_TANGENCY_CONDITION';
        return 'TM_TANGENT_CONTACT_CHORD_LENGTH';
    }
    if (l3 === 'PT_TWO_CIRCLES') {
        if (/공통현|교점/.test(content)) return 'TM_TWO_CIRCLES_COMMON_CHORD_LENGTH';
        if (/공통접선|동시에 접/.test(content)) return 'TM_TWO_CIRCLES_COMMON_TANGENT';
        if (/중심.*직선|중심거리/.test(combined)) return 'TM_TWO_CIRCLES_CENTER_LINE';
        return 'TM_TWO_CIRCLES_COMMON_CHORD_LENGTH';
    }
    return null;
}

function candidateTemplateKey(problemTypeKey, question) {
    const content = text(question.content).replace(/\s+/g, ' ');
    let suffix = 'DIRECT';
    if (/증명|서술형|과정을 서술|옳지 않은|모두 고른/.test(content)) suffix = 'PROOF_OR_MULTI_STATEMENT';
    else if (/넓이|면적|높이|거리|둘레|활용|구하는.*길이/.test(content)) suffix = 'APPLICATION';
    else if (/비|비례|닮음비|대응/.test(content)) suffix = 'RATIO_RELATION';
    return `TPL_MIDDLE_GEOMETRY_${problemTypeKey.replace(/^PT_/, '')}_${suffix}`;
}

function l4Decision(question, problemTypeKey) {
    if (!problemTypeKey) return { templateKey: null, status: 'OUT_OF_SCOPE', action: 'ROUTE_OUT', reason: 'L3 route-out; no current-pack L4 forced' };
    const active = canonicalTemplateFor(question, problemTypeKey);
    if (active) return { templateKey: active, status: 'REUSE_ACTIVE', action: 'REUSE', reason: 'Existing canonical L4 semantic fit; no new template created' };
    const candidate = candidateTemplateKey(problemTypeKey, question);
    return { templateKey: candidate, status: 'CANDIDATE_SUGGESTION', action: 'CANDIDATE_SUGGEST_ONLY', reason: 'Candidate L4 suggestion only; decisive skeleton still requires semantic review; numeric/wording variants compressed' };
}

function crossConcepts(question, problemTypeKey) {
    const t = questionText(question);
    const out = [];
    const add = (key, reason) => { if (!out.some(item => item.key === key)) out.push({ key, reason }); };
    if (/닮음|닮은|닮음비/.test(t) && !['PT_SIMILAR_FIGURES', 'PT_TRIANGLE_SIMILARITY'].includes(problemTypeKey)) add('CC_SIMILARITY', '닮음이 primary taxonomy 밖의 decisive 보조 구조');
    if (/삼각형.*(넓이|면적)|넓이.*삼각형|삼각형의 넓이|삼각형 넓이|넓이를 구/.test(t) && !/AREA/.test(problemTypeKey || '')) add('CC_TRIANGLE_AREA', '삼각형 넓이가 primary L3 밖의 decisive 계산 단계');
    if (/넓이|면적/.test(t) && !/삼각형/.test(t) && problemTypeKey !== 'PT_QUADRILATERAL_PROPERTIES') add('CC_AREA', '일반 도형 넓이가 primary L3 밖의 decisive 계산 단계');
    if (/각의 이등분선|이등분선/.test(t) && !['PT_TRIANGLE_ANGLE_BISECTOR', 'PT_TRIANGLE_CENTERS'].includes(problemTypeKey)) add('CC_ANGLE_BISECTOR', '각의 이등분선이 primary 밖의 decisive 보조 개념');
    if (/각의 이등분선 정리|BD:DC|BD\/DC/.test(t) && problemTypeKey !== 'PT_TRIANGLE_ANGLE_BISECTOR') add('CC_ANGLE_BISECTOR_THEOREM', '각의 이등분선 정리의 비례 적용');
    if (/수직이등분선/.test(t) && problemTypeKey !== 'PT_CIRCLE_LINE_RELATION') add('CC_PERPENDICULAR_BISECTOR', '수직이등분선이 primary 밖의 decisive 보조 개념');
    if (/피타고라스/.test(t) && problemTypeKey !== 'PT_RIGHT_TRIANGLE_CONGRUENCE') add('CC_PYTHAGOREAN', '피타고라스 정리가 primary 밖의 decisive 보조 개념');
    if (/직각삼각형/.test(t) && !['PT_RIGHT_TRIANGLE_CONGRUENCE', 'PT_TRIG_RATIO', 'PT_TRIG_RATIO_APPLICATION'].includes(problemTypeKey)) add('CC_RIGHT_TRIANGLE', '직각삼각형 구조가 primary 밖의 decisive 보조 개념');
    if (/외접원/.test(t) && problemTypeKey !== 'PT_TRIANGLE_CENTERS') add('CC_CIRCUMCIRCLE', '외접원 구조가 primary 밖의 decisive 보조 개념');
    if (/원주각/.test(t) && problemTypeKey !== 'PT_CIRCLE_ANGLE_RELATIONS') add('CC_INSCRIBED_ANGLE', '원주각이 primary 밖의 decisive 보조 개념');
    if (/지름/.test(t) && !['PT_CIRCLE_LINE_RELATION', 'PT_CIRCLE_ANGLE_RELATIONS'].includes(problemTypeKey)) add('CC_DIAMETER', '지름 성질이 primary 밖의 decisive 보조 개념');
    if (/접선|접점|접하는/.test(t) && !['PT_CIRCLE_TANGENT', 'PT_TWO_CIRCLES'].includes(problemTypeKey)) add('CC_TANGENCY', '접선 구조가 primary 밖의 decisive 보조 개념');
    if (/사인법칙/.test(t)) add('CC_SINE_LAW', '사인법칙이 primary 밖의 decisive 보조 개념');
    if (/정육각형/.test(t)) add('CC_REGULAR_HEXAGON', '정육각형 성질이 primary 밖의 decisive 보조 개념');
    if (/평행사변형/.test(t) && problemTypeKey !== 'PT_QUADRILATERAL_PROPERTIES') add('CC_PARALLELOGRAM_PROPERTIES', '평행사변형 성질이 primary 밖의 decisive 보조 개념');
    if (/정사각형/.test(t) && problemTypeKey !== 'PT_QUADRILATERAL_PROPERTIES') add('CC_SQUARE', '정사각형 성질이 primary 밖의 decisive 보조 개념');
    return out;
}

function conditions(question) {
    const content = text(question.content);
    const out = [];
    if (/자연수/.test(content)) out.push({ key: 'COND_NATURAL_NUMBER', reason: 'source wording explicitly restricts candidate value to natural number' });
    else if (/정수/.test(content)) out.push({ key: 'COND_INTEGER', reason: 'source wording explicitly restricts candidate value to integer' });
    if (/양수|0보다 크|positive/.test(content)) out.push({ key: 'COND_POSITIVE', reason: 'source wording explicitly requires positivity' });
    if (/음수|0보다 작|negative/.test(content)) out.push({ key: 'COND_NEGATIVE', reason: 'source wording explicitly requires negativity' });
    if (/범위|이상|이하|초과|미만/.test(content) && /x|값/.test(content)) out.push({ key: 'COND_RANGE', reason: 'explicit range restriction affects value selection' });
    if (/0이 아닌|0이 되지|분모/.test(content)) out.push({ key: 'COND_NONZERO', reason: 'explicit nonzero/nondegenerate restriction affects solution selection' });
    return [...new Map(out.map(item => [item.key, item])).values()];
}

function integration(question, cross) {
    const t = questionText(question);
    if (/먼저.*구한 뒤|구한 뒤.*적용|차례로|순서대로|이후|다음으로/.test(t) && cross.length > 0) return { key: 'SEQUENTIAL', reason: 'source solution explicitly chains a prior result into a later decisive step' };
    if (/동시에|서로.*이용|연쇄|결합/.test(t) && cross.length > 0) return { key: 'INTERDEPENDENT', reason: 'source solution explicitly describes interdependent structures' };
    return { key: 'NONE', reason: 'no explicit multi-structure integration cue beyond primary taxonomy' };
}

function countSteps(solution) {
    const numbered = (solution.match(/(?:^|\n|\s)(?:\d+단계|\(?[1-9]\)|[①②③④⑤⑥])/g) || []).length;
    if (numbered > 0) return numbered;
    return Math.max(1, solution.split(/\n+/).filter(line => line.trim()).length);
}

function difficulty(question, problemTypeKey, l4Key, cross, condition, integration) {
    if (!problemTypeKey) return { bucket: 'UNKNOWN', confidence: 'UNKNOWN', boundary: 'UNKNOWN', compatibility: 'UNKNOWN', status: 'HOLD', reason: 'route-out item; difficulty is not forced in current pack' };
    const content = text(question.content);
    const solution = text(question.solution);
    if (!solution || /판독불가|정답불가/.test(`${content} ${solution}`)) return { bucket: 'UNKNOWN', confidence: 'low', boundary: 'UNKNOWN', compatibility: 'UNKNOWN', status: 'manual_review', reason: 'solution evidence unavailable or source defect suspected' };
    const steps = countSteps(solution);
    const insight = /결정적|핵심 발상|관찰|재구성|아이디어/.test(solution);
    const structured = /증명|서술형|옳지 않은|모두 고른|과정을 서술|차례로|경우/.test(content + solution);
    const application = /넓이|면적|높이|거리|둘레|활용|여러|두 삼각형|두 원|사각형/.test(content);
    let bucket = 3;
    if (insight && steps >= 4) bucket = 5;
    else if (structured && (steps >= 6 || cross.length >= 2 || condition.length >= 1)) bucket = 4;
    else if (!application && cross.length === 0 && condition.length === 0 && steps <= 2 && /값|구하면|구하시오/.test(content)) bucket = 1;
    else if (steps <= 3 && cross.length <= 1 && condition.length === 0) bucket = 2;
    else if (steps >= 5 || cross.length >= 2 || integration.key !== 'NONE') bucket = 4;
    const confidence = solution.length > 100 && !/그림/.test(content) ? 'high' : 'medium';
    const expected = bucket <= 1 ? '하' : bucket <= 3 ? '중' : '상';
    const legacy = text(question.level);
    const compatibility = legacy === expected ? 'NORMAL' : Math.abs((legacy === '하' ? 1 : legacy === '중' ? 2.5 : 4.5) - bucket) <= 1 ? 'BORDERLINE_REVIEW' : 'STRONG_CONFLICT';
    const boundary = compatibility === 'NORMAL'
        ? 'NONE'
        : compatibility === 'BORDERLINE_REVIEW'
            ? (bucket <= 2 ? 'B12' : bucket <= 4 ? 'B34' : 'B45')
            : 'UNKNOWN';
    return { bucket, confidence, boundary, compatibility, status: 'PENDING_INDEPENDENT_REVIEW', heuristicCandidate: true, reason: `heuristic candidate only; blind structure: steps=${steps}; application=${application}; cross=${cross.length}; conditions=${condition.length}; integration=${integration.key}; insight=${insight}` };
}

function loadCanonical() {
    const activeL3 = new Map(Object.entries(ACTIVE_L3_OWNERS));
    const activeL4 = new Set();
    for (const dir of fs.readdirSync(path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'packs'), { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const file = path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'packs', dir.name, 'taxonomy.json');
        if (!fs.existsSync(file)) continue;
        const taxonomy = JSON.parse(fs.readFileSync(file, 'utf8'));
        for (const item of taxonomy.problemTypes || []) activeL3.set(item.problemTypeKey, item.ownerPack || dir.name.toUpperCase());
        for (const item of taxonomy.templates || []) activeL4.add(item.templateKey);
    }
    const concepts = new Set();
    const conceptDir = path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'concepts');
    for (const file of fs.readdirSync(conceptDir).filter(name => name.endsWith('.json'))) {
        const shard = JSON.parse(fs.readFileSync(path.join(conceptDir, file), 'utf8'));
        for (const item of shard.concepts || []) concepts.add(item.conceptKey);
    }
    const conditionsRegistry = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'meta-foundation', 'canonical', 'condition_registry.json'), 'utf8'));
    return { activeL3, activeL4, concepts, conditions: new Set((conditionsRegistry.conditions || []).map(item => item.conditionKey)) };
}

function collect() {
    const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
    const byTuple = new Map((identity.records || []).map(record => [`${normalizeFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`, record]));
    const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
    const source = [];
    for (const grade of ['m2', 'm3']) {
        const root = path.join(sourceRoot, grade);
        for (const fullPath of walk(root)) {
            const normalized = fullPath.replace(/\\/g, '/');
            const sourceArchiveFile = normalized.slice(normalized.indexOf('original/middle/'));
            const questions = runSource(fullPath);
            questions.forEach(question => {
                const current = text(question.subUnitKey);
                const tuple = `${sourceArchiveFile}#${question.id}`;
                const target = grade === 'm2' ? M2_TARGETS.has(current) || tuple === M2_REVERSE_SIMILARITY : M3_TARGETS.has(current);
                if (!target) return;
                const identityRecord = byTuple.get(tuple);
                if (!identityRecord) throw new Error(`identity missing for ${tuple}`);
                const sourceStandardUnitKey = text(question.standardUnitKey) || (grade === 'm2' ? 'M2-05' : current.startsWith('M3-05') ? 'M3-05' : 'M3-06');
                const workingSubUnitKey = getWorkingSubUnit(sourceArchiveFile, question.id, current);
                source.push({
                    grade: grade.toUpperCase(),
                    sourceArchiveFile,
                    sourceOrdinal: Number(question.id),
                    sourceQuestionNo: text(question.id),
                    questionUid: identityRecord.questionUid,
                    sourceFingerprint: sourceFingerprint(question),
                    curriculum: '2015',
                    standardCourse: grade === 'm2' ? '중2 수학' : '중3 수학',
                    standardUnitKey: sourceStandardUnitKey,
                    standardUnit: text(question.standardUnit) || (grade === 'm2' ? '도형의 성질' : current.startsWith('M3-05') ? '삼각비' : '원의 성질'),
                    sourceStandardUnitKey,
                    sourceSubUnitKey: current,
                    workingStandardUnitKey: getWorkingStandardUnitKey(workingSubUnitKey, sourceStandardUnitKey),
                    workingSubUnitKey,
                    legacyLevel: text(question.level),
                    visualRisk: Boolean(question.image) || /<svg|<Figure|그림/.test(text(question.content)),
                    contentSnippet: compact(question.content),
                    solutionSnippet: compact(question.solution),
                    _question: question,
                    _handoff: handoff
                });
            });
        }
    }
    return source.sort((a, b) => a.questionUid.localeCompare(b.questionUid));
}

function subsetSummary(records) {
    const count = (items, keyFn) => Object.fromEntries(Object.entries(items.reduce((out, item) => {
        const key = keyFn(item);
        out[key] = (out[key] || 0) + 1;
        return out;
    }, {})).sort(([a], [b]) => a.localeCompare(b)));
    return {
        l3Usage: count(records, record => record.problemTypeKey || 'OUT_OF_SCOPE'),
        workingSubUnitUsage: count(records, record => record.workingSubUnitKey),
        reviewStatus: count(records, record => record.reviewStatus),
        routeOutCount: records.filter(record => record.l3Status === 'OUT_OF_SCOPE').length,
        canonicalReuseL3Count: records.filter(record => record.l3Status === 'REUSE_ACTIVE').length,
        crossConceptUsage: count(records.flatMap(record => record.crossConceptKeys).map(key => ({ key })), item => item.key),
        conditionUsage: count(records.flatMap(record => record.conditionKeys).map(key => ({ key })), item => item.key)
    };
}

function buildReviewTargets(records, candidateL4Usage) {
    const triggers = new Map();
    const add = (record, reason) => {
        const reasons = triggers.get(record.questionUid) || new Set();
        reasons.add(reason);
        triggers.set(record.questionUid, reasons);
    };
    const groups = new Map();
    for (const record of records) {
        if (!record.problemTypeKey || record.difficultyBucket === 'UNKNOWN') continue;
        const key = `${record.problemTypeKey}|${record.templateKey || '(none)'}`;
        const group = groups.get(key) || [];
        group.push(record);
        groups.set(key, group);
    }
    for (const record of records) {
        if (record.l3Status === 'OUT_OF_SCOPE') add(record, 'route_out_or_source_hold');
        if (record.difficultyBoundaryFlag !== 'NONE') add(record, 'difficulty_boundary_or_unresolved');
        if (record.difficultyConfidence === 'low') add(record, 'low_confidence');
        if (record.legacyLevelCompatibility === 'STRONG_CONFLICT') add(record, 'strong_legacy_conflict');
        if (record.legacyLevelCompatibility === 'BORDERLINE_REVIEW' || record.legacyLevelCompatibility === 'BORDERLINE_ACCEPTABLE') add(record, 'legacy_borderline_mismatch');
        if (record.visualRisk) add(record, 'visual_or_direct_source_high_risk');
        if (record.evidence.sourceDefectOrRoute) add(record, 'source_or_solution_defect');
        if (record.templateKey && record.l4Status === 'CANDIDATE_SUGGESTION' && candidateL4Usage[record.templateKey] <= 1) add(record, 'semantic_outlier_or_singleton_l4_suggestion');
    }
    for (const group of groups.values()) {
        const numeric = group.filter(record => Number.isInteger(record.difficultyBucket));
        if (numeric.length < 2) continue;
        const buckets = numeric.map(record => record.difficultyBucket);
        const min = Math.min(...buckets);
        const max = Math.max(...buckets);
        if (max - min < 2) continue;
        for (const record of numeric.filter(item => item.difficultyBucket === min || item.difficultyBucket === max)) add(record, 'same_type_difficulty_span_endpoint');
    }
    return [...triggers.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([questionUid, reasons]) => ({ questionUid, triggerReasons: [...reasons].sort() }));
}

function build() {
    const canonical = loadCanonical();
    const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
    const source = collect();
    if (source.length !== 928) throw new Error(`expected 928 records, got ${source.length}`);
    const records = source.map(item => {
        const question = item._question;
        const l3 = l3Decision(question, item.sourceArchiveFile, item.sourceOrdinal, item.workingSubUnitKey, handoff);
        const l4 = l4Decision(question, l3.problemTypeKey);
        const cross = l3.problemTypeKey ? crossConcepts(question, l3.problemTypeKey) : [];
        const condition = l3.problemTypeKey ? conditions(question) : [];
        const join = l3.problemTypeKey ? integration(question, cross) : { key: 'NONE', reason: 'route-out' };
        const diff = difficulty(question, l3.problemTypeKey, l4.templateKey, cross, condition, join);
        const activeL3Owner = l3.problemTypeKey ? canonical.activeL3.get(l3.problemTypeKey) : null;
        const activeL4 = l4.templateKey ? canonical.activeL4.has(l4.templateKey) : false;
        const mapped = Boolean(l3.problemTypeKey);
        const record = {
            questionUid: item.questionUid,
            grade: item.grade,
            sourceArchiveFile: item.sourceArchiveFile,
            sourceOrdinal: item.sourceOrdinal,
            sourceQuestionNo: item.sourceQuestionNo,
            sourceFingerprint: item.sourceFingerprint,
            visualRisk: item.visualRisk,
            curriculum: item.curriculum,
            standardCourse: item.standardCourse,
            standardUnitKey: item.standardUnitKey,
            standardUnit: item.standardUnit,
            sourceStandardUnitKey: item.sourceStandardUnitKey,
            sourceSubUnitKey: item.sourceSubUnitKey,
            workingStandardUnitKey: item.workingStandardUnitKey,
            workingSubUnitKey: item.workingSubUnitKey,
            legacyLevel: item.legacyLevel,
            problemTypeKey: l3.problemTypeKey,
            l3Status: l3.status,
            l3Action: l3.action,
            l3OwnerPack: activeL3Owner || 'MIDDLE_GEOMETRY',
            templateKey: l4.templateKey,
            l4Status: activeL4 ? 'REUSE_ACTIVE' : l4.status,
            l4Action: l4.action,
            l4ReviewStatus: mapped ? 'PENDING_SEMANTIC_REVIEW' : 'NOT_APPLICABLE',
            crossConceptKeys: cross.map(item => item.key),
            conditionKeys: condition.map(item => item.key),
            integrationPattern: join.key,
            relationalMetadataStatus: mapped ? 'PENDING_SEMANTIC_REVIEW' : 'NOT_APPLICABLE',
            difficultyBucket: diff.bucket,
            difficultyConfidence: diff.confidence,
            difficultyBoundaryFlag: diff.boundary,
            legacyLevelCompatibility: diff.compatibility,
            reviewStatus: diff.status,
            heuristicCandidate: diff.heuristicCandidate === true,
            eligibilityStatus: mapped ? 'PENDING_INDEPENDENT_REVIEW' : 'OUT_OF_SCOPE_HOLD',
            curriculumApplicability: l3.status === 'OUT_OF_SCOPE' ? 'SUPPLEMENTARY_OUTSIDE_CORE' : 'CORE',
            defaultSelectable: false,
            evidence: {
                sourceFreshness: 'current source JS content + choices + answer + solution read; legacy metadata is comparison only',
                contentCue: item.contentSnippet,
                solutionCue: item.solutionSnippet,
                l3Decision: l3.reason,
                l3CanonicalReuse: activeL3Owner ? `ACTIVE owner ${activeL3Owner}` : 'candidate-only; no production canonical promotion',
                l4Decision: l4.reason,
                l4Status: mapped ? 'candidate suggestion only; decisive skeleton not independently reviewed' : 'not applicable',
                relationalDecision: [...cross.map(item => item.reason), ...condition.map(item => item.reason), join.reason],
                difficultyBlindReason: diff.reason,
                difficultyStatus: mapped ? 'heuristic candidate evidence; independent review required' : 'route-out hold',
                legacyCompareAfterBlind: true,
                sourceDefectOrRoute: M2_ROUTE_OUT.get(`${item.sourceArchiveFile}#${item.sourceOrdinal}`) || null
            }
        };
        return record;
    });
    const byUid = new Set(records.map(record => record.questionUid));
    const bySource = new Set(records.map(sourceTuple));
    const candidateL3Usage = {};
    const candidateL4Usage = {};
    for (const record of records) {
        if (record.l3Status === 'CANDIDATE') candidateL3Usage[record.problemTypeKey] = (candidateL3Usage[record.problemTypeKey] || 0) + 1;
        if (record.l4Status === 'CANDIDATE_SUGGESTION') candidateL4Usage[record.templateKey] = (candidateL4Usage[record.templateKey] || 0) + 1;
    }
    const reviewTargets = buildReviewTargets(records, candidateL4Usage);
    const newL3 = Object.entries(NEW_L3).filter(([key]) => candidateL3Usage[key]).map(([key, [label, definition]]) => ({
        problemTypeKey: key,
        canonicalLabelKo: label,
        definition,
        aliases: [],
        status: 'CANDIDATE',
        ownerPack: 'MIDDLE_GEOMETRY',
        supportingItemCount: candidateL3Usage[key],
        supportingQuestionUids: records.filter(record => record.problemTypeKey === key).slice(0, 10).map(record => record.questionUid),
        action: 'ADD',
        promotionStatus: 'REVIEW_REQUIRED'
    }));
    const candidateTemplates = Object.entries(candidateL4Usage).map(([templateKey, supportingItemCount]) => ({
        templateKey,
        canonicalLabelKo: 'Middle Geometry candidate template',
        definition: 'Same L3 semantic with a repeatable decisive condition/solution skeleton; candidate-only until independent review.',
        aliases: [],
        internalSkeleton: 'candidate item-level skeleton retained in evidence; numeric and wording variants are compressed',
        parentProblemTypeKey: templateKey.replace(/^TPL_MIDDLE_GEOMETRY_/, 'PT_').replace(/_(DIRECT|APPLICATION|PROOF_OR_MULTI_STATEMENT|RATIO_RELATION)$/, ''),
        status: 'CANDIDATE',
        ownerPack: 'MIDDLE_GEOMETRY',
        supportingItemCount,
        action: 'ADD',
        promotionStatus: 'REVIEW_REQUIRED'
    }));
    const bindings = [...new Set(records.filter(record => record.problemTypeKey).map(record => [record.curriculum, record.standardCourse, record.workingStandardUnitKey, record.workingSubUnitKey, record.problemTypeKey].join('|')))]
        .map(key => { const [curriculum, standardCourse, standardUnitKey, subUnitKey, problemTypeKey] = key.split('|'); return { curriculum, standardCourse, standardUnitKey, subUnitKey, problemTypeKey, status: 'CANDIDATE', ownerPack: 'MIDDLE_GEOMETRY' }; });
    const ledger = {
        schemaVersion: 'middle-geometry-item-level-assignment-v1',
        status: 'CANDIDATE_REVIEW_PENDING_FAIL_CLOSED',
        packId: 'MIDDLE_GEOMETRY',
        baseMainSha,
        branch: 'codex/meta-foundation/middle-geometry',
        denominator: { total: 928, m2: 402, m3: 526, uidMissing: 0, uidDuplicate: 928 - byUid.size, sourceDuplicate: 928 - bySource.size },
        stage: { m2: 'M2_ITEM_LEDGER_MATERIALIZED_FROM_FROZEN_SEMANTICS', m3: 'STAGE_2_L3_FRESH_ASSIGNMENT' },
        reviewManifestStatus: 'REVIEW_PENDING',
        reviewTargetCount: reviewTargets.length,
        reviewTargets,
        records,
        summary: {
            l3Usage: Object.fromEntries(Object.entries(records.reduce((out, record) => { const key = record.problemTypeKey || 'OUT_OF_SCOPE'; out[key] = (out[key] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))),
            workingSubUnitUsage: Object.fromEntries(Object.entries(records.reduce((out, record) => { out[record.workingSubUnitKey] = (out[record.workingSubUnitKey] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))),
            reviewStatus: Object.fromEntries(Object.entries(records.reduce((out, record) => { out[record.reviewStatus] = (out[record.reviewStatus] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))),
            newL3CandidateUsage: candidateL3Usage,
            candidateL4Usage,
            routeOutCount: records.filter(record => record.l3Status === 'OUT_OF_SCOPE').length,
            canonicalReuseL3Count: records.filter(record => record.l3Status === 'REUSE_ACTIVE').length,
            crossConceptUsage: Object.fromEntries(Object.entries(records.flatMap(record => record.crossConceptKeys).reduce((out, key) => { out[key] = (out[key] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b))),
            conditionUsage: Object.fromEntries(Object.entries(records.flatMap(record => record.conditionKeys).reduce((out, key) => { out[key] = (out[key] || 0) + 1; return out; }, {})).sort(([a], [b]) => a.localeCompare(b)))
        }
    };
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(evidenceDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'pack.json'), JSON.stringify({ schemaVersion: 'meta-foundation-candidate-pack-v1', packId: 'MIDDLE_GEOMETRY', packVersion: '0.1.0-candidate', canonicalStatus: 'CANDIDATE', active: false, ownerPack: 'MIDDLE_GEOMETRY', ownedStandardUnitDomains: ['M2-05', 'M2-06', 'M3-05', 'M3-06'], ownedProblemTypeKeyPrefixes: Object.keys(NEW_L3), promotionStatus: 'REVIEW_REQUIRED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(outputDir, 'taxonomy.json'), JSON.stringify({ schemaVersion: 'middle-geometry-candidate-taxonomy-v1', status: 'CANDIDATE', problemTypes: newL3, templates: candidateTemplates, externalActiveL3Refs: [...new Set(records.filter(record => record.l3Status === 'REUSE_ACTIVE').map(record => record.problemTypeKey))], promotionStatus: 'REVIEW_REQUIRED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(outputDir, 'bindings.json'), JSON.stringify({ schemaVersion: 'middle-geometry-candidate-bindings-v1', status: 'CANDIDATE', bindings, applicabilityRules: [], promotionStatus: 'REVIEW_REQUIRED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(outputDir, 'aliases.json'), JSON.stringify({ schemaVersion: 'middle-geometry-candidate-aliases-v1', status: 'CANDIDATE', aliases: [], promotionStatus: 'REVIEW_REQUIRED' }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'item_level_assignment_928.json'), JSON.stringify(ledger, null, 2) + '\n');
    const m2Records = records.filter(record => record.grade === 'M2');
    const m3Records = records.filter(record => record.grade === 'M3');
    fs.writeFileSync(path.join(evidenceDir, 'm2_item_level_l3_ledger_402.json'), JSON.stringify({ ...ledger, records: m2Records, denominator: { total: 402, mappedL3: m2Records.filter(record => record.problemTypeKey).length, routeOut: m2Records.filter(record => record.l3Status === 'OUT_OF_SCOPE').length }, summary: subsetSummary(m2Records) }, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'm3_stage2_l3_fresh_assignment_526.json'), JSON.stringify({ ...ledger, records: m3Records, denominator: { total: 526, assigned: m3Records.filter(record => record.problemTypeKey).length, hold: m3Records.filter(record => !record.problemTypeKey).length }, summary: subsetSummary(m3Records) }, null, 2) + '\n');
    const audit = {
        schemaVersion: 'middle-geometry-candidate-integrity-audit-v1',
        status: 'CANDIDATE_VALIDATION_ONLY_REVIEW_PENDING_FAIL_CLOSED',
        baseMainSha,
        branch: 'codex/meta-foundation/middle-geometry',
        denominator: ledger.denominator,
        checks: {
            denominatorExact: source.length === 928,
            m2Exact: records.filter(record => record.grade === 'M2').length === 402,
            m3Exact: records.filter(record => record.grade === 'M3').length === 526,
            uniqueUid: byUid.size === 928,
            uniqueSourceIdentity: bySource.size === 928,
            m2RouteOutExact: records.filter(record => record.grade === 'M2' && record.l3Status === 'OUT_OF_SCOPE').length === 5,
            forbiddenTriangleAreaRatioAbsent: records.every(record => record.problemTypeKey !== 'PT_TRIANGLE_AREA_RATIO' && !record.templateKey?.includes('TRIANGLE_AREA_RATIO')),
            candidateL3KeyCollision: newL3.some(item => canonical.activeL3.has(item.problemTypeKey)),
            candidateL4KeyCollision: candidateTemplates.some(item => canonical.activeL4.has(item.templateKey)),
            unregisteredCrossConcept: [...new Set(records.flatMap(record => record.crossConceptKeys))].filter(key => !canonical.concepts.has(key)),
            unregisteredCondition: [...new Set(records.flatMap(record => record.conditionKeys))].filter(key => !canonical.conditions.has(key)),
            sourceFingerprintPresence: records.every(record => Boolean(record.sourceFingerprint)),
            sourceProductionMutation: false,
            canonicalProductionMutation: false,
            compiledProductionMutation: false,
            runtimeProductionMutation: false,
            difficultyBlindOrderRecorded: records.every(record => record.problemTypeKey ? record.evidence.legacyCompareAfterBlind === true : true),
            heuristicDifficultyFailClosed: records.filter(record => record.problemTypeKey).every(record => record.reviewStatus === 'PENDING_INDEPENDENT_REVIEW' && record.defaultSelectable === false),
            relationalMetadataFailClosed: records.filter(record => record.problemTypeKey).every(record => record.relationalMetadataStatus === 'PENDING_SEMANTIC_REVIEW'),
            l4SuggestionFailClosed: records.filter(record => record.problemTypeKey && record.l4Status === 'CANDIDATE_SUGGESTION').every(record => record.l4ReviewStatus === 'PENDING_SEMANTIC_REVIEW'),
            independentGptReview: 'PENDING_EXTERNAL_REVIEW'
        },
        l3Usage: ledger.summary.l3Usage,
        workingSubUnitUsage: ledger.summary.workingSubUnitUsage,
        candidateL3: newL3.map(item => ({ key: item.problemTypeKey, usage: item.supportingItemCount })),
        candidateL4Count: candidateTemplates.length,
        reviewTargetCount: reviewTargets.length,
        engineCapability: { status: 'ENGINE_CAPABILITY_BLOCK', reason: 'Current compile-meta-foundation.mjs is GEOMETRY_EQUATIONS/400 hard-coded; no middle-geometry canonical promotion or runtime compile was attempted.' },
        nextGate: 'GPT independent branch review, then pack-generic compiler/runtime/Archive2 integration or explicit approved block'
    };
    audit.integrityDigest = sha256(JSON.stringify({ ledgerHash: sha256(JSON.stringify(records)), audit: { ...audit, integrityDigest: undefined } }));
    fs.writeFileSync(path.join(evidenceDir, 'global_integrity_audit.json'), JSON.stringify(audit, null, 2) + '\n');
    fs.writeFileSync(path.join(evidenceDir, 'review_manifest.json'), JSON.stringify({ schemaVersion: 'middle-geometry-review-manifest-v1', status: 'PENDING_GPT_INDEPENDENT_REVIEW', targetCount: reviewTargets.length, targets: reviewTargets, requiredChecks: ['full main...branch diff', 'M2 402 semantic parity', 'M3 526 source identity coverage', 'L3/L4/CrossConcept/Condition/IntegrationPattern/difficulty consistency', 'candidate ownership and collision gates', 'engine capability and runtime/Archive2 closure'], generatedArtifacts: ['item_level_assignment_928.json', 'm2_item_level_l3_ledger_402.json', 'm3_stage2_l3_fresh_assignment_526.json', 'global_integrity_audit.json'] }, null, 2) + '\n');
    console.log(JSON.stringify({ outputDir, evidenceDir, records: records.length, m2: records.filter(record => record.grade === 'M2').length, m3: records.filter(record => record.grade === 'M3').length, l3Usage: ledger.summary.l3Usage, routeOut: ledger.summary.routeOutCount, candidateL3: newL3.length, candidateL4: candidateTemplates.length, auditStatus: audit.status, engine: audit.engineCapability.status }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) build();
