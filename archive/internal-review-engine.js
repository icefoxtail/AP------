/* ================================================================
   JS아카이브 내부 검수 엔진  –  internal-review-engine.js
   Chrome / Edge (localhost) 전용. File System Access API 필요.
   ================================================================ */

'use strict';

// ─── 전역 상태 ─────────────────────────────────────────────────
const STATE = {
  archiveDirHandle: null,   // FileSystemDirectoryHandle (archive 폴더)
  currentFileHandle: null,  // FileSystemFileHandle (현재 JS)
  canWrite: false,          // 직접 저장 가능 여부
  fallbackMode: false,      // showOpenFilePicker 미지원 시 input fallback

  currentFileName: '',
  currentSource: '',        // 원본 JS 소스
  examTitle: '',
  originalBank: [],         // deep copy — 되돌리기용
  currentBank: [],          // 편집 중인 배열
  removedItems: [],         // 제거된 문항 보관

  imageMap: new Map(),      // "assets/images/폴더/파일" → blob URL
  modifiedIds: new Set(),
  removedIds: new Set(),

  viewMode: 'question',     // question / answer / solution / table
  filter: 'all',
  searchText: '',
  selectedIdx: -1,          // currentBank 인덱스

  fileHandles: [],          // archive 폴더 탐색으로 찾은 {path, handle}
  fileSearch: '',
  currentFilePath: '',      // archive 기준 상대 경로 (engine.html ?data= 에 사용)
};

// ─── 보기 번호 (①②③④⑤) ─────────────────────────────────────
const CIRCLE_NUMS = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];

// ─── 시각자료 키워드 ──────────────────────────────────────────
const VISUAL_KEYWORDS = [
  '아래 그림','다음 그림','오른쪽 그림','왼쪽 그림','위 그림',
  '그림과 같이','그림을 보고','수직선','좌표평면','그래프',
  '막대그래프','원그래프','꺾은선그래프','전개도','입체도형',
  '정육면체','직육면체','원기둥','원뿔','각기둥','각뿔',
  '평면도형','도형에서','어두운 부분','색칠한 부분',
];

// ─── 메타 금지 문구 ───────────────────────────────────────────
const META_PHRASES = [
  '원본 매칭','원본 오차','변형 최종','가까운 규칙','메커니즘',
  '도출됩니다','또는 변형',
];

// ─── 깨진 문자 후보 ───────────────────────────────────────────
const BROKEN_CHARS = ['�','□','○','△','◇',
  '☐','☒','♡','♥','  '];

// ================================================================
//  유틸
// ================================================================
function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function showToast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.display = 'none'; }, duration);
}

function showError(msg) {
  const el = document.getElementById('error-box');
  el.textContent = msg;
  el.style.display = 'block';
  console.error('[검수엔진]', msg);
}

function clearError() {
  document.getElementById('error-box').style.display = 'none';
}

function formatDate(d = new Date()) {
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}`
    + `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function downloadCsv(text, filename) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// ================================================================
//  iframe 미리보기
// ================================================================
function buildEngineUrl(bust = false) {
  if (!STATE.currentFilePath) return '';
  const modeMap = { question: 'exam', answer: 'ans', solution: 'sol' };
  const mode = modeMap[STATE.viewMode] || 'exam';
  const path = encodeURIComponent(STATE.currentFilePath);
  let url = `engine.html?data=${path}&mode=${mode}`;
  if (bust) url += `&_v=${Date.now()}`;
  return url;
}

function refreshEngineIframe(bust = false) {
  const iframe = document.getElementById('engine-iframe');
  const placeholder = document.getElementById('engine-placeholder');
  const url = buildEngineUrl(bust);
  if (!url) {
    iframe.style.display = 'none';
    placeholder.style.display = 'flex';
    return;
  }
  iframe.src = url;
  iframe.style.display = 'block';
  placeholder.style.display = 'none';
}

// ================================================================
//  파일 열기
// ================================================================

// archive 폴더 열기 (showDirectoryPicker)
async function openArchiveDir() {
  if (!window.showDirectoryPicker) {
    showError('showDirectoryPicker를 지원하지 않습니다. Chrome/Edge 최신 버전에서 localhost로 접속하세요.');
    return;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    STATE.archiveDirHandle = handle;
    STATE.canWrite = true;
    updateSaveMode();
    showToast('폴더 열림: ' + handle.name);
    clearError();
    await scanArchiveDir(handle);
    await buildImageMap(handle);
  } catch(e) {
    if (e.name !== 'AbortError') showError('폴더 열기 실패: ' + e.message);
  }
}

// archive 내부 모든 .js 재귀 탐색
async function scanArchiveDir(dirHandle, pathPrefix = '') {
  STATE.fileHandles = [];
  document.getElementById('file-list').innerHTML = '<div style="padding:6px;color:#888;font-size:11px">탐색 중...</div>';
  await collectJsFiles(dirHandle, pathPrefix, STATE.fileHandles);
  renderFileList();
}

async function collectJsFiles(dirHandle, prefix, result) {
  const systemFiles = new Set(['db.js','concept_map.js','internal-review-engine.js']);
  for await (const [name, handle] of dirHandle.entries()) {
    const curPath = prefix ? `${prefix}/${name}` : name;
    if (handle.kind === 'directory') {
      // 최상위에서는 exams 폴더만 진입 (성능 + 범위 제한)
      if (!prefix && name !== 'exams') continue;
      if (name === '.venv' || name === 'node_modules' || name === '__pycache__') continue;
      await collectJsFiles(handle, curPath, result);
    } else if (handle.kind === 'file' && name.endsWith('.js')) {
      // exams/ 하위만 수집
      if (!curPath.startsWith('exams/')) continue;
      if (!systemFiles.has(name)) {
        result.push({ path: curPath, handle });
      }
    }
  }
}

