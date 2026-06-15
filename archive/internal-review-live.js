/* ================================================================
   JS아카이브 내부 검수 엔진  —  internal-review-engine.js
   Chrome / Edge (localhost) 전용. File System Access API 사용.
   eval 금지 — new Function('window', source)(sandbox) 방식 파싱.
   ================================================================ */

'use strict';

/* ================================================================
   STATE
================================================================ */
const state = {
  archiveDirHandle: null,     // FileSystemDirectoryHandle (archive 폴더)
  currentFileHandle: null,    // FileSystemFileHandle (현재 JS)
  currentFilePath: '',        // archive/ 기준 상대경로 (예: exams/중1/foo.js)
  currentFileName: '',
  fileEntries: [],            // [{path, handle}]
  currentSource: '',
  examTitle: '',
  originalBank: [],           // 되돌리기용 deep clone
  currentBank: [],
  selectedId: null,           // 선택된 문항의 id (인덱스 아님)
  modifiedIds: new Set(),
  removedItems: [],           // {item, originalIndex} 보관
  activeFilter: 'all',
  gradeFilter: '',            // '' | '중1' | '중2' | '중3' | '고1' | '고2'
  examTypeFilter: '',         // '' | '중간' | '기말'
  searchQuery: '',
  engineMode: 'exam',         // exam / sol / ans
  qpp: 4,
  canDirectSave: false,
  isSaving: false,
  imageMap: new Map(),        // normalizedPath → FileSystemFileHandle
  fileSearch: '',
  liveOutputTimer: null,
  persistTimer: null,
};

/* ================================================================
   상수
================================================================ */
const CIRCLE_NUMS = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];

const VISUAL_KEYWORDS = [
  '아래 그림','다음 그림','오른쪽 그림','왼쪽 그림','위 그림',
  '그림과 같이','그림을 보고','수직선','좌표평면','그래프',
  '막대그래프','원그래프','꺾은선그래프','전개도','입체도형',
  '정육면체','직육면체','원기둥','원뿔','각기둥','각뿔',
  '평면도형','도형에서','어두운 부분','색칠한 부분',
];

const META_PHRASES = [
  '원본 매칭','원본 오차','변형 최종','가까운 규칙','메커니즘',
  '도출됩니다','또는 변형',
];

const BROKEN_CHAR_PATTERNS = ['ï','»¼','â€','Ã','Â','ã','½','¤','¹','£','□','◇','☐','☒','♡','♥'];

const CONTENT_RESIDUES = ['이미지 설명','그림 설명','원본 그림','예시 규칙 배열'];

const FIELD_ORDER = [
  'id','level','category','originalCategory','standardCourse',
  'standardUnitKey','standardUnit','standardUnitOrder',
  'subUnitKey','subUnit','conceptClusterKey',
  'questionType','layoutTag','tags','wide',
  'content','choices','answer','solution','image','imageSize',
];

// 검수 필터 (접기/펼치기 영역)
const FILTERS = [
  { key: 'all',        label: '전체' },
  { key: 'warning',    label: '경고 있음', cls: 'warn' },
  { key: 'modified',   label: '수정됨' },
  { key: 'removed',    label: '제거됨' },
  { key: 'recdiff',    label: '난이도 확인', cls: 'warn' },
  { key: 'imgneeded',  label: '이미지 필요' },
  { key: 'broken',     label: '깨진 문자', cls: 'warn' },
  { key: 'meta',       label: '메타 문구', cls: 'warn' },
  { key: 'noanswer',   label: 'answer 없음', cls: 'warn' },
  { key: 'nosolution', label: 'solution 없음' },
  { key: '하',          label: '하' },
  { key: '중',          label: '중' },
  { key: '상',          label: '상' },
  { key: '객관식',      label: '객관식' },
  { key: '단답형',      label: '단답형' },
];

// 학년 고정 필터
const GRADE_FILTERS = ['중1','중2','중3','고1','고2'];
// 시험 유형 고정 필터
const EXAM_TYPE_FILTERS = ['중간','기말'];

/* ================================================================
   유틸
================================================================ */
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function showToast(msg, duration) {
  duration = duration || 2500;
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.style.display = 'none'; }, duration);
}

function showError(msg) {
  const el = document.getElementById('error-box');
  el.textContent = msg;
  el.style.display = 'block';
  console.error('[검수엔진]', msg);
}

function clearError() {
  const el = document.getElementById('error-box');
  el.style.display = 'none';
  el.textContent = '';
}

