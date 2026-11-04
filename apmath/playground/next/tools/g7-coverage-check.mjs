#!/usr/bin/env node
// Structural checks only. A passing result is not a mathematical or browser verdict.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const statuses = new Set(['covered', 'diagram_upgrade', 'solution_upgrade', 'new_scene', 'evidence_debt']);
const difficulties = new Set(['basic', 'standard', 'advanced']);
const priorities = new Set(['P0', 'P1', 'P2']);
const errors = [];
const stats = { units: 0, rows: 0, uniqueSourceQuestions: 0, sceneReferences: 0, sharedQuestions: 0, statuses: {} };
const fail = (message) => errors.push(message);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const array = (value, label, nonempty = false) => {
  if (!Array.isArray(value) || (nonempty && value.length === 0)) {
    fail(`${label}: expected ${nonempty ? 'nonempty ' : ''}array`);
    return [];
  }
  return value;
};
const json = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
// Section names differ between units; numeric questions use their terminal number.
// Named examples retain their complete label. Subquestion suffixes are preserved.
const question = (id) => {
  if (!text(id)) return '';
  const normalized = id.normalize('NFKC').trim().replace(/\s+/g, ' ');
  const number = normalized.match(/(?:^|\s|Q)(\d+(?:-\d+)*)$/i)?.[1];
  return number ? number.split('-').map((part) => String(Number(part))).join('-') : normalized;
};
const sourceKey = (row) => `${row.book}|${row.pdfPage}|${question(row.questionId)}`;