// JS 파일 단독 열기 (showOpenFilePicker)
async function openSingleFile() {
  if (window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JS Files', accept: { 'text/javascript': ['.js'] } }],
        multiple: false,
      });
      STATE.currentFileHandle = handle;
      STATE.canWrite = true;
      STATE.fallbackMode = false;
      STATE.currentFilePath = '';  // 경로 미확인 → iframe 미리보기 불가
      updateSaveMode();
      clearError();
      await loadFileHandle(handle);
    } catch(e) {
      if (e.name !== 'AbortError') showError('파일 열기 실패: ' + e.message);
    }
  } else {
    STATE.fallbackMode = true;
    STATE.canWrite = false;
    updateSaveMode();
    document.getElementById('fallback-input').click();
  }
}

// fallback: <input type=file>
document.getElementById('fallback-input').addEventListener('change', async function() {
  const file = this.files[0];
  if (!file) return;
  STATE.currentFileName = file.name;
  STATE.currentFilePath = '';  // 경로 미확인 → iframe 미리보기 불가
  const src = await file.text();
  parseAndLoad(src, file.name, null);
});

// FileSystemFileHandle에서 로드
async function loadFileHandle(handle) {
  try {
    const file = await handle.getFile();
    const src = await file.text();
    STATE.currentFileHandle = handle;
    STATE.currentFileName = handle.name;
    parseAndLoad(src, handle.name, handle);
  } catch(e) {
    showError('파일 읽기 실패: ' + e.message);
  }
}

// ================================================================
//  이미지 맵 빌드 (archive/assets/images/**)
// ================================================================
async function buildImageMap(archiveDirHandle) {
  STATE.imageMap.clear();
  try {
    const assetsHandle = await archiveDirHandle.getDirectoryHandle('assets', { create: false });
    const imagesHandle = await assetsHandle.getDirectoryHandle('images', { create: false });
    for await (const [folderName, folderHandle] of imagesHandle.entries()) {
      if (folderHandle.kind !== 'directory') continue;
      for await (const [fileName, fileHandle] of folderHandle.entries()) {
        if (fileHandle.kind !== 'file') continue;
        const key = `assets/images/${folderName}/${fileName}`;
        STATE.imageMap.set(key, fileHandle);
      }
    }
  } catch(e) {
    console.warn('[검수엔진] 이미지 맵 빌드 실패:', e.message);
  }
}