function formatDate(d) {
  d = d || new Date();
  const p = function(n) { return String(n).padStart(2, '0'); };
  return String(d.getFullYear()) + p(d.getMonth() + 1) + p(d.getDate())
    + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

function downloadText(text, filename) {
  // application/octet-stream: Chrome이 JS로 인식해 navigate하는 것을 방지
  const blob = new Blob([text], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  a.style.top = '-9999px';
  document.body.appendChild(a);
  a.click();
  // 즉시 제거하지 않고 약간 지연 (브라우저가 다운로드 큐에 등록할 시간 확보)
  setTimeout(function() {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

/* ================================================================
   학년 탐지
================================================================ */
function getGradeFromItem(item) {
  const c = String(item.standardCourse || '').trim();
  if (/중\s*1/.test(c))                              return '중1';
  if (/중\s*2/.test(c))                              return '중2';
  if (/중\s*3/.test(c))                              return '중3';
  if (/공통수학|수학\(상\)|수학\(하\)|고1/.test(c)) return '고1';
  if (/수학[IⅠⅡ]|확률|대수|미적분|고2/.test(c))   return '고2';
  return null;
}

// 파일 경로 기반 학년 탐지
function getGradeFromPath(path) {
  const p = path.toLowerCase();
  if (/\/m1\/|중1/.test(p))  return '중1';
  if (/\/m2\/|중2/.test(p))  return '중2';
  if (/\/m3\/|중3/.test(p))  return '중3';
  if (/\/h1\/|고1/.test(p))  return '고1';
  if (/\/h2\/|고2/.test(p))  return '고2';
  return null;
}

// 파일 경로 기반 시험유형 탐지
function getExamTypeFromPath(path) {
  const p = path.toLowerCase();
  if (/중간|1mid|2mid|_mid_/.test(p))      return '중간';
  if (/기말|1final|2final|_final_/.test(p)) return '기말';
  return null;
}

/* ================================================================
   경고 탐지
================================================================ */
function detectWarnings(q) {
  const warnings = [];
  if (!['하','중','상'].includes(q.level)) warnings.push('level이 하/중/상이 아님');
  if (!q.tags || q.tags.length === 0)       warnings.push('tags 없음');
  if (!q.answer || String(q.answer).trim() === '') warnings.push('answer 없음');
  if (!q.solution || String(q.solution).trim() === '') warnings.push('solution 없음');

  const isObj = q.questionType && (q.questionType.includes('객관식') || q.questionType === 'OX');
  const choices = Array.isArray(q.choices) ? q.choices : [];
  if (isObj && choices.length === 0)        warnings.push('객관식인데 choices 없음');
  if (choices.length > 0 && q.questionType === '단답형') warnings.push('choices 있는데 단답형');

  const imgPath = normalizeImagePath(q.image || '');
  if (imgPath) {
    if (state.imageMap.size > 0 && !state.imageMap.has(imgPath)) {
      warnings.push('image 경로 있음 + 파일 없음');
    } else if (state.imageMap.size === 0) {
      warnings.push('image 경로 있음 (실제 파일 미확인)');
    }
  }

  const contentStr = String(q.content || '');
  const hasVisualKw = VISUAL_KEYWORDS.some(function(kw) { return contentStr.includes(kw); });
  if (hasVisualKw && !imgPath) warnings.push('시각자료 키워드 있음 + image 없음');

  const sol = String(q.solution || '');
  META_PHRASES.forEach(function(p) { if (sol.includes(p)) warnings.push('금지 메타 문구: "' + p + '"'); });

  const allText = contentStr + ' ' + sol + ' ' + String(q.answer || '');
  BROKEN_CHAR_PATTERNS.forEach(function(c) { if (allText.includes(c)) warnings.push('깨진 문자 후보'); });

  const ans = String(q.answer || '');
  if (ans.includes('또는') || ans.includes('변형') || ans.includes('원본'))
    warnings.push('answer에 금지 단어 포함');

  CONTENT_RESIDUES.forEach(function(p) { if (contentStr.includes(p)) warnings.push('내용 잔재: "' + p + '"'); });

  // deduplicate
  return warnings.filter(function(v, i, a) { return a.indexOf(v) === i; });
}

/* ================================================================
   난이도 추천
================================================================ */
function recommendLevel(q) {
  const content = String(q.content || '') + ' ' + String(q.solution || '');
  const choices = Array.isArray(q.choices) ? q.choices : [];

  const upperPats = ['경우를 나누','경우로 나누','역으로','최대','최솟값','최댓값',
    '자연수 조건','정수 조건','자연수인','모든 경우','동시에 만족','고난도','복합','여러 조건'];
  if (upperPats.some(function(p) { return content.includes(p); })) return '상';

  const lowerPats = ['계산하여라','계산하시오','구하여라','다음 중 옳은','단순 계산',
    '용어를 쓰시오','정의','이름을 쓰시오'];
  const shortContent = content.length < 60;
  const shortChoices = choices.length > 0 && choices.every(function(c) { return String(c).length <= 8; });
  if (lowerPats.some(function(p) { return content.includes(p); }) || (shortContent && shortChoices)) return '하';

  const midPats = ['식을 세워','정리하면','조건을 이용','두 조건','표를 보고',
    '수직선 위','좌표를 구','몇 가지','확률을 구'];
  if (midPats.some(function(p) { return content.includes(p); })) return '중';

  if (content.length < 80) return '하';
  return '중';
}

/* ================================================================
   이미지 경로 정규화
================================================================ */
function normalizeImagePath(imgPath) {
  if (!imgPath) return '';
  return imgPath
    .replace(/^archive\//, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

async function getImageBlobUrl(imgPath) {
  const key = normalizeImagePath(imgPath);
  const handle = state.imageMap.get(key);
  if (!handle) return null;
  try {
    const file = await handle.getFile();
    return URL.createObjectURL(file);
  } catch (e) { return null; }
}

/* ================================================================
   출력 탭 갱신 (state.currentBank 기준 라이브 렌더)
================================================================ */
function refreshEnginePreviewFrameOnly() {
  scheduleLiveOutputRender(true, 0);
}

function updateUnsavedBadge() {
  const badge = document.getElementById('unsaved-badge');
  if (!badge) return;
  badge.style.display = hasUnsavedChanges() ? 'block' : 'none';
}

function hasUnsavedChanges() {
  return state.modifiedIds.size > 0 || state.removedItems.length > 0;
}

function confirmDiscardUnsaved(message) {
  if (!hasUnsavedChanges()) return true;
  return confirm(message || '저장하지 않은 수정이 있습니다. 계속 진행하면 현재 수정 내용이 유지되지 않을 수 있습니다. 계속할까요?');
}

/* ================================================================
   JS 파싱
================================================================ */
function parseSource(source, fileName) {
  const sandbox = { window: {} };
  const fn = new Function('window', source);
  fn(sandbox.window);

  const title = sandbox.window.examTitle || sandbox.window.title || fileName.replace(/\.js$/, '');
  let bank = null;

  if (Array.isArray(sandbox.window.questionBank)) {
    bank = sandbox.window.questionBank;
  } else if (sandbox.window.questionBank && Array.isArray(sandbox.window.questionBank.questions)) {
    bank = sandbox.window.questionBank.questions;
  } else if (sandbox.window.questionBank && Array.isArray(sandbox.window.questionBank.problems)) {
    bank = sandbox.window.questionBank.problems;
  } else {
    throw new Error('questionBank 배열을 찾을 수 없습니다.');
  }

  return { title: title, bank: bank };
}

/* ================================================================
   JS 직렬화
================================================================ */
function serializeValue(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const items = v.map(function(item) { return '    ' + serializeValue(item); });
    return '[\n' + items.join(',\n') + '\n  ]';
  }
  return JSON.stringify(v, null, 2);
}

function serializeQuestion(q) {
  const lines = [];
  const written = new Set();
  FIELD_ORDER.forEach(function(key) {
    if (!(key in q)) return;
    written.add(key);
    lines.push('    ' + key + ': ' + serializeValue(q[key]));
  });
  Object.keys(q).forEach(function(key) {
    if (written.has(key)) return;
    lines.push('    ' + key + ': ' + serializeValue(q[key]));
  });
  return '  {\n' + lines.join(',\n') + '\n  }';
}

function serializeQuestionBank(examTitle, bank) {
  const title = JSON.stringify(examTitle);
  const questions = bank.map(function(q) { return serializeQuestion(q); }).join(',\n');
  return 'window.examTitle = ' + title + ';\n\nwindow.questionBank = [\n' + questions + '\n];\n';
}

/* ================================================================
   commitEditorDraft — 오른쪽 패널 값 → currentBank 반영
================================================================ */
function stableQuestionString(q) {
  return JSON.stringify(q || {});
}

function markQuestionModified(q) {
  if (!q) return;
  const orig = state.originalBank.find(function(o) { return String(o.id) === String(q.id); });
  if (!orig || stableQuestionString(orig) !== stableQuestionString(q)) {
    state.modifiedIds.add(q.id);
  } else {
    state.modifiedIds.delete(q.id);
  }
}

function originalHasField(q, key) {
  const orig = state.originalBank.find(function(o) { return String(o.id) === String(q.id); });
  return !!orig && Object.prototype.hasOwnProperty.call(orig, key);
}

function setDraftStringField(q, key, value) {
  if (value === '' && !originalHasField(q, key)) delete q[key];
  else q[key] = value;
}

function setDraftArrayField(q, key, value) {
  if (value.length === 0 && !originalHasField(q, key)) delete q[key];
  else q[key] = value;
}

function commitEditorDraft() {
  if (state.selectedId === null) return;
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) return;

  setDraftStringField(q, 'level', document.getElementById('e-level').value);
  setDraftStringField(q, 'questionType', document.getElementById('e-qtype').value);
  setDraftStringField(q, 'layoutTag', document.getElementById('e-layout').value.trim());
  setDraftArrayField(q, 'tags', document.getElementById('e-tags').value
                    .split(/[,\n]/).map(function(t) { return t.trim(); }).filter(Boolean));
  setDraftStringField(q, 'content', document.getElementById('e-content').value);
  setDraftArrayField(q, 'choices', document.getElementById('e-choices').value
                    .split('\n').map(function(c) { return c.trim(); }).filter(Boolean));
  setDraftStringField(q, 'answer', document.getElementById('e-answer').value);
  setDraftStringField(q, 'solution', document.getElementById('e-solution').value);
  setDraftStringField(q, 'image', document.getElementById('e-image').value.trim());
  const imgSize = document.getElementById('e-imagesize').value;
  if (imgSize) {
    q.imageSize = imgSize;
  } else {
    delete q.imageSize;
  }

  markQuestionModified(q);
}

/* ================================================================
   문항 선택
================================================================ */
function selectQuestion(id) {
  // 1. 이전 draft 저장
  commitEditorDraft();
  // 2. 선택 설정
  state.selectedId = id;
  // 3. currentBank에서 찾기
  const q = state.currentBank.find(function(item) { return String(item.id) === String(id); });
  if (!q) { closeEditPanel(); return; }
  // 4. 오른쪽 패널 채우기
  openEditPanel(q);
  // 5. 카드/행 강조 갱신
  highlightSelected();
  scheduleLiveOutputRender(true, 0);
  schedulePersistSessionState();
}

function highlightSelected() {
  // 카드
  document.querySelectorAll('.q-card').forEach(function(card) {
    card.classList.toggle('selected', card.dataset.qid === String(state.selectedId));
  });
  // 검수표 행
  document.querySelectorAll('#review-table tbody tr').forEach(function(tr) {
    tr.classList.toggle('row-selected', tr.dataset.qid === String(state.selectedId));
  });
  document.querySelectorAll('.ir-live-question, .ir-live-answer-table tr').forEach(function(el) {
    el.classList.toggle('selected', el.dataset.qid === String(state.selectedId));
  });
}

/* ================================================================
   오른쪽 수정 패널
================================================================ */
function closeEditPanel() {
  document.getElementById('right-empty').style.display = 'block';
  document.getElementById('edit-form').style.display = 'none';
}

function openEditPanel(q) {
  document.getElementById('right-empty').style.display = 'none';
  document.getElementById('edit-form').style.display = 'flex';

  const recLevel = recommendLevel(q);
  const warnings = detectWarnings(q);
  const displayNum = state.currentBank.findIndex(function(item) { return item.id === q.id; }) + 1;

  document.getElementById('edit-qnum').textContent = displayNum + '번';
  document.getElementById('edit-qid').textContent  = 'id: ' + q.id;

  const warnList = document.getElementById('edit-warnings-list');
  warnList.innerHTML = warnings.map(function(w) {
    return '<div class="edit-warn-item">⚠ ' + w + '</div>';
  }).join('');

  const recDiv = document.getElementById('edit-rec-level');
  if (recLevel !== q.level) {
    recDiv.innerHTML = '<span class="badge badge-rec-diff">추천 난이도: ' + recLevel + ' (현재: ' + (q.level || '?') + ')</span>';
  } else {
    recDiv.innerHTML = '<span style="font-size:11px;color:#888">추천 난이도: ' + recLevel + ' (일치)</span>';
  }

  document.getElementById('e-level').value   = q.level || '';
  document.getElementById('e-qtype').value   = q.questionType || '';
  document.getElementById('e-layout').value  = q.layoutTag || '';
  document.getElementById('e-tags').value    = (q.tags || []).join('\n');
  document.getElementById('e-content').value = q.content || '';
  document.getElementById('e-choices').value = (q.choices || []).join('\n');
  document.getElementById('e-answer').value  = String(q.answer || '');
  document.getElementById('e-solution').value = q.solution || '';
  document.getElementById('e-image').value   = q.image || '';
  document.getElementById('e-imagesize').value = q.imageSize || '';

  updateImagePreview(q.image || '');
}

async function updateImagePreview(imgPath) {
  const el = document.getElementById('e-image-preview');
  el.innerHTML = '';
  if (!imgPath) return;
  const normalized = normalizeImagePath(imgPath);
  if (state.imageMap.size > 0) {
    const blobUrl = await getImageBlobUrl(normalized);
    if (blobUrl) {
      el.innerHTML = '<img src="' + blobUrl + '" alt="' + normalized + '">';
    } else {
      el.innerHTML = '<span style="font-size:11px;color:#bf360c">⚠ 파일 없음: ' + normalized + '</span>';
    }
  } else {
    el.innerHTML = '<span style="font-size:11px;color:#6a1a6a">이미지 경로 있음 (폴더 미열림)</span>';
  }
}

/* ================================================================
   파일 로드 (parseAndLoad)
================================================================ */
function loadBank(source, fileName) {
  clearError();
  let parsed;
  try {
    parsed = parseSource(source, fileName);
  } catch (e) {
    showError('파싱 실패: ' + e.message + '\n파일: ' + fileName);
    return;
  }

  state.currentSource  = source;
  state.currentFileName = fileName;
  state.examTitle      = parsed.title;
  state.originalBank   = deepClone(parsed.bank);
  state.currentBank    = deepClone(parsed.bank);
  state.modifiedIds    = new Set();
  state.removedItems   = [];
  state.selectedId     = null;

  document.getElementById('status-file').textContent = fileName + ' (' + parsed.bank.length + '문항)';
  closeEditPanel();
  updateSaveModeUI();
  renderAll();

  refreshEnginePreviewFrameOnly();
  updateUnsavedBadge();
  persistSessionState();

  showToast(fileName + ' 로드 완료 (' + parsed.bank.length + '문항)');
}

/* ================================================================
   archive 폴더 열기
================================================================ */
async function openArchiveDir() {
  if (!window.showDirectoryPicker) {
    showError('showDirectoryPicker 미지원. Chrome/Edge 최신 버전에서 localhost로 접속하세요.');
    return;
  }
  if (!confirmDiscardUnsaved('저장하지 않은 수정이 있습니다. 다른 archive 폴더를 열까요?')) return;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    state.archiveDirHandle = handle;
    state.currentFileHandle = null;
    state.currentFilePath = '';
    state.currentFileName = '';
    state.currentSource = '';
    state.examTitle = '';
    state.originalBank = [];
    state.currentBank = [];
    state.selectedId = null;
    state.modifiedIds = new Set();
    state.removedItems = [];
    state.canDirectSave = false;
    updateSaveModeUI();
    clearError();
    closeEditPanel();
    document.getElementById('status-file').textContent = '파일을 선택하세요';

    const dirStatus = document.getElementById('left-dir-status');
    dirStatus.textContent = 'archive 폴더: ' + handle.name;
    dirStatus.classList.add('open');

    await scanArchiveDir(handle);
    await buildImageMap(handle);
    renderAll();
    persistSessionState();
    showToast('폴더 열림: ' + handle.name);
  } catch (e) {
    if (e.name !== 'AbortError') showError('폴더 열기 실패: ' + e.message);
  }
}

async function scanArchiveDir(dirHandle) {
  state.fileEntries = [];
  document.getElementById('file-list').innerHTML = '<div style="padding:6px;color:#888;font-size:11px">탐색 중...</div>';
  await collectJsFiles(dirHandle, '', state.fileEntries);
  renderFileList();
}

async function collectJsFiles(dirHandle, prefix, result) {
  const EXCLUDE_FILES = new Set(['db.js','concept_map.js','internal-review-engine.js']);
  const EXCLUDE_DIRS  = new Set(['.venv','node_modules','__pycache__','tools','assessment','textbook']);

  for await (const [name, handle] of dirHandle.entries()) {
    const curPath = prefix ? prefix + '/' + name : name;
    if (handle.kind === 'directory') {
      if (!prefix && name !== 'exams') continue; // 최상위는 exams만
      if (EXCLUDE_DIRS.has(name)) continue;
      await collectJsFiles(handle, curPath, result);
    } else if (handle.kind === 'file' && name.endsWith('.js')) {
      if (!curPath.startsWith('exams/')) continue;
      if (EXCLUDE_FILES.has(name)) continue;
      result.push({ path: curPath, handle: handle });
    }
  }
}

/* ================================================================
   단일 JS 파일 열기
================================================================ */
async function openSingleFile() {
  if (!confirmDiscardUnsaved('저장하지 않은 수정이 있습니다. 다른 JS 파일을 열까요?')) return;
  if (window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JS Files', accept: { 'text/javascript': ['.js'] } }],
        multiple: false,
      });
      state.currentFileHandle = handle;
      state.currentFilePath = '';  // 단일 열기 시 경로 미확인
      state.canDirectSave = true;
      updateSaveModeUI();
      clearError();
      await loadFileHandle(handle);
    } catch (e) {
      if (e.name !== 'AbortError') showError('파일 열기 실패: ' + e.message);
    }
  } else {
    state.canDirectSave = false;
    updateSaveModeUI();
    document.getElementById('fallback-input').click();
  }
}

document.getElementById('fallback-input').addEventListener('change', async function() {
  const file = this.files[0];
  if (!file) return;
  const src = await file.text();
  state.currentFileHandle = null;
  state.currentFilePath = '';
  state.currentFileName = file.name;
  loadBank(src, file.name);
});

async function loadFileHandle(handle) {
  try {
    const file = await handle.getFile();
    const src  = await file.text();
    state.currentFileHandle = handle;
    state.currentFileName   = handle.name;
    state.canDirectSave     = true;
    updateSaveModeUI();
    loadBank(src, handle.name);
  } catch (e) {
    showError('파일 읽기 실패: ' + e.message);
  }
}

/* ================================================================
   이미지 맵
================================================================ */
async function buildImageMap(archiveDirHandle) {
  state.imageMap.clear();
  try {
    const assetsHandle = await archiveDirHandle.getDirectoryHandle('assets', { create: false });
    const imagesHandle = await assetsHandle.getDirectoryHandle('images', { create: false });
    for await (const [folderName, folderHandle] of imagesHandle.entries()) {
      if (folderHandle.kind !== 'directory') continue;
      for await (const [fileName, fileHandle] of folderHandle.entries()) {
        if (fileHandle.kind !== 'file') continue;
        state.imageMap.set('assets/images/' + folderName + '/' + fileName, fileHandle);
      }
    }
  } catch (e) {
    console.warn('[검수엔진] 이미지 맵 빌드 실패:', e.message);
  }
}

/* ================================================================
   파일 목록 렌더링
================================================================ */
function renderFileList() {
  const container = document.getElementById('file-list');
  const prevScrollTop = container.scrollTop || 0;
  container.innerHTML = '';
  const fsearch = document.getElementById('file-search');
  fsearch.style.display = state.fileEntries.length > 0 ? 'block' : 'none';
  fsearch.value = state.fileSearch || '';

  const q = (state.fileSearch || '').trim().toLowerCase();
  const filtered = state.fileEntries.filter(function(e) {
    // 텍스트 검색
    if (q && !q.split(/\s+/).every(function(t) { return e.path.toLowerCase().includes(t); })) return false;
    // 학년 필터
    if (state.gradeFilter && getGradeFromPath(e.path) !== state.gradeFilter) return false;
    // 시험유형 필터
    if (state.examTypeFilter && getExamTypeFromPath(e.path) !== state.examTypeFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:6px;color:#aaa;font-size:11px">파일 없음</div>';
    return;
  }

  // 연도 내림차순 정렬 (파일명 앞 숫자 기준: 25_ > 24_ > ...)
  filtered.sort(function(a, b) {
    var yearA = parseInt((a.path.split('/').pop() || '').match(/^(\d+)/)?.[1] || '0', 10);
    var yearB = parseInt((b.path.split('/').pop() || '').match(/^(\d+)/)?.[1] || '0', 10);
    if (yearB !== yearA) return yearB - yearA;
    return a.path.localeCompare(b.path, 'ko');
  });

  filtered.forEach(function(entry) {
    const div = document.createElement('div');
    const isActive = (entry.path && entry.path === state.currentFilePath) || entry.handle === state.currentFileHandle;
    div.className = 'file-item' + (isActive ? ' active' : '');
    const parts = entry.path.split('/');
    const name = parts.pop();
    const subpath = parts.join('/');
    div.innerHTML = '<span>' + name + '</span>' + (subpath ? '<span class="file-subpath">' + subpath + '</span>' : '');
    div.title = entry.path;
    div.addEventListener('click', async function() {
      if (!confirmDiscardUnsaved('현재 파일에 저장하지 않은 수정이 있습니다. 다른 파일을 열까요?')) return;
      state.currentFileHandle = entry.handle;
      state.currentFilePath   = entry.path;
      await loadFileHandle(entry.handle);
      renderFileList();
    });
    container.appendChild(div);
  });

  container.scrollTop = prevScrollTop;
}

document.getElementById('file-search').addEventListener('input', function() {
  state.fileSearch = this.value;
  renderFileList();
});

/* ================================================================
   필터 렌더링
================================================================ */
function renderGradeExamBtns() {
  // 학년 버튼
  var gradeWrap = document.getElementById('grade-filter-btns');
  if (gradeWrap) {
    gradeWrap.innerHTML = '';
    GRADE_FILTERS.forEach(function(g) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn grade' + (state.gradeFilter === g ? ' active' : '');
      btn.textContent = g;
      btn.addEventListener('click', function() {
        commitEditorDraft();
        state.gradeFilter = (state.gradeFilter === g) ? '' : g;
        renderGradeExamBtns();
        renderFileList();
        renderCenterPane();
      });
      gradeWrap.appendChild(btn);
    });
  }

  // 시험유형 버튼
  var examWrap = document.getElementById('exam-type-filter-btns');
  if (examWrap) {
    examWrap.innerHTML = '';
    EXAM_TYPE_FILTERS.forEach(function(t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn exam-type' + (state.examTypeFilter === t ? ' active' : '');
      btn.textContent = t;
      btn.addEventListener('click', function() {
        commitEditorDraft();
        state.examTypeFilter = (state.examTypeFilter === t) ? '' : t;
        renderGradeExamBtns();
        renderFileList();
        renderCenterPane();
      });
      examWrap.appendChild(btn);
    });
  }
}

function renderFilterBtns() {
  var container = document.getElementById('filter-btns');
  if (!container) return;
  container.innerHTML = '';
  FILTERS.forEach(function(f) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (state.activeFilter === f.key ? ' active' : '') + (f.cls ? ' ' + f.cls : '');
    btn.textContent = f.label;
    btn.addEventListener('click', function() {
      commitEditorDraft();
      state.activeFilter = f.key;
      renderFilterBtns();
      renderCenterPane();
    });
    container.appendChild(btn);
  });
}

document.getElementById('content-search').addEventListener('input', function() {
  commitEditorDraft();
  state.searchQuery = this.value;
  renderCenterPane();
});

/* ================================================================
   필터 적용
================================================================ */
function applyFilter(bank) {
  const f = state.activeFilter;
  const q = (state.searchQuery || '').trim().toLowerCase();

  let list = bank.map(function(item, idx) { return { item: item, idx: idx }; });

  // ① 학년 고정 필터 (문항 기준) — 먼저 적용
  if (state.gradeFilter) {
    list = list.filter(function(e) { return getGradeFromItem(e.item) === state.gradeFilter; });
  }

  // ② 내용 검색
  if (q) {
    list = list.filter(function(e) {
      const hay = [
        String(e.item.id || ''),
        e.item.content || '',
        String(e.item.answer || ''),
        (e.item.tags || []).join(' '),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  // ③ 검수 필터
  if (f === 'all')        return list;
  if (f === 'warning')    return list.filter(function(e) { return detectWarnings(e.item).length > 0; });
  if (f === 'modified')   return list.filter(function(e) { return state.modifiedIds.has(e.item.id); });
  if (f === 'removed')    return [];
  if (f === 'recdiff')    return list.filter(function(e) { return e.item.level !== recommendLevel(e.item); });
  if (f === 'imgneeded')  return list.filter(function(e) {
    const hasKw = VISUAL_KEYWORDS.some(function(kw) { return (e.item.content || '').includes(kw); });
    return hasKw && !e.item.image;
  });
  if (f === 'broken')     return list.filter(function(e) {
    const t = (e.item.content || '') + (e.item.solution || '') + String(e.item.answer || '');
    return BROKEN_CHAR_PATTERNS.some(function(c) { return t.includes(c); });
  });
  if (f === 'meta')       return list.filter(function(e) {
    const sol = e.item.solution || '';
    return META_PHRASES.some(function(p) { return sol.includes(p); });
  });
  if (f === 'noanswer')   return list.filter(function(e) { return !e.item.answer || String(e.item.answer).trim() === ''; });
  if (f === 'nosolution') return list.filter(function(e) { return !e.item.solution || String(e.item.solution).trim() === ''; });
  if (f === '하' || f === '중' || f === '상') return list.filter(function(e) { return e.item.level === f; });
  if (f === '객관식')     return list.filter(function(e) { return e.item.questionType === '객관식'; });
  if (f === '단답형')     return list.filter(function(e) { return e.item.questionType === '단답형'; });
  return list;
}

/* ================================================================
   통계 / 상태 UI
================================================================ */
function updateStats() {
  const total = state.originalBank.length;
  const cur   = state.currentBank.length;
  const warnCount = state.currentBank.filter(function(q) { return detectWarnings(q).length > 0; }).length;
  const modCount  = state.modifiedIds.size;
  const rmCount   = state.removedItems.length;

  document.getElementById('left-stats').innerHTML =
    '<span>전체: ' + total + '문항</span>' +
    '<span>현재: ' + cur + '문항</span>' +
    '<span class="stat-warn">경고: ' + warnCount + '</span>' +
    '<span class="stat-mod">수정: ' + modCount + '</span>' +
    '<span class="stat-rm">제거: ' + rmCount + '</span>';

  document.getElementById('status-counts').textContent =
    '경고 ' + warnCount + ' / 수정 ' + modCount + ' / 제거 ' + rmCount;
}

function updateSaveModeUI() {
  const el = document.getElementById('status-save-mode');
  if (state.canDirectSave) {
    el.textContent = '직접 저장 가능';
    el.className = 'canwrite';
  } else {
    el.textContent = '다운로드만 가능';
    el.className = 'nowrite';
  }
}

/* ================================================================
   렌더링 — 편집 검수 탭 (카드)
================================================================ */
function sanitizeHtml(html) {
  const ALLOWED = new Set(['br','div','span','b','strong','em','u','sup','sub','p',
    'table','thead','tbody','tr','th','td','colgroup','col','img',
    'svg','g','path','line','polyline','polygon','circle','ellipse','rect','text','tspan']);
  const REMOVE  = new Set(['script','iframe','object','embed','style','form','input','button','link','meta']);
  const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
  function clean(el) {
    Array.from(el.childNodes).forEach(function(child) {
      if (child.nodeType !== 1) return;
      const tag = child.tagName.toLowerCase();
      if (REMOVE.has(tag)) { child.remove(); return; }
      Array.from(child.attributes).forEach(function(attr) {
        if (/^on/i.test(attr.name)) child.removeAttribute(attr.name);
      });
      if (!ALLOWED.has(tag)) {
        const frag = document.createDocumentFragment();
        while (child.firstChild) frag.appendChild(child.firstChild);
        el.insertBefore(frag, child);
        child.remove();
      } else { clean(child); }
    });
  }
  clean(doc.body);
  return doc.body.innerHTML;
}

function renderMathText(text) {
  if (!text) return '';
  if (!/<[a-zA-Z\/]/.test(text)) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
  return sanitizeHtml(text);
}

/* ================================================================
   렌더링 — 라이브 출력 탭
================================================================ */
function getLiveModeLabel() {
  if (state.engineMode === 'sol') return '해설지';
  if (state.engineMode === 'ans') return '정답표';
  return '시험지';
}

function makeLiveQuestion(q, displayNum) {
  const article = document.createElement('article');
  article.className = 'ir-live-question';
  if (String(q.id) === String(state.selectedId)) article.classList.add('selected');
  article.dataset.qid = String(q.id);
  article.tabIndex = 0;

  const head = document.createElement('div');
  head.className = 'ir-live-qhead';
  head.innerHTML =
    '<span class="ir-live-qnum">' + displayNum + '.</span>' +
    '<span class="ir-live-qid">id:' + q.id + '</span>';
  article.appendChild(head);

  const content = document.createElement('div');
  content.className = 'ir-live-content';
  content.innerHTML = renderMathText(q.content || '');
  article.appendChild(content);

  const imgPath = normalizeImagePath(q.image || '');
  if (imgPath) {
    const wrap = document.createElement('div');
    const size = ['small','half','medium','large','full'].includes(q.imageSize) ? q.imageSize : '';
    wrap.className = 'ir-live-image-wrap' + (size ? ' image-' + size : '');
    const img = document.createElement('img');
    img.alt = imgPath;
    img.dataset.imgPath = imgPath;
    img.src = imgPath;
    wrap.appendChild(img);
    article.appendChild(wrap);
  }

  if (Array.isArray(q.choices) && q.choices.length > 0 && state.engineMode !== 'sol') {
    const choices = document.createElement('div');
    choices.className = 'ir-live-choices';
    choices.innerHTML = q.choices.map(function(choice, i) {
      return '<span class="ir-live-choice"><span class="circle-num">' +
        (CIRCLE_NUMS[i] || (i + 1) + '.') + '</span> ' +
        renderMathText(String(choice)) + '</span>';
    }).join('');
    article.appendChild(choices);
  }

  if (state.engineMode === 'sol') {
    const answer = document.createElement('div');
    answer.className = 'ir-live-answer';
    answer.innerHTML = '[정답] ' + renderMathText(String(q.answer || ''));
    article.appendChild(answer);

    const solution = document.createElement('div');
    solution.className = 'ir-live-solution';
    solution.innerHTML = renderMathText(q.solution || '해설이 없습니다.');
    article.appendChild(solution);
  }

  return article;
}

function makeLiveAnswerTable(bank) {
  const table = document.createElement('table');
  table.className = 'ir-live-answer-table';
  const tbody = document.createElement('tbody');
  bank.forEach(function(q, i) {
    const tr = document.createElement('tr');
    tr.dataset.qid = String(q.id);
    if (String(q.id) === String(state.selectedId)) tr.classList.add('selected');
    tr.innerHTML =
      '<td class="ir-live-answer-n">' + (i + 1) + '번</td>' +
      '<td class="ir-live-answer-v">' + renderMathText(String(q.answer || '')) + '</td>';
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function renderLiveOutputPane(keepScroll) {
  const container = document.getElementById('live-output-preview');
  if (!container) return;
  const scrollTop = keepScroll ? container.scrollTop : 0;
  container.innerHTML = '';

  if (!state.currentBank || state.currentBank.length === 0) {
    container.innerHTML = '<div class="ir-live-empty">파일을 열면 라이브 출력이 표시됩니다.</div>';
    return;
  }

  const page = document.createElement('div');
  page.className = 'ir-live-page';

  const title = document.createElement('div');
  title.className = 'ir-live-title';
  title.textContent = state.examTitle || state.currentFileName || 'JS아카이브';
  page.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'ir-live-meta';
  meta.innerHTML =
    '<span>' + getLiveModeLabel() + ' · 라이브 검수본</span>' +
    '<span>' + state.currentBank.length + '문항</span>';
  page.appendChild(meta);

  if (state.engineMode === 'ans') {
    page.appendChild(makeLiveAnswerTable(state.currentBank));
  } else {
    const grid = document.createElement('div');
    grid.className = 'ir-live-grid' + (state.engineMode === 'sol' ? ' ir-live-sol' : '');
    state.currentBank.forEach(function(q, i) {
      grid.appendChild(makeLiveQuestion(q, i + 1));
    });
    page.appendChild(grid);
  }

  container.appendChild(page);
  container.scrollTop = Math.min(scrollTop, container.scrollHeight);

  container.querySelectorAll('img[data-img-path]').forEach(async function(img) {
    const blobUrl = await getImageBlobUrl(img.dataset.imgPath);
    if (blobUrl) {
      img.src = blobUrl;
    } else if (state.imageMap.size > 0) {
      const miss = document.createElement('div');
      miss.className = 'ir-live-image-missing';
      miss.textContent = '이미지 없음: ' + normalizeImagePath(img.dataset.imgPath);
      img.parentNode && img.parentNode.insertBefore(miss, img.nextSibling);
      img.remove();
    }
  });
}

function getEngineBaseHref() {
  return new URL('.', window.location.href).href;
}

function getLiveEnginePayload() {
  return {
    title: state.examTitle || state.currentFileName || 'JS아카이브',
    data: deepClone(state.currentBank || []),
    mode: state.engineMode || 'exam',
    qpp: state.qpp || 4,
    selectedId: state.selectedId,
  };
}

function buildLiveEngineInitScript(payload) {
  return '<script id="internal-review-live-data">\\n' +
    'window.__INTERNAL_REVIEW_LIVE__ = ' + JSON.stringify(payload).replace(/<\/script/gi, '<\\/script') + ';\\n' +
    '<\\/script>\\n';
}

function buildStandaloneLiveEngineSrcdoc(payload) {
  const safePayload = JSON.stringify(payload).replace(/<\/script/gi, '<\\/script');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <base href="${getEngineBaseHref()}">
  <title>JS아카이브 Live Output</title>
  <script>
    window.MathJax = {
      tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']], packages: {'[+]': ['ams', 'boldsymbol']} },
      options: { enableMenu: false },
      startup: { typeset: false }
    };
  <\/script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"><\/script>
  <style>
    @page { size:A4; margin:0; }
    body { margin:0; background:#f1f5f9; font-family:'Nanum Myeongjo','Times New Roman',serif; font-size:9.5pt; padding-top:54px; }
    #mode-ctrl { position:fixed; top:0; left:0; right:0; height:54px; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:space-between; padding:0 24px; box-sizing:border-box; z-index:10; }
    #ctrl-title { font-weight:800; font-size:14px; max-width:65%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    #qpp-display { color:rgba(255,255,255,.72); font-size:11px; font-weight:800; }
    #print-area { display:flex; flex-direction:column; align-items:center; gap:20px; padding:20px 0; }
    .page { width:210mm; height:297mm; background:#fff; box-shadow:0 0 10px rgba(0,0,0,.12); padding:14mm 15mm 20mm; box-sizing:border-box; display:flex; flex-direction:column; position:relative; }
    .page-exam-frame { position:absolute; top:11.5mm; right:11.5mm; bottom:11.5mm; left:11.5mm; border:.8pt solid #000; pointer-events:none; box-sizing:border-box; }
    .page-header { display:flex; flex-direction:column; justify-content:center; gap:3px; border:.8pt solid #000; padding:5px 8px 6px; margin-bottom:8px; font-weight:700; font-size:9.4pt; line-height:1.2; background:#fff; }
    .page-header--exam { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; column-gap:18px; padding:12px 14px 10px; }
    .page-header-title { font-size:14.2pt; line-height:1.15; font-weight:800; text-align:left; word-break:break-all; }
    .page-header-meta-right { display:flex; align-items:center; gap:12px; white-space:nowrap; }
    .header-fill-line { display:inline-block; min-width:78px; border-bottom:.8pt solid #000; height:.95em; vertical-align:bottom; margin-left:4px; }
    .header-fill-line--score { min-width:34px; margin:0 3px 0 4px; }
    .page-body { flex:1; display:flex; flex-direction:column; min-height:0; }
    .grid-container { display:grid; grid-template-columns:1fr 1fr; position:relative; gap:0; flex:1; min-height:0; }
    .grid-container::after { content:''; position:absolute; left:50%; top:0; bottom:0; width:1px; background:#000; }
    .grid-col { display:flex; flex-direction:column; padding:0 12px; overflow:hidden; min-height:0; }
    .q-box { flex:1; padding:10px 0; display:flex; flex-direction:column; min-height:0; overflow:hidden; cursor:pointer; }
    .q-box:hover, .ans-cell:hover { outline:2px solid rgba(37,99,235,.45); outline-offset:2px; }
    .q-box.live-selected, .ans-cell.live-selected { outline:3px solid rgba(37,99,235,.75); outline-offset:2px; background:rgba(219,234,254,.35); }
    .q-num { font-weight:700; font-size:11pt; margin-bottom:6px; }
    .q-content { line-height:1.62; word-break:keep-all; overflow-wrap:anywhere; }
    .q-content img, .q-image-wrap img { display:block; max-width:100%; height:auto; margin:8px auto; break-inside:avoid; }
    .q-image-wrap.image-small img { max-width:50%; max-height:95px; }
    .q-image-wrap.image-half img { max-width:65%; max-height:125px; }
    .q-image-wrap.image-medium img { max-width:80%; max-height:150px; }
    .q-image-wrap.image-large img { max-width:94%; max-height:190px; }
    .q-image-wrap.image-full img { max-width:100%; max-height:240px; }
    .choices { margin-top:10px; font-size:9pt; }
    .choice-item { display:flex; align-items:flex-start; line-height:1.5; }
    .choice-no { width:20px; flex-shrink:0; font-weight:700; }
    .choice-text { flex:1; word-break:keep-all; overflow-wrap:anywhere; }
    .choices-compact { display:flex; flex-wrap:wrap; gap:4px 15px; }
    .choices-compact .choice-item { min-width:15%; }
    .choices-block { display:flex; flex-direction:column; gap:5px; }
    .answer-box { flex:1; margin-top:10px; }
    .sol-box { flex:none; border-bottom:.5px solid #eee; padding-bottom:2.2em; margin-bottom:2.2em; }
    .solution-card { background:#fdfdfd; padding:8px; border:1px solid #eee; border-radius:3px; }
    .ans-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0 20px; width:100%; }
    .ans-cell { border-bottom:1px solid #eee; display:flex; height:40px; align-items:center; padding:0 10px; cursor:pointer; }
    .ans-n { width:40px; font-weight:700; color:#1d4ed8; font-size:10pt; }
    .ans-v { flex:1; font-weight:700; font-size:10.5pt; }
    table.question-table { border-collapse:collapse; width:100%; max-width:280px; table-layout:fixed; font-size:8.6pt; line-height:1.35; margin:8px 0; text-align:left; }
    table.question-table th, table.question-table td { border:1px solid #000; padding:3px 5px; text-align:center; vertical-align:middle; word-break:break-word; }
    .question-note-box,.note-box,.box { display:inline-block; max-width:100%; box-sizing:border-box; margin:5px 0 6px; padding:5px 8px; border:1px solid #222; background:#fff; line-height:1.45; text-align:left; }
    .page-num { position:absolute; bottom:15mm; left:0; width:100%; text-align:center; font-size:9pt; color:#555; }
  </style>
</head>
<body>
  <div id="mode-ctrl"><span id="ctrl-title"></span><span id="qpp-display"></span></div>
  <div id="print-area"></div>
  <script>
    const live = ${safePayload};
    const CIRCLED = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];
    function esc(s){ return String(s ?? '').replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch])); }
    function html(s){ const value = String(s ?? ''); return /<[a-zA-Z\\/]/.test(value) ? value : esc(value).replace(/\\r\\n|\\r|\\n/g,'<br>'); }
    function stripChoicePrefix(text){ return String(text || '').replace(/^\\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|\\(?\\d+\\)|\\d+\\.(?!\\d)|\\d+\\))\\s*/, '').trim(); }
    function detectChoiceRenderMode(choices){
      if (!choices || !choices.length) return 'compact';
      const texts = choices.map(c => stripChoicePrefix(String(c ?? '')).trim());
      const stripped = texts.map(t => t.replace(/\\$\\$[\\s\\S]*?\\$\\$/g,'~').replace(/\\$[^$\\n]*?\\$/g,'~').trim());
      const avg = stripped.reduce((s,t)=>s+t.length,0) / Math.max(stripped.length,1);
      return (stripped.some(t=>t.length>28) || avg>22 || texts.some(t=>/\\n|<br/i.test(t))) ? 'block' : 'compact';
    }
    function choicesHTML(q){
      const choices = Array.isArray(q.choices) ? q.choices : [];
      if (!choices.length) return '<div class="answer-box"></div>';
      const mode = detectChoiceRenderMode(choices);
      return '<div class="choices choices-' + mode + '">' + choices.map((c,i)=>'<div class="choice-item"><span class="choice-no">' + (CIRCLED[i] || '') + '</span><span class="choice-text">' + html(stripChoicePrefix(String(c ?? ''))) + '</span></div>').join('') + '</div>';
    }
    function imageHTML(q){
      if (!q.image) return '';
      const size = ['small','half','medium','large','full'].includes(q.imageSize) ? ' image-' + q.imageSize : '';
      return '<div class="q-image-wrap' + size + '"><img src="' + esc(q.image) + '"></div>';
    }
    function makePage(pageNo, type){
      const page = document.createElement('div'); page.className='page';
      if(type==='exam') page.insertAdjacentHTML('beforeend','<div class="page-exam-frame"></div>');
      const header = document.createElement('div'); header.className='page-header' + (type==='exam' ? ' page-header--exam' : '');
      if(type==='exam') header.innerHTML='<div class="page-header-title">' + esc(live.title || '시험지') + '</div><div class="page-header-meta-right"><span>이름<span class="header-fill-line"></span></span><span>점수<span class="header-fill-line header-fill-line--score"></span>/ 100</span></div>';
      else header.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px;"><div style="flex:1;">' + esc(live.title || '시험지') + '</div><div>' + (type==='sol' ? '[ 정답 및 해설 ]' : '[ 정답표 ]') + '</div></div>';
      page.appendChild(header);
      const body = document.createElement('div'); body.className='page-body'; page.appendChild(body);
      page.insertAdjacentHTML('beforeend','<div class="page-num">- ' + pageNo + ' -</div>');
      document.getElementById('print-area').appendChild(page);
      page.body = body;
      return page;
    }
    function renderExam(){
      const qpp = parseInt(live.qpp,10) || 4;
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=qpp,pageNo++){
        const page = makePage(pageNo,'exam');
        const grid = document.createElement('div'); grid.className='grid-container';
        const left = document.createElement('div'); left.className='grid-col';
        const right = document.createElement('div'); right.className='grid-col';
        grid.appendChild(left); grid.appendChild(right); page.body.appendChild(grid);
        const chunk = data.slice(start,start+qpp);
        const split = Math.ceil(chunk.length/2);
        chunk.forEach((q,idx)=>{
          const global = start + idx;
          const box = document.createElement('div'); box.className='q-box'; box.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) box.classList.add('live-selected');
          box.innerHTML='<div class="q-num">' + (global+1) + '.</div><div class="q-content">' + html(q.content || q.question || '') + '</div>' + imageHTML(q) + choicesHTML(q);
          (idx < split ? left : right).appendChild(box);
        });
      }
    }
    function renderSol(){
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=8,pageNo++){
        const page = makePage(pageNo,'sol');
        const grid = document.createElement('div'); grid.className='grid-container';
        const left = document.createElement('div'); left.className='grid-col';
        const right = document.createElement('div'); right.className='grid-col';
        grid.appendChild(left); grid.appendChild(right); page.body.appendChild(grid);
        data.slice(start,start+8).forEach((q,idx)=>{
          const global = start + idx;
          const box = document.createElement('div'); box.className='q-box sol-box'; box.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) box.classList.add('live-selected');
          box.innerHTML='<div class="q-num">' + (global+1) + '.</div><div style="margin-bottom:8px;color:#555;font-size:8.5pt;">' + html(q.content || q.question || '') + '</div><div class="solution-card"><div style="font-weight:bold;color:red;margin-bottom:4px;">[정답] ' + html(q.answer ?? '–') + '</div><div style="font-size:8.5pt;line-height:1.55;">' + html(q.solution || q.explanation || q.sol || '해설이 없습니다.') + '</div></div>';
          (idx < 4 ? left : right).appendChild(box);
        });
      }
    }
    function renderAns(){
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=50,pageNo++){
        const page = makePage(pageNo,'ans');
        const grid = document.createElement('div'); grid.className='ans-grid';
        data.slice(start,start+50).forEach((q,idx)=>{
          const cell = document.createElement('div'); cell.className='ans-cell'; cell.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) cell.classList.add('live-selected');
          cell.innerHTML='<div class="ans-n">' + (start+idx+1) + '.</div><div class="ans-v">' + html(q.answer ?? '–') + '</div>';
          grid.appendChild(cell);
        });
        page.body.appendChild(grid);
      }
    }
    function render(){
      document.getElementById('ctrl-title').textContent = live.title || 'JS아카이브';
      document.getElementById('qpp-display').textContent = 'QPP: ' + (live.qpp || 4);
      if(live.mode === 'ans') renderAns();
      else if(live.mode === 'sol') renderSol();
      else renderExam();
      const tryMath = () => window.MathJax && MathJax.typesetPromise && MathJax.typesetPromise([document.body]).catch(()=>{});
      setTimeout(tryMath, 120);
    }
    render();
  <\/script>
</body>
</html>`;
}

function buildEngineParityLiveSrcdoc(payload) {
  const safePayload = JSON.stringify(payload).replace(/<\/script/gi, '<\\/script');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <base href="${getEngineBaseHref()}">
  <title>JS Archive Live Output</title>
  <script>
    window.MathJax = {
      tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']], packages: {'[+]': ['ams', 'boldsymbol']} },
      options: { enableMenu: false },
      startup: { typeset: false }
    };
  <\/script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"><\/script>
  <style>
    @page { size:A4; margin:0; }
    body { margin:0; background:#eef2f7; font-family:'Nanum Myeongjo','Times New Roman',serif; font-size:9.5pt; padding-top:54px; }
    #mode-ctrl { position:fixed; top:0; left:0; right:0; height:54px; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:space-between; padding:0 24px; box-sizing:border-box; z-index:10; }
    #ctrl-title { font-weight:800; font-size:14px; max-width:68%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    #qpp-display { color:rgba(255,255,255,.72); font-size:11px; font-weight:800; }
    #print-area { display:flex; flex-direction:column; align-items:center; gap:20px; padding:20px 0; }
    .page { width:210mm; height:297mm; background:#fff; box-shadow:0 0 10px rgba(0,0,0,.12); padding:14mm 15mm 20mm; box-sizing:border-box; display:flex; flex-direction:column; position:relative; overflow:hidden; }
    .page-exam-frame { position:absolute; top:11.5mm; right:11.5mm; bottom:11.5mm; left:11.5mm; border:.8pt solid #000; pointer-events:none; box-sizing:border-box; }
    .page-header { display:flex; flex-direction:column; justify-content:center; gap:3px; border:.8pt solid #000; padding:5px 8px 6px; margin-bottom:8px; font-weight:700; font-size:9.4pt; line-height:1.2; background:#fff; }
    .page-header--exam { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; column-gap:18px; padding:12px 14px 10px; }
    .page-header-title { font-size:14.2pt; line-height:1.15; font-weight:800; text-align:left; word-break:break-all; }
    .page-header-meta-right { display:flex; align-items:center; gap:12px; white-space:nowrap; }
    .header-fill-line { display:inline-block; min-width:78px; border-bottom:.8pt solid #000; height:.95em; vertical-align:bottom; margin-left:4px; }
    .header-fill-line--score { min-width:34px; margin:0 3px 0 4px; }
    .page-body { flex:1; display:flex; flex-direction:column; min-height:0; }
    .grid-container { display:grid; grid-template-columns:1fr 1fr; position:relative; gap:0; flex:1; min-height:0; }
    .grid-container::after { content:''; position:absolute; left:50%; top:0; bottom:0; width:1px; background:#000; }
    .grid-col { display:flex; flex-direction:column; padding:0 12px; overflow:hidden; min-height:0; }
    .q-box { flex:1; padding:10px 0; display:flex; flex-direction:column; min-height:0; overflow:hidden; cursor:pointer; }
    .q-box:hover, .ans-cell:hover { outline:2px solid rgba(37,99,235,.45); outline-offset:2px; }
    .q-box.live-selected, .ans-cell.live-selected { outline:3px solid rgba(37,99,235,.75); outline-offset:2px; background:rgba(219,234,254,.36); }
    .q-num { font-weight:700; font-size:11pt; margin-bottom:6px; }
    .q-content { line-height:1.62; word-break:keep-all; overflow-wrap:anywhere; }
    .q-content img, .q-image-wrap img { display:block; max-width:100%; height:auto; margin:8px auto; break-inside:avoid; }
    .q-image-wrap.image-small img { max-width:50%; max-height:95px; }
    .q-image-wrap.image-half img { max-width:65%; max-height:125px; }
    .q-image-wrap.image-medium img { max-width:80%; max-height:150px; }
    .q-image-wrap.image-large img { max-width:94%; max-height:190px; }
    .q-image-wrap.image-full img { max-width:100%; max-height:240px; }
    .fit-tight { font-size:8.7pt; line-height:1.48; }
    .fit-tighter { font-size:8pt; line-height:1.34; }
    .fit-micro { font-size:7.2pt; line-height:1.2; }
    .img-fit-tight { max-height:80% !important; }
    .img-fit-tighter { max-height:65% !important; }
    .img-fit-micro { max-height:50% !important; }
    .choices { margin-top:10px; font-size:9pt; }
    .choice-item { display:flex; align-items:flex-start; line-height:1.5; }
    .choice-no { width:20px; flex-shrink:0; font-weight:700; }
    .choice-text { flex:1; word-break:keep-all; overflow-wrap:anywhere; }
    .choices-compact { display:flex; flex-wrap:wrap; gap:4px 15px; }
    .choices-compact .choice-item { min-width:15%; }
    .choices-block, .choices-boxed { display:flex; flex-direction:column; gap:5px; }
    .answer-box { flex:1; margin-top:10px; }
    .sol-box { flex:none; border-bottom:.5px solid #eee; padding-bottom:2.2em; margin-bottom:2.2em; }
    .solution-card { background:#fdfdfd; padding:8px; border:1px solid #eee; border-radius:3px; }
    .ans-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0 20px; width:100%; }
    .ans-cell { border-bottom:1px solid #eee; display:flex; height:40px; align-items:center; padding:0 10px; cursor:pointer; }
    .ans-n { width:40px; font-weight:700; color:#1d4ed8; font-size:10pt; }
    .ans-v { flex:1; font-weight:700; font-size:10.5pt; }
    table.question-table { border-collapse:collapse; width:100%; max-width:280px; table-layout:fixed; font-size:8.6pt; line-height:1.35; margin:8px 0; text-align:left; }
    table.question-table th, table.question-table td { border:1px solid #000; padding:3px 5px; text-align:center; vertical-align:middle; word-break:break-word; }
    .question-note-box,.note-box,.box { display:inline-block; max-width:100%; box-sizing:border-box; margin:5px 0 6px; padding:5px 8px; border:1px solid #222; background:#fff; line-height:1.45; text-align:left; }
    .page-num { position:absolute; bottom:15mm; left:0; width:100%; text-align:center; font-size:9pt; color:#555; }
  </style>
</head>
<body>
  <div id="mode-ctrl"><span id="ctrl-title"></span><span id="qpp-display"></span></div>
  <div id="print-area"></div>
  <script>
    const live = ${safePayload};
    const CIRCLED = ['&#9312;','&#9313;','&#9314;','&#9315;','&#9316;','&#9317;','&#9318;','&#9319;','&#9320;','&#9321;'];
    function esc(s){ return String(s ?? '').replace(/[&<>]/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]; }); }
    function raf(){ return new Promise(function(resolve){ requestAnimationFrame(resolve); }); }
    function wrapLatex(text) {
      if (text == null) return '';
      let s = String(text);
      s = s.replace(/\\\\\\([\\s\\S]+?\\\\\\)/g, function(m) { return '$' + m.slice(2, -2) + '$'; });
      s = s.replace(/\\\\\\[[\\s\\S]+?\\\\\\]/g, function(m) { return '$$' + m.slice(2, -2) + '$$'; });
      const htmlTags = [];
      s = s.replace(/<svg[\\s\\S]*?<\\/svg>|<img[^>]*>|<br\\s*\\/?>|<\\/?(div|span|b|i|strong|em|u|sup|sub|table|thead|tbody|tr|th|td|colgroup|col)[^>]*>/gi, function(m) {
        const token = '__HTMLTAG_' + htmlTags.length + '__';
        htmlTags.push(m);
        return token;
      });
      s = s.split(/(\\$\\$[\\s\\S]*?\\$\\$|\\$[^$\\n]*?\\$)/g).map(function(seg, idx) {
        if (idx % 2 === 1) return seg;
        return seg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }).join('');
      s = s.split(/(\\$\\$[\\s\\S]*?\\$\\$|\\$[^$\\n]*?\\$|__HTMLTAG_\\d+__)/g).map(function(seg, idx) {
        if (idx % 2 === 1) return seg;
        const trimmed = seg.trim();
        if (!trimmed) return seg;
        const hasKorean = /[\\u3131-\\u318e\\uac00-\\ud7a3]/.test(seg);
        const hasLatex = /\\\\[a-zA-Z]/.test(seg);
        if (!hasKorean && /\\\\begin\\{(cases|aligned|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\\}/.test(seg)) return '$$' + seg + '$$';
        if (!hasKorean && hasLatex && /^[0-9a-zA-Z\\s\\+\\-\\*\\/\\=\\^\\{\\}\\(\\)\\[\\]_\\.,\\\\!;:]+$/.test(trimmed)) return '$' + trimmed + '$';
        if (hasKorean && hasLatex) return seg.replace(/(\\\\[a-zA-Z]+(?:\\{[^}]*\\})*(?:\\{[^}]*\\})*(?:_\\{?[^}\\s]+\\}?)?(?:\\^\\{?[^}\\s]+\\}?)?)/g, '$$$1$$');
        return seg;
      }).join('');
      s = s.split(/(\\$\\$[\\s\\S]*?\\$\\$|\\$[^$\\n]*?\\$)/g).map(function(seg, idx) {
        if (idx % 2 === 1) return seg;
        return seg.replace(/(\\\\\\{(?:[^{}]|\\{[^}]*\\})*\\\\\\})/g, '$$$1$$');
      }).join('');
      s = s.replace(/\\\\n(?![a-zA-Z])/g, '<br>').replace(/\\r\\n|\\r|\\n/g, '<br>');
      return s.replace(/__HTMLTAG_(\\d+)__/g, function(_, i) { return htmlTags[i] || ''; });
    }
    function extractChoice(c) {
      if (c === null || c === undefined) return '';
      if (typeof c === 'object') return c.text || c.content || c.value || c.answer || Object.values(c)[0] || '';
      return String(c);
    }
    function stripChoicePrefix(text){ return String(text || '').replace(/^\\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|\\(?\\d+\\)|\\d+\\.(?!\\d)|\\d+\\))\\s*/, '').trim(); }
    function detectChoiceRenderMode(choices){
      if (!choices || !choices.length) return 'compact';
      const texts = choices.map(function(c){ return stripChoicePrefix(extractChoice(c)).trim(); });
      const stripped = texts.map(function(t){ return t.replace(/\\$\\$[\\s\\S]*?\\$\\$/g,'~').replace(/\\$[^$\\n]*?\\$/g,'~').trim(); });
      const avg = stripped.reduce(function(s,t){ return s + t.length; },0) / Math.max(stripped.length,1);
      const hasMultiMarker = texts.some(function(t){ return (t.match(/[①②③④⑤⑥⑦⑧⑨⑩]|\\d+\\.|\\([0-9]+\\)/g) || []).length >= 2; });
      if (hasMultiMarker) return 'boxed';
      return (stripped.some(function(t){ return t.length > 28; }) || avg > 22 || texts.some(function(t){ return /\\n|<br/i.test(t); })) ? 'block' : 'compact';
    }
    function choicesHTML(q){
      const choices = Array.isArray(q.choices) ? q.choices : [];
      if (!choices.length || choices.every(function(c){ return extractChoice(c).trim() === ''; })) return '<div class="answer-box"></div>';
      const mode = detectChoiceRenderMode(choices);
      return '<div class="choices choices-' + mode + '">' + choices.map(function(c,i){
        return '<div class="choice-item"><span class="choice-no">' + (CIRCLED[i] || '') + '</span><span class="choice-text">' + wrapLatex(stripChoicePrefix(extractChoice(c))) + '</span></div>';
      }).join('') + '</div>';
    }
    function formatQuestionContent(html) {
      if (!html) return '';
      let count = 0;
      return String(html).replace(/([\\.\\?!]|\\s|>)\\s*(\\(\\d+\\))/g, function(match, p1, p2) {
        count++;
        if (count === 1) return match;
        if (p1.includes('br>') || p1.includes('\\n')) return match;
        return p1 + '<br>' + p2;
      });
    }
    function normalizeQuestionTables(html) {
      if (!html) return '';
      return String(html)
        .replace(/<div class="question-table-wrap">\\s*<table/gi, '<div class="question-table-wrap"><table class="question-table"')
        .replace(/<table(?![^>]*class=)/gi, '<table class="question-table"');
    }
    function protectRenderSegments(html) {
      const tokens = [];
      const save = function(match) {
        const token = '__PROTECTED_SEGMENT_' + tokens.length + '__';
        tokens.push(match);
        return token;
      };
      const protectedHtml = String(html || '')
        .replace(/<div[^>]*class=["'][^"']*(?:question-table-wrap|question-note-box|box)[^"']*["'][^>]*>[\\s\\S]*?<\\/div>/gi, save)
        .replace(/<table[\\s\\S]*?<\\/table>/gi, save)
        .replace(/\\$\\$[\\s\\S]*?\\$\\$/g, save)
        .replace(/\\$[^$\\n]*?\\$/g, save);
      return {
        html: protectedHtml,
        restore(value) {
          let restored = String(value || '');
          for (let pass = 0; pass < tokens.length + 2 && /__PROTECTED_SEGMENT_\\d+__/.test(restored); pass++) {
            restored = restored.replace(/__PROTECTED_SEGMENT_(\\d+)__/g, function(match, i) {
              return tokens[Number(i)] !== undefined ? tokens[Number(i)] : '';
            });
          }
          return restored;
        }
      };
    }
    function normalizeViewBlocks(html) {
      if (!html) return '';
      const protectedState = protectRenderSegments(html);
      let out = protectedState.html;
      out = out.replace(/((?:<br\\s*\\/?>\\s*)*)(?:\\[보기\\]|&lt;보기&gt;|<보기>|보기\\s*:|조건\\s*:|자료\\s*:)\\s*([\\s\\S]*?)(?=(?:<br\\s*\\/?>\\s*){2,}|$)/gi, function(match, breaks, body) {
        const plain = body.replace(/<[^>]+>/g, '').trim();
        const markerCount = (plain.match(/[①②③④⑤⑥⑦⑧⑨⑩]|\\d+\\.|\\([0-9]+\\)/g) || []).length;
        if (plain.length < 60 && markerCount < 2) return match;
        return breaks + '<div class="question-note-box">' + body.trim() + '</div>';
      });
      return protectedState.restore(out);
    }
    function stripInlineImagesFromContent(content, hasImageField) {
      if (!content) return '';
      if (!hasImageField) return content;
      let stripped = String(content).replace(/(?:<br\\s*\\/?>\\s*)*<img[^>]*>(?:\\s*<br\\s*\\/?>)*/gi, '<br>');
      stripped = stripped.replace(/^(?:<br\\s*\\/?>\\s*)+/i, '').replace(/(?:<br\\s*\\/?>\\s*)+$/i, '');
      return stripped;
    }
    function renderQuestionContent(q) {
      const raw = stripInlineImagesFromContent(q.content || q.question || '', !!q.image);
      return normalizeViewBlocks(normalizeQuestionTables(formatQuestionContent(wrapLatex(raw))));
    }
    function imageHTML(q){
      if (!q.image) return '';
      const size = ['small','half','medium','large','full'].includes(q.imageSize) ? ' image-' + q.imageSize : '';
      return '<div class="q-image-wrap' + size + '"><img src="' + esc(q.image) + '"></div>';
    }
    function fitQuestionBox(box) {
      const textClasses = ['', 'fit-tight', 'fit-tighter', 'fit-micro'];
      const imgClasses = ['', 'img-fit-tight', 'img-fit-tighter', 'img-fit-micro'];
      const imgs = box.querySelectorAll('.q-content img, .q-image-wrap img');
      for (const tCls of textClasses) {
        box.classList.remove('fit-tight', 'fit-tighter', 'fit-micro');
        if (tCls) box.classList.add(tCls);
        if (box.scrollHeight <= box.clientHeight + 1) return;
      }
      for (const iCls of imgClasses) {
        imgs.forEach(function(img){ img.classList.remove('img-fit-tight', 'img-fit-tighter', 'img-fit-micro'); });
        if (iCls) imgs.forEach(function(img){ img.classList.add(iCls); });
        if (box.scrollHeight <= box.clientHeight + 1) return;
      }
    }
    async function waitForQuestionImage(img) {
      if (!img || img.complete) return;
      return new Promise(function(resolve) {
        let done = false;
        const finish = function() {
          if (done) return;
          done = true;
          resolve();
        };
        img.addEventListener('load', finish, { once:true });
        img.addEventListener('error', finish, { once:true });
        setTimeout(finish, 700);
      });
    }
    async function applyAutoImageSizeClasses(root) {
      const wraps = Array.from(root.querySelectorAll('.q-image-wrap:not(.image-small):not(.image-half):not(.image-medium):not(.image-large):not(.image-full)'));
      for (const wrap of wraps) {
        const img = wrap.querySelector('img');
        await waitForQuestionImage(img);
        const width = Number(img && img.naturalWidth) || 0;
        const height = Number(img && img.naturalHeight) || 0;
        const ratio = height ? width / height : 1;
        let cls = 'image-medium';
        if (ratio >= 2.2) cls = 'image-full';
        else if (ratio >= 1.25) cls = 'image-large';
        else if (ratio >= 0.8) cls = 'image-small';
        wrap.classList.add(cls);
      }
    }
    function makePage(pageNo, type){
      const page = document.createElement('div'); page.className='page';
      if(type==='exam') page.insertAdjacentHTML('beforeend','<div class="page-exam-frame"></div>');
      const header = document.createElement('div'); header.className='page-header' + (type==='exam' ? ' page-header--exam' : '');
      if(type==='exam') header.innerHTML='<div class="page-header-title">' + esc(live.title || '시험지') + '</div><div class="page-header-meta-right"><span>이름<span class="header-fill-line"></span></span><span>점수<span class="header-fill-line header-fill-line--score"></span>/ 100</span></div>';
      else header.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px;"><div style="flex:1;">' + esc(live.title || '시험지') + '</div><div>' + (type==='sol' ? '[ 정답 및 해설 ]' : '[ 정답표 ]') + '</div></div>';
      page.appendChild(header);
      const body = document.createElement('div'); body.className='page-body'; page.appendChild(body);
      page.insertAdjacentHTML('beforeend','<div class="page-num">- ' + pageNo + ' -</div>');
      document.getElementById('print-area').appendChild(page);
      page.body = body;
      return page;
    }
    function renderExam(){
      const qpp = parseInt(live.qpp,10) || 4;
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=qpp,pageNo++){
        const page = makePage(pageNo,'exam');
        const grid = document.createElement('div'); grid.className='grid-container';
        const left = document.createElement('div'); left.className='grid-col';
        const right = document.createElement('div'); right.className='grid-col';
        grid.appendChild(left); grid.appendChild(right); page.body.appendChild(grid);
        const chunk = data.slice(start,start+qpp);
        const split = Math.ceil(chunk.length/2);
        chunk.forEach(function(q,idx){
          const global = start + idx;
          const box = document.createElement('div'); box.className='q-box'; box.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) box.classList.add('live-selected');
          box.innerHTML='<div class="q-num">' + (global+1) + '.</div><div class="q-content">' + renderQuestionContent(q) + '</div>' + imageHTML(q) + choicesHTML(q);
          (idx < split ? left : right).appendChild(box);
        });
      }
    }
    function renderSol(){
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=8,pageNo++){
        const page = makePage(pageNo,'sol');
        const grid = document.createElement('div'); grid.className='grid-container';
        const left = document.createElement('div'); left.className='grid-col';
        const right = document.createElement('div'); right.className='grid-col';
        grid.appendChild(left); grid.appendChild(right); page.body.appendChild(grid);
        data.slice(start,start+8).forEach(function(q,idx){
          const global = start + idx;
          const box = document.createElement('div'); box.className='q-box sol-box'; box.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) box.classList.add('live-selected');
          box.innerHTML='<div class="q-num">' + (global+1) + '.</div><div style="margin-bottom:8px;color:#555;font-size:8.5pt;">' + renderQuestionContent(q) + '</div><div class="solution-card"><div style="font-weight:bold;color:red;margin-bottom:4px;">[정답] ' + wrapLatex(q.answer ?? '-') + '</div><div style="font-size:8.5pt;line-height:1.55;">' + wrapLatex(q.solution || q.explanation || q.sol || '해설이 없습니다.') + '</div></div>';
          (idx < 4 ? left : right).appendChild(box);
        });
      }
    }
    function renderAns(){
      const data = live.data || [];
      for(let start=0,pageNo=1; start<data.length; start+=50,pageNo++){
        const page = makePage(pageNo,'ans');
        const grid = document.createElement('div'); grid.className='ans-grid';
        data.slice(start,start+50).forEach(function(q,idx){
          const cell = document.createElement('div'); cell.className='ans-cell'; cell.dataset.liveQid=String(q.id);
          if(String(q.id)===String(live.selectedId)) cell.classList.add('live-selected');
          cell.innerHTML='<div class="ans-n">' + (start+idx+1) + '.</div><div class="ans-v">' + wrapLatex(q.answer ?? '-') + '</div>';
          grid.appendChild(cell);
        });
        page.body.appendChild(grid);
      }
    }
    async function finishTypesetAndFit(){
      await raf();
      await applyAutoImageSizeClasses(document.body);
      if (window.MathJax && MathJax.typesetPromise) {
        try { await MathJax.typesetPromise([document.body]); } catch(e) {}
      }
      await raf();
      document.querySelectorAll('.q-box').forEach(fitQuestionBox);
    }
    function render(){
      document.getElementById('ctrl-title').textContent = live.title || 'JS Archive';
      document.getElementById('qpp-display').textContent = 'QPP: ' + (live.qpp || 4);
      if(live.mode === 'ans') renderAns();
      else if(live.mode === 'sol') renderSol();
      else renderExam();
      finishTypesetAndFit();
    }
    render();
  <\/script>
</body>
</html>`;
}

async function renderLiveEngineFrame(keepScroll) {
  const iframe = document.getElementById('enginePreviewFrame');
  if (!iframe) return;
  const previousScroll = keepScroll && iframe.contentWindow ? iframe.contentWindow.scrollY : 0;
  if (!state.currentBank || state.currentBank.length === 0) {
    iframe.srcdoc = '<!doctype html><html lang="ko"><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;color:#999;font-family:sans-serif;">파일을 열면 실제 라이브 출력이 표시됩니다.</body></html>';
    return;
  }
  try {
    const srcdoc = buildEngineParityLiveSrcdoc(getLiveEnginePayload());
    iframe.onload = function() {
      if (keepScroll && previousScroll) {
        try { iframe.contentWindow.scrollTo(0, previousScroll); } catch(e) {}
      }
      try {
        const doc = iframe.contentDocument;
        doc.addEventListener('click', function(e) {
          const target = e.target.closest('[data-live-qid]');
          if (!target) return;
          selectQuestion(target.dataset.liveQid);
        });
      } catch(e) {}
    };
    iframe.srcdoc = srcdoc;
  } catch (e) {
    console.warn('[검수엔진] 라이브 엔진 렌더 실패:', e);
    renderLiveOutputPane(keepScroll);
  }
}

function scheduleLiveOutputRender(keepScroll, delay) {
  clearTimeout(state.liveOutputTimer);
  state.liveOutputTimer = setTimeout(function() {
    renderLiveEngineFrame(keepScroll !== false);
  }, delay === undefined ? 180 : delay);
}

function initLiveOutputClickDelegation() {
  const container = document.getElementById('live-output-preview');
  if (container) {
    container.addEventListener('click', function(e) {
      const target = e.target.closest('[data-qid]');
      if (!target || !container.contains(target)) return;
      selectQuestion(target.dataset.qid);
    });
    container.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target.closest('[data-qid]');
      if (!target || !container.contains(target)) return;
      e.preventDefault();
      selectQuestion(target.dataset.qid);
    });
  }
}

function makeCard(q, displayNum) {
  const warnings  = detectWarnings(q);
  const recLevel  = recommendLevel(q);
  const isModified = state.modifiedIds.has(q.id);
  const isSelected = String(q.id) === String(state.selectedId);

  const div = document.createElement('div');
  div.className = [
    'q-card',
    warnings.length > 0 ? 'has-warning' : '',
    isModified ? 'modified' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ');
  div.dataset.qid = String(q.id);

  div.addEventListener('click', function() { selectQuestion(q.id); });

  // 헤더
  const header = document.createElement('div');
  header.className = 'card-header';
  const levelKey = ['하','중','상'].includes(q.level) ? q.level : 'unknown';
  header.innerHTML =
    '<span class="card-num">' + displayNum + '번</span>' +
    '<span class="card-id">id:' + q.id + '</span>' +
    '<span class="badge badge-level-' + levelKey + '">' + (q.level || '?') + '</span>' +
    (q.questionType ? '<span class="badge badge-qtype">' + q.questionType + '</span>' : '') +
    (warnings.length > 0 ? '<span class="badge badge-warning">⚠ ' + warnings.length + '</span>' : '') +
    (isModified ? '<span class="badge badge-modified">수정됨</span>' : '') +
    (recLevel !== q.level ? '<span class="badge badge-rec-diff">추천:' + recLevel + '</span>' : '');
  div.appendChild(header);

  if (q.tags && q.tags.length > 0) {
    const tags = document.createElement('div');
    tags.className = 'card-tags';
    tags.textContent = q.tags.join(', ');
    div.appendChild(tags);
  }

  const content = document.createElement('div');
  content.className = 'card-content';
  content.innerHTML = renderMathText(q.content || '');
  div.appendChild(content);

  if (q.image) {
    const sizeClass = ['small','half','medium','large','full'].includes(q.imageSize) ? ' image-' + q.imageSize : '';
    const wrap = document.createElement('div');
    wrap.className = 'q-image-wrap' + sizeClass;
    const img = document.createElement('img');
    img.dataset.imgPath = q.image;
    img.alt = q.image;
    wrap.appendChild(img);
    div.appendChild(wrap);
  }

  if (Array.isArray(q.choices) && q.choices.length > 0) {
    const ch = document.createElement('div');
    ch.className = 'card-choices';
    ch.innerHTML = q.choices.map(function(c, i) {
      return '<span class="circle-num">' + (CIRCLE_NUMS[i] || (i+1) + '.') + '</span> ' + renderMathText(String(c));
    }).join('&nbsp; ');
    div.appendChild(ch);
  }

  if (warnings.length > 0) {
    const warnDiv = document.createElement('div');
    warnDiv.className = 'card-warnings';
    warnings.slice(0, 3).forEach(function(w) {
      const b = document.createElement('span');
      b.className = 'badge badge-warning';
      b.textContent = w;
      warnDiv.appendChild(b);
    });
    if (warnings.length > 3) {
      const more = document.createElement('span');
      more.className = 'badge badge-warning';
      more.textContent = '+' + (warnings.length - 3);
      warnDiv.appendChild(more);
    }
    div.appendChild(warnDiv);
  }

  return div;
}

function renderEditorPane() {
  const placeholder = document.getElementById('editor-placeholder');
  const container   = document.getElementById('question-cards');
  container.innerHTML = '';

  if (state.currentBank.length === 0 && state.originalBank.length === 0) {
    placeholder.style.display = 'flex';
    container.style.display = 'none';
    return;
  }
  placeholder.style.display = 'none';
  container.style.display = 'flex';

  // 제거됨 필터
  if (state.activeFilter === 'removed') {
    if (state.removedItems.length === 0) {
      container.innerHTML = '<div style="padding:20px;color:#aaa;">제거된 문항 없음</div>';
      return;
    }
    state.removedItems.forEach(function(ri, i) {
      const card = makeRemovedCard(ri.item, i + 1, i);
      container.appendChild(card);
    });
    return;
  }

  const filtered = applyFilter(state.currentBank);
  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:20px;color:#aaa;">해당 조건의 문항이 없습니다.</div>';
    return;
  }

  filtered.forEach(function(e, di) {
    container.appendChild(makeCard(e.item, di + 1));
  });

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(function() {});
  }

  // 이미지 비동기 로드
  container.querySelectorAll('.q-image-wrap img[data-img-path]').forEach(async function(img) {
    const blobUrl = await getImageBlobUrl(img.dataset.imgPath);
    if (blobUrl) { img.src = blobUrl; img.style.display = 'block'; }
    else {
      const warn = document.createElement('div');
      warn.className = 'card-image-missing';
      warn.textContent = '⚠ 이미지 없음: ' + normalizeImagePath(img.dataset.imgPath);
      img.parentNode && img.parentNode.insertBefore(warn, img.nextSibling);
      img.remove();
    }
  });
}

function makeRemovedCard(q, displayNum, removedIndex) {
  const div = document.createElement('div');
  div.className = 'q-card removed-card';
  const levelKey = ['하','중','상'].includes(q.level) ? q.level : 'unknown';
  div.innerHTML =
    '<div class="card-header">' +
    '<span class="card-num">' + displayNum + '번</span>' +
    '<span class="card-id">id:' + q.id + '</span>' +
    '<span class="badge badge-level-' + levelKey + '">' + (q.level || '?') + '</span>' +
    '<span class="badge badge-removed">제거됨</span>' +
    '<button type="button" class="removed-restore-btn" data-removed-index="' + removedIndex + '">복구</button>' +
    '</div>' +
    '<div class="card-content">' + renderMathText((q.content || '').slice(0, 80)) + '</div>';
  div.querySelector('.removed-restore-btn').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    restoreRemovedItem(Number(this.dataset.removedIndex));
  });
  return div;
}

/* ================================================================
   렌더링 — 검수표 탭
================================================================ */
function makeReviewRow(q, displayNum) {
  const warnings  = detectWarnings(q);
  const recLevel  = recommendLevel(q);
  const isModified = state.modifiedIds.has(q.id);

  const tr = document.createElement('tr');
  if (warnings.length > 0) tr.classList.add('has-warning');
  if (String(q.id) === String(state.selectedId)) tr.classList.add('row-selected');
  tr.dataset.qid = String(q.id);
  tr.style.cursor = 'pointer';

  tr.addEventListener('click', function() { selectQuestion(q.id); });

  tr.innerHTML =
    '<td>' + displayNum + '</td>' +
    '<td>' + q.id + '</td>' +
    '<td>' + (q.level || '') + '</td>' +
    '<td>' + (recLevel !== q.level ? '<b style="color:#f57f17">' + recLevel + '</b>' : recLevel) + '</td>' +
    '<td>' + (q.questionType || '') + '</td>' +
    '<td class="td-preview">' + (q.tags || []).join(', ') + '</td>' +
    '<td class="td-preview">' + stripHtml(q.content || '').slice(0, 40) + '</td>' +
    '<td class="td-preview">' + String(q.answer || '').slice(0, 20) + '</td>' +
    '<td class="td-warn">' + warnings.slice(0, 2).join(' / ') + (warnings.length > 2 ? ' ...' : '') + '</td>' +
    '<td class="' + (isModified ? 'td-mod' : '') + '">' + (isModified ? '✓' : '') + '</td>' +
    '<td></td>';
  return tr;
}

function makeRemovedRow(q, displayNum, removedIndex) {
  const warnings = detectWarnings(q);
  const tr = document.createElement('tr');
  tr.style.opacity = '0.6';
  tr.innerHTML =
    '<td>' + displayNum + '</td>' +
    '<td>' + q.id + '</td>' +
    '<td>' + (q.level || '') + '</td>' +
    '<td>' + (q.questionType || '') + '</td>' +
    '<td class="td-preview">' + (q.tags || []).join(', ') + '</td>' +
    '<td class="td-preview">' + stripHtml(q.content || '').slice(0, 40) + '</td>' +
    '<td class="td-preview">' + String(q.answer || '').slice(0, 20) + '</td>' +
    '<td class="td-warn">' + warnings.slice(0, 2).join(' / ') + '</td>' +
    '<td><button type="button" class="removed-restore-btn" data-removed-index="' + removedIndex + '">복구</button></td>';
  tr.querySelector('.removed-restore-btn').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    restoreRemovedItem(Number(this.dataset.removedIndex));
  });
  return tr;
}

function restoreRemovedItem(removedIndex) {
  const ri = state.removedItems[removedIndex];
  if (!ri) return;
  if (state.currentBank.some(function(item) { return String(item.id) === String(ri.item.id); })) {
    showToast('이미 현재 문항 목록에 있는 id입니다.');
    return;
  }
  const insertAt = Math.max(0, Math.min(ri.originalIndex, state.currentBank.length));
  state.currentBank.splice(insertAt, 0, deepClone(ri.item));
  state.removedItems.splice(removedIndex, 1);
  state.selectedId = ri.item.id;
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (q) markQuestionModified(q);
  renderAll();
  if (q) openEditPanel(q);
  highlightSelected();
  schedulePersistSessionState(0);
  showToast('제거 문항 복구됨');
}

function renderTablePane() {
  const placeholder = document.getElementById('table-placeholder');
  const wrap        = document.getElementById('review-table-wrap');
  const tbody       = document.getElementById('review-table-body');
  const removedSection = document.getElementById('removed-table-section');
  const removedTbody   = document.getElementById('removed-table-body');

  tbody.innerHTML = '';
  removedTbody.innerHTML = '';

  if (state.originalBank.length === 0) {
    placeholder.style.display = 'flex';
    wrap.style.display = 'none';
    return;
  }
  placeholder.style.display = 'none';
  wrap.style.display = 'block';

  // 제거됨 필터: 본 테이블을 제거 목록으로 채움
  if (state.activeFilter === 'removed') {
    if (state.removedItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="color:#aaa;padding:12px">제거된 문항 없음</td></tr>';
    } else {
      state.removedItems.forEach(function(ri, i) { tbody.appendChild(makeRemovedRow(ri.item, i + 1, i)); });
    }
    removedSection.style.display = 'none';
    return;
  }

  const filtered = applyFilter(state.currentBank);
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="color:#aaa;padding:12px">해당 조건의 문항 없음</td></tr>';
  } else {
    filtered.forEach(function(e, di) { tbody.appendChild(makeReviewRow(e.item, di + 1)); });
  }

  // 하단 제거됨 섹션
  if (state.removedItems.length > 0) {
    removedSection.style.display = 'block';
    state.removedItems.forEach(function(ri, i) { removedTbody.appendChild(makeRemovedRow(ri.item, i + 1, i)); });
  } else {
    removedSection.style.display = 'none';
  }
}

