/* Source-preserving writer for the internal archive review editor. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.APReviewSourceWriter = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function (root) {
  'use strict';

  const BANK_PROPERTIES = new Set(['questions', 'problems']);
  const REVIEW_OVERRIDE_MARKER = '/* AP_REVIEW_SOURCE_OVERRIDE */';

  function isIdentifierStart(char) {
    return !!char && /[A-Za-z_$]/.test(char);
  }

  function isIdentifierPart(char) {
    return !!char && /[A-Za-z0-9_$]/.test(char);
  }

  function skipQuoted(source, start, quote) {
    let i = start + 1;
    while (i < source.length) {
      if (source[i] === '\\') { i += 2; continue; }
      if (source[i] === quote) return i + 1;
      i += 1;
    }
    throw new Error('SOURCE_WRITER_UNTERMINATED_STRING');
  }

  function skipTemplate(source, start) {
    let i = start + 1;
    while (i < source.length) {
      if (source[i] === '\\') { i += 2; continue; }
      if (source[i] === '`') return i + 1;
      i += 1;
    }
    throw new Error('SOURCE_WRITER_UNTERMINATED_TEMPLATE');
  }

  function skipComment(source, start) {
    if (source.startsWith('//', start)) {
      const end = source.indexOf('\n', start + 2);
      return end < 0 ? source.length : end;
    }
    if (source.startsWith('/*', start)) {
      const end = source.indexOf('*/', start + 2);
      if (end < 0) throw new Error('SOURCE_WRITER_UNTERMINATED_COMMENT');
      return end + 2;
    }
    return start;
  }

  function skipSpaceAndComments(source, start) {
    let i = start;
    while (i < source.length) {
      if (/\s/.test(source[i])) { i += 1; continue; }
      if (source.startsWith('//', i) || source.startsWith('/*', i)) {
        i = skipComment(source, i);
        continue;
      }
      break;
    }
    return i;
  }

  function nextToken(source, start) {
    let i = start;
    while (i < source.length) {
      if (/\s/.test(source[i])) { i += 1; continue; }
      if (source.startsWith('//', i) || source.startsWith('/*', i)) {
        i = skipComment(source, i);
        continue;
      }
      if (source[i] === '"' || source[i] === "'") {
        const end = skipQuoted(source, i, source[i]);
        return { kind: 'string', value: source.slice(i + 1, end - 1), start: i, end };
      }
      if (source[i] === '`') {
        const end = skipTemplate(source, i);
        return { kind: 'template', value: source.slice(i + 1, end - 1), start: i, end };
      }
      if (isIdentifierStart(source[i])) {
        const startIndex = i;
        i += 1;
        while (isIdentifierPart(source[i])) i += 1;
        return { kind: 'identifier', value: source.slice(startIndex, i), start: startIndex, end: i };
      }
      return { kind: 'punctuation', value: source[i], start: i, end: i + 1 };
    }
    return null;
  }

  function matchingDelimiter(source, start) {
    const opening = source[start];
    const closing = opening === '[' ? ']' : opening === '{' ? '}' : opening === '(' ? ')' : '';
    if (!closing) throw new Error('SOURCE_WRITER_EXPECTED_DELIMITER');
    const stack = [closing];
    let i = start + 1;
    while (i < source.length) {
      if (source[i] === '"' || source[i] === "'") { i = skipQuoted(source, i, source[i]); continue; }
      if (source[i] === '`') { i = skipTemplate(source, i); continue; }
      if (source.startsWith('//', i) || source.startsWith('/*', i)) { i = skipComment(source, i); continue; }
      if (source[i] === '[' || source[i] === '{' || source[i] === '(') {
        stack.push(source[i] === '[' ? ']' : source[i] === '{' ? '}' : ')');
        i += 1;
        continue;
      }
      if (source[i] === ']' || source[i] === '}' || source[i] === ')') {
        if (source[i] !== stack[stack.length - 1]) throw new Error('SOURCE_WRITER_UNBALANCED_DELIMITER');
        stack.pop();
        if (stack.length === 0) return i + 1;
      }
      i += 1;
    }
    throw new Error('SOURCE_WRITER_UNTERMINATED_EXPRESSION');
  }

  function findObjectBankMemberRange(source, objectStart, objectEnd) {
    let i = objectStart + 1;
    let depth = 0;
    while (i < objectEnd - 1) {
      if (source[i] === '"' || source[i] === "'") { i = skipQuoted(source, i, source[i]); continue; }
      if (source[i] === '`') { i = skipTemplate(source, i); continue; }
      if (source.startsWith('//', i) || source.startsWith('/*', i)) { i = skipComment(source, i); continue; }
      if (source[i] === '{' || source[i] === '[' || source[i] === '(') { depth += 1; i += 1; continue; }
      if (source[i] === '}' || source[i] === ']' || source[i] === ')') { depth -= 1; i += 1; continue; }
      if (depth !== 0) { i += 1; continue; }

      const token = nextToken(source, i);
      if (!token) break;
      if (token.kind === 'identifier' && BANK_PROPERTIES.has(token.value)) {
        const colon = skipSpaceAndComments(source, token.end);
        if (source[colon] === ':') {
          const valueStart = skipSpaceAndComments(source, colon + 1);
          if (source[valueStart] === '[') {
            return { start: valueStart, end: matchingDelimiter(source, valueStart), shape: token.value };
          }
          throw new Error('SOURCE_WRITER_UNSUPPORTED_SHAPE');
        }
      }
      i = Math.max(token.end, i + 1);
    }
    return null;
  }

  function findQuestionBankRange(source) {
    let i = 0;
    while (i < source.length) {
      if (source[i] === '"' || source[i] === "'") { i = skipQuoted(source, i, source[i]); continue; }
      if (source[i] === '`') { i = skipTemplate(source, i); continue; }
      if (source.startsWith('//', i) || source.startsWith('/*', i)) { i = skipComment(source, i); continue; }

      const token = nextToken(source, i);
      if (!token) break;
      i = token.end;
      if (token.kind !== 'identifier' || token.value !== 'questionBank') continue;

      let cursor = skipSpaceAndComments(source, token.end);
      let property = '';
      if (source[cursor] === '.') {
        const member = nextToken(source, cursor + 1);
        if (!member || member.kind !== 'identifier') continue;
        property = member.value;
        cursor = skipSpaceAndComments(source, member.end);
      }
      if (source[cursor] !== '=') continue;
      if (source[cursor + 1] === '=' || source[cursor + 1] === '>') continue;

      const valueStart = skipSpaceAndComments(source, cursor + 1);
      if (property && BANK_PROPERTIES.has(property)) {
        if (source[valueStart] !== '[') throw new Error('SOURCE_WRITER_UNSUPPORTED_SHAPE');
        return { start: valueStart, end: matchingDelimiter(source, valueStart), shape: property };
      }
      if (source[valueStart] === '[') {
        return { start: valueStart, end: matchingDelimiter(source, valueStart), shape: 'array' };
      }
      if (source[valueStart] === '{') {
        const objectEnd = matchingDelimiter(source, valueStart);
        const memberRange = findObjectBankMemberRange(source, valueStart, objectEnd);
        if (memberRange) return memberRange;
        throw new Error('SOURCE_WRITER_UNSUPPORTED_SHAPE');
      }
      throw new Error('SOURCE_WRITER_UNSUPPORTED_SHAPE');
    }
    throw new Error('SOURCE_WRITER_QUESTION_BANK_ASSIGNMENT_NOT_FOUND');
  }

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function parseArchiveSource(source, fileName) {
    if (typeof source !== 'string') throw new TypeError('SOURCE_WRITER_SOURCE_MUST_BE_STRING');
    const sandbox = { window: {} };
    const fn = new Function('window', source);
    fn(sandbox.window);
    const raw = sandbox.window.questionBank;
    let bank;
    let bankShape;
    if (Array.isArray(raw)) {
      bank = raw;
      bankShape = 'array';
    } else if (raw && Array.isArray(raw.questions)) {
      bank = raw.questions;
      bankShape = 'questions';
    } else if (raw && Array.isArray(raw.problems)) {
      bank = raw.problems;
      bankShape = 'problems';
    } else {
      throw new Error('SOURCE_WRITER_QUESTION_BANK_NOT_ARRAY');
    }
    const fallback = String(fileName || 'archive.js').replace(/\.js$/i, '');
    return {
      title: sandbox.window.examTitle || sandbox.window.title || fallback,
      displayTitle: sandbox.window.examDisplayTitle || sandbox.window.examTitle || sandbox.window.title || fallback,
      bank: clone(bank),
      bankShape,
    };
  }

  function ensureSerializable(value) {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error('SOURCE_WRITER_UNSERIALIZABLE_BANK');
    return encoded;
  }

  function serializeQuestionBankLiteral(bank) {
    if (!Array.isArray(bank)) throw new TypeError('SOURCE_WRITER_BANK_MUST_BE_ARRAY');
    return ensureSerializable(bank);
  }

  function replaceQuestionBankPreservingSource(source, bank) {
    if (typeof source !== 'string') throw new TypeError('SOURCE_WRITER_SOURCE_MUST_BE_STRING');
    const literal = serializeQuestionBankLiteral(bank);
    const markerStart = source.lastIndexOf(REVIEW_OVERRIDE_MARKER);
    if (markerStart >= 0) {
      try {
        const markedSource = source.slice(markerStart);
        const markedRange = findQuestionBankRange(markedSource);
        const start = markerStart + markedRange.start;
        const end = markerStart + markedRange.end;
        return source.slice(0, start) + literal + source.slice(end);
      } catch (_) {
        // A manually edited marker is not trusted; fall through to the
        // ordinary structural scan and fail closed if that is unsupported.
      }
    }
    const range = findQuestionBankRange(source);
    const rewritten = source.slice(0, range.start) + literal + source.slice(range.end);
    try {
      const parsed = parseArchiveSource(rewritten, 'review.js');
      if (JSON.stringify(canonicalize(parsed.bank)) === JSON.stringify(canonicalize(bank))) return rewritten;
    } catch (_) {
      // The source was already parsed before editing. A post-bank helper may
      // reject the replacement; append only the final bank assignment below.
    }
    // Some legacy banks run solution/figure helpers after the array literal.
    // Keep those declarations and side effects intact, then override only the
    // final questionBank value so the edited semantic snapshot is authoritative.
    return rewritten + `\n${REVIEW_OVERRIDE_MARKER}\nwindow.questionBank = ${literal};\n`;
  }

  function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
    }
    return value;
  }

  function validateRoundTrip(source, expectedBank, fileName) {
    const parsed = parseArchiveSource(source, fileName);
    if (JSON.stringify(canonicalize(parsed.bank)) !== JSON.stringify(canonicalize(expectedBank))) {
      throw new Error('ROUND_TRIP_SEMANTIC_MISMATCH');
    }
    return parsed;
  }

  async function fingerprintText(source) {
    if (typeof source !== 'string') throw new TypeError('SOURCE_WRITER_SOURCE_MUST_BE_STRING');
    const cryptoApi = root?.crypto || (typeof globalThis !== 'undefined' ? globalThis.crypto : null);
    if (!cryptoApi?.subtle) throw new Error('SOURCE_WRITER_CRYPTO_UNAVAILABLE');
    const bytes = new TextEncoder().encode(source);
    const digest = await cryptoApi.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  return Object.freeze({
    fingerprintText,
    parseArchiveSource,
    replaceQuestionBankPreservingSource,
    serializeQuestionBankLiteral,
    validateRoundTrip,
  });
}));