// 이미지 경로를 "assets/images/..." 형태로 정규화
function normalizeImagePath(imgPath) {
  if (!imgPath) return '';
  return imgPath
    .replace(/^archive\//, '')   // archive/assets/... → assets/...
    .replace(/^\.\//, '')        // ./assets/... → assets/...
    .replace(/^\//, '');         // /assets/... → assets/...
}

async function getImageBlobUrl(imgPath) {
  const key = normalizeImagePath(imgPath);
  const handle = STATE.imageMap.get(key);
  if (!handle) return null;
  try {
    const file = await handle.getFile();
    return URL.createObjectURL(file);
  } catch { return null; }
}

// ================================================================
//  JS 파싱
// ================================================================
function parseAndLoad(source, fileName, fileHandle) {
  clearError();
  try {
    const sandbox = {};
    const fn = new Function('window', source);
    fn(sandbox);

    let bank = null;
    const title = sandbox.examTitle || sandbox.title || fileName.replace(/\.js$/, '');

    if (Array.isArray(sandbox.questionBank)) {
      bank = sandbox.questionBank;
    } else if (sandbox.questionBank && Array.isArray(sandbox.questionBank.questions)) {
      bank = sandbox.questionBank.questions;
    } else if (sandbox.questionBank && Array.isArray(sandbox.questionBank.problems)) {
      bank = sandbox.questionBank.problems;
    } else {
      throw new Error('questionBank 배열을 찾을 수 없습니다.');
    }

    STATE.examTitle = title;
    STATE.currentSource = source;
    STATE.currentFileName = fileName;
    STATE.originalBank = deepCopy(bank);
    STATE.currentBank = deepCopy(bank);
    STATE.removedItems = [];
    STATE.modifiedIds = new Set();
    STATE.removedIds = new Set();
    STATE.selectedIdx = -1;

    document.getElementById('status-file').textContent = fileName;

    updateStats();
    renderFilterBtns();
    refreshEngineIframe();
    showToast(`✓ ${fileName} 로드 완료 (${bank.length}문항)`);
  } catch(e) {
    showError(`파싱 실패: ${e.message}\n파일: ${fileName}`);
  }
}

// ================================================================
//  경고 탐지
// ================================================================
function detectWarnings(q) {
  const warnings = [];
  const levels = ['하','중','상'];

  if (!levels.includes(q.level)) warnings.push('level이 하/중/상이 아님');
  if (!q.tags || q.tags.length === 0) warnings.push('tags 없음');
  if (!q.answer || String(q.answer).trim() === '') warnings.push('answer 없음');
  if (!q.solution || String(q.solution).trim() === '') warnings.push('solution 없음');

  const isObj = q.questionType && (q.questionType.includes('객관식') || q.questionType === 'OX');
  const choices = Array.isArray(q.choices) ? q.choices : [];
  if (isObj && choices.length === 0) warnings.push('객관식인데 choices 없음');
  if (choices.length > 0 && q.questionType === '단답형') warnings.push('choices 있는데 단답형');

  const imgPath = normalizeImagePath(q.image || '');
  if (imgPath) {
    if (STATE.imageMap.size > 0 && !STATE.imageMap.has(imgPath)) {
      warnings.push('image 경로 있음 + 파일 없음');
    } else if (STATE.imageMap.size === 0) {
      warnings.push('image 경로 있음 (실제 파일 미확인)');
    }
  }

  const contentStr = q.content || '';
  const hasVisualKw = VISUAL_KEYWORDS.some(kw => contentStr.includes(kw));
  if (hasVisualKw && !imgPath) warnings.push('시각자료 키워드 있음 + image 없음');

  const sol = q.solution || '';
  META_PHRASES.forEach(p => { if (sol.includes(p)) warnings.push(`금지 메타 문구: "${p}"`); });

  const allText = contentStr + ' ' + sol + ' ' + (q.answer || '');
  BROKEN_CHARS.forEach(c => { if (allText.includes(c)) warnings.push('깨진 문자 후보'); });

  const ans = String(q.answer || '');
  if (ans.includes('또는') || ans.includes('변형') || ans.includes('원본')) {
    warnings.push('answer에 금지 단어 포함');
  }

  const contentResidues = ['이미지 설명','그림 설명','원본 그림','아래 그림은 다음과 같다','예시 규칙 배열'];
  contentResidues.forEach(p => { if (contentStr.includes(p)) warnings.push(`내용 잔재 후보: "${p}"`); });

  return warnings;
}

// ================================================================
//  난이도 추천
// ================================================================
function recommendLevel(q) {
  const content = (q.content || '') + ' ' + (q.solution || '');
  const choices = Array.isArray(q.choices) ? q.choices : [];

  // 상 패턴
  const upperPatterns = [
    '경우를 나누','경우로 나누','역으로','최대','최솟값','최댓값',
    '자연수 조건','정수 조건','자연수인','모든 경우','동시에 만족',
    '고난도','복합','여러 조건',
  ];
  if (upperPatterns.some(p => content.includes(p))) return '상';

  // 하 패턴
  const lowerPatterns = [
    '계산하여라','계산하시오','구하여라','다음 중 옳은','단순 계산',
    '용어를 쓰시오','정의','이름을 쓰시오',
  ];
  const shortContent = content.length < 60;
  const shortChoices = choices.length > 0 && choices.every(c => String(c).length <= 8);
  if (lowerPatterns.some(p => content.includes(p)) || (shortContent && shortChoices)) return '하';

  // 중 패턴
  const midPatterns = [
    '식을 세워','정리하면','조건을 이용','두 조건','표를 보고',
    '수직선 위','좌표를 구','몇 가지','확률을 구',
  ];
  if (midPatterns.some(p => content.includes(p))) return '중';

  // 기본: content 길이 기반
  if (content.length < 80) return '하';
  if (content.length < 200) return '중';
  return '중';
}

// ================================================================
//  필터 적용
// ================================================================
function applyFilter(bank) {
  const f = STATE.filter;
  const q = STATE.searchText.trim().toLowerCase();

  let list = bank.map((item, idx) => ({ item, idx }));

  // 검색어
  if (q) {
    list = list.filter(({ item }) => {
      const hay = [
        String(item.id || ''),
        item.content || '',
        item.answer || '',
        item.solution || '',
        (item.tags || []).join(' '),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  // 필터
  if (f === 'all') return list;
  if (f === 'warning') return list.filter(({ item }) => detectWarnings(item).length > 0);
  if (f === 'modified') return list.filter(({ item }) => STATE.modifiedIds.has(item.id));
  if (f === 'removed') return bank.length === 0 ? [] : [];  // 제거됨은 별도 처리
  if (f === 'recdiff') return list.filter(({ item }) => item.level !== recommendLevel(item));
  if (f === 'imgneeded') return list.filter(({ item }) => {
    const hasKw = VISUAL_KEYWORDS.some(kw => (item.content || '').includes(kw));
    return hasKw && !item.image;
  });
  if (f === 'broken') return list.filter(({ item }) => {
    const t = (item.content || '') + (item.solution || '') + String(item.answer || '');
    return BROKEN_CHARS.some(c => t.includes(c));
  });
  if (f === 'meta') return list.filter(({ item }) => {
    const sol = item.solution || '';
    return META_PHRASES.some(p => sol.includes(p));
  });
  if (f === 'noanswer') return list.filter(({ item }) => !item.answer || String(item.answer).trim() === '');
  if (f === 'nosolution') return list.filter(({ item }) => !item.solution || String(item.solution).trim() === '');
  if (f === '하' || f === '중' || f === '상') return list.filter(({ item }) => item.level === f);
  if (f === '객관식') return list.filter(({ item }) => item.questionType === '객관식');
  if (f === '단답형') return list.filter(({ item }) => item.questionType === '단답형');
  return list;
}

// ================================================================
//  렌더링 – 카드
// ================================================================
async function renderCards() {
  const container = document.getElementById('question-cards');
  container.innerHTML = '';

  const filtered = applyFilter(STATE.currentBank);

  // 제거됨 필터면 removedItems를 보여줌
  if (STATE.filter === 'removed') {
    STATE.removedItems.forEach((item, ri) => {
      const card = makeCard(item, -1, ri + 1, true);
      container.appendChild(card);
    });
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:20px;color:#aaa;">해당 조건의 문항이 없습니다.</div>';
    return;
  }

  filtered.forEach(({ item, idx }, displayNum) => {
    const card = makeCard(item, idx, displayNum + 1, false);
    container.appendChild(card);
  });

  // MathJax 타입셋
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(() => {});
  }

  // 이미지 비동기 로드
  container.querySelectorAll('.card-image[data-img-path]').forEach(async img => {
    const path = normalizeImagePath(img.dataset.imgPath);
    const blobUrl = await getImageBlobUrl(path);
    if (blobUrl) {
      img.src = blobUrl;
      img.style.display = 'block';
    } else {
      img.remove();
      const warn = document.createElement('div');
      warn.className = 'card-image-missing';
      warn.textContent = '⚠ 이미지 없음: ' + path;
      img.parentNode && img.parentNode.insertBefore(warn, img.nextSibling);
    }
  });
}

function makeCard(q, bankIdx, displayNum, isRemoved) {
  const warnings = detectWarnings(q);
  const recLevel = recommendLevel(q);
  const isModified = STATE.modifiedIds.has(q.id);
  const isSelected = bankIdx === STATE.selectedIdx;

  const div = document.createElement('div');
  div.className = [
    'q-card',
    warnings.length > 0 ? 'has-warning' : '',
    isModified ? 'modified' : '',
    isRemoved ? 'removed-card' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ');

  if (!isRemoved) {
    div.addEventListener('click', () => selectQuestion(bankIdx));
  }

  // 헤더
  const header = document.createElement('div');
  header.className = 'card-header';
  header.innerHTML = `<span class="card-num">${displayNum}번</span>
    <span class="card-id">id:${q.id}</span>
    <span class="badge badge-level-${['하','중','상'].includes(q.level) ? q.level : 'unknown'}">${q.level || '?'}</span>
    ${q.questionType ? `<span class="badge badge-qtype">${q.questionType}</span>` : ''}
    ${warnings.length > 0 ? `<span class="badge badge-warning">⚠ ${warnings.length}</span>` : ''}
    ${isModified ? `<span class="badge badge-modified">수정됨</span>` : ''}
    ${recLevel !== q.level ? `<span class="badge badge-rec-diff">추천:${recLevel}</span>` : ''}
    ${isRemoved ? `<span class="badge" style="background:#e0d0e8;color:#4a0072">제거됨</span>` : ''}`;
  div.appendChild(header);

  // tags
  if (q.tags && q.tags.length > 0) {
    const tags = document.createElement('div');
    tags.className = 'card-tags';
    tags.textContent = q.tags.join(', ');
    div.appendChild(tags);
  }

  // content
  const content = document.createElement('div');
  content.className = 'card-content';
  content.innerHTML = renderMathText(q.content || '');
  div.appendChild(content);

  // image
  if (q.image) {
    const img = document.createElement('img');
    img.className = 'card-image';
    img.dataset.imgPath = q.image;
    img.src = '';
    img.alt = q.image;
    img.style.display = 'none';
    div.appendChild(img);
  }

  // choices (문제만 / 항상 표시)
  if (Array.isArray(q.choices) && q.choices.length > 0) {
    const ch = document.createElement('div');
    ch.className = 'card-choices';
    ch.innerHTML = q.choices.map((c, i) =>
      `<span class="circle-num">${CIRCLE_NUMS[i] || (i+1)+'.'}</span> ${renderMathText(String(c))}`
    ).join('&nbsp;&nbsp;');
    div.appendChild(ch);
  }

  // answer (보기 모드에 따라)
  if (STATE.viewMode !== 'question' && q.answer) {
    const ans = document.createElement('div');
    ans.className = 'card-answer';
    ans.innerHTML = '정답: ' + renderMathText(String(q.answer));
    div.appendChild(ans);
  }

  // solution
  if (STATE.viewMode === 'solution' && q.solution) {
    const sol = document.createElement('div');
    sol.className = 'card-solution';
    sol.innerHTML = renderMathText(q.solution);
    div.appendChild(sol);
  }

  // warnings
  if (warnings.length > 0) {
    const warnDiv = document.createElement('div');
    warnDiv.className = 'card-warnings';
    warnings.slice(0, 3).forEach(w => {
      const b = document.createElement('span');
      b.className = 'badge badge-warning';
      b.textContent = w;
      warnDiv.appendChild(b);
    });
    if (warnings.length > 3) {
      const more = document.createElement('span');
      more.className = 'badge badge-warning';
      more.textContent = `+${warnings.length - 3}`;
      warnDiv.appendChild(more);
    }
    div.appendChild(warnDiv);
  }

  return div;
}

// HTML sanitizer – 허용 태그만 통과, on* 속성·위험 태그 제거
function sanitizeHtml(html) {
  const ALLOWED = new Set([
    'br','div','span','b','strong','em','u','sup','sub','p',
    'table','thead','tbody','tr','th','td','colgroup','col','img',
  ]);
  const REMOVE = new Set(['script','iframe','object','embed','style','form','input','button','link','meta']);

  const doc = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');

  function clean(el) {
    for (const child of [...el.childNodes]) {
      if (child.nodeType !== 1) continue; // TEXT_NODE는 그대로
      const tag = child.tagName.toLowerCase();
      if (REMOVE.has(tag)) { child.remove(); continue; }
      // on* 이벤트 속성 제거
      for (const attr of [...child.attributes]) {
        if (/^on/i.test(attr.name)) child.removeAttribute(attr.name);
      }
      if (!ALLOWED.has(tag)) {
        // 허용 안 된 태그 → 태그만 제거하고 자식 유지(unwrap)
        const frag = document.createDocumentFragment();
        while (child.firstChild) frag.appendChild(child.firstChild);
        el.insertBefore(frag, child);
        child.remove();
      } else {
        clean(child);
      }
    }
  }

  clean(doc.body);
  return doc.body.innerHTML;
}

// 수식 텍스트 렌더링
// - HTML 태그가 없으면 escape + 줄바꿈→<br>
// - HTML 태그가 있으면 sanitize하여 그대로 렌더링
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

// ================================================================
//  렌더링 – 검수표
// ================================================================
function makeReviewRow(q, bankIdx, displayNum, isRemoved) {
  const warnings = detectWarnings(q);
  const recLevel = recommendLevel(q);
  const isModified = STATE.modifiedIds.has(q.id);

  const tr = document.createElement('tr');
  if (warnings.length > 0) tr.classList.add('has-warning');
  if (isRemoved) tr.style.opacity = '0.55';

  if (!isRemoved && bankIdx >= 0) {
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.view-btn[data-mode="question"]').classList.add('active');
      STATE.viewMode = 'question';
      document.getElementById('review-table-area').style.display = 'none';
      document.getElementById('engine-iframe-wrap').style.display = 'flex';
      selectQuestion(bankIdx);
    });
  }

  tr.innerHTML = `
    <td>${displayNum + 1}</td>
    <td>${q.id}</td>
    <td>${q.level || ''}</td>
    <td>${recLevel !== q.level ? `<b style="color:#f57f17">${recLevel}</b>` : recLevel}</td>
    <td>${q.questionType || ''}</td>
    <td class="td-preview">${(q.tags || []).join(', ')}</td>
    <td class="td-preview">${stripHtml(q.content || '').slice(0, 40)}</td>
    <td class="td-preview">${String(q.answer || '').slice(0, 20)}</td>
    <td class="td-warn">${warnings.slice(0,2).join(' / ')}${warnings.length>2?' ...':''}</td>
    <td class="${isModified ? 'td-mod' : ''}">${isModified ? '✓' : ''}</td>
    <td>${isRemoved ? '<b style="color:#6a1a6a">제거</b>' : ''}</td>`;
  return tr;
}

function renderReviewTable() {
  const tbody = document.getElementById('review-table-body');
  tbody.innerHTML = '';

  // removed 필터: removedItems를 표시
  if (STATE.filter === 'removed') {
    if (STATE.removedItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="color:#aaa;padding:12px">제거된 문항 없음</td></tr>';
      return;
    }
    STATE.removedItems.forEach((q, ri) => {
      tbody.appendChild(makeReviewRow(q, -1, ri, true));
    });
    return;
  }

  const filtered = applyFilter(STATE.currentBank);
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="color:#aaa;padding:12px">해당 조건의 문항 없음</td></tr>';
    return;
  }
  filtered.forEach(({ item: q, idx }, displayNum) => {
    tbody.appendChild(makeReviewRow(q, idx, displayNum, false));
  });
}

// ================================================================
//  draft commit / dirty 감지
// ================================================================
function commitEditorDraft() {
  if (STATE.selectedIdx < 0 || STATE.selectedIdx >= STATE.currentBank.length) return;
  const q = STATE.currentBank[STATE.selectedIdx];
  q.level        = document.getElementById('e-level').value;
  q.questionType = document.getElementById('e-qtype').value;
  q.layoutTag    = document.getElementById('e-layout').value.trim();
  q.tags         = document.getElementById('e-tags').value.split(/[,\n]/).map(t => t.trim()).filter(Boolean);
  q.content      = document.getElementById('e-content').value;
  q.choices      = document.getElementById('e-choices').value.split('\n').map(c => c.trim()).filter(Boolean);
  q.answer       = document.getElementById('e-answer').value;
  q.solution     = document.getElementById('e-solution').value;
  q.image        = document.getElementById('e-image').value.trim();
  STATE.modifiedIds.add(q.id);
}

function hasDirtyState() {
  return STATE.modifiedIds.size > 0 || STATE.removedIds.size > 0;
}

// ================================================================
//  문항 선택 & 수정 패널
// ================================================================
function selectQuestion(bankIdx) {
  commitEditorDraft();
  STATE.selectedIdx = bankIdx;
  if (bankIdx < 0 || bankIdx >= STATE.currentBank.length) {
    closeEditPanel();
    return;
  }
  openEditPanel(STATE.currentBank[bankIdx]);
}

function scrollToCard(bankIdx) {
  const cards = document.querySelectorAll('.q-card');
  // filtered 순서와 bankIdx가 다를 수 있으므로 data 탐색 대신 재렌더 후 첫 selected 탐색
  setTimeout(() => {
    const sel = document.querySelector('.q-card.selected');
    if (sel) sel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function closeEditPanel() {
  document.getElementById('right-empty').style.display = 'block';
  document.getElementById('edit-form').style.display = 'none';
}

function openEditPanel(q) {
  document.getElementById('right-empty').style.display = 'none';
  document.getElementById('edit-form').style.display = 'flex';
  document.getElementById('edit-form').style.flexDirection = 'column';
  document.getElementById('edit-form').style.gap = '8px';

  const recLevel = recommendLevel(q);
  const warnings = detectWarnings(q);

  document.getElementById('edit-qnum').textContent =
    `${STATE.currentBank.indexOf(q) + 1}번`;
  document.getElementById('edit-qid').textContent = `id: ${q.id}`;

  // 경고 목록
  const warnList = document.getElementById('edit-warnings-list');
  warnList.innerHTML = warnings.map(w =>
    `<div class="edit-warn-item">⚠ ${w}</div>`).join('');

  // 추천 난이도
  const recDiv = document.getElementById('edit-rec-level');
  if (recLevel !== q.level) {
    recDiv.innerHTML = `<span class="badge badge-rec-diff">추천 난이도: ${recLevel} (현재: ${q.level})</span>`;
  } else {
    recDiv.innerHTML = `<span style="font-size:11px;color:#888">추천 난이도: ${recLevel} (일치)</span>`;
  }

  // 폼 채우기
  document.getElementById('e-level').value = q.level || '중';
  document.getElementById('e-qtype').value = q.questionType || '객관식';
  document.getElementById('e-layout').value = q.layoutTag || '';
  document.getElementById('e-tags').value = (q.tags || []).join('\n');
  document.getElementById('e-content').value = q.content || '';
  document.getElementById('e-choices').value = (q.choices || []).join('\n');
  document.getElementById('e-answer').value = String(q.answer || '');
  document.getElementById('e-solution').value = q.solution || '';
  document.getElementById('e-image').value = q.image || '';

  updateImagePreview(q.image || '');
}

async function updateImagePreview(imgPath) {
  const el = document.getElementById('e-image-preview');
  el.innerHTML = '';
  if (!imgPath) return;
  const normalized = normalizeImagePath(imgPath);
  if (STATE.imageMap.size > 0) {
    const blobUrl = await getImageBlobUrl(normalized);
    if (blobUrl) {
      el.innerHTML = `<img src="${blobUrl}" alt="${normalized}">`;
    } else {
      el.innerHTML = `<span style="font-size:11px;color:#bf360c">⚠ 파일 없음: ${normalized}</span>`;
    }
  } else {
    el.innerHTML = `<span style="font-size:11px;color:#6a1a6a">이미지 경로 있음 (폴더 미열림)</span>`;
  }
}

// 적용 버튼
document.getElementById('btn-apply').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  if (STATE.selectedIdx < 0) return;
  const q = STATE.currentBank[STATE.selectedIdx];

  q.level = document.getElementById('e-level').value;
  q.questionType = document.getElementById('e-qtype').value;
  q.layoutTag = document.getElementById('e-layout').value.trim();

  const rawTags = document.getElementById('e-tags').value;
  q.tags = rawTags.split(/[,\n]/).map(t => t.trim()).filter(Boolean);

  q.content = document.getElementById('e-content').value;

  const rawChoices = document.getElementById('e-choices').value;
  q.choices = rawChoices.split('\n').map(c => c.trim()).filter(Boolean);

  q.answer = document.getElementById('e-answer').value;
  q.solution = document.getElementById('e-solution').value;
  q.image = document.getElementById('e-image').value.trim();

  STATE.modifiedIds.add(q.id);
  renderAll();
  openEditPanel(q);
  showToast('적용됨');
});

// 제거 버튼
document.getElementById('btn-remove').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  if (STATE.selectedIdx < 0) return;
  const q = STATE.currentBank[STATE.selectedIdx];
  if (!confirm(`문항 id:${q.id}을 현재 검수본에서 제거합니다.\n원본 저장 전까지는 되돌릴 수 있습니다.`)) return;

  STATE.removedItems.push(deepCopy(q));
  STATE.removedIds.add(q.id);
  STATE.currentBank.splice(STATE.selectedIdx, 1);
  STATE.selectedIdx = -1;
  closeEditPanel();
  renderAll();
  showToast('제거됨 (되돌리기 가능)');
});

// 되돌리기 버튼
document.getElementById('btn-revert').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  if (STATE.selectedIdx < 0) return;
  const q = STATE.currentBank[STATE.selectedIdx];
  const orig = STATE.originalBank.find(o => o.id === q.id);
  if (!orig) { showToast('원본을 찾을 수 없습니다.'); return; }

  Object.assign(q, deepCopy(orig));
  STATE.modifiedIds.delete(q.id);
  openEditPanel(q);
  renderAll();
  showToast('되돌림');
});

// 전체 되돌리기
document.getElementById('btn-restore-all').addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
  if (!confirm('모든 수정/제거를 되돌립니다. 현재 수정 내용이 사라집니다.')) return;
  STATE.currentBank = deepCopy(STATE.originalBank);
  STATE.removedItems = [];
  STATE.modifiedIds = new Set();
  STATE.removedIds = new Set();
  STATE.selectedIdx = -1;
  closeEditPanel();
  renderAll();
  showToast('전체 되돌림 완료');
});