/* ================================================================
   전체 렌더
================================================================ */
function renderCenterPane() {
  updateStats();
  updateUnsavedBadge();
  scheduleLiveOutputRender(true, 0);
}

function renderAll() {
  updateStats();
  renderFilterBtns();
  renderEditorPane();
  renderTablePane();
  scheduleLiveOutputRender(true, 0);
  updateUnsavedBadge();
}

/* ================================================================
   엔진 출력 모드 전환
================================================================ */
document.querySelectorAll('.engine-mode-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    commitEditorDraft();
    state.engineMode = btn.dataset.emode;
    document.querySelectorAll('.engine-mode-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.emode === state.engineMode);
    });
    scheduleLiveOutputRender(true, 0);
  });
});

/* ================================================================
   저장: saveCurrentFile()
================================================================ */
function captureReviewUiSnapshot() {
  return {
    selectedId: state.selectedId,
    currentFilePath: state.currentFilePath,
    currentFileHandle: state.currentFileHandle,
    currentFileName: state.currentFileName,
    fileEntries: state.fileEntries,
    archiveDirHandle: state.archiveDirHandle,
    activeFilter: state.activeFilter,
    searchQuery: state.searchQuery,
    fileSearch: state.fileSearch,
    gradeFilter: state.gradeFilter,
    examTypeFilter: state.examTypeFilter,
    engineMode: state.engineMode,
    qpp: state.qpp,
    listScrollTop: document.getElementById('file-list')?.scrollTop || 0,
    liveScrollTop: (function() {
      try {
        const frame = document.getElementById('enginePreviewFrame');
        return frame && frame.contentWindow ? frame.contentWindow.scrollY : 0;
      } catch(e) { return 0; }
    })(),
    editorScrollTop: document.getElementById('question-cards')?.scrollTop || 0,
    tableScrollTop: document.getElementById('review-table-wrap')?.scrollTop || 0,
    rightScrollTop: document.getElementById('right-panel')?.scrollTop || 0,
  };
}

