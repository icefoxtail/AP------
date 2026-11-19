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
const archiveFiles = {}; // 가짜 파일(문자열) 우선, 없으면 archive/ 아래 실제 파일
const coreEnv = new Function('archiveFiles', 'state', 'fs', 'archiveRoot', `
    function normalizeArchivePath(file) { const raw = String(file || '').trim(); if (!raw) return ''; return raw.startsWith('exams/') ? raw : 'exams/' + raw; }
    async function fetchArchiveScriptText(p) {
        if (p in archiveFiles) return archiveFiles[p];
        return fs.readFileSync(archiveRoot + '/' + p, 'utf8');
    }
    ${sliceFunction(coreSrc, 'getArchiveQuestionNumber')}
    ${sliceFunction(coreSrc, 'getBankQuestionId')}
    ${sliceFunction(coreSrc, 'pickArchiveQuestionList')}
    ${sliceFunction(coreSrc, 'loadArchiveQuestionBank')}
    ${sliceFunction(coreSrc, 'findQuestionInBank')}
    return { getArchiveQuestionNumber, getBankQuestionId, pickArchiveQuestionList, loadArchiveQuestionBank, findQuestionInBank };
`)(archiveFiles, { ui: {} }, fs, path.join(root, 'archive').replace(/\\/g, '/'));

const nums = list => list.map((q, i) => coreEnv.getArchiveQuestionNumber(q, i));

// ---- examData 번호 헬퍼 ----
assert.deepStrictEqual(nums([{ id: 1 }, { id: 2 }, { id: 3 }]), [1, 2, 3], '숫자 id는 그대로');
assert.deepStrictEqual(nums([{ id: '7' }, { id: 'q02' }]), [7, 2], '문자열 숫자/q02');
assert.deepStrictEqual(nums([{ id: 'Q01', number: 1 }, { id: 'Q02', number: 2 }]), [1, 2], 'Q01 + number');
assert.deepStrictEqual(nums([{ id: 'Q01' }, { id: 'Q02' }]), [1, 2], 'Q01만 있어도 숫자 추출');
assert.deepStrictEqual(nums([{ id: 's01', number: 22 }]), [22], 's01 + number는 number');
assert.deepStrictEqual(nums([{ question: 'a' }, { question: 'b' }, { number: 9 }]), [1, 2, 9], 'id 없음은 number, 없으면 순번+1');
assert.deepStrictEqual(nums([{ id: 5, number: 5 }]), [5], 'id와 number 일치');
assert.deepStrictEqual(nums([{ id: 'BV-BAKBAL-H-COM2-P10-Q01-T1-R1' }, { id: 'BV-BAKBAL-H-COM2-P10-Q02-T1-R1' }]), [1, 2], '교재형 긴 id는 첫 숫자열이 아니라 순번+1');
assert.strictEqual(coreEnv.getArchiveQuestionNumber(null, 3), 4, 'null 문항은 순번+1');

// ---- 문항 배열 찾기 ----
const pick = w => coreEnv.pickArchiveQuestionList(w);
assert.deepStrictEqual(pick({ questionBank: [{ id: 1 }] }), { list: [{ id: 1 }], fromExamData: false });
assert.deepStrictEqual(pick({ examData: { questions: [{ id: 2 }] } }), { list: [{ id: 2 }], fromExamData: true });
assert.deepStrictEqual(pick({ examData: { problems: [{ id: 3 }] } }), { list: [{ id: 3 }], fromExamData: true });
assert.deepStrictEqual(pick({ examData: [{ id: 4 }] }), { list: [{ id: 4 }], fromExamData: true });
assert.deepStrictEqual(pick({ questionBank: [{ id: 1 }], examData: { questions: [{ id: 2 }] } }), { list: [{ id: 1 }], fromExamData: false }, 'questionBank 우선');
assert.deepStrictEqual(pick({}), { list: [], fromExamData: false });
assert.deepStrictEqual(pick({ questionBank: {} }), { list: [], fromExamData: false }, '배열이 아닌 questionBank는 기존처럼 []');