// image input 변경 시 미리보기 갱신
document.getElementById('e-image').addEventListener('input', function() {
  updateImagePreview(this.value.trim());
});

// ================================================================
//  파일 목록 렌더링
// ================================================================
function renderFileList() {
  const container = document.getElementById('file-list');
  container.innerHTML = '';
  const q = STATE.fileSearch.trim();
  const tokens = q ? q.toLowerCase().split(/\s+/).filter(Boolean) : [];
  const filtered = STATE.fileHandles.filter(({ path }) => {
    if (tokens.length === 0) return true;
    const hay = path.toLowerCase();
    return tokens.every(t => hay.includes(t));
  });
  document.getElementById('file-search').style.display = STATE.fileHandles.length > 0 ? 'block' : 'none';

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:6px;color:#aaa;font-size:11px">파일 없음</div>';
    return;
  }

  filtered.forEach(({ path, handle }) => {
    const div = document.createElement('div');
    div.className = 'file-item' + (handle === STATE.currentFileHandle ? ' active' : '');
    const parts = path.split('/');
    const name = parts.pop();
    const subpath = parts.join('/');
    div.innerHTML = `<span>${name}</span>${subpath ? `<span class="file-subpath">${subpath}</span>` : ''}`;
    div.title = path;
    div.addEventListener('click', async () => {
      if (hasDirtyState() && !confirm('현재 파일에 저장하지 않은 수정이 있습니다. 다른 파일을 열까요?')) return;
      STATE.currentFileHandle = handle;
      STATE.currentFilePath = path;  // archive 기준 상대 경로
      await loadFileHandle(handle);
      renderFileList();
    });
    container.appendChild(div);
  });
}

