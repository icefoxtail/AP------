/**
 * AP Math OS [js/ws-self-study.js]
 * 학생 자습 기록(포털 "오답 다시 풀기"·"유사 문항 풀어보기")을 선생님 화면에 보여 주는 계산과 마크업.
 * 화면 코드(ws-exam-workspace.js·student.js)는 이 파일의 함수만 부른다. DOM·네트워크·저장소를 쓰지 않는 순수 함수라
 * tests/ws-self-study.test.js가 그대로 불러 검사한다.
 *
 * 입력 모양은 서버 응답을 그대로 따른다(학생 화면 student/self-study-record.js와 같은 계약):
 *   세트 1건 = 학생 x 시험 배정 x kind('wrong' | 'similar')
 *   { student_id, assignment_id, kind, total, correct, wrong, updated_at, completed_at, items? }
 *   items 원소 = { k, u, src, r: 'c'|'w'|'u'|null, why: 'calc'|'misread'|'concept'|'method'|'guess'|null, n, t }
 *   반 단위 시험 조회(by-class의 assignment 분기)는 items가 있고, 학생 상세(detail-data)는 집계 숫자만 있다.
 * self_study_available이 true가 아니면(기능 꺼짐·옛 응답·필드 없음) 아무것도 그리지 않는다.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.WsSelfStudy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    // 학생 화면(student/self-study-record.js)의 WHY_LABELS와 같은 말.
    const WHY_ORDER = ['calc', 'misread', 'concept', 'method', 'guess'];
    const WHY_LABELS = { calc: '계산 실수', misread: '문제를 잘못 읽음', concept: '개념을 모름', method: '풀이 방법이 안 떠오름', guess: '찍음' };
    const KIND_LABELS = { wrong: '오답 다시 풀기', similar: '유사 문항' };
    const ANSWERED = ['c', 'w', 'u'];
    const TOP_WRONG_QUESTIONS = 5;

    const text = value => String(value ?? '');
    const num = value => { const n = Number(value); return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0; };

    function defaultEsc(value) {
        return text(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /** items가 배열이면 정상 원소만, JSON 문자열이면 한 번 풀어 본다. 깨졌으면 null. */
    function cleanItems(raw) {
        let list = raw;
        if (typeof list === 'string') {
            try { list = JSON.parse(list); } catch (e) { return null; }
        }
        if (!Array.isArray(list)) return null;
        return list.filter(item => item && typeof item === 'object' && !Array.isArray(item));
    }

    /** 세트 한 건의 풀이 현황. items가 비었거나 깨졌으면 서버가 계산해 둔 숫자(correct·wrong)로 대신한다. */
    function setStats(set) {
        const items = cleanItems(set && set.items);
        if (items && items.length) {
            let correct = 0;
            let wrong = 0;
            items.forEach(item => {
                if (item.r === 'c') correct += 1;
                else if (item.r === 'w' || item.r === 'u') wrong += 1;
            });
            return { answered: correct + wrong, correct, wrong, items };
        }
        const correct = num(set && set.correct);
        const wrong = num(set && set.wrong);
        return { answered: correct + wrong, correct, wrong, items: null };
    }

    /** 문항 원본 번호: src, 없으면 키("w:12", "s:12:파일:3")에서 읽는다. 못 읽으면 0. */
    function sourceNo(item) {
        const direct = Number(item && item.src);
        if (Number.isFinite(direct) && direct > 0 && item.src !== null && item.src !== '') return Math.floor(direct);
        const match = /^[ws]:(\d{1,4})(?::|$)/.exec(text(item && item.k));
        return match ? Number(match[1]) : 0;
    }

    function kstMonthDay(iso) {
        const ms = Date.parse(text(iso));
        if (!Number.isFinite(ms)) return '';
        const d = new Date(ms + 9 * 3600 * 1000).toISOString();
        return `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;
    }

    function pairText(stats) {
        return `${stats.correct}/${stats.answered}`;
    }

    /**
     * 반 단위 요약.
     * rows: 시험 상세의 학생 줄 [{ sid, name, pending, wrongs: [] }]  (학생 명단·제출 여부·오답)
     * 반환: null(그리지 않음) 또는
     *   { targetCount, practicedCount, similarCount, hasRecords, notDone: [이름], stillWrong: [{ no, students, unknown }],
     *     why: [{ code, label, students }], byStudent: { sid: { text, title } } }
     */
    function summarizeClass({ rows, selfStudy, available } = {}) {
        if (available !== true || !Array.isArray(selfStudy)) return null;
        const roster = Array.isArray(rows) ? rows : [];
        const bySid = new Map(roster.map(row => [text(row.sid), row]));

        const perStudent = new Map();
        selfStudy.forEach(set => {
            if (!set || typeof set !== 'object') return;
            const sid = text(set.student_id);
            if (!bySid.has(sid)) return; // 이 시험 명단에 없는 학생(제외·전반)은 센 사람 수에 넣지 않는다.
            const kind = set.kind === 'similar' ? 'similar' : set.kind === 'wrong' ? 'wrong' : '';
            if (!kind) return;
            const stats = setStats(set);
            const entry = perStudent.get(sid) || {};
            // 같은 학생·같은 kind가 둘이면(있을 수 없지만) 더 많이 푼 쪽을 쓴다.
            if (!entry[kind] || stats.answered > entry[kind].answered) entry[kind] = stats;
            perStudent.set(sid, entry);
        });

        const practicedIds = new Set();
        const similarIds = new Set();
        const byStudent = {};
        const stillMap = new Map();
        const whySets = new Map();
        perStudent.forEach((entry, sid) => {
            const wrongSet = entry.wrong && entry.wrong.answered > 0 ? entry.wrong : null;
            const similarSet = entry.similar && entry.similar.answered > 0 ? entry.similar : null;
            if (!wrongSet && !similarSet) return;
            practicedIds.add(sid);
            if (similarSet) similarIds.add(sid);
            const parts = [];
            if (wrongSet) parts.push(`다시 풂 ${pairText(wrongSet)}`);
            if (similarSet) parts.push(`유사 ${pairText(similarSet)}`);
            const titleParts = [];
            if (wrongSet) titleParts.push(`${KIND_LABELS.wrong} ${wrongSet.answered}문항 중 ${wrongSet.correct}문항 맞음`);
            if (similarSet) titleParts.push(`${KIND_LABELS.similar} ${similarSet.answered}문항 중 ${similarSet.correct}문항 맞음`);
            byStudent[sid] = { text: parts.join(' · '), title: titleParts.join(' / ') };

            const stillOfStudent = new Map(); // 문항 번호 -> 모름 여부(그 학생이 한 번이라도 '모름'이면 true)
            [wrongSet, similarSet].forEach(stats => {
                if (!stats || !stats.items) return;
                stats.items.forEach(item => {
                    if (item.r === 'w' || item.r === 'u') {
                        const no = sourceNo(item);
                        if (no) stillOfStudent.set(no, stillOfStudent.get(no) === true || item.r === 'u');
                        if (WHY_ORDER.includes(item.why)) {
                            if (!whySets.has(item.why)) whySets.set(item.why, new Set());
                            whySets.get(item.why).add(sid);
                        }
                    }
                });
            });
            stillOfStudent.forEach((unknown, no) => {
                const cur = stillMap.get(no) || { no, students: 0, unknown: 0 };
                cur.students += 1;
                if (unknown) cur.unknown += 1;
                stillMap.set(no, cur);
            });
        });

        // 다시 풀 거리가 있는 학생(제출했고 틀린 문항이 있음) + 실제로 푼 학생.
        const target = new Set(practicedIds);
        roster.forEach(row => { if (!row.pending && Array.isArray(row.wrongs) && row.wrongs.length) target.add(text(row.sid)); });
        const notDone = roster.filter(row => target.has(text(row.sid)) && !practicedIds.has(text(row.sid))).map(row => text(row.name));

        const stillWrong = [...stillMap.values()]
            .sort((a, b) => b.students - a.students || a.no - b.no)
            .slice(0, TOP_WRONG_QUESTIONS);
        const why = WHY_ORDER.filter(code => whySets.has(code)).map(code => ({ code, label: WHY_LABELS[code], students: whySets.get(code).size }));

        return {
            targetCount: target.size,
            practicedCount: practicedIds.size,
            similarCount: similarIds.size,
            hasRecords: practicedIds.size > 0,
            notDone, stillWrong, why, byStudent
        };
    }

    /** 요약 한 줄 글. 기록이 없으면 null. */
    function summaryLine(summary) {
        if (!summary || !summary.hasRecords) return null;
        const parts = [`${summary.targetCount}명 중 ${summary.practicedCount}명 다시 풀었음`];
        if (summary.similarCount > 0) parts.push(`유사 문항 ${summary.similarCount}명`);
        return parts.join(' · ');
    }

    /**
     * 시험 상세의 자습 칸. summary가 null(기능 꺼짐·필드 없음)이면 빈 문자열.
     * 기록 0건: 풀 거리가 있는 학생(오답 있음)이 있을 때만 옅은 한 줄, 없으면 아무것도 그리지 않는다.
     */
    function renderClassHtml(summary, { esc = defaultEsc, open = false } = {}) {
        if (!summary) return '';
        if (!summary.hasRecords) {
            return summary.targetCount > 0 ? '<div class="wsx-ss wsx-ss--empty">자습 기록 없음</div>' : '';
        }
        const sections = [];
        if (summary.notDone.length) {
            sections.push(`<div class="wsx-ss__sec">
                <div class="wsx-ss__h">아직 안 푼 학생 <span class="wsx-ss__sub">${summary.notDone.length}명</span></div>
                <div class="wsx-ss__names">${summary.notDone.map(name => `<span class="wsx-ss__name">${esc(name)}</span>`).join('')}</div>
            </div>`);
        }
        if (summary.stillWrong.length) {
            sections.push(`<div class="wsx-ss__sec">
                <div class="wsx-ss__h">다시 풀고도 틀린 문항</div>
                ${summary.stillWrong.map(q => `<div class="wsx-ss__row"><span class="wsx-ss__rowlabel">${esc(q.no)}번${q.unknown ? ` <span class="wsx-ss__sub">모름 ${q.unknown}명</span>` : ''}</span><span class="wsx-ss__rowcount">${q.students}명</span></div>`).join('')}
            </div>`);
        } else {
            sections.push('<div class="wsx-ss__sec"><div class="wsx-ss__ok">다시 푼 문항은 모두 맞혔습니다.</div></div>');
        }
        if (summary.why.length) {
            sections.push(`<div class="wsx-ss__sec">
                <div class="wsx-ss__h">틀린 이유</div>
                <div class="wsx-ss__whys">${summary.why.map(w => `<span class="wsx-ss__why">${esc(w.label)} <b>${w.students}명</b></span>`).join('')}</div>
            </div>`);
        }
        return `<details class="wsx-ss"${open ? ' open' : ''} ontoggle="wsxSelfStudyToggle(this)">
            <summary class="wsx-ss__summary"><span class="wsx-ss__tag">자습</span><span class="wsx-ss__line">${esc(summaryLine(summary))}</span></summary>
            <div class="wsx-ss__body">${sections.join('')}</div>
        </details>`;
    }

    /** 학생 한 줄 표시(작은 칩). 풀지 않았으면 빈 문자열. */
    function renderBadgeHtml(summary, sid, { esc = defaultEsc } = {}) {
        const badge = summary && summary.byStudent ? summary.byStudent[text(sid)] : null;
        return badge ? `<span class="wsx-ss-badge" title="${esc(badge.title)}">${esc(badge.text)}</span>` : '';
    }

    /**
     * 학생 상세 성적 탭: 시험(assignment) 한 건의 자습 한 줄. detail-data는 집계 숫자만 오므로 이유는 없다.
     * sets: detail-data의 self_study 전체. 해당 시험의 기록이 없으면 null.
     */
    function studentExamLine(sets, assignmentId) {
        const id = text(assignmentId);
        if (!id || !Array.isArray(sets)) return null;
        const mine = sets.filter(set => set && text(set.assignment_id) === id);
        const parts = [];
        let latest = '';
        ['wrong', 'similar'].forEach(kind => {
            const stats = mine.filter(set => set.kind === kind).map(setStats).sort((a, b) => b.answered - a.answered)[0];
            if (!stats || stats.answered <= 0) return;
            parts.push(`${KIND_LABELS[kind]} ${stats.answered}문항 중 ${stats.correct}개 맞음`);
        });
        if (!parts.length) return null;
        mine.forEach(set => { if (text(set.updated_at) > latest) latest = text(set.updated_at); });
        const day = kstMonthDay(latest);
        return `${day ? `${day} ` : ''}자습 · ${parts.join(' · ')}`;
    }

    function renderStudentLineHtml(sets, assignmentId, { esc = defaultEsc } = {}) {
        const line = studentExamLine(sets, assignmentId);
        return line ? `<span class="ap-ss-line__text">${esc(line)}</span>` : '';
    }

    return { WHY_LABELS, KIND_LABELS, setStats, sourceNo, summarizeClass, summaryLine, renderClassHtml, renderBadgeHtml, studentExamLine, renderStudentLineHtml };
});
