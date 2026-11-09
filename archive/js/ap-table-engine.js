/*
 * AP Table Engine v1
 *
 * Authors write table CONTENT only. This module decides the table DESIGN at render time, so one
 * set of rules (archive/css/ap-table.css) applies to every question/solution string, including
 * strings frozen in saved papers, mixer snapshots and class assignments.
 *
 *   renderApTables(html)   -> html with every table in canonical form
 *   extractTableCells(html) -> flat list of normalised cell texts (before/after comparison)
 *
 * Canonical form:  <div class="ap-table-wrap question-table-wrap"><table class="ap-table question-table">...
 *  - Markdown pipe tables (lines of `| a | b |`) become real <table>.
 *  - Existing HTML tables lose style/border/width/cellpadding/... and get the canonical classes.
 *  - Cell content is never rewritten (only `<`/`>` inside math of pipe cells are escaped).
 *  - Idempotent: renderApTables(renderApTables(x)) === renderApTables(x).
 *
 * UMD, no dependencies.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.ApTableEngine = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
    'use strict';

    var WRAP_CLASS = 'ap-table-wrap question-table-wrap';
    var TABLE_CLASS = 'ap-table question-table';
    var HANGUL_LONG = 12;     // >= this many Hangul chars in a cell -> ap-cell-text (left aligned prose cell)
    var WIDE_COLUMNS = 7;     // >= this many columns -> ap-table-wide
    var LABEL_MAX_LEN = 24;   // first-column cell shorter than this counts as a row label

    var MATH_OPEN = '';
    var MATH_CLOSE = '';
    var TABLE_OPEN = '';
    var TABLE_CLOSE = '';
    var HTMLTBL_OPEN = '';
    var HTMLTBL_CLOSE = '';

    // ---------------------------------------------------------------- shared helpers

    function maskMath(text) {
        var store = [];
        var put = function (m) { store.push(m); return MATH_OPEN + (store.length - 1) + MATH_CLOSE; };
        var s = String(text)
            .replace(/\$\$[\s\S]*?\$\$/g, put)
            .replace(/\\\[[\s\S]*?\\\]/g, put)
            .replace(/\\\([\s\S]*?\\\)/g, put)
            .replace(/\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\1\}/g, put)
            .replace(/\$(?!\$)[\s\S]*?(?<!\$)\$/g, put);
        return { text: s, store: store };
    }

    var MATH_TOKEN_RE = /(\d+)/g;

    function unmaskRaw(text, store) {
        var s = text;
        for (var i = 0; i < 4 && s.indexOf(MATH_OPEN) !== -1; i++) {
            s = s.replace(MATH_TOKEN_RE, function (_, n) { return store[+n]; });
        }
        return s;
    }

    function escapeAngles(math) {
        return math.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Math as it must appear inside a pipe-table cell: delimiters normalised to $...$ / $$...$$,
    // comparison signs escaped (the table is shielded from wrapLatex, which would normally do it),
    // source line breaks collapsed.
    function cellMath(m) {
        var t = m;
        if (/^\\\([\s\S]*\\\)$/.test(t)) t = '$' + t.slice(2, -2) + '$';
        else if (/^\\\[[\s\S]*\\\]$/.test(t)) t = '$$' + t.slice(2, -2) + '$$';
        return escapeAngles(t).replace(/\r\n|\r|\n/g, ' ');
    }

    var KEEP_TAG_RE = /<\/?(?:br|b|i|u|sup|sub|span|strong|em|img)\b[^>]*>/gi;

    function cellHtmlFromMasked(maskedCell, store) {
        var tags = [];
        var s = maskedCell.trim().replace(KEEP_TAG_RE, function (m) { tags.push(m); return TABLE_OPEN + (tags.length - 1) + TABLE_CLOSE; });
        s = s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        s = s.replace(/(\d+)/g, function (_, n) { return tags[+n]; });
        for (var i = 0; i < 4 && s.indexOf(MATH_OPEN) !== -1; i++) {
            s = s.replace(MATH_TOKEN_RE, function (_, n) { return cellMath(store[+n]); });
        }
        return s;
    }

    function plainForCount(html) {
        var m = maskMath(html);
        return m.text.replace(/<[^>]*>/g, '').replace(MATH_TOKEN_RE, '').replace(/&[a-z#0-9]+;/gi, ' ');
    }

    function hangulCount(html) {
        var m = plainForCount(html).match(/[가-힣]/g);
        return m ? m.length : 0;
    }

    // ---------------------------------------------------------------- pipe tables

    var SEP_CELL_RE = /^\s*:?-+:?\s*$/;

    var BLOCK_TAGS = '(?:p|div|span|figure|center|img)';
    var LEAD_RE = new RegExp('^\\s*((?:<\\/?' + BLOCK_TAGS + '\\b[^>]*>\\s*)+)(?=\\|)', 'i');
    var TRAIL_RE = new RegExp('(?<=\\|)\\s*(\\[\\s*\\d+(?:\\.\\d+)?\\s*점\\s*\\])?\\s*((?:<\\/?' + BLOCK_TAGS + '\\b[^>]*>\\s*)*)$', 'i');

    function parseRow(line) {
        var t = line.trim();
        if (/\|\s*\\$/.test(t)) t = t.replace(/\s*\\$/, '');   // Markdown hard line break after a row
        var lead = '', tail = '';
        var lm = LEAD_RE.exec(t);
        if (lm) { lead = lm[1].trim(); t = t.slice(lm[0].length); }
        var tm = TRAIL_RE.exec(t);
        if (tm && (tm[1] || tm[2])) {
            var head = t.slice(0, tm.index);
            if (head.length >= 2 && head.charAt(head.length - 1) === '|') {
                tail = (tm[1] ? ' ' + tm[1] : '') + (tm[2] ? tm[2].trim() : '');
                t = head;
            }
        }
        if (t.length < 2 || t.charAt(0) !== '|' || t.charAt(t.length - 1) !== '|') return null;
        var cells = t.slice(1, -1).split('|');
        var isSep = cells.every(function (c) { return SEP_CELL_RE.test(c); });
        return { cells: cells, isSep: isSep, tail: tail, lead: lead };
    }

    function isShortLabel(cell) {
        var m = maskMath(cell);
        var plain = m.text.replace(/<[^>]*>/g, '').trim();
        // a value (starts with a digit, with or without $) is data, not a row label
        if (/^\$*\s*[-+]?\d/.test(unmaskRaw(plain, m.store))) return false;
        return plain.length <= LABEL_MAX_LEN && hangulCount(cell) < HANGUL_LONG;
    }

    function buildPipeTable(rows, hasSep, store) {
        // rows: array of cell arrays (raw masked text). Returns table html or null.
        var cols = rows[0].length;
        if (cols < 1) return null;
        var data = rows.slice();
        var headerEmpty = data.length > 1 && data[0].every(function (c) { return !c.trim(); });
        var noHeader = false;
        if (headerEmpty) { data.shift(); noHeader = true; }
        var horizontal = !noHeader && cols >= 2 && cols > data.length && data.length >= 2 &&
            data.slice(1).every(function (r) { return isShortLabel(r[0]); });
        var out = ['<table>'];
        data.forEach(function (r, ri) {
            var isHead = !noHeader && ri === 0;
            if (ri === 0 && isHead) out.push('<thead>');
            if (ri === 1 && !noHeader) out.push('<tbody>');
            if (ri === 0 && noHeader) out.push('<tbody>');
            out.push('<tr>');
            r.forEach(function (c, ci) {
                var html = cellHtmlFromMasked(c, store);
                if (isHead) out.push('<th scope="col">' + html + '</th>');
                else if (horizontal && ci === 0) out.push('<th scope="row">' + html + '</th>');
                else out.push('<td>' + html + '</td>');
            });
            out.push('</tr>');
            if (ri === 0 && isHead) out.push('</thead>');
        });
        if (!(data.length === 1 && !noHeader)) out.push('</tbody>');
        out.push('</table>');
        return out.join('');
    }

    // One pass over `text` using `sepRe` (one capture group) as the line separator.
    // Recognised tables are stored in `tables` and replaced by TABLE tokens.
    function pipeStage(text, sepRe, tables, store) {
        var parts = text.split(sepRe);
        var lines = [], seps = [];
        for (var k = 0; k < parts.length; k++) (k % 2 === 0 ? lines : seps).push(parts[k]);
        var n = lines.length;
        var rowInfo = lines.map(parseRow);
        var removed = [];
        var dropSep = [];
        var i = 0;
        while (i < n) {
            if (!rowInfo[i]) { i++; continue; }
            var j = i;
            while (j < n && rowInfo[j]) j++;
            // lines i..j-1 are a run of pipe rows; split into groups of equal cell count.
            var groups = [];
            var cur = null;
            for (var r = i; r < j; r++) {
                var info = rowInfo[r];
                if (info.isSep) {
                    if (cur) { cur.sep = true; cur.end = r; }
                    else cur = { rows: [], sep: true, tail: '', lead: '', start: r, end: r };
                    continue;
                }
                if (cur && cur.rows.length && (cur.rows[0].length !== info.cells.length || info.lead)) {
                    groups.push(cur);
                    cur = null;
                }
                if (!cur) cur = { rows: [], sep: false, tail: '', lead: '', start: r, end: r };
                if (!cur.rows.length) cur.lead = info.lead;
                cur.rows.push(info.cells);
                cur.end = r;
                if (info.tail) { cur.tail = info.tail; groups.push(cur); cur = null; }
            }
            if (cur && cur.rows.length) groups.push(cur);
            groups.forEach(function (g) {
                var cols = g.rows[0].length;
                var ok = cols === 1 ? g.rows.length >= 2 : (g.rows.length >= 2 || (g.rows.length === 1 && g.sep));
                if (!ok) return;
                var html = buildPipeTable(g.rows, g.sep, store);
                if (!html) return;
                tables.push(html + g.tail);
                lines[g.start] = g.lead + TABLE_OPEN + (tables.length - 1) + TABLE_CLOSE;
                if (g.start > 0 && !rowInfo[g.start - 1] && /[^\\]\\$/.test(lines[g.start - 1])) lines[g.start - 1] = lines[g.start - 1].slice(0, -1);   // stray hard-break backslash before the table
                for (var q = g.start + 1; q <= g.end; q++) removed[q] = true;
                dropSep[g.start] = true;      // the separator after the whole table is dropped
            });
            i = j;
        }
        var res = '';
        for (var o = 0; o < n; o++) {
            if (removed[o]) continue;
            res += lines[o];
            if (o < n - 1 && !dropSep[o]) res += seps[o];
        }
        return res;
    }

    var STAGE1_SEP = /(\r?\n|\\n(?![a-zA-Z]))/;
    var STAGE2_SEP = /(<br\s*\/?>|\r?\n|\\n(?![a-zA-Z]))/i;

    function hasPipeRowCandidate(text, sepRe) {
        var parts = text.split(sepRe);
        for (var k = 0; k < parts.length; k += 2) if (parseRow(parts[k])) return true;
        return false;
    }

    function convertPipeTables(s) {
        if (s.indexOf('|') === -1) return s;
        // Existing HTML tables are opaque here (their cells may legitimately contain `|`).
        var htmlTables = [];
        var t = s.replace(/<table\b[\s\S]*?<\/table\s*>/gi, function (m) { htmlTables.push(m); return HTMLTBL_OPEN + (htmlTables.length - 1) + HTMLTBL_CLOSE; });
        var masked = maskMath(t);
        t = masked.text;
        if (!hasPipeRowCandidate(t, STAGE2_SEP)) { return s; }
        var tables = [];
        t = pipeStage(t, STAGE1_SEP, tables, masked.store);
        if (hasPipeRowCandidate(t, STAGE2_SEP)) t = pipeStage(t, STAGE2_SEP, tables, masked.store);
        if (!tables.length) return s;
        t = t.replace(/(\d+)/g, function (_, n) { return tables[+n]; });
        t = unmaskRaw(t, masked.store);
        t = t.replace(/(\d+)/g, function (_, n) { return htmlTables[+n]; });
        return t;
    }

    // ---------------------------------------------------------------- HTML tables

    var STRUCT_TAG_RE = /<(\/?)(table|thead|tbody|tfoot|tr|th|td|col|colgroup|caption)\b([^>]*)>/gi;
    var ATTR_RE = /([a-zA-Z_:][-\w:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

    function parseAttrs(raw) {
        var out = {};
        var src = raw.replace(/\\(["'])/g, '$1').replace(/\/\s*$/, '');
        var m;
        ATTR_RE.lastIndex = 0;
        while ((m = ATTR_RE.exec(src))) {
            var name = m[1].toLowerCase();
            var val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ''));
            if (!(name in out)) out[name] = val;
        }
        return out;
    }

    function grayShade(style) {
        var m = /background(?:-color)?\s*:\s*#([0-9a-f]{3}|[0-9a-f]{6})\b/i.exec(style || '');
        if (!m) return false;
        var h = m[1];
        if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
        var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        return max - min <= 12 && max < 248 && min > 200;
    }

    function apClasses(attrs, extra) {
        var set = {};
        String(attrs['class'] || '').split(/\s+/).forEach(function (c) { if (/^ap-(?!table-wrap)/.test(c) && c !== 'ap-table') set[c] = 1; });
        (extra || []).forEach(function (c) { set[c] = 1; });
        var order = ['ap-shade', 'ap-cell-text', 'ap-table-wide', 'ap-table-grid'];
        var names = Object.keys(set).sort(function (a, b) {
            var ia = order.indexOf(a), ib = order.indexOf(b);
            if (ia === -1) ia = 99; if (ib === -1) ib = 99;
            return ia - ib || (a < b ? -1 : a > b ? 1 : 0);
        });
        return names;
    }

    function posInt(v) { var n = parseInt(v, 10); return n >= 1 ? n : 0; }

    function canonicalTable(html) {
        var pieces = [];            // strings or {kind, ...} patched later
        var last = 0;
        var stack = [];             // open tables {piece, max, cur, grid}
        var prevCell = null;        // cell piece whose text we are collecting
        var m;
        STRUCT_TAG_RE.lastIndex = 0;
        var flushText = function (text) {
            if (!text) return;
            if (prevCell) { prevCell.text += text; }
            pieces.push(text);
        };
        while ((m = STRUCT_TAG_RE.exec(html))) {
            flushText(html.slice(last, m.index));
            last = m.index + m[0].length;
            prevCell = null;
            var closing = m[1] === '/';
            var tag = m[2].toLowerCase();
            var attrs = closing ? {} : parseAttrs(m[3]);
            if (tag === 'table') {
                if (closing) {
                    var tb = stack.pop();
                    if (tb) { tb.piece.wide = tb.max >= WIDE_COLUMNS; tb.piece.grid = tb.grid; }
                    pieces.push('</table>');
                } else {
                    var wasGrid = /\bap-table-grid\b/.test(attrs['class'] || '');
                    var tp = { kind: 'table', attrs: attrs, wide: false, grid: wasGrid };
                    stack.push({ piece: tp, max: 0, cur: 0, grid: wasGrid });
                    pieces.push(tp);
                }
            } else if (tag === 'colgroup' || tag === 'col') {
                // widths are decided by the engine
            } else if (closing) {
                pieces.push('</' + tag + '>');
            } else if (tag === 'tr') {
                if (stack.length) stack[stack.length - 1].cur = 0;
                pieces.push({ kind: 'plain', tag: 'tr', attrs: attrs });
            } else if (tag === 'th' || tag === 'td') {
                var colspan = posInt(attrs.colspan) || 1;
                var top = stack[stack.length - 1];
                if (top) {
                    top.cur += colspan;
                    if (top.cur > top.max) top.max = top.cur;
                    if (/\bwidth\s*:\s*\d/i.test(attrs.style || '') && /\bheight\s*:\s*\d/i.test(attrs.style || '')) top.grid = true;
                }
                var cp = { kind: 'cell', tag: tag, attrs: attrs, text: '' };
                pieces.push(cp);
                prevCell = cp;
            } else {
                pieces.push({ kind: 'plain', tag: tag, attrs: attrs });
            }
        }
        if (last < html.length) flushText(html.slice(last));
        return pieces.map(function (p) {
            if (typeof p === 'string') return p;
            if (p.kind === 'table') {
                var tc = TABLE_CLASS + (p.wide ? ' ap-table-wide' : '') + (p.grid ? ' ap-table-grid' : '');
                var extra = apClasses(p.attrs).filter(function (c) { return c !== 'ap-table-wide' && c !== 'ap-table-grid'; });
                return '<table class="' + tc + (extra.length ? ' ' + extra.join(' ') : '') + '">';
            }
            if (p.kind === 'plain') {
                var pc = apClasses(p.attrs, grayShade(p.attrs.style) ? ['ap-shade'] : []);
                return '<' + p.tag + (pc.length ? ' class="' + pc.join(' ') + '"' : '') + '>';
            }
            // cell
            var a = p.attrs;
            var extraCls = [];
            if (grayShade(a.style)) extraCls.push('ap-shade');
            if (hangulCount(p.text) >= HANGUL_LONG) extraCls.push('ap-cell-text');
            var cc = apClasses(a, extraCls);
            var out = '<' + p.tag;
            if (cc.length) out += ' class="' + cc.join(' ') + '"';
            var cs = posInt(a.colspan), rs = posInt(a.rowspan);
            if (cs > 1) out += ' colspan="' + cs + '"';
            if (rs > 1) out += ' rowspan="' + rs + '"';
            if (/^(col|row|colgroup|rowgroup)$/i.test(a.scope || '')) out += ' scope="' + a.scope.toLowerCase() + '"';
            return out + '>';
        }).join('');
    }

    var WRAP_OPEN_TAIL_RE = /<div\b[^>]*\bclass\s*=\s*(?:"[^"]*\b(?:ap-table-wrap|question-table-wrap)\b[^"]*"|'[^']*\b(?:ap-table-wrap|question-table-wrap)\b[^']*')[^>]*>\s*$/i;
    var WRAP_CLOSE_HEAD_RE = /^\s*<\/div\s*>/i;

    function canonicalizeHtmlTables(s) {
        if (!/<table\b/i.test(s)) return s;
        var re = /<table\b[^>]*>|<\/table\s*>/gi;
        var m, depth = 0, start = -1;
        var ranges = [];
        while ((m = re.exec(s))) {
            if (m[0].charAt(1) === '/') {
                if (depth > 0) { depth--; if (depth === 0) ranges.push([start, m.index + m[0].length]); }
            } else {
                if (depth === 0) start = m.index;
                depth++;
            }
        }
        if (depth > 0 && start >= 0) ranges.push([start, s.length]);      // unterminated: take the rest
        if (!ranges.length) return s;
        var out = '';
        var pos = 0;
        ranges.forEach(function (rg) {
            var pre = s.slice(pos, rg[0]);
            var raw = s.slice(rg[0], rg[1]);
            if (!/<\/table\s*>\s*$/i.test(raw)) raw += '</table>';
            var table = canonicalTable(raw);
            var post = s.slice(rg[1]);
            var open = WRAP_OPEN_TAIL_RE.exec(pre);
            if (open) {
                var close = WRAP_CLOSE_HEAD_RE.exec(post);
                out += pre.slice(0, open.index) + '<div class="' + WRAP_CLASS + '">' + table;
                if (close) { out += '</div>'; pos = rg[1] + close[0].length; }
                else pos = rg[1];
            } else {
                out += pre + '<div class="' + WRAP_CLASS + '">' + table + '</div>';
                pos = rg[1];
            }
        });
        return out + s.slice(pos);
    }

    // ---------------------------------------------------------------- public API

    function renderApTables(html) {
        if (html == null) return '';
        var s = String(html);
        if (s.indexOf('|') === -1 && !/<table\b/i.test(s)) return s;
        return canonicalizeHtmlTables(convertPipeTables(s));
    }

    var ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
    function decodeEntities(t) {
        return t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, function (all, e) {
            if (e.charAt(0) === '#') {
                var code = e.charAt(1).toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
                return code ? String.fromCodePoint(code) : all;
            }
            var v = ENTITY[e.toLowerCase()];
            return v === undefined ? all : v;
        });
    }

    function normCell(raw) {
        var m = maskMath(raw);
        var text = m.text.replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[a-zA-Z][^>]*>/g, '');
        text = decodeEntities(text);
        text = unmaskRaw(text, m.store.map(function (x) {
            var t = x;
            if (/^\\\([\s\S]*\\\)$/.test(t)) t = '$' + t.slice(2, -2) + '$';
            else if (/^\\\[[\s\S]*\\\]$/.test(t)) t = '$$' + t.slice(2, -2) + '$$';
            return decodeEntities(t);
        }));
        return text.replace(/\s+/g, ' ').trim();
    }

    // Cell texts of every table in `html`: HTML <td>/<th> cells and (when present, outside HTML
    // tables) pipe-row cells. Order = document order of HTML cells, then pipe cells per line run.
    function extractTableCells(html) {
        var s = String(html == null ? '' : html);
        var cells = [];
        var rest = s.replace(/<table\b[\s\S]*?<\/table\s*>/gi, function (tbl) {
            var re = /<t[dh]\b[^>]*>([\s\S]*?)(?=<\/t[dh]\s*>|<t[dh]\b|<\/tr\s*>|<\/table\s*>)/gi, m;
            while ((m = re.exec(tbl))) { var c = normCell(m[1]); if (c) cells.push(c); }
            return '\n';
        });
        if (rest.indexOf('|') !== -1) {
            var masked = maskMath(rest);
            var lines = masked.text.split(STAGE2_SEP);
            var rows = [];
            for (var k = 0; k < lines.length; k += 2) rows.push(parseRow(lines[k]));
            for (var r = 0; r < rows.length; r++) {
                if (!rows[r] || rows[r].isSep) continue;
                // a lone pipe line is not a table
                var prev = rows[r - 1], next = rows[r + 1];
                if (!prev && !next) continue;
                rows[r].cells.forEach(function (c) { var v = normCell(unmaskRaw(c, masked.store)); if (v) cells.push(v); });
            }
        }
        return cells;
    }

    return { renderApTables: renderApTables, extractTableCells: extractTableCells, version: 1 };
});
