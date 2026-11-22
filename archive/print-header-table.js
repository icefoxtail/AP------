/* 인쇄 머리글 "표 머리글" 보조 스크립트 (engine.html · mixed_engine.html 공용)
 * 1) 제목 맞춤: 머리글 높이는 제목 길이와 상관없이 일정하게 둔다.
 *    한 줄에 들어갈 때까지 글자를 줄이고(하한 11pt), 그래도 안 되면 두 줄(10.5pt부터, 하한 9pt)로 접는다.
 * 2) 학원명 기억: 브라우저 localStorage에 학원명을 기억해 다음 시험지의 기본값으로 쓴다.
 * 3) 화면에서 머리글 칸을 눌러 바로 고치기: 제목·학원명·만점. 값은 기존 printHeaderOptions 경로(setPrintHeaderOptions)로 흘려
 *    모든 쪽에 반영한다. 만점(/ 100)만 이 창에서만 유지한다. 인쇄물에는 편집 표시가 찍히지 않는다(CSS는 screen 한정).
 */
(function () {
  'use strict';
  if (window.APPrintHeaderTable) return;

  var ACADEMY_KEY = 'ap.printHeader.academy.v1';
  var PX_PER_PT = 96 / 72;
  // max: 기본 글자 크기(pt), min1: 한 줄로 줄일 수 있는 하한, two: 두 줄 접기 시작 크기, abs: 절대 하한, lines: 허용 줄 수
  var PROFILES = {
    title: { max: 14.5, min1: 11, two: 10.5, abs: 9, lines: 2 },
    academy: { max: 12, min1: 9, two: 9, abs: 8, lines: 2 },
    'academy-sol': { max: 10.5, min1: 9, two: 9, abs: 8, lines: 0 },
    sol: { max: 10.5, min1: 9, two: 9, abs: 9, lines: 0 }
  };

  var maxScore = '100';
  var generation = 0;
  var retryCount = 0;

  function getAcademy() {
    try {
      var v = window.localStorage.getItem(ACADEMY_KEY);
      return typeof v === 'string' ? v.slice(0, 60) : '';
    } catch (e) { return ''; }
  }
  function rememberAcademy(value) {
    try { window.localStorage.setItem(ACADEMY_KEY, String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, 60)); } catch (e) { /* 저장 불가 환경은 무시 */ }
  }
  function maxScoreText() { return maxScore ? '/ ' + maxScore : ''; }

  function availHeight(el, profile) {
    if (!profile.lines) return Infinity;
    var cell = el.parentElement;
    if (!cell) return Infinity;
    var cs = window.getComputedStyle(cell);
    var inner = Math.max(cell.clientHeight, parseFloat(cs.minHeight) || 0) - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    if (el.dataset.phFit === 'academy') return inner - 9; // 주홍 막대 자리
    var used = 0;
    for (var i = 0; i < cell.children.length; i++) {
      var sib = cell.children[i];
      if (sib !== el) used += sib.offsetHeight;
    }
    return inner - used;
  }

  function fitsWidth(el) { return el.scrollWidth <= el.clientWidth + 0.5; }

  // 한 요소의 글자 크기·줄 수를 맞춘다. 숨겨진 상태(폭 0)면 false를 돌려주고 표시하지 않는다.
  var tableMedia = null;
  function tableLayoutActive() {
    try {
      if (!tableMedia) tableMedia = window.matchMedia('print, screen and (min-width: 641px)');
      return tableMedia.matches;
    } catch (e) { return true; }
  }

  function fitElement(el) {
    var profile = PROFILES[el.dataset.phFit];
    if (!profile || !el.isConnected) return true;
    if (!tableLayoutActive()) {
      // 휴대폰 폭(640px 이하)은 기존 쌓기 배치를 그대로 쓴다: 맞춤 흔적을 지운다.
      if (el.dataset.phDone) { el.style.whiteSpace = ''; el.style.fontSize = ''; delete el.dataset.phDone; delete el.dataset.phLines; delete el.dataset.phSize; }
      return true;
    }
    var sig = el.textContent + '|' + generation;
    if (el.dataset.phDone === sig) return true;
    if (!el.clientWidth) return false;
    var s = el.style;
    s.whiteSpace = 'nowrap';
    s.fontSize = profile.max + 'pt';
    var size = profile.max;
    var lines = 1;
    if (!fitsWidth(el)) {
      var est = profile.max * el.clientWidth / Math.max(el.scrollWidth, 1) * 0.99;
      if (est >= profile.min1) {
        size = Math.floor(est * 10) / 10;
        s.fontSize = size + 'pt';
        for (var n = 0; n < 8 && !fitsWidth(el) && size > profile.min1; n++) { size = Math.round((size - 0.2) * 10) / 10; s.fontSize = size + 'pt'; }
      } else {
        lines = 2;
        s.whiteSpace = 'normal';
        size = profile.two;
        s.fontSize = size + 'pt';
        var limit = availHeight(el, profile);
        while (size > profile.abs && !(fitsWidth(el) && el.offsetHeight <= limit + 0.5)) {
          size = Math.round((size - 0.25) * 100) / 100;
          s.fontSize = size + 'pt';
        }
      }
    }
    el.dataset.phLines = String(lines);
    el.dataset.phSize = String(size);
    el.dataset.phDone = sig;
    return true;
  }

  function canEdit() {
    if (document.documentElement.classList.contains('archive2-output')) return false; // Studio 스냅샷은 머리글을 따로 관리한다
    try { return window.matchMedia('(min-width: 641px)').matches && typeof window.setPrintHeaderOptions === 'function'; } catch (e) { return false; }
  }

  function decorate(root) {
    var allow = canEdit();
    var nodes = (root || document).querySelectorAll('[data-ph-edit]:not([data-ph-ready])');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.dataset.phReady = '1';
      if (!allow) continue;
      try { el.contentEditable = 'plaintext-only'; } catch (e) { /* 아래에서 보정 */ }
      if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
      el.spellcheck = false;
      el.setAttribute('role', 'textbox');
      el.setAttribute('title', '눌러서 고치기 (Enter 확정, Esc 취소)');
    }
  }

  function fitAll(force) {
    if (force) generation++;
    decorate(document);
    var pending = document.querySelectorAll('.page-header [data-ph-fit]');
    var failed = false;
    for (var i = 0; i < pending.length; i++) {
      if (!fitElement(pending[i])) failed = true;
    }
    if (failed && retryCount < 12) { retryCount++; setTimeout(function () { fitAll(false); }, 400); }
    else if (!failed) retryCount = 0;
  }

  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () { scheduled = false; fitAll(false); });
  }

  function applyMaxScore(text) {
    var v = String(text || '').replace(/[\/\s]/g, '').slice(0, 8);
    maxScore = v;
    var nodes = document.querySelectorAll('.header-max-score');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = maxScoreText();
  }

  function commit(el) {
    if (el.dataset.phBusy === '1') return;
    var orig = el.dataset.phOrig;
    if (orig === undefined) return;
    delete el.dataset.phOrig;
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var kind = el.dataset.phEdit;
    if (kind === 'max') {
      applyMaxScore(text);
      return;
    }
    if (text === orig.replace(/\s+/g, ' ').trim()) { el.textContent = orig; return; }
    if (typeof window.setPrintHeaderOptions !== 'function') return;
    el.dataset.phBusy = '1';
    setTimeout(function () { delete el.dataset.phBusy; }, 1500);
    if (kind === 'title') window.setPrintHeaderOptions({ title: text });
    else if (kind === 'academy') window.setPrintHeaderOptions({ metaRight: text });
  }

  function editTarget(e) {
    var t = e.target;
    return t && t.closest ? t.closest('[data-ph-edit][contenteditable]') : null;
  }

  document.addEventListener('focusin', function (e) {
    var el = editTarget(e);
    if (el && el.dataset.phOrig === undefined) el.dataset.phOrig = el.textContent;
  });
  document.addEventListener('focusout', function (e) {
    var el = editTarget(e);
    if (el) commit(el);
  });
  document.addEventListener('keydown', function (e) {
    var el = editTarget(e);
    if (!el) return;
    if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    else if (e.key === 'Escape') { e.preventDefault(); if (el.dataset.phOrig !== undefined) el.textContent = el.dataset.phOrig; el.blur(); }
  });

  function blurEditing() {
    var a = document.activeElement;
    if (a && a.matches && a.matches('[data-ph-edit]')) a.blur();
  }

  window.APPrintHeaderTable = {
    getAcademy: getAcademy,
    rememberAcademy: rememberAcademy,
    maxScoreText: maxScoreText,
    fitAll: fitAll,
    PROFILES: PROFILES
  };

  function start() {
    if (document.body && typeof MutationObserver === 'function') {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    }
    schedule();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(true); });
    window.addEventListener('load', function () { fitAll(true); });
    window.addEventListener('beforeprint', function () { blurEditing(); fitAll(true); });
    try {
      var mq = window.matchMedia('print, screen and (min-width: 641px)');
      var onChange = function () { fitAll(true); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    } catch (e) { /* 미지원 환경은 무시 */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
