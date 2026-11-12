import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import visual from '../../archive/student-svg-refresh.js';

const sha256 = value => createHash('sha256').update(value).digest('hex');

function readBank(entry, source) {
  const scope = { window: {}, console: { log() {}, warn() {}, error() {} }, URL, URLSearchParams };
  vm.runInNewContext(source, scope, { filename: entry.path, timeout: 3000 });
  const { window } = scope;
  return [window.questions, window.questionBank, window.questionBank?.questions, window.examData?.questions, window.examData,
    scope.questions, scope.questionBank].find(Array.isArray) || [];
}

export function buildStudentSvgRefresh(root, entries) {
  const projections = new Map();
  const assetHashes = new Map();

  function visualFields(question, fields, inputs) {
    const asset = visual.normalizeSvgPath(question[fields[0]]);
    if (!asset) return null;
    const relative = 'archive/' + asset;
    if (!assetHashes.has(relative)) {
      const file = path.join(root, relative);
      if (!fs.existsSync(file)) return null;
      assetHashes.set(relative, sha256(fs.readFileSync(file)));
    }
    inputs.add(relative);
    return [asset, assetHashes.get(relative), ...fields.slice(1).map(field =>
      typeof question[field] === 'string' ? question[field] : null)];
  }

  function add(group, question, identifiers, entry) {
    if (!question || typeof question.content !== 'string') return;
    const assets = new Set();
    const figures = visual.groups.map(fields => visualFields(question, fields, assets));
    if (!figures.some(Boolean)) return;
    if (!projections.has(group)) projections.set(group, { keys: Object.create(null), rows: [], inputs: new Set() });
    const { keys, rows, inputs } = projections.get(group);
    for (const asset of assets) inputs.add(asset);
    inputs.add(entry.path);
    const row = [sha256(visual.identityContent(question)), ...figures];
    const rowIndex = rows.push(row) - 1;
    for (const key of new Set(identifiers)) {
      if (!Object.hasOwn(keys, key)) keys[key] = rowIndex;
      else if (keys[key] !== null && JSON.stringify(rows[keys[key]]) !== JSON.stringify(row)) keys[key] = null;
    }
  }

  for (const entry of entries) {
    if (/^archive\/exams\/.*\.js$/.test(entry.path)) {
      // Most sources do not use SVG. The check also avoids running catalog/loader JS.
      const source = fs.readFileSync(entry.absolute, 'utf8');
      if (!/\.svg\b/i.test(source)) continue;
      const file = entry.path.slice('archive/exams/'.length);
      for (const [index, question] of readBank(entry, source).entries()) {
        const ordinal = `${file}#${index + 1}`;
        const identifiers = [`o:${ordinal}`, `u:qid_v1_${sha256(ordinal)}`];
        for (const number of [question?.id, question?.sourceQuestionNo, question?.source_question_no])
          if (number != null) identifiers.push(`n:${file}#${number}`);
        add(visual.groupForFile(file), question, identifiers, entry);
      }
    } else if (/^archive\/data\/generated-lite-consumer\/v1\/shards\/.*\.json$/.test(entry.path)) {
      const shard = JSON.parse(fs.readFileSync(entry.absolute, 'utf8'));
      if (shard.schemaVersion !== 'ALIVE_GENERATED_CONSUMER_SHARD_V1') continue;
      for (const record of shard.records) {
        if (record.sourceKind === 'generated' && record.generatedUid) add('generated', record.question, [`g:${record.generatedUid}`], entry);
      }
    }
  }
  return [...projections].sort(([a], [b]) => a.localeCompare(b)).map(([group, { keys, rows, inputs }]) => {
    const content = Buffer.from(JSON.stringify({ version: 1, keys, rows }), 'utf8');
    return {
      path: 'archive/' + visual.indexPath(group),
      content, bytes: content.length, sourceBytes: 0,
      reasons: ['SVG fields projected from published question sources'],
      studentSvgInputs: [...inputs].sort(),
    };
  });
}
