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
  const add = value => { if (typeof value === 'string' && value.trim()) refs.add(value.trim()); };
  function visit(value, imageField = false) {
    if (typeof value === 'string') {
      if (imageField) add(value);
      for (const match of value.matchAll(/<(?:img|image)\b[^>]*?\b(?:src|(?:xlink:)?href)\s*=\s*["']([^"']+)["']/gi)) add(match[1]);
      for (const match of value.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) add(match[1]);
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