// ---- 추천 후보 번호: questionBank 형식은 기존 동작 ----
{
    const legacy = { fromExamData: false };
    assert.strictEqual(coreEnv.getBankQuestionId(legacy, { id: 3 }, 0), 3);
    assert.strictEqual(coreEnv.getBankQuestionId(legacy, { id: 'Q01' }, 0), 'Q01', '기존: id 값 그대로');
    assert.strictEqual(coreEnv.getBankQuestionId(legacy, { content: 'x' }, 0), null, '기존: id 없으면 건너뜀');
    assert.strictEqual(coreEnv.getBankQuestionId(legacy, null, 0), null);
    const ed = { fromExamData: true };
    assert.strictEqual(coreEnv.getBankQuestionId(ed, { id: 'Q02', number: 2 }, 1), 2);
    assert.strictEqual(coreEnv.getBankQuestionId(ed, { question: 'x' }, 4), 5, 'examData id 없음은 순번+1');
}

// ---- findQuestionInBank: 기존 형식은 기존 동작, examData는 새 번호 ----
{
    const qQ = [{ id: 'Q01', number: 1, question: 'q1' }, { id: 'Q02', number: 2, question: 'q2' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qQ, 2, true).question, 'q2');
    const qNone = [{ question: 'n1' }, { question: 'n2' }, { question: 'n3' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qNone, 3, true).question, 'n3');
    const qNum = [{ id: 1, content: 'o' }, { id: 2, content: 'p' }, { id: 1, content: 'dup' }];
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 1).content, 'o', '숫자 id는 기존처럼 첫 일치');
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 3).content, 'dup', '일치 없으면 순번 폴백(기존 동작)');
    assert.strictEqual(coreEnv.findQuestionInBank(qNum, 9), null);
    // 교재형 id: 기존 형식에서는 Number(id)=NaN → 순번 폴백(기존 동작 유지)
    const tb = ['BV-X-COM2-P10-Q01-T1-R1', 'BV-X-COM2-P10-Q02-T1-R1', 'BV-X-COM2-P10-Q03-T1-R1'].map(id => ({ id }));
    assert.strictEqual(coreEnv.findQuestionInBank(tb, 3), tb[2], '교재 id는 기존대로 순번 폴백');
}

// ---- 기존 questionBank 형식 전수 비교(수정 전 로직 vs 현재) + examData 전수 결함 검사 ----
// 수정 전 로직을 오라클로 박아 두고 archive/exams 전체에서 번호·후보 키·조회 결과를 비교한다.
function legacyLoad(text) {
    const sandbox = {};
    const data = new Function('window', `${text}\n;return { examTitle: window.examTitle || '', questionBank: window.questionBank || [] };`)(sandbox);
    return { examTitle: data.examTitle, questionBank: Array.isArray(data.questionBank) ? data.questionBank : [] };
}
function legacyFind(bank, questionNo) {
    if (!Array.isArray(bank) || questionNo === null || questionNo === undefined) return null;
    const byId = bank.find(q => Number(q?.id) === Number(questionNo));
    if (byId) return byId;
    const idx = Number(questionNo) - 1;
    if (Number.isInteger(idx) && idx >= 0 && idx < bank.length) return bank[idx];
    return null;
}
function walkJs(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walkJs(p, out);
        else if (p.endsWith('.js')) out.push(p);
    }
    return out;
}

