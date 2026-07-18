// 2026-07-14 LOOP 3 — 데스크 수납·미납 UI 테스트
// management.js 전체를 vm 샌드박스에 로드해 실제 함수 동작을 검증한다.
//  1) 학생 선택 없이 수납 불가 / 청구 선택 없이 수납 불가
//  2) 남은 금액 초과 입력 클라이언트 경고 + 서버 409/400 처리(메시지 표시 + 잔액 재조회)
//  3) 저장 중 이중 클릭 1건만 생성
//  4) 저장 후 청구 paid_amount/status/remaining 즉시 갱신(대상 학생 재조회)
//  5) raw student_id/payment_id 직접 입력 UI 제거 (수납 흐름)
//  6) 390px: 저장 버튼 sticky + 필터 flex-wrap (정적 스타일 검증)
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/management.js'), 'utf8');

// ════ A. 정적 검증 ════
// raw ID 입력 UI 제거 (수납 거래 입력 폼)
assert.doesNotMatch(source, /baf-transaction-student-id/, '수납 거래 raw student_id 입력이 남아 있음');
assert.doesNotMatch(source, /baf-transaction-payment-id/, '수납 거래 raw payment_id 입력이 남아 있음');
assert.doesNotMatch(source, /saveBillingAccountingTransaction\(/, '구 수납 저장 함수 호출이 남아 있음');
// 과거 안내 문구 제거 + 현행 문구
assert.doesNotMatch(source, /실제 수납 등록, 환불 처리, 이월 처리, 장부 자동 반영은 이번 단계에서 연결하지 않습니다/, '낡은 안내 문구가 남아 있음');
assert.match(source, /수납을 저장하면 청구 상태·출납 장부·감사 기록이 자동 반영됩니다/);
// 수납 데스크 탭과 미납 필터 4종
assert.match(source, /수납 데스크/);
assert.match(source, /기한 전/);
assert.match(source, /오늘 마감/);
assert.match(source, /연체/);
assert.match(source, /부분납부/);
// 학생·청구 자동 연결(선택된 청구에서만 채움) + 멱등키
assert.match(source, /payment_id: payment\.id/);
assert.match(source, /student_id: collect\.studentId/);
assert.match(source, /clientRequestId: billingAccountingClientRequestId\(\)/);
// 이중 클릭 방지 가드
assert.match(source, /withBillingAccountingSaveGuard\(`collect:\$\{payment\.id\}`/);
// 서버 초과/동시성 응답 처리
assert.match(source, /PAYMENT_OVER_ALLOCATED/);
assert.match(source, /PAYMENT_CONCURRENT_CONFLICT/);
// 390px: sticky 저장 바 + 필터 줄바꿈
assert.match(source, /apms-collect-save" style="position:sticky; bottom:0/);
assert.match(source, /display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">\$\{filterChips\}/);

// ════ B. 동작 검증 (vm 샌드박스) ════
function createSandbox() {
    const calls = { toasts: [], posts: [], patches: [], gets: [], modals: [] };
    const elements = new Map();
    const setInput = (id, value) => elements.set(id, { value: String(value) });

    const sandbox = {
        console,
        Date,
        URLSearchParams,
        Promise,
        setTimeout,
        clearTimeout,
        encodeURIComponent,
        document: {
            activeElement: null,
            getElementById: (id) => elements.get(id) || null,
            querySelectorAll: () => []
        },
        window: { prompt: () => null },
        confirm: () => true,
        toast: (message, kind) => calls.toasts.push({ message: String(message), kind }),
        showModal: (title, html) => calls.modals.push({ title, html }),
        closeModal: () => {},
        loadData: async () => {},
        setManagementReturnView: () => {},
        setModalReturnView: () => {},
        isActiveStudentStatus: (status) => String(status || '재원') === '재원',
        normalizeStudentStatus: (status) => String(status || '재원'),
        apmsGetClassOptionDisplayLabel: (c) => c?.name || '',
        state: {
            auth: { role: 'admin' },
            db: {
                students: [
                    { id: 's01', name: '김수학', status: '재원', school_name: '금당고', grade: '고2', student_phone: '010-1111-2222' },
                    { id: 's02', name: '이대수', status: '재원', school_name: '금당고', grade: '고1' },
                    { id: 's99', name: '박퇴원', status: '퇴원' }
                ],
                classes: [{ id: 'cA', name: '고2 심화' }],
                class_students: [{ class_id: 'cA', student_id: 's01' }]
            },
            ui: {}
        },
        api: {
            async get(url) {
                calls.gets.push(url);
                if (url.includes('payments?student_id=')) return { success: true, payments: sandbox.__paymentsFixture };
                if (url.includes('payment-items?student_id=')) return { success: true, payment_items: sandbox.__itemsFixture };
                if (url.includes('refund-records?student_id=')) return { success: true, refunds: [] };
                if (url.includes('carryover-records?student_id=')) return { success: true, carryovers: [] };
                if (url.includes('accounting-summary')) return { success: true, total_paid: 0 };
                if (url.includes('payment-transactions')) return { success: true, transactions: [] };
                return { success: true };
            },
            async post(url, body) {
                calls.posts.push({ url, body });
                return sandbox.__postResult(url, body);
            },
            async patch(url, body) {
                calls.patches.push({ url, body });
                return { success: true };
            }
        },
        __paymentsFixture: [],
        __itemsFixture: [],
        __postResult: () => ({ success: true }),
        __setInput: setInput,
        __calls: calls
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: 'management.js' });
    return sandbox;
}

async function run() {
    // ── B-1. 순수 헬퍼: 남은 금액·미납 구분·필터·금액 검증 ──
    {
        const sb = createSandbox();
        const today = '2026-07-14';
        assert.strictEqual(sb.billingCollectRemaining({ total_amount: 300000, paid_amount: 120000 }), 180000);
        assert.strictEqual(sb.billingCollectRemaining({ total_amount: 300000, paid_amount: 400000 }), 0);
        assert.strictEqual(sb.billingCollectDueBucket({ status: 'unpaid', due_date: '2026-07-13' }, today), 'overdue');
        assert.strictEqual(sb.billingCollectDueBucket({ status: 'unpaid', due_date: '2026-07-14' }, today), 'due_today');
        assert.strictEqual(sb.billingCollectDueBucket({ status: 'partial', due_date: '2026-08-01' }, today), 'upcoming');
        assert.strictEqual(sb.billingCollectDueBucket({ status: 'paid', due_date: '2026-07-01' }, today), 'paid');
        assert.strictEqual(sb.billingCollectDueBucket({ status: 'unpaid' }, today), 'no_due');

        const payments = [
            { id: 'p1', status: 'unpaid', total_amount: 100, paid_amount: 0, due_date: '2026-07-01' },   // 연체
            { id: 'p2', status: 'partial', total_amount: 100, paid_amount: 50, due_date: '2026-07-14' }, // 오늘+부분
            { id: 'p3', status: 'unpaid', total_amount: 100, paid_amount: 0, due_date: '2026-08-01' },   // 기한 전
            { id: 'p4', status: 'paid', total_amount: 100, paid_amount: 100, due_date: '2026-07-01' },   // 완납 제외
            { id: 'p5', status: 'unpaid', total_amount: 0, paid_amount: 0, due_date: '2026-07-01' }      // 0원 잔액 제외
        ];
        assert.deepStrictEqual(sb.billingCollectFilterPayments(payments, 'open', today).map(p => p.id), ['p1', 'p2', 'p3']);
        assert.deepStrictEqual(sb.billingCollectFilterPayments(payments, 'overdue', today).map(p => p.id), ['p1']);
        assert.deepStrictEqual(sb.billingCollectFilterPayments(payments, 'due_today', today).map(p => p.id), ['p2']);
        assert.deepStrictEqual(sb.billingCollectFilterPayments(payments, 'upcoming', today).map(p => p.id), ['p3']);
        assert.deepStrictEqual(sb.billingCollectFilterPayments(payments, 'partial', today).map(p => p.id), ['p2']);

        assert.strictEqual(sb.billingCollectValidateAmount(0, 100000).ok, false);
        assert.strictEqual(sb.billingCollectValidateAmount(-1, 100000).ok, false);
        assert.strictEqual(sb.billingCollectValidateAmount(100.5, 100000).ok, false);
        const over = sb.billingCollectValidateAmount(150000, 100000);
        assert.strictEqual(over.ok, false);
        assert.match(over.message, /남은 금액/);
        assert.strictEqual(sb.billingCollectValidateAmount(100000, 100000).ok, true);
    }

    // ── B-2. 흐름: 학생/청구 미선택 차단 → 선택 → 초과 경고 → 정상 저장 → 즉시 갱신 ──
    {
        const sb = createSandbox();
        const calls = sb.__calls;
        sb.__paymentsFixture = [
            { id: 'pay1', student_id: 's01', year: 2026, month: 7, total_amount: 300000, paid_amount: 100000, status: 'partial', due_date: '2026-08-12' }
        ];
        sb.__itemsFixture = [{ id: 'pi1', payment_id: 'pay1', name: '고2 심화 수강료', branch: 'apmath' }];

        // 학생 선택 없이 저장 → 차단, POST 없음
        await sb.saveBillingCollectTransaction();
        assert.match(calls.toasts.at(-1).message, /학생을 먼저/);
        assert.strictEqual(calls.posts.length, 0);

        // 학생 검색: 재원생만, 퇴원생 제외
        const matches = sb.billingCollectMatchStudents('김수학');
        assert.deepStrictEqual(matches.map(s => s.id), ['s01']);
        assert.deepStrictEqual(sb.billingCollectMatchStudents('박퇴원'), []);

        // 학생 선택 → 청구 로드
        await sb.billingCollectSelectStudent('s01');
        const collect = sb.getBillingCollectState();
        assert.strictEqual(collect.studentId, 's01');
        assert.strictEqual(collect.payments.length, 1);

        // 청구 미선택 저장 → 차단
        await sb.saveBillingCollectTransaction();
        assert.match(calls.toasts.at(-1).message, /수납할 청구를 선택/);
        assert.strictEqual(calls.posts.length, 0);

        // 청구 선택 + 남은 금액(200,000) 초과 입력 → 클라이언트 경고, POST 없음
        sb.billingCollectSelectPayment('pay1');
        sb.__setInput('baf-collect-amount', '250000');
        sb.__setInput('baf-collect-method', 'cash');
        sb.__setInput('baf-collect-date', '2026-07-14');
        sb.__setInput('baf-collect-note', '');
        await sb.saveBillingCollectTransaction();
        assert.match(calls.toasts.at(-1).message, /남은 금액.*초과/);
        assert.strictEqual(calls.posts.length, 0);

        // 정상 저장: 서버 성공 후 갱신된 청구를 반환하도록 fixture 교체
        sb.__setInput('baf-collect-amount', '200000');
        sb.__postResult = () => {
            sb.__paymentsFixture = [
                { id: 'pay1', student_id: 's01', year: 2026, month: 7, total_amount: 300000, paid_amount: 300000, status: 'paid', due_date: '2026-08-12' }
            ];
            return { success: true, id: 'ptx1', transaction: {} };
        };
        const getsBefore = calls.gets.length;
        await sb.saveBillingCollectTransaction();
        assert.strictEqual(calls.posts.length, 1, '정상 저장 POST 1건');
        const posted = calls.posts[0].body;
        // 학생·청구·지점은 선택 상태에서 자동 결정 (임의 입력 불가)
        assert.strictEqual(posted.payment_id, 'pay1');
        assert.strictEqual(posted.student_id, 's01');
        assert.strictEqual(posted.branch, 'apmath');
        assert.strictEqual(posted.transaction_type, 'payment'); // 잔액 전액 = 완납 수납
        assert.strictEqual(posted.amount, 200000);
        assert.ok(posted.clientRequestId, '멱등키 누락');
        // 저장 후 즉시 갱신: 학생 청구 재조회 + paid/status 반영
        assert.ok(calls.gets.length > getsBefore, '저장 후 재조회 없음');
        const updated = sb.getBillingCollectState().payments[0];
        assert.strictEqual(updated.paid_amount, 300000);
        assert.strictEqual(updated.status, 'paid');
        assert.strictEqual(sb.billingCollectRemaining(updated), 0);
    }

    // ── B-3. 서버 409/400 응답 처리: 메시지 표시 + 잔액 재조회 ──
    {
        const sb = createSandbox();
        const calls = sb.__calls;
        sb.__paymentsFixture = [
            { id: 'pay1', student_id: 's01', year: 2026, month: 7, total_amount: 300000, paid_amount: 0, status: 'unpaid', due_date: '2026-08-12' }
        ];
        await sb.billingCollectSelectStudent('s01');
        sb.billingCollectSelectPayment('pay1');
        sb.__setInput('baf-collect-amount', '300000');
        sb.__setInput('baf-collect-method', 'card');
        sb.__setInput('baf-collect-date', '2026-07-14');
        sb.__setInput('baf-collect-note', '');
        sb.__postResult = () => ({ success: false, code: 'PAYMENT_OVER_ALLOCATED', error: '청구 남은 금액(100000원)보다 큰 금액은 수납할 수 없습니다.', remaining_amount: 100000 });
        const getsBefore = calls.gets.length;
        await sb.saveBillingCollectTransaction();
        assert.match(calls.toasts.at(-1).message, /남은 금액\(100000원\)/, '서버 초과 메시지가 그대로 표시되지 않음');
        assert.ok(calls.gets.length > getsBefore, '409 후 잔액 재조회 없음');
    }

    // ── B-4. 이중 클릭: 같은 청구 저장은 동시에 1건만 POST ──
    {
        const sb = createSandbox();
        const calls = sb.__calls;
        sb.__paymentsFixture = [
            { id: 'pay1', student_id: 's01', year: 2026, month: 7, total_amount: 300000, paid_amount: 0, status: 'unpaid', due_date: '2026-08-12' }
        ];
        await sb.billingCollectSelectStudent('s01');
        sb.billingCollectSelectPayment('pay1');
        sb.__setInput('baf-collect-amount', '300000');
        sb.__setInput('baf-collect-method', 'card');
        sb.__setInput('baf-collect-date', '2026-07-14');
        sb.__setInput('baf-collect-note', '');
        let release;
        sb.__postResult = () => new Promise((resolve) => { release = () => resolve({ success: true, id: 'ptx1' }); });
        const first = sb.saveBillingCollectTransaction();
        const second = sb.saveBillingCollectTransaction(); // 저장 중 재클릭
        await Promise.resolve();
        release();
        await Promise.all([first, second]);
        assert.strictEqual(calls.posts.length, 1, `이중 클릭이 ${calls.posts.length}건 생성`);
    }

    // ── B-5. 렌더: 청구 카드에 연월·항목·금액·기한 표시, 미납 필터 노출 ──
    {
        const sb = createSandbox();
        sb.__paymentsFixture = [
            { id: 'pay1', student_id: 's01', year: 2026, month: 7, total_amount: 300000, paid_amount: 100000, status: 'partial', due_date: '2026-08-12' }
        ];
        sb.__itemsFixture = [{ id: 'pi1', payment_id: 'pay1', name: '고2 심화 수강료', branch: 'apmath' }];
        await sb.billingCollectSelectStudent('s01');
        const html = sb.__calls.modals.at(-1).html;
        assert.match(html, /2026년 7월 청구/);
        assert.match(html, /고2 심화 수강료/);
        assert.match(html, /남은 금액/);
        assert.match(html, /납부기한/);
        assert.match(html, /전체 미납/);
        assert.match(html, /김수학 님의 청구/);
        assert.doesNotMatch(html, /student_id/, '화면에 raw 필드명이 노출됨');
    }

    console.log('apmath billing management ui tests passed');
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
