// Data loading and reference extraction only; no content or semantic verdicts.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const IMAGE_FIELDS = /^(?:image|imageRef|problemImage|problemImageRef|originalProblemImage|solutionImage|solutionImageRef)$/;

export function loadSource(root, source) {
  if (!/^archive\/exams\/original\/.+\.js$/.test(source) || source.split('/').includes('..')) throw new Error('original source path required');
  const bytes = fs.readFileSync(path.join(root, source));
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(bytes.toString('utf8'), context, { filename: source, timeout: 3000 });
  const questions = [context.window.questions, context.window.questionBank, context.window.questionBank?.questions,
    context.window.examData?.questions, context.questions, context.questionBank].find(Array.isArray);
  if (!questions?.length || questions.some(question => !question || typeof question !== 'object' || Array.isArray(question))) {
    throw new Error('source has no usable question array: ' + source);
  }
  return { questions, sourceSha256: sha256(bytes) };
}

export function questionAssetReferences(question) {
  const refs = new Set();
  const addFileReference = value => {
    const reference = typeof value === 'string' ? value.trim() : '';
    if (reference && !reference.startsWith('#')) refs.add(reference);
  };
  function verifyInlineSvgFragments(markup) {
    const source = markup.replace(/<!--[\s\S]*?-->/g, '');
    const tokenSource = source.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, block => ' '.repeat(block.length));
    const tokens = [...tokenSource.matchAll(/<\/?(?:[A-Za-z_][\w.-]*:)?svg(?=[\s/>])(?:[^>"']|"[^"]*"|'[^']*')*>/gi)];
    let depth = 0, start = -1;
    const check = fragment => {
      const clean = fragment.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
      const ids = new Set(), references = [];
      for (const tag of clean.matchAll(/<([A-Za-z_][\w:.-]*)\b((?:[^<>"']|"[^"]*"|'[^']*')*)>/g)) {
        const attrs = tag[2];
        const attributePattern = /\s*([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gy;
        let attr;
        while ((attr = attributePattern.exec(attrs))) {
          const name = attr[1], value = attr[2] ?? attr[3] ?? attr[4] ?? '';
          if (name === 'id') ids.add(value);
          if (/^(?:[\w.-]+:)?href$/i.test(name)) references.push(value);
        }
      }
      for (const url of fragment.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) references.push(url[1]);
      for (const reference of references) {
        if (reference.startsWith('#') && !ids.has(reference.slice(1))) throw new Error('missing inline SVG fragment ' + reference);
      }
    };
    for (const token of tokens) {
      const closing = /^<\//.test(token[0]);
      if (!closing && /\/\s*>$/.test(token[0])) {
        if (depth === 0) check(token[0]);
      } else if (!closing) { if (depth === 0) start = token.index; depth += 1; }
      else if (depth > 0 && --depth === 0) { check(source.slice(start, token.index + token[0].length)); start = -1; }
    }
  }
  function visit(value, imageField = false) {
    if (typeof value === 'string') {
      if (imageField) addFileReference(value);
      verifyInlineSvgFragments(value);
      for (const match of value.matchAll(/<(?:img|image)\b[^>]*?\b(?:src|(?:xlink:)?href)\s*=\s*["']([^"']+)["']/gi)) addFileReference(match[1]);
      for (const match of value.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) addFileReference(match[1]);
    } else if (Array.isArray(value)) value.forEach(item => visit(item, imageField));
    else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) visit(item, IMAGE_FIELDS.test(key) || (imageField && /^(?:assetRef|imageRef|path|src|url|value)$/.test(key)));
    }
  }
  visit(question);
  return [...refs];
}

export function localAssetPath(reference) {
  const raw = reference.trim().replace(/\\/g, '/');
  if (/^(?:data:|blob:|https?:\/\/|\/\/)/i.test(raw)) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(raw)) throw new Error('unsupported image reference scheme');
  let pathname;
  try { pathname = decodeURIComponent(raw.split(/[?#]/)[0]); } catch { throw new Error('malformed image reference encoding'); }
  if (pathname.split('/').includes('..') || pathname.includes('\0')) throw new Error('image reference escapes Archive');
  pathname = pathname.replace(/^(?:\.\/)+/, '').replace(/^\//, '');
  if (!pathname.startsWith('archive/')) pathname = 'archive/' + pathname;
  if (!pathname.startsWith('archive/assets/')) throw new Error('unsupported local image reference: ' + reference);
  return pathname;
}

