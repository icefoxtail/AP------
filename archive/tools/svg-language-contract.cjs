const ALLOWED_MATH_WORDS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'lim', 'max', 'min', 'sqrt', 'pi',
  'theta', 'alpha', 'beta', 'gamma', 'delta', 'omega',
  'xy', 'xz', 'yz',
  'mm', 'cm', 'km', 'm', 'kg', 'g', 'ha'
]);
const INTERNAL_TERMS = new Set(['svg', 'apmath', 'source', 'bound', 'sourcebound', 'debug', 'generator', 'renderer', 'candidate', 'provenance']);
const COMPOUND_VARIABLE_PRODUCTS = new Set(['ab', 'uv', 'nm']);
const MIXED_CASE_POINT_LABELS = new Set(['Apr', 'Bpr', 'Cp', 'Tx', 'Ty']);
const TEX_MATH_COMMANDS = new Set(['dfrac', 'frac', 'tfrac', 'overline', 'rightarrow', 'leftarrow', 'angle', 'perp', 'ne', 'neq', 'le', 'ge', 'left', 'right', 'cdot', 'times', 'sqrt', 'int']);
const MEANINGFUL_DESCRIPTION_MARKERS = [
  '관계', '위치', '조건', '교점', '접점', '중심', '반지름', '접선', '수직', '평행', '변', '각', '넓이', '길이',
  '그래프', '표', '구간', '영역', '대칭', '이동', '원', '점', '선분', '직선', '곡선', '변화', '분포', '확률',
  '값', '풀이', '단계', '수량', '거리', '최댓값', '최솟값', '선택지', '참', '거짓', '겉면', '곡면', '도형의', '함수',
  '비교', '보여', '도식', '다이어그램', '벤', '내분', '사분면', '볼록', '인수', '약분', '여집합', '포함', '집합', '합집합', '교집합', '수직선', '대응'
];

function hasSubstantiveKoreanMathReasoning(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!/[.!?。！？]$/.test(text) || !/(?:이므로|따라서|에서|에 따라|에 의해|이면|이며|만족하는|일 때|인 경우)/.test(text)) return false;
  const relationCount = (text.match(/[=≠≤≥<>∥∼≅:→]/g) || []).length;
  return relationCount >= 2 && /[A-Za-z]/.test(text) && /\d/.test(text) && /[가-힣]/.test(text);
}

function isGenericScaffoldDescription(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return /^(?:(?:문항|도형)(?:의)?\s*)?(?:(?:핵심|주요)\s*)?(?:관계|내용)(?:을|를)\s*(?:표시한|나타낸|보여\s*주는)\s*(?:(?:해설)\s*)?(?:그림|도형|그래프)$/.test(text);
}

function isMathIdentifier(token, text, index) {
  const lower = token.toLowerCase();
  const before = text[index - 1] || '';
  const after = text[index + token.length] || '';
  const nearby = text.slice(Math.max(0, index - 3), Math.min(text.length, index + token.length + 3));
  const compactMath = /^[A-Za-z]{2,4}$/.test(token)
    && ((before && '0123456789=+-*/^_([{≤≥±−×÷⋅·'.includes(before)) || (after && '0123456789₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹=+-*/^_)}]≤≥±−×÷⋅·(′’\''.includes(after)));
  const mixedCaseMathLabel = MIXED_CASE_POINT_LABELS.has(token)
    || /^[A-Z]{1,2}(?:min|max)$/.test(token)
    || /^[xy][A-Z]{1,3}$/.test(token);
  const inlineEquationIdentifier = /^[a-z]{2,3}$/.test(token)
    && /[=+*/^_≤≥±−×÷⋅·]/.test(nearby);
  const integralMarker = lower === 'int'
    && /[0-9₀-₉ₐ-ₜ⁰-⁹[(]/.test(after)
    && /[=+]/.test(text.slice(Math.max(0, index - 3), index));
  const differential = ['dx', 'dt'].includes(lower) && /(?:∫|\bint)/i.test(text);
  return ALLOWED_MATH_WORDS.has(lower)
    || token.length === 1
    || /^[A-Z]{2,4}$/.test(token)
    || COMPOUND_VARIABLE_PRODUCTS.has(lower)
    || mixedCaseMathLabel
    || inlineEquationIdentifier
    || compactMath
    || integralMarker
    || differential;
}

function decodeXml(value) {
  return String(value).replace(/<[^>]*>/g, '').replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos);/gi, (entity, body) => {
    const lower = body.toLowerCase();
    if (lower === 'amp') return '&';
    if (lower === 'lt') return '<';
    if (lower === 'gt') return '>';
    if (lower === 'quot') return '"';
    if (lower === 'apos') return "'";
    const codePoint = lower.startsWith('#x') ? Number.parseInt(lower.slice(2), 16) : Number.parseInt(lower.slice(1), 10);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return entity;
    return String.fromCodePoint(codePoint);
  }).replace(/\\n(?=[A-Z(])/g, ' ').replace(/\s+/g, ' ').trim();
}

function attributes(tag) {
  const found = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)) found[match[1].toLowerCase()] = decodeXml(match[3]);
  return found;
}

