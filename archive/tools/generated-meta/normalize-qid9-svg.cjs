'use strict';

function getAttribute(tag, name) {
  const match = tag.match(new RegExp('\\\\b' + name + '\\\\s*=\\\\s*(["\\\\'])(.*?)\\\\1', 'i'));
  return match ? match[2] : '';
}

function setAttribute(tag, name, value) {
  const pattern = new RegExp('\\\\s+' + name + '\\\\s*=\\\\s*(?:"[^"]*"|\\\\'[^\\\\']*\\\\'|[^\\\\s>]+)', 'ig');
  const clean = tag.replace(pattern, '');
  return clean.replace(/>$/, ' ' + name + '="' + value + '">');
}

function normalizeQid9Svg(input, uid) {
  let svg = String(input ?? '');
  const safeUid = String(uid ?? '').replace(/[^A-Za-z0-9_-]/g, '-');
  if (!safeUid) throw new Error('QID9_SVG_UID_REQUIRED');

  const rootMatch = svg.match(/<(?:[A-Za-z_][\\w.-]*:)?svg\\b[^>]*>/i);
  const titleMatches = [...svg.matchAll(/<(?:[A-Za-z_][\\w.-]*:)?title\\b[^>]*>/gi)];
  const descMatches = [...svg.matchAll(/<(?:[A-Za-z_][\\w.-]*:)?desc\\b[^>]*>/gi)];
  if (!rootMatch || titleMatches.length !== 1 || descMatches.length !== 1) {
    throw new Error('QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED:' + safeUid);
  }

  const allIds = [...svg.matchAll(/\\bid\\s*=\\s*(["'])(.*?)\\1/gi)].map(match => match[2]);
  const counts = new Map();
  for (const id of allIds) counts.set(id, (counts.get(id) || 0) + 1);
  const used = new Set(allIds);
  const titleCurrent = getAttribute(titleMatches[0][0], 'id');
  const descCurrent = getAttribute(descMatches[0][0], 'id');
  const validUnique = id => /^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(id || '') && counts.get(id) === 1;
  let titleId = validUnique(titleCurrent) ? titleCurrent : '';
  let descId = validUnique(descCurrent) && descCurrent !== titleId ? descCurrent : '';

  const allocate = kind => {
    const base = 'qid9-' + safeUid + '-' + kind;
    let candidate = base, suffix = 2;
    while (used.has(candidate)) candidate = base + '-' + suffix++;
    used.add(candidate);
    return candidate;
  };
  if (!titleId) titleId = allocate('title');
  if (!descId) descId = allocate('desc');

  const oldTitle = titleMatches[0][0], oldDesc = descMatches[0][0], oldRoot = rootMatch[0];
  const newTitle = setAttribute(oldTitle, 'id', titleId);
  const newDesc = setAttribute(oldDesc, 'id', descId);
  const newRoot = setAttribute(
    setAttribute(
      setAttribute(oldRoot, 'role', 'img'),
      'aria-labelledby',
      titleId + ' ' + descId
    ),
    'aria-describedby',
    ''
  ).replace(/\\s+aria-describedby=""/, '');
  svg = svg.replace(oldTitle, newTitle).replace(oldDesc, newDesc).replace(oldRoot, newRoot);
  return svg;
}

module.exports = normalizeQid9Svg;