function restoreReviewUiSnapshot(snap) {
  if (!snap) return;
  state.selectedId        = snap.selectedId;
  state.currentFilePath   = snap.currentFilePath;
  state.currentFileHandle = snap.currentFileHandle;
  state.currentFileName   = snap.currentFileName;
  state.fileEntries       = snap.fileEntries;
  state.archiveDirHandle  = snap.archiveDirHandle;
  state.activeFilter      = snap.activeFilter;
  state.searchQuery       = snap.searchQuery;
  state.fileSearch        = snap.fileSearch;
  state.gradeFilter       = snap.gradeFilter;
  state.examTypeFilter    = snap.examTypeFilter;
  state.engineMode        = snap.engineMode;
  state.qpp               = snap.qpp;

  setTimeout(function() {
    const fileList = document.getElementById('file-list');
    const liveFrame = document.getElementById('enginePreviewFrame');
    const cards = document.getElementById('question-cards');
    const table = document.getElementById('review-table-wrap');
    const right = document.getElementById('right-panel');
    if (fileList) fileList.scrollTop = snap.listScrollTop || 0;
    try { if (liveFrame && liveFrame.contentWindow) liveFrame.contentWindow.scrollTo(0, snap.liveScrollTop || 0); } catch(e) {}
    if (cards) cards.scrollTop = snap.editorScrollTop || 0;
    if (table) table.scrollTop = snap.tableScrollTop || 0;
    if (right) right.scrollTop = snap.rightScrollTop || 0;
  }, 0);
}

