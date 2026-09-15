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
  examDisplayTitle: '',
  sourceIdentity: '',
  sourceRequestId: '',
  sourceFingerprint: '',
  loadedFingerprint: '',
  originalBank: [],           // 되돌리기용 deep clone
  currentBank: [],
  selectedId: null,           // 선택된 문항의 id (인덱스 아님)
  selectedSourceRef: '',
  modifiedIds: new Set(),
  removedItems: [],           // {item, originalIndex} 보관
  activeFilter: 'all',
  gradeFilter: '',            // '' | '중1' | '중2' | '중3' | '고1' | '고2'
  examTypeFilter: '',         // '' | '중간' | '기말'
  semesterFilter: '',
  subjectFilter: '',
  searchQuery: '',
  engineMode: 'exam',         // exam / sol / ans
  qpp: 4,
  canDirectSave: false,
  isSaving: false,
  imageMap: new Map(),        // normalizedPath → FileSystemFileHandle
  questionSourceRefs: new Map(),
  fileSearch: '',
  reviewBridge: null,
  bridgeEpoch: 0,
  sourceEpoch: 0,
  revision: 0,
  draftRevision: 0,
  requestedPreviewRevision: 0,
  visiblePreviewRevision: 0,
  saveRevision: 0,
  postWriteVerifiedRevision: 0,
  previewStatus: 'BOOTING',
  previewRenderTimer: null,
  isComposing: false,
  compositionDirty: false,
  assetRevision: 0,
  assetFingerprint: '',
  imagePreviewSerial: 0,
  editorRenderSerial: 0,
  reviewMetrics: {
    draftAtByRevision: {},
    bridgeSendAtByRevision: {},
    renderStartAtByRevision: {},
    editToRenderDoneMs: [],
    draftToBridgeSendMs: [],
    renderQueueWaitMs: [],
    coalescedRevisionCount: 0,
    staleDiscardCount: 0,
    fullReloadCount: 0,
  },
  persistTimer: null,
  loadSerial: 0,
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