function inspectText(value, surface, assetRef, errors) {
  const text = decodeXml(value);
  if (!text) return text;
  if (/축척|\bscale(?:d|s|ing)?\b/i.test(text)) {
    errors.push({ code: 'SVG_SCALE_GUIDANCE_FORBIDDEN', assetRef, surface, text });
  }
  for (const match of text.matchAll(/[A-Za-z]+/g)) {
    const token = match[0];
    const lower = token.toLowerCase();
    if (INTERNAL_TERMS.has(lower)) {
      errors.push({ code: 'SVG_INTERNAL_STUDENT_TEXT_FORBIDDEN', assetRef, surface, token, text });
      continue;
    }
    if (text[match.index - 1] === '\\' && TEX_MATH_COMMANDS.has(lower)) {
      errors.push({ code: 'SVG_MATH_MARKUP_ACCESSIBILITY_REQUIRES_REVIEW', assetRef, surface, token, text });
      continue;
    }
    if (['dx', 'dt'].includes(lower)) {
      const before = text[match.index - 1] || '';
      const after = text[match.index + token.length] || '';
      const boundedDifferential = /^d[xt][[(]/.test(text.slice(match.index, match.index + 4));
      if (/(?:∫|\\int|\bint)/i.test(text) || before && ')]}|0123456789'.includes(before) && after && ' ,.;:)]}[가를은는이에'.includes(after) || boundedDifferential) continue;
    }
    if (isMathIdentifier(token, text, match.index)) continue;
    errors.push({ code: 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW', assetRef, surface, token, text });
  }
  return text;
}

function validateSvgStudentLanguage(svg, options = {}) {
  const assetRef = options.assetRef || '<memory>';
  const source = String(svg ?? '');
  const errors = [];
  const rootMatch = source.match(/<(?:(?<prefix>[a-z_][\w.-]*):)?svg\b[^>]*>/i);
  if (!rootMatch) return { status: 'FAIL', errors: [{ code: 'SVG_ROOT_MISSING', assetRef }] };
  const root = attributes(rootMatch[0]);
  const tagPrefix = rootMatch.groups?.prefix ? rootMatch.groups.prefix + ':' : '';
  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const ids = [...source.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)].map(match => decodeXml(match[2]));
  const idCounts = new Map();
  for (const id of ids) idCounts.set(id, (idCounts.get(id) || 0) + 1);
  if ([...idCounts.values()].some(count => count > 1)) errors.push({ code: 'SVG_ACCESSIBILITY_DUPLICATE_ID', assetRef });
  const titlePattern = new RegExp('<' + escapeRegExp(tagPrefix) + 'title\\b([^>]*)>([\\s\\S]*?)<\\/' + escapeRegExp(tagPrefix) + 'title\\s*>', 'gi');
  const descriptionPattern = new RegExp('<' + escapeRegExp(tagPrefix) + 'desc\\b([^>]*)>([\\s\\S]*?)<\\/' + escapeRegExp(tagPrefix) + 'desc\\s*>', 'gi');
  const titles = [...source.matchAll(titlePattern)].map(match => ({ attrs: attributes(match[1]), text: decodeXml(match[2]) }));
  const descriptions = [...source.matchAll(descriptionPattern)].map(match => ({ attrs: attributes(match[1]), text: decodeXml(match[2]) }));

  if (root.role !== 'img') errors.push({ code: 'SVG_ACCESSIBILITY_ROLE_IMG_REQUIRED', assetRef });
  if (titles.length !== 1 || descriptions.length !== 1) {
    errors.push({ code: 'SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED', assetRef, titleCount: titles.length, descriptionCount: descriptions.length });
  }
  if (titles.length === 1 && descriptions.length === 1) {
    const title = titles[0];
    const description = descriptions[0];
    const titleId = title.attrs.id;
    const descriptionId = description.attrs.id;
    if (!titleId || !descriptionId || titleId === descriptionId || idCounts.get(titleId) !== 1 || idCounts.get(descriptionId) !== 1) {
      errors.push({ code: 'SVG_ACCESSIBILITY_TITLE_DESC_ID_INVALID', assetRef, titleId: titleId || '', descriptionId: descriptionId || '' });
    }
    const refs = (root['aria-labelledby'] || '').split(/\s+/).filter(Boolean);
    const describedBy = (root['aria-describedby'] || '').split(/\s+/).filter(Boolean);
    const titleBound = refs.includes(titleId);
    const descriptionBound = refs.includes(descriptionId) || describedBy.includes(descriptionId);
    if (!titleBound || !descriptionBound || new Set(refs).size !== refs.length || new Set(describedBy).size !== describedBy.length || refs.concat(describedBy).some(id => idCounts.get(id) !== 1)) {
      errors.push({ code: 'SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID', assetRef, refs, titleId: titleId || '', descriptionId: descriptionId || '' });
    }
    for (const [surface, value, minimumKorean] of [['title', title.text, 2], ['desc', description.text, 8]]) {
      const koreanCount = (value.match(/[가-힣]/g) || []).length;
      if (koreanCount < minimumKorean) errors.push({ code: 'SVG_ACCESSIBILITY_KOREAN_MEANING_REQUIRED', assetRef, surface, text: value, koreanCount });
      inspectText(value, surface, assetRef, errors);
    }
    const normalizedDescription = description.text.replace(/\s+/g, ' ').trim();
    if (isGenericScaffoldDescription(normalizedDescription)
        || (!MEANINGFUL_DESCRIPTION_MARKERS.some(marker => normalizedDescription.includes(marker))
          && !hasSubstantiveKoreanMathReasoning(normalizedDescription))) {
      errors.push({ code: 'SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE', assetRef, surface: 'desc', title: title.text, text: normalizedDescription });
    }
  }

  for (const match of source.matchAll(/<(?:[a-z_][\w.-]*:)?text\b([^>]*)>([\s\S]*?)<\/(?:[a-z_][\w.-]*:)?text\s*>/gi)) {
    const attrs = attributes(match[1]);
    inspectText(match[2], attrs.id ? `text#${attrs.id}` : 'text', assetRef, errors);
  }
  if (root['aria-label']) inspectText(root['aria-label'], 'aria-label', assetRef, errors);
  for (const match of source.matchAll(/\baria-label\s*=\s*(["'])(.*?)\1/gi)) {
    if (match[2] !== root['aria-label']) inspectText(match[2], 'aria-label', assetRef, errors);
  }
  for (const match of source.matchAll(/\btitle\s*=\s*(["'])(.*?)\1/gi)) inspectText(match[2], 'title-attribute', assetRef, errors);
  for (const match of source.matchAll(/\baria-(?:labelledby|describedby)\s*=\s*(["'])(.*?)\1/gi)) {
    const refs = decodeXml(match[2]).split(/\s+/).filter(Boolean);
    if (new Set(refs).size !== refs.length || refs.some(id => idCounts.get(id) !== 1)) {
      errors.push({ code: 'SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID', assetRef, refs });
    }
  }

  return { status: errors.length ? 'FAIL' : 'PASS', assetRef, errors };
}

function assertSvgStudentLanguage(svg, options = {}) {
  const result = validateSvgStudentLanguage(svg, options);
  if (result.status !== 'PASS') {
    const details = result.errors.map(error => `${error.code}${error.token ? `:${error.token}` : ''}${error.surface ? `@${error.surface}` : ''}`).join(',');
    throw new Error(`SVG_STUDENT_LANGUAGE_CONTRACT_FAIL:${options.assetRef || '<memory>'}:${details}`);
  }
  return result;
}

module.exports = { validateSvgStudentLanguage, assertSvgStudentLanguage };