async function ensureDirectWriteReady() {
  if (!state.currentFileHandle) {
    state.canDirectSave = false;
    updateSaveModeUI();
    showError('직접 저장할 JS 파일 핸들이 없습니다. archive 폴더를 열고 왼쪽 파일 목록에서 JS 파일을 다시 선택하세요.');
    return false;
  }

  if (typeof state.currentFileHandle.queryPermission === 'function') {
    let perm = await state.currentFileHandle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted' && typeof state.currentFileHandle.requestPermission === 'function') {
      perm = await state.currentFileHandle.requestPermission({ mode: 'readwrite' });
    }
    if (perm !== 'granted') {
      state.canDirectSave = false;
      updateSaveModeUI();
      showError('현재 JS 파일 쓰기 권한이 없습니다. archive 폴더를 다시 열고 파일을 선택한 뒤 저장하세요.');
      return false;
    }
  }

  state.canDirectSave = true;
  updateSaveModeUI();
  return true;
}

async function saveCurrentFile() {
  if (state.isSaving) return;
  state.isSaving = true;

  try {
    commitEditorDraft();

    if (state.currentBank.length === 0 && state.originalBank.length > 0) {
      if (!confirm('모든 문항이 제거되어 있습니다. 그래도 저장합니까?')) return;
    }

    const summary = '수정: ' + state.modifiedIds.size + '문항 / 제거: ' + state.removedItems.length + '문항';
    if (!confirm('현재 JS 파일을 직접 덮어씁니다.\n' + summary + '\n저장 후 archive 폴더와 현재 파일 선택은 유지됩니다.')) return;

    const snap = captureReviewUiSnapshot();
    if (!await ensureDirectWriteReady()) return;

    const newSource = serializeQuestionBank(state.examTitle, state.currentBank);
    try {
      parseSource(newSource, state.currentFileName);
    } catch (e) {
      showError('직렬화 검증 실패: ' + e.message);
      return;
    }

    const writable = await state.currentFileHandle.createWritable();
    await writable.write(newSource);
    await writable.close();

    state.currentSource = newSource;
    state.originalBank = deepClone(state.currentBank);
    state.modifiedIds = new Set();
    state.removedItems = [];
    restoreReviewUiSnapshot(snap);

    renderFileList();
    renderGradeExamBtns();
    renderFilterBtns();
    renderEditorPane();
    renderTablePane();
    scheduleLiveOutputRender(true, 0);

    if (state.selectedId !== null) {
      const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
      if (q) openEditPanel(q);
    }
    highlightSelected();
    updateStats();
    updateUnsavedBadge();

    await persistSessionState();

    showToast('저장 완료: ' + state.currentFileName);
  } catch (e) {
    showError('저장 실패: ' + e.message + '\narchive 폴더와 현재 파일 선택은 유지했습니다. 백업이 필요하면 상단 백업 다운로드를 사용하세요.');
  } finally {
    state.isSaving = false;
  }
}

