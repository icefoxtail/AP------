import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'tmp', 'report-school-exam-print-qa');
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pdftoppmPath = process.env.PDFTOPPM_PATH || 'C:\\Users\\USER\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\poppler\\Library\\bin\\pdftoppm.exe';
const pdftotextPath = process.env.PDFTOTEXT_PATH || path.join(path.dirname(pdftoppmPath), 'pdftotext.exe');
const sourceFiles = ['archive-render.js', 'report-text.js', 'report-center.js', 'report-print.js'];
const sources = new Map(sourceFiles.map(file => [file, fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8')]));
const source = Array.from(sources.values()).join('\n');

function loadContext() {
  const storage = new Map();
  const styles = new Map();
  const context = {
    state: { db: {} },
    window: {},
    document: {
      body: { classList: { add: () => {}, remove: () => {} } },
      head: { appendChild: el => { if (el?.id) styles.set(el.id, el); } },
      getElementById: id => styles.get(id) || null,
      createElement: tag => ({ tagName: tag, id: '', textContent: '' }),
      querySelectorAll: () => []
    },
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key)
    },
    toast: () => {},
    console,
    setTimeout,
    clearTimeout
  };
  context.__styles = styles;
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'apmath/js/report.js' });
  return context;
}

function svgDataUri(label, width = 900, height = 460) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#f8fafc"/>
    <rect x="32" y="32" width="${width - 64}" height="${height - 64}" fill="none" stroke="#334155" stroke-width="5"/>
    <circle cx="${Math.round(width * 0.38)}" cy="${Math.round(height * 0.48)}" r="${Math.round(Math.min(width, height) * 0.22)}" fill="none" stroke="#2563eb" stroke-width="8"/>
    <path d="M${Math.round(width * 0.18)} ${Math.round(height * 0.76)} L${Math.round(width * 0.78)} ${Math.round(height * 0.24)}" stroke="#0f172a" stroke-width="6"/>
    <text x="50%" y="54%" text-anchor="middle" font-family="Arial" font-size="42" font-weight="700" fill="#111827">${label}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const scenarios = [
  { id: '01-middle1-perfect', grade: '중1', name: '김하린', score: 100, wrong: 0, exam: '1학기 중간고사', rates: [], mode: 'basic' },
  { id: '02-middle1-one-wrong', grade: '중1', name: '이지우', score: 92, wrong: 1, exam: '1학기 기말고사', rates: [88], mode: 'basic' },
  { id: '03-middle2-five-wrong', grade: '중2', name: '박민석', score: 78, wrong: 5, exam: '2학기 중간고사', rates: [91, 72, 54, 38, 66], mode: 'basic' },
  { id: '04-middle3-low-many', grade: '중3', name: '최예준', score: 48, wrong: 9, exam: '2학기 기말고사', rates: [42, 36, 28, 55, 61, 44, 35, 39, 31], mode: 'basic' },
  { id: '05-long-question-choices', grade: '중1', name: '서윤', score: 84, wrong: 4, exam: '1학기 중간고사', rates: [80, 62, 48, 35], content: 'long' },
  { id: '06-math-heavy', grade: '중2', name: '오율', score: 76, wrong: 5, exam: '1학기 기말고사', rates: [75, 63, 44, 39, 52], content: 'math' },
  { id: '07-large-image', grade: '중3', name: '윤지안', score: 88, wrong: 3, exam: '2학기 중간고사', rates: [70, 58, 33], content: 'image' },
  { id: '08-table-question', grade: '중2', name: '강서윤', score: 82, wrong: 4, exam: '2학기 기말고사', rates: [86, 68, 48, 41], content: 'table' },
  { id: '09-long-exam-title', grade: '중3', name: '이도윤', score: 91, wrong: 2, exam: '2026학년도 2학기 기말 학교 자체 출제 수학 서술형 포함 종합 평가', rates: [88, 37], content: 'basic' },
  { id: '10-long-copy', grade: '중1', name: '김예준', score: 73, wrong: 6, exam: '1학기 중간고사', rates: [92, 72, 51, 43, 39, 66], mode: 'saved-long' },
  { id: '11-average-same', grade: '중2', name: '하린', score: 80, wrong: 3, exam: '1학기 기말고사', rates: [83, 59, 42], average: 'same' },
  { id: '12-average-missing', grade: '중3', name: '오율', score: 67, wrong: 6, exam: '2학기 중간고사', rates: [78, 63, 52, 46, 40, 34], average: 'missing' }
];