document.getElementById('file-search').addEventListener('input', function() {
  STATE.fileSearch = this.value;
  renderFileList();
});

// ================================================================
//  필터 버튼 렌더링
// ================================================================
const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'warning', label: '경고 있음', cls: 'warn' },
  { key: 'modified', label: '수정됨' },
  { key: 'removed', label: '제거됨' },
  { key: 'recdiff', label: '난이도 확인', cls: 'warn' },
  { key: 'imgneeded', label: '이미지 필요' },
  { key: 'broken', label: '깨진 문자', cls: 'warn' },
  { key: 'meta', label: '메타 문구', cls: 'warn' },
  { key: 'noanswer', label: 'answer 없음', cls: 'warn' },
  { key: 'nosolution', label: 'solution 없음' },
  { key: '하', label: '하' },
  { key: '중', label: '중' },
  { key: '상', label: '상' },
  { key: '객관식', label: '객관식' },
  { key: '단답형', label: '단답형' },
];

function renderFilterBtns() {
  const container = document.getElementById('filter-btns');
  container.innerHTML = '';
  FILTERS.forEach(({ key, label, cls }) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (STATE.filter === key ? ' active' : '') + (cls ? ` ${cls}` : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      commitEditorDraft();
      STATE.filter = key;
      renderFilterBtns();
      renderAll();
    });
    container.appendChild(btn);
  });
}

