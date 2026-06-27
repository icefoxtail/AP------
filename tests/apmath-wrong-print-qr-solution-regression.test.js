/**
 * AP Math 오답 클리닉 출력 엔진 복구 회귀 테스트
 *  - LOOP 1: QR 공개 주소 고정
 *  - LOOP 2: payload 문항 연결(encode→decode→expand 수량/식별자 유지)
 *  - LOOP 3: payload 메타 보존 + v2 호환
 *  - LOOP 4: QR 길이 검증/경고
 *  - LOOP 5: 긴 해설 분할 출력
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const wrongEngine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');

// ---- 엔진 스크립트에서 순수 함수만 추출해 실행 가능한 샌드박스를 만든다 ----
function loadEngineExports() {
    const blocks = [...wrongEngine.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    let script = blocks[blocks.length - 1];
    // 부팅 호출(DOM 의존)을 제거하고 테스트 대상 함수만 반환한다.
    script = script.replace(/\n\s*boot\(\);\s*$/, '\n');
    script += `
        return {
            compactWrongItem, expandWrongItem,
            buildStudentQrPayload, buildClassQrPayload, buildGradeQrPayload, buildTypeQrPayload,
            encodeWrongQrPayload, decodeWrongQrPayload, expandWrongQrPayload,
            buildQrTargetUrl, evaluateQrUrlLength,
            makeSolutionHtmlChunks, findQuestionInBank,
            WRONG_PRINT_PUBLIC_URL, QR_URL_LENGTH
        };`;

    // makeSolutionHtmlChunks가 사용하는 최소 DOM 셰임.
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    global.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };
    global.document = {
        createElement(tag) {
            const el = {
                tagName: String(tag).toUpperCase(),
                _text: '',
                _childNodes: [],
                set innerHTML(v) {
                    el._childNodes = [];
                    String(v).split(/(<br\s*\/?>)/i).forEach(part => {
                        if (!part) return;
                        if (/^<br/i.test(part)) el._childNodes.push({ nodeType: 1, tagName: 'BR', outerHTML: '<br>' });
                        else el._childNodes.push({ nodeType: 3, textContent: part });
                    });
                },
                get childNodes() { return { forEach: fn => el._childNodes.forEach(fn) }; },
                set textContent(v) { el._text = v; },
                get textContent() { return el._text; },
                get outerHTML() { return `<${tag}>${esc(el._text)}</${tag}>`; }
            };
            return el;
        }
    };

    return new Function(script)();
}

const E = loadEngineExports();

// ---- 테스트 1: QR 공개 주소 ----
{
    const url = E.buildQrTargetUrl({ v: 3, m: 'student', i: [['exams/a.js', 1, 50]] });
    assert(url.startsWith('https://icefoxtail.github.io/AP------/apmath/wrong_print_engine.html'), 'QR은 공개 URL로 시작해야 한다');
    assert(!/localhost/.test(url), 'QR URL에 localhost 금지');
    assert(!/127\.0\.0\.1/.test(url), 'QR URL에 127.0.0.1 금지');
    assert(!/192\.168/.test(url), 'QR URL에 192.168 금지');
    assert(/[?&]mode=review\b/.test(url), 'mode=review 유지');
    assert(/[?&]qr=1\b/.test(url), 'qr=1 유지');
    assert(/[?&]wp=/.test(url), 'wp 파라미터 유지');
    console.log('  [1] QR 공개 주소 PASS');
}

// ---- 테스트 2: payload 복원 수량 + 식별자 ----
{
    const payload = { className: '월수금 A', printTitle: '월수금 A 오답 클리닉', createdDate: '2026-06-27', gradeName: '고1' };
    const student = {
        studentName: '홍길동',
        wrongItems: [
            { archiveFile: 'exams/2026_mid.js', questionNo: 3, examTitle: '중간고사', correctRate: 40 },
            { archiveFile: 'exams/2026_mid.js', questionNo: 7, examTitle: '중간고사', correctRate: 55 },
            { archiveFile: 'exams/2026_fin.js', questionNo: 2, examTitle: '기말고사', correctRate: 60 }
        ]
    };
    const compact = E.buildStudentQrPayload(payload, student);
    const restored = E.decodeWrongQrPayload(E.encodeWrongQrPayload(compact));
    assert.strictEqual(restored.students[0].wrongItems.length, 3, '학생 문항 수 유지');
    assert.strictEqual(restored.students[0].studentName, '홍길동', '학생명 메타 유지');
    assert.strictEqual(restored.className, '월수금 A', '반명 메타 유지');
    assert.strictEqual(restored.createdDate, '2026-06-27', '출력일 메타 유지');
    assert.strictEqual(restored.students[0].wrongItems[0].archiveFile, 'exams/2026_mid.js', 'archiveFile 유지');
    assert.strictEqual(restored.students[0].wrongItems[1].questionNo, 7, 'questionNo 유지');
    assert.strictEqual(restored.students[0].wrongItems[2].examTitle, '기말고사', 'examTitle 유지');

    const classPayload = { className: '월수금 A', printTitle: 'X', createdDate: '2026-06-27', classWrongItems: student.wrongItems };
    const classRestored = E.decodeWrongQrPayload(E.encodeWrongQrPayload(E.buildClassQrPayload(classPayload)));
    assert.strictEqual(classRestored.mode, 'class', '반별 모드');
    assert.strictEqual(classRestored.classWrongItems.length, 3, '반별 문항 수 유지');
    assert.strictEqual(classRestored.className, '월수금 A', '반별 반명 유지');

    const gradePayload = { gradeName: '고1', printTitle: 'G', createdDate: '2026-06-27', gradeWrongItems: student.wrongItems };
    const gradeRestored = E.decodeWrongQrPayload(E.encodeWrongQrPayload(E.buildGradeQrPayload(gradePayload)));
    assert.strictEqual(gradeRestored.mode, 'grade', '학년별 모드');
    assert.strictEqual(gradeRestored.gradeWrongItems.length, 3, '학년별 문항 수 유지');
    assert.strictEqual(gradeRestored.gradeName, '고1', '학년 메타 유지');

    const typePayload = { scope: 'class', className: '월수금 A', typeMode: 'mostWrong', printTitle: 'T', createdDate: '2026-06-27', typeItems: student.wrongItems };
    const typeRestored = E.decodeWrongQrPayload(E.encodeWrongQrPayload(E.buildTypeQrPayload(typePayload)));
    assert.strictEqual(typeRestored.mode, 'type', '유형별 모드');
    assert.strictEqual(typeRestored.typeItems.length, 3, '유형별 문항 수 유지');
    console.log('  [2] payload 복원 수량/식별자/메타 PASS');
}

// ---- 테스트 3: 기존 v2 QR 호환 ----
{
    // 레거시 v2 배열형 payload를 만들어 복원되는지 확인한다.
    const v2 = { v: 2, m: 'student', i: [['exams/old.js', 5, 30], ['exams/old.js', 9, 70]] };
    const restored = E.decodeWrongQrPayload(E.encodeWrongQrPayload(v2));
    assert.strictEqual(restored.mode, 'student', 'v2 student 복원');
    assert.strictEqual(restored.students[0].wrongItems.length, 2, 'v2 문항 수 유지');
    assert.strictEqual(restored.students[0].wrongItems[0].archiveFile, 'exams/old.js', 'v2 archiveFile 유지');
    assert.strictEqual(restored.students[0].wrongItems[1].questionNo, 9, 'v2 questionNo 유지');
    console.log('  [3] v2 호환 PASS');
}

// ---- 테스트 4: 긴 해설 분할 (chunk 마지막 문장 보존) ----
{
    const MARKER = 'LONG_SOLUTION_END_MARKER';
    const words = [];
    for (let i = 0; i < 400; i++) words.push('word' + i);
    words.push(MARKER);
    const longHtml = words.join(' ');
    const chunks = E.makeSolutionHtmlChunks(longHtml);
    assert(Array.isArray(chunks) && chunks.length > 1, '긴 해설은 여러 조각으로 나뉘어야 한다');
    const joined = chunks.join(' ');
    assert(joined.includes(MARKER), '마지막 조각까지 마커가 보존되어야 한다');
    // 모든 원본 단어가 조각 어딘가에 존재(누락 금지).
    assert(joined.includes('word0') && joined.includes('word399'), '첫/끝 단어 모두 보존');
    console.log('  [4] 긴 해설 분할 마커 보존 PASS');
}

// ---- 테스트 5: QR 길이 경고 ----
{
    const safe = E.evaluateQrUrlLength('x'.repeat(800));
    const warn = E.evaluateQrUrlLength('x'.repeat(1500));
    const danger = E.evaluateQrUrlLength('x'.repeat(2000));
    assert.strictEqual(safe.level, 'safe', '1200 이하 정상');
    assert.strictEqual(warn.level, 'warn', '1201~1800 경고');
    assert.strictEqual(danger.level, 'danger', '1800 초과 위험');
    assert.strictEqual(danger.length, 2000, '길이 측정값 정확');

    // 실제 긴 반별 payload로 위험 수준이 감지되는지 확인.
    const bigItems = [];
    for (let i = 1; i <= 120; i++) bigItems.push({ archiveFile: 'exams/2026_midterm_full.js', questionNo: i, correctRate: 33 });
    const bigUrl = E.buildQrTargetUrl(E.buildClassQrPayload({ className: '테스트반', printTitle: '테스트반 오답', createdDate: '2026-06-27', classWrongItems: bigItems }));
    const info = E.evaluateQrUrlLength(bigUrl);
    assert(info.length > E.QR_URL_LENGTH.safe, '대량 문항 QR은 안전 기준을 초과해야 한다');
    console.log('  [5] QR 길이 경고 PASS (대량 URL 길이=' + info.length + ')');
}

// ---- 테스트 6: questionNo는 틀렸지만 id/originalId/source로 복원 ----
{
    const bank = [
        { id: 101, questionNo: 5, content: 'Q-A' },
        { id: 202, questionNo: 9, content: 'Q-B' },
        { id: 303, questionNo: 12, content: 'Q-C' }
    ];

    // questionNo가 어긋나도 sourceQuestionNo로 우선 복원.
    const bySource = E.findQuestionInBank(bank, { questionNo: 999, sourceQuestionNo: 9 });
    assert(bySource && bySource.content === 'Q-B', 'sourceQuestionNo로 복원되어야 한다');

    // questionNo가 어긋나도 originalId(= bank id)로 복원.
    const byOriginalId = E.findQuestionInBank(bank, { questionNo: 999, originalId: 303 });
    assert(byOriginalId && byOriginalId.content === 'Q-C', 'originalId로 복원되어야 한다');

    // questionNo가 어긋나도 id로 복원.
    const byId = E.findQuestionInBank(bank, { questionNo: 0, id: 101 });
    assert(byId && byId.content === 'Q-A', 'id로 복원되어야 한다');

    // 아무 식별자도 못 맞히면 null(조용한 오복원 금지).
    const miss = E.findQuestionInBank(bank, { questionNo: 7777 });
    assert(miss === null, '어떤 식별자로도 못 찾으면 null이어야 한다');

    // compactWrongItem은 source 식별자를 우선 직렬화한다(MIXED 교정).
    const compact = E.compactWrongItem({ archiveFile: 'exams/mixed.js', questionNo: 4, sourceArchiveFile: 'exams/origin.js', sourceQuestionNo: 17, correctRate: 30 });
    assert.strictEqual(compact[0], 'exams/origin.js', 'compact는 sourceArchiveFile 우선');
    assert.strictEqual(compact[1], 17, 'compact는 sourceQuestionNo 우선');
    console.log('  [6] id/originalId/source 복원 + compact source 우선 PASS');
}

// ---- 정적 가드: 해설 박스 1개 overflow 허용 제거 + split 흐름 존재 ----
{
    assert(
        wrongEngine.includes('function makeSolutionHtmlChunks') &&
        wrongEngine.includes('function makeLongSolutionShell') &&
        wrongEngine.includes('renderSplitSolutionBox') &&
        wrongEngine.includes('isOnlyBoxInColumn'),
        '엔진은 archive 방식 해설 분할 흐름을 가져야 한다'
    );
    assert(
        !/targetCol\.querySelectorAll\('\.sol-box'\)\.length === 1\)\s*\{\s*placed = true/.test(wrongEngine) &&
        !wrongEngine.includes("scrollHeight <= targetCol.clientHeight + 2 || targetCol.querySelectorAll('.sol-box').length === 1"),
        '해설 박스 1개라는 이유로 overflow를 성공 처리하면 안 된다'
    );
    assert(
        wrongEngine.includes('.q-box.sol-box.sol-box-long') &&
        wrongEngine.includes('.sol-chunk { display: inline; }'),
        '긴 해설용 CSS(sol-box-long / sol-chunk)가 있어야 한다'
    );
    assert(
        wrongEngine.includes("const WRONG_PRINT_PUBLIC_URL = 'https://icefoxtail.github.io/AP------/apmath/wrong_print_engine.html'") &&
        wrongEngine.includes('new URL(WRONG_PRINT_PUBLIC_URL)') &&
        !wrongEngine.includes('new URL(window.location.href)'),
        'QR URL은 공개 주소 상수로 생성해야 한다'
    );
    assert(
        wrongEngine.includes('[문항 로드 실패]') &&
        wrongEngine.includes('문항 복원 실패:'),
        '복원 실패 문항은 경고 박스 + 콘솔 경고를 남겨야 한다'
    );
    console.log('  [정적] 분할/공개주소/경고 가드 PASS');
}

console.log('apmath wrong print QR/solution regression passed');