function buildDb(s) {
  const archiveFile = `${s.id}.js`;
  const sessionId = `session-${s.id}`;
  const studentId = `student-${s.id}`;
  const classId = `class-${s.id}`;
  const wrongNos = Array.from({ length: s.wrong }, (_, i) => i + 2);
  const avg = s.average === 'same' ? s.score : Math.max(35, Math.min(96, s.score - 4));
  const classAvg = s.average === 'same' ? s.score : s.average === 'missing' ? null : Math.max(35, Math.min(96, s.score - 2));
  const questionStats = Array.from({ length: 20 }, (_, qIndex) => {
    const qNo = qIndex + 1;
    const wrongIndex = wrongNos.indexOf(qNo);
    const rate = wrongIndex >= 0 ? s.rates[wrongIndex % s.rates.length] : 74 + (qIndex % 5);
    return { questionNo: qNo, takers: 18, wrongCount: Math.round(18 * (100 - rate) / 100), correctRate: rate };
  });
  const db = {
    students: [
      { id: studentId, name: s.name, grade: s.grade },
      { id: `peer-${s.id}`, name: '비교학생', grade: s.grade },
      { id: `peer-class-${s.id}`, name: '반학생', grade: s.grade }
    ],
    classes: [{ id: classId, name: `${s.grade} AP반`, grade: s.grade }],
    class_students: classAvg === null ? [] : [{ class_id: classId, student_id: studentId }, { class_id: classId, student_id: `peer-class-${s.id}` }],
    exam_sessions: [
      { id: sessionId, student_id: studentId, archive_file: archiveFile, exam_title: `${s.grade} ${s.exam}`, exam_date: '2026-07-01', score: s.score, question_count: 20 }
    ],
    wrong_answers: wrongNos.map(question_id => ({ session_id: sessionId, student_id: studentId, question_id })),
    exam_blueprints: Array.from({ length: 20 }, (_, qIndex) => ({
      archive_file: archiveFile,
      question_no: qIndex + 1,
      standard_unit: ['일차방정식', '함수의 활용', '도형', '부등식과 범위'][qIndex % 4],
      difficulty: qIndex % 4 === 0 ? '어려움' : '보통',
      points: 5
    })),
    exam_question_reviews: wrongNos.map((questionNo, i) => ({
      archive_file: archiveFile,
      question_no: String(questionNo),
      review_text: JSON.stringify({
        concept: ['일차방정식', '함수의 활용', '도형', '부등식과 범위'][i % 4],
        tag: i % 2 ? '조건 해석' : '계산과 검산',
        trap: i % 2 ? '문장 조건을 식으로 옮기는 부분' : '계산 후 부호를 확인하는 부분'
      })
    })),
    report_exam_cohort_stats: [{
      session_id: sessionId,
      cohortScope: 'grade_archive_exam',
      gradeExamAverage: avg,
      gradeExamCount: 18,
      questionStats
    }],
    exam_analysis_meta: [],
    exam_student_reports: []
  };
  if (avg !== null) {
    db.exam_sessions.push({ id: `peer-${s.id}-overall`, student_id: `peer-${s.id}`, archive_file: archiveFile, exam_title: `${s.grade} ${s.exam}`, exam_date: '2026-07-01', score: avg, question_count: 20 });
  }
  if (classAvg !== null) {
    db.exam_sessions.push({ id: `peer-${s.id}-class`, student_id: `peer-class-${s.id}`, archive_file: archiveFile, exam_title: `${s.grade} ${s.exam}`, exam_date: '2026-07-01', score: classAvg, question_count: 20 });
  }
  if (s.mode === 'saved-long') {
    db.exam_student_reports.push({
      archive_file: archiveFile,
      student_id: studentId,
      report_type: 'school_exam_detail',
      session_id: sessionId,
      fields_json: JSON.stringify({
        diagnosisText: [
          '긴 핵심 진단입니다. 수업에서 대표 문항을 다시 풀고 조건을 식으로 옮기는 부분을 정리했습니다.',
          '문항별로 계산이 길어지는 지점과 답안 범위를 확인하는 지점을 나누어 보았습니다.',
          '정답률이 높은 문항과 낮은 문항이 함께 있어, 실수 관리와 고난도 접근을 구분해 확인했습니다.',
          '이번 시험 범위에서 반복된 단원은 다음 진도에서도 이어질 수 있어 수업 안에서 계속 살피겠습니다.'
        ].join(' '),
        teacherSummaryText: [
          '긴 담임 총평입니다. 점수보다 어떤 부분에서 시간이 더 들었는지를 기준으로 수업에서 다시 정리했습니다.',
          '조건을 읽고 식을 세우는 첫 단계는 잡혀 있지만, 계산이 길어질 때 중간값 점검이 필요했습니다.',
          '대표 문항은 수업에서 다시 풀며 풀이 방향과 답안 마무리 순서를 분리해 보았습니다.',
          '다음 진도에서는 새 개념을 나가면서 이번 시험에서 확인된 계산 습관도 같이 보겠습니다.'
        ].join(' '),
        planText: [
          '긴 학습 관리 방향입니다. 다음 수업부터는 새 단원 진도로 이어가며 이번 시험에서 확인한 계산 마무리를 함께 점검하겠습니다.',
          '오답 문항은 수업에서 이미 다시 풀어 정리했고, 같은 유형으로 조건 해석을 한 번 더 확인했습니다.',
          '서술형 답안은 식을 세우는 줄과 결론을 쓰는 줄을 나누어 감점 가능성을 줄이겠습니다.',
          '다음 시험 전에는 대표 문항을 다시 보며 단원별로 남은 흔들림을 정리하겠습니다.'
        ].join(' '),
        parentText: [
          '긴 학부모 안내입니다. 오답 정리는 수업에서 마쳤고 다음 지도도 학생이 무리 없이 이어갈 수 있도록 수업 안에서 확인하겠습니다.',
          '이번 리포트에는 대표 문항을 중심으로 어떤 조건에서 시간이 걸렸는지 정리해 두었습니다.',
          '가정에서 추가 부담을 드리기보다 학원 수업 안에서 필요한 유사문항과 답안 마무리를 이어가겠습니다.',
          '다음 단원 진도에서도 이번 시험에서 확인한 계산 습관을 함께 점검하겠습니다.'
        ].join(' ')
      })
    });
  }
  return { db, archiveFile, sessionId, studentId };
}