function main() {
  let sceneFile;
  let indexFile = path.join(root, 'docs/guides/g7-exam-coverage/index.json');
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') {
      console.log('Usage: node apmath/playground/next/tools/g7-coverage-check.mjs --scene-index <Chrome scene-index.json> [--index <index.json>]');
      return;
    }
    if (['--scene-index', '--index'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--')) {
      if (args[i] === '--scene-index') sceneFile = path.resolve(args[++i]);
      else indexFile = path.resolve(args[++i]);
    } else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
  }
  if (!sceneFile || !existsSync(sceneFile)) throw new Error('Actual Chrome scene index is required: --scene-index <existing file>. Scene validation NOT_RUN.');
  const index = json(indexFile);
  const sceneIndex = json(sceneFile);
  if (!object(index) || index.schemaVersion !== 1) throw new Error('Invalid coverage index/schemaVersion');
  if (!object(sceneIndex) || !Object.keys(sceneIndex).length) throw new Error('Scene index must be a nonempty object: { labId: [{ id, title }] }');
  const scenes = new Map();
  for (const [lab, entries] of Object.entries(sceneIndex)) {
    const ids = new Set();
    if (!/^[a-z0-9-]+$/.test(lab)) fail(`scene-index: invalid lab ${lab}`);
    for (const entry of array(entries, `scene-index.${lab}`, true)) {
      if (!object(entry) || !text(entry.id) || !text(entry.title)) { fail(`scene-index.${lab}: invalid scene entry`); continue; }
      if (ids.has(entry.id)) fail(`scene-index.${lab}: duplicate scene ${entry.id}`);
      ids.add(entry.id);
    }
    scenes.set(lab, ids);
    if (!existsSync(path.join(root, 'apmath/playground/next/labs', `${lab}.html`))) fail(`scene-index: missing lab HTML ${lab}`);
  }
  const sources = new Map();
  const driveIds = new Set();
  for (const source of array(index.sources, 'index.sources', true)) {
    if (!object(source) || !text(source.book) || !text(source.driveId) || !Number.isInteger(source.pdfPageCount) || source.pdfPageCount < 1) { fail('index.sources: invalid source'); continue; }
    if (sources.has(source.book) || driveIds.has(source.driveId)) fail(`index.sources: duplicate source ${source.book}`);
    if (source.url !== `https://drive.google.com/file/d/${source.driveId}/view`) fail(`index.sources: URL/source ID mismatch ${source.book}`);
    sources.set(source.book, source);
    driveIds.add(source.driveId);
  }
  const validPage = (book, page, label) => {
    const source = sources.get(book);
    if (!source) fail(`${label}: unknown source ${book}`);
    else if (!Number.isInteger(page) || page < 1 || page > source.pdfPageCount) fail(`${label}: PDF page out of range ${page}`);
  };
  const rowIds = new Set();
  const sourceRows = new Map();
  const units = new Set();
  const unitPaths = new Set();
  for (const entry of array(index.units, 'index.units', true)) {
    if (!object(entry) || !text(entry.unit) || !text(entry.path)) { fail('index.units: invalid unit entry'); continue; }
    if (units.has(entry.unit) || unitPaths.has(entry.path)) fail(`index.units: duplicate unit/path ${entry.unit}`);
    units.add(entry.unit);
    unitPaths.add(entry.path);
    const file = path.resolve(root, entry.path);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !file.endsWith('.json')) { fail(`index.units: invalid repository path ${entry.path}`); continue; }
    const data = json(file);
    stats.units++;
    if (!object(data) || data.unit !== entry.unit) { fail(`${entry.path}: unit mismatch`); continue; }
    const declaredSources = new Set();
    for (const source of array(data.sources, `${entry.unit}.sources`, true)) {
      if (!object(source)) { fail(`${entry.unit}.sources: invalid source`); continue; }
      const authority = sources.get(source.book);
      if (!authority || source.driveId !== authority.driveId || source.url !== authority.url) fail(`${entry.unit}: source ID/URL mismatch ${source.book}`);
      if (declaredSources.has(source.book)) fail(`${entry.unit}: duplicate source ${source.book}`);
      declaredSources.add(source.book);
    }
    const reviewed = new Map();
    for (const range of array(data.reviewedPdfPages, `${entry.unit}.reviewedPdfPages`, true)) {
      if (!object(range)) { fail(`${entry.unit}: invalid reviewed range`); continue; }
      if (reviewed.has(range.book)) fail(`${entry.unit}: duplicate reviewed source ${range.book}`);
      if (!declaredSources.has(range.book)) fail(`${entry.unit}: reviewed source not declared ${range.book}`);
      const pages = array(range.pages, `${entry.unit}.reviewedPdfPages.${range.book}`, true);
      const seen = new Set();
      for (const page of pages) {
        validPage(range.book, page, `${entry.unit}.reviewedPdfPages`);
        if (seen.has(page)) fail(`${entry.unit}: duplicate reviewed page ${range.book}/${page}`);
        seen.add(page);
      }
      reviewed.set(range.book, seen);
    }
    const unreviewedBooks = new Set();
    for (const range of array(data.unreviewedRanges, `${entry.unit}.unreviewedRanges`)) {
      if (!object(range) || !text(range.pages) || !text(range.reason)) { fail(`${entry.unit}: unreviewed range requires book/pages string/reason`); continue; }
      if (!sources.has(range.book)) fail(`${entry.unit}: unknown unreviewed source ${range.book}`);
      if (unreviewedBooks.has(range.book)) fail(`${entry.unit}: duplicate unreviewed source ${range.book}`);
      unreviewedBooks.add(range.book);
      for (const token of range.pages.split(',')) {
        const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
        if (!match) { fail(`${entry.unit}: invalid unreviewed range ${token}`); continue; }
        const from = Number(match[1]);
        const to = Number(match[2] ?? match[1]);
        validPage(range.book, from, `${entry.unit}.unreviewedRanges`);
        validPage(range.book, to, `${entry.unit}.unreviewedRanges`);
        if (from > to) fail(`${entry.unit}: reversed unreviewed range ${token}`);
        if ([...(reviewed.get(range.book) ?? [])].some((page) => page >= from && page <= to)) fail(`${entry.unit}: reviewed/unreviewed overlap ${range.book}/${token.trim()}`);
      }
    }
    for (const row of array(data.items, `${entry.unit}.items`, true)) {
      stats.rows++;
      if (!object(row)) { fail(`${entry.unit}: invalid row`); continue; }
      const label = `${entry.unit}/${row.id ?? '?'}`;
      for (const key of ['id', 'book', 'questionId', 'topic', 'difficultyEvidence', 'action']) if (!text(row[key])) fail(`${label}: missing/invalid ${key}`);
      if (rowIds.has(row.id)) fail(`${label}: duplicate row ID`);
      rowIds.add(row.id);
      if (!declaredSources.has(row.book)) fail(`${label}: source not declared ${row.book}`);
      validPage(row.book, row.pdfPage, label);
      if (!Number.isInteger(row.printedPage) || row.printedPage < 1) fail(`${label}: invalid printedPage`);
      if (!reviewed.get(row.book)?.has(row.pdfPage)) fail(`${label}: source page absent from reviewedPdfPages`);
      if (!statuses.has(row.status)) fail(`${label}: invalid status ${row.status}`);
      if (!difficulties.has(row.difficulty)) fail(`${label}: invalid difficulty ${row.difficulty}`);
      if (!priorities.has(row.priority)) fail(`${label}: invalid priority ${row.priority}`);
      if (row.notes !== undefined && typeof row.notes !== 'string') fail(`${label}: invalid notes`);
      stats.statuses[row.status] = (stats.statuses[row.status] ?? 0) + 1;
      const matches = array(row.matches, `${label}.matches`);
      if (['covered', 'diagram_upgrade', 'solution_upgrade'].includes(row.status) && matches.length === 0) fail(`${label}: status requires an existing scene reference`);
      const matchKeys = new Set();
      for (const match of matches) {
        stats.sceneReferences++;
        if (!object(match) || !text(match.lab) || !text(match.scene) || !text(match.reason)) { fail(`${label}: invalid match`); continue; }
        const key = `${match.lab}#${match.scene}`;
        if (matchKeys.has(key)) fail(`${label}: duplicate match ${key}`);
        matchKeys.add(key);
        if (!scenes.get(match.lab)?.has(match.scene)) fail(`${label}: unknown scene ${key}`);
      }
      const key = sourceKey(row);
      const group = sourceRows.get(key) ?? [];
      group.push({ id: row.id, unit: entry.unit });
      sourceRows.set(key, group);
    }
  }
  const shared = new Map();
  for (const entry of array(index.sharedQuestions, 'index.sharedQuestions')) {
    if (!object(entry) || !text(entry.questionId) || !text(entry.reason)) { fail('index.sharedQuestions: invalid declaration'); continue; }
    validPage(entry.book, entry.pdfPage, 'index.sharedQuestions');
    const ids = array(entry.rowIds, 'index.sharedQuestions.rowIds', true);
    if (ids.length < 2 || ids.some((id) => !text(id)) || new Set(ids).size !== ids.length) fail('index.sharedQuestions: requires distinct row IDs');
    const key = sourceKey(entry);
    if (shared.has(key)) fail(`index.sharedQuestions: duplicate declaration ${key}`);
    shared.set(key, ids);
  }
  for (const [key, rows] of sourceRows) {
    if (rows.length < 2) continue;
    const expected = shared.get(key);
    const actual = rows.map((row) => row.id).sort();
    if (!expected || JSON.stringify([...expected].sort()) !== JSON.stringify(actual)) fail(`unknown duplicate source question ${key}: ${actual.join(', ')}`);
    else if (new Set(rows.map((row) => row.unit)).size !== rows.length) fail(`shared source question repeats within a unit: ${key}`);
    else stats.sharedQuestions++;
  }
  for (const [key, ids] of shared) {
    const actual = sourceRows.get(key)?.map((row) => row.id).sort();
    if (JSON.stringify(actual) !== JSON.stringify([...ids].sort())) fail(`stale shared question declaration ${key}`);
  }
  stats.uniqueSourceQuestions = sourceRows.size;
  finish();
}

function finish() {
  console.log(JSON.stringify({ status: errors.length ? 'FAIL' : 'PASS', scope: 'structure-and-scene-references-only', ...stats, errorCount: errors.length, errors: errors.slice(0, 12), additionalErrors: Math.max(0, errors.length - 12) }));
  process.exitCode = errors.length ? 1 : 0;
}

try { main(); } catch (error) { fail(error.message); finish(); }
