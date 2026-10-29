/* ==========================================================================
   AP Math Lab Kit · 코어 (apl-core.js)
   - 전역 네임스페이스 window.APLab 을 만듭니다. (빌드 도구 없이 <script defer>로 사용)
   - 아이콘, KaTeX 수식 렌더, 저장소, 문구 정리, 색 변환 같은 공용 도구를 담습니다.
   ========================================================================== */
(function () {
  'use strict';
  const APLab = (window.APLab = window.APLab || {});
  APLab.version = '2.0.0-preview';

  /* ---------- DOM 도우미 ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style' && typeof v === 'object') {
          for (const [sk, sv] of Object.entries(v)) {
            if (sv == null || sv === '') continue;
            if (sk.startsWith('--')) el.style.setProperty(sk, sv);
            else el.style[sk] = sv;
          }
        }
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  APLab.h = h;
  APLab.$ = (sel, root = document) => root.querySelector(sel);
  APLab.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  APLab.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  APLab.lerp = (a, b, t) => a + (b - a) * t;
  APLab.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  APLab.fmt = (v, d = 2) => {
    if (!Number.isFinite(v)) return '—';
    const s = v.toFixed(d);
    return s === '-0.' + '0'.repeat(d) || s === '-0' ? (0).toFixed(d) : s.replace('-', '−');
  };

  /* ---------- 아이콘 (24×24, 선 아이콘) ---------- */
  const P = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    prev: '<path d="M15 18l-6-6 6-6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    play: '<path d="M7 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    zoomIn: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>',
    zoomOut: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/>',
    fit: '<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><circle cx="12" cy="12" r="2.2"/>',
    grid: '<path d="M4 4h16v16H4zM4 9.33h16M4 14.67h16M9.33 4v16M14.67 4v16"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    eraser: '<path d="M20 20H9L4 15a2 2 0 0 1 0-2.8L13.2 3a2 2 0 0 1 2.8 0L21 8a2 2 0 0 1 0 2.8L12 20"/><path d="M8.5 9.5l6 6"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    teach: '<path d="M3 4h18v12H3z"/><path d="M8 20h8M12 16v4"/><path d="M7 12l3-3 2 2 4-4"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
    full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    help: '<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.3"/><circle cx="12" cy="17.6" r=".9" fill="currentColor"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.6-1.7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.3" r=".9" fill="currentColor"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".9" fill="currentColor"/>',
    spark: '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="18" r="1" fill="currentColor"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    split: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5V4a1.5 1.5 0 0 1 3 0v7.5M14 11.5V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-.7a6 6 0 0 1-4.5-2L3.5 15a1.6 1.6 0 0 1 2.3-2.2L8 15"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h8M8 11h6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2v2"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9"/>',
    wand: '<path d="M15 4V2M15 10V8M11 6h2M17 6h2M4 20L14 10"/><path d="M18.5 3.5l1 1"/>'
  };
  APLab.icon = function (name, cls = 'apl-ico') {
    const body = P[name] || P.info;
    return `<span class="${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg></span>`;
  };
  APLab.iconEl = (name, cls) => {
    const t = document.createElement('template');
    t.innerHTML = APLab.icon(name, cls);
    return t.content.firstChild;
  };

  /* ---------- 수식(KaTeX) ---------- */
  const texCache = new Map();
  function tex(src, display = false) {
    const key = (display ? 'D|' : 'I|') + src;
    if (texCache.has(key)) return texCache.get(key);
    let out;
    if (window.katex) {
      try {
        out = window.katex.renderToString(src, { throwOnError: false, displayMode: display, strict: 'ignore' });
      } catch (e) {
        out = APLab.esc(src);
      }
      if (texCache.size > 4000) texCache.clear();
      texCache.set(key, out);
    } else {
      out = APLab.esc(src);
    }
    return out;
  }
  APLab.tex = tex;
  // HTML 문자열 안의 $...$ 구간(태그 바깥)을 KaTeX로 바꿉니다. 기존 해설 문자열을 수정하지 않고 쓰기 위함입니다.
  APLab.renderMath = function (html) {
    if (html == null) return '';
    const s = String(html);
    if (s.indexOf('$') < 0) return s;
    let out = '';
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === '<') {
        const j = s.indexOf('>', i);
        if (j < 0) { out += s.slice(i); break; }
        out += s.slice(i, j + 1);
        i = j + 1;
        continue;
      }
      if (ch === '$' && s[i - 1] !== '\\') {
        const display = s[i + 1] === '$';
        const open = display ? 2 : 1;
        let j = i + open;
        while (j < s.length) {
          if (s[j] === '$' && s[j - 1] !== '\\' && (!display || s[j + 1] === '$')) break;
          if (s[j] === '<') { j = -1; break; }
          j++;
        }
        if (j > 0 && j < s.length) {
          out += tex(s.slice(i + open, j).replace(/\\\$/g, '$'), display);
          i = j + open;
          continue;
        }
      }
      out += ch;
      i++;
    }
    return out;
  };
  APLab.setHTML = function (el, html) {
    const v = APLab.renderMath(html);
    if (el.__aplHTML !== v) {
      el.__aplHTML = v;
      el.innerHTML = v;
    }
  };
  APLab.setText = function (el, text) {
    const v = text == null ? '' : String(text);
    if (el.__aplText !== v) {
      el.__aplText = v;
      el.textContent = v;
    }
  };

  /* ---------- 문구 정리: 화면 표시용 (원문 데이터는 그대로 보존) ---------- */
  const EMOJI = /(?:[☀-➿⬀-⯿\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]|️|‍)/gu;
  APLab.stripEmoji = (s) => String(s == null ? '' : s).replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim();
  // "[오답 1위] 기준각 ..." → { flag: '오답 1위', text: '기준각 ...' }
  APLab.splitFlag = function (s) {
    const t = APLab.stripEmoji(s);
    const m = t.match(/^\[([^\]]{1,14})\]\s*(.*)$/);
    return m ? { flag: m[1], text: m[2] } : { flag: '', text: t };
  };
  // 해설 문단 맨 앞의 경고·전구 이모지는 아이콘이 대신하므로 떼어 냅니다.
  APLab.cleanLead = (s) => String(s == null ? '' : s).replace(/^\s*(?:[☀-➿\u{1F300}-\u{1FAFF}]️?\s*)+/u, '');

  /* ---------- 저장소 (실패해도 동작) ---------- */
  APLab.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('apl:' + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem('apl:' + key, JSON.stringify(value));
      } catch (e) { /* 사생활 보호 모드 등 */ }
    }
  };
  APLab.pushRecent = function (entry) {
    const list = APLab.store.get('recent', []).filter((r) => r.id !== entry.id);
    list.unshift({ ...entry, at: Date.now() });
    APLab.store.set('recent', list.slice(0, 8));
  };

  /* ---------- 테마 ---------- */
  APLab.theme = {
    current() {
      return document.documentElement.getAttribute('data-theme') || 'board';
    },
    init() {
      const saved = APLab.store.get('theme', null);
      const url = new URLSearchParams(location.search).get('theme');
      let t = url || saved;
      if (!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'paper' : 'board';
      document.documentElement.setAttribute('data-theme', t === 'paper' ? 'paper' : 'board');
    },
    toggle() {
      const next = APLab.theme.current() === 'paper' ? 'board' : 'paper';
      document.documentElement.setAttribute('data-theme', next);
      APLab.store.set('theme', next);
      window.dispatchEvent(new CustomEvent('apl:theme', { detail: next }));
      return next;
    }
  };
  APLab.theme.init();

  /* ---------- 알림 ---------- */
  let toastTimer = 0;
  APLab.toast = function (msg) {
    let t = document.querySelector('.apl-toast');
    if (!t) {
      t = h('div', { class: 'apl-toast', role: 'status' });
      document.body.append(t);
    }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 1800);
  };

  /* ---------- 대화상자 ---------- */
  APLab.dialog = function ({ title, body, wide = false, onClose }) {
    const close = () => {
      wrap.remove();
      document.removeEventListener('keydown', onKey, true);
      if (onClose) onClose();
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    const prevFocus = document.activeElement;
    const closeBtn = h('button', { class: 'apl-icon-btn', 'aria-label': '닫기', html: APLab.icon('x'), onclick: close });
    const box = h('div', { class: 'apl-dialog-box' + (wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('div', { class: 'apl-dialog-h' }, h('h2', { text: title }), closeBtn), body);
    const wrap = h('div', { class: 'apl-dialog', onclick: (e) => { if (e.target === wrap) close(); } }, box);
    document.body.append(wrap);
    document.addEventListener('keydown', onKey, true);
    closeBtn.focus();
    return { close, box };
  };

  /* ---------- QR (vendor/qrcode.js 가 있을 때만) ---------- */
  APLab.qrSVG = function (text) {
    if (typeof window.qrcode !== 'function') return '';
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(unescape(encodeURIComponent(text)));
      qr.make();
      return qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    } catch (e) {
      return '';
    }
  };

  /* ---------- 색 ---------- */
  function parseColor(c) {
    if (!c) return null;
    c = String(c).trim();
    let m = c.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
      let x = m[1];
      if (x.length === 3 || x.length === 4) x = x.split('').map((ch) => ch + ch).join('');
      const n = parseInt(x.slice(0, 6), 16);
      const a = x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1;
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
    }
    m = c.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
    if (m) {
      let a = m[4] == null ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      return { r: +m[1], g: +m[2], b: +m[3], a };
    }
    return null;
  }
  APLab.parseColor = parseColor;
  APLab.rgba = (c, a) => {
    const p = parseColor(c);
    if (!p) return c;
    return `rgba(${p.r},${p.g},${p.b},${a == null ? p.a : a})`;
  };
  // 기존 칠판 색(Tailwind 계열 헥사값)을 의미색 이름으로 바꿔 줍니다 — 테마가 바뀌어도 같은 뜻을 유지.
  APLab.legacyHue = function (rgb) {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (s < 0.22 || d < 0.08) return l > 0.62 ? 'ink' : l < 0.25 ? 'halo' : 'muted';
    let hue;
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = (hue * 60 + 360) % 360;
    if (hue < 12 || hue >= 346) return 'red';
    if (hue < 36) return 'orange';
    if (hue < 66) return 'amber';
    if (hue < 170) return 'green';
    if (hue < 222) return 'sky';
    if (hue < 252) return 'sky';
    if (hue < 300) return 'violet';
    if (hue < 346) return 'rose';
    return 'red';
  };
})();