function archiveDetails(context, s) {
  const image = svgDataUri(`${s.grade} 도형`);
  return {
    ok: true,
    status: 'loaded',
    details: Array.from({ length: 20 }, (_, qIndex) => {
      const questionNo = qIndex + 1;
      let content = `${questionNo}번 문항입니다. 주어진 조건을 식으로 정리하여 값을 구하세요.`;
      let choices = ['① 1', '② 2', '③ 3', '④ 4'];
      if (s.content === 'long') {
        content = '긴 발문 문항입니다. 직사각형의 가로와 세로, 이동한 거리, 합의 범위를 모두 비교하여 식을 세우세요. '.repeat(8);
        choices = [
          '① 처음 조건만 사용하여 계산한 값',
          '② 이동 후 조건과 처음 조건을 함께 비교하여 계산한 값',
          '③ 경계값을 포함하지 않고 계산한 값',
          '④ 단위를 바꾸지 않고 바로 답한 값'
        ];
      } else if (s.content === 'math') {
        content = `수식이 많은 문항입니다. $\\frac{x+1}{2}=\\sqrt{9}$, $x^2-3x+2=0$, $\\begin{cases}x+y=5\\\\2x-y=1\\end{cases}$ 를 이용하세요.`;
      } else if (s.content === 'image') {
        content = `큰 도형 이미지가 포함된 문항입니다.<br><img src="${image}" alt="도형">`;
      } else if (s.content === 'table') {
        content = '표가 포함된 문항입니다.<table><tr><th>구분</th><th>처음</th><th>나중</th></tr><tr><td>길이</td><td>x+2</td><td>2x-1</td></tr><tr><td>넓이</td><td>24</td><td>30</td></tr></table>';
      }
      return context.reportCenterNormalizeQuestionDetail({
        content,
        choices,
        answer: '②',
        solution: '조건을 정리한 뒤 계산합니다.'
      }, questionNo, { questionNo, unit: ['일차방정식', '함수의 활용', '도형', '부등식과 범위'][qIndex % 4], correctRate: s.rates[qIndex % Math.max(1, s.rates.length)] || 76 });
    })
  };
}

