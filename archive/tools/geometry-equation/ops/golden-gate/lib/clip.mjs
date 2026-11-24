// A light check of one rendered SVG for what a student would see cut off: a label or a drawn shape that lies (partly) outside the figure's frame (its viewBox).
// The engine's own observers already refuse most cut-offs and the gate counts that as REGRESSED; this check is the independent second look at a figure that WAS drawn
// (an observer that misses a label pushed out of the frame, a shape that wandered off). It reads the SVG text only (no browser, no engine code) and answers with signatures
// ("label A-name", "line#2"); the gate fails only on a signature the head has and the base does not, so a figure that was always flush with its frame never fails.
//
// What it measures, conservatively (anything it cannot place exactly it leaves out):
//   - a nested <svg width height> (the engine's label outlines): its box from the translate() of the groups around it
//   - line, circle, rect, polygon, polyline, and a path made only of absolute M/L/H/V/Z, inside groups that carry no transform or a plain translate()
//   - nothing inside defs, clipPath, mask, marker, pattern, symbol, or inside a group with another kind of transform (scale, rotate, matrix)
export const CLIP_TOLERANCE = 1.5; // px beyond the frame that still counts as inside (rounding, a stroke touching the edge)
const MAX_SIGNATURES = 24;
const SKIP_TAGS = new Set(['defs', 'clippath', 'mask', 'marker', 'pattern', 'symbol', 'title', 'desc', 'style', 'script']);
const TAG = /<(\/?)([A-Za-z][\w:.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
const ATTR = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

const attrsOf = text => { const a = {}; for (const m of text.matchAll(ATTR)) a[m[1]] = m[2] ?? m[3]; return a; };
const nums = s => (String(s ?? '').match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };

// transform="translate(a b)" / "translate(a,b)" / "translate(a)" -> [dx, dy]; null when it is anything else
function translateOf(t) {
  if (t === undefined) return [0, 0];
  const m = String(t).trim().match(/^translate\(\s*(-?[\d.eE+-]+)(?:[\s,]+(-?[\d.eE+-]+))?\s*\)$/);
  if (!m) return null;
  const x = Number(m[1]), y = m[2] === undefined ? 0 : Number(m[2]);
  return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
}

// the points of a path made only of absolute M L H V Z; null for anything else (curves, arcs, relative commands)
function simplePathPoints(d) {
  if (!/^[\sMLHVZ\d.,eE+-]+$/.test(d)) return null;
  const pts = []; let x = 0, y = 0;
  for (const m of d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const n = nums(m[2]);
    if (m[1] === 'H') for (const v of n) { x = v; pts.push([x, y]); }
    else if (m[1] === 'V') for (const v of n) { y = v; pts.push([x, y]); }
    else if (m[1] === 'M' || m[1] === 'L') for (let i = 0; i + 1 < n.length; i += 2) { x = n[i]; y = n[i + 1]; pts.push([x, y]); }
  }
  return pts.length ? pts : null;
}

// -> [{box: [x0, y0, x1, y1], name, tag}] for the elements it can place, in document order
function boxesOf(svg) {
  const out = [];
  const stack = []; // {tag, dx, dy, skip, nested}
  let frame = null;
  for (const m of svg.matchAll(TAG)) {
    const closing = m[1] === '/', tag = m[2].toLowerCase(), body = m[3], selfClosed = /\/\s*$/.test(body);
    if (closing) { stack.pop(); continue; }
    const top = stack[stack.length - 1];
    const a = attrsOf(body);
    let state = {tag, dx: top?.dx ?? 0, dy: top?.dy ?? 0, skip: top?.skip || SKIP_TAGS.has(tag), nested: top?.nested ?? false, gid: tag === 'g' && a.id ? a.id : top?.gid};
    if (tag === 'svg' && !frame && !stack.length) {
      const vb = nums(a.viewBox);
      frame = vb.length === 4 ? vb : [0, 0, num(a.width), num(a.height)];
      if (!(frame[2] > 0 && frame[3] > 0)) return {frame: null, boxes: []};
    } else if (!state.skip) {
      if (tag === 'svg') { // a nested svg: the engine's label outline, placed by its parents' translate() and its own x/y
        if (a.width !== undefined && a.height !== undefined && !state.nested) {
          const x = state.dx + num(a.x), y = state.dy + num(a.y), w = num(a.width), h = num(a.height);
          if (w > 0 && h > 0) out.push({box: [x, y, x + w, y + h], name: `label ${state.gid ?? a.id ?? a['data-owner'] ?? ''}`.trim(), tag: 'svg'});
        }
        state.nested = true; // everything inside is in the label's own units
      } else if (!state.nested) {
        const t = translateOf(a.transform);
        if (t === null) state.skip = true; else { state.dx += t[0]; state.dy += t[1]; }
        if (!state.skip) {
          let box = null;
          if (tag === 'line') box = [Math.min(num(a.x1), num(a.x2)), Math.min(num(a.y1), num(a.y2)), Math.max(num(a.x1), num(a.x2)), Math.max(num(a.y1), num(a.y2))];
          else if (tag === 'circle') { const r = num(a.r); box = [num(a.cx) - r, num(a.cy) - r, num(a.cx) + r, num(a.cy) + r]; }
          else if (tag === 'rect' && a.width !== undefined && a.height !== undefined) box = [num(a.x), num(a.y), num(a.x) + num(a.width), num(a.y) + num(a.height)];
          else if (tag === 'polygon' || tag === 'polyline') { const n = nums(a.points), xs = [], ys = []; for (let i = 0; i + 1 < n.length; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); } if (xs.length) box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; }
          else if (tag === 'path' && a.d) { const p = simplePathPoints(a.d); if (p) box = [Math.min(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[0])), Math.max(...p.map(q => q[1]))]; }
          // a rect that is the figure's own white background covers the frame exactly: it is the frame, not content
          if (box && tag === 'rect' && a.width === String(frame?.[2]) && a.height === String(frame?.[3])) box = null;
          if (box) { box = [box[0] + state.dx, box[1] + state.dy, box[2] + state.dx, box[3] + state.dy]; if (box.every(Number.isFinite)) out.push({box, name: a.id ?? null, tag, role: a['data-role'] ?? null}); }
        }
      }
    }
    if (!selfClosed) stack.push(state);
  }
  return {frame, boxes: out};
}

// The signatures of the elements that stick out of the frame: stable names (an id, or the tag and role with a running count), so the base and the head can be compared.
export function clipSignatures(svgText, tolerance = CLIP_TOLERANCE) {
  let parsed;
  try { parsed = boxesOf(String(svgText)); } catch { return []; }
  const {frame, boxes} = parsed;
  if (!frame) return [];
  const [fx0, fy0, fw, fh] = frame, fx1 = fx0 + fw, fy1 = fy0 + fh;
  const counts = {}, sigs = [];
  for (const b of boxes) {
    const [x0, y0, x1, y1] = b.box;
    if (x0 >= fx0 - tolerance && y0 >= fy0 - tolerance && x1 <= fx1 + tolerance && y1 <= fy1 + tolerance) continue;
    let base = b.name || (b.role ? `${b.tag}(${b.role})` : b.tag);
    counts[base] = (counts[base] ?? 0) + 1;
    sigs.push(counts[base] > 1 ? `${base}#${counts[base]}` : base);
    if (sigs.length >= MAX_SIGNATURES) break;
  }
  return sigs;
}
