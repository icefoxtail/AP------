<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS아카이브 | 수학 기출 통합 시스템</title>
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --navy: #07111f; --navy-2: #0c1a2e; --blue-main: #1d4ed8; --blue-light: #60a5fa;
            --blue-pale: #dbeafe; --green-main: #059669; --gray-muted: #94a3b8; --bg-soft: #f8fafc;
            --card-bg: #ffffff; --card-hover: #f8fbff; --card-active: #eef4ff; --card-border: #e2e8f0;
            --card-border-hover: #93c5fd; --card-border-active: #60a5fa; --text-main: #0f172a;
            --text-sub: #64748b; --text-active-main: #0f172a; --text-active-sub: #475569;
            --badge-bg: #eef4ff; --badge-text: #315ea8; --action-hover-bg: #f3f7ff; --action-hover-text: #1d4ed8;
            --warn-bg: #fff7ed; --warn-border: #fed7aa; --warn-text: #9a3412;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Pretendard', sans-serif; background: var(--bg-soft); color: #1e293b; overflow-x: hidden; }

        header { background: var(--navy); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .top-nav { max-width: 1200px; margin: 0 auto; height: 56px; display: flex; align-items: center; justify-content: center; padding: 0 16px; }
        .grade-nav { display: flex; width: 100%; justify-content: space-between; max-width: 600px; }
        .gtab { font-size: 14px; color: rgba(255,255,255,0.38); font-weight: 600; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: 0.15s; }
        .gtab.active { color: white; background: rgba(255,255,255,0.1); }

        .hero { background: var(--navy); padding: 36px 24px 50px; position: relative; overflow: hidden; }
        .hero-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .hero-title { font-size: clamp(24px, 5.5vw, 30px); font-weight: 800; color: white; line-height: 1.25; }
        .hero-title em { color: var(--blue-light); font-style: normal; }

        .logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .logo-mark { width: 32px; height: 32px; border-radius: 8px; background: var(--blue-main); display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3.5px; padding: 6px; }
        .logo-mark div { background: white; border-radius: 1px; }
        .logo-mark div:last-child { background: var(--blue-light); }
        .logo-name { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .logo-name em { color: var(--blue-light); font-style: normal; }

        .filter-band { background: white; border-bottom: 1px solid #e2e8f0; position: sticky; top: 56px; z-index: 900; }
        .filter-inner { max-width: 1200px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; gap: 10px; }
        .fb-search { flex: 1; position: relative; }
        .fb-search input { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 14px 9px 36px; font-size: 13px; outline: none; }
        .fb-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 13px; }
        .fb-sel { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .fb-mixer { background: var(--blue-main); color: white; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }

        .sec-block { padding: 48px 24px; width: 100vw; position: relative; left: 50%; transform: translateX(-50%); }
        .sec-block > * { max-width: 1152px; margin: 0 auto; }
        .sec-block.dark { background: var(--navy-2); color: white; }
        .sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .sec-title { font-size: 18px; font-weight: 800; color: #1e293b; }
        .sec-block.dark .sec-title { color: white; }
        .sec-line { flex: 1; height: 1px; background: #e2e8f0; }
        .sec-block.dark .sec-line { background: rgba(255,255,255,0.1); }

        .card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .exam-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: 0.18s; cursor: pointer; }
        .exam-card:hover { transform: translateY(-3px); border-color: var(--card-border-hover); box-shadow: 0 12px 26px rgba(37, 99, 235, 0.12); }
        .exam-card.is-active { background: var(--card-active); border-color: var(--card-border-active); box-shadow: 0 10px 24px rgba(96, 165, 250, 0.16); }
        .card-top { display: none; }
        .card-body { padding: 20px; flex: 1; }
        .card-grade-label { font-size: 10px; font-weight: 800; color: var(--text-sub); margin-bottom: 6px; }
        .exam-card.is-active .card-grade-label { color: var(--text-active-sub); }

        .card-main-title { font-size: 15px; font-weight: 800; color: var(--text-main); display: block; line-height: 1.45; margin-bottom: 8px; white-space: normal; word-break: break-all; }
        .exam-card.is-active .card-main-title { color: var(--text-active-main); }
        .card-sub-title { font-size: 12px; font-weight: 600; color: var(--text-sub); display: block; margin-top: 4px; line-height: 1.4; }
        .exam-card.is-active .card-sub-title { color: var(--text-active-sub); }

        .card-file-name {
            display: block;
            margin-top: 10px;
            font-size: 11px;
            line-height: 1.45;
            color: var(--text-sub);
            word-break: break-all;
            padding: 8px 10px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
        }
        .exam-card.is-active .card-file-name {
            color: #475569;
            background: #f8fbff;
            border-color: #bfdbfe;
        }

        .badge-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
        .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: var(--badge-bg); color: var(--badge-text); border: 1px solid #d8e5fb; }
        .exam-card.is-active .badge { background: #e8f1ff; color: #315ea8; border-color: #cfe0fb; }

        .card-actions { border-top: 1px solid var(--card-border); display: flex; background: #fff; }
        .exam-card.is-active .card-actions { background: #f8fbff; border-top-color: #dbeafe; }
        .action-btn { flex: 1; padding: 12px 0; text-align: center; font-size: 12px; font-weight: 800; color: var(--text-sub); transition: 0.15s; }
        .action-btn:hover { background: var(--action-hover-bg); color: var(--action-hover-text); }
        .exam-card.is-active .action-btn { color: #475569; }
        .exam-card.is-active .action-btn:hover { background: #e8f0ff; color: #1d4ed8; }

        .empty-state {
            max-width: 1152px;
            margin: 32px auto 0;
            padding: 18px 20px;
            border: 1px solid var(--warn-border);
            background: var(--warn-bg);
            color: var(--warn-text);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
        }

        .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 2000; align-items: center; justify-content: center; }
        .modal-overlay.open { display: flex; }
        .modal-box { background: white; border-radius: 20px; padding: 36px 40px; width: 360px; text-align: center; }
        .qpp-btns { display: flex; gap: 14px; margin-bottom: 20px; }
        .qpp-opt { flex: 1; padding: 20px 0; border: 2px solid #e2e8f0; border-radius: 14px; cursor: pointer; font-size: 28px; font-weight: 800; }

        @media (max-width: 768px) {
            .card-grid { grid-template-columns: 1fr; }
            .hero-inner { flex-direction: column; text-align: center; }
            .logo { margin-top: 20px; }
            .filter-inner { flex-wrap: wrap; }
            .fb-search { min-width: 100%; }
        }
    </style>
</head>
<body>
<div class="modal-overlay" id="qppModal">
    <div class="modal-box">
        <div style="font-size:18px; font-weight:800; margin-bottom:6px;">시험지 출력 형식</div>
        <div class="qpp-btns">
            <div class="qpp-opt" onclick="confirmQpp(4)">4</div>
            <div class="qpp-opt" onclick="confirmQpp(6)">6</div>
        </div>
        <button onclick="closeModal()" style="border:none; background:none; color:var(--gray-muted); cursor:pointer;">취소</button>
    </div>
</div>

<header>
    <div class="top-nav">
        <nav class="grade-nav" id="gradeBar">
            <span class="gtab" data-grade="고3">고3</span>
            <span class="gtab" data-grade="고2">고2</span>
            <span class="gtab" data-grade="고1">고1</span>
            <span class="gtab" data-grade="중3">중3</span>
            <span class="gtab" data-grade="중2">중2</span>
            <span class="gtab" data-grade="중1">중1</span>
            <span class="gtab active" data-grade="">전체</span>
        </nav>
    </div>
</header>

<div class="hero">
    <div class="hero-inner">
        <div class="hero-left">
            <div class="hero-title">학교별 기출 & 유형<br><em>통합 출제 시스템</em></div>
        </div>
        <div class="logo" onclick="resetView()">
            <div class="logo-mark"><div></div><div></div><div></div><div></div></div>
            <span class="logo-name"><em>JS</em>아카이브</span>
        </div>
    </div>
</div>

<div class="filter-band">
    <div class="filter-inner">
        <div class="fb-search">
            <i class="fa-solid fa-magnifying-glass fb-search-icon"></i>
            <input type="text" id="searchInput" placeholder="학교명, 과목, 파일명 검색…">
        </div>
        <select class="fb-sel" id="yearFilter">
            <option value="">전체 연도</option>
        </select>
        <select class="fb-sel" id="contentTypeFilter">
            <option value="">전체 분류</option>
            <option value="기출">기출</option>
            <option value="유형">유형</option>
            <option value="단원평가">단원평가</option>
            <option value="쪽지">쪽지</option>
        </select>
        <button class="fb-mixer" onclick="location.href='mixer.html'">믹서 출제</button>
    </div>
</div>

<div class="content-wrap">
    <div id="featured-section"></div>

    <div id="full-section" style="display:none; padding:48px 24px;">
        <div style="max-width:1152px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; margin-bottom:24px; align-items:center;">
                <span style="font-size:18px; font-weight:800;" id="listTitle">전체 자료</span>
                <span id="listMeta" style="font-size:12px; color:#94a3b8;"></span>
            </div>
            <div id="full-grid" class="card-grid"></div>
        </div>
    </div>
</div>

<script>
let engineDB = { exams: [] };
let selectedGrade = '';

function compactText(value) {
    return String(value || '').replace(/\s+/g, '').trim();
}

function normalizeContentType(value) {
    const raw = String(value || '').trim();
    const compact = compactText(raw);

    if (!compact) return '';
    if (compact.includes('단원평가')) return '단원평가';
    if (compact.includes('기출')) return '기출';
    if (compact.includes('유형')) return '유형';
    if (compact.includes('쪽지')) return '쪽지';

    return raw;
}

function normalizeGrade(value) {
    const compact = compactText(value);

    if (compact === '고1' || compact === '고등1' || compact === '고등학교1학년') return '고1';
    if (compact === '고2' || compact === '고등2' || compact === '고등학교2학년') return '고2';
    if (compact === '고3' || compact === '고등3' || compact === '고등학교3학년') return '고3';
    if (compact === '중1' || compact === '중등1' || compact === '중학교1학년') return '중1';
    if (compact === '중2' || compact === '중등2' || compact === '중학교2학년') return '중2';
    if (compact === '중3' || compact === '중등3' || compact === '중학교3학년') return '중3';

    return String(value || '').trim();
}

function normalizeSemester(value) {
    const compact = compactText(value);
    if (!compact) return '';
    if (compact === '1' || compact === '1학기') return '1';
    if (compact === '2' || compact === '2학기') return '2';
    return String(value || '').trim();
}

function normalizeExamType(value) {
    const compact = compactText(value).toLowerCase();
    if (!compact) return '';
    if (compact === 'mid' || compact === 'middle' || compact === '중간' || compact === '중간고사') return 'mid';
    if (compact === 'final' || compact === '기말' || compact === '기말고사') return 'final';
    return String(value || '').trim();
}

function normalizeYear(value) {
    if (value === '' || value == null) return '';
    const s = String(value).replace(/[^\d]/g, '');
    if (!s) return '';
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : '';
}

function normalizeExamMeta(ex) {
    const normalized = { ...(ex || {}) };
    normalized.file = String(ex?.file || '').trim();
    normalized.school = String(ex?.school || '').trim();
    normalized.topic = String(ex?.topic || '').trim();
    normalized.subject = String(ex?.subject || '').trim();
    normalized.grade = normalizeGrade(ex?.grade);
    normalized.year = normalizeYear(ex?.year);
    normalized.semester = normalizeSemester(ex?.semester);
    normalized.examType = normalizeExamType(ex?.examType);
    normalized.contentType = normalizeContentType(ex?.contentType);
    return normalized;
}

function normalizedExams() {
    return Array.isArray(engineDB.exams) ? engineDB.exams.map(normalizeExamMeta).filter(e => e.file) : [];
}

function examTypeLabel(examType) {
    if (examType === 'mid') return '중간';
    if (examType === 'final') return '기말';
    return examType || '';
}

async function init() {
    await new Promise(res => {
        const s = document.createElement('script');
        s.src = 'db.js?v=' + Date.now();
        s.onload = () => {
            engineDB = window.mainDB || { exams: [] };
            res();
        };
        s.onerror = () => {
            engineDB = { exams: [] };
            res();
        };
        document.body.appendChild(s);
    });

    populateYearFilter();
    initGradeBar();

    document.getElementById('searchInput').addEventListener('input', onFilterChange);
    document.getElementById('yearFilter').addEventListener('change', onFilterChange);
    document.getElementById('contentTypeFilter').addEventListener('change', onFilterChange);

    renderFeatured();
}

function populateYearFilter() {
    const years = [...new Set(normalizedExams().map(e => e.year))].filter(Boolean).sort((a, b) => b - a);
    const sel = document.getElementById('yearFilter');
    sel.innerHTML = '<option value="">전체 연도</option>';

    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = `${y}년`;
        sel.appendChild(opt);
    });
}

function initGradeBar() {
    document.querySelectorAll('.gtab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedGrade = tab.dataset.grade;
            onFilterChange();
        };
    });
}

function sortExams(list) {
    const gradeOrder = { "고3":0, "고2":1, "고1":2, "중3":3, "중2":4, "중1":5 };

    return [...list].sort((a, b) => {
        const yA = parseInt(a.year) || 0;
        const yB = parseInt(b.year) || 0;
        if (yB !== yA) return yB - yA;

        const gA = gradeOrder[a.grade] ?? 99;
        const gB = gradeOrder[b.grade] ?? 99;
        if (gA !== gB) return gA - gB;

        const sA = a.school || '';
        const sB = b.school || '';
        if (sA !== sB) return sA.localeCompare(sB);

        return (a.file || '').localeCompare(b.file || '');
    });
}

function onFilterChange() {
    const keyword = document.getElementById('searchInput').value.trim();
    const year = document.getElementById('yearFilter').value;
    const type = document.getElementById('contentTypeFilter').value;

    if (keyword || year || type || selectedGrade) {
        document.getElementById('featured-section').style.display = 'none';
        document.getElementById('full-section').style.display = 'block';
        renderFullList();
    } else {
        document.getElementById('featured-section').style.display = 'block';
        document.getElementById('full-section').style.display = 'none';
        renderFeatured();
    }
}

function showEmptyState(message) {
    const section = document.getElementById('featured-section');
    section.innerHTML = `<div class="empty-state">${message}</div>`;
}

function renderFeatured() {
    const section = document.getElementById('featured-section');
    section.innerHTML = '';

    const all = normalizedExams();
    if (!all.length) {
        showEmptyState('db.js를 불러오지 못했거나 등록된 자료가 없습니다.');
        return;
    }

    const featuredGrades = ['고2', '고1', '중3', '중2', '중1'];

    const latestByGrade = featuredGrades
        .map(grade => {
            const items = sortExams(
                all.filter(e => e.grade === grade && e.contentType === '기출')
            );
            return items[0] || null;
        })
        .filter(Boolean);

    if (latestByGrade.length) {
        const block = document.createElement('div');
        block.className = 'sec-block dark';
        block.innerHTML = `
            <div class="sec-header">
                <span class="sec-title">학년별 대표 기출</span>
                <div class="sec-line"></div>
            </div>
            <div class="card-grid"></div>
        `;

        const grid = block.querySelector('.card-grid');
        latestByGrade.forEach(item => grid.appendChild(buildCard(item)));
        section.appendChild(block);
        return;
    }

    const fallbackItems = sortExams(all).slice(0, 8);

    const block = document.createElement('div');
    block.className = 'sec-block dark';
    block.innerHTML = `
        <div class="sec-header">
            <span class="sec-title">최신 등록 자료</span>
            <div class="sec-line"></div>
        </div>
        <div class="card-grid"></div>
    `;

    const grid = block.querySelector('.card-grid');
    fallbackItems.forEach(item => grid.appendChild(buildCard(item)));
    section.appendChild(block);
}

function renderFullList() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    const year = document.getElementById('yearFilter').value;
    const type = compactText(document.getElementById('contentTypeFilter').value);

    const container = document.getElementById('full-grid');
    container.innerHTML = '';

    let filtered = normalizedExams().filter(ex => {
        const searchBase = [
            ex.school || '',
            ex.subject || '',
            ex.topic || '',
            ex.file || '',
            ex.contentType || ''
        ].join(' ').toLowerCase();

        const matchK = !keyword || searchBase.includes(keyword);
        const matchG = !selectedGrade || ex.grade === selectedGrade;
        const matchY = !year || String(ex.year) === String(year);
        const itemType = compactText(ex.contentType || '');
        const matchT = !type || itemType === type;

        return matchK && matchG && matchY && matchT;
    });

    filtered = sortExams(filtered);

    document.getElementById('listMeta').innerText = `${filtered.length}개 자료`;

    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state" style="grid-column:1/-1; margin:0;">조건에 맞는 자료가 없습니다.</div>`;
        return;
    }

    filtered.forEach(ex => container.appendChild(buildCard(ex)));
}

function buildCard(ex) {
    const card = document.createElement('div');
    card.className = 'exam-card';

    card.onclick = () => {
        document.querySelectorAll('.exam-card').forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
    };

    const fileName = (ex.file || '파일정보없음').replace(/\.js$/i, '');
    const semester = ex.semester ? `${ex.semester}학기` : '';
    const examName = examTypeLabel(ex.examType);
    const info = `${ex.year || ''} ${semester} ${examName}`.trim();

    let line1 = '';
    let line2 = '';

    if ((ex.contentType || '기출') === '기출') {
        line1 = ex.school || ex.topic || fileName;
        line2 = (ex.subject ? ex.subject + ' ' : '') + info;
        if (!line2.trim()) line2 = info || '상세 정보 없음';
    } else {
        line1 = ex.topic || ex.school || fileName;
        line2 = ex.subject || info || '상세 정보 없음';
    }

    if (line1 === line2) line2 = info || '상세 정보 없음';

    const subjectBadge = (ex.subject && String(ex.grade || '').startsWith('고'))
        ? `<span class="badge" style="background:#f2f7ff; color:#2f5b9e; border-color:#d6e4fb;">${ex.subject}</span>`
        : '';

    card.innerHTML = `
        <div class="card-body">
            <div class="card-grade-label">${ex.grade || ''}</div>
            <div class="card-main-title">
                ${line1}
                <span class="card-sub-title">${line2}</span>
            </div>
            <div class="card-file-name">${fileName}</div>
            <div class="badge-row">
                <span class="badge">${ex.contentType || '기출'}</span>
                ${subjectBadge}
            </div>
        </div>
        <div class="card-actions">
            <div class="action-btn" data-action="exam">시험</div>
            <div class="action-btn" data-action="sol">해설</div>
            <div class="action-btn" data-action="ans">정답</div>
        </div>
    `;

    card.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            openEngine(ex.file, btn.dataset.action);
        };
    });

    return card;
}

let _pendingFile, _pendingAction;

function openEngine(file, action) {
    if (action === 'exam') {
        _pendingFile = file;
        _pendingAction = action;
        document.getElementById('qppModal').classList.add('open');
    } else {
        const item = normalizedExams().find(e => e.file === file);
        if (item) goEngine(item, action, 4);
    }
}

function confirmQpp(qpp) {
    closeModal();
    const item = normalizedExams().find(e => e.file === _pendingFile);
    if (item) goEngine(item, _pendingAction, qpp);
}

function closeModal() {
    document.getElementById('qppModal').classList.remove('open');
}

function goEngine(item, action, qpp) {
    const baseTitle = item.school || item.topic || String(item.file || '').replace('.js', '');
    const title = `${baseTitle} ${item.subject || ''}`.trim();

    window.open(
        `engine.html?mode=${action}&qpp=${qpp}&data=${encodeURIComponent('exams/' + item.file)}&title=${encodeURIComponent(title)}`,
        '_blank'
    );
}

function resetView() {
    location.reload();
}

window.onload = init;
</script>
</body>
</html>