document.getElementById('content-search').addEventListener('input', function() {
  commitEditorDraft();
  STATE.searchText = this.value;
  renderAll();
});

// ================================================================
//  통계 업데이트
// ================================================================
function updateStats() {
  const total = STATE.originalBank.length;
  const cur = STATE.currentBank.length;
  const warnCount = STATE.currentBank.filter(q => detectWarnings(q).length > 0).length;
  const modCount = STATE.modifiedIds.size;
  const rmCount = STATE.removedIds.size;

  document.getElementById('left-stats').innerHTML = `
    <span>전체: ${total}문항</span>
    <span>현재: ${cur}문항</span>
    <span class="stat-warn">경고: ${warnCount}문항</span>
    <span class="stat-mod">수정: ${modCount}문항</span>
    <span class="stat-rm">제거: ${rmCount}문항</span>`;

  document.getElementById('status-counts').textContent =
    `경고 ${warnCount} / 수정 ${modCount} / 제거 ${rmCount}`;
}

// ================================================================
//  저장 모드 표시
// ================================================================
function updateSaveMode() {
  const el = document.getElementById('status-save-mode');
  if (STATE.canWrite) {
    el.textContent = '직접 저장 가능';
    el.style.background = '#2e7d32';
  } else {
    el.textContent = STATE.fallbackMode ? '다운로드만 가능' : '';
    el.style.background = STATE.fallbackMode ? '#bf360c' : '';
  }
}

