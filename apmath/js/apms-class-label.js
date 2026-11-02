/**
 * AP Math OS [js/apms-class-label.js] — 반 이름 표시 공통 규칙 (순수 함수, DOM·state 의존 없음)
 *
 * apmsClassLabel(cls, peers) → { text, teacher }
 *   text    반 이름. cls.grade가 있고 이름에 그 학년 글자가 없을 때만 앞에 "학년 "을 붙인다.
 *           (이름 "심화반"+학년 "고1" → "고1 심화반", 이름 "중3A"+학년 "중3" → "중3A": 학년이 두 번 보이지 않게)
 *   teacher peers(지금 화면에 함께 보이는 반 목록) 안에 같은 text를 가진 다른 반이 있고 담당(teacher_name)이
 *           다를 때만 이 반의 담당 이름. 아니면 ''. 선생님마다 "중3A"가 따로 있을 때 구분하는 용도다.
 * 이유: 탭에 "중3 · 중3A"처럼 학년이 두 번 나오고, 선생님별로 같은 이름의 반이 겹쳐 어느 반인지 알 수 없었다.
 */
function apmsClassLabelText(cls) {
    const name = String(cls?.name ?? '').trim();
    const grade = String(cls?.grade ?? '').trim();
    if (!name) return grade || String(cls?.id ?? '').trim() || '반';
    return grade && !name.includes(grade) ? `${grade} ${name}` : name;
}

function apmsClassLabelTeacher(cls) {
    return String(cls?.teacher_name ?? '').trim();
}

function apmsClassLabel(cls, peers) {
    const text = apmsClassLabelText(cls);
    const teacher = apmsClassLabelTeacher(cls);
    const list = Array.isArray(peers) ? peers : [];
    const clash = !!teacher && list.some(other => other
        && String(other.id ?? '') !== String(cls?.id ?? '')
        && apmsClassLabelText(other) === text
        && apmsClassLabelTeacher(other) !== teacher);
    return { text, teacher: clash ? teacher : '' };
}

// 탭·머리줄에 넣을 HTML: 이름 + (동명 반이면) 작은 보조 글자로 담당. 이름은 이스케이프한다.
function apmsClassLabelHtml(cls, peers) {
    const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const label = apmsClassLabel(cls, peers);
    return esc(label.text) + (label.teacher ? ` <span class="apms-class-label__teacher">${esc(label.teacher)}</span>` : '');
}

if (typeof window !== 'undefined') window.apmsClassLabel = apmsClassLabel;