/* ================================================================
   다운로드 / 백업
================================================================ */
function downloadModified() {
  if (!state.currentFileName) { showToast('파일을 먼저 열어주세요.'); return; }
  commitEditorDraft();
  const src = serializeQuestionBank(state.examTitle, state.currentBank);
  downloadText(src, state.currentFileName);
  showToast('다운로드 완료');
}

function downloadBackup() {
  if (!state.currentSource || !state.currentFileName) { showToast('파일을 먼저 열어주세요.'); return; }
  const ts = formatDate();
  const name = state.currentFileName.replace(/\.js$/, '') + '.before-internal-review-' + ts + '.js';
  downloadText(state.currentSource, name);
  showToast('백업 다운로드 완료');
}

/* ================================================================
   오른쪽 패널 버튼 이벤트
================================================================ */
// 현재 문항 적용
document.getElementById('btn-apply').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  commitEditorDraft();
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) return;
  updateStats();
  renderFilterBtns();
  openEditPanel(q);
  highlightSelected();
  renderEditorPane();
  renderTablePane();
  scheduleLiveOutputRender(true, 0);
  updateUnsavedBadge();
  schedulePersistSessionState(0);
  showToast('적용됨');
});

// 제거
document.getElementById('btn-remove').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  commitEditorDraft();
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) return;
  if (!confirm('문항 id:' + q.id + '을 검수본에서 제거합니다.\n저장 전까지 되돌릴 수 있습니다.')) return;

  const originalIndex = state.currentBank.indexOf(q);
  state.removedItems.push({ item: deepClone(q), originalIndex: originalIndex });
  state.currentBank.splice(originalIndex, 1);
  state.selectedId = null;
  closeEditPanel();
  renderAll();
  schedulePersistSessionState(0);
  showToast('제거됨 (되돌리기 가능)');
});