// ================================================================
//  JS 직렬화 (저장용)
// ================================================================
function serializeQuestion(q) {
  const KEY_ORDER = [
    'id','level','category','originalCategory','standardCourse',
    'standardUnitKey','standardUnit','standardUnitOrder',
    'subUnitKey','subUnit','conceptClusterKey',
    'questionType','layoutTag','tags','wide',
    'content','choices','answer','solution','image',
  ];

  const lines = [];
  // 우선 KEY_ORDER 순서로
  const written = new Set();
  KEY_ORDER.forEach(key => {
    if (!(key in q)) return;
    written.add(key);
    lines.push(`    ${key}: ${serializeValue(q[key])}`);
  });
  // 나머지 필드 (KEY_ORDER에 없는 것)
  Object.keys(q).forEach(key => {
    if (written.has(key)) return;
    lines.push(`    ${key}: ${serializeValue(q[key])}`);
  });

  return `  {\n${lines.join(',\n')}\n  }`;
}

function serializeValue(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const items = v.map(item => '    ' + serializeValue(item));
    return '[\n' + items.join(',\n') + '\n  ]';
  }
  return JSON.stringify(v, null, 2);
}

function generateJs() {
  const title = JSON.stringify(STATE.examTitle);
  const questions = STATE.currentBank.map(q => serializeQuestion(q)).join(',\n');
  return `window.examTitle = ${title};\n\nwindow.questionBank = [\n${questions}\n];\n`;
}

