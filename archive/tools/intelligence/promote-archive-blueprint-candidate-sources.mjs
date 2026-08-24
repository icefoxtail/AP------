#!/usr/bin/env node

/**
 * Build a review-only plan that promotes known `기출c.js` candidates to the
 * physical source of legacy logical exam_blueprint keys. It never mutates JS
 * or D1; the generated UPDATE plan is applied separately after review.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DEFAULT_DB_SQL = path.join(ROOT, 'archive/_generated/intelligence/phase2/exam-blueprints-after-mixed-identity-20260824.sql');
const DEFAULT_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-candidate-promotion-v1.json');
const DEFAULT_SQL_OUT = path.join(ROOT, 'archive/_generated/intelligence/phase2/archive-blueprint-candidate-promotion-v1.sql');
const REVISION = 'archive-metadata-v1';
const PROMOTIONS = [
  { archiveFile: 'exams/26_효천고_1학기_중간_고1_기출.js', sourceArchiveFile: 'original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js' },
  { archiveFile: 'exams/25_매산여고_1학기_기말_고1_기출.js', sourceArchiveFile: 'original/high/h1/1final/25_매산여고_1학기_기말_고1_기출c.js' },
  { archiveFile: 'exams/25_순천고_1학기_기말_고1_기출.js', sourceArchiveFile: 'original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js' }
];

function argsOf(argv) { const args = {}; for (let i = 0; i < argv.length; i += 1) { if (!argv[i].startsWith('--')) continue; const key = argv[i].slice(2); args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; } return args; }
function resolve(value, fallback) { const raw = String(value || '').trim(); return raw ? (path.isAbsolute(raw) ? raw : path.resolve(ROOT, raw)) : fallback; }
function scalar(raw) { const v = String(raw || '').trim(); if (/^NULL$/i.test(v)) return null; if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'"); if (/^\d+$/.test(v)) return Number(v); return v; }
function splitValues(raw) { const out = []; let start = 0; let quoted = false; for (let i = 0; i < raw.length; i += 1) { if (raw[i] === "'") { if (quoted && raw[i + 1] === "'") i += 1; else quoted = !quoted; } else if (raw[i] === ',' && !quoted) { out.push(scalar(raw.slice(start, i))); start = i + 1; } } out.push(scalar(raw.slice(start))); return out; }
function rowsFromSql(sql) { const rows = []; const marker = 'INSERT INTO "exam_blueprints"'; let offset = 0; while ((offset = sql.indexOf(marker, offset)) >= 0) { const open = sql.indexOf('(', offset + marker.length); const close = sql.indexOf(')', open); const values = sql.indexOf('VALUES(', close); if (open < 0 || close < 0 || values < 0) break; let end = values + 7; let quoted = false; for (; end < sql.length; end += 1) { if (sql[end] === "'") { if (quoted && sql[end + 1] === "'") end += 1; else quoted = !quoted; } else if (sql[end] === ')' && !quoted) break; } const columns = sql.slice(open + 1, close).split(',').map(c => c.replace(/["`]/g, '').trim()); const vals = splitValues(sql.slice(values + 7, end)); if (columns.length === vals.length) rows.push(Object.fromEntries(columns.map((c, i) => [c, vals[i]]))); offset = end + 1; } return rows; }
function loadBank(file) { const context = { window: {}, console: { log() {}, warn() {}, error() {} } }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file }); return context.window.questionBank || context.window.questions || []; }
function first(q, names) { for (const n of names) { if (q?.[n] !== undefined && q?.[n] !== null && String(q[n]).trim() !== '') return q[n]; } return null; }
function metadata(q) { return { standardUnitKey: first(q, ['standardUnitKey', 'standard_unit_key']), standardUnit: first(q, ['standardUnit', 'standard_unit']), standardCourse: first(q, ['standardCourse', 'standard_course']), subUnitKey: first(q, ['subUnitKey', 'sub_unit_key']), conceptClusterKey: first(q, ['conceptClusterKey', 'concept_cluster_key', 'conceptCluster', 'conceptKey', 'concept_key']), typeKey: first(q, ['problemTypeKey', 'problem_type_key', 'typeKey', 'type_key']), templateKey: first(q, ['templateKey', 'template_key']), difficulty: first(q, ['difficultyBucket', 'difficulty_bucket', 'difficulty', 'level']), tags: Array.isArray(q?.tags) ? q.tags.map(x => String(x || '').trim()).filter(Boolean) : [], metadataRevision: String(first(q, ['metadataRevision', 'metadata_revision']) || REVISION).trim() }; }
function hash(meta) { return crypto.createHash('sha256').update(JSON.stringify({ standardUnitKey: meta.standardUnitKey || null, standardUnit: meta.standardUnit || null, standardCourse: meta.standardCourse || null, subUnitKey: meta.subUnitKey || null, conceptClusterKey: meta.conceptClusterKey || null, typeKey: meta.typeKey || null, templateKey: meta.templateKey || null, difficulty: meta.difficulty || null, tags: meta.tags || [], metadataRevision: meta.metadataRevision || REVISION })).digest('hex'); }
function qno(q) { return Number(String(q?.id ?? '').match(/\d+/)?.[0] || 0); }
function lit(v) { if (v === null || v === undefined || v === '') return 'NULL'; if (typeof v === 'number') return String(v); return `'${String(v).replace(/'/g, "''")}'`; }
function uid(source, ordinal) { return `qid_v1_${crypto.createHash('sha256').update(`${source}#${ordinal}`).digest('hex')}`; }

const args = argsOf(process.argv.slice(2));
if (args.help) { console.log('Usage: node archive/tools/intelligence/promote-archive-blueprint-candidate-sources.mjs [--db-sql <path>] [--out <path>] [--sql-out <path>]'); process.exit(0); }
const dbSql = resolve(args['db-sql'], DEFAULT_DB_SQL); const out = resolve(args.out, DEFAULT_OUT); const sqlOut = resolve(args['sql-out'], DEFAULT_SQL_OUT);
if (!fs.existsSync(dbSql)) throw new Error(`D1 SQL export not found: ${dbSql}`);
const dbRows = rowsFromSql(fs.readFileSync(dbSql, 'utf8')); const statements = []; const audits = []; const errors = [];
for (const promotion of PROMOTIONS) {
  const matching = dbRows.filter(row => row.archive_file === promotion.archiveFile);
  const sourcePath = path.join(ROOT, 'archive', 'exams', promotion.sourceArchiveFile);
  if (!fs.existsSync(sourcePath)) { errors.push(`${promotion.sourceArchiveFile}: source missing`); continue; }
  const bank = loadBank(sourcePath); const byNo = new Map(bank.map((q, i) => [qno(q), { q, ordinal: i + 1 }]));
  const rowAudits = [];
  for (const row of matching) {
    const item = byNo.get(Number(row.question_no));
    if (!item) { errors.push(`${promotion.archiveFile}#${row.question_no}: source question missing`); continue; }
    const meta = metadata(item.q); const expectedHash = hash(meta); const expectedUid = uid(promotion.sourceArchiveFile, item.ordinal);
    const assignments = [['source_archive_file', promotion.sourceArchiveFile], ['source_question_no', qno(item.q)], ['source_question_uid', expectedUid], ['source_question_ordinal', item.ordinal], ['standard_unit_key', meta.standardUnitKey], ['standard_unit', meta.standardUnit], ['standard_course', meta.standardCourse], ['concept_cluster_key', meta.conceptClusterKey], ['sub_unit_key', meta.subUnitKey], ['type_key', meta.typeKey], ['template_key', meta.templateKey], ['difficulty', meta.difficulty], ['metadata_revision', meta.metadataRevision], ['metadata_hash', expectedHash]];
    statements.push(`UPDATE exam_blueprints SET ${assignments.map(([c, v]) => `${c}=${lit(v)}`).join(', ')}, updated_at=CURRENT_TIMESTAMP\nWHERE archive_file=${lit(promotion.archiveFile)} AND question_no=${lit(row.question_no)};`);
    rowAudits.push({ questionNo: Number(row.question_no), sourceQuestionNo: qno(item.q), sourceOrdinal: item.ordinal, sourceQuestionUid: expectedUid, metadataHash: expectedHash });
  }
  audits.push({ ...promotion, candidatePath: path.relative(ROOT, sourcePath).replace(/\\/g, '/'), dbRows: matching.length, sourceQuestions: bank.length, promotedRows: rowAudits.length, rows: rowAudits });
}
const totalRows = audits.reduce((sum, item) => sum + item.promotedRows, 0);
const report = { schemaVersion: 'archive-blueprint-candidate-promotion-v1', generatedAt: new Date().toISOString(), readOnly: true, status: errors.length ? 'CANDIDATE_PROMOTION_REVIEW_REQUIRED' : 'CANDIDATE_PROMOTION_READY', promotions: audits, summary: { candidateFiles: PROMOTIONS.length, promotedRows: totalRows, expectedRows: 72, errors: errors.length }, errors, sqlPlan: { path: path.relative(ROOT, sqlOut).replace(/\\/g, '/'), statements: statements.length, destructive: false, note: 'Review-only UPDATE statements; this tool never executes SQL.' } };
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
if (!errors.length && totalRows === 72 && statements.length === 72) { fs.mkdirSync(path.dirname(sqlOut), { recursive: true }); fs.writeFileSync(sqlOut, `-- Candidate source promotion plan (review only; not executed)\n-- Source report: ${path.relative(ROOT, out).replace(/\\/g, '/')}\n-- Statements: ${statements.length}\n\n${statements.join('\n\n')}\n`, 'utf8'); } else process.exitCode = 3;
console.log(JSON.stringify({ status: report.status, summary: report.summary, report: path.relative(ROOT, out).replace(/\\/g, '/'), sqlPlan: path.relative(ROOT, sqlOut).replace(/\\/g, '/'), statements: statements.length }, null, 2));