// 되돌리기
document.getElementById('btn-revert').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) { showToast('문항을 찾을 수 없습니다.'); return; }
  const orig = state.originalBank.find(function(o) { return String(o.id) === String(q.id); });
  if (!orig) { showToast('원본을 찾을 수 없습니다.'); return; }
  Object.assign(q, deepClone(orig));
  state.modifiedIds.delete(q.id);
  openEditPanel(q);
  renderAll();
  schedulePersistSessionState(0);
  showToast('되돌림');
});

// 수정 지시 복사
document.getElementById('btn-copy-edit').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  commitEditorDraft();
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) return;

  const text = [
    '파일: ' + (state.currentFilePath || state.currentFileName),
    '문항 id: ' + q.id,
    '현재 level: ' + (q.level || ''),
    '현재 tags: ' + (q.tags || []).join(', '),
    '문제:',
    q.content || '',
    '보기:',
    (q.choices || []).join('\n'),
    '정답:',
    String(q.answer || ''),
    '해설:',
    q.solution || '',
    '',
    '수정 요청:',
    '-',
  ].join('\n');

  navigator.clipboard.writeText(text).then(function() {
    showToast('수정 지시 복사됨');
  }).catch(function() {
    showToast('클립보드 복사 실패 — 수동으로 복사하세요.');
  });
});