// ================================================================
//  저장 / 다운로드
// ================================================================
async function saveFile() {
  commitEditorDraft();

  if (STATE.currentBank.length === 0 && STATE.originalBank.length > 0) {
    if (!confirm('모든 문항이 제거되어 있습니다. 그래도 저장합니까?')) return;
  }

  const summary = `수정: ${STATE.modifiedIds.size}문항 / 제거: ${STATE.removedIds.size}문항`;
  if (!confirm(`현재 JS 파일을 덮어씁니다.\n${summary}\n저장 전 자동 백업을 다운로드합니다.`)) return;

  // 저장 전 복원 대상 스냅샷
  const savedSelectedIdx = STATE.selectedIdx;
  const savedFilePath    = STATE.currentFilePath;

  downloadBackup();
  const newJs = generateJs();

  if (STATE.canWrite && STATE.currentFileHandle) {
    try {
      const writable = await STATE.currentFileHandle.createWritable();
      await writable.write(newJs);
      await writable.close();

      // 상태 갱신 — archiveDirHandle / fileHandles / currentFileHandle 은 절대 건드리지 않음
      STATE.currentSource  = newJs;
      STATE.originalBank   = deepCopy(STATE.currentBank);
      STATE.modifiedIds    = new Set();
      STATE.removedIds     = new Set();
      STATE.removedItems   = [];
      STATE.selectedIdx    = savedSelectedIdx;
      STATE.currentFilePath = savedFilePath;

      updateStats();
      renderFilterBtns();
      if (STATE.viewMode === 'table') renderReviewTable();
      else refreshEngineIframe(true);   // iframe src만 교체 — 부모 페이지 무관
      showToast('✓ 저장 완료: ' + STATE.currentFileName);
    } catch(e) {
      showError('저장 실패: ' + e.message + '\n다운로드로 대체합니다.');
      downloadText(newJs, STATE.currentFileName);
    }
  } else {
    downloadText(newJs, STATE.currentFileName);
    showToast('다운로드로 저장됨 (원본 직접 저장은 폴더/파일 권한 필요)');
  }
}

function downloadModified() {
  if (!STATE.currentFileName) { showToast('파일을 먼저 열어주세요.'); return; }
  commitEditorDraft();
  downloadText(generateJs(), STATE.currentFileName);
  showToast('다운로드 완료');
}

function downloadBackup() {
  if (!STATE.currentSource || !STATE.currentFileName) return;
  const ts = formatDate();
  const backupName = STATE.currentFileName.replace(/\.js$/, '') + `.before-internal-review-${ts}.js`;
  downloadText(STATE.currentSource, backupName);
}

function downloadCsvReport() {
  if (!STATE.currentBank.length) { showToast('문항이 없습니다.'); return; }

  const headers = ['번호','id','현재레벨','추천레벨','유형','tags','내용(preview)','정답(preview)','경고','수정','제거'];
  const rows = STATE.currentBank.map((q, i) => {
    const warnings = detectWarnings(q);
    const recLevel = recommendLevel(q);
    return [
      i + 1,
      q.id,
      q.level || '',
      recLevel,
      q.questionType || '',
      (q.tags || []).join('|'),
      (q.content || '').replace(/[\r\n]+/g,' ').slice(0, 50),
      String(q.answer || '').slice(0, 20),
      warnings.join(' / '),
      STATE.modifiedIds.has(q.id) ? '✓' : '',
      STATE.removedIds.has(q.id) ? '제거' : '',
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const ts = formatDate();
  const fname = `review-table-${STATE.currentFileName.replace(/\.js$/,'')}-${ts}.csv`;
  downloadCsv(csv, fname);
  showToast('CSV 다운로드 완료');
}

// ================================================================
//  보기 모드 전환
// ================================================================
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    commitEditorDraft();
    const mode = this.dataset.mode;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    STATE.viewMode = mode;

    const isTable = mode === 'table';
    document.getElementById('review-table-area').style.display = isTable ? 'block' : 'none';
    document.getElementById('engine-iframe-wrap').style.display = isTable ? 'none' : 'flex';

    if (isTable) renderReviewTable();
    else refreshEngineIframe();
  });
});

// ================================================================
//  전체 렌더링
// ================================================================
function renderAll() {
  updateStats();
  renderFilterBtns();
  if (STATE.viewMode === 'table') renderReviewTable();
  // iframe은 저장 시에만 새로고침 — renderAll에서는 갱신하지 않음
}

// ================================================================
//  버튼 이벤트
// ================================================================
document.getElementById('btn-open-dir').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openArchiveDir(); });
document.getElementById('btn-open-file').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openSingleFile(); });
document.getElementById('btn-save-file').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); saveFile(); });
document.getElementById('btn-download').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); downloadModified(); });
document.getElementById('btn-backup').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); downloadBackup(); });
document.getElementById('btn-csv').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); downloadCsvReport(); });

// ================================================================
//  키보드 단축키
// ================================================================
document.addEventListener('keydown', e => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    saveFile();
  }
  if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    downloadModified();
  }
  if (e.key === 'Escape') {
    STATE.selectedIdx = -1;
    closeEditPanel();
  }
});

// ================================================================
//  초기화
// ================================================================
window.addEventListener('beforeunload', e => {
  if (hasDirtyState()) { e.preventDefault(); e.returnValue = ''; }
});

updateSaveMode();
renderFilterBtns();
document.getElementById('status-file').textContent = '파일을 열어주세요';
