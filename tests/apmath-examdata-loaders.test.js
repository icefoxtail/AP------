/**
 * apmath 원본 시험지 로더: window.examData 형식·"Q01"·id 없음 문항 지원 회귀 테스트
 *  - core.js(loadArchiveQuestionBank / 번호 헬퍼 / findQuestionInBank)
 *  - wrong_print_engine.html(extractQuestionBank / getQuestionNoValue / findQuestionInBank)
 *  - report-center.js, qr-omr.js (문항 배열 추출)
 * 결함 조건만 검사한다(개수 고정 없음).
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const coreSrc = read('apmath/js/core.js');
const reportSrc = read('apmath/js/report-center.js');
const omrSrc = read('apmath/js/qr-omr.js');
const wrongEngine = read('apmath/wrong_print_engine.html');

// 소스에서 최상위 function 선언 하나를 중괄호 짝으로 잘라낸다.
function sliceFunction(src, name) {
    const m = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`).exec(src);
    assert(m, `function ${name} not found`);
    let i = src.indexOf('{', src.indexOf(')', m.index));
    let depth = 0;
    for (let j = i; j < src.length; j++) {
        const c = src[j];
        if (c === '{') depth++;
        else if (c === '}' && --depth === 0) return src.slice(m.index, j + 1);
    }
    throw new Error(`unterminated function ${name}`);
}

// ---- core.js ----
const archiveFiles = {};
const coreEnv = new Function('archiveFiles', 'state', `
    function normalizeArchivePath(file) { const raw = String(file || '').trim(); if (!raw) return ''; return raw.startsWith('exams/') ? raw : 'exams/' + raw; }
    async function fetchArchiveScriptText(p) { if (!(p in archiveFiles)) throw new Error('missing ' + p); return archiveFiles[p]; }
    ${sliceFunction(coreSrc, 'getArchiveQuestionNumber')}
    ${sliceFunction(coreSrc, 'pickArchiveQuestionList')}
    ${sliceFunction(coreSrc, 'loadArchiveQuestionBank')}
    ${sliceFunction(coreSrc, 'findQuestionInBank')}
    return { getArchiveQuestionNumber, pickArchiveQuestionList, loadArchiveQuestionBank, findQuestionInBank };
`)(archiveFiles, { ui: {} });

const nums = list => list.map((q, i) => coreEnv.getArchiveQuestionNumber(q, i));

// ---- 번호 헬퍼 ----
assert.deepStrictEqual(nums([{ id: 1 }, { id: 2 }, { id: 3 }]), [1, 2, 3], '숫자 id는 그대로');
assert.deepStrictEqual(nums([{ id: '7' }, { id: 'q02' }]), [7, 2], '문자열 id에서 숫자 추출');
assert.deepStrictEqual(nums([{ id: 'Q01', number: 1 }, { id: 'Q02', number: 2 }]), [1, 2], 'Q01 + number');
assert.deepStrictEqual(nums([{ id: 'Q01' }, { id: 'Q02' }]), [1, 2], 'Q01만 있어도 숫자 추출');
assert.deepStrictEqual(nums([{ question: 'a' }, { question: 'b' }, { number: 9 }]), [1, 2, 9], 'id 없음은 number, 없으면 순번+1');
assert.deepStrictEqual(nums([{ id: 5, number: 5 }]), [5], 'id와 number 일치');
assert.strictEqual(coreEnv.getArchiveQuestionNumber(null, 3), 4, 'null 문항은 순번+1');

// ---- 문항 배열 찾기 ----
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({ questionBank: [{ id: 1 }] }), [{ id: 1 }]);
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({ examData: { questions: [{ id: 2 }] } }), [{ id: 2 }]);
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({ examData: { problems: [{ id: 3 }] } }), [{ id: 3 }]);
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({ examData: [{ id: 4 }] }), [{ id: 4 }]);
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({ questionBank: [{ id: 1 }], examData: { questions: [{ id: 2 }] } }), [{ id: 1 }], 'questionBank 우선');
assert.deepStrictEqual(coreEnv.pickArchiveQuestionList({}), []);

// ---- loadArchiveQuestionBank: examData / questionBank / 앞 파일 비섞임 ----
(async () => {
    archiveFiles['exams/a.js'] = 'window.examData = { title: "시험 A", questions: [ { id: "Q01", number: 1, question: "x" }, { id: "Q02", number: 2, question: "y" } ] };';
    archiveFiles['exams/b.js'] = 'window.questionBank = [ { id: 1, content: "c1" }, { id: 2, content: "c2" } ]; window.examTitle = "시험 B";';
    archiveFiles['exams/c.js'] = 'window.examTitle = "빈 시험";';
    const a = await coreEnv.loadArchiveQuestionBank('a.js');
    const b = await coreEnv.loadArchiveQuestionBank('b.js');
    const c = await coreEnv.loadArchiveQuestionBank('c.js');
    assert.strictEqual(a.questionBank.length, 2, 'examData.questions 로드');
    assert.strictEqual(a.examTitle, '시험 A', 'examData.title을 제목으로');
    assert.deepStrictEqual(nums(a.questionBank), [1, 2]);
    assert.strictEqual(b.questionBank.length, 2, 'questionBank 로드(기존 형식)');
    assert.strictEqual(b.examTitle, '시험 B');
    assert.deepStrictEqual(c.questionBank, [], '앞 파일 examData/questionBank가 섞이지 않음');

    // findQuestionInBank: Q01 / id 없음 / 기존 숫자 id
    const qQ = [{ id: 'Q01', number: 1, question: 'q1' }, { id: 'Q02', number: 2, question: 'q2' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qQ, 2).question, 'q2');
    const qNone = [{ question: 'n1' }, { question: 'n2' }, { question: 'n3' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qNone, 3).question, 'n3');
    const qNum = [{ id: 1, content: 'o' }, { id: 2, content: 'p' }, { id: 1, content: 'dup' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 1).content, 'o', '숫자 id는 기존처럼 첫 일치');
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 3).content, 'dup', '일치 없으면 순번 폴백(기존 동작)');
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 9), null);

    // ---- 실제 원본: m1/1final 19_*(Q01 + number), m3/2mid 19_신흥중(id 없음 + number) ----
    const realFiles = [];
    const finalDir = path.join(root, 'archive/exams/original/middle/m1/1final');
    for (const f of fs.readdirSync(finalDir)) if (f.startsWith('19_') && f.endsWith('.js')) realFiles.push(path.join(finalDir, f));
    realFiles.push(path.join(root, 'archive/exams/original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js'));
    let examDataSeen = 0;
    for (const f of realFiles) {
        const text = fs.readFileSync(f, 'utf8');
        if (!/window\.examData\s*=/.test(text)) continue;
        examDataSeen++;
        const key = `real${examDataSeen}.js`; // 로더 캐시가 경로 단위라 파일마다 다른 키를 쓴다.
        archiveFiles['exams/' + key] = text;
        const bank = await coreEnv.loadArchiveQuestionBank(key);
        assert(bank.questionBank.length > 0, `${path.basename(f)}: examData 문항을 읽어야 함`);
        const n = nums(bank.questionBank);
        assert(n.every(Number.isInteger), `${path.basename(f)}: 번호가 모두 정수`);
        assert.deepStrictEqual(n.slice(0, 3), [1, 2, 3], `${path.basename(f)}: 번호가 1부터`);
        // 마지막 문항도 번호로 찾아져야 한다.
        assert(coreEnv.findQuestionInBank(bank.questionBank, n[n.length - 1]), `${path.basename(f)}: 마지막 문항 조회`);
    }
    assert(examDataSeen >= 2, '실제 examData 원본을 최소 2개 확인해야 함');
    console.log('core.js loader tests passed');
})().catch(e => { console.error(e); process.exit(1); });

// ---- wrong_print_engine.html ----
{
    const blocks = [...wrongEngine.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    let script = blocks[blocks.length - 1];
    script = script.slice(0, script.indexOf('const wrongSourceAdapter ='));
    script += `return createWrongSourceAdapter({ buildState: { payload: null, banks: {}, mode: 'exam' } });`;
    global.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };
    global.document = { baseURI: 'https://icefoxtail.github.io/AP------/apmath/wrong_print_engine.html', createElement: () => ({ style: {}, set innerHTML(v) {}, childNodes: [] }) };
    const E = new Function(script)();

    const parse = text => E.normalizeQuestionBank(E.extractQuestionBank(text));
    const examDataQ = parse('window.examData = { "questions": [ { "id": "Q01", "number": 1 }, { "id": "Q02", "number": 2 } ] };');
    assert.strictEqual(examDataQ.length, 2, 'examData.questions');
    assert.deepStrictEqual(examDataQ.map((q, i) => E.getQuestionNoValue(q, i)), [1, 2], 'Q01 번호');
    assert.strictEqual(E.findQuestionInBank(examDataQ, 2), examDataQ[1], 'Q02를 2번으로 찾음');
    const noId = parse('window.examData = { questions: [ { number: 1, question: "a" }, { number: 2, question: "b" } ] };');
    assert.deepStrictEqual(noId.map((q, i) => E.getQuestionNoValue(q, i)), [1, 2], 'id 없음');
    assert.strictEqual(E.findQuestionInBank(noId, 2), noId[1]);
    const noIdNoNum = parse('window.examData = { questions: [ { question: "a" }, { question: "b" } ] };');
    assert.deepStrictEqual(noIdNoNum.map((q, i) => E.getQuestionNoValue(q, i)), [1, 2], 'id·number 모두 없으면 순번');
    assert.strictEqual(E.findQuestionInBank(noIdNoNum, 2), noIdNoNum[1]);
    assert.strictEqual(parse('window.examData = { problems: [ { id: 1 } ] };').length, 1, 'examData.problems');
    assert.strictEqual(parse('window.examData = [ { id: 1 }, { id: 2 } ];').length, 2, 'examData 배열');
    const qb = parse('window.questionBank = [ { id: 1 }, { id: 2 }, { id: 3 } ];');
    assert.deepStrictEqual(qb.map((q, i) => E.getQuestionNoValue(q, i)), [1, 2, 3], '기존 questionBank');
    assert.strictEqual(parse('window.questionBank = [ { id: 1 } ]; window.examData = { questions: [ {id:1},{id:2} ] };').length, 1, 'questionBank 우선');

    // 실제 원본
    for (const rel of [
        'archive/exams/original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js',
        'archive/exams/original/middle/m3/2mid/22_연향중_2학기_중간_중3_수학.js'
    ]) {
        const list = parse(read(rel));
        assert(list.length > 0, rel + ' 로드');
        const n = list.map((q, i) => E.getQuestionNoValue(q, i));
        assert.deepStrictEqual(n.slice(0, 3), [1, 2, 3], rel + ' 번호');
        assert.strictEqual(E.findQuestionInBank(list, n[n.length - 1]) != null, true, rel + ' 마지막 문항 조회');
    }
    const finalDir = path.join(root, 'archive/exams/original/middle/m1/1final');
    const q01File = fs.readdirSync(finalDir).find(f => f.startsWith('19_') && /window\.examData\s*=/.test(fs.readFileSync(path.join(finalDir, f), 'utf8')));
    assert(q01File, 'm1/1final 19_* examData 파일');
    const l1 = parse(fs.readFileSync(path.join(finalDir, q01File), 'utf8'));
    const n1 = l1.map((q, i) => E.getQuestionNoValue(q, i));
    assert(l1.length > 0 && n1.every(Number.isInteger) && n1[0] === 1, 'm1/1final 19_* 번호');
    console.log('wrong_print_engine loader tests passed');
}

// ---- report-center.js / qr-omr.js: 추출 + 정규화 ----
{
    const rc = new Function(`
        ${sliceFunction(reportSrc, 'reportCenterExtractQuestionBankFromText')}
        ${sliceFunction(reportSrc, 'reportCenterNormalizeQuestionBank')}
        ${sliceFunction(reportSrc, 'reportCenterGetQuestionNoValue')}
        ${sliceFunction(reportSrc, 'reportCenterFindQuestionInBank')}
        return { ex: reportCenterExtractQuestionBankFromText, norm: reportCenterNormalizeQuestionBank, no: reportCenterGetQuestionNoValue, find: reportCenterFindQuestionInBank };
    `)();
    const examData = 'window.examData = { questions: [ { id: "Q01", number: 1, question: "a" }, { id: "Q02", number: 2, question: "b" } ] };';
    const list = rc.norm(rc.ex(examData));
    assert.strictEqual(list.length, 2, 'report-center examData');
    assert.strictEqual(rc.find(list, 2).question, 'b', 'report-center Q02 조회');
    assert.strictEqual(rc.norm(rc.ex('window.questionBank = [ {id:1},{id:2},{id:3} ];')).length, 3, 'report-center questionBank');
    assert.strictEqual(rc.find(rc.norm(rc.ex('window.examData = { questions: [ {question:"a"},{question:"b"} ] };')), 2).question, 'b', 'report-center id 없음');
    // 본문 사용부가 question 필드를 폴백하는지(범위 밖 확인용)
    assert(/question\.content \|\| question\.question/.test(reportSrc), 'report-center 본문은 question 폴백');

    const omr = new Function('window', `
        ${sliceFunction(omrSrc, 'normalizeOmrQuestionBank')}
        return { norm: normalizeOmrQuestionBank };
    `)({});
    assert.strictEqual(omr.norm({ questions: [{}, {}] }).length, 2);
    assert.strictEqual(omr.norm({ problems: [{}, {}, {}] }).length, 3);
    // fetchOmrArchiveQuestionBank 본문이 examData를 반환 후보로 쓴다.
    assert(/window\.examData \|\| null/.test(sliceFunction(omrSrc, 'fetchOmrArchiveQuestionBank')), 'qr-omr examData 반환');
    const omrFetch = sliceFunction(omrSrc, 'fetchOmrArchiveQuestionBank');
    const body = omrFetch.slice(omrFetch.indexOf('const sandboxWindow'), omrFetch.lastIndexOf('}'));
    const run = new Function('jsText', body);
    assert.strictEqual(omr.norm(run(examData)).length, 2, 'qr-omr examData 추출');
    assert.strictEqual(omr.norm(run('window.questionBank = [ {id:1} ];')).length, 1, 'qr-omr questionBank 추출');
    console.log('report-center / qr-omr loader tests passed');
}