// 삭제 지시 복사
document.getElementById('btn-copy-delete').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  const q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
  if (!q) return;

  const text = [
    '파일: ' + (state.currentFilePath || state.currentFileName),
    '삭제 대상 id: ' + q.id,
    '사유:',
    '- 현재 발문/보기/이미지 기준으로 문제 풀이가 불완전함.',
    '',
    '요청:',
    '- 해당 questionBank object만 삭제한다.',
    '- id 재번호는 매기지 않는다.',
    '- 다른 문항은 수정하지 않는다.',
    '- node --check를 수행한다.',
  ].join('\n');

  navigator.clipboard.writeText(text).then(function() {
    showToast('삭제 지시 복사됨');
  }).catch(function() {
    showToast('클립보드 복사 실패 — 수동으로 복사하세요.');
  });
});

// image input 변경 시 미리보기 갱신
document.getElementById('e-image').addEventListener('input', function() {
  updateImagePreview(this.value.trim());
});

function handleEditFieldChanged() {
  if (state.selectedId === null) return;
  commitEditorDraft();
  updateStats();
  updateUnsavedBadge();
  scheduleLiveOutputRender(true);
  schedulePersistSessionState();
}

function initLiveEditHandlers() {
  [
    'e-level','e-qtype','e-layout','e-tags','e-content',
    'e-choices','e-answer','e-solution','e-image','e-imagesize'
  ].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, handleEditFieldChanged);
  });
}

/* ================================================================
   상단 바 버튼 이벤트
================================================================ */
document.getElementById('btn-open-dir').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation(); openArchiveDir();
});
document.getElementById('btn-open-file').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation(); openSingleFile();
});
document.getElementById('btn-save-file').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation(); saveCurrentFile();
});
document.getElementById('btn-download').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation(); downloadModified();
});
document.getElementById('btn-backup').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation(); downloadBackup();
});

/* ================================================================
   키보드 단축키
================================================================ */
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault(); saveCurrentFile();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault(); downloadModified();
  }
  if (e.key === 'Escape') {
    state.selectedId = null;
    closeEditPanel();
    highlightSelected();
  }
});

/* ================================================================
   IndexedDB 상태 영속화
   — reload가 발생해도 파일 핸들 + UI 상태를 자동 복원한다.
================================================================ */
const IDB_NAME    = 'apms-review-engine';
const IDB_VER     = 1;
const IDB_STORE   = 'session';

function idbOpen() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = function() { req.result.createObjectStore(IDB_STORE); };
    req.onsuccess = function() { resolve(req.result); };
    req.onerror   = function() { reject(req.error); };
  });
}

function idbPut(db, key, value) {
  return new Promise(function(resolve, reject) {
    var tx  = db.transaction(IDB_STORE, 'readwrite');
    var req = tx.objectStore(IDB_STORE).put(value, key);
    req.onsuccess = function() { resolve(); };
    req.onerror   = function() { reject(req.error); };
  });
}

function idbGet(db, key) {
  return new Promise(function(resolve) {
    var tx  = db.transaction(IDB_STORE, 'readonly');
    var req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = function() { resolve(req.result); };
    req.onerror   = function() { resolve(null); };
  });
}

async function persistSessionState() {
  try {
    var db = await idbOpen();
    // 파일 핸들은 IDB에 직접 저장 가능 (structured clone 지원)
    await idbPut(db, 'archiveDirHandle',   state.archiveDirHandle);
    await idbPut(db, 'currentFileHandle',  state.currentFileHandle);
    await idbPut(db, 'fileEntries',        state.fileEntries.map(function(e) {
      return { path: e.path, handle: e.handle };
    }));
    await idbPut(db, 'ui', {
      currentFilePath: state.currentFilePath,
      currentFileName: state.currentFileName,
      selectedId:      state.selectedId,
      activeFilter:    state.activeFilter,
      searchQuery:     state.searchQuery,
      engineMode:      state.engineMode,
      qpp:             state.qpp,
      examTitle:       state.examTitle,
      currentSource:   state.currentSource,
      currentBank:     state.currentBank,
      originalBank:    state.originalBank,
      modifiedIds:     Array.from(state.modifiedIds),
      removedItems:    state.removedItems,
      fileSearch:      state.fileSearch,
      gradeFilter:     state.gradeFilter,
      examTypeFilter:  state.examTypeFilter,
    });
    db.close();
  } catch(e) {
    console.warn('[검수엔진] persistSessionState 실패:', e);
  }
}

function schedulePersistSessionState(delay) {
  clearTimeout(state.persistTimer);
  state.persistTimer = setTimeout(function() {
    persistSessionState();
  }, delay === undefined ? 600 : delay);
}

async function restoreSessionState() {
  try {
    var db = await idbOpen();
    var archiveDirHandle  = await idbGet(db, 'archiveDirHandle');
    var currentFileHandle = await idbGet(db, 'currentFileHandle');
    var fileEntries       = await idbGet(db, 'fileEntries');
    var ui                = await idbGet(db, 'ui');
    db.close();

    if (!archiveDirHandle || !ui || !ui.currentBank) return false;

    // 디렉토리 권한 확인 (이미 granted면 대화상자 없음)
    var perm = await archiveDirHandle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') {
      // prompt 필요 → 복원 버튼 표시
      showRestorePrompt(archiveDirHandle, currentFileHandle, fileEntries, ui);
      return false;
    }

    await applyRestoredState(archiveDirHandle, currentFileHandle, fileEntries, ui);
    return true;
  } catch(e) {
    console.warn('[검수엔진] restoreSessionState 실패:', e);
    return false;
  }
}

async function applyRestoredState(archiveDirHandle, currentFileHandle, fileEntries, ui) {
  state.archiveDirHandle  = archiveDirHandle;
  state.currentFileHandle = currentFileHandle;
  state.fileEntries       = Array.isArray(fileEntries) ? fileEntries : [];
  state.currentFilePath   = ui.currentFilePath  || '';
  state.currentFileName   = ui.currentFileName  || '';
  state.selectedId        = ui.selectedId       !== undefined ? ui.selectedId : null;
  state.activeFilter      = ui.activeFilter     || 'all';
  state.searchQuery       = ui.searchQuery      || '';
  state.engineMode        = ui.engineMode       || 'exam';
  state.qpp               = ui.qpp              || 4;
  state.examTitle         = ui.examTitle        || '';
  state.currentBank       = ui.currentBank      || [];
  state.originalBank      = ui.originalBank     || [];
  state.currentSource     = ui.currentSource || serializeQuestionBank(state.examTitle, state.originalBank);
  state.fileSearch        = ui.fileSearch       || '';
  state.gradeFilter       = ui.gradeFilter      || '';
  state.examTypeFilter    = ui.examTypeFilter   || '';
  state.canDirectSave     = true;
  state.modifiedIds       = new Set(Array.isArray(ui.modifiedIds) ? ui.modifiedIds : []);
  state.removedItems      = Array.isArray(ui.removedItems) ? ui.removedItems : [];
  await buildImageMap(archiveDirHandle);

  // 디렉토리 상태 표시
  if (archiveDirHandle) {
    var dirStatus = document.getElementById('left-dir-status');
    dirStatus.textContent = 'archive 폴더: ' + archiveDirHandle.name + ' (복원됨)';
    dirStatus.classList.add('open');
  }
  if (ui.currentFileName) {
    document.getElementById('status-file').textContent =
      ui.currentFileName + ' (' + (ui.currentBank || []).length + '문항) [복원됨]';
  }

  updateSaveModeUI();
  renderFileList();
  renderAll();

  refreshEnginePreviewFrameOnly();

  // 선택된 문항 패널 복원
  if (state.selectedId !== null) {
    var q = state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); });
    if (q) {
      scheduleLiveOutputRender(true, 0);
      openEditPanel(q);
      highlightSelected();
    }
  }

  showToast('이전 작업 상태가 복원되었습니다.', 3000);
}

function showRestorePrompt(archiveDirHandle, currentFileHandle, fileEntries, ui) {
  var bar = document.createElement('div');
  bar.id = 'restore-bar';
  bar.style.cssText = 'position:fixed;top:46px;left:0;right:0;z-index:500;background:#1565c0;color:#fff;' +
    'padding:8px 16px;font-size:12px;display:flex;align-items:center;gap:12px;';
  bar.innerHTML =
    '<span>이전 작업 상태를 복원할 수 있습니다. (폴더 접근 권한 필요)</span>' +
    '<button type="button" id="restore-btn" style="background:#fff;color:#1565c0;border:none;' +
    'border-radius:4px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;">복원하기</button>' +
    '<button type="button" id="restore-dismiss" style="background:transparent;color:#fff;border:1px solid #fff;' +
    'border-radius:4px;padding:4px 10px;font-size:11px;cursor:pointer;">무시</button>';
  document.body.appendChild(bar);

  document.getElementById('restore-btn').addEventListener('click', async function() {
    bar.remove();
    try {
      var perm = await archiveDirHandle.requestPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        if (currentFileHandle) {
          await currentFileHandle.requestPermission({ mode: 'readwrite' });
        }
        await applyRestoredState(archiveDirHandle, currentFileHandle, fileEntries, ui);
      }
    } catch(e) {
      showToast('복원 실패: ' + e.message);
    }
  });

  document.getElementById('restore-dismiss').addEventListener('click', function() {
    bar.remove();
  });
}

/* ================================================================
   사이드바 / 필터 접기 토글
================================================================ */
function initSidebarToggle() {
  var layout  = document.getElementById('main-layout');
  var btn     = document.getElementById('sidebar-toggle');
  if (!layout || !btn) return;

  var collapsed = localStorage.getItem('re-sidebar-collapsed') === '1';

  function apply(c) {
    if (c) {
      layout.classList.add('sidebar-collapsed');
      btn.textContent = '▶';
      btn.title = '사이드바 펼치기';
    } else {
      layout.classList.remove('sidebar-collapsed');
      btn.textContent = '◀';
      btn.title = '사이드바 접기';
    }
  }

  apply(collapsed);

  btn.addEventListener('click', function(e) {
    e.preventDefault(); e.stopPropagation();
    collapsed = !collapsed;
    localStorage.setItem('re-sidebar-collapsed', collapsed ? '1' : '0');
    apply(collapsed);
  });
}

function initFilterToggle() {
  var area = document.getElementById('filter-area');
  var btn  = document.getElementById('filter-toggle-btn');
  var hdr  = document.getElementById('filter-area-header');
  if (!area || !btn || !hdr) return;

  var collapsed = localStorage.getItem('re-filter-collapsed') === '1';

  function apply(c) {
    if (c) {
      area.classList.add('filter-collapsed');
      btn.title = '필터 펼치기';
    } else {
      area.classList.remove('filter-collapsed');
      btn.title = '필터 접기';
    }
  }

  apply(collapsed);

  hdr.addEventListener('click', function(e) {
    e.preventDefault();
    collapsed = !collapsed;
    localStorage.setItem('re-filter-collapsed', collapsed ? '1' : '0');
    apply(collapsed);
  });
}

/* ================================================================
   초기화
================================================================ */
(async function init() {
  updateSaveModeUI();
  renderFilterBtns();
  document.getElementById('left-stats').innerHTML = '<span>파일을 열어주세요</span>';

  initSidebarToggle();
  initFilterToggle();
  initLiveOutputClickDelegation();
  initLiveEditHandlers();
  renderGradeExamBtns();

  // 이전 세션 복원 시도
  await restoreSessionState();
})();