function readinessAndLayoutScript() {
  return `<script>
(function(){
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const timeout = (promise, ms) => Promise.race([promise, wait(ms).then(() => 'timeout')]);
  async function ready() {
    const root = document.getElementById('report-print-document-root');
    const state = { mathjax: 'skipped', fonts: 'skipped', images: 'skipped', timeout: false, oversizeCards: 0 };
    if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
      state.mathjax = await timeout(MathJax.startup.promise.then(() => MathJax.typesetPromise ? MathJax.typesetPromise([root]).then(() => 'ready') : 'ready').catch(() => 'error'), 6500);
      state.timeout = state.timeout || state.mathjax === 'timeout';
    }
    if (document.fonts && document.fonts.ready) {
      state.fonts = await timeout(document.fonts.ready.then(() => 'ready').catch(() => 'error'), 3500);
      state.timeout = state.timeout || state.fonts === 'timeout';
    }
    const images = Array.from(root ? root.querySelectorAll('img') : []);
    if (images.length) {
      state.images = await timeout(Promise.all(images.map(img => new Promise(resolve => {
        const finish = status => resolve(status);
        const decode = () => img.decode ? img.decode().then(() => finish('decoded')).catch(() => finish('decode-error')) : finish('loaded');
        if (img.complete) return decode();
        img.addEventListener('load', decode, { once: true });
        img.addEventListener('error', () => finish('error'), { once: true });
      }))).then(() => 'ready').catch(() => 'error'), 4500);
      state.timeout = state.timeout || state.images === 'timeout';
    }
    const printableHeight = Math.round((297 - 24) / 25.4 * 96);
    Array.from(root ? root.querySelectorAll('.aprc-parent-question-card') : []).forEach(card => {
      card.classList.remove('is-oversize');
      if (card.getBoundingClientRect().height > printableHeight) {
        card.classList.add('is-oversize');
        state.oversizeCards += 1;
      }
    });
    if (root) root.dataset.printReadyState = JSON.stringify(state);
    window.__AP_PRINT_READY_STATE = state;
    return state;
  }
  function measure() {
    const root = document.getElementById('report-print-document-root');
    const rootRect = root.getBoundingClientRect();
    const cards = Array.from(document.querySelectorAll('.aprc-school-card-grid > section,.aprc-parent-question-card,.aprc-counsel-section'));
    const tracks = Array.from(document.querySelectorAll('.aprc-scorebar-track,.aprc-school-scorebar-track,.aprc-score-track'));
    const markers = Array.from(document.querySelectorAll('.aprc-scorebar-marker,.aprc-score-marker,.aprc-school-score-marker'));
    const clipped = Array.from(root.querySelectorAll('*')).filter(el => {
      if (el.tagName === 'MJX-ASSISTIVE-MML' || el.closest('mjx-assistive-mml')) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return (el.scrollWidth > el.clientWidth + 2 && style.overflowX === 'hidden') || (el.scrollHeight > el.clientHeight + 2 && style.overflowY === 'hidden');
    });
    const imagesOverflow = Array.from(root.querySelectorAll('img')).filter(img => {
      const parent = img.closest('.aprc-parent-question-card,.aprc-school-detail-document') || root;
      return img.getBoundingClientRect().right > parent.getBoundingClientRect().right + 1;
    });
    const cardOverflow = cards.filter(card => {
      const rect = card.getBoundingClientRect();
      return rect.left < rootRect.left - 1 || rect.right > rootRect.right + 1;
    });
    const markerOverflow = markers.filter(marker => {
      const track = marker.closest('.aprc-scorebar-track,.aprc-school-scorebar-track,.aprc-score-track') || tracks[0];
      if (!track) return false;
      const mr = marker.getBoundingClientRect();
      const tr = track.getBoundingClientRect();
      return mr.left < tr.left - 2 || mr.right > tr.right + 2;
    });
    const result = {
      rootOverflowX: Math.max(0, root.scrollWidth - root.clientWidth),
      cardOverflow: cardOverflow.length,
      imagesOverflow: imagesOverflow.length,
      markerOverflow: markerOverflow.length,
      clippedCandidates: clipped.length,
      clippedDetails: clipped.slice(0, 8).map(el => ({ tag: el.tagName, className: String(el.className || ''), text: (el.textContent || '').trim().slice(0, 80), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight })),
      contentCards: cards.length,
      questionCards: document.querySelectorAll('.aprc-parent-question-card').length,
      oversizeCards: document.querySelectorAll('.aprc-parent-question-card.is-oversize').length
    };
    const node = document.createElement('script');
    node.type = 'application/json';
    node.id = 'ap-layout-result';
    node.textContent = JSON.stringify(result);
    document.body.appendChild(node);
    window.__AP_LAYOUT_RESULT = result;
  }
  ready().then(() => { measure(); setTimeout(() => window.print(), 0); });
})();
</script>`;
}