(async () => {
    archiveFiles['exams/a.js'] = 'window.examData = { title: "시험 A", questions: [ { id: "Q01", number: 1, question: "x" }, { id: "Q02", number: 2, question: "y" } ] };';
    archiveFiles['exams/b.js'] = 'window.questionBank = [ { id: 1, content: "c1" }, { id: 2, content: "c2" } ]; window.examTitle = "시험 B";';
    archiveFiles['exams/c.js'] = 'window.examTitle = "빈 시험";';
    const a = await coreEnv.loadArchiveQuestionBank('a.js');
    const b = await coreEnv.loadArchiveQuestionBank('b.js');
    const c = await coreEnv.loadArchiveQuestionBank('c.js');
    assert.strictEqual(a.questionBank.length, 2, 'examData.questions 로드');
    assert.strictEqual(a.examTitle, '시험 A', 'examData.title을 제목으로');
    assert.strictEqual(a.fromExamData, true);
    assert.deepStrictEqual(nums(a.questionBank), [1, 2]);
    assert.strictEqual(b.questionBank.length, 2, 'questionBank 로드(기존 형식)');
    assert.strictEqual(b.examTitle, '시험 B');
    assert.strictEqual(b.fromExamData, false);
    assert.deepStrictEqual(c.questionBank, [], '앞 파일 examData/questionBank가 섞이지 않음');
    assert.strictEqual(c.fromExamData, false);

    const examsDir = path.join(root, 'archive', 'exams');
    const files = walkJs(examsDir);
    assert(files.length > 0, 'archive/exams 파일을 찾아야 함');
    let examDataFiles = 0;
    let legacyFiles = 0;
    let realExamDataChecked = 0;
    for (const f of files) {
        const rel = 'exams/' + path.relative(examsDir, f).split(path.sep).join('/');
        const label = rel;
        const text = fs.readFileSync(f, 'utf8');
        const legacy = legacyLoad(text);
        const now = await coreEnv.loadArchiveQuestionBank(rel);
        if (!now.fromExamData) {
            // questionBank 형식(또는 문항 배열 없음): 수정 전과 모든 결과가 같아야 한다.
            legacyFiles++;
            assert.strictEqual(now.questionBank.length, legacy.questionBank.length, `${label}: 문항 수 동일`);
            assert.strictEqual(now.examTitle, legacy.examTitle || rel.replace(/^exams\//, '').replace(/\.js$/, ''), `${label}: 제목 동일`);
            const bank = now.questionBank;
            bank.forEach((q, i) => {
                const oldId = (!q || q.id === undefined || q.id === null) ? null : q.id;
                const newId = coreEnv.getBankQuestionId(now, q, i);
                assert.strictEqual(newId, oldId, `${label}: ${i + 1}번째 추천 후보 id 동일`);
                if (oldId !== null) assert.strictEqual(Number(newId), Number(oldId), `${label}: 후보 키 동일`);
            });
            for (let n = 1; n <= bank.length + 1; n++) {
                assert.strictEqual(coreEnv.findQuestionInBank(bank, n, false), legacyFind(bank, n), `${label}: findQuestionInBank(${n}) 동일`);
            }
        } else {
            // examData 형식: 번호가 정수이고 중복 0이며 순번+1(또는 명시 number)과 일치해야 한다.
            examDataFiles++;
            const bank = now.questionBank;
            assert(bank.length > 0, `${label}: examData 문항을 읽어야 함`);
            const n = nums(bank);
            assert(n.every(Number.isInteger), `${label}: 번호가 정수`);
            assert.strictEqual(new Set(n).size, n.length, `${label}: 번호 중복 0`);
            n.forEach((no, i) => {
                const q = bank[i];
                const expected = (q && /^\s*\d+\s*$/.test(String(q.number ?? ''))) ? Number(q.number) : i + 1;
                assert.strictEqual(no, expected, `${label}: ${i + 1}번째 번호는 number 또는 순번+1`);
                assert.strictEqual(no, i + 1, `${label}: ${i + 1}번째 번호가 OMR 칸(순번+1)과 일치`);
            });
            n.forEach(no => assert(coreEnv.findQuestionInBank(bank, no, true), `${label}: ${no}번 조회`));
            if (/19_.*(금당|동산|신흥)/.test(f)) realExamDataChecked++;
        }
    }
    assert(examDataFiles >= 36, `examData 형식 원본을 36개 이상 확인해야 함(${examDataFiles})`);
    assert(legacyFiles > 1000, `questionBank 형식 전수 비교(${legacyFiles})`);
    assert(realExamDataChecked >= 2, '실제 19_* examData 원본 확인');
    console.log(`core.js loader tests passed (questionBank ${legacyFiles} files identical to pre-change logic, examData ${examDataFiles} files = 순번+1)`);
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