const LATEX_ESCAPE_WARNING_PATTERNS = [
  { label: 'LaTeX 백슬래시 과다', re: /\\\\(?:implies|times|dfrac|frac|sqrt|pm|left|right|text|lt|gt)(?:\b|\{|\s|[+\-=])/ },
  { label: 'LaTeX 부등호 명령 결합', re: /\\(?:lt|gt)[A-Za-z]/ },
  { label: 'LaTeX 미지원 textcircled', re: /\\textcircled\{/ },
  { label: 'LaTeX pm 백슬래시 소실', re: /(^|[^\\A-Za-z])pm(?=\\(?:text|sqrt|dfrac|frac)|[0-9])/ },
];

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
const SEMESTER_FILTERS = ['1학기','2학기'];
const SUBJECT_FILTERS = ['대수','수1','수2','미적분1','미적분2','확률과통계','기하','공통수학1','공통수학2'];

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

function getSemesterFromPath(path) {
  const p = path.toLowerCase();
  if (/1학기|\/1(?:mid|final)\//.test(p)) return '1학기';
  if (/2학기|\/2(?:mid|final)\//.test(p)) return '2학기';
  return null;
}

function getSubjectFromPath(path) {
  const name = String(path || '').split('/').pop() || String(path || '');
  const compact = name.replace(/\s+/g, '').replace(/\.c?js$/i, '').toLowerCase();
  if (/확률과통계|확통/.test(compact)) return '확률과통계';
  if (/공통수학1|공수1/.test(compact)) return '공통수학1';
  if (/공통수학2|공수2/.test(compact)) return '공통수학2';
  if (/미적분\s*1|미적분i|미적분Ⅰ|미적1/.test(name) || /미적분1|미적1/.test(compact)) return '미적분1';
  if (/미적분\s*2|미적분ii|미적분Ⅱ|미적2/.test(name) || /미적분2|미적2/.test(compact)) return '미적분2';
  if (/수학\s*i(?!i)|수학Ⅰ|수1/.test(name) || /수학i(?!i)|수1/.test(compact)) return '수1';
  if (/수학\s*ii|수학Ⅱ|수2/.test(name) || /수학ii|수2/.test(compact)) return '수2';
  if (/대수/.test(compact)) return '대수';
  if (/기하/.test(compact)) return '기하';
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
  LATEX_ESCAPE_WARNING_PATTERNS.forEach(function(p) {
    if (p.re.test(allText)) warnings.push(p.label);
  });

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

function getSourceIdentityForPath(filePath, fileName) {
  const normalized = String(filePath || fileName || '').replace(/\\/g, '/').replace(/^\/+/, '');
  return normalized.replace(/^exams\//i, '') || String(fileName || 'archive.js');
}

function deriveReviewQuestionSourceRef(q, index, sourceIdentity = state.sourceIdentity) {
  const sourceArchiveFile = String(
    q?.sourceArchiveFile || q?.source_archive_file || q?.sourceRef?.sourceArchiveFile ||
    sourceIdentity || state.currentFileName || 'archive.js'
  ).replace(/^exams\//i, '').replace(/^\/+/, '');
  const sourceRef = q?.sourceRef;
  const sourceUid = String(
    q?.questionUid || q?.sourceQuestionUid || q?.source_question_uid ||
    sourceRef?.sourceQuestionUid || sourceRef?.questionUid || ''
  ).trim();
  const sourceOrdinal = Number(
    q?.sourceOrdinal || q?.sourceQuestionOrdinal || q?.source_question_ordinal ||
    sourceRef?.sourceOrdinal || sourceRef?.sourceQuestionOrdinal || index + 1
  ) || index + 1;
  return `${sourceArchiveFile}#${sourceUid || `legacy:${sourceArchiveFile}#ordinal:${sourceOrdinal}`}`;
}

function registerReviewQuestionSourceRefs(bank, sourceIdentity = state.sourceIdentity, sourceRefs = []) {
  (Array.isArray(bank) ? bank : []).forEach(function(q, index) {
    const sourceRef = sourceRefs[index] || deriveReviewQuestionSourceRef(q, index, sourceIdentity);
    state.questionSourceRefs.set(q, sourceRef);
  });
}

function getReviewQuestionSourceRef(q, index) {
  return state.questionSourceRefs.get(q) || deriveReviewQuestionSourceRef(q, index);
}

function findQuestionBySourceRef(sourceRef) {
  const wanted = String(sourceRef || '').trim();
  if (!wanted) return null;
  return state.currentBank.find(function(q, index) { return getReviewQuestionSourceRef(q, index) === wanted; }) || null;
}

function findQuestionBySourceRefIn(bank, sourceRef) {
  const wanted = String(sourceRef || '').trim();
  return (Array.isArray(bank) ? bank : []).find(function(q, index) {
    return getReviewQuestionSourceRef(q, index) === wanted;
  }) || null;
}

function getCurrentEditorQuestion() {
  if (state.selectedSourceRef) return findQuestionBySourceRef(state.selectedSourceRef);
  if (state.selectedId === null) return null;
  return state.currentBank.find(function(item) { return String(item.id) === String(state.selectedId); }) || null;
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

function updateUnsavedBadge() {
  const badge = document.getElementById('unsaved-badge');
  if (!badge) return;
  badge.style.display = hasUnsavedChanges() ? 'block' : 'none';
}

function hasUnsavedChanges() {
  reconcileModifiedIds();
  if (state.modifiedIds.size === 0 && state.removedItems.length > 0 && banksHaveSameContent(state.currentBank, state.originalBank)) {
    state.removedItems = [];
  }
  return state.modifiedIds.size > 0 || state.removedItems.length > 0;
}

function confirmDiscardUnsaved() {
  commitEditorDraft();
  if (!hasUnsavedChanges()) return true;
  return window.confirm('미저장 수정이 있습니다. 현재 수정 내용을 버리고 이동하시겠습니까?');
}

/* ================================================================
   JS 파싱
================================================================ */
function parseSource(source, fileName) {
  if (!window.APReviewSourceWriter?.parseArchiveSource) throw new Error('SOURCE_WRITER_UNAVAILABLE');
  const parsed = window.APReviewSourceWriter.parseArchiveSource(source, fileName);
  return { title: parsed.title, displayTitle: parsed.displayTitle, bank: parsed.bank, bankShape: parsed.bankShape };
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

function serializeQuestionBank(examTitle, bank, source = state.currentSource) {
  if (source && window.APReviewSourceWriter?.replaceQuestionBankPreservingSource) {
    return window.APReviewSourceWriter.replaceQuestionBankPreservingSource(source, bank);
  }
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

function banksHaveSameContent(a, b) {
  return stableQuestionString(a || []) === stableQuestionString(b || []);
}

function markQuestionModified(q) {
  if (!q) return;
  const sourceRef = getReviewQuestionSourceRef(q, state.currentBank.indexOf(q));
  const orig = findQuestionBySourceRefIn(state.originalBank, sourceRef);
  if (!orig || stableQuestionString(orig) !== stableQuestionString(q)) {
    state.modifiedIds.add(q.id);
  } else {
    state.modifiedIds.delete(q.id);
  }
}

function reconcileModifiedIds() {
  const next = new Set();
  state.currentBank.forEach(function(q) {
    const orig = findQuestionBySourceRefIn(state.originalBank, getReviewQuestionSourceRef(q, state.currentBank.indexOf(q)));
    if (!orig || stableQuestionString(orig) !== stableQuestionString(q)) next.add(q.id);
  });
  state.modifiedIds = next;
}

function originalHasField(q, key) {
  const orig = findQuestionBySourceRefIn(state.originalBank, getReviewQuestionSourceRef(q, state.currentBank.indexOf(q)));
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

const LAYOUT_TAG_OPTIONS = [
  'grid',
  'subjective-2up',
  'subjective-4up',
  'fullwidth'
];

function syncLayoutTagCustomInput() {
  const select = document.getElementById('e-layout');
  const customInput = document.getElementById('e-layout-custom');
  if (!select || !customInput) return;
  customInput.style.display = select.value === 'custom' ? 'block' : 'none';
}

function getEditorLayoutTag() {
  const select = document.getElementById('e-layout');
  const customInput = document.getElementById('e-layout-custom');
  if (!select) return 'grid';
  if (select.value !== 'custom') return select.value || 'grid';
  return customInput && customInput.value.trim() ? customInput.value.trim() : 'custom';
}

function setEditorLayoutTag(layoutTag) {
  const select = document.getElementById('e-layout');
  const customInput = document.getElementById('e-layout-custom');
  if (!select || !customInput) return;

  const value = typeof layoutTag === 'string' && layoutTag.trim()
    ? layoutTag.trim()
    : 'grid';

  if (LAYOUT_TAG_OPTIONS.indexOf(value) !== -1) {
    select.value = value;
    customInput.value = '';
  } else {
    select.value = 'custom';
    customInput.value = value;
  }
  syncLayoutTagCustomInput();
}

function commitEditorDraft() {
  if (state.selectedId === null) return false;
  const q = getCurrentEditorQuestion();
  if (!q) return false;
  const before = stableQuestionString(q);

  setDraftStringField(q, 'level', document.getElementById('e-level').value);
  setDraftStringField(q, 'questionType', document.getElementById('e-qtype').value);
  setDraftStringField(q, 'layoutTag', getEditorLayoutTag());
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
  return before !== stableQuestionString(q);
}

/* ================================================================
   문항 선택
================================================================ */
function selectQuestion(id) {
  const byId = state.currentBank.find(function(item) { return String(item.id) === String(id); });
  if (byId) return selectQuestionBySourceRef(getReviewQuestionSourceRef(byId, state.currentBank.indexOf(byId)));
  state.selectedId = id;
  state.selectedSourceRef = '';
  closeEditPanel();
  highlightSelected();
}

function selectQuestionBySourceRef(sourceRef) {
  // 1. 이전 draft 저장
  commitEditorDraft();
  // 2. 선택 설정
  state.selectedSourceRef = String(sourceRef || '').trim();
  // 3. sourceRef로 currentBank에서 찾기
  const q = findQuestionBySourceRef(state.selectedSourceRef);
  state.selectedId = q ? q.id : null;
  if (!q) { closeEditPanel(); return; }
  // 4. 오른쪽 패널 채우기
  openEditPanel(q);
  // 5. 카드/행 강조 갱신
  highlightSelected();
  refreshLiveEngineSelection();
  schedulePersistSessionState();
}

function refreshLiveEngineSelection() {
  const iframe = document.getElementById('enginePreviewFrame');
  if (!iframe || !iframe.contentDocument) return;
  try {
    iframe.contentDocument.querySelectorAll('[data-source-ref]').forEach(function(el) {
      el.classList.toggle('ir-live-selected', el.getAttribute('data-source-ref') === state.selectedSourceRef);
    });
  } catch(e) {}
}

function highlightSelected() {
  // 카드
  document.querySelectorAll('.q-card').forEach(function(card) {
    card.classList.toggle('selected', card.dataset.sourceRef === state.selectedSourceRef);
  });
  // 검수표 행
  document.querySelectorAll('#review-table tbody tr').forEach(function(tr) {
    tr.classList.toggle('row-selected', tr.dataset.sourceRef === state.selectedSourceRef);
  });
  document.querySelectorAll('.ir-live-question, .ir-live-answer-table tr').forEach(function(el) {
    el.classList.toggle('selected', el.dataset.sourceRef === state.selectedSourceRef);
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
  setEditorLayoutTag(q.layoutTag);
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
  const serial = ++state.imagePreviewSerial;
  if (el._reviewObjectUrl) {
    try { URL.revokeObjectURL(el._reviewObjectUrl); } catch (_) {}
    el._reviewObjectUrl = '';
  }
  el.innerHTML = '';
  if (!imgPath) return;
  const normalized = normalizeImagePath(imgPath);
  if (state.imageMap.size > 0) {
    const blobUrl = await getImageBlobUrl(normalized);
    if (serial !== state.imagePreviewSerial) {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      return;
    }
    if (blobUrl) {
      el._reviewObjectUrl = blobUrl;
      const image = document.createElement('img');
      image.src = blobUrl;
      image.alt = normalized;
      el.appendChild(image);
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
async function loadBank(source, fileName) {
  const loadSerial = ++state.loadSerial;
  clearError();
  let parsed;
  try {
    parsed = parseSource(source, fileName);
  } catch (e) {
    showError('파싱 실패: ' + e.message + '\n파일: ' + fileName);
    return;
  }
  let sourceFingerprint;
  try {
    sourceFingerprint = await window.APReviewSourceWriter.fingerprintText(source);
  } catch (e) {
    showError('source fingerprint 생성 실패: ' + e.message + '\n파일: ' + fileName);
    return;
  }
  if (loadSerial !== state.loadSerial) return;

  state.currentSource  = source;
  state.currentFileName = fileName;
  state.examTitle      = parsed.title;
  state.examDisplayTitle = parsed.displayTitle || parsed.title;
  state.sourceIdentity = getSourceIdentityForPath(state.currentFilePath, fileName);
  state.sourceRequestId = state.sourceIdentity + ':' + sourceFingerprint;
  state.sourceFingerprint = sourceFingerprint;
  state.loadedFingerprint = sourceFingerprint;
  state.originalBank   = deepClone(parsed.bank);
  state.currentBank    = deepClone(parsed.bank);
  state.questionSourceRefs.clear();
  registerReviewQuestionSourceRefs(state.originalBank, state.sourceIdentity);
  registerReviewQuestionSourceRefs(state.currentBank, state.sourceIdentity);
  state.modifiedIds    = new Set();
  state.removedItems   = [];
  state.selectedId     = null;
  state.selectedSourceRef = '';
  state.revision = 0;
  state.draftRevision = 0;
  state.requestedPreviewRevision = 0;
  state.visiblePreviewRevision = 0;
  state.saveRevision = 0;
  state.postWriteVerifiedRevision = 0;
  state.previewStatus = 'BOOTING';
  resetReviewMetrics();
  state.assetFingerprint = '';
  state.assetRevision = 0;
  const previewFrame = document.getElementById('enginePreviewFrame');
  if (previewFrame) previewFrame.style.visibility = 'visible';
  if (state.reviewBridge) {
    const tuple = state.reviewBridge.beginSource();
    state.bridgeEpoch = tuple.bridgeEpoch;
    state.sourceEpoch = tuple.sourceEpoch;
  } else {
    state.sourceEpoch += 1;
  }

  document.getElementById('status-file').textContent = fileName + ' (' + parsed.bank.length + '문항)';
  closeEditPanel();
  updateSaveModeUI();
  renderAll();

  queueReviewPreviewRevision(true);
  updateUnsavedBadge();
  persistSessionState();

  showToast(fileName + ' 로드 완료 (' + parsed.bank.length + '문항)');
}

/* ================================================================
   archive 폴더 열기
================================================================ */
async function autoloadFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const dataPath = params.get('data') || params.get('autoload');
  if (!dataPath) return false;
  if (/^[a-z]+:/i.test(dataPath) || dataPath.includes('..')) {
    showError('자동 로드 경로가 올바르지 않습니다: ' + dataPath);
    return true;
  }
  try {
    const normalized = dataPath.replace(/^\/+/, '');
    const archiveRelative = normalized.startsWith('archive/') ? normalized : 'archive/' + normalized;
    const response = await fetch('../' + archiveRelative);
    if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
    const source = await response.text();
    const fileName = normalized.split(/[\\/]/).pop() || 'autoload.js';
    state.currentFilePath = archiveRelative.replace(/^archive\//i, '');
    state.currentFileHandle = null;
    state.canDirectSave = false;
    const previewFrame = document.getElementById('enginePreviewFrame');
    if (previewFrame) previewFrame.style.visibility = 'hidden';
    loadBank(source, fileName);
    return true;
  } catch (e) {
    showError('자동 로드 실패: ' + e.message + '\n경로: ' + dataPath);
    return true;
  }
}

async function openArchiveDir() {
  if (!window.showDirectoryPicker) {
    showError('showDirectoryPicker 미지원. Chrome/Edge 최신 버전에서 localhost로 접속하세요.');
    return;
  }
  if (!confirmDiscardUnsaved()) return;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    state.loadSerial += 1;
    state.archiveDirHandle = handle;
    state.currentFileHandle = null;
    state.currentFilePath = '';
    state.currentFileName = '';
    state.currentSource = '';
    state.examTitle = '';
    state.examDisplayTitle = '';
    state.sourceIdentity = '';
    state.sourceRequestId = '';
    state.sourceFingerprint = '';
    state.loadedFingerprint = '';
    state.originalBank = [];
    state.currentBank = [];
    state.questionSourceRefs.clear();
    state.selectedId = null;
    state.selectedSourceRef = '';
    state.modifiedIds = new Set();
    state.removedItems = [];
    state.canDirectSave = false;
    const previewFrame = document.getElementById('enginePreviewFrame');
    if (previewFrame) previewFrame.style.visibility = 'hidden';
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
  if (!confirmDiscardUnsaved()) return;
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
    await loadBank(src, handle.name);
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
    if (state.semesterFilter && getSemesterFromPath(e.path) !== state.semesterFilter) return false;
    if (state.subjectFilter && getSubjectFromPath(e.path) !== state.subjectFilter) return false;
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
      if (!confirmDiscardUnsaved()) return;
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

  var semesterWrap = document.getElementById('semester-filter-btns');
  if (semesterWrap) {
    semesterWrap.innerHTML = '';
    SEMESTER_FILTERS.forEach(function(s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn semester' + (state.semesterFilter === s ? ' active' : '');
      btn.textContent = s;
      btn.addEventListener('click', function() {
        commitEditorDraft();
        state.semesterFilter = (state.semesterFilter === s) ? '' : s;
        renderGradeExamBtns();
        renderFileList();
        renderCenterPane();
      });
      semesterWrap.appendChild(btn);
    });
  }

  var subjectWrap = document.getElementById('subject-filter-btns');
  if (subjectWrap) {
    subjectWrap.innerHTML = '';
    SUBJECT_FILTERS.forEach(function(s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn subject' + (state.subjectFilter === s ? ' active' : '');
      btn.textContent = s;
      btn.addEventListener('click', function() {
        commitEditorDraft();
        state.subjectFilter = (state.subjectFilter === s) ? '' : s;
        renderGradeExamBtns();
        renderFileList();
        renderCenterPane();
      });
      subjectWrap.appendChild(btn);
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
  reconcileModifiedIds();
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
   렌더링 — persistent canonical preview bridge
================================================================ */
function setReviewPreviewStatus(status, message) {
  state.previewStatus = status;
  const el = document.getElementById('status-preview');
  if (el) el.textContent = message || (status === 'RENDERING' ? '미리보기 갱신 중…' : status === 'ERROR' ? '미리보기를 갱신하지 못했습니다.' : '');
  document.documentElement.dataset.apReviewPreviewStatus = status;
}

function nowReviewMetric() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();
}

function publishReviewMetrics() {
  document.documentElement.dataset.apReviewMetrics = JSON.stringify({
    ...state.reviewMetrics,
    latest: {
      draftRevision: state.draftRevision,
      requestedPreviewRevision: state.requestedPreviewRevision,
      visiblePreviewRevision: state.visiblePreviewRevision,
      saveRevision: state.saveRevision,
      postWriteVerifiedRevision: state.postWriteVerifiedRevision,
    },
  });
}

function resetReviewMetrics() {
  state.reviewMetrics = {
    draftAtByRevision: {},
    bridgeSendAtByRevision: {},
    renderStartAtByRevision: {},
    editToRenderDoneMs: [],
    draftToBridgeSendMs: [],
    renderQueueWaitMs: [],
    coalescedRevisionCount: 0,
    staleDiscardCount: 0,
    fullReloadCount: 0,
  };
  state.reviewBridgeFallbackAttempt = false;
  publishReviewMetrics();
}

function syncReviewBridgeTuple(tuple) {
  if (!tuple) return;
  state.bridgeEpoch = tuple.bridgeEpoch;
  state.sourceEpoch = tuple.sourceEpoch;
  state.revision = tuple.revision;
  state.draftRevision = tuple.revision;
}

function ensureReviewPreviewBridge() {
  if (state.reviewBridge) return state.reviewBridge;
  const iframe = document.getElementById('enginePreviewFrame');
  if (!iframe || typeof window.APReviewPreviewBridge?.createReviewPreviewBridge !== 'function') {
    setReviewPreviewStatus('ERROR');
    showError('Review Preview Bridge를 초기화할 수 없습니다.');
    return null;
  }
  let bridge;
  bridge = window.APReviewPreviewBridge.createReviewPreviewBridge({
    iframe,
    src: 'engine.html?preview=1&reviewBridge=1&prewarm=0',
    initialTuple: { bridgeEpoch: 0, sourceEpoch: 0, revision: 0 },
    onQuestionSelect: sourceRef => selectQuestionBySourceRef(sourceRef),
    onEvent: (event, message) => {
      state.lastBridgeEvent = event;
      state.lastBridgeMessage = message;
      const revision = Number(message?.revision);
      const at = nowReviewMetric();
      if (event === 'REVIEW_BRIDGE_READY') state.reviewBridgeFallbackAttempt = false;
      if (Number.isInteger(revision)) {
        if (event === 'REVIEW_SET_SOURCE') {
          state.reviewMetrics.bridgeSendAtByRevision[revision] = at;
          const draftAt = state.reviewMetrics.draftAtByRevision[revision];
          if (draftAt !== undefined) state.reviewMetrics.draftToBridgeSendMs.push(Number((at - draftAt).toFixed(2)));
        } else if (event === 'REVIEW_RENDER_START') {
          state.reviewMetrics.renderStartAtByRevision[revision] = at;
          const sendAt = state.reviewMetrics.bridgeSendAtByRevision[revision];
          if (sendAt !== undefined) state.reviewMetrics.renderQueueWaitMs.push(Number((at - sendAt).toFixed(2)));
        } else if (event === 'REVIEW_RENDER_DONE') {
          const draftAt = state.reviewMetrics.draftAtByRevision[revision];
          if (draftAt !== undefined) state.reviewMetrics.editToRenderDoneMs.push(Number((at - draftAt).toFixed(2)));
          if (message.payload?.metrics) state.reviewMetrics.canonicalLast = message.payload.metrics;
        }
      }
      publishReviewMetrics();
      if (event === 'REVIEW_RENDER_ERROR') setReviewPreviewStatus('ERROR', '미리보기를 갱신하지 못했습니다.');
    },
    onFatal: reason => {
      if (state.reviewBridgeFallbackAttempt) {
        setReviewPreviewStatus('ERROR');
        showError('미리보기 엔진을 초기화하지 못했습니다: ' + reason);
        return;
      }
      state.reviewBridgeFallbackAttempt = true;
      state.reviewMetrics.fullReloadCount += 1;
      const tuple = bridge.reloadForFatal(reason);
      syncReviewBridgeTuple(tuple);
      if (state.currentBank.length > 0) setTimeout(function() { dispatchReviewPreviewRevision(state.revision); }, 0);
    },
  });
  state.reviewBridge = bridge;
  window.__AP_REVIEW_DEBUG__ = function() {
    return {
      bridge: bridge.getState(),
      sourceIdentity: state.sourceIdentity,
      sourceEpoch: state.sourceEpoch,
      draftRevision: state.draftRevision,
      requestedPreviewRevision: state.requestedPreviewRevision,
      visiblePreviewRevision: state.visiblePreviewRevision,
      saveRevision: state.saveRevision,
      postWriteVerifiedRevision: state.postWriteVerifiedRevision,
      previewStatus: state.previewStatus,
      idbMetrics: state.idbMetrics || null,
    };
  };
  syncReviewBridgeTuple(bridge.tuple);
  bridge.start();
  return bridge;
}

function capturePreviewAnchor() {
  const iframe = document.getElementById('enginePreviewFrame');
  if (!iframe?.contentWindow || !iframe.contentDocument) return null;
  try {
    const node = state.selectedSourceRef
      ? iframe.contentDocument.querySelector(`[data-source-ref="${CSS.escape(state.selectedSourceRef)}"]`)
      : null;
    return {
      sourceRef: state.selectedSourceRef,
      viewportTop: node ? node.getBoundingClientRect().top : null,
      scrollTop: iframe.contentWindow.scrollY || 0,
    };
  } catch (_) {
    return { sourceRef: state.selectedSourceRef, viewportTop: null, scrollTop: iframe.contentWindow.scrollY || 0 };
  }
}

function restorePreviewAnchor(anchor) {
  const iframe = document.getElementById('enginePreviewFrame');
  if (!iframe?.contentWindow || !iframe.contentDocument || !anchor) return;
  try {
    const node = anchor.sourceRef
      ? iframe.contentDocument.querySelector(`[data-source-ref="${CSS.escape(anchor.sourceRef)}"]`)
      : null;
    if (node && anchor.viewportTop !== null) {
      iframe.contentWindow.scrollBy(0, node.getBoundingClientRect().top - anchor.viewportTop);
    } else {
      iframe.contentWindow.scrollTo(0, anchor.scrollTop || 0);
    }
  } catch (_) {}
}

function buildReviewPreviewSnapshot(tuple, bank = state.currentBank) {
  const questionBank = bank.map(function(question, index) {
    const copy = deepClone(question);
    // This is review-only transport metadata. It keeps legacy questions with
    // no source UID stable after another question is removed or restored;
    // it is never written back by the source-preserving writer.
    copy.reviewSourceRef = getReviewQuestionSourceRef(question, index);
    return copy;
  });
  return {
    sourceKind: 'review-snapshot',
    sourceRequestId: state.sourceRequestId,
    questionBank,
    examTitle: state.examTitle,
    examDisplayTitle: state.examDisplayTitle || state.examTitle,
    sourceArchiveFile: state.sourceIdentity,
    assetRevision: String(state.assetRevision || 0),
    mode: state.engineMode,
    qpp: state.qpp,
    ...tuple,
  };
}

async function refreshReviewAssetRevision() {
  const imageStats = [];
  for (const question of state.currentBank) {
    for (const rawPath of [question.image, question.solutionImage]) {
      const key = normalizeImagePath(rawPath || '');
      if (!key) continue;
      const handle = state.imageMap.get(key);
      if (!handle) {
        imageStats.push(`${key}:missing`);
        continue;
      }
      try {
        const file = await handle.getFile();
        imageStats.push(`${key}:${file.lastModified || 0}:${file.size || 0}`);
      } catch (_) {
        imageStats.push(`${key}:unreadable`);
      }
    }
  }
  imageStats.sort();
  const fingerprint = await window.APReviewSourceWriter.fingerprintText(imageStats.join('\n'));
  if (state.assetFingerprint !== fingerprint) {
    if (state.assetFingerprint) state.assetRevision += 1;
    state.assetFingerprint = fingerprint;
  }
  return state.assetRevision;
}

async function dispatchReviewPreviewRevision(revision) {
  const bridge = ensureReviewPreviewBridge();
  if (!bridge || revision !== state.revision || !state.currentFileName) return { ok: false, code: 'REVIEW_PREVIEW_NOT_READY' };
  await refreshReviewAssetRevision();
  if (revision !== state.revision) {
    state.reviewMetrics.staleDiscardCount += 1;
    publishReviewMetrics();
    return { ok: false, code: 'DISCARDED_STALE' };
  }
  const tuple = { bridgeEpoch: state.bridgeEpoch, sourceEpoch: state.sourceEpoch, revision };
  const anchor = capturePreviewAnchor();
  setReviewPreviewStatus('RENDERING');
  const accepted = await bridge.sendSnapshot(buildReviewPreviewSnapshot(tuple));
  if (!accepted.ok) {
    if (accepted.code !== 'COALESCED') setReviewPreviewStatus('ERROR', '미리보기를 갱신하지 못했습니다.');
    return accepted;
  }
  try {
    const outcome = await bridge.waitForRevision(tuple);
    if (revision !== state.revision || state.sourceEpoch !== tuple.sourceEpoch) {
      state.reviewMetrics.staleDiscardCount += 1;
      publishReviewMetrics();
      return { ok: false, code: 'DISCARDED_STALE' };
    }
    state.visiblePreviewRevision = revision;
    state.requestedPreviewRevision = revision;
    publishReviewMetrics();
    setReviewPreviewStatus('READY');
    restorePreviewAnchor(anchor);
    refreshLiveEngineSelection();
    return outcome;
  } catch (error) {
    if (revision === state.revision) setReviewPreviewStatus('ERROR', '미리보기를 갱신하지 못했습니다.');
    return { ok: false, code: String(error?.code || error?.message || error) };
  }
}

function queueReviewPreviewRevision(immediate = false) {
  if (!state.currentFileName) return;
  const previousRequested = state.requestedPreviewRevision;
  const bridge = ensureReviewPreviewBridge();
  const tuple = bridge ? bridge.nextRevision() : {
    bridgeEpoch: state.bridgeEpoch,
    sourceEpoch: state.sourceEpoch,
    revision: state.revision + 1,
  };
  syncReviewBridgeTuple(tuple);
  state.requestedPreviewRevision = tuple.revision;
  state.reviewMetrics.draftAtByRevision[tuple.revision] = nowReviewMetric();
  if (previousRequested > state.visiblePreviewRevision && previousRequested < tuple.revision) state.reviewMetrics.coalescedRevisionCount += 1;
  publishReviewMetrics();
  clearTimeout(state.previewRenderTimer);
  if (state.isComposing) {
    state.compositionDirty = true;
    return;
  }
  state.previewRenderTimer = setTimeout(function() {
    state.previewRenderTimer = null;
    dispatchReviewPreviewRevision(tuple.revision);
  }, immediate ? 0 : 16);
}

function refreshEnginePreviewFrameOnly() {
  queueReviewPreviewRevision(true);
}

function makeCard(q, displayNum) {
  const warnings  = detectWarnings(q);
  const recLevel  = recommendLevel(q);
  const isModified = state.modifiedIds.has(q.id);
  const sourceRef = getReviewQuestionSourceRef(q, state.currentBank.indexOf(q));
  const isSelected = sourceRef === state.selectedSourceRef;

  const div = document.createElement('div');
  div.className = [
    'q-card',
    warnings.length > 0 ? 'has-warning' : '',
    isModified ? 'modified' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ');
  div.dataset.qid = String(q.id);
  div.dataset.sourceRef = sourceRef;

  div.addEventListener('click', function() { selectQuestionBySourceRef(sourceRef); });

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
    const sizeClass = ['small','half','medium','large','full','tall'].includes(q.imageSize) ? ' image-' + q.imageSize : '';
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
  const renderSerial = ++state.editorRenderSerial;
  container.querySelectorAll('img[src^="blob:"]').forEach(function(img) {
    try { URL.revokeObjectURL(img.src); } catch (_) {}
  });
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
    if (renderSerial !== state.editorRenderSerial) {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      return;
    }
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
  const sourceRef = getReviewQuestionSourceRef(q, state.currentBank.indexOf(q));

  const tr = document.createElement('tr');
  if (warnings.length > 0) tr.classList.add('has-warning');
  if (sourceRef === state.selectedSourceRef) tr.classList.add('row-selected');
  tr.dataset.qid = String(q.id);
  tr.dataset.sourceRef = sourceRef;
  tr.style.cursor = 'pointer';

  tr.addEventListener('click', function() { selectQuestionBySourceRef(sourceRef); });

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
  const restoredItem = deepClone(ri.item);
  state.currentBank.splice(insertAt, 0, restoredItem);
  if (ri.sourceRef) state.questionSourceRefs.set(restoredItem, ri.sourceRef);
  state.removedItems.splice(removedIndex, 1);
  const q = state.currentBank.find(function(item) { return String(item.id) === String(ri.item.id); });
  state.selectedId = q ? q.id : null;
  state.selectedSourceRef = q ? getReviewQuestionSourceRef(q, state.currentBank.indexOf(q)) : '';
  if (q) markQuestionModified(q);
  renderAll();
  if (q) openEditPanel(q);
  highlightSelected();
  queueReviewPreviewRevision(true);
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
  renderEditorPane();
  renderTablePane();
}

function renderAll() {
  updateStats();
  renderFilterBtns();
  renderEditorPane();
  renderTablePane();
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
    queueReviewPreviewRevision(true);
  });
});

/* ================================================================
   저장: saveCurrentFile()
================================================================ */
function captureReviewUiSnapshot() {
  return {
    selectedId: state.selectedId,
    selectedSourceRef: state.selectedSourceRef,
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
    semesterFilter: state.semesterFilter,
    subjectFilter: state.subjectFilter,
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
  state.selectedSourceRef = snap.selectedSourceRef || '';
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
  state.semesterFilter    = snap.semesterFilter || '';
  state.subjectFilter     = snap.subjectFilter || '';
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

function flushEditorDraftForPreview() {
  const changed = commitEditorDraft();
  const pendingComposition = state.isComposing || state.compositionDirty;
  state.isComposing = false;
  state.compositionDirty = false;
  if (changed || pendingComposition || !state.requestedPreviewRevision || state.visiblePreviewRevision < state.requestedPreviewRevision) {
    queueReviewPreviewRevision(true);
  }
  return state.requestedPreviewRevision || state.revision;
}

async function waitForVisiblePreviewRevision(revision) {
  if (!revision || state.visiblePreviewRevision === revision) return { ok: true, revision };
  const bridge = ensureReviewPreviewBridge();
  if (!bridge) throw new Error('REVIEW_PREVIEW_NOT_READY');
  const outcome = await bridge.waitForRevision({
    bridgeEpoch: state.bridgeEpoch,
    sourceEpoch: state.sourceEpoch,
    revision,
  });
  if (!outcome?.ok) throw new Error(outcome?.code || 'REVIEW_PREVIEW_NOT_READY');
  if (state.visiblePreviewRevision !== revision) state.visiblePreviewRevision = revision;
  return outcome;
}

async function saveCurrentFile() {
  if (state.isSaving) return;
  state.isSaving = true;

  try {
    const saveRevision = flushEditorDraftForPreview();
    state.saveRevision = saveRevision;

    if (state.currentBank.length === 0 && state.originalBank.length > 0) {
      if (!confirm('모든 문항이 제거되어 있습니다. 그래도 저장합니까?')) return;
    }

    const summary = '수정: ' + state.modifiedIds.size + '문항 / 제거: ' + state.removedItems.length + '문항';
    if (!confirm('현재 JS 파일을 직접 덮어씁니다.\n' + summary + '\n저장 후 archive 폴더와 현재 파일 선택은 유지됩니다.')) return;

    const snap = captureReviewUiSnapshot();
    if (!await ensureDirectWriteReady()) return;
    const frozenBank = deepClone(state.currentBank);
    const saveResult = await window.APReviewSaveTransaction.saveReviewSource({
      fileHandle: state.currentFileHandle,
      loadedFingerprint: state.loadedFingerprint,
      bank: frozenBank,
      fileName: state.currentFileName,
      revision: saveRevision,
      waitForPreview: async revision => {
        const outcome = await waitForVisiblePreviewRevision(revision);
        if (state.revision !== revision) return { ok: false, code: 'SAVE_REVISION_CHANGED' };
        return outcome;
      },
      writer: window.APReviewSourceWriter,
    });

    if (state.persistTimer) {
      clearTimeout(state.persistTimer);
      state.persistTimer = null;
    }

    state.currentSource = saveResult.source;
    state.loadedFingerprint = saveResult.fingerprint;
    state.sourceFingerprint = saveResult.fingerprint;
    state.originalBank = frozenBank;
    state.saveRevision = saveRevision;
    state.postWriteVerifiedRevision = saveRevision;
    if (banksHaveSameContent(state.currentBank, frozenBank)) {
      state.modifiedIds = new Set();
      state.removedItems = [];
    } else {
      reconcileModifiedIds();
    }
    restoreReviewUiSnapshot(snap);

    renderFileList();
    renderGradeExamBtns();
    renderFilterBtns();
    renderEditorPane();
    renderTablePane();

    if (state.selectedSourceRef) {
      const q = findQuestionBySourceRef(state.selectedSourceRef);
      if (q) openEditPanel(q);
    }
    highlightSelected();
    updateStats();
    updateUnsavedBadge();

    await persistSessionState();

    showToast('저장 완료: ' + state.currentFileName);
  } catch (e) {
    if (e.code === 'EXTERNAL_SOURCE_MODIFIED') {
      showError('파일을 연 이후 외부에서 파일이 변경되었습니다. 현재 변경 내용을 덮어쓸 수 없습니다.');
    } else if (e.code === 'SAVE_REVISION_CHANGED') {
      showError('저장 중 새 수정이 발생했습니다. 최신 미리보기를 확인한 뒤 다시 저장하세요.');
    } else {
      showError('저장 실패: ' + e.message + '\narchive 폴더와 현재 파일 선택은 유지했습니다. 백업이 필요하면 상단 백업 다운로드를 사용하세요.');
    }
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
  const changed = commitEditorDraft();
  const q = getCurrentEditorQuestion();
  if (!q) return;
  updateStats();
  renderFilterBtns();
  openEditPanel(q);
  highlightSelected();
  renderEditorPane();
  renderTablePane();
  if (changed) queueReviewPreviewRevision(true);
  updateUnsavedBadge();
  schedulePersistSessionState(0);
  showToast('적용됨');
});

// 제거
document.getElementById('btn-remove').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  commitEditorDraft();
  const q = getCurrentEditorQuestion();
  if (!q) return;
  if (!confirm('문항 id:' + q.id + '을 검수본에서 제거합니다.\n저장 전까지 되돌릴 수 있습니다.')) return;

  const originalIndex = state.currentBank.indexOf(q);
  state.removedItems.push({ item: deepClone(q), originalIndex: originalIndex, sourceRef: getReviewQuestionSourceRef(q, originalIndex) });
  state.currentBank.splice(originalIndex, 1);
  state.selectedId = null;
  state.selectedSourceRef = '';
  closeEditPanel();
  renderAll();
  queueReviewPreviewRevision(true);
  schedulePersistSessionState(0);
  showToast('제거됨 (되돌리기 가능)');
});

// 되돌리기
document.getElementById('btn-revert').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  const q = getCurrentEditorQuestion();
  if (!q) { showToast('문항을 찾을 수 없습니다.'); return; }
  const orig = findQuestionBySourceRefIn(state.originalBank, state.selectedSourceRef);
  if (!orig) { showToast('원본을 찾을 수 없습니다.'); return; }
  Object.assign(q, deepClone(orig));
  state.modifiedIds.delete(q.id);
  openEditPanel(q);
  renderAll();
  queueReviewPreviewRevision(true);
  schedulePersistSessionState(0);
  showToast('되돌림');
});

// 수정 지시 복사
document.getElementById('btn-copy-edit').addEventListener('click', function(e) {
  e.preventDefault(); e.stopPropagation();
  if (state.selectedId === null) return;
  commitEditorDraft();
  const q = getCurrentEditorQuestion();
  if (!q) return;

  const text = [
    '파일: ' + (state.currentFilePath || state.currentFileName),
    'sourceRef: ' + getReviewQuestionSourceRef(q, state.currentBank.indexOf(q)),
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
  const q = getCurrentEditorQuestion();
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

function handleEditFieldChanged(event) {
  if (state.selectedId === null) return;
  if (event && event.target && event.target.id === 'e-layout') {
    const customInput = document.getElementById('e-layout-custom');
    if (event.target.value === 'custom' && customInput && !customInput.value.trim()) {
      customInput.value = 'custom';
    }
    syncLayoutTagCustomInput();
  }
  const changed = commitEditorDraft();
  updateStats();
  updateUnsavedBadge();
  if (changed) {
    if (state.isComposing) state.compositionDirty = true;
    else queueReviewPreviewRevision(false);
  }
  schedulePersistSessionState();
}

function handleCompositionStart() {
  if (state.selectedId === null) return;
  state.isComposing = true;
  state.compositionDirty = false;
}

function handleCompositionUpdate() {
  if (state.selectedId === null) return;
  if (commitEditorDraft()) state.compositionDirty = true;
  updateStats();
  updateUnsavedBadge();
  schedulePersistSessionState();
}

function handleCompositionEnd() {
  if (state.selectedId === null) return;
  const changed = commitEditorDraft();
  const shouldRender = changed || state.compositionDirty || state.isComposing;
  state.isComposing = false;
  state.compositionDirty = false;
  if (shouldRender) queueReviewPreviewRevision(true);
  updateStats();
  updateUnsavedBadge();
  schedulePersistSessionState();
}

function initLiveEditHandlers() {
  [
    'e-level','e-qtype','e-layout','e-layout-custom','e-tags','e-content',
    'e-choices','e-answer','e-solution','e-image','e-imagesize'
  ].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, handleEditFieldChanged);
    if (evt === 'input') {
      el.addEventListener('compositionstart', handleCompositionStart);
      el.addEventListener('compositionupdate', handleCompositionUpdate);
      el.addEventListener('compositionend', handleCompositionEnd);
    }
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
    state.selectedSourceRef = '';
    closeEditPanel();
    highlightSelected();
  }
});

window.addEventListener('pagehide', function() {
  state.reviewBridge?.dispose();
});

window.addEventListener('beforeunload', function(event) {
  commitEditorDraft();
  if (!hasUnsavedChanges()) return;
  event.preventDefault();
  event.returnValue = '';
});

/* ================================================================
   IndexedDB 상태 영속화
   — reload가 발생해도 파일 핸들 + UI 상태를 자동 복원한다.
================================================================ */
let reviewSessionStore = null;

function getReviewSessionStore() {
  if (reviewSessionStore) return reviewSessionStore;
  if (!window.APReviewSessionStore?.createReviewSessionStore) return null;
  state.idbMetrics = state.idbMetrics || { writeCount: 0, writeMs: 0, payloadSize: 0 };
  reviewSessionStore = window.APReviewSessionStore.createReviewSessionStore({ metrics: state.idbMetrics });
  return reviewSessionStore;
}

function buildCurrentReviewSessionSnapshot() {
  const build = window.APReviewSessionStore?.buildReviewSessionSnapshot;
  if (!build) return null;
  return build({
    sessionRevision: state.draftRevision,
    sourceFingerprint: state.sourceFingerprint || state.loadedFingerprint,
    sourceIdentity: state.sourceIdentity,
    archiveDirHandle: state.archiveDirHandle,
    currentFileHandle: state.currentFileHandle,
    editorState: { selectedSourceRef: state.selectedSourceRef, selectedId: state.selectedId },
    uiState: {
      currentFilePath: state.currentFilePath,
      currentFileName: state.currentFileName,
      fileEntries: state.fileEntries.map(function(entry) { return { path: entry.path, handle: entry.handle }; }),
      activeFilter: state.activeFilter,
      searchQuery: state.searchQuery,
      fileSearch: state.fileSearch,
      gradeFilter: state.gradeFilter,
      examTypeFilter: state.examTypeFilter,
      semesterFilter: state.semesterFilter,
      subjectFilter: state.subjectFilter,
      engineMode: state.engineMode,
      qpp: state.qpp,
    },
    draftState: {
      currentBank: state.currentBank,
      originalBank: state.originalBank,
      sourceRefs: state.currentBank.map(function(q, index) { return getReviewQuestionSourceRef(q, index); }),
      modifiedIds: Array.from(state.modifiedIds),
      removedItems: state.removedItems,
    },
    savedAt: Date.now(),
  });
}

async function persistSessionState() {
  const store = getReviewSessionStore();
  const snapshot = buildCurrentReviewSessionSnapshot();
  if (!store || !snapshot) return;
  try { await store.put(snapshot); }
  catch(e) { console.warn('[검수엔진] persistSessionState 실패:', e); }
}

function schedulePersistSessionState(delay) {
  clearTimeout(state.persistTimer);
  state.persistTimer = setTimeout(function() {
    state.persistTimer = null;
    persistSessionState();
  }, delay === undefined ? 600 : delay);
}

async function readDiskSourceForRestore(currentFileHandle, fileName) {
  if (!currentFileHandle?.getFile) return null;
  const file = await currentFileHandle.getFile();
  const source = await file.text();
  const parsed = parseSource(source, fileName || file.name || '');
  const sourceFingerprint = await window.APReviewSourceWriter.fingerprintText(source);
  return { source, parsed, sourceFingerprint };
}

async function restoreSessionState() {
  const store = getReviewSessionStore();
  if (!store) return false;
  try {
    const snapshot = await store.get();
    if (!snapshot?.archiveDirHandle || !snapshot.currentFileHandle) return false;

    // 디렉토리 권한 확인 (이미 granted면 대화상자 없음)
    var perm = await snapshot.archiveDirHandle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') {
      // prompt 필요 → 복원 버튼 표시
      showRestorePrompt(snapshot);
      return false;
    }

    return await applyRestoredState(snapshot);
  } catch(e) {
    console.warn('[검수엔진] restoreSessionState 실패:', e);
    return false;
  }
}

async function applyRestoredState(snapshot) {
  const ui = snapshot.uiState || {};
  const disk = await readDiskSourceForRestore(snapshot.currentFileHandle, ui.currentFileName || '');
  if (!disk) return false;
  const restored = window.APReviewSessionStore.restoreReviewSession(snapshot, {
    sourceFingerprint: disk.sourceFingerprint,
    bank: disk.parsed.bank,
  }, ui.currentFileName || '');

  state.archiveDirHandle  = snapshot.archiveDirHandle;
  state.currentFileHandle = snapshot.currentFileHandle;
  state.fileEntries       = Array.isArray(ui.fileEntries) ? ui.fileEntries : [];
  state.currentFilePath   = ui.currentFilePath || '';
  state.currentFileName   = ui.currentFileName || '';
  state.selectedId        = restored.editorState?.selectedId ?? restored.selectedId ?? null;
  state.selectedSourceRef = restored.selectedSourceRef || restored.editorState?.selectedSourceRef || '';
  state.activeFilter      = ui.activeFilter || 'all';
  state.searchQuery       = ui.searchQuery || '';
  state.fileSearch        = ui.fileSearch || '';
  state.gradeFilter       = ui.gradeFilter || '';
  state.examTypeFilter    = ui.examTypeFilter || '';
  state.semesterFilter    = ui.semesterFilter || '';
  state.subjectFilter     = ui.subjectFilter || '';
  state.engineMode        = ui.engineMode || 'exam';
  state.qpp               = ui.qpp || 4;
  state.examTitle         = disk.parsed.title;
  state.examDisplayTitle  = disk.parsed.displayTitle || disk.parsed.title;
  state.currentSource     = disk.source;
  state.sourceIdentity    = snapshot.sourceIdentity || getSourceIdentityForPath(state.currentFilePath, state.currentFileName);
  state.sourceRequestId   = state.sourceIdentity + ':' + snapshot.savedAt;
  state.sourceFingerprint = disk.sourceFingerprint;
  state.loadedFingerprint = disk.sourceFingerprint;
  state.currentBank       = restored.currentBank || deepClone(disk.parsed.bank);
  state.originalBank      = restored.originalBank || deepClone(disk.parsed.bank);
  state.questionSourceRefs.clear();
  registerReviewQuestionSourceRefs(state.currentBank, state.sourceIdentity, restored.sourceRefs || []);
  registerReviewQuestionSourceRefs(state.originalBank, state.sourceIdentity);
  state.modifiedIds       = new Set(Array.isArray(restored.modifiedIds) ? restored.modifiedIds : []);
  state.removedItems      = restored.removedItems || [];
  state.canDirectSave     = true;
  state.revision = 0;
  state.draftRevision = 0;
  state.requestedPreviewRevision = 0;
  state.visiblePreviewRevision = 0;
  state.postWriteVerifiedRevision = 0;
  resetReviewMetrics();
  state.assetFingerprint = '';
  state.assetRevision = 0;
  const bridge = ensureReviewPreviewBridge();
  if (bridge) {
    const tuple = bridge.beginSource();
    state.bridgeEpoch = tuple.bridgeEpoch;
    state.sourceEpoch = tuple.sourceEpoch;
  } else state.sourceEpoch += 1;
  await buildImageMap(state.archiveDirHandle);
  if (state.archiveDirHandle && state.fileEntries.length === 0) await scanArchiveDir(state.archiveDirHandle);

  if (state.archiveDirHandle) {
    var dirStatus = document.getElementById('left-dir-status');
    dirStatus.textContent = 'archive 폴더: ' + state.archiveDirHandle.name + (restored.status === 'CONFLICT' ? ' (디스크 변경 감지)' : ' (복원됨)');
    dirStatus.classList.add('open');
  }
  document.getElementById('status-file').textContent = state.currentFileName + ' (' + state.currentBank.length + '문항)' + (restored.status === 'CONFLICT' ? ' [디스크 기준]' : ' [복원됨]');

  updateSaveModeUI();
  renderFileList();
  renderAll();
  if (restored.status === 'CONFLICT') showError('저장된 작업 이후 파일이 외부에서 변경되어 이전 draft는 적용하지 않았습니다. 현재 디스크 내용을 기준으로 시작합니다.');
  queueReviewPreviewRevision(true);

  if (state.selectedSourceRef) {
    var q = findQuestionBySourceRef(state.selectedSourceRef);
    if (q) { openEditPanel(q); highlightSelected(); }
  }
  showToast(restored.status === 'CONFLICT' ? '외부 변경 감지: 디스크 내용을 복원했습니다.' : '이전 작업 상태가 복원되었습니다.', 3000);
  return true;
}

function showRestorePrompt(snapshot) {
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
      var perm = await snapshot.archiveDirHandle.requestPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        if (snapshot.currentFileHandle) {
          await snapshot.currentFileHandle.requestPermission({ mode: 'readwrite' });
        }
        await applyRestoredState(snapshot);
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
  initLiveEditHandlers();
  renderGradeExamBtns();
  ensureReviewPreviewBridge();
  const didAutoload = await autoloadFromQuery();
  if (didAutoload) return;

  // 이전 세션 복원 시도
  await restoreSessionState();
})();