function htmlShell(shellHtml, styleText = '') {
  return `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#fff;} body{font-family:Pretendard,Arial,sans-serif;} @page{size:A4;margin:12mm;} ${styleText}</style>
<script>window.MathJax={tex:{inlineMath:[['$','$'],['\\\\(','\\\\)']],displayMath:[['$$','$$'],['\\\\[','\\\\]']]},svg:{fontCache:'none'}};</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</head><body>${shellHtml}${readinessAndLayoutScript()}</body></html>`;
}

function run(command, args, options = {}) {
  const isCmd = /\.cmd$/i.test(command);
  const result = isCmd
    ? spawnSync('cmd.exe', ['/c', command, ...args], { encoding: 'utf8', ...options })
    : spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout || `exit ${result.status}`}`);
  return result;
}

function assertPrintCascade(styleText) {
  const searchable = `${sources.get('report-center.js')}\n${sources.get('report-print.js')}`;
  const selectors = [/@page/g, /@media print/g, /\.aprc-school-/g, /\.aprc-qreview-/g, /\.aprc-parent-question-/g, /\.report-print-/g];
  for (const selector of selectors) {
    assert.ok((searchable.match(selector) || []).length > 0, `missing cascade selector scan ${selector}`);
  }
  assert.ok(styleText.includes('.aprc-parent-question-card.is-oversize'), 'oversize card print rule missing');
  assert.ok(styleText.lastIndexOf('.aprc-parent-question-card.is-oversize') > styleText.indexOf('.aprc-parent-question-card'), 'oversize card rule should follow base card rule');
}

function parseLayoutResult(dom) {
  const match = dom.match(/<script type="application\/json" id="ap-layout-result">([^<]+)<\/script>/);
  assert.ok(match, 'layout measurement result missing');
  return JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });
assert.ok(fs.existsSync(chromePath), `Chrome not found at ${chromePath}`);
assert.ok(fs.existsSync(pdftoppmPath), `pdftoppm not found at ${pdftoppmPath}`);

const summary = [];
for (const scenario of scenarios) {
  const context = loadContext();
  const { db, sessionId, studentId } = buildDb(scenario);
  context.state.db = db;
  const details = archiveDetails(context, scenario);
  context.reportCenterInjectPrintViewStyle();
  const styleText = context.__styles.get('report-print-view-style')?.textContent || '';
  assertPrintCascade(styleText);
  const body = context.reportCenterBuildSchoolExamDetailedPrintDocument(studentId, sessionId, { archiveDetails: details });
  const shell = context.reportCenterBuildSchoolExamDetailedPrintShell(body);
  const html = htmlShell(shell, styleText);
  const htmlPath = path.join(outRoot, `${scenario.id}.html`);
  const pdfPath = path.join(outRoot, `${scenario.id}.pdf`);
  const imagePrefix = path.join(outRoot, scenario.id);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const dom = run(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=12000',
    '--dump-dom',
    pathToFileURL(htmlPath).href
  ], { timeout: 30000 }).stdout;
  const layout = parseLayoutResult(dom);
  assert.equal(layout.rootOverflowX, 0, `${scenario.id} root overflow`);
  assert.equal(layout.cardOverflow, 0, `${scenario.id} card overflow`);
  assert.equal(layout.imagesOverflow, 0, `${scenario.id} image overflow`);
  assert.equal(layout.markerOverflow, 0, `${scenario.id} score marker overflow`);
  assert.equal(layout.clippedCandidates, 0, `${scenario.id} clipped candidates ${JSON.stringify(layout.clippedDetails || [])}`);
  assert.ok(layout.contentCards > 0, `${scenario.id} content missing`);
  assert.ok(layout.questionCards <= 5, `${scenario.id} representative card limit broken`);

  run(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=12000',
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href
  ], { timeout: 30000 });
  assert.ok(fs.existsSync(pdfPath), `${scenario.id} PDF missing`);
  assert.ok(fs.statSync(pdfPath).size > 10000, `${scenario.id} PDF too small`);
  if (fs.existsSync(pdftotextPath)) {
    const pdfText = run(pdftotextPath, ['-enc', 'UTF-8', pdfPath, '-'], { timeout: 30000 }).stdout;
    assert.doesNotMatch(pdfText, /리포트 센터|PDF 저장|report-print-toolbar|modal-backdrop/, `${scenario.id} print toolbar leaked into PDF`);
  }

  run(pdftoppmPath, ['-png', '-r', '120', pdfPath, imagePrefix], { timeout: 30000 });
  const pages = fs.readdirSync(outRoot).filter(name => name.startsWith(`${scenario.id}-`) && name.endsWith('.png')).sort();
  assert.ok(pages.length >= 1, `${scenario.id} rendered page images missing`);
  for (const page of pages) {
    assert.ok(fs.statSync(path.join(outRoot, page)).size > 5000, `${scenario.id} blank page candidate ${page}`);
  }
  const bodyText = fs.readFileSync(htmlPath, 'utf8').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  assert.doesNotMatch(bodyText, /나머지 오답 문항 최대 5개|blueprint|review_text|raw data/);
  summary.push({ id: scenario.id, pdf: pdfPath, pages: pages.length, layout });
}

assert.equal(summary.length, 12);
fs.writeFileSync(path.join(outRoot, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(`report school exam print PDF harness passed (${summary.length} scenarios)`);
