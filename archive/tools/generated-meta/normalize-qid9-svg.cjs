'use strict';

function getAttribute(tag, name) {
  const match = tag.match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function setAttribute(tag, name, value) {
  const pattern = new RegExp("\\s+" + name + "\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s>]+)", "ig");
  const clean = tag.replace(pattern, '');
  return clean.replace(/>$/, ' ' + name + '="' + value + '">');
}

function removeAttribute(tag, name) {
  const pattern = new RegExp("\\s+" + name + "\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s>]+)", "ig");
  return tag.replace(pattern, '');
}

const SCALE_GUIDANCE = /축척|\\bscale(?:d|s|ing)?\\b/i;

function removeScaleGuidanceSentences(value) {
  const text = String(value ?? '');
  const sentences = [];
  let start = 0;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (!/[.!?。！？]/.test(character)) continue;
    if (character === '.' && /\\d/.test(text[index - 1] || '') && /\\d/.test(text[index + 1] || '')) continue;
    if (character === '.' && text[index + 1] && !/\\s/.test(text[index + 1])) continue;
    sentences.push(text.slice(start, index + 1));
    start = index + 1;
  }
  if (start < text.length) sentences.push(text.slice(start));
  return sentences.filter(sentence => !SCALE_GUIDANCE.test(sentence)).join('').replace(/\\s+/g, ' ').trim();
}

function escapeXmlText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeQid9Svg(input, uid, labels = {}) {
  let svg = String(input ?? '');
  const safeUid = String(uid ?? '').replace(/[^A-Za-z0-9_-]/g, '-');
  if (!safeUid) throw new Error('QID9_SVG_UID_REQUIRED');

  let rootMatch = svg.match(/<(?:[A-Za-z_][\w.-]*:)?svg\b[^>]*>/i);
  const titleCount = [...svg.matchAll(/<(?:[A-Za-z_][\w.-]*:)?title\b/gi)].length;
  const descCount = [...svg.matchAll(/<(?:[A-Za-z_][\w.-]*:)?desc\b/gi)].length;
  if (!rootMatch || titleCount > 1 || descCount > 1) {
    throw new Error('QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED:' + safeUid);
  }

  const titleText = String(labels.title ?? '').trim();
  const descriptionText = String(labels.description ?? '').trim();
  const safeDescriptionText = removeScaleGuidanceSentences(descriptionText);
  if ((titleCount === 0 && !titleText) || (descCount === 0 && !safeDescriptionText)) {
    throw new Error('QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED:' + safeUid);
  }

  const additions = [];
  if (titleCount === 0) additions.push('<title>' + escapeXmlText(titleText) + '</title>');
  if (descCount === 0) additions.push('<desc>' + escapeXmlText(safeDescriptionText) + '</desc>');
  if (additions.length) {
    const rootEnd = rootMatch.index + rootMatch[0].length;
    svg = svg.slice(0, rootEnd) + additions.join('') + svg.slice(rootEnd);
  }

  rootMatch = svg.match(/<(?:[A-Za-z_][\w.-]*:)?svg\b[^>]*>/i);
  const titleMatches = [...svg.matchAll(/<(?:[A-Za-z_][\w.-]*:)?title\b[^>]*>/gi)];
  const descMatches = [...svg.matchAll(/<(?:[A-Za-z_][\w.-]*:)?desc\b[^>]*>/gi)];
  const allIds = [...svg.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2]);
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

  const descElementMatches = [...svg.matchAll(/<(?:[A-Za-z_][\\w.-]*:)?desc\\b[^>]*>[\\s\\S]*?<\\/(?:[A-Za-z_][\\w.-]*:)?desc\\s*>/gi)];
  if (descElementMatches.length !== 1) throw new Error('QID9_SVG_ACCESSIBILITY_DESCRIPTION_SCALE_GUIDANCE_UNRESOLVED:' + safeUid);
  const oldTitle = titleMatches[0][0], oldDesc = descElementMatches[0][0], oldRoot = rootMatch[0];
  const descOpen = oldDesc.match(/^<(?:[A-Za-z_][\\w.-]*:)?desc\\b[^>]*>/i)[0];
  const descClose = oldDesc.match(/<\\/(?:[A-Za-z_][\\w.-]*:)?desc\\s*>$/i)[0];
  const originalDescription = oldDesc.slice(descOpen.length, oldDesc.length - descClose.length);
  let normalizedDescription = originalDescription;
  if (SCALE_GUIDANCE.test(originalDescription)) {
    normalizedDescription = removeScaleGuidanceSentences(originalDescription);
    if (!normalizedDescription) normalizedDescription = safeDescriptionText;
    if (!normalizedDescription) throw new Error('QID9_SVG_ACCESSIBILITY_DESCRIPTION_SCALE_GUIDANCE_UNRESOLVED:' + safeUid);
  }
  const newTitle = setAttribute(titleMatches[0][0], 'id', titleId);
  const newDesc = setAttribute(descOpen, 'id', descId) + normalizedDescription + descClose;
  const newRoot = removeAttribute(
    removeAttribute(
      setAttribute(
        setAttribute(oldRoot, 'role', 'img'),
        'aria-labelledby',
        titleId + ' ' + descId
      ),
      'aria-label'
    ),
    'aria-describedby'
  );
  return svg.replace(oldTitle, newTitle).replace(oldDesc, newDesc).replace(oldRoot, newRoot);
}

module.exports = normalizeQid9Svg;